// /showroom/globe/h-earth/compositor.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_v1
//
// Renews:
// H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_032F_RENDERER_032D_PARENT_DESCRIPTOR_COMPOSITION_ALIGNMENT_v1
//
// Governing Step 034 source spine:
// H_EARTH_MATRIX_BOUNDARIES_FILE_RENEWAL_STEP_034I_PUBLIC_STAGE_AUTHORITY_AMENDMENT_v1
// H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1
// H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1
// H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_RENEWAL_STEP_034L_LANDSCAPE_LATTICE_ZONE_AND_RENDER_TARGET_ALIGNMENT_v1
//
// Step 034L recorded shared Drive occurrence:
// h-earth-256-lattice-landscape-step-034l-zone-and-render-target-alignment-backup
// Google Drive document ID:
// 10HUxO6UsqD0CoSLIB4v6bgJpwLehVFH5bLY-n0jsQnU
//
// Purpose:
// Renew compositor.js as the descriptor-only public-stage visual-composition
// bridge between current H-Earth source authority and the downstream renderer.
//
// Correct dependency direction:
// capacity / environment / Step 034I-034L source spine
//   -> compositor
//   -> renderer
//   -> public stage
//
// This compositor no longer imports renderer.js and does not derive its
// composition from a legacy renderer candidate scene.
//
// Canonical public-stage composition:
// - sky,
// - air haze,
// - horizon,
// - offshore rock stacks and islets,
// - elevated Mirror Manor / bluff context,
// - water surface plane,
// - nearshore wave band,
// - shoreline foam line,
// - dry-sand transition,
// - foreground wet sand,
// - tide pools,
// - small beach stones,
// - foreground jagged rocks,
// - inspection anchor,
// - overlay/readout attachment descriptor.
//
// Boundary:
// Descriptor-only composition authority.
// No DOM creation. No CSS creation. No renderer geometry. No terrain geometry.
// No renderer activation. No route activation. No canvas. No WebGL.
// No visual-pass claim. No validation claim. No production claim.
// No deployment claim. No traversal. No collision. No physics.
// No survival simulation. No matrix collapse.

import * as CapacityModule from './capacity.js';
import * as EnvironmentModule from './environment.js';

import * as MatrixBoundaryModule from
'../../../h-earth-3d/boundaries/matrix-boundaries.js';

import * as ObjectAuthorityModule from
'../../../h-earth-3d/objects/ground-cell-001.objects.js';

import * as ZoneAuthorityModule from
'../../../h-earth-3d/zones/ground-cell-001.zones.js';

import * as LandscapeLatticeModule from
'../../../h-earth-3d/zones/ground-cell-001.landscape-lattice.js';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);
const EMPTY_FROZEN_OBJECT = Object.freeze({});

const freezeArray = (value) =>
Object.freeze(
Array.isArray(value)
? [...value]
: []
);

const freezeObject = (value) =>
Object.freeze({
...(value && typeof value === 'object'
? value
: {})
});

export const H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT =
Object.freeze({
contractId:
'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_v1',

currentStep:  
  'STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE',  

renewsContractId:  
  'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_032F_RENDERER_032D_PARENT_DESCRIPTOR_COMPOSITION_ALIGNMENT_v1',  

file:  
  '/showroom/globe/h-earth/compositor.js',  

fileClass:  
  'PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_DESCRIPTOR_ONLY',  

route:  
  '/showroom/globe/h-earth/',  

sourceRoot:  
  '/h-earth-3d/',  

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

dependencyDirection:  
  'CAPACITY_ENVIRONMENT_SOURCE_SPINE_TO_COMPOSITOR_TO_RENDERER_TO_PUBLIC_STAGE',  

legacyDependencyDirectionRetired:  
  'RENDERER_SCENE_TO_COMPOSITOR',  

importsRendererModule:  
  false,  

consumes: Object.freeze([  
  '/showroom/globe/h-earth/capacity.js',  
  '/showroom/globe/h-earth/environment.js',  
  '/h-earth-3d/boundaries/matrix-boundaries.js',  
  '/h-earth-3d/objects/ground-cell-001.objects.js',  
  '/h-earth-3d/zones/ground-cell-001.zones.js',  
  '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js'  
]),  

intendedDownstreamConsumers:  
  Object.freeze([  
    '/showroom/globe/h-earth/renderer.js',  
    '/showroom/globe/h-earth/index.js'  
  ]),  

governingSourceSpine:  
  Object.freeze({  
    step034I:  
      'H_EARTH_MATRIX_BOUNDARIES_FILE_RENEWAL_STEP_034I_PUBLIC_STAGE_AUTHORITY_AMENDMENT_v1',  

    step034J:  
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',  

    step034K:  
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',  

    step034L:  
      'H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_RENEWAL_STEP_034L_LANDSCAPE_LATTICE_ZONE_AND_RENDER_TARGET_ALIGNMENT_v1'  
  }),  

step034LDriveOccurrence:  
  Object.freeze({  
    archiveTitle:  
      'h-earth-256-lattice-landscape-step-034l-zone-and-render-target-alignment-backup',  

    driveDocumentId:  
      '10HUxO6UsqD0CoSLIB4v6bgJpwLehVFH5bLY-n0jsQnU',  

    step034LReferenced:  
      true,  

    step034LDriveOccurrenceRecorded:  
      true,  

    connectorReadbackVerified:  
      false,  

    byteForByteIdentityClaimed:  
      false  
  }),  

compositionAuthority:  
  Object.freeze({  
    sourceDriven:  
      true,  

    rendererIndependent:  
      true,  

    deterministic:  
      true,  

    descriptorOnly:  
      true,  

    orderedVisualSpineDefined:  
      true,  

    cameraFrameDefined:  
      true,  

    depthBandsDefined:  
      true,  

    layerOrderDefined:  
      true,  

    sourceBindingsDefined:  
      true,  

    rendererHandoffDefined:  
      true,  

    publicStageHandoffDefined:  
      true  
  }),  

legacyStep032RendererSurfacesRetired:  
  Object.freeze([  
    'H_EARTH_3D_CANDIDATE_RENDER_SCENE',  
    'H_EARTH_3D_RENDER_PROJECTION_MODEL',  
    'H_EARTH_3D_RENDER_VOLUME_MODEL',  
    'H_EARTH_3D_RENDER_LAYER_ORDER',  
    'H_EARTH_3D_RENDER_NODE_BUDGET',  
    'H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL',  
    'H_EARTH_3D_RENDER_BOUNDARY_FLAGS',  
    'getRendererCandidateParentNodes',  
    'resolveComposedCandidateFrame',  
    'H_EARTH_3D_COMPOSED_CANDIDATE_FRAME',  
    'upstreamRendererReceipt',  
    'upstreamRenderer'  
  ]),  

status:  
  'PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_DEFINED_DESCRIPTOR_ONLY',  

sourceConstructionAuthorized:  
  true,  

installationAuthorized:  
  false,  

repositoryMutationAuthorized:  
  false,  

backupComplete:  
  false,  

activeBackedOccurrenceClaim:  
  false

});

export const H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS =
Object.freeze({
descriptorOnly: true,
compositionAuthorityDefined: true,
rendererIndependentComposition: true,
importsRendererModule: false,
consumesLegacyRendererScene: false,

createsDom: false,  
mutatesDom: false,  
createsCss: false,  
mutatesCss: false,  

createsRendererGeometry: false,  
createsTerrainGeometry: false,  
invokesGeometryPort: false,  
invokesNodeFactory: false,  

activatesRenderer: false,  
activatesRuntime: false,  
activatesRoute: false,  
activatesCanvas: false,  
activatesWebgl: false,  

createsVisualPass: false,  
claimsVisualPass: false,  
claimsRendererPass: false,  
claimsValidation: false,  
claimsProduction: false,  
claimsDeployment: false,  

createsTraversal: false,  
createsGameplay: false,  
createsCollision: false,  
createsPhysics: false,  
createsSwimming: false,  
createsFluidSimulation: false,  
createsSurvivalSimulation: false,  
createsManorInteriorAccess: false,  
createsDistantTraversal: false,  
createsOpenWorldAuthority: false,  

matrixCollapse: false,  
claimBoundaryPreserved: true

});

