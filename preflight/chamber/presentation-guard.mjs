/**
 * Operations Chamber: evidence-aware presentation guard.
 * Stateless presentation logic only. Does not fetch, mutate, admit, publish, or schedule.
 * Integration target: browser-local Operations Chamber.
 */

export const REVIEW_AFTER_MS = 30 * 60 * 1000;
const FUTURE_SKEW_MS = 5 * 60 * 1000;
const PROOF_BASES = new Set(['VERIFIED_RECORD', 'REPORTED_RESULT', 'PROPOSED_NEXT_STEP', 'NOT_ESTABLISHED']);
const PHASES = Object.freeze(['implementation', 'qualification', 'publicationAdoption', 'operationalObservation']);
const PRESENT_STATES = new Set([
  'MERGED_IMPLEMENTATION', 'PRESENT_IMPLEMENTATION', 'SPECIFIED_ONLY', 'RECORDED_PASS',
  'REPORTED_PASS', 'PUBLISHED_ADOPTION', 'ADOPTED_IMPLEMENTATION',
  'OBSERVED_READ_ONLY', 'NOT_ESTABLISHED', 'NOT_APPLICABLE'
]);

/** Allow credential-free GitHub evidence links in the imported records. */
export function safeEvidenceUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    url.search = ''; // ignore analytics/tracking params when comparing exact evidence identity
    if (url.hostname !== 'github.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return url.href;
  } catch {
    return null;
  }
}

