import { getChatResponse } from "@/backend/services/chatService";

export async function handleChatRequest(payload: { message: string; useRag?: boolean }) {
  return getChatResponse(payload);
}
