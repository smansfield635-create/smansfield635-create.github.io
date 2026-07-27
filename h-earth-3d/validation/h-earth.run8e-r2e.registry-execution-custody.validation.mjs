import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import registryFacade, {
  H_EARTH_RUN_8E_R2_CHECKPOINT_RECORDS,
  H_EARTH_RUN_8E_R2E_PATHS
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r2-execution-scope.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import { runAutomaticHEarthPreflight } from '../registry/activation/h-earth.repository-registry.auto-preflight.js';
import {
  H_EARTH_RUN_8E_R2E_CONTROL,
  evaluateHEarthRun8ER2EControl
} from '../control-plane/run-8/recovery/h-earth.run8e-r2e.registry-execution-custody.js';

const repositoryRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const inventoryPath = path.join(repositoryRoot, 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.path-inventory.json');
const passReceiptPath = path.join(repositoryRoot, 'h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json');
const outputDirectory = process.env.H_EARTH_RUN8E_R2E_OUTPUT || '/tmp/h-earth-run8e-r2e';
const reportPath = path.join(outputDirectory, 'h-earth.run8e-r2e.registry-execution-custody.report.json');
const occurrenceManifestPath = path.join(outputDirectory, 'h-earth.run8e-r2e.exact-occurrence-manifest.json');
const automaticPreflightPath = path.join(outputDirectory, 'h-earth.run8e-r2e.automatic-preflight.receipt.json');

fs.mkdirSync(outputDirectory, { recursive: true });

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const passReceiptPresent = fs.existsSync(passReceiptPath);
const passReceipt = passReceiptPresent ? JSON.parse(fs.readFileSync(passReceiptPath, 'utf8')) : null;
const issues = [];
const checks = {};

const assert = (condition, code) => {
  if (!condition) issues.push(code);
  return condition;
};

const git = (...args) => execFileSync('git', args, {
  cwd: repositoryRoot,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
}).trim();

const normalize = (repositoryPath) => repositoryPath.startsWith('/') ? repositoryPath : `/${repositoryPath}`;
const relative = (repositoryPath) => normalize(repositoryPath).slice(1);
const stableDigest = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;

const checkpointOrder = ['RUN_8E_R2A', 'RUN_8E_R2B', 'RUN_8E_R2C', 'RUN_8E_R2D'];
const expectedHeads = [
  '22b23594005dabdd9374501dae1c561f2dafa648',
  '39de87edefcc037eaafa8a988dc0c84e40e3d1ba',
  '845b6d6acffdd461153b3474044ec533ffd4403b',
  '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9'
];

checks.inventoryIdentity = assert(
  inventory.inventoryId === 'H_EARTH_RUN_8E_R2E_EXACT_GOVERNED_PATH_INVENTORY_v1' &&
  inventory.baseExactHead === expectedHeads[3],
  'INVENTORY_IDENTITY_MISMATCH'
);

checks.registryLoader = (() => {
  const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();
  return assert(
    dependencies.identityVerified === true &&
    dependencies.boundary.readOnly === true &&
    dependencies.boundary.mutationAuthorityCreated === false &&
    dependencies.boundary.workflowEnforcementInstalled === false,
    'REGISTRY_LOADER_IDENTITY_OR_BOUNDARY_MISMATCH'
  );
})();

const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
const nodeIds = registryInstance.nodes.map((node) => node.nodeId);
const evidenceIds = registryInstance.evidenceRecords.map((entry) => entry.evidenceId);
const duplicateNodeIds = [...new Set(nodeIds.filter((id, index) => nodeIds.indexOf(id) !== index))];
const duplicateEvidenceIds = [...new Set(evidenceIds.filter((id, index) => evidenceIds.indexOf(id) !== index))];
checks.duplicateLocalNodeIds = assert(duplicateNodeIds.length === 0, `DUPLICATE_LOCAL_NODE_IDS:${duplicateNodeIds.join(',')}`);
checks.duplicateEvidenceIds = assert(duplicateEvidenceIds.length === 0, `DUPLICATE_EVIDENCE_IDS:${duplicateEvidenceIds.join(',')}`);

const checkpointRecords = inventory.checkpointStack;
checks.checkpointStackOrderExact = assert(
  checkpointRecords.length === 4 &&
  checkpointRecords.every((entry, index) =>
    entry.checkpointId === checkpointOrder[index] &&
    entry.finalHead === expectedHeads[index] &&
    entry.baseHead === (index === 0 ? 'a660d54b0df30e768b95e2314b918d0f263883ed' : expectedHeads[index - 1])),
  'CHECKPOINT_STACK_ORDER_NOT_EXACT'
);

const allR2Paths = [...new Set(checkpointRecords.flatMap((entry) => entry.paths.map((row) => row.path)))].sort();
const r2eNonRegistryPaths = inventory.r2ePlannedPaths
  .map((row) => row.path)
  .filter((repositoryPath) => !repositoryPath.startsWith('/h-earth-3d/registry/'))
  .sort();

const unresolvedR2Paths = allR2Paths.filter((repositoryPath) =>
  registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath).resolved !== true);
const unresolvedR2ENonRegistryPaths = r2eNonRegistryPaths.filter((repositoryPath) =>
  registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath).resolved !== true);

