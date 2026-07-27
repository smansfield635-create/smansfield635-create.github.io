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
const FAILURE_RECEIPT_PATH =
  '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d.attempt-001.failure.receipt.json';
const PASS_RECEIPT_PATH =
  '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3D_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3d-diagnostic-direct-interaction.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3d.diagnostic-direct-interaction.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3d-diagnostic-direct-interaction-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3d.diagnostic-direct-interaction.harness.mjs',
  FAILURE_RECEIPT_PATH,
  PASS_RECEIPT_PATH,
  '/showroom/globe/h-earth/render/direct-interaction.run8e-r3d.js',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/index.html',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/direct-interaction.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3D_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH
    ? 'RESERVED_UNTIL_PASS_CLOSED'
    : 'PRESENT_OR_PLANNED',
  fetchbackStatus: 'R3D_EXECUTION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION_v1',
  evidenceClass: 'R3D_DIRECT_GPU_INTERACTION_WITHOUT_BITMAP_PREVIEW_EXECUTION_PENDING',
  sourceKind: 'GITHUB_ACTIONS_REAL_BROWSER_POINTER_TOUCH_WHEEL_WEBGL2_EXECUTION_AND_SCREENSHOT',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3d/',
  sourceOccurrenceOrRevision: null,
  assertionScope: [
    'REAL_BROWSER_POINTER_EVENT_PATH',
    'TOUCH_POINTER_EVENT_PATH',
    'ONE_FINGER_LOOK',
    'TWO_FINGER_TRAVEL',
    'PINCH_ZOOM',
    'WHEEL_FALLBACK',
    'ACCEPTED_NAVIGATION_PROPOSAL_TO_GPU_FRAME',
    'NO_BITMAP_PREVIEW',
    'NO_CPU_RASTER_REFRESH',
    'PERSISTENT_GPU_RESOURCE_IDENTITY',
    'DISTINCT_VISIBLE_GESTURE_FRAMES',
    'R3D_STOP_BEFORE_PUBLIC_ROUTE'
  ],
  verifiedOn: null,
  evidenceMetadata: {
    baseExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
    predecessorPullRequest: 231,
    r3CFinalWorkflowRun: 30291054680,
    r3CFinalWorkflowJob: 90060661454,
    r3CFinalArtifact: 8662798227,
    r3CFinalArtifactDigest: 'sha256:581150c9278012228f98e30efe634fd2201f027001ccce756223e00cd34aeeb2',
    requiredGestureClasses: [
      'ONE_FINGER_LOOK',
      'TWO_FINGER_TRAVEL',
      'TWO_FINGER_PINCH_ZOOM',
      'WHEEL_FALLBACK'
    ],
    attempt001FailureHead: 'ec13c97b103c3291a3e930c2138feb5984d3c363',
    attempt001FailureRun: 30293664139,
    attempt001FailureJob: 90069233222,
    attempt001FailureStage: 'VERIFY_SOURCE_SYNTAX_AND_R3D_AUTHORITY',
    attempt001FailureCode: 'PUBLIC_DIRECT_MANIPULATION_WITNESS_MISMATCH',
    attempt001BrowserExecutionStarted: false,
    attempt001FailureReceiptPath: FAILURE_RECEIPT_PATH,
    requiredDistinctVisibleFrames: 5,
    requiredPostInitializationResourceCreationCount: 0,
    requiredPostInitializationBufferUploadCount: 0,
    requiredBitmapPreviewCount: 0,
    requiredCpuRasterRefreshCount: 0
  },
  evidenceLimitations: [
    'ATTEMPT_001_CONTROL_EVALUATOR_TYPO_FAILED_AND_PRESERVED',
    'EXECUTION_PENDING',
    'BROWSER_EVENT_OBJECTS_ARE_AUTOMATION_DISPATCHED_NOT_PHYSICAL_DEVICE_INPUT',
    'NO_PUBLIC_ROUTE_BINDING',
    'NO_DEPLOYMENT',
    'R3E_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3D_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3D_DIAGNOSTIC_DIRECT_INTERACTION',
  nodeType: 'RECOVERY_EXECUTION_CHECKPOINT',
  nodeSubtype: 'DIRECT_POINTER_TOUCH_TO_PERSISTENT_GPU_FRAME_WITHOUT_BITMAP_PREVIEW',
  displayName: 'H-Earth Run 8E R3D Diagnostic Direct GPU Interaction',
  description: 'Binds diagnostic browser pointer, touch-pointer, pinch, and wheel events to accepted navigation proposals and immediate persistent WebGL2 camera-uniform frames without a CSS bitmap preview or deferred CPU raster refresh.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3D_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3D_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3D_EVIDENCE.evidenceId],
  authorityClass: 'BOUNDED_DIAGNOSTIC_DIRECT_GPU_INTERACTION_EXECUTION_PENDING',
  authorityPosture: 'R3D_EXECUTION_PENDING_UNMERGED_R3E_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: [
    'R3C_PASS_CLOSED_PERSISTENT_RENDERER',
    'R3A_SHARED_CAMERA_PACKET',
    'ACCEPTED_NAVIGATION_PROPOSAL_AUTHORITY',
    'PUBLIC_DIRECT_MANIPULATION_SOURCE_AS_READ_ONLY_WITNESS'
  ],
  authorityScope: [
    'DIAGNOSTIC_POINTER_AND_TOUCH_BINDING',
    'DIRECT_NAVIGATION_PROPOSAL_TO_GPU_FRAME',
    'PROHIBIT_BITMAP_PREVIEW',
    'PRESERVE_R3E_STOPPING_BOUNDARY'
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
  orderingRules: [
    'R3C_PASS_CLOSED_BEFORE_R3D',
    'R3D_PASS_CLOSED_BEFORE_R3E'
  ],
  dependencyRelations: [],
  allowedMutationScope: 'R3D_BOUNDED_PATH_SET_ONLY',
  prohibitedMutations: [
    'PUBLIC_ROUTE',
    'PUBLIC_DIRECT_MANIPULATION',
    'NAVIGATION_AUTHORITY',
    'R2_PACKAGE',
    'R2D_GPU_ADAPTER',
    'R3E_OR_LATER'
  ],
  requiredValidations: [
    'REAL_BROWSER_POINTER_TOUCH_AND_WHEEL_EXECUTION',
    'DIRECT_GPU_FRAME_RESPONSE',
    'NO_BITMAP_PREVIEW_SOURCE_AND_RUNTIME_AUDIT',
    'PERSISTENT_RESOURCE_COUNTERS',
    'DISTINCT_FRAME_ARTIFACTS',
    'FINAL_AUTOMATIC_REGISTRY_PREFLIGHT',
    'FINAL_EXACT_SCOPE'
  ],
  stoppingBoundaries: ['STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'],
  currentIdentityReferences: [
    '5c7a7eef489da94a230812eecc5e531e285b7cac',
    'ec13c97b103c3291a3e930c2138feb5984d3c363',
    '30293664139',
    '90069233222',
    '30291054680',
    '8662798227'
  ],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: [
    'R3D_SUCCESSFUL_EXECUTION_HEAD',
    'R3D_WORKFLOW_RUN',
    'R3D_ARTIFACT',
    'R3D_PASS_RECEIPT'
  ]
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
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_RUN_8E_R3D_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_RUN_8E_R3D_NODE
  ]
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
    ? freeze({
        repositoryPath,
        resolved: true,
        nodes: [indexed.node],
        occurrences: indexed.occurrences,
        unresolved: false
      })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({
      nodeId: H_EARTH_RUN_8E_R3D_NODE.nodeId,
      node: H_EARTH_RUN_8E_R3D_NODE,
      occurrence
    }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({
    query: base.query,
    matches: [...base.matches, ...local],
    resolved: base.resolved || local.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3D_NODE;
  const match =
    (criteria.repositoryPath == null ||
      node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null ||
      criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null ||
      criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null ||
      criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (
  id,
  direction = 'BOTH'
) =>
  id === H_EARTH_RUN_8E_R3D_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3D_NODE.nodeId
    ? freeze({
        nodeId: id,
        nodes: [H_EARTH_RUN_8E_R3D_NODE],
        relations: [],
        unresolved: false
      })
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
