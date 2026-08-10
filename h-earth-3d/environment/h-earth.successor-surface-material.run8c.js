/**
 * /h-earth-3d/environment/h-earth.successor-surface-material.run8c.js
 *
 * H_EARTH_SUCCESSOR_SURFACE_MATERIAL_PROJECTION_RUN_8C_v1
 * HC05 projection successor: intrinsic Run7B material truth is projected onto
 * the same accepted map-wide Gratitude presentation surface used by ground
 * geometry. The accepted source remains read-only.
 */

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  H_EARTH_SURFACE_CLASSES,
  sampleHEarthSurfaceState,
  evaluateHEarthSurfaceStateSample
} from './h-earth.surface-state-field.js';
import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID
} from '../terrain/h-earth.successor-terrain-field.run8b.js';
import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import { H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT } from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);

export const H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID =
  'H_EARTH_SUCCESSOR_SURFACE_MATERIAL_PROJECTION_RUN_8C_v1';
export const H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_SOURCE_FILE =
  '/h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';
export const H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE = freeze({
  contractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
  sourceSurfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  normalLightMaterialInterfaceContractId: H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId,
  projectionClass: 'RUN_7B_INTRINSIC_MATERIAL_PROFILES_PROJECTED_ONTO_HC05_ACCEPTED_GRATITUDE_PRESENTATION_SURFACE',
  sourceClasses: H_EARTH_SURFACE_CLASSES,
  owns: {
    successorMaterialProjection: true,
    intrinsicRun7BSurfaceTruth: false,
    successorTerrainTruth: false,
    acceptedWorldSource: false,
    geometry: false,
    admission: false,
    renderer: false,
    camera: false,
    route: false,
    deployment: false
  }
});

let prototypeMapCache = null;
function copyPrototype(sample) {
  return freeze({
    sourceSurfaceClass: sample.surfaceClass,
    baseColorProfile: { ...sample.baseColorProfile },
    roughness: sample.roughness,
    reflectance: sample.reflectance,
    wetness: sample.wetness,
    waterSaturation: sample.waterSaturation,
    rockExposure: sample.rockExposure,
    soilDepth: sample.soilDepth,
    sedimentClass: sample.sedimentClass
  });
}
export function getHEarthRun8CMaterialPrototypeMap() {
  if (prototypeMapCache) return prototypeMapCache;
  const prototypes = {};
  for (let z = 64; z >= -256 && Object.keys(prototypes).length < H_EARTH_SURFACE_CLASSES.length; z -= 4) {
    for (let x = -256; x <= 256 && Object.keys(prototypes).length < H_EARTH_SURFACE_CLASSES.length; x += 4) {
      const sample = sampleHEarthSurfaceState(x, z);
      if (sample?.valid === true && evaluateHEarthSurfaceStateSample(sample).eligible === true &&
          H_EARTH_SURFACE_CLASSES.includes(sample.surfaceClass) && !prototypes[sample.surfaceClass]) {
        prototypes[sample.surfaceClass] = copyPrototype(sample);
      }
    }
  }
  prototypeMapCache = freeze(prototypes);
  return prototypeMapCache;
}

function acceptedPresentationSample(worldX, worldZ) {
  const center = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ);
  if (center?.valid !== true || !finite(center.presentationElevation)) return null;
  const step = 2;
  const east = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX + step, worldZ);
  const west = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX - step, worldZ);
  const north = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ - step);
  const south = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ + step);
  const height = (sample) => sample?.valid === true && finite(sample.presentationElevation)
    ? sample.presentationElevation : center.presentationElevation;
  const eastY = height(east), westY = height(west), northY = height(north), southY = height(south);
  const dx = (eastY - westY) / (2 * step);
  const dz = (southY - northY) / (2 * step);
  const length = Math.hypot(dx, 1, dz);
  const normal = { x: -dx / length, y: 1 / length, z: -dz / length };
  const slope = Math.hypot(dx, dz);
  const curvature = (eastY + westY + northY + southY - center.presentationElevation * 4) / (step * step);
  return freeze({
    ...center,
    geometricElevation: center.elevation,
    elevation: center.presentationElevation,
    world: { ...center.world, y: center.presentationElevation },
    normal,
    slope,
    curvature,
    hc05GroundProjection: true
  });
}

