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
        (e.g. +91XXXXXXXXXX). Must have joined the Twilio Sandbox first.
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
