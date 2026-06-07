import Link from "next/link";
import { hasDatabase } from "@/db";
import { SetupNotice } from "@/components/setup-notice";
import { JobFilters } from "@/components/job-filters";
import { OccupationCard } from "@/components/occupation-card";
import { BreadcrumbsNav } from "@/components/breadcrumbs-nav";
import { EraTimeline } from "@/components/era-timeline";
import { CommandTrigger } from "@/components/command-trigger";
import {
  countPressureOccupations,
  listOccupations,
} from "@/lib/queries/occupations";
import type { EraPrimary, OccupationStatus } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    era?: string;
    pressure?: string;
    page?: string;
  }>;
}

function jobsPageHref(
  params: { q?: string; status?: string; era?: string; pressure?: string },
  page: number
) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.status) sp.set("status", params.status);
  if (params.era) sp.set("era", params.era);
  if (params.pressure) sp.set("pressure", params.pressure);
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

  const pressure = params.pressure === "1";

  const [result, pressureCount] = await Promise.all([
    listOccupations({
      q: params.q,
      status,
      era,
      pressure: pressure || undefined,
      page,
      pageSize: 24,
    }),
    countPressureOccupations(),
  ]);

  return (
    <div className="space-y-8">
      <BreadcrumbsNav
        items={[
          { label: "Home", href: "/" },
          { label: "Browse archive" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Browse the archive
          </h1>
          <p className="mt-2 text-muted-foreground">
            Filter by status, era, or roles with documented automation & AI effects
          </p>
        </div>
        <CommandTrigger className="w-full sm:w-72" />
      </div>

      {(era || pressure) && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
          {era && (
            <span>
              Era:{" "}
              <span className="font-medium capitalize">
                {era.replace("_", " ")}
              </span>
            </span>
          )}
          {era && pressure && <span className="mx-2">·</span>}
          {pressure && (
            <span>
              Showing roles with documented{" "}
              <span className="font-medium">automation & AI effects</span>
            </span>
          )}
        </div>
      )}

      <EraTimeline activeEra={era} />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <JobFilters
          total={result.total}
          pressureCount={pressureCount}
          current={{ q: params.q, status, era, pressure }}
        />
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.items.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center">
                <p className="font-serif text-lg font-medium">
                  No roles match these filters
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try clearing filters or search from the command menu (⌘K)
                </p>
                <Link
                  href="/jobs"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-4 inline-flex"
                  )}
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              result.items.map((job) => (
                <OccupationCard
                  key={job.slug}
                  slug={job.slug}
                  name={job.name}
                  summary={job.summary}
                  status={job.status}
                  eraPrimary={job.eraPrimary}
                  originYear={job.originYear}
                  contentTier={job.contentTier}
                  pressureType={job.pressureType}
                />
              ))
            )}
          </div>

          {result.totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4 text-sm">
              {page > 1 ? (
                <Link
                  href={jobsPageHref(params, page - 1)}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-muted-foreground">
                Page {page} of {result.totalPages}
              </span>
              {page < result.totalPages ? (
                <Link
                  href={jobsPageHref(params, page + 1)}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
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
    </div>
  );
}