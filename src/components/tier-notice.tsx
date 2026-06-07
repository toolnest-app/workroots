import Link from "next/link";
import type { ContentTier } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TierNoticeProps {
  tier: ContentTier;
}

export function TierNotice({ tier }: TierNoticeProps) {
  if (tier === "curated") return null;

  if (tier === "enhanced") {
    return (
      <div className="rounded-xl border border-sky-200/90 bg-sky-50/80 p-5 text-stone-800">
        <h2 className="font-serif text-lg font-semibold">Auto-enriched entry</h2>
        <p className="mt-2 text-sm leading-relaxed">
          This page was expanded from Wikidata with aliases, regions, and field
          context. Lineage, timelines, and human-reviewed sources are still
          limited compared to curated encyclopedia entries.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
        >
          Browse curated roles
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-300/80 bg-amber-50/90 p-5 text-stone-800">
      <h2 className="font-serif text-lg font-semibold">Stub entry</h2>
      <p className="mt-2 text-sm leading-relaxed">
        This role was auto-seeded from Wikidata with a short description only.
        Run <code className="rounded bg-white/80 px-1">npm run enrich:stubs</code>{" "}
        to upgrade stubs in bulk, or browse curated entries for full detail.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
      >
        Browse curated roles
      </Link>
    </div>
  );
}