import { EXPECTED, fail, digest, stable, exactArray, unique, hasNull } from './metaverse-3d-benchmark-disposition-d2s-t3-core.mjs';

const factIdentityPayload = fact => ({
  schemaVersion: fact.schemaVersion, laneId: fact.laneId, sourceOccurrenceIdentity: fact.sourceOccurrenceIdentity,
  subjectIdentity: fact.subjectIdentity, predicateIdentity: fact.predicateIdentity, factKind: fact.factKind,
  temporalPosture: fact.temporalPosture, executionPosture: fact.executionPosture, authorityPosture: fact.authorityPosture,
  normalizedValue: fact.normalizedValue, unit: fact.unit, presencePosture: fact.presencePosture, applicabilityPosture: fact.applicabilityPosture
});

function makeFact({ sourceProvenancePointer, sourceOccurrenceIdentity, subjectIdentity, predicateIdentity, factKind,
  epistemicPosture = 'VERIFIED_T3_OBSERVATION', observationInterpretationPosture = 'OBSERVATION',
  temporalPosture = 'CURRENT_CUSTODY_OF_EXECUTED_EVIDENCE', executionPosture = 'EXECUTED_PASS',
  authorityPosture = 'ACCEPTED_NATIVE_TOOL_EVIDENCE', valueType, value, unit = 'NONE',
  presencePosture = 'PRESENT', applicabilityPosture = 'APPLICABLE', extractionRuleId }) {
  const base = {
    schemaVersion: 'METAVERSE_3D_CANONICAL_EVIDENCE_FACT_v1', laneId: EXPECTED.laneId,
    sourceProvenancePointer, sourceOccurrenceIdentity, subjectIdentity, predicateIdentity, factKind,
    epistemicPosture, observationInterpretationPosture, temporalPosture, executionPosture, authorityPosture,
    valueType, originalValue: stable(value), normalizedValue: stable(value), unit, presencePosture, applicabilityPosture,
    transformationTrace: {
      inputRecordIdentity: sourceProvenancePointer, extractionRuleId, extractionRuleVersion: '1',
      normalizationSteps: ['NFC_STRING_NORMALIZATION', 'LEXICOGRAPHIC_OBJECT_KEY_CANONICALIZATION'],
      lossPosture: 'LOSSLESS', originalValueReconstructible: true
    }
  };
  const canonicalFactId = `D2SF_${digest(factIdentityPayload(base))}`;
  return {
    ...base,
    canonicalFactId,
    coexistenceKey: `${subjectIdentity}|${predicateIdentity}`,
    deterministicOrderKey: `D2S|${sourceOccurrenceIdentity}|${subjectIdentity}|${predicateIdentity}|${canonicalFactId}`
  };
}

