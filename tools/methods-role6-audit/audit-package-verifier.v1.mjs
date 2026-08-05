#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AuditError, assert, canonicalPayloadBytes, listFilesRecursive, loadRegistry,
  packageFingerprint, parseArgs, readJson, safeTarget, validatePackage, writeJson
} from "./lib.v1.mjs";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(moduleDir, "../..");

export function verifyMaterialization({ pkg, outputRoot, holder, repoRoot = defaultRepoRoot, receiptPath }) {
  const registry = loadRegistry(repoRoot);
  validatePackage(pkg, registry);
  assert(typeof holder === "string" && /^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(holder), "INPUT_SCHEMA_INVALID", "verifier_holder");

  const entries = [...pkg.substantiveOutputs, ...pkg.returnArtifacts];
  for (const entry of entries) {
    const actual = fs.readFileSync(safeTarget(outputRoot, entry.path), "utf8");
    assert(actual === canonicalPayloadBytes(entry.payload), "BYTE_VERIFICATION_FAILURE", entry.path);
  }

  const auditRoot = safeTarget(outputRoot, "control-plane/methods-information-benchmark/role6-audit");
  const actualFiles = listFilesRecursive(auditRoot).map((relative) => `control-plane/methods-information-benchmark/role6-audit/${relative}`);
  assert(JSON.stringify(actualFiles) === JSON.stringify(registry.authorizedChangedPaths), "OUTPUT_ID_OR_PATH_MISMATCH", "materialized_file_set");

  const receipt = {
    schema: "METHODS_ROLE_6_AUDIT_VERIFICATION_RECEIPT_v1",
    operationId: pkg.operationId,
    assignmentHead: pkg.assignmentHead,
    assignmentId: pkg.assignmentId,
    builderExecutionHolder: pkg.executionHolder,
    verifierExecutionHolder: holder,
    distinctExecutionHolders: holder !== pkg.executionHolder,
    verifiedPathCount: actualFiles.length,
    verifiedPaths: actualFiles,
    packageFingerprint: packageFingerprint(pkg, registry),
    byteVerificationPass: true,
    repairPerformed: false,
    productMutationPerformed: false,
    mergePerformed: false
  };
  assert(receipt.distinctExecutionHolders, "FINGERPRINT_MISMATCH", "holder_not_distinct");
  if (receiptPath) writeJson(receiptPath, receipt);
  return receipt;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assert(args.input && args.outputRoot && args.holder && args.receipt, "INPUT_SCHEMA_INVALID", "required_arguments");
  const pkg = readJson(args.input);
  const receipt = verifyMaterialization({ pkg, outputRoot: args.outputRoot, holder: args.holder, receiptPath: args.receipt });
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const code = error instanceof AuditError ? error.code : "BYTE_VERIFICATION_FAILURE";
    process.stderr.write(`${code}:${error.message}\n`);
    process.exitCode = 1;
  });
}
