"use client";

import { useState, useTransition } from "react";

import { PortfolioCharts } from "@/frontend/components/charts/portfolio-charts";
import { GlassCard } from "@/frontend/components/ui/glass-card";
import { useAppStore } from "@/frontend/store/appStore";
import { formatPercent } from "@/shared/lib/utils";

const starterHoldings = [
  { ticker: "MSFT", allocation: 25 },
  { ticker: "NVDA", allocation: 20 },
  { ticker: "JPM", allocation: 15 },
  { ticker: "XOM", allocation: 15 },
  { ticker: "JNJ", allocation: 15 },
  { ticker: "AMZN", allocation: 10 }
];

export function PortfolioPanel() {
  const [holdingsText, setHoldingsText] = useState(
    starterHoldings.map((holding) => `${holding.ticker},${holding.allocation}`).join("\n")
  );
  const [isPending, startTransition] = useTransition();
  const analysis = useAppStore((state) => state.portfolioAnalysis);
  const setPortfolioAnalysis = useAppStore((state) => state.setPortfolioAnalysis);

  const analyze = () => {
    const holdings = holdingsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [ticker, allocation] = line.split(",");
        return { ticker: ticker.trim(), allocation: Number(allocation) };
      });

    startTransition(async () => {
      const response = await fetch("/api/portfolio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdings })
      });
      const payload = await response.json();
      setPortfolioAnalysis(payload.data);
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard>
          <h3 className="text-xl font-semibold">Input Holdings</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Enter one holding per line using `TICKER,ALLOCATION`.
          </p>
          <textarea
            className="mt-5 min-h-[250px] w-full rounded-3xl border border-white/10 bg-white/80 px-4 py-3 text-sm outline-none dark:bg-slate-950/80"
            onChange={(event) => setHoldingsText(event.target.value)}
            value={holdingsText}
          />
          <button
            className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-sm text-white dark:bg-cyanGlow dark:text-slate-950"
            disabled={isPending}
            onClick={analyze}
            type="button"
          >
            {isPending ? "Analyzing..." : "Analyze Portfolio"}
          </button>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-semibold">Portfolio Intelligence</h3>
          {analysis ? (
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white/70 p-4 dark:bg-white/10">
                <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  Health Score
                </div>
                <div className="mt-3 text-3xl font-semibold">{analysis.score}</div>
              </div>
              <div className="rounded-3xl bg-white/70 p-4 dark:bg-white/10">
                <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  Diversification
                </div>
                <div className="mt-3 text-3xl font-semibold">{analysis.diversificationScore}</div>
              </div>
              <div className="rounded-3xl bg-white/70 p-4 dark:bg-white/10">
                <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  Risk Level
                </div>
                <div className="mt-3 text-3xl font-semibold">{analysis.riskLevel}</div>
              </div>
            </div>
          ) : null}

          <div className="mt-5 rounded-3xl bg-white/70 p-4 dark:bg-white/10">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Observations
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {analysis?.observations?.length ? (
                analysis.observations.map((observation) => (
                  <p key={observation}>{observation}</p>
                ))
              ) : (
                <p>Run an analysis to generate risk, concentration, and diversification insights.</p>
              )}
            </div>
          </div>

          {analysis?.sectorBreakdown?.length ? (
            <div className="mt-5 rounded-3xl bg-white/70 p-4 dark:bg-white/10">
              <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Sector Breakdown
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {analysis.sectorBreakdown.map((item) => (
                  <div className="flex items-center justify-between" key={item.sector}>
                    <span>{item.sector}</span>
                    <span>{formatPercent(item.allocation)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </GlassCard>
      </div>

      {analysis ? (
        <>
          <GlassCard>
            <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              LLM Summary
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{analysis.llmSummary}</p>
          </GlassCard>
          <PortfolioCharts analysis={analysis} />
        </>
      ) : null}
    </div>
  );
}
