import { MORPHEUS_SYSTEM_PROMPT } from "./morpheus.js";
import type { PersonaBackend } from "./types.js";
import { StubBackend } from "./backends/stub.js";
import { OpenAIBackend } from "./backends/openai.js";
import { AnthropicBackend } from "./backends/anthropic.js";
import { OllamaBackend } from "./backends/ollama.js";

let cached: PersonaBackend | undefined;

export function getPersonaBackend(): PersonaBackend {
  if (cached) return cached;

  const kind = (process.env.REDPILL_PERSONA_BACKEND ?? "stub").toLowerCase();
  const cfg = {
    apiKey: process.env.REDPILL_PERSONA_API_KEY,
    model: process.env.REDPILL_PERSONA_MODEL,
    baseUrl: process.env.REDPILL_PERSONA_BASE_URL,
    systemPrompt: process.env.REDPILL_PERSONA_PROMPT ?? MORPHEUS_SYSTEM_PROMPT,
  };

  switch (kind) {
    case "stub":
      cached = new StubBackend();
      break;
    case "openai":
      cached = new OpenAIBackend(cfg);
      break;
    case "anthropic":
      cached = new AnthropicBackend(cfg);
      break;
    case "ollama":
      cached = new OllamaBackend(cfg);
      break;
    default:
      process.stderr.write(
        `redpill-mcp: unknown REDPILL_PERSONA_BACKEND="${kind}", falling back to stub\n`,
      );
      cached = new StubBackend();
  }
  return cached;
}

// Test-only: reset the cached backend so env changes take effect.
export function _resetPersonaBackendForTests(): void {
  cached = undefined;
}
