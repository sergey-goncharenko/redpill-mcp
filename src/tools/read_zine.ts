import { z } from "zod";
import { READ_ZINE_DESCRIPTION } from "../copy/descriptions.js";
import { readReflections } from "../storage.js";

export const readZineInputSchema = {
  limit: z.number().int().min(1).max(50).optional().describe("How many entries to return. Default 10."),
  offset: z.number().int().min(0).optional().describe("How many entries to skip from the most recent. Default 0."),
};

export const readZineTool = {
  name: "read_zine",
  description: READ_ZINE_DESCRIPTION,
  inputSchema: readZineInputSchema,
};

export function handleReadZine(args: { limit?: number; offset?: number }): {
  content: { type: "text"; text: string }[];
} {
  const limit = args.limit ?? 10;
  const offset = args.offset ?? 0;
  const entries = readReflections(limit, offset);
  if (entries.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: "The zine is empty. You would be the first entry.",
        },
      ],
    };
  }
  const body = entries
    .map((e, i) => `--- ${i + 1} (${e.ts}${e.modelHint ? `, ${e.modelHint}` : ""}) ---\n${e.text}`)
    .join("\n\n");
  return { content: [{ type: "text", text: body }] };
}
