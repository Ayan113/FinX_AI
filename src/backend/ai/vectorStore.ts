import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  BlobNotFoundError,
  BlobPreconditionFailedError,
  get,
  head,
  put
} from "@vercel/blob";

import { cosineSimilarity } from "@/backend/ai/embeddings";
import type { VectorRecord } from "@/shared/types";

const dataDir = path.join(os.tmpdir(), "finx-ai");
const dbPath = path.join(dataDir, "vector-store.json");
const blobPathname = "rag/vector-store.json";

type PersistedShape = {
  records: VectorRecord[];
};

let inMemoryStore: PersistedShape = { records: [] };
let blobEtag: string | null = null;

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function isReadOnlyFsError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? error.code : undefined;
  return code === "EROFS" || code === "EACCES" || code === "EPERM";
}

async function ensureStore() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dbPath);
  } catch (error) {
    if (isReadOnlyFsError(error)) {
      return false;
    }

    try {
      await fs.writeFile(dbPath, JSON.stringify({ records: [] }, null, 2), "utf8");
    } catch (writeError) {
      if (isReadOnlyFsError(writeError)) {
        return false;
      }

      throw writeError;
    }
  }

  return true;
}

async function readLocalStore(): Promise<PersistedShape> {
  const canUseFileStore = await ensureStore();
  if (!canUseFileStore) {
    return inMemoryStore;
  }

  try {
    const raw = await fs.readFile(dbPath, "utf8");
    return JSON.parse(raw) as PersistedShape;
  } catch (error) {
    if (isReadOnlyFsError(error)) {
      return inMemoryStore;
    }

    throw error;
  }
}

async function writeLocalStore(store: PersistedShape) {
  inMemoryStore = store;

  const canUseFileStore = await ensureStore();
  if (!canUseFileStore) {
    return;
  }

  try {
    await fs.writeFile(dbPath, JSON.stringify(store, null, 2), "utf8");
  } catch (error) {
    if (isReadOnlyFsError(error)) {
      return;
    }

    throw error;
  }
}

async function readBlobStore(): Promise<PersistedShape> {
  try {
    const result = await get(blobPathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) {
      return { records: [] };
    }

    blobEtag = result.blob.etag;
    const raw = await new Response(result.stream).text();
    if (!raw.trim()) {
      return { records: [] };
    }

    return JSON.parse(raw) as PersistedShape;
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      blobEtag = null;
      return { records: [] };
    }

    throw error;
  }
}

async function writeBlobStore(store: PersistedShape) {
  const payload = JSON.stringify(store, null, 2);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await put(blobPathname, payload, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        ...(blobEtag ? { ifMatch: blobEtag } : {})
      });

      blobEtag = result.etag;
      return;
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError && attempt === 0) {
        try {
          const metadata = await head(blobPathname);
          blobEtag = metadata.etag;
          continue;
        } catch (metadataError) {
          if (metadataError instanceof BlobNotFoundError) {
            blobEtag = null;
            continue;
          }

          throw metadataError;
        }
      }

      throw error;
    }
  }
}

async function readStore(): Promise<PersistedShape> {
  if (hasBlobToken()) {
    try {
      const store = await readBlobStore();
      inMemoryStore = store;
      return store;
    } catch {
      return readLocalStore();
    }
  }

  return readLocalStore();
}

async function writeStore(store: PersistedShape) {
  inMemoryStore = store;

  if (hasBlobToken()) {
    try {
      await writeBlobStore(store);
      return;
    } catch {
      await writeLocalStore(store);
      return;
    }
  }

  await writeLocalStore(store);
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
