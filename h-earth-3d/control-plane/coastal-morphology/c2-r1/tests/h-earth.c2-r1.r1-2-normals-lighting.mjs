import fs from 'node:fs';
import path from 'node:path';
import {
  H_EARTH_C2_R1_COASTAL_SURFACE_FRAME,
  evaluateHEarthC2R1CoastalSurfaceFrame,
  sampleHEarthC2R1CoastalSurfaceFrame
} from '../../../../terrain/h-earth.coastal-surface-frame.c2-r1.js';

const outputPath = path.resolve(
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/',
  'h-earth.c2-r1.r1-2-verification.json'
);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const evaluation = evaluateHEarthC2R1CoastalSurfaceFrame({
  xSamples: 25,
  crossShoreStep: 1
});

const witnessCoordinates = [
  [-160, -82],
  [-80, -96],
  [0, -82],
  [80, -106],
  [160, -72]
];
const witnesses = witnessCoordinates.map(([x, z]) =>
  sampleHEarthC2R1CoastalSurfaceFrame(x, z)
);

const checks = {
  sourceProfileIsClosedR11:
    H_EARTH_C2_R1_COASTAL_SURFACE_FRAME.sourceCheckpoint ===
      'R1.1_CONTINUOUS_BEACH_AND_BATHYMETRY',
  failedC2GeometryExcluded:
    H_EARTH_C2_R1_COASTAL_SURFACE_FRAME.sourceProfileContractId ===
      'H_EARTH_C2_R1_CONTINUOUS_COASTAL_PROFILE_v1',
  finiteWitnesses: witnesses.every(sample => sample.valid === true),
  normalsRecomputed:
    evaluation.normalsRecomputed === true &&
    witnesses.every(sample => sample.normalRecomputedAfterDisplacement === true),
  normalLengthsUnit:
    evaluation.maximumNormalLengthError <= 1e-10 &&
    witnesses.every(sample => Math.abs(sample.normalLength - 1) <= 1e-10),
  normalsUpward:
    evaluation.minimumNormalY >= 0.9 &&
    witnesses.every(sample => sample.normal.y > 0),
  crossShoreNormalContinuity:
    evaluation.maximumAdjacentNormalAngleDegrees <= 8,
  alongshoreNormalContinuity:
    evaluation.maximumAlongshoreNormalAngleDegrees <= 12,
  blendSeamNormalContinuity:
    evaluation.maximumBlendSeamNormalAngleDegrees <= 25,
  lightingProjectionFinite:
    witnesses.every(sample =>
      Number.isFinite(sample.lighting.scalar) &&
      Number.isFinite(sample.lighting.directIncidence) &&
      Number.isFinite(sample.lighting.ambientContribution)
    ),
  lightingContinuity:
    evaluation.maximumAdjacentLightingDelta <= 0.16,
  lightingRangeBounded:
    evaluation.minimumLightingScalar >= 0.2 &&
    evaluation.maximumLightingScalar <= 1.25,
  invertedLightingAbsent:
    witnesses.every(sample => sample.lighting.invertedLighting === false),
  materialsDeferred:
    witnesses.every(sample =>
      sample.materialsDeferredToCheckpoint ===
        'R1.3_GRADUAL_SEDIMENT_MEMBERSHIPS'
    ),
  waterOpticsDeferred:
    witnesses.every(sample =>
      sample.waterOpticsDeferredToCheckpoint ===
        'R1.4_ACTUAL_DEPTH_WATER_OPTICS'
    ),
  rendererUnchanged:
    witnesses.every(sample => sample.rendererMutated === false),
  productDefaultUnchanged:
    witnesses.every(sample => sample.productionTerrainMutated === false),
  publicRouteUnchanged:
    witnesses.every(sample => sample.publicRouteMutated === false)
};

const failedChecks = Object.entries(checks)
  .filter(([, passed]) => passed !== true)
  .map(([name]) => name);
const result = evaluation.eligible === true && failedChecks.length === 0
  ? 'PASS_CLOSED'
  : 'HARD_BLOCKED';

const receipt = {
  receiptType: 'H_EARTH_C2_R1_R1_2_NORMALS_AND_LIGHTING_VERIFICATION_v1',
  operation: 'R1.2_RECOMPUTED_NORMALS_AND_LIGHTING',
  result,
  startingHead: '5827a6bf0ac90bafd91ab3b373872313253e3cbc',
  candidateHead: process.env.C2_R1_HEAD ?? null,
  rollbackBranch: 'rollback/h-earth-c2-r1-r1-1-closed-001',
  checks,
  metrics: {
    sampleCount: evaluation.sampleCount,
    transectCount: evaluation.transects.length,
    maximumNormalLengthError: evaluation.maximumNormalLengthError,
    minimumNormalY: evaluation.minimumNormalY,
    maximumAdjacentNormalAngleDegrees:
      evaluation.maximumAdjacentNormalAngleDegrees,
    maximumAlongshoreNormalAngleDegrees:
      evaluation.maximumAlongshoreNormalAngleDegrees,
    maximumBlendSeamNormalAngleDegrees:
      evaluation.maximumBlendSeamNormalAngleDegrees,
    maximumAdjacentLightingDelta:
      evaluation.maximumAdjacentLightingDelta,
    minimumLightingScalar: evaluation.minimumLightingScalar,
    maximumLightingScalar: evaluation.maximumLightingScalar
  },
  normalsRecomputed: true,
  normalContinuityChecked: true,
  lightingProjectionPresent: true,
  materialsChanged: false,
  waterOpticsChanged: false,
  breakersChanged: false,
  rendererChanged: false,
  productDefaultMutated: false,
  publicRouteMutated: false,
  nextCheckpoint:
    result === 'PASS_CLOSED'
      ? 'R1.3_GRADUAL_SEDIMENT_MEMBERSHIPS'
      : 'R1.2_REMAINS_OPEN',
  firstBlocker: failedChecks[0] ?? evaluation.issues?.[0] ?? null,
  evaluationIssues: evaluation.issues,
  witnessCount: witnesses.length
};

fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (result !== 'PASS_CLOSED') process.exitCode = 1;
