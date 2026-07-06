"use client";

import { useState } from "react";
import type { LeadProfile, PdfContent } from "@/lib/types";
import { apiGeneratePdfContent, apiRenderPdf, apiSendWhatsApp } from "@/lib/api-client";

interface Props {
  profile: LeadProfile;
  transcript: string;
  whatsappNumber: string;
}

type Stage = "idle" | "content-loading" | "content-ready" | "rendering" | "preview" | "approved" | "skipped";

export function PdfPanel({ profile, transcript, whatsappNumber }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const [content, setContent] = useState<PdfContent | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const generateContent = async () => {
    setStage("content-loading");
    setError(null);
    setPdfUrl(null);
    setSendStatus("idle");
    try {
      const { content } = await apiGeneratePdfContent(profile, transcript);
      setContent(content);
      setStage("content-ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate content");
      setStage("idle");
    }
  };

  const renderPdf = async () => {
    if (!content) return;
    setStage("rendering");
    setError(null);
    try {
      const { url } = await apiRenderPdf(content);
      setPdfUrl(url);
      setStage("preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to render PDF");
      setStage("content-ready");
    }
  };

  const approve = async () => {
    if (!content || !pdfUrl) return;
    setSendStatus("sending");
    try {
      await apiSendWhatsApp(whatsappNumber, content.coverMessage, pdfUrl);
      setSendStatus("sent");
      setStage("approved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
      setSendStatus("error");
    }
  };

  const skip = () => {
    setStage("skipped");
  };

  const backToEdit = () => {
    setStage("content-ready");
    setPdfUrl(null);
  };

  const updateField = <K extends keyof PdfContent>(key: K, value: PdfContent[K]) => {
    if (!content) return;
    setContent({ ...content, [key]: value });
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">
          2. Post-call PDF <span className="font-normal text-neutral-400">(lead-facing, approval required)</span>
        </h3>
        <button
          onClick={generateContent}
          disabled={stage === "content-loading" || !profile.name || !transcript.trim()}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          {stage === "content-loading" ? "Extracting & drafting..." : "Generate PDF content"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {content && (stage === "content-ready" || stage === "rendering") && (
        <div className="mt-3 space-y-3">
          <Field label="Persona summary" value={content.personaSummary} onChange={(v) => updateField("personaSummary", v)} />
          <Field label="Recommended program" value={content.recommendedProgram} onChange={(v) => updateField("recommendedProgram", v)} />
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Open questions answered</label>
            <div className="space-y-2">
              {content.openQuestions.map((q, i) => (
                <div key={i} className="rounded-md border border-neutral-200 p-2">
                  <p className="text-xs font-semibold text-neutral-700">{q.question}</p>
                  <textarea
                    value={q.answer}
                    onChange={(e) => {
                      const next = [...content.openQuestions];
                      next[i] = { ...next[i], answer: e.target.value };
                      updateField("openQuestions", next);
                    }}
                    rows={2}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-xs focus:border-[#0041CA] focus:outline-none"
                  />
                  {!q.grounded && (
                    <span className="text-[10px] text-amber-600">not fully grounded - BDA to confirm</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Field label="ROI reasoning" value={content.roiReasoning} onChange={(v) => updateField("roiReasoning", v)} textarea />
          <Field label="Cover WhatsApp message" value={content.coverMessage} onChange={(v) => updateField("coverMessage", v)} textarea />

          <button
            onClick={renderPdf}
            disabled={stage === "rendering"}
            className="rounded-md bg-[#0041CA] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#00339e] disabled:opacity-40"
          >
            {stage === "rendering" ? "Rendering PDF..." : "Render PDF preview"}
          </button>
        </div>
      )}

      {pdfUrl && stage === "preview" && (
        <div className="mt-3 space-y-2">
          <iframe src={pdfUrl} className="h-[420px] w-full rounded-md border border-neutral-200" />
          <div className="flex items-center gap-2">
            <button
              onClick={approve}
              disabled={sendStatus === "sending" || !whatsappNumber}
              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-40"
            >
              {sendStatus === "sending" ? "Sending..." : "Approve & Send"}
            </button>
            <button
              onClick={backToEdit}
              className="rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
            >
              Edit
            </button>
            <button
              onClick={skip}
              className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-50"
            >
              Skip
            </button>
            {!whatsappNumber && (
              <span className="text-xs text-amber-600">Enter a WhatsApp number above first</span>
            )}
          </div>
        </div>
      )}

      {stage === "approved" && (
        <p className="mt-3 text-sm font-medium text-green-700">
          ✓ Approved and sent to lead&apos;s WhatsApp (PDF + cover message).
        </p>
      )}
      {stage === "skipped" && (
        <p className="mt-3 text-sm font-medium text-neutral-500">Skipped - nothing sent to the lead.</p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-600">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs focus:border-[#0041CA] focus:outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs focus:border-[#0041CA] focus:outline-none"
        />
      )}
    </div>
  );
}
