import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const ROOT = process.cwd();
const PKG = "control-plane/methods-information-benchmark/methods-semantic-interaction-topology-authority-reanchor-v1";
const files = {
  reanchor: `${PKG}/authority-reanchor.v1.json`,
  topology: `${PKG}/semantic-interaction-topology-contract.v1.json`,
  binding: `${PKG}/embodiment-binding-contract.v1.json`,
  gates: `${PKG}/contextual-architecture-hard-gates.v1.json`,
  fixtures: `${PKG}/adversarial-fixtures.v1.json`,
  f2Axis: "control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f2-canonical-state-kernel/axis-registry.v1.json",
  f4Objects: "control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f4-scientific-content-binding/scientific-object-registry.v1.json",
  f4Methods: "control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f4-scientific-content-binding/method-content-registry.v1.json",
  preF8Objects: "control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/scientific-object-inventory.v1.json",
  preF8Relations: "control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/pre-f8-corrective-construction-v1/study-result-to-claim-typed-relation-registry.v1.json",
  f7Interaction: "control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f7-interaction-and-accessibility/interaction-contract.v1.json",
  f8Geometry: "control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f8-spatial-xyz-semantic-layer/geometry-contract.v1.json"
};

const failures = [];
const passes = [];
const assert = (condition, id, detail = "") => {
  if (condition) passes.push({id, detail});
  else failures.push({id, detail});
};
const abs = rel => path.join(ROOT, rel);
const load = rel => JSON.parse(fs.readFileSync(abs(rel), "utf8"));
const sha256 = rel => crypto.createHash("sha256").update(fs.readFileSync(abs(rel))).digest("hex");

for (const [key, rel] of Object.entries(files)) assert(fs.existsSync(abs(rel)), `FILE_EXISTS_${key.toUpperCase()}`, rel);
if (failures.length) finish();

const reanchor = load(files.reanchor);
const topology = load(files.topology);
const binding = load(files.binding);
const gates = load(files.gates);
const fixtures = load(files.fixtures);
const f2Axis = load(files.f2Axis);
const f4Objects = load(files.f4Objects);
const f4Methods = load(files.f4Methods);
const preF8Objects = load(files.preF8Objects);
const preF8Relations = load(files.preF8Relations);
const f7Interaction = load(files.f7Interaction);
const f8Geometry = load(files.f8Geometry);

assert(String(reanchor.status || "").startsWith("PASS_REANCHORING"), "REANCHOR_PASS_BOUND", reanchor.status);
assert(reanchor.boundary?.construction === "PROHIBITED" && reanchor.boundary?.pageMutation === "PROHIBITED" && reanchor.boundary?.manifestationCandidate === "NONE", "REANCHOR_NO_CONSTRUCTION_BOUNDARY");
const disposition = new Map((reanchor.authorityDisposition || []).map(x => [x.id, x.disposition]));
assert(disposition.get("F8_SLOT_GRID_AS_TOPOLOGY") === "FORBIDDEN_INHERITANCE", "F8_SLOT_GRID_FORBIDDEN");
assert(disposition.get("LEGACY_FOUR_FAMILIES_AS_CANONICAL_CLASSES") === "FORBIDDEN_INHERITANCE", "LEGACY_FOUR_FAMILIES_FORBIDDEN");
assert(disposition.get("LEGACY_25_RECORDS_AS_PEER_SCIENTIFIC_OBJECTS") === "FORBIDDEN_INHERITANCE", "LEGACY_25_FORBIDDEN");
assert(disposition.get("LEGACY_EXACT_LENS_TAXONOMY") === "FORBIDDEN_INHERITANCE", "LEGACY_LENS_FORBIDDEN");

assert(topology.topology?.components?.join("|") === "N*|C*|A*|L*|DELTA*|P*", "TOPOLOGY_COMPONENTS_EXACT");
assert(topology.N?.forbiddenCanonicalPopulations?.includes("LEGACY_FOUR_PRESENTATION_FAMILIES"), "N_REJECTS_LEGACY_FAMILIES");
assert(topology.N?.forbiddenCanonicalPopulations?.includes("LEGACY_25_PRESENTATION_RECORDS_AS_PEER_SCIENTIFIC_OBJECTS"), "N_REJECTS_LEGACY_25");
assert(topology.C?.visualEnclosureCreatesContainment === false && topology.C?.presentationGroupingCreatesContainment === false, "C_NO_PRESENTATION_INFERENCE");
assert(topology.A?.visualProximityCreatesAdjacency === false && topology.A?.thematicSimilarityCreatesAdjacency === false, "A_NO_PROXIMITY_OR_THEME_INFERENCE");
assert(topology.A?.claimCeilingPromotionByEdge === false, "A_NO_CLAIM_CEILING_PROMOTION");
assert(topology.L?.unrelatedControlPanelAsPrimaryDirectLocus === false, "L_NO_UNRELATED_PRIMARY_LOCUS");
assert(topology.P?.identityInvariantUnder?.includes("PERSPECTIVE") && topology.P?.identityInvariantUnder?.includes("DEPTH"), "P_NONSCIENTIFIC_PERSISTENCE");
assert(topology.auditTrace?.hardGateMembership === false, "CAUSAL_TRACE_NOT_FIFTH_GATE");
assert(topology.explicitNonAuthority?.manifestationCandidate === "NONE" && topology.explicitNonAuthority?.pageConstructionAuthority === "WITHHELD", "TOPOLOGY_CONSTRUCTION_WITHHELD");

