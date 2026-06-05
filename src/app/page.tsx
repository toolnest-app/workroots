import Link from "next/link";
import { hasDatabase } from "@/db";
import { SetupNotice } from "@/components/setup-notice";
import { SearchBox } from "@/components/search-box";
import { OccupationCard } from "@/components/occupation-card";
import { ERA_LABELS, ERA_ORDER } from "@/lib/constants";
import { getFeaturedSlugs, getOccupationBySlug } from "@/lib/queries/occupations";

export default async function HomePage() {
  if (!hasDatabase()) {
    return <SetupNotice />;
  }

  const slugs = await getFeaturedSlugs();
  const featured = (
    await Promise.all(slugs.map((slug) => getOccupationBySlug(slug)))
  ).filter(Boolean);

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
          Every occupation tells a story
        </h1>
        <p className="max-w-2xl text-lg text-stone-600">
          Search roles from ancient crafts to modern careers. See how old a job
          is, how it evolved, and which occupations came before and after.
        </p>
        <SearchBox />
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-semibold">Browse by era</h2>
        <div className="flex flex-wrap gap-2">
          {ERA_ORDER.map((era) => (
            <Link
              key={era}
              href={`/jobs?era=${era}`}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm hover:border-stone-500"
            >
              {ERA_LABELS[era]}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-semibold">Featured occupations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(
            (entry) =>
              entry && (
                <OccupationCard
                  key={entry.occupation.slug}
                  slug={entry.occupation.slug}
                  name={entry.occupation.name}
                  summary={entry.occupation.summary}
                  status={entry.occupation.status}
                  eraPrimary={entry.occupation.eraPrimary}
                />
              )
          )}
        </div>
      </section>
    </div>
  );
}