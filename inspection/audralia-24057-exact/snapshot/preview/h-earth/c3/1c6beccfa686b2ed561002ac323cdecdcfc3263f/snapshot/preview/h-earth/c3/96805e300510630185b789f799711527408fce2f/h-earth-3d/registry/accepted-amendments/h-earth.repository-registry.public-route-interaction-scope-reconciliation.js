/**
 * H_EARTH_REPOSITORY_REGISTRY_PUBLIC_ROUTE_INTERACTION_SCOPE_RECONCILIATION_v1
 *
 * Bounded read-only path-registration overlay for the active H-Earth public
 * route orchestration file and this accepted-amendment occurrence.
 *
 * This overlay creates no route-source mutation authority, camera ownership,
 * geometry change, renderer change, deployment authority, merge authority,
 * visual acceptance, or production claim.
 */

import baseFacade from './h-earth.repository-registry.renderer-presentation-scope-reconciliation.js';

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
  'agent/h-earth-public-route-registry-scope-reconciliation-001';

export const H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_PATHS =
  Object.freeze([
    '/showroom/globe/h-earth/index.js',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.public-route-interaction-scope-reconciliation.js'
  ]);

const OCCURRENCES =
  Object.freeze(
    H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_PATHS.map(
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
              '/showroom/globe/h-earth/index.js'
              ? 'a74364ad75dca8b8fab069026d181b5e64bdd007'
              : null,
          contentSha256:
            null,
          byteCount:
            null,
          existenceStatus:
            'PRESENT',
          fetchbackStatus:
            repositoryPath ===
              '/showroom/globe/h-earth/index.js'
              ? 'VERIFIED_ON_MAIN'
              : 'NOT_PERFORMED',
          occurrenceClass:
            'CANDIDATE'
        })
    )
  );

export const H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_EVIDENCE =
  deepFreeze({
    evidenceId:
      'EVIDENCE_H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_v1',
    evidenceClass:
      'EXISTING_BOUNDARY_RELATION_OBSERVED',
    sourceKind:
      'EXECUTED_REPOSITORY_AND_DEPLOYED_BROWSER_AUDIT',
    sourceIdOrPath:
      '/showroom/globe/h-earth/index.js',
    sourceOccurrenceOrRevision:
      'CURRENT_MAIN=691346d3f0dbe8e16f46c705a78d26f63c733d1b;INDEX_GIT_BLOB=a74364ad75dca8b8fab069026d181b5e64bdd007;PUBLIC_ROUTE_STATUS=PUBLIC_STAGE_RENDERER_MOUNTED;LANDWARD_ENTRY_LIVE_PROBE_ARTIFACT=8624145551',
    assertionScope: Object.freeze([
      'ACTIVE_PUBLIC_ROUTE_PATH_RESOLUTION',
      'PUBLIC_ROUTE_SOURCE_CUSTODY',
      'GOVERNED_NINETEEN_MODULE_BROWSER_GRAPH_MEMBERSHIP',
      'EXECUTED_PUBLIC_ROUTE_RENDERER_MOUNT',
      'READ_ONLY_INTERACTION_PREFLIGHT_SCOPE'
    ]),
    verifiedOn:
      '2026-07-25',
    evidenceLimitations: Object.freeze([
      'NO_ROUTE_SOURCE_MUTATION_AUTHORITY_CREATED',
      'NO_CAMERA_STATE_OWNERSHIP_CREATED',
      'NO_GEOMETRY_OR_RENDERER_AUTHORITY_CREATED',
      'NO_MERGE_AUTHORITY',
      'NO_DEPLOYMENT_OR_PRODUCTION_AUTHORITY',
      'NO_VISUAL_ACCEPTANCE_INFERRED'
    ])
  });

