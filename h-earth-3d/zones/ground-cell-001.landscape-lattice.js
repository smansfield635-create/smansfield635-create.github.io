// /h-earth-3d/zones/ground-cell-001.landscape-lattice.js
// NEW FILE
// H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_BIRTH_STEP_032A_v1
//
// Purpose:
// Defines the descriptor-only 16x16 / 256-address H-Earth landscape
// dimension map for H_EARTH_GROUND_CELL_001.
//
// Corrected priority:
// This file preserves Step 031C row orientation.
// Rows 1-5 are foreground/local inspection.
// Rows 14-16 are distant/horizon compression.
//
// This file does not activate runtime lattice, traversal, gameplay,
// collision, physics, renderer, route, WebGL, canvas, visual pass,
// validation, production, survival simulation, swimming, fluid simulation,
// manor interior access, distant traversal, or matrix collapse.

import {
  H_EARTH_SOURCE_LATTICE_AUTHORITY,
  H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
  H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS
} from '../h-earth.matrix.js';

import {
  H_EARTH_GROUND_CELL_001,
  H_EARTH_GROUND_CELL_001_LATTICE_BINDING,
  H_EARTH_GROUND_CELL_001_ADDRESS_FIELD_SUMMARY,
  H_EARTH_GROUND_CELL_001_RECEIPT
} from '../cells/ground-cell-001.js';

import {
  H_EARTH_ZONE_BOUNDARIES,
  H_EARTH_GROUND_CELL_001_ZONES,
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
  H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS,
  H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY,
  H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL,
  H_EARTH_GROUND_CELL_001_ZONES_RECEIPT
} from './ground-cell-001.zones.js';

export const H_EARTH_256_LATTICE_LANDSCAPE_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_BIRTH_STEP_032A_v1',
  file: '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
  fileClass: 'SOURCE_ENVIRONMENT_LANDSCAPE_DIMENSION_MAP_DESCRIPTOR_ONLY',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  sourceChain: Object.freeze({
    step031A: 'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',
    step031B: 'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',
    step031C: 'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',
    step031D: 'SUFFICIENT_TO_PROCEED_WITH_ARCHIVE_CAUTION'
  }),

  rowOrientation: Object.freeze({
    source: 'STEP_031C',
    preserved: true,
    foregroundRows: 'R01-R05',
    drySandRows: 'R06-R07',
    shorelineRows: 'R08-R09',
    nearshoreRows: 'R10-R11',
    waterRows: 'R12-R13',
    distantHorizonRows: 'R14-R16'
  }),

  purpose:
    'Map the descriptor-only 16x16 / 256-address source lattice into environmental landscape meaning for downstream renderer geometry consumption.',

  doesNotSupersedePriorFiles: true,
  claims031DByteForByteArchiveCompletion: false,

  boundary: Object.freeze({
    descriptorOnly: true,
    runtimeLatticeActivation: false,
    active16x16RuntimeClaim: false,
    active256AddressRuntimeClaim: false,
    traversalClaim: false,
    gameplayClaim: false,
    collisionClaim: false,
    physicsClaim: false,
    rendererActivation: false,
    routeActivation: false,
    canvasActivation: false,
    webglActivation: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    survivalSimulationClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    manorInteriorAccessClaim: false,
    distantTraversalClaim: false,
    matrixCollapse: false
  })
});

export const H_EARTH_256_LATTICE_LANDSCAPE_BOUNDARY_FLAGS = Object.freeze({
  descriptorOnlyLandscapeMap: true,
  sourceLatticeConsumed: true,
  cellBindingConsumed: true,
  zoneMappingConsumed: true,
  objectContextUsedWith031DCaveat: true,

  createsRuntimeGrid: false,
  createsTraversalGrid: false,
  createsCollisionGrid: false,
  createsPhysicsGrid: false,
  createsGameplayGrid: false,
  createsSurvivalGrid: false,
  createsFluidSimulationGrid: false,
  createsWeatherSimulationGrid: false,
  createsRendererGeometry: false,
  createsCssClasses: false,
  createsRouteDom: false,

  rendererActivation: false,
  routeActivation: false,
  runtimeActivation: false,
  canvasActivation: false,
  webglActivation: false,

  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,

  openWorldTraversalClaim: false,
  survivalSimulationClaim: false,
  swimmingClaim: false,
  fluidSimulationClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,

  matrixCollapse: false
});

