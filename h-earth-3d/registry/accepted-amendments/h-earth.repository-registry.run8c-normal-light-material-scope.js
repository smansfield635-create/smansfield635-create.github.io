/** Read-only Run 8C path-registration overlay. */
import baseFacade from './h-earth.repository-registry.run8b-successor-neutral-geometry-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8c-normal-light-material-001';

export const H_EARTH_RUN_8C_SCOPE_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8c-normal-light-material-validation.yml',
  '/h-earth-3d/control-plane/run-8/h-earth.run8c.normal-light-material.js',
  '/h-earth-3d/environment/h-earth.successor-surface-material.run8c.js',
  '/showroom/globe/h-earth/render/lighting-material-successor-terrain.run8c.js',
  '/h-earth-3d/validation/h-earth.run8c.normal-light-material.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8c.normal-light-material.receipt.json'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8C_SCOPE_PATHS.map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_RUN_8C_WORKSPACE',
    occurrenceClass: 'CANDIDATE'
  }))
);

export const H_EARTH_RUN_8C_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_SCOPE_v1',
  evidenceClass: 'EXECUTED_IMPLEMENTATION_EVIDENCE',
  sourceKind: 'REPOSITORY_WORKSPACE_NORMAL_LIGHT_MATERIAL_EXECUTION',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.run8c.normal-light-material.receipt.json',
  sourceOccurrenceOrRevision: 'RUN_8C_WORKSPACE_PENDING_FINAL_EXECUTION',
  assertionScope: Object.freeze([
    'RUN_7B_INTRINSIC_MATERIAL_PROFILE_PRESERVATION',
    'RUN_8B_SUCCESSOR_GEOMETRY_IMMUTABLE_CONSUMPTION',
    'WORLD_NORMAL_DIFFUSE_LIGHT',
    'AMBIENT_SLOPE_AND_CURVATURE_RESPONSE',
    'WETNESS_ROUGHNESS_AND_REFLECTANCE_RESPONSE',
    'DISTANCE_HAZE_AND_DESATURATION',
    'VISIBLE_SUN_DISC_PRESENTATION_RECORD',
    'DAY_NIGHT_DIFFERENTIATION',
    'DETERMINISTIC_REPEAT_EXECUTION'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'NO_WEST_ADMISSION',
    'NO_PACKET_002_TRANSFER',
    'NO_RENDERER_LOOP_MUTATION',
    'NO_VEGETATION_INSTANCE_CONSTRUCTION',
    'NO_PUBLIC_ROUTE_MUTATION',
    'NO_DEPLOYMENT',
    'NO_PUBLIC_VISUAL_IMPROVEMENT_CLAIM'
  ])
});

export const H_EARTH_RUN_8C_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_SCOPE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'RUN_8C_NORMAL_LIGHT_MATERIAL_SCOPE_PACKAGE',
  displayName: 'H-Earth Run 8C Normal Light Material Scope Package',
  description:
    'Registers the exact Run 8C successor material and normal-driven light realization paths for read-only automatic preflight.',
  repositoryPaths: [...H_EARTH_RUN_8C_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_IMPLEMENTATION_EVIDENCE',
  evidenceReferences: Object.freeze([H_EARTH_RUN_8C_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_RUN_8C_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_RUN_8C_EXECUTION_AUTHORIZATION',
    'RUN_8A_PASS_CLOSED',
    'RUN_8B_PASS_CLOSED',
    'RUN_7B_INTRINSIC_SURFACE_STATE',
    'RUN_7C_ATMOSPHERE_STATE_AND_PRESENTATION'
  ]),
  authorityScope: Object.freeze([
    'EXACT_RUN_8C_REPOSITORY_PATH_RESOLUTION',
    'RUN_8C_CHECKPOINT_PACKAGE_MEMBERSHIP',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_SCOPE'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_CREATE_NATIVE_SURFACE_OR_ATMOSPHERE_TRUTH',
    'PATH_REGISTRATION_DOES_NOT_CREATE_ADMISSION_OR_TRANSFER_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_RENDERER_ROUTE_DEPLOYMENT_OR_PUBLIC_VISUAL_AUTHORITY'
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
    'RUN_6_TERRAIN_FIELD_IN_PLACE_MUTATION',
    'LEGACY_PROXY_RECLASSIFICATION',
    'WEST_ADMISSION',
    'PACKET_002_TRANSFER',
    'RENDERER_LOOP_OR_PUBLIC_ROUTE_MUTATION'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_RUN_8C_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'RUN_8C_EXECUTED_NORMAL_LIGHT_MATERIAL_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_RUN_8C_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_RUN_8A_OR_RUN_8B_IS_REOPENED',
    'STOP_IF_SOURCE_NEUTRAL_GEOMETRY_IS_MUTATED',
    'STOP_IF_ADMISSION_ROUTE_OR_DEPLOYMENT_OCCURS_IN_RUN_8C'
  ]),
  currentIdentityReferences: Object.freeze([
    'H_EARTH_NORMAL_DRIVEN_LIGHT_AND_MATERIAL_REALIZATION_RUN_8C_v1',
    'H_EARTH_SUCCESSOR_SURFACE_MATERIAL_PROJECTION_RUN_8C_v1',
    'H_EARTH_SUCCESSOR_TERRAIN_NORMAL_LIGHT_MATERIAL_REALIZATION_RUN_8C_v1',
    'f3375d629633bbdadcbebcd91f2dc19796e366e1'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_RUN_8C_SCOPE_PATHS.map((path) => [path, {
  node: H_EARTH_RUN_8C_SCOPE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === path)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8C_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8C_SCOPE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8C_SCOPE_NODE.nodeId
    ? H_EARTH_RUN_8C_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8C_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8C_SCOPE_EVIDENCE
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
      nodeId: H_EARTH_RUN_8C_SCOPE_NODE.nodeId,
      node: H_EARTH_RUN_8C_SCOPE_NODE,
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
  const node = H_EARTH_RUN_8C_SCOPE_NODE;
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
    id === H_EARTH_RUN_8C_SCOPE_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8C_SCOPE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8C_SCOPE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8C_RECONCILED_FACADE = freeze({
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

export default H_EARTH_RUN_8C_RECONCILED_FACADE;
