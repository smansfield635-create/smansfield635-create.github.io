#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  closeRemote,
  scopeHash,
  stable
} from './operation-intake/repository-operation-lock-manager.v1.mjs';
import {
  runAutomaticHEarthPreflight
} from '../h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js';
import {
  H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS
} from '../h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.terrain-estate-construction-v1-authorized-candidate-scope.js';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';
const MAIN = '3f51f0cd159df33571905c6cb14253ebdd137e3b';
const MAIN_TREE = '3116d5c35bfdd575922dac614fb2e9f1d4f61ec5';
const SOURCE_PR = 712;
const SOURCE_CANDIDATE_HEAD = 'cb3be6358c98f9cca4a443bf53ff0231cbfce811';
const SOURCE_MERGE_COMMIT = MAIN;
const BRANCH = 'closure/h-earth-terrain-estate-construction-v1-registry-prerequisite-terminal-001';

const TARGET = Object.freeze({
  operationId: 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_001',
  lockScope: 'H_EARTH:TERRAIN_ESTATE_CONSTRUCTION:REGISTRY_PREREQUISITE:AUTHORIZED_CANDIDATE_PATHS:V1:EXACT_4_PATH_SCOPE',
  scopeHash: 'a91c4d4dbd19d37d4c4c67f431a7fc96a537d482b0f8385a3ed262baeea56203',
  lockGeneration: 413,
  terminalDisposition: 'PASS_CLOSED'
});

const CONSTRUCTION = Object.freeze({
  operationId: 'H_EARTH_TERRAIN_AND_ESTATE_CONSTRUCTION_v1',
  lockScope: 'H_EARTH:TERRAIN_AND_ESTATE_CONSTRUCTION:GRATITUDE_REGION_MIRROR_MANOR_PRECINCT:V1:EXACT_32_PATH_SCOPE',
  scopeHash: '472cb4b8b715a26055afa4ba34cf821a327c30c9d7f4380166e4964165ab2e6f',
  lockGeneration: 411
});

const SELF = Object.freeze({
  operationId: 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_TERMINAL_CLOSURE_001',
  lockScope: 'H_EARTH:TERRAIN_ESTATE_CONSTRUCTION:REGISTRY_PREREQUISITE:TERMINAL_CLOSURE:V1:EXACT_2_PATH_SCOPE',
  scopeHash: 'c3198c2f6768ae7760ffad415f6c4aeacbdb38ed901ced971107c764692eee7b',
  lockGeneration: 419,
  terminalDisposition: 'PASS_CLOSED'
});

