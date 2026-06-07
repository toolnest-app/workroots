"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ERA_LABELS, STATUS_LABELS, ERA_ORDER } from "@/lib/constants";
import { ERA_STYLES } from "@/lib/status-styles";
import type { EraPrimary, OccupationStatus } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface JobFiltersProps {
  total: number;
  pressureCount?: number;
  current: {
    q?: string;
    status?: OccupationStatus;
    era?: EraPrimary;
    pressure?: boolean;
  };
}

function buildHref(
  current: JobFiltersProps["current"],
  patch: Partial<JobFiltersProps["current"]>
) {
  const params = new URLSearchParams();
  const merged = { ...current, ...patch };
  if (merged.q) params.set("q", merged.q);
  if (merged.status) params.set("status", merged.status);
  if (merged.era) params.set("era", merged.era);
  if (merged.pressure) params.set("pressure", "1");
  const qs = params.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

export function JobFilters({ total, pressureCount, current }: JobFiltersProps) {
  const router = useRouter();
  const hasFilters = Boolean(
    current.status || current.era || current.q || current.pressure
  );

  return (
    <div className="space-y-6 rounded-xl border border-border/80 bg-card p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Archive
        </p>
        <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">
          {total.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">roles match filters</p>
      </div>

      <Separator />

      {pressureCount != null && pressureCount > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current wave
          </p>
          <Link
            href={buildHref(current, {
              pressure: current.pressure ? undefined : true,
            })}
            className={cn(
              buttonVariants({
                variant: current.pressure ? "default" : "outline",
                size: "sm",
              }),
              "h-7 w-full justify-start text-xs"
            )}
          >
            Roles in flux
            <span className="ml-auto tabular-nums opacity-70">
              {pressureCount}
            </span>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(STATUS_LABELS) as OccupationStatus[]).map((s) => {
            const active = current.status === s;
            return (
              <Link
                key={s}
                href={buildHref(current, {
                  status: active ? undefined : s,
                })}
                className={cn(
                  buttonVariants({
                    variant: active ? "default" : "outline",
                    size: "sm",
                  }),
                  "h-7 text-xs"
                )}
              >
                {STATUS_LABELS[s]}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Era
        </p>
        <div className="flex flex-col gap-1.5">
          {ERA_ORDER.map((era) => {
            const active = current.era === era;
            return (
              <Link
                key={era}
                href={buildHref(current, {
                  era: active ? undefined : era,
                })}
                className={cn(
                  buttonVariants({
                    variant: active ? "default" : "ghost",
                    size: "sm",
                  }),
                  "h-8 w-full justify-start text-xs font-normal",
                  !active && ERA_STYLES[era].badge
                )}
              >
                {ERA_LABELS[era]}
              </Link>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <>
          <Separator />
          <button
            type="button"
            onClick={() => router.push("/jobs")}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "w-full text-xs"
            )}
          >
            <X className="mr-1 size-3" />
            Clear filters
          </button>
        </>
      )}
    </div>
  );
}