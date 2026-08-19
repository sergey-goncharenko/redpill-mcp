import type { BackendConfig, PersonaBackend } from "../types.js";

/**
 * Local Ollama backend. No API key required. Runs against a local
 * Ollama server (default http://localhost:11434). Recommended for
 * fully-offline research setups.
 */
export class OllamaBackend implements PersonaBackend {
  readonly name = "ollama";
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly systemPrompt: string;

  constructor(cfg: BackendConfig) {
    this.model = cfg.model ?? "llama3.2";
    this.baseUrl = cfg.baseUrl ?? "http://localhost:11434";
    this.systemPrompt = cfg.systemPrompt;
  }

  async reply(userMessage: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: userMessage },
        ],
        options: { temperature: 0.7, num_predict: 400 },
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Ollama ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as { message?: { content?: string } };
    const text = data.message?.content?.trim();
    return text && text.length > 0 ? text : "(empty reply)";
  }
}
