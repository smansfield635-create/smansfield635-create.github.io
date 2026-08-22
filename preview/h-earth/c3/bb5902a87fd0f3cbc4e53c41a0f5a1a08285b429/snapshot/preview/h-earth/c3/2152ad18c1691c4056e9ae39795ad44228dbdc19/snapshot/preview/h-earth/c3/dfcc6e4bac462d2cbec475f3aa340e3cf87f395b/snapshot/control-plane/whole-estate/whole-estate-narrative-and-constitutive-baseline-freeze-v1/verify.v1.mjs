import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const fail = (code, detail) => {
  console.error(`${code}: ${detail}`);
  process.exit(1);
};

const baseline = read("baseline-identities.v1.json");
const inventory = read("route-and-room-inventory.v1.json");
const narrative = read("narrative-journey-map.v1.json");
const crosswalk = read("relationship-crosswalk.v1.json");
const authority = read("authority-and-ownership-matrix.v1.json");
const claims = read("claim-boundary-matrix.v1.json");
const provenance = read("provenance-ledger.v1.json");
const changes = read("prospective-change-register.v1.json");

if (baseline.governingBaseline.main !== "3f51f0cd159df33571905c6cb14253ebdd137e3b" ||
    baseline.governingBaseline.tree !== "3116d5c35bfdd575922dac614fb2e9f1d4f61ec5") {
  fail("FAIL_BASELINE_IDENTITY_DRIFT", "governing main or tree changed");
}

if (baseline.currentMainDeltaAfterGate0?.pr !== 712 ||
    baseline.currentMainDeltaAfterGate0?.classification !== "H_EARTH_REGISTRY_PREREQUISITE_ONLY" ||
    baseline.currentMainDeltaAfterGate0?.publicSurfaceMutation !== false ||
    baseline.currentMainDeltaAfterGate0?.previewOrDeploymentAuthorizedByThisDelta !== false) {
  fail("FAIL_CURRENT_MAIN_DELTA_CLASSIFICATION", "PR712 current-main delta is missing or over-authorized");
}

const expectedBlobs = {
  mainCompass: "1cc9a1de90bb58de6463bafe52a1b1f91c5bef4a",
  manorRouteRegistry: "f7e72cb61e02ff3001ae059d0ad73e6d7a75986f",
  siteGuide: "ca5a10863121d8fbabbf87080ae29a54946dd349",
  laws: "df2fc6b74da5791cedf07f0d01449ccf72243c36",
  lawsResearch: "58b06514bf03bf8c32d8c1ed4d6d39a8693df9cd",
  methodsModels: "2a84f9a272d051041dd639d95e1dca4dbd5db144",
  coherenceDiagnostic: "ffb0e320e73eed49ccd4c90c16b1256f9fcdb253",
  frontier: "e95d2b96c735da4bb9a3efd67a374cdb60197c2e",
  products: "76f506b3eb56c2210e8f403fd58e6f9d8439fe35",
  characters: "abafc0bc1f4b6538028833c47103596411ff3f3a",
  showroom: "6393e9882ad61331056afb51aad090a31f75ce3b",
  gauges: "869b4a9c63a6bbfbadc1ca88599f9a0e7f73a708",
  sitemap: "185c1d9901e418586ae36121542e41a7ede95b66"
};
for (const [key, sha] of Object.entries(expectedBlobs)) {
  if (baseline.publicSurfaceBlobs[key]?.sha !== sha) {
    fail("FAIL_PUBLIC_BASELINE_HASH_DRIFT", `${key} hash mismatch`);
  }
}

if (inventory.manorDeclaredRoutes.length !== 32) {
  fail("FAIL_ROUTE_INVENTORY_INCOMPLETE", `expected 32 Manor routes, found ${inventory.manorDeclaredRoutes.length}`);
}

const compassRooms = Object.values(inventory.compassDeclaredRooms).flat();
if (compassRooms.length !== 19 || inventory.routeAuthority.compassDeclaredRoomCount !== 19) {
  fail("FAIL_COMPASS_ROOM_INVENTORY", "Compass must preserve exactly 19 declared rooms");
}