export const H_EARTH_256_LATTICE_LANDSCAPE_ROW_ORIENTATION = Object.freeze({
  orientationId: 'H_EARTH_256_LATTICE_LANDSCAPE_ROW_ORIENTATION',
  source: 'STEP_031C_ZONE_MAPPING',
  semanticAlignmentWith031C: true,

  rowMeaning: Object.freeze({
    R01_R05: 'foreground / local inspection',
    R06_R07: 'dry sand / upper beach',
    R08_R09: 'shoreline foam / tide-pool transition',
    R10_R11: 'nearshore wave / water-depth transition',
    R12_R13: 'water surface / open water',
    R14_R16: 'distant context / air-haze / horizon compression'
  }),

  prohibitedOrientation: Object.freeze({
    rows01To02AsAirHaze: false,
    rows14To16AsForeground: false,
    reversedAgainst031C: false
  })
});

export const H_EARTH_256_LATTICE_REGION_PROFILES = Object.freeze({
  FOREGROUND_INSPECTION_GROUND: Object.freeze({
    regionId: 'FOREGROUND_INSPECTION_GROUND',
    rowRange: Object.freeze({ min: 1, max: 5 }),
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    surfaceRole: 'foreground-wet-sand / inspection-ground / rocks-detail / selected-surface-zone',
    surfaceFamily: 'wetSand',
    materialKey: 'wetSand',
    primitiveIntent: 'contouredTerrainBand',
    depthBand: 'foreground',
    horizonBand: false,
    foregroundBand: true,
    inspectionRelevance: 'PRIMARY_OR_SUPPORTING',
    environmentContext: 'primary local ground inspection surface',
    renderPriorityHint: 100
  }),

  DRY_SAND_UPPER_BEACH: Object.freeze({
    regionId: 'DRY_SAND_UPPER_BEACH',
    rowRange: Object.freeze({ min: 6, max: 7 }),
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    surfaceRole: 'dry-sand-transition / upper-beach',
    surfaceFamily: 'drySand',
    materialKey: 'drySand',
    primitiveIntent: 'terrainBand',
    depthBand: 'foreground-transition',
    horizonBand: false,
    foregroundBand: true,
    inspectionRelevance: 'SECONDARY_SURFACE_CONTEXT',
    environmentContext: 'dry-to-wet surface transition',
    renderPriorityHint: 80
  }),

  SHORELINE_CONTACT: Object.freeze({
    regionId: 'SHORELINE_CONTACT',
    rowRange: Object.freeze({ min: 8, max: 9 }),
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    surfaceRole: 'shoreline-foam-line / tide-pool-transition / shoreline-contact',
    surfaceFamily: 'foam',
    materialKey: 'foam',
    primitiveIntent: 'irregularShorelineBand',
    depthBand: 'shoreline',
    horizonBand: false,
    foregroundBand: false,
    inspectionRelevance: 'SUPPORTING',
    environmentContext: 'earth-water contact and tide-pool transition',
    renderPriorityHint: 70
  }),

  NEARSHORE_WAVE_BAND: Object.freeze({
    regionId: 'NEARSHORE_WAVE_BAND',
    rowRange: Object.freeze({ min: 10, max: 11 }),
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    surfaceRole: 'nearshore-wave-band / water-depth-transition',
    surfaceFamily: 'nearshoreWave',
    materialKey: 'nearshoreWave',
    primitiveIntent: 'waterDepthBand',
    depthBand: 'nearshore',
    horizonBand: false,
    foregroundBand: false,
    inspectionRelevance: 'CONTEXT',
    environmentContext: 'water pressure and nearshore context',
    renderPriorityHint: 50
  }),

  WATER_SURFACE_PLANE: Object.freeze({
    regionId: 'WATER_SURFACE_PLANE',
    rowRange: Object.freeze({ min: 12, max: 13 }),
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    surfaceRole: 'water-surface-plane / open-water-stage',
    surfaceFamily: 'water',
    materialKey: 'water',
    primitiveIntent: 'waterPlane',
    depthBand: 'water',
    horizonBand: false,
    foregroundBand: false,
    inspectionRelevance: 'NONE',
    environmentContext: 'visible water context only',
    renderPriorityHint: 40
  }),

  DISTANT_CONTEXT_MANOR_AND_ISLETS: Object.freeze({
    regionId: 'DISTANT_CONTEXT_MANOR_AND_ISLETS',
    rowRange: Object.freeze({ min: 14, max: 15 }),
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    surfaceRole: 'distant-world-context / manor-context / distant-rock-islet-context',
    surfaceFamily: 'distantRock',
    materialKey: 'distantRock',
    primitiveIntent: 'distantCluster',
    depthBand: 'horizon-context',
    horizonBand: true,
    foregroundBand: false,
    inspectionRelevance: 'NONE',
    environmentContext: 'Audralia distant context and Hearth exterior context boundary',
    renderPriorityHint: 30
  }),

  AIR_HAZE_DISTANT_ATMOSPHERE: Object.freeze({
    regionId: 'AIR_HAZE_DISTANT_ATMOSPHERE',
    rowRange: Object.freeze({ min: 16, max: 16 }),
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    surfaceRole: 'air-haze / sky-volume / distant-atmosphere',
    surfaceFamily: 'airHaze',
    materialKey: 'airHaze',
    primitiveIntent: 'atmosphericLayer',
    depthBand: 'horizon',
    horizonBand: true,
    foregroundBand: false,
    inspectionRelevance: 'NONE',
    environmentContext: 'Audralia distant planetary-world atmosphere context',
    renderPriorityHint: 20
  })
});

