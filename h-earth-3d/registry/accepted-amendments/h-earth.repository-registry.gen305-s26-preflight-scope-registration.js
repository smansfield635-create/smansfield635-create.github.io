/**
 * H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_REGISTRATION_v1
 * Read-only registry successor for the two Gen305 S26 paths that are
 * intentionally not yet materialized in the frozen C3C3R5 subject.
 */
import baseFacade from './h-earth.repository-registry.hc02-page-excellence-execution-carrier-scope.v2.js';

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
const TOOLING_PREDECESSOR_HEAD = '012213de030780938ace85aae90e9330fac6d838';
const FROZEN_SUBJECT_HEAD = '2152ad18c1691c4056e9ae39795ad44228dbdc19';
const PRIVATE_GOVERNING_HEAD = '4c19e9ba783767f9324ab10df8a8541479f26c86';
const LOCK_GENERATION = 305;
const OPERATION_ID = 'H_EARTH_C3C3R5_S26_PERFORMANCE_WORLD_ENVELOPE_SUCCESSOR_20260817_001';
const NODE_ID = 'H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_REGISTRATION';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_REGISTRATION_v1';
const CONTRACT_PATH = '/h-earth-3d/docs/H_EARTH_C3C3R5_S26_PERFORMANCE_WORLD_ENVELOPE_SUCCESSOR_CONTRACT_v1.md';
const HARNESS_PATH = '/h-earth-3d/validation/h-earth.c3c3r5.s26-performance-world-envelope.browser.harness.mjs';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gen305-s26-preflight-scope-registration.js';

export const H_EARTH_GEN305_S26_PREFLIGHT_TARGET_PATHS = Object.freeze([
  CONTRACT_PATH,
  HARNESS_PATH
]);
export const H_EARTH_GEN305_S26_PREFLIGHT_REGISTERED_PATHS = Object.freeze([
  ...H_EARTH_GEN305_S26_PREFLIGHT_TARGET_PATHS,
  AMENDMENT_PATH
]);

const OCCURRENCES = Object.freeze([
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: FROZEN_SUBJECT_HEAD,
    commitSha: FROZEN_SUBJECT_HEAD,
    path: CONTRACT_PATH,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_NOT_MATERIALIZED_IN_FROZEN_C3C3R5_SUBJECT_BEFORE_GEN305_CONSTRUCTION',
    occurrenceClass: 'GEN305_AUTHORIZED_FUTURE_PATH_NOT_YET_MATERIALIZED'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: FROZEN_SUBJECT_HEAD,
    commitSha: FROZEN_SUBJECT_HEAD,
    path: HARNESS_PATH,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_NOT_MATERIALIZED_IN_FROZEN_C3C3R5_SUBJECT_BEFORE_GEN305_CONSTRUCTION',
    occurrenceClass: 'GEN305_AUTHORIZED_FUTURE_PATH_NOT_YET_MATERIALIZED'
  }),
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
    fetchbackStatus: 'VERIFIED_ABSENT_AT_PREDECESSOR_TOOLING_HEAD_BEFORE_SCOPE_REPAIR',
    occurrenceClass: 'REGISTRY_REPAIR_SELF_PATH_NOT_YET_MATERIALIZED_AT_PREDECESSOR'
  })
]);

export const H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'AUTHORIZED_FUTURE_PATH_SCOPE_WITH_TRUTHFUL_ABSENT_OCCURRENCE_STATE',
  sourceKind: 'CANONICAL_GEN305_LOCK_ROUTER_AND_NATIVE_PREFLIGHT_UNRESOLVED_PATH_RECEIPT',
  sourceIdOrPath: 'PRIVATE_ISSUE_277',
  sourceOccurrenceOrRevision: `PRIVATE_HEAD=${PRIVATE_GOVERNING_HEAD};LOCK_GENERATION=${LOCK_GENERATION};OPERATION=${OPERATION_ID};SUBJECT=${FROZEN_SUBJECT_HEAD};TOOLING_PREDECESSOR=${TOOLING_PREDECESSOR_HEAD}`,
  exactTargetPathCount: 2,
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope: Object.freeze([
    'EXACT_TWO_GEN305_S26_FUTURE_PATHS',
    'TRUTHFUL_ABSENCE_AT_FROZEN_C3C3R5_SUBJECT',
    'NATIVE_PREFLIGHT_REQUESTED_PATH_UNRESOLVED_REPAIR_ONLY',
    'NO_PRODUCT_BYTE_MATERIALIZATION'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PRODUCT_MUTATION_AUTHORITY',
    'NO_CONSTRUCTION_AUTHORITY',
    'NO_NAVIGATION_COLLISION_RENDERER_TERRAIN_OR_WATER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ])
});

