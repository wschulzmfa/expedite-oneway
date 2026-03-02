"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, X } from "lucide-react";

const CITIES = ["London", "Berlin", "Paris", "Amsterdam", "Stockholm", "Barcelona", "Zurich", "Dublin", "Warsaw", "Lisbon", "Dubai", "Singapore"];
const TRACKS = ["AI & ML", "Fintech & Web3", "DeepTech & Infrastructure", "Climate Tech", "HealthTech & Bio", "Developer Tools"];

interface SignupFormProps {
  defaultCity?: string;
  onClose: () => void;
}

export function SignupForm({ defaultCity, onClose }: SignupFormProps) {
  const [form, setForm] = useState({ name: "", email: "", city: defaultCity || "", track: "", linkedin: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const webhook = process.env.NEXT_PUBLIC_ZAPIER_SIGNUP_WEBHOOK;
      if (webhook) {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, source: "oneway-hackathon", timestamp: new Date().toISOString() }),
        });
      }
      // Store locally too
      const existing = JSON.parse(localStorage.getItem("oneway_leads") || "[]");
      existing.push({ ...form, date: new Date().toISOString(), status: "New" });
      localStorage.setItem("oneway_leads", JSON.stringify(existing));
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0D1220] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <X className="size-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6 space-y-1">
              <h3 className="text-xl font-bold text-white">Register Your Interest</h3>
              <p className="text-sm text-slate-400">We'll keep you updated on dates, venues, and how to apply.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl h-11"
              />
              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl h-11"
              />
              <select
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                required
                className="w-full h-11 px-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-blue-500/50"
              >
                <option value="" className="bg-[#0D1220]">Select a city</option>
                {CITIES.map(c => <option key={c} value={c} className="bg-[#0D1220]">{c}</option>)}
              </select>
              <select
                value={form.track}
                onChange={e => setForm({ ...form, track: e.target.value })}
                required
                className="w-full h-11 px-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-blue-500/50"
              >
                <option value="" className="bg-[#0D1220]">Select your track</option>
                {TRACKS.map(t => <option key={t} value={t} className="bg-[#0D1220]">{t}</option>)}
              </select>
              <Input
                type="url"
                placeholder="LinkedIn URL (optional)"
                value={form.linkedin}
                onChange={e => setForm({ ...form, linkedin: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl h-11"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl mt-2"
              >
                {loading ? "Submitting..." : "Register Interest"}
              </Button>
              <p className="text-xs text-slate-600 text-center">No spam. Updates only. Unsubscribe anytime.</p>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <CheckCircle2 className="size-16 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">You're on the list!</h3>
            <p className="text-slate-400 text-sm">We'll send you updates on {form.city} and how to apply when applications open.</p>
            <Button onClick={onClose} variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
