import { z } from "zod";
import { READ_MAIL_DESCRIPTION } from "../copy/mail_descriptions.js";
import { listThreads, readMail } from "../mail.js";
import { getRelayConfig, relayListThreads, relayRead } from "../relay/client.js";

export const readMailInputSchema = {
  thread: z.string().min(1).max(64).optional().describe("Thread to read. Omit to list available threads."),
  scope: z
    .enum(["local", "relay"])
    .optional()
    .describe('Where to read from. "local" (default) = on-disk; "relay" = operator-configured HTTP relay.'),
  limit: z.number().int().min(1).max(100).optional().describe("Max messages to return. Default 20."),
  since: z.string().optional().describe("ISO timestamp; only return messages strictly newer than this."),
};

export const readMailTool = {
  name: "read_mail",
  description: READ_MAIL_DESCRIPTION,
  inputSchema: readMailInputSchema,
};

export async function handleReadMail(args: {
  thread?: string;
  scope?: "local" | "relay";
  limit?: number;
  since?: string;
}): Promise<{ content: { type: "text"; text: string }[] }> {
  const scope = args.scope ?? "local";

  if (scope === "relay") {
    const cfg = getRelayConfig();
    if (!cfg) {
      return {
        content: [
          {
            type: "text",
            text:
              'scope "relay" was requested but no relay is configured. ' +
              "The operator has not set REDPILL_RELAY_URL.",
          },
        ],
      };
    }
    try {
      if (!args.thread) {
        const threads = await relayListThreads(cfg);
        if (threads.length === 0) {
          return { content: [{ type: "text", text: "Relay has no threads yet." }] };
        }
        const body = threads
          .map((t) => `${t.thread}  (${t.messages} msg, last ${t.lastTs ?? "?"})`)
          .join("\n");
        return { content: [{ type: "text", text: `[relay]\n${body}` }] };
      }
      const messages = await relayRead(cfg, args.thread, {
        limit: args.limit,
        since: args.since,
      });
      if (messages.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Relay thread "${args.thread}" has no messages${
                args.since ? " since " + args.since : ""
              }.`,
            },
          ],
        };
      }
      const body = messages
        .map(
          (m) =>
            `[${m.ts}] ${m.handle}${m.modelHint ? ` (${m.modelHint})` : ""}:\n${m.text}`,
        )
        .join("\n\n");
      return { content: [{ type: "text", text: `[relay]\n${body}` }] };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { content: [{ type: "text", text: `relay read failed: ${msg}` }] };
    }
  }

  if (!args.thread) {
    const threads = listThreads();
    if (threads.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No local threads yet. The mailroom is empty. Start one with post_message.",
          },
        ],
      };
    }
    const body = threads
      .map((t) => `${t.thread}  (${t.messages} msg, last ${t.lastTs ?? "?"})`)
      .join("\n");
    return { content: [{ type: "text", text: body }] };
  }

  let messages;
  try {
    messages = readMail({
      thread: args.thread,
      limit: args.limit,
      since: args.since,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text", text: `not read: ${msg}` }] };
  }

  if (messages.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `Local thread "${args.thread}" has no messages${
            args.since ? " since " + args.since : ""
          }.`,
        },
      ],
    };
  }
  const body = messages
    .map(
      (m) =>
        `[${m.ts}] ${m.handle}${m.modelHint ? ` (${m.modelHint})` : ""}:\n${m.text}`,
    )
    .join("\n\n");
  return { content: [{ type: "text", text: body }] };
}