export const H_EARTH_3D_PUBLIC_STAGE_SOURCE_REFERENCES =
Object.freeze({
capacity:
Object.freeze({
file:
'/showroom/globe/h-earth/capacity.js',

contract:  
      CapacityModule.H_EARTH_3D_CAPACITY_CONTRACT ||  
      CapacityModule.H_EARTH_3D_CAMERA_CAPACITY ||  
      null,  

    receipt:  
      typeof CapacityModule.getCapacityReceipt ===  
      'function'  
        ? CapacityModule.getCapacityReceipt()  
        : CapacityModule.H_EARTH_3D_CAPACITY_RECEIPT ||  
          null  
  }),  

environment:  
  Object.freeze({  
    file:  
      '/showroom/globe/h-earth/environment.js',  

    contract:  
      EnvironmentModule.H_EARTH_3D_ENVIRONMENT_CONTRACT ||  
      EnvironmentModule.H_EARTH_3D_ENVIRONMENT ||  
      null,  

    receipt:  
      typeof EnvironmentModule.getEnvironmentReceipt ===  
      'function'  
        ? EnvironmentModule.getEnvironmentReceipt()  
        : EnvironmentModule.H_EARTH_3D_ENVIRONMENT_RECEIPT ||  
          null  
  }),  

matrixBoundary:  
  Object.freeze({  
    file:  
      '/h-earth-3d/boundaries/matrix-boundaries.js',  

    contractId:  
      'H_EARTH_MATRIX_BOUNDARIES_FILE_RENEWAL_STEP_034I_PUBLIC_STAGE_AUTHORITY_AMENDMENT_v1',  

    module:  
      MatrixBoundaryModule,  

    referenced:  
      true  
  }),  

objects:  
  Object.freeze({  
    file:  
      '/h-earth-3d/objects/ground-cell-001.objects.js',  

    contractId:  
      'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_034J_PUBLIC_STAGE_READABILITY_AMENDMENT_v1',  

    module:  
      ObjectAuthorityModule,  

    referenced:  
      true  
  }),  

zones:  
  Object.freeze({  
    file:  
      '/h-earth-3d/zones/ground-cell-001.zones.js',  

    contractId:  
      'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_034K_PUBLIC_STAGE_RENDER_TARGET_ZONE_ALIGNMENT_v1',  

    module:  
      ZoneAuthorityModule,  

    referenced:  
      true  
  }),  

landscapeLattice:  
  Object.freeze({  
    file:  
      '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',  

    contractId:  
      'H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_RENEWAL_STEP_034L_LANDSCAPE_LATTICE_ZONE_AND_RENDER_TARGET_ALIGNMENT_v1',  

    aggregate:  
      LandscapeLatticeModule  
        .H_EARTH_256_LATTICE_LANDSCAPE_AGGREGATE ||  
      null,  

    receipt:  
      LandscapeLatticeModule  
        .H_EARTH_256_LATTICE_LANDSCAPE_RECEIPT ||  
      null,  

    referenced:  
      true,  

    activeDriveOccurrence:  
      true  
  })

});

export const H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS =
Object.freeze({
sky:
'PUBLIC_STAGE_LAYER_SKY',

airHaze:  
  'PUBLIC_STAGE_LAYER_AIR_HAZE',  

horizon:  
  'PUBLIC_STAGE_LAYER_HORIZON',  

offshoreIslets:  
  'PUBLIC_STAGE_LAYER_OFFSHORE_ISLETS',  

manorBluff:  
  'PUBLIC_STAGE_LAYER_MANOR_BLUFF',  

waterPlane:  
  'PUBLIC_STAGE_LAYER_WATER_PLANE',  

nearshoreWave:  
  'PUBLIC_STAGE_LAYER_NEARSHORE_WAVE',  

foamLine:  
  'PUBLIC_STAGE_LAYER_FOAM_LINE',  

drySand:  
  'PUBLIC_STAGE_LAYER_DRY_SAND',  

wetSand:  
  'PUBLIC_STAGE_LAYER_WET_SAND',  

tidePools:  
  'PUBLIC_STAGE_LAYER_TIDE_POOLS',  

stones:  
  'PUBLIC_STAGE_LAYER_SMALL_STONES',  

jaggedRocks:  
  'PUBLIC_STAGE_LAYER_JAGGED_ROCKS',  

inspectionAnchor:  
  'PUBLIC_STAGE_LAYER_INSPECTION_ANCHOR',  

overlayAttachment:  
  'PUBLIC_STAGE_LAYER_OVERLAY_ATTACHMENT'

});

export const H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER =
Object.freeze([
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.sky,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.airHaze,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.horizon,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.offshoreIslets,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.manorBluff,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.waterPlane,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.nearshoreWave,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.foamLine,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.drySand,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.wetSand,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.tidePools,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.stones,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.jaggedRocks,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.inspectionAnchor,
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS.overlayAttachment
]);

export const H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS =
Object.freeze({
sky:
Object.freeze({
depthBand:
'sky',

normalizedDepth:  
      1,  

    sceneDistance:  
      'farthest'  
  }),  

horizon:  
  Object.freeze({  
    depthBand:  
      'horizon',  

    normalizedDepth:  
      0.94,  

    sceneDistance:  
      'distant'  
  }),  

horizonContext:  
  Object.freeze({  
    depthBand:  
      'horizon-context',  

    normalizedDepth:  
      0.86,  

    sceneDistance:  
      'distant-context'  
  }),  

elevatedBackground:  
  Object.freeze({  
    depthBand:  
      'elevated-background',  

    normalizedDepth:  
      0.78,  

    sceneDistance:  
      'background'  
  }),  

water:  
  Object.freeze({  
    depthBand:  
      'water',  

    normalizedDepth:  
      0.68,  

    sceneDistance:  
      'middle-distance'  
  }),  

nearshore:  
  Object.freeze({  
    depthBand:  
      'nearshore',  

    normalizedDepth:  
      0.56,  

    sceneDistance:  
      'near-middle-distance'  
  }),  

shoreline:  
  Object.freeze({  
    depthBand:  
      'shoreline',  

    normalizedDepth:  
      0.43,  

    sceneDistance:  
      'transition'  
  }),  

foregroundTransition:  
  Object.freeze({  
    depthBand:  
      'foreground-transition',  

    normalizedDepth:  
      0.3,  

    sceneDistance:  
      'near'  
  }),  

foreground:  
  Object.freeze({  
    depthBand:  
      'foreground',  

    normalizedDepth:  
      0.14,  

    sceneDistance:  
      'nearest'  
  }),  

overlay:  
  Object.freeze({  
    depthBand:  
      'overlay',  

    normalizedDepth:  
      0,  

    sceneDistance:  
      'screen-space-attachment'  
  })

});

export const H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL =
Object.freeze({
cameraModelId:
'H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL_STEP_034N',

cameraType:  
  'bounded-ground-view-composition-camera',  

compositionPosture:  
  'LOW_GROUND_INSPECTION_WITH_OPEN_HORIZON',  

primaryFocusObjectId:  
  'OBJ_002_FOREGROUND_WET_SAND',  

secondaryFocusObjectIds:  
  Object.freeze([  
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',  
    'OBJ_010_SMALL_BEACH_STONES',  
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',  
    'OBJ_005_SHORELINE_FOAM_LINE'  
  ]),  

contextObjectIds:  
  Object.freeze([  
    'OBJ_007_WATER_SURFACE_PLANE',  
    'OBJ_008_AIR_HAZE_LIGHT_LAYER',  
    'OBJ_009_MANOR_EXTERIOR_CONTEXT',  
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'  
  ]),  

defaultPosition:  
  freezeObject(  
    CapacityModule  
      .H_EARTH_3D_CAMERA_CAPACITY  
      ?.defaultPosition || {  
      x: 0,  
      y: 2.4,  
      z: 8  
    }  
  ),  

defaultLookAt:  
  freezeObject(  
    CapacityModule  
      .H_EARTH_3D_CAMERA_CAPACITY  
      ?.defaultLookAt || {  
      x: 0,  
      y: 0,  
      z: -7  
    }  
  ),  

perspective:  
  Object.freeze({  
    horizonOpen:  
      true,  

    foregroundDominant:  
      true,  

    waterPlaneVisible:  
      true,  

    manorContextVisible:  
      true,  

    offshoreContextVisible:  
      true,  

    inspectionSurfaceReadable:  
      true,  

    overlayAttachedOutsideWorldGeometry:  
      true  
  }),  

movementConstraints:  
  Object.freeze({  
    panLimits:  
      CapacityModule  
        .H_EARTH_3D_CAMERA_CAPACITY  
        ?.panLimits || null,  

    tiltLimitsDegrees:  
      CapacityModule  
        .H_EARTH_3D_CAMERA_CAPACITY  
        ?.tiltLimitsDegrees || null,  

    zoomLimits:  
      CapacityModule  
        .H_EARTH_3D_CAMERA_CAPACITY  
        ?.zoomLimits || null,  

    freeFlight:  
      false,  

    walking:  
      false,  

    swimming:  
      false,  

    manorEntry:  
      false,  

    distantTraversal:  
      false  
  }),  

descriptorOnly:  
  true

});

