/**
 * /h-earth-3d/environment/h-earth.traversal-surface.js
 *
 * H_EARTH_CANONICAL_TRAVERSAL_SURFACE_RUN_7F_v1
 *
 * Canonical H-Earth traversal authority. It consumes terrain, intrinsic
 * surface state, and water state while owning only movement classification,
 * movement cost, passability, footing, slip, step, fall, and water hazards.
 * It creates no terrain, surface, water, biome, population, audio,
 * spatial-lifecycle, geometry, navigation, renderer, route, or deployment
 * authority.
 */

import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
  H_EARTH_SURFACE_STATE_REVISION,
  sampleHEarthSurfaceState
} from './h-earth.surface-state-field.js';

import {
  H_EARTH_WATER_STATE_CONTRACT_ID,
  H_EARTH_WATER_STATE_REVISION,
  sampleHEarthWaterState
} from './h-earth.water-state.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);

export const H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID =
  'H_EARTH_CANONICAL_TRAVERSAL_SURFACE_RUN_7F_v1';

export const H_EARTH_TRAVERSAL_SURFACE_REVISION = 1;

export const H_EARTH_TRAVERSAL_CLASSES = deepFreeze([
  'STABLE_GROUND',
  'SOFT_GROUND',
  'ROCKY_UNEVEN_GROUND',
  'STEEP_GROUND_CAUTION',
  'SHORELINE_TRANSITION',
  'SHALLOW_WADE',
  'STEEP_SLOPE_BLOCKED',
  'DEEP_WATER_BLOCKED'
]);

export const H_EARTH_MOVEMENT_MODES = deepFreeze([
  'WALK',
  'CAREFUL_WALK',
  'WADE',
  'CLIMBING_OR_REROUTE_REQUIRED',
  'SWIMMING_OR_VEHICLE_REQUIRED'
]);

export const H_EARTH_PASSABILITY_STATES = deepFreeze([
  'PASSABLE',
  'PASSABLE_WITH_CAUTION',
  'BLOCKED'
]);

export const H_EARTH_TRAVERSAL_SURFACE_FORBIDDEN_NATIVE_OUTPUTS = deepFreeze([
  'terrainElevation',
  'surfaceClass',
  'baseColorProfile',
  'roughness',
  'reflectance',
  'wetness',
  'waterSaturation',
  'waterBodyId',
  'waterDepth',
  'flowDirection',
  'flowSpeed',
  'waveDirection',
  'waveAmplitude',
  'underwaterState',
  'biomeClass',
  'populationEligibility',
  'requiredPopulationInstances',
  'ambientAudioClass',
  'audioLayerSelection',
  'chunkState',
  'proxyState',
  'loadingState',
  'geometry',
  'renderPlan',
  'cameraState',
  'navigationDecision',
  'routePath'
]);

const BASE_MOVEMENT_COST = deepFreeze({
  STABLE_GROUND: 1,
  SOFT_GROUND: 1.42,
  ROCKY_UNEVEN_GROUND: 1.76,
  STEEP_GROUND_CAUTION: 2.18,
  SHORELINE_TRANSITION: 1.84,
  SHALLOW_WADE: 2.62,
  STEEP_SLOPE_BLOCKED: 100,
  DEEP_WATER_BLOCKED: 100
});

export const H_EARTH_TRAVERSAL_SURFACE = deepFreeze({
  contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
  traversalSurfaceRevision: H_EARTH_TRAVERSAL_SURFACE_REVISION,
  coordinateFrame: H_EARTH_TERRAIN_FIELD.coordinateFrame,
  traversalClasses: H_EARTH_TRAVERSAL_CLASSES,
  movementModes: H_EARTH_MOVEMENT_MODES,
  passabilityStates: H_EARTH_PASSABILITY_STATES,
  thresholds: {
    deepWaterDepth: 0.75,
    steepCautionSlope: 0.3,
    steepBlockedSlope: 0.52,
    rockyExposure: 0.58,
    unstableFooting: 0.58,
    elevatedStepHazard: 0.55,
    elevatedFallHazard: 0.62,
    blockedFallHazard: 0.92
  },
  ownership: {
    ownsMovementClassification: true,
    ownsMovementCost: true,
    ownsPassability: true,
    ownsFootingHazard: true,
    ownsSlipHazard: true,
    ownsStepHazard: true,
    ownsFallHazard: true,
    ownsWaterTraversalHazard: true,
    ownsTerrainTruth: false,
    ownsSurfaceState: false,
    ownsWaterState: false,
    ownsBiome: false,
    ownsPopulation: false,
    ownsAmbientAudioProjection: false,
    ownsSpatialLifecycle: false,
    ownsGeometry: false,
    ownsNavigation: false,
    ownsRenderer: false,
    ownsCamera: false,
    ownsAdmission: false,
    ownsFrame: false,
    ownsCompositor: false,
    ownsController: false,
    ownsPublicRoute: false
  }
});

