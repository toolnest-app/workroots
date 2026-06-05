import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: number;
  year: number | null;
  yearEnd?: number | null;
  label: string;
  description: string;
}

export function OccupationTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null;

  return (
    <ol className="relative space-y-0 border-l-2 border-primary/20 pl-6">
      {events.map((ev, i) => (
        <li key={ev.id} className="relative pb-8 last:pb-0">
          <span
            className={cn(
              "absolute -left-[calc(0.75rem+1px)] top-1.5 size-3 rounded-full border-2 border-background bg-primary",
              i === 0 && "ring-4 ring-primary/20"
            )}
          />
          <time className="text-xs font-semibold tabular-nums text-primary">
            {ev.year != null ? ev.year : "—"}
            {ev.yearEnd != null ? ` – ${ev.yearEnd}` : ""}
          </time>
          <p className="mt-0.5 font-medium text-foreground">{ev.label}</p>
          {ev.description && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {ev.description}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}