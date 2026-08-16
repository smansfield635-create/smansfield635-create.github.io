import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma5-cross-pass-correspondence.v1.mjs';
import matrix from './h-earth.ma5-cross-pass-correspondence-matrix.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.ma5-cross-pass-correspondence.receipt.v1.json');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const average = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const ratio = (left, right) => Math.max(left, right) > 0 ? Math.min(left, right) / Math.max(left, right) : 1;
const pearson = (left, right) => {
  const leftMean = average(left);
  const rightMean = average(right);
  const leftCentered = left.map((value) => value - leftMean);
  const rightCentered = right.map((value) => value - rightMean);
  const denominator = Math.sqrt(
    leftCentered.reduce((sum, value) => sum + value * value, 0) *
    rightCentered.reduce((sum, value) => sum + value * value, 0)
  );
  return denominator > 1e-15
    ? leftCentered.reduce((sum, value, index) => sum + value * rightCentered[index], 0) / denominator
    : 0;
};
const close = (left, right, tolerance = 1e-12) => Math.abs(left - right) <= tolerance;
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${control.controllingMA4Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_MA5_BASE', git('merge-base', control.controllingMA4Merge, head) === control.controllingMA4Merge, { base: control.controllingMA4Merge, head });
check('EXACT_MA5_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

const { canonicalMatrixSha256: recordedMatrixSha256, ...matrixBody } = matrix;
const calculatedMatrixSha256 = sha256(JSON.stringify(matrixBody));
check('CANONICAL_MATRIX_SHA256_EXACT', calculatedMatrixSha256 === control.matrix.expectedCanonicalSha256 && recordedMatrixSha256 === control.matrix.expectedCanonicalSha256, {
  expected: control.matrix.expectedCanonicalSha256,
  calculated: calculatedMatrixSha256,
  recorded: recordedMatrixSha256
});
check('SOURCE_EVIDENCE_MA3_EXACT', JSON.stringify(matrix.sourceEvidence.ma3) === JSON.stringify(control.sourceEvidence.ma3), { actual: matrix.sourceEvidence.ma3, expected: control.sourceEvidence.ma3 });
check('SOURCE_EVIDENCE_MA4_EXACT', JSON.stringify(matrix.sourceEvidence.ma4) === JSON.stringify(control.sourceEvidence.ma4), { actual: matrix.sourceEvidence.ma4, expected: control.sourceEvidence.ma4 });
check('MATRIX_DIMENSIONS_EXACT', matrix.sceneCount === control.matrix.sceneCount && matrix.comparisonPassCount === control.matrix.comparisonPassCount && matrix.bandCountPerScene === control.matrix.bandCountPerScene, {
  sceneCount: matrix.sceneCount,
  comparisonPassCount: matrix.comparisonPassCount,
  bandCountPerScene: matrix.bandCountPerScene
});
check('PASS_KEYS_EXACT', matrix.passes.map((record) => record.passKey).sort().join('') === 'ABCDEFG');
check('REFERENCE_PASS_EXACT', matrix.referencePass === control.matrix.referencePass && matrix.referencePassId === 'PASS_H_ACCEPTED_CP2_FINAL_FRAME');
check('NO_CAUSAL_CLASSIFICATION_IN_MA5', matrix.causalClassificationPerformed === false && matrix.calculationLaw.causalClassificationPerformed === false);
check('NO_NEW_RENDERING_RECORDED', matrix.productMutationPerformed === false && matrix.liveRouteChanged === false);

for (const pass of matrix.passes) {
  const sceneScores = pass.perScene.map((scene) => scene.score);
  const hScores = pass.perScene.map((scene) => scene.hScore);
  const exactCount = pass.perScene.reduce((sum, scene) => sum + scene.exactBandCount, 0);
  const nearCount = pass.perScene.reduce((sum, scene) => sum + scene.nearBandCount, 0);
  const dominantExactCount = pass.perScene.filter((scene) => scene.dominantExact).length;
  const dominantNearCount = pass.perScene.filter((scene) => scene.dominantNear).length;
  const meanGridPearson = average(pass.perScene.map((scene) => scene.meanGridPearson));
  const sceneScorePearson = pearson(sceneScores, hScores);
  const aggregateScore = average(sceneScores);
  const hAggregateScore = average(hScores);
  const aggregateScoreRatio = ratio(aggregateScore, hAggregateScore);
  const composite = average([
    exactCount / 24,
    nearCount / 24,
    Math.max(0, meanGridPearson),
    Math.max(0, sceneScorePearson),
    pass.meanPeakStrengthRatio,
    dominantExactCount / 8,
    dominantNearCount / 8,
    aggregateScoreRatio
  ]);
  check(`PASS_${pass.passKey}_SCENE_COUNT_EXACT`, pass.perScene.length === control.matrix.sceneCount);
  check(`PASS_${pass.passKey}_AGGREGATES_RECOMPUTE`,
    exactCount === pass.exactBandMatchCount &&
    nearCount === pass.nearBandMatchCount &&
    dominantExactCount === pass.dominantSceneExactMatchCount &&
    dominantNearCount === pass.dominantSceneNearMatchCount &&
    close(meanGridPearson, pass.meanBandGridPearson) &&
    close(sceneScorePearson, pass.sceneScorePearson) &&
    close(aggregateScore, pass.aggregateScore) &&
    close(hAggregateScore, pass.hAggregateScore) &&
    close(aggregateScoreRatio, pass.aggregateScoreRatio) &&
    close(composite, pass.correspondenceComposite),
    { exactCount, nearCount, dominantExactCount, dominantNearCount, meanGridPearson, sceneScorePearson, aggregateScore, hAggregateScore, aggregateScoreRatio, composite }
  );
  check(`PASS_${pass.passKey}_VALUES_FINITE`, [
    pass.aggregateScore,
    pass.hAggregateScore,
    pass.aggregateScoreRatio,
    pass.meanBandGridPearson,
    pass.sceneScorePearson,
    pass.meanPeakStrengthRatio,
    pass.correspondenceComposite,
    ...pass.perScene.flatMap((scene) => [scene.score, scene.hScore, scene.scoreRatio, scene.meanGridPearson, scene.meanPeakStrengthRatio])
  ].every(Number.isFinite));
}

const recomputedRanking = [...matrix.passes]
  .sort((left, right) => right.correspondenceComposite - left.correspondenceComposite)
  .map((record) => record.passKey);
check('CORRESPONDENCE_RANKING_EXACT', JSON.stringify(recomputedRanking) === JSON.stringify(matrix.rankedCorrespondence), { actual: recomputedRanking, expected: matrix.rankedCorrespondence });
check('STOP_BOUNDARY_EXACT', matrix.stoppingBoundary === control.boundaries.stop, { actual: matrix.stoppingBoundary, expected: control.boundaries.stop });

const receiptBody = {
  receiptType: 'H_EARTH_MA5_CROSS_PASS_CORRESPONDENCE_RECEIPT_v1',
  checkpoint: 'MA5',
  result: failures.length === 0 ? control.result : 'MA5_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingMA4Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  matrix,
  calculatedMatrixSha256,
  productMutationPerformed: false,
  newRenderingPerformed: false,
  causalClassificationPerformed: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  stoppingBoundary: control.boundaries.stop,
  nextAuthorizedCheckpoint: failures.length === 0 ? control.nextAuthorizedCheckpointOnPass : null,
  resumeToken: failures.length === 0 ? `MA5_PASS_CLOSED@${head}` : `MA5_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