checks.allR2PathsResolve = assert(unresolvedR2Paths.length === 0, `UNRESOLVED_R2_PATHS:${unresolvedR2Paths.join(',')}`);
checks.allR2ENonRegistryPathsResolve = assert(
  unresolvedR2ENonRegistryPaths.length === 0,
  `UNRESOLVED_R2E_NON_REGISTRY_PATHS:${unresolvedR2ENonRegistryPaths.join(',')}`
);

const occurrenceRows = [];
for (const checkpoint of checkpointRecords) {
  for (const row of checkpoint.paths) {
    const repositoryPath = row.path;
    const relativePath = relative(repositoryPath);
    let blobSha = null;
    try {
      blobSha = git('rev-parse', `${checkpoint.finalHead}:${relativePath}`);
    } catch {
      issues.push(`UNRESOLVED_REQUIRED_OCCURRENCE:${checkpoint.checkpointId}:${repositoryPath}`);
    }
    const occurrenceResolution = registryFacade.resolveHEarthRepositoryRegistryOccurrence({
      path: repositoryPath,
      commitSha: checkpoint.finalHead
    });
    if (occurrenceResolution.resolved !== true) {
      issues.push(`REGISTRY_OCCURRENCE_NOT_RESOLVED:${checkpoint.checkpointId}:${repositoryPath}`);
    }
    occurrenceRows.push({
      checkpointId: checkpoint.checkpointId,
      commitSha: checkpoint.finalHead,
      repositoryPath,
      pathClass: row.pathClass,
      gitBlobSha: blobSha
    });
  }
}
const unresolvedOccurrences = occurrenceRows.filter((row) => row.gitBlobSha == null);
checks.unresolvedRequiredOccurrences = assert(
  unresolvedOccurrences.length === 0,
  `UNRESOLVED_REQUIRED_OCCURRENCES:${unresolvedOccurrences.length}`
);
const occurrenceManifest = {
  manifestId: 'H_EARTH_RUN_8E_R2E_EXACT_OCCURRENCE_MANIFEST_v1',
  repository: inventory.repository,
  rowCount: occurrenceRows.length,
  uniquePathCount: allR2Paths.length,
  rows: occurrenceRows,
  manifestDigest: stableDigest(occurrenceRows)
};
fs.writeFileSync(occurrenceManifestPath, `${JSON.stringify(occurrenceManifest, null, 2)}\n`);

const receipts = Object.fromEntries(checkpointRecords.map((checkpoint) => {
  const receiptFile = path.join(repositoryRoot, relative(checkpoint.passReceipt));
  return [checkpoint.checkpointId, JSON.parse(fs.readFileSync(receiptFile, 'utf8'))];
}));
const expectedStatuses = {
  RUN_8E_R2A: 'RUN_8E_R2A_PASS_CLOSED',
  RUN_8E_R2B: 'RUN_8E_R2B_PASS_CLOSED',
  RUN_8E_R2C: 'RUN_8E_R2C_PASS_CLOSED',
  RUN_8E_R2D: 'RUN_8E_R2D_PASS_CLOSED'
};
let passReceiptsMatch = true;
let artifactIdentitiesMatch = true;
for (const checkpoint of checkpointRecords) {
  const receipt = receipts[checkpoint.checkpointId];
  const execution = checkpoint.executions[0];
  passReceiptsMatch &&= receipt.status === expectedStatuses[checkpoint.checkpointId];
  passReceiptsMatch &&= receipt.pullRequest === checkpoint.pullRequest;
  passReceiptsMatch &&= receipt.branch === checkpoint.branch;
  passReceiptsMatch &&= receipt.stoppingBoundary === checkpoint.stoppingBoundary;
  passReceiptsMatch &&= git('rev-parse', `${checkpoint.finalHead}:${relative(checkpoint.passReceipt)}`).length === 40;
  artifactIdentitiesMatch &&= receipt.execution.runId === execution.runId;
  artifactIdentitiesMatch &&= receipt.execution.jobId === execution.jobId;
  artifactIdentitiesMatch &&= receipt.artifact.artifactId === execution.artifactId;
  artifactIdentitiesMatch &&= receipt.artifact.artifactDigest === execution.artifactDigest;
}
checks.passReceiptsMatchExactHeads = assert(passReceiptsMatch, 'PASS_RECEIPTS_DO_NOT_MATCH_EXACT_HEADS');
checks.artifactIdentitiesMatch = assert(artifactIdentitiesMatch, 'ARTIFACT_IDENTITIES_DO_NOT_MATCH');

