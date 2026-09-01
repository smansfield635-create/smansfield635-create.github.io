/**
 * H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_v1
 * Read-only exact-path recognition for four OW01 derivative paths required by
 * automatic H-Earth pre-mutation preflight. No product or runtime authority.
 */
import baseFacade from './h-earth.repository-registry.awards-public-face-path-recognition.js';

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
const PUBLIC_BASELINE = '799a332f4b2ebfa1b706d064899e69dea211d52a';
const LATTICE_PATH = '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js';
const ZONES_PATH = '/h-earth-3d/zones/ground-cell-001.zones.js';
const CONTROLLER_PATH = '/showroom/globe/h-earth/controller.js';
const AUDIO_PATH = '/showroom/globe/h-earth/environmental-audio.js';
const LATTICE_BLOB = 'ed9ff1f7d3c139a1cba7df169f278336342339f4';
const ZONES_BLOB = '2d21f90e6eda8b0885ce4815b352335827a38522';
const CONTROLLER_BLOB = '6720240473626f6589e1964b247436d46d5f6fb8';
const NODE_ID = 'H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_v1';

export const H_EARTH_OW01_DERIVATIVE_TARGET_PATHS = Object.freeze([
  LATTICE_PATH,
  ZONES_PATH,
  CONTROLLER_PATH,
  AUDIO_PATH
]);

const OCCURRENCES = Object.freeze([
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: PUBLIC_BASELINE, commitSha: PUBLIC_BASELINE, path: LATTICE_PATH, gitBlobSha: LATTICE_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_PUBLIC_BASELINE', occurrenceClass: 'EXISTING_H_EARTH_OW01_DERIVATIVE_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: PUBLIC_BASELINE, commitSha: PUBLIC_BASELINE, path: ZONES_PATH, gitBlobSha: ZONES_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_PUBLIC_BASELINE', occurrenceClass: 'EXISTING_H_EARTH_OW01_DERIVATIVE_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: PUBLIC_BASELINE, commitSha: PUBLIC_BASELINE, path: CONTROLLER_PATH, gitBlobSha: CONTROLLER_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_PUBLIC_BASELINE', occurrenceClass: 'EXISTING_H_EARTH_OW01_DERIVATIVE_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: PUBLIC_BASELINE, commitSha: PUBLIC_BASELINE, path: AUDIO_PATH, gitBlobSha: null, contentSha256: null, byteCount: null, existenceStatus: 'ABSENT', fetchbackStatus: 'VERIFIED_ABSENT_AT_EXACT_PUBLIC_BASELINE_BEFORE_AUTHORIZED_OW01_MATERIALIZATION', occurrenceClass: 'AUTHORIZED_H_EARTH_OW01_DERIVATIVE_TARGET_NOT_YET_MATERIALIZED' })
]);

export const H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_WITH_EXACT_BASELINE_BLOB_CUSTODY',
  sourceKind: 'AUTOMATIC_PREFLIGHT_STOP_PLUS_EXACT_PUBLIC_FETCHBACK',
  sourceIdOrPath: 'GEN250_PUBLIC_PREMUTATION_STOP',
  governingPublicBaseline: PUBLIC_BASELINE,
  exactTargetPathCount: 4,
  registrationEffect: 'READ_ONLY_PATH_RECOGNITION_ONLY',
  assertionScope: Object.freeze(['EXACT_FOUR_OW01_DERIVATIVE_PATHS', 'THREE_EXISTING_BASELINE_BLOBS', 'ONE_AUTHORIZED_ABSENT_DERIVATIVE_TARGET', 'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION']),
  evidenceLimitations: Object.freeze(['NO_TERRAIN_MUTATION_AUTHORITY', 'NO_ZONE_MUTATION_AUTHORITY', 'NO_CONTROLLER_MUTATION_AUTHORITY', 'NO_AUDIO_MUTATION_AUTHORITY', 'NO_PRODUCT_RUNTIME_RENDERER_GEOMETRY_WORLD_OR_GAMEPLAY_AUTHORITY', 'NO_CANONICAL_IDENTITY_AUTHORITY', 'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'])
});

