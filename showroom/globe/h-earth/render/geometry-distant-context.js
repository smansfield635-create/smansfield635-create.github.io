/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_OW04_v7
 *
 * Constructs a non-navigable visual world envelope beyond the frozen accessible
 * region. It owns no semantic address, collision, navigation, admission, or
 * playable extent and creates no waterward landmass.
 *
 * OW04 v7 preserves exact edge continuity while accelerating vertical relief
 * attenuation after the frozen accessible boundary. The continuation retains
 * geographic depth but settles toward a restrained atmospheric horizon instead
 * of reading as an enclosing wall once long-range projection is restored.
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
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_OW04_v7_RESTRAINED_ATMOSPHERIC_SILHOUETTE';

const ACCESSIBLE = freeze({ xMin: -1024, xMax: 1024, zMin: -1024 });
const VISUAL_HORIZON = freeze({ xMin: -2200, xMax: 2200, zMin: -2200 });

function horizonElevation(innerElevation, distanceT, phase) {
  const settleT = smooth(clamp01(distanceT * 1.55));
  const retained = innerElevation * (1 - 0.965 * settleT);
  const relief =
    2.15 * Math.sin(phase + distanceT * Math.PI * 2.1) +
    0.85 * Math.sin(phase * 0.67 + distanceT * Math.PI * 5.7) +
    0.35 * Math.sin(phase * 1.41 + distanceT * Math.PI * 11.0);
  const reliefEnvelope = 0.72 * (1 - settleT) + 0.16;
  return Math.max(0.45, retained + relief * distanceT * reliefEnvelope);
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

function constructVisualWorldContinuation(formation) {
  const vertices = [];
  const indices = [];

  // Inland continuation preserves the exact accessible-edge row, then settles
  // vertical relief faster than horizontal/depth expansion. That preserves a
  // continuous world surface without carrying local mountains deep enough into
  // the visual envelope to become a full-field wall.
  appendBlendedBand({
    vertices,
    indices,
    sampleCount: 97,
    rowCount: 9,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
      const elevationT = smooth(clamp01(distanceT * 2.0));
      const innerX = lerp(ACCESSIBLE.xMin, ACCESSIBLE.xMax, alongT);
      const outerX = lerp(VISUAL_HORIZON.xMin, VISUAL_HORIZON.xMax, alongT);
      const inner = sampleHEarthTerrainField(innerX, ACCESSIBLE.zMin);
      const lateralMeander = (
        24 * Math.sin(alongT * Math.PI * 4.7 + distanceT * 1.3) +
        9 * Math.sin(alongT * Math.PI * 10.9 + 0.6)
      ) * distanceT * (0.35 + 0.65 * distanceT);
      const depthMeander = (
        34 * Math.sin(alongT * Math.PI * 2.3 + 0.4) +
        11 * Math.sin(alongT * Math.PI * 6.8)
      ) * distanceT;
      const localCarry = sampleHEarthTerrainField(
        innerX,
        lerp(ACCESSIBLE.zMin, ACCESSIBLE.zMin - 220, Math.min(1, distanceT * 1.55))
      ).elevation;
      const farY = horizonElevation(inner.elevation, distanceT, 0.8 + alongT * 2.7);
      return {
        x: lerp(innerX, outerX, eased) + lateralMeander,
        y: lerp(localCarry, farY, elevationT),
        z: lerp(ACCESSIBLE.zMin, VISUAL_HORIZON.zMin, eased) - depthMeander
      };
    }
  });

  // Lateral continuation remains landward of the canonical shoreline. The
  // edge row remains exact, while the same accelerated vertical settling keeps
  // side context subordinate to the playable foreground and open ocean.
  for (const side of ['WEST', 'EAST']) {
    const sign = side === 'WEST' ? -1 : 1;
    const innerX = side === 'WEST' ? ACCESSIBLE.xMin : ACCESSIBLE.xMax;
    const outerX = side === 'WEST' ? VISUAL_HORIZON.xMin : VISUAL_HORIZON.xMax;
    const coastlineZ = getHEarthCanonicalShorelineZ(innerX);
    const landwardEndZ = Math.min(-160, coastlineZ - 72);
    appendBlendedBand({
      vertices,
      indices,
      sampleCount: 69,
      rowCount: 7,
      pointAt: (alongT, distanceT) => {
        const eased = smooth(distanceT);
        const elevationT = smooth(clamp01(distanceT * 2.0));
        const innerZ = lerp(ACCESSIBLE.zMin, landwardEndZ, alongT);
        const farZ = lerp(VISUAL_HORIZON.zMin, landwardEndZ - 48, alongT);
        const inner = sampleHEarthTerrainField(innerX, innerZ);
        const lateralBreakup = sign * (
          21 * Math.sin(alongT * Math.PI * 4.1 + 0.9) +
          8 * Math.sin(alongT * Math.PI * 8.7 + 0.2)
        ) * distanceT;
        const farElevation = horizonElevation(
          inner.elevation,
          Math.min(1, distanceT * 1.08),
          side === 'WEST' ? 1.7 + alongT : 3.2 + alongT
        );
        return {
          x: lerp(innerX, outerX, eased) + lateralBreakup,
          y: lerp(inner.elevation, farElevation, elevationT),
          z: lerp(innerZ, farZ, eased) -
            18 * Math.sin(alongT * Math.PI * 2.2 + 0.3) * distanceT
        };
      }
    });
  }

  const primitiveId = `${formation.formationId}:DISTANT_PROXY`;
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'DISTANT_HIGHLAND_OR_MOUNTAIN_PROXY',
    materialHint: freeze({
      materialReference: 'H_EARTH_MATERIAL_HIGHLAND_PROXY',
      materialIntent: 'HIGHLAND_SUBTROPICAL_ATMOSPHERIC_DISTANT_TERRAIN_CONTINUATION'
    }),
    source: freeze({
      sourceType: 'H_EARTH_TERRAIN_FORMATION_PROXY_WITH_RESTRAINED_ATMOSPHERIC_VISUAL_CONTINUATION',
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
      lodClass: 'DISTANT_RESTRAINED_ATMOSPHERIC_COMPOSITE_PROXY',
      visualContinuationLayer: true,
      continuationRowCountInland: 9,
      continuationRowCountLateral: 7,
      accessibleRegionBounds: ACCESSIBLE,
      visualHorizonBounds: VISUAL_HORIZON,
      oceanFacingTerrainContinuation: false,
      oceanFacingLandmassCreated: false,
      legacyNearFieldHighlandCurtainRetired: true,
      exactAccessibleEdgeContinuityPreserved: true,
      acceleratedPostEdgeVerticalAttenuation: true,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      continuationLaw: 'INACCESSIBLE_WORLD_PRESERVES_EXACT_LOCAL_EDGE_THEN_SETTLES_VERTICALLY_INTO_RESTRAINED_ATMOSPHERIC_DISTANCE_WITHOUT_WATERWARD_LAND_OR_PLAYABLE_EXPANSION',
      visibleRectangularTerminationProhibited: true,
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
    accessibleRegionExpansion: false,
    admitted: false,
    issues: result.issues
  });
}
