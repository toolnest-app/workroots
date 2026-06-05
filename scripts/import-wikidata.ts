import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { occupations } from "../src/db/schema";
import { slugify } from "../src/lib/slugify";

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
const BATCH_SIZE = 2500;

interface SparqlBinding {
  item?: { value: string };
  itemLabel?: { value: string };
  itemDescription?: { value: string };
  inception?: { value: string };
}

async function fetchBatch(offset: number) {
  const query = `
SELECT ?item ?itemLabel ?itemDescription ?inception WHERE {
  ?item wdt:P31/wdt:P279* wd:Q28640 .
  OPTIONAL { ?item wdt:P571 ?inception. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT ${BATCH_SIZE} OFFSET ${offset}
`;

  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "OccupationsDirectory/1.0 (educational; contact: local-dev)",
    },
  });

  if (!res.ok) {
    throw new Error(`Wikidata query failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as {
    results: { bindings: SparqlBinding[] };
  };
  return json.results.bindings;
}

function parseInceptionYear(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/^(-?\d{4})/);
  if (!match) return null;
  return Number.parseInt(match[1], 10);
}

function inferEra(year: number | null): typeof occupations.$inferInsert.eraPrimary {
  if (year == null) return "modern";
  if (year < 500) return "ancient";
  if (year < 1500) return "medieval";
  if (year < 1800) return "early_modern";
  if (year < 1900) return "industrial";
  if (year < 2000) return "modern";
  return "contemporary";
}

async function main() {
  const db = getDb();
  const existing = await db.select({ slug: occupations.slug }).from(occupations);
  const existingSlugs = new Set(existing.map((r) => r.slug));

  let offset = 0;
  let inserted = 0;
  let skipped = 0;

  while (true) {
    console.log(`Fetching Wikidata batch offset=${offset}...`);
    const bindings = await fetchBatch(offset);
    if (bindings.length === 0) break;

    const values: (typeof occupations.$inferInsert)[] = [];

    for (const row of bindings) {
      const label = row.itemLabel?.value?.trim();
      if (!label || label.endsWith("(Q")) continue;

      const slug = slugify(label);
      if (!slug || existingSlugs.has(slug)) {
        skipped++;
        continue;
      }

      const description = row.itemDescription?.value?.trim() ?? "";
      const originYear = parseInceptionYear(row.inception?.value);
      const itemUrl = row.item?.value ?? null;

      values.push({
        slug,
        name: label,
        status: "active",
        summary: description || `Occupation: ${label}.`,
        searchText: [label, description].filter(Boolean).join(" "),
        originYear,
        originLabel: originYear == null ? null : null,
        dateConfidence: originYear != null ? "medium" : "low",
        eraPrimary: inferEra(originYear),
        category: "general",
      });

      existingSlugs.add(slug);
    }

    if (values.length > 0) {
      await db.insert(occupations).values(values);
      inserted += values.length;
    }

    console.log(`Batch done. inserted=${inserted} skipped=${skipped}`);
    if (bindings.length < BATCH_SIZE) break;
    offset += BATCH_SIZE;
    await new Promise((r) => setTimeout(r, 1200));
  }

  const all = await db.select({ id: occupations.id }).from(occupations);
  console.log(`Wikidata import complete. Total rows: ${all.length}`);
  console.log(`Inserted this run: ${inserted}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});