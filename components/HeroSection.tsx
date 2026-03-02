"use client";

import { EuropeMap } from "@/components/EuropeMap";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Building2 } from "lucide-react";

interface HeroSectionProps {
  onApply: () => void;
  onSponsor: () => void;
  onQuiz: () => void;
  onAffiliate: () => void;
}

export function HeroSection({ onApply, onSponsor, onQuiz, onAffiliate }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(100,180,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-blue-600/6 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left */}
          <div className="flex-1 space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs text-blue-300">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Europe · 12 Cities · 12 Visas
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono tracking-[0.25em] text-slate-500 uppercase">Hackathon Series</p>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                One Way.{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Your fastest path to the US.
                </span>
              </h1>
            </div>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              <a
                href="https://expedite.now"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-2 hover:text-blue-300 transition-colors"
              >
                Expedite
              </a>{" "}
              is running hackathons across Europe's top tech cities.
              Win your city. We build and file your O-1A visa. We only send the most{" "}
              <span className="text-white font-semibold">Cracked</span>{" "}
              to the US.
            </p>

            <div className="flex flex-col gap-3">
              {/* Participants row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-28 shrink-0">
                  <span className="text-xs font-semibold text-slate-400 tracking-wide">Participants</span>
                  <ArrowRight className="size-3 text-slate-600" />
                </div>
                <Button
                  onClick={onApply}
                  className="h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm"
                >
                  Register Interest
                </Button>
                <Button
                  onClick={onQuiz}
                  variant="outline"
                  className="h-10 px-6 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 hover:text-emerald-200 font-semibold rounded-xl text-sm"
                >
                  <Zap className="mr-1.5 size-3.5" />
                  Do I Qualify?
                </Button>
              </div>

              {/* Companies row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-28 shrink-0">
                  <span className="text-xs font-semibold text-slate-400 tracking-wide">Companies</span>
                  <ArrowRight className="size-3 text-slate-600" />
                </div>
                <Button
                  onClick={onSponsor}
                  variant="outline"
                  className="h-10 px-6 border-white/25 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-sm"
                >
                  Become a Sponsor
                </Button>
                <Button
                  onClick={onAffiliate}
                  variant="outline"
                  className="h-10 px-6 border-white/15 bg-white/3 hover:bg-white/8 text-slate-400 hover:text-slate-300 font-semibold rounded-xl text-sm"
                >
                  <Building2 className="mr-1.5 size-3.5" />
                  Affiliates
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { value: "12", label: "Cities" },
                { value: "$5k–$500k", label: "Prize / City" },
                { value: "Mar '26", label: "Starts" },
                { value: "200+", label: "Per Hackathon" },
              ].map((stat, i, arr) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-8 bg-white/10" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Europe Map */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-[580px] aspect-[4/3] rounded-3xl overflow-hidden">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-blue-600/5 blur-2xl rounded-full pointer-events-none" />
              {/* Map card */}
              <div className="absolute inset-0 rounded-3xl border border-white/8 bg-[#08101e] overflow-hidden">
                <EuropeMap />
              </div>
              <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500 font-mono tracking-widest uppercase pointer-events-none">
                Europe · 2026–2027 · Hover cities to explore
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
