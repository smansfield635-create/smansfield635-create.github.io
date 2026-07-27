/** Read-only execution-evidence overlay for the Run 8E R2E registry audit and durable closure receipt. */
import baseFacade from './h-earth.repository-registry.run8e-r2-execution-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r2e-registry-execution-custody-001';
const CORE_HEAD = '481dd572eb3351e42e11f48ff75edc37c9e03d76';
const EXECUTION_EVIDENCE_HEAD = '2ae6c8cfad013c0ddd3d7f71990357add582ae34';
const EXECUTION_OVERLAY_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2e-execution-scope.js';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R2E_EXECUTION_PATHS = Object.freeze([
  EXECUTION_OVERLAY_PATH,
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R2E_EXECUTION_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'R2E_DURABLE_PASS_RECEIPT_PRESENT_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R2E_EXECUTION_AND_PASS_CLOSED_EVIDENCE_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2E_CORE_EXECUTION_v1',
  evidenceClass: 'EXECUTED_REGISTRY_EXACT_SCOPE_AUDIT_AND_DURABLE_PASS_CLOSED_RECEIPT',
  sourceKind: 'GITHUB_ACTIONS_EXECUTION_DURABLE_ARTIFACT_AND_REPOSITORY_RECEIPT',
  sourceIdOrPath: PASS_RECEIPT_PATH,
  sourceOccurrenceOrRevision: EXECUTION_EVIDENCE_HEAD,
  assertionScope: Object.freeze([
    'ALL_R2_PATHS_RESOLVE',
    'ALL_R2E_NON_REGISTRY_PATHS_RESOLVE',
    'UNREGISTERED_GOVERNED_PATHS_ZERO',
    'DUPLICATE_NODE_AND_EVIDENCE_IDS_ZERO',
    'UNRESOLVED_REQUIRED_OCCURRENCES_ZERO',
    'CHECKPOINT_STACK_ORDER_EXACT',
    'PASS_RECEIPTS_AND_ARTIFACT_IDENTITIES_MATCH',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT_PASS',
    'R2A_THROUGH_R2D_PASS_CLOSED',
    'R2E_PASS_CLOSED',
    'R2_OPEN_AT_R2F_BOUNDARY',
    'R2F_AND_R3_NOT_STARTED',
    'RUN_8E_FAIL_OPEN'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    pullRequest: 224,
    branch: BRANCH,
    baseHead: '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9',
    validatedCoreHead: CORE_HEAD,
    coreWorkflowRun: 30280225199,
    coreWorkflowJob: 90024428747,
    coreArtifactId: 8658482156,
    coreArtifactDigest: 'sha256:65a0b6b4a494f4330285bb214800b66c6115a8f3477251a80b6e0e3fcb82d161',
    executionEvidenceHead: EXECUTION_EVIDENCE_HEAD,
    executionWorkflowRun: 30280738790,
    executionWorkflowJob: 90026155156,
    executionArtifactId: 8658686555,
    executionArtifactDigest: 'sha256:adbeab3e9b63dc6ec69282be2cb177f058b20d95203b12b6b5f89c0d53d58260',
    closureControlHead: '079ef0aa2ead229eea0aa96470026b044869c4f9',
    closureControlWorkflowRun: 30281157018,
    closureControlWorkflowJob: 90027587773,
    closureControlArtifactId: 8658858011,
    closureControlArtifactDigest: 'sha256:bc072d597a8ce174e46947a1e391831b8d2dd0073fc503ca7f58345158f5e313',
    durablePassReceiptPath: PASS_RECEIPT_PATH,
    durablePassReceiptCommit: '48b86a4a1db9a8b5b6c23d99b3e55cde1825c1d0',
    exactOccurrenceManifestDigest: 'sha256:2ae01097d0ab58f6cfd6b2a158ee558f816a2342443b387da410879fb1f2da9a',
    checkpointCount: 4,
    r2UniquePathCount: 27,
    r2CheckpointOccurrenceCount: 30,
    r2eRegisteredPathCount: 9,
    r2eNonRegistryPathCount: 6,
    unregisteredGovernedPathCount: 0,
    duplicateNodeIdCount: 0,
    duplicateEvidenceIdCount: 0,
    unresolvedRequiredOccurrenceCount: 0,
    automaticPreflightDisposition: 'PASS'
  }),
  evidenceLimitations: Object.freeze([
    'FINAL_EXACT_HEAD_REVALIDATION_MUST_PASS_BEFORE_NO_FURTHER_MUTATION_BOUNDARY',
    'R2_STACK_UNMERGED',
    'R2F_NOT_STARTED',
    'R3_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R2E_EXECUTION_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R2E_CORE_EXECUTION_EVIDENCE',
  nodeType: 'EXECUTED_RECOVERY_EVIDENCE_PACKET',
  nodeSubtype: 'R2E_REGISTRY_EXACT_SCOPE_AUDIT_AND_DURABLE_PASS_CLOSED_RECEIPT',
  displayName: 'H-Earth Run 8E R2E Execution and Pass-Closed Evidence',
  description: 'Preserves the successful R2E registry and exact-scope audit, automatic preflight, exact occurrence manifest, closure-control validation, and durable pass-closed receipt while stopping before R2F.',
  repositoryPaths: [...H_EARTH_RUN_8E_R2E_EXECUTION_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE.evidenceId]),
  authorityClass: 'EXECUTED_EVIDENCE_AND_DURABLE_RECEIPT_PRESERVATION',
  authorityPosture: 'R2E_PASS_CLOSED_UNMERGED_R2_OPEN_AT_R2F_BOUNDARY_RUN_8E_FAIL_OPEN',
  authoritySource: Object.freeze(['EXACT_CORE_HEAD', 'EXACT_EXECUTION_EVIDENCE_HEAD', 'GITHUB_ACTIONS_WORKFLOWS', 'DURABLE_ARTIFACTS', 'DURABLE_PASS_RECEIPT']),
  authorityScope: Object.freeze(['PRESERVE_R2E_PASS_CLOSED', 'PRESERVE_EXACT_OCCURRENCE_MANIFEST', 'PRESERVE_AUTOMATIC_PREFLIGHT_PASS', 'PRESERVE_R2F_STOPPING_BOUNDARY']),
  authorityLimitations: Object.freeze(['NO_CANONICAL_AUTHORITY', 'NO_PRODUCTION_AUTHORITY', 'NO_MERGE_AUTHORITY', 'NO_DEPLOYMENT_AUTHORITY', 'NO_R2F_OR_R3_AUTHORITY', 'NO_RUN_8E_PASS_AUTHORITY']),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['CORE_EXECUTION_BEFORE_EXECUTION_EVIDENCE_OVERLAY', 'EXECUTION_EVIDENCE_BEFORE_DURABLE_RECEIPT', 'DURABLE_RECEIPT_BEFORE_FINAL_EXACT_HEAD_REVALIDATION', 'STOP_BEFORE_R2F']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_AFTER_FINAL_EXACT_HEAD_REVALIDATION',
  prohibitedMutations: Object.freeze(['LIVE_RENDER_PACKAGE_MUTATION', 'GPU_TRANSPORT_ADAPTER_MUTATION', 'PUBLIC_ROUTE_CAMERA_NAVIGATION_OR_GESTURE_MUTATION', 'VISIBLE_RENDERER_OR_DEPLOYMENT', 'R2F_OR_R3_WORK', 'RUN_8E_PASS_CLOSED', 'R2_STACK_MERGE']),
  requiredValidations: Object.freeze(['FINAL_EXACT_HEAD_AUDIT', 'FINAL_AUTOMATIC_REGISTRY_PREFLIGHT']),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_R2_CLOSURE_AND_PROMOTION_DECISION_R2F']),
  currentIdentityReferences: Object.freeze([CORE_HEAD, EXECUTION_EVIDENCE_HEAD, PASS_RECEIPT_PATH, '30280738790', '8658686555']),
  lifecycleStatus: 'PASS_CLOSED_UNMERGED_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  unresolvedFields: Object.freeze(['FINAL_EXACT_HEAD_VALIDATION_RUN'])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R2E_EXECUTION_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R2E_EXECUTION_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R2E_EXECUTION_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R2E_EXECUTION_NODE.nodeId
    ? H_EARTH_RUN_8E_R2E_EXECUTION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R2E_EXECUTION_NODE.nodeId, node: H_EARTH_RUN_8E_R2E_EXECUTION_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R2E_EXECUTION_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R2E_EXECUTION_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R2E_EXECUTION_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R2E_EXECUTION_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R2E_EXECUTION_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R2E_EXECUTION_FACADE;
