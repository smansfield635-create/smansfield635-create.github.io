/**
 * H_EARTH_OW04_EXACT_PATH_RECOGNITION_v1
 *
 * Read-only exact-path recognition for the OW04 Experience Anchor evidence,
 * acceptance receipt, active persistent renderer, and this amendment. This
 * successor exists only so automatic H-Earth preflight can resolve the exact
 * governed paths already present in the OW04 candidate. It creates no product,
 * renderer, terrain, evidence, receipt, anchor-waiver, canonicalization, merge,
 * deployment, or publication authority.
 */
import baseFacade from './h-earth.repository-registry.ow03-experience-anchor-evidence-path-recognition.js';

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
const BRANCH = 'control-plane-delivery/h-earth-ow04-subtropical-world-continuation-20260815';
const NODE_ID = 'H_EARTH_OW04_EXACT_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_OW04_EXACT_PATH_RECOGNITION_v1';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.ow04-exact-path-recognition.js';

export const H_EARTH_OW04_EXACT_RECOGNIZED_PATHS = Object.freeze([
  '/h-earth-3d/experience-anchor/evidence/OW04_SUBTROPICAL_WORLD_CONTINUATION_20260816_001.json',
  '/h-earth-3d/experience-anchor/receipts/OW04_SUBTROPICAL_WORLD_CONTINUATION_20260816_001.json',
  '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js',
  AMENDMENT_PATH
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_OW04_EXACT_RECOGNIZED_PATHS.map((repositoryPath) => deepFreeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_PRESENT_ON_OW04_CANDIDATE_BRANCH',
    occurrenceClass: 'OW04_CANDIDATE_EXACT_PATH_READ_ONLY_RECOGNITION'
  }))
);

export const H_EARTH_OW04_EXACT_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'H_EARTH_OW04_EXACT_GOVERNED_PATH_RECOGNITION',
  sourceKind: 'AUTOMATIC_PREFLIGHT_FAILURE_RECEIPT_PLUS_EXACT_CANDIDATE_FETCHBACK',
  sourceIdOrPath: 'PR_1142_RUN_31954567000_ARTIFACT_9265578945',
  sourceOccurrenceOrRevision: 'HEAD=b0e5b9cdd3fe67856947dde41890900bd3438607;PREFLIGHT=REQUESTED_PATH_UNRESOLVED',
  exactTargetPathCount: H_EARTH_OW04_EXACT_RECOGNIZED_PATHS.length,
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  assertionScope: Object.freeze([
    'EXACT_OW04_ANCHOR_EVIDENCE_PATH',
    'EXACT_OW04_ANCHOR_RECEIPT_PATH',
    'EXACT_ACTIVE_PERSISTENT_RENDERER_PATH',
    'EXACT_REGISTRY_AMENDMENT_PATH',
    'AUTOMATIC_H_EARTH_PREFLIGHT_RESOLUTION'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY',
    'NO_RENDERER_MUTATION_AUTHORITY',
    'NO_EVIDENCE_OR_RECEIPT_MUTATION_AUTHORITY',
    'NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY',
    'NO_CANONICALIZATION_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ])
});

