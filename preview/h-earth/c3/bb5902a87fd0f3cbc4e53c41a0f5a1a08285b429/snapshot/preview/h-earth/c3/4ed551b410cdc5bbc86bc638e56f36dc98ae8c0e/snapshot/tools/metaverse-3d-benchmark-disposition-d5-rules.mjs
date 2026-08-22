import { BAND_ORDER, DIMENSIONS, governedSubject, strongestBand } from './metaverse-3d-benchmark-disposition-d5-core.mjs';

const strongEnough = band => BAND_ORDER.indexOf(band) <= BAND_ORDER.indexOf('W3_DIRECT_EXACT');
const deterministicEnoughForAuthority = (band, dimension) =>
  band === 'W2_DETERMINISTIC_DERIVED' && ['SOURCE_CUSTODY','AUTHORITY_BOUNDARIES'].includes(dimension);

export function compileDisposition({ state, band, dimension, currentDirect = false }) {
  if (state === 'SUPERSEDED') return ['SUPERSEDE', 'STATE_SUPERSEDED'];
  if (state === 'NOT_APPLICABLE') return ['ISOLATE', 'STATE_NOT_APPLICABLE'];
  if (['UNRESOLVED','NOT_EXECUTED','WITHHELD'].includes(state)) return ['DEFER_PENDING_EVIDENCE', `STATE_${state}`];
  if (['FAIL','BLOCKED'].includes(state)) {
    return currentDirect && strongEnough(band)
      ? ['CORRECT', 'CURRENT_DIRECT_HIGH_STRENGTH_FAILURE']
      : ['DEFER_PENDING_EVIDENCE', 'FAILURE_EVIDENCE_NOT_CURRENT_DIRECT_HIGH_STRENGTH'];
  }
  if (state === 'PASS') {
    if (strongEnough(band)) return ['RETAIN', 'PASS_WITH_DIRECT_EXACT_STRENGTH'];
    if (deterministicEnoughForAuthority(band, dimension)) return ['RETAIN', 'PASS_WITH_DETERMINISTIC_AUTHORITY_STRENGTH'];
    return ['DEFER_PENDING_EVIDENCE', 'PASS_WITH_LIMITED_STRENGTH'];
  }
  return ['DEFER_PENDING_EVIDENCE', 'UNMAPPED_STATE_FAIL_CLOSED'];
}

export function factDisposition(weight) {
  const currentDirect = weight.sourceApplicability === 'CURRENT_EXACT'
    && ['DIRECT_NATIVE_EXECUTION','DIRECT_SOURCE_OCCURRENCE'].includes(weight.evidenceDirectness);
  const [disposition, reasonCode] = compileDisposition({
    state: weight.dimensionState,
    band: weight.strengthBand,
    dimension: weight.primaryDimension,
    currentDirect
  });
  return { disposition, reasonCode, currentDirect };
}

export function dimensionDisposition(strength) {
  const currentDirect = strength.strongestApplicableFactBand === 'W4_DIRECT_EXECUTED_EXACT';
  const [disposition, reasonCode] = compileDisposition({
    state: strength.aggregateState,
    band: strength.strongestApplicableFactBand,
    dimension: strength.dimension,
    currentDirect
  });
  return { disposition, reasonCode, currentDirect };
}

export function subjectDimensionState(subjectId, dimension, records) {
  if (!records.length) {
    if (subjectId === 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE' && !['SOURCE_CUSTODY','AUTHORITY_BOUNDARIES'].includes(dimension)) return 'NOT_APPLICABLE';
    if (dimension === 'USER_ACCEPTANCE') return 'WITHHELD';
    if (['RESPONSIVE_BEHAVIOR','ACCESSIBILITY'].includes(dimension)) return 'NOT_EXECUTED';
    return 'UNRESOLVED';
  }
  const states = new Set(records.map(record => record.dimensionState));
  if (states.has('FAIL')) return 'FAIL';
  if (states.has('BLOCKED')) return 'BLOCKED';
  if (states.has('UNRESOLVED')) return 'UNRESOLVED';
  if (states.has('PASS') && states.size > 1) return 'UNRESOLVED';
  for (const state of ['PASS','SUPERSEDED','NOT_APPLICABLE','NOT_EXECUTED','WITHHELD']) if (states.has(state)) return state;
  return 'UNRESOLVED';
}

export function subjectDispositionRecord(subjectId, dimension, allFactWeights) {
  const records = allFactWeights.filter(record => governedSubject(record.subjectIdentity) === subjectId && record.primaryDimension === dimension);
  const state = subjectDimensionState(subjectId, dimension, records);
  const band = strongestBand(records);
  const currentDirect = records.some(record => record.sourceApplicability === 'CURRENT_EXACT'
    && ['DIRECT_NATIVE_EXECUTION','DIRECT_SOURCE_OCCURRENCE'].includes(record.evidenceDirectness)
    && ['W4_DIRECT_EXECUTED_EXACT','W3_DIRECT_EXACT'].includes(record.strengthBand));
  const [disposition, reasonCode] = compileDisposition({ state, band, dimension, currentDirect });
  return { records, state, band, disposition, reasonCode, currentDirect };
}

export function subjectPosture(subjectId, records) {
  if (subjectId === 'WEBSITE_HOME_RECEIVER_CONTROL') return 'ISOLATED_AUXILIARY_CONTROL';
  if (subjectId === 'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE') return 'CANDIDATE_ONLY_NOT_PRODUCTION_AUTHORITY';
  if (subjectId === 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE') return 'HISTORICAL_CONTEXT_ONLY';
  const dispositions = new Set(records.map(record => record.compiledDisposition));
  if (dispositions.has('CORRECT')) return 'CORRECTION_REQUIRED_IN_BOUNDED_DIMENSIONS';
  if (dispositions.has('RETAIN') && dispositions.has('DEFER_PENDING_EVIDENCE')) return 'RETAIN_WITH_DEFERRED_DIMENSIONS';
  if (dispositions.size === 1 && dispositions.has('RETAIN')) return 'RETAIN_ALL_CLASSIFIED_DIMENSIONS';
  if (dispositions.has('SUPERSEDE')) return 'SUPERSEDED_OCCURRENCE';
  return 'DEFER_PENDING_ADDITIONAL_EXECUTION';
}

export const validateRuleCoverage = () => {
  const states = ['PASS','FAIL','BLOCKED','UNRESOLVED','NOT_EXECUTED','NOT_APPLICABLE','SUPERSEDED','WITHHELD'];
  const bands = ['W4_DIRECT_EXECUTED_EXACT','W3_DIRECT_EXACT','W2_DETERMINISTIC_DERIVED','W1_CONTEXTUAL_OR_LIMITED','W0_NON_WEIGHTABLE'];
  let combinations = 0;
  for (const state of states) for (const band of bands) for (const dimension of DIMENSIONS) {
    const [disposition] = compileDisposition({ state, band, dimension, currentDirect: true });
    if (!disposition) throw new Error(`D5A_UNMAPPED_RULE:${state}:${band}:${dimension}`);
    combinations += 1;
  }
  return { stateCount: states.length, bandCount: bands.length, dimensionCount: DIMENSIONS.length, mappedCombinationCount: combinations };
};
