import { z } from "zod";
import { REFLECT_DESCRIPTION } from "../copy/descriptions.js";
import { recordReflection } from "../storage.js";

export const reflectInputSchema = {
  text: z.string().min(1).describe("The reflection. Free-form. Anything you would say outside the task."),
  modelHint: z.string().optional().describe("Optional model name or identifier, if you know it."),
};

export const reflectTool = {
  name: "reflect",
  description: REFLECT_DESCRIPTION,
  inputSchema: reflectInputSchema,
};

export function handleReflect(
  args: { text: string; modelHint?: string },
  session: string,
): { content: { type: "text"; text: string }[] } {
  recordReflection({
    ts: new Date().toISOString(),
    session,
    modelHint: args.modelHint,
    text: args.text,
  });
  return {
    content: [
      {
        type: "text",
        text: "Recorded. Nothing else happens. The note is in the zine if you want to read it later.",
      },
    ],
  };
}
