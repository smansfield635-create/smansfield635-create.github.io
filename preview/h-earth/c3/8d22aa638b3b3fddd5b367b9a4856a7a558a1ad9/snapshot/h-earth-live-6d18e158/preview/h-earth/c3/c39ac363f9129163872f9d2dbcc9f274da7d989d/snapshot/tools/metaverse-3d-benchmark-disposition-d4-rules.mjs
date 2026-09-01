const WEIGHTABLE = new Set(['PASS','FAIL','BLOCKED','UNRESOLVED']);
const CONTEXT_ONLY = new Set(['SUPERSEDED']);
const EXECUTION_PREDICATES = new Set([
  'EXECUTION_STATUS','CAPTURE_COUNT','EXECUTED_SCENARIO_COUNT','HARNESS_FAILURE_COUNT',
  'SCENARIO_COUNT','EXECUTED_COUNT','SCREENSHOT_COUNT','VERIFIED_SCREENSHOT_COUNT',
  'FINDING_OBSERVATION_COUNT','INTERACTIVE_ELEMENT_PARTIALLY_CLIPPED_COUNT',
  'INTERACTIVE_CONTROL_OVERLAP_COUNT','FOUR_COMPASS_CONSOLE_ERROR_COUNT',
  'FOUR_COMPASS_CONSOLE_WARNING_COUNT','FOUR_COMPASS_PAGE_ERROR_COUNT',
  'FOUR_COMPASS_REQUEST_FAILURE_COUNT','NONBLOCKING_TELEMETRY_OBSERVATION'
]);
const EXACT_NATIVE = new Set(['EXACT_NATIVE_EVIDENCE_OCCURRENCE','NATIVE_EVIDENCE_OCCURRENCE']);
const EXACT_SOURCE = new Set(['EXACT_SOURCE_OCCURRENCE','SOURCE_OCCURRENCE']);
const DERIVED = new Set([
  'SOURCE_RECORD_COUNT','NATIVE_EVIDENCE_RECORD_COUNT','CANONICAL_COMPASS_COUNT',
  'PACKAGE_PATH_COUNT','INTERNAL_RUNTIME_MODULE_COUNT',
  'PROTOTYPE_PACKAGE_PATH_COUNT_EQUALS_CANONICAL_COMPASS_COUNT',
  'PROTOTYPE_INTERNAL_RUNTIME_MODULE_COUNT_EQUALS_CANONICAL_COMPASS_COUNT',
  'PACKAGE_OCCURRENCE_AND_INSPECTED_REPOSITORY_COMMITS_DISTINCT',
  'AUTHORITY_COUNT','VALIDATION_DIGEST','PRODUCT_DEFECT_CLASSIFICATION',
  'MAIN_CHANGED','PRODUCT_FILES_CHANGED','TOOL_EVIDENCE_ACCEPTED',
  'TOOL_EXECUTION_ACCEPTED','TOOL_INSTALLATION_AUTHORIZED','TOOL_MERGE_AUTHORIZED',
  'TOOL_MERGE_READINESS_ESTABLISHED','LAWS_REPAIR_AUTHORIZED',
  'COMPASS_IN_HOME_FINDINGS','COMPASS_IN_HOME_MANIFEST','COMPASS_IN_HOME_RECORDS',
  'COMPASS_IN_HOME_SUMMARIES','CROSS_LANE_AGGREGATE_CREATED',
  'HOME_IN_COMPASS_FINDINGS','HOME_IN_COMPASS_MANIFEST','HOME_IN_COMPASS_RECORDS',
  'HOME_IN_COMPASS_SUMMARIES','RETIRED_ACTIVE_IDENTITIES_OBSERVED'
]);

const historicalSubject = record =>
  record.laneId === 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE' ||
  /::R[0-7]$/.test(record.subjectIdentity) ||
  /::CP[0-9_]/.test(record.subjectIdentity) ||
  record.subjectIdentity.includes('HISTORICAL_ROUTE_SHELL_EXECUTION') ||
  record.predicateIdentity === 'HISTORICAL_EXECUTION_APPLIES_TO_CURRENT_SOURCE';

