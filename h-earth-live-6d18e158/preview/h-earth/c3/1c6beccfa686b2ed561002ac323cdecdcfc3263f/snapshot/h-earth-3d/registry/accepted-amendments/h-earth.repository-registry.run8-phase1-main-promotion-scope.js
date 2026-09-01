/** Read-only Run 8 Phase 1 ordered-main-promotion reconciliation overlay. */
import baseFacade from './h-earth.repository-registry.run8e-integration-engineering-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const REF_NAME = 'main';
const PROMOTED_STACK_HEAD = 'df1e1c7aad32a63fd35186cca0351b49b561579e';

export const H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8-phase1-main-promotion-validation.yml',
  '/h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js',
  '/h-earth-3d/validation/h-earth.run8.phase1-main-promotion.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8.phase1-main-promotion.receipt.json',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8-phase1-main-promotion-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_PATHS.map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: REF_NAME,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_PHASE_1_RECONCILIATION_WORKSPACE',
    occurrenceClass: 'MAIN_PROMOTION_RECONCILIATION'
  }))
);

export const H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_v1',
  evidenceClass: 'EXECUTED_REPOSITORY_PROMOTION_EVIDENCE',
  sourceKind: 'ORDERED_GITHUB_PULL_REQUEST_MAIN_PROMOTION',
  sourceIdOrPath: '/h-earth-3d/validation/h-earth.run8.phase1-main-promotion.receipt.json',
  sourceOccurrenceOrRevision: PROMOTED_STACK_HEAD,
  assertionScope: Object.freeze([
    'RUN_8A_PR_188_ORDERED_MAIN_PROMOTION',
    'RUN_8B_PR_190_ORDERED_MAIN_PROMOTION',
    'RUN_8C_PR_192_ORDERED_MAIN_PROMOTION',
    'RUN_8D_PR_194_ORDERED_MAIN_PROMOTION',
    'RUN_8E_PR_196_ORDERED_MAIN_PROMOTION',
    'ALL_FIVE_CHECKPOINT_HEADS_CONTAINED_IN_MAIN',
    'RUN_8E_HEAD_ANCESTOR_OF_MAIN',
    'PUBLIC_ROUTE_REINTEGRATION_CONTAINED_IN_MAIN',
    'BRANCH_NATIVE_PHASE_1_VALIDATION'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'DEPLOYMENT_NOT_ESTABLISHED',
    'LIVE_IDENTITY_AND_BROWSER_PROOF_NOT_ESTABLISHED',
    'PHYSICAL_SAMSUNG_EXECUTION_NOT_ESTABLISHED',
    'RUN_8E_PASS_CLOSED_NOT_CLAIMED'
  ])
});

export const H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_PACKAGE',
  nodeType: 'PROMOTION_PACKET',
  nodeSubtype: 'RUN_8_ORDERED_MAIN_PROMOTION',
  displayName: 'H-Earth Run 8 Phase 1 Ordered Main Promotion',
  description:
    'Registers the exact ordered promotion of Run 8A through Run 8E into main and the bounded control-state reconciliation that follows it.',
  repositoryPaths: [...H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_REPOSITORY_PROMOTION_EVIDENCE',
  evidenceReferences: Object.freeze([H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_PHASE_1_MAIN_PROMOTION_RECONCILIATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_PHASE_1_COMPLETION_AUTHORIZATION',
    'RUN_8A_THROUGH_RUN_8D_PASS_CLOSED',
    'RUN_8E_ENGINEERING_AND_BRANCH_EXECUTION_PASS'
  ]),
  authorityScope: Object.freeze([
    'ORDERED_MAIN_PROMOTION_IDENTITY',
    'MAIN_ANCESTRY_AND_SEQUENCE_VERIFICATION',
    'RUN_8E_CONTROL_PROMOTION_STATE_RECONCILIATION'
  ]),
  authorityLimitations: Object.freeze([
    'DOES_NOT_ESTABLISH_DEPLOYMENT',
    'DOES_NOT_ESTABLISH_LIVE_BROWSER_IDENTITY',
    'DOES_NOT_ESTABLISH_PHYSICAL_SAMSUNG_EXECUTION',
    'DOES_NOT_CLOSE_RUN_8E'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([
    'RUN_8A_BEFORE_RUN_8B',
    'RUN_8B_BEFORE_RUN_8C',
    'RUN_8C_BEFORE_RUN_8D',
    'RUN_8D_BEFORE_RUN_8E'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'READ_ONLY_PROMOTION_RECONCILIATION_ONLY',
  prohibitedMutations: Object.freeze([
    'RUN_8_PREDECESSOR_REOPENING',
    'SUCCESSOR_GEOMETRY_REDEFINITION',
    'DEPLOYMENT_CLAIM',
    'LIVE_PROOF_CLAIM',
    'PHYSICAL_SAMSUNG_CLAIM'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_ORDERED_MERGE_SEQUENCE',
    'ALL_FIVE_CHECKPOINT_HEADS_CONTAINED_IN_MAIN',
    'RUN_8E_HEAD_BEHIND_MAIN_BY_ZERO',
    'RUN_8_PHASE_1_MAIN_PROMOTION_HARNESS_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_CHECKPOINT_HEAD_IS_MISSING_FROM_MAIN',
    'STOP_IF_ORDERED_MERGE_SEQUENCE_IS_NOT_PRESERVED',
    'STOP_IF_PHASE_1_RECEIPT_OVERCLAIMS_DEPLOYMENT_LIVE_OR_DEVICE_PROOF'
  ]),
  currentIdentityReferences: Object.freeze([
    PROMOTED_STACK_HEAD,
    '2e1ce0d1e1c8911c14339eb41643081c9bda9cbc',
    'a10d6160378ac6ec83742f6530461cc433957298',
    '82b237284d6390005843174b0dfe23b6b7ac81c0',
    '716a4370cf5ef320b12d3731aff577dcd6bb778b'
  ]),
  lifecycleStatus: 'PROMOTED',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_PATHS.map((path) => [path, {
  node: H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === path)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE.nodeId
    ? H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_EVIDENCE
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
      nodeId: H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE.nodeId,
      node: H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE,
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
  const node = H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode =
  (id, direction = 'BOTH') =>
    id === H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_RECONCILED_FACADE = freeze({
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

export default H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_RECONCILED_FACADE;
