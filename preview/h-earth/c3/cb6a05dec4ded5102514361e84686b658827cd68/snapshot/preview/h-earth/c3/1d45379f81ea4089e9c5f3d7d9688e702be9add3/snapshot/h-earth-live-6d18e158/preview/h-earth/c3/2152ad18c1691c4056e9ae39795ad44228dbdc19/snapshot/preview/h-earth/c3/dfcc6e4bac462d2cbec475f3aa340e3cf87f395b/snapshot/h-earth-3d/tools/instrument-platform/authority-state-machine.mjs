import { clone, deepFreeze } from './platform-core.mjs';

export const AUTHORITY_STATES = deepFreeze([
  'SPECIFIED', 'SOURCE_IMPLEMENTED', 'RUNTIME_IMPLEMENTED', 'ENGINEERING_PASS', 'LIVE_AVAILABLE',
  'PUBLIC_CANDIDATE_VERIFIED', 'USER_DIFFERENTIAL_RECORDED', 'ACCEPTED', 'REJECTED',
  'RECONCILIATION_REQUIRED', 'DEFAULT_PROMOTED', 'PUBLIC_DEFAULT_REVERIFIED'
]);

const transitions = {
  SPECIFIED: ['SOURCE_IMPLEMENTED'],
  SOURCE_IMPLEMENTED: ['RUNTIME_IMPLEMENTED'],
  RUNTIME_IMPLEMENTED: ['ENGINEERING_PASS'],
  ENGINEERING_PASS: ['LIVE_AVAILABLE'],
  LIVE_AVAILABLE: ['PUBLIC_CANDIDATE_VERIFIED'],
  PUBLIC_CANDIDATE_VERIFIED: ['USER_DIFFERENTIAL_RECORDED'],
  USER_DIFFERENTIAL_RECORDED: ['ACCEPTED', 'REJECTED', 'RECONCILIATION_REQUIRED'],
  ACCEPTED: ['DEFAULT_PROMOTED'],
  DEFAULT_PROMOTED: ['PUBLIC_DEFAULT_REVERIFIED'],
  RECONCILIATION_REQUIRED: ['SPECIFIED'],
  REJECTED: [],
  PUBLIC_DEFAULT_REVERIFIED: []
};

function hasAll(value, keys) { return keys.every((key) => value?.[key] === true); }

function transitionRequirements(from, to, evidence) {
  if (from === 'SPECIFIED' && to === 'SOURCE_IMPLEMENTED') return hasAll(evidence, ['written', 'committed', 'fetchedBack', 'exactRepositoryVerified']) ? [] : ['WRITTEN_COMMITTED_FETCHED_BACK_AND_EXACT_REPOSITORY_VERIFIED_REQUIRED'];
  if (from === 'SOURCE_IMPLEMENTED' && to === 'RUNTIME_IMPLEMENTED') return evidence?.executedFromExactSource === true && evidence?.executedHead ? [] : ['EXECUTION_FROM_EXACT_SOURCE_REQUIRED'];
  if (from === 'RUNTIME_IMPLEMENTED' && to === 'ENGINEERING_PASS') return evidence?.verificationMatrixPassed === true && Array.isArray(evidence?.checks) && evidence.checks.length > 0 ? [] : ['COMPLETE_VERIFICATION_MATRIX_PASS_REQUIRED'];
  if (from === 'ENGINEERING_PASS' && to === 'LIVE_AVAILABLE') return evidence?.boundedLiveAdmission === true && evidence?.rollbackReady === true ? [] : ['BOUNDED_LIVE_ADMISSION_AND_ROLLBACK_REQUIRED'];
  if (from === 'LIVE_AVAILABLE' && to === 'PUBLIC_CANDIDATE_VERIFIED') return hasAll(evidence, ['publicRouteVerified', 'publicBindingVerified', 'publicRuntimeVerified']) ? [] : ['PUBLIC_ROUTE_BINDING_AND_RUNTIME_VERIFICATION_REQUIRED'];
  if (from === 'PUBLIC_CANDIDATE_VERIFIED' && to === 'USER_DIFFERENTIAL_RECORDED') return evidence?.userDifferentialRecorded === true && evidence?.baselineId && evidence?.candidateId ? [] : ['USER_DIFFERENTIAL_AGAINST_ACCEPTED_BASELINE_REQUIRED'];
  if (from === 'USER_DIFFERENTIAL_RECORDED' && ['ACCEPTED', 'REJECTED', 'RECONCILIATION_REQUIRED'].includes(to)) {
    const expected = { ACCEPTED: 'ACCEPT', REJECTED: 'REJECT', RECONCILIATION_REQUIRED: 'RECONCILE' }[to];
    return evidence?.userDisposition === expected ? [] : [`USER_DISPOSITION_${expected}_REQUIRED`];
  }
  if (from === 'ACCEPTED' && to === 'DEFAULT_PROMOTED') return evidence?.separatePromotionPerformed === true && evidence?.promotionCommit ? [] : ['SEPARATE_DEFAULT_PROMOTION_REQUIRED'];
  if (from === 'DEFAULT_PROMOTED' && to === 'PUBLIC_DEFAULT_REVERIFIED') return hasAll(evidence, ['defaultRouteVerified', 'defaultBindingVerified', 'defaultRuntimeVerified']) ? [] : ['PUBLIC_DEFAULT_REVERIFICATION_REQUIRED'];
  if (from === 'RECONCILIATION_REQUIRED' && to === 'SPECIFIED') return evidence?.newCandidateRelationEstablished === true ? [] : ['NEW_CANDIDATE_RELATION_REQUIRED'];
  return [];
}

export function evaluateAuthorityTransition({ from, to, evidence = {} }) {
  if (!AUTHORITY_STATES.includes(from)) throw new Error(`AUTHORITY_STATE_UNKNOWN:${from}`);
  if (!AUTHORITY_STATES.includes(to)) throw new Error(`AUTHORITY_STATE_UNKNOWN:${to}`);
  const allowed = transitions[from].includes(to);
  const issues = allowed ? transitionRequirements(from, to, evidence) : [`TRANSITION_NOT_ALLOWED:${from}->${to}`];
  return deepFreeze({ from, to, allowed: allowed && issues.length === 0, issues, evidence: clone(evidence) });
}

export function createAuthorityStateMachine(initialState = 'SPECIFIED') {
  if (!AUTHORITY_STATES.includes(initialState)) throw new Error(`AUTHORITY_STATE_UNKNOWN:${initialState}`);
  let state = initialState;
  const history = [];
  function transition(to, evidence = {}) {
    const result = evaluateAuthorityTransition({ from: state, to, evidence });
    history.push(result);
    if (result.allowed) state = to;
    return result;
  }
  return Object.freeze({ getState: () => state, getHistory: () => deepFreeze(clone(history)), transition });
}

export const H_EARTH_AUTHORITY_STATE_MACHINE = deepFreeze({ schemaVersion: 'H_EARTH_AUTHORITY_STATE_MACHINE_v1', states: AUTHORITY_STATES, transitions });
export default H_EARTH_AUTHORITY_STATE_MACHINE;
