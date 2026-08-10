#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stable, hashObject, validateRequest, validateAndResolve, makePageArchitectureBundle, executeResolved } from './carrier.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const SELF_TEST_REPO_PATH = '.github/ai-router/bounded-exact-head-execution-carrier/self-test.v1.mjs';
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, '.github/ai-router/bounded-exact-head-execution-carrier/registry.v1.json'), 'utf8'));
const toolset = JSON.parse(fs.readFileSync(path.join(ROOT, '.github/ai-router/page-excellence-toolchain/toolset.bundle.v1.json'), 'utf8'));
const REFERENCE_DESCRIPTOR_ID = 'REFERENCE_CLASS_AWARDS_ADMISSION_GEN890_VERIFY_V1';
const REFERENCE_TARGET_HEAD = '0edef35b14af36e6ddaba88fbe07a53c2471fad5';
const REFERENCE_VERIFIER_BLOB = '3e9584555cc951cc43d245538b512996fd07664f';
const REFERENCE_OPERATION_ID = 'REFERENCE_CLASS_AWARDS_ADMISSION_INSTRUMENT_PREACTIVATION_V1_20260809_001';
const REFERENCE_OPERATION_PATH = '.github/ai-router/reference-class-awards-admission/operation-request.v1.json';
const REFERENCE_PROCEDURE_PATH = '.github/ai-router/reference-class-awards-admission/construction-procedure.v1.json';
const REFERENCE_STATE_PATH = '.github/ai-router/reference-class-awards-admission/current-state.v1.json';

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function nonce(char = 'a') { return char.repeat(64); }
function git(args, cwd = ROOT) { return cp.execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim(); }
function executionHead() { return git(['rev-parse', 'HEAD^{commit}']); }
function assertClean(cwd) {
  const status = git(['status', '--porcelain=v1', '--untracked-files=all'], cwd);
  if (status !== '') throw new Error(`WORKTREE_NOT_CLEAN:${status}`);
}
function ensureCommit(commit) {
  try { cp.execFileSync('git', ['cat-file', '-e', `${commit}^{commit}`], { cwd: ROOT, stdio: 'ignore' }); }
  catch { cp.execFileSync('git', ['fetch', '--no-tags', 'origin', commit], { cwd: ROOT, stdio: ['ignore','pipe','pipe'], maxBuffer: 32 * 1024 * 1024 }); }
}
function gitJsonAt(commit, repoPath) {
  ensureCommit(commit);
  return JSON.parse(git(['show', `${commit}:${repoPath}`]));
}
function pullRequestHeadFromEvent() {
  if (process.env.CARRIER_EXACT_HEAD_REEXEC === '1' || process.env.GITHUB_EVENT_NAME !== 'pull_request' || !process.env.GITHUB_EVENT_PATH) return null;
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const head = event?.pull_request?.head?.sha ?? null;
  if (head == null) return null;
  if (!/^[0-9a-f]{40}$/.test(head)) throw new Error(`PR_HEAD_INVALID:${head}`);
  return head;
}
function runExactHeadReexecution(head) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'bounded-carrier-exact-head-self-test-'));
  const worktree = path.join(tempRoot, 'worktree');
  const output = path.join(tempRoot, 'self-test.json');
  let added = false;
  try {
    cp.execFileSync('git', ['cat-file', '-e', `${head}^{commit}`], { cwd: ROOT, stdio: 'ignore' });
    cp.execFileSync('git', ['worktree', 'add', '--detach', worktree, head], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 });
    added = true;
    const observedHead = git(['rev-parse', 'HEAD^{commit}'], worktree);
    if (observedHead !== head) throw new Error(`EXACT_HEAD_CHECKOUT_MISMATCH:${head}:${observedHead}`);
    assertClean(worktree);
    cp.execFileSync(process.execPath, [SELF_TEST_REPO_PATH, '--output', output], {
      cwd: worktree,
      env: { ...process.env, CARRIER_EXACT_HEAD_REEXEC: '1' },
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 32 * 1024 * 1024
    });
    assertClean(worktree);
    const receipt = JSON.parse(fs.readFileSync(output, 'utf8'));
    if (receipt.result !== 'PASS' || receipt.executionHead !== head || receipt.passed !== receipt.total || receipt.nativeRegressionPassCount !== receipt.nativeRegressionCount) throw new Error('EXACT_HEAD_SELF_TEST_NONPASS');
    return stable({
      result: 'PASS',
      requestedHead: head,
      observedHead,
      selfTestResult: receipt.result,
      fixturePassCount: receipt.passed,
      fixtureCount: receipt.total,
      nativeRegressionPassCount: receipt.nativeRegressionPassCount,
      nativeRegressionCount: receipt.nativeRegressionCount,
      workingTreeCleanBeforeAndAfter: true
    });
  } finally {
    if (added) {
      try { cp.execFileSync('git', ['worktree', 'remove', '--force', worktree], { cwd: ROOT, stdio: 'ignore' }); } catch {}
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
function finalizeFixture(operationRequest, constructionProcedure, admissionReceipt, generation, scopeHash) {
  const requestDigest = hashObject(operationRequest);
  const procedureDigest = hashObject(constructionProcedure);
  admissionReceipt.requestDigest = requestDigest;
  admissionReceipt.procedureLocatorDigest = procedureDigest;
  const ledger = { activeScopes: { [scopeHash]: {
    operationId: operationRequest.operationId,
    lockGeneration: generation,
    lockScope: operationRequest.lockScope,
    state: 'ADMITTED_LOCKED',
    released: false,
    requestDigest,
    procedureLocatorDigest: procedureDigest
  } } };
  return { requestDigest, procedureDigest, ledger };
}
function baseFixture() {
  const operationRequest = {
    schema: 'REPOSITORY_OPERATION_REQUEST_v1',
    operationId: 'SYNTHETIC_CARRIER_TEST_OPERATION',
    projectId: 'LAWS',
    lockScope: 'SYNTHETIC:SCOPE',
    exactGoverningHead: '1'.repeat(40),
    subjectIdentity: { requiredStartingHead: '2'.repeat(40), experimentId: 'synthetic_experiment_v1' },
    allowedPaths: ['laws/example/a.js', 'laws/example/b.json']
  };
  const constructionProcedure = {
    schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
    procedureId: 'SYNTHETIC_CARRIER_TEST_PROCEDURE',
    exactGoverningHead: operationRequest.exactGoverningHead,
    exactAllowedRepositoryPaths: [...operationRequest.allowedPaths]
  };
  const admissionReceipt = {
    schema: 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',
    result: 'ADMITTED_AND_LOCKED',
    operationId: operationRequest.operationId,
    projectId: operationRequest.projectId,
    operationStarted: true,
    workflowExecutionAuthorized: true,
    requestDigest: '0'.repeat(64),
    procedureLocatorDigest: '0'.repeat(64),
    lock: {
      lockAcquired: true,
      lockGeneration: 999,
      lockScope: operationRequest.lockScope,
      operationId: operationRequest.operationId,
      scopeHash: '3'.repeat(64)
    }
  };
  const { ledger } = finalizeFixture(operationRequest, constructionProcedure, admissionReceipt, 999, '3'.repeat(64));
  const request = {
    schema: 'BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1',
    requestId: 'SYNTHETIC_POSITIVE',
    descriptorId: 'REPOSITORY_AI_ENTRY_ROUTER_MUTATION_V1',
    operationRequest,
    constructionProcedure,
    admissionReceipt,
    requestNonce: nonce('a')
  };
  return { request, ledger };
}
function pageFixture() {
  const descriptor = registry.descriptors.find(item => item.descriptorId === 'LAWS_PHI1_GEN857_PAGE_EXCELLENCE_ARCHITECTURE_V1');
  if (!descriptor) throw new Error('page descriptor missing');
  const identities = descriptor.architectureFindings.exactSourceConstructIdentities;
  const grouped = new Map();
  for (const item of identities) {
    if (!grouped.has(item.commitSha)) grouped.set(item.commitSha, []);
    grouped.get(item.commitSha).push({ path: item.path, gitBlobSha: item.gitBlobSha });
  }
  const existingConstructSearchSources = [...grouped.entries()].map(([commitSha, files], index) => ({ sourceId: `DECLARED_SOURCE_${index + 1}`, commitSha, files }));
  const allowedPaths = [
    'laws/control-plane/contextual-topology/laws-first-bounded-spatial-manifestation-experiment-v1/index.html',
    'laws/control-plane/contextual-topology/laws-first-bounded-spatial-manifestation-experiment-v1/index.css',
    'laws/control-plane/contextual-topology/laws-first-bounded-spatial-manifestation-experiment-v1/index.js',
    'laws/control-plane/contextual-topology/laws-first-bounded-spatial-manifestation-experiment-v1/specimen-manifest.v1.json',
    'laws/control-plane/contextual-topology/laws-first-bounded-spatial-manifestation-experiment-v1/verify.v1.mjs'
  ];
  const operationRequest = {
    schema: 'REPOSITORY_OPERATION_REQUEST_v1',
    operationId: descriptor.boundOperationId,
    projectId: descriptor.projectId,
    lockScope: 'SYNTHETIC:PAGE:ARCHITECTURE',
    exactGoverningHead: '1'.repeat(40),
    subjectIdentity: {
      requiredStartingHead: descriptor.boundTargetHead,
      experimentId: 'LAWS_FIRST_BOUNDED_SPATIAL_MANIFESTATION_EXPERIMENT_v1',
      existingConstructSearchSources
    },
    allowedPaths
  };
  const constructionProcedure = {
    schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
    procedureId: 'SYNTHETIC_PAGE_ARCHITECTURE_PROCEDURE',
    exactGoverningHead: operationRequest.exactGoverningHead,
    exactAllowedRepositoryPaths: [...allowedPaths]
  };
  const scopeHash = '7'.repeat(64);
  const admissionReceipt = {
    schema: 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',
    result: 'ADMITTED_AND_LOCKED',
    operationId: operationRequest.operationId,
    projectId: operationRequest.projectId,
    operationStarted: true,
    workflowExecutionAuthorized: true,
    requestDigest: '0'.repeat(64),
    procedureLocatorDigest: '0'.repeat(64),
    lock: {
      lockAcquired: true,
      lockGeneration: descriptor.boundLockGeneration,
      lockScope: operationRequest.lockScope,
      operationId: operationRequest.operationId,
      scopeHash
    }
  };
  const { ledger } = finalizeFixture(operationRequest, constructionProcedure, admissionReceipt, descriptor.boundLockGeneration, scopeHash);
  const request = {
    schema: 'BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1',
    requestId: 'SYNTHETIC_PAGE_POSITIVE',
    descriptorId: descriptor.descriptorId,
    operationRequest,
    constructionProcedure,
    admissionReceipt,
    requestNonce: nonce('b')
  };
  return { request, ledger };
}
function referenceFixture() {
  const descriptor = registry.descriptors.find(item => item.descriptorId === REFERENCE_DESCRIPTOR_ID);
  if (!descriptor) throw new Error('reference-class descriptor missing');
  if (descriptor.boundTargetHead !== REFERENCE_TARGET_HEAD || descriptor.scriptBlob !== REFERENCE_VERIFIER_BLOB || descriptor.boundOperationId !== REFERENCE_OPERATION_ID || descriptor.boundLockGeneration !== 890) throw new Error('reference descriptor immutable binding mismatch');
  const operationRequest = gitJsonAt(REFERENCE_TARGET_HEAD, REFERENCE_OPERATION_PATH);
  const constructionProcedure = gitJsonAt(REFERENCE_TARGET_HEAD, REFERENCE_PROCEDURE_PATH);
  const state = gitJsonAt(REFERENCE_TARGET_HEAD, REFERENCE_STATE_PATH);
  if (hashObject(operationRequest) !== state.admission.requestDigest || hashObject(constructionProcedure) !== state.admission.procedureLocatorDigest) throw new Error('reference candidate admission digest mismatch');
  const admissionReceipt = {
    schema: 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',
    result: 'ADMITTED_AND_LOCKED',
    operationId: operationRequest.operationId,
    projectId: operationRequest.projectId,
    operationStarted: true,
    workflowExecutionAuthorized: true,
    requestDigest: state.admission.requestDigest,
    procedureLocatorDigest: state.admission.procedureLocatorDigest,
    lock: {
      lockAcquired: true,
      lockGeneration: state.lockGeneration,
      lockScope: operationRequest.lockScope,
      operationId: operationRequest.operationId,
      scopeHash: state.admission.scopeHash
    }
  };
  const ledger = { activeScopes: { [state.admission.scopeHash]: {
    operationId: operationRequest.operationId,
    lockGeneration: state.lockGeneration,
    lockScope: operationRequest.lockScope,
    state: 'ADMITTED_LOCKED',
    released: false,
    requestDigest: state.admission.requestDigest,
    procedureLocatorDigest: state.admission.procedureLocatorDigest
  } } };
  const request = {
    schema: 'BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1',
    requestId: 'SYNTHETIC_REFERENCE_CLASS_POSITIVE',
    descriptorId: descriptor.descriptorId,
    operationRequest,
    constructionProcedure,
    admissionReceipt,
    requestNonce: nonce('c')
  };
  return { request, ledger, descriptor };
}
function rehashFixture(fixture) {
  const { request } = fixture;
  const generation = request.admissionReceipt.lock.lockGeneration;
  const scopeHash = request.admissionReceipt.lock.scopeHash;
  request.admissionReceipt.operationId = request.operationRequest.operationId;
  request.admissionReceipt.projectId = request.operationRequest.projectId;
  request.admissionReceipt.lock.operationId = request.operationRequest.operationId;
  request.admissionReceipt.lock.lockScope = request.operationRequest.lockScope;
  const finalized = finalizeFixture(request.operationRequest, request.constructionProcedure, request.admissionReceipt, generation, scopeHash);
  fixture.ledger = finalized.ledger;
  return fixture;
}
function expectPass(name, fn, results) {
  try { fn(); results.push({ name, expected: 'PASS', observed: 'PASS' }); }
  catch (error) { results.push({ name, expected: 'PASS', observed: `FAIL:${error.code ?? error.message}` }); }
}
function expectFail(name, expectedCode, fn, results) {
  try { fn(); results.push({ name, expected: expectedCode, observed: 'UNEXPECTED_PASS' }); }
  catch (error) { results.push({ name, expected: expectedCode, observed: error.code ?? error.message }); }
}
function runNativeRegression(name, script, validate) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bounded-carrier-regression-'));
  const output = path.join(dir, `${name}.json`);
  try {
    cp.execFileSync(process.execPath, [script, '--output', output], {
      cwd: ROOT,
      env: { ...process.env },
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 32 * 1024 * 1024
    });
    const receipt = JSON.parse(fs.readFileSync(output, 'utf8'));
    validate(receipt);
    return stable({ name, result: 'PASS', receiptSchema: receipt.schema ?? null, nativeResult: receipt.result ?? null });
  } catch (error) {
    return stable({ name, result: 'FAIL', detail: error.message });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
function runReferenceClassNativeRegression() {
  try {
    const fixture = referenceFixture();
    const resolution = validateAndResolve({ rawRequest: fixture.request, registry, ledger: fixture.ledger });
    const receipt = executeResolved(resolution, { root: ROOT });
    if (receipt.result !== 'COMMAND_EXECUTED_AND_PASSED' || receipt.executionClass !== 'REFERENCE_CLASS_AWARDS_ADMISSION_VERIFY_V1' || receipt.targetHead !== REFERENCE_TARGET_HEAD || receipt.nativeReceiptSchema !== 'REFERENCE_CLASS_AWARDS_ADMISSION_STATIC_VERIFICATION_RECEIPT_v1' || receipt.nativeReceipt?.result !== 'PASS' || receipt.nativeReceipt?.executionHead !== REFERENCE_TARGET_HEAD || receipt.referenceClassVerifierBlobVerified !== true || receipt.referenceClassVerifierFixedArgumentsVerified !== true || receipt.repositoryWritesPerformed !== false || receipt.arbitraryCommandAuthority !== false) throw new Error('REFERENCE_CLASS_NATIVE_REGRESSION_NONPASS');
    return stable({ name: 'REFERENCE_CLASS_AWARDS_ADMISSION_NATIVE_VERIFIER', result: 'PASS', receiptSchema: receipt.nativeReceiptSchema, nativeResult: receipt.nativeReceipt.result, targetHead: receipt.targetHead });
  } catch (error) {
    return stable({ name: 'REFERENCE_CLASS_AWARDS_ADMISSION_NATIVE_VERIFIER', result: 'FAIL', detail: error.code ?? error.message });
  }
}

export function runSelfTest() {
  const results = [];
  {
    const { request, ledger } = baseFixture();
    expectPass('POSITIVE_REGISTERED_ROUTER_DESCRIPTOR', () => {
      const r = validateAndResolve({ rawRequest: request, registry, ledger });
      if (r.targetHead !== '2'.repeat(40) || r.paths.length !== 2 || r.task !== 'SYNTHETIC_EXPERIMENT_V1' || r.executionClass !== 'ROUTER_MUTATION_V1') throw new Error('derived values wrong');
    }, results);
  }
  {
    const { request, ledger } = pageFixture();
    expectPass('POSITIVE_DESCRIPTOR_BOUND_PAGE_ARCHITECTURE', () => {
      const r = validateAndResolve({ rawRequest: request, registry, ledger });
      if (r.executionClass !== 'PAGE_EXCELLENCE_ARCHITECTURE_V1' || r.targetHead !== '18bd40b4f27ed9775778346011cca7d7f6bec47e' || r.lockGeneration !== 857) throw new Error('page binding wrong');
      const bundle = makePageArchitectureBundle(r.descriptor, toolset, r.targetHead, r.operationId);
      if (bundle.schema !== 'MANDATORY_PAGE_PHASE_RECEIPT_BUNDLE_v1' || bundle.subjectHead !== r.targetHead || bundle.phaseReceipts?.[0]?.phase !== 'ARCHITECTURE' || bundle.phaseReceipts?.[0]?.findings?.implementationClass !== 'EXISTING_CONSTRUCT_ADOPTION') throw new Error('bundle derivation wrong');
    }, results);
  }
  {
    const { request, ledger } = referenceFixture();
    expectPass('POSITIVE_DESCRIPTOR_BOUND_REFERENCE_CLASS_VERIFIER', () => {
      const r = validateAndResolve({ rawRequest: request, registry, ledger });
      if (r.executionClass !== 'REFERENCE_CLASS_AWARDS_ADMISSION_VERIFY_V1' || r.targetHead !== REFERENCE_TARGET_HEAD || r.lockGeneration !== 890 || r.referenceClassBinding?.scriptBlob !== REFERENCE_VERIFIER_BLOB) throw new Error('reference-class binding wrong');
    }, results);
  }
  {
    const { request } = baseFixture(); request.descriptorId = 'UNREGISTERED';
    expectFail('UNREGISTERED_EXECUTABLE', 'UNREGISTERED_EXECUTABLE', () => validateAndResolve({ rawRequest: request, registry, ledger: baseFixture().ledger }), results);
  }
  for (const key of ['command','shellCommand','scriptBody','executable','environment','extraArguments','paths','targetHead','architectureBundle','receiptBundle','pageReceiptBundle']) {
    const { request } = baseFixture(); request[key] = key.includes('Bundle') ? {} : (key === 'paths' ? ['laws/evil'] : 'evil');
    expectFail(`PROHIBIT_${key}`, 'CARRIER_REQUEST_UNKNOWN_FIELD', () => validateRequest(request), results);
  }
  {
    const { request, ledger } = baseFixture(); request.admissionReceipt.lock.lockGeneration += 1;
    expectFail('LOCK_GENERATION_MISMATCH', 'ACTIVE_OPERATION_IDENTITY_MISMATCH', () => validateAndResolve({ rawRequest: request, registry, ledger }), results);
  }
  {
    const { request, ledger } = baseFixture(); request.operationRequest.allowedPaths.push('showroom/evil.js');
    expectFail('PATH_SCOPE_MISMATCH', 'REQUESTED_PATH_OUTSIDE_ADMITTED_SCOPE', () => validateAndResolve({ rawRequest: request, registry, ledger }), results);
  }
  {
    const { request, ledger } = baseFixture(); ledger.activeScopes['3'.repeat(64)].requestDigest = '4'.repeat(64);
    expectFail('REQUEST_DIGEST_MISMATCH', 'REQUEST_OR_PROCEDURE_DIGEST_MISMATCH', () => validateAndResolve({ rawRequest: request, registry, ledger }), results);
  }
  {
    const { request, ledger } = baseFixture(); ledger.activeScopes['3'.repeat(64)].procedureLocatorDigest = '5'.repeat(64);
    expectFail('PROCEDURE_DIGEST_MISMATCH', 'REQUEST_OR_PROCEDURE_DIGEST_MISMATCH', () => validateAndResolve({ rawRequest: request, registry, ledger }), results);
  }
  {
    const { request, ledger } = baseFixture(); ledger.activeScopes['3'.repeat(64)].released = true;
    expectFail('RELEASED_LOCK', 'ACTIVE_OPERATION_IDENTITY_MISMATCH', () => validateAndResolve({ rawRequest: request, registry, ledger }), results);
  }
  {
    const { request, ledger } = baseFixture(); request.operationRequest.subjectIdentity.requiredStartingHead = 'not-a-commit';
    request.admissionReceipt.requestDigest = hashObject(request.operationRequest);
    ledger.activeScopes['3'.repeat(64)].requestDigest = request.admissionReceipt.requestDigest;
    expectFail('INVALID_DERIVED_TARGET_HEAD', 'TARGET_HEAD_NOT_AUTHORIZED', () => validateAndResolve({ rawRequest: request, registry, ledger }), results);
  }
  {
    const broken = clone(registry); broken.closedWorld = false; const { request, ledger } = baseFixture();
    expectFail('CLOSED_WORLD_REQUIRED', 'REGISTRY_NOT_FAIL_CLOSED', () => validateAndResolve({ rawRequest: request, registry: broken, ledger }), results);
  }
  {
    const broken = clone(registry); broken.descriptors[0].shell = true; const { request, ledger } = baseFixture();
    expectFail('SHELL_PROHIBITED', 'DESCRIPTOR_NOT_FAIL_CLOSED', () => validateAndResolve({ rawRequest: request, registry: broken, ledger }), results);
  }
  {
    const fixture = pageFixture(); fixture.request.operationRequest.operationId = 'UNRELATED_LAWS_OPERATION'; rehashFixture(fixture);
    expectFail('PAGE_DESCRIPTOR_OPERATION_BINDING', 'DESCRIPTOR_OPERATION_BINDING_MISMATCH', () => validateAndResolve({ rawRequest: fixture.request, registry, ledger: fixture.ledger }), results);
  }
  {
    const fixture = pageFixture(); fixture.request.operationRequest.subjectIdentity.existingConstructSearchSources[0].files[0].gitBlobSha = 'f'.repeat(40); rehashFixture(fixture);
    expectFail('PAGE_SOURCE_IDENTITY_TAMPER', 'ARCHITECTURE_SOURCE_IDENTITY_MISMATCH', () => validateAndResolve({ rawRequest: fixture.request, registry, ledger: fixture.ledger }), results);
  }
  {
    const fixture = pageFixture(); const broken = clone(registry); const d = broken.descriptors.find(item => item.descriptorId === fixture.request.descriptorId); d.boundLockGeneration += 1;
    expectFail('PAGE_DESCRIPTOR_LOCK_BINDING', 'DESCRIPTOR_LOCK_BINDING_MISMATCH', () => validateAndResolve({ rawRequest: fixture.request, registry: broken, ledger: fixture.ledger }), results);
  }
  {
    const fixture = pageFixture(); const broken = clone(registry); const d = broken.descriptors.find(item => item.descriptorId === fixture.request.descriptorId); d.architectureFindings.visualArchitectureAuthority.contentAdapterMayDefineVisualArchitecture = true;
    expectFail('PAGE_ADAPTER_CANNOT_DEFINE_VISUAL_ARCHITECTURE', 'ADAPTER_VISUAL_ARCHITECTURE_AUTHORITY_PROHIBITED', () => validateAndResolve({ rawRequest: fixture.request, registry: broken, ledger: fixture.ledger }), results);
  }
  {
    const fixture = pageFixture(); const broken = clone(registry); const d = broken.descriptors.find(item => item.descriptorId === fixture.request.descriptorId); d.architectureFindings.exactSourceConstructIdentities[0].path = 'laws/not-declared.js';
    expectFail('PAGE_DESCRIPTOR_UNDECLARED_SOURCE', 'ARCHITECTURE_SOURCE_IDENTITY_MISMATCH', () => validateAndResolve({ rawRequest: fixture.request, registry: broken, ledger: fixture.ledger }), results);
  }
  {
    const fixture = referenceFixture(); fixture.request.operationRequest.operationId = 'UNRELATED_REFERENCE_OPERATION'; rehashFixture(fixture);
    expectFail('REFERENCE_DESCRIPTOR_OPERATION_BINDING', 'DESCRIPTOR_OPERATION_BINDING_MISMATCH', () => validateAndResolve({ rawRequest: fixture.request, registry, ledger: fixture.ledger }), results);
  }
  {
    const fixture = referenceFixture(); const broken = clone(registry); const d = broken.descriptors.find(item => item.descriptorId === REFERENCE_DESCRIPTOR_ID); d.boundLockGeneration += 1;
    expectFail('REFERENCE_DESCRIPTOR_LOCK_BINDING', 'DESCRIPTOR_LOCK_BINDING_MISMATCH', () => validateAndResolve({ rawRequest: fixture.request, registry: broken, ledger: fixture.ledger }), results);
  }
  {
    const fixture = referenceFixture(); const broken = clone(registry); const d = broken.descriptors.find(item => item.descriptorId === REFERENCE_DESCRIPTOR_ID); d.scriptPath = 'tools/evil.mjs';
    expectFail('REFERENCE_DESCRIPTOR_PATH_BINDING', 'DESCRIPTOR_EXECUTABLE_NOT_ALLOWED', () => validateAndResolve({ rawRequest: fixture.request, registry: broken, ledger: fixture.ledger }), results);
  }
  {
    const fixture = referenceFixture(); const broken = clone(registry); const d = broken.descriptors.find(item => item.descriptorId === REFERENCE_DESCRIPTOR_ID); d.fixedArguments = ['--verify-static','--extra'];
    expectFail('REFERENCE_DESCRIPTOR_ARGUMENT_BINDING', 'REFERENCE_CLASS_VERIFIER_ARGUMENT_BINDING_INVALID', () => validateAndResolve({ rawRequest: fixture.request, registry: broken, ledger: fixture.ledger }), results);
  }
  {
    const fixture = referenceFixture(); const broken = clone(registry); const d = broken.descriptors.find(item => item.descriptorId === REFERENCE_DESCRIPTOR_ID); d.mutationIntent = true;
    expectFail('REFERENCE_DESCRIPTOR_MUTATION_INTENT', 'REFERENCE_CLASS_VERIFIER_MUTATION_INTENT_PROHIBITED', () => validateAndResolve({ rawRequest: fixture.request, registry: broken, ledger: fixture.ledger }), results);
  }
  {
    const fixture = referenceFixture(); const r = validateAndResolve({ rawRequest: fixture.request, registry, ledger: fixture.ledger }); const brokenResolution = clone(r); brokenResolution.descriptor.scriptBlob = 'f'.repeat(40);
    expectFail('REFERENCE_DESCRIPTOR_BLOB_EXECUTION_BINDING', 'REFERENCE_CLASS_VERIFIER_BLOB_MISMATCH', () => executeResolved(brokenResolution, { root: ROOT }), results);
  }

  const regressions = [
    runNativeRegression(
      'PROGRESSIVE_SYSTEM_CONTINUITY_NATIVE_SELF_TEST',
      '.github/ai-router/system-continuity/progressive-system-continuity-self-test.v1.mjs',
      r => { if (r.result !== 'PASS' || r.failedCount !== 0 || r.productMutationPerformed !== false || r.repositoryMutationPerformedBySelfTest !== false || r.lifecycleMutationPerformed !== false || r.genericCommandAuthority !== false) throw new Error('PROGRESSIVE_SYSTEM_CONTINUITY_REGRESSION_NONPASS'); }
    ),
    runNativeRegression(
      'DIFFERENTIAL_CONTINUITY_NATIVE_SELF_TEST',
      '.github/ai-router/differential-continuity/differential-continuity-self-test.v1.mjs',
      r => { if (r.result !== 'PASS_CLOSED' || r.failCount !== 0 || r.passCount !== r.testCount) throw new Error('DIFFERENTIAL_CONTINUITY_REGRESSION_NONPASS'); }
    ),
    runNativeRegression(
      'INSTRUMENT_LIFECYCLE_NATIVE_SELF_TEST',
      '.github/ai-router/instrument-lifecycle/instrument-lifecycle-self-test.v1.mjs',
      r => { if (r.result !== 'PASS' || r.failedCount !== 0 || r.repositoryMutationPerformed !== false || r.workflowDeactivationPerformed !== false || r.physicalRetirementPerformed !== false) throw new Error('INSTRUMENT_LIFECYCLE_REGRESSION_NONPASS'); }
    ),
    runNativeRegression(
      'STRICT_SUCCESSOR_NATIVE_SELF_TEST',
      '.github/ai-router/operation-lifecycle/repository-operation-successor-self-test.v1.mjs',
      r => { if (r.result !== 'PASS_CLOSED' || r.failCount !== 0 || r.passCount !== r.testCount) throw new Error('STRICT_SUCCESSOR_REGRESSION_NONPASS'); }
    ),
    runNativeRegression(
      'INTEGRATED_DEVELOPMENT_PIPELINE_NATIVE_SELF_TEST',
      '.github/ai-router/development-pipeline/integrated-development-pipeline-self-test.v1.mjs',
      r => { if (r.result !== 'PASS' || r.failedCount !== 0 || r.physicalRetirementPerformed !== false || r.mergeAuthorityCreated !== false || r.productAuthorityCreated !== false) throw new Error('INTEGRATED_PIPELINE_REGRESSION_NONPASS'); }
    ),
    runReferenceClassNativeRegression()
  ];

  const fixturePass = results.every(item => item.observed === item.expected || (item.expected === 'PASS' && item.observed === 'PASS'));
  const regressionPass = regressions.every(item => item.result === 'PASS');
  return stable({
    schema: 'BOUNDED_EXACT_HEAD_EXECUTION_CARRIER_SELF_TEST_RECEIPT_v1',
    result: fixturePass && regressionPass ? 'PASS' : 'FAIL',
    executionHead: executionHead(),
    exactHeadReexecutionMode: process.env.CARRIER_EXACT_HEAD_REEXEC === '1',
    total: results.length,
    passed: results.filter(item => item.observed === item.expected || (item.expected === 'PASS' && item.observed === 'PASS')).length,
    nativeRegressionCount: regressions.length,
    nativeRegressionPassCount: regressions.filter(item => item.result === 'PASS').length,
    nativeRegressions: regressions,
    pageArchitectureExecutionClassPresent: true,
    referenceClassAwardsAdmissionExecutionClassPresent: true,
    descriptorBoundArchitectureBundleOnly: true,
    descriptorBoundReferenceClassTargetAndArgumentsOnly: true,
    authorityInflationObserved: false,
    arbitraryCommandAccepted: false,
    callerSuppliedBundleAccepted: false,
    fixtures: results
  });
}

function main() {
  const args = process.argv.slice(2);
  const index = args.indexOf('--output');
  const output = index >= 0 ? args[index + 1] : null;
  const local = runSelfTest();
  let exactCandidateReexecution = null;
  const prHead = pullRequestHeadFromEvent();
  if (prHead) exactCandidateReexecution = runExactHeadReexecution(prHead);
  const pass = local.result === 'PASS' && (exactCandidateReexecution == null || exactCandidateReexecution.result === 'PASS');
  const receipt = stable({ ...local, result: pass ? 'PASS' : 'FAIL', exactCandidateReexecution });
  if (output) {
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(path.resolve(output), `${JSON.stringify(receipt, null, 2)}\n`);
  } else process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  if (receipt.result !== 'PASS') process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
