export type OccupationStatus = "active" | "declining" | "extinct" | "regional";
export type DateConfidence = "high" | "medium" | "low";

export interface AgeInput {
  status: OccupationStatus;
  originYear: number | null;
  originYearEnd: number | null;
  originLabel: string | null;
  dateConfidence: DateConfidence;
  referenceYear?: number;
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

function formatDecade(year: number): string {
  const decade = Math.floor(year / 10) * 10;
  return `~${decade}s`;
}

export function buildAgeDisplay(input: AgeInput): AgeDisplay {
  const {
    status,
    originYear,
    originYearEnd,
    originLabel,
    dateConfidence,
    referenceYear = new Date().getFullYear(),
  } = input;

  let sinceLabel = "Origin unknown";
  if (originYear != null && originYearEnd != null) {
    sinceLabel = `${formatYear(originYear)} – ${formatYear(originYearEnd)}`;
  } else if (originYear != null) {
    sinceLabel =
      originYear >= 1000 && originYear % 10 === 0
        ? formatDecade(originYear)
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