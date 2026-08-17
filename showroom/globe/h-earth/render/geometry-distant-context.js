/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * Gen305 S26 performance/world-envelope successor. The accessible C3C3R5
 * geography remains untouched. This provider owns only visual continuation
 * beyond that geography and makes computational density fall with distance.
 */

import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

import {
  getHEarthCanonicalShorelineZ,
  sampleHEarthTerrainField
} from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

import {
  H_EARTH_PLANETARY_WORLD_FRAME,
  H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  getHEarthPlanetaryHorizonZForX,
  getHEarthPlanetaryHorizonXForZ,
  projectHEarthVisibleContinuationPoint
} from './planetary-world-frame.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (value) => Math.min(1, Math.max(0, value));

export const H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID =
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_GEN305_S26_MONOTONIC_WORLD_ENVELOPE_v1';

const ACCESSIBLE = freeze({ xMin: -1024, xMax: 1024, zMin: -1024 });

/**
 * First-class rendering zones. NEAR_FIELD is declared here only as a protected
 * boundary: its geometry remains owned by the existing playable terrain.
 */
export const H_EARTH_WORLD_ENVELOPE_ZONES = freeze({
  NEAR_FIELD: {
    zoneId: 'NEAR_FIELD',
    authority: 'PLAYABLE_EXISTING_C3C3R5_GEOGRAPHY',
    fidelityRank: 3,
    geometryDensityRank: 3,
    shaderCostRank: 3,
    interactionAuthority: 'EXISTING_ONLY',
    generatedByThisProvider: false,
    protectedBounds: ACCESSIBLE,
    prohibited: ['GEOGRAPHY_RELOCATION', 'GEOGRAPHY_SHRINK', 'NAVIGATION_ENVELOPE_CHANGE', 'SHORELINE_TOPOLOGY_CHANGE']
  },
  TRANSITION_FIELD: {
    zoneId: 'TRANSITION_FIELD',
    authority: 'VISUAL_CONTINUATION_ONLY',
    fidelityRank: 2,
    geometryDensityRank: 2,
    shaderCostRank: 2,
    interactionAuthority: 'NONE',
    globalDistanceRange: [0.0, 0.52],
    southSamples: freeze({ along: 65, rows: 17 }),
    westSamples: freeze({ along: 49, rows: 15 }),
    prohibited: ['COLLISION', 'NAVIGATION', 'SEMANTIC_ADDRESS_EXPANSION', 'FULL_DETAIL_16X16_TERRAIN', 'HIGH_FREQUENCY_PROCEDURAL_RELIEF']
  },
  HORIZON_BOUNDARY_FIELD: {
    zoneId: 'HORIZON_BOUNDARY_FIELD',
    authority: 'VISUAL_ONLY_NON_NAVIGABLE',
    fidelityRank: 1,
    geometryDensityRank: 1,
    shaderCostRank: 1,
    interactionAuthority: 'NONE',
    globalDistanceRange: [0.48, 1.0],
    southSamples: freeze({ along: 33, rows: 8 }),
    westSamples: freeze({ along: 25, rows: 7 }),
    prohibited: ['COLLISION', 'NAVIGATION', 'SEMANTIC_ADDRESS_EXPANSION', 'FULL_DETAIL_16X16_TERRAIN', 'HIGH_FREQUENCY_PROCEDURAL_RELIEF', 'SCREEN_SPACE_BOUNDARY_AUTHORITY']
  }
});

const THRESHOLDS = freeze({
  south: { boundaryId: 'H_EARTH_CONNECTED_REGION_THRESHOLD_SOUTH_004', regionBeyondId: 'CONTINENTAL_INTERIOR_REGION_VISUAL_CONTEXT', gateDistance: 245, passCenter: 0.57, passHalfWidth: 0.105 },
  west: { boundaryId: 'H_EARTH_CONNECTED_REGION_THRESHOLD_WEST_004', regionBeyondId: 'WESTERN_ADJACENT_REGION_VISUAL_CONTEXT', gateDistance: 225, passCenter: 0.52, passHalfWidth: 0.125 }
});
const THRESHOLD_PROFILE = freeze({
  baseUplift: 3.2,
  shoulderUplift: 5.6,
  maximumUplift: 8.8,
  longitudinalSigma: 0.024,
  visualClass: 'LOW_RIDGE_WITH_OPEN_PASS_AND_CONTINUING_CURVED_PLANETARY_TERRAIN',
  mountainScaleProhibited: true
});
const HORIZON_DISSOLVE = freeze({
  beginT: 0.62,
  maximumSink: 12.4,
  irregularity: 3.5,
  terminalHardEdgeProhibited: true,
  purpose: 'COMPOSE_SPARSE_WORLD_SPACE_SILHOUETTE_DEPTH_WITH_ATMOSPHERIC_OCCLUSION_BELOW_GEOMETRIC_SIGHTLINE'
});

