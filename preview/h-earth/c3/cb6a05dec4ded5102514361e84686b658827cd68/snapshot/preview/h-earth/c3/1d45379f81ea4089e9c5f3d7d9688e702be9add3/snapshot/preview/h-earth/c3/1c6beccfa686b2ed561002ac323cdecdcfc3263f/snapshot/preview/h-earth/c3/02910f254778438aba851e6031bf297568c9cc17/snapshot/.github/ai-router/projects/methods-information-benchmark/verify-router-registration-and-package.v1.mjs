#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const B = '3d80989e4571e62a5b9997aa70b223c0678ee1d3';
const A = '7eee0e3f7a8c37e548e7721f1f5c2df69b2a310a';
const F = '4fc8e2280057b426e1573ab5ac4f710e0b0d1881264d443a56fb25b9f560f79e';
const O = 'METHODS_INFORMATION_BENCHMARK_ROUTER_REGISTRATION_AND_ADOPTION_TRANSLATION_PACKAGE_MATERIALIZATION_v1';
const G58 = 'METHODS_AND_MODELS_AUDIT_OUTPUT_ADOPTION_AND_PAGE_TRANSLATION_v1';
const R = '.github/ai-router/router.v1.json';
const E = '.github/ai-router/projects/methods-information-benchmark/entrypoint.v1.json';
const C = '.github/ai-router/projects/methods-information-benchmark/router-registration-and-materialization.contract.v1.json';
const K = '.github/ai-router/projects/methods-information-benchmark/adoption-review-source-package.carrier.v1.json';
const V = '.github/ai-router/projects/methods-information-benchmark/verify-router-registration-and-package.v1.mjs';
const W = '.github/workflows/methods-information-benchmark-router-registration-and-adoption-translation-materialization-v1.yml';

const P = [
  '.github/workflows/methods-and-models-audit-output-adoption-and-page-translation-v1.yml',
  'control-plane/methods-information-benchmark/adoption-and-page-translation-v1/adoption-register.v1.json',
  'control-plane/methods-information-benchmark/adoption-and-page-translation-v1/page-translation-model.v1.json',
  'control-plane/methods-information-benchmark/adoption-and-page-translation-v1/rolodex-information-map.v1.json',
  'control-plane/methods-information-benchmark/adoption-and-page-translation-v1/review-summary.v1.json',
  'control-plane/methods-information-benchmark/adoption-and-page-translation-v1/receipts/independent-verification.receipt.v1.json',
  'control-plane/methods-information-benchmark/adoption-and-page-translation-v1/receipts/operation-closure.receipt.v1.json',
  'control-plane/methods-information-benchmark/adoption-and-page-translation-v1/review-package.v1.json'
];
const RP = [R, E, C, K, V].sort();
const IP = [W, P[0], P[1], P[2], P[3], P[4], P[7]].sort();
const FP = [...IP, P[5], P[6]].sort();

const st = x => Array.isArray(x)
  ? x.map(st)
  : x && typeof x === 'object'
    ? Object.fromEntries(Object.keys(x).sort().map(k => [k, st(x[k])]))
    : x;
const can = x => JSON.stringify(st(x));
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const shac = x => sha(Buffer.from(can(x)));
const txt = x => JSON.stringify(st(x), null, 2) + '\n';

function bad(c, d = null) {
  const e = new Error(c);
  e.code = c;
  e.detail = d;
  throw e;
}

function ex(c, a, ok = false, o = { encoding: 'utf8' }) {
  const r = spawnSync(c, a, o);
  if (r.error) throw r.error;
  if (!ok && r.status !== 0) {
    bad('COMMAND_FAILED', { c, a, status: r.status, stderr: r.stderr });
  }
  return r;
}

const git = (a, ok = false) => ex('git', a, ok);
const j = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sj = (h, p) => JSON.parse(git(['show', `${h}:${p}`]).stdout);
const has = (h, p) => git(['cat-file', '-e', `${h}:${p}`], true).status === 0;
const diff = (a, b) => git(['diff', '--name-only', `${a}..${b}`]).stdout
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .sort();
const eq = (a, b, c) => can(a) === can(b) || bad(c, { a, b });
const bm = (h, ps) => Object.fromEntries(ps.map(p => [
  p,
  git(['rev-parse', `${h}:${p}`]).stdout.trim()
]));

