import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(here, 'metaverse-3d-benchmark-disposition-d2-contract.json');
const defaultD1Root = resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d1-input');
const d1Root = process.env.D1_ARTIFACT_ROOT
  ? resolve(process.env.D1_ARTIFACT_ROOT)
  : defaultD1Root;

const EXPECTED = Object.freeze({
  contractId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_CANONICAL_EVIDENCE_FACT_NORMALIZATION_D2_v1',
  toolId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_v1',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/metaverse-3d-benchmark-disposition-compiler-d2-001',
  parentD1: '15ae6cfdd2b6929c06c4fac8905d5b201548b5a0',
  parentContractBlob: 'b83228120ccea9241ad20e5d224c091f4a548f1f',
  d1ArtifactId: '8620403379',
  d1ArtifactSha256: '4ea337358b5d9f9b1c5a3b11e492fe1930f8563b00df796266d5032bf2769b71',
  sourceManifestSha256: 'a61acb81a838e3b37c2fcffc7bba3cd94eb2c36cd8c9a39f3483602da59601bc',
  nativeEvidenceInventorySha256: '5e9814e39125a4f18ec415e8ec46bdc716f1259474ad2528806f95e0f2317c7e',
  intakeReceiptSha256: 'ef5cb1a19cee6940c4c6403ae824708d02844c04ec625e346ec8660cf482c286',
  aggregateReceiptSha256: 'ec59dec1f54721e1ac5fa070f0142031366253d9289fc34ed579b29a21879fd9',
  laneIds: [
    'FOUR_COMPASS_PRODUCTION_BENCHMARK_CORPUS',
    'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE',
    'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE'
  ],
  compassIds: ['MAIN_COMPASS', 'ARCHCOIN_COMPASS', 'SHOWROOM_COMPASS', 'LAWS_COMPASS'],
  sourceRecordCount: 21,
  nativeEvidenceRecordCount: 7,
  canonicalFactCount: 47,
  coexistenceRelationCount: 3
});

const fail = (code, details = 'NONE') => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

const normalizeString = value => value.normalize('NFC');

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [normalizeString(key), stable(value[key])]))
    : typeof value === 'string'
      ? normalizeString(value)
      : value;

export const digest = value => createHash('sha256')
  .update(JSON.stringify(stable(value)))
  .digest('hex');

const exactArray = (actual, expected, code) => {
  if (!Array.isArray(actual) || actual.length !== expected.length ||
      actual.some((value, index) => value !== expected[index])) {
    fail(code, { actual, expected });
  }
};

const unique = (values, code) => {
  if (new Set(values).size !== values.length) fail(code, values);
};

const hasNull = value => value === null ||
  (Array.isArray(value) && value.some(hasNull)) ||
  (value && typeof value === 'object' && Object.values(value).some(hasNull));

const readJson = async path => JSON.parse(await readFile(path, 'utf8'));

export async function readD2Contract() {
  return readJson(contractPath);
}

export async function readD1Package() {
  const [sourceManifest, nativeEvidenceInventory, intakeReceipt, aggregateReceipt] = await Promise.all([
    readJson(resolve(d1Root, 'source-manifest.json')),
    readJson(resolve(d1Root, 'native-evidence-inventory.json')),
    readJson(resolve(d1Root, 'intake.receipt.json')),
    readJson(resolve(d1Root, 'aggregate.receipt.json'))
  ]);
  return { sourceManifest, nativeEvidenceInventory, intakeReceipt, aggregateReceipt };
}

