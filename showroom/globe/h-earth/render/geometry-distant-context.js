/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_OW04_v6
 *
 * Constructs a non-navigable visual world envelope beyond the frozen accessible
 * region. It owns no semantic address, collision, navigation, admission, or
 * playable extent and creates no waterward landmass.
 *
 * OW04 v6 pushes the visual-only envelope materially farther from the player,
 * increases transitional depth, and attenuates far relief into an atmospheric
 * horizon. The intent is that the inaccessible world reads as continuation,
 * never as a nearby wall, shelf, or second continent across the ocean.
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
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_OW04_v6_DEEP_ATMOSPHERIC_WORLD_CONTINUATION';

const ACCESSIBLE = freeze({ xMin: -1024, xMax: 1024, zMin: -1024 });
const VISUAL_HORIZON = freeze({ xMin: -2200, xMax: 2200, zMin: -2200 });

function horizonElevation(innerElevation, distanceT, phase) {
  const retained = innerElevation * (1 - 0.91 * distanceT);
  const relief =
    4.2 * Math.sin(phase + distanceT * Math.PI * 2.1) +
    1.7 * Math.sin(phase * 0.67 + distanceT * Math.PI * 5.7) +
    0.8 * Math.sin(phase * 1.41 + distanceT * Math.PI * 11.0);
  return Math.max(0.65, retained + relief * distanceT * (1 - 0.45 * distanceT));
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

  // Inland continuation: eight depth rows move the existing terrain away from
  // the frozen boundary and progressively flatten it into atmospheric distance.
  // Far-row meander prevents a ruler-straight horizon while the relief envelope
  // shrinks with distance so no enclosing terrain face is created.
  appendBlendedBand({
    vertices,
    indices,
    sampleCount: 97,
    rowCount: 9,
    pointAt: (alongT, distanceT) => {
      const eased = smooth(distanceT);
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
        y: lerp(localCarry, farY, eased),
        z: lerp(ACCESSIBLE.zMin, VISUAL_HORIZON.zMin, eased) - depthMeander
      };
    }
  });

  // Lateral continuation is restricted to landward portions of the canonical
  // coast. It recedes farther than v5 and loses elevation aggressively with
  // distance. No geometry is generated beyond the shoreline on the waterward
  // side, preserving the continental-edge requirement: open ocean stays open.
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
          y: lerp(inner.elevation, farElevation, eased),
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
      sourceType: 'H_EARTH_TERRAIN_FORMATION_PROXY_WITH_DEEP_ATMOSPHERIC_VISUAL_CONTINUATION',
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
      lodClass: 'DISTANT_DEEP_ATMOSPHERIC_COMPOSITE_PROXY',
      visualContinuationLayer: true,
      continuationRowCountInland: 9,
      continuationRowCountLateral: 7,
      accessibleRegionBounds: ACCESSIBLE,
      visualHorizonBounds: VISUAL_HORIZON,
      oceanFacingTerrainContinuation: false,
      oceanFacingLandmassCreated: false,
      legacyNearFieldHighlandCurtainRetired: true,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      continuationLaw: 'INACCESSIBLE_WORLD_RECEDES_FROM_FROZEN_LOCAL_EDGE_INTO_ATMOSPHERIC_DISTANCE_WITHOUT_WATERWARD_LAND_OR_PLAYABLE_EXPANSION',
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
