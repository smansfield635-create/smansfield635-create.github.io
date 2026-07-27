/** Read-only accepted-amendment facade for Run 8E R3D5 closure and R3E input decision. */
import baseFacade from './h-earth.repository-registry.run8e-r3d4-interaction-browser-execution-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3d5-r3d-closure-r3e-input-decision-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d5.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3D5_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3d5-r3d-closure-r3e-input-decision.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3d5.r3d-closure-r3e-input-decision.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e.input-decision.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3d5-r3d-closure-r3e-input-decision-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3d5.r3d-closure-r3e-input-decision.harness.mjs',
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3D5_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT',
  fetchbackStatus: 'R3D5_CORE_EXECUTION_PASS_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3D5_R3D_CLOSURE_AND_R3E_INPUT_DECISION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D5_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D5_R3D_CLOSURE_AND_R3E_INPUT_DECISION_v1',
  evidenceClass: 'EXECUTED_R3D5_REPOSITORY_RECONCILIATION_CORE_PASS',
  sourceKind: 'GITHUB_ACTIONS_NODE_RECONCILIATION_AND_AUTOMATIC_REGISTRY_PREFLIGHT',
  sourceIdOrPath: '/h-earth-3d/validation/h-earth.run8e-r3d5.r3d-closure-r3e-input-decision.harness.mjs',
  sourceOccurrenceOrRevision: '119ea9d5d09774efc9270664bd561462e3afc1f5',
  assertionScope: [
    'R3D1_R3D4_DURABLE_RECEIPT_IDENTITY_RECONCILIATION',
    'R3D_DIAGNOSTIC_INTERACTION_PROGRAM_PASS_CLOSED',
    'R3E_INPUT_ADMISSIBILITY_DECISION',
    'R3E_REQUIRES_SEPARATE_BRANCH_FROM_R3D5_FINAL_EXACT_HEAD',
    'NO_PUBLIC_ROUTE_MUTATION',
    'NO_BROWSER_OR_GPU_EXECUTION',
    'NO_DEPLOYMENT_OR_PHYSICAL_DEVICE_ACCEPTANCE',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ],
  verifiedOn: '2026-07-27',
  evidenceMetadata: {
    baseExactHead: '641c25f76d44f95709693a1cc0aec7ecbb53ae2e',
    predecessorPullRequest: 242,
    predecessorFinalWorkflowRun: 30301479872,
    predecessorFinalArtifact: 8666741737,
    predecessorFinalArtifactDigest: 'sha256:c1f7845ff732718f44168e23fcb520f1ab74315102777025a694de4b6ca40292',
    predecessorReceiptBlobs: {
      r3D1: '0ea8f618f597aef527655f28951d9cf4e9629485',
      r3D2: '69748b18b155e87930b52104f3e3c16385e3150f',
      r3D3: 'c744db650a1f0ba3bec208312b82cd469ce5dc0b',
      r3D4: '8f8a7d91354911d318edf850e87ab6ea890077a9'
    },
    successfulExecutionHead: '119ea9d5d09774efc9270664bd561462e3afc1f5',
    workflowRun: 30303543863,
    workflowJob: 90102105502,
    artifactId: 8667508612,
    artifactDigest: 'sha256:c8cfa71d54f437f5cef03c463fa37c7ab31b61541038991912e198f9cef70ec8',
    automaticRegistryPreflightRun: 30303543805,
    predecessorReceiptCount: 4,
    unresolvedPredecessorCount: 0,
    r3DSubcheckpointCount: 5,
    resultingR3DStatus: 'PASS_CLOSED',
    resultingR3State: 'OPEN_AT_R3E_BOUNDARY',
    resultingR3EStatus: 'NOT_STARTED',
    resultingRun8EStatus: 'FAIL_OPEN',
    admittedR3EInputCount: 7,
    r3EInputDisposition: 'ADMISSIBLE_AS_NEXT_CHECKPOINT_INPUT',
    r3ERequiredBase: 'R3D5_FINAL_EXACT_HEAD',
    showroomMutationCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0
  },
  evidenceLimitations: [
    'DURABLE_R3D5_PASS_RECEIPT_PENDING',
    'FINAL_EXACT_HEAD_REVALIDATION_PENDING',
    'R3E_NOT_STARTED',
    'NO_PUBLIC_ROUTE_INTEGRATION',
    'NO_DEPLOYMENT',
    'NO_PHYSICAL_DEVICE_ACCEPTANCE',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3D5_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3D5_R3D_CLOSURE_AND_R3E_INPUT_DECISION',
  nodeType: 'RECOVERY_CLOSURE_CHECKPOINT',
  nodeSubtype: 'R3D_PROGRAM_CLOSURE_AND_NEXT_CHECKPOINT_INPUT_DISPOSITION',
  displayName: 'H-Earth Run 8E R3D5 R3D Closure and R3E Input Decision',
  description: 'Reconciles R3D1 through R3D4 durable evidence, closes the diagnostic interaction program, and determines whether its accepted assets are admissible inputs for a separate R3E public-route integration branch.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3D5_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3D5_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3D5_EVIDENCE.evidenceId],
  authorityClass: 'EXECUTED_R3D_CLOSURE_AND_R3E_INPUT_DECISION_CORE_PASS',
  authorityPosture: 'R3D_PASS_CLOSED_CORE_EVIDENCE_DURABLE_R3D5_RECEIPT_PENDING_R3E_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: [
    'R3D1_PASS_CLOSED_RECEIPT',
    'R3D2_PASS_CLOSED_RECEIPT',
    'R3D3_PASS_CLOSED_RECEIPT',
    'R3D4_PASS_CLOSED_RECEIPT',
    'R3D5_GITHUB_ACTIONS_RECONCILIATION'
  ],
  authorityScope: [
    'RECONCILE_R3D1_R3D4',
    'CLOSE_R3D',
    'ISSUE_R3E_INPUT_DISPOSITION',
    'DECLARE_R3E_STACKING_AND_BOUNDARIES'
  ],
  authorityLimitations: [
    'NO_SHOWROOM_MUTATION',
    'NO_PUBLIC_ROUTE_INTEGRATION',
    'NO_BROWSER_OR_GPU_EXECUTION',
    'NO_DEPLOYMENT',
    'NO_PHYSICAL_DEVICE_ACCEPTANCE',
    'NO_R3E_IMPLEMENTATION',
    'NO_RUN_8E_PASS'
  ],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: [
    'R3D1_R3D4_PASS_CLOSED_BEFORE_R3D5',
    'R3D5_FINAL_EXACT_HEAD_BEFORE_R3E_BRANCH_CREATION',
    'R3E_REQUIRES_SEPARATE_EXACT_SCOPE_AND_VALIDATION'
  ],
  dependencyRelations: [],
  allowedMutationScope: 'R3D5_EIGHT_PATH_BOUNDED_SCOPE_ONLY',
  prohibitedMutations: [
    'SHOWROOM',
    'PUBLIC_ROUTE',
    'PUBLIC_DIRECT_MANIPULATION',
    'NAVIGATION_AUTHORITY',
    'RENDERER',
    'INTERACTION_SOURCE',
    'R3E_OR_LATER_IMPLEMENTATION'
  ],
  requiredValidations: [
    'RECEIPT_FREE_CLOSURE_CONTROL_VALIDATION',
    'DURABLE_PASS_RECEIPT',
    'FINAL_EXACT_HEAD_REVALIDATION',
    'AUTOMATIC_REGISTRY_PREFLIGHT',
    'EXACT_SCOPE'
  ],
  stoppingBoundaries: ['STOP_BEFORE_PUBLIC_ROUTE_BRANCH_INTEGRATION_R3E'],
  currentIdentityReferences: [
    '641c25f76d44f95709693a1cc0aec7ecbb53ae2e',
    '119ea9d5d09774efc9270664bd561462e3afc1f5',
    '30303543863',
    '8667508612'
  ],
  lifecycleStatus: 'CORE_EXECUTION_PASS_RECEIPT_PENDING',
  unresolvedFields: ['R3D5_PASS_RECEIPT', 'R3D5_FINAL_EXACT_HEAD']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3D5_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3D5_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3D5_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3D5_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3D5_NODE.nodeId ? H_EARTH_RUN_8E_R3D5_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3D5_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3D5_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3D5_NODE.nodeId, node: H_EARTH_RUN_8E_R3D5_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3D5_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3D5_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3D5_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3D5_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3D5_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3D5_FACADE;