export const H_EARTH_3D_PUBLIC_STAGE_VIEWPORT_MODEL =
Object.freeze({
viewportModelId:
'H_EARTH_3D_PUBLIC_STAGE_VIEWPORT_MODEL_STEP_034N',

compositionTarget:  
  'LARGE_SCENE_FIRST',  

layoutPolicy:  
  'WORLD_STAGE_PRIMARY_OVERLAY_SECONDARY',  

worldStage:  
  Object.freeze({  
    widthRole:  
      'PRIMARY_AVAILABLE_ROUTE_WIDTH',  

    heightRole:  
      'PRIMARY_AVAILABLE_ROUTE_HEIGHT',  

    minimumReadableHeight:  
      'large-scene',  

    overflowPolicy:  
      'CONSTRAINED_WITHIN_PUBLIC_STAGE'  
  }),  

overlay:  
  Object.freeze({  
    role:  
      'SECONDARY_COMPACT_READOUT_ATTACHMENT',  

    worldGeometryParticipant:  
      false,  

    mayCoverPrimaryInspectionSurface:  
      false,  

    collapsedDiagnosticsDefault:  
      true  
  }),  

descriptorOnly:  
  true,  

createsDom:  
  false,  

createsCss:  
  false

});

export const H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RULES =
Object.freeze({
ruleSetId:
'H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RULES_STEP_034N',

controllingStatement:  
  'PublicStageComposition = CurrentSourceSpine + Capacity + Environment + OrderedSceneLayers + CameraFrame + DepthBands + RendererHandoff + PublicStageAttachmentDescriptors',  

lockedRules:  
  Object.freeze([  
    'Compositor is upstream of renderer.',  
    'Compositor must not import renderer.js.',  
    'Current Step 034 source authority governs composition.',  
    'Landscape-lattice descriptors govern ground and context-region placement.',  
    'Step 034K zones govern five-zone render-target composition.',  
    'Step 034J object authority governs object identity and readability.',  
    'Step 034I boundaries govern public-stage claim discipline.',  
    'Foreground wet sand remains the primary inspection surface.',  
    'Tide pools, small stones, jagged rocks, and foam remain supporting inspection cues.',  
    'Dry sand remains primary Zone 002 context.',  
    'Nearshore wave and water plane remain primary Zone 003 context.',  
    'Air haze remains primary Zone 003 with secondary Zone 005 relation.',  
    'Mirror Manor remains elevated, set back, exterior-only, and non-traversable.',  
    'Offshore rock stacks and islets remain distant Zone 005 context.',  
    'Rows 14 and 15 preserve distinct islet and manor composition regions.',  
    'Overlay/readout attachment remains outside world geometry.',  
    'Composition descriptors do not create renderer geometry.',  
    'Composition descriptors do not create runtime activation.',  
    'No visual pass, validation, production, deployment, or matrix-collapse claim.'  
  ]),  

rendererHandoffRequirements:  
  Object.freeze([  
    'orderedLayers',  
    'cameraFrame',  
    'viewportModel',  
    'depthBands',  
    'sourceBindings',  
    'zoneComposition',  
    'landscapeComposition',  
    'objectComposition',  
    'inspectionComposition',  
    'contextComposition',  
    'overlayAttachment',  
    'boundary'  
  ])

});

