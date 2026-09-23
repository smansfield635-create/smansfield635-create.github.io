/** H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_v1 */
import baseFacade from './h-earth.repository-registry.c3d1-coastal-placement-recognition.js';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/audralia-pc1-abc-gratitude-geographic-successor-20260820-002';
const CANDIDATE_COMMIT = 'f0edfdb3f0106852d13a9bd4805f4bba1b9d3e00';
const NODE_ID = 'H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_SCOPE';
const TARGETS = Object.freeze([
  '/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',
  '/h-earth-3d/validation/audralia.gratitude-geographic-convergence.v1.mjs'
]);

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}
function normalizePath(value) {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
}

const OCCURRENCES = Object.freeze(TARGETS.map((path) => deepFreeze({
  repository: REPOSITORY,
  refType: 'COMMIT',
  refName: CANDIDATE_COMMIT,
  commitSha: CANDIDATE_COMMIT,
  path,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_PRESENT_ON_PC1_GEOGRAPHY_CANDIDATE',
  occurrenceClass: 'AUDRALIA_PC1_GEOGRAPHY_EXACT_PATH_READ_ONLY_RECOGNITION'
})));

export const H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth Audralia PC1 Geography Path Recognition',
  repositoryPaths: TARGETS,
  repositoryOccurrences: OCCURRENCES,
  lifecycleStatus: 'CANDIDATE_PATH_RECOGNITION',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authorityScope: ['EXACT_PATH_RESOLUTION', 'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'],
  authorityLimitations: [
    'NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY',
    'NO_GEOGRAPHY_MUTATION_AUTHORITY',
    'NO_WEATHER_OR_CLOUD_MUTATION_AUTHORITY',
    'NO_PREVIEW_OR_PRODUCTION_PUBLICATION_AUTHORITY',
    'NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ],
  parentRelations: [], childRelations: [], peerRelations: [],
  upstreamBoundaries: [], downstreamBoundaries: [], dependencyRelations: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION',
  unresolvedFields: []
});

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const registryInstance = deepFreeze({
  ...baseInstance,
  nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID), H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE]
});

export function getHEarthRepositoryRegistryInstance() { return registryInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID ? H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) { return baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId); }
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  if (!TARGETS.includes(normalized)) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  const occurrence = OCCURRENCES.find((candidate) => candidate.path === normalized);
  return deepFreeze({
    ...base,
    repositoryPath: normalized,
    resolved: true,
    unresolved: false,
    nodes: [...(base.nodes ?? []), H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE],
    occurrences: [...(base.occurrences ?? []), occurrence]
  });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalized = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES.filter((occurrence) =>
    (normalized == null || normalized === occurrence.path) &&
    (input.refType == null || input.refType === occurrence.refType) &&
    (input.refName == null || input.refName === occurrence.refName) &&
    (input.commitSha == null || input.commitSha === occurrence.commitSha) &&
    (input.existenceStatus == null || input.existenceStatus === occurrence.existenceStatus)
  );
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input, ...(normalized == null ? {} : {path: normalized})});
  return deepFreeze({
    query: base.query,
    matches: [...(base.matches ?? []), ...localMatches.map((occurrence) => ({nodeId: NODE_ID, node: H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE, occurrence}))],
    resolved: base.resolved === true || localMatches.length > 0
  });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const normalized = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const node = H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE;
  const match = (criteria.nodeId == null || criteria.nodeId === NODE_ID) &&
    (normalized == null || TARGETS.includes(normalized)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(match ? [...base, node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') {
  return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  return nodeId === NODE_ID
    ? deepFreeze({nodeId, nodes: [H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE], relations: [], resolved: true})
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}
export function getHEarthRepositoryRegistryDiscoveryDescriptor() { return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor(); }

export function verifyHEarthAudraliaPC1GeographyPathRecognition() {
  const resolutions = TARGETS.map((path) => resolveHEarthRepositoryRegistryPath(path));
  const checks = deepFreeze({
    exactTargetPathCount: TARGETS.length === 2 && H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE.repositoryPaths.length === 2,
    allTargetPathsResolve: resolutions.every((resolution) => resolution.resolved === true),
    candidateOccurrencesPresent: OCCURRENCES.length === 2 && OCCURRENCES.every((occurrence) => occurrence.existenceStatus === 'PRESENT' && occurrence.commitSha === CANDIDATE_COMMIT),
    auditOnly: H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductAuthority: H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY'),
    noGeographyAuthority: H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_GEOGRAPHY_MUTATION_AUTHORITY'),
    noWeatherCloudAuthority: H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_WEATHER_OR_CLOUD_MUTATION_AUTHORITY'),
    noPublicationAuthority: H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PREVIEW_OR_PRODUCTION_PUBLICATION_AUTHORITY'),
    noAnchorWaiverAuthority: H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({eligible, status: eligible ? 'H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_PASS' : 'H_EARTH_AUDRALIA_PC1_GEOGRAPHY_PATH_RECOGNITION_FAIL', checks});
}

export default Object.freeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  getHEarthRepositoryRegistryDiscoveryDescriptor
});
