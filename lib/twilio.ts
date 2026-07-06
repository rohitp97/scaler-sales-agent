import Twilio from "twilio";

function client() {
  return Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

function normalizeWhatsApp(number: string) {
  const trimmed = number.trim();
  return trimmed.startsWith("whatsapp:") ? trimmed : `whatsapp:${trimmed}`;
}

export async function sendWhatsAppText(to: string, body: string) {
  const from = normalizeWhatsApp(process.env.TWILIO_WHATSAPP_NUMBER!);
  const msg = await client().messages.create({
    from,
    to: normalizeWhatsApp(to),
    body,
  });
  return { sid: msg.sid, status: msg.status };
}

export async function sendWhatsAppMedia(to: string, body: string, mediaUrl: string) {
  const from = normalizeWhatsApp(process.env.TWILIO_WHATSAPP_NUMBER!);
  const msg = await client().messages.create({
    from,
    to: normalizeWhatsApp(to),
    body,
    mediaUrl: [mediaUrl],
  });
  return { sid: msg.sid, status: msg.status };
}
