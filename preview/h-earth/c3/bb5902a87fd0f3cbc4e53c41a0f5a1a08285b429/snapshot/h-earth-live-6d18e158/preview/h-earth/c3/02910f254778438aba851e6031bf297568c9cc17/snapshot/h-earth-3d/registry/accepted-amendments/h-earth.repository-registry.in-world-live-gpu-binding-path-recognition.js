/**
 * H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_v1
 *
 * Audit-only registry successor recognizing the already-live Run 8E R3D
 * GPU binding path that blocked Generation 94 automatic H-Earth preflight.
 * This is path resolution only. It creates no product, runtime, renderer,
 * camera, navigation, terrain, world, canonical, correspondence, merge,
 * deployment, release, or publication authority.
 */
import baseFacade from './h-earth.repository-registry.h1-transition-surface-path-recognition.js';

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
const GOVERNING_MAIN = 'b935dbe9957b16b11fe4b4bef3421853bd1fe41a';
const TARGET_PATH = '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js';
const TARGET_MAIN_BLOB = '16bc8c45fb5c2363326d05f7610e11387b3a4e38';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.in-world-live-gpu-binding-path-recognition.js';
const NODE_ID = 'H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_v1';

export const H_EARTH_IN_WORLD_LIVE_GPU_BINDING_TARGET_PATHS = Object.freeze([
  TARGET_PATH
]);

export const H_EARTH_IN_WORLD_LIVE_GPU_BINDING_RECOGNIZED_PATHS = Object.freeze([
  TARGET_PATH,
  AMENDMENT_PATH
]);

const OCCURRENCES = Object.freeze([
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_MAIN,
    commitSha: GOVERNING_MAIN,
    path: TARGET_PATH,
    gitBlobSha: TARGET_MAIN_BLOB,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_GOVERNING_MAIN',
    occurrenceClass: 'EXISTING_IN_WORLD_LIVE_GPU_BINDING_READ_ONLY_RECOGNITION'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_MAIN,
    commitSha: GOVERNING_MAIN,
    path: AMENDMENT_PATH,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_GENERATION_95',
    occurrenceClass: 'AUTHORIZED_REGISTRY_PREREQUISITE_NOT_YET_MATERIALIZED_AT_GOVERNING_MAIN'
  })
]);

export const H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'EXISTING_IN_WORLD_RUNTIME_PATH_RECOGNITION_WITH_EXACT_BLOB_CUSTODY',
  sourceKind: 'GEN94_AUTOMATIC_PREFLIGHT_STOP_PLUS_EXACT_MAIN_FETCHBACK',
  sourceIdOrPath: 'H_EARTH_IN_WORLD_VERTICAL_SLICE_TERRAIN_RELIEF_DEFAULT_20260811_001',
  sourceOccurrenceOrRevision:
    `MAIN=${GOVERNING_MAIN};GEN94=94;PREFLIGHT_RUN=31552379050;TARGET=${TARGET_MAIN_BLOB}`,
  governingMain: GOVERNING_MAIN,
  blockedGeneration: 94,
  registryPrerequisiteGeneration: 95,
  blockedPreflightRun: 31552379050,
  exactTargetPathCount: 1,
  registrationEffect: 'READ_ONLY_PATH_RECOGNITION_ONLY',
  assertionScope: Object.freeze([
    'EXACT_IN_WORLD_LIVE_GPU_BINDING_PATH',
    'EXACT_EXISTING_MAIN_BLOB_IDENTITY',
    'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION_AUTHORITY',
    'NO_RUNTIME_SOURCE_MUTATION_AUTHORITY',
    'NO_RENDERER_CAMERA_NAVIGATION_TERRAIN_GEOMETRY_WORLD_OR_GAMEPLAY_AUTHORITY',
    'NO_CANONICAL_IDENTITY_AUTHORITY',
    'NO_CORRESPONDENCE_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ])
});

