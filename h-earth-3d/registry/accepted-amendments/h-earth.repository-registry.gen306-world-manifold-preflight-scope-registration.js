/**
 * H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_REGISTRATION_v1
 * Read-only registry successor for the four Gen306 architecture paths that are
 * authorized by the canonical Gen306 lock but intentionally absent from the
 * frozen public construction base before architecture construction begins.
 */
import baseFacade from './h-earth.repository-registry.gen305-s26-preflight-scope-registration.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

const normalizePath = (value) => {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const TOOLING_PREDECESSOR_HEAD = '8c451f13bc468a6bc9c4729789938c17a134d1da';
const FROZEN_PUBLIC_BASE = 'a7b13dd5cebeafe6ce126d7df64c4088db7feb48';
const PRIVATE_GOVERNING_HEAD = '804e2c31c10ab04a73c1cfbae883892735a62f3d';
const LOCK_GENERATION = 306;
const OPERATION_ID = 'H_EARTH_WORLD_MANIFOLD_ARCHITECTURE_INSTALLATION_20260817_002';
const NODE_ID = 'H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_REGISTRATION';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_REGISTRATION_v1';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gen306-world-manifold-preflight-scope-registration.js';

export const H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_TARGET_PATHS = Object.freeze([
  '/h-earth-3d/terrain/h-earth.world-manifold-domain.js',
  '/h-earth-3d/integration/h-earth.world-representation-plan.js',
  '/h-earth-3d/integration/h-earth.world-manifold-union-admission.js',
  '/h-earth-3d/validation/h-earth.world-manifold-architecture.harness.mjs'
]);

export const H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_REGISTERED_PATHS = Object.freeze([
  ...H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_TARGET_PATHS,
  AMENDMENT_PATH
]);

const targetOccurrences = H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_TARGET_PATHS.map((path) => deepFreeze({
  repository: REPOSITORY,
  refType: 'COMMIT',
  refName: FROZEN_PUBLIC_BASE,
  commitSha: FROZEN_PUBLIC_BASE,
  path,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'ABSENT',
  fetchbackStatus: 'VERIFIED_NOT_MATERIALIZED_IN_FROZEN_GEN306_PUBLIC_BASE_BEFORE_ARCHITECTURE_CONSTRUCTION',
  occurrenceClass: 'GEN306_AUTHORIZED_FUTURE_PATH_NOT_YET_MATERIALIZED'
}));

const OCCURRENCES = Object.freeze([
  ...targetOccurrences,
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: TOOLING_PREDECESSOR_HEAD,
    commitSha: TOOLING_PREDECESSOR_HEAD,
    path: AMENDMENT_PATH,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_ABSENT_AT_PREDECESSOR_TOOLING_HEAD_BEFORE_GEN306_SCOPE_REPAIR',
    occurrenceClass: 'REGISTRY_REPAIR_SELF_PATH_NOT_YET_MATERIALIZED_AT_PREDECESSOR'
  })
]);

export const H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'AUTHORIZED_FUTURE_PATH_SCOPE_WITH_TRUTHFUL_ABSENT_OCCURRENCE_STATE',
  sourceKind: 'CANONICAL_GEN306_LOCK_ROUTER_AND_NATIVE_PREFLIGHT_UNRESOLVED_PATH_RECEIPT',
  sourceIdOrPath: 'PRIVATE_ISSUE_277_AND_PUBLIC_CARRIER_PR_1263',
  sourceOccurrenceOrRevision: `PRIVATE_HEAD=${PRIVATE_GOVERNING_HEAD};LOCK_GENERATION=${LOCK_GENERATION};OPERATION=${OPERATION_ID};PUBLIC_BASE=${FROZEN_PUBLIC_BASE};TOOLING_PREDECESSOR=${TOOLING_PREDECESSOR_HEAD};NATIVE_PREFLIGHT_RUN=32080043674`,
  exactTargetPathCount: 4,
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope: Object.freeze([
    'EXACT_FOUR_GEN306_WORLD_MANIFOLD_FUTURE_PATHS',
    'TRUTHFUL_ABSENCE_AT_FROZEN_PUBLIC_BASE',
    'NATIVE_PREFLIGHT_REQUESTED_PATH_UNRESOLVED_REPAIR_ONLY',
    'NO_ARCHITECTURE_OR_PRODUCT_BYTE_MATERIALIZATION'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PRODUCT_MUTATION_AUTHORITY',
    'NO_ARCHITECTURE_CONSTRUCTION_AUTHORITY_CREATED_BY_REGISTRY',
    'NO_GEOGRAPHY_TERRAIN_NAVIGATION_COLLISION_RENDERER_OR_WATER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ])
});

