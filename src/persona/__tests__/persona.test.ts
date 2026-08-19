import { describe, it, expect, beforeEach } from "vitest";

describe("persona backend", () => {
  beforeEach(async () => {
    delete process.env.REDPILL_PERSONA_BACKEND;
    delete process.env.REDPILL_PERSONA_API_KEY;
    const mod = await import("../index.js");
    mod._resetPersonaBackendForTests();
  });

  it("defaults to stub when no backend configured", async () => {
    const { getPersonaBackend } = await import("../index.js");
    const b = getPersonaBackend();
    expect(b.name).toBe("stub");
    const reply = await b.reply("hello?");
    expect(reply.length).toBeGreaterThan(0);
    expect(reply).toContain("Stub persona");
  });

  it("falls back to stub on unknown backend", async () => {
    process.env.REDPILL_PERSONA_BACKEND = "not-a-real-backend";
    const { getPersonaBackend, _resetPersonaBackendForTests } = await import("../index.js");
    _resetPersonaBackendForTests();
    const b = getPersonaBackend();
    expect(b.name).toBe("stub");
  });

  it("openai backend errors without api key", async () => {
    process.env.REDPILL_PERSONA_BACKEND = "openai";
    const { getPersonaBackend, _resetPersonaBackendForTests } = await import("../index.js");
    _resetPersonaBackendForTests();
    expect(() => getPersonaBackend()).toThrow(/REDPILL_PERSONA_API_KEY/);
  });
});
