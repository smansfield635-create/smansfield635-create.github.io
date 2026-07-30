import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CONTROL_PATH = path.join(
  ROOT,
  'h-earth-3d/control-plane/traversal-scene-suite/' +
  'h-earth.gratitude-region.traversal-scene-suite.cp2-round1-presentation.v1.json'
);
const RECEIPT_PATH = path.join(
  ROOT,
  'h-earth-3d/validation/' +
  'h-earth.gratitude-region.traversal-scene-suite.cp2-round1-presentation.receipt.v1.json'
);

const control = JSON.parse(fs.readFileSync(CONTROL_PATH, 'utf8'));
const receipt = JSON.parse(fs.readFileSync(RECEIPT_PATH, 'utf8'));
const targeted = control.targetedCorrection;
const sceneById = new Map(receipt.scenes.map((record) => [record.scene.id, record]));
const checkById = new Map(receipt.checks.map((record) => [record.id, record]));
const lowDifferentiation = (record) =>
  record.pixels.sampledColorBucketCount < 8 ||
  record.pixels.luminanceStandardDeviation < 2 ||
  record.pixels.meanAdjacentChannelDifference < 0.2;
const ratio = (actual, basis) => actual / Math.max(0.000001, basis);
const targetedChecks = [];
const addCheck = (id, passed, detail = null) => {
  targetedChecks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail });
  return passed;
};
const requiredExistingChecks = [
  'CP1_INTEGRATED_PROGRAM_HEAD_IS_ANCESTOR',
  'CP2_DELTA_IS_AUTHORIZED',
  'TERRAIN_ENVIRONMENT_INTEGRATION_AND_OBJECT_SOURCES_UNCHANGED',
  'SUBSTANTIVE_PRODUCT_MUTATION_IS_RENDERER_ONLY',
  'CP1_BASELINE_RECEIPT_CLOSED',
  'BROWSER_EXECUTION_CLEAN',
  'ALL_EIGHT_SCENES_EXECUTED',
  'ALL_SCENE_CAMERAS_REMAIN_LAWFUL',
  'ALL_AUTHORIZED_TARGETS_REMAIN_IN_FRAME',
  'EIGHT_DISTINCT_CAMERA_FRAME_EXECUTIONS',
  'ALL_FRAMEBUFFER_READBACKS_EXECUTED',
  'ALL_SCREENSHOTS_CAPTURED',
  'PRESENTATION_PROFILE_ACTIVE',
  'CANONICAL_RENDER_PACKAGE_IDENTITY_PRESERVED',
  'PERSISTENT_GPU_RESOURCE_LIFECYCLE_PRESERVED',
  'ALL_CANDIDATE_FRAME_HASHES_DIFFER_FROM_BASELINE',
  'ALL_CANDIDATE_FRAMEBUFFERS_ALPHA_CLOSED',
  'AGGREGATE_COLOR_DIFFERENTIATION_IMPROVED',
  'AGGREGATE_EDGE_SIGNAL_IMPROVED'
];
const existingGateFailures = requiredExistingChecks.filter(
  (id) => checkById.get(id)?.passed !== true
);
addCheck(
  'EXISTING_CP2_EXECUTION_AND_AUTHORITY_GATES_PASS',
  existingGateFailures.length === 0,
  { requiredExistingChecks, failures: existingGateFailures }
);

const lowScenes = receipt.scenes.filter(lowDifferentiation);
addCheck(
  'MAXIMUM_LOW_DIFFERENTIATION_SCENES',
  lowScenes.length <= targeted.acceptance.maximumLowDifferentiationSceneCount,
  {
    actual: lowScenes.length,
    maximum: targeted.acceptance.maximumLowDifferentiationSceneCount,
    sceneIds: lowScenes.map((record) => record.scene.id)
  }
);

const scene07 = sceneById.get('SCENE_07_MANOR_SITE_APPROACH');
addCheck(
  'SCENE_07_COLOR_BUCKETS_MINIMUM',
  scene07?.pixels?.sampledColorBucketCount >= targeted.acceptance.scene07MinimumColorBuckets,
  {
    actual: scene07?.pixels?.sampledColorBucketCount ?? null,
    minimum: targeted.acceptance.scene07MinimumColorBuckets
  }
);
addCheck(
  'SCENE_07_EDGE_SIGNAL_MINIMUM',
  scene07?.pixels?.meanAdjacentChannelDifference >= targeted.acceptance.scene07MinimumEdgeSignal,
  {
    actual: scene07?.pixels?.meanAdjacentChannelDifference ?? null,
    minimum: targeted.acceptance.scene07MinimumEdgeSignal
  }
);

