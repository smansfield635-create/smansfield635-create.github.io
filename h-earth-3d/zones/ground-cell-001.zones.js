/**
 * /h-earth-3d/zones/ground-cell-001.zones.js
 * COMPLETE RENEWED FILE
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1
 *
 * Based on Drive scratch baseline:
 * File: zones/ground-cell-001.zones.js
 * Prior status:
 * - Drive scratch raw-file construction only.
 * - Zone map only.
 * - Zones do not create gameplay traversal.
 * - Zones do not activate runtime.
 * - Zones do not activate renderer.
 * - No visual-pass claim.
 * - No validation claim.
 *
 * Renewal room:
 * ROOM 3 / ENVIRONMENT
 *
 * Upstream source authority:
 * /h-earth-3d/h-earth.matrix.js
 * H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1
 *
 * Upstream cell binding:
 * /h-earth-3d/cells/ground-cell-001.js
 * H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1
 *
 * Purpose:
 * Renew the existing Drive scratch zone map into a lattice-aware source-zone
 * descriptor file for H_EARTH_GROUND_CELL_001.
 *
 * Room 3 authority:
 * Room 3 does not create the source lattice.
 * Room 3 does not create the active cell binding.
 * Room 3 maps the existing five source zones onto the Room 2-bound
 * 16x16 / 256 descriptor address field.
 *
 * Boundary:
 * This file defines zone structure only.
 * This file does not define object compression.
 * This file does not define material channels.
 * This file does not define inspection anchor lists.
 * This file does not define action behavior.
 * This file does not define readout payloads.
 * This file does not define rendering.
 * This file does not activate lattice, traversal, gameplay, runtime, route,
 * renderer, canvas, WebGL, validation, production, or matrix collapse.
 */

import {
  H_EARTH_MATRIX_SEPARATION,
  H_EARTH_SOURCE_LATTICE_AUTHORITY,
  H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
  H_EARTH_GROUND_CELL_001_LATTICE_SCOPE,
  getHEarthMatrixReceipt,
  getHEarthSourceLatticeAuthority,
  getHEarthGroundCell001LatticeScope,
  getHEarthSourceLatticeAddressFieldSchema
} from '../h-earth.matrix.js';

import {
  H_EARTH_GROUND_CELL_001,
  H_EARTH_GROUND_CELL_001_CONTRACT,
  H_EARTH_GROUND_CELL_001_SCENE_BINDING,
  H_EARTH_GROUND_CELL_001_LATTICE_BINDING,
  H_EARTH_GROUND_CELL_001_ADDRESS_FIELD_SUMMARY,
  H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,
  H_EARTH_GROUND_CELL_001_BOUNDARY_FLAGS,
  H_EARTH_GROUND_CELL_001_RECEIPT,
  H_EARTH_ROOM_3_UNBLOCK_RECEIPT,
  getHEarthGroundCell001Receipt,
  getHEarthGroundCell001LatticeBinding,
  getHEarthGroundCell001AddressFieldSummary,
  getHEarthRoom3UnblockReceipt
} from '../cells/ground-cell-001.js';

export const H_EARTH_GROUND_CELL_001_ZONES_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  upstreamMatrixContractId:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',

  upstreamCellContractId:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  file: '/h-earth-3d/zones/ground-cell-001.zones.js',
  upstreamMatrixFile: '/h-earth-3d/h-earth.matrix.js',
  upstreamCellFile: '/h-earth-3d/cells/ground-cell-001.js',
  sourceRoot: '/h-earth-3d/',

  room: 'ROOM_3_ENVIRONMENT',
  upstreamRoom: 'ROOM_2_CELL_STRUCTURE',
  downstreamRoom: 'ROOM_3_OBJECTS_THEN_ROOM_4_ACTIONS',

  fileClass: 'SOURCE_ZONE_MAPPING_DESCRIPTOR_ONLY',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  baselinePreserved: Object.freeze({
    driveScratchBaselineConsumed: true,
    baselineZoneBoundaryExportPreserved: true,
    baselineFiveZoneMapPreserved: true,
    baselineZoneMapOnlyStatusPreserved: true,
    baselineNoGameplayTraversalPreserved: true,
    baselineNoRuntimeActivationPreserved: true,
    baselineNoRendererActivationPreserved: true,
    baselineNoVisualPassPreserved: true,
    baselineNoValidationPreserved: true
  }),

  renewalPurpose:
    'Bind the existing Drive scratch five-zone map to the Room 2-bound 16x16 / 256 descriptor address field.',

  renewalScope: Object.freeze({
    upstreamMatrixAuthorityConsumed: true,
    upstreamCellLatticeBindingConsumed: true,
    activeCellSceneBindingConsumed: true,
    sourceZoneMapDefined: true,
    fiveZoneIdentitiesPreserved: true,
    originalZoneBoundaryFlagsPreserved: true,
    originalZoneLabelsRolesAndAllowedUsesPreserved: true,
    zoneAddressRegionsDefined: true,
    zoneAdjacencyDefined: true,
    zoneBoundaryRolesDefined: true,
    room3ObjectCompressionUnblocked: true,

    sourceLatticeAuthorityCreatedHere: false,
    activeCellBindingCreatedHere: false,
    full256AddressEnumerationAdded: false,
    objectCompressionAdded: false,
    materialChannelMappingAdded: false,
    inspectionAnchorListAdded: false,
    actionBehaviorAdded: false,
    readoutPayloadAdded: false,
    receiptRuntimeCreationAdded: false,
    routeExposureAdded: false,
    rendererBehaviorChanged: false,
    compositorBehaviorChanged: false,
    controllerBehaviorChanged: false
  })
});

