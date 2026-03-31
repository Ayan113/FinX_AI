import { getMarketInsights } from "@/backend/modules/marketService";

export async function handleMarketInsights(payload: { query: string }) {
  return getMarketInsights(payload.query);
}