const EXACT_PATHS = Object.freeze([
  '.github/workflows/h-earth-terrain-estate-construction-registry-prerequisite-terminal-closure.yml',
  'tools/h-earth-terrain-estate-construction-registry-prerequisite-terminal-closure.v1.mjs'
]);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const canonical = (value) => JSON.stringify(stable(value));
const text = (value) => JSON.stringify(stable(value), null, 2) + '\n';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fail(code, detail = null) {
  const error = new Error(detail == null ? code : `${code}:${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
  error.code = code;
  error.detail = detail;
  throw error;
}

function sameSet(left, right) {
  return JSON.stringify([...new Set(left)].sort()) === JSON.stringify([...new Set(right)].sort());
}

function verifyStatic() {
  if (scopeHash(TARGET.lockScope) !== TARGET.scopeHash) fail('TARGET_SCOPE_HASH_MISMATCH');
  if (scopeHash(CONSTRUCTION.lockScope) !== CONSTRUCTION.scopeHash) fail('CONSTRUCTION_SCOPE_HASH_MISMATCH');
  if (scopeHash(SELF.lockScope) !== SELF.scopeHash) fail('SELF_SCOPE_HASH_MISMATCH');
  if (H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS.length !== 30) {
    fail('AUTHORIZED_PATH_COUNT_MISMATCH', H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS.length);
  }
  if (new Set(H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS).size !== 30) {
    fail('AUTHORIZED_PATH_DUPLICATE');
  }
  const preflight = runAutomaticHEarthPreflight({
    paths: [...H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS],
    taskText: 'H-Earth terrain-estate registry prerequisite post-merge terminal closure verification',
    mutationIntent: false
  });
  const classifications = preflight.pathClassification?.classifications ?? [];
  const checks = stable({
    exactPathCount: preflight.pathClassification?.normalizedPaths?.length === 30,
    hEarthPathCount: preflight.pathClassification?.hEarthPaths?.length === 30,
    noOutsidePaths: preflight.pathClassification?.outsidePaths?.length === 0,
    allRegistered: classifications.length === 30 &&
      classifications.every((entry) =>
        entry.insideScopeRoot === true &&
        entry.registered === true &&
        entry.classification === 'REGISTERED_H_EARTH_PATH'
      ),
    dependenciesVerified: preflight.dependenciesVerified === true,
    validatorPass: preflight.validatorReceipt?.finalDisposition === 'PASS',
    finalDispositionPass: preflight.finalDisposition === 'PASS'
  });
  if (!Object.values(checks).every(Boolean)) fail('POST_MERGE_REGISTRY_PREFLIGHT_FAILURE', {checks, preflight});
  return stable({
    schema: 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_TERMINAL_CLOSURE_STATIC_RECEIPT_v1',
    result: 'PASS',
    governingMain: MAIN,
    governingTree: MAIN_TREE,
    authorizedPathCount: 30,
    checks,
    preflightReceiptId: preflight.receiptId,
    preflightFinalDisposition: preflight.finalDisposition
  });
}

function git(...args) {
  return execFileSync('git', args, {cwd: ROOT, encoding: 'utf8'}).trim();
}

function verifyBranchDelta() {
  const head = git('rev-parse', 'HEAD');
  const mergeBase = git('merge-base', MAIN, head);
  if (mergeBase !== MAIN) fail('BRANCH_BASE_MISMATCH', {expected: MAIN, actual: mergeBase});
  const changed = git('diff', '--name-only', `${MAIN}..${head}`)
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean);
  if (!sameSet(changed, EXACT_PATHS) || changed.length !== 2) {
    fail('BRANCH_SCOPE_MISMATCH', {changed, expected: EXACT_PATHS});
  }
  return stable({head, mergeBase, changedPaths: [...changed].sort()});
}

function fileFingerprints() {
  const values = {};
  for (const repositoryPath of EXACT_PATHS) {
    const bytes = fs.readFileSync(path.join(ROOT, repositoryPath));
    values[repositoryPath] = stable({
      sha256: sha256(bytes),
      byteCount: bytes.length
    });
  }
  return stable(values);
}

function headers(token) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

async function apiJson(apiPath, token) {
  const response = await fetch(`https://api.github.com${apiPath}`, {headers: headers(token)});
  const raw = await response.text();
  let body;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = {raw};
  }
  if (!response.ok) fail('GITHUB_API_READ_FAILED', {status: response.status, apiPath, body});
  return body;
}

async function verifyRemoteIdentity(token) {
  const [owner, repo] = REPOSITORY.split('/');
  const [mainRef, pr] = await Promise.all([
    apiJson(`/repos/${owner}/${repo}/git/ref/heads/main`, token),
    apiJson(`/repos/${owner}/${repo}/pulls/${SOURCE_PR}`, token)
  ]);
  if (mainRef?.object?.sha !== MAIN) {
    fail('CURRENT_MAIN_MISMATCH', {expected: MAIN, observed: mainRef?.object?.sha ?? null});
  }
  const prChecks = {
    merged: pr?.merged === true,
    head: pr?.head?.sha === SOURCE_CANDIDATE_HEAD,
    mergeCommit: pr?.merge_commit_sha === SOURCE_MERGE_COMMIT
  };
  if (!Object.values(prChecks).every(Boolean)) fail('PR_712_IDENTITY_MISMATCH', prChecks);
  return stable({currentMain: mainRef.object.sha, prChecks});
}

