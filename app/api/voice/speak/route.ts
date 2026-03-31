import { handleSpeakRequest } from "@/backend/controllers/voiceController";
import { fail, ok } from "@/backend/routes/apiResponse";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string };
    if (!body.text?.trim()) {
      return fail("Text is required.");
    }

    const data = await handleSpeakRequest({ text: body.text });
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unable to generate speech.",
      500
    );
  }
}
