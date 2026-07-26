/**
 * /showroom/globe/h-earth/render/landscape-preview.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_RUN_6C_v2
 *
 * Neutral, pre-admission aggregate for connected terrain, complete shoreline
 * bands, water progression, and distant highland context. The aggregate also
 * preserves all 256 semantic address identities independently of whether each
 * address is represented by active terrain geometry or a distant proxy.
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

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN
} from '../../../../h-earth-3d/integration/h-earth.landscape-realization-planner.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const canonical = (values) => Object.freeze(
  [...new Set(values.filter((value) =>
    typeof value === 'string' && value.length > 0))].sort()
);

export const H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_RUN_6C_v2_FULL_SEMANTIC_MEMBERSHIP';

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

  const semanticAddressIds = canonical(
    H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks
      .flatMap((chunk) => chunk.memberAddressIds)
  );
  const formationIds = canonical(
    H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks
      .flatMap((chunk) => chunk.formationIds)
  );
  const proxySummarizedAddressIds = canonical(
    H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks
      .filter((chunk) => chunk.realizationState === 'ATMOSPHERIC_OR_PROXY' ||
        chunk.rowGroup === 3)
      .flatMap((chunk) => chunk.memberAddressIds)
  );

  if (semanticAddressIds.length !== 256) {
    issues.push(`SEMANTIC_ADDRESS_COUNT_EXPECTED_256_ACTUAL_${semanticAddressIds.length}`);
  }
  if (proxySummarizedAddressIds.length !== 64) {
    issues.push(`PROXY_SUMMARIZED_ADDRESS_COUNT_EXPECTED_64_ACTUAL_${proxySummarizedAddressIds.length}`);
  }

  return freeze({
    ok: issues.length === 0,
    status: issues.length === 0
      ? 'FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW_COMPLETE'
      : 'FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW_FAILED',
    contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID,
    realizationPlanContractId:
      H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.contractId,
    componentResults: components,
    primitiveCount: primitives.length,
    primitiveIds,
    primitives,
    bounds,
    semanticAddressCount: semanticAddressIds.length,
    semanticAddressIds,
    formationIds,
    proxySummarizedAddressIds,
    semanticIdentityIndependentOfPhysicalGranularity: true,
    admitted: false,
    WestAdmissionPerformed: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    issues
  });
}

export const H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW =
  previewHEarthFunctionalLandscape();