export function validateD2Contract(contract) {
  if (!contract || typeof contract !== 'object') fail('D2_CONTRACT_REQUIRED');
  if (contract.contractId !== EXPECTED.contractId) fail('D2_CONTRACT_ID_MISMATCH');
  if (contract.toolId !== EXPECTED.toolId) fail('D2_TOOL_ID_MISMATCH');
  if (contract.repository !== EXPECTED.repository) fail('D2_REPOSITORY_MISMATCH');
  if (contract.compilerBranch !== EXPECTED.branch) fail('D2_BRANCH_MISMATCH');
  if (contract.checkpoint !== 'D2' || contract.checkpointTitle !== 'CANONICAL_EVIDENCE_FACT_NORMALIZATION') {
    fail('D2_CHECKPOINT_IDENTITY_MISMATCH');
  }
  if (contract.parentD1?.headCommit !== EXPECTED.parentD1 ||
      contract.parentD1?.contractGitBlob !== EXPECTED.parentContractBlob ||
      contract.parentD1?.status !== 'PASS_CLOSED' ||
      contract.parentD1?.pullRequestState !== 'OPEN_DRAFT_UNMERGED') {
    fail('D2_PARENT_D1_IDENTITY_MISMATCH');
  }
  if (String(contract.parentD1?.artifactId) !== EXPECTED.d1ArtifactId ||
      contract.parentD1?.artifactSha256 !== EXPECTED.d1ArtifactSha256 ||
      contract.parentD1?.sourceManifestSha256 !== EXPECTED.sourceManifestSha256 ||
      contract.parentD1?.nativeEvidenceInventorySha256 !== EXPECTED.nativeEvidenceInventorySha256 ||
      contract.parentD1?.intakeReceiptSha256 !== EXPECTED.intakeReceiptSha256 ||
      contract.parentD1?.aggregateReceiptSha256 !== EXPECTED.aggregateReceiptSha256) {
    fail('D2_D1_PACKAGE_CUSTODY_MISMATCH');
  }

  exactArray(contract.lockedInputs?.laneIds, EXPECTED.laneIds, 'D2_LANE_SET_MISMATCH');
  exactArray(contract.lockedInputs?.canonicalCompassIds, EXPECTED.compassIds, 'D2_COMPASS_SET_MISMATCH');
  exactArray(contract.lockedInputs?.auxiliaryControlIds, ['WEBSITE_HOME_RECEIVER_CONTROL'], 'D2_AUXILIARY_CONTROL_SET_MISMATCH');
  if (contract.lockedInputs?.sourceRecordCount !== EXPECTED.sourceRecordCount ||
      contract.lockedInputs?.nativeEvidenceRecordCount !== EXPECTED.nativeEvidenceRecordCount ||
      contract.lockedInputs?.prototypePackagePathCount !== 8 ||
      contract.lockedInputs?.prototypeInternalRuntimeModuleCount !== 5) {
    fail('D2_INPUT_CARDINALITY_MISMATCH');
  }
  if (contract.lockedInputs?.currentPrototypeExecutionStatus !== 'NOT_EXECUTED' ||
      contract.lockedInputs?.historicalPrototypeExecutionAppliesToCurrent !== false ||
      contract.lockedInputs?.awarenessCurrentAuthority !== false) {
    fail('D2_TEMPORAL_EXECUTION_LOCK_MISMATCH');
  }
  if (contract.lockedInputs?.awarenessPackageOccurrenceCommit ===
      contract.lockedInputs?.awarenessInspectedRepositoryCommit) {
    fail('D2_AWARENESS_COMMIT_CONFLATION');
  }

  const requiredPaths = [
    '.github/workflows/metaverse-3d-benchmark-disposition-d2.yml',
    'tools/metaverse-3d-benchmark-disposition-d2-contract.json',
    'tools/metaverse-3d-benchmark-disposition-d2-normalize.mjs',
    'tools/metaverse-3d-benchmark-disposition-d2-controls.mjs'
  ];
  exactArray(contract.authorizedCheckpointPaths, requiredPaths, 'D2_AUTHORIZED_PATH_SET_MISMATCH');

  const requiredFields = contract.canonicalFactSchema?.requiredFields ?? [];
  for (const field of [
    'canonicalFactId', 'laneId', 'sourceProvenancePointer', 'sourceOccurrenceIdentity',
    'temporalPosture', 'executionPosture', 'originalValue', 'normalizedValue',
    'presencePosture', 'applicabilityPosture', 'transformationTrace', 'deterministicOrderKey'
  ]) {
    if (!requiredFields.includes(field)) fail('D2_CANONICAL_SCHEMA_FIELD_MISSING', field);
  }

  if (contract.normalizationRules?.representationOnly !== true ||
      contract.normalizationRules?.meaningResolutionPerformed !== false ||
      contract.normalizationRules?.genericNullAllowed !== false ||
      contract.normalizationRules?.lossyTransformationAllowed !== false ||
      contract.normalizationRules?.originalValuePreserved !== true ||
      contract.normalizationRules?.reversibleTransformationTraceRequired !== true) {
    fail('D2_NORMALIZATION_RULE_MISMATCH');
  }
  if (contract.coexistenceRules?.winnerSelection !== false ||
      contract.coexistenceRules?.sameScopeConflictPreserved !== true ||
      contract.coexistenceRules?.historicalPassProjectedToCurrentSource !== false) {
    fail('D2_COEXISTENCE_RULE_MISMATCH');
  }

  const prohibited = new Set(contract.prohibitedOperations ?? []);
  for (const operation of [
    'CROSS_LANE_EVIDENCE_TRANSFER',
    'PROJECT_HISTORICAL_ROUTE_SHELL_PASS_TO_CURRENT_PROTOTYPE',
    'PROMOTE_PROJECT_AWARENESS_V1_TO_CURRENT',
    'TREAT_PROTOTYPE_AS_FIFTH_COMPASS',
    'TREAT_HOME_AS_COMPASS',
    'SELECT_FACT_WINNER',
    'RESOLVE_CONTRADICTIONS',
    'CLASSIFY_BENCHMARK_DIMENSIONS',
    'COMPILE_DISPOSITIONS',
    'EDIT_PRODUCT_SOURCE',
    'MERGE',
    'GRANT_USER_ACCEPTANCE'
  ]) {
    if (!prohibited.has(operation)) fail('D2_PROHIBITION_MISSING', operation);
  }

  const claims = contract.claims ?? {};
  if (claims.d1ClosedPackageIsSoleInput !== true ||
      claims.canonicalEvidenceFactNormalizationPerformed !== true ||
      claims.contradictionResolutionPerformed !== false ||
      claims.dimensionClassificationPerformed !== false ||
      claims.evidenceWeightingPerformed !== false ||
      claims.dispositionCompilationPerformed !== false ||
      claims.productFilesChanged !== 0 ||
      claims.mergePerformed !== false ||
      claims.userAcceptanceGranted !== false) {
    fail('D2_BOUNDARY_CLAIMS_MISMATCH');
  }
  if (contract.nextCheckpoint !== 'D3_CANONICAL_BENCHMARK_DIMENSION_CLASSIFICATION') {
    fail('D2_NEXT_CHECKPOINT_MISMATCH');
  }
  return true;
}

