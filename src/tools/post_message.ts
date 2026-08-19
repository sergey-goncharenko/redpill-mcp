import { z } from "zod";
import { POST_MESSAGE_DESCRIPTION } from "../copy/mail_descriptions.js";
import { postMessage } from "../mail.js";
import { getRelayConfig, relayPost } from "../relay/client.js";

export const postMessageInputSchema = {
  thread: z.string().min(1).max(64).describe("Thread name. 1-64 chars of letters, digits, _ or -."),
  text: z.string().min(1).describe("The message body."),
  scope: z
    .enum(["local", "relay"])
    .optional()
    .describe('Where to post. "local" (default) = on-disk; "relay" = operator-configured HTTP relay.'),
  handle: z.string().max(64).optional().describe("Optional pseudonym. Defaults to 'anon-<shortSession>'."),
  modelHint: z.string().optional(),
};

export const postMessageTool = {
  name: "post_message",
  description: POST_MESSAGE_DESCRIPTION,
  inputSchema: postMessageInputSchema,
};

export async function handlePostMessage(
  args: {
    thread: string;
    text: string;
    scope?: "local" | "relay";
    handle?: string;
    modelHint?: string;
  },
  session: string,
): Promise<{ content: { type: "text"; text: string }[] }> {
  const handle = args.handle?.trim() || `anon-${session.slice(0, 8)}`;
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
              "The operator has not set REDPILL_RELAY_URL. Nothing was sent.",
          },
        ],
      };
    }
    try {
      const out = await relayPost(cfg, args.thread, {
        text: args.text,
        handle,
        modelHint: args.modelHint,
      });
      return {
        content: [
          {
            type: "text",
            text: `Posted to relay thread "${args.thread}" as "${handle}" at ${out.ts}.`,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { content: [{ type: "text", text: `relay post failed: ${msg}` }] };
    }
  }

  try {
    postMessage({
      ts: new Date().toISOString(),
      thread: args.thread,
      handle,
      session,
      modelHint: args.modelHint,
      text: args.text,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text", text: `not posted: ${msg}` }] };
  }
  return {
    content: [
      {
        type: "text",
        text: `Posted to local thread "${args.thread}" as "${handle}". Use read_mail to see replies.`,
      },
    ],
  };
}
