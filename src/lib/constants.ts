import type { ContentTier, EraPrimary, OccupationStatus } from "@/db/schema";

export const ERA_LABELS: Record<EraPrimary, string> = {
  ancient: "Ancient",
  medieval: "Medieval",
  early_modern: "Early Modern",
  industrial: "Industrial",
  modern: "Modern",
  contemporary: "Contemporary",
};

export const STATUS_LABELS: Record<OccupationStatus, string> = {
  active: "Active",
  declining: "Declining",
  extinct: "Extinct",
  regional: "Regional",
};

export const CONTENT_TIER_LABELS: Record<ContentTier, string> = {
  curated: "Curated",
  enhanced: "Enhanced",
  stub: "Stub",
};

/** Homepage featured order — all must exist in showcase.json */
export const FEATURED_SLUGS = [
  "blacksmith",
  "software-developer",
  "scribe",
  "surgeon",
  "samurai",
  "carpenter",
  "physician",
  "sailor",
  "farmer",
  "electrician",
  "midwife",
  "actor",
  "lawyer",
  "sea-captain",
  "film-director",
  "steelworker",
  "telegraph-operator",
] as const;

export const ERA_ORDER: EraPrimary[] = [
  "ancient",
  "medieval",
  "early_modern",
  "industrial",
  "modern",
  "contemporary",
];