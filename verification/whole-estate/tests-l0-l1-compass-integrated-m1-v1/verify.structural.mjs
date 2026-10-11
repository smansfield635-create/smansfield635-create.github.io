import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const AUTHORITY = "9eb936918ce063cef6c6f5d800f39ae966f3d3aa";
const PACKAGE = "control-plane/whole-estate/tests-l0-l1-compass-integrated-m1-v1";
const VERIFY = "verification/whole-estate/tests-l0-l1-compass-integrated-m1-v1";
const WORKFLOW = ".github/workflows/tests-l0-l1-compass-integrated-m1-structural.yml";
const RECEIPT = process.env.M1_COMPASS_STRUCTURAL_RECEIPT || "/tmp/m1-compass-integrated-structural-receipt.v1.json";

let assertions = 0;
const failures = [];
function check(condition, id, detail = "") {
  assertions += 1;
  if (!condition) failures.push({ id, detail });
}
function read(relative) { return fs.readFileSync(path.join(ROOT, relative), "utf8"); }
function json(relative) { return JSON.parse(read(relative)); }
function git(...args) { return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function blob(relative, ref = "HEAD") { return git("rev-parse", `${ref}:${relative}`); }
function sha256(content) { return crypto.createHash("sha256").update(content).digest("hex"); }

const changed = git("diff", "--name-status", `${AUTHORITY}..HEAD`).split("\n").filter(Boolean).map((line) => {
  const [status, ...rest] = line.split("\t");
  return { status, file: rest.at(-1) };
});
const allowedPrefix = `${PACKAGE}/`;
check(changed.length >= 7, "CANDIDATE_HAS_SUBSTANTIVE_ADDITIVE_SCOPE", String(changed.length));
for (const entry of changed) {
  check(entry.status === "A", `ADDITIVE_ONLY:${entry.file}`, entry.status);
  check(entry.file.startsWith(allowedPrefix) || entry.file.startsWith(`${VERIFY}/`) || entry.file === WORKFLOW, `AUTHORIZED_PATH_ONLY:${entry.file}`);
}

const protectedSources = {
  "control-plane/whole-estate/compass-tests-architecture-binding-v1/binding-contract.v1.json": "52ce1e12dc2a07c90e7eaae350f97015b2f28179",
  "control-plane/whole-estate/compass-tests-architecture-binding-v1/donor-capability-map.v1.json": "6bd625bd63bc0bbdec4a629e8c5058f65284924f",
  "control-plane/whole-estate/compass-tests-architecture-binding-v1/donor-noninheritance-ledger.v1.json": "10777cb94ca72e694ab6ab5372f53ddd9441aadc",
  "control-plane/whole-estate/tests-l0-l1-bounded-manifestation-m1-v1/candidate-manifest.v1.json": "e18c382c7f82bd3335f69bcf752198c0c10e66a9",
  "control-plane/whole-estate/tests-l0-l1-bounded-manifestation-m1-v1/index.html": "1dab5d948af7326db1213f6b0ff3c92acdce6246",
  "control-plane/whole-estate/tests-l0-l1-bounded-manifestation-m1-v1/manifestation.mjs": "93773f7ecff4036e531f6db1a672850919cee7c5",
  "control-plane/whole-estate/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json": "b801a11e342051a6b00e6f7098b1d691685ad0b6"
};
for (const [file, expected] of Object.entries(protectedSources)) check(blob(file) === expected, `PROTECTED_SOURCE_IDENTITY:${file}`, blob(file));

const manifest = json(`${PACKAGE}/candidate-manifest.v1.json`);
check(manifest.candidateId === "M1_COMPASS_INTEGRATED", "CANDIDATE_ID");
check(manifest.constructionAuthorityAnchor === AUTHORITY, "AUTHORITY_ANCHOR");
check(manifest.fixedScientificSubject.projection === "METHODS", "PROJECTION_METHODS");
check(manifest.fixedScientificSubject.objectCount === 3 && manifest.fixedScientificSubject.objects.length === 3, "OBJECT_COUNT_3");
check(manifest.fixedScientificSubject.relationCount === 2 && manifest.fixedScientificSubject.relations.length === 2, "RELATION_COUNT_2");
check(manifest.differentialConstraint.O_integrated_equals_O_isolated === true, "O_INVARIANT");
check(manifest.differentialConstraint.R_integrated_equals_R_isolated === true, "R_INVARIANT");
check(manifest.differentialConstraint.A_integrated_equals_A_isolated === true, "A_INVARIANT");
check(manifest.differentialConstraint.N_integrated_differs_from_N_isolated === true, "N_DIFFERENTIAL");
check(JSON.stringify(manifest.navigationBoundary.layers) === JSON.stringify(["L_MINUS_1_ORIENTATION","L0","L1"]), "LAYER_BOUNDARY");
check(JSON.stringify(manifest.navigationBoundary.operations) === JSON.stringify(["FOCUS"]), "FOCUS_ONLY");
check(manifest.researchBoundary.researchContentCopied === false, "RESEARCH_NOT_COPIED");
check(manifest.publicBoundary.publicRouteCreated === false && manifest.publicBoundary.liveRouteMutated === false, "NO_PUBLIC_MUTATION");

const capabilities = manifest.approvedCapabilities.map((item) => item.capabilityId);
check(JSON.stringify(capabilities) === JSON.stringify(["C01","C02","C03","C04","C05","C06","C07","C08","C09"]), "ALL_NINE_CAPABILITIES_EXACTLY_ONCE");
check(manifest.approvedCapabilities.every((item) => item.disposition === "ADMIT_WITH_ADAPTER"), "ALL_CAPABILITIES_ADAPTER_GATED");

const adapters = read(`${PACKAGE}/compass-tests.adapters.mjs`);
const implementation = read(`${PACKAGE}/manifestation.mjs`);
const html = read(`${PACKAGE}/index.html`);
const css = read(`${PACKAGE}/manifestation.css`);
const ledger = json(`${PACKAGE}/source-authority-ledger.v1.json`);

for (const item of manifest.approvedCapabilities) {
  check(adapters.includes(item.capabilityId), `ADAPTER_HAS_CAPABILITY:${item.capabilityId}`);
  check(adapters.includes(item.adapter), `ADAPTER_ID_PRESENT:${item.adapter}`);
}
for (const pin of ledger.donorImplementationPins) {
  check(adapters.includes(pin.blob), `DONOR_BLOB_PINNED_IN_ADAPTERS:${pin.donorId}`);
}
check(!/from\s+["'](?:\.\.\/)+.*(?:assets\/compass|laws\/index\.controller)/.test(adapters + implementation), "NO_WHOLE_DONOR_IMPORT");
check(implementation.includes("../tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json"), "REGISTRY_IS_DESTINATION_AUTHORITY");
check(implementation.includes("GATE0_CANONICAL_HIERARCHY"), "RUNTIME_REVALIDATES_AUTHORITY_SOURCE");
check(implementation.includes("WITHHELD_DEEP_ENTRY_AUTHORITY_UNRESOLVED_FOR_SELECTED_PARENT_BINDING"), "M1R2_DEEP_ENTRY_WITHHELD");
check(implementation.includes("semanticMutation: false"), "NAVIGATION_MUTATION_DECLARED_NONSEMANTIC");
check(html.includes("L2 INSPECT withheld") && html.includes("L3 FOLLOW / provenance withheld") && html.includes("L4 ENTER / M1R2 withheld"), "WITHHELD_LAYERS_VISIBLE");
check(!/<a\b/i.test(html), "NO_ROUTE_ANCHORS");
check(!/showroom\/|archcoin|h-earth/i.test(adapters + implementation + html + css), "EXCLUDED_IMPLEMENTATION_DONORS_ABSENT");
check(!/research[^\n]{0,80}(dataset|finding|analysis|study|paper)/i.test(adapters + implementation + html), "NO_RESEARCH_CONTENT_DUPLICATION_PATTERN");
check(css.includes("perspective") && css.includes("transform-style: preserve-3d") && implementation.includes("translate3d"), "SPATIAL_3D_INFORMATION_TABS_PRESENT");
check(html.includes("projection-tab") && html.includes("information-tab") === false, "HTML_USES_RUNTIME_INFORMATION_OBJECTS");
check(implementation.includes("className = \"information-tab\""), "INFORMATION_OBJECTS_CREATED_AS_SPATIAL_TABS");
check(implementation.includes("renderRelations(registry)"), "DECLARED_RELATIONS_RENDERED");
check(!implementation.includes("M1R2_METHOD_PROCEDURE_FIELD"), "M1R2_NOT_INSTANTIATED");

const receipt = {
  schema: "TESTS_L0_L1_COMPASS_INTEGRATED_M1_STRUCTURAL_RECEIPT_v1",
  authorityAnchor: AUTHORITY,
  candidateHead: git("rev-parse", "HEAD"),
  result: failures.length ? "FAIL_BOUNDED_COMPASS_INTEGRATED_M1_STRUCTURAL_CONFORMANCE" : "PASS_BOUNDED_COMPASS_INTEGRATED_M1_STRUCTURAL_CONFORMANCE",
  assertions,
  failures,
  changedPaths: changed,
  fixedScientificSubject: { projection: manifest.fixedScientificSubject.projection, objectCount: 3, relationCount: 2 },
  capabilities,
  sourceLedgerSha256: sha256(read(`${PACKAGE}/source-authority-ledger.v1.json`)),
  candidateManifestSha256: sha256(read(`${PACKAGE}/candidate-manifest.v1.json`)),
  evidenceBoundary: {
    runtimeReview: "NOT_ESTABLISHED_BY_THIS_RECEIPT",
    perceptualReview: "NOT_ESTABLISHED_BY_THIS_RECEIPT",
    baselineRegression: "NOT_ESTABLISHED_BY_THIS_RECEIPT",
    exactHeadCertification: "NOT_ESTABLISHED_BY_THIS_RECEIPT",
    promotionAuthority: false
  }
};
fs.mkdirSync(path.dirname(RECEIPT), { recursive: true });
fs.writeFileSync(RECEIPT, JSON.stringify(receipt, null, 2) + "\n");
console.log(JSON.stringify({ result: receipt.result, assertions, failures: failures.length, failureDetails: failures, receipt: RECEIPT }, null, 2));
if (failures.length) process.exit(1);