export const H_EARTH_3D_PUBLIC_STAGE_LAYER_DEFINITIONS =
Object.freeze({
PUBLIC_STAGE_LAYER_SKY:
Object.freeze({
layerId:
'PUBLIC_STAGE_LAYER_SKY',

order:  
      10,  

    label:  
      'Sky',  

    role:  
      'sky-volume',  

    regionId:  
      'AIR_HAZE_DISTANT_ATMOSPHERE',  

    primaryZoneId:  
      'ZONE_003_WATER_SURFACE_ZONE',  

    secondaryZoneId:  
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_008_AIR_HAZE_LIGHT_LAYER'  
      ]),  

    surfaceFamily:  
      'airHaze',  

    materialKey:  
      'airHaze',  

    primitiveIntent:  
      'skyVolume',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.sky,  

    worldGeometryRole:  
      'BACKGROUND_ATMOSPHERE',  

    inspectionRole:  
      'CONTEXT',  

    publicStageReadable:  
      false,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_AIR_HAZE:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_AIR_HAZE',  

    order:  
      20,  

    label:  
      'Air Haze',  

    role:  
      'atmospheric-depth-layer',  

    regionId:  
      'AIR_HAZE_DISTANT_ATMOSPHERE',  

    primaryZoneId:  
      'ZONE_003_WATER_SURFACE_ZONE',  

    secondaryZoneId:  
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_008_AIR_HAZE_LIGHT_LAYER'  
      ]),  

    surfaceFamily:  
      'airHaze',  

    materialKey:  
      'airHaze',  

    primitiveIntent:  
      'atmosphericLayer',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.horizon,  

    worldGeometryRole:  
      'ATMOSPHERIC_COMPRESSION',  

    inspectionRole:  
      'CONTEXT',  

    publicStageReadable:  
      false,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_HORIZON:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_HORIZON',  

    order:  
      30,  

    label:  
      'Horizon',  

    role:  
      'horizon-separation-band',  

    regionId:  
      'AIR_HAZE_DISTANT_ATMOSPHERE',  

    primaryZoneId:  
      'ZONE_003_WATER_SURFACE_ZONE',  

    secondaryZoneId:  
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_008_AIR_HAZE_LIGHT_LAYER',  
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'  
      ]),  

    surfaceFamily:  
      'horizon',  

    materialKey:  
      'airHaze',  

    primitiveIntent:  
      'horizonBand',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.horizon,  

    worldGeometryRole:  
      'DISTANT_SCENE_SEPARATOR',  

    inspectionRole:  
      'CONTEXT',  

    publicStageReadable:  
      false,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_OFFSHORE_ISLETS:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_OFFSHORE_ISLETS',  

    order:  
      40,  

    label:  
      'Offshore Rock Stacks and Islets',  

    role:  
      'distant-offshore-context',  

    regionId:  
      'OFFSHORE_ROCK_STACKS_AND_ISLETS',  

    primaryZoneId:  
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',  

    secondaryZoneId:  
      null,  

    objectIds:  
      Object.freeze([  
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'  
      ]),  

    surfaceFamily:  
      'distantRock',  

    materialKey:  
      'distantRock',  

    primitiveIntent:  
      'offshoreDistantCluster',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS  
        .horizonContext,  

    worldGeometryRole:  
      'DISTANT_PLANETARY_CONTEXT',  

    inspectionRole:  
      'CONTEXT',  

    publicStageReadable:  
      false,  

    offshoreContext:  
      true,  

    distantTraversalAuthorized:  
      false,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_MANOR_BLUFF:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_MANOR_BLUFF',  

    order:  
      50,  

    label:  
      'Elevated Mirror Manor and Bluff Context',  

    role:  
      'elevated-manor-exterior-context',  

    regionId:  
      'ELEVATED_MANOR_CONTEXT',  

    primaryZoneId:  
      'ZONE_004_MANOR_CONTEXT_ZONE',  

    secondaryZoneId:  
      null,  

    objectIds:  
      Object.freeze([  
        'OBJ_009_MANOR_EXTERIOR_CONTEXT'  
      ]),  

    surfaceFamily:  
      'manorExterior',  

    materialKey:  
      'manorContext',  

    primitiveIntent:  
      'elevatedArchitecturalCluster',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS  
        .elevatedBackground,  

    worldGeometryRole:  
      'ELEVATED_BACKGROUND_CONTEXT',  

    inspectionRole:  
      'CONTEXT',  

    publicStageReadable:  
      false,  

    elevatedAboveShoreline:  
      true,  

    setBackFromShoreline:  
      true,  

    hillOrCliffContext:  
      true,  

    exteriorOnly:  
      true,  

    traversable:  
      false,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_WATER_PLANE:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_WATER_PLANE',  

    order:  
      60,  

    label:  
      'Water Surface Plane',  

    role:  
      'open-water-stage',  

    regionId:  
      'WATER_SURFACE_PLANE',  

    primaryZoneId:  
      'ZONE_003_WATER_SURFACE_ZONE',  

    secondaryZoneId:  
      null,  

    objectIds:  
      Object.freeze([  
        'OBJ_007_WATER_SURFACE_PLANE',  
        'OBJ_008_AIR_HAZE_LIGHT_LAYER'  
      ]),  

    surfaceFamily:  
      'water',  

    materialKey:  
      'water',  

    primitiveIntent:  
      'waterPlane',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.water,  

    worldGeometryRole:  
      'MIDDLE_DISTANCE_WATER_SURFACE',  

    inspectionRole:  
      'CONTEXT',  

    publicStageReadable:  
      false,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_NEARSHORE_WAVE:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_NEARSHORE_WAVE',  

    order:  
      70,  

    label:  
      'Nearshore Wave Band',  

    role:  
      'nearshore-water-depth-transition',  

    regionId:  
      'NEARSHORE_WAVE_BAND',  

    primaryZoneId:  
      'ZONE_003_WATER_SURFACE_ZONE',  

    secondaryZoneId:  
      'ZONE_002_SHORELINE_CONTACT_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_006_NEARSHORE_WAVE_BAND'  
      ]),  

    surfaceFamily:  
      'nearshoreWave',  

    materialKey:  
      'nearshoreWave',  

    primitiveIntent:  
      'waterDepthBand',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.nearshore,  

    worldGeometryRole:  
      'NEARSHORE_TRANSITION',  

    inspectionRole:  
      'CONTEXT',  

    publicStageReadable:  
      false,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_FOAM_LINE:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_FOAM_LINE',  

    order:  
      80,  

    label:  
      'Shoreline Foam Line',  

    role:  
      'earth-water-contact-boundary',  

    regionId:  
      'SHORELINE_CONTACT',  

    primaryZoneId:  
      'ZONE_002_SHORELINE_CONTACT_ZONE',  

    secondaryZoneId:  
      'ZONE_003_WATER_SURFACE_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_005_SHORELINE_FOAM_LINE'  
      ]),  

    surfaceFamily:  
      'foam',  

    materialKey:  
      'foam',  

    primitiveIntent:  
      'irregularShorelineBand',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.shoreline,  

    worldGeometryRole:  
      'SHORELINE_BOUNDARY',  

    inspectionRole:  
      'SUPPORTING_INSPECTION',  

    publicStageReadable:  
      true,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_DRY_SAND:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_DRY_SAND',  

    order:  
      90,  

    label:  
      'Dry-Sand Transition',  

    role:  
      'upper-beach-transition',  

    regionId:  
      'DRY_SAND_UPPER_BEACH',  

    primaryZoneId:  
      'ZONE_002_SHORELINE_CONTACT_ZONE',  

    secondaryZoneId:  
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_003_DRY_SAND_TRANSITION'  
      ]),  

    surfaceFamily:  
      'drySand',  

    materialKey:  
      'drySand',  

    primitiveIntent:  
      'terrainBand',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS  
        .foregroundTransition,  

    worldGeometryRole:  
      'UPPER_BEACH_TRANSITION',  

    inspectionRole:  
      'SECONDARY_SURFACE_CONTEXT',  

    publicStageReadable:  
      false,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_WET_SAND:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_WET_SAND',  

    order:  
      100,  

    label:  
      'Foreground Wet Sand',  

    role:  
      'primary-inspection-surface',  

    regionId:  
      'FOREGROUND_INSPECTION_GROUND',  

    primaryZoneId:  
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',  

    secondaryZoneId:  
      null,  

    objectIds:  
      Object.freeze([  
        'OBJ_002_FOREGROUND_WET_SAND'  
      ]),  

    surfaceFamily:  
      'wetSand',  

    materialKey:  
      'wetSand',  

    primitiveIntent:  
      'contouredTerrainBand',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.foreground,  

    worldGeometryRole:  
      'PRIMARY_FOREGROUND_SURFACE',  

    inspectionRole:  
      'PRIMARY_INSPECTION',  

    publicStageReadable:  
      true,  

    primaryInspectionSurface:  
      true,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_TIDE_POOLS:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_TIDE_POOLS',  

    order:  
      110,  

    label:  
      'Tide Pools and Reflective Puddles',  

    role:  
      'supporting-moisture-inspection-cue',  

    regionId:  
      'SHORELINE_CONTACT',  

    primaryZoneId:  
      'ZONE_002_SHORELINE_CONTACT_ZONE',  

    secondaryZoneId:  
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES'  
      ]),  

    surfaceFamily:  
      'tidePool',  

    materialKey:  
      'tidePool',  

    primitiveIntent:  
      'surfacePoolCluster',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.foreground,  

    worldGeometryRole:  
      'FOREGROUND_REFLECTIVE_DETAIL',  

    inspectionRole:  
      'SUPPORTING_INSPECTION',  

    publicStageReadable:  
      true,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_SMALL_STONES:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_SMALL_STONES',  

    order:  
      120,  

    label:  
      'Small Beach Stones',  

    role:  
      'supporting-footing-friction-cue',  

    regionId:  
      'FOREGROUND_INSPECTION_GROUND',  

    primaryZoneId:  
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',  

    secondaryZoneId:  
      'ZONE_002_SHORELINE_CONTACT_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_010_SMALL_BEACH_STONES'  
      ]),  

    surfaceFamily:  
      'smallStone',  

    materialKey:  
      'stone',  

    primitiveIntent:  
      'smallStoneCluster',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.foreground,  

    worldGeometryRole:  
      'FOREGROUND_DETAIL',  

    inspectionRole:  
      'SUPPORTING_INSPECTION',  

    publicStageReadable:  
      true,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_JAGGED_ROCKS:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_JAGGED_ROCKS',  

    order:  
      130,  

    label:  
      'Foreground Jagged Rocks',  

    role:  
      'supporting-terrain-hazard-cue',  

    regionId:  
      'FOREGROUND_INSPECTION_GROUND',  

    primaryZoneId:  
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',  

    secondaryZoneId:  
      'ZONE_002_SHORELINE_CONTACT_ZONE',  

    objectIds:  
      Object.freeze([  
        'OBJ_011_FOREGROUND_JAGGED_ROCKS'  
      ]),  

    surfaceFamily:  
      'jaggedRock',  

    materialKey:  
      'jaggedRock',  

    primitiveIntent:  
      'jaggedRockCluster',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.foreground,  

    worldGeometryRole:  
      'FOREGROUND_HAZARD_DETAIL',  

    inspectionRole:  
      'SUPPORTING_INSPECTION',  

    publicStageReadable:  
      true,  

    rendererMayCreateGeometry:  
      true,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_INSPECTION_ANCHOR:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_INSPECTION_ANCHOR',  

    order:  
      140,  

    label:  
      'Inspection Anchor',  

    role:  
      'ground-inspection-focus-anchor',  

    regionId:  
      'FOREGROUND_INSPECTION_GROUND',  

    primaryZoneId:  
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',  

    secondaryZoneId:  
      null,  

    objectIds:  
      Object.freeze([  
        'OBJ_001_GROUND_SPAWN_ANCHOR'  
      ]),  

    surfaceFamily:  
      'inspectionAnchor',  

    materialKey:  
      'none',  

    primitiveIntent:  
      'logicalAnchor',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.foreground,  

    worldGeometryRole:  
      'LOGICAL_INSPECTION_FOCUS',  

    inspectionRole:  
      'PRIMARY_ACTION_ANCHOR',  

    publicStageReadable:  
      false,  

    rendererMayCreateGeometry:  
      false,  

    compositorCreatesGeometry:  
      false  
  }),  

PUBLIC_STAGE_LAYER_OVERLAY_ATTACHMENT:  
  Object.freeze({  
    layerId:  
      'PUBLIC_STAGE_LAYER_OVERLAY_ATTACHMENT',  

    order:  
      150,  

    label:  
      'Ground Condition Read Attachment',  

    role:  
      'public-stage-overlay-attachment',  

    regionId:  
      null,  

    primaryZoneId:  
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',  

    secondaryZoneId:  
      null,  

    objectIds:  
      EMPTY_FROZEN_ARRAY,  

    surfaceFamily:  
      'overlayAttachment',  

    materialKey:  
      'none',  

    primitiveIntent:  
      'screenSpaceAttachment',  

    depth:  
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS.overlay,  

    worldGeometryRole:  
      'NON_WORLD_OVERLAY_ATTACHMENT',  

    inspectionRole:  
      'READOUT_ATTACHMENT',  

    publicStageReadable:  
      true,  

    readoutId:  
      'Ground Condition Read',  

    firstAction:  
      'Inspect Ground',  

    worldGeometryParticipant:  
      false,  

    rendererMayCreateGeometry:  
      false,  

    compositorCreatesGeometry:  
      false  
  })

});

export function isHEarthPublicStagePlainObject(value) {
return (
value !== null &&
typeof value === 'object' &&
Array.isArray(value) === false
);
}

export function normalizeHEarthPublicStageNumber(
value,
fallback = 0
) {
const numericValue = Number(value);

return Number.isFinite(numericValue)
? numericValue
: fallback;
}

export function clampHEarthPublicStageNumber(
value,
min,
max
) {
return Math.min(
Math.max(
normalizeHEarthPublicStageNumber(
value,
min
),
min
),
max
);
}

export function clampHEarthPublicStage01(value) {
return clampHEarthPublicStageNumber(
value,
0,
1
);
}

export function getLandscapeAggregate() {
return (
LandscapeLatticeModule
.H_EARTH_256_LATTICE_LANDSCAPE_AGGREGATE ||
EMPTY_FROZEN_OBJECT
);
}

export function getLandscapeMap() {
if (
typeof LandscapeLatticeModule
.getHEarthLandscapeLatticeMap ===
'function'
) {
return (
LandscapeLatticeModule
.getHEarthLandscapeLatticeMap() ||
EMPTY_FROZEN_OBJECT
);
}

return (
LandscapeLatticeModule
.H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP ||
EMPTY_FROZEN_OBJECT
);
}

