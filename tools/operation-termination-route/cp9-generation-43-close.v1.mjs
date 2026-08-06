#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';
const LOCK_BRANCH = 'operation-locks/repository-operation-intake-v1';
const LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
const LOCK_MANAGER_PATH = 'tools/operation-intake/repository-operation-lock-manager.v1.mjs';
const LOCK_MANAGER_BLOB = '6fc0199c9dc943b8cdf3efe7c789f0e1888774b8';
const EVIDENCE_PATH = '.github/operation-termination-route/evidence/generation-43-closure-receipt.json';
const EVIDENCE_SHA256 = '32bc0f0ef35e51bd3c602471029ab4ee090bf277651cc60e00c00766445e9cf6';
const OPERATION_ID = 'H_EARTH_REGISTRY_TWO_PATH_SUCCESSOR_REPAIR_TOOLSET_REGISTRATION_A_001';
const LOCK_SCOPE = 'H_EARTH:REGISTRY_TWO_PATH_SUCCESSOR_REPAIR:TOOLSET_REGISTRATION:A:V1';
const LOCK_GENERATION = 43;
const TERMINAL_DISPOSITION = 'FAIL_CLOSED';
const SCOPE_HASH = 'ce3554c46bdea439cb4db91820c8393c920e25be45fe860b4821ec78304ba9ef';
const RUNNER_TEMP = process.env.RUNNER_TEMP;
const TOKEN = process.env.GITHUB_TOKEN;

if (!RUNNER_TEMP) throw new Error('RUNNER_TEMP_MISSING');
if (!TOKEN) throw new Error('GITHUB_TOKEN_MISSING');

const runtimeClosureOutput = path.join(RUNNER_TEMP, 'generation-43-closure-receipt.json');
const verificationOutput = path.join(RUNNER_TEMP, 'generation-43-closure-verification.json');
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28'
};
const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
    : value;
const canonical = (value) => JSON.stringify(stable(value));
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const clone = (value) => JSON.parse(JSON.stringify(value));

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

async function githubJson(url) {
  const response = await fetch(url, { headers });
  const text = await response.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  if (!response.ok) throw new Error(`GITHUB_API_ERROR:${response.status}:${canonical(body)}`);
  return body;
}

async function readLedgerAt(ref) {
  const encodedPath = LEDGER_PATH.split('/').map(encodeURIComponent).join('/');
  const file = await githubJson(`https://api.github.com/repos/${REPOSITORY}/contents/${encodedPath}?ref=${encodeURIComponent(ref)}`);
  const ledger = JSON.parse(Buffer.from(String(file.content).replace(/\s/g, ''), 'base64').toString('utf8'));
  return { ledger, ledgerBlobSha: file.sha };
}

function exactTerminal43(ledger) {
  return [...(ledger.terminalHistory ?? [])].reverse().find((entry) =>
    entry.operationId === OPERATION_ID &&
    entry.lockScope === LOCK_SCOPE &&
    entry.lockGeneration === LOCK_GENERATION &&
    entry.scopeHash === SCOPE_HASH
  ) ?? null;
}

const hashResult = spawnSync('git', ['hash-object', LOCK_MANAGER_PATH], { encoding: 'utf8' });
assert(hashResult.status === 0, `LOCK_MANAGER_HASH_FAILED:${hashResult.stderr || hashResult.stdout}`);
assert(hashResult.stdout.trim() === LOCK_MANAGER_BLOB, `LOCK_MANAGER_BLOB_MISMATCH:${hashResult.stdout.trim()}`);

