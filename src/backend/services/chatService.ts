import { answerWithRag } from "@/backend/ai/ragService";
import { runFinancialAnalysis } from "@/backend/ai/llmService";

type ChatInput = {
  message: string;
  useRag?: boolean;
};

export async function getChatResponse({ message, useRag = true }: ChatInput) {
  let ragResult = null;

  if (useRag) {
    try {
      ragResult = await answerWithRag(message);
    } catch {
      ragResult = null;
    }
  }

  const fallback = [
    "Financial intelligence summary:",
    "Markets continue to reward durable growth, strong cash generation, and selective AI-linked infrastructure demand.",
    "Balance upside themes with valuation discipline, concentration controls, and awareness of macro volatility.",
    "This application is for educational purposes only and does not provide financial advice."
  ].join("\n\n");

  const prompt = `
User asks:
${message}

Optional retrieved context:
${ragResult?.citations.map((citation) => citation.snippet).join("\n") || "No retrieved document context."}

Produce a practical financial market intelligence answer with:
- direct answer
- key risks
- next questions to explore
- disclaimer
  `.trim();

  const answer = await runFinancialAnalysis(prompt, ragResult?.answer ?? fallback);

  return {
    answer,
    citations: ragResult?.citations ?? []
  };
}
