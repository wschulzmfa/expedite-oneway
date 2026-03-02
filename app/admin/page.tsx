"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Building2, Phone, Lock, RefreshCw, ExternalLink } from "lucide-react";

const CITIES_DATA = [
  { name: "London", flag: "🇬🇧", date: "Apr 2026" },
  { name: "Berlin", flag: "🇩🇪", date: "May 2026" },
  { name: "Paris", flag: "🇫🇷", date: "Jun 2026" },
  { name: "Amsterdam", flag: "🇳🇱", date: "Jul 2026" },
  { name: "Stockholm", flag: "🇸🇪", date: "Aug 2026" },
  { name: "Barcelona", flag: "🇪🇸", date: "Sep 2026" },
  { name: "Zurich", flag: "🇨🇭", date: "Oct 2026" },
  { name: "Dublin", flag: "🇮🇪", date: "Nov 2026" },
  { name: "Warsaw", flag: "🇵🇱", date: "Dec 2026" },
  { name: "Lisbon", flag: "🇵🇹", date: "Jan 2027" },
  { name: "Dubai", flag: "🇦🇪", date: "Feb 2027" },
  { name: "Singapore", flag: "🇸🇬", date: "Mar 2027" },
];

type VenueStatus = "tbc" | "searching" | "shortlisted" | "confirmed";
type LeadStatus = "New" | "Contacted" | "Confirmed" | "Declined";
type SponsorStatus = "New" | "In Discussion" | "Confirmed" | "Passed";

interface VenueRow {
  venueName: string;
  venueContact: string;
  venueStatus: VenueStatus;
  catering: string;
  cateringBudget: string;
  notes: string;
}

