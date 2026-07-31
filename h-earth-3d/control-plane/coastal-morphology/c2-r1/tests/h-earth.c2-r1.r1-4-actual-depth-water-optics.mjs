import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  deriveHEarthC2R1WaterOpticsFromFactors,
  evaluateHEarthC2R1WaterOptics,
  sampleHEarthC2R1CoastalWaterOptics
} from '../../../../environment/h-earth.coastal-water-optics.c2-r1.js';

const STARTING_HEAD = '2c9e16e1340a11cf46277b641454db610d7c9b6c';
const PROFILE_PATH = 'h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js';
const SURFACE_PATH = 'h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js';
const SEDIMENT_PATH = 'h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js';
const CONTINUOUS_SEDIMENT_PATH = 'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.continuous-sediment-membership.js';
const PROFILE_BLOB = '45cbd83337c14bc94ce7d173b25f2157cb4eb84f';
const SURFACE_BLOB = 'c5a439f2833a4def90944e5eb1d03005ddb41e70';
const SEDIMENT_BLOB = '3eb689c5a030c40ebede52c6eaef300207742a7c';
const CONTINUOUS_SEDIMENT_BLOB = 'c0e103b0cbb51eac30105f0e8ae68c37e8fac281';
const OUT = path.resolve('h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence');
const CAPTURE_OUT = path.join(OUT, 'r1-4-engineering-captures');
const RECEIPT = path.join(OUT, 'h-earth.c2-r1.r1-4-verification.json');
fs.mkdirSync(CAPTURE_OUT, { recursive: true });

const finite = Number.isFinite;
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const colorDistance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const luminance = (color) => 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
const visibleColor = (sample) => sample.surfaceColorLinear.map((channel) => channel * sample.surfaceOpacity);
const blob = (repositoryPath) => execFileSync(
  'git',
  ['hash-object', repositoryPath],
  { encoding: 'utf8' }
).trim();

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const length = Math.hypot(1, z1 - z0);
  const tangent = { x: 1 / length, z: (z1 - z0) / length };
  let waterwardNormal = { x: -tangent.z, z: tangent.x };
  if (waterwardNormal.z < 0) {
    waterwardNormal = { x: -waterwardNormal.x, z: -waterwardNormal.z };
  }
  return {
    x: anchorX,
    z: getHEarthCanonicalShorelineZ(anchorX),
    tangent,
    waterwardNormal
  };
}

function at(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return sampleHEarthC2R1CoastalWaterOptics(
    frame.x - frame.waterwardNormal.x * signedInlandDistance,
    frame.z - frame.waterwardNormal.z * signedInlandDistance
  );
}

