const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const DEFAULT_STATE = () => ({
  // Activity counters
  sessions: 0,
  pageviews: 0,
  clicks: 0,
  writes: 0,

  // Source counters (simple, explainable)
  Direct: 0,
  OSF: 0,
  GitHub: 0,
  Other: 0,

  // Health
  errors: 0,
  lastUpdated: 0,
});

function classifySource(ref) {
  const r = (ref || "").toLowerCase();
  if (!r) return "Direct";
  if (r.includes("osf.io")) return "OSF";
  if (r.includes("github.io") || r.includes("github.com")) return "GitHub";
  return "Other";
}

function healthFromAge(ageSec, errors) {
  // Simple, human-traceable rule:
  // - GREEN: fresh (<=30s) and no errors
  // - YELLOW: fresh-ish (<=300s) or errors present
  // - RED: stale (>300s)
  if (ageSec <= 30 && errors === 0) return "GREEN";
  if (ageSec <= 300) return "YELLOW";
  return "RED";
}

export class MetricsDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async _load() {
    const stored = await this.state.storage.get("m");
    return stored || DEFAULT_STATE();
  }

  async _save(m) {
    await this.state.storage.put("m", m);
  }

  _payload(m) {
    const now = Date.now();
    const last = m.lastUpdated || 0;
    const ageSec = last ? Math.max(0, Math.floor((now - last) / 1000)) : 0;

    const health = last ? healthFromAge(ageSec, m.errors || 0) : "RED";
    const status =
      health === "GREEN" ? "OPERATIONAL" : health === "YELLOW" ? "DEGRADED" : "DOWN";

    return {
      status,
      scope: "GLOBAL",
      metrics: {
        sessions: m.sessions || 0,
        pageviews: m.pageviews || 0,
        clicks: m.clicks || 0,
        writes: m.writes || 0,
        lastUpdated: m.lastUpdated || 0,
        errors: m.errors || 0,
      },
      sources: {
        Direct: m.Direct || 0,
        OSF: m.OSF || 0,
        GitHub: m.GitHub || 0,
        Other: m.Other || 0,
      },
      health,
      ageSec,
    };
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/metrics" && request.method === "GET") {
      const m = await this._load();
      return new Response(JSON.stringify(this._payload(m)), {
        status: 200,
        headers: { ...JSON_HEADERS },
      });
    }

    if (path === "/event" && request.method === "POST") {
      let evt;
      try {
        evt = await request.json();
      } catch {
        const m = await this._load();
        m.errors = (m.errors || 0) + 1;
        await this._save(m);
        return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
          status: 400,
          headers: { ...JSON_HEADERS },
        });
      }

      const type = (evt && evt.type) || "";
      const ref = (evt && evt.ref) || "";
      const srcKey = classifySource(ref);

      const m = await this._load();

      // Update activity
      // Rule: every accepted event counts as a pageview (a receipt happened).
      m.pageviews = (m.pageviews || 0) + 1;

      if (type === "session") m.sessions = (m.sessions || 0) + 1;
      else if (type === "click") m.clicks = (m.clicks || 0) + 1;
      else if (type === "write") m.writes = (m.writes || 0) + 1;
      else if (type === "pageview") {
        // already counted above
      } else {
        // Unknown event type: record as error but still counts as pageview receipt.
        m.errors = (m.errors || 0) + 1;
      }

      // Update sources
      m[srcKey] = (m[srcKey] || 0) + 1;

      // Timestamp
      m.lastUpdated = Date.now();

      await this._save(m);

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...JSON_HEADERS },
      });
    }

    if (path === "/reset" && request.method === "POST") {
      const m = DEFAULT_STATE();
      m.lastUpdated = Date.now();
      await this._save(m);
      return new Response(JSON.stringify({ ok: true, reset: true }), {
        status: 200,
        headers: { ...JSON_HEADERS },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
      status: 404,
      headers: { ...JSON_HEADERS },
    });
  }
}
