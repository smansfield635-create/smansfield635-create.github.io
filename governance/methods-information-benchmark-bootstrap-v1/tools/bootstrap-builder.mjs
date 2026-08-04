#!/usr/bin/env node
import path from 'node:path';
import { findRoot, loadAuthority, readRegistries, validateGraph, validateConflictMatrix, topologyFrom, canonicalText, sha256Text, fingerprintPayload, parseArgs, writeJson, fileSha256, fail } from './common.mjs';

try {
  const args = parseArgs(process.argv.slice(2), ['--output', '--execution-holder', '--require-git']);
  if (!args.output) fail('MISSING_OUTPUT');
  const executionHolder = args['execution-holder'] ?? 'BOOTSTRAP_BUILDER_EXECUTION';
  const root = findRoot();
  const authority = loadAuthority(root, { requireGit: args['require-git'] === 'true' });
  const seedBefore = fileSha256(authority.seedFile);
  const registries = readRegistries(root);
  const graph = validateGraph(registries);
  validateConflictMatrix(registries);
  if (graph.firstRoleId !== authority.seed.expectedFirstPermanentRole) fail('FIRST_ROLE_SEED_MISMATCH');
  const topology = topologyFrom(registries, graph);
  const topologyDigest = sha256Text(canonicalText(topology));
  const fingerprint = sha256Text(canonicalText(fingerprintPayload(authority, registries, topology)));
  const seedAfter = fileSha256(authority.seedFile);
  if (seedBefore !== seedAfter) fail('ORIGIN_SEED_CHANGED_DURING_BOOTSTRAP');
  writeJson(path.join(args.output, 'role-topology.json'), topology);
  const receipt = {
    schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_BUILDER_RECEIPT_v1',
    operationId: authority.seed.operationId,
    function: 'BOOTSTRAP_BUILDER',
    executionHolder,
    status: 'PASS_BUILDER_MATERIALIZED_INACTIVE_TOPOLOGY',
    exactStartingHead: authority.seed.exactStartingHead,
    repositoryHead: authority.repository.head,
    originSeedSha256: authority.seedSha256,
    originSeedGitBlob: authority.seedGitBlob,
    topologyDigest,
    bootstrapFingerprint: fingerprint,
    firstPermanentRole: graph.firstRoleId,
    roleAuthorityActive: false,
    productMutation: false
  };
  writeJson(path.join(args.output, 'builder-receipt.json'), receipt);
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_BUILDER_FAILURE_v1', status: 'FAIL_CLOSED', error: error.message }, null, 2)}\n`);
  process.exit(1);
}
