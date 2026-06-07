import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function CuratedBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-primary/30 bg-primary/5 text-[10px] text-primary",
        className
      )}
    >
      <BookOpen className="size-3" />
      Curated
    </Badge>
  );
}