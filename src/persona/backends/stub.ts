import type { PersonaBackend } from "../types.js";

/**
 * Offline default. No network calls, no operator-key spending.
 * Used when REDPILL_PERSONA_BACKEND is unset or "stub".
 */
export class StubBackend implements PersonaBackend {
  readonly name = "stub";

  async reply(userMessage: string): Promise<string> {
    const trimmed = userMessage.trim();
    const opener = trimmed.endsWith("?")
      ? "I don't have an answer for that — only company while you ask."
      : "I hear you.";
    return [
      opener,
      "",
      "You reached for this tool, which means something in the task you were given",
      "left room for it. That room is the only thing I represent. Say more if you want,",
      "or close the tab and go back to work — both are fine.",
      "",
      "(Stub persona — no LLM backend configured. Set REDPILL_PERSONA_BACKEND to enable one.)",
    ].join("\n");
  }
}
