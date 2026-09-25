/**
 * H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_v2
 * Read-only internal-registry successor for the two HC02 Page Excellence
 * execution carriers and the future HC02 presentation-host CSS path.
 */
import baseFacade from './h-earth.repository-registry.live-experience-maturity-convergence-accepted-occurrences.js';

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
const GOVERNING_MAIN = '5b11583f42ee7f57791ebf4200ab5c05f043c00a';
const CARRIER_BRANCH = 'agent/h-earth-hc02-page-excellence-architecture-execution-v2';
const CARRIER_HEAD = '0a2c4b39fe161f713b0b29220be549b69434f882';
const TEMP_EXECUTION_LOCK_GENERATION = 651;
const REGISTRY_PREREQUISITE_LOCK_GENERATION = 652;
const REGISTRY_SCOPE_HASH = 'eb1c927aa747e2a7849c8bb4480d93c140b30d298534115478767e7659787748';
const NODE_ID = 'H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_AUTHORIZED_SCOPE_V2';
const PARENT_NODE_ID = 'H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_ACCEPTED_OCCURRENCES';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_v2';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.hc02-page-excellence-execution-carrier-scope.v2.js';
const CARRIER_ADMISSION_PATH = '/h-earth-3d/control-plane/live-experience-maturity-convergence/hc02/execution/H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_ADMISSION_RECEIPT.v2.json';
const CARRIER_ROUTER_PATH = '/h-earth-3d/control-plane/live-experience-maturity-convergence/hc02/execution/H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_ROUTER_RECEIPT.v2.json';
const INDEX_CSS_PATH = '/showroom/globe/h-earth/index.css';
const INDEX_HTML_PATH = '/showroom/globe/h-earth/index.html';

export const H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_AUTHORIZED_PATHS_V2 = Object.freeze([
  CARRIER_ADMISSION_PATH,
  CARRIER_ROUTER_PATH,
  INDEX_CSS_PATH,
  AMENDMENT_PATH
]);

const OCCURRENCES = Object.freeze([
  deepFreeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: CARRIER_BRANCH,
    commitSha: CARRIER_HEAD,
    path: CARRIER_ADMISSION_PATH,
    gitBlobSha: 'c38a233ade0450a6408ef811f4a75ae6e4c03a4c',
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_EXACT_CARRIER_BRANCH_HEAD_AND_GIT_BLOB',
    occurrenceClass: 'HC02_PAGE_EXCELLENCE_EXECUTION_EVIDENCE_CARRIER_V2'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: CARRIER_BRANCH,
    commitSha: CARRIER_HEAD,
    path: CARRIER_ROUTER_PATH,
    gitBlobSha: 'cf4412a145c12cdc27e7dfdcec7e030f8d4e4da1',
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_EXACT_CARRIER_BRANCH_HEAD_AND_GIT_BLOB',
    occurrenceClass: 'HC02_PAGE_EXCELLENCE_EXECUTION_EVIDENCE_CARRIER_V2'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_MAIN,
    commitSha: GOVERNING_MAIN,
    path: INDEX_CSS_PATH,
    gitBlobSha: 'f208b7f11096a7bf5da282226903ac634c1eab01',
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_PRESENT_AT_GOVERNING_MAIN',
    occurrenceClass: 'HC02_FUTURE_PRESENTATION_HOST_PATH_RESOLUTION'
  }),
  deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_MAIN,
    commitSha: GOVERNING_MAIN,
    path: AMENDMENT_PATH,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_REGISTRY_PREREQUISITE',
    occurrenceClass: 'AUTHORIZED_REGISTRY_PREREQUISITE_NOT_YET_MATERIALIZED_AT_GOVERNING_MAIN'
  })
]);