const request = JSON.parse(fs.readFileSync('.github/operation-termination-route/closure-request.generation-43.v1.json', 'utf8'));
assert(request.repository === REPOSITORY, 'REQUEST_REPOSITORY_MISMATCH');
assert(request.lockRef === LOCK_REF, 'REQUEST_LOCK_REF_MISMATCH');
assert(request.operationId === OPERATION_ID, 'REQUEST_OPERATION_ID_MISMATCH');
assert(request.lockScope === LOCK_SCOPE, 'REQUEST_LOCK_SCOPE_MISMATCH');
assert(request.lockGeneration === LOCK_GENERATION, 'REQUEST_LOCK_GENERATION_MISMATCH');
assert(request.terminalDisposition === TERMINAL_DISPOSITION, 'REQUEST_TERMINAL_DISPOSITION_MISMATCH');

let closureBytes;
let closure;
let executionMode;
const currentBefore = await readLedgerAt(LOCK_BRANCH);
const active43 = currentBefore.ledger.activeScopes?.[SCOPE_HASH] ?? null;

if (active43) {
  assert(active43.operationId === OPERATION_ID, 'GENERATION_43_OPERATION_ID_MISMATCH');
  assert(active43.lockScope === LOCK_SCOPE, 'GENERATION_43_LOCK_SCOPE_MISMATCH');
  assert(active43.lockGeneration === LOCK_GENERATION, 'GENERATION_43_LOCK_GENERATION_MISMATCH');
  assert(active43.released === false, 'GENERATION_43_ALREADY_RELEASED');
  assert(active43.state === 'ADMITTED_LOCKED', 'GENERATION_43_STATE_MISMATCH');
  const commandArgs = [
    LOCK_MANAGER_PATH,
    '--action', 'close',
    '--repository', REPOSITORY,
    '--lock-ref', LOCK_REF,
    '--operation-id', OPERATION_ID,
    '--lock-scope', LOCK_SCOPE,
    '--lock-generation', String(LOCK_GENERATION),
    '--terminal-disposition', TERMINAL_DISPOSITION,
    '--output', runtimeClosureOutput
  ];
  const execution = spawnSync(process.execPath, commandArgs, { encoding: 'utf8', env: process.env });
  assert(execution.status === 0, `CANONICAL_CLOSE_COMMAND_FAILED:${execution.status}:${execution.stderr || execution.stdout}`);
  assert(fs.existsSync(runtimeClosureOutput), 'CLOSURE_RECEIPT_MISSING');
  closureBytes = fs.readFileSync(runtimeClosureOutput);
  closure = JSON.parse(closureBytes.toString('utf8'));
  executionMode = 'CANONICAL_CLOSE_EXECUTED_NOW';
} else {
  closureBytes = fs.readFileSync(EVIDENCE_PATH);
  assert(sha256(closureBytes) === EVIDENCE_SHA256, 'BOUND_CLOSURE_EVIDENCE_DIGEST_MISMATCH');
  closure = JSON.parse(closureBytes.toString('utf8'));
  executionMode = 'PRIOR_CANONICAL_CLOSE_VERIFIED_NO_REEXECUTION';
}

assert(closure.schema === 'REPOSITORY_OPERATION_CLOSURE_RECEIPT_v1', 'CLOSURE_RECEIPT_SCHEMA_MISMATCH');
assert(closure.result === 'TERMINAL_CLOSURE_COMMITTED', `CLOSURE_RESULT_MISMATCH:${closure.result}`);
assert(closure.operationId === OPERATION_ID, 'CLOSURE_OPERATION_ID_MISMATCH');
assert(closure.lockScope === LOCK_SCOPE, 'CLOSURE_LOCK_SCOPE_MISMATCH');
assert(closure.lockGeneration === LOCK_GENERATION, 'CLOSURE_LOCK_GENERATION_MISMATCH');
assert(closure.scopeHash === SCOPE_HASH, 'CLOSURE_SCOPE_HASH_MISMATCH');
assert(closure.terminalDisposition === TERMINAL_DISPOSITION, 'CLOSURE_TERMINAL_DISPOSITION_MISMATCH');
assert(closure.lockReleased === true, 'CLOSURE_LOCK_RELEASE_FALSE');
assert(closure.terminalHistoryPreserved === true, 'CLOSURE_TERMINAL_HISTORY_FALSE');

