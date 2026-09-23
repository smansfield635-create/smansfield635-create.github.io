/**
 * /h-earth-3d/registry/h-earth.repository-registry.js
 *
 * Read-only consumer facade for the installed H-Earth repository-registry
 * candidate. It exposes deterministic discovery, indexing, graph, lifecycle,
 * custody, evidence, authority, validation, mutation-boundary, and stopping-
 * boundary projections without creating source, mutation, merge, runtime,
 * renderer, route, validation-enforcement, production, or canonical authority.
 */

import {
  H_EARTH_REPOSITORY_REGISTRY_TARGET_2_IDENTITY,
  H_EARTH_REPOSITORY_REGISTRY_TARGET_2_BOUNDARY,
  H_EARTH_REPOSITORY_REGISTRY_SCHEMA,
  H_EARTH_REPOSITORY_REGISTRY_SEMANTIC_CONSTRAINTS,
  H_EARTH_REPOSITORY_REGISTRY_SEMANTIC_RULE_CATALOG,
  H_EARTH_REPOSITORY_REGISTRY_FAILURE_FIXTURES,
  H_EARTH_REPOSITORY_REGISTRY_FIXTURE_EXECUTION_RECEIPT,
  H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_INSTANCE,
  H_EARTH_REPOSITORY_REGISTRY_TARGET_2_ACCEPTANCE_TEST,
  H_EARTH_REPOSITORY_REGISTRY_TARGET_2_PACKAGE
} from './h-earth.repository-registry.candidate.js';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) deepFreeze(value[key], seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function freezeArray(values) {
  return Object.freeze([...values]);
}

function freezeRecord(value) {
  return deepFreeze({ ...value });
}

function exactString(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value;
}

function arrayOfExactStrings(value) {
  return Array.isArray(value) && value.every(exactString);
}

function indexMany(map, key, value) {
  if (!exactString(key)) return;
  const values = map.get(key) ?? [];
  values.push(value);
  map.set(key, values);
}

const INSTANCE = H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_INSTANCE;
const NODES = INSTANCE.nodes;
const RELATIONS = INSTANCE.relations;
const EVIDENCE = INSTANCE.evidenceRecords;

const NODE_BY_ID = new Map(NODES.map((node) => [node.nodeId, node]));
const RELATION_BY_ID = new Map(RELATIONS.map((relation) => [relation.relationId, relation]));
const EVIDENCE_BY_ID = new Map(EVIDENCE.map((record) => [record.evidenceId, record]));

const NODES_BY_PATH = new Map();
const NODES_BY_TYPE = new Map();
const NODES_BY_SUBTYPE = new Map();
const NODES_BY_AUTHORITY = new Map();
const NODES_BY_CARDINAL_ROLE = new Map();
const NODES_BY_LIFECYCLE = new Map();
const RELATIONS_BY_TYPE = new Map();
const OUTGOING_RELATIONS = new Map();
const INCOMING_RELATIONS = new Map();

for (const node of NODES) {
  for (const path of node.repositoryPaths ?? EMPTY_FROZEN_ARRAY) indexMany(NODES_BY_PATH, path, node);
  indexMany(NODES_BY_TYPE, node.nodeType, node);
  indexMany(NODES_BY_SUBTYPE, node.nodeSubtype, node);
  indexMany(NODES_BY_AUTHORITY, node.authorityClass, node);
  indexMany(NODES_BY_CARDINAL_ROLE, node.cardinalRole, node);
  indexMany(NODES_BY_LIFECYCLE, node.lifecycleStatus, node);
}

for (const relation of RELATIONS) {
  indexMany(RELATIONS_BY_TYPE, relation.relationType, relation);
  indexMany(OUTGOING_RELATIONS, relation.fromNodeId, relation);
  indexMany(INCOMING_RELATIONS, relation.toNodeId, relation);
}

for (const map of [
  NODES_BY_PATH,
  NODES_BY_TYPE,
  NODES_BY_SUBTYPE,
  NODES_BY_AUTHORITY,
  NODES_BY_CARDINAL_ROLE,
  NODES_BY_LIFECYCLE,
  RELATIONS_BY_TYPE,
  OUTGOING_RELATIONS,
  INCOMING_RELATIONS
]) {
  for (const [key, values] of map.entries()) map.set(key, freezeArray(values));
}

export const H_EARTH_REPOSITORY_REGISTRY_CONSUMER_FACADE_ID =
  'H_EARTH_REPOSITORY_REGISTRY_READ_ONLY_CONSUMER_FACADE_v1';

export const H_EARTH_REPOSITORY_REGISTRY_STABLE_CANDIDATE_PATH =
  '/h-earth-3d/registry/h-earth.repository-registry.candidate.js';

export const H_EARTH_REPOSITORY_REGISTRY_STABLE_FACADE_PATH =
  '/h-earth-3d/registry/h-earth.repository-registry.js';

export const H_EARTH_REPOSITORY_REGISTRY_BOOTSTRAP_PATH =
  '/h-earth-3d/registry/h-earth.repository-registry.bootstrap.json';

export const H_EARTH_REPOSITORY_REGISTRY_CONSUMER_BOUNDARY = deepFreeze({
  registryRole: 'READ_ONLY_DISCOVERY_QUERY_GRAPH_AND_OPERATION_SCOPE_PROJECTION',
  candidateInstalled: true,
  candidateAccepted: false,
  canonicalRegistryCreated: false,
  acceptedRegistryOccurrenceCreated: false,
  sourceAuthorityCreated: false,
  sourceAuthorityTransferred: false,
  mutationAuthorityCreated: false,
  mergeAuthorityCreated: false,
  workflowEnforcementCreated: false,
  validatorEnforcementCreated: false,
  runtimeActivationCreated: false,
  rendererActivationCreated: false,
  routeActivationCreated: false,
  productionClaimCreated: false,
  toolInferenceIsEvidence: false,
  unresolvedFieldsMayBeInvented: false,
  readOnlyDiscoveryPermitted: true,
  explicitOptInRequiredWhileCandidate: true
});

export const H_EARTH_REPOSITORY_REGISTRY_QUERY_CAPABILITIES = deepFreeze({
  identity: true,
  schema: true,
  nodes: true,
  relations: true,
  evidence: true,
  repositoryOccurrences: true,
  repositoryPaths: true,
  authorityClasses: true,
  cardinalRoles: true,
  compositeMembership: true,
  graphNeighborhood: true,
  dependencyClosure: true,
  lifecycleProjection: true,
  unresolvedFields: true,
  requiredValidations: true,
  mutationBoundaries: true,
  stoppingBoundaries: true,
  operationScopeEvaluation: true,
  cryptographicValidation: false,
  mutationExecution: false,
  mergeDecision: false
});

export const H_EARTH_REPOSITORY_REGISTRY_DISCOVERY_DESCRIPTOR = deepFreeze({
  descriptorId: 'H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_DISCOVERY_DESCRIPTOR_v1',
  project: 'H_EARTH',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  scopeId: INSTANCE.scope.scopeId,
  registryId: INSTANCE.registryId,
  registryVersion: INSTANCE.registryVersion,
  schemaId: INSTANCE.schemaId,
  schemaVersion: INSTANCE.schemaVersion,
  status: 'INSTALLED_CANDIDATE_NOT_ACCEPTED',
  accepted: false,
  canonical: false,
  controlsRepositoryScope: false,
  bootstrapPath: H_EARTH_REPOSITORY_REGISTRY_BOOTSTRAP_PATH,
  candidatePath: H_EARTH_REPOSITORY_REGISTRY_STABLE_CANDIDATE_PATH,
  facadePath: H_EARTH_REPOSITORY_REGISTRY_STABLE_FACADE_PATH,
  candidateByteCount: 140320,
  candidateContentSha256:
    '5c71aba5ff60f7d8838fa4571ec18e72eafe04f01130ad146de4376279735dfe',
  candidateGitBlobSha: '10ab7b203e03fde419e526d0cce2c0af42860911',
  toolUseMode: 'EXPLICIT_OPT_IN_READ_ONLY',
  queryCapabilities: H_EARTH_REPOSITORY_REGISTRY_QUERY_CAPABILITIES,
  boundary: H_EARTH_REPOSITORY_REGISTRY_CONSUMER_BOUNDARY
});

export function getHEarthRepositoryRegistryPackage() {
  return H_EARTH_REPOSITORY_REGISTRY_TARGET_2_PACKAGE;
}

export function getHEarthRepositoryRegistryInstance() {
  return INSTANCE;
}

export function getHEarthRepositoryRegistrySchema() {
  return H_EARTH_REPOSITORY_REGISTRY_SCHEMA;
}

export function getHEarthRepositoryRegistryDiscoveryDescriptor() {
  return H_EARTH_REPOSITORY_REGISTRY_DISCOVERY_DESCRIPTOR;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return NODE_BY_ID.get(nodeId) ?? null;
}

export function getHEarthRepositoryRegistryRelation(relationId) {
  return RELATION_BY_ID.get(relationId) ?? null;
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return EVIDENCE_BY_ID.get(evidenceId) ?? null;
}

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const nodes = NODES_BY_PATH.get(repositoryPath) ?? EMPTY_FROZEN_ARRAY;
  const occurrences = [];
  for (const node of nodes) {
    for (const occurrence of node.repositoryOccurrences ?? EMPTY_FROZEN_ARRAY) {
      if (occurrence.path === repositoryPath) occurrences.push(occurrence);
    }
  }
  return deepFreeze({
    repositoryPath,
    resolved: nodes.length > 0,
    nodes: freezeArray(nodes),
    occurrences: freezeArray(occurrences),
    unresolved: nodes.length === 0
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const {
    path = null,
    commitSha = null,
    gitBlobSha = null,
    refName = null
  } = input;
  const matches = [];
  for (const node of NODES) {
    for (const occurrence of node.repositoryOccurrences ?? EMPTY_FROZEN_ARRAY) {
      if (path !== null && occurrence.path !== path) continue;
      if (commitSha !== null && occurrence.commitSha !== commitSha) continue;
      if (gitBlobSha !== null && occurrence.gitBlobSha !== gitBlobSha) continue;
      if (refName !== null && occurrence.refName !== refName) continue;
      matches.push(deepFreeze({ nodeId: node.nodeId, node, occurrence }));
    }
  }
  return deepFreeze({
    query: deepFreeze({ path, commitSha, gitBlobSha, refName }),
    matches: freezeArray(matches),
    resolved: matches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const {
    nodeType = null,
    nodeSubtype = null,
    authorityClass = null,
    cardinalRole = null,
    lifecycleStatus = null,
    repositoryPath = null,
    hasUnresolvedFields = null,
    text = null
  } = criteria;
  const normalizedText = typeof text === 'string' ? text.toLowerCase() : null;
  return freezeArray(NODES.filter((node) => {
    if (nodeType !== null && node.nodeType !== nodeType) return false;
    if (nodeSubtype !== null && node.nodeSubtype !== nodeSubtype) return false;
    if (authorityClass !== null && node.authorityClass !== authorityClass) return false;
    if (cardinalRole !== null && node.cardinalRole !== cardinalRole) return false;
    if (lifecycleStatus !== null && node.lifecycleStatus !== lifecycleStatus) return false;
    if (repositoryPath !== null && !(node.repositoryPaths ?? []).includes(repositoryPath)) return false;
    if (hasUnresolvedFields !== null) {
      const present = (node.unresolvedFields ?? []).length > 0;
      if (present !== hasUnresolvedFields) return false;
    }
    if (normalizedText !== null) {
      const haystack = [
        node.nodeId,
        node.displayName,
        node.description,
        node.authorityPosture,
        ...(node.repositoryPaths ?? []),
        ...(node.currentIdentityReferences ?? [])
      ].join('\n').toLowerCase();
      if (!haystack.includes(normalizedText)) return false;
    }
    return true;
  }));
}

export function findHEarthRepositoryRegistryRelations(criteria = {}) {
  const {
    relationType = null,
    fromNodeId = null,
    toNodeId = null,
    scale = null,
    lifecycleStatus = null,
    roleWithinComposite = null
  } = criteria;
  return freezeArray(RELATIONS.filter((relation) => {
    if (relationType !== null && relation.relationType !== relationType) return false;
    if (fromNodeId !== null && relation.fromNodeId !== fromNodeId) return false;
    if (toNodeId !== null && relation.toNodeId !== toNodeId) return false;
    if (scale !== null && relation.scale !== scale) return false;
    if (lifecycleStatus !== null && relation.lifecycleStatus !== lifecycleStatus) return false;
    if (roleWithinComposite !== null && relation.roleWithinComposite !== roleWithinComposite) return false;
    return true;
  }));
}

export function getHEarthRepositoryRegistryRelationsForNode(
  nodeId,
  direction = 'BOTH'
) {
  const outgoing = OUTGOING_RELATIONS.get(nodeId) ?? EMPTY_FROZEN_ARRAY;
  const incoming = INCOMING_RELATIONS.get(nodeId) ?? EMPTY_FROZEN_ARRAY;
  if (direction === 'OUTGOING') return outgoing;
  if (direction === 'INCOMING') return incoming;
  return freezeArray([...outgoing, ...incoming]);
}

export function getHEarthRepositoryRegistryNeighborhood(
  nodeId,
  options = {}
) {
  const depth = Number.isInteger(options.depth) && options.depth >= 0
    ? options.depth
    : 1;
  const relationTypes = Array.isArray(options.relationTypes)
    ? new Set(options.relationTypes)
    : null;
  if (!NODE_BY_ID.has(nodeId)) {
    return deepFreeze({ nodeId, depth, nodes: EMPTY_FROZEN_ARRAY, relations: EMPTY_FROZEN_ARRAY, unresolved: true });
  }

  const visitedNodes = new Set([nodeId]);
  const visitedRelations = new Set();
  let frontier = new Set([nodeId]);

  for (let level = 0; level < depth; level += 1) {
    const next = new Set();
    for (const currentNodeId of frontier) {
      for (const relation of getHEarthRepositoryRegistryRelationsForNode(currentNodeId)) {
        if (relationTypes && !relationTypes.has(relation.relationType)) continue;
        visitedRelations.add(relation.relationId);
        for (const adjacent of [relation.fromNodeId, relation.toNodeId]) {
          if (!visitedNodes.has(adjacent)) {
            visitedNodes.add(adjacent);
            next.add(adjacent);
          }
        }
      }
    }
    frontier = next;
    if (frontier.size === 0) break;
  }

  return deepFreeze({
    nodeId,
    depth,
    nodes: freezeArray([...visitedNodes].map((id) => NODE_BY_ID.get(id)).filter(Boolean)),
    relations: freezeArray([...visitedRelations].map((id) => RELATION_BY_ID.get(id)).filter(Boolean)),
    unresolved: false
  });
}

export function getHEarthRepositoryRegistryCompositeMembership(nodeId) {
  const containing = [];
  const members = [];
  for (const relation of RELATIONS) {
    if (!['CONTAINS', 'MEMBER_OF'].includes(relation.relationType)) continue;
    if (relation.toNodeId === nodeId) containing.push(relation);
    if (relation.fromNodeId === nodeId) members.push(relation);
  }
  return deepFreeze({
    nodeId,
    containingRelations: freezeArray(containing),
    memberRelations: freezeArray(members),
    containingUnits: freezeArray(containing.map((relation) => NODE_BY_ID.get(relation.fromNodeId)).filter(Boolean)),
    members: freezeArray(members.map((relation) => NODE_BY_ID.get(relation.toNodeId)).filter(Boolean))
  });
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  if (!NODE_BY_ID.has(nodeId)) {
    return deepFreeze({ nodeId, nodes: EMPTY_FROZEN_ARRAY, relations: EMPTY_FROZEN_ARRAY, unresolved: true });
  }
  const dependencyTypes = new Set(['DEPENDS_ON', 'CONSUMES', 'RESOLVES_INTO', 'ADMITS_INTO', 'TRANSFERS_TO', 'CONTINUES_TO']);
  const visitedNodes = new Set([nodeId]);
  const visitedRelations = new Set();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const relation of OUTGOING_RELATIONS.get(current) ?? EMPTY_FROZEN_ARRAY) {
      if (!dependencyTypes.has(relation.relationType)) continue;
      visitedRelations.add(relation.relationId);
      if (!visitedNodes.has(relation.toNodeId)) {
        visitedNodes.add(relation.toNodeId);
        queue.push(relation.toNodeId);
      }
    }
  }
  return deepFreeze({
    nodeId,
    nodes: freezeArray([...visitedNodes].map((id) => NODE_BY_ID.get(id)).filter(Boolean)),
    relations: freezeArray([...visitedRelations].map((id) => RELATION_BY_ID.get(id)).filter(Boolean)),
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryLifecycle(input = {}) {
  const nodeIds = new Set();
  if (exactString(input.nodeId) && NODE_BY_ID.has(input.nodeId)) nodeIds.add(input.nodeId);
  if (exactString(input.path)) {
    for (const node of NODES_BY_PATH.get(input.path) ?? EMPTY_FROZEN_ARRAY) nodeIds.add(node.nodeId);
  }
  const nodes = [...nodeIds].map((id) => NODE_BY_ID.get(id)).filter(Boolean);
  return deepFreeze({
    query: deepFreeze({ nodeId: input.nodeId ?? null, path: input.path ?? null }),
    registryLifecycle: INSTANCE.status,
    candidateAccepted: INSTANCE.accepted,
    nodes: freezeArray(nodes.map((node) => deepFreeze({
      nodeId: node.nodeId,
      lifecycleStatus: node.lifecycleStatus,
      cardinalStatus: node.cardinalStatus,
      cardinalCompleteness: node.cardinalCompleteness,
      unresolvedFields: node.unresolvedFields,
      repositoryOccurrences: node.repositoryOccurrences
    }))),
    resolved: nodes.length > 0
  });
}

function collectEvidenceForNodesAndRelations(nodes, relations) {
  const evidenceIds = new Set();
  for (const node of nodes) for (const id of node.evidenceReferences ?? EMPTY_FROZEN_ARRAY) evidenceIds.add(id);
  for (const relation of relations) for (const id of relation.evidenceReferences ?? EMPTY_FROZEN_ARRAY) evidenceIds.add(id);
  return [...evidenceIds].map((id) => EVIDENCE_BY_ID.get(id)).filter(Boolean);
}

export function buildHEarthRepositoryArchitectureSnapshot(input = {}) {
  const seedNodeIds = new Set();
  for (const nodeId of input.nodeIds ?? EMPTY_FROZEN_ARRAY) {
    if (NODE_BY_ID.has(nodeId)) seedNodeIds.add(nodeId);
  }
  for (const path of input.paths ?? EMPTY_FROZEN_ARRAY) {
    for (const node of NODES_BY_PATH.get(path) ?? EMPTY_FROZEN_ARRAY) seedNodeIds.add(node.nodeId);
  }
  for (const relationId of input.relationIds ?? EMPTY_FROZEN_ARRAY) {
    const relation = RELATION_BY_ID.get(relationId);
    if (relation) {
      seedNodeIds.add(relation.fromNodeId);
      seedNodeIds.add(relation.toNodeId);
    }
  }
  if (seedNodeIds.size === 0 && NODE_BY_ID.has(INSTANCE.scope.scopeId)) {
    seedNodeIds.add(INSTANCE.scope.scopeId);
  }

  const depth = Number.isInteger(input.includeNeighborhoodDepth) && input.includeNeighborhoodDepth >= 0
    ? input.includeNeighborhoodDepth
    : 1;
  const selectedNodeIds = new Set(seedNodeIds);
  const selectedRelationIds = new Set();

  for (const seedNodeId of seedNodeIds) {
    const neighborhood = getHEarthRepositoryRegistryNeighborhood(seedNodeId, { depth });
    for (const node of neighborhood.nodes) selectedNodeIds.add(node.nodeId);
    for (const relation of neighborhood.relations) selectedRelationIds.add(relation.relationId);
  }

  for (const relationId of input.relationIds ?? EMPTY_FROZEN_ARRAY) {
    if (RELATION_BY_ID.has(relationId)) selectedRelationIds.add(relationId);
  }

  const nodes = [...selectedNodeIds].map((id) => NODE_BY_ID.get(id)).filter(Boolean);
  const relations = [...selectedRelationIds].map((id) => RELATION_BY_ID.get(id)).filter(Boolean);
  const evidence = collectEvidenceForNodesAndRelations(nodes, relations);
  const compositeUnits = nodes.filter((node) => node.nodeType === 'COMPOSITE_UNIT');
  const unresolved = nodes.flatMap((node) =>
    (node.unresolvedFields ?? EMPTY_FROZEN_ARRAY).map((field) =>
      deepFreeze({ nodeId: node.nodeId, field })
    )
  );

  return deepFreeze({
    snapshotId: 'H_EARTH_REPOSITORY_ARCHITECTURE_SNAPSHOT_v1',
    registryIdentity: H_EARTH_REPOSITORY_REGISTRY_TARGET_2_IDENTITY,
    scope: INSTANCE.scope,
    status: INSTANCE.status,
    accepted: INSTANCE.accepted,
    seeds: freezeArray([...seedNodeIds]),
    layers: deepFreeze({
      identityAndCustody: freezeArray(nodes.map((node) => deepFreeze({
        nodeId: node.nodeId,
        repositoryPaths: node.repositoryPaths,
        repositoryOccurrences: node.repositoryOccurrences,
        currentIdentityReferences: node.currentIdentityReferences
      }))),
      authority: freezeArray(nodes.map((node) => deepFreeze({
        nodeId: node.nodeId,
        authorityClass: node.authorityClass,
        authorityPosture: node.authorityPosture,
        authoritySource: node.authoritySource,
        authorityScope: node.authorityScope,
        authorityLimitations: node.authorityLimitations
      }))),
      topologyAndContinuity: relations,
      evidence,
      lifecycle: freezeArray(nodes.map((node) => deepFreeze({
        nodeId: node.nodeId,
        lifecycleStatus: node.lifecycleStatus,
        cardinalRole: node.cardinalRole,
        cardinalStatus: node.cardinalStatus,
        cardinalCompleteness: node.cardinalCompleteness
      }))),
      mutationAndStopping: freezeArray(nodes.map((node) => deepFreeze({
        nodeId: node.nodeId,
        allowedMutationScope: node.allowedMutationScope,
        prohibitedMutations: node.prohibitedMutations,
        requiredValidations: node.requiredValidations,
        stoppingBoundaries: node.stoppingBoundaries
      }))),
      unresolved: freezeArray(unresolved)
    }),
    nodes: freezeArray(nodes),
    relations: freezeArray(relations),
    evidence: freezeArray(evidence),
    compositeUnits: freezeArray(compositeUnits),
    unresolved: freezeArray(unresolved)
  });
}

export function evaluateHEarthRepositoryRegistryOperation(input = {}) {
  const snapshot = buildHEarthRepositoryArchitectureSnapshot(input);
  const mutationRequested = input.mutationRequested === true;
  const requestedMutationScope = input.requestedMutationScope ?? 'READ_ONLY_INSPECTION';
  const affectedNodes = snapshot.nodes;
  const affectedRelations = snapshot.relations;
  const withheldNodes = affectedNodes.filter((node) => node.allowedMutationScope === 'WITHHELD');
  const stoppingBoundaries = [...new Set(affectedNodes.flatMap((node) => node.stoppingBoundaries ?? EMPTY_FROZEN_ARRAY))].sort();
  const requiredValidations = [...new Set(affectedNodes.flatMap((node) => node.requiredValidations ?? EMPTY_FROZEN_ARRAY))].sort();
  const prohibitedMutations = [...new Set(affectedNodes.flatMap((node) => node.prohibitedMutations ?? EMPTY_FROZEN_ARRAY))].sort();
  const issues = [];

  if (affectedNodes.length === 0) issues.push('REGISTRY_OPERATION_SCOPE_UNRESOLVED');
  if (mutationRequested) issues.push('REGISTRY_DOES_NOT_AUTHORIZE_MUTATION');
  if (mutationRequested && withheldNodes.length > 0) issues.push('AFFECTED_NODE_MUTATION_SCOPE_WITHHELD');
  if (requestedMutationScope !== 'READ_ONLY_INSPECTION' && mutationRequested === false) {
    issues.push('NON_READ_ONLY_SCOPE_REQUIRES_EXPLICIT_MUTATION_REQUEST');
  }

  return deepFreeze({
    operationId: input.operationId ?? 'UNSPECIFIED_OPERATION',
    registryId: INSTANCE.registryId,
    registryVersion: INSTANCE.registryVersion,
    registryStatus: INSTANCE.status,
    registryAccepted: INSTANCE.accepted,
    candidateUseMode: 'EXPLICIT_OPT_IN_READ_ONLY',
    requestedMutationScope,
    mutationRequested,
    mutationAuthorized: false,
    mergeAuthorized: false,
    operationPermitted: !mutationRequested && affectedNodes.length > 0,
    stoppingRequired: mutationRequested || affectedNodes.length === 0,
    affectedNodeIds: freezeArray(affectedNodes.map((node) => node.nodeId)),
    affectedRelationIds: freezeArray(affectedRelations.map((relation) => relation.relationId)),
    affectedCompositeUnitIds: freezeArray(snapshot.compositeUnits.map((node) => node.nodeId)),
    requiredValidations: freezeArray(requiredValidations),
    prohibitedMutations: freezeArray(prohibitedMutations),
    stoppingBoundaries: freezeArray(stoppingBoundaries),
    unresolved: snapshot.unresolved,
    issues: freezeArray(issues),
    snapshot
  });
}

function detectContainmentCycle() {
  const adjacency = new Map();
  for (const relation of RELATIONS) {
    if (!['CONTAINS', 'MEMBER_OF'].includes(relation.relationType)) continue;
    const values = adjacency.get(relation.fromNodeId) ?? [];
    values.push(relation.toNodeId);
    adjacency.set(relation.fromNodeId, values);
  }
  const visiting = new Set();
  const visited = new Set();
  const visit = (nodeId) => {
    if (visiting.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visiting.add(nodeId);
    for (const adjacent of adjacency.get(nodeId) ?? EMPTY_FROZEN_ARRAY) {
      if (visit(adjacent)) return true;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  };
  return NODES.some((node) => visit(node.nodeId));
}

export function auditHEarthRepositoryRegistryStructure() {
  const issues = [];
  const nodeIds = NODES.map((node) => node.nodeId);
  const relationIds = RELATIONS.map((relation) => relation.relationId);
  const evidenceIds = EVIDENCE.map((record) => record.evidenceId);

  if (new Set(nodeIds).size !== nodeIds.length) issues.push('DUPLICATE_NODE_ID');
  if (new Set(relationIds).size !== relationIds.length) issues.push('DUPLICATE_RELATION_ID');
  if (new Set(evidenceIds).size !== evidenceIds.length) issues.push('DUPLICATE_EVIDENCE_ID');

  for (const relation of RELATIONS) {
    if (!NODE_BY_ID.has(relation.fromNodeId) || !NODE_BY_ID.has(relation.toNodeId)) {
      issues.push(`BROKEN_RELATION_ENDPOINT:${relation.relationId}`);
    }
    for (const evidenceId of relation.evidenceReferences ?? EMPTY_FROZEN_ARRAY) {
      if (!EVIDENCE_BY_ID.has(evidenceId)) issues.push(`BROKEN_EVIDENCE_REFERENCE:${relation.relationId}:${evidenceId}`);
    }
  }

  for (const node of NODES) {
    const declaredRelationIds = [
      ...(node.parentRelations ?? EMPTY_FROZEN_ARRAY),
      ...(node.childRelations ?? EMPTY_FROZEN_ARRAY),
      ...(node.peerRelations ?? EMPTY_FROZEN_ARRAY),
      ...(node.upstreamBoundaries ?? EMPTY_FROZEN_ARRAY),
      ...(node.downstreamBoundaries ?? EMPTY_FROZEN_ARRAY),
      ...(node.dependencyRelations ?? EMPTY_FROZEN_ARRAY)
    ];
    for (const relationId of declaredRelationIds) {
      if (!RELATION_BY_ID.has(relationId)) issues.push(`BROKEN_NODE_RELATION_REFERENCE:${node.nodeId}:${relationId}`);
    }
    for (const evidenceId of node.evidenceReferences ?? EMPTY_FROZEN_ARRAY) {
      if (!EVIDENCE_BY_ID.has(evidenceId)) issues.push(`BROKEN_NODE_EVIDENCE_REFERENCE:${node.nodeId}:${evidenceId}`);
    }
    if (!arrayOfExactStrings(node.stoppingBoundaries) || node.stoppingBoundaries.length === 0) {
      issues.push(`STOPPING_BOUNDARY_MISSING:${node.nodeId}`);
    }
    if (node.cardinalStatus === 'OBSERVED_CANDIDATE') {
      if (node.evidenceClass !== 'FUNCTIONALLY_INDICATED_CARDINAL_ROLE') {
        issues.push(`OBSERVED_ROLE_EVIDENCE_INVALID:${node.nodeId}`);
      }
      if (node.lifecycleStatus !== 'CANDIDATE') {
        issues.push(`OBSERVED_PROMOTED_WITHOUT_AUDIT:${node.nodeId}`);
      }
    }
  }

  if (detectContainmentCycle()) issues.push('CONTAINMENT_CYCLE');
  if (INSTANCE.accepted !== false) issues.push('CANDIDATE_ACCEPTANCE_OVERCLAIM');
  if (INSTANCE.status !== 'COMPLETE_CANDIDATE') issues.push('REGISTRY_STATUS_MISMATCH');
  const adapter = NODE_BY_ID.get('H_EARTH_GATE_B_WEST_ADAPTER_FILE');
  if (adapter?.authorityClass !== 'ORCHESTRATION_ONLY') issues.push('ORCHESTRATION_AUTHORITY_OVERCLAIM');

  const checks = deepFreeze({
    registryIdentityPresent: exactString(INSTANCE.registryId),
    registryVersionPresent: exactString(INSTANCE.registryVersion),
    schemaIdentityPresent: exactString(INSTANCE.schemaId) && Number.isInteger(INSTANCE.schemaVersion),
    nodeCount: NODES.length,
    relationCount: RELATIONS.length,
    evidenceCount: EVIDENCE.length,
    uniqueNodeIds: new Set(nodeIds).size === nodeIds.length,
    uniqueRelationIds: new Set(relationIds).size === relationIds.length,
    uniqueEvidenceIds: new Set(evidenceIds).size === evidenceIds.length,
    containmentAcyclic: !detectContainmentCycle(),
    adapterRemainsOrchestrationOnly: adapter?.authorityClass === 'ORCHESTRATION_ONLY',
    candidateNotAccepted: INSTANCE.accepted === false,
    candidateStatusPreserved: INSTANCE.status === 'COMPLETE_CANDIDATE',
    deeplyFrozen: Object.isFrozen(INSTANCE) && Object.isFrozen(NODES) && Object.isFrozen(RELATIONS)
  });

  return deepFreeze({
    auditId: 'H_EARTH_REPOSITORY_REGISTRY_STRUCTURE_AUDIT_v1',
    pass: issues.length === 0,
    issueCount: issues.length,
    issues: freezeArray(issues),
    checks
  });
}

export const H_EARTH_REPOSITORY_REGISTRY_CONSUMER_FACADE = deepFreeze({
  facadeId: H_EARTH_REPOSITORY_REGISTRY_CONSUMER_FACADE_ID,
  discovery: H_EARTH_REPOSITORY_REGISTRY_DISCOVERY_DESCRIPTOR,
  boundary: H_EARTH_REPOSITORY_REGISTRY_CONSUMER_BOUNDARY,
  queryCapabilities: H_EARTH_REPOSITORY_REGISTRY_QUERY_CAPABILITIES,
  target2Identity: H_EARTH_REPOSITORY_REGISTRY_TARGET_2_IDENTITY,
  target2Boundary: H_EARTH_REPOSITORY_REGISTRY_TARGET_2_BOUNDARY,
  schema: H_EARTH_REPOSITORY_REGISTRY_SCHEMA,
  semanticConstraints: H_EARTH_REPOSITORY_REGISTRY_SEMANTIC_CONSTRAINTS,
  semanticRuleCatalog: H_EARTH_REPOSITORY_REGISTRY_SEMANTIC_RULE_CATALOG,
  failureFixtures: H_EARTH_REPOSITORY_REGISTRY_FAILURE_FIXTURES,
  fixtureExecutionReceipt: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_EXECUTION_RECEIPT,
  acceptanceTest: H_EARTH_REPOSITORY_REGISTRY_TARGET_2_ACCEPTANCE_TEST,
  instance: INSTANCE,
  getHEarthRepositoryRegistryPackage,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistrySchema,
  getHEarthRepositoryRegistryDiscoveryDescriptor,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryRelation,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  findHEarthRepositoryRegistryRelations,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryNeighborhood,
  getHEarthRepositoryRegistryCompositeMembership,
  getHEarthRepositoryRegistryDependencyClosure,
  resolveHEarthRepositoryRegistryLifecycle,
  buildHEarthRepositoryArchitectureSnapshot,
  evaluateHEarthRepositoryRegistryOperation,
  auditHEarthRepositoryRegistryStructure
});

export default H_EARTH_REPOSITORY_REGISTRY_CONSUMER_FACADE;
