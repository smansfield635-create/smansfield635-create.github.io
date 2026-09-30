#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import childProcess from "node:child_process";
import { fileURLToPath } from "node:url";

const BASE_HEAD = "5d6295c6c4a9b94db168e0822e02e36fbee29414";
const SOURCE_HEAD = "e62bbcd23aa8351f76ab6c5f501800d4d8f03565";
const ASSIGNMENT_HEAD = "ce40519190a9048c1e0cef682108c34b0a7f8055";
const SOURCE_FINGERPRINT = "c9e28507aed9bd9c7acdabba933cd9b1daad7bebf5a9126075a78165932da37f";
const OPERATION_ID = "METHODS_ROLE_6_AUDIT_EXECUTION_DESCRIPTOR_ACTIVATION_SUCCESSOR_v2";
const RATIFICATION_COMMENT_ID = 5186563114;
const DESCRIPTOR_PATH = "control-plane/methods-information-benchmark/role6-audit-bootstrap/audit-execution-descriptor.v1.json";
const LOCATOR_PATH = "control-plane/methods-information-benchmark/role6-audit-bootstrap/audit-execution-locator.v1.json";
const ACTIVATION_RECEIPT_PATH = "control-plane/methods-information-benchmark/role6-audit-bootstrap/audit-execution-activation.receipt.v2.json";
const VALIDATOR_PATH = "tools/methods-role6-audit/activation-self-test.v2.mjs";
const WORKFLOW_PATH = ".github/workflows/methods-role6-audit-activation-validation-v2.yml";

const UNCHANGED_SOURCE_PATHS = Object.freeze([
  ".github/workflows/methods-role6-audit-bootstrap-validation.yml",
  ".github/workflows/methods-role6-audit-execution.yml",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/AGENTS.md",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/audit-construction-procedure.v1.json",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/audit-operation-request.v1.json",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/audit-output-path-registry.v1.json",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/audit-package.schema.v1.json",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/authority-and-lineage.v1.json",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/bootstrap-seed.v1.json",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/bootstrap-termination-policy.v1.json",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/changed-path-manifest.v1.json",
  "control-plane/methods-information-benchmark/role6-audit-bootstrap/negative-fixtures.v1.json",
  "tools/methods-role6-audit/audit-package-materializer.v1.mjs",
  "tools/methods-role6-audit/audit-package-verifier.v1.mjs",
  "tools/methods-role6-audit/bootstrap-authority-terminator.v1.mjs",
  "tools/methods-role6-audit/bootstrap-self-test.v1.mjs",
  "tools/methods-role6-audit/fresh-verifier.v1.mjs",
  "tools/methods-role6-audit/lib.v1.mjs"
]);

const EXPECTED_PATHS = Object.freeze([
  ...UNCHANGED_SOURCE_PATHS,
  DESCRIPTOR_PATH,
  LOCATOR_PATH,
  VALIDATOR_PATH,
  WORKFLOW_PATH,
  ACTIVATION_RECEIPT_PATH
].sort());

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(moduleDir, "../..");

