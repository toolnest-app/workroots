import { createHash } from "crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { suggestions } from "@/db/schema";

export const suggestPayloadSchema = z.object({
  occupationSlug: z.string().trim().max(120).optional().or(z.literal("")),
  type: z.enum(["correction", "pressure", "source", "other"]),
  message: z.string().trim().min(20).max(4000),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .optional()
    .or(z.literal("")),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});

export type SuggestPayload = z.infer<typeof suggestPayloadSchema>;

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function hashClientIp(ip: string): string {
  const salt = process.env.SUGGEST_RATE_SALT ?? "workroots-suggest-v1";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return headers.get("x-real-ip") ?? "unknown";
}

export async function isSuggestRateLimited(ipHash: string): Promise<boolean> {
  const db = getDb();
  const since = new Date(Date.now() - RATE_WINDOW_MS);
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(suggestions)
    .where(
      and(eq(suggestions.ipHash, ipHash), gte(suggestions.createdAt, since))
    );
  return (row?.count ?? 0) >= RATE_LIMIT;
}

export async function createSuggestion(
  ipHash: string,
  payload: SuggestPayload
) {
  const db = getDb();
  const [row] = await db
    .insert(suggestions)
    .values({
      occupationSlug: payload.occupationSlug?.trim() || null,
      type: payload.type,
      message: payload.message.trim(),
      email: payload.email?.trim() || null,
      name: payload.name?.trim() || null,
      ipHash,
    })
    .returning({ id: suggestions.id });

  return row;
}