"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
  arcColor?: string;
  markerColor?: string;
  gridColor?: string;
  autoRotateSpeed?: number;
  connections?: { from: [number, number]; to: [number, number] }[];
  markers?: { lat: number; lng: number; label?: string }[];
}

const DEFAULT_MARKERS = [
  { lat: 55.68, lng: 12.57, label: "Copenhagen" },
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 52.52, lng: 13.41, label: "Berlin" },
  { lat: 50.08, lng: 14.44, label: "Prague" },
  { lat: 48.85, lng: 2.35, label: "Paris" },
  { lat: 52.23, lng: 21.01, label: "Warsaw" },
  { lat: 44.43, lng: 26.1, label: "Bucharest" },
  { lat: 59.44, lng: 24.75, label: "Tallinn" },
  { lat: 40.42, lng: -3.7, label: "Madrid" },
  { lat: 38.72, lng: -9.14, label: "Lisbon" },
  { lat: 59.33, lng: 18.07, label: "Stockholm" },
  { lat: 45.46, lng: 9.19, label: "Milan" },
];

const DEFAULT_CONNECTIONS: { from: [number, number]; to: [number, number] }[] = [
  { from: [55.68, 12.57], to: [59.33, 18.07] },
  { from: [55.68, 12.57], to: [52.52, 13.41] },
  { from: [55.68, 12.57], to: [51.51, -0.13] },
  { from: [51.51, -0.13], to: [48.85, 2.35] },
  { from: [48.85, 2.35], to: [40.42, -3.7] },
  { from: [48.85, 2.35], to: [45.46, 9.19] },
  { from: [40.42, -3.7], to: [38.72, -9.14] },
  { from: [52.52, 13.41], to: [50.08, 14.44] },
  { from: [52.52, 13.41], to: [52.23, 21.01] },
  { from: [50.08, 14.44], to: [45.46, 9.19] },
  { from: [52.23, 21.01], to: [44.43, 26.1] },
  { from: [59.33, 18.07], to: [59.44, 24.75] },
];

function latLngToXYZ(lat: number, lng: number, r: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

function rotateY(x: number, y: number, z: number, a: number): [number, number, number] {
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}

function rotateX(x: number, y: number, z: number, a: number): [number, number, number] {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}

function project(x: number, y: number, z: number, cx: number, cy: number, fov: number): [number, number] {
  const s = fov / (fov + z);
  return [x * s + cx, y * s + cy];
}

export function Component({
  className,
  size = 500,
  arcColor = "rgba(99, 160, 255, 0.6)",
  markerColor = "rgba(147, 197, 253, 1)",
  gridColor = "rgba(59, 130, 246, 0.13)",
  autoRotateSpeed = 0.0004,
  connections = DEFAULT_CONNECTIONS,
  markers = DEFAULT_MARKERS,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // rotY=1.31 centers Europe (lng≈15°E) facing viewer; rotX=-0.25 tilts to show Northern Europe
  const rotYRef = useRef(1.31);
  const rotXRef = useRef(-0.25);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.42;
    const fov = 900;

    if (!dragRef.current.active) rotYRef.current += autoRotateSpeed;
    timeRef.current += 0.014;
    const time = timeRef.current;
    const ry = rotYRef.current;
    const rx = rotXRef.current;

    ctx.clearRect(0, 0, w, h);

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.5);
    glow.addColorStop(0, "rgba(59,130,246,0.05)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Sphere rim
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(59,130,246,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Clip to sphere interior
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
    ctx.clip();

    // Draw latitude lines (every 30°)
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 360; i += 2) {
        const lng = i - 180;
        let [x, y, z] = latLngToXYZ(lat, lng, radius);
        [x, y, z] = rotateX(x, y, z, rx);
        [x, y, z] = rotateY(x, y, z, ry);
        if (z > 0) { started = false; continue; }
        const [sx, sy] = project(x, y, z, cx, cy, fov);
        if (!started) { ctx.moveTo(sx, sy); started = true; } else { ctx.lineTo(sx, sy); }
      }
      ctx.strokeStyle = lat === 0 ? "rgba(59,130,246,0.22)" : gridColor;
      ctx.lineWidth = lat === 0 ? 0.8 : 0.5;
      ctx.stroke();
    }

    // Draw longitude lines (every 30°)
    for (let lng = -180; lng < 180; lng += 30) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 180; i += 2) {
        const lat = i - 90;
        let [x, y, z] = latLngToXYZ(lat, lng, radius);
        [x, y, z] = rotateX(x, y, z, rx);
        [x, y, z] = rotateY(x, y, z, ry);
        if (z > 0) { started = false; continue; }
        const [sx, sy] = project(x, y, z, cx, cy, fov);
        if (!started) { ctx.moveTo(sx, sy); started = true; } else { ctx.lineTo(sx, sy); }
      }
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.restore();

    // Draw arcs between cities
    for (const conn of connections) {
      const [lat1, lng1] = conn.from;
      const [lat2, lng2] = conn.to;
      let [x1, y1, z1] = latLngToXYZ(lat1, lng1, radius);
      let [x2, y2, z2] = latLngToXYZ(lat2, lng2, radius);
      [x1, y1, z1] = rotateX(x1, y1, z1, rx); [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx); [x2, y2, z2] = rotateY(x2, y2, z2, ry);
      if (z1 > radius * 0.25 || z2 > radius * 0.25) continue;
      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, mz = (z1 + z2) / 2;
      const ml = Math.sqrt(mx * mx + my * my + mz * mz);
      const elev = radius * 1.15;
      const [scx, scy] = project((mx / ml) * elev, (my / ml) * elev, (mz / ml) * elev, cx, cy, fov);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Traveling dot
      const t = (Math.sin(time * 1.1 + lat1 * 0.2) + 1) / 2;
      const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
      const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;
      ctx.beginPath();
      ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();
    }

    // Draw city markers
    for (const marker of markers) {
      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > radius * 0.2) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const pulse = Math.sin(time * 1.8 + marker.lat * 0.3) * 0.5 + 0.5;

      // Glow halo
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 14);
      g.addColorStop(0, `rgba(59,130,246,${0.25 + pulse * 0.15})`);
      g.addColorStop(1, "rgba(59,130,246,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(sx, sy, 14, 0, Math.PI * 2);
      ctx.fill();

      // Pulse ring
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5 + pulse * 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(147,197,253,${0.25 + pulse * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();

      // Label
      if (marker.label) {
        ctx.font = "600 10px system-ui, sans-serif";
        ctx.fillStyle = "rgba(186,220,255,0.85)";
        ctx.fillText(marker.label, sx + 8, sy + 4);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [arcColor, markerColor, gridColor, autoRotateSpeed, connections, markers]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotYRef.current, startRotX: rotXRef.current };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    rotYRef.current = dragRef.current.startRotY + (e.clientX - dragRef.current.startX) * 0.005;
    rotXRef.current = Math.max(-1, Math.min(1, dragRef.current.startRotX + (e.clientY - dragRef.current.startY) * 0.005));
  }, []);
  const onPointerUp = useCallback(() => { dragRef.current.active = false; }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("cursor-grab active:cursor-grabbing", className)}
      style={{ width: size, height: size }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}
