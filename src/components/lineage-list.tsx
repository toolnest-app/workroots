import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Relation {
  type: "predecessor" | "successor" | "related";
  slug: string;
  name: string;
}

const typeLabels: Record<Relation["type"], string> = {
  predecessor: "Predecessor",
  successor: "Successor",
  related: "Related",
};

export function LineageList({ relations }: { relations: Relation[] }) {
  if (relations.length === 0) {
    return (
      <p className="text-sm text-stone-500">No lineage links recorded yet.</p>
    );
  }

  const grouped = {
    predecessor: relations.filter((r) => r.type === "predecessor"),
    successor: relations.filter((r) => r.type === "successor"),
    related: relations.filter((r) => r.type === "related"),
  };

  return (
    <div className="space-y-4">
      {(Object.keys(grouped) as Array<keyof typeof grouped>).map((key) => {
        const items = grouped[key];
        if (items.length === 0) return null;
        return (
          <div key={key}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
              {typeLabels[key]}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((rel) => (
                <Link key={`${rel.type}-${rel.slug}`} href={`/jobs/${rel.slug}`}>
                  <Badge className="cursor-pointer hover:bg-stone-200">
                    {rel.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}