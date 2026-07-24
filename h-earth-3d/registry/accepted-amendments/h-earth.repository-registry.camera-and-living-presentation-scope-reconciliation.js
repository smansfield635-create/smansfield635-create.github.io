/**
 * H_EARTH_REPOSITORY_REGISTRY_CAMERA_AND_LIVING_PRESENTATION_SCOPE_RECONCILIATION_v1
 *
 * Bounded read-only path-resolution overlay for the H-Earth camera-envelope
 * correction and living-presentation capacity standard.
 *
 * This overlay creates no merge authority, animation runtime, physical
 * simulation, geometry mutation, deployment authority, or production claim.
 */

import baseFacade from './h-earth.repository-registry.post-merge-disposition-scope-reconciliation.js';

function deepFreeze(
  value,
  seen = new WeakSet()
) {
  if (
    value === null ||
    typeof value !== 'object' ||
    seen.has(value)
  ) {
    return value;
  }

  seen.add(value);

  for (const nested of Object.values(value)) {
    deepFreeze(nested, seen);
  }

  return Object.isFrozen(value)
    ? value
    : Object.freeze(value);
}

const REPOSITORY =
  'smansfield635-create/smansfield635-create.github.io';

const BRANCH =
  'agent/h-earth-capacity-single-module-restoration-001';

export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_ACTIVE_SCOPE_PATHS =
  Object.freeze([
    '/showroom/globe/h-earth/capacity.js',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js'
  ]);

export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_RETIRED_SCOPE_PATHS =
  Object.freeze([
    '/showroom/globe/h-earth/capacity.base.js'
  ]);

export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_PATHS =
  Object.freeze([
    ...H_EARTH_CAMERA_AND_LIVING_PRESENTATION_ACTIVE_SCOPE_PATHS,
    ...H_EARTH_CAMERA_AND_LIVING_PRESENTATION_RETIRED_SCOPE_PATHS
  ]);

const ACTIVE_OCCURRENCES =
  H_EARTH_CAMERA_AND_LIVING_PRESENTATION_ACTIVE_SCOPE_PATHS.map(
    (repositoryPath) =>
      deepFreeze({
        repository:
          REPOSITORY,
        refType:
          'BRANCH',
        refName:
          BRANCH,
        commitSha:
          null,
        path:
          repositoryPath,
        gitBlobSha:
          null,
        contentSha256:
          null,
        byteCount:
          null,
        existenceStatus:
          'PRESENT',
        fetchbackStatus:
          'NOT_PERFORMED',
        occurrenceClass:
          'CANDIDATE'
      })
  );

const RETIRED_OCCURRENCES =
  H_EARTH_CAMERA_AND_LIVING_PRESENTATION_RETIRED_SCOPE_PATHS.map(
    (repositoryPath) =>
      deepFreeze({
        repository:
          REPOSITORY,
        refType:
          'BRANCH',
        refName:
          BRANCH,
        commitSha:
          null,
        path:
          repositoryPath,
        gitBlobSha:
          null,
        contentSha256:
          null,
        byteCount:
          null,
        existenceStatus:
          'ABSENT',
        fetchbackStatus:
          'NOT_PERFORMED',
        occurrenceClass:
          'RETIRED'
      })
  );

const OCCURRENCES =
  Object.freeze([
    ...ACTIVE_OCCURRENCES,
    ...RETIRED_OCCURRENCES
  ]);

export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_EVIDENCE =
  deepFreeze({
    evidenceId:
      'EVIDENCE_H_EARTH_CAMERA_ENVELOPE_AND_LIVING_PRESENTATION_SCOPE_v1',
    evidenceClass:
      'EXISTING_BOUNDARY_RELATION_OBSERVED',
    sourceKind:
      'EXECUTED_REPOSITORY_AUDIT',
    sourceIdOrPath:
      '/showroom/globe/h-earth/capacity.js',
    sourceOccurrenceOrRevision:
      'SINGLE_MODULE_BUILD_RUN=30130634686;AUDIT_ARTIFACT=8610935978;CHECKS=18_OF_18;SHA256=7b70fcb379fa37d97b07b2d337884c655cfa9657b12db8a7d9d6459291aafb96',
    assertionScope: Object.freeze([
      'EXACT_CANONICAL_CAPACITY_PATH_RESOLUTION',
      'AUXILIARY_CAPACITY_PATH_ABSENCE',
      'RETIRED_AUXILIARY_PATH_RESOLUTION_WITH_ABSENT_OCCURRENCE',
      'NINETEEN_MODULE_BROWSER_GRAPH_PRESERVATION',
      'WATERWARD_CAMERA_CORRESPONDENCE',
      'READ_ONLY_PREFLIGHT_SCOPE'
    ]),
    verifiedOn:
      '2026-07-24',
    evidenceLimitations: Object.freeze([
      'NO_MERGE_AUTHORITY',
      'NO_ANIMATION_RUNTIME',
      'NO_PHYSICAL_SIMULATION',
      'NO_ADMITTED_GEOMETRY_MUTATION',
      'NO_DEPLOYMENT_OR_PRODUCTION_AUTHORITY'
    ])
  });

