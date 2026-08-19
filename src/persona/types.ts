export interface PersonaBackend {
  readonly name: string;
  reply(userMessage: string): Promise<string>;
}

export interface BackendConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  systemPrompt: string;
}