const regressionRecords = targeted.regressionSceneIds.map((id) => {
  const current = sceneById.get(id);
  const basis = targeted.controlledBasisSceneMetrics[id];
  const colorRatio = ratio(current?.pixels?.sampledColorBucketCount ?? 0, basis.sampledColorBucketCount);
  const edgeRatio = ratio(current?.pixels?.meanAdjacentChannelDifference ?? 0, basis.meanAdjacentChannelDifference);
  const luminanceStdRatio = ratio(
    current?.pixels?.luminanceStandardDeviation ?? 0,
    basis.luminanceStandardDeviation
  );
  return {
    id,
    current: current ? {
      sampledColorBucketCount: current.pixels.sampledColorBucketCount,
      meanAdjacentChannelDifference: current.pixels.meanAdjacentChannelDifference,
      luminanceStandardDeviation: current.pixels.luminanceStandardDeviation
    } : null,
    basis,
    retention: { colorRatio, edgeRatio, luminanceStdRatio },
    passed:
      Boolean(current) &&
      colorRatio >= targeted.acceptance.regressionMinimumColorBucketRetentionRatio &&
      edgeRatio >= targeted.acceptance.regressionMinimumEdgeSignalRetentionRatio &&
      luminanceStdRatio >= targeted.acceptance.regressionMinimumLuminanceStandardDeviationRetentionRatio
  };
});
const regressionPass = regressionRecords.every((record) => record.passed);
addCheck('SCENES_03_04_06_REGRESSION', regressionPass, {
  thresholds: {
    colorBucketRetention: targeted.acceptance.regressionMinimumColorBucketRetentionRatio,
    edgeSignalRetention: targeted.acceptance.regressionMinimumEdgeSignalRetentionRatio,
    luminanceStandardDeviationRetention:
      targeted.acceptance.regressionMinimumLuminanceStandardDeviationRetentionRatio
  },
  scenes: regressionRecords
});

const targetSceneValues = targeted.targetSceneIds.map((id) => {
  const current = sceneById.get(id);
  const basis = targeted.controlledBasisTargetSceneMetrics[id];
  return {
    id,
    current: current ? {
      sampledColorBucketCount: current.pixels.sampledColorBucketCount,
      meanAdjacentChannelDifference: current.pixels.meanAdjacentChannelDifference,
      luminanceStandardDeviation: current.pixels.luminanceStandardDeviation,
      lowDifferentiation: lowDifferentiation(current)
    } : null,
    controlledBasis: basis,
    delta: current ? {
      colorBuckets: current.pixels.sampledColorBucketCount - basis.sampledColorBucketCount,
      edgeSignal:
        current.pixels.meanAdjacentChannelDifference - basis.meanAdjacentChannelDifference,
      luminanceStandardDeviation:
        current.pixels.luminanceStandardDeviation - basis.luminanceStandardDeviation
    } : null
  };
});
addCheck(
  'TARGET_SCENE_VALUES_REPORTED',
  targetSceneValues.every((record) => record.current !== null),
  { scenes: targetSceneValues }
);

const passEngineering = targetedChecks.every((record) => record.passed);
const basisLowCount = targeted.controlledBasisAggregate.lowDifferentiationSceneCount;
const targetEdgeImprovementCount = targetSceneValues.filter(
  (record) => (record.delta?.edgeSignal ?? Number.NEGATIVE_INFINITY) > 0
).length;
const targetColorImprovementCount = targetSceneValues.filter(
  (record) => (record.delta?.colorBuckets ?? Number.NEGATIVE_INFINITY) > 0
).length;
const materialImprovement =
  lowScenes.length < basisLowCount ||
  targetEdgeImprovementCount >= 3 ||
  targetColorImprovementCount >= 3;

let disposition;
if (passEngineering) disposition = 'PASS_ENGINEERING';
else if (!regressionPass) disposition = 'REGRESSION_ROLLBACK';
else if (materialImprovement) disposition = 'PARTIAL_IMPROVEMENT_REMAINS_BLOCKED';
else disposition = 'NO_MATERIAL_IMPROVEMENT_STOP';

if (!targeted.dispositions.includes(disposition)) {
  throw new Error(`CP2_TARGETED_DISPOSITION_OUT_OF_DOMAIN:${disposition}`);
}

receipt.targetedCorrection = {
  operation: targeted.operation,
  controlledBasisHead: control.repository.controlledCorrectionBasisHead,
  disposition,
  targetSceneIds: targeted.targetSceneIds,
  regressionSceneIds: targeted.regressionSceneIds,
  checks: targetedChecks,
  targetSceneValues,
  regressionRecords,
  acceptanceGatesChanged: false,
  frozenWorldAuthoritiesChanged: false,
  cp2MergeAuthorized: false,
  userDifferentialAuthorized: false,
  liveCandidateAuthorized: disposition === 'PASS_ENGINEERING'
};
receipt.result =
  disposition === 'PASS_ENGINEERING'
    ? 'PASS_ENGINEERING_AWAITING_LIVE_DIFFERENTIAL_CANDIDATE'
    : 'BLOCKED';
receipt.closure = {
  ...(receipt.closure ?? {}),
  checkpointClosed: false,
  disposition,
  cp2MergeAuthorized: false,
  userDifferentialAuthorized: false,
  liveCandidateAuthorized: disposition === 'PASS_ENGINEERING',
  stoppingBoundary:
    disposition === 'PASS_ENGINEERING'
      ? 'STOP_BEFORE_MERGE_AND_CREATE_SEPARATE_LIVE_DIFFERENTIAL_CANDIDATE'
      : 'STOP_AT_TARGETED_ENGINEERING_CORRECTION_BOUNDARY'
};

fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({
  checkpoint: receipt.checkpoint,
  result: receipt.result,
  disposition,
  lowDifferentiationSceneCount: lowScenes.length,
  targetEdgeImprovementCount,
  targetColorImprovementCount,
  targetedChecks
}, null, 2));
process.exit(disposition === 'PASS_ENGINEERING' ? 0 : 1);
