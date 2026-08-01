#!/usr/bin/env node
/**
 * H_EARTH_C2_R1_R1_7B_BAKED_MACRO_CONTROL_FIELD_GENERATOR_v1
 *
 * Offline-only deterministic bake from the closed R1.7A landform-analysis
 * contract. It writes one bounded static Float32 field. It creates no renderer
 * binding, runtime interpolation authority, geometry displacement, route, or
 * product-default mutation.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID,
  sampleHEarthC2R1LandformAnalysis
} from '../h-earth.c2-r1.landform-analysis.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../');
const OUTPUT_PATH = path.join(
  ROOT,
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/h-earth.c2-r1.baked-macro-control-field.js'
);
const SUMMARY_PATH = path.join(
  ROOT,
  'h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/h-earth.c2-r1.r1-7b-bake-summary.json'
);

const STARTING_HEAD = '0498da0f3f4fe522659830499bd55ef8f018f776';
const ALONGSHORE_MINIMUM = -184;
const ALONGSHORE_MAXIMUM = 184;
const ALONGSHORE_COUNT = 17;
const SIGNED_INLAND_MINIMUM = -120;
const SIGNED_INLAND_MAXIMUM = 140;
const CROSS_SHORE_COUNT = 53;
const CHANNELS = Object.freeze([
  'ALBEDO_SCALE',
  'ROUGHNESS_OFFSET',
  'CAVITY_RESPONSE',
  'MACRO_NORMAL_STRENGTH'
]);
const CHANNEL_COUNT = CHANNELS.length;

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = value => clamp(value, 0, 1);
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const finite = value => typeof value === 'number' && Number.isFinite(value);
const indexOf = (alongIndex, crossIndex, channel) =>
  (crossIndex * ALONGSHORE_COUNT + alongIndex) * CHANNEL_COUNT + channel;

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const tangentX = 2 * step;
  const tangentZ = z1 - z0;
  const length = Math.hypot(tangentX, tangentZ);
  const tangent = { x: tangentX / length, z: tangentZ / length };
  let waterwardNormal = { x: -tangent.z, z: tangent.x };
  if (waterwardNormal.z < 0) {
    waterwardNormal = {
      x: -waterwardNormal.x,
      z: -waterwardNormal.z
    };
  }
  return {
    shoreline: { x: anchorX, z: getHEarthCanonicalShorelineZ(anchorX) },
    inlandNormal: {
      x: -waterwardNormal.x,
      z: -waterwardNormal.z
    }
  };
}

function worldAt(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return {
    x: frame.shoreline.x + frame.inlandNormal.x * signedInlandDistance,
    z: frame.shoreline.z + frame.inlandNormal.z * signedInlandDistance
  };
}

function deriveControls(sample) {
  const c = sample.channels;
  const inlandMacroWeight = 0.12 + 0.88 * c.inlandTransition;
  const moistureProtection = 1 - 0.52 * c.coastalMoistureInfluence;
  const macroWeight = clamp01(inlandMacroWeight * moistureProtection);

  const relief =
    0.58 * (c.elevationNormalized - 0.5) +
    0.24 * c.convexity -
    0.28 * c.concavity +
    0.12 * c.drainageTendency;
  const albedoScale = clamp(
    1 + macroWeight * 0.055 * relief,
    0.94,
    1.07
  );
  const roughnessOffset = clamp(
    macroWeight * (
      0.055 * c.slopeNormalized +
      0.026 * c.convexity +
      0.018 * c.drainageTendency -
      0.042 * c.coastalMoistureInfluence
    ),
    -0.045,
    0.065
  );
  const cavityResponse = clamp(
    1 - macroWeight * (
      0.13 * c.cavityAOHint +
      0.045 * c.drainageTendency +
      0.025 * c.concavity
    ),
    0.84,
    1
  );
  const macroNormalStrength = clamp(
    macroWeight * 0.045 * (
      0.62 * c.macroNormalStrengthHint +
      0.22 * c.slopeNormalized +
      0.16 * (c.concavity + c.convexity)
    ),
    0,
    0.035
  );
  return [
    albedoScale,
    roughnessOffset,
    cavityResponse,
    macroNormalStrength
  ];
}

function smoothChannel(values, channel, passes) {
  let current = new Float32Array(ALONGSHORE_COUNT * CROSS_SHORE_COUNT);
  for (let y = 0; y < CROSS_SHORE_COUNT; y += 1) {
    for (let x = 0; x < ALONGSHORE_COUNT; x += 1) {
      current[y * ALONGSHORE_COUNT + x] = values[indexOf(x, y, channel)];
    }
  }
  for (let pass = 0; pass < passes; pass += 1) {
    const horizontal = new Float32Array(current.length);
    const vertical = new Float32Array(current.length);
    for (let y = 0; y < CROSS_SHORE_COUNT; y += 1) {
      for (let x = 0; x < ALONGSHORE_COUNT; x += 1) {
        const xm = Math.max(0, x - 1);
        const xp = Math.min(ALONGSHORE_COUNT - 1, x + 1);
        horizontal[y * ALONGSHORE_COUNT + x] =
          (current[y * ALONGSHORE_COUNT + xm] +
           2 * current[y * ALONGSHORE_COUNT + x] +
           current[y * ALONGSHORE_COUNT + xp]) / 4;
      }
    }
    for (let y = 0; y < CROSS_SHORE_COUNT; y += 1) {
      const ym = Math.max(0, y - 1);
      const yp = Math.min(CROSS_SHORE_COUNT - 1, y + 1);
      for (let x = 0; x < ALONGSHORE_COUNT; x += 1) {
        vertical[y * ALONGSHORE_COUNT + x] =
          (horizontal[ym * ALONGSHORE_COUNT + x] +
           2 * horizontal[y * ALONGSHORE_COUNT + x] +
           horizontal[yp * ALONGSHORE_COUNT + x]) / 4;
      }
    }
    current = vertical;
  }
  for (let y = 0; y < CROSS_SHORE_COUNT; y += 1) {
    for (let x = 0; x < ALONGSHORE_COUNT; x += 1) {
      values[indexOf(x, y, channel)] = current[y * ALONGSHORE_COUNT + x];
    }
  }
}

function buildBake() {
  const values = new Float32Array(
    ALONGSHORE_COUNT * CROSS_SHORE_COUNT * CHANNEL_COUNT
  );
  const sourceVectors = [];
  let validSampleCount = 0;

  for (let crossIndex = 0; crossIndex < CROSS_SHORE_COUNT; crossIndex += 1) {
    const signedInlandDistance =
      SIGNED_INLAND_MINIMUM +
      (SIGNED_INLAND_MAXIMUM - SIGNED_INLAND_MINIMUM) *
      crossIndex / (CROSS_SHORE_COUNT - 1);

    for (let alongIndex = 0; alongIndex < ALONGSHORE_COUNT; alongIndex += 1) {
      const anchorX =
        ALONGSHORE_MINIMUM +
        (ALONGSHORE_MAXIMUM - ALONGSHORE_MINIMUM) *
        alongIndex / (ALONGSHORE_COUNT - 1);
      const world = worldAt(anchorX, signedInlandDistance);
      const sample = sampleHEarthC2R1LandformAnalysis(world.x, world.z);
      if (sample?.valid !== true) {
        throw new Error(
          `R1_7B_INVALID_R1_7A_SAMPLE:${alongIndex}:${crossIndex}`
        );
      }
      const controls = deriveControls(sample);
      if (!controls.every(finite)) {
        throw new Error(
          `R1_7B_NONFINITE_CONTROL:${alongIndex}:${crossIndex}`
        );
      }
      sourceVectors.push(sample.macroFieldSourceVector);
      for (let channel = 0; channel < CHANNEL_COUNT; channel += 1) {
        values[indexOf(alongIndex, crossIndex, channel)] = controls[channel];
      }
      validSampleCount += 1;
    }
  }

  smoothChannel(values, 0, 3);
  smoothChannel(values, 1, 3);
  smoothChannel(values, 2, 4);
  smoothChannel(values, 3, 3);

  const bytes = Buffer.from(values.buffer);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  return {
    values,
    valuesBase64: bytes.toString('base64'),
    valuesSha256: sha256,
    validSampleCount,
    sourceVectors
  };
}

function computeMetrics(values) {
  const metrics = {
    sampleCount: ALONGSHORE_COUNT * CROSS_SHORE_COUNT,
    validSampleCount: ALONGSHORE_COUNT * CROSS_SHORE_COUNT,
    channelCount: CHANNEL_COUNT,
    byteLength: values.byteLength,
    minimums: Array(CHANNEL_COUNT).fill(Number.POSITIVE_INFINITY),
    maximums: Array(CHANNEL_COUNT).fill(Number.NEGATIVE_INFINITY),
    maximumAdjacentCrossShoreDelta: Array(CHANNEL_COUNT).fill(0),
    maximumAdjacentAlongshoreDelta: Array(CHANNEL_COUNT).fill(0),
    maximumSecondDifference: Array(CHANNEL_COUNT).fill(0)
  };

  for (let y = 0; y < CROSS_SHORE_COUNT; y += 1) {
    for (let x = 0; x < ALONGSHORE_COUNT; x += 1) {
      for (let channel = 0; channel < CHANNEL_COUNT; channel += 1) {
        const value = values[indexOf(x, y, channel)];
        metrics.minimums[channel] = Math.min(metrics.minimums[channel], value);
        metrics.maximums[channel] = Math.max(metrics.maximums[channel], value);
        if (x + 1 < ALONGSHORE_COUNT) {
          metrics.maximumAdjacentAlongshoreDelta[channel] = Math.max(
            metrics.maximumAdjacentAlongshoreDelta[channel],
            Math.abs(value - values[indexOf(x + 1, y, channel)])
          );
        }
        if (y + 1 < CROSS_SHORE_COUNT) {
          metrics.maximumAdjacentCrossShoreDelta[channel] = Math.max(
            metrics.maximumAdjacentCrossShoreDelta[channel],
            Math.abs(value - values[indexOf(x, y + 1, channel)])
          );
        }
        if (x > 0 && x + 1 < ALONGSHORE_COUNT) {
          metrics.maximumSecondDifference[channel] = Math.max(
            metrics.maximumSecondDifference[channel],
            Math.abs(
              values[indexOf(x - 1, y, channel)] -
              2 * value +
              values[indexOf(x + 1, y, channel)]
            )
          );
        }
        if (y > 0 && y + 1 < CROSS_SHORE_COUNT) {
          metrics.maximumSecondDifference[channel] = Math.max(
            metrics.maximumSecondDifference[channel],
            Math.abs(
              values[indexOf(x, y - 1, channel)] -
              2 * value +
              values[indexOf(x, y + 1, channel)]
            )
          );
        }
      }
    }
  }
  return metrics;
}

function renderModule(bake, metrics) {
  const metadata = {
    contractId: 'H_EARTH_C2_R1_BOUNDED_BAKED_MACRO_CONTROL_FIELD_v1',
    checkpoint: 'R1.7B_BOUNDED_BAKED_MACRO_CONTROL_FIELD',
    startingHead: STARTING_HEAD,
    sourceContractId: H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID,
    field: {
      alongshoreMinimum: ALONGSHORE_MINIMUM,
      alongshoreMaximum: ALONGSHORE_MAXIMUM,
      signedInlandMinimum: SIGNED_INLAND_MINIMUM,
      signedInlandMaximum: SIGNED_INLAND_MAXIMUM,
      alongshoreCount: ALONGSHORE_COUNT,
      crossShoreCount: CROSS_SHORE_COUNT,
      channelCount: CHANNEL_COUNT,
      channels: CHANNELS,
      encoding: 'FLOAT32_LITTLE_ENDIAN_BASE64',
      byteLength: bake.values.byteLength,
      valuesSha256: bake.valuesSha256,
      sampleCount: ALONGSHORE_COUNT * CROSS_SHORE_COUNT
    },
    bakeLaw: {
      source: 'CLOSED_R1_7A_NINE_CHANNEL_LANDFORM_ANALYSIS',
      smoothing: 'BOUNDED_SEPARABLE_BINOMIAL_PRECOMPUTE_ONLY',
      periodicNoiseUsed: false,
      randomNoiseUsed: false,
      textureTilingUsed: false,
      contourBandsUsed: false,
      wholeWorldBakeCreated: false
    },
    ownership: {
      ownsBakedMacroControlField: true,
      ownsRuntimeSamplingIntegration: false,
      ownsTerrainGeometry: false,
      ownsNormals: false,
      ownsSedimentMemberships: false,
      ownsWaterOptics: false,
      ownsBreakerOrSwashLaw: false,
      ownsRendererLifecycle: false,
      ownsCameraOrTraversal: false,
      ownsPublicRouteOrProductDefault: false
    },
    metrics
  };

  return `/**
 * H_EARTH_C2_R1_BOUNDED_BAKED_MACRO_CONTROL_FIELD_v1
 *
 * Generated deterministically by the R1.7B offline bake. This module contains
 * static candidate-only control bytes and metadata. It intentionally exposes
 * no runtime interpolation or renderer-binding authority; R1.7C owns that work.
 */

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach(nested => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

export const H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID =
  'H_EARTH_C2_R1_BOUNDED_BAKED_MACRO_CONTROL_FIELD_v1';

export const H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD = freeze(
${JSON.stringify(metadata, null, 2)}
);

export const H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_BASE64 =
  '${bake.valuesBase64}';

function decodeBase64(base64) {
  if (typeof Buffer !== 'undefined') {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
  }
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function copyHEarthC2R1BakedMacroControlFieldValues() {
  const bytes = decodeBase64(H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_BASE64);
  if (bytes.byteLength !== H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.field.byteLength) {
    throw new Error('R1_7B_BAKED_FIELD_BYTE_LENGTH_MISMATCH');
  }
  return new Float32Array(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  );
}

export default H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD;
`;
}

const bake = buildBake();
const metrics = computeMetrics(bake.values);
const moduleSource = renderModule(bake, metrics);
const summary = {
  operation: 'R1.7B_BOUNDED_BAKED_MACRO_CONTROL_FIELD',
  startingHead: STARTING_HEAD,
  sourceContractId: H_EARTH_C2_R1_LANDFORM_ANALYSIS_CONTRACT_ID,
  result: 'BAKE_COMPLETE',
  valuesSha256: bake.valuesSha256,
  metrics,
  rendererSamplingIntegrationCreated: false,
  productDefaultMutated: false,
  publicRouteMutated: false,
  visualSuccessorStatus: 'NOT_ESTABLISHED',
  userDifferentialReady: false
};

const mode = process.argv[2] ?? '--write';
if (mode === '--write') {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(SUMMARY_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, moduleSource);
  fs.writeFileSync(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
} else if (mode === '--check') {
  const current = fs.readFileSync(OUTPUT_PATH, 'utf8');
  if (current !== moduleSource) {
    throw new Error('R1_7B_BAKED_FIELD_NOT_DETERMINISTIC');
  }
  console.log(JSON.stringify(summary, null, 2));
} else {
  throw new Error(`R1_7B_UNKNOWN_MODE:${mode}`);
}
