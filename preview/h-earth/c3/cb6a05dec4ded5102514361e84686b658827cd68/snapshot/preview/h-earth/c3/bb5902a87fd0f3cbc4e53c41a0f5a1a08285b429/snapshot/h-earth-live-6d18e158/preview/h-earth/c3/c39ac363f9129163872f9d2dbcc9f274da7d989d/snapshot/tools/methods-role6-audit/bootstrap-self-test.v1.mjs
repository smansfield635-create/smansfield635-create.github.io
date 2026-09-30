#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import childProcess from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  AuditError, assert, loadRegistry, packageFingerprint, parseArgs, readJson,
  sha256, stableJson, validatePackage, writeJson
} from "./lib.v1.mjs";
import { makeSyntheticPackage, runSelfTest as runMaterializerSelfTest } from "./audit-package-materializer.v1.mjs";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(moduleDir, "../..");
const baseDir = "control-plane/methods-information-benchmark/role6-audit-bootstrap";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expectError(pkg, registry, expectedCode) {
  try {
    validatePackage(pkg, registry);
  } catch (error) {
    assert(error instanceof AuditError && error.code === expectedCode, "NEGATIVE_FIXTURE_FAILURE", `${expectedCode}:${error.code || error.name}`);
    return true;
  }
  throw new AuditError("NEGATIVE_FIXTURE_FAILURE", `unexpected_pass:${expectedCode}`);
}

function descriptorChecks(descriptor) {
  assert(descriptor.schema === "AUTHORIZED_TOOLSET_DESCRIPTOR_v1", "DESCRIPTOR_NOT_FIXED", "schema");
  assert(/^[0-9a-f]{40}$/.test(descriptor.exactToolingHead), "DESCRIPTOR_NOT_FIXED", "exact_tooling_head");
  assert(descriptor.commandSpecification.shell === false, "DESCRIPTOR_NOT_FIXED", "shell");
  assert(descriptor.commandSpecification.extraArgumentsAllowed === false, "DESCRIPTOR_NOT_FIXED", "extra_arguments");
  assert(descriptor.commandSpecification.environmentOverridesAllowed === false, "DESCRIPTOR_NOT_FIXED", "environment");
  assert(descriptor.movingToolingRefsAccepted === false, "DESCRIPTOR_NOT_FIXED", "moving_ref");
  assert(descriptor.allowedMutationPaths.length === 29, "OUTPUT_COUNT_MISMATCH", "descriptor_paths");
  return true;
}

