import { hasDatabase } from "@/db";
import { SetupNotice } from "@/components/setup-notice";
import { HomeHero } from "@/components/home-hero";
import { EraTimeline } from "@/components/era-timeline";
import { OccupationCard } from "@/components/occupation-card";
import {
  countCuratedOccupations,
  countEnhancedOccupations,
  getFeaturedSlugs,
  getOccupationBySlug,
  getSiteStats,
} from "@/lib/queries/occupations";

export default async function HomePage() {
  if (!hasDatabase()) {
    return <SetupNotice />;
  }

  const [stats, curatedCount, enhancedCount, slugs] = await Promise.all([
    getSiteStats(),
    countCuratedOccupations(),
    countEnhancedOccupations(),
    getFeaturedSlugs(),
  ]);
  const featured = (
    await Promise.all(slugs.map((slug) => getOccupationBySlug(slug)))
  ).filter(Boolean);

  return (
    <div className="space-y-14">
      <HomeHero
        totalRoles={stats.totalRoles}
        curatedCount={curatedCount}
        enhancedCount={enhancedCount}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              Browse by era
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              From ancient crafts to contemporary careers
            </p>
          </div>
        </div>
        <EraTimeline eraCounts={stats.eraCounts} />
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Featured roles
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Curated entries with rich lineage and timelines
          </p>
        </div>
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
                  originYear={entry.occupation.originYear}
                  originLabel={entry.occupation.originLabel}
                  contentTier={entry.occupation.contentTier}
                />
              )
          )}
        </div>
      </section>
    </div>
  );
}