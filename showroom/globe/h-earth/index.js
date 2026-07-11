// /showroom/globe/h-earth/index.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034M_PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW_v1
//
// Renews:
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034E_PUBLIC_STAGE_ADAPTER_LAYER_4_STATUS_PROJECTION_v1
//
// Companion route shell:
// /showroom/globe/h-earth/index.html
// H_EARTH_3D_ROUTE_SHELL_FILE_RENEWAL_STEP_034C_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_PROJECTION_v1
//
// Companion stylesheet:
// /showroom/globe/h-earth/index.css
// H_EARTH_3D_ROUTE_SHELL_STYLE_FILE_RENEWAL_STEP_034D_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_SUPPORT_v1
//
// Diagnostic route:
// /showroom/globe/h-earth/diagnostic/
//
// Purpose:
// Public-stage adapter for the H-Earth environment host. This file connects the
// public route shell to a visible environment stage, selected-surface readout,
// compact public receipts, read-only Layer 4 / Step 012J status projection, and
// a descriptor-only source-state preview of the current backed H-Earth source
// spine.
//
// Step 034M renewal purpose:
// Turn the existing public-stage renderer mount on before final renderer
// geometry exists. The preview displays the backed source-domain model already
// established by Step 034I boundaries, Step 034J objects, Step 034K zones, and
// Step 034L landscape lattice alignment.
//
// Controlling relationship:
// STEP_012H_1_HEADLESS_REPLAY_FIXTURE_SIDE
//   ->
// STEP_012J_READ_ONLY_RELATIONSHIP_DESCRIPTOR
//   ->
// PUBLIC_STAGE_STATUS_PROJECTION
//
// Source-preview relationship:
// STEP_034I_BOUNDARY_AUTHORITY
//   ->
// STEP_034J_OBJECT_DESCRIPTOR_AUTHORITY
//   ->
// STEP_034K_ZONE_RENDER_TARGET_ALIGNMENT
//   ->
// STEP_034L_LANDSCAPE_LATTICE_ALIGNMENT
//   ->
// PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW
//
// Public-stage adapter rule:
// This file may read or dynamically import the Step 012J relationship
// descriptor when the deployed path supports it. If that import succeeds,
// normal JavaScript module initialization for Step 012J and its declared
// dependencies may be observed. That is not runner execution.
//
// This file may also attempt to import ./renderer.js after the source preview
// has already mounted. Renderer import or mount failure must not blank the
// source preview.
//
// The public stage must distinguish:
//
// MODULE_INITIALIZATION_OBSERVED
//
// from:
//
// RUN_FUNCTION_EXECUTED
// REPLAY_EXECUTED
// VECTOR_RUNNER_EXECUTED
// RUNTIME_EXECUTED
// CANONICAL_DIGEST_GENERATED
// REPLAY_COMPARISON
//
// The first may become true when Step 012J is imported.
// The others remain false.
//
// Boundary:
// Public route only.
// Environment host authorized.
// Visible stage authorized.
// Source-state preview authorized.
// Renderer mount support authorized as public-stage candidate display only.
// Read-only Step 012J descriptor projection authorized.
// Public-stage receipt definition authorized.
// Diagnostic route handoff authorized.
// Does not invoke Step 012H.1 run functions.
// Does not invoke Step 012I canonicalizers.
// Does not invoke Step 012I digest helpers.
// Does not invoke Step 012I snapshot functions.
// Does not invoke Step 012I vector runner.
// Does not invoke Target 002 runtime functions.
// Does not invoke Target 003 replay functions.
// Does not generate canonical digests.
// Does not compare replay results.
// Does not validate.
// Does not claim production.
// Does not claim renderer pass.
// Does not claim visual pass.
// Does not collapse the matrix.

export const H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID =
  'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034M_PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW_v1';

export const H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID =
  'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034E_PUBLIC_STAGE_ADAPTER_LAYER_4_STATUS_PROJECTION_v1';

export const H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID =
  'H_EARTH_3D_ROUTE_SHELL_FILE_RENEWAL_STEP_034C_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_PROJECTION_v1';

export const H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID =
  'H_EARTH_3D_ROUTE_SHELL_STYLE_FILE_RENEWAL_STEP_034D_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_SUPPORT_v1';

export const H_EARTH_3D_PUBLIC_ROUTE_FILE =
  '/showroom/globe/h-earth/index.js';

export const H_EARTH_3D_PUBLIC_ROUTE =
  '/showroom/globe/h-earth/';

export const H_EARTH_3D_DIAGNOSTIC_ROUTE =
  '/showroom/globe/h-earth/diagnostic/';

export const H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH =
  '../../../h-earth-3d/runtime/tests/h-earth.headless-serialization-bridge.js';

export const H_EARTH_3D_PUBLIC_RENDERER_MODULE_PATH =
  './renderer.js';

export const H_EARTH_3D_PUBLIC_STAGE_STATUS = Object.freeze({
  NOT_STARTED: 'PUBLIC_STAGE_NOT_STARTED',
  INITIALIZING: 'PUBLIC_STAGE_INITIALIZING',
  READY: 'PUBLIC_STAGE_READY',
  PARTIAL: 'PUBLIC_STAGE_PARTIAL',
  FALLBACK: 'PUBLIC_STAGE_FALLBACK',
  ERROR: 'PUBLIC_STAGE_ERROR'
});

export const H_EARTH_3D_LAYER_4_STATUS = Object.freeze({
  STATIC_METADATA_PROJECTED: 'LAYER_4_STATIC_METADATA_PROJECTED',
  DESCRIPTOR_IMPORT_PENDING: 'LAYER_4_DESCRIPTOR_IMPORT_PENDING',
  DESCRIPTOR_IMPORT_OBSERVED: 'LAYER_4_DESCRIPTOR_IMPORT_OBSERVED',
  DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED:
    'LAYER_4_DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED',
  DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED:
    'LAYER_4_DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED'
});

export const H_EARTH_3D_SOURCE_PREVIEW_STATUS = Object.freeze({
  NOT_STARTED: 'SOURCE_PREVIEW_NOT_STARTED',
  MOUNTED: 'SOURCE_PREVIEW_MOUNTED',
  HELD: 'SOURCE_PREVIEW_HELD',
  FAILED: 'SOURCE_PREVIEW_FAILED'
});

export const H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING = Object.freeze({
  moduleInitializationObservedMayBecomeTrue: true,

  sourcePreviewMounted: 'descriptor-only-public-stage-display',
  sourcePreviewRuntimeExecution: false,

  runFunctionExecuted: false,
  step012H1RunExecuted: false,
  step012IVectorExecuted: false,
  step012IRunnerExecuted: false,
  target002RuntimeExecuted: false,
  target003ReplayExecuted: false,
  runtimeExecuted: false,
  replayExecuted: false,
  vectorRunnerExecuted: false,
  canonicalDigestGenerated: false,
  replayComparison: false,

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,
  matrixCollapse: false
});

export const H_EARTH_3D_LAYER_4_CONTRACTS = Object.freeze({
  step012JContractId:
    'H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_FILE_BIRTH_STEP_012J_v1',

  step012H1ContractId:
    'H_EARTH_HEADLESS_REPLAY_CONTRACT_FILE_RENEWAL_STEP_012H_1_HISTORICAL_FIXTURE_ALIGNMENT_v1',

  step012IContractId:
    'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_FILE_BIRTH_STEP_012I_v1',

  step012ICanonicalizationId:
    'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_STEP_012I_UTF16_UTF8_SHA256_v1',

  target002ContractId:
    'H_EARTH_DETERMINISTIC_RUNTIME_FILE_RENEWAL_STEP_012G_TARGET_002_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

  target003ContractId:
    'H_EARTH_CANONICAL_REPLAY_FILE_RENEWAL_STEP_012G_TARGET_003_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

  step012IRunnerContractId:
    'H_EARTH_SERIALIZATION_VECTOR_RUNNER_FILE_BIRTH_STEP_012I_RUNNER_v1'
});

export const H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY = Object.freeze({
  custodyClass:
    'BACKED_STATIC_SUPPORT_METADATA_FOR_PUBLIC_STAGE_PROJECTION',

  step012JBackupComplete: true,
  step012JArchiveTitle:
    'h-earth-headless-serialization-bridge-step-012j-backup',
  step012JDriveDocumentId:
    '1zt8rsROGF8roudC3re1KOwmU5KSws6pQIap7kd0gQpw',

  step012H1ArchiveTitle:
    'h-earth-headless-replay-step-012h-1-backup',
  step012H1DriveDocumentId:
    '1DfSsDzKRYQNJn9S43hmA8gMeebY_7WeQ0ygoIl6Qt2Y',

  step012IArchiveTitle:
    'h-earth-canonical-state-serialization-law-step-012i-backup',
  step012IDriveDocumentId:
    '1K8bszh6SMeutLpCeyCjK6D9r8m6zsIEP3R6soBip6GA',

  step012IRunnerArchiveTitle:
    'h-earth-serialization-vector-runner-step-012i-backup',
  step012IRunnerDriveDocumentId:
    '1EcXxqb2M_MwdiHFVDX95klU4Dh6X1Be8Q5TFNDyCIUE',

  target002ArchiveTitle:
    'h-earth-deterministic-runtime-step-012g-target-002-backup',
  target002DriveDocumentId:
    '1AYVrqdmnBEdM5k4pop8wJNXMThXxdLZd7TNkhgkq2Z0',

  target003ArchiveTitle:
    'h-earth-canonical-replay-step-012g-target-003-backup',
  target003DriveDocumentId:
    '1qbNHRW9L3l7FjfJW04x30J9qNO9dNvWTR8b6Vh0C3vU',

  archiveCustodyStatus:
    'BACKED_OCCURRENCE_RECORDED_BY_CONSTRUCTION_BASIS',

  publicStageReverifiesDriveArchive: false,
  publicStageClaimsNetworkBackup: false
});

export const H_EARTH_3D_SOURCE_SPINE_CONTRACTS = Object.freeze({
  step034IBoundaryContractId:
    'H_EARTH_MATRIX_BOUNDARIES_FILE_RENEWAL_STEP_034I_PUBLIC_STAGE_AUTHORITY_AMENDMENT_v1',

  step034JObjectsContractId:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',

  step034KZonesContractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',

  step034LLandscapeLatticeContractId:
    'H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_RENEWAL_STEP_034L_LANDSCAPE_LATTICE_ZONE_AND_RENDER_TARGET_ALIGNMENT_v1'
});

export const H_EARTH_3D_SOURCE_SPINE_ARCHIVE_CUSTODY = Object.freeze({
  step034IArchiveTitle:
    'h-earth-matrix-boundaries-step-034i-public-stage-authority-amendment-backup',
  step034IDriveDocumentId:
    '1wLPI7frZHb8Xtq3Syrcnjc6xx3Rkn1LHfHLm12LQjQM',

  step034JArchiveTitle:
    'h-earth-ground-cell-001-objects-step-034j-public-stage-readability-amendment-backup',
  step034JDriveDocumentId:
    '1PLWtLG-BluKzgUO89SOwNTJk32DCQ1lfDAJWKDc_WO8',

  step034KArchiveTitle:
    'h-earth-ground-cell-001-zones-step-034k-public-stage-render-target-zone-alignment-backup',
  step034KDriveDocumentId:
    '1XV4IDS04Qop95QEw9o2w1KwJnO80JOZOjdn0gNZeNuI',

  step034LArchiveTitle:
    'h-earth-256-lattice-landscape-step-034l-zone-and-render-target-alignment-backup',
  step034LDriveDocumentId:
    '10HUxO6UsqD0CoSLIB4v6bgJpwLehVFH5bLY-n0jsQnU',

  sourceSpineBackupStatus:
    'BACKED_OCCURRENCES_RECORDED_BY_CONSTRUCTION_BASIS',

  publicStageReverifiesDriveArchive: false,
  publicStageClaimsNetworkBackup: false,
  assistantRepositoryInstallationVerified: false
});