/**
 * Baseline export preserved from Drive scratch file.
 * This keeps the original simple boundary object available to downstream
 * consumers that already expect H_EARTH_ZONE_BOUNDARIES.
 */
export const H_EARTH_ZONE_BOUNDARIES = Object.freeze({
  openWorldTraversalAuthorized: false,
  manorInteriorAccessAuthorized: false,
  distantTraversalAuthorized: false,
  swimmingAuthorized: false,
  waterTraversalAuthorized: false,
  fluidSimulationAuthorized: false,
  runtimeActivationClaim: false,
  rendererActivationClaim: false,
  canvasActivationClaim: false,
  webglActivationClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  survivalSimulationAuthorized: false,
  matrixCollapse: false
});

export const H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS = Object.freeze({
  sourceZoneMappingAuthority: true,
  descriptorOnlyZoneAuthority: true,
  cellLatticeConsumed: true,
  sceneScopedAddressabilityConsumed: true,

  baselineZoneBoundaryFlagsPreserved: true,
  baselineDriveScratchZoneMapPreserved: true,

  sourceMatrixAuthorityCreatedHere: false,
  cellLatticeBindingCreatedHere: false,
  objectMappingCreatedHere: false,
  materialChannelMappingCreatedHere: false,
  inspectionAnchorListCreatedHere: false,
  actionBehaviorCreatedHere: false,
  readoutPayloadCreatedHere: false,
  routeExposureCreatedHere: false,

  full256AddressRuntimeClaim: false,
  full256AddressEnumerationIncludedHere: false,
  routeRuntimeCreation: false,
  routeExposureCompleted: false,

  rendererActivation: false,
  compositorActivation: false,
  controllerActivation: false,
  webglActivation: false,
  canvasActivation: false,

  latticeActivation: false,
  runtime16x16LatticeActivationClaim: false,
  active16x16RuntimeClaim: false,
  movementExpansion: false,
  traversalExpansion: false,
  deepInspectionExpansion: false,

  gameplayExecutionClaim: false,
  runtimeReceiptPersistence: false,
  survivalSimulation: false,
  swimming: false,
  fluidSimulation: false,
  weatherSimulation: false,
  manorInteriorAccess: false,
  distantTraversal: false,

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  diagnosticScoreClaim: false,
  healthScoreClaim: false,
  survivalScoreClaim: false,

  mirrorManorRouteCanonNameClaim: false,
  matrixCollapse: false
});

export const H_EARTH_GROUND_CELL_001_ZONE_IDS = Object.freeze({
  foregroundInspection: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
  shorelineContact: 'ZONE_002_SHORELINE_CONTACT_ZONE',
  waterSurface: 'ZONE_003_WATER_SURFACE_ZONE',
  manorContext: 'ZONE_004_MANOR_CONTEXT_ZONE',
  distantWorldContext: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
});

export const H_EARTH_GROUND_CELL_001_ZONE_MAPPING_MODEL = Object.freeze({
  modelId: 'H_EARTH_GROUND_CELL_001_ZONE_MAPPING_MODEL',
  status: 'FIVE_SOURCE_ZONES_MAPPED_TO_CELL_LATTICE_DESCRIPTOR_ONLY',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  latticeShape: H_EARTH_SOURCE_LATTICE_AUTHORITY.latticeShape,
  rowCount: H_EARTH_SOURCE_LATTICE_AUTHORITY.rowCount,
  columnCount: H_EARTH_SOURCE_LATTICE_AUTHORITY.columnCount,
  addressCount: H_EARTH_SOURCE_LATTICE_AUTHORITY.addressCount,
  addressFormat: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA.addressFormat,

  zoneCount: 5,

  mappingPrinciple:
    'The existing scratch zones are preserved and bound to descriptor-only address regions on H_EARTH_GROUND_CELL_001. These regions are not movement grids, renderer coordinates, collision maps, or route navigation meshes.',

  rowSemanticGradient: Object.freeze({
    lowRows: Object.freeze({
      rows: 'R01-R05',
      meaning: 'foreground local inspection and immediate ground contact'
    }),
    middleRows: Object.freeze({
      rows: 'R04-R10',
      meaning: 'shoreline transition, wet/dry surface relation, and nearshore contact'
    }),
    upperRows: Object.freeze({
      rows: 'R08-R14',
      meaning: 'water surface, atmospheric context, and distant visual compression'
    }),
    horizonRows: Object.freeze({
      rows: 'R13-R16',
      meaning: 'distant world context and horizon compression'
    })
  }),

  columnSemanticGradient: Object.freeze({
    leftColumns: Object.freeze({
      columns: 'C01-C06',
      meaning: 'left foreground rocks, stones, and shoreline variation'
    }),
    centerColumns: Object.freeze({
      columns: 'C05-C12',
      meaning: 'primary ground inspection, foam, tide-pool, and water relation'
    }),
    rightColumns: Object.freeze({
      columns: 'C11-C16',
      meaning: 'manor exterior context and distant contextual silhouettes'
    })
  }),

  boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
});

export const H_EARTH_GROUND_CELL_001_ZONE_REGION_RULES = Object.freeze({
  ruleId: 'H_EARTH_GROUND_CELL_001_ZONE_REGION_RULES',

  addressRegionRule:
    'Each preserved scratch zone receives a descriptor-only row/column region. Regions may overlap when the real scene relation is transitional, such as shoreline, water contact, manor visibility, or horizon context.',

  overlapAllowed: true,

  overlapReasons: Object.freeze([
    'shoreline is a transition, not a hard edge',
    'wet sand and dry sand relation may overlap',
    'water and foam contact may overlap',
    'manor and distant context are visible context, not traversal areas',
    'haze may span water and distant context'
  ]),

  prohibitedInterpretations: Object.freeze([
    'movement grid',
    'walkable map',
    'swimming grid',
    'physics collision map',
    'route navigation mesh',
    'renderer coordinate source',
    'visual pass proof',
    'validation proof',
    'production readiness'
  ]),

  boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
});

