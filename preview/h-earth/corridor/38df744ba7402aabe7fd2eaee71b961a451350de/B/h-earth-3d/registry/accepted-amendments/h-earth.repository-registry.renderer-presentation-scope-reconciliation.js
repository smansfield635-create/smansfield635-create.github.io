/**
 * H_EARTH_REPOSITORY_REGISTRY_RENDERER_PRESENTATION_SCOPE_RECONCILIATION_v1
 *
 * Bounded read-only path-registration overlay for the active H-Earth renderer
 * and this accepted-amendment occurrence.
 *
 * This overlay creates no renderer-source mutation authority, geometry change,
 * camera change, capacity change, deployment authority, merge authority, visual
 * acceptance, or production claim.
 */

import baseFacade from './h-earth.repository-registry.camera-audit-continuity-scope-reconciliation.js';

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
  'agent/h-earth-renderer-registry-scope-reconciliation-001';

export const H_EARTH_RENDERER_PRESENTATION_SCOPE_PATHS =
  Object.freeze([
    '/showroom/globe/h-earth/renderer.js',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.renderer-presentation-scope-reconciliation.js'
  ]);

const OCCURRENCES =
  Object.freeze(
    H_EARTH_RENDERER_PRESENTATION_SCOPE_PATHS.map(
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
            repositoryPath ===
              '/showroom/globe/h-earth/renderer.js'
              ? '3ff5ea1542b015fe0816dbbf6d42509f3b86b300'
              : null,
          contentSha256:
            null,
          byteCount:
            null,
          existenceStatus:
            'PRESENT',
          fetchbackStatus:
            repositoryPath ===
              '/showroom/globe/h-earth/renderer.js'
              ? 'VERIFIED_ON_MAIN'
              : 'NOT_PERFORMED',
          occurrenceClass:
            'CANDIDATE'
        })
    )
  );

export const H_EARTH_RENDERER_PRESENTATION_SCOPE_EVIDENCE =
  deepFreeze({
    evidenceId:
      'EVIDENCE_H_EARTH_RENDERER_PRESENTATION_SCOPE_v1',
    evidenceClass:
      'EXISTING_BOUNDARY_RELATION_OBSERVED',
    sourceKind:
      'EXECUTED_REPOSITORY_AND_BROWSER_AUDIT',
    sourceIdOrPath:
      '/showroom/globe/h-earth/renderer.js',
    sourceOccurrenceOrRevision:
      'CURRENT_MAIN=c4e4a89f449532118eb712cf0a5193cc6e53c5d4;RENDERER_GIT_BLOB=3ff5ea1542b015fe0816dbbf6d42509f3b86b300;PR155_RENDERER_CORRIDOR_ARTIFACT=8623093334;FIVE_PROFILE_CONSTRUCTION_AND_MOUNT_PASS=TRUE;USER_SUPPLIED_DEPLOYED_BROWSER_SCREENSHOT=2026-07-25',
    assertionScope: Object.freeze([
      'ACTIVE_RENDERER_PATH_RESOLUTION',
      'RENDERER_SOURCE_CUSTODY',
      'GOVERNED_NINETEEN_MODULE_BROWSER_GRAPH_MEMBERSHIP',
      'EXECUTED_RENDERER_CONSTRUCTION_AND_MOUNT',
      'READ_ONLY_PRESENTATION_PREFLIGHT_SCOPE'
    ]),
    verifiedOn:
      '2026-07-25',
    evidenceLimitations: Object.freeze([
      'NO_RENDERER_SOURCE_MUTATION_AUTHORITY_CREATED',
      'NO_GEOMETRY_OR_CAMERA_AUTHORITY_CREATED',
      'NO_CAPACITY_OR_COMPOSITOR_AUTHORITY_CREATED',
      'NO_MERGE_AUTHORITY',
      'NO_DEPLOYMENT_OR_PRODUCTION_AUTHORITY',
      'NO_VISUAL_ACCEPTANCE_INFERRED'
    ])
  });

