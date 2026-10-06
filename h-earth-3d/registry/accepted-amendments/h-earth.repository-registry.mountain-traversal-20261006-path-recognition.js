/** H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_v1 */
import baseFacade from './h-earth.repository-registry.fd05-diagnostic-path-recognition.js';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const GOVERNING_HEAD = '171a74bc3f1f170c36079b00407fb569b56992bf';
const NODE_ID = 'H_EARTH_MOUNTAIN_TRAVERSAL_EXACT_PATH_RECOGNITION_SCOPE';
const CANDIDATE_HEAD = "599a1af97fbed52ec61dca88968b4e723f443cff";
const TARGET_BLOBS = Object.freeze({
  "/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js": "ac931477de0a3930ef02ebad16929a47f4025168",
  "/h-earth-3d/validation/h-earth.mountain-traversal-20261006.mjs": "f405649ba966bcb2e81b550c590a572d1cd32f10",
  "/h-earth-3d/evidence/mountain-traversal-20261006/qualification.json": "0a652593d37db3bdcc8f8c8c4892d7b7681e5ec3",
  "/h-earth-3d/experience-anchor/receipts/mountain-traversal-20261006.json": "b183e0c2a619e46813cc5dc004622e33d96cf053"
});
const TARGETS = Object.freeze(Object.keys(TARGET_BLOBS));

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

const OCCURRENCES = Object.freeze(TARGETS.flatMap(path => [
  deepFreeze({repository:REPOSITORY,refType:'COMMIT',refName:GOVERNING_HEAD,commitSha:GOVERNING_HEAD,path,gitBlobSha:path===TARGETS[0]?'069e57623f79202d00e4c399d7aee2aa185aad14':null,contentSha256:null,byteCount:null,existenceStatus:path===TARGETS[0]?'PRESENT':'ABSENT',fetchbackStatus:'VERIFIED_AT_GOVERNING_HEAD',occurrenceClass:'MOUNTAIN_TRAVERSAL_GOVERNING_OCCURRENCE'}),
  deepFreeze({repository:REPOSITORY,refType:'COMMIT',refName:CANDIDATE_HEAD,commitSha:CANDIDATE_HEAD,path,gitBlobSha:TARGET_BLOBS[path],contentSha256:null,byteCount:null,existenceStatus:'PRESENT',fetchbackStatus:'VERIFIED_AT_FROZEN_CANDIDATE',occurrenceClass:'MOUNTAIN_TRAVERSAL_CANDIDATE_OCCURRENCE'})
]));

export const H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'H_EARTH_MOUNTAIN_TRAVERSAL_EXACT_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth Mountain Traversal Exact-Path Recognition',
  repositoryPaths: TARGETS,
  repositoryOccurrences: OCCURRENCES,
  lifecycleStatus: 'CANDIDATE_PATH_RECOGNITION',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authorityScope: [
    'EXACT_PATH_RESOLUTION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION',
    'READ_ONLY_PREMUTATION_PREFLIGHT_RESOLUTION'
  ],
  authorityLimitations: [
    'NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY',
    'NO_DIAGNOSTIC_BYTE_MUTATION_AUTHORITY',
    'NO_RENDERER_MUTATION_AUTHORITY',
    'NO_PREFIX_WIDE_H_EARTH_DIAGNOSTIC_REGISTRATION_AUTHORITY',
    'NO_PREFLIGHT_WAIVER_AUTHORITY',
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
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() { return registryInstance; }

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  if (!TARGETS.includes(normalized)) {
    return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  }
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  const occurrence = OCCURRENCES.find((candidate) => candidate.path === normalized && candidate.commitSha === CANDIDATE_HEAD);
  return deepFreeze({
    ...base,
    repositoryPath: normalized,
    resolved: true,
    unresolved: false,
    nodes: [...(base.nodes ?? []), H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE],
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
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({
    ...input,
    ...(normalized == null ? {} : {path: normalized})
  });
  return deepFreeze({
    query: base.query,
    matches: [
      ...(base.matches ?? []),
      ...localMatches.map((occurrence) => ({
        nodeId: NODE_ID,
        node: H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE,
        occurrence
      }))
    ],
    resolved: base.resolved === true || localMatches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const normalized = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const node = H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE;
  const match =
    (criteria.nodeId == null || criteria.nodeId === NODE_ID) &&
    (normalized == null || TARGETS.includes(normalized)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(match ? [...base, node] : base);
}

export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') {
  return nodeId === NODE_ID
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  return nodeId === NODE_ID
    ? deepFreeze({
        nodeId,
        nodes: [H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE],
        relations: [],
        resolved: true
      })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function getHEarthRepositoryRegistryDiscoveryDescriptor() {
  return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
}

export function verifyHEarthMountainTraversalPathRecognition() {
  const resolutions = TARGETS.map((path) => resolveHEarthRepositoryRegistryPath(path));
  const occurrences = TARGETS.map((path) =>
    resolveHEarthRepositoryRegistryOccurrence({
      path,
      refType: 'COMMIT',
      refName: CANDIDATE_HEAD,
      commitSha: CANDIDATE_HEAD,
      existenceStatus: 'PRESENT'
    })
  );
  const checks = deepFreeze({
    exactTargetPathCount:
      TARGETS.length === 4 &&
      H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE.repositoryPaths.length === 4,
    allTargetPathsResolve: resolutions.every((resolution) => resolution.resolved === true),
    governingOccurrencesPresent: OCCURRENCES.filter(o=>o.commitSha===GOVERNING_HEAD&&o.existenceStatus==='PRESENT').length===1 && OCCURRENCES.filter(o=>o.commitSha===GOVERNING_HEAD&&o.existenceStatus==='ABSENT').length===3,
    candidateBlobsBound: OCCURRENCES.filter(o=>o.commitSha===CANDIDATE_HEAD).every(o=>o.existenceStatus==='PRESENT'&&o.gitBlobSha===TARGET_BLOBS[o.path]),
    neighborUnresolved: resolveHEarthRepositoryRegistryPath('/h-earth-3d/evidence/mountain-traversal-20261006/unknown-sibling.json').resolved!==true,
    occurrenceQueriesResolve:
      occurrences.every((resolution) => resolution.resolved === true),
    exactPathOnly: TARGETS.length===4 && TARGETS.every(path=>!path.endsWith('/')),
    noPrefixRegistration: !TARGETS.includes('/showroom/globe/h-earth/diagnostic/'),
    auditOnly: H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly:
      H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductRuntimeAuthority:
      H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY'),
    noDiagnosticByteAuthority:
      H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_DIAGNOSTIC_BYTE_MUTATION_AUTHORITY'),
    noPrefixWideAuthority:
      H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PREFIX_WIDE_H_EARTH_DIAGNOSTIC_REGISTRATION_AUTHORITY'),
    noPreflightWaiver:
      H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PREFLIGHT_WAIVER_AUTHORITY'),
    noPublicationAuthority:
      H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status: eligible
      ? 'H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_PASS'
      : 'H_EARTH_MOUNTAIN_TRAVERSAL_PATH_RECOGNITION_FAIL',
    governingHead: GOVERNING_HEAD,
    targetPaths: TARGETS,
    targetBlobs: TARGET_BLOBS,
    checks
  });
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
