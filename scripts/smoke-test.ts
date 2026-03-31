const { loadEnvConfig } = require("@next/env");

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type CheckResult = {
  name: string;
  passed: boolean;
  detail: string;
};

const projectDir = process.cwd();
loadEnvConfig(projectDir);
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  `http://localhost:${process.env.PORT || "3000"}`;

async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<ApiEnvelope<T>> {
  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, init);
  } catch (error) {
    throw new Error(
      `Unable to reach ${baseUrl}. Start the local Next.js server with "npm run dev" or "npm run start" before running the smoke test. Original error: ${
        error instanceof Error ? error.message : "Unknown fetch error"
      }`
    );
  }

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || `Request failed for ${path} with ${response.status}`);
  }

  return payload;
}

function logResult(result: CheckResult) {
  const status = result.passed ? "PASS" : "FAIL";
  const logger = result.passed ? console.log : console.error;
  logger(`[${status}] ${result.name} - ${result.detail}`);
}

function assertCondition(name: string, condition: boolean, detail: string): CheckResult {
  return {
    name,
    passed: condition,
    detail
  };
}

async function checkEnvRoute() {
  const payload = await requestJson<{
    llmApiKeyPresent: boolean;
    elevenLabsApiKeyPresent: boolean;
    nextPublicApiBaseUrlPresent: boolean;
  }>("/api/test-env");

  return assertCondition(
    "Environment route",
    typeof payload.data?.llmApiKeyPresent === "boolean" &&
      typeof payload.data?.elevenLabsApiKeyPresent === "boolean",
    `LLM key present=${payload.data?.llmApiKeyPresent}, ElevenLabs key present=${payload.data?.elevenLabsApiKeyPresent}`
  );
}

async function checkRagUpload() {
  const formData = new FormData();
  formData.append(
    "file",
    new File(
      [
        "FinInsight sample document.\nRevenue growth improved to 21% while operating margin expanded.\nThe report highlights AI infrastructure demand and free cash flow strength."
      ],
      "sample-financial-note.txt",
      { type: "text/plain" }
    )
  );

  const payload = await requestJson<{
    fileName: string;
    chunks: number;
    preview: string;
    documents: Array<{ documentId: string; documentName: string; chunks: number }>;
  }>("/api/rag/upload", {
    method: "POST",
    body: formData
  });

  return assertCondition(
    "RAG upload",
    Boolean(payload.data?.fileName) &&
      (payload.data?.chunks || 0) > 0 &&
      (payload.data?.documents?.length || 0) > 0,
    `Indexed ${payload.data?.chunks} chunks from ${payload.data?.fileName}`
  );
}

async function checkRagQuery() {
  const payload = await requestJson<{
    answer: string;
    citations: Array<{ id: string; documentName: string; chunkIndex: number }>;
  }>("/api/rag/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "What improved in the uploaded financial document?"
    })
  });

  return assertCondition(
    "RAG query",
    Boolean(payload.data?.answer) && (payload.data?.citations?.length || 0) > 0,
    `Received ${payload.data?.citations?.length || 0} citations`
  );
}

async function checkChat() {
  const payload = await requestJson<{
    answer: string;
    citations: Array<{ id: string }>;
  }>("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Summarize the key signal from the uploaded note.",
      useRag: true
    })
  });

  return assertCondition(
    "Chat endpoint",
    Boolean(payload.data?.answer),
    `Answer preview: ${payload.data?.answer?.slice(0, 80) || "empty"}`
  );
}

async function checkPortfolio() {
  const payload = await requestJson<{
    score: number;
    diversificationScore: number;
    riskLevel: string;
    observations: string[];
    sectorBreakdown: Array<{ sector: string; allocation: number }>;
  }>("/api/portfolio/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      holdings: [
        { ticker: "MSFT", allocation: 30 },
        { ticker: "NVDA", allocation: 25 },
        { ticker: "JPM", allocation: 20 },
        { ticker: "JNJ", allocation: 15 },
        { ticker: "XOM", allocation: 10 }
      ]
    })
  });

  return assertCondition(
    "Portfolio analyze",
    typeof payload.data?.score === "number" &&
      typeof payload.data?.diversificationScore === "number" &&
      Boolean(payload.data?.riskLevel) &&
      Array.isArray(payload.data?.observations) &&
      Array.isArray(payload.data?.sectorBreakdown),
    `Risk=${payload.data?.riskLevel}, sectors=${payload.data?.sectorBreakdown?.length || 0}`
  );
}

async function checkMarket() {
  const payload = await requestJson<{
    summary: string;
    themes: string[];
    opportunities: string[];
    risks: string[];
    supportingData: Array<{ label: string; value: number }>;
  }>("/api/market/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "What sectors are trending and what risks should I watch?"
    })
  });

  return assertCondition(
    "Market insights",
    Boolean(payload.data?.summary) &&
      Array.isArray(payload.data?.themes) &&
      Array.isArray(payload.data?.supportingData),
    `Themes=${payload.data?.themes?.join(", ") || "none"}`
  );
}

async function checkVoice() {
  const payload = await requestJson<{
    audioBase64: string;
    mimeType: string;
    provider: string;
  }>("/api/voice/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "This is a smoke test for the FinInsight AI voice endpoint."
    })
  });

  const playable =
    Boolean(payload.data?.audioBase64) &&
    ["audio/mpeg", "text/plain"].includes(payload.data?.mimeType || "");

  return assertCondition(
    "Voice TTS",
    playable,
    `provider=${payload.data?.provider}, mimeType=${payload.data?.mimeType}`
  );
}

async function main() {
  console.log(`Running smoke test against ${baseUrl}`);

  const checks: Array<() => Promise<CheckResult>> = [
    checkEnvRoute,
    checkRagUpload,
    checkRagQuery,
    checkChat,
    checkPortfolio,
    checkMarket,
    checkVoice
  ];

  const results: CheckResult[] = [];

  for (const check of checks) {
    try {
      const result = await check();
      results.push(result);
      logResult(result);
    } catch (error) {
      const result = {
        name: check.name || "Unknown check",
        passed: false,
        detail: error instanceof Error ? error.message : "Unknown error"
      };
      results.push(result);
      logResult(result);
    }
  }

  const failures = results.filter((result) => !result.passed);
  console.log(
    `Completed ${results.length} checks with ${failures.length} failure${failures.length === 1 ? "" : "s"}.`
  );

  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Smoke test runner crashed:", error);
  process.exit(1);
});