function rejectTraversalSample({ worldX, worldZ, issues }) {
  return deepFreeze({
    valid: false,
    status: 'TRAVERSAL_SURFACE_REJECTED_INVALID_INPUT',
    contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
    traversalSurfaceRevision: H_EARTH_TRAVERSAL_SURFACE_REVISION,
    worldX,
    worldZ,
    issues
  });
}

function resolveHazards({ terrain, surface, water }) {
  const slopeHazard = clamp01((terrain.slope - 0.06) / 0.54);
  const footingHazard = clamp01(
    (1 - surface.footingStability) * 0.72 +
    surface.waterSaturation * 0.18 +
    surface.rockExposure * 0.1
  );
  const slipHazard = clamp01(
    (1 - surface.friction) * 0.5 +
    surface.wetness * 0.25 +
    Math.min(water.depth, 1.5) / 1.5 * 0.18 +
    Math.min(water.flowSpeed, 1) * 0.07
  );
  const stepHazard = clamp01(
    Math.min(Math.abs(terrain.curvature), 0.25) / 0.25 * 0.56 +
    surface.rockExposure * 0.34 +
    slopeHazard * 0.1
  );
  const fallHazard = clamp01(
    slopeHazard * 0.66 +
    stepHazard * 0.22 +
    footingHazard * 0.12
  );
  const waterHazard = water.waterPresent
    ? clamp01(
        Math.min(water.depth, 2.4) / 2.4 * 0.68 +
        Math.min(water.flowSpeed, 1) * 0.15 +
        Math.min(water.waveAmplitude, 1) * 0.12 +
        water.turbidity * 0.05
      )
    : 0;

  return deepFreeze({
    slopeHazard,
    footingHazard,
    slipHazard,
    stepHazard,
    fallHazard,
    waterHazard
  });
}

function classifyTraversal({ terrain, surface, water, hazards }) {
  const thresholds = H_EARTH_TRAVERSAL_SURFACE.thresholds;
  const deepWater = water.waterPresent && (
    water.depth > thresholds.deepWaterDepth ||
    water.waterClass === 'NEARSHORE_WATER' ||
    water.waterClass === 'OPEN_WATER'
  );

  if (deepWater) return 'DEEP_WATER_BLOCKED';
  if (terrain.slope >= thresholds.steepBlockedSlope ||
      hazards.fallHazard >= thresholds.blockedFallHazard) {
    return 'STEEP_SLOPE_BLOCKED';
  }
  if (water.waterClass === 'SHALLOW_WATER') return 'SHALLOW_WADE';
  if (water.waterClass === 'SHORELINE_CONTACT') return 'SHORELINE_TRANSITION';
  if (terrain.slope >= thresholds.steepCautionSlope ||
      hazards.fallHazard >= thresholds.elevatedFallHazard) {
    return 'STEEP_GROUND_CAUTION';
  }
  if (surface.rockExposure >= thresholds.rockyExposure ||
      hazards.stepHazard >= thresholds.elevatedStepHazard) {
    return 'ROCKY_UNEVEN_GROUND';
  }
  if (surface.footingStability < thresholds.unstableFooting ||
      surface.surfaceClass === 'WET_SAND' ||
      surface.surfaceClass === 'DRY_SAND') {
    return 'SOFT_GROUND';
  }
  return 'STABLE_GROUND';
}

