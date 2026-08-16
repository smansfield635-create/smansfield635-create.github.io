/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_OW04_v4
 *
 * Constructs a non-navigable near/middle/far visual envelope beyond the frozen
 * accessible region. It carries inland/lateral terrain and horizon continuity
 * only. It owns no semantic address, collision, navigation, admission, or
 * playable extent, and creates no waterward landmass.
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

export const H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID =
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_OW04_v4_SEAMLESS_VISUAL_WORLD_ENVELOPE';

const ACCESSIBLE = freeze({ xMin: -1024, xMax: 1024, zMin: -1024 });
const VISUAL_HORIZON = freeze({ xMin: -1664, xMax: 1664, zMin: -1664 });

function horizonElevation(innerElevation, distanceT, phase) {
  const retained = innerElevation * (1 - 0.78 * distanceT);
  const relief = 5.0 * Math.sin(phase + distanceT * Math.PI * 2.4) +
    2.0 * Math.sin(phase * 0.63 + distanceT * Math.PI * 6.2);
  return Math.max(1.25, retained + relief * distanceT);
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

  // Preserve the established contextual highland silhouette, but keep it
  // irregular and subordinate to the larger continuation envelope.
  const { worldBounds, elevationEnvelope } = formation;
  const baseY = elevationEnvelope.minimum;
  const amplitude = elevationEnvelope.maximum - elevationEnvelope.minimum;
  appendBlendedBand({
    vertices,
    indices,
    sampleCount: 25,
    rowCount: 2,
    pointAt: (alongT, distanceT) => {
      const x = lerp(worldBounds.xMin, worldBounds.xMax, alongT);
      const envelope = 0.1 + 0.9 * Math.sin(alongT * Math.PI);
      const crest = baseY + amplitude * envelope *
        (0.68 + 0.14 * Math.sin(alongT * Math.PI * 5.5));
      return {
        x,
        y: distanceT === 0 ? baseY : crest,
        z: worldBounds.zMin + 7 * Math.sin(alongT * Math.PI * 2.3)
      };
    }
  });

  // Inland near/middle/far envelope. Multiple rows prevent the old single
  // stretched strip from reading as a shelf around the accessible rectangle.
  appendBlendedBand({
    vertices,
    indices,
    sampleCount: 81,
    rowCount: 6,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
      const innerX = lerp(ACCESSIBLE.xMin, ACCESSIBLE.xMax, alongT);
      const outerX = lerp(VISUAL_HORIZON.xMin, VISUAL_HORIZON.xMax, alongT);
      const inner = sampleHEarthTerrainField(innerX, ACCESSIBLE.zMin);
      const irregular = (18 * Math.sin(alongT * Math.PI * 5.1 + distanceT * 1.7) +
        7 * Math.sin(alongT * Math.PI * 11.3 + 0.4)) * distanceT;
      const x = lerp(innerX, outerX, eased) + irregular;
      const z = lerp(ACCESSIBLE.zMin, VISUAL_HORIZON.zMin, eased) -
        22 * Math.sin(alongT * Math.PI * 2.7) * distanceT;
      const farY = horizonElevation(inner.elevation, distanceT, 0.7 + alongT * 2.4);
      const localCarry = sampleHEarthTerrainField(
        innerX,
        lerp(ACCESSIBLE.zMin, ACCESSIBLE.zMin - 170, Math.min(1, distanceT * 1.8))
      ).elevation;
      return { x, y: lerp(localCarry, farY, eased), z };
    }
  });

  // Lateral continuation exists only landward of each canonical coast. It
  // blends through several rows and becomes increasingly irregular with
  // distance, eliminating the parallel-wall reading.
  for (const side of ['WEST', 'EAST']) {
    const sign = side === 'WEST' ? -1 : 1;
    const innerX = side === 'WEST' ? ACCESSIBLE.xMin : ACCESSIBLE.xMax;
    const outerX = side === 'WEST' ? VISUAL_HORIZON.xMin : VISUAL_HORIZON.xMax;
    const coastlineZ = getHEarthCanonicalShorelineZ(innerX);
    const landwardEndZ = Math.min(-112, coastlineZ - 30);
    appendBlendedBand({
      vertices,
      indices,
      sampleCount: 61,
      rowCount: 5,
      pointAt: (alongT, distanceT) => {
        const eased = smooth(distanceT);
        const innerZ = lerp(ACCESSIBLE.zMin, landwardEndZ, alongT);
        const farZ = lerp(VISUAL_HORIZON.zMin, landwardEndZ - 18, alongT);
        const inner = sampleHEarthTerrainField(innerX, innerZ);
        const lateralBreakup = sign * (16 * Math.sin(alongT * Math.PI * 4.4 + 0.8) +
          6 * Math.sin(alongT * Math.PI * 9.1)) * distanceT;
        return {
          x: lerp(innerX, outerX, eased) + lateralBreakup,
          y: lerp(inner.elevation, horizonElevation(inner.elevation, distanceT,
            side === 'WEST' ? 1.6 + alongT : 3.0 + alongT), eased),
          z: lerp(innerZ, farZ, eased) - 12 * Math.sin(alongT * Math.PI * 2.1) * distanceT
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
      sourceType: 'H_EARTH_TERRAIN_FORMATION_PROXY_WITH_MULTI_BAND_VISUAL_CONTINUATION',
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
      lodClass: 'DISTANT_MULTI_BAND_COMPOSITE_PROXY',
      visualContinuationLayer: true,
      continuationRowCountInland: 6,
      continuationRowCountLateral: 5,
      accessibleRegionBounds: ACCESSIBLE,
      visualHorizonBounds: VISUAL_HORIZON,
      oceanFacingTerrainContinuation: false,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      continuationLaw: 'VISIBLE_SURROUNDING_WORLD_BLENDS_FROM_LOCAL_EDGE_TO_DISTANCE_WITHOUT_EXPANDING_AUTHORED_ACCESSIBLE_REGION',
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
