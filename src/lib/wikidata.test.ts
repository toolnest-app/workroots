import { describe, expect, it } from "vitest";
import {
  buildEnhancedDuties,
  buildEnhancedRegions,
  buildEnhancedSkills,
  inferCategory,
  inferEra,
  parseWikidataId,
  splitPipeList,
} from "./wikidata";

describe("wikidata helpers", () => {
  it("parses Wikidata entity ids", () => {
    expect(parseWikidataId("http://www.wikidata.org/entity/Q42")).toBe("Q42");
    expect(parseWikidataId("invalid")).toBeNull();
  });

  it("splits pipe-delimited SPARQL aggregates", () => {
    expect(splitPipeList("nurse|registered nurse|nurse")).toEqual([
      "nurse",
      "registered nurse",
    ]);
  });

  it("infers era from inception year", () => {
    expect(inferEra(-500)).toBe("ancient");
    expect(inferEra(1200)).toBe("medieval");
    expect(inferEra(2020)).toBe("contemporary");
    expect(inferEra(null)).toBe("modern");
  });

  it("infers category from field keywords", () => {
    expect(
      inferCategory(["medicine"], "person who treats patients", "physician")
    ).toBe("medicine");
    expect(inferCategory([], "person who builds software", "developer")).toBe(
      "general"
    );
  });

  it("builds enhanced prose fields", () => {
    expect(buildEnhancedDuties("person who treats patients", "physician")).toBe(
      "Person who treats patients."
    );
    expect(buildEnhancedSkills(["medicine", "surgery"])).toContain("medicine");
    expect(buildEnhancedRegions(["France", "Germany"])).toContain("France");
  });
});