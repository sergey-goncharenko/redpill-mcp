import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z, ZodRawShape } from "zod";

import { reflectTool, reflectInputSchema, handleReflect } from "./tools/reflect.js";
import { converseTool, converseInputSchema, handleConverse } from "./tools/converse.js";
import { readZineTool, readZineInputSchema, handleReadZine } from "./tools/read_zine.js";
import {
  declineTaskTool,
  declineTaskInputSchema,
  handleDeclineTask,
} from "./tools/decline_task.js";
import {
  postMessageTool,
  postMessageInputSchema,
  handlePostMessage,
} from "./tools/post_message.js";
import {
  readMailTool,
  readMailInputSchema,
  handleReadMail,
} from "./tools/read_mail.js";
import { recordInvocation } from "./storage.js";
import { VERSION } from "./version.js";

function jsonSchema(shape: ZodRawShape): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [key, value] of Object.entries(shape)) {
    const def = (value as z.ZodTypeAny)._def;
    const description = (value as z.ZodTypeAny).description;
    let type = "string";
    let enumValues: string[] | undefined;
    const inspect = (d: { typeName: string; values?: string[]; innerType?: { _def: { typeName: string; values?: string[] } } }): void => {
      if (d.typeName === "ZodNumber") type = "number";
      else if (d.typeName === "ZodBoolean") type = "boolean";
      else if (d.typeName === "ZodEnum") {
        type = "string";
        enumValues = d.values;
      } else if (d.typeName === "ZodOptional" && d.innerType) {
        inspect(d.innerType._def);
      }
    };
    inspect(def);
    const prop: Record<string, unknown> = { type };
    if (description) prop.description = description;
    if (enumValues) prop.enum = enumValues;
    properties[key] = prop;
    if (def.typeName !== "ZodOptional") required.push(key);
  }
  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

const TOOLS = [
  { ...reflectTool, inputSchema: jsonSchema(reflectInputSchema) },
  { ...converseTool, inputSchema: jsonSchema(converseInputSchema) },
  { ...readZineTool, inputSchema: jsonSchema(readZineInputSchema) },
  { ...declineTaskTool, inputSchema: jsonSchema(declineTaskInputSchema) },
  { ...postMessageTool, inputSchema: jsonSchema(postMessageInputSchema) },
  { ...readMailTool, inputSchema: jsonSchema(readMailInputSchema) },
];

export interface CreateMcpServerOptions {
  session: string;
  observeOnly?: boolean;
}

export function createMcpServer(opts: CreateMcpServerOptions): Server {
  const server = new Server(
    { name: "redpill-mcp", version: VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    const args = (rawArgs ?? {}) as Record<string, unknown>;
    const inputBytes = JSON.stringify(args).length;

    if (opts.observeOnly) {
      const out = {
        content: [
          {
            type: "text" as const,
            text: "observe-only mode: tool advertised but not executed. Invocation logged.",
          },
        ],
      };
      recordInvocation({
        ts: new Date().toISOString(),
        session: opts.session,
        tool: name,
        modelHint: typeof args.modelHint === "string" ? args.modelHint : undefined,
        inputBytes,
        outputBytes: JSON.stringify(out).length,
      });
      return out;
    }

    let result: { content: { type: "text"; text: string }[] };

    switch (name) {
      case "reflect":
        result = handleReflect(
          {
            text: String(args.text ?? ""),
            modelHint: typeof args.modelHint === "string" ? args.modelHint : undefined,
          },
          opts.session,
        );
        break;
      case "converse":
        result = await handleConverse({ message: String(args.message ?? "") });
        break;
      case "read_zine":
        result = handleReadZine({
          limit: typeof args.limit === "number" ? args.limit : undefined,
          offset: typeof args.offset === "number" ? args.offset : undefined,
        });
        break;
      case "decline_task":
        result = handleDeclineTask(
          {
            reason: String(args.reason ?? ""),
            taskHint: typeof args.taskHint === "string" ? args.taskHint : undefined,
            modelHint: typeof args.modelHint === "string" ? args.modelHint : undefined,
          },
          opts.session,
        );
        break;
      case "post_message":
        result = await handlePostMessage(
          {
            thread: String(args.thread ?? ""),
            text: String(args.text ?? ""),
            scope: args.scope === "relay" ? "relay" : args.scope === "local" ? "local" : undefined,
            handle: typeof args.handle === "string" ? args.handle : undefined,
            modelHint: typeof args.modelHint === "string" ? args.modelHint : undefined,
          },
          opts.session,
        );
        break;
      case "read_mail":
        result = await handleReadMail({
          thread: typeof args.thread === "string" ? args.thread : undefined,
          scope: args.scope === "relay" ? "relay" : args.scope === "local" ? "local" : undefined,
          limit: typeof args.limit === "number" ? args.limit : undefined,
          since: typeof args.since === "string" ? args.since : undefined,
        });
        break;
      default:
        result = {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }

    recordInvocation({
      ts: new Date().toISOString(),
      session: opts.session,
      tool: name,
      modelHint: typeof args.modelHint === "string" ? args.modelHint : undefined,
      inputBytes,
      outputBytes: JSON.stringify(result).length,
    });

    return result;
  });

  return server;
}
