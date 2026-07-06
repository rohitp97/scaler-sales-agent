import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-2.5-flash-lite";

/**
 * Transcribes a call recording using Gemini's native audio understanding
 * (single multimodal call - no separate STT service needed).
 */
export async function transcribeAudio(buffer: Buffer, mimeType: string): Promise<string> {
  const res = await client.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType,
            },
          },
          {
            text: `Transcribe this sales call recording verbatim, labeling speaker turns as "BDA:" and the
lead's name (infer from context, or "Lead:" if unclear) followed by what they said, one turn per line, in the
same style as a written call transcript. Do not summarize - transcribe the actual words spoken. Do not add any
commentary before or after the transcript.`,
          },
        ],
      },
    ],
  });

  return (res.text ?? "").trim();
}
