import { answerWithRag, ingestDocument } from "@/backend/ai/ragService";
import { listIndexedDocuments } from "@/backend/ai/vectorStore";

export async function handleRagUpload(file: File) {
  const result = await ingestDocument(file);
  const documents = await listIndexedDocuments();
  return { ...result, documents };
}

export async function handleRagQuery(payload: { query: string }) {
  return answerWithRag(payload.query);
}
