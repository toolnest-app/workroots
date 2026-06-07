import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ERA_LABELS, STATUS_LABELS } from "@/lib/constants";
import { STATUS_STYLES, ERA_STYLES } from "@/lib/status-styles";
import type { EraPrimary, OccupationStatus } from "@/db/schema";
import { cn } from "@/lib/utils";
import { MapPin, BookOpen } from "lucide-react";

interface Relation {
  type: "predecessor" | "successor" | "related";
  slug: string;
  name: string;
  status: OccupationStatus;
}

interface DetailSidebarProps {
  status: OccupationStatus;
  eraPrimary: EraPrimary;
  category: string;
  regions?: string;
  relations: Relation[];
}

export function DetailSidebar({
  status,
  eraPrimary,
  category,
  regions,
  relations,
}: DetailSidebarProps) {
  const related = relations.slice(0, 6);

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-xl border border-border/70 bg-muted/15 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Archive record
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
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
        {regions && (
          <div className="mt-4 flex gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary/70" />
            <p className="leading-relaxed">{regions}</p>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <>
          <Separator />
          <div>
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <h2 className="font-serif text-lg font-semibold">
                Explore nearby
              </h2>
            </div>
            <ul className="space-y-2">
              {related.map((rel) => (
                <li key={`${rel.type}-${rel.slug}`}>
                  <Link
                    href={`/jobs/${rel.slug}`}
                    className="group flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-sm transition-colors hover:border-border hover:bg-muted/40"
                  >
                    <span className="font-medium group-hover:text-primary">
                      {rel.name}
                    </span>
                    <span className="text-[10px] capitalize text-muted-foreground">
                      {rel.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </aside>
  );
}