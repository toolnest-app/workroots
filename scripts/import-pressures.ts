import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { and, eq } from "drizzle-orm";
import { getDb } from "../src/db";
import {
  occupationEvents,
  occupationSources,
  occupations,
} from "../src/db/schema";

const PRESSURE_SOURCE_NOTE = "Current pressures citation";

interface PressureEntry {
  slug: string;
  pressureType:
    | "augmented"
    | "displaced_tasks"
    | "transformed"
    | "resilient"
    | "emerging";
  pressureConfidence: "high" | "medium" | "low";
  summary: string;
  event?: {
    year: number | null;
    yearEnd?: number | null;
    label: string;
    description: string;
    sortOrder?: number;
  };
  sources?: Array<{ title: string; url: string | null; note?: string }>;
}

async function main() {
  const db = getDb();
  const raw = readFileSync(
    join(process.cwd(), "data", "showcase-pressures.json"),
    "utf-8"
  );
  const entries = JSON.parse(raw) as PressureEntry[];
  let updated = 0;

  for (const entry of entries) {
    const [row] = await db
      .select({ id: occupations.id })
      .from(occupations)
      .where(eq(occupations.slug, entry.slug))
      .limit(1);

    if (!row) {
      console.warn(`Skipping unknown slug: ${entry.slug}`);
      continue;
    }

    await db
      .update(occupations)
      .set({
        pressureType: entry.pressureType,
        pressureConfidence: entry.pressureConfidence,
        pressureSummary: entry.summary,
        updatedAt: new Date(),
      })
      .where(eq(occupations.id, row.id));

    if (entry.event) {
      const [existing] = await db
        .select({ id: occupationEvents.id })
        .from(occupationEvents)
        .where(
          and(
            eq(occupationEvents.occupationId, row.id),
            eq(occupationEvents.label, entry.event.label)
          )
        )
        .limit(1);

      if (!existing) {
        await db.insert(occupationEvents).values({
          occupationId: row.id,
          year: entry.event.year,
          yearEnd: entry.event.yearEnd ?? null,
          label: entry.event.label,
          description: entry.event.description,
          sortOrder: entry.event.sortOrder ?? 99,
        });
      }
    }

    if (entry.sources?.length) {
      await db
        .delete(occupationSources)
        .where(
          and(
            eq(occupationSources.occupationId, row.id),
            eq(occupationSources.note, PRESSURE_SOURCE_NOTE)
          )
        );

      await db.insert(occupationSources).values(
        entry.sources.map((source) => ({
          occupationId: row.id,
          title: source.title,
          url: source.url,
          note: source.note ?? PRESSURE_SOURCE_NOTE,
        }))
      );
    }

    updated += 1;
  }

  console.log(`Imported current pressures for ${updated} occupations.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});