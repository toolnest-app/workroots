import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasDatabase } from "@/db";
import { SetupNotice } from "@/components/setup-notice";
import { DetailSidebar } from "@/components/detail-sidebar";
import { OccupationTimeline } from "@/components/occupation-timeline";
import { OccupationHero } from "@/components/occupation-hero";
import { OccupationFacts } from "@/components/occupation-facts";
import { LineageFlow } from "@/components/lineage-flow";
import { BreadcrumbsNav } from "@/components/breadcrumbs-nav";
import { getOccupationBySlug } from "@/lib/queries/occupations";
import { Separator } from "@/components/ui/separator";
import { TierNotice } from "@/components/tier-notice";
import { CurrentPressures } from "@/components/current-pressures";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!hasDatabase()) return { title: "Role" };
  const { slug } = await params;
  const data = await getOccupationBySlug(slug);
  if (!data) return { title: "Not found" };
  return {
    title: data.occupation.name,
    description: data.occupation.summary,
  };
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </div>
    </section>
  );
}

export default async function OccupationDetailPage({ params }: PageProps) {
  if (!hasDatabase()) {
    return <SetupNotice />;
  }

  const { slug } = await params;
  const data = await getOccupationBySlug(slug);
  if (!data) notFound();

  const { occupation, aliases, events, sources, relations } = data;
  const isActive =
    occupation.status === "active" || occupation.status === "declining";
  const hasLineage = relations.length > 0;

  return (
    <div className="space-y-8">
      <BreadcrumbsNav
        items={[
          { label: "Home", href: "/" },
          { label: "Browse", href: "/jobs" },
          { label: occupation.name },
        ]}
      />

      <OccupationHero
        name={occupation.name}
        summary={occupation.summary}
        aliases={aliases}
        status={occupation.status}
        eraPrimary={occupation.eraPrimary}
        category={occupation.category}
        contentTier={occupation.contentTier}
        originYear={occupation.originYear}
        originYearEnd={occupation.originYearEnd}
        originLabel={occupation.originLabel}
        dateConfidence={occupation.dateConfidence}
      />

      <TierNotice tier={occupation.contentTier} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <article className="min-w-0 space-y-10">
          {hasLineage && (
            <ContentSection title="Lineage">
              <LineageFlow
                currentName={occupation.name}
                currentStatus={occupation.status}
                relations={relations}
              />
            </ContentSection>
          )}

          {events.length > 0 && (
            <ContentSection title="Timeline">
              <OccupationTimeline events={events} />
            </ContentSection>
          )}

          {occupation.pressureType &&
            occupation.pressureConfidence &&
            occupation.pressureSummary && (
              <CurrentPressures
                occupationSlug={occupation.slug}
                pressureType={occupation.pressureType}
                pressureConfidence={occupation.pressureConfidence}
                summary={occupation.pressureSummary}
                sources={sources}
              />
            )}

          <OccupationFacts
            duties={occupation.duties || undefined}
            skills={occupation.skills || undefined}
            tools={occupation.tools || undefined}
          />

          {occupation.regions && occupation.contentTier !== "curated" && (
            <ContentSection title="Regions">
              <p className="text-foreground/85">{occupation.regions}</p>
            </ContentSection>
          )}

          {isActive && (occupation.educationPath || occupation.modernSectors) && (
            <section className="rounded-xl border border-primary/15 bg-primary/5 p-6">
              <h2 className="font-serif text-xl font-semibold tracking-tight">
                Today
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed md:text-base">
                {occupation.educationPath && (
                  <p>
                    <span className="font-medium text-foreground">
                      Path in:{" "}
                    </span>
                    <span className="text-foreground/85">
                      {occupation.educationPath}
                    </span>
                  </p>
                )}
                {occupation.modernSectors && (
                  <p>
                    <span className="font-medium text-foreground">
                      Sectors:{" "}
                    </span>
                    <span className="text-foreground/85">
                      {occupation.modernSectors}
                    </span>
                  </p>
                )}
              </div>
            </section>
          )}

          <Separator />

          <ContentSection title="Sources & uncertainty">
            {occupation.originLabel && (
              <p className="mb-4 rounded-lg bg-muted/30 px-4 py-3 text-sm text-foreground/85">
                <span className="font-medium text-foreground">Origin note: </span>
                {occupation.originLabel}
              </p>
            )}
            {sources.length > 0 ? (
              <ul className="space-y-3">
                {sources.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-lg border border-border/60 bg-card px-4 py-3 text-sm"
                  >
                    {s.url ? (
                      <a
                        href={s.url}
                        className="font-medium text-primary underline-offset-2 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {s.title}
                      </a>
                    ) : (
                      <span className="font-medium text-foreground">
                        {s.title}
                      </span>
                    )}
                    {s.note ? (
                      <p className="mt-1 text-muted-foreground">{s.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sources being expanded for this entry.</p>
            )}
            <p className="mt-4 text-sm">
              <Link
                href={`/suggest?role=${occupation.slug}&type=correction`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "inline-flex"
                )}
              >
                Suggest a correction
              </Link>
            </p>
          </ContentSection>
        </article>

        <DetailSidebar
          status={occupation.status}
          eraPrimary={occupation.eraPrimary}
          category={occupation.category}
          regions={occupation.regions || undefined}
          relations={relations}
        />
      </div>
    </div>
  );
}