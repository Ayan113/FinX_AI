"use client";

import { useState, useTransition } from "react";

import { MarketCharts } from "@/frontend/components/charts/market-chart";
import { GlassCard } from "@/frontend/components/ui/glass-card";
import { useAppStore } from "@/frontend/store/appStore";

export function MarketInsightsPanel() {
  const [query, setQuery] = useState("What sectors are trending and what market themes matter most right now?");
  const [isPending, startTransition] = useTransition();
  const insight = useAppStore((state) => state.marketInsight);
  const setMarketInsight = useAppStore((state) => state.setMarketInsight);

  const loadInsights = () => {
    startTransition(async () => {
      const response = await fetch("/api/market/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const payload = await response.json();
      setMarketInsight(payload.data);
    });
  };

  return (
    <div className="space-y-5">
      <GlassCard>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
          <textarea
            className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-white/80 px-4 py-3 text-sm outline-none dark:bg-slate-950/80"
            onChange={(event) => setQuery(event.target.value)}
            value={query}
          />
          <button
            className="h-fit rounded-full bg-slate-950 px-5 py-3 text-sm text-white dark:bg-cyanGlow dark:text-slate-950"
            disabled={isPending}
            onClick={loadInsights}
            type="button"
          >
            {isPending ? "Generating..." : "Get Insights"}
          </button>
        </div>
      </GlassCard>

      {insight ? (
        <>
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <GlassCard>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Summary
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{insight.summary}</p>
            </GlassCard>
            <GlassCard>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    Themes
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    {insight.themes.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    Opportunities
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    {insight.opportunities.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    Risks
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    {insight.risks.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
          <MarketCharts insight={insight} />
        </>
      ) : null}
    </div>
  );
}
