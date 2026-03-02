"use client";

import { ClipboardList, Swords, Trophy, ArrowRight, Zap } from "lucide-react";

interface HowItWorksProps {
  onQuiz: () => void;
}

export function HowItWorks({ onQuiz }: HowItWorksProps) {
  return (
    <section className="py-24 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold">How It Works</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Three steps from where you are to building in the US.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 01 — interactive */}
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] w-1/2 h-px bg-gradient-to-r from-blue-500/30 to-transparent z-10" />
            <div className="rounded-2xl border border-blue-500/20 bg-[#0D1220] p-8 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <ClipboardList className="size-5 text-blue-400" />
                </div>
                <span className="text-4xl font-bold text-white/5">01</span>
              </div>
              <h3 className="text-xl font-bold text-white">Check You Qualify</h3>
              <p className="text-slate-400 leading-relaxed text-sm flex-1">
                Take our 8-question O-1A quiz. If you score 3+ criteria, you're a strong candidate.
              </p>
              <button
                onClick={onQuiz}
                className="mt-2 flex items-center gap-2 self-start h-9 px-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15 hover:text-emerald-200 transition-all text-sm font-semibold"
              >
                <Zap className="size-3.5" />
                Take the quiz
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Step 02 */}
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] w-1/2 h-px bg-gradient-to-r from-blue-500/30 to-transparent z-10" />
            <div className="rounded-2xl border border-white/8 bg-[#0D1220] p-8 space-y-4 h-full">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Swords className="size-5 text-blue-400" />
                </div>
                <span className="text-4xl font-bold text-white/5">02</span>
              </div>
              <h3 className="text-xl font-bold text-white">Compete</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Join a 2-day hackathon in your city. Build something real. Present to a panel of investors, founders, and Expedite's legal team.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="relative">
            <div className="rounded-2xl border border-white/8 bg-[#0D1220] p-8 space-y-4 h-full">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Trophy className="size-5 text-blue-400" />
                </div>
                <span className="text-4xl font-bold text-white/5">03</span>
              </div>
              <h3 className="text-xl font-bold text-white">Win Your Visa</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                The winner of each city gets their full O-1A application sponsored by Expedite — legal fees, filing, everything. One way to the US.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
