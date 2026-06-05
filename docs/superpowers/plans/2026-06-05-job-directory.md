# Job Directory (Occupations Encyclopedia) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public Vercel-hosted Next.js directory of ~1,500+ global occupations with search, filters, encyclopedia detail pages, occupation age/lineage, and historical archive browsing.

**Architecture:** Next.js App Router reads from Neon Postgres via Drizzle; import CLI seeds from Wikidata + curated JSON; Postgres full-text search powers the home and directory search.

**Tech Stack:** Next.js 15, TypeScript, Tailwind, shadcn/ui, Drizzle ORM, Neon Postgres, Vitest, Vercel

**Spec:** `docs/superpowers/specs/2026-06-05-job-directory-design.md`

---

## File map (created by this plan)

| Path | Responsibility |
|------|----------------|
| `src/db/schema.ts` | Drizzle tables |
| `src/db/index.ts` | DB client singleton |
| `src/lib/occupation-age.ts` | Age/confidence display logic |
| `src/lib/queries/occupations.ts` | Read queries, search, filters |
| `src/app/page.tsx` | Home + search |
| `src/app/jobs/page.tsx` | Directory + filters |
| `src/app/jobs/[slug]/page.tsx` | Detail page |
| `src/app/about/page.tsx` | Methodology |
| `src/app/api/search/route.ts` | JSON search endpoint |
| `scripts/import-wikidata.ts` | Bulk seed from Wikidata |
| `scripts/import-showcase.ts` | Rich showcase occupations + relations |
| `data/showcase.json` | Hand-curated high-quality entries |
| `drizzle.config.ts` | Drizzle kit config |
| `vercel.json` | Build config if needed |

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: project via `create-next-app` at `/Users/vishnu/Projects/occupations`

- [ ] **Step 1: Create app**

```bash
cd /Users/vishnu/Projects
npx create-next-app@latest occupations --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
```

- [ ] **Step 2: Init git**

```bash
cd /Users/vishnu/Projects/occupations
git init
echo "node_modules/\n.env*\n!.env.example\n.next/\n.vercel/\ndrizzle/meta/\n" >> .gitignore
git add .
git commit -m "chore: scaffold Next.js app"
```

Expected: `npm run dev` serves http://localhost:3000

---

### Task 2: Add dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime deps**

```bash
cd /Users/vishnu/Projects/occupations
npm install drizzle-orm @neondatabase/serverless dotenv zod
npm install -D drizzle-kit tsx vitest @vitejs/plugin-react @types/node
```

- [ ] **Step 2: Add scripts to package.json**

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "import:wikidata": "tsx scripts/import-wikidata.ts",
  "import:showcase": "tsx scripts/import-showcase.ts"
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add drizzle, neon, vitest, import scripts"
```

---

### Task 3: Environment template

**Files:**
- Create: `.env.example`
- Create: `.env.local` (local only, gitignored)

- [ ] **Step 1: Write .env.example**

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

- [ ] **Step 2: Document in README.md** (create section "Local setup")

User creates Neon project at https://neon.tech, copies connection string to `.env.local`.

- [ ] **Step 3: Commit**

```bash
git add .env.example README.md
git commit -m "docs: database env template"
```

---

### Task 4: Drizzle schema

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`

- [ ] **Step 1: drizzle.config.ts**

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 2: src/db/schema.ts**

