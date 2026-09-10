import fs from "node:fs";
import path from "node:path";
import cp from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => fs.readFileSync(path.join(here, name), "utf8");
const json = (name) => JSON.parse(read(name));
const manifest = json("candidate-manifest.v1.json");
const sourceMap = json("adapter-source-map.v1.json");
const html = read("index.html");
const css = read("manifestation.css");
const runtime = read("manifestation.mjs");

const adapterFiles = [
  "tests-compass-entry-adapter.v1.mjs",
  "tests-compass-return-adapter.v1.mjs",
  "tests-field-state-adapter.v1.mjs",
  "tests-focus-adapter.v1.mjs",
  "tests-neighbor-projection-adapter.v1.mjs",
  "tests-depth-transformation-adapter.v1.mjs",
  "tests-direct-manipulation-adapter.v1.mjs",
  "tests-responsive-projection-adapter.v1.mjs",
  "tests-continuity-state-adapter.v1.mjs"
];
const adapters = Object.fromEntries(adapterFiles.map((name) => [name, read(`adapters/${name}`)]));

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

const expectedObjects = [
  ["METHODS", "METHOD"],
  ["ROUTE_OPERATOR_PLATFORM", "METHOD"],
  ["PROSPECTIVE_FINAL_REPORT_PORTFOLIO", "TEST_INSTANCE"]
];
const expectedRelations = [
  ["METHODS__GOVERNS_PROCEDURE_FOR__PROSPECTIVE_FINAL_REPORT_PORTFOLIO", "METHODS", "GOVERNS_PROCEDURE_FOR", "PROSPECTIVE_FINAL_REPORT_PORTFOLIO"],
  ["ROUTE_OPERATOR_PLATFORM__EXECUTES__PROSPECTIVE_FINAL_REPORT_PORTFOLIO", "ROUTE_OPERATOR_PLATFORM", "EXECUTES", "PROSPECTIVE_FINAL_REPORT_PORTFOLIO"]
];

// Construction authority and baseline identity.
eq("manifest.schema", manifest.schema, "TESTS_L0_L1_COMPASS_INTEGRATED_M1_CANDIDATE_v1");
eq("manifest.candidate", manifest.candidateId, "M1_COMPASS_INTEGRATED");
eq("authority.anchor", manifest.constructionAuthorityAnchor, "9eb936918ce063cef6c6f5d800f39ae966f3d3aa");
eq("baseline.candidate", manifest.scientificBaseline.candidateHead, "9370bba7841b8a831f7f1c034d0b74fb83dab2e0");
eq("baseline.promotion", manifest.scientificBaseline.promotionMerge, "391c3543fd048bac90493232f04973911468d3eb");
check("invariant.O", manifest.differentialConstraint.O_integrated_equals_O_isolated === true);
check("invariant.R", manifest.differentialConstraint.R_integrated_equals_R_isolated === true);
check("invariant.A", manifest.differentialConstraint.A_integrated_equals_A_isolated === true);
check("invariant.N", manifest.differentialConstraint.N_integrated_differs_from_N_isolated === true);

// Exact M1 subject and operation remain unchanged.
deepEq("objects.exact", manifest.objects.map((o) => [o.OBJECT_ID, o.OBJECT_CLASS]), expectedObjects);
deepEq("relations.exact", manifest.relations.map((r) => [r.RELATION_ID, r.SOURCE_OBJECT, r.RELATION, r.TARGET_OBJECT]), expectedRelations);
deepEq("scientific.operations", manifest.implementedScientificOperations, ["FOCUS"]);
eq("projection", manifest.projection.id, "METHODS");
eq("object.count", manifest.projection.objectCount, 3);
eq("relation.count", manifest.projection.relationCount, 2);
check("m1r2.preserved", manifest.comparisonBaseline.m1r2Preserved === true && manifest.comparisonBaseline.m1r2RewriteAuthorized === false && manifest.comparisonBaseline.m1r2EntryAuthorized === false);

// Authorized layer boundary only.
eq("layer.-1", manifest.layerBoundary.L_MINUS_1_ORIENTATION, "MANIFESTED");
eq("layer.L0", manifest.layerBoundary.L0, "MANIFESTED");
eq("layer.L1", manifest.layerBoundary.L1, "MANIFESTED");
check("layers.deep.withheld", [manifest.layerBoundary.L2, manifest.layerBoundary.L3, manifest.layerBoundary.L4].every((v) => v === "WITHHELD"));