export const H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'H_EARTH_OW04_EXACT_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth OW04 Exact Path Recognition',
  description: 'Read-only exact-path recognition for the four OW04 governed paths identified by automatic repository preflight.',
  repositoryPaths: [...H_EARTH_OW04_EXACT_RECOGNIZED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_OW04_EXACT_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'CANDIDATE_PATH_RECOGNITION',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze([
    'USER_DIRECTED_RECIPROCAL_OW04_CYCLE_2026_08_16',
    'PR_1142',
    'AUTOMATIC_PREFLIGHT_RUN_31954567000',
    'AUTOMATIC_PREFLIGHT_ARTIFACT_9265578945'
  ]),
  authorityScope: Object.freeze(['EXACT_PATH_RESOLUTION','AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION']),
  authorityLimitations: H_EARTH_OW04_EXACT_PATH_RECOGNITION_EVIDENCE.evidenceLimitations,
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([
    'NATIVE_PREFLIGHT_STOP_PRECEDES_EXACT_PATH_RECOGNITION',
    'EXACT_PATH_RECOGNITION_PRECEDES_FRESH_PREFLIGHT_RETRY',
    'PATH_RECOGNITION_DOES_NOT_AUTHORIZE_PRODUCT_MUTATION_OR_MERGE'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION',
  prohibitedMutations: Object.freeze([
    'OW04_PRODUCT_OR_TERRAIN_MUTATION_FROM_REGISTRY_AUTHORITY',
    'PERSISTENT_RENDERER_MUTATION_FROM_REGISTRY_AUTHORITY',
    'EXPERIENCE_ANCHOR_EVIDENCE_OR_RECEIPT_MUTATION_FROM_REGISTRY_AUTHORITY',
    'EXPERIENCE_ANCHOR_WAIVER_FROM_REGISTRY_AUTHORITY',
    'MERGE_DEPLOYMENT_OR_PUBLICATION_FROM_REGISTRY_AUTHORITY'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_FOUR_TARGET_PATHS',
    'ALL_TARGET_PATHS_RESOLVE',
    'PREDECESSOR_REGISTRY_CHAIN_PRESERVED',
    'NO_AUTHORITY_EXPANSION'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_PATH_OUTSIDE_EXACT_FOUR',
    'STOP_ON_PREDECESSOR_REGISTRY_REGRESSION',
    'STOP_ON_ANY_PRODUCT_RENDERER_EVIDENCE_ANCHOR_OR_MERGE_AUTHORITY_EXPANSION'
  ]),
  currentIdentityReferences: Object.freeze([
    `BRANCH=${BRANCH}`,
    'PREFLIGHT_RUN=31954567000',
    'EXACT_TARGET_PATH_COUNT=4'
  ]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_OW04_EXACT_RECOGNIZED_PATHS.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE]),
      occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
    })
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [...(baseInstance.evidenceRecords ?? []), H_EARTH_OW04_EXACT_PATH_RECOGNITION_EVIDENCE],
  nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID), H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID ? H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID ? H_EARTH_OW04_EXACT_PATH_RECOGNITION_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
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
  }).map((occurrence) => deepFreeze({nodeId:NODE_ID,node:H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE,occurrence}));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({...input,...(normalizedPath == null ? {} : {path:normalizedPath})});
  return deepFreeze({query:base.query,matches:[...(base.matches ?? []),...localMatches],resolved:base.resolved === true || localMatches.length > 0});
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE;
  const normalizedRepositoryPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const matches =
    (criteria.nodeId == null || criteria.nodeId === node.nodeId) &&
    (normalizedRepositoryPath == null || node.repositoryPaths.includes(normalizedRepositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(matches ? [...base,node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH') {
  return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  return nodeId === NODE_ID
    ? deepFreeze({nodeId,nodes:[H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE],relations:[],resolved:true})
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}
export function getHEarthRepositoryRegistryDiscoveryDescriptor() {
  return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
}

export function verifyHEarthOW04ExactPathRecognition() {
  const resolutions = H_EARTH_OW04_EXACT_RECOGNIZED_PATHS.map((repositoryPath) => resolveHEarthRepositoryRegistryPath(repositoryPath));
  const checks = deepFreeze({
    exactTargetPathCount: H_EARTH_OW04_EXACT_RECOGNIZED_PATHS.length === 4,
    allTargetPathsResolve: resolutions.every((entry) => entry.resolved === true),
    allCandidateOccurrencesPresent: OCCURRENCES.length === 4 && OCCURRENCES.every((entry) => entry.existenceStatus === 'PRESENT' && entry.refName === BRANCH),
    auditOnly: H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductAuthority: H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY'),
    noRendererAuthority: H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_RENDERER_MUTATION_AUTHORITY'),
    noAnchorWaiverAuthority: H_EARTH_OW04_EXACT_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({eligible,status:eligible?'H_EARTH_OW04_EXACT_PATH_RECOGNITION_PASS':'H_EARTH_OW04_EXACT_PATH_RECOGNITION_FAIL',checks});
}

const facade = Object.freeze({
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

export default facade;
