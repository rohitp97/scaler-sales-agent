"use client";

import { useState } from "react";
import { DEMO_PERSONAS } from "@/lib/types";
import type { PdfContent } from "@/lib/types";
import {
  apiGenerateNudge,
  apiGeneratePdfContent,
  apiRenderPdf,
  apiSendWhatsApp,
} from "@/lib/api-client";

const KEYS = ["rohan", "karthik", "meera"] as const;

interface CardState {
  nudge: string | null;
  content: PdfContent | null;
  pdfUrl: string | null;
  loading: boolean;
  error: string | null;
  nudgeSent: boolean;
  pdfSent: boolean;
  pdfSkipped: boolean;
}

const EMPTY_CARD: CardState = {
  nudge: null,
  content: null,
  pdfUrl: null,
  loading: false,
  error: null,
  nudgeSent: false,
  pdfSent: false,
  pdfSkipped: false,
};

export function CompareTab({ whatsappNumber }: { whatsappNumber: string }) {
  const [cards, setCards] = useState<Record<string, CardState>>({
    rohan: { ...EMPTY_CARD },
    karthik: { ...EMPTY_CARD },
    meera: { ...EMPTY_CARD },
  });
  const [runningAll, setRunningAll] = useState(false);

  const patch = (key: string, patch: Partial<CardState>) =>
    setCards((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const runOne = async (key: (typeof KEYS)[number]) => {
    const demo = DEMO_PERSONAS[key];
    patch(key, { ...EMPTY_CARD, loading: true });
    try {
      const [{ nudge }, { content }] = await Promise.all([
        apiGenerateNudge(demo.profile, demo.transcript),
        apiGeneratePdfContent(demo.profile, demo.transcript),
      ]);
      const { url } = await apiRenderPdf(content);
      patch(key, { nudge, content, pdfUrl: url, loading: false });
    } catch (e) {
      patch(key, { loading: false, error: e instanceof Error ? e.message : "Failed" });
    }
  };

  const runAll = async () => {
    setRunningAll(true);
    await Promise.all(KEYS.map(runOne));
    setRunningAll(false);
  };

  const sendNudge = async (key: string) => {
    const c = cards[key];
    if (!c.nudge || !whatsappNumber) return;
    await apiSendWhatsApp(whatsappNumber, c.nudge);
    patch(key, { nudgeSent: true });
  };

  const sendPdf = async (key: string) => {
    const c = cards[key];
    if (!c.content || !c.pdfUrl || !whatsappNumber) return;
    await apiSendWhatsApp(whatsappNumber, c.content.coverMessage, c.pdfUrl);
    patch(key, { pdfSent: true });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Runs the full pipeline for all three standard personas so the difference in output is
          visible side by side.
        </p>
        <button
          onClick={runAll}
          disabled={runningAll}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          {runningAll ? "Generating all three..." : "Generate all three"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {KEYS.map((key) => {
          const c = cards[key];
          const demo = DEMO_PERSONAS[key];
          return (
            <div key={key} className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
              <h4 className="text-sm font-semibold capitalize text-neutral-800">{demo.profile.name}</h4>
              <p className="text-xs text-neutral-500">
                {demo.profile.role} · {demo.profile.company} · {demo.profile.yoe} YoE
              </p>

              {c.loading && <p className="mt-3 text-xs text-neutral-400">Generating...</p>}
              {c.error && <p className="mt-3 text-xs text-red-600">{c.error}</p>}

              {c.nudge && (
                <div className="mt-3">
                  <p className="text-[11px] font-medium text-neutral-500">Pre-call nudge</p>
                  <div className="mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-[#DCF8C6] p-2 text-xs text-neutral-900">
                    {c.nudge}
                  </div>
                  <button
                    onClick={() => sendNudge(key)}
                    disabled={c.nudgeSent || !whatsappNumber}
                    className="mt-1.5 rounded-md bg-green-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-green-700 disabled:opacity-40"
                  >
                    {c.nudgeSent ? "Sent ✓" : "Send to BDA"}
                  </button>
                </div>
              )}

              {c.pdfUrl && (
                <div className="mt-3">
                  <p className="text-[11px] font-medium text-neutral-500">Post-call PDF</p>
                  <iframe src={c.pdfUrl} className="mt-1 h-56 w-full rounded-md border border-neutral-200" />
                  <div className="mt-1.5 flex gap-1.5">
                    <button
                      onClick={() => sendPdf(key)}
                      disabled={c.pdfSent || c.pdfSkipped || !whatsappNumber}
                      className="rounded-md bg-green-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-green-700 disabled:opacity-40"
                    >
                      {c.pdfSent ? "Sent ✓" : "Approve & Send"}
                    </button>
                    <button
                      onClick={() => patch(key, { pdfSkipped: true })}
                      disabled={c.pdfSent || c.pdfSkipped}
                      className="rounded-md border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
