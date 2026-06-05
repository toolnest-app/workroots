import { NextRequest, NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { searchOccupations } from "@/lib/queries/occupations";

export async function GET(req: NextRequest) {
  if (!hasDatabase()) {
    return NextResponse.json({ results: [] });
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchOccupations(q, 12);
    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ results: [], error: "search_failed" }, { status: 500 });
  }
}