function runNegativeFixtures(registry, descriptor) {
  const base = makeSyntheticPackage(repoRoot);
  const results = [];
  const run = (id, expected, fn) => {
    let pass = false;
    try {
      fn();
    } catch (error) {
      pass = error instanceof AuditError && error.code === expected;
    }
    assert(pass, "NEGATIVE_FIXTURE_FAILURE", id);
    results.push({ id, expected, pass: true });
  };

  run("NEG_01_WRONG_OPERATION", "OPERATION_ID_MISMATCH", () => {
    const p = clone(base); p.operationId = "WRONG"; validatePackage(p, registry);
  });
  run("NEG_02_WRONG_ASSIGNMENT_HEAD", "ASSIGNMENT_IDENTITY_MISMATCH", () => {
    const p = clone(base); p.assignmentHead = "0".repeat(40); validatePackage(p, registry);
  });
  run("NEG_03_WRONG_ASSIGNMENT_ID", "ASSIGNMENT_IDENTITY_MISMATCH", () => {
    const p = clone(base); p.assignmentId = "WRONG"; validatePackage(p, registry);
  });
  run("NEG_04_MISSING_OUTPUT", "OUTPUT_COUNT_MISMATCH", () => {
    const p = clone(base); p.substantiveOutputs.pop(); validatePackage(p, registry);
  });
  run("NEG_05_EXTRA_OUTPUT", "OUTPUT_COUNT_MISMATCH", () => {
    const p = clone(base); p.substantiveOutputs.push(clone(p.substantiveOutputs[0])); validatePackage(p, registry);
  });
  run("NEG_06_WRONG_OUTPUT_ID", "OUTPUT_ID_OR_PATH_MISMATCH", () => {
    const p = clone(base); p.substantiveOutputs[0].id = "WRONG"; validatePackage(p, registry);
  });
  run("NEG_07_WRONG_OUTPUT_PATH", "OUTPUT_ID_OR_PATH_MISMATCH", () => {
    const p = clone(base); p.substantiveOutputs[0].path = "wrong.json"; validatePackage(p, registry);
  });
  run("NEG_08_DUPLICATE_PATH", "OUTPUT_ID_OR_PATH_MISMATCH", () => {
    const p = clone(base); p.substantiveOutputs[1].path = p.substantiveOutputs[0].path; validatePackage(p, registry);
  });
  run("NEG_09_NONOBJECT_PAYLOAD", "PAYLOAD_NOT_OBJECT", () => {
    const p = clone(base); p.substantiveOutputs[0].payload = "bad"; validatePackage(p, registry);
  });
  run("NEG_10_MISSING_RETURN", "INPUT_SCHEMA_INVALID", () => {
    const p = clone(base); delete p.returnPacket; validatePackage(p, registry);
  });
  run("NEG_11_WRONG_RETURN_PATH", "OUTPUT_ID_OR_PATH_MISMATCH", () => {
    const p = clone(base); p.returnPacket.path = "bad"; validatePackage(p, registry);
  });
  run("NEG_12_INVALID_HOLDER", "ASSIGNMENT_IDENTITY_MISMATCH", () => {
    const p = clone(base); p.executionHolder = "x"; validatePackage(p, registry);
  });
  run("NEG_13_UNAUTHORIZED_PATH", "OUTPUT_ID_OR_PATH_MISMATCH", () => {
    const p = clone(base); p.substantiveOutputs[0].path = "../escape.json"; validatePackage(p, registry);
  });
  run("NEG_14_DESCRIPTOR_EXTRA_ARGS", "DESCRIPTOR_NOT_FIXED", () => {
    const d = clone(descriptor); d.commandSpecification.extraArgumentsAllowed = true; descriptorChecks(d);
  });
  run("NEG_15_DESCRIPTOR_MOVING_REF", "DESCRIPTOR_NOT_FIXED", () => {
    const d = clone(descriptor); d.exactToolingHead = "main"; descriptorChecks(d);
  });
  return results;
}

