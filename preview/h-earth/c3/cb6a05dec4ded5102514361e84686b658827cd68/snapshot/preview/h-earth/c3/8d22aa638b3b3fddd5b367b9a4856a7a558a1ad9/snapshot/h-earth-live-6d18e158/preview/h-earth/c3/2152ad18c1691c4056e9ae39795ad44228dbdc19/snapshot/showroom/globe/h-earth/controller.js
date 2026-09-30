// /showroom/globe/h-earth/controller.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_CONTROLLER_FILE_RENEWAL_STEP_034P_BOUNDED_GROUND_VIEW_CAMERA_AND_CONTROLLER_v1
//
// Renews:
// H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027A_RENEWAL_CLEANUP_PACKET_v1
//
// Governing upstream files:
// /showroom/globe/h-earth/capacity.js
// /showroom/globe/h-earth/environment.js
// /showroom/globe/h-earth/compositor.js
// /showroom/globe/h-earth/renderer.js
//
// Governing sequence:
//
// /h-earth-3d/ matrix chamber and source-root authority
//   -> Step 034I-034L public-stage source spine
//   -> compositor.js Step 034N
//   -> renderer.js Step 034O
//   -> controller.js Step 034P
//   -> public route host
//
// Purpose:
// Coordinate the first bounded executable Ground Cell 001 public-stage view.
//
// This controller:
//
// - consumes the Step 034N public-stage composition;
// - consumes and mounts the Step 034O self-contained renderer;
// - maintains bounded camera state;
// - applies camera transforms only to the renderer-owned scene root;
// - supports bounded pan, tilt, zoom, reset, and inspection focus;
// - preserves selectable-target and inspection-routing descriptors;
// - resolves mounted renderer references by compositor object identity;
// - emits controller, camera, mount, focus, and destroy receipts.
//
// This controller does not yet create:
//
// - an actor proxy;
// - a capsule body;
// - walking;
// - ground contact;
// - collision;
// - physics;
// - live Inspect Ground execution;
// - a runtime Ground Condition Read;
// - a deterministic state receipt;
// - open-world traversal;
// - swimming or fluid simulation;
// - manor interior access;
// - distant traversal.
//
// Boundary:
// Bounded Ground-View Matrix camera/controller execution only.
// No WebGL. No canvas. No SVG.
// No final visual-pass claim.
// No validation claim.
// No production claim.
// No deployment claim.
// No matrix collapse.

import {
  H_EARTH_3D_CAPACITY,
  H_EARTH_3D_OBJECT_CAPACITY_REFERENCES,
  H_EARTH_3D_INSPECTION_RADIUS_MODEL,
  H_EARTH_3D_INSPECTION_ANCHORS,
  H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
  H_EARTH_3D_DOWNSTREAM_CONSUMPTION,
  getObjectCapacityReference,
  getInspectionRadius,
  getInspectionAnchor,
  getCapacityReceipt
} from './capacity.js';

import {
  H_EARTH_3D_ENVIRONMENT,
  H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,
  H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES,
  H_EARTH_3D_ENVIRONMENT_RECEIPT,
  getResolvedEnvironmentObject,
  getEnvironmentReceipt
} from './environment.js';

import {
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT,
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS,
  H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS,
  H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER,
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT,
  getPublicStageComposition,
  getPublicStageCompositionReceipt,
  getPublicStageLayer,
  getPublicStageLayersForObject,
  getPublicStageRendererHandoff,
  getCompositorReceipt
} from './compositor.js';

import {
  H_EARTH_3D_RENDERER,
  H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT,
  H_EARTH_3D_CANDIDATE_RENDER_SCENE,
  H_EARTH_3D_RENDERER_RECEIPT,
  H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
  mountHEarthRenderer,
  destroyHEarthRenderer,
  getHEarthMountedRenderRoot,
  getHEarthMountedLayerNode,
  getHEarthMountedObjectNodes,
  getHEarthRendererDiagnosticSnapshot,
  getRendererReceipt
} from './renderer.js';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);
const EMPTY_FROZEN_OBJECT = Object.freeze({});

