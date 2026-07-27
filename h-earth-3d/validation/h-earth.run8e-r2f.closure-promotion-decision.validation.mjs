import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  H_EARTH_RUN_8E_R2_CONTROL,
  evaluateHEarthRun8ER2Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js';
import {
  H_EARTH_RUN_8E_R2F_CONTROL,
  evaluateHEarthRun8ER2FControl
} from '../control-plane/run-8/recovery/h-earth.run8e-r2f.closure-promotion-decision.js';
import {
  H_EARTH_RUN_8E_R2F_PATHS
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r2f-closure-promotion-scope.js';
import {
  loadHEarthRepositoryRegistryValidatorDependencies
} from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const repositoryRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const outputDirectory = process.env.H_EARTH_RUN8E_R2F_OUTPUT || '/tmp/h-earth-run8e-r2f';
fs.mkdirSync(outputDirectory, { recursive: true });

const readJson = (repositoryPath) =>
  JSON.parse(fs.readFileSync(path.join(repositoryRoot, repositoryPath.replace(/^\//, '')), 'utf8'));
const git = (...args) => execFileSync('git', args, { cwd: repositoryRoot, encoding: 'utf8' }).trim();
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const issue = (issues, code, condition) => { if (!condition) issues.push(code); };

const BASE_HEAD = '096bfbaf45b8987041600385ae16646b00137b9b';
const BASE_BRANCH = 'origin/agent/h-earth-run8e-r2e-registry-execution-custody-001';
const EXPECTED_PROTECTED = Object.freeze({
  'showroom/globe/h-earth/render/live-render-package.run8e-r2.js':
    '1699654f39c9e183f4cfc6f75b20ba051641b763',
  'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js':
    '785856d7702a0e855c2672e6b8a7325ad5b3ba50'
});
const RECEIPTS = Object.freeze([
  ['RUN_8E_R2A', 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json', 'RUN_8E_R2A_PASS_CLOSED'],
  ['RUN_8E_R2B', 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json', 'RUN_8E_R2B_PASS_CLOSED'],
  ['RUN_8E_R2C', 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.pass-closed.receipt.json', 'RUN_8E_R2C_PASS_CLOSED'],
  ['RUN_8E_R2D', 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json', 'RUN_8E_R2D_PASS_CLOSED'],
  ['RUN_8E_R2E', 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json', 'RUN_8E_R2E_PASS_CLOSED']
]);
const EXPECTED_SCOPE = Object.freeze([
  '.github/workflows/h-earth-run8e-r2f-closure-promotion-decision.yml',
  'h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js',
  'h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2f.closure-promotion-decision.js',
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2f-closure-promotion-scope.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  'h-earth-3d/validation/h-earth.run8e-r2f.closure-promotion-decision.validation.mjs',
  'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.promotion-decision.json',
  'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.pass-closed.receipt.json'
]);

const issues = [];
const parentEvaluation = evaluateHEarthRun8ER2Control(H_EARTH_RUN_8E_R2_CONTROL);
const childEvaluation = evaluateHEarthRun8ER2FControl(H_EARTH_RUN_8E_R2F_CONTROL);
issue(issues, `PARENT_CONTROL:${parentEvaluation.issues.join(',')}`, parentEvaluation.eligible === true);
issue(issues, `R2F_CONTROL:${childEvaluation.issues.join(',')}`, childEvaluation.eligible === true);

const mergeBase = git('merge-base', 'HEAD', BASE_BRANCH);
issue(issues, 'R2F_BASE_MERGE_BASE_MISMATCH', mergeBase === BASE_HEAD);

const decisionPath = 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.promotion-decision.json';
const decision = readJson(decisionPath);
issue(issues, 'R2F_DECISION_ID_MISMATCH',
  decision.decisionId === 'H_EARTH_RUN_8E_R2F_CLOSURE_AND_PROMOTION_DECISION_v1');
issue(issues, 'R2F_DECISION_BASE_HEAD_MISMATCH', decision.baseExactHead === BASE_HEAD);
issue(issues, 'R2F_DECISION_STACK_LENGTH_INVALID', decision.controllingStack?.length === 5);
for (let index = 1; index < (decision.controllingStack?.length ?? 0); index += 1) {
  issue(issues, `R2F_DECISION_STACK_CHAIN_BREAK_${index}`,
    decision.controllingStack[index - 1].finalHead === decision.controllingStack[index].baseHead);
}
issue(issues, 'R2F_SUPERSEDED_PR_NOT_CLOSED',
  decision.supersededOccurrences?.[0]?.pullRequest === 223 &&
  decision.supersededOccurrences?.[0]?.state === 'CLOSED_UNMERGED');
issue(issues, 'R2F_MAIN_PROMOTION_MUST_REMAIN_UNEXECUTED',
  decision.promotionDecision?.mainBranchPromotion === 'NOT_EXECUTED');
issue(issues, 'R2F_RUN8E_MUST_REMAIN_FAIL_OPEN',
  decision.checkpointDisposition?.run8E === 'FAIL_OPEN');
issue(issues, 'R2F_STOPPING_BOUNDARY_MISMATCH',
  decision.stoppingBoundary === 'STOP_BEFORE_RUN_8E_R3');

const receiptAudit = RECEIPTS.map(([checkpoint, receiptPath, status]) => {
  const receipt = readJson(receiptPath);
  const blobSha = git('hash-object', receiptPath);
  issue(issues, `${checkpoint}_RECEIPT_STATUS_MISMATCH`, receipt.status === status);
  issue(issues, `${checkpoint}_RECEIPT_NOT_ELIGIBLE`, receipt.eligible === true);
  return { checkpoint, path: `/${receiptPath}`, status: receipt.status, gitBlobSha: blobSha };
});

const protectedAudit = Object.entries(EXPECTED_PROTECTED).map(([repositoryPath, expectedGitBlobSha]) => {
  const actualGitBlobSha = git('hash-object', repositoryPath);
  issue(issues, `PROTECTED_IDENTITY_MISMATCH:${repositoryPath}`, actualGitBlobSha === expectedGitBlobSha);
  return { path: `/${repositoryPath}`, expectedGitBlobSha, actualGitBlobSha };
});

const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();
issue(issues, 'REGISTRY_LOADER_IDENTITY_FAILED', dependencies.identityVerified === true);
const registryResolution = H_EARTH_RUN_8E_R2F_PATHS.map((repositoryPath) => {
  const resolution = dependencies.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  issue(issues, `R2F_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`, resolution.resolved === true);
  return {
    repositoryPath,
    resolved: resolution.resolved === true,
    nodeIds: (resolution.nodes ?? []).map((node) => node.nodeId).sort()
  };
});

const changedPaths = git('diff', '--name-only', `${BASE_HEAD}...HEAD`)
  .split(/\r?\n/).filter(Boolean).sort();
const unexpectedPaths = changedPaths.filter((entry) => !EXPECTED_SCOPE.includes(entry));
const requiredCorePaths = EXPECTED_SCOPE.filter((entry) =>
  !entry.endsWith('h-earth.run8e-r2f.pass-closed.receipt.json'));
const missingCorePaths = requiredCorePaths.filter((entry) => !changedPaths.includes(entry));
issue(issues, `R2F_UNEXPECTED_PATHS:${unexpectedPaths.join(',')}`, unexpectedPaths.length === 0);
issue(issues, `R2F_REQUIRED_CORE_PATHS_MISSING:${missingCorePaths.join(',')}`, missingCorePaths.length === 0);
issue(issues, 'R2F_SCOPE_COUNT_INVALID', changedPaths.length === 7 || changedPaths.length === 8);

const forbiddenTokens = [
  'showroom/globe/h-earth/index.html',
  'showroom/globe/h-earth/index.js',
  'renderer.functional-landscape.js',
  'run8e-r3',
  'run-8e-r3'
];
const forbiddenPaths = changedPaths.filter((entry) =>
  forbiddenTokens.some((token) => entry.toLowerCase().includes(token.toLowerCase())));
issue(issues, `R2F_FORBIDDEN_PATHS:${forbiddenPaths.join(',')}`, forbiddenPaths.length === 0);

const manifest = {
  contractId: 'H_EARTH_RUN_8E_R2F_CLOSURE_MANIFEST_v1',
  baseExactHead: BASE_HEAD,
  currentHead: git('rev-parse', 'HEAD'),
  controllingStack: decision.controllingStack,
  receiptAudit,
  protectedAudit,
  registryResolution,
  changedPaths,
  boundaries: {
    mainMergeExecuted: false,
    deploymentExecuted: false,
    publicRouteMutation: false,
    visibleRendererCreated: false,
    run8ER3Started: false,
    run8EPassClosed: false
  }
};
const closureManifestDigest = sha256(JSON.stringify(manifest));
const result = {
  receiptType: 'H_EARTH_RUN_8E_R2F_CLOSURE_AUDIT_EXECUTION_RECEIPT',
  eligible: issues.length === 0,
  status: issues.length === 0
    ? (fs.existsSync(path.join(repositoryRoot,
        'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2f.pass-closed.receipt.json'))
        ? 'RUN_8E_R2F_FINAL_EXACT_HEAD_PASS'
        : 'RUN_8E_R2F_CORE_EXECUTION_PASS')
    : 'RUN_8E_R2F_FAIL_OPEN',
  baseExactHead: BASE_HEAD,
  currentHead: git('rev-parse', 'HEAD'),
  parentControl: parentEvaluation,
  r2fControl: childEvaluation,
  decisionStatus: decision.status,
  receiptAudit,
  protectedAudit,
  registry: {
    identityVerified: dependencies.identityVerified,
    pathCount: H_EARTH_RUN_8E_R2F_PATHS.length,
    resolutions: registryResolution,
    unresolvedPathCount: registryResolution.filter((entry) => !entry.resolved).length
  },
  scope: {
    expectedPathCount: EXPECTED_SCOPE.length,
    changedPathCount: changedPaths.length,
    changedPaths,
    unexpectedPaths,
    missingCorePaths,
    forbiddenPaths
  },
  closureManifestDigest,
  promotionDecision: {
    r2ConstructionClosureEligible: true,
    promotionToR3InputEligible: true,
    mainBranchPromotion: 'NOT_EXECUTED',
    deployment: 'NOT_EXECUTED'
  },
  stoppingBoundary: 'STOP_BEFORE_RUN_8E_R3',
  issues
};

fs.writeFileSync(
  path.join(outputDirectory, 'h-earth.run8e-r2f.closure-audit.execution.receipt.json'),
  `${JSON.stringify(result, null, 2)}\n`,
  'utf8'
);
fs.writeFileSync(
  path.join(outputDirectory, 'h-earth.run8e-r2f.closure-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8'
);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (issues.length > 0) process.exitCode = 1;
