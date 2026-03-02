"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, X } from "lucide-react";

const CITIES = ["London", "Berlin", "Paris", "Amsterdam", "Stockholm", "Barcelona", "Zurich", "Dublin", "Warsaw", "Lisbon", "Dubai", "Singapore", "All Cities"];
const BUDGETS = ["< €5,000", "€5,000 – €15,000", "€15,000 – €50,000", "€50,000+"];

interface SponsorModalProps {
  onClose: () => void;
}

export function SponsorModal({ onClose }: SponsorModalProps) {
  const [form, setForm] = useState({ company: "", contact: "", email: "", budget: "", cities: [] as string[], message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCity = (city: string) => {
    setForm(prev => ({
      ...prev,
      cities: prev.cities.includes(city) ? prev.cities.filter(c => c !== city) : [...prev.cities, city],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const webhook = process.env.NEXT_PUBLIC_ZAPIER_SPONSOR_WEBHOOK;
      if (webhook) {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, cities: form.cities.join(", "), source: "oneway-sponsor", timestamp: new Date().toISOString() }),
        });
      }
      const existing = JSON.parse(localStorage.getItem("oneway_sponsors") || "[]");
      existing.push({ ...form, date: new Date().toISOString(), status: "New" });
      localStorage.setItem("oneway_sponsors", JSON.stringify(existing));
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0D1220] border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <X className="size-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300 mb-3">
                Sponsorship Enquiry
              </div>
              <h3 className="text-xl font-bold text-white">Become a Sponsor</h3>
              <p className="text-sm text-slate-400">Put your brand in front of Europe's top tech founders. Sponsor one city or the whole series.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Company name" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl h-11" />
              <Input placeholder="Your name" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl h-11" />
              <Input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl h-11" />

              <div>
                <p className="text-xs text-slate-500 mb-2">Budget range</p>
                <div className="grid grid-cols-2 gap-2">
                  {BUDGETS.map(b => (
                    <button type="button" key={b} onClick={() => setForm({ ...form, budget: b })} className={`h-10 rounded-xl border text-sm transition-all ${form.budget === b ? "border-blue-500 bg-blue-500/10 text-blue-300" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">Cities of interest</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map(c => (
                    <button type="button" key={c} onClick={() => toggleCity(c)} className={`px-3 py-1.5 rounded-full border text-xs transition-all ${form.cities.includes(c) ? "border-blue-500 bg-blue-500/10 text-blue-300" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea placeholder="Anything else you'd like us to know..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl resize-none" rows={3} />

              <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl">
                {loading ? "Sending..." : "Send Enquiry"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="size-16 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Thanks, {form.contact}!</h3>
            <p className="text-slate-400 text-sm">We'll be in touch with a sponsorship pack for {form.company} within 48 hours.</p>
            <Button onClick={onClose} variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl">Close</Button>
          </div>
        )}
      </div>
    </div>
  );
}
