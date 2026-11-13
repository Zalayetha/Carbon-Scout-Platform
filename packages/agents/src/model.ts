import { OpenAIClient } from "@anvia/openai";

// Provider is selected with LLM_PROVIDER ("devscale" | "openrouter"). Default: devscale.
// Both are OpenAI-compatible; only the base URL, key and model ID format differ.
type Provider = "devscale" | "openrouter";

const PROVIDERS: Record<
  Provider,
  { baseUrl: string; apiKeyEnv: string; defaultModel: string; dropTemperature: boolean }
> = {
  devscale: {
    baseUrl: process.env.OPENAI_BASE_URL ?? "https://gateway.devscale.id/v1",
    apiKeyEnv: "OPENAI_API_KEY",
    defaultModel: "gpt-6-luna",
    dropTemperature: true,
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    defaultModel: "openai/gpt-6-luna",
    dropTemperature: false,
  },
};

function getProvider(): Provider {
  const value = (process.env.LLM_PROVIDER ?? "devscale").toLowerCase();
  if (value !== "devscale" && value !== "openrouter") {
    throw new Error(`Unknown LLM_PROVIDER "${value}". Use "devscale" or "openrouter".`);
  }
  return value;
}

const provider = PROVIDERS[getProvider()];

// Override with LLM_MODEL_ID to try another model on the selected provider.
export const DEFAULT_MODEL_ID = process.env.LLM_MODEL_ID ?? provider.defaultModel;

let client: OpenAIClient | undefined;

function getClient(): OpenAIClient {
  if (!client) {
    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) throw new Error(`Set ${provider.apiKeyEnv}.`);
    client = new OpenAIClient({ apiKey, baseUrl: provider.baseUrl });
  }
  return client;
}

export function getModel(modelId: string = DEFAULT_MODEL_ID) {
  const model = getClient().completionModel({ modelId, api: "chat" });
  return provider.dropTemperature ? withoutTemperature(model) : model;
}

// Reasoning models (e.g. gpt-6-luna) reject `temperature`. OpenRouter silently strips it,
// but the Devscale gateway forwards it and returns 400. Anvia's eval judges always send
// temperature: 0, so strip it from every request on providers that don't do this themselves.
function withoutTemperature<T extends object>(model: T): T {
  return new Proxy(model, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") return value;
      return (...args: unknown[]) => {
        const [request, ...rest] = args;
        if (request && typeof request === "object" && "temperature" in request) {
          const { temperature: _dropped, ...cleaned } = request as Record<string, unknown>;
          return value.call(target, cleaned, ...rest);
        }
        return value.apply(target, args);
      };
    },
  });
}
