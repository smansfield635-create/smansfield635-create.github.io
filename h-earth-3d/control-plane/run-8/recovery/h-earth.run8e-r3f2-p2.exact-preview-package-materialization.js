import { H_EARTH_RUN_8E_R3F2_P1_CONTRACT, evaluateHEarthRun8ER3F2P1Contract } from './h-earth.run8e-r3f2-p1.immutable-preview-occurrence-contract.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3F2_P2_CONTROL_ID =
  'H_EARTH_RUN_8E_R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZATION_v1';

const PREVIEW_ROOT = 'preview/h-earth/run8e/r3f2/sha256-3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p2.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3F2_P2_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3F2_P2_CONTROL_ID,
  checkpointId: 'RUN_8E_R3F2_P2',
  checkpointName: 'EXACT_PREVIEW_PACKAGE_MATERIALIZATION',
  currentStatus: 'MATERIALIZATION_EXECUTION_OPEN',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3f2-p2-exact-preview-package-materialization-001',
  baseBranch: 'agent/h-earth-run8e-r3f2-p1-immutable-preview-occurrence-contract-001',
  baseExactHead: '7815de03a713414798d5d927038852e6dda210b8',
  predecessor: freeze({
    checkpointId: 'RUN_8E_R3F2_P1',
    status: 'PASS_CLOSED',
    exactHead: '7815de03a713414798d5d927038852e6dda210b8',
    pullRequest: 252,
    passReceiptPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p1.pass-closed.receipt.json',
    passReceiptGitBlob: 'f2d4a9f86153912cbd68be8662873f77854107f4',
    finalWorkflowRun: 30319684523,
    finalWorkflowJob: 90152752134,
    finalArtifactId: 8673503914,
    finalArtifactDigest: 'sha256:254eb975ba9dedbeb197cef1aa1cff2dc08280146916a413906915f6369fa00b'
  }),
  candidateIdentity: freeze({
    candidateId: 'H_EARTH_RUN8E_R3F2_CANDIDATE_SHA256_3020154361523CF19113E4C759C234A6C74FF5A493B8E47124CA59470DA7A234',
    packageHead: 'fcdcb4e80a98a86773d5276447b880efde2099c9',
    packageSha256: 'sha256:3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234',
    packageByteCount: 1213597,
    packageManifestSha256: 'sha256:c74d71c1115b5b122d3d12e56014002bd15201c05af25b7d027e8d9ad88f7174',
    sourceHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445'
  }),
  materializedPreviewTree: freeze({
    repositoryRoot: `/${PREVIEW_ROOT}/`,
    intendedUrlPath: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.immutablePreviewOccurrence.urlPath,
    exactFileCount: 3,
    files: freeze([
      freeze({ relativePath: 'index.html', role: 'EXACT_VALIDATED_SELF_CONTAINED_CANDIDATE', byteCount: 1213597, contentSha256: 'sha256:3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234', gitBlobSha1: 'c5127e2d4d9d3558230a8eccd757dade74d6d8c3' }),
      freeze({ relativePath: 'preview-manifest.json', role: 'SERVED_FILE_AND_CANDIDATE_IDENTITY_MANIFEST', byteCount: 3981, contentSha256: 'sha256:b77b3e88ef4868d0602468da90693c64c46b09442e1fe15013ed4dcf69156dd4', gitBlobSha1: '81dbbb97898023ae0dabea313ac69b865302d533', canonicalPayloadSha256: 'sha256:e2e1aec478a2a391f29e32c983c56408cfad42fe5c47093b07dad5e5ee84591e' }),
      freeze({ relativePath: 'device-evidence-receipt.schema.json', role: 'PHYSICAL_SESSION_NORMALIZED_EVIDENCE_SCHEMA', byteCount: 4586, contentSha256: 'sha256:04ce5ec86f102fb7646b02ad19a3f862b8e6370dcdc971dc252d6bc607e3d18a', gitBlobSha1: '987268f38fc8b6db6f19b982cc8386439aa0de48' })
    ]),
    externalRuntimeRequestCount: 0,
    mutableMainDependencyCount: 0,
    undeclaredRuntimeDependencyCount: 0,
    nonProductionMarkingDeclared: true,
    noIndexIntentDeclared: true,
    identityExposureCount: 6,
    normalizedReceiptRequiredFieldCount: 23
  }),
  authorizedWork: freeze([
    'MATERIALIZE_IMMUTABLE_PREVIEW_DIRECTORY',
    'INSTALL_EXACT_VALIDATED_PACKAGE_BYTES',
    'INSTALL_PREVIEW_MANIFEST',
    'INSTALL_DEVICE_EVIDENCE_RECEIPT_SCHEMA',
    'VERIFY_EXACT_FILE_DIGESTS',
    'VERIFY_ZERO_MUTABLE_RUNTIME_DEPENDENCIES'
  ]),
  prohibitedWork: freeze([
    'PREVIEW_DEPLOYMENT_CONFIGURATION','NETWORK_PUBLICATION','PREVIEW_URL_ISSUANCE',
    'SHOWROOM_MUTATION','PUBLIC_LIVE_H_EARTH_CHANGE','MAIN_MUTATION','RECOVERY_STACK_MERGE',
    'PRODUCTION_DEPLOYMENT','PHYSICAL_REFERENCE_DEVICE_EXECUTION','R3F3_WORK','R3F4_WORK',
    'R3G_WORK','RUN_8E_PASS_CLOSED'
  ]),
  materializationEvidence: null,
  closureEvidence: null,
  boundaries: freeze({
    previewFilesMaterialized: false,
    deploymentConfigurationCreated: false,
    networkPublicationPerformed: false,
    previewUrlIssued: false,
    showroomMutated: false,
    publicLiveHEarthChanged: false,
    mainChanged: false,
    recoveryStackMerged: false,
    productionDeployment: false,
    physicalReferenceDeviceExecuted: false,
    broaderMobileExecuted: false,
    run8EPassClosed: false
  }),
  nextCheckpoint: 'RUN_8E_R3F2_P3_NON_PRODUCTION_PUBLICATION_CONFIGURATION',
  stoppingBoundary: 'STOP_BEFORE_HOSTING_OR_NETWORK_PUBLICATION',
  passReceiptPath: PASS_RECEIPT_PATH
});

