#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
import { findRoot, parseArgs, fail, readJson, writeJson, initialLedger } from './common.mjs';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: options.cwd, encoding: 'utf8', env: { ...process.env, ...(options.env ?? {}) } });
  if (result.error) throw result.error;
  if (!options.allowFailure && result.status !== 0) fail('COMMAND_FAILED', `${command} ${args.join(' ')}:${result.stderr || result.stdout}`);
  return result;
}

function runAsync(command, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = ''; let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });
}

try {
  const args = parseArgs(process.argv.slice(2), ['--output-dir', '--require-git']);
  if (!args['output-dir']) fail('MISSING_OUTPUT_DIR');
  const root = findRoot();
  const packageRoot = path.join(root, 'governance/methods-information-benchmark-bootstrap-v1');
  const output = path.resolve(args['output-dir']);
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  const builderDir = path.join(output, 'builder');
  const verifierDir = path.join(output, 'verifier');
  const requireGit = args['require-git'] ?? 'false';
  run('node', [path.join(packageRoot, 'tools/bootstrap-builder.mjs'), '--output', builderDir, '--execution-holder', 'BUILDER_EXECUTION_001', '--require-git', requireGit], { cwd: root });
  run('node', [path.join(packageRoot, 'tools/bootstrap-verifier.mjs'), '--output', verifierDir, '--execution-holder', 'VERIFIER_EXECUTION_001', '--require-git', requireGit], { cwd: root });
  const comparisonPath = path.join(output, 'fingerprint-comparison.json');
  run('node', [path.join(packageRoot, 'tools/compare-fingerprints.mjs'), '--builder', path.join(builderDir, 'builder-receipt.json'), '--verifier', path.join(verifierDir, 'verifier-receipt.json'), '--output', comparisonPath], { cwd: root });

  const heldActivationPath = path.join(output, 'activation-held.json');
  const held = run('node', [path.join(packageRoot, 'tools/activation-gate.mjs'), '--builder', path.join(builderDir, 'builder-receipt.json'), '--verifier', path.join(verifierDir, 'verifier-receipt.json'), '--comparison', comparisonPath, '--output', heldActivationPath], { cwd: root, allowFailure: true });
  if (held.status === 0 || readJson(heldActivationPath).status !== 'HELD_INACTIVE_FAIL_CLOSED') fail('ACTIVATION_FAIL_CLOSED_TEST_FAILED');

  const comparison = readJson(comparisonPath);
  const acceptancePath = path.join(output, 'fixture-user-acceptance.json');
  writeJson(acceptancePath, { schema: 'METHODS_INFORMATION_BENCHMARK_USER_ACCEPTANCE_RECEIPT_v1', operationId: comparison.operationId, status: 'ACCEPTED_TEST_FIXTURE_ONLY', acceptedFingerprint: comparison.bootstrapFingerprint, fixtureOnly: true });
  const activationPath = path.join(output, 'activation-test-mode.json');
  run('node', [path.join(packageRoot, 'tools/activation-gate.mjs'), '--builder', path.join(builderDir, 'builder-receipt.json'), '--verifier', path.join(verifierDir, 'verifier-receipt.json'), '--comparison', comparisonPath, '--acceptance', acceptancePath, '--output', activationPath, '--test-mode', 'true'], { cwd: root });

  const ledgerPath = path.join(output, 'assignment-ledger.json');
  const ledger = initialLedger(comparison.operationId);
  writeJson(ledgerPath, ledger);
  const commonArgs = ['--ledger', ledgerPath, '--expected-head', ledger.ledgerHead, '--role', 'ROLE_6', '--activation', activationPath, '--test-mode', 'true'];
  const [claimA, claimB] = await Promise.all([
    runAsync('node', [path.join(packageRoot, 'tools/role-holder-admission.mjs'), ...commonArgs, '--holder', 'FRESH_ROOM_A', '--output', path.join(output, 'claim-a.json')], root),
    runAsync('node', [path.join(packageRoot, 'tools/role-holder-admission.mjs'), ...commonArgs, '--holder', 'FRESH_ROOM_B', '--output', path.join(output, 'claim-b.json')], root)
  ]);
  const passes = [claimA, claimB].filter((claim) => claim.status === 0).length;
  const failures = [claimA, claimB].filter((claim) => claim.status !== 0).length;
  if (passes !== 1 || failures !== 1) fail('CONCURRENT_ROLE_CLAIM_TEST_FAILED', `${claimA.status},${claimB.status}`);
  const currentLedger = readJson(ledgerPath);
  const active = currentLedger.assignments.find((entry) => entry.status === 'ACTIVE');
  const returnPath = path.join(output, 'return-role-6.json');
  run('node', [path.join(packageRoot, 'tools/role-holder-return.mjs'), '--ledger', ledgerPath, '--expected-head', currentLedger.ledgerHead, '--role', 'ROLE_6', '--holder', active.holderExecutionId, '--output', returnPath], { cwd: root });
  const afterReturn = readJson(ledgerPath);
  run('node', [path.join(packageRoot, 'tools/role-holder-admission.mjs'), '--ledger', ledgerPath, '--expected-head', afterReturn.ledgerHead, '--role', 'ROLE_4', '--holder', 'FRESH_ROOM_ROLE_4', '--activation', activationPath, '--output', path.join(output, 'role-4-assignment.json'), '--test-mode', 'true'], { cwd: root });

  const negative = run('node', [path.join(packageRoot, 'tools/negative-fixture-tests.mjs')], { cwd: root });
  fs.writeFileSync(path.join(output, 'negative-fixtures.log'), negative.stdout, 'utf8');
  const negativeReceipt = JSON.parse(negative.stdout);
  const builder = readJson(path.join(builderDir, 'builder-receipt.json'));
  const verifier = readJson(path.join(verifierDir, 'verifier-receipt.json'));
  const summary = {
    schema: 'METHODS_INFORMATION_BENCHMARK_PRE_ROLE_BOOTSTRAP_VALIDATION_RECEIPT_v1',
    operationId: comparison.operationId,
    status: 'PASS_ALL_BOOTSTRAP_TOOLING_OPERATIONAL',
    builderStatus: builder.status,
    verifierStatus: verifier.status,
    fingerprintComparisonStatus: comparison.status,
    topologyDigest: comparison.topologyDigest,
    bootstrapFingerprint: comparison.bootstrapFingerprint,
    negativeFixtureCount: negativeReceipt.fixtureCount,
    negativeFixturesPassed: negativeReceipt.passedCount,
    concurrentClaims: { passCount: passes, failClosedCount: failures },
    lifecycleSmokeTest: ['ROLE_6_ASSIGNED', 'ROLE_6_RETURNED', 'ROLE_4_ASSIGNED'],
    productionRoleAuthorityActive: false,
    productMutation: false
  };
  writeJson(path.join(output, 'validate-all-receipt.json'), summary);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ schema: 'METHODS_INFORMATION_BENCHMARK_PRE_ROLE_BOOTSTRAP_VALIDATION_FAILURE_v1', status: 'FAIL_CLOSED', error: error.message }, null, 2)}\n`);
  process.exit(1);
}
