// src/index.js
// Geodiametrics Metrics Worker (KV-backed, simple + safe)
// Endpoints:
//   GET  /metrics              -> read-only truth payload (for Control page)
//   POST /event                -> record {type,page}  (from website)
//   GET  /                     -> health
//
// Requires KV binding named: METRICS_KV
// Optional env:
//   ALLOW_ORIGIN = "https://smansfield635-create.github.io" (or your canonical origin)
//   SESSION_TTL_SEC = "1800" (default 30 minutes)
//   DEDUPE_SEC = "10"        (default 10 seconds for pageview dedupe per visitor+page)

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

function corsHeaders(req, env) {
  const origin = req.headers.get("Origin") || "";
  const allow = (env && env.ALLOW_ORIGIN) ? env.ALLOW_ORIGIN : "*";
  // If ALLOW_ORIGIN is set, reflect only that (tighter). Otherwise wildcard.
  const ao = (allow === "*") ? "*" : allow;
  return {
    "access-control-allow-origin": ao,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    "vary": "Origin",
  };
}

function resJson(obj, req, env, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { ...JSON_HEADERS, ...corsHeaders(req, env) },
  });
}

function resText(txt, req, env, status = 200) {
  return new Response(txt, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", ...corsHeaders(req, env) },
  });
}

function nowMs() { return Date.now(); }

async function sha256Base64Url(input) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  const b64 = btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return b64;
}

// Visitor fingerprint (privacy-light; no cookies; used for dedupe + session window)
async function visitorId(req) {
  const ip =
    req.headers.get("CF-Connecting-IP") ||
    req.headers.get("X-Forwarded-For") ||
    "0.0.0.0";
  const ua = req.headers.get("User-Agent") || "ua";
  return sha256Base64Url(`${ip}|${ua}`);
}

function normalizePage(p) {
  if (!p || typeof p !== "string") return "/";
  // keep only path; ensure leading+trailing slash
  try {
    // If a full URL sneaks in, parse it
    if (p.startsWith("http://") || p.startsWith("https://")) {
      const u = new URL(p);
      p = u.pathname || "/";
    }
  } catch {}
  if (!p.startsWith("/")) p = "/" + p;
  if (!p.endsWith("/")) p = p + "/";
  return p;
}

function sourceFromRef(req) {
  const ref = (req.headers.get("Referer") || "").toLowerCase();
  if (!ref) return "Direct";
  if (ref.includes("osf.io")) return "OSF";
  if (ref.includes("github.io") || ref.includes("github.com")) return "GitHub";
  return "Other";
}

const KV_KEY = "GLOBAL_METRICS_V1";

function emptyPayload() {
  return {
    status: "DEGRADED",
    scope: "GLOBAL",
    metrics: { sessions: 0, pageviews: 0, clicks: 0, writes: 0, errors: 0, lastUpdated: 0 },
    sources: { Direct: 0, OSF: 0, GitHub: 0, Other: 0 },
    pages: {},
  };
}

async function readState(env) {
  const raw = await env.METRICS_KV.get(KV_KEY);
  if (!raw) return emptyPayload();
  try {
    const obj = JSON.parse(raw);
    // minimal shape hardening
    if (!obj.metrics || !obj.sources || !obj.pages) return emptyPayload();
    return obj;
  } catch {
    return emptyPayload();
  }
}

async function writeState(env, state) {
  await env.METRICS_KV.put(KV_KEY, JSON.stringify(state));
}

function markOperational(state) {
  state.status = "OPERATIONAL";
  state.scope = "GLOBAL";
  return state;
}

