/** Read-only accepted-amendment facade for Run 8E R3D diagnostic direct GPU interaction. */
import baseFacade from './h-earth.repository-registry.run8e-r3c-persistent-gpu-camera-loop-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3d-direct-interaction-no-bitmap-001';
const FAILURE_001 = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d.attempt-001.failure.receipt.json';
const FAILURE_002 = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d.attempt-002.failure.receipt.json';
const PASS_RECEIPT = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3D_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3d-diagnostic-direct-interaction.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3d.diagnostic-direct-interaction.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3d-diagnostic-direct-interaction-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3d.diagnostic-direct-interaction.harness.mjs',
  FAILURE_001,
  FAILURE_002,
  PASS_RECEIPT,
  '/showroom/globe/h-earth/render/direct-interaction.run8e-r3d.js',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/index.html',
  '/showrom/globe/h-earth/diagnostic/run8e-r3d/direct-interaction.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3D_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  contentSha256: null,
  byteCount: null,
  gitBlobSha: repositoryPath === PASS_RECEIPT_PATH ? '6773c9744e0f43a53d3a978ac070afd90f4286c1' : null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'R3D_PASS_CLOSED_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION_v1',
  evidenceClass: 'EXECUTED_R3D_DIRECT_GPU_INTERACTION_WITH_DURABLE_PASS_CLOSED_RECEIPT',
  sourceKind: 'GITHUB_ACTIONS_REAL_BROWSER_POINTER_TOUCH_WHEEL_WEBGL2_EXECUTION_SCREENSHOTS_AND_RECEIPTS',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3d/',
  sourceOccurrenceOrRevision: '7b64352e8a50506e522a36f164e297ab8ec0a71d',
  assertionScope: [
    'REAL_BROWSER_POINTER_EVENT_PATH',
    'TOUCH_POINTER_EVENT_PATH',
   'ONE_FINGER_LOOK',
    'TWO_FINGER_TRAVEL',
    'PINCH_ZOOM',
    'WHEEL_FALLBACK',
   'ACCEPTED_NAVIGATION_PROPOSALS_DRIVE_GPU_FRAMES',
    'NO_BITMAP_PREVIEW',
   'NO_CPU_RASTER_REFRESH',
    'PERSISTENT_GPU_RESOURCE_IDENTITY',
    'FIVE_DISTINCT_VISIBLE_GESTURE_FRAMES',
    'R3D_STOP_BEFORE_PUBLIC_ROUTE'
  ],
  verifiedOn: '2026-07-27',
  evidenceMetadata: {
    baseExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
    predecessorPullRequest: 231,
    r3CFinalWorkflowRun: 30291054680,
    r3CFinalWorkflowJob: 90060661454,
    r3CFinalArtifact: 8662798227,
    r3CFinalArtifactDigest: 'sha256:581150c9278012228f98e30efe634fd2201f027001ccce756223e00cd34aeeb2',
    attempt001FailureHead: 'ec13c97b103c3291a3e930c2138feb5984d3c363',
    attempt001FailureRun: 30293664139,
    attempt001FailureJob: 90069233222,
    attempt001FailureStage: 'VERIFY_SOURCE_SYNTAX_AND_R3D_AUTHORITY',
    attempt001FailureCode: 'PUBLIC_DIRECT_MANIPULATION_WITNESS_MISMATCH',
    attempt001BrowserExecutionStarted: false,
    attempt001FailureReceiptPath: FAILURE_001,
    attempt002Head: '8014bea3a09e6d1363e10b6439b74372575b628',
    attempt002WorkflowRun: 30294287794,
    attempt002WorkflowJob: 90071329468,
    attempt002Artifact: 8664000420,
    attempt002ArtifactDigest: 'sha256:578c7cd60dfc1d7c6c500fe6ba35a07730b7a895d3cd3b635e27154f8a9bd146',
    attempt002CoreBrowserExecution: 'PASS',
    attempt002AutomaticRegistryPreflight: 'PASS',
    attempt002FinalGate: 'FAIL',
    attempt002FinalGateDefects: [
      'SHOWROM_PATH_TYPO_IN_REQUIRED_SCOPE',
      'NEGATIVE_BOUNDARY_FIELDS_INCORRECTLY_REQUIRED_TRUTHY'
    ],
    attempt002AcceptedProposalCount: 7,
    attempt002GpuFrameCount: 5,
    attempt002DistinctFrameArtifactCount: 5,
    attempt002MaximumInputToFrameLatencyMilliseconds: 4.500000000011823,
    attempt002PostInitializationResourceCreationCount: 0,
    attempt002PostInitializationBufferUploadCount: 0,
    attempt002BitmapPreviewTransformCount: 0,
    attempt002CpuRasterRefreshCount: 0,
    attempt002FailureReceiptPath: FAILURE_002,
    successfulExecutionHead: '7b64352e8a50506e522a36f164e297ab8ec0a71d',
    successfulWorkflowRun: 30295159071,
    successfulWorkflowJob: 90074239864,
    successfulArtifact: 8664329836,
    successfulArtifactDigest: 'sha256:f48c3e2d1f4c11938a4db8b9cb7a904a51e700bcb7a282d993a1401f769d0ca2',
    successfulAutomaticRegistryPreflight: 'PASS',
    successfulExactScopeAudit: 'PASS',
    successfulAcceptedProposalCount: 7,
    successfulDistinctFrameArtifactCount: 5,
    successfulMaximumInputToFrameLatencyMilliseconds: 6.600000000000364,
    successfulPostInitializationResourceCreationCount: 0,
    successfulPostInitializationBufferUploadCount: 0,
    successfulBitmapPreviewTransformCount: 0,
    successfulCpuRasterRefreshCount: 0,
    durablePassReceiptPath: PASS_RECEIPT,
    durablePassReceiptGitBlob: '6773c9744e0f43a53d3a978ac070afd90f4286c1',
    requiredDistinctVisibleFrames: 5,
    requiredPostInitializationResourceCreationCount: 0,
    requiredPostInitializationBufferUploadCount: 0,
    requiredBitmapPreviewCount: 0,
    requiredCpuRasterRefreshCount: 0
  },
  evidenceLimitations: [
   'FINAL_EXACT_HEAD_REVALIDATION_PENDING',
    'FINAL_EXACT_HEAD_WORKFLOW_RUN_NOT_EMBEDDED_IN_PASS_RECEIPT',
    'NO_PUBLIC_ROUTE_BINDING',
   'NO_DEPLOYMENT',
    'NO_PHYSICAL_DEVICE_ACCEPTANCE',
   'R3E_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});});

export const H_EARTH_RUN_8E_R3D_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION',
  nodeType: 'RECOVERY_EXECUTION_CHECKPOINT',
  nodeSubtype: 'DIRECT_POINTER_TOUCH_TO_PERSISTENT_GPU_FRAME_WITHOUT_BITMAP_PREVIEW',
  displayName: 'H-Earth Run 8E R3D Diagnostic Direct GPU Interaction',
  description: 'Binds diagnostic browser pointer, touch-pointer, pinch, and wheel events to accepted navigation proposals and immediate persistent WebGL2 camera frames without CSS bitmap preview or deferred CPU raster refresh.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3D_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3D_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3D_EVIDENCE.evidenceId],
  authorityClass: 'EXECUTED_BOUNDED_DIAGNOSTIC_DIRECT_GPU_INTERACTION_PASS_CLOSED',
  authorityPosture: 'R3D_PASS_CLOSED_UNMERGED_R3_OPEN_AT_R3E_BOUNDARY_RUN_8E_FAIL_OPEN',
  authoritySource: [
    'R3C_PASS_CLOSED_PERSISTENT_RENDERER',
    'R3A_SHARED_CAMERA_PACKET',
    'ACCEPTED_NAVIGATION_PROPOSAL_AUTHORITY',
    'R3D_SUCCESSFUL_REAL_BROWSER_EXECUTION',
    'R3D_DURABLE_PASS_RECEIPT'
  ],
  authorityScope: [
    'DIAGNOSTIC_POINTER_AND_TOUCH_BINDING',
   'DIRECT_NAVIGATION_PROPOSAL_TO_GPU_FRAME',
    'PROHIBIT_BITMAP_PREVIEW',
    'PRESERVE_R3E_STOPPING_BOUNDARYg
  ],
  authorityLimitations: [
    'NO_PUBLIC_ROUTE',
   'NO_PUBLIC_DIRECT_MANIPULATION_MUTATION',
   'NO_DEPLOYMENT',
    'NO_PHYSICAL_DEVICE_ACCEPTANCE',
   'NO_R3E',
    'NO_RUN_8E_PASS'
  ],
  parentRelations: [],
  childRelations: [],
  peerRelations: [],
  upstreamBoundaries: [],
  downstreamBoundaries: [],
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3C_PASS_CLOSED_BEFORE_R3D', 'R3D_PASS_CLOSED_BEFORE_R3E'],
  dependencyRelations: [],
  allowedMutationScope: 'R3D_BOUNDED_PATH_SET_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'PUBLIC_DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY', 'R2_PACKAGE', 'R2D_GPU_ADAPTER', 'R3E_OR_LATER'],
  requiredValidations: [
    'REAL_BROWSER_POINTER_TOUCH_AND_WHEEL_EXECUTION',
   'DIRECT_GPU_FRAME_RESPONSE',
    'NO_BITMAP_PREVIEW_SOURCE_AND_RUNTIME_AUDIT',
    'PERSISTENT_RESOURCE_COUNTERS',
    'FIVE_DISTINCT_FRAME_ARTIFACTS',
    'FINAL_AUTOMATIC_REGISTRY_PREFLIGHT',
    'FINAL_EXACT_SCOPE'
  ],
  stoppingBoundaries: ['STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'],
  currentIdentityReferences: [
    '5c7a7eef489da94a230812eecc5e531e285b7cac',
    'ec13c97b103c3291a3e930c2138feb5984d3c363',
    '8014bea3a09e6d1363e10b6439b743725751b628',
    '7b64352e8a50506e522a36f164e297ab8ec0a71d',
    '30295159071',
   '8664329836',
    '6773c9744e0f43a53d3a978ac070afd90f4286c1'
  ],
  lifecycleStatus: 'PASS_CLOSED_FINAL_EXAACT_HEAD_REVALIDATION_PENDING',
  unresolvedFields: ['FINAL_EXAACT_HEAD_WORKFLOW_RUN']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3D_PATHS.map((repositoryPath) => [
  repositoryPath,
  {
    node: H_EARTH_RUN_8E_R3D_NODE,
    occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
  }
]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3D_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3D_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3D_NODE.nodeId
    ? H_EARTH_RUN_8E_R3D_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3D_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R3D_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3D_NODE.nodeId, node: H_EARTH_RUN_8E_R3D_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3D_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3D_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3D_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3D_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3D_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3D_FACADE;