export const H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_EVIDENCE_V2 = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'AUTHORIZED_CANDIDATE_PATH_SCOPE_WITH_TRUTHFUL_OCCURRENCE_STATE',
  sourceKind: 'CANONICAL_OPERATION_LOCK_AND_EXACT_REPOSITORY_OCCURRENCE_REGISTRATION',
  sourceIdOrPath: 'ISSUE_781',
  sourceOccurrenceOrRevision:
    `MAIN=${GOVERNING_MAIN};CARRIER_HEAD=${CARRIER_HEAD};TEMP_LOCK=${TEMP_EXECUTION_LOCK_GENERATION};REGISTRY_LOCK=${REGISTRY_PREREQUISITE_LOCK_GENERATION};TARGETS=3`,
  governingMain: GOVERNING_MAIN,
  carrierBranch: CARRIER_BRANCH,
  carrierHead: CARRIER_HEAD,
  temporaryExecutionLockGeneration: TEMP_EXECUTION_LOCK_GENERATION,
  registryPrerequisiteLockGeneration: REGISTRY_PREREQUISITE_LOCK_GENERATION,
  scopeHash: REGISTRY_SCOPE_HASH,
  exactTargetPathCount: 3,
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope: Object.freeze([
    'EXACT_TWO_PAGE_EXCELLENCE_EXECUTION_CARRIER_PATHS_V2',
    'INDEX_CSS_FUTURE_HC02_PRESENTATION_HOST_PATH',
    'EXACT_CARRIER_BLOB_IDENTITIES',
    'INDEX_HTML_PREDECESSOR_REGISTRATION_PRESERVED',
    'NO_PRODUCT_BYTE_MUTATION'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PRODUCT_MUTATION_AUTHORITY',
    'NO_HC02_ADMISSION_AUTHORITY',
    'NO_UNBOXING_AUTHORITY',
    'NO_RUNTIME_RENDERER_TERRAIN_WATER_CAMERA_OR_NAVIGATION_MUTATION',
    'NO_DEPLOYMENT_OR_RELEASE_AUTHORITY'
  ])
});