checks.r2AThroughR2DPassClosed = assert(
  checkpointOrder.every((checkpointId) => receipts[checkpointId].status === expectedStatuses[checkpointId]),
  'R2A_THROUGH_R2D_NOT_PASS_CLOSED'
);

const controlResult = evaluateHEarthRun8ER2EControl(H_EARTH_RUN_8E_R2E_CONTROL);
checks.r2eControl = assert(controlResult.eligible === true, `R2E_CONTROL_FAIL:${controlResult.issues.join(',')}`);
checks.r2eExecutionOnly = assert(
  H_EARTH_RUN_8E_R2E_CONTROL.boundaries.liveRenderPackageMutation === false &&
  H_EARTH_RUN_8E_R2E_CONTROL.boundaries.gpuTransportAdapterMutation === false &&
  H_EARTH_RUN_8E_R2E_CONTROL.boundaries.publicRouteMutation === false,
  'R2E_NOT_EXECUTION_ONLY'
);
checks.r2fNotStarted = assert(
  H_EARTH_RUN_8E_R2E_CONTROL.nextCheckpoint === 'RUN_8E_R2F_NOT_STARTED' &&
  H_EARTH_RUN_8E_R2E_CONTROL.boundaries.r2FWork === false,
  'R2F_STARTED'
);
checks.r3NotStarted = assert(H_EARTH_RUN_8E_R2E_CONTROL.boundaries.r3Work === false, 'R3_STARTED');
checks.run8EFailOpen = assert(H_EARTH_RUN_8E_R2E_CONTROL.boundaries.run8EPassClosed === false, 'RUN_8E_NOT_FAIL_OPEN');

const actualHead = git('rev-parse', 'HEAD');
const baseHead = inventory.baseExactHead;
const changedPaths = git('diff', '--name-only', `${baseHead}...HEAD`)
  .split(/\r?\n/)
  .map((value) => value.trim())
  .filter(Boolean)
  .sort();
const permittedR2EPaths = new Set(inventory.r2ePlannedPaths.map((row) => relative(row.path)));
const unexpectedChangedPaths = changedPaths.filter((repositoryPath) => !permittedR2EPaths.has(repositoryPath));
checks.exactBoundedScope = assert(
  unexpectedChangedPaths.length === 0,
  `R2E_UNEXPECTED_CHANGED_PATHS:${unexpectedChangedPaths.join(',')}`
);

checks.protectedSourceIdentity = (() => {
  const packagePath = 'showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
  const adapterPath = 'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
  return assert(
    git('hash-object', packagePath) === '1699654f39c9e183f4cfc6f75b20ba051641b763' &&
    git('rev-parse', `${baseHead}:${adapterPath}`) === git('hash-object', adapterPath),
    'PROTECTED_PACKAGE_OR_GPU_ADAPTER_MUTATED'
  );
})();

const automaticScopedPaths = [...new Set([
  ...allR2Paths,
  ...r2eNonRegistryPaths
].filter((repositoryPath) =>
  repositoryPath.startsWith('/h-earth-3d/') || repositoryPath.startsWith('/showroom/globe/h-earth/')))].sort();
const automaticPreflight = runAutomaticHEarthPreflight({
  paths: automaticScopedPaths,
  taskText: 'Run 8E R2E exact registry and scope audit',
  mutationIntent: true
});
fs.writeFileSync(automaticPreflightPath, `${JSON.stringify(automaticPreflight, null, 2)}\n`);
const unregisteredGovernedPaths = automaticPreflight.pathClassification.classifications
  .filter((entry) => entry.classification === 'UNREGISTERED_H_EARTH_SCOPED_PATH')
  .map((entry) => entry.repositoryPath);