async function readLedger(token) {
  const [owner, repo] = REPOSITORY.split('/');
  const ref = await apiJson(
    `/repos/${owner}/${repo}/git/ref/heads/operation-locks/repository-operation-intake-v1`,
    token
  );
  const head = ref?.object?.sha;
  if (!/^[0-9a-f]{40}$/.test(head ?? '')) fail('LOCK_REF_HEAD_INVALID', head);
  const file = await apiJson(
    `/repos/${owner}/${repo}/contents/.github/operation-intake/active-operation-ledger.v1.json?ref=${head}`,
    token
  );
  const ledger = JSON.parse(Buffer.from(String(file.content).replace(/\s/g, ''), 'base64').toString('utf8'));
  return stable({head, blob: file.sha, ledger});
}

function activeMatch(ledger, expected) {
  const entry = ledger?.activeScopes?.[expected.scopeHash] ?? null;
  if (!entry) return null;
  const exact =
    entry.operationId === expected.operationId &&
    entry.lockScope === expected.lockScope &&
    entry.scopeHash === expected.scopeHash &&
    entry.lockGeneration === expected.lockGeneration &&
    entry.state === 'ADMITTED_LOCKED' &&
    entry.released === false;
  return exact ? entry : null;
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

function requireConstructionActive(ledger) {
  const entry = activeMatch(ledger, CONSTRUCTION);
  if (!entry) fail('CONSTRUCTION_LOCK_411_IDENTITY_MISMATCH');
  return entry;
}

function requireTargetActive(ledger) {
  const entry = activeMatch(ledger, TARGET);
  if (!entry) fail('TARGET_LOCK_413_IDENTITY_MISMATCH');
  return entry;
}

function requireSelfActive(ledger) {
  const entry = activeMatch(ledger, SELF);
  if (!entry) fail('SELF_LOCK_IDENTITY_MISMATCH');
  return entry;
}

async function closeWithRetry(token, expected, failureCode) {
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    const observed = await readLedger(token);
    const terminal = terminalMatch(observed.ledger, expected);
    if (terminal) {
      return stable({alreadyTerminal: true, attempts: attempt - 1, terminal, closureReceipt: null});
    }
    const active = activeMatch(observed.ledger, expected);
    if (!active) fail(failureCode, {reason: 'ACTIVE_OR_TERMINAL_IDENTITY_NOT_FOUND', attempt});
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
        return stable({alreadyTerminal: false, attempts: attempt, terminal: null, closureReceipt: receipt});
      }
      if (
        receipt.errorCode !== 'LEDGER_COMPARE_AND_SWAP_CONFLICT' ||
        ![409, 422].includes(receipt.httpStatus)
      ) {
        fail(failureCode, {reason: 'NONRETRYABLE_CLOSURE_RECEIPT', receipt});
      }
    } catch (error) {
      const afterError = await readLedger(token);
      const nowTerminal = terminalMatch(afterError.ledger, expected);
      if (nowTerminal) {
        return stable({
          alreadyTerminal: true,
          attempts: attempt,
          terminal: nowTerminal,
          closureReceipt: null,
          recoveredAfterError: error.message
        });
      }
      if (error?.code && error.code !== 'LEDGER_COMPARE_AND_SWAP_CONFLICT') throw error;
    }
    await delay(500 + attempt * 250);
  }
  fail(failureCode, {reason: 'CAS_RETRY_EXHAUSTED'});
}

