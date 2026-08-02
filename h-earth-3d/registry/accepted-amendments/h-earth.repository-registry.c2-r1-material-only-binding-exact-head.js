/**
 * Read-only C2-R1 material-only binding exact-head registry overlay.
 *
 * This control-plane amendment registers PR #484's immutable candidate
 * occurrence, the two governed runtime paths that must be recognized by
 * automatic repository-registry preflight, and its own bounded installation
 * surfaces. It creates no product, merge, promotion, publication, or mutation
 * authority.
 */
import baseFacade from './h-earth.repository-registry.gratitude-region-final-spatial-placement-disposition.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const CANDIDATE_PR = 484;
const CANDIDATE_BRANCH = 'agent/h-earth-c2-r1-material-only-binding-implementation-001';
const CANDIDATE_HEAD = '44019e27c3d52c59cc59bba7c833b6317d014273';
const PACKAGE_IDENTITY = 'H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_773DAE4E';

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_RUNTIME_PATHS = Object.freeze([
  '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js'
]);

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_CONTROL_PATHS = Object.freeze([
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const ALL_REGISTERED_PATHS = Object.freeze([
  ...H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_RUNTIME_PATHS,
  ...H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_CONTROL_PATHS
]);

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_REGISTRATION = freeze({
  registrationId: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_REGISTRATION_v1',
  operationId: 'H_EARTH_C2_R1_MC5_REGISTRY_WORKFLOW_DEADLOCK_RESOLUTION_001',
  repository: REPOSITORY,
  pullRequestNumber: CANDIDATE_PR,
  candidateBranch: CANDIDATE_BRANCH,
  candidateHead: CANDIDATE_HEAD,
  packageIdentity: PACKAGE_IDENTITY,
  runtimePaths: H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_RUNTIME_PATHS,
  controlPlanePaths: H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_CONTROL_PATHS,
  productMutationAuthorized: false,
  candidateMutationAuthorized: false,
  materializationRerunAuthorized: false,
  mergeAuthorized: false,
  publicationAuthorized: false
});

const RUNTIME_OCCURRENCES = Object.freeze(
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_RUNTIME_PATHS.map((repositoryPath) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: CANDIDATE_BRANCH,
    commitSha: CANDIDATE_HEAD,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'EXACT_HEAD_REGISTERED_PENDING_MC5_INDEPENDENT_VERIFICATION',
    occurrenceClass: 'C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_RUNTIME_OCCURRENCE',
    pullRequestNumber: CANDIDATE_PR,
    packageIdentity: PACKAGE_IDENTITY
  }))
);

const CONTROL_OCCURRENCES = Object.freeze(
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_CONTROL_PATHS.map((repositoryPath) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: 'main',
    commitSha: null,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT_AFTER_CONTROL_PLANE_MERGE',
    fetchbackStatus: 'CONTROL_PLANE_INSTALLATION_CANDIDATE',
    occurrenceClass: 'C2_R1_MC5_CONTROL_PLANE_INSTALLATION_OCCURRENCE'
  }))
);

