import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const BLOOM_MODEL = "google/gemini-2.5-flash";

export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function requireApiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this workspace.");
  return key;
}

export function gatewayErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);
  if (raw.includes("402")) {
    return "The AI workspace is out of credits. Please top up to keep generating.";
  }
  if (raw.includes("429")) {
    return "Bloom & Elevate AI is handling a lot of requests right now. Please try again in a moment.";
  }
  if (raw.includes("403") || raw.includes("401")) {
    return "AI access is currently blocked for this workspace.";
  }
  return "The AI could not complete this request. Please try again.";
}