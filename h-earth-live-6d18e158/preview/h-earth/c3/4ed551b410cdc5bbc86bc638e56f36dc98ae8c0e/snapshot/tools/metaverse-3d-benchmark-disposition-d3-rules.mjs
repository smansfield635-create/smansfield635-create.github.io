import { DIMENSIONS, STATES, assert } from './metaverse-3d-benchmark-disposition-d3-core.mjs';

const D = Object.freeze({
  SOURCE_CUSTODY: new Set(['EXACT_SOURCE_OCCURRENCE','EXACT_NATIVE_EVIDENCE_OCCURRENCE','SOURCE_OCCURRENCE','NATIVE_EVIDENCE_OCCURRENCE','SOURCE_RECORD_COUNT','NATIVE_EVIDENCE_RECORD_COUNT','PACKAGE_PATH_COUNT','INTERNAL_RUNTIME_MODULE_COUNT','VALIDATION_DIGEST']),
  AUTHORITY_BOUNDARIES: new Set(['LANE_POSTURE','CANONICAL_COMPASS_AUTHORITY','AUXILIARY_NON_COMPASS_CONTROL','CANONICAL_COMPASS_COUNT','CURRENT_AUTHORITY','PROTOTYPE_PACKAGE_PATH_COUNT_EQUALS_CANONICAL_COMPASS_COUNT','PROTOTYPE_INTERNAL_RUNTIME_MODULE_COUNT_EQUALS_CANONICAL_COMPASS_COUNT','AUTHORITY_COUNT','LAWS_REPAIR_AUTHORIZED','MAIN_CHANGED','PRODUCT_FILES_CHANGED','TOOL_EVIDENCE_ACCEPTED','TOOL_EXECUTION_ACCEPTED','TOOL_INSTALLATION_AUTHORIZED','TOOL_MERGE_AUTHORIZED','TOOL_MERGE_READINESS_ESTABLISHED','COMPASS_IN_HOME_FINDINGS','COMPASS_IN_HOME_MANIFEST','COMPASS_IN_HOME_RECORDS','COMPASS_IN_HOME_SUMMARIES','CROSS_LANE_AGGREGATE_CREATED','HOME_IN_COMPASS_FINDINGS','HOME_IN_COMPASS_MANIFEST','HOME_IN_COMPASS_RECORDS','HOME_IN_COMPASS_SUMMARIES','RETIRED_ACTIVE_IDENTITIES_OBSERVED']),
  RUNTIME_LOAD: new Set(['CURRENT_SOURCE_EXECUTION_POSTURE','EXECUTION_STATUS','FOUR_COMPASS_CONSOLE_ERROR_COUNT','FOUR_COMPASS_CONSOLE_WARNING_COUNT','FOUR_COMPASS_PAGE_ERROR_COUNT','FOUR_COMPASS_REQUEST_FAILURE_COUNT']),
  INTERACTION_EXECUTION: new Set(['SCENARIO_COUNT','EXECUTED_SCENARIO_COUNT','EXECUTED_COUNT']),
  VISUAL_REALIZATION: new Set(['CAPTURE_COUNT','SCREENSHOT_COUNT','VERIFIED_SCREENSHOT_COUNT']),
  SPATIAL_REALIZATION: new Set(['FINDING_OBSERVATION_COUNT','INTERACTIVE_ELEMENT_PARTIALLY_CLIPPED_COUNT','INTERACTIVE_CONTROL_OVERLAP_COUNT']),
  PERFORMANCE: new Set(['HARNESS_FAILURE_COUNT']),
  DEPLOYED_IDENTITY: new Set(['HISTORICAL_EXECUTION_APPLIES_TO_CURRENT_SOURCE','PACKAGE_OCCURRENCE_AND_INSPECTED_REPOSITORY_COMMITS_DISTINCT','NONBLOCKING_TELEMETRY_OBSERVATION','PRODUCT_DEFECT_CLASSIFICATION']),
});

const lifecycleWithheld = new Set(['LAWS_REPAIR_AUTHORIZED','TOOL_INSTALLATION_AUTHORIZED','TOOL_MERGE_AUTHORIZED','TOOL_MERGE_READINESS_ESTABLISHED']);
const separationZeroRequired = new Set(['COMPASS_IN_HOME_FINDINGS','COMPASS_IN_HOME_MANIFEST','COMPASS_IN_HOME_RECORDS','COMPASS_IN_HOME_SUMMARIES','HOME_IN_COMPASS_FINDINGS','HOME_IN_COMPASS_MANIFEST','HOME_IN_COMPASS_RECORDS','HOME_IN_COMPASS_SUMMARIES','RETIRED_ACTIVE_IDENTITIES_OBSERVED']);
const unresolvedPositiveObservation = new Set(['FINDING_OBSERVATION_COUNT','INTERACTIVE_ELEMENT_PARTIALLY_CLIPPED_COUNT','INTERACTIVE_CONTROL_OVERLAP_COUNT','FOUR_COMPASS_CONSOLE_ERROR_COUNT','FOUR_COMPASS_CONSOLE_WARNING_COUNT']);
const zeroPass = new Set(['HARNESS_FAILURE_COUNT','FOUR_COMPASS_PAGE_ERROR_COUNT','FOUR_COMPASS_REQUEST_FAILURE_COUNT']);