const before = await readLedgerAt(closure.observedBranchHead);
const after = await readLedgerAt(closure.closureCommitSha);
assert(before.ledgerBlobSha === closure.observedLedgerBlobSha, 'OBSERVED_LEDGER_BLOB_MISMATCH');
assert(after.ledgerBlobSha === closure.committedLedgerBlobSha, 'COMMITTED_LEDGER_BLOB_MISMATCH');
const before43 = before.ledger.activeScopes?.[SCOPE_HASH] ?? null;
assert(before43 !== null, 'PRE_CLOSURE_GENERATION_43_MISSING');
assert(before43.operationId === OPERATION_ID, 'PRE_CLOSURE_OPERATION_ID_MISMATCH');
assert(before43.lockGeneration === LOCK_GENERATION, 'PRE_CLOSURE_GENERATION_MISMATCH');

const expectedAfter = clone(before.ledger);
delete expectedAfter.activeScopes[SCOPE_HASH];
expectedAfter.terminalHistory.push(stable({
  ...before43,
  state: 'TERMINAL',
  terminalDisposition: TERMINAL_DISPOSITION,
  released: true
}));
assert(canonical(after.ledger) === canonical(expectedAfter), 'CLOSURE_COMMIT_MUTATED_UNRELATED_LEDGER_STATE');

const current = await readLedgerAt(LOCK_BRANCH);
assert(current.ledger.activeScopes?.[SCOPE_HASH] === undefined, 'GENERATION_43_REMAINS_ACTIVE');
const terminal43 = exactTerminal43(current.ledger);
assert(terminal43 !== null, 'GENERATION_43_TERMINAL_HISTORY_MISSING');
assert(terminal43.state === 'TERMINAL', 'GENERATION_43_TERMINAL_STATE_MISMATCH');
assert(terminal43.released === true, 'GENERATION_43_TERMINAL_RELEASE_FALSE');
assert(terminal43.terminalDisposition === TERMINAL_DISPOSITION, 'GENERATION_43_TERMINAL_DISPOSITION_MISMATCH');

const verification = stable({
  schema: 'CP9_GENERATION_43_TERMINATION_ROUTE_VERIFICATION_RECEIPT_v1',
  result: 'PASS_CLOSED_GENERATION_43_TERMINATED',
  authorityIssue: 580,
  executionMode,
  repository: REPOSITORY,
  lockManagerPath: LOCK_MANAGER_PATH,
  lockManagerBlob: LOCK_MANAGER_BLOB,
  lockRef: LOCK_REF,
  operationId: OPERATION_ID,
  lockScope: LOCK_SCOPE,
  lockGeneration: LOCK_GENERATION,
  terminalDisposition: TERMINAL_DISPOSITION,
  canonicalClosureReceiptSchema: closure.schema,
  canonicalClosureReceiptResult: closure.result,
  canonicalClosureReceiptSha256: sha256(closureBytes),
  observedLedgerBlobSha: closure.observedLedgerBlobSha,
  closureCommitSha: closure.closureCommitSha,
  committedLedgerBlobSha: closure.committedLedgerBlobSha,
  generation43PresentInActiveScopes: false,
  generation43PresentInTerminalHistory: true,
  generation43TerminalDisposition: terminal43.terminalDisposition,
  allUnrelatedLedgerRecordsUnchangedByClosureCommit: true,
  currentLockGeneration: current.ledger.lockGeneration,
  directLedgerEditingPerformed: false,
  lockAcquisitionPerformed: false,
  arbitraryLockSelectionAllowed: false,
  receiptRewritten: false,
  closeCommandReexecutedAfterTerminalState: false,
  continuingOperationalAuthority: false
});
fs.writeFileSync(verificationOutput, `${JSON.stringify(verification, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(verification, null, 2)}\n`);
