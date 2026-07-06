const BASE = "https://api.assemblyai.com/v2";

function headers() {
  return { authorization: process.env.ASSEMBLYAI_API_KEY! };
}

/** Fallback transcription path used if Gemini's audio call fails. */
export async function transcribeAudioAssemblyAI(buffer: Buffer): Promise<string> {
  const uploadRes = await fetch(`${BASE}/upload`, {
    method: "POST",
    headers: headers(),
    body: new Blob([new Uint8Array(buffer)]),
  });
  if (!uploadRes.ok) throw new Error(`AssemblyAI upload failed: ${uploadRes.status}`);
  const { upload_url } = await uploadRes.json();

  const transcriptRes = await fetch(`${BASE}/transcript`, {
    method: "POST",
    headers: { ...headers(), "content-type": "application/json" },
    body: JSON.stringify({ audio_url: upload_url, speaker_labels: true }),
  });
  if (!transcriptRes.ok) throw new Error(`AssemblyAI transcript request failed: ${transcriptRes.status}`);
  const { id } = await transcriptRes.json();

  const deadline = Date.now() + 55_000;
  while (Date.now() < deadline) {
    const pollRes = await fetch(`${BASE}/transcript/${id}`, { headers: headers() });
    const data = await pollRes.json();
    if (data.status === "completed") {
      if (data.utterances?.length) {
        return data.utterances
          .map((u: { speaker: string; text: string }) => `Speaker ${u.speaker}: ${u.text}`)
          .join("\n");
      }
      return data.text ?? "";
    }
    if (data.status === "error") throw new Error(`AssemblyAI transcription error: ${data.error}`);
    await new Promise((r) => setTimeout(r, 2500));
  }
  throw new Error("AssemblyAI transcription timed out");
}
