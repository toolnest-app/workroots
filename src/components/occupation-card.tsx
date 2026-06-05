import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, ERA_LABELS } from "@/lib/constants";
import type { EraPrimary, OccupationStatus } from "@/db/schema";

interface OccupationCardProps {
  slug: string;
  name: string;
  summary: string;
  status: OccupationStatus;
  eraPrimary: EraPrimary;
}

export function OccupationCard({
  slug,
  name,
  summary,
  status,
  eraPrimary,
}: OccupationCardProps) {
  return (
    <Link href={`/jobs/${slug}`}>
      <Card className="h-full transition hover:border-stone-400 hover:shadow-md">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{STATUS_LABELS[status]}</Badge>
            <Badge className="bg-stone-200">{ERA_LABELS[eraPrimary]}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-stone-600">{summary}</p>
        </CardContent>
      </Card>
    </Link>
  );
}