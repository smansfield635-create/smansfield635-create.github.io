/** Read-only Run 8D path-registration overlay. */
import baseFacade from './h-earth.repository-registry.run8c-normal-light-material-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8d-grounded-vegetation-001';

export const H_EARTH_RUN_8D_SCOPE_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8d-grounded-vegetation-validation.yml',
  '/h-earth-3d/control-plane/run-8/h-earth.run8d.grounded-vegetation.js',
  '/h-earth-3d/environment/h-earth.vegetation-resolution.run8d.js',
  '/showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js',
  '/h-earth-3d/validation/h-earth.run8d.grounded-vegetation.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8d.grounded-vegetation.receipt.json'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8D_SCOPE_PATHS.map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_RUN_8D_WORKSPACE',
    occurrenceClass: 'CANDIDATE'
  }))
);

export const H_EARTH_RUN_8D_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8D_GROUNDED_VEGETATION_SCOPE_v1',
  evidenceClass: 'EXECUTED_IMPLEMENTATION_EVIDENCE',
  sourceKind: 'REPOSITORY_WORKSPACE_GROUNDED_VEGETATION_EXECUTION',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.run8d.grounded-vegetation.receipt.json',
  sourceOccurrenceOrRevision: 'RUN_8D_WORKSPACE_PENDING_FINAL_EXECUTION',
  assertionScope: Object.freeze([
    'THREE_LOCAL_VEGETATION_ARCHETYPE_GEOMETRIES',
    'RUN_7E_DETERMINISTIC_POPULATION_INSTANCE_RESOLUTION',
    'RUN_7G_ACTIVE_DETAIL_BUDGET_CONSUMPTION',
    'SUCCESSOR_TERRAIN_WORLD_Y_ATTACHMENT',
    'SUCCESSOR_TERRAIN_NORMAL_ALIGNMENT',
    'DETERMINISTIC_YAW_AND_SCALE',
    'CAMERA_AND_SCREEN_RELATIVE_ATTACHMENT_PROHIBITION',
    'SOUTH_NEUTRAL_WORLD_PRIMITIVE_VALIDITY',
    'WORLD_SPACE_STABILITY',
    'RUN_8B_NEUTRAL_PRIMITIVE_NONMUTATION',
    'DETERMINISTIC_REPEAT_EXECUTION'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'NO_WEST_ADMISSION',
    'NO_PACKET_002_TRANSFER',
    'NO_RENDERER_LOOP_MUTATION',
    'NO_CAMERA_AUTHORITY',
    'NO_TERRAIN_OCCLUSION_EXECUTION',
    'NO_PUBLIC_ROUTE_MUTATION',
    'NO_DEPLOYMENT',
    'NO_PUBLIC_VISUAL_IMPROVEMENT_CLAIM'
  ])
});

export const H_EARTH_RUN_8D_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8D_GROUNDED_VEGETATION_SCOPE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'RUN_8D_GROUNDED_VEGETATION_SCOPE_PACKAGE',
  displayName: 'H-Earth Run 8D Grounded Vegetation Scope Package',
  description:
    'Registers the exact Run 8D vegetation resolution, local archetype geometry and deterministic successor-terrain world-attachment paths for read-only automatic preflight.',
  repositoryPaths: [...H_EARTH_RUN_8D_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_IMPLEMENTATION_EVIDENCE',
  evidenceReferences: Object.freeze([H_EARTH_RUN_8D_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_RUN_8D_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_RUN_8D_EXECUTION_AUTHORIZATION',
    'RUN_8A_PASS_CLOSED',
    'RUN_8B_PASS_CLOSED',
    'RUN_8C_PASS_CLOSED',
    'RUN_7E_DETERMINISTIC_POPULATION_PLANNER',
    'RUN_7G_CANONICAL_SPATIAL_LIFECYCLE'
  ]),
  authorityScope: Object.freeze([
    'EXACT_RUN_8D_REPOSITORY_PATH_RESOLUTION',
    'RUN_8D_CHECKPOINT_PACKAGE_MEMBERSHIP',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_SCOPE'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_CREATE_POPULATION_OR_LIFECYCLE_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_ADMISSION_OR_TRANSFER_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_RENDERER_CAMERA_ROUTE_DEPLOYMENT_OR_PUBLIC_VISUAL_AUTHORITY'
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
  allowedMutationScope: 'READ_ONLY_PREFLIGHT_PATH_REGISTRATION_ONLY',
  prohibitedMutations: Object.freeze([
    'RUN_8A_REOPENING',
    'RUN_8B_GEOMETRY_MUTATION',
    'RUN_8C_LIGHT_MATERIAL_MUTATION',
    'RUN_6_TERRAIN_FIELD_IN_PLACE_MUTATION',
    'LEGACY_PROXY_RECLASSIFICATION',
    'POPULATION_PLANNER_OR_SPATIAL_LIFECYCLE_MUTATION',
    'WEST_ADMISSION',
    'PACKET_002_TRANSFER',
    'RENDERER_CAMERA_OR_PUBLIC_ROUTE_MUTATION'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_RUN_8D_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'RUN_8D_EXECUTED_GROUNDED_VEGETATION_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_RUN_8D_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_RUN_8A_RUN_8B_OR_RUN_8C_IS_REOPENED',
    'STOP_IF_POPULATION_OR_LIFECYCLE_AUTHORITY_IS_MUTATED',
    'STOP_IF_ADMISSION_RENDERER_ROUTE_OR_DEPLOYMENT_OCCURS_IN_RUN_8D'
  ]),
  currentIdentityReferences: Object.freeze([
    'H_EARTH_GROUNDED_VEGETATION_GEOMETRY_AND_WORLD_ATTACHMENT_RUN_8D_v1',
    'H_EARTH_GROUNDED_VEGETATION_ARCHETYPE_AND_INSTANCE_RESOLUTION_RUN_8D_v1',
    'H_EARTH_GROUNDED_VEGETATION_NEUTRAL_GEOMETRY_AND_WORLD_ATTACHMENT_RUN_8D_v1',
    '7272cd8609674d2e30a74a32d6a98cee1680f496'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_RUN_8D_SCOPE_PATHS.map((path) => [path, {
  node: H_EARTH_RUN_8D_SCOPE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === path)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8D_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8D_SCOPE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8D_SCOPE_NODE.nodeId
    ? H_EARTH_RUN_8D_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8D_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8D_SCOPE_EVIDENCE
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
      nodeId: H_EARTH_RUN_8D_SCOPE_NODE.nodeId,
      node: H_EARTH_RUN_8D_SCOPE_NODE,
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
  const node = H_EARTH_RUN_8D_SCOPE_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode =
  (id, direction = 'BOTH') =>
    id === H_EARTH_RUN_8D_SCOPE_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8D_SCOPE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8D_SCOPE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8D_RECONCILED_FACADE = freeze({
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

export default H_EARTH_RUN_8D_RECONCILED_FACADE;
