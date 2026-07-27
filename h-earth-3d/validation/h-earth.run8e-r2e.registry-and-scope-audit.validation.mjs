import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  H_EARTH_RUN_8E_R2_CONTROL,
  evaluateHEarthRun8ER2Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js';
import {
  H_EARTH_RUN_8E_R2E_CONTROL,
  evaluateHEarthRun8ER2EControl
} from '../control-plane/run-8/recovery/h-earth.run8e-r2e.registry-and-scope-audit.js';
import registryFacade, {
  H_EARTH_RUN_8E_R2_GOVERNED_PATHS,
  H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE,
  H_EARTH_RUN_8E_R2_PACKAGE_NODE
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r2-package-scope.js';
import loadHEarthRepositoryRegistryValidatorDependencies from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const REPOSITORY_BASE = 'a660d54b0df30e768b95e2314b918d0f263883ed';
const R2D_HEAD = '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9';
const OUTPUT = process.env.H_EARTH_RUN8E_R2E_OUTPUT ?? '/tmp/h-earth-run8e-r2e';
const normalize = (value) => `/${String(value).replace(/^\/+/, '')}`;
const command = (...args) => execFileSync(args[0], args.slice(1), { encoding: 'utf8' }).trim();
const sha256 = (buffer) => `sha256:${crypto.createHash('sha256').update(buffer).digest('hex')}`;
const exactSet = (left, right) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

fs.mkdirSync(OUTPUT, { recursive: true });

const childControl = evaluateHEarthRun8ER2EControl(H_EARTH_RUN_8E_R2E_CONTROL);
assert.equal(childControl.eligible, true, `R2E_CHILD_CONTROL:${childControl.issues.join(',')}`);
assert.equal(childControl.status, 'RUN_8E_R2E_CONTROL_PASS_CLOSED');
const parentControl = evaluateHEarthRun8ER2Control(H_EARTH_RUN_8E_R2_CONTROL);
assert.equal(parentControl.eligible, true, `R2E_PARENT_CONTROL:${parentControl.issues.join(',')}`);
assert.equal(parentControl.status, 'RUN_8E_R2E_CONTROL_PASS_CLOSED');
assert.equal(command('git', 'merge-base', 'HEAD', 'origin/agent/h-earth-run8e-r2d-gpu-resource-lifecycle-001'), R2D_HEAD);

const expectedPaths = [...H_EARTH_RUN_8E_R2_GOVERNED_PATHS].sort();
assert.equal(expectedPaths.length, 28, 'R2E_REGISTERED_PATH_COUNT_INVALID');
assert.equal(new Set(expectedPaths).size, expectedPaths.length, 'R2E_REGISTERED_PATH_DUPLICATE');

const changedPaths = command('git', 'diff', '--name-only', `${REPOSITORY_BASE}...HEAD`)
  .split('\n')
  .filter(Boolean)
  .map(normalize)
  .filter((repositoryPath) =>
    repositoryPath.startsWith('/h-earth-3d/') || repositoryPath.startsWith('/showroom/globe/h-earth/'))
  .sort();
assert.equal(exactSet(changedPaths, expectedPaths), true,
  `R2E_GIT_REGISTRY_SCOPE_MISMATCH:${JSON.stringify({ changedPaths, expectedPaths })}`);

const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
assert.equal(registryInstance.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId), true,
  'R2E_NODE_NOT_REGISTERED');
assert.equal(registryInstance.evidenceRecords.some((entry) =>
  entry.evidenceId === H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE.evidenceId), true,
  'R2E_EVIDENCE_NOT_REGISTERED');
assert.equal(H_EARTH_RUN_8E_R2_PACKAGE_NODE.lifecycleStatus, 'R2E_PASS_CLOSED');
assert.equal(H_EARTH_RUN_8E_R2_PACKAGE_NODE.authorityPosture,
  'R2E_PASS_CLOSED_R2F_NOT_STARTED_RUN8E_FAIL_OPEN');
assert.equal(H_EARTH_RUN_8E_R2_PACKAGE_NODE.unresolvedFields.length, 0);

const loader = loadHEarthRepositoryRegistryValidatorDependencies();
assert.equal(loader.identityVerified, true, 'R2E_LOADER_IDENTITY_NOT_VERIFIED');
assert.equal(loader.registryInstance.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId), true,
  'R2E_OVERLAY_NOT_ACTIVE_IN_LOADER');

const pathRecords = [];
for (const repositoryPath of expectedPaths) {
  const localPath = repositoryPath.slice(1);
  assert.equal(fs.existsSync(localPath), true, `R2E_REGISTERED_PATH_MISSING:${repositoryPath}`);
  assert.equal(fs.statSync(localPath).isFile(), true, `R2E_REGISTERED_PATH_NOT_FILE:${repositoryPath}`);
  const direct = registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  const loaded = loader.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert.equal(direct.resolved, true, `R2E_DIRECT_PATH_UNRESOLVED:${repositoryPath}`);
  assert.equal(loaded.resolved, true, `R2E_LOADER_PATH_UNRESOLVED:${repositoryPath}`);
  assert.equal(direct.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId), true,
    `R2E_DIRECT_NODE_MISSING:${repositoryPath}`);
  assert.equal(loaded.nodes.some((node) => node.nodeId === H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId), true,
    `R2E_LOADER_NODE_MISSING:${repositoryPath}`);
  const bytes = fs.readFileSync(localPath);
  pathRecords.push({
    repositoryPath,
    gitBlobSha: command('git', 'hash-object', localPath),
    contentSha256: sha256(bytes),
    byteCount: bytes.length,
    directRegistryResolved: true,
    loaderResolved: true
  });
}