function lowReliefContinuation(innerElevation, distanceT, phase) {
  const settle = smooth(clamp01(distanceT * 1.35));
  const retained = lerp(innerElevation, Math.max(0.2, innerElevation * 0.11), settle);
  // Only broad, low-frequency shape survives into the visual envelope.
  const rolling = (0.7 * Math.sin(phase + distanceT * Math.PI * 2.1)) +
    (0.28 * Math.sin(phase * 0.7 + distanceT * Math.PI * 4.2));
  return Math.max(0.05, retained + rolling * (1 - settle) * 0.40);
}
function passShoulder(alongT, center, halfWidth) {
  const distance = Math.abs(alongT - center);
  return smooth(clamp01((distance - halfWidth) / (halfWidth * 1.35)));
}
function thresholdBerm(distanceT, alongT, threshold) {
  const gateT = threshold.gateDistance / 3200;
  const longitudinal = Math.exp(-Math.pow((distanceT - gateT) / THRESHOLD_PROFILE.longitudinalSigma, 2));
  const shoulder = passShoulder(alongT, threshold.passCenter, threshold.passHalfWidth);
  return longitudinal * (THRESHOLD_PROFILE.baseUplift + shoulder * THRESHOLD_PROFILE.shoulderUplift);
}
function horizonDissolveSink(distanceT, alongT, phase) {
  const progress = smooth(clamp01((distanceT - HORIZON_DISSOLVE.beginT) / Math.max(Number.EPSILON, 1 - HORIZON_DISSOLVE.beginT)));
  if (progress <= 0) return 0;
  const irregular = 1 + 0.24 * Math.sin(phase + alongT * Math.PI * 4.2) + 0.10 * Math.sin(phase * 1.7 + alongT * Math.PI * 8.1);
  return progress * (HORIZON_DISSOLVE.maximumSink + HORIZON_DISSOLVE.irregularity * irregular);
}

