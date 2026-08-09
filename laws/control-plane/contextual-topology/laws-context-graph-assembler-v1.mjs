const CONTRACT = Object.freeze({
  schema: "LAWS_CONTEXT_GRAPH_CONTRACT_v1",
  version: "1.0.0",
  freezeCommit: "84cd86ff93e657af6c38b52cfc6525da594f01a7",
  blob: "240dbb7dca3db8f5a0a21e77d1aee91f1d21cb5a",
  topologyClass: "CONTEXT_CENTERED_DIRECT_RELATION_MULTIGRAPH"
});

const GAMMA = Object.freeze({
  schema: "LAWS_CONTEXTUAL_GAMMA_RESOLUTION_v1",
  subjectHead: "334ea9e0dfbe2d6866df871ec5f5da021d59d459",
  resolverBlob: "1d715884d71419ac25892da452ca7b6d21e6c909",
  verifierBlob: "e3a4aec42dc9d35c025fa4b004a91fbb59e2098d"
});

const RELATION_REGISTRY = Object.freeze({
  schema: "LAWS_CONTEXTUAL_RELATION_REGISTRY_v1",
  blob: "5d79eca4ee7d9366f8d8c2287c34001ae37ffc4e"
});

const ASSEMBLER = Object.freeze({
  schema: "LAWS_CONTEXT_GRAPH_ASSEMBLER_v1",
  version: "1.0.0"
});

const OUTCOMES = Object.freeze(new Set(["ASSERTED", "NONE", "UNKNOWN", "UNEVALUABLE", "CONFLICTED"]));
const REQUIRED_CONTEXT_FIELDS = Object.freeze(["objectIdentity", "contextScope", "authority", "version", "contextRevision"]);
const REQUIRED_OBJECT_FIELDS = Object.freeze(["identity", "objectClass", "authority", "version", "provenance"]);
const FORBIDDEN_AUTHORITY_FIELDS = Object.freeze(new Set([
  "x", "y", "z", "screenX", "screenY", "screenPosition", "projectedRadius", "depth", "depthLayer",
  "orbitRadius", "quaternion", "camera", "visualPriority", "visualScale", "color", "animation"
]));

