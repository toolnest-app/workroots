import type { EraPrimary, OccupationStatus } from "@/db/schema";

export const STATUS_STYLES: Record<
  OccupationStatus,
  { badge: string; dot: string }
> = {
  active: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-900",
    dot: "bg-emerald-500",
  },
  declining: {
    badge: "border-amber-200 bg-amber-50 text-amber-900",
    dot: "bg-amber-500",
  },
  extinct: {
    badge: "border-stone-300 bg-stone-100 text-stone-600",
    dot: "bg-stone-400",
  },
  regional: {
    badge: "border-sky-200 bg-sky-50 text-sky-900",
    dot: "bg-sky-500",
  },
};

export const ERA_STYLES: Record<EraPrimary, { badge: string; bar: string }> = {
  ancient: {
    badge: "border-amber-300/60 bg-amber-100/80 text-amber-950",
    bar: "from-amber-800 to-amber-600",
  },
  medieval: {
    badge: "border-orange-300/60 bg-orange-100/80 text-orange-950",
    bar: "from-orange-800 to-orange-600",
  },
  early_modern: {
    badge: "border-yellow-300/60 bg-yellow-100/80 text-yellow-950",
    bar: "from-yellow-800 to-yellow-600",
  },
  industrial: {
    badge: "border-stone-400/60 bg-stone-200/80 text-stone-800",
    bar: "from-stone-700 to-stone-500",
  },
  modern: {
    badge: "border-teal-300/60 bg-teal-50 text-teal-950",
    bar: "from-teal-800 to-teal-600",
  },
  contemporary: {
    badge: "border-violet-300/60 bg-violet-50 text-violet-950",
    bar: "from-violet-800 to-violet-600",
  },
};

export const CATEGORY_ICONS: Record<string, string> = {
  craft: "Hammer",
  clerical: "FileText",
  technology: "Cpu",
  communication: "Radio",
  medicine: "Stethoscope",
  food: "Wheat",
  military: "Shield",
  general: "Briefcase",
};