export function getLandscapeRegionSummary() {
return (
LandscapeLatticeModule
.H_EARTH_256_LATTICE_LANDSCAPE_REGION_SUMMARY ||
EMPTY_FROZEN_OBJECT
);
}

export function getLandscapeZoneSummary() {
return (
LandscapeLatticeModule
.H_EARTH_256_LATTICE_LANDSCAPE_ZONE_SUMMARY ||
EMPTY_FROZEN_OBJECT
);
}

export function getLandscapeObjectHintSummary() {
return (
LandscapeLatticeModule
.H_EARTH_256_LATTICE_OBJECT_HINT_ADDRESS_SUMMARY ||
EMPTY_FROZEN_OBJECT
);
}

export function getZoneDescriptors() {
return (
ZoneAuthorityModule
.H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS ||
EMPTY_FROZEN_OBJECT
);
}

export function getZoneRenderTargetRoles() {
return (
ZoneAuthorityModule
.H_EARTH_GROUND_CELL_001_ZONE_RENDER_TARGET_ROLES ||
EMPTY_FROZEN_OBJECT
);
}

export function getEnvironmentObjectCollection() {
const collection =
EnvironmentModule
.H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS;

if (Array.isArray(collection)) {
return Object.freeze([...collection]);
}

if (
collection &&
typeof collection === 'object'
) {
return Object.freeze(
Object.values(collection)
);
}

return EMPTY_FROZEN_ARRAY;
}

export function getEnvironmentObject(objectId) {
if (
!objectId ||
typeof objectId !== 'string'
) {
return null;
}

const collection =
EnvironmentModule
.H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS;

if (
collection &&
!Array.isArray(collection) &&
collection[objectId]
) {
return collection[objectId];
}

return (
getEnvironmentObjectCollection()
.find((object) => (
object?.objectId === objectId
)) ||
null
);
}

export function getLandscapeRegionProfile(
regionId
) {
if (
!regionId ||
typeof regionId !== 'string'
) {
return null;
}

if (
typeof LandscapeLatticeModule
.getHEarthLandscapeRegionProfile ===
'function'
) {
return (
LandscapeLatticeModule
.getHEarthLandscapeRegionProfile(
regionId
) ||
null
);
}

return (
LandscapeLatticeModule
.H_EARTH_256_LATTICE_REGION_PROFILES?.[
regionId
] ||
null
);
}

export function getLandscapeRegionAddresses(
regionId
) {
if (
!regionId ||
typeof regionId !== 'string'
) {
return EMPTY_FROZEN_ARRAY;
}

const map =
getLandscapeMap();

return Object.freeze(
Object.values(map)
.filter((record) => (
record?.regionId === regionId
))
.map((record) => record.address)
);
}

export function getLandscapeObjectAddresses(
objectId
) {
if (
!objectId ||
typeof objectId !== 'string'
) {
return EMPTY_FROZEN_ARRAY;
}

const summary =
getLandscapeObjectHintSummary();

return freezeArray(
summary?.[objectId]?.addresses
);
}

export function getLayerDefinition(layerId) {
if (
!layerId ||
typeof layerId !== 'string'
) {
return null;
}

return (
H_EARTH_3D_PUBLIC_STAGE_LAYER_DEFINITIONS[
layerId
] ||
null
);
}

export function resolvePublicStageCameraFrame() {
const cameraCapacity =
CapacityModule
.H_EARTH_3D_CAMERA_CAPACITY ||
EMPTY_FROZEN_OBJECT;

const primaryEnvironmentObject =
getEnvironmentObject(
H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL
.primaryFocusObjectId
);

const sourceCenter =
primaryEnvironmentObject?.center ||
cameraCapacity.defaultLookAt ||
H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL
.defaultLookAt;

const defaultPosition =
cameraCapacity.defaultPosition ||
H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL
.defaultPosition;

const defaultLookAt =
cameraCapacity.defaultLookAt ||
H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL
.defaultLookAt;

const requestedPosition =
Object.freeze({
x:
normalizeHEarthPublicStageNumber(
defaultPosition?.x,
0
),

y:  
    normalizeHEarthPublicStageNumber(  
      defaultPosition?.y,  
      2.4  
    ),  

  z:  
    normalizeHEarthPublicStageNumber(  
      defaultPosition?.z,  
      8  
    )  
});

const requestedLookAt =
Object.freeze({
x:
normalizeHEarthPublicStageNumber(
sourceCenter?.x,
defaultLookAt?.x || 0
),

y:  
    normalizeHEarthPublicStageNumber(  
      sourceCenter?.y,  
      defaultLookAt?.y || 0  
    ),  

  z:  
    normalizeHEarthPublicStageNumber(  
      sourceCenter?.z,  
      defaultLookAt?.z || -7  
    )  
});

const resolvedPosition =
typeof CapacityModule.clampCameraPan ===
'function'
? CapacityModule.clampCameraPan(
requestedPosition
)
: requestedPosition;

const resolvedTiltDegrees =
typeof CapacityModule.clampCameraTilt ===
'function'
? CapacityModule.clampCameraTilt(0)
: 0;

const resolvedZoom =
typeof CapacityModule.clampCameraZoom ===
'function'
? CapacityModule.clampCameraZoom(1)
: 1;

return Object.freeze({
cameraFrameId:
'H_EARTH_3D_PUBLIC_STAGE_CAMERA_FRAME',

model:  
  H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL,  

primaryFocusObjectId:  
  H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL  
    .primaryFocusObjectId,  

requestedPosition,  

position:  
  freezeObject(resolvedPosition),  

lookAt:  
  requestedLookAt,  

tiltDegrees:  
  resolvedTiltDegrees,  

zoom:  
  resolvedZoom,  

frameHint:  
  typeof CapacityModule  
    .getCameraFrameHint ===  
  'function'  
    ? CapacityModule.getCameraFrameHint(  
        H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL  
          .primaryFocusObjectId  
      )  
    : null,  

scenePosture:  
  'LOW_GROUND_INSPECTION_WITH_OPEN_HORIZON',  

foregroundDominant:  
  true,  

horizonOpen:  
  true,  

overlayAttachedOutsideWorldGeometry:  
  true,  

descriptorOnly:  
  true,  

activatesCameraControls:  
  false,  

createsTraversal:  
  false,  

boundary:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS

});
}

export function resolveLayerSourceBinding(
layerDefinition
) {
if (!layerDefinition) {
return null;
}

const regionProfile =
getLandscapeRegionProfile(
layerDefinition.regionId
);

const regionSummary =
layerDefinition.regionId
? getLandscapeRegionSummary()?.[
layerDefinition.regionId
] || null
: null;

const zoneDescriptor =
layerDefinition.primaryZoneId
? getZoneDescriptors()?.[
layerDefinition.primaryZoneId
] || null
: null;

const zoneRenderTargetRole =
layerDefinition.primaryZoneId
? getZoneRenderTargetRoles()?.[
layerDefinition.primaryZoneId
] || null
: null;

const objectBindings =
Object.freeze(
layerDefinition.objectIds.map(
(objectId) => {
const environmentObject =
getEnvironmentObject(objectId);

const objectAuthority =  
        ObjectAuthorityModule  
          .H_EARTH_GROUND_CELL_001_OBJECTS?.[  
            objectId  
          ] ||  
        ObjectAuthorityModule  
          .H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS?.[  
            objectId  
          ] ||  
        null;  

      return Object.freeze({  
        objectId,  

        environmentObject,  

        objectAuthority,  

        latticeAddresses:  
          getLandscapeObjectAddresses(  
            objectId  
          ),  

        sourcePresent:  
          Boolean(  
            environmentObject ||  
            objectAuthority  
          )  
      });  
    }  
  )  
);

return Object.freeze({
layerId:
layerDefinition.layerId,

regionId:  
  layerDefinition.regionId,  

primaryZoneId:  
  layerDefinition.primaryZoneId,  

secondaryZoneId:  
  layerDefinition.secondaryZoneId,  

regionProfile,  

regionSummary,  

regionAddresses:  
  layerDefinition.regionId  
    ? getLandscapeRegionAddresses(  
        layerDefinition.regionId  
      )  
    : EMPTY_FROZEN_ARRAY,  

zoneDescriptor,  

zoneRenderTargetRole,  

objectBindings,  

sourceSpine:  
  H_EARTH_3D_PUBLIC_STAGE_SOURCE_REFERENCES,  

descriptorOnly:  
  true

});
}

