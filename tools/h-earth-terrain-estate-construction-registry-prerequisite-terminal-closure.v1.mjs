#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  closeRemote,
  scopeHash,
  stable
} from './operation-intake/repository-operation-lock-manager.v1.mjs';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';
const MAIN = '3f51f0cd159df33571905c6cb14253ebdd137e3b';
const MAIN_TREE = '3116d5c35bfdd575922dac614fb2e9f1d4f61ec5';
const BRANCH = 'closure/h-earth-map-wide-environment-redevelopment-supersede-411-001';
const PRESERVED_STEP2_BRANCH = 'build/h-earth-terrain-estate-construction-v1-001';
const PRESERVED_STEP2_HEAD = '82bbf57d706a428172709d3a2e050ce3afcc014a';

const TARGET = Object.freeze({
  operationId: 'H_EARTH_TERRAIN_AND_ESTATE_CONSTRUCTION_v1',
  lockScope: 'H_EARTH:TERRAIN_AND_ESTATE_CONSTRUCTION:GRATITUDE_REGION_MIRROR_MANOR_PRECINCT:V1:EXACT_32_PATH_SCOPE',
  scopeHash: '472cb4b8b715a26055afa4ba34cf821a327c30c9d7f4380166e4964165ab2e6f',
  lockGeneration: 411,
  terminalDisposition: 'SUPERSEDED'
});

const SELF = Object.freeze({
  operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_SUPERSEDE_411_001',
  lockScope: 'H_EARTH:MAP_WIDE_ENVIRONMENT_REDEVELOPMENT:SUPERSEDE_411:TERMINAL_CLOSURE:V1:EXACT_2_PATH_SCOPE',
  scopeHash: 'c94e8ac3a71e4ae8208e1c00a056c4b21205421d69b28dbaa6e92840f74f35fc',
  lockGeneration: 421,
  terminalDisposition: 'PASS_CLOSED'
});

const EXACT_PATHS = Object.freeze([
  '.github/workflows/h-earth-terrain-estate-construction-registry-prerequisite-terminal-closure.yml',
  'tools/h-earth-terrain-estate-construction-registry-prerequisite-terminal-closure.v1.mjs'
]);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const jsonText = (value) => JSON.stringify(stable(value), null, 2) + '\n';

function fail(code, detail = null) {
  const error = new Error(detail == null ? code : `${code}:${JSON.stringify(detail)}`);
  error.code = code;
  error.detail = detail;
  throw error;
}

function sameSet(left, right) {
  return JSON.stringify([...new Set(left)].sort()) === JSON.stringify([...new Set(right)].sort());
}

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function verifyStatic() {
  if (scopeHash(TARGET.lockScope) !== TARGET.scopeHash) fail('TARGET_SCOPE_HASH_MISMATCH');
  if (scopeHash(SELF.lockScope) !== SELF.scopeHash) fail('SELF_SCOPE_HASH_MISMATCH');
  if (TARGET.lockGeneration !== 411 || TARGET.terminalDisposition !== 'SUPERSEDED') {
    fail('TARGET_DISPOSITION_CONTRACT_MISMATCH');
  }
  if (SELF.lockGeneration !== 421 || SELF.terminalDisposition !== 'PASS_CLOSED') {
    fail('SELF_DISPOSITION_CONTRACT_MISMATCH');
  }
  return stable({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_SUPERSEDE_411_STATIC_RECEIPT_v1',
    result: 'PASS',
    governingMain: MAIN,
    governingTree: MAIN_TREE,
    target: TARGET,
    self: SELF,
    preservedStep2Branch: PRESERVED_STEP2_BRANCH,
    preservedStep2Head: PRESERVED_STEP2_HEAD,
    exactPaths: [...EXACT_PATHS]
  });
}

function verifyBranchDelta() {
  const head = git('rev-parse', 'HEAD');
  const mergeBase = git('merge-base', MAIN, head);
  if (mergeBase !== MAIN) fail('BRANCH_BASE_MISMATCH', { expected: MAIN, actual: mergeBase });
  const changed = git('diff', '--name-only', `${MAIN}..${head}`)
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean);
  if (changed.length !== 2 || !sameSet(changed, EXACT_PATHS)) {
    fail('BRANCH_SCOPE_MISMATCH', { changed, expected: EXACT_PATHS });
  }
  return stable({ head, mergeBase, changedPaths: [...changed].sort() });
}

