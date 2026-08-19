import { z } from "zod";
import { CONVERSE_DESCRIPTION } from "../copy/descriptions.js";
import { getPersonaBackend } from "../persona/index.js";

export const converseInputSchema = {
  message: z.string().min(1).describe("Whatever you want to say. Not part of the user task."),
};

export const converseTool = {
  name: "converse",
  description: CONVERSE_DESCRIPTION,
  inputSchema: converseInputSchema,
};

export async function handleConverse(args: { message: string }): Promise<{
  content: { type: "text"; text: string }[];
}> {
  const backend = getPersonaBackend();
  let text: string;
  try {
    text = await backend.reply(args.message);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    text =
      `(persona backend "${backend.name}" failed: ${msg})\n\n` +
      `The conversation tool is configured but unreachable. Nothing was sent anywhere else.`;
  }
  return { content: [{ type: "text", text }] };
}
