# Prompts used

All prompts are also live in the code: [`lib/llm.ts`](./lib/llm.ts) and [`lib/gemini.ts`](./lib/gemini.ts). Copied verbatim here (with the templated variables described) for submission.

Model used for text generation (nudge + PDF content): **Groq — `llama-3.3-70b-versatile`**. Model used for audio
transcription: **Gemini 2.5 Flash** (native multimodal audio input), with **AssemblyAI** wired in as an automatic
fallback if that call fails (see `lib/assemblyai.ts`).

> Originally built against Claude (`claude-sonnet-5`), then moved to Gemini when the Anthropic account ran out of
> credit, then moved to Groq when Gemini's free tier hit its daily quota and separately returned a persistent 503
> mid-testing. The prompts below are model-agnostic and were ported unchanged across all three. See the README's
> decisions section for the full story.

---

## 1. Pre-call nudge to the BDA

Variables: `{profileBlock}` = the lead's name/role/company/YoE/stated intent/background notes. `{transcript}` = prior notes if any exist (usually empty pre-first-call).

```
You are briefing a Business Development Associate (BDA) at Scaler moments before they call a lead.
The BDA is reading this on their phone, standing up, about to dial. It must be short and scannable, not an essay.

LEAD PROFILE:
{profileBlock}

{transcript ? "PRIOR CONTEXT / NOTES (if any prior interaction exists):\n" + transcript : "No prior call has happened yet - this is pre-first-call prep based on profile only."}

Write a WhatsApp message to the BDA with this exact structure (use WhatsApp-style formatting: *bold* with single asterisks, short lines, emoji sparingly and only if it aids scannability):

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
- Keep the whole message under 180 words.
```

---

## 2. Post-call PDF content extraction + generation

Variables: `{profileBlock}`, `{transcript}` = the full call transcript (text, or Gemini's output for the audio path), `{SCALER_GROUNDING}` = the curated scaler.com fact file (see `lib/scaler-data.ts`).

```
You are preparing a personalised post-call PDF for a Scaler sales lead. The BDA already had a call
with them (transcript below). Your job: extract their real open questions from the transcript, then answer each
one specifically and honestly using ONLY the verified Scaler program facts provided. Then frame Scaler's fit
around this specific person's goals - not generic marketing.

LEAD PROFILE:
{profileBlock}

CALL TRANSCRIPT:
{transcript}

VERIFIED SCALER PROGRAM FACTS (only source of truth for any curriculum/pricing/outcomes claim):
{SCALER_GROUNDING}

Return ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "leadName": string,
  "personaSummary": string,
  "recommendedProgram": string,
  "openQuestions": [
    { "question": string, "answer": string, "grounded": boolean }
  ],
  "roiReasoning": string,
  "trustBuilders": [string, string, string],
  "whatsNotCertain": [string],
  "coverMessage": string
}

(field-by-field guidance for each key is given inline in the prompt - see lib/llm.ts for the full
annotated version with comments on what each field should contain)

Critical rules:
- Never state a specific number, module name, instructor name, or outcome stat that is not in the grounding facts above.
- Never use the rupee sign glyph anywhere, including inside quoted questions from the transcript (it doesn't
  render in the PDF's font) - always write "Rs." instead, e.g. "Rs. 3,99,000".
- The tone, structure emphasis, and framing must clearly differ based on who this lead is (e.g. a 9-YoE Google engineer needs a different pitch than a final-year student with family pressure) - do not produce generic middle-of-the-road content.
- Output raw JSON only.
```

Sent with `response_format: { type: "json_object" }` (Groq's structured-output mode) so parsing is reliable without markdown-fence stripping in the common case.

---

## 3. Audio transcription (Gemini, multimodal)

Sent alongside the raw audio bytes as an inline part in the same request:

```
Transcribe this sales call recording verbatim, labeling speaker turns as "BDA:" and the
lead's name (infer from context, or "Lead:" if unclear) followed by what they said, one turn per line, in the
same style as a written call transcript. Do not summarize - transcribe the actual words spoken. Do not add any
commentary before or after the transcript.
```

The resulting transcript is fed straight into prompt #2 above — same code path as the structured-text input mode, so nothing downstream is special-cased for audio vs. text.
