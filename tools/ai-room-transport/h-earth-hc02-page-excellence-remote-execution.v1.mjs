#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const GATE_PATH = '.github/ai-router/page-excellence-toolchain/page-operation-entry-gate.v1.mjs';
const GATE_BLOB = '40330849ac94f701199bc41489b44fd6c9d69e96';
const TOOLSET_PATH = '.github/ai-router/page-excellence-toolchain/toolset.bundle.v1.json';
const TOOLSET_ID = 'MANDATORY_PAGE_TOOLSET';
const TOOLSET_VERSION = '1.1.0';
const PHASE = 'ARCHITECTURE';
const TASK = 'H_EARTH_HC02_VIEWPORT_AUTHORITY_UNBOXING';
const PAGE_PATHS = [
  'showroom/globe/h-earth/index.html',
  'showroom/globe/h-earth/index.css'
];
const HEX40 = /^[0-9a-f]{40}$/;
const HOLDER = /^[A-Z0-9][A-Z0-9_.:-]{2,127}$/;

const stable = value =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
      : value;

export function jsonText(value) { return `${JSON.stringify(stable(value), null, 2)}\n`; }

function fail(code, detail = null) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
}

function parseArgs(argv) {
  const result = { selfTest: false, output: null, subjectHead: null, receiptBundleBase64: null, executionHolder: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--self-test') result.selfTest = true;
    else if (token === '--output') result.output = argv[++i] ?? null;
    else if (token === '--subject-head') result.subjectHead = argv[++i] ?? null;
    else if (token === '--receipt-bundle-base64') result.receiptBundleBase64 = argv[++i] ?? null;
    else if (token === '--execution-holder') result.executionHolder = argv[++i] ?? null;
    else fail('UNKNOWN_ARGUMENT', token);
  }
  if (!result.output) fail('OUTPUT_REQUIRED');
  if (result.selfTest) {
    if (result.subjectHead || result.receiptBundleBase64 || result.executionHolder) fail('SELF_TEST_ARGUMENT_SURFACE_NOT_CLOSED');
  } else {
    if (!HEX40.test(result.subjectHead ?? '')) fail('SUBJECT_HEAD_INVALID');
    if (!result.receiptBundleBase64) fail('RECEIPT_BUNDLE_BASE64_REQUIRED');
    if (!HOLDER.test(result.executionHolder ?? '')) fail('EXECUTION_HOLDER_INVALID');
  }
  return result;
}

function discoverRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, 'AI_ENTRYPOINT.json'))) return current;
    const parent = path.dirname(current);
    if (parent === current) fail('REPOSITORY_ROOT_NOT_FOUND');
    current = parent;
  }
}

function gitBlobSha(bytes) {
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
}

function sha256(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }

function run(command, args, cwd, env = process.env, allowFailure = false) {
  const child = spawnSync(command, args, { cwd, env, shell: false, encoding: 'utf8' });
  if (child.error) {
    if (allowFailure) return { status: 1, stdout: '', stderr: child.error.message };
    fail('PROCESS_EXECUTION_FAILED', { command, message: child.error.message });
  }
  if (!allowFailure && child.status !== 0) fail('PROCESS_NONZERO', { command, args, status: child.status, stdout: child.stdout, stderr: child.stderr });
  return { status: child.status ?? 1, stdout: child.stdout ?? '', stderr: child.stderr ?? '' };
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true }); fs.writeFileSync(path.resolve(file), jsonText(value)); }
function gitHead(root) { return run('git', ['rev-parse', 'HEAD^{commit}'], root).stdout.trim(); }
function gitStatus(root) { return run('git', ['status', '--porcelain=v1', '--untracked-files=all'], root).stdout.trim(); }

export function verifyBoundToolset(root) {
  const gateBytes = fs.readFileSync(path.join(root, GATE_PATH));
  const gateBlob = gitBlobSha(gateBytes);
  if (gateBlob !== GATE_BLOB) fail('PAGE_EXCELLENCE_GATE_BLOB_MISMATCH', { expected: GATE_BLOB, actual: gateBlob });
  const toolset = readJson(path.join(root, TOOLSET_PATH));
  if (toolset?.locator?.toolsetId !== TOOLSET_ID || toolset?.locator?.version !== TOOLSET_VERSION) fail('PAGE_EXCELLENCE_TOOLSET_VERSION_MISMATCH');
  if (toolset?.status !== 'ACTIVE_VERSION_BOUND' || toolset?.locator?.status !== 'ACTIVE_VERSION_BOUND') fail('PAGE_EXCELLENCE_TOOLSET_NOT_ACTIVE');
  return toolset;
}

function collectInstrumentVersions(value) {
  const candidates = [];
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      if (node.length > 0 && node.every(item => item && typeof item === 'object' && typeof item.id === 'string' && typeof item.version === 'string') && node.some(item => item.id === 'contextualArchitectureConformanceInstrument')) candidates.push(node);
      for (const item of node) visit(item);
      return;
    }
    for (const child of Object.values(node)) visit(child);
  };
  visit(value);
  if (candidates.length !== 1) fail('INSTRUMENT_REGISTRY_NOT_UNIQUE', candidates.length);
  return Object.fromEntries(candidates[0].map(item => [item.id, item.version]));
}

