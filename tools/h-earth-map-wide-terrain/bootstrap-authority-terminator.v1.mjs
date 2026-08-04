#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fail, hashObject, parseArgs, readJson, stable, writeJson } from './lib.v1.mjs';

export function terminateBootstrap({ builderReceipt, verifierReceipt, policy }) {
  if (builderReceipt.result !== policy.requiredBuilderResult) fail('BUILDER_CERTIFICATION_REQUIRED');
  if (verifierReceipt.result !== policy.requiredVerifierResult) fail('VERIFIER_CERTIFICATION_REQUIRED');
  if (policy.requireDistinctHolders && builderReceipt.executionHolder === verifierReceipt.executionHolder) fail('EXECUTION_HOLDERS_NOT_DISTINCT');
  if (policy.requireEqualPackageFingerprint && builderReceipt.packageFingerprint !== verifierReceipt.packageFingerprint) fail('PACKAGE_FINGERPRINT_MISMATCH');
  return stable({
    schema:'BOOTSTRAP_TERMINATION_RECEIPT_v1',
    result:policy.terminalReceiptResult,
    packageFingerprint:builderReceipt.packageFingerprint,
    builderCertificationDigest:hashObject(builderReceipt),
    verifierCertificationDigest:hashObject(verifierReceipt),
    builderExecutionHolder:builderReceipt.executionHolder,
    verifierExecutionHolder:verifierReceipt.executionHolder,
    ...policy.terminalValues
  });
}

function main(){
  const args=parseArgs(process.argv.slice(2));
  const receipt=terminateBootstrap({
    builderReceipt:readJson(path.resolve(args['builder-receipt'])),
    verifierReceipt:readJson(path.resolve(args['verifier-receipt'])),
    policy:readJson(path.resolve(args.policy))
  });
  writeJson(path.resolve(args.output),receipt);
}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);if(invoked)main();
