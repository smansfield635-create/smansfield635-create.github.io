/**
 * DGB_H_EARTH_SCRATCH_REBUILD — Step 034J
 * File: /h-earth-3d/objects/ground-cell-001.objects.js
 *
 * COMPLETE PROVENANCE-ALIGNED FILE
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2
 *
 * Directly renews:
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1
 *
 * Exact historical object-composition lineage:
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1
 *
 * Active governing zone authority:
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1
 *
 * Exact historical zone-composition lineage:
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1
 *
 * Retired compatibility lineage preserved:
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1
 *
 * Narrow provenance-integration correction:
 * - Preserves H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL.
 * - Preserves H_EARTH_GROUND_CELL_001_OBJECT_COMPRESSION_MODEL.
 * - Preserves aggregate compositionModel and compressionModel aliases.
 * - Uses OBJECT_AUTHORITY_PUBLIC_STAGE_READABILITY_ALIGNMENT.
 * - Preserves the static Step 034I authority reference.
 * - Aligns active upstream zone authority to Step 034K.
 * - Preserves Step 011B as historical zone lineage only.
 * - Preserves Step 011C as historical object lineage only.
 * - Preserves exact Step 031C and Step 031D retired compatibility identities.
 * - Applies PRIMARY_ZONE_MEMBERSHIP_ONLY to OBJECTS_BY_ZONE.
 * - Preserves OBJ_006 outside the Zone 002 primary-zone index.
 * - Preserves OBJ_003 as visible-only secondary surface context.
 * - Preserves the populated Step 011C legacy address arrays.
 * - Preserves the corrected receipt path:
 *   /h-earth-3d/h-earth.receipts.js
 * - Preserves supporting-inspection authority field identities:
 *   supportingInspectionTargetsPublicReadable
 *   supportingInspectionTargetsReadabilityDefinedByStep034J
 *   supportingInspectionTargetsReadabilityConsistentWithStep034IObjectScope
 *
 * Governing public-stage boundary authority:
 * /h-earth-3d/boundaries/matrix-boundaries.js
 * H_EARTH_MATRIX_BOUNDARIES_FILE_RENEWAL_STEP_034I_PUBLIC_STAGE_AUTHORITY_AMENDMENT_v1
 * Revision: 1.1-consistency-pass
 *
 * Source class:
 * OBJECT_AUTHORITY_PUBLIC_STAGE_READABILITY_ALIGNMENT
 *
 * External evidence rule:
 * - Backup evidence is owned externally.
 * - Drive document identity is owned externally.
 * - Connector readback evidence is owned externally.
 * - Import-resolution evidence is owned externally.
 * - Module-graph evidence is owned externally.
 * - Execution evidence is owned externally.
 * - Route-integration evidence is owned externally.
 * - Digest evidence is owned externally.
 * - Replay evidence is owned externally.
 * - Installation and admission results are owned externally.
 * - Exact baseline-diff and legacy-array-equivalence results are owned externally.
 *
 * Step 034J aligns beneath Step 034I.
 * Step 034J consumes Step 034K as the active governing zone authority.
 * Step 034J does not create independent public-stage authority.
 *
 * This file feeds visualization descriptors.
 * This file does not render visualization.
 *
 * This file does not create DOM, CSS, geometry, canvas, WebGL, SVG, iframe,
 * renderer, runtime, route, traversal, action execution, readout execution,
 * receipt persistence, validation, production, deployment, or matrix collapse.
 */

import {
  H_EARTH_GROUND_CELL_001,
  H_EARTH_GROUND_CELL_001_CONTRACT,
  H_EARTH_GROUND_CELL_001_PATH3_BINDING,
  H_EARTH_GROUND_CELL_001_SCENE_BINDING,
  H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,
  H_EARTH_GROUND_CELL_001_BOUNDARY_FLAGS,
  H_EARTH_GROUND_CELL_001_RECEIPT,
  H_EARTH_ROOM_3_UNBLOCK_RECEIPT,
  getHEarthGroundCell001Receipt,
  getHEarthGroundCell001Path3Binding,
  getHEarthGroundCell001SceneBinding,
  getHEarthGroundCell001SpawnAnchorScope,
  getHEarthRoom3UnblockReceipt
} from '../cells/ground-cell-001.js';

import {
  H_EARTH_ZONE_BOUNDARIES,
  H_EARTH_GROUND_CELL_001_ZONES,
  H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,
  H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS,
  H_EARTH_GROUND_CELL_001_ZONE_IDS,
  H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES,
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
  H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION,
  H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE,
  H_EARTH_GROUND_CELL_001_ZONES_RECEIPT,
  H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT,
  getHEarthGroundCell001ZoneDescriptor,
  getHEarthGroundCell001ZonesReceipt,
  getHEarthRoom3ObjectMappingUnblockReceipt,
  isHEarthGroundCell001ZoneId,
  getHEarthGroundCell001ExpectedObjectsForZone
} from '../zones/ground-cell-001.zones.js';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);

function freezeObject(value = {}) {
  return Object.freeze(
    value && typeof value === 'object' && !Array.isArray(value)
      ? { ...value }
      : {}
  );
}

function normalizeObjectId(objectId) {
  return typeof objectId === 'string' ? objectId.trim() : '';
}

function normalizeRole(role) {
  return typeof role === 'string' ? role.trim() : '';
}

function getZoneDescriptorSafely(zoneId) {
  if (!zoneId || typeof zoneId !== 'string') return null;

  try {
    return getHEarthGroundCell001ZoneDescriptor(zoneId) || null;
  } catch {
    return null;
  }
}

export const H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE =
  Object.freeze({
    file: '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/boundaries/matrix-boundaries.js',

    contractId:
      'H_EARTH_MATRIX_BOUNDARIES_FILE_RENEWAL_STEP_034I_PUBLIC_STAGE_AUTHORITY_AMENDMENT_v1',

    revision: '1.1-consistency-pass',

    sourceClass:
      'BOUNDARY_AUTHORITY_PUBLIC_STAGE_ALIGNMENT',

    authorityCreatedHere: false,
    authorityImportedHere: false,
    importPerformedHere: false,

    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,

    referencedAdmission: Object.freeze({
      objectDescriptorProjectionAllowed: true,
      primaryInspectionObjectPublicReadable: true,
      contextOnlyObjectsPublicVisibleAsContext: true,
      cssDescriptorClassProjectionAllowed: true,
      dataAttributeDescriptorProjectionAllowed: true,
      secondarySurfaceContextPublicReadable: false
    }),

    step034JReadabilityDefinition: Object.freeze({
      supportingInspectionTargetsPublicReadable: true,
      supportingInspectionTargetsReadabilityDefinedByStep034J: true,
      supportingInspectionTargetsReadabilityConsistentWithStep034IObjectScope:
        true
    }),

    referencedInvariants: Object.freeze({
      descriptorPresentationOnly: true,
      descriptorMountIsRendererActivation: false,
      descriptorMountIsRendererProof: false,
      descriptorMountIsRendererPass: false,
      descriptorMountIsVisualPassProof: false,
      descriptorMountIsValidationProof: false,
      descriptorMountIsProductionProof: false,
      descriptorMountIsRuntimeExecution: false,
      descriptorMountIsTraversalAuthority: false,
      descriptorMountIsSimulationAuthority: false,
      descriptorMountIsMatrixCollapse: false
    }),

    boundaryStatement:
      'Step 034J aligns object descriptors beneath Step 034I and does not independently create public-stage authority.'
  });

export const H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT =
  Object.freeze({
    contractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2',

    currentStep:
      'STEP_034J_OBJECTS_PUBLIC_STAGE_READABILITY_AMENDMENT_V2_PROVENANCE_ALIGNMENT',

    renewsContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

    directRenewedFromContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

    exactHistoricalObjectLineageContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

    activeGoverningZoneContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    exactHistoricalZoneLineageContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

    retiredZoneCompatibilityContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

    compatibilityBaselineContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

    governingBoundaryContractId:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE.contractId,

    governingBoundaryRevision:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE.revision,

    upstreamCellContractId:
      'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_011A_PATH3_DOMAIN_BINDING_CONSUMER_v1',

    upstreamZoneContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    historicalLineage: Object.freeze({
      objects:
        'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

      zones:
        'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1'
    }),

    retiredCompatibilityLineage: Object.freeze({
      zones:
        'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

      objects:
        'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1'
    }),

    file:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/objects/ground-cell-001.objects.js',

    upstreamCellFile:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/cells/ground-cell-001.js',

    upstreamZoneFile:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/zones/ground-cell-001.zones.js',

    governingBoundaryFile:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE.file,

    sourceRoot: '/h-earth-3d/',
    project: 'H_EARTH_3D_SCRATCH_DOMAIN',
    room: 'ROOM_3_ENVIRONMENT',
    lane: 'OBJECT_ZONE_AUDIT_LANE',

    sourceClass:
      'OBJECT_AUTHORITY_PUBLIC_STAGE_READABILITY_ALIGNMENT',

    fileClass:
      'OBJECT_AUTHORITY_PUBLIC_STAGE_READABILITY_ALIGNMENT',

    status:
      'SOURCE_DESCRIPTOR_AUTHORITY_PROVENANCE_ALIGNED',

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    firstAction: 'Inspect Ground',
    firstReadout: 'Ground Condition Read',
    firstReceipt:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    publicStageReadabilityAlignment: true,
    publicStageAuthorityCreatedHere: false,
    step034IPublicStageAuthorityConsumed: true,
    step034IDirectImportPerformed: false,
    step034KActiveZoneAuthorityConsumed: true,

    objectsByZoneMembershipPolicy:
      'PRIMARY_ZONE_MEMBERSHIP_ONLY',

    secondaryMembershipSource:
      'H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS.secondaryZoneId',

    backupEvidenceOwnedExternally: true,
    driveOccurrenceEvidenceOwnedExternally: true,
    connectorReadbackEvidenceOwnedExternally: true,
    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    digestEvidenceOwnedExternally: true,
    replayEvidenceOwnedExternally: true,
    installationEvidenceOwnedExternally: true,
    admissionEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    legacyAddressEquivalenceEvidenceOwnedExternally: true,

    canonicalAnchorsPreserved: Object.freeze({
      hEarthMatrixIdentity: true,
      groundCell001Identity: true,
      twelveObjectIdentities: true,
      inspectGroundIdentity: true,
      groundConditionReadIdentity: true,
      groundInspectionReceiptIdentity: true,
      claimCeiling: true,
      terminalDefaultExport: true
    }),

    compatibilityPosture: Object.freeze({
      step011CCompositionModelExportPreserved: true,
      compressionModelExportPreserved: true,
      compositionModelAggregateAliasPreserved: true,
      compressionModelAggregateAliasPreserved: true,
      narrowContextExportMeaningPreserved: true,
      objectArrayExportPreserved: true,
      objectDescriptorRegistryExportPreserved: true,
      legacyAddressSurfacePreserved: true,
      legacySupportingAddressesPreserved: true,
      legacyAddressSurfaceActiveAuthority: false,
      legacyLatticeCompressionActiveAuthority: false,
      step011BHistoricalOnly: true,
      step011CHistoricalOnly: true,
      step031CRetiredCompatibilityOnly: true,
      step031DRetiredCompatibilityOnly: true
    }),

    authorityReference:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE
  });

export const H_EARTH_PRIMARY_INSPECTION_TARGET =
  'OBJ_002_FOREGROUND_WET_SAND';

export const H_EARTH_SUPPORTING_INSPECTION_TARGETS =
  Object.freeze([
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_005_SHORELINE_FOAM_LINE'
  ]);

export const H_EARTH_CONTEXT_OBJECTS = Object.freeze([
  'OBJ_009_MANOR_EXTERIOR_CONTEXT',
  'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
]);

export const H_EARTH_GROUND_CELL_001_OBJECT_IDS =
  Object.freeze({
    groundSpawnAnchor:
      'OBJ_001_GROUND_SPAWN_ANCHOR',

    foregroundWetSand:
      'OBJ_002_FOREGROUND_WET_SAND',

    drySandTransition:
      'OBJ_003_DRY_SAND_TRANSITION',

    tidePoolsAndReflectivePuddles:
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',

    shorelineFoamLine:
      'OBJ_005_SHORELINE_FOAM_LINE',

    nearshoreWaveBand:
      'OBJ_006_NEARSHORE_WAVE_BAND',

    waterSurfacePlane:
      'OBJ_007_WATER_SURFACE_PLANE',

    airHazeLightLayer:
      'OBJ_008_AIR_HAZE_LIGHT_LAYER',

    manorExteriorContext:
      'OBJ_009_MANOR_EXTERIOR_CONTEXT',

    smallBeachStones:
      'OBJ_010_SMALL_BEACH_STONES',

    foregroundJaggedRocks:
      'OBJ_011_FOREGROUND_JAGGED_ROCKS',

    distanceRockStacksAndIslets:
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  });