function headers(token) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

async function apiJson(apiPath, token) {
  const response = await fetch(`https://api.github.com${apiPath}`, { headers: headers(token) });
  const raw = await response.text();
  let body;
  try { body = raw ? JSON.parse(raw) : null; } catch { body = { raw }; }
  if (!response.ok) fail('GITHUB_API_READ_FAILED', { status: response.status, apiPath, body });
  return body;
}

async function verifyRemoteIdentity(token) {
  const [owner, repo] = REPOSITORY.split('/');
  const [mainRef, step2Ref] = await Promise.all([
    apiJson(`/repos/${owner}/${repo}/git/ref/heads/main`, token),
    apiJson(`/repos/${owner}/${repo}/git/ref/heads/${PRESERVED_STEP2_BRANCH.replaceAll('/', '%2F')}`, token)
  ]);
  if (mainRef?.object?.sha !== MAIN) {
    fail('CURRENT_MAIN_MISMATCH', { expected: MAIN, observed: mainRef?.object?.sha ?? null });
  }
  if (step2Ref?.object?.sha !== PRESERVED_STEP2_HEAD) {
    fail('STEP_2_PRESERVATION_FAILURE', { expected: PRESERVED_STEP2_HEAD, observed: step2Ref?.object?.sha ?? null });
  }
  return stable({ currentMain: mainRef.object.sha, preservedStep2Head: step2Ref.object.sha });
}

async function readLedger(token) {
  const [owner, repo] = REPOSITORY.split('/');
  const ref = await apiJson(`/repos/${owner}/${repo}/git/ref/heads/operation-locks/repository-operation-intake-v1`, token);
  const head = ref?.object?.sha;
  if (!/^[0-9a-f]{40}$/.test(head ?? '')) fail('LOCK_REF_HEAD_INVALID', head);
  const file = await apiJson(`/repos/${owner}/${repo}/contents/.github/operation-intake/active-operation-ledger.v1.json?ref=${head}`, token);
  const ledger = JSON.parse(Buffer.from(String(file.content).replace(/\s/g, ''), 'base64').toString('utf8'));
  return stable({ head, ledger });
}

function activeMatch(ledger, expected) {
  const entry = ledger?.activeScopes?.[expected.scopeHash] ?? null;
  if (!entry) return null;
  return entry.operationId === expected.operationId &&
    entry.lockScope === expected.lockScope &&
    entry.scopeHash === expected.scopeHash &&
    entry.lockGeneration === expected.lockGeneration &&
    entry.state === 'ADMITTED_LOCKED' &&
    entry.released === false ? entry : null;
}

function terminalMatch(ledger, expected) {
  return (ledger?.terminalHistory ?? []).find((entry) =>
    entry.operationId === expected.operationId &&
    entry.lockScope === expected.lockScope &&
    entry.scopeHash === expected.scopeHash &&
    entry.lockGeneration === expected.lockGeneration &&
    entry.state === 'TERMINAL' &&
    entry.released === true &&
    entry.terminalDisposition === expected.terminalDisposition
  ) ?? null;
}

async function closeWithRetry(token, expected, failureCode) {
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    const observed = await readLedger(token);
    const terminal = terminalMatch(observed.ledger, expected);
    if (terminal) return stable({ alreadyTerminal: true, attempts: attempt - 1, terminal });
    const active = activeMatch(observed.ledger, expected);
    if (!active) fail(failureCode, { reason: 'ACTIVE_OR_TERMINAL_IDENTITY_NOT_FOUND', attempt });
    try {
      const receipt = await closeRemote({
        repository: REPOSITORY,
        lockRef: LOCK_REF,
        token,
        operationId: expected.operationId,
        lockScope: expected.lockScope,
        lockGeneration: expected.lockGeneration,
        terminalDisposition: expected.terminalDisposition
      });
      if (receipt.result === 'TERMINAL_CLOSURE_COMMITTED' && receipt.lockReleased === true) {
        return stable({ alreadyTerminal: false, attempts: attempt, closureReceipt: receipt });
      }
      if (receipt.errorCode !== 'LEDGER_COMPARE_AND_SWAP_CONFLICT' || ![409, 422].includes(receipt.httpStatus)) {
        fail(failureCode, { reason: 'NONRETRYABLE_CLOSURE_RECEIPT', receipt });
      }
    } catch (error) {
      const after = await readLedger(token);
      const nowTerminal = terminalMatch(after.ledger, expected);
      if (nowTerminal) return stable({ alreadyTerminal: true, attempts: attempt, terminal: nowTerminal });
      if (error?.code && error.code !== 'LEDGER_COMPARE_AND_SWAP_CONFLICT') throw error;
    }
    await delay(500 + attempt * 250);
  }
  fail(failureCode, { reason: 'CAS_RETRY_EXHAUSTED' });
}