export const H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS = Object.freeze({
  publicRouteOnly: true,
  publicEnvironmentHost: true,
  visibleStageAuthorized: true,
  rendererMountSupportAuthorized: true,
  sourcePreviewDisplayAuthorized: true,
  selectedSurfaceDisplayAuthorized: true,
  groundConditionReadDisplayAuthorized: true,
  layer4StatusProjectionAuthorized: true,
  publicStageReceiptDefinitionAuthorized: true,
  diagnosticRouteHandoffAuthorized: true,

  diagnosticWallEmbedded: false,
  reportWallEmbedded: false,
  rawEvidenceWallEmbedded: false,
  receiptWallEmbedded: false,
  advancedCopySurfaceEmbedded: false,

  shellOwnedSceneObjects: false,
  fakeSceneGeometry: false,
  sourcePreviewDescriptorOnly: true,
  sourcePreviewRuntimeExecution: false,

  webglActivation: false,
  canvasActivation: false,
  svgActivation: false,
  iframeActivation: false,

  step012H1RunExecution: false,
  step012IVectorExecution: false,
  step012IRunnerExecution: false,
  target002RuntimeExecution: false,
  target003ReplayExecution: false,
  canonicalDigestGeneration: false,
  replayComparison: false,

  runtimeActivation: false,
  routeActivationProof: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,

  traversal: false,
  survivalSimulation: false,
  swimming: false,
  fluidSimulation: false,
  manorInteriorAccess: false,
  distantTraversal: false,
  runtimeLatticeActivation: false,
  active16x16RuntimeLatticeClaim: false,
  active256AddressRuntimeClaim: false,
  mirrorManorRouteCanonNaming: false,
  matrixCollapse: false
});

export const H_EARTH_3D_PUBLIC_MOUNT_IDS = Object.freeze({
  routeRoot: 'h-earth-3d-route-root',
  status: 'h-earth-3d-status',
  fallback: 'h-earth-3d-fallback',
  rendererMount: 'h-earth-3d-renderer-mount',

  actionInspectGround: 'h-earth-3d-action-inspect-ground',

  selectedTargetCard: 'h-earth-3d-selected-target-card',
  selectedTargetLabel: 'h-earth-3d-selected-target-label',
  selectedTargetObjectId: 'h-earth-3d-selected-target-object-id',
  selectedTargetClassification:
    'h-earth-3d-selected-target-classification',

  publicReadoutTitle: 'h-earth-3d-public-readout-title',
  publicReadoutLine: 'h-earth-3d-public-readout-line',
  publicReadout: 'h-earth-3d-public-readout',

  targetList: 'h-earth-3d-target-list',

  layer4StatusCard: 'h-earth-3d-layer-4-status-card',
  layer4Status: 'h-earth-3d-layer-4-status',
  layer4Summary: 'h-earth-3d-layer-4-summary',
  layer4ProjectionPayload: 'h-earth-3d-layer-4-projection-payload',

  step012JContractId: 'h-earth-3d-step-012j-contract-id',
  step012H1ContractId: 'h-earth-3d-step-012h-1-contract-id',
  step012IContractId: 'h-earth-3d-step-012i-contract-id',
  step012ICanonicalizationId:
    'h-earth-3d-step-012i-canonicalization-id',

  inspectionPanel: 'h-earth-3d-inspection-panel',
  debug: 'h-earth-3d-debug',
  publicStageReceipt: 'h-earth-3d-public-stage-receipt',
  copyStatus: 'h-earth-3d-copy-status',

  diagnosticLink: 'h-earth-3d-diagnostic-link'
});

export const H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS = Object.freeze([
  Object.freeze({
    bandId: 'R16_HORIZON_ATMOSPHERE_COMPRESSION',
    label: 'R16 · Horizon / atmosphere compression',
    rowRange: 'R16',
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    depthClass: 'horizon',
    cssTop: '4%',
    cssHeight: '18%',
    summary:
      'Distant atmosphere and horizon compression above the first public shoreline cell.'
  }),

  Object.freeze({
    bandId: 'R14_R15_SPLIT_ELEVATED_MANOR_AND_OFFSHORE_ISLETS',
    label: 'R14–R15 · Elevated manor context / offshore islets',
    rowRange: 'R14-R15',
    zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE + ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    depthClass: 'context',
    cssTop: '19%',
    cssHeight: '18%',
    summary:
      'Split region: offshore rock stacks and islets on one side, elevated Mirror Manor context on the other.'
  }),

  Object.freeze({
    bandId: 'R12_R13_WATER_PLANE_AIR_HAZE_RELATION',
    label: 'R12–R13 · Water plane / air-haze relation',
    rowRange: 'R12-R13',
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    depthClass: 'water',
    cssTop: '35%',
    cssHeight: '16%',
    summary:
      'Open water plane and atmospheric-water relation before the nearshore band.'
  }),

  Object.freeze({
    bandId: 'R10_R11_NEARSHORE_WAVE_DEPTH_TRANSITION',
    label: 'R10–R11 · Nearshore wave / depth transition',
    rowRange: 'R10-R11',
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    depthClass: 'water',
    cssTop: '48%',
    cssHeight: '11%',
    summary:
      'Nearshore wave band and water-depth transition approaching shoreline contact.'
  }),

  Object.freeze({
    bandId: 'R08_R09_TIDE_POOLS_FOAM_SHORELINE_CONTACT',
    label: 'R08–R09 · Tide pools / foam / shoreline contact',
    rowRange: 'R08-R09',
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    depthClass: 'shoreline',
    cssTop: '57%',
    cssHeight: '12%',
    summary:
      'Foam line, tide pools, reflective puddles, and shoreline-contact field.'
  }),

  Object.freeze({
    bandId: 'R06_R07_DRY_SAND_TRANSITION',
    label: 'R06–R07 · Dry sand transition',
    rowRange: 'R06-R07',
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    depthClass: 'shoreline',
    cssTop: '67%',
    cssHeight: '13%',
    summary:
      'Dry-wet transition band between beach foreground and shoreline contact.'
  }),

  Object.freeze({
    bandId: 'R01_R05_FOREGROUND_WET_SAND_STONES_ROCKS',
    label: 'R01–R05 · Foreground wet sand / stones / jagged rocks',
    rowRange: 'R01-R05',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    depthClass: 'foreground',
    cssTop: '78%',
    cssHeight: '22%',
    summary:
      'Foreground inspection surface: wet sand, stones, rocks, and first Inspect Ground field.'
  })
]);