const expectedBindingClasses = ["ENTITY", "METHOD_STAGE", "DECLARED_RELATION", "ACCESS_SURFACE", "NONSEMANTIC"];
assert(expectedBindingClasses.every(k => Object.hasOwn(binding.bindingClasses || {}, k)) && Object.keys(binding.bindingClasses || {}).length === expectedBindingClasses.length, "BINDING_CLASSES_EXACT");
assert(binding.bindingClasses?.NONSEMANTIC?.manipulable === false && binding.bindingClasses?.NONSEMANTIC?.allowedOperations?.length === 0, "NONSEMANTIC_NOT_MANIPULABLE");
assert(binding.accessRouteEquivalence?.requiredEqualities?.join("|") === "REGISTERED_OPERATION|SEMANTIC_TARGET|SEMANTIC_OUTCOME", "ROUTE_EQUIVALENCE_BINDING_EXACT");
assert(binding.explicitNonAuthority?.pageConstructionAuthority === "WITHHELD" && binding.explicitNonAuthority?.manifestationCandidate === "NONE", "BINDING_CONSTRUCTION_WITHHELD");

const expectedGates = ["I_EMBODIMENT", "I_LOCUS", "I_ORIENTATION", "I_ROUTE_EQUIVALENCE"];
assert(gates.conjunction?.operator === "AND", "HARD_GATE_OPERATOR_AND");
assert(JSON.stringify(gates.conjunction?.terms) === JSON.stringify(expectedGates), "HARD_GATE_TERMS_EXACT");
assert(gates.frozenGateCount === 4 && gates.fifthGateAdded === false, "HARD_GATE_COUNT_FROZEN_FOUR");
assert(gates.conjunction?.aggregateScoreOverrideAllowed === false, "NO_AGGREGATE_OVERRIDE");
assert(gates.auditRequirementsNonGate?.includes("ACTION_TARGET_TRANSFORMATION_INFORMATION_DELTA_TRACE"), "AUDIT_TRACE_PRESENT_NON_GATE");

assert(Array.isArray(f4Methods.sequence) && f4Methods.sequence.length === 15 && f4Methods.methodId === "METHODS", "F4_METHOD_SEQUENCE_15");
assert(f4Methods.sequence.every((s, i) => s.order === i + 1 && Array.isArray(s.requires)), "F4_METHOD_SEQUENCE_ORDER_AND_DEPENDENCIES");
const freeze = f4Methods.sequence.find(x => x.id === "PREDICTION_HASH_AND_FREEZE");
const unblind = f4Methods.sequence.find(x => x.id === "AUTHORIZED_UNBLINDING");
assert(freeze?.requires?.includes("ROUTE_AND_COMPARATOR_SUBMISSION"), "METHOD_FREEZE_DEPENDENCY");
assert(unblind?.requires?.includes("PREDICTION_HASH_AND_FREEZE") && unblind?.requires?.includes("OUTCOME_SEQUESTRATION"), "METHOD_UNBLINDING_JOINT_DEPENDENCY");

const f4Classes = new Set((f4Objects.objects || []).map(x => x.objectClass));
assert(["INSTRUMENT", "INVARIANT_CANDIDATE", "METHOD", "MODEL", "TEST_INSTANCE", "INTERFACE_STATE"].every(x => f4Classes.has(x)), "F4_OBJECT_CLASS_DISTINCTIONS");
const preClasses = new Set((preF8Objects.objects || []).map(x => x.class));
assert(preClasses.has("COMPARATOR") && preClasses.has("FORMAL_DERIVATION") && preClasses.has("REJECTED_MODEL"), "PRE_F8_CLASS_DISTINCTIONS");
assert(preF8Relations.authoritativeGranularity === "RESULT_TO_SPECIFIC_CLAIM", "TYPED_RELATION_GRANULARITY");
assert((preF8Relations.laws || []).includes("THEMATIC_SIMILARITY_IS_NOT_DECLARED_SCIENTIFIC_RELATION"), "TYPED_RELATION_NO_THEME_INFERENCE");
assert((preF8Relations.laws || []).includes("NO_RELATION_EDGE_MAY_PROMOTE_SOURCE_CLAIM_CEILING"), "TYPED_RELATION_NO_CEILING_PROMOTION");

