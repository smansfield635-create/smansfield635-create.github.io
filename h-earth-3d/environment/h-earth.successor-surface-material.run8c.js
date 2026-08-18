/**
 * /h-earth-3d/environment/h-earth.successor-surface-material.run8c.js
 *
 * H_EARTH_SUCCESSOR_SURFACE_MATERIAL_PROJECTION_RUN_8C_C3C3R5_LAYERED_TINT_v3
 *
 * Projects the accepted Run 7B intrinsic surface classes and material profiles
 * onto the Run 8B successor terrain field. C3C3R5 separates structural terrain
 * appearance from environmental color: the structural material remains opaque,
 * while a bounded, spatially variant subtropical tint is mathematically
 * composited over it. The resulting terrain therefore retains topology/normal
 * depth while gaining environmental color without framebuffer background leak.
 */

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  H_EARTH_SURFACE_CLASSES,
  sampleHEarthSurfaceState,
  evaluateHEarthSurfaceStateSample
} from './h-earth.surface-state-field.js';

import {
  getHEarthCanonicalShorelineZ
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';

import {
  H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value) ||
    seen.has(value)
  ) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const mix = (a, b, t) => a + (b - a) * clamp01(t);

export const H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID =
  'H_EARTH_SUCCESSOR_SURFACE_MATERIAL_PROJECTION_RUN_8C_C3C3R5_LAYERED_TINT_v3';

export const H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_SOURCE_FILE =
  '/h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';

export const H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE = freeze({
  compositionModel:
    'OPAQUE_STRUCTURAL_TERRAIN_PLUS_TRANSLUCENT_SPATIALLY_VARIANT_ENVIRONMENTAL_TINT_PRECOMPOSED',
  structuralTerrainOpacity: 1,
  minimumTintStrength: 0.18,
  maximumTintStrength: 0.56,
  backgroundLeakagePermitted: false,
  tintMayReplaceTopology: false,
  tintSpatialVariationRequired: true,
  topologyAuthority: 'WORLD_SPACE_GEOMETRY_NORMALS_SLOPE_AND_GRID_RELIEF',
  colorAuthority: 'CAUSAL_SUBTROPICAL_ENVIRONMENTAL_TINT',
  governingLaw:
    'GRID_OWNS_DEPTH_COLOR_OWNS_CHROMATIC_EXPRESSION_NEITHER_MAY_ERASE_THE_OTHER'
});

export const H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE = freeze({
  contractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
  sourceSurfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  successorTerrainFieldContractId:
    H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  normalLightMaterialInterfaceContractId:
    H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId,
  projectionClass:
    'RUN_7B_INTRINSIC_STRUCTURAL_MATERIAL_PLUS_C3C3R5_TRANSLUCENT_CAUSAL_SUBTROPICAL_TINT_ON_RUN_8B_SUCCESSOR_TERRAIN',
  climateIdentity: 'WARM_SUBTROPICAL_COASTAL',
  layeredColorProfile: H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE,
  sourceClasses: H_EARTH_SURFACE_CLASSES,
  owns: {
    successorMaterialProjection: true,
    intrinsicRun7BSurfaceTruth: false,
    successorTerrainTruth: false,
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
      if (
        sample?.valid === true &&
        evaluateHEarthSurfaceStateSample(sample).eligible === true &&
        H_EARTH_SURFACE_CLASSES.includes(sample.surfaceClass) &&
        !prototypes[sample.surfaceClass]
      ) {
        prototypes[sample.surfaceClass] = copyPrototype(sample);
      }
    }
  }

  prototypeMapCache = freeze(prototypes);
  return prototypeMapCache;
}

function classifySuccessorSurface(terrainSample, shorelineDistance) {
  if (shorelineDistance < -18) return 'OPEN_WATER';
  if (shorelineDistance < 0) return 'NEARSHORE_WATER';
  if (shorelineDistance < 12) return 'WET_SAND';
  if (shorelineDistance < 42) return 'DRY_SAND';
  if (terrainSample.elevation > 24 || terrainSample.slope > 0.35) {
    return 'STONE_AND_SPARSE_SOIL';
  }
  if (terrainSample.elevation > 8) return 'COASTAL_SOIL';
  return 'LOWLAND_SOIL';
}

