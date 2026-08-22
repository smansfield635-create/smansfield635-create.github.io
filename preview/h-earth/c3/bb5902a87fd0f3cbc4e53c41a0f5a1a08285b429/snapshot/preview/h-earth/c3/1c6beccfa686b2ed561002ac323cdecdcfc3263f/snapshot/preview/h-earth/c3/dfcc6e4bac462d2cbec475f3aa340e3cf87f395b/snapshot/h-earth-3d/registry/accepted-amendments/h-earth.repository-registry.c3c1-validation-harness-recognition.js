/** H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_v2 */
import baseFacade from './h-earth.repository-registry.c3d1-coastal-placement-recognition.js';

const BRANCH = 'candidate/h-earth-c3c1-coastal-corner-20260816';
const NODE_ID = 'H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_SCOPE';
const TARGETS = Object.freeze([
  '/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d-runtime-identity-corridor.harness.mjs',
  '/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d1d-corrected-cross-runtime-identity.harness.mjs',
  '/h-earth-3d/validation/h-earth.c3c1.browser-renderer-survival.harness.mjs'
]);

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value); for (const nested of Object.values(value)) deepFreeze(nested, seen);
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
const occurrences = deepFreeze(TARGETS.map((path) => ({
  repository: 'smansfield635-create/smansfield635-create.github.io',
  refType: 'BRANCH', refName: BRANCH, commitSha: null, path,
  gitBlobSha: null, contentSha256: null, byteCount: null,
  existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_ON_C3C1_CANDIDATE_BRANCH',
  occurrenceClass: 'C3C1_VALIDATION_HARNESS_EXACT_PATH_READ_ONLY_RECOGNITION'
})));

export const H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID, nodeType: 'BOUNDARY_PACKET', nodeSubtype: 'H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_SCOPE',
  displayName: 'H-Earth C3C1 Validation Harness Recognition', repositoryPaths: [...TARGETS],
  repositoryOccurrences: occurrences, lifecycleStatus: 'CANDIDATE_PATH_RECOGNITION', authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'EXACT_PATH_RESOLUTION_ONLY', registrationEffect: 'PATH_RESOLUTION_ONLY',
  authorityScope: ['EXACT_PATH_RESOLUTION','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'],
  authorityLimitations: [
    'NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY','NO_VALIDATION_RESULT_FORCING_AUTHORITY',
    'NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY','NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [], dependencyRelations: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION', unresolvedFields: []
});

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const registryInstance = deepFreeze({ ...baseInstance, nodes: [...baseInstance.nodes.filter((n) => n.nodeId !== NODE_ID), H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE] });

export function getHEarthRepositoryRegistryInstance() { return registryInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) { return nodeId === NODE_ID ? H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId); }
export function getHEarthRepositoryRegistryEvidence(evidenceId) { return baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId); }
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const index = TARGETS.indexOf(normalized);
  if (index < 0) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({ ...base, repositoryPath: normalized, resolved: true, unresolved: false,
    nodes: [...(base.nodes ?? []), H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE],
    occurrences: [...(base.occurrences ?? []), occurrences[index]] });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalized = input.path == null ? null : normalizePath(input.path);
  const matches = occurrences.filter((occurrence) => (normalized == null || normalized === occurrence.path) &&
    (input.refType == null || input.refType === occurrence.refType) && (input.refName == null || input.refName === occurrence.refName) &&
    (input.existenceStatus == null || input.existenceStatus === occurrence.existenceStatus));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input, ...(normalized == null ? {} : {path: normalized})});
  return deepFreeze({ query: base.query, matches: [...(base.matches ?? []), ...matches.map((occurrence) => ({nodeId:NODE_ID,node:H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE,occurrence}))], resolved: base.resolved === true || matches.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const normalized = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const node = H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE;
  const match = (criteria.nodeId == null || criteria.nodeId === NODE_ID) && (normalized == null || TARGETS.includes(normalized)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) && (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) && (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(match ? [...base, node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction='BOTH') { return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction); }
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) { return nodeId === NODE_ID ? deepFreeze({nodeId,nodes:[H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE],relations:[],resolved:true}) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId); }
export function getHEarthRepositoryRegistryDiscoveryDescriptor() { return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor(); }

export function verifyHEarthC3C1ValidationHarnessRecognition() {
  const resolutions = TARGETS.map(resolveHEarthRepositoryRegistryPath);
  const checks = deepFreeze({
    exactTargetPathCount: TARGETS.length === 3,
    allTargetPathsResolve: resolutions.every((r) => r.resolved === true),
    candidateOccurrencesPresent: occurrences.every((o) => o.existenceStatus === 'PRESENT' && o.refName === BRANCH),
    auditOnly: H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductAuthority: H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY'),
    noResultForcingAuthority: H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE.authorityLimitations.includes('NO_VALIDATION_RESULT_FORCING_AUTHORITY'),
    noAnchorWaiverAuthority: H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_NODE.authorityLimitations.includes('NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({eligible,status:eligible?'H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_PASS':'H_EARTH_C3C1_VALIDATION_HARNESS_RECOGNITION_FAIL',checks});
}

export default Object.freeze({ ...baseFacade, getHEarthRepositoryRegistryInstance, getHEarthRepositoryRegistryNode, getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath, resolveHEarthRepositoryRegistryOccurrence, findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode, getHEarthRepositoryRegistryDependencyClosure, getHEarthRepositoryRegistryDiscoveryDescriptor });
