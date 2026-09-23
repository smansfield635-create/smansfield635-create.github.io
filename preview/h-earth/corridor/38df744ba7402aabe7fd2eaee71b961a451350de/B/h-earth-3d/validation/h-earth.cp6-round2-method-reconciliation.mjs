import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import authority from '../control-plane/post-cp2-round2/h-earth.cp6-round2-method-reconciliation.v1.mjs';
import metric from '../control-plane/post-cp2-round2/h-earth.cp6-geometry-conditioned-material-repetition-metric.v1.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const outputPath = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.join(ROOT, 'h-earth-3d/validation/h-earth.cp6-round2-method-reconciliation.receipt.v1.json');
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, status: passed ? 'PASS' : 'FAIL', passed, detail };
  checks.push(record);
  if (!passed) failures.push({ id, detail });
};
const close = (a, b, epsilon = 1e-12) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= epsilon;
const isDeepFrozen = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  seen.add(value);
  if (!Object.isFrozen(value)) return false;
  return Object.values(value).every((member) => isDeepFrozen(member, seen));
};

const expectedPaths = [
  '.github/workflows/h-earth-cp6-round2-method-reconciliation.yml',
  'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp6-geometry-conditioned-material-repetition-metric.v1.mjs',
  'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp6-round2-method-reconciliation.v1.mjs',
  'h-earth-3d/validation/h-earth.cp6-round2-method-reconciliation.mjs'
].sort();
const changedPaths = git(['diff', '--name-only', `${authority.controllingBasis.mainHeadAtCheckpointStart}..HEAD`])
  .split(/\r?\n/).filter(Boolean).sort();
check('EXACT_CP6_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), {
  changedPaths,
  expectedPaths
});
check('NO_PRODUCT_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), {
  productPaths: changedPaths.filter((entry) => entry.startsWith('showroom/'))
});

check('AUTHORITY_DEEP_FROZEN', isDeepFrozen(authority));
check('METRIC_DEEP_FROZEN', isDeepFrozen(metric));
check('AUTHORITY_IDENTITY', authority.schemaVersion === 'H_EARTH_CP6_ROUND_2_METHOD_RECONCILIATION_v1');
check('METRIC_IDENTITY', metric.schemaVersion === 'H_EARTH_CP6_GEOMETRY_CONDITIONED_MATERIAL_REPETITION_METRIC_v1');
check('CP6_CHECKPOINT_NUMBER', authority.checkpoint === 6);

const cp4Path = 'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp4-round2-landscape-presentation-authority.v1.mjs';
const acceptedRendererPath = authority.controllingBasis.acceptedCp2RendererPath;
const cp4Blob = git(['hash-object', cp4Path]);
const acceptedRendererBlob = git(['hash-object', acceptedRendererPath]);
check('CP4_AUTHORITY_PRESERVED', cp4Blob === '1532f48559657854a6613a12afbd0788ad402f53', { cp4Blob });
check('ACCEPTED_CP2_RENDERER_PRESERVED', acceptedRendererBlob === authority.controllingBasis.acceptedCp2RendererBlob, {
  acceptedRendererBlob,
  expected: authority.controllingBasis.acceptedCp2RendererBlob
});

const first = authority.cp5Evidence.firstCandidate;
const second = authority.cp5Evidence.secondCandidate;
check('CP5_FIRST_DISPOSITION_PRESERVED',
  first.head === 'f0fb7648fb9b1c72e39136a6d06c372ae1a92a1d' &&
  first.disposition === 'ROUND2_REGRESSION_ROLLBACK' &&
  first.artifactId === 8748129731 &&
  first.artifactSha256 === '4570cac7be4ae32bd18668692a75df8e2bf7dc839308ec6032950e1482c4b69e');
check('CP5_SECOND_DISPOSITION_PRESERVED',
  second.head === '1aa268d222633e0919075cfb2e540365a98be095' &&
  second.disposition === 'ROUND2_NO_MATERIAL_IMPROVEMENT_STOP' &&
  second.artifactId === 8748222464 &&
  second.artifactSha256 === '7d5da11c97f02dd77cc7a023915f91314dac1530f130a338c97a143812d45f97');
