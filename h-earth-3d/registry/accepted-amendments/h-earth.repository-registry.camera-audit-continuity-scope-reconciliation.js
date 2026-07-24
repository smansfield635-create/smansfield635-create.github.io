/**
 * H_EARTH_REPOSITORY_REGISTRY_CAMERA_AUDIT_CONTINUITY_SCOPE_RECONCILIATION_v1
 *
 * Read-only path registration for the preserved retained-state audit
 * implementation and its bounded continuity-renewal wrapper.
 */

import baseFacade from './h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js';

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
  'agent/h-earth-camera-envelope-animation-standard-001';

export const H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_PATHS =
  Object.freeze([
    '/tools/h-earth-post-merge-scope-disposition-audit.base.mjs',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-audit-continuity-scope-reconciliation.js'
  ]);

const OCCURRENCES =
  Object.freeze(
    H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_PATHS.map(
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
    )
  );

export const H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_EVIDENCE =
  deepFreeze({
    evidenceId:
      'EVIDENCE_H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_v1',
    evidenceClass:
      'EXISTING_BOUNDARY_RELATION_OBSERVED',
    sourceKind:
      'EXECUTED_REPOSITORY_AUDIT',
    sourceIdOrPath:
      '/tools/h-earth-post-merge-scope-disposition-audit.mjs',
    sourceOccurrenceOrRevision:
      'PR117_NORMAL_AUDIT_RUN=30128314266;ONLY_OBSOLETE_LOADER_IMMUTABILITY_CHECKS_FAILED',
    assertionScope: Object.freeze([
      'PRESERVED_AUDIT_IMPLEMENTATION_PATH_RESOLUTION',
      'BOUNDED_LOADER_CONTINUITY_RENEWAL_PATH_RESOLUTION',
      'READ_ONLY_PREFLIGHT_SCOPE'
    ]),
    verifiedOn:
      '2026-07-24',
    evidenceLimitations: Object.freeze([
      'NO_MERGE_AUTHORITY',
      'NO_REGISTRY_CANONICALIZATION',
      'NO_SUCCESSOR_ACTIVATION',
      'NO_ANIMATION_RUNTIME',
      'NO_DEPLOYMENT_OR_PRODUCTION_AUTHORITY'
    ])
  });

export const H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE =
  deepFreeze({
    nodeId:
      'H_EARTH_CAMERA_AUDIT_CONTINUITY_RENEWAL_PACKAGE',
    nodeType:
      'BOUNDARY_PACKET',
    nodeSubtype:
      'AUDIT_CONTINUITY_RENEWAL_PACKAGE',
    displayName:
      'H-Earth Camera Audit Continuity Renewal Package',
    description:
      'Preserves the original 31-check retained-state audit and permits only a bounded accepted-amendment loader-chain extension.',
    repositoryPaths: [
      ...H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_PATHS
    ],
    repositoryOccurrences:
      OCCURRENCES,
    evidenceClass:
      'EXISTING_BOUNDARY_RELATION_OBSERVED',
    evidenceReferences: Object.freeze([
      H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_EVIDENCE.evidenceId
    ]),
    authorityClass:
      'AUDIT_ONLY',
    authorityPosture:
      'RETAINED_STATE_AUDIT_CONTINUITY_RENEWAL_ONLY',
    authoritySource: Object.freeze([
      'EXPLICIT_USER_INSTRUCTION',
      'EXECUTED_PR117_AUDIT_DIAGNOSTIC'
    ]),
    authorityScope: Object.freeze([
      'READ_ONLY_PATH_RESOLUTION',
      'PRESERVE_ORIGINAL_AUDIT_IMPLEMENTATION',
      'RENEW_OBSOLETE_LOADER_BLOB_EQUALITY_ASSERTION'
    ]),
    authorityLimitations: Object.freeze([
      'LOADER_MAY_CHANGE_ONLY_THROUGH_BOUNDED_ACCEPTED_AMENDMENT_CHAIN',
      'BASE_REGISTRY_CANDIDATE_MUST_REMAIN_UNCHANGED',
      'BOOTSTRAP_MUST_REMAIN_UNCHANGED',
      'NO_MERGE_AUTHORITY',
      'NO_TRANSITION_EXECUTION'
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
      'AUDIT_CONTINUITY_RENEWAL_ONLY',
    prohibitedMutations: Object.freeze([
      'BASE_REGISTRY_CANDIDATE_CHANGE',
      'BOOTSTRAP_REPLACEMENT',
      'SUCCESSOR_ACTIVATION',
      'TRANSITION_EXECUTION',
      'MERGE_WITHOUT_SEPARATE_AUTHORIZATION'
    ]),
    requiredValidations: Object.freeze([
      'ORIGINAL_31_CHECK_AUDIT_EXECUTION',
      'ONLY_AUTHORIZED_LOADER_RENEWAL_DIFFERENCE',
      'AUTOMATIC_REPOSITORY_PREFLIGHT',
      'BASE_REGISTRY_AND_BOOTSTRAP_UNCHANGED'
    ]),
    stoppingBoundaries: Object.freeze([
      'STOP_ON_ANY_NONLOADER_RETAINED_STATE_DRIFT',
      'STOP_ON_UNBOUNDED_LOADER_CHAIN',
      'STOP_BEFORE_MERGE_WITHOUT_SEPARATE_AUTHORIZATION'
    ]),
    currentIdentityReferences: Object.freeze([
      'H_EARTH_RETAINED_STATE_LOADER_CONTINUITY_RENEWAL_v1',
      'd04280a3f2f38ed59260b3092c3b83f14d311e2b',
      '2a4db8c4c03b0bf6ce0da2b074acb2cd4a17e0d9'
    ]),
    lifecycleStatus:
      'CANDIDATE',
    unresolvedFields: Object.freeze([])
  });

const pathIndex =
  new Map(
    H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_PATHS.map(
      (repositoryPath) => [
        repositoryPath,
        {
          node:
            H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE,
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
      H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_EVIDENCE
    ],
    nodes: [
      ...baseInstance.nodes,
      H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE
    ]
  });

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(
  nodeId
) {
  return nodeId ===
    H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE.nodeId
    ? H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(
        nodeId
      );
}

export function getHEarthRepositoryRegistryEvidence(
  evidenceId
) {
  return evidenceId ===
    H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_EVIDENCE
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
            H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE.nodeId,
          node:
            H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE,
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
    H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE;

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
    H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE.nodeId
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
      H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE.nodeId
  ) {
    return deepFreeze({
      nodeId,
      nodes: [
        H_EARTH_CAMERA_AUDIT_CONTINUITY_SCOPE_NODE
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

export const H_EARTH_CAMERA_AUDIT_CONTINUITY_RECONCILED_FACADE =
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
  H_EARTH_CAMERA_AUDIT_CONTINUITY_RECONCILED_FACADE;