const OCCURRENCES = Object.freeze([
  ...RUNTIME_OCCURRENCES,
  ...CONTROL_OCCURRENCES
]);

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_v1',
  evidenceClass: 'EXACT_REPOSITORY_CANDIDATE_IDENTITY_REGISTRATION',
  sourceKind: 'GITHUB_PULL_REQUEST_EXACT_HEAD',
  sourceIdOrPath: `PR_${CANDIDATE_PR}`,
  sourceOccurrenceOrRevision: CANDIDATE_HEAD,
  assertionScope: Object.freeze([
    'PR_484_EXACT_BRANCH_REGISTERED',
    'PR_484_EXACT_HEAD_REGISTERED',
    'TWO_RUNTIME_PATHS_REGISTERED',
    'CONTROL_PLANE_INSTALLATION_PATHS_REGISTERED',
    'MATERIAL_ONLY_PACKAGE_IDENTITY_REGISTERED',
    'MC5_CONTROL_PLANE_VERIFICATION_REQUIRED'
  ]),
  verifiedOn: '2026-08-02',
  evidenceLimitations: Object.freeze([
    'REGISTRATION_IS_NOT_EXECUTION_VERIFICATION',
    'REGISTRATION_IS_NOT_ROLE_3_CERTIFICATION',
    'REGISTRATION_IS_NOT_ROLE_5_RATIFICATION',
    'REGISTRATION_DOES_NOT_AUTHORIZE_PRODUCT_MUTATION',
    'REGISTRATION_DOES_NOT_AUTHORIZE_MERGE_OR_PROMOTION'
  ])
});

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE = freeze({
  nodeId: 'H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_PACKAGE',
  nodeType: 'REPOSITORY_SCOPE_PACKET',
  nodeSubtype: 'C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD',
  displayName: 'H-Earth C2-R1 Material-Only Binding Exact Head',
  description:
    'Registers PR #484, its immutable candidate branch and head, the material-only package identity, two runtime paths, and the bounded control-plane installation surfaces required for MC5 verification.',
  repositoryPaths: ALL_REGISTERED_PATHS,
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXACT_REPOSITORY_CANDIDATE_IDENTITY_REGISTRATION',
  evidenceReferences: Object.freeze([
    H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE.evidenceId
  ]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_EXACT_HEAD_SCOPE_REGISTRATION',
  authoritySource: Object.freeze([
    'ROLE_4_PROJECT_GOVERNANCE_AND_CROSS_ROOM_COORDINATION',
    'H_EARTH_C2_R1_MC5_REGISTRY_WORKFLOW_DEADLOCK_RESOLUTION_001'
  ]),
  authorityScope: Object.freeze([
    'EXACT_BRANCH_IDENTITY_REGISTRATION',
    'EXACT_HEAD_IDENTITY_REGISTRATION',
    'TWO_RUNTIME_PATH_SCOPE_REGISTRATION',
    'CONTROL_PLANE_INSTALLATION_SCOPE_REGISTRATION',
    'MC5_READ_ONLY_VERIFICATION_ENABLEMENT'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION_AUTHORITY',
    'NO_CANDIDATE_MUTATION_AUTHORITY',
    'NO_MATERIALIZATION_RERUN_AUTHORITY',
    'NO_MERGE_AUTHORITY',
    'NO_PROMOTION_OR_PUBLICATION_AUTHORITY',
    'NO_ROLE_1_SELF_CERTIFICATION'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'CONTROL_PLANE_REGISTRATION_ONLY',
  prohibitedMutations: Object.freeze([
    'PRODUCT_FILE_MUTATION',
    'PR_484_MUTATION',
    'MATERIALIZATION_RERUN',
    'MERGE',
    'PROMOTION',
    'PUBLIC_DEFAULT_REPLACEMENT'
  ]),
  requiredValidations: Object.freeze([
    'PR_484_BRANCH_EQUALS_REGISTERED_BRANCH',
    'PR_484_HEAD_EQUALS_REGISTERED_HEAD',
    'BOTH_RUNTIME_PATHS_RESOLVE_IN_REGISTRY',
    'BOTH_RUNTIME_OCCURRENCES_MATCH_EXACT_HEAD',
    'CONTROL_PLANE_INSTALLATION_PATHS_RESOLVE_IN_REGISTRY',
    'PACKAGE_IDENTITY_EQUALS_REGISTERED_PACKAGE'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_PR_484_BRANCH_MOVES',
    'STOP_IF_PR_484_HEAD_MOVES',
    'STOP_IF_EITHER_RUNTIME_PATH_IS_UNREGISTERED',
    'STOP_IF_CONTROL_PLANE_PATH_IS_UNREGISTERED',
    'STOP_IF_PACKAGE_IDENTITY_DIFFERS'
  ]),
  currentIdentityReferences: Object.freeze([
    CANDIDATE_HEAD,
    CANDIDATE_BRANCH,
    PACKAGE_IDENTITY,
    `PR_${CANDIDATE_PR}`
  ]),
  lifecycleStatus: 'CANDIDATE_EXACT_HEAD_REGISTERED',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  ALL_REGISTERED_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
    }
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE
  ]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE.nodeId
    ? H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE.evidenceId
    ? H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({
        repositoryPath,
        resolved: true,
        nodes: [indexed.node],
        occurrences: indexed.occurrences,
        unresolved: false
      })
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
      nodeId: H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE.nodeId,
      node: H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE,
      occurrence
    }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({
    query: base.query,
    matches: [...base.matches, ...local],
    resolved: base.resolved || local.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE.nodeId
    ? freeze({
        nodeId: id,
        nodes: [H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_NODE],
        relations: [],
        unresolved: false
      })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_FACADE = freeze({
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

export default H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_FACADE;
