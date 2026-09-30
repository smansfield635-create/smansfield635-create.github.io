import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(here, 'metaverse-3d-benchmark-disposition-d1-contract.json');

const EXPECTED = Object.freeze({
  contractId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_NATIVE_EVIDENCE_INTAKE_AND_IDENTITY_VALIDATION_D1_v1',
  toolId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_v1',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/metaverse-3d-benchmark-disposition-compiler-d1-001',
  parent: '5f505fd1caca9f85a5ef9aad9b2f863e291ee5ed',
  laneIds: [
    'FOUR_COMPASS_PRODUCTION_BENCHMARK_CORPUS',
    'UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE',
    'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE'
  ],
  compassIds: ['MAIN_COMPASS', 'ARCHCOIN_COMPASS', 'SHOWROOM_COMPASS', 'LAWS_COMPASS'],
  prototypeCommit: '775ae01438820abecd8bfc242d186ef1342fe9d6',
  prototypeHistoricalExecutionCommit: '9b9e2ec306ce8fb9944d4c129b2967dfa3df4957',
  awarenessPackageCommit: 'd9e88e6cb1a9feccacc617b5d56d944a77979689',
  awarenessInspectedCommit: 'febf7ac9ca0bd69c791b70d3f914bbfff5403c1d',
  reconciliationCommit: 'a06f5ff8ab5c687d3c849d6944e4bdcc68490af8'
});

const fail = (code, details = null) => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;

export const digest = value =>
  createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');

const exactArray = (actual, expected, code) => {
  if (!Array.isArray(actual) || actual.length !== expected.length ||
      actual.some((value, index) => value !== expected[index])) {
    fail(code, { actual, expected });
  }
};

const unique = (values, code) => {
  if (new Set(values).size !== values.length) fail(code, values);
};

export async function readD1Contract() {
  return JSON.parse(await readFile(contractPath, 'utf8'));
}

