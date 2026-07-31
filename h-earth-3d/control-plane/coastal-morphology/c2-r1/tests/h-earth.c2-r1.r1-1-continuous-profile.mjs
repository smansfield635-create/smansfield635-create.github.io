import fs from 'node:fs';
import path from 'node:path';
import {
  H_EARTH_C2_R1_COASTAL_PROFILE,
  evaluateHEarthC2R1CoastalProfile,
  sampleHEarthC2R1CoastalTerrainField
} from '../../../../terrain/h-earth.coastal-profile.c2-r1.js';

const outputPath = path.resolve(
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/',
  'h-earth.c2-r1.r1-1-verification.json'
);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const evaluation = evaluateHEarthC2R1CoastalProfile({
  xSamples: 25,
  crossShoreStep: 0.5
});

const witnessCoordinates = [
  [-192, -72],
  [-96, -84],
  [0, -82],
  [96, -84],
  [192, -72]
];
const witnesses = witnessCoordinates.map(([x, z]) =>
  sampleHEarthC2R1CoastalTerrainField(x, z)
);

const checks = {
  sourceBaselineExact:
    H_EARTH_C2_R1_COASTAL_PROFILE.startingBaselineHead ===
      '4bc08c26548c36ab9fd96bdaead7434ca08cf8ac',
  failedC2GeometryExcluded:
    H_EARTH_C2_R1_COASTAL_PROFILE.failedC2GeometryConsumed === false,
  continuousProfileUsed: evaluation.continuousProfileUsed === true,
  finiteWitnesses: witnesses.every(sample => sample.valid === true),
  shorelineContinuous: evaluation.maximumShorelineElevationError <= 0.08,
  adjacentStepBounded: evaluation.maximumAdjacentStep <= 0.09,
  slopeBounded: evaluation.maximumAbsoluteSlope <= 0.22,
  curvatureBounded: evaluation.maximumAbsoluteCurvature <= 0.08,
  broadSandbarMeasurable: evaluation.minimumSandbarWidth >= 28,
  actualVerticalDepthAvailable:
    witnesses.every(sample => Number.isFinite(sample.actualVerticalWaterDepth)),
  normalsDeferredToR12:
    witnesses.every(sample =>
      sample.normalsDeferredToCheckpoint ===
        'R1.2_RECOMPUTED_NORMALS_AND_LIGHTING'
    ),
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
  receiptType: 'H_EARTH_C2_R1_R1_1_CONTINUOUS_PROFILE_VERIFICATION_v1',
  operation: 'R1.1_CONTINUOUS_BEACH_AND_BATHYMETRY',
  result,
  startingBaselineHead:
    '4bc08c26548c36ab9fd96bdaead7434ca08cf8ac',
  candidateHead: process.env.C2_R1_HEAD ?? null,
  checks,
  metrics: {
    transectCount: evaluation.transectCount,
    crossShoreStep: evaluation.crossShoreStep,
    maximumShorelineElevationError:
      evaluation.maximumShorelineElevationError,
    maximumAdjacentStep: evaluation.maximumAdjacentStep,
    maximumAbsoluteSlope: evaluation.maximumAbsoluteSlope,
    maximumAbsoluteCurvature: evaluation.maximumAbsoluteCurvature,
    minimumSandbarWidth: evaluation.minimumSandbarWidth
  },
  actualDepthUsed: true,
  continuousProfileUsed: true,
  normalsRecomputed: false,
  materialsChanged: false,
  waterOpticsChanged: false,
  breakersChanged: false,
  rendererChanged: false,
  productDefaultMutated: false,
  publicRouteMutated: false,
  nextCheckpoint:
    result === 'PASS_CLOSED'
      ? 'R1.2_RECOMPUTED_NORMALS_AND_LIGHTING'
      : 'R1.1_REMAINS_OPEN',
  firstBlocker:
    failedChecks[0] ?? evaluation.issues?.[0] ?? null,
  evaluationIssues: evaluation.issues,
  witnessCount: witnesses.length
};

fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (result !== 'PASS_CLOSED') process.exitCode = 1;
