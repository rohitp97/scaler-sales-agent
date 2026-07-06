import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppText, sendWhatsAppMedia } from "@/lib/twilio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { to, body, mediaUrl } = (await req.json()) as {
      to: string;
      body: string;
      mediaUrl?: string;
    };

    if (!to?.trim()) {
      return NextResponse.json({ error: "Recipient WhatsApp number is required" }, { status: 400 });
    }

    const result = mediaUrl
      ? await sendWhatsAppMedia(to, body, mediaUrl)
      : await sendWhatsAppText(to, body);

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("whatsapp send failed", err);
    const message = err instanceof Error ? err.message : "Failed to send WhatsApp message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
