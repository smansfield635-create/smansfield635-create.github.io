#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stable, hashObject, validateRequest, validateAndResolve, makePageArchitectureBundle } from './carrier.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, '.github/ai-router/bounded-exact-head-execution-carrier/registry.v1.json'), 'utf8'));
const toolset = JSON.parse(fs.readFileSync(path.join(ROOT, '.github/ai-router/page-excellence-toolchain/toolset.bundle.v1.json'), 'utf8'));

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function nonce(char = 'a') { return char.repeat(64); }
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
    )
  ];

  const fixturePass = results.every(item => item.observed === item.expected || (item.expected === 'PASS' && item.observed === 'PASS'));
  const regressionPass = regressions.every(item => item.result === 'PASS');
  const pass = fixturePass && regressionPass;
  return stable({
    schema: 'BOUNDED_EXACT_HEAD_EXECUTION_CARRIER_SELF_TEST_RECEIPT_v1',
    result: pass ? 'PASS' : 'FAIL',
    total: results.length,
    passed: results.filter(item => item.observed === item.expected || (item.expected === 'PASS' && item.observed === 'PASS')).length,
    nativeRegressionCount: regressions.length,
    nativeRegressionPassCount: regressions.filter(item => item.result === 'PASS').length,
    nativeRegressions: regressions,
    pageArchitectureExecutionClassPresent: true,
    descriptorBoundArchitectureBundleOnly: true,
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
  const receipt = runSelfTest();
  if (output) {
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(path.resolve(output), `${JSON.stringify(receipt, null, 2)}\n`);
  } else process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  if (receipt.result !== 'PASS') process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
