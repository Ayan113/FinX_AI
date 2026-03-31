export const env = {
  llmApiKey: process.env.LLM_API_KEY ?? "",
  llmProvider: process.env.LLM_PROVIDER ?? "groq",
  llmModel: process.env.LLM_MODEL ?? "llama-3.3-70b-versatile",
  llmBaseUrl: process.env.LLM_BASE_URL ?? "",
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY ?? "",
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID ?? "EXAVITQu4vr4xnSDxMaL",
  port: process.env.PORT ?? "3000",
  nextPublicApiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
};
