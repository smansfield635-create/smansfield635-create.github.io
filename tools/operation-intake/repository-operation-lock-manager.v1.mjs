#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';
const TERMINAL = ['PASS_CLOSED','FAIL_CLOSED','REJECTED_CLOSED','WITHDRAWN','SUPERSEDED','VOIDED','EXPIRED'];
const DEFAULT_STABILIZATION_MAX_READS = 12;
const DEFAULT_STABILIZATION_DELAY_MS = 125;
const DEFAULT_CLOSURE_CAS_MAX_ATTEMPTS = 6;

export const stable = v => Array.isArray(v) ? v.map(stable) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, stable(v[k])])) : v;
export const canonical = v => JSON.stringify(stable(v));
export const text = v => JSON.stringify(stable(v), null, 2) + '\n';
export const sha = v => createHash('sha256').update(v, 'utf8').digest('hex');

export const canonScope = s => {
  if (typeof s !== 'string' || !s.trim()) throw err('INVALID_LOCK_SCOPE', 'lockScope', 'lock-request');
  return s.trim().toUpperCase();
};
export const scopeHash = s => sha(canonScope(s));

export function err(code, field, source, detail = null) {
  const e = new Error(`${code}:${field}:source=${source}${detail ? ':' + detail : ''}`);
  Object.assign(e, { code, field, sourceDocument: source, detail });
  return e;
}

const str = (v, f, s) => {
  if (typeof v !== 'string' || !v) throw err('MISSING_OR_INVALID_FIELD', f, s);
  return v;
};
const dig = (v, n, f, s) => {
  str(v, f, s);
  if (!new RegExp(`^[0-9a-f]{${n}}$`).test(v)) throw err('MISSING_OR_INVALID_DIGEST', f, s);
  return v;
};
const boundedInt = (v, fallback, min, max, field) => {
  const n = v === undefined || v === null || v === '' ? fallback : Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw err('MISSING_OR_INVALID_FIELD', field, 'closure-request');
  return n;
};

