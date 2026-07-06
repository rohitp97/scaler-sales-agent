import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/gemini";
import { transcribeAudioAssemblyAI } from "@/lib/assemblyai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("audio") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "audio/mpeg";

    let transcript: string;
    try {
      transcript = await transcribeAudio(buffer, mimeType);
    } catch (geminiErr) {
      console.error("Gemini transcription failed, falling back to AssemblyAI", geminiErr);
      transcript = await transcribeAudioAssemblyAI(buffer);
    }

    return NextResponse.json({ transcript });
  } catch (err) {
    console.error("transcription failed", err);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
