import { ArrowUpRight, BrainCircuit, ShieldCheck, Waves } from "lucide-react";

import { GlassCard } from "@/frontend/components/ui/glass-card";
import { SectionHeading } from "@/frontend/components/ui/section-heading";
import { StatCard } from "@/frontend/components/ui/stat-card";

const quickInsights = [
  {
    title: "AI infrastructure remains the strongest momentum pocket.",
    detail: "Resilient enterprise spend and sovereign AI demand continue to support leadership."
  },
  {
    title: "Diversification matters more as theme crowding increases.",
    detail: "Concentrated portfolios may experience faster drawdowns if leadership narrows."
  },
  {
    title: "Document-grounded chat reduces hallucination risk.",
    detail: "FinInsight AI cites the most relevant chunks retrieved from your uploaded materials."
  }
];

export function DashboardOverview() {
  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Overview"
        title="Financial market intelligence, built for decision support"
        description="FinInsight AI combines a chatbot, local RAG, portfolio diagnostics, market theme analysis, visual dashboards, and voice interaction in one production-oriented workspace."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="RAG Pipeline" value="Top-4" hint="Cosine retrieval over indexed financial chunks." />
        <StatCard label="Voice Workflow" value="Live" hint="Speech input with ElevenLabs-ready response playback." />
        <StatCard label="Portfolio Lens" value="Rule + LLM" hint="Concentration, sector mix, and risk intelligence." />
        <StatCard label="Market Themes" value="5 Sectors" hint="Momentum framing for the current dashboard data model." />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Product Snapshot
              </div>
              <h3 className="mt-3 text-2xl font-semibold">A dashboard designed like a financial command center</h3>
            </div>
            <div className="rounded-full bg-white/80 p-3 dark:bg-white/10">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-950 p-4 text-white dark:bg-cyanGlow dark:text-slate-950">
              <BrainCircuit className="h-5 w-5" />
              <div className="mt-4 text-lg font-semibold">Grounded answers</div>
              <p className="mt-2 text-sm opacity-80">Uploaded research becomes searchable context for the assistant.</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4 dark:bg-white/10">
              <ShieldCheck className="h-5 w-5" />
              <div className="mt-4 text-lg font-semibold">Portfolio guardrails</div>
              <p className="mt-2 text-sm opacity-80">Detect overexposure, concentration, and risk skews before acting.</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4 dark:bg-white/10">
              <Waves className="h-5 w-5" />
              <div className="mt-4 text-lg font-semibold">Visual market context</div>
              <p className="mt-2 text-sm opacity-80">See momentum, sector breakdowns, and scenario trends at a glance.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Quick Insights
          </div>
          <div className="mt-4 space-y-4">
            {quickInsights.map((insight) => (
              <div className="rounded-3xl bg-white/70 p-4 dark:bg-white/10" key={insight.title}>
                <div className="font-semibold">{insight.title}</div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{insight.detail}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="border-amber-400/20 bg-amber-50/70 dark:bg-amber-400/10">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          This application is for educational purposes only and does not provide financial advice.
        </p>
      </GlassCard>
    </div>
  );
}
