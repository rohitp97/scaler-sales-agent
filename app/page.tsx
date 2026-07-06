"use client";

import { useState } from "react";
import { WhatsAppOnboarding, useWhatsAppNumber } from "@/components/WhatsAppOnboarding";
import { LeadForm, EMPTY_PROFILE, type InputMode } from "@/components/LeadForm";
import { NudgePanel } from "@/components/NudgePanel";
import { PdfPanel } from "@/components/PdfPanel";
import { CompareTab } from "@/components/CompareTab";
import type { LeadProfile } from "@/lib/types";
import { apiTranscribe } from "@/lib/api-client";

export default function Home() {
  const [whatsappNumber, setWhatsappNumber] = useWhatsAppNumber();
  const [tab, setTab] = useState<"workbench" | "compare">("workbench");

  const [profile, setProfile] = useState<LeadProfile>(EMPTY_PROFILE);
  const [transcript, setTranscript] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("structured");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcribing, setTranscribing] = useState(false);

  const onTranscribe = async () => {
    if (!audioFile) return;
    setTranscribing(true);
    try {
      const { transcript } = await apiTranscribe(audioFile);
      setTranscript(transcript);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Transcription failed");
    } finally {
      setTranscribing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0041CA]">
            Sales Copilot
          </p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">
            BDA pre-call nudge + post-call PDF agent
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Prep the BDA before the call. Build trust with the lead after it. Both land on WhatsApp.
          </p>
        </div>
        <img src="/scaler-logo.svg" alt="Scaler" className="mt-1 h-6 w-auto shrink-0" />
      </header>

      <div className="mb-6">
        <WhatsAppOnboarding number={whatsappNumber} onChange={setWhatsappNumber} />
      </div>

      <div className="mb-4 flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setTab("workbench")}
          className={`px-3 py-2 text-sm font-medium ${
            tab === "workbench"
              ? "border-b-2 border-[#0041CA] text-[#0041CA]"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Single lead
        </button>
        <button
          onClick={() => setTab("compare")}
          className={`px-3 py-2 text-sm font-medium ${
            tab === "compare"
              ? "border-b-2 border-[#0041CA] text-[#0041CA]"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Compare 3 personas
        </button>
      </div>

      {tab === "workbench" ? (
        <div className="space-y-4">
          <LeadForm
            profile={profile}
            setProfile={setProfile}
            transcript={transcript}
            setTranscript={setTranscript}
            inputMode={inputMode}
            setInputMode={setInputMode}
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            transcribing={transcribing}
            onTranscribe={onTranscribe}
          />
          <NudgePanel profile={profile} transcript={transcript} whatsappNumber={whatsappNumber} />
          <PdfPanel profile={profile} transcript={transcript} whatsappNumber={whatsappNumber} />
        </div>
      ) : (
        <CompareTab whatsappNumber={whatsappNumber} />
      )}
    </div>
  );
}