export function padCellIndex(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return '00';
  }

  return String(Math.trunc(numberValue)).padStart(2, '0');
}

export function makeCellAddress(row, column) {
  return `H_EARTH_GROUND_CELL_001:R${padCellIndex(row)}:C${padCellIndex(column)}`;
}

export function makeAddressRange(rowMin, rowMax, columnMin, columnMax) {
  return Object.freeze({
    rowRange: Object.freeze({
      min: rowMin,
      max: rowMax
    }),

    columnRange: Object.freeze({
      min: columnMin,
      max: columnMax
    }),

    cornerAddresses: Object.freeze({
      northWest: makeCellAddress(rowMin, columnMin),
      northEast: makeCellAddress(rowMin, columnMax),
      southWest: makeCellAddress(rowMax, columnMin),
      southEast: makeCellAddress(rowMax, columnMax)
    }),

    centerAddress: makeCellAddress(
      Math.round((rowMin + rowMax) / 2),
      Math.round((columnMin + columnMax) / 2)
    ),

    addressCountEstimate:
      (Math.max(rowMin, rowMax) - Math.min(rowMin, rowMax) + 1) *
      (Math.max(columnMin, columnMax) - Math.min(columnMin, columnMax) + 1),

    descriptorOnly: true,
    fullEnumerationIncludedHere: false,
    runtimeActivationClaim: false
  });
}

export const H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS = Object.freeze({
  ZONE_001_FOREGROUND_INSPECTION_ZONE: Object.freeze({
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    zoneName: 'Foreground Inspection Zone',
    baselineLabel: 'Foreground Inspection Zone',
    baselineRole: 'bounded local inspection',
    baselineAllowedUse: 'Inspect Ground target area',
    addressRegionId: 'H_EARTH_ZONE_001_FOREGROUND_INSPECTION_ADDRESS_REGION',
    primaryRows: Object.freeze([1, 2, 3, 4, 5]),
    primaryColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    addressRange: makeAddressRange(1, 5, 1, 12),
    primaryAddress: makeCellAddress(3, 8),
    supportsPrimaryInspection: true,
    supportsLocalGroundRead: true,
    descriptorOnly: true
  }),

  ZONE_002_SHORELINE_CONTACT_ZONE: Object.freeze({
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    zoneName: 'Shoreline Contact Zone',
    baselineLabel: 'Shoreline Contact Zone',
    baselineRole: 'local shoreline contact only, non-simulated',
    baselineAllowedUse: 'bounded environmental context for moisture and waterContact',
    addressRegionId: 'H_EARTH_ZONE_002_SHORELINE_CONTACT_ADDRESS_REGION',
    primaryRows: Object.freeze([4, 5, 6, 7, 8]),
    primaryColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
    addressRange: makeAddressRange(4, 8, 1, 15),
    primaryAddress: makeCellAddress(6, 8),
    supportsPrimaryInspection: false,
    supportsLocalGroundRead: true,
    descriptorOnly: true
  }),

  ZONE_003_WATER_SURFACE_ZONE: Object.freeze({
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    zoneName: 'Water Surface Zone',
    baselineLabel: 'Water Surface Zone',
    baselineRole: 'context only',
    baselineAllowedUse: 'water surface reference for Ground Condition Read',
    addressRegionId: 'H_EARTH_ZONE_003_WATER_SURFACE_ADDRESS_REGION',
    primaryRows: Object.freeze([7, 8, 9, 10, 11, 12, 13]),
    primaryColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    addressRange: makeAddressRange(7, 13, 1, 16),
    primaryAddress: makeCellAddress(10, 9),
    supportsPrimaryInspection: false,
    supportsLocalGroundRead: false,
    descriptorOnly: true
  }),

  ZONE_004_MANOR_CONTEXT_ZONE: Object.freeze({
    zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE',
    zoneName: 'Manor Context Zone',
    baselineLabel: 'Manor Context Zone',
    baselineRole: 'manor exterior context only',
    baselineAllowedUse: 'Hearth-visible support/control context',
    addressRegionId: 'H_EARTH_ZONE_004_MANOR_CONTEXT_ADDRESS_REGION',
    primaryRows: Object.freeze([5, 6, 7, 8, 9, 10, 11, 12]),
    primaryColumns: Object.freeze([11, 12, 13, 14, 15, 16]),
    addressRange: makeAddressRange(5, 12, 11, 16),
    primaryAddress: makeCellAddress(8, 14),
    supportsPrimaryInspection: false,
    supportsLocalGroundRead: false,
    descriptorOnly: true
  }),

  ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: Object.freeze({
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    zoneName: 'Distant World Context Zone',
    baselineLabel: 'Distant World Context Zone',
    baselineRole: 'distant world visual/context only',
    baselineAllowedUse: 'Audralia / planetary-world continuity context',
    addressRegionId: 'H_EARTH_ZONE_005_DISTANT_WORLD_CONTEXT_ADDRESS_REGION',
    primaryRows: Object.freeze([12, 13, 14, 15, 16]),
    primaryColumns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    addressRange: makeAddressRange(12, 16, 1, 16),
    primaryAddress: makeCellAddress(15, 10),
    supportsPrimaryInspection: false,
    supportsLocalGroundRead: false,
    descriptorOnly: true
  })
});

