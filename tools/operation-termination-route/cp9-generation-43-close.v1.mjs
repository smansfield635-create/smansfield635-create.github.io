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
const OPERATION_ID = 'H_EARTH_REGISTRY_TWO_PATH_SUCCESSOR_REPAIR_TOOLSET_REGISTRATION_A_001';
const LOCK_SCOPE = 'H_EARTH:REGISTRY_TWO_PATH_SUCCESSOR_REPAIR:TOOLSET_REGISTRATION:A:V1';
const LOCK_GENERATION = 43;
const TERMINAL_DISPOSITION = 'FAIL_CLOSED';
const SCOPE_HASH = 'ce3554c46bdea439cb4db91820c8393c920e25be45fe860b4821ec78304ba9ef';
const RUNNER_TEMP = process.env.RUNNER_TEMP;
const TOKEN = process.env.GITHUB_TOKEN;

if (!RUNNER_TEMP) throw new Error('RUNNER_TEMP_MISSING');
if (!TOKEN) throw new Error('GITHUB_TOKEN_MISSING');

const closureOutput = path.join(RUNNER_TEMP, 'generation-43-closure-receipt.json');
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

async function readLedger() {
  const encodedPath = LEDGER_PATH.split('/').map(encodeURIComponent).join('/');
  const [file, ref] = await Promise.all([
    githubJson(`https://api.github.com/repos/${REPOSITORY}/contents/${encodedPath}?ref=${encodeURIComponent(LOCK_BRANCH)}`),
    githubJson(`https://api.github.com/repos/${REPOSITORY}/git/ref/${encodeURIComponent(`heads/${LOCK_BRANCH}`)}`)
  ]);
  const ledger = JSON.parse(Buffer.from(String(file.content).replace(/\s/g, ''), 'base64').toString('utf8'));
  return { ledger, ledgerBlobSha: file.sha, branchHead: ref.object.sha };
}

function findGeneration(ledger, generation) {
  return Object.values(ledger.activeScopes ?? {}).find((entry) => entry.lockGeneration === generation) ?? null;
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

const before = await readLedger();
const generation43Before = before.ledger.activeScopes?.[SCOPE_HASH] ?? null;
assert(generation43Before !== null, 'GENERATION_43_ACTIVE_SCOPE_NOT_FOUND');
assert(generation43Before.operationId === OPERATION_ID, 'GENERATION_43_OPERATION_ID_MISMATCH');
assert(generation43Before.lockScope === LOCK_SCOPE, 'GENERATION_43_LOCK_SCOPE_MISMATCH');
assert(generation43Before.lockGeneration === LOCK_GENERATION, 'GENERATION_43_LOCK_GENERATION_MISMATCH');
assert(generation43Before.released === false, 'GENERATION_43_ALREADY_RELEASED');
assert(generation43Before.state === 'ADMITTED_LOCKED', 'GENERATION_43_STATE_MISMATCH');

const generation44Before = findGeneration(before.ledger, 44);
assert(generation44Before !== null, 'GENERATION_44_REFERENCE_NOT_FOUND');
const generation44BeforeCanonical = canonical(generation44Before);

const commandArgs = [
  LOCK_MANAGER_PATH,
  '--action', 'close',
  '--repository', REPOSITORY,
  '--lock-ref', LOCK_REF,
  '--operation-id', OPERATION_ID,
  '--lock-scope', LOCK_SCOPE,
  '--lock-generation', String(LOCK_GENERATION),
  '--terminal-disposition', TERMINAL_DISPOSITION,
  '--output', closureOutput
];
const execution = spawnSync(process.execPath, commandArgs, {
  encoding: 'utf8',
  env: process.env
});
assert(execution.status === 0, `CANONICAL_CLOSE_COMMAND_FAILED:${execution.status}:${execution.stderr || execution.stdout}`);
assert(fs.existsSync(closureOutput), 'CLOSURE_RECEIPT_MISSING');

const closureBytes = fs.readFileSync(closureOutput);
const closure = JSON.parse(closureBytes.toString('utf8'));
assert(closure.schema === 'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1', 'CLOSURE_RECEIPT_SCHEMA_MISMATCH');
assert(closure.result === 'TERMINAL_CLOSURE_COMMITTED', `CLOSURE_RESULT_MISMATCH:${closure.result}`);
assert(closure.operationId === OPERATION_ID, 'CLOSURE_OPERATION_ID_MISMATCH');
assert(closure.lockScope === LOCK_SCOPE, 'CLOSURE_LOCK_SCOPE_MISMATCH');
assert(closure.lockGeneration === LOCK_GENERATION, 'CLOSURE_LOCK_GENERATION_MISMATCH');
assert(closure.terminalDisposition === TERMINAL_DISPOSITION, 'CLOSURE_TERMINAL_DISPOSITION_MISMATCH');
assert(closure.lockReleased === true, 'CLOSURE_LOCK_RELEASE_FALSE');

const after = await readLedger();
assert(after.ledger.activeScopes?.[SCOPE_HASH] === undefined, 'GENERATION_43_REMAINS_ACTIVE');
const terminal43 = [...(after.ledger.terminalHistory ?? [])].reverse().find((entry) =>
  entry.operationId === OPERATION_ID && entry.lockGeneration === LOCK_GENERATION
);
assert(terminal43 !== undefined, 'GENERATION_43_TERMINAL_HISTORY_MISSING');
assert(terminal43.state === 'TERMINAL', 'GENERATION_43_TERMINAL_STATE_MISMATCH');
assert(terminal43.released === true, 'GENERATION_43_TERMINAL_RELEASE_FALSE');
assert(terminal43.terminalDisposition === TERMINAL_DISPOSITION, 'GENERATION_43_TERMINAL_DISPOSITION_MISMATCH');

const generation44After = findGeneration(after.ledger, 44);
assert(generation44After !== null, 'GENERATION_44_MISSING_AFTER_CLOSE');
assert(canonical(generation44After) === generation44BeforeCanonical, 'GENERATION_44_MUTATED');

const verification = stable({
  schema: 'CP9_GENERATION_43_TERMINATION_ROUTE_VERIFICATION_RECEIPT_v1',
  result: 'PASS_CLOSED_GENERATION_43_TERMINATED',
  authorityIssue: 580,
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
  acquisitionLedgerBlob: before.ledgerBlobSha,
  acquisitionLockRefHead: before.branchHead,
  closureCommitSha: closure.closureCommitSha,
  committedLedgerBlobSha: closure.committedLedgerBlobSha,
  postClosureLockRefHead: after.branchHead,
  generation43PresentInActiveScopes: false,
  generation43PresentInTerminalHistory: true,
  generation43TerminalDisposition: terminal43.terminalDisposition,
  generation44Unaffected: true,
  directLedgerEditingPerformed: false,
  lockAcquisitionPerformed: false,
  arbitraryLockSelectionAllowed: false,
  receiptRewritten: false,
  continuingOperationalAuthority: false
});
fs.writeFileSync(verificationOutput, `${JSON.stringify(verification, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(verification, null, 2)}\n`);
