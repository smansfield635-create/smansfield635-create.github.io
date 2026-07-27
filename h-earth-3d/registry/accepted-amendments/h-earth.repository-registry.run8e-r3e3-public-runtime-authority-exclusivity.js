/** Read-only accepted-amendment facade for Run 8E R3E3 public runtime authority-exclusivity execution. */
import baseFacade from './h-earth.repository-registry.run8e-r3e2-public-live-gpu-composition.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3e3-public-runtime-authority-exclusivity-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e3.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3E3_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3e3-public-runtime-authority-exclusivity.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e3.public-runtime-authority-exclusivity.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3e3-public-runtime-authority-exclusivity.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3e3.public-runtime-authority-exclusivity.harness.mjs',
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = freeze(H_EARTH_RUN_8E_R3E3_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT_OR_PLANNED',
  fetchbackStatus: 'R3E3_BROWSER_AUTHORITY_EXCLUSIVITY_EXECUTION_PENDING',
  occurrenceClass: 'RUN_8E_R3E3_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3E3_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3E3_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_v1',
  evidenceClass: 'R3E3_MOBILE_BROWSER_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_PENDING',
  sourceKind: 'GITHUB_ACTIONS_MOBILE_CHROMIUM_RUNTIME_INSTRUMENTATION',
  sourceIdOrPath: '/showroom/globe/h-earth/',
  sourceOccurrenceOrRevision: null,
  assertionScope: freeze([
    'INITIAL_DOCUMENT_ONE_WEBGL2_CONTEXT',
    'RELOAD_DOCUMENT_ONE_WEBGL2_CONTEXT',
    'ZERO_CANVAS_2D_CONTEXTS',
    'ONE_PERSISTENT_RENDERER_PER_DOCUMENT',
    'ONE_NAVIGATION_STREAM_PER_DOCUMENT',
    'ONE_POINTER_TOUCH_INTAKE_PER_DOCUMENT',
    'EXACT_SIX_CANVAS_INPUT_LISTENERS_PER_DOCUMENT',
    'ONE_FRAME_PRESENTATION_AUTHORITY_PER_DOCUMENT',
    'ZERO_LEGACY_MODULE_REQUESTS',
    'ZERO_APP_OWNED_TIMERS_INTERVALS_MICROTASKS_OR_ANIMATION_LOOPS',
    'LIMITED_LOOK_PROPOSAL_TO_DISTINCT_VISIBLE_GPU_FRAME',
    'NO_PUBLIC_SOURCE_MUTATION',
    'STOP_BEFORE_R3E4'
  ]),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: '2017755b4c0186ef546774c3cfefe57b0e9c3199',
    predecessorPullRequest: 245,
    predecessorPassReceiptGitBlob: 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    requiredDocumentLoadCount: 2,
    requiredCanvasInputListenerCountPerDocument: 6,
    requiredAcceptedProposalCountPerDocument: 1,
    requiredVisibleGpuFrameCountPerDocument: 2
  }),
  evidenceLimitations: freeze([
    'EXECUTION_PENDING',
    'LIMITED_ONE_FINGER_LOOK_PROBE_ONLY',
    'NO_FULL_PUBLIC_DIRECT_MANIPULATION_ACCEPTANCE',
    'NO_SUSTAINED_PUBLIC_INTERACTION_ACCEPTANCE',
    'NO_DEPLOYMENT',
    'NO_PHYSICAL_DEVICE_ACCEPTANCE',
    'R3E4_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3E3_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3E3_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY',
  nodeType: 'RECOVERY_PUBLIC_RUNTIME_EXECUTION_CHECKPOINT',
  nodeSubtype: 'PUBLIC_ROUTE_SINGLE_OWNER_WEBGL2_INPUT_AND_PRESENTATION_AUDIT',
  displayName: 'H-Earth Run 8E R3E3 Public Runtime Authority Exclusivity',
  description: 'Executes the branch-local public route in mobile Chromium and audits exclusive ownership of context, renderer, input, navigation, and frame presentation across initial load and reload.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3E3_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3E3_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3E3_EVIDENCE.evidenceId],
  authorityClass: 'BOUNDED_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_PENDING',
  authorityPosture: 'R3E3_EXECUTION_PENDING_UNMERGED_R3_OPEN_AT_R3E3_EXECUTION_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3E2_PASS_CLOSED_PUBLIC_SOURCE_COMPOSITION', 'R3D2_POINTER_TOUCH_INTAKE', 'R3D3_LIVE_GPU_BINDING'],
  authorityScope: ['EXECUTE_PUBLIC_ROUTE', 'INSTRUMENT_RUNTIME_OWNERS', 'PROBE_ONE_LOOK_PROPOSAL', 'AUDIT_RELOAD_EXCLUSIVITY'],
  authorityLimitations: ['NO_PUBLIC_SOURCE_MUTATION', 'NO_FULL_PUBLIC_INTERACTION_ACCEPTANCE', 'NO_R3E4', 'NO_DEPLOYMENT', 'NO_PHYSICAL_DEVICE_ACCEPTANCE', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3E2_PASS_CLOSED_BEFORE_R3E3', 'R3E3_PASS_CLOSED_BEFORE_R3E4'],
  dependencyRelations: [],
  allowedMutationScope: 'R3E3_SEVEN_PATH_CONTROL_EVIDENCE_SCOPE_ONLY',
  prohibitedMutations: ['SHOWROOM', 'PUBLIC_ROUTE', 'PUBLIC_ORCHESTRATOR', 'NAVIGATION', 'RENDERER', 'INPUT', 'R3E4_OR_LATER'],
  requiredValidations: ['MOBILE_CHROMIUM_INITIAL_LOAD', 'MOBILE_CHROMIUM_RELOAD', 'CONTEXT_AND_LISTENER_INSTRUMENTATION', 'VISIBLE_FRAME_CORRESPONDENCE', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_PUBLIC_DIRECT_MANIPULATION_ACCEPTANCE_R3E4'],
  currentIdentityReferences: ['2017755b4c0186ef546774c3cfefe57b0e9c3199', '0daedf61f7e19af095f4db5fc47563a9cd786837', '2b0a916b3a6d11da84316925f8abd8a3a1447445'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['R3E3_EXECUTION_HEAD', 'R3E3_WORKFLOW_RUN', 'R3E3_ARTIFACT', 'R3E3_PASS_RECEIPT']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3E3_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3E3_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3E3_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3E3_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3E3_NODE.nodeId ? H_EARTH_RUN_8E_R3E3_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3E3_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3E3_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false }) : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES.filter((entry) =>
    (input.path == null || entry.path === input.path) &&
    (input.commitSha == null || entry.commitSha === input.commitSha) &&
    (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
    (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3E3_NODE.nodeId, node: H_EARTH_RUN_8E_R3E3_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3E3_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3E3_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3E3_NODE.nodeId ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3E3_NODE], relations: [], unresolved: false }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3E3_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3E3_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3E3_FACADE;