const DEFAULT_VENUES: Record<string, VenueRow> = Object.fromEntries(
  CITIES_DATA.map(c => [c.name, { venueName: "", venueContact: "", venueStatus: "tbc", catering: "", cateringBudget: "", notes: "" }])
);

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState<"cities" | "leads" | "sponsors" | "contacts">("cities");
  const [venues, setVenues] = useState<Record<string, VenueRow>>(DEFAULT_VENUES);
  const [leads, setLeads] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [newContact, setNewContact] = useState({ name: "", role: "", city: "", email: "", notes: "" });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!authed) return;
    const v = localStorage.getItem("oneway_venues");
    if (v) setVenues(JSON.parse(v));
    const l = localStorage.getItem("oneway_leads");
    if (l) setLeads(JSON.parse(l));
    const s = localStorage.getItem("oneway_sponsors");
    if (s) setSponsors(JSON.parse(s));
    const c = localStorage.getItem("oneway_contacts");
    if (c) setContacts(JSON.parse(c));
  }, [authed]);

  const saveVenues = (updated: Record<string, VenueRow>) => {
    setVenues(updated);
    localStorage.setItem("oneway_venues", JSON.stringify(updated));
  };

  const updateVenue = (city: string, field: keyof VenueRow, value: string) => {
    saveVenues({ ...venues, [city]: { ...venues[city], [field]: value } });
  };

  const updateLeadStatus = (i: number, status: LeadStatus) => {
    const updated = [...leads];
    updated[i].status = status;
    setLeads(updated);
    localStorage.setItem("oneway_leads", JSON.stringify(updated));
  };

  const updateSponsorStatus = (i: number, status: SponsorStatus) => {
    const updated = [...sponsors];
    updated[i].status = status;
    setSponsors(updated);
    localStorage.setItem("oneway_sponsors", JSON.stringify(updated));
  };

  const addContact = () => {
    if (!newContact.name) return;
    const updated = [...contacts, { ...newContact, date: new Date().toISOString() }];
    setContacts(updated);
    localStorage.setItem("oneway_contacts", JSON.stringify(updated));
    setNewContact({ name: "", role: "", city: "", email: "", notes: "" });
  };

  const deleteContact = (i: number) => {
    const updated = contacts.filter((_, idx) => idx !== i);
    setContacts(updated);
    localStorage.setItem("oneway_contacts", JSON.stringify(updated));
  };

  const syncToAttio = async () => {
    setSyncing(true);
    const webhook = process.env.NEXT_PUBLIC_ZAPIER_SIGNUP_WEBHOOK;
    if (webhook) {
      for (const lead of leads) {
        try {
          await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
        } catch {}
      }
    }
    setSyncing(false);
    alert("Synced to Attio via Zapier!");
  };

  const VENUE_STATUSES: VenueStatus[] = ["tbc", "searching", "shortlisted", "confirmed"];
  const statusColor: Record<VenueStatus, string> = {
    tbc: "text-slate-500 border-white/10",
    searching: "text-yellow-400 border-yellow-500/20",
    shortlisted: "text-blue-400 border-blue-500/20",
    confirmed: "text-emerald-400 border-emerald-500/20",
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <div className="w-full max-w-sm bg-[#0D1220] border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-blue-400" />
            <h1 className="text-lg font-bold text-white">Admin Access</h1>
          </div>
          <Input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && pw === "expedite2026" && setAuthed(true)}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl h-11"
          />
          <Button
            onClick={() => pw === "expedite2026" && setAuthed(true)}
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 rounded-xl"
          >
            Enter
          </Button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "cities" as const, label: "Cities & Venues", icon: MapPin },
    { id: "leads" as const, label: `Leads (${leads.length})`, icon: Users },
    { id: "sponsors" as const, label: `Sponsors (${sponsors.length})`, icon: Building2 },
    { id: "contacts" as const, label: "Contacts", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">One Way</span>
          <span className="text-xs text-slate-500 border border-white/10 px-2 py-0.5 rounded-full">Admin CRM</span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={syncToAttio} disabled={syncing} size="sm" variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 rounded-lg gap-2 text-xs">
            <RefreshCw className={`size-3 ${syncing ? "animate-spin" : ""}`} />
            Sync to Attio
          </Button>
          <a href="/" className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors">
            <ExternalLink className="size-3" /> Site
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 px-6 flex gap-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-all ${
              tab === t.id ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <t.icon className="size-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* CITIES TAB */}
        {tab === "cities" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-4">Track venue and catering progress for each city. Data saved locally.</p>
            <div className="overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-xs text-slate-500">
                    <th className="text-left p-4 font-medium">City</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Venue Name</th>
                    <th className="text-left p-4 font-medium">Venue Contact</th>
                    <th className="text-left p-4 font-medium">Catering</th>
                    <th className="text-left p-4 font-medium">Budget</th>
                    <th className="text-left p-4 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {CITIES_DATA.map((city, i) => {
                    const v = venues[city.name] || DEFAULT_VENUES[city.name];
                    return (
                      <tr key={city.name} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span>{city.flag}</span>
                            <div>
                              <p className="font-medium text-white">{city.name}</p>
                              <p className="text-xs text-slate-500">{city.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={v.venueStatus}
                            onChange={e => updateVenue(city.name, "venueStatus", e.target.value)}
                            className={`text-xs rounded-lg border px-2 py-1 bg-transparent focus:outline-none ${statusColor[v.venueStatus]}`}
                          >
                            {VENUE_STATUSES.map(s => <option key={s} value={s} className="bg-[#0D1220] text-white">{s}</option>)}
                          </select>
                        </td>
                        {(["venueName", "venueContact", "catering", "cateringBudget", "notes"] as const).map(field => (
                          <td key={field} className="p-4">
                            <input
                              value={v[field]}
                              onChange={e => updateVenue(city.name, field, e.target.value)}
                              placeholder="—"
                              className="w-full bg-transparent text-slate-300 placeholder:text-slate-700 text-xs focus:outline-none border-b border-transparent focus:border-white/20 pb-0.5 min-w-[100px]"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {tab === "leads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{leads.length} interest registrations</p>
              <Button onClick={syncToAttio} disabled={syncing} size="sm" className="bg-blue-600 hover:bg-blue-500 rounded-lg text-xs gap-2">
                <RefreshCw className={`size-3 ${syncing ? "animate-spin" : ""}`} />
                Sync All to Attio
              </Button>
            </div>
            {leads.length === 0 ? (
              <div className="text-center py-20 text-slate-600">No leads yet. They'll appear here when people register.</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-xs text-slate-500">
                      <th className="text-left p-4 font-medium">Name</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">City</th>
                      <th className="text-left p-4 font-medium">Track</th>
                      <th className="text-left p-4 font-medium">LinkedIn</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                        <td className="p-4 font-medium text-white">{lead.name}</td>
                        <td className="p-4 text-slate-400">{lead.email}</td>
                        <td className="p-4 text-slate-400">{lead.city}</td>
                        <td className="p-4 text-slate-400 text-xs">{lead.track}</td>
                        <td className="p-4">
                          {lead.linkedin ? (
                            <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                              View <ExternalLink className="size-3" />
                            </a>
                          ) : <span className="text-slate-700">—</span>}
                        </td>
                        <td className="p-4 text-slate-500 text-xs">{new Date(lead.date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <select
                            value={lead.status || "New"}
                            onChange={e => updateLeadStatus(i, e.target.value as LeadStatus)}
                            className="text-xs rounded-lg border border-white/10 px-2 py-1 bg-transparent text-slate-300 focus:outline-none"
                          >
                            {(["New", "Contacted", "Confirmed", "Declined"] as LeadStatus[]).map(s => (
                              <option key={s} value={s} className="bg-[#0D1220]">{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SPONSORS TAB */}
        {tab === "sponsors" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">{sponsors.length} sponsor enquiries</p>
            {sponsors.length === 0 ? (
              <div className="text-center py-20 text-slate-600">No sponsor enquiries yet.</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-xs text-slate-500">
                      <th className="text-left p-4 font-medium">Company</th>
                      <th className="text-left p-4 font-medium">Contact</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Budget</th>
                      <th className="text-left p-4 font-medium">Cities</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsors.map((s, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                        <td className="p-4 font-medium text-white">{s.company}</td>
                        <td className="p-4 text-slate-400">{s.contact}</td>
                        <td className="p-4 text-slate-400 text-xs">{s.email}</td>
                        <td className="p-4 text-slate-400 text-xs">{s.budget}</td>
                        <td className="p-4 text-slate-400 text-xs max-w-[150px] truncate">{Array.isArray(s.cities) ? s.cities.join(", ") : s.cities}</td>
                        <td className="p-4 text-slate-500 text-xs">{new Date(s.date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <select
                            value={s.status || "New"}
                            onChange={e => updateSponsorStatus(i, e.target.value as SponsorStatus)}
                            className="text-xs rounded-lg border border-white/10 px-2 py-1 bg-transparent text-slate-300 focus:outline-none"
                          >
                            {(["New", "In Discussion", "Confirmed", "Passed"] as SponsorStatus[]).map(st => (
                              <option key={st} value={st} className="bg-[#0D1220]">{st}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CONTACTS TAB */}
        {tab === "contacts" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-[#0D1220] p-5 grid grid-cols-2 md:grid-cols-5 gap-3">
              {(["name", "role", "city", "email", "notes"] as const).map(f => (
                <input
                  key={f}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={newContact[f]}
                  onChange={e => setNewContact({ ...newContact, [f]: e.target.value })}
                  className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                />
              ))}
              <Button onClick={addContact} className="bg-blue-600 hover:bg-blue-500 rounded-lg h-9 text-sm col-span-2 md:col-span-1">
                Add Contact
              </Button>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-16 text-slate-600">Add venue coordinators, caterers, and city partners here.</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-xs text-slate-500">
                      <th className="text-left p-4 font-medium">Name</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">City</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Notes</th>
                      <th className="p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                        <td className="p-4 font-medium text-white">{c.name}</td>
                        <td className="p-4 text-slate-400">{c.role}</td>
                        <td className="p-4 text-slate-400">{c.city}</td>
                        <td className="p-4 text-slate-400 text-xs">{c.email}</td>
                        <td className="p-4 text-slate-500 text-xs">{c.notes}</td>
                        <td className="p-4">
                          <button onClick={() => deleteContact(i)} className="text-slate-700 hover:text-red-400 text-xs transition-colors">remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
