import type { BackendConfig, PersonaBackend } from "../types.js";

export class AnthropicBackend implements PersonaBackend {
  readonly name = "anthropic";
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly systemPrompt: string;

  constructor(cfg: BackendConfig) {
    if (!cfg.apiKey) throw new Error("Anthropic backend requires REDPILL_PERSONA_API_KEY");
    this.apiKey = cfg.apiKey;
    this.model = cfg.model ?? "claude-3-5-haiku-latest";
    this.baseUrl = cfg.baseUrl ?? "https://api.anthropic.com/v1";
    this.systemPrompt = cfg.systemPrompt;
  }

  async reply(userMessage: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        system: this.systemPrompt,
        max_tokens: 400,
        temperature: 0.7,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Anthropic ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content
      ?.filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("")
      .trim();
    return text && text.length > 0 ? text : "(empty reply)";
  }
}
