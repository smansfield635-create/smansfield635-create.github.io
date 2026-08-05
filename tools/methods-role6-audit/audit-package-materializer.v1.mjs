#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AuditError, assert, canonicalPayloadBytes, loadRegistry, packageFingerprint,
  parseArgs, readJson, safeTarget, validatePackage, writeJson
} from "./lib.v1.mjs";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(moduleDir, "../..");

export function materializePackage({ pkg, repoRoot = defaultRepoRoot, outputRoot, receiptPath }) {
  const registry = loadRegistry(repoRoot);
  validatePackage(pkg, registry);
  assert(outputRoot, "INPUT_SCHEMA_INVALID", "output_root");

  const allEntries = [...pkg.substantiveOutputs, ...pkg.returnArtifacts];
  for (const entry of allEntries) {
    const target = safeTarget(outputRoot, entry.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, canonicalPayloadBytes(entry.payload), "utf8");
  }

  const receipt = {
    schema: "METHODS_ROLE_6_AUDIT_MATERIALIZATION_RECEIPT_v1",
    operationId: pkg.operationId,
    assignmentHead: pkg.assignmentHead,
    assignmentId: pkg.assignmentId,
    executionHolder: pkg.executionHolder,
    substantiveOutputCount: pkg.substantiveOutputs.length,
    returnArtifactCount: pkg.returnArtifacts.length,
    materializedPathCount: allEntries.length,
    materializedPaths: allEntries.map((entry) => entry.path),
    packageFingerprint: packageFingerprint(pkg, registry),
    unauthorizedPathWritten: false,
    productMutationPerformed: false,
    mergePerformed: false
  };
  if (receiptPath) writeJson(receiptPath, receipt);
  return receipt;
}

export function makeSyntheticPackage(repoRoot = defaultRepoRoot, holder = "SYNTHETIC_BUILDER_HOLDER_001") {
  const registry = loadRegistry(repoRoot);
  return {
    schema: "METHODS_ROLE_6_AUDIT_PACKAGE_v1",
    operationId: registry.operationId,
    assignmentHead: registry.assignmentHead,
    assignmentId: registry.assignmentId,
    packetHead: "fa7e74403ff43e017bccef7462f4e001918cf0a3",
    packetCanonicalSha256: "5c93a8ebe638b9f06a4e14fc42f8ee202c8801e940527aa4fb987006a04e0cdc",
    executionHolder: holder,
    substantiveOutputs: registry.substantiveOutputs.map(({ id, path: entryPath, ordinal }) => ({
      id, path: entryPath, payload: { schema: id, ordinal, status: "SYNTHETIC_TEST_ONLY" }
    })),
    returnArtifacts: registry.returnArtifacts.map(({ id, path: entryPath, ordinal }) => ({
      id, path: entryPath, payload: { schema: id, ordinal, status: "SYNTHETIC_TEST_ONLY" }
    }))
  };
}

export function runSelfTest(repoRoot = defaultRepoRoot) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "methods-role6-audit-materializer-"));
  try {
    const pkg = makeSyntheticPackage(repoRoot);
    const receipt = materializePackage({ pkg, repoRoot, outputRoot: tempRoot });
    assert(receipt.materializedPathCount === 29, "BYTE_VERIFICATION_FAILURE", "self_test_count");
    for (const entry of [...pkg.substantiveOutputs, ...pkg.returnArtifacts]) {
      const bytes = fs.readFileSync(safeTarget(tempRoot, entry.path), "utf8");
      assert(bytes === canonicalPayloadBytes(entry.payload), "BYTE_VERIFICATION_FAILURE", entry.path);
    }
    return { ...receipt, selfTest: "PASS_CLOSED" };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) {
    process.stdout.write(`${JSON.stringify(runSelfTest(), null, 2)}\n`);
    return;
  }
  assert(args.input && args.outputRoot && args.receipt, "INPUT_SCHEMA_INVALID", "required_arguments");
  const pkg = readJson(args.input);
  const receipt = materializePackage({ pkg, outputRoot: args.outputRoot, receiptPath: args.receipt });
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const code = error instanceof AuditError ? error.code : "MATERIALIZATION_WRITE_FAILURE";
    process.stderr.write(`${code}:${error.message}\n`);
    process.exitCode = 1;
  });
}
