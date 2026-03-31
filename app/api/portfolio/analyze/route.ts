import { handlePortfolioAnalyze } from "@/backend/controllers/portfolioController";
import { fail, ok } from "@/backend/routes/apiResponse";
import type { PortfolioHolding } from "@/shared/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { holdings?: PortfolioHolding[] };
    if (!body.holdings?.length) {
      return fail("At least one holding is required.");
    }

    const data = await handlePortfolioAnalyze({ holdings: body.holdings });
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unable to analyze portfolio.",
      500
    );
  }
}
