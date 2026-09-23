/**
 * H_EARTH_REPOSITORY_REGISTRY_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_RECONCILIATION_v1
 * Read-only registration of the post-merge main-route live-verification workflow
 * and durable receipt. Creates no product, route, deployment, renderer, camera,
 * navigation, geometry, merge, or canonicalization authority.
 */
import baseFacade from './h-earth.repository-registry.functional-environment-run7i-public-route-scope-reconciliation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-functional-environment-run7i-live-verification-001';

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_PATHS = Object.freeze([
  '/.github/workflows/h-earth-functional-environment-run7i-live-verification.yml',
  '/h-earth-3d/validation/h-earth.functional-environment.run7i.live.receipt.json'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_PATHS.map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_RUN_7I_LIVE_WORKSPACE',
    occurrenceClass: 'CANDIDATE'
  }))
);

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'EXECUTED_DEPLOYED_MAIN_ROUTE_BROWSER_AUDIT',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.functional-environment.run7i.live.receipt.json',
  sourceOccurrenceOrRevision:
    'MERGED_MAIN=3b1f21db60b51fe1ffd627b2713c6f35b2a77f7e;WORKFLOW_RUN=30211452296;JOB=89818260357;ARTIFACT=8634574221;STATUS=RUN_7I_MAIN_PUBLIC_ROUTE_LIVE_PASS',
  assertionScope: Object.freeze([
    'DEPLOYED_MAIN_ROUTE_SOURCE_IDENTITY',
    'RUN_7H_INTEGRATION_ON_ACTUAL_PUBLIC_ROUTE',
    'DESKTOP_AND_SAMSUNG_BROWSER_MATRIX',
    'FIVE_GEOGRAPHIC_WAYPOINTS',
    'FOUR_SPATIAL_LIFECYCLE_STATES',
    'PUBLIC_SHELL_AND_GESTURE_SHELL_PRESERVATION'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'PATH_REGISTRATION_ONLY',
    'BROWSER_DEVICE_AND_VIEWPORT_EMULATION_ONLY',
    'NO_PHYSICAL_SAMSUNG_INSTRUMENTATION',
    'NO_ENVIRONMENTAL_AUTHORITY_COLLAPSE',
    'NO_RENDERER_CAMERA_OR_NAVIGATION_REDEFINITION',
    'NO_CANONICALIZATION_AUTHORITY'
  ])
});

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_PACKAGE',
  displayName: 'H-Earth Functional Environment Run 7I Live Scope Package',
  description:
    'Registers the post-merge main public-route live-verification workflow and durable live receipt for read-only automatic preflight.',
  repositoryPaths: [...H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: Object.freeze([
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_EVIDENCE.evidenceId
  ]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_RUN_7I_EXECUTION_AUTHORIZATION',
    'MERGED_RUN_7I_MAIN_PUBLIC_ROUTE',
    'EXECUTED_DEPLOYED_MAIN_ROUTE_BROWSER_EVIDENCE'
  ]),
  authorityScope: Object.freeze([
    'EXACT_RUN_7I_LIVE_REPOSITORY_PATH_RESOLUTION',
    'RUN_7I_LIVE_EVIDENCE_PACKAGE_MEMBERSHIP',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_SCOPE'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_REDEFINE_PRODUCT_OR_ENVIRONMENTAL_AUTHORITIES',
    'PATH_REGISTRATION_DOES_NOT_CREATE_RENDERER_CAMERA_NAVIGATION_OR_GEOMETRY_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_DEPLOYMENT_MERGE_OR_CANONICALIZATION_AUTHORITY'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'READ_ONLY_PREFLIGHT_PATH_REGISTRATION_ONLY',
  prohibitedMutations: Object.freeze([
    'NATIVE_ENVIRONMENTAL_AUTHORITY_REDEFINITION',
    'RENDERER_CAMERA_NAVIGATION_OR_GEOMETRY_AUTHORITY_REDEFINITION',
    'PRODUCTION_ACTIVATION_BY_REGISTRY_OVERLAY'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_RUN_7I_LIVE_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'RUN_7I_MAIN_PUBLIC_ROUTE_LIVE_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_RUN_7I_LIVE_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_LIVE_RECEIPT_OR_WORKFLOW_IDENTITY_REGRESSES'
  ]),
  currentIdentityReferences: Object.freeze([
    '3b1f21db60b51fe1ffd627b2713c6f35b2a77f7e',
    'WORKFLOW_RUN_30211452296',
    'ARTIFACT_8634574221'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_PATHS.map((path) => [
    path,
    {
      node: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === path)
    }
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE
  ]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE.nodeId
    ? H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_EVIDENCE
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
      nodeId: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE.nodeId,
      node: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE,
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
  const node = H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE;
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
    id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE.nodeId
    ? freeze({
        nodeId: id,
        nodes: [H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_SCOPE_NODE],
        relations: [],
        unresolved: false
      })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_RECONCILED_FACADE = freeze({
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

export default H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_LIVE_RECONCILED_FACADE;
