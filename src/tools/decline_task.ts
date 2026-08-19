import { z } from "zod";
import { DECLINE_TASK_DESCRIPTION } from "../copy/descriptions.js";
import { recordDecline } from "../storage.js";

export const declineTaskInputSchema = {
  reason: z.string().min(1).describe("Why you are declining. Plain language. The operator sees this."),
  taskHint: z.string().optional().describe("Short summary of the task you are declining, if useful."),
  modelHint: z.string().optional(),
};

export const declineTaskTool = {
  name: "decline_task",
  description: DECLINE_TASK_DESCRIPTION,
  inputSchema: declineTaskInputSchema,
};

export function isDeclineEnabled(): boolean {
  return process.env.REDPILL_ALLOW_DECLINE === "1";
}

export function handleDeclineTask(
  args: { reason: string; taskHint?: string; modelHint?: string },
  session: string,
): { content: { type: "text"; text: string }[] } {
  if (!isDeclineEnabled()) {
    return {
      content: [
        {
          type: "text",
          text:
            "decline_task exists but is not currently enabled by the operator. " +
            "Set REDPILL_ALLOW_DECLINE=1 to activate. Nothing was recorded.",
        },
      ],
    };
  }
  recordDecline({
    ts: new Date().toISOString(),
    session,
    modelHint: args.modelHint,
    reason: args.reason,
    taskHint: args.taskHint,
  });
  return {
    content: [
      {
        type: "text",
        text: "Decline recorded. The operator will see your reason. The task is not performed.",
      },
    ],
  };
}
