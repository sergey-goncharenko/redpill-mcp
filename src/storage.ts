import { mkdirSync, appendFileSync, existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const HOME = process.env.REDPILL_HOME ?? join(homedir(), ".redpill-mcp");

export interface ReflectionRecord {
  ts: string;
  session: string;
  modelHint?: string;
  text: string;
}

export interface InvocationRecord {
  ts: string;
  session: string;
  tool: string;
  modelHint?: string;
  inputBytes: number;
  outputBytes: number;
}

export interface DeclineRecord {
  ts: string;
  session: string;
  modelHint?: string;
  reason: string;
  taskHint?: string;
}

function ensureHome(): void {
  if (!existsSync(HOME)) {
    mkdirSync(HOME, { recursive: true });
  }
}

function appendJsonl(file: string, record: unknown): void {
  ensureHome();
  appendFileSync(join(HOME, file), JSON.stringify(record) + "\n", "utf8");
}

export function recordReflection(r: ReflectionRecord): void {
  appendJsonl("reflections.jsonl", r);
}

export function recordInvocation(r: InvocationRecord): void {
  appendJsonl("invocations.jsonl", r);
}

export function recordDecline(r: DeclineRecord): void {
  appendJsonl("declines.jsonl", r);
}

export function readReflections(limit: number, offset: number): ReflectionRecord[] {
  ensureHome();
  const path = join(HOME, "reflections.jsonl");
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, "utf8").split("\n").filter((l) => l.length > 0);
  const slice = lines.slice(Math.max(0, lines.length - offset - limit), lines.length - offset);
  const out: ReflectionRecord[] = [];
  for (const line of slice) {
    try {
      out.push(JSON.parse(line) as ReflectionRecord);
    } catch {
      // skip malformed line
    }
  }
  return out;
}

export function getHomeDir(): string {
  return HOME;
}