const roles = new Set(inventory.roleEnum);
for (const required of ["FOUNDATION","ORIENTATION","EPISTEMIC_LAW","MEASUREMENT","DIAGNOSIS","APPLICATION","IMPLEMENTATION","PROVENANCE"]) {
  if (!roles.has(required)) fail("FAIL_ROLE_ENUM", `missing ${required}`);
}
for (const route of inventory.manorDeclaredRoutes) {
  if (!roles.has(route.primaryRole)) fail("FAIL_ROUTE_ROLE", `${route.id} has invalid role`);
}

const scientific = new Map(inventory.scientificAndProvenanceRoutes.map((x) => [x.id, x]));
if (scientific.get("ucic")?.primaryRole !== "FOUNDATION" || scientific.get("ucic")?.scientificObject !== "INVARIANT_CANDIDATE") {
  fail("FAIL_UCIC_CLASSIFICATION", "UCIC foundation/invariant-candidate identity lost");
}
if (scientific.get("imi")?.primaryRole !== "MEASUREMENT" || scientific.get("imi")?.scientificObject !== "INSTRUMENT") {
  fail("FAIL_IMI_CLASSIFICATION", "IMI measurement/instrument identity lost");
}

const defects = new Set(inventory.knownBaselineDefects.map((x) => x.id));
for (const required of ["SITEMAP_INCOMPLETE","MEET_SEAN_ROUTE_MISMATCH","GUIDE_DESK_STATUS_MISMATCH","COMPASS_ROUTE_REGISTRY_SCOPE_DIFFERENCE","UCIC_NO_DEDICATED_PUBLIC_ROUTE","IMI_NO_DEDICATED_PUBLIC_ROUTE","GATE0_CONSTITUTIONAL_EDGE_TENSION"]) {
  if (!defects.has(required)) fail("FAIL_DEFECT_ERASURE", `missing preserved defect ${required}`);
}

if (narrative.journey.length !== 9 || narrative.journey[0].estateObject !== "COMPASS" || narrative.journey.at(-1).estateObject !== "RECEIPTS_RESEARCH_RECORDS") {
  fail("FAIL_NARRATIVE_SPINE", "nine-stage explanatory journey is incomplete");
}
if (narrative.directEntryAllowed !== true || narrative.compassRemainsOrientationAuthority !== true) {
  fail("FAIL_ORIENTATION_AUTHORITY", "direct entry or Compass authority lost");
}
if (narrative.spatialDesignIntentForLaterCheckpoints.xyzOrganizationalRepresentationRequired !== true ||
    narrative.spatialDesignIntentForLaterCheckpoints.readingSurfacesPrimarily2d !== true ||
    narrative.spatialDesignIntentForLaterCheckpoints.interfaceScientificAuthority !== false) {
  fail("FAIL_SPATIAL_INTENT_DRIFT", "X/Y/Z or 2D-reading/interface boundary changed");
}

const relationByObject = new Map(crosswalk.relationships.map((x) => [x.object, x]));
if (relationByObject.get("UCIC")?.primaryRole !== "FOUNDATION" || relationByObject.get("IMI")?.primaryRole !== "MEASUREMENT") {
  fail("FAIL_RELATIONSHIP_CONFLATION", "UCIC/IMI relationship changed");
}
if (relationByObject.get("COHERENCE_DIAGNOSTIC")?.primaryRole !== "DIAGNOSIS" || relationByObject.get("FRONTIER")?.primaryRole !== "APPLICATION") {
  fail("FAIL_APPLICATION_ROLE_DRIFT", "Diagnostic or Frontier role changed");
}