checks.automaticRepositoryRegistryPreflight = assert(
  unregisteredGovernedPaths.length === 0 &&
  automaticPreflight.dependenciesVerified === true &&
  !['BLOCK', 'STOP'].includes(automaticPreflight.finalDisposition),
  `AUTOMATIC_REGISTRY_PREFLIGHT_FAIL:${automaticPreflight.finalDisposition}:${unregisteredGovernedPaths.join(',')}`
);

if (passReceiptPresent) {
  checks.durableReceiptIdentity = assert(
    passReceipt.receiptType === 'H_EARTH_RUN_8E_R2E_REGISTRY_EXECUTION_CUSTODY_PASS_CLOSED_RECEIPT' &&
    passReceipt.status === 'RUN_8E_R2E_PASS_CLOSED' &&
    passReceipt.eligible === true &&
    passReceipt.repository === inventory.repository &&
    passReceipt.branch === inventory.branch &&
    passReceipt.predecessor.exactHead === baseHead &&
    passReceipt.checkpointDisposition.run8ER2F === 'NOT_STARTED' &&
    passReceipt.checkpointDisposition.run8ER3 === 'NOT_STARTED' &&
    passReceipt.checkpointDisposition.run8E === 'FAIL_OPEN' &&
    passReceipt.stoppingBoundary === inventory.stoppingBoundary,
    'R2E_DURABLE_RECEIPT_IDENTITY_FAIL'
  );
  checks.receiptManifestDigest = assert(
    passReceipt.registryAudit.exactOccurrenceManifestDigest === occurrenceManifest.manifestDigest,
    'R2E_RECEIPT_OCCURRENCE_MANIFEST_DIGEST_MISMATCH'
  );
} else {
  checks.durableReceiptIdentity = true;
  checks.receiptManifestDigest = true;
}

const report = {
  reportId: 'H_EARTH_RUN_8E_R2E_REGISTRY_EXECUTION_CUSTODY_REPORT_v1',
  repository: inventory.repository,
  branch: inventory.branch,
  baseExactHead: baseHead,
  evaluatedHead: actualHead,
  phase: passReceiptPresent ? 'FINAL_EXACT_HEAD_REVALIDATION' : 'CORE_REGISTRY_PACKAGE_EXECUTION',
  eligible: issues.length === 0,
  status: issues.length === 0
    ? (passReceiptPresent ? 'RUN_8E_R2E_FINAL_EXACT_HEAD_PASS' : 'RUN_8E_R2E_CORE_EXECUTION_PASS')
    : 'RUN_8E_R2E_FAIL_OPEN',
  checks,
  counts: {
    checkpointCount: checkpointRecords.length,
    r2UniquePathCount: allR2Paths.length,
    r2CheckpointOccurrenceCount: occurrenceRows.length,
    r2eNonRegistryPathCount: r2eNonRegistryPaths.length,
    changedPathCount: changedPaths.length,
    unregisteredGovernedPathCount: unregisteredGovernedPaths.length,
    duplicateNodeIdCount: duplicateNodeIds.length,
    duplicateEvidenceIdCount: duplicateEvidenceIds.length,
    unresolvedRequiredOccurrenceCount: unresolvedOccurrences.length
  },
  occurrenceManifestDigest: occurrenceManifest.manifestDigest,
  automaticPreflightDisposition: automaticPreflight.finalDisposition,
  checkpointDisposition: {
    run8ER2A: 'PASS_CLOSED',
    run8ER2B: 'PASS_CLOSED',
    run8ER2C: 'PASS_CLOSED',
    run8ER2D: 'PASS_CLOSED',
    run8ER2E: passReceiptPresent && issues.length === 0 ? 'PASS_CLOSED' : 'EXECUTION_PENDING',
    run8ER2F: 'NOT_STARTED',
    run8ER3: 'NOT_STARTED',
    run8ER2: passReceiptPresent && issues.length === 0 ? 'OPEN_AT_R2F_BOUNDARY' : 'OPEN_AT_R2E_BOUNDARY',
    run8E: 'FAIL_OPEN'
  },
  boundaries: {
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    sourceAuthorityMutation: false,
    publicRouteMutation: false,
    cameraNavigationOrGestureMutation: false,
    shaderProgramRenderLoopOrVisiblePresentation: false,
    deployment: false,
    r2FWork: false,
    r3Work: false,
    run8EPassClosed: false,
    r2StackMerged: false
  },
  stoppingBoundary: 'STOP_BEFORE_R2_CLOSURE_AND_PROMOTION_DECISION_R2F',
  issues
};

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (!report.eligible) process.exitCode = 1;