check('CP5_NOT_REOPENED_OR_RECLASSIFIED',
  authority.checkpointBoundary.cp5Reopened === false &&
  authority.checkpointBoundary.cp5DispositionChanged === false &&
  metric.supersessionLaw.cp4Checkpoint5DispositionReclassified === false &&
  metric.supersessionLaw.cp4GateWeakenedRetroactively === false);

for (const band of ['micro', 'meso', 'macro']) {
  const record = second.aggregateBandEvidence[band];
  check(`CP5_${band.toUpperCase()}_RATIO_RECOMPUTES`, close(record.candidate / record.acceptedCp2, record.ratio), record);
}
check('CP5_MACRO_BAND_CONFUNDING_ESTABLISHED',
  second.aggregateBandEvidence.macro.acceptedCp2 > 0.98 &&
  second.aggregateBandEvidence.macro.candidate > 0.98 &&
  second.aggregateBandEvidence.macro.ratio > 0.99,
  second.aggregateBandEvidence.macro);
check('CP5_FULL_FRAME_AGGREGATE_DID_NOT_MATERIALLY_MOVE',
  second.unresolvedGates.fullFrameRepetitionAggregateRatio > 0.99 &&
  second.unresolvedGates.requiredAggregateMaximum === 0.85,
  second.unresolvedGates);
check('CP5_SECOND_CANDIDATE_RESTORED_RUNTIME_GATES',
  second.acceptedGatesRestored.browserClean === true &&
  second.acceptedGatesRestored.allEightScenes === true &&
  second.acceptedGatesRestored.deterministicMotionReplay === true &&
  second.acceptedGatesRestored.medianPerformanceRatioVersusCp2 <= 1.15 &&
  second.acceptedGatesRestored.p95PerformanceRatioVersusCp2 <= 1.2 &&
  second.acceptedGatesRestored.webglContextLossCount === 0 &&
  second.acceptedGatesRestored.canonicalPackageAndGpuLifecyclePreserved === true);

check('DIAGNOSIS_IS_EXACT_AND_ACTIONABLE',
  authority.diagnosis.finalDiagnosis ===
    'THE_NEXT_ATTEMPT_REQUIRES_PRECOMPUTED_TERRAIN_STRUCTURE_CONTROL_AND_A_MATERIAL_RESIDUAL_METRIC_NOT_MORE_UNBOUNDED_FRAGMENT_NOISE');
check('EXTERNAL_RESEARCH_BASIS_PRESENT',
  authority.externalResearchBasis.some((entry) => entry.doi === '10.1111/cgf.14992') &&
  authority.externalResearchBasis.some((entry) => entry.authority === 'KHRONOS_WEBGL_WORKING_GROUP'));

const method = authority.selectedCheckpoint7Method;
check('ONE_REVISED_METHOD_SELECTED',
  method.methodId === 'H_EARTH_PRECOMPUTED_TERRAIN_CONTROL_FIELD_AND_BAND_LIMITED_MATERIAL_SYNTHESIS_v1');
check('CONTROL_FIELD_DERIVES_FROM_FROZEN_HEIGHTFIELD_WITHOUT_MUTATION',
  method.controlField.sourceAuthority === 'EXISTING_FROZEN_RUN_8B_SUCCESSOR_HEIGHTFIELD' &&
  method.controlField.geometryMutation === false &&
  method.controlField.heightfieldMutation === false &&
  method.controlField.worldAuthorityMutation === false &&
  method.controlField.deterministicGenerationRequired === true &&
  method.controlField.canonicalDigestRequired === true);
check('CONTROL_FIELD_CHANNELS_COMPLETE',
  Object.keys(method.controlField.channels).sort().join(',') === 'alpha,blue,green,red');
check('MOBILE_SHADER_BUDGET_FIXED',
  method.mobileBudget.maximumNewPersistentTextures === 1 &&
  method.mobileBudget.maximumBaseTextureBytes === 262144 &&
  method.mobileBudget.maximumNewTextureSamplesPerTerrainFragment === 3 &&
  method.mobileBudget.dynamicProceduralOctaveLoops === 0 &&
  method.mobileBudget.contextLossCount === 0);