export function buildInventories(contract, input) {
  const core = input.t2Receipt.constructionDigest.constructionCore;
  const sourceRecords = [
    ...core.sourceRecords.map((record, index) => ({
      recordId: `T2_SOURCE_${String(index + 1).padStart(2, '0')}`, kind: 'TOOL_SOURCE', commit: EXPECTED.t2Head,
      path: record.path, gitBlob: record.gitBlob, byteLength: record.byteLength, sha256: record.sha256
    })),
    { recordId: 'T2_CONSTRUCTION_RECEIPT', kind: 'CONSTRUCTION_RECEIPT', commit: EXPECTED.t2Head, path: contract.t2InstrumentOccurrence.receiptPath, gitBlob: contract.t2InstrumentOccurrence.receiptGitBlob, byteLength: 0, sha256: EXPECTED.constructionDigest },
    { recordId: 'T3_VALIDATION_RECEIPT', kind: 'VALIDATION_RECEIPT', commit: EXPECTED.t3Commit, path: contract.t3EvidenceOccurrence.receiptPath, gitBlob: contract.t3EvidenceOccurrence.receiptGitBlob, byteLength: 0, sha256: EXPECTED.validationDigest }
  ];
  const nativeEvidenceRecords = [
    { recordId: 'T3_SMOKE_ZIP', kind: 'WORKFLOW_ARTIFACT_ZIP', artifactId: '8620937660', sha256: contract.t3EvidenceOccurrence.smoke.artifactSha256, byteLength: contract.t3EvidenceOccurrence.smoke.artifactSizeBytes, executionCommit: EXPECTED.t2Head },
    { recordId: 'T3_BASELINE_ZIP', kind: 'WORKFLOW_ARTIFACT_ZIP', artifactId: '8620971574', sha256: contract.t3EvidenceOccurrence.baseline.artifactSha256, byteLength: contract.t3EvidenceOccurrence.baseline.artifactSizeBytes, executionCommit: EXPECTED.t2Head },
    { recordId: 'T3_FOUR_COMPASS_SMOKE_RECEIPT', kind: 'LANE_EXECUTION_RECEIPT', artifactId: '8620937660', sha256: '34733f90bd0088456a0cccc55aa9e25ffba71b975bdd2dd2eda0b23f625bcad9', byteLength: 7908, executionCommit: EXPECTED.t2Head },
    { recordId: 'T3_HOME_SMOKE_RECEIPT', kind: 'LANE_EXECUTION_RECEIPT', artifactId: '8620937660', sha256: '19d4dce11cb659edaefbe19e7f9052ca01ffca24edf7ae76ab6db158029910b0', byteLength: 2154, executionCommit: EXPECTED.t2Head },
    { recordId: 'T3_FOUR_COMPASS_BASELINE_RECEIPT', kind: 'LANE_EXECUTION_RECEIPT', artifactId: '8620971574', sha256: '3e18d119da1c6d98593721969c44ed8c0a50aa28dac59d12cdc3e170631d93dd', byteLength: 1238980, executionCommit: EXPECTED.t2Head },
    { recordId: 'T3_HOME_BASELINE_RECEIPT', kind: 'LANE_EXECUTION_RECEIPT', artifactId: '8620971574', sha256: '8b777b034abb280782424ec1d5b59f7d5cb639451bbc629e304d25b06ba6373d', byteLength: 81284, executionCommit: EXPECTED.t2Head }
  ];
  return { sourceRecords, nativeEvidenceRecords };
}

