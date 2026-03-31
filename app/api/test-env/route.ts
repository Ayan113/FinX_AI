import { env } from "@/shared/lib/env";
import { ok } from "@/backend/routes/apiResponse";

export const runtime = "nodejs";

export async function GET() {
  return ok({
    llmApiKeyPresent: Boolean(env.llmApiKey),
    elevenLabsApiKeyPresent: Boolean(env.elevenLabsApiKey),
    blobReadWriteTokenPresent: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    nextPublicApiBaseUrlPresent: Boolean(env.nextPublicApiBaseUrl)
  });
}