// All and only nine admitted capabilities enter through required adapters.
deepEq("capabilities", manifest.navigationCapabilities, ["C01","C02","C03","C04","C05","C06","C07","C08","C09"]);
eq("source.map.count", sourceMap.records.length, 9);
deepEq("source.map.ids", sourceMap.records.map((r) => r.capabilityId), ["C01","C02","C03","C04","C05","C06","C07","C08","C09"]);
check("source.map.adapter.disposition", sourceMap.records.every((r) => r.requiredAdapter && r.semanticInheritance === false));
check("source.map.excluded.donors", sourceMap.excludedDonors.length === 4);
check("adapter.file.count", Object.keys(adapters).length === 9);

const requiredAdapterIds = [
  "TESTS_COMPASS_ENTRY_ADAPTER_v1",
  "TESTS_COMPASS_RETURN_ADAPTER_v1",
  "TESTS_FIELD_STATE_ADAPTER_v1",
  "TESTS_FOCUS_ADAPTER_v1",
  "TESTS_NEIGHBOR_PROJECTION_ADAPTER_v1",
  "TESTS_DEPTH_TRANSFORMATION_ADAPTER_v1",
  "TESTS_DIRECT_MANIPULATION_ADAPTER_v1",
  "TESTS_RESPONSIVE_PROJECTION_ADAPTER_v1",
  "TESTS_CONTINUITY_STATE_ADAPTER_v1"
];
check("adapter.ids.present", requiredAdapterIds.every((id) => Object.values(adapters).some((text) => text.includes(`ADAPTER_ID = \"${id}\"`))));
check("capability.ids.present", ["C01","C02","C03","C04","C05","C06","C07","C08","C09"].every((id) => Object.values(adapters).some((text) => text.includes(`CAPABILITY_ID = \"${id}\"`))));
check("runtime.imports.9.adapters", adapterFiles.every((name) => runtime.includes(`./adapters/${name}`)));
check("runtime.no.donor.import", !runtime.includes("/assets/compass/") && !runtime.includes("laws/index.controller.js"));

// Destination-bound Tests semantics and noninheritance.
check("manifest.no.donor.runtime", manifest.donorRuntimeImports === false);
check("manifest.no.donor.semantic", manifest.donorSemanticInheritance === false);
check("manifest.no.research.copy", manifest.researchContentCopied === false);
check("manifest.no.laws.inheritance", manifest.lawsSemanticInheritance === false);
check("manifest.no.excluded.donor", manifest.excludedDonorsPresent === false);
check("manifest.no.public.route", manifest.publicOrLiveRouteMutation === false);
check("manifest.no.claim.upgrade", manifest.scientificClaimUpgrade === false);
check("manifest.geometry.no.authority", manifest.presentationGeometrySemanticAuthority === false);

const manifestationSurface = `${html}\n${css}\n${runtime}\n${Object.values(adapters).join("\n")}`.toLowerCase();
for (const forbidden of ["constellation", "crystal", "cardinal", "mirrorland", "archcoin", "h-earth", "showroom compass", "laws test", "laws research"]) {
  check(`surface.no.donor.semantic:${forbidden}`, !manifestationSurface.includes(forbidden), forbidden);
}

