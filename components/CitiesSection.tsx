"use client";

import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface City {
  name: string;
  country: string;
  flag: string;
  date: string;
  status: "confirmed" | "tbc";
  venue?: string;
}

const CITIES: City[] = [
  { name: "Copenhagen", country: "Denmark", flag: "🇩🇰", date: "Apr 2026", status: "tbc" },
  { name: "London", country: "United Kingdom", flag: "🇬🇧", date: "May 2026", status: "tbc" },
  { name: "Berlin", country: "Germany", flag: "🇩🇪", date: "Jun 2026", status: "tbc" },
  { name: "Prague", country: "Czech Republic", flag: "🇨🇿", date: "Jul 2026", status: "tbc" },
  { name: "Paris", country: "France", flag: "🇫🇷", date: "Aug 2026", status: "tbc" },
  { name: "Warsaw", country: "Poland", flag: "🇵🇱", date: "Sep 2026", status: "tbc" },
  { name: "Bucharest", country: "Romania", flag: "🇷🇴", date: "Oct 2026", status: "tbc" },
  { name: "Tallinn", country: "Estonia", flag: "🇪🇪", date: "Nov 2026", status: "tbc" },
  { name: "Madrid", country: "Spain", flag: "🇪🇸", date: "Dec 2026", status: "tbc" },
  { name: "Lisbon", country: "Portugal", flag: "🇵🇹", date: "Jan 2027", status: "tbc" },
  { name: "Stockholm", country: "Sweden", flag: "🇸🇪", date: "Feb 2027", status: "tbc" },
  { name: "Milan", country: "Italy", flag: "🇮🇹", date: "Mar 2027", status: "tbc" },
];

interface CitiesSectionProps {
  onRegister: (city: string) => void;
}

export function CitiesSection({ onRegister }: CitiesSectionProps) {
  return (
    <section id="cities" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-14 space-y-4">
        <h2 className="text-3xl lg:text-5xl font-bold">
          12 Cities.{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            12 Visas.
          </span>
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          One hackathon per month across Europe. One winner per city gets their
          O-1A application fully built and filed by Expedite — at no cost.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CITIES.map((city, i) => (
          <div
            key={city.name}
            className="group relative rounded-2xl border border-white/8 bg-[#0D1220] p-6 hover:border-blue-500/30 hover:bg-[#0F1628] transition-all duration-300 flex flex-col gap-4"
          >
            <div className="absolute top-4 right-4 text-xs font-mono text-slate-700">
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className="flex items-start gap-3">
              <span className="text-3xl">{city.flag}</span>
              <div>
                <h3 className="font-bold text-lg text-white">{city.name}</h3>
                <p className="text-xs text-slate-500">{city.country}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs border-white/10 text-slate-400 gap-1">
                <Calendar className="size-3" />
                {city.date}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs gap-1 ${
                  city.status === "confirmed"
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                    : "border-white/10 text-slate-600"
                }`}
              >
                {city.status === "confirmed" ? "✓ Venue Confirmed" : "Venue TBC"}
              </Badge>
            </div>

            {city.venue && city.status === "confirmed" && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="size-3" />
                {city.venue}
              </div>
            )}

            <div className="mt-auto pt-2 flex items-center justify-end">
              <button
                onClick={() => onRegister(city.name)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-300 transition-colors"
              >
                Register interest
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
