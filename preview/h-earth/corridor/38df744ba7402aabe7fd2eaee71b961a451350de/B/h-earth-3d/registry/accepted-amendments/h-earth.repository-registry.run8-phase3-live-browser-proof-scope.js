/** Read-only Run 8 Phase 3 live-browser-proof overlay. */
import baseFacade from './h-earth.repository-registry.run8-phase2-deployment-reconciliation-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8-phase3-live-browser-proof-001';
const LIVE_BROWSER_DEPLOYMENT_HEAD = '65ed401f5a99679a93b5baad751678bfc49c19c9';
const CUSTOM_LIVE_ROUTE = 'https://diamondgatebridge.com/showroom/globe/h-earth/';
const GITHUB_LIVE_ROUTE =
  'https://smansfield635-create.github.io/showroom/globe/h-earth/';

export const H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_PROOF_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8-phase3-live-browser-proof.yml',
  '/h-earth-3d/validation/h-earth.run8.phase3-live-browser-proof.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8.phase3-live-browser-proof.receipt.json',
  '/h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8-phase3-live-browser-proof-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_PROOF_PATHS.map((repositoryPath) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_PHASE_3_LIVE_BROWSER_WORKSPACE',
    occurrenceClass: 'LIVE_BROWSER_PROOF'
  }))
);

export const H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_PROOF_v1',
  evidenceClass: 'EXECUTED_LIVE_BROWSER_EVIDENCE',
  sourceKind: 'DEPLOYED_PUBLIC_ROUTE_MULTI_CONFIGURATION_BROWSER_EXECUTION',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.run8.phase3-live-browser-proof.receipt.json',
  sourceOccurrenceOrRevision: LIVE_BROWSER_DEPLOYMENT_HEAD,
  assertionScope: Object.freeze([
    'PAGES_BUILD_COMMIT_MATCHES_PHASE_2_MAIN_HEAD',
    'CUSTOM_AND_GITHUB_PAGES_ROUTE_BYTE_IDENTITY',
    'DESKTOP_LIVE_CHROMIUM_EXECUTION',
    'SAMSUNG_GALAXY_PORTRAIT_BROWSER_EMULATION',
    'SAMSUNG_GALAXY_LANDSCAPE_BROWSER_EMULATION',
    'SUCCESSOR_TERRAIN_AND_MOUNTAIN_VISIBLE',
    'GROUNDED_VEGETATION_VISIBLE',
    'SHARED_DEPTH_AND_OCCLUSION_EXECUTED',
    'SINGLE_SKY_AUTHORITY_VISIBLE',
    'SUN_DISC_VISIBLE_IN_AT_LEAST_ONE_FRAME',
    'ALPHA_CLOSED_IN_ALL_EXECUTED_FRAMES',
    'RUN_8E_LIVE_MODULE_IDENTITY_LOADED',
    'ZERO_CONSOLE_PAGE_REQUEST_OR_HTTP_ERRORS'
  ]),
  verifiedOn: '2026-07-26',
  evidenceMetadata: freeze({
    customLiveRoute: CUSTOM_LIVE_ROUTE,
    githubLiveRoute: GITHUB_LIVE_ROUTE,
    validationRun: 30221430665,
    validationJob: 89844438771,
    artifactId: 8637334761,
    artifactDigest:
      'sha256:33111055c9a60342677117a4eb26fbb636120fc977e481f6ad6d5c28913ad0b8',
    receiptGitBlob: '3abb151881b61732a43ed099d8a18ad3e15a97ea',
    receiptSha256:
      '11186bfcd7782f587cfa817984b8bafa0c86fe35e8d23ec227d56b96f531853a',
    configurationCount: 3,
    screenshotCount: 3
  }),
  evidenceLimitations: Object.freeze([
    'SAMSUNG_CONFIGURATIONS_ARE_BROWSER_EMULATION_NOT_PHYSICAL_DEVICE_EXECUTION',
    'PHYSICAL_SAMSUNG_EXECUTION_NOT_INCLUDED',
    'RUN_8E_PASS_CLOSED_NOT_CLAIMED'
  ])
});