export function validateD1Contract(contract) {
  if (!contract || typeof contract !== 'object') fail('D1_CONTRACT_REQUIRED');
  if (contract.contractId !== EXPECTED.contractId) fail('D1_CONTRACT_ID_MISMATCH');
  if (contract.toolId !== EXPECTED.toolId) fail('D1_TOOL_ID_MISMATCH');
  if (contract.repository !== EXPECTED.repository) fail('D1_REPOSITORY_MISMATCH');
  if (contract.compilerBranch !== EXPECTED.branch) fail('D1_BRANCH_MISMATCH');
  if (contract.parentD0R?.headCommit !== EXPECTED.parent ||
      contract.parentD0R?.status !== 'PASS_CLOSED') {
    fail('D1_PARENT_D0R_MISMATCH');
  }

  const lanes = contract.lanes ?? [];
  exactArray(lanes.map(lane => lane.laneId), EXPECTED.laneIds, 'D1_LANE_SET_MISMATCH');
  unique(lanes.map(lane => lane.laneId), 'D1_DUPLICATE_LANE_ID');

  const corpus = lanes[0];
  if (corpus.sourceHeadCommit !== EXPECTED.reconciliationCommit ||
      corpus.nativeStatus !== 'CURRENT_CONTROLLING_INPUT') {
    fail('D1_CORPUS_TEMPORAL_IDENTITY_MISMATCH');
  }
  if (corpus.canonicalCompassCount !== 4) fail('D1_COMPASS_COUNT_MISMATCH');
  exactArray(corpus.canonicalCompassIds, EXPECTED.compassIds, 'D1_COMPASS_IDS_MISMATCH');
  if (corpus.canonicalCompassIds.includes('HOMEPAGE_COMPASS')) fail('D1_HOME_MUST_NOT_BE_COMPASS');
  exactArray(corpus.auxiliaryControlIds, ['WEBSITE_HOME_RECEIVER_CONTROL'], 'D1_HOME_CONTROL_MISMATCH');
  if ((corpus.sourceRecords ?? []).length !== 8) fail('D1_CORPUS_SOURCE_COUNT_MISMATCH');
  if ((corpus.artifactRecords ?? []).length !== 5) fail('D1_CORPUS_ARTIFACT_COUNT_MISMATCH');

  const prototype = lanes[1];
  if (prototype.sourceHeadCommit !== EXPECTED.prototypeCommit ||
      prototype.nativeStatus !== 'CURRENT_SOURCE_UNEXECUTED') {
    fail('D1_PROTOTYPE_TEMPORAL_IDENTITY_MISMATCH');
  }
  if (prototype.packagePathCount !== 8 || prototype.sourceRecords?.length !== 8) {
    fail('D1_PROTOTYPE_PATH_COUNT_MISMATCH');
  }
  if (prototype.internalRuntimeModuleCount !== 5) fail('D1_INTERNAL_MODULE_COUNT_MISMATCH');
  if (prototype.currentExecution?.sourceCommit !== EXPECTED.prototypeCommit ||
      prototype.currentExecution?.status !== 'NOT_EXECUTED' ||
      prototype.currentExecution?.browserPassEstablished !== false) {
    fail('D1_CURRENT_PROTOTYPE_EXECUTION_POSTURE_MISMATCH');
  }
  if (prototype.historicalExecution?.sourceCommit !== EXPECTED.prototypeHistoricalExecutionCommit ||
      prototype.historicalExecution?.appliesToCurrentSource !== false ||
      prototype.historicalExecution?.status !== 'PASS_HISTORICAL_SOURCE_OCCURRENCE') {
    fail('D1_HISTORICAL_EXECUTION_POSTURE_MISMATCH');
  }

  const awareness = lanes[2];
  if (awareness.packageOccurrenceCommit !== EXPECTED.awarenessPackageCommit ||
      awareness.inspectedRepositoryCommit !== EXPECTED.awarenessInspectedCommit ||
      awareness.nativeStatus !== 'HISTORICAL_BASELINE_ONLY' ||
      awareness.currentAuthority !== false) {
    fail('D1_AWARENESS_TEMPORAL_IDENTITY_MISMATCH');
  }
  if (awareness.packageOccurrenceCommit === awareness.inspectedRepositoryCommit) {
    fail('D1_AWARENESS_COMMITS_CONFLATED');
  }
  if ((awareness.sourceRecords ?? []).length !== 5) fail('D1_AWARENESS_SOURCE_COUNT_MISMATCH');

  for (const record of corpus.sourceRecords ?? []) {
    if (!record[2].startsWith('verification/benchmark-corpus/four-compass-reconciliation-v1/')) {
      fail('D1_CORPUS_PATH_ESCAPE', record);
    }
  }
  for (const record of prototype.sourceRecords ?? []) {
    if (record[1] !== EXPECTED.prototypeCommit ||
        !record[2].startsWith('prototypes/universal-compass/')) {
      fail('D1_PROTOTYPE_LANE_CROSSING', record);
    }
  }
  for (const record of awareness.sourceRecords ?? []) {
    if (record[1] !== EXPECTED.awarenessPackageCommit ||
        !record[2].startsWith('research/project-awareness/')) {
      fail('D1_AWARENESS_LANE_CROSSING', record);
    }
  }

  const sourceRecords = lanes.flatMap(lane =>
    (lane.sourceRecords ?? []).map(record => `${lane.laneId}:${record[2]}`));
  unique(sourceRecords, 'D1_DUPLICATE_SOURCE_RECORD');
  if (sourceRecords.length !== 21 || contract.claims?.sourceRecordCount !== 21) {
    fail('D1_TOTAL_SOURCE_COUNT_MISMATCH');
  }

  exactArray(contract.nativeStatusVocabulary, [
    'CURRENT_CONTROLLING_INPUT',
    'CURRENT_SOURCE_UNEXECUTED',
    'HISTORICAL_BASELINE_ONLY',
    'PASS_HISTORICAL_SOURCE_OCCURRENCE'
  ], 'D1_NATIVE_STATUS_VOCABULARY_MISMATCH');

  const requiredSeparation = [
    'FOUR_COMPASS_BENCHMARK_CORPUS_NE_UNIVERSAL_COMPASS_PROTOTYPE',
    'FIVE_INTERNAL_RUNTIME_MODULES_NE_FIVE_COMPASS_AUTHORITIES',
    'HISTORICAL_EXECUTION_PASS_NE_CURRENT_SOURCE_EXECUTION_PASS',
    'AWARENESS_PACKAGE_OCCURRENCE_COMMIT_NE_INSPECTED_REPOSITORY_COMMIT'
  ];
  for (const law of requiredSeparation) {
    if (!contract.separationLaws?.includes(law)) fail('D1_SEPARATION_LAW_MISSING', law);
  }

  const prohibited = new Set(contract.prohibitedOperations ?? []);
  for (const operation of [
    'CROSS_LANE_EVIDENCE_TRANSFER',
    'TREAT_PROTOTYPE_AS_FIFTH_COMPASS',
    'PROJECT_HISTORICAL_ROUTE_SHELL_PASS_TO_CURRENT_PROTOTYPE',
    'TREAT_PROJECT_AWARENESS_V1_AS_CURRENT',
    'NORMALIZE_EVIDENCE',
    'CLASSIFY_DIMENSIONS',
    'COMPILE_DISPOSITIONS',
    'EDIT_PRODUCT_SOURCE',
    'MERGE'
  ]) {
    if (!prohibited.has(operation)) fail('D1_PROHIBITION_MISSING', operation);
  }

  if (contract.claims?.laneCount !== 3 ||
      contract.claims?.nativeEvidenceRecordCount !== 7 ||
      contract.claims?.evidenceNormalizationPerformed !== false ||
      contract.claims?.dimensionClassificationPerformed !== false ||
      contract.claims?.dispositionCompilationPerformed !== false ||
      contract.claims?.productFilesChanged !== 0 ||
      contract.claims?.mergePerformed !== false) {
    fail('D1_BOUNDARY_CLAIMS_MISMATCH');
  }

  return true;
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function remoteHead(branch) {
  const output = git(['ls-remote', 'origin', `refs/heads/${branch}`]);
  if (!output) fail('D1_REMOTE_BRANCH_MISSING', branch);
  return output.split(/\s+/)[0];
}

function blobAt(commit, path) {
  return git(['rev-parse', `${commit}:${path}`]);
}

function textAt(commit, path) {
  return execFileSync('git', ['show', `${commit}:${path}`], { encoding: 'utf8' });
}

function verifyRemoteHeads(contract) {
  const checks = contract.lanes.map(lane => {
    const expected = lane.sourceHeadCommit ?? lane.packageOccurrenceCommit;
    const actual = remoteHead(lane.sourceBranch);
    if (actual !== expected) {
      fail('D1_REMOTE_HEAD_DRIFT', { laneId: lane.laneId, actual, expected });
    }
    return { laneId: lane.laneId, branch: lane.sourceBranch, headCommit: actual };
  });
  return checks;
}

function verifySourceRecords(contract) {
  const manifest = [];
  for (const lane of contract.lanes) {
    for (const [recordId, commit, path, expectedBlob] of lane.sourceRecords ?? []) {
      const actualBlob = blobAt(commit, path);
      if (actualBlob !== expectedBlob) {
        fail('D1_SOURCE_BLOB_MISMATCH', {
          laneId: lane.laneId, recordId, commit, path, actualBlob, expectedBlob
        });
      }
      manifest.push({
        laneId: lane.laneId,
        recordId,
        commit,
        path,
        gitBlob: actualBlob,
        nativeStatus: lane.nativeStatus
      });
    }
  }
  return manifest;
}

function verifyR7ArtifactCustody(contract) {
  const corpus = contract.lanes[0];
  const r7Record = corpus.sourceRecords.find(record => record[0] === 'R7');
  const r7 = JSON.parse(textAt(r7Record[1], r7Record[2]));
  const inventory = [];
  for (const [recordId, artifactId, artifactSha256] of corpus.artifactRecords) {
    const source = r7.rawArtifactAudit?.[recordId];
    if (!source) fail('D1_R7_ARTIFACT_RECORD_MISSING', recordId);
    if (String(source.artifactId) !== artifactId || source.zipSha256 !== artifactSha256) {
      fail('D1_R7_ARTIFACT_CUSTODY_MISMATCH', { recordId, source, artifactId, artifactSha256 });
    }
    inventory.push({
      laneId: corpus.laneId,
      recordId,
      artifactId,
      artifactSha256,
      custodyAuthorityCommit: corpus.sourceHeadCommit,
      nativeStatus: corpus.nativeStatus
    });
  }
  return inventory;
}

function verifyAwarenessInspectedCommit(contract) {
  const awareness = contract.lanes[2];
  const registry = awareness.sourceRecords.find(record => record[0] === 'SOURCE_REGISTRY');
  const text = textAt(registry[1], registry[2]);
  const marker = `export const INSPECTED_COMMIT = "${awareness.inspectedRepositoryCommit}"`;
  if (!text.includes(marker)) fail('D1_AWARENESS_INSPECTED_COMMIT_DECLARATION_MISMATCH');
  return {
    laneId: awareness.laneId,
    packageOccurrenceCommit: awareness.packageOccurrenceCommit,
    inspectedRepositoryCommit: awareness.inspectedRepositoryCommit,
    commitsDistinct: awareness.packageOccurrenceCommit !== awareness.inspectedRepositoryCommit
  };
}

export function buildD1Receipt(contract) {
  validateD1Contract(contract);
  const remoteHeads = verifyRemoteHeads(contract);
  const sourceManifest = verifySourceRecords(contract);
  const corpusArtifacts = verifyR7ArtifactCustody(contract);
  const awarenessTemporalIdentity = verifyAwarenessInspectedCommit(contract);

  const prototype = contract.lanes[1];
  const awareness = contract.lanes[2];
  const nativeEvidenceInventory = [
    ...corpusArtifacts,
    {
      laneId: prototype.laneId,
      recordId: 'HISTORICAL_ROUTE_SHELL_EXECUTION',
      ...prototype.historicalExecution,
      nativeStatus: prototype.historicalExecution.status
    },
    {
      laneId: awareness.laneId,
      recordId: 'PROJECT_AWARENESS_V1_VALIDATION',
      ...awareness.historicalValidation,
      nativeStatus: awareness.nativeStatus
    }
  ];

  const laneSummaries = contract.lanes.map(lane => ({
    laneId: lane.laneId,
    laneKind: lane.laneKind,
    nativeStatus: lane.nativeStatus,
    sourceRecordCount: lane.sourceRecords.length,
    sourceCommit: lane.sourceHeadCommit ?? lane.packageOccurrenceCommit,
    currentAuthority: lane.currentAuthority ?? (lane.nativeStatus === 'CURRENT_CONTROLLING_INPUT')
  }));

  const body = {
    schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D1_RECEIPT_v1',
    contractId: contract.contractId,
    toolId: contract.toolId,
    checkpoint: 'D1',
    status: 'PASS',
    parentD0R: contract.parentD0R,
    remoteHeads,
    laneSummaries,
    sourceManifest,
    sourceManifestSha256: digest(sourceManifest),
    nativeEvidenceInventory,
    nativeEvidenceInventorySha256: digest(nativeEvidenceInventory),
    awarenessTemporalIdentity,
    claims: {
      threeLaneIntakeEstablished: true,
      fourCompassCorpusCurrent: true,
      universalCompassPrototypeSeparate: true,
      universalCompassCurrentBrowserPassEstablished: false,
      projectAwarenessV1HistoricalOnly: true,
      crossLaneEvidenceTransferPerformed: false,
      evidenceNormalizationPerformed: false,
      dimensionClassificationPerformed: false,
      dispositionCompilationPerformed: false,
      productFilesChanged: 0,
      mergePerformed: false
    }
  };

  return Object.freeze({
    ...body,
    deterministicReceiptSha256: digest(body)
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const contract = await readD1Contract();
  process.stdout.write(`${JSON.stringify(buildD1Receipt(contract), null, 2)}\n`);
}
