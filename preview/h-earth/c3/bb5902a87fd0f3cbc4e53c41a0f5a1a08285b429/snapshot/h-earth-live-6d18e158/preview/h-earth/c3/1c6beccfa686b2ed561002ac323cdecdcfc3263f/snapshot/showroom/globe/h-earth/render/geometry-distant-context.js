/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * C3C3R3 objective-visible regional-boundary repair. South and west remain
 * visually continuous into adjacent regions, but each boundary now carries a
 * deliberately legible low ridge/pass threshold rather than a mountain wall.
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
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_C3C3R3_OBJECTIVE_VISIBLE_REGIONAL_THRESHOLDS_v1';

const ACCESSIBLE = freeze({ xMin: -1024, xMax: 1024, zMin: -1024 });
const VISUAL_HORIZON = freeze({ xMin: -4200, xMax: 3600, zMin: -4200 });
const THRESHOLDS = freeze({
  south: { boundaryId: 'H_EARTH_CONNECTED_REGION_THRESHOLD_SOUTH_003', regionBeyondId: 'CONTINENTAL_INTERIOR_REGION_VISUAL_CONTEXT', gateDistance: 245, passCenter: 0.57, passHalfWidth: 0.105 },
  west: { boundaryId: 'H_EARTH_CONNECTED_REGION_THRESHOLD_WEST_003', regionBeyondId: 'WESTERN_ADJACENT_REGION_VISUAL_CONTEXT', gateDistance: 225, passCenter: 0.52, passHalfWidth: 0.125 }
});
const THRESHOLD_PROFILE = freeze({
  baseUplift: 3.2,
  shoulderUplift: 5.6,
  maximumUplift: 8.8,
  longitudinalSigma: 0.024,
  visualClass: 'LOW_RIDGE_WITH_OPEN_PASS_AND_CONTINUING_TERRAIN',
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

  appendBand({
    vertices,
    indices,
    sampleCount: 97,
    rowCount: 25,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
      const innerX = lerp(ACCESSIBLE.xMin, ACCESSIBLE.xMax, alongT);
      const outerX = lerp(VISUAL_HORIZON.xMin, VISUAL_HORIZON.xMax, alongT);
      const inner = sampleHEarthTerrainField(innerX, ACCESSIBLE.zMin);
      const local = sampleHEarthTerrainField(innerX, lerp(ACCESSIBLE.zMin, ACCESSIBLE.zMin - 220, Math.min(1, distanceT * 1.8))).elevation;
      const far = lowReliefContinuation(inner.elevation, distanceT, 0.7 + alongT * 2.0);
      return {
        x: lerp(innerX, outerX, eased),
        y: lerp(local, far, smooth(clamp01(distanceT * 1.8))) + thresholdBerm(distanceT, alongT, THRESHOLDS.south),
        z: lerp(ACCESSIBLE.zMin, VISUAL_HORIZON.zMin, eased)
      };
    }
  });

  const innerX = ACCESSIBLE.xMin;
  const coastlineZ = getHEarthCanonicalShorelineZ(innerX);
  const landwardEndZ = Math.min(-160, coastlineZ - 72);
  appendBand({
    vertices,
    indices,
    sampleCount: 81,
    rowCount: 23,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
      const innerZ = lerp(ACCESSIBLE.zMin, landwardEndZ, alongT);
      const farZ = lerp(VISUAL_HORIZON.zMin, landwardEndZ - 48, alongT);
      const inner = sampleHEarthTerrainField(innerX, innerZ);
      const far = lowReliefContinuation(inner.elevation, distanceT, 1.4 + alongT);
      return {
        x: lerp(innerX, VISUAL_HORIZON.xMin, eased),
        y: lerp(inner.elevation, far, smooth(clamp01(distanceT * 1.8))) + thresholdBerm(distanceT, alongT, THRESHOLDS.west),
        z: lerp(innerZ, farZ, eased)
      };
    }
  });

  const primitiveId = 'H_EARTH_CONNECTED_REGION_CONTEXT:C3C3R3';
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'CONNECTED_REGION_THRESHOLD_AND_LOW_RELIEF_VISUAL_CONTINUATION',
    materialHint: freeze({ materialKey: 'worldTerrainField', materialIntent: 'SUBTROPICAL_CONNECTED_REGION_THRESHOLD_AND_ADJACENT_CONTINUATION', climateIdentity: 'WARM_SUBTROPICAL_COASTAL' }),
    source: freeze({ sourceType: 'H_EARTH_C3C3R3_CONNECTED_REGION_THRESHOLD_SYSTEM', highlandFormationAuthorityRetired: true }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
      formationId: null,
      formationClass: 'LOW_RELIEF_ADJACENT_REGION_CONTINUATION',
      sourceAddressRule: null,
      lodClass: 'CONNECTED_REGION_THRESHOLD_WITH_OBJECTIVE_VISIBLE_LOW_RIDGE_PASS',
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
      adjacentRegionTraversable: false,
      adjacentRegionSemanticAuthority: false,
      accessibleRegionBounds: ACCESSIBLE,
      visualHorizonBounds: VISUAL_HORIZON,
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
      continuationLaw: 'WORLD_CONTINUES_BEYOND_LEGIBLE_LOW_RIDGE_PASS_THRESHOLDS_WHILE_NORTH_AND_EAST_REMAIN_OPEN_OCEAN',
      visibleRectangularTerminationProhibited: true,
      technicalStatusSignageProhibited: true,
      baselinePreservationId: 'H_EARTH_C3C3_OWNER_VIDEO_23750_POSITIVE_BASELINE_20260816',
      ownerRepairEvidenceId: 'H_EARTH_C3C3R2_OWNER_VIDEO_23753_REPAIR_REQUIRED_20260816',
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
    worldVisibleBeyondThreshold: true,
    adjacentRegionTraversable: false,
    accessibleRegionExpansion: false,
    admitted: false,
    issues: result.issues
  });
}
