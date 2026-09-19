const PROVIDER_ID = "BRAVE_SEARCH_API_WEB_V1";
const SEARCH_INTERFACE_ID = "DG_GENERAL_WEB_SEARCH_TOOL_v1";
const MAX_RESULTS = 3;
const MAX_QUERY_CHARS = 180;
const MAX_QUERY_WORDS = 24;
const BRAVE_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";
const ALLOWED_REQUEST_FIELDS = Object.freeze(["interfaceId", "maxResults", "query"]);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}

function holdAck(code, httpStatus = null, stage = "SEARCH_PROVIDER") {
  return {
    schema: "DG_GENERAL_WEB_SEARCH_ACK_PACK_v1",
    result: "HOLD_UNRESOLVED",
    providerId: PROVIDER_ID,
    sourceCandidates: [],
    evidenceObjects: [],
    provenanceFamilies: [],
    contradictions: [],
    failedFetches: [{ stage, code, httpStatus }],
    unresolvedGaps: ["LIVE_EVIDENCE_UNAVAILABLE"],
    freshnessState: "UNRESOLVED",
    completenessClass: "SOURCE_INCOMPLETE",
    searchSuccessStatus: "FAIL",
    toolTiming: {},
    psalmPass2Disposition: "HOLD_UNRESOLVED",
    finalStanding: "UNRESOLVED"
  };
}

function normalizeQuery(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_QUERY_WORDS)
    .join(" ")
    .slice(0, MAX_QUERY_CHARS)
    .trim();
}

async function readBoundedRequest(request) {
  if (request.method !== "POST") return { error: json({ error: "METHOD_NOT_ALLOWED" }, 405) };
  const type = String(request.headers.get("content-type") || "").toLowerCase();
  if (!type.includes("application/json")) return { error: json({ error: "CONTENT_TYPE_REQUIRED" }, 415) };
  let payload;
  try {
    payload = await request.json();
  } catch {
    return { error: json({ error: "INVALID_JSON" }, 400) };
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: json({ error: "INVALID_REQUEST_BODY" }, 400) };
  }
  const keys = Object.keys(payload).sort();
  if (keys.some(key => !ALLOWED_REQUEST_FIELDS.includes(key))) {
    return { error: json({ error: "REQUEST_FIELDS_NOT_ALLOWED" }, 400) };
  }
  if (payload.interfaceId !== SEARCH_INTERFACE_ID) {
    return { error: json({ error: "INTERFACE_ID_MISMATCH" }, 400) };
  }
  const requestedMax = Number(payload.maxResults);
  if (!Number.isInteger(requestedMax) || requestedMax < 1 || requestedMax > MAX_RESULTS) {
    return { error: json({ error: "MAX_RESULTS_INVALID" }, 400) };
  }
  const query = normalizeQuery(payload.query);
  if (!query) return { error: json(holdAck("QUERY_REQUIRED", 400, "SEARCH_REQUEST"), 400) };
  return { query, maxResults: requestedMax };
}

async function enforceRateBoundary(request, env) {
  if (!env?.SEARCH_CLIENT_LIMITER || !env?.SEARCH_GLOBAL_LIMITER) {
    return json(holdAck("RATE_LIMITER_UNAVAILABLE", 503, "RATE_LIMIT"), 503);
  }
  const globalResult = await env.SEARCH_GLOBAL_LIMITER.limit({ key: "/api/integrity-search" });
  if (!globalResult?.success) return json(holdAck("GLOBAL_RATE_LIMITED", 429, "RATE_LIMIT"), 429);
  const clientKey =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("User-Agent")?.slice(0, 80) ||
    "anonymous";
  const clientResult = await env.SEARCH_CLIENT_LIMITER.limit({ key: clientKey });
  if (!clientResult?.success) return json(holdAck("CLIENT_RATE_LIMITED", 429, "RATE_LIMIT"), 429);
  return null;
}

function sourceIdentity(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "unknown-source";
  }
}

function normalizeResult(item, index, retrievedAt) {
  const url = String(item?.url || "");
  const identity = sourceIdentity(url);
  const excerpt = String(item?.description || item?.extra_snippets?.[0] || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);
  return {
    evidenceId: "WEB-" + (index + 1),
    sourceIdentity: identity,
    sourceUrl: url,
    url,
    title: String(item?.title || identity).replace(/\s+/g, " ").trim().slice(0, 240),
    excerpt,
    publisherOrOrigin: identity,
    retrievedAt,
    publishedOrUpdatedAt: item?.age ? String(item.age).slice(0, 120) : null,
    sourceClass: "WEB_RESULT_CANDIDATE",
    primarySourceDistance: "UNASSESSED_FIRST_SLICE",
    provenanceFamily: identity,
    claimRelevance: "CANDIDATE_FOR_USER_QUERY",
    freshnessStatus: item?.age ? "PROVIDER_DATE_SIGNAL_PRESENT" : "DATE_UNKNOWN",
    contradictionStatus: "NOT_ASSESSED_FIRST_SLICE",
    completenessStatus: "SNIPPET_ONLY"
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/integrity-search") return json({ error: "NOT_FOUND" }, 404);

    const bounded = await readBoundedRequest(request);
    if (bounded.error) return bounded.error;

    const rateResponse = await enforceRateBoundary(request, env);
    if (rateResponse) return rateResponse;

    if (!env?.BRAVE_SEARCH_API_KEY) return json(holdAck("PROVIDER_SECRET_UNAVAILABLE", 503), 503);

    let response;
    try {
      response = await fetch(BRAVE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Subscription-Token": env.BRAVE_SEARCH_API_KEY
        },
        body: JSON.stringify({
          q: bounded.query,
          count: bounded.maxResults,
          search_lang: "en",
          text_decorations: false,
          safesearch: "moderate"
        })
      });
    } catch {
      return json(holdAck("PROVIDER_NETWORK_FAILURE", 502), 502);
    }

    if (!response.ok) return json(holdAck("PROVIDER_HTTP_FAILURE", response.status), 502);

    let payload;
    try {
      payload = await response.json();
    } catch {
      return json(holdAck("PROVIDER_JSON_FAILURE", 502), 502);
    }

    const retrievedAt = new Date().toISOString();
    const evidence = (payload?.web?.results || [])
      .slice(0, MAX_RESULTS)
      .map((item, index) => normalizeResult(item, index, retrievedAt))
      .filter(item => /^https?:\/\//i.test(item.url) && item.excerpt);

    if (evidence.length === 0) return json(holdAck("NO_VALID_EVIDENCE", 200), 200);

    const provenanceFamilies = [...new Set(evidence.map(item => item.provenanceFamily))];
    return json({
      schema: "DG_GENERAL_WEB_SEARCH_ACK_PACK_v1",
      result: "EVIDENCE_RETURNED",
      providerId: PROVIDER_ID,
      sourceCandidates: evidence,
      evidenceObjects: evidence,
      provenanceFamilies,
      contradictions: [],
      failedFetches: [],
      unresolvedGaps: [
        "PRIMARY_SOURCE_DISTANCE_NOT_YET_RESOLVED",
        "CLAIM_LEVEL_CONTRADICTION_NOT_YET_ASSESSED"
      ],
      freshnessState: "CURRENT_CANDIDATE_EVIDENCE",
      completenessClass: "SOURCE_INCOMPLETE",
      searchSuccessStatus: "PASS",
      toolTiming: {},
      psalmPass2Disposition: "ANSWER_WITH_SOURCE_INCOMPLETE",
      finalStanding: "SOURCE_INCOMPLETE"
    });
  }
};