function args(v) {
  const a = {};
  for (let i = 0; i < v.length; i += 2) {
    if (!v[i]?.startsWith('--') || v[i + 1] === undefined) bad('INVALID_ARGUMENTS');
    a[v[i].slice(2)] = v[i + 1];
  }
  for (const k of ['mode', 'base-head', 'candidate-head', 'holder', 'output']) {
    if (!a[k]) bad('MISSING_ARGUMENT', k);
  }
  if (!['registration', 'package', 'final'].includes(a.mode)) bad('INVALID_MODE');
  return a;
}

function chunk(body, k, c) {
  const m = c.transport.marker + '\n';
  if (typeof body !== 'string' || !body.startsWith(m)) bad('CHUNK_MARKER', k.commentId);
  const p = JSON.parse(body.slice(m.length));
  if (
    p.schema !== 'METHODS_ADOPTION_SOURCE_PACKAGE_CHUNK_v1' ||
    p.packageFingerprint !== F ||
    p.zipSha256 !== c.exactZip.sha256 ||
    p.chunkIndex !== k.chunkIndex ||
    p.chunkCount !== c.exactZip.chunkCount ||
    p.chunkSha256 !== k.sha256 ||
    typeof p.base64 !== 'string'
  ) {
    bad('CHUNK_IDENTITY', k.commentId);
  }

  const policy = (c.transport.exactRecoveryPolicies ?? []).find(
    x => x.commentId === k.commentId && x.chunkIndex === k.chunkIndex
  );

  if (policy) {
    if (
      p.base64.length !== policy.observedBase64Length ||
      sha(Buffer.from(p.base64)) !== policy.observedBase64Sha256
    ) {
      bad('CHUNK_RECOVERY_OBSERVED', k.commentId);
    }

    if (policy.recoveryClass === 'EXACT_COMMENT_ID_PREFIX_AND_NEXT_CHUNK_CROSSCHECK_ONLY') {
      const accepted = p.base64.slice(0, k.length);
      const trailing = p.base64.slice(k.length);
      if (
        k.length !== policy.acceptedPrefixLength ||
        k.sha256 !== policy.acceptedPrefixSha256 ||
        accepted.length !== k.length ||
        sha(Buffer.from(accepted)) !== k.sha256 ||
        trailing.length !== policy.trailingLength ||
        sha(Buffer.from(trailing)) !== policy.trailingSha256
      ) {
        bad('CHUNK_RECOVERY_PREFIX', k.commentId);
      }
      return { base64: accepted, trailing, recoveryPolicy: policy };
    }

    if (policy.recoveryClass === 'EXACT_COMMENT_ID_SINGLE_CHARACTER_SUBSTITUTION_ONLY') {
      if (
        !Number.isInteger(policy.substitutionIndex) ||
        policy.substitutionIndex < 0 ||
        policy.substitutionIndex >= p.base64.length ||
        typeof policy.observedCharacter !== 'string' ||
        policy.observedCharacter.length !== 1 ||
        typeof policy.correctedCharacter !== 'string' ||
        policy.correctedCharacter.length !== 1 ||
        p.base64[policy.substitutionIndex] !== policy.observedCharacter
      ) {
        bad('CHUNK_RECOVERY_SUBSTITUTION_IDENTITY', k.commentId);
      }
      const corrected =
        p.base64.slice(0, policy.substitutionIndex) +
        policy.correctedCharacter +
        p.base64.slice(policy.substitutionIndex + 1);
      if (
        policy.correctedBase64Length !== k.length ||
        policy.correctedBase64Sha256 !== k.sha256 ||
        corrected.length !== k.length ||
        sha(Buffer.from(corrected)) !== k.sha256
      ) {
        bad('CHUNK_RECOVERY_SUBSTITUTION_RESULT', k.commentId);
      }
      return { base64: corrected, trailing: null, recoveryPolicy: policy };
    }

    bad('CHUNK_RECOVERY_CLASS', policy.recoveryClass);
  }

  if (p.base64.length !== k.length || sha(Buffer.from(p.base64)) !== k.sha256) {
    bad('CHUNK_INVALID', k.commentId);
  }
  return { base64: p.base64, trailing: null, recoveryPolicy: null };
}

