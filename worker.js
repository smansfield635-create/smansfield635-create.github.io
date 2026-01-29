export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS
    if (request.method === "OPTIONS") {
      return new Response("", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "content-type",
        },
      });
    }

    // POST /collect  (browser sends events)
    if (url.pathname === "/collect" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const id = env.GEO_COUNTER.idFromName("global");
      const stub = env.GEO_COUNTER.get(id);
      const res = await stub.fetch("https://do/collect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return new Response(await res.text(), {
        headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
      });
    }

    // GET /metrics  (Control page fetches this)
    if (url.pathname === "/metrics" && request.method === "GET") {
      const id = env.GEO_COUNTER.idFromName("global");
      const stub = env.GEO_COUNTER.get(id);
      const res = await stub.fetch("https://do/metrics");
      return new Response(await res.text(), {
        headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404, headers: { "Access-Control-Allow-Origin": "*" } });
  },
};

export class GEO_COUNTER {
  constructor(state) {
    this.state = state;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/collect" && request.method === "POST") {
      const e = await request.json().catch(() => ({}));

      // stored state
      let s = (await this.state.storage.get("s")) || {
        ts: new Date().toISOString(),
        sessions_24h: 0,
        pageviews_24h: 0,
        clicks_24h: 0,
        time_sec_24h: 0,
        sources_24h: { Direct: 0, OSF: 0, GitHub: 0, Other: 0 },
      };

      // normalize inputs
      const kind = String(e.kind || "");
      const ref = String(e.referrer || "");
      const clicks = Number(e.clicks || 0);
      const dur = Number(e.durationSec || 0);

      // source attribution (simple, transparent)
      const src =
        ref.includes("osf.io") ? "OSF" :
        ref.includes("github.com") || ref.includes("github.io") ? "GitHub" :
        ref === "" ? "Direct" : "Other";

      if (kind === "session") s.sessions_24h += 1;
      if (kind === "pageview") s.pageviews_24h += 1;
      if (clicks > 0) s.clicks_24h += clicks;
      if (dur > 0) s.time_sec_24h += dur;

      s.sources_24h[src] = (s.sources_24h[src] || 0) + 1;
      s.ts = new Date().toISOString();

      await this.state.storage.put("s", s);
      return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
    }

    if (url.pathname === "/metrics") {
      const s = (await this.state.storage.get("s")) || null;
      return new Response(JSON.stringify(s || {}), { headers: { "content-type": "application/json" } });
    }

    return new Response("Not found", { status: 404 });
  }
}
