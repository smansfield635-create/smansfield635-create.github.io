import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ma0 from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma0-audit-basis-freeze.v1.mjs';
import b4 from '../../control-plane/post-cp2-round2/morphology/h-earth.b4-morphology-leverage-classification.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const BASE = '24aeb88371d3202d444c8e9063871ef20d3c4ed0';
const RECEIPT_PATH = path.join(HERE, 'h-earth.ma0-audit-basis-freeze.receipt.v1.json');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${BASE}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...ma0.exactPathScope].sort();
check('EXACT_MA0_BASE', git('merge-base', BASE, head) === BASE, { base: BASE, head });
check('EXACT_MA0_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });

for (const [name, source] of Object.entries(ma0.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

const sceneControlPath = path.join(ROOT, ma0.frozenSources.permanentEightSceneControl.path);
const sceneControl = JSON.parse(fs.readFileSync(sceneControlPath, 'utf8'));
check('EXACT_EIGHT_SCENES', sceneControl.scenes?.length === 8 && b4.scenes?.length === 8, { cp8: sceneControl.scenes?.length, b4: b4.scenes?.length });
check('B4_AND_PERMANENT_SCENES_IDENTICAL', JSON.stringify(sceneControl.scenes) === JSON.stringify(b4.scenes), { cp8Scenes: sceneControl.scenes, b4Scenes: b4.scenes });
check('VIEWPORT_FROZEN', JSON.stringify(ma0.frozenMetricBasis.viewport) === JSON.stringify(b4.viewport), { ma0: ma0.frozenMetricBasis.viewport, b4: b4.viewport });
check('NORMALIZED_ANALYSIS_SIZE_FROZEN', JSON.stringify(ma0.frozenMetricBasis.normalizedAnalysisSize) === JSON.stringify(b4.normalizedAnalysisSize), { ma0: ma0.frozenMetricBasis.normalizedAnalysisSize, b4: b4.normalizedAnalysisSize });
check('GAUSSIAN_SIGMAS_FROZEN', JSON.stringify(ma0.frozenMetricBasis.gaussianSigmasPixels) === JSON.stringify(b4.finalFrameMetric.gaussianSigmasPixels), { ma0: ma0.frozenMetricBasis.gaussianSigmasPixels, b4: b4.finalFrameMetric.gaussianSigmasPixels });
check('ORIENTATION_GRID_FROZEN', JSON.stringify(ma0.frozenMetricBasis.orientationsDegrees) === JSON.stringify(b4.finalFrameMetric.orientationsDegrees), { ma0: ma0.frozenMetricBasis.orientationsDegrees, b4: b4.finalFrameMetric.orientationsDegrees });
check('LAG_GRID_FROZEN', JSON.stringify(ma0.frozenMetricBasis.lagsPixels) === JSON.stringify(b4.finalFrameMetric.lagsPixels), { ma0: ma0.frozenMetricBasis.lagsPixels, b4: b4.finalFrameMetric.lagsPixels });

const passKeys = Object.keys(ma0.plannedDiagnosticPasses);
check('EXACT_A_THROUGH_H_PASS_REGISTRY', JSON.stringify(passKeys) === JSON.stringify(['A','B','C','D','E','F','G','H']), { passKeys });
check('B4_EVIDENCE_ANCHORS_COMPLETE',
  Number.isInteger(ma0.frozenB4Evidence.workflowRunId)
    && Number.isInteger(ma0.frozenB4Evidence.jobId)
    && /^[0-9a-f]{64}$/.test(ma0.frozenB4Evidence.canonicalReceiptSha256)
    && Number.isInteger(ma0.frozenB4Evidence.artifactId)
    && /^[0-9a-f]{64}$/.test(ma0.frozenB4Evidence.artifactSha256)
    && Number.isFinite(ma0.frozenB4Evidence.acceptedCp2FinalFrameRepetitionScore)
    && ma0.frozenB4Evidence.executionIntegrityFailureCount === 0
    && ma0.frozenB4Evidence.acceptedRendererEquivalenceSceneCount === 8,
  ma0.frozenB4Evidence
);
check('B4_DISPOSITION_FROZEN', ma0.priorDisposition.b4 === 'B4_MORPHOLOGY_LEVERAGE_NOT_ESTABLISHED_STOP_CLOSED' && ma0.priorDisposition.b5Authorized === false, ma0.priorDisposition);
check('RESEARCH_DISPOSITION_C_FROZEN', ma0.priorDisposition.currentResearchDisposition === 'C_CURRENT_METRIC_OR_CAUSAL_INTERPRETATION_REQUIRES_VALIDATION_BEFORE_MORE_IMPLEMENTATION', ma0.priorDisposition);
check('MA0_BOUNDARY_EXACT', ma0.boundaries.stop === 'STOP_AFTER_MA0_FREEZE_RECEIPT' && ma0.boundaries.productMutationPerformed === false && ma0.boundaries.diagnosticRendererConstructionStarted === false && ma0.boundaries.sceneExecutionStarted === false && ma0.boundaries.liveRouteChanged === false, ma0.boundaries);
check('MA1_ONLY_NEXT_AUTHORITY', ma0.nextAuthorizedCheckpointOnPass === 'MA1_REPRODUCE_EXISTING_METRIC');
check('MA0_RESULT_DECLARED', ma0.result === 'MA0_AUDIT_BASIS_FREEZE_PASS_CLOSED');

const passClosed = failures.length === 0;
const receiptCore = {
  receiptType: 'H_EARTH_MA0_AUDIT_BASIS_FREEZE_RECEIPT_v1',
  checkpoint: 'MA0',
  result: passClosed ? 'MA0_AUDIT_BASIS_FREEZE_PASS_CLOSED' : 'MA0_AUDIT_BASIS_FREEZE_FAIL_STOP',
  passClosed,
  controllingB4Merge: BASE,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  frozenMetricBasis: ma0.frozenMetricBasis,
  frozenB4Evidence: ma0.frozenB4Evidence,
  plannedDiagnosticPasses: ma0.plannedDiagnosticPasses,
  checks,
  failureCount: failures.length,
  failures,
  productMutationPerformed: false,
  diagnosticRenderPassImplementationStarted: false,
  sceneRenderExecutionStarted: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  nextAuthorizedCheckpoint: passClosed ? ma0.nextAuthorizedCheckpointOnPass : null,
  stoppingBoundary: 'STOP_AFTER_MA0_FREEZE_RECEIPT',
  resumeToken: passClosed ? `MA0_PASS_CLOSED@${head}` : `MA0_FAIL_STOP@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptCore));
const receipt = { ...receiptCore, canonicalReceiptSha256 };
fs.mkdirSync(path.dirname(RECEIPT_PATH), { recursive: true });
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!passClosed) process.exitCode = 1;
