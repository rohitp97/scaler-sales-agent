"use client";

import { DEMO_PERSONAS, type LeadProfile } from "@/lib/types";

const EMPTY_PROFILE: LeadProfile = {
  name: "",
  role: "",
  company: "",
  yoe: 0,
  intentQuote: "",
  linkedinNotes: "",
};

export { EMPTY_PROFILE };

export type InputMode = "structured" | "audio";

interface Props {
  profile: LeadProfile;
  setProfile: (p: LeadProfile) => void;
  transcript: string;
  setTranscript: (t: string) => void;
  inputMode: InputMode;
  setInputMode: (m: InputMode) => void;
  audioFile: File | null;
  setAudioFile: (f: File | null) => void;
  transcribing: boolean;
  onTranscribe: () => void;
}

export function LeadForm({
  profile,
  setProfile,
  transcript,
  setTranscript,
  inputMode,
  setInputMode,
  audioFile,
  setAudioFile,
  transcribing,
  onTranscribe,
}: Props) {
  const loadPersona = (key: keyof typeof DEMO_PERSONAS) => {
    const demo = DEMO_PERSONAS[key];
    setProfile(demo.profile);
    setTranscript(demo.transcript);
    setInputMode("structured");
    setAudioFile(null);
  };

  const field = (key: keyof LeadProfile, label: string, placeholder: string) => (
    <div>
      <label className="block text-xs font-medium text-neutral-600">{label}</label>
      <input
        value={key === "yoe" ? String(profile.yoe) : (profile[key] as string)}
        onChange={(e) =>
          setProfile({
            ...profile,
            [key]: key === "yoe" ? Number(e.target.value) || 0 : e.target.value,
          })
        }
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-[#0041CA] focus:outline-none"
      />
    </div>
  );

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">Lead</h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => loadPersona("rohan")}
            className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
          >
            Rohan
          </button>
          <button
            onClick={() => loadPersona("karthik")}
            className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
          >
            Karthik
          </button>
          <button
            onClick={() => loadPersona("meera")}
            className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
          >
            Meera
          </button>
          <button
            onClick={() => {
              setProfile(EMPTY_PROFILE);
              setTranscript("");
            }}
            className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {field("name", "Name", "Lead's name")}
        {field("role", "Role", "e.g. Software Engineer")}
        {field("company", "Company", "e.g. TCS")}
        {field("yoe", "Years of experience", "e.g. 4")}
      </div>
      <div className="mt-3">
        <label className="block text-xs font-medium text-neutral-600">
          Stated intent (their own words)
        </label>
        <input
          value={profile.intentQuote}
          onChange={(e) => setProfile({ ...profile, intentQuote: e.target.value })}
          placeholder="e.g. want to switch to a product company..."
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-[#0041CA] focus:outline-none"
        />
      </div>
      <div className="mt-3">
        <label className="block text-xs font-medium text-neutral-600">
          Background / LinkedIn notes
        </label>
        <input
          value={profile.linkedinNotes}
          onChange={(e) => setProfile({ ...profile, linkedinNotes: e.target.value })}
          placeholder="e.g. B.Tech CSE, 4 yrs at TCS on banking clients..."
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-[#0041CA] focus:outline-none"
        />
      </div>

      <div className="mt-4 border-t border-neutral-100 pt-3">
        <div className="flex gap-2">
          <button
            onClick={() => setInputMode("structured")}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              inputMode === "structured"
                ? "bg-[#0041CA] text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Structured (text)
          </button>
          <button
            onClick={() => setInputMode("audio")}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              inputMode === "audio"
                ? "bg-[#0041CA] text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Audio (call recording)
          </button>
        </div>

        {inputMode === "structured" ? (
          <div className="mt-3">
            <label className="block text-xs font-medium text-neutral-600">Call transcript</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={8}
              placeholder="Paste the call transcript here (BDA: ... / Lead: ...)"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#0041CA] focus:outline-none"
            />
          </div>
        ) : (
          <div className="mt-3">
            <label className="block text-xs font-medium text-neutral-600">
              Call recording (mp3, wav, m4a...)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-neutral-200"
            />
            {audioFile && (
              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs text-neutral-500">Selected: {audioFile.name}</p>
                <button
                  onClick={onTranscribe}
                  disabled={transcribing}
                  className="rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
                >
                  {transcribing ? "Transcribing..." : "Transcribe"}
                </button>
              </div>
            )}
            {transcript && inputMode === "audio" && (
              <div className="mt-2 rounded-md bg-neutral-50 p-2 text-xs text-neutral-600">
                <span className="font-medium">Transcribed:</span> {transcript.slice(0, 300)}
                {transcript.length > 300 ? "..." : ""}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
