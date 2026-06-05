"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CommandTrigger({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      className={cn(
        "relative h-9 w-full justify-start gap-2 bg-background/60 text-sm text-muted-foreground sm:w-64",
        className
      )}
      onClick={() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true })
        );
      }}
    >
      <Search className="size-4 shrink-0" />
      <span className="hidden sm:inline">Search roles…</span>
      <span className="sm:hidden">Search</span>
      <kbd className="pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
        ⌘K
      </kbd>
    </Button>
  );
}