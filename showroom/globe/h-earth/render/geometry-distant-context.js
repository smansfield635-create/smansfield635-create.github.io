/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_RUN_6C_v3
 *
 * Constructs non-navigable visual context beyond the frozen accessible region.
 * The layer carries inland/lateral terrain and horizon continuity only. It owns
 * no semantic address, collision, navigation, admission, or playable extent.
 */

import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

import {
  H_EARTH_TERRAIN_FORMATIONS
} from '../../../../h-earth-3d/terrain/h-earth.terrain-formations.js';

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

export const H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID =
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_OW03_v3_VISUAL_WORLD_CONTINUATION';

const ACCESSIBLE = freeze({
  xMin: -1024,
  xMax: 1024,
  zMin: -1024
});
const VISUAL_HORIZON = freeze({
  xMin: -1536,
  xMax: 1536,
  zMin: -1536
});

function appendStrip({ vertices, indices, sampleCount, innerAt, outerAt }) {
  const base = vertices.length;
  for (let index = 0; index < sampleCount; index += 1) {
    const t = index / (sampleCount - 1);
    const inner = innerAt(t);
    const outer = outerAt(t);
    vertices.push(
      createHEarthVector3(inner.x, inner.y, inner.z),
      createHEarthVector3(outer.x, outer.y, outer.z)
    );
  }
  for (let index = 0; index < sampleCount - 1; index += 1) {
    const a = base + index * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }
}

function horizonElevation(innerElevation, t, phase) {
  const retained = innerElevation * (1 - 0.72 * t);
  const relief = 4.5 * Math.sin(phase + t * Math.PI * 3) +
    2.2 * Math.sin(phase * 0.7 + t * Math.PI * 7);
  return Math.max(1.5, retained + relief * t);
}

function constructVisualWorldContinuation(formation) {
  const vertices = [];
  const indices = [];

  // Preserve the established distant highland silhouette inside the authored
  // region as contextual geography.
  const highlandSamples = 17;
  const { worldBounds, elevationEnvelope } = formation;
  const baseY = elevationEnvelope.minimum;
  const amplitude = elevationEnvelope.maximum - elevationEnvelope.minimum;
  const minimumEnvelope = 0.08;
  appendStrip({
    vertices,
    indices,
    sampleCount: highlandSamples,
    innerAt: (progress) => {
      const x = worldBounds.xMin + (worldBounds.xMax - worldBounds.xMin) * progress;
      const z = worldBounds.zMin + 7 * Math.sin(progress * Math.PI * 2);
      return { x, y: baseY, z };
    },
    outerAt: (progress) => {
      const x = worldBounds.xMin + (worldBounds.xMax - worldBounds.xMin) * progress;
      const z = worldBounds.zMin + 7 * Math.sin(progress * Math.PI * 2);
      const envelope = minimumEnvelope +
        (1 - minimumEnvelope) * Math.sin(progress * Math.PI);
      const crest = baseY + amplitude * envelope *
        (0.72 + 0.18 * Math.sin(progress * Math.PI * 5));
      return { x, y: crest, z };
    }
  });

  // Inland continuation. The inner row is sampled exactly on the frozen
  // accessible boundary; the outer row loses fine relief into atmospheric
  // horizon-scale terrain. It is presentation only.
  appendStrip({
    vertices,
    indices,
    sampleCount: 65,
    innerAt: (t) => {
      const x = ACCESSIBLE.xMin + (ACCESSIBLE.xMax - ACCESSIBLE.xMin) * t;
      const sample = sampleHEarthTerrainField(x, ACCESSIBLE.zMin);
      return { x, y: sample.elevation, z: ACCESSIBLE.zMin };
    },
    outerAt: (t) => {
      const x = VISUAL_HORIZON.xMin + (VISUAL_HORIZON.xMax - VISUAL_HORIZON.xMin) * t;
      const innerX = ACCESSIBLE.xMin + (ACCESSIBLE.xMax - ACCESSIBLE.xMin) * t;
      const sample = sampleHEarthTerrainField(innerX, ACCESSIBLE.zMin);
      return {
        x,
        y: horizonElevation(sample.elevation, 1, 0.8 + t * 2.1),
        z: VISUAL_HORIZON.zMin
      };
    }
  });

  // Lateral continuation terminates at the continental coast. No terrain is
  // generated on the waterward side, so open ocean cannot acquire an opposing
  // landmass merely to hide the render boundary.
  for (const side of ['WEST', 'EAST']) {
    const innerX = side === 'WEST' ? ACCESSIBLE.xMin : ACCESSIBLE.xMax;
    const outerX = side === 'WEST' ? VISUAL_HORIZON.xMin : VISUAL_HORIZON.xMax;
    const coastlineZ = getHEarthCanonicalShorelineZ(innerX);
    const landwardEndZ = Math.min(-96, coastlineZ - 18);
    appendStrip({
      vertices,
      indices,
      sampleCount: 49,
      innerAt: (t) => {
        const z = ACCESSIBLE.zMin + (landwardEndZ - ACCESSIBLE.zMin) * t;
        const sample = sampleHEarthTerrainField(innerX, z);
        return { x: innerX, y: sample.elevation, z };
      },
      outerAt: (t) => {
        const z = VISUAL_HORIZON.zMin + (landwardEndZ - VISUAL_HORIZON.zMin) * t;
        const innerZ = ACCESSIBLE.zMin + (landwardEndZ - ACCESSIBLE.zMin) * t;
        const sample = sampleHEarthTerrainField(innerX, innerZ);
        return {
          x: outerX,
          y: horizonElevation(sample.elevation, 1, side === 'WEST' ? 1.7 : 3.1),
          z
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
      materialIntent: 'ATMOSPHERIC_DISTANT_TERRAIN_VISUAL_WORLD_CONTINUATION'
    }),
    source: freeze({
      sourceType: 'H_EARTH_TERRAIN_FORMATION_PROXY_WITH_VISUAL_CONTINUATION',
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
      crestEndpointPolicy: 'NONZERO_MINIMUM_ENVELOPE',
      minimumEnvelope,
      lodClass: 'DISTANT_COMPOSITE_PROXY',
      proxySourceIdentities: [formation.formationId],
      visualContinuationLayer: true,
      accessibleRegionBounds: ACCESSIBLE,
      visualHorizonBounds: VISUAL_HORIZON,
      oceanFacingTerrainContinuation: false,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      continuationLaw: 'VISIBLE_SURROUNDING_WORLD_IS_PRESENTATION_ONLY_AND_MUST_NOT_EXPAND_THE_AUTHORED_ACCESSIBLE_REGION',
      visibleRectangularTerminationProhibited: true,
      admitted: false,
      aggregateFrameAuthority: false
    })
  });

  return freeze({
    ok: construction?.valid === true &&
      isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord),
    primitive: construction?.primitiveRecord ?? null,
    issues: construction?.issues ?? []
  });
}

export function constructHEarthDistantContextGeometry() {
  const formation = H_EARTH_TERRAIN_FORMATIONS.DISTANT_HIGHLAND_001;
  const result = constructVisualWorldContinuation(formation);
  return freeze({
    ok: result.ok,
    status: result.ok
      ? 'DISTANT_CONTEXT_GEOMETRY_COMPLETE'
      : 'DISTANT_CONTEXT_GEOMETRY_FAILED',
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