function resolveMovementSemantics(traversalClass) {
  switch (traversalClass) {
    case 'DEEP_WATER_BLOCKED':
      return deepFreeze({
        passability: 'BLOCKED',
        movementMode: 'SWIMMING_OR_VEHICLE_REQUIRED',
        passable: false,
        requiredCapability: 'SWIMMING_OR_WATERCRAFT'
      });
    case 'STEEP_SLOPE_BLOCKED':
      return deepFreeze({
        passability: 'BLOCKED',
        movementMode: 'CLIMBING_OR_REROUTE_REQUIRED',
        passable: false,
        requiredCapability: 'CLIMBING_OR_REROUTE'
      });
    case 'SHALLOW_WADE':
      return deepFreeze({
        passability: 'PASSABLE_WITH_CAUTION',
        movementMode: 'WADE',
        passable: true,
        requiredCapability: 'SHALLOW_WATER_WADING'
      });
    case 'STABLE_GROUND':
      return deepFreeze({
        passability: 'PASSABLE',
        movementMode: 'WALK',
        passable: true,
        requiredCapability: 'ORDINARY_FOOT_TRAVEL'
      });
    default:
      return deepFreeze({
        passability: 'PASSABLE_WITH_CAUTION',
        movementMode: 'CAREFUL_WALK',
        passable: true,
        requiredCapability: 'CAREFUL_FOOT_TRAVEL'
      });
  }
}

function resolveMovementCost({ traversalClass, terrain, surface, water, hazards }) {
  if (traversalClass === 'DEEP_WATER_BLOCKED' ||
      traversalClass === 'STEEP_SLOPE_BLOCKED') {
    return deepFreeze({
      movementCost: BASE_MOVEMENT_COST[traversalClass],
      speedMultiplier: 0,
      maximumRecommendedStepHeight: 0
    });
  }

  const terrainPressure = 1 + terrain.slope * 1.55 +
    Math.min(Math.abs(terrain.curvature), 0.3) * 0.75;
  const surfacePressure = 1 + (1 - surface.footingStability) * 0.62 +
    (1 - surface.friction) * 0.38;
  const waterPressure = 1 + Math.min(water.depth, 1.2) * 0.56 +
    Math.min(water.flowSpeed, 1) * 0.24;
  const hazardPressure = 1 +
    hazards.slipHazard * 0.24 +
    hazards.stepHazard * 0.22 +
    hazards.fallHazard * 0.34 +
    hazards.waterHazard * 0.2;
  const movementCost = clamp(
    BASE_MOVEMENT_COST[traversalClass] *
      terrainPressure * surfacePressure * waterPressure * hazardPressure,
    1,
    12
  );
  const speedMultiplier = clamp(1 / movementCost, 0.12, 1);
  const maximumRecommendedStepHeight = clamp(
    0.48 * (1 - hazards.stepHazard) * (1 - hazards.fallHazard * 0.35),
    0.05,
    0.48
  );

  return deepFreeze({
    movementCost,
    speedMultiplier,
    maximumRecommendedStepHeight
  });
}

function suppliedWaterMatches({ waterState, worldX, worldZ, surface }) {
  return waterState?.valid === true &&
    waterState.contractId === H_EARTH_WATER_STATE_CONTRACT_ID &&
    finite(waterState.world?.x) &&
    finite(waterState.world?.z) &&
    Math.abs(waterState.world.x - worldX) <= 1e-10 &&
    Math.abs(waterState.world.z - worldZ) <= 1e-10 &&
    waterState.semanticAddressId === surface.semanticAddressId &&
    waterState.chunkId === surface.chunkId;
}