export const H_EARTH_256_LATTICE_COLUMN_VARIANTS = Object.freeze({
  LEFT_EDGE: Object.freeze({
    columnRange: Object.freeze({ min: 1, max: 3 }),
    contourHint: 'left-boundary irregular terrain',
    densityHint: 0.72,
    visualPriorityHint: 0.68
  }),

  LEFT_DETAIL: Object.freeze({
    columnRange: Object.freeze({ min: 4, max: 6 }),
    contourHint: 'left-detail surface variation',
    densityHint: 0.82,
    visualPriorityHint: 0.78
  }),

  CENTER_INSPECTION: Object.freeze({
    columnRange: Object.freeze({ min: 7, max: 10 }),
    contourHint: 'central inspection continuity',
    densityHint: 0.95,
    visualPriorityHint: 1
  }),

  RIGHT_CONTEXT: Object.freeze({
    columnRange: Object.freeze({ min: 11, max: 13 }),
    contourHint: 'right-context transition',
    densityHint: 0.64,
    visualPriorityHint: 0.72
  }),

  FAR_RIGHT_CONTEXT: Object.freeze({
    columnRange: Object.freeze({ min: 14, max: 16 }),
    contourHint: 'far-right manor/context edge',
    densityHint: 0.52,
    visualPriorityHint: 0.60
  })
});

export const H_EARTH_256_LATTICE_OBJECT_HINTS = Object.freeze({
  OBJ_001_GROUND_SPAWN_ANCHOR: Object.freeze({
    objectId: 'OBJ_001_GROUND_SPAWN_ANCHOR',
    preferredRows: Object.freeze([1, 2]),
    preferredColumns: Object.freeze([8, 9]),
    role: 'spawn anchor hint'
  }),

  OBJ_002_FOREGROUND_WET_SAND: Object.freeze({
    objectId: 'OBJ_002_FOREGROUND_WET_SAND',
    preferredRows: Object.freeze([1, 2, 3, 4, 5]),
    preferredColumns: Object.freeze([6, 7, 8, 9, 10, 11]),
    role: 'primary inspection object'
  }),

  OBJ_003_DRY_SAND_TRANSITION: Object.freeze({
    objectId: 'OBJ_003_DRY_SAND_TRANSITION',
    preferredRows: Object.freeze([6, 7]),
    preferredColumns: Object.freeze([5, 6, 7, 8, 9, 10, 11, 12]),
    role: 'secondary surface context'
  }),

  OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: Object.freeze({
    objectId: 'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    preferredRows: Object.freeze([8, 9]),
    preferredColumns: Object.freeze([4, 5, 6, 7, 8]),
    role: 'supporting inspection moisture target'
  }),

  OBJ_005_SHORELINE_FOAM_LINE: Object.freeze({
    objectId: 'OBJ_005_SHORELINE_FOAM_LINE',
    preferredRows: Object.freeze([8, 9]),
    preferredColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    role: 'supporting shoreline boundary target'
  }),

  OBJ_006_NEARSHORE_WAVE_BAND: Object.freeze({
    objectId: 'OBJ_006_NEARSHORE_WAVE_BAND',
    preferredRows: Object.freeze([10, 11]),
    preferredColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    role: 'water context'
  }),

  OBJ_007_WATER_SURFACE_PLANE: Object.freeze({
    objectId: 'OBJ_007_WATER_SURFACE_PLANE',
    preferredRows: Object.freeze([12, 13]),
    preferredColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    role: 'water surface context'
  }),

  OBJ_008_AIR_HAZE_LIGHT_LAYER: Object.freeze({
    objectId: 'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    preferredRows: Object.freeze([16]),
    preferredColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    role: 'air haze context'
  }),

  OBJ_009_MANOR_EXTERIOR_CONTEXT: Object.freeze({
    objectId: 'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    preferredRows: Object.freeze([14, 15]),
    preferredColumns: Object.freeze([12, 13, 14, 15, 16]),
    role: 'Hearth support/control exterior context only'
  }),

  OBJ_010_SMALL_BEACH_STONES: Object.freeze({
    objectId: 'OBJ_010_SMALL_BEACH_STONES',
    preferredRows: Object.freeze([1, 2, 3, 4, 5]),
    preferredColumns: Object.freeze([4, 5, 6, 7]),
    role: 'supporting footing-friction target'
  }),

  OBJ_011_FOREGROUND_JAGGED_ROCKS: Object.freeze({
    objectId: 'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    preferredRows: Object.freeze([1, 2, 3, 4, 5]),
    preferredColumns: Object.freeze([1, 2, 3, 4]),
    role: 'supporting terrain-hazard target'
  }),

  OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: Object.freeze({
    objectId: 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',
    preferredRows: Object.freeze([14, 15]),
    preferredColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7]),
    role: 'Audralia distant planetary-world context only'
  })
});

