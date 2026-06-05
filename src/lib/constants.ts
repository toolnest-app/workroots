import type { EraPrimary, OccupationStatus } from "@/db/schema";

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

export const ERA_ORDER: EraPrimary[] = [
  "ancient",
  "medieval",
  "early_modern",
  "industrial",
  "modern",
  "contemporary",
];