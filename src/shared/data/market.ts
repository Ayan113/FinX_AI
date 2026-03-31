export const marketThemes = [
  {
    sector: "AI Infrastructure",
    momentum: 86,
    sentiment: "Positive",
    driver: "Enterprise demand for accelerated compute and sovereign AI."
  },
  {
    sector: "Cybersecurity",
    momentum: 78,
    sentiment: "Positive",
    driver: "Persistent security budgets and platform consolidation."
  },
  {
    sector: "Fintech",
    momentum: 64,
    sentiment: "Mixed",
    driver: "Margin improvement but selective consumer-credit pressure."
  },
  {
    sector: "Energy Transition",
    momentum: 70,
    sentiment: "Positive",
    driver: "Grid modernization, storage investment, and industrial policy."
  },
  {
    sector: "Healthcare Innovation",
    momentum: 68,
    sentiment: "Positive",
    driver: "Therapeutics pipelines and AI-enabled diagnostics."
  }
];

export const equityProfiles: Record<
  string,
  { sector: string; risk: number; beta: number }
> = {
  AAPL: { sector: "Technology", risk: 42, beta: 0.96 },
  MSFT: { sector: "Technology", risk: 38, beta: 0.88 },
  NVDA: { sector: "Technology", risk: 82, beta: 1.74 },
  GOOGL: { sector: "Communication Services", risk: 48, beta: 1.04 },
  AMZN: { sector: "Consumer Discretionary", risk: 55, beta: 1.18 },
  META: { sector: "Communication Services", risk: 58, beta: 1.21 },
  JPM: { sector: "Financials", risk: 46, beta: 1.02 },
  V: { sector: "Financials", risk: 34, beta: 0.93 },
  XOM: { sector: "Energy", risk: 49, beta: 0.91 },
  JNJ: { sector: "Healthcare", risk: 26, beta: 0.55 },
  UNH: { sector: "Healthcare", risk: 40, beta: 0.71 },
  TSLA: { sector: "Consumer Discretionary", risk: 88, beta: 2.01 },
  AMD: { sector: "Technology", risk: 72, beta: 1.67 },
  PLTR: { sector: "Technology", risk: 77, beta: 1.54 },
  BAC: { sector: "Financials", risk: 45, beta: 1.11 }
};