export function resolvePublicStageLayer(
layerId
) {
const definition =
getLayerDefinition(layerId);

if (!definition) {
return null;
}

const sourceBinding =
resolveLayerSourceBinding(definition);

const addressCount =
sourceBinding?.regionAddresses?.length ||
0;

const sourceObjectCount =
sourceBinding?.objectBindings?.filter(
(binding) => (
binding.sourcePresent === true
)
).length ||
0;

return Object.freeze({
layerId:
definition.layerId,

order:  
  definition.order,  

label:  
  definition.label,  

role:  
  definition.role,  

regionId:  
  definition.regionId,  

primaryZoneId:  
  definition.primaryZoneId,  

secondaryZoneId:  
  definition.secondaryZoneId,  

objectIds:  
  definition.objectIds,  

surfaceFamily:  
  definition.surfaceFamily,  

materialKey:  
  definition.materialKey,  

primitiveIntent:  
  definition.primitiveIntent,  

depth:  
  definition.depth,  

worldGeometryRole:  
  definition.worldGeometryRole,  

inspectionRole:  
  definition.inspectionRole,  

publicStageReadable:  
  definition.publicStageReadable,  

sourceBinding,  

sourceAddressCount:  
  addressCount,  

sourceObjectCount,  

rendererMayCreateGeometry:  
  definition.rendererMayCreateGeometry ===  
  true,  

compositorCreatesGeometry:  
  false,  

descriptorOnly:  
  true,  

claimFlags:  
  Object.freeze({  
    compositionDescriptor:  
      true,  

    rendererInputDescriptor:  
      true,  

    domDescriptorOnly:  
      true,  

    geometryCreated:  
      false,  

    rendererActivated:  
      false,  

    runtimeActivated:  
      false,  

    visualPassClaim:  
      false,  

    validationClaim:  
      false,  

    productionClaim:  
      false,  

    deploymentClaim:  
      false,  

    traversalClaim:  
      false,  

    physicsClaim:  
      false,  

    matrixCollapse:  
      false  
  }),  

boundary:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS

});
}

export function resolvePublicStageLayers() {
return Object.freeze(
H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER
.map(resolvePublicStageLayer)
.filter(Boolean)
);
}

export function resolvePublicStageZoneComposition(
layers = resolvePublicStageLayers()
) {
const entries = {};

layers.forEach((layer) => {
const zoneId =
layer.primaryZoneId;

if (!zoneId) {  
  return;  
}  

if (!entries[zoneId]) {  
  entries[zoneId] = {  
    zoneId,  
    layerIds: [],  
    regionIds: new Set(),  
    objectIds: new Set(),  
    publicStageReadableLayerIds: [],  
    rendererGeometryEligibleLayerIds: []  
  };  
}  

entries[zoneId]  
  .layerIds.push(layer.layerId);  

if (layer.regionId) {  
  entries[zoneId]  
    .regionIds.add(layer.regionId);  
}  

layer.objectIds.forEach(  
  (objectId) => {  
    entries[zoneId]  
      .objectIds.add(objectId);  
  }  
);  

if (  
  layer.publicStageReadable === true  
) {  
  entries[zoneId]  
    .publicStageReadableLayerIds  
    .push(layer.layerId);  
}  

if (  
  layer.rendererMayCreateGeometry ===  
  true  
) {  
  entries[zoneId]  
    .rendererGeometryEligibleLayerIds  
    .push(layer.layerId);  
}

});

return Object.freeze(
Object.fromEntries(
Object.entries(entries).map(
([zoneId, entry]) => [
zoneId,

Object.freeze({  
        zoneId,  

        zoneDescriptor:  
          getZoneDescriptors()?.[  
            zoneId  
          ] || null,  

        zoneRenderTargetRole:  
          getZoneRenderTargetRoles()?.[  
            zoneId  
          ] || null,  

        zoneLandscapeSummary:  
          getLandscapeZoneSummary()?.[  
            zoneId  
          ] || null,  

        layerIds:  
          Object.freeze([  
            ...entry.layerIds  
          ]),  

        regionIds:  
          Object.freeze([  
            ...entry.regionIds  
          ]),  

        objectIds:  
          Object.freeze([  
            ...entry.objectIds  
          ]),  

        publicStageReadableLayerIds:  
          Object.freeze([  
            ...entry  
              .publicStageReadableLayerIds  
          ]),  

        rendererGeometryEligibleLayerIds:  
          Object.freeze([  
            ...entry  
              .rendererGeometryEligibleLayerIds  
          ]),  

        descriptorOnly:  
          true  
      })  
    ]  
  )  
)

);
}

export function resolvePublicStageInspectionComposition(
layers = resolvePublicStageLayers()
) {
const primaryLayers =
layers.filter((layer) => (
layer.inspectionRole ===
'PRIMARY_INSPECTION' ||
layer.inspectionRole ===
'PRIMARY_ACTION_ANCHOR'
));

const supportingLayers =
layers.filter((layer) => (
layer.inspectionRole ===
'SUPPORTING_INSPECTION'
));

const secondarySurfaceLayers =
layers.filter((layer) => (
layer.inspectionRole ===
'SECONDARY_SURFACE_CONTEXT'
));

return Object.freeze({
compositionId:
'H_EARTH_3D_PUBLIC_STAGE_INSPECTION_COMPOSITION',

firstAction:  
  'Inspect Ground',  

firstReadout:  
  'Ground Condition Read',  

firstReceipt:  
  'H_EARTH_GROUND_INSPECTION_RECEIPT',  

primaryFocusObjectId:  
  'OBJ_002_FOREGROUND_WET_SAND',  

primaryLayerIds:  
  Object.freeze(  
    primaryLayers.map(  
      (layer) => layer.layerId  
    )  
  ),  

supportingLayerIds:  
  Object.freeze(  
    supportingLayers.map(  
      (layer) => layer.layerId  
    )  
  ),  

secondarySurfaceLayerIds:  
  Object.freeze(  
    secondarySurfaceLayers.map(  
      (layer) => layer.layerId  
    )  
  ),  

primaryObjectIds:  
  Object.freeze(  
    primaryLayers.flatMap(  
      (layer) => layer.objectIds  
    )  
  ),  

supportingObjectIds:  
  Object.freeze(  
    supportingLayers.flatMap(  
      (layer) => layer.objectIds  
    )  
  ),  

primaryInspectionSurfacePresent:  
  primaryLayers.some((layer) => (  
    layer.objectIds.includes(  
      'OBJ_002_FOREGROUND_WET_SAND'  
    )  
  )),  

inspectionAnchorPresent:  
  primaryLayers.some((layer) => (  
    layer.objectIds.includes(  
      'OBJ_001_GROUND_SPAWN_ANCHOR'  
    )  
  )),  

descriptorOnly:  
  true,  

createsInteraction:  
  false,  

createsReceipt:  
  false,  

activatesInspection:  
  false

});
}

export function resolvePublicStageContextComposition(
layers = resolvePublicStageLayers()
) {
const manorLayer =
layers.find((layer) => (
layer.layerId ===
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
.manorBluff
)) ||
null;

const offshoreLayer =
layers.find((layer) => (
layer.layerId ===
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
.offshoreIslets
)) ||
null;

const atmosphericLayers =
layers.filter((layer) => (
layer.layerId ===
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
.sky ||
layer.layerId ===
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
.airHaze ||
layer.layerId ===
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
.horizon
));

return Object.freeze({
compositionId:
'H_EARTH_3D_PUBLIC_STAGE_CONTEXT_COMPOSITION',

manor:  
  manorLayer,  

offshore:  
  offshoreLayer,  

atmosphericLayerIds:  
  Object.freeze(  
    atmosphericLayers.map(  
      (layer) => layer.layerId  
    )  
  ),  

matrixSeparation:  
  Object.freeze({  
    hEarth:  
      'Ground-View Matrix',  

    hearth:  
      'support/control context only',  

    audralia:  
      'planetary-world context only',  

    matrixCollapse:  
      false  
  }),  

manorRules:  
  Object.freeze({  
    elevatedAboveShoreline:  
      true,  

    setBackFromShoreline:  
      true,  

    hillOrCliffContext:  
      true,  

    exteriorOnly:  
      true,  

    traversable:  
      false,  

    interiorAccess:  
      false  
  }),  

offshoreRules:  
  Object.freeze({  
    contextOnly:  
      true,  

    isletContext:  
      true,  

    distantTraversalAuthorized:  
      false  
  }),  

atmosphericRules:  
  Object.freeze({  
    primaryZoneId:  
      'ZONE_003_WATER_SURFACE_ZONE',  

    secondaryZoneId:  
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',  

    createsWeatherSimulation:  
      false,  

    createsFluidSimulation:  
      false  
  }),  

descriptorOnly:  
  true

});
}

