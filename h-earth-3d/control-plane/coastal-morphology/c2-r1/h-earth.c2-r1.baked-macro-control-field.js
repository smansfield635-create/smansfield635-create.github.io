/**
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
{
  "contractId": "H_EARTH_C2_R1_BOUNDED_BAKED_MACRO_CONTROL_FIELD_v1",
  "checkpoint": "R1.7B_BOUNDED_BAKED_MACRO_CONTROL_FIELD",
  "startingHead": "0498da0f3f4fe522659830499bd55ef8f018f776",
  "sourceContractId": "H_EARTH_C2_R1_LANDFORM_ANALYSIS_AND_MACRO_FIELD_CONTRACT_v1",
  "field": {
    "alongshoreMinimum": -184,
    "alongshoreMaximum": 184,
    "signedInlandMinimum": -120,
    "signedInlandMaximum": 140,
    "alongshoreCount": 17,
    "crossShoreCount": 53,
    "channelCount": 4,
    "channels": [
      "ALBEDO_SCALE",
      "ROUGHNESS_OFFSET",
      "CAVITY_RESPONSE",
      "MACRO_NORMAL_STRENGTH"
    ],
    "encoding": "FLOAT32_LITTLE_ENDIAN_BASE64",
    "byteLength": 14416,
    "valuesSha256": "4377ff9e9fc60a6218478b289acbff99075eab08d4e518a6eb68b1a12b98f866",
    "sampleCount": 901
  },
  "bakeLaw": {
    "source": "CLOSED_R1_7A_NINE_CHANNEL_LANDFORM_ANALYSIS",
    "smoothing": "BOUNDED_SEPARABLE_BINOMIAL_PRECOMPUTE_ONLY",
    "periodicNoiseUsed": false,
    "randomNoiseUsed": false,
    "textureTilingUsed": false,
    "contourBandsUsed": false,
    "wholeWorldBakeCreated": false
  },
  "ownership": {
    "ownsBakedMacroControlField": true,
    "ownsRuntimeSamplingIntegration": false,
    "ownsTerrainGeometry": false,
    "ownsNormals": false,
    "ownsSedimentMemberships": false,
    "ownsWaterOptics": false,
    "ownsBreakerOrSwashLaw": false,
    "ownsRendererLifecycle": false,
    "ownsCameraOrTraversal": false,
    "ownsPublicRouteOrProductDefault": false
  },
  "metrics": {
    "sampleCount": 901,
    "validSampleCount": 901,
    "channelCount": 4,
    "byteLength": 14416,
    "minimums": [
      0.9929890632629395,
      -0.001788585213944316,
      0.937113881111145,
      0.00023114337818697095
    ],
    "maximums": [
      1.0126736164093018,
      0.027586497366428375,
      0.9991306662559509,
      0.015268031507730484
    ],
    "maximumAdjacentCrossShoreDelta": [
      0.004016876220703125,
      0.004267003852874041,
      0.009975969791412354,
      0.002381899394094944
    ],
    "maximumAdjacentAlongshoreDelta": [
      0.004949331283569336,
      0.003945456817746162,
      0.00701063871383667,
      0.0010737888514995575
    ],
    "maximumSecondDifference": [
      0.0021359920501708984,
      0.0029896851629018784,
      0.004972934722900391,
      0.0009413594380021095
    ]
  }
}
);

export const H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_BASE64 =
  '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';

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
