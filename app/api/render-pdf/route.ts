import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { put } from "@vercel/blob";
import React from "react";
import { LeadPdfDocument } from "@/lib/pdf-doc";
import type { PdfContent } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { content } = (await req.json()) as { content: PdfContent };

    if (!content?.leadName) {
      return NextResponse.json({ error: "PDF content is required" }, { status: 400 });
    }

    const buffer = await renderToBuffer(
      React.createElement(LeadPdfDocument, { content }) as Parameters<typeof renderToBuffer>[0]
    );

    const filename = `scaler-brief-${content.leadName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`;

    const blob = await put(filename, buffer, {
      access: "public",
      contentType: "application/pdf",
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("pdf render failed", err);
    return NextResponse.json({ error: "Failed to render PDF" }, { status: 500 });
  }
}