export const H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_PROOF_PACKAGE',
  nodeType: 'LIVE_PROOF_PACKET',
  nodeSubtype: 'RUN_8_DEPLOYED_MULTI_CONFIGURATION_BROWSER_PROOF',
  displayName: 'H-Earth Run 8 Phase 3 Live Browser Proof',
  description:
    'Registers desktop and Samsung-like portrait/landscape Chromium execution of the deployed Run 8 public H-Earth route, including visible successor environment, shared-depth, sky, sun, alpha, module identity, and error-free evidence.',
  repositoryPaths: [...H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_PROOF_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_LIVE_BROWSER_EVIDENCE',
  evidenceReferences: Object.freeze([H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_PHASE_3_LIVE_BROWSER_PROOF',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_PHASE_3_EXECUTION_AUTHORIZATION',
    'RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PASS_CLOSED',
    'DEPLOYED_PUBLIC_ROUTE_BROWSER_EXECUTION'
  ]),
  authorityScope: Object.freeze([
    'LIVE_DEPLOYMENT_HEAD_IDENTITY',
    'CUSTOM_AND_GITHUB_ROUTE_IDENTITY',
    'DESKTOP_AND_SAMSUNG_EMULATION_BROWSER_EXECUTION',
    'LIVE_SUCCESSOR_ENVIRONMENT_VISIBILITY',
    'LIVE_SHARED_DEPTH_SKY_SUN_AND_ALPHA_PROOF',
    'LIVE_BROWSER_ERROR_ABSENCE',
    'RUN_8E_CONTROL_LIVE_BROWSER_STATE_RECONCILIATION'
  ]),
  authorityLimitations: Object.freeze([
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
    'PHASE_2_DEPLOYMENT_BEFORE_PHASE_3_LIVE_BROWSER_PROOF',
    'PHASE_3_LIVE_BROWSER_PROOF_BEFORE_PHYSICAL_SAMSUNG_EXECUTION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'READ_ONLY_LIVE_BROWSER_PROOF_RECONCILIATION_ONLY',
  prohibitedMutations: Object.freeze([
    'RUN_8_PRODUCT_SOURCE_MUTATION',
    'CAMERA_OR_NAVIGATION_AUTHORITY_REPLACEMENT',
    'PHYSICAL_SAMSUNG_EXECUTION_CLAIM',
    'RUN_8E_PASS_CLOSED_CLAIM'
  ]),
  requiredValidations: Object.freeze([
    'PAGES_BUILD_COMMIT_MATCH',
    'CUSTOM_AND_GITHUB_ROUTE_BYTE_IDENTITY',
    'THREE_CONFIGURATION_LIVE_BROWSER_MATRIX',
    'TERRAIN_MOUNTAIN_VEGETATION_DEPTH_SKY_SUN_ALPHA_PROOF',
    'ZERO_LIVE_BROWSER_ERRORS',
    'RUN_8_PHASE_3_LIVE_BROWSER_PROOF_HARNESS_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_DEPLOYMENT_HEAD_DOES_NOT_MATCH_PHASE_2_MAIN',
    'STOP_IF_CUSTOM_AND_GITHUB_ROUTE_BYTES_DIFFER',
    'STOP_IF_ANY_BROWSER_CONFIGURATION_FAILS',
    'STOP_IF_ANY_REQUIRED_ENVIRONMENT_CLASS_IS_NOT_VISIBLE',
    'STOP_IF_ANY_BROWSER_CONSOLE_PAGE_REQUEST_OR_HTTP_ERROR_OCCURS',
    'STOP_IF_PHASE_3_RECEIPT_OVERCLAIMS_PHYSICAL_DEVICE_OR_FINAL_CLOSURE'
  ]),
  currentIdentityReferences: Object.freeze([
    LIVE_BROWSER_DEPLOYMENT_HEAD,
    CUSTOM_LIVE_ROUTE,
    GITHUB_LIVE_ROUTE,
    'H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_PROOF_RECEIPT'
  ]),
  lifecycleStatus: 'LIVE_BROWSER_VERIFIED',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_PROOF_PATHS.map((repositoryPath) => [repositoryPath, {
    node: H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE,
    occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
  }])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE.nodeId
    ? H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_EVIDENCE
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
      nodeId: H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE.nodeId,
      node: H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE,
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
  const node = H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE;
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
    id === H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_RECONCILED_FACADE = freeze({
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

export default H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_RECONCILED_FACADE;