export function primaryDimensionForFact(fact) {
  for (const [dimension, predicates] of Object.entries(D)) if (predicates.has(fact.predicateIdentity)) return dimension;
  throw new Error(`D3_UNMAPPED_PREDICATE:${fact.predicateIdentity}`);
}

export function stateForFact(fact, dimension = primaryDimensionForFact(fact)) {
  const p = fact.predicateIdentity;
  const v = fact.normalizedValue;
  if (p === 'CURRENT_AUTHORITY' && v === false) return 'SUPERSEDED';
  if (p === 'HISTORICAL_EXECUTION_APPLIES_TO_CURRENT_SOURCE' && v === false) return 'NOT_APPLICABLE';
  if (p === 'PRODUCT_DEFECT_CLASSIFICATION') return 'UNRESOLVED';
  if (p === 'NONBLOCKING_TELEMETRY_OBSERVATION') return 'UNRESOLVED';
  if (p === 'CURRENT_SOURCE_EXECUTION_POSTURE' || (dimension !== 'SOURCE_CUSTODY' && fact.executionPosture === 'NOT_EXECUTED')) return 'NOT_EXECUTED';
  if (lifecycleWithheld.has(p) && (v === false || v === 'NONE')) return 'WITHHELD';
  if (p === 'CROSS_LANE_AGGREGATE_CREATED') return v === false ? 'PASS' : 'FAIL';
  if (separationZeroRequired.has(p)) return Number(v) === 0 ? 'PASS' : 'FAIL';
  if (unresolvedPositiveObservation.has(p)) return Number(v) === 0 ? 'PASS' : 'UNRESOLVED';
  if (zeroPass.has(p)) return Number(v) === 0 ? 'PASS' : 'FAIL';
  if (p === 'PROTOTYPE_PACKAGE_PATH_COUNT_EQUALS_CANONICAL_COMPASS_COUNT' || p === 'PROTOTYPE_INTERNAL_RUNTIME_MODULE_COUNT_EQUALS_CANONICAL_COMPASS_COUNT') return 'NOT_APPLICABLE';
  if (fact.applicabilityPosture === 'NOT_APPLICABLE') return 'NOT_APPLICABLE';
  if (fact.applicabilityPosture === 'APPLICABILITY_UNRESOLVED' || fact.executionPosture === 'EXECUTION_STATUS_UNRESOLVED') return 'UNRESOLVED';
  if (fact.temporalPosture?.includes('SUPERSEDED')) return 'SUPERSEDED';
  return 'PASS';
}

export function classifyFact(fact) {
  const primaryDimension = primaryDimensionForFact(fact);
  const dimensionState = stateForFact(fact, primaryDimension);
  assert(DIMENSIONS.includes(primaryDimension), 'D3_DIMENSION_ENUM');
  assert(STATES.includes(dimensionState), 'D3_STATE_ENUM');
  return {
    schemaVersion: 'METAVERSE_3D_BENCHMARK_DIMENSION_CLASSIFICATION_v1',
    canonicalFactId: fact.canonicalFactId,
    laneId: fact.laneId,
    subjectIdentity: fact.subjectIdentity,
    predicateIdentity: fact.predicateIdentity,
    primaryDimension,
    dimensionState,
    ruleId: `PREDICATE_${fact.predicateIdentity}`,
    sourceFactDigest: fact.canonicalFactId.replace(/^D2SF?_/, ''),
    findingPromotedToDefect: false,
    evidenceWeight: 'NOT_APPLIED',
    disposition: 'NOT_COMPILED',
  };
}

export function classifyRelation(relation, factById) {
  const left = factById.get(relation.leftFactId); const right = factById.get(relation.rightFactId);
  assert(left && right, 'D3_RELATION_FACT_MISSING');
  let primaryDimension = 'AUTHORITY_BOUNDARIES';
  if (relation.relationType === 'EXECUTION_POSTURE_DIFFERENCE') primaryDimension = 'RUNTIME_LOAD';
  if (relation.relationType === 'OBSERVATION_INTERPRETATION_DIFFERENCE') primaryDimension = 'DEPLOYED_IDENTITY';
  if (relation.relationType === 'VALUE_DIFFERENCE_DIFFERENT_SCOPE') primaryDimension = 'AUTHORITY_BOUNDARIES';
  return {
    schemaVersion: 'METAVERSE_3D_BENCHMARK_RELATION_DIMENSION_CLASSIFICATION_v1',
    relationId: relation.relationId,
    primaryDimension,
    dimensionState: relation.resolutionPerformed ? 'PASS' : 'UNRESOLVED',
    ruleId: `RELATION_${relation.relationType}`,
    resolutionPerformed: false,
    winnerFactId: 'NONE',
    evidenceWeight: 'NOT_APPLIED',
    disposition: 'NOT_COMPILED',
  };
}

export function validateRuleCoverage(facts) {
  const predicates = [...new Set(facts.map(f => f.predicateIdentity))].sort();
  for (const fact of facts) { primaryDimensionForFact(fact); stateForFact(fact); }
  return { predicateCount: predicates.length, predicates };
}
