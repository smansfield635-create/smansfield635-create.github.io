import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma6-causal-classification.v1.mjs';
import matrix from './h-earth.ma5-cross-pass-correspondence-matrix.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.ma6-causal-classification.receipt.v1.json');
const PACKET_PATH = path.join(ROOT, 'h-earth-3d/research/metric-attribution/H_EARTH_METRIC_ATTRIBUTION_RESEARCH_PACKET.v1.json');
const HANDOFF_PATH = path.join(ROOT, 'h-earth-3d/research/metric-attribution/H_EARTH_METRIC_ATTRIBUTION_RESEARCH_HANDOFF.md');
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
const changedPaths = git('diff', '--name-only', `${control.controllingMA5Merge}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...control.exactPathScope].sort();
check('EXACT_MA6_BASE', git('merge-base', control.controllingMA5Merge, head) === control.controllingMA5Merge, { base: control.controllingMA5Merge, head });
check('EXACT_MA6_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_PRODUCT_OR_LIVE_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
for (const [name, source] of Object.entries(control.frozenSources)) {
  const actual = git('hash-object', source.path);
  check(`FROZEN_SOURCE_${name.toUpperCase()}`, actual === source.blob, { path: source.path, expected: source.blob, actual });
}

check('MA5_MATRIX_IDENTITY_EXACT', matrix.canonicalMatrixSha256 === control.sourceEvidence.ma5CanonicalMatrixSha256, {
  actual: matrix.canonicalMatrixSha256,
  expected: control.sourceEvidence.ma5CanonicalMatrixSha256
});

const gate = control.matchGate;
const evaluations = matrix.passes.map((pass) => {
  const terms = {
    exactBandMatchFraction: pass.exactBandMatchFraction >= gate.exactBandMatchFractionMinimum,
    meanBandGridPearson: pass.meanBandGridPearson >= gate.meanBandGridPearsonMinimum,
    sceneScorePearson: pass.sceneScorePearson >= gate.sceneScorePearsonMinimum,
    meanPeakStrengthRatio: pass.meanPeakStrengthRatio >= gate.meanPeakStrengthRatioMinimum,
    dominantSceneExactMatchFraction: pass.dominantSceneExactMatchCount / matrix.sceneCount >= gate.dominantSceneExactMatchFractionMinimum,
    aggregateScoreRatio: pass.aggregateScoreRatio >= gate.aggregateScoreRatioMinimum
  };
  return {
    passKey: pass.passKey,
    passId: pass.passId,
    correspondenceComposite: pass.correspondenceComposite,
    values: {
      exactBandMatchFraction: pass.exactBandMatchFraction,
      meanBandGridPearson: pass.meanBandGridPearson,
      sceneScorePearson: pass.sceneScorePearson,
      meanPeakStrengthRatio: pass.meanPeakStrengthRatio,
      dominantSceneExactMatchFraction: pass.dominantSceneExactMatchCount / matrix.sceneCount,
      aggregateScoreRatio: pass.aggregateScoreRatio
    },
    terms,
    qualifies: Object.values(terms).every(Boolean)
  };
});
const qualifyingPasses = evaluations.filter((record) => record.qualifies)
  .sort((left, right) => right.correspondenceComposite - left.correspondenceComposite);
const nonqualifyingPasses = evaluations.filter((record) => !record.qualifies)
  .sort((left, right) => left.passKey.localeCompare(right.passKey));
const primaryPass = qualifyingPasses[0]?.passKey ?? null;

const categoryByPass = new Map();
for (const [category, passKeys] of Object.entries(control.categoryMap)) {
  for (const passKey of passKeys) categoryByPass.set(passKey, category);
}
const qualifyingCategories = [...new Set(qualifyingPasses.map((record) => categoryByPass.get(record.passKey)))];
const primaryCategoryKey = primaryPass ? categoryByPass.get(primaryPass) : null;
const secondaryCategoryKeys = qualifyingCategories.filter((category) => category !== primaryCategoryKey);
const categoryResult = {
  structuralGeometry: qualifyingCategories.includes('structuralGeometry')
    ? 'STRUCTURAL_GEOMETRY_CAUSE_ESTABLISHED_FOR_CURRENT_METRIC'
    : 'NOT_ESTABLISHED_BY_CURRENT_METRIC',
  geometryLightingInteraction: qualifyingCategories.includes('geometryLightingInteraction')
    ? 'GEOMETRY_LIGHTING_INTERACTION_ESTABLISHED_FOR_CURRENT_METRIC'
    : 'NOT_ESTABLISHED_BY_CURRENT_METRIC',
  cameraVisibleMacroForm: qualifyingCategories.includes('cameraVisibleMacroForm')
    ? 'CAMERA_VISIBLE_MACRO_FORM_CAUSE_ESTABLISHED_FOR_CURRENT_METRIC'
    : 'NOT_ESTABLISHED_BY_CURRENT_METRIC',
  material: qualifyingCategories.includes('material')
    ? 'MATERIAL_CAUSE_ESTABLISHED_FOR_CURRENT_METRIC'
    : 'NOT_ESTABLISHED_BY_CURRENT_METRIC'
};
const primaryCategoryResult = primaryCategoryKey ? categoryResult[primaryCategoryKey] : 'CURRENT_METRIC_INVALID_OR_UNDERDEFINED';
const secondaryCategoryResults = secondaryCategoryKeys.map((category) => categoryResult[category]);

check('QUALIFYING_PASSES_EXACT', JSON.stringify(qualifyingPasses.map((record) => record.passKey).sort()) === JSON.stringify([...control.expectedClassification.qualifyingPasses].sort()), {
  actual: qualifyingPasses.map((record) => record.passKey),
  expected: control.expectedClassification.qualifyingPasses,
  evaluations
});
check('NONQUALIFYING_PASSES_EXACT', JSON.stringify(nonqualifyingPasses.map((record) => record.passKey)) === JSON.stringify([...control.expectedClassification.nonqualifyingPasses].sort()), {
  actual: nonqualifyingPasses.map((record) => record.passKey),
  expected: control.expectedClassification.nonqualifyingPasses
});
check('PRIMARY_PASS_EXACT', primaryPass === control.expectedClassification.primaryPass, { actual: primaryPass, expected: control.expectedClassification.primaryPass });
check('PRIMARY_CATEGORY_EXACT', primaryCategoryResult === control.expectedClassification.primaryCategory, { actual: primaryCategoryResult, expected: control.expectedClassification.primaryCategory });
check('SECONDARY_CATEGORIES_EXACT', JSON.stringify(secondaryCategoryResults.sort()) === JSON.stringify([...control.expectedClassification.secondaryCategories].sort()), {
  actual: secondaryCategoryResults,
  expected: control.expectedClassification.secondaryCategories
});
check('STRUCTURAL_GEOMETRY_DISPOSITION_EXACT', categoryResult.structuralGeometry === control.expectedClassification.structuralGeometryCause, {
  actual: categoryResult.structuralGeometry,
  expected: control.expectedClassification.structuralGeometryCause
});
check('CAMERA_MACRO_FORM_DISPOSITION_EXACT', categoryResult.cameraVisibleMacroForm === control.expectedClassification.cameraVisibleMacroFormCause, {
  actual: categoryResult.cameraVisibleMacroForm,
  expected: control.expectedClassification.cameraVisibleMacroFormCause
});

const packetRaw = fs.readFileSync(PACKET_PATH, 'utf8');
const handoffRaw = fs.readFileSync(HANDOFF_PATH, 'utf8');
const packet = JSON.parse(packetRaw);
const packetSha256 = sha256(packetRaw);
const handoffSha256 = sha256(handoffRaw);
check('PACKET_SCHEMA_EXACT', packet.schemaVersion === 'H_EARTH_METRIC_ATTRIBUTION_RESEARCH_PACKET_v1');
check('PACKET_CHECKPOINT_LEDGER_COMPLETE', Array.isArray(packet.checkpointLedger) && packet.checkpointLedger.map((record) => record.checkpoint).join(',') === 'MA0,MA1,MA2,MA3,MA4,MA5');
check('PACKET_MA5_EVIDENCE_EXACT', packet.checkpointLedger.find((record) => record.checkpoint === 'MA5')?.canonicalReceiptSha256 === control.sourceEvidence.ma5CanonicalReceiptSha256 && packet.checkpointLedger.find((record) => record.checkpoint === 'MA5')?.canonicalMatrixSha256 === control.sourceEvidence.ma5CanonicalMatrixSha256);
check('PACKET_QUALIFYING_PASSES_EXACT', JSON.stringify(packet.causalClassification.qualifyingPasses) === JSON.stringify(control.expectedClassification.qualifyingPasses));
check('PACKET_PRIMARY_RESULT_EXACT', packet.causalClassification.primaryPass === primaryPass && packet.causalClassification.primaryResult === primaryCategoryResult);
check('PACKET_SECONDARY_RESULT_EXACT', packet.causalClassification.secondaryResult === categoryResult.geometryLightingInteraction);
check('PACKET_NO_PRODUCT_AUTHORIZATION', packet.productDisposition.newProductCandidateAuthorized === false && packet.productDisposition.liveAdmissionAuthorized === false && packet.nextAuthorizedResearchOperation.productImplementationAuthorized === false);
check('PACKET_NEXT_OPERATION_EXACT', packet.nextAuthorizedResearchOperation.operationId === control.nextResearchOperation.operationId && packet.nextAuthorizedResearchOperation.primaryQuestion === control.nextResearchOperation.question);
check('PACKET_BOUNDED_RESEARCH_SEQUENCE_EXACT', packet.nextAuthorizedResearchOperation.boundedSequence.map((record) => record.checkpoint).join(',') === 'RMA0,RMA1,RMA2,RMA3');
check('PACKET_RESEARCH_INSTRUCTION_PRESENT', packet.researchRoomInstruction.includes('DO_NOT_AUTHORIZE_ANOTHER_PRESENTATION_OR_TERRAIN_CANDIDATE') && packet.researchRoomInstruction.includes('RMA0_THROUGH_RMA3'));

const requiredHandoffTokens = [
  'METRIC_ATTRIBUTION = MATERIAL_DOMINANT_WITH_GEOMETRY_LIGHTING_SECONDARY',
  'PRIMARY_RESULT = MATERIAL_CAUSE_ESTABLISHED_FOR_CURRENT_METRIC',
  'HUMAN_VISIBLE_DEFECT_CAUSE = NOT_FULLY_ESTABLISHED',
  'NEW_PRODUCT_CANDIDATE_AUTHORIZED = FALSE',
  'H_EARTH_ACCEPTED_CP2_MATERIAL_SUBSIGNAL_ATTRIBUTION_RESEARCH_v1',
  'RMA0 — Freeze material-family authority',
  'RMA1 — One-family diagnostic ablations',
  'RMA2 — Subsignal causal classification',
  'RMA3 — Useful-cue retention',
  control.sourceEvidence.ma5CanonicalReceiptSha256,
  control.sourceEvidence.ma5CanonicalMatrixSha256
];
check('HANDOFF_REQUIRED_CONTENT_COMPLETE', requiredHandoffTokens.every((token) => handoffRaw.includes(token)), {
  missing: requiredHandoffTokens.filter((token) => !handoffRaw.includes(token))
});
check('HANDOFF_NO_PRODUCT_AUTHORIZATION', handoffRaw.includes('DO_NOT_AUTHORIZE_ANOTHER_PRESENTATION_OR_TERRAIN_CANDIDATE') && handoffRaw.includes('Product implementation remains unauthorized'));
check('NO_NEW_RENDERING_OR_PRODUCT_MUTATION', packet.liveStateChanged === false && packet.userDifferentialRequired === false && packet.productDisposition.newProductCandidateAuthorized === false);
check('STOP_BOUNDARY_EXACT', control.boundaries.stop === 'STOP_AFTER_MA6_RESEARCH_HANDOFF_RECEIPT');

const classification = {
  qualifyingPasses: qualifyingPasses.map((record) => record.passKey),
  nonqualifyingPasses: nonqualifyingPasses.map((record) => record.passKey),
  primaryPass,
  primaryCategory: primaryCategoryResult,
  secondaryCategories: secondaryCategoryResults,
  categoryResult,
  metricAttribution: 'MATERIAL_DOMINANT_WITH_GEOMETRY_LIGHTING_SECONDARY',
  currentMetricStatus: control.expectedClassification.currentMetricStatus,
  humanVisibleDefectCause: control.expectedClassification.humanVisibleDefectCause,
  productCandidateAuthorized: false,
  nextAuthorizedResearchOperation: control.nextResearchOperation.operationId
};

const receiptBody = {
  receiptType: 'H_EARTH_MA6_CAUSAL_CLASSIFICATION_AND_RESEARCH_HANDOFF_RECEIPT_v1',
  checkpoint: 'MA6',
  result: failures.length === 0 ? control.result : 'MA6_EXECUTION_INTEGRITY_FAIL',
  passClosed: failures.length === 0,
  baseHead: control.controllingMA5Merge,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  matchGate: gate,
  evaluations,
  classification,
  researchPacketPath: path.relative(ROOT, PACKET_PATH),
  researchPacketSha256: packetSha256,
  researchHandoffPath: path.relative(ROOT, HANDOFF_PATH),
  researchHandoffSha256: handoffSha256,
  productMutationPerformed: false,
  newRenderingPerformed: false,
  liveRouteChanged: false,
  userDifferentialRequired: false,
  productCandidateAuthorized: false,
  stoppingBoundary: control.boundaries.stop,
  resumeToken: failures.length === 0 ? `MA6_PASS_CLOSED@${head}` : `MA6_BLOCKED@${head}`
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
