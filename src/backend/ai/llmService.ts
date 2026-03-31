import { generateCompletion } from "@/backend/ai/llmClient";

export async function runFinancialAnalysis(
  prompt: string,
  fallback: string,
  system = "You are FinInsight AI, a careful financial market intelligence copilot. Provide concise, structured analysis with educational disclaimers and no personalized financial advice."
) {
  try {
    const completion = await generateCompletion({ system, prompt });
    return completion ?? fallback;
  } catch {
    return fallback;
  }
}
