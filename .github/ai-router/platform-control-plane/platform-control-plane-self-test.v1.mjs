#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { evaluatePlatformControlPlane, REQUEST_SCHEMA } from './platform-control-plane-gate.v1.mjs';
import { REQUEST_SCHEMA as AUTH_SCHEMA } from './identity/authorization-gate.v1.mjs';
import { REQUEST_SCHEMA as FED_SCHEMA } from './federation/federation-gate.v1.mjs';
import { REQUEST_SCHEMA as OBS_SCHEMA, EVENT_SCHEMA } from './observability/control-plane-state-projector.v1.mjs';
import { REQUEST_SCHEMA as ENF_SCHEMA } from './enforcement/enforcement-shadow-gate.v1.mjs';

const HISTORICAL_SOURCE = Object.freeze({
  sourceCandidateHead: '196ac23ee3ff6d8a493ba58c45b20ad747c1c52b',
  sourceGeneration: 854,
  use: 'SOURCE_EVIDENCE_ONLY',
  authorityInherited: false
});

const PACKAGE_PATHS = Object.freeze([
  '.github/ai-router/platform-control-plane/identity/principal-registry.v1.json',
  '.github/ai-router/platform-control-plane/identity/role-policy.v1.json',
  '.github/ai-router/platform-control-plane/identity/authorization-gate.v1.mjs',
  '.github/ai-router/platform-control-plane/identity/authorization-self-test.v1.mjs',
  '.github/ai-router/platform-control-plane/federation/repository-registry.v1.json',
  '.github/ai-router/platform-control-plane/federation/federation-protocol.v1.json',
  '.github/ai-router/platform-control-plane/federation/federation-gate.v1.mjs',
  '.github/ai-router/platform-control-plane/federation/federation-self-test.v1.mjs',
  '.github/ai-router/platform-control-plane/observability/observability-protocol.v1.json',
  '.github/ai-router/platform-control-plane/observability/control-plane-state-projector.v1.mjs',
  '.github/ai-router/platform-control-plane/observability/observability-self-test.v1.mjs',
  '.github/ai-router/platform-control-plane/enforcement/enforcement-policy.v1.json',
  '.github/ai-router/platform-control-plane/enforcement/enforcement-shadow-gate.v1.mjs',
  '.github/ai-router/platform-control-plane/enforcement/enforcement-self-test.v1.mjs',
  '.github/ai-router/platform-control-plane/platform-control-plane-protocol.v1.json',
  '.github/ai-router/platform-control-plane/platform-control-plane-gate.v1.mjs',
  '.github/ai-router/platform-control-plane/platform-control-plane-self-test.v1.mjs',
  '.github/workflows/platform-control-plane-strike-v1.yml'
]);

const LIFECYCLE_REGISTRY_PATH = '.github/ai-router/instrument-lifecycle/instrument-lifecycle-registry.v1.json';
const WORKFLOW_PATH = '.github/workflows/platform-control-plane-strike-v1.yml';

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;

function cli(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i]?.startsWith('--') || argv[i + 1] === undefined) throw Error('CLI_ARGUMENT_INVALID');
    out[argv[i].slice(2)] = argv[i + 1];
  }
  return out;
}

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function assertExactHead(actual, expected) {
  if (actual !== expected) throw Error('EXACT_CANDIDATE_HEAD_MISMATCH');
}