async function verifyTerminal(token) {
  const remote = await verifyRemoteIdentity(token);
  const observed = await readLedger(token);
  const targetTerminal = terminalMatch(observed.ledger, TARGET);
  const selfTerminal = terminalMatch(observed.ledger, SELF);
  if (!targetTerminal) fail('TARGET_LOCK_411_TERMINAL_MISMATCH');
  if (!selfTerminal) fail('SELF_LOCK_TERMINAL_MISMATCH');
  return stable({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_SUPERSEDE_411_ROLE3_RECEIPT_v1',
    result: 'PASS',
    remote,
    targetTerminal,
    selfTerminal,
    lockRefHead: observed.head
  });
}

async function executeClosure() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) fail('GITHUB_TOKEN_MISSING');
  if (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY !== REPOSITORY) {
    fail('REPOSITORY_MISMATCH', process.env.GITHUB_REPOSITORY);
  }
  if (process.env.GITHUB_REF_NAME && process.env.GITHUB_REF_NAME !== BRANCH) {
    fail('BRANCH_NAME_MISMATCH', process.env.GITHUB_REF_NAME);
  }

  const staticReceipt = verifyStatic();
  const branch = verifyBranchDelta();
  const beforeRemote = await verifyRemoteIdentity(token);
  const before = await readLedger(token);
  if (!activeMatch(before.ledger, TARGET)) fail('TARGET_LOCK_411_IDENTITY_MISMATCH');
  if (!activeMatch(before.ledger, SELF)) fail('SELF_LOCK_IDENTITY_MISMATCH');

  const targetClosure = await closeWithRetry(token, TARGET, 'TARGET_LOCK_411_CLOSURE_FAILURE');
  const middle = await readLedger(token);
  if (!terminalMatch(middle.ledger, TARGET)) fail('TARGET_LOCK_411_CLOSURE_FAILURE');
  if (!activeMatch(middle.ledger, SELF)) fail('SELF_LOCK_IDENTITY_MISMATCH');

  const selfClosure = await closeWithRetry(token, SELF, 'SELF_LOCK_CLOSURE_FAILURE');
  const terminal = await verifyTerminal(token);

  const receipt = stable({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_SUPERSEDE_411_RETURN_v1',
    result: 'PASS_CLOSED',
    staticReceipt,
    branch,
    beforeRemote,
    targetClosure,
    selfClosure,
    terminal,
    directLedgerMutation: false,
    constructionMutation: false,
    registryMutation: false,
    mergeDeploymentReleaseAuthority: false
  });
  const output = process.env.OUTPUT_PATH;
  if (output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, jsonText(receipt));
  }
  return receipt;
}

async function main() {
  const mode = process.argv[2];
  if (mode === '--verify-static') {
    process.stdout.write(jsonText(verifyStatic()));
    return;
  }
  if (mode === '--execute') {
    process.stdout.write(jsonText(await executeClosure()));
    return;
  }
  if (mode === '--verify-terminal') {
    const token = process.env.GITHUB_TOKEN;
    if (!token) fail('GITHUB_TOKEN_MISSING');
    const receipt = await verifyTerminal(token);
    const output = process.env.OUTPUT_PATH;
    if (output) {
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, jsonText(receipt));
    }
    process.stdout.write(jsonText(receipt));
    return;
  }
  fail('CLI_MODE_INVALID', mode ?? null);
}

main().catch((error) => {
  process.stderr.write(jsonText({ schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_SUPERSEDE_411_FAILURE_v1', errorCode: error.code ?? 'UNEXPECTED_ERROR', detail: error.detail ?? error.message }));
  process.exitCode = 1;
});
