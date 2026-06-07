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
        <h2 className="font-serif text-2xl font-semibold">Current pressures</h2>
        <p className="leading-relaxed text-muted-foreground">
          A pilot set of curated entries includes assessments of how the
          contemporary AI and automation wave is affecting each role. These are
          not predictions or risk scores — they describe task change, historical
          parallels, and where human judgment still anchors the occupation.
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Augmented</strong> — AI assists
            core work; duties shift toward oversight and judgment.
          </li>
          <li>
            <strong className="text-foreground">Displaced tasks</strong> —
            routine work automated; headcount pressure in parts of the role.
          </li>
          <li>
            <strong className="text-foreground">Transformed</strong> — daily
            production reshaped by new tools.
          </li>
          <li>
            <strong className="text-foreground">Resilient</strong> — physical
            presence, licensure, or trust remain central.
          </li>
          <li>
            <strong className="text-foreground">Emerging</strong> — new
            specializations forming around AI systems.
          </li>
        </ul>
      </section>
    </div>
  );
}