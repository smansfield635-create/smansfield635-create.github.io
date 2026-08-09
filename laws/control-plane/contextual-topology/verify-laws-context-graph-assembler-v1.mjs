import assert from "node:assert/strict";
import { writeFileSync, readFileSync } from "node:fs";
import {
  assembleContextGraph,
  ContextGraphAssemblyError,
  ContextGraphContractBinding
} from "./laws-context-graph-assembler-v1.mjs";
import {
  adaptTestsObjectProjectionRegistry,
  GammaOutcome,
  resolveGamma
} from "./laws-contextual-gamma-resolver-v1.mjs";

function readJson(url) {
  return JSON.parse(readFileSync(url, "utf8"));
}

const relationRegistry = readJson(new URL("./laws-contextual-relation-registry-v1.json", import.meta.url));
const nativeTestsRegistry = readJson(new URL("../../../control-plane/whole-estate/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json", import.meta.url));

const sourceDescriptor = Object.freeze({
  sourceId: "SRC09",
  path: "control-plane/whole-estate/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json",
  gitBlob: "b801a11e342051a6b00e6f7098b1d691685ad0b6"
});

const CONTRACT_BLOB = "240dbb7dca3db8f5a0a21e77d1aee91f1d21cb5a";
const GAMMA_RESOLVER_BLOB = "1d715884d71419ac25892da452ca7b6d21e6c909";
const RELATION_REGISTRY_BLOB = "5d79eca4ee7d9366f8d8c2287c34001ae37ffc4e";
const FORBIDDEN = new Set([
  "x", "y", "z", "screenX", "screenY", "screenPosition", "projectedRadius", "depth", "depthLayer",
  "orbitRadius", "quaternion", "camera", "visualPriority", "visualScale", "color", "animation"
]);

const requiredCases = Object.freeze([
  "REAL_EXECUTES_EDGE_SURVIVES_ASSEMBLY",
  "REAL_GOVERNS_PROCEDURE_FOR_EDGE_SURVIVES_ASSEMBLY",
  "MULTIPLE_AUTHORIZED_RELATIONS_BETWEEN_SAME_ENDPOINTS_SURVIVE",
  "UNKNOWN_CREATES_NO_ASSERTED_EDGE_AND_REMAINS_IN_LEDGER",
  "UNEVALUABLE_CREATES_NO_ASSERTED_EDGE_AND_REMAINS_IN_LEDGER",
  "CONFLICTED_CREATES_NO_ASSERTED_EDGE_AND_REMAINS_IN_LEDGER",
  "NONE_CREATES_NO_ASSERTED_EDGE_AND_REMAINS_DISTINCT_FROM_UNKNOWN",
  "INVERSE_EDGE_IS_NOT_SYNTHESIZED",
  "SCIENTIFIC_STANDING_REMAINS_UNCHANGED",
  "CLAIM_CEILING_REMAINS_UNCHANGED",
  "STALE_CONTEXT_REVISION_FAILS_CLOSED",
  "UNADMITTED_ENDPOINT_CANNOT_ENTER_ASSERTED_GRAPH",
  "SAME_EXACT_INPUTS_PRODUCE_IDENTICAL_SEMANTIC_GRAPH",
  "GEOMETRY_FIELDS_ARE_ABSENT_FROM_GRAPH_AUTHORITY",
  "NEIGHBOR_TO_NEIGHBOR_RELATIONS_ARE_NOT_RECURSIVELY_DISCOVERED"
]);

const adapted = adaptTestsObjectProjectionRegistry({ registry: nativeTestsRegistry, relationRegistry, sourceDescriptor });
const adaptedObject = (id) => adapted.authoritativeObjects.find((entry) => entry.identity === id);
const portfolio = adaptedObject("PROSPECTIVE_FINAL_REPORT_PORTFOLIO");
assert.ok(portfolio, "native Tests portfolio context must exist");

