/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * C3C3R owner-deficiency successor. Replaces scenery-as-boundary with two
 * explicit connected-region thresholds while preserving visible world
 * continuation beyond the frozen H-Earth navigation envelope. North/east
 * remain open ocean; adjacent-region context is visual-only and inaccessible.
 */

import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

import { H_EARTH_TERRAIN_FORMATIONS } from '../../../../h-earth-3d/terrain/h-earth.terrain-formations.js';
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
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_C3C3R_CONNECTED_REGION_THRESHOLDS_v1';

const ACCESSIBLE = freeze({ xMin: -1024, xMax: 1024, zMin: -1024 });
const VISUAL_HORIZON = freeze({ xMin: -4200, xMax: 3600, zMin: -4200 });
const THRESHOLDS = freeze({
  south: {
    boundaryId: 'H_EARTH_CONNECTED_REGION_THRESHOLD_SOUTH_001',
    regionBeyondId: 'CONTINENTAL_INTERIOR_REGION_VISUAL_CONTEXT',
    gateDistance: 300,
    passCenter: 0.57,
    passHalfWidth: 0.085
  },
  west: {
    boundaryId: 'H_EARTH_CONNECTED_REGION_THRESHOLD_WEST_001',
    regionBeyondId: 'WESTERN_ADJACENT_REGION_VISUAL_CONTEXT',
    gateDistance: 260,
    passCenter: 0.52,
    passHalfWidth: 0.10
  }
});

function horizonElevation(innerElevation, distanceT, phase) {
  const settleT = smooth(clamp01(distanceT * 1.45));
  const retained = innerElevation * (1 - 0.94 * settleT);
  const relief = 1.25 * Math.sin(phase + distanceT * Math.PI * 1.7)
    + 0.52 * Math.sin(phase * 0.61 + distanceT * Math.PI * 4.2);
  return Math.max(0.35, retained + relief * (1 - settleT) * 0.55);
}

function passFactor(alongT, center, halfWidth) {
  const distance = Math.abs(alongT - center);
  return smooth(clamp01((distance - halfWidth) / (halfWidth * 1.7)));
}

function thresholdUplift(distanceT, alongT, threshold) {
  const gateT = threshold.gateDistance / 3200;
  const center = Math.exp(-Math.pow((distanceT - gateT) / 0.045, 2));
  const shoulder = passFactor(alongT, threshold.passCenter, threshold.passHalfWidth);
  return center * (7.5 + shoulder * 13.5);
}

