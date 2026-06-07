import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
  customType,
} from "drizzle-orm/pg-core";

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

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

export const contentTierEnum = pgEnum("content_tier", [
  "curated",
  "enhanced",
  "stub",
]);

export const pressureTypeEnum = pgEnum("pressure_type", [
  "augmented",
  "displaced_tasks",
  "transformed",
  "resilient",
  "emerging",
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
    searchVector: tsvector("search_vector"),
    contentTier: contentTierEnum("content_tier").notNull().default("stub"),
    wikidataId: text("wikidata_id"),
    pressureType: pressureTypeEnum("pressure_type"),
    pressureConfidence: confidenceEnum("pressure_confidence"),
    pressureSummary: text("pressure_summary"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("occupations_slug_idx").on(t.slug),
    statusIdx: index("occupations_status_idx").on(t.status),
    eraIdx: index("occupations_era_idx").on(t.eraPrimary),
    categoryIdx: index("occupations_category_idx").on(t.category),
    tierIdx: index("occupations_content_tier_idx").on(t.contentTier),
    wikidataIdx: index("occupations_wikidata_id_idx").on(t.wikidataId),
    pressureIdx: index("occupations_pressure_type_idx").on(t.pressureType),
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

export type Occupation = typeof occupations.$inferSelect;
export type OccupationStatus = Occupation["status"];
export type EraPrimary = Occupation["eraPrimary"];
export type DateConfidence = Occupation["dateConfidence"];
export type ContentTier = Occupation["contentTier"];
export type PressureType = NonNullable<Occupation["pressureType"]>;