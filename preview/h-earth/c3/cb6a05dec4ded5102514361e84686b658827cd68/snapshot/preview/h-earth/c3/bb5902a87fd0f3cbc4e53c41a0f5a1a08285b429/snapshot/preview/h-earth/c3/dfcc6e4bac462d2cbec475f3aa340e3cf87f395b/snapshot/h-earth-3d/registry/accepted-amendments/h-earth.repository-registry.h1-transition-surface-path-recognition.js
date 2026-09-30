/**
 * H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_v1
 *
 * Audit-only registry successor for the three H1 transition-surface paths that
 * were unresolved by exact-H0 pre-mutation preflight. This is path resolution
 * only. It creates no H-Earth product/runtime authority, no canonical identity
 * authority, no correspondence authority, and no merge/deployment authority.
 */
import baseFacade from './h-earth.repository-registry.hc05-live-gpu-path-recognition.js';

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
const GOVERNING_H0 = 'f99609e4540e5bdf9b2f0c519f631858706f0ba5';
const POINTER_PATH = '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js';
const TRANSITION_PATH = '/showroom/globe/h-earth/functional-landscape/representation-transition-surface.v1.js';
const VERIFIER_PATH = '/h-earth-3d/validation/h-earth.representation-transition-surface-gap-closure.v1.mjs';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.h1-transition-surface-path-recognition.js';
const POINTER_H0_BLOB = 'aae214ddbc4cd18aa8c737ee7bbb3de44322da96';
const NODE_ID = 'H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_v1';

export const H_EARTH_H1_TRANSITION_SURFACE_TARGET_PATHS = Object.freeze([
  POINTER_PATH,
  TRANSITION_PATH,
  VERIFIER_PATH
]);

export const H_EARTH_H1_TRANSITION_SURFACE_RECOGNIZED_PATHS = Object.freeze([
  ...H_EARTH_H1_TRANSITION_SURFACE_TARGET_PATHS,
  AMENDMENT_PATH
]);

const OCCURRENCES = Object.freeze([
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_H0,
    commitSha: GOVERNING_H0,
    path: POINTER_PATH,
    gitBlobSha: POINTER_H0_BLOB,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_H0',
    occurrenceClass: 'EXISTING_H0_RUNTIME_PATH_READ_ONLY_RECOGNITION'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_H0,
    commitSha: GOVERNING_H0,
    path: TRANSITION_PATH,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_ABSENT_AT_EXACT_H0_BEFORE_H1_CONSTRUCTION',
    occurrenceClass: 'AUTHORIZED_H1_PATH_RESERVATION_NOT_YET_MATERIALIZED_AT_H0'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_H0,
    commitSha: GOVERNING_H0,
    path: VERIFIER_PATH,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_ABSENT_AT_EXACT_H0_BEFORE_H1_CONSTRUCTION',
    occurrenceClass: 'AUTHORIZED_H1_PATH_RESERVATION_NOT_YET_MATERIALIZED_AT_H0'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_H0,
    commitSha: GOVERNING_H0,
    path: AMENDMENT_PATH,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_ABSENT_AT_EXACT_H0_BEFORE_REGISTRY_PREREQUISITE',
    occurrenceClass: 'AUTHORIZED_REGISTRY_PREREQUISITE_NOT_YET_MATERIALIZED_AT_H0'
  })
]);

export const H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'H1_TRANSITION_SURFACE_PREFLIGHT_PATH_RESOLUTION_PREREQUISITE',
  sourceKind: 'EXACT_H0_REMOTE_PREMUTATION_PREFLIGHT_STOP_PLUS_EXACT_H0_FETCHBACK',
  sourceIdOrPath: 'H_EARTH_H1_TRANSITION_SURFACE_PREFLIGHT_20260811_001',
  sourceOccurrenceOrRevision:
    `H0=${GOVERNING_H0};PREFLIGHT_RUN=31517041429;POINTER=${POINTER_H0_BLOB}`,
  governingH0: GOVERNING_H0,
  blockedPreflightRun: 31517041429,
  exactTargetPathCount: 3,
  registrationEffect: 'READ_ONLY_PATH_RECOGNITION_ONLY',
  assertionScope: Object.freeze([
    'EXACT_POINTER_TOUCH_INTAKE_H0_OCCURRENCE',
    'EXACT_H1_TRANSITION_SURFACE_PATH_RESERVATION',
    'EXACT_H1_VERIFIER_PATH_RESERVATION',
    'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION_AUTHORITY',
    'NO_RUNTIME_MUTATION_AUTHORITY',
    'NO_RENDERER_CAMERA_TERRAIN_GEOMETRY_PHYSICS_MATERIAL_SIMULATION_OR_PERSISTENCE_AUTHORITY',
    'NO_CANONICAL_IDENTITY_CREATION_REDEFINITION_OR_DEFAULT_AUTHORITY',
    'NO_CORRESPONDENCE_BINDING_OR_SHARED_WORLD_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ])
});

