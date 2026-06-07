export function SetupNotice() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-stone-800">
      <h2 className="font-serif text-xl font-semibold">Database not configured</h2>
      <p className="mt-2 text-sm leading-relaxed">
        Set <code className="rounded bg-white px-1">DATABASE_URL</code> in{" "}
        <code className="rounded bg-white px-1">.env.local</code> (Neon Postgres),
        then run:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-stone-900 p-3 text-xs text-stone-100">
        {`npm run db:push
npx tsx scripts/run-sql-file.ts drizzle/manual/001_search.sql
npx tsx scripts/run-sql-file.ts drizzle/manual/002_enhanced_tier.sql
npm run import:showcase
npm run import:wikidata
npm run enrich:stubs`}
      </pre>
    </div>
  );
}