export const H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES = Object.freeze({
  foregroundGroundBoundary: Object.freeze({
    boundaryId: 'H_EARTH_FOREGROUND_GROUND_BOUNDARY',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    boundaryRole:
      'local inspectable ground-view surface boundary for first action',
    allowedActionHint: 'Inspect Ground',
    allowedReadoutHint: 'Ground Condition Read',
    traversalClaim: false,
    simulationClaim: false
  }),

  shorelineTransitionBoundary: Object.freeze({
    boundaryId: 'H_EARTH_SHORELINE_TRANSITION_BOUNDARY',
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    boundaryRole:
      'earth-water transition descriptor boundary for shoreline contact',
    allowedActionHint: 'Inspect Ground',
    allowedReadoutHint: 'Ground Condition Read',
    traversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false
  }),

  waterContextBoundary: Object.freeze({
    boundaryId: 'H_EARTH_WATER_CONTEXT_BOUNDARY',
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    boundaryRole:
      'bounded water surface context boundary, not swimming or fluid simulation',
    allowedActionHint: null,
    allowedReadoutHint: null,
    traversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false
  }),

  hearthContextBoundary: Object.freeze({
    boundaryId: 'H_EARTH_HEARTH_MANOR_CONTEXT_BOUNDARY',
    zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE',
    boundaryRole:
      'Hearth support/control context boundary, manor exterior only',
    allowedActionHint: null,
    allowedReadoutHint: null,
    hearthContextOnly: true,
    manorInteriorAccessClaim: false,
    matrixCollapse: false
  }),

  audraliaContextBoundary: Object.freeze({
    boundaryId: 'H_EARTH_AUDRALIA_DISTANT_CONTEXT_BOUNDARY',
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    boundaryRole:
      'Audralia planetary-world context boundary, distant visual context only',
    allowedActionHint: null,
    allowedReadoutHint: null,
    audraliaContextOnly: true,
    distantTraversalClaim: false,
    matrixCollapse: false
  })
});

export const H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY = Object.freeze({
  ZONE_001_FOREGROUND_INSPECTION_ZONE: Object.freeze({
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    visibleAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_004_MANOR_CONTEXT_ZONE'
    ]),
    descriptorAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_004_MANOR_CONTEXT_ZONE'
    ]),
    traversalAdjacency: Object.freeze([]),
    adjacencyCreatesTraversal: false
  }),

  ZONE_002_SHORELINE_CONTACT_ZONE: Object.freeze({
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    visibleAdjacency: Object.freeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      'ZONE_003_WATER_SURFACE_ZONE',
      'ZONE_004_MANOR_CONTEXT_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    descriptorAdjacency: Object.freeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      'ZONE_003_WATER_SURFACE_ZONE',
      'ZONE_004_MANOR_CONTEXT_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    traversalAdjacency: Object.freeze([]),
    adjacencyCreatesTraversal: false
  }),

  ZONE_003_WATER_SURFACE_ZONE: Object.freeze({
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    visibleAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    descriptorAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    traversalAdjacency: Object.freeze([]),
    adjacencyCreatesTraversal: false,
    swimmingAdjacencyClaim: false,
    fluidSimulationClaim: false
  }),

  ZONE_004_MANOR_CONTEXT_ZONE: Object.freeze({
    zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE',
    visibleAdjacency: Object.freeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    descriptorAdjacency: Object.freeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    traversalAdjacency: Object.freeze([]),
    adjacencyCreatesTraversal: false,
    hearthContextOnly: true,
    manorInteriorAccessClaim: false
  }),

  ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: Object.freeze({
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    visibleAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_003_WATER_SURFACE_ZONE',
      'ZONE_004_MANOR_CONTEXT_ZONE'
    ]),
    descriptorAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_003_WATER_SURFACE_ZONE',
      'ZONE_004_MANOR_CONTEXT_ZONE'
    ]),
    traversalAdjacency: Object.freeze([]),
    adjacencyCreatesTraversal: false,
    audraliaContextOnly: true,
    distantTraversalClaim: false
  })
});

