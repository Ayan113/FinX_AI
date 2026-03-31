"use client";

import { useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";

import { GlassCard } from "@/frontend/components/ui/glass-card";

type RecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type RecognitionInstance = {
  continuous: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
};

type RecognitionCtor = new () => RecognitionInstance;

export function VoiceModePanel() {
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [recognition, setRecognition] = useState<RecognitionInstance | null>(null);

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
      setTranscript("Speech recognition is not supported in this browser.");
      return;
    }

    const instance = new SpeechRecognitionCtor();
    instance.continuous = false;
    instance.lang = "en-US";
    instance.onresult = async (event: RecognitionEvent) => {
      const nextTranscript = event.results[0]?.[0]?.transcript ?? "";
      setTranscript(nextTranscript);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: nextTranscript, useRag: true })
      });
      const payload = await response.json();
      const answer = payload.data?.answer ?? "";
      setResponseText(answer);

      const voiceResponse = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: answer })
      });
      const voicePayload = await voiceResponse.json();
      if (voicePayload.data?.mimeType === "audio/mpeg") {
        const audio = new Audio(
          `data:${voicePayload.data.mimeType};base64,${voicePayload.data.audioBase64}`
        );
        await audio.play();
      } else {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer));
      }
    };
    instance.start();
    setRecognition(instance);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <GlassCard>
        <div className="flex items-center gap-3">
          <Mic className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Voice Input</h3>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Speak naturally, convert speech to text with the browser Web Speech API, then route the answer to TTS.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm text-white dark:bg-cyanGlow dark:text-slate-950"
            onClick={startListening}
            type="button"
          >
            <span className="inline-flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Start Listening
            </span>
          </button>
          <button
            className="rounded-full bg-white/80 px-5 py-3 text-sm dark:bg-white/10"
            onClick={() => recognition?.stop()}
            type="button"
          >
            <span className="inline-flex items-center gap-2">
              <Square className="h-4 w-4" />
              Stop
            </span>
          </button>
        </div>
        <div className="mt-6 rounded-3xl bg-white/70 p-4 dark:bg-white/10">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Transcript
          </div>
          <p className="mt-3 text-sm leading-6">
            {transcript || "Your spoken question will appear here."}
          </p>
        </div>
      </GlassCard>
      <GlassCard>
        <div className="flex items-center gap-3">
          <Volume2 className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Voice Response</h3>
        </div>
        <div className="mt-6 rounded-3xl bg-white/70 p-4 dark:bg-white/10">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Assistant Reply
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
            {responseText || "The AI response will be spoken aloud and shown here after processing."}
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