export const H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'GEN305_AUTHORIZED_FUTURE_PATH_PREFLIGHT_SCOPE',
  displayName: 'H-Earth Gen305 S26 Preflight Scope Registration',
  description: 'Registers exactly the two Gen305 S26 contract/harness paths for repository-registry preflight resolution while preserving their truthful absent state before construction.',
  repositoryPaths: [...H_EARTH_GEN305_S26_PREFLIGHT_REGISTERED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUTHORIZED_FUTURE_SCOPE_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  authoritySource: Object.freeze([
    `GEN305_LOCK_GENERATION_${LOCK_GENERATION}`,
    OPERATION_ID,
    'GEN305_EXACT_SEVEN_PATH_MUTATION_ROUTER_PASS',
    'GEN305_NATIVE_PREFLIGHT_REQUESTED_PATH_UNRESOLVED_RECEIPT'
  ]),
  authorityScope: Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION',
    'NO_CONSTRUCTION_AUTHORITY',
    'NO_SCOPE_EXPANSION_BEYOND_TWO_GEN305_TARGETS_AND_THIS_AMENDMENT',
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
    'GEN305_ADMISSION_AND_ROUTER_PASS_PRECEDE_THIS_SCOPE_REGISTRATION',
    'NATIVE_PREFLIGHT_PASS_PRECEDES_ANY_GEN305_PRODUCT_MUTATION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  prohibitedMutations: Object.freeze(['PRODUCT_MUTATION','CONSTRUCTION','MERGE','DEPLOYMENT','RELEASE']),
  requiredValidations: Object.freeze([
    'EXACT_TWO_TARGET_PATHS',
    'TARGET_OCCURRENCES_TRUTHFULLY_ABSENT_AT_FROZEN_SUBJECT',
    'PREDECESSOR_REGISTERED_RENDERER_PATHS_REMAIN_RESOLVED',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_PATH_OUTSIDE_EXACT_SCOPE',
    'STOP_ON_PREDECESSOR_REGRESSION',
    'STOP_BEFORE_PRODUCT_MUTATION_UNTIL_NATIVE_PREFLIGHT_PASS'
  ]),
  currentIdentityReferences: Object.freeze([
    FROZEN_SUBJECT_HEAD,
    TOOLING_PREDECESSOR_HEAD,
    PRIVATE_GOVERNING_HEAD,
    `LOCK_GENERATION=${LOCK_GENERATION}`,
    OPERATION_ID
  ]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_GEN305_S26_PREFLIGHT_REGISTERED_PATHS.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE]),
      occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
    })
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [...(baseInstance.evidenceRecords ?? []), H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID), H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID ? H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID ? H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
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
  }).map((occurrence) => deepFreeze({ nodeId: NODE_ID, node: H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({
    ...input,
    ...(normalizedPath == null ? {} : { path: normalizedPath })
  });
  return deepFreeze({ query: base.query, matches: [...(base.matches ?? []), ...localMatches], resolved: base.resolved === true || localMatches.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE;
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
  if (nodeId === NODE_ID) return deepFreeze({ nodeId, nodes: [H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE], relations: [], unresolved: false });
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthGen305S26PreflightScopeRegistration() {
  const pathChecks = H_EARTH_GEN305_S26_PREFLIGHT_REGISTERED_PATHS.map((repositoryPath) => {
    const expected = OCCURRENCES.find((entry) => entry.path === repositoryPath);
    const resolution = resolveHEarthRepositoryRegistryPath(repositoryPath);
    const occurrence = (resolution.occurrences ?? []).find((entry) =>
      entry.path === expected.path && entry.commitSha === expected.commitSha &&
      entry.gitBlobSha === expected.gitBlobSha && entry.existenceStatus === expected.existenceStatus
    );
    return deepFreeze({ repositoryPath, resolved: resolution.resolved === true, occurrenceMatched: occurrence != null, pass: resolution.resolved === true && occurrence != null });
  });
  const predecessorRenderer = baseFacade.resolveHEarthRepositoryRegistryPath('/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js');
  const checks = deepFreeze({
    exactTwoTargetPaths: H_EARTH_GEN305_S26_PREFLIGHT_TARGET_PATHS.length === 2,
    exactThreeRegisteredPathsIncludingSelf: H_EARTH_GEN305_S26_PREFLIGHT_REGISTERED_PATHS.length === 3,
    allRegisteredPathsResolve: pathChecks.every((entry) => entry.pass),
    targetOccurrencesTruthfullyAbsent: OCCURRENCES.filter((entry) => H_EARTH_GEN305_S26_PREFLIGHT_TARGET_PATHS.includes(entry.path)).every((entry) => entry.existenceStatus === 'ABSENT' && entry.gitBlobSha === null),
    exactLockGeneration: LOCK_GENERATION === 305,
    exactFrozenSubject: FROZEN_SUBJECT_HEAD === '2152ad18c1691c4056e9ae39795ad44228dbdc19',
    exactPredecessorToolingHead: TOOLING_PREDECESSOR_HEAD === '012213de030780938ace85aae90e9330fac6d838',
    predecessorRendererRegistrationPreserved: predecessorRenderer.resolved === true,
    noProductAuthority: H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION'),
    noConstructionAuthority: H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_NODE.authorityLimitations.includes('NO_CONSTRUCTION_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({ eligible, status: eligible ? 'H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_REGISTRATION_PASS' : 'H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_REGISTRATION_FAIL', checks, pathChecks });
}

export const H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_FACADE = deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  verifyHEarthGen305S26PreflightScopeRegistration
});

export default H_EARTH_GEN305_S26_PREFLIGHT_SCOPE_FACADE;
