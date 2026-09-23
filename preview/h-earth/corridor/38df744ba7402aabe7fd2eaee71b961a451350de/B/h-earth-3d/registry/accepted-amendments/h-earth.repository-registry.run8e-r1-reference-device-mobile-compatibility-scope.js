/** Read-only Run 8E-R1 reference-device and mobile-compatibility scope correction. */
import baseFacade from './h-earth.repository-registry.run8e-r1-repository-package-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-reference-device-mobile-compatibility-001';
const BASE_MAIN_HEAD = '70ed4a1ab13b562d88609b8f12b5e42545205e03';
const VALIDATED_HEAD = '49bb5096731b42d2683838638daaaac6462fc669';
const RECEIPT_PATH =
  '/h-earth-3d/validation/h-earth.run8e-r1.reference-device-mobile-compatibility.correction.receipt.json';

export const H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_PATHS = Object.freeze([
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r1.reference-device-and-mobile-compatibility-amendment.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r1-reference-device-mobile-compatibility-scope.js',
  '/h-earth-3d/validation/h-earth.run8e-r1.reference-device-mobile-compatibility.validation.mjs',
  RECEIPT_PATH,
  '/.github/workflows/h-earth-run8e-r1-reference-device-mobile-compatibility.yml',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: repositoryPath === RECEIPT_PATH ? VALIDATED_HEAD : null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_ON_REFERENCE_DEVICE_SCOPE_CORRECTION_BRANCH',
  occurrenceClass: 'RUN_8E_R1_REFERENCE_DEVICE_AND_MOBILE_COMPATIBILITY_SCOPE_CORRECTION'
})));

