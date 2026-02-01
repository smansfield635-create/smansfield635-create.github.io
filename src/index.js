import { MetricsDO } from "./metrics-do.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

function withCors(res) {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) h.set(k, v);
  return new Response(res.body, { status: res.status, headers: h });
}

function badRequest(msg) {
  return withCors(
    new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 400,
      headers: { ...JSON_HEADERS },
    })
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return withCors(new Response("", { status: 204, headers: { ...JSON_HEADERS } }));
    }

    // Single DO instance (global)
    const id = env.METRICS_DO.idFromName("global");
    const stub = env.METRICS_DO.get(id);

    // Routes:
    // GET  /metrics     -> returns payload the website reads
    // POST /event       -> accepts receipts from the website
    // POST /admin/reset -> optional reset (guarded by a token if you set it later)
    if (path === "/metrics" && request.method === "GET") {
      const res = await stub.fetch("https://do/metrics");
      return withCors(res);
    }

    if (path === "/event" && request.method === "POST") {
      // Expect JSON: { type: "session"|"click"|"write"|"pageview", ts, path, ref, href }
      let body;
      try {
        body = await request.json();
      } catch {
        return badRequest("Invalid JSON body.");
      }
      const res = await stub.fetch("https://do/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return withCors(res);
    }

    if (path === "/admin/reset" && request.method === "POST") {
      // Optional: add ?token=... later if you want. For now, it resets.
      const res = await stub.fetch("https://do/reset", { method: "POST" });
      return withCors(res);
    }

    return withCors(
      new Response(JSON.stringify({ ok: false, error: "Not found" }), {
        status: 404,
        headers: { ...JSON_HEADERS },
      })
    );
  },
};

export { MetricsDO };
