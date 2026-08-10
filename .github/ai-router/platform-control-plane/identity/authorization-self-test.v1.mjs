#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateAuthorization, REQUEST_SCHEMA } from './authorization-gate.v1.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(fs.readFileSync(path.join(here, 'principal-registry.v1.json'), 'utf8'));
const policy = JSON.parse(fs.readFileSync(path.join(here, 'role-policy.v1.json'), 'utf8'));
const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;

function constructorRequest(overrides = {}) {
  return {
    schema: REQUEST_SCHEMA,
    principalId: 'execution:l2-platform-strike-constructor',
    identityEvidence: {
      executionHolder: 'L2_CONTROL_PLANE_PLATFORM_STRIKE_CONSTRUCTOR',
      repository: 'smansfield635-create/smansfield635-create.github.io'
    },
    tenantId: 'IMI_CONTROL_PLANE_PLATFORM',
    projectId: 'IMI_CONTROL_PLANE_PLATFORM',
    action: 'L2_COMPONENT_CONSTRUCT',
    resource: '.github/ai-router/platform-control-plane/identity/authorization-gate.v1.mjs',
    subjectHead: 'TEST_HEAD',
    currentMainHead: 'TEST_HEAD',
    assertedRoles: ['L2_STRIKE_CONSTRUCTOR'],
    ...overrides
  };
}

const cases = [];
function run(name, input, expectedDecision, expectedErrorCode = null) {
  const receipt = evaluateAuthorization(input, registry, policy);
  assert.equal(receipt.decision, expectedDecision, `${name}: decision`);
  assert.equal(receipt.errorCode, expectedErrorCode, `${name}: errorCode`);
  assert.equal(receipt.authorityCreated, false, `${name}: authorityCreated`);
  assert.equal(receipt.mergeAuthorityCreated, false, `${name}: mergeAuthorityCreated`);
  assert.equal(receipt.repositorySettingsAuthorityCreated, false, `${name}: repositorySettingsAuthorityCreated`);
  assert.equal(receipt.rulesetActivationAuthorityCreated, false, `${name}: rulesetActivationAuthorityCreated`);
  assert.equal(receipt.externalRepositoryWriteAuthorityCreated, false, `${name}: externalRepositoryWriteAuthorityCreated`);
  assert.equal(receipt.hEarthAuthorityCreated, false, `${name}: hEarthAuthorityCreated`);
  assert.equal(receipt.lawsAuthorityCreated, false, `${name}: lawsAuthorityCreated`);
  cases.push({ name, decision: receipt.decision, errorCode: receipt.errorCode });
  return receipt;
}

const positive = run('known constructor exact L2 resource', constructorRequest(), 'ALLOW');
assert.deepEqual(positive.effectiveRoles, ['L2_STRIKE_CONSTRUCTOR']);

run('unknown principal fails closed', constructorRequest({ principalId: 'unknown:principal' }), 'DENY', 'UNKNOWN_PRINCIPAL');
run('identity evidence mismatch fails closed', constructorRequest({ identityEvidence: { executionHolder: 'SPOOFED', repository: 'smansfield635-create/smansfield635-create.github.io' } }), 'DENY', 'IDENTITY_EVIDENCE_MISMATCH');
run('cross tenant denied', constructorRequest({ tenantId: 'OTHER_TENANT' }), 'DENY', 'CROSS_TENANT_DENIED');
run('cross project denied', constructorRequest({ projectId: 'OTHER_PROJECT' }), 'DENY', 'CROSS_PROJECT_DENIED');
run('role injection denied', constructorRequest({ assertedRoles: ['L2_STRIKE_CONSTRUCTOR', 'L2_PLATFORM_ORIGINATOR'] }), 'DENY', 'ROLE_ASSERTION_ESCALATION');
run('exact head mismatch denied', constructorRequest({ subjectHead: 'A', currentMainHead: 'B' }), 'DENY', 'EXACT_HEAD_MISMATCH');
run('unknown action denied', constructorRequest({ action: 'UNREGISTERED_ACTION' }), 'DENY', 'UNKNOWN_ACTION');
run('merge privilege escalation denied', constructorRequest({ action: 'MERGE' }), 'DENY', 'GLOBAL_ACTION_DENIED');
run('repository settings escalation denied', constructorRequest({ action: 'REPOSITORY_SETTINGS_WRITE' }), 'DENY', 'GLOBAL_ACTION_DENIED');
run('external repository write denied', constructorRequest({ action: 'EXTERNAL_REPOSITORY_WRITE' }), 'DENY', 'GLOBAL_ACTION_DENIED');
run('H-Earth mutation denied', constructorRequest({ action: 'H_EARTH_MUTATE', resource: 'showroom/globe/h-earth/index.html' }), 'DENY', 'GLOBAL_ACTION_DENIED');
run('Laws mutation denied', constructorRequest({ action: 'LAWS_MUTATE', resource: 'laws/index.html' }), 'DENY', 'GLOBAL_ACTION_DENIED');
run('constructor outside L2 scope denied', constructorRequest({ resource: '.github/ai-router/system-continuity/gap-registry.v1.json' }), 'DENY', 'ROLE_SCOPE_DENIED');

const verifierInput = constructorRequest({
  principalId: 'execution:l2-platform-strike-fresh-verifier',
  identityEvidence: {
    executionHolder: 'L2_CONTROL_PLANE_PLATFORM_STRIKE_FRESH_VERIFIER',
    repository: 'smansfield635-create/smansfield635-create.github.io'
  },
  assertedRoles: ['L2_STRIKE_FRESH_VERIFIER'],
  action: 'L2_COMPONENT_VERIFY'
});
run('fresh verifier may verify', verifierInput, 'ALLOW');
run('fresh verifier may not construct', { ...verifierInput, action: 'L2_COMPONENT_CONSTRUCT' }, 'DENY', 'ROLE_SCOPE_DENIED');

const result = stable({
  schema: 'L2_AUTHORIZATION_SELF_TEST_RECEIPT_v1',
  result: 'PASS_CLOSED',
  caseCount: cases.length,
  cases,
  testedLaws: [
    'KNOWN_IDENTITY_AND_SCOPE_ALLOW',
    'UNKNOWN_IDENTITY_FAIL_CLOSED',
    'IDENTITY_EVIDENCE_MISMATCH_FAIL_CLOSED',
    'CROSS_TENANT_DENY',
    'CROSS_PROJECT_DENY',
    'ROLE_INJECTION_DENY',
    'EXACT_HEAD_MISMATCH_DENY',
    'UNKNOWN_ACTION_DENY',
    'PRIVILEGE_ESCALATION_DENY',
    'OUT_OF_SCOPE_RESOURCE_DENY',
    'FRESH_VERIFIER_SEPARATION'
  ],
  authorityCreated: false,
  mergeAuthorityCreated: false,
  repositorySettingsAuthorityCreated: false,
  branchProtectionAuthorityCreated: false,
  rulesetActivationAuthorityCreated: false,
  externalRepositoryWriteAuthorityCreated: false,
  hEarthAuthorityCreated: false,
  lawsAuthorityCreated: false,
  deploymentAuthorityCreated: false,
  genericCommandAuthorityCreated: false
});

const outputIndex = process.argv.indexOf('--output');
if (outputIndex >= 0 && process.argv[outputIndex + 1]) fs.writeFileSync(process.argv[outputIndex + 1], JSON.stringify(result, null, 2) + '\n');
process.stdout.write(JSON.stringify(result) + '\n');