export const H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_MOBILE_COMPATIBILITY_CORRECTION_v1',
  evidenceClass: 'DEVICE_NEUTRAL_VALIDATION_AND_PLATFORM_SCOPE_CORRECTION',
  sourceKind: 'REPOSITORY_CONTROL_AMENDMENT_AND_READ_ONLY_VALIDATION',
  sourceIdOrPath: RECEIPT_PATH,
  sourceOccurrenceOrRevision: VALIDATED_HEAD,
  assertionScope: Object.freeze([
    'PRODUCT_TARGET_ALL_SUPPORTED_MOBILE_DEVICES',
    'SAMSUNG_REFERENCE_DEVICE_NOT_PLATFORM_BOUNDARY',
    'CAPABILITY_BASED_BACKEND_SELECTION',
    'SAMSUNG_SPECIFIC_IMPLEMENTATION_PROHIBITED',
    'REFERENCE_DEVICE_AND_ALL_MOBILE_CLAIMS_SEPARATED',
    'MULTI_DEVICE_COMPATIBILITY_MATRIX_REQUIRED',
    'EXISTING_WORLD_CAMERA_NAVIGATION_AND_RENDERER_AUTHORITIES_PRESERVED',
    'R2_PRODUCT_MUTATION_STILL_BLOCKED_PENDING_REFERENCE_DEVICE_INTERACTION_RECEIPT'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    baseMainHead: BASE_MAIN_HEAD,
    branch: BRANCH,
    validatedHead: VALIDATED_HEAD,
    validationRun: 30231121889,
    validationJob: 89870091381,
    evidenceArtifact: 8640124721,
    evidenceArtifactDigest:
      'sha256:070387f5b13ca4a07690d862cdef5a5b2beb8db6bf11f076456151002b8c8f92',
    automaticRegistryPreflightRun: 30231121890,
    productRouteMutated: false,
    rendererSourceMutated: false,
    cameraAuthorityMutated: false,
    navigationAuthorityMutated: false,
    historicalR1EvidenceRewritten: false
  }),
  evidenceLimitations: Object.freeze([
    'REFERENCE_DEVICE_PHYSICAL_INTERACTION_RECEIPT_NOT_YET_CAPTURED',
    'SECOND_ANDROID_CLASS_NOT_YET_EXECUTED',
    'IOS_MOBILE_SAFARI_CLASS_NOT_YET_EXECUTED',
    'LOWER_PERFORMANCE_MOBILE_CLASS_NOT_YET_EXECUTED',
    'RUN_8E_R1_PASS_CLOSED_NOT_CLAIMED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_AND_MOBILE_COMPATIBILITY_SCOPE_CORRECTION',
  nodeType: 'RECOVERY_PROGRAM_SCOPE_AMENDMENT',
  nodeSubtype: 'REFERENCE_DEVICE_NOT_PLATFORM_BOUNDARY',
  displayName: 'H-Earth Run 8E-R1 Reference Device and Mobile Compatibility Correction',
  description:
    'Corrects forward-looking Run 8E recovery language so Samsung remains the physical reference-device anchor while the implementation and compatibility target remain device-neutral across supported mobile classes.',
  repositoryPaths: [...H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'DEVICE_NEUTRAL_PLATFORM_AND_VALIDATION_SCOPE_CORRECTION',
  authorityPosture: 'SCOPE_CORRECTION_PASS_REFERENCE_DEVICE_INTERACTION_PENDING',
  authoritySource: Object.freeze([
    'USER_AUTHORIZED_DEVICE_NEUTRAL_CORRECTION',
    'RUN_8E_R1_PHYSICAL_REFERENCE_DEVICE_ARCHITECTURE_PROBES',
    'RUN_8E_FAIL_OPEN_DISPOSITION',
    'EXECUTED_DEVICE_NEUTRAL_CORRECTION_VALIDATION'
  ]),
  authorityScope: Object.freeze([
    'RECLASSIFY_SAMSUNG_AS_REFERENCE_DEVICE_ONLY',
    'ESTABLISH_ALL_SUPPORTED_MOBILE_PRODUCT_TARGET',
    'PROHIBIT_DEVICE_BRAND_SPECIFIC_RENDERER_AND_GESTURE_ASSUMPTIONS',
    'ESTABLISH_REFERENCE_ANDROID_SECOND_ANDROID_IOS_AND_LOWER_PERFORMANCE_VALIDATION_CLASSES',
    'PRESERVE_R1_PHYSICAL_INTERACTION_RECEIPT_BOUNDARY'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PUBLIC_RENDERER_REPLACEMENT',
    'NO_IMMUTABLE_LIVE_RENDER_PACKAGE_CONSTRUCTION',
    'NO_CAMERA_OR_NAVIGATION_MUTATION',
    'NO_TERRAIN_MATERIAL_LIGHT_OR_VEGETATION_MUTATION',
    'NO_REFERENCE_DEVICE_PASS_CLAIM',
    'NO_ALL_MOBILE_COMPATIBILITY_PASS_CLAIM'
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
    'RUN_8E_R1_REPOSITORY_PACKAGE_BEFORE_REFERENCE_DEVICE_SCOPE_CORRECTION',
    'REFERENCE_DEVICE_PHYSICAL_INTERACTION_RECEIPT_BEFORE_RUN_8E_R2',
    'REFERENCE_DEVICE_ACCEPTANCE_BEFORE_BROAD_ANDROID_COMPATIBILITY',
    'SECOND_ANDROID_IOS_AND_LOWER_PERFORMANCE_VALIDATION_BEFORE_ALL_MOBILE_COMPATIBILITY_CLAIM'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'CONTROL_REGISTRY_VALIDATION_WORKFLOW_AND_DURABLE_RECEIPT_ONLY',
  prohibitedMutations: Object.freeze([
    'PUBLIC_ROUTE_MUTATION',
    'RENDERER_IMPLEMENTATION',
    'CAMERA_OR_NAVIGATION_AUTHORITY_CHANGE',
    'SAMSUNG_ONLY_IMPLEMENTATION',
    'RUN_8E_R2_PRODUCT_MUTATION',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze([
    'DEVICE_NEUTRAL_PRODUCT_TARGET',
    'REFERENCE_DEVICE_ROLE_PRESERVED',
    'CAPABILITY_BASED_IMPLEMENTATION_LAW',
    'MULTI_DEVICE_VALIDATION_MATRIX',
    'NO_PRODUCT_OR_AUTHORITY_MUTATION',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_BEFORE_REFERENCE_DEVICE_PHYSICAL_INTERACTION_RECEIPT',
    'STOP_BEFORE_RUN_8E_R2_PRODUCT_MUTATION',
    'STOP_BEFORE_BROAD_MOBILE_COMPATIBILITY_CLAIM'
  ]),
  currentIdentityReferences: Object.freeze([
    BASE_MAIN_HEAD,
    VALIDATED_HEAD,
    BRANCH,
    '30231121889',
    '8640124721'
  ]),
  lifecycleStatus: 'DEVICE_NEUTRAL_SCOPE_CORRECTION_PASS_REFERENCE_DEVICE_INTERACTION_PENDING',
  unresolvedFields: Object.freeze([
    'FINAL_CORRECTION_BRANCH_HEAD_AFTER_RECEIPT_RECONCILIATION',
    'MERGE_COMMIT',
    'REFERENCE_DEVICE_PHYSICAL_INTERACTION_RECEIPT',
    'RUN_8E_R1_FINAL_DISPOSITION'
  ])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE.nodeId
    ? H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({
      nodeId: H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE.nodeId,
      node: H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE,
      occurrence
    }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_SCOPE_FACADE;
