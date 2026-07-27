import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  H_EARTH_RUN_8E_R2E_CONTROL,
  evaluateHEarthRun8ER2EControl
} from '../control-plane/run-8/recovery/h-earth.run8e-r2e.registry-custody-and-scope-audit.js';
import registryFacade, {
  H_EARTH_RUN_8E_R2_ALL_PATHS,
  H_EARTH_RUN_8E_R2_PACKAGE_NODE,
  H_EARTH_RUN_8E_R2_GPU_TRANSPORT_NODE,
  H_EARTH_RUN_8E_R2E_NODE,
  H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE,
  H_EARTH_RUN_8E_R2D_EVIDENCE,
  H_EARTH_RUN_8E_R2E_EVIDENCE
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r2-scope.js';
import loadHEarthRepositoryRegistryValidatorDependencies from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import { runAutomaticHEarthPreflight } from '../registry/activation/h-earth.repository-registry.auto-preflight.js';

const root = process.cwd();
const outputDirectory = process.env.H_EARTH_RUN8E_R2E_OUTPUT ?? '/tmp/h-earth-run8e-r2e';
fs.mkdirSync(outputDirectory, { recursive: true });
const withoutLeadingSlash = (value) => value.startsWith('/') ? value.slice(1) : value;
const sha256 = (buffer) => `sha256:${crypto.createHash('sha256').update(buffer).digest('hex')}`;
const gitBlob = (relativePath) => execFileSync('git', ['hash-object', relativePath], { cwd: root, encoding: 'utf8' }).trim();

const control = evaluateHEarthRun8ER2EControl(H_EARTH_RUN_8E_R2E_CONTROL);
assert.equal(control.eligible, true, `R2E_CONTROL_FAILED:${control.issues.join(',')}`);

const loader = loadHEarthRepositoryRegistryValidatorDependencies();
assert.equal(loader.identityVerified, true, 'R2E_REGISTRY_LOADER_IDENTITY_NOT_VERIFIED');
for (const expectedNode of [H_EARTH_RUN_8E_R2_PACKAGE_NODE, H_EARTH_RUN_8E_R2_GPU_TRANSPORT_NODE, H_EARTH_RUN_8E_R2E_NODE]) {
  assert.equal(loader.registryInstance.nodes.some((node) => node.nodeId === expectedNode.nodeId), true,
    `R2E_NODE_NOT_ACTIVE:${expectedNode.nodeId}`);
}
for (const expectedEvidence of [H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE, H_EARTH_RUN_8E_R2D_EVIDENCE, H_EARTH_RUN_8E_R2E_EVIDENCE]) {
  assert.equal(loader.registryInstance.evidenceRecords.some((entry) => entry.evidenceId === expectedEvidence.evidenceId), true,
    `R2E_EVIDENCE_NOT_ACTIVE:${expectedEvidence.evidenceId}`);
}

const pathResolution = [];
for (const repositoryPath of H_EARTH_RUN_8E_R2_ALL_PATHS) {
  const resolution = registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert.equal(resolution.resolved, true, `R2E_PATH_UNRESOLVED:${repositoryPath}`);
  assert.equal(resolution.nodes.length > 0, true, `R2E_PATH_NODE_MISSING:${repositoryPath}`);
  pathResolution.push({
    repositoryPath,
    nodeIds: resolution.nodes.map((node) => node.nodeId).sort(),
    occurrenceCount: resolution.occurrences.length
  });
}

const packageResolution = registryFacade.resolveHEarthRepositoryRegistryPath(
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.js'
);
const transportResolution = registryFacade.resolveHEarthRepositoryRegistryPath(
  '/showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js'
);
assert.deepEqual(packageResolution.nodes.map((node) => node.nodeId), [H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId]);
assert.deepEqual(transportResolution.nodes.map((node) => node.nodeId), [H_EARTH_RUN_8E_R2_GPU_TRANSPORT_NODE.nodeId]);
assert.notEqual(H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId, H_EARTH_RUN_8E_R2_GPU_TRANSPORT_NODE.nodeId);

const receiptChecks = [
  ['h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json', 'RUN_8E_R2A_PASS_CLOSED'],
  ['h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json', 'RUN_8E_R2B_PASS_CLOSED'],
  ['h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.pass-closed.receipt.json', 'RUN_8E_R2C_PASS_CLOSED'],
  ['h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json', 'RUN_8E_R2D_PASS_CLOSED']
];
const receiptCustody = receiptChecks.map(([relativePath, expectedStatus]) => {
  const bytes = fs.readFileSync(path.join(root, relativePath));
  const receipt = JSON.parse(bytes.toString('utf8'));
  assert.equal(receipt.status, expectedStatus, `R2E_RECEIPT_STATUS_INVALID:${relativePath}`);
  return {
    path: `/${relativePath}`,
    receiptType: receipt.receiptType,
    status: receipt.status,
    gitBlobSha: gitBlob(relativePath),
    contentSha256: sha256(bytes),
    byteCount: bytes.byteLength
  };
});

const governedPreflightPaths = H_EARTH_RUN_8E_R2_ALL_PATHS.filter((repositoryPath) =>
  (repositoryPath.startsWith('/h-earth-3d/') || repositoryPath.startsWith('/showroom/globe/h-earth/')) &&
  !repositoryPath.startsWith('/h-earth-3d/registry/') &&
  !repositoryPath.endsWith('/h-earth.run8e-r2e.pass-closed.receipt.json'));
const preflight = runAutomaticHEarthPreflight({
  paths: governedPreflightPaths,
  taskText: 'Run 8E R2E independent registry and scope audit',
  mutationIntent: false
});
assert.equal(preflight.dependenciesVerified, true, 'R2E_PREFLIGHT_DEPENDENCIES_NOT_VERIFIED');
assert.equal(preflight.pathClassification.classifications.every((entry) => entry.registered === true), true,
  'R2E_PREFLIGHT_UNREGISTERED_PATH');
assert.equal(preflight.finalDisposition, 'PASS', `R2E_PREFLIGHT_NOT_PASS:${preflight.finalDisposition}`);

const protectedSources = [
  'showroom/globe/h-earth/render/live-render-package.run8e-r2.js',
  'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js',
  'h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2d.gpu-upload-and-resource-lifecycle.js'
].map((relativePath) => ({
  path: `/${relativePath}`,
  gitBlobSha: gitBlob(relativePath),
  contentSha256: sha256(fs.readFileSync(path.join(root, relativePath))),
  byteCount: fs.statSync(path.join(root, relativePath)).size
}));
assert.equal(protectedSources[0].gitBlobSha, '1699654f39c9e183f4cfc6f75b20ba051641b763');
assert.equal(protectedSources[1].gitBlobSha, '785856d7702a0e855c2672e6b8a7325ad5b3ba50');

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R2E_REGISTRY_CUSTODY_AND_SCOPE_AUDIT_EXECUTION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R2E_REGISTRY_CUSTODY_AND_SCOPE_AUDIT_PASS',
  generatedAt: new Date().toISOString(),
  checkpointContractId: H_EARTH_RUN_8E_R2E_CONTROL.contractId,
  predecessor: H_EARTH_RUN_8E_R2E_CONTROL.predecessor,
  registry: {
    identityVerified: loader.identityVerified,
    activeNodeIds: [
      H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId,
      H_EARTH_RUN_8E_R2_GPU_TRANSPORT_NODE.nodeId,
      H_EARTH_RUN_8E_R2E_NODE.nodeId
    ],
    activeEvidenceIds: [
      H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE.evidenceId,
      H_EARTH_RUN_8E_R2D_EVIDENCE.evidenceId,
      H_EARTH_RUN_8E_R2E_EVIDENCE.evidenceId
    ],
    registeredPathCount: H_EARTH_RUN_8E_R2_ALL_PATHS.length,
    pathResolution,
    packageAndTransportNodeIdentitySeparate: true
  },
  receiptCustody,
  protectedSources,
  automaticPreflight: {
    finalDisposition: preflight.finalDisposition,
    classifiedPathCount: preflight.pathClassification.classifications.length,
    registeredPathCount: preflight.pathClassification.classifications.filter((entry) => entry.registered).length,
    failureCodes: preflight.validatorReceipt.failureCodes,
    receiptId: preflight.receiptId
  },
  boundaries: {
    packageSourceMutated: false,
    gpuTransportAdapterMutated: false,
    sourceAuthorityMutated: false,
    publicRouteMutated: false,
    visibleRendererCreated: false,
    renderLoopCreated: false,
    deploymentPerformed: false,
    run8ER2FStarted: false,
    run8ER3Started: false,
    run8EPassClosed: false
  },
  stoppingBoundary: 'STOP_BEFORE_R2F_CLOSURE_AND_PROMOTION_DECISION',
  issues: []
};
fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r2e.execution.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r2e.automatic-preflight.receipt.json'), `${JSON.stringify(preflight, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
