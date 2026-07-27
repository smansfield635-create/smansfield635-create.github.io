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
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d4.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3D4_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3d4-interaction-browser-execution.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3d4.interaction-browser-execution.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3d4-interaction-browser-execution-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3d4.interaction-browser-execution.harness.mjs',
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
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT_OR_PLANNED',
  fetchbackStatus: 'R3D4_PORTRAIT_LANDSCAPE_BROWSER_EXECUTION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D4_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D4_INTERACTION_BROWSER_EXECUTION_v1',
  evidenceClass: 'R3D4_PORTRAIT_LANDSCAPE_SUSTAINED_INTERACTION_BROWSER_EXECUTION_PENDING',
  sourceKind: 'GITHUB_ACTIONS_TWO_SESSION_MOBILE_CHROMIUM_WEBGL2_INTERACTION_STRESS_EXECUTION',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3d/',
  sourceOccurrenceOrRevision: null,
  assertionScope: [
    'PORTRAIT_MOBILE_BROWSER_SESSION',
    'LANDSCAPE_MOBILE_BROWSER_SESSION',
    'TWENTY_FOUR_SCHEDULED_INTERACTION_GROUPS_PER_SESSION',
    'LOOK_TRAVEL_PINCH_AND_WHEEL_REPEATED',
    'ACCEPTED_PROPOSAL_TO_VISIBLE_FRAME_CORRESPONDENCE',
    'NO_TWO_SECOND_INPUT_BACKLOG',
    'NO_CONCURRENT_CALLBACK_OVERLAP',
    'NO_GPU_RESOURCE_RECREATION_OR_REUPLOAD',
    'NO_BITMAP_OR_CSS_TRANSFORM_PREVIEW',
    'STOP_BEFORE_R3D5'
  ],
  verifiedOn: null,
  evidenceMetadata: {
    baseExactHead: '45dbf26ca8495ba03657ff0aeba52225359d23e5',
    predecessorPullRequest: 239,
    scheduledInteractionGroupCountPerSession: 24,
    scheduledCadenceMs: 350,
    maximumDeliveryLagThresholdMs: 2000,
    maximumCompletionLagThresholdMs: 2000,
    maximumActionProcessingThresholdMs: 1000,
    portraitViewport: { width: 390, height: 844 },
    landscapeViewport: { width: 844, height: 390 },
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d'
  },
  evidenceLimitations: [
    'EXECUTION_PENDING',
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
  authorityClass: 'BOUNDED_DIAGNOSTIC_INTERACTION_BROWSER_EXECUTION_PENDING',
  authorityPosture: 'R3D4_EXECUTION_PENDING_UNMERGED_R3D5_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3D3_PASS_CLOSED_LIVE_GPU_CAMERA_RESPONSE', 'EXISTING_DIAGNOSTIC_INPUT_AND_GPU_BINDING'],
  authorityScope: ['EXECUTE_PORTRAIT_SESSION', 'EXECUTE_LANDSCAPE_SESSION', 'MEASURE_SCHEDULED_INPUT_DELIVERY_AND_VISIBLE_FRAME_RESPONSE'],
  authorityLimitations: ['NO_SOURCE_MUTATION_OUTSIDE_CONTROL_REGISTRY_VALIDATION', 'NO_PUBLIC_ROUTE', 'NO_DEPLOYMENT', 'NO_PHYSICAL_DEVICE_ACCEPTANCE', 'NO_R3D5', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3D3_PASS_CLOSED_BEFORE_R3D4', 'R3D4_PASS_CLOSED_BEFORE_R3D5'],
  dependencyRelations: [],
  allowedMutationScope: 'R3D4_SEVEN_PATH_BOUNDED_SCOPE_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'PUBLIC_DIRECT_MANIPULATION', 'NAVIGATION_SOURCE', 'R3A_SOURCE', 'R3C_RENDERER_SOURCE', 'R3D2_INPUT_SOURCE', 'R3D3_BINDING_SOURCE', 'R3D5_OR_LATER'],
  requiredValidations: ['PORTRAIT_AND_LANDSCAPE_MOBILE_CHROMIUM', 'SCHEDULED_INPUT_BACKLOG_AUDIT', 'VISIBLE_FRAME_CORRESPONDENCE', 'PERSISTENT_RESOURCE_AUDIT', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_R3D_CLOSURE_AND_R3E_INPUT_DECISION_R3D5'],
  currentIdentityReferences: ['45dbf26ca8495ba03657ff0aeba52225359d23e5'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['R3D4_EXECUTION_HEAD', 'R3D4_WORKFLOW_RUN', 'R3D4_ARTIFACT', 'R3D4_PASS_RECEIPT']
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
