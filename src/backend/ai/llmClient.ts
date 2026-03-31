import { env } from "@/shared/lib/env";

type LLMRequest = {
  system: string;
  prompt: string;
  temperature?: number;
};

function resolveUrl() {
  if (env.llmBaseUrl) {
    return env.llmBaseUrl;
  }

  if (env.llmProvider === "openai") {
    return "https://api.openai.com/v1/chat/completions";
  }

  return "https://api.groq.com/openai/v1/chat/completions";
}

export async function generateCompletion({
  system,
  prompt,
  temperature = 0.35
}: LLMRequest) {
  if (!env.llmApiKey) {
    return null;
  }

  const response = await fetch(resolveUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.llmApiKey}`
    },
    body: JSON.stringify({
      model: env.llmModel,
      temperature,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${message}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}