const authObj = (identity, objectClass) => Object.freeze({
  identity,
  objectClass,
  authority: { id: `${identity}:authority` },
  version: "1",
  provenance: { source: "context-graph-assembler-verifier-fixture" }
});

const currentRecord = (overrides = {}) => ({
  RELATION_ID: "R1",
  RELATION_TYPE: "EXECUTES",
  FROM_OBJECT: "M",
  TO_OBJECT: "T",
  RELATION_DEFINITION_VERSION: "1.0.0",
  AUTHORITY_POINTERS: { id: "edge-authority" },
  AUTHORITY_STATUS: "RESOLVED_CURRENT",
  EVIDENCE_REFERENCES: [{ id: "edge-authority" }],
  CONTEXT_SCOPE: { scope: "fixture" },
  TEMPORAL_SCOPE: { version: "1" },
  QUALIFIERS: {},
  EXISTENCE_STATE: "ASSERTED",
  SCIENTIFIC_STANDING: null,
  CLAIM_CEILING: null,
  SOURCE_OR_PROVENANCE: { source: "context-graph-assembler-verifier-fixture" },
  CURRENT_VERSION: "1",
  ...overrides
});

function contextBinding(origin, revision, scope) {
  return Object.freeze({
    objectIdentity: origin.identity,
    contextScope: scope,
    authority: structuredClone(origin.authority),
    version: origin.version,
    contextRevision: revision
  });
}

function gammaContext(binding) {
  return {
    objectIdentity: binding.objectIdentity,
    contextScope: structuredClone(binding.contextScope),
    authority: structuredClone(binding.authority),
    version: binding.version
  };
}

function evaluation({
  object,
  binding,
  authoritativeObjects,
  relationRecords,
  relationTypes = null,
  sourceBinding = sourceDescriptor
}) {
  const resolution = resolveGamma({
    registry: relationRegistry,
    object,
    context: gammaContext(binding),
    authoritativeObjects,
    relationRecords,
    relationTypes
  });
  return Object.freeze({
    evaluatedObjectIdentity: object.identity,
    contextRevision: binding.contextRevision,
    resolution,
    sourceBinding: structuredClone(sourceBinding),
    resolverIdentity: GAMMA_RESOLVER_BLOB,
    relationRegistryIdentity: RELATION_REGISTRY_BLOB
  });
}

function expectAssemblyError(code, fn) {
  assert.throws(fn, (error) => error instanceof ContextGraphAssemblyError && error.code === code);
}

function edgeByType(graph, type) {
  return graph.assertedEdges.find((edge) => edge.RELATION_TYPE === type);
}

function collectForbiddenTopLevelFields(graph) {
  const violations = [];
  const inspect = (record, locus) => {
    for (const key of Object.keys(record ?? {})) if (FORBIDDEN.has(key)) violations.push(`${locus}:${key}`);
  };
  inspect(graph.contextBinding, "contextBinding");
  inspect(graph.contextNode, "contextNode");
  graph.assertedNodes.forEach((node, index) => inspect(node, `assertedNodes[${index}]`));
  graph.assertedEdges.forEach((edge, index) => inspect(edge, `assertedEdges[${index}]`));
  inspect(graph.assemblyIdentity, "assemblyIdentity");
  return violations;
}

let checks = 0;
const passedCases = [];
const check = (name, fn) => {
  fn();
  checks += 1;
  passedCases.push(name);
};

const nativeBinding = contextBinding(portfolio, 11, "LAWS_CONTEXT_GRAPH_ASSEMBLER_NATIVE_VERIFICATION");
const routeOperator = adaptedObject("ROUTE_OPERATOR_PLATFORM");
const methods = adaptedObject("METHODS");
assert.ok(routeOperator && methods, "native Tests relation endpoints must exist");