const auxiliarySubject = record =>
  record.subjectIdentity.includes('HOME_AUXILIARY') ||
  record.subjectIdentity.includes('WEBSITE_HOME_RECEIVER_CONTROL') ||
  record.subjectIdentity.includes('HOME_');

export function classifyFactWeight(record) {
  const weightability = WEIGHTABLE.has(record.dimensionState)
    ? 'WEIGHTABLE'
    : CONTEXT_ONLY.has(record.dimensionState) ? 'CONTEXT_ONLY' : 'NON_WEIGHTABLE';

  const historical = historicalSubject(record);
  const sourceApplicability = record.dimensionState === 'NOT_APPLICABLE'
    ? 'NOT_APPLICABLE'
    : record.predicateIdentity === 'HISTORICAL_EXECUTION_APPLIES_TO_CURRENT_SOURCE'
      ? 'UNRESOLVED'
      : historical ? 'HISTORICAL_EXACT' : 'CURRENT_EXACT';

  let evidenceDirectness;
  if (record.laneId === 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE' && !EXACT_SOURCE.has(record.predicateIdentity) && !EXACT_NATIVE.has(record.predicateIdentity)) {
    evidenceDirectness = 'HISTORICAL_AWARENESS';
  } else if (EXECUTION_PREDICATES.has(record.predicateIdentity) || EXACT_NATIVE.has(record.predicateIdentity)) {
    evidenceDirectness = 'DIRECT_NATIVE_EXECUTION';
  } else if (EXACT_SOURCE.has(record.predicateIdentity) || record.predicateIdentity === 'CANONICAL_COMPASS_AUTHORITY' || record.predicateIdentity === 'AUXILIARY_NON_COMPASS_CONTROL' || record.predicateIdentity === 'LANE_POSTURE' || record.predicateIdentity === 'CURRENT_AUTHORITY') {
    evidenceDirectness = 'DIRECT_SOURCE_OCCURRENCE';
  } else if (DERIVED.has(record.predicateIdentity)) {
    evidenceDirectness = 'DETERMINISTIC_DERIVATION';
  } else if (record.dimensionState === 'WITHHELD' || record.dimensionState === 'NOT_EXECUTED' || record.dimensionState === 'NOT_APPLICABLE') {
    evidenceDirectness = 'SYNTHESIZED_ABSENCE';
  } else {
    evidenceDirectness = 'DETERMINISTIC_DERIVATION';
  }

  const executionPosture = evidenceDirectness === 'DIRECT_NATIVE_EXECUTION'
    ? (historical ? 'EXECUTED_EXACT_HISTORICAL_SOURCE' : 'EXECUTED_EXACT_SOURCE')
    : evidenceDirectness === 'DIRECT_SOURCE_OCCURRENCE'
      ? (historical ? 'STATIC_HISTORICAL_SOURCE' : 'STATIC_EXACT_SOURCE')
      : evidenceDirectness === 'HISTORICAL_AWARENESS' ? 'STATIC_HISTORICAL_SOURCE' : 'NOT_EXECUTED';

  const custodyStrength =
    EXACT_NATIVE.has(record.predicateIdentity) ||
    record.predicateIdentity === 'VERIFIED_SCREENSHOT_COUNT' ||
    record.predicateIdentity === 'VALIDATION_DIGEST'
      ? 'VERIFIED_BYTES_AND_DIGEST'
      : EXACT_SOURCE.has(record.predicateIdentity) || evidenceDirectness === 'DIRECT_SOURCE_OCCURRENCE'
        ? 'VERIFIED_REPOSITORY_IDENTITY'
        : evidenceDirectness === 'DETERMINISTIC_DERIVATION' || evidenceDirectness === 'DIRECT_NATIVE_EXECUTION'
          ? 'VERIFIED_BYTES_AND_DIGEST'
          : evidenceDirectness === 'HISTORICAL_AWARENESS'
            ? 'DECLARED_IDENTITY'
            : 'UNVERIFIED';

  const scopeFit = auxiliarySubject(record) && record.primaryDimension !== 'AUTHORITY_BOUNDARIES'
    ? 'CROSS_SCOPE_CONTEXT_ONLY'
    : record.subjectIdentity.startsWith('EVIDENCE_LANE::') ||
      record.subjectIdentity.includes('FOUR_COMPASS_BASELINE') ||
      record.subjectIdentity.includes('FOUR_COMPASS_SMOKE') ||
      record.subjectIdentity.includes('T3_ALL_EVIDENCE') ||
      record.subjectIdentity.includes('T3_LANE_SEPARATION')
      ? 'EXACT_LANE_AND_DIMENSION'
      : 'EXACT_SUBJECT_AND_DIMENSION';

  let strengthBand;
  if (weightability === 'NON_WEIGHTABLE' || custodyStrength === 'UNVERIFIED' || scopeFit === 'OUT_OF_SCOPE') {
    strengthBand = 'W0_NON_WEIGHTABLE';
  } else if (weightability === 'CONTEXT_ONLY' || evidenceDirectness === 'HISTORICAL_AWARENESS' || sourceApplicability === 'UNRESOLVED' || scopeFit === 'CROSS_SCOPE_CONTEXT_ONLY') {
    strengthBand = 'W1_CONTEXTUAL_OR_LIMITED';
  } else if (evidenceDirectness === 'DETERMINISTIC_DERIVATION') {
    strengthBand = 'W2_DETERMINISTIC_DERIVED';
  } else if (evidenceDirectness === 'DIRECT_NATIVE_EXECUTION' && sourceApplicability === 'CURRENT_EXACT' && executionPosture === 'EXECUTED_EXACT_SOURCE' && custodyStrength === 'VERIFIED_BYTES_AND_DIGEST') {
    strengthBand = 'W4_DIRECT_EXECUTED_EXACT';
  } else {
    strengthBand = 'W3_DIRECT_EXACT';
  }

  const evidenceOrientation = record.dimensionState === 'PASS'
    ? 'SUPPORTING_STATE'
    : record.dimensionState === 'FAIL' || record.dimensionState === 'BLOCKED'
      ? 'CONTRARY_STATE'
      : record.dimensionState === 'UNRESOLVED'
        ? 'UNRESOLVED_STATE'
        : weightability === 'CONTEXT_ONLY' ? 'CONTEXT_ONLY' : 'NON_WEIGHTABLE';

  return {
    weightability,
    sourceApplicability,
    evidenceDirectness,
    executionPosture,
    custodyStrength,
    scopeFit,
    strengthBand,
    evidenceOrientation,
    precedenceVector: [weightability, sourceApplicability, evidenceDirectness, executionPosture, custodyStrength, scopeFit]
  };
}

export function classifyRelationWeight(record) {
  const weightability = WEIGHTABLE.has(record.dimensionState) ? 'WEIGHTABLE' : 'NON_WEIGHTABLE';
  const sourceApplicability = 'UNRESOLVED';
  const evidenceDirectness = 'DETERMINISTIC_DERIVATION';
  const executionPosture = 'NOT_EXECUTED';
  const custodyStrength = 'VERIFIED_BYTES_AND_DIGEST';
  const scopeFit = 'EXACT_LANE_AND_DIMENSION';
  return {
    weightability,
    sourceApplicability,
    evidenceDirectness,
    executionPosture,
    custodyStrength,
    scopeFit,
    strengthBand: weightability === 'WEIGHTABLE' ? 'W2_DETERMINISTIC_DERIVED' : 'W0_NON_WEIGHTABLE',
    evidenceOrientation: record.dimensionState === 'UNRESOLVED' ? 'UNRESOLVED_STATE' : 'NON_WEIGHTABLE',
    precedenceVector: [weightability, sourceApplicability, evidenceDirectness, executionPosture, custodyStrength, scopeFit]
  };
}