export function buildDeltaFacts(contract, input, inventories) {
  const facts = [];
  const add = spec => facts.push(makeFact(spec));
  for (const record of inventories.sourceRecords) add({
    sourceProvenancePointer: record.recordId, sourceOccurrenceIdentity: `git:${record.commit}:${record.path}:${record.gitBlob}`,
    subjectIdentity: record.recordId, predicateIdentity: 'SOURCE_OCCURRENCE', factKind: 'SOURCE_OCCURRENCE_FACT',
    temporalPosture: 'CURRENT_TOOL_EVIDENCE_OCCURRENCE', executionPosture: 'EXECUTION_NOT_APPLICABLE', authorityPosture: 'TOOL_SOURCE_OCCURRENCE',
    valueType: 'STRUCTURED_OBJECT', value: record, extractionRuleId: 'T2_T3_SOURCE_OCCURRENCE_TO_CANONICAL_FACT'
  });
  for (const record of inventories.nativeEvidenceRecords) add({
    sourceProvenancePointer: record.recordId, sourceOccurrenceIdentity: `artifact:${record.artifactId}:${record.sha256}`,
    subjectIdentity: record.recordId, predicateIdentity: 'NATIVE_EVIDENCE_OCCURRENCE', factKind: 'NATIVE_EVIDENCE_OCCURRENCE_FACT',
    valueType: 'STRUCTURED_OBJECT', value: record, extractionRuleId: 'T3_NATIVE_EVIDENCE_OCCURRENCE_TO_CANONICAL_FACT'
  });
  for (const id of EXPECTED.compassIds) add({
    sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`,
    subjectIdentity: id, predicateIdentity: 'CANONICAL_COMPASS_AUTHORITY', factKind: 'AUTHORITY_IDENTITY_FACT',
    authorityPosture: 'CANONICAL_COMPASS_AUTHORITY', valueType: 'BOOLEAN', value: true, extractionRuleId: 'T3_AUTHORITY_SET_TO_CANONICAL_FACT'
  });
  add({ sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`, subjectIdentity: EXPECTED.homeId, predicateIdentity: 'AUXILIARY_NON_COMPASS_CONTROL', factKind: 'AUTHORITY_IDENTITY_FACT', authorityPosture: 'AUXILIARY_NON_COMPASS_CONTROL', valueType: 'BOOLEAN', value: true, extractionRuleId: 'T3_AUXILIARY_AUTHORITY_TO_CANONICAL_FACT' });

  const executionRows = [
    ['FOUR_COMPASS_SMOKE', input.compassSmoke.status, 'FOUR_COMPASS_CORPUS'],
    ['HOME_AUXILIARY_SMOKE', input.homeSmoke.status, 'AUXILIARY_CONTROL'],
    ['FOUR_COMPASS_BASELINE', input.compassBaseline.status, 'FOUR_COMPASS_CORPUS'],
    ['HOME_AUXILIARY_BASELINE', input.homeBaseline.status, 'AUXILIARY_CONTROL']
  ];
  for (const [subject, status, lane] of executionRows) add({ sourceProvenancePointer: subject, sourceOccurrenceIdentity: `execution:${EXPECTED.t2Head}:${subject}`, subjectIdentity: subject, predicateIdentity: 'EXECUTION_STATUS', factKind: 'EXECUTION_FACT', valueType: 'STRING', value: status, extractionRuleId: 'T3_LANE_EXECUTION_STATUS_TO_CANONICAL_FACT' });

  const countFacts = [
    ['FOUR_COMPASS_SMOKE', 'AUTHORITY_COUNT', 4], ['FOUR_COMPASS_SMOKE', 'EXECUTED_COUNT', 4], ['FOUR_COMPASS_SMOKE', 'SCREENSHOT_COUNT', 4],
    ['HOME_AUXILIARY_SMOKE', 'AUTHORITY_COUNT', 1], ['HOME_AUXILIARY_SMOKE', 'EXECUTED_COUNT', 1], ['HOME_AUXILIARY_SMOKE', 'SCREENSHOT_COUNT', 1],
    ['FOUR_COMPASS_BASELINE', 'SCENARIO_COUNT', 8], ['FOUR_COMPASS_BASELINE', 'EXECUTED_SCENARIO_COUNT', 8], ['FOUR_COMPASS_BASELINE', 'CAPTURE_COUNT', 48], ['FOUR_COMPASS_BASELINE', 'HARNESS_FAILURE_COUNT', 0], ['FOUR_COMPASS_BASELINE', 'FINDING_OBSERVATION_COUNT', 8],
    ['HOME_AUXILIARY_BASELINE', 'SCENARIO_COUNT', 2], ['HOME_AUXILIARY_BASELINE', 'EXECUTED_SCENARIO_COUNT', 2], ['HOME_AUXILIARY_BASELINE', 'CAPTURE_COUNT', 8], ['HOME_AUXILIARY_BASELINE', 'HARNESS_FAILURE_COUNT', 0], ['HOME_AUXILIARY_BASELINE', 'FINDING_OBSERVATION_COUNT', 22],
    ['T3_ALL_EVIDENCE', 'VERIFIED_SCREENSHOT_COUNT', 61],
    ['FOUR_COMPASS_FINDINGS', 'INTERACTIVE_ELEMENT_PARTIALLY_CLIPPED_COUNT', 8],
    ['HOME_AUXILIARY_FINDINGS', 'INTERACTIVE_ELEMENT_PARTIALLY_CLIPPED_COUNT', 14],
    ['HOME_AUXILIARY_FINDINGS', 'INTERACTIVE_CONTROL_OVERLAP_COUNT', 8],
    ['MAIN_COMPASS', 'FINDING_OBSERVATION_COUNT', 2], ['ARCHCOIN_COMPASS', 'FINDING_OBSERVATION_COUNT', 2], ['SHOWROOM_COMPASS', 'FINDING_OBSERVATION_COUNT', 0], ['LAWS_COMPASS', 'FINDING_OBSERVATION_COUNT', 4], [EXPECTED.homeId, 'FINDING_OBSERVATION_COUNT', 22]
  ];
  for (const [subject, predicate, value] of countFacts) add({ sourceProvenancePointer: 'T3_EXECUTION_ARTIFACTS', sourceOccurrenceIdentity: `execution:${EXPECTED.t2Head}:T3`, subjectIdentity: subject, predicateIdentity: predicate, factKind: predicate.includes('FINDING') || predicate.includes('CLIPPED') || predicate.includes('OVERLAP') ? 'FINDING_OBSERVATION_FACT' : 'COUNT_FACT', valueType: 'INTEGER', value, unit: 'COUNT', extractionRuleId: 'T3_EXECUTION_COUNT_TO_CANONICAL_FACT' });

  const separationFacts = [
    ['HOME_IN_COMPASS_RECORDS', 0], ['HOME_IN_COMPASS_SUMMARIES', 0], ['HOME_IN_COMPASS_FINDINGS', 0], ['HOME_IN_COMPASS_MANIFEST', 0],
    ['COMPASS_IN_HOME_RECORDS', 0], ['COMPASS_IN_HOME_SUMMARIES', 0], ['COMPASS_IN_HOME_FINDINGS', 0], ['COMPASS_IN_HOME_MANIFEST', 0],
    ['RETIRED_ACTIVE_IDENTITIES_OBSERVED', 0]
  ];
  for (const [predicate, value] of separationFacts) add({ sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`, subjectIdentity: 'T3_LANE_SEPARATION_AUDIT', predicateIdentity: predicate, factKind: 'COUNT_FACT', valueType: 'INTEGER', value, unit: 'COUNT', extractionRuleId: 'T3_LANE_SEPARATION_COUNT_TO_CANONICAL_FACT' });
  add({ sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`, subjectIdentity: 'T3_LANE_SEPARATION_AUDIT', predicateIdentity: 'CROSS_LANE_AGGREGATE_CREATED', factKind: 'LANE_POSTURE_FACT', valueType: 'BOOLEAN', value: false, extractionRuleId: 'T3_LANE_SEPARATION_BOOLEAN_TO_CANONICAL_FACT' });

  const telemetry = input.t3Receipt.telemetryObservations;
  for (const [predicate, value] of [
    ['FOUR_COMPASS_CONSOLE_WARNING_COUNT', telemetry.fourCompassBaselineConsoleWarnings],
    ['FOUR_COMPASS_CONSOLE_ERROR_COUNT', telemetry.fourCompassBaselineConsoleErrors],
    ['FOUR_COMPASS_PAGE_ERROR_COUNT', telemetry.fourCompassBaselinePageErrors],
    ['FOUR_COMPASS_REQUEST_FAILURE_COUNT', telemetry.fourCompassBaselineRequestFailures]
  ]) add({ sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`, subjectIdentity: 'FOUR_COMPASS_BASELINE_TELEMETRY', predicateIdentity: predicate, factKind: 'TELEMETRY_FACT', valueType: 'INTEGER', value, unit: 'COUNT', extractionRuleId: 'T3_TELEMETRY_COUNT_TO_CANONICAL_FACT' });
  add({ sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`, subjectIdentity: 'MAIN_COMPASS', predicateIdentity: 'NONBLOCKING_TELEMETRY_OBSERVATION', factKind: 'TELEMETRY_FACT', valueType: 'STRING', value: telemetry.nonBlockingObservation, executionPosture: 'EXECUTION_STATUS_UNRESOLVED', presencePosture: 'UNRESOLVED', applicabilityPosture: 'APPLICABILITY_UNRESOLVED', extractionRuleId: 'T3_NONBLOCKING_TELEMETRY_TO_CANONICAL_FACT' });
  add({ sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`, subjectIdentity: 'MAIN_COMPASS', predicateIdentity: 'PRODUCT_DEFECT_CLASSIFICATION', factKind: 'APPLICABILITY_FACT', valueType: 'STRING', value: telemetry.productDefectClassification, executionPosture: 'EXECUTION_STATUS_UNRESOLVED', authorityPosture: 'SUPPLEMENT_METADATA_ONLY', applicabilityPosture: 'APPLICABILITY_UNRESOLVED', extractionRuleId: 'T3_DEFECT_NONCLASSIFICATION_TO_CANONICAL_FACT' });

  const lifecycleFacts = [
    ['TOOL_EXECUTION_ACCEPTED', true], ['TOOL_EVIDENCE_ACCEPTED', true], ['TOOL_MERGE_READINESS_ESTABLISHED', false],
    ['TOOL_INSTALLATION_AUTHORIZED', false], ['TOOL_MERGE_AUTHORIZED', false], ['LAWS_REPAIR_AUTHORIZED', false],
    ['PRODUCT_FILES_CHANGED', 0], ['MAIN_CHANGED', false]
  ];
  for (const [predicate, value] of lifecycleFacts) add({ sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`, subjectIdentity: 'METAVERSE_FOUR_COMPASS_BENCHMARK_TOOL_v1', predicateIdentity: predicate, factKind: 'LIFECYCLE_POSTURE_FACT', authorityPosture: 'SUPPLEMENT_METADATA_ONLY', valueType: typeof value === 'boolean' ? 'BOOLEAN' : 'INTEGER', value, unit: typeof value === 'number' ? 'COUNT' : 'NONE', extractionRuleId: 'T3_LIFECYCLE_POSTURE_TO_CANONICAL_FACT' });
  add({ sourceProvenancePointer: 'T3_VALIDATION_RECEIPT', sourceOccurrenceIdentity: `git:${EXPECTED.t3Commit}:T3_RECEIPT`, subjectIdentity: 'T3_VALIDATION', predicateIdentity: 'VALIDATION_DIGEST', factKind: 'NATIVE_EVIDENCE_OCCURRENCE_FACT', valueType: 'HASH', value: EXPECTED.validationDigest, unit: 'SHA256', extractionRuleId: 'T3_VALIDATION_DIGEST_TO_CANONICAL_FACT' });

  facts.sort((a, b) => a.deterministicOrderKey.localeCompare(b.deterministicOrderKey));
  validateDeltaFacts(facts, inventories);
  return facts;
}

