/**
 * Read-only IMI empirical platform registry scope overlay.
 * Registers the bounded PR #589 instrumentation surface for automatic preflight.
 * Creates no product, source, mutation, merge, publication, or clinical authority.
 */
import baseFacade, {
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE,
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE
} from './h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js';

export {
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE,
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE
} from './h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const normalizePath = (value) => {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'instrument/imi-empirical-platform-v1';
const PR_NUMBER = 589;
const OBSERVED_HEAD = '3e91d0f94a762d99c5a614e528612db40827fa19';
const PREFIXES = Object.freeze([
  '/h-earth-3d/control-plane/imi-empirical-platform/',
  '/h-earth-3d/control-plane/instrument-platform/',
  '/h-earth-3d/tools/imi-empirical-platform/',
  '/h-earth-3d/validation/imi-empirical-platform/'
]);
const EXACT_PATHS = Object.freeze([
  '/h-earth-3d/tools/instrument-platform/tool-registry.mjs',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.imi-empirical-platform-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);
export const H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_PATHS = Object.freeze([...PREFIXES, ...EXACT_PATHS]);
const normalizedPrefixes = Object.freeze(PREFIXES.map((value) => normalizePath(value)));
const isManagedPath = (repositoryPath) => {
  const normalized = normalizePath(repositoryPath);
  return Boolean(normalized) && (
    EXACT_PATHS.includes(normalized) ||
    normalizedPrefixes.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))
  );
};
const occurrencePath = (repositoryPath) => {
  const normalized = normalizePath(repositoryPath);
  const prefix = normalizedPrefixes.find((candidate) => normalized === candidate || normalized.startsWith(`${candidate}/`));
  return prefix ? `${prefix}/` : normalized;
};
const OCCURRENCES = Object.freeze(H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'UNRESOLVED',
  fetchbackStatus: 'NOT_PERFORMED',
  occurrenceClass: 'CANDIDATE'
})));

export const H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_IMI_EMPIRICAL_PLATFORM_PR_589_SCOPE_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'LOCAL_VALIDATION',
  sourceIdOrPath: 'PR_589_AUTOMATIC_PREFLIGHT_SCOPE_REPAIR',
  sourceOccurrenceOrRevision: `PR=${PR_NUMBER};BRANCH=${BRANCH};OBSERVED_HEAD=${OBSERVED_HEAD}`,
  assertionScope: Object.freeze([
    'IMI_EMPIRICAL_PLATFORM_CONTROL_PLANE',
    'IMI_EMPIRICAL_PLATFORM_TOOL_BASE',
    'IMI_EMPIRICAL_PLATFORM_VALIDATION_RUNNERS',
    'INSTRUMENT_PLATFORM_TOOL_REGISTRY_ENTRY',
    'READ_ONLY_REPOSITORY_REGISTRY_SCOPE_RESOLUTION'
  ]),
  verifiedOn: '2026-08-05',
  evidenceLimitations: Object.freeze([
    'NO_PRODUCT_AUTHORITY',
    'NO_SOURCE_AUTHORITY',
    'NO_MUTATION_AUTHORITY',
    'NO_MERGE_AUTHORITY',
    'NO_PUBLIC_RELEASE_AUTHORITY',
    'NO_PHASE_4_AUTHORIZATION',
    'NO_FINAL_INSTRUMENT_VALIDATION'
  ])
});