function fixtureFindings(subjectHead) {
  return {
    schema: 'CONTEXTUAL_ARCHITECTURE_FINDINGS_v1',
    implementationClass: 'EXISTING_CONSTRUCT_ADOPTION',
    classificationRationale: 'Self-test only: prove the H-Earth HC02 remote binding can execute the exact ratified architecture gate without product mutation.',
    existingConstructSearch: { executed: true, searchedScopes: ['showroom/globe/h-earth/', 'h-earth-3d/'], candidates: ['H_EARTH_LIVE_RUN8E', 'H_EARTH_PRESENTATION_HOST'] },
    exactSourceConstructIdentities: [
      { sourceId: 'H_EARTH_LIVE_RUN8E', path: 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js', commitSha: subjectHead, gitBlobSha: '1'.repeat(40), adoptionDisposition: 'ADOPT_IMPLEMENTATION_SOURCE' },
      { sourceId: 'H_EARTH_PRESENTATION_HOST', path: 'showroom/globe/h-earth/index.html', commitSha: subjectHead, gitBlobSha: '2'.repeat(40), adoptionDisposition: 'ADOPT_IMPLEMENTATION_SOURCE' }
    ],
    adoptionMatrix: [
      { sourceId: 'H_EARTH_LIVE_RUN8E', sourceRelation: 'IMPLEMENTATION_SOURCE', adoptedCapabilities: ['CAMERA', 'TRAVERSAL', 'ACTIVE_RENDERER_RUNTIME_CHAIN'], adaptations: [], exclusions: ['RUNTIME_REBUILD', 'TERRAIN_REDESIGN'] },
      { sourceId: 'H_EARTH_PRESENTATION_HOST', sourceRelation: 'IMPLEMENTATION_SOURCE', adoptedCapabilities: ['PRESENTATION_HOST', 'VIEWPORT_MOUNT'], adaptations: ['VIEWPORT_AUTHORITY', 'SHELL_RECESSION'], exclusions: ['PRODUCT_BEHAVIOR_CHANGE'] }
    ],
    visualArchitectureAuthority: { authorityHolder: 'EXISTING_SOURCE_CONSTRUCTS_WITH_BOUNDED_ADAPTER', contentAdapterMayDefineVisualArchitecture: false },
    prohibitedSubstituteArchitectures: ['RUNTIME_REBUILD', 'RENDERER_REPLACEMENT', 'CAMERA_OR_NAVIGATION_REDESIGN'],
    requiredRuntimeConditions: ['REAL_3D_ENVIRONMENT', 'PRIMARY_DIRECT_MANIPULATION', 'PRESERVE_ACTIVE_RUN8E_RUNTIME'],
    separateNewConstructAuthority: null
  };
}

export function makeFixtureBundle(root, toolset, subjectHead) {
  const instrumentVersions = collectInstrumentVersions(toolset);
  return {
    schema: 'MANDATORY_PAGE_PHASE_RECEIPT_BUNDLE_v1',
    toolsetId: TOOLSET_ID,
    toolsetVersion: TOOLSET_VERSION,
    subjectHead,
    phaseReceipts: [{ phase: PHASE, result: 'PASS', instrumentVersions, receiptDigest: sha256(Buffer.from(`H_EARTH_HC02_BINDING_SELF_TEST:${subjectHead}`)), findings: fixtureFindings(subjectHead) }]
  };
}

function decodeReceiptBundle(encoded) {
  let bytes;
  try { bytes = Buffer.from(encoded, 'base64'); } catch (error) { fail('RECEIPT_BUNDLE_BASE64_INVALID', error.message); }
  if (!bytes.length) fail('RECEIPT_BUNDLE_BASE64_EMPTY');
  let value;
  try { value = JSON.parse(bytes.toString('utf8')); } catch (error) { fail('RECEIPT_BUNDLE_JSON_INVALID', error.message); }
  if (value?.schema !== 'MANDATORY_PAGE_PHASE_RECEIPT_BUNDLE_v1') fail('RECEIPT_BUNDLE_SCHEMA_INVALID');
  return { bytes, value };
}

function executePageExcellence(root, subjectHead, bundleBytes, executionHolder) {
  const before = gitStatus(root);
  if (before !== '') fail('WORKTREE_NOT_CLEAN_BEFORE_EXECUTION', before);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'h-earth-hc02-page-excellence-'));
  const bundlePath = path.join(tmp, 'architecture-receipt-bundle.json');
  const routerReceiptPath = path.join(tmp, 'router-receipt.json');
  fs.writeFileSync(bundlePath, bundleBytes);
  const args = [path.join(root, GATE_PATH), '--mutation-intent', '--path', PAGE_PATHS[0], '--path', PAGE_PATHS[1], '--task', TASK, '--page-phase', PHASE, '--page-receipt-bundle', bundlePath, '--output', routerReceiptPath];
  const child = run(process.execPath, args, root, { ...process.env, PAGE_OPERATION_SUBJECT_HEAD: subjectHead }, true);
  let gateReceipt = null;
  try { gateReceipt = child.stdout ? JSON.parse(child.stdout) : null; } catch {}
  const routerReceipt = fs.existsSync(routerReceiptPath) ? readJson(routerReceiptPath) : null;
  const after = gitStatus(root);
  const pass = child.status === 0 && gateReceipt?.schema === 'MANDATORY_PAGE_OPERATION_GATE_RECEIPT_v2' && gateReceipt?.result === 'PASS' && gateReceipt?.toolsetId === TOOLSET_ID && gateReceipt?.toolsetVersion === TOOLSET_VERSION && gateReceipt?.pageOperation === true && gateReceipt?.phase === PHASE && gateReceipt?.mandatoryReceipt?.contextualArchitecture?.implementationClass === 'EXISTING_CONSTRUCT_ADOPTION' && routerReceipt?.schema === 'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v1' && routerReceipt?.disposition === 'PASS' && Array.isArray(routerReceipt?.routes) && routerReceipt.routes.length === PAGE_PATHS.length && routerReceipt.routes.every(route => route.projectId === 'H_EARTH' && route.disposition === 'PASS') && before === '' && after === '';
  const receipt = { schema: 'H_EARTH_HC02_PAGE_EXCELLENCE_REMOTE_EXECUTION_RECEIPT_v1', result: pass ? 'PASS' : 'FAIL', executionHolder, subjectHead, exactGatePath: GATE_PATH, exactGateBlob: GATE_BLOB, toolsetId: TOOLSET_ID, toolsetVersion: TOOLSET_VERSION, pagePhase: PHASE, pagePaths: PAGE_PATHS, task: TASK, bundleSha256: sha256(bundleBytes), gateExitCode: child.status, gateReceipt, routerReceipt, repositoryCleanBefore: before === '', repositoryCleanAfter: after === '', productMutationPerformed: false, hc02AdmissionPerformed: false, unboxingPerformed: false, genericCommandAuthority: false, runtimeOrRendererMutationPerformed: false };
  if (!pass) receipt.failureDetail = { stderr: child.stderr, stdout: child.stdout };
  return receipt;
}

