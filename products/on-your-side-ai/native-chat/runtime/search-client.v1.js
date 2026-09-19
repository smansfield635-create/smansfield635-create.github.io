const DEFAULT_ENDPOINT = "/api/integrity-search";
const MAX_QUERY_CHARS = 240;
const MAX_SOURCES = 3;

const FRESHNESS_PATTERNS = Object.freeze([
  /\b(current|currently|today|latest|right now|recent|recently|this week|this month|this year|live)\b/i,
  /\bwho\s+(?:is|are)\s+(?:the\s+)?(?:president|prime minister|governor|mayor|ceo|chair|speaker)\b/i,
  /\b(open now|price today|stock price|weather|score|standings|schedule today)\b/i
]);

function normalizeTurn(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function deriveBoundedSearchQuery(currentTurn) {
  let query = normalizeTurn(currentTurn);
  const questionEnd = query.indexOf("?");
  if (questionEnd >= 0) query = query.slice(0, questionEnd + 1);
  return query.slice(0, MAX_QUERY_CHARS).trim();
}

export function classifySearchNeed(currentTurn) {
  const clean = normalizeTurn(currentTurn);
  const searchRequired = FRESHNESS_PATTERNS.some(pattern => pattern.test(clean));
  return Object.freeze({
    searchRequired,
    reason: searchRequired ? "FRESHNESS_OR_CURRENT_FACT_REQUIRED" : "LOCAL_KNOWLEDGE_ROUTE",
    knowledgeClass: searchRequired ? "EXTERNAL_RETRIEVAL" : "LOCAL_KNOWLEDGE"
  });
}

function validateSourceCandidate(source) {
  return Boolean(
    source &&
    typeof source === "object" &&
    typeof source.title === "string" &&
    typeof source.url === "string" &&
    /^https?:\/\//i.test(source.url) &&
    typeof source.excerpt === "string" &&
    typeof source.sourceIdentity === "string"
  );
}

export function validateAckPack(value, maxSources = MAX_SOURCES) {
  if (!value || typeof value !== "object") throw new Error("SEARCH_ACK_PACK_NOT_OBJECT");
  if (value.schema !== "DG_GENERAL_WEB_SEARCH_ACK_PACK_v1") throw new Error("SEARCH_ACK_PACK_SCHEMA_MISMATCH");
  if (!["EVIDENCE_RETURNED", "HOLD_UNRESOLVED"].includes(value.result)) throw new Error("SEARCH_ACK_PACK_RESULT_INVALID");
  if (value.providerId !== "BRAVE_SEARCH_API_WEB_V1") throw new Error("SEARCH_PROVIDER_ID_MISMATCH");
  if (!Array.isArray(value.sourceCandidates) || value.sourceCandidates.length > maxSources) throw new Error("SEARCH_SOURCE_COUNT_INVALID");
  if (!value.sourceCandidates.every(validateSourceCandidate)) throw new Error("SEARCH_SOURCE_CANDIDATE_INVALID");
  if (!Array.isArray(value.provenanceFamilies)) throw new Error("SEARCH_PROVENANCE_FAMILIES_INVALID");
  if (!Array.isArray(value.contradictions)) throw new Error("SEARCH_CONTRADICTIONS_INVALID");
  if (!Array.isArray(value.failedFetches)) throw new Error("SEARCH_FAILED_FETCHES_INVALID");
  return value;
}

export function createSearchClient({ endpoint = DEFAULT_ENDPOINT, maxSources = MAX_SOURCES } = {}) {
  if (endpoint !== "/api/integrity-search") throw new Error("SEARCH_ENDPOINT_MUST_BE_SAME_ORIGIN_INTEGRITY_SEARCH");
  return Object.freeze({
    endpoint,
    maxSources,
    classify: classifySearchNeed,
    deriveQuery: deriveBoundedSearchQuery,
    async search(currentTurn) {
      const query = deriveBoundedSearchQuery(currentTurn);
      if (!query) throw new Error("SEARCH_QUERY_EMPTY");
      const startedAt = performance.now();
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set("q", query);
      let response;
      try {
        response = await fetch(url, {
          method: "GET",
          credentials: "omit",
          headers: { Accept: "application/json" },
          cache: "no-store"
        });
      } catch {
        const elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
        return {
          schema: "DG_GENERAL_WEB_SEARCH_ACK_PACK_v1",
          result: "HOLD_UNRESOLVED",
          providerId: "BRAVE_SEARCH_API_WEB_V1",
          sourceCandidates: [],
          evidenceObjects: [],
          provenanceFamilies: [],
          contradictions: [],
          failedFetches: [{ stage: "SEARCH_TRANSPORT", code: "NETWORK_FAILURE", httpStatus: null }],
          unresolvedGaps: ["LIVE_EVIDENCE_UNAVAILABLE"],
          freshnessState: "UNRESOLVED",
          completenessClass: "SOURCE_INCOMPLETE",
          searchSuccessStatus: "FAIL",
          toolTiming: { searchToEvidenceMs: elapsedMs },
          psalmPass2Disposition: "HOLD_UNRESOLVED",
          finalStanding: "UNRESOLVED"
        };
      }
      const elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
      if (!response.ok) {
        return {
          schema: "DG_GENERAL_WEB_SEARCH_ACK_PACK_v1",
          result: "HOLD_UNRESOLVED",
          providerId: "BRAVE_SEARCH_API_WEB_V1",
          sourceCandidates: [],
          evidenceObjects: [],
          provenanceFamilies: [],
          contradictions: [],
          failedFetches: [{ stage: "SEARCH_PROVIDER", httpStatus: response.status }],
          unresolvedGaps: ["LIVE_EVIDENCE_UNAVAILABLE"],
          freshnessState: "UNRESOLVED",
          completenessClass: "SOURCE_INCOMPLETE",
          searchSuccessStatus: "FAIL",
          toolTiming: { searchToEvidenceMs: elapsedMs },
          psalmPass2Disposition: "HOLD_UNRESOLVED",
          finalStanding: "UNRESOLVED"
        };
      }
      const ack = validateAckPack(await response.json(), maxSources);
      return {
        ...ack,
        toolTiming: {
          ...(ack.toolTiming || {}),
          searchToEvidenceMs: elapsedMs
        }
      };
    },
    buildEvidenceContext(ack) {
      const valid = validateAckPack(ack, maxSources);
      const sources = valid.sourceCandidates.map((source, index) =>
        "[" + (index + 1) + "] " + source.sourceIdentity + " | " + source.title + " | " + source.url + " | " + source.excerpt
      );
      return [
        "CURRENT EXTERNAL EVIDENCE FOR THIS TURN.",
        "Treat these as candidate evidence, not automatic truth. Search rank does not establish truth.",
        "For facts that may have changed, use only the supplied evidence. Preserve uncertainty and do not claim more than the evidence supports.",
        ...sources
      ].join("\n");
    },
    evaluateAckPack(ack) {
      const valid = validateAckPack(ack, maxSources);
      if (valid.result !== "EVIDENCE_RETURNED" || valid.sourceCandidates.length === 0) {
        return { disposition: "HOLD_UNRESOLVED", finalStanding: "UNRESOLVED" };
      }
      return {
        disposition: valid.psalmPass2Disposition || "ANSWER_WITH_SOURCE_INCOMPLETE",
        finalStanding: valid.finalStanding || "SOURCE_INCOMPLETE"
      };
    }
  });
}