function spatialTintVariation(worldX, worldZ) {
  const broad =
    0.5 + 0.5 * Math.sin(worldX * 0.013 + worldZ * 0.009);
  const cross =
    0.5 + 0.5 * Math.cos(worldX * 0.007 - worldZ * 0.015);
  return clamp01(broad * 0.58 + cross * 0.42);
}

function environmentalTintTarget(surfaceClass, {
  shorelineMoisture,
  elevationDrying,
  rockExposure,
  slopePressure,
  spatialVariation
}) {
  if (surfaceClass === 'LOWLAND_SOIL') {
    return freeze({
      linearR: mix(0.070, 0.095, spatialVariation),
      linearG: mix(0.185, 0.235, shorelineMoisture * 0.72 + spatialVariation * 0.28),
      linearB: mix(0.060, 0.082, spatialVariation)
    });
  }
  if (surfaceClass === 'COASTAL_SOIL') {
    return freeze({
      linearR: mix(0.090, 0.120, elevationDrying * 0.55 + spatialVariation * 0.45),
      linearG: mix(0.170, 0.215, shorelineMoisture * 0.55 + spatialVariation * 0.45),
      linearB: mix(0.064, 0.088, spatialVariation)
    });
  }
  return freeze({
    linearR: mix(0.118, 0.150, rockExposure * 0.62 + spatialVariation * 0.38),
    linearG: mix(0.138, 0.172, (1 - slopePressure) * 0.45 + spatialVariation * 0.55),
    linearB: mix(0.086, 0.108, spatialVariation)
  });
}

function composeSubtropicalTint(structuralProfile, surfaceClass, context) {
  const structural = freeze({ ...structuralProfile });
  if (
    surfaceClass.includes('WATER') ||
    surfaceClass === 'WET_SAND' ||
    surfaceClass === 'DRY_SAND'
  ) {
    return freeze({
      composed: structural,
      structural,
      tint: null,
      tintStrength: 0,
      tintAlphaEquivalent: 0,
      spatialVariation: context.spatialVariation,
      compositionModel: 'STRUCTURAL_MATERIAL_ONLY'
    });
  }

  const lowlandHumidity = clamp01(1 - context.elevationDrying);
  const ecologicalSignal = clamp01(
    0.32 +
    context.shorelineMoisture * 0.22 +
    lowlandHumidity * 0.22 -
    context.rockExposure * 0.16 -
    context.slopePressure * 0.08
  );
  const surfaceScale = surfaceClass === 'STONE_AND_SPARSE_SOIL' ? 0.56 : 0.92;
  const spatialScale = 0.82 + context.spatialVariation * 0.18;
  const tintStrength = clamp(
    ecologicalSignal * surfaceScale * spatialScale,
    H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.minimumTintStrength,
    H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.maximumTintStrength
  );
  const tint = environmentalTintTarget(surfaceClass, context);
  const composed = freeze({
    ...structural,
    linearR: clamp01(mix(structural.linearR, tint.linearR, tintStrength)),
    linearG: clamp01(mix(structural.linearG, tint.linearG, tintStrength)),
    linearB: clamp01(mix(structural.linearB, tint.linearB, tintStrength)),
    alpha: structural.alpha
  });

  return freeze({
    composed,
    structural,
    tint,
    tintStrength,
    tintAlphaEquivalent: tintStrength,
    spatialVariation: context.spatialVariation,
    compositionModel:
      H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.compositionModel
  });
}