export function ledger(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw err('INVALID_LEDGER_OBJECT', '$', 'ledger');
  if (v.schema !== 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1') throw err('LEDGER_SCHEMA_MISMATCH', 'schema', 'ledger');
  if (!Number.isInteger(v.lockGeneration) || v.lockGeneration < 0) throw err('INVALID_LOCK_GENERATION', 'lockGeneration', 'ledger');
  if (!v.activeScopes || typeof v.activeScopes !== 'object' || !Array.isArray(v.terminalHistory)) throw err('INVALID_LEDGER_SHAPE', '$', 'ledger');
  return stable(v);
}

export function acquireLocal(raw, r) {
  const l = ledger(raw);
  const operationId = str(r.operationId, 'operationId', 'lock-request');
  const lockScope = canonScope(r.lockScope);
  const governingHead = dig(r.governingHead, 40, 'governingHead', 'lock-request');
  const requestDigest = dig(r.requestDigest, 64, 'requestDigest', 'lock-request');
  const procedureLocatorDigest = dig(r.procedureLocatorDigest, 64, 'procedureLocatorDigest', 'lock-request');
  const h = scopeHash(lockScope);
  const x = l.activeScopes[h];
  if (x && !x.released && ['ADMITTED_LOCKED','EXECUTING','BLOCKED_OPEN'].includes(x.state)) {
    return { acquired: false, result: 'ACTIVE_SCOPE_ALREADY_LOCKED', errorCode: 'ACTIVE_OPERATION_ALREADY_EXISTS', activeOperationId: x.operationId, lockGeneration: x.lockGeneration, scopeHash: h, ledger: l };
  }
  const g = l.lockGeneration + 1;
  const lock = { schema: 'REPOSITORY_OPERATION_LOCK_v1', operationId, lockScope, scopeHash: h, state: 'ADMITTED_LOCKED', governingHead, requestDigest, procedureLocatorDigest, lockGeneration: g, released: false };
  return { acquired: true, result: 'ADMITTED_AND_LOCKED', lock, ledger: stable({ ...l, lockGeneration: g, activeScopes: { ...l.activeScopes, [h]: lock } }) };
}

export function closeLocal(raw, r) {
  const l = ledger(raw);
  const operationId = str(r.operationId, 'operationId', 'closure-request');
  const lockScope = canonScope(r.lockScope);
  const h = scopeHash(lockScope);
  const g = Number(r.lockGeneration);
  const d = str(r.terminalDisposition, 'terminalDisposition', 'closure-request');
  const x = l.activeScopes[h];
  if (!TERMINAL.includes(d)) throw err('TERMINAL_DISPOSITION_INVALID', 'terminalDisposition', 'closure-request');
  if (!x) throw err('ACTIVE_LOCK_NOT_FOUND', 'lockScope', 'ledger');
  if (x.operationId !== operationId) throw err('LOCK_OPERATION_ID_MISMATCH', 'operationId', 'closure-request');
  if (x.lockGeneration !== g) throw err('LOCK_GENERATION_MISMATCH', 'lockGeneration', 'closure-request');
  const terminal = stable({ ...x, state: 'TERMINAL', terminalDisposition: d, released: true });
  const activeScopes = { ...l.activeScopes };
  delete activeScopes[h];
  return {
    closed: true,
    receipt: { schema: 'REPOSITORY_OPERATION_CLOSURE_RECEIPT_v1', operationId, lockScope, scopeHash: h, lockGeneration: g, terminalDisposition: d, terminalHistoryPreserved: true, lockReleased: true },
    ledger: stable({ ...l, activeScopes, terminalHistory: [...l.terminalHistory, terminal] })
  };
}

const branch = r => {
  if (typeof r !== 'string' || !r.startsWith('refs/heads/')) throw err('INVALID_LOCK_REF', 'lockRef', 'remote-lock');
  return r.slice(11);
};
const H = t => ({ Accept: 'application/vnd.github+json', Authorization: `Bearer ${str(t, 'GITHUB_TOKEN', 'environment')}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' });
const base = r => `https://api.github.com/repos/${str(r, 'repository', 'remote-lock')}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function req(u, o, ok = [200]) {
  const z = await fetch(u, o);
  const q = await z.text();
  let b;
  try { b = q ? JSON.parse(q) : null; } catch { b = { raw: q }; }
  if (!ok.includes(z.status)) {
    const e = new Error(`GITHUB_API_ERROR:${z.status}`);
    e.status = z.status;
    e.body = b;
    throw e;
  }
  return b;
}

export async function ensureRef({ repository, lockRef = LOCK_REF, baseHead, token }) {
  dig(baseHead, 40, 'baseHead', 'remote-lock');
  const b = branch(lockRef), u = base(repository), r = encodeURIComponent('heads/' + b);
  try {
    const x = await req(`${u}/git/ref/${r}`, { headers: H(token) });
    return { result: 'LOCK_REF_ALREADY_EXISTS', branch: b, head: x.object.sha };
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  try {
    const x = await req(`${u}/git/refs`, { method: 'POST', headers: H(token), body: JSON.stringify({ ref: lockRef, sha: baseHead }) }, [201]);
    return { result: 'LOCK_REF_CREATED', branch: b, head: x.object.sha };
  } catch (e) {
    if (e.status !== 422) throw e;
    const x = await req(`${u}/git/ref/${r}`, { headers: H(token) });
    return { result: 'LOCK_REF_ALREADY_EXISTS_AFTER_RACE', branch: b, head: x.object.sha };
  }
}

async function readLedgerAtRef({ repository, token, ref }) {
  const u = base(repository);
  const p = LEDGER_PATH.split('/').map(encodeURIComponent).join('/');
  const f = await req(`${u}/contents/${p}?ref=${encodeURIComponent(ref)}`, { headers: H(token) });
  return { blob: dig(f.sha, 40, 'ledgerBlobSha', 'remote-lock'), ledger: ledger(JSON.parse(Buffer.from(f.content.replace(/\s/g, ''), 'base64').toString())) };
}

async function readRemote({ repository, lockRef = LOCK_REF, token }) {
  const b = branch(lockRef), u = base(repository);
  const r = await req(`${u}/git/ref/${encodeURIComponent('heads/' + b)}`, { headers: H(token) });
  const head = dig(r.object.sha, 40, 'lockRefHead', 'remote-lock');
  const f = await readLedgerAtRef({ repository, token, ref: head });
  return { ...f, head };
}

async function put({ repository, lockRef = LOCK_REF, token, blob, next, message }) {
  const b = branch(lockRef), u = base(repository), p = LEDGER_PATH.split('/').map(encodeURIComponent).join('/');
  try {
    const x = await req(`${u}/contents/${p}`, { method: 'PUT', headers: H(token), body: JSON.stringify({ message, content: Buffer.from(text(next)).toString('base64'), sha: blob, branch: b }) }, [200]);
    return { ok: true, commit: x.commit.sha, blob: x.content.sha };
  } catch (e) {
    if ([409, 422].includes(e.status)) return { ok: false, errorCode: 'LEDGER_COMPARE_AND_SWAP_CONFLICT', httpStatus: e.status };
    throw e;
  }
}

function assertAnchoredLock(l, a, source = 'acquisition-anchor') {
  const h = scopeHash(a.lockScope);
  const x = ledger(l).activeScopes[h];
  if (!x) throw err('ACQUISITION_ANCHOR_LOCK_NOT_FOUND', 'lockScope', source);
  if (x.operationId !== a.operationId) throw err('ACQUISITION_ANCHOR_OPERATION_ID_MISMATCH', 'operationId', source);
  if (x.lockGeneration !== Number(a.lockGeneration)) throw err('ACQUISITION_ANCHOR_GENERATION_MISMATCH', 'lockGeneration', source);
  return x;
}

function terminalMatch(l, a) {
  const h = scopeHash(a.lockScope);
  return ledger(l).terminalHistory.find(x => x.scopeHash === h && x.operationId === a.operationId && x.lockGeneration === Number(a.lockGeneration));
}

function closureConfig(a) {
  return {
    maxReads: boundedInt(a.stabilizationMaxReads, DEFAULT_STABILIZATION_MAX_READS, 1, 100, 'stabilizationMaxReads'),
    delayMs: boundedInt(a.stabilizationDelayMs, DEFAULT_STABILIZATION_DELAY_MS, 0, 10000, 'stabilizationDelayMs'),
    maxCasAttempts: boundedInt(a.closureCasMaxAttempts, DEFAULT_CLOSURE_CAS_MAX_ATTEMPTS, 1, 50, 'closureCasMaxAttempts')
  };
}

function acquisitionAnchor(a) {
  if (!a.acquisitionCommitSha && !a.committedLedgerBlobSha) return null;
  return {
    acquisitionCommitSha: dig(a.acquisitionCommitSha, 40, 'acquisitionCommitSha', 'closure-request'),
    committedLedgerBlobSha: dig(a.committedLedgerBlobSha, 40, 'committedLedgerBlobSha', 'closure-request')
  };
}

const defaultIO = { readCurrent: readRemote, readAtRef: readLedgerAtRef, write: put, wait };

export async function acquireRemote(a, io = defaultIO) {
  const o = await io.readCurrent(a);
  const x = acquireLocal(o.ledger, a);
  if (!x.acquired) return stable({ schema: 'REPOSITORY_OPERATION_REMOTE_LOCK_RECEIPT_v1', result: x.result, errorCode: x.errorCode, operationId: a.operationId, lockScope: canonScope(a.lockScope), scopeHash: x.scopeHash, activeOperationId: x.activeOperationId, lockGeneration: x.lockGeneration, observedLedgerBlobSha: o.blob, observedBranchHead: o.head, lockAcquired: false });
  if (a.readyFile) {
    fs.mkdirSync(path.dirname(path.resolve(a.readyFile)), { recursive: true });
    fs.writeFileSync(path.resolve(a.readyFile), text({ operationId: a.operationId, observedLedgerBlobSha: o.blob, observedBranchHead: o.head, lockGeneration: x.lock.lockGeneration }));
  }
  if (a.barrierFile) {
    const deadline = Date.now() + Number(a.barrierTimeoutMs || 30000);
    while (!fs.existsSync(path.resolve(a.barrierFile))) {
      if (Date.now() > deadline) throw err('CAS_BARRIER_TIMEOUT', 'barrierFile', 'remote-lock');
      await io.wait(50);
    }
  }
  if (a.preWriteDelayMs) await io.wait(a.preWriteDelayMs);
  const u = await io.write({ ...a, blob: o.blob, next: x.ledger, message: `Acquire operation lock ${x.lock.lockGeneration}: ${a.operationId}` });
  return stable(u.ok ? { schema: 'REPOSITORY_OPERATION_REMOTE_LOCK_RECEIPT_v1', result: 'ADMITTED_AND_LOCKED', operationId: a.operationId, lockScope: x.lock.lockScope, scopeHash: x.lock.scopeHash, lockGeneration: x.lock.lockGeneration, observedLedgerBlobSha: o.blob, observedBranchHead: o.head, committedLedgerBlobSha: u.blob, acquisitionCommitSha: u.commit, lockAcquired: true } : { schema: 'REPOSITORY_OPERATION_REMOTE_LOCK_RECEIPT_v1', result: 'LOCK_NOT_ACQUIRED', errorCode: u.errorCode, httpStatus: u.httpStatus, operationId: a.operationId, lockScope: x.lock.lockScope, scopeHash: x.lock.scopeHash, lockGeneration: x.lock.lockGeneration, observedLedgerBlobSha: o.blob, observedBranchHead: o.head, lockAcquired: false });
}

export async function closeRemote(a, io = defaultIO) {
  const anchor = acquisitionAnchor(a);
  const cfg = closureConfig(a);
  if (!anchor) {
    const o = await io.readCurrent(a);
    const x = closeLocal(o.ledger, a);
    const u = await io.write({ ...a, blob: o.blob, next: x.ledger, message: `Close operation lock ${a.lockGeneration}: ${a.operationId} ${a.terminalDisposition}` });
    return stable(u.ok ? { schema: 'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1', result: 'TERMINAL_CLOSURE_COMMITTED', ...x.receipt, observedLedgerBlobSha: o.blob, observedBranchHead: o.head, committedLedgerBlobSha: u.blob, closureCommitSha: u.commit, stabilizationMode: 'LEGACY_SINGLE_READ' } : { schema: 'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1', result: 'LOCK_NOT_CLOSED', errorCode: u.errorCode, httpStatus: u.httpStatus, operationId: a.operationId, lockScope: canonScope(a.lockScope), lockGeneration: Number(a.lockGeneration), lockReleased: false, stabilizationMode: 'LEGACY_SINGLE_READ' });
  }

  const anchored = await io.readAtRef({ ...a, ref: anchor.acquisitionCommitSha });
  if (anchored.blob !== anchor.committedLedgerBlobSha) throw err('ACQUISITION_LEDGER_BLOB_MISMATCH', 'committedLedgerBlobSha', 'acquisition-anchor', `expected=${anchor.committedLedgerBlobSha}:observed=${anchored.blob}`);
  assertAnchoredLock(anchored.ledger, a);

  let stabilizationReadCount = 0;
  const readVisible = async () => {
    for (let i = 0; i < cfg.maxReads; i += 1) {
      const o = await io.readCurrent(a);
      stabilizationReadCount += 1;
      const h = scopeHash(a.lockScope), x = o.ledger.activeScopes[h];
      if (x) {
        if (x.operationId !== a.operationId) throw err('LOCK_OPERATION_ID_MISMATCH', 'operationId', 'closure-request');
        if (x.lockGeneration !== Number(a.lockGeneration)) throw err('LOCK_GENERATION_MISMATCH', 'lockGeneration', 'closure-request');
        return o;
      }
      const t = terminalMatch(o.ledger, a);
      if (t) throw err('ACTIVE_LOCK_ALREADY_TERMINAL', 'lockScope', 'ledger', `terminalDisposition=${t.terminalDisposition || 'UNKNOWN'}`);
      if (i + 1 >= cfg.maxReads) throw err('ACQUISITION_VISIBILITY_TIMEOUT', 'lockScope', 'remote-lock', `reads=${cfg.maxReads}:acquisitionCommit=${anchor.acquisitionCommitSha}`);
      await io.wait(cfg.delayMs);
    }
    throw err('ACQUISITION_VISIBILITY_TIMEOUT', 'lockScope', 'remote-lock', `reads=${cfg.maxReads}:acquisitionCommit=${anchor.acquisitionCommitSha}`);
  };

  let lastObservedHead = null, lastObservedBlob = null;
  for (let casAttempt = 1; casAttempt <= cfg.maxCasAttempts; casAttempt += 1) {
    const o = await readVisible();
    lastObservedHead = o.head;
    lastObservedBlob = o.blob;
    const c = closeLocal(o.ledger, a);
    const u = await io.write({ ...a, blob: o.blob, next: c.ledger, message: `Close operation lock ${a.lockGeneration}: ${a.operationId} ${a.terminalDisposition}` });
    if (u.ok) return stable({ schema: 'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1', result: 'TERMINAL_CLOSURE_COMMITTED', ...c.receipt, observedLedgerBlobSha: o.blob, observedBranchHead: o.head, committedLedgerBlobSha: u.blob, closureCommitSha: u.commit, acquisitionCommitSha: anchor.acquisitionCommitSha, acquisitionLedgerBlobSha: anchor.committedLedgerBlobSha, stabilizationMode: 'ACQUISITION_ANCHORED_BOUNDED_REREAD', stabilizationReadCount, closureCasAttempts: casAttempt });
    if (u.errorCode !== 'LEDGER_COMPARE_AND_SWAP_CONFLICT') return stable({ schema: 'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1', result: 'LOCK_NOT_CLOSED', errorCode: u.errorCode, httpStatus: u.httpStatus, operationId: a.operationId, lockScope: canonScope(a.lockScope), lockGeneration: Number(a.lockGeneration), lockReleased: false, acquisitionCommitSha: anchor.acquisitionCommitSha, acquisitionLedgerBlobSha: anchor.committedLedgerBlobSha, stabilizationMode: 'ACQUISITION_ANCHORED_BOUNDED_REREAD', stabilizationReadCount, closureCasAttempts: casAttempt });
    if (casAttempt >= cfg.maxCasAttempts) throw err('CLOSURE_CAS_RETRY_EXHAUSTED', 'lockScope', 'remote-lock', `attempts=${casAttempt}:head=${lastObservedHead}:blob=${lastObservedBlob}`);
    await io.wait(cfg.delayMs);
  }
  throw err('CLOSURE_CAS_RETRY_EXHAUSTED', 'lockScope', 'remote-lock', `attempts=${cfg.maxCasAttempts}:head=${lastObservedHead}:blob=${lastObservedBlob}`);
}

const args = v => {
  const a = {};
  for (let i = 0; i < v.length; i++) {
    if (!v[i].startsWith('--')) throw err('UNKNOWN_ARGUMENT', v[i], 'cli');
    a[v[i].slice(2)] = v[++i] ?? null;
  }
  return a;
};
const write = (p, v) => {
  if (!p) return process.stdout.write(text(v));
  fs.mkdirSync(path.dirname(path.resolve(p)), { recursive: true });
  fs.writeFileSync(path.resolve(p), text(v));
};

async function main() {
  const a = args(process.argv.slice(2)), token = process.env.GITHUB_TOKEN;
  let r;
  if (a.action === 'ensure-ref') r = await ensureRef({ repository: a.repository, lockRef: a['lock-ref'], baseHead: a['base-head'], token });
  else if (a.action === 'acquire') r = await acquireRemote({ repository: a.repository, lockRef: a['lock-ref'], token, operationId: a['operation-id'], lockScope: a['lock-scope'], governingHead: a['governing-head'], requestDigest: a['request-digest'], procedureLocatorDigest: a['procedure-digest'], preWriteDelayMs: Number(a['pre-write-delay-ms'] || 0), readyFile: a['ready-file'], barrierFile: a['barrier-file'], barrierTimeoutMs: Number(a['barrier-timeout-ms'] || 30000) });
  else if (a.action === 'close') r = await closeRemote({ repository: a.repository, lockRef: a['lock-ref'], token, operationId: a['operation-id'], lockScope: a['lock-scope'], lockGeneration: Number(a['lock-generation']), terminalDisposition: a['terminal-disposition'], acquisitionCommitSha: a['acquisition-commit-sha'], committedLedgerBlobSha: a['committed-ledger-blob-sha'], stabilizationMaxReads: a['stabilization-max-reads'] === undefined ? undefined : Number(a['stabilization-max-reads']), stabilizationDelayMs: a['stabilization-delay-ms'] === undefined ? undefined : Number(a['stabilization-delay-ms']), closureCasMaxAttempts: a['closure-cas-max-attempts'] === undefined ? undefined : Number(a['closure-cas-max-attempts']) });
  else throw err('MISSING_OR_INVALID_ACTION', 'action', 'cli');
  write(a.output, r);
  if (r.result === 'ACTIVE_SCOPE_ALREADY_LOCKED') process.exitCode = 3;
  if (['LOCK_NOT_ACQUIRED','LOCK_NOT_CLOSED'].includes(r.result)) process.exitCode = 4;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main().catch(e => {
  const f = { schema: 'REPOSITORY_OPERATION_LOCK_MANAGER_FAILURE_v1', result: 'FAIL_CLOSED', errorCode: e.code || 'UNEXPECTED_LOCK_MANAGER_ERROR', field: e.field || null, sourceDocument: e.sourceDocument || null, error: e.message, lockAcquired: false, lockReleased: false };
  try { write(args(process.argv.slice(2)).output, f); } catch { process.stderr.write(text(f)); }
  process.exitCode = 1;
});