const CONTROLLER_OBJECT_IDS = Object.freeze([
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

const CAMERA_STATE_KEYS = Object.freeze([
  'panX',
  'panY',
  'tiltX',
  'yawY',
  'rollZ',
  'zoom'
]);

export const H_EARTH_3D_CONTROLLER_CONTRACT =
  Object.freeze({
    contractId:
      'H_EARTH_3D_CONTROLLER_FILE_RENEWAL_STEP_034P_BOUNDED_GROUND_VIEW_CAMERA_AND_CONTROLLER_v1',

    currentStep:
      'STEP_034P_BOUNDED_GROUND_VIEW_CAMERA_AND_CONTROLLER_RENEWAL',

    renewedFrom:
      'H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027A_RENEWAL_CLEANUP_PACKET_v1',

    file:
      '/showroom/globe/h-earth/controller.js',

    route:
      '/showroom/globe/h-earth/',

    sourceRoot:
      '/h-earth-3d/',

    fileClass:
      'BOUNDED_GROUND_VIEW_CAMERA_AND_RENDERER_EXECUTION_COORDINATOR',

    status:
      'BOUNDED_CAMERA_CONTROLLER_SOURCE_DEFINED_PENDING_INSTALLATION_AND_RUNTIME_PROOF',

    targetMatrix:
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

    upstreamCapacityFile:
      '/showroom/globe/h-earth/capacity.js',

    upstreamEnvironmentFile:
      '/showroom/globe/h-earth/environment.js',

    upstreamCompositorFile:
      '/showroom/globe/h-earth/compositor.js',

    upstreamRendererFile:
      '/showroom/globe/h-earth/renderer.js',

    upstreamCompositorContractId:
      'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_v1',

    upstreamRendererContractId:
      'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_PUBLIC_STAGE_COMPOSITION_CONSUMPTION_v1',

    consumes:
      Object.freeze([
        '/showroom/globe/h-earth/capacity.js',
        '/showroom/globe/h-earth/environment.js',
        '/showroom/globe/h-earth/compositor.js',
        '/showroom/globe/h-earth/renderer.js'
      ]),

    mayBeConsumedBy:
      Object.freeze([
        '/showroom/globe/h-earth/index.js',
        '/showroom/globe/h-earth/index.html',
        '/showroom/globe/h-earth/diagnostic/'
      ]),

    dependencyDirection:
      'SOURCE_ROOT_TO_PUBLIC_STAGE_SPINE_TO_COMPOSITOR_TO_RENDERER_TO_CONTROLLER_TO_ROUTE',

    implementationScope:
      Object.freeze({
        mountsRendererIntoSuppliedMountNode:
          true,

        destroysRendererOwnedScene:
          true,

        maintainsCameraState:
          true,

        clampsCameraState:
          true,

        appliesCameraTransform:
          true,

        supportsPan:
          true,

        supportsTilt:
          true,

        supportsYaw:
          true,

        supportsZoom:
          true,

        supportsReset:
          true,

        supportsInspectionFocus:
          true,

        resolvesMountedObjectNodes:
          true,

        preservesSelectableTargetRegistry:
          true,

        emitsCameraReceipt:
          true,

        emitsMountReceipt:
          true,

        emitsFocusReceipt:
          true,

        emitsDestroyReceipt:
          true,

        createsActorProxy:
          false,

        createsCapsule:
          false,

        createsGroundContact:
          false,

        createsCollision:
          false,

        createsWalking:
          false,

        executesInspectGround:
          false,

        producesGroundConditionRead:
          false,

        createsDeterministicStateReceipt:
          false
      }),

    architectureRule:
      'NO_NEW_FOUNDATION_LAYER_WITHOUT_IMPLEMENTATION_BLOCKER',

    expectedNextStep:
      'STEP_034Q_MINIMAL_ACTOR_PROXY_AND_CAPSULE_STATE',

    sourceConstructionAuthorized:
      true,

    installationAuthorized:
      false,

    repositoryMutationAuthorized:
      false,

    runtimeProofComplete:
      false,

    backupComplete:
      false,

    activeBackedOccurrenceClaim:
      false
  });

export const H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS =
  Object.freeze({
    boundedControllerExecution:
      true,

    suppliedMountNodeRequired:
      true,

    rendererMountCoordination:
      true,

    rendererDestroyCoordination:
      true,

    rendererOwnedRootTransformOnly:
      true,

    globalDocumentQuery:
      false,

    routeInstallation:
      false,

    repositoryMutation:
      false,

    canvasActivation:
      false,

    webglActivation:
      false,

    svgActivation:
      false,

    actorProxy:
      false,

    capsuleBody:
      false,

    groundContact:
      false,

    collision:
      false,

    physics:
      false,

    walking:
      false,

    freeFlight:
      false,

    openWorldTraversal:
      false,

    swimming:
      false,

    fluidSimulation:
      false,

    weatherSimulation:
      false,

    survivalSimulation:
      false,

    manorInteriorAccess:
      false,

    distantTraversal:
      false,

    liveInspectGround:
      false,

    runtimeGroundConditionRead:
      false,

    runtimeInspectionReceipt:
      false,

    deterministicStateReceipt:
      false,

    finalRendererClaim:
      false,

    rendererPassClaim:
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

    claimBoundaryPreserved:
      true
  });

export const H_EARTH_3D_CONTROLLER_INPUTS =
  Object.freeze({
    capacity:
      Object.freeze({
        aggregate:
          H_EARTH_3D_CAPACITY,

        objectCapacityReferences:
          H_EARTH_3D_OBJECT_CAPACITY_REFERENCES,

        inspectionRadiusModel:
          H_EARTH_3D_INSPECTION_RADIUS_MODEL,

        inspectionAnchors:
          H_EARTH_3D_INSPECTION_ANCHORS,

        forbiddenCapabilityFlags:
          H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,

        downstreamConsumption:
          H_EARTH_3D_DOWNSTREAM_CONSUMPTION,

        receipt:
          getCapacityReceipt()
      }),

    environment:
      Object.freeze({
        aggregate:
          H_EARTH_3D_ENVIRONMENT,

        resolvedObjects:
          H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,

        resolvedZones:
          H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES,

        receipt:
          H_EARTH_3D_ENVIRONMENT_RECEIPT
      }),

    compositor:
      Object.freeze({
        aggregate:
          H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,

        contract:
          H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT,

        composition:
          H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,

        rendererHandoff:
          getPublicStageRendererHandoff(),

        boundaryFlags:
          H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS,

        receipt:
          H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT
      }),

    renderer:
      Object.freeze({
        aggregate:
          H_EARTH_3D_RENDERER,

        renderInput:
          H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT,

        compatibilityCandidateScene:
          H_EARTH_3D_CANDIDATE_RENDER_SCENE,

        boundaryFlags:
          H_EARTH_3D_RENDER_BOUNDARY_FLAGS,

        receipt:
          H_EARTH_3D_RENDERER_RECEIPT
      }),

    boundary:
      H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
  });

export const H_EARTH_3D_CAMERA_CONSTRAINT_MODEL =
  Object.freeze({
    modelId:
      'H_EARTH_3D_CAMERA_CONSTRAINT_MODEL_STEP_034P',

    cameraClass:
      'BOUNDED_GROUND_VIEW_SCENE_ROOT_TRANSFORM_CAMERA',

    source:
      'CAPACITY_PLUS_STEP_034N_CAMERA_FRAME',

    stateKeys:
      CAMERA_STATE_KEYS,

    defaultState:
      Object.freeze({
        panX:
          0,

        panY:
          0,

        tiltX:
          0,

        yawY:
          0,

        rollZ:
          0,

        zoom:
          1
      }),

    limits:
      Object.freeze({
        panX:
          Object.freeze({
            min:
              -220,

            max:
              220
          }),

        panY:
          Object.freeze({
            min:
              -120,

            max:
              120
          }),

        tiltX:
          Object.freeze({
            min:
              -12,

            max:
              14
          }),

        yawY:
          Object.freeze({
            min:
              -18,

            max:
              18
          }),

        rollZ:
          Object.freeze({
            min:
              -3,

            max:
              3
          }),

        zoom:
          Object.freeze({
            min:
              0.82,

            max:
              1.32
          })
      }),

    increments:
      Object.freeze({
        panPx:
          24,

        tiltDegrees:
          2,

        yawDegrees:
          2,

        zoom:
          0.05
      }),

    focusPresets:
      Object.freeze({
        ground:
          Object.freeze({
            focusId:
              'GROUND_INSPECTION_FOCUS',

            objectId:
              'OBJ_002_FOREGROUND_WET_SAND',

            state:
              Object.freeze({
                panX:
                  0,

                panY:
                  -34,

                tiltX:
                  4,

                yawY:
                  0,

                rollZ:
                  0,

                zoom:
                  1.12
              })
          }),

        inspectionAnchor:
          Object.freeze({
            focusId:
              'INSPECTION_ANCHOR_FOCUS',

            objectId:
              'OBJ_001_GROUND_SPAWN_ANCHOR',

            state:
              Object.freeze({
                panX:
                  0,

                panY:
                  -48,

                tiltX:
                  6,

                yawY:
                  0,

                rollZ:
                  0,

                zoom:
                  1.18
              })
          }),

        shoreline:
          Object.freeze({
            focusId:
              'SHORELINE_FOCUS',

            objectId:
              'OBJ_005_SHORELINE_FOAM_LINE',

            state:
              Object.freeze({
                panX:
                  0,

                panY:
                  18,

                tiltX:
                  -2,

                yawY:
                  0,

                rollZ:
                  0,

                zoom:
                  1.06
              })
          }),

        manorContext:
          Object.freeze({
            focusId:
              'MANOR_CONTEXT_FOCUS',

            objectId:
              'OBJ_009_MANOR_EXTERIOR_CONTEXT',

            state:
              Object.freeze({
                panX:
                  -86,

                panY:
                  52,

                tiltX:
                  -5,

                yawY:
                  -7,

                rollZ:
                  0,

                zoom:
                  1.08
              })
          }),

        offshoreContext:
          Object.freeze({
            focusId:
              'OFFSHORE_CONTEXT_FOCUS',

            objectId:
              'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',

            state:
              Object.freeze({
                panX:
                  92,

                panY:
                  48,

                tiltX:
                  -5,

                yawY:
                  7,

                rollZ:
                  0,

                zoom:
                  1.04
              })
          })
      }),

    transformationTarget:
      'RENDERER_OWNED_ROOT_NODE',

    usesSceneRootTransform:
      true,

    usesRealCameraObject:
      false,

    createsTraversal:
      false,

    createsActorMovement:
      false,

    finalCameraValidationClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });

export const H_EARTH_3D_CAMERA_STATE =
  Object.freeze({
    stateId:
      'H_EARTH_3D_CAMERA_STATE_INITIAL',

    revision:
      0,

    ...H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
      .defaultState,

    focusObjectId:
      null,

    focusId:
      'DEFAULT_GROUND_VIEW',

    mounted:
      false,

    applied:
      false,

    deterministicInput:
      true,

    claimBoundaryPreserved:
      true
  });

let activeCameraState =
  H_EARTH_3D_CAMERA_STATE;

let activeMountNode =
  null;

let activeRenderRoot =
  null;

let activeRendererMountReceipt =
  null;

let activeControllerReceipt =
  null;

export const H_EARTH_3D_INSPECTION_TARGET_MODEL =
  Object.freeze({
    id:
      'H_EARTH_3D_INSPECTION_TARGET_MODEL_STEP_034P',

    primaryInspectionTarget:
      'OBJ_002_FOREGROUND_WET_SAND',

    supportingInspectionTargets:
      Object.freeze([
        'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
        'OBJ_010_SMALL_BEACH_STONES',
        'OBJ_011_FOREGROUND_JAGGED_ROCKS',
        'OBJ_005_SHORELINE_FOAM_LINE'
      ]),

    secondarySurfaceContextTargets:
      Object.freeze([
        'OBJ_003_DRY_SAND_TRANSITION'
      ]),

    waterAtmosphericContextTargets:
      Object.freeze([
        'OBJ_006_NEARSHORE_WAVE_BAND',
        'OBJ_007_WATER_SURFACE_PLANE',
        'OBJ_008_AIR_HAZE_LIGHT_LAYER'
      ]),

    manorContextTargets:
      Object.freeze([
        'OBJ_009_MANOR_EXTERIOR_CONTEXT'
      ]),

    offshoreContextTargets:
      Object.freeze([
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
      ]),

    contextOnlyTargets:
      Object.freeze([
        'OBJ_006_NEARSHORE_WAVE_BAND',
        'OBJ_007_WATER_SURFACE_PLANE',
        'OBJ_008_AIR_HAZE_LIGHT_LAYER',
        'OBJ_009_MANOR_EXTERIOR_CONTEXT',
        'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
      ]),

    firstAction:
      'Inspect Ground',

    firstReadout:
      'Ground Condition Read',

    firstReceipt:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    boundary:
      Object.freeze({
        selectionMayFocusCamera:
          true,

        selectionExecutesInspection:
          false,

        inspectionCreatesLiveReadout:
          false,

        inspectionCreatesRuntimeReceipt:
          false,

        contextOnlyTargetsDoNotBecomeInspectionTargets:
          true,

        secondarySurfaceContextDoesNotBecomeTraversal:
          true,

        matrixCollapse:
          false
      })
  });

export const H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES =
  Object.freeze({
    ENTER_MANOR_INTERIOR:
      Object.freeze({
        behaviorId:
          'ENTER_MANOR_INTERIOR',

        responseType:
          'BLOCKED_BY_MANOR_CONTEXT_BOUNDARY',

        message:
          'The elevated manor remains exterior context only. Interior access is not authorized.',

        relatedObjectId:
          'OBJ_009_MANOR_EXTERIOR_CONTEXT',

        allowedAlternative:
          'Focus Manor Context',

        manorInteriorAccessClaim:
          false,

        traversalClaim:
          false,

        matrixCollapse:
          false
      }),

    TRAVERSE_DISTANT_WORLD:
      Object.freeze({
        behaviorId:
          'TRAVERSE_DISTANT_WORLD',

        responseType:
          'BLOCKED_BY_DISTANT_CONTEXT_BOUNDARY',

        message:
          'Offshore rock stacks and islets remain distant public-stage context. Distant traversal is not authorized.',

        relatedObjectId:
          'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',

        allowedAlternative:
          'Focus Offshore Context',

        distantTraversalClaim:
          false,

        openWorldTraversalClaim:
          false,

        matrixCollapse:
          false
      }),

    SWIM:
      Object.freeze({
        behaviorId:
          'SWIM',

        responseType:
          'BLOCKED_BY_WATER_CONTEXT_BOUNDARY',

        message:
          'The rendered water surface does not authorize swimming.',

        relatedObjectId:
          'OBJ_007_WATER_SURFACE_PLANE',

        allowedAlternative:
          'Focus Shoreline',

        swimmingClaim:
          false,

        fluidSimulationClaim:
          false,

        matrixCollapse:
          false
      }),

    ACTIVATE_FLUID_SIMULATION:
      Object.freeze({
        behaviorId:
          'ACTIVATE_FLUID_SIMULATION',

        responseType:
          'BLOCKED_BY_NON_SIMULATION_BOUNDARY',

        message:
          'Water, wave, foam, and tide-pool surfaces do not activate fluid simulation.',

        fluidSimulationClaim:
          false,

        swimmingClaim:
          false,

        matrixCollapse:
          false
      }),

    START_OPEN_WORLD_MOVEMENT:
      Object.freeze({
        behaviorId:
          'START_OPEN_WORLD_MOVEMENT',

        responseType:
          'BLOCKED_BY_GROUND_VIEW_MATRIX_BOUNDARY',

        message:
          'Step 034P provides bounded camera control only. Open-world movement is not authorized.',

        allowedAlternative:
          'Use bounded pan, tilt, zoom, reset, or focus controls.',

        openWorldTraversalClaim:
          false,

        routeNavigationClaim:
          false,

        matrixCollapse:
          false
      }),

    START_ACTOR_MOVEMENT:
      Object.freeze({
        behaviorId:
          'START_ACTOR_MOVEMENT',

        responseType:
          'BLOCKED_PENDING_STEP_034Q',

        message:
          'Actor proxy and capsule state have not yet been created.',

        expectedStep:
          'STEP_034Q_MINIMAL_ACTOR_PROXY_AND_CAPSULE_STATE',

        actorProxyClaim:
          false,

        walkingClaim:
          false,

        collisionClaim:
          false,

        matrixCollapse:
          false
      }),

    EXECUTE_INSPECT_GROUND:
      Object.freeze({
        behaviorId:
          'EXECUTE_INSPECT_GROUND',

        responseType:
          'BLOCKED_PENDING_STEP_034S',

        message:
          'Step 034P may focus the ground inspection target but does not yet execute live Inspect Ground.',

        expectedStep:
          'STEP_034S_LIVE_INSPECT_GROUND_SCENE_STATE_READ',

        liveInspectionClaim:
          false,

        runtimeReadoutClaim:
          false,

        runtimeReceiptClaim:
          false,

        matrixCollapse:
          false
      }),

    CLAIM_VISUAL_PASS:
      Object.freeze({
        behaviorId:
          'CLAIM_VISUAL_PASS',

        responseType:
          'BLOCKED_BY_NO_VISUAL_PASS_BOUNDARY',

        message:
          'No visual pass is claimed by the controller source.',

        visualPassClaim:
          false,

        validationClaim:
          false,

        productionClaim:
          false,

        matrixCollapse:
          false
      }),

    CLAIM_VALIDATION:
      Object.freeze({
        behaviorId:
          'CLAIM_VALIDATION',

        responseType:
          'BLOCKED_BY_NO_VALIDATION_BOUNDARY',

        message:
          'No validation is claimed by the controller source.',

        validationClaim:
          false,

        productionClaim:
          false,

        matrixCollapse:
          false
      }),

    COLLAPSE_MATRICES:
      Object.freeze({
        behaviorId:
          'COLLAPSE_MATRICES',

        responseType:
          'BLOCKED_BY_MATRIX_SEPARATION_BOUNDARY',

        message:
          'H-Earth remains the Ground-View Matrix. Matrix separation is preserved.',

        hEarthRole:
          'Ground-View Matrix',

        matrixCollapse:
          false
      })
  });

export function normalizeHEarthControllerNumber(
  value,
  fallback = 0
) {
  const numberValue =
    Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : fallback;
}

export function clampHEarthControllerNumber(
  value,
  min,
  max,
  fallback = min
) {
  const numberValue =
    normalizeHEarthControllerNumber(
      value,
      fallback
    );

  return Math.max(
    min,
    Math.min(
      max,
      numberValue
    )
  );
}

export function normalizeHEarthControllerToken(
  value,
  fallback = 'unresolved'
) {
  return (
    String(value || fallback)
      .trim()
      .replace(
        /([a-z0-9])([A-Z])/g,
        '$1-$2'
      )
      .replace(
        /[_\s]+/g,
        '-'
      )
      .replace(
        /[^a-zA-Z0-9-]/g,
        '-'
      )
      .replace(
        /-+/g,
        '-'
      )
      .replace(
        /^-|-$/g,
        ''
      )
      .toLowerCase() ||
    fallback
  );
}

export function uniqueHEarthControllerCodes(
  values = []
) {
  const seen =
    new Set();

  return Object.freeze(
    (Array.isArray(values)
      ? values
      : [values]
    )
      .flat()
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== ''
      )
      .map(
        (value) =>
          typeof value === 'string'
            ? value
            : value?.code
              ? String(value.code)
              : JSON.stringify(value)
      )
      .filter((value) => {
        if (seen.has(value)) {
          return false;
        }

        seen.add(value);

        return true;
      })
  );
}

export function getSafeObjectReference(
  objectId
) {
  if (
    !objectId ||
    typeof objectId !== 'string'
  ) {
    return null;
  }

  try {
    return (
      getObjectCapacityReference(
        objectId
      ) ||
      null
    );
  } catch {
    return null;
  }
}

export function getSafeEnvironmentObject(
  objectId
) {
  if (
    !objectId ||
    typeof objectId !== 'string'
  ) {
    return null;
  }

  try {
    return (
      getResolvedEnvironmentObject(
        objectId
      ) ||
      null
    );
  } catch {
    return null;
  }
}

export function getSafeInspectionAnchor(
  objectId
) {
  if (
    !objectId ||
    typeof objectId !== 'string'
  ) {
    return null;
  }

  try {
    return (
      getInspectionAnchor(
        objectId
      ) ||
      null
    );
  } catch {
    return null;
  }
}

export function getSafeInspectionRadius(
  objectId
) {
  if (
    !objectId ||
    typeof objectId !== 'string'
  ) {
    return null;
  }

  try {
    const radius =
      getInspectionRadius(
        objectId
      );

    return Number.isFinite(
      Number(radius)
    )
      ? Number(radius)
      : null;
  } catch {
    return null;
  }
}

export function classifyControllerTarget(
  objectId
) {
  if (
    H_EARTH_3D_INSPECTION_TARGET_MODEL
      .primaryInspectionTarget ===
    objectId
  ) {
    return 'PRIMARY_INSPECTION_TARGET';
  }

  if (
    H_EARTH_3D_INSPECTION_TARGET_MODEL
      .supportingInspectionTargets
      .includes(objectId)
  ) {
    return 'SUPPORTING_INSPECTION_TARGET';
  }

  if (
    H_EARTH_3D_INSPECTION_TARGET_MODEL
      .secondarySurfaceContextTargets
      .includes(objectId)
  ) {
    return 'SECONDARY_SURFACE_CONTEXT';
  }

  if (
    H_EARTH_3D_INSPECTION_TARGET_MODEL
      .waterAtmosphericContextTargets
      .includes(objectId)
  ) {
    return 'WATER_ATMOSPHERIC_CONTEXT';
  }

  if (
    H_EARTH_3D_INSPECTION_TARGET_MODEL
      .manorContextTargets
      .includes(objectId)
  ) {
    return 'MANOR_CONTEXT_ONLY';
  }

  if (
    H_EARTH_3D_INSPECTION_TARGET_MODEL
      .offshoreContextTargets
      .includes(objectId)
  ) {
    return 'OFFSHORE_CONTEXT_ONLY';
  }

  if (
    H_EARTH_3D_INSPECTION_TARGET_MODEL
      .contextOnlyTargets
      .includes(objectId)
  ) {
    return 'CONTEXT_ONLY_TARGET';
  }

  if (
    objectId ===
    'OBJ_001_GROUND_SPAWN_ANCHOR'
  ) {
    return 'INSPECTION_ACTION_ANCHOR';
  }

  return 'UNCLASSIFIED_TARGET';
}

export function canSelectHEarthObject(
  objectId
) {
  const objectReference =
    getSafeObjectReference(
      objectId
    );

  const environmentObject =
    getSafeEnvironmentObject(
      objectId
    );

  if (
    !objectReference &&
    !environmentObject
  ) {
    return false;
  }

  const capability =
    objectReference?.capability ||
    environmentObject?.capability ||
    EMPTY_FROZEN_OBJECT;

  if (
    capability.selectable ===
    false
  ) {
    return false;
  }

  return (
    capability.selectable ===
      true ||
    capability.inspectable ===
      true ||
    CONTROLLER_OBJECT_IDS.includes(
      objectId
    )
  );
}

export function canInspectHEarthObject(
  objectId
) {
  const classification =
    classifyControllerTarget(
      objectId
    );

  if (
    classification !==
      'PRIMARY_INSPECTION_TARGET' &&
    classification !==
      'SUPPORTING_INSPECTION_TARGET'
  ) {
    return false;
  }

  const objectReference =
    getSafeObjectReference(
      objectId
    );

  const environmentObject =
    getSafeEnvironmentObject(
      objectId
    );

  const inspectionAnchor =
    getSafeInspectionAnchor(
      objectId
    );

  const inspectionRadius =
    getSafeInspectionRadius(
      objectId
    );

  if (
    !objectReference &&
    !environmentObject
  ) {
    return false;
  }

  const inspectable =
    objectReference?.capability
      ?.inspectable === true ||
    environmentObject?.capability
      ?.inspectable === true;

  return (
    inspectable &&
    Boolean(inspectionAnchor) &&
    Number.isFinite(
      inspectionRadius
    ) &&
    inspectionRadius > 0
  );
}

export function getCompositorLayersForObject(
  objectId
) {
  if (
    !objectId ||
    typeof objectId !== 'string'
  ) {
    return EMPTY_FROZEN_ARRAY;
  }

  try {
    const layers =
      getPublicStageLayersForObject(
        objectId
      );

    return Object.freeze(
      Array.isArray(layers)
        ? [...layers]
        : []
    );
  } catch {
    return EMPTY_FROZEN_ARRAY;
  }
}

export function getCompositorPrimaryLayerForObject(
  objectId
) {
  return (
    getCompositorLayersForObject(
      objectId
    )[0] ||
    null
  );
}

export function getMountedRendererNodesForObject(
  objectId,
  mountNode = activeMountNode
) {
  if (
    !mountNode ||
    !objectId
  ) {
    return EMPTY_FROZEN_ARRAY;
  }

  try {
    const nodes =
      getHEarthMountedObjectNodes(
        mountNode,
        objectId
      );

    return Object.freeze(
      Array.isArray(nodes)
        ? [...nodes]
        : []
    );
  } catch {
    return EMPTY_FROZEN_ARRAY;
  }
}

export function getMountedRendererLayerForObject(
  objectId,
  mountNode = activeMountNode
) {
  const layer =
    getCompositorPrimaryLayerForObject(
      objectId
    );

  if (
    !layer?.layerId ||
    !mountNode
  ) {
    return null;
  }

  try {
    return (
      getHEarthMountedLayerNode(
        mountNode,
        layer.layerId
      ) ||
      null
    );
  } catch {
    return null;
  }
}

export function getPublicStageSelectionReference(
  objectId,
  mountNode = activeMountNode
) {
  const compositorLayers =
    getCompositorLayersForObject(
      objectId
    );

  const mountedNodes =
    getMountedRendererNodesForObject(
      objectId,
      mountNode
    );

  const environmentObject =
    getSafeEnvironmentObject(
      objectId
    );

  return Object.freeze({
    objectId,

    layerIds:
      Object.freeze(
        compositorLayers.map(
          (layer) => layer.layerId
        )
      ),

    layerRoles:
      Object.freeze(
        compositorLayers.map(
          (layer) => layer.role
        )
      ),

    mountedNodeCount:
      mountedNodes.length,

    mountedNodeIds:
      Object.freeze(
        mountedNodes.map(
          (node) =>
            node.getAttribute?.(
              'data-h-earth-render-node'
            ) ||
            null
        )
        .filter(Boolean)
      ),

    hasCompositorReference:
      compositorLayers.length >
      0,

    hasMountedRendererReference:
      mountedNodes.length >
      0,

    zoneId:
      environmentObject?.zoneId ||
      compositorLayers[0]
        ?.primaryZoneId ||
      null,

    classification:
      classifyControllerTarget(
        objectId
      ),

    rendererMounted:
      Boolean(
        getHEarthMountedRenderRoot(
          mountNode
        )
      ),

    descriptorOnly:
      true,

    liveSceneStateRead:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function getCameraConstraint(
  stateKey
) {
  return (
    H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
      .limits[stateKey] ||
    null
  );
}

export function clampCameraStateValue(
  stateKey,
  value
) {
  const constraint =
    getCameraConstraint(
      stateKey
    );

  if (!constraint) {
    return normalizeHEarthControllerNumber(
      value,
      0
    );
  }

  return clampHEarthControllerNumber(
    value,
    constraint.min,
    constraint.max,
    H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
      .defaultState[stateKey] ??
      constraint.min
  );
}

export function normalizeHEarthCameraState(
  state =
    EMPTY_FROZEN_OBJECT,
  fallbackState =
    H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
      .defaultState
) {
  return Object.freeze({
    panX:
      clampCameraStateValue(
        'panX',
        state.panX ??
        fallbackState.panX
      ),

    panY:
      clampCameraStateValue(
        'panY',
        state.panY ??
        fallbackState.panY
      ),

    tiltX:
      clampCameraStateValue(
        'tiltX',
        state.tiltX ??
        fallbackState.tiltX
      ),

    yawY:
      clampCameraStateValue(
        'yawY',
        state.yawY ??
        fallbackState.yawY
      ),

    rollZ:
      clampCameraStateValue(
        'rollZ',
        state.rollZ ??
        fallbackState.rollZ
      ),

    zoom:
      clampCameraStateValue(
        'zoom',
        state.zoom ??
        fallbackState.zoom
      ),

    focusObjectId:
      state.focusObjectId ??
      fallbackState.focusObjectId ??
      null,

    focusId:
      state.focusId ??
      fallbackState.focusId ??
      'DEFAULT_GROUND_VIEW',

    mounted:
      state.mounted === true,

    applied:
      state.applied === true,

    revision:
      normalizeHEarthControllerNumber(
        state.revision,
        normalizeHEarthControllerNumber(
          fallbackState.revision,
          0
        )
      ),

    deterministicInput:
      true,

    claimBoundaryPreserved:
      true
  });
}

export function buildHEarthCameraCssTransform(
  state = activeCameraState
) {
  const normalized =
    normalizeHEarthCameraState(
      state
    );

  return [
    `translate3d(${normalized.panX}px, ${normalized.panY}px, 0px)`,
    `rotateX(${normalized.tiltX}deg)`,
    `rotateY(${normalized.yawY}deg)`,
    `rotateZ(${normalized.rollZ}deg)`,
    `scale3d(${normalized.zoom}, ${normalized.zoom}, ${normalized.zoom})`
  ].join(' ');
}

export function resolveHEarthCameraStateReceipt({
  requestedState =
    EMPTY_FROZEN_OBJECT,

  priorState =
    activeCameraState,

  resolvedState =
    activeCameraState,

  applied =
    false,

  renderRootPresent =
    false,

  reason =
    'CAMERA_STATE_RESOLVED',

  warningCodes =
    EMPTY_FROZEN_ARRAY,

  failureCodes =
    EMPTY_FROZEN_ARRAY
} = {}) {
  return Object.freeze({
    receiptType:
      'H_EARTH_3D_CAMERA_STATE_RECEIPT',

    contractId:
      H_EARTH_3D_CONTROLLER_CONTRACT
        .contractId,

    reason,

    requestedState:
      Object.freeze({
        ...requestedState
      }),

    priorState,

    resolvedState,

    cssTransform:
      buildHEarthCameraCssTransform(
        resolvedState
      ),

    applied,

    renderRootPresent,

    clamped:
      CAMERA_STATE_KEYS.some(
        (key) =>
          requestedState[key] !==
            undefined &&
          normalizeHEarthControllerNumber(
            requestedState[key]
          ) !==
          resolvedState[key]
      ),

    cameraConstraintModelId:
      H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
        .modelId,

    warningCodes:
      uniqueHEarthControllerCodes(
        warningCodes
      ),

    failureCodes:
      uniqueHEarthControllerCodes(
        failureCodes
      ),

    actorMovement:
      false,

    traversal:
      false,

    collision:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function applyHEarthCameraState({
  state =
    activeCameraState,

  mountNode =
    activeMountNode,

  renderRoot =
    null,

  reason =
    'APPLY_CAMERA_STATE'
} = {}) {
  const resolvedRoot =
    renderRoot ||
    (
      mountNode
        ? getHEarthMountedRenderRoot(
            mountNode
          )
        : null
    ) ||
    activeRenderRoot;

  const priorState =
    activeCameraState;

  const normalizedState =
    normalizeHEarthCameraState(
      {
        ...state,

        revision:
          normalizeHEarthControllerNumber(
            priorState?.revision,
            0
          ) + 1,

        mounted:
          Boolean(resolvedRoot),

        applied:
          Boolean(resolvedRoot)
      },
      priorState
    );

  if (!resolvedRoot) {
    activeCameraState =
      normalizedState;

    return resolveHEarthCameraStateReceipt({
      requestedState:
        state,

      priorState,

      resolvedState:
        normalizedState,

      applied:
        false,

      renderRootPresent:
        false,

      reason,

      warningCodes:
        Object.freeze([
          'RENDER_ROOT_NOT_AVAILABLE_FOR_CAMERA_APPLICATION'
        ])
    });
  }

  const cssTransform =
    buildHEarthCameraCssTransform(
      normalizedState
    );

  resolvedRoot.style.transform =
    cssTransform;

  resolvedRoot.style.transformOrigin =
    '50% 58%';

  resolvedRoot.style.transition =
    'transform 180ms ease-out';

  resolvedRoot.style.willChange =
    'transform';

  resolvedRoot.setAttribute(
    'data-h-earth-camera-state-applied',
    'true'
  );

  resolvedRoot.setAttribute(
    'data-h-earth-camera-pan-x',
    String(
      normalizedState.panX
    )
  );

  resolvedRoot.setAttribute(
    'data-h-earth-camera-pan-y',
    String(
      normalizedState.panY
    )
  );

  resolvedRoot.setAttribute(
    'data-h-earth-camera-tilt-x',
    String(
      normalizedState.tiltX
    )
  );

  resolvedRoot.setAttribute(
    'data-h-earth-camera-yaw-y',
    String(
      normalizedState.yawY
    )
  );

  resolvedRoot.setAttribute(
    'data-h-earth-camera-roll-z',
    String(
      normalizedState.rollZ
    )
  );

  resolvedRoot.setAttribute(
    'data-h-earth-camera-zoom',
    String(
      normalizedState.zoom
    )
  );

  resolvedRoot.setAttribute(
    'data-h-earth-camera-focus-object-id',
    String(
      normalizedState.focusObjectId ||
      ''
    )
  );

  resolvedRoot.setAttribute(
    'data-h-earth-camera-focus-id',
    String(
      normalizedState.focusId ||
      ''
    )
  );

  activeCameraState =
    normalizedState;

  activeRenderRoot =
    resolvedRoot;

  if (mountNode) {
    activeMountNode =
      mountNode;
  }

  return resolveHEarthCameraStateReceipt({
    requestedState:
      state,

    priorState,

    resolvedState:
      normalizedState,

    applied:
      true,

    renderRootPresent:
      true,

    reason
  });
}

export function setHEarthCameraState(
  partialState =
    EMPTY_FROZEN_OBJECT,
  options =
    EMPTY_FROZEN_OBJECT
) {
  const requestedState =
    {
      ...activeCameraState,
      ...partialState
    };

  return applyHEarthCameraState({
    state:
      requestedState,

    mountNode:
      options.mountNode ||
      activeMountNode,

    renderRoot:
      options.renderRoot ||
      activeRenderRoot,

    reason:
      options.reason ||
      'SET_CAMERA_STATE'
  });
}

export function panHEarthCamera(
  deltaX = 0,
  deltaY = 0,
  options =
    EMPTY_FROZEN_OBJECT
) {
  return setHEarthCameraState(
    {
      panX:
        activeCameraState.panX +
        normalizeHEarthControllerNumber(
          deltaX,
          0
        ),

      panY:
        activeCameraState.panY +
        normalizeHEarthControllerNumber(
          deltaY,
          0
        ),

      focusObjectId:
        null,

      focusId:
        'MANUAL_CAMERA_PAN'
    },
    {
      ...options,

      reason:
        options.reason ||
        'PAN_CAMERA'
    }
  );
}

export function tiltHEarthCamera(
  deltaTilt = 0,
  options =
    EMPTY_FROZEN_OBJECT
) {
  return setHEarthCameraState(
    {
      tiltX:
        activeCameraState.tiltX +
        normalizeHEarthControllerNumber(
          deltaTilt,
          0
        ),

      focusObjectId:
        null,

      focusId:
        'MANUAL_CAMERA_TILT'
    },
    {
      ...options,

      reason:
        options.reason ||
        'TILT_CAMERA'
    }
  );
}

export function yawHEarthCamera(
  deltaYaw = 0,
  options =
    EMPTY_FROZEN_OBJECT
) {
  return setHEarthCameraState(
    {
      yawY:
        activeCameraState.yawY +
        normalizeHEarthControllerNumber(
          deltaYaw,
          0
        ),

      focusObjectId:
        null,

      focusId:
        'MANUAL_CAMERA_YAW'
    },
    {
      ...options,

      reason:
        options.reason ||
        'YAW_CAMERA'
    }
  );
}

export function zoomHEarthCamera(
  deltaZoom = 0,
  options =
    EMPTY_FROZEN_OBJECT
) {
  return setHEarthCameraState(
    {
      zoom:
        activeCameraState.zoom +
        normalizeHEarthControllerNumber(
          deltaZoom,
          0
        ),

      focusObjectId:
        null,

      focusId:
        'MANUAL_CAMERA_ZOOM'
    },
    {
      ...options,

      reason:
        options.reason ||
        'ZOOM_CAMERA'
    }
  );
}

export function resetHEarthCamera(
  options =
    EMPTY_FROZEN_OBJECT
) {
  return applyHEarthCameraState({
    state:
      {
        ...H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
          .defaultState,

        focusObjectId:
          null,

        focusId:
          'DEFAULT_GROUND_VIEW'
      },

    mountNode:
      options.mountNode ||
      activeMountNode,

    renderRoot:
      options.renderRoot ||
      activeRenderRoot,

    reason:
      options.reason ||
      'RESET_CAMERA'
  });
}

export function resolveCameraFocusPresetForObject(
  objectId
) {
  const presets =
    H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
      .focusPresets;

  if (
    objectId ===
    'OBJ_002_FOREGROUND_WET_SAND'
  ) {
    return presets.ground;
  }

  if (
    objectId ===
    'OBJ_001_GROUND_SPAWN_ANCHOR'
  ) {
    return presets.inspectionAnchor;
  }

  if (
    objectId ===
    'OBJ_005_SHORELINE_FOAM_LINE' ||
    objectId ===
    'OBJ_006_NEARSHORE_WAVE_BAND' ||
    objectId ===
    'OBJ_007_WATER_SURFACE_PLANE'
  ) {
    return presets.shoreline;
  }

  if (
    objectId ===
    'OBJ_009_MANOR_EXTERIOR_CONTEXT'
  ) {
    return presets.manorContext;
  }

  if (
    objectId ===
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ) {
    return presets.offshoreContext;
  }

  if (
    H_EARTH_3D_INSPECTION_TARGET_MODEL
      .supportingInspectionTargets
      .includes(objectId)
  ) {
    return presets.ground;
  }

  return null;
}

export function buildHEarthFocusReceipt({
  objectId,
  preset =
    null,

  selectionReference =
    null,

  cameraReceipt =
    null,

  focused =
    false,

  reason =
    null,

  warningCodes =
    EMPTY_FROZEN_ARRAY,

  failureCodes =
    EMPTY_FROZEN_ARRAY
} = {}) {
  return Object.freeze({
    receiptType:
      'H_EARTH_3D_CAMERA_FOCUS_RECEIPT',

    contractId:
      H_EARTH_3D_CONTROLLER_CONTRACT
        .contractId,

    objectId,

    classification:
      classifyControllerTarget(
        objectId
      ),

    preset,

    selectionReference,

    cameraReceipt,

    focused,

    reason,

    mountedRendererReferencePresent:
      selectionReference
        ?.hasMountedRendererReference ===
      true,

    compositorReferencePresent:
      selectionReference
        ?.hasCompositorReference ===
      true,

    executesInspection:
      false,

    createsReadout:
      false,

    createsReceipt:
      false,

    warningCodes:
      uniqueHEarthControllerCodes(
        warningCodes
      ),

    failureCodes:
      uniqueHEarthControllerCodes(
        failureCodes
      ),

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function focusHEarthObject(
  objectId,
  options =
    EMPTY_FROZEN_OBJECT
) {
  const preset =
    resolveCameraFocusPresetForObject(
      objectId
    );

  const selectionReference =
    getPublicStageSelectionReference(
      objectId,
      options.mountNode ||
      activeMountNode
    );

  if (!preset) {
    return buildHEarthFocusReceipt({
      objectId,

      preset:
        null,

      selectionReference,

      focused:
        false,

      reason:
        'NO_CAMERA_FOCUS_PRESET_FOR_OBJECT',

      failureCodes:
        Object.freeze([
          'CAMERA_FOCUS_PRESET_MISSING'
        ])
    });
  }

  if (
    selectionReference
      .hasCompositorReference !==
    true
  ) {
    return buildHEarthFocusReceipt({
      objectId,

      preset,

      selectionReference,

      focused:
        false,

      reason:
        'COMPOSITOR_OBJECT_REFERENCE_MISSING',

      failureCodes:
        Object.freeze([
          'COMPOSITOR_OBJECT_REFERENCE_MISSING'
        ])
    });
  }

  const cameraReceipt =
    applyHEarthCameraState({
      state:
        {
          ...preset.state,

          focusObjectId:
            objectId,

          focusId:
            preset.focusId
        },

      mountNode:
        options.mountNode ||
        activeMountNode,

      renderRoot:
        options.renderRoot ||
        activeRenderRoot,

      reason:
        `FOCUS_OBJECT:${objectId}`
    });

  const mountedNodes =
    getMountedRendererNodesForObject(
      objectId,
      options.mountNode ||
      activeMountNode
    );

  mountedNodes.forEach(
    (node) => {
      node.classList.add(
        'h-earth-controller-focus-target'
      );

      node.setAttribute(
        'data-h-earth-controller-focused',
        'true'
      );
    }
  );

  return buildHEarthFocusReceipt({
    objectId,

    preset,

    selectionReference,

    cameraReceipt,

    focused:
      cameraReceipt.applied === true,

    reason:
      'CAMERA_FOCUS_APPLIED',

    warningCodes:
      selectionReference
        .hasMountedRendererReference ===
      true
        ? EMPTY_FROZEN_ARRAY
        : Object.freeze([
            'FOCUS_APPLIED_WITHOUT_MOUNTED_OBJECT_NODE_REFERENCE'
          ])
  });
}

export function focusHEarthGround(
  options =
    EMPTY_FROZEN_OBJECT
) {
  return focusHEarthObject(
    'OBJ_002_FOREGROUND_WET_SAND',
    options
  );
}

export function focusHEarthInspectionAnchor(
  options =
    EMPTY_FROZEN_OBJECT
) {
  return focusHEarthObject(
    'OBJ_001_GROUND_SPAWN_ANCHOR',
    options
  );
}

export function focusHEarthShoreline(
  options =
    EMPTY_FROZEN_OBJECT
) {
  return focusHEarthObject(
    'OBJ_005_SHORELINE_FOAM_LINE',
    options
  );
}

export function resolveContextOnlyBlockResponse(
  objectId
) {
  const classification =
    classifyControllerTarget(
      objectId
    );

  if (
    classification ===
    'MANOR_CONTEXT_ONLY'
  ) {
    return Object.freeze({
      objectId,

      responseType:
        'MANOR_CONTEXT_ONLY_RESPONSE',

      selectable:
        canSelectHEarthObject(
          objectId
        ),

      focusable:
        true,

      inspectable:
        false,

      allowedAction:
        'Focus Manor Context',

      blockedBehavior:
        'ENTER_MANOR_INTERIOR',

      message:
        'The manor may be framed as elevated exterior context. Interior traversal is blocked.',

      matrixCollapse:
        false
    });
  }

  if (
    classification ===
    'OFFSHORE_CONTEXT_ONLY'
  ) {
    return Object.freeze({
      objectId,

      responseType:
        'OFFSHORE_CONTEXT_ONLY_RESPONSE',

      selectable:
        canSelectHEarthObject(
          objectId
        ),

      focusable:
        true,

      inspectable:
        false,

      allowedAction:
        'Focus Offshore Context',

      blockedBehavior:
        'TRAVERSE_DISTANT_WORLD',

      message:
        'Offshore islets may be framed as distant context. Distant traversal is blocked.',

      matrixCollapse:
        false
    });
  }

  if (
    classification ===
    'WATER_ATMOSPHERIC_CONTEXT'
  ) {
    return Object.freeze({
      objectId,

      responseType:
        'WATER_ATMOSPHERIC_CONTEXT_RESPONSE',

      selectable:
        canSelectHEarthObject(
          objectId
        ),

      focusable:
        true,

      inspectable:
        false,

      allowedAction:
        'Focus Shoreline',

      blockedBehaviors:
        Object.freeze([
          'SWIM',
          'ACTIVATE_FLUID_SIMULATION',
          'START_OPEN_WORLD_MOVEMENT'
        ]),

      message:
        'Water and atmospheric context may be framed by the bounded camera but does not authorize simulation or traversal.',

      matrixCollapse:
        false
    });
  }

  return null;
}

export function resolveGroundConditionReadBridge(
  objectId,
  mountNode = activeMountNode
) {
  const classification =
    classifyControllerTarget(
      objectId
    );

  const objectReference =
    getSafeObjectReference(
      objectId
    );

  const environmentObject =
    getSafeEnvironmentObject(
      objectId
    );

  const selectionReference =
    getPublicStageSelectionReference(
      objectId,
      mountNode
    );

  const bridgeEligible =
    classification ===
      'PRIMARY_INSPECTION_TARGET' ||
    classification ===
      'SUPPORTING_INSPECTION_TARGET' ||
    (
      classification ===
        'SECONDARY_SURFACE_CONTEXT' &&
      objectId ===
        'OBJ_003_DRY_SAND_TRANSITION'
    );

  return Object.freeze({
    objectId,

    bridgeResolved:
      bridgeEligible,

    classification,

    readout:
      'Ground Condition Read',

    readoutId:
      'H_EARTH_GROUND_CONDITION_READ',

    firstAction:
      'Inspect Ground',

    firstReceipt:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    objectLabel:
      objectReference?.label ||
      environmentObject?.label ||
      objectId,

    zoneId:
      environmentObject?.zoneId ||
      selectionReference.zoneId ||
      null,

    primitiveType:
      environmentObject?.primitiveType ||
      null,

    materialKey:
      environmentObject?.materialKey ||
      getCompositorPrimaryLayerForObject(
        objectId
      )?.materialKey ||
      null,

    selectionReference,

    descriptorBridgeOnly:
      true,

    liveSceneStateRead:
      false,

    producesReadoutAtRuntime:
      false,

    createsReceiptAtRuntime:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    matrixCollapse:
      false
  });
}

export function resolveGroundInspectionReceiptBridge(
  objectId,
  mountNode = activeMountNode
) {
  const classification =
    classifyControllerTarget(
      objectId
    );

  const inspectable =
    canInspectHEarthObject(
      objectId
    );

  const readoutBridge =
    resolveGroundConditionReadBridge(
      objectId,
      mountNode
    );

  return Object.freeze({
    objectId,

    receiptBridgeId:
      `H_EARTH_3D_CONTROLLER_RECEIPT_BRIDGE_${objectId || 'UNKNOWN'}`,

    receiptType:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    firstAction:
      'Inspect Ground',

    firstReadout:
      'Ground Condition Read',

    classification,

    bridgeEligible:
      inspectable,

    readoutBridgeResolved:
      readoutBridge.bridgeResolved ===
      true,

    descriptorOnly:
      true,

    createsReceiptAtRuntime:
      false,

    emitsReceiptToRuntime:
      false,

    persistsReceipt:
      false,

    validationReceiptClaim:
      false,

    matrixCollapse:
      false
  });
}

export function resolveInspectGroundControllerBridge(
  objectId,
  mountNode = activeMountNode
) {
  const classification =
    classifyControllerTarget(
      objectId
    );

  const objectReference =
    getSafeObjectReference(
      objectId
    );

  const environmentObject =
    getSafeEnvironmentObject(
      objectId
    );

  const selectable =
    canSelectHEarthObject(
      objectId
    );

  const inspectable =
    canInspectHEarthObject(
      objectId
    );

  const selectionReference =
    getPublicStageSelectionReference(
      objectId,
      mountNode
    );

  const readoutBridge =
    resolveGroundConditionReadBridge(
      objectId,
      mountNode
    );

  const receiptBridge =
    resolveGroundInspectionReceiptBridge(
      objectId,
      mountNode
    );

  const focusPreset =
    resolveCameraFocusPresetForObject(
      objectId
    );

  return Object.freeze({
    objectId,

    bridgeResolved:
      Boolean(
        objectReference ||
        environmentObject ||
        selectionReference
          .hasCompositorReference
      ),

    controllerBridgeId:
      `H_EARTH_3D_INSPECT_GROUND_CONTROLLER_BRIDGE_${objectId}`,

    classification,

    selectable,

    inspectable,

    focusable:
      Boolean(focusPreset),

    focusPreset,

    action:
      'Inspect Ground',

    actionId:
      'H_EARTH_INSPECT_GROUND_ACTION',

    readout:
      'Ground Condition Read',

    readoutId:
      'H_EARTH_GROUND_CONDITION_READ',

    receipt:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    objectLabel:
      objectReference?.label ||
      environmentObject?.label ||
      objectId,

    zoneId:
      environmentObject?.zoneId ||
      selectionReference.zoneId ||
      null,

    primitiveType:
      environmentObject?.primitiveType ||
      null,

    materialKey:
      environmentObject?.materialKey ||
      getCompositorPrimaryLayerForObject(
        objectId
      )?.materialKey ||
      null,

    inspectionRadius:
      getSafeInspectionRadius(
        objectId
      ),

    inspectionAnchor:
      getSafeInspectionAnchor(
        objectId
      ),

    selectionReference,

    readoutBridge,

    receiptBridge,

    contextOnlyBlockResponse:
      resolveContextOnlyBlockResponse(
        objectId
      ),

    cameraFocusExecutionAvailable:
      Boolean(focusPreset),

    runtimeActionExecutionClaim:
      false,

    liveSceneReadClaim:
      false,

    readoutProductionClaim:
      false,

    receiptCreationClaim:
      false,

    matrixCollapse:
      false
  });
}

export function buildSelectableTargetDescriptor(
  objectId
) {
  const objectReference =
    getSafeObjectReference(
      objectId
    );

  const environmentObject =
    getSafeEnvironmentObject(
      objectId
    );

  const classification =
    classifyControllerTarget(
      objectId
    );

  const compositorLayers =
    getCompositorLayersForObject(
      objectId
    );

  const focusPreset =
    resolveCameraFocusPresetForObject(
      objectId
    );

  return Object.freeze({
    objectId,

    targetResolved:
      Boolean(
        objectReference ||
        environmentObject ||
        compositorLayers.length >
        0
      ),

    label:
      objectReference?.label ||
      environmentObject?.label ||
      objectId,

    classification,

    selectable:
      canSelectHEarthObject(
        objectId
      ),

    inspectable:
      canInspectHEarthObject(
        objectId
      ),

    focusable:
      Boolean(focusPreset),

    focusPreset,

    zoneId:
      environmentObject?.zoneId ||
      compositorLayers[0]
        ?.primaryZoneId ||
      null,

    primitiveType:
      environmentObject?.primitiveType ||
      compositorLayers[0]
        ?.primitiveIntent ||
      null,

    materialKey:
      environmentObject?.materialKey ||
      compositorLayers[0]
        ?.materialKey ||
      null,

    compositorLayerIds:
      Object.freeze(
        compositorLayers.map(
          (layer) => layer.layerId
        )
      ),

    capability:
      objectReference?.capability ||
      EMPTY_FROZEN_OBJECT,

    context:
      environmentObject?.context ||
      EMPTY_FROZEN_OBJECT,

    boundary:
      environmentObject?.boundary ||
      EMPTY_FROZEN_OBJECT,

    inspectionRadius:
      getSafeInspectionRadius(
        objectId
      ),

    inspectionAnchor:
      getSafeInspectionAnchor(
        objectId
      ),

    actionBridge:
      resolveInspectGroundControllerBridge(
        objectId
      ),

    readoutBridge:
      resolveGroundConditionReadBridge(
        objectId
      ),

    receiptBridge:
      resolveGroundInspectionReceiptBridge(
        objectId
      ),

    contextOnlyBlockResponse:
      resolveContextOnlyBlockResponse(
        objectId
      ),

    claimFlags:
      Object.freeze({
        cameraFocusExecution:
          Boolean(focusPreset),

        liveInspectionExecution:
          false,

        actorMovement:
          false,

        collision:
          false,

        visualPassClaim:
          false,

        validationClaim:
          false,

        productionClaim:
          false,

        matrixCollapse:
          false
      })
  });
}

export const H_EARTH_3D_SELECTABLE_TARGET_REGISTRY =
  Object.freeze(
    CONTROLLER_OBJECT_IDS.reduce(
      (
        accumulator,
        objectId
      ) => {
        accumulator[objectId] =
          buildSelectableTargetDescriptor(
            objectId
          );

        return accumulator;
      },
      {}
    )
  );

export const H_EARTH_3D_INSPECTION_ACTION_ROUTING =
  Object.freeze({
    id:
      'H_EARTH_3D_INSPECTION_ACTION_ROUTING_STEP_034P',

    action:
      'Inspect Ground',

    actionId:
      'H_EARTH_INSPECT_GROUND_ACTION',

    primaryTarget:
      H_EARTH_3D_INSPECTION_TARGET_MODEL
        .primaryInspectionTarget,

    supportingTargets:
      H_EARTH_3D_INSPECTION_TARGET_MODEL
        .supportingInspectionTargets,

    targetRoutes:
      Object.freeze(
        CONTROLLER_OBJECT_IDS.reduce(
          (
            accumulator,
            objectId
          ) => {
            accumulator[objectId] =
              resolveInspectGroundControllerBridge(
                objectId
              );

            return accumulator;
          },
          {}
        )
      ),

    cameraFocusAvailable:
      true,

    runtimeInspectionAvailable:
      false,

    boundary:
      H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
  });

export const H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE =
  Object.freeze({
    id:
      'H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE_STEP_034P',

    readout:
      'Ground Condition Read',

    readoutId:
      'H_EARTH_GROUND_CONDITION_READ',

    sourceAction:
      'Inspect Ground',

    sourceActionId:
      'H_EARTH_INSPECT_GROUND_ACTION',

    targetReadoutBridges:
      Object.freeze(
        CONTROLLER_OBJECT_IDS.reduce(
          (
            accumulator,
            objectId
          ) => {
            accumulator[objectId] =
              resolveGroundConditionReadBridge(
                objectId
              );

            return accumulator;
          },
          {}
        )
      ),

    descriptorBridgeOnly:
      true,

    liveSceneStateRead:
      false,

    producesReadoutAtRuntime:
      false,

    createsReceiptAtRuntime:
      false,

    expectedLiveImplementationStep:
      'STEP_034S_LIVE_INSPECT_GROUND_SCENE_STATE_READ',

    boundary:
      H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
  });

export const H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE =
  Object.freeze({
    id:
      'H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE_STEP_034P',

    receipt:
      'H_EARTH_GROUND_INSPECTION_RECEIPT',

    sourceAction:
      'Inspect Ground',

    sourceReadout:
      'Ground Condition Read',

    targetReceiptBridges:
      Object.freeze(
        CONTROLLER_OBJECT_IDS.reduce(
          (
            accumulator,
            objectId
          ) => {
            accumulator[objectId] =
              resolveGroundInspectionReceiptBridge(
                objectId
              );

            return accumulator;
          },
          {}
        )
      ),

    createsReceiptAtRuntime:
      false,

    deterministicReceiptAvailable:
      false,

    expectedDeterministicReceiptStep:
      'STEP_034T_DETERMINISTIC_STATE_RECEIPT',

    boundary:
      H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
  });

export function buildControllerMountReceipt({
  controllerMounted =
    false,

  rendererMountReceipt =
    null,

  cameraReceipt =
    null,

  mountNodeValid =
    false,

  renderRootPresent =
    false,

  warningCodes =
    EMPTY_FROZEN_ARRAY,

  failureCodes =
    EMPTY_FROZEN_ARRAY
} = {}) {
  return Object.freeze({
    receiptType:
      'H_EARTH_3D_CONTROLLER_MOUNT_RECEIPT',

    contractId:
      H_EARTH_3D_CONTROLLER_CONTRACT
        .contractId,

    controllerMounted,

    mounted:
      controllerMounted,

    mountNodeValid,

    rendererMountReceipt,

    rendererMounted:
      rendererMountReceipt
        ?.rendererMounted === true,

    renderRootPresent,

    cameraReceipt,

    cameraApplied:
      cameraReceipt?.applied === true,

    compositorAuthorityConsumed:
      true,

    rendererAuthorityConsumed:
      true,

    boundedGroundViewEstablished:
      controllerMounted &&
      renderRootPresent &&
      cameraReceipt?.applied ===
        true,

    actorProxyCreated:
      false,

    collisionCreated:
      false,

    liveInspectGroundCreated:
      false,

    deterministicStateReceiptCreated:
      false,

    warningCodes:
      uniqueHEarthControllerCodes(
        warningCodes
      ),

    failureCodes:
      uniqueHEarthControllerCodes(
        failureCodes
      ),

    runtimeProofComplete:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function mountHEarthController({
  mountNode,

  composition =
    H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,

  options =
    EMPTY_FROZEN_OBJECT,

  boundary =
    EMPTY_FROZEN_OBJECT
} = {}) {
  const rendererMountReceipt =
    mountHEarthRenderer({
      mountNode,

      composition,

      controller:
        H_EARTH_3D_CONTROLLER,

      options:
        options.rendererOptions ||
        options,

      boundary:
        {
          ...H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS,
          ...boundary
        }
    });

  activeRendererMountReceipt =
    rendererMountReceipt;

  if (
    rendererMountReceipt
      ?.rendererMounted !== true
  ) {
    activeMountNode =
      mountNode ||
      null;

    activeRenderRoot =
      null;

    const failureReceipt =
      buildControllerMountReceipt({
        controllerMounted:
          false,

        rendererMountReceipt,

        cameraReceipt:
          null,

        mountNodeValid:
          rendererMountReceipt
            ?.mountNodeValid === true,

        renderRootPresent:
          false,

        warningCodes:
          rendererMountReceipt
            ?.warningCodes ||
          EMPTY_FROZEN_ARRAY,

        failureCodes:
          rendererMountReceipt
            ?.failureCodes ||
          Object.freeze([
            'RENDERER_MOUNT_FAILED'
          ])
      });

    activeControllerReceipt =
      failureReceipt;

    return failureReceipt;
  }

  const renderRoot =
    getHEarthMountedRenderRoot(
      mountNode
    );

  activeMountNode =
    mountNode;

  activeRenderRoot =
    renderRoot;

  const cameraReceipt =
    options.initialFocusObjectId
      ? focusHEarthObject(
          options.initialFocusObjectId,
          {
            mountNode,
            renderRoot
          }
        ).cameraReceipt
      : applyHEarthCameraState({
          state:
            options.initialCameraState ||
            {
              ...H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
                .defaultState,

              focusId:
                'DEFAULT_GROUND_VIEW'
            },

          mountNode,

          renderRoot,

          reason:
            'CONTROLLER_INITIAL_CAMERA_APPLICATION'
        });

  const receipt =
    buildControllerMountReceipt({
      controllerMounted:
        Boolean(renderRoot) &&
        cameraReceipt?.applied ===
          true,

      rendererMountReceipt,

      cameraReceipt,

      mountNodeValid:
        true,

      renderRootPresent:
        Boolean(renderRoot),

      warningCodes:
        rendererMountReceipt
          ?.warningCodes ||
        EMPTY_FROZEN_ARRAY,

      failureCodes:
        [
          ...(rendererMountReceipt
            ?.failureCodes ||
            []),

          ...(
            cameraReceipt?.failureCodes ||
            []
          )
        ]
    });

  activeControllerReceipt =
    receipt;

  return receipt;
}

export function destroyHEarthController({
  mountNode =
    activeMountNode,

  boundary =
    EMPTY_FROZEN_OBJECT
} = {}) {
  const rendererDestroyReceipt =
    destroyHEarthRenderer({
      mountNode,

      boundary:
        {
          ...H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS,
          ...boundary
        }
    });

  const destroyed =
    rendererDestroyReceipt
      ?.destroyed === true;

  const priorCameraState =
    activeCameraState;

  activeMountNode =
    null;

  activeRenderRoot =
    null;

  activeRendererMountReceipt =
    null;

  activeCameraState =
    normalizeHEarthCameraState({
      ...H_EARTH_3D_CAMERA_CONSTRAINT_MODEL
        .defaultState,

      revision:
        normalizeHEarthControllerNumber(
          priorCameraState?.revision,
          0
        ) + 1,

      mounted:
        false,

      applied:
        false,

      focusObjectId:
        null,

      focusId:
        'DEFAULT_GROUND_VIEW'
    });

  const receipt =
    Object.freeze({
      receiptType:
        'H_EARTH_3D_CONTROLLER_DESTROY_RECEIPT',

      contractId:
        H_EARTH_3D_CONTROLLER_CONTRACT
          .contractId,

      destroyed,

      rendererDestroyReceipt,

      controllerStateCleared:
        true,

      cameraStateReset:
        true,

      rendererOwnedNodesOnly:
        true,

      routeShellPreserved:
        true,

      warningCodes:
        rendererDestroyReceipt
          ?.warningCodes ||
        EMPTY_FROZEN_ARRAY,

      failureCodes:
        rendererDestroyReceipt
          ?.failureCodes ||
        EMPTY_FROZEN_ARRAY,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false,

      claimBoundaryPreserved:
        true
    });

  activeControllerReceipt =
    receipt;

  return receipt;
}

export function getHEarthControllerState() {
  return Object.freeze({
    stateType:
      'H_EARTH_3D_CONTROLLER_STATE',

    activeMountNodePresent:
      Boolean(activeMountNode),

    activeRenderRootPresent:
      Boolean(activeRenderRoot),

    rendererMounted:
      activeRendererMountReceipt
        ?.rendererMounted === true,

    cameraState:
      activeCameraState,

    controllerReceipt:
      activeControllerReceipt,

    rendererMountReceipt:
      activeRendererMountReceipt,

    rendererDiagnosticSnapshot:
      activeMountNode
        ? getHEarthRendererDiagnosticSnapshot(
            activeMountNode
          )
        : null,

    actorProxyPresent:
      false,

    groundContactPresent:
      false,

    collisionPresent:
      false,

    liveInspectionPresent:
      false,

    deterministicReceiptPresent:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function getHEarthCameraState() {
  return activeCameraState;
}

export function getHEarthActiveMountNode() {
  return activeMountNode;
}

export function getHEarthActiveRenderRoot() {
  return (
    activeRenderRoot ||
    (
      activeMountNode
        ? getHEarthMountedRenderRoot(
            activeMountNode
          )
        : null
    )
  );
}

export function getSelectableTarget(
  objectId
) {
  return (
    H_EARTH_3D_SELECTABLE_TARGET_REGISTRY[
      objectId
    ] ||
    null
  );
}

export function getControllerTargetClassification(
  objectId
) {
  return classifyControllerTarget(
    objectId
  );
}

export function resolveBlockedBehaviorResponse(
  behaviorId
) {
  if (
    !behaviorId ||
    typeof behaviorId !== 'string'
  ) {
    return Object.freeze({
      behaviorId:
        null,

      responseType:
        'BLOCKED_BEHAVIOR_UNRESOLVED',

      message:
        'No behavior identifier was supplied.',

      runtimeClaim:
        false,

      validationClaim:
        false,

      matrixCollapse:
        false
    });
  }

  return (
    H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES[
      behaviorId
    ] ||
    Object.freeze({
      behaviorId,

      responseType:
        'BLOCKED_BEHAVIOR_DEFAULT',

      message:
        'This behavior is not authorized by the bounded Ground-View controller.',

      runtimeClaim:
        false,

      routeIntegrationClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false,

      matrixCollapse:
        false
    })
  );
}

export const H_EARTH_3D_CONTROLLER_BOOTSTRAP_EXPECTATIONS =
  Object.freeze({
    id:
      'H_EARTH_3D_CONTROLLER_BOOTSTRAP_EXPECTATIONS_STEP_034P',

    expectedBootstrapFile:
      '/showroom/globe/h-earth/index.js',

    expectedRoute:
      '/showroom/globe/h-earth/',

    bootstrapMayCall:
      Object.freeze([
        'mountHEarthController',
        'destroyHEarthController',
        'setHEarthCameraState',
        'panHEarthCamera',
        'tiltHEarthCamera',
        'yawHEarthCamera',
        'zoomHEarthCamera',
        'resetHEarthCamera',
        'focusHEarthObject',
        'focusHEarthGround',
        'focusHEarthInspectionAnchor',
        'focusHEarthShoreline',
        'getHEarthControllerState',
        'getHEarthCameraState'
      ]),

    bootstrapMayRead:
      Object.freeze([
        'H_EARTH_3D_CONTROLLER',
        'H_EARTH_3D_CONTROLLER_RECEIPT',
        'H_EARTH_3D_SELECTABLE_TARGET_REGISTRY',
        'H_EARTH_3D_INSPECTION_ACTION_ROUTING',
        'H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE',
        'H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE',
        'H_EARTH_3D_CAMERA_CONSTRAINT_MODEL'
      ]),

    bootstrapMustSupplyMountNode:
      true,

    bootstrapMustNotInfer:
      Object.freeze([
        'visual pass',
        'validation',
        'production readiness',
        'actor proxy',
        'ground contact',
        'collision',
        'walking',
        'live Inspect Ground',
        'runtime Ground Condition Read',
        'deterministic state receipt',
        'open-world traversal',
        'swimming',
        'fluid simulation',
        'manor interior access',
        'distant traversal',
        'matrix collapse'
      ]),

    boundary:
      H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
  });

export const H_EARTH_3D_CONTROLLER_RECEIPT =
  Object.freeze({
    receiptType:
      'H_EARTH_3D_CONTROLLER_RECEIPT',

    file:
      '/showroom/globe/h-earth/controller.js',

    contractId:
      'H_EARTH_3D_CONTROLLER_FILE_RENEWAL_STEP_034P_BOUNDED_GROUND_VIEW_CAMERA_AND_CONTROLLER_v1',

    renewedFrom:
      'H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027A_RENEWAL_CLEANUP_PACKET_v1',

    status:
      'BOUNDED_GROUND_VIEW_CAMERA_AND_CONTROLLER_SOURCE_CANDIDATE_PENDING_INSTALLATION_IMPORT_AND_RUNTIME_PROOF',

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

    upstreamCapacityReceipt:
      getCapacityReceipt(),

    upstreamEnvironmentReceipt:
      getEnvironmentReceipt(),

    upstreamCompositorReceipt:
      getPublicStageCompositionReceipt(),

    upstreamRendererReceipt:
      getRendererReceipt(),

    compositorContractReferenced:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT
        .contractId,

    rendererContractReferenced:
      H_EARTH_3D_RENDERER_RECEIPT
        .contractId,

    compositorAuthorityConsumed:
      true,

    rendererAuthorityConsumed:
      true,

    boundedCameraModelDefined:
      true,

    cameraStateModelDefined:
      true,

    cameraClampDefined:
      true,

    cameraTransformApplicationDefined:
      true,

    cameraPanDefined:
      true,

    cameraTiltDefined:
      true,

    cameraYawDefined:
      true,

    cameraZoomDefined:
      true,

    cameraResetDefined:
      true,

    cameraFocusDefined:
      true,

    rendererMountCoordinationDefined:
      true,

    rendererDestroyCoordinationDefined:
      true,

    selectableTargetRegistryDefined:
      true,

    inspectionActionRoutingDefined:
      true,

    groundConditionReadBridgeDefined:
      true,

    groundInspectionReceiptBridgeDefined:
      true,

    controllerStateSnapshotDefined:
      true,

    bootstrapExpectationsDefined:
      true,

    publicStageLayerCount:
      H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER
        .length,

    publicStageLayerCountExpected:
      15,

    publicStageLayerCountMatchesExpected:
      H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER
        .length === 15,

    rendererRenderInputPresent:
      Boolean(
        H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT
      ),

    primaryInspectionTarget:
      H_EARTH_3D_INSPECTION_TARGET_MODEL
        .primaryInspectionTarget,

    supportingInspectionTargets:
      H_EARTH_3D_INSPECTION_TARGET_MODEL
        .supportingInspectionTargets,

    selectableTargetCount:
      Object.values(
        H_EARTH_3D_SELECTABLE_TARGET_REGISTRY
      ).filter(
        (target) =>
          target?.selectable ===
          true
      ).length,

    inspectableTargetCount:
      Object.values(
        H_EARTH_3D_SELECTABLE_TARGET_REGISTRY
      ).filter(
        (target) =>
          target?.inspectable ===
          true
      ).length,

    actorProxyCreated:
      false,

    capsuleBodyCreated:
      false,

    groundContactCreated:
      false,

    collisionCreated:
      false,

    walkingCreated:
      false,

    liveInspectGroundCreated:
      false,

    runtimeGroundConditionReadCreated:
      false,

    deterministicStateReceiptCreated:
      false,

    importResolutionVerified:
      false,

    moduleGraphExecutionVerified:
      false,

    rendererMountExecutionVerified:
      false,

    cameraApplicationVerified:
      false,

    focusExecutionVerified:
      false,

    routeIntegrationVerified:
      false,

    visualOutputInspected:
      false,

    runtimeProofComplete:
      false,

    expectedNextProof:
      'INSTALL_CONTROLLER_AND_VERIFY_RENDERER_MOUNT_CAMERA_APPLICATION_BOUNDED_CONTROLS_AND_GROUND_FOCUS',

    expectedNextStep:
      'STEP_034Q_MINIMAL_ACTOR_PROXY_AND_CAPSULE_STATE',

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
          'h-earth-controller-step-034p-bounded-ground-view-camera-and-controller-backup',

        sourceFile:
          '/showroom/globe/h-earth/controller.js',

        contractId:
          'H_EARTH_3D_CONTROLLER_FILE_RENEWAL_STEP_034P_BOUNDED_GROUND_VIEW_CAMERA_AND_CONTROLLER_v1',

        backupStatus:
          'PENDING_INSTALLATION_AND_DRIVE_BACKUP',

        driveDocumentId:
          null,

        connectorReadbackVerified:
          false
      }),

    claimCeiling:
      Object.freeze({
        CANVAS:
          false,

        WEBGL:
          false,

        SVG:
          false,

        ACTOR_PROXY:
          false,

        CAPSULE_BODY:
          false,

        GROUND_CONTACT:
          false,

        COLLISION:
          false,

        PHYSICS:
          false,

        WALKING:
          false,

        FREE_FLIGHT:
          false,

        OPEN_WORLD:
          false,

        SWIMMING:
          false,

        FLUID_SIMULATION:
          false,

        SURVIVAL_SIMULATION:
          false,

        MANOR_INTERIOR_ACCESS:
          false,

        DISTANT_TRAVERSAL:
          false,

        LIVE_INSPECT_GROUND:
          false,

        RUNTIME_GROUND_CONDITION_READ:
          false,

        RUNTIME_INSPECTION_RECEIPT:
          false,

        DETERMINISTIC_STATE_RECEIPT:
          false,

        FINAL_RENDERER_CLAIM:
          false,

        RENDERER_PASS_CLAIM:
          false,

        VISUAL_PASS_CLAIM:
          false,

        VALIDATION_CLAIM:
          false,

        PRODUCTION_CLAIM:
          false,

        DEPLOYMENT_CLAIM:
          false,

        MATRIX_COLLAPSE:
          false
      }),

    boundary:
      H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS,

    claimBoundaryPreserved:
      true
  });

export function getControllerReceipt() {
  return H_EARTH_3D_CONTROLLER_RECEIPT;
}

export const H_EARTH_3D_CONTROLLER =
  Object.freeze({
    id:
      'H_EARTH_3D_CONTROLLER',

    file:
      '/showroom/globe/h-earth/controller.js',

    step:
      'STEP_034P_BOUNDED_GROUND_VIEW_CAMERA_AND_CONTROLLER_RENEWAL',

    sourceRoot:
      '/h-earth-3d/',

    primaryRoute:
      '/showroom/globe/h-earth/',

    contract:
      H_EARTH_3D_CONTROLLER_CONTRACT,

    boundaryFlags:
      H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS,

    inputs:
      H_EARTH_3D_CONTROLLER_INPUTS,

    cameraConstraintModel:
      H_EARTH_3D_CAMERA_CONSTRAINT_MODEL,

    initialCameraState:
      H_EARTH_3D_CAMERA_STATE,

    inspectionTargetModel:
      H_EARTH_3D_INSPECTION_TARGET_MODEL,

    selectableTargetRegistry:
      H_EARTH_3D_SELECTABLE_TARGET_REGISTRY,

    inspectionActionRouting:
      H_EARTH_3D_INSPECTION_ACTION_ROUTING,

    groundConditionReadBridge:
      H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE,

    groundInspectionReceiptBridge:
      H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE,

    blockedBehaviorResponses:
      H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES,

    bootstrapExpectations:
      H_EARTH_3D_CONTROLLER_BOOTSTRAP_EXPECTATIONS,

    upstreamCapacity:
      H_EARTH_3D_CAPACITY,

    upstreamEnvironment:
      H_EARTH_3D_ENVIRONMENT,

    upstreamCompositor:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,

    upstreamRenderer:
      H_EARTH_3D_RENDERER,

    normalizeHEarthControllerNumber,
    clampHEarthControllerNumber,
    normalizeHEarthControllerToken,
    uniqueHEarthControllerCodes,

    getSafeObjectReference,
    getSafeEnvironmentObject,
    getSafeInspectionAnchor,
    getSafeInspectionRadius,

    classifyControllerTarget,
    canSelectHEarthObject,
    canInspectHEarthObject,

    getCompositorLayersForObject,
    getCompositorPrimaryLayerForObject,
    getMountedRendererNodesForObject,
    getMountedRendererLayerForObject,
    getPublicStageSelectionReference,

    getCameraConstraint,
    clampCameraStateValue,
    normalizeHEarthCameraState,
    buildHEarthCameraCssTransform,
    resolveHEarthCameraStateReceipt,
    applyHEarthCameraState,
    setHEarthCameraState,
    panHEarthCamera,
    tiltHEarthCamera,
    yawHEarthCamera,
    zoomHEarthCamera,
    resetHEarthCamera,
    resolveCameraFocusPresetForObject,
    buildHEarthFocusReceipt,
    focusHEarthObject,
    focusHEarthGround,
    focusHEarthInspectionAnchor,
    focusHEarthShoreline,

    resolveContextOnlyBlockResponse,
    resolveGroundConditionReadBridge,
    resolveGroundInspectionReceiptBridge,
    resolveInspectGroundControllerBridge,
    buildSelectableTargetDescriptor,
    resolveBlockedBehaviorResponse,

    buildControllerMountReceipt,
    mountHEarthController,
    destroyHEarthController,

    getHEarthControllerState,
    getHEarthCameraState,
    getHEarthActiveMountNode,
    getHEarthActiveRenderRoot,

    getSelectableTarget,
    getControllerTargetClassification,

    getReceipt:
      getControllerReceipt,

    receipt:
      H_EARTH_3D_CONTROLLER_RECEIPT
  });

export default H_EARTH_3D_CONTROLLER;
