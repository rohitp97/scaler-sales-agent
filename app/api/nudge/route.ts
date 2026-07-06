import { NextRequest, NextResponse } from "next/server";
import { generateNudge } from "@/lib/llm";
import type { LeadProfile } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { profile, transcript } = (await req.json()) as {
      profile: LeadProfile;
      transcript?: string;
    };

    if (!profile?.name) {
      return NextResponse.json({ error: "Lead profile is required" }, { status: 400 });
    }

    const nudge = await generateNudge(profile, transcript ?? "");
    return NextResponse.json({ nudge });
  } catch (err) {
    console.error("nudge generation failed", err);
    return NextResponse.json({ error: "Failed to generate nudge" }, { status: 500 });
  }
}