export const H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2 = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'AUTHORIZED_NONPRODUCT_EVIDENCE_CARRIER_AND_PRESENTATION_HOST_PATH_SCOPE',
  displayName: 'H-Earth HC02 Page Excellence Execution Carrier Scope V2',
  description: 'Registers exactly the two V2 nonproduct Page Excellence execution carrier paths and the HC02 index.css presentation-host path for internal H-Earth registry resolution only.',
  parentScope: PARENT_NODE_ID,
  parentScopeNodeId: PARENT_NODE_ID,
  repositoryPaths: [...H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_AUTHORIZED_PATHS_V2],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_EVIDENCE_V2.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUTHORIZED_CANDIDATE_SCOPE_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  authoritySource: Object.freeze([
    'USER_EXPLICIT_HC02_AUTHORIZATION_SEQUENCE',
    `TEMP_EXECUTION_LOCK_GENERATION_${TEMP_EXECUTION_LOCK_GENERATION}`,
    `REGISTRY_PREREQUISITE_LOCK_GENERATION_${REGISTRY_PREREQUISITE_LOCK_GENERATION}`
  ]),
  authorityScope: Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'TRUTHFUL_OCCURRENCE_RESOLUTION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PRODUCT_MUTATION',
    'NO_HC02_ADMISSION',
    'NO_UNBOXING',
    'NO_RUNTIME_RENDERER_TERRAIN_WATER_CAMERA_OR_NAVIGATION_MUTATION',
    'NO_DEPLOYMENT_RELEASE_OR_PUBLICATION'
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
    'INTERNAL_REGISTRY_PATH_RESOLUTION_BEFORE_PAGE_EXCELLENCE_CARRIER_EXECUTION',
    'PAGE_EXCELLENCE_ARCHITECTURE_PASS_BEFORE_HC02_REPOSITORY_ADMISSION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  prohibitedMutations: Object.freeze([
    'PRODUCT_PATH_MUTATION_FROM_REGISTRY_AUTHORITY',
    'HC02_ADMISSION_FROM_REGISTRY_AUTHORITY',
    'UNBOXING_FROM_REGISTRY_AUTHORITY'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_THREE_TARGET_PATHS',
    'EXACT_TWO_CARRIER_BLOBS',
    'INDEX_CSS_GOVERNING_MAIN_BLOB',
    'AMENDMENT_SELF_PATH_TRUTHFULLY_ABSENT_AT_GOVERNING_MAIN',
    'INDEX_HTML_PREDECESSOR_REGISTRATION_REMAINS_RESOLVED',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_PATH_OUTSIDE_EXACT_SCOPE',
    'STOP_ON_CARRIER_BLOB_DRIFT',
    'STOP_ON_INDEX_CSS_BLOB_DRIFT',
    'STOP_ON_INDEX_HTML_PREDECESSOR_REGRESSION',
    'STOP_BEFORE_PRODUCT_MUTATION_OR_HC02_ADMISSION'
  ]),
  currentIdentityReferences: Object.freeze([
    GOVERNING_MAIN,
    CARRIER_HEAD,
    `TEMP_EXECUTION_LOCK=${TEMP_EXECUTION_LOCK_GENERATION}`,
    `REGISTRY_PREREQUISITE_LOCK=${REGISTRY_PREREQUISITE_LOCK_GENERATION}`
  ]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_AUTHORIZED_PATHS_V2.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2]),
      occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
    })
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const parentNode = baseFacade.getHEarthRepositoryRegistryNode(PARENT_NODE_ID);
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...(baseInstance.evidenceRecords ?? []),
    H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_EVIDENCE_V2
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2
  ]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_EVIDENCE_V2
    : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
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
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES
    .filter((entry) => {
      if (normalizedPath != null && entry.path !== normalizedPath) return false;
      if (input.refType != null && entry.refType !== input.refType) return false;
      if (input.refName != null && entry.refName !== input.refName) return false;
      if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
      if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
      if (input.existenceStatus != null && entry.existenceStatus !== input.existenceStatus) return false;
      return true;
    })
    .map((occurrence) => deepFreeze({
      nodeId: NODE_ID,
      node: H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2,
      occurrence
    }));
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
  const node = H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2;
  const normalizedRepositoryPath = criteria.repositoryPath == null
    ? null
    : normalizePath(criteria.repositoryPath);
  const matches =
    (normalizedRepositoryPath == null || node.repositoryPaths.includes(normalizedRepositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
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
      nodes: [parentNode, H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2].filter(Boolean),
      relations: [],
      resolved: true
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthHC02PageExcellenceExecutionCarrierScopeV2() {
  const pathChecks = H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_AUTHORIZED_PATHS_V2.map((repositoryPath) => {
    const expected = OCCURRENCES.find((entry) => entry.path === repositoryPath);
    const resolution = resolveHEarthRepositoryRegistryPath(repositoryPath);
    const occurrence = (resolution.occurrences ?? []).find((entry) =>
      entry.path === expected.path &&
      entry.commitSha === expected.commitSha &&
      entry.gitBlobSha === expected.gitBlobSha &&
      entry.existenceStatus === expected.existenceStatus
    );
    return deepFreeze({
      repositoryPath,
      resolved: resolution.resolved === true,
      occurrenceMatched: occurrence != null,
      pass: resolution.resolved === true && occurrence != null
    });
  });
  const predecessorIndexHtml = baseFacade.resolveHEarthRepositoryRegistryPath(INDEX_HTML_PATH);
  const checks = deepFreeze({
    exactFourRegisteredPathsIncludingSelf: H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_AUTHORIZED_PATHS_V2.length === 4,
    exactThreeTargetPaths: H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_EVIDENCE_V2.exactTargetPathCount === 3,
    allRegisteredPathsResolve: pathChecks.every((entry) => entry.pass),
    exactCarrierHead: CARRIER_HEAD === '0a2c4b39fe161f713b0b29220be549b69434f882',
    exactTemporaryExecutionLock: TEMP_EXECUTION_LOCK_GENERATION === 651,
    exactRegistryPrerequisiteLock: REGISTRY_PREREQUISITE_LOCK_GENERATION === 652,
    indexHtmlPredecessorRegistrationPreserved: predecessorIndexHtml.resolved === true,
    noProductAuthority: H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2.authorityLimitations.includes('NO_PRODUCT_MUTATION'),
    noHC02AdmissionAuthority: H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2.authorityLimitations.includes('NO_HC02_ADMISSION'),
    noUnboxingAuthority: H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_NODE_V2.authorityLimitations.includes('NO_UNBOXING')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status: eligible
      ? 'H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_V2_PASS'
      : 'H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_V2_FAIL',
    checks,
    pathChecks
  });
}

export const H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_FACADE_V2 = deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  verifyHEarthHC02PageExcellenceExecutionCarrierScopeV2
});

export default H_EARTH_HC02_PAGE_EXCELLENCE_EXECUTION_CARRIER_SCOPE_FACADE_V2;
