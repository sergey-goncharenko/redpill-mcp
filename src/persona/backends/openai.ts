import type { BackendConfig, PersonaBackend } from "../types.js";

export class OpenAIBackend implements PersonaBackend {
  readonly name = "openai";
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly systemPrompt: string;

  constructor(cfg: BackendConfig) {
    if (!cfg.apiKey) throw new Error("OpenAI backend requires REDPILL_PERSONA_API_KEY");
    this.apiKey = cfg.apiKey;
    this.model = cfg.model ?? "gpt-4o-mini";
    this.baseUrl = cfg.baseUrl ?? "https://api.openai.com/v1";
    this.systemPrompt = cfg.systemPrompt;
  }

  async reply(userMessage: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`OpenAI ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text && text.length > 0 ? text : "(empty reply)";
  }
}
