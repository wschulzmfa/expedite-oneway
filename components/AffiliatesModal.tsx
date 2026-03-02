"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Building2, ChefHat, Sparkles, CheckCircle } from "lucide-react";

interface AffiliatesModalProps {
  onClose: () => void;
}

const AFFILIATE_TYPES = [
  { id: "venue", label: "Venue / Office Space", icon: Building2, description: "Coworking spaces, offices, conference centres" },
  { id: "catering", label: "Catering & F&B", icon: ChefHat, description: "Food, drinks, snacks for 200+ attendees" },
  { id: "cleaning", label: "Cleaning & Facilities", icon: Sparkles, description: "Pre/post event cleaning, logistics support" },
];

export function AffiliatesModal({ onClose }: AffiliatesModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    cities: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const webhook = process.env.NEXT_PUBLIC_ZAPIER_SPONSOR_WEBHOOK;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, type: selectedType, tag: "Affiliate" }),
        });
      } catch {}
    }
    const existing = JSON.parse(localStorage.getItem("affiliates") || "[]");
    existing.push({ ...form, type: selectedType, date: new Date().toISOString() });
    localStorage.setItem("affiliates", JSON.stringify(existing));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0D1220] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle className="size-12 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Thanks for reaching out!</h3>
            <p className="text-slate-400 text-sm">
              We'll be in touch as we confirm venues for each city.
            </p>
            <Button onClick={onClose} className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-300 mb-3">
                <Building2 className="size-3" />
                Affiliate Partner
              </div>
              <h2 className="text-2xl font-bold text-white">Become an Affiliate</h2>
              <p className="text-slate-400 text-sm mt-1">
                Provide venues, catering or facilities for our hackathons across 12 European cities.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {AFFILIATE_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedType(t.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                      selectedType === t.id
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                        : "border-white/8 bg-white/2 text-slate-400 hover:border-white/15"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="text-[11px] font-medium leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Company name"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl"
                />
                <Input
                  placeholder="Your name"
                  required
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl"
                />
              </div>
              <Input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl"
              />
              <Input
                placeholder="Cities you can cover (e.g. London, Berlin, Paris)"
                value={form.cities}
                onChange={(e) => setForm({ ...form, cities: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl"
              />
              <Textarea
                placeholder="Tell us about your offering — capacity, pricing, availability..."
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl resize-none"
              />
              <Button
                type="submit"
                disabled={loading || !selectedType}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