export const H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS = Object.freeze({
  ZONE_001_FOREGROUND_INSPECTION_ZONE: Object.freeze({
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    label: 'Foreground Inspection Zone',
    role: 'bounded local inspection',
    allowedUse: 'Inspect Ground target area',

    zoneClass: 'LOCAL_GROUND_INSPECTION_ZONE',
    cellId: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    sourceRole:
      'foreground wet-sand and local surface zone supporting first action',

    addressRegion:
      H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS
        .ZONE_001_FOREGROUND_INSPECTION_ZONE,

    boundaryRole:
      H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES.foregroundGroundBoundary,

    adjacency:
      H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY
        .ZONE_001_FOREGROUND_INSPECTION_ZONE,

    expectedObjectHints: Object.freeze([
      'OBJ_001_GROUND_SPAWN_ANCHOR',
      'OBJ_002_FOREGROUND_WET_SAND',
      'OBJ_010_SMALL_BEACH_STONES',
      'OBJ_011_FOREGROUND_JAGGED_ROCKS'
    ]),

    expectedPrimaryInspectionObjectHint: 'OBJ_002_FOREGROUND_WET_SAND',

    inspectGroundAllowed: true,
    openWorldTraversalAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,

    capabilities: Object.freeze({
      inspectableGroundContext: true,
      selectableDescriptorContext: true,
      supportsGroundConditionRead: true,
      supportsGroundInspectionReceipt: true,

      contextOnly: false,
      traversalAuthorized: false,
      movementAuthorized: false,
      gameplayAuthorized: false,
      survivalSimulationAuthorized: false,
      rendererActivationAuthorized: false
    }),

    boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
  }),

  ZONE_002_SHORELINE_CONTACT_ZONE: Object.freeze({
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    label: 'Shoreline Contact Zone',
    role: 'local shoreline contact only, non-simulated',
    allowedUse: 'bounded environmental context for moisture and waterContact',

    zoneClass: 'EARTH_WATER_TRANSITION_ZONE',
    cellId: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    sourceRole:
      'shoreline contact zone for dry sand, tide-pool, foam, and nearshore relation',

    addressRegion:
      H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS
        .ZONE_002_SHORELINE_CONTACT_ZONE,

    boundaryRole:
      H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES.shorelineTransitionBoundary,

    adjacency:
      H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY
        .ZONE_002_SHORELINE_CONTACT_ZONE,

    expectedObjectHints: Object.freeze([
      'OBJ_003_DRY_SAND_TRANSITION',
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_006_NEARSHORE_WAVE_BAND'
    ]),

    expectedSupportingInspectionObjectHints: Object.freeze([
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      'OBJ_005_SHORELINE_FOAM_LINE'
    ]),

    inspectGroundAllowed: true,
    fullFluidSimulationAuthorized: false,
    waterTraversalAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,

    capabilities: Object.freeze({
      inspectableGroundContext: true,
      selectableDescriptorContext: true,
      supportsGroundConditionRead: true,
      supportsGroundInspectionReceipt: false,

      contextOnly: false,
      shorelineTransitionOnly: true,
      traversalAuthorized: false,
      swimmingAuthorized: false,
      fluidSimulationAuthorized: false,
      survivalSimulationAuthorized: false,
      rendererActivationAuthorized: false
    }),

    boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
  }),

  ZONE_003_WATER_SURFACE_ZONE: Object.freeze({
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    label: 'Water Surface Zone',
    role: 'context only',
    allowedUse: 'water surface reference for Ground Condition Read',

    zoneClass: 'WATER_CONTEXT_ZONE',
    cellId: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    sourceRole:
      'bounded water surface and nearshore visual context without water traversal',

    addressRegion:
      H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS
        .ZONE_003_WATER_SURFACE_ZONE,

    boundaryRole:
      H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES.waterContextBoundary,

    adjacency:
      H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY
        .ZONE_003_WATER_SURFACE_ZONE,

    expectedObjectHints: Object.freeze([
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE',
      'OBJ_008_AIR_HAZE_LIGHT_LAYER'
    ]),

    inspectGroundAllowed: false,
    swimmingAuthorized: false,
    waterTraversalAuthorized: false,
    fullFluidSimulationAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,

    capabilities: Object.freeze({
      inspectableGroundContext: false,
      selectableDescriptorContext: true,
      supportsGroundConditionRead: false,
      supportsGroundInspectionReceipt: false,

      contextOnly: true,
      waterContextOnly: true,
      traversalAuthorized: false,
      swimmingAuthorized: false,
      fluidSimulationAuthorized: false,
      weatherSimulationAuthorized: false,
      survivalSimulationAuthorized: false,
      rendererActivationAuthorized: false
    }),

    boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
  }),

  ZONE_004_MANOR_CONTEXT_ZONE: Object.freeze({
    zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE',
    label: 'Manor Context Zone',
    role: 'manor exterior context only',
    allowedUse: 'Hearth-visible support/control context',

    zoneClass: 'HEARTH_SUPPORT_CONTROL_CONTEXT_ZONE',
    cellId: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    sourceRole:
      'Hearth support/control context as manor exterior silhouette only',

    addressRegion:
      H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS
        .ZONE_004_MANOR_CONTEXT_ZONE,

    boundaryRole:
      H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES.hearthContextBoundary,

    adjacency:
      H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY
        .ZONE_004_MANOR_CONTEXT_ZONE,

    expectedObjectHints: Object.freeze([
      'OBJ_009_MANOR_EXTERIOR_CONTEXT'
    ]),

    hearthMergedIntoHEarth: false,
    manorInteriorAccessAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,

    capabilities: Object.freeze({
      inspectableGroundContext: false,
      selectableDescriptorContext: true,
      supportsGroundConditionRead: false,
      supportsGroundInspectionReceipt: false,

      contextOnly: true,
      hearthContextOnly: true,
      manorExteriorOnly: true,
      traversalAuthorized: false,
      manorInteriorAccessAuthorized: false,
      survivalSimulationAuthorized: false,
      rendererActivationAuthorized: false,
      matrixCollapse: false
    }),

    mirrorManorStatus: 'STRATEGICALLY_IMPLIED_NOT_ROUTE_CANON_NAMED',
    mirrorManorStrategicallyImplied: true,
    mirrorManorRouteCanonNamed: false,

    boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
  }),

  ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: Object.freeze({
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    label: 'Distant World Context Zone',
    role: 'distant world visual/context only',
    allowedUse: 'Audralia / planetary-world continuity context',

    zoneClass: 'AUDRALIA_PLANETARY_WORLD_CONTEXT_ZONE',
    cellId: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    sourceRole:
      'Audralia planetary-world context as distant visual context only',

    addressRegion:
      H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS
        .ZONE_005_DISTANT_WORLD_CONTEXT_ZONE,

    boundaryRole:
      H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES.audraliaContextBoundary,

    adjacency:
      H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY
        .ZONE_005_DISTANT_WORLD_CONTEXT_ZONE,

    expectedObjectHints: Object.freeze([
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ]),

    audraliaMergedIntoHEarth: false,
    distantTraversalAuthorized: false,
    openWorldTraversalAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,

    capabilities: Object.freeze({
      inspectableGroundContext: false,
      selectableDescriptorContext: true,
      supportsGroundConditionRead: false,
      supportsGroundInspectionReceipt: false,

      contextOnly: true,
      audraliaContextOnly: true,
      distantVisualContextOnly: true,
      traversalAuthorized: false,
      distantTraversalAuthorized: false,
      openWorldTraversalAuthorized: false,
      survivalSimulationAuthorized: false,
      rendererActivationAuthorized: false,
      matrixCollapse: false
    }),

    boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
  })
});

