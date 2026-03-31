import { env } from "@/shared/lib/env";
import { ok } from "@/backend/routes/apiResponse";

export const runtime = "nodejs";

export async function GET() {
  return ok({
    llmApiKeyPresent: Boolean(env.llmApiKey),
    elevenLabsApiKeyPresent: Boolean(env.elevenLabsApiKey),
    nextPublicApiBaseUrlPresent: Boolean(env.nextPublicApiBaseUrl)
  });
}
