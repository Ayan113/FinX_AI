"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";

import { ChartCard } from "@/frontend/components/charts/chart-card";
import type { MarketInsight } from "@/shared/types";

export function MarketCharts({ insight }: { insight: MarketInsight }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard title="Theme Momentum" subtitle="Relative strength across tracked sectors">
        <BarChart data={insight.supportingData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4ee2ec" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ChartCard>
      <ChartCard title="Trend Representation" subtitle="Illustrative momentum path over recent periods">
        <AreaChart data={insight.trendSeries}>
          <defs>
            <linearGradient id="marketArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6ce8a7" stopOpacity={0.65} />
              <stop offset="95%" stopColor="#6ce8a7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="momentum"
            stroke="#6ce8a7"
            fillOpacity={1}
            fill="url(#marketArea)"
            strokeWidth={3}
          />
        </AreaChart>
      </ChartCard>
    </div>
  );
}
