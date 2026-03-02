import { Star, FileCheck, Globe, TrendingUp } from "lucide-react";

const PERKS = [
  { icon: FileCheck, label: "Full O-1A Application", desc: "Legal fees, filing, USCIS costs — all covered" },
  { icon: Globe, label: "Expert Case Building", desc: "Expedite's team builds your strongest possible case" },
  { icon: TrendingUp, label: "EB-1A Green Card Path", desc: "O-1A sets you up for permanent residency" },
  { icon: Star, label: "Expedite Network", desc: "Access to 200+ founders who've made the journey" },
];

export function PrizeSection() {
  return (
    <section className="py-24 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#0D1628] via-[#0D1220] to-[#080C14] p-12 lg:p-16 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-500/8 blur-[80px]" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5 text-xs text-yellow-300">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                The Prize
              </div>

              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Win your
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  O-1A Visa.
                </span>
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                Every city. Every month. One winner gets their O-1A visa fully
                sponsored by Expedite — worth over $5,000 in legal fees alone.
                No strings. One way ticket to building in the US.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-sm text-slate-400 mb-1">Total prize value across all cities</p>
                <p className="text-5xl font-bold text-white">$60,000<span className="text-2xl text-slate-500">+</span></p>
                <p className="text-xs text-slate-500 mt-2">12 winners · 12 O-1A applications sponsored</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PERKS.map((perk) => (
                <div
                  key={perk.label}
                  className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3"
                >
                  <div className="size-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <perk.icon className="size-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{perk.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
