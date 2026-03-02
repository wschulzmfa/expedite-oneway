"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CITIES = [
  {
    name: "Copenhagen", lat: 55.68, lng: 12.57, date: "Apr 2026",
    prize: "O-1A visa sponsored", perk: "Meet Danish tech VCs + press feature in Nordic startup media",
  },
  {
    name: "London", lat: 51.51, lng: -0.13, date: "May 2026",
    prize: "O-1A visa sponsored", perk: "Pitch to Tier 1 London VCs + introductions to US-based founders",
  },
  {
    name: "Berlin", lat: 52.52, lng: 13.41, date: "Jun 2026",
    prize: "O-1A visa sponsored", perk: "Feature in major German tech press + investor demo day",
  },
  {
    name: "Prague", lat: 50.08, lng: 14.44, date: "Jul 2026",
    prize: "O-1A visa sponsored", perk: "CEE Startup Awards nomination + judge panel feedback session",
  },
  {
    name: "Paris", lat: 48.85, lng: 2.35, date: "Aug 2026",
    prize: "O-1A visa sponsored", perk: "Station F showcase opportunity + French tech media coverage",
  },
  {
    name: "Warsaw", lat: 52.23, lng: 21.01, date: "Sep 2026",
    prize: "O-1A visa sponsored", perk: "Google for Startups Warsaw mentorship + regional press feature",
  },
  {
    name: "Bucharest", lat: 44.43, lng: 26.1, date: "Oct 2026",
    prize: "O-1A visa sponsored", perk: "How to Web conference spotlight + Romanian tech ecosystem intro",
  },
  {
    name: "Tallinn", lat: 59.44, lng: 24.75, date: "Nov 2026",
    prize: "O-1A visa sponsored", perk: "e-Residency fast-track + Baltic startup media coverage",
  },
  {
    name: "Madrid", lat: 40.42, lng: -3.7, date: "Dec 2026",
    prize: "O-1A visa sponsored", perk: "South Summit pitch opportunity + Spanish LatAm investor intros",
  },
  {
    name: "Lisbon", lat: 38.72, lng: -9.14, date: "Jan 2027",
    prize: "O-1A visa sponsored", perk: "Web Summit alumni network access + Lisbon tech ecosystem tour",
  },
  {
    name: "Stockholm", lat: 59.33, lng: 18.07, date: "Feb 2027",
    prize: "O-1A visa sponsored", perk: "Nordic investor roundtable + Spotify & Klarna mentor sessions",
  },
  {
    name: "Milan", lat: 45.46, lng: 9.19, date: "Mar 2027",
    prize: "O-1A visa sponsored", perk: "Italian tech press feature + Southern Europe VC introductions",
  },
];

const CONNECTIONS: [number, number][] = [
  [0, 10], [0, 2], [0, 1],
  [1, 4], [4, 8], [4, 11],
  [8, 9], [2, 3], [2, 5],
  [3, 11], [5, 6], [10, 7],
];

const LABEL_OFFSETS: Record<string, [number, number]> = {
  Copenhagen: [7, -10], London: [-52, -8], Berlin: [7, -10],
  Prague: [7, 13], Paris: [-40, -8], Warsaw: [7, -10],
  Bucharest: [7, 13], Tallinn: [7, -10], Madrid: [-48, -8],
  Lisbon: [-44, -8], Stockholm: [7, -10], Milan: [-36, 14],
};

interface TooltipState {
  city: typeof CITIES[0];
  x: number;
  y: number;
}

export function EuropeMap() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [13, 52], scale: 680 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#0d1e38", stroke: "#1a3358", strokeWidth: 0.6, outline: "none" },
                  hover: { fill: "#0d1e38", outline: "none" },
                  pressed: { fill: "#0d1e38", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {CONNECTIONS.map(([i, j], idx) => (
          <Line
            key={idx}
            from={[CITIES[i].lng, CITIES[i].lat]}
            to={[CITIES[j].lng, CITIES[j].lat]}
            stroke="rgba(59,130,246,0.3)"
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray="4 3"
          />
        ))}

        {CITIES.map((city) => {
          const [ox, oy] = LABEL_OFFSETS[city.name] ?? [7, -10];
          return (
            <Marker
              key={city.name}
              coordinates={[city.lng, city.lat]}
              onMouseEnter={(e) => {
                const pt = { x: (e as unknown as MouseEvent).clientX, y: (e as unknown as MouseEvent).clientY };
                setTooltip({ city, x: pt.x, y: pt.y });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <g style={{ cursor: "pointer" }}>
                <circle r={14} fill="transparent" />
                <circle r={8} fill="rgba(59,130,246,0.15)" />
                <circle r={4} fill="rgba(59,130,246,0.3)" />
                <circle r={3} fill="rgba(147,197,253,1)" stroke="rgba(59,130,246,0.8)" strokeWidth={1} />
                <text x={ox} y={oy} fontSize={9} fontFamily="system-ui,sans-serif" fontWeight={600} fill="rgba(186,220,255,0.88)">
                  {city.name}
                </text>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <div className="bg-[#0d1628] border border-blue-500/30 rounded-2xl p-4 shadow-2xl w-56">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-white text-sm">{tooltip.city.name}</p>
              <span className="text-[10px] text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                {tooltip.city.date}
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 font-semibold mb-2">🏆 {tooltip.city.prize}</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">{tooltip.city.perk}</p>
          </div>
        </div>
      )}
    </div>
  );
}
