import { and, asc, desc, eq, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import {
  occupationAliases,
  occupationEvents,
  occupationRelations,
  occupationSources,
  occupations,
  type EraPrimary,
  type OccupationStatus,
} from "@/db/schema";

export interface ListFilters {
  q?: string;
  status?: OccupationStatus;
  era?: EraPrimary;
  category?: string;
  page?: number;
  pageSize?: number;
}

export async function searchOccupations(q: string, limit = 20) {
  const db = getDb();
  const trimmed = q.trim();
  if (!trimmed) return [];

  return db
    .select({
      slug: occupations.slug,
      name: occupations.name,
      status: occupations.status,
      summary: occupations.summary,
      eraPrimary: occupations.eraPrimary,
    })
    .from(occupations)
    .where(
      sql`${occupations.searchVector} @@ plainto_tsquery('english', ${trimmed})`
    )
    .orderBy(
      desc(
        sql`ts_rank(${occupations.searchVector}, plainto_tsquery('english', ${trimmed}))`
      )
    )
    .limit(limit);
}

export async function listOccupations(filters: ListFilters = {}) {
  const db = getDb();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? 24));
  const offset = (page - 1) * pageSize;

  const conditions: SQL[] = [];
  if (filters.status) {
    conditions.push(eq(occupations.status, filters.status));
  }
  if (filters.era) {
    conditions.push(eq(occupations.eraPrimary, filters.era));
  }
  if (filters.category) {
    conditions.push(eq(occupations.category, filters.category));
  }
  if (filters.q?.trim()) {
    const q = filters.q.trim();
    conditions.push(
      sql`${occupations.searchVector} @@ plainto_tsquery('english', ${q})`
    );
  }

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countResult] = await Promise.all([
    db
      .select({
        slug: occupations.slug,
        name: occupations.name,
        status: occupations.status,
        summary: occupations.summary,
        eraPrimary: occupations.eraPrimary,
        category: occupations.category,
        originYear: occupations.originYear,
        dateConfidence: occupations.dateConfidence,
      })
      .from(occupations)
      .where(whereClause)
      .orderBy(asc(occupations.name))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(occupations)
      .where(whereClause),
  ]);

  return {
    items: rows,
    total: countResult[0]?.count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / pageSize),
  };
}

export async function getOccupationBySlug(slug: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(occupations)
    .where(eq(occupations.slug, slug))
    .limit(1);

  if (!row) return null;

  const [aliases, events, sources, relations] = await Promise.all([
    db
      .select({ alias: occupationAliases.alias })
      .from(occupationAliases)
      .where(eq(occupationAliases.occupationId, row.id)),
    db
      .select()
      .from(occupationEvents)
      .where(eq(occupationEvents.occupationId, row.id))
      .orderBy(asc(occupationEvents.sortOrder), asc(occupationEvents.year)),
    db
      .select()
      .from(occupationSources)
      .where(eq(occupationSources.occupationId, row.id)),
    db
      .select({
        type: occupationRelations.type,
        slug: occupations.slug,
        name: occupations.name,
        status: occupations.status,
      })
      .from(occupationRelations)
      .innerJoin(
        occupations,
        eq(occupationRelations.toOccupationId, occupations.id)
      )
      .where(eq(occupationRelations.fromOccupationId, row.id)),
  ]);

  return {
    occupation: row,
    aliases: aliases.map((a) => a.alias),
    events,
    sources,
    relations,
  };
}

export async function getFeaturedSlugs() {
  return [
    "blacksmith",
    "software-developer",
    "scribe",
    "cooper",
    "plague-doctor",
    "telegraph-operator",
  ];
}

export async function countOccupations() {
  const db = getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(occupations);
  return row?.count ?? 0;
}