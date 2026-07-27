/** Read-only registry overlay for Run 8E R2F closure and promotion-decision custody. */
import baseFacade from './h-earth.repository-registry.run8e-r2e-execution-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r2f-closure-promotion-decision-001';
const BASE_EXACT_HEAD = '096bfbaf45b8987041600385ae16646b00137b9b';

export const H_EARTH_RUN_8E_R2F_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r2f-closure-promotion-decision.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2f.closure-promotion-decision.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2f-closure-promotion-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r2f.closure-promotion-decision.validation.mjs',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.promotion-decision.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.pass-closed.receipt.json'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R2F_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT_OR_PLANNED_DURABLE_RECEIPT',
  fetchbackStatus: 'R2F_EXECUTION_PENDING',
  occurrenceClass: 'RUN_8E_R2F_CLOSURE_AND_PROMOTION_DECISION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R2F_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2F_CLOSURE_PROMOTION_DECISION_v1',
  evidenceClass: 'R2_CLOSURE_AND_PROMOTION_DECISION_EXECUTION_CUSTODY',
  sourceKind: 'GITHUB_ACTIONS_EXECUTION_DURABLE_ARTIFACT_AND_REPOSITORY_RECEIPT',
  sourceIdOrPath: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.pass-closed.receipt.json',
  sourceOccurrenceOrRevision: BASE_EXACT_HEAD,
  assertionScope: Object.freeze([
    'R2A_THROUGH_R2E_PASS_CLOSED',
    'R2_STACK_TOPOLOGY_EXACT',
    'R2_PROTECTED_PACKAGE_IDENTITIES_PRESERVED',
    'R2_CLOSURE_ELIGIBLE',
    'PROMOTION_TO_R3_INPUT_APPROVED',
    'MAIN_MERGE_NOT_EXECUTED',
    'DEPLOYMENT_NOT_EXECUTED',
    'RUN_8E_REMAINS_FAIL_OPEN',
    'STOP_BEFORE_RUN_8E_R3'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    predecessorR2EHead: BASE_EXACT_HEAD,
    controllingR2EPR: 224,
    supersededR2EPR: 223,
    supersededR2EPRState: 'CLOSED_UNMERGED',
    r2fBranch: BRANCH,
    r2fPathCount: H_EARTH_RUN_8E_R2F_PATHS.length,
    executionStatus: 'PENDING'
  }),
  evidenceLimitations: Object.freeze([
    'R2F_EXECUTION_PENDING',
    'R2_STACK_UNMERGED',
    'MAIN_PROMOTION_NOT_EXECUTED',
    'R3_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R2F_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R2F_CLOSURE_PROMOTION_DECISION',
  nodeType: 'RECOVERY_CHECKPOINT_DECISION_PACKET',
  nodeSubtype: 'R2_CLOSURE_AND_PROMOTION_TO_R3_INPUT',
  displayName: 'H-Earth Run 8E R2F Closure and Promotion Decision',
  description: 'Audits the complete R2 stack, closes R2 when eligible, and decides whether the immutable package may advance as the bounded input to R3 without merging to main or deploying.',
  repositoryPaths: [...H_EARTH_RUN_8E_R2F_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R2F_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R2F_EVIDENCE.evidenceId]),
  authorityClass: 'R2_CHECKPOINT_CLOSURE_AND_NEXT_CHECKPOINT_INPUT_PROMOTION',
  authorityPosture: 'R2F_EXECUTION_PENDING_MAIN_MERGE_WITHHELD',
  authoritySource: Object.freeze(['R2A_R2E_PASS_RECEIPTS', 'EXACT_STACK_HEADS', 'R2E_REGISTRY_AUDIT', 'R2F_EXECUTION']),
  authorityScope: Object.freeze(['CLOSE_R2_IF_ALL_CONTROLS_PASS', 'PROMOTE_R2_PACKAGE_AS_R3_INPUT', 'STOP_BEFORE_R3']),
  authorityLimitations: Object.freeze(['NO_MAIN_MERGE', 'NO_DEPLOYMENT', 'NO_PUBLIC_ROUTE_BINDING', 'NO_VISIBLE_RENDERER', 'NO_RUN_8E_PASS_AUTHORITY']),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['R2E_PASS_CLOSED_BEFORE_R2F', 'R2F_PASS_CLOSED_BEFORE_R3', 'MAIN_PROMOTION_REQUIRES_SEPARATE_AUTHORITY']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'R2F_CONTROL_REGISTRY_VALIDATION_WORKFLOW_AND_RECEIPT_ONLY',
  prohibitedMutations: Object.freeze([
    'LIVE_RENDER_PACKAGE_MUTATION',
    'GPU_TRANSPORT_ADAPTER_MUTATION',
    'SOURCE_AUTHORITY_MUTATION',
    'PUBLIC_ROUTE_CAMERA_NAVIGATION_OR_GESTURE_MUTATION',
    'SHADER_PROGRAM_DRAW_CALL_RENDER_LOOP_OR_VISIBLE_PRESENTATION',
    'MAIN_MERGE_OR_DEPLOYMENT',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze(['R2_STACK_CLOSURE_AUDIT', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'FINAL_EXACT_HEAD_REVALIDATION']),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_RUN_8E_R3']),
  currentIdentityReferences: Object.freeze([BASE_EXACT_HEAD, BRANCH]),
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: Object.freeze(['R2F_EXECUTION_HEAD', 'R2F_FINAL_HEAD', 'R2F_WORKFLOW_RUN', 'R2F_ARTIFACT'])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R2F_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R2F_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R2F_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R2F_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R2F_NODE.nodeId
    ? H_EARTH_RUN_8E_R2F_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R2F_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R2F_EVIDENCE
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R2F_NODE.nodeId, node: H_EARTH_RUN_8E_R2F_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R2F_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R2F_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R2F_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R2F_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R2F_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R2F_FACADE;
