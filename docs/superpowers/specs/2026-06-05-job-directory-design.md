# Workroots — Design Spec

**Date:** 2026-06-05  
**Status:** Approved  
**Project root:** `/Users/vishnu/Projects/workroots`  
**Deploy target:** Vercel (public)

---

## 1. Summary

Build a public **global occupation encyclopedia** that combines:

- **Encyclopedia (A):** duties, skills, tools, context, related roles
- **Historical archive (C):** ancient → extinct → evolved occupations
- **Current-job lookup (B-lite):** search living roles and see **how old the occupation is**, with lineage to predecessor roles
- **English-first, global** scope for v1 (not US-only)

**Product name:** **Workroots**. Slug namespace: `/jobs/[slug]`.

---

## 2. Goals & non-goals

### Goals (v1)

- Deploy a searchable public website on Vercel
- ~1,500–3,000 seeded occupations with usable detail pages
- Occupation **age** display: best estimate + sources & uncertainty
- **Lineage** (predecessor / successor / related) and **timeline** events
- Browse by era, status, and category
- SEO-friendly static/ISR job pages

### Non-goals (v1)

- “Every job that ever existed” in one release (phased data growth)
- Job listings / applications / employer posts
- Multi-language UI
- User accounts and wiki editing (phase 2: suggest correction only)
- Salary maps and heavy BLS-style analytics (optional O*NET fields later)

---

## 3. Content model

### 3.1 Hybrid curation (approved)

- **Launch:** Curated imports + automated seeding; read-only for visitors
- **Later:** “Suggest a correction” form → moderation queue (no open wiki in v1)

### 3.2 Date & age display (approved: option C)

**Hero (always visible)**

- Best-estimate origin (year or labeled era, e.g. “~1840s”, “Bronze Age craft”)
- If **active:** computed age, e.g. “Recognized for **~180 years**”
- Confidence badge: `high` | `medium` | `low`

**Expandable: Sources & uncertainty**

- `origin_year` (nullable integer)
- `origin_year_end` (nullable, for ranges)
- `origin_label` (human string when year is unknown)
- `date_confidence`
- Citations (title, URL, note)

**Rules**

- Never show false precision when confidence is low; prefer ranges and labels
- `age_years = current_year - origin_year` only when `origin_year` is set and status is active

### 3.3 Occupation fields

| Field | Description |
|-------|-------------|
| `slug` | URL-safe unique id |
| `name` | Primary display name |
| `status` | `active` \| `declining` \| `extinct` \| `regional` |
| `summary` | 2–4 sentence lede |
| `duties` | Markdown/plain text |
| `skills` | Text or structured tags |
| `tools` | Historical and modern tools |
| `regions` | Where role existed/exists |
| `category` | craft, military, clerical, tech, agriculture, … |
| `era_primary` | ancient, medieval, early_modern, industrial, modern, contemporary |
| Origin fields | See §3.2 |
| `search_vector` | Postgres tsvector for FTS |

### 3.4 Related entities

- **aliases** — alternate names
- **relations** — `predecessor` \| `successor` \| `related` (directed edges between occupations)
- **events** — timeline rows (year, label, description)
- **sources** — per-occupation citations

### 3.5 Active-role career block (optional per row)

- `education_path` — short text
- `modern_sectors` — short text
- O*NET-derived fields only when import provides them (no blank placeholders)

---

## 4. Information architecture

| Route | Purpose |
|-------|---------|
| `/` | Hero search, era browse chips, featured occupations |
| `/jobs` | Directory with filters (status, category, era) + pagination |
| `/jobs/[slug]` | Occupation detail |
| `/about` | Methodology, licenses, date confidence explanation |
| `/suggest` | (Phase 2) Correction submission form |

---

## 5. UI / UX

- **Aesthetic:** Reference library / museum catalog — serif or hybrid typography, era badges, timeline strip — not a job-board look
- **Detail page sections (order):** Hero (name, status, age block) → Summary → Lineage → Timeline → Duties / Skills / Tools → Regions → Career (if active) → Sources & uncertainty → Related
- **Lineage:** Horizontal or vertical linked chips with clear predecessor → current → successor
- **Responsive:** Mobile-first search and filters
- Dark mode: v1.1 (out of MVP)

---

## 6. Technical architecture

```
User → Next.js 15 (App Router) → Server Components / Route Handlers
                              → Postgres (Neon via Vercel)
                              → Full-text search (Postgres tsvector)
Import CLI (scripts) → Wikidata SPARQL + bundled seed JSON → Postgres
Deploy → Vercel
```

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| ORM | Drizzle ORM |
| Database | Neon Postgres (`DATABASE_URL`) |
| Search | `to_tsvector` + `plainto_tsquery` MVP |
| Hosting | Vercel |
| CI | GitHub Actions (lint, typecheck, test) optional in v1 |

---

## 7. Data sourcing (phased)

| Phase | Volume | Sources |
|-------|--------|---------|
| MVP seed | 1,500–3,000 | Wikidata occupation query, hand-authored showcase set (~50), merged/deduped |
| v1.1 | 10,000+ | Expanded Wikidata import, ISCO labels as aliases |
| v1.2 | Depth | Longer articles for top 500 by traffic |
| v1.3 | Community | Suggest correction + moderation |

**Licenses:** Store source URL and license note per citation; Wikidata CC0 attribution on `/about`.

---

## 8. Database schema (logical)

```
occupations
occupation_aliases
occupation_relations (from_id, to_id, type)
occupation_events (occupation_id, year, year_end, label, description, sort_order)
occupation_sources (occupation_id, title, url, note)
suggestions (phase 2)
```

Indexes: `slug` unique, GIN on `search_vector`, indexes on `status`, `era_primary`, `category`.

---

## 9. MVP acceptance criteria

1. `vercel deploy` succeeds; home and `/jobs` load in production
2. Search returns relevant results for queries like “blacksmith”, “software”, “scribe”
3. At least **1,500** occupations in DB after import script
4. Detail page shows age block with confidence for active and historical samples
5. Lineage displays when relations exist (showcase occupations wired manually)
6. Filters on `/jobs` work for status and era
7. Lighthouse SEO basics: per-job `title` and `description` metadata

---

## 10. Security & ops

- No auth in v1; rate-limit `/api/suggest` when added
- Env secrets only on Vercel: `DATABASE_URL`
- Import scripts are dev/CI-only, not exposed as public endpoints

---

## 11. Open decisions (post-MVP)

- Final product name and domain
- Meilisearch if Postgres FTS latency unacceptable
- Graph visualization for deep lineage trees

---

## 12. Approval record

- **Approved by user:** 2026-06-05
- **Scope:** A + B-lite + C, English-first global, Hybrid content, Vercel public, Date display C