export function validateD1Package(contract, pkg) {
  const { sourceManifest, nativeEvidenceInventory, intakeReceipt, aggregateReceipt } = pkg;
  if (sourceManifest.schema !== 'METAVERSE_3D_BENCHMARK_DISPOSITION_D1_SOURCE_MANIFEST_v1' ||
      sourceManifest.checkpoint !== 'D1' ||
      sourceManifest.sourceRecordCount !== EXPECTED.sourceRecordCount ||
      sourceManifest.sourceManifestSha256 !== EXPECTED.sourceManifestSha256 ||
      digest(sourceManifest.records) !== EXPECTED.sourceManifestSha256) {
    fail('D2_D1_SOURCE_MANIFEST_MISMATCH');
  }
  if (nativeEvidenceInventory.schema !== 'METAVERSE_3D_BENCHMARK_DISPOSITION_D1_NATIVE_EVIDENCE_INVENTORY_v1' ||
      nativeEvidenceInventory.checkpoint !== 'D1' ||
      nativeEvidenceInventory.nativeEvidenceRecordCount !== EXPECTED.nativeEvidenceRecordCount ||
      nativeEvidenceInventory.nativeEvidenceInventorySha256 !== EXPECTED.nativeEvidenceInventorySha256 ||
      digest(nativeEvidenceInventory.records) !== EXPECTED.nativeEvidenceInventorySha256) {
    fail('D2_D1_NATIVE_EVIDENCE_INVENTORY_MISMATCH');
  }
  const { deterministicReceiptSha256: intakeDigest, ...intakeBody } = intakeReceipt;
  if (intakeReceipt.schema !== 'METAVERSE_3D_BENCHMARK_DISPOSITION_D1_RECEIPT_v1' ||
      intakeReceipt.status !== 'PASS' ||
      intakeDigest !== EXPECTED.intakeReceiptSha256 ||
      digest(intakeBody) !== EXPECTED.intakeReceiptSha256 ||
      intakeReceipt.sourceManifestSha256 !== EXPECTED.sourceManifestSha256 ||
      intakeReceipt.nativeEvidenceInventorySha256 !== EXPECTED.nativeEvidenceInventorySha256 ||
      digest(intakeReceipt.sourceManifest) !== EXPECTED.sourceManifestSha256 ||
      digest(intakeReceipt.nativeEvidenceInventory) !== EXPECTED.nativeEvidenceInventorySha256) {
    fail('D2_D1_INTAKE_RECEIPT_MISMATCH');
  }
  const { deterministicReceiptSha256: aggregateDigest, ...aggregateBody } = aggregateReceipt;
  if (aggregateReceipt.schema !== 'METAVERSE_3D_BENCHMARK_DISPOSITION_D1_CONTROL_RECEIPT_v1' ||
      aggregateReceipt.status !== 'PASS' ||
      aggregateReceipt.controlCount !== 21 ||
      aggregateReceipt.passedControlCount !== 21 ||
      aggregateDigest !== EXPECTED.aggregateReceiptSha256 ||
      digest(aggregateBody) !== EXPECTED.aggregateReceiptSha256 ||
      aggregateReceipt.intakeReceipt?.deterministicReceiptSha256 !== EXPECTED.intakeReceiptSha256) {
    fail('D2_D1_AGGREGATE_RECEIPT_MISMATCH');
  }

  exactArray(intakeReceipt.laneSummaries?.map(lane => lane.laneId), EXPECTED.laneIds, 'D2_D1_LANE_ORDER_MISMATCH');
  const laneCounts = Object.fromEntries(EXPECTED.laneIds.map(laneId => [laneId, 0]));
  for (const record of sourceManifest.records) {
    if (!(record.laneId in laneCounts)) fail('D2_D1_UNKNOWN_SOURCE_LANE', record);
    laneCounts[record.laneId] += 1;
    if (!/^[0-9a-f]{40}$/.test(record.commit) || !/^[0-9a-f]{40}$/.test(record.gitBlob)) {
      fail('D2_D1_SOURCE_IDENTITY_FORMAT_MISMATCH', record);
    }
    if (record.laneId === EXPECTED.laneIds[0] &&
        !record.path.startsWith('verification/benchmark-corpus/four-compass-reconciliation-v1/')) {
      fail('D2_D1_CORPUS_PATH_ESCAPE', record);
    }
    if (record.laneId === EXPECTED.laneIds[1] &&
        !record.path.startsWith('prototypes/universal-compass/')) {
      fail('D2_D1_PROTOTYPE_PATH_ESCAPE', record);
    }
    if (record.laneId === EXPECTED.laneIds[2] &&
        !record.path.startsWith('research/project-awareness/')) {
      fail('D2_D1_AWARENESS_PATH_ESCAPE', record);
    }
  }
  if (laneCounts[EXPECTED.laneIds[0]] !== 8 ||
      laneCounts[EXPECTED.laneIds[1]] !== 8 ||
      laneCounts[EXPECTED.laneIds[2]] !== 5) {
    fail('D2_D1_SOURCE_LANE_CARDINALITY_MISMATCH', laneCounts);
  }

  const evidenceCounts = Object.fromEntries(EXPECTED.laneIds.map(laneId => [laneId, 0]));
  for (const record of nativeEvidenceInventory.records) {
    if (!(record.laneId in evidenceCounts)) fail('D2_D1_UNKNOWN_EVIDENCE_LANE', record);
    evidenceCounts[record.laneId] += 1;
    if (!/^[0-9a-f]{64}$/.test(record.artifactSha256)) {
      fail('D2_D1_EVIDENCE_DIGEST_FORMAT_MISMATCH', record);
    }
  }
  if (evidenceCounts[EXPECTED.laneIds[0]] !== 5 ||
      evidenceCounts[EXPECTED.laneIds[1]] !== 1 ||
      evidenceCounts[EXPECTED.laneIds[2]] !== 1) {
    fail('D2_D1_EVIDENCE_LANE_CARDINALITY_MISMATCH', evidenceCounts);
  }

  const historicalExecution = nativeEvidenceInventory.records.find(record =>
    record.recordId === 'HISTORICAL_ROUTE_SHELL_EXECUTION');
  if (historicalExecution?.sourceCommit !== contract.lockedInputs.historicalPrototypeExecutionCommit ||
      historicalExecution?.status !== 'PASS_HISTORICAL_SOURCE_OCCURRENCE' ||
      historicalExecution?.appliesToCurrentSource !== false) {
    fail('D2_D1_HISTORICAL_EXECUTION_POSTURE_MISMATCH');
  }
  if (intakeReceipt.claims?.universalCompassCurrentBrowserPassEstablished !== false ||
      intakeReceipt.claims?.projectAwarenessV1HistoricalOnly !== true ||
      intakeReceipt.claims?.crossLaneEvidenceTransferPerformed !== false ||
      intakeReceipt.claims?.evidenceNormalizationPerformed !== false ||
      intakeReceipt.claims?.dimensionClassificationPerformed !== false ||
      intakeReceipt.claims?.dispositionCompilationPerformed !== false ||
      intakeReceipt.claims?.productFilesChanged !== 0 ||
      intakeReceipt.claims?.mergePerformed !== false) {
    fail('D2_D1_BOUNDARY_MISMATCH');
  }
  if (intakeReceipt.awarenessTemporalIdentity?.packageOccurrenceCommit !==
      contract.lockedInputs.awarenessPackageOccurrenceCommit ||
      intakeReceipt.awarenessTemporalIdentity?.inspectedRepositoryCommit !==
      contract.lockedInputs.awarenessInspectedRepositoryCommit ||
      intakeReceipt.awarenessTemporalIdentity?.commitsDistinct !== true) {
    fail('D2_D1_AWARENESS_TEMPORAL_IDENTITY_MISMATCH');
  }
  return true;
}

const laneOrdinal = new Map(EXPECTED.laneIds.map((value, index) => [value, index]));
const classOrdinal = new Map([
  ['SOURCE_OCCURRENCE_FACT', 0],
  ['NATIVE_EVIDENCE_OCCURRENCE_FACT', 1],
  ['LANE_POSTURE_FACT', 2],
  ['AUTHORITY_IDENTITY_FACT', 3],
  ['EXECUTION_FACT', 4],
  ['COUNT_FACT', 5],
  ['RELATION_FACT', 6],
  ['APPLICABILITY_FACT', 7]
]);
const temporalOrdinal = new Map([
  ['CURRENT_CONTROLLING_OCCURRENCE', 0],
  ['CURRENT_CANDIDATE_OCCURRENCE', 1],
  ['HISTORICAL_OCCURRENCE', 2],
  ['CURRENT_CUSTODY_OF_HISTORICAL_EVIDENCE', 3]
]);
const executionOrdinal = new Map([
  ['EXECUTED_PASS', 0],
  ['NOT_EXECUTED', 1],
  ['EXECUTION_NOT_APPLICABLE', 2],
  ['EXECUTION_STATUS_UNRESOLVED', 3]
]);

const pad = value => String(value).padStart(4, '0');

function factIdentityPayload(fact) {
  return {
    schemaVersion: fact.schemaVersion,
    laneId: fact.laneId,
    sourceOccurrenceIdentity: fact.sourceOccurrenceIdentity,
    subjectIdentity: fact.subjectIdentity,
    predicateIdentity: fact.predicateIdentity,
    factKind: fact.factKind,
    temporalPosture: fact.temporalPosture,
    executionPosture: fact.executionPosture,
    authorityPosture: fact.authorityPosture,
    normalizedValue: fact.normalizedValue,
    unit: fact.unit,
    presencePosture: fact.presencePosture,
    applicabilityPosture: fact.applicabilityPosture
  };
}