export function sampleHEarthTraversalSurface(
  worldX,
  worldZ,
  { waterState = null } = {}
) {
  if (!finite(worldX) || !finite(worldZ)) {
    return rejectTraversalSample({
      worldX,
      worldZ,
      issues: ['WORLD_COORDINATE_NONFINITE']
    });
  }

  const terrain = sampleHEarthTerrainField(worldX, worldZ);
  const surface = sampleHEarthSurfaceState(worldX, worldZ);
  if (terrain?.valid !== true || surface?.valid !== true) {
    return rejectTraversalSample({
      worldX,
      worldZ,
      issues: ['UPSTREAM_TERRAIN_OR_SURFACE_STATE_NOT_ELIGIBLE']
    });
  }

  const water = waterState ?? sampleHEarthWaterState(worldX, worldZ);
  if (!suppliedWaterMatches({ waterState: water, worldX, worldZ, surface })) {
    return rejectTraversalSample({
      worldX,
      worldZ,
      issues: ['WATER_STATE_NOT_ELIGIBLE_OR_NOT_CORRESPONDING']
    });
  }

  const hazards = resolveHazards({ terrain, surface, water });
  const traversalClass = classifyTraversal({ terrain, surface, water, hazards });
  const movement = resolveMovementSemantics(traversalClass);
  const cost = resolveMovementCost({
    traversalClass,
    terrain,
    surface,
    water,
    hazards
  });

  return deepFreeze({
    valid: true,
    status: 'TRAVERSAL_SURFACE_SAMPLE_COMPLETE',
    contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
    traversalSurfaceRevision: H_EARTH_TRAVERSAL_SURFACE_REVISION,
    world: terrain.world,
    traversalClass,
    movementMode: movement.movementMode,
    passability: movement.passability,
    passable: movement.passable,
    requiredCapability: movement.requiredCapability,
    movementCost: cost.movementCost,
    speedMultiplier: cost.speedMultiplier,
    maximumRecommendedStepHeight: cost.maximumRecommendedStepHeight,
    slopeHazard: hazards.slopeHazard,
    footingHazard: hazards.footingHazard,
    slipHazard: hazards.slipHazard,
    stepHazard: hazards.stepHazard,
    fallHazard: hazards.fallHazard,
    waterHazard: hazards.waterHazard,
    semanticAddressId: surface.semanticAddressId,
    chunkId: surface.chunkId,
    formationIds: surface.formationIds,
    consumedContext: {
      terrainSlope: terrain.slope,
      terrainCurvature: terrain.curvature,
      surfaceStateClass: surface.surfaceClass,
      footingStability: surface.footingStability,
      friction: surface.friction,
      rockExposure: surface.rockExposure,
      intrinsicWetness: surface.wetness,
      waterStateClass: water.waterClass,
      waterStateDepth: water.depth
    },
    sourceIdentities: {
      traversalSurfaceContractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
      traversalSurfaceRevision: H_EARTH_TRAVERSAL_SURFACE_REVISION,
      terrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
      terrainFieldRevision: H_EARTH_TERRAIN_FIELD.generationRevision,
      surfaceStateContractId: H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID,
      surfaceStateRevision: H_EARTH_SURFACE_STATE_REVISION,
      waterStateContractId: H_EARTH_WATER_STATE_CONTRACT_ID,
      waterStateRevision: H_EARTH_WATER_STATE_REVISION
    },
    correspondenceStatus: 'TRAVERSAL_UPSTREAM_CORRESPONDENCE_PASS',
    nativeTruthOwnership: 'TRAVERSAL_ONLY',
    issues: []
  });
}

