import { AgeBadge } from "@/components/age-badge";
import { LineageFlow } from "@/components/lineage-flow";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ERA_LABELS, STATUS_LABELS } from "@/lib/constants";
import { STATUS_STYLES, ERA_STYLES } from "@/lib/status-styles";
import type { DateConfidence, OccupationStatus } from "@/lib/occupation-age";
import type { EraPrimary } from "@/db/schema";
import { cn } from "@/lib/utils";

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
  originYear: number | null;
  originYearEnd: number | null;
  originLabel: string | null;
  dateConfidence: DateConfidence;
  relations: Relation[];
  currentName: string;
}

export function DetailSidebar(props: DetailSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <AgeBadge
        status={props.status}
        originYear={props.originYear}
        originYearEnd={props.originYearEnd}
        originLabel={props.originLabel}
        dateConfidence={props.dateConfidence}
      />
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className={cn(STATUS_STYLES[props.status].badge)}
        >
          {STATUS_LABELS[props.status]}
        </Badge>
        <Badge
          variant="outline"
          className={cn(ERA_STYLES[props.eraPrimary].badge)}
        >
          {ERA_LABELS[props.eraPrimary]}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {props.category}
        </Badge>
      </div>
      <Separator />
      <div>
        <h2 className="mb-3 font-serif text-lg font-semibold">Lineage</h2>
        <LineageFlow
          currentName={props.currentName}
          currentStatus={props.status}
          relations={props.relations}
        />
      </div>
    </aside>
  );
}