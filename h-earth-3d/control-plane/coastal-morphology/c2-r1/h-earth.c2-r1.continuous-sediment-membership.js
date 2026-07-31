import {
  H_EARTH_C2_R1_SEDIMENT_CLASSES,
  H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  H_EARTH_C2_R1_SEDIMENT_MATERIAL_PARAMETERS,
  H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP as FIRST_STAGE_CONTRACT,
  deriveHEarthC2R1SedimentMembershipFromFactors,
  sampleHEarthC2R1CoastalSedimentMembership as sampleFirstStage
} from '../../../terrain/h-earth.coastal-sediment-membership.c2-r1.js';
import {
  sampleHEarthC2R1CoastalTerrainField
} from '../../../terrain/h-earth.coastal-profile.c2-r1.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach(nested => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const SECOND_STAGE_CROSS_SHORE_KERNEL = freeze([
  { offset: 0, weight: 0.14 },
  { offset: -2, weight: 0.14 },
  { offset: 2, weight: 0.14 },
  { offset: -5, weight: 0.12 },
  { offset: 5, weight: 0.12 },
  { offset: -9, weight: 0.09 },
  { offset: 9, weight: 0.09 },
  { offset: -14, weight: 0.06 },
  { offset: 14, weight: 0.06 },
  { offset: -20, weight: 0.02 },
  { offset: 20, weight: 0.02 }
]);

export {
  H_EARTH_C2_R1_SEDIMENT_CLASSES,
  H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
  H_EARTH_C2_R1_SEDIMENT_MATERIAL_PARAMETERS,
  deriveHEarthC2R1SedimentMembershipFromFactors
};

export const H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP = freeze({
  ...FIRST_STAGE_CONTRACT,
  continuityCorrection: {
    law: 'SECOND_STAGE_BOUNDED_CROSS_SHORE_CONVOLUTION',
    source: 'FIRST_STAGE_MULTIFACTOR_MEMBERSHIP_FIELD',
    kernel: SECOND_STAGE_CROSS_SHORE_KERNEL,
    thresholdsUnchanged: true,
    geometryChanged: false,
    normalsChanged: false,
    lightingChanged: false,
    waterOpticsChanged: false
  }
});

function normalizeWeights(scores) {
  const sanitized = H_EARTH_C2_R1_SEDIMENT_CLASSES.map(name =>
    Number.isFinite(scores[name]) ? Math.max(1e-8, scores[name]) : 1e-8
  );
  const total = sanitized.reduce((sum, value) => sum + value, 0);
  return freeze(Object.fromEntries(
    H_EARTH_C2_R1_SEDIMENT_CLASSES.map((name, index) => [name, sanitized[index] / total])
  ));
}

function blendMaterial(weights) {
  const colorLinear = [0, 0, 0];
  let roughness = 0;
  let metallic = 0;
  for (const name of H_EARTH_C2_R1_SEDIMENT_CLASSES) {
    const parameters = H_EARTH_C2_R1_SEDIMENT_MATERIAL_PARAMETERS[name];
    const weight = weights[name];
    for (let channel = 0; channel < 3; channel += 1) {
      colorLinear[channel] += parameters.colorLinear[channel] * weight;
    }
    roughness += parameters.roughness * weight;
    metallic += parameters.metallic * weight;
  }
  return freeze({ colorLinear, roughness, metallic, luminous: false });
}

export function sampleHEarthC2R1ContinuousCoastalSedimentMembership(worldX, worldZ) {
  const center = sampleFirstStage(worldX, worldZ);
  const terrain = sampleHEarthC2R1CoastalTerrainField(worldX, worldZ);
  if (center?.valid !== true || terrain?.valid !== true || !terrain.coastalFrame) {
    return freeze({
      valid: false,
      status: 'C2_R1_CONTINUOUS_SEDIMENT_MEMBERSHIP_REJECTED',
      contractId: H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP_CONTRACT_ID,
      worldX,
      worldZ
    });
  }

  const normal = terrain.coastalFrame.waterwardNormal;
  const accumulated = Object.fromEntries(
    H_EARTH_C2_R1_SEDIMENT_CLASSES.map(name => [name, 0])
  );
  let accumulatedWeight = 0;
  let validSampleCount = 0;

  for (const entry of SECOND_STAGE_CROSS_SHORE_KERNEL) {
    const sample = entry.offset === 0
      ? center
      : sampleFirstStage(
          worldX + normal.x * entry.offset,
          worldZ + normal.z * entry.offset
        );
    if (sample?.valid !== true) continue;
    for (const name of H_EARTH_C2_R1_SEDIMENT_CLASSES) {
      accumulated[name] += sample.weights[name] * entry.weight;
    }
    accumulatedWeight += entry.weight;
    validSampleCount += 1;
  }

  const weights = normalizeWeights(Object.fromEntries(
    H_EARTH_C2_R1_SEDIMENT_CLASSES.map(name => [
      name,
      accumulatedWeight > 0
        ? accumulated[name] / accumulatedWeight
        : center.weights[name]
    ])
  ));
  const dominantClass = H_EARTH_C2_R1_SEDIMENT_CLASSES.reduce(
    (best, name) => weights[name] > weights[best] ? name : best,
    H_EARTH_C2_R1_SEDIMENT_CLASSES[0]
  );

  return freeze({
    ...center,
    status: 'C2_R1_CONTINUOUS_SEDIMENT_MEMBERSHIP_COMPLETE',
    weights,
    normalizedSum: H_EARTH_C2_R1_SEDIMENT_CLASSES.reduce(
      (sum, name) => sum + weights[name],
      0
    ),
    dominantClass,
    material: blendMaterial(weights),
    membershipSmoothing: {
      firstStage: center.membershipSmoothing,
      secondStage: {
        law: 'SECOND_STAGE_BOUNDED_CROSS_SHORE_CONVOLUTION',
        kernelEntryCount: SECOND_STAGE_CROSS_SHORE_KERNEL.length,
        validSampleCount,
        accumulatedWeight,
        maximumOffset: 20
      }
    },
    geometryMutated: false,
    normalsMutated: false,
    lightingMutated: false,
    waterOpticsMutated: false,
    breakersOrFoamCreated: false,
    rendererMutated: false,
    productDefaultMutated: false,
    publicRouteMutated: false
  });
}

export default sampleHEarthC2R1ContinuousCoastalSedimentMembership;