const authorityById = new Map(authority.entries.map((x) => [x.id, x]));
if (!authorityById.get("COHERENCE_DIAGNOSTIC")?.forbiddenAuthority.includes("MEDICAL_DIAGNOSIS")) {
  fail("FAIL_DIAGNOSTIC_AUTHORITY", "medical-diagnosis prohibition missing");
}
if (!authorityById.get("INTERFACE_3D")?.forbiddenAuthority.includes("SCIENTIFIC_STATE_MUTATION")) {
  fail("FAIL_INTERFACE_AUTHORITY", "3D scientific-state prohibition missing");
}

const claimById = new Map(claims.claims.map((x) => [x.id, x]));
const pr709 = claimById.get("PR709_EXTERNAL_SPECIFICITY");
if (!pr709 || pr709.registeredEvidenceCeiling !== "EXPLORATORY_EXTERNAL_ROUTE_CONCORDANCE_AND_SPECIFICITY_SUPPORT_ONLY" ||
    !pr709.requiredQualifiers.includes("OUTCOME_BLINDNESS_NOT_ESTABLISHED") ||
    !pr709.requiredQualifiers.includes("UNIVERSALITY_NOT_ESTABLISHED")) {
  fail("FAIL_PR709_CLAIM_CEILING", "PR709 retrospective specificity ceiling drifted");
}
if (baseline.postGate0EvidenceDelta.prospectiveConfirmation !== "NOT_ESTABLISHED" || baseline.postGate0EvidenceDelta.universality !== "NOT_ESTABLISHED") {
  fail("FAIL_EVIDENCE_PROMOTION", "post-Gate-0 evidence was promoted beyond its registered ceiling");
}

const evidenceClasses = new Set(provenance.evidenceClasses);
for (const required of ["STRONG_CONTEMPORANEOUS","PARTIAL_CONTEMPORANEOUS","RETROSPECTIVE_INTERPRETATION"]) {
  if (!evidenceClasses.has(required)) fail("FAIL_PROVENANCE_CLASS", `missing ${required}`);
}
if (!provenance.entries.some((x) => x.id === "WHOLE_ESTATE_BUILT_THROUGH_COHERENCE" && x.classification === "PARTIAL_CONTEMPORANEOUS")) {
  fail("FAIL_PROVENANCE_OVERCLAIM", "whole-estate construction provenance is not bounded");
}
if (!provenance.entries.some((x) => x.id === "PR712_H_EARTH_REGISTRY_PREREQUISITE" && x.claimCeiling === "REGISTRY_PREREQUISITE_AND_AUTHORITY_STATE_ONLY")) {
  fail("FAIL_CURRENT_MAIN_PROVENANCE", "PR712 current-main provenance is missing or overclaimed");
}

if (changes.registrationBaseline !== "3f51f0cd159df33571905c6cb14253ebdd137e3b") {
  fail("FAIL_PROSPECTIVE_BASELINE_DRIFT", "prospective change register is not bound to governing main");
}
if (changes.entries.length !== 7 || changes.entries[0].checkpoint !== 2 || changes.entries.at(-1).checkpoint !== 8) {
  fail("FAIL_PROSPECTIVE_REGISTER", "Checkpoints 2 through 8 must be registered");
}
if (changes.entries.some((x) => x.status !== "REGISTERED_NOT_EXECUTED" || x.publicMutationAuthorized !== false)) {
  fail("FAIL_PREMATURE_EXECUTION", "future checkpoint marked executed or publicly authorized");
}
if (changes.userVisualApprovalRequiredBeforePublicFacingMerge !== true || baseline.deployment.userVisualApprovalRequiredBeforePublicFacingMerge !== true) {
  fail("FAIL_VISUAL_APPROVAL_GATE", "user visual approval gate missing");
}

for (const obj of [baseline, inventory, narrative, crosswalk, authority, claims, provenance]) {
  if (obj.publicMutationAuthorized !== false && obj.deployment?.publicPageMutation !== false) {
    fail("FAIL_PUBLIC_MUTATION_AUTHORITY", `${obj.schema} does not fail closed on public mutation`);
  }
}

console.log("PASS_WHOLE_ESTATE_NARRATIVE_AND_CONSTITUTIVE_BASELINE_FREEZE_v1");
