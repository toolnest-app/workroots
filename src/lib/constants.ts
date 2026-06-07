import type {
  ContentTier,
  EraPrimary,
  OccupationStatus,
  PressureType,
} from "@/db/schema";

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

export const PRESSURE_TYPE_LABELS: Record<PressureType, string> = {
  augmented: "Augmented",
  displaced_tasks: "Displaced tasks",
  transformed: "Transformed",
  resilient: "Limited change",
  emerging: "Emerging",
};

export const PRESSURE_TYPE_DESCRIPTIONS: Record<PressureType, string> = {
  augmented:
    "Tools assist parts of the work; the occupation persists with shifting task mix.",
  displaced_tasks:
    "Routine tasks are automated; headcount has fallen in identifiable segments of the role.",
  transformed:
    "How the work is produced is changing materially — often accelerating trends that began before generative AI.",
  resilient:
    "Documented automation and AI effects remain limited relative to licensed, physical, or trust-based core duties.",
  emerging:
    "New specializations forming around AI systems — growth rather than displacement.",
};

/** Homepage strip — roles with documented flux from automation or generative AI */
export const PRESSURE_FEATURED_SLUGS = [
  "software-developer",
  "illustrator",
  "voice-actor",
  "data-entry-clerk",
  "journalist",
  "lawyer",
  "bookkeeper",
  "film-editor",
] as const;

export const CONFIDENCE_LABELS = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
} as const;

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