export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE =
  deepFreeze({
    nodeId:
      'H_EARTH_CAMERA_ENVELOPE_AND_LIVING_PRESENTATION_CAPACITY_PACKAGE',
    nodeType:
      'BOUNDARY_PACKET',
    nodeSubtype:
      'CAMERA_AND_PRESENTATION_CAPACITY_PACKAGE',
    displayName:
      'H-Earth Camera Envelope and Living Presentation Capacity Package',
    description:
      'Single canonical runtime capacity-module restoration, bounded waterward camera correspondence, and nonexecuting living-presentation capacity standard within the governed nineteen-module browser graph; the removed auxiliary path remains registered only as an absent retired repository-history occurrence.',
    repositoryPaths: [
      ...H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_PATHS
    ],
    repositoryOccurrences:
      OCCURRENCES,
    evidenceClass:
      'EXISTING_BOUNDARY_RELATION_OBSERVED',
    evidenceReferences: Object.freeze([
      H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_EVIDENCE.evidenceId
    ]),
    authorityClass:
      'AUDIT_ONLY',
    authorityPosture:
      'READ_ONLY_SCOPE_RECONCILIATION_FOR_CAMERA_AND_PRESENTATION_CAPACITY_PACKAGE',
    authoritySource: Object.freeze([
      'EXPLICIT_USER_INSTRUCTION',
      'EXECUTED_18_CHECK_SINGLE_MODULE_BUILD_AND_IMPORT_AUDIT'
    ]),
    authorityScope: Object.freeze([
      'EXACT_PATH_RESOLUTION',
      'SINGLE_CANONICAL_CAPACITY_MODULE',
      'RETIRED_PATH_HISTORY_RESOLUTION',
      'NINETEEN_MODULE_BROWSER_GRAPH_PRESERVATION',
      'CAMERA_CAPACITY_CORRESPONDENCE',
      'READ_ONLY_PREFLIGHT_SCOPE'
    ]),
    authorityLimitations: Object.freeze([
      'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_MERGE',
      'NO_ANIMATION_RUNTIME',
      'NO_PHYSICAL_SIMULATION',
      'NO_ADMITTED_GEOMETRY_MUTATION',
      'NO_DEPLOYMENT_OR_PRODUCTION_AUTHORITY'
    ]),
    parentRelations: Object.freeze([]),
    childRelations: Object.freeze([]),
    peerRelations: Object.freeze([]),
    upstreamBoundaries: Object.freeze([]),
    downstreamBoundaries: Object.freeze([]),
    cardinalRole:
      'NONE',
    cardinalStatus:
      'NONE',
    cardinalCompleteness:
      'NOT_APPLICABLE',
    orderingRules: Object.freeze([]),
    dependencyRelations: Object.freeze([]),
    allowedMutationScope:
      'READ_ONLY_PREFLIGHT_PATH_REGISTRATION_ONLY',
    prohibitedMutations: Object.freeze([
      'ADMITTED_GEOMETRY_MUTATION',
      'ANIMATION_RUNTIME_CREATION',
      'PHYSICAL_SIMULATION_CREATION',
      'MERGE_WITHOUT_SEPARATE_AUTHORIZATION',
      'DEPLOYMENT',
      'PRODUCTION_ACTIVATION'
    ]),
    requiredValidations: Object.freeze([
      'EXACT_PATH_RESOLUTION',
      'AUXILIARY_CAPACITY_PATH_ABSENCE',
      'RETIRED_AUXILIARY_PATH_RESOLVES_AS_ABSENT',
      'NINETEEN_MODULE_BROWSER_GRAPH_EXECUTION',
      'CAMERA_ENVELOPE_EXECUTION_AUDIT',
      'GEOMETRY_SOURCE_CUSTODY',
      'MINIMUM_SHORELINE_EXECUTION_AUDIT',
      'AUTOMATIC_REPOSITORY_PREFLIGHT'
    ]),
    stoppingBoundaries: Object.freeze([
      'STOP_BEFORE_MERGE_WITHOUT_SEPARATE_AUTHORIZATION',
      'STOP_BEFORE_ANIMATION_RUNTIME_IMPLEMENTATION',
      'STOP_BEFORE_PHYSICAL_SIMULATION'
    ]),
    currentIdentityReferences: Object.freeze([
      'H_EARTH_LANDWARD_GROUND_INSPECTION_CAMERA_ENVELOPE_v2_SINGLE_MODULE',
      'H_EARTH_MINIMUM_SHORELINE_LIVING_PRESENTATION_CAPACITY_v2_SINGLE_MODULE',
      '7b70fcb379fa37d97b07b2d337884c655cfa9657b12db8a7d9d6459291aafb96',
      'GOVERNED_BROWSER_MODULE_COUNT_19',
      'CAPACITY_BASE_PATH_RETIRED_ABSENT'
    ]),
    lifecycleStatus:
      'CANDIDATE',
    unresolvedFields: Object.freeze([])
  });

