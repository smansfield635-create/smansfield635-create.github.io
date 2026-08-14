/**
 * H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_v3
 * Audit-only exact-path recognition for the promoted Awards public face and
 * its Trophy Standard static/browser validators. No mutation authority.
 */
import baseFacade from './h-earth.repository-registry.in-world-live-gpu-binding-path-recognition.js';

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
const AWARDS_MAIN = '90ae8c69b14716ea0506341711c3d0a97c47c570';
const OPERATION_BASE = '178ebf052e35d8a06c7930432b46b0c7445691d3';
const TARGET_PATH = '/showroom/globe/h-earth/awards/index.html';
const TARGET_MAIN_BLOB = '1e854558240b71af72f5fb22a26b78ebbbdcfc08';
const BROWSER_PATH = '/h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.browser.mjs';
const BROWSER_BASE_BLOB = 'ae3eae6abba0121bd641b53eb932699eb903a1fd';
const RUNNER_PATH = '/h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.runner.mjs';
const RUNNER_BASE_BLOB = 'd14a16c31dbaaa676031cbd654f8d1ecb16eacb9';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.awards-public-face-path-recognition.js';
const NODE_ID = 'H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_v3';

export const H_EARTH_AWARDS_PUBLIC_FACE_TARGET_PATHS = Object.freeze([TARGET_PATH]);
export const H_EARTH_AWARDS_PUBLIC_FACE_RECOGNIZED_PATHS = Object.freeze([
  TARGET_PATH, BROWSER_PATH, RUNNER_PATH, AMENDMENT_PATH
]);

const OCCURRENCES = Object.freeze([
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: AWARDS_MAIN, commitSha: AWARDS_MAIN, path: TARGET_PATH, gitBlobSha: TARGET_MAIN_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_GOVERNING_MAIN', occurrenceClass: 'EXISTING_H_EARTH_AWARDS_PUBLIC_FACE_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: OPERATION_BASE, commitSha: OPERATION_BASE, path: BROWSER_PATH, gitBlobSha: BROWSER_BASE_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_OPERATION_BASELINE', occurrenceClass: 'EXISTING_H_EARTH_AWARDS_BROWSER_VALIDATOR_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: OPERATION_BASE, commitSha: OPERATION_BASE, path: RUNNER_PATH, gitBlobSha: RUNNER_BASE_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_OPERATION_BASELINE', occurrenceClass: 'EXISTING_H_EARTH_AWARDS_STATIC_VALIDATOR_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: AWARDS_MAIN, commitSha: AWARDS_MAIN, path: AMENDMENT_PATH, gitBlobSha: null, contentSha256: null, byteCount: null, existenceStatus: 'ABSENT', fetchbackStatus: 'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_AWARDS_REGISTRY_PREREQUISITE', occurrenceClass: 'AUTHORIZED_REGISTRY_PREREQUISITE_NOT_YET_MATERIALIZED_AT_GOVERNING_MAIN' })
]);

export const H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'EXISTING_H_EARTH_AWARDS_AND_VALIDATOR_PATH_RECOGNITION_WITH_EXACT_BLOB_CUSTODY',
  sourceKind: 'AUTOMATIC_PREFLIGHT_STOPS_PLUS_EXACT_FETCHBACK',
  sourceIdOrPath: 'PR935_AWARDS_PATH_AND_PR1004_PROMOTED_TROPHY_STANDARD_VALIDATORS',
  governingMain: AWARDS_MAIN,
  operationBase: OPERATION_BASE,
  exactTargetPathCount: 1,
  exactRecognizedPathCount: 4,
  registrationEffect: 'READ_ONLY_PATH_RECOGNITION_ONLY',
  assertionScope: Object.freeze(['EXACT_AWARDS_PATH', 'EXACT_TROPHY_STANDARD_BROWSER_VALIDATOR_PATH', 'EXACT_TROPHY_STANDARD_STATIC_VALIDATOR_PATH', 'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION']),
  evidenceLimitations: Object.freeze(['NO_AWARDS_PRODUCT_MUTATION_AUTHORITY', 'NO_VALIDATOR_MUTATION_AUTHORITY', 'NO_AWARD_OUTCOME_AUTHORITY', 'NO_SEMANTIC_OR_CANONICAL_IDENTITY_AUTHORITY', 'NO_H_EARTH_RUNTIME_RENDERER_TERRAIN_GEOMETRY_WORLD_OR_GAMEPLAY_AUTHORITY', 'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'])
});

