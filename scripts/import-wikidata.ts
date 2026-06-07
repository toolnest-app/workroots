import "dotenv/config";
import { getDb } from "../src/db";
import { occupations } from "../src/db/schema";
import { slugify } from "../src/lib/slugify";
import {
  fetchWikidataOccupationBatch,
  inferEra,
  parseWikidataId,
  buildEnhancedSummary,
  buildSearchText,
} from "../src/lib/wikidata";

const BATCH_SIZE = 2500;
const RATE_LIMIT_MS = 1200;

async function main() {
  const db = getDb();
  const existing = await db.select({ slug: occupations.slug }).from(occupations);
  const existingSlugs = new Set(existing.map((r) => r.slug));

  let offset = 0;
  let inserted = 0;
  let skipped = 0;

  while (true) {
    console.log(`Fetching Wikidata batch offset=${offset}...`);
    const rows = await fetchWikidataOccupationBatch(offset, BATCH_SIZE);
    if (rows.length === 0) {
      console.log("No more Wikidata rows.");
      break;
    }

    const values: (typeof occupations.$inferInsert)[] = [];

    for (const row of rows) {
      const slug = slugify(row.label);
      if (!slug || existingSlugs.has(slug)) {
        skipped++;
        continue;
      }

      const wikidataId = parseWikidataId(row.item);
      const summary = buildEnhancedSummary(row.description, row.label);
      const searchText = buildSearchText({
        name: row.label,
        summary,
        aliases: [],
        duties: "",
        skills: "",
        regions: "",
        category: "general",
      });

      values.push({
        slug,
        name: row.label,
        status: "active",
        summary,
        searchText,
        originYear: row.inceptionYear,
        originLabel: null,
        dateConfidence: row.inceptionYear != null ? "medium" : "low",
        eraPrimary: inferEra(row.inceptionYear),
        category: "general",
        wikidataId,
        contentTier: "stub",
      });

      existingSlugs.add(slug);
    }

    if (values.length > 0) {
      await db.insert(occupations).values(values);
      inserted += values.length;
    }

    console.log(`Batch done. inserted=${inserted} skipped=${skipped}`);
    offset += BATCH_SIZE;
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }

  const all = await db.select({ id: occupations.id }).from(occupations);
  console.log(`Wikidata import complete. Total rows: ${all.length}`);
  console.log(`Inserted this run: ${inserted}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});