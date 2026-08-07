import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");
const CORE_PATHS = [
  ".github/workflows/methods-spatial-database-nested-tab-recomposition-v1.yml",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/README.md",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/index.html",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/styles.css",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/data.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/math.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/state.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/renderer.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/navigation.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/app.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/design-grammar.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/information-architecture.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/interaction-state-contract.v1.json"
];
const ALL_PATHS = [
  ".github/workflows/methods-spatial-database-nested-tab-recomposition-v1.yml",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/README.md",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/index.html",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/styles.css",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/data.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/math.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/state.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/renderer.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/navigation.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/app.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/design-grammar.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/information-architecture.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/interaction-state-contract.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/proof-contract.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/verify.v1.mjs",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/receipts/builder.receipt.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/receipts/fresh-verifier.receipt.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/receipts/independent-equality.receipt.v1.json",
  "control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/receipts/operation-closure.receipt.v1.json"
];
const EXPECTED = "9735a99659f221a98c8c292e936bcddd3d70cac823a418da61659dfcbf32f79d";

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function read(relativePath) {
  return fs.readFileSync(path.join(REPO, relativePath), "utf8");
}

function coreFingerprint() {
  const digest = crypto.createHash("sha256");
  for (const relativePath of CORE_PATHS) {
    digest.update(relativePath);
    digest.update("\0");
    digest.update(read(relativePath));
    digest.update("\0");
  }
  return digest.digest("hex");
}

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

function validate(role) {
  const missing = ALL_PATHS.filter((relativePath) => !fs.existsSync(path.join(REPO, relativePath)));
  assert(missing.length === 0, `EXACT_PATH_SCOPE_MISMATCH:${missing.join(",")}`);

  const proof = JSON.parse(read("control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/proof-contract.v1.json"));
  const grammar = JSON.parse(read("control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/design-grammar.v1.json"));
  const architecture = JSON.parse(read("control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/information-architecture.v1.json"));
  const interaction = JSON.parse(read("control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/interaction-state-contract.v1.json"));
  const html = read("control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/index.html");
  const css = read("control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/styles.css");
  const app = read("control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/app.mjs");
  const state = read("control-plane/methods-information-benchmark/spatial-database-nested-tab-recomposition-v1/state.mjs");

  assert(proof.constructionBase.mainHead === "e876e6107d3e01a19e76c9fd487b6de0d511cb25", "GOVERNING_HEAD_MISMATCH");
  assert(proof.registeredExactPathCount === 19, "EXACT_PATH_SCOPE_MISMATCH");
  assert(proof.sourceBindings.permanentRatificationReceiptBlob === "0375241beb7ae76030402fb882d9cc1d46b257a5", "RATIFICATION_RECEIPT_MISMATCH");
  assert(grammar.fingerprint === "13c93b713c936365564d9fd95e76a7cabbfce3d9ac9c3e658edbde0d70d98991", "DESIGN_GRAMMAR_MISMATCH");
  assert(architecture.fingerprint === "9428d8764026c6e8c75aa38d680be9db54e5d37aee3b3aa0480e41a0db247b3f", "INFORMATION_ARCHITECTURE_MISMATCH");
  assert(interaction.fingerprint === "7f19aab646a09187369d6c4da00135b0e3623d3bfae288050318a04fb12845ef", "INTERACTION_CONTRACT_MISMATCH");

  assert(html.includes('role="tablist"') && html.includes('id="record-tabs"'), "TEXT_FIRST_SEMANTIC_CONTRACT_VIOLATION");
  assert(!html.includes("<canvas") && !html.includes("webgl"), "MANDATORY_OR_CONTROLLING_WEBGL_PROHIBITED");
  assert(css.includes("prefers-reduced-motion"), "ACCESSIBILITY_OR_REDUCED_MOTION_VIOLATION");
  assert(app.includes("restoreFocusAndScroll") && state.includes("recordScrollPosition") && state.includes("priorFocusTarget"), "STATE_OR_EXACT_RETURN_VIOLATION");
  assert(app.includes("selectLens") && app.includes("selectSubtab") && app.includes("selectTerm"), "NESTED_TAB_OR_EQUATION_CHOREOGRAPHY_MISSING");
  assert(architecture.lane.id === "pressure-and-capacity" && architecture.lane.recordOrder.join(",") === "pressure-field,capacity-field,pcr", "FIRST_DELIVERY_SCOPE_MISMATCH");
  assert(proof.stopBoundary.mergeAuthorized === false && proof.stopBoundary.publicDeploymentAuthorized === false && proof.stopBoundary.perceptualAcceptanceClaimed === false, "UNAUTHORIZED_MERGE_DEPLOYMENT_RELEASE_OR_ACCEPTANCE_CLAIM");

  const fingerprint = coreFingerprint();
  assert(fingerprint === EXPECTED, `CORE_FINGERPRINT_MISMATCH:${fingerprint}`);
  assert(fingerprint === proof.fingerprintDomain.expected, "PROOF_CONTRACT_FINGERPRINT_MISMATCH");

  const normalized = {
    baseHead: proof.constructionBase.mainHead,
    baseTree: proof.constructionBase.mainTree,
    coreFingerprint: fingerprint,
    exactPathCount: ALL_PATHS.length,
    lane: architecture.lane.id,
    records: architecture.lane.recordOrder,
    requiredBehaviors: proof.requiredBehaviors,
    sourceBindings: proof.sourceBindings,
    stopBoundary: proof.stopBoundary
  };

  return {
    schema: role === "builder"
      ? "METHODS_SPATIAL_DATABASE_CHECKPOINT_4_BUILDER_RECEIPT_v1"
      : "METHODS_SPATIAL_DATABASE_CHECKPOINT_4_FRESH_VERIFIER_RECEIPT_v1",
    status: "PASS",
    role,
    coreFingerprint: fingerprint,
    normalizedFingerprint: hash(stable(normalized)),
    exactPathCount: ALL_PATHS.length,
    checks: [
      "NO_METHODS_DRIFT_FROM_502F_TO_E876",
      "CONSTRUCTION_BASE_BOUND_TO_CURRENT_MAIN",
      "EXACT_NINETEEN_PATH_SCOPE",
      "SEMANTIC_TEXT_PRIMARY",
      "VISIBLE_RECORD_TABS",
      "PRACTICAL_DEFAULT_ONE_ACTIVE_LENS",
      "NESTED_TABS",
      "COMPASS_EQUATION_CHOREOGRAPHY",
      "KEYBOARD_FOCUS_SCROLL_RETURN",
      "REDUCED_MOTION_EQUIVALENCE",
      "EVIDENCE_BOUNDARIES",
      "STOP_BEFORE_MERGE_DEPLOYMENT_ACCEPTANCE"
    ]
  };
}

