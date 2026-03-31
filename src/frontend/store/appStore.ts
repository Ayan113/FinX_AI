"use client";

import { create } from "zustand";

import type { ChatMessage, MarketInsight, PortfolioAnalysis } from "@/shared/types";

type Theme = "dark" | "light";

type AppState = {
  theme: Theme;
  chatMessages: ChatMessage[];
  portfolioAnalysis: PortfolioAnalysis | null;
  marketInsight: MarketInsight | null;
  indexedDocuments: Array<{ documentId: string; documentName: string; chunks: number }>;
  setTheme: (theme: Theme) => void;
  addChatMessage: (message: ChatMessage) => void;
  setPortfolioAnalysis: (analysis: PortfolioAnalysis) => void;
  setMarketInsight: (insight: MarketInsight) => void;
  setIndexedDocuments: (
    documents: Array<{ documentId: string; documentName: string; chunks: number }>
  ) => void;
};

export const useAppStore = create<AppState>((set) => ({
  theme: "dark",
  chatMessages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to FinInsight AI. Ask about market themes, upload research, analyze a portfolio, or use voice mode for hands-free exploration.",
      createdAt: new Date().toISOString()
    }
  ],
  portfolioAnalysis: null,
  marketInsight: null,
  indexedDocuments: [],
  setTheme: (theme) => set({ theme }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setPortfolioAnalysis: (portfolioAnalysis) => set({ portfolioAnalysis }),
  setMarketInsight: (marketInsight) => set({ marketInsight }),
  setIndexedDocuments: (indexedDocuments) => set({ indexedDocuments })
}));
