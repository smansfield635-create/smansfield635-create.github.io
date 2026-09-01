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
  sampleHEarthRun8ASuccessorTerrainField
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep01 = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const gaussian = (value, center, sigma) =>
  Math.exp(-0.5 * Math.pow((value - center) / sigma, 2));

export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID =
  'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v1';

export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_SOURCE_FILE =
  '/h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';

export const H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID = freeze({
  contractId: 'H_EARTH_RUN_8B_CANONICAL_ELEVATION_BINARY_GRID_2_NEGATIVE_24_v1',
  denominator: 16777216,
  spacingWorldUnits: 1 / 16777216,
  selectedByCheckpoint: 'CP3D_1C_CANONICAL_TRANSCENDENTAL_NUMERIC_NORMALIZATION_DECISION',
  applicationBoundary: 'RUN_8B_SUCCESSOR_FIELD_PROJECTION_BEFORE_NEUTRAL_GEOMETRY',
  negativeZeroNormalized: true
});

export const H_EARTH_RUN_8B_C3C3R5_MACRO_COMPOSITION_PROFILE = freeze({
  contractId: 'H_EARTH_C3C3R5_MACRO_COMPOSITION_EAST_OCEAN_REVEAL_v2',
  compositionClass: 'MOUNTAIN_PASS_OCEAN_REVEAL_CORRIDOR',
  orientation: 'EAST_FACING_TOWARD_OPEN_OCEAN',
  corridorCenterZ: -248,
  corridorSigmaZ: 38,
  activationXMinimum: -224,
  fullCutX: -128,
  easternMountainExitX: 96,
  maximumCutWorldUnits: 38,
  maximumMountainContributionFractionRemoved: 0.9,
  fanCenterX: -72,
  fanSigmaX: 150,
  fanCenterZ: -232,
  fanSigmaZ: 78,
  fanMaximumCutWorldUnits: 34,
  baseTerrainCutProhibited: true,
  run8APredecessorMutation: false,
  navigationAuthorityExpansion: false,
  collisionAuthorityExpansion: false,
  purpose:
    'TURN_EXISTING_VALLEY_LANGUAGE_INTO_A_BROAD_COASTAL_AMPHITHEATER_AND_EAST_FACING_OCEAN_REVEAL_WITHOUT_CREATING_A_NEW_OCEAN_OR_CUTTING_BASE_TERRAIN'
});

export function canonicalizeHEarthRun8BElevation(value) {
  if (!finite(value)) return value;
  const canonical = Math.round(
    value * H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.denominator
  ) / H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.denominator;
  return Object.is(canonical, -0) ? 0 : canonical;
}

function resolveMacroCompositionCut(source, worldX, worldZ) {
  if (source?.valid !== true || !finite(source.mountainContribution)) return 0;
  const profile = H_EARTH_RUN_8B_C3C3R5_MACRO_COMPOSITION_PROFILE;
  const xOpening = worldX >= profile.activationXMinimum && worldX <= profile.easternMountainExitX
    ? smoothstep01(
        (worldX - profile.activationXMinimum) /
          Math.max(Number.EPSILON, profile.fullCutX - profile.activationXMinimum)
      )
    : 0;
  const zOpening = gaussian(worldZ, profile.corridorCenterZ, profile.corridorSigmaZ);
  const corridorCut = profile.maximumCutWorldUnits * xOpening * zOpening;
  const fanCut = profile.fanMaximumCutWorldUnits
    * gaussian(worldX, profile.fanCenterX, profile.fanSigmaX)
    * gaussian(worldZ, profile.fanCenterZ, profile.fanSigmaZ);
  const requestedCut = Math.max(corridorCut, fanCut);
  return Math.max(0, Math.min(
    requestedCut,
    source.mountainContribution * profile.maximumMountainContributionFractionRemoved
  ));
}

function projectedSuccessorElevation(worldX, worldZ) {
  const source = sampleHEarthRun8ASuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true || !finite(source.elevation)) return Number.NaN;
  return canonicalizeHEarthRun8BElevation(
    source.elevation - resolveMacroCompositionCut(source, worldX, worldZ)
  );
}