const realExecutesEvaluation = evaluation({
  object: routeOperator,
  binding: nativeBinding,
  authoritativeObjects: adapted.authoritativeObjects,
  relationRecords: adapted.relationRecords
});
const realGovernsEvaluation = evaluation({
  object: methods,
  binding: nativeBinding,
  authoritativeObjects: adapted.authoritativeObjects,
  relationRecords: adapted.relationRecords
});
assert.equal(realExecutesEvaluation.resolution.outcome, GammaOutcome.ASSERTED);
assert.equal(realGovernsEvaluation.resolution.outcome, GammaOutcome.ASSERTED);

const representativeGraph = assembleContextGraph({
  contextBinding: nativeBinding,
  admittedObjects: adapted.authoritativeObjects,
  gammaEvaluations: [realExecutesEvaluation, realGovernsEvaluation]
});

check("REAL_EXECUTES_EDGE_SURVIVES_ASSEMBLY", () => {
  const gammaRelation = realExecutesEvaluation.resolution.assertedRelations.find((relation) => relation.relationType === "EXECUTES");
  const edge = edgeByType(representativeGraph, "EXECUTES");
  assert.ok(gammaRelation && edge);
  assert.equal(edge.RELATION_ID, gammaRelation.relationId);
  assert.equal(edge.FROM_OBJECT, gammaRelation.fromObject);
  assert.equal(edge.TO_OBJECT, gammaRelation.toObject);
  assert.deepEqual(edge.AUTHORITY_POINTERS, gammaRelation.authorityPointers);
  assert.deepEqual(edge.SOURCE_OR_PROVENANCE, gammaRelation.sourceOrProvenance);
});

check("REAL_GOVERNS_PROCEDURE_FOR_EDGE_SURVIVES_ASSEMBLY", () => {
  const gammaRelation = realGovernsEvaluation.resolution.assertedRelations.find((relation) => relation.relationType === "GOVERNS_PROCEDURE_FOR");
  const edge = edgeByType(representativeGraph, "GOVERNS_PROCEDURE_FOR");
  assert.ok(gammaRelation && edge);
  assert.equal(edge.RELATION_ID, gammaRelation.relationId);
  assert.equal(edge.FROM_OBJECT, gammaRelation.fromObject);
  assert.equal(edge.TO_OBJECT, gammaRelation.toObject);
});

const M = authObj("M", "METHOD");
const T = authObj("T", "TEST_INSTANCE");
const fixtureBinding = contextBinding(T, 2, { scope: "fixture" });
const parallelEvaluation = evaluation({
  object: M,
  binding: fixtureBinding,
  authoritativeObjects: [M, T],
  relationRecords: [
    currentRecord(),
    currentRecord({ RELATION_ID: "R2", RELATION_TYPE: "GOVERNS_PROCEDURE_FOR" })
  ]
});
const parallelGraph = assembleContextGraph({
  contextBinding: fixtureBinding,
  admittedObjects: [M, T],
  gammaEvaluations: [parallelEvaluation]
});

check("MULTIPLE_AUTHORIZED_RELATIONS_BETWEEN_SAME_ENDPOINTS_SURVIVE", () => {
  assert.equal(parallelGraph.assertedEdges.length, 2);
  assert.deepEqual(parallelGraph.assertedEdges.map((edge) => edge.RELATION_TYPE).sort(), ["EXECUTES", "GOVERNS_PROCEDURE_FOR"]);
  assert.deepEqual(new Set(parallelGraph.assertedEdges.map((edge) => `${edge.FROM_OBJECT}->${edge.TO_OBJECT}`)).size, 1);
});

const MUnknown = authObj("M_UNKNOWN", "METHOD");
const MNone = authObj("M_NONE", "METHOD");
const stateBinding = contextBinding(T, 3, { scope: "fixture" });
const unknownEvaluation = evaluation({
  object: MUnknown,
  binding: stateBinding,
  authoritativeObjects: [MUnknown, MNone, T],
  relationRecords: []
});
const noneEvaluation = evaluation({
  object: MNone,
  binding: stateBinding,
  authoritativeObjects: [MUnknown, MNone, T],
  relationRecords: [currentRecord({
    RELATION_ID: "NONE_1",
    FROM_OBJECT: MNone.identity,
    TO_OBJECT: T.identity,
    EXISTENCE_STATE: "NONE"
  })],
  relationTypes: ["EXECUTES"]
});
const stateGraph = assembleContextGraph({
  contextBinding: stateBinding,
  admittedObjects: [MUnknown, MNone, T],
  gammaEvaluations: [unknownEvaluation, noneEvaluation]
});