const EDGE_FIELD_MAP = Object.freeze([
  ["RELATION_ID", "relationId"],
  ["RELATION_TYPE", "relationType"],
  ["FROM_OBJECT", "fromObject"],
  ["TO_OBJECT", "toObject"],
  ["RELATION_DEFINITION_VERSION", "relationDefinitionVersion"],
  ["AUTHORITY_POINTERS", "authorityPointers"],
  ["EVIDENCE_REFERENCES", "evidenceReferences"],
  ["CONTEXT_SCOPE", "contextScope"],
  ["TEMPORAL_SCOPE", "temporalScope"],
  ["QUALIFIERS", "qualifiers"],
  ["EXISTENCE_STATE", "existenceState"],
  ["SCIENTIFIC_STANDING", "scientificStanding"],
  ["CLAIM_CEILING", "claimCeiling"],
  ["SOURCE_OR_PROVENANCE", "sourceOrProvenance"],
  ["CURRENT_VERSION", "currentVersion"]
]);

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value ?? {}, key);
const present = (value) => Array.isArray(value)
  ? value.length > 0
  : value && typeof value === "object"
    ? Object.keys(value).length > 0
    : value !== undefined && value !== null && value !== "";

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function clone(value) {
  return value == null ? value : structuredClone(value);
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

function stableKey(value) {
  return JSON.stringify(canonicalize(value));
}

function stableEqual(a, b) {
  return stableKey(a) === stableKey(b);
}

function assertNoTopLevelGeometryAuthority(record, kind) {
  for (const field of Object.keys(record ?? {})) {
    if (FORBIDDEN_AUTHORITY_FIELDS.has(field)) {
      throw new ContextGraphAssemblyError("GEOMETRY_AUTHORITY_FIELD_FORBIDDEN", { kind, field });
    }
  }
}

export class ContextGraphAssemblyError extends Error {
  constructor(code, details = {}) {
    super(code);
    this.name = "ContextGraphAssemblyError";
    this.code = code;
    this.details = deepFreeze(canonicalize(clone(details)));
  }
}

function requireContextBinding(contextBinding) {
  if (!contextBinding || typeof contextBinding !== "object") {
    throw new ContextGraphAssemblyError("MISSING_OR_INVALID_CONTEXT_AUTHORITY", { reason: "CONTEXT_BINDING_NOT_OBJECT" });
  }
  const missing = REQUIRED_CONTEXT_FIELDS.filter((field) => !hasOwn(contextBinding, field) || !present(contextBinding[field]));
  if (missing.length) {
    throw new ContextGraphAssemblyError("MISSING_OR_INVALID_CONTEXT_AUTHORITY", { missing });
  }
  if (!Number.isInteger(contextBinding.contextRevision) || contextBinding.contextRevision < 0) {
    throw new ContextGraphAssemblyError("MISSING_OR_INVALID_CONTEXT_AUTHORITY", { reason: "CONTEXT_REVISION_NOT_NONNEGATIVE_INTEGER" });
  }
  assertNoTopLevelGeometryAuthority(contextBinding, "contextBinding");
  return canonicalize(clone(contextBinding));
}

function normalizeAdmittedObjects(admittedObjects) {
  if (!Array.isArray(admittedObjects)) {
    throw new ContextGraphAssemblyError("INVALID_ADMITTED_OBJECT_SET", { reason: "ADMITTED_OBJECTS_NOT_ARRAY" });
  }
  const index = new Map();
  for (const candidate of admittedObjects) {
    const missing = REQUIRED_OBJECT_FIELDS.filter((field) => !hasOwn(candidate, field) || !present(candidate[field]));
    if (missing.length) {
      throw new ContextGraphAssemblyError("INVALID_ADMITTED_OBJECT", { identity: candidate?.identity ?? null, missing });
    }
    assertNoTopLevelGeometryAuthority(candidate, "admittedObject");
    const object = canonicalize(clone(candidate));
    const prior = index.get(object.identity);
    if (prior && !stableEqual(prior, object)) {
      throw new ContextGraphAssemblyError("NONIDENTICAL_DUPLICATE_OBJECT_IDENTITY", { identity: object.identity });
    }
    index.set(object.identity, object);
  }
  return index;
}

function requireContextObject(contextBinding, objectIndex) {
  const contextObject = objectIndex.get(contextBinding.objectIdentity);
  if (!contextObject) {
    throw new ContextGraphAssemblyError("UNADMITTED_CONTEXT_OBJECT", { objectIdentity: contextBinding.objectIdentity });
  }
  if (!stableEqual(contextObject.authority, contextBinding.authority) || contextObject.version !== contextBinding.version) {
    throw new ContextGraphAssemblyError("MISSING_OR_INVALID_CONTEXT_AUTHORITY", {
      objectIdentity: contextBinding.objectIdentity,
      reason: "CONTEXT_BINDING_DOES_NOT_MATCH_ADMITTED_OBJECT_AUTHORITY_OR_VERSION"
    });
  }
  return contextObject;
}

function validateEvaluationEnvelope(evaluation, contextBinding) {
  if (!evaluation || typeof evaluation !== "object") {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_EVALUATION_ENVELOPE", { reason: "EVALUATION_NOT_OBJECT" });
  }
  if (!present(evaluation.evaluatedObjectIdentity)) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_EVALUATION_ENVELOPE", { reason: "MISSING_EVALUATED_OBJECT_IDENTITY" });
  }
  if (!Number.isInteger(evaluation.contextRevision) || evaluation.contextRevision < 0) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_EVALUATION_ENVELOPE", { reason: "INVALID_CONTEXT_REVISION" });
  }
  if (evaluation.contextRevision !== contextBinding.contextRevision) {
    throw new ContextGraphAssemblyError("STALE_CONTEXT_REVISION", {
      expected: contextBinding.contextRevision,
      actual: evaluation.contextRevision,
      evaluatedObjectIdentity: evaluation.evaluatedObjectIdentity
    });
  }
  if (evaluation.resolverIdentity !== GAMMA.resolverBlob) {
    throw new ContextGraphAssemblyError("GAMMA_RESOLVER_IDENTITY_MISMATCH", {
      expected: GAMMA.resolverBlob,
      actual: evaluation.resolverIdentity ?? null
    });
  }
  if (evaluation.relationRegistryIdentity !== RELATION_REGISTRY.blob) {
    throw new ContextGraphAssemblyError("RELATION_REGISTRY_IDENTITY_MISMATCH", {
      expected: RELATION_REGISTRY.blob,
      actual: evaluation.relationRegistryIdentity ?? null
    });
  }
  if (!present(evaluation.sourceBinding)) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_EVALUATION_ENVELOPE", { reason: "MISSING_SOURCE_BINDING" });
  }
}