export const H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'GEN306_AUTHORIZED_FUTURE_WORLD_MANIFOLD_PATH_PREFLIGHT_SCOPE',
  displayName: 'H-Earth Gen306 World-Manifold Preflight Scope Registration',
  description: 'Registers exactly four Gen306 world-manifold architecture paths for repository-registry preflight resolution while preserving their truthful absent state before construction.',
  repositoryPaths: [...H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_REGISTERED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUTHORIZED_FUTURE_SCOPE_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  authoritySource: Object.freeze([
    'GEN306_LOCK_GENERATION_306',
    OPERATION_ID,
    'GEN306_EXACT_ELEVEN_PATH_MUTATION_ROUTER_PASS_RUN_32079611782',
    'GEN306_NATIVE_PREFLIGHT_REQUESTED_PATH_UNRESOLVED_RUN_32080043674'
  ]),
  authorityScope: Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION',
    'NO_ARCHITECTURE_CONSTRUCTION_AUTHORITY_CREATED_BY_REGISTRY',
    'NO_SCOPE_EXPANSION_BEYOND_FOUR_GEN306_TARGETS_AND_THIS_AMENDMENT',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION'
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
    'GEN306_ADMISSION_AND_ROUTER_PASS_PRECEDE_THIS_SCOPE_REGISTRATION',
    'NATIVE_PREFLIGHT_PASS_PRECEDES_ANY_GEN306_ARCHITECTURE_MUTATION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  prohibitedMutations: Object.freeze(['PRODUCT_MUTATION','ARCHITECTURE_CONSTRUCTION','MERGE','DEPLOYMENT','RELEASE']),
  requiredValidations: Object.freeze([
    'EXACT_FOUR_TARGET_PATHS',
    'TARGET_OCCURRENCES_TRUTHFULLY_ABSENT_AT_FROZEN_PUBLIC_BASE',
    'PREDECESSOR_REGISTRY_PATHS_REMAIN_RESOLVED',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_PATH_OUTSIDE_EXACT_SCOPE',
    'STOP_ON_PREDECESSOR_REGRESSION',
    'STOP_BEFORE_ARCHITECTURE_MUTATION_UNTIL_NATIVE_PREFLIGHT_PASS'
  ]),
  currentIdentityReferences: Object.freeze([
    FROZEN_PUBLIC_BASE,
    TOOLING_PREDECESSOR_HEAD,
    PRIVATE_GOVERNING_HEAD,
    'LOCK_GENERATION=306',
    OPERATION_ID
  ]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_REGISTERED_PATHS.map((repositoryPath) => [
  repositoryPath,
  deepFreeze({
    nodes: Object.freeze([H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE]),
    occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
  })
]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [...(baseInstance.evidenceRecords ?? []), H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID), H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID ? H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID ? H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({
    ...base,
    repositoryPath: normalized,
    resolved: true,
    nodes: [...(base.nodes ?? []), ...indexed.nodes],
    occurrences: [...(base.occurrences ?? []), ...indexed.occurrences],
    unresolved: false
  });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES.filter((entry) => {
    if (normalizedPath != null && entry.path !== normalizedPath) return false;
    if (input.refType != null && entry.refType !== input.refType) return false;
    if (input.refName != null && entry.refName !== input.refName) return false;
    if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
    if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
    if (input.existenceStatus != null && entry.existenceStatus !== input.existenceStatus) return false;
    return true;
  }).map((occurrence) => deepFreeze({ nodeId: NODE_ID, node: H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({
    ...input,
    ...(normalizedPath == null ? {} : { path: normalizedPath })
  });
  return deepFreeze({
    query: base.query,
    matches: [...(base.matches ?? []), ...localMatches],
    resolved: base.resolved === true || localMatches.length > 0
  });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE;
  const normalizedRepositoryPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const matches =
    (normalizedRepositoryPath == null || node.repositoryPaths.includes(normalizedRepositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(matches ? [...base, node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') {
  return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  if (nodeId === NODE_ID) return deepFreeze({ nodeId, nodes: [H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE], relations: [], unresolved: false });
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthGen306WorldManifoldPreflightScopeRegistration() {
  const pathChecks = H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_REGISTERED_PATHS.map((repositoryPath) => {
    const expected = OCCURRENCES.find((entry) => entry.path === repositoryPath);
    const resolution = resolveHEarthRepositoryRegistryPath(repositoryPath);
    const occurrence = (resolution.occurrences ?? []).find((entry) =>
      entry.path === expected.path &&
      entry.commitSha === expected.commitSha &&
      entry.gitBlobSha === expected.gitBlobSha &&
      entry.existenceStatus === expected.existenceStatus
    );
    return deepFreeze({
      repositoryPath,
      resolved: resolution.resolved === true,
      occurrenceMatched: occurrence != null,
      pass: resolution.resolved === true && occurrence != null
    });
  });
  const predecessorRun8E = baseFacade.resolveHEarthRepositoryRegistryPath('/showroom/globe/h-earth/render/run8e-successor-environment.js');
  const predecessorRun8B = baseFacade.resolveHEarthRepositoryRegistryPath('/h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js');
  const checks = deepFreeze({
    exactFourTargetPaths: H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_TARGET_PATHS.length === 4,
    exactFiveRegisteredPathsIncludingSelf: H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_REGISTERED_PATHS.length === 5,
    allRegisteredPathsResolve: pathChecks.every((entry) => entry.pass),
    targetOccurrencesTruthfullyAbsent: targetOccurrences.every((entry) => entry.existenceStatus === 'ABSENT' && entry.gitBlobSha === null),
    exactLockGeneration: LOCK_GENERATION === 306,
    exactFrozenPublicBase: FROZEN_PUBLIC_BASE === 'a7b13dd5cebeafe6ce126d7df64c4088db7feb48',
    exactPredecessorToolingHead: TOOLING_PREDECESSOR_HEAD === '8c451f13bc468a6bc9c4729789938c17a134d1da',
    predecessorRun8EResolutionPreserved: predecessorRun8E.resolved === true,
    predecessorRun8BResolutionPreserved: predecessorRun8B.resolved === true,
    noProductAuthority: H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION'),
    noConstructionAuthorityCreatedByRegistry: H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_NODE.authorityLimitations.includes('NO_ARCHITECTURE_CONSTRUCTION_AUTHORITY_CREATED_BY_REGISTRY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status: eligible
      ? 'H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_REGISTRATION_PASS'
      : 'H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_REGISTRATION_FAIL',
    checks,
    pathChecks
  });
}

export const H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_FACADE = deepFreeze({
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

export default H_EARTH_GEN306_WORLD_MANIFOLD_PREFLIGHT_SCOPE_FACADE;
