/**
 * /showroom/globe/h-earth/render/geometry-distant-context.js
 *
 * H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_RUN_6C_v2
 *
 * Constructs coarse, non-navigable highland/mountain proxy geometry from the
 * durable Run 6B formation authority. The crest envelope preserves nonzero
 * endpoint clearance so every strip triangle remains nondegenerate.
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

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID =
  'H_EARTH_DISTANT_CONTEXT_GEOMETRY_PROVIDER_RUN_6C_v2_NONDEGENERATE_ENDPOINT_ENVELOPE';

function constructHighlandProxy(formation) {
  const sampleCount = 17;
  const vertices = [];
  const indices = [];
  const { worldBounds, elevationEnvelope } = formation;
  const baseY = elevationEnvelope.minimum;
  const amplitude = elevationEnvelope.maximum - elevationEnvelope.minimum;
  const minimumEnvelope = 0.08;

  for (let index = 0; index < sampleCount; index += 1) {
    const progress = index / (sampleCount - 1);
    const x = worldBounds.xMin +
      (worldBounds.xMax - worldBounds.xMin) * progress;
    const z = worldBounds.zMin +
      7 * Math.sin(progress * Math.PI * 2);
    const envelope = minimumEnvelope +
      (1 - minimumEnvelope) * Math.sin(progress * Math.PI);
    const crest = baseY + amplitude * envelope *
      (0.72 + 0.18 * Math.sin(progress * Math.PI * 5));
    vertices.push(
      createHEarthVector3(x, baseY, z),
      createHEarthVector3(x, crest, z)
    );
  }

  for (let index = 0; index < sampleCount - 1; index += 1) {
    const a = index * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
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
      materialIntent: 'ATMOSPHERIC_DISTANT_TERRAIN'
    }),
    source: freeze({
      sourceType: 'H_EARTH_TERRAIN_FORMATION_PROXY',
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
      navigable: false,
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
  const result = constructHighlandProxy(formation);
  return freeze({
    ok: result.ok,
    status: result.ok
      ? 'DISTANT_CONTEXT_GEOMETRY_COMPLETE'
      : 'DISTANT_CONTEXT_GEOMETRY_FAILED',
    contractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
    formationId: formation.formationId,
    primitives: result.ok ? [result.primitive] : [],
    bounds: result.primitive?.geometry?.bounds ?? null,
    admitted: false,
    issues: result.issues
  });
}
