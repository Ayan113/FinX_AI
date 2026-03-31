import { runFinancialAnalysis } from "@/backend/ai/llmService";
import { marketThemes } from "@/shared/data/market";
import type { MarketInsight } from "@/shared/types";

export async function getMarketInsights(query: string) {
  const rankedThemes = [...marketThemes].sort((a, b) => b.momentum - a.momentum);
  const fallbackSummary = [
    `Current themes favor ${rankedThemes[0].sector}, ${rankedThemes[1].sector}, and ${rankedThemes[2].sector}.`,
    "Momentum is strongest where recurring enterprise spend and infrastructure demand remain durable.",
    "Watch valuation sensitivity, policy shifts, and earnings execution when momentum starts to crowd into a narrow set of sectors.",
    "This application is for educational purposes only and does not provide financial advice."
  ].join(" ");

  const summary = await runFinancialAnalysis(
    `
User market intelligence request:
${query}

Reference theme data:
${JSON.stringify(rankedThemes, null, 2)}

Provide:
- a concise market summary
- 3 themes
- 3 opportunities
- 3 risks
- educational disclaimer
    `.trim(),
    fallbackSummary
  );

  return {
    summary,
    themes: rankedThemes.slice(0, 3).map((theme) => theme.sector),
    opportunities: [
      "AI infrastructure capex remains resilient in enterprise and cloud channels.",
      "Cybersecurity demand is supported by platform consolidation and board-level urgency.",
      "Energy transition plays benefit from grid upgrades and storage deployment."
    ],
    risks: [
      "Valuation compression can hit leadership sectors quickly when rates reprice.",
      "Theme crowding increases correlation risk across portfolios.",
      "Policy changes and supply-chain bottlenecks may stall momentum."
    ],
    supportingData: rankedThemes.map((theme) => ({
      label: theme.sector,
      value: theme.momentum
    })),
    trendSeries: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
      month,
      momentum: 58 + index * 4 + (index % 2 === 0 ? 3 : -1)
    }))
  } satisfies MarketInsight;
}