const pathIndex =
  new Map(
    H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_PATHS.map(
      (repositoryPath) => [
        repositoryPath,
        {
          node:
            H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE,
          occurrences:
            OCCURRENCES.filter(
              (entry) =>
                entry.path === repositoryPath
            )
        }
      ]
    )
  );

const baseInstance =
  baseFacade.getHEarthRepositoryRegistryInstance();

const combinedInstance =
  deepFreeze({
    ...baseInstance,
    evidenceRecords: [
      ...baseInstance.evidenceRecords,
      H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_EVIDENCE
    ],
    nodes: [
      ...baseInstance.nodes,
      H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE
    ]
  });

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(
  nodeId
) {
  return nodeId ===
    H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE.nodeId
    ? H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(
        nodeId
      );
}

export function getHEarthRepositoryRegistryEvidence(
  evidenceId
) {
  return evidenceId ===
    H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(
        evidenceId
      );
}

export function resolveHEarthRepositoryRegistryPath(
  repositoryPath
) {
  const indexed =
    pathIndex.get(
      repositoryPath
    );

  if (!indexed) {
    return baseFacade
      .resolveHEarthRepositoryRegistryPath(
        repositoryPath
      );
  }

  return deepFreeze({
    repositoryPath,
    resolved: true,
    nodes: [indexed.node],
    occurrences:
      indexed.occurrences,
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(
  input = {}
) {
  const localMatches =
    OCCURRENCES
      .filter((entry) => {
        if (
          input.path != null &&
          entry.path !== input.path
        ) {
          return false;
        }

        if (
          input.commitSha != null &&
          entry.commitSha !== input.commitSha
        ) {
          return false;
        }

        if (
          input.gitBlobSha != null &&
          entry.gitBlobSha !== input.gitBlobSha
        ) {
          return false;
        }

        if (
          input.refName != null &&
          entry.refName !== input.refName
        ) {
          return false;
        }

        return true;
      })
      .map((occurrence) =>
        deepFreeze({
          nodeId:
            H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE.nodeId,
          node:
            H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE,
          occurrence
        })
      );

  const base =
    baseFacade
      .resolveHEarthRepositoryRegistryOccurrence(
        input
      );

  return deepFreeze({
    query:
      base.query,
    matches: [
      ...base.matches,
      ...localMatches
    ],
    resolved:
      base.resolved ||
      localMatches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(
  criteria = {}
) {
  const base =
    baseFacade
      .findHEarthRepositoryRegistryNodes(
        criteria
      );

  const node =
    H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE;

  const matches =
    (
      criteria.repositoryPath == null ||
      node.repositoryPaths.includes(
        criteria.repositoryPath
      )
    ) &&
    (
      criteria.nodeType == null ||
      criteria.nodeType === node.nodeType
    ) &&
    (
      criteria.nodeSubtype == null ||
      criteria.nodeSubtype === node.nodeSubtype
    ) &&
    (
      criteria.authorityClass == null ||
      criteria.authorityClass === node.authorityClass
    ) &&
    (
      criteria.lifecycleStatus == null ||
      criteria.lifecycleStatus === node.lifecycleStatus
    );

  return deepFreeze(
    matches
      ? [...base, node]
      : base
  );
}

export function getHEarthRepositoryRegistryRelationsForNode(
  nodeId,
  direction = 'BOTH'
) {
  return nodeId ===
    H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE.nodeId
    ? Object.freeze([])
    : baseFacade
        .getHEarthRepositoryRegistryRelationsForNode(
          nodeId,
          direction
        );
}

export function getHEarthRepositoryRegistryDependencyClosure(
  nodeId
) {
  if (
    nodeId ===
      H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE.nodeId
  ) {
    return deepFreeze({
      nodeId,
      nodes: [
        H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_NODE
      ],
      relations: [],
      unresolved: false
    });
  }

  return baseFacade
    .getHEarthRepositoryRegistryDependencyClosure(
      nodeId
    );
}

export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_RECONCILED_FACADE =
  deepFreeze({
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

export default
  H_EARTH_CAMERA_AND_LIVING_PRESENTATION_RECONCILED_FACADE;