function readJson(root, rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

function component(root, rel, tmp, name) {
  const out = path.join(tmp, `${name}.json`);
  execFileSync(process.execPath, [rel, '--output', out], { cwd: root, encoding: 'utf8' });
  return JSON.parse(fs.readFileSync(out, 'utf8'));
}

function config(root) {
  return {
    principalRegistry: readJson(root, '.github/ai-router/platform-control-plane/identity/principal-registry.v1.json'),
    rolePolicy: readJson(root, '.github/ai-router/platform-control-plane/identity/role-policy.v1.json'),
    repositoryRegistry: readJson(root, '.github/ai-router/platform-control-plane/federation/repository-registry.v1.json'),
    enforcementPolicy: readJson(root, '.github/ai-router/platform-control-plane/enforcement/enforcement-policy.v1.json')
  };
}

function request(head) {
  return {
    schema: REQUEST_SCHEMA,
    authorization: {
      schema: AUTH_SCHEMA,
      principalId: 'execution:l2-platform-strike-fresh-verifier',
      identityEvidence: {
        executionHolder: 'L2_CONTROL_PLANE_PLATFORM_STRIKE_FRESH_VERIFIER',
        repository: 'smansfield635-create/smansfield635-create.github.io'
      },
      tenantId: 'IMI_CONTROL_PLANE_PLATFORM',
      projectId: 'IMI_CONTROL_PLANE_PLATFORM',
      action: 'L2_COMPONENT_VERIFY',
      resource: 'control-plane://l2/strike',
      subjectHead: head,
      currentMainHead: head,
      assertedRoles: ['L2_STRIKE_FRESH_VERIFIER']
    },
    federation: {
      schema: FED_SCHEMA,
      operation: 'VERIFY_RECEIPT',
      sourceRepository: {
        repositoryId: 'repo:website-main',
        numericId: 1142978610,
        fullName: 'smansfield635-create/smansfield635-create.github.io'
      },
      targetRepository: {
        repositoryId: 'repo:geodiametrics',
        numericId: 1142904555,
        fullName: 'smansfield635-create/geodiametrics'
      },
      sourceHead: head,
      evidence: { algorithm: 'sha256', digest: 'c'.repeat(64) },
      authorityTransferRequested: false,
      externalWriteRequested: false
    },
    observability: {
      schema: OBS_SCHEMA,
      events: [{
        schema: EVENT_SCHEMA,
        eventId: 'integrated-1',
        operationId: 'L2_PLATFORM_CONTROL_PLANE_CURRENT_ADOPTION_v1',
        sequence: 1,
        lane: 'L2_CONTROL_PLANE',
        status: 'PASS_CLOSED',
        subjectHead: head,
        evidenceDigest: 'd'.repeat(64)
      }]
    },
    enforcement: {
      schema: ENF_SCHEMA,
      repository: 'smansfield635-create/smansfield635-create.github.io',
      branch: 'main',
      proposedAction: 'EVALUATE_ONLY',
      observedPerimeter: {
        branchProtected: false,
        pullRequestRequired: false,
        directPushAllowed: true,
        requiredChecks: []
      },
      exactHeadEvidenceValid: true,
      explicitMergeAuthority: false,
      bypassRequested: false,
      liveActivationRequested: false
    }
  };
}

function assertLifecycle(root) {
  const registry = readJson(root, LIFECYCLE_REGISTRY_PATH);
  assert.equal(registry.schema, 'REPOSITORY_INSTRUMENT_LIFECYCLE_REGISTRY_v1');
  const records = Array.isArray(registry.records) ? registry.records : [];
  const matches = records.filter(record => record.workflowPath === WORKFLOW_PATH);
  assert.equal(matches.length, 1, 'PLATFORM_CONTROL_PLANE_LIFECYCLE_RECORD_COUNT_INVALID');
  const record = matches[0];
  assert.equal(record.state, 'ACTIVE_CURRENT', 'PLATFORM_CONTROL_PLANE_NOT_ACTIVE_CURRENT');
  assert.equal(record.currentAuthority, false, 'SHADOW_INSTRUMENT_MUST_NOT_CREATE_AUTHORITY');
  assert.equal(record.protected, true, 'ACTIVE_CURRENT_INSTRUMENT_MUST_BE_PROTECTED');
  assert.equal(record.physicalRetirementAuthorized, false, 'PHYSICAL_RETIREMENT_AUTHORITY_MUST_REMAIN_FALSE');
  return stable(record);
}

const args = cli(process.argv.slice(2));
const root = path.resolve(args.root ?? '.');
const expected = args['expected-head'];
if (!expected || !args.output) throw Error('CLI_REQUIRED_ARGUMENT_MISSING');

const actual = git(root, ['rev-parse', 'HEAD']);
assertExactHead(actual, expected);
assert.throws(() => assertExactHead(actual, '0'.repeat(40)), /EXACT_CANDIDATE_HEAD_MISMATCH/);

for (const rel of PACKAGE_PATHS) {
  assert.ok(fs.existsSync(path.join(root, rel)), `MISSING_PACKAGE_PATH:${rel}`);
}
assert.ok(fs.existsSync(path.join(root, LIFECYCLE_REGISTRY_PATH)), `MISSING_LIFECYCLE_REGISTRY:${LIFECYCLE_REGISTRY_PATH}`);

const lifecycleRecord = assertLifecycle(root);

const fingerprint = crypto.createHash('sha256');
for (const rel of [...PACKAGE_PATHS].sort()) {
  fingerprint.update(rel);
  fingerprint.update('\0');
  fingerprint.update(fs.readFileSync(path.join(root, rel)));
  fingerprint.update('\0');
}
const packageFingerprint = fingerprint.digest('hex');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'l2-platform-current-'));
const components = {
  identity: component(root, '.github/ai-router/platform-control-plane/identity/authorization-self-test.v1.mjs', tmp, 'identity'),
  federation: component(root, '.github/ai-router/platform-control-plane/federation/federation-self-test.v1.mjs', tmp, 'federation'),
  observability: component(root, '.github/ai-router/platform-control-plane/observability/observability-self-test.v1.mjs', tmp, 'observability'),
  enforcement: component(root, '.github/ai-router/platform-control-plane/enforcement/enforcement-self-test.v1.mjs', tmp, 'enforcement')
};
for (const [name, receipt] of Object.entries(components)) {
  assert.equal(receipt.result, 'PASS_CLOSED', `${name}_SELF_TEST_FAILED`);
}