function fingerprintPayload({
  branch,
  files,
  staticReceipt,
  targetTerminal,
  selfTerminal,
  constructionActive
}) {
  return stable({
    schema: 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_TERMINAL_CLOSURE_FINGERPRINT_DOMAIN_v1',
    main: MAIN,
    mainTree: MAIN_TREE,
    sourcePr: SOURCE_PR,
    sourceCandidateHead: SOURCE_CANDIDATE_HEAD,
    sourceMergeCommit: SOURCE_MERGE_COMMIT,
    carrierHead: branch.head,
    exactChangedPaths: branch.changedPaths,
    files,
    postMergeRegistryPreflight: {
      authorizedPathCount: staticReceipt.authorizedPathCount,
      checks: staticReceipt.checks,
      finalDisposition: staticReceipt.preflightFinalDisposition
    },
    targetClosure: {
      operationId: targetTerminal.operationId,
      scopeHash: targetTerminal.scopeHash,
      lockGeneration: targetTerminal.lockGeneration,
      terminalDisposition: targetTerminal.terminalDisposition,
      released: targetTerminal.released,
      state: targetTerminal.state
    },
    selfClosure: {
      operationId: selfTerminal.operationId,
      scopeHash: selfTerminal.scopeHash,
      lockGeneration: selfTerminal.lockGeneration,
      terminalDisposition: selfTerminal.terminalDisposition,
      released: selfTerminal.released,
      state: selfTerminal.state
    },
    constructionPreservation: {
      operationId: constructionActive.operationId,
      scopeHash: constructionActive.scopeHash,
      lockGeneration: constructionActive.lockGeneration,
      released: constructionActive.released,
      state: constructionActive.state
    }
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
  const files = fileFingerprints();
  const remote = await verifyRemoteIdentity(token);

  const before = await readLedger(token);
  const constructionBefore = requireConstructionActive(before.ledger);
  requireTargetActive(before.ledger);
  requireSelfActive(before.ledger);

  const targetClosure = await closeWithRetry(token, TARGET, 'TARGET_LOCK_413_CLOSURE_FAILURE');

  const middle = await readLedger(token);
  const targetTerminalMiddle = terminalMatch(middle.ledger, TARGET);
  if (!targetTerminalMiddle) fail('TARGET_LOCK_413_CLOSURE_FAILURE', 'TERMINAL_NOT_VERIFIED_AFTER_CLOSE');
  requireConstructionActive(middle.ledger);
  requireSelfActive(middle.ledger);

  const selfClosure = await closeWithRetry(token, SELF, 'SELF_LOCK_CLOSURE_FAILURE');

  const after = await readLedger(token);
  const targetTerminal = terminalMatch(after.ledger, TARGET);
  const selfTerminal = terminalMatch(after.ledger, SELF);
  const constructionAfter = requireConstructionActive(after.ledger);
  if (!targetTerminal) fail('TARGET_LOCK_413_CLOSURE_FAILURE', 'FINAL_TERMINAL_NOT_VERIFIED');
  if (!selfTerminal) fail('SELF_LOCK_CLOSURE_FAILURE', 'FINAL_TERMINAL_NOT_VERIFIED');

  const domain = fingerprintPayload({
    branch,
    files,
    staticReceipt,
    targetTerminal,
    selfTerminal,
    constructionActive: constructionAfter
  });
  const verificationFingerprint = sha256(canonical(domain));

  const receipt = stable({
    schema: 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_TERMINAL_CLOSURE_RETURN_v1',
    result: 'PASS_CLOSED',
    repository: REPOSITORY,
    governingMain: MAIN,
    governingTree: MAIN_TREE,
    sourcePr: SOURCE_PR,
    sourceCandidateHead: SOURCE_CANDIDATE_HEAD,
    sourceMergeCommit: SOURCE_MERGE_COMMIT,
    closureCarrierBranch: BRANCH,
    closureCarrierHead: branch.head,
    exactChangedPaths: branch.changedPaths,
    exactCarrierFiles: files,
    staticVerification: staticReceipt,
    remoteIdentityVerification: remote,
    beforeLedgerHead: before.head,
    afterLedgerHead: after.head,
    targetGeneration413: {
      result: 'PASS_CLOSED_VERIFIED',
      closure: targetClosure,
      terminal: targetTerminal
    },
    selfGeneration419: {
      result: 'PASS_CLOSED_VERIFIED',
      closure: selfClosure,
      terminal: selfTerminal
    },
    constructionGeneration411: {
      result: 'PRESERVED_ACTIVE_EXACT',
      before: constructionBefore,
      after: constructionAfter
    },
    directLedgerEditing: false,
    canonicalCloseRemoteUsed: true,
    boundedCasRetryUsed: true,
    terrainConstructionPerformed: false,
    estateConstructionPerformed: false,
    manorConstructionPerformed: false,
    previewMutationPerformed: false,
    mainMutationPerformed: false,
    mergePerformed: false,
    deploymentPerformed: false,
    releasePerformed: false,
    verificationFingerprint
  });

  const outputPath =
    process.env.OUTPUT_PATH ??
    '/tmp/h-earth-terrain-estate-construction-registry-prerequisite-terminal-closure/terminal-closure-return.v1.json';
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, text(receipt));
  process.stdout.write(text({
    schema: receipt.schema,
    result: receipt.result,
    closureCarrierHead: receipt.closureCarrierHead,
    verificationFingerprint: receipt.verificationFingerprint
  }));
}

async function verifyTerminal() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) fail('GITHUB_TOKEN_MISSING');
  const staticReceipt = verifyStatic();
  const branch = verifyBranchDelta();
  const files = fileFingerprints();
  const remote = await verifyRemoteIdentity(token);
  const observed = await readLedger(token);
  const targetTerminal = terminalMatch(observed.ledger, TARGET);
  const selfTerminal = terminalMatch(observed.ledger, SELF);
  const constructionActive = requireConstructionActive(observed.ledger);
  if (!targetTerminal) fail('TARGET_LOCK_413_CLOSURE_FAILURE', 'ROLE3_TARGET_TERMINAL_NOT_FOUND');
  if (!selfTerminal) fail('SELF_LOCK_CLOSURE_FAILURE', 'ROLE3_SELF_TERMINAL_NOT_FOUND');

  const domain = fingerprintPayload({
    branch,
    files,
    staticReceipt,
    targetTerminal,
    selfTerminal,
    constructionActive
  });
  const verificationFingerprint = sha256(canonical(domain));
  const receipt = stable({
    schema: 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_TERMINAL_CLOSURE_ROLE_3_RECEIPT_v1',
    result: 'PASS',
    role: 'ROLE_3_FRESH_INDEPENDENT_VERIFICATION_AUTHORITY',
    repository: REPOSITORY,
    governingMain: MAIN,
    closureCarrierBranch: BRANCH,
    closureCarrierHead: branch.head,
    exactChangedPaths: branch.changedPaths,
    exactCarrierFiles: files,
    staticVerification: staticReceipt,
    remoteIdentityVerification: remote,
    targetGeneration413: 'PASS_CLOSED_VERIFIED',
    selfGeneration419: 'PASS_CLOSED_VERIFIED',
    constructionGeneration411: 'PRESERVED_ACTIVE_EXACT',
    directLedgerEditingObserved: false,
    repairPerformed: false,
    verificationFingerprint
  });
  const outputPath =
    process.env.OUTPUT_PATH ??
    '/tmp/h-earth-terrain-estate-construction-registry-prerequisite-terminal-closure/role3-terminal-verification.v1.json';
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, text(receipt));
  process.stdout.write(text({
    schema: receipt.schema,
    result: receipt.result,
    verificationFingerprint: receipt.verificationFingerprint
  }));
}

async function main() {
  const mode = process.argv[2];
  if (mode === '--verify-static') {
    process.stdout.write(text(verifyStatic()));
    return;
  }
  if (mode === '--execute') {
    await executeClosure();
    return;
  }
  if (mode === '--verify-terminal') {
    await verifyTerminal();
    return;
  }
  fail('USAGE', '--verify-static | --execute | --verify-terminal');
}

main().catch((error) => {
  process.stderr.write(text({
    schema: 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_TERMINAL_CLOSURE_FAILURE_v1',
    result: 'FAIL_CLOSED',
    errorCode: error.code ?? 'UNEXPECTED_ERROR',
    detail: error.detail ?? null,
    error: error.message
  }));
  process.exitCode = 1;
});
