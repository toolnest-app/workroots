import { BreadcrumbsNav } from "@/components/breadcrumbs-nav";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <BreadcrumbsNav
        items={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />
      <header className="space-y-3 border-b border-border/60 pb-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          About Workroots
        </h1>
        <p className="text-lg text-muted-foreground">
          A global encyclopedia and historical archive of human work.
        </p>
      </header>

      <section className="space-y-3 text-muted-foreground">
        <p className="leading-relaxed">
          Each entry documents what a role involved, where it existed, how it
          connects to predecessor and successor jobs, and—when evidence
          allows—how long the occupation has been recognized.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">
          How we estimate age
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Dates are rarely exact for ancient crafts. We show a clear best
          estimate in the hero line, plus a confidence level:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">High</strong> — well-documented
            modern roles with clear emergence dates.
          </li>
          <li>
            <strong className="text-foreground">Medium</strong> — reasonable
            historical consensus or partial records.
          </li>
          <li>
            <strong className="text-foreground">Low</strong> — deep history
            where only broad eras are known.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">Data sources</h2>
        <p className="leading-relaxed text-muted-foreground">
          The catalog has three layers: human-curated encyclopedia entries,
          auto-enhanced Wikidata profiles (aliases, regions, field context), and
          lightweight stubs for the long tail. We deduplicate by English slug and
          prefer curated narratives where they exist.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold">
          Automation &amp; AI effects
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          A pilot set of entries documents where automation or generative AI is
          measurably changing tasks. We do not publish risk scores or
          predictions. When digitization began before the 2020s generative-AI
          wave, we say so — conflating decades of automation with ChatGPT-era
          tools would mislead readers.
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Augmented</strong> — tools
            assist parts of the work; the occupation persists with a shifting
            task mix.
          </li>
          <li>
            <strong className="text-foreground">Displaced tasks</strong> —
            routine work automated; identifiable segments have fewer workers.
          </li>
          <li>
            <strong className="text-foreground">Transformed</strong> — how work
            is produced is changing materially, often accelerating older trends.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Roles with little documented change from automation or AI are omitted
          from this pilot rather than labeled &ldquo;under pressure.&rdquo;
        </p>
      </section>
    </div>
  );
}