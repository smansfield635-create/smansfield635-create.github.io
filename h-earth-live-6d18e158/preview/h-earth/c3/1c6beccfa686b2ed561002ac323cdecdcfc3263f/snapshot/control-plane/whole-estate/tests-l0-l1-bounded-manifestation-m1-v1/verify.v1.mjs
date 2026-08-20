import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => fs.readFileSync(path.join(here, name), "utf8");
const readJson = (name) => JSON.parse(read(name));

const manifest = readJson("candidate-manifest.v1.json");
const html = read("index.html");
const css = read("manifestation.css");
const js = read("manifestation.mjs");
const registry = JSON.parse(fs.readFileSync(path.join(here, "../tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json"), "utf8"));

let assertions = 0;
const failures = [];

function check(name, condition, details = null) {
  assertions += 1;
  if (!condition) failures.push({ name, details });
}

function eq(name, actual, expected) {
  check(name, Object.is(actual, expected), { actual, expected });
}

function deepEq(name, actual, expected) {
  check(name, JSON.stringify(actual) === JSON.stringify(expected), { actual, expected });
}

function sorted(values) {
  return [...values].sort();
}

const expectedObjects = [
  ["METHODS", "METHOD"],
  ["ROUTE_OPERATOR_PLATFORM", "METHOD"],
  ["PROSPECTIVE_FINAL_REPORT_PORTFOLIO", "TEST_INSTANCE"]
];

const expectedRelations = [
  ["METHODS__GOVERNS_PROCEDURE_FOR__PROSPECTIVE_FINAL_REPORT_PORTFOLIO", "METHODS", "GOVERNS_PROCEDURE_FOR", "PROSPECTIVE_FINAL_REPORT_PORTFOLIO"],
  ["ROUTE_OPERATOR_PLATFORM__EXECUTES__PROSPECTIVE_FINAL_REPORT_PORTFOLIO", "ROUTE_OPERATOR_PLATFORM", "EXECUTES", "PROSPECTIVE_FINAL_REPORT_PORTFOLIO"]
];

// Candidate identity and promoted-source anchoring.
eq("manifest.schema", manifest.schema, "WHOLE_ESTATE_TESTS_L0_L1_BOUNDED_MANIFESTATION_CANDIDATE_v1");
eq("manifest.operation", manifest.operation, "TESTS_L0_L1_BOUNDED_MANIFESTATION_M1_v1");
eq("manifest.candidateId", manifest.candidateId, "M1_TESTS_METHODS_OPERATIONAL_FIELD");
eq("manifest.status", manifest.status, "BOUNDED_NONPUBLIC_L0_L1_MANIFESTATION_CANDIDATE");
eq("manifest.base", manifest.constructionBaseMain, "64d0ea7673d1ecb61372a0dd8b127b889157da1d");
eq("authority.contract.blob", manifest.governingAuthority.authorityContract.blob, "0bfab791c005ca71cee771a5d14d27f8dfab3177");
eq("registry.contract.blob", manifest.governingAuthority.registryContract.blob, "ed969c87359c42444c477a752f332f07f0059a30");
eq("registry.promoted.blob", manifest.governingAuthority.promotedRegistry.blob, "b801a11e342051a6b00e6f7098b1d691685ad0b6");
eq("registry.promotion.merge", manifest.governingAuthority.promotedRegistry.promotionMerge, "64d0ea7673d1ecb61372a0dd8b127b889157da1d");

// Layer boundary: exactly L0/L1 for this construction object.
eq("layer.L0", manifest.layerBoundary.L0, "MANIFESTED");
eq("layer.L1", manifest.layerBoundary.L1, "MANIFESTED");
check("layer.L2.withheld", manifest.layerBoundary.L2_INSPECTION.startsWith("WITHHELD"));
check("layer.L3.follow.withheld", manifest.layerBoundary.L3_FOLLOW.startsWith("WITHHELD"));
check("layer.L3.provenance.withheld", manifest.layerBoundary.L3_PROVENANCE_ROUTE.startsWith("WITHHELD"));
check("layer.L4.withheld", manifest.layerBoundary.L4_ENTER.startsWith("WITHHELD"));

// Projection and L0 controls.
eq("projection.id", manifest.projection.id, "METHODS");
eq("projection.count", manifest.projection.projectionCount, 1);
eq("projection.objectCount", manifest.projection.objectCount, 3);
eq("projection.relationCount", manifest.projection.relationCount, 2);
eq("projection.completeness.false", manifest.projection.corpusCompletenessClaim, false);
eq("projection.ontology.false", manifest.projection.projectionMembershipCreatesOntology, false);
eq("l0.control.count", manifest.l0Controls.length, 4);
deepEq("l0.control.ids", manifest.l0Controls.map((control) => control.id), ["METHODS", "MODELS", "EXPERIMENTS", "EVIDENCE"]);
eq("l0.enabled.count", manifest.l0Controls.filter((control) => control.enabled).length, 1);
eq("l0.active.count", manifest.l0Controls.filter((control) => control.active).length, 1);
eq("l0.methods.enabled", manifest.l0Controls.find((control) => control.id === "METHODS")?.enabled, true);
check("l0.nonmethods.disabled", manifest.l0Controls.filter((control) => control.id !== "METHODS").every((control) => control.enabled === false && control.populationStatus === "UNAUTHORIZED_IN_THIS_CANDIDATE"));

