import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasDatabase } from "@/db";
import { SetupNotice } from "@/components/setup-notice";
import { AgeBadge } from "@/components/age-badge";
import { LineageList } from "@/components/lineage-list";
import { Badge } from "@/components/ui/badge";
import { getOccupationBySlug } from "@/lib/queries/occupations";
import { ERA_LABELS, STATUS_LABELS } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!hasDatabase()) return { title: "Occupation" };
  const { slug } = await params;
  const data = await getOccupationBySlug(slug);
  if (!data) return { title: "Not found" };
  return {
    title: data.occupation.name,
    description: data.occupation.summary,
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-serif text-xl font-semibold text-stone-900">{title}</h2>
      <div className="prose prose-stone max-w-none text-stone-700">{children}</div>
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
    <article className="space-y-10">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{STATUS_LABELS[occupation.status]}</Badge>
          <Badge className="bg-stone-200">{ERA_LABELS[occupation.eraPrimary]}</Badge>
          <Badge className="bg-stone-200">{occupation.category}</Badge>
        </div>
        <h1 className="font-serif text-4xl font-semibold">{occupation.name}</h1>
        {aliases.length > 0 && (
          <p className="text-sm text-stone-600">
            Also known as: {aliases.join(", ")}
          </p>
        )}
        <p className="text-lg text-stone-700">{occupation.summary}</p>
        <AgeBadge
          status={occupation.status}
          originYear={occupation.originYear}
          originYearEnd={occupation.originYearEnd}
          originLabel={occupation.originLabel}
          dateConfidence={occupation.dateConfidence}
        />
      </header>

      <Section title="Lineage">
        <LineageList relations={relations} />
      </Section>

      {events.length > 0 && (
        <Section title="Timeline">
          <ol className="space-y-3 border-l-2 border-stone-300 pl-4">
            {events.map((ev) => (
              <li key={ev.id} className="text-sm">
                <p className="font-medium text-stone-900">
                  {ev.year != null ? `${ev.year}` : "—"} · {ev.label}
                </p>
                {ev.description && (
                  <p className="text-stone-600">{ev.description}</p>
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {occupation.duties && (
        <Section title="Duties">
          <p className="whitespace-pre-wrap">{occupation.duties}</p>
        </Section>
      )}

      {occupation.skills && (
        <Section title="Skills">
          <p className="whitespace-pre-wrap">{occupation.skills}</p>
        </Section>
      )}

      {occupation.tools && (
        <Section title="Tools">
          <p className="whitespace-pre-wrap">{occupation.tools}</p>
        </Section>
      )}

      {occupation.regions && (
        <Section title="Regions">
          <p>{occupation.regions}</p>
        </Section>
      )}

      {isActive && (occupation.educationPath || occupation.modernSectors) && (
        <Section title="Today">
          {occupation.educationPath && (
            <p>
              <span className="font-medium">Path in: </span>
              {occupation.educationPath}
            </p>
          )}
          {occupation.modernSectors && (
            <p className="mt-2">
              <span className="font-medium">Sectors: </span>
              {occupation.modernSectors}
            </p>
          )}
        </Section>
      )}

      <Section title="Sources & uncertainty">
        {occupation.originLabel && (
          <p className="text-sm text-stone-600">
            Origin note: {occupation.originLabel}
          </p>
        )}
        {sources.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {sources.map((s) => (
              <li key={s.id}>
                {s.url ? (
                  <a
                    href={s.url}
                    className="text-stone-800 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.title}
                  </a>
                ) : (
                  s.title
                )}
                {s.note ? ` — ${s.note}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-stone-500">Sources being expanded.</p>
        )}
      </Section>
    </article>
  );
}