import type { PressureType } from "@/db/schema";

export const PRESSURE_BADGE_STYLES: Record<PressureType, string> = {
  augmented: "border-violet-300/70 bg-violet-50 text-violet-900",
  displaced_tasks: "border-rose-300/70 bg-rose-50 text-rose-900",
  transformed: "border-amber-300/70 bg-amber-50 text-amber-900",
  resilient: "border-emerald-300/70 bg-emerald-50 text-emerald-900",
  emerging: "border-sky-300/70 bg-sky-50 text-sky-900",
};