import pdfParse from "pdf-parse";

import { chunkText, embedText } from "@/backend/ai/embeddings";
import { runFinancialAnalysis } from "@/backend/ai/llmService";
import { addVectorRecords, searchVectors } from "@/backend/ai/vectorStore";
import { uid } from "@/shared/lib/utils";
import type { Citation } from "@/shared/types";

export async function extractTextFromFile(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  if (file.type === "application/pdf") {
    const parsed = await pdfParse(bytes);
    return parsed.text;
  }

  return bytes.toString("utf8");
}

export async function ingestDocument(file: File) {
  const text = await extractTextFromFile(file);
  const chunks = chunkText(text);
  const documentId = uid("doc");
  const records = chunks.map((chunk, index) => ({
    id: uid("chunk"),
    documentId,
    documentName: file.name,
    chunkIndex: index,
    text: chunk,
    embedding: embedText(chunk),
    metadata: {
      uploadedAt: new Date().toISOString(),
      contentType: file.type || "text/plain"
    }
  }));

  await addVectorRecords(records);

  return {
    documentId,
    fileName: file.name,
    chunks: records.length,
    preview: text.slice(0, 240)
  };
}

export async function answerWithRag(query: string) {
  const queryEmbedding = embedText(query);
  const results = await searchVectors(queryEmbedding, 4);

  const citations: Citation[] = results.map((record) => ({
    id: record.id,
    documentName: record.documentName,
    chunkIndex: record.chunkIndex,
    similarity: Number(record.similarity.toFixed(3)),
    snippet: record.text.slice(0, 220)
  }));

  const context = results
    .map(
      (record) =>
        `[${record.documentName} | chunk ${record.chunkIndex}] ${record.text}`
    )
    .join("\n\n");

  const fallback = [
    "Grounded document answer:",
    context
      ? `I found ${results.length} relevant document excerpts. Based on those excerpts, the main answer is: ${results[0]?.text.slice(0, 260) ?? "No matching evidence found."}`
      : "No indexed document chunks were relevant enough to support an answer.",
    "Use the citations below to inspect the supporting context.",
    "This application is for educational purposes only and does not provide financial advice."
  ].join("\n\n");

  const prompt = `
User question:
${query}

Retrieved financial document context:
${context || "No context found."}

Instructions:
- Answer only from the retrieved context when possible.
- If evidence is weak, say so clearly.
- End with: "This application is for educational purposes only and does not provide financial advice."
  `.trim();

  const answer = await runFinancialAnalysis(prompt, fallback);

  return {
    answer,
    citations
  };
}
