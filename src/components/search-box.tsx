"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface SearchResult {
  slug: string;
  name: string;
  summary: string;
}

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = (await res.json()) as { results: SearchResult[] };
        setResults(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full max-w-2xl">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search roles — blacksmith, scribe, developer…"
        aria-label="Search roles"
      />
      {loading && (
        <p className="mt-2 text-sm text-stone-500">Searching…</p>
      )}
      {results.length > 0 && (
        <ul className="mt-3 divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/jobs/${r.slug}`}
                className="block px-4 py-3 hover:bg-stone-50"
              >
                <p className="font-medium text-stone-900">{r.name}</p>
                <p className="line-clamp-1 text-sm text-stone-600">{r.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}