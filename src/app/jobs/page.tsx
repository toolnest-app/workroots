import Link from "next/link";
import { hasDatabase } from "@/db";
import { SetupNotice } from "@/components/setup-notice";
import { JobFilters } from "@/components/job-filters";
import { OccupationCard } from "@/components/occupation-card";
import { SearchBox } from "@/components/search-box";
import { listOccupations } from "@/lib/queries/occupations";
import type { EraPrimary, OccupationStatus } from "@/db/schema";

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    era?: string;
    page?: string;
  }>;
}

function jobsPageHref(
  params: { q?: string; status?: string; era?: string },
  page: number
) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.status) sp.set("status", params.status);
  if (params.era) sp.set("era", params.era);
  sp.set("page", String(page));
  return `/jobs?${sp.toString()}`;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  if (!hasDatabase()) {
    return <SetupNotice />;
  }

  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "1", 10) || 1;
  const status = params.status as OccupationStatus | undefined;
  const era = params.era as EraPrimary | undefined;

  const result = await listOccupations({
    q: params.q,
    status,
    era,
    page,
    pageSize: 24,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <JobFilters current={{ q: params.q, status, era }} />
      </aside>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Browse occupations</h1>
          <p className="mt-1 text-stone-600">
            {result.total.toLocaleString()} occupations in the archive
          </p>
        </div>
        <SearchBox initialQuery={params.q ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          {result.items.map((job) => (
            <OccupationCard
              key={job.slug}
              slug={job.slug}
              name={job.name}
              summary={job.summary}
              status={job.status}
              eraPrimary={job.eraPrimary}
            />
          ))}
        </div>
        {result.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-sm">
            {page > 1 ? (
              <Link
                href={jobsPageHref(params, page - 1)}
                className="text-stone-700 hover:underline"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span>
              Page {page} of {result.totalPages}
            </span>
            {page < result.totalPages ? (
              <Link
                href={jobsPageHref(params, page + 1)}
                className="text-stone-700 hover:underline"
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>
    </div>
  );
}