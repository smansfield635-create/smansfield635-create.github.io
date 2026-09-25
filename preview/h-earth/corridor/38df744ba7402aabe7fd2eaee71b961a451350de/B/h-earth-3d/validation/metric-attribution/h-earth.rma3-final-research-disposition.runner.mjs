import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.rma3-final-research-disposition.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.rma3-final-research-disposition.receipt.v1.json');
const PACKET_PATH = path.join(ROOT, 'h-earth-3d/research/metric-attribution/H_EARTH_RMA0_THROUGH_RMA3_FINAL_RESEARCH_PACKET.v1.json');
const HANDOFF_PATH = path.join(ROOT, 'h-earth-3d/research/metric-attribution/H_EARTH_RMA0_THROUGH_RMA3_FINAL_RESEARCH_HANDOFF.md');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const close = (left, right, tolerance = 1e-15) => Number.isFinite(left) && Math.abs(left - right) <= tolerance;
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${control.controllingRMA2Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_RMA3_BASE', git('merge-base', control.controllingRMA2Merge, head) === control.controllingRMA2Merge, { base: control.controllingRMA2Merge, head });
check('EXACT_RMA3_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

const packetText = fs.readFileSync(PACKET_PATH, 'utf8');
const packet = JSON.parse(packetText);
const handoff = fs.readFileSync(HANDOFF_PATH, 'utf8');
check('PACKET_SCHEMA_EXACT', packet.schemaVersion === 'H_EARTH_RMA0_THROUGH_RMA3_FINAL_RESEARCH_PACKET_v1');
check('PACKET_CHECKPOINT_RANGE_EXACT', packet.checkpointRange === 'RMA0_THROUGH_RMA3');
check('PACKET_ACCEPTED_LIVE_STATE_EXACT', packet.acceptedLiveProduct === 'CP2' && packet.liveStateChanged === false && packet.productMutationPerformed === false);
check('PACKET_RMA1_NO_SINGLE_PASS_EXACT', packet.rma1Disposition.singleFamilyCausalPassCount === 0 && packet.checkpointLedger.find((entry) => entry.checkpoint === 'RMA1')?.singleFamilyPassKeys?.length === 0);
check('PACKET_RMA2_CLASSIFICATION_EXACT', packet.rma2Disposition.classification === 'NO_SINGLE_OR_BOUNDED_COMBINATION_PASSES_CAUSAL_GATE' && packet.checkpointLedger.find((entry) => entry.checkpoint === 'RMA2')?.classification === 'NO_SINGLE_OR_BOUNDED_COMBINATION_PASSES_CAUSAL_GATE');
check('PACKET_RMA2_METRICS_EXACT',
  close(packet.rma2Disposition.combinationAggregateScore, control.evidence.rma2.combinationMetrics.aggregateScore) &&
  close(packet.rma2Disposition.passGAggregateScore, control.evidence.rma2.combinationMetrics.gAggregateScore) &&
  close(packet.rma2Disposition.aggregateRepetitionReductionFromG, control.evidence.rma2.combinationMetrics.aggregateRepetitionReductionFromG) &&
  close(packet.rma2Disposition.meanBandGridPearsonDropFromG, control.evidence.rma2.combinationMetrics.meanBandGridPearsonDropFromG) &&
  packet.rma2Disposition.exactBandMatchDropFromG === control.evidence.rma2.combinationMetrics.exactBandMatchDropFromG &&
  packet.rma2Disposition.sceneScoreReductionCount === control.evidence.rma2.combinationMetrics.sceneScoreReductionCount &&
  close(packet.rma2Disposition.causalImpactComposite, control.evidence.rma2.combinationMetrics.causalImpactComposite),
  { actual: packet.rma2Disposition, expected: control.evidence.rma2.combinationMetrics }
);
check('PACKET_RESULT_3_EXACT', packet.finalOutcome.resultNumber === 3 && packet.finalOutcome.result === 'NO_MATERIAL_FAMILY_EXPLAINS_THE_VISIBLE_COMPLAINT_UNDER_CURRENT_METRIC');
check('METRIC_SUBSIGNAL_CAUSE_NOT_IDENTIFIED', packet.finalOutcome.metricSubsignalCause === control.mechanicalDisposition.metricSubsignalCause);
check('HUMAN_VISIBLE_CORRESPONDENCE_NOT_ESTABLISHED', packet.finalOutcome.humanVisibleDefectCorrespondence === control.mechanicalDisposition.humanVisibleDefectCorrespondence);
check('RETENTION_NOT_APPLICABLE_EXACT', packet.finalOutcome.usefulCueRetentionStatus === control.mechanicalDisposition.usefulCueRetentionTest && control.boundaries.usefulCueRetentionExecutionPerformed === false);
check('SCALAR_METRIC_IMPLEMENTATION_AUTHORITY_FALSE', packet.finalOutcome.scalarMetricMayGovernAnotherImplementation === false && control.mechanicalDisposition.scalarMetricMayGovernAnotherImplementation === false);
check('NO_PRODUCT_OR_LIVE_AUTHORIZATION', packet.finalOutcome.minimalProductCandidateAuthorized === false && packet.finalOutcome.signalSeparationImplementationAuthorized === false && packet.finalOutcome.liveCandidateAuthorized === false && control.mechanicalDisposition.productCandidateAuthorized === false && control.mechanicalDisposition.liveCandidateAuthorized === false);
check('NEXT_OPERATION_EXACT', packet.nextAuthorizedOperation.operationId === control.nextAuthorizedOperation.operationId && packet.nextAuthorizedOperation.class === control.nextAuthorizedOperation.class && packet.nextAuthorizedOperation.userInputRequired === true);
check('PROHIBITED_DIRECTIONS_COMPLETE', ['ANOTHER_MORPHOLOGY_PROBE','ANOTHER_WHOLE_BAKED_MAP','ANOTHER_GENERAL_SHADER','ANOTHER_METRIC_DRIVEN_PRODUCT_CANDIDATE','LIVE_ADMISSION_BEFORE_PERCEPTUAL_CORRESPONDENCE'].every((entry) => packet.prohibitedDirections.includes(entry)), packet.prohibitedDirections);

const requiredHandoffStrings = [
  'FINAL_RESULT = RESULT_3',
  'METRIC_SUBSIGNAL_CAUSE = NOT_IDENTIFIED_BY_FROZEN_CAUSAL_GATE',
  'HUMAN_VISIBLE_DEFECT_CORRESPONDENCE = NOT_ESTABLISHED',
  'USEFUL_CUE_RETENTION_TEST = NOT_APPLICABLE_NO_CAUSAL_SUPPRESSION_IDENTIFIED',
  'SCALAR_METRIC_MAY_GOVERN_ANOTHER_IMPLEMENTATION = FALSE',
  'H_EARTH_CP2_MEASURED_SIGNATURE_PERCEPTUAL_CORRESPONDENCE_TEST_v1',
  'ANOTHER_MORPHOLOGY_PROBE = PROHIBITED',
  'ANOTHER_WHOLE_BAKED_MAP = PROHIBITED',
  'ANOTHER_GENERAL_SHADER = PROHIBITED',
  '25b82751239ae5127a8e1dc4cd6ca69763b1f37f1c95e318d4a21e41e54230bc'
];
check('HANDOFF_REQUIRED_CONTENT_COMPLETE', requiredHandoffStrings.every((entry) => handoff.includes(entry)), { missing: requiredHandoffStrings.filter((entry) => !handoff.includes(entry)) });
check('NO_NEW_RENDER_EXECUTION', control.boundaries.newRenderExecutionPerformed === false);
check('NO_USER_DIFFERENTIAL_DURING_RMA3', control.boundaries.userDifferentialRequiredDuringRMA3 === false && control.nextAuthorizedOperation.userInputRequiredDuringRMA3 === false);
check('STOP_BOUNDARY_EXACT', control.boundaries.stop === 'STOP_AFTER_RMA3_FINAL_RESEARCH_DISPOSITION');

const packetSha256 = sha256(packetText);
const handoffSha256 = sha256(handoff);
const receiptBody = {
  receiptType: 'H_EARTH_RMA3_FINAL_RESEARCH_DISPOSITION_RECEIPT_v1',
  checkpoint: 'RMA3',
  operation: control.operation,
  result: failures.length === 0 ? control.result : 'RMA3_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingRMA2Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  finalOutcome: control.mechanicalDisposition,
  nextAuthorizedOperation: control.nextAuthorizedOperation,
  packetSha256,
  handoffSha256,
  productMutationPerformed: false,
  newRenderExecutionPerformed: false,
  usefulCueRetentionExecutionPerformed: false,
  usefulCueRetentionStatus: control.boundaries.usefulCueRetentionStatus,
  liveRouteChanged: false,
  userDifferentialRequiredDuringRMA3: false,
  stoppingBoundary: control.boundaries.stop,
  resumeToken: failures.length === 0 ? `RMA3_PASS_CLOSED@${head}` : `RMA3_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
