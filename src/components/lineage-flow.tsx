import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/status-styles";
import { STATUS_LABELS } from "@/lib/constants";
import type { OccupationStatus } from "@/db/schema";

interface Relation {
  type: "predecessor" | "successor" | "related";
  slug: string;
  name: string;
  status: OccupationStatus;
}

interface LineageFlowProps {
  currentName: string;
  currentStatus: OccupationStatus;
  relations: Relation[];
}

export function LineageFlow({
  currentName,
  currentStatus,
  relations,
}: LineageFlowProps) {
  const predecessors = relations.filter((r) => r.type === "predecessor");
  const successors = relations.filter((r) => r.type === "successor");
  const related = relations.filter((r) => r.type === "related");

  const hasFlow = predecessors.length > 0 || successors.length > 0;

  if (!hasFlow && related.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No lineage links recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {hasFlow && (
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {predecessors.map((rel) => (
            <FlowNode key={rel.slug} rel={rel} />
          ))}
          {predecessors.length > 0 && (
            <ArrowRight className="hidden size-5 shrink-0 text-muted-foreground sm:block" />
          )}
          <div
            className={cn(
              "rounded-xl border-2 border-primary/40 bg-primary/5 px-4 py-3 text-center sm:text-left",
              predecessors.length === 0 && "sm:ml-0"
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Current role
            </p>
            <p className="font-serif text-lg font-semibold">{currentName}</p>
            <span
              className={cn(
                "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                STATUS_STYLES[currentStatus].badge
              )}
            >
              {STATUS_LABELS[currentStatus]}
            </span>
          </div>
          {successors.length > 0 && (
            <ArrowRight className="hidden size-5 shrink-0 text-muted-foreground sm:block" />
          )}
          {successors.map((rel) => (
            <FlowNode key={rel.slug} rel={rel} />
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Related roles
          </p>
          <div className="flex flex-wrap gap-2">
            {related.map((rel) => (
              <FlowNode key={rel.slug} rel={rel} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FlowNode({
  rel,
  compact,
}: {
  rel: Relation;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/jobs/${rel.slug}`}
      className={cn(
        "rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/30 hover:bg-muted/50",
        compact ? "inline-flex items-center gap-2 py-2" : "min-w-[120px]"
      )}
    >
      <p
        className={cn(
          "font-medium text-foreground",
          compact ? "text-sm" : "font-serif text-base"
        )}
      >
        {rel.name}
      </p>
      <span
        className={cn(
          "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
          STATUS_STYLES[rel.status].badge
        )}
      >
        {STATUS_LABELS[rel.status]}
      </span>
    </Link>
  );
}