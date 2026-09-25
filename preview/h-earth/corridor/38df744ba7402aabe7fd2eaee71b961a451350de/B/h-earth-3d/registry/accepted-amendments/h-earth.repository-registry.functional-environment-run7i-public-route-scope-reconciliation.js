/**
 * H_EARTH_REPOSITORY_REGISTRY_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_RECONCILIATION_v1
 * Read-only path-registration overlay for main public H-Earth route integration.
 * Creates no environment, renderer, camera, navigation, deployment, merge, or
 * canonicalization authority.
 */
import baseFacade from './h-earth.repository-registry.functional-environment-run7h-scope-reconciliation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-functional-environment-run7i-public-route-001';

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_PATHS = Object.freeze([
  '/showroom/globe/h-earth/index.html',
  '/.github/workflows/h-earth-functional-environment-run7i-public-route-validation.yml',
  '/h-earth-3d/validation/h-earth.functional-environment.run7i.public-route.receipt.json'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_PATHS.map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_RUN_7I_WORKSPACE',
    occurrenceClass: 'CANDIDATE'
  }))
);

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'EXECUTED_REPOSITORY_WORKSPACE_AND_PUBLIC_ROUTE_BROWSER_AUDIT',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.functional-environment.run7i.public-route.receipt.json',
  sourceOccurrenceOrRevision: 'RUN_7I_PUBLIC_ROUTE_WORKSPACE_PENDING_EXECUTION',
  assertionScope: Object.freeze([
    'MAIN_PUBLIC_ROUTE_RUN_7H_CONSUMPTION',
    'PUBLIC_SHELL_AND_GESTURE_PRESERVATION',
    'DESKTOP_AND_SAMSUNG_BROWSER_MATRIX',
    'READ_ONLY_AUTOMATIC_PREFLIGHT_SCOPE'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'PATH_REGISTRATION_ONLY',
    'NO_ENVIRONMENTAL_AUTHORITY_COLLAPSE',
    'NO_RENDERER_CAMERA_OR_NAVIGATION_REDEFINITION',
    'NO_CANONICALIZATION_AUTHORITY',
    'NO_PHYSICAL_SAMSUNG_INSTRUMENTATION_CLAIM'
  ])
});

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_PACKAGE',
  displayName: 'H-Earth Functional Environment Run 7I Public Route Scope Package',
  description:
    'Registers the exact main public H-Earth route, branch-native validation workflow, and durable receipt paths for read-only automatic preflight.',
  repositoryPaths: [...H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: Object.freeze([
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_EVIDENCE.evidenceId
  ]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_RUN_7I_PUBLIC_ROUTE_EXECUTION_AUTHORIZATION',
    'RUN_7H_EXECUTED_FUNCTIONAL_ENVIRONMENT_AUTHORITIES',
    'MAIN_PUBLIC_ROUTE_INTEGRATION_CORRECTION'
  ]),
  authorityScope: Object.freeze([
    'EXACT_RUN_7I_REPOSITORY_PATH_RESOLUTION',
    'RUN_7I_CHECKPOINT_PACKAGE_MEMBERSHIP',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_SCOPE'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_REDEFINE_ENVIRONMENTAL_AUTHORITIES',
    'PATH_REGISTRATION_DOES_NOT_CREATE_RENDERER_CAMERA_NAVIGATION_OR_GEOMETRY_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_ACTIVATE_PRODUCTION_BY_ITSELF'
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
    'EXACT_RUN_7I_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'RUN_7I_WORKSPACE_BROWSER_PASS',
    'RUN_7I_MAIN_PUBLIC_ROUTE_LIVE_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_RUN_7I_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_MAIN_PUBLIC_ROUTE_WORKFLOW_REGRESSES',
    'STOP_IF_PUBLIC_SHELL_OR_GESTURE_AUTHORITY_IS_REPLACED'
  ]),
  currentIdentityReferences: Object.freeze([
    'H_EARTH_FUNCTIONAL_ENVIRONMENT_COMPOSITE_RUN_7H_v1',
    'RUN_7I_PUBLIC_ROUTE_WORKSPACE'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_PATHS.map((path) => [
    path,
    {
      node: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === path)
    }
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE
  ]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE.nodeId
    ? H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_EVIDENCE
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
      nodeId: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE.nodeId,
      node: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE,
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
  const node = H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE;
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
    id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE.nodeId
    ? freeze({
        nodeId: id,
        nodes: [H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_SCOPE_NODE],
        relations: [],
        unresolved: false
      })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_RECONCILED_FACADE = freeze({
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

export default H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7I_PUBLIC_ROUTE_RECONCILED_FACADE;
