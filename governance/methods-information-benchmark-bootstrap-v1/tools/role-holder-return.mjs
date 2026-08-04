#!/usr/bin/env node
import fs from 'node:fs';
import { readJson, writeJson, parseArgs, fail, computeLedgerHead } from './common.mjs';

let lockFile = null;
try {
  const args = parseArgs(process.argv.slice(2), ['--ledger', '--expected-head', '--role', '--holder', '--output']);
  if (!args.ledger || !args['expected-head'] || !args.role || !args.holder || !args.output) fail('MISSING_REQUIRED_ARGUMENT');
  lockFile = `${args.ledger}.lock`;
  let lock;
  try { lock = fs.openSync(lockFile, 'wx'); }
  catch { fail('CONCURRENT_LEDGER_UPDATE_LOCKED'); }
  const ledger = readJson(args.ledger);
  if (computeLedgerHead(ledger) !== ledger.ledgerHead) fail('LEDGER_INTERNAL_HEAD_MISMATCH');
  if (ledger.ledgerHead !== args['expected-head']) fail('STALE_ASSIGNMENT_LEDGER_HEAD');
  const assignment = [...ledger.assignments].reverse().find((entry) => entry.status === 'ACTIVE' && entry.roleId === args.role && entry.holderExecutionId === args.holder);
  if (!assignment) fail('ACTIVE_ASSIGNMENT_NOT_FOUND');
  assignment.status = 'RETURNED';
  assignment.returnedAtLedgerRevision = ledger.revision + 1;
  if (!ledger.completedRoles.includes(args.role)) ledger.completedRoles.push(args.role);
  ledger.revision += 1;
  ledger.ledgerHead = computeLedgerHead(ledger);
  writeJson(args.ledger, ledger);
  const receipt = { schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_ASSIGNMENT_RETURN_RECEIPT_v1', status: 'PASS_RETURNED', roleId: args.role, holderExecutionId: args.holder, assignmentHead: ledger.ledgerHead, ledgerRevision: ledger.revision };
  writeJson(args.output, receipt);
  fs.closeSync(lock);
  fs.unlinkSync(lockFile);
  lockFile = null;
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
} catch (error) {
  if (lockFile && fs.existsSync(lockFile)) { try { fs.unlinkSync(lockFile); } catch {} }
  const receipt = { schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_ASSIGNMENT_RETURN_FAILURE_v1', status: 'FAIL_CLOSED', error: error.message };
  const index = process.argv.indexOf('--output');
  if (index >= 0 && process.argv[index + 1]) writeJson(process.argv[index + 1], receipt);
  process.stderr.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exit(1);
}