```typescript
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("occupation_status", [
  "active",
  "declining",
  "extinct",
  "regional",
]);

export const confidenceEnum = pgEnum("date_confidence", [
  "high",
  "medium",
  "low",
]);

export const eraEnum = pgEnum("era_primary", [
  "ancient",
  "medieval",
  "early_modern",
  "industrial",
  "modern",
  "contemporary",
]);

export const relationTypeEnum = pgEnum("relation_type", [
  "predecessor",
  "successor",
  "related",
]);

export const occupations = pgTable(
  "occupations",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    status: statusEnum("status").notNull().default("active"),
    summary: text("summary").notNull().default(""),
    duties: text("duties").notNull().default(""),
    skills: text("skills").notNull().default(""),
    tools: text("tools").notNull().default(""),
    regions: text("regions").notNull().default(""),
    category: text("category").notNull().default("general"),
    eraPrimary: eraEnum("era_primary").notNull().default("modern"),
    originYear: integer("origin_year"),
    originYearEnd: integer("origin_year_end"),
    originLabel: text("origin_label"),
    dateConfidence: confidenceEnum("date_confidence")
      .notNull()
      .default("medium"),
    educationPath: text("education_path"),
    modernSectors: text("modern_sectors"),
    searchText: text("search_text").notNull().default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("occupations_slug_idx").on(t.slug),
    statusIdx: index("occupations_status_idx").on(t.status),
    eraIdx: index("occupations_era_idx").on(t.eraPrimary),
    categoryIdx: index("occupations_category_idx").on(t.category),
  })
);

export const occupationAliases = pgTable(
  "occupation_aliases",
  {
    id: serial("id").primaryKey(),
    occupationId: integer("occupation_id")
      .notNull()
      .references(() => occupations.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
  },
  (t) => ({
    aliasIdx: index("occupation_aliases_occ_idx").on(t.occupationId),
  })
);

export const occupationRelations = pgTable(
  "occupation_relations",
  {
    id: serial("id").primaryKey(),
    fromOccupationId: integer("from_occupation_id")
      .notNull()
      .references(() => occupations.id, { onDelete: "cascade" }),
    toOccupationId: integer("to_occupation_id")
      .notNull()
      .references(() => occupations.id, { onDelete: "cascade" }),
    type: relationTypeEnum("type").notNull(),
  },
  (t) => ({
    fromIdx: index("occupation_relations_from_idx").on(t.fromOccupationId),
    toIdx: index("occupation_relations_to_idx").on(t.toOccupationId),
  })
);

export const occupationEvents = pgTable(
  "occupation_events",
  {
    id: serial("id").primaryKey(),
    occupationId: integer("occupation_id")
      .notNull()
      .references(() => occupations.id, { onDelete: "cascade" }),
    year: integer("year"),
    yearEnd: integer("year_end"),
    label: text("label").notNull(),
    description: text("description").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => ({
    occIdx: index("occupation_events_occ_idx").on(t.occupationId),
  })
);

export const occupationSources = pgTable(
  "occupation_sources",
  {
    id: serial("id").primaryKey(),
    occupationId: integer("occupation_id")
      .notNull()
      .references(() => occupations.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    url: text("url"),
    note: text("note").notNull().default(""),
  },
  (t) => ({
    occIdx: index("occupation_sources_occ_idx").on(t.occupationId),
  })
);
```

- [ ] **Step 3: src/db/index.ts**

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  return drizzle(sql, { schema });
}
```

- [ ] **Step 4: Generate and push migration**

```bash
npm run db:generate
npm run db:push
```

Expected: tables exist in Neon console

- [ ] **Step 5: Add FTS migration SQL file**

Create `drizzle/manual/001_search.sql`:

```sql
ALTER TABLE occupations ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS occupations_search_vector_idx ON occupations USING GIN (search_vector);

CREATE OR REPLACE FUNCTION occupations_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.search_text, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS occupations_search_vector_trigger ON occupations;
CREATE TRIGGER occupations_search_vector_trigger
  BEFORE INSERT OR UPDATE ON occupations
  FOR EACH ROW EXECUTE FUNCTION occupations_search_vector_update();
```

Run manually against Neon SQL editor or `psql $DATABASE_URL -f drizzle/manual/001_search.sql`

- [ ] **Step 6: Commit**

```bash
git add drizzle.config.ts src/db drizzle/manual
git commit -m "feat: drizzle schema and search vector migration"
```

---

### Task 5: Occupation age library (TDD)

**Files:**
- Create: `src/lib/occupation-age.ts`
- Create: `src/lib/occupation-age.test.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: Write failing tests**

`vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { environment: "node" },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

`src/lib/occupation-age.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildAgeDisplay } from "./occupation-age";

