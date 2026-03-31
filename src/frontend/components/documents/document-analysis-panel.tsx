"use client";

import { FormEvent, useState, useTransition } from "react";
import { FileUp, SearchCheck } from "lucide-react";

import { GlassCard } from "@/frontend/components/ui/glass-card";
import { useAppStore } from "@/frontend/store/appStore";
import type { Citation } from "@/shared/types";

export function DocumentAnalysisPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("Summarize the key financial risks discussed in the uploaded material.");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isPending, startTransition] = useTransition();
  const indexedDocuments = useAppStore((state) => state.indexedDocuments);
  const setIndexedDocuments = useAppStore((state) => state.setIndexedDocuments);

  const uploadDocument = (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/rag/upload", { method: "POST", body: formData });
      const payload = await response.json();
      setIndexedDocuments(payload.data?.documents ?? []);
    });
  };

  const askDocument = (event: FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const payload = await response.json();
      setAnswer(payload.data?.answer ?? "");
      setCitations(payload.data?.citations ?? []);
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <GlassCard>
        <h3 className="text-xl font-semibold">Upload Research Documents</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Add PDFs or text notes, then query them with grounded RAG responses and citations.
        </p>
        <form className="mt-5 space-y-4" onSubmit={uploadDocument}>
          <label className="flex cursor-pointer items-center gap-3 rounded-3xl border border-dashed border-white/20 bg-white/60 px-4 py-5 dark:bg-white/5">
            <FileUp className="h-5 w-5" />
            <span className="text-sm">{file ? file.name : "Choose PDF or TXT file"}</span>
            <input
              accept=".pdf,.txt"
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm text-white dark:bg-cyanGlow dark:text-slate-950"
            disabled={isPending || !file}
            type="submit"
          >
            {isPending ? "Indexing..." : "Upload & Index"}
          </button>
        </form>

        <div className="mt-6">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Indexed Documents
          </div>
          <div className="mt-3 space-y-3">
            {indexedDocuments.length ? (
              indexedDocuments.map((document) => (
                <div className="rounded-2xl bg-white/70 p-3 text-sm dark:bg-white/10" key={document.documentId}>
                  <div className="font-medium">{document.documentName}</div>
                  <div className="mt-1 text-xs opacity-70">{document.chunks} chunks indexed</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white/70 p-3 text-sm dark:bg-white/10">
                No documents indexed yet.
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3">
          <SearchCheck className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Ask Your Documents</h3>
        </div>
        <form className="mt-5 space-y-4" onSubmit={askDocument}>
          <textarea
            className="min-h-[110px] w-full rounded-3xl border border-white/10 bg-white/80 px-4 py-3 text-sm outline-none dark:bg-slate-950/80"
            onChange={(event) => setQuery(event.target.value)}
            value={query}
          />
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm text-white dark:bg-cyanGlow dark:text-slate-950"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Searching..." : "Query Documents"}
          </button>
        </form>

        <div className="mt-6 rounded-3xl bg-white/70 p-4 dark:bg-white/10">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Grounded Answer
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
            {answer || "Your grounded response will appear here after you query the indexed documents."}
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {citations.map((citation) => (
            <div className="rounded-2xl bg-black/5 p-3 text-sm dark:bg-black/20" key={citation.id}>
              <div className="font-medium">
                {citation.documentName} · chunk {citation.chunkIndex}
              </div>
              <div className="mt-1 opacity-80">{citation.snippet}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