function fail(code, detail = null) {
  const error = new Error(detail ? `${code}:${detail}` : code);
  error.code = code;
  throw error;
}
function assert(condition, code, detail = null) {
  if (!condition) fail(code, detail);
}
function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function stable(value) {
  return Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
      : value;
}
function canonical(value) {
  return JSON.stringify(stable(value));
}
function readJson(relativePath, root = repoRoot) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}
function git(args, options = {}) {
  return childProcess.execFileSync("git", args, {
    cwd: options.cwd || repoRoot,
    encoding: "utf8",
    stdio: options.stdio || ["ignore", "pipe", "pipe"]
  }).trim();
}
function run(command, args, options = {}) {
  return childProcess.spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    encoding: "utf8",
    env: options.env || process.env,
    stdio: ["ignore", "pipe", "pipe"]
  });
}
function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!["--base-head", "--source-head", "--candidate-head", "--holder", "--output"].includes(key) || value === undefined) {
      fail("INPUT_SCHEMA_INVALID", key || "missing");
    }
    result[key.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
  }
  return result;
}
function stripDescriptorActivation(value) {
  const copy = JSON.parse(JSON.stringify(value));
  delete copy.status;
  delete copy.activationOnMain;
  return copy;
}
function stripLocatorActivation(value) {
  const copy = JSON.parse(JSON.stringify(value));
  delete copy.status;
  delete copy.activationRule;
  return copy;
}
function verifySourceBootstrap(holder) {
  const worktree = fs.mkdtempSync(path.join(os.tmpdir(), "methods-role6-source-"));
  try {
    git(["worktree", "add", "--detach", worktree, SOURCE_HEAD]);
    const output = path.join(worktree, "source-bootstrap-receipt.json");
    const result = run(process.execPath, [
      "tools/methods-role6-audit/bootstrap-self-test.v1.mjs",
      "--base-head", ASSIGNMENT_HEAD,
      "--expected-head", SOURCE_HEAD,
      "--holder", `${holder}_SOURCE`,
      "--output", output
    ], { cwd: worktree });
    assert(result.status === 0, "SOURCE_BOOTSTRAP_CERTIFICATION_FAILURE", result.stderr.trim());
    const receipt = JSON.parse(fs.readFileSync(output, "utf8"));
    assert(receipt.schema === "METHODS_ROLE_6_AUDIT_BOOTSTRAP_CERTIFICATION_RECEIPT_v1", "SOURCE_BOOTSTRAP_RECEIPT_INVALID", "schema");
    assert(receipt.executedHead === SOURCE_HEAD, "SOURCE_BOOTSTRAP_RECEIPT_INVALID", "head");
    assert(receipt.changedPathCount === 20 && receipt.existingPathMutationCount === 0, "SOURCE_BOOTSTRAP_RECEIPT_INVALID", "path_boundary");
    assert(receipt.requestProcedureEqualityPass === true && receipt.descriptorFixedPass === true, "SOURCE_BOOTSTRAP_RECEIPT_INVALID", "contract");
    assert(receipt.materializerSelfTestPass === true, "SOURCE_BOOTSTRAP_RECEIPT_INVALID", "materializer");
    assert(receipt.negativeFixtureCount === 15 && receipt.negativeFixturesPassed === 15, "SOURCE_BOOTSTRAP_RECEIPT_INVALID", "negative_fixtures");
    assert(receipt.packageFingerprint === SOURCE_FINGERPRINT, "SOURCE_BOOTSTRAP_RECEIPT_INVALID", "fingerprint");
    return receipt;
  } finally {
    try { git(["worktree", "remove", "--force", worktree]); } catch {}
    try { fs.rmSync(worktree, { recursive: true, force: true }); } catch {}
  }
}
function main() {
  const args = parseArgs(process.argv.slice(2));
  assert(args.baseHead === BASE_HEAD, "CURRENT_MAIN_HEAD_MISMATCH", args.baseHead);
  assert(args.sourceHead === SOURCE_HEAD, "CERTIFIED_SOURCE_HEAD_MISMATCH", args.sourceHead);
  assert(/^[0-9a-f]{40}$/.test(args.candidateHead || ""), "INPUT_SCHEMA_INVALID", "candidate_head");
  assert(/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(args.holder || ""), "INPUT_SCHEMA_INVALID", "holder");
  assert(args.output, "INPUT_SCHEMA_INVALID", "output");

  const actualHead = git(["rev-parse", "HEAD"]);
  assert(actualHead === args.candidateHead, "EXACT_HEAD_MISMATCH", `${actualHead}:${args.candidateHead}`);
  git(["cat-file", "-e", `${BASE_HEAD}^{commit}`]);
  git(["cat-file", "-e", `${SOURCE_HEAD}^{commit}`]);

  const changedPaths = git(["diff", "--name-only", BASE_HEAD, args.candidateHead]).split("\n").filter(Boolean).sort();
  assert(canonical(changedPaths) === canonical(EXPECTED_PATHS), "PATH_SET_MISMATCH", canonical(changedPaths));

  const sourceBlobMap = {};
  for (const relativePath of UNCHANGED_SOURCE_PATHS) {
    const sourceBlob = git(["rev-parse", `${SOURCE_HEAD}:${relativePath}`]);
    const candidateBlob = git(["rev-parse", `${args.candidateHead}:${relativePath}`]);
    assert(sourceBlob === candidateBlob, "UNCHANGED_SOURCE_BLOB_MISMATCH", relativePath);
    sourceBlobMap[relativePath] = sourceBlob;
  }

  const sourceDescriptor = JSON.parse(git(["show", `${SOURCE_HEAD}:${DESCRIPTOR_PATH}`]));
  const activeDescriptor = readJson(DESCRIPTOR_PATH);
  assert(canonical(stripDescriptorActivation(sourceDescriptor)) === canonical(stripDescriptorActivation(activeDescriptor)), "DESCRIPTOR_TRANSFORMATION_INVALID", "undeclared_change");
  assert(sourceDescriptor.status === "CERTIFIED_CANDIDATE_PENDING_RATIFICATION", "CERTIFIED_SOURCE_HEAD_MISMATCH", "descriptor_source_status");
  assert(sourceDescriptor.activationOnMain === false, "CERTIFIED_SOURCE_HEAD_MISMATCH", "descriptor_source_activation");
  assert(activeDescriptor.status === "ACTIVE_RATIFIED_CERTIFIED", "DESCRIPTOR_TRANSFORMATION_INVALID", "status");
  assert(activeDescriptor.activationOnMain === true, "DESCRIPTOR_TRANSFORMATION_INVALID", "activationOnMain");
  assert(activeDescriptor.exactToolingHead === "a823c1fee318297d77cac6d24d4f268ac45dafcf", "DESCRIPTOR_TRANSFORMATION_INVALID", "tooling_head");

  const sourceLocator = JSON.parse(git(["show", `${SOURCE_HEAD}:${LOCATOR_PATH}`]));
  const activeLocator = readJson(LOCATOR_PATH);
  assert(canonical(stripLocatorActivation(sourceLocator)) === canonical(stripLocatorActivation(activeLocator)), "LOCATOR_TRANSFORMATION_INVALID", "undeclared_change");
  assert(activeLocator.status === "ACTIVE_RATIFIED_CERTIFIED", "LOCATOR_TRANSFORMATION_INVALID", "status");
  assert(activeLocator.activationRule === "ACTIVE_DESCRIPTOR_REQUIRES_SEPARATE_COMMAND_EMITTED_ADMITTED_AND_LOCKED_BEFORE_SUBSTANTIVE_AUDIT_EXECUTION", "LOCATOR_TRANSFORMATION_INVALID", "activation_rule");

  const activationReceipt = readJson(ACTIVATION_RECEIPT_PATH);
  assert(activationReceipt.schema === "METHODS_ROLE_6_AUDIT_EXECUTION_DESCRIPTOR_ACTIVATION_RECEIPT_v2", "ACTIVATION_RECEIPT_INVALID", "schema");
  assert(activationReceipt.operationId === OPERATION_ID, "ACTIVATION_RECEIPT_INVALID", "operation");
  assert(activationReceipt.currentMainBaseHead === BASE_HEAD && activationReceipt.certifiedSourceHead === SOURCE_HEAD, "ACTIVATION_RECEIPT_INVALID", "lineage");
  assert(activationReceipt.ratificationCommentId === RATIFICATION_COMMENT_ID, "ACTIVATION_RECEIPT_INVALID", "ratification");
  assert(activationReceipt.activationAdmission?.lockGeneration === 45 && activationReceipt.activationAdmission?.result === "ADMITTED_AND_LOCKED", "ACTIVATION_RECEIPT_INVALID", "admission");
  assert(activationReceipt.substantiveAuditProgress === "0_OF_27" && activationReceipt.returnProgress === "0_OF_2", "ACTIVATION_RECEIPT_INVALID", "stopping_boundary");
  assert(activationReceipt.publicMethodsMutation === false && activationReceipt.publicLawsMutation === false && activationReceipt.productMutation === false, "ACTIVATION_RECEIPT_INVALID", "mutation_boundary");
  assert(activationReceipt.mergePerformed === false && activationReceipt.deploymentPerformed === false && activationReceipt.releasePerformed === false, "ACTIVATION_RECEIPT_INVALID", "lifecycle_boundary");

  const sourceBootstrap = verifySourceBootstrap(args.holder);

  const materializerTest = run(process.execPath, ["tools/methods-role6-audit/audit-package-materializer.v1.mjs", "--self-test"]);
  assert(materializerTest.status === 0, "MATERIALIZER_SELF_TEST_FAILURE", materializerTest.stderr.trim());

  const fingerprintInput = {
    operationId: OPERATION_ID,
    currentMainHead: BASE_HEAD,
    certifiedSourceHead: SOURCE_HEAD,
    ratificationCommentId: RATIFICATION_COMMENT_ID,
    candidateHead: args.candidateHead,
    source18PathBlobMap: sourceBlobMap,
    activeDescriptor: activeDescriptor,
    activeLocator: activeLocator,
    activationReceipt: activationReceipt,
    activationValidatorSha256: sha256(fs.readFileSync(path.join(repoRoot, VALIDATOR_PATH))),
    activationWorkflowSha256: sha256(fs.readFileSync(path.join(repoRoot, WORKFLOW_PATH)))
  };
  const activationPackageFingerprint = sha256(canonical(fingerprintInput));

  const receipt = {
    schema: "METHODS_ROLE_6_AUDIT_EXECUTION_DESCRIPTOR_ACTIVATION_CERTIFICATION_RECEIPT_v2",
    operationId: OPERATION_ID,
    executionHolder: args.holder,
    currentMainHead: BASE_HEAD,
    certifiedSourceHead: SOURCE_HEAD,
    candidateHead: args.candidateHead,
    changedPathCount: changedPaths.length,
    changedPaths,
    unchangedCertifiedSourcePathCount: UNCHANGED_SOURCE_PATHS.length,
    source18PathBlobMap: sourceBlobMap,
    descriptorActivationPass: true,
    locatorActivationPass: true,
    activationReceiptPass: true,
    sourceBootstrapCertificationPass: true,
    sourceBootstrapPackageFingerprint: sourceBootstrap.packageFingerprnt,
    materializerSelfTestPass: true,
    negativeFixtureCount: sourceBootstrap.negativeFixtureCount,
    negativeFixturesPassed: sourceBootstrap.negativeFixturesPassed,
    activationPackageFingerprint,
    substantiveAuditOutputCountCreated: 0,
    returnArtifactCountCreated: 0,
    role6TerminationPerformed: false,
    publicMethodsMutation: false,
    publicLawsMutation: false,
    productMutation: false,
    mergePerformed: false,
    deploymentPerformed: false,
    releasePerformed: false,
    result: "PASS_CLOSED_ACTIVATION_CANDIDATE_CERTIFIED"
  };
  fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
  fs.writeFileSync(path.resolve(args.output), JSON.stringify(receipt, null, 2) + "\n");
  process.stdout.write(JSON.stringify(receipt) + "\n");
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.code || "ACTIVATION_SELF_TEST_FAILURE"}:${error.message}\n`);
  process.exitCode = 1;
}