export function evaluateHEarthTraversalSurfaceSample(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('TRAVERSAL_SAMPLE_NOT_VALID');
  if (sample?.contractId !== H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID) {
    issues.push('TRAVERSAL_CONTRACT_ID_MISMATCH');
  }
  if (!H_EARTH_TRAVERSAL_CLASSES.includes(sample?.traversalClass)) {
    issues.push('TRAVERSAL_CLASS_INVALID');
  }
  if (!H_EARTH_MOVEMENT_MODES.includes(sample?.movementMode)) {
    issues.push('MOVEMENT_MODE_INVALID');
  }
  if (!H_EARTH_PASSABILITY_STATES.includes(sample?.passability)) {
    issues.push('PASSABILITY_STATE_INVALID');
  }
  if (typeof sample?.passable !== 'boolean') issues.push('PASSABLE_FLAG_INVALID');
  if (typeof sample?.requiredCapability !== 'string') {
    issues.push('REQUIRED_CAPABILITY_INVALID');
  }

  for (const field of [
    'movementCost',
    'speedMultiplier',
    'maximumRecommendedStepHeight',
    'slopeHazard',
    'footingHazard',
    'slipHazard',
    'stepHazard',
    'fallHazard',
    'waterHazard'
  ]) {
    if (!finite(sample?.[field])) issues.push(`NONFINITE_FIELD:${field}`);
  }
  for (const field of [
    'speedMultiplier',
    'slopeHazard',
    'footingHazard',
    'slipHazard',
    'stepHazard',
    'fallHazard',
    'waterHazard'
  ]) {
    if (finite(sample?.[field]) && (sample[field] < 0 || sample[field] > 1)) {
      issues.push(`FIELD_OUT_OF_RANGE:${field}`);
    }
  }
  if (finite(sample?.movementCost) && (sample.movementCost < 1 || sample.movementCost > 100)) {
    issues.push('MOVEMENT_COST_OUT_OF_RANGE');
  }
  if (sample?.passable === false && sample?.speedMultiplier !== 0) {
    issues.push('BLOCKED_SAMPLE_HAS_SPEED');
  }
  if (sample?.passable === true && sample?.passability === 'BLOCKED') {
    issues.push('PASSABILITY_CONTRADICTION');
  }
  if (sample?.correspondenceStatus !== 'TRAVERSAL_UPSTREAM_CORRESPONDENCE_PASS') {
    issues.push('UPSTREAM_CORRESPONDENCE_NOT_PASSED');
  }
  if (sample?.nativeTruthOwnership !== 'TRAVERSAL_ONLY') {
    issues.push('NATIVE_TRUTH_OWNERSHIP_INVALID');
  }
  if (!sample?.sourceIdentities ||
      sample.sourceIdentities.terrainFieldContractId !== H_EARTH_TERRAIN_FIELD_CONTRACT_ID ||
      sample.sourceIdentities.surfaceStateContractId !== H_EARTH_SURFACE_STATE_FIELD_CONTRACT_ID ||
      sample.sourceIdentities.waterStateContractId !== H_EARTH_WATER_STATE_CONTRACT_ID) {
    issues.push('SOURCE_IDENTITIES_INVALID');
  }

  H_EARTH_TRAVERSAL_SURFACE_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(sample ?? {}, field)) {
      issues.push(`FORBIDDEN_NATIVE_OUTPUT:${field}`);
    }
  });

  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'TRAVERSAL_SURFACE_SAMPLE_PASS'
      : 'TRAVERSAL_SURFACE_SAMPLE_FAIL',
    contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
    traversalClass: sample?.traversalClass ?? null,
    issues
  });
}

export function getHEarthTraversalSurfaceReceipt() {
  const sample = sampleHEarthTraversalSurface(0, -160);
  const evaluation = evaluateHEarthTraversalSurfaceSample(sample);
  return deepFreeze({
    receiptType: 'H_EARTH_TRAVERSAL_SURFACE_RUN_7F_SOURCE_RECEIPT',
    contractId: H_EARTH_TRAVERSAL_SURFACE_CONTRACT_ID,
    traversalSurfaceRevision: H_EARTH_TRAVERSAL_SURFACE_REVISION,
    eligible: evaluation.eligible,
    status: evaluation.eligible
      ? 'TRAVERSAL_SURFACE_SOURCE_ELIGIBLE'
      : 'TRAVERSAL_SURFACE_SOURCE_NOT_ELIGIBLE',
    traversalClasses: H_EARTH_TRAVERSAL_CLASSES,
    sourceContractIdentities: sample.sourceIdentities ?? null,
    ownsMovementClassification: true,
    ownsMovementCost: true,
    ownsPassability: true,
    ownsHazards: true,
    ownsTerrainTruth: false,
    ownsSurfaceState: false,
    ownsWaterState: false,
    ownsBiome: false,
    ownsPopulation: false,
    ownsAmbientAudioProjection: false,
    ownsSpatialLifecycle: false,
    ownsGeometry: false,
    ownsNavigation: false,
    ownsRenderer: false,
    publicRouteMutation: false,
    productPromotionClaim: false,
    liveVerificationClaim: false,
    issues: evaluation.issues
  });
}

export default H_EARTH_TRAVERSAL_SURFACE;
