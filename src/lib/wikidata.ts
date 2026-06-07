import type { EraPrimary } from "@/db/schema";

export const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
export const WIKIDATA_USER_AGENT =
  "WorkrootsDirectory/1.0 (educational; contact: local-dev)";

export interface WikidataOccupationRow {
  item: string;
  label: string;
  description: string;
  inceptionYear: number | null;
  aliases: string[];
  fields: string[];
  countries: string[];
}

interface SparqlBinding {
  item?: { value: string };
  itemLabel?: { value: string };
  itemDescription?: { value: string };
  inception?: { value: string };
  alias?: { value: string };
  fieldLabel?: { value: string };
  countryLabel?: { value: string };
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  medicine: [
    "medicine",
    "health",
    "nursing",
    "clinical",
    "medical",
    "pharmacy",
    "surgery",
  ],
  military: ["military", "army", "navy", "warfare", "soldier", "defense"],
  education: ["education", "teaching", "pedagogy", "school", "academic"],
  arts: [
    "art",
    "music",
    "theatre",
    "theater",
    "film",
    "dance",
    "literature",
    "performance",
  ],
  law: ["law", "legal", "judicial", "court", "governance", "politics"],
  maritime: ["maritime", "naval", "shipping", "fishing", "sail"],
  hospitality: ["hospitality", "hotel", "restaurant", "tourism", "food service"],
  science: [
    "science",
    "engineering",
    "research",
    "physics",
    "chemistry",
    "biology",
    "mathematics",
  ],
  religion: ["religion", "church", "clergy", "theology", "worship"],
  aviation: ["aviation", "aerospace", "aircraft", "flight"],
  finance: ["finance", "banking", "commerce", "business", "economics", "trade"],
  retail: ["retail", "sales", "craft", "manufacturing", "shop"],
  sports: ["sport", "athletic", "game", "recreation"],
  fashion: ["fashion", "beauty", "textile", "clothing", "cosmetic"],
};

export function parseWikidataId(itemUrl: string): string | null {
  const match = itemUrl.match(/\/(Q\d+)$/i);
  return match ? match[1].toUpperCase() : null;
}

export function wikidataEntityUrl(id: string): string {
  return `https://www.wikidata.org/wiki/${id}`;
}

export function parseInceptionYear(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/^(-?\d{4})/);
  if (!match) return null;
  return Number.parseInt(match[1], 10);
}

export function inferEra(year: number | null): EraPrimary {
  if (year == null) return "modern";
  if (year < 500) return "ancient";
  if (year < 1500) return "medieval";
  if (year < 1800) return "early_modern";
  if (year < 1900) return "industrial";
  if (year < 2000) return "modern";
  return "contemporary";
}

export function splitPipeList(value?: string): string[] {
  if (!value?.trim()) return [];
  return [...new Set(value.split("|").map((part) => part.trim()).filter(Boolean))];
}

export function inferCategory(
  fields: string[],
  description: string,
  label: string
): string {
  const haystack = [...fields, description, label].join(" ").toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return category;
    }
  }
  return "general";
}

export function buildEnhancedSummary(description: string, label: string): string {
  const trimmed = description.trim();
  if (trimmed) return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
  return `Occupation: ${label}.`;
}