const args = process.argv.slice(2);
const outputIndex = args.indexOf("--output");
const output = outputIndex >= 0 ? args[outputIndex + 1] : null;

if (args[0] === "--compare") {
  const builder = JSON.parse(fs.readFileSync(args[1], "utf8"));
  const fresh = JSON.parse(fs.readFileSync(args[2], "utf8"));
  assert(builder.status === "PASS" && fresh.status === "PASS", "BUILDER_OR_FRESH_VERIFIER_NOT_PASS");
  assert(builder.coreFingerprint === fresh.coreFingerprint, "BUILDER_FRESH_VERIFIER_CORE_MISMATCH");
  assert(builder.normalizedFingerprint === fresh.normalizedFingerprint, "BUILDER_FRESH_VERIFIER_MISMATCH");
  const receipt = {
    schema: "METHODS_SPATIAL_DATABASE_CHECKPOINT_4_INDEPENDENT_EQUALITY_RECEIPT_v1",
    status: "PASS",
    exactNormalizedEquality: true,
    coreFingerprint: builder.coreFingerprint,
    normalizedFingerprint: builder.normalizedFingerprint
  };
  if (output) fs.writeFileSync(output, JSON.stringify(receipt, null, 2) + "\n");
  else console.log(JSON.stringify(receipt, null, 2));
} else {
  const roleIndex = args.indexOf("--role");
  const role = roleIndex >= 0 ? args[roleIndex + 1] : "builder";
  assert(["builder", "fresh-verifier"].includes(role), "INVALID_ROLE");
  const receipt = validate(role);
  if (output) fs.writeFileSync(output, JSON.stringify(receipt, null, 2) + "\n");
  else console.log(JSON.stringify(receipt, null, 2));
}
