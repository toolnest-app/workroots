import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PRESSURE_TYPE_LABELS } from "@/lib/constants";
import { PRESSURE_BADGE_STYLES } from "@/lib/pressure-styles";
import type { PressureType } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PressureFeaturedRole {
  slug: string;
  name: string;
  summary: string;
  pressureType: PressureType;
  pressureSummary: string | null;
}

interface PressureRolesStripProps {
  roles: PressureFeaturedRole[];
  totalCount: number;
}

export function PressureRolesStrip({ roles, totalCount }: PressureRolesStripProps) {
  if (roles.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-4" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">
              Current wave
            </p>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
            Roles under pressure
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            How the AI and automation wave is reshaping work today — curated
            assessments, not predictions.
          </p>
        </div>
        <Link
          href="/jobs?pressure=1"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "shrink-0"
          )}
        >
          View all {totalCount}
          <ArrowRight className="ml-1 size-3.5" />
        </Link>
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
        {roles.map((role) => (
          <Link
            key={role.slug}
            href={`/jobs/${role.slug}`}
            className="group min-w-[260px] snap-start rounded-xl border border-border/80 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md md:min-w-0"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-base font-semibold leading-snug group-hover:text-primary">
                {role.name}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-[10px]",
                  PRESSURE_BADGE_STYLES[role.pressureType]
                )}
              >
                {PRESSURE_TYPE_LABELS[role.pressureType]}
              </Badge>
            </div>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {role.pressureSummary ?? role.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}