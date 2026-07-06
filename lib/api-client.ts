import type { LeadProfile, PdfContent } from "./types";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `${url} failed`);
  return data as T;
}

export async function apiGenerateNudge(profile: LeadProfile, transcript: string) {
  return post<{ nudge: string }>("/api/nudge", { profile, transcript });
}

export async function apiTranscribe(audio: File) {
  const form = new FormData();
  form.append("audio", audio);
  const res = await fetch("/api/transcribe", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "transcription failed");
  return data as { transcript: string };
}

export async function apiGeneratePdfContent(profile: LeadProfile, transcript: string) {
  return post<{ content: PdfContent }>("/api/pdf-content", { profile, transcript });
}

export async function apiRenderPdf(content: PdfContent) {
  return post<{ url: string }>("/api/render-pdf", { content });
}

export async function apiSendWhatsApp(to: string, body: string, mediaUrl?: string) {
  return post<{ ok: boolean; sid: string; status: string }>("/api/send-whatsapp", {
    to,
    body,
    mediaUrl,
  });
}