function classifySuccessorSurface(terrainSample, shorelineDistance) {
  if (shorelineDistance < -18) return 'OPEN_WATER';
  if (shorelineDistance < 0) return 'NEARSHORE_WATER';
  if (shorelineDistance < 12) return 'WET_SAND';
  if (shorelineDistance < 42) return 'DRY_SAND';
  if (terrainSample.elevation > 24 || terrainSample.slope > 0.35) return 'STONE_AND_SPARSE_SOIL';
  if (terrainSample.elevation > 8) return 'COASTAL_SOIL';
  return 'LOWLAND_SOIL';
}
function projectIntrinsicMaterial(prototype, surfaceClass, terrainSample, shorelineDistance) {
  const water = surfaceClass.includes('WATER');
  const slopePressure = clamp01(terrainSample.slope / 0.7);
  const curvaturePressure = clamp01(Math.abs(terrainSample.curvature) / 0.2);
  const shorelineMoisture = clamp01(1 - Math.max(0, shorelineDistance) / 90);
  const elevationDrying = clamp01(Math.max(0, terrainSample.elevation) / 64);
  const wetness = water ? 1 : clamp01(prototype.wetness + shorelineMoisture * 0.12 - elevationDrying * 0.1);
  const waterSaturation = water ? 1 : clamp01(prototype.waterSaturation + shorelineMoisture * 0.14 - elevationDrying * 0.12);
  const rockExposure = water ? prototype.rockExposure : clamp01(prototype.rockExposure + slopePressure * 0.28 + curvaturePressure * 0.1);
  const roughness = clamp01(prototype.roughness + rockExposure * 0.08 - wetness * 0.06);
  const reflectance = clamp01(prototype.reflectance + wetness * 0.09 - rockExposure * 0.035);
  const soilDepth = water ? 0 : Math.max(0, prototype.soilDepth * (1 - rockExposure * 0.62));
  return freeze({
    baseColorProfile: { ...prototype.baseColorProfile }, roughness, reflectance, wetness,
    waterSaturation, rockExposure, soilDepth, sedimentClass: prototype.sedimentClass,
    slopePressure, curvaturePressure, shorelineMoisture, elevationDrying
  });
}

export function sampleHEarthRun8CSuccessorSurfaceMaterial(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) return freeze({
    valid: false, status: 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_REJECTED_NONFINITE', worldX, worldZ,
    issues: ['WORLD_COORDINATE_NONFINITE']
  });
  const terrainSample = acceptedPresentationSample(worldX, worldZ);
  if (!terrainSample) return freeze({
    valid: false, status: 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_REJECTED_TERRAIN', worldX, worldZ,
    issues: ['HC05_ACCEPTED_GRATITUDE_TERRAIN_SAMPLE_INVALID']
  });
  const shorelineZ = resolveHEarthMapWideShorelineZ(worldX);
  const shorelineDistance = shorelineZ - worldZ;
  const surfaceClass = classifySuccessorSurface(terrainSample, shorelineDistance);
  const prototype = getHEarthRun8CMaterialPrototypeMap()[surfaceClass];
  if (!prototype) return freeze({
    valid: false, status: 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_REJECTED_PROFILE',
    world: terrainSample.world, surfaceClass, issues: [`RUN_7B_MATERIAL_PROTOTYPE_UNAVAILABLE:${surfaceClass}`]
  });
  const intrinsic = projectIntrinsicMaterial(prototype, surfaceClass, terrainSample, shorelineDistance);
  return freeze({
    valid: true,
    status: 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_COMPLETE',
    contractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
    world: terrainSample.world,
    geometricElevation: terrainSample.geometricElevation,
    presentationElevation: terrainSample.elevation,
    normal: terrainSample.normal,
    slope: terrainSample.slope,
    curvature: terrainSample.curvature,
    mountainContribution: terrainSample.mountainContribution,
    domainRegion: terrainSample.domainRegion,
    shorelineZ,
    shorelineDistance,
    surfaceClass,
    materialProfileId: `H_EARTH_RUN_8C_${surfaceClass}_SUCCESSOR_MATERIAL_v1`,
    ...intrinsic,
    sourceIdentities: {
      run7BSurfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
      run8BSuccessorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
      acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
      run8ANormalLightMaterialInterfaceContractId: H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId
    },
    authority: 'SUCCESSOR_MATERIAL_PROJECTION_ONLY',
    acceptedWorldSourceMutated: false,
    issues: []
  });
}

export function evaluateHEarthRun8CSuccessorSurfaceMaterial(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('SUCCESSOR_SURFACE_MATERIAL_NOT_VALID');
  if (sample?.contractId !== H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID) issues.push('SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID_MISMATCH');
  if (!H_EARTH_SURFACE_CLASSES.includes(sample?.surfaceClass)) issues.push('SUCCESSOR_SURFACE_CLASS_INVALID');
  for (const channel of ['roughness','reflectance','wetness','waterSaturation','rockExposure','slopePressure','curvaturePressure','shorelineMoisture','elevationDrying']) {
    if (!finite(sample?.[channel]) || sample[channel] < 0 || sample[channel] > 1) issues.push(`SUCCESSOR_MATERIAL_CHANNEL_INVALID:${channel}`);
  }
  const color = sample?.baseColorProfile;
  if (!color || ['linearR','linearG','linearB','alpha'].some((key) => !finite(color[key]) || color[key] < 0 || color[key] > 1)) issues.push('SUCCESSOR_MATERIAL_BASE_COLOR_INVALID');
  if (sample?.sourceIdentities?.run7BSurfaceStateContractId !== H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID) issues.push('RUN_7B_SURFACE_SOURCE_IDENTITY_MISSING');
  if (sample?.sourceIdentities?.run8BSuccessorTerrainFieldContractId !== H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID) issues.push('RUN_8B_TERRAIN_SOURCE_IDENTITY_MISSING');
  if (sample?.sourceIdentities?.acceptedWorldProjectionContractId !== H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID) issues.push('HC05_ACCEPTED_WORLD_SOURCE_IDENTITY_MISSING');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PASS' : 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE;