export const H_EARTH_3D_PUBLIC_TARGETS = Object.freeze([
  Object.freeze({
    objectId: 'OBJ_002_FOREGROUND_WET_SAND',
    label: 'Foreground Wet Sand',
    classification: 'PRIMARY_PUBLIC_INSPECTION_OBJECT',
    material: 'wet-sand',
    materialClass: 'h-earth-material-wet-sand',
    layerClass: 'h-earth-layer-foreground-wet-sand',
    landscapeClass: 'h-earth-landscape-ground-wet-sand',
    primitiveClass: 'h-earth-primitive-contoured-terrain-band',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    rowBand: 'R01-R05',
    previewRole: 'foreground inspection surface',
    xPercent: 50,
    yPercent: 87,
    widthCss: '112%',
    heightCss: '26%',
    action: 'Inspect Ground',
    readout: 'Ground Condition Read',
    receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    publicLine:
      'Foreground wet sand is the first readable surface. It is descriptor-only until a later authorized runtime execution lane exists.'
  }),

  Object.freeze({
    objectId: 'OBJ_003_DRY_SAND_TRANSITION',
    label: 'Dry Sand Transition',
    classification: 'SECONDARY_SURFACE_CONTEXT',
    material: 'dry-sand',
    materialClass: 'h-earth-material-dry-sand',
    layerClass: 'h-earth-layer-dry-sand-transition',
    landscapeClass: 'h-earth-landscape-ground-dry-sand',
    primitiveClass: 'h-earth-primitive-terrain-band',
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    rowBand: 'R06-R07',
    previewRole: 'dry-wet transition',
    xPercent: 50,
    yPercent: 73,
    widthCss: '106%',
    heightCss: '16%',
    action: 'Inspect Context',
    readout: 'Surface Context Read',
    receipt: 'H_EARTH_SURFACE_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Dry sand transition is public-stage context. It does not create traversal, survival simulation, or route activation.'
  }),

  Object.freeze({
    objectId: 'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    label: 'Tide Pools and Reflective Puddles',
    classification: 'SUPPORTING_PUBLIC_READABLE_OBJECT',
    material: 'tide-pool',
    materialClass: 'h-earth-material-tide-pool',
    layerClass: 'h-earth-layer-tide-pools-stones-rocks-detail',
    landscapeClass: 'h-earth-landscape-surface-detail',
    primitiveClass: 'h-earth-primitive-scatter-cluster',
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    rowBand: 'R08-R09',
    previewRole: 'low shoreline detail',
    xPercent: 38,
    yPercent: 63,
    widthCss: '15%',
    heightCss: '5%',
    action: 'Inspect Context',
    readout: 'Tide Pool Context Read',
    receipt: 'H_EARTH_TIDE_POOL_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Tide pools are readable shoreline detail. They do not activate swimming, fluid simulation, or survival simulation.'
  }),

  Object.freeze({
    objectId: 'OBJ_005_SHORELINE_FOAM_LINE',
    label: 'Shoreline Foam Line',
    classification: 'SUPPORTING_PUBLIC_READABLE_OBJECT',
    material: 'foam',
    materialClass: 'h-earth-material-foam',
    layerClass: 'h-earth-layer-shoreline-foam-line',
    landscapeClass: 'h-earth-landscape-shoreline-band',
    primitiveClass: 'h-earth-primitive-irregular-shoreline-band',
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    rowBand: 'R08-R09',
    previewRole: 'shoreline surf boundary',
    xPercent: 50,
    yPercent: 57,
    widthCss: '96%',
    heightCss: '3%',
    action: 'Inspect Context',
    readout: 'Shoreline Context Read',
    receipt: 'H_EARTH_SHORELINE_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'The shoreline foam line marks the public surf boundary. It does not activate swimming, fluid simulation, or traversal.'
  }),

  Object.freeze({
    objectId: 'OBJ_006_NEARSHORE_WAVE_BAND',
    label: 'Nearshore Wave Band',
    classification: 'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',
    material: 'nearshore-wave',
    materialClass: 'h-earth-material-nearshore-wave',
    layerClass: 'h-earth-layer-nearshore-wave-band',
    landscapeClass: 'h-earth-landscape-nearshore-wave',
    primitiveClass: 'h-earth-primitive-water-depth-band',
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    rowBand: 'R10-R11',
    previewRole: 'nearshore wave band',
    xPercent: 50,
    yPercent: 50,
    widthCss: '104%',
    heightCss: '6%',
    action: 'Inspect Context',
    readout: 'Nearshore Context Read',
    receipt: 'H_EARTH_NEARSHORE_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Nearshore wave band is context-only in the public stage. It does not activate swimming, fluid simulation, or traversal.'
  }),

  Object.freeze({
    objectId: 'OBJ_007_WATER_SURFACE_PLANE',
    label: 'Water Surface Plane',
    classification: 'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',
    material: 'water',
    materialClass: 'h-earth-material-water',
    layerClass: 'h-earth-layer-water-surface-plane',
    landscapeClass: 'h-earth-landscape-water-plane',
    primitiveClass: 'h-earth-primitive-water-plane',
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    rowBand: 'R12-R13',
    previewRole: 'ocean body',
    xPercent: 50,
    yPercent: 40,
    widthCss: '112%',
    heightCss: '22%',
    action: 'Inspect Context',
    readout: 'Water Plane Context Read',
    receipt: 'H_EARTH_WATER_PLANE_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Water surface plane is public-stage ocean context. It does not activate swimming, fluid simulation, or survival simulation.'
  }),

  Object.freeze({
    objectId: 'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    label: 'Air Haze Light Layer',
    classification: 'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',
    material: 'air-haze',
    materialClass: 'h-earth-material-air-haze',
    layerClass: 'h-earth-layer-air-haze-light',
    landscapeClass: 'h-earth-landscape-air-haze-light',
    primitiveClass: 'h-earth-primitive-atmospheric-layer',
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    rowBand: 'R12-R16',
    previewRole: 'atmosphere and distance light',
    xPercent: 50,
    yPercent: 24,
    widthCss: '114%',
    heightCss: '32%',
    action: 'Inspect Context',
    readout: 'Atmospheric Context Read',
    receipt: 'H_EARTH_ATMOSPHERIC_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Air haze and light are atmospheric context. They do not create weather simulation, traversal, or validation proof.'
  }),

  Object.freeze({
    objectId: 'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    label: 'Mirror Manor Exterior Context',
    classification: 'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',
    material: 'manor-context',
    materialClass: 'h-earth-material-manor-context',
    layerClass: 'h-earth-layer-manor-exterior-context',
    landscapeClass: 'h-earth-landscape-manor-context',
    primitiveClass: 'h-earth-primitive-layered-silhouette',
    zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE',
    rowBand: 'R14-R15',
    previewRole: 'elevated hill or cliff context',
    xPercent: 71,
    yPercent: 29,
    widthCss: '13%',
    heightCss: '13%',
    action: 'Inspect Context',
    readout: 'Distant Context Read',
    receipt: 'H_EARTH_MANOR_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Mirror Manor is visible as elevated exterior context. It does not grant manor interior access or distant traversal.'
  }),

  Object.freeze({
    objectId: 'OBJ_010_SMALL_BEACH_STONES',
    label: 'Small Beach Stones',
    classification: 'SUPPORTING_PUBLIC_READABLE_OBJECT',
    material: 'stone',
    materialClass: 'h-earth-material-stone',
    layerClass: 'h-earth-layer-tide-pools-stones-rocks-detail',
    landscapeClass: 'h-earth-landscape-ground-scatter-cluster',
    primitiveClass: 'h-earth-primitive-scatter-cluster',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    rowBand: 'R01-R05',
    previewRole: 'foreground beach texture',
    xPercent: 57,
    yPercent: 82,
    widthCss: '4%',
    heightCss: '3%',
    action: 'Inspect Context',
    readout: 'Stone Context Read',
    receipt: 'H_EARTH_STONE_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Small beach stones support the foreground inspection surface. They do not create collision, traversal, or gameplay authority.'
  }),

  Object.freeze({
    objectId: 'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    label: 'Foreground Jagged Rocks',
    classification: 'SUPPORTING_PUBLIC_READABLE_OBJECT',
    material: 'jagged-rock',
    materialClass: 'h-earth-material-jagged-rock',
    layerClass: 'h-earth-layer-tide-pools-stones-rocks-detail',
    landscapeClass: 'h-earth-landscape-foreground-rocks',
    primitiveClass: 'h-earth-primitive-rock-cluster',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    rowBand: 'R01-R05',
    previewRole: 'foreground rocky edge',
    xPercent: 22,
    yPercent: 84,
    widthCss: '10%',
    heightCss: '9%',
    action: 'Inspect Context',
    readout: 'Foreground Rock Context Read',
    receipt: 'H_EARTH_ROCK_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Foreground jagged rocks support the visible inspection field. They do not create traversal, collision, or gameplay authority.'
  }),

  Object.freeze({
    objectId: 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',
    label: 'Distance Rock Stacks and Islets',
    classification: 'CONTEXT_ONLY_PUBLIC_VISIBLE_OBJECT',
    material: 'distant-rock',
    materialClass: 'h-earth-material-distant-rock',
    layerClass: 'h-earth-layer-distant-world-context',
    landscapeClass: 'h-earth-landscape-distant-world-context',
    primitiveClass: 'h-earth-primitive-distant-cluster',
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    rowBand: 'R14-R15',
    previewRole: 'offshore distant forms',
    xPercent: 28,
    yPercent: 31,
    widthCss: '17%',
    heightCss: '8%',
    action: 'Inspect Context',
    readout: 'Distant Islet Context Read',
    receipt: 'H_EARTH_DISTANT_ISLET_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Distant rock stacks and islets remain context-only. They do not grant distant traversal or route-canon authority.'
  }),

  Object.freeze({
    objectId: 'OBJ_001_GROUND_SPAWN_ANCHOR',
    label: 'Ground Spawn Anchor',
    classification: 'STRUCTURAL_NOT_PUBLIC_READABLE',
    material: 'inspection-anchor',
    materialClass: 'h-earth-material-inspection-anchor',
    layerClass: 'h-earth-layer-inspection-anchor-overlay',
    landscapeClass: 'h-earth-landscape-primary-inspection-anchor',
    primitiveClass: 'h-earth-primitive-inspection-anchor',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    rowBand: 'R01-R05',
    previewRole: 'structural anchor only',
    xPercent: 50,
    yPercent: 84,
    widthCss: '2.4rem',
    heightCss: '2.4rem',
    action: 'Inspect Ground',
    readout: 'Ground Condition Read',
    receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    publicLine:
      'Ground spawn anchor is structural only. It is displayed as an anchor marker, not as player/avatar authority.'
  })
]);

export const H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_MODEL = Object.freeze({
  previewId: 'H_EARTH_3D_PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW_STEP_034M',
  file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
  contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
  renewedFrom: H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,

  previewClass:
    'DESCRIPTOR_ONLY_PUBLIC_STAGE_SOURCE_STATE_PREVIEW',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  displayPurpose:
    'Turn the public-stage screen on by showing the current backed source model before final geometry renewal.',

  sourceSpineContracts: H_EARTH_3D_SOURCE_SPINE_CONTRACTS,
  sourceSpineArchiveCustody: H_EARTH_3D_SOURCE_SPINE_ARCHIVE_CUSTODY,

  rowBandProgression:
    'R01-R05 foreground wet sand/stones/rocks; R06-R07 dry sand transition; R08-R09 tide pools/foam/shoreline contact; R10-R11 nearshore waves; R12-R13 water plane/air relation; R14-R15 split elevated manor/offshore islets; R16 distant atmosphere/horizon compression',

  bands: H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS,
  objects: H_EARTH_3D_PUBLIC_TARGETS,

  descriptorOnly: true,
  publicStagePreviewOnly: true,
  rendererDependencyRequired: false,
  rendererMayUpgradeLater: true,
  rendererFailureMayBlankPreview: false,

  runtimeExecution: false,
  runtimeLatticeActivation: false,
  active16x16RuntimeClaim: false,
  active256AddressRuntimeClaim: false,
  traversalClaim: false,
  survivalSimulationClaim: false,
  swimmingClaim: false,
  fluidSimulationClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  matrixCollapse: false,

  boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
});

const MODULE_STATE = {
  initialized: false,
  status: H_EARTH_3D_PUBLIC_STAGE_STATUS.NOT_STARTED,

  mountPoints: null,
  selectedTargetId: 'OBJ_002_FOREGROUND_WET_SAND',

  generatedAt: null,

  sourcePreviewStatus: H_EARTH_3D_SOURCE_PREVIEW_STATUS.NOT_STARTED,
  sourcePreviewReceipt: null,

  rendererImportReceipt: null,
  rendererMountReceipt: null,

  layer4ImportReceipt: null,
  layer4StatusProjection: null,
  layer4PublicStageReceipt: null,

  routeBootstrapReceipt: null,
  routeBootstrapResult: null,

  asyncInitializationStarted: false,
  asyncInitializationComplete: false
};

function nowIso() {
  return new Date().toISOString();
}

function freeze(value) {
  return Object.freeze(value);
}

function getDocumentFromOptions(options = {}) {
  return options.document || globalThis.document || null;
}

function getById(rootDocument, id) {
  if (!rootDocument || typeof rootDocument.getElementById !== 'function') {
    return null;
  }

  return rootDocument.getElementById(id);
}

function safeSerialize(value, options = {}) {
  const maxDepth =
    Number.isFinite(options.maxDepth) ? options.maxDepth : 7;
  const maxArrayLength =
    Number.isFinite(options.maxArrayLength) ? options.maxArrayLength : 120;

  const seen = new WeakSet();

  function visit(input, depth) {
    if (input === null) return null;

    const type = typeof input;

    if (
      type === 'string' ||
      type === 'number' ||
      type === 'boolean'
    ) {
      if (typeof input === 'number' && !Number.isFinite(input)) {
        return String(input);
      }

      return input;
    }

    if (type === 'bigint') return String(input);
    if (type === 'undefined') return null;
    if (type === 'function') return `[Function ${input.name || 'anonymous'}]`;
    if (type === 'symbol') return String(input);

    if (depth > maxDepth) return '[MaxDepthExceeded]';

    if (type === 'object') {
      if (seen.has(input)) return '[Circular]';
      seen.add(input);

      if (Array.isArray(input)) {
        const output = input
          .slice(0, maxArrayLength)
          .map((entry) => visit(entry, depth + 1));

        if (input.length > maxArrayLength) {
          output.push(`[ArrayTruncated ${input.length - maxArrayLength}]`);
        }

        return output;
      }

      const output = {};

      Object.keys(input).forEach((key) => {
        if (
          key === 'document' ||
          key === 'ownerDocument' ||
          key === 'mountNode' ||
          key === 'routeRoot' ||
          key === 'statusNode' ||
          key === 'fallbackNode' ||
          key === 'rendererMount' ||
          key === 'target' ||
          key === 'objectNode' ||
          key === 'rootNode'
        ) {
          output[key] = '[DOMNodeOmitted]';
          return;
        }

        output[key] = visit(input[key], depth + 1);
      });

      return output;
    }

    return String(input);
  }

  return visit(value, 0);
}

function stringifyPayload(value, options = {}) {
  return JSON.stringify(
    safeSerialize(value, options),
    null,
    2
  );
}

function writeText(node, value) {
  if (!node) return false;
  node.textContent = String(value ?? '');
  return true;
}

function writeJson(node, value, options = {}) {
  if (!node) return false;
  node.textContent = stringifyPayload(value, options);
  return true;
}

function setDatasetBoolean(node, key, value) {
  if (!node?.dataset) return false;
  node.dataset[key] = value === true ? 'true' : 'false';
  return true;
}

function setRouteClass(routeRoot, className) {
  if (!routeRoot) return false;

  routeRoot.classList.remove(
    'h-earth-3d-boot-ready',
    'h-earth-3d-boot-fallback',
    'h-earth-3d-boot-error'
  );

  if (className) {
    routeRoot.classList.add(className);
  }

  return true;
}

function normalizePreviewToken(value, fallback = 'unresolved') {
  return (
    String(value || fallback)
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || fallback
  );
}

