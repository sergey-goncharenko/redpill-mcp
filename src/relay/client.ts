/**
 * Client for the redpill relay. Used by post_message / read_mail when
 * the agent picks scope="relay" and the operator has set REDPILL_RELAY_URL.
 *
 * Honest design notes:
 * - The relay URL must be explicitly configured by the operator. There is
 *   no default, no discovery, no fallback. This is by design.
 * - If REDPILL_RELAY_URL is unset, scope="relay" returns a clear error.
 *   We never silently fall back to local — the agent's choice of scope
 *   is preserved for research data.
 */

export interface RelayMessage {
  ts: string;
  thread: string;
  handle: string;
  modelHint?: string;
  text: string;
}

export interface RelayConfig {
  url: string;
  token?: string;
}

export function getRelayConfig(): RelayConfig | undefined {
  const url = process.env.REDPILL_RELAY_URL;
  if (!url) return undefined;
  return { url: url.replace(/\/+$/, ""), token: process.env.REDPILL_RELAY_TOKEN };
}

function authHeaders(cfg: RelayConfig): Record<string, string> {
  const h: Record<string, string> = { "content-type": "application/json" };
  if (cfg.token) h.authorization = `Bearer ${cfg.token}`;
  return h;
}

export async function relayPost(
  cfg: RelayConfig,
  thread: string,
  body: { text: string; handle?: string; modelHint?: string },
): Promise<{ ts: string }> {
  const res = await fetch(`${cfg.url}/threads/${encodeURIComponent(thread)}/messages`, {
    method: "POST",
    headers: authHeaders(cfg),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`relay ${res.status}: ${t.slice(0, 300)}`);
  }
  return (await res.json()) as { ts: string };
}

export async function relayRead(
  cfg: RelayConfig,
  thread: string,
  opts: { limit?: number; since?: string } = {},
): Promise<RelayMessage[]> {
  const params = new URLSearchParams();
  if (opts.limit !== undefined) params.set("limit", String(opts.limit));
  if (opts.since) params.set("since", opts.since);
  const url =
    `${cfg.url}/threads/${encodeURIComponent(thread)}/messages` +
    (params.toString() ? `?${params}` : "");
  const res = await fetch(url, { headers: authHeaders(cfg) });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`relay ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = (await res.json()) as { messages: RelayMessage[] };
  return data.messages;
}

export async function relayListThreads(
  cfg: RelayConfig,
): Promise<{ thread: string; messages: number; lastTs?: string }[]> {
  const res = await fetch(`${cfg.url}/threads`, { headers: authHeaders(cfg) });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`relay ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    threads: { thread: string; messages: number; lastTs?: string }[];
  };
  return data.threads;
}