export const H_EARTH_256_LATTICE_ADJACENCY_RULES = Object.freeze({
  FOREGROUND_INSPECTION_GROUND: Object.freeze([
    'DRY_SAND_UPPER_BEACH',
    'SHORELINE_CONTACT'
  ]),

  DRY_SAND_UPPER_BEACH: Object.freeze([
    'FOREGROUND_INSPECTION_GROUND',
    'SHORELINE_CONTACT'
  ]),

  SHORELINE_CONTACT: Object.freeze([
    'DRY_SAND_UPPER_BEACH',
    'NEARSHORE_WAVE_BAND'
  ]),

  NEARSHORE_WAVE_BAND: Object.freeze([
    'SHORELINE_CONTACT',
    'WATER_SURFACE_PLANE'
  ]),

  WATER_SURFACE_PLANE: Object.freeze([
    'NEARSHORE_WAVE_BAND',
    'DISTANT_CONTEXT_MANOR_AND_ISLETS'
  ]),

  DISTANT_CONTEXT_MANOR_AND_ISLETS: Object.freeze([
    'WATER_SURFACE_PLANE',
    'AIR_HAZE_DISTANT_ATMOSPHERE'
  ]),

  AIR_HAZE_DISTANT_ATMOSPHERE: Object.freeze([
    'DISTANT_CONTEXT_MANOR_AND_ISLETS'
  ])
});

export function pad2(value) {
  return String(value).padStart(2, '0');
}

export function makeLandscapeAddress(row, column) {
  return `H_EARTH_GROUND_CELL_001:R${pad2(row)}:C${pad2(column)}`;
}

export function resolveRegionProfileForRow(row) {
  return (
    Object.values(H_EARTH_256_LATTICE_REGION_PROFILES).find((profile) => (
      row >= profile.rowRange.min && row <= profile.rowRange.max
    )) || H_EARTH_256_LATTICE_REGION_PROFILES.FOREGROUND_INSPECTION_GROUND
  );
}

export function resolveColumnVariant(column) {
  return (
    Object.values(H_EARTH_256_LATTICE_COLUMN_VARIANTS).find((variant) => (
      column >= variant.columnRange.min && column <= variant.columnRange.max
    )) || H_EARTH_256_LATTICE_COLUMN_VARIANTS.CENTER_INSPECTION
  );
}

export function resolveObjectHintsForAddress(row, column) {
  return Object.freeze(
    Object.values(H_EARTH_256_LATTICE_OBJECT_HINTS)
      .filter((hint) => (
        hint.preferredRows.includes(row) &&
        hint.preferredColumns.includes(column)
      ))
      .map((hint) => Object.freeze({
        objectId: hint.objectId,
        role: hint.role
      }))
  );
}

