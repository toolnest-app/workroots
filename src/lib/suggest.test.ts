import { describe, expect, it } from "vitest";
import { suggestPayloadSchema } from "./suggest";

describe("suggestPayloadSchema", () => {
  it("accepts valid correction payloads", () => {
    const result = suggestPayloadSchema.safeParse({
      occupationSlug: "blacksmith",
      type: "correction",
      message: "The origin year should reflect earlier attestation in Mesopotamia.",
      email: "reader@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short messages", () => {
    const result = suggestPayloadSchema.safeParse({
      type: "other",
      message: "too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects filled honeypot", () => {
    const result = suggestPayloadSchema.safeParse({
      type: "other",
      message: "This is a long enough message for validation.",
      website: "https://spam.example",
    });
    expect(result.success).toBe(false);
  });
});