export const H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE =
  deepFreeze({
    nodeId:
      'H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_PACKAGE',
    nodeType:
      'BOUNDARY_PACKET',
    nodeSubtype:
      'PUBLIC_ROUTE_INTERACTION_SCOPE_PACKAGE',
    displayName:
      'H-Earth Public Route Interaction Scope Package',
    description:
      'Registers the active H-Earth public route orchestration file and the bounded registry overlay required to run fail-closed preflight before adding touch-camera input orchestration.',
    repositoryPaths: [
      ...H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_PATHS
    ],
    repositoryOccurrences:
      OCCURRENCES,
    evidenceClass:
      'EXISTING_BOUNDARY_RELATION_OBSERVED',
    evidenceReferences: Object.freeze([
      H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_EVIDENCE.evidenceId
    ]),
    authorityClass:
      'AUDIT_ONLY',
    authorityPosture:
      'READ_ONLY_PUBLIC_ROUTE_INTERACTION_PATH_REGISTRATION',
    authoritySource: Object.freeze([
      'EXPLICIT_USER_IMPLEMENTATION_AND_MAIN_PROMOTION_AUTHORIZATION_2026_07_25',
      'CURRENT_MAIN_PUBLIC_ROUTE_SOURCE_CUSTODY',
      'EXECUTED_LANDWARD_ENTRY_DEPLOYMENT_PROBE',
      'PUBLIC_STAGE_RENDERER_MOUNTED_EVIDENCE'
    ]),
    authorityScope: Object.freeze([
      'EXACT_PUBLIC_ROUTE_PATH_RESOLUTION',
      'ACTIVE_RUNTIME_GRAPH_MEMBERSHIP',
      'PUBLIC_ROUTE_INTERACTION_PREFLIGHT_SCOPE',
      'EXISTING_COMPOSITOR_INTENT_AND_RENDERER_HANDOFF_BOUNDARY'
    ]),
    authorityLimitations: Object.freeze([
      'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_ROUTE_MUTATION',
      'NO_CAMERA_STATE_OWNERSHIP',
      'NO_GEOMETRY_CHANGE',
      'NO_PROJECTION_CHANGE',
      'NO_CAPACITY_CHANGE',
      'NO_RENDERER_IMPLEMENTATION_CHANGE',
      'NO_DOM_COUNT_AUTHORITY_CHANGE',
      'NO_TRAVERSAL_AUTHORITY',
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
      'PUBLIC_ROUTE_SOURCE_MUTATION_WITHOUT_SEPARATE_AUTHORIZATION',
      'CAMERA_STATE_OWNERSHIP_CHANGE',
      'GEOMETRY_MUTATION',
      'PROJECTION_MUTATION',
      'CAPACITY_MUTATION',
      'RENDERER_MUTATION',
      'DOM_COUNT_AUTHORITY_CHANGE',
      'TRAVERSAL_CREATION',
      'MERGE_WITHOUT_SEPARATE_AUTHORIZATION',
      'DEPLOYMENT',
      'PRODUCTION_ACTIVATION'
    ]),
    requiredValidations: Object.freeze([
      'EXACT_PUBLIC_ROUTE_PATH_RESOLUTION',
      'PUBLIC_ROUTE_SOURCE_CUSTODY',
      'ACTIVE_RUNTIME_GRAPH_MEMBERSHIP',
      'AUTOMATIC_REPOSITORY_PREFLIGHT'
    ]),
    stoppingBoundaries: Object.freeze([
      'STOP_IF_PUBLIC_ROUTE_PATH_REMAINS_UNRESOLVED',
      'STOP_BEFORE_ROUTE_MUTATION_WITHOUT_SEPARATE_AUTHORIZATION',
      'STOP_BEFORE_MERGE_WITHOUT_SEPARATE_AUTHORIZATION'
    ]),
    currentIdentityReferences: Object.freeze([
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034Q_BRANCH_SPECIFIC_DEPLOYED_MODULE_RESPONSE_DIAGNOSTICS_v1',
      '691346d3f0dbe8e16f46c705a78d26f63c733d1b',
      'a74364ad75dca8b8fab069026d181b5e64bdd007',
      'LANDWARD_ENTRY_LIVE_PROBE_ARTIFACT_8624145551',
      'GOVERNED_BROWSER_MODULE_COUNT_19'
    ]),
    lifecycleStatus:
      'CANDIDATE',
    unresolvedFields: Object.freeze([])
  });

const pathIndex =
  new Map(
    H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_PATHS.map(
      (repositoryPath) => [
        repositoryPath,
        {
          node:
            H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE,
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
      H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_EVIDENCE
    ],
    nodes: [
      ...baseInstance.nodes,
      H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE
    ]
  });

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(
  nodeId
) {
  return nodeId ===
    H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE.nodeId
    ? H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(
        nodeId
      );
}

export function getHEarthRepositoryRegistryEvidence(
  evidenceId
) {
  return evidenceId ===
    H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_EVIDENCE
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
            H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE.nodeId,
          node:
            H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE,
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
    H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE;

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
    H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE.nodeId
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
      H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE.nodeId
  ) {
    return deepFreeze({
      nodeId,
      nodes: [
        H_EARTH_PUBLIC_ROUTE_INTERACTION_SCOPE_NODE
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

export const H_EARTH_PUBLIC_ROUTE_INTERACTION_RECONCILED_FACADE =
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
  H_EARTH_PUBLIC_ROUTE_INTERACTION_RECONCILED_FACADE;
