import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { PdfContent } from "./types";
import { ScalerLogo, SCALER_BLUE, SCALER_BLUE_LIGHT } from "./scaler-logo";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10.5, fontFamily: "Helvetica", color: "#1F2937" },
  header: {
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerText: { flex: 1, paddingRight: 16 },
  brand: { fontSize: 9, color: "#6B7280", letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#4B5563", lineHeight: 1.3 },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 5, color: SCALER_BLUE },
  para: { lineHeight: 1.3, marginBottom: 4 },
  qBlock: { marginBottom: 9, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: SCALER_BLUE_LIGHT },
  q: { fontWeight: 700, marginBottom: 3, fontSize: 10.5, lineHeight: 1.3 },
  a: { lineHeight: 1.3, color: "#374151" },
  tag: { fontSize: 8, color: "#9CA3AF", marginTop: 3 },
  bulletRow: { flexDirection: "row", marginBottom: 5 },
  bulletDot: { width: 10, color: SCALER_BLUE },
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
  callout: { padding: 10, borderRadius: 4, marginTop: 4, backgroundColor: SCALER_BLUE_LIGHT },
});

export function LeadPdfDocument({ content }: { content: PdfContent }) {
  return (
    <Document
      title={`Scaler - ${content.leadName}`}
      author="Scaler"
      subject="Personalised program brief"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.header, { borderBottomWidth: 2, borderBottomColor: SCALER_BLUE, paddingBottom: 10 }]}>
          <View style={styles.headerText}>
            <Text style={styles.brand}>SCALER · PERSONALISED BRIEF</Text>
            <Text style={styles.title}>For {content.leadName}</Text>
            <Text style={styles.subtitle}>{content.personaSummary}</Text>
          </View>
          <ScalerLogo width={95} height={20} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended path</Text>
          <Text style={styles.para}>{content.recommendedProgram}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Answers to what you asked on the call</Text>
          {content.openQuestions.map((q, i) => (
            <View key={i} style={styles.qBlock} wrap={false}>
              <Text style={styles.q}>{q.question}</Text>
              <Text style={styles.a}>{q.answer}</Text>
              {!q.grounded && <Text style={styles.tag}>* your BDA will confirm the exact specifics here</Text>}
            </View>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Does the math work for you?</Text>
          <View style={styles.callout}>
            <Text style={styles.para}>{content.roiReasoning}</Text>
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Why this is worth your trust</Text>
          {content.trustBuilders.map((t, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{t}</Text>
            </View>
          ))}
        </View>

        {content.whatsNotCertain.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={[styles.sectionTitle, { color: "#9CA3AF" }]}>Still to confirm with your BDA</Text>
            {content.whatsNotCertain.map((t, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: "#9CA3AF" }]}>•</Text>
                <Text style={[styles.bulletText, { color: "#6B7280" }]}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Next step</Text>
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