function source(c) {
  if (process.env.METHODS_SOURCE_ZIP_PATH) {
    return fs.readFileSync(process.env.METHODS_SOURCE_ZIP_PATH);
  }
  if (!process.env.GITHUB_TOKEN && !process.env.GH_TOKEN) bad('TOKEN_MISSING');

  const records = [];
  for (const k of [...c.transport.chunks].sort((a, b) => a.chunkIndex - b.chunkIndex)) {
    const q = JSON.parse(ex('gh', [
      'api',
      `repos/${c.transport.repository}/issues/comments/${k.commentId}`
    ]).stdout);
    if (q.id !== k.commentId) bad('COMMENT_ID', k.commentId);
    records.push({ k, ...chunk(q.body, k, c) });
  }

  let s = '';
  for (const r of records) {
    if (
      r.recoveryPolicy?.recoveryClass ===
      'EXACT_COMMENT_ID_PREFIX_AND_NEXT_CHUNK_CROSSCHECK_ONLY'
    ) {
      const p = r.recoveryPolicy;
      const n = records.find(x => x.k.chunkIndex === p.trailingMustEqualChunkIndex);
      if (
        !n ||
        r.trailing !== n.base64.slice(0, p.trailingMustEqualPrefixLength)
      ) {
        bad('CHUNK_RECOVERY_CROSSCHECK', r.k.commentId);
      }
    }
    s += r.base64;
  }
  if (s.length !== c.exactZip.base64Length) bad('BASE64_LENGTH');
  return Buffer.from(s, 'base64');
}

function carrier() {
  const c = j(K);
  if (
    c.schema !== 'METHODS_AND_MODELS_ADOPTION_REVIEW_SOURCE_PACKAGE_CARRIER_v1' ||
    c.packageFingerprintSha256 !== F ||
    c.sourceAuditHead !== A ||
    c.transport.repository !== 'smansfield635-create/smansfield635-create.github.io' ||
    c.transport.issueNumber !== 586
  ) {
    bad('CARRIER_IDENTITY');
  }
  const z = source(c);
  if (z.length !== c.exactZip.size || sha(z) !== c.exactZip.sha256) bad('ZIP_HASH');
  const zp = path.join(os.tmpdir(), `m-${crypto.randomUUID()}.zip`);
  fs.writeFileSync(zp, z);
  const ls = ex('unzip', ['-Z1', zp]).stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .sort();
  eq(ls, [...c.expectedZipMembers].sort(), 'ZIP_MEMBERS');
  const d = new Map();
  for (const n of c.expectedZipMembers) {
    const r = spawnSync('unzip', ['-p', zp, n], { encoding: null });
    if (r.error || r.status !== 0) bad('ZIP_EXTRACT', n);
    d.set(n, Buffer.from(r.stdout));
  }
  fs.rmSync(zp, { force: true });
  const m = JSON.parse(d.get('review-package.v1.json'));
  if (m.packageFingerprintSha256 !== F) bad('MANIFEST_FINGERPRINT');
  for (const x of m.files) {
    const b = d.get(x.path);
    if (!b || b.length !== x.size || sha(b) !== x.sha256) bad('MANIFEST_FILE', x.path);
  }
  const ar = JSON.parse(d.get('adoption-register.v1.json'));
  const pt = JSON.parse(d.get('page-translation-model.v1.json'));
  const rm = JSON.parse(d.get('rolodex-information-map.v1.json'));
  const rs = JSON.parse(d.get('review-summary.v1.json'));
  const r = shac({
    auditSourceHead: ar.sourceBinding.auditFinalHead,
    adoptionRegister: ar,
    pageTranslationModel: pt,
    rolodexInformationMap: rm,
    stoppingBoundary: rs.stoppingBoundary
  });
  if (r !== F) bad('PACKAGE_FINGERPRINT', r);
  return { c, d, r };
}

function project() {
  return {
    projectId: 'METHODS_INFORMATION_BENCHMARK',
    status: 'ACTIVE_REGISTERED_PROJECT',
    ownedPathPrefixes: [],
    ownedExactPaths: P,
    entrypoint: E,
    priority: 100
  };
}