function safeSources(sources) {
  if (!Array.isArray(sources)) return [];
  const seen = new Set();
  const result = [];
  for (const source of sources) {
    const url = safeEvidenceUrl(source?.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    result.push({ label: typeof source.label === 'string' ? source.label.slice(0, 180) : 'Evidence', url });
  }
  return result;
}

function timeValue(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function validSourceHeads(sourceHeads) {
  return Array.isArray(sourceHeads) && sourceHeads.length > 0 && sourceHeads.every(h =>
    typeof h?.repository === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(h.repository) &&
    typeof h.head === 'string' && /^[0-9a-f]{40}$/.test(h.head)
  );
}

const descriptions = Object.freeze({
  SOURCE_REVIEWED: 'Source-reviewed proposed next step. Independently reconcile before agent execution.',
  SOURCE_CHECK_AGED: 'Last reviewed; its continued validity is not confirmed.',
  REVALIDATION_REQUIRED: 'Linked project evidence changed. Revalidation required before a next step can be shown as current.',
  SOURCE_CHECK_UNAVAILABLE: 'Source check unavailable. Current action unknown; prior briefing retained for inspection.',
  UNKNOWN: 'Current next action not established by the available evidence.'
});

/**
 * @param {object|null} briefing Chamber DGB_PROJECT_BRIEFINGS_v1 record
 * @param {object} options
 * @param {number} options.nowMs Clock reading at render time (not a new source observation)
 * @param {string[]} options.linkedDependencies Project-scoped stable dependency IDs, maintained by existing project routing
 * @param {object[]} options.verifiedDependencyEvents Fresh source-qualified event facts (not a repo-HEAD comparison)
 * @param {'READ_OK'|'READ_FAILED'|'NOT_ATTEMPTED'} options.sourceReadStatus
 * @returns {object} UI-safe, non-authoritative action presentation
 */
export function evaluateBriefing(briefing, {
  nowMs = Date.now(),
  reviewAfterMs = REVIEW_AFTER_MS,
  linkedDependencies = [],
  verifiedDependencyEvents = [],
  sourceReadStatus = 'NOT_ATTEMPTED'
} = {}) {
  const fallback = (state, observedAt = null, ageMinutes = null, historicalNextStep = null, evidence = []) => ({
    state, label: descriptions[state], sourceCheckedAt: observedAt, ageMinutes,
    proposedNextStep: null, historicalNextStep,
    evidence, requiresFreshAgentReconciliation: true, executionAuthorized: false
  });
  if (!briefing || typeof briefing !== 'object') return fallback('UNKNOWN');
  const step = briefing.nextStep;
  const history = typeof step?.text === 'string' ? step.text : null;
  const evidence = safeSources(step?.sources);
  const checkedMs = timeValue(briefing.observedAt);
  if (!Number.isFinite(nowMs) || checkedMs === null || checkedMs > nowMs + FUTURE_SKEW_MS ||
      !validSourceHeads(briefing.sourceHeads) || !PROOF_BASES.has(step?.basis) ||
      step.basis !== 'PROPOSED_NEXT_STEP' || !history || evidence.length === 0) {
    return fallback('UNKNOWN', briefing.observedAt ?? null, null, history, evidence);
  }
  const ageMs = Math.max(0, nowMs - checkedMs);
  const ageMinutes = Math.floor(ageMs / 60000);
  if (sourceReadStatus === 'READ_FAILED') {
    return fallback('SOURCE_CHECK_UNAVAILABLE', briefing.observedAt, ageMinutes, history, evidence);
  }
  const dependent = new Set(Array.isArray(linkedDependencies) ? linkedDependencies : []);
  const linkedUrls = new Set(evidence.map(x => x.url));
  const changed = (Array.isArray(verifiedDependencyEvents) ? verifiedDependencyEvents : []).some(event => {
    if (!event || event.projectId !== briefing.projectId || event.status !== 'CHANGED_VERIFIED' || event.sourceReadStatus !== 'READ_OK') return false;
    const seenMs = timeValue(event.observedAt);
    if (seenMs === null || seenMs <= checkedMs || seenMs > nowMs + FUTURE_SKEW_MS) return false;
    const exactDependency = typeof event.dependencyKey === 'string' && dependent.has(event.dependencyKey);
    const exactSource = safeEvidenceUrl(event.sourceUrl);
    return exactDependency || (exactSource !== null && linkedUrls.has(exactSource));
  });
  if (changed) return fallback('REVALIDATION_REQUIRED', briefing.observedAt, ageMinutes, history, evidence);
  if (!Number.isFinite(reviewAfterMs) || reviewAfterMs <= 0 || ageMs > reviewAfterMs) {
    return fallback('SOURCE_CHECK_AGED', briefing.observedAt, ageMinutes, history, evidence);
  }
  return {
    state: 'SOURCE_REVIEWED', label: descriptions.SOURCE_REVIEWED,
    sourceCheckedAt: briefing.observedAt, ageMinutes,
    proposedNextStep: history, historicalNextStep: history,
    evidence, requiresFreshAgentReconciliation: true, executionAuthorized: false
  };
}

/** Preserve four independent proof layers. No implication flows between them. */
export function presentCapability(card) {
  const layers = {};
  for (const phase of PHASES) {
    const layer = card?.[phase];
    const sourceLinks = safeSources(layer?.sources);
    let status = PRESENT_STATES.has(layer?.status) ? layer.status : 'NOT_ESTABLISHED';
    const missingProof = !['NOT_ESTABLISHED', 'NOT_APPLICABLE'].includes(status) && sourceLinks.length === 0;
    if (missingProof) status = 'NOT_ESTABLISHED';
    layers[phase] = {
      status,
      text: missingProof ? 'Evidence not established' : (typeof layer?.text === 'string' ? layer.text : 'Evidence not established'),
      evidence: sourceLinks,
      sourceVersion: typeof layer?.sourceVersion === 'string' ? layer.sourceVersion : null,
      observedAt: timeValue(layer?.observedAt) !== null ? layer.observedAt : null,
      liveExecutionClaimed: false // read-only observation, merge, test or publication never grants execution authority
    };
  }
  return {
    id: card?.id ?? 'UNKNOWN',
    name: typeof card?.name === 'string' ? card.name : 'Unnamed capability',
    layers,
    anyProductionClaimInferred: false
  };
}

/** Show study source time, capture time and host storage time as distinct facts. */
export function presentStudyTiming(study) {
  return {
    sourceCutoff: timeValue(study?.rollingStudy?.through) !== null ? study.rollingStudy.through : null,
    collectorCapturedAt: timeValue(study?.capturedAt) !== null ? study.capturedAt : null,
    hostedStoredAt: timeValue(study?.hostedStoredAt) !== null ? study.hostedStoredAt : null,
    sourceIsCurrentNow: false
  };
}

export const HOME_ENTRANCES = Object.freeze(['Projects', 'Instruments', 'System', 'Evidence']);
