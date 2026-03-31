export type Citation = {
  id: string;
  documentName: string;
  chunkIndex: number;
  snippet: string;
  similarity?: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  createdAt: string;
};

export type UploadDocument = {
  id: string;
  fileName: string;
  contentType: string;
  text: string;
  uploadedAt: string;
};

export type VectorRecord = {
  id: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
  metadata: Record<string, string | number>;
};

export type PortfolioHolding = {
  ticker: string;
  allocation: number;
};

export type SectorBreakdown = {
  sector: string;
  allocation: number;
  risk: number;
};

export type PortfolioAnalysis = {
  score: number;
  diversificationScore: number;
  riskLevel: "Low" | "Moderate" | "Elevated" | "High";
  observations: string[];
  sectorBreakdown: SectorBreakdown[];
  allocationData: Array<{ name: string; value: number }>;
  riskByHolding: Array<{ name: string; risk: number }>;
  trendSeries: Array<{ month: string; value: number }>;
  llmSummary: string;
};

export type MarketInsight = {
  summary: string;
  themes: string[];
  opportunities: string[];
  risks: string[];
  supportingData: Array<{ label: string; value: number }>;
  trendSeries: Array<{ month: string; momentum: number }>;
};
