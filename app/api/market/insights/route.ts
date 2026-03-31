import { handleMarketInsights } from "@/backend/controllers/marketController";
import { fail, ok } from "@/backend/routes/apiResponse";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    if (!body.query?.trim()) {
      return fail("Query is required.");
    }

    const data = await handleMarketInsights({ query: body.query });
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unable to fetch market insights.",
      500
    );
  }
}
