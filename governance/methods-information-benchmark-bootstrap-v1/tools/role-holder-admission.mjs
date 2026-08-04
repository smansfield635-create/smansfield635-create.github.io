#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { findRoot, loadAuthority, readRegistries, validateGraph, readJson, writeJson, parseArgs, fail, computeLedgerHead, canonicalText, sha256Text } from './common.mjs';

let lockFile = null;
let ownsLock = false;
try {
  const args = parseArgs(process.argv.slice(2), ['--ledger', '--expected-head', '--role', '--holder', '--activation', '--output', '--test-mode']);
  if (!args.ledger || !args['expected-head'] || !args.role || !args.holder || !args.activation || !args.output) fail('MISSING_REQUIRED_ARGUMENT');
  const testMode = args['test-mode'] === 'true';
  const root = findRoot();
  const authority = loadAuthority(root, { requireGit: false });
  const registries = readRegistries(root);
  const graph = validateGraph(registries);
  const activation = readJson(args.activation);
  const validActivation = testMode ? activation.status === 'PASS_TEST_MODE_ACTIVATABLE' : activation.status === 'ACTIVE_USER_ACCEPTED_ROLE_SYSTEM' && activation.productionAuthorityActive === true;
  if (!validActivation) fail('ROLE_SYSTEM_NOT_ACTIVE_FOR_REQUESTED_MODE');
  if (activation.bootstrapFingerprint == null) fail('ACTIVATION_FINGERPRINT_MISSING');
  lockFile = `${args.ledger}.lock`;
  let lock;
  try { lock = fs.openSync(lockFile, 'wx'); ownsLock = true; }
  catch { fail('CONCURRENT_ROLE_HOLDER_CLAIM_LOCKED'); }
  const ledger = readJson(args.ledger);
  if (computeLedgerHead(ledger) !== ledger.ledgerHead) fail('LEDGER_INTERNAL_HEAD_MISMATCH');
  if (ledger.ledgerHead !== args['expected-head']) fail('STALE_ASSIGNMENT_LEDGER_HEAD');
  const functionRecord = registries.functions.functions.find((entry) => entry.roleId === args.role);
  if (!functionRecord) fail('UNKNOWN_ROLE', args.role);
  if (ledger.revision === 0 && args.role !== graph.firstRoleId) fail('FIRST_ROLE_SELECTED_BY_DISCRETION');
  for (const predecessor of functionRecord.permanentRolePredecessors ?? []) {
    if (!ledger.completedRoles.includes(predecessor)) fail('UNSATISFIED_ROLE_PREDECESSOR', predecessor);
  }
  if (ledger.assignments.some((entry) => entry.status === 'ACTIVE' && entry.roleId === args.role)) fail('ROLE_ALREADY_HAS_ACTIVE_HOLDER');
  if (ledger.assignments.some((entry) => entry.status === 'ACTIVE' && entry.holderExecutionId === args.holder)) fail('CONFLICTING_ROLE_COMBINATION');
  const assignment = {
    assignmentId: sha256Text(canonicalText({ operationId: ledger.operationId, roleId: args.role, holderExecutionId: args.holder, predecessorLedgerHead: ledger.ledgerHead, revision: ledger.revision + 1 })).slice(0, 24),
    roleId: args.role,
    holderExecutionId: args.holder,
    predecessorLedgerHead: ledger.ledgerHead,
    activationFingerprint: activation.bootstrapFingerprint,
    leaseScope: ledger.operationId,
    returnRequired: true,
    status: 'ACTIVE'
  };
  ledger.revision += 1;
  ledger.assignments.push(assignment);
  ledger.ledgerHead = computeLedgerHead(ledger);
  const temp = `${args.ledger}.${process.pid}.tmp`;
  writeJson(temp, ledger);
  fs.renameSync(temp, args.ledger);
  const receipt = {
    schema: 'METHODS_INFORMATION_BENCHMARK_FIRST_ROLE_ASSIGNMENT_RECEIPT_v1',
    operationId: authority.seed.operationId,
    status: testMode ? 'PASS_TEST_MODE_ASSIGNMENT' : 'PASS_OPERATION_SCOPED_ACTIVE_ASSIGNMENT',
    roleSystemActivationStatus: activation.status,
    assignment,
    assignmentHead: ledger.ledgerHead,
    ledgerRevision: ledger.revision,
    productionAuthorityActive: !testMode
  };
  writeJson(args.output, receipt);
  fs.closeSync(lock);
  fs.unlinkSync(lockFile);
  lockFile = null;
  ownsLock = false;
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
} catch (error) {
  if (ownsLock && lockFile && fs.existsSync(lockFile)) { try { fs.unlinkSync(lockFile); } catch {} }
  const receipt = { schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_HOLDER_ADMISSION_FAILURE_v1', status: 'FAIL_CLOSED', error: error.message };
  const index = process.argv.indexOf('--output');
  if (index >= 0 && process.argv[index + 1]) writeJson(process.argv[index + 1], receipt);
  process.stderr.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exit(1);
}