export const H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_NODE = freeze({
  nodeId: 'H_EARTH_IMI_EMPIRICAL_PLATFORM_PREOFFICIAL_PR_589_PACKAGE',
  nodeType: 'COMPOSITE_UNIT',
  nodeSubtype: 'PREOFFICIAL_EMPIRICAL_INSTRUMENTATION_PLATFORM',
  displayName: 'H-Earth IMI Empirical Platform PR 589',
  description: 'Read-only repository-registry scope for the preofficial IMI empirical platform control plane, tool base, routes, evidence packages, and validation runners on draft PR #589.',
  repositoryPaths: H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_PATHS,
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_EVIDENCE.evidenceId]),
  authorityClass: 'NO_AUTHORITY',
  authorityPosture: 'READ_ONLY_SCOPE_REGISTRATION_FOR_AUTOMATIC_PREFLIGHT',
  authoritySource: Object.freeze(['USER_AUTHORIZED_IMI_EMPIRICAL_PLATFORM_EXECUTION', 'DRAFT_PR_589_REPOSITORY_EVIDENCE']),
  authorityScope: Object.freeze(['RESOLVE_PR_589_H_EARTH_PATHS', 'DERIVE_BOUNDED_AFFECTED_SCOPE', 'EMIT_READ_ONLY_PREFLIGHT_RECEIPTS']),
  authorityLimitations: Object.freeze(['NO_PRODUCT_MUTATION', 'NO_ROUTE_RETUNING', 'NO_PHASE_4_AUTHORIZATION', 'NO_MERGE_PUBLICATION_OR_DEPLOYMENT']),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['PHASE_1_BEFORE_PHASE_2', 'PHASE_2_BEFORE_PHASE_3', 'PHASE_3_BEFORE_ANY_SEPARATE_PHASE_4_ADMISSION']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_READ_ONLY_REGISTRY_SCOPE_ONLY',
  prohibitedMutations: Object.freeze(['PRODUCT', 'ROUTE_RETUNING', 'KERNEL', 'PHASE_4', 'MERGE', 'PUBLICATION', 'DEPLOYMENT']),
  requiredValidations: Object.freeze(['AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT', 'DEDICATED_IMI_WORKFLOW', 'TRACK_SPECIFIC_RECEIPT_DIGESTS']),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_PHASE_4_WITHOUT_SEPARATE_ADMISSION', 'STOP_BEFORE_MERGE_OR_PUBLIC_RELEASE']),
  currentIdentityReferences: Object.freeze([`PR=${PR_NUMBER}`, `BRANCH=${BRANCH}`, `OBSERVED_HEAD=${OBSERVED_HEAD}`]),
  lifecycleStatus: 'PREOFFICIAL_DRAFT_PR_SCOPE_REGISTERED',
  unresolvedFields: Object.freeze(['FINAL_PR_589_HEAD', 'FINAL_PHASE_3_COLLECTIVE_DISPOSITION'])
});

const NODE = H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_NODE;
const EVIDENCE = H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_EVIDENCE;
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords.filter((record) => record.evidenceId !== EVIDENCE.evidenceId), EVIDENCE],
  nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE.nodeId), NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (nodeId) => nodeId === NODE.nodeId ? NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
export const getHEarthRepositoryRegistryEvidence = (evidenceId) => evidenceId === EVIDENCE.evidenceId ? EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  if (!normalized || !isManagedPath(normalized)) return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  const occurrence = OCCURRENCES.filter((record) => normalizePath(record.path) === normalizePath(occurrencePath(normalized)));
  return freeze({ repositoryPath: normalized, resolved: true, nodes: [NODE], occurrences: occurrence, unresolved: false });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  const normalized = normalizePath(input.path);
  const localCandidates = input.path == null
    ? OCCURRENCES
    : (normalized && isManagedPath(normalized)
      ? OCCURRENCES.filter((record) => normalizePath(record.path) === normalizePath(occurrencePath(normalized)))
      : []);
  const local = localCandidates
    .filter((record) =>
      (input.commitSha == null || record.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || record.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || record.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: NODE.nodeId, node: NODE, occurrence }));
  return freeze({ query: base.query ?? freeze({ ...input, path: normalized }), matches: [...(base.matches ?? []), ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const match =
    (criteria.repositoryPath == null || isManagedPath(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === NODE.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === NODE.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === NODE.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === NODE.lifecycleStatus);
  return freeze(match ? [...base.filter((node) => node.nodeId !== NODE.nodeId), NODE] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (nodeId, direction = 'BOTH') => nodeId === NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (nodeId) => nodeId === NODE.nodeId
  ? freeze({ nodeId, nodes: [NODE], relations: [], unresolved: false })
  : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);

export const H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_FACADE = freeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_IMI_EMPIRICAL_PLATFORM_REGISTRY_FACADE;
