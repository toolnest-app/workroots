import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import {
  occupationAliases,
  occupationEvents,
  occupationRelations,
  occupationSources,
  occupations,
} from "../src/db/schema";

interface ShowcaseRelation {
  toSlug: string;
  type: "predecessor" | "successor" | "related";
}

interface ShowcaseEntry {
  slug: string;
  name: string;
  status: "active" | "declining" | "extinct" | "regional";
  summary: string;
  duties: string;
  skills: string;
  tools: string;
  regions: string;
  category: string;
  eraPrimary:
    | "ancient"
    | "medieval"
    | "early_modern"
    | "industrial"
    | "modern"
    | "contemporary";
  originYear: number | null;
  originYearEnd: number | null;
  originLabel: string | null;
  dateConfidence: "high" | "medium" | "low";
  educationPath?: string;
  modernSectors?: string;
  aliases: string[];
  events: Array<{
    year: number | null;
    yearEnd?: number | null;
    label: string;
    description: string;
    sortOrder?: number;
  }>;
  sources: Array<{ title: string; url: string | null; note: string }>;
  relations: ShowcaseRelation[];
}

async function main() {
  const db = getDb();
  const raw = readFileSync(
    join(process.cwd(), "data/showcase.json"),
    "utf-8"
  );
  const entries = JSON.parse(raw) as ShowcaseEntry[];
  const slugToId = new Map<string, number>();

  for (const entry of entries) {
    const searchText = [
      entry.name,
      entry.summary,
      ...entry.aliases,
      entry.duties,
    ].join(" ");

    const [row] = await db
      .insert(occupations)
      .values({
        slug: entry.slug,
        name: entry.name,
        status: entry.status,
        summary: entry.summary,
        duties: entry.duties,
        skills: entry.skills,
        tools: entry.tools,
        regions: entry.regions,
        category: entry.category,
        eraPrimary: entry.eraPrimary,
        originYear: entry.originYear,
        originYearEnd: entry.originYearEnd,
        originLabel: entry.originLabel,
        dateConfidence: entry.dateConfidence,
        educationPath: entry.educationPath ?? null,
        modernSectors: entry.modernSectors ?? null,
        searchText,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: occupations.slug,
        set: {
          name: entry.name,
          status: entry.status,
          summary: entry.summary,
          duties: entry.duties,
          skills: entry.skills,
          tools: entry.tools,
          regions: entry.regions,
          category: entry.category,
          eraPrimary: entry.eraPrimary,
          originYear: entry.originYear,
          originYearEnd: entry.originYearEnd,
          originLabel: entry.originLabel,
          dateConfidence: entry.dateConfidence,
          educationPath: entry.educationPath ?? null,
          modernSectors: entry.modernSectors ?? null,
          searchText,
          updatedAt: new Date(),
        },
      })
      .returning({ id: occupations.id });

    slugToId.set(entry.slug, row.id);

    await db
      .delete(occupationAliases)
      .where(eq(occupationAliases.occupationId, row.id));
    await db
      .delete(occupationEvents)
      .where(eq(occupationEvents.occupationId, row.id));
    await db
      .delete(occupationSources)
      .where(eq(occupationSources.occupationId, row.id));
    await db
      .delete(occupationRelations)
      .where(eq(occupationRelations.fromOccupationId, row.id));

    if (entry.aliases.length > 0) {
      await db.insert(occupationAliases).values(
        entry.aliases.map((alias) => ({
          occupationId: row.id,
          alias,
        }))
      );
    }

    if (entry.events.length > 0) {
      await db.insert(occupationEvents).values(
        entry.events.map((ev, i) => ({
          occupationId: row.id,
          year: ev.year,
          yearEnd: ev.yearEnd ?? null,
          label: ev.label,
          description: ev.description,
          sortOrder: ev.sortOrder ?? i,
        }))
      );
    }

    if (entry.sources.length > 0) {
      await db.insert(occupationSources).values(
        entry.sources.map((s) => ({
          occupationId: row.id,
          title: s.title,
          url: s.url,
          note: s.note,
        }))
      );
    }
  }

  for (const entry of entries) {
    const fromId = slugToId.get(entry.slug);
    if (!fromId) continue;
    for (const rel of entry.relations) {
      const toId = slugToId.get(rel.toSlug);
      if (!toId) {
        console.warn(`Missing relation target: ${rel.toSlug}`);
        continue;
      }
      await db.insert(occupationRelations).values({
        fromOccupationId: fromId,
        toOccupationId: toId,
        type: rel.type,
      });
    }
  }

  console.log(`Imported ${entries.length} showcase occupations.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});