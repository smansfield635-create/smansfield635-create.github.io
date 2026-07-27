/** Read-only execution-evidence overlay for the Run 8E-R2E registry custody checkpoint. */
import baseFacade from './h-earth.repository-registry.run8e-r2-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r2e-registry-custody-audit-001';
const EXECUTION_HEAD = 'c7a7a58458b22fbda650165ab7876a2640679455';
const RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json';
const OVERLAY_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2e-execution-scope.js';

export const H_EARTH_RUN_8E_R2E_EXECUTION_PATHS = Object.freeze([
  RECEIPT_PATH,
  OVERLAY_PATH
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
  fetchbackStatus: 'VERIFIED_ON_R2E_CLOSURE_BRANCH',
  occurrenceClass: 'RUN_8E_R2E_PASS_CLOSED_EXECUTION_EVIDENCE'
})));

export const H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2E_PASS_CLOSED_EXECUTION_v1',
  evidenceClass: 'REGISTRY_CUSTODY_SCOPE_AUDIT_AND_AUTOMATIC_PREFLIGHT_PASS_CLOSED',
  sourceKind: 'GITHUB_ACTIONS_EXECUTION_AUTOMATIC_PREFLIGHT_AND_DURABLE_REPOSITORY_RECEIPT',
  sourceIdOrPath: RECEIPT_PATH,
  sourceOccurrenceOrRevision: EXECUTION_HEAD,
  assertionScope: Object.freeze([
    'R2E_REGISTRY_CUSTODY_AND_SCOPE_AUDIT_PASS',
    'THIRTY_THREE_R2_PATHS_REGISTERED',
    'TWENTY_FIVE_GOVERNED_PATHS_AUTOMATIC_PREFLIGHT_PASS',
    'FOUR_PREDECESSOR_PASS_RECEIPTS_BYTE_IDENTITIES_BOUND',
    'THREE_PROTECTED_SOURCE_IDENTITIES_BOUND',
    'R2E_PASS_CLOSED',
    'R2F_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    executionHead: EXECUTION_HEAD,
    validationRun: 30276245196,
    validationJob: 90010942725,
    evidenceArtifact: 8656899123,
    evidenceArtifactDigest: 'sha256:ab2235534a1d59c4a2030ba2b6c1d0caf7cef637b27ee6eebf904f446a401997',
    automaticPreflightRun: 30276239789,
    automaticPreflightJob: 90010923826,
    automaticPreflightArtifact: 8656897130,
    automaticPreflightArtifactDigest: 'sha256:b548333c6958b9ff0553c4b9af14a0480eb6c6534ab10eba96e7965218f793d9',
    custodyManifestDigest: 'sha256:40607b14ed9bf5f06225d2f2eb566e63ccdf700347065e457db8d7d50dcfc45e',
    registeredPathCount: 33,
    automaticPreflightRegisteredPathCount: 25,
    run8ER2FStarted: false
  }),
  evidenceLimitations: Object.freeze([
    'R2_NOT_YET_CLOSED_OR_PROMOTED',
    'NO_PUBLIC_RENDERER_INSTALLATION',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R2E_EXECUTION_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R2E_PASS_CLOSED_EXECUTION_EVIDENCE',
  nodeType: 'RUN_8E_R2_GOVERNED_CHECKPOINT_PACKAGE',
  nodeSubtype: 'R2E_PASS_CLOSED_REGISTRY_AND_SCOPE_EXECUTION',
  displayName: 'H-Earth Run 8E-R2E Pass-Closed Execution Evidence',
  description: 'Binds the R2E registry audit, automatic preflight, durable receipt, exact custody identities, and stopping boundary before R2F.',
  repositoryPaths: [...H_EARTH_RUN_8E_R2E_EXECUTION_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R2E_EXECUTION_EVIDENCE.evidenceId]),
  authorityClass: 'REGISTRY_REPRESENTATION_AND_INDEPENDENT_SCOPE_AUDIT',
  authorityPosture: 'R2E_PASS_CLOSED_R2F_NOT_STARTED',
  authoritySource: Object.freeze(['R2E_VALIDATION_WORKFLOW', 'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT', 'DURABLE_R2E_PASS_RECEIPT']),
  authorityScope: Object.freeze(['BIND_R2_REGISTRY_REPRESENTATION', 'BIND_EXECUTION_CUSTODY', 'CLOSE_R2E', 'STOP_BEFORE_R2F']),
  authorityLimitations: Object.freeze(['NO_R2_PROMOTION', 'NO_R3', 'NO_RUN_8E_PASS_CLOSED']),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['R2D_PASS_CLOSED_BEFORE_R2E', 'R2E_PASS_CLOSED_BEFORE_R2F']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'REGISTRY_RECEIPT_VALIDATION_WORKFLOW_ONLY',
  prohibitedMutations: Object.freeze(['PUBLIC_ROUTE_MUTATION', 'R2F_OR_R3_EXECUTION_INSIDE_R2E', 'RUN_8E_PASS_CLOSED']),
  requiredValidations: Object.freeze(['R2E_FINAL_HEAD_AUDIT', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_R2E_SCOPE']),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_R2F_CLOSURE_AND_PROMOTION_DECISION']),
  currentIdentityReferences: Object.freeze([EXECUTION_HEAD, RECEIPT_PATH]),
  lifecycleStatus: 'R2E_PASS_CLOSED',
  unresolvedFields: Object.freeze(['FINAL_R2E_HEAD', 'FINAL_CLOSURE_RUN', 'R2F_DISPOSITION'])
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
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  return freeze({
    repositoryPath,
    resolved: true,
    nodes: [...base.nodes, indexed.node],
    occurrences: [...base.occurrences, ...indexed.occurrences],
    unresolved: false
  });
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
