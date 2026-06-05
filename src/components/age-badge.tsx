import { buildAgeDisplay } from "@/lib/occupation-age";
import type { DateConfidence, OccupationStatus } from "@/lib/occupation-age";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react";

interface AgeBadgeProps {
  status: OccupationStatus;
  originYear: number | null;
  originYearEnd: number | null;
  originLabel: string | null;
  dateConfidence: DateConfidence;
}

const confidenceStyles: Record<DateConfidence, string> = {
  high: "border-emerald-300/80 bg-emerald-50 text-emerald-900",
  medium: "border-amber-300/80 bg-amber-50 text-amber-950",
  low: "border-rose-300/80 bg-rose-50 text-rose-900",
};

export function AgeBadge(props: AgeBadgeProps) {
  const display = buildAgeDisplay(props);
  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CalendarClock className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Occupation age
          </p>
          <p className="mt-1 font-serif text-xl font-semibold leading-snug text-foreground">
            {display.headline}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-[10px]", confidenceStyles[display.confidence])}
            >
              {display.confidence} confidence
            </Badge>
            <span className="text-xs text-muted-foreground">
              {display.sinceLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}