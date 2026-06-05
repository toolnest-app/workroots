import Link from "next/link";
import { ERA_LABELS, STATUS_LABELS, ERA_ORDER } from "@/lib/constants";
import type { EraPrimary, OccupationStatus } from "@/db/schema";

interface JobFiltersProps {
  current: {
    q?: string;
    status?: OccupationStatus;
    era?: EraPrimary;
  };
}

function buildHref(
  current: JobFiltersProps["current"],
  patch: Partial<JobFiltersProps["current"]>
) {
  const params = new URLSearchParams();
  const merged = { ...current, ...patch };
  if (merged.q) params.set("q", merged.q);
  if (merged.status) params.set("status", merged.status);
  if (merged.era) params.set("era", merged.era);
  const qs = params.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

export function JobFilters({ current }: JobFiltersProps) {
  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white/70 p-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-stone-500">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref(current, { status: undefined })}
            className="text-sm text-stone-700 underline-offset-2 hover:underline"
          >
            All
          </Link>
          {(Object.keys(STATUS_LABELS) as OccupationStatus[]).map((s) => (
            <Link
              key={s}
              href={buildHref(current, { status: s })}
              className={`text-sm underline-offset-2 hover:underline ${
                current.status === s ? "font-semibold text-stone-900" : "text-stone-600"
              }`}
            >
              {STATUS_LABELS[s]}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-stone-500">Era</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref(current, { era: undefined })}
            className="text-sm text-stone-700 underline-offset-2 hover:underline"
          >
            All eras
          </Link>
          {ERA_ORDER.map((era) => (
            <Link
              key={era}
              href={buildHref(current, { era })}
              className={`text-sm underline-offset-2 hover:underline ${
                current.era === era ? "font-semibold text-stone-900" : "text-stone-600"
              }`}
            >
              {ERA_LABELS[era]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}