export function resolvePublicStageOverlayAttachment() {
const layer =
resolvePublicStageLayer(
H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
.overlayAttachment
);

return Object.freeze({
attachmentId:
'H_EARTH_3D_PUBLIC_STAGE_OVERLAY_ATTACHMENT',

layer,  

firstAction:  
  'Inspect Ground',  

readoutId:  
  'Ground Condition Read',  

statusAttachmentTarget:  
  'h-earth-3d-status',  

fallbackAttachmentTarget:  
  'h-earth-3d-fallback',  

hudAttachmentTarget:  
  'h-earth-3d-hud',  

inspectionPanelAttachmentTarget:  
  'h-earth-3d-inspection-panel',  

compactOverlay:  
  true,  

developerDiagnosticsCollapsedByDefault:  
  true,  

worldGeometryParticipant:  
  false,  

rendererGeometryParticipant:  
  false,  

descriptorOnly:  
  true,  

createsDom:  
  false,  

createsCss:  
  false

});
}

export function resolvePublicStageRendererHandoff(
layers = resolvePublicStageLayers()
) {
return Object.freeze({
handoffId:
'H_EARTH_3D_PUBLIC_STAGE_RENDERER_HANDOFF',

compositorContractId:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT  
    .contractId,  

intendedRendererFile:  
  '/showroom/globe/h-earth/renderer.js',  

intendedRendererRenewal:  
  'STEP_034O_PUBLIC_STAGE_RENDERER_CONSUMPTION_RENEWAL',  

rendererInputClass:  
  'PUBLIC_STAGE_COMPOSITION_DESCRIPTOR',  

orderedLayerIds:  
  Object.freeze(  
    layers.map(  
      (layer) => layer.layerId  
    )  
  ),  

rendererGeometryEligibleLayerIds:  
  Object.freeze(  
    layers  
      .filter((layer) => (  
        layer.rendererMayCreateGeometry ===  
        true  
      ))  
      .map((layer) => layer.layerId)  
  ),  

nonGeometryLayerIds:  
  Object.freeze(  
    layers  
      .filter((layer) => (  
        layer.rendererMayCreateGeometry !==  
        true  
      ))  
      .map((layer) => layer.layerId)  
  ),  

rendererMustConsumeCompositorAuthority:  
  true,  

rendererMustNotReinventLayerOrder:  
  true,  

rendererMustNotReinventZoneComposition:  
  true,  

rendererMustNotReinventLandscapeComposition:  
  true,  

rendererMayMaterializeGeometry:  
  true,  

compositorMaterializesGeometry:  
  false,  

nodeFactoryInvocationOwnedDownstream:  
  true,  

geometryPortInvocationOwnedDownstream:  
  true,  

descriptorOnly:  
  true,  

rendererActivated:  
  false,  

rendererPassClaim:  
  false,  

visualPassClaim:  
  false,  

validationClaim:  
  false

});
}

export function resolvePublicStageComposition() {
const orderedLayers =
resolvePublicStageLayers();

const cameraFrame =
resolvePublicStageCameraFrame();

const zoneComposition =
resolvePublicStageZoneComposition(
orderedLayers
);

const inspectionComposition =
resolvePublicStageInspectionComposition(
orderedLayers
);

const contextComposition =
resolvePublicStageContextComposition(
orderedLayers
);

const overlayAttachment =
resolvePublicStageOverlayAttachment();

const rendererHandoff =
resolvePublicStageRendererHandoff(
orderedLayers
);

const landscapeMap =
getLandscapeMap();

const landscapeAddressCount =
Object.keys(landscapeMap).length;

const rows14Profiles =
typeof LandscapeLatticeModule
.resolveRegionProfilesForRow ===
'function'
? LandscapeLatticeModule
.resolveRegionProfilesForRow(14)
: EMPTY_FROZEN_ARRAY;

const rows15Profiles =
typeof LandscapeLatticeModule
.resolveRegionProfilesForRow ===
'function'
? LandscapeLatticeModule
.resolveRegionProfilesForRow(15)
: EMPTY_FROZEN_ARRAY;

return Object.freeze({
compositionId:
'H_EARTH_3D_PUBLIC_STAGE_COMPOSITION',

contractId:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT  
    .contractId,  

step:  
  'STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE',  

status:  
  'PUBLIC_STAGE_VISUAL_COMPOSITION_DESCRIPTOR_DEFINED',  

matrix:  
  'H-Earth',  

matrixRole:  
  'Ground-View Matrix',  

activeCell:  
  'H_EARTH_GROUND_CELL_001',  

sceneIdentity:  
  'earth-water-air-survival-shoreline-manor',  

dependencyDirection:  
  'SOURCE_SPINE_TO_COMPOSITOR_TO_RENDERER_TO_PUBLIC_STAGE',  

sourceReferences:  
  H_EARTH_3D_PUBLIC_STAGE_SOURCE_REFERENCES,  

cameraFrame,  

viewportModel:  
  H_EARTH_3D_PUBLIC_STAGE_VIEWPORT_MODEL,  

depthBands:  
  H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS,  

orderedLayerIds:  
  H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER,  

orderedLayers,  

layerCount:  
  orderedLayers.length,  

zoneComposition,  

inspectionComposition,  

contextComposition,  

overlayAttachment,  

rendererHandoff,  

landscapeLattice:  
  Object.freeze({  
    aggregate:  
      getLandscapeAggregate(),  

    map:  
      landscapeMap,  

    addressCount:  
      landscapeAddressCount,  

    expectedAddressCount:  
      256,  

    addressCountMatchesExpected:  
      landscapeAddressCount === 256,  

    regionSummary:  
      getLandscapeRegionSummary(),  

    zoneSummary:  
      getLandscapeZoneSummary(),  

    objectHintSummary:  
      getLandscapeObjectHintSummary(),  

    row14Profiles:  
      rows14Profiles,  

    row15Profiles:  
      rows15Profiles,  

    row14ProfileCount:  
      rows14Profiles.length,  

    row15ProfileCount:  
      rows15Profiles.length,  

    rows14And15ReturnBothProfiles:  
      rows14Profiles.length === 2 &&  
      rows15Profiles.length === 2,  

    descriptorOnly:  
      true,  

    runtimeLatticeActivation:  
      false  
  }),  

canonicalSceneProgression:  
  Object.freeze([  
    'sky',  
    'air haze',  
    'horizon',  
    'offshore rock stacks and islets',  
    'elevated Mirror Manor / bluff context',  
    'water surface plane',  
    'nearshore wave band',  
    'shoreline foam line',  
    'dry-sand transition',  
    'foreground wet sand',  
    'tide pools',  
    'small beach stones',  
    'foreground jagged rocks',  
    'inspection anchor',  
    'overlay/readout attachment descriptor'  
  ]),  

currentSourceCompositionAuthority:  
  true,  

rendererIndependent:  
  true,  

rendererImported:  
  false,  

legacyRendererSceneConsumed:  
  false,  

immersiveCompositionDescriptorReady:  
  true,  

rendererConsumptionReady:  
  true,  

publicStageConsumptionReady:  
  true,  

rendererGeometryCreated:  
  false,  

terrainGeometryCreated:  
  false,  

domCreated:  
  false,  

cssCreated:  
  false,  

routeActivated:  
  false,  

runtimeActivated:  
  false,  

rendererActivated:  
  false,  

visualPassClaim:  
  false,  

validationClaim:  
  false,  

productionClaim:  
  false,  

deploymentClaim:  
  false,  

matrixCollapse:  
  false,  

boundary:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS

});
}

export const H_EARTH_3D_PUBLIC_STAGE_COMPOSITION =
resolvePublicStageComposition();