export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD = freeze({
  contractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  generationRevision: 4,
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
  macroCompositionProfile: H_EARTH_RUN_8B_C3C3R5_MACRO_COMPOSITION_PROFILE,
  sampling: {
    derivativeStep: 0.5,
    baseSpacingWorldUnits:
      H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT
        .profiles.FULL_DETAIL.baseSpacingWorldUnits,
    refinementSpacingWorldUnits:
      H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT
        .profiles.FULL_DETAIL.refinementSpacingWorldUnits,
    sharedEdgeRule: 'SAME_WORLD_COORDINATE_SAME_SUCCESSOR_SAMPLE_AND_NORMAL',
    normalRule: 'RUN_8B_POST_COMPOSITION_CENTRAL_DIFFERENCE',
    deterministic: true,
    canonicalElevationGridContractId:
      H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.contractId
  },
  ownership: {
    ownsSuccessorWorldSpaceElevationLaw: true,
    ownsSuccessorDerivativeAndNormalSampleLaw: true,
    ownsMacroCompositionProjection: true,
    ownsRun6PredecessorMutation: false,
    ownsRun8APredecessorMutation: false,
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
  if (!finite(worldX) || !finite(worldZ)) return Number.NaN;
  const domain = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
  if (
    worldX < domain.xMinimum || worldX > domain.xMaximum ||
    worldZ < domain.zMinimum || worldZ > domain.zMaximum
  ) return Number.NaN;
  return projectedSuccessorElevation(worldX, worldZ);
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

  const domain = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
  const step = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.sampling.derivativeStep;
  const elevation = projectedSuccessorElevation(worldX, worldZ);
  const xl = Math.max(domain.xMinimum, worldX - step);
  const xr = Math.min(domain.xMaximum, worldX + step);
  const zb = Math.max(domain.zMinimum, worldZ - step);
  const zf = Math.min(domain.zMaximum, worldZ + step);
  const left = projectedSuccessorElevation(xl, worldZ);
  const right = projectedSuccessorElevation(xr, worldZ);
  const back = projectedSuccessorElevation(worldX, zb);
  const front = projectedSuccessorElevation(worldX, zf);
  const dx = (right - left) / Math.max(Number.EPSILON, xr - xl);
  const dz = (front - back) / Math.max(Number.EPSILON, zf - zb);
  const normalLength = Math.hypot(-dx, 1, -dz);
  const curvature = left - 2 * elevation + right + back - 2 * elevation + front;
  const macroCompositionCut = resolveMacroCompositionCut(source, worldX, worldZ);
  const mountainContribution = Math.max(0, source.mountainContribution - macroCompositionCut);

  return freeze({
    ...source,
    world: { ...source.world, y: elevation },
    elevation,
    gradient: { x: dx, z: dz },
    normal: { x: -dx / normalLength, y: 1 / normalLength, z: -dz / normalLength },
    slope: Math.hypot(dx, dz),
    curvature,
    mountainContribution,
    preCompositionMountainContribution: source.mountainContribution,
    macroCompositionCut,
    macroCompositionApplied: macroCompositionCut > 0,
    macroCompositionContractId: H_EARTH_RUN_8B_C3C3R5_MACRO_COMPOSITION_PROFILE.contractId,
    oceanRevealCorridor: macroCompositionCut > 0
      ? 'EAST_FACING_MOUNTAIN_PASS_TO_EXISTING_OPEN_OCEAN'
      : null,
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

export function evaluateHEarthRun8BFormerBoundaryContinuity({
  xSamples = [-224, -192, -160, -128, -96, -64, -32, 0, 32],
  epsilon = 0.01
} = {}) {
  const boundaryZ = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.formerBoundaryZ;
  const samples = xSamples.map((x) => {
    const center = projectedSuccessorElevation(x, boundaryZ);
    const north = projectedSuccessorElevation(x, boundaryZ + epsilon);
    const south = projectedSuccessorElevation(x, boundaryZ - epsilon);
    return freeze({
      worldX: x,
      center,
      north,
      south,
      heightDiscontinuity: Math.abs((north + south) / 2 - center),
      gradientDiscontinuity: Math.abs((north - center) / epsilon - (center - south) / epsilon)
    });
  });
  const maximumHeightDiscontinuity = Math.max(...samples.map((sample) => sample.heightDiscontinuity));
  const maximumGradientDiscontinuity = Math.max(...samples.map((sample) => sample.gradientDiscontinuity));
  return freeze({
    eligible: maximumHeightDiscontinuity <= 0.05 && maximumGradientDiscontinuity <= 0.5,
    status: maximumHeightDiscontinuity <= 0.05 && maximumGradientDiscontinuity <= 0.5
      ? 'RUN_8B_FORMER_BOUNDARY_CONTINUITY_PASS'
      : 'RUN_8B_FORMER_BOUNDARY_CONTINUITY_FAIL',
    successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    predecessorTerrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    predecessorMutated: false,
    formerBoundaryZ: boundaryZ,
    c0Tolerance: 0.05,
    c1Tolerance: 0.5,
    maximumHeightDiscontinuity,
    maximumGradientDiscontinuity,
    samples
  });
}

export function evaluateHEarthRun8BSuccessorTerrainField() {
  const issues = [];
  const domain = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
  const continuity = evaluateHEarthRun8BFormerBoundaryContinuity();
  const predecessorCore = H_EARTH_TERRAIN_FIELD.coreDomain;
  const predecessorWorld = H_EARTH_TERRAIN_FIELD.worldDomain;

  if (
    H_EARTH_TERRAIN_FIELD.contractId !== H_EARTH_TERRAIN_FIELD_CONTRACT_ID ||
    predecessorCore?.xMinimum !== -256 || predecessorCore?.xMaximum !== 256 ||
    predecessorCore?.zMinimum !== -256 || predecessorCore?.zMaximum !== 64 ||
    predecessorWorld?.xMinimum !== -1024 || predecessorWorld?.xMaximum !== 1024 ||
    predecessorWorld?.zMinimum !== -1024 || predecessorWorld?.zMaximum !== 768
  ) {
    issues.push('RUN_6_PREDECESSOR_IDENTITY_OR_DOMAIN_BASELINE_MISMATCH');
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
    [-48, -254],
    [24, -254],
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
  const revealWitnesses = witnesses.filter((sample) => sample.macroCompositionApplied === true);
  if (revealWitnesses.length < 1) {
    issues.push('C3C3R5_OCEAN_REVEAL_CORRIDOR_NOT_MATERIALIZED');
  }
  if (revealWitnesses.some((sample) => sample.macroCompositionCut > sample.preCompositionMountainContribution)) {
    issues.push('C3C3R5_OCEAN_REVEAL_CUT_EXCEEDED_MOUNTAIN_CONTRIBUTION');
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
    predecessorCoreDomain: freeze({ ...predecessorCore }),
    predecessorWorldDomain: freeze({ ...predecessorWorld }),
    canonicalElevationGrid: H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID,
    macroCompositionProfile: H_EARTH_RUN_8B_C3C3R5_MACRO_COMPOSITION_PROFILE,
    continuity,
    witnesses,
    revealWitnesses,
    geometryConstructed: false,
    issues: freeze(issues)
  });
}

export default H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD;