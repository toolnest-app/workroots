# Occupations

Global occupation encyclopedia and historical archive. Search roles, see how old a job is, explore lineage from ancient crafts to modern careers.

## Local setup

1. Create a [Neon](https://neon.tech) Postgres database.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
3. Push schema and search trigger:

```bash
npm install
npm run db:push
psql "$DATABASE_URL" -f drizzle/manual/001_search.sql
npm run import:showcase
npm run import:wikidata
npm run dev
```

Open http://localhost:3000

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add environment variable `DATABASE_URL` (Neon connection string).
4. Deploy, then run import scripts locally against production `DATABASE_URL` (or use Neon SQL console).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | Unit tests (age display) |
| `npm run import:showcase` | Curated occupations + lineage |
| `npm run import:wikidata` | Bulk Wikidata occupations |

## Docs

- Design: `docs/superpowers/specs/2026-06-05-job-directory-design.md`
- Plan: `docs/superpowers/plans/2026-06-05-job-directory.md`