export const H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE =
  deepFreeze({
    nodeId:
      'H_EARTH_RENDERER_PRESENTATION_SCOPE_PACKAGE',
    nodeType:
      'BOUNDARY_PACKET',
    nodeSubtype:
      'RENDERER_PRESENTATION_SCOPE_PACKAGE',
    displayName:
      'H-Earth Renderer Presentation Scope Package',
    description:
      'Registers the active H-Earth renderer and the bounded registry overlay required to run fail-closed preflight before presentation-only environment refinement.',
    repositoryPaths: [
      ...H_EARTH_RENDERER_PRESENTATION_SCOPE_PATHS
    ],
    repositoryOccurrences:
      OCCURRENCES,
    evidenceClass:
      'EXISTING_BOUNDARY_RELATION_OBSERVED',
    evidenceReferences: Object.freeze([
      H_EARTH_RENDERER_PRESENTATION_SCOPE_EVIDENCE.evidenceId
    ]),
    authorityClass:
      'AUDIT_ONLY',
    authorityPosture:
      'READ_ONLY_RENDERER_PRESENTATION_PATH_REGISTRATION',
    authoritySource: Object.freeze([
      'EXPLICIT_USER_AUTHORIZATION_2026_07_25',
      'CURRENT_MAIN_RENDERER_SOURCE_CUSTODY',
      'EXECUTED_PR155_RENDERER_CORRIDOR_EVIDENCE',
      'USER_SUPPLIED_DEPLOYED_BROWSER_SCREENSHOT'
    ]),
    authorityScope: Object.freeze([
      'EXACT_RENDERER_PATH_RESOLUTION',
      'ACTIVE_RUNTIME_GRAPH_MEMBERSHIP',
      'RENDERER_PRESENTATION_PREFLIGHT_SCOPE',
      'EXISTING_SHORELINE_MATERIAL_PRESENTATION_BOUNDARY'
    ]),
    authorityLimitations: Object.freeze([
      'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_RENDERER_MUTATION',
      'NO_GEOMETRY_CHANGE',
      'NO_CAMERA_CHANGE',
      'NO_PROJECTION_CHANGE',
      'NO_CAPACITY_CHANGE',
      'NO_COMPOSITOR_CHANGE',
      'NO_DOM_COUNT_CHANGE',
      'NO_MERGE_AUTHORITY',
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
      'RENDERER_SOURCE_MUTATION_WITHOUT_SEPARATE_AUTHORIZATION',
      'GEOMETRY_MUTATION',
      'CAMERA_MUTATION',
      'PROJECTION_MUTATION',
      'CAPACITY_MUTATION',
      'COMPOSITOR_MUTATION',
      'DOM_COUNT_AUTHORITY_CHANGE',
      'MERGE_WITHOUT_SEPARATE_AUTHORIZATION',
      'DEPLOYMENT',
      'PRODUCTION_ACTIVATION'
    ]),
    requiredValidations: Object.freeze([
      'EXACT_RENDERER_PATH_RESOLUTION',
      'RENDERER_SOURCE_CUSTODY',
      'ACTIVE_RUNTIME_GRAPH_MEMBERSHIP',
      'AUTOMATIC_REPOSITORY_PREFLIGHT'
    ]),
    stoppingBoundaries: Object.freeze([
      'STOP_IF_RENDERER_PATH_REMAINS_UNRESOLVED',
      'STOP_BEFORE_RENDERER_MUTATION_WITHOUT_SEPARATE_AUTHORIZATION',
      'STOP_BEFORE_MERGE_WITHOUT_SEPARATE_AUTHORIZATION'
    ]),
    currentIdentityReferences: Object.freeze([
      'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_9_ADMITTED_GEOMETRY_FRAME_MATERIALIZATION_v1',
      'c4e4a89f449532118eb712cf0a5193cc6e53c5d4',
      '3ff5ea1542b015fe0816dbbf6d42509f3b86b300',
      'PR155_RENDERER_CORRIDOR_ARTIFACT_8623093334',
      'GOVERNED_BROWSER_MODULE_COUNT_19'
    ]),
    lifecycleStatus:
      'CANDIDATE',
    unresolvedFields: Object.freeze([])
  });

const pathIndex =
  new Map(
    H_EARTH_RENDERER_PRESENTATION_SCOPE_PATHS.map(
      (repositoryPath) => [
        repositoryPath,
        {
          node:
            H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE,
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
      H_EARTH_RENDERER_PRESENTATION_SCOPE_EVIDENCE
    ],
    nodes: [
      ...baseInstance.nodes,
      H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE
    ]
  });

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(
  nodeId
) {
  return nodeId ===
    H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE.nodeId
    ? H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(
        nodeId
      );
}

export function getHEarthRepositoryRegistryEvidence(
  evidenceId
) {
  return evidenceId ===
    H_EARTH_RENDERER_PRESENTATION_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_RENDERER_PRESENTATION_SCOPE_EVIDENCE
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
            H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE.nodeId,
          node:
            H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE,
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
    H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE;

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
    H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE.nodeId
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
      H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE.nodeId
  ) {
    return deepFreeze({
      nodeId,
      nodes: [
        H_EARTH_RENDERER_PRESENTATION_SCOPE_NODE
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

export const H_EARTH_RENDERER_PRESENTATION_RECONCILED_FACADE =
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
  H_EARTH_RENDERER_PRESENTATION_RECONCILED_FACADE;
