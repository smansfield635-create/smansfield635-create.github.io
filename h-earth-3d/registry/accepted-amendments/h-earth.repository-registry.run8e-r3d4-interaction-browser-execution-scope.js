/** Read-only accepted-amendment facade for Run 8E R3D4 interaction browser execution. */
import baseFacade from './h-earth.repository-registry.run8e-r3d3-live-gpu-camera-response-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3d4-interaction-browser-execution-001';
const ATTEMPT_001_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d4.attempt-001.failure.receipt.json';
const ATTEMPT_002_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d4.attempt-002.failure.receipt.json';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d4.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3D4_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3d4-interaction-browser-execution.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3d4.interaction-browser-execution.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3d4-interaction-browser-execution-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3d4.interaction-browser-execution.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r3d4.interaction-browser-execution.v2.harness.mjs',
  ATTEMPT_001_PATH,
  ATTEMPT_002_PATH,
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3D4_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT',
  fetchbackStatus: repositoryPath === ATTEMPT_001_PATH || repositoryPath === ATTEMPT_002_PATH
    ? 'DURABLE_FAILURE_RECEIPT_PRESENT'
    : 'R3D4_CORE_EXECUTION_PASS_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D4_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION_v1',
  evidenceClass: 'EXECUTED_R3D4_PORTRAIT_LANDSCAPE_SUSTAINED_INTERACTION_CORE_PASS_WITH_TWO_PRESERVED_FAILURES',
  sourceKind: 'GITHUB_ACTIONS_TWO_SESSION_MOBILE_CHROMIUM_WEBGL2_INTERACTION_STRESS_EXECUTION',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3d/',
  sourceOccurrenceOrRevision: '579ab9c3bd1371239e8a3a81f65ee4fffaa18a65',
  assertionScope: [
    'PORTRAIT_MOBILE_BROWSER_SESSION',
    'LANDSCAPE_MOBILE_BROWSER_SESSION',
    'TWENTY_FOUR_SCHEDULED_INTERACTION_GROUPS_PER_SESSION',
    'LOOK_TRAVEL_PINCH_AND_WHEEL_REPEATED',
    'SEVENTY_TWO_ACCEPTED_PROPOSALS_TO_SEVENTY_TWO_VISIBLE_FRAMES',
    'NO_TWO_SECOND_INPUT_BACKLOG',
    'NO_CONCURRENT_CALLBACK_OVERLAP',
    'NO_GPU_RESOURCE_RECREATION_OR_REUPLOAD',
    'NO_BITMAP_OR_CSS_TRANSFORM_PREVIEW',
    'STOP_BEFORE_R3D5'
  ],
  verifiedOn: '2026-07-27',
  evidenceMetadata: {
    baseExactHead: '45dbf26ca8495ba03657ff0aeba52225359d23e5',
    predecessorPullRequest: 239,
    scheduledInteractionGroupCountPerSession: 24,
    scheduledCadenceMs: 350,
    maximumDeliveryLagThresholdMs: 2000,
    maximumCompletionLagThresholdMs: 2000,
    maximumActionProcessingThresholdMs: 1000,
    requestedPortraitViewport: { width: 390, height: 844 },
    actualPortraitInnerViewport: { width: 672, height: 1455 },
    actualPortraitVisualViewport: { width: 390, height: 844 },
    requestedLandscapeViewport: { width: 844, height: 390 },
    actualLandscapeInnerViewport: { width: 844, height: 390 },
    actualLandscapeVisualViewport: { width: 844, height: 390 },
    correctedViewportInvariant: 'REQUESTED_VIEWPORT_CUSTODY_PLUS_ACTUAL_ORIENTATION_ASPECT_AND_POSITIVE_VISUAL_VIEWPORT',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d',
    attempt001: {
      head: 'ecee671d27e4402daf921e8d95e43ace0075b5d0',
      workflowRun: 30300093963,
      workflowJob: 90090629096,
      artifactId: 8666211635,
      artifactDigest: 'sha256:1e3c75aed5b63a99bf7ca7cb9b7076888efeba11a8bebd2fe589aeec74b57510',
      failureReceiptPath: ATTEMPT_001_PATH
    },
    attempt002: {
      head: '1b60d3fca26676d11f90cdbdf74b15caf177ed62',
      workflowRun: 30300474765,
      workflowJob: 90091860196,
      artifactId: 8666353073,
      artifactDigest: 'sha256:765d89df80512c452654678735db6f864228a9c1d1511de9c80a896a1a6c0685',
      failureReceiptPath: ATTEMPT_002_PATH,
      exactFailureCode: 'R3D4_PORTRAIT_VIEWPORT_MISMATCH',
      failureClassification: 'AUDIT_MODEL_EXACT_INNER_VIEWPORT_EQUALITY_ASSERTION'
    },
    successfulExecutionHead: '579ab9c3bd1371239e8a3a81f65ee4fffaa18a65',
    workflowRun: 30300915536,
    workflowJob: 90093335073,
    artifactId: 8666527165,
    artifactDigest: 'sha256:7ace397a3fe7f476711337c667c6e65195ad4f4ef23871163bfd9434abd87b17',
    automaticRegistryPreflightRun: 30300915486,
    automaticRegistryPreflight: 'PASS',
    harnessVersion: 2,
    browserSessionCount: 2,
    scheduledInteractionGroupCount: 48,
    acceptedProposalCount: 72,
    visibleGpuFrameCount: 72,
    portraitDistinctVisibleFrameHashCount: 22,
    landscapeDistinctVisibleFrameHashCount: 22,
    maximumDeliveryLagMs: 276.40000000000873,
    maximumCompletionLagMs: 606.9000000000087,
    maximumActionProcessingMs: 409.5,
    maximumConcurrentCallbacks: 1,
    worldRebuildCount: 0,
    deferredRenderCommitCount: 0,
    queuedFrameChainCount: 0,
    postInitializationResourceCreationCount: 0,
    postInitializationBufferUploadCount: 0,
    bitmapPreviewApplicationCount: 0,
    cssTransformPreviewCount: 0,
    portraitCanvasPngSha256: 'b4d3cc7fefad91e14abf86066d7b628621520fb0e8fee0504bb081f06c0812e9',
    landscapeCanvasPngSha256: '60d85130d187042a4c4fad77c69436c25e7874e2b569f9dbe13e9ee679190ae8'
  },
  evidenceLimitations: [
    'DURABLE_R3D4_PASS_RECEIPT_PENDING',
    'DIAGNOSTIC_BROWSER_EMULATION_ONLY',
    'NO_PHYSICAL_DEVICE_ACCEPTANCE',
    'NO_PUBLIC_ROUTE_BINDING',
    'NO_DEPLOYMENT',
    'R3D5_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3D4_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION',
  nodeType: 'RECOVERY_EXECUTION_CHECKPOINT',
  nodeSubtype: 'PORTRAIT_LANDSCAPE_SUSTAINED_DIAGNOSTIC_INTERACTION_BROWSER_AUDIT',
  displayName: 'H-Earth Run 8E R3D4 Interaction Browser Execution',
  description: 'Executes the accepted R3D3 diagnostic interaction path in portrait and landscape mobile Chromium sessions under a sustained scheduled input stream and audits delivery lag, completion lag, callback concurrency, visible-frame correspondence, and persistent GPU resources.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3D4_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3D4_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3D4_EVIDENCE.evidenceId],
  authorityClass: 'EXECUTED_BOUNDED_DIAGNOSTIC_INTERACTION_BROWSER_CORE_PASS',
  authorityPosture: 'R3D4_CORE_EXECUTION_PASS_RECEIPT_PENDING_TWO_FAILURES_PRESERVED_R3D5_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3D3_PASS_CLOSED_LIVE_GPU_CAMERA_RESPONSE', 'EXISTING_DIAGNOSTIC_INPUT_AND_GPU_BINDING', 'R3D4_GITHUB_ACTIONS_BROWSER_EXECUTION', 'R3D4_ATTEMPT_FAILURE_CUSTODY'],
  authorityScope: ['EXECUTE_PORTRAIT_SESSION', 'EXECUTE_LANDSCAPE_SESSION', 'MEASURE_SCHEDULED_INPUT_DELIVERY_AND_VISIBLE_FRAME_RESPONSE'],
  authorityLimitations: ['NO_SHOWROOM_SOURCE_MUTATION', 'NO_PUBLIC_ROUTE', 'NO_DEPLOYMENT', 'NO_PHYSICAL_DEVICE_ACCEPTANCE', 'NO_R3D5', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3D3_PASS_CLOSED_BEFORE_R3D4', 'R3D4_PASS_CLOSED_BEFORE_R3D5'],
  dependencyRelations: [],
  allowedMutationScope: 'R3D4_TEN_PATH_BOUNDED_SCOPE_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'PUBLIC_DIRECT_MANIPULATION', 'NAVIGATION_SOURCE', 'R3A_SOURCE', 'R3C_RENDERER_SOURCE', 'R3D2_INPUT_SOURCE', 'R3D3_BINDING_SOURCE', 'R3D5_OR_LATER'],
  requiredValidations: ['RECEIPT_FREE_CLOSURE_CONTROL_EXECUTION', 'PORTRAIT_AND_LANDSCAPE_MOBILE_CHROMIUM', 'SCHEDULED_INPUT_BACKLOG_AUDIT', 'VISIBLE_FRAME_CORRESPONDENCE', 'PERSISTENT_RESOURCE_AUDIT', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_R3D_CLOSURE_AND_R3E_INPUT_DECISION_R3D5'],
  currentIdentityReferences: ['45dbf26ca8495ba03657ff0aeba52225359d23e5', 'ecee671d27e4402daf921e8d95e43ace0075b5d0', '1b60d3fca26676d11f90cdbdf74b15caf177ed62', '579ab9c3bd1371239e8a3a81f65ee4fffaa18a65', '30300915536', '8666527165'],
  lifecycleStatus: 'CORE_EXECUTION_PASS_RECEIPT_PENDING',
  unresolvedFields: ['R3D4_PASS_RECEIPT', 'FINAL_EXACT_HEAD_WORKFLOW_RUN']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3D4_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3D4_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3D4_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3D4_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3D4_NODE.nodeId ? H_EARTH_RUN_8E_R3D4_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3D4_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3D4_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES.filter((entry) =>
    (input.path == null || entry.path === input.path) &&
    (input.commitSha == null || entry.commitSha === input.commitSha) &&
    (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
    (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3D4_NODE.nodeId, node: H_EARTH_RUN_8E_R3D4_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3D4_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3D4_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3D4_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3D4_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3D4_FACADE = freeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3D4_FACADE;