function route(p, id, block = false) {
  const q = path.join(os.tmpdir(), `r-${crypto.randomUUID()}.json`);
  const r = ex(process.execPath, [
    'tools/repository-ai-entry-router.mjs',
    '--mutation-intent',
    '--path', p,
    '--task', 'Methods bounded route certification',
    '--output', q
  ], true);
  const x = j(q);
  fs.rmSync(q, { force: true });
  if (block) {
    if (r.status === 0 || x.disposition !== 'BLOCK') bad('NEGATIVE_ROUTE', p);
  } else {
    const y = x.routes?.find(z => z.path === p);
    if (r.status !== 0 || x.disposition !== 'PASS' || y?.projectId !== id) bad('ROUTE', p);
  }
}

function reg(a, c) {
  if (a['base-head'] !== B) bad('BASE_HEAD');
  eq(diff(a['base-head'], a['candidate-head']), RP, 'REG_PATHS');
  const br = sj(a['base-head'], R);
  const cr = j(R);
  const er = structuredClone(br);
  er.routerInfrastructure.ownedExactPaths.push(W);
  er.projects.push(project());
  eq(cr, er, 'ROUTER_DELTA');
  const e = j(E);
  eq(e.ownedPathPrefixes, [], 'PREFIX');
  eq(e.ownedExactPaths, P, 'ENTRY_PATHS');
  const x = j(C);
  if (x.governingHead !== B || x.admission.lockGeneration !== 64) bad('CONTRACT_ID');
  eq(x.registration.ownedPathPrefixes, [], 'CONTRACT_PREFIX');
  eq(x.registration.ownedExactPaths, P, 'CONTRACT_PATHS');
  for (const p of P) route(p, 'METHODS_INFORMATION_BENCHMARK');
  route(W, 'REPOSITORY_AI_ROUTER_INFRASTRUCTURE');
  for (const p of [
    'control-plane/methods-information-benchmark/adoption-and-page-translation-v1/unauthorized.json',
    '.github/workflows/methods-information-benchmark-unregistered.yml',
    'laws/research/methods-and-models/index.html'
  ]) {
    route(p, null, true);
  }
  for (const p of [...P, W]) {
    if (has(a['candidate-head'], p)) bad('DOWNSTREAM_EARLY', p);
  }
  return {
    result: 'PASS_REGISTRATION_EXACT_ROUTE_NO_PREFIX',
    verifiedPathCount: 5,
    methodsExactRouteCount: 8,
    methodsPrefixCount: 0,
    negativeRouteCount: 3,
    candidateBlobMap: bm(a['candidate-head'], RP),
    fingerprint: shac({
      mode: 'registration',
      baseHead: a['base-head'],
      candidateHead: a['candidate-head'],
      router: cr,
      entrypoint: e,
      packageFingerprint: c.r,
      registrationLockGeneration: 64
    })
  };
}

function core(d) {
  const c = j(K);
  for (const [s, t] of Object.entries(c.destinationMap)) {
    const b = d.get(s);
    if (!b || !fs.readFileSync(t).equals(b)) bad('BYTE_MISMATCH', t);
  }
}

