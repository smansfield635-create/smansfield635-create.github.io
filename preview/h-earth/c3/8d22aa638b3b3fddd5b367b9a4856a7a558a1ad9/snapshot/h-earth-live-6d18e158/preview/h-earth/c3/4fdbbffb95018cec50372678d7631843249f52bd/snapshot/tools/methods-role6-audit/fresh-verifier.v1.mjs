#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AuditError, assert, parseArgs, readJson, writeJson } from "./lib.v1.mjs";
import { runBootstrapSelfTest } from "./bootstrap-self-test.v1.mjs";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assert(args.baseHead && args.expectedHead && args.holder && args.output && args.builderReceipt, "INPUT_SCHEMA_INVALID", "required_arguments");
  const builder = readJson(args.builderReceipt);
  assert(builder.schema === "METHODS_ROLE_6_AUDIT_BOOTSTRAP_CERTIFICATION_RECEIPT_v1", "INPUT_SCHEMA_INVALID", "builder_receipt_schema");
  assert(builder.executionHolder !== args.holder, "FINGERPRINT_MISMATCH", "holder_not_distinct");

  const verifier = runBootstrapSelfTest({
    baseHead: args.baseHead,
    expectedHead: args.expectedHead,
    holder: args.holder,
    skipGitStatus: false
  });
  assert(verifier.packageFingerprint === builder.packageFingerprint, "FINGERPRINT_MISMATCH", "bootstrap_package");
  const receipt = {
    ...verifier,
    schema: "METHODS_ROLE_6_AUDIT_BOOTSTRAP_FRESH_VERIFICATION_RECEIPT_v1",
    builderExecutionHolder: builder.executionHolder,
    verifierExecutionHolder: args.holder,
    distinctExecutionHolders: true,
    builderPackageFingerprint: builder.packageFingerprint,
    verifierPackageFingerprint: verifier.packageFingerprint,
    fingerprintReproduced: true,
    repairPerformed: false
  };
  writeJson(args.output, receipt);
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const code = error instanceof AuditError ? error.code : "FRESH_VERIFICATION_FAILURE";
    process.stderr.write(`${code}:${error.message}\n`);
    process.exitCode = 1;
  });
}
