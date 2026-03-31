import fs from "node:fs/promises";
import path from "node:path";

import { cosineSimilarity } from "@/backend/ai/embeddings";
import type { VectorRecord } from "@/shared/types";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "vector-store.json");

type PersistedShape = {
  records: VectorRecord[];
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({ records: [] }, null, 2), "utf8");
  }
}

async function readStore(): Promise<PersistedShape> {
  await ensureStore();
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as PersistedShape;
}

async function writeStore(store: PersistedShape) {
  await ensureStore();
  await fs.writeFile(dbPath, JSON.stringify(store, null, 2), "utf8");
}

export async function addVectorRecords(records: VectorRecord[]) {
  const store = await readStore();
  store.records.push(...records);
  await writeStore(store);
  return records.length;
}

export async function searchVectors(embedding: number[], topK = 4) {
  const store = await readStore();
  return store.records
    .map((record) => ({
      ...record,
      similarity: cosineSimilarity(embedding, record.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

export async function listIndexedDocuments() {
  const store = await readStore();
  const documents = new Map<
    string,
    { documentId: string; documentName: string; chunks: number }
  >();

  for (const record of store.records) {
    const existing = documents.get(record.documentId);
    if (existing) {
      existing.chunks += 1;
    } else {
      documents.set(record.documentId, {
        documentId: record.documentId,
        documentName: record.documentName,
        chunks: 1
      });
    }
  }

  return Array.from(documents.values());
}
