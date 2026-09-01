/**
 * /h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js
 *
 * H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v1
 *
 * New identified successor field revision consuming the frozen Run 8A laws.
 * The Run 6 field remains an unchanged predecessor occurrence. This file owns
 * successor world-space sampling only; it constructs no geometry, performs no
 * admission, and creates no renderer, route, material, lighting or deployment
 * authority.
 */

import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID
} from './h-earth.terrain-field.js';

import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION,
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT,
  H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT,
  sampleHEarthRun8ASuccessorTerrainElevation,
  sampleHEarthRun8ASuccessorTerrainField,
  evaluateHEarthRun8AFormerBoundaryContinuity
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);

export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID =
  'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v1';

export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_SOURCE_FILE =
  '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';

export const H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID = freeze({
  contractId: 'H_EARTH_RUN_8B_CANONICAL_ELEVATION_BINARY_GRID_2_NEGATIVE_24_v1',
  denominator: 16777216,
  spacingWorldUnits: 1 / 16777216,
  selectedByCheckpoint: 'CP3D_1C_CANONICAL_TRANSCENDENTAL_NUMERIC_NORMALIZATION_DECISION',
  applicationBoundary: 'RUN_8B_SUCCESSOR_FIELD_PROJECTION_BEFORE_NEUTRAL_GEOMETRY',
  negativeZeroNormalized: true
});

export function canonicalizeHEarthRun8BElevation(value) {
  if (!finite(value)) return value;
  const canonical = Math.round(
    value * H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.denominator
  ) / H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.denominator;
  return Object.is(canonical, -0) ? 0 : canonical;
}

export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD = freeze({
  contractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  generationRevision: 2,
  predecessorContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  predecessorGenerationRevision: H_EARTH_TERRAIN_FIELD.generationRevision,
  predecessorOccurrenceDisposition: 'PRESERVED_UNCHANGED',
  controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  dimensionalSurfaceContractId:
    H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.contractId,
  samplingAndRefinementContractId:
    H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.contractId,
  coordinateFrame: 'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',
  worldDomain: {
    ...H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain
  },
  newlyRealizedRegion: {
    ...H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.newlyAuthorizedFieldRegion
  },
  formerBoundaryZ:
    H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.formerBoundaryZ,
  successorFormationId:
    H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.formationId,
  predecessorFormationId: 'H_EARTH_DISTANT_HIGHLAND_001',
  sampling: {
    derivativeStep: 0.5,
    baseSpacingWorldUnits:
      H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT
        .profiles.FULL_DETAIL.baseSpacingWorldUnits,
    refinementSpacingWorldUnits:
      H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT
        .profiles.FULL_DETAIL.refinementSpacingWorldUnits,
    sharedEdgeRule: 'SAME_WORLD_COORDINATE_SAME_SUCCESSOR_SAMPLE_AND_NORMAL',
    normalRule: 'RUN_8A_SUCCESSOR_FIELD_CENTRAL_DIFFERENCE',
    deterministic: true,
    canonicalElevationGridContractId:
      H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.contractId
  },
  ownership: {
    ownsSuccessorWorldSpaceElevationLaw: true,
    ownsSuccessorDerivativeAndNormalSampleLaw: true,
    ownsRun6PredecessorMutation: false,
    ownsGeometry: false,
    ownsAdmission: false,
    ownsPacket002Transfer: false,
    ownsRenderer: false,
    ownsMaterialPresentation: false,
    ownsLightingPresentation: false,
    ownsRoute: false
  },
  identityLaw: {
    predecessorAndSuccessorIdentityCollapse: 'PROHIBITED',
    legacyProxyAndSuccessorMountainIdentityCollapse: 'PROHIBITED',
    legacyProxyLodCorrespondenceClaim: 'WITHHELD_PENDING_EXECUTED_CORRESPONDENCE'
  }
});

export function sampleHEarthRun8BSuccessorTerrainElevation(worldX, worldZ) {
  return canonicalizeHEarthRun8BElevation(
    sampleHEarthRun8ASuccessorTerrainElevation(worldX, worldZ)
  );
}

export function sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ) {
  const source = sampleHEarthRun8ASuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true) {
    return freeze({
      valid: false,
      status: 'RUN_8B_SUCCESSOR_TERRAIN_SAMPLE_REJECTED',
      contractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
      worldX,
      worldZ
    });
  }

  const elevation = canonicalizeHEarthRun8BElevation(source.elevation);

  return freeze({
    ...source,
    world: { ...source.world, y: elevation },
    elevation,
    status: 'RUN_8B_SUCCESSOR_TERRAIN_SAMPLE_COMPLETE',
    contractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    generationRevision:
      H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
    controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
    dimensionalSurfaceContractId:
      H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.contractId,
    canonicalElevationGridContractId:
      H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.contractId,
    predecessorContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    predecessorMutated: false
  });
}

export function evaluateHEarthRun8BFormerBoundaryContinuity(options = {}) {
  const result = evaluateHEarthRun8AFormerBoundaryContinuity(options);
  return freeze({
    ...result,
    status: result.eligible
      ? 'RUN_8B_FORMER_BOUNDARY_CONTINUITY_PASS'
      : 'RUN_8B_FORMER_BOUNDARY_CONTINUITY_FAIL',
    successorTerrainFieldContractId:
      H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    predecessorTerrainFieldContractId:
      H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    predecessorMutated: false
  });
}

export function evaluateHEarthRun8BSuccessorTerrainField() {
  const issues = [];
  const domain = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
  const continuity = evaluateHEarthRun8BFormerBoundaryContinuity();

  if (H_EARTH_TERRAIN_FIELD.worldDomain.zMinimum !== -256) {
    issues.push('RUN_6_PREDECESSOR_DOMAIN_MUTATED');
  }
  if (domain.zMinimum !== -320 || domain.zMaximum !== 64) {
    issues.push('RUN_8_SUCCESSOR_DOMAIN_INVALID');
  }
  if (
    H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID ===
    H_EARTH_TERRAIN_FIELD_CONTRACT_ID
  ) {
    issues.push('PREDECESSOR_SUCCESSOR_IDENTITY_COLLAPSED');
  }
  if (!continuity.eligible) {
    issues.push('FORMER_BOUNDARY_CONTINUITY_FAILED');
  }

  const witnessCoordinates = [
    [domain.xMinimum, domain.zMinimum],
    [-224, -292],
    [-96, -271],
    [32, -236],
    [0, -256],
    [domain.xMaximum, domain.zMaximum]
  ];
  const witnesses = witnessCoordinates.map(([x, z]) =>
    sampleHEarthRun8BSuccessorTerrainField(x, z)
  );

  if (witnesses.some((sample) => sample.valid !== true)) {
    issues.push('SUCCESSOR_FIELD_WITNESS_SAMPLE_INVALID');
  }
  if (witnesses.some((sample) => !finite(sample.elevation))) {
    issues.push('SUCCESSOR_FIELD_WITNESS_ELEVATION_NONFINITE');
  }
  if (witnesses.some((sample) =>
    sample.elevation !== canonicalizeHEarthRun8BElevation(sample.elevation))) {
    issues.push('SUCCESSOR_FIELD_WITNESS_NOT_CANONICAL');
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8B_SUCCESSOR_TERRAIN_FIELD_PASS'
      : 'RUN_8B_SUCCESSOR_TERRAIN_FIELD_FAIL',
    contractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    generationRevision:
      H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
    predecessorContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    predecessorMutated: false,
    canonicalElevationGrid: H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID,
    continuity,
    witnesses,
    geometryConstructed: false,
    issues: freeze(issues)
  });
}

export default H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD;
