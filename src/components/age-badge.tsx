import { buildAgeDisplay } from "@/lib/occupation-age";
import type { DateConfidence, OccupationStatus } from "@/lib/occupation-age";
import { Badge } from "@/components/ui/badge";

interface AgeBadgeProps {
  status: OccupationStatus;
  originYear: number | null;
  originYearEnd: number | null;
  originLabel: string | null;
  dateConfidence: DateConfidence;
}

const confidenceColors: Record<DateConfidence, string> = {
  high: "border-emerald-300 bg-emerald-50 text-emerald-800",
  medium: "border-amber-300 bg-amber-50 text-amber-900",
  low: "border-rose-300 bg-rose-50 text-rose-900",
};

export function AgeBadge(props: AgeBadgeProps) {
  const display = buildAgeDisplay(props);
  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
      <p className="font-serif text-lg text-stone-900">{display.headline}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge className={confidenceColors[display.confidence]}>
          Confidence: {display.confidence}
        </Badge>
        <span className="text-sm text-stone-600">{display.sinceLabel}</span>
      </div>
    </div>
  );
}