export function evaluateHEarthRun8ER3F2P2Control(candidate = H_EARTH_RUN_8E_R3F2_P2_CONTROL) {
  const issues = [];
  const p1 = evaluateHEarthRun8ER3F2P1Contract();
  if (p1.eligible !== true || p1.status !== 'RUN_8E_R3F2_P1_PASS_CLOSED') issues.push(...p1.issues.map((issue) => `P1:${issue}`), 'P1_NOT_PASS_CLOSED');
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3F2_P2_CONTROL_ID) issues.push('P2_CONTROL_ID_MISMATCH');
  if (!['MATERIALIZATION_EXECUTION_OPEN','MATERIALIZED_PENDING_DURABLE_RECEIPT','PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('P2_STATUS_INVALID');
  if (candidate?.baseExactHead !== '7815de03a713414798d5d927038852e6dda210b8') issues.push('P2_BASE_HEAD_MISMATCH');
  if (candidate?.predecessor?.passReceiptGitBlob !== 'f2d4a9f86153912cbd68be8662873f77854107f4') issues.push('P1_RECEIPT_BLOB_MISMATCH');
  if (candidate?.candidateIdentity?.packageSha256 !== 'sha256:3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234') issues.push('P2_PACKAGE_IDENTITY_INVALID');
  const tree = candidate?.materializedPreviewTree ?? {};
  if (tree.repositoryRoot !== `/${PREVIEW_ROOT}/` || tree.exactFileCount !== 3 || tree.files?.length !== 3) issues.push('P2_TREE_CONTRACT_INVALID');
  if (tree.files?.[0]?.contentSha256 !== candidate?.candidateIdentity?.packageSha256 || tree.files?.[0]?.byteCount !== 1213597) issues.push('P2_ENTRY_FILE_IDENTITY_INVALID');
  if (tree.externalRuntimeRequestCount !== 0 || tree.mutableMainDependencyCount !== 0 || tree.undeclaredRuntimeDependencyCount !== 0) issues.push('P2_DEPENDENCY_LAW_INVALID');
  if (tree.identityExposureCount !== 6 || tree.normalizedReceiptRequiredFieldCount !== 23) issues.push('P2_IDENTITY_OR_SCHEMA_COUNT_INVALID');
  if (candidate?.currentStatus !== 'MATERIALIZATION_EXECUTION_OPEN' && candidate?.boundaries?.previewFilesMaterialized !== true) issues.push('P2_MATERIALIZED_STATE_WITHOUT_BOUNDARY');
  if (candidate?.currentStatus === 'MATERIALIZATION_EXECUTION_OPEN' && candidate?.boundaries?.previewFilesMaterialized !== false) issues.push('P2_OPEN_STATE_BOUNDARY_INVALID');
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (key !== 'previewFilesMaterialized' && value !== false) issues.push(`P2_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3F2_P3_NON_PRODUCTION_PUBLICATION_CONFIGURATION') issues.push('P2_NEXT_CHECKPOINT_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_HOSTING_OR_NETWORK_PUBLICATION') issues.push('P2_STOPPING_BOUNDARY_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate.currentStatus === 'PASS_CLOSED'
          ? 'RUN_8E_R3F2_P2_PASS_CLOSED'
          : candidate.currentStatus === 'MATERIALIZED_PENDING_DURABLE_RECEIPT'
            ? 'RUN_8E_R3F2_P2_MATERIALIZED_PENDING_DURABLE_RECEIPT'
            : 'RUN_8E_R3F2_P2_MATERIALIZATION_EXECUTION_OPEN')
      : 'RUN_8E_R3F2_P2_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3F2_P2_CONTROL;
