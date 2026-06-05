export default function AboutPage() {
  return (
    <div className="prose prose-stone max-w-3xl">
      <h1 className="font-serif text-4xl font-semibold">About Occupations</h1>
      <p>
        Occupations is a global encyclopedia and historical archive of work. Each
        entry documents what a role involved, where it existed, how it connects
        to predecessor and successor jobs, and—when evidence allows—how long the
        occupation has been recognized.
      </p>
      <h2 className="font-serif text-2xl">How we estimate age</h2>
      <p>
        Dates are rarely exact for ancient crafts. We show a clear best estimate
        in the hero line, plus a confidence level:
      </p>
      <ul>
        <li>
          <strong>High</strong> — well-documented modern roles with clear
          emergence dates.
        </li>
        <li>
          <strong>Medium</strong> — reasonable historical consensus or partial
          records.
        </li>
        <li>
          <strong>Low</strong> — deep history where only broad eras are known.
        </li>
      </ul>
      <h2 className="font-serif text-2xl">Data sources</h2>
      <p>
        The catalog is seeded from curated showcase entries and Wikidata
        occupation labels (CC0). We deduplicate by English slug and prefer
        curated narratives where they exist.
      </p>
      <h2 className="font-serif text-2xl">Roadmap</h2>
      <ul>
        <li>Expand toward 10,000+ occupations</li>
        <li>Deeper articles for high-traffic roles</li>
        <li>Suggest-a-correction workflow with moderation</li>
      </ul>
    </div>
  );
}