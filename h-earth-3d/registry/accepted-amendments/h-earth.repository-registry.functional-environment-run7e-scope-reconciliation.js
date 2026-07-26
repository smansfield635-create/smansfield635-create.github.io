/**
 * H_EARTH_REPOSITORY_REGISTRY_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_RECONCILIATION_v1
 * Read-only path-registration overlay for the executed Run 7E biome field,
 * deterministic population planner, and small-instance proof checkpoint.
 * Creates no biome product, population geometry, spatial-lifecycle, renderer,
 * deployment, merge, or canonicalization authority.
 */
import baseFacade from './h-earth.repository-registry.functional-environment-run7d-scope-reconciliation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-functional-environment-run7e-001';

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_PATHS = Object.freeze([
  '/h-earth-3d/environment/h-earth.biome-field.js',
  '/h-earth-3d/environment/h-earth.population-planner.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.functional-environment-run7e-scope-reconciliation.js',
  '/h-earth-3d/validation/h-earth.functional-environment.run7e.harness.mjs',
  '/h-earth-3d/validation/h-earth.functional-environment.run7e.receipt.json'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_PATHS.map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_RUN_7E_WORKSPACE',
    occurrenceClass: 'CANDIDATE'
  }))
);

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'EXECUTED_REPOSITORY_WORKSPACE_AUDIT',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.functional-environment.run7e.receipt.json',
  sourceOccurrenceOrRevision:
    'PR_178;WORKFLOW_RUN_30206785413;RUN_7E_PASS;HEAD=c024fd1c0c636e832c0c92b222abcad05cabcf41',
  assertionScope: Object.freeze([
    'EXACT_RUN_7E_PATH_RESOLUTION',
    'BIOME_FIELD_CHECKPOINT_MEMBERSHIP',
    'DETERMINISTIC_POPULATION_PLANNER_CHECKPOINT_MEMBERSHIP',
    'SMALL_INSTANCE_PROOF_CHECKPOINT_MEMBERSHIP',
    'READ_ONLY_AUTOMATIC_PREFLIGHT_SCOPE'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'PATH_REGISTRATION_ONLY',
    'NO_NEW_PRODUCT_MUTATION_AUTHORITY',
    'NO_NATIVE_BIOME_REDEFINITION',
    'NO_SPATIAL_LIFECYCLE_AUTHORITY',
    'NO_POPULATION_GEOMETRY_AUTHORITY',
    'NO_RENDERER_MUTATION_AUTHORITY',
    'NO_CANONICALIZATION_AUTHORITY',
    'NO_DEPLOYMENT_OR_MERGE_AUTHORITY_CREATED'
  ])
});

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_PACKAGE',
  displayName: 'H-Earth Functional Environment Run 7E Scope Package',
  description:
    'Registers the exact executed Run 7E biome-field, deterministic population-planner, small-instance proof, harness, durable receipt, and registry-overlay paths for read-only automatic preflight without collapsing the underlying authority boundaries.',
  repositoryPaths: [...H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: Object.freeze([
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_EVIDENCE.evidenceId
  ]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_FUNCTIONAL_ENVIRONMENT_RUN_7E_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_RUN_7E_EXECUTION_AUTHORIZATION',
    'RUN_7E_WORKSPACE_EXECUTION_EVIDENCE',
    'H_EARTH_GOVERNED_SUCCESSOR_DEVELOPMENT_EXECUTION_AND_LIVE_PROMOTION_TEMPLATE_v1'
  ]),
  authorityScope: Object.freeze([
    'EXACT_RUN_7E_REPOSITORY_PATH_RESOLUTION',
    'RUN_7E_CHECKPOINT_PACKAGE_MEMBERSHIP',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_SCOPE'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_REDEFINE_TERRAIN_SURFACE_WATER_ATMOSPHERE_BIOME_POPULATION_TRAVERSAL_AUDIO_OR_SPATIAL_LIFECYCLE_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_ESTABLISH_RUN_7G_SPATIAL_LIFECYCLE_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_POPULATION_GEOMETRY_OR_RENDERER_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_ACTIVATE_PRODUCTION',
    'PATH_REGISTRATION_DOES_NOT_CREATE_MERGE_OR_DEPLOYMENT_AUTHORITY'
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
    'NATIVE_BIOME_AUTHORITY_REDEFINITION',
    'TERRAIN_SURFACE_WATER_OR_ATMOSPHERE_AUTHORITY_REDEFINITION',
    'SPATIAL_LIFECYCLE_AUTHORITY_ESTABLISHMENT',
    'POPULATION_GEOMETRY_OR_RENDERER_AUTHORITY_CREATION',
    'TRAVERSAL_OR_AUDIO_AUTHORITY_REDEFINITION',
    'PRODUCTION_ACTIVATION_BY_REGISTRY_OVERLAY'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_RUN_7E_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'RUN_7E_WORKSPACE_WORKFLOW_PASS',
    'PR_DELTA_REVIEW_BEFORE_MERGE'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_RUN_7E_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_RUN_7E_WORKFLOW_REGRESSES',
    'STOP_IF_SPATIAL_LIFECYCLE_AUTHORITY_IS_IMPLICITLY_ESTABLISHED',
    'STOP_IF_PR_HEAD_MOVES_AFTER_FINAL_VERIFICATION'
  ]),
  currentIdentityReferences: Object.freeze([
    'H_EARTH_CANONICAL_BIOME_FIELD_RUN_7E_v1',
    'H_EARTH_DETERMINISTIC_POPULATION_PLANNER_RUN_7E_v1',
    'PR_178',
    'WORKFLOW_RUN_30206785413',
    'c024fd1c0c636e832c0c92b222abcad05cabcf41'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_PATHS.map((path) => [
    path,
    {
      node: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === path)
    }
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE
  ]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE.nodeId
    ? H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_EVIDENCE
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
      nodeId: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE.nodeId,
      node: H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE,
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
  const node = H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE;
  const match =
    (criteria.repositoryPath == null ||
      node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null ||
      criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null ||
      criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode =
  (id, direction = 'BOTH') =>
    id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE.nodeId
    ? freeze({
        nodeId: id,
        nodes: [H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_SCOPE_NODE],
        relations: [],
        unresolved: false
      })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_RECONCILED_FACADE = freeze({
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

export default H_EARTH_FUNCTIONAL_ENVIRONMENT_RUN_7E_RECONCILED_FACADE;