function validateResolution(resolution, evaluation, contextBinding) {
  if (!resolution || typeof resolution !== "object" || resolution.schema !== GAMMA.schema) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_RESOLUTION", { reason: "SCHEMA_MISMATCH" });
  }
  if (!OUTCOMES.has(resolution.outcome)) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_RESOLUTION", { reason: "OUTCOME_NOT_IN_FROZEN_VOCABULARY", outcome: resolution.outcome ?? null });
  }
  if (resolution.objectIdentity !== evaluation.evaluatedObjectIdentity) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_RESOLUTION", { reason: "EVALUATED_OBJECT_IDENTITY_MISMATCH" });
  }
  if (resolution.contextObjectId !== contextBinding.objectIdentity) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_RESOLUTION", { reason: "CONTEXT_OBJECT_IDENTITY_MISMATCH" });
  }
  if (resolution.contextVersion !== contextBinding.version) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_RESOLUTION", { reason: "CONTEXT_VERSION_MISMATCH" });
  }
  if (!stableEqual(resolution.contextScope, contextBinding.contextScope)) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_RESOLUTION", { reason: "CONTEXT_SCOPE_MISMATCH" });
  }
  if (!Array.isArray(resolution.assertedRelations) || !Array.isArray(resolution.conflictedRelations)) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_RESOLUTION", { reason: "RELATION_ARRAYS_REQUIRED" });
  }
  if (["NONE", "UNKNOWN", "UNEVALUABLE"].includes(resolution.outcome) && resolution.assertedRelations.length) {
    throw new ContextGraphAssemblyError("NON_ASSERTED_OUTCOME_PRESENTED_WITH_ASSERTED_RELATIONS", {
      outcome: resolution.outcome,
      evaluatedObjectIdentity: evaluation.evaluatedObjectIdentity
    });
  }
  if (resolution.outcome === "ASSERTED" && resolution.assertedRelations.length === 0) {
    throw new ContextGraphAssemblyError("ASSERTED_OUTCOME_WITHOUT_ASSERTED_RELATION", {
      evaluatedObjectIdentity: evaluation.evaluatedObjectIdentity
    });
  }
}

function publicRelationIds(resolution) {
  const ids = [];
  for (const relation of [...(resolution.assertedRelations ?? []), ...(resolution.conflictedRelations ?? [])]) {
    const id = relation?.relationId ?? null;
    if (id != null) ids.push(id);
  }
  return [...new Set(ids)].sort((a, b) => String(a).localeCompare(String(b)));
}