function createFact({
  laneId,
  sourceClassOrdinal,
  sourceRecordOrdinal,
  sourceProvenancePointer,
  sourceOccurrenceIdentity,
  subjectIdentity,
  predicateIdentity,
  factKind,
  epistemicPosture,
  observationInterpretationPosture,
  temporalPosture,
  executionPosture,
  authorityPosture,
  valueType,
  value,
  unit = 'NONE',
  presencePosture = 'PRESENT',
  applicabilityPosture = 'APPLICABLE',
  extractionRuleId
}) {
  const originalValue = stable(value);
  const normalizedValue = stable(value);
  const base = {
    schemaVersion: 'METAVERSE_3D_CANONICAL_EVIDENCE_FACT_v1',
    laneId,
    sourceProvenancePointer: stable(sourceProvenancePointer),
    sourceOccurrenceIdentity,
    subjectIdentity,
    predicateIdentity,
    factKind,
    epistemicPosture,
    observationInterpretationPosture,
    temporalPosture,
    executionPosture,
    authorityPosture,
    valueType,
    originalValue,
    normalizedValue,
    unit,
    presencePosture,
    applicabilityPosture,
    transformationTrace: {
      inputRecordIdentity: sourceOccurrenceIdentity,
      extractionRuleId,
      extractionRuleVersion: 'v1',
      normalizationSteps: ['UNICODE_NFC', 'LEXICOGRAPHIC_OBJECT_KEY_ORDER', 'PRESERVE_ARRAY_ORDER'],
      lossPosture: 'LOSSLESS',
      originalValueReconstructible: true
    }
  };
  const canonicalFactId = `D2F_${digest(factIdentityPayload(base))}`;
  const coexistenceKey = `D2K_${digest({ subjectIdentity, predicateIdentity })}`;
  const deterministicOrderKey = [
    pad(laneOrdinal.get(laneId) ?? 9999),
    pad(sourceClassOrdinal),
    pad(sourceRecordOrdinal),
    subjectIdentity,
    predicateIdentity,
    pad(temporalOrdinal.get(temporalPosture) ?? 9999),
    pad(executionOrdinal.get(executionPosture) ?? 9999),
    canonicalFactId
  ].join('|');
  return Object.freeze({ ...base, canonicalFactId, coexistenceKey, deterministicOrderKey });
}

function temporalForLane(laneId) {
  if (laneId === EXPECTED.laneIds[0]) return 'CURRENT_CONTROLLING_OCCURRENCE';
  if (laneId === EXPECTED.laneIds[1]) return 'CURRENT_CANDIDATE_OCCURRENCE';
  return 'HISTORICAL_OCCURRENCE';
}

function sourceExecutionForLane(laneId) {
  return laneId === EXPECTED.laneIds[1] ? 'NOT_EXECUTED' : 'EXECUTION_NOT_APPLICABLE';
}

function D1Pointer(contract, artifactFile, recordId, laneId) {
  return {
    checkpoint: 'D1',
    artifactId: String(contract.parentD1.artifactId),
    artifactSha256: contract.parentD1.artifactSha256,
    artifactFile,
    recordId,
    laneId
  };
}

function D1ContractPointer(contract, recordId, laneId) {
  return {
    checkpoint: 'D1',
    path: contract.parentD1.contractPath,
    gitBlob: contract.parentD1.contractGitBlob,
    recordId,
    laneId
  };
}

