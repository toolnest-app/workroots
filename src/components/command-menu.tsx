"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { STATUS_LABELS } from "@/lib/constants";
import { STATUS_STYLES } from "@/lib/status-styles";
import type { OccupationStatus } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchResult {
  slug: string;
  name: string;
  summary: string;
  status: OccupationStatus;
}

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { results: SearchResult[] };
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, open, search]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search Workroots"
      description="Find any role in the archive — ancient crafts to modern careers"
    >
      <CommandInput
        placeholder="Try blacksmith, scribe, developer…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading
            ? "Searching the archive…"
            : query.length < 2
              ? "Type at least 2 characters"
              : "No roles found. Try another term."}
        </CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading="Roles">
            {results.map((r) => (
              <CommandItem
                key={r.slug}
                value={`${r.name} ${r.slug}`}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/jobs/${r.slug}`);
                }}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-medium">{r.name}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {r.summary}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2 shrink-0 text-[10px]",
                    STATUS_STYLES[r.status].badge
                  )}
                >
                  {STATUS_LABELS[r.status]}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
      <div className="border-t px-3 py-2 text-xs text-muted-foreground">
        <CommandShortcut>↵</CommandShortcut> open ·{" "}
        <CommandShortcut>esc</CommandShortcut> close
      </div>
    </CommandDialog>
  );
}