/**
 * /showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js
 *
 * H_EARTH_SUCCESSOR_TERRAIN_AND_MOUNTAIN_NEUTRAL_GEOMETRY_RUN_8B_C3C3R5_GRID_DEPTH_v3
 *
 * Materializes the Run 8A successor terrain and continuous mountain laws as one
 * connected indexed XZ height-field triangle mesh through the existing South
 * neutral-construction kernel. C3C3R5 additionally restores the established
 * 16x16 perceptual cell relief in the actual live successor terrain path rather
 * than only in the legacy functional-landscape provider. Grid-aware support
 * samples ensure the canonical seam and shoulder transitions are represented
 * by geometry rather than approximated across the wider base sampling cadence.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

import {
  H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID
} from './geometry-distant-context.js';

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
  sampleHEarthRun8BSuccessorTerrainField,
  evaluateHEarthRun8BFormerBoundaryContinuity
} from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';

const freeze = (value, seen = new WeakSet()) => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value) ||
    seen.has(value)
  ) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smooth = (t) => t * t * (3 - 2 * t);
const canonicalCoordinate = (value) => Math.round(value * 1e9) / 1e9;

export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID =
  'H_EARTH_SUCCESSOR_TERRAIN_AND_MOUNTAIN_NEUTRAL_GEOMETRY_RUN_8B_C3C3R5_GRID_DEPTH_v3';

export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';

export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID =
  'H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_MOUNTAIN_NEUTRAL_PRIMITIVE_001';

const FULL_DETAIL =
  H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.profiles.FULL_DETAIL;
const DOMAIN = H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
const TRANSITION =
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.transitionBounds;
const PLAYABLE_GRID_Z_MINIMUM =
  H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.formerBoundaryZ;
const PLAYABLE_GRID_Z_MAXIMUM = DOMAIN.zMaximum;

export const H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE = freeze({
  cellCountPerAxis: 16,
  xMinimum: DOMAIN.xMinimum,
  xMaximum: DOMAIN.xMaximum,
  zMinimum: PLAYABLE_GRID_Z_MINIMUM,
  zMaximum: PLAYABLE_GRID_Z_MAXIMUM,
  seamWidthWorldUnits: 2.35,
  seamDepthWorldUnits: 0.72,
  shoulderWidthWorldUnits: 6.65,
  shoulderLiftWorldUnits: 0.14,
  supportVertexSamplingRequired: true,
  supportVertexOffsetsWorldUnits: [0, 2.35, 6.65],
  supportVertexSamplingClass:
    'CANONICAL_CELL_BOUNDARY_SEAM_AND_SHOULDER_TRANSITION_SUPPORT',
  appliesToPlayableSuccessorSurfaceOnly: true,
  mountainContinuationWarpProhibited: true,
  literalGridOverlayProhibited: true,
  colorTopologyLaw:
    'GRID_OWNS_DEPTH_COLOR_OWNS_CHROMATIC_EXPRESSION_NEITHER_MAY_ERASE_THE_OTHER'
});

export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE = freeze({
  contractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
  successorTerrainFieldContractId:
    H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  successorFormationId:
    H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.successorFormationId,
  predecessorFormationId:
    H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.predecessorFormationId,
  southKernelContractId: H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  topology: 'ONE_CONNECTED_INDEXED_XZ_HEIGHT_FIELD_TRIANGLE_MESH',
  baseSpacingWorldUnits: FULL_DETAIL.baseSpacingWorldUnits,
  refinementSpacingWorldUnits: FULL_DETAIL.refinementSpacingWorldUnits,
  refinementRegion: {
    xMinimum: TRANSITION.xMinimum,
    xMaximum: TRANSITION.xMaximum,
    zMinimum: TRANSITION.zMinimum,
    zMaximum: TRANSITION.zMaximum
  },
  worldDomain: { ...DOMAIN },
  perceptualGridProfile: H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE,
  expectedClosure: 'OPEN_ALLOWED',
  normalMode: 'FACE_AND_VERTEX',
  legacyProxyContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
  legacyProxyDisposition: 'PRESERVED_UNCHANGED_NOT_YET_SUCCESSOR_LOD',
  owns: {
    successorNeutralGeometryConstruction: true,
    successorTerrainField: false,
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

function addPerceptualGridSupportValues(values, {
  axisMinimum,
  axisMaximum,
  gridMinimum,
  gridMaximum,
  count
}) {
  const profile = H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE;
  const cellSize = (gridMaximum - gridMinimum) / count;
  const offsets = [0, profile.seamWidthWorldUnits, profile.shoulderWidthWorldUnits];
  const before = new Set(values.map(canonicalCoordinate));

  for (let index = 0; index <= count; index += 1) {
    const boundary = canonicalCoordinate(gridMinimum + index * cellSize);
    for (const offset of offsets) {
      const signedOffsets = offset === 0 ? [0] : [-offset, offset];
      for (const signedOffset of signedOffsets) {
        const candidate = canonicalCoordinate(boundary + signedOffset);
        if (
          candidate >= gridMinimum && candidate <= gridMaximum &&
          candidate >= axisMinimum && candidate <= axisMaximum
        ) values.push(candidate);
      }
    }
  }

  const unique = [...new Set(values.map(canonicalCoordinate))]
    .sort((left, right) => left - right);
  const supportValueCount = unique.filter((value) => !before.has(value)).length;
  return { values: unique, supportValueCount, cellSize };
}

function buildRefinedAxis({
  minimum,
  maximum,
  refinementMinimum,
  refinementMaximum,
  gridMinimum,
  gridMaximum
}) {
  const baseSpacing = FULL_DETAIL.baseSpacingWorldUnits;
  const refinementSpacing = FULL_DETAIL.refinementSpacingWorldUnits;
  const values = [];

  for (let value = minimum; value <= maximum; value += baseSpacing) {
    values.push(canonicalCoordinate(value));
  }

  for (let value = minimum; value < maximum; value += baseSpacing) {
    const midpoint = value + refinementSpacing;
    if (
      midpoint >= refinementMinimum &&
      midpoint <= refinementMaximum &&
      midpoint < maximum
    ) values.push(canonicalCoordinate(midpoint));
  }

  const supported = addPerceptualGridSupportValues(values, {
    axisMinimum: minimum,
    axisMaximum: maximum,
    gridMinimum,
    gridMaximum,
    count: H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.cellCountPerAxis
  });

  return freeze({
    values: supported.values,
    supportValueCount: supported.supportValueCount,
    cellSizeWorldUnits: supported.cellSize
  });
}

export function getHEarthRun8BSuccessorSamplingAxes() {
  const xAxis = buildRefinedAxis({
    minimum: DOMAIN.xMinimum,
    maximum: DOMAIN.xMaximum,
    refinementMinimum: TRANSITION.xMinimum,
    refinementMaximum: TRANSITION.xMaximum,
    gridMinimum: H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.xMinimum,
    gridMaximum: H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.xMaximum
  });
  const zAxis = buildRefinedAxis({
    minimum: DOMAIN.zMinimum,
    maximum: DOMAIN.zMaximum,
    refinementMinimum: TRANSITION.zMinimum,
    refinementMaximum: TRANSITION.zMaximum,
    gridMinimum: H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.zMinimum,
    gridMaximum: H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.zMaximum
  });

  return freeze({
    xValues: xAxis.values,
    zValues: zAxis.values,
    gridSupportSampling: {
      installed: true,
      xSupportValueCount: xAxis.supportValueCount,
      zSupportValueCount: zAxis.supportValueCount,
      xCellSizeWorldUnits: xAxis.cellSizeWorldUnits,
      zCellSizeWorldUnits: zAxis.cellSizeWorldUnits,
      transitionOffsetsWorldUnits:
        H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.supportVertexOffsetsWorldUnits
    }
  });
}

function classifyZBand(z) {
  return H_EARTH_RUN_8B_Z_BANDS.find(
    (band, index) =>
      z >= band.zMinimum &&
      (index === H_EARTH_RUN_8B_Z_BANDS.length - 1
        ? z <= band.zMaximum
        : z < band.zMaximum)
  )?.bandId ?? null;
}

function distanceToPeriodicBoundary(value, minimum, maximum, count) {
  const size = (maximum - minimum) / count;
  if (!(size > 0)) return Number.POSITIVE_INFINITY;
  const local = ((value - minimum) % size + size) % size;
  return Math.min(local, size - local);
}

function perceptualGridRelief(x, z) {
  const profile = H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE;
  if (
    x < profile.xMinimum || x > profile.xMaximum ||
    z < profile.zMinimum || z > profile.zMaximum
  ) return 0;

  const xDistance = distanceToPeriodicBoundary(
    x,
    profile.xMinimum,
    profile.xMaximum,
    profile.cellCountPerAxis
  );
  const zDistance = distanceToPeriodicBoundary(
    z,
    profile.zMinimum,
    profile.zMaximum,
    profile.cellCountPerAxis
  );
  const distance = Math.min(xDistance, zDistance);
  const seamT = smooth(clamp01(distance / profile.seamWidthWorldUnits));
  const shoulderT = smooth(clamp01(
    (distance - profile.seamWidthWorldUnits) /
    Math.max(1, profile.shoulderWidthWorldUnits - profile.seamWidthWorldUnits)
  ));
  const seam = -profile.seamDepthWorldUnits * (1 - seamT);
  const shoulder = profile.shoulderLiftWorldUnits * seamT * (1 - shoulderT);
  return seam + shoulder;
}

function buildSuccessorTopology() {
  const { xValues, zValues, gridSupportSampling } = getHEarthRun8BSuccessorSamplingAxes();
  const vertices = [];
  const samples = [];
  const zBandVertexCounts = Object.fromEntries(
    H_EARTH_RUN_8B_Z_BANDS.map((band) => [band.bandId, 0])
  );
  let maximumAppliedGridDepth = 0;
  let gridReliefVertexCount = 0;

  for (const z of zValues) {
    for (const x of xValues) {
      const sample = sampleHEarthRun8BSuccessorTerrainField(x, z);
      if (sample.valid !== true || !finite(sample.elevation)) {
        return freeze({
          ok: false,
          status: 'RUN_8B_SUCCESSOR_TOPOLOGY_SAMPLE_FAILED',
          xValues,
          zValues,
          vertices: [],
          indices: [],
          samples: [],
          zBandVertexCounts,
          maximumAppliedGridDepth,
          gridReliefVertexCount,
          gridSupportSampling,
          issues: [`INVALID_SUCCESSOR_SAMPLE:${x}:${z}`]
        });
      }
      const bandId = classifyZBand(z);
      if (bandId) zBandVertexCounts[bandId] += 1;
      const gridRelief = perceptualGridRelief(x, z);
      if (gridRelief !== 0) gridReliefVertexCount += 1;
      maximumAppliedGridDepth = Math.max(
        maximumAppliedGridDepth,
        Math.max(0, -gridRelief)
      );
      vertices.push(createHEarthVector3(x, sample.elevation + gridRelief, z));
      samples.push(freeze({ ...sample, perceptualGridRelief: gridRelief }));
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
      indices.push(a, c, b, b, c, d);
    }
  }

  return freeze({
    ok: true,
    status: 'RUN_8B_SUCCESSOR_TOPOLOGY_COMPLETE',
    xValues,
    zValues,
    rowCount,
    columnCount,
    vertices: freeze(vertices),
    indices: freeze(indices),
    samples: freeze(samples),
    zBandVertexCounts: freeze(zBandVertexCounts),
    maximumAppliedGridDepth,
    gridReliefVertexCount,
    gridSupportSampling,
    issues: freeze([])
  });
}

export function evaluateHEarthRun8BVirtualSharedEdges({
  xValues,
  zValues,
  indices
}) {
  const issues = [];
  const columnCount = xValues.length;
  const rowCount = zValues.length;
  const xSeams = [-192, -128, -64, 0, 64, 128, 192]
    .filter((value) => xValues.includes(value));
  const zSeams = [-256, -220, -192, -128, -64, 0]
    .filter((value) => zValues.includes(value));
  let sharedEdgePairCount = 0;

  const cellTriangleVertexSet = (row, column) => {
    const cell = row * (columnCount - 1) + column;
    const offset = cell * 6;
    return new Set(indices.slice(offset, offset + 6));
  };

  for (const seamX of xSeams) {
    const seamColumn = xValues.indexOf(seamX);
    if (seamColumn <= 0 || seamColumn >= columnCount - 1) continue;
    for (let row = 0; row < rowCount - 1; row += 1) {
      const left = cellTriangleVertexSet(row, seamColumn - 1);
      const right = cellTriangleVertexSet(row, seamColumn);
      const edge = [
        row * columnCount + seamColumn,
        (row + 1) * columnCount + seamColumn
      ];
      if (!edge.every((index) => left.has(index) && right.has(index))) {
        issues.push(`X_SHARED_EDGE_INDEX_MISMATCH:${seamX}:${row}`);
      }
      sharedEdgePairCount += 1;
    }
  }

  for (const seamZ of zSeams) {
    const seamRow = zValues.indexOf(seamZ);
    if (seamRow <= 0 || seamRow >= rowCount - 1) continue;
    for (let column = 0; column < columnCount - 1; column += 1) {
      const north = cellTriangleVertexSet(seamRow - 1, column);
      const south = cellTriangleVertexSet(seamRow, column);
      const edge = [
        seamRow * columnCount + column,
        seamRow * columnCount + column + 1
      ];
      if (!edge.every((index) => north.has(index) && south.has(index))) {
        issues.push(`Z_SHARED_EDGE_INDEX_MISMATCH:${seamZ}:${column}`);
      }
      sharedEdgePairCount += 1;
    }
  }

  return freeze({
    eligible: issues.length === 0 && sharedEdgePairCount > 0,
    status: issues.length === 0
      ? 'RUN_8B_VIRTUAL_SHARED_EDGE_PASS'
      : 'RUN_8B_VIRTUAL_SHARED_EDGE_FAIL',
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
  if (!topology.ok) {
    return freeze({
      ok: false,
      status: 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_FAILED',
      contractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
      primitive: null,
      topology,
      issues: topology.issues
    });
  }

  const sharedEdges = evaluateHEarthRun8BVirtualSharedEdges(topology);
  const continuity = evaluateHEarthRun8BFormerBoundaryContinuity();

  const construction = constructHEarthTriangleMesh({
    primitiveId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID,
    geometryId: `${H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID}:GEOMETRY`,
    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices: topology.vertices,
    indices: topology.indices,
    normalMode:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'RUN_8B_SUCCESSOR_CONTINUOUS_TERRAIN_AND_MOUNTAIN',
    materialHint: {
      authorityClass: 'RUN_8A_INTERFACE_ONLY_PRESENTATION_WITHHELD',
      interfaceContractId:
        H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId,
      materialAndLightingRealization: false
    },
    source: {
      sourceType: 'RUN_8B_SUCCESSOR_TERRAIN_FIELD_REVISION_WITH_C3C3R5_GRID_RELIEF',
      successorTerrainFieldContractId:
        H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
      controllingRun8AContractId: H_EARTH_RUN_8A_CONTRACT_ID,
      dimensionalSurfaceContractId:
        H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.contractId,
      samplingAndRefinementContractId:
        H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.contractId
    },
    attributes: {
      rowCount: topology.rowCount,
      columnCount: topology.columnCount,
      xValues: topology.xValues,
      zValues: topology.zValues
    },
    metadata: {
      providerContractId:
        H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
      successorFormationId:
        H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.successorFormationId,
      predecessorFormationId:
        H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.predecessorFormationId,
      predecessorDisposition: 'PRESERVED_LEGACY_PROXY_FORMATION',
      fullRealizationClass: 'CONTINUOUS_XZ_TERRAIN_FOOTPRINT_WITH_Y_ELEVATION_AND_PLAYABLE_GRID_RELIEF',
      zBandVertexCounts: topology.zBandVertexCounts,
      baseSpacingWorldUnits: FULL_DETAIL.baseSpacingWorldUnits,
      refinementSpacingWorldUnits: FULL_DETAIL.refinementSpacingWorldUnits,
      formerBoundaryZ:
        H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.formerBoundaryZ,
      sharedEdgePairCount: sharedEdges.sharedEdgePairCount,
      formerBoundaryContinuityEligible: continuity.eligible,
      perceptualCellGridRestoration: true,
      perceptualGridProfile: H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE,
      gridSupportSamplingInstalled: topology.gridSupportSampling.installed,
      gridSupportSampling: topology.gridSupportSampling,
      sourceTerrainFieldMutatedBySupportSampling: false,
      navigationAuthorityMutation: false,
      collisionAuthorityMutation: false,
      maximumAppliedGridDepth: topology.maximumAppliedGridDepth,
      gridReliefVertexCount: topology.gridReliefVertexCount,
      literalGridOverlay: false,
      mountainContinuationWarpedByGrid: false,
      colorTopologyLaw:
        H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.colorTopologyLaw,
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
      ? construction.issues
          .filter((issue) => issue?.blocking === true)
          .map((issue) => issue.code ?? 'SOUTH_CONSTRUCTION_BLOCKING_ISSUE')
      : [])
  ];

  if (construction?.valid !== true) issues.push('SOUTH_NEUTRAL_CONSTRUCTION_INVALID');
  if (!isHEarthNeutralPrimitiveRecord(primitive)) issues.push('SOUTH_NEUTRAL_PRIMITIVE_INVALID');
  if (sharedEdges.eligible !== true) issues.push('SHARED_EDGE_CONTINUITY_INVALID');
  if (continuity.eligible !== true) issues.push('FORMER_BOUNDARY_CONTINUITY_INVALID');
  if (topology.maximumAppliedGridDepth < 0.7) issues.push('C3C3R5_GRID_RELIEF_DEPTH_NOT_MATERIAL');
  if (topology.gridReliefVertexCount <= 0) issues.push('C3C3R5_GRID_RELIEF_NOT_APPLIED');
  if (topology.gridSupportSampling.installed !== true) issues.push('C3C3R5_GRID_SUPPORT_SAMPLING_NOT_INSTALLED');
  if (topology.gridSupportSampling.xSupportValueCount <= 0) issues.push('C3C3R5_X_GRID_SUPPORT_VALUES_MISSING');
  if (topology.gridSupportSampling.zSupportValueCount <= 0) issues.push('C3C3R5_Z_GRID_SUPPORT_VALUES_MISSING');

  return freeze({
    ok: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_COMPLETE'
      : 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_FAILED',
    contractId: H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
    successorTerrainFieldContractId:
      H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
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
      perceptualCellGridRestoration: true,
      gridSupportSampling: topology.gridSupportSampling,
      maximumAppliedGridDepth: topology.maximumAppliedGridDepth,
      gridReliefVertexCount: topology.gridReliefVertexCount
    }),
    sharedEdges,
    continuity,
    legacyProxyContractId: H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
    legacyProxyMutated: false,
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