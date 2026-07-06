import { NextRequest, NextResponse } from "next/server";
import { extractQuestionsAndGenerateContent } from "@/lib/llm";
import type { LeadProfile } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { profile, transcript } = (await req.json()) as {
      profile: LeadProfile;
      transcript: string;
    };

    if (!profile?.name || !transcript?.trim()) {
      return NextResponse.json({ error: "Lead profile and transcript are required" }, { status: 400 });
    }

    const content = await extractQuestionsAndGenerateContent(profile, transcript);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("pdf content generation failed", err);
    return NextResponse.json({ error: "Failed to generate PDF content" }, { status: 500 });
  }
}
