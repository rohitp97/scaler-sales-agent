"use client";

import { useEffect, useState } from "react";

export function useWhatsAppNumber() {
  const [number, setNumber] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("scaler-agent-whatsapp");
    if (saved) setNumber(saved);
  }, []);

  const update = (val: string) => {
    setNumber(val);
    localStorage.setItem("scaler-agent-whatsapp", val);
  };

  return [number, update] as const;
}

export function WhatsAppOnboarding({
  number,
  onChange,
}: {
  number: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <label className="block text-sm font-semibold text-neutral-800">
        Evaluator&apos;s WhatsApp number
      </label>
      <p className="mt-1 text-xs text-neutral-500">
        Both the BDA nudge and the lead PDF will be sent here for this demo, in E.164 format
        (e.g. +91XXXXXXXXXX).
      </p>
      <p className="mt-1 rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
        One-time setup: from the WhatsApp on that number, send{" "}
        <span className="font-mono font-semibold">join badly-active</span> to{" "}
        <span className="font-mono font-semibold">+1 415 523 8886</span> first (Twilio Sandbox
        opt-in - required before this number can receive anything below).
      </p>
      <input
        type="tel"
        value={number}
        onChange={(e) => onChange(e.target.value)}
        placeholder="+91XXXXXXXXXX"
        className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}