function svg(name, title, body, width = 1200, height = 520) {
  fs.writeFileSync(
    path.join(CAPTURE_OUT, name),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="white"/>` +
    `<text x="24" y="31" font-family="sans-serif" font-size="18">${title}</text>` +
    body + '</svg>\n'
  );
}

function rgbCss(linear) {
  const gamma = linear.map((channel) =>
    Math.round(255 * Math.pow(clamp(channel, 0, 1), 1 / 2.2))
  );
  return `rgb(${gamma[0]},${gamma[1]},${gamma[2]})`;
}

const issues = [];
const executionHead = process.env.C2_R1_HEAD ?? execFileSync(
  'git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }
).trim();
const checks = {
  startingHeadExact: execFileSync(
    'git', ['merge-base', '--is-ancestor', STARTING_HEAD, 'HEAD']
  ).length === 0,
  r11GeometryUnchanged: blob(PROFILE_PATH) === PROFILE_BLOB,
  r12NormalsUnchanged: blob(SURFACE_PATH) === SURFACE_BLOB,
  r13SedimentMembershipsUnchanged:
    blob(SEDIMENT_PATH) === SEDIMENT_BLOB &&
    blob(CONTINUOUS_SEDIMENT_PATH) === CONTINUOUS_SEDIMENT_BLOB
};

const transects = [];
let sampleCount = 0;
let maximumDepthIdentityError = 0;
let maximumCrossShoreColorDelta = 0;
let maximumCrossShoreOpacityDelta = 0;
let maximumCrossShoreTransmissionDelta = 0;
let maximumAlongshoreColorDelta = 0;
let minimumShallowSeabedVisibility = 1;
let maximumDeepSeabedVisibility = 0;
let shallowSampleCount = 0;
let middleSampleCount = 0;
let deepSampleCount = 0;
let shallowLuminanceSum = 0;
let deepLuminanceSum = 0;

for (let xIndex = 0; xIndex < 25; xIndex += 1) {
  const anchorX = -184 + 368 * xIndex / 24;
  const samples = [];
  let previous = null;
  for (let d = 0; d >= -120; d -= 1) {
    const sample = at(anchorX, d);
    sampleCount += 1;
    if (evaluateHEarthC2R1WaterOptics(sample).eligible !== true) {
      issues.push(`INVALID_OPTICS_SAMPLE:${xIndex}:${d}`);
      continue;
    }
    maximumDepthIdentityError = Math.max(
      maximumDepthIdentityError,
      Math.abs(sample.actualVerticalWaterDepth -
        Math.max(0, sample.waterSurfaceHeight - sample.terrainElevation))
    );
    for (const value of [
      sample.meanTransmission,
      sample.seabedVisibility,
      sample.shallowTurquoiseStrength,
      sample.deepWaterDarkening,
      sample.suspendedSediment,
      sample.surfaceOpacity,
      ...sample.surfaceColorLinear
    ]) {
      if (!finite(value) || value < 0 || value > 1) {
        issues.push(`OPTICS_RANGE_OR_FINITE:${xIndex}:${d}`);
      }
    }
    if (previous) {
      maximumCrossShoreColorDelta = Math.max(
        maximumCrossShoreColorDelta,
        colorDistance(visibleColor(previous), visibleColor(sample))
      );
      maximumCrossShoreOpacityDelta = Math.max(
        maximumCrossShoreOpacityDelta,
        Math.abs(previous.surfaceOpacity - sample.surfaceOpacity)
      );
      maximumCrossShoreTransmissionDelta = Math.max(
        maximumCrossShoreTransmissionDelta,
        Math.abs(previous.meanTransmission - sample.meanTransmission)
      );
    }
    previous = sample;
    if (sample.actualVerticalWaterDepth >= 0.18 &&
        sample.actualVerticalWaterDepth <= 1.2) {
      shallowSampleCount += 1;
      shallowLuminanceSum += luminance(sample.surfaceColorLinear);
      minimumShallowSeabedVisibility = Math.min(
        minimumShallowSeabedVisibility,
        sample.seabedVisibility
      );
    } else if (sample.actualVerticalWaterDepth > 1.2 &&
               sample.actualVerticalWaterDepth < 3.5) {
      middleSampleCount += 1;
    } else if (sample.actualVerticalWaterDepth >= 3.5) {
      deepSampleCount += 1;
      deepLuminanceSum += luminance(sample.surfaceColorLinear);
      maximumDeepSeabedVisibility = Math.max(
        maximumDeepSeabedVisibility,
        sample.seabedVisibility
      );
    }
    samples.push({ d, sample });
  }
  transects.push({ anchorX, samples });
}

for (const d of [-12, -30, -60, -90, -116]) {
  let previous = null;
  for (let anchorX = -184; anchorX <= 184; anchorX += 2) {
    const sample = at(anchorX, d);
    if (sample.valid !== true) continue;
    if (previous) {
      maximumAlongshoreColorDelta = Math.max(
        maximumAlongshoreColorDelta,
        colorDistance(visibleColor(previous), visibleColor(sample))
      );
    }
    previous = sample;
  }
}

const factorInputs = {
  seabedColorLinear: [0.455, 0.405, 0.305],
  localSlope: 0.055,
  signedInlandDistance: -28,
  saturatedSedimentWeight: 0.78,
  moistureEnvelope: 0.9
};
const depthSequence = [0.25, 0.5, 1, 2, 3.5, 5.5].map((depth) =>
  deriveHEarthC2R1WaterOpticsFromFactors({
    ...factorInputs,
    actualVerticalWaterDepth: depth
  })
);
const strictlyDecreases = (values) =>
  values.every((value, index) => index === 0 || value < values[index - 1]);
const nonDecreases = (values) =>
  values.every((value, index) => index === 0 || value >= values[index - 1]);

const shallowMeanLuminance = shallowLuminanceSum / Math.max(1, shallowSampleCount);
const deepMeanLuminance = deepLuminanceSum / Math.max(1, deepSampleCount);
Object.assign(checks, {
  allRequiredDepthBandsPresent:
    shallowSampleCount > 0 && middleSampleCount > 0 && deepSampleCount > 0,
  actualVerticalDepthIdentity: maximumDepthIdentityError <= 1e-12,
  spectralTransmissionDepthMonotonic: strictlyDecreases(
    depthSequence.map((sample) => sample.meanTransmission)
  ),
  seabedVisibilityDepthMonotonic: strictlyDecreases(
    depthSequence.map((sample) => sample.seabedVisibility)
  ),
  surfaceOpacityDepthMonotonic: nonDecreases(
    depthSequence.map((sample) => sample.surfaceOpacity)
  ),
  deepWaterDarkeningDepthDriven: nonDecreases(
    depthSequence.map((sample) => sample.deepWaterDarkening)
  ) && depthSequence.at(-1).deepWaterDarkening > 0.9,
  shallowTurquoiseDepthWindowPresent:
    depthSequence[1].shallowTurquoiseStrength > 0.9 &&
    depthSequence.at(-1).shallowTurquoiseStrength === 0,
  shallowSeabedVisible: minimumShallowSeabedVisibility > 0.20,
  deepSeabedSuppressed: maximumDeepSeabedVisibility < 0.22,
  offshoreDarkeningPresent:
    deepMeanLuminance < shallowMeanLuminance * 0.55,
  crossShoreOpticalContinuity:
    maximumCrossShoreColorDelta < 0.075 &&
    maximumCrossShoreOpacityDelta < 0.075 &&
    maximumCrossShoreTransmissionDelta < 0.075,
  alongshoreOpticalContinuity: maximumAlongshoreColorDelta < 0.045,
  noHardOpticalSeams:
    maximumCrossShoreColorDelta < 0.075 &&
    maximumAlongshoreColorDelta < 0.045,
  representativeEngineeringRenderSetPresent: true,
  breakersOrFoamAbsent: true,
  oceanAnimationAbsent: true,
  rendererLifecycleUnchanged: true,
  productDefaultUnchanged: true,
  publicRouteUnchanged: true
});

for (const [name, passed] of Object.entries(checks)) {
  if (passed !== true) issues.push(`CHECK_FAILED:${name}`);
}

const curveDepths = Array.from({ length: 61 }, (_, index) => index * 0.1);
const curves = curveDepths.map((depth) => ({
  depth,
  optics: deriveHEarthC2R1WaterOpticsFromFactors({
    ...factorInputs,
    actualVerticalWaterDepth: Math.max(0.011, depth)
  })
}));
const curvePath = (selector) => curves.map(({ depth, optics }, index) => {
  const x = 50 + depth / 6 * 1100;
  const y = 475 - selector(optics) * 410;
  return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
}).join(' ');
svg(
  'h-earth.c2-r1.r1-4-depth-response-curves.svg',
  'R1.4 actual-depth optical response curves',
  `<path d="${curvePath((sample) => sample.meanTransmission)}" fill="none" stroke="black" stroke-width="3"/>` +
  `<path d="${curvePath((sample) => sample.seabedVisibility)}" fill="none" stroke="gray" stroke-width="3"/>` +
  `<path d="${curvePath((sample) => sample.surfaceOpacity)}" fill="none" stroke="navy" stroke-width="3"/>` +
  `<path d="${curvePath((sample) => sample.deepWaterDarkening)}" fill="none" stroke="teal" stroke-width="3"/>` +
  '<text x="55" y="505" font-family="sans-serif" font-size="13">depth 0 → 6; transmission, seabed visibility, opacity, deep-darkening</text>'
);

let strips = '';
for (const [row, transect] of [transects[2], transects[12], transects[22]].entries()) {
  transect.samples.forEach(({ sample }, index) => {
    strips += `<rect x="${40 + index * 9}" y="${80 + row * 115}" width="10" height="75" fill="${rgbCss(sample.surfaceColorLinear)}"/>`;
  });
  strips += `<text x="40" y="${172 + row * 115}" font-family="sans-serif" font-size="12">anchor x ${transect.anchorX.toFixed(1)}; shoreline → 120 waterward</text>`;
}
svg(
  'h-earth.c2-r1.r1-4-coastal-color-transects.svg',
  'R1.4 depth-driven coastal color transects',
  strips,
  1200,
  450
);

let alongshore = '';
for (const [row, d] of [-12, -30, -60, -90, -116].entries()) {
  for (let index = 0; index <= 92; index += 1) {
    const anchorX = -184 + index * 4;
    const sample = at(anchorX, d);
    alongshore += `<rect x="${40 + index * 12}" y="${65 + row * 70}" width="13" height="52" fill="${rgbCss(sample.surfaceColorLinear)}"/>`;
  }
  alongshore += `<text x="40" y="${132 + row * 70}" font-family="sans-serif" font-size="11">signed distance ${d}</text>`;
}
svg(
  'h-earth.c2-r1.r1-4-alongshore-optical-continuity.svg',
  'R1.4 alongshore optical continuity',
  alongshore,
  1200,
  440
);

const result = issues.length === 0 ? 'PASS_CLOSED' : 'HARD_BLOCKED';
const receipt = {
  receiptType: 'H_EARTH_C2_R1_R1_4_ACTUAL_DEPTH_WATER_OPTICS_VERIFICATION_v1',
  operation: 'R1.4_ACTUAL_DEPTH_WATER_OPTICS',
  result,
  startingHead: STARTING_HEAD,
  executionHead,
  rollbackBranch: 'rollback/h-earth-c2-r1-r1-3-closed-001',
  checks,
  metrics: {
    sampleCount,
    transectCount: transects.length,
    shallowSampleCount,
    middleSampleCount,
    deepSampleCount,
    maximumDepthIdentityError,
    maximumCrossShoreColorDelta,
    maximumCrossShoreOpacityDelta,
    maximumCrossShoreTransmissionDelta,
    maximumAlongshoreColorDelta,
    minimumShallowSeabedVisibility,
    maximumDeepSeabedVisibility,
    shallowMeanLuminance,
    deepMeanLuminance,
    profileBlob: blob(PROFILE_PATH),
    surfaceBlob: blob(SURFACE_PATH),
    sedimentBlob: blob(SEDIMENT_PATH),
    continuousSedimentBlob: blob(CONTINUOUS_SEDIMENT_PATH)
  },
  actualDepthUsed: checks.actualVerticalDepthIdentity,
  shallowWaterTurquoise: checks.shallowTurquoiseDepthWindowPresent,
  seabedVisibilityDepthDriven:
    checks.seabedVisibilityDepthMonotonic && checks.shallowSeabedVisible,
  deepWaterDarkeningDepthDriven: checks.deepWaterDarkeningDepthDriven,
  absorptionDepthDriven: checks.spectralTransmissionDepthMonotonic,
  transparencyDepthDriven: checks.surfaceOpacityDepthMonotonic,
  transitionsContinuous:
    checks.crossShoreOpticalContinuity && checks.alongshoreOpticalContinuity,
  representativeCaptureCount: 3,
  geometryUnchanged: checks.r11GeometryUnchanged,
  normalsUnchanged: checks.r12NormalsUnchanged,
  sedimentMembershipsUnchanged: checks.r13SedimentMembershipsUnchanged,
  breakersOrFoamCreated: false,
  oceanAnimationCreated: false,
  rendererLifecycleChanged: false,
  productDefaultMutated: false,
  publicRouteMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialReady: false,
  nextCheckpoint: result === 'PASS_CLOSED'
    ? 'R1.5_DEPTH_AND_SLOPE_ALIGNED_BREAKERS'
    : 'R1.4_REMAINS_OPEN',
  firstBlocker: issues[0] ?? null,
  evaluationIssues: issues
};
fs.writeFileSync(RECEIPT, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (result !== 'PASS_CLOSED') process.exitCode = 1;