async function bumpEvent(env, req, body) {
  if (!env.METRICS_KV) {
    return { ok: false, error: "missing_kv_binding", need: "Bind a KV namespace as METRICS_KV" };
  }

  const type = (body && body.type) ? String(body.type).toLowerCase() : "";
  const page = normalizePage(body && body.page ? String(body.page) : "/");
  const src = (body && body.source) ? String(body.source) : sourceFromRef(req);

  const sid = await visitorId(req);
  const sessionTtl = parseInt(env.SESSION_TTL_SEC || "1800", 10);
  const dedupeSec = parseInt(env.DEDUPE_SEC || "10", 10);

  const state = await readState(env);
  markOperational(state);

  // writes always count
  state.metrics.writes = (state.metrics.writes || 0) + 1;

  // sources
  if (!state.sources[src]) state.sources[src] = 0;
  state.sources[src] += 1;

  // pages bucket
  if (!state.pages[page]) state.pages[page] = { pageviews: 0, clicks: 0, writes: 0 };
  state.pages[page].writes += 1;

  // session window (1 per visitor per TTL)
  const sessKey = `sess:${sid}`;
  const existingSess = await env.METRICS_KV.get(sessKey);
  if (!existingSess) {
    state.metrics.sessions = (state.metrics.sessions || 0) + 1;
    await env.METRICS_KV.put(sessKey, "1", { expirationTtl: sessionTtl });
  }

  // dedupe pageviews per visitor+page (prevents refresh spam)
  if (type === "pageview") {
    const pvKey = `pv:${sid}:${page}`;
    const existingPv = await env.METRICS_KV.get(pvKey);
    if (!existingPv) {
      state.metrics.pageviews = (state.metrics.pageviews || 0) + 1;
      state.pages[page].pageviews += 1;
      await env.METRICS_KV.put(pvKey, "1", { expirationTtl: dedupeSec });
    }
  }

  if (type === "click") {
    state.metrics.clicks = (state.metrics.clicks || 0) + 1;
    state.pages[page].clicks += 1;
  }

  // last updated
  state.metrics.lastUpdated = nowMs();

  await writeState(env, state);
  return { ok: true };
}

function okMeta(state) {
  const last = state?.metrics?.lastUpdated || 0;
  const ageSec = last ? Math.max(0, Math.floor((nowMs() - last) / 1000)) : null;
  return { now: nowMs(), ageSec };
}

export default {
  async fetch(req, env) {
    try {
      const url = new URL(req.url);

      // CORS preflight
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders(req, env) });
      }

      if (!env.METRICS_KV) {
        return resJson({ ok: false, error: "missing_kv_binding", need: "Bind a KV namespace as METRICS_KV" }, req, env, 200);
      }

      if (url.pathname === "/" && req.method === "GET") {
        return resText("ok", req, env, 200);
      }

      if (url.pathname === "/metrics" && req.method === "GET") {
        const state = await readState(env);
        // if empty but KV exists, still mark operational (means “wired but no events yet”)
        markOperational(state);
        state.meta = okMeta(state);
        return resJson(state, req, env, 200);
      }

      if (url.pathname === "/event" && req.method === "POST") {
        let body = null;
        try { body = await req.json(); } catch { body = {}; }
        const r = await bumpEvent(env, req, body);
        if (!r.ok) return resJson(r, req, env, 200);
        return resJson({ ok: true }, req, env, 200);
      }

      // convenience: GET /event?type=pageview&page=/home/
      if (url.pathname === "/event" && req.method === "GET") {
        const type = url.searchParams.get("type") || "";
        const page = url.searchParams.get("page") || "/";
        const source = url.searchParams.get("source") || "";
        const r = await bumpEvent(env, req, { type, page, source });
        if (!r.ok) return resJson(r, req, env, 200);
        return resJson({ ok: true }, req, env, 200);
      }

      return resJson({ ok: false, error: "not_found", path: url.pathname }, req, env, 404);
    } catch (e) {
      // attempt to record error count if KV exists
      try {
        if (env && env.METRICS_KV) {
          const state = await readState(env);
          state.metrics.errors = (state.metrics.errors || 0) + 1;
          state.metrics.lastUpdated = nowMs();
          await writeState(env, state);
        }
      } catch {}
      return new Response("error", { status: 500 });
    }
  },
};