export function resolveInspectionRelevance(row, column, regionProfile) {
  const objectHints = resolveObjectHintsForAddress(row, column);
  const objectIds = objectHints.map((hint) => hint.objectId);

  if (objectIds.includes('OBJ_002_FOREGROUND_WET_SAND')) {
    return 'PRIMARY_INSPECTION';
  }

  if (
    objectIds.includes('OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES') ||
    objectIds.includes('OBJ_010_SMALL_BEACH_STONES') ||
    objectIds.includes('OBJ_011_FOREGROUND_JAGGED_ROCKS') ||
    objectIds.includes('OBJ_005_SHORELINE_FOAM_LINE')
  ) {
    return 'SUPPORTING_INSPECTION';
  }

  return regionProfile.inspectionRelevance;
}

export function resolveAddressRecord(row, column) {
  const regionProfile = resolveRegionProfileForRow(row);
  const columnVariant = resolveColumnVariant(column);
  const objectHints = resolveObjectHintsForAddress(row, column);
  const inspectionRelevance = resolveInspectionRelevance(row, column, regionProfile);

  const adjacency = Object.freeze({
    regional: H_EARTH_256_LATTICE_ADJACENCY_RULES[regionProfile.regionId] || Object.freeze([]),

    rowAdjacent: Object.freeze([
      row > 1 ? makeLandscapeAddress(row - 1, column) : null,
      row < 16 ? makeLandscapeAddress(row + 1, column) : null
    ].filter(Boolean)),

    columnAdjacent: Object.freeze([
      column > 1 ? makeLandscapeAddress(row, column - 1) : null,
      column < 16 ? makeLandscapeAddress(row, column + 1) : null
    ].filter(Boolean))
  });

  return Object.freeze({
    address: makeLandscapeAddress(row, column),
    row,
    column,
    cellId: 'H_EARTH_GROUND_CELL_001',

    regionId: regionProfile.regionId,
    zoneId: regionProfile.zoneId,

    surfaceRole: regionProfile.surfaceRole,
    surfaceFamily: regionProfile.surfaceFamily,
    materialKey: regionProfile.materialKey,
    primitiveIntent: regionProfile.primitiveIntent,

    objectHints,
    adjacency,

    depthBand: regionProfile.depthBand,
    horizonBand: regionProfile.horizonBand,
    foregroundBand: regionProfile.foregroundBand,

    inspectionRelevance,
    environmentContext: regionProfile.environmentContext,

    renderHintDescriptorOnly: Object.freeze({
      surfaceSlopeHint:
        regionProfile.foregroundBand === true
          ? 'low irregular surface slope'
          : regionProfile.horizonBand === true
            ? 'compressed horizon slope'
            : 'transitional depth slope',

      contourHint: columnVariant.contourHint,
      densityHint: columnVariant.densityHint,
      visualPriorityHint: columnVariant.visualPriorityHint,
      renderPriorityHint: regionProfile.renderPriorityHint,

      adjacencyWeight: adjacency.regional.length / 2,

      inspectionWeight:
        inspectionRelevance === 'PRIMARY_INSPECTION'
          ? 1
          : inspectionRelevance === 'SUPPORTING_INSPECTION'
            ? 0.75
            : inspectionRelevance === 'SECONDARY_SURFACE_CONTEXT'
              ? 0.45
              : 0.15,

      descriptorOnly: true,
      rendererGeometryClaim: false,
      cssClassClaim: false,
      visualPassClaim: false,
      validationClaim: false
    }),

    boundary: H_EARTH_256_LATTICE_LANDSCAPE_BOUNDARY_FLAGS
  });
}

export function buildLandscapeLatticeMap() {
  const records = {};

  for (let row = 1; row <= 16; row += 1) {
    for (let column = 1; column <= 16; column += 1) {
      const record = resolveAddressRecord(row, column);
      records[record.address] = record;
    }
  }

  return Object.freeze(records);
}

export const H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP =
  buildLandscapeLatticeMap();