/**
 * Baseline export renewed.
 * The original scratch file exported H_EARTH_GROUND_CELL_001_ZONES as an
 * array. This file preserves that array shape for compatibility while also
 * exposing keyed descriptor maps for downstream source renewal.
 */
export const H_EARTH_GROUND_CELL_001_ZONES = Object.freeze([
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS.ZONE_001_FOREGROUND_INSPECTION_ZONE,
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS.ZONE_002_SHORELINE_CONTACT_ZONE,
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS.ZONE_003_WATER_SURFACE_ZONE,
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS.ZONE_004_MANOR_CONTEXT_ZONE,
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS.ZONE_005_DISTANT_WORLD_CONTEXT_ZONE
]);

export const H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL = Object.freeze({
  modelId: 'H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL',
  status: 'LAWFUL_DESCRIPTOR_OVERLAPS_DEFINED',

  overlaps: Object.freeze([
    Object.freeze({
      overlapId: 'FOREGROUND_TO_SHORELINE_OVERLAP',
      zones: Object.freeze([
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',
        'ZONE_002_SHORELINE_CONTACT_ZONE'
      ]),
      rows: Object.freeze([4, 5]),
      columns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
      reason:
        'wet sand / dry sand / shoreline transition may share local surface descriptors',
      traversalClaim: false,
      simulationClaim: false
    }),

    Object.freeze({
      overlapId: 'SHORELINE_TO_WATER_OVERLAP',
      zones: Object.freeze([
        'ZONE_002_SHORELINE_CONTACT_ZONE',
        'ZONE_003_WATER_SURFACE_ZONE'
      ]),
      rows: Object.freeze([7, 8]),
      columns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
      reason:
        'foam line, tide pools, nearshore wave band, and water surface cues overlap as descriptor boundaries',
      swimmingClaim: false,
      fluidSimulationClaim: false
    }),

    Object.freeze({
      overlapId: 'SHORELINE_TO_MANOR_CONTEXT_OVERLAP',
      zones: Object.freeze([
        'ZONE_002_SHORELINE_CONTACT_ZONE',
        'ZONE_004_MANOR_CONTEXT_ZONE'
      ]),
      rows: Object.freeze([5, 6, 7, 8]),
      columns: Object.freeze([11, 12, 13, 14, 15]),
      reason:
        'manor exterior remains visible from shoreline context without creating access',
      manorInteriorAccessClaim: false,
      matrixCollapse: false
    }),

    Object.freeze({
      overlapId: 'WATER_TO_DISTANT_CONTEXT_OVERLAP',
      zones: Object.freeze([
        'ZONE_003_WATER_SURFACE_ZONE',
        'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
      ]),
      rows: Object.freeze([12, 13]),
      columns: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
      reason:
        'water surface and distant context meet at horizon compression boundary',
      distantTraversalClaim: false,
      openWorldTraversalClaim: false
    })
  ]),

  overlapCreatesTraversal: false,
  overlapCreatesSimulation: false,
  overlapCreatesVisualPass: false,
  overlapCreatesValidation: false,

  boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
});

export const H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION = Object.freeze({
  expectationId: 'H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION',
  status: 'OBJECT_FILE_EXPECTATIONS_DEFINED_DESCRIPTOR_ONLY',

  expectedRoom3ObjectFile:
    '/h-earth-3d/objects/ground-cell-001.objects.js',

  expectedRoom3ObjectStep:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  expectedObjectsByZone: Object.freeze({
    ZONE_001_FOREGROUND_INSPECTION_ZONE: Object.freeze([
      'OBJ_001_GROUND_SPAWN_ANCHOR',
      'OBJ_002_FOREGROUND_WET_SAND',
      'OBJ_010_SMALL_BEACH_STONES',
      'OBJ_011_FOREGROUND_JAGGED_ROCKS'
    ]),

    ZONE_002_SHORELINE_CONTACT_ZONE: Object.freeze([
      'OBJ_003_DRY_SAND_TRANSITION',
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_006_NEARSHORE_WAVE_BAND'
    ]),

    ZONE_003_WATER_SURFACE_ZONE: Object.freeze([
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE',
      'OBJ_008_AIR_HAZE_LIGHT_LAYER'
    ]),

    ZONE_004_MANOR_CONTEXT_ZONE: Object.freeze([
      'OBJ_009_MANOR_EXTERIOR_CONTEXT'
    ]),

    ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: Object.freeze([
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ])
  }),

  expectedTotalCanonicalObjects: 12,

  objectMappingCompletedHere: false,
  objectCompressionCompletedHere: false,
  objectAddressRegionsFinalizedHere: false,

  boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
});