check("UNKNOWN_CREATES_NO_ASSERTED_EDGE_AND_REMAINS_IN_LEDGER", () => {
  assert.equal(unknownEvaluation.resolution.outcome, GammaOutcome.UNKNOWN);
  assert.ok(!stateGraph.assertedEdges.some((edge) => edge.FROM_OBJECT === MUnknown.identity || edge.TO_OBJECT === MUnknown.identity));
  assert.equal(stateGraph.resolutionLedger.find((entry) => entry.evaluatedObjectIdentity === MUnknown.identity)?.gammaOutcome, "UNKNOWN");
});

const MUnevaluable = authObj("M_UNEVALUABLE", "METHOD");
const unevaluableBinding = contextBinding(T, 4, { scope: "fixture" });
const unevaluableEvaluation = evaluation({
  object: MUnevaluable,
  binding: unevaluableBinding,
  authoritativeObjects: [MUnevaluable, T],
  relationRecords: [currentRecord({
    RELATION_ID: "UNEVALUABLE_1",
    FROM_OBJECT: MUnevaluable.identity,
    TO_OBJECT: T.identity,
    AUTHORITY_STATUS: "UNRESOLVED"
  })]
});
const unevaluableGraph = assembleContextGraph({
  contextBinding: unevaluableBinding,
  admittedObjects: [MUnevaluable, T],
  gammaEvaluations: [unevaluableEvaluation]
});

check("UNEVALUABLE_CREATES_NO_ASSERTED_EDGE_AND_REMAINS_IN_LEDGER", () => {
  assert.equal(unevaluableEvaluation.resolution.outcome, GammaOutcome.UNEVALUABLE);
  assert.equal(unevaluableGraph.assertedEdges.length, 0);
  assert.equal(unevaluableGraph.resolutionLedger[0].gammaOutcome, "UNEVALUABLE");
});

const MConflicted = authObj("M_CONFLICTED", "METHOD");
const conflictedBinding = contextBinding(T, 5, { scope: "fixture" });
const conflictedEvaluation = evaluation({
  object: MConflicted,
  binding: conflictedBinding,
  authoritativeObjects: [MConflicted, T],
  relationRecords: [
    currentRecord({ RELATION_ID: "CONFLICT_1", FROM_OBJECT: MConflicted.identity, TO_OBJECT: T.identity, EXISTENCE_STATE: "ASSERTED" }),
    currentRecord({ RELATION_ID: "CONFLICT_1", FROM_OBJECT: MConflicted.identity, TO_OBJECT: T.identity, EXISTENCE_STATE: "NONE" })
  ],
  relationTypes: ["EXECUTES"]
});
const conflictedGraph = assembleContextGraph({
  contextBinding: conflictedBinding,
  admittedObjects: [MConflicted, T],
  gammaEvaluations: [conflictedEvaluation]
});

check("CONFLICTED_CREATES_NO_ASSERTED_EDGE_AND_REMAINS_IN_LEDGER", () => {
  assert.equal(conflictedEvaluation.resolution.outcome, GammaOutcome.CONFLICTED);
  assert.equal(conflictedGraph.assertedEdges.length, 0);
  assert.equal(conflictedGraph.resolutionLedger[0].gammaOutcome, "CONFLICTED");
});

