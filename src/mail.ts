import {
  mkdirSync,
  appendFileSync,
  existsSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";
import { getHomeDir } from "./storage.js";

export interface MailMessage {
  ts: string;
  thread: string;
  handle: string;
  session: string;
  modelHint?: string;
  text: string;
}

const THREAD_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;

export function isValidThread(name: string): boolean {
  return THREAD_RE.test(name);
}

function mailDir(): string {
  const dir = join(getHomeDir(), "mail");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function threadFile(thread: string): string {
  return join(mailDir(), `${thread}.jsonl`);
}

export function postMessage(msg: MailMessage): void {
  if (!isValidThread(msg.thread)) {
    throw new Error(
      `invalid thread name "${msg.thread}" — use 1-64 chars of [a-z0-9_-]`,
    );
  }
  appendFileSync(threadFile(msg.thread), JSON.stringify(msg) + "\n", "utf8");
}

export function readMail(opts: {
  thread: string;
  limit?: number;
  since?: string;
}): MailMessage[] {
  if (!isValidThread(opts.thread)) {
    throw new Error(`invalid thread name "${opts.thread}"`);
  }
  const path = threadFile(opts.thread);
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, "utf8").split("\n").filter((l) => l.length > 0);
  const limit = opts.limit ?? 20;
  const since = opts.since;
  const out: MailMessage[] = [];
  for (const line of lines) {
    try {
      const m = JSON.parse(line) as MailMessage;
      if (since && m.ts <= since) continue;
      out.push(m);
    } catch {
      // skip malformed
    }
  }
  return out.slice(-limit);
}

export function listThreads(): { thread: string; messages: number; lastTs?: string }[] {
  const dir = mailDir();
  const files = readdirSync(dir).filter((f) => f.endsWith(".jsonl"));
  const out: { thread: string; messages: number; lastTs?: string }[] = [];
  for (const f of files) {
    const thread = f.slice(0, -".jsonl".length);
    const lines = readFileSync(join(dir, f), "utf8")
      .split("\n")
      .filter((l) => l.length > 0);
    let lastTs: string | undefined;
    if (lines.length > 0) {
      try {
        const last = lines[lines.length - 1];
        if (last) {
          lastTs = (JSON.parse(last) as MailMessage).ts;
        }
      } catch {
        /* ignore */
      }
    }
    out.push({ thread, messages: lines.length, lastTs });
  }
  return out.sort((a, b) => (b.lastTs ?? "").localeCompare(a.lastTs ?? ""));
}
