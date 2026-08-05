#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';

const ROUTER_PATH = '.github/ai-router/router.v1.json';
const PATH_SET_PATH = '.github/ai-router/repairs/cp9r-router-ownership/frozen-operation-a-paths.v1.json';
const CONTRACT_PATH = '.github/ai-router/repairs/cp9r-router-ownership/contract.v1.json';
const MANIFEST_PATH = '.github/ai-router/repairs/cp9r-router-ownership/changed-path-manifest.v1.json';
const ROUTER_CLI = 'tools/repository-ai-entry-router.mjs';

function parseArgs(argv) {
  const args = { executionHolder: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--execution-holder') args.executionHolder = argv[++i] ?? null;
    else if (token === '--output') args.output = argv[++i] ?? null;
    else throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  }
  if (!args.executionHolder || !/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(args.executionHolder)) {
    throw new Error('INVALID_EXECUTION_HOLDER');
  }
  if (!args.output) throw new Error('OUTPUT_REQUIRED');
  return args;
}

const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
    : value;
const canonical = (value) => JSON.stringify(stable(value));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const clone = (value) => JSON.parse(JSON.stringify(value));

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(relativePath, 'utf8'));
}

function route(filePath, expectedExit) {
  const output = path.join(
    process.env.RUNNER_TEMP || os.tmpdir(),
    `cp9r-route-${sha256(filePath).slice(0, 16)}-${process.pid}.json`
  );
  const result = spawnSync(process.execPath, [
    ROUTER_CLI,
    '--mutation-intent',
    '--path', filePath,
    '--task', 'CP9R exact router ownership verification',
    '--output', output
  ], { encoding: 'utf8' });
  assert(result.status === expectedExit, `ROUTER_EXIT_MISMATCH:${filePath}:${result.status}:${result.stderr || result.stdout}`);
  assert(fs.existsSync(output), `ROUTER_RECEIPT_MISSING:${filePath}`);
  return readJson(output);
}

const args = parseArgs(process.argv.slice(2));
const manifest = readJson(MANIFEST_PATH);
const frozen = readJson(PATH_SET_PATH);
const contract = readJson(CONTRACT_PATH);
const router = readJson(ROUTER_PATH);

assert(manifest.baseHead === contract.governingMainHead, 'BASE_HEAD_CONTRACT_MISMATCH');
assert(manifest.authorityIssue === 580 && contract.authorityIssue === 580 && frozen.authorityIssue === 580, 'AUTHORITY_ISSUE_MISMATCH');
assert(frozen.exactPathCount === 22, 'FROZEN_PATH_COUNT_MISMATCH');
assert(frozen.exactPaths.length === 22, 'FROZEN_PATH_ARRAY_COUNT_MISMATCH');
assert(new Set(frozen.exactPaths).size === 22, 'FROZEN_PATH_DUPLICATE');
assert(frozen.ownershipClass === 'EXACT_PATHS_ONLY', 'OWNERSHIP_CLASS_MISMATCH');
assert(frozen.prefixOwnershipCreated === false, 'PREFIX_OWNERSHIP_PROHIBITED');

const actualChangedPaths = execFileSync('git', ['diff', '--name-only', `${manifest.baseHead}...HEAD`], { encoding: 'utf8' })
  .trim().split(/\r?\n/).filter(Boolean).sort();
const expectedChangedPaths = [...manifest.expectedChangedPaths].sort();
assert(canonical(actualChangedPaths) === canonical(expectedChangedPaths), `CHANGED_PATH_SCOPE_MISMATCH:${canonical({ expectedChangedPaths, actualChangedPaths })}`);
assert(actualChangedPaths.length === manifest.expectedChangedPathCount, 'CHANGED_PATH_COUNT_MISMATCH');
assert(!actualChangedPaths.some((entry) => frozen.exactPaths.includes(entry)), 'TOOLSET_REGISTRATION_PATH_MUTATED');

const baseRouter = JSON.parse(execFileSync('git', ['show', `${manifest.baseHead}:${ROUTER_PATH}`], { encoding: 'utf8' }));
assert(baseRouter.routerId === router.routerId, 'ROUTER_ID_CHANGED');
assert(router.status === 'ACTIVE_FAIL_CLOSED', 'ROUTER_STATUS_CHANGED');
assert(router.unregisteredPathPolicy.mutationDisposition === 'BLOCK', 'UNREGISTERED_MUTATION_BLOCK_WEAKENED');
assert(router.unregisteredPathPolicy.reason === 'NO_REGISTERED_PROJECT_AUTHORITY', 'UNREGISTERED_REASON_CHANGED');
assert(router.ambiguityPolicy.disposition === 'STOP', 'AMBIGUITY_DISPOSITION_CHANGED');
assert(router.ambiguityPolicy.reason === 'MULTIPLE_EQUAL_PRIORITY_PROJECT_ROUTES', 'AMBIGUITY_REASON_CHANGED');
assert(canonical(router.routerInfrastructure) === canonical(baseRouter.routerInfrastructure), 'ROUTER_INFRASTRUCTURE_OWNERSHIP_CHANGED');

const baseHEarth = baseRouter.projects.find((project) => project.projectId === 'H_EARTH');
const currentHEarth = router.projects.find((project) => project.projectId === 'H_EARTH');
assert(baseHEarth && currentHEarth, 'H_EARTH_PROJECT_MISSING');
assert(canonical(currentHEarth.ownedPathPrefixes) === canonical(baseHEarth.ownedPathPrefixes), 'H_EARTH_PREFIX_OWNERSHIP_CHANGED');
assert(canonical(currentHEarth.ownedExactPaths) === canonical([...baseHEarth.ownedExactPaths, ...frozen.exactPaths]), 'H_EARTH_EXACT_PATH_ADDITION_MISMATCH');