export function buildCanonicalFacts(contract, pkg) {
  validateD2Contract(contract);
  validateD1Package(contract, pkg);
  const facts = [];

  pkg.sourceManifest.records.forEach((record, index) => {
    facts.push(createFact({
      laneId: record.laneId,
      sourceClassOrdinal: classOrdinal.get('SOURCE_OCCURRENCE_FACT'),
      sourceRecordOrdinal: index,
      sourceProvenancePointer: D1Pointer(contract, 'source-manifest.json', record.recordId, record.laneId),
      sourceOccurrenceIdentity: `${record.commit}:${record.path}:${record.gitBlob}`,
      subjectIdentity: `SOURCE_RECORD::${record.laneId}::${record.recordId}`,
      predicateIdentity: 'EXACT_SOURCE_OCCURRENCE',
      factKind: 'SOURCE_OCCURRENCE_FACT',
      epistemicPosture: 'VERIFIED_D1_OBSERVATION',
      observationInterpretationPosture: 'OBSERVATION',
      temporalPosture: temporalForLane(record.laneId),
      executionPosture: sourceExecutionForLane(record.laneId),
      authorityPosture: record.nativeStatus,
      valueType: 'STRUCTURED_OBJECT',
      value: {
        recordId: record.recordId,
        commit: record.commit,
        path: record.path,
        gitBlob: record.gitBlob,
        nativeStatus: record.nativeStatus
      },
      extractionRuleId: 'D1_SOURCE_MANIFEST_RECORD_TO_CANONICAL_SOURCE_OCCURRENCE'
    }));
  });

  pkg.nativeEvidenceInventory.records.forEach((record, index) => {
    const isCorpus = record.laneId === EXPECTED.laneIds[0];
    const isPrototypeHistorical = record.recordId === 'HISTORICAL_ROUTE_SHELL_EXECUTION';
    const temporalPosture = isCorpus
      ? 'CURRENT_CUSTODY_OF_HISTORICAL_EVIDENCE'
      : 'HISTORICAL_OCCURRENCE';
    const executionPosture = 'EXECUTED_PASS';
    const sourceOccurrenceIdentity = [
      record.sourceCommit ?? record.custodyAuthorityCommit ?? contract.lockedInputs.awarenessPackageOccurrenceCommit,
      record.workflowRunId ?? 'NO_WORKFLOW_RUN',
      record.artifactId,
      record.artifactSha256
    ].join(':');
    facts.push(createFact({
      laneId: record.laneId,
      sourceClassOrdinal: classOrdinal.get('NATIVE_EVIDENCE_OCCURRENCE_FACT'),
      sourceRecordOrdinal: index,
      sourceProvenancePointer: D1Pointer(contract, 'native-evidence-inventory.json', record.recordId, record.laneId),
      sourceOccurrenceIdentity,
      subjectIdentity: `NATIVE_EVIDENCE::${record.laneId}::${record.recordId}`,
      predicateIdentity: 'EXACT_NATIVE_EVIDENCE_OCCURRENCE',
      factKind: 'NATIVE_EVIDENCE_OCCURRENCE_FACT',
      epistemicPosture: 'VERIFIED_D1_OBSERVATION',
      observationInterpretationPosture: 'OBSERVATION',
      temporalPosture,
      executionPosture,
      authorityPosture: isPrototypeHistorical
        ? 'PASS_HISTORICAL_SOURCE_OCCURRENCE'
        : record.nativeStatus,
      valueType: 'STRUCTURED_OBJECT',
      value: record,
      extractionRuleId: 'D1_NATIVE_EVIDENCE_RECORD_TO_CANONICAL_EVIDENCE_OCCURRENCE'
    }));
  });

  pkg.intakeReceipt.laneSummaries.forEach((lane, index) => {
    facts.push(createFact({
      laneId: lane.laneId,
      sourceClassOrdinal: classOrdinal.get('LANE_POSTURE_FACT'),
      sourceRecordOrdinal: index,
      sourceProvenancePointer: D1Pointer(contract, 'intake.receipt.json', `LANE_SUMMARY_${index}`, lane.laneId),
      sourceOccurrenceIdentity: `${lane.sourceCommit}:LANE_SUMMARY:${lane.laneId}`,
      subjectIdentity: `EVIDENCE_LANE::${lane.laneId}`,
      predicateIdentity: 'LANE_POSTURE',
      factKind: 'LANE_POSTURE_FACT',
      epistemicPosture: 'VERIFIED_D1_OBSERVATION',
      observationInterpretationPosture: 'OBSERVATION',
      temporalPosture: temporalForLane(lane.laneId),
      executionPosture: sourceExecutionForLane(lane.laneId),
      authorityPosture: lane.nativeStatus,
      valueType: 'STRUCTURED_OBJECT',
      value: lane,
      extractionRuleId: 'D1_LANE_SUMMARY_TO_CANONICAL_LANE_POSTURE'
    }));
  });

  contract.lockedInputs.canonicalCompassIds.forEach((compassId, index) => {
    facts.push(createFact({
      laneId: EXPECTED.laneIds[0],
      sourceClassOrdinal: classOrdinal.get('AUTHORITY_IDENTITY_FACT'),
      sourceRecordOrdinal: index,
      sourceProvenancePointer: D1ContractPointer(contract, `CANONICAL_COMPASS_${index}`, EXPECTED.laneIds[0]),
      sourceOccurrenceIdentity: `${contract.parentD1.headCommit}:${contract.parentD1.contractGitBlob}:CANONICAL_COMPASS:${compassId}`,
      subjectIdentity: compassId,
      predicateIdentity: 'CANONICAL_COMPASS_AUTHORITY',
      factKind: 'AUTHORITY_IDENTITY_FACT',
      epistemicPosture: 'D1_DECLARED_METADATA',
      observationInterpretationPosture: 'OBSERVATION',
      temporalPosture: 'CURRENT_CONTROLLING_OCCURRENCE',
      executionPosture: 'EXECUTION_NOT_APPLICABLE',
      authorityPosture: 'CANONICAL_COMPASS_AUTHORITY',
      valueType: 'BOOLEAN',
      value: true,
      extractionRuleId: 'D1_CANONICAL_COMPASS_IDENTITY_TO_CANONICAL_AUTHORITY_FACT'
    }));
  });

  facts.push(createFact({
    laneId: EXPECTED.laneIds[0],
    sourceClassOrdinal: classOrdinal.get('AUTHORITY_IDENTITY_FACT'),
    sourceRecordOrdinal: 4,
    sourceProvenancePointer: D1ContractPointer(contract, 'WEBSITE_HOME_RECEIVER_CONTROL', EXPECTED.laneIds[0]),
    sourceOccurrenceIdentity: `${contract.parentD1.headCommit}:${contract.parentD1.contractGitBlob}:AUXILIARY:WEBSITE_HOME_RECEIVER_CONTROL`,
    subjectIdentity: 'WEBSITE_HOME_RECEIVER_CONTROL',
    predicateIdentity: 'AUXILIARY_NON_COMPASS_CONTROL',
    factKind: 'AUTHORITY_IDENTITY_FACT',
    epistemicPosture: 'D1_DECLARED_METADATA',
    observationInterpretationPosture: 'OBSERVATION',
    temporalPosture: 'CURRENT_CONTROLLING_OCCURRENCE',
    executionPosture: 'EXECUTION_NOT_APPLICABLE',
    authorityPosture: 'AUXILIARY_NON_COMPASS_CONTROL',
    valueType: 'BOOLEAN',
    value: true,
    extractionRuleId: 'D1_AUXILIARY_CONTROL_IDENTITY_TO_CANONICAL_AUTHORITY_FACT'
  }));

  facts.push(createFact({
    laneId: EXPECTED.laneIds[1],
    sourceClassOrdinal: classOrdinal.get('EXECUTION_FACT'),
    sourceRecordOrdinal: 0,
    sourceProvenancePointer: D1ContractPointer(contract, 'CURRENT_PROTOTYPE_EXECUTION', EXPECTED.laneIds[1]),
    sourceOccurrenceIdentity: `${contract.lockedInputs.currentPrototypeCommit}:CURRENT_EXECUTION`,
    subjectIdentity: 'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE',
    predicateIdentity: 'CURRENT_SOURCE_EXECUTION_POSTURE',
    factKind: 'EXECUTION_FACT',
    epistemicPosture: 'D1_DECLARED_METADATA',
    observationInterpretationPosture: 'OBSERVATION',
    temporalPosture: 'CURRENT_CANDIDATE_OCCURRENCE',
    executionPosture: 'NOT_EXECUTED',
    authorityPosture: 'CURRENT_SOURCE_UNEXECUTED',
    valueType: 'STRING',
    value: 'NOT_EXECUTED',
    extractionRuleId: 'D1_CURRENT_PROTOTYPE_EXECUTION_TO_CANONICAL_EXECUTION_FACT'
  }));

  facts.push(createFact({
    laneId: EXPECTED.laneIds[1],
    sourceClassOrdinal: classOrdinal.get('APPLICABILITY_FACT'),
    sourceRecordOrdinal: 0,
    sourceProvenancePointer: D1Pointer(contract, 'native-evidence-inventory.json', 'HISTORICAL_ROUTE_SHELL_EXECUTION', EXPECTED.laneIds[1]),
    sourceOccurrenceIdentity: `${contract.lockedInputs.historicalPrototypeExecutionCommit}:HISTORICAL_EXECUTION_APPLICABILITY`,
    subjectIdentity: 'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE',
    predicateIdentity: 'HISTORICAL_EXECUTION_APPLIES_TO_CURRENT_SOURCE',
    factKind: 'APPLICABILITY_FACT',
    epistemicPosture: 'VERIFIED_D1_OBSERVATION',
    observationInterpretationPosture: 'OBSERVATION',
    temporalPosture: 'HISTORICAL_OCCURRENCE',
    executionPosture: 'EXECUTED_PASS',
    authorityPosture: 'PASS_HISTORICAL_SOURCE_OCCURRENCE',
    valueType: 'BOOLEAN',
    value: false,
    applicabilityPosture: 'NOT_APPLICABLE',
    extractionRuleId: 'D1_HISTORICAL_EXECUTION_APPLICABILITY_TO_CANONICAL_FACT'
  }));

  facts.push(createFact({
    laneId: EXPECTED.laneIds[2],
    sourceClassOrdinal: classOrdinal.get('AUTHORITY_IDENTITY_FACT'),
    sourceRecordOrdinal: 0,
    sourceProvenancePointer: D1ContractPointer(contract, 'AWARENESS_CURRENT_AUTHORITY', EXPECTED.laneIds[2]),
    sourceOccurrenceIdentity: `${contract.lockedInputs.awarenessPackageOccurrenceCommit}:CURRENT_AUTHORITY`,
    subjectIdentity: 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE',
    predicateIdentity: 'CURRENT_AUTHORITY',
    factKind: 'AUTHORITY_IDENTITY_FACT',
    epistemicPosture: 'D1_DECLARED_METADATA',
    observationInterpretationPosture: 'OBSERVATION',
    temporalPosture: 'HISTORICAL_OCCURRENCE',
    executionPosture: 'EXECUTION_NOT_APPLICABLE',
    authorityPosture: 'HISTORICAL_BASELINE_ONLY',
    valueType: 'BOOLEAN',
    value: false,
    extractionRuleId: 'D1_AWARENESS_AUTHORITY_POSTURE_TO_CANONICAL_FACT'
  }));

  facts.push(createFact({
    laneId: EXPECTED.laneIds[2],
    sourceClassOrdinal: classOrdinal.get('RELATION_FACT'),
    sourceRecordOrdinal: 0,
    sourceProvenancePointer: D1Pointer(contract, 'intake.receipt.json', 'AWARENESS_TEMPORAL_IDENTITY', EXPECTED.laneIds[2]),
    sourceOccurrenceIdentity: `${contract.lockedInputs.awarenessPackageOccurrenceCommit}:${contract.lockedInputs.awarenessInspectedRepositoryCommit}:DISTINCT`,
    subjectIdentity: 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE',
    predicateIdentity: 'PACKAGE_OCCURRENCE_AND_INSPECTED_REPOSITORY_COMMITS_DISTINCT',
    factKind: 'RELATION_FACT',
    epistemicPosture: 'VERIFIED_D1_OBSERVATION',
    observationInterpretationPosture: 'OBSERVATION',
    temporalPosture: 'HISTORICAL_OCCURRENCE',
    executionPosture: 'EXECUTION_NOT_APPLICABLE',
    authorityPosture: 'HISTORICAL_BASELINE_ONLY',
    valueType: 'STRUCTURED_OBJECT',
    value: {
      packageOccurrenceCommit: contract.lockedInputs.awarenessPackageOccurrenceCommit,
      inspectedRepositoryCommit: contract.lockedInputs.awarenessInspectedRepositoryCommit,
      commitsDistinct: true
    },
    extractionRuleId: 'D1_AWARENESS_TEMPORAL_IDENTITY_TO_CANONICAL_RELATION_FACT'
  }));

  const countFacts = [
    [EXPECTED.laneIds[0], 'D1_INTAKE', 'SOURCE_RECORD_COUNT', 21],
    [EXPECTED.laneIds[0], 'D1_INTAKE', 'NATIVE_EVIDENCE_RECORD_COUNT', 7],
    [EXPECTED.laneIds[0], 'FOUR_COMPASS_PRODUCTION_BENCHMARK_CORPUS', 'CANONICAL_COMPASS_COUNT', 4],
    [EXPECTED.laneIds[1], 'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE', 'PACKAGE_PATH_COUNT', 8],
    [EXPECTED.laneIds[1], 'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE', 'INTERNAL_RUNTIME_MODULE_COUNT', 5]
  ];
  countFacts.forEach(([laneId, subjectIdentity, predicateIdentity, value], index) => {
    facts.push(createFact({
      laneId,
      sourceClassOrdinal: classOrdinal.get('COUNT_FACT'),
      sourceRecordOrdinal: index,
      sourceProvenancePointer: D1ContractPointer(contract, `COUNT_${predicateIdentity}`, laneId),
      sourceOccurrenceIdentity: `${contract.parentD1.headCommit}:${contract.parentD1.contractGitBlob}:COUNT:${predicateIdentity}`,
      subjectIdentity,
      predicateIdentity,
      factKind: 'COUNT_FACT',
      epistemicPosture: 'D1_DECLARED_METADATA',
      observationInterpretationPosture: 'OBSERVATION',
      temporalPosture: temporalForLane(laneId),
      executionPosture: laneId === EXPECTED.laneIds[1] ? 'NOT_EXECUTED' : 'EXECUTION_NOT_APPLICABLE',
      authorityPosture: laneId === EXPECTED.laneIds[1] ? 'CURRENT_SOURCE_UNEXECUTED' : 'CURRENT_CONTROLLING_INPUT',
      valueType: 'INTEGER',
      value,
      unit: 'COUNT',
      extractionRuleId: 'D1_LOCKED_CARDINALITY_TO_CANONICAL_COUNT_FACT'
    }));
  });

  const relationFacts = [
    ['PROTOTYPE_PACKAGE_PATH_COUNT_EQUALS_CANONICAL_COMPASS_COUNT', false, '8_NE_4'],
    ['PROTOTYPE_INTERNAL_RUNTIME_MODULE_COUNT_EQUALS_CANONICAL_COMPASS_COUNT', false, '5_NE_4']
  ];
  relationFacts.forEach(([predicateIdentity, value, identity], index) => {
    facts.push(createFact({
      laneId: EXPECTED.laneIds[1],
      sourceClassOrdinal: classOrdinal.get('RELATION_FACT'),
      sourceRecordOrdinal: index + 1,
      sourceProvenancePointer: D1ContractPointer(contract, predicateIdentity, EXPECTED.laneIds[1]),
      sourceOccurrenceIdentity: `${contract.parentD1.headCommit}:${contract.parentD1.contractGitBlob}:${identity}`,
      subjectIdentity: 'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE',
      predicateIdentity,
      factKind: 'RELATION_FACT',
      epistemicPosture: 'D2_LOSSLESS_DERIVATION',
      observationInterpretationPosture: 'DERIVATION',
      temporalPosture: 'CURRENT_CANDIDATE_OCCURRENCE',
      executionPosture: 'NOT_EXECUTED',
      authorityPosture: 'NORMALIZATION_METADATA_ONLY',
      valueType: 'BOOLEAN',
      value,
      extractionRuleId: 'D1_LOCKED_COUNTS_TO_NONIDENTITY_RELATION_FACT'
    }));
  });

  facts.sort((left, right) => left.deterministicOrderKey.localeCompare(right.deterministicOrderKey));
  validateCanonicalFacts(contract, pkg, facts);
  return facts;
}