check('ACCEPTED_CP2_PRESENTATION_TERMS_MUST_REMAIN',
  method.rendererUse.includes('PRESERVE_ALL_ACCEPTED_CP2_COLOR_EDGE_MANOR_CAVERN_AND_CONTACT_TERMS'));

check('GEOMETRY_CONDITIONED_METRIC_REMOVES_SHARED_CARRIER',
  metric.carrierRemoval.materialResidual === 'LOG_LUMINANCE_MINUS_ITS_GAUSSIAN_SIGMA_24_CARRIER' &&
  metric.pairedInputs.terrainMask.includes('DEPTH_DISCONTINUITY_EXCLUSION'));
check('GEOMETRY_CONDITIONED_METRIC_FIXED_GATES',
  metric.gates.candidateAggregateMaximumRelativeToAcceptedCp2 === 0.85 &&
  metric.gates.candidatePerSceneMaximumRelativeToAcceptedCp2 === 1.05 &&
  metric.gates.gateMayBeChangedAfterCheckpoint7Execution === false);
check('ORIGINAL_CP4_METRIC_RETAINED_AS_DIAGNOSTIC',
  authority.checkpoint7Gates.originalCp4Metric.retainedAsDiagnostic === true &&
  authority.checkpoint7Gates.originalCp4Metric.perSceneMaximumRelativeToCp2 === 1.05 &&
  authority.checkpoint7Gates.originalCp4Metric.cp5DispositionMayBeReclassified === false);

check('CHECKPOINT_7_MUTATION_BOUNDARY_EXACT',
  JSON.stringify(authority.checkpoint7MutationBoundary.authorizedProductTargets) === JSON.stringify([
    'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
  ]) &&
  authority.checkpoint7MutationBoundary.liveAdmissionAuthorized === false &&
  authority.checkpoint7MutationBoundary.liveDefaultPromotionAuthorized === false);
check('MORPHOLOGY_AND_ATMOSPHERE_REMAIN_DEFERRED',
  authority.deferred.geometryDisplacementOrHeightfieldEnhancement.startsWith('DEFERRED_') &&
  authority.deferred.atmosphericDepth.startsWith('DEFERRED_'));
check('CP6_STOPPING_BOUNDARY',
  authority.checkpointBoundary.productMutationPerformed === false &&
  authority.checkpointBoundary.liveStateChanged === false &&
  authority.checkpointBoundary.checkpoint7AuthorizedAfterCp6Merge === true &&
  authority.checkpointBoundary.checkpoint7Started === false &&
  authority.checkpointBoundary.result === 'CP6_METHOD_RECONCILIATION_PASS_CLOSED');

const stableReceipt = {
  receiptType: 'H_EARTH_CP6_ROUND_2_METHOD_RECONCILIATION_RECEIPT_v1',
  checkpoint: 6,
  result: failures.length === 0 ? 'CP6_METHOD_RECONCILIATION_PASS_CLOSED' : 'CP6_METHOD_RECONCILIATION_FAIL',
  pass: failures.length === 0,
  repositoryBasis: authority.controllingBasis.mainHeadAtCheckpointStart,
  executedHead: git(['rev-parse', 'HEAD']),
  changedPaths,
  cp5Evidence: {
    first: { head: first.head, disposition: first.disposition, artifactId: first.artifactId, artifactSha256: first.artifactSha256 },
    second: { head: second.head, disposition: second.disposition, artifactId: second.artifactId, artifactSha256: second.artifactSha256 }
  },
  diagnosis: authority.diagnosis.finalDiagnosis,
  selectedMethod: method.methodId,
  geometryConditionedMetric: metric.schemaVersion,
  checkpoint7Authorized: failures.length === 0,
  liveStateChanged: false,
  productMutationPerformed: false,
  checks,
  failureCount: failures.length,
  failures
};
const canonical = JSON.stringify(stableReceipt);
const receipt = {
  ...stableReceipt,
  canonicalSha256: crypto.createHash('sha256').update(canonical).digest('hex')
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.pass) process.exitCode = 1;