function appendBand({ vertices, indices, sampleCount, rowCount, globalStartT, globalEndT, pointAt }) {
  const base = vertices.length;
  for (let row = 0; row < rowCount; row += 1) {
    const localDistanceT = row / (rowCount - 1);
    const globalDistanceT = lerp(globalStartT, globalEndT, localDistanceT);
    for (let index = 0; index < sampleCount; index += 1) {
      const alongT = index / (sampleCount - 1);
      const point = pointAt(alongT, globalDistanceT);
      vertices.push(createHEarthVector3(point.x, point.y, point.z));
    }
  }
  for (let row = 0; row < rowCount - 1; row += 1) {
    for (let index = 0; index < sampleCount - 1; index += 1) {
      const a = base + row * sampleCount + index;
      const b = a + 1;
      const c = a + sampleCount;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
}

function southPoint(alongT, distanceT) {
  const eased = smooth(distanceT);
  const innerX = lerp(ACCESSIBLE.xMin, ACCESSIBLE.xMax, alongT);
  const horizonX = innerX * (2.72 + 0.08 * Math.sin(alongT * Math.PI * 3.2));
  const outerZ = getHEarthPlanetaryHorizonZForX(horizonX, -1);
  const worldX = lerp(innerX, horizonX, eased);
  const worldZ = lerp(ACCESSIBLE.zMin, outerZ, eased);
  const local = sampleHEarthTerrainField(innerX, lerp(ACCESSIBLE.zMin, ACCESSIBLE.zMin - 220, Math.min(1, distanceT * 1.8))).elevation;
  const inner = sampleHEarthTerrainField(innerX, ACCESSIBLE.zMin);
  const far = lowReliefContinuation(inner.elevation, distanceT, 0.7 + alongT * 2.0);
  const dissolve = horizonDissolveSink(distanceT, alongT, 0.55);
  const y = lerp(local, far, smooth(clamp01(distanceT * 1.8))) + thresholdBerm(distanceT, alongT, THRESHOLDS.south) - dissolve;
  return projectHEarthVisibleContinuationPoint({ x: worldX, y, z: worldZ });
}

const WEST_INNER_X = ACCESSIBLE.xMin;
const WEST_COASTLINE_Z = getHEarthCanonicalShorelineZ(WEST_INNER_X);
const WEST_LANDWARD_END_Z = Math.min(-160, WEST_COASTLINE_Z - 72);
function westPoint(alongT, distanceT) {
  const eased = smooth(distanceT);
  const innerZ = lerp(ACCESSIBLE.zMin, WEST_LANDWARD_END_Z, alongT);
  const horizonZ = lerp(-2780 - 120 * Math.sin(alongT * Math.PI * 1.6), WEST_LANDWARD_END_Z - 180, alongT);
  const outerX = getHEarthPlanetaryHorizonXForZ(horizonZ, -1);
  const worldX = lerp(WEST_INNER_X, outerX, eased);
  const worldZ = lerp(innerZ, horizonZ, eased);
  const inner = sampleHEarthTerrainField(WEST_INNER_X, innerZ);
  const far = lowReliefContinuation(inner.elevation, distanceT, 1.4 + alongT);
  const dissolve = horizonDissolveSink(distanceT, alongT, 1.35);
  const y = lerp(inner.elevation, far, smooth(clamp01(distanceT * 1.8))) + thresholdBerm(distanceT, alongT, THRESHOLDS.west) - dissolve;
  return projectHEarthVisibleContinuationPoint({ x: worldX, y, z: worldZ });
}

function constructVisualWorldContinuation() {
  const vertices = [];
  const indices = [];
  const transition = H_EARTH_WORLD_ENVELOPE_ZONES.TRANSITION_FIELD;
  const horizon = H_EARTH_WORLD_ENVELOPE_ZONES.HORIZON_BOUNDARY_FIELD;

  // Transition field: materially lighter than playable terrain.
  appendBand({ vertices, indices, sampleCount: transition.southSamples.along, rowCount: transition.southSamples.rows, globalStartT: 0.0, globalEndT: 0.52, pointAt: southPoint });
  appendBand({ vertices, indices, sampleCount: transition.westSamples.along, rowCount: transition.westSamples.rows, globalStartT: 0.0, globalEndT: 0.52, pointAt: westPoint });

  // Horizon field: sparse overlapping silhouettes preserve depth continuity while
  // getting cheaper with distance. The overlap hides T-junctions between LODs.
  appendBand({ vertices, indices, sampleCount: horizon.southSamples.along, rowCount: horizon.southSamples.rows, globalStartT: 0.48, globalEndT: 1.0, pointAt: southPoint });
  appendBand({ vertices, indices, sampleCount: horizon.westSamples.along, rowCount: horizon.westSamples.rows, globalStartT: 0.48, globalEndT: 1.0, pointAt: westPoint });

  const primitiveId = 'H_EARTH_CONNECTED_REGION_CONTEXT:GEN305_S26';
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'MONOTONIC_COST_TRANSITION_AND_HORIZON_WORLD_SPACE_CONTINUATION',
    materialHint: freeze({
      materialKey: 'worldTerrainField',
      materialIntent: 'LOW_FREQUENCY_SUBTROPICAL_VISUAL_CONTINUATION_WITH_DEPTH_ORDERED_ATMOSPHERIC_OCCLUSION',
      climateIdentity: 'WARM_SUBTROPICAL_COASTAL'
    }),
    source: freeze({ sourceType: 'H_EARTH_GEN305_S26_SHARED_PLANETARY_VISUAL_ENVELOPE', highlandFormationAuthorityRetired: true }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
      sharedPlanetaryWorldFrame: true,
      sharedPlanetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
      planetaryRadius: H_EARTH_PLANETARY_WORLD_FRAME.effectivePlanetRadius,
      protectedTangentRadius: H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius,
      visibleHorizonRadius: H_EARTH_PLANETARY_WORLD_FRAME.visibleHorizonRadius,
      worldEnvelopeZones: H_EARTH_WORLD_ENVELOPE_ZONES,
      geometryDensityMonotonicallyDecreasesWithDistance: true,
      shaderCostMonotonicallyDecreasesWithDistanceContract: true,
      interactionAuthorityTendsToZeroWithDistance: true,
      horizonInteractionAuthority: 0,
      composedBoundarySystem: freeze({ sparseSilhouetteGeometry: true, depthOrdering: true, atmosphericOcclusion: true, hazeOnlyBoundary: false }),
      circularPlanformHorizon: true,
      rectangularTerminalGeometryPresent: false,
      terminalHardEdgeProhibited: true,
      horizonDissolveApplied: true,
      horizonDissolveProfile: HORIZON_DISSOLVE,
      visualContinuationLayer: true,
      connectedRegionThresholdSystem: true,
      objectiveVisibleRegionalThresholds: true,
      thresholdVisualClass: THRESHOLD_PROFILE.visualClass,
      boundaryIds: [THRESHOLDS.south.boundaryId, THRESHOLDS.west.boundaryId],
      regionBeyondIds: [THRESHOLDS.south.regionBeyondId, THRESHOLDS.west.regionBeyondId],
      thresholdCount: 2,
      mountainBarricadeRetired: true,
      highlandMaterialIdentityRetired: true,
      highlandFormationAuthorityRetired: true,
      semanticBoundaryArchitecturePresent: true,
      worldVisibleBeyondThreshold: true,
      adjacentRegionTraversable: false,
      adjacentRegionSemanticAuthority: false,
      accessibleRegionBounds: ACCESSIBLE,
      playableGeographyMutation: false,
      southContinentalContinuationPreserved: true,
      westContinentalContinuationPreserved: true,
      eastContinentalContinuationRetiredForOpenOcean: true,
      primaryOceanExposure: '+Z_NORTH',
      secondaryOceanExposure: '+X_EAST',
      oceanFacingTerrainContinuation: false,
      oceanFacingLandmassCreated: false,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      continuationLaw: 'VISUAL_DISTANCE_INCREASES_WHILE_GEOMETRY_DENSITY_SHADER_COST_AND_INTERACTION_AUTHORITY_DECREASE',
      visibleRectangularTerminationProhibited: true,
      technicalStatusSignageProhibited: true,
      baselinePreservationId: 'H_EARTH_C3C3_OWNER_VIDEO_23750_POSITIVE_BASELINE_20260816',
      gen305OperationId: 'H_EARTH_C3C3R5_S26_PERFORMANCE_WORLD_ENVELOPE_SUCCESSOR_20260817_001',
      admitted: false,
      aggregateFrameAuthority: false
    })
  });

  return freeze({ ok: construction?.valid === true && isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord), primitive: construction?.primitiveRecord ?? null, issues: construction?.issues ?? [] });
}

