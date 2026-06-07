import { Badge } from "@/components/ui/badge";
import {
  CONFIDENCE_LABELS,
  PRESSURE_TYPE_DESCRIPTIONS,
  PRESSURE_TYPE_LABELS,
} from "@/lib/constants";
import type { DateConfidence } from "@/lib/occupation-age";
import type { PressureType } from "@/db/schema";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const PRESSURE_STYLES: Record<PressureType, string> = {
  augmented: "border-violet-300/80 bg-violet-50/90 text-violet-950",
  displaced_tasks: "border-rose-300/80 bg-rose-50/90 text-rose-950",
  transformed: "border-amber-300/80 bg-amber-50/90 text-amber-950",
  resilient: "border-emerald-300/80 bg-emerald-50/90 text-emerald-950",
  emerging: "border-sky-300/80 bg-sky-50/90 text-sky-950",
};

interface PressureSource {
  id: number;
  title: string;
  url: string | null;
  note: string;
}

interface CurrentPressuresProps {
  occupationSlug: string;
  pressureType: PressureType;
  pressureConfidence: DateConfidence;
  summary: string;
  sources?: PressureSource[];
}

export function CurrentPressures({
  occupationSlug,
  pressureType,
  pressureConfidence,
  summary,
  sources = [],
}: CurrentPressuresProps) {
  const pressureSources = sources.filter(
    (source) => source.note === "Current pressures citation"
  );

  return (
    <section
      className={cn(
        "rounded-xl border p-6",
        PRESSURE_STYLES[pressureType]
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="size-4 opacity-70" aria-hidden />
        <h2 className="font-serif text-xl font-semibold tracking-tight">
          Automation & AI effects
        </h2>
        <Badge variant="outline" className="border-current/20 bg-white/50">
          {PRESSURE_TYPE_LABELS[pressureType]}
        </Badge>
        <Badge variant="outline" className="border-current/20 bg-white/50 text-xs">
          {CONFIDENCE_LABELS[pressureConfidence]}
        </Badge>
      </div>

      <p className="mt-1 text-xs opacity-75">
        {PRESSURE_TYPE_DESCRIPTIONS[pressureType]}
      </p>

      <p className="mt-4 text-sm leading-relaxed md:text-base">{summary}</p>

      {pressureSources.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-current/10 pt-4 text-sm">
          {pressureSources.map((source) => (
            <li key={source.id}>
              {source.url ? (
                <a
                  href={source.url}
                  className="font-medium underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.title}
                </a>
              ) : (
                <span className="font-medium">{source.title}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-current/10 pt-4">
        <p className="text-xs opacity-70">
          Pilot notes (2024–2026). We separate long-running automation from
          recent generative-AI changes where possible — not predictive scores.
        </p>
        <Link
          href={`/suggest?role=${occupationSlug}&type=pressure`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "shrink-0 border-current/20 bg-white/50 text-xs"
          )}
        >
          Suggest an update
        </Link>
      </div>
    </section>
  );
}