function projectIntrinsicMaterial(prototype, surfaceClass, terrainSample, shorelineDistance) {
  const water = surfaceClass.includes('WATER');
  const slopePressure = clamp01(terrainSample.slope / 0.7);
  const curvaturePressure = clamp01(Math.abs(terrainSample.curvature) / 0.2);
  const shorelineMoisture = clamp01(
    1 - Math.max(0, shorelineDistance) / 150
  );
  const elevationDrying = clamp01(Math.max(0, terrainSample.elevation) / 78);
  const lowlandHumidity = clamp01(1 - elevationDrying);
  const spatialVariation = spatialTintVariation(
    terrainSample.world.x,
    terrainSample.world.z
  );

  const wetness = water
    ? 1
    : clamp01(
        prototype.wetness +
        shorelineMoisture * 0.2 +
        lowlandHumidity * 0.08 -
        elevationDrying * 0.08
      );
  const waterSaturation = water
    ? 1
    : clamp01(
        prototype.waterSaturation +
        shorelineMoisture * 0.22 +
        lowlandHumidity * 0.09 -
        elevationDrying * 0.1
      );
  const rockExposure = water
    ? prototype.rockExposure
    : clamp01(
        prototype.rockExposure +
        slopePressure * 0.28 +
        curvaturePressure * 0.1
      );
  const roughness = clamp01(
    prototype.roughness + rockExposure * 0.08 - wetness * 0.06
  );
  const reflectance = clamp01(
    prototype.reflectance + wetness * 0.09 - rockExposure * 0.035
  );
  const soilDepth = water
    ? 0
    : Math.max(0, prototype.soilDepth * (1 - rockExposure * 0.62));

  const colorComposition = composeSubtropicalTint(
    prototype.baseColorProfile,
    surfaceClass,
    {
      shorelineMoisture,
      elevationDrying,
      rockExposure,
      slopePressure,
      spatialVariation
    }
  );

  return freeze({
    baseColorProfile: colorComposition.composed,
    structuralBaseColorProfile: colorComposition.structural,
    environmentalTintColorProfile: colorComposition.tint,
    environmentalTintStrength: colorComposition.tintStrength,
    environmentalTintAlphaEquivalent: colorComposition.tintAlphaEquivalent,
    spatialTintVariation: colorComposition.spatialVariation,
    colorCompositionModel: colorComposition.compositionModel,
    structuralTerrainOpaque: true,
    framebufferBackgroundLeakage: false,
    roughness,
    reflectance,
    wetness,
    waterSaturation,
    rockExposure,
    soilDepth,
    sedimentClass: prototype.sedimentClass,
    slopePressure,
    curvaturePressure,
    shorelineMoisture,
    elevationDrying,
    climateIdentity: 'WARM_SUBTROPICAL_COASTAL',
    environmentalCausality:
      'SHORELINE_MOISTURE_ELEVATION_SLOPE_CURVATURE_ROCK_EXPOSURE_AND_WORLD_POSITION',
    colorTopologyLaw:
      H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.governingLaw
  });
}

export function sampleHEarthRun8CSuccessorSurfaceMaterial(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) {
    return freeze({
      valid: false,
      status: 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_REJECTED_NONFINITE',
      worldX,
      worldZ,
      issues: ['WORLD_COORDINATE_NONFINITE']
    });
  }

  const terrainSample = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (terrainSample?.valid !== true) {
    return freeze({
      valid: false,
      status: 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_REJECTED_TERRAIN',
      worldX,
      worldZ,
      issues: ['RUN_8B_SUCCESSOR_TERRAIN_SAMPLE_INVALID']
    });
  }

  const shorelineZ = getHEarthCanonicalShorelineZ(worldX);
  const shorelineDistance = shorelineZ - worldZ;
  const surfaceClass = classifySuccessorSurface(terrainSample, shorelineDistance);
  const prototypeMap = getHEarthRun8CMaterialPrototypeMap();
  const prototype = prototypeMap[surfaceClass];

  if (!prototype) {
    return freeze({
      valid: false,
      status: 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_REJECTED_PROFILE',
      world: terrainSample.world,
      surfaceClass,
      issues: [`RUN_7B_MATERIAL_PROTOTYPE_UNAVAILABLE:${surfaceClass}`]
    });
  }

  const intrinsic = projectIntrinsicMaterial(
    prototype,
    surfaceClass,
    terrainSample,
    shorelineDistance
  );

  return freeze({
    valid: true,
    status: 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_COMPLETE',
    contractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,
    world: terrainSample.world,
    normal: terrainSample.normal,
    slope: terrainSample.slope,
    curvature: terrainSample.curvature,
    mountainContribution: terrainSample.mountainContribution,
    domainRegion: terrainSample.domainRegion,
    shorelineZ,
    shorelineDistance,
    surfaceClass,
    materialProfileId:
      `H_EARTH_RUN_8C_${surfaceClass}_SUCCESSOR_MATERIAL_C3C3R5_LAYERED_TINT_v3`,
    ...intrinsic,
    sourceIdentities: {
      run7BSurfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
      run8BSuccessorTerrainFieldContractId:
        H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
      run8ANormalLightMaterialInterfaceContractId:
        H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId
    },
    authority: 'SUCCESSOR_MATERIAL_PROJECTION_ONLY',
    issues: []
  });
}