const normalizedRouter = clone(router);
const normalizedHEarth = normalizedRouter.projects.find((project) => project.projectId === 'H_EARTH');
normalizedHEarth.ownedExactPaths = [...baseHEarth.ownedExactPaths];
assert(canonical(normalizedRouter) === canonical(baseRouter), 'UNAUTHORIZED_ROUTER_FIELD_CHANGED');

const broadForbidden = ['.github/', '.github/ai-toolset-transport/', 'tools/', 'tools/h-earth-registry-two-path-toolset/'];
assert(!currentHEarth.ownedPathPrefixes.some((prefix) => broadForbidden.includes(prefix)), 'BROAD_PREFIX_OWNERSHIP_GRANTED');

const selfTestOutput = path.join(process.env.RUNNER_TEMP || os.tmpdir(), `cp9r-router-self-test-${process.pid}.json`);
const selfTest = spawnSync(process.execPath, [ROUTER_CLI, '--self-test', '--output', selfTestOutput], { encoding: 'utf8' });
assert(selfTest.status === 0, `EXISTING_ROUTER_SELF_TEST_FAILED:${selfTest.stderr || selfTest.stdout}`);
const selfTestReceipt = readJson(selfTestOutput);
assert(selfTestReceipt.result === 'PASS', 'EXISTING_ROUTER_SELF_TEST_NOT_PASS');

const positiveResults = frozen.exactPaths.map((filePath) => {
  const receipt = route(filePath, 0);
  assert(receipt.schema === 'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v1', `POSITIVE_SCHEMA_MISMATCH:${filePath}`);
  assert(receipt.disposition === 'PASS', `POSITIVE_DISPOSITION_MISMATCH:${filePath}`);
  assert(receipt.routes.length === 1, `POSITIVE_ROUTE_COUNT_MISMATCH:${filePath}`);
  const selected = receipt.routes[0];
  assert(selected.routeClass === 'REGISTERED_PROJECT', `POSITIVE_ROUTE_CLASS_MISMATCH:${filePath}`);
  assert(selected.projectId === 'H_EARTH', `POSITIVE_PROJECT_MISMATCH:${filePath}`);
  assert(selected.disposition === 'PASS', `POSITIVE_ROUTE_DISPOSITION_MISMATCH:${filePath}`);
  return { filePath, routeClass: selected.routeClass, projectId: selected.projectId, disposition: selected.disposition };
});

const negativeResults = contract.negativePaths.map((filePath) => {
  const receipt = route(filePath, 1);
  assert(receipt.schema === 'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v1', `NEGATIVE_SCHEMA_MISMATCH:${filePath}`);
  assert(receipt.disposition === 'BLOCK', `NEGATIVE_DISPOSITION_MISMATCH:${filePath}`);
  assert(receipt.reasonCodes.includes('NO_REGISTERED_PROJECT_AUTHORITY'), `NEGATIVE_REASON_MISMATCH:${filePath}`);
  assert(receipt.routes.length === 1, `NEGATIVE_ROUTE_COUNT_MISMATCH:${filePath}`);
  const selected = receipt.routes[0];
  assert(selected.routeClass === 'UNREGISTERED', `NEGATIVE_ROUTE_CLASS_MISMATCH:${filePath}`);
  assert(selected.projectId === null, `NEGATIVE_PROJECT_NOT_NULL:${filePath}`);
  assert(selected.disposition === 'BLOCK', `NEGATIVE_ROUTE_DISPOSITION_MISMATCH:${filePath}`);
  return { filePath, routeClass: selected.routeClass, projectId: selected.projectId, disposition: selected.disposition };
});

const candidateHead = execFileSync('git', ['rev-parse', 'HEAD^{commit}'], { encoding: 'utf8' }).trim();
const packageFingerprint = sha256(canonical({
  router,
  frozen,
  contract,
  manifest,
  positiveResults,
  negativeResults
}));

const receipt = stable({
  schema: 'CP9_ROUTER_OWNERSHIP_REPAIR_VERIFICATION_RECEIPT_v1',
  operation: 'CP9R6_THROUGH_CP9R8_EXACT_ROUTER_OWNERSHIP_REPAIR_v1',
  result: 'PASS_CLOSED_ROUTER_OWNERSHIP_CANDIDATE',
  authorityIssue: 580,
  executionHolder: args.executionHolder,
  baseHead: manifest.baseHead,
  candidateHead,
  routerId: router.routerId,
  routerStatus: router.status,
  exactOwnedPathCount: frozen.exactPathCount,
  exactOwnedPaths: frozen.exactPaths,
  positiveRouteCount: positiveResults.length,
  positiveRoutesPassed: true,
  negativeRouteCount: negativeResults.length,
  negativeRoutesPassed: true,
  existingRouterSelfTestResult: selfTestReceipt.result,
  existingRouterSelfTestScenarioCount: selfTestReceipt.scenarioCount,
  unregisteredMutationDisposition: router.unregisteredPathPolicy.mutationDisposition,
  ambiguityDisposition: router.ambiguityPolicy.disposition,
  routerInfrastructureOwnershipChanged: false,
  hEarthPrefixOwnershipChanged: false,
  broadPrefixOwnershipGranted: false,
  toolsetRegistered: false,
  cp9Retried: false,
  mergePerformed: false,
  pr570Mutated: false,
  packageFingerprint
});
fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
fs.writeFileSync(path.resolve(args.output), `${JSON.stringify(receipt, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