function toGraphEdge(relation, contextBinding, evaluatedObjectIdentity, objectIndex) {
  if (!relation || typeof relation !== "object") {
    return { edge: null, rejection: { kind: "EDGE", reason: "ASSERTED_RELATION_NOT_OBJECT", relationId: null } };
  }
  for (const [, sourceField] of EDGE_FIELD_MAP) {
    if (!hasOwn(relation, sourceField)) {
      return {
        edge: null,
        rejection: { kind: "EDGE", reason: "ASSERTED_RELATION_MISSING_REQUIRED_FIELD", relationId: relation.relationId ?? null, field: sourceField }
      };
    }
  }
  if (relation.existenceState !== "ASSERTED") {
    throw new ContextGraphAssemblyError("NON_ASSERTED_RESOLUTION_PRESENTED_AS_ASSERTED_CONNECTIVITY", {
      relationId: relation.relationId ?? null,
      existenceState: relation.existenceState ?? null
    });
  }
  assertNoTopLevelGeometryAuthority(relation, "assertedRelation");
  const endpoints = [relation.fromObject, relation.toObject];
  if (!endpoints.includes(contextBinding.objectIdentity)) {
    throw new ContextGraphAssemblyError("NEIGHBOR_TO_NEIGHBOR_EDGE_FORBIDDEN", { relationId: relation.relationId ?? null });
  }
  const otherEndpoint = relation.fromObject === contextBinding.objectIdentity ? relation.toObject : relation.fromObject;
  if (!objectIndex.has(relation.fromObject) || !objectIndex.has(relation.toObject)) {
    return {
      edge: null,
      rejection: { kind: "EDGE", reason: "ASSERTED_RELATION_WITH_UNADMITTED_ENDPOINT", relationId: relation.relationId ?? null }
    };
  }
  if (otherEndpoint !== evaluatedObjectIdentity) {
    throw new ContextGraphAssemblyError("ASSERTED_RELATION_ENDPOINT_NOT_EVALUATED_OBJECT", {
      relationId: relation.relationId ?? null,
      expectedEvaluatedObject: evaluatedObjectIdentity,
      actualOtherEndpoint: otherEndpoint
    });
  }
  if (!present(relation.authorityPointers) || !present(relation.sourceOrProvenance)) {
    return {
      edge: null,
      rejection: { kind: "EDGE", reason: "ASSERTED_RELATION_MISSING_AUTHORITY_OR_PROVENANCE", relationId: relation.relationId ?? null }
    };
  }
  const edge = {};
  for (const [targetField, sourceField] of EDGE_FIELD_MAP) edge[targetField] = canonicalize(clone(relation[sourceField]));
  edge.DIRECTION = relation.direction ?? "DIRECTED";
  return { edge: canonicalize(edge), rejection: null };
}

function sourceIdentityList(objectIndex) {
  const seen = new Map();
  for (const object of objectIndex.values()) {
    const provenance = canonicalize(clone(object.provenance));
    seen.set(stableKey(provenance), provenance);
  }
  return [...seen.values()].sort((a, b) => stableKey(a).localeCompare(stableKey(b)));
}

function buildAssemblyIdentity({ contextBinding, objectIndex, ledger, sourceBindings }) {
  return canonicalize({
    assembler: ASSEMBLER.schema,
    assemblerVersion: ASSEMBLER.version,
    graphContractBlob: CONTRACT.blob,
    topologyClass: CONTRACT.topologyClass,
    contextKey: `${contextBinding.objectIdentity}@${contextBinding.contextRevision}`,
    semanticInputDescriptor: {
      admittedObjectIdentities: [...objectIndex.keys()].sort(),
      gammaEvaluations: ledger.map((entry) => ({
        evaluatedObjectIdentity: entry.evaluatedObjectIdentity,
        contextRevision: entry.contextRevision,
        gammaOutcome: entry.gammaOutcome,
        resolvedRelationIds: entry.resolvedRelationIds,
        resolverIdentity: entry.resolverIdentity,
        sourceBinding: entry.sourceBinding
      })),
      sourceBindings
    }
  });
}