export function evaluateHEarthRun8CSuccessorSurfaceMaterial(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('SUCCESSOR_SURFACE_MATERIAL_NOT_VALID');
  if (sample?.contractId !== H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID) {
    issues.push('SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID_MISMATCH');
  }
  if (!H_EARTH_SURFACE_CLASSES.includes(sample?.surfaceClass)) {
    issues.push('SUCCESSOR_SURFACE_CLASS_INVALID');
  }
  for (const channel of [
    'roughness', 'reflectance', 'wetness', 'waterSaturation',
    'rockExposure', 'slopePressure', 'curvaturePressure',
    'shorelineMoisture', 'elevationDrying', 'spatialTintVariation'
  ]) {
    if (!finite(sample?.[channel]) || sample[channel] < 0 || sample[channel] > 1) {
      issues.push(`SUCCESSOR_MATERIAL_CHANNEL_INVALID:${channel}`);
    }
  }
  const color = sample?.baseColorProfile;
  if (!color || ['linearR', 'linearG', 'linearB', 'alpha']
      .some((key) => !finite(color[key]) || color[key] < 0 || color[key] > 1)) {
    issues.push('SUCCESSOR_MATERIAL_BASE_COLOR_INVALID');
  }
  const structural = sample?.structuralBaseColorProfile;
  if (!structural || ['linearR', 'linearG', 'linearB', 'alpha']
      .some((key) => !finite(structural[key]) || structural[key] < 0 || structural[key] > 1)) {
    issues.push('SUCCESSOR_STRUCTURAL_BASE_COLOR_INVALID');
  }
  if (sample?.surfaceClass && !sample.surfaceClass.includes('WATER') &&
      sample.surfaceClass !== 'WET_SAND' && sample.surfaceClass !== 'DRY_SAND') {
    if (!finite(sample.environmentalTintStrength) ||
        sample.environmentalTintStrength < H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.minimumTintStrength ||
        sample.environmentalTintStrength > H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.maximumTintStrength) {
      issues.push('SUCCESSOR_ENVIRONMENTAL_TINT_STRENGTH_INVALID');
    }
    if (sample.structuralTerrainOpaque !== true || sample.framebufferBackgroundLeakage !== false) {
      issues.push('SUCCESSOR_STRUCTURAL_OPACITY_CONTRACT_INVALID');
    }
  }
  if (sample?.sourceIdentities?.run7BSurfaceStateContractId !==
      H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID) {
    issues.push('RUN_7B_SURFACE_SOURCE_IDENTITY_MISSING');
  }
  if (sample?.sourceIdentities?.run8BSuccessorTerrainFieldContractId !==
      H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID) {
    issues.push('RUN_8B_TERRAIN_SOURCE_IDENTITY_MISSING');
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PASS'
      : 'RUN_8C_SUCCESSOR_SURFACE_MATERIAL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE;