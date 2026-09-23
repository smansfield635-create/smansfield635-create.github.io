/**
 * H_EARTH_AWARDS_COMPASS_V30_EXACT_PATH_REGISTRATION_v1
 *
 * Read-only registration of exactly four future V30 construction paths.
 * All four are truthfully absent at the exact governing main. This creates
 * path resolution only: no product, construction, evidence mutation,
 * canonicalization, merge, deployment, release, or publication authority.
 */
import baseFacade from './h-earth.repository-registry.c3c3r5-pr1215-scope-reconciliation.active.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function normalizePath(value) {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
}

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
export const H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN =
  '57d5d7f3b1e24287817b828878ed2c9ca864cbbe';

const V29_REJECTED_BRANCH =
  'ff918a4872c6e9cbd6733bdeb0dcf199bbde304b';
const V29_TERMINAL_CLOSURE =
  'c4c21284187491cc69c53dc46286580efaa7a650';
const NODE_ID =
  'H_EARTH_AWARDS_COMPASS_V30_EXACT_PATH_REGISTRATION_SCOPE';
const EVIDENCE_ID =
  'EVIDENCE_H_EARTH_AWARDS_COMPASS_V30_EXACT_PATH_REGISTRATION_v1';

export const H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS = Object.freeze([
  '/showroom/globe/h-earth/awards/media/candidates/chapter01-compass-v30-final-corrective-65s.mp4',
  '/h-earth-3d/experience-anchor/evidence/AWARDS_COMPASS_V30_PRECONSTRUCTION_20260816_001.json',
  '/h-earth-3d/experience-anchor/evidence/AWARDS_COMPASS_V30_CONSTRUCTION_20260816_001.json',
  '/h-earth-3d/experience-anchor/receipts/AWARDS_COMPASS_V30_CONSTRUCTION_20260816_001.json'
]);

export const H_EARTH_AWARDS_COMPASS_V30_NEGATIVE_NEIGHBOR_PATHS =
  Object.freeze([
    '/showroom/globe/h-earth/awards/media/candidates/chapter01-compass-v29-final-corrective-65s.mp4',
    '/showroom/globe/h-earth/awards/media/candidates/chapter01-compass-v30-final-corrective-64s.mp4',
    '/showroom/globe/h-earth/awards/media/candidates/chapter01-compass-v31-final-corrective-65s.mp4',
    '/h-earth-3d/experience-anchor/evidence/AWARDS_COMPASS_V29_PRECONSTRUCTION_20260816_001.json',
    '/h-earth-3d/experience-anchor/evidence/AWARDS_COMPASS_V29_CONSTRUCTION_20260816_001.json',
    '/h-earth-3d/experience-anchor/receipts/AWARDS_COMPASS_V29_CONSTRUCTION_20260816_001.json',
    '/h-earth-3d/experience-anchor/evidence/AWARDS_COMPASS_V30_PRECONSTRUCTION_20260816_002.json',
    '/h-earth-3d/experience-anchor/evidence/AWARDS_COMPASS_V30_CONSTRUCTION_20260816_002.json',
    '/h-earth-3d/experience-anchor/receipts/AWARDS_COMPASS_V30_CONSTRUCTION_20260816_002.json',
    '/h-earth-3d/experience-anchor/evidence/AWARDS_COMPASS_V30_UNDECLARED_20260816_001.json'
  ]);

const OCCURRENCES = Object.freeze(
  H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS.map((repositoryPath) =>
    deepFreeze({
      repository: REPOSITORY,
      refType: 'COMMIT',
      refName: H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN,
      commitSha: H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN,
      path: repositoryPath,
      gitBlobSha: null,
      contentSha256: null,
      byteCount: null,
      existenceStatus: 'ABSENT',
      fetchbackStatus:
        'VERIFIED_ABSENT_AT_EXACT_GOVERNING_MAIN_BEFORE_V30_MATERIALIZATION',
      occurrenceClass:
        'AUTHORIZED_H_EARTH_AWARDS_COMPASS_V30_TARGET_NOT_PRESENT_AT_GOVERNING_MAIN'
    })
  )
);

export const H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_EVIDENCE =
  deepFreeze({
    evidenceId: EVIDENCE_ID,
    evidenceClass:
      'H_EARTH_AWARDS_COMPASS_V30_EXACT_PATH_REGISTRATION_WITH_TRUTHFUL_ABSENT_OCCURRENCES',
    sourceKind:
      'EXPLICIT_USER_AUTHORIZATION_PLUS_V29_PREFLIGHT_STOP_AND_EXACT_MAIN_FETCHBACK',
    sourceIdOrPath: 'ISSUE_1200',
    sourceOccurrenceOrRevision:
      `GOVERNING_MAIN=${H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN};` +
      `V29_REJECTED_BRANCH=${V29_REJECTED_BRANCH};` +
      `V29_TERMINAL_CLOSURE=${V29_TERMINAL_CLOSURE};` +
      'V29_LOCK_GENERATION=1508;' +
      'V29_TERMINAL_DISPOSITION=REJECTED_CLOSED;' +
      'EXACT_V30_PATH_COUNT=4',
    governingMain: H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN,
    exactTargetPathCount: 4,
    registrationEffect: 'PATH_RESOLUTION_ONLY',
    assertionScope: Object.freeze([
      'EXACT_FOUR_V30_CANDIDATE_EVIDENCE_AND_RECEIPT_PATHS',
      'FOUR_TRUTHFUL_ABSENT_OCCURRENCES_AT_GOVERNING_MAIN',
      'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION',
      'V28_LIVE_ROUTE_AND_BYTES_UNCHANGED'
    ]),
    evidenceLimitations: Object.freeze([
      'NO_PREFIX_WIDE_REGISTRATION',
      'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
      'NO_PRODUCT_OR_MEDIA_MUTATION_AUTHORITY',
      'NO_CONSTRUCTION_AUTHORITY',
      'NO_EVIDENCE_OR_RECEIPT_MUTATION_AUTHORITY',
      'NO_EXPERIENCE_ANCHOR_WAIVER_OR_REPLACEMENT_AUTHORITY',
      'NO_ACCEPTED_OCCURRENCE_OR_CANONICALIZATION_AUTHORITY',
      'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
    ])
  });

export const H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE =
  deepFreeze({
    nodeId: NODE_ID,
    nodeType: 'BOUNDARY_PACKET',
    nodeSubtype:
      'H_EARTH_AWARDS_COMPASS_V30_EXACT_PATH_REGISTRATION_SCOPE',
    displayName: 'H-Earth Awards Compass V30 Exact Path Registration',
    description:
      'Read-only registration of exactly four future V30 candidate, evidence, and receipt paths required before fresh V30 intake.',
    repositoryPaths: [...H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS],
    repositoryOccurrences: OCCURRENCES,
    evidenceClass:
      H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_EVIDENCE.evidenceClass,
    evidenceReferences: Object.freeze([EVIDENCE_ID]),
    lifecycleStatus: 'AUTHORIZED_PATH_REGISTRATION_PREREQUISITE',
    authorityClass: 'AUDIT_ONLY',
    authorityPosture: 'EXACT_PATH_RESOLUTION_ONLY',
    registrationEffect: 'PATH_RESOLUTION_ONLY',
    authoritySource: Object.freeze([
      'EXPLICIT_USER_AUTHORIZATION_2026_08_16',
      'V29_NATIVE_PREFLIGHT_REQUESTED_PATH_UNRESOLVED',
      `V29_TERMINAL_CLOSURE=${V29_TERMINAL_CLOSURE}`,
      `EXACT_GOVERNING_MAIN=${H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN}`
    ]),
    authorityScope: Object.freeze([
      'EXACT_FOUR_PATH_RESOLUTION',
      'TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION',
      'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
    ]),
    authorityLimitations: Object.freeze([
      'NO_PREFIX_WIDE_REGISTRATION',
      'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
      'NO_PRODUCT_AUTHORITY',
      'NO_MEDIA_MUTATION_AUTHORITY',
      'NO_CONSTRUCTION_AUTHORITY',
      'NO_EVIDENCE_MUTATION_AUTHORITY',
      'NO_RECEIPT_MUTATION_AUTHORITY',
      'NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY',
      'NO_CANONICAL_IDENTITY_AUTHORITY',
      'NO_ACCEPTED_OCCURRENCE_AUTHORITY',
      'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
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
      'V29_REJECTED_CLOSED_PRECEDES_V30_REGISTRATION',
      'V30_REGISTRATION_PRECEDES_FRESH_V30_INTAKE',
      'REGISTRATION_DOES_NOT_AUTHORIZE_V30_CONSTRUCTION'
    ]),
    dependencyRelations: Object.freeze([]),
    allowedMutationScope:
      'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_ONLY',
    prohibitedMutations: Object.freeze([
      'V30_PRODUCT_OR_MEDIA_MUTATION_FROM_REGISTRY_AUTHORITY',
      'V30_EVIDENCE_OR_RECEIPT_MUTATION_FROM_REGISTRY_AUTHORITY',
      'PREFIX_WIDE_REGISTRATION',
      'MERGE_OR_DEPLOYMENT_FROM_REGISTRY_AUTHORITY'
    ]),
    requiredValidations: Object.freeze([
      'EXACT_FOUR_TARGET_PATHS',
      'ALL_FOUR_OCCURRENCES_TRUTHFULLY_ABSENT_AT_GOVERNING_MAIN',
      'ALL_FOUR_PATHS_RESOLVE_TO_THIS_NODE',
      'ALL_DECLARED_NEGATIVE_NEIGHBORS_REMAIN_UNRESOLVED',
      'PREDECESSOR_REGISTRY_CHAIN_REMAINS_PRESENT'
    ]),
    stoppingBoundaries: Object.freeze([
      'STOP_ON_PATH_OUTSIDE_EXACT_FOUR',
      'STOP_ON_FALSE_PRESENT_OCCURRENCE',
      'STOP_ON_NEGATIVE_NEIGHBOR_RESOLUTION',
      'STOP_ON_PREDECESSOR_REGISTRY_REGRESSION',
      'STOP_ON_PRODUCT_CONSTRUCTION_MERGE_OR_DEPLOYMENT_AUTHORITY_EXPANSION'
    ]),
    currentIdentityReferences: Object.freeze([
      `GOVERNING_MAIN=${H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN}`,
      `V29_REJECTED_BRANCH=${V29_REJECTED_BRANCH}`,
      `V29_TERMINAL_CLOSURE=${V29_TERMINAL_CLOSURE}`,
      'V29_LOCK_GENERATION=1508',
      'EXACT_TARGET_PATH_COUNT=4',
      'LIVE_V28_SHA256=42a0ee342a00179fff8f94d09f02ae58b660856cc8b9e6613be1f9990d1cfa62'
    ]),
    unresolvedFields: Object.freeze([])
  });

const pathIndex = new Map(
  H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([
        H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE
      ]),
      occurrences: Object.freeze(
        OCCURRENCES.filter((entry) => entry.path === repositoryPath)
      )
    })
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...(baseInstance.evidenceRecords ?? []).filter(
      (entry) => entry.evidenceId !== EVIDENCE_ID
    ),
    H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((entry) => entry.nodeId !== NODE_ID),
    H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) {
    return baseFacade.resolveHEarthRepositoryRegistryPath(
      normalized ?? repositoryPath
    );
  }

  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({
    ...base,
    repositoryPath: normalized,
    resolved: true,
    nodes: [...(base.nodes ?? []), ...indexed.nodes],
    occurrences: [...(base.occurrences ?? []), ...indexed.occurrences],
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath =
    input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES
    .filter((entry) =>
      (normalizedPath == null || entry.path === normalizedPath) &&
      (input.refType == null || entry.refType === input.refType) &&
      (input.refName == null || entry.refName === input.refName) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.existenceStatus == null ||
        entry.existenceStatus === input.existenceStatus)
    )
    .map((occurrence) =>
      deepFreeze({
        nodeId: NODE_ID,
        node: H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE,
        occurrence
      })
    );

  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({
    ...input,
    ...(normalizedPath == null ? {} : { path: normalizedPath })
  });

  return deepFreeze({
    query: base.query,
    matches: [...(base.matches ?? []), ...localMatches],
    resolved: base.resolved === true || localMatches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE;
  const repositoryPath =
    criteria.repositoryPath == null
      ? null
      : normalizePath(criteria.repositoryPath);
  const matches =
    (criteria.nodeId == null || criteria.nodeId === node.nodeId) &&
    (repositoryPath == null ||
      node.repositoryPaths.includes(repositoryPath)) &&
    (criteria.nodeType == null ||
      criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null ||
      criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null ||
      criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null ||
      criteria.lifecycleStatus === node.lifecycleStatus);

  return deepFreeze(matches ? [...base, node] : base);
}

export function getHEarthRepositoryRegistryRelationsForNode(
  nodeId,
  direction = 'BOTH'
) {
  return nodeId === NODE_ID
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(
        nodeId,
        direction
      );
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  return nodeId === NODE_ID
    ? deepFreeze({
        nodeId,
        nodes: [H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE],
        relations: [],
        resolved: true,
        unresolved: false
      })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthAwardsCompassV30PathRegistration() {
  const targets =
    H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS.map((path) =>
      resolveHEarthRepositoryRegistryPath(path)
    );
  const predecessorTargets =
    H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS.map((path) =>
      baseFacade.resolveHEarthRepositoryRegistryPath(path)
    );
  const neighbors =
    H_EARTH_AWARDS_COMPASS_V30_NEGATIVE_NEIGHBOR_PATHS.map((path) =>
      resolveHEarthRepositoryRegistryPath(path)
    );
  const predecessorPaths = [
    '/showroom/globe/h-earth/render/planetary-world-frame.js',
    '/h-earth-3d/control-plane/audralia-open-world-spatial-migration/AGENTS.md'
  ];

  const checks = deepFreeze({
    exactTargetPathCount:
      H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS.length === 4 &&
      new Set(H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS).size === 4,
    predecessorDidNotResolveTargets:
      predecessorTargets.every((entry) => entry.resolved !== true),
    allTargetsResolve:
      targets.every((entry) => entry.resolved === true),
    allTargetsResolveOnlyToV30Node:
      targets.every(
        (entry) =>
          (entry.nodes ?? []).length === 1 &&
          entry.nodes[0].nodeId === NODE_ID
      ),
    allTargetOccurrencesTruthfullyAbsent:
      targets.every(
        (entry) =>
          (entry.occurrences ?? []).length === 1 &&
          entry.occurrences[0].commitSha ===
            H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN &&
          entry.occurrences[0].existenceStatus === 'ABSENT' &&
          entry.occurrences[0].gitBlobSha === null &&
          entry.occurrences[0].contentSha256 === null &&
          entry.occurrences[0].byteCount === null
      ),
    allNegativeNeighborsUnresolved:
      neighbors.every((entry) => entry.resolved !== true),
    predecessorFacadeBehaviorPreserved:
      predecessorPaths.every(
        (path) =>
          JSON.stringify(resolveHEarthRepositoryRegistryPath(path)) ===
          JSON.stringify(baseFacade.resolveHEarthRepositoryRegistryPath(path))
      ),
    registryIdentityPreserved:
      ['registryId', 'registryVersion', 'schemaId', 'schemaVersion']
        .every((key) => combinedInstance[key] === baseInstance[key]),
    predecessorNodesPreserved:
      combinedInstance.nodes.length === baseInstance.nodes.length + 1,
    predecessorEvidencePreserved:
      combinedInstance.evidenceRecords.length ===
      (baseInstance.evidenceRecords ?? []).length + 1,
    auditOnly:
      H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE.authorityClass ===
      'AUDIT_ONLY',
    pathResolutionOnly:
      H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE
        .registrationEffect === 'PATH_RESOLUTION_ONLY',
    noPrefixWideRegistration:
      H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE
        .authorityLimitations.includes('NO_PREFIX_WIDE_REGISTRATION'),
    noProductAuthority:
      H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE
        .authorityLimitations.includes('NO_PRODUCT_AUTHORITY'),
    noConstructionAuthority:
      H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE
        .authorityLimitations.includes('NO_CONSTRUCTION_AUTHORITY'),
    noMergeDeploymentAuthority:
      H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_NODE
        .authorityLimitations.includes(
          'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
        )
  });

  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    schema:
      'H_EARTH_AWARDS_COMPASS_V30_EXACT_PATH_REGISTRATION_RECEIPT_v1',
    pass: eligible,
    eligible,
    status: eligible
      ? 'H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_PASS'
      : 'H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_FAIL',
    governingMain: H_EARTH_AWARDS_COMPASS_V30_GOVERNING_MAIN,
    targetPaths: H_EARTH_AWARDS_COMPASS_V30_REGISTERED_PATHS,
    negativeNeighborPaths:
      H_EARTH_AWARDS_COMPASS_V30_NEGATIVE_NEIGHBOR_PATHS,
    checks,
    authorityCreated: false,
    mutationAuthorized: false,
    constructionAuthorized: false,
    mergeAuthorized: false,
    deploymentAuthorized: false
  });
}

export const H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_FACADE =
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
    verifyHEarthAwardsCompassV30PathRegistration
  });

export default H_EARTH_AWARDS_COMPASS_V30_PATH_REGISTRATION_FACADE;
