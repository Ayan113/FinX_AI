"use client";

import { FormEvent, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Volume2 } from "lucide-react";

import { GlassCard } from "@/frontend/components/ui/glass-card";
import { useAppStore } from "@/frontend/store/appStore";
import { uid } from "@/shared/lib/utils";
import type { Citation } from "@/shared/types";

type RecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type RecognitionInstance = {
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
};

type RecognitionCtor = new () => RecognitionInstance;

export function ChatPanel({ voiceEnabled = true }: { voiceEnabled?: boolean }) {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [voiceMode, setVoiceMode] = useState(false);
  const messages = useAppStore((state) => state.chatMessages);
  const addChatMessage = useAppStore((state) => state.addChatMessage);

  const speakText = async (text: string) => {
    const response = await fetch("/api/voice/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const payload = await response.json();
    if (!payload.success) {
      return;
    }

    if (payload.data.mimeType === "audio/mpeg") {
      const audio = new Audio(`data:${payload.data.mimeType};base64,${payload.data.audioBase64}`);
      await audio.play();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const submitMessage = (message: string) => {
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      return;
    }

    addChatMessage({
      id: uid("user"),
      role: "user",
      content: cleanMessage,
      createdAt: new Date().toISOString()
    });
    setInput("");

    startTransition(async () => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleanMessage, useRag: true })
      });
      const payload = await response.json();
      const citations = (payload.data?.citations ?? []) as Citation[];
      addChatMessage({
        id: uid("assistant"),
        role: "assistant",
        content: payload.data?.answer ?? "Unable to generate a response.",
        citations,
        createdAt: new Date().toISOString()
      });

      if (voiceMode) {
        await speakText(payload.data?.answer ?? "");
      }
    });
  };

  const startListening = () => {
    const SpeechRecognitionCtor = (
      window as Window & {
        SpeechRecognition?: RecognitionCtor;
        webkitSpeechRecognition?: RecognitionCtor;
      }
    ).SpeechRecognition
      ?? (
        window as Window & {
          SpeechRecognition?: RecognitionCtor;
          webkitSpeechRecognition?: RecognitionCtor;
        }
      ).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.onresult = (event: RecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput(transcript);
      submitMessage(transcript);
      recognition.stop();
    };
    recognition.start();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage(input);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
      <GlassCard className="min-h-[640px]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Financial Chat Copilot</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              LLM-powered chat with grounded RAG citations and optional voice playback.
            </p>
          </div>
          {voiceEnabled ? (
            <button
              className="rounded-full border border-white/10 bg-white/70 px-4 py-2 text-sm dark:bg-white/10"
              onClick={() => setVoiceMode((current) => !current)}
              type="button"
            >
              Voice {voiceMode ? "On" : "Off"}
            </button>
          ) : null}
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              className={`rounded-3xl p-4 ${
                message.role === "user"
                  ? "ml-auto max-w-[80%] bg-slate-950 text-white dark:bg-cyanGlow dark:text-slate-950"
                  : "max-w-[88%] bg-white/70 dark:bg-white/10"
              }`}
              key={message.id}
            >
              <div className="text-xs uppercase tracking-[0.24em] opacity-70">
                {message.role}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.content}</p>
              {message.citations?.length ? (
                <div className="mt-3 grid gap-2">
                  {message.citations.map((citation) => (
                    <div
                      className="rounded-2xl border border-white/10 bg-black/5 p-3 text-xs dark:bg-black/20"
                      key={citation.id}
                    >
                      <div className="font-semibold">
                        {citation.documentName} · chunk {citation.chunkIndex}
                      </div>
                      <div className="mt-1 opacity-80">{citation.snippet}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>

        <form className="mt-6 flex flex-wrap gap-3" onSubmit={onSubmit}>
          <textarea
            className="min-h-[96px] flex-1 rounded-3xl border border-white/10 bg-white/80 px-4 py-3 text-sm outline-none ring-0 dark:bg-slate-950/80"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about sectors, earnings quality, macro themes, or your uploaded research..."
            value={input}
          />
          <div className="flex gap-3">
            {voiceEnabled ? (
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 dark:bg-white/10"
                onClick={startListening}
                type="button"
              >
                <Mic className="h-4 w-4" />
              </button>
            ) : null}
            <button
              className="flex h-12 items-center gap-2 rounded-full bg-slate-950 px-5 text-white dark:bg-cyanGlow dark:text-slate-950"
              disabled={isPending}
              type="submit"
            >
              {voiceMode ? <Volume2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {isPending ? "Thinking..." : "Send"}
            </button>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="h-fit">
        <h3 className="text-xl font-semibold">Response Model</h3>
        <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>1. User prompt is sent to the `/api/chat` endpoint with optional RAG retrieval.</p>
          <p>2. Relevant document chunks are ranked with cosine similarity in the local vector store.</p>
          <p>3. The LLM returns a market-aware answer, citations, and a built-in educational disclaimer.</p>
          <p>4. Voice mode optionally routes the response to ElevenLabs or browser speech synthesis.</p>
        </div>
      </GlassCard>
    </div>
  );
}