export function validateDeltaFacts(facts, inventories) {
  unique(facts.map(f => f.canonicalFactId), 'D2S_FACT_ID_COLLISION');
  unique(facts.map(f => f.deterministicOrderKey), 'D2S_FACT_ORDER_KEY_COLLISION');
  if (facts.some(hasNull)) fail('D2S_GENERIC_NULL_PROHIBITED');
  for (const fact of facts) {
    if (fact.laneId !== EXPECTED.laneId) fail('D2S_NEW_TOP_LEVEL_LANE_PROHIBITED', fact.laneId);
    if (fact.transformationTrace.lossPosture !== 'LOSSLESS' || fact.transformationTrace.originalValueReconstructible !== true || digest(fact.originalValue) !== digest(fact.normalizedValue)) fail('D2S_LOSSY_TRANSFORMATION', fact.canonicalFactId);
    if (fact.canonicalFactId !== `D2SF_${digest(factIdentityPayload(fact))}`) fail('D2S_FACT_ID_MISMATCH', fact.canonicalFactId);
    const text = JSON.stringify(fact);
    if (text.includes('DIMENSION_CLASSIFICATION') || text.includes('DISPOSITION_COMPILATION') || text.includes('DEFECT_ESTABLISHED')) fail('D2S_DOWNSTREAM_AUTHORITY_LEAK', fact.canonicalFactId);
  }
  if (facts.filter(f => f.factKind === 'SOURCE_OCCURRENCE_FACT').length !== inventories.sourceRecords.length) fail('D2S_SOURCE_ACCOUNTING_MISMATCH');
  if (facts.filter(f => f.predicateIdentity === 'NATIVE_EVIDENCE_OCCURRENCE').length !== inventories.nativeEvidenceRecords.length) fail('D2S_EVIDENCE_ACCOUNTING_MISMATCH');
  const compassFacts = facts.filter(f => f.predicateIdentity === 'CANONICAL_COMPASS_AUTHORITY');
  exactArray(compassFacts.map(f => f.subjectIdentity).sort(), [...EXPECTED.compassIds].sort(), 'D2S_COMPASS_FACT_SET_MISMATCH');
  if (compassFacts.some(f => f.subjectIdentity === EXPECTED.homeId)) fail('D2S_HOME_AS_COMPASS_REINTRODUCED');
  const defect = facts.find(f => f.predicateIdentity === 'PRODUCT_DEFECT_CLASSIFICATION');
  if (defect?.normalizedValue !== 'NOT_ESTABLISHED_AT_T3') fail('D2S_FINDING_PROMOTED_TO_DEFECT');
  const mergeReady = facts.find(f => f.predicateIdentity === 'TOOL_MERGE_READINESS_ESTABLISHED');
  if (mergeReady?.normalizedValue !== false) fail('D2S_TOOL_MERGE_READINESS_INFERRED');
  return true;
}

