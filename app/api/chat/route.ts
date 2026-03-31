import { handleChatRequest } from "@/backend/controllers/chatController";
import { fail, ok } from "@/backend/routes/apiResponse";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: string; useRag?: boolean };
    if (!body.message?.trim()) {
      return fail("Message is required.");
    }

    const data = await handleChatRequest({
      message: body.message,
      useRag: body.useRag
    });
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unable to process chat request.",
      500
    );
  }
}