export const H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth OW01 Derivative Path Recognition',
  description: 'Read-only registry recognition for the four OW01 derivative paths required by automatic H-Earth pre-mutation preflight.',
  repositoryPaths: [...H_EARTH_OW01_DERIVATIVE_TARGET_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUDIT_ONLY_PATH_RECOGNITION_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze(['EXPLICIT_USER_REGISTRATION_DIRECTION_2026_08_14', 'GEN250_AUTOMATIC_PREFLIGHT_STOP', `EXACT_PUBLIC_BASELINE=${PUBLIC_BASELINE}`]),
  authorityScope: Object.freeze(['EXACT_PATH_RESOLUTION', 'EXACT_EXISTING_OCCURRENCE_IDENTITY', 'AUTHORIZED_ABSENT_DERIVATIVE_TARGET_RESERVATION', 'AUTOMATIC_H_EARTH_PREFLIGHT_RESOLUTION']),
  authorityLimitations: Object.freeze(['NO_TERRAIN_MUTATION_AUTHORITY', 'NO_ZONE_MUTATION_AUTHORITY', 'NO_CONTROLLER_MUTATION_AUTHORITY', 'NO_AUDIO_MUTATION_AUTHORITY', 'NO_PRODUCT_AUTHORITY', 'NO_RUNTIME_AUTHORITY', 'NO_RENDERER_AUTHORITY', 'NO_GEOMETRY_AUTHORITY', 'NO_WORLD_AUTHORITY', 'NO_GAMEPLAY_AUTHORITY', 'NO_CANONICAL_IDENTITY_AUTHORITY', 'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY']),
  parentRelations: Object.freeze([]), childRelations: Object.freeze([]), peerRelations: Object.freeze([]), upstreamBoundaries: Object.freeze([]), downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['PREFLIGHT_STOP_PRECEDES_PATH_RECOGNITION', 'PATH_RECOGNITION_PRECEDES_FRESH_OW01_PREFLIGHT']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RECOGNITION',
  prohibitedMutations: Object.freeze(['OW01_PRODUCT_MUTATION_FROM_REGISTRY_AUTHORITY', 'RUNTIME_OR_AUDIO_MUTATION_FROM_REGISTRY_AUTHORITY', 'MERGE_OR_DEPLOYMENT_FROM_REGISTRY_AUTHORITY']),
  requiredValidations: Object.freeze(['EXACT_FOUR_TARGET_PATHS', 'EXACT_THREE_EXISTING_BLOBS', 'EXACT_ONE_AUTHORIZED_ABSENT_TARGET', 'PREDECESSOR_REGISTRY_IDENTITY_PRESERVED']),
  stoppingBoundaries: Object.freeze(['STOP_ON_PATH_OUTSIDE_EXACT_SCOPE', 'STOP_ON_EXISTING_BLOB_IDENTITY_MISMATCH', 'STOP_ON_AUTHORITY_EXPANSION']),
  currentIdentityReferences: Object.freeze([PUBLIC_BASELINE, `LATTICE_BLOB=${LATTICE_BLOB}`, `ZONES_BLOB=${ZONES_BLOB}`, `CONTROLLER_BLOB=${CONTROLLER_BLOB}`, 'ENVIRONMENTAL_AUDIO=ABSENT_AT_BASELINE']),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_OW01_DERIVATIVE_TARGET_PATHS.map((repositoryPath) => [repositoryPath, deepFreeze({ nodes: Object.freeze([H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE]), occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath)) })]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({ ...baseInstance, evidenceRecords: [...(baseInstance.evidenceRecords ?? []), H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_EVIDENCE], nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID), H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE] });

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) { return nodeId === NODE_ID ? H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId); }
export function getHEarthRepositoryRegistryEvidence(evidenceId) { return evidenceId === EVIDENCE_ID ? H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId); }
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({ ...base, repositoryPath: normalized, resolved: true, nodes: [...(base.nodes ?? []), ...indexed.nodes], occurrences: [...(base.occurrences ?? []), ...indexed.occurrences], unresolved: false });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES.filter((entry) => (normalizedPath == null || entry.path === normalizedPath) && (input.refType == null || entry.refType === input.refType) && (input.refName == null || entry.refName === input.refName) && (input.commitSha == null || entry.commitSha === input.commitSha) && (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) && (input.existenceStatus == null || entry.existenceStatus === input.existenceStatus)).map((occurrence) => deepFreeze({ nodeId: NODE_ID, node: H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({ ...input, ...(normalizedPath == null ? {} : { path: normalizedPath }) });
  return deepFreeze({ query: base.query, matches: [...(base.matches ?? []), ...localMatches], resolved: base.resolved === true || localMatches.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE;
  const normalizedRepositoryPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const matches = (criteria.nodeId == null || criteria.nodeId === node.nodeId) && (normalizedRepositoryPath == null || node.repositoryPaths.includes(normalizedRepositoryPath)) && (criteria.nodeType == null || criteria.nodeType === node.nodeType) && (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) && (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) && (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(matches ? [...base, node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') { return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction); }
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) { return nodeId === NODE_ID ? deepFreeze({ nodeId, nodes: [H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE], relations: [], resolved: true }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId); }

export function verifyHEarthOW01DerivativePathRecognition() {
  const resolutions = H_EARTH_OW01_DERIVATIVE_TARGET_PATHS.map((path) => resolveHEarthRepositoryRegistryPath(path));
  const checks = deepFreeze({
    exactTargetPathCount: H_EARTH_OW01_DERIVATIVE_TARGET_PATHS.length === 4,
    allTargetPathsResolve: resolutions.every((entry) => entry.resolved === true),
    exactLatticeBlob: OCCURRENCES.find((entry) => entry.path === LATTICE_PATH)?.gitBlobSha === LATTICE_BLOB,
    exactZonesBlob: OCCURRENCES.find((entry) => entry.path === ZONES_PATH)?.gitBlobSha === ZONES_BLOB,
    exactControllerBlob: OCCURRENCES.find((entry) => entry.path === CONTROLLER_PATH)?.gitBlobSha === CONTROLLER_BLOB,
    environmentalAudioAbsentAtBaseline: OCCURRENCES.find((entry) => entry.path === AUDIO_PATH)?.existenceStatus === 'ABSENT' && OCCURRENCES.find((entry) => entry.path === AUDIO_PATH)?.gitBlobSha === null,
    auditOnly: H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductAuthority: H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_AUTHORITY'),
    noRuntimeAuthority: H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_RUNTIME_AUTHORITY'),
    noCanonicalAuthority: H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CANONICAL_IDENTITY_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({ eligible, status: eligible ? 'H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_PASS' : 'H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_FAIL', checks, targetPaths: H_EARTH_OW01_DERIVATIVE_TARGET_PATHS, publicBaseline: PUBLIC_BASELINE });
}

export const H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_FACADE = deepFreeze({ ...baseFacade, getHEarthRepositoryRegistryInstance, getHEarthRepositoryRegistryNode, getHEarthRepositoryRegistryEvidence, resolveHEarthRepositoryRegistryPath, resolveHEarthRepositoryRegistryOccurrence, findHEarthRepositoryRegistryNodes, getHEarthRepositoryRegistryRelationsForNode, getHEarthRepositoryRegistryDependencyClosure, verifyHEarthOW01DerivativePathRecognition });
export default H_EARTH_OW01_DERIVATIVE_PATH_RECOGNITION_FACADE;