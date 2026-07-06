import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { PdfContent } from "./types";

// Once a real Scaler logo asset is available, pass its path/URL here and it will
// render top-right of the header. Left unset until the asset is provided - a wrong
// or low-quality guessed logo is worse than no logo.
const LOGO_SRC: string | undefined = undefined;

// Persona-driven accent color so the three demo PDFs are visibly distinct at a glance,
// not just in copy. Derived from a hash of the recommended program / name so any
// arbitrary lead (not just the 3 demo personas) still gets a deterministic, distinct look.
function accentFor(seed: string) {
  const palette = [
    { accent: "#1E3A8A", light: "#DBEAFE", name: "navy" }, // analytical / senior
    { accent: "#B45309", light: "#FEF3C7", name: "amber" }, // growth / mid-career
    { accent: "#166534", light: "#DCFCE7", name: "green" }, // first-gen / student
    { accent: "#6D28D9", light: "#EDE9FE", name: "violet" },
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10.5, fontFamily: "Helvetica", color: "#1F2937" },
  header: {
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerText: { flex: 1 },
  logo: { width: 90, height: 28, objectFit: "contain" },
  brand: { fontSize: 9, color: "#6B7280", letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#4B5563", lineHeight: 1.3 },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 5 },
  para: { lineHeight: 1.3, marginBottom: 4 },
  qBlock: { marginBottom: 9, paddingLeft: 10, borderLeftWidth: 2 },
  q: { fontWeight: 700, marginBottom: 3, fontSize: 10.5, lineHeight: 1.3 },
  a: { lineHeight: 1.3, color: "#374151" },
  tag: { fontSize: 8, color: "#9CA3AF", marginTop: 3 },
  bulletRow: { flexDirection: "row", marginBottom: 5 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1, lineHeight: 1.3 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#9CA3AF",
    textAlign: "center",
  },
  callout: { padding: 10, borderRadius: 4, marginTop: 4 },
});

export function LeadPdfDocument({ content }: { content: PdfContent }) {
  const palette = accentFor(content.recommendedProgram + content.leadName);

  return (
    <Document
      title={`Scaler - ${content.leadName}`}
      author="Scaler"
      subject="Personalised program brief"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.header, { borderBottomWidth: 2, borderBottomColor: palette.accent, paddingBottom: 10 }]}>
          <View style={styles.headerText}>
            <Text style={styles.brand}>SCALER · PERSONALISED BRIEF</Text>
            <Text style={styles.title}>For {content.leadName}</Text>
            <Text style={styles.subtitle}>{content.personaSummary}</Text>
          </View>
          {LOGO_SRC && <Image src={LOGO_SRC} style={styles.logo} />}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.accent }]}>Recommended path</Text>
          <Text style={styles.para}>{content.recommendedProgram}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.accent }]}>
            Answers to what you asked on the call
          </Text>
          {content.openQuestions.map((q, i) => (
            <View key={i} style={[styles.qBlock, { borderLeftColor: palette.light }]} wrap={false}>
              <Text style={styles.q}>{q.question}</Text>
              <Text style={styles.a}>{q.answer}</Text>
              {!q.grounded && <Text style={styles.tag}>* your BDA will confirm the exact specifics here</Text>}
            </View>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { color: palette.accent }]}>Does the math work for you?</Text>
          <View style={[styles.callout, { backgroundColor: palette.light }]}>
            <Text style={styles.para}>{content.roiReasoning}</Text>
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { color: palette.accent }]}>Why this is worth your trust</Text>
          {content.trustBuilders.map((t, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: palette.accent }]}>•</Text>
              <Text style={styles.bulletText}>{t}</Text>
            </View>
          ))}
        </View>

        {content.whatsNotCertain.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={[styles.sectionTitle, { color: "#9CA3AF" }]}>Still to confirm with your BDA</Text>
            {content.whatsNotCertain.map((t, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={[styles.bulletText, { color: "#6B7280" }]}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { color: palette.accent }]}>Next step</Text>
          <Text style={styles.para}>
            Take the entrance test to lock in your seat and unlock your second call - it&apos;s the gate to
            enrolment, and there&apos;s no cost to trying it.
          </Text>
        </View>

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `Prepared for ${content.leadName} · Scaler · Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
