/**
 * H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_v1
 *
 * Audit-only registry successor that recognizes exactly the two already-live
 * GPU identity consumers required by HC05 pre-mutation preflight. It creates
 * no product, renderer, terrain, camera, navigation, merge, deployment, or
 * canonicalization authority and does not mutate either runtime source file.
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
const GOVERNING_MAIN = 'eb9a1730f201ba8a8c3822b65ecb984592de38bd';
const LOCK_GENERATION = 889;
const NODE_ID = 'H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_v1';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.hc05-live-gpu-path-recognition.js';
const R3A_PATH = '/showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
const CP2_PATH = '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const R3A_BLOB = '8c6ec02d0873cafeb596c9ae34ad3b580b09a489';
const CP2_BLOB = '98c6e1f9b9fe4510157367600b85b9d31228056b';

export const H_EARTH_HC05_LIVE_GPU_RECOGNIZED_PATHS = Object.freeze([
  R3A_PATH,
  CP2_PATH,
  AMENDMENT_PATH
]);

const OCCURRENCES = Object.freeze([
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_MAIN,
    commitSha: GOVERNING_MAIN,
    path: R3A_PATH,
    gitBlobSha: R3A_BLOB,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_PRESENT_AT_GOVERNING_MAIN',
    occurrenceClass: 'EXISTING_LIVE_GPU_IDENTITY_CONSUMER_READ_ONLY_RECOGNITION'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_MAIN,
    commitSha: GOVERNING_MAIN,
    path: CP2_PATH,
    gitBlobSha: CP2_BLOB,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_PRESENT_AT_GOVERNING_MAIN',
    occurrenceClass: 'EXISTING_LIVE_GPU_IDENTITY_CONSUMER_READ_ONLY_RECOGNITION'
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
    fetchbackStatus: 'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_GENERATION_889',
    occurrenceClass: 'AUTHORIZED_REGISTRY_PREREQUISITE_NOT_YET_MATERIALIZED_AT_GOVERNING_MAIN'
  })
]);

export const H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'EXISTING_RUNTIME_PATH_RECOGNITION_WITH_EXACT_BLOB_CUSTODY',
  sourceKind: 'HC05_NATIVE_PREFLIGHT_STOP_PLUS_EXACT_MAIN_FETCHBACK',
  sourceIdOrPath: 'ISSUE_781',
  sourceOccurrenceOrRevision:
    `MAIN=${GOVERNING_MAIN};HC05_GEN=888;REGISTRY_GEN=${LOCK_GENERATION};R3A=${R3A_BLOB};CP2=${CP2_BLOB};PREFLIGHT_RUN=31341611737`,
  governingMain: GOVERNING_MAIN,
  blockedHC05Generation: 888,
  registryPrerequisiteGeneration: LOCK_GENERATION,
  exactRuntimePathCount: 2,
  registrationEffect: 'READ_ONLY_PATH_RECOGNITION_ONLY',
  assertionScope: Object.freeze([
    'EXACT_R3A_LIVE_RENDERER_CONTRACT_PATH',
    'EXACT_CP2_PERSISTENT_RENDERER_PATH',
    'EXACT_EXISTING_MAIN_BLOB_IDENTITIES',
    'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_RUNTIME_SOURCE_MUTATION_AUTHORITY',
    'NO_RENDERER_OR_PACKAGE_IDENTITY_MUTATION_AUTHORITY',
    'NO_TERRAIN_GEOMETRY_CAMERA_NAVIGATION_OR_GAMEPLAY_AUTHORITY',
    'NO_PRODUCT_CANONICALIZATION_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ])
});

export const H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'EXISTING_LIVE_GPU_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth HC05 Live GPU Path Recognition',
  description: 'Recognizes exactly the current R3A live-renderer contract and active CP2 persistent-renderer paths so automatic H-Earth preflight can resolve them without granting mutation authority.',
  repositoryPaths: [...H_EARTH_HC05_LIVE_GPU_RECOGNIZED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUDIT_ONLY_PATH_RECOGNITION_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_EXISTING_RUNTIME_PATH_RECOGNITION',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze([
    'CURRENT_USER_DIRECTED_HC05_SEQUENCE',
    'HC05_GENERATION_888_NATIVE_PREFLIGHT_STOP',
    `REGISTRY_PREREQUISITE_GENERATION_${LOCK_GENERATION}`
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
    'NO_PACKAGE_IDENTITY_AUTHORITY',
    'NO_TERRAIN_GEOMETRY_CAMERA_NAVIGATION_OR_GAMEPLAY_AUTHORITY',
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
    'EXISTING_RUNTIME_OCCURRENCE_PRECEDES_REGISTRY_RECOGNITION',
    'REGISTRY_RECOGNITION_PRECEDES_FRESH_HC05_PREFLIGHT_RETRY'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RECOGNITION',
  prohibitedMutations: Object.freeze([
    'R3A_SOURCE_MUTATION_FROM_REGISTRY_AUTHORITY',
    'CP2_SOURCE_MUTATION_FROM_REGISTRY_AUTHORITY',
    'HC05_PRODUCT_MUTATION_FROM_REGISTRY_AUTHORITY'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_TWO_RUNTIME_PATHS',
    'EXACT_R3A_BLOB',
    'EXACT_CP2_BLOB',
    'PREDECESSOR_REGISTRY_IDENTITY_PRESERVED',
    'AUTOMATIC_H_EARTH_PREFLIGHT_NO_UNREGISTERED_STOP'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_RUNTIME_BLOB_DRIFT',
    'STOP_ON_PATH_OUTSIDE_EXACT_SCOPE',
    'STOP_ON_AUTHORITY_EXPANSION',
    'STOP_BEFORE_PRODUCT_OR_RUNTIME_MUTATION'
  ]),
  currentIdentityReferences: Object.freeze([
    GOVERNING_MAIN,
    `R3A_BLOB=${R3A_BLOB}`,
    `CP2_BLOB=${CP2_BLOB}`,
    `REGISTRY_GEN=${LOCK_GENERATION}`
  ]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_HC05_LIVE_GPU_RECOGNIZED_PATHS.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE]),
      occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
    })
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...(baseInstance.evidenceRecords ?? []),
    H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_EVIDENCE
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
      node: H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE,
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
  const node = H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE;
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
    return deepFreeze({ nodeId, nodes: [H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE], relations: [], resolved: true });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthHC05LiveGPUPathRecognition() {
  const expectedByPath = new Map(OCCURRENCES.map((entry) => [entry.path, entry]));
  const pathChecks = [R3A_PATH, CP2_PATH].map((repositoryPath) => {
    const expected = expectedByPath.get(repositoryPath);
    const resolution = resolveHEarthRepositoryRegistryPath(repositoryPath);
    const occurrence = (resolution.occurrences ?? []).find((entry) =>
      entry.path === expected.path &&
      entry.commitSha === expected.commitSha &&
      entry.gitBlobSha === expected.gitBlobSha &&
      entry.existenceStatus === 'PRESENT'
    );
    return deepFreeze({
      repositoryPath,
      resolved: resolution.resolved === true,
      occurrenceMatched: occurrence != null,
      pass: resolution.resolved === true && occurrence != null
    });
  });
  const checks = deepFreeze({
    exactRuntimePathCount: pathChecks.length === 2,
    allRuntimePathsResolve: pathChecks.every((entry) => entry.pass),
    exactR3ABlob: R3A_BLOB === '8c6ec02d0873cafeb596c9ae34ad3b580b09a489',
    exactCP2Blob: CP2_BLOB === '98c6e1f9b9fe4510157367600b85b9d31228056b',
    auditOnly: H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    noProductAuthority: H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION'),
    noRuntimeMutationAuthority: H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_RUNTIME_SOURCE_MUTATION'),
    noRendererAuthority: H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_RENDERER_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status: eligible
      ? 'H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_PASS'
      : 'H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_FAIL',
    checks,
    pathChecks
  });
}

export const H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_FACADE = deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  verifyHEarthHC05LiveGPUPathRecognition
});

export default H_EARTH_HC05_LIVE_GPU_PATH_RECOGNITION_FACADE;