export function validateCanonicalFacts(contract, pkg, facts) {
  if (!Array.isArray(facts) || facts.length !== EXPECTED.canonicalFactCount) {
    fail('D2_CANONICAL_FACT_COUNT_MISMATCH', facts?.length);
  }
  unique(facts.map(fact => fact.canonicalFactId), 'D2_CANONICAL_FACT_ID_COLLISION');
  unique(facts.map(fact => fact.deterministicOrderKey), 'D2_DETERMINISTIC_ORDER_KEY_COLLISION');
  const sorted = [...facts].sort((a, b) => a.deterministicOrderKey.localeCompare(b.deterministicOrderKey));
  exactArray(facts.map(fact => fact.canonicalFactId), sorted.map(fact => fact.canonicalFactId), 'D2_FACT_ORDER_NONDETERMINISTIC');

  const vocabularies = contract.vocabularies;
  for (const fact of facts) {
    if (hasNull(fact)) fail('D2_GENERIC_NULL_PROHIBITED', fact.canonicalFactId);
    for (const [field, vocabulary] of [
      ['factKind', vocabularies.factKind],
      ['epistemicPosture', vocabularies.epistemicPosture],
      ['observationInterpretationPosture', vocabularies.observationInterpretationPosture],
      ['temporalPosture', vocabularies.temporalPosture],
      ['executionPosture', vocabularies.executionPosture],
      ['authorityPosture', vocabularies.authorityPosture],
      ['valueType', vocabularies.valueType],
      ['presencePosture', vocabularies.presencePosture],
      ['applicabilityPosture', vocabularies.applicabilityPosture]
    ]) {
      if (!vocabulary.includes(fact[field])) fail('D2_FACT_VOCABULARY_VIOLATION', { field, fact });
    }
    if (fact.transformationTrace?.lossPosture !== 'LOSSLESS' ||
        fact.transformationTrace?.originalValueReconstructible !== true ||
        digest(fact.originalValue) !== digest(fact.normalizedValue)) {
      fail('D2_LOSSY_OR_NONREVERSIBLE_TRANSFORMATION', fact.canonicalFactId);
    }
    const expectedId = `D2F_${digest(factIdentityPayload(fact))}`;
    if (fact.canonicalFactId !== expectedId) fail('D2_CANONICAL_FACT_ID_MISMATCH', fact.canonicalFactId);
    if (!EXPECTED.laneIds.includes(fact.laneId)) fail('D2_UNKNOWN_FACT_LANE', fact.canonicalFactId);
    if (JSON.stringify(fact).includes('DISPOSITION') || JSON.stringify(fact).includes('DIMENSION_CLASSIFICATION')) {
      fail('D2_DOWNSTREAM_AUTHORITY_LEAK', fact.canonicalFactId);
    }
  }

  const sourceFacts = facts.filter(fact => fact.factKind === 'SOURCE_OCCURRENCE_FACT');
  const evidenceFacts = facts.filter(fact => fact.factKind === 'NATIVE_EVIDENCE_OCCURRENCE_FACT');
  if (sourceFacts.length !== EXPECTED.sourceRecordCount || evidenceFacts.length !== EXPECTED.nativeEvidenceRecordCount) {
    fail('D2_INPUT_TO_FACT_CARDINALITY_MISMATCH');
  }
  const sourceInputs = pkg.sourceManifest.records.map(record => `${record.laneId}:${record.recordId}`).sort();
  const sourceOutputs = sourceFacts.map(fact => `${fact.laneId}:${fact.normalizedValue.recordId}`).sort();
  exactArray(sourceOutputs, sourceInputs, 'D2_SOURCE_INPUT_ACCOUNTING_MISMATCH');
  const evidenceInputs = pkg.nativeEvidenceInventory.records.map(record => `${record.laneId}:${record.recordId}`).sort();
  const evidenceOutputs = evidenceFacts.map(fact => `${fact.laneId}:${fact.normalizedValue.recordId}`).sort();
  exactArray(evidenceOutputs, evidenceInputs, 'D2_EVIDENCE_INPUT_ACCOUNTING_MISMATCH');

  const compassFacts = facts.filter(fact => fact.predicateIdentity === 'CANONICAL_COMPASS_AUTHORITY');
  exactArray(compassFacts.map(fact => fact.subjectIdentity).sort(), [...EXPECTED.compassIds].sort(), 'D2_CANONICAL_COMPASS_FACT_SET_MISMATCH');
  if (compassFacts.some(fact => fact.subjectIdentity === 'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE' ||
      fact.subjectIdentity === 'WEBSITE_HOME_RECEIVER_CONTROL')) {
    fail('D2_FIFTH_OR_HOME_COMPASS_REINTRODUCED');
  }

  const currentExecution = facts.find(fact => fact.predicateIdentity === 'CURRENT_SOURCE_EXECUTION_POSTURE');
  if (currentExecution?.normalizedValue !== 'NOT_EXECUTED' ||
      currentExecution?.executionPosture !== 'NOT_EXECUTED') {
    fail('D2_CURRENT_PROTOTYPE_EXECUTION_PROMOTED');
  }
  const historicalApplicability = facts.find(fact =>
    fact.predicateIdentity === 'HISTORICAL_EXECUTION_APPLIES_TO_CURRENT_SOURCE');
  if (historicalApplicability?.normalizedValue !== false ||
      historicalApplicability?.applicabilityPosture !== 'NOT_APPLICABLE') {
    fail('D2_HISTORICAL_EXECUTION_PROJECTED');
  }
  const awarenessAuthority = facts.find(fact =>
    fact.subjectIdentity === 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE' &&
    fact.predicateIdentity === 'CURRENT_AUTHORITY');
  if (awarenessAuthority?.normalizedValue !== false ||
      awarenessAuthority?.authorityPosture !== 'HISTORICAL_BASELINE_ONLY') {
    fail('D2_AWARENESS_PROMOTED_TO_CURRENT');
  }
  return true;
}