export function assembleContextGraph({ contextBinding, admittedObjects, gammaEvaluations }) {
  const context = requireContextBinding(contextBinding);
  const objectIndex = normalizeAdmittedObjects(admittedObjects);
  const contextNode = requireContextObject(context, objectIndex);
  if (!Array.isArray(gammaEvaluations)) {
    throw new ContextGraphAssemblyError("INVALID_GAMMA_EVALUATION_SET", { reason: "GAMMA_EVALUATIONS_NOT_ARRAY" });
  }

  const ledger = [];
  const assemblyRejections = [];
  const edgeById = new Map();
  const evaluationSourceBindings = new Map();

  for (const rawEvaluation of gammaEvaluations) {
    const evaluation = clone(rawEvaluation);
    validateEvaluationEnvelope(evaluation, context);

    const evaluatedObject = objectIndex.get(evaluation.evaluatedObjectIdentity);
    if (!evaluatedObject) {
      assemblyRejections.push(canonicalize({
        kind: "INPUT",
        reason: "UNADMITTED_EVALUATED_OBJECT",
        evaluatedObjectIdentity: evaluation.evaluatedObjectIdentity,
        contextRevision: evaluation.contextRevision
      }));
      continue;
    }

    const resolution = evaluation.resolution;
    validateResolution(resolution, evaluation, context);
    const ledgerEntry = canonicalize({
      contextObjectIdentity: context.objectIdentity,
      evaluatedObjectIdentity: evaluation.evaluatedObjectIdentity,
      contextRevision: context.contextRevision,
      gammaOutcome: resolution.outcome,
      resolvedRelationIds: publicRelationIds(resolution),
      sourceBinding: clone(evaluation.sourceBinding),
      resolverIdentity: evaluation.resolverIdentity
    });
    ledger.push(ledgerEntry);
    evaluationSourceBindings.set(stableKey(ledgerEntry.sourceBinding), ledgerEntry.sourceBinding);

    if (resolution.outcome !== "ASSERTED") continue;

    for (const relation of resolution.assertedRelations) {
      const { edge, rejection } = toGraphEdge(relation, context, evaluation.evaluatedObjectIdentity, objectIndex);
      if (rejection) {
        assemblyRejections.push(canonicalize(rejection));
        continue;
      }
      const relationId = edge.RELATION_ID;
      if (!present(relationId)) {
        assemblyRejections.push(canonicalize({ kind: "EDGE", reason: "MISSING_RELATION_ID", relationId: null }));
        continue;
      }
      const prior = edgeById.get(relationId);
      if (prior && !stableEqual(prior, edge)) {
        throw new ContextGraphAssemblyError("NONIDENTICAL_DUPLICATE_RELATION_ID", { relationId });
      }
      if (!prior) edgeById.set(relationId, edge);
    }
  }

  ledger.sort((a, b) => {
    const byObject = String(a.evaluatedObjectIdentity).localeCompare(String(b.evaluatedObjectIdentity));
    if (byObject) return byObject;
    return stableKey(a).localeCompare(stableKey(b));
  });

  const assertedEdges = [...edgeById.values()].sort((a, b) => {
    const byId = String(a.RELATION_ID).localeCompare(String(b.RELATION_ID));
    if (byId) return byId;
    return stableKey(a).localeCompare(stableKey(b));
  });

  const nodeIds = new Set([context.objectIdentity]);
  for (const edge of assertedEdges) {
    nodeIds.add(edge.FROM_OBJECT);
    nodeIds.add(edge.TO_OBJECT);
  }
  const assertedNodes = [...nodeIds].sort().map((identity) => objectIndex.get(identity));

  assemblyRejections.sort((a, b) => stableKey(a).localeCompare(stableKey(b)));
  const sourceBindings = canonicalize({
    graphContract: CONTRACT,
    gamma: GAMMA,
    relationRegistry: RELATION_REGISTRY,
    authoritativeObjectSources: sourceIdentityList(objectIndex),
    gammaEvaluationSources: [...evaluationSourceBindings.values()].sort((a, b) => stableKey(a).localeCompare(stableKey(b)))
  });

  const assemblyIdentity = buildAssemblyIdentity({ contextBinding: context, objectIndex, ledger, sourceBindings });
  const snapshot = canonicalize({
    schema: "LAWS_CONTEXT_GRAPH_SNAPSHOT_v1",
    graphContractVersion: CONTRACT.version,
    contextBinding: context,
    contextNode,
    assertedNodes,
    assertedEdges,
    resolutionLedger: ledger,
    sourceBindings,
    assemblyIdentity,
    assemblyRejections
  });

  return deepFreeze(snapshot);
}

export const ContextGraphContractBinding = deepFreeze(canonicalize({
  contract: CONTRACT,
  gamma: GAMMA,
  relationRegistry: RELATION_REGISTRY,
  assembler: ASSEMBLER
}));