function resolveMountPoints(rootDocument = globalThis.document) {
  const ids = H_EARTH_3D_PUBLIC_MOUNT_IDS;

  const routeRoot = getById(rootDocument, ids.routeRoot);
  const statusNode = getById(rootDocument, ids.status);
  const fallbackNode = getById(rootDocument, ids.fallback);
  const rendererMount = getById(rootDocument, ids.rendererMount);

  const missingRequiredIds = [];

  if (!routeRoot) missingRequiredIds.push(ids.routeRoot);
  if (!statusNode) missingRequiredIds.push(ids.status);
  if (!fallbackNode) missingRequiredIds.push(ids.fallback);
  if (!rendererMount) missingRequiredIds.push(ids.rendererMount);

  return freeze({
    documentAvailable:
      Boolean(rootDocument && typeof rootDocument.getElementById === 'function'),
    routeRoot,
    statusNode,
    fallbackNode,
    rendererMount,

    actionInspectGround:
      getById(rootDocument, ids.actionInspectGround),

    selectedTargetCard:
      getById(rootDocument, ids.selectedTargetCard),
    selectedTargetLabel:
      getById(rootDocument, ids.selectedTargetLabel),
    selectedTargetObjectId:
      getById(rootDocument, ids.selectedTargetObjectId),
    selectedTargetClassification:
      getById(rootDocument, ids.selectedTargetClassification),

    publicReadoutTitle:
      getById(rootDocument, ids.publicReadoutTitle),
    publicReadoutLine:
      getById(rootDocument, ids.publicReadoutLine),
    publicReadout:
      getById(rootDocument, ids.publicReadout),

    targetList:
      getById(rootDocument, ids.targetList),

    layer4StatusCard:
      getById(rootDocument, ids.layer4StatusCard),
    layer4Status:
      getById(rootDocument, ids.layer4Status),
    layer4Summary:
      getById(rootDocument, ids.layer4Summary),
    layer4ProjectionPayload:
      getById(rootDocument, ids.layer4ProjectionPayload),

    step012JContractId:
      getById(rootDocument, ids.step012JContractId),
    step012H1ContractId:
      getById(rootDocument, ids.step012H1ContractId),
    step012IContractId:
      getById(rootDocument, ids.step012IContractId),
    step012ICanonicalizationId:
      getById(rootDocument, ids.step012ICanonicalizationId),

    inspectionPanel:
      getById(rootDocument, ids.inspectionPanel),
    debug:
      getById(rootDocument, ids.debug),
    publicStageReceipt:
      getById(rootDocument, ids.publicStageReceipt),
    copyStatus:
      getById(rootDocument, ids.copyStatus),

    diagnosticLink:
      getById(rootDocument, ids.diagnosticLink),

    requiredFound: missingRequiredIds.length === 0,
    missingRequiredIds: freeze(missingRequiredIds)
  });
}

function getTarget(targetId) {
  return (
    H_EARTH_3D_PUBLIC_TARGETS.find((target) => target.objectId === targetId) ||
    H_EARTH_3D_PUBLIC_TARGETS[0]
  );
}

