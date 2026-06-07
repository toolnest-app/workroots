import { NextRequest, NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import {
  createSuggestion,
  getClientIp,
  hashClientIp,
  isSuggestRateLimited,
  suggestPayloadSchema,
} from "@/lib/suggest";

export async function POST(req: NextRequest) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "database_unavailable" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = suggestPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const ipHash = hashClientIp(getClientIp(req.headers));
  if (await isSuggestRateLimited(ipHash)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const row = await createSuggestion(ipHash, parsed.data);
    return NextResponse.json({ ok: true, id: row?.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "submit_failed" }, { status: 500 });
  }
}