import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasDatabase } from "@/db";
import { SetupNotice } from "@/components/setup-notice";
import { DetailSidebar } from "@/components/detail-sidebar";
import { OccupationTimeline } from "@/components/occupation-timeline";
import { BreadcrumbsNav } from "@/components/breadcrumbs-nav";
import { getOccupationBySlug } from "@/lib/queries/occupations";
import { Separator } from "@/components/ui/separator";

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
    <section className="space-y-3">
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

  return (
    <div>
      <BreadcrumbsNav
        items={[
          { label: "Home", href: "/" },
          { label: "Browse", href: "/jobs" },
          { label: occupation.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0 space-y-8">
          <header className="space-y-3 border-b border-border/60 pb-8">
            <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
              {occupation.name}
            </h1>
            {aliases.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Also known as:{" "}
                <span className="text-foreground">{aliases.join(", ")}</span>
              </p>
            )}
            <p className="text-lg leading-relaxed text-foreground/90">
              {occupation.summary}
            </p>
          </header>

          {events.length > 0 && (
            <ContentSection title="Timeline">
              <OccupationTimeline events={events} />
            </ContentSection>
          )}

          {occupation.duties && (
            <ContentSection title="Duties">
              <p className="whitespace-pre-wrap text-foreground/85">
                {occupation.duties}
              </p>
            </ContentSection>
          )}

          {occupation.skills && (
            <ContentSection title="Skills">
              <p className="whitespace-pre-wrap text-foreground/85">
                {occupation.skills}
              </p>
            </ContentSection>
          )}

          {occupation.tools && (
            <ContentSection title="Tools">
              <p className="whitespace-pre-wrap text-foreground/85">
                {occupation.tools}
              </p>
            </ContentSection>
          )}

          {occupation.regions && (
            <ContentSection title="Regions">
              <p className="text-foreground/85">{occupation.regions}</p>
            </ContentSection>
          )}

          {isActive && (occupation.educationPath || occupation.modernSectors) && (
            <ContentSection title="Today">
              {occupation.educationPath && (
                <p>
                  <span className="font-medium text-foreground">Path in: </span>
                  {occupation.educationPath}
                </p>
              )}
              {occupation.modernSectors && (
                <p className="mt-3">
                  <span className="font-medium text-foreground">Sectors: </span>
                  {occupation.modernSectors}
                </p>
              )}
            </ContentSection>
          )}

          <Separator />

          <ContentSection title="Sources & uncertainty">
            {occupation.originLabel && (
              <p className="mb-3 text-sm">
                <span className="font-medium text-foreground">Origin note: </span>
                {occupation.originLabel}
              </p>
            )}
            {sources.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5">
                {sources.map((s) => (
                  <li key={s.id}>
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
                      <span className="text-muted-foreground"> — {s.note}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sources being expanded for this entry.</p>
            )}
          </ContentSection>
        </article>

        <DetailSidebar
          status={occupation.status}
          eraPrimary={occupation.eraPrimary}
          category={occupation.category}
          originYear={occupation.originYear}
          originYearEnd={occupation.originYearEnd}
          originLabel={occupation.originLabel}
          dateConfidence={occupation.dateConfidence}
          relations={relations}
          currentName={occupation.name}
        />
      </div>
    </div>
  );
}