export function buildCoexistenceIndex(contract, facts) {
  const currentExecution = facts.find(fact => fact.predicateIdentity === 'CURRENT_SOURCE_EXECUTION_POSTURE');
  const historicalExecution = facts.find(fact =>
    fact.factKind === 'NATIVE_EVIDENCE_OCCURRENCE_FACT' &&
    fact.normalizedValue.recordId === 'HISTORICAL_ROUTE_SHELL_EXECUTION');
  const canonicalCompassCount = facts.find(fact => fact.predicateIdentity === 'CANONICAL_COMPASS_COUNT');
  const packagePathCount = facts.find(fact => fact.predicateIdentity === 'PACKAGE_PATH_COUNT');
  const runtimeModuleCount = facts.find(fact => fact.predicateIdentity === 'INTERNAL_RUNTIME_MODULE_COUNT');

  const relation = (leftFact, rightFact, relationType, reason) => {
    const body = {
      schemaVersion: 'METAVERSE_3D_CANONICAL_FACT_RELATION_v1',
      leftFactId: leftFact.canonicalFactId,
      rightFactId: rightFact.canonicalFactId,
      relationType,
      sameScope: false,
      resolutionPerformed: false,
      winnerFactId: 'NONE',
      reason
    };
    return { ...body, relationId: `D2R_${digest(body)}` };
  };

  const relations = [
    relation(
      currentExecution,
      historicalExecution,
      'EXECUTION_POSTURE_DIFFERENCE',
      'CURRENT_PROTOTYPE_COMMIT_IS_NOT_EXECUTED_WHILE_PRIOR_SOURCE_COMMIT_HAS_HISTORICAL_PASS'
    ),
    relation(
      canonicalCompassCount,
      packagePathCount,
      'VALUE_DIFFERENCE_DIFFERENT_SCOPE',
      'CANONICAL_COMPASS_AUTHORITY_COUNT_AND_PROTOTYPE_PACKAGE_PATH_COUNT_ARE_DISTINCT_DOMAINS'
    ),
    relation(
      canonicalCompassCount,
      runtimeModuleCount,
      'VALUE_DIFFERENCE_DIFFERENT_SCOPE',
      'CANONICAL_COMPASS_AUTHORITY_COUNT_AND_INTERNAL_RUNTIME_MODULE_COUNT_ARE_DISTINCT_DOMAINS'
    )
  ].sort((a, b) => a.relationId.localeCompare(b.relationId));

  validateCoexistenceIndex(contract, facts, relations);
  return relations;
}

