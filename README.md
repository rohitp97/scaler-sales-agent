# Scaler Sales Copilot — AI Builder Take-Home

Live app: https://scaler-sales-agent-zeta.vercel.app

**Before testing:** this uses a Twilio WhatsApp *Sandbox*, so any number you want to receive messages on
(including your own, testing live) must first send `join badly-active` to `+1 415 523 8886` from that WhatsApp
once. Without this, Twilio silently fails to deliver. The app's onboarding screen also shows this.

---

## 1. What you built

I built an AI agent for Scaler's sales team that runs over WhatsApp in two moments. Before a call, it sends the
BDA a short briefing on the specific lead — who they are, what's likely driving them, and how to open the call —
so the first ten seconds aren't generic. After the call, it generates a personalised 2-3 page PDF that answers
the lead's actual questions using real Scaler program facts pulled from scaler.com (not invented ones), which
the BDA reviews and can Approve, Edit, or Skip before it reaches the lead's WhatsApp. It accepts both a typed
call transcript and an uploaded audio recording, transcribing the audio itself before generating the PDF, so
nothing about the flow is hardcoded to the three demo personas.

## 2. One failure I found

My first Rohan PDF stated Scaler Academy's cohort hike as 74% and top-25% CTC as Rs. 25L — both stale, from
an under-verified scrape. The live site actually shows 150% and Rs. 48L. A "grounded" answer was confidently
wrong because the grounding file itself was never checked against raw HTML.

## 3. Scale plan

Two things break before 100k/month. First, WhatsApp delivery: Twilio's Sandbox is single-number test
infrastructure — real volume needs an approved WhatsApp Business API number with pre-approved templates and
tier-based throughput caps, so messaging infrastructure, not compute, is the ceiling. Second, lead handling:
there's no database today - leads exist only in whatever's pasted into the form. At volume, leads need to land
in a database at signup, with BDAs logging into this same portal to see only their assigned leads - tagged new,
contacted, dropped-off, test-taken, or converted - so each gets served differently instead of re-entered by hand.

---

## Running it locally
```
npm install
cp .env.local.example .env.local   # fill in your own keys
npm run dev
```
Env vars: `GROQ_API_KEY` (text generation), `GEMINI_API_KEY` (audio transcription), `ASSEMBLYAI_API_KEY`
(transcription fallback), `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`,
`BLOB_READ_WRITE_TOKEN` (Vercel Blob — Twilio needs a public URL to fetch the PDF from, even in dev).

*Model note:* text generation moved Claude → Gemini → Groq (`llama-3.3-70b-versatile`) over the course of the
build — Anthropic credit ran out, then Gemini's free tier hit its daily quota and separately returned a
persistent 503 during testing. Prompts in `PROMPTS.md` are model-agnostic and unaffected by the swap.

Full prompts: [`PROMPTS.md`](./PROMPTS.md). Three questions for the first 30 minutes: see the submission email.