export function constructHEarthDistantContextGeometry() {
  const result = constructVisualWorldContinuation();
  return freeze({
    ok: result.ok,
    status: result.ok ? 'DISTANT_CONTEXT_GEOMETRY_COMPLETE' : 'DISTANT_CONTEXT_GEOMETRY_FAILED',
    contractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
    sharedPlanetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
    primitives: result.ok ? [result.primitive] : [],
    bounds: result.primitive?.geometry?.bounds ?? null,
    worldEnvelopeZones: H_EARTH_WORLD_ENVELOPE_ZONES,
    geometryDensityMonotonicallyDecreasesWithDistance: true,
    composedBoundarySystem: freeze({ sparseSilhouetteGeometry: true, depthOrdering: true, atmosphericOcclusion: true }),
    visualContinuationLayer: true,
    connectedRegionThresholdSystem: true,
    objectiveVisibleRegionalThresholds: true,
    thresholdCount: 2,
    circularPlanformHorizon: true,
    rectangularTerminalGeometryPresent: false,
    terminalHardEdgeProhibited: true,
    horizonDissolveApplied: true,
    worldVisibleBeyondThreshold: true,
    adjacentRegionTraversable: false,
    accessibleRegionExpansion: false,
    admitted: false,
    issues: result.issues
  });
}
