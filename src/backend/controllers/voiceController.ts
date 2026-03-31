import { synthesizeSpeech } from "@/backend/ai/voiceService";

export async function handleSpeakRequest(payload: { text: string }) {
  return synthesizeSpeech(payload.text);
}