export function buildEnhancedDuties(description: string, label: string): string {
  const trimmed = description.trim();
  if (!trimmed) {
    return `Work associated with the role of ${label}.`;
  }
  const sentence = trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function buildEnhancedSkills(fields: string[]): string {
  if (fields.length === 0) return "";
  return `Knowledge areas commonly associated with this role include ${fields.join(", ")}.`;
}

export function buildEnhancedRegions(countries: string[]): string {
  if (countries.length === 0) return "";
  const limited = countries.slice(0, 8);
  const suffix =
    countries.length > limited.length
      ? ` and ${countries.length - limited.length} more`
      : "";
  return `Documented in: ${limited.join(", ")}${suffix}.`;
}

export function buildSearchText(parts: {
  name: string;
  summary: string;
  aliases: string[];
  duties: string;
  skills: string;
  regions: string;
  category: string;
}): string {
  return [
    parts.name,
    parts.summary,
    ...parts.aliases,
    parts.duties,
    parts.skills,
    parts.regions,
    parts.category,
  ]
    .filter(Boolean)
    .join(" ");
}

export function parseWikidataBinding(row: SparqlBinding): WikidataOccupationRow | null {
  const label = row.itemLabel?.value?.trim();
  const item = row.item?.value;
  if (!label || !item || label.endsWith("(Q")) return null;

  const alias = row.alias?.value?.trim();
  const field = row.fieldLabel?.value?.trim();
  const country = row.countryLabel?.value?.trim();

  return {
    item,
    label,
    description: row.itemDescription?.value?.trim() ?? "",
    inceptionYear: parseInceptionYear(row.inception?.value),
    aliases: alias ? [alias] : [],
    fields: field ? [field] : [],
    countries: country ? [country] : [],
  };
}

function aggregateWikidataRows(bindings: SparqlBinding[]): WikidataOccupationRow[] {
  const grouped = new Map<
    string,
    {
      item: string;
      label: string;
      description: string;
      inception?: string;
      aliases: Set<string>;
      fields: Set<string>;
      countries: Set<string>;
    }
  >();

  for (const row of bindings) {
    const label = row.itemLabel?.value?.trim();
    const item = row.item?.value;
    if (!label || !item || label.endsWith("(Q")) continue;

    let entry = grouped.get(item);
    if (!entry) {
      entry = {
        item,
        label,
        description: row.itemDescription?.value?.trim() ?? "",
        inception: row.inception?.value,
        aliases: new Set<string>(),
        fields: new Set<string>(),
        countries: new Set<string>(),
      };
      grouped.set(item, entry);
    }

    const alias = row.alias?.value?.trim();
    if (alias) entry.aliases.add(alias);

    const field = row.fieldLabel?.value?.trim();
    if (field) entry.fields.add(field);

    const country = row.countryLabel?.value?.trim();
    if (country) entry.countries.add(country);
  }

  return [...grouped.values()].map((entry) => ({
    item: entry.item,
    label: entry.label,
    description: entry.description,
    inceptionYear: parseInceptionYear(entry.inception),
    aliases: [...entry.aliases],
    fields: [...entry.fields],
    countries: [...entry.countries],
  }));
}

export async function fetchWikidataOccupationBatch(
  offset: number,
  batchSize: number
): Promise<WikidataOccupationRow[]> {
  const query = `
SELECT ?item ?itemLabel ?itemDescription ?inception ?alias ?fieldLabel ?countryLabel WHERE {
  {
    SELECT ?item ?itemLabel ?itemDescription ?inception WHERE {
      ?item wdt:P31/wdt:P279* wd:Q28640 .
      OPTIONAL { ?item wdt:P571 ?inception. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY ?item
    LIMIT ${batchSize} OFFSET ${offset}
  }
  OPTIONAL {
    ?item skos:altLabel ?alias .
    FILTER(LANG(?alias) = "en")
  }
  OPTIONAL {
    ?item wdt:P101 ?field .
    ?field rdfs:label ?fieldLabel .
    FILTER(LANG(?fieldLabel) = "en")
  }
  OPTIONAL {
    ?item wdt:P17 ?country .
    ?country rdfs:label ?countryLabel .
    FILTER(LANG(?countryLabel) = "en")
  }
}
`;

  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}`;
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": WIKIDATA_USER_AGENT,
      },
    });

    if (res.ok) {
      const json = (await res.json()) as {
        results: { bindings: SparqlBinding[] };
      };

      return aggregateWikidataRows(json.results.bindings);
    }

    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt === maxAttempts) {
      throw new Error(`Wikidata query failed: ${res.status} ${res.statusText}`);
    }

    const delayMs = 2000 * attempt;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return [];
}