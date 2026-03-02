"use client";

interface CategoryFilterProps {
  selected: string;
  onChange: (cat: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Tracks" },
  { id: "ai", label: "AI & ML" },
  { id: "fintech", label: "Fintech" },
  { id: "deeptech", label: "DeepTech" },
  { id: "climate", label: "Climate" },
  { id: "healthtech", label: "HealthTech" },
  { id: "devtools", label: "Dev Tools" },
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
            selected === cat.id
              ? "bg-blue-600 border-blue-500 text-white"
              : "border-white/10 bg-white/5 text-slate-400 hover:border-blue-500/40 hover:text-slate-200"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