const cfg = config(root);
const base = request(actual);
const cases = [];

function run(name, input, expectedResult, expectedFailed = null) {
  const receipt = evaluatePlatformControlPlane(input, cfg);
  assert.equal(receipt.result, expectedResult, `${name}:result`);
  if (expectedFailed) assert.equal(receipt.failedComponent, expectedFailed, `${name}:component`);
  assert.equal(receipt.authorityCreated, false);
  assert.equal(receipt.mergeMayProceed, false);
  assert.equal(receipt.liveEnforcementMayProceed, false);
  cases.push({
    name,
    result: receipt.result,
    failedComponent: receipt.failedComponent ?? null,
    enforcementReadiness: receipt.enforcementReadiness ?? null,
    contradictionCount: receipt.observability?.contradictionCount ?? null
  });
  return receipt;
}

const positive = run('valid integrated evaluation preserves perimeter gap', base, 'PASS_CLOSED');
assert.equal(positive.enforcement.result, 'SHADOW_DENY');
assert.equal(positive.enforcementReadiness, 'GAP_DETECTED_NOT_ACTIVATED');

const roleInjected = structuredClone(base);
roleInjected.authorization.assertedRoles.push('L2_PLATFORM_ORIGINATOR');
run('role injection stopped', roleInjected, 'STOP_CLOSED', 'AUTHORIZATION');

const fedMismatch = structuredClone(base);
fedMismatch.federation.targetRepository.numericId = 1;
run('federation identity mismatch stopped', fedMismatch, 'STOP_CLOSED', 'FEDERATION');

const obsInvalid = structuredClone(base);
obsInvalid.observability.events[0].evidenceDigest = 'bad';
run('invalid observability evidence stopped', obsInvalid, 'STOP_CLOSED', 'OBSERVABILITY');

const liveActivation = structuredClone(base);
liveActivation.enforcement.liveActivationRequested = true;
run('live enforcement activation stopped', liveActivation, 'STOP_CLOSED', 'ENFORCEMENT_SHADOW');

const contradiction = structuredClone(base);
contradiction.observability.events.push({
  ...contradiction.observability.events[0],
  eventId: 'integrated-2',
  status: 'STOP',
  evidenceDigest: 'e'.repeat(64)
});
const contradictionReceipt = run('contradiction preserved without false resolution', contradiction, 'PASS_CLOSED');
assert.equal(contradictionReceipt.observability.contradictionCount, 1);
assert.equal(contradictionReceipt.contradictionsPresent, true);

assert.equal(git(root, ['diff', '--name-only']), '', 'SELF_TEST_MUTATED_TRACKED_REPOSITORY');

const final = stable({
  schema: 'L2_PLATFORM_CONTROL_PLANE_CERTIFICATION_RECEIPT_v1',
  result: 'PASS_CLOSED',
  certificationScope: 'REPOSITORY_INTERNAL_CURRENT_STATE_CONFORMANCE_ONLY',
  exactCandidateHead: actual,
  currentStateBound: true,
  historicalSourceEvidence: HISTORICAL_SOURCE,
  authorityInherited: false,
  packagePathCount: PACKAGE_PATHS.length,
  packagePaths: [...PACKAGE_PATHS].sort(),
  packageFingerprintDomain: {
    domainId: 'L2_PLATFORM_CONTROL_PLANE_CURRENT_PACKAGE_FINGERPRINT_v1',
    algorithm: 'sha256'
  },
  packageFingerprintSha256: packageFingerprint,
  lifecycleRecord,
  componentSelfTests: Object.fromEntries(Object.entries(components).map(([name, receipt]) => [name, receipt.result])),
  integratedAdversarialCases: cases,
  enforcementShadowFinding: positive.enforcement.result,
  enforcementActivationPerformed: false,
  repositorySettingsMutated: false,
  externalRepositoryWritesPerformed: false,
  mergePerformed: false,
  systemGapClosureClaimed: false,
  authorityCreated: false,
  evidenceMayPropagate: true,
  authorityMayPropagate: false,
  externalStandardsConformanceClaim: false,
  productionHardeningClaim: false
});

fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
fs.writeFileSync(path.resolve(args.output), JSON.stringify(final, null, 2) + '\n');
process.stdout.write(JSON.stringify({
  result: final.result,
  schema: final.schema,
  exactCandidateHead: actual,
  packagePathCount: PACKAGE_PATHS.length,
  packageFingerprintSha256: packageFingerprint
}) + '\n');