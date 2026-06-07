import { Suspense } from "react";
import { BreadcrumbsNav } from "@/components/breadcrumbs-nav";
import { SuggestForm } from "@/components/suggest-form";

export const metadata = {
  title: "Suggest a correction",
  description:
    "Submit factual corrections, sources, or feedback on Workroots encyclopedia entries.",
};

export default function SuggestPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <BreadcrumbsNav
        items={[
          { label: "Home", href: "/" },
          { label: "Suggest a correction" },
        ]}
      />

      <header className="space-y-3 border-b border-border/60 pb-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Suggest a correction
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Workroots is read-only for visitors, but we welcome evidence-backed
          corrections. Suggestions go to a moderation queue — no open wiki
          editing.
        </p>
      </header>

      <section className="space-y-3 text-sm text-muted-foreground">
        <p>
          Strong submissions include: what is wrong or missing, what you
          propose instead, and a source (book, paper, museum record, or
          reputable URL).
        </p>
        <p>
          Limit: three submissions per hour per network to reduce spam.
        </p>
      </section>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading form…</p>}>
        <SuggestForm />
      </Suspense>
    </div>
  );
}