assert(f2Axis.axes?.LENS?.meaningBearing === false && f2Axis.axes?.VIEW_MODE?.meaningBearing === false, "F2_REPRESENTATION_NON_MEANING_BEARING");
assert(f2Axis.axes?.SCIENTIFIC_OBJECT?.identityBearing === true, "F2_SCIENTIFIC_OBJECT_IDENTITY_BEARING");
assert((f7Interaction.laws || []).includes("MODALITY_CHANGE_MAY_NOT_CHANGE_OPERATION_SEMANTICS"), "F7_MODALITY_EQUIVALENCE");
assert((f7Interaction.laws || []).includes("INTERACTION_MAY_NOT_CHANGE_SCIENTIFIC_OBJECT_IDENTITY_BY_FOCUS_OR_MODALITY"), "F7_IDENTITY_NONMUTATION");
assert(f8Geometry.layoutMode === "DETERMINISTIC_SEMANTIC_SLOT_GRID_v1", "F8_LEGACY_SLOT_GRID_IDENTIFIED");

const forbiddenSources = new Set(binding.forbiddenBindingSources || []);
function evaluateFixture(f) {
  const i = f.input || {};
  switch (f.type) {
    case "NODE_ADMISSION":
      return forbiddenSources.has(i.source) || topology.N.forbiddenCanonicalPopulations.includes(i.source) ? "REJECT" : "ACCEPT";
    case "TOPOLOGY_SOURCE":
      return forbiddenSources.has(i.source) || i.source === "F8_DETERMINISTIC_SLOT_GRID" || i.source === "ABSENCE_OF_CURRENT_AUTHORITY" ? "REJECT" : "ACCEPT";
    case "CONTAINMENT":
      if (i.source === "LEGACY_FAMILY_LENS_RECORD_NESTING" || i.inferred === true) return "REJECT";
      if (i.source === "F4_METHOD_SEQUENCE" && i.relation === "CONTAINS_METHOD_STAGE") return "ACCEPT";
      if (i.source === "NONE" && i.inferred === false) return "ACCEPT";
      return "REJECT";
    case "ADJACENCY":
      if (i.raisesClaimCeiling === true || i.source === "VISUAL_PROXIMITY" || i.source === "THEMATIC_SIMILARITY") return "REJECT";
      if (i.source === "F4_METHOD_SEQUENCE" && i.relation === "REQUIRES" && i.declared === true) return "ACCEPT";
      if (i.source === "PRE_F8_TYPED_RESULT_CLAIM_RELATION" && i.declared === true) return "ACCEPT";
      return "REJECT";
    case "LOCUS":
      if (i.bindingClass === "NONSEMANTIC") return "REJECT";
      if (i.bindingClass === "DECLARED_RELATION") return i.relationDeclared === true && i.relationMatch === true ? "ACCEPT" : "REJECT";
      return i.explicitBinding === true && i.targetMatch === true ? "ACCEPT" : "REJECT";
    case "ROUTE_EQUIVALENCE":
      return i.operationEqual === true && i.targetEqual === true && i.semanticOutcomeEqual === true ? "ACCEPT" : "REJECT";
    case "TRANSITION": {
      const op = topology.DELTA.operations?.[i.operation];
      if (!op) return "REJECT";
      return i.scientificMutation === false && op.scientificMutation === false ? "ACCEPT" : "REJECT";
    }
    default:
      return "REJECT";
  }
}

for (const groupName of ["positive", "negative"]) {
  for (const fixture of fixtures[groupName] || []) {
    const actual = evaluateFixture(fixture);
    assert(actual === fixture.expected, `FIXTURE_${fixture.id}`, `expected=${fixture.expected} actual=${actual}`);
  }
}

finish();

function finish() {
  const contractFiles = [files.reanchor, files.topology, files.binding, files.gates, files.fixtures].filter(rel => fs.existsSync(abs(rel)));
  const receipt = {
    schema: "METHODS_SEMANTIC_TOPOLOGY_FRESH_VERIFICATION_RECEIPT_v1",
    status: failures.length === 0 ? "PASS" : "FAIL",
    verifiedAt: new Date().toISOString(),
    checks: {passed: passes.length, failed: failures.length},
    hardGates: {defined: failures.length === 0, terms: ["I_EMBODIMENT", "I_LOCUS", "I_ORIENTATION", "I_ROUTE_EQUIVALENCE"], count: 4, causalTraceIsAdditionalGate: false},
    terminalPosture: {
      minimumAuthorizedOntology: "AVAILABLE_BOUNDED",
      semanticInteractionTopology: failures.length === 0 ? "AVAILABLE_BOUNDED" : "BLOCKED",
      embodimentBindingContract: failures.length === 0 ? "AVAILABLE" : "BLOCKED",
      legacySemanticInheritance: failures.length === 0 ? "BLOCKED" : "UNVERIFIED",
      manifestationCandidate: "NONE",
      manifestationConformance: "NOT_EVALUABLE",
      pageConstructionAuthority: "WITHHELD",
      publicMutation: "NONE",
      scientificClaimUpgrade: "NONE"
    },
    fingerprints: Object.fromEntries(contractFiles.map(rel => [rel, sha256(rel)])),
    failures
  };
  fs.writeFileSync(abs("methods-semantic-topology-verification.receipt.json"), JSON.stringify(receipt, null, 2) + "\n");
  console.log(JSON.stringify(receipt, null, 2));
  if (failures.length) process.exit(1);
}
