import "dotenv/config";
import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../src/db";
import {
  occupationAliases,
  occupationSources,
  occupations,
} from "../src/db/schema";
import { slugify } from "../src/lib/slugify";
import {
  buildEnhancedDuties,
  buildEnhancedRegions,
  buildEnhancedSkills,
  buildEnhancedSummary,
  buildSearchText,
  fetchWikidataOccupationBatch,
  inferCategory,
  inferEra,
  parseWikidataId,
  wikidataEntityUrl,
} from "../src/lib/wikidata";

const BATCH_SIZE = 200;
const RATE_LIMIT_MS = 1200;

function parseArgs() {
  const args = process.argv.slice(2);
  const limit = Number.parseInt(
    args.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ?? "0",
    10
  );
  const offset = Number.parseInt(
    args.find((arg) => arg.startsWith("--offset="))?.split("=")[1] ?? "0",
    10
  );
  const dryRun = args.includes("--dry-run");
  return {
    limit: Number.isFinite(limit) && limit > 0 ? limit : null,
    offset: Number.isFinite(offset) && offset > 0 ? offset : 0,
    dryRun,
  };
}

async function main() {
  const { limit, offset: startOffset, dryRun } = parseArgs();
  const db = getDb();

  const stubRows = await db
    .select({
      id: occupations.id,
      slug: occupations.slug,
      contentTier: occupations.contentTier,
    })
    .from(occupations)
    .where(inArray(occupations.contentTier, ["stub", "enhanced"]));

  const stubBySlug = new Map(stubRows.map((row) => [row.slug, row]));

  let wikidataOffset = startOffset;
  let enriched = 0;
  let scanned = 0;
  let skipped = 0;

  console.log(
    `Enriching stubs from Wikidata (stubs in DB: ${stubRows.length}, dryRun=${dryRun})...`
  );

  while (true) {
    if (limit != null && enriched >= limit) break;

    console.log(`Fetching Wikidata batch offset=${wikidataOffset}...`);
    let rows: Awaited<ReturnType<typeof fetchWikidataOccupationBatch>> = [];
    try {
      rows = await fetchWikidataOccupationBatch(wikidataOffset, BATCH_SIZE);
    } catch (err) {
      console.error(`Batch offset=${wikidataOffset} failed, retrying once...`, err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      rows = await fetchWikidataOccupationBatch(wikidataOffset, BATCH_SIZE);
    }
    if (rows.length === 0) {
      console.log("No more Wikidata rows.");
      break;
    }

    for (const row of rows) {
      if (limit != null && enriched >= limit) break;

      scanned++;
      const slug = slugify(row.label);
      if (!slug) {
        skipped++;
        continue;
      }

      const target = stubBySlug.get(slug);
      if (!target || target.contentTier === "curated") {
        skipped++;
        continue;
      }

      const wikidataId = parseWikidataId(row.item);
      if (!wikidataId) {
        skipped++;
        continue;
      }

      const summary = buildEnhancedSummary(row.description, row.label);
      const duties = buildEnhancedDuties(row.description, row.label);
      const skills = buildEnhancedSkills(row.fields);
      const regions = buildEnhancedRegions(row.countries);
      const category = inferCategory(row.fields, row.description, row.label);
      const aliases = row.aliases
        .filter((alias) => alias.toLowerCase() !== row.label.toLowerCase())
        .slice(0, 8);
      const searchText = buildSearchText({
        name: row.label,
        summary,
        aliases,
        duties,
        skills,
        regions,
        category,
      });

      if (dryRun) {
        console.log(`[dry-run] would enrich ${slug} (${wikidataId})`);
        enriched++;
        continue;
      }

      await db
        .update(occupations)
        .set({
          name: row.label,
          summary,
          duties,
          skills,
          tools: "",
          regions,
          category,
          eraPrimary: inferEra(row.inceptionYear),
          originYear: row.inceptionYear,
          originLabel: row.inceptionYear == null ? null : null,
          dateConfidence: row.inceptionYear != null ? "medium" : "low",
          searchText,
          contentTier: "enhanced",
          wikidataId,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(occupations.id, target.id),
            inArray(occupations.contentTier, ["stub", "enhanced"])
          )
        );

      await db
        .delete(occupationAliases)
        .where(eq(occupationAliases.occupationId, target.id));
      if (aliases.length > 0) {
        await db.insert(occupationAliases).values(
          aliases.map((alias) => ({
            occupationId: target.id,
            alias,
          }))
        );
      }

      await db
        .delete(occupationSources)
        .where(eq(occupationSources.occupationId, target.id));
      await db.insert(occupationSources).values({
        occupationId: target.id,
        title: "Wikidata",
        url: wikidataEntityUrl(wikidataId),
        note: "CC0 — auto-enriched labels, aliases, and fields",
      });

      enriched++;
      if (enriched % 100 === 0) {
        console.log(`Progress: enriched=${enriched} scanned=${scanned}`);
      }
    }

    wikidataOffset += BATCH_SIZE;
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
  }

  console.log(
    `Enrichment complete. enriched=${enriched} scanned=${scanned} skipped=${skipped}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});