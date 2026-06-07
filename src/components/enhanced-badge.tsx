import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function EnhancedBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-sky-300/80 bg-sky-50/90 text-[10px] text-sky-900",
        className
      )}
    >
      <Sparkles className="size-3" />
      Enhanced
    </Badge>
  );
}