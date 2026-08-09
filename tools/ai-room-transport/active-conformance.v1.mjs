#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolveToolset } from './toolset-resolver.v1.mjs';
import { runSuccessorCompatibilitySelfTest } from './successor-compatibility-self-test.v1.mjs';

const GENESIS_BASE = '56b6ab1f192aec994af0c537dd7c9dad1be14d7f';
const GENESIS_HEAD = '1a8bce8f6cdd91dd43fa60fe63d1d966b8d22500';
const GENESIS_TREE = '476c1ef4d7e81db57b0f763d6a94f475ea317d1c';
const MANIFEST_BLOB = '12f433ab0031c2f77b93362408be4503fce1d0e0';
const ACTIVATION_HEAD = 'c92f4c46dea84e38a4248e8bb9271e8adab5df53';
const ACTIVATION_REGISTRY_BLOB = '4c3dc7f96c586c69277274d4110285839f58b092';
const BASE = '.github/ai-toolset-transport';
const REGISTRY_PATH = `${BASE}/authorized-toolset-registry.v1.json`;
const MANIFEST_PATH = `${BASE}/changed-path-manifest.v1.json`;

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}
function canonical(value) { return JSON.stringify(stable(value)); }
function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function fail(code, detail = null) { const error = new Error(code); error.code = code; error.detail = detail; throw error; }
function assert(condition, code, detail = null) { if (!condition) fail(code, detail); }
function git(root, ...args) { return cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim(); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (!key?.startsWith('--') || argv[i + 1] === undefined) fail('ARGUMENT_INVALID', key);
    result[key.slice(2)] = argv[i + 1];
  }
  for (const key of ['root', 'expected-head', 'holder', 'output']) if (!result[key]) fail('ARGUMENT_MISSING', key);
  return result;
}
function unique(values, code) { assert(new Set(values).size === values.length, code); }
function expectedValue(name, schema, index) {
  if (Object.hasOwn(schema, 'const')) return schema.const;
  if (schema.type === 'string') {
    if (/head/i.test(name)) return `${(index % 8) + 1}`.repeat(40);
    if (/holder/i.test(name)) return `ACTIVE_CONFORMANCE_${index}`;
    return `VALUE_${index}`;
  }
  if (schema.type === 'boolean') return true;
  if (schema.type === 'integer' || schema.type === 'number') return 1;
  if (schema.type === 'array') return [];
  if (schema.type === 'object') return {};
  return null;
}
function expectedFailure(fn, code) {
  try { fn(); } catch (error) { assert(error.code === code, 'NEGATIVE_ERROR_CODE_MISMATCH', `${code}:${error.code}`); return; }
  fail('NEGATIVE_DID_NOT_FAIL', code);
}
function validateGenesis(root) {
  const manifest = readJson(path.join(root, MANIFEST_PATH));
  assert(git(root, 'rev-parse', `${GENESIS_HEAD}^{tree}`) === GENESIS_TREE, 'GENESIS_TREE_MISMATCH');
  assert(git(root, 'rev-parse', `${GENESIS_HEAD}:${MANIFEST_PATH}`) === MANIFEST_BLOB, 'GENESIS_MANIFEST_BLOB_MISMATCH');
  assert(git(root, 'rev-parse', `HEAD:${MANIFEST_PATH}`) === MANIFEST_BLOB, 'ACTIVE_MANIFEST_REWRITTEN');
  assert(manifest.baseHead === GENESIS_BASE, 'GENESIS_BASE_MISMATCH');
  assert(manifest.expectedChangedPathCount === 20, 'GENESIS_PATH_COUNT_MISMATCH');
  const observed = git(root, 'diff', '--name-only', GENESIS_BASE, GENESIS_HEAD).split(/\r?\n/).filter(Boolean).sort();
  assert(canonical(observed) === canonical([...manifest.expectedChangedPaths].sort()), 'GENESIS_CHANGED_PATH_SET_MISMATCH');
  return { baseHead: GENESIS_BASE, head: GENESIS_HEAD, tree: GENESIS_TREE, manifestBlob: MANIFEST_BLOB, changedPathCount: observed.length };
}
function descriptorFiles(root) {
  return fs.readdirSync(path.join(root, BASE))
    .filter(name => name.endsWith('.json'))
    .map(name => path.join(root, BASE, name))
    .filter(file => {
      try { return readJson(file).schema === 'AUTHORIZED_TOOLSET_DESCRIPTOR_v1'; } catch { return false; }
    });
}
function resolutionFixture(descriptor, index) {
  const properties = descriptor.canonicalInputSchema?.properties ?? {};
  const inputs = Object.fromEntries((descriptor.canonicalInputSchema?.required ?? []).map(name => [name, expectedValue(name, properties[name] ?? {}, index)]));
  return {
    request: {
      schema: 'AI_ROOM_EXECUTION_REQUEST_v1', requestId: `ACTIVE_CONFORMANCE_REQUEST_${index}`,
      descriptorId: descriptor.descriptorId, operationId: descriptor.operationId,
      admissionReceiptIdentity: 'SYNTHETIC_ACTIVE_CONFORMANCE_ADMISSION', routerReceiptIdentity: 'SYNTHETIC_ACTIVE_CONFORMANCE_ROUTE',
      inputs, availableCapabilities: {}, requestNonce: `${(index % 8) + 1}`.repeat(64)
    },
    admissionReceipt: {
      schema: 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1', result: 'ADMITTED_AND_LOCKED', operationId: descriptor.operationId,
      projectId: descriptor.projectId, operationStarted: true, workflowExecutionAuthorized: true,
      lock: { operationId: descriptor.operationId, state: 'ADMITTED_LOCKED', released: false, lockGeneration: 9000 + index }
    },
    routerReceipt: { schema: 'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v1', disposition: 'PASS', routes: [{ projectId: descriptor.projectId, disposition: 'PASS' }] }
  };
}
export function runConformance({ root, expectedHead, holder }) {
  const actualHead = git(root, 'rev-parse', 'HEAD^{commit}');
  assert(actualHead === expectedHead, 'EXACT_HEAD_MISMATCH', `${expectedHead}:${actualHead}`);
  assert(git(root, 'status', '--porcelain=v1', '--untracked-files=all') === '', 'DIRTY_WORKTREE');
  const genesis = validateGenesis(root);
  const registry = readJson(path.join(root, REGISTRY_PATH));
  assert(git(root, 'rev-parse', `${ACTIVATION_HEAD}:${REGISTRY_PATH}`) === ACTIVATION_REGISTRY_BLOB, 'ACTIVATION_REGISTRY_BLOB_MISMATCH');
  const activationRegistry = JSON.parse(git(root, 'show', `${ACTIVATION_HEAD}:${REGISTRY_PATH}`));
  assert(registry.schema === 'REPOSITORY_AUTHORIZED_TOOLSET_REGISTRY_v1', 'REGISTRY_SCHEMA_MISMATCH');
  assert(activationRegistry.schema === 'REPOSITORY_AUTHORIZED_TOOLSET_REGISTRY_v1', 'ACTIVATION_REGISTRY_SCHEMA_MISMATCH');
  assert(registry.status === 'ACTIVE_CERTIFIED', 'REGISTRY_NOT_ACTIVE');
  assert(registry.closedWorld === true && registry.arbitraryCommandAccepted === false && registry.movingToolingRefsAccepted === false, 'REGISTRY_NOT_FAIL_CLOSED');
  assert(registry.descriptorSelectionPolicy === 'EXACTLY_ONE_MATCH_OR_FAIL_CLOSED', 'SELECTION_POLICY_MISMATCH');
  assert(Array.isArray(registry.tools) && registry.tools.length > 0, 'REGISTRY_EMPTY');
  assert(Array.isArray(activationRegistry.tools) && activationRegistry.tools.length > 0, 'ACTIVATION_REGISTRY_EMPTY');
  unique(registry.tools.map(x => x.descriptorId), 'DUPLICATE_DESCRIPTOR_ID');
  unique(registry.tools.map(x => x.operationId), 'DUPLICATE_OPERATION_ID');
  unique(registry.tools.map(x => x.toolId), 'DUPLICATE_TOOL_ID');
  unique(activationRegistry.tools.map(x => x.descriptorId), 'DUPLICATE_ACTIVATION_DESCRIPTOR_ID');
  const files = descriptorFiles(root);
  const fileDescriptors = files.map(readJson);
  unique(fileDescriptors.map(x => x.descriptorId), 'DUPLICATE_DESCRIPTOR_FILE');
  for (const fileDescriptor of fileDescriptors) {
    const registered = registry.tools.find(x => x.descriptorId === fileDescriptor.descriptorId);
    assert(registered, 'STANDALONE_DESCRIPTOR_NOT_REGISTERED', fileDescriptor.descriptorId);
    assert(canonical(fileDescriptor) === canonical(registered), 'DESCRIPTOR_FILE_REGISTRY_MISMATCH', fileDescriptor.descriptorId);
  }
  const resolutions = [];
  registry.tools.forEach((descriptor, index) => {
    assert(descriptor.schema === 'AUTHORIZED_TOOLSET_DESCRIPTOR_v1', 'DESCRIPTOR_SCHEMA_MISMATCH', descriptor.descriptorId);
    assert(descriptor.descriptorActivationStatus === 'ACTIVE_CERTIFIED', 'DESCRIPTOR_NOT_ACTIVE', descriptor.descriptorId);
    assert(/^[0-9a-f]{40}$/.test(descriptor.exactToolingHead ?? ''), 'TOOLING_HEAD_NOT_IMMUTABLE', descriptor.descriptorId);
    git(root, 'cat-file', '-e', `${descriptor.exactToolingHead}^{commit}`);
    assert(descriptor.commandSpecification?.shell === false, 'SHELL_EXECUTION_PROHIBITION_MISSING', descriptor.descriptorId);
    assert(descriptor.commandSpecification?.extraArgumentsAllowed === false, 'EXTRA_ARGUMENTS_PROHIBITION_MISSING', descriptor.descriptorId);
    assert(descriptor.commandSpecification?.environmentOverridesAllowed === false, 'ENVIRONMENT_OVERRIDE_PROHIBITION_MISSING', descriptor.descriptorId);
    git(root, 'cat-file', '-e', `${descriptor.exactToolingHead}:${descriptor.commandSpecification.scriptPath}`);
    const standaloneDescriptor = fileDescriptors.find(x => x.descriptorId === descriptor.descriptorId);
    const activationDescriptor = activationRegistry.tools.find(x => x.descriptorId === descriptor.descriptorId);
    const provenance = standaloneDescriptor ? 'STANDALONE_ACTIVE_FILE' : activationDescriptor ? 'FROZEN_ACTIVATION_INLINE' : null;
    assert(provenance, 'ACTIVE_DESCRIPTOR_PROVENANCE_MISSING', descriptor.descriptorId);
    const provenanceDescriptor = standaloneDescriptor ?? activationDescriptor;
    assert(canonical(provenanceDescriptor) === canonical(descriptor), 'ACTIVE_DESCRIPTOR_PROVENANCE_MISMATCH', descriptor.descriptorId);
    const fixture = resolutionFixture(descriptor, index + 1);
    const receipt = resolveToolset({ ...fixture, registry, allowCandidate: false });
    assert(receipt.result === 'EXACTLY_ONE_AUTHORIZED_DESCRIPTOR_RESOLVED', 'DESCRIPTOR_RESOLUTION_FAILED', descriptor.descriptorId);
    assert(receipt.authorizationMode === 'EXACT_OPERATION_ID' && receipt.authorizedOperationId === descriptor.operationId, 'DIRECT_DESCRIPTOR_AUTHORIZATION_CHANGED', descriptor.descriptorId);
    resolutions.push({ descriptorId: descriptor.descriptorId, operationId: descriptor.operationId, projectId: descriptor.projectId, exactToolingHead: descriptor.exactToolingHead, descriptorDigest: receipt.descriptorDigest, provenance });
  });
  const first = registry.tools[0];
  const fixture = resolutionFixture(first, 7);
  const duplicateRegistry = structuredClone(registry); duplicateRegistry.tools.push(structuredClone(first));
  expectedFailure(() => resolveToolset({ ...fixture, registry: duplicateRegistry }), 'AUTHORIZED_TOOLSET_AMBIGUOUS');
  const movingRegistry = structuredClone(registry); movingRegistry.tools[0].exactToolingHead = 'main';
  expectedFailure(() => resolveToolset({ ...fixture, registry: movingRegistry }), 'TOOLING_HEAD_NOT_IMMUTABLE');
  const shellRegistry = structuredClone(registry); shellRegistry.tools[0].commandSpecification.shell = true;
  expectedFailure(() => resolveToolset({ ...fixture, registry: shellRegistry }), 'SHELL_EXECUTION_PROHIBITED');
  const unknown = structuredClone(fixture); unknown.request.descriptorId = 'UNKNOWN_DESCRIPTOR';
  expectedFailure(() => resolveToolset({ ...unknown, registry }), 'AUTHORIZED_TOOLSET_NOT_FOUND');

  const successorCompatibility = runSuccessorCompatibilitySelfTest();
  assert(successorCompatibility.result === 'PASS_CLOSED_LOCAL_SUCCESSOR_COMPATIBILITY', 'SUCCESSOR_COMPATIBILITY_SELF_TEST_FAILED');
  assert(successorCompatibility.positiveFixturesPassed === successorCompatibility.positiveFixtureCount, 'SUCCESSOR_POSITIVE_FIXTURE_MISMATCH');
  assert(successorCompatibility.negativeFixturesPassed === successorCompatibility.negativeFixtureCount, 'SUCCESSOR_NEGATIVE_FIXTURE_MISMATCH');
  assert(successorCompatibility.directPathPreserved === true && successorCompatibility.fixedDescriptorPreserved === true && successorCompatibility.fixedCommandPreserved === true && successorCompatibility.exactToolingHeadPreserved === true, 'SUCCESSOR_COMPATIBILITY_CHANGED_CLOSED_WORLD_COMMAND');
  assert(successorCompatibility.genericCommandAuthorityCreated === false && successorCompatibility.wildcardDescriptorAuthorityCreated === false && successorCompatibility.arbitrarySuccessorAuthorityCreated === false, 'SUCCESSOR_COMPATIBILITY_BROADENED_AUTHORITY');

  const standaloneDescriptorFileCount = resolutions.filter(x => x.provenance === 'STANDALONE_ACTIVE_FILE').length;
  const frozenActivationInlineDescriptorCount = resolutions.filter(x => x.provenance === 'FROZEN_ACTIVATION_INLINE').length;
  const payload = stable({
    schema: 'ACTIVE_TOOLSET_TRANSPORT_CONFORMANCE_FINGERPRINT_v1', expectedHead, genesis,
    activationHead: ACTIVATION_HEAD, activationRegistryBlob: ACTIVATION_REGISTRY_BLOB,
    registryDigest: sha256(canonical(registry)), activationRegistryDigest: sha256(canonical(activationRegistry)),
    standaloneDescriptorFileCount, frozenActivationInlineDescriptorCount, resolutions,
    negativeTests: ['DUPLICATE_DESCRIPTOR', 'MOVING_REF', 'SHELL', 'UNKNOWN_DESCRIPTOR'],
    successorCompatibility: {
      result: successorCompatibility.result,
      positiveFixtureCount: successorCompatibility.positiveFixtureCount,
      negativeFixtureCount: successorCompatibility.negativeFixtureCount,
      packageFingerprint: successorCompatibility.packageFingerprint
    }
  });
  return stable({
    schema: 'ACTIVE_TOOLSET_TRANSPORT_CONFORMANCE_RECEIPT_v1', result: 'PASS_CLOSED_ACTIVE_CONFORMANCE', executionHolder: holder,
    expectedHead, genesis, activationHead: ACTIVATION_HEAD, activationRegistryBlob: ACTIVATION_REGISTRY_BLOB,
    registryStatus: registry.status, closedWorld: registry.closedWorld, descriptorCount: registry.tools.length,
    descriptorFileCount: files.length, standaloneDescriptorFileCount, frozenActivationInlineDescriptorCount,
    descriptorsResolved: resolutions.length, resolutionReceipts: resolutions,
    negativeFixtureCount: 4, negativeFixturesPassed: 4,
    successorCompatibilityPassed: true,
    successorCompatibilityPositiveFixtureCount: successorCompatibility.positiveFixtureCount,
    successorCompatibilityPositiveFixturesPassed: successorCompatibility.positiveFixturesPassed,
    successorCompatibilityNegativeFixtureCount: successorCompatibility.negativeFixtureCount,
    successorCompatibilityNegativeFixturesPassed: successorCompatibility.negativeFixturesPassed,
    successorCompatibilityFingerprint: successorCompatibility.packageFingerprint,
    packageFingerprint: sha256(canonical(payload)),
    productMutationPerformed: false, roleActivationPerformed: false, methodsAuditExecuted: false, hEarthRepairPerformed: false,
    pr570Mutated: false, mergePerformed: false, repairPerformed: false
  });
}
function main() {
  const args = parseArgs(process.argv.slice(2));
  try {
    const receipt = runConformance({ root: path.resolve(args.root), expectedHead: args['expected-head'], holder: args.holder });
    fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
    fs.writeFileSync(path.resolve(args.output), `${JSON.stringify(receipt, null, 2)}\n`);
  } catch (error) {
    const receipt = stable({ schema: 'ACTIVE_TOOLSET_TRANSPORT_CONFORMANCE_RECEIPT_v1', result: 'FAIL_CLOSED', errorCode: error.code ?? error.message, detail: error.detail ?? null, productMutationPerformed: false, mergePerformed: false, repairPerformed: false });
    fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
    fs.writeFileSync(path.resolve(args.output), `${JSON.stringify(receipt, null, 2)}\n`);
    process.stderr.write(`${JSON.stringify(receipt, null, 2)}\n`); process.exitCode = 1;
  }
}
const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();
