import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">One Way</span>
            <span className="text-xs text-slate-500 border border-white/10 px-2 py-0.5 rounded-full">by Expedite</span>
          </div>
          <p className="text-xs text-slate-500">12 cities. 12 O-1A visas. One direction.</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
          <a href="https://expedite.now" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            About Expedite <ArrowUpRight className="size-3" />
          </a>
          <a href="#cities" className="hover:text-white transition-colors">Cities</a>
          <a href="mailto:william@expedite.now" className="hover:text-white transition-colors">Contact</a>
          <a href="https://twitter.com/expedite_now" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Twitter / X
          </a>
          <a href="https://linkedin.com/company/expedite-now" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            LinkedIn
          </a>
        </div>

        <p className="text-xs text-slate-600">© 2026 Expedite. All rights reserved.</p>
      </div>
    </footer>
  );
}