export const H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'EXISTING_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth In-World Live GPU Binding Path Recognition',
  description:
    'Recognizes exactly the current live GPU binding path so automatic H-Earth preflight can resolve it before any separately authorized in-world product mutation.',
  repositoryPaths: [...H_EARTH_IN_WORLD_LIVE_GPU_BINDING_RECOGNIZED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUDIT_ONLY_PATH_RECOGNITION_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_EXISTING_IN_WORLD_RUNTIME_PATH_RECOGNITION',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze([
    'GEN94_AUTOMATIC_H_EARTH_PREFLIGHT_STOP',
    'SEPARATELY_ADMITTED_GENERATION_95_REGISTRY_PREREQUISITE'
  ]),
  authorityScope: Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'EXACT_EXISTING_OCCURRENCE_IDENTITY',
    'AUTOMATIC_H_EARTH_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION',
    'NO_RUNTIME_SOURCE_MUTATION',
    'NO_RENDERER_AUTHORITY',
    'NO_CAMERA_AUTHORITY',
    'NO_NAVIGATION_AUTHORITY',
    'NO_TERRAIN_AUTHORITY',
    'NO_GEOMETRY_AUTHORITY',
    'NO_WORLD_AUTHORITY',
    'NO_GAMEPLAY_AUTHORITY',
    'NO_CANONICAL_IDENTITY_AUTHORITY',
    'NO_CORRESPONDENCE_AUTHORITY',
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
    'GEN94_PREFLIGHT_STOP_PRECEDES_PATH_RECOGNITION',
    'PATH_RECOGNITION_PRECEDES_FRESH_PRODUCT_PREFLIGHT',
    'FRESH_PRODUCT_PREFLIGHT_PRECEDES_PRODUCT_CANDIDATE_RETRY'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RECOGNITION',
  prohibitedMutations: Object.freeze([
    'LIVE_GPU_BINDING_SOURCE_MUTATION_FROM_REGISTRY_AUTHORITY',
    'PR920_MUTATION_FROM_REGISTRY_AUTHORITY',
    'PRODUCT_RUNTIME_RENDERER_CAMERA_NAVIGATION_TERRAIN_OR_WORLD_MUTATION_FROM_REGISTRY_AUTHORITY'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_ONE_TARGET_PATH',
    'EXACT_TARGET_MAIN_BLOB',
    'PREDECESSOR_REGISTRY_IDENTITY_PRESERVED',
    'AUTOMATIC_H_EARTH_PREFLIGHT_NO_UNREGISTERED_STOP'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_TARGET_MAIN_BLOB_DRIFT',
    'STOP_ON_PATH_OUTSIDE_EXACT_SCOPE',
    'STOP_ON_AUTHORITY_EXPANSION',
    'STOP_BEFORE_PRODUCT_OR_RUNTIME_MUTATION'
  ]),
  currentIdentityReferences: Object.freeze([
    GOVERNING_MAIN,
    `TARGET_MAIN_BLOB=${TARGET_MAIN_BLOB}`,
    'BLOCKED_PRODUCT_GENERATION=94',
    'REGISTRY_PREREQUISITE_GENERATION=95'
  ]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_IN_WORLD_LIVE_GPU_BINDING_RECOGNIZED_PATHS.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE]),
      occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
    })
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...(baseInstance.evidenceRecords ?? []),
    H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_EVIDENCE
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
      node: H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE,
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
  const node = H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE;
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
  return nodeId === NODE_ID
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  if (nodeId === NODE_ID) {
    return deepFreeze({
      nodeId,
      nodes: [H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE],
      relations: [],
      resolved: true
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthInWorldLiveGPUBindingPathRecognition() {
  const resolution = resolveHEarthRepositoryRegistryPath(TARGET_PATH);
  const targetOccurrence = OCCURRENCES.find((entry) => entry.path === TARGET_PATH);
  const occurrenceMatched = (resolution.occurrences ?? []).some((entry) =>
    entry.path === targetOccurrence.path &&
    entry.commitSha === targetOccurrence.commitSha &&
    entry.existenceStatus === 'PRESENT' &&
    entry.gitBlobSha === TARGET_MAIN_BLOB
  );
  const checks = deepFreeze({
    exactTargetPathCount: H_EARTH_IN_WORLD_LIVE_GPU_BINDING_TARGET_PATHS.length === 1,
    targetPathResolves: resolution.resolved === true,
    targetOccurrenceMatched: occurrenceMatched,
    exactTargetMainBlob: targetOccurrence.gitBlobSha === TARGET_MAIN_BLOB,
    auditOnly: H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly:
      H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductAuthority:
      H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION'),
    noRuntimeAuthority:
      H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_RUNTIME_SOURCE_MUTATION'),
    noCanonicalAuthority:
      H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CANONICAL_IDENTITY_AUTHORITY'),
    noCorrespondenceAuthority:
      H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CORRESPONDENCE_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status: eligible
      ? 'H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_PASS'
      : 'H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_FAIL',
    checks,
    targetPath: TARGET_PATH,
    targetMainBlob: TARGET_MAIN_BLOB
  });
}

export const H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_FACADE = deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  verifyHEarthInWorldLiveGPUBindingPathRecognition
});

export default H_EARTH_IN_WORLD_LIVE_GPU_BINDING_PATH_RECOGNITION_FACADE;
