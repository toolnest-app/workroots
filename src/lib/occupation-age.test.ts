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