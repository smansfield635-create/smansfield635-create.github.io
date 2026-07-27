/** Read-only accepted-amendment facade for Run 8E R3D2 pointer/touch navigation-proposal intake. */
import baseFacade from './h-earth.repository-registry.run8e-r3d1-diagnostic-host-scaffold-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3d2-pointer-touch-intake-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d2.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3D2_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3d2-pointer-touch-intake.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3d2.pointer-touch-intake.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3d2-pointer-touch-intake-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3d2.pointer-touch-intake.harness.mjs',
  PASS_RECEIPT_PATH,
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/index.html',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/diagnostic-host.js',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3D2_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT_OR_PLANNED',
  fetchbackStatus: 'R3D2_BROWSER_INTAKE_EXECUTION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3D2_POINTER_TOUCH_NAVIGATION_PROPOSAL_INTAKE_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D2_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_NAVIGATION_PROPOSAL_INTAKE_v1',
  evidenceClass: 'R3D2_REAL_BROWSER_POINTER_TOUCH_WHEEL_NAVIGATION_PROPOSAL_INTAKE_PENDING',
  sourceKind: 'GITHUB_ACTIONS_MOBILE_BROWSER_SYNTHETIC_POINTER_TOUCH_WHEEL_EXECUTION',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3d/',
  sourceOccurrenceOrRevision: null,
  assertionScope: [
    'ONE_FINGER_LOOK_NAVIGATION_PROPOSAL',
    'TWO_FINGER_FORWARD_BACK_NAVIGATION_PROPOSAL',
    'PINCH_ZOOM_NAVIGATION_PROPOSAL',
    'WHEEL_DIAGNOSTIC_EQUIVALENT',
    'EXISTING_NAVIGATION_PROPOSAL_AUTHORITY_CONSUMED',
    'NO_DEFERRED_CPU_COMMIT',
    'NO_WEBGL_OR_LIVE_GPU_BINDING',
    'NO_BITMAP_PREVIEW',
    'STOP_BEFORE_R3D3'
  ],
  verifiedOn: null,
  evidenceMetadata: {
    baseExactHead: 'ccac32e8a273fcd47bae684630f49970304c218d',
    predecessorPullRequest: 234,
    requiredProposalCount: 5,
    requiredInputClasses: ['ONE_FINGER_LOOK', 'TWO_FINGER_TRAVEL', 'PINCH_ZOOM', 'WHEEL_DIAGNOSTIC_EQUIVALENT'],
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    protectedPublicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    protectedPublicDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b',
    protectedLiveGpuPlaceholderGitBlob: '14705aed628c58bb3eb93d97e773f1fdc394dc44'
  },
  evidenceLimitations: [
    'EXECUTION_PENDING',
    'NO_WEBGL_CONTEXT',
    'NO_PERSISTENT_RENDERER_INITIALIZATION',
    'NO_LIVE_GPU_CAMERA_RESPONSE',
    'NO_PUBLIC_ROUTE_BINDING',
    'R3D3_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3D2_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_NAVIGATION_PROPOSAL_INTAKE',
  nodeType: 'RECOVERY_EXECUTION_CHECKPOINT',
  nodeSubtype: 'DIAGNOSTIC_POINTER_TOUCH_WHEEL_TO_NAVIGATION_PROPOSAL_INTAKE',
  displayName: 'H-Earth Run 8E R3D2 Pointer and Touch Navigation-Proposal Intake',
  description: 'Binds diagnostic pointer events, touch pointer semantics, pinch, two-finger travel, and wheel equivalents to the existing lawful navigation proposal authority without renderer or public-route integration.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3D2_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3D2_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3D2_EVIDENCE.evidenceId],
  authorityClass: 'BOUNDED_DIAGNOSTIC_INPUT_INTAKE_EXECUTION_PENDING',
  authorityPosture: 'R3D2_EXECUTION_PENDING_UNMERGED_R3D3_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3D1_PASS_CLOSED_DIAGNOSTIC_HOST', 'EXISTING_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_AUTHORITY'],
  authorityScope: ['INSTALL_DIAGNOSTIC_POINTER_LISTENERS', 'CONSUME_TOUCH_POINTER_EVENTS', 'CREATE_NAVIGATION_PROPOSALS', 'VALIDATE_INPUT_SEMANTICS'],
  authorityLimitations: ['NO_RENDERER', 'NO_GPU_BINDING', 'NO_BITMAP_PREVIEW', 'NO_PUBLIC_ROUTE', 'NO_DEPLOYMENT', 'NO_R3D3', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3D1_PASS_CLOSED_BEFORE_R3D2', 'R3D2_PASS_CLOSED_BEFORE_R3D3'],
  dependencyRelations: [],
  allowedMutationScope: 'R3D2_TEN_PATH_BOUNDED_SCOPE_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'PUBLIC_DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY_SOURCE', 'PERSISTENT_RENDERER', 'LIVE_GPU_BINDING', 'R3D3_OR_LATER'],
  requiredValidations: ['REAL_MOBILE_BROWSER_POINTER_EVENTS', 'NAVIGATION_PROPOSAL_STATE_TRANSITIONS', 'NO_CONTEXT_OR_TRANSFORM_PREVIEW', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_LIVE_GPU_CAMERA_BINDING_R3D3'],
  currentIdentityReferences: ['ccac32e8a273fcd47bae684630f49970304c218d'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['R3D2_EXECUTION_HEAD', 'R3D2_WORKFLOW_RUN', 'R3D2_ARTIFACT', 'R3D2_PASS_RECEIPT']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3D2_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3D2_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3D2_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3D2_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3D2_NODE.nodeId ? H_EARTH_RUN_8E_R3D2_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3D2_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3D2_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3D2_NODE.nodeId, node: H_EARTH_RUN_8E_R3D2_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3D2_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3D2_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3D2_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3D2_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3D2_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3D2_FACADE;
