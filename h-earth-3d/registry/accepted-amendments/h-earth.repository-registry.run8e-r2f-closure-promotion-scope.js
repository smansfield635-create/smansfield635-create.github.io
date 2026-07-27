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
const CORE_EXECUTION_HEAD = 'fb92cca39d5a277df3dba8d586fb9ff017eca34a';
const CLOSURE_CONTROL_HEAD = 'd5b0d39fed9881b0c403c3887a22db778e9b69b4';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R2F_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r2f-closure-promotion-decision.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2f.closure-promotion-decision.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2f-closure-promotion-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r2f.closure-promotion-decision.validation.mjs',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.promotion-decision.json',
  PASS_RECEIPT_PATH
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
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'R2F_PASS_CLOSED_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R2F_CLOSURE_AND_PROMOTION_DECISION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R2F_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2F_CLOSURE_PROMOTION_DECISION_v1',
  evidenceClass: 'EXECUTED_R2_CLOSURE_AND_R3_INPUT_PROMOTION_DECISION',
  sourceKind: 'GITHUB_ACTIONS_EXECUTION_DURABLE_ARTIFACT_AND_REPOSITORY_RECEIPT',
  sourceIdOrPath: PASS_RECEIPT_PATH,
  sourceOccurrenceOrRevision: CLOSURE_CONTROL_HEAD,
  assertionScope: Object.freeze([
    'R2A_THROUGH_R2F_PASS_CLOSED',
    'R2_STACK_TOPOLOGY_EXACT',
    'SINGLE_CONTROLLING_R2E_OCCURRENCE',
    'R2_PROTECTED_PACKAGE_IDENTITIES_PRESERVED',
    'R2_CONSTRUCTION_PASS_CLOSED',
    'PROMOTION_TO_R3_INPUT_APPROVED',
    'MAIN_MERGE_NOT_EXECUTED',
    'DEPLOYMENT_NOT_EXECUTED',
    'R3_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN',
    'STOP_BEFORE_RUN_8E_R3'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    predecessorR2EHead: BASE_EXACT_HEAD,
    controllingR2EPR: 224,
    supersededR2EPR: 223,
    supersededR2EPRState: 'CLOSED_UNMERGED',
    r2fPullRequest: 225,
    coreExecutionHead: CORE_EXECUTION_HEAD,
    coreWorkflowRun: 30283048662,
    coreWorkflowJob: 90033938538,
    coreArtifactId: 8659616243,
    coreArtifactDigest: 'sha256:a130adddfc535ce3acd28e81cd4d4c09b1c131b0cda427bc0d51fbbf9683e300',
    coreClosureManifestDigest: 'sha256:f565c1973859fa8365bca57d06f794f81b85bce436b5887ca5c81e926a6d1a73',
    closureControlHead: CLOSURE_CONTROL_HEAD,
    closureControlWorkflowRun: 30283446783,
    closureControlWorkflowJob: 90035262877,
    closureControlArtifactId: 8659772773,
    closureControlArtifactDigest: 'sha256:de96f8ee34511263134c54e8667cac1023300d120d106d843fc75640c6c81eb8',
    closureControlManifestDigest: 'sha256:33700d5af40e09ee6205e7981123ab867bdd7f484d158cbb65f69bc94deebca8',
    automaticRegistryPreflightRun: 30283446747,
    automaticRegistryPreflight: 'PASS',
    durablePassReceiptPath: PASS_RECEIPT_PATH,
    r2fPathCount: H_EARTH_RUN_8E_R2F_PATHS.length,
    r2ConstructionClosure: 'PASS_CLOSED',
    promotionToR3Input: 'APPROVED',
    mainBranchPromotion: 'NOT_EXECUTED'
  }),
  evidenceLimitations: Object.freeze([
    'FINAL_EXACT_HEAD_REVALIDATION_MUST_PASS_BEFORE_NO_FURTHER_MUTATION_BOUNDARY',
    'R2_STACK_UNMERGED',
    'MAIN_PROMOTION_NOT_EXECUTED',
    'R3_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R2F_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R2F_CLOSURE_PROMOTION_DECISION',
  nodeType: 'RECOVERY_CHECKPOINT_DECISION_PACKET',
  nodeSubtype: 'R2_PASS_CLOSED_AND_R3_INPUT_PROMOTION_APPROVED',
  displayName: 'H-Earth Run 8E R2F Closure and Promotion Decision',
  description: 'Preserves executed closure of the full R2 stack and approval of the immutable package as the bounded R3 input while withholding main merge, deployment, public-route, visible-renderer, R3 execution, and Run 8E pass authority.',
  repositoryPaths: [...H_EARTH_RUN_8E_R2F_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R2F_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R2F_EVIDENCE.evidenceId]),
  authorityClass: 'R2_CHECKPOINT_CLOSURE_AND_NEXT_CHECKPOINT_INPUT_PROMOTION',
  authorityPosture: 'R2_PASS_CLOSED_R3_INPUT_APPROVED_MAIN_MERGE_WITHHELD_RUN_8E_FAIL_OPEN',
  authoritySource: Object.freeze(['R2A_R2E_PASS_RECEIPTS', 'EXACT_STACK_HEADS', 'R2E_REGISTRY_AUDIT', 'R2F_CORE_EXECUTION', 'R2F_CLOSURE_CONTROL_EXECUTION', 'DURABLE_PASS_RECEIPT']),
  authorityScope: Object.freeze(['PRESERVE_R2_PASS_CLOSED', 'PROMOTE_R2_PACKAGE_AS_R3_INPUT', 'PRESERVE_MAIN_MERGE_WITHHELD', 'STOP_BEFORE_R3']),
  authorityLimitations: Object.freeze(['NO_MAIN_MERGE', 'NO_DEPLOYMENT', 'NO_PUBLIC_ROUTE_BINDING', 'NO_VISIBLE_RENDERER', 'NO_R3_EXECUTION', 'NO_RUN_8E_PASS_AUTHORITY']),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['R2E_PASS_CLOSED_BEFORE_R2F', 'R2F_CORE_EXECUTION_BEFORE_DURABLE_RECEIPT', 'DURABLE_RECEIPT_BEFORE_FINAL_EXACT_HEAD_REVALIDATION', 'R2F_PASS_CLOSED_BEFORE_R3']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_AFTER_FINAL_EXACT_HEAD_REVALIDATION',
  prohibitedMutations: Object.freeze([
    'LIVE_RENDER_PACKAGE_MUTATION',
    'GPU_TRANSPORT_ADAPTER_MUTATION',
    'SOURCE_AUTHORITY_MUTATION',
    'PUBLIC_ROUTE_CAMERA_NAVIGATION_OR_GESTURE_MUTATION',
    'SHADER_PROGRAM_DRAW_CALL_RENDER_LOOP_OR_VISIBLE_PRESENTATION',
    'MAIN_MERGE_OR_DEPLOYMENT',
    'R3_EXECUTION',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze(['FINAL_EXACT_HEAD_AUDIT', 'FINAL_AUTOMATIC_REGISTRY_PREFLIGHT']),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_RUN_8E_R3']),
  currentIdentityReferences: Object.freeze([BASE_EXACT_HEAD, CORE_EXECUTION_HEAD, CLOSURE_CONTROL_HEAD, PASS_RECEIPT_PATH, '30283446783', '8659772773']),
  lifecycleStatus: 'PASS_CLOSED_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  unresolvedFields: Object.freeze(['FINAL_EXACT_HEAD_VALIDATION_RUN'])
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
