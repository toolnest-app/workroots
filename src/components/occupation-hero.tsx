import { AgeBadge } from "@/components/age-badge";
import { CuratedBadge } from "@/components/curated-badge";
import { EnhancedBadge } from "@/components/enhanced-badge";
import { Badge } from "@/components/ui/badge";
import { ERA_LABELS, STATUS_LABELS } from "@/lib/constants";
import { STATUS_STYLES, ERA_STYLES } from "@/lib/status-styles";
import type { DateConfidence } from "@/lib/occupation-age";
import type { ContentTier, EraPrimary, OccupationStatus } from "@/db/schema";
import { cn } from "@/lib/utils";

interface OccupationHeroProps {
  name: string;
  summary: string;
  aliases: string[];
  status: OccupationStatus;
  eraPrimary: EraPrimary;
  category: string;
  contentTier: ContentTier;
  originYear: number | null;
  originYearEnd: number | null;
  originLabel: string | null;
  dateConfidence: DateConfidence;
}

export function OccupationHero({
  name,
  summary,
  aliases,
  status,
  eraPrimary,
  category,
  contentTier,
  originYear,
  originYearEnd,
  originLabel,
  dateConfidence,
}: OccupationHeroProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-border/80 bg-card">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 80% at 0% 0%, oklch(0.75 0.08 75 / 0.35), transparent),
            radial-gradient(ellipse 50% 60% at 100% 100%, oklch(0.55 0.06 200 / 0.2), transparent)
          `,
        }}
      />
      <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {contentTier === "curated" && <CuratedBadge />}
            {contentTier === "enhanced" && <EnhancedBadge />}
            <Badge
              variant="outline"
              className={cn(STATUS_STYLES[status].badge)}
            >
              {STATUS_LABELS[status]}
            </Badge>
            <Badge
              variant="outline"
              className={cn(ERA_STYLES[eraPrimary].badge)}
            >
              {ERA_LABELS[eraPrimary]}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {category}
            </Badge>
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            {name}
          </h1>
          {aliases.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Also known as:{" "}
              <span className="text-foreground">{aliases.join(", ")}</span>
            </p>
          )}
          <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">
            {summary}
          </p>
        </div>
        <AgeBadge
          status={status}
          originYear={originYear}
          originYearEnd={originYearEnd}
          originLabel={originLabel}
          dateConfidence={dateConfidence}
        />
      </div>
    </header>
  );
}