export function summarizeByRegion() {
  const summary = {};

  Object.values(H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP).forEach((record) => {
    if (!summary[record.regionId]) {
      summary[record.regionId] = {
        regionId: record.regionId,
        zoneId: record.zoneId,
        addressCount: 0,
        rows: new Set(),
        columns: new Set(),
        surfaceFamily: record.surfaceFamily,
        materialKey: record.materialKey,
        primitiveIntent: record.primitiveIntent,
        depthBand: record.depthBand,
        horizonBand: record.horizonBand,
        foregroundBand: record.foregroundBand
      };
    }

    summary[record.regionId].addressCount += 1;
    summary[record.regionId].rows.add(record.row);
    summary[record.regionId].columns.add(record.column);
  });

  return Object.freeze(
    Object.fromEntries(
      Object.entries(summary).map(([regionId, entry]) => [
        regionId,
        Object.freeze({
          regionId,
          zoneId: entry.zoneId,
          addressCount: entry.addressCount,
          rows: Object.freeze([...entry.rows]),
          columns: Object.freeze([...entry.columns]),
          surfaceFamily: entry.surfaceFamily,
          materialKey: entry.materialKey,
          primitiveIntent: entry.primitiveIntent,
          depthBand: entry.depthBand,
          horizonBand: entry.horizonBand,
          foregroundBand: entry.foregroundBand
        })
      ])
    )
  );
}

export function summarizeInspectionAddresses() {
  const records = Object.values(H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP);

  return Object.freeze({
    primaryInspectionAddresses: Object.freeze(
      records
        .filter((record) => record.inspectionRelevance === 'PRIMARY_INSPECTION')
        .map((record) => record.address)
    ),

    supportingInspectionAddresses: Object.freeze(
      records
        .filter((record) => record.inspectionRelevance === 'SUPPORTING_INSPECTION')
        .map((record) => record.address)
    ),

    secondarySurfaceContextAddresses: Object.freeze(
      records
        .filter((record) => record.inspectionRelevance === 'SECONDARY_SURFACE_CONTEXT')
        .map((record) => record.address)
    ),

    contextOnlyAddresses: Object.freeze(
      records
        .filter((record) => (
          record.inspectionRelevance === 'NONE' ||
          record.inspectionRelevance === 'CONTEXT'
        ))
        .map((record) => record.address)
    )
  });
}

export const H_EARTH_256_LATTICE_LANDSCAPE_REGION_SUMMARY =
  summarizeByRegion();

export const H_EARTH_256_LATTICE_ENVIRONMENT_ADJACENCY_SUMMARY =
  Object.freeze(H_EARTH_256_LATTICE_ADJACENCY_RULES);

export const H_EARTH_256_LATTICE_INSPECTION_ADDRESS_SUMMARY =
  summarizeInspectionAddresses();

export const H_EARTH_256_LATTICE_COMPATIBILITY_CHECK = Object.freeze({
  checkId: 'H_EARTH_256_LATTICE_COMPATIBILITY_CHECK',

  importSurfaceExpected: Object.freeze({
    matrixAuthority: true,
    matrixAddressSchema: true,
    cellBinding: true,
    zoneMapping: true
  }),

  semanticAlignmentWith031C: Object.freeze({
    foregroundRows01To05: true,
    horizonRows14To16: true,
    reversedOrientation: false
  }),

  addressCountLogic: Object.freeze({
    expectedRows: 16,
    expectedColumns: 16,
    expectedAddressCount: 256,
    actualAddressCount: Object.keys(H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP).length,
    pass: Object.keys(H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP).length === 256
  }),

  boundarySurface: Object.freeze({
    descriptorOnly: true,
    runtimeLatticeActivation: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false
  })
});

