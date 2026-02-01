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

// Visitor fingerprint (privacy-light; no cookies; used for ded