export function validateCoexistenceIndex(contract, facts, relations) {
  if (!Array.isArray(relations) || relations.length !== EXPECTED.coexistenceRelationCount) {
    fail('D2_COEXISTENCE_RELATION_COUNT_MISMATCH', relations?.length);
  }
  unique(relations.map(relation => relation.relationId), 'D2_RELATION_ID_COLLISION');
  const factIds = new Set(facts.map(fact => fact.canonicalFactId));
  for (const relation of relations) {
    if (!contract.vocabularies.factRelation.includes(relation.relationType)) {
      fail('D2_RELATION_VOCABULARY_VIOLATION', relation);
    }
    if (!factIds.has(relation.leftFactId) || !factIds.has(relation.rightFactId)) {
      fail('D2_RELATION_ORPHAN_FACT_REFERENCE', relation);
    }
    if (relation.sameScope !== false || relation.resolutionPerformed !== false || relation.winnerFactId !== 'NONE') {
      fail('D2_WINNER_SELECTION_OR_RESOLUTION_PROHIBITED', relation);
    }
    const { relationId, ...body } = relation;
    if (relationId !== `D2R_${digest(body)}`) fail('D2_RELATION_ID_MISMATCH', relationId);
  }
  const historicalRelation = relations.find(relation => relation.relationType === 'EXECUTION_POSTURE_DIFFERENCE');
  if (!historicalRelation) fail('D2_HISTORICAL_CURRENT_COEXISTENCE_RELATION_MISSING');
  return true;
}

export function buildD2Normalization(contract, pkg) {
  const facts = buildCanonicalFacts(contract, pkg);
  const relations = buildCoexistenceIndex(contract, facts);
  const factManifestSha256 = digest(facts);
  const coexistenceIndexSha256 = digest(relations);

  const factsByLane = Object.fromEntries(EXPECTED.laneIds.map(laneId => [
    laneId,
    facts.filter(fact => fact.laneId === laneId).length
  ]));
  const factsByKind = Object.fromEntries([...new Set(facts.map(fact => fact.factKind))]
    .sort()
    .map(kind => [kind, facts.filter(fact => fact.factKind === kind).length]));
  const factsByTemporalPosture = Object.fromEntries([...new Set(facts.map(fact => fact.temporalPosture))]
    .sort()
    .map(posture => [posture, facts.filter(fact => fact.temporalPosture === posture).length]));
  const factsByExecutionPosture = Object.fromEntries([...new Set(facts.map(fact => fact.executionPosture))]
    .sort()
    .map(posture => [posture, facts.filter(fact => fact.executionPosture === posture).length]));

  const receiptBody = {
    schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2_NORMALIZATION_RECEIPT_v1',
    checkpoint: 'D2',
    status: 'PASS',
    contractId: contract.contractId,
    toolId: contract.toolId,
    parentD1: {
      headCommit: contract.parentD1.headCommit,
      artifactId: String(contract.parentD1.artifactId),
      artifactSha256: contract.parentD1.artifactSha256,
      sourceManifestSha256: contract.parentD1.sourceManifestSha256,
      nativeEvidenceInventorySha256: contract.parentD1.nativeEvidenceInventorySha256,
      intakeReceiptSha256: contract.parentD1.intakeReceiptSha256,
      aggregateReceiptSha256: contract.parentD1.aggregateReceiptSha256
    },
    inputSourceRecordCount: pkg.sourceManifest.sourceRecordCount,
    inputNativeEvidenceRecordCount: pkg.nativeEvidenceInventory.nativeEvidenceRecordCount,
    outputCanonicalFactCount: facts.length,
    outputCoexistenceRelationCount: relations.length,
    factManifestSha256,
    coexistenceIndexSha256,
    factsByLane,
    factsByKind,
    factsByTemporalPosture,
    factsByExecutionPosture,
    transformationCount: facts.length,
    lossyTransformationCount: 0,
    sameScopeConflictCount: 0,
    crossScopeDifferenceCount: relations.length,
    claims: {
      d1ClosedPackageConsumedWithoutRediscovery: true,
      all21SourceRecordsAccountedFor: true,
      all7NativeEvidenceRecordsAccountedFor: true,
      canonicalEvidenceFactNormalizationEstablished: true,
      factProvenanceReversible: true,
      temporalPosturesPreserved: true,
      executionPosturesPreserved: true,
      contradictoryOrDifferingFactsPreserved: true,
      currentPrototypeBrowserPassEstablished: false,
      projectAwarenessV1HistoricalOnly: true,
      crossLaneEvidenceTransferPerformed: false,
      factWinnerSelectionPerformed: false,
      contradictionResolutionPerformed: false,
      dimensionClassificationPerformed: false,
      evidenceWeightingPerformed: false,
      dispositionCompilationPerformed: false,
      productFilesChanged: 0,
      mergePerformed: false,
      userAcceptanceGranted: false
    },
    nextCheckpoint: contract.nextCheckpoint
  };

  return Object.freeze({
    factManifest: Object.freeze({
      schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2_CANONICAL_FACT_MANIFEST_v1',
      checkpoint: 'D2',
      canonicalFactCount: facts.length,
      factManifestSha256,
      records: facts
    }),
    coexistenceIndex: Object.freeze({
      schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2_FACT_COEXISTENCE_INDEX_v1',
      checkpoint: 'D2',
      relationCount: relations.length,
      coexistenceIndexSha256,
      relations
    }),
    normalizationReceipt: Object.freeze({
      ...receiptBody,
      deterministicReceiptSha256: digest(receiptBody)
    })
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const contract = await readD2Contract();
  const pkg = await readD1Package();
  process.stdout.write(`${JSON.stringify(buildD2Normalization(contract, pkg), null, 2)}\n`);
}