function pack(a, c, fin) {
  const ps = fin ? FP : IP;
  eq(diff(a['base-head'], a['candidate-head']), ps, fin ? 'FINAL_PATHS' : 'PACKAGE_PATHS');
  const r = sj(a['base-head'], R);
  const m = r.projects.find(x => x.projectId === 'METHODS_INFORMATION_BENCHMARK');
  if (!m || m.status !== 'ACTIVE_REGISTERED_PROJECT') bad('ROUTE_MISSING');
  eq(m.ownedPathPrefixes, [], 'ACTIVE_PREFIX');
  eq(m.ownedExactPaths, P, 'ACTIVE_PATHS');
  if (!r.routerInfrastructure.ownedExactPaths.includes(W)) bad('WORKFLOW_ROUTE');
  core(c.d);
  const wt = fs.readFileSync(W, 'utf8');
  const gt = fs.readFileSync(P[0], 'utf8');
  for (const t of [F, '58', '64', O]) {
    if (!wt.includes(t) || !gt.includes(t)) bad('WORKFLOW_BIND', t);
  }
  const ad = j(P[1]);
  if (
    ad.entries?.length !== 27 ||
    ad.counts?.total !== 27 ||
    ad.sourceBinding?.role6State !== 'INACTIVE' ||
    ad.sourceBinding?.role6Reopened !== false
  ) {
    bad('ADOPTION_BOUNDARY');
  }
  const payload = {
    sourcePackageFingerprint: F,
    sourceAuditHead: A,
    destinationBlobMap: bm(
      a['candidate-head'],
      ps.filter(p => p !== P[5] && p !== P[6])
    ),
    destinationSha256: Object.fromEntries(
      ps.filter(p => fs.existsSync(p)).map(p => [p, sha(fs.readFileSync(p))])
    )
  };
  const rf = shac(payload);
  if (!fin) {
    if (has(a['candidate-head'], P[5]) || has(a['candidate-head'], P[6])) {
      bad('RECEIPT_EARLY');
    }
    return {
      result: 'PASS_MATERIALIZATION_CORE_BYTES_EXACT',
      verifiedPathCount: ps.length,
      repositoryFingerprint: rf,
      sourcePackageFingerprint: F,
      candidateBlobMap: bm(a['candidate-head'], ps)
    };
  }
  const i = j(P[5]);
  const cl = j(P[6]);
  const cc = cl.canonicalGeneration58ClosureReceipt;
  if (
    i.schema !== 'METHODS_AND_MODELS_ADOPTION_REVIEW_VERIFICATION_RECEIPT_v1' ||
    i.result !== 'PASS_INDEPENDENT_REPOSITORY_REPRODUCTION' ||
    i.sourcePackageFingerprintSha256 !== F ||
    i.repositoryFingerprintSha256 !== rf ||
    !i.distinctExecutionHolders ||
    i.verifierRepairPerformed !== false
  ) {
    bad('INDEPENDENT_RECEIPT');
  }
  if (
    cl.schema !== 'METHODS_AND_MODELS_ADOPTION_REVIEW_OPERATION_CLOSURE_RECEIPT_v1' ||
    cl.result !== 'PASS_CLOSED' ||
    cc?.result !== 'TERMINAL_CLOSURE_COMMITTED' ||
    cc?.lockGeneration !== 58 ||
    cc?.terminalDisposition !== 'PASS_CLOSED' ||
    cc?.operationId !== G58
  ) {
    bad('CLOSURE_RECEIPT');
  }
  return {
    result: 'PASS_FINAL_REPOSITORY_PACKAGE_AND_GENERATION58_CLOSURE',
    verifiedPathCount: ps.length,
    repositoryFingerprint: rf,
    sourcePackageFingerprint: F,
    candidateBlobMap: bm(a['candidate-head'], ps),
    generation58Closed: true
  };
}

let a;
try {
  a = args(process.argv.slice(2));
  const h = git(['rev-parse', 'HEAD^{commit}']).stdout.trim();
  if (h !== a['candidate-head']) bad('HEAD_MISMATCH');
  if (git(['status', '--porcelain=v1', '--untracked-files=all']).stdout.trim()) {
    bad('WORKTREE');
  }
  const c = carrier();
  const d = a.mode === 'registration'
    ? reg(a, c)
    : pack(a, c, a.mode === 'final');
  const r = st({
    schema: 'METHODS_INFORMATION_BENCHMARK_ROUTER_AND_PACKAGE_VERIFICATION_RECEIPT_v1',
    operationId: O,
    mode: a.mode,
    result: d.result,
    holder: a.holder,
    baseHead: a['base-head'],
    candidateHead: a['candidate-head'],
    sourceAuditHead: A,
    sourcePackageFingerprintSha256: F,
    role6State: 'INACTIVE',
    reviewRepeated: false,
    packageRegenerated: false,
    verifierRepairPerformed: false,
    ...d
  });
  fs.mkdirSync(path.dirname(path.resolve(a.output)), { recursive: true });
  fs.writeFileSync(path.resolve(a.output), txt(r));
} catch (e) {
  const r = st({
    schema: 'METHODS_INFORMATION_BENCHMARK_ROUTER_AND_PACKAGE_VERIFICATION_FAILURE_v1',
    operationId: O,
    mode: a?.mode ?? null,
    result: 'FAIL_CLOSED',
    errorCode: e.code ?? 'UNEXPECTED_ERROR',
    detail: e.detail ?? e.message,
    holder: a?.holder ?? null,
    verifierRepairPerformed: false
  });
  if (a?.output) {
    fs.mkdirSync(path.dirname(path.resolve(a.output)), { recursive: true });
    fs.writeFileSync(path.resolve(a.output), txt(r));
  } else {
    process.stderr.write(txt(r));
  }
  process.exitCode = 1;
}
