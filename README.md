# Scaler Sales Copilot — AI Builder Take-Home

An agent that supercharges two moments in the Scaler BDA sales flow, both delivered on WhatsApp:

1. **Pre-call nudge to the BDA** — a short WhatsApp briefing on the specific lead before the call (persona, angles, objections, opening hook). No approval gate — internal.
2. **Post-call PDF to the lead** — a 2-3 page personalised, branded PDF answering the lead's actual open questions from the call, grounded in real scaler.com program facts. Requires BDA **Approve / Edit / Skip** before it reaches the lead.

Live app: https://scaler-sales-agent-zeta.vercel.app

**Before testing:** this uses a Twilio WhatsApp *Sandbox* (not a production WhatsApp Business number), so any
phone number you want to receive messages on — including the evaluator's own number when testing live — must
first opt in once: send `join badly-active` to `+1 415 523 8886` from that WhatsApp number. Without this,
Twilio will silently fail to deliver and the app will show a send error. The app's onboarding step also displays
this instruction.

> Note on README structure: the brief asks for "README three sections" without naming them. I've interpreted that as **What I built**, **Decisions & tradeoffs**, and **What I'd do with more time** — the ambiguity call is documented here per the brief's own instruction to "decide and document."

---

## 1. What I built

**Stack:** Next.js 16 (App Router, TypeScript) on Vercel. Gemini 2.5 Flash for all lead-facing/BDA-facing text generation *and* audio transcription (native multimodal audio input — one call transcribes *and* preserves speaker turns, no separate STT vendor for the primary path; AssemblyAI is wired in as an automatic fallback if that call fails). Twilio WhatsApp Sandbox for real message delivery. `@react-pdf/renderer` for the PDF (pure-JS, no headless browser needed in a serverless function). Vercel Blob for hosting the generated PDF at a public URL so Twilio can attach it as media.

**Flow:**
- Enter the evaluator's WhatsApp number once (persisted locally) — both sends in this demo target that number, matching the brief's "so WhatsApp sends land where we can see them."
- Enter a lead profile + either a pasted transcript **or** an uploaded call recording. Three demo personas (Rohan / Karthik / Meera) are one click away, or leave the form blank and type in an arbitrary lead — nothing is hardcoded past the demo-persona convenience buttons, and the same code path runs either way.
- **Nudge:** generate → preview → send. No gate, per the brief (BDA-facing, not lead-facing).
- **PDF:** generate structured content (extracted open questions + grounded answers) → edit any field inline → render PDF preview → **Approve & Send** / **Edit** / **Skip**. Only Approve triggers a real WhatsApp send.
- A **"Compare 3 personas"** tab runs all three demo personas through the full pipeline at once and shows the nudge + PDF side by side, so the personalisation difference is visually obvious without re-running the flow three times.

**Anti-hallucination:** all curriculum/pricing/outcome claims are constrained to a hand-curated grounding file (`lib/scaler-data.ts`) built from scraping scaler.com's Academy, Data Science & ML, and DevOps program pages directly (not fabricated from training knowledge). The generation prompt explicitly instructs the model to mark any claim outside that file as `grounded: false` and say the BDA will confirm, rather than invent a number — this shows up in the PDF as a small footnote per answer plus a "still to confirm with your BDA" section.

**Full prompts:** see [`PROMPTS.md`](./PROMPTS.md) for the exact prompts sent to Gemini.

### Running it locally
```
npm install
cp .env.local.example .env.local   # fill in your own keys
npm run dev
```
Required env vars: `GEMINI_API_KEY`, `ASSEMBLYAI_API_KEY` (fallback transcription), `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`, `BLOB_READ_WRITE_TOKEN` (from a Vercel Blob store — needed even locally since Twilio must fetch the PDF from a public URL).

---

## 2. Decisions & tradeoffs (5-hour budget)

- **Gemini for audio instead of Whisper/AssemblyAI/Deepgram.** Gemini 2.5 Flash accepts audio natively, so transcription is one multimodal call instead of a separate STT integration — faster to build and one fewer vendor/key, at the cost of not being a "dedicated" ASR model. Good enough for a sales call recording; would revisit for noisy/multi-speaker audio at scale. AssemblyAI is still wired in as an automatic fallback if the Gemini call errors, since the audio path breaking during the live evaluation is an explicit disqualifier.
- **Gemini for text generation too, not Claude.** This was built against Claude first (the prompts in `PROMPTS.md` are model-agnostic) but the Anthropic account ran out of credit partway through the build with no time to wait on a top-up against the 5-hour clock, so both text-generation calls were switched to Gemini. Judgment call under a real time constraint, documented rather than hidden.
- **"Rs." instead of the rupee glyph in all generated text.** `@react-pdf/renderer`'s built-in Helvetica font doesn't include the rupee sign glyph — it silently rendered as a broken superscript character in the first PDF I generated. Rather than pull in a custom Unicode font (more moving parts, more render latency) I fixed it at the prompt level: every fee/salary figure is generated as "Rs. X" instead. Caught by actually reading a rendered PDF, not just eyeballing the UI preview — a reminder that AI-generated output needs to be checked in its final artifact form.
- **Static grounding file instead of a real RAG/vector pipeline.** With ~3 hours for the whole PDF feature, I hand-scraped and curated the key Scaler program pages into one text block that's injected into the prompt directly, rather than standing up embeddings/a vector DB. It satisfies the actual requirement (grounded, non-hallucinated claims) without the infra overhead a 5-hour scope can't justify.
- **Twilio WhatsApp Sandbox over the `wa.me` fallback.** The brief explicitly flags "PDF doesn't reach WhatsApp in the demo" as a disqualifier, so I prioritized real, automatic delivery over the faster-to-wire manual fallback.
- **Vercel Blob for PDF hosting.** Twilio's media API needs a fetchable public URL; serverless functions have no persistent disk, so the rendered PDF is uploaded to Blob storage and that URL is what's attached to the WhatsApp message.
- **No user accounts / persistence layer.** The evaluator's WhatsApp number is the only thing persisted (browser localStorage) — there's no database. Out of scope for a single-BDA demo in 5 hours; a real rollout would need a CRM-linked lead store instead of a manual form.
- **Approval gate is a UI step, not a scheduled/async review queue.** Good enough to demonstrate the non-negotiable (nothing lead-facing fires without a human click); a real deployment would likely route this through the BDA's existing CRM/inbox rather than a standalone tool.

## 3. What I'd do with more time

- Real RAG over all of scaler.com (not just 3 hand-picked pages) so grounding scales past the programs called out in the brief, with citations back to source URLs.
- A proper lead/BDA data model (CRM integration) instead of a manual form, so the nudge and PDF triggers automatically off call-completion events.
- Multi-turn PDF editing (chat-style "make the ROI section punchier") instead of raw field editing.
- Voice-quality handling for the audio path — noise, cross-talk, multiple leads on one call — with confidence scoring surfaced to the BDA rather than a flat transcript.
- Automated visual QA that the three persona PDFs are actually distinct (a cheap LLM-as-judge diff check) rather than relying on manual/demo inspection.

---

## Three questions I'd ask in the first 30 minutes

See the submission email.
