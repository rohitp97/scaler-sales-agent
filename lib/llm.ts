import { SCALER_GROUNDING } from "./scaler-data";
import type { LeadProfile, PdfContent } from "./types";

// Text generation via Groq's OpenAI-compatible chat completions API. Originally built
// against Claude (see PROMPTS.md - prompts are model-agnostic), moved to Gemini when the
// Anthropic account ran out of credit, then moved here after Gemini's free tier hit its
// daily request quota and, separately, returned a transient 503 "model overloaded" - see
// README decisions section for the full story.
const MODEL = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Groq's free tier caps at 12,000 tokens/minute - comfortably enough for one request at a
// time, but the Compare-3-personas flow used to fire 6 calls concurrently and blew through
// it. Retrying on 429 with the server's own suggested delay covers any remaining bursts
// (e.g. two people testing at once).
async function groqChat(prompt: string, jsonMode: boolean): Promise<string> {
  const maxRetries = 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return (data.choices?.[0]?.message?.content ?? "").trim();
    }

    const body = await res.text();

    if (res.status === 429 && attempt < maxRetries) {
      const match = body.match(/try again in ([\d.]+)s/i);
      const delaySeconds = match ? parseFloat(match[1]) : 2 * (attempt + 1);
      await new Promise((r) => setTimeout(r, Math.ceil(delaySeconds * 1000) + 250));
      continue;
    }

    throw new Error(`Groq API error ${res.status}: ${body}`);
  }

  throw new Error("Groq API error: exhausted retries");
}

function profileBlock(profile: LeadProfile) {
  return `Name: ${profile.name}
Current role: ${profile.role} at ${profile.company}
Years of experience: ${profile.yoe}
Stated intent (their own words): "${profile.intentQuote}"
Background notes: ${profile.linkedinNotes}`;
}

export async function generateNudge(profile: LeadProfile, transcript: string): Promise<string> {
  const prompt = `You are briefing a Business Development Associate (BDA) at Scaler moments before they call a lead.
The BDA is reading this on their phone, standing up, about to dial. It must be short and scannable, not an essay.

LEAD PROFILE:
${profileBlock(profile)}

${transcript ? `PRIOR CONTEXT / NOTES (if any prior interaction exists):\n${transcript}\n` : "No prior call has happened yet - this is pre-first-call prep based on profile only."}

Write a WhatsApp message to the BDA with this exact structure (use WhatsApp-style formatting: *bold* with single
asterisks for section labels only, "-" (hyphen) for bullet points - never "*" for bullets, since that collides
with WhatsApp's bold syntax - short lines, emoji sparingly and only if it aids scannability):

*Who they are:* one or two plain-English sentences on who this person is and what's likely driving them.

*Likely persona:* a short label (e.g. "career-switcher from services", "skeptical senior engineer evaluating for gaps", "first-gen grad under family pressure") with a one-line "why".

*Angles that'll land:* 2-3 bullets, each tied to something concrete about THIS person (their background, words, or situation) - not generic selling points.

*Objections to expect:* 2-3 bullets, each an objection this specific lead is likely to raise, with a one-line handle for how to respond. If you're inferring rather than certain, say so briefly.

*Opening hook:* one suggested first line for the BDA to open the call with, specific to this lead, so the first 10 seconds aren't generic.

Rules:
- Be explicit about what's inferred vs. what's a stated fact vs. what's missing - don't present a guess as certainty.
- Write like a sharp teammate texting a heads-up, not a corporate memo. No filler, no "I hope this helps".
- Do not fabricate any Scaler curriculum or pricing facts in this message - this message is about the LEAD, not about selling Scaler.
- Never use the rupee sign glyph - write "Rs." instead if money comes up (e.g. "Rs. 3.5L").
- Keep the whole message under 180 words.`;

  return groqChat(prompt, false);
}