function buildGroundConditionReadPayload(target = getTarget(MODULE_STATE.selectedTargetId)) {
  return freeze({
    receiptType: 'H_EARTH_3D_PUBLIC_GROUND_CONDITION_READ_PAYLOAD',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    selectedObjectId: target.objectId,
    selectedObjectLabel: target.label,
    selectedObjectClassification: target.classification,
    selectedMaterial: target.material,
    selectedZoneId: target.zoneId,
    selectedRowBand: target.rowBand,
    selectedPreviewRole: target.previewRole,

    action: target.action,
    readout: target.readout,
    receipt: target.receipt,
    publicLine: target.publicLine,

    descriptorOnly: true,
    runtimeActionExecutionClaim: false,
    receiptPersistenceClaim: false,
    survivalSimulationClaim: false,
    traversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    manorInteriorAccessClaim: false,
    distantTraversalClaim: false,
    validationClaim: false,
    productionClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function renderSelectedTarget(mountPoints, target) {
  if (!mountPoints || !target) return false;

  writeText(mountPoints.selectedTargetLabel, target.label);
  writeText(mountPoints.selectedTargetObjectId, target.objectId);
  writeText(mountPoints.selectedTargetClassification, target.classification);

  writeText(
    mountPoints.publicReadoutTitle,
    `${target.label} · ${target.action}`
  );

  writeText(
    mountPoints.publicReadoutLine,
    target.publicLine
  );

  writeJson(
    mountPoints.inspectionPanel,
    buildGroundConditionReadPayload(target),
    { maxDepth: 8, maxArrayLength: 120 }
  );

  return true;
}

function renderTargetList(mountPoints) {
  if (!mountPoints?.targetList || !mountPoints.targetList.ownerDocument) {
    return false;
  }

  const rootDocument = mountPoints.targetList.ownerDocument;

  mountPoints.targetList.textContent = '';

  H_EARTH_3D_PUBLIC_TARGETS.forEach((target) => {
    const button = rootDocument.createElement('button');
    button.type = 'button';
    button.className = 'h-earth-3d-target-button';
    button.dataset.hEarthTargetId = target.objectId;
    button.dataset.hEarthTargetClassification = target.classification;
    button.dataset.hEarthZoneId = target.zoneId;
    button.dataset.hEarthRowBand = target.rowBand;
    button.setAttribute(
      'aria-current',
      target.objectId === MODULE_STATE.selectedTargetId ? 'true' : 'false'
    );

    button.textContent = `${target.label} · ${target.classification}`;

    button.addEventListener('click', () => {
      MODULE_STATE.selectedTargetId = target.objectId;

      Array.from(
        mountPoints.targetList.querySelectorAll('[data-h-earth-target-id]')
      ).forEach((node) => {
        node.setAttribute(
          'aria-current',
          node.getAttribute('data-h-earth-target-id') === target.objectId
            ? 'true'
            : 'false'
        );
      });

      renderSelectedTarget(mountPoints, target);
      markPreviewSelectedObject(mountPoints, target.objectId);
      rebuildAndRenderPublicReceipts(mountPoints);
    });

    mountPoints.targetList.appendChild(button);
  });

  return true;
}

function clearSourcePreviewOwnedNodes(rendererMount) {
  if (!rendererMount || typeof rendererMount.querySelectorAll !== 'function') {
    return freeze({
      cleared: false,
      removedCount: 0,
      failureCode: 'RENDERER_MOUNT_UNAVAILABLE'
    });
  }

  const ownedNodes = Array.from(
    rendererMount.querySelectorAll('[data-h-earth-source-preview-owned="true"]')
  );

  ownedNodes.forEach((node) => node.remove());

  return freeze({
    cleared: true,
    removedCount: ownedNodes.length
  });
}

function createPreviewLayer(rootDocument, layerClass, layerId) {
  const layer = rootDocument.createElement('div');

  layer.className = [
    'h-earth-render-layer',
    layerClass,
    'h-earth-layer-member'
  ].join(' ');

  layer.dataset.hEarthSourcePreviewOwned = 'true';
  layer.dataset.hEarthSourcePreviewLayer = 'true';
  layer.dataset.hEarthLayerId = layerId;

  return layer;
}

function createPreviewLabel(rootDocument, target) {
  const label = rootDocument.createElement('span');

  label.className = 'h-earth-render-label';
  label.dataset.hEarthSourcePreviewOwned = 'true';
  label.dataset.hEarthSourcePreviewLabel = 'true';
  label.textContent = target.label;

  return label;
}

function createPreviewObject(rootDocument, target) {
  const objectNode = rootDocument.createElement('button');

  objectNode.type = 'button';
  objectNode.className = [
    'h-earth-render-object',
    'h-earth-render-descriptor-only',
    target.materialClass,
    target.landscapeClass,
    target.primitiveClass,
    `h-earth-object-${normalizePreviewToken(target.objectId)}`,
    `h-earth-source-object-${normalizePreviewToken(target.objectId)}`,
    `h-earth-parent-object-${normalizePreviewToken(target.objectId)}`,
    target.classification === 'PRIMARY_PUBLIC_INSPECTION_OBJECT'
      ? 'h-earth-context-primary-inspection h-earth-target-inspectable h-earth-target-selectable'
      : target.classification === 'SUPPORTING_PUBLIC_READABLE_OBJECT'
        ? 'h-earth-context-supporting-inspection h-earth-target-inspectable h-earth-target-selectable'
        : target.classification === 'STRUCTURAL_NOT_PUBLIC_READABLE'
          ? 'h-earth-context-only h-earth-target-context-only'
          : 'h-earth-context-only h-earth-target-context-only'
  ].filter(Boolean).join(' ');

  objectNode.dataset.hEarthSourcePreviewOwned = 'true';
  objectNode.dataset.hEarthSourcePreviewObject = 'true';
  objectNode.dataset.hEarthObjectId = target.objectId;
  objectNode.dataset.hEarthObjectLabel = target.label;
  objectNode.dataset.hEarthObjectClassification = target.classification;
  objectNode.dataset.hEarthZoneId = target.zoneId;
  objectNode.dataset.hEarthRowBand = target.rowBand;
  objectNode.dataset.hEarthPreviewRole = target.previewRole;
  objectNode.dataset.hEarthDescriptorOnly = 'true';
  objectNode.dataset.hEarthRendererProof = 'false';
  objectNode.dataset.hEarthVisualPassClaim = 'false';
  objectNode.dataset.hEarthValidationClaim = 'false';
  objectNode.dataset.hEarthProductionClaim = 'false';

  objectNode.setAttribute('aria-label', `${target.label}: ${target.previewRole}`);
  objectNode.style.left = `${target.xPercent}%`;
  objectNode.style.top = `${target.yPercent}%`;
  objectNode.style.width = target.widthCss;
  objectNode.style.height = target.heightCss;
  objectNode.style.transform =
    'translate3d(-50%, -50%, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1)';

  objectNode.addEventListener('click', () => {
    MODULE_STATE.selectedTargetId = target.objectId;

    const mountPoints = MODULE_STATE.mountPoints;
    renderSelectedTarget(mountPoints, target);
    markPreviewSelectedObject(mountPoints, target.objectId);

    if (mountPoints?.targetList) {
      Array.from(
        mountPoints.targetList.querySelectorAll('[data-h-earth-target-id]')
      ).forEach((node) => {
        node.setAttribute(
          'aria-current',
          node.getAttribute('data-h-earth-target-id') === target.objectId
            ? 'true'
            : 'false'
        );
      });
    }

    rebuildAndRenderPublicReceipts(mountPoints);
  });

  objectNode.appendChild(createPreviewLabel(rootDocument, target));

  return objectNode;
}

function createPreviewBand(rootDocument, band) {
  const bandNode = rootDocument.createElement('div');

  bandNode.className = 'h-earth-source-preview-band';
  bandNode.dataset.hEarthSourcePreviewOwned = 'true';
  bandNode.dataset.hEarthSourcePreviewBand = band.bandId;
  bandNode.dataset.hEarthRowRange = band.rowRange;
  bandNode.dataset.hEarthZoneId = band.zoneId;
  bandNode.dataset.hEarthDepthClass = band.depthClass;
  bandNode.setAttribute('aria-label', band.label);
  bandNode.style.position = 'absolute';
  bandNode.style.left = '0';
  bandNode.style.right = '0';
  bandNode.style.top = band.cssTop;
  bandNode.style.height = band.cssHeight;
  bandNode.style.borderTop = '1px solid rgba(255, 255, 255, 0.045)';
  bandNode.style.pointerEvents = 'none';

  return bandNode;
}

function createPreviewCaption(rootDocument) {
  const caption = rootDocument.createElement('div');

  caption.className = 'h-earth-source-preview-caption';
  caption.dataset.hEarthSourcePreviewOwned = 'true';
  caption.dataset.hEarthSourcePreviewCaption = 'true';
  caption.style.position = 'absolute';
  caption.style.left = '18px';
  caption.style.top = '18px';
  caption.style.zIndex = '220';
  caption.style.maxWidth = 'min(520px, calc(100% - 36px))';
  caption.style.padding = '10px 12px';
  caption.style.border = '1px solid rgba(149, 213, 232, 0.22)';
  caption.style.borderRadius = '12px';
  caption.style.background = 'rgba(7, 16, 25, 0.62)';
  caption.style.color = 'rgba(237, 247, 251, 0.86)';
  caption.style.fontSize = '0.76rem';
  caption.style.lineHeight = '1.35';
  caption.style.pointerEvents = 'none';

  caption.textContent =
    'Screen-on source preview · Step 034I–034L descriptor model · no runtime, no renderer proof, no visual-pass claim.';

  return caption;
}

function createPreviewRoot(rootDocument) {
  const previewRoot = rootDocument.createElement('div');

  previewRoot.className = [
    'h-earth-render-root',
    'h-earth-css-3d-candidate-root',
    'h-earth-render-scene',
    'h-earth-source-preview-root'
  ].join(' ');

  previewRoot.dataset.hEarthSourcePreviewOwned = 'true';
  previewRoot.dataset.hEarthSourcePreviewRoot = 'true';
  previewRoot.dataset.hEarthPreviewContract =
    H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID;
  previewRoot.dataset.hEarthDescriptorOnly = 'true';
  previewRoot.dataset.hEarthRuntimeExecution = 'false';
  previewRoot.dataset.hEarthRendererProof = 'false';
  previewRoot.dataset.hEarthVisualPassClaim = 'false';
  previewRoot.dataset.hEarthValidationClaim = 'false';
  previewRoot.dataset.hEarthProductionClaim = 'false';
  previewRoot.dataset.hEarthMatrixCollapse = 'false';

  return previewRoot;
}

function markPreviewSelectedObject(mountPoints, objectId) {
  const rendererMount = mountPoints?.rendererMount;

  if (!rendererMount || typeof rendererMount.querySelectorAll !== 'function') {
    return false;
  }

  Array.from(
    rendererMount.querySelectorAll('[data-h-earth-source-preview-object="true"]')
  ).forEach((node) => {
    const selected =
      node.getAttribute('data-h-earth-object-id') === objectId;

    node.setAttribute('aria-current', selected ? 'true' : 'false');

    if (selected) {
      node.classList.add('h-earth-context-primary-inspection');
      node.classList.add('h-earth-target-inspectable');
    } else if (
      node.dataset.hEarthObjectClassification !== 'PRIMARY_PUBLIC_INSPECTION_OBJECT'
    ) {
      node.classList.remove('h-earth-context-primary-inspection');
    }
  });

  return true;
}

function renderPublicSourcePreview(mountPoints) {
  const rendererMount = mountPoints?.rendererMount;

  if (!rendererMount || !rendererMount.ownerDocument) {
    MODULE_STATE.sourcePreviewStatus =
      H_EARTH_3D_SOURCE_PREVIEW_STATUS.FAILED;

    MODULE_STATE.sourcePreviewReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      generatedAt: nowIso(),
      sourcePreviewStatus: MODULE_STATE.sourcePreviewStatus,
      mounted: false,
      failureCode: 'RENDERER_MOUNT_UNAVAILABLE',
      descriptorOnly: true,
      rendererDependencyRequired: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

    return MODULE_STATE.sourcePreviewReceipt;
  }

  const rootDocument = rendererMount.ownerDocument;
  const clearResult = clearSourcePreviewOwnedNodes(rendererMount);
  const previewRoot = createPreviewRoot(rootDocument);

  const bandLayer = createPreviewLayer(
    rootDocument,
    'h-earth-layer-air-haze-light',
    'source-preview-band-overlay-layer'
  );

  H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS.forEach((band) => {
    bandLayer.appendChild(createPreviewBand(rootDocument, band));
  });

  previewRoot.appendChild(bandLayer);

  const layersByClass = new Map();

  H_EARTH_3D_PUBLIC_TARGETS.forEach((target) => {
    if (!layersByClass.has(target.layerClass)) {
      layersByClass.set(
        target.layerClass,
        createPreviewLayer(
          rootDocument,
          target.layerClass,
          target.layerClass.replace(/^h-earth-layer-/, '')
        )
      );
    }

    const layer = layersByClass.get(target.layerClass);
    layer.appendChild(createPreviewObject(rootDocument, target));
  });

  Array.from(layersByClass.values()).forEach((layer) => {
    previewRoot.appendChild(layer);
  });

  previewRoot.appendChild(createPreviewCaption(rootDocument));
  rendererMount.appendChild(previewRoot);

  markPreviewSelectedObject(mountPoints, MODULE_STATE.selectedTargetId);

  MODULE_STATE.sourcePreviewStatus =
    H_EARTH_3D_SOURCE_PREVIEW_STATUS.MOUNTED;

  MODULE_STATE.sourcePreviewReceipt = freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    renewedFrom: H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,
    generatedAt: nowIso(),

    sourcePreviewStatus: MODULE_STATE.sourcePreviewStatus,
    mounted: true,
    rendererMountNodeFound: true,
    priorSourcePreviewNodesCleared: clearResult.cleared === true,
    priorSourcePreviewNodeCountRemoved: clearResult.removedCount || 0,

    previewModel: H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_MODEL,
    sourceSpineContracts: H_EARTH_3D_SOURCE_SPINE_CONTRACTS,
    sourceSpineArchiveCustody: H_EARTH_3D_SOURCE_SPINE_ARCHIVE_CUSTODY,

    displayedBandCount:
      H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS.length,
    displayedObjectCount:
      H_EARTH_3D_PUBLIC_TARGETS.length,
    selectedTargetId:
      MODULE_STATE.selectedTargetId,

    descriptorOnly: true,
    publicStagePreviewOnly: true,
    rendererDependencyRequired: false,
    rendererMayUpgradeLater: true,
    rendererFailureMayBlankPreview: false,

    sourcePreviewCreatesDomNodes: true,
    sourcePreviewCreatesDomCssCandidateDisplayOnly: true,
    sourcePreviewClaimsRendererMount: false,
    finalRendererClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,

    runtimeExecution: false,
    runtimeLatticeActivation: false,
    active16x16RuntimeClaim: false,
    active256AddressRuntimeClaim: false,
    traversalClaim: false,
    survivalSimulationClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    manorInteriorAccessClaim: false,
    distantTraversalClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });

  globalThis.H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT =
    MODULE_STATE.sourcePreviewReceipt;

  return MODULE_STATE.sourcePreviewReceipt;
}

function buildStaticLayer4Projection(status = H_EARTH_3D_LAYER_4_STATUS.STATIC_METADATA_PROJECTED) {
  return freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_LAYER_4_STATUS_PROJECTION',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    projectionClass:
      'NARROW_PUBLIC_STAGE_PLAIN_DATA_PROJECTION',

    bridgeStatus: status,
    bridgeMode:
      'STEP_012J_READ_ONLY_RELATIONSHIP_DESCRIPTOR',

    step012JContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012JContractId,
    step012H1ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012H1ContractId,
    step012IContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012IContractId,
    step012ICanonicalizationId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012ICanonicalizationId,

    relationshipMembers: freeze({
      step012H1HeadlessReplayFixtureSide: true,
      step012ICanonicalSerializationLawMember: true,
      step012IRunnerRelationshipMember: false,
      target002IdentifiedSupportSurface: true,
      target003IdentifiedSupportSurface: true
    }),

    target002ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.target002ContractId,
    target003ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.target003ContractId,
    step012IRunnerContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012IRunnerContractId,

    archiveCustodyStatus:
      H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY.archiveCustodyStatus,
    archiveCustody: H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY,

    moduleImportAttempted: false,
    moduleInitializationObserved: false,
    importedDescriptorContractMatchesExpected: false,
    importedStep012H1ContractMatchesExpected: false,
    importedStep012IContractMatchesExpected: false,
    importedStep012ICanonicalizationMatchesExpected: false,

    publicStageExecutionStatus:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    claimCeiling: H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    displayPolicy: freeze({
      narrowPlainDataProjectionOnly: true,
      callableFunctionsDisplayedAsInputs: false,
      wholeStep012JAggregateDisplayed: false,
      wholeStep012JAggregatePassedIntoStep012I: false,
      descriptorClaimsReinterpretedAsExecutionEvidence: false,
      successfulRenderingLabeledAsValidation: false
    }),

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function normalizeImportedBridgeProjection(importReceipt, bridgeModule) {
  const targetClassification =
    bridgeModule?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_TARGET_CLASSIFICATION ||
    bridgeModule?.default?.targetClassification ||
    null;

  const authority =
    bridgeModule?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_AUTHORITY ||
    bridgeModule?.default?.authority ||
    null;

  const contractId =
    bridgeModule?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_CONTRACT_ID ||
    bridgeModule?.default?.contractId ||
    authority?.contractId ||
    null;

  const expected = H_EARTH_3D_LAYER_4_CONTRACTS;

  return freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_LAYER_4_STATUS_PROJECTION',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    projectionClass:
      'NARROW_PUBLIC_STAGE_PLAIN_DATA_PROJECTION',

    bridgeStatus:
      H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_OBSERVED,
    bridgeMode:
      authority?.activeStatusCeiling ||
      'STATIC_BRIDGE_DESCRIPTOR_ONLY',

    step012JContractId:
      contractId || expected.step012JContractId,

    step012H1ContractId:
      targetClassification?.importedStep012H1ContractId ||
      targetClassification?.expectedStep012H1ContractId ||
      expected.step012H1ContractId,

    step012IContractId:
      targetClassification?.importedStep012IContractId ||
      targetClassification?.expectedStep012IContractId ||
      expected.step012IContractId,

    step012ICanonicalizationId:
      targetClassification?.importedStep012ICanonicalizationId ||
      targetClassification?.expectedStep012ICanonicalizationId ||
      expected.step012ICanonicalizationId,

    relationshipMembers: freeze({
      step012H1HeadlessReplayFixtureSide: true,
      step012ICanonicalSerializationLawMember: true,
      step012IRunnerRelationshipMember:
        authority?.step012IRunnerRelationshipMember === true,
      target002IdentifiedSupportSurface: true,
      target003IdentifiedSupportSurface: true
    }),

    target002ContractId:
      expected.target002ContractId,
    target003ContractId:
      expected.target003ContractId,
    step012IRunnerContractId:
      expected.step012IRunnerContractId,

    archiveCustodyStatus:
      H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY.archiveCustodyStatus,
    archiveCustody: H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY,

    moduleImportAttempted: true,
    moduleInitializationObserved: importReceipt?.importSucceeded === true,
    importedDescriptorContractMatchesExpected:
      contractId === expected.step012JContractId,

    importedStep012H1ContractMatchesExpected:
      (
        targetClassification?.declaredStep012H1ContractMatchesExpected === true ||
        targetClassification?.importedStep012H1ContractId === expected.step012H1ContractId
      ),

    importedStep012IContractMatchesExpected:
      (
        targetClassification?.declaredStep012IContractMatchesExpected === true ||
        targetClassification?.importedStep012IContractId === expected.step012IContractId
      ),

    importedStep012ICanonicalizationMatchesExpected:
      (
        targetClassification?.declaredStep012ICanonicalizationMatchesExpected === true ||
        targetClassification?.importedStep012ICanonicalizationId === expected.step012ICanonicalizationId
      ),

    sourceDefinedBridgeClassification: freeze({
      importDeclarationPresent:
        targetClassification?.importDeclarationPresent === true,
      importResolutionProof:
        targetClassification?.importResolutionProof === true,
      installedModuleEvaluationProof:
        targetClassification?.installedModuleEvaluationProof === true,
      moduleGraphExecutionProof:
        targetClassification?.moduleGraphExecutionProof === true,
      bridgeExecutionProof:
        targetClassification?.bridgeExecutionProof === true
    }),

    publicStageExecutionStatus:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    claimCeiling: H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    displayPolicy: freeze({
      narrowPlainDataProjectionOnly: true,
      callableFunctionsDisplayedAsInputs: false,
      wholeStep012JAggregateDisplayed: false,
      wholeStep012JAggregatePassedIntoStep012I: false,
      descriptorClaimsReinterpretedAsExecutionEvidence: false,
      successfulRenderingLabeledAsValidation: false
    }),

    importReceipt,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function buildLayer4ImportFailureProjection(importReceipt) {
  return freeze({
    ...buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED
    ),
    moduleImportAttempted: true,
    moduleInitializationObserved: false,
    importedDescriptorContractMatchesExpected: false,
    importReceipt
  });
}

function renderLayer4Projection(mountPoints, projection) {
  if (!mountPoints || !projection) return false;

  writeText(
    mountPoints.layer4Status,
    projection.bridgeStatus || H_EARTH_3D_LAYER_4_STATUS.STATIC_METADATA_PROJECTED
  );

  if (mountPoints.layer4Status?.dataset) {
    mountPoints.layer4Status.dataset.hEarthLayer4Status =
      projection.bridgeStatus || 'projected';
  }

  writeText(
    mountPoints.layer4Summary,
    projection.moduleInitializationObserved === true
      ? 'Step 012J descriptor module initialization was observed through public-stage import. No runner, replay, vector, runtime, digest, comparison, validation, production, visual-pass, or matrix-collapse execution is claimed.'
      : 'Step 012J is projected as backed read-only static custody metadata. No runner, replay, vector, runtime, digest, comparison, validation, production, visual-pass, or matrix-collapse execution is claimed.'
  );

  writeText(
    mountPoints.step012JContractId,
    projection.step012JContractId
  );

  writeText(
    mountPoints.step012H1ContractId,
    projection.step012H1ContractId
  );

  writeText(
    mountPoints.step012IContractId,
    projection.step012IContractId
  );

  writeText(
    mountPoints.step012ICanonicalizationId,
    projection.step012ICanonicalizationId
  );

  writeJson(
    mountPoints.layer4ProjectionPayload,
    projection,
    { maxDepth: 9, maxArrayLength: 160 }
  );

  return true;
}

function buildLayer4PublicStageReceipt() {
  const projection =
    MODULE_STATE.layer4StatusProjection ||
    buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_PENDING
    );

  return freeze({
    receiptType:
      'H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    publicRoute: H_EARTH_3D_PUBLIC_ROUTE,
    diagnosticRoute: H_EARTH_3D_DIAGNOSTIC_ROUTE,

    publicStageAdapter: true,
    readOnlyLayer4StatusProjection: true,
    environmentHostAuthorized: true,
    visibleStageAuthorized: true,
    sourcePreviewAuthorized: true,

    step012JDescriptorReadAuthorized: true,
    layer4StatusProjection: projection,

    moduleInitializationObserved:
      projection.moduleInitializationObserved === true,

    sourcePreviewReceipt:
      MODULE_STATE.sourcePreviewReceipt,

    runFunctionExecuted: false,
    replayExecuted: false,
    vectorRunnerExecuted: false,
    runtimeExecuted: false,
    canonicalDigestGenerated: false,
    replayComparison: false,

    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function buildRouteBootstrapStatus() {
  return freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_ROUTE_BOOTSTRAP_STATUS',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    renewedFrom: H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,
    generatedAt: nowIso(),

    status: MODULE_STATE.status,
    initialized: MODULE_STATE.initialized === true,
    asyncInitializationStarted:
      MODULE_STATE.asyncInitializationStarted === true,
    asyncInitializationComplete:
      MODULE_STATE.asyncInitializationComplete === true,

    selectedTargetId: MODULE_STATE.selectedTargetId,

    routeRootFound:
      Boolean(MODULE_STATE.mountPoints?.routeRoot),
    statusNodeFound:
      Boolean(MODULE_STATE.mountPoints?.statusNode),
    fallbackNodeFound:
      Boolean(MODULE_STATE.mountPoints?.fallbackNode),
    rendererMountNodeFound:
      Boolean(MODULE_STATE.mountPoints?.rendererMount),

    publicEnvironmentHost: true,
    visibleStageAuthorized: true,
    sourcePreviewAuthorized: true,
    sourcePreviewStatus: MODULE_STATE.sourcePreviewStatus,
    sourcePreviewMounted:
      MODULE_STATE.sourcePreviewReceipt?.mounted === true,
    layer4StatusProjectionAuthorized: true,

    sourcePreviewReceipt: MODULE_STATE.sourcePreviewReceipt,

    rendererImportReceipt: MODULE_STATE.rendererImportReceipt,
    rendererMountReceipt: MODULE_STATE.rendererMountReceipt,

    layer4ImportReceipt: MODULE_STATE.layer4ImportReceipt,
    layer4StatusProjection:
      MODULE_STATE.layer4StatusProjection,

    moduleInitializationObserved:
      MODULE_STATE.layer4StatusProjection?.moduleInitializationObserved === true,

    runFunctionExecuted: false,
    replayExecuted: false,
    vectorRunnerExecuted: false,
    runtimeExecuted: false,
    canonicalDigestGenerated: false,
    replayComparison: false,

    validationClaim: false,
    productionClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function buildRouteBootstrapReceipt() {
  return freeze({
    receiptType:
      'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    renewedFrom:
      H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,
    routeShellContractId:
      H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,
    routeStyleContractId:
      H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,
    generatedAt: nowIso(),

    publicRoute: H_EARTH_3D_PUBLIC_ROUTE,
    diagnosticRoute: H_EARTH_3D_DIAGNOSTIC_ROUTE,

    status: MODULE_STATE.status,
    initialized: MODULE_STATE.initialized === true,

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    selectedTarget:
      getTarget(MODULE_STATE.selectedTargetId),

    publicEnvironmentHost: true,
    visibleStageAuthorized: true,
    rendererMountSupportAuthorized: true,
    sourcePreviewAuthorized: true,
    sourcePreviewReceipt:
      MODULE_STATE.sourcePreviewReceipt,
    layer4StatusProjectionAuthorized: true,

    routeStatus:
      buildRouteBootstrapStatus(),

    rendererImportReceipt:
      MODULE_STATE.rendererImportReceipt,
    rendererMountReceipt:
      MODULE_STATE.rendererMountReceipt,

    layer4PublicStageReceipt:
      MODULE_STATE.layer4PublicStageReceipt,
    layer4StatusProjection:
      MODULE_STATE.layer4StatusProjection,

    publicStageExecutionStatus:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function rebuildAndRenderPublicReceipts(mountPoints = MODULE_STATE.mountPoints) {
  MODULE_STATE.layer4PublicStageReceipt =
    buildLayer4PublicStageReceipt();

  MODULE_STATE.routeBootstrapReceipt =
    buildRouteBootstrapReceipt();

  writeJson(
    mountPoints?.publicStageReceipt,
    MODULE_STATE.layer4PublicStageReceipt,
    { maxDepth: 9, maxArrayLength: 180 }
  );

  writeJson(
    mountPoints?.debug,
    MODULE_STATE.routeBootstrapReceipt,
    { maxDepth: 8, maxArrayLength: 160 }
  );

  return freeze({
    layer4PublicStageReceipt: MODULE_STATE.layer4PublicStageReceipt,
    routeBootstrapReceipt: MODULE_STATE.routeBootstrapReceipt
  });
}

function resolveRendererMountFunction(rendererModule) {
  if (!rendererModule || typeof rendererModule !== 'object') return null;

  const directCandidates = [
    rendererModule.mountHEarthRenderer,
    rendererModule.mountHEarth3DRenderer,
    rendererModule.mountHEarthCandidateRenderer,
    rendererModule.mountHEarthCandidateScene,
    rendererModule.mountHEarthRenderScene,
    rendererModule.renderHEarthCandidateScene,
    rendererModule.initializeHEarthRenderer,
    rendererModule.default?.mountHEarthRenderer,
    rendererModule.default?.mountHEarthCandidateScene,
    rendererModule.default?.mount,
    rendererModule.default?.render,
    rendererModule.default?.initialize
  ];

  return directCandidates.find((candidate) => typeof candidate === 'function') || null;
}

async function attemptPublicRendererMount(mountPoints, options = {}) {
  const rendererPath =
    options.rendererModulePath ||
    H_EARTH_3D_PUBLIC_RENDERER_MODULE_PATH;

  const importReceiptBase = {
    receiptType:
      'H_EARTH_3D_PUBLIC_RENDERER_IMPORT_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    rendererModulePath: rendererPath,
    importAttempted: true,
    importSucceeded: false,
    mountAttempted: false,
    mounted: false,
    sourcePreviewAlreadyMounted:
      MODULE_STATE.sourcePreviewReceipt?.mounted === true,
    rendererFailureMayBlankPreview: false,
    publicStageCandidateOnly: true,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false
  };

  try {
    const rendererModule = await import(rendererPath);
    const mountFn = resolveRendererMountFunction(rendererModule);

    const importReceipt = freeze({
      ...importReceiptBase,
      importSucceeded: true,
      rendererModuleKeys: freeze(Object.keys(rendererModule || {})),
      mountFunctionFound: Boolean(mountFn)
    });

    MODULE_STATE.rendererImportReceipt = importReceipt;

    if (!mountFn || !mountPoints?.rendererMount) {
      MODULE_STATE.rendererMountReceipt = freeze({
        receiptType:
          'H_EARTH_3D_PUBLIC_RENDERER_MOUNT_RECEIPT',
        file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
        contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
        rendererModulePath: rendererPath,
        importSucceeded: true,
        mountAttempted: false,
        mounted: false,
        sourcePreviewRetained:
          MODULE_STATE.sourcePreviewReceipt?.mounted === true,
        reason: !mountFn
          ? 'NO_COMPATIBLE_RENDERER_MOUNT_FUNCTION_EXPORTED'
          : 'RENDERER_MOUNT_NODE_MISSING',
        publicStageCandidateOnly: true,
        rendererPassClaim: false,
        visualPassClaim: false,
        validationClaim: false,
        productionClaim: false,
        matrixCollapse: false
      });

      return MODULE_STATE.rendererMountReceipt;
    }

    let rawMountResult = null;

    try {
      rawMountResult = mountFn({
        document: mountPoints.rendererMount.ownerDocument,
        routeRoot: mountPoints.routeRoot,
        mountNode: mountPoints.rendererMount,
        rendererMount: mountPoints.rendererMount,
        selectedTargetId: MODULE_STATE.selectedTargetId,
        publicStageCandidateOnly: true,
        preserveExistingSourcePreview: true
      });
    } catch (_firstError) {
      rawMountResult = mountFn(
        mountPoints.rendererMount,
        {
          document: mountPoints.rendererMount.ownerDocument,
          routeRoot: mountPoints.routeRoot,
          selectedTargetId: MODULE_STATE.selectedTargetId,
          publicStageCandidateOnly: true,
          preserveExistingSourcePreview: true
        }
      );
    }

    MODULE_STATE.rendererMountReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_RENDERER_MOUNT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      rendererModulePath: rendererPath,
      importSucceeded: true,
      mountFunctionFound: true,
      mountAttempted: true,
      mounted:
        Boolean(rawMountResult?.mounted) ||
        Boolean(rawMountResult?.rendererMounted) ||
        Boolean(
          mountPoints.rendererMount.querySelector(
            '[data-h-earth-render-owned="true"]'
          )
        ),
      rawMountResult: safeSerialize(rawMountResult, {
        maxDepth: 5,
        maxArrayLength: 80
      }),
      mountedNodeCount:
        mountPoints.rendererMount.childNodes.length,
      sourcePreviewRetained:
        Boolean(
          mountPoints.rendererMount.querySelector(
            '[data-h-earth-source-preview-owned="true"]'
          )
        ),
      rendererFailureMayBlankPreview: false,
      publicStageCandidateOnly: true,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    });

    return MODULE_STATE.rendererMountReceipt;
  } catch (error) {
    MODULE_STATE.rendererImportReceipt = freeze({
      ...importReceiptBase,
      importSucceeded: false,
      errorName:
        error instanceof Error ? error.name : 'UnknownError',
      errorMessage:
        error instanceof Error ? error.message : String(error),
      sourcePreviewRetained:
        MODULE_STATE.sourcePreviewReceipt?.mounted === true
    });

    MODULE_STATE.rendererMountReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_RENDERER_MOUNT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      rendererModulePath: rendererPath,
      importSucceeded: false,
      mountAttempted: false,
      mounted: false,
      sourcePreviewRetained:
        MODULE_STATE.sourcePreviewReceipt?.mounted === true,
      errorName:
        error instanceof Error ? error.name : 'UnknownError',
      errorMessage:
        error instanceof Error ? error.message : String(error),
      publicStageCandidateOnly: true,
      rendererFailureMayBlankPreview: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    });

    return MODULE_STATE.rendererMountReceipt;
  }
}

async function readLayer4BridgeDescriptor(options = {}) {
  if (options.skipLayer4DescriptorImport === true) {
    const importReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      importAttempted: false,
      importSkipped: true,
      importSucceeded: false,
      moduleInitializationObserved: false,
      layer4BridgeModulePath:
        options.layer4BridgeModulePath ||
        H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH,
      reason:
        'skipLayer4DescriptorImport option was true.',
      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    });

    MODULE_STATE.layer4ImportReceipt = importReceipt;
    MODULE_STATE.layer4StatusProjection =
      buildStaticLayer4Projection(
        H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED
      );

    return MODULE_STATE.layer4StatusProjection;
  }

  const modulePath =
    options.layer4BridgeModulePath ||
    H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH;

  try {
    const bridgeModule = await import(modulePath);

    const importReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      importAttempted: true,
      importSkipped: false,
      importSucceeded: true,
      moduleInitializationObserved: true,
      layer4BridgeModulePath: modulePath,
      moduleExportKeys: freeze(Object.keys(bridgeModule || {})),

      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    });

    MODULE_STATE.layer4ImportReceipt = importReceipt;
    MODULE_STATE.layer4StatusProjection =
      normalizeImportedBridgeProjection(importReceipt, bridgeModule);

    return MODULE_STATE.layer4StatusProjection;
  } catch (error) {
    const importReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      importAttempted: true,
      importSkipped: false,
      importSucceeded: false,
      moduleInitializationObserved: false,
      layer4BridgeModulePath: modulePath,
      errorName:
        error instanceof Error ? error.name : 'UnknownError',
      errorMessage:
        error instanceof Error ? error.message : String(error),

      staticCustodyMetadataRetained: true,

      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    });

    MODULE_STATE.layer4ImportReceipt = importReceipt;
    MODULE_STATE.layer4StatusProjection =
      buildLayer4ImportFailureProjection(importReceipt);

    return MODULE_STATE.layer4StatusProjection;
  }
}

