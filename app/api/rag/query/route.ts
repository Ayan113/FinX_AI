import { handleRagQuery } from "@/backend/controllers/ragController";
import { fail, ok } from "@/backend/routes/apiResponse";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    if (!body.query?.trim()) {
      return fail("Query is required.");
    }

    const data = await handleRagQuery({ query: body.query });
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unable to answer document query.",
      500
    );
  }
}