export async function extractQuestionsAndGenerateContent(
  profile: LeadProfile,
  transcript: string
): Promise<PdfContent> {
  const prompt = `You are preparing a personalised post-call PDF for a Scaler sales lead. The BDA already had a call
with them (transcript below). Your job: extract their real open questions from the transcript, then answer each
one specifically and honestly using ONLY the verified Scaler program facts provided. Then frame Scaler's fit
around this specific person's goals - not generic marketing.

LEAD PROFILE:
${profileBlock(profile)}

CALL TRANSCRIPT:
${transcript}

VERIFIED SCALER PROGRAM FACTS (only source of truth for any curriculum/pricing/outcomes claim):
${SCALER_GROUNDING}

Return ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "leadName": string,
  "personaSummary": string,  // 2-3 sentences: who they are, what's really driving them, tone should feel like it was written by someone who was on the call
  "recommendedProgram": string,  // Before writing this, privately compare this lead's YOE, coding background, and
  // stated goal against ALL the programs in the grounding facts (Academy, Data Science & ML, DevOps/Cloud/AI
  // Platform Engineering, Advanced AI/ML) - do not default to Academy as a safe catch-all. Two leads with
  // meaningfully different YOE or backgrounds should not mechanically land on the same program with the same
  // justification - if you find yourself writing near-identical reasoning for very different profiles, re-examine
  // it. BUT the text you actually output here is lead-facing polished copy, not your reasoning trace: state the
  // recommended program and tie it to specifics of THEIR profile/goals in 1-2 confident sentences. Never
  // reference alternatives you considered or ruled out ("not Data Science & ML because...") - the lead should
  // never see the comparison happen, only read a recommendation that's obviously written for them specifically.
  "openQuestions": [
    { "question": string, "answer": string, "grounded": boolean }
    // one entry per distinct question/concern the lead actually raised in the transcript, in the order raised.
    // "answer" must be specific and must cite real facts from the grounding data when making a claim.
    // if the transcript question is more specific than the grounding data covers, grounded=false and the answer
    // should honestly say the BDA will confirm specifics rather than inventing a number.
    // Length: each "answer" must be substantial enough to fill at least 4 wrapped lines in a PDF (roughly
    // 70-90 words / 450-550 characters) - not padding or repetition, but genuine added context: cite the
    // specific grounding facts involved, explain why they matter for THIS lead's situation, and connect back
    // to what they said on the call. A one- or two-line answer is too thin - the lead should come away with
    // real substance, not a one-liner.
  ],
  "roiReasoning": string,  // Concrete reasoning tied to THIS lead's situation, using only real fee/outcome data
  // from the grounding facts. CRITICAL: only use the lead's current CTC/package in the arithmetic if they
  // actually stated it themselves in the transcript or profile - never invent or guess a number for what someone
  // in their role "probably" earns. If no current CTC was stated (e.g. a fresher, or nobody mentioned salary),
  // reason about the program's outcomes on their own terms instead (e.g. absolute post-program CTC range for
  // their career stage) rather than fabricating a baseline to subtract from.
  // ALSO CRITICAL: if this lead's seniority suggests they may already earn at or above the program's
  // post-program median (e.g. a senior engineer already several years into a top-tier company), do not force a
  // generic salary-hike pitch that wouldn't actually be a hike for them - say that honestly instead, and pivot
  // to what the program actually offers someone already at their level (depth, specialisation, or role-transition
  // credibility), not an unconvincing salary multiplier.
  "trustBuilders": [string, string, string],  // 3 short concrete reasons this lead specifically should trust Scaler, tied to their situation (e.g. relevant alumni transition, relevant instructor background, relevant program feature)
  "whatsNotCertain": [string],  // list anything in openQuestions or roiReasoning that was marked ungrounded / needs BDA follow-up. Empty array if nothing.
  "coverMessage": string  // short (under 40 words), warm WhatsApp cover message from the BDA to send alongside the PDF link, personal and specific to this lead, inviting them to read it and take the entrance test next
}

Critical rules:
- Never state a specific number, module name, instructor name, or outcome stat that is not in the grounding facts above.
- Never use the rupee sign glyph anywhere, including inside quoted questions from the transcript (it doesn't
  render in the PDF's font) - always write "Rs." instead, e.g. "Rs. 3,99,000".
- The tone, structure emphasis, and framing must clearly differ based on who this lead is (e.g. a 9-YoE Google engineer needs a different pitch than a final-year student with family pressure) - do not produce generic middle-of-the-road content.
- Output raw JSON only.`;

  const text = await groqChat(prompt, true);
  const jsonStr = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(jsonStr) as PdfContent;
}
