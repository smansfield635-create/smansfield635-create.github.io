import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const fail = (code, detail) => {
  console.error(`${code}: ${detail}`);
  process.exit(1);
};

const objectModel = read("universal-object-model.v1.json");
const hierarchy = read("canonical-hierarchy.v1.json");
const legacy = read("legacy-mapping.v1.json");
const state = read("evidence-and-execution-state.v1.json");
const methods = read("methods-sequence.v1.json");
const models = read("model-registry.v1.json");
const human3d = read("human-and-3d-integration-contract.v1.json");

const expectedClasses = [
  "INSTRUMENT",
  "INVARIANT_CANDIDATE",
  "METHOD",
  "MODEL",
  "TEST_INSTANCE",
  "EVIDENCE_OBJECT",
  "COMPARATOR",
  "TERMINAL_DISPOSITION",
  "INTERFACE_STATE"
];

const classIds = new Set(objectModel.objectClasses.map((x) => x.id));
for (const id of expectedClasses) {
  if (!classIds.has(id)) fail("FAIL_AMBIGUITY_REMAINS", `missing object class ${id}`);
}

if (new Set(objectModel.objectClasses.map((x) => x.canonicalInstance)).size !== objectModel.objectClasses.length) {
  fail("FAIL_SCIENTIFIC_OBJECT_CONFLATION", "canonical instances are not unique");
}

if (legacy.legacyMutationAuthorized !== false || legacy.legacyImmutability !== true) {
  fail("FAIL_LEGACY_MUTATION", "legacy immutability is not preserved");
}

const rejectedLegacy = new Set(
  legacy.mappings.filter((x) => x.disposition === "REJECT_AS_CONFLICTING").map((x) => x.legacy)
);
for (const id of ["PRESSURE_AND_CAPACITY_AS_UNIVERSAL_IMI", "GLOBAL_PRODUCT_AS_GOVERNING_MODEL"]) {
  if (!rejectedLegacy.has(id)) fail("FAIL_SCIENTIFIC_OBJECT_CONFLATION", `missing rejection ${id}`);
}

if (state.scientificBindings.globalProductRejected !== true ||
    state.scientificBindings.multiplicativeSpecificity !== false ||
    state.prospectiveExecution.scientificResult !== "NONE" ||
    state.prospectiveExecution.outcomeAccess !== "PROHIBITED") {
  fail("FAIL_EVIDENCE_STATE_CONFLATION", "scientific or prospective state is misstated");
}

const requiredTerminal = new Set([
  "UCIC_FALSE",
  "UCIC_UNDERDEFINED",
  "UCIC_REDUNDANT",
  "UCIC_SURVIVES_PROSPECTIVE_FINAL_REPORT_PORTFOLIO",
  "UNEVALUABLE_CUSTODY_OR_POWER_FAILURE"
]);
for (const id of requiredTerminal) {
  if (!state.terminalDispositions.includes(id)) {
    fail("FAIL_EVIDENCE_STATE_CONFLATION", `missing terminal disposition ${id}`);
  }
}

if (methods.sequence.length !== 15 ||
    methods.sequence[0].id !== "TARGET_REGISTRATION" ||
    methods.sequence.at(-1).id !== "TERMINAL_DISPOSITION" ||
    methods.averageScoreMayConcealGateFailure !== false) {
  fail("FAIL_AMBIGUITY_REMAINS", "methods sequence or noncompensatory rule is incomplete");
}

const pressure = models.models.find((x) => x.id === "PRESSURE_AND_CAPACITY_MODEL");
if (!pressure || pressure.role !== "BOUNDED_SUPPORTING_LENS" || pressure.globalProduct !== false) {
  fail("FAIL_SCIENTIFIC_OBJECT_CONFLATION", "Pressure & Capacity is not bounded correctly");
}

if (models.comparatorParityRequired !== true) {
  fail("FAIL_AMBIGUITY_REMAINS", "comparator parity is not required");
}

if (human3d.semanticTextPrimary !== true ||
    human3d.synchronizedTextAnd3dStateRequired !== true ||
    human3d.scientificAuthority !== false ||
    human3d.freeCameraAsSolePrimaryInterface !== false) {
  fail("FAIL_INTERFACE_SCIENCE_CONFLATION", "human/3D authority boundary is invalid");
}

const hierarchyMap = new Map(hierarchy.nodes.map((x) => [x.id, x.class]));
if (hierarchyMap.get("IMI") !== "INSTRUMENT" ||
    hierarchyMap.get("UCIC") !== "INVARIANT_CANDIDATE" ||
    hierarchyMap.get("PRESSURE_AND_CAPACITY") !== "MODEL") {
  fail("FAIL_SCIENTIFIC_OBJECT_CONFLATION", "canonical hierarchy classification is invalid");
}

console.log("PASS_UNIVERSAL_INTEGRATION_NORMALIZED");