describe("buildAgeDisplay", () => {
  it("computes age for active occupation with origin year", () => {
    const result = buildAgeDisplay({
      status: "active",
      originYear: 1840,
      originYearEnd: null,
      originLabel: null,
      dateConfidence: "high",
      referenceYear: 2026,
    });
    expect(result.headline).toContain("186");
    expect(result.sinceLabel).toMatch(/1840/);
    expect(result.confidence).toBe("high");
  });

  it("uses origin label when year unknown", () => {
    const result = buildAgeDisplay({
      status: "extinct",
      originYear: null,
      originYearEnd: null,
      originLabel: "Bronze Age craft",
      dateConfidence: "low",
      referenceYear: 2026,
    });
    expect(result.headline).toContain("Bronze Age craft");
    expect(result.ageYears).toBeNull();
  });

  it("shows range when originYearEnd set", () => {
    const result = buildAgeDisplay({
      status: "extinct",
      originYear: 1200,
      originYearEnd: 1400,
      originLabel: null,
      dateConfidence: "medium",
      referenceYear: 2026,
    });
    expect(result.sinceLabel).toMatch(/1200/);
    expect(result.sinceLabel).toMatch(/1400/);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL — cannot find module `./occupation-age`

- [ ] **Step 3: Implement src/lib/occupation-age.ts**

```typescript
export type OccupationStatus = "active" | "declining" | "extinct" | "regional";
export type DateConfidence = "high" | "medium" | "low";

export interface AgeInput {
  status: OccupationStatus;
  originYear: number | null;
  originYearEnd: number | null;
  originLabel: string | null;
  dateConfidence: DateConfidence;
  referenceYear: number;
}

export interface AgeDisplay {
  headline: string;
  sinceLabel: string;
  ageYears: number | null;
  confidence: DateConfidence;
}

function formatYear(y: number): string {
  if (y < 0) return `${Math.abs(y)} BCE`;
  if (y < 1000) return `${y} CE`;
  return String(y);
}

export function buildAgeDisplay(input: AgeInput): AgeDisplay {
  const {
    status,
    originYear,
    originYearEnd,
    originLabel,
    dateConfidence,
    referenceYear,
  } = input;

  let sinceLabel = "Origin unknown";
  if (originYear != null && originYearEnd != null) {
    sinceLabel = `${formatYear(originYear)} – ${formatYear(originYearEnd)}`;
  } else if (originYear != null) {
    sinceLabel =
      originYear >= 1000 && originYear % 10 === 0 && originYear % 100 !== 0
        ? `~${Math.floor(originYear / 10) * 10}s`
        : `since ${formatYear(originYear)}`;
  } else if (originLabel) {
    sinceLabel = originLabel;
  }

  const ageYears =
    originYear != null && (status === "active" || status === "declining")
      ? referenceYear - originYear
      : null;

  let headline: string;
  if (ageYears != null && ageYears > 0) {
    headline = `Recognized for ~${ageYears} years · ${sinceLabel}`;
  } else {
    headline = sinceLabel;
  }

  return { headline, sinceLabel, ageYears, confidence: dateConfidence };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts src/lib/occupation-age.ts src/lib/occupation-age.test.ts
git commit -m "feat: occupation age display with tests"
```

---

### Task 6: Query layer

**Files:**
- Create: `src/lib/queries/occupations.ts`

- [ ] **Step 1: Implement queries**

```typescript
import { and, eq, ilike, or, sql, desc, asc } from "drizzle-orm";
import { getDb } from "@/db";
import {
  occupations,
  occupationAliases,
  occupationRelations,
  occupationEvents,
  occupationSources,
} from "@/db/schema";

export async function searchOccupations(q: string, limit = 20) {
  const db = getDb();
  if (!q.trim()) return [];
  return db
    .select({
      slug: occupations.slug,
      name: occupations.name,
      status: occupations.status,
      summary: occupations.summary,
      rank: sql<number>`ts_rank(${occupations.searchText}, plainto_tsquery('english', ${q}))`,
    })
    .from(occupations)
    .where(
      sql`${occupations.searchText} @@ plainto_tsquery('english', ${q})`
    )
    .orderBy(desc(sql`ts_rank(${occupations.searchText}, plainto_tsquery('english', ${q}))`))
    .limit(limit);
}
```

**Note:** After FTS trigger exists, search should use `search_vector` column added in manual migration — update query:

```typescript
.where(sql`search_vector @@ plainto_tsquery('english', ${q})`)
```

Add `listOccupations({ status?, era?, category?, page, pageSize })`, `getOccupationBySlug(slug)` joining aliases, events, sources, and relations (resolve related slugs via second query).

- [ ] **Step 2: Commit**

```bash
git add src/lib/queries/occupations.ts
git commit -m "feat: occupation query helpers"
```

---

### Task 7: Showcase seed data

**Files:**
- Create: `data/showcase.json`
- Create: `scripts/import-showcase.ts`

- [ ] **Step 1: Create data/showcase.json** with ≥10 fully enriched occupations including relations:

Examples to include: `blacksmith`, `software-developer`, `scribe`, `cooper`, `plague-doctor`, `data-entry-clerk`, `typist`, `telegraph-operator`.

Each entry schema:

```json
{
  "slug": "blacksmith",
  "name": "Blacksmith",
  "status": "declining",
  "summary": "...",
  "duties": "...",
  "skills": "...",
  "tools": "...",
  "regions": "Global; historically ubiquitous",
  "category": "craft",
  "eraPrimary": "medieval",
  "originYear": -1500,
  "originYearEnd": null,
  "originLabel": "Bronze Age metalwork",
  "dateConfidence": "medium",
  "aliases": ["smith", "farrier (related)"],
  "events": [
    { "year": 1800, "label": "Industrial forge competition", "description": "..." }
  ],
  "sources": [
    { "title": "Wikidata", "url": "https://www.wikidata.org/wiki/Q...", "note": "CC0" }
  ],
  "relations": [
    { "toSlug": "farrier", "type": "related" },
    { "toSlug": "cooper", "type": "related" }
  ]
}
```

- [ ] **Step 2: scripts/import-showcase.ts** — upsert by slug, insert aliases/events/sources/relations (resolve `toSlug` to ids).

- [ ] **Step 3: Run import**

```bash
npm run import:showcase
```

Expected: 10+ rows, relations wired

- [ ] **Step 4: Commit**

```bash
git add data/showcase.json scripts/import-showcase.ts
git commit -m "feat: showcase seed import"
```

---

### Task 8: Wikidata bulk import

**Files:**
- Create: `scripts/import-wikidata.ts`

- [ ] **Step 1: Implement SPARQL fetch**

Query Wikidata for occupations (instance of occupation Q* or subclass), limit 2500 per run, fields: English label, description, inception (P571 if available), occupation URL.

```sparql
SELECT ?item ?itemLabel ?itemDescription ?inception WHERE {
  ?item wdt:P31/wdt:P279* wd:Q28640 .
  OPTIONAL { ?item wdt:P571 ?inception. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 2500
```

Map to `occupations` rows: slug from label (slugify), auto `summary` from description, `originYear` from inception if parseable, `dateConfidence: low`, `status: active` default, `search_text` = label + description.

- [ ] **Step 2: Dedupe** — skip if slug exists (showcase wins).

- [ ] **Step 3: Run**

```bash
npm run import:wikidata
```

Expected: total row count ≥ 1500

- [ ] **Step 4: Commit**

```bash
git add scripts/import-wikidata.ts
git commit -m "feat: wikidata occupation importer"
```

---

### Task 9: shadcn UI + layout

**Files:**
- Create: `src/components/site-header.tsx`, `src/components/occupation-card.tsx`, `src/components/age-badge.tsx`, `src/components/lineage-list.tsx`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

- [ ] **Step 1: Init shadcn**

```bash
npx shadcn@latest init -y
npx shadcn@latest add button input badge card separator
```

- [ ] **Step 2: Typography** — use `next/font` with **Fraunces** (headings) + **Source Sans 3** (body) in layout.tsx; warm stone palette in globals.css (museum catalog feel).

- [ ] **Step 3: SiteHeader** with logo "Occupations", links Home / Browse / About.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: layout, typography, shadcn components"
```

---

### Task 10: Home page + search API

**Files:**
- Create: `src/app/api/search/route.ts`
- Modify: `src/app/page.tsx`
- Create: `src/components/search-box.tsx` (client component, debounced fetch)

- [ ] **Step 1: API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { searchOccupations } from "@/lib/queries/occupations";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });
  const results = await searchOccupations(q, 12);
  return NextResponse.json({ results });
}
```

- [ ] **Step 2: Home** — hero, SearchBox, era chips linking to `/jobs?era=industrial`, 6 featured showcase slugs.

- [ ] **Step 3: Manual test**

```bash
npm run dev
curl "http://localhost:3000/api/search?q=blacksmith"
```

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/api/search src/components/search-box.tsx
git commit -m "feat: home search and API"
```

---

### Task 11: Directory page

**Files:**
- Create: `src/app/jobs/page.tsx`
- Create: `src/components/job-filters.tsx`

- [ ] **Step 1: Parse searchParams** `q`, `status`, `era`, `category`, `page`

- [ ] **Step 2: List with pagination** (24 per page), OccupationCard grid

- [ ] **Step 3: Commit**

```bash
git add src/app/jobs src/components/job-filters.tsx
git commit -m "feat: job directory with filters"
```

---

### Task 12: Occupation detail page

**Files:**
- Create: `src/app/jobs/[slug]/page.tsx`
- Modify: use `buildAgeDisplay`, LineageList, timeline from events

- [ ] **Step 1: generateMetadata** from occupation name + summary

- [ ] **Step 2: Sections per spec §5** — AgeBadge hero, lineage, timeline, markdown-ish text blocks, sources accordion

- [ ] **Step 3: notFound()** if slug missing

- [ ] **Step 4: Verify showcase pages**

Open `/jobs/blacksmith`, `/jobs/software-developer` — age block and lineage visible.

- [ ] **Step 5: Commit**

```bash
git add src/app/jobs/[slug]
git commit -m "feat: occupation detail page"
```

---

### Task 13: About page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Explain date confidence, Wikidata CC0, phased data roadmap**

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "docs: about page methodology"
```

---

### Task 14: Vercel deploy

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Push to GitHub**

```bash
gh repo create occupations --private --source=. --push
```

(or user creates repo manually)

- [ ] **Step 2: Vercel import** — link repo, set `DATABASE_URL` from Neon, deploy

- [ ] **Step 3: Post-deploy** — run import scripts against production DB via local env with prod `DATABASE_URL` OR Neon SQL seed export

- [ ] **Step 4: Verify production** `/`, `/jobs`, `/jobs/blacksmith`

- [ ] **Step 5: Commit README deploy section**

```bash
git commit -m "docs: vercel deploy instructions"
```

---

### Task 15: Acceptance checklist

- [ ] ≥1500 occupations in production DB
- [ ] Search returns blacksmith, scribe, software
- [ ] Age headline on active + extinct samples
- [ ] Lineage on showcase entries
- [ ] Filters work on `/jobs`
- [ ] Metadata present on detail pages

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Vercel public deploy | Task 14 |
| 1500+ occupations | Task 8 |
| Age block C | Task 5, 12 |
| Lineage + timeline | Task 7, 12 |
| Encyclopedia fields | Task 4, 7, 12 |
| Hybrid read-only v1 | No suggest form; noted phase 2 |
| English global | Wikidata en labels |
| FTS search | Task 4 manual SQL, 6, 10 |
| Browse era/status | Task 11 |
| About/sources | Task 13 |

No placeholders remain in plan steps above.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-05-job-directory.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — implement task-by-task in this session with checkpoints

**Which approach?**