// Exact bounded object and relation population.
deepEq("manifest.objects", manifest.objects.map((object) => [object.OBJECT_ID, object.OBJECT_CLASS]), expectedObjects);
deepEq("manifest.relations", manifest.relations.map((relation) => [relation.RELATION_ID, relation.SOURCE_OBJECT, relation.RELATION, relation.TARGET_OBJECT]), expectedRelations);
eq("registry.schema", registry.schema, "WHOLE_ESTATE_TESTS_L0_L1_OBJECT_PROJECTION_REGISTRY_v1");
eq("registry.projection", registry.projectionSelection.PROJECTION, "METHODS");
eq("registry.object.count", registry.objects.length, 3);
eq("registry.relation.count", registry.relations.length, 2);
deepEq("registry.objects", expectedObjects.map(([id, className]) => [id, className]), expectedObjects.map(([id]) => {
  const object = registry.objects.find((candidate) => candidate.OBJECT_ID === id);
  return [object?.OBJECT_ID, object?.OBJECT_CLASS];
}));
deepEq("registry.relations", expectedRelations, expectedRelations.map(([id]) => {
  const relation = registry.relations.find((candidate) => candidate.RELATION_ID === id);
  return [relation?.RELATION_ID, relation?.SOURCE_OBJECT, relation?.RELATION, relation?.TARGET_OBJECT];
}));
check("registry.object.authority", registry.objects.every((object) => object.AUTHORITY_SOURCE === "GATE0_CANONICAL_HIERARCHY" && object.AUTHORITY_POINTER));
check("registry.relation.authority", registry.relations.every((relation) => relation.AUTHORITY_SOURCE === "GATE0_CANONICAL_HIERARCHY" && relation.AUTHORITY_POINTER));
check("registry.deep.entry.false", registry.objects.every((object) => object.DEEP_ENTRY_AVAILABLE === false && object.DEEP_ENTRY_TARGET === null));
eq("registry.m1r2.withheld", registry.deepEntryBoundary.status, "WITHHELD_DEEP_ENTRY_AUTHORITY_UNRESOLVED_FOR_SELECTED_PARENT_BINDING");

// Only FOCUS is implemented; no L2/L3/L4 operation is smuggled in.
deepEq("interaction.operations", manifest.interactionBoundary.implementedOperations, ["FOCUS"]);
eq("interaction.focus.scienceMutation.false", manifest.interactionBoundary.focusMutatesScientificState, false);
eq("interaction.inspect.false", manifest.interactionBoundary.inspectionImplemented, false);
eq("interaction.follow.false", manifest.interactionBoundary.followImplemented, false);
eq("interaction.enter.false", manifest.interactionBoundary.enterImplemented, false);
check("runtime.no.inspect.operation", !js.includes('operation: "INSPECT"') && !js.includes("operation = \"INSPECT\""));
check("runtime.no.follow.operation", !js.includes('operation: "FOLLOW"') && !js.includes("operation = \"FOLLOW\""));
check("runtime.no.enter.operation", !js.includes('operation: "ENTER"') && !js.includes("operation = \"ENTER\""));
check("runtime.focus.present", js.includes('operation: "FOCUS"') && js.includes("setActiveObject"));
check("runtime.keyboard.focus.present", js.includes("ArrowRight") && js.includes("ArrowLeft") && js.includes("Home") && js.includes("End"));
check("runtime.pointer.focus.present", js.includes('"POINTER_OR_ACTIVATION"'));
check("runtime.fail.closed.present", js.includes("failClosed") && js.includes("Manifestation withheld"));

// Runtime source binding and direction-preserving visual relation grammar.
check("runtime.registry.sibling.fetch", js.includes("../tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json"));
check("runtime.registry.validation", js.includes("validateRegistry") && js.includes("RELATION_DIRECTION_OR_IDENTITY_MISMATCH"));
check("runtime.exact.object.ids", expectedObjects.every(([id]) => js.includes(`id: \"${id}\"`)));
check("runtime.exact.relation.ids", expectedRelations.every(([id]) => js.includes(`id: \"${id}\"`)));
check("runtime.target.clearance", js.includes("const targetClearance = 12"));
check("runtime.marker.binding", js.includes('marker-end') && js.includes("url(#relation-arrow)"));
check("runtime.state.only.active.focus", js.includes("activeObject") && js.includes("semanticMutation: false"));
check("runtime.no.navigation.sideeffects", !js.includes("location.href") && !js.includes("window.open") && !js.includes("history.pushState") && !js.includes("history.replaceState"));

