/**
 * H_EARTH_C2_R1_COASTAL_MACRO_MATERIAL_SAMPLER_v1
 *
 * Candidate-only minimal material-sampling adapter. It performs one bounded
 * macro-control-field lookup, composes that result with immutable R1.2 surface
 * and R1.3 sediment facts, and returns material values for later R1.8 renderer
 * integration. It owns no renderer lifecycle, draw loop, route, or product
 * default.
 */

import {
  sampleHEarthC2R1CoastalSurfaceFrame
} from '../terrain/h-earth.coastal-surface-frame.c2-r1.js';
import {
  sampleHEarthC2R1CoastalSedimentMembership
} from '../terrain/h-earth.coastal-sediment-membership.c2-r1.js';
import {
  H_EARTH_C2_R1_MACRO_EXPRESSION_CONTRACT_ID,
  sampleHEarthC2R1MacroExpression
} from '../terrain/h-earth.coastal-macro-expression.c2-r1.js';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const freeze = value => Object.freeze(value);
const normalize = vector => {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  if (!(length > Number.EPSILON)) return { x: 0, y: 1, z: 0 };
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
};

export const H_EARTH_C2_R1_COASTAL_MACRO_MATERIAL_SAMPLER_CONTRACT_ID =
  'H_EARTH_C2_R1_COASTAL_MACRO_MATERIAL_SAMPLER_v1';

export const H_EARTH_C2_R1_COASTAL_MACRO_MATERIAL_SAMPLER = freeze({
  contractId: H_EARTH_C2_R1_COASTAL_MACRO_MATERIAL_SAMPLER_CONTRACT_ID,
  sourceMacroContractId: H_EARTH_C2_R1_MACRO_EXPRESSION_CONTRACT_ID,
  checkpoint: 'R1.7_BOUNDED_TERRAIN_MACRO_EXPRESSION',
  integrationClass: 'CANDIDATE_ONLY_SINGLE_CONTROL_FIELD_SAMPLE',
  controlFieldSamplesPerEvaluation: 1,
  rendererLifecycleOwned: false,
  publicRendererBound: false,
  publicRouteBound: false,
  productDefaultBound: false
});

export function sampleHEarthC2R1CoastalMacroMaterial(
  worldX,
  worldZ,
  { baseAmbientOcclusion = 1 } = {}
) {
  const surface = sampleHEarthC2R1CoastalSurfaceFrame(worldX, worldZ);
  const sediment = sampleHEarthC2R1CoastalSedimentMembership(worldX, worldZ);
  const macro = sampleHEarthC2R1MacroExpression(worldX, worldZ);
  if (surface?.valid !== true || sediment?.valid !== true || macro?.valid !== true) {
    return freeze({
      valid: false,
      status: 'C2_R1_COASTAL_MACRO_MATERIAL_REJECTED',
      contractId: H_EARTH_C2_R1_COASTAL_MACRO_MATERIAL_SAMPLER_CONTRACT_ID,
      worldX,
      worldZ
    });
  }

  const colorLinear = sediment.material.colorLinear.map(channel =>
    clamp(channel * macro.albedoScale, 0, 1)
  );
  const roughness = clamp(
    sediment.material.roughness + macro.roughnessOffset,
    0.42,
    0.98
  );
  const ambientOcclusion = clamp(
    baseAmbientOcclusion * macro.cavityResponse,
    0.7,
    1
  );
  const normal = normalize({
    x: surface.normal.x + macro.macroNormalDetail.x,
    y: surface.normal.y,
    z: surface.normal.z + macro.macroNormalDetail.z
  });

  return freeze({
    valid: true,
    status: 'C2_R1_COASTAL_MACRO_MATERIAL_COMPLETE',
    contractId: H_EARTH_C2_R1_COASTAL_MACRO_MATERIAL_SAMPLER_CONTRACT_ID,
    sourceMacroContractId: macro.contractId,
    sourceSurfaceContractId: surface.contractId,
    sourceSedimentContractId: sediment.contractId,
    world: sediment.world,
    colorLinear: freeze(colorLinear),
    roughness,
    metallic: sediment.material.metallic,
    ambientOcclusion,
    normal: freeze(normal),
    luminous: false,
    sedimentDominantClass: sediment.dominantClass,
    actualVerticalWaterDepth: sediment.actualVerticalWaterDepth,
    macroControlFieldSampleCount: macro.controlFieldSampleCount,
    macroInsideBoundedField: macro.insideBoundedField,
    macroExpression: macro,
    coastalSedimentReadabilityPreserved: true,
    waterOpticsUnchanged: true,
    breakerOrSwashLawUnchanged: true,
    rendererLifecycleChanged: false,
    publicRouteMutated: false,
    productDefaultMutated: false
  });
}

export default sampleHEarthC2R1CoastalMacroMaterial;
