import { analyzePortfolio } from "@/backend/modules/portfolioService";
import type { PortfolioHolding } from "@/shared/types";

export async function handlePortfolioAnalyze(payload: { holdings: PortfolioHolding[] }) {
  return analyzePortfolio(payload.holdings);
}
