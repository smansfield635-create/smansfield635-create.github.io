import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.rma0-material-family-freeze.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.rma0-material-family-freeze.receipt.v1.json');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};
const count = (source, needle) => source.split(needle).length - 1;

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${control.controllingMA6Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_RMA0_BASE', git('merge-base', control.controllingMA6Merge, head) === control.controllingMA6Merge, { base: control.controllingMA6Merge, head });
check('EXACT_RMA0_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

check('OPERATION_ID_EXACT', control.operation === 'H_EARTH_ACCEPTED_CP2_MATERIAL_SUBSIGNAL_ATTRIBUTION_RESEARCH_v1');
check('CLASS_DIAGNOSTIC_ONLY', control.class === 'DIAGNOSTIC_ONLY_NO_PRODUCT_MUTATION');
check('REFERENCE_PASSES_G_H_EXACT', Object.keys(control.referencePasses).join('') === 'GH' && control.referencePasses.G?.id === 'PASS_G_ACCEPTED_MATERIAL_WITH_FLAT_LIGHTING' && control.referencePasses.H?.id === 'PASS_H_ACCEPTED_CP2_FINAL_FRAME', control.referencePasses);
check('EXACT_SEVEN_FAMILIES', control.materialFamilies.length === 7 && control.materialFamilies.map((family) => family.key).join(',') === 'FAMILY_1,FAMILY_2,FAMILY_3,FAMILY_4,FAMILY_5,FAMILY_6,FAMILY_7');
check('FAMILY_IDS_UNIQUE', new Set(control.materialFamilies.map((family) => family.id)).size === 7);
check('ALL_FAMILIES_DIAGNOSTIC_ONLY', control.materialFamilies.every((family) => family.productSourceMutation === false));
check('EXACT_EIGHT_SCENES', control.scenes.length === 8 && new Set(control.scenes.map((scene) => scene.id)).size === 8);
check('VIEWPORT_FROZEN', control.viewport.width === 960 && control.viewport.height === 540 && control.viewport.pixelRatio === 1, control.viewport);
check('ANALYSIS_GRID_FROZEN', control.normalizedAnalysisSize.width === 256 && control.normalizedAnalysisSize.height === 256, control.normalizedAnalysisSize);
check('METRIC_GRID_FROZEN', JSON.stringify(control.finalFrameMetric) === JSON.stringify({
  gaussianSigmasPixels: [2, 8, 24],
  orientationsDegrees: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5],
  lagsPixels: [4, 8, 12, 16, 24, 32, 48, 64]
}), control.finalFrameMetric);
check('SINGLE_FAMILY_GATE_FINITE', Object.values(control.singleFamilyCausalGate).filter((value) => typeof value === 'number').every(Number.isFinite), control.singleFamilyCausalGate);
check('BOUNDED_COMBINATION_EXACT', control.boundedCombinationLaw.executeOnlyWhenNoSingleFamilyPasses === true && control.boundedCombinationLaw.exactCombinationCountMaximum === 1 && control.boundedCombinationLaw.noThirdFamily === true && control.boundedCombinationLaw.noParameterTuning === true, control.boundedCombinationLaw);
check('OUTCOME_LAW_COMPLETE', Object.keys(control.outcomeLaw).sort().join(',') === 'perceptualComparisonRequired,removableCulprit,signalSeparationRequired');

const acceptedSourcePath = path.join(ROOT, control.frozenSources.acceptedCp2Renderer.path);
const acceptedSource = fs.readFileSync(acceptedSourcePath, 'utf8');
const requiredMarkers = [
  'float broad=noise2(world*0.035);',
  'float medium=noise2(world*0.13+vec2(17.0,-9.0));',
  'float grain=noise2(world*0.55+vec2(-31.0,23.0));',
  'float macroField=noise2(world*0.018+vec2(5.0,-11.0));',
  'float mesoField=noise2(world*0.082+vec2(-13.0,7.0));',
  'float detailField=noise2(world*0.29+vec2(29.0,-17.0));',
  'float strata=stableWave(',
  'float crossGrain=stableWave(',
  'float faceBandA=stableWave(',
  'float faceBandB=stableWave(',
  'float faceBandC=stableWave(',
  'float crestSignal=stableWave(',
  'float terraceSignal=stableWave(',
  'float contourLine=contour(vWorldPosition.y);',
  'float slopeRake=stableWave(',
  'vec2 manorCenter=vec2(80.0,-172.0);',
  'vec2 cavernCenter=vec2(40.0,-284.0);',
  'vec3 base=max(vBaseColor.rgb,vec3(0.004));'
];
for (const marker of requiredMarkers) check(`ACCEPTED_SHADER_MARKER_${sha256(marker).slice(0, 12)}`, count(acceptedSource, marker) === 1, { marker, count: count(acceptedSource, marker) });

check('NO_ABLATION_EXECUTED', control.boundaries.diagnosticAblationExecuted === false);
check('NO_PRODUCT_OR_LIVE_MUTATION_DECLARED', control.boundaries.productMutationPerformed === false && control.boundaries.liveRouteChanged === false);
check('STOP_BOUNDARY_EXACT', control.boundaries.stop === 'STOP_AFTER_RMA0_FAMILY_REGISTRY_RECEIPT');

const receiptBody = {
  receiptType: 'H_EARTH_RMA0_MATERIAL_FAMILY_FREEZE_RECEIPT_v1',
  checkpoint: 'RMA0',
  operation: control.operation,
  result: failures.length === 0 ? control.result : 'RMA0_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingMA6Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  referencePasses: control.referencePasses,
  materialFamilies: control.materialFamilies,
  singleFamilyCausalGate: control.singleFamilyCausalGate,
  boundedCombinationLaw: control.boundedCombinationLaw,
  usefulCueRetentionGate: control.usefulCueRetentionGate,
  outcomeLaw: control.outcomeLaw,
  productMutationPerformed: false,
  diagnosticAblationExecuted: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  stoppingBoundary: control.boundaries.stop,
  nextAuthorizedCheckpoint: failures.length === 0 ? control.nextAuthorizedCheckpointOnPass : null,
  resumeToken: failures.length === 0 ? `RMA0_PASS_CLOSED@${head}` : `RMA0_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
