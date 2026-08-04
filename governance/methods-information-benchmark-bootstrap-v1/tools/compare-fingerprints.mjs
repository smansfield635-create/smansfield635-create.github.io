#!/usr/bin/env node
import { readJson, writeJson, parseArgs, fail } from './common.mjs';

try {
  const args = parseArgs(process.argv.slice(2), ['--builder', '--verifier', '--output']);
  if (!args.builder || !args.verifier || !args.output) fail('MISSING_REQUIRED_ARGUMENT');
  const builder = readJson(args.builder);
  const verifier = readJson(args.verifier);
  if (!builder.status.startsWith('PASS_')) fail('BUILDER_NOT_PASS');
  if (!verifier.status.startsWith('PASS_')) fail('VERIFIER_NOT_PASS');
  if (builder.executionHolder === verifier.executionHolder) fail('BUILDER_AND_VERIFIER_SAME_EXECUTION_HOLDER');
  if (builder.operationId !== verifier.operationId) fail('OPERATION_ID_MISMATCH');
  if (builder.topologyDigest !== verifier.topologyDigest) fail('TOPOLOGY_DIGEST_MISMATCH');
  if (builder.bootstrapFingerprint !== verifier.bootstrapFingerprint) fail('BOOTSTRAP_FINGERPRINT_MISMATCH');
  if (builder.originSeedSha256 !== verifier.originSeedSha256 || builder.originSeedGitBlob !== verifier.originSeedGitBlob) fail('ORIGIN_SEED_IDENTITY_MISMATCH');
  const receipt = {
    schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_FINGERPRINT_COMPARISON_RECEIPT_v1',
    operationId: builder.operationId,
    status: 'PASS_CANONICAL_OUTPUT_AND_FINGERPRINT_MATCH',
    builderExecutionHolder: builder.executionHolder,
    verifierExecutionHolder: verifier.executionHolder,
    topologyDigest: builder.topologyDigest,
    bootstrapFingerprint: builder.bootstrapFingerprint,
    originSeedSha256: builder.originSeedSha256,
    originSeedGitBlob: builder.originSeedGitBlob,
    roleAuthorityActive: false
  };
  writeJson(args.output, receipt);
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
} catch (error) {
  const receipt = { schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_FINGERPRINT_COMPARISON_FAILURE_v1', status: 'FAIL_CLOSED', error: error.message };
  if (process.argv.includes('--output')) {
    const index = process.argv.indexOf('--output');
    if (process.argv[index + 1]) writeJson(process.argv[index + 1], receipt);
  }
  process.stderr.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exit(1);
}
