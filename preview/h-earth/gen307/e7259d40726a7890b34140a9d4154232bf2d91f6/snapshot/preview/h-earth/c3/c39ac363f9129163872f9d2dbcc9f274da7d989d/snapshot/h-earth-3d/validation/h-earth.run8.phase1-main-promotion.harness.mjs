import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  H_EARTH_RUN_8E_CONTROL,
  evaluateHEarthRun8EControlContract
} from '../control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const receipt = JSON.parse(
  fs.readFileSync(path.join(directory, 'h-earth.run8.phase1-main-promotion.receipt.json'), 'utf8')
);

let assertionsPassed = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertionsPassed += 1;
};

const expected = [
  ['RUN_8A', 188, '88e2a3f8b5ff5fb8587ba95d2e13d3ea8504dfbd', '2e1ce0d1e1c8911c14339eb41643081c9bda9cbc'],
  ['RUN_8B', 190, 'f3375d629633bbdadcbebcd91f2dc19796e366e1', 'a10d6160378ac6ec83742f6530461cc433957298'],
  ['RUN_8C', 192, '7272cd8609674d2e30a74a32d6a98cee1680f496', '82b237284d6390005843174b0dfe23b6b7ac81c0'],
  ['RUN_8D', 194, '26bab1eb804a6e8737f551e1d1aa9d9cbbe4ae5f', '716a4370cf5ef320b12d3731aff577dcd6bb778b'],
  ['RUN_8E', 196, 'ac260fd8c3a36d71a04ab1ffe6d8b3012ce8bb2d', 'df1e1c7aad32a63fd35186cca0351b49b561579e']
];

check(receipt.receiptType === 'H_EARTH_RUN_8_PHASE_1_MAIN_PROMOTION_RECEIPT', 'receipt type mismatch');
check(receipt.eligible === true, 'receipt not eligible');
check(receipt.status === 'RUN_8_PHASE_1_MAIN_PROMOTION_PASS', 'receipt status mismatch');
check(receipt.prePromotionMainHead === 'a77e1751c5eb4f3edb6cd8bbd913da66a0234605', 'pre-promotion main mismatch');
check(receipt.finalPromotedStackHead === 'df1e1c7aad32a63fd35186cca0351b49b561579e', 'promoted stack head mismatch');
check(Array.isArray(receipt.orderedPromotion) && receipt.orderedPromotion.length === 5, 'ordered promotion length mismatch');

expected.forEach(([checkpoint, pullRequest, checkpointHead, mergeCommit], index) => {
  const row = receipt.orderedPromotion[index];
  check(row.checkpoint === checkpoint, `${checkpoint} checkpoint order mismatch`);
  check(row.pullRequest === pullRequest, `${checkpoint} pull request mismatch`);
  check(row.checkpointHead === checkpointHead, `${checkpoint} head mismatch`);
  check(row.mergeCommit === mergeCommit, `${checkpoint} merge commit mismatch`);
});

check(receipt.verification.orderedMergeSequencePresentAtMainTip === true, 'ordered merge sequence not proven');
check(receipt.verification.run8EHeadIsAncestorOfMain === true, 'Run 8E head ancestry not proven');
check(receipt.verification.run8EHeadBehindMainBy === 0, 'Run 8E head is missing from main');
check(receipt.verification.allFiveCheckpointHeadsContainedInMain === true, 'checkpoint containment incomplete');
check(receipt.verification.publicRouteReintegrationContainedInMain === true, 'public route integration missing from main');
check(receipt.verification.sourceCorrectionRequired === false, 'unexpected source correction claim');
check(receipt.verification.missingCheckpointCount === 0, 'missing checkpoint count nonzero');

check(H_EARTH_RUN_8E_CONTROL.executedOccurrences.run8StackPromotionToMain === 'PASS', 'control occurrence promotion state mismatch');
check(H_EARTH_RUN_8E_CONTROL.closureState.run8StackPromotionToMain === 'PASS', 'control closure promotion state mismatch');
check(H_EARTH_RUN_8E_CONTROL.closureState.deployment === 'NOT_EXECUTED', 'deployment overclaim');
check(H_EARTH_RUN_8E_CONTROL.closureState.liveIdentityAndBrowserProof === 'NOT_EXECUTED', 'live proof overclaim');
check(H_EARTH_RUN_8E_CONTROL.closureState.samsungPhysicalExecution === 'NOT_EXECUTED', 'physical Samsung overclaim');
check(H_EARTH_RUN_8E_CONTROL.closureState.run8EPassClosed === false, 'premature Run 8E closure');

const controlEvaluation = evaluateHEarthRun8EControlContract();
check(controlEvaluation.eligible === true, 'Run 8E control evaluation failed');
check(controlEvaluation.status === 'RUN_8E_CONTROL_PASS', 'Run 8E control status mismatch');
check(controlEvaluation.issues.length === 0, 'Run 8E control issues remain');
check(Array.isArray(receipt.issues) && receipt.issues.length === 0, 'promotion receipt issues remain');

console.log(JSON.stringify({
  status: 'RUN_8_PHASE_1_MAIN_PROMOTION_HARNESS_PASS',
  assertionsPassed,
  promotedStackHead: receipt.finalPromotedStackHead,
  remainingClosure: receipt.remainingRun8EClosure
}, null, 2));