export const H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'H1_TRANSITION_SURFACE_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth H1 Transition Surface Path Recognition',
  description:
    'Recognizes exactly the three H1 transition-surface target paths so automatic H-Earth preflight can resolve them before separately authorized product construction.',
  repositoryPaths: [...H_EARTH_H1_TRANSITION_SURFACE_RECOGNIZED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUDIT_ONLY_PATH_RECOGNITION_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_H1_TRANSITION_SURFACE_PATH_RECOGNITION',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze([
    'H_EARTH_H1_EXACT_H0_PREMUTATION_PREFLIGHT_STOP',
    'SEPARATELY_ADMITTED_BOUNDED_REGISTRY_PREREQUISITE_ASSIST'
  ]),
  authorityScope: Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'EXACT_H0_POINTER_OCCURRENCE_IDENTITY',
    'H1_NEW_PATH_RESERVATION',
    'AUTOMATIC_H_EARTH_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION',
    'NO_RUNTIME_SOURCE_MUTATION',
    'NO_RENDERER_AUTHORITY',
    'NO_CAMERA_AUTHORITY',
    'NO_TERRAIN_AUTHORITY',
    'NO_GEOMETRY_AUTHORITY',
    'NO_PHYSICS_AUTHORITY',
    'NO_MATERIAL_AUTHORITY',
    'NO_SIMULATION_AUTHORITY',
    'NO_PERSISTENCE_AUTHORITY',
    'NO_CANONICAL_IDENTITY_AUTHORITY',
    'NO_CORRESPONDENCE_AUTHORITY',
    'NO_WORLD_STATE_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
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
    'EXACT_H0_PREFLIGHT_STOP_PRECEDES_PATH_RECOGNITION',
    'PATH_RECOGNITION_PRECEDES_FRESH_H1_PREMUTATION_PREFLIGHT',
    'FRESH_H1_PREMUTATION_PREFLIGHT_PRECEDES_H1_PRODUCT_CONSTRUCTION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RECOGNITION',
  prohibitedMutations: Object.freeze([
    'H1_PRODUCT_SOURCE_MUTATION_FROM_REGISTRY_AUTHORITY',
    'H0_POINTER_TOUCH_INTAKE_MUTATION_FROM_REGISTRY_AUTHORITY',
    'CANONICAL_IDENTITY_MINT_DEFAULT_FALLBACK_OR_REDEFINITION',
    'OPEN_WORLD_OR_CORRESPONDENCE_MUTATION',
    'TRANSITION_PRESENTATION_OR_UI_MUTATION'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_THREE_TARGET_PATHS',
    'EXACT_POINTER_H0_BLOB',
    'EXACT_TWO_H1_PATHS_ABSENT_AT_H0',
    'PREDECESSOR_REGISTRY_IDENTITY_PRESERVED',
    'AUTOMATIC_H_EARTH_PREFLIGHT_NO_UNREGISTERED_STOP'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_POINTER_H0_BLOB_DRIFT',
    'STOP_ON_PATH_OUTSIDE_EXACT_SCOPE',
    'STOP_ON_AUTHORITY_EXPANSION',
    'STOP_BEFORE_H1_PRODUCT_MUTATION'
  ]),
  currentIdentityReferences: Object.freeze([
    GOVERNING_H0,
    `POINTER_H0_BLOB=${POINTER_H0_BLOB}`,
    'PRIMARY_H1_OPERATION_LOCK_GENERATION=53',
    'REGISTRY_PREREQUISITE_ASSIST_LOCK_GENERATION=54'
  ]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_H1_TRANSITION_SURFACE_RECOGNIZED_PATHS.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE]),
      occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
    })
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...(baseInstance.evidenceRecords ?? []),
    H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
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
  const localMatches = OCCURRENCES
    .filter((entry) => {
      if (normalizedPath != null && entry.path !== normalizedPath) return false;
      if (input.refType != null && entry.refType !== input.refType) return false;
      if (input.refName != null && entry.refName !== input.refName) return false;
      if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
      if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
      if (input.existenceStatus != null && entry.existenceStatus !== input.existenceStatus) return false;
      return true;
    })
    .map((occurrence) => deepFreeze({
      nodeId: NODE_ID,
      node: H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE,
      occurrence
    }));
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
  const node = H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE;
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
  if (nodeId === NODE_ID) {
    return deepFreeze({
      nodeId,
      nodes: [H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE],
      relations: [],
      resolved: true
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthH1TransitionSurfacePathRecognition() {
  const pathChecks = H_EARTH_H1_TRANSITION_SURFACE_TARGET_PATHS.map((repositoryPath) => {
    const resolution = resolveHEarthRepositoryRegistryPath(repositoryPath);
    const localOccurrence = OCCURRENCES.find((entry) => entry.path === repositoryPath);
    const occurrenceMatched = (resolution.occurrences ?? []).some((entry) =>
      entry.path === localOccurrence.path &&
      entry.commitSha === localOccurrence.commitSha &&
      entry.existenceStatus === localOccurrence.existenceStatus &&
      entry.gitBlobSha === localOccurrence.gitBlobSha
    );
    return deepFreeze({
      repositoryPath,
      resolved: resolution.resolved === true,
      occurrenceMatched,
      pass: resolution.resolved === true && occurrenceMatched
    });
  });
  const newPathOccurrences = OCCURRENCES.filter((entry) =>
    [TRANSITION_PATH, VERIFIER_PATH].includes(entry.path)
  );
  const checks = deepFreeze({
    exactTargetPathCount: pathChecks.length === 3,
    allTargetPathsResolve: pathChecks.every((entry) => entry.pass),
    exactPointerH0Blob: POINTER_H0_BLOB === 'aae214ddbc4cd18aa8c737ee7bbb3de44322da96',
    exactTwoNewPathsAbsentAtH0:
      newPathOccurrences.length === 2 &&
      newPathOccurrences.every((entry) => entry.existenceStatus === 'ABSENT' && entry.gitBlobSha === null),
    auditOnly: H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly:
      H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductAuthority:
      H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION'),
    noCanonicalAuthority:
      H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CANONICAL_IDENTITY_AUTHORITY'),
    noCorrespondenceAuthority:
      H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CORRESPONDENCE_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status: eligible
      ? 'H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_PASS'
      : 'H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_FAIL',
    checks,
    pathChecks
  });
}

export const H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_FACADE = deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  verifyHEarthH1TransitionSurfacePathRecognition
});

export default H_EARTH_H1_TRANSITION_SURFACE_PATH_RECOGNITION_FACADE;
