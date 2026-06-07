import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StubNotice() {
  return (
    <div className="rounded-xl border border-amber-300/80 bg-amber-50/90 p-5 text-stone-800">
      <h2 className="font-serif text-lg font-semibold">Stub entry</h2>
      <p className="mt-2 text-sm leading-relaxed">
        This role was auto-seeded from Wikidata. Duties, lineage, timeline, and
        sources are not yet written. Curated entries in the pilot set include
        full encyclopedia detail.
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