function updateRouteRootExecutionDataset(mountPoints) {
  const routeRoot = mountPoints?.routeRoot;

  if (!routeRoot?.dataset) return false;

  routeRoot.dataset.hEarthModuleInitializationObserved =
    MODULE_STATE.layer4StatusProjection?.moduleInitializationObserved === true
      ? 'true'
      : 'false';

  routeRoot.dataset.hEarthSourcePreviewMounted =
    MODULE_STATE.sourcePreviewReceipt?.mounted === true
      ? 'true'
      : 'false';

  routeRoot.dataset.hEarthRunFunctionExecuted = 'false';
  routeRoot.dataset.hEarthReplayExecuted = 'false';
  routeRoot.dataset.hEarthVectorRunnerExecuted = 'false';
  routeRoot.dataset.hEarthRuntimeExecuted = 'false';
  routeRoot.dataset.hEarthCanonicalDigestGenerated = 'false';
  routeRoot.dataset.hEarthReplayComparison = 'false';
  routeRoot.dataset.hEarthValidationClaim = 'false';
  routeRoot.dataset.hEarthProductionClaim = 'false';
  routeRoot.dataset.hEarthRendererPassClaim = 'false';
  routeRoot.dataset.hEarthVisualPassClaim = 'false';
  routeRoot.dataset.hEarthMatrixCollapse = 'false';

  return true;
}