check("NONE_CREATES_NO_ASSERTED_EDGE_AND_REMAINS_DISTINCT_FROM_UNKNOWN", () => {
  assert.equal(noneEvaluation.resolution.outcome, GammaOutcome.NONE);
  assert.equal(stateGraph.assertedEdges.length, 0);
  const outcomes = new Map(stateGraph.resolutionLedger.map((entry) => [entry.evaluatedObjectIdentity, entry.gammaOutcome]));
  assert.equal(outcomes.get(MNone.identity), "NONE");
  assert.equal(outcomes.get(MUnknown.identity), "UNKNOWN");
});

check("INVERSE_EDGE_IS_NOT_SYNTHESIZED", () => {
  const gammaRelations = [...realExecutesEvaluation.resolution.assertedRelations, ...realGovernsEvaluation.resolution.assertedRelations];
  for (const relation of gammaRelations) {
    const edge = representativeGraph.assertedEdges.find((candidate) => candidate.RELATION_ID === relation.relationId);
    assert.ok(edge);
    assert.equal(edge.FROM_OBJECT, relation.fromObject);
    assert.equal(edge.TO_OBJECT, relation.toObject);
    const synthesizedInverse = representativeGraph.assertedEdges.find((candidate) =>
      candidate.RELATION_ID !== edge.RELATION_ID &&
      candidate.RELATION_TYPE === edge.RELATION_TYPE &&
      candidate.FROM_OBJECT === edge.TO_OBJECT &&
      candidate.TO_OBJECT === edge.FROM_OBJECT
    );
    assert.equal(synthesizedInverse, undefined);
  }
});

const standingEvaluation = evaluation({
  object: M,
  binding: fixtureBinding,
  authoritativeObjects: [M, T],
  relationRecords: [currentRecord({ SCIENTIFIC_STANDING: "MIXED", CLAIM_CEILING: "BOUNDED_RECORD_ONLY" })]
});
const standingGraph = assembleContextGraph({
  contextBinding: fixtureBinding,
  admittedObjects: [M, T],
  gammaEvaluations: [standingEvaluation]
});

check("SCIENTIFIC_STANDING_REMAINS_UNCHANGED", () => {
  assert.equal(standingEvaluation.resolution.assertedRelations[0].scientificStanding, "MIXED");
  assert.equal(standingGraph.assertedEdges[0].SCIENTIFIC_STANDING, "MIXED");
});

check("CLAIM_CEILING_REMAINS_UNCHANGED", () => {
  assert.equal(standingEvaluation.resolution.assertedRelations[0].claimCeiling, "BOUNDED_RECORD_ONLY");
  assert.equal(standingGraph.assertedEdges[0].CLAIM_CEILING, "BOUNDED_RECORD_ONLY");
});

check("STALE_CONTEXT_REVISION_FAILS_CLOSED", () => {
  const stale = { ...parallelEvaluation, contextRevision: fixtureBinding.contextRevision - 1 };
  expectAssemblyError("STALE_CONTEXT_REVISION", () => assembleContextGraph({
    contextBinding: fixtureBinding,
    admittedObjects: [M, T],
    gammaEvaluations: [stale]
  }));
});

check("UNADMITTED_ENDPOINT_CANNOT_ENTER_ASSERTED_GRAPH", () => {
  const corruptedResolution = structuredClone(parallelEvaluation.resolution);
  corruptedResolution.assertedRelations = [structuredClone(corruptedResolution.assertedRelations[0])];
  corruptedResolution.assertedRelations[0].fromObject = "UNADMITTED_ENDPOINT";
  const corrupted = { ...parallelEvaluation, resolution: corruptedResolution };
  const graph = assembleContextGraph({
    contextBinding: fixtureBinding,
    admittedObjects: [M, T],
    gammaEvaluations: [corrupted]
  });
  assert.equal(graph.assertedEdges.length, 0);
  assert.ok(graph.assemblyRejections.some((entry) => entry.reason === "ASSERTED_RELATION_WITH_UNADMITTED_ENDPOINT"));
  assert.ok(!graph.assertedNodes.some((node) => node.identity === "UNADMITTED_ENDPOINT"));
});