export const H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE = Object.freeze({
  interfaceId: 'H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE',
  status: 'ROOM_3_OBJECT_COMPRESSION_UNBLOCK_INTERFACE_DEFINED',

  room3ObjectFileMayProceed: true,
  requiredNextFile: '/h-earth-3d/objects/ground-cell-001.objects.js',
  requiredNextStep:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  room3ObjectFileMayConsume: Object.freeze([
    'H_EARTH_ZONE_BOUNDARIES',
    'H_EARTH_GROUND_CELL_001_ZONES',
    'H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS',
    'H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS',
    'H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES',
    'H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY',
    'H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL',
    'H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION',
    'H_EARTH_GROUND_CELL_001_ZONES_RECEIPT'
  ]),

  room3ObjectFileAllowedWork: Object.freeze([
    'compress existing 12 object identities onto lattice-aware zone descriptors',
    'bind each source object to a zone-authorized address region',
    'preserve OBJ_001 as spawn anchor hint',
    'preserve OBJ_002 as primary inspection object',
    'preserve supporting inspection object identities',
    'preserve dry sand as secondary surface context',
    'preserve water and air as context-only descriptors',
    'preserve manor as Hearth support/control context only',
    'preserve distant rocks/islets as Audralia planetary-world context only',
    'prepare later inspection-anchor mapping without defining action behavior'
  ]),

  room3ObjectFileNotAuthorized: Object.freeze([
    'create new canonical objects',
    'activate lattice',
    'create traversal grid',
    'create route navigation mesh',
    'create renderer geometry',
    'create material channels',
    'define action behavior',
    'define readout payloads',
    'create runtime receipts',
    'claim visual pass',
    'claim validation',
    'claim production',
    'collapse matrices'
  ]),

  downstreamHoldStates: Object.freeze({
    room4ActionsMayProceedNow: false,
    room4HoldReason:
      'Room 4 actions must wait until Room 3 object compression and anchor mapping surfaces are complete.',
    room5ReadoutsMayProceedNow: false,
    room5HoldReason:
      'Room 5 readouts must wait until Room 3 object compression and action reference surfaces are complete.',
    room6ReceiptsMayProceedNow: false,
    room6HoldReason:
      'Room 6 receipts must wait until Room 3, Room 4, and Room 5 renew owned source authority surfaces.'
  }),

  routeMayProceedNow: false,
  routeHoldReason:
    'Route-side renewal remains held until source renewal chain completes and handoff authority is issued.',

  boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
});

export const H_EARTH_GROUND_CELL_001_ALLOWED_ZONE_ACTIONS = Object.freeze({
  ZONE_001_FOREGROUND_INSPECTION_ZONE: Object.freeze([
    'Inspect Ground'
  ]),

  ZONE_002_SHORELINE_CONTACT_ZONE: Object.freeze([
    'Inspect Ground'
  ]),

  ZONE_003_WATER_SURFACE_ZONE: Object.freeze([]),
  ZONE_004_MANOR_CONTEXT_ZONE: Object.freeze([]),
  ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: Object.freeze([])
});

export const H_EARTH_GROUND_CELL_001_BLOCKED_ZONE_ACTIONS = Object.freeze({
  allZones: Object.freeze([
    'Start Open World Movement',
    'Start Survival Simulation',
    'Activate Renderer',
    'Activate WebGL',
    'Activate Canvas',
    'Claim Renderer Pass',
    'Claim Visual Pass',
    'Claim Validation',
    'Claim Production',
    'Collapse Matrices'
  ]),

  ZONE_003_WATER_SURFACE_ZONE: Object.freeze([
    'Start Swimming',
    'Activate Fluid Simulation',
    'Traverse Water Surface'
  ]),

  ZONE_004_MANOR_CONTEXT_ZONE: Object.freeze([
    'Enter Manor Interior',
    'Merge Hearth Into H-Earth',
    'Collapse Matrices'
  ]),

  ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: Object.freeze([
    'Traverse Distant World',
    'Start Open World Movement',
    'Load Audralia World Map',
    'Collapse Matrices'
  ])
});

export const H_EARTH_GROUND_CELL_001_ZONES_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_GROUND_CELL_001_ZONES_RECEIPT',

  contractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  file: '/h-earth-3d/zones/ground-cell-001.zones.js',
  room: 'ROOM_3_ENVIRONMENT',

  status: 'GROUND_CELL_001_ZONES_RENEWED_FROM_DRIVE_SCRATCH_AND_BOUND_TO_CELL_LATTICE_DESCRIPTOR_ONLY',

  upstreamMatrixFile: '/h-earth-3d/h-earth.matrix.js',
  upstreamMatrixContract:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',
  upstreamCellFile: '/h-earth-3d/cells/ground-cell-001.js',
  upstreamCellContract:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  upstreamMatrixReceipt: getHEarthMatrixReceipt(),
  upstreamCellReceipt: getHEarthGroundCell001Receipt(),
  upstreamRoom3UnblockReceipt: getHEarthRoom3UnblockReceipt(),

  driveScratchBaselineConsumed: true,
  baselineZoneBoundaryExportPreserved: true,
  baselineFiveZoneArrayExportPreserved: true,
  baselineZoneMapOnlyStatusPreserved: true,
  baselineNoRuntimeRendererVisualValidationClaimsPreserved: true,

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  sourceLatticeAuthorityConsumed: true,
  sourceLatticeAuthorityCreatedHere: false,
  cellLatticeBindingConsumed: true,
  cellLatticeBindingCreatedHere: false,

  latticeShape: '16x16',
  rowCount: 16,
  columnCount: 16,
  addressCount: 256,
  addressFormat: 'H_EARTH_GROUND_CELL_001:R{row}:C{column}',

  sourceZoneMapDefined: true,
  zoneCount: 5,
  fiveZoneIdentitiesPreserved: true,
  zoneAddressRegionsDefined: true,
  zoneBoundaryRolesDefined: true,
  zoneAdjacencyDefined: true,
  zoneOverlapModelDefined: true,
  zoneToObjectExpectationDefined: true,
  objectCompressionUnblocked: true,

  zoneIds: Object.freeze([
    'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    'ZONE_002_SHORELINE_CONTACT_ZONE',
    'ZONE_003_WATER_SURFACE_ZONE',
    'ZONE_004_MANOR_CONTEXT_ZONE',
    'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
  ]),

  objectMappingCompletedHere: false,
  materialChannelsCompletedHere: false,
  inspectionAnchorMappingCompletedHere: false,
  actionMappingCompletedHere: false,
  readoutMappingCompletedHere: false,
  receiptHandoffCompletedHere: false,
  routeExposureCompletedHere: false,

  room3ObjectFileMayProceed: true,
  room3NextFile: '/h-earth-3d/objects/ground-cell-001.objects.js',
  room3NextStep:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  room4MayProceedNow: false,
  room5MayProceedNow: false,
  room6MayProceedNow: false,
  routeMayProceedNow: false,

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
});

