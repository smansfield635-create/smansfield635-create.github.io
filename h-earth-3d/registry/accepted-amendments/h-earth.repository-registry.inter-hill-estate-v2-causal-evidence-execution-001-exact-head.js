/**
 * H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_v1
 *
 * Read-only exact-head registry successor for PR #680 at 940fe2623501da8a4c2b7362d709ed36de851fb8.
 * Registers exactly the 23 H-Earth paths in the immutable causal-evidence
 * execution package. The two workflow paths remain outside H-Earth scope.
 */

import baseFacade from './h-earth.repository-registry.inter-hill-estate-successor-evaluator-v2-causal-correction-exact-head.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

const normalizePath = (value) => {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const SOURCE_PR = 680;
const SOURCE_BASE = 'e876e6107d3e01a19e76c9fd487b6de0d511cb25';
const SOURCE_HEAD = '940fe2623501da8a4c2b7362d709ed36de851fb8';
const SOURCE_TREE = '6363faf4114d8448c9dc8a00d8cebdf1a13f99d0';
const SOURCE_LOCK_GENERATION = 386;
const REGISTRY_REPAIR_LOCK_GENERATION = 391;
const REGISTRY_OPERATION = 'H_EARTH_V2_CAUSAL_EVIDENCE_001_GOVERNANCE_REGISTRY_REPAIR_001';
const NODE_ID = 'H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE';
const PARENT_NODE_ID = 'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_v1';

const VERIFIED_OCCURRENCES = Object.freeze([
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/AGENTS.md', '4f752d9ab3d3c3e07dc4abe2a6c055fd4863a479'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/artifact-schemas.v1.json', 'cf52468b4f5c5aabd6c0bb15413c12f57889d015'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/causal-evidence-adapter.v1.mjs', '9fac36538842bb84de5603ac4a0c3f772f4d9af8'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/changed-path-manifest.v1.json', '354d8f3d71b4957e0f5cd4bd919f60c86de86fe6'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/construction-procedure.v1.json', 'f30e92fd01de77f727f87231da8fa91ea21344a3'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/deterministic-reducer.v1.mjs', '8c260218056d73a6b3ca884bde7877bff27c790b'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/deterministic-rerun-comparator.v1.mjs', '3726b8b5635a1ced9b8771c1bc8e5cb7f0996951'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/deterministic-shard-wave-planner.v1.mjs', '40a617e3556fdc2b396a50116e1b8c8c2dde62b1'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/eligible-seed-preflight.v1.mjs', 'baae370ceec490191b23ccc606aef39de59e4ff2'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/evidence-protocol.v1.json', '577a854ba0e306d609cac7ff1fac150e17bd63d3'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/execution-capacity-profile.v1.json', '9fe4d92030da57f979c37e7bf32af583ba513cad'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/fixtures.v1.json', '37a15f10e3071b8a0b3d2b9872288f9925ae4c64'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/input-freeze.v1.json', '678bd0504eaaa42f5c9f78ae27f6822415a2703d'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/input-schema.v1.json', '91efb33c75c62c1529c75b869c1fcdf5b598eb73'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/operation-request.v1.json', '2c3df397c9c1c683ab9ac89f78b0b320fb253003'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/output-schema.v1.json', 'fadcb65544b2c92476852b4968d6caeee754c655'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/role3-independent-reproduction.v1.mjs', 'da35532541dcc2ff79e067d33ccf0e353284dd90'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/rollback.v1.json', 'c384442337b2326af6e3cac46e7b71218e531fda'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/shard-worker.v1.mjs', '5e474613e2218e0c20b56727ec6ed19383a4d5df'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/source-evidence-manifest.v1.json', '125035b77b529ebdbe7321c5b1f208c581b9202d'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/streaming-evidence-writer.v1.mjs', '97ade2a9a2375d46578de0414673dfad4c85912f'],
  ['/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-v2-causal-evidence-execution-001/verify.v1.mjs', '21dd4b415385763a5e6deeac18d46feb5bf0fd14'],
  ['/h-earth-3d/validation/h-earth.inter-hill-estate-v2-causal-evidence-execution-001.mjs', '2f31c9a9de296d0a34f7ceaea8b0c8786d229838']
]);

export const H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_PATHS =
  Object.freeze(VERIFIED_OCCURRENCES.map(([repositoryPath]) => repositoryPath));

const OCCURRENCES = Object.freeze(
  VERIFIED_OCCURRENCES.map(([repositoryPath, gitBlobSha]) => deepFreeze({
    repository: REPOSITORY,
    sourcePr: SOURCE_PR,
    refType: 'COMMIT',
    refName: SOURCE_HEAD,
    commitSha: SOURCE_HEAD,
    path: repositoryPath,
    gitBlobSha,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_EXACT_PR_HEAD_AND_GIT_BLOB',
    occurrenceClass: 'CONTROL_PLANE_EXACT_PR_HEAD_AND_BLOB_OCCURRENCE_REGISTRATION'
  }))
);

export const H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_EVIDENCE =
  deepFreeze({
    evidenceId: EVIDENCE_ID,
    evidenceClass: 'CONTROL_PLANE_EXACT_PR_HEAD_AND_BLOB_OCCURRENCE_REGISTRATION',
    sourceKind: 'PR_EXACT_HEAD_REGISTRY_SCOPE_RESOLUTION',
    sourceIdOrPath: `PR_${SOURCE_PR}`,
    sourceOccurrenceOrRevision:
      `PR=${SOURCE_PR};BASE=${SOURCE_BASE};HEAD=${SOURCE_HEAD};TREE=${SOURCE_TREE};EXACT_H_EARTH_PATH_COUNT=23`,
    sourcePr: SOURCE_PR,
    sourceBase: SOURCE_BASE,
    sourceHead: SOURCE_HEAD,
    sourceTree: SOURCE_TREE,
    sourceLockGeneration: SOURCE_LOCK_GENERATION,
    registryRepairLockGeneration: REGISTRY_REPAIR_LOCK_GENERATION,
    registryOperation: REGISTRY_OPERATION,
    exactPathCount: 23,
    totalPrPathCount: 25,
    outsideHEarthPathCount: 2,
    instrumentClass: 'NONPRODUCT_CAUSAL_EVIDENCE_EXECUTION',
    registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
    assertionScope: Object.freeze([
      'TWENTY_THREE_EXACT_H_EARTH_SCOPED_CAUSAL_EVIDENCE_EXECUTION_PATHS',
      'TWENTY_THREE_EXACT_PR_680_HEAD_AND_GIT_BLOB_OCCURRENCES',
      'TWO_WORKFLOW_PATHS_REMAIN_OUTSIDE_H_EARTH_SCOPE',
      'PREDECESSOR_CAUSAL_CORRECTION_REGISTRY_CHAIN_PRESERVED',
      'CONSTRUCTION_REMAINS_HELD'
    ]),
    verifiedOn: '2026-08-06',
    evidenceLimitations: Object.freeze([
      'NO_GENERAL_PREFIX_REGISTRATION',
      'NO_SOURCE_PR_680_OR_CANDIDATE_HEAD_MUTATION',
      'NO_SOURCE_LOCK_386_MUTATION_OR_CLOSURE',
      'NO_PRODUCT_TERRAIN_CAMERA_NAVIGATION_WATER_OR_PLACEMENT_AUTHORITY',
      'NO_ESTATE_OR_MANOR_CONSTRUCTION_AUTHORITY',
      'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
    ])
  });

export const H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_NODE =
  deepFreeze({
    nodeId: NODE_ID,
    nodeType: 'BOUNDARY_PACKET',
    nodeSubtype: 'NONPRODUCT_CAUSAL_EVIDENCE_EXECUTION_EXACT_HEAD_SCOPE',
    displayName: 'H-Earth Inter-Hill Estate V2 Causal Evidence Execution 001 — Exact Head Scope',
    description:
      'Registers exactly 23 H-Earth-scoped nonproduct causal-evidence execution paths and immutable PR #680 head/blob occurrences for repository preflight path resolution.',
    parentScope: PARENT_NODE_ID,
    parentScopeNodeId: PARENT_NODE_ID,
    sourcePr: SOURCE_PR,
    sourceBase: SOURCE_BASE,
    sourceHead: SOURCE_HEAD,
    sourceTree: SOURCE_TREE,
    repositoryPaths: [...H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_PATHS],
    repositoryOccurrences: OCCURRENCES,
    evidenceClass:
      H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_EVIDENCE.evidenceClass,
    evidenceReferences: Object.freeze([EVIDENCE_ID]),
    authorityClass: 'AUDIT_ONLY',
    authorityPosture: 'CONTROL_PLANE_EXACT_HEAD_PATH_RESOLUTION_ONLY',
    registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
    instrumentClass: 'NONPRODUCT_CAUSAL_EVIDENCE_EXECUTION',
    authoritySource: Object.freeze([
      'ROLE_4_PROJECT_GOVERNANCE_AND_CROSS_ROOM_COORDINATION_AUTHORITY',
      `PR_${SOURCE_PR}`,
      `EXACT_CANDIDATE_HEAD_${SOURCE_HEAD}`,
      `REGISTRY_OPERATION_${REGISTRY_OPERATION}`,
      `REGISTRY_REPAIR_LOCK_GENERATION_${REGISTRY_REPAIR_LOCK_GENERATION}`
    ]),
    authorityScope: Object.freeze([
      'EXACT_PATH_RESOLUTION',
      'EXACT_CANDIDATE_HEAD_OCCURRENCE_RESOLUTION',
      'EXACT_GIT_BLOB_IDENTITY_VERIFICATION',
      'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
    ]),
    authorityLimitations: Object.freeze([
      'NO_PREFIX_WIDE_REGISTRATION',
      'NO_CAUSAL_EVIDENCE_PACKAGE_MUTATION',
      'NO_PR_680_CANDIDATE_MUTATION',
      'NO_SOURCE_LOCK_386_MUTATION_OR_CLOSURE',
      'NO_PRODUCT_TERRAIN_CAMERA_NAVIGATION_WATER_OR_PLACEMENT_AUTHORITY',
      'NO_ESTATE_OR_MANOR_CONSTRUCTION',
      'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION'
    ]),
    parentRelations: Object.freeze([]),
    childRelations: Object.freeze([]),
    peerRelations: Object.freeze([]),
    upstreamBoundaries: Object.freeze([PARENT_NODE_ID]),
    downstreamBoundaries: Object.freeze([]),
    cardinalRole: 'NONE',
    cardinalStatus: 'NONE',
    cardinalCompleteness: 'NOT_APPLICABLE',
    orderingRules: Object.freeze([
      'ACTIVE_PREDECESSOR_FACADE_BEFORE_CAUSAL_EVIDENCE_EXECUTION_EXACT_HEAD_SCOPE',
      'EXACT_REGISTRY_SCOPE_RESOLUTION_BEFORE_PR_680_REQUIRED_CHECK_RERUN'
    ]),
    dependencyRelations: Object.freeze([]),
    allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
    prohibitedMutations: Object.freeze([
      'GENERAL_PREFIX_REGISTRATION',
      'SOURCE_CANDIDATE_MUTATION',
      'SOURCE_LOCK_386_MUTATION_OR_CLOSURE',
      'PRODUCT_TERRAIN_LIVE_ESTATE_OR_MANOR_MUTATION',
      'MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION'
    ]),
    requiredValidations: Object.freeze([
      'EXACT_FOUR_PATH_GOVERNANCE_REPAIR_DELTA',
      'ALL_TWENTY_THREE_H_EARTH_PATHS_RESOLVE_TO_THIS_NODE',
      'ALL_TWENTY_THREE_OCCURRENCES_MATCH_PR_680_HEAD_AND_GIT_BLOBS',
      'PREDECESSOR_REGISTRY_CHAIN_REMAINS_PRESENT',
      'SOURCE_PR_680_HEAD_REMAINS_UNCHANGED',
      'CONSTRUCTION_REMAINS_HELD_UNTIL_SEPARATE_AUTHORITY'
    ]),
    stoppingBoundaries: Object.freeze([
      'STOP_ON_ANY_PATH_OUTSIDE_EXACT_TWENTY_THREE',
      'STOP_ON_PR_680_HEAD_OR_GIT_BLOB_IDENTITY_MISMATCH',
      'STOP_IF_PREDECESSOR_REGISTRATION_IS_REMOVED_OR_REWRITTEN',
      'STOP_BEFORE_SOURCE_LOCK_MUTATION_PRODUCT_TERRAIN_MANOR_MERGE_OR_DEPLOYMENT'
    ]),
    currentIdentityReferences: Object.freeze([
      `SOURCE_PR=${SOURCE_PR}`,
      `SOURCE_BASE=${SOURCE_BASE}`,
      `SOURCE_HEAD=${SOURCE_HEAD}`,
      `SOURCE_TREE=${SOURCE_TREE}`,
      `SOURCE_LOCK_GENERATION=${SOURCE_LOCK_GENERATION}`,
      `REGISTRY_REPAIR_LOCK_GENERATION=${REGISTRY_REPAIR_LOCK_GENERATION}`,
      'EXACT_H_EARTH_PATH_COUNT=23',
      'TOTAL_PR_PATH_COUNT=25',
      `PARENT_SCOPE=${PARENT_NODE_ID}`
    ]),
    lifecycleStatus: 'CONTROL_PLANE_EXACT_HEAD_REGISTERED',
    unresolvedFields: Object.freeze([])
  });

const pathIndex = new Map(
  H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_PATHS.map(
    (repositoryPath) => [
      repositoryPath,
      {
        node: H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_NODE,
        occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
      }
    ]
  )
);

const parentNode = baseFacade.getHEarthRepositoryRegistryNode(PARENT_NODE_ID);
if (parentNode?.nodeId !== PARENT_NODE_ID) {
  throw new Error('H_EARTH_CAUSAL_EVIDENCE_EXECUTION_PARENT_NODE_NOT_PRESERVED');
}

if (
  VERIFIED_OCCURRENCES.length !== 23 ||
  pathIndex.size !== 23 ||
  new Set(H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_PATHS).size !== 23 ||
  VERIFIED_OCCURRENCES.some(([repositoryPath, gitBlobSha]) =>
    repositoryPath.endsWith('/') ||
    !repositoryPath.startsWith('/h-earth-3d/') ||
    !/^[0-9a-f]{40}$/.test(gitBlobSha)
  )
) {
  throw new Error('H_EARTH_CAUSAL_EVIDENCE_EXECUTION_EXACT_OCCURRENCE_SET_INVALID');
}

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords.filter((record) => record.evidenceId !== EVIDENCE_ID),
    H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  return deepFreeze({
    repositoryPath: normalized,
    resolved: true,
    resolutionClass: 'REGISTERED_H_EARTH_PATH',
    nodes: [indexed.node],
    occurrences: indexed.occurrences,
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES.filter((entry) => {
    if (normalizedPath != null && entry.path !== normalizedPath) return false;
    if (input.sourcePr != null && entry.sourcePr !== input.sourcePr) return false;
    if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
    if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
    return true;
  });
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({
    ...input,
    ...(normalizedPath == null ? {} : { path: normalizedPath })
  });
  return deepFreeze({
    ...base,
    matches: [...(base.matches ?? []), ...localMatches],
    resolved: base.resolved === true || localMatches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const normalizedPath =
    criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const base = baseFacade.findHEarthRepositoryRegistryNodes({
    ...criteria,
    ...(normalizedPath == null ? {} : { repositoryPath: normalizedPath })
  });
  const node = H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_NODE;
  const matches =
    (criteria.nodeId == null || criteria.nodeId === node.nodeId) &&
    (normalizedPath == null || node.repositoryPaths.includes(normalizedPath)) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(matches ? [...base, node] : base);
}

export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') {
  return nodeId === NODE_ID
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  if (nodeId === NODE_ID) {
    return deepFreeze({
      nodeId,
      nodes: [parentNode, H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_NODE],
      relations: [],
      complete: true
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthV2CausalEvidenceExecution001ExactHeadScope() {
  const pathChecks =
    H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_PATHS.map(
      (repositoryPath) => {
        const expected = OCCURRENCES.find((entry) => entry.path === repositoryPath);
        const resolution = resolveHEarthRepositoryRegistryPath(repositoryPath);
        const occurrence = resolveHEarthRepositoryRegistryOccurrence({
          path: repositoryPath,
          sourcePr: SOURCE_PR,
          commitSha: SOURCE_HEAD,
          gitBlobSha: expected.gitBlobSha
        });
        return {
          repositoryPath,
          resolved: resolution.resolved === true,
          nodeResolved:
            (resolution.nodes ?? []).some((node) => node.nodeId === NODE_ID),
          exactOccurrenceResolved:
            occurrence.resolved === true &&
            (occurrence.matches ?? []).some(
              (entry) =>
                entry.path === repositoryPath &&
                entry.commitSha === SOURCE_HEAD &&
                entry.gitBlobSha === expected.gitBlobSha
            )
        };
      }
    );
  const checks = {
    exactPathCount: pathChecks.length === 23,
    exactUniquePathCount:
      new Set(H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_PATHS).size === 23,
    parentPreserved: parentNode?.nodeId === PARENT_NODE_ID,
    everyPathResolved: pathChecks.every((entry) => entry.resolved),
    everyPathResolvesToNode: pathChecks.every((entry) => entry.nodeResolved),
    everyExactOccurrenceResolved: pathChecks.every((entry) => entry.exactOccurrenceResolved),
    sourceHeadFrozen:
      H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_EVIDENCE.sourceHead ===
      SOURCE_HEAD,
    constructionAuthorityAbsent:
      H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_SCOPE_NODE.authorityLimitations.includes(
        'NO_ESTATE_OR_MANOR_CONSTRUCTION'
      )
  };
  return deepFreeze({
    schema: 'H_EARTH_V2_CAUSAL_EVIDENCE_EXECUTION_001_REGISTRY_SCOPE_RESOLUTION_VERIFICATION_v1',
    result: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL_CLOSED',
    sourcePr: SOURCE_PR,
    sourceHead: SOURCE_HEAD,
    sourceTree: SOURCE_TREE,
    exactPathCount: pathChecks.length,
    pathChecks,
    checks
  });
}

export const H_EARTH_V2_CAUSAL_EVIDENCE_EXECUTION_001_REGISTRY_SCOPE_RESOLUTION_VERIFICATION =
  verifyHEarthV2CausalEvidenceExecution001ExactHeadScope();

if (
  H_EARTH_V2_CAUSAL_EVIDENCE_EXECUTION_001_REGISTRY_SCOPE_RESOLUTION_VERIFICATION.result !==
  'PASS'
) {
  throw new Error(
    `H_EARTH_V2_CAUSAL_EVIDENCE_EXECUTION_001_REGISTRY_SCOPE_RESOLUTION_FAILED:${
      JSON.stringify(
        H_EARTH_V2_CAUSAL_EVIDENCE_EXECUTION_001_REGISTRY_SCOPE_RESOLUTION_VERIFICATION.checks
      )
    }`
  );
}

export const H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_FACADE =
  deepFreeze({
    ...baseFacade,
    getHEarthRepositoryRegistryInstance,
    getHEarthRepositoryRegistryNode,
    getHEarthRepositoryRegistryEvidence,
    resolveHEarthRepositoryRegistryPath,
    resolveHEarthRepositoryRegistryOccurrence,
    findHEarthRepositoryRegistryNodes,
    getHEarthRepositoryRegistryRelationsForNode,
    getHEarthRepositoryRegistryDependencyClosure,
    verifyHEarthV2CausalEvidenceExecution001ExactHeadScope
  });

export default H_EARTH_INTER_HILL_ESTATE_V2_CAUSAL_EVIDENCE_EXECUTION_001_EXACT_HEAD_FACADE;