export const H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'EXISTING_H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth Awards Public Face Path Recognition',
  description: 'Read-only recognition of the promoted Awards public face and its Trophy Standard verifier paths for automatic preflight resolution.',
  repositoryPaths: [...H_EARTH_AWARDS_PUBLIC_FACE_RECOGNIZED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUDIT_ONLY_PATH_RECOGNITION_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_EXISTING_H_EARTH_AWARDS_AND_VALIDATOR_PATH_RECOGNITION',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze(['PR935_AUTOMATIC_PREFLIGHT_STOP', 'PR1004_AUTOMATIC_PREFLIGHT_STOPS', `EXACT_OPERATION_BASE=${OPERATION_BASE}`]),
  authorityScope: Object.freeze(['EXACT_PATH_RESOLUTION', 'EXACT_EXISTING_OCCURRENCE_IDENTITY', 'AUTOMATIC_H_EARTH_PREFLIGHT_RESOLUTION']),
  authorityLimitations: Object.freeze(['NO_AWARDS_PRODUCT_MUTATION', 'NO_BROWSER_VALIDATOR_MUTATION_AUTHORITY', 'NO_STATIC_VALIDATOR_MUTATION_AUTHORITY', 'NO_AWARD_OUTCOME_AUTHORITY', 'NO_SEMANTIC_AUTHORITY', 'NO_CANONICAL_IDENTITY_AUTHORITY', 'NO_H_EARTH_RUNTIME_AUTHORITY', 'NO_RENDERER_AUTHORITY', 'NO_TERRAIN_AUTHORITY', 'NO_GEOMETRY_AUTHORITY', 'NO_WORLD_AUTHORITY', 'NO_GAMEPLAY_AUTHORITY', 'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY']),
  parentRelations: Object.freeze([]), childRelations: Object.freeze([]), peerRelations: Object.freeze([]), upstreamBoundaries: Object.freeze([]), downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['PREFLIGHT_STOP_PRECEDES_PATH_RECOGNITION', 'PATH_RECOGNITION_PRECEDES_FRESH_PREFLIGHT']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RECOGNITION',
  prohibitedMutations: Object.freeze(['AWARDS_PAGE_MUTATION_FROM_REGISTRY_AUTHORITY', 'VALIDATOR_MUTATION_FROM_REGISTRY_AUTHORITY', 'AWARD_OUTCOME_CLAIM_FROM_REGISTRY_AUTHORITY']),
  requiredValidations: Object.freeze(['EXACT_ONE_AWARDS_TARGET_PATH', 'EXACT_RECOGNIZED_VALIDATOR_PATHS', 'PREDECESSOR_REGISTRY_IDENTITY_PRESERVED']),
  stoppingBoundaries: Object.freeze(['STOP_ON_PATH_OUTSIDE_EXACT_SCOPE', 'STOP_ON_AUTHORITY_EXPANSION']),
  currentIdentityReferences: Object.freeze([AWARDS_MAIN, OPERATION_BASE, `TARGET_MAIN_BLOB=${TARGET_MAIN_BLOB}`, `BROWSER_BASE_BLOB=${BROWSER_BASE_BLOB}`, `RUNNER_BASE_BLOB=${RUNNER_BASE_BLOB}`]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_AWARDS_PUBLIC_FACE_RECOGNIZED_PATHS.map((repositoryPath) => [repositoryPath, deepFreeze({ nodes: Object.freeze([H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE]), occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath)) })]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({ ...baseInstance, evidenceRecords: [...(baseInstance.evidenceRecords ?? []), H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_EVIDENCE], nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID), H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE] });

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) { return nodeId === NODE_ID ? H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId); }
export function getHEarthRepositoryRegistryEvidence(evidenceId) { return evidenceId === EVIDENCE_ID ? H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId); }
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({ ...base, repositoryPath: normalized, resolved: true, nodes: [...(base.nodes ?? []), ...indexed.nodes], occurrences: [...(base.occurrences ?? []), ...indexed.occurrences], unresolved: false });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES.filter((entry) => (normalizedPath == null || entry.path === normalizedPath) && (input.refType == null || entry.refType === input.refType) && (input.refName == null || entry.refName === input.refName) && (input.commitSha == null || entry.commitSha === input.commitSha) && (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) && (input.existenceStatus == null || entry.existenceStatus === input.existenceStatus)).map((occurrence) => deepFreeze({ nodeId: NODE_ID, node: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({ ...input, ...(normalizedPath == null ? {} : { path: normalizedPath }) });
  return deepFreeze({ query: base.query, matches: [...(base.matches ?? []), ...localMatches], resolved: base.resolved === true || localMatches.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE;
  const normalizedRepositoryPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const matches = (criteria.nodeId == null || criteria.nodeId === node.nodeId) && (normalizedRepositoryPath == null || node.repositoryPaths.includes(normalizedRepositoryPath)) && (criteria.nodeType == null || criteria.nodeType === node.nodeType) && (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) && (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) && (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(matches ? [...base, node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') { return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction); }
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) { return nodeId === NODE_ID ? deepFreeze({ nodeId, nodes: [H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE], relations: [], resolved: true }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId); }

export function verifyHEarthAwardsPublicFacePathRecognition() {
  const targetResolution = resolveHEarthRepositoryRegistryPath(TARGET_PATH);
  const browserResolution = resolveHEarthRepositoryRegistryPath(BROWSER_PATH);
  const runnerResolution = resolveHEarthRepositoryRegistryPath(RUNNER_PATH);
  const checks = deepFreeze({
    exactTargetPathCount: H_EARTH_AWARDS_PUBLIC_FACE_TARGET_PATHS.length === 1,
    targetPathResolves: targetResolution.resolved === true,
    targetOccurrenceMatched: (targetResolution.occurrences ?? []).some((entry) => entry.path === TARGET_PATH && entry.gitBlobSha === TARGET_MAIN_BLOB && entry.existenceStatus === 'PRESENT'),
    exactTargetMainBlob: OCCURRENCES.find((entry) => entry.path === TARGET_PATH)?.gitBlobSha === TARGET_MAIN_BLOB,
    browserValidatorPathResolves: browserResolution.resolved === true,
    staticValidatorPathResolves: runnerResolution.resolved === true,
    auditOnly: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noAwardsMutationAuthority: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_AWARDS_PRODUCT_MUTATION'),
    noAwardOutcomeAuthority: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_AWARD_OUTCOME_AUTHORITY'),
    noCanonicalAuthority: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CANONICAL_IDENTITY_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({ eligible, status: eligible ? 'H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_PASS' : 'H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_FAIL', checks, targetPath: TARGET_PATH, targetMainBlob: TARGET_MAIN_BLOB, browserPath: BROWSER_PATH, runnerPath: RUNNER_PATH });
}

export const H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_FACADE = deepFreeze({ ...baseFacade, getHEarthRepositoryRegistryInstance, getHEarthRepositoryRegistryNode, getHEarthRepositoryRegistryEvidence, resolveHEarthRepositoryRegistryPath, resolveHEarthRepositoryRegistryOccurrence, findHEarthRepositoryRegistryNodes, getHEarthRepositoryRegistryRelationsForNode, getHEarthRepositoryRegistryDependencyClosure, verifyHEarthAwardsPublicFacePathRecognition });
export default H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_FACADE;