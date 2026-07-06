"use client";

import { useState } from "react";
import type { LeadProfile } from "@/lib/types";
import { apiGenerateNudge, apiSendWhatsApp } from "@/lib/api-client";

interface Props {
  profile: LeadProfile;
  transcript: string;
  whatsappNumber: string;
}

export function NudgePanel({ profile, transcript, whatsappNumber }: Props) {
  const [nudge, setNudge] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const generate = async () => {
    setLoading(true);
    setError(null);
    setNudge(null);
    setSendStatus("idle");
    try {
      const { nudge } = await apiGenerateNudge(profile, transcript);
      setNudge(nudge);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate nudge");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!nudge) return;
    setSendStatus("sending");
    try {
      await apiSendWhatsApp(whatsappNumber, nudge);
      setSendStatus("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
      setSendStatus("error");
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">
          1. Pre-call nudge <span className="font-normal text-neutral-400">(to BDA, no approval needed)</span>
        </h3>
        <button
          onClick={generate}
          disabled={loading || !profile.name}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          {loading ? "Generating..." : "Generate nudge"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {nudge && (
        <div className="mt-3">
          <div className="whitespace-pre-wrap rounded-lg bg-[#DCF8C6] p-3 text-sm text-neutral-900">
            {nudge}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={send}
              disabled={sendStatus === "sending" || sendStatus === "sent" || !whatsappNumber}
              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-40"
            >
              {sendStatus === "sending"
                ? "Sending..."
                : sendStatus === "sent"
                ? "Sent to BDA WhatsApp ✓"
                : "Send to BDA WhatsApp"}
            </button>
            {!whatsappNumber && (
              <span className="text-xs text-amber-600">Enter a WhatsApp number above first</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