function runSelfTest(root, toolset) {
  const head = gitHead(root);
  const native = run(process.execPath, [path.join(root, GATE_PATH), '--self-test'], root, process.env, true);
  let nativeReceipt = null;
  try { nativeReceipt = native.stdout ? JSON.parse(native.stdout) : null; } catch {}
  if (native.status !== 0 || nativeReceipt?.result !== 'PASS') fail('RATIFIED_PAGE_EXCELLENCE_SELF_TEST_FAILED', { status: native.status, stdout: native.stdout, stderr: native.stderr });
  const fixture = makeFixtureBundle(root, toolset, head);
  const execution = executePageExcellence(root, head, Buffer.from(jsonText(fixture)), 'HC02_PAGE_EXCELLENCE_BINDING_SELF_TEST');
  if (execution.result !== 'PASS') fail('REMOTE_BINDING_SELF_TEST_FAILED', execution);
  return { ...execution, schema: 'H_EARTH_HC02_PAGE_EXCELLENCE_REMOTE_EXECUTION_SELF_TEST_RECEIPT_v1', nativePageExcellenceSelfTestResult: nativeReceipt.result };
}

function failureReceipt(error, args) {
  return { schema: args?.selfTest ? 'H_EARTH_HC02_PAGE_EXCELLENCE_REMOTE_EXECUTION_SELF_TEST_RECEIPT_v1' : 'H_EARTH_HC02_PAGE_EXCELLENCE_REMOTE_EXECUTION_RECEIPT_v1', result: 'FAIL', executionHolder: args?.executionHolder ?? 'UNKNOWN', errorCode: error?.code ?? 'UNEXPECTED_FAILURE', detail: error?.detail ?? error?.message ?? String(error), productMutationPerformed: false, hc02AdmissionPerformed: false, unboxingPerformed: false, genericCommandAuthority: false, runtimeOrRendererMutationPerformed: false };
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  let parsed = null;
  try {
    parsed = parseArgs(process.argv.slice(2));
    const root = discoverRoot(path.dirname(fileURLToPath(import.meta.url)));
    const toolset = verifyBoundToolset(root);
    const receipt = parsed.selfTest ? runSelfTest(root, toolset) : executePageExcellence(root, parsed.subjectHead, decodeReceiptBundle(parsed.receiptBundleBase64).bytes, parsed.executionHolder);
    writeJson(parsed.output, receipt);
    process.stdout.write(jsonText(receipt));
    process.exit(receipt.result === 'PASS' ? 0 : 1);
  } catch (error) {
    const receipt = failureReceipt(error, parsed);
    if (parsed?.output) writeJson(parsed.output, receipt);
    process.stderr.write(jsonText(receipt));
    process.exit(1);
  }
}
