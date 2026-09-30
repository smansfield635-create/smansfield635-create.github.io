/** Read-only Run 8 Phase 2 deployment-reconciliation overlay. */
import baseFacade from './h-earth.repository-registry.run8-phase1-main-promotion-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8-phase2-deployment-reconciliation-001';
const DEPLOYMENT_TARGET_MAIN_HEAD = '0ae82d417dd7868f0546891d4e720abdb294d466';
const LIVE_ORIGIN = 'https://smansfield635-create.github.io';

export const H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8-phase2-deployment-reconciliation.yml',
  '/h-earth-3d/validation/h-earth.run8.phase2-deployment-reconciliation.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8.phase2-deployment-reconciliation.receipt.json',
  '/h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8-phase2-deployment-reconciliation-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PATHS.map((repositoryPath) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_PHASE_2_RECONCILIATION_WORKSPACE',
    occurrenceClass: 'DEPLOYMENT_RECONCILIATION'
  }))
);

export const H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_v1',
  evidenceClass: 'EXECUTED_DEPLOYMENT_EVIDENCE',
  sourceKind: 'GITHUB_PAGES_DEPLOYMENT_AND_EXACT_LIVE_BYTE_RECONCILIATION',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.run8.phase2-deployment-reconciliation.receipt.json',
  sourceOccurrenceOrRevision: DEPLOYMENT_TARGET_MAIN_HEAD,
  assertionScope: Object.freeze([
    'GITHUB_PAGES_SOURCE_MAIN_ROOT',
    'GITHUB_PAGES_BUILD_COMMIT_MATCHES_PHASE_1_MAIN_HEAD',
    'PUBLIC_H_EARTH_ROUTE_DEPLOYED',
    'SIX_DEPLOYED_FILES_EXACT_BYTE_IDENTITY',
    'PUBLIC_ROUTE_REFERENCES_ENVIRONMENT_INTEGRATION',
    'LIVE_ENVIRONMENT_INTEGRATION_IS_RUN_8E',
    'LIVE_RENDERER_IS_RUN_8E',
    'LIVE_PACKET_002_TRANSFER_IS_RUN_8E',
    'LIVE_CONTROL_RECORDS_PHASE_1_PROMOTION_PASS',
    'LIVE_PHASE_1_PROMOTION_RECEIPT_VALID'
  ]),
  verifiedOn: '2026-07-26',
  evidenceMetadata: freeze({
    liveOrigin: LIVE_ORIGIN,
    validationRun: 30221010693,
    validationJob: 89843362318,
    artifactId: 8637201596,
    artifactDigest:
      'sha256:81d3bbc5a6894daa29a46ebe7ff6b63945a1de6ce083ca2e5b5960a68e2e03e9',
    receiptSha256:
      'd5d6fd208545cae21fc8f6a5da041ec5dc57b2a897a881adb9a8fa825a2936b9',
    deployedFileIdentityCount: 6
  }),
  evidenceLimitations: Object.freeze([
    'PHASE_3_LIVE_BROWSER_EXECUTION_NOT_INCLUDED',
    'PHYSICAL_SAMSUNG_EXECUTION_NOT_INCLUDED',
    'RUN_8E_PASS_CLOSED_NOT_CLAIMED'
  ])
});

export const H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PACKAGE',
  nodeType: 'DEPLOYMENT_PACKET',
  nodeSubtype: 'RUN_8_GITHUB_PAGES_DEPLOYMENT_RECONCILIATION',
  displayName: 'H-Earth Run 8 Phase 2 Deployment Reconciliation',
  description:
    'Registers the GitHub Pages build identity, six exact deployed-file comparisons, and public H-Earth Run 8 route replacement evidence.',
  repositoryPaths: [...H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_DEPLOYMENT_EVIDENCE',
  evidenceReferences: Object.freeze([H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_PHASE_2_DEPLOYMENT_RECONCILIATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_PHASE_2_EXECUTION_AUTHORIZATION',
    'RUN_8_PHASE_1_ORDERED_MAIN_PROMOTION_PASS_CLOSED',
    'GITHUB_PAGES_LIVE_DEPLOYMENT_EVIDENCE'
  ]),
  authorityScope: Object.freeze([
    'DEPLOYMENT_TARGET_MAIN_IDENTITY',
    'GITHUB_PAGES_SOURCE_AND_BUILD_IDENTITY',
    'EXACT_DEPLOYED_FILE_BYTE_IDENTITY',
    'PUBLIC_H_EARTH_ROUTE_RUN_8_REPLACEMENT',
    'RUN_8E_CONTROL_DEPLOYMENT_STATE_RECONCILIATION'
  ]),
  authorityLimitations: Object.freeze([
    'DOES_NOT_ESTABLISH_PHASE_3_LIVE_BROWSER_PROOF',
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
    'PHASE_1_MAIN_PROMOTION_BEFORE_PHASE_2_DEPLOYMENT',
    'PHASE_2_DEPLOYMENT_BEFORE_PHASE_3_LIVE_BROWSER_PROOF'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'READ_ONLY_DEPLOYMENT_RECONCILIATION_ONLY',
  prohibitedMutations: Object.freeze([
    'RUN_8_PRODUCT_SOURCE_MUTATION',
    'CAMERA_OR_NAVIGATION_AUTHORITY_REPLACEMENT',
    'PHASE_3_LIVE_BROWSER_PROOF_CLAIM',
    'PHYSICAL_SAMSUNG_EXECUTION_CLAIM',
    'RUN_8E_PASS_CLOSED_CLAIM'
  ]),
  requiredValidations: Object.freeze([
    'GITHUB_PAGES_BUILD_COMMIT_MATCH',
    'SIX_EXACT_DEPLOYED_FILE_IDENTITIES',
    'PUBLIC_ROUTE_RUN_8E_IDENTITY',
    'RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_HARNESS_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_PAGES_SOURCE_IS_NOT_MAIN_ROOT',
    'STOP_IF_DEPLOYMENT_COMMIT_DOES_NOT_MATCH_PHASE_1_MAIN_HEAD',
    'STOP_IF_ANY_DEPLOYED_FILE_DIFFERS_FROM_MAIN',
    'STOP_IF_PUBLIC_ROUTE_IS_NOT_RUN_8E',
    'STOP_IF_PHASE_2_RECEIPT_OVERCLAIMS_BROWSER_OR_DEVICE_PROOF'
  ]),
  currentIdentityReferences: Object.freeze([
    DEPLOYMENT_TARGET_MAIN_HEAD,
    LIVE_ORIGIN,
    'H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_RECEIPT'
  ]),
  lifecycleStatus: 'DEPLOYED',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PATHS.map((repositoryPath) => [repositoryPath, {
    node: H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE,
    occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
  }])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE.nodeId
    ? H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_EVIDENCE
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
      nodeId: H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE.nodeId,
      node: H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE,
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
  const node = H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE;
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
    id === H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILED_FACADE = freeze({
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

export default H_EARTH_RUN_8_PHASE_2_DEPLOYMENT_RECONCILED_FACADE;