export const H_EARTH_GROUND_CELL_001_CANONICAL_OBJECT_ID_LIST =
  Object.freeze([
    'OBJ_001_GROUND_SPAWN_ANCHOR',
    'OBJ_002_FOREGROUND_WET_SAND',
    'OBJ_003_DRY_SAND_TRANSITION',
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_005_SHORELINE_FOAM_LINE',
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]);

export const H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_ROLES =
  Object.freeze({
    PRIMARY_PUBLIC_INSPECTION_OBJECT:
      'PRIMARY_PUBLIC_INSPECTION_OBJECT',

    SUPPORTING_PUBLIC_READABLE_OBJECT:
      'SUPPORTING_PUBLIC_READABLE_OBJECT',

    SECONDARY_SURFACE_CONTEXT:
      'SECONDARY_SURFACE_CONTEXT',

    CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT:
      'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

    STRUCTURAL_NOT_PUBLIC_READABLE:
      'STRUCTURAL_NOT_PUBLIC_READABLE'
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_SURFACE_CLASSES =
  Object.freeze({
    STRUCTURAL_ANCHOR:
      'STRUCTURAL_ANCHOR',

    FOREGROUND_GROUND_SURFACE:
      'FOREGROUND_GROUND_SURFACE',

    SECONDARY_GROUND_TRANSITION:
      'SECONDARY_GROUND_TRANSITION',

    REFLECTIVE_MOISTURE_DETAIL:
      'REFLECTIVE_MOISTURE_DETAIL',

    SHORELINE_CONTACT_DETAIL:
      'SHORELINE_CONTACT_DETAIL',

    NEARSHORE_WATER_CONTEXT:
      'NEARSHORE_WATER_CONTEXT',

    WATER_SURFACE_CONTEXT:
      'WATER_SURFACE_CONTEXT',

    ATMOSPHERIC_LIGHT_CONTEXT:
      'ATMOSPHERIC_LIGHT_CONTEXT',

    MANOR_EXTERIOR_CONTEXT:
      'MANOR_EXTERIOR_CONTEXT',

    SMALL_STONE_GROUND_DETAIL:
      'SMALL_STONE_GROUND_DETAIL',

    JAGGED_ROCK_GROUND_DETAIL:
      'JAGGED_ROCK_GROUND_DETAIL',

    DISTANT_ROCK_WORLD_CONTEXT:
      'DISTANT_ROCK_WORLD_CONTEXT'
  });

export const H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS =
  Object.freeze({
    sourceObjectAuthority: true,
    descriptorOnlyObjectAuthority: true,

    publicStageReadabilityAlignment: true,
    publicStageAuthorityCreatedHere: false,
    step034IPublicStageAuthorityConsumed: true,
    step034IDirectImportPerformed: false,
    step034KActiveZoneAuthorityConsumed: true,

    objectDescriptorProjectionAllowedByReferencedAuthority: true,
    primaryInspectionObjectPublicReadableByReferencedAuthority: true,

    supportingInspectionTargetsPublicReadable: true,
    supportingInspectionTargetsReadabilityDefinedByStep034J: true,
    supportingInspectionTargetsReadabilityConsistentWithStep034IObjectScope:
      true,

    contextOnlyObjectsPublicVisibleByReferencedAuthority: true,
    secondarySurfaceContextPublicReadableByReferencedAuthority: false,

    objectsByZonePrimaryMembershipOnly: true,
    secondaryZoneMembershipIndexed: false,

    canonicalMatrixIdentityPreserved: true,
    canonicalCellIdentityPreserved: true,
    canonicalObjectIdsPreserved: true,
    objectCountPreservedAtTwelve: true,

    sourceMatrixAuthorityCreatedHere: false,
    cellAuthorityCreatedHere: false,
    zoneAuthorityCreatedHere: false,
    boundaryAuthorityCreatedHere: false,
    actionAuthorityCreatedHere: false,
    readoutAuthorityCreatedHere: false,
    receiptAuthorityCreatedHere: false,
    routeAuthorityCreatedHere: false,
    rendererAuthorityCreatedHere: false,
    validationAuthorityCreatedHere: false,
    productionAuthorityCreatedHere: false,

    domNodesCreatedHere: false,
    cssOutputCreatedHere: false,
    geometryCreatedHere: false,
    canvasOutputCreatedHere: false,
    webglOutputCreatedHere: false,
    svgOutputCreatedHere: false,
    iframeOutputCreatedHere: false,

    inspectGroundExecutedHere: false,
    groundConditionReadExecutedHere: false,
    receiptPersistedHere: false,

    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    digestEvidenceOwnedExternally: true,
    replayEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    legacyAddressEquivalenceEvidenceOwnedExternally: true,

    rendererActivation: false,
    finalRendererClaim: false,
    rendererPassClaim: false,
    rendererProof: false,
    canvasActivation: false,
    webglActivation: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,

    openWorldTraversal: false,
    survivalSimulation: false,
    manorInteriorAccess: false,
    distantTraversal: false,
    swimming: false,
    fluidSimulation: false,
    matrixCollapse: false
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_ROLE_MAP =
  Object.freeze({
    OBJ_001_GROUND_SPAWN_ANCHOR:
      'STRUCTURAL_NOT_PUBLIC_READABLE',

    OBJ_002_FOREGROUND_WET_SAND:
      'PRIMARY_PUBLIC_INSPECTION_OBJECT',

    OBJ_003_DRY_SAND_TRANSITION:
      'SECONDARY_SURFACE_CONTEXT',

    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES:
      'SUPPORTING_PUBLIC_READABLE_OBJECT',

    OBJ_005_SHORELINE_FOAM_LINE:
      'SUPPORTING_PUBLIC_READABLE_OBJECT',

    OBJ_006_NEARSHORE_WAVE_BAND:
      'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

    OBJ_007_WATER_SURFACE_PLANE:
      'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

    OBJ_008_AIR_HAZE_LIGHT_LAYER:
      'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

    OBJ_009_MANOR_EXTERIOR_CONTEXT:
      'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

    OBJ_010_SMALL_BEACH_STONES:
      'SUPPORTING_PUBLIC_READABLE_OBJECT',

    OBJ_011_FOREGROUND_JAGGED_ROCKS:
      'SUPPORTING_PUBLIC_READABLE_OBJECT',

    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS:
      'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT'
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_READABILITY =
  Object.freeze({
    OBJ_001_GROUND_SPAWN_ANCHOR: false,
    OBJ_002_FOREGROUND_WET_SAND: true,
    OBJ_003_DRY_SAND_TRANSITION: false,
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: true,
    OBJ_005_SHORELINE_FOAM_LINE: true,
    OBJ_006_NEARSHORE_WAVE_BAND: false,
    OBJ_007_WATER_SURFACE_PLANE: false,
    OBJ_008_AIR_HAZE_LIGHT_LAYER: false,
    OBJ_009_MANOR_EXTERIOR_CONTEXT: false,
    OBJ_010_SMALL_BEACH_STONES: true,
    OBJ_011_FOREGROUND_JAGGED_ROCKS: true,
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: false
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_VISIBILITY =
  Object.freeze({
    OBJ_001_GROUND_SPAWN_ANCHOR: false,
    OBJ_002_FOREGROUND_WET_SAND: true,
    OBJ_003_DRY_SAND_TRANSITION: true,
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: true,
    OBJ_005_SHORELINE_FOAM_LINE: true,
    OBJ_006_NEARSHORE_WAVE_BAND: true,
    OBJ_007_WATER_SURFACE_PLANE: true,
    OBJ_008_AIR_HAZE_LIGHT_LAYER: true,
    OBJ_009_MANOR_EXTERIOR_CONTEXT: true,
    OBJ_010_SMALL_BEACH_STONES: true,
    OBJ_011_FOREGROUND_JAGGED_ROCKS: true,
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: true
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_PRIORITY =
  Object.freeze({
    OBJ_001_GROUND_SPAWN_ANCHOR: 0,
    OBJ_002_FOREGROUND_WET_SAND: 100,
    OBJ_003_DRY_SAND_TRANSITION: 55,
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: 90,
    OBJ_005_SHORELINE_FOAM_LINE: 70,
    OBJ_006_NEARSHORE_WAVE_BAND: 20,
    OBJ_007_WATER_SURFACE_PLANE: 15,
    OBJ_008_AIR_HAZE_LIGHT_LAYER: 10,
    OBJ_009_MANOR_EXTERIOR_CONTEXT: 5,
    OBJ_010_SMALL_BEACH_STONES: 85,
    OBJ_011_FOREGROUND_JAGGED_ROCKS: 80,
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: 5
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION_ORDER =
  Object.freeze([
    'OBJ_002_FOREGROUND_WET_SAND',
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_005_SHORELINE_FOAM_LINE',
    'OBJ_003_DRY_SAND_TRANSITION',
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',
    'OBJ_001_GROUND_SPAWN_ANCHOR'
  ]);

export const H_EARTH_GROUND_CELL_001_PUBLIC_STAGE_CONTEXT_OBJECTS =
  Object.freeze([
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]);

export const H_EARTH_GROUND_CELL_001_SECONDARY_SURFACE_CONTEXT_OBJECTS =
  Object.freeze([
    'OBJ_003_DRY_SAND_TRANSITION'
  ]);

export const H_EARTH_GROUND_CELL_001_STRUCTURAL_OBJECTS =
  Object.freeze([
    'OBJ_001_GROUND_SPAWN_ANCHOR'
  ]);

export const H_EARTH_GROUND_CELL_001_OBJECTS_BY_PUBLIC_STAGE_ROLE =
  Object.freeze({
    PRIMARY_PUBLIC_INSPECTION_OBJECT: Object.freeze([
      'OBJ_002_FOREGROUND_WET_SAND'
    ]),

    SUPPORTING_PUBLIC_READABLE_OBJECT: Object.freeze([
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      'OBJ_010_SMALL_BEACH_STONES',
      'OBJ_011_FOREGROUND_JAGGED_ROCKS',
      'OBJ_005_SHORELINE_FOAM_LINE'
    ]),

    SECONDARY_SURFACE_CONTEXT: Object.freeze([
      'OBJ_003_DRY_SAND_TRANSITION'
    ]),

    CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT: Object.freeze([
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE',
      'OBJ_008_AIR_HAZE_LIGHT_LAYER',
      'OBJ_009_MANOR_EXTERIOR_CONTEXT',
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ]),

    STRUCTURAL_NOT_PUBLIC_READABLE: Object.freeze([
      'OBJ_001_GROUND_SPAWN_ANCHOR'
    ])
  });

export const H_EARTH_GROUND_CELL_001_PUBLIC_OBJECTS_BY_ROLE =
  H_EARTH_GROUND_CELL_001_OBJECTS_BY_PUBLIC_STAGE_ROLE;

export const H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL =
  Object.freeze({
    modelId:
      'H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL',

    status:
      'TWELVE_OBJECT_PATH3_COMPOSITION_ALIGNED_TO_STEP_034J_PUBLIC_STAGE_READABILITY',

    sourceContractId:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.contractId,

    compatibilitySource:
      'STEP_011C_OBJECT_COMPOSITION_MODEL',

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    sourceObjectCount: 12,
    sourceZoneCount: 5,

    objectsByZoneMembershipPolicy:
      'PRIMARY_ZONE_MEMBERSHIP_ONLY',

    secondaryMembershipSource:
      'H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS.secondaryZoneId',

    primaryInspectionTarget:
      H_EARTH_PRIMARY_INSPECTION_TARGET,

    supportingInspectionTargets:
      H_EARTH_SUPPORTING_INSPECTION_TARGETS,

    legacyContextObjects:
      H_EARTH_CONTEXT_OBJECTS,

    secondarySurfaceContextObjects:
      H_EARTH_GROUND_CELL_001_SECONDARY_SURFACE_CONTEXT_OBJECTS,

    publicStageContextObjects:
      H_EARTH_GROUND_CELL_001_PUBLIC_STAGE_CONTEXT_OBJECTS,

    structuralObjects:
      H_EARTH_GROUND_CELL_001_STRUCTURAL_OBJECTS,

    publicStageRoleMap:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_ROLE_MAP,

    publicReadability:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_READABILITY,

    publicVisibility:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_VISIBILITY,

    inspectionPriority:
      H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_PRIORITY,

    projectionOrder:
      H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION_ORDER,

    compositionPrinciple:
      'The 12 canonical source objects remain primary-zone-indexed descriptor objects. Secondary zone relationships remain available only through secondaryZoneId. Step 034J aligns public-stage readability beneath Step 034I and consumes Step 034K as active zone authority without creating boundary, renderer, runtime, route, traversal, validation, production, or matrix-collapse authority.',

    publicStageReadabilityAlignment: true,
    publicStageAuthorityCreatedHere: false,
    step034IPublicStageAuthorityConsumed: true,
    step034KActiveZoneAuthorityConsumed: true,

    secondarySurfaceContextReadable: false,
    secondarySurfaceContextVisible: true,

    legacyCompressionMeaningPreservedAsAlias: true,
    latticeCompressionActiveDesignLaw: false,
    legacyAddressBindingActiveDesignLaw: false,

    objectClasses: Object.freeze({
      structuralAnchor:
        'local structural arrival reference only',

      primaryInspectionSurface:
        'primary public-readable Inspect Ground descriptor target',

      supportingInspectionSurface:
        'supporting public-readable ground and shoreline descriptor target',

      secondarySurfaceContext:
        'visible-only dry-to-wet surface transition context',

      shorelineTransition:
        'local earth-water transition descriptor only',

      waterContext:
        'context-only public-visible water descriptor',

      airContext:
        'context-only public-visible air, haze, and light descriptor',

      hearthContext:
        'context-only public-visible Hearth exterior descriptor',

      audraliaContext:
        'context-only public-visible distant Audralia descriptor'
    }),

    authorityReference:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_COMPRESSION_MODEL =
  H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL;

export const H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS =
  Object.freeze({
    OBJ_001_GROUND_SPAWN_ANCHOR: Object.freeze({
      objectId: 'OBJ_001_GROUND_SPAWN_ANCHOR',
      zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      secondaryZoneId: null,
      zoneRole: 'structural arrival reference',
      primaryZone: true,
      contextZone: false,
      descriptorOnly: true
    }),

    OBJ_002_FOREGROUND_WET_SAND: Object.freeze({
      objectId: 'OBJ_002_FOREGROUND_WET_SAND',
      zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      secondaryZoneId: null,
      zoneRole: 'primary public inspection surface',
      primaryZone: true,
      contextZone: false,
      descriptorOnly: true
    }),

    OBJ_003_DRY_SAND_TRANSITION: Object.freeze({
      objectId: 'OBJ_003_DRY_SAND_TRANSITION',
      zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
      secondaryZoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      zoneRole: 'secondary dry-to-wet surface transition',
      primaryZone: true,
      contextZone: false,
      descriptorOnly: true
    }),

    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: Object.freeze({
      objectId:
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      secondaryZoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      zoneRole:
        'supporting public-readable moisture detail',

      primaryZone: true,
      contextZone: false,
      descriptorOnly: true
    }),

    OBJ_005_SHORELINE_FOAM_LINE: Object.freeze({
      objectId:
        'OBJ_005_SHORELINE_FOAM_LINE',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      secondaryZoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      zoneRole:
        'supporting public-readable shoreline contact detail',

      primaryZone: true,
      contextZone: false,
      descriptorOnly: true
    }),

    OBJ_006_NEARSHORE_WAVE_BAND: Object.freeze({
      objectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      secondaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      zoneRole:
        'context-only nearshore water band',

      primaryZone: true,
      contextZone: true,
      descriptorOnly: true
    }),

    OBJ_007_WATER_SURFACE_PLANE: Object.freeze({
      objectId:
        'OBJ_007_WATER_SURFACE_PLANE',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      secondaryZoneId: null,

      zoneRole:
        'context-only water surface',

      primaryZone: true,
      contextZone: true,
      descriptorOnly: true
    }),

    OBJ_008_AIR_HAZE_LIGHT_LAYER: Object.freeze({
      objectId:
        'OBJ_008_AIR_HAZE_LIGHT_LAYER',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      secondaryZoneId:
        'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',

      zoneRole:
        'context-only atmospheric light layer',

      primaryZone: true,
      contextZone: true,
      descriptorOnly: true
    }),

    OBJ_009_MANOR_EXTERIOR_CONTEXT: Object.freeze({
      objectId:
        'OBJ_009_MANOR_EXTERIOR_CONTEXT',

      zoneId:
        'ZONE_004_MANOR_CONTEXT_ZONE',

      secondaryZoneId: null,

      zoneRole:
        'context-only manor exterior',

      primaryZone: true,
      contextZone: true,
      descriptorOnly: true
    }),

    OBJ_010_SMALL_BEACH_STONES: Object.freeze({
      objectId:
        'OBJ_010_SMALL_BEACH_STONES',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      secondaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      zoneRole:
        'supporting public-readable stone detail',

      primaryZone: true,
      contextZone: false,
      descriptorOnly: true
    }),

    OBJ_011_FOREGROUND_JAGGED_ROCKS: Object.freeze({
      objectId:
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      secondaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      zoneRole:
        'supporting public-readable rock detail',

      primaryZone: true,
      contextZone: false,
      descriptorOnly: true
    }),

    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS:
      Object.freeze({
        objectId:
          'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',

        zoneId:
          'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',

        secondaryZoneId: null,

        zoneRole:
          'context-only distant rock stacks and islets',

        primaryZone: true,
        contextZone: true,
        descriptorOnly: true
      })
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS =
  Object.freeze({
    OBJ_001_GROUND_SPAWN_ANCHOR: Object.freeze({
      objectId:
        'OBJ_001_GROUND_SPAWN_ANCHOR',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R03:C08',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R03:C07',
        'H_EARTH_GROUND_CELL_001:R03:C09',
        'H_EARTH_GROUND_CELL_001:R04:C08'
      ]),

      addressRole:
        'legacy-spawn-anchor-reference',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_002_FOREGROUND_WET_SAND: Object.freeze({
      objectId:
        'OBJ_002_FOREGROUND_WET_SAND',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R03:C08',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R01:C04',
        'H_EARTH_GROUND_CELL_001:R01:C08',
        'H_EARTH_GROUND_CELL_001:R01:C12',
        'H_EARTH_GROUND_CELL_001:R02:C05',
        'H_EARTH_GROUND_CELL_001:R02:C09',
        'H_EARTH_GROUND_CELL_001:R03:C06',
        'H_EARTH_GROUND_CELL_001:R03:C10',
        'H_EARTH_GROUND_CELL_001:R04:C04',
        'H_EARTH_GROUND_CELL_001:R04:C08',
        'H_EARTH_GROUND_CELL_001:R04:C12',
        'H_EARTH_GROUND_CELL_001:R05:C06',
        'H_EARTH_GROUND_CELL_001:R05:C10'
      ]),

      addressRole:
        'legacy-primary-inspection-surface',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_003_DRY_SAND_TRANSITION: Object.freeze({
      objectId:
        'OBJ_003_DRY_SAND_TRANSITION',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R05:C08',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R04:C05',
        'H_EARTH_GROUND_CELL_001:R04:C09',
        'H_EARTH_GROUND_CELL_001:R05:C06',
        'H_EARTH_GROUND_CELL_001:R05:C10',
        'H_EARTH_GROUND_CELL_001:R06:C07',
        'H_EARTH_GROUND_CELL_001:R06:C11'
      ]),

      addressRole:
        'legacy-dry-wet-transition',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES:
      Object.freeze({
        objectId:
          'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',

        zoneId:
          'ZONE_002_SHORELINE_CONTACT_ZONE',

        primaryAddress:
          'H_EARTH_GROUND_CELL_001:R06:C07',

        supportingAddresses: Object.freeze([
          'H_EARTH_GROUND_CELL_001:R05:C05',
          'H_EARTH_GROUND_CELL_001:R05:C08',
          'H_EARTH_GROUND_CELL_001:R06:C06',
          'H_EARTH_GROUND_CELL_001:R06:C09',
          'H_EARTH_GROUND_CELL_001:R07:C07',
          'H_EARTH_GROUND_CELL_001:R07:C10'
        ]),

        addressRole:
          'legacy-moisture-detail',

        compatibilityOnly: true,
        activeDesignAuthority: false
      }),

    OBJ_005_SHORELINE_FOAM_LINE: Object.freeze({
      objectId:
        'OBJ_005_SHORELINE_FOAM_LINE',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R07:C08',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R07:C03',
        'H_EARTH_GROUND_CELL_001:R07:C05',
        'H_EARTH_GROUND_CELL_001:R07:C08',
        'H_EARTH_GROUND_CELL_001:R07:C11',
        'H_EARTH_GROUND_CELL_001:R07:C14',
        'H_EARTH_GROUND_CELL_001:R08:C04',
        'H_EARTH_GROUND_CELL_001:R08:C09',
        'H_EARTH_GROUND_CELL_001:R08:C13'
      ]),

      addressRole:
        'legacy-shoreline-contact',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_006_NEARSHORE_WAVE_BAND: Object.freeze({
      objectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R08:C09',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R07:C04',
        'H_EARTH_GROUND_CELL_001:R07:C08',
        'H_EARTH_GROUND_CELL_001:R07:C12',
        'H_EARTH_GROUND_CELL_001:R08:C05',
        'H_EARTH_GROUND_CELL_001:R08:C09',
        'H_EARTH_GROUND_CELL_001:R08:C13',
        'H_EARTH_GROUND_CELL_001:R09:C06',
        'H_EARTH_GROUND_CELL_001:R09:C10',
        'H_EARTH_GROUND_CELL_001:R09:C14'
      ]),

      addressRole:
        'legacy-nearshore-context',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_007_WATER_SURFACE_PLANE: Object.freeze({
      objectId:
        'OBJ_007_WATER_SURFACE_PLANE',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R10:C09',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R09:C03',
        'H_EARTH_GROUND_CELL_001:R09:C07',
        'H_EARTH_GROUND_CELL_001:R09:C11',
        'H_EARTH_GROUND_CELL_001:R09:C15',
        'H_EARTH_GROUND_CELL_001:R10:C04',
        'H_EARTH_GROUND_CELL_001:R10:C08',
        'H_EARTH_GROUND_CELL_001:R10:C12',
        'H_EARTH_GROUND_CELL_001:R10:C16',
        'H_EARTH_GROUND_CELL_001:R11:C05',
        'H_EARTH_GROUND_CELL_001:R11:C09',
        'H_EARTH_GROUND_CELL_001:R11:C13',
        'H_EARTH_GROUND_CELL_001:R12:C08',
        'H_EARTH_GROUND_CELL_001:R12:C12'
      ]),

      addressRole:
        'legacy-water-context',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_008_AIR_HAZE_LIGHT_LAYER: Object.freeze({
      objectId:
        'OBJ_008_AIR_HAZE_LIGHT_LAYER',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R12:C09',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R10:C05',
        'H_EARTH_GROUND_CELL_001:R10:C11',
        'H_EARTH_GROUND_CELL_001:R11:C06',
        'H_EARTH_GROUND_CELL_001:R11:C12',
        'H_EARTH_GROUND_CELL_001:R12:C07',
        'H_EARTH_GROUND_CELL_001:R12:C13',
        'H_EARTH_GROUND_CELL_001:R13:C08',
        'H_EARTH_GROUND_CELL_001:R13:C14'
      ]),

      addressRole:
        'legacy-air-context',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_009_MANOR_EXTERIOR_CONTEXT: Object.freeze({
      objectId:
        'OBJ_009_MANOR_EXTERIOR_CONTEXT',

      zoneId:
        'ZONE_004_MANOR_CONTEXT_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R08:C14',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R05:C13',
        'H_EARTH_GROUND_CELL_001:R06:C14',
        'H_EARTH_GROUND_CELL_001:R07:C15',
        'H_EARTH_GROUND_CELL_001:R08:C14',
        'H_EARTH_GROUND_CELL_001:R09:C15',
        'H_EARTH_GROUND_CELL_001:R10:C14',
        'H_EARTH_GROUND_CELL_001:R11:C13'
      ]),

      addressRole:
        'legacy-manor-context',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_010_SMALL_BEACH_STONES: Object.freeze({
      objectId:
        'OBJ_010_SMALL_BEACH_STONES',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R04:C05',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R02:C03',
        'H_EARTH_GROUND_CELL_001:R02:C06',
        'H_EARTH_GROUND_CELL_001:R03:C04',
        'H_EARTH_GROUND_CELL_001:R03:C07',
        'H_EARTH_GROUND_CELL_001:R04:C05',
        'H_EARTH_GROUND_CELL_001:R04:C09',
        'H_EARTH_GROUND_CELL_001:R05:C06'
      ]),

      addressRole:
        'legacy-stone-detail',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_011_FOREGROUND_JAGGED_ROCKS: Object.freeze({
      objectId:
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      primaryAddress:
        'H_EARTH_GROUND_CELL_001:R04:C02',

      supportingAddresses: Object.freeze([
        'H_EARTH_GROUND_CELL_001:R02:C01',
        'H_EARTH_GROUND_CELL_001:R03:C01',
        'H_EARTH_GROUND_CELL_001:R03:C02',
        'H_EARTH_GROUND_CELL_001:R04:C02',
        'H_EARTH_GROUND_CELL_001:R04:C03',
        'H_EARTH_GROUND_CELL_001:R05:C02'
      ]),

      addressRole:
        'legacy-rock-detail',

      compatibilityOnly: true,
      activeDesignAuthority: false
    }),

    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS:
      Object.freeze({
        objectId:
          'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',

        zoneId:
          'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',

        primaryAddress:
          'H_EARTH_GROUND_CELL_001:R15:C10',

        supportingAddresses: Object.freeze([
          'H_EARTH_GROUND_CELL_001:R13:C03',
          'H_EARTH_GROUND_CELL_001:R13:C08',
          'H_EARTH_GROUND_CELL_001:R13:C13',
          'H_EARTH_GROUND_CELL_001:R14:C05',
          'H_EARTH_GROUND_CELL_001:R14:C10',
          'H_EARTH_GROUND_CELL_001:R14:C15',
          'H_EARTH_GROUND_CELL_001:R15:C06',
          'H_EARTH_GROUND_CELL_001:R15:C11',
          'H_EARTH_GROUND_CELL_001:R16:C07',
          'H_EARTH_GROUND_CELL_001:R16:C12'
        ]),

        addressRole:
          'legacy-distant-context',

        compatibilityOnly: true,
        activeDesignAuthority: false
      })
  });

export function padObjectCellIndex(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return '00';
  }

  return String(Math.trunc(numberValue)).padStart(2, '0');
}

export function makeObjectCellAddress(row, column) {
  return `H_EARTH_GROUND_CELL_001:R${padObjectCellIndex(
    row
  )}:C${padObjectCellIndex(column)}`;
}

export function makeObjectAddressSet(addresses = []) {
  const safeAddresses = Array.isArray(addresses)
    ? addresses
    : [];

  return Object.freeze(
    safeAddresses.map((address) => {
      if (typeof address === 'string') {
        return address;
      }

      return makeObjectCellAddress(
        address?.row,
        address?.column
      );
    })
  );
}

export function makeObjectAddressBinding({
  objectId,
  zoneId,
  primaryAddress = null,
  supportingAddresses = [],
  addressRole = 'legacy-descriptor-location',
  region = null
} = {}) {
  return Object.freeze({
    objectId:
      normalizeObjectId(objectId) || null,

    zoneId:
      typeof zoneId === 'string'
        ? zoneId
        : null,

    zoneRecognized:
      typeof zoneId === 'string'
        ? isHEarthGroundCell001ZoneId(zoneId)
        : false,

    primaryAddress:
      typeof primaryAddress === 'string'
        ? primaryAddress
        : null,

    supportingAddresses:
      makeObjectAddressSet(supportingAddresses),

    addressRole,
    zoneAddressRegion: region,

    compatibilityOnly: true,
    activeDesignAuthority: false,
    descriptorOnly: true,

    createsSpatialAuthority: false,
    createsRendererPlacementAuthority: false,
    runtimeActivationClaim: false,
    traversalClaim: false,
    rendererGeometryClaim: false,
    validationClaim: false
  });
}

export const H_EARTH_GROUND_CELL_001_OBJECT_CONTEXT_BOUNDARIES =
  Object.freeze({
    earthSurfaceObjects: Object.freeze([
      'OBJ_001_GROUND_SPAWN_ANCHOR',
      'OBJ_002_FOREGROUND_WET_SAND',
      'OBJ_003_DRY_SAND_TRANSITION',
      'OBJ_010_SMALL_BEACH_STONES',
      'OBJ_011_FOREGROUND_JAGGED_ROCKS'
    ]),

    earthWaterTransitionObjects: Object.freeze([
      'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_006_NEARSHORE_WAVE_BAND'
    ]),

    waterContextObjects: Object.freeze([
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE'
    ]),

    airContextObjects: Object.freeze([
      'OBJ_008_AIR_HAZE_LIGHT_LAYER'
    ]),

    hearthContextObjects: Object.freeze([
      'OBJ_009_MANOR_EXTERIOR_CONTEXT'
    ]),

    audraliaContextObjects: Object.freeze([
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ]),

    contextBoundaryClaims: Object.freeze({
      hEarthBecomesHearth: false,
      hearthBecomesHEarth: false,
      audraliaBecomesHEarth: false,
      manorInteriorAccessAuthorized: false,
      distantTraversalAuthorized: false,
      waterTraversalAuthorized: false,
      swimmingAuthorized: false,
      fluidSimulationAuthorized: false,
      weatherSimulationAuthorized: false,
      matrixCollapse: false
    })
  });

export function makeHEarthGroundCell001RendererConsumableHint({
  projectionOrder,
  publicStageRole,
  publicStageReadable,
  publicStageVisible,
  descriptorSurfaceClass,
  preferredSemanticElement = 'div',
  preferredCssClass = '',
  dataAttributes = {},
  zBand = 'UNSPECIFIED_DESCRIPTOR_BAND',
  scaleBand = 'UNSPECIFIED_DESCRIPTOR_SCALE',
  visualEmphasis = 'CONTEXTUAL'
} = {}) {
  return Object.freeze({
    descriptorHintType:
      'H_EARTH_OBJECT_RENDERER_CONSUMABLE_HINT',

    projectionOrder:
      Number.isFinite(Number(projectionOrder))
        ? Number(projectionOrder)
        : null,

    publicStageRole:
      normalizeRole(publicStageRole) || null,

    publicStageReadable:
      publicStageReadable === true,

    publicStageVisible:
      publicStageVisible === true,

    descriptorSurfaceClass:
      typeof descriptorSurfaceClass === 'string'
        ? descriptorSurfaceClass
        : null,

    preferredSemanticElement,
    preferredCssClass,
    dataAttributes:
      freezeObject(dataAttributes),

    zBand,
    scaleBand,
    visualEmphasis,

    rendererConsumableHintOnly: true,
    downstreamProjectionAllowed: true,

    domNodeCreatedHere: false,
    cssOutputCreatedHere: false,
    geometryCreatedHere: false,
    rendererMountedHere: false,
    rendererActivatedHere: false,
    rendererProofCreatedHere: false,
    visualPassProofCreatedHere: false,
    validationAuthorityCreatedHere: false,
    productionAuthorityCreatedHere: false,
    runtimeAuthorityCreatedHere: false,
    traversalAuthorityCreatedHere: false,
    matrixCollapseCreatedHere: false,

    authorityReference:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE
  });
}

export function makeHEarthGroundCell001ObjectDescriptor({
  objectId,
  label,
  layer,
  role,
  objectClass,
  descriptorSurfaceClass,
  zoneId,
  secondaryZoneId = null,
  publicStageRole,
  publicStageReadable = false,
  publicStageVisible = true,
  inspectionPriority = 0,
  inspectionTarget = false,
  primaryInspectionTarget = false,
  supportingInspectionTarget = false,
  secondarySurfaceContext = false,
  contextOnly = false,
  structuralOnly = false,
  contextBoundary = 'H_EARTH_LOCAL_GROUND_VIEW',
  publicStageGroup = 'UNCLASSIFIED',
  projectionOrder = null,
  rendererConsumableHint = {},
  capabilities = {},
  boundaryClaims = {}
} = {}) {
  const normalizedObjectId =
    normalizeObjectId(objectId);

  const zoneBinding =
    H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS[
      normalizedObjectId
    ] || null;

  const addressBinding =
    H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS[
      normalizedObjectId
    ] || null;

  const normalizedPublicStageRole =
    H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_ROLE_MAP[
      normalizedObjectId
    ] || publicStageRole || null;

  const normalizedPublicStageReadable =
    H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_READABILITY[
      normalizedObjectId
    ] === true;

  const normalizedPublicStageVisible =
    H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_VISIBILITY[
      normalizedObjectId
    ] === true;

  const rendererHint =
    makeHEarthGroundCell001RendererConsumableHint({
      projectionOrder,

      publicStageRole:
        normalizedPublicStageRole,

      publicStageReadable:
        normalizedPublicStageReadable,

      publicStageVisible:
        normalizedPublicStageVisible,

      descriptorSurfaceClass,

      ...rendererConsumableHint,

      dataAttributes: {
        objectId:
          normalizedObjectId,

        cellId:
          'H_EARTH_GROUND_CELL_001',

        zoneId:
          zoneId || '',

        publicStageRole:
          normalizedPublicStageRole || '',

        descriptorSurfaceClass:
          descriptorSurfaceClass || '',

        ...(rendererConsumableHint?.dataAttributes || {})
      }
    });

  return Object.freeze({
    objectId:
      normalizedObjectId,

    label,
    layer,
    role,
    objectClass,
    descriptorSurfaceClass,

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    cellId: 'H_EARTH_GROUND_CELL_001',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    firstActionIdentity:
      'Inspect Ground',

    firstReadoutIdentity:
      'Ground Condition Read',

    firstReceiptIdentity:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    zoneId,
    secondaryZoneId,

    zoneRecognized:
      typeof zoneId === 'string'
        ? isHEarthGroundCell001ZoneId(zoneId)
        : false,

    secondaryZoneRecognized:
      typeof secondaryZoneId === 'string'
        ? isHEarthGroundCell001ZoneId(secondaryZoneId)
        : false,

    zoneBinding,

    zoneDescriptor:
      getZoneDescriptorSafely(zoneId),

    secondaryZoneDescriptor:
      getZoneDescriptorSafely(secondaryZoneId),

    legacyAddressBinding:
      addressBinding,

    primaryAddress:
      addressBinding?.primaryAddress || null,

    supportingAddresses:
      addressBinding?.supportingAddresses ||
      EMPTY_FROZEN_ARRAY,

    addressRole:
      addressBinding?.addressRole || null,

    addressCompatibilityOnly:
      addressBinding?.compatibilityOnly === true,

    publicStageRole:
      normalizedPublicStageRole,

    publicStageReadable:
      normalizedPublicStageReadable,

    publicStageVisible:
      normalizedPublicStageVisible,

    descriptorOnly: true,

    inspectionPriority:
      Number.isFinite(Number(inspectionPriority))
        ? Number(inspectionPriority)
        : 0,

    publicStageGroup,
    projectionOrder,

    inspectionTarget:
      inspectionTarget === true,

    primaryInspectionTarget:
      primaryInspectionTarget === true,

    supportingInspectionTarget:
      supportingInspectionTarget === true,

    secondarySurfaceContext:
      secondarySurfaceContext === true,

    contextOnly:
      contextOnly === true,

    structuralOnly:
      structuralOnly === true,

    inspectGroundEligible:
      normalizedObjectId ===
        H_EARTH_PRIMARY_INSPECTION_TARGET ||
      H_EARTH_SUPPORTING_INSPECTION_TARGETS.includes(
        normalizedObjectId
      ),

    groundConditionReadRelevant:
      normalizedObjectId !==
      'OBJ_001_GROUND_SPAWN_ANCHOR',

    contextBoundary,

    downstreamProjectionAllowed: true,

    rendererConsumableHint:
      rendererHint,

    publicStageReadabilityAlignment: true,
    publicStageAuthorityCreatedHere: false,
    step034IPublicStageAuthorityConsumed: true,

    capabilities: Object.freeze({
      descriptorSelectable: true,
      sourceObjectDescriptor: true,
      publicStageDescriptor: true,
      supportsZoneBinding: true,

      supportsLegacyAddressRead:
        Boolean(addressBinding),

      supportsInspectionReference:
        inspectionTarget === true,

      supportsGroundConditionReadReference:
        normalizedObjectId !==
        'OBJ_001_GROUND_SPAWN_ANCHOR',

      supportsGroundInspectionReceiptReference:
        inspectionTarget === true,

      ...capabilities,

      renderedAsset: false,
      assetLoadingAuthorized: false,
      rendererGeometryAuthorized: false,
      materialChannelDefinedHere: false,
      actionBehaviorDefinedHere: false,
      readoutPayloadDefinedHere: false,
      receiptPersistenceDefinedHere: false,
      routeBehaviorDefinedHere: false,
      runtimeActivationAuthorized: false,
      traversalAuthorized: false,
      collisionBodyAuthorized: false,
      physicsBodyAuthorized: false,
      swimmingAuthorized: false,
      fluidSimulationAuthorized: false,
      validationAuthorized: false,
      productionAuthorized: false
    }),

    boundaryClaims: Object.freeze({
      createsTraversalAuthority: false,
      createsRuntimeAuthority: false,
      createsRendererProof: false,
      createsVisualPassProof: false,
      createsValidationAuthority: false,
      createsProductionAuthority: false,
      createsMatrixCollapse: false,

      renderedAssetClaim: false,
      assetLoadingClaim: false,
      rendererClaim: false,
      rendererActivationClaim: false,
      rendererGeometryClaim: false,
      rendererPassClaim: false,
      rendererProof: false,
      canvasActivationClaim: false,
      webglActivationClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      deploymentClaim: false,
      runtimeActivationClaim: false,
      runtimeExecutionClaim: false,
      traversalClaim: false,
      collisionClaim: false,
      physicsClaim: false,
      survivalSimulationClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      matrixCollapse: false,

      ...boundaryClaims
    }),

    authorityReference:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });
}

export const H_EARTH_GROUND_CELL_001_OBJECTS =
  Object.freeze([
    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_001_GROUND_SPAWN_ANCHOR',

      label:
        'Ground Spawn Anchor',

      layer:
        'H-Earth',

      role:
        'ground-level structural arrival reference',

      objectClass:
        'SPAWN_ANCHOR_DESCRIPTOR',

      descriptorSurfaceClass:
        'STRUCTURAL_ANCHOR',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      publicStageRole:
        'STRUCTURAL_NOT_PUBLIC_READABLE',

      publicStageReadable: false,
      publicStageVisible: false,
      inspectionPriority: 0,
      structuralOnly: true,
      publicStageGroup: 'STRUCTURAL',
      projectionOrder: 120,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--spawn-anchor',

        zBand:
          'STRUCTURAL_REFERENCE',

        scaleBand:
          'NO_PUBLIC_VISUAL_SCALE',

        visualEmphasis:
          'NONE'
      },

      capabilities: {
        spawnAnchorReference: true,
        localArrivalReference: true,
        supportsInspectGroundOrigin: true
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_002_FOREGROUND_WET_SAND',

      label:
        'Foreground Wet Sand',

      layer:
        'H-Earth / Earth',

      role:
        'primary public Inspect Ground focus surface',

      objectClass:
        'PRIMARY_INSPECTION_SURFACE_DESCRIPTOR',

      descriptorSurfaceClass:
        'FOREGROUND_GROUND_SURFACE',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      publicStageRole:
        'PRIMARY_PUBLIC_INSPECTION_OBJECT',

      publicStageReadable: true,
      publicStageVisible: true,
      inspectionPriority: 100,
      inspectionTarget: true,
      primaryInspectionTarget: true,
      publicStageGroup: 'PRIMARY_INSPECTION',
      projectionOrder: 10,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--foreground-wet-sand h-earth-object--primary-inspection',

        zBand:
          'FOREGROUND_PRIMARY',

        scaleBand:
          'BROAD_SURFACE',

        visualEmphasis:
          'PRIMARY'
      },

      capabilities: {
        primaryInspectGroundTarget: true,
        localGroundSurface: true,
        wetSandContext: true,
        supportsGroundConditionRead: true,
        supportsGroundInspectionReceipt: true
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_003_DRY_SAND_TRANSITION',

      label:
        'Dry Sand Transition',

      layer:
        'H-Earth / Earth',

      role:
        'visible-only secondary dry-to-wet surface context',

      objectClass:
        'SURFACE_TRANSITION_DESCRIPTOR',

      descriptorSurfaceClass:
        'SECONDARY_GROUND_TRANSITION',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      secondaryZoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      publicStageRole:
        'SECONDARY_SURFACE_CONTEXT',

      publicStageReadable: false,
      publicStageVisible: true,
      inspectionPriority: 55,
      inspectionTarget: false,
      primaryInspectionTarget: false,
      supportingInspectionTarget: false,
      secondarySurfaceContext: true,
      publicStageGroup: 'SECONDARY_SURFACE',
      projectionOrder: 60,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--dry-sand-transition h-earth-object--secondary-surface',

        zBand:
          'FOREGROUND_SECONDARY',

        scaleBand:
          'BROAD_TRANSITION',

        visualEmphasis:
          'SECONDARY'
      },

      capabilities: {
        drySandContext: true,
        wetDryTransitionContext: true,
        supportsGroundConditionRead: true,
        independentPublicReadability: false,
        independentInspectionEligibility: false
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',

      label:
        'Tide Pools and Reflective Puddles',

      layer:
        'H-Earth / Water',

      role:
        'supporting public-readable moisture and reflection detail',

      objectClass:
        'SUPPORTING_INSPECTION_SURFACE_DESCRIPTOR',

      descriptorSurfaceClass:
        'REFLECTIVE_MOISTURE_DETAIL',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      secondaryZoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      publicStageRole:
        'SUPPORTING_PUBLIC_READABLE_OBJECT',

      publicStageReadable: true,
      publicStageVisible: true,
      inspectionPriority: 90,
      inspectionTarget: true,
      supportingInspectionTarget: true,
      publicStageGroup: 'SUPPORTING_INSPECTION',
      projectionOrder: 20,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--tide-pools h-earth-object--supporting-inspection',

        zBand:
          'FOREGROUND_DETAIL',

        scaleBand:
          'CLUSTERED_SURFACE_DETAIL',

        visualEmphasis:
          'HIGH'
      },

      capabilities: {
        moistureContext: true,
        reflectiveSurfaceContext: true,
        supportingInspectionTarget: true,
        supportsGroundConditionRead: true
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_005_SHORELINE_FOAM_LINE',

      label:
        'Shoreline Foam Line',

      layer:
        'H-Earth / Water',

      role:
        'supporting public-readable shoreline contact marker',

      objectClass:
        'SHORELINE_CONTACT_DESCRIPTOR',

      descriptorSurfaceClass:
        'SHORELINE_CONTACT_DETAIL',

      zoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      secondaryZoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      publicStageRole:
        'SUPPORTING_PUBLIC_READABLE_OBJECT',

      publicStageReadable: true,
      publicStageVisible: true,
      inspectionPriority: 70,
      inspectionTarget: true,
      supportingInspectionTarget: true,
      publicStageGroup: 'SUPPORTING_INSPECTION',
      projectionOrder: 50,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--shoreline-foam-line h-earth-object--supporting-inspection',

        zBand:
          'SHORELINE_CONTACT',

        scaleBand:
          'LINEAR_BAND',

        visualEmphasis:
          'MEDIUM'
      },

      capabilities: {
        shorelineContactMarker: true,
        foamContext: true,
        supportingInspectionTarget: true,
        supportsGroundConditionRead: true
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_006_NEARSHORE_WAVE_BAND',

      label:
        'Nearshore Wave Band',

      layer:
        'H-Earth / Water',

      role:
        'context-only public-visible nearshore water band',

      objectClass:
        'WATER_CONTEXT_MARKER_DESCRIPTOR',

      descriptorSurfaceClass:
        'NEARSHORE_WATER_CONTEXT',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      secondaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      publicStageRole:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      publicStageReadable: false,
      publicStageVisible: true,
      inspectionPriority: 20,
      contextOnly: true,
      contextBoundary:
        'H_EARTH_WATER_CONTEXT_ONLY',

      publicStageGroup:
        'CONTEXT_ONLY',

      projectionOrder: 70,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--nearshore-wave-band h-earth-object--context-only',

        zBand:
          'MIDGROUND_WATER',

        scaleBand:
          'LINEAR_BAND',

        visualEmphasis:
          'CONTEXTUAL'
      },

      capabilities: {
        nearshoreContext: true,
        waterContextOnly: true,
        shorelineRelationContext: true,
        waterTraversalAuthorized: false
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_007_WATER_SURFACE_PLANE',

      label:
        'Water Surface Plane',

      layer:
        'H-Earth / Water',

      role:
        'context-only public-visible water surface',

      objectClass:
        'WATER_SURFACE_CONTEXT_DESCRIPTOR',

      descriptorSurfaceClass:
        'WATER_SURFACE_CONTEXT',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      publicStageRole:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      publicStageReadable: false,
      publicStageVisible: true,
      inspectionPriority: 15,
      contextOnly: true,

      contextBoundary:
        'H_EARTH_WATER_CONTEXT_ONLY',

      publicStageGroup:
        'CONTEXT_ONLY',

      projectionOrder: 80,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--water-surface-plane h-earth-object--context-only',

        zBand:
          'MIDGROUND_WATER',

        scaleBand:
          'BROAD_SURFACE',

        visualEmphasis:
          'CONTEXTUAL'
      },

      capabilities: {
        waterSurfaceContextOnly: true,
        swimmingAuthorized: false,
        waterTraversalAuthorized: false,
        fluidSimulationAuthorized: false
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_008_AIR_HAZE_LIGHT_LAYER',

      label:
        'Air Haze Light Layer',

      layer:
        'H-Earth / Air',

      role:
        'context-only public-visible atmospheric light layer',

      objectClass:
        'AIR_HAZE_LIGHT_CONTEXT_DESCRIPTOR',

      descriptorSurfaceClass:
        'ATMOSPHERIC_LIGHT_CONTEXT',

      zoneId:
        'ZONE_003_WATER_SURFACE_ZONE',

      secondaryZoneId:
        'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',

      publicStageRole:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      publicStageReadable: false,
      publicStageVisible: true,
      inspectionPriority: 10,
      contextOnly: true,

      contextBoundary:
        'H_EARTH_AIR_CONTEXT_ONLY',

      publicStageGroup:
        'CONTEXT_ONLY',

      projectionOrder: 90,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--air-haze-light-layer h-earth-object--context-only',

        zBand:
          'ATMOSPHERIC',

        scaleBand:
          'FULL_STAGE_OVERLAY_HINT',

        visualEmphasis:
          'SUBTLE'
      },

      capabilities: {
        airContextOnly: true,
        hazeContextOnly: true,
        lightContextOnly: true,
        weatherSimulationAuthorized: false
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_009_MANOR_EXTERIOR_CONTEXT',

      label:
        'Manor Exterior Context',

      layer:
        'Hearth Context',

      role:
        'context-only public-visible Hearth support/control exterior',

      objectClass:
        'HEARTH_MANOR_EXTERIOR_CONTEXT_DESCRIPTOR',

      descriptorSurfaceClass:
        'MANOR_EXTERIOR_CONTEXT',

      zoneId:
        'ZONE_004_MANOR_CONTEXT_ZONE',

      publicStageRole:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      publicStageReadable: false,
      publicStageVisible: true,
      inspectionPriority: 5,
      contextOnly: true,

      contextBoundary:
        'HEARTH_SUPPORT_CONTROL_CONTEXT_ONLY',

      publicStageGroup:
        'CONTEXT_ONLY',

      projectionOrder: 100,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--manor-exterior-context h-earth-object--context-only',

        zBand:
          'BACKGROUND_MANOR',

        scaleBand:
          'DISTANT_ARCHITECTURAL_CONTEXT',

        visualEmphasis:
          'CONTEXTUAL'
      },

      capabilities: {
        hearthContextOnly: true,
        manorExteriorOnly: true,
        supportControlContext: true,
        manorInteriorAccessAuthorized: false
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_010_SMALL_BEACH_STONES',

      label:
        'Small Beach Stones',

      layer:
        'H-Earth / Earth',

      role:
        'supporting public-readable small stone detail',

      objectClass:
        'SUPPORTING_GROUND_DETAIL_DESCRIPTOR',

      descriptorSurfaceClass:
        'SMALL_STONE_GROUND_DETAIL',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      secondaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      publicStageRole:
        'SUPPORTING_PUBLIC_READABLE_OBJECT',

      publicStageReadable: true,
      publicStageVisible: true,
      inspectionPriority: 85,
      inspectionTarget: true,
      supportingInspectionTarget: true,
      publicStageGroup: 'SUPPORTING_INSPECTION',
      projectionOrder: 30,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--small-beach-stones h-earth-object--supporting-inspection',

        zBand:
          'FOREGROUND_DETAIL',

        scaleBand:
          'SMALL_CLUSTER_DETAIL',

        visualEmphasis:
          'HIGH'
      },

      capabilities: {
        smallStoneDetailContext: true,
        supportingInspectionTarget: true,
        supportsGroundConditionRead: true
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',

      label:
        'Foreground Jagged Rocks',

      layer:
        'H-Earth / Earth',

      role:
        'supporting public-readable jagged rock detail',

      objectClass:
        'SUPPORTING_ROCK_DETAIL_DESCRIPTOR',

      descriptorSurfaceClass:
        'JAGGED_ROCK_GROUND_DETAIL',

      zoneId:
        'ZONE_001_FOREGROUND_INSPECTION_ZONE',

      secondaryZoneId:
        'ZONE_002_SHORELINE_CONTACT_ZONE',

      publicStageRole:
        'SUPPORTING_PUBLIC_READABLE_OBJECT',

      publicStageReadable: true,
      publicStageVisible: true,
      inspectionPriority: 80,
      inspectionTarget: true,
      supportingInspectionTarget: true,
      publicStageGroup: 'SUPPORTING_INSPECTION',
      projectionOrder: 40,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--foreground-jagged-rocks h-earth-object--supporting-inspection',

        zBand:
          'FOREGROUND_DETAIL',

        scaleBand:
          'MEDIUM_ROCK_CLUSTER',

        visualEmphasis:
          'HIGH'
      },

      capabilities: {
        foregroundRockContext: true,
        jaggedRockDetailContext: true,
        supportingInspectionTarget: true,
        supportsGroundConditionRead: true
      }
    }),

    makeHEarthGroundCell001ObjectDescriptor({
      objectId:
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',

      label:
        'Distance Rock Stacks and Islets',

      layer:
        'Audralia Context',

      role:
        'context-only public-visible distant rock and islet continuity',

      objectClass:
        'AUDRALIA_DISTANT_CONTEXT_DESCRIPTOR',

      descriptorSurfaceClass:
        'DISTANT_ROCK_WORLD_CONTEXT',

      zoneId:
        'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',

      publicStageRole:
        'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',

      publicStageReadable: false,
      publicStageVisible: true,
      inspectionPriority: 5,
      contextOnly: true,

      contextBoundary:
        'AUDRALIA_PLANETARY_WORLD_CONTEXT_ONLY',

      publicStageGroup:
        'CONTEXT_ONLY',

      projectionOrder: 110,

      rendererConsumableHint: {
        preferredCssClass:
          'h-earth-object h-earth-object--distance-rock-stacks-islets h-earth-object--context-only',

        zBand:
          'DISTANT_HORIZON',

        scaleBand:
          'DISTANT_WORLD_CONTEXT',

        visualEmphasis:
          'CONTEXTUAL'
      },

      capabilities: {
        audraliaContextOnly: true,
        distantVisualContextOnly: true,
        planetaryWorldContinuityContext: true,
        distantTraversalAuthorized: false,
        openWorldMovementAuthorized: false
      }
    })
  ]);

export const H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS =
  Object.freeze(
    H_EARTH_GROUND_CELL_001_OBJECTS.reduce(
      (registry, descriptor) => {
        registry[descriptor.objectId] =
          descriptor;

        return registry;
      },
      {}
    )
  );

export const H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION =
  Object.freeze(
    H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION_ORDER
      .map((objectId) => {
        const descriptor =
          H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS[
            objectId
          ];

        if (!descriptor) {
          return null;
        }

        return Object.freeze({
          objectId:
            descriptor.objectId,

          label:
            descriptor.label,

          zoneId:
            descriptor.zoneId,

          secondaryZoneId:
            descriptor.secondaryZoneId,

          publicStageRole:
            descriptor.publicStageRole,

          publicStageReadable:
            descriptor.publicStageReadable,

          publicStageVisible:
            descriptor.publicStageVisible,

          descriptorOnly: true,

          inspectionPriority:
            descriptor.inspectionPriority,

          descriptorSurfaceClass:
            descriptor.descriptorSurfaceClass,

          contextBoundary:
            descriptor.contextBoundary,

          downstreamProjectionAllowed: true,

          rendererConsumableHint:
            descriptor.rendererConsumableHint,

          createsTraversalAuthority: false,
          createsRuntimeAuthority: false,
          createsRendererProof: false,
          createsVisualPassProof: false,
          createsValidationAuthority: false,
          createsProductionAuthority: false,
          createsMatrixCollapse: false
        });
      })
      .filter(Boolean)
  );

export const H_EARTH_GROUND_CELL_001_PUBLIC_OBJECT_DESCRIPTORS =
  Object.freeze(
    H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION.filter(
      (descriptor) =>
        descriptor.publicStageReadable === true ||
        descriptor.publicStageVisible === true
    )
  );

export const H_EARTH_GROUND_CELL_001_OBJECTS_BY_ZONE =
  Object.freeze({
    membershipPolicy:
      'PRIMARY_ZONE_MEMBERSHIP_ONLY',

    secondaryMembershipSource:
      'H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS.secondaryZoneId',

    ZONE_001_FOREGROUND_INSPECTION_ZONE:
      Object.freeze([
        'OBJ_001_GROUND_SPAWN_ANCHOR',
        'OBJ_002_FOREGROUND_WET_SAND',
        'OBJ_010_SMALL_BEACH_STONES',
        'OBJ_011_FOREGROUND_JAGGED_ROCKS'
      ]),

    ZONE_002_SHORELINE_CONTACT_ZONE:
      Object.freeze([
        'OBJ_003_DRY_SAND_TRANSITION',
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
        'OBJ_005_SHORELINE_FOAM_LINE'
      ]),

    ZONE_003_WATER_SURFACE_ZONE:
      Object.freeze([
        'OBJ_006_NEARSHORE_WAVE_BAND',
        'OBJ_007_WATER_SURFACE_PLANE',
        'OBJ_008_AIR_HAZE_LIGHT_LAYER'
      ]),

    ZONE_004_MANOR_CONTEXT_ZONE:
      Object.freeze([
        'OBJ_009_MANOR_EXTERIOR_CONTEXT'
      ]),

    ZONE_005_DISTANT_WORLD_CONTEXT_ZONE:
      Object.freeze([
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
      ])
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_ROLES =
  Object.freeze({
    primaryInspectionTarget:
      H_EARTH_PRIMARY_INSPECTION_TARGET,

    supportingInspectionTargets:
      H_EARTH_SUPPORTING_INSPECTION_TARGETS,

    secondarySurfaceContextObjects:
      H_EARTH_GROUND_CELL_001_SECONDARY_SURFACE_CONTEXT_OBJECTS,

    secondarySurfaceContextReadable: false,
    secondarySurfaceContextVisible: true,

    contextOnlyObjects:
      H_EARTH_GROUND_CELL_001_PUBLIC_STAGE_CONTEXT_OBJECTS,

    structuralObjects:
      H_EARTH_GROUND_CELL_001_STRUCTURAL_OBJECTS,

    spawnAnchorObject:
      'OBJ_001_GROUND_SPAWN_ANCHOR',

    inspectGroundEligibleObjects:
      Object.freeze([
        'OBJ_002_FOREGROUND_WET_SAND',
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
        'OBJ_010_SMALL_BEACH_STONES',
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',
        'OBJ_005_SHORELINE_FOAM_LINE'
      ]),

    groundConditionReadRelevantObjects:
      Object.freeze([
        'OBJ_002_FOREGROUND_WET_SAND',
        'OBJ_003_DRY_SAND_TRANSITION',
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
        'OBJ_005_SHORELINE_FOAM_LINE',
        'OBJ_006_NEARSHORE_WAVE_BAND',
        'OBJ_007_WATER_SURFACE_PLANE',
        'OBJ_008_AIR_HAZE_LIGHT_LAYER',
        'OBJ_009_MANOR_EXTERIOR_CONTEXT',
        'OBJ_010_SMALL_BEACH_STONES',
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
      ]),

    actionBehaviorDefinedHere: false,
    actionExecutedHere: false,
    readoutPayloadDefinedHere: false,
    readoutExecutedHere: false,
    receiptPersistenceDefinedHere: false,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export const H_EARTH_GROUND_CELL_001_OBJECTS_PUBLIC_STAGE_CONTRACT =
  Object.freeze({
    contractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_PUBLIC_STAGE_CONTRACT_STEP_034J_v2',

    sourceContractId:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.contractId,

    directRenewedFromContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

    activeGoverningZoneContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    exactHistoricalObjectLineageContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

    exactHistoricalZoneLineageContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

    governingBoundaryReference:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE,

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',

    alignmentStatus:
      'PUBLIC_STAGE_OBJECT_READABILITY_ALIGNED_BENEATH_STEP_034I_AND_STEP_034K',

    publicStageReadabilityAlignment: true,
    publicStageAuthorityCreatedHere: false,
    step034IPublicStageAuthorityConsumed: true,
    step034KActiveZoneAuthorityConsumed: true,

    descriptorOnly: true,

    objectsByZoneMembershipPolicy:
      'PRIMARY_ZONE_MEMBERSHIP_ONLY',

    secondaryMembershipSource:
      'H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS.secondaryZoneId',

    primaryPublicInspectionObject:
      'OBJ_002_FOREGROUND_WET_SAND',

    supportingPublicReadableObjects:
      H_EARTH_SUPPORTING_INSPECTION_TARGETS,

    secondarySurfaceContextObjects:
      H_EARTH_GROUND_CELL_001_SECONDARY_SURFACE_CONTEXT_OBJECTS,

    secondarySurfaceContextReadable: false,
    secondarySurfaceContextVisible: true,

    contextOnlyPublicVisibleObjects:
      H_EARTH_GROUND_CELL_001_PUBLIC_STAGE_CONTEXT_OBJECTS,

    structuralNotPublicReadableObjects:
      H_EARTH_GROUND_CELL_001_STRUCTURAL_OBJECTS,

    publicStageRoleMap:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_ROLE_MAP,

    publicReadability:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_READABILITY,

    publicVisibility:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_VISIBILITY,

    descriptorProjectionOrder:
      H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION_ORDER,

    objectDescriptorProjection:
      H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION,

    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    legacyAddressEquivalenceEvidenceOwnedExternally: true,

    rendererActivation: false,
    finalRendererClaim: false,
    rendererPassClaim: false,
    rendererProof: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    runtimeActivation: false,
    matrixCollapse: false
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE =
  Object.freeze({
    referenceId:
      'H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE',

    status:
      'INSPECT_GROUND_DESCRIPTOR_REFERENCE_SURFACE_AVAILABLE',

    actionIdentity:
      'Inspect Ground',

    primaryActionObject:
      'OBJ_002_FOREGROUND_WET_SAND',

    allowedActionObjects:
      Object.freeze([
        'OBJ_002_FOREGROUND_WET_SAND',
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
        'OBJ_010_SMALL_BEACH_STONES',
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',
        'OBJ_005_SHORELINE_FOAM_LINE'
      ]),

    excludedSecondarySurfaceContext:
      'OBJ_003_DRY_SAND_TRANSITION',

    actionIdentityReferencedOnly: true,
    actionModuleImportedHere: false,
    actionBehaviorDefinedHere: false,
    actionExecutionDefinedHere: false,
    runtimeMutationDefinedHere: false,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE =
  Object.freeze({
    referenceId:
      'H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE',

    status:
      'GROUND_CONDITION_READ_DESCRIPTOR_REFERENCE_SURFACE_AVAILABLE',

    readoutIdentity:
      'Ground Condition Read',

    primaryReadoutObject:
      'OBJ_002_FOREGROUND_WET_SAND',

    supportingReadoutObjects:
      Object.freeze([
        'OBJ_003_DRY_SAND_TRANSITION',
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
        'OBJ_005_SHORELINE_FOAM_LINE',
        'OBJ_006_NEARSHORE_WAVE_BAND',
        'OBJ_007_WATER_SURFACE_PLANE',
        'OBJ_008_AIR_HAZE_LIGHT_LAYER',
        'OBJ_010_SMALL_BEACH_STONES',
        'OBJ_011_FOREGROUND_JAGGED_ROCKS'
      ]),

    contextReadoutObjects:
      Object.freeze([
        'OBJ_009_MANOR_EXTERIOR_CONTEXT',
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
      ]),

    readoutIdentityReferencedOnly: true,
    readoutModuleImportedHere: false,
    readoutPayloadDefinedHere: false,
    readoutExecutedHere: false,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_TO_RECEIPT_REFERENCE =
  Object.freeze({
    referenceId:
      'H_EARTH_GROUND_CELL_001_OBJECT_TO_RECEIPT_REFERENCE',

    status:
      'GROUND_INSPECTION_RECEIPT_IDENTITY_REFERENCE_AVAILABLE',

    receiptIdentity:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    receiptFile:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',

    primaryReceiptObject:
      'OBJ_002_FOREGROUND_WET_SAND',

    supportingReceiptObjects:
      H_EARTH_SUPPORTING_INSPECTION_TARGETS,

    receiptIdentityReferencedOnly: true,
    receiptModuleImportedHere: false,
    receiptPayloadCreatedHere: false,
    receiptPersistedHere: false,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_DOWNSTREAM_INTERFACE =
  Object.freeze({
    interfaceId:
      'H_EARTH_GROUND_CELL_001_OBJECT_DOWNSTREAM_INTERFACE',

    status:
      'STEP_034J_PUBLIC_STAGE_READABILITY_ALIGNMENT_INTERFACE_AVAILABLE',

    sourceContractId:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.contractId,

    activeGoverningZoneContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    exactHistoricalObjectLineageContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

    exactHistoricalZoneLineageContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

    descriptorOnly: true,

    objectsByZoneMembershipPolicy:
      'PRIMARY_ZONE_MEMBERSHIP_ONLY',

    secondaryMembershipSource:
      'H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS.secondaryZoneId',

    mayBeConsumedBy:
      Object.freeze([
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/actions/inspect-ground.js',
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/readouts/ground-condition-read.js',
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/capacity.js',
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/environment.js',
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/renderer.js',
        '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/index.js'
      ]),

    consumableSurfaces:
      Object.freeze([
        'H_EARTH_PRIMARY_INSPECTION_TARGET',
        'H_EARTH_SUPPORTING_INSPECTION_TARGETS',
        'H_EARTH_CONTEXT_OBJECTS',
        'H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL',
        'H_EARTH_GROUND_CELL_001_OBJECT_COMPRESSION_MODEL',
        'H_EARTH_GROUND_CELL_001_OBJECTS',
        'H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS',
        'H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_ROLE_MAP',
        'H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_READABILITY',
        'H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION',
        'H_EARTH_GROUND_CELL_001_PUBLIC_OBJECT_DESCRIPTORS',
        'H_EARTH_GROUND_CELL_001_PUBLIC_OBJECTS_BY_ROLE',
        'H_EARTH_GROUND_CELL_001_OBJECTS_PUBLIC_STAGE_CONTRACT',
        'H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_RECEIPT'
      ]),

    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    legacyAddressEquivalenceEvidenceOwnedExternally: true,

    rendererActivation: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export const H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_RECEIPT =
  Object.freeze({
    receiptType:
      'H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_RECEIPT',

    contractId:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.contractId,

    directRenewedFromContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

    activeGoverningZoneContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    exactHistoricalObjectLineageContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

    exactHistoricalZoneLineageContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

    retiredCompatibilityLineage: Object.freeze({
      zones:
        'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

      objects:
        'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1'
    }),

    file:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/objects/ground-cell-001.objects.js',

    step:
      'STEP_034J_OBJECTS_PUBLIC_STAGE_READABILITY_AMENDMENT_V2_PROVENANCE_ALIGNMENT',

    status:
      'SOURCE_PUBLIC_STAGE_OBJECT_READABILITY_ALIGNMENT_RECEIPT',

    sourceClass:
      'OBJECT_AUTHORITY_PUBLIC_STAGE_READABILITY_ALIGNMENT',

    governingBoundaryReference:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE,

    publicStageReadabilityAlignment: true,
    publicStageAuthorityCreatedHere: false,
    step034IPublicStageAuthorityConsumed: true,
    step034KActiveZoneAuthorityConsumed: true,

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    firstActionIdentity:
      'Inspect Ground',

    firstReadoutIdentity:
      'Ground Condition Read',

    firstReceiptIdentity:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    objectCount: 12,

    canonicalObjectIds:
      H_EARTH_GROUND_CELL_001_CANONICAL_OBJECT_ID_LIST,

    objectsByZoneMembershipPolicy:
      'PRIMARY_ZONE_MEMBERSHIP_ONLY',

    secondaryMembershipSource:
      'H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS.secondaryZoneId',

    obj006RemovedFromZone002Index: true,

    secondarySurfaceContextReadable: false,
    secondarySurfaceContextVisible: true,

    compositionModelRestored: true,
    compressionModelExportPreserved: true,
    compositionModelAggregateAliasRestored: true,
    compressionModelAggregateAliasRestored: true,
    compressionModelAggregateAliasUsesNamedAlias: true,

    legacySupportingAddressesPreserved: true,

    receiptPathCorrected: true,
    receiptSourcePath:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',

    backupEvidenceOwnedExternally: true,
    driveOccurrenceEvidenceOwnedExternally: true,
    connectorReadbackEvidenceOwnedExternally: true,
    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    digestEvidenceOwnedExternally: true,
    replayEvidenceOwnedExternally: true,
    installationEvidenceOwnedExternally: true,
    admissionEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    legacyAddressEquivalenceEvidenceOwnedExternally: true,

    claimCeiling: Object.freeze({
      RUNTIME_EXECUTION_AUTHORITY_CREATED_HERE: false,
      RENDERER_ACTIVATION: false,
      FINAL_RENDERER_CLAIM: false,
      RENDERER_PASS_CLAIM: false,
      RENDERER_PROOF: false,
      CANVAS_ACTIVATION: false,
      WEBGL_ACTIVATION: false,
      VISUAL_PASS_CLAIM: false,
      VALIDATION_CLAIM: false,
      PRODUCTION_CLAIM: false,
      DEPLOYMENT_CLAIM: false,
      OPEN_WORLD_TRAVERSAL: false,
      SURVIVAL_SIMULATION: false,
      MANOR_INTERIOR_ACCESS: false,
      DISTANT_TRAVERSAL: false,
      SWIMMING: false,
      FLUID_SIMULATION: false,
      MATRIX_COLLAPSE: false
    }),

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export const H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT =
  Object.freeze({
    receiptType:
      'H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT',

    contractId:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.contractId,

    directRenewedFromContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

    activeGoverningZoneContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    exactHistoricalObjectLineageContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

    exactHistoricalZoneLineageContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

    file:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/objects/ground-cell-001.objects.js',

    room:
      'ROOM_3_ENVIRONMENT',

    status:
      'GROUND_CELL_001_OBJECT_SOURCE_AUTHORITY_PROVENANCE_ALIGNED',

    sourceClass:
      'OBJECT_AUTHORITY_PUBLIC_STAGE_READABILITY_ALIGNMENT',

    matrix:
      'H-Earth',

    matrixRole:
      'Ground-View Matrix',

    activeCell:
      'H_EARTH_GROUND_CELL_001',

    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    upstreamCellReceipt:
      getHEarthGroundCell001Receipt(),

    upstreamPath3Binding:
      getHEarthGroundCell001Path3Binding(),

    upstreamCellSceneBinding:
      getHEarthGroundCell001SceneBinding(),

    upstreamCellSpawnAnchorScope:
      getHEarthGroundCell001SpawnAnchorScope(),

    upstreamRoom3UnblockReceipt:
      getHEarthRoom3UnblockReceipt(),

    upstreamZonesReceipt:
      getHEarthGroundCell001ZonesReceipt(),

    upstreamObjectMappingUnblockReceipt:
      getHEarthRoom3ObjectMappingUnblockReceipt(),

    governingBoundaryReference:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE,

    objectCount: 12,

    objectIds:
      H_EARTH_GROUND_CELL_001_CANONICAL_OBJECT_ID_LIST,

    primaryInspectionTarget:
      H_EARTH_PRIMARY_INSPECTION_TARGET,

    supportingInspectionTargets:
      H_EARTH_SUPPORTING_INSPECTION_TARGETS,

    legacyContextObjects:
      H_EARTH_CONTEXT_OBJECTS,

    publicStageContextObjects:
      H_EARTH_GROUND_CELL_001_PUBLIC_STAGE_CONTEXT_OBJECTS,

    compositionModel:
      H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL,

    compressionModel:
      H_EARTH_GROUND_CELL_001_OBJECT_COMPRESSION_MODEL,

    objectsByZoneMembershipPolicy:
      'PRIMARY_ZONE_MEMBERSHIP_ONLY',

    obj006RemovedFromZone002Index: true,

    secondarySurfaceContextReadable: false,
    secondarySurfaceContextVisible: true,

    legacySupportingAddressesPreserved: true,

    receiptSourcePath:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/h-earth.receipts.js',

    publicStageReadabilityAlignment: true,
    publicStageAuthorityCreatedHere: false,
    step034IPublicStageAuthorityConsumed: true,
    step034KActiveZoneAuthorityConsumed: true,

    backupEvidenceOwnedExternally: true,
    driveOccurrenceEvidenceOwnedExternally: true,
    connectorReadbackEvidenceOwnedExternally: true,
    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    installationEvidenceOwnedExternally: true,
    admissionEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    legacyAddressEquivalenceEvidenceOwnedExternally: true,

    publicStageReceipt:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_RECEIPT,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export const H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT =
  Object.freeze({
    receiptType:
      'H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT',

    contractId:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.contractId,

    directRenewedFromContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

    activeGoverningZoneContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    exactHistoricalObjectLineageContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

    exactHistoricalZoneLineageContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

    status:
      'ROOM_4_DESCRIPTOR_REFERENCE_SURFACE_AVAILABLE_NO_EXECUTION_OR_INTEGRATION_CLAIM',

    activeCell:
      'H_EARTH_GROUND_CELL_001',

    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    actionIdentity:
      'Inspect Ground',

    primaryInspectionTarget:
      H_EARTH_PRIMARY_INSPECTION_TARGET,

    supportingInspectionTargets:
      H_EARTH_SUPPORTING_INSPECTION_TARGETS,

    sourceAuthorityExports:
      Object.freeze([
        'H_EARTH_PRIMARY_INSPECTION_TARGET',
        'H_EARTH_SUPPORTING_INSPECTION_TARGETS',
        'H_EARTH_CONTEXT_OBJECTS',
        'H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL',
        'H_EARTH_GROUND_CELL_001_OBJECT_COMPRESSION_MODEL',
        'H_EARTH_GROUND_CELL_001_OBJECTS',
        'H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS',
        'H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS',
        'H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS',
        'H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_ROLES',
        'H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE',
        'H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT'
      ]),

    actionModuleImportedHere: false,
    actionExecutionClaim: false,

    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    legacyAddressEquivalenceEvidenceOwnedExternally: true,

    rendererActivation: false,
    validationClaim: false,
    productionClaim: false,

    boundary:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS
  });

export function getHEarthGroundCell001ObjectDescriptor(
  objectId
) {
  const normalizedObjectId =
    normalizeObjectId(objectId);

  if (!normalizedObjectId) {
    return null;
  }

  return (
    H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS[
      normalizedObjectId
    ] || null
  );
}

export function getHEarthGroundCell001PublicObjectDescriptor(
  objectId
) {
  const descriptor =
    getHEarthGroundCell001ObjectDescriptor(objectId);

  if (!descriptor) {
    return null;
  }

  if (
    descriptor.publicStageReadable !== true &&
    descriptor.publicStageVisible !== true
  ) {
    return null;
  }

  return descriptor;
}

export function getHEarthGroundCell001ObjectZoneBinding(
  objectId
) {
  const normalizedObjectId =
    normalizeObjectId(objectId);

  if (!normalizedObjectId) {
    return null;
  }

  return (
    H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS[
      normalizedObjectId
    ] || null
  );
}

export function getHEarthGroundCell001ObjectAddressBinding(
  objectId
) {
  const normalizedObjectId =
    normalizeObjectId(objectId);

  if (!normalizedObjectId) {
    return null;
  }

  return (
    H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS[
      normalizedObjectId
    ] || null
  );
}

export function getHEarthGroundCell001ObjectsForZone(
  zoneId
) {
  if (!zoneId || typeof zoneId !== 'string') {
    return EMPTY_FROZEN_ARRAY;
  }

  const zoneObjects =
    H_EARTH_GROUND_CELL_001_OBJECTS_BY_ZONE[
      zoneId
    ];

  return Array.isArray(zoneObjects)
    ? zoneObjects
    : EMPTY_FROZEN_ARRAY;
}

export function getHEarthGroundCell001PublicObjectsByRole(
  role
) {
  const normalizedRole =
    normalizeRole(role);

  if (!normalizedRole) {
    return EMPTY_FROZEN_ARRAY;
  }

  const objectIds =
    H_EARTH_GROUND_CELL_001_PUBLIC_OBJECTS_BY_ROLE[
      normalizedRole
    ];

  if (!objectIds) {
    return EMPTY_FROZEN_ARRAY;
  }

  return Object.freeze(
    objectIds
      .map((objectId) =>
        getHEarthGroundCell001ObjectDescriptor(objectId)
      )
      .filter(Boolean)
  );
}

export function classifyHEarthGroundCell001PublicObjectRole(
  objectId
) {
  const normalizedObjectId =
    normalizeObjectId(objectId);

  if (!normalizedObjectId) {
    return Object.freeze({
      objectId,
      recognized: false,
      role: null,
      publicStageReadable: false,
      publicStageVisible: false,
      descriptorOnly: true,
      classification:
        'INVALID_OBJECT_ID'
    });
  }

  const descriptor =
    getHEarthGroundCell001ObjectDescriptor(
      normalizedObjectId
    );

  if (!descriptor) {
    return Object.freeze({
      objectId:
        normalizedObjectId,

      recognized: false,
      role: null,
      publicStageReadable: false,
      publicStageVisible: false,
      descriptorOnly: true,

      classification:
        'UNRECOGNIZED_OBJECT_ID'
    });
  }

  return Object.freeze({
    objectId:
      descriptor.objectId,

    recognized: true,

    role:
      descriptor.publicStageRole,

    publicStageReadable:
      descriptor.publicStageReadable,

    publicStageVisible:
      descriptor.publicStageVisible,

    inspectionPriority:
      descriptor.inspectionPriority,

    inspectionTarget:
      descriptor.inspectionTarget,

    descriptorSurfaceClass:
      descriptor.descriptorSurfaceClass,

    descriptorOnly: true,
    publicStageAuthorityCreatedHere: false,

    classification:
      'STEP_034J_PUBLIC_STAGE_READABILITY_ALIGNMENT'
  });
}

export function isHEarthGroundCell001PublicReadableObject(
  objectId
) {
  const descriptor =
    getHEarthGroundCell001ObjectDescriptor(objectId);

  return descriptor?.publicStageReadable === true;
}

export function isHEarthGroundCell001PublicVisibleObject(
  objectId
) {
  const descriptor =
    getHEarthGroundCell001ObjectDescriptor(objectId);

  return descriptor?.publicStageVisible === true;
}

export function isHEarthGroundCell001ObjectId(
  objectId
) {
  return Boolean(
    getHEarthGroundCell001ObjectDescriptor(objectId)
  );
}

export function isHEarthGroundCell001InspectionObject(
  objectId
) {
  const normalizedObjectId =
    normalizeObjectId(objectId);

  return Boolean(
    normalizedObjectId ===
      H_EARTH_PRIMARY_INSPECTION_TARGET ||
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.includes(
      normalizedObjectId
    )
  );
}

export function isHEarthGroundCell001ContextOnlyObject(
  objectId
) {
  const normalizedObjectId =
    normalizeObjectId(objectId);

  return (
    H_EARTH_GROUND_CELL_001_PUBLIC_STAGE_CONTEXT_OBJECTS
      .includes(normalizedObjectId)
  );
}

export function getHEarthGroundCell001ObjectPublicStageReceipt() {
  return H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_RECEIPT;
}

export function getHEarthGroundCell001ObjectsReceipt() {
  return H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT;
}

export function getHEarthRoom4ActionBindingUnblockReceipt() {
  return H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT;
}

export const H_EARTH_GROUND_CELL_001_OBJECTS_AGGREGATE =
  Object.freeze({
    id:
      'H_EARTH_GROUND_CELL_001_OBJECTS_AGGREGATE',

    file:
      '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/objects/ground-cell-001.objects.js',

    room:
      'ROOM_3_ENVIRONMENT',

    step:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v2',

    directRenewedFromContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

    activeGoverningZoneContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

    exactHistoricalObjectLineageContractId:
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_011C_PATH3_CELL_OBJECT_COMPOSITION_v1',

    exactHistoricalZoneLineageContractId:
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_011B_PATH3_CELL_ZONE_COMPOSITION_v1',

    retiredCompatibilityLineage:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.retiredCompatibilityLineage,

    sourceClass:
      'OBJECT_AUTHORITY_PUBLIC_STAGE_READABILITY_ALIGNMENT',

    matrix:
      'H-Earth',

    matrixRole:
      'Ground-View Matrix',

    activeCell:
      'H_EARTH_GROUND_CELL_001',

    sceneIdentity:
      'earth-water-air-survival-shoreline-manor',

    firstAction:
      'Inspect Ground',

    firstReadout:
      'Ground Condition Read',

    firstReceipt:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    contract:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT,

    publicStageContract:
      H_EARTH_GROUND_CELL_001_OBJECTS_PUBLIC_STAGE_CONTRACT,

    governingBoundaryReference:
      H_EARTH_STEP_034I_PUBLIC_STAGE_AUTHORITY_REFERENCE,

    upstreamCell:
      H_EARTH_GROUND_CELL_001,

    upstreamCellContract:
      H_EARTH_GROUND_CELL_001_CONTRACT,

    upstreamPath3Binding:
      H_EARTH_GROUND_CELL_001_PATH3_BINDING,

    upstreamCellSceneBinding:
      H_EARTH_GROUND_CELL_001_SCENE_BINDING,

    upstreamCellSpawnAnchorScope:
      H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,

    upstreamCellBoundaryFlags:
      H_EARTH_GROUND_CELL_001_BOUNDARY_FLAGS,

    upstreamCellReceipt:
      H_EARTH_GROUND_CELL_001_RECEIPT,

    upstreamRoom3UnblockReceipt:
      H_EARTH_ROOM_3_UNBLOCK_RECEIPT,

    upstreamZoneBoundaries:
      H_EARTH_ZONE_BOUNDARIES,

    upstreamZones:
      H_EARTH_GROUND_CELL_001_ZONES,

    upstreamZoneContract:
      H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,

    upstreamZoneBoundaryFlags:
      H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS,

    upstreamZoneIds:
      H_EARTH_GROUND_CELL_001_ZONE_IDS,

    upstreamZoneBoundaryRoles:
      H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES,

    upstreamZoneDescriptors:
      H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,

    upstreamZoneToObjectExpectation:
      H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION,

    upstreamZoneDownstreamInterface:
      H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE,

    upstreamZonesReceipt:
      H_EARTH_GROUND_CELL_001_ZONES_RECEIPT,

    upstreamObjectMappingUnblockReceipt:
      H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT,

    baselinePreserved:
      Object.freeze({
        H_EARTH_PRIMARY_INSPECTION_TARGET,
        H_EARTH_SUPPORTING_INSPECTION_TARGETS,
        H_EARTH_CONTEXT_OBJECTS,
        H_EARTH_GROUND_CELL_001_OBJECTS
      }),

    objectIds:
      H_EARTH_GROUND_CELL_001_OBJECT_IDS,

    canonicalObjectIdList:
      H_EARTH_GROUND_CELL_001_CANONICAL_OBJECT_ID_LIST,

    compositionModel:
      H_EARTH_GROUND_CELL_001_OBJECT_COMPOSITION_MODEL,

    compressionModel:
      H_EARTH_GROUND_CELL_001_OBJECT_COMPRESSION_MODEL,

    objectsByZoneMembershipPolicy:
      'PRIMARY_ZONE_MEMBERSHIP_ONLY',

    secondaryMembershipSource:
      'H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS.secondaryZoneId',

    publicStageRoles:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_ROLES,

    descriptorSurfaceClasses:
      H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_SURFACE_CLASSES,

    publicStageRoleMap:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_ROLE_MAP,

    publicReadability:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_READABILITY,

    publicVisibility:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_VISIBILITY,

    inspectionPriority:
      H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_PRIORITY,

    projectionOrder:
      H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION_ORDER,

    zoneBindings:
      H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS,

    legacyAddressBindings:
      H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS,

    legacySupportingAddressesPreserved: true,

    inspectionRoles:
      H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_ROLES,

    contextBoundaries:
      H_EARTH_GROUND_CELL_001_OBJECT_CONTEXT_BOUNDARIES,

    descriptors:
      H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS,

    descriptorProjection:
      H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTOR_PROJECTION,

    publicObjectDescriptors:
      H_EARTH_GROUND_CELL_001_PUBLIC_OBJECT_DESCRIPTORS,

    publicObjectsByRole:
      H_EARTH_GROUND_CELL_001_PUBLIC_OBJECTS_BY_ROLE,

    objectsByZone:
      H_EARTH_GROUND_CELL_001_OBJECTS_BY_ZONE,

    actionReference:
      H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE,

    readoutReference:
      H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE,

    receiptReference:
      H_EARTH_GROUND_CELL_001_OBJECT_TO_RECEIPT_REFERENCE,

    downstreamInterface:
      H_EARTH_GROUND_CELL_001_OBJECT_DOWNSTREAM_INTERFACE,

    publicStageReceipt:
      H_EARTH_GROUND_CELL_001_OBJECT_PUBLIC_STAGE_RECEIPT,

    receipt:
      H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT,

    actionBindingUnblockReceipt:
      H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT,

    publicStageReadabilityAlignment: true,
    publicStageAuthorityCreatedHere: false,
    step034IPublicStageAuthorityConsumed: true,
    step034KActiveZoneAuthorityConsumed: true,

    backupEvidenceOwnedExternally: true,
    driveOccurrenceEvidenceOwnedExternally: true,
    connectorReadbackEvidenceOwnedExternally: true,
    executionEvidenceOwnedExternally: true,
    importResolutionEvidenceOwnedExternally: true,
    moduleGraphEvidenceOwnedExternally: true,
    routeIntegrationEvidenceOwnedExternally: true,
    digestEvidenceOwnedExternally: true,
    replayEvidenceOwnedExternally: true,
    baselineDiffEvidenceOwnedExternally: true,
    legacyAddressEquivalenceEvidenceOwnedExternally: true,

    boundaryFlags:
      H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS,

    getHEarthGroundCell001ObjectDescriptor,
    getHEarthGroundCell001PublicObjectDescriptor,
    getHEarthGroundCell001ObjectZoneBinding,
    getHEarthGroundCell001ObjectAddressBinding,
    getHEarthGroundCell001ObjectsForZone,
    getHEarthGroundCell001PublicObjectsByRole,
    classifyHEarthGroundCell001PublicObjectRole,
    isHEarthGroundCell001PublicReadableObject,
    isHEarthGroundCell001PublicVisibleObject,
    isHEarthGroundCell001ObjectId,
    isHEarthGroundCell001InspectionObject,
    isHEarthGroundCell001ContextOnlyObject,
    getHEarthGroundCell001ObjectPublicStageReceipt,
    getHEarthGroundCell001ObjectsReceipt,
    getHEarthRoom4ActionBindingUnblockReceipt,

    getHEarthGroundCell001ZoneDescriptor,
    getHEarthGroundCell001ExpectedObjectsForZone
  });

export default H_EARTH_GROUND_CELL_001_OBJECTS_AGGREGATE;
