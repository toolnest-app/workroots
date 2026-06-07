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
  resilient: "Resilient",
  emerging: "Emerging",
};

export const PRESSURE_TYPE_DESCRIPTIONS: Record<PressureType, string> = {
  augmented:
    "AI assists core work; the role persists but duties shift toward judgment and oversight.",
  displaced_tasks:
    "Routine tasks are increasingly automated; headcount pressure is visible in parts of the role.",
  transformed:
    "The occupation's daily work is changing materially as new tools reshape production.",
  resilient:
    "Physical presence, regulated judgment, or human trust remain central despite automation.",
  emerging:
    "New specializations are forming around AI systems and their deployment.",
};

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