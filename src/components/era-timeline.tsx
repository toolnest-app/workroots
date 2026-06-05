import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ERA_LABELS, ERA_ORDER } from "@/lib/constants";
import { ERA_STYLES } from "@/lib/status-styles";
import type { EraPrimary } from "@/db/schema";
import { cn } from "@/lib/utils";

interface EraTimelineProps {
  eraCounts?: Partial<Record<EraPrimary, number>>;
  activeEra?: EraPrimary;
}

export function EraTimeline({ eraCounts, activeEra }: EraTimelineProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-3">
        {ERA_ORDER.map((era, i) => {
          const styles = ERA_STYLES[era];
          const count = eraCounts?.[era];
          const isActive = activeEra === era;
          return (
            <Link
              key={era}
              href={`/jobs?era=${era}`}
              className={cn(
                "group relative flex min-w-[140px] flex-col rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md",
                isActive && "border-primary ring-2 ring-primary/20"
              )}
            >
              <div
                className={cn(
                  "mb-3 h-1 w-full rounded-full bg-gradient-to-r opacity-80",
                  styles.bar
                )}
              />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Era {i + 1}
              </span>
              <span className="mt-0.5 font-serif text-base font-semibold">
                {ERA_LABELS[era]}
              </span>
              {count != null && (
                <span className="mt-1 text-xs text-muted-foreground">
                  {count.toLocaleString()} roles
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}