const receiptFiles = {
  r2a: 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json',
  r2b: 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json',
  r2c: 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.pass-closed.receipt.json',
  r2d: 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json',
  r2e: 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json'
};
const receipts = Object.fromEntries(Object.entries(receiptFiles).map(([key, file]) =>
  [key, JSON.parse(fs.readFileSync(file, 'utf8'))]));
assert.equal(receipts.r2a.status, 'RUN_8E_R2A_PASS_CLOSED');
assert.equal(receipts.r2b.status, 'RUN_8E_R2B_PASS_CLOSED');
assert.equal(receipts.r2c.status, 'RUN_8E_R2C_PASS_CLOSED');
assert.equal(receipts.r2d.status, 'RUN_8E_R2D_PASS_CLOSED');
assert.equal(receipts.r2e.status, 'RUN_8E_R2E_PASS_CLOSED');
assert.equal(receipts.r2e.execution.runId, 30276376269);
assert.equal(receipts.r2e.execution.jobId, 90011388187);
assert.equal(receipts.r2e.automaticRegistryPreflight.runId, 30276376061);
assert.equal(receipts.r2e.automaticRegistryPreflight.jobId, 90011387581);
assert.equal(receipts.r2e.registry.cumulativeGovernedPathCount, 28);
assert.equal(receipts.r2e.registry.gitRegistryLoaderSetEquality, true);
assert.equal(receipts.r2e.boundaries.run8ER2FStarted, false);
assert.equal(receipts.r2e.checkpointDisposition.run8ER2, 'OPEN_AT_R2F_BOUNDARY');

const manifestInput = pathRecords.map(({ repositoryPath, gitBlobSha, contentSha256, byteCount }) => ({
  repositoryPath, gitBlobSha, contentSha256, byteCount
}));
const manifestDigest = sha256(Buffer.from(JSON.stringify(manifestInput)));
const totalByteCount = pathRecords.reduce((sum, record) => sum + record.byteCount, 0);
const head = command('git', 'rev-parse', 'HEAD');
const auditReceipt = {
  receiptType: 'H_EARTH_RUN_8E_R2E_FINAL_EXACT_HEAD_REGISTRY_AND_SCOPE_AUDIT_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R2E_FINAL_EXACT_HEAD_AUDIT_PASS',
  generatedAt: new Date().toISOString(),
  finalExactHead: head,
  predecessorR2DHead: R2D_HEAD,
  repositoryBase: REPOSITORY_BASE,
  registryNodeId: H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId,
  registryEvidenceId: H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE.evidenceId,
  cumulativeGovernedPathCount: expectedPaths.length,
  gitScopePathCount: changedPaths.length,
  registryScopePathCount: expectedPaths.length,
  loaderResolvedPathCount: pathRecords.filter((record) => record.loaderResolved).length,
  gitRegistryLoaderSetEquality: true,
  allPathsExist: true,
  allPathsFetchbackHashed: true,
  pathRecords,
  finalCumulativeManifestDigest: manifestDigest,
  finalCumulativeByteCount: totalByteCount,
  initialExecutionEvidence: {
    head: receipts.r2e.execution.head,
    runId: receipts.r2e.execution.runId,
    jobId: receipts.r2e.execution.jobId,
    artifactId: receipts.r2e.executionArtifact.artifactId,
    artifactDigest: receipts.r2e.executionArtifact.artifactDigest,
    initialManifestDigest: receipts.r2e.registry.cumulativeManifestDigestAtExecutionHead
  },
  automaticRegistryPreflight: {
    conclusion: 'PASS',
    runId: receipts.r2e.automaticRegistryPreflight.runId,
    jobId: receipts.r2e.automaticRegistryPreflight.jobId,
    artifactId: receipts.r2e.automaticRegistryPreflight.artifactId,
    artifactDigest: receipts.r2e.automaticRegistryPreflight.artifactDigest
  },
  boundaries: {
    productOrRuntimeAuthorityMutation: false,
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    publicRouteMutation: false,
    cameraNavigationOrGestureMutation: false,
    shaderDrawOrRenderLoopCreated: false,
    deploymentPerformed: false,
    run8ER2FStarted: false,
    run8ER3Started: false,
    run8EPassClosed: false
  },
  stoppingBoundary: 'STOP_BEFORE_RUN_8E_R2F_CLOSURE_AND_PROMOTION_DECISION',
  issues: []
};

fs.writeFileSync(path.join(OUTPUT, 'h-earth.run8e-r2e.final-exact-head-audit.receipt.json'),
  `${JSON.stringify(auditReceipt, null, 2)}\n`);
fs.writeFileSync(path.join(OUTPUT, 'h-earth.run8e-r2e.final-cumulative-path-manifest.json'),
  `${JSON.stringify({ manifestDigest, pathRecords }, null, 2)}\n`);
console.log(JSON.stringify(auditReceipt, null, 2));
