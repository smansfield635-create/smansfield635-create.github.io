/** Read-only accepted-amendment facade for Run 8E R3E4 public direct-manipulation execution and acceptance. */
import baseFacade from './h-earth.repository-registry.run8e-r3e3-public-runtime-authority-exclusivity.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3e4-public-direct-manipulation-acceptance-001';
const FAILURE_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e4.attempt-001.failure.receipt.json';
const FAILURE_RECEIPT_002_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e4.attempt-002.failure.receipt.json';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e4.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3E4_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3e4-public-direct-manipulation-acceptance.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e4.public-direct-manipulation-acceptance.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3e4-public-direct-manipulation-acceptance.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3e4.public-direct-manipulation-acceptance.harness.mjs',
  FAILURE_RECEIPT_PATH,
  FAILURE_RECEIPT_002_PATH,
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = freeze(H_EARTH_RUN_8E_R3E4_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT',
  fetchbackStatus: 'R3E4_EXECUTION_PENDING',
  occurrenceClass: 'RUN_8E_R3E4_PUBLIC_DIRECT_MANIPULATION_EXECUTION_PENDING_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3E4_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3E4_PUBLIC_DIRECT_MANIPULATION_ACCEPTANCE_v1',
  evidenceClass: 'DECLARED_PUBLIC_ROUTE_DIRECT_MANIPULATION_EXECUTION_AND_ACCEPTANCE_MATRIX',
  sourceKind: 'BRANCH_LOCAL_PUBLIC_ROUTE_MOBILE_CHROMIUM_EXECUTION_PENDING',
  sourceIdOrPath: '/showroom/globe/h-earth/',
  sourceOccurrenceOrRevision: '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9',
  assertionScope: freeze([
    'PORTRAIT_PUBLIC_ROUTE_SESSION',
    'LANDSCAPE_PUBLIC_ROUTE_SESSION',
    'ONE_FINGER_LOOK',
    'TWO_FINGER_FORWARD_TRAVEL',
    'TWO_FINGER_BACKWARD_TRAVEL',
    'PINCH_ZOOM_IN',
    'PINCH_ZOOM_OUT',
    'NO_VISIBLE_CONTROLLER',
    'NO_FRAME_COALESCING',
    'ONE_ACCEPTED_PROPOSAL_TO_ONE_R3A_PACKET_TO_ONE_VISIBLE_GPU_RESPONSE',
    'TWENTY_FOUR_SCHEDULED_INTERACTION_GROUPS_PER_ORIENTATION',
    'RUNTIME_AUTHORITY_EXCLUSIVITY_RECONFIRMATION',
    'ZERO_PUBLIC_SOURCE_MUTATION',
    'STOP_BEFORE_R3E5'
  ]),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: '504b81ff50acd7b23cf3cdb2e915ed53f0112ff9',
    predecessorPullRequest: 247,
    predecessorPassReceiptGitBlob: '5c5f1ae06220f88f497dc2b45f4d749679849918',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    frameCoalescingPolicy: 'NONE_ONE_SYNCHRONOUS_FRAME_PER_ACCEPTED_PROPOSAL',
    scheduledInteractionGroupsPerOrientation: 24,
    inputCadenceMs: 350,
    maximumTimerDeliveryLagExclusiveMs: 2000,
    maximumActionCompletionLagExclusiveMs: 2000,
    maximumSynchronousActionProcessingExclusiveMs: 1000,
    maximumConcurrentCallbacks: 1,
    attempt001Head: '7b22d872fe65ccec9ccf825a4b2d58f142589335',
    attempt001WorkflowRun: 30310253299,
    attempt001WorkflowJob: 90123949684,
    attempt001ArtifactId: 8670053915,
    attempt001ArtifactDigest: 'sha256:bc50349262ac5512dbd420231e10f0193e10b3909f1362311eeaa9c4a112d760',
    attempt001FailureClass: 'HARNESS_IDENTIFIER_SHADOWING',
    attempt001PublicRouteDefectExposed: false,
    attempt002Head: '2c5bc13b239481a0e8caa6761b534a44d2feebe9',
    attempt002WorkflowRun: 30310550908,
    attempt002WorkflowJob: 90124912076,
    attempt002ArtifactId: 8670173567,
    attempt002ArtifactDigest: 'sha256:de9e1d1552821d7eea3e303d92661060e517bbb15f40bec02c51b9ea6b98a76c',
    attempt002FailureClass: 'UNRESOLVED_CORRESPONDENCE_ASSERTION_WITH_INADEQUATE_PREASSERT_EVIDENCE',
    attempt002PublicRouteDefectStatus: 'NOT_ESTABLISHED'
  }),
  evidenceLimitations: freeze([
    'ATTEMPT_001_HARNESS_FAILURE_PRESERVED',
    'ATTEMPT_002_CORRESPONDENCE_FAILURE_PRESERVED',
    'EXECUTION_PENDING',
    'NO_REFERENCE_DEVICE_ACCEPTANCE',
    'NO_DEPLOYMENT',
    'NO_PROMOTION',
    'NO_MAIN_MERGE',
    'R3E5_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3E4_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3E4_PUBLIC_DIRECT_MANIPULATION_ACCEPTANCE',
  nodeType: 'RECOVERY_PUBLIC_RUNTIME_EXECUTION_CHECKPOINT',
  nodeSubtype: 'PUBLIC_ROUTE_TOUCH_MANIPULATION_AND_SUSTAINED_GPU_RESPONSE_ACCEPTANCE',
  displayName: 'H-Earth Run 8E R3E4 Public Direct Manipulation Acceptance',
  description: 'Executes the unchanged branch-local public route in separate portrait and landscape mobile Chromium sessions and evaluates complete touch proposal-to-visible-GPU correspondence under sustained interaction.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3E4_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3E4_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3E4_EVIDENCE.evidenceId],
  authorityClass: 'PUBLIC_DIRECT_MANIPULATION_EXECUTION_AUTHORIZED_ACCEPTANCE_PENDING',
  authorityPosture: 'R3E4_EXECUTION_PENDING_UNMERGED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3E3_PASS_CLOSED', 'R3E3_DURABLE_PASS_RECEIPT', 'R3E4_DECLARED_ACCEPTANCE_MATRIX'],
  authorityScope: ['EXECUTE_PUBLIC_ROUTE', 'TOUCH_ACCEPTANCE', 'SUSTAINED_INTERACTION', 'RECONFIRM_RUNTIME_EXCLUSIVITY'],
  authorityLimitations: ['NO_PUBLIC_SOURCE_MUTATION', 'NO_PATCH_IN_ACCEPTANCE_RUN', 'NO_REFERENCE_DEVICE_ACCEPTANCE', 'NO_DEPLOYMENT', 'NO_R3E5', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3E3_PASS_CLOSED_BEFORE_R3E4', 'R3E4_PASS_CLOSED_BEFORE_R3E5'],
  dependencyRelations: [],
  allowedMutationScope: 'R3E4_CONTROL_EXECUTION_EVIDENCE_SCOPE_WITH_DURABLE_FAILED_ATTEMPTS_AND_RESERVED_PASS_RECEIPT',
  prohibitedMutations: ['SHOWROOM', 'PUBLIC_ROUTE', 'PUBLIC_ORCHESTRATOR', 'NAVIGATION', 'RENDERER', 'INPUT', 'DEPLOYMENT', 'MAIN'],
  requiredValidations: ['PORTRAIT_PUBLIC_ROUTE_EXECUTION', 'LANDSCAPE_PUBLIC_ROUTE_EXECUTION', 'COMPLETE_TOUCH_MATRIX', 'PROPOSAL_FRAME_CORRESPONDENCE', 'SUSTAINED_TIMING', 'RUNTIME_EXCLUSIVITY', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_R3E_CLOSURE_AND_R3F_INPUT_DECISION_R3E5'],
  currentIdentityReferences: ['504b81ff50acd7b23cf3cdb2e915ed53f0112ff9', '5c5f1ae06220f88f497dc2b45f4d749679849918', '7b22d872fe65ccec9ccf825a4b2d58f142589335', '30310253299', '90123949684', '8670053915', '2c5bc13b239481a0e8caa6761b534a44d2feebe9', '30310550908', '90124912076', '8670173567'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['CORE_EXECUTION_RUN', 'CORE_EXECUTION_ARTIFACT', 'DURABLE_PASS_RECEIPT', 'FINAL_EXACT_HEAD_VALIDATION']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3E4_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3E4_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3E4_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3E4_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3E4_NODE.nodeId ? H_EARTH_RUN_8E_R3E4_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3E4_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3E4_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3E4_NODE.nodeId, node: H_EARTH_RUN_8E_R3E4_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3E4_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3E4_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3E4_NODE.nodeId ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3E4_NODE], relations: [], unresolved: false }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3E4_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3E4_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3E4_FACADE;
