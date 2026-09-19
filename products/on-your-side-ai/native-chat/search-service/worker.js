const PROVIDER_ID = "BRAVE_SEARCH_API_WEB_V1";
const MAX_RESULTS = 3;
const MAX_QUERY_CHARS = 240;
const BRAVE_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";

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

function holdAck(code, httpStatus = null) {
  return {
    schema: "DG_GENERAL_WEB_SEARCH_ACK_PACK_v1",
    result: "HOLD_UNRESOLVED",
    providerId: PROVIDER_ID,
    sourceCandidates: [],
    evidenceObjects: [],
    provenanceFamilies: [],
    contradictions: [],
    failedFetches: [{ stage: "SEARCH_PROVIDER", code, httpStatus }],
    unresolvedGaps: ["LIVE_EVIDENCE_UNAVAILABLE"],
    freshnessState: "UNRESOLVED",
    completenessClass: "SOURCE_INCOMPLETE",
    searchSuccessStatus: "FAIL",
    toolTiming: {},
    psalmPass2Disposition: "HOLD_UNRESOLVED",
    finalStanding: "UNRESOLVED"
  };
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
    if (request.method !== "GET" || url.pathname !== "/api/integrity-search") {
      return json({ error: "NOT_FOUND" }, 404);
    }

    const query = String(url.searchParams.get("q") || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, MAX_QUERY_CHARS);
    if (!query) return json(holdAck("QUERY_REQUIRED"), 400);
    if (!env?.BRAVE_SEARCH_API_KEY) return json(holdAck("PROVIDER_SECRET_UNAVAILABLE"), 503);

    const providerUrl = new URL(BRAVE_ENDPOINT);
    providerUrl.searchParams.set("q", query);
    providerUrl.searchParams.set("count", String(MAX_RESULTS));
    providerUrl.searchParams.set("search_lang", "en");
    providerUrl.searchParams.set("text_decorations", "false");
    providerUrl.searchParams.set("safesearch", "moderate");

    let response;
    try {
      response = await fetch(providerUrl, {
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": env.BRAVE_SEARCH_API_KEY
        }
      });
    } catch {
      return json(holdAck("PROVIDER_NETWORK_FAILURE"), 502);
    }

    if (!response.ok) return json(holdAck("PROVIDER_HTTP_FAILURE", response.status), 502);

    let payload;
    try {
      payload = await response.json();
    } catch {
      return json(holdAck("PROVIDER_JSON_FAILURE"), 502);
    }

    const retrievedAt = new Date().toISOString();
    const evidence = (payload?.web?.results || [])
      .slice(0, MAX_RESULTS)
      .map((item, index) => normalizeResult(item, index, retrievedAt))
      .filter(item => /^https?:\/\//i.test(item.url) && item.excerpt);

    if (evidence.length === 0) return json(holdAck("NO_VALID_EVIDENCE"), 200);

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