// Runtime preserves baseline scientific constraints while adding navigation.
check("runtime.registry.binding", runtime.includes("../tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json"));
check("runtime.registry.fail.closed", runtime.includes("validateRegistry") && runtime.includes("failClosed") && runtime.includes("Candidate field withheld"));
check("runtime.exact.object.ids", expectedObjects.every(([id]) => runtime.includes(`id: \"${id}\"`)));
check("runtime.exact.relation.ids", expectedRelations.every(([id]) => runtime.includes(`id: \"${id}\"`)));
check("runtime.focus.only", runtime.includes('operation: "FOCUS"') && !runtime.includes('operation: "FOLLOW"') && !runtime.includes('operation: "ENTER"'));
check("runtime.pointer", runtime.includes("pointerdown") && runtime.includes("pointermove") && runtime.includes("pointercancel"));
check("runtime.wheel", runtime.includes('addEventListener("wheel"'));
check("runtime.keyboard", runtime.includes("ArrowRight") && runtime.includes("ArrowLeft") && runtime.includes("Home") && runtime.includes("End"));
check("runtime.return.context", runtime.includes("restoreTestsPriorContext") && runtime.includes("restoreEntryContext"));
check("runtime.depth", runtime.includes("transitionTestsDepth") && runtime.includes('"L0"') && runtime.includes('"L1"'));
check("runtime.neighbor.retention", runtime.includes("projectTestsNeighbors"));
check("runtime.responsive", runtime.includes("calculateTestsProjection") && runtime.includes('addEventListener("resize"'));
check("runtime.continuity", runtime.includes("snapshotTestsContinuity") && runtime.includes("restoreTestsContinuity"));
check("runtime.no.location", !runtime.includes("location.href") && !runtime.includes("window.open") && !runtime.includes("history.pushState") && !runtime.includes("history.replaceState"));

// Presentation keeps Tests orientation and M1 relations legible.
check("html.candidate", html.includes('data-candidate="M1_COMPASS_INTEGRATED"'));
check("html.layers", html.includes('data-layer-boundary="L_MINUS_1_L0_L1"'));
check("html.tests.orientation", html.includes("Tests environment") && html.includes("Methods operational field"));
check("html.l0.controls", ["METHODS","MODELS","EXPERIMENTS","EVIDENCE"].every((id) => html.includes(`data-projection="${id}"`)));
check("html.nonmethods.disabled", ["MODELS","EXPERIMENTS","EVIDENCE"].every((id) => new RegExp(`data-projection="${id}"[^>]*disabled`).test(html)));
check("html.relation.arrow", html.includes('id="relation-arrow"'));
check("html.relation.key", html.includes('id="relation-key-items"'));
check("html.return.context", html.includes('id="restore-entry-context"'));
check("html.depth.controls", html.includes('data-depth="L0"') && html.includes('data-depth="L1"'));
check("html.no.public.links", !/<a\b/i.test(html) && !html.includes('href="/'));
check("css.active.primacy", css.includes('.object-node[data-active="true"]'));
check("css.responsive", css.includes("@media (max-width: 620px)"));
check("css.reduced.motion", css.includes("prefers-reduced-motion: reduce"));
check("css.directional.relations", css.includes("marker-end: url(#relation-arrow)"));

// Syntax check every executable module.
for (const file of ["manifestation.mjs", "verify.v1.mjs", ...adapterFiles.map((name) => `adapters/${name}`)]) {
  const result = cp.spawnSync(process.execPath, ["--check", path.join(here, file)], { encoding: "utf8" });
  check(`syntax:${file}`, result.status === 0, result.stderr || result.stdout);
}

const result = {
  schema: "TESTS_L0_L1_COMPASS_INTEGRATED_M1_STRUCTURAL_VERIFICATION_v1",
  candidateId: manifest.candidateId,
  authorityAnchor: manifest.constructionAuthorityAnchor,
  status: failures.length === 0 ? "PASS_M1_COMPASS_INTEGRATED_STRUCTURAL_CONFORMANCE" : "FAIL_M1_COMPASS_INTEGRATED_STRUCTURAL_CONFORMANCE",
  assertions,
  failures,
  objectCount: manifest.projection.objectCount,
  relationCount: manifest.projection.relationCount,
  scientificOperations: manifest.implementedScientificOperations,
  navigationCapabilities: manifest.navigationCapabilities,
  donorRuntimeImports: manifest.donorRuntimeImports,
  donorSemanticInheritance: manifest.donorSemanticInheritance,
  publicOrLiveRouteMutation: manifest.publicOrLiveRouteMutation,
  runtimeReview: "NOT_ESTABLISHED_BY_THIS_VERIFIER",
  perceptualReview: "NOT_ESTABLISHED_BY_THIS_VERIFIER",
  baselineRegression: "NOT_ESTABLISHED_BY_THIS_VERIFIER",
  exactHeadCertification: "NOT_ESTABLISHED_BY_THIS_VERIFIER",
  promotion: "WITHHELD"
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
