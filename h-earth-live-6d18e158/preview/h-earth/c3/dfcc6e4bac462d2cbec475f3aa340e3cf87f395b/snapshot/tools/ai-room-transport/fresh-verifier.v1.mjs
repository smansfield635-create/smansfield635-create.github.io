#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stable, fail, readJson, writeJson, parseArgs, hashObject } from './lib.v1.mjs';
import { runSelfTest } from './self-test.v1.mjs';

export function runFreshVerifier({ root, expectedHead, builderReceiptPath, holder, outputDir }) {
  const builder = readJson(builderReceiptPath);
  if (builder.schema !== 'REPOSITORY_AUTHORIZED_TOOLSET_AND_AI_ROOM_TRANSPORT_BOOTSTRAP_SELF_TEST_RECEIPT_v1') fail('BUILDER_RECEIPT_SCHEMA_MISMATCH');
  if (builder.result !== 'PASS_CLOSED') fail('BUILDER_RECEIPT_NOT_PASS_CLOSED');
  if (builder.expectedHead !== expectedHead) fail('BUILDER_VERIFIER_HEAD_MISMATCH');
  if (builder.executionHolder === holder) fail('BUILDER_VERIFIER_HOLDER_NOT_DISTINCT');
  const verifierSelfTestDir = path.join(outputDir, 'fresh-self-test');
  const reproduced = runSelfTest({ root, expectedHead, holder, outputDir: verifierSelfTestDir });
  if (reproduced.packageFingerprint !== builder.packageFingerprint) fail('BUILDER_VERIFIER_PACKAGE_FINGERPRINT_MISMATCH');
  if (reproduced.negativeFixtureCount !== builder.negativeFixtureCount || reproduced.negativeFixturesPassed !== builder.negativeFixturesPassed) fail('BUILDER_VERIFIER_NEGATIVE_FIXTURE_MISMATCH');
  const receipt = stable({
    schema: 'REPOSITORY_AUTHORIZED_TOOLSET_AND_AI_ROOM_TRANSPORT_FRESH_VERIFIER_RECEIPT_v1',
    result: 'PASS_CLOSED_FRESH_INDEPENDENT_REPRODUCTION',
    expectedHead,
    builderExecutionHolder: builder.executionHolder,
    verifierExecutionHolder: holder,
    distinctExecutionHolders: true,
    builderReceiptDigest: hashObject(builder),
    verifierSelfTestReceiptDigest: hashObject(reproduced),
    builderPackageFingerprint: builder.packageFingerprint,
    verifierPackageFingerprint: reproduced.packageFingerprint,
    packageFingerprintMatch: true,
    negativeFixtureCount: reproduced.negativeFixtureCount,
    negativeFixturesPassed: reproduced.negativeFixturesPassed,
    repairPerformed: false,
    productMutationPerformed: false,
    roleActivationPerformed: false,
    methodsAuditExecuted: false,
    mergePerformed: false,
    permanentTransportActivated: false
  });
  fs.mkdirSync(outputDir, { recursive: true });
  writeJson(path.join(outputDir, 'fresh-verifier-receipt.json'), receipt);
  return receipt;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  runFreshVerifier({
    root: path.resolve(args.root ?? '.'),
    expectedHead: args['expected-head'],
    builderReceiptPath: path.resolve(args['builder-receipt']),
    holder: args.holder,
    outputDir: path.resolve(args['output-dir'])
  });
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();