function relation(left, right, relationType, reason) {
  const body = { schemaVersion: 'METAVERSE_3D_CANONICAL_FACT_RELATION_v1', leftFactId: left.canonicalFactId, rightFactId: right.canonicalFactId, relationType, sameScope: false, resolutionPerformed: false, winnerFactId: 'NONE', reason };
  return { ...body, relationId: `D2SR_${digest(body)}` };
}

export function buildDeltaRelations(facts) {
  const t2Static = facts.find(f => f.subjectIdentity === 'T2_CONSTRUCTION_RECEIPT');
  const executionAccepted = facts.find(f => f.predicateIdentity === 'TOOL_EXECUTION_ACCEPTED');
  const compassAuthority = facts.find(f => f.subjectIdentity === 'MAIN_COMPASS' && f.predicateIdentity === 'CANONICAL_COMPASS_AUTHORITY');
  const homeAuthority = facts.find(f => f.subjectIdentity === EXPECTED.homeId && f.predicateIdentity === 'AUXILIARY_NON_COMPASS_CONTROL');
  const findingCount = facts.find(f => f.subjectIdentity === 'FOUR_COMPASS_FINDINGS' && f.predicateIdentity === 'INTERACTIVE_ELEMENT_PARTIALLY_CLIPPED_COUNT');
  const defect = facts.find(f => f.predicateIdentity === 'PRODUCT_DEFECT_CLASSIFICATION');
  const evidenceAccepted = facts.find(f => f.predicateIdentity === 'TOOL_EVIDENCE_ACCEPTED');
  const mergeReady = facts.find(f => f.predicateIdentity === 'TOOL_MERGE_READINESS_ESTABLISHED');
  const relations = [
    relation(t2Static, executionAccepted, 'EXECUTION_POSTURE_DIFFERENCE', 'T2_STATIC_CONSTRUCTION_POSTURE_AND_T3_ACCEPTED_EXECUTION_POSTURE_ARE_DISTINCT_OCCURRENCES'),
    relation(compassAuthority, homeAuthority, 'LANE_POSTURE_DIFFERENCE', 'FOUR_CANONICAL_COMPASSES_AND_HOME_AUXILIARY_CONTROL_REMAIN_SEPARATE_AUTHORITY_PARTITIONS'),
    relation(findingCount, defect, 'OBSERVATION_INTERPRETATION_DIFFERENCE', 'T3_FINDING_OBSERVATIONS_DO_NOT_ESTABLISH_PRODUCT_DEFECT_CLASSIFICATION'),
    relation(evidenceAccepted, mergeReady, 'LIFECYCLE_POSTURE_DIFFERENCE', 'TOOL_EVIDENCE_ACCEPTANCE_DOES_NOT_ESTABLISH_TOOL_MERGE_READINESS')
  ].sort((a, b) => a.relationId.localeCompare(b.relationId));
  unique(relations.map(r => r.relationId), 'D2S_RELATION_ID_COLLISION');
  return relations;
}
