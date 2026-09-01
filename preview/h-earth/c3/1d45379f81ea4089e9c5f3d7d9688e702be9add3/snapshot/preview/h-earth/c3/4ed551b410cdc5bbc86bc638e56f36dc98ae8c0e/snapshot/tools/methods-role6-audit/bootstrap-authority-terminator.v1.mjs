#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AuditError, assert, parseArgs, readJson, writeJson } from "./lib.v1.mjs";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assert(args.builderReceipt && args.verifierReceipt && args.output, "INPUT_SCHEMA_INVALID", "required_arguments");
  const builder = readJson(args.builderReceipt);
  const verifier = readJson(args.verifierReceipt);
  assert(builder.schema === "METHODS_ROLE_6_AUDIT_BOOTSTRAP_CERTIFICATION_RECEIPT_v1", "INPUT_SCHEMA_INVALID", "builder_schema");
  assert(verifier.schema === "METHODS_ROLE_6_AUDIT_BOOTSTRAP_FRESH_VERIFICATION_RECEIPT_v1", "INPUT_SCHEMA_INVALID", "verifier_schema");
  assert(verifier.distinctExecutionHolders === true, "FINGERPRINT_MISMATCH", "holders");
  assert(builder.packageFingerprint === verifier.packageFingerprint, "FINGERPRINT_MISMATCH", "package");
  assert(builder.negativeFixturesPassed === 15 && verifier.negativeFixturesPassed === 15, "NEGATIVE_FIXTURE_FAILURE", "termination");
  const receipt = {
    schema: "METHODS_ROLE_6_AUDIT_BOOTSTRAP_AUTHORITY_TERMINATION_RECEIPT_v1",
    operation: "METHODS_ROLE_6_AUDIT_ADMISSION_TOOLING_BOOTSTRAP_v1",
    disposition: "PASS_CLOSED_BOOTSTRAP_AUTHORITY_TERMINATED",
    builderExecutionHolder: builder.executionHolder,
    verifierExecutionHolder: verifier.verifierExecutionHolder,
    distinctExecutionHolders: true,
    packageFingerprint: builder.packageFingerprint,
    temporaryBuilderAuthorityActive: false,
    temporaryVerifierAuthorityActive: false,
    residualBootstrapAuthority: false,
    auditProcedureCandidateCertified: true,
    descriptorCandidateCertified: true,
    descriptorActiveOnMain: false,
    admissionReceiptEmitted: false,
    substantiveAuditProgress: "0_OF_27",
    returnProgress: "0_OF_2",
    role6TerminationPerformed: false,
    mergePerformed: false
  };
  writeJson(args.output, receipt);
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const code = error instanceof AuditError ? error.code : "BOOTSTRAP_TERMINATION_FAILURE";
    process.stderr.write(`${code}:${error.message}\n`);
    process.exitCode = 1;
  });
}