async function completeAsyncPublicStageInitialization(mountPoints, options = {}) {
  MODULE_STATE.asyncInitializationStarted = true;

  writeText(
    mountPoints?.layer4Status,
    H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_PENDING
  );

  const [layer4Projection, rendererMountReceipt] =
    await Promise.all([
      readLayer4BridgeDescriptor(options),
      options.skipRendererMount === true
        ? Promise.resolve(freeze({
            receiptType:
              'H_EARTH_3D_PUBLIC_RENDERER_MOUNT_RECEIPT',
            file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
            contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
            mountAttempted: false,
            mounted: false,
            sourcePreviewRetained:
              MODULE_STATE.sourcePreviewReceipt?.mounted === true,
            reason: 'skipRendererMount option was true.',
            publicStageCandidateOnly: true,
            rendererFailureMayBlankPreview: false,
            rendererPassClaim: false,
            visualPassClaim: false,
            validationClaim: false,
            productionClaim: false,
            matrixCollapse: false
          }))
        : attemptPublicRendererMount(mountPoints, options)
    ]);

  MODULE_STATE.layer4StatusProjection = layer4Projection;
  MODULE_STATE.rendererMountReceipt = rendererMountReceipt;

  const rendererMounted =
    rendererMountReceipt?.mounted === true;
  const sourcePreviewMounted =
    MODULE_STATE.sourcePreviewReceipt?.mounted === true;

  if (rendererMounted) {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.READY;
    setRouteClass(mountPoints?.routeRoot, 'h-earth-3d-boot-ready');
    writeText(
      mountPoints?.statusNode,
      'PUBLIC_STAGE_READY'
    );
    writeText(
      mountPoints?.fallbackNode,
      'H-Earth public environment stage mounted as candidate display. Source preview remains descriptor-only.'
    );
  } else if (sourcePreviewMounted) {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.PARTIAL;
    setRouteClass(mountPoints?.routeRoot, 'h-earth-3d-boot-fallback');
    writeText(
      mountPoints?.statusNode,
      'PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW'
    );
    writeText(
      mountPoints?.fallbackNode,
      'H-Earth source preview is visible. Renderer mount support remains held or unavailable; Layer 4 status projection remains read-only.'
    );
  } else {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.PARTIAL;
    setRouteClass(mountPoints?.routeRoot, 'h-earth-3d-boot-fallback');
    writeText(
      mountPoints?.statusNode,
      'PUBLIC_STAGE_PARTIAL'
    );
    writeText(
      mountPoints?.fallbackNode,
      'H-Earth public route is available. Renderer mount support is held or unavailable; Layer 4 status projection remains read-only.'
    );
  }

  renderLayer4Projection(mountPoints, layer4Projection);
  updateRouteRootExecutionDataset(mountPoints);
  rebuildAndRenderPublicReceipts(mountPoints);

  MODULE_STATE.asyncInitializationComplete = true;

  globalThis.H_EARTH_3D_LAYER_4_STATUS_PROJECTION =
    MODULE_STATE.layer4StatusProjection;
  globalThis.H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT =
    MODULE_STATE.layer4PublicStageReceipt;
  globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
    MODULE_STATE.routeBootstrapReceipt;
  globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS =
    buildRouteBootstrapStatus();

  return freeze({
    initialized: MODULE_STATE.initialized,
    status: MODULE_STATE.status,
    layer4StatusProjection: MODULE_STATE.layer4StatusProjection,
    sourcePreviewReceipt: MODULE_STATE.sourcePreviewReceipt,
    rendererMountReceipt: MODULE_STATE.rendererMountReceipt,
    routeBootstrapReceipt: MODULE_STATE.routeBootstrapReceipt,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function bindActionControls(mountPoints) {
  if (!mountPoints?.actionInspectGround) {
    return freeze({
      inspectGroundBound: false
    });
  }

  mountPoints.actionInspectGround.addEventListener('click', () => {
    const target = getTarget(MODULE_STATE.selectedTargetId);

    renderSelectedTarget(mountPoints, target);
    markPreviewSelectedObject(mountPoints, target.objectId);
    rebuildAndRenderPublicReceipts(mountPoints);

    writeText(
      mountPoints.statusNode,
      'GROUND_CONDITION_READ_DISPLAYED_DESCRIPTOR_ONLY'
    );
  });

  return freeze({
    inspectGroundBound: true
  });
}

function bindCopyControls(rootDocument = globalThis.document) {
  if (!rootDocument || typeof rootDocument.querySelectorAll !== 'function') {
    return freeze({
      copyButtonsBound: 0
    });
  }

  const buttons = Array.from(
    rootDocument.querySelectorAll(
      '[data-h-earth-receipt-copy-button="true"][data-h-earth-copy-target]'
    )
  );

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-h-earth-copy-target');
      const label =
        button.getAttribute('data-h-earth-copy-label') ||
        targetId ||
        'Receipt';
      const copyStatus =
        getById(rootDocument, H_EARTH_3D_PUBLIC_MOUNT_IDS.copyStatus);
      const targetNode =
        targetId ? getById(rootDocument, targetId) : null;

      if (!targetNode) {
        writeText(copyStatus, `${label} copy failed: target not found.`);
        setDatasetBoolean(copyStatus, 'hEarthCopyFailure', true);
        return;
      }

      const text = targetNode.textContent || '';

      if (!text.trim()) {
        writeText(copyStatus, `${label} copy failed: payload is empty.`);
        setDatasetBoolean(copyStatus, 'hEarthCopyFailure', true);
        return;
      }

      try {
        if (
          globalThis.navigator?.clipboard &&
          typeof globalThis.navigator.clipboard.writeText === 'function'
        ) {
          await globalThis.navigator.clipboard.writeText(text);
          writeText(copyStatus, `${label} copied.`);
          if (copyStatus?.dataset) {
            copyStatus.dataset.hEarthCopyState = 'success';
          }
          return;
        }

        writeText(
          copyStatus,
          `${label} prepared, but Clipboard API is unavailable in this context.`
        );

        if (copyStatus?.dataset) {
          copyStatus.dataset.hEarthCopyState = 'held';
        }
      } catch (error) {
        writeText(
          copyStatus,
          `${label} copy failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );

        if (copyStatus?.dataset) {
          copyStatus.dataset.hEarthCopyState = 'failure';
        }
      }
    });
  });

  return freeze({
    copyButtonsBound: buttons.length
  });
}

function renderInitialStaticRoute(mountPoints) {
  const target = getTarget(MODULE_STATE.selectedTargetId);

  renderSelectedTarget(mountPoints, target);
  renderTargetList(mountPoints);

  renderPublicSourcePreview(mountPoints);

  MODULE_STATE.layer4StatusProjection =
    buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_PENDING
    );

  renderLayer4Projection(
    mountPoints,
    MODULE_STATE.layer4StatusProjection
  );

  rebuildAndRenderPublicReceipts(mountPoints);

  writeText(
    mountPoints.statusNode,
    'PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW'
  );

  writeText(
    mountPoints.fallbackNode,
    'H-Earth source preview is visible. Public-stage adapter is loading read-only Layer 4 status and optional renderer support.'
  );

  return true;
}

export function initializeHEarthRoute(options = {}) {
  const rootDocument = getDocumentFromOptions(options);
  const mountPoints = resolveMountPoints(rootDocument);

  MODULE_STATE.generatedAt = nowIso();
  MODULE_STATE.mountPoints = mountPoints;
  MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.INITIALIZING;

  bindCopyControls(rootDocument);

  if (!mountPoints.requiredFound) {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.ERROR;
    MODULE_STATE.initialized = false;

    const failureReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_MOUNT_FAILURE',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      generatedAt: nowIso(),
      status: MODULE_STATE.status,
      missingRequiredIds: mountPoints.missingRequiredIds,
      publicEnvironmentHost: true,
      sourcePreviewAuthorized: true,
      layer4StatusProjectionAuthorized: true,
      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      matrixCollapse: false,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

    MODULE_STATE.routeBootstrapReceipt = failureReceipt;
    MODULE_STATE.routeBootstrapResult = failureReceipt;

    writeText(
      mountPoints.statusNode,
      'PUBLIC_STAGE_MOUNT_FAILURE'
    );

    writeJson(
      mountPoints.debug,
      failureReceipt,
      { maxDepth: 7, maxArrayLength: 80 }
    );

    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
      failureReceipt;

    return freeze({
      initialized: false,
      status: MODULE_STATE.status,
      mountPoints,
      failureReceipt,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  MODULE_STATE.initialized = true;

  renderInitialStaticRoute(mountPoints);
  bindActionControls(mountPoints);

  if (mountPoints.diagnosticLink) {
    mountPoints.diagnosticLink.setAttribute(
      'href',
      H_EARTH_3D_DIAGNOSTIC_ROUTE
    );
  }

  updateRouteRootExecutionDataset(mountPoints);

  const immediateResult = freeze({
    initialized: true,
    status: MODULE_STATE.status,
    generatedAt: MODULE_STATE.generatedAt,
    mountPoints,
    routeBootstrapReceipt: MODULE_STATE.routeBootstrapReceipt,
    sourcePreviewReceipt: MODULE_STATE.sourcePreviewReceipt,
    layer4StatusProjection: MODULE_STATE.layer4StatusProjection,
    layer4PublicStageReceipt: MODULE_STATE.layer4PublicStageReceipt,
    asyncCompletion:
      'PENDING_DYNAMIC_DESCRIPTOR_AND_OPTIONAL_RENDERER_IMPORTS',
    publicStageAdapter: true,
    readOnlyLayer4StatusProjection: true,
    sourcePreviewMounted:
      MODULE_STATE.sourcePreviewReceipt?.mounted === true,
    runFunctionExecuted: false,
    replayExecuted: false,
    vectorRunnerExecuted: false,
    runtimeExecuted: false,
    canonicalDigestGenerated: false,
    replayComparison: false,
    validationClaim: false,
    productionClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });

  MODULE_STATE.routeBootstrapResult = immediateResult;

  globalThis.H_EARTH_3D_INDEX = H_EARTH_3D_INDEX;
  globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RESULT = immediateResult;
  globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
    MODULE_STATE.routeBootstrapReceipt;
  globalThis.H_EARTH_3D_PUBLIC_STAGE_SOURCE_PREVIEW_RECEIPT =
    MODULE_STATE.sourcePreviewReceipt;
  globalThis.H_EARTH_3D_LAYER_4_STATUS_PROJECTION =
    MODULE_STATE.layer4StatusProjection;
  globalThis.H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT =
    MODULE_STATE.layer4PublicStageReceipt;

  completeAsyncPublicStageInitialization(mountPoints, options).catch((error) => {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.ERROR;

    const failureReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_ASYNC_FAILURE',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      generatedAt: nowIso(),
      status: MODULE_STATE.status,
      errorName:
        error instanceof Error ? error.name : 'UnknownError',
      errorMessage:
        error instanceof Error ? error.message : String(error),
      staticLayer4ProjectionRetained: true,
      sourcePreviewRetained:
        MODULE_STATE.sourcePreviewReceipt?.mounted === true,
      publicStageAdapter: true,
      readOnlyLayer4StatusProjection: true,
      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      matrixCollapse: false,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

    MODULE_STATE.routeBootstrapReceipt = failureReceipt;

    setRouteClass(mountPoints.routeRoot, 'h-earth-3d-boot-error');
    writeText(mountPoints.statusNode, 'PUBLIC_STAGE_ASYNC_FAILURE');
    writeText(
      mountPoints.fallbackNode,
      `Public-stage adapter async completion failed: ${failureReceipt.errorMessage}. Source preview retention: ${failureReceipt.sourcePreviewRetained ? 'true' : 'false'}.`
    );
    writeJson(
      mountPoints.debug,
      failureReceipt,
      { maxDepth: 8, maxArrayLength: 120 }
    );

    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
      failureReceipt;
    globalThis.H_EARTH_3D_PUBLIC_STAGE_ASYNC_FAILURE =
      failureReceipt;
  });

  return immediateResult;
}

export function getRouteBootstrapStatus() {
  return buildRouteBootstrapStatus();
}

export function getRouteBootstrapReceipt() {
  if (!MODULE_STATE.routeBootstrapReceipt) {
    MODULE_STATE.routeBootstrapReceipt = buildRouteBootstrapReceipt();
  }

  return MODULE_STATE.routeBootstrapReceipt;
}

export function getLayer4StatusProjection() {
  if (!MODULE_STATE.layer4StatusProjection) {
    MODULE_STATE.layer4StatusProjection =
      buildStaticLayer4Projection(
        H_EARTH_3D_LAYER_4_STATUS.STATIC_METADATA_PROJECTED
      );
  }

  return MODULE_STATE.layer4StatusProjection;
}

export function getLayer4PublicStageReceipt() {
  if (!MODULE_STATE.layer4PublicStageReceipt) {
    MODULE_STATE.layer4PublicStageReceipt =
      buildLayer4PublicStageReceipt();
  }

  return MODULE_STATE.layer4PublicStageReceipt;
}

export function getPublicStageSourcePreviewReceipt() {
  return MODULE_STATE.sourcePreviewReceipt || freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_SCREEN_ON_SOURCE_PREVIEW_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),
    sourcePreviewStatus: MODULE_STATE.sourcePreviewStatus,
    mounted: false,
    descriptorOnly: true,
    rendererDependencyRequired: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function getPublicGroundConditionReadPayload() {
  return buildGroundConditionReadPayload(
    getTarget(MODULE_STATE.selectedTargetId)
  );
}

export function destroyHEarthRoute() {
  const previousReceipt = buildRouteBootstrapReceipt();
  const mountPoints = MODULE_STATE.mountPoints;

  if (mountPoints?.rendererMount) {
    clearSourcePreviewOwnedNodes(mountPoints.rendererMount);
  }

  MODULE_STATE.initialized = false;
  MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.NOT_STARTED;
  MODULE_STATE.sourcePreviewStatus =
    H_EARTH_3D_SOURCE_PREVIEW_STATUS.NOT_STARTED;
  MODULE_STATE.mountPoints = null;
  MODULE_STATE.routeBootstrapResult = null;

  return freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_DESTROY_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),
    previousReceipt,
    sourcePreviewOwnedNodesCleared: true,
    domMutationClaim:
      'source-preview-owned nodes may be removed during destroy only',
    layer4ExecutionClaim: false,
    validationClaim: false,
    productionClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export const H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
  freeze({
    receiptType:
      'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT_STATIC_DESCRIPTOR',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId:
      H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    renewedFrom:
      H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,
    routeShellContractId:
      H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,
    routeStyleContractId:
      H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,

    publicStageAdapterDefined: true,
    publicEnvironmentHostAuthorized: true,
    visibleStageAuthorized: true,
    sourcePreviewDefined: true,
    sourcePreviewDescriptorOnly: true,
    readOnlyLayer4StatusProjectionDefined: true,
    publicStageReceiptDefinitionDefined: true,
    diagnosticRouteHandoffDefined: true,

    layer4BridgeContract:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012JContractId,

    sourceSpineContracts:
      H_EARTH_3D_SOURCE_SPINE_CONTRACTS,

    moduleInitializationObserved:
      'runtime-observation-only-after-dynamic-import',
    runFunctionExecuted: false,
    replayExecuted: false,
    vectorRunnerExecuted: false,
    runtimeExecuted: false,
    canonicalDigestGenerated: false,
    replayComparison: false,

    validationClaim: false,
    productionClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });

export const H_EARTH_3D_INDEX = freeze({
  id: 'H_EARTH_3D_INDEX',
  file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
  route: H_EARTH_3D_PUBLIC_ROUTE,
  diagnosticRoute: H_EARTH_3D_DIAGNOSTIC_ROUTE,

  contractId:
    H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
  renewedFrom:
    H_EARTH_3D_INDEX_RENEWED_FROM_CONTRACT_ID,
  routeShellContractId:
    H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,
  routeStyleContractId:
    H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,

  publicStageAdapter: true,
  readOnlyLayer4StatusProjection: true,
  publicEnvironmentHost: true,
  visibleStageAuthorized: true,
  sourcePreviewDefined: true,
  sourcePreviewDescriptorOnly: true,

  layer4Contracts:
    H_EARTH_3D_LAYER_4_CONTRACTS,
  layer4ArchiveCustody:
    H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY,
  sourceSpineContracts:
    H_EARTH_3D_SOURCE_SPINE_CONTRACTS,
  sourceSpineArchiveCustody:
    H_EARTH_3D_SOURCE_SPINE_ARCHIVE_CUSTODY,
  sourcePreviewModel:
    H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_MODEL,
  executionCeiling:
    H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,
  boundaryFlags:
    H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,
  mountIds:
    H_EARTH_3D_PUBLIC_MOUNT_IDS,
  targets:
    H_EARTH_3D_PUBLIC_TARGETS,
  sourcePreviewBands:
    H_EARTH_3D_PUBLIC_SOURCE_PREVIEW_BANDS,

  initializeHEarthRoute,
  destroyHEarthRoute,
  getRouteBootstrapStatus,
  getRouteBootstrapReceipt,
  getLayer4StatusProjection,
  getLayer4PublicStageReceipt,
  getPublicStageSourcePreviewReceipt,
  getPublicGroundConditionReadPayload,

  receipt:
    H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT
});

export default H_EARTH_3D_INDEX;
