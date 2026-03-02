"use client";

interface NavbarProps {
  onApply: () => void;
}

export function Navbar({ onApply }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-end px-6 lg:px-12 h-14 bg-[#080C14]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-4">
        <a
          href="#cities"
          className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors"
        >
          Cities
        </a>
        <a
          href="#how-it-works"
          className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors"
        >
          How It Works
        </a>
        <button
          onClick={onApply}
          className="h-8 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Register Interest
        </button>
      </div>
    </nav>
  );
}
