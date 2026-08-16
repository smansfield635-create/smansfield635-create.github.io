/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * C3C3R4 planetary world-frame reconstruction. South and west remain visible
 * connected-region continuations, but their far planform is circular and their
 * elevation consumes the same shared planetary transform as OPEN_WATER.
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
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_C3C3R4_SHARED_PLANETARY_FRAME_v1';

const ACCESSIBLE = freeze({ xMin: -1024, xMax: 1024, zMin: -1024 });
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

function lowReliefContinuation(innerElevation, distanceT, phase) {
  const settle = smooth(clamp01(distanceT * 1.35));
  const retained = lerp(innerElevation, Math.max(0.55, innerElevation * 0.16), settle);
  const rolling = (0.7 * Math.sin(phase + distanceT * Math.PI * 2.1)) + (0.32 * Math.sin(phase * 0.7 + distanceT * Math.PI * 5.1));
  return Math.max(0.35, retained + rolling * (1 - settle) * 0.5);
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

function appendBand({ vertices, indices, sampleCount, rowCount, pointAt }) {
  const base = vertices.length;
  for (let row = 0; row < rowCount; row += 1) {
    const distanceT = row / (rowCount - 1);
    for (let index = 0; index < sampleCount; index += 1) {
      const alongT = index / (sampleCount - 1);
      const point = pointAt(alongT, distanceT);
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

function constructVisualWorldContinuation() {
  const vertices = [];
  const indices = [];

  // South: move from the accessible south edge toward the circular planetary
  // horizon. The far Z endpoint changes continuously with X, eliminating the
  // prior rectangular terminal line.
  appendBand({
    vertices,
    indices,
    sampleCount: 97,
    rowCount: 27,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
      const innerX = lerp(ACCESSIBLE.xMin, ACCESSIBLE.xMax, alongT);
      const horizonX = innerX * 2.85;
      const outerZ = getHEarthPlanetaryHorizonZForX(horizonX, -1);
      const worldX = lerp(innerX, horizonX, eased);
      const worldZ = lerp(ACCESSIBLE.zMin, outerZ, eased);
      const local = sampleHEarthTerrainField(innerX, lerp(ACCESSIBLE.zMin, ACCESSIBLE.zMin - 220, Math.min(1, distanceT * 1.8))).elevation;
      const inner = sampleHEarthTerrainField(innerX, ACCESSIBLE.zMin);
      const far = lowReliefContinuation(inner.elevation, distanceT, 0.7 + alongT * 2.0);
      const unprojectedY = lerp(local, far, smooth(clamp01(distanceT * 1.8))) + thresholdBerm(distanceT, alongT, THRESHOLDS.south);
      return projectHEarthVisibleContinuationPoint({ x: worldX, y: unprojectedY, z: worldZ });
    }
  });

  // West: same shared curvature law and a circular far planform. It stops
  // landward of the north/east ocean-facing coast so no ocean-facing landmass
  // is manufactured.
  const innerX = ACCESSIBLE.xMin;
  const coastlineZ = getHEarthCanonicalShorelineZ(innerX);
  const landwardEndZ = Math.min(-160, coastlineZ - 72);
  appendBand({
    vertices,
    indices,
    sampleCount: 81,
    rowCount: 25,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
      const innerZ = lerp(ACCESSIBLE.zMin, landwardEndZ, alongT);
      const horizonZ = lerp(-2850, landwardEndZ - 180, alongT);
      const outerX = getHEarthPlanetaryHorizonXForZ(horizonZ, -1);
      const worldX = lerp(innerX, outerX, eased);
      const worldZ = lerp(innerZ, horizonZ, eased);
      const inner = sampleHEarthTerrainField(innerX, innerZ);
      const far = lowReliefContinuation(inner.elevation, distanceT, 1.4 + alongT);
      const unprojectedY = lerp(inner.elevation, far, smooth(clamp01(distanceT * 1.8))) + thresholdBerm(distanceT, alongT, THRESHOLDS.west);
      return projectHEarthVisibleContinuationPoint({ x: worldX, y: unprojectedY, z: worldZ });
    }
  });

  const primitiveId = 'H_EARTH_CONNECTED_REGION_CONTEXT:C3C3R4';
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'CURVED_PLANETARY_CONNECTED_REGION_CONTINUATION_WITH_LOW_RIDGE_PASSES',
    materialHint: freeze({ materialKey: 'worldTerrainField', materialIntent: 'SUBTROPICAL_CONNECTED_REGION_CONTINUATION_ON_SHARED_PLANETARY_FRAME', climateIdentity: 'WARM_SUBTROPICAL_COASTAL' }),
    source: freeze({ sourceType: 'H_EARTH_C3C3R4_SHARED_PLANETARY_CONNECTED_REGION_SYSTEM', highlandFormationAuthorityRetired: true }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
      sharedPlanetaryWorldFrame: true,
      sharedPlanetaryWorldFrameContractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
      planetaryRadius: H_EARTH_PLANETARY_WORLD_FRAME.effectivePlanetRadius,
      protectedTangentRadius: H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius,
      visibleHorizonRadius: H_EARTH_PLANETARY_WORLD_FRAME.visibleHorizonRadius,
      circularPlanformHorizon: true,
      rectangularTerminalGeometryPresent: false,
      formationId: null,
      formationClass: 'LOW_RELIEF_ADJACENT_REGION_CONTINUATION_ON_CURVED_PLANETARY_FRAME',
      sourceAddressRule: null,
      lodClass: 'CONNECTED_REGION_THRESHOLD_WITH_CURVED_PLANETARY_CONTINUATION',
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
      minimumThresholdUplift: THRESHOLD_PROFILE.baseUplift,
      maximumThresholdUplift: THRESHOLD_PROFILE.maximumUplift,
      semanticBoundaryArchitecturePresent: true,
      worldVisibleBeyondThreshold: true,
      mountainPassOceanRevealCorridorPreservationRequired: true,
      composedOcclusionAndRevealLaw: 'PASSES_AND_VALLEYS_MAY_FRAME_DISTANT_OCEAN_OR_CURVED_WORLD_CONTINUATION',
      adjacentRegionTraversable: false,
      adjacentRegionSemanticAuthority: false,
      accessibleRegionBounds: ACCESSIBLE,
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
      continuationLaw: 'LOCAL_TANGENT_TERRAIN_PLUS_SHARED_CURVED_PLANETARY_CONTINUATION_PLUS_COMPOSED_OCCLUSION_AND_REVEALS',
      visibleRectangularTerminationProhibited: true,
      technicalStatusSignageProhibited: true,
      baselinePreservationId: 'H_EARTH_C3C3_OWNER_VIDEO_23750_POSITIVE_BASELINE_20260816',
      ownerRepairEvidenceId: 'H_EARTH_C3C3R3_OWNER_SCREENSHOTS_PLANAR_RECTANGULAR_FAILURE_20260816',
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
    formationId: null,
    primitives: result.ok ? [result.primitive] : [],
    bounds: result.primitive?.geometry?.bounds ?? null,
    visualContinuationLayer: true,
    connectedRegionThresholdSystem: true,
    objectiveVisibleRegionalThresholds: true,
    thresholdCount: 2,
    mountainBarricadeRetired: true,
    highlandMaterialIdentityRetired: true,
    highlandFormationAuthorityRetired: true,
    circularPlanformHorizon: true,
    rectangularTerminalGeometryPresent: false,
    worldVisibleBeyondThreshold: true,
    adjacentRegionTraversable: false,
    accessibleRegionExpansion: false,
    admitted: false,
    issues: result.issues
  });
}
