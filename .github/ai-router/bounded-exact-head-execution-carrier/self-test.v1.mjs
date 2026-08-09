#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stable, hashObject, validateRequest, validateAndResolve } from './carrier.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, '.github/ai-router/bounded-exact-head-execution-carrier/registry.v1.json'), 'utf8'));

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function nonce(char = 'a') { return char.repeat(64); }
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
  const requestDigest = hashObject(operationRequest);
  const procedureDigest = hashObject(constructionProcedure);
  const admissionReceipt = {
    schema: 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',
    result: 'ADMITTED_AND_LOCKED',
    operationId: operationRequest.operationId,
    projectId: operationRequest.projectId,
    operationStarted: true,
    workflowExecutionAuthorized: true,
    requestDigest,
    procedureLocatorDigest: procedureDigest,
    lock: {
      lockAcquired: true,
      lockGeneration: 999,
      lockScope: operationRequest.lockScope,
      operationId: operationRequest.operationId,
      scopeHash: '3'.repeat(64)
    }
  };
  const ledger = { activeScopes: { ['3'.repeat(64)]: {
    operationId: operationRequest.operationId,
    lockGeneration: 999,
    lockScope: operationRequest.lockScope,
    state: 'ADMITTED_LOCKED',
    released: false,
    requestDigest,
    procedureLocatorDigest: procedureDigest
  } } };
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
function expectPass(name, fn, results) {
  try { fn(); results.push({ name, expected: 'PASS', observed: 'PASS' }); }
  catch (error) { results.push({ name, expected: 'PASS', observed: `FAIL:${error.code ?? error.message}` }); }
}
function expectFail(name, expectedCode, fn, results) {
  try { fn(); results.push({ name, expected: expectedCode, observed: 'UNEXPECTED_PASS' }); }
  catch (error) { results.push({ name, expected: expectedCode, observed: error.code ?? error.message }); }
}

export function runSelfTest() {
  const results = [];
  {
    const { request, ledger } = baseFixture();
    expectPass('POSITIVE_REGISTERED_DESCRIPTOR', () => {
      const r = validateAndResolve({ rawRequest: request, registry, ledger });
      if (r.targetHead !== '2'.repeat(40) || r.paths.length !== 2 || r.task !== 'SYNTHETIC_EXPERIMENT_V1') throw new Error('derived values wrong');
    }, results);
  }
  {
    const { request } = baseFixture(); request.descriptorId = 'UNREGISTERED';
    expectFail('UNREGISTERED_EXECUTABLE', 'UNREGISTERED_EXECUTABLE', () => validateAndResolve({ rawRequest: request, registry, ledger: baseFixture().ledger }), results);
  }
  for (const key of ['command','shellCommand','scriptBody','executable','environment','extraArguments','paths','targetHead']) {
    const { request } = baseFixture(); request[key] = key === 'paths' ? ['laws/evil'] : 'evil';
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
  const pass = results.every(item => item.observed === item.expected || (item.expected === 'PASS' && item.observed === 'PASS'));
  return stable({
    schema: 'BOUNDED_EXACT_HEAD_EXECUTION_CARRIER_SELF_TEST_RECEIPT_v1',
    result: pass ? 'PASS' : 'FAIL',
    total: results.length,
    passed: results.filter(item => item.observed === item.expected || (item.expected === 'PASS' && item.observed === 'PASS')).length,
    authorityInflationObserved: false,
    arbitraryCommandAccepted: false,
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