function fileSha(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function git(command) {
  return childProcess.execFileSync("git", command, { cwd: repoRoot, encoding: "utf8" }).trim();
}

export function runBootstrapSelfTest({ baseHead, expectedHead, holder, skipGitStatus = false }) {
  assert(/^[0-9a-f]{40}$/.test(baseHead), "INPUT_SCHEMA_INVALID", "base_head");
  assert(/^[0-9a-f]{40}$/.test(expectedHead), "INPUT_SCHEMA_INVALID", "expected_head");
  assert(/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(holder), "INPUT_SCHEMA_INVALID", "holder");

  const manifest = readJson(path.join(repoRoot, baseDir, "changed-path-manifest.v1.json"));
  const request = readJson(path.join(repoRoot, baseDir, "audit-operation-request.v1.json"));
  const procedure = readJson(path.join(repoRoot, baseDir, "audit-construction-procedure.v1.json"));
  const descriptor = readJson(path.join(repoRoot, baseDir, "audit-execution-descriptor.v1.json"));
  const registry = loadRegistry(repoRoot);
  const negativeRegistry = readJson(path.join(repoRoot, baseDir, "negative-fixtures.v1.json"));

  assert(manifest.baseHead === baseHead, "ASSIGNMENT_IDENTITY_MISMATCH", "manifest_base");
  assert(request.exactGoverningHead === procedure.exactGoverningHead, "REQUEST_PROCEDURE_MISMATCH", "governing_head");
  assert(JSON.stringify(request.allowedPaths) === JSON.stringify(procedure.exactAllowedRepositoryPaths), "REQUEST_PROCEDURE_MISMATCH", "allowed_paths");
  assert(request.exactTestCommand === procedure.exactTestRunnerCommand, "REQUEST_PROCEDURE_MISMATCH", "test_command");
  assert(request.workflowPath === procedure.workflowAndArtifactPackagingPaths.workflowPath, "REQUEST_PROCEDURE_MISMATCH", "workflow");
  assert(JSON.stringify(request.artifactPaths) === JSON.stringify(procedure.workflowAndArtifactPackagingPaths.artifactPaths), "REQUEST_PROCEDURE_MISMATCH", "artifacts");
  assert(stableJson(request.fingerprintDomain) === stableJson(procedure.bridgeOutputFingerprintDomain), "REQUEST_PROCEDURE_MISMATCH", "fingerprint");
  assert(JSON.stringify(request.errorPrecedence) === JSON.stringify(procedure.errorCodeAndValidationPrecedence), "REQUEST_PROCEDURE_MISMATCH", "precedence");
  assert(JSON.stringify(request.allowedPaths) === JSON.stringify(registry.authorizedChangedPaths), "REQUEST_PROCEDURE_MISMATCH", "registry_paths");
  descriptorChecks(descriptor);
  assert(JSON.stringify(descriptor.allowedMutationPaths) === JSON.stringify(registry.authorizedChangedPaths), "REQUEST_PROCEDURE_MISMATCH", "descriptor_paths");

  if (!skipGitStatus) {
    const actualHead = git(["rev-parse", "HEAD"]);
    assert(actualHead === expectedHead, "EXACT_HEAD_MISMATCH", `${actualHead}:${expectedHead}`);
    const changedPaths = git(["diff", "--name-only", baseHead, expectedHead]).split("\n").filter(Boolean).sort();
    const expectedPaths = [...manifest.changedPaths].sort();
    assert(JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), "CHANGED_PATH_SET_MISMATCH");
    const existingMutations = changedPaths.filter((p) => {
      try { git(["cat-file", "-e", `${baseHead}:${p}`]); return true; } catch { return false; }
    });
    assert(existingMutations.length === 0, "EXISTING_PATH_MUTATION", existingMutations.join(","));
    git(["cat-file", "-e", `${descriptor.exactToolingHead}:${descriptor.commandSpecification.scriptPath}`]);
  }

  const materializer = runMaterializerSelfTest(repoRoot);
  const negatives = runNegativeFixtures(registry, descriptor);
  assert(negatives.length === negativeRegistry.requiredPassCount, "NEGATIVE_FIXTURE_FAILURE", "count");

  const fileMap = manifest.changedPaths.map((relativePath) => ({
    path: relativePath,
    sha256: fileSha(path.join(repoRoot, relativePath))
  }));
  const packageFingerprintValue = sha256(stableJson({
    operation: "METHODS_ROLE_6_AUDIT_ADMISSION_TOOLING_BOOTSTRAP_v1",
    baseHead,
    expectedHead,
    assignmentHead: request.exactGoverningHead,
    descriptorToolingHead: descriptor.exactToolingHead,
    fileMap
  }));

  return {
    schema: "METHODS_ROLE_6_AUDIT_BOOTSTRAP_CERTIFICATION_RECEIPT_v1",
    operation: "METHODS_ROLE_6_AUDIT_ADMISSION_TOOLING_BOOTSTRAP_v1",
    executionHolder: holder,
    baseHead,
    executedHead: expectedHead,
    exactHeadMatch: true,
    changedPathCount: manifest.changedPathCount,
    existingPathMutationCount: 0,
    requestProcedureEqualityPass: true,
    descriptorFixedPass: true,
    materializerSelfTestPass: materializer.selfTest === "PASS_CLOSED",
    negativeFixtureCount: negatives.length,
    negativeFixturesPassed: negatives.filter((x) => x.pass).length,
    auditOutputCountCreated: 0,
    returnArtifactCountCreated: 0,
    admissionReceiptEmitted: false,
    substantiveAuditStarted: false,
    packageFingerprint: packageFingerprintValue,
    productMutationPerformed: false,
    mergePerformed: false
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assert(args.baseHead && args.expectedHead && args.holder && args.output, "INPUT_SCHEMA_INVALID", "required_arguments");
  const receipt = runBootstrapSelfTest({
    baseHead: args.baseHead,
    expectedHead: args.expectedHead,
    holder: args.holder
  });
  writeJson(args.output, receipt);
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const code = error instanceof AuditError ? error.code : "BOOTSTRAP_SELF_TEST_FAILURE";
    process.stderr.write(`${code}:${error.message}\n`);
    process.exitCode = 1;
  });
}
