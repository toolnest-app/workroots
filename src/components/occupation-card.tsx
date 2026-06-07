import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRESSURE_TYPE_LABELS, STATUS_LABELS, ERA_LABELS } from "@/lib/constants";
import { PRESSURE_BADGE_STYLES } from "@/lib/pressure-styles";
import { STATUS_STYLES, ERA_STYLES } from "@/lib/status-styles";
import { buildAgeDisplay } from "@/lib/occupation-age";
import type { EraPrimary, OccupationStatus, PressureType } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { CuratedBadge } from "@/components/curated-badge";
import { EnhancedBadge } from "@/components/enhanced-badge";
import type { ContentTier } from "@/db/schema";

interface OccupationCardProps {
  slug: string;
  name: string;
  summary: string;
  status: OccupationStatus;
  eraPrimary: EraPrimary;
  originYear?: number | null;
  originLabel?: string | null;
  contentTier?: ContentTier;
  pressureType?: PressureType | null;
}

export function OccupationCard({
  slug,
  name,
  summary,
  status,
  eraPrimary,
  originYear = null,
  originLabel = null,
  contentTier = "stub",
  pressureType = null,
}: OccupationCardProps) {
  const age = buildAgeDisplay({
    status,
    originYear,
    originYearEnd: null,
    originLabel,
    dateConfidence: "medium",
  });

  const ageSnippet =
    age.ageYears != null
      ? `~${age.ageYears} yrs`
      : age.sinceLabel !== "Origin unknown"
        ? age.sinceLabel
        : null;

  return (
    <Link href={`/jobs/${slug}`} className="group block h-full">
      <Card className="h-full border-border/80 bg-card/80 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/25 group-hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="font-serif text-lg leading-snug group-hover:text-primary">
              {name}
            </CardTitle>
            {ageSnippet && (
              <span className="flex shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                <Clock className="size-3" />
                {ageSnippet}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {contentTier === "curated" && <CuratedBadge />}
            {contentTier === "enhanced" && <EnhancedBadge />}
            <Badge
              variant="outline"
              className={cn("text-[10px]", STATUS_STYLES[status].badge)}
            >
              {STATUS_LABELS[status]}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-[10px]", ERA_STYLES[eraPrimary].badge)}
            >
              {ERA_LABELS[eraPrimary]}
            </Badge>
            {pressureType && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  PRESSURE_BADGE_STYLES[pressureType]
                )}
              >
                {PRESSURE_TYPE_LABELS[pressureType]}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
            {summary}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}