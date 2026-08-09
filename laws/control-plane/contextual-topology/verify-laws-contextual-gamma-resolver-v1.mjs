import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { adaptTestsObjectProjectionRegistry, GammaOutcome, resolveGamma } from "./laws-contextual-gamma-resolver-v1.mjs";

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

const adapted = adaptTestsObjectProjectionRegistry({ registry: nativeTestsRegistry, relationRegistry, sourceDescriptor });
const adaptedObject = (id) => adapted.authoritativeObjects.find((entry) => entry.identity === id);
const portfolio = adaptedObject("PROSPECTIVE_FINAL_REPORT_PORTFOLIO");
const asContext = (origin, scope = "GAMMA_SEMANTIC_VERIFICATION") => Object.freeze({
  objectIdentity: origin.identity,
  contextScope: scope,
  authority: origin.authority,
  version: origin.version
});

let checks = 0;
function check(name, fn) {
  fn();
  checks += 1;
  return name;
}

check("native EXECUTES resolves ASSERTED", () => {
  const result = resolveGamma({
    registry: relationRegistry,
    object: adaptedObject("ROUTE_OPERATOR_PLATFORM"),
    context: asContext(portfolio),
    authoritativeObjects: adapted.authoritativeObjects,
    relationRecords: adapted.relationRecords
  });
  assert.equal(result.outcome, GammaOutcome.ASSERTED);
  assert.deepEqual(result.assertedRelations.map((r) => r.relationType), ["EXECUTES"]);
});

check("native GOVERNS_PROCEDURE_FOR resolves ASSERTED", () => {
  const result = resolveGamma({
    registry: relationRegistry,
    object: adaptedObject("METHODS"),
    context: asContext(portfolio),
    authoritativeObjects: adapted.authoritativeObjects,
    relationRecords: adapted.relationRecords
  });
  assert.equal(result.outcome, GammaOutcome.ASSERTED);
  assert.deepEqual(result.assertedRelations.map((r) => r.relationType), ["GOVERNS_PROCEDURE_FOR"]);
});

const authObj = (identity, objectClass) => Object.freeze({
  identity,
  objectClass,
  authority: { id: `${identity}:authority` },
  version: "1",
  provenance: { source: "semantic-verifier-fixture" }
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
  SOURCE_OR_PROVENANCE: { source: "semantic-verifier-fixture" },
  CURRENT_VERSION: "1",
  ...overrides
});

const M = authObj("M", "METHOD");
const T = authObj("T", "TEST_INSTANCE");

check("multiple valid relations are preserved", () => {
  const result = resolveGamma({
    registry: relationRegistry,
    object: M,
    context: asContext(T),
    authoritativeObjects: [M, T],
    relationRecords: [
      currentRecord(),
      currentRecord({ RELATION_ID: "R2", RELATION_TYPE: "GOVERNS_PROCEDURE_FOR" })
    ]
  });
  assert.equal(result.outcome, GammaOutcome.ASSERTED);
  assert.deepEqual(result.assertedRelations.map((r) => r.relationType).sort(), ["EXECUTES", "GOVERNS_PROCEDURE_FOR"]);
});

check("CUSTODIED_BY resolves independently", () => {
  const evidence = authObj("E_CUSTODY", "EVIDENCE");
  const research = authObj("RESEARCH_AUTHORITY", "AUTHORITY_DOMAIN");
  const result = resolveGamma({
    registry: relationRegistry,
    object: evidence,
    context: asContext(research),
    authoritativeObjects: [evidence, research],
    relationRecords: [currentRecord({
      RELATION_ID: "CUSTODY_1",
      RELATION_TYPE: "CUSTODIED_BY",
      FROM_OBJECT: evidence.identity,
      TO_OBJECT: research.identity,
      QUALIFIERS: { custodyDimension: "SCIENTIFIC_SOURCE_CUSTODY" }
    })]
  });
  assert.equal(result.outcome, GammaOutcome.ASSERTED);
  assert.deepEqual(result.assertedRelations.map((r) => r.relationType), ["CUSTODIED_BY"]);
});

check("operational projection does not create custody", () => {
  const evidence = authObj("E_PROJECTED", "EVIDENCE");
  const projection = authObj("TESTS_METHODS_PROJECTION", "TESTS_PROJECTION_CONTEXT");
  const result = resolveGamma({
    registry: relationRegistry,
    object: evidence,
    context: asContext(projection),
    authoritativeObjects: [evidence, projection],
    relationRecords: [currentRecord({
      RELATION_ID: "PROJECTION_1",
      RELATION_TYPE: "OPERATIONALLY_PROJECTED_INTO",
      FROM_OBJECT: evidence.identity,
      TO_OBJECT: projection.identity,
      QUALIFIERS: { projectionJustification: "AUTHORIZED_REFERENCE_PROJECTION" },
      SCIENTIFIC_STANDING: "UNTESTED"
    })]
  });
  assert.equal(result.outcome, GammaOutcome.ASSERTED);
  assert.deepEqual(result.assertedRelations.map((r) => r.relationType), ["OPERATIONALLY_PROJECTED_INTO"]);
  assert.ok(!result.assertedRelations.some((r) => r.relationType === "CUSTODIED_BY"));
});

check("test participation does not create projection", () => {
  const object = authObj("PARTICIPANT", "EVIDENCE");
  const run = authObj("RUN_1", "TEST_RUN");
  const result = resolveGamma({
    registry: relationRegistry,
    object,
    context: asContext(run),
    authoritativeObjects: [object, run],
    relationRecords: [currentRecord({
      RELATION_ID: "PHASE_1",
      RELATION_TYPE: "PARTICIPATES_IN_TEST_PHASE",
      FROM_OBJECT: object.identity,
      TO_OBJECT: run.identity,
      QUALIFIERS: { phase: "ADMISSION_AND_BASELINE", testRunIdentity: run.identity },
      EVIDENCE_REFERENCES: [{ receipt: "PHASE_RECEIPT" }]
    })]
  });
  assert.equal(result.outcome, GammaOutcome.ASSERTED);
  assert.deepEqual(result.assertedRelations.map((r) => r.relationType), ["PARTICIPATES_IN_TEST_PHASE"]);
  assert.ok(!result.assertedRelations.some((r) => r.relationType === "OPERATIONALLY_PROJECTED_INTO"));
});

check("silence is UNKNOWN rather than NONE", () => {
  const result = resolveGamma({ registry: relationRegistry, object: M, context: asContext(T), authoritativeObjects: [M, T], relationRecords: [] });
  assert.equal(result.outcome, GammaOutcome.UNKNOWN);
});

check("NONE requires an explicit exact-type authority-backed determination", () => {
  const result = resolveGamma({
    registry: relationRegistry,
    object: M,
    context: asContext(T),
    authoritativeObjects: [M, T],
    relationRecords: [currentRecord({ EXISTENCE_STATE: "NONE" })],
    relationTypes: ["EXECUTES"]
  });
  assert.equal(result.outcome, GammaOutcome.NONE);
});

check("unresolved authority is UNEVALUABLE", () => {
  const result = resolveGamma({
    registry: relationRegistry,
    object: M,
    context: asContext(T),
    authoritativeObjects: [M, T],
    relationRecords: [currentRecord({ AUTHORITY_STATUS: "UNRESOLVED" })]
  });
  assert.equal(result.outcome, GammaOutcome.UNEVALUABLE);
  assert.equal(result.assertedRelations.length, 0);
});

check("contradictory existence states are CONFLICTED", () => {
  const result = resolveGamma({
    registry: relationRegistry,
    object: M,
    context: asContext(T),
    authoritativeObjects: [M, T],
    relationRecords: [currentRecord(), currentRecord({ EXISTENCE_STATE: "NONE" })]
  });
  assert.equal(result.outcome, GammaOutcome.CONFLICTED);
});

check("source-defined conditional type fails closed without current authority", () => {
  const instrument = authObj("I", "INSTRUMENT");
  const invariant = authObj("K", "INVARIANT_CANDIDATE");
  const result = resolveGamma({
    registry: relationRegistry,
    object: instrument,
    context: asContext(invariant),
    authoritativeObjects: [instrument, invariant],
    relationRecords: [currentRecord({
      RELATION_ID: "C1",
      RELATION_TYPE: "TESTS_CANDIDATE",
      FROM_OBJECT: instrument.identity,
      TO_OBJECT: invariant.identity,
      AUTHORITY_POINTERS: null,
      AUTHORITY_STATUS: "UNRESOLVED"
    })]
  });
  assert.equal(result.outcome, GammaOutcome.UNEVALUABLE);
  assert.equal(result.assertedRelations.length, 0);
});

check("capacity relation is rejected from object-level Gamma", () => {
  const result = resolveGamma({
    registry: relationRegistry,
    object: M,
    context: asContext(T),
    authoritativeObjects: [M, T],
    relationRecords: [currentRecord({ RELATION_TYPE: "ORIENTS_TO" })]
  });
  assert.equal(result.outcome, GammaOutcome.UNEVALUABLE);
  assert.equal(result.assertedRelations.length, 0);
  assert.equal(result.rejectedRecords[0].reason, "RELATION_TYPE_NOT_REGISTERED_FOR_OBJECT_GAMMA");
});

check("scientific standing is preserved, not translated into SUPPORTS or CHALLENGES", () => {
  const evidence = authObj("E", "EVIDENCE");
  const claim = authObj("Q", "CLAIM");
  const result = resolveGamma({
    registry: relationRegistry,
    object: evidence,
    context: asContext(claim),
    authoritativeObjects: [evidence, claim],
    relationRecords: [currentRecord({
      RELATION_ID: "E1",
      RELATION_TYPE: "EVIDENCE_BEARING_ON",
      FROM_OBJECT: evidence.identity,
      TO_OBJECT: claim.identity,
      SCIENTIFIC_STANDING: "CONTRADICTED",
      CLAIM_CEILING: "BOUNDARY_ONLY",
      CONTEXT_SCOPE: { scope: "claim-assessment" }
    })]
  });
  assert.equal(result.outcome, GammaOutcome.ASSERTED);
  assert.equal(result.assertedRelations[0].scientificStanding, "CONTRADICTED");
  assert.ok(!result.assertedRelations.some((r) => r.relationType === "CHALLENGES" || r.relationType === "SUPPORTS"));
});

check("missing required evidentiary standing is UNEVALUABLE", () => {
  const evidence = authObj("E2", "EVIDENCE");
  const claim = authObj("Q2", "CLAIM");
  const result = resolveGamma({
    registry: relationRegistry,
    object: evidence,
    context: asContext(claim),
    authoritativeObjects: [evidence, claim],
    relationRecords: [currentRecord({
      RELATION_ID: "E2_EDGE",
      RELATION_TYPE: "EVIDENCE_BEARING_ON",
      FROM_OBJECT: evidence.identity,
      TO_OBJECT: claim.identity,
      SCIENTIFIC_STANDING: null,
      CLAIM_CEILING: "BOUNDARY_ONLY",
      CONTEXT_SCOPE: { scope: "claim-assessment" }
    })]
  });
  assert.equal(result.outcome, GammaOutcome.UNEVALUABLE);
});

check("reverse contextual view does not invent an inverse relation", () => {
  const result = resolveGamma({
    registry: relationRegistry,
    object: T,
    context: asContext(M),
    authoritativeObjects: [M, T],
    relationRecords: [currentRecord()]
  });
  assert.equal(result.outcome, GammaOutcome.ASSERTED);
  assert.equal(result.assertedRelations[0].fromObject, "M");
  assert.equal(result.assertedRelations[0].toObject, "T");
});

check("identical inputs resolve deterministically", () => {
  const args = {
    registry: relationRegistry,
    object: M,
    context: asContext(T),
    authoritativeObjects: [M, T],
    relationRecords: [currentRecord(), currentRecord({ RELATION_ID: "R2", RELATION_TYPE: "GOVERNS_PROCEDURE_FOR" })]
  };
  assert.equal(JSON.stringify(resolveGamma(args)), JSON.stringify(resolveGamma(args)));
});

console.log(JSON.stringify({
  verifier: "LAWS_CONTEXTUAL_GAMMA_RESOLVER_VERIFIER_v1",
  status: "PASS",
  frozenRelationRegistry: relationRegistry.schema,
  nativePositiveControlSource: sourceDescriptor,
  checks,
  productMutation: false,
  spatialReprojection: false,
  contextGraphConstruction: false
}, null, 2));