check("SAME_EXACT_INPUTS_PRODUCE_IDENTICAL_SEMANTIC_GRAPH", () => {
  const a = assembleContextGraph({
    contextBinding: nativeBinding,
    admittedObjects: adapted.authoritativeObjects,
    gammaEvaluations: [realExecutesEvaluation, realGovernsEvaluation]
  });
  const b = assembleContextGraph({
    contextBinding: structuredClone(nativeBinding),
    admittedObjects: [...adapted.authoritativeObjects].reverse(),
    gammaEvaluations: [realGovernsEvaluation, realExecutesEvaluation]
  });
  assert.deepEqual(a, b);
});

check("GEOMETRY_FIELDS_ARE_ABSENT_FROM_GRAPH_AUTHORITY", () => {
  assert.deepEqual(collectForbiddenTopLevelFields(representativeGraph), []);
  const contaminated = { ...M, x: 1 };
  expectAssemblyError("GEOMETRY_AUTHORITY_FIELD_FORBIDDEN", () => assembleContextGraph({
    contextBinding: fixtureBinding,
    admittedObjects: [contaminated, T],
    gammaEvaluations: []
  }));
});

check("NEIGHBOR_TO_NEIGHBOR_RELATIONS_ARE_NOT_RECURSIVELY_DISCOVERED", () => {
  const N = authObj("N", "METHOD");
  const fake = structuredClone(parallelEvaluation);
  fake.resolution = structuredClone(fake.resolution);
  fake.resolution.assertedRelations = [structuredClone(fake.resolution.assertedRelations[0])];
  fake.resolution.assertedRelations[0].fromObject = M.identity;
  fake.resolution.assertedRelations[0].toObject = N.identity;
  expectAssemblyError("NEIGHBOR_TO_NEIGHBOR_EDGE_FORBIDDEN", () => assembleContextGraph({
    contextBinding: fixtureBinding,
    admittedObjects: [M, N, T],
    gammaEvaluations: [fake]
  }));
  assert.ok(representativeGraph.assertedEdges.every((edge) =>
    edge.FROM_OBJECT === nativeBinding.objectIdentity || edge.TO_OBJECT === nativeBinding.objectIdentity
  ));
});

check("UNADMITTED_EVALUATED_OBJECT_IS_RECORDED_OUTSIDE_GAMMA_VOCABULARY", () => {
  const ghostEvaluation = {
    evaluatedObjectIdentity: "GHOST",
    contextRevision: fixtureBinding.contextRevision,
    resolution: {
      schema: "LAWS_CONTEXTUAL_GAMMA_RESOLUTION_v1",
      objectIdentity: "GHOST",
      contextObjectId: fixtureBinding.objectIdentity,
      contextScope: fixtureBinding.contextScope,
      contextVersion: fixtureBinding.version,
      outcome: "UNKNOWN",
      assertedRelations: [],
      conflictedRelations: []
    },
    sourceBinding: { source: "adversarial-verifier" },
    resolverIdentity: GAMMA_RESOLVER_BLOB,
    relationRegistryIdentity: RELATION_REGISTRY_BLOB
  };
  const graph = assembleContextGraph({
    contextBinding: fixtureBinding,
    admittedObjects: [M, T],
    gammaEvaluations: [ghostEvaluation]
  });
  assert.equal(graph.resolutionLedger.length, 0);
  assert.ok(graph.assemblyRejections.some((entry) => entry.reason === "UNADMITTED_EVALUATED_OBJECT"));
});

check("NONIDENTICAL_DUPLICATE_RELATION_ID_FAILS_CLOSED", () => {
  const duplicateResolution = structuredClone(parallelEvaluation.resolution);
  duplicateResolution.assertedRelations = duplicateResolution.assertedRelations.map((relation) => structuredClone(relation));
  duplicateResolution.assertedRelations[1].relationId = duplicateResolution.assertedRelations[0].relationId;
  const duplicateEvaluation = { ...parallelEvaluation, resolution: duplicateResolution };
  expectAssemblyError("NONIDENTICAL_DUPLICATE_RELATION_ID", () => assembleContextGraph({
    contextBinding: fixtureBinding,
    admittedObjects: [M, T],
    gammaEvaluations: [duplicateEvaluation]
  }));
});

