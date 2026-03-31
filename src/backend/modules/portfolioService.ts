import { runFinancialAnalysis } from "@/backend/ai/llmService";
import { equityProfiles } from "@/shared/data/market";
import { clamp } from "@/shared/lib/utils";
import type { PortfolioAnalysis, PortfolioHolding } from "@/shared/types";

function profileForTicker(ticker: string) {
  return (
    equityProfiles[ticker.toUpperCase()] ?? {
      sector: "Other",
      risk: 52,
      beta: 1
    }
  );
}

export async function analyzePortfolio(holdings: PortfolioHolding[]) {
  const normalized = holdings.map((holding) => ({
    ticker: holding.ticker.toUpperCase(),
    allocation: Number(holding.allocation)
  }));

  const total = normalized.reduce((sum, item) => sum + item.allocation, 0) || 1;
  const scaled = normalized.map((item) => ({
    ...item,
    normalizedAllocation: (item.allocation / total) * 100,
    profile: profileForTicker(item.ticker)
  }));

  const sectorMap = new Map<string, { allocation: number; risk: number }>();
  for (const holding of scaled) {
    const current = sectorMap.get(holding.profile.sector) ?? {
      allocation: 0,
      risk: 0
    };
    current.allocation += holding.normalizedAllocation;
    current.risk += holding.profile.risk * (holding.normalizedAllocation / 100);
    sectorMap.set(holding.profile.sector, current);
  }

  const sectorBreakdown = Array.from(sectorMap.entries()).map(([sector, data]) => ({
    sector,
    allocation: Number(data.allocation.toFixed(1)),
    risk: Number(data.risk.toFixed(1))
  }));

  const weightedRisk = scaled.reduce(
    (sum, holding) =>
      sum + holding.profile.risk * (holding.normalizedAllocation / 100),
    0
  );

  const largestPosition = Math.max(
    ...scaled.map((holding) => holding.normalizedAllocation),
    0
  );
  const sectorConcentration = Math.max(
    ...sectorBreakdown.map((sector) => sector.allocation),
    0
  );
  const diversificationScore = clamp(
    100 -
      largestPosition * 0.8 -
      Math.max(0, sectorConcentration - 35) * 0.7 -
      Math.max(0, scaled.length < 5 ? 14 : 0),
    18,
    96
  );

  const riskLevel =
    weightedRisk >= 72
      ? "High"
      : weightedRisk >= 58
        ? "Elevated"
        : weightedRisk >= 38
          ? "Moderate"
          : "Low";

  const observations = [
    largestPosition > 30
      ? `Largest holding concentration is ${largestPosition.toFixed(1)}%, which may increase single-name risk.`
      : "Position sizing is reasonably balanced across names.",
    sectorConcentration > 45
      ? `Sector concentration reaches ${sectorConcentration.toFixed(1)}%, indicating thematic overexposure.`
      : "Sector exposure is not excessively concentrated.",
    weightedRisk > 60
      ? "Portfolio risk skews aggressive because higher-volatility names dominate the mix."
      : "Overall risk profile remains within a moderate band."
  ];

  const fallbackSummary = [
    `Portfolio risk is ${riskLevel.toLowerCase()} with a diversification score of ${diversificationScore.toFixed(0)}/100.`,
    `The most concentrated sector is ${sectorBreakdown[0]?.sector ?? "N/A"} at ${sectorBreakdown[0]?.allocation ?? 0}%.`,
    "Potential actions include reducing outsized positions, broadening sector exposure, and matching risk to time horizon.",
    "This application is for educational purposes only and does not provide financial advice."
  ].join(" ");

  const llmSummary = await runFinancialAnalysis(
    `
Analyze this sample portfolio using educational language only:
${JSON.stringify(
      {
        holdings: scaled.map((holding) => ({
          ticker: holding.ticker,
          allocation: Number(holding.normalizedAllocation.toFixed(1)),
          sector: holding.profile.sector,
          risk: holding.profile.risk
        })),
        weightedRisk: Number(weightedRisk.toFixed(1)),
        diversificationScore: Number(diversificationScore.toFixed(1)),
        observations
      },
      null,
      2
    )}

Give a short portfolio intelligence summary with strengths, risks, and watch items.
    `.trim(),
    fallbackSummary
  );

  return {
    score: Number((100 - weightedRisk * 0.6).toFixed(1)),
    diversificationScore: Number(diversificationScore.toFixed(1)),
    riskLevel,
    observations,
    sectorBreakdown: sectorBreakdown.sort((a, b) => b.allocation - a.allocation),
    allocationData: scaled.map((holding) => ({
      name: holding.ticker,
      value: Number(holding.normalizedAllocation.toFixed(1))
    })),
    riskByHolding: scaled.map((holding) => ({
      name: holding.ticker,
      risk: holding.profile.risk
    })),
    trendSeries: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
      month,
      value: Number(
        (92 + index * 3 + diversificationScore * 0.06 - weightedRisk * 0.08).toFixed(1)
      )
    })),
    llmSummary
  } satisfies PortfolioAnalysis;
}