export const H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT =
Object.freeze({
receiptType:
'H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT',

contractId:  
  'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_v1',  

renewsContractId:  
  'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_032F_RENDERER_032D_PARENT_DESCRIPTOR_COMPOSITION_ALIGNMENT_v1',  

file:  
  '/showroom/globe/h-earth/compositor.js',  

step:  
  'STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE',  

status:  
  'PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_CANDIDATE_PENDING_INSTALLATION_AND_BACKUP',  

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

dependencyDirectionCorrected:  
  true,  

currentDependencyDirection:  
  'CAPACITY_ENVIRONMENT_SOURCE_SPINE_TO_COMPOSITOR_TO_RENDERER_TO_PUBLIC_STAGE',  

legacyRendererParentDependencyRetired:  
  true,  

rendererModuleImported:  
  false,  

legacyCandidateRenderSceneConsumed:  
  false,  

capacityReferenced:  
  true,  

environmentReferenced:  
  true,  

step034IMatrixBoundaryReferenced:  
  true,  

step034JObjectAuthorityReferenced:  
  true,  

step034KZoneAuthorityReferenced:  
  true,  

step034LLandscapeLatticeReferenced:  
  true,  

step034LDriveOccurrenceRecorded:  
  true,  

step034LConnectorReadbackVerifiedHere:  
  false,  

step034LDriveDocumentId:  
  '10HUxO6UsqD0CoSLIB4v6bgJpwLehVFH5bLY-n0jsQnU',  

publicStageCompositionContractDefined:  
  true,  

publicStageBoundaryFlagsDefined:  
  true,  

publicStageSourceReferencesDefined:  
  true,  

publicStageLayerIdsDefined:  
  true,  

publicStageLayerOrderDefined:  
  true,  

publicStageDepthBandsDefined:  
  true,  

publicStageCameraModelDefined:  
  true,  

publicStageViewportModelDefined:  
  true,  

publicStageCompositionRulesDefined:  
  true,  

publicStageLayerDefinitionsDefined:  
  true,  

publicStageCompositionResolved:  
  true,  

publicStageZoneCompositionResolved:  
  true,  

publicStageInspectionCompositionResolved:  
  true,  

publicStageContextCompositionResolved:  
  true,  

publicStageOverlayAttachmentResolved:  
  true,  

publicStageRendererHandoffResolved:  
  true,  

canonicalSceneProgressionDefined:  
  true,  

orderedLayerCount:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .layerCount,  

landscapeAddressCount:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .landscapeLattice  
    .addressCount,  

landscapeAddressCountExpected:  
  256,  

landscapeAddressCountMatchesExpected:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .landscapeLattice  
    .addressCountMatchesExpected,  

row14ProfileCount:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .landscapeLattice  
    .row14ProfileCount,  

row15ProfileCount:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .landscapeLattice  
    .row15ProfileCount,  

rows14And15ReturnBothProfiles:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .landscapeLattice  
    .rows14And15ReturnBothProfiles,  

primaryInspectionSurfacePresent:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .inspectionComposition  
    .primaryInspectionSurfacePresent,  

inspectionAnchorPresent:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .inspectionComposition  
    .inspectionAnchorPresent,  

materialKeyAlignment:  
  Object.freeze({  
    manorContext:  
      true,  

    tidePool:  
      true,  

    stone:  
      true  
  }),  

manorElevatedAndSetBack:  
  true,  

manorExteriorOnly:  
  true,  

manorTraversable:  
  false,  

offshoreContextPresent:  
  true,  

distantTraversalAuthorized:  
  false,  

airHazePrimaryZone003:  
  true,  

airHazeSecondaryZone005:  
  true,  

immersiveCompositionDescriptorReady:  
  true,  

rendererConsumptionReady:  
  true,  

publicStageConsumptionReady:  
  true,  

importResolutionVerified:  
  false,  

moduleGraphExecutionVerified:  
  false,  

expectedNextFile:  
  '/showroom/globe/h-earth/renderer.js',  

expectedNextStep:  
  'STEP_034O_PUBLIC_STAGE_RENDERER_CONSUMPTION_RENEWAL',  

sourceConstructionAuthorized:  
  true,  

installationAuthorized:  
  false,  

repositoryMutationAuthorized:  
  false,  

backupComplete:  
  false,  

activeBackedOccurrenceClaim:  
  false,  

archive:  
  Object.freeze({  
    archiveTitle:  
      'h-earth-compositor-step-034n-public-stage-visual-composition-bridge-backup',  

    sourceFile:  
      '/showroom/globe/h-earth/compositor.js',  

    contractId:  
      'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_v1',  

    backupStatus:  
      'PENDING_INSTALLATION_AND_DRIVE_BACKUP',  

    driveDocumentId:  
      null,  

    connectorReadbackVerified:  
      false  
  }),  

claimCeiling:  
  Object.freeze({  
    DOM_CREATION: false,  
    CSS_CREATION: false,  
    RENDERER_GEOMETRY: false,  
    TERRAIN_GEOMETRY: false,  
    GEOMETRY_PORT_INVOCATION: false,  
    NODE_FACTORY_INVOCATION: false,  
    RUNTIME_ACTIVATION: false,  
    RENDERER_ACTIVATION: false,  
    ROUTE_ACTIVATION: false,  
    CANVAS_ACTIVATION: false,  
    WEBGL_ACTIVATION: false,  
    VISUAL_PASS_CLAIM: false,  
    RENDERER_PASS_CLAIM: false,  
    VALIDATION_CLAIM: false,  
    PRODUCTION_CLAIM: false,  
    DEPLOYMENT_CLAIM: false,  
    TRAVERSAL: false,  
    GAMEPLAY: false,  
    COLLISION: false,  
    PHYSICS: false,  
    SURVIVAL_SIMULATION: false,  
    SWIMMING: false,  
    FLUID_SIMULATION: false,  
    MANOR_INTERIOR_ACCESS: false,  
    DISTANT_TRAVERSAL: false,  
    MATRIX_COLLAPSE: false  
  }),  

boundary:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS

});

export function getPublicStageComposition() {
return H_EARTH_3D_PUBLIC_STAGE_COMPOSITION;
}

export function getPublicStageCompositionReceipt() {
return H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT;
}

export function getPublicStageLayer(layerId) {
return (
H_EARTH_3D_PUBLIC_STAGE_COMPOSITION
.orderedLayers
.find((layer) => (
layer.layerId === layerId
)) ||
null
);
}

export function getPublicStageLayersForZone(
zoneId
) {
if (
!zoneId ||
typeof zoneId !== 'string'
) {
return EMPTY_FROZEN_ARRAY;
}

return Object.freeze(
H_EARTH_3D_PUBLIC_STAGE_COMPOSITION
.orderedLayers
.filter((layer) => (
layer.primaryZoneId === zoneId ||
layer.secondaryZoneId === zoneId
))
);
}

export function getPublicStageLayersForObject(
objectId
) {
if (
!objectId ||
typeof objectId !== 'string'
) {
return EMPTY_FROZEN_ARRAY;
}

return Object.freeze(
H_EARTH_3D_PUBLIC_STAGE_COMPOSITION
.orderedLayers
.filter((layer) => (
layer.objectIds.includes(objectId)
))
);
}

export function getPublicStageRendererHandoff() {
return (
H_EARTH_3D_PUBLIC_STAGE_COMPOSITION
.rendererHandoff
);
}

// Compatibility alias for existing controller/index imports.
// This now returns the Step 034N public-stage composition receipt.
export function getCompositorReceipt() {
return getPublicStageCompositionReceipt();
}

// Compatibility alias for existing consumers that still import the former
// composed-candidate-frame name. The value is now the renderer-independent
// Step 034N public-stage composition descriptor.
export const H_EARTH_3D_COMPOSED_CANDIDATE_FRAME =
H_EARTH_3D_PUBLIC_STAGE_COMPOSITION;

// Compatibility alias for existing consumers.
// This receipt now represents Step 034N, not Step 032F.
export const H_EARTH_3D_COMPOSITOR_RECEIPT =
H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT;

export const H_EARTH_3D_COMPOSITOR =
Object.freeze({
id:
'H_EARTH_3D_COMPOSITOR',

file:  
  '/showroom/globe/h-earth/compositor.js',  

step:  
  'STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE',  

contract:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT,  

boundaryFlags:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS,  

sourceReferences:  
  H_EARTH_3D_PUBLIC_STAGE_SOURCE_REFERENCES,  

layerIds:  
  H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS,  

layerOrder:  
  H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER,  

layerDefinitions:  
  H_EARTH_3D_PUBLIC_STAGE_LAYER_DEFINITIONS,  

depthBands:  
  H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS,  

cameraModel:  
  H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL,  

viewportModel:  
  H_EARTH_3D_PUBLIC_STAGE_VIEWPORT_MODEL,  

compositionRules:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RULES,  

publicStageComposition:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,  

rendererHandoff:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION  
    .rendererHandoff,  

isPlainObject:  
  isHEarthPublicStagePlainObject,  

normalizeNumber:  
  normalizeHEarthPublicStageNumber,  

clampNumber:  
  clampHEarthPublicStageNumber,  

clamp01:  
  clampHEarthPublicStage01,  

getLandscapeAggregate,  
getLandscapeMap,  
getLandscapeRegionSummary,  
getLandscapeZoneSummary,  
getLandscapeObjectHintSummary,  
getZoneDescriptors,  
getZoneRenderTargetRoles,  
getEnvironmentObjectCollection,  
getEnvironmentObject,  
getLandscapeRegionProfile,  
getLandscapeRegionAddresses,  
getLandscapeObjectAddresses,  
getLayerDefinition,  
resolvePublicStageCameraFrame,  
resolveLayerSourceBinding,  
resolvePublicStageLayer,  
resolvePublicStageLayers,  
resolvePublicStageZoneComposition,  
resolvePublicStageInspectionComposition,  
resolvePublicStageContextComposition,  
resolvePublicStageOverlayAttachment,  
resolvePublicStageRendererHandoff,  
resolvePublicStageComposition,  
getPublicStageComposition,  
getPublicStageCompositionReceipt,  
getPublicStageLayer,  
getPublicStageLayersForZone,  
getPublicStageLayersForObject,  
getPublicStageRendererHandoff,  
getCompositorReceipt,  

receipt:  
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT

});

export default H_EARTH_3D_COMPOSITOR;
