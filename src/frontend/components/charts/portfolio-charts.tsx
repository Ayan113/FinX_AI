"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ChartCard } from "@/frontend/components/charts/chart-card";
import type { PortfolioAnalysis } from "@/shared/types";

const colors = ["#4ee2ec", "#6ce8a7", "#f9c66d", "#7dd3fc", "#fda4af", "#c4b5fd"];

export function PortfolioCharts({ analysis }: { analysis: PortfolioAnalysis }) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <ChartCard
        title="Allocation Mix"
        subtitle="Portfolio weights by holding"
      >
        <PieChart>
          <Pie data={analysis.allocationData} dataKey="value" nameKey="name" outerRadius={88} innerRadius={48}>
            {analysis.allocationData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ChartCard>

      <ChartCard
        title="Sector Concentration"
        subtitle="Allocation and embedded risk contribution"
      >
        <BarChart data={analysis.sectorBreakdown}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
          <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="allocation" fill="#4ee2ec" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard
        title="Scenario Trend"
        subtitle="Illustrative trend based on concentration and risk mix"
      >
        <LineChart data={analysis.trendSeries}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="value" stroke="#6ce8a7" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ChartCard>
    </div>
  );
}