export const H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT',

  contractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  status: 'ROOM_3_OBJECT_COMPRESSION_UNBLOCKED_BY_LATTICE_ZONE_MAPPING',

  sourceMatrixAuthorityReady: true,
  sourceLatticeAuthorityDefined: true,
  cellLatticeBindingComplete: true,
  zoneLatticeMappingComplete: true,
  driveScratchZoneBaselinePreserved: true,

  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  requiredRoom3ObjectFile:
    '/h-earth-3d/objects/ground-cell-001.objects.js',

  requiredRoom3ObjectStep:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  room3ObjectFileAllowedWork:
    H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE
      .room3ObjectFileAllowedWork,

  room3ObjectFileNotAuthorized:
    H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE
      .room3ObjectFileNotAuthorized,

  sourceAuthorityExports: Object.freeze([
    'H_EARTH_ZONE_BOUNDARIES',
    'H_EARTH_GROUND_CELL_001_ZONES',
    'H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS',
    'H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS',
    'H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES',
    'H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY',
    'H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL',
    'H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION',
    'H_EARTH_GROUND_CELL_001_ZONES_RECEIPT'
  ]),

  boundary: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS
});

export function getHEarthGroundCell001ZoneDescriptor(zoneId) {
  if (!zoneId || typeof zoneId !== 'string') return null;
  return H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS[zoneId] || null;
}

export function getHEarthGroundCell001ZoneAddressRegion(zoneId) {
  if (!zoneId || typeof zoneId !== 'string') return null;
  return H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS[zoneId] || null;
}

export function getHEarthGroundCell001ZoneAdjacency(zoneId) {
  if (!zoneId || typeof zoneId !== 'string') return null;
  return H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY[zoneId] || null;
}

export function getHEarthGroundCell001ZonesReceipt() {
  return H_EARTH_GROUND_CELL_001_ZONES_RECEIPT;
}

export function getHEarthRoom3ObjectMappingUnblockReceipt() {
  return H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT;
}

export function isHEarthGroundCell001ZoneId(zoneId) {
  return Boolean(getHEarthGroundCell001ZoneDescriptor(zoneId));
}

export function getHEarthGroundCell001ExpectedObjectsForZone(zoneId) {
  const expected =
    H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION
      .expectedObjectsByZone[zoneId];

  return expected || Object.freeze([]);
}

export const H_EARTH_GROUND_CELL_001_ZONES_AGGREGATE = Object.freeze({
  id: 'H_EARTH_GROUND_CELL_001_ZONES_AGGREGATE',
  file: '/h-earth-3d/zones/ground-cell-001.zones.js',
  room: 'ROOM_3_ENVIRONMENT',
  step:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  contract: H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,

  baselinePreserved: Object.freeze({
    H_EARTH_ZONE_BOUNDARIES,
    H_EARTH_GROUND_CELL_001_ZONES
  }),

  upstreamMatrixAuthority: getHEarthSourceLatticeAuthority(),
  upstreamMatrixReceipt: getHEarthMatrixReceipt(),
  upstreamSourceLatticeAddressFieldSchema:
    getHEarthSourceLatticeAddressFieldSchema(),
  upstreamGroundCell001LatticeScope:
    getHEarthGroundCell001LatticeScope(),

  upstreamCell: H_EARTH_GROUND_CELL_001,
  upstreamCellContract: H_EARTH_GROUND_CELL_001_CONTRACT,
  upstreamCellSceneBinding: H_EARTH_GROUND_CELL_001_SCENE_BINDING,
  upstreamCellLatticeBinding: getHEarthGroundCell001LatticeBinding(),
  upstreamCellAddressFieldSummary: getHEarthGroundCell001AddressFieldSummary(),
  upstreamCellSpawnAnchorScope: H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,
  upstreamCellReceipt: H_EARTH_GROUND_CELL_001_RECEIPT,
  upstreamRoom3UnblockReceipt: H_EARTH_ROOM_3_UNBLOCK_RECEIPT,

  zoneIds: H_EARTH_GROUND_CELL_001_ZONE_IDS,
  mappingModel: H_EARTH_GROUND_CELL_001_ZONE_MAPPING_MODEL,
  regionRules: H_EARTH_GROUND_CELL_001_ZONE_REGION_RULES,
  addressRegions: H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS,
  boundaryRoles: H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES,
  adjacency: H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY,
  descriptors: H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
  overlapModel: H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL,
  zoneToObjectExpectation: H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION,
  downstreamInterface: H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE,

  allowedZoneActions: H_EARTH_GROUND_CELL_001_ALLOWED_ZONE_ACTIONS,
  blockedZoneActions: H_EARTH_GROUND_CELL_001_BLOCKED_ZONE_ACTIONS,

  receipt: H_EARTH_GROUND_CELL_001_ZONES_RECEIPT,
  objectMappingUnblockReceipt: H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT,

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  boundaryFlags: H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS,

  getHEarthGroundCell001ZoneDescriptor,
  getHEarthGroundCell001ZoneAddressRegion,
  getHEarthGroundCell001ZoneAdjacency,
  getHEarthGroundCell001ZonesReceipt,
  getHEarthRoom3ObjectMappingUnblockReceipt,
  isHEarthGroundCell001ZoneId,
  getHEarthGroundCell001ExpectedObjectsForZone
});

export default H_EARTH_GROUND_CELL_001_ZONES_AGGREGATE;