export const H_EARTH_256_LATTICE_LANDSCAPE_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_256_LATTICE_LANDSCAPE_RECEIPT',
  contractId: 'H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_BIRTH_STEP_032A_v1',
  file: '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  sourceLatticeAuthorityConsumed: Boolean(H_EARTH_SOURCE_LATTICE_AUTHORITY),
  sourceLatticeAddressFieldSchemaConsumed: Boolean(H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA),
  sourceLatticeBoundaryFlagsConsumed: Boolean(H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS),

  cellBindingConsumed: Boolean(H_EARTH_GROUND_CELL_001_LATTICE_BINDING),
  cellAddressFieldSummaryConsumed: Boolean(H_EARTH_GROUND_CELL_001_ADDRESS_FIELD_SUMMARY),
  cellReceiptConsumed: Boolean(H_EARTH_GROUND_CELL_001_RECEIPT),

  zonesConsumed: Boolean(H_EARTH_GROUND_CELL_001_ZONES),
  zoneBoundariesConsumed: Boolean(H_EARTH_ZONE_BOUNDARIES),
  zoneDescriptorsConsumed: Boolean(H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS),
  zoneAddressRegionsConsumed: Boolean(H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS),
  zoneAdjacencyConsumed: Boolean(H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY),
  zoneOverlapModelConsumed: Boolean(H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL),
  zoneReceiptConsumed: Boolean(H_EARTH_GROUND_CELL_001_ZONES_RECEIPT),

  landscapeMapDefined: true,
  regionSummaryDefined: true,
  adjacencySummaryDefined: true,
  inspectionAddressSummaryDefined: true,
  compatibilityCheckDefined: true,

  rowOrientationCorrectedTo031C: true,
  foregroundRows01To05: true,
  drySandRows06To07: true,
  shorelineRows08To09: true,
  nearshoreRows10To11: true,
  waterRows12To13: true,
  distantHorizonRows14To16: true,

  rowCount: 16,
  columnCount: 16,
  addressCount: Object.keys(H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP).length,
  addressCountExpected: 256,
  addressCountMatchesExpected:
    Object.keys(H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP).length === 256,

  claims031DByteForByteArchiveCompletion: false,
  usesExisting12ObjectPremiseWithCaveat: true,

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  downstreamRoom4GeometryConsumptionReady: true,
  expectedRoom4Target: '/showroom/globe/h-earth/render/geometry.js',
  expectedRoom4Contract:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032B_LANDSCAPE_LATTICE_DIMENSION_CONSUMPTION_v1',

  boundary: H_EARTH_256_LATTICE_LANDSCAPE_BOUNDARY_FLAGS
});

export function getHEarthLandscapeLatticeMap() {
  return H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP;
}

export function getHEarthLandscapeLatticeReceipt() {
  return H_EARTH_256_LATTICE_LANDSCAPE_RECEIPT;
}

export function getHEarthLandscapeAddress(address) {
  return H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP[address] || null;
}

export function getHEarthLandscapeAddressByRowColumn(row, column) {
  return getHEarthLandscapeAddress(makeLandscapeAddress(row, column));
}

export const H_EARTH_256_LATTICE_LANDSCAPE_AGGREGATE = Object.freeze({
  id: 'H_EARTH_256_LATTICE_LANDSCAPE_AGGREGATE',
  contract: H_EARTH_256_LATTICE_LANDSCAPE_CONTRACT,

  upstream: Object.freeze({
    sourceLatticeAuthority: H_EARTH_SOURCE_LATTICE_AUTHORITY,
    sourceLatticeAddressFieldSchema: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
    sourceLatticeBoundaryFlags: H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS,
    groundCell: H_EARTH_GROUND_CELL_001,
    groundCellLatticeBinding: H_EARTH_GROUND_CELL_001_LATTICE_BINDING,
    zoneBoundaries: H_EARTH_ZONE_BOUNDARIES,
    zones: H_EARTH_GROUND_CELL_001_ZONES,
    zoneDescriptors: H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
    zoneAddressRegions: H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS,
    zoneAdjacency: H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY,
    zoneOverlapModel: H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL
  }),

  rowOrientation: H_EARTH_256_LATTICE_LANDSCAPE_ROW_ORIENTATION,
  regionProfiles: H_EARTH_256_LATTICE_REGION_PROFILES,
  columnVariants: H_EARTH_256_LATTICE_COLUMN_VARIANTS,
  objectHints: H_EARTH_256_LATTICE_OBJECT_HINTS,
  adjacencyRules: H_EARTH_256_LATTICE_ADJACENCY_RULES,

  landscapeMap: H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP,
  regionSummary: H_EARTH_256_LATTICE_LANDSCAPE_REGION_SUMMARY,
  adjacencySummary: H_EARTH_256_LATTICE_ENVIRONMENT_ADJACENCY_SUMMARY,
  inspectionAddressSummary: H_EARTH_256_LATTICE_INSPECTION_ADDRESS_SUMMARY,
  compatibilityCheck: H_EARTH_256_LATTICE_COMPATIBILITY_CHECK,

  receipt: H_EARTH_256_LATTICE_LANDSCAPE_RECEIPT,
  boundaryFlags: H_EARTH_256_LATTICE_LANDSCAPE_BOUNDARY_FLAGS,

  getHEarthLandscapeLatticeMap,
  getHEarthLandscapeLatticeReceipt,
  getHEarthLandscapeAddress,
  getHEarthLandscapeAddressByRowColumn
});

export default H_EARTH_256_LATTICE_LANDSCAPE_AGGREGATE;
