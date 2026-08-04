#!/usr/bin/env node
import { findRoot, loadAuthority, readJson, writeJson, parseArgs, fail } from './common.mjs';

try {
  const args = parseArgs(process.argv.slice(2), ['--builder', '--verifier', '--comparison', '--acceptance', '--output', '--test-mode']);
  if (!args.builder || !args.verifier || !args.comparison || !args.output) fail('MISSING_REQUIRED_ARGUMENT');
  const testMode = args['test-mode'] === 'true';
  const root = findRoot();
  const authority = loadAuthority(root, { requireGit: false });
  const builder = readJson(args.builder);
  const verifier = readJson(args.verifier);
  const comparison = readJson(args.comparison);
  if (!builder.status.startsWith('PASS_')) fail('ACTIVATION_BEFORE_BUILDER_PASS');
  if (!verifier.status.startsWith('PASS_')) fail('ACTIVATION_BEFORE_VERIFICATION');
  if (!comparison.status.startsWith('PASS_')) fail('ACTIVATION_BEFORE_FINGERPRINT_MATCH');
  if (builder.executionHolder === verifier.executionHolder) fail('BUILDER_AND_VERIFIER_SAME_EXECUTION_HOLDER');
  if (builder.bootstrapFingerprint !== verifier.bootstrapFingerprint || builder.bootstrapFingerprint !== comparison.bootstrapFingerprint) fail('ACTIVATION_BEFORE_FINGERPRINT_MATCH');
  if (!args.acceptance) fail('ACTIVATION_BEFORE_USER_ACCEPTANCE');
  const acceptance = readJson(args.acceptance);
  const acceptedStatus = testMode ? 'ACCEPTED_TEST_FIXTURE_ONLY' : 'ACCEPTED_BY_USER';
  if (acceptance.status !== acceptedStatus) fail('ACTIVATION_BEFORE_USER_ACCEPTANCE');
  if (acceptance.operationId !== authority.seed.operationId || acceptance.acceptedFingerprint !== comparison.bootstrapFingerprint) fail('USER_ACCEPTANCE_BINDING_MISMATCH');
  if (testMode && acceptance.fixtureOnly !== true) fail('TEST_MODE_ACCEPTANCE_NOT_FIXTURE');
  if (!testMode && acceptance.fixtureOnly === true) fail('FIXTURE_ACCEPTANCE_PROHIBITED_IN_PRODUCTION');
  const receipt = {
    schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_SYSTEM_ACTIVATION_RECEIPT_v1',
    operationId: authority.seed.operationId,
    status: testMode ? 'PASS_TEST_MODE_ACTIVATABLE' : 'ACTIVE_USER_ACCEPTED_ROLE_SYSTEM',
    originSeedSha256: authority.seedSha256,
    verifiedTopologyDigest: comparison.topologyDigest,
    bootstrapFingerprint: comparison.bootstrapFingerprint,
    firstPermanentRole: authority.seed.expectedFirstPermanentRole,
    activationGateDiscretion: 'NONE',
    productionAuthorityActive: !testMode,
    testMode
  };
  writeJson(args.output, receipt);
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
} catch (error) {
  const receipt = { schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_SYSTEM_ACTIVATION_FAILURE_v1', status: 'HELD_INACTIVE_FAIL_CLOSED', productionAuthorityActive: false, error: error.message };
  const index = process.argv.indexOf('--output');
  if (index >= 0 && process.argv[index + 1]) writeJson(process.argv[index + 1], receipt);
  process.stderr.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exit(1);
}
