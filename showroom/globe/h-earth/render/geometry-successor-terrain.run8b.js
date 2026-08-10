/**
 * /showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js
 *
 * H_EARTH_SUCCESSOR_TERRAIN_AND_MOUNTAIN_NEUTRAL_GEOMETRY_RUN_8B_v2
 * HC05 presentation-resolution renewal. The accepted map-wide Gratitude
 * presentation elevation remains the only height source; this file increases
 * sampling density so that the same lawful surface is no longer presented as
 * large planar facets on ground-view/mobile inspection.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';
import { H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID } from './geometry-distant-context.js';
import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION,
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT,
  H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT,
  H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT,
  H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION
} from '../../../../h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  evaluateHEarthRun8BFormerBoundaryContinuity
} from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);

export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID =
  'H_EARTH_SUCCESSOR_TERRAIN_AND_MOUNTAIN_NEUTRAL_GEOMETRY_RUN_8B_v2';
export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';
export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID =
  'H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_MOUNTAIN_NEUTRAL_PRIMITIVE_001';

const RUN8A_FULL_DETAIL = H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.profiles.FULL_DETAIL;
const DOMAIN = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
const TRANSITION = H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.transitionBounds;

// Run8A explicitly permits Run8B to choose higher resolution, but prohibits a
// lower-resolution realization. 2/1 world-unit sampling is intentionally
// bounded: materially denser than the 4/2 minimum without becoming an
// unbounded mobile tessellation experiment.
const PRESENTATION_BASE_SPACING = Math.max(2, RUN8A_FULL_DETAIL.baseSpacingWorldUnits / 2);
const PRESENTATION_REFINEMENT_SPACING = Math.max(1, RUN8A_FULL_DETAIL.refinementSpacingWorldUnits / 2);

export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE = freeze({
  contractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  successorFormationId: H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.successorFormationId,
  predecessorFormationId: H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.predecessorFormationId,
  southKernelContractId: H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  topology: 'ONE_CONNECTED_INDEXED_XZ_HEIGHT_FIELD_TRIANGLE_MESH',
  projectionLaw: 'UNCHANGED_ACCEPTED_WORLD_HEIGHT_SOURCE_WITH_HIGHER_DENSITY_RUN8B_XZ_PRESENTATION_SAMPLING',
  baseSpacingWorldUnits: PRESENTATION_BASE_SPACING,
  refinementSpacingWorldUnits: PRESENTATION_REFINEMENT_SPACING,
  run8AMinimumBaseSpacingWorldUnits: RUN8A_FULL_DETAIL.baseSpacingWorldUnits,
  run8AMinimumRefinementSpacingWorldUnits: RUN8A_FULL_DETAIL.refinementSpacingWorldUnits,
  run8AHigherResolutionAllowed: H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.run8BMayChooseHigherResolution === true,
  refinementRegion: {
    xMinimum: TRANSITION.xMinimum,
    xMaximum: TRANSITION.xMaximum,
    zMinimum: TRANSITION.zMinimum,
    zMaximum: TRANSITION.zMaximum
  },
  worldDomain: { ...DOMAIN },
  expectedClosure: 'OPEN_ALLOWED',
  normalMode: 'FACE_AND_VERTEX',
  legacyProxyContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
  legacyProxyDisposition: 'PRESERVED_UNCHANGED_NOT_YET_SUCCESSOR_LOD',
  owns: {
    successorNeutralGeometryConstruction: true,
    successorTerrainField: false,
    acceptedWorldSource: false,
    Run8ADimensionalLaw: false,
    Run6TerrainMutation: false,
    legacyProxyMutation: false,
    WestAdmission: false,
    Packet002Transfer: false,
    renderer: false,
    materialPresentation: false,
    lightingPresentation: false,
    vegetationConstruction: false,
    publicRoute: false,
    deployment: false
  }
});

export const H_EARTH_RUN_8B_Z_BANDS = freeze([
  { bandId: 'REAR_WORLD_BUFFER', zMinimum: -320, zMaximum: -292 },
  { bandId: 'REAR_FALLOFF_AND_MOUNTAIN_BACK', zMinimum: -292, zMaximum: -276 },
  { bandId: 'PRIMARY_RIDGE_AND_SUMMIT', zMinimum: -276, zMaximum: -260 },
  { bandId: 'VALLEY_CUT_AND_SECONDARY_RIDGE', zMinimum: -260, zMaximum: -244 },
  { bandId: 'FOOTHILL_AND_FORMER_BOUNDARY_CONNECTION', zMinimum: -244, zMaximum: -220 },
  { bandId: 'LEGACY_DOMAIN_SUCCESSOR_SURFACE', zMinimum: -220, zMaximum: 64 }
]);

function buildRefinedAxis({ minimum, maximum, refinementMinimum, refinementMaximum }) {
  const values = [];
  for (let value = minimum; value <= maximum + 1e-9; value += PRESENTATION_BASE_SPACING) {
    values.push(Math.min(maximum, value));
  }
  for (let value = minimum; value < maximum - 1e-9; value += PRESENTATION_BASE_SPACING) {
    const midpoint = value + PRESENTATION_REFINEMENT_SPACING;
    if (midpoint >= refinementMinimum && midpoint <= refinementMaximum && midpoint < maximum) values.push(midpoint);
  }
  if (!values.includes(maximum)) values.push(maximum);
  return freeze([...new Set(values.map((value) => Number(value.toFixed(8))))].sort((left, right) => left - right));
}

export function getHEarthRun8BSuccessorSamplingAxes() {
  return freeze({
    xValues: buildRefinedAxis({
      minimum: DOMAIN.xMinimum,
      maximum: DOMAIN.xMaximum,
      refinementMinimum: TRANSITION.xMinimum,
      refinementMaximum: TRANSITION.xMaximum
    }),
    zValues: buildRefinedAxis({
      minimum: DOMAIN.zMinimum,
      maximum: DOMAIN.zMaximum,
      refinementMinimum: TRANSITION.zMinimum,
      refinementMaximum: TRANSITION.zMaximum
    })
  });
}

function classifyZBand(z) {
  return H_EARTH_RUN_8B_Z_BANDS.find((band, index) =>
    z >= band.zMinimum &&
    (index === H_EARTH_RUN_8B_Z_BANDS.length - 1 ? z <= band.zMaximum : z < band.zMaximum)
  )?.bandId ?? null;
}

function buildSuccessorTopology() {
  const { xValues, zValues } = getHEarthRun8BSuccessorSamplingAxes();
  const vertices = [];
  const samples = [];
  const projectionOffsets = [];
  const zBandVertexCounts = Object.fromEntries(H_EARTH_RUN_8B_Z_BANDS.map((band) => [band.bandId, 0]));

  for (const z of zValues) {
    for (const x of xValues) {
      const sample = sampleHEarthMapWideEnvironmentTerrainCandidate(x, z);
      const presentationElevation = sample?.presentationElevation;
      if (sample?.valid !== true || !finite(sample.elevation) || !finite(presentationElevation)) {
        return freeze({
          ok: false,
          status: 'RUN_8B_HC05_ACCEPTED_WORLD_PROJECTION_SAMPLE_FAILED',
          xValues,
          zValues,
          vertices: [],
          indices: [],
          samples: [],
          projectionOffsets: [],
          zBandVertexCounts,
          issues: [`INVALID_ACCEPTED_WORLD_SAMPLE:${x}:${z}`]
        });
      }
      const bandId = classifyZBand(z);
      if (bandId) zBandVertexCounts[bandId] += 1;
      vertices.push(createHEarthVector3(x, presentationElevation, z));
      samples.push(sample);
      projectionOffsets.push(presentationElevation - sample.elevation);
    }
  }

  const indices = [];
  const columnCount = xValues.length;
  const rowCount = zValues.length;
  for (let row = 0; row < rowCount - 1; row += 1) {
    for (let column = 0; column < columnCount - 1; column += 1) {
      const a = row * columnCount + column;
      const b = a + 1;
      const c = (row + 1) * columnCount + column;
      const d = c + 1;
      // Alternate the diagonal deterministically to avoid a single directional
      // triangulation signature across long mountain faces.
      if ((row + column) % 2 === 0) indices.push(a, c, b, b, c, d);
      else indices.push(a, c, d, a, d, b);
    }
  }

  const nonZeroProjectionCount = projectionOffsets.filter((value) => Math.abs(value) > 1e-9).length;
  const maximumAbsoluteProjectionOffset = projectionOffsets.reduce((maximum, value) => Math.max(maximum, Math.abs(value)), 0);
  return freeze({
    ok: true,
    status: 'RUN_8B_HC05_ACCEPTED_WORLD_PROJECTION_COMPLETE',
    xValues,
    zValues,
    rowCount,
    columnCount,
    vertices: freeze(vertices),
    indices: freeze(indices),
    samples: freeze(samples),
    projectionOffsets: freeze(projectionOffsets),
    projectionSummary: freeze({
      vertexCount: vertices.length,
      nonZeroProjectionCount,
      nonZeroProjectionFraction: vertices.length > 0 ? nonZeroProjectionCount / vertices.length : 0,
      maximumAbsoluteProjectionOffset,
      presentationBaseSpacingWorldUnits: PRESENTATION_BASE_SPACING,
      presentationRefinementSpacingWorldUnits: PRESENTATION_REFINEMENT_SPACING
    }),
    zBandVertexCounts: freeze(zBandVertexCounts),
    issues: freeze([])
  });
}

export function evaluateHEarthRun8BVirtualSharedEdges({ xValues, zValues, indices }) {
  const issues = [];
  const columnCount = xValues.length;
  const rowCount = zValues.length;
  const xSeams = [-192, -128, -64, 0, 64, 128, 192].filter((value) => xValues.includes(value));
  const zSeams = [-256, -220, -192, -128, -64, 0].filter((value) => zValues.includes(value));
  let sharedEdgePairCount = 0;
  const cellTriangleVertexSet = (row, column) => {
    const cell = row * (columnCount - 1) + column;
    return new Set(indices.slice(cell * 6, cell * 6 + 6));
  };
  for (const seamX of xSeams) {
    const seamColumn = xValues.indexOf(seamX);
    if (seamColumn <= 0 || seamColumn >= columnCount - 1) continue;
    for (let row = 0; row < rowCount - 1; row += 1) {
      const left = cellTriangleVertexSet(row, seamColumn - 1);
      const right = cellTriangleVertexSet(row, seamColumn);
      const edge = [row * columnCount + seamColumn, (row + 1) * columnCount + seamColumn];
      if (!edge.every((index) => left.has(index) && right.has(index))) issues.push(`X_SHARED_EDGE_INDEX_MISMATCH:${seamX}:${row}`);
      sharedEdgePairCount += 1;
    }
  }
  for (const seamZ of zSeams) {
    const seamRow = zValues.indexOf(seamZ);
    if (seamRow <= 0 || seamRow >= rowCount - 1) continue;
    for (let column = 0; column < columnCount - 1; column += 1) {
      const north = cellTriangleVertexSet(seamRow - 1, column);
      const south = cellTriangleVertexSet(seamRow, column);
      const edge = [seamRow * columnCount + column, seamRow * columnCount + column + 1];
      if (!edge.every((index) => north.has(index) && south.has(index))) issues.push(`Z_SHARED_EDGE_INDEX_MISMATCH:${seamZ}:${column}`);
      sharedEdgePairCount += 1;
    }
  }
  return freeze({
    eligible: issues.length === 0 && sharedEdgePairCount > 0,
    status: issues.length === 0 ? 'RUN_8B_VIRTUAL_SHARED_EDGE_PASS' : 'RUN_8B_VIRTUAL_SHARED_EDGE_FAIL',
    xSeams,
    zSeams,
    sharedEdgePairCount,
    sharedVertexIdentityLaw: 'ADJACENT_PARTITIONS_REFERENCE_THE_SAME_GLOBAL_VERTEX_INDICES',
    normalContinuityLaw: 'ONE_GLOBAL_VERTEX_HAS_ONE_SOUTH_VERTEX_NORMAL',
    issues: freeze(issues)
  });
}

export function constructHEarthRun8BSuccessorTerrainAndMountain() {
  const topology = buildSuccessorTopology();
  if (!topology.ok) return freeze({
    ok: false,
    status: 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_FAILED',
    contractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
    primitive: null,
    topology,
    issues: topology.issues
  });

  const sharedEdges = evaluateHEarthRun8BVirtualSharedEdges(topology);
  const continuity = evaluateHEarthRun8BFormerBoundaryContinuity();
  const construction = constructHEarthTriangleMesh({
    primitiveId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID,
    geometryId: `${H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices: topology.vertices,
    indices: topology.indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'RUN_8B_SUCCESSOR_CONTINUOUS_TERRAIN_AND_MOUNTAIN',
    materialHint: {
      authorityClass: 'RUN_8A_INTERFACE_ONLY_PRESENTATION_WITHHELD',
      interfaceContractId: H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId,
      materialAndLightingRealization: false
    },
    source: {
      sourceType: 'HC05_ACCEPTED_MAP_WIDE_PRESENTATION_PROJECTION_OVER_RUN8B_TRUTH',
      successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
      acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
      controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
      dimensionalSurfaceContractId: H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.contractId,
      samplingAndRefinementContractId: H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.contractId
    },
    attributes: {
      rowCount: topology.rowCount,
      columnCount: topology.columnCount,
      xValues: topology.xValues,
      zValues: topology.zValues
    },
    metadata: {
      providerContractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
      acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
      hc05GroundProjection: true,
      geometricTruthMutated: false,
      successorFormationId: H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.successorFormationId,
      predecessorFormationId: H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.predecessorFormationId,
      predecessorDisposition: 'PRESERVED_LEGACY_PROXY_FORMATION',
      fullRealizationClass: 'CONTINUOUS_XZ_TERRAIN_FOOTPRINT_WITH_ACCEPTED_PRESENTATION_ELEVATION_HIGHER_DENSITY',
      zBandVertexCounts: topology.zBandVertexCounts,
      projectionSummary: topology.projectionSummary,
      baseSpacingWorldUnits: PRESENTATION_BASE_SPACING,
      refinementSpacingWorldUnits: PRESENTATION_REFINEMENT_SPACING,
      run8AHigherResolutionAllowed: true,
      formerBoundaryZ: H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.formerBoundaryZ,
      sharedEdgePairCount: sharedEdges.sharedEdgePairCount,
      formerBoundaryContinuityEligible: continuity.eligible,
      legacyProxyContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
      legacyProxyMutated: false,
      admitted: false,
      WestAdmissionExecuted: false,
      packet002TransferExecuted: false,
      rendererMaterialized: false,
      publicRouteMutated: false
    }
  });

  const primitive = construction?.primitiveRecord ?? null;
  const issues = [
    ...topology.issues,
    ...sharedEdges.issues,
    ...(continuity.issues ?? []),
    ...(Array.isArray(construction?.issues)
      ? construction.issues.filter((issue) => issue?.blocking === true).map((issue) => issue.code ?? 'SOUTH_CONSTRUCTION_BLOCKING_ISSUE')
      : [])
  ];
  if (construction?.valid !== true) issues.push('SOUTH_NEUTRAL_CONSTRUCTION_INVALID');
  if (!isHEarthNeutralPrimitiveRecord(primitive)) issues.push('SOUTH_NEUTRAL_PRIMITIVE_INVALID');
  if (sharedEdges.eligible !== true) issues.push('SHARED_EDGE_CONTINUITY_INVALID');
  if (continuity.eligible !== true) issues.push('FORMER_BOUNDARY_CONTINUITY_INVALID');
  if (!(topology.projectionSummary.nonZeroProjectionCount > 0)) issues.push('HC05_ACCEPTED_WORLD_PROJECTION_EMPTY');

  return freeze({
    ok: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_COMPLETE' : 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_FAILED',
    contractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
    successorTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    acceptedWorldProjectionContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    southKernelContractId: H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
    primitive,
    construction,
    topology: freeze({
      rowCount: topology.rowCount,
      columnCount: topology.columnCount,
      vertexCount: topology.vertices.length,
      indexCount: topology.indices.length,
      triangleCount: topology.indices.length / 3,
      xValues: topology.xValues,
      zValues: topology.zValues,
      zBandVertexCounts: topology.zBandVertexCounts,
      projectionSummary: topology.projectionSummary
    }),
    sharedEdges,
    continuity,
    legacyProxyContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
    legacyProxyMutated: false,
    acceptedWorldSourceMutated: false,
    geometricTruthMutated: false,
    WestAdmissionExecuted: false,
    packet002TransferExecuted: false,
    rendererMutation: false,
    materialAndLightingPresentation: false,
    vegetationInstanceConstruction: false,
    publicRouteMutation: false,
    deployment: false,
    visualImprovementClaim: false,
    issues: freeze(issues)
  });
}

export default H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE;
