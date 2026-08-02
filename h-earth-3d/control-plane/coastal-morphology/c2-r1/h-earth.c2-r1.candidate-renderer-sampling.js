/**
 * H_EARTH_C2_R1_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION_v1
 *
 * Candidate-only R1.7C material sampling adapter with the authorized R1.7D-C2
 * downstream ULP-safe darkening-floor reconciliation. It binds the closed
 * R1.7B baked macro-control field through one clamped bilinear runtime sample
 * and applies only bounded albedo, roughness, and cavity/AO responses to the
 * established C2-R1 candidate material output. The optional macro-normal
 * channel remains exposed but unapplied, so accepted normal authority remains
 * unchanged.
 */

import {
  H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID,
  H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD,
  copyHEarthC2R1BakedMacroControlFieldValues
} from './h-earth.c2-r1.baked-macro-control-field.js';
import {
  H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  sampleHEarthC2R1ContinuousCoastalSedimentMembership
} from './h-earth.c2-r1.continuous-sediment-membership.js';
import {
  H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sampleHEarthC2R1CoastalTerrainField
} from '../../../terrain/h-earth.coastal-profile.c2-r1.js';
import {
  H_EARTH_C2_R1_SWASH_FOAM_WETNESS_CONTRACT_ID,
  sampleHEarthC2R1CoastalSwashFoamWetness
} from '../../../environment/h-earth.coastal-swash-foam-wetness.c2-r1.js';

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = value => clamp(value, 0, 1);
const mix = (a, b, t) => a + (b - a) * t;
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach(nested => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const FIELD = H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD.field;
const FIELD_VALUES = copyHEarthC2R1BakedMacroControlFieldValues();
const CHANNEL_INDEX = freeze(Object.fromEntries(
  FIELD.channels.map((channel, index) => [channel, index])
));
const R1_7D_C2_REQUIRED_MINIMUM_LUMINANCE_RATIO = 0.9981642262491339;
const R1_7D_C2_IMPLEMENTATION_SAFETY_MARGIN = 1e-12;
const R1_7D_C2_TARGET_ALBEDO_SCALE_FLOOR = 0.9981642262501339;
const CHANNEL_BOUNDS = freeze({
  ALBEDO_SCALE: freeze([R1_7D_C2_TARGET_ALBEDO_SCALE_FLOOR, 1.07]),
  ROUGHNESS_OFFSET: freeze([-0.045, 0.065]),
  CAVITY_RESPONSE: freeze([0.84, 1]),
  MACRO_NORMAL_STRENGTH: freeze([0, 0.035])
});

export const H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID =
  'H_EARTH_C2_R1_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION_v1';

export const H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING = freeze({
  contractId: H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
  checkpoint: 'R1.7C_MINIMAL_CANDIDATE_RENDERER_SAMPLING_INTEGRATION',
  downstreamCorrectiveSuccessor: freeze({
    checkpoint: 'R1.7D_C2_ULP_SAFE_DARKENING_FLOOR_RECONCILIATION',
    historicalR17CClosurePreserved: true,
    correctionType: 'BOUNDED_ALBEDO_RESPONSE_FLOOR',
    requiredMinimumLuminanceRatio:
      R1_7D_C2_REQUIRED_MINIMUM_LUMINANCE_RATIO,
    implementationSafetyMargin: R1_7D_C2_IMPLEMENTATION_SAFETY_MARGIN,
    targetMeasuredRatio: R1_7D_C2_TARGET_ALBEDO_SCALE_FLOOR,
    appliedAlbedoScaleFloor: CHANNEL_BOUNDS.ALBEDO_SCALE[0]
  }),
  sourceFieldContractId:
    H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID,
  sourceProfileContractId: H_EARTH_C2_R1_COASTAL_PROFILE_CONTRACT_ID,
  sourceSedimentContractId: H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  sourceSwashContractId: H_EARTH_C2_R1_SWASH_FOAM_WETNESS_CONTRACT_ID,
  resourceBinding: freeze({
    kind: 'STATIC_MODULE_BOUND_FLOAT32_FIELD',
    valuesSha256: FIELD.valuesSha256,
    byteLength: FIELD.byteLength,
    sampleCount: FIELD.sampleCount,
    channelCount: FIELD.channelCount,
    runtimeCopiesPerMaterialEvaluation: 0
  }),
  runtimeSampling: freeze({
    sampleOperationsPerMaterialEvaluation: 1,
    interpolation: 'BILINEAR',
    coordinateAddressing: 'CLAMP_TO_EDGE',
    periodicCoordinatesUsed: false,
    textureTilingUsed: false,
    contourBandsUsed: false
  }),
  channelApplication: freeze({
    applied: freeze([
      'ALBEDO_SCALE',
      'ROUGHNESS_OFFSET',
      'CAVITY_RESPONSE'
    ]),
    optionalAvailableButNotApplied: freeze([
      'MACRO_NORMAL_STRENGTH'
    ]),
    bounds: CHANNEL_BOUNDS
  }),
  ownership: freeze({
    ownsCandidateRendererMaterialSampling: true,
    ownsControlFieldResourceBinding: true,
    ownsOneSampleCoordinateMapping: true,
    ownsBoundedChannelApplication: true,
    ownsTerrainGeometry: false,
    ownsNormalRecomputation: false,
    ownsSedimentMemberships: false,
    ownsWaterOptics: false,
    ownsBreakerOrSwashLaw: false,
    ownsRendererLifecycle: false,
    ownsCameraOrTraversal: false,
    ownsPublicRouteOrProductDefault: false
  })
});

function fieldIndex(alongshoreIndex, crossShoreIndex, channelIndex) {
  return (
    crossShoreIndex * FIELD.alongshoreCount + alongshoreIndex
  ) * FIELD.channelCount + channelIndex;
}

function channelValue(alongshoreIndex, crossShoreIndex, channelIndex) {
  return FIELD_VALUES[fieldIndex(
    alongshoreIndex,
    crossShoreIndex,
    channelIndex
  )];
}

function sampleBilinearChannel(x0, x1, y0, y1, tx, ty, channelIndex) {
  const a = mix(
    channelValue(x0, y0, channelIndex),
    channelValue(x1, y0, channelIndex),
    tx
  );
  const b = mix(
    channelValue(x0, y1, channelIndex),
    channelValue(x1, y1, channelIndex),
    tx
  );
  return mix(a, b, ty);
}

function boundedChannel(channel, value) {
  const [minimum, maximum] = CHANNEL_BOUNDS[channel];
  return clamp(value, minimum, maximum);
}

export function sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(
  anchorX,
  signedInlandDistance
) {
  if (!finite(anchorX) || !finite(signedInlandDistance)) {
    return freeze({
      valid: false,
      status: 'C2_R1_MACRO_CONTROL_RUNTIME_SAMPLE_REJECTED',
      anchorX,
      signedInlandDistance,
      issues: freeze(['MACRO_CONTROL_COORDINATE_NOT_FINITE'])
    });
  }

  const u = clamp(
    (anchorX - FIELD.alongshoreMinimum) /
      (FIELD.alongshoreMaximum - FIELD.alongshoreMinimum),
    0,
    1
  );
  const v = clamp(
    (signedInlandDistance - FIELD.signedInlandMinimum) /
      (FIELD.signedInlandMaximum - FIELD.signedInlandMinimum),
    0,
    1
  );
  const x = u * (FIELD.alongshoreCount - 1);
  const y = v * (FIELD.crossShoreCount - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, FIELD.alongshoreCount - 1);
  const y1 = Math.min(y0 + 1, FIELD.crossShoreCount - 1);
  const tx = x - x0;
  const ty = y - y0;

  const channels = {};
  for (const channel of FIELD.channels) {
    channels[channel] = boundedChannel(
      channel,
      sampleBilinearChannel(
        x0,
        x1,
        y0,
        y1,
        tx,
        ty,
        CHANNEL_INDEX[channel]
      )
    );
  }

  return freeze({
    valid: true,
    status: 'C2_R1_MACRO_CONTROL_RUNTIME_SAMPLE_COMPLETE',
    sourceContractId: H_EARTH_C2_R1_BAKED_MACRO_CONTROL_FIELD_CONTRACT_ID,
    sourceValuesSha256: FIELD.valuesSha256,
    anchorX,
    signedInlandDistance,
    normalizedCoordinate: freeze({ u, v }),
    interpolation: 'BILINEAR',
    coordinateAddressing: 'CLAMP_TO_EDGE',
    runtimeSampleCount: 1,
    texelFetchCount: 4,
    periodicCoordinatesUsed: false,
    textureTilingUsed: false,
    contourBandsUsed: false,
    channels: freeze(channels),
    issues: freeze([])
  });
}

function reject(worldX, worldZ, timeSeconds, issues) {
  return freeze({
    valid: false,
    status: 'C2_R1_CANDIDATE_RENDERER_MATERIAL_SAMPLE_REJECTED',
    contractId: H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
    worldX,
    worldZ,
    timeSeconds,
    issues: freeze(issues)
  });
}

export function sampleHEarthC2R1CandidateRendererMaterial(
  worldX,
  worldZ,
  { timeSeconds = 0 } = {}
) {
  if (!finite(worldX) || !finite(worldZ) || !finite(timeSeconds)) {
    return reject(worldX, worldZ, timeSeconds, [
      'CANDIDATE_RENDERER_SAMPLE_INPUT_NOT_FINITE'
    ]);
  }

  const terrain = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  const sediment =
    sampleHEarthC2R1ContinuousCoastalSedimentMembership(worldX, worldZ);
  const swash = sampleHEarthC2R1CoastalSwashFoamWetness(
    worldX,
    worldZ,
    { timeSeconds }
  );

  if (terrain?.valid !== true || !terrain.coastalFrame ||
      sediment?.valid !== true || swash?.valid !== true) {
    return reject(worldX, worldZ, timeSeconds, [
      'R1_1_R1_3_OR_R1_6_CANDIDATE_INPUT_NOT_ELIGIBLE'
    ]);
  }

  const macroControl = sampleHEarthC2R1BakedMacroControlAtCoastalCoordinate(
    terrain.coastalFrame.anchorX,
    terrain.coastalFrame.signedInlandDistance
  );
  if (macroControl.valid !== true) {
    return reject(worldX, worldZ, timeSeconds, [
      'R1_7B_MACRO_CONTROL_RUNTIME_SAMPLE_FAILED'
    ]);
  }

  const baseColorLinear = sediment.material.colorLinear.map(clamp01);
  const wetnessDarkening = clamp01(swash.wetSandColorDarkening);
  const wetnessRoughnessReduction = clamp01(
    swash.wetSandRoughnessReduction
  );
  const baseMaterialBeforeMacro = freeze({
    colorLinear: freeze(baseColorLinear.map(channel =>
      clamp01(channel * (1 - wetnessDarkening))
    )),
    roughness: clamp01(
      sediment.material.roughness - wetnessRoughnessReduction
    ),
    metallic: clamp01(sediment.material.metallic),
    luminous: false
  });

  const albedoScale = macroControl.channels.ALBEDO_SCALE;
  const roughnessOffset = macroControl.channels.ROUGHNESS_OFFSET;
  const cavityResponse = macroControl.channels.CAVITY_RESPONSE;
  const macroNormalStrength =
    macroControl.channels.MACRO_NORMAL_STRENGTH;
  const material = freeze({
    colorLinear: freeze(baseMaterialBeforeMacro.colorLinear.map(channel =>
      clamp01(channel * albedoScale)
    )),
    roughness: clamp01(
      baseMaterialBeforeMacro.roughness + roughnessOffset
    ),
    metallic: baseMaterialBeforeMacro.metallic,
    cavityOrAmbientOcclusion: clamp(cavityResponse, 0.84, 1),
    luminous: false,
    macroNormalStrengthAvailable: macroNormalStrength,
    macroNormalApplied: false
  });

  return freeze({
    valid: true,
    status: 'C2_R1_CANDIDATE_RENDERER_MATERIAL_SAMPLE_COMPLETE',
    contractId: H_EARTH_C2_R1_CANDIDATE_RENDERER_SAMPLING_CONTRACT_ID,
    sourceProfileContractId: terrain.contractId,
    sourceSedimentContractId: sediment.contractId,
    sourceSwashContractId: swash.contractId,
    sourceMacroControlContractId: macroControl.sourceContractId,
    world: freeze({ x: worldX, y: terrain.world.y, z: worldZ }),
    timeSeconds,
    coastalCoordinate: freeze({
      anchorX: terrain.coastalFrame.anchorX,
      signedInlandDistance: terrain.coastalFrame.signedInlandDistance
    }),
    controlFieldSampleCount: 1,
    macroControl,
    baseMaterialBeforeMacro,
    material,
    preservedCandidateResponses: freeze({
      foamIntensity: swash.foamIntensity,
      foamOpacity: swash.foamOpacity,
      foamColorLinear: swash.foamColorLinear,
      temporaryWetness: swash.temporaryWetness,
      waterSurfaceOpacity: swash.waterOptics.surfaceOpacity,
      waterSurfaceColorLinear: swash.waterOptics.surfaceColorLinear
    }),
    appliedMacroChannels: freeze([
      'ALBEDO_SCALE',
      'ROUGHNESS_OFFSET',
      'CAVITY_RESPONSE'
    ]),
    optionalMacroNormalApplied: false,
    controlFieldBoundToCandidateRenderer: true,
    singleRuntimeSampleConfirmed: true,
    boundedMacroChannelApplicationConfirmed: true,
    upstreamAuthoritiesMutated: false,
    terrainGeometryMutated: false,
    normalRecomputationPerformed: false,
    sedimentMembershipsMutated: false,
    waterOpticsMutated: false,
    breakerOrSwashLawMutated: false,
    rendererLifecycleMutated: false,
    cameraOrTraversalMutated: false,
    publicRouteMutated: false,
    productDefaultMutated: false,
    visualSuccessorStatus: 'NOT_ESTABLISHED',
    userDifferentialReady: false,
    issues: freeze([])
  });
}

export default sampleHEarthC2R1CandidateRendererMaterial;
