/**
 * /showroom/globe/h-earth/render/landscape-preview.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_RUN_6C_v1
 *
 * Neutral, pre-admission aggregate for connected terrain, complete shoreline
 * bands, water progression, and distant highland context.
 */

import {
  isHEarthNeutralPrimitiveRecord,
  isHEarthAABB3D,
  mergeHEarthGeometryBounds
} from './geometry-kernel.js';

import {
  constructHEarthFunctionalLandscapeTerrain
} from './geometry-landscape.js';

import {
  constructHEarthFunctionalShorelineGeometry
} from './geometry-shoreline.js';

import {
  constructHEarthDistantContextGeometry
} from './geometry-distant-context.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_RUN_6C_v1';

export function previewHEarthFunctionalLandscape() {
  const terrain = constructHEarthFunctionalLandscapeTerrain();
  const shoreline = constructHEarthFunctionalShorelineGeometry();
  const distantContext = constructHEarthDistantContextGeometry();
  const components = { terrain, shoreline, distantContext };
  const issues = [];

  for (const [name, result] of Object.entries(components)) {
    if (result?.ok !== true) issues.push(`COMPONENT_INVALID:${name}`);
    if (!Array.isArray(result?.primitives) ||
      !result.primitives.every(isHEarthNeutralPrimitiveRecord)) {
      issues.push(`COMPONENT_PRIMITIVES_INVALID:${name}`);
    }
  }

  const primitives = [
    ...terrain.primitives,
    ...shoreline.primitives,
    ...distantContext.primitives
  ];
  const bounds = primitives.length > 0
    ? mergeHEarthGeometryBounds(primitives.map((primitive) => primitive.geometry.bounds))
    : null;
  if (!isHEarthAABB3D(bounds)) issues.push('AGGREGATE_BOUNDS_INVALID');

  const primitiveIds = primitives.map((primitive) => primitive.primitiveId);
  if (new Set(primitiveIds).size !== primitiveIds.length) {
    issues.push('DUPLICATE_PRIMITIVE_ID');
  }

  return freeze({
    ok: issues.length === 0,
    status: issues.length === 0
      ? 'FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW_COMPLETE'
      : 'FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW_FAILED',
    contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID,
    componentResults: components,
    primitiveCount: primitives.length,
    primitiveIds,
    primitives,
    bounds,
    admitted: false,
    WestAdmissionPerformed: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    issues
  });
}

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW =
  previewHEarthFunctionalLandscape();