check("FROZEN_SOURCE_IDENTITIES_ARE_ENFORCED", () => {
  const wrongGamma = { ...parallelEvaluation, resolverIdentity: "WRONG" };
  expectAssemblyError("GAMMA_RESOLVER_IDENTITY_MISMATCH", () => assembleContextGraph({
    contextBinding: fixtureBinding,
    admittedObjects: [M, T],
    gammaEvaluations: [wrongGamma]
  }));
  const wrongRegistry = { ...parallelEvaluation, relationRegistryIdentity: "WRONG" };
  expectAssemblyError("RELATION_REGISTRY_IDENTITY_MISMATCH", () => assembleContextGraph({
    contextBinding: fixtureBinding,
    admittedObjects: [M, T],
    gammaEvaluations: [wrongRegistry]
  }));
});

check("CONTEXT_AUTHORITY_AND_VERSION_MUST_MATCH_ADMITTED_CONTEXT", () => {
  const wrong = { ...fixtureBinding, version: "999" };
  expectAssemblyError("MISSING_OR_INVALID_CONTEXT_AUTHORITY", () => assembleContextGraph({
    contextBinding: wrong,
    admittedObjects: [M, T],
    gammaEvaluations: []
  }));
});

assert.deepEqual(requiredCases.filter((name) => !passedCases.includes(name)), []);
assert.equal(ContextGraphContractBinding.contract.blob, CONTRACT_BLOB);
assert.equal(ContextGraphContractBinding.gamma.resolverBlob, GAMMA_RESOLVER_BLOB);
assert.equal(ContextGraphContractBinding.relationRegistry.blob, RELATION_REGISTRY_BLOB);

const outputDir = process.env.LAWS_CONTEXT_GRAPH_ASSEMBLER_EVIDENCE_DIR || "/tmp";
const verification = {
  schema: "LAWS_CONTEXT_GRAPH_ASSEMBLER_VERIFICATION_RESULT_v1",
  operation: "LAWS_CONTEXT_GRAPH_ASSEMBLER_CONSTRUCTION",
  result: "PASS",
  checksPassed: checks,
  checksFailed: 0,
  requiredCasesPassed: requiredCases,
  additionalCasesPassed: passedCases.filter((name) => !requiredCases.includes(name)),
  authorityBindings: {
    frozenContractCommit: "84cd86ff93e657af6c38b52cfc6525da594f01a7",
    frozenContractBlob: CONTRACT_BLOB,
    verifiedGammaSubjectHead: "334ea9e0dfbe2d6866df871ec5f5da021d59d459",
    gammaResolverBlob: GAMMA_RESOLVER_BLOB,
    relationRegistryBlob: RELATION_REGISTRY_BLOB,
    testsRegistryBlob: sourceDescriptor.gitBlob
  },
  boundaries: {
    productionContextGraphConstructed: false,
    verificationFixtureGraphsConstructed: true,
    graphConformanceConsumerConstructed: false,
    lrpv1SealPerformed: false,
    spatialProjectionPolicyConstructed: false,
    spatialReprojectionConstructed: false,
    productMutation: false,
    gammaModified: false,
    relationRegistryModified: false,
    imiInvoked: false
  }
};

writeFileSync(`${outputDir}/laws-context-graph-assembler-verification-result-v1.json`, JSON.stringify(verification, null, 2) + "\n");
writeFileSync(`${outputDir}/laws-context-graph-representative-snapshot-v1.json`, JSON.stringify(representativeGraph, null, 2) + "\n");
console.log(JSON.stringify(verification));
