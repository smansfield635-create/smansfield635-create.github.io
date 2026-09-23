/** H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_v1 */
import baseFacade from './h-earth.repository-registry.ow04-exact-path-recognition.facade.js';

const TARGET = '/h-earth-3d/experience-anchor/receipts/ZZ_OW04_PARENT_PROMOTION_20260816_001.json';
const BRANCH = 'control-plane-delivery/h-earth-ow03-shoreline-boundary-corrective-20260815-002';
const NODE_ID = 'H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_SCOPE';

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

const occurrence = deepFreeze({
  repository: 'smansfield635-create/smansfield635-create.github.io',
  refType: 'BRANCH', refName: BRANCH, commitSha: null,
  path: TARGET, gitBlobSha: null, contentSha256: null, byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_PRESENT_ON_OW03_PARENT_PROMOTION_BRANCH',
  occurrenceClass: 'OW04_PARENT_PROMOTION_RECEIPT_EXACT_PATH_READ_ONLY_RECOGNITION'
});

export const H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_SCOPE',
  displayName: 'H-Earth OW04 Parent Promotion Receipt Recognition',
  repositoryPaths: [TARGET],
  repositoryOccurrences: [occurrence],
  lifecycleStatus: 'CANDIDATE_PATH_RECOGNITION',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authorityScope: ['EXACT_PATH_RESOLUTION','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'],
  authorityLimitations: [
    'NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY',
    'NO_RENDERER_MUTATION_AUTHORITY',
    'NO_EVIDENCE_OR_RECEIPT_MUTATION_AUTHORITY',
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
  nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID), H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE]
});

export function getHEarthRepositoryRegistryInstance() { return registryInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID ? H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) { return baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId); }
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  if (normalized !== TARGET) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({
    ...base,
    repositoryPath: normalized,
    resolved: true,
    unresolved: false,
    nodes: [...(base.nodes ?? []), H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE],
    occurrences: [...(base.occurrences ?? []), occurrence]
  });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalized = input.path == null ? null : normalizePath(input.path);
  const localMatch = (normalized == null || normalized === TARGET) &&
    (input.refType == null || input.refType === occurrence.refType) &&
    (input.refName == null || input.refName === occurrence.refName) &&
    (input.existenceStatus == null || input.existenceStatus === occurrence.existenceStatus);
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input, ...(normalized == null ? {} : {path: normalized})});
  return deepFreeze({
    query: base.query,
    matches: [...(base.matches ?? []), ...(localMatch ? [{nodeId:NODE_ID,node:H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE,occurrence}] : [])],
    resolved: base.resolved === true || localMatch
  });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const normalized = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const node = H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE;
  const match = (criteria.nodeId == null || criteria.nodeId === NODE_ID) &&
    (normalized == null || normalized === TARGET) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(match ? [...base, node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction='BOTH') {
  return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  return nodeId === NODE_ID ? deepFreeze({nodeId,nodes:[H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE],relations:[],resolved:true}) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}
export function getHEarthRepositoryRegistryDiscoveryDescriptor() { return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor(); }

export function verifyHEarthOW04ParentPromotionReceiptRecognition() {
  const resolution = resolveHEarthRepositoryRegistryPath(TARGET);
  const checks = deepFreeze({
    exactTargetPathCount: H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE.repositoryPaths.length === 1,
    targetPathResolves: resolution.resolved === true,
    candidateOccurrencePresent: occurrence.existenceStatus === 'PRESENT' && occurrence.refName === BRANCH,
    auditOnly: H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductAuthority: H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY'),
    noReceiptMutationAuthority: H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE.authorityLimitations.includes('NO_EVIDENCE_OR_RECEIPT_MUTATION_AUTHORITY'),
    noAnchorWaiverAuthority: H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_NODE.authorityLimitations.includes('NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({eligible,status:eligible?'H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_PASS':'H_EARTH_OW04_PARENT_PROMOTION_RECEIPT_RECOGNITION_FAIL',checks});
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