function appendBlendedBand({ vertices, indices, sampleCount, rowCount, pointAt }) {
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

function appendOpenPier(vertices, indices, { x, y, z, width, height, depth }) {
  const base = vertices.length;
  const x0 = x - width / 2, x1 = x + width / 2;
  const z0 = z - depth / 2, z1 = z + depth / 2;
  const y0 = y, y1 = y + height;
  [
    [x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],
    [x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]
  ].forEach(([vx,vy,vz]) => vertices.push(createHEarthVector3(vx,vy,vz)));
  // Intentionally omit top/bottom caps. The distant-context provider is one
  // OPEN_ALLOWED neutral mesh; embedding closed box shells in that same mesh
  // produces mixed topology and correctly fails the geometry kernel.
  const faces = [
    0,1,2,0,2,3, 4,6,5,4,7,6,
    1,5,6,1,6,2, 0,3,7,0,7,4
  ];
  faces.forEach((index) => indices.push(base + index));
}

function constructVisualWorldContinuation(formation) {
  const vertices = [];
  const indices = [];

  // SOUTH: a low threshold corridor with a readable central pass. Terrain
  // continues beyond it at lower contrast/elevation rather than terminating.
  appendBlendedBand({
    vertices,
    indices,
    sampleCount: 97,
    rowCount: 17,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
      const elevationT = smooth(clamp01(distanceT * 1.85));
      const innerX = lerp(ACCESSIBLE.xMin, ACCESSIBLE.xMax, alongT);
      const outerX = lerp(VISUAL_HORIZON.xMin, VISUAL_HORIZON.xMax, alongT);
      const inner = sampleHEarthTerrainField(innerX, ACCESSIBLE.zMin);
      const localCarry = sampleHEarthTerrainField(
        innerX,
        lerp(ACCESSIBLE.zMin, ACCESSIBLE.zMin - 240, Math.min(1, distanceT * 1.7))
      ).elevation;
      const farY = horizonElevation(inner.elevation, distanceT, 0.8 + alongT * 2.2);
      const threshold = thresholdUplift(distanceT, alongT, THRESHOLDS.south);
      return {
        x: lerp(innerX, outerX, eased) + 11 * Math.sin(alongT * Math.PI * 4.0) * distanceT,
        y: lerp(localCarry, farY, elevationT) + threshold,
        z: lerp(ACCESSIBLE.zMin, VISUAL_HORIZON.zMin, eased)
      };
    }
  });

  // WEST: a second independent threshold corridor. It stops traversal at the
  // existing authority line but maintains visual terrain beyond the threshold.
  const innerX = ACCESSIBLE.xMin;
  const coastlineZ = getHEarthCanonicalShorelineZ(innerX);
  const landwardEndZ = Math.min(-160, coastlineZ - 72);
  appendBlendedBand({
    vertices,
    indices,
    sampleCount: 73,
    rowCount: 15,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
      const elevationT = smooth(clamp01(distanceT * 1.9));
      const innerZ = lerp(ACCESSIBLE.zMin, landwardEndZ, alongT);
      const farZ = lerp(VISUAL_HORIZON.zMin, landwardEndZ - 48, alongT);
      const inner = sampleHEarthTerrainField(innerX, innerZ);
      const farElevation = horizonElevation(inner.elevation, distanceT, 1.55 + alongT);
      const threshold = thresholdUplift(distanceT, alongT, THRESHOLDS.west);
      return {
        x: lerp(innerX, VISUAL_HORIZON.xMin, eased),
        y: lerp(inner.elevation, farElevation, elevationT) + threshold,
        z: lerp(innerZ, farZ, eased) - 8 * Math.sin(alongT * Math.PI * 2.1) * distanceT
      };
    }
  });

  // Diegetic threshold piers make the regional grammar legible without text or
  // technical signage. They are beyond the playable line and own no authority.
  const southGateZ = ACCESSIBLE.zMin - THRESHOLDS.south.gateDistance;
  const southGateX = lerp(ACCESSIBLE.xMin, ACCESSIBLE.xMax, THRESHOLDS.south.passCenter);
  const southGround = sampleHEarthTerrainField(southGateX, ACCESSIBLE.zMin).elevation;
  appendOpenPier(vertices, indices, { x: southGateX - 86, y: southGround, z: southGateZ, width: 18, height: 54, depth: 18 });
  appendOpenPier(vertices, indices, { x: southGateX + 86, y: southGround, z: southGateZ, width: 18, height: 54, depth: 18 });

  const westGateX = ACCESSIBLE.xMin - THRESHOLDS.west.gateDistance;
  const westGateZ = lerp(ACCESSIBLE.zMin, landwardEndZ, THRESHOLDS.west.passCenter);
  const westGround = sampleHEarthTerrainField(ACCESSIBLE.xMin, westGateZ).elevation;
  appendOpenPier(vertices, indices, { x: westGateX, y: westGround, z: westGateZ - 78, width: 18, height: 48, depth: 18 });
  appendOpenPier(vertices, indices, { x: westGateX, y: westGround, z: westGateZ + 78, width: 18, height: 48, depth: 18 });

  const primitiveId = `${formation.formationId}:CONNECTED_REGION_CONTEXT`;
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'CONNECTED_REGION_THRESHOLD_AND_VISUAL_CONTINUATION',
    materialHint: freeze({
      materialReference: 'H_EARTH_MATERIAL_HIGHLAND_PROXY',
      materialIntent: 'REGIONAL_THRESHOLD_STONE_AND_ATMOSPHERIC_CONTINUATION'
    }),
    source: freeze({
      sourceType: 'H_EARTH_C3C3R_CONNECTED_REGION_THRESHOLD_SYSTEM',
      formationId: formation.formationId,
      generationRevision: formation.generationRevision
    }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
      formationId: formation.formationId,
      formationClass: formation.formationClass,
      sourceAddressRule: formation.addressRule,
      worldBounds: formation.worldBounds,
      elevationEnvelope: formation.elevationEnvelope,
      lodClass: 'CONNECTED_REGION_THRESHOLD_WITH_DISTANT_VISUAL_CONTEXT',
      visualContinuationLayer: true,
      connectedRegionThresholdSystem: true,
      boundaryIds: [THRESHOLDS.south.boundaryId, THRESHOLDS.west.boundaryId],
      regionBeyondIds: [THRESHOLDS.south.regionBeyondId, THRESHOLDS.west.regionBeyondId],
      thresholdCount: 2,
      mountainBarricadeRetired: true,
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
      continuationLaw: 'PLAYABLE_H_EARTH_ENDS_AT_SOUTH_AND_WEST_THRESHOLDS_WHILE_VISIBLE_WORLD_CONTINUES;NORTH_AND_EAST_REMAIN_OPEN_OCEAN',
      visibleRectangularTerminationProhibited: true,
      technicalStatusSignageProhibited: true,
      baselinePreservationId: 'H_EARTH_C3C3_OWNER_VIDEO_23750_POSITIVE_BASELINE_20260816',
      admitted: false,
      aggregateFrameAuthority: false
    })
  });

  return freeze({
    ok: construction?.valid === true && isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord),
    primitive: construction?.primitiveRecord ?? null,
    issues: construction?.issues ?? []
  });
}

export function constructHEarthDistantContextGeometry() {
  const formation = H_EARTH_TERRAIN_FORMATIONS.DISTANT_HIGHLAND_001;
  const result = constructVisualWorldContinuation(formation);
  return freeze({
    ok: result.ok,
    status: result.ok ? 'DISTANT_CONTEXT_GEOMETRY_COMPLETE' : 'DISTANT_CONTEXT_GEOMETRY_FAILED',
    contractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
    formationId: formation.formationId,
    primitives: result.ok ? [result.primitive] : [],
    bounds: result.primitive?.geometry?.bounds ?? null,
    visualContinuationLayer: true,
    connectedRegionThresholdSystem: true,
    thresholdCount: 2,
    mountainBarricadeRetired: true,
    worldVisibleBeyondThreshold: true,
    adjacentRegionTraversable: false,
    accessibleRegionExpansion: false,
    admitted: false,
    issues: result.issues
  });
}