// HTML semantic and public-boundary checks.
check("html.candidate.id", html.includes('data-candidate="M1_TESTS_METHODS_OPERATIONAL_FIELD"'));
check("html.layer.boundary", html.includes('data-layer-boundary="L0_L1_ONLY"'));
check("html.nonsemantic.field", html.includes('data-semantic-layout="NONSEMANTIC"'));
check("html.four.l0.controls", ["METHODS", "MODELS", "EXPERIMENTS", "EVIDENCE"].every((id) => html.includes(`data-projection="${id}"`)));
check("html.nonmethods.disabled", ["MODELS", "EXPERIMENTS", "EVIDENCE"].every((id) => new RegExp(`data-projection="${id}"[^>]*disabled`).test(html)));
check("html.relation.arrow.marker", html.includes('id="relation-arrow"') && html.includes('marker id="relation-arrow"'));
check("html.relation.key", html.includes('id="relation-key-items"'));
check("html.focus.status", html.includes('id="focus-status"') && html.includes('aria-live="polite"'));
check("html.no.links", !/<a\b/i.test(html));
check("html.no.public.route", !html.includes("/laws/") && !html.includes("/showroom/") && !html.includes("href=\"/"));
check("html.boundary.visible", html.includes("L2 inspection") && html.includes("L3 FOLLOW") && html.includes("L4 ENTER / M1R2"));

// Perceptual and responsive construction constraints.
eq("perceptual.activePrimacy", manifest.perceptualContract.onePerceptuallyDominantActiveL1Object, true);
eq("perceptual.neighborsRetained", manifest.perceptualContract.neighboringObjectsSpatiallyRetained, true);
eq("perceptual.fieldMovement", manifest.perceptualContract.fieldLikeAttentionMovement, true);
eq("perceptual.verticalPrimary.false", manifest.perceptualContract.ordinaryVerticalDocumentTranslationAsPrimaryGrammar, false);
eq("perceptual.directionalConnectors", manifest.perceptualContract.directionalRelationConnectorsRequired, true);
check("css.three.spatial.slots", css.includes('data-slot="primary"') && css.includes('data-slot="secondary-left"') && css.includes('data-slot="secondary-right"'));
check("css.active.primacy", css.includes('.object-node[data-active="true"]'));
check("css.focus.visible", css.includes(":focus-visible"));
check("css.mobile.breakpoint", css.includes("@media (max-width: 430px)"));
check("css.reduced.motion", css.includes("prefers-reduced-motion: reduce"));
check("css.relation.direction.presentation", css.includes("marker-end: url(#relation-arrow)"));

// Nonsemantic spatial laws and mutation boundaries.
check("nonsemantic.all.false", Object.values(manifest.nonSemanticSpatiality).every((value) => value === false));
eq("deep.m1r2.class", manifest.deepEntryBoundary.m1r2Classification, "VALID_DEEP_PROCEDURAL_INSTRUMENT");
eq("deep.enter.absent", manifest.deepEntryBoundary.enterControlPresent, false);
eq("deep.parent.inference.false", manifest.deepEntryBoundary.parentBindingInferred, false);
eq("deep.m1r2.mutation.false", manifest.deepEntryBoundary.m1r2MutationAuthorized, false);
eq("population.placeholders.zero", manifest.populationBoundary.placeholderObjects, 0);
eq("population.invented.objects.zero", manifest.populationBoundary.inventedObjects, 0);
eq("population.invented.relations.zero", manifest.populationBoundary.inventedRelations, 0);
eq("population.models.false", manifest.populationBoundary.broaderModelsPopulation, false);
eq("population.experiments.false", manifest.populationBoundary.broaderExperimentsPopulation, false);
eq("population.evidence.false", manifest.populationBoundary.broaderEvidencePopulation, false);
eq("population.research.copy.false", manifest.populationBoundary.researchContentCopied, false);
check("mutation.all.false", Object.values(manifest.mutationBoundary).every((value) => value === false));

const result = {
  schema: "WHOLE_ESTATE_TESTS_L0_L1_BOUNDED_MANIFESTATION_STATIC_VERIFICATION_v1",
  candidateId: manifest.candidateId,
  status: failures.length === 0 ? "PASS_BOUNDED_NONPUBLIC_L0_L1_STATIC_CONFORMANCE" : "FAIL_BOUNDED_NONPUBLIC_L0_L1_STATIC_CONFORMANCE",
  assertions,
  failures,
  constructionBaseMain: manifest.constructionBaseMain,
  projection: manifest.projection.id,
  objectCount: manifest.projection.objectCount,
  relationCount: manifest.projection.relationCount,
  implementedOperations: manifest.interactionBoundary.implementedOperations,
  layerBoundary: manifest.layerBoundary,
  publicMutation: manifest.mutationBoundary.publicMutation,
  scientificClaimUpgrade: manifest.mutationBoundary.scientificClaimUpgrade,
  m1r2DeepEntry: manifest.deepEntryBoundary.status,
  runtimeInteractionEvidence: "NOT_ESTABLISHED_BY_THIS_VERIFIER",
  accessibilityResponsiveEvidence: "NOT_ESTABLISHED_BY_THIS_VERIFIER",
  perceptualEvidence: "NOT_ESTABLISHED_BY_THIS_VERIFIER"
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
