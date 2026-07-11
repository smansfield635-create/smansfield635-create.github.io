// /showroom/globe/h-earth/renderer.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_PUBLIC_STAGE_COMPOSITION_CONSUMPTION_v1
//
// Renews:
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032E_GEOMETRY_032D_ORGANIC_VARIATION_SYNC_v1
//
// Governing compositor:
// H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_v1
//
// Governing architecture:
// /h-earth-3d/ matrix chamber and source-root authority
//   -> Step 034I-034L public-stage source spine
//   -> compositor.js Step 034N
//   -> renderer.js Step 034O
//   -> controller / public route
//
// Purpose:
// Consume the Step 034N public-stage composition and materialize one bounded
// DOM/CSS3D shoreline scene for Ground Cell 001.
//
// This renderer is self-contained.
//
// It does not import or depend on absent support files:
//
// - /showroom/globe/h-earth/render/materials.js
// - /showroom/globe/h-earth/render/layers.js
// - /showroom/globe/h-earth/render/nodes.js
// - /showroom/globe/h-earth/render/geometry.js
//
// The renderer contains bounded internal execution seams for:
//
// - material resolution,
// - layer-container creation,
// - node construction,
// - primitive geometry projection.
//
// Those seams may be extracted later only after the vertical slice is proven.
// They are not current foundation layers, required ports, or independent
// authorities.
//
// Current authority direction:
//
// Step 034N public-stage composition
//   -> Step 034O renderer translation
//   -> bounded DOM/CSS3D scene
//   -> controller and route host
//
// Canonical scene order:
//
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
// Bounded DOM/CSS3D scene materialization only.
// No WebGL. No canvas. No SVG.
// No open-world traversal.
// No actor proxy.
// No collision or physics.
// No swimming or fluid simulation.
// No manor interior access.
// No final visual-pass claim.
// No validation claim.
// No production claim.
// No deployment claim.
// No matrix collapse.

import {
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT,
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_BOUNDARY_FLAGS,
  H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS,
  H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER,
  H_EARTH_3D_PUBLIC_STAGE_LAYER_DEFINITIONS,
  H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS,
  H_EARTH_3D_PUBLIC_STAGE_CAMERA_MODEL,
  H_EARTH_3D_PUBLIC_STAGE_VIEWPORT_MODEL,
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,
  H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT,
  getPublicStageComposition,
  getPublicStageCompositionReceipt,
  getPublicStageRendererHandoff
} from './compositor.js';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);
const EMPTY_FROZEN_OBJECT = Object.freeze({});

const H_EARTH_RENDER_OWNERSHIP_ATTRIBUTE =
  'data-h-earth-render-owned';

const H_EARTH_RENDER_ROOT_ATTRIBUTE =
  'data-h-earth-render-root';

const H_EARTH_RENDER_LAYER_ATTRIBUTE =
  'data-h-earth-render-layer';

const H_EARTH_RENDER_NODE_ATTRIBUTE =
  'data-h-earth-render-node';

const H_EARTH_RENDER_OWNED_SELECTOR =
  '[data-h-earth-render-owned="true"]';

export const H_EARTH_3D_RENDERER_CONTRACT =
  Object.freeze({
    contractId:
      'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_PUBLIC_STAGE_COMPOSITION_CONSUMPTION_v1',

    currentStep:
      'STEP_034O_PUBLIC_STAGE_RENDERER_CONSUMPTION_RENEWAL',

    renewedFrom:
      'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032E_GEOMETRY_032D_ORGANIC_VARIATION_SYNC_v1',

    governingCompositorContractId:
      'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_v1',

    file:
      '/showroom/globe/h-earth/renderer.js',

    route:
      '/showroom/globe/h-earth/',

    sourceRoot:
      '/h-earth-3d/',

    fileClass:
      'SELF_CONTAINED_PUBLIC_STAGE_COMPOSITION_CONSUMER_AND_BOUNDED_DOM_CSS3D_RENDERER',

    status:
      'PUBLIC_STAGE_COMPOSITION_CONSUMER_DEFINED_PENDING_INSTALLATION_AND_RUNTIME_PROOF',

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

    dependencyDirection:
      'COMPOSITOR_TO_RENDERER_TO_CONTROLLER_AND_PUBLIC_STAGE',

    consumes:
      Object.freeze([
        '/showroom/globe/h-earth/compositor.js'
      ]),

    intendedDownstreamConsumers:
      Object.freeze([
        '/showroom/globe/h-earth/controller.js',
        '/showroom/globe/h-earth/index.js'
      ]),

    compositorAuthority:
      Object.freeze({
        compositionContract:
          H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT,

        compositionReceipt:
          H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT,

        rendererHandoff:
          getPublicStageRendererHandoff(),

        rendererMustConsumeCompositorAuthority:
          true,

        rendererMayReinventLayerOrder:
          false,

        rendererMayReinventZoneComposition:
          false,

        rendererMayReinventLandscapeComposition:
          false,

        rendererMayReinventObjectAuthority:
          false,

        rendererMayReinventInspectionComposition:
          false,

        rendererMayReinventContextComposition:
          false
      }),

    absentSupportFiles:
      Object.freeze({
        materials:
          '/showroom/globe/h-earth/render/materials.js',

        layers:
          '/showroom/globe/h-earth/render/layers.js',

        nodes:
          '/showroom/globe/h-earth/render/nodes.js',

        geometry:
          '/showroom/globe/h-earth/render/geometry.js'
      }),

    supportFilePosture:
      Object.freeze({
        staticSupportFileImports:
          false,

        dynamicSupportFileImports:
          false,

        absentSupportFilesTolerated:
          true,

        supportFilesRequiredForCurrentExecution:
          false,

        internalMaterialResolutionDefined:
          true,

        internalLayerConstructionDefined:
          true,

        internalNodeConstructionDefined:
          true,

        internalPrimitiveProjectionDefined:
          true,

        futureExtractionSeamsRecorded:
          true,

        futureExtractionRequired:
          false
      }),

    implementationScope:
      Object.freeze({
        consumesStep034NComposition:
          true,

        validatesCompositionShape:
          true,

        createsRenderRoot:
          true,

        createsOrderedLayerContainers:
          true,

        createsBoundedDomSceneNodes:
          true,

        appliesMaterialClasses:
          true,

        appliesPrimitiveClasses:
          true,

        appliesLayerMembership:
          true,

        appliesCss3dTransforms:
          true,

        appliesSceneDimensions:
          true,

        mountsScene:
          true,

        destroysRendererOwnedNodes:
          true,

        emitsMountReceipt:
          true,

        emitsDestroyReceipt:
          true,

        actorProxy:
          false,

        groundContact:
          false,

        collision:
          false,

        liveInspectGround:
          false,

        deterministicStateReceipt:
          false
      }),

    sourceConstructionAuthorized:
      true,

    installationAuthorized:
      false,

    repositoryMutationAuthorized:
      false,

    runtimeProofComplete:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    backupComplete:
      false,

    activeBackedOccurrenceClaim:
      false
  });

export const H_EARTH_3D_RENDER_BOUNDARY_FLAGS =
  Object.freeze({
    boundedDomCss3dSceneAllowed:
      true,

    suppliedMountNodeRequired:
      true,

    mountInsideSuppliedMountNodeOnly:
      true,

    rendererOwnedNodeRemovalOnly:
      true,

    consumesCompositorAuthority:
      true,

    importsLegacyRendererScene:
      false,

    createsIndependentSceneAuthority:
      false,

    staticSupportPortImports:
      false,

    dynamicSupportPortImports:
      false,

    webglActivation:
      false,

    canvasActivation:
      false,

    svgActivation:
      false,

    iframeActivation:
      false,

    scriptCreation:
      false,

    routeShellReplacement:
      false,

    globalDocumentQuery:
      false,

    actorProxy:
      false,

    groundContact:
      false,

    collision:
      false,

    physics:
      false,

    openWorldTraversal:
      false,

    freeFlight:
      false,

    walkingSystem:
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

export const H_EARTH_3D_RENDERER_HOST_CONTRACT =
  Object.freeze({
    hostClass:
      'SELF_CONTAINED_BOUNDED_DOM_CSS3D_PUBLIC_STAGE_RENDERER',

    mountApi:
      'mountHEarthRenderer',

    destroyApi:
      'destroyHEarthRenderer',

    selectInputApi:
      'selectHEarthRenderInput',

    renderInputApi:
      'resolveHEarthPublicStageRenderInput',

    publicAggregateMustExposeMountApi:
      true,

    publicAggregateMustExposeDestroyApi:
      true,

    publicAggregateMustExposeComposition:
      true,

    ownershipAttribute:
      `${H_EARTH_RENDER_OWNERSHIP_ATTRIBUTE}="true"`,

    clearAuthoritySelector:
      H_EARTH_RENDER_OWNED_SELECTOR,

    boundary:
      H_EARTH_3D_RENDER_BOUNDARY_FLAGS
  });

export const H_EARTH_3D_RENDERER_MOUNT_CONTRACT =
  Object.freeze({
    mountSignature:
      'mountHEarthRenderer({ mountNode, composition, renderer, controller, options, boundary })',

    destroySignature:
      'destroyHEarthRenderer({ mountNode, boundary })',

    mountNodeRequired:
      true,

    compositionPrimary:
      true,

    defaultComposition:
      'H_EARTH_3D_PUBLIC_STAGE_COMPOSITION',

    legacyCandidateSceneRequired:
      false,

    clearsPriorRendererOwnedNodesOnly:
      true,

    createsBoundedDomCss3dScene:
      true,

    createsFifteenOrderedLayerContainers:
      true,

    materializesGeometryInternally:
      true,

    supportFilesRequired:
      false,

    boundary:
      H_EARTH_3D_RENDER_BOUNDARY_FLAGS
  });

export const H_EARTH_3D_RENDER_PROJECTION_MODEL =
  Object.freeze({
    modelId:
      'H_EARTH_3D_RENDER_PROJECTION_MODEL_STEP_034O',

    source:
      'STEP_034N_PUBLIC_STAGE_COMPOSITION',

    projectionClass:
      'BOUNDED_PUBLIC_STAGE_DOM_CSS3D_SHORELINE_PROJECTION',

    coordinateSystem:
      'public-stage-normalized-composition-space',

    cssTransformUnit:
      'px',

    scene:
      Object.freeze({
        nominalWidthPx:
          1440,

        nominalHeightPx:
          900,

        perspectivePx:
          1200,

        cameraOriginX:
          50,

        cameraOriginY:
          52,

        sceneDepthPx:
          900,

        largeSceneFirst:
          true
      }),

    layerProjection:
      Object.freeze({
        skyTopPercent:
          0,

        horizonPercent:
          43,

        waterTopPercent:
          39,

        shorelineTopPercent:
          60,

        foregroundTopPercent:
          66,

        foregroundBottomPercent:
          100,

        manorTopPercent:
          23,

        offshoreTopPercent:
          36
      }),

    transformOrder:
      Object.freeze([
        'translate3d',
        'rotateX',
        'rotateY',
        'rotateZ',
        'scale3d'
      ]),

    finalProjectionValidationClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });

export const H_EARTH_3D_RENDER_VOLUME_MODEL =
  Object.freeze({
    modelId:
      'H_EARTH_3D_RENDER_VOLUME_MODEL_STEP_034O',

    source:
      H_EARTH_3D_PUBLIC_STAGE_VIEWPORT_MODEL,

    previewVolumeOnly:
      true,

    boundedPublicStageVolume:
      true,

    css3dScene:
      true,

    mount:
      Object.freeze({
        expectedMountId:
          'h-earth-3d-renderer-mount',

        suppliedMountNodeRequired:
          true,

        rendererMayCreateInsideMountNodeOnly:
          true,

        rendererMayQueryGlobalDocument:
          false,

        rendererMayReplaceRouteShell:
          false,

        rendererMayReplaceIndexHtml:
          false,

        rendererMayReplaceIndexCss:
          false
      }),

    openWorldVolumeClaim:
      false,

    finalRendererClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });

export const H_EARTH_3D_RENDER_MATERIAL_TOKENS =
  Object.freeze({
    wetSand:
      Object.freeze({
        materialKey:
          'wetSand',

        className:
          'h-earth-material-wet-sand',

        surfaceRole:
          'foreground-moist-ground',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(80, 69, 56, 0.98)',

            '--h-earth-material-mid':
              'rgba(118, 102, 80, 0.94)',

            '--h-earth-material-highlight':
              'rgba(171, 150, 117, 0.62)',

            '--h-earth-material-shadow':
              'rgba(31, 29, 27, 0.82)'
          })
      }),

    drySand:
      Object.freeze({
        materialKey:
          'drySand',

        className:
          'h-earth-material-dry-sand',

        surfaceRole:
          'upper-beach-transition',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(160, 136, 96, 0.98)',

            '--h-earth-material-mid':
              'rgba(190, 164, 118, 0.94)',

            '--h-earth-material-highlight':
              'rgba(225, 204, 160, 0.68)',

            '--h-earth-material-shadow':
              'rgba(88, 72, 49, 0.74)'
          })
      }),

    foam:
      Object.freeze({
        materialKey:
          'foam',

        className:
          'h-earth-material-foam',

        surfaceRole:
          'shoreline-contact-boundary',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(233, 242, 239, 0.94)',

            '--h-earth-material-mid':
              'rgba(196, 224, 222, 0.82)',

            '--h-earth-material-highlight':
              'rgba(255, 255, 255, 0.96)',

            '--h-earth-material-shadow':
              'rgba(87, 135, 143, 0.36)'
          })
      }),

    tidePool:
      Object.freeze({
        materialKey:
          'tidePool',

        className:
          'h-earth-material-tide-pool',

        surfaceRole:
          'foreground-reflective-water',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(39, 88, 99, 0.82)',

            '--h-earth-material-mid':
              'rgba(72, 132, 140, 0.68)',

            '--h-earth-material-highlight':
              'rgba(177, 220, 218, 0.68)',

            '--h-earth-material-shadow':
              'rgba(13, 43, 52, 0.78)'
          })
      }),

    stone:
      Object.freeze({
        materialKey:
          'stone',

        className:
          'h-earth-material-stone',

        surfaceRole:
          'small-beach-stone',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(91, 91, 86, 0.98)',

            '--h-earth-material-mid':
              'rgba(127, 124, 113, 0.92)',

            '--h-earth-material-highlight':
              'rgba(174, 170, 151, 0.62)',

            '--h-earth-material-shadow':
              'rgba(34, 35, 35, 0.86)'
          })
      }),

    jaggedRock:
      Object.freeze({
        materialKey:
          'jaggedRock',

        className:
          'h-earth-material-jagged-rock',

        surfaceRole:
          'foreground-hazard-rock',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(48, 49, 47, 0.99)',

            '--h-earth-material-mid':
              'rgba(77, 78, 72, 0.94)',

            '--h-earth-material-highlight':
              'rgba(122, 122, 108, 0.58)',

            '--h-earth-material-shadow':
              'rgba(15, 17, 17, 0.92)'
          })
      }),

    water:
      Object.freeze({
        materialKey:
          'water',

        className:
          'h-earth-material-water',

        surfaceRole:
          'middle-distance-water-plane',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(18, 66, 87, 0.96)',

            '--h-earth-material-mid':
              'rgba(34, 105, 127, 0.9)',

            '--h-earth-material-highlight':
              'rgba(125, 184, 193, 0.58)',

            '--h-earth-material-shadow':
              'rgba(5, 31, 48, 0.92)'
          })
      }),

    nearshoreWave:
      Object.freeze({
        materialKey:
          'nearshoreWave',

        className:
          'h-earth-material-nearshore-wave',

        surfaceRole:
          'nearshore-wave-transition',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(34, 102, 119, 0.9)',

            '--h-earth-material-mid':
              'rgba(65, 142, 150, 0.8)',

            '--h-earth-material-highlight':
              'rgba(183, 222, 217, 0.58)',

            '--h-earth-material-shadow':
              'rgba(11, 54, 66, 0.78)'
          })
      }),

    airHaze:
      Object.freeze({
        materialKey:
          'airHaze',

        className:
          'h-earth-material-air-haze',

        surfaceRole:
          'atmospheric-depth',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(117, 146, 155, 0.44)',

            '--h-earth-material-mid':
              'rgba(171, 190, 191, 0.34)',

            '--h-earth-material-highlight':
              'rgba(220, 225, 215, 0.28)',

            '--h-earth-material-shadow':
              'rgba(47, 75, 88, 0.32)'
          })
      }),

    manorContext:
      Object.freeze({
        materialKey:
          'manorContext',

        className:
          'h-earth-material-manor-context',

        surfaceRole:
          'elevated-manor-exterior-context',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(58, 57, 52, 0.98)',

            '--h-earth-material-mid':
              'rgba(96, 89, 76, 0.94)',

            '--h-earth-material-highlight':
              'rgba(171, 151, 119, 0.48)',

            '--h-earth-material-shadow':
              'rgba(17, 19, 21, 0.94)'
          })
      }),

    distantRock:
      Object.freeze({
        materialKey:
          'distantRock',

        className:
          'h-earth-material-distant-rock',

        surfaceRole:
          'offshore-rock-context',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(40, 49, 51, 0.96)',

            '--h-earth-material-mid':
              'rgba(67, 78, 76, 0.86)',

            '--h-earth-material-highlight':
              'rgba(122, 132, 122, 0.4)',

            '--h-earth-material-shadow':
              'rgba(12, 21, 25, 0.9)'
          })
      }),

    inspectionAnchor:
      Object.freeze({
        materialKey:
          'inspectionAnchor',

        className:
          'h-earth-material-inspection-anchor',

        surfaceRole:
          'logical-inspection-anchor',

        cssVariables:
          Object.freeze({
            '--h-earth-material-base':
              'rgba(218, 198, 141, 0.96)',

            '--h-earth-material-mid':
              'rgba(236, 220, 171, 0.9)',

            '--h-earth-material-highlight':
              'rgba(255, 245, 207, 0.96)',

            '--h-earth-material-shadow':
              'rgba(87, 67, 31, 0.72)'
          })
      }),

    none:
      Object.freeze({
        materialKey:
          'none',

        className:
          'h-earth-material-none',

        surfaceRole:
          'non-material-descriptor',

        cssVariables:
          EMPTY_FROZEN_OBJECT
      })
  });

export const H_EARTH_3D_RENDER_NODE_BUDGET =
  Object.freeze({
    maximumLayerContainers:
      15,

    maximumSceneNodes:
      128,

    maximumPrimaryLayerNodes:
      16,

    maximumContextLayerNodes:
      16,

    maximumDetailClusterMembers:
      32,

    maximumOverlayAttachments:
      4,

    currentBaseLayerCountExpected:
      15,

    geometryExpansionFilePresent:
      false,

    externalGeometryExpansionApplied:
      false,

    budgetValidationClaim:
      false,

    claimBoundaryPreserved:
      true
  });

export const H_EARTH_3D_RENDER_INTERNAL_SEAMS =
  Object.freeze({
    materialResolution:
      Object.freeze({
        seamId:
          'H_EARTH_3D_INTERNAL_MATERIAL_RESOLUTION_SEAM',

        currentOwner:
          '/showroom/globe/h-earth/renderer.js',

        futureExtractionFile:
          '/showroom/globe/h-earth/render/materials.js',

        futureFilePresent:
          false,

        extractionRequired:
          false
      }),

    layerConstruction:
      Object.freeze({
        seamId:
          'H_EARTH_3D_INTERNAL_LAYER_CONSTRUCTION_SEAM',

        currentOwner:
          '/showroom/globe/h-earth/renderer.js',

        futureExtractionFile:
          '/showroom/globe/h-earth/render/layers.js',

        futureFilePresent:
          false,

        extractionRequired:
          false
      }),

    nodeConstruction:
      Object.freeze({
        seamId:
          'H_EARTH_3D_INTERNAL_NODE_CONSTRUCTION_SEAM',

        currentOwner:
          '/showroom/globe/h-earth/renderer.js',

        futureExtractionFile:
          '/showroom/globe/h-earth/render/nodes.js',

        futureFilePresent:
          false,

        extractionRequired:
          false
      }),

    primitiveProjection:
      Object.freeze({
        seamId:
          'H_EARTH_3D_INTERNAL_PRIMITIVE_PROJECTION_SEAM',

        currentOwner:
          '/showroom/globe/h-earth/renderer.js',

        futureExtractionFile:
          '/showroom/globe/h-earth/render/geometry.js',

        futureFilePresent:
          false,

        extractionRequired:
          false
      })
  });

export const H_EARTH_3D_RENDER_LAYER_ORDER =
  Object.freeze(
    H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER
      .map((layerId, index) =>
        Object.freeze({
          layerId,

          order:
            H_EARTH_3D_PUBLIC_STAGE_LAYER_DEFINITIONS[
              layerId
            ]?.order ??
            (index + 1) * 10
        })
      )
  );

export function normalizeHEarthRenderNumber(
  value,
  fallback = 0
) {
  const numberValue =
    Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : fallback;
}

export function clampHEarthRenderNumber(
  value,
  min,
  max,
  fallback = min
) {
  const numberValue =
    normalizeHEarthRenderNumber(
      value,
      fallback
    );

  return Math.max(
    min,
    Math.min(max, numberValue)
  );
}

export function normalizeHEarthRenderToken(
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

export function freezeHEarthArray(
  values = []
) {
  return Object.freeze(
    Array.isArray(values)
      ? [...values]
      : []
  );
}

export function uniqueHEarthRenderCodes(
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
      .map((value) => {
        if (
          typeof value === 'string'
        ) {
          return value;
        }

        if (value?.code) {
          return String(value.code);
        }

        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      })
      .filter((value) => {
        if (seen.has(value)) {
          return false;
        }

        seen.add(value);

        return true;
      })
  );
}

export function isValidHEarthMountNode(
  mountNode
) {
  const valid =
    Boolean(
      mountNode &&
      typeof mountNode === 'object' &&
      typeof mountNode.appendChild ===
        'function' &&
      typeof mountNode.querySelectorAll ===
        'function' &&
      mountNode.ownerDocument &&
      typeof mountNode.ownerDocument
        .createElement ===
        'function'
    );

  return Object.freeze({
    valid,

    reason:
      valid
        ? null
        : 'INVALID_H_EARTH_RENDER_MOUNT_NODE'
  });
}

export function resolveHEarthRendererComposition(
  composition =
    H_EARTH_3D_PUBLIC_STAGE_COMPOSITION
) {
  if (
    composition &&
    Array.isArray(
      composition.orderedLayers
    )
  ) {
    return composition;
  }

  const resolved =
    typeof getPublicStageComposition ===
    'function'
      ? getPublicStageComposition()
      : null;

  if (
    resolved &&
    Array.isArray(
      resolved.orderedLayers
    )
  ) {
    return resolved;
  }

  return null;
}

export function validateHEarthPublicStageComposition(
  composition =
    resolveHEarthRendererComposition()
) {
  const failureCodes = [];
  const warningCodes = [];

  const orderedLayers =
    Array.isArray(
      composition?.orderedLayers
    )
      ? composition.orderedLayers
      : [];

  const orderedLayerIds =
    Array.isArray(
      composition?.orderedLayerIds
    )
      ? composition.orderedLayerIds
      : orderedLayers.map(
          (layer) => layer?.layerId
        );

  const uniqueLayerIds =
    new Set(
      orderedLayerIds.filter(Boolean)
    );

  if (!composition) {
    failureCodes.push(
      'PUBLIC_STAGE_COMPOSITION_MISSING'
    );
  }

  if (
    composition?.contractId !==
    H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT
      .contractId
  ) {
    warningCodes.push(
      'PUBLIC_STAGE_COMPOSITION_CONTRACT_ID_DIFFERENT_FROM_IMPORTED_CONTRACT'
    );
  }

  if (
    orderedLayers.length === 0
  ) {
    failureCodes.push(
      'PUBLIC_STAGE_ORDERED_LAYERS_MISSING'
    );
  }

  if (
    orderedLayers.length !==
    H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER
      .length
  ) {
    warningCodes.push(
      'PUBLIC_STAGE_LAYER_COUNT_DIFFERENT_FROM_STEP_034N_EXPECTATION'
    );
  }

  if (
    uniqueLayerIds.size !==
    orderedLayerIds.length
  ) {
    failureCodes.push(
      'PUBLIC_STAGE_LAYER_IDS_NOT_UNIQUE'
    );
  }

  const missingCanonicalLayerIds =
    H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER
      .filter(
        (layerId) =>
          !uniqueLayerIds.has(layerId)
      );

  if (
    missingCanonicalLayerIds.length >
    0
  ) {
    failureCodes.push(
      'PUBLIC_STAGE_CANONICAL_LAYERS_MISSING'
    );
  }

  const landscapeAddressCount =
    normalizeHEarthRenderNumber(
      composition?.landscapeLattice
        ?.addressCount,
      0
    );

  if (
    landscapeAddressCount !== 256
  ) {
    warningCodes.push(
      'LANDSCAPE_ADDRESS_COUNT_NOT_256'
    );
  }

  if (
    composition?.landscapeLattice
      ?.rows14And15ReturnBothProfiles !==
    true
  ) {
    warningCodes.push(
      'LANDSCAPE_SPLIT_ROW_PROFILE_PROOF_NOT_TRUE'
    );
  }

  if (
    composition?.inspectionComposition
      ?.primaryInspectionSurfacePresent !==
    true
  ) {
    failureCodes.push(
      'PRIMARY_INSPECTION_SURFACE_MISSING'
    );
  }

  if (
    composition?.inspectionComposition
      ?.inspectionAnchorPresent !== true
  ) {
    failureCodes.push(
      'INSPECTION_ANCHOR_MISSING'
    );
  }

  if (
    composition?.rendererIndependent !==
    true
  ) {
    failureCodes.push(
      'COMPOSITION_NOT_RENDERER_INDEPENDENT'
    );
  }

  if (
    composition?.legacyRendererSceneConsumed ===
    true
  ) {
    failureCodes.push(
      'LEGACY_RENDERER_SCENE_CONSUMED'
    );
  }

  return Object.freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_VALIDATION_RECEIPT',

    valid:
      failureCodes.length === 0,

    compositionPresent:
      Boolean(composition),

    contractId:
      composition?.contractId || null,

    orderedLayerCount:
      orderedLayers.length,

    expectedOrderedLayerCount:
      H_EARTH_3D_PUBLIC_STAGE_LAYER_ORDER
        .length,

    orderedLayerIds:
      Object.freeze(
        orderedLayerIds.filter(Boolean)
      ),

    uniqueLayerCount:
      uniqueLayerIds.size,

    missingCanonicalLayerIds:
      Object.freeze(
        missingCanonicalLayerIds
      ),

    landscapeAddressCount,

    landscapeAddressCountMatchesExpected:
      landscapeAddressCount === 256,

    rows14And15ReturnBothProfiles:
      composition?.landscapeLattice
        ?.rows14And15ReturnBothProfiles ===
      true,

    primaryInspectionSurfacePresent:
      composition?.inspectionComposition
        ?.primaryInspectionSurfacePresent ===
      true,

    inspectionAnchorPresent:
      composition?.inspectionComposition
        ?.inspectionAnchorPresent === true,

    rendererIndependent:
      composition?.rendererIndependent ===
      true,

    legacyRendererSceneConsumed:
      composition?.legacyRendererSceneConsumed ===
      true,

    warningCodes:
      uniqueHEarthRenderCodes(
        warningCodes
      ),

    failureCodes:
      uniqueHEarthRenderCodes(
        failureCodes
      ),

    runtimeProof:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function resolveHEarthMaterialToken(
  materialKey
) {
  const normalizedKey =
    String(materialKey || 'none');

  const token =
    H_EARTH_3D_RENDER_MATERIAL_TOKENS[
      normalizedKey
    ] ||
    H_EARTH_3D_RENDER_MATERIAL_TOKENS.none;

  return Object.freeze({
    ...token,

    requestedMaterialKey:
      normalizedKey,

    resolved:
      Boolean(
        H_EARTH_3D_RENDER_MATERIAL_TOKENS[
          normalizedKey
        ]
      ),

    fallbackUsed:
      !Boolean(
        H_EARTH_3D_RENDER_MATERIAL_TOKENS[
          normalizedKey
        ]
      ),

    internalMaterialResolution:
      true,

    externalMaterialFileUsed:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function applyHEarthMaterialToken(
  element,
  materialToken
) {
  if (
    !element ||
    !materialToken
  ) {
    return false;
  }

  if (
    materialToken.className
  ) {
    element.classList.add(
      materialToken.className
    );
  }

  const cssVariables =
    materialToken.cssVariables ||
    EMPTY_FROZEN_OBJECT;

  Object.entries(
    cssVariables
  ).forEach(
    ([property, value]) => {
      element.style.setProperty(
        property,
        String(value)
      );
    }
  );

  element.setAttribute(
    'data-h-earth-material-key',
    String(
      materialToken.materialKey ||
      'none'
    )
  );

  element.setAttribute(
    'data-h-earth-material-fallback',
    materialToken.fallbackUsed === true
      ? 'true'
      : 'false'
  );

  return true;
}

export function resolveHEarthLayerProjection(
  layer = EMPTY_FROZEN_OBJECT,
  layerIndex = 0
) {
  const layerId =
    layer.layerId ||
    `UNRESOLVED_LAYER_${layerIndex}`;

  const depth =
    layer.depth ||
    EMPTY_FROZEN_OBJECT;

  const normalizedDepth =
    clampHEarthRenderNumber(
      depth.normalizedDepth,
      0,
      1,
      0.5
    );

  const projection =
    H_EARTH_3D_RENDER_PROJECTION_MODEL
      .layerProjection;

  const presets =
    Object.freeze({
      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .sky]:
        Object.freeze({
          topPercent:
            projection.skyTopPercent,

          leftPercent:
            0,

          widthPercent:
            100,

          heightPercent:
            58,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            -520,

          rotateXDeg:
            0,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .airHaze]:
        Object.freeze({
          topPercent:
            14,

          leftPercent:
            0,

          widthPercent:
            100,

          heightPercent:
            42,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            -450,

          rotateXDeg:
            0,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .horizon]:
        Object.freeze({
          topPercent:
            projection.horizonPercent,

          leftPercent:
            -5,

          widthPercent:
            110,

          heightPercent:
            6,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            -360,

          rotateXDeg:
            0,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .offshoreIslets]:
        Object.freeze({
          topPercent:
            projection.offshoreTopPercent,

          leftPercent:
            4,

          widthPercent:
            38,

          heightPercent:
            18,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            -275,

          rotateXDeg:
            0,

          rotateYDeg:
            -4,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .manorBluff]:
        Object.freeze({
          topPercent:
            projection.manorTopPercent,

          leftPercent:
            57,

          widthPercent:
            38,

          heightPercent:
            30,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            -220,

          rotateXDeg:
            0,

          rotateYDeg:
            5,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .waterPlane]:
        Object.freeze({
          topPercent:
            projection.waterTopPercent,

          leftPercent:
            -8,

          widthPercent:
            116,

          heightPercent:
            42,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            -135,

          rotateXDeg:
            69,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .nearshoreWave]:
        Object.freeze({
          topPercent:
            54,

          leftPercent:
            -6,

          widthPercent:
            112,

          heightPercent:
            18,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            -70,

          rotateXDeg:
            67,

          rotateYDeg:
            0,

          rotateZDeg:
            -1,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .foamLine]:
        Object.freeze({
          topPercent:
            projection.shorelineTopPercent,

          leftPercent:
            -4,

          widthPercent:
            108,

          heightPercent:
            11,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            -15,

          rotateXDeg:
            66,

          rotateYDeg:
            0,

          rotateZDeg:
            -1,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .drySand]:
        Object.freeze({
          topPercent:
            61,

          leftPercent:
            -7,

          widthPercent:
            114,

          heightPercent:
            27,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            45,

          rotateXDeg:
            64,

          rotateYDeg:
            0,

          rotateZDeg:
            -1,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .wetSand]:
        Object.freeze({
          topPercent:
            68,

          leftPercent:
            -12,

          widthPercent:
            124,

          heightPercent:
            44,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            110,

          rotateXDeg:
            62,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .tidePools]:
        Object.freeze({
          topPercent:
            70,

          leftPercent:
            10,

          widthPercent:
            70,

          heightPercent:
            24,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            180,

          rotateXDeg:
            59,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .stones]:
        Object.freeze({
          topPercent:
            73,

          leftPercent:
            7,

          widthPercent:
            86,

          heightPercent:
            25,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            240,

          rotateXDeg:
            56,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .jaggedRocks]:
        Object.freeze({
          topPercent:
            67,

          leftPercent:
            0,

          widthPercent:
            100,

          heightPercent:
            35,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            300,

          rotateXDeg:
            0,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .inspectionAnchor]:
        Object.freeze({
          topPercent:
            79,

          leftPercent:
            50,

          widthPercent:
            8,

          heightPercent:
            8,

          translateXPercent:
            -50,

          translateYPx:
            0,

          translateZPx:
            370,

          rotateXDeg:
            0,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        }),

      [H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
        .overlayAttachment]:
        Object.freeze({
          topPercent:
            0,

          leftPercent:
            0,

          widthPercent:
            100,

          heightPercent:
            100,

          translateXPercent:
            0,

          translateYPx:
            0,

          translateZPx:
            500,

          rotateXDeg:
            0,

          rotateYDeg:
            0,

          rotateZDeg:
            0,

          scaleX:
            1,

          scaleY:
            1,

          scaleZ:
            1
        })
    });

  const preset =
    presets[layerId] ||
    Object.freeze({
      topPercent:
        50,

      leftPercent:
        0,

      widthPercent:
        100,

      heightPercent:
        20,

      translateXPercent:
        0,

      translateYPx:
        0,

      translateZPx:
        Math.round(
          (1 - normalizedDepth) *
          H_EARTH_3D_RENDER_PROJECTION_MODEL
            .scene.sceneDepthPx
        ),

      rotateXDeg:
        0,

      rotateYDeg:
        0,

      rotateZDeg:
        0,

      scaleX:
        1,

      scaleY:
        1,

      scaleZ:
        1
    });

  return Object.freeze({
    layerId,

    normalizedDepth,

    ...preset,

    cssTransform:
      [
        `translate3d(${preset.translateXPercent}%, ${preset.translateYPx}px, ${preset.translateZPx}px)`,
        `rotateX(${preset.rotateXDeg}deg)`,
        `rotateY(${preset.rotateYDeg}deg)`,
        `rotateZ(${preset.rotateZDeg}deg)`,
        `scale3d(${preset.scaleX}, ${preset.scaleY}, ${preset.scaleZ})`
      ].join(' '),

    descriptorOnly:
      true,

    finalProjectionValidationClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false
  });
}

export function resolveHEarthPrimitiveProfile(
  layer = EMPTY_FROZEN_OBJECT
) {
  const primitiveIntent =
    layer.primitiveIntent ||
    'unresolvedPrimitive';

  const profiles =
    Object.freeze({
      skyVolume:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_SKY_VOLUME',

          nodeCount:
            1,

          elementClass:
            'h-earth-render-sky-volume',

          borderRadius:
            '0',

          clipPath:
            'none'
        }),

      atmosphericLayer:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_ATMOSPHERIC_LAYER',

          nodeCount:
            2,

          elementClass:
            'h-earth-render-atmospheric-layer',

          borderRadius:
            '48%',

          clipPath:
            'none'
        }),

      horizonBand:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_HORIZON_BAND',

          nodeCount:
            1,

          elementClass:
            'h-earth-render-horizon-band',

          borderRadius:
            '50%',

          clipPath:
            'none'
        }),

      offshoreDistantCluster:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_OFFSHORE_CLUSTER',

          nodeCount:
            7,

          elementClass:
            'h-earth-render-offshore-rock',

          borderRadius:
            '42% 55% 38% 62%',

          clipPath:
            'polygon(12% 100%, 20% 54%, 34% 43%, 43% 15%, 58% 38%, 72% 27%, 88% 100%)'
        }),

      elevatedArchitecturalCluster:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_MANOR_BLUFF_CLUSTER',

          nodeCount:
            4,

          elementClass:
            'h-earth-render-manor-context',

          borderRadius:
            '6px',

          clipPath:
            'none'
        }),

      waterPlane:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_WATER_PLANE',

          nodeCount:
            3,

          elementClass:
            'h-earth-render-water-plane',

          borderRadius:
            '50% 50% 12% 12%',

          clipPath:
            'none'
        }),

      waterDepthBand:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_NEARSHORE_WAVE_BAND',

          nodeCount:
            4,

          elementClass:
            'h-earth-render-nearshore-wave',

          borderRadius:
            '50%',

          clipPath:
            'none'
        }),

      irregularShorelineBand:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_FOAM_LINE',

          nodeCount:
            6,

          elementClass:
            'h-earth-render-foam-segment',

          borderRadius:
            '50%',

          clipPath:
            'none'
        }),

      terrainBand:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_DRY_SAND_BAND',

          nodeCount:
            2,

          elementClass:
            'h-earth-render-dry-sand-band',

          borderRadius:
            '50% 50% 0 0',

          clipPath:
            'none'
        }),

      contouredTerrainBand:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_WET_SAND_FOREGROUND',

          nodeCount:
            3,

          elementClass:
            'h-earth-render-wet-sand-band',

          borderRadius:
            '48% 52% 0 0',

          clipPath:
            'none'
        }),

      surfacePoolCluster:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_TIDE_POOL_CLUSTER',

          nodeCount:
            8,

          elementClass:
            'h-earth-render-tide-pool',

          borderRadius:
            '58% 42% 63% 37%',

          clipPath:
            'none'
        }),

      smallStoneCluster:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_SMALL_STONE_CLUSTER',

          nodeCount:
            18,

          elementClass:
            'h-earth-render-small-stone',

          borderRadius:
            '46% 54% 42% 58%',

          clipPath:
            'none'
        }),

      jaggedRockCluster:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_JAGGED_ROCK_CLUSTER',

          nodeCount:
            9,

          elementClass:
            'h-earth-render-jagged-rock',

          borderRadius:
            '14%',

          clipPath:
            'polygon(8% 100%, 18% 45%, 35% 62%, 47% 8%, 61% 47%, 78% 22%, 92% 100%)'
        }),

      logicalAnchor:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_INSPECTION_ANCHOR',

          nodeCount:
            1,

          elementClass:
            'h-earth-render-inspection-anchor',

          borderRadius:
            '50%',

          clipPath:
            'none'
        }),

      screenSpaceAttachment:
        Object.freeze({
          profileId:
            'PUBLIC_STAGE_OVERLAY_ATTACHMENT',

          nodeCount:
            0,

          elementClass:
            'h-earth-render-overlay-attachment',

          borderRadius:
            '0',

          clipPath:
            'none'
        })
    });

  return (
    profiles[primitiveIntent] ||
    Object.freeze({
      profileId:
        'PUBLIC_STAGE_UNRESOLVED_PRIMITIVE',

      nodeCount:
        1,

      elementClass:
        'h-earth-render-unresolved-primitive',

      borderRadius:
        '0',

      clipPath:
        'none'
    })
  );
}

export function deterministicHEarthFraction(
  seed,
  index,
  salt = 0
) {
  const seedText =
    `${seed}:${index}:${salt}`;

  let hash =
    2166136261;

  for (
    let characterIndex = 0;
    characterIndex <
      seedText.length;
    characterIndex += 1
  ) {
    hash ^=
      seedText.charCodeAt(
        characterIndex
      );

    hash =
      Math.imul(
        hash,
        16777619
      );
  }

  return (
    (hash >>> 0) /
    4294967295
  );
}

export function resolveHEarthPrimitiveMemberLayout({
  layer,
  profile,
  memberIndex,
  memberCount
} = {}) {
  const layerId =
    layer?.layerId ||
    'UNRESOLVED_LAYER';

  const fractionA =
    deterministicHEarthFraction(
      layerId,
      memberIndex,
      1
    );

  const fractionB =
    deterministicHEarthFraction(
      layerId,
      memberIndex,
      2
    );

  const fractionC =
    deterministicHEarthFraction(
      layerId,
      memberIndex,
      3
    );

  const fractionD =
    deterministicHEarthFraction(
      layerId,
      memberIndex,
      4
    );

  const normalizedIndex =
    memberCount <= 1
      ? 0.5
      : memberIndex /
        (memberCount - 1);

  const primitiveIntent =
    layer?.primitiveIntent ||
    'unresolvedPrimitive';

  const base =
    {
      leftPercent:
        normalizedIndex * 100,

      topPercent:
        50,

      widthPercent:
        16,

      heightPercent:
        16,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      translateZPx:
        memberIndex * 2,

      rotateXDeg:
        0,

      rotateYDeg:
        0,

      rotateZDeg:
        (fractionA - 0.5) * 8,

      scale:
        0.8 +
        fractionB * 0.4,

      opacity:
        0.78 +
        fractionC * 0.22
    };

  if (
    primitiveIntent ===
    'skyVolume'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        0,

      topPercent:
        0,

      widthPercent:
        100,

      heightPercent:
        100,

      translateXPercent:
        0,

      translateYPercent:
        0,

      scale:
        1,

      opacity:
        1
    });
  }

  if (
    primitiveIntent ===
    'atmosphericLayer'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        50,

      topPercent:
        memberIndex === 0
          ? 36
          : 62,

      widthPercent:
        116,

      heightPercent:
        memberIndex === 0
          ? 72
          : 46,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      scale:
        1,

      opacity:
        memberIndex === 0
          ? 0.64
          : 0.42
    });
  }

  if (
    primitiveIntent ===
    'horizonBand'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        50,

      topPercent:
        50,

      widthPercent:
        110,

      heightPercent:
        100,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      scale:
        1,

      opacity:
        0.88
    });
  }

  if (
    primitiveIntent ===
    'offshoreDistantCluster'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        4 +
        normalizedIndex * 92,

      topPercent:
        66 -
        fractionA * 38,

      widthPercent:
        8 +
        fractionB * 11,

      heightPercent:
        30 +
        fractionC * 55,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      translateZPx:
        memberIndex * 3,

      rotateZDeg:
        (fractionD - 0.5) * 10,

      scale:
        0.72 +
        fractionB * 0.52,

      opacity:
        0.62 +
        fractionC * 0.28
    });
  }

  if (
    primitiveIntent ===
    'elevatedArchitecturalCluster'
  ) {
    if (memberIndex === 0) {
      return Object.freeze({
        ...base,

        leftPercent:
          50,

        topPercent:
          72,

        widthPercent:
          100,

        heightPercent:
          42,

        translateXPercent:
          -50,

        translateYPercent:
          -50,

        rotateZDeg:
          -2,

        scale:
          1,

        opacity:
          0.96,

        memberRole:
          'manor-bluff'
      });
    }

    if (memberIndex === 1) {
      return Object.freeze({
        ...base,

        leftPercent:
          50,

        topPercent:
          43,

        widthPercent:
          58,

        heightPercent:
          42,

        translateXPercent:
          -50,

        translateYPercent:
          -50,

        rotateZDeg:
          0,

        scale:
          1,

        opacity:
          0.98,

        memberRole:
          'manor-main-body'
      });
    }

    if (memberIndex === 2) {
      return Object.freeze({
        ...base,

        leftPercent:
          34,

        topPercent:
          26,

        widthPercent:
          18,

        heightPercent:
          38,

        translateXPercent:
          -50,

        translateYPercent:
          -50,

        scale:
          1,

        opacity:
          0.96,

        memberRole:
          'manor-west-tower'
      });
    }

    return Object.freeze({
      ...base,

      leftPercent:
        67,

      topPercent:
        29,

      widthPercent:
        17,

      heightPercent:
        34,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      scale:
        1,

      opacity:
        0.96,

      memberRole:
        'manor-east-tower'
    });
  }

  if (
    primitiveIntent ===
    'waterPlane'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        50,

      topPercent:
        38 +
        memberIndex * 20,

      widthPercent:
        118 -
        memberIndex * 8,

      heightPercent:
        52 -
        memberIndex * 8,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      translateZPx:
        memberIndex * 14,

      rotateZDeg:
        memberIndex % 2 === 0
          ? -0.7
          : 0.7,

      scale:
        1,

      opacity:
        0.84 -
        memberIndex * 0.1
    });
  }

  if (
    primitiveIntent ===
    'waterDepthBand'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        8 +
        normalizedIndex * 84,

      topPercent:
        42 +
        fractionA * 18,

      widthPercent:
        30 +
        fractionB * 28,

      heightPercent:
        22 +
        fractionC * 16,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      rotateZDeg:
        (fractionD - 0.5) * 5,

      scale:
        0.84 +
        fractionB * 0.28,

      opacity:
        0.64 +
        fractionC * 0.24
    });
  }

  if (
    primitiveIntent ===
    'irregularShorelineBand'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        normalizedIndex * 104 -
        2,

      topPercent:
        42 +
        Math.sin(
          normalizedIndex *
          Math.PI *
          2
        ) * 16,

      widthPercent:
        24 +
        fractionB * 22,

      heightPercent:
        32 +
        fractionC * 22,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      rotateZDeg:
        (fractionD - 0.5) * 10,

      scale:
        0.8 +
        fractionB * 0.34,

      opacity:
        0.76 +
        fractionC * 0.2
    });
  }

  if (
    primitiveIntent ===
    'terrainBand' ||
    primitiveIntent ===
    'contouredTerrainBand'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        50,

      topPercent:
        memberIndex === 0
          ? 43
          : memberIndex === 1
            ? 64
            : 78,

      widthPercent:
        primitiveIntent ===
        'contouredTerrainBand'
          ? 126 -
            memberIndex * 7
          : 116 -
            memberIndex * 8,

      heightPercent:
        primitiveIntent ===
        'contouredTerrainBand'
          ? 92 -
            memberIndex * 16
          : 72 -
            memberIndex * 12,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      translateZPx:
        memberIndex * 22,

      rotateZDeg:
        memberIndex % 2 === 0
          ? -1.1
          : 1.1,

      scale:
        1,

      opacity:
        0.96 -
        memberIndex * 0.08
    });
  }

  if (
    primitiveIntent ===
    'surfacePoolCluster'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        9 +
        fractionA * 82,

      topPercent:
        16 +
        fractionB * 70,

      widthPercent:
        9 +
        fractionC * 18,

      heightPercent:
        7 +
        fractionD * 12,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      rotateZDeg:
        (fractionA - 0.5) * 28,

      scale:
        0.8 +
        fractionB * 0.4,

      opacity:
        0.58 +
        fractionC * 0.32
    });
  }

  if (
    primitiveIntent ===
    'smallStoneCluster'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        4 +
        fractionA * 92,

      topPercent:
        10 +
        fractionB * 82,

      widthPercent:
        1.1 +
        fractionC * 3.7,

      heightPercent:
        1.1 +
        fractionD * 3.1,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      translateZPx:
        20 +
        memberIndex,

      rotateZDeg:
        fractionA * 180,

      scale:
        0.72 +
        fractionB * 0.7,

      opacity:
        0.76 +
        fractionC * 0.22
    });
  }

  if (
    primitiveIntent ===
    'jaggedRockCluster'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        2 +
        fractionA * 96,

      topPercent:
        28 +
        fractionB * 66,

      widthPercent:
        5 +
        fractionC * 10,

      heightPercent:
        14 +
        fractionD * 32,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      translateZPx:
        45 +
        memberIndex * 3,

      rotateZDeg:
        (fractionA - 0.5) * 24,

      scale:
        0.76 +
        fractionB * 0.58,

      opacity:
        0.84 +
        fractionC * 0.14
    });
  }

  if (
    primitiveIntent ===
    'logicalAnchor'
  ) {
    return Object.freeze({
      ...base,

      leftPercent:
        50,

      topPercent:
        50,

      widthPercent:
        100,

      heightPercent:
        100,

      translateXPercent:
        -50,

      translateYPercent:
        -50,

      scale:
        1,

      opacity:
        1
    });
  }

  return Object.freeze(base);
}

export function resolveHEarthPublicStageLayerDescriptor(
  layer,
  layerIndex
) {
  const projection =
    resolveHEarthLayerProjection(
      layer,
      layerIndex
    );

  const material =
    resolveHEarthMaterialToken(
      layer?.materialKey
    );

  const primitiveProfile =
    resolveHEarthPrimitiveProfile(
      layer
    );

  const requestedNodeCount =
    clampHEarthRenderNumber(
      primitiveProfile.nodeCount,
      0,
      H_EARTH_3D_RENDER_NODE_BUDGET
        .maximumDetailClusterMembers,
      0
    );

  const memberDescriptors =
    Object.freeze(
      Array.from(
        {
          length:
            requestedNodeCount
        },
        (_, memberIndex) =>
          Object.freeze({
            memberId:
              `${layer.layerId}-member-${String(
                memberIndex + 1
              ).padStart(2, '0')}`,

            memberIndex,

            memberCount:
              requestedNodeCount,

            layout:
              resolveHEarthPrimitiveMemberLayout({
                layer,
                profile:
                  primitiveProfile,

                memberIndex,

                memberCount:
                  requestedNodeCount
              })
          })
      )
    );

  return Object.freeze({
    descriptorId:
      `H_EARTH_3D_RENDER_DESCRIPTOR_${layer.layerId}`,

    layerId:
      layer.layerId,

    layerIndex,

    order:
      layer.order,

    label:
      layer.label,

    role:
      layer.role,

    regionId:
      layer.regionId,

    primaryZoneId:
      layer.primaryZoneId,

    secondaryZoneId:
      layer.secondaryZoneId,

    objectIds:
      freezeHEarthArray(
        layer.objectIds
      ),

    surfaceFamily:
      layer.surfaceFamily,

    materialKey:
      layer.materialKey,

    primitiveIntent:
      layer.primitiveIntent,

    worldGeometryRole:
      layer.worldGeometryRole,

    inspectionRole:
      layer.inspectionRole,

    publicStageReadable:
      layer.publicStageReadable ===
      true,

    rendererMayCreateGeometry:
      layer.rendererMayCreateGeometry ===
      true,

    sourceBinding:
      layer.sourceBinding || null,

    sourceAddressCount:
      normalizeHEarthRenderNumber(
        layer.sourceAddressCount,
        0
      ),

    sourceObjectCount:
      normalizeHEarthRenderNumber(
        layer.sourceObjectCount,
        0
      ),

    depth:
      layer.depth ||
      H_EARTH_3D_PUBLIC_STAGE_DEPTH_BANDS
        .foreground,

    projection,

    material,

    primitiveProfile,

    memberDescriptors,

    memberCount:
      memberDescriptors.length,

    descriptorOnly:
      true,

    externalGeometryPortUsed:
      false,

    internalPrimitiveProjectionUsed:
      true,

    finalGeometryClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function resolveHEarthPublicStageRenderInput({
  composition =
    resolveHEarthRendererComposition()
} = {}) {
  const validation =
    validateHEarthPublicStageComposition(
      composition
    );

  const layers =
    validation.valid &&
    Array.isArray(
      composition?.orderedLayers
    )
      ? composition.orderedLayers
      : [];

  const descriptors =
    Object.freeze(
      layers.map(
        (
          layer,
          layerIndex
        ) =>
          resolveHEarthPublicStageLayerDescriptor(
            layer,
            layerIndex
          )
      )
    );

  const sceneNodeCount =
    descriptors.reduce(
      (
        total,
        descriptor
      ) =>
        total +
        descriptor.memberCount,
      0
    );

  const budgetExceeded =
    sceneNodeCount >
    H_EARTH_3D_RENDER_NODE_BUDGET
      .maximumSceneNodes;

  return Object.freeze({
    inputId:
      'H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT',

    source:
      'H_EARTH_3D_PUBLIC_STAGE_COMPOSITION',

    sourceDescriptorType:
      'PUBLIC_STAGE_COMPOSITION_DESCRIPTOR',

    contractId:
      H_EARTH_3D_RENDERER_CONTRACT
        .contractId,

    compositorContractId:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT
        .contractId,

    composition,

    compositionValidation:
      validation,

    descriptors,

    descriptorCount:
      descriptors.length,

    layerCount:
      descriptors.length,

    sceneNodeCount,

    maximumSceneNodes:
      H_EARTH_3D_RENDER_NODE_BUDGET
        .maximumSceneNodes,

    budgetExceeded,

    accepted:
      validation.valid &&
      !budgetExceeded,

    missingInput:
      !composition,

    compositorAuthorityConsumed:
      true,

    legacyCandidateSceneUsed:
      false,

    legacyEnvironmentSceneUsed:
      false,

    staticSupportPortImports:
      false,

    externalGeometryPortUsed:
      false,

    externalNodeFactoryUsed:
      false,

    externalMaterialPortUsed:
      false,

    externalLayerPortUsed:
      false,

    internalPrimitiveProjectionUsed:
      true,

    internalNodeConstructionUsed:
      true,

    internalMaterialResolutionUsed:
      true,

    internalLayerConstructionUsed:
      true,

    warningCodes:
      uniqueHEarthRenderCodes([
        ...validation.warningCodes,

        ...(budgetExceeded
          ? [
              'PUBLIC_STAGE_RENDER_NODE_BUDGET_EXCEEDED'
            ]
          : [])
      ]),

    failureCodes:
      uniqueHEarthRenderCodes([
        ...validation.failureCodes,

        ...(budgetExceeded
          ? [
              'PUBLIC_STAGE_RENDER_INPUT_REJECTED_FOR_NODE_BUDGET'
            ]
          : [])
      ]),

    claimBoundaryPreserved:
      true
  });
}

export function selectHEarthRenderInput({
  composition =
    H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,

  composedCandidateFrame =
    null,

  candidateRenderScene =
    null
} = {}) {
  const currentComposition =
    resolveHEarthRendererComposition(
      composition ||
      composedCandidateFrame
    );

  const input =
    resolveHEarthPublicStageRenderInput({
      composition:
        currentComposition
    });

  return Object.freeze({
    ...input,

    usedPublicStageComposition:
      true,

    usedComposedFrame:
      Boolean(
        composedCandidateFrame &&
        composedCandidateFrame ===
          currentComposition
      ),

    usedRenderSceneFallback:
      false,

    candidateRenderSceneIgnored:
      Boolean(
        candidateRenderScene
      ),

    candidateRenderSceneFallbackAllowed:
      false,

    source:
      'publicStageComposition.orderedLayers',

    sourceDescriptorType:
      'PUBLIC_STAGE_COMPOSITION_DESCRIPTOR'
  });
}

export function createHEarthRenderRootNode({
  mountNode,
  receiptId,
  composition,
  options =
    EMPTY_FROZEN_OBJECT
} = {}) {
  const validation =
    isValidHEarthMountNode(
      mountNode
    );

  if (!validation.valid) {
    return Object.freeze({
      created:
        false,

      rootNode:
        null,

      failureCode:
        validation.reason,

      claimBoundaryPreserved:
        true
    });
  }

  const documentRef =
    mountNode.ownerDocument;

  const rootNode =
    documentRef.createElement(
      'div'
    );

  rootNode.className =
    [
      'h-earth-render-root',
      'h-earth-public-stage-render-root',
      'h-earth-render-step-034o'
    ].join(' ');

  rootNode.setAttribute(
    H_EARTH_RENDER_OWNERSHIP_ATTRIBUTE,
    'true'
  );

  rootNode.setAttribute(
    H_EARTH_RENDER_ROOT_ATTRIBUTE,
    'true'
  );

  rootNode.setAttribute(
    'data-h-earth-render-receipt-id',
    String(
      receiptId ||
      'H_EARTH_3D_RENDERER_MOUNT'
    )
  );

  rootNode.setAttribute(
    'data-h-earth-render-contract-id',
    H_EARTH_3D_RENDERER_CONTRACT
      .contractId
  );

  rootNode.setAttribute(
    'data-h-earth-compositor-contract-id',
    H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT
      .contractId
  );

  rootNode.setAttribute(
    'data-h-earth-active-cell',
    String(
      composition?.activeCell ||
      'H_EARTH_GROUND_CELL_001'
    )
  );

  rootNode.setAttribute(
    'data-h-earth-scene-identity',
    String(
      composition?.sceneIdentity ||
      'earth-water-air-survival-shoreline-manor'
    )
  );

  rootNode.setAttribute(
    'aria-label',
    String(
      options?.ariaLabel ||
      'H-Earth Ground Cell 001 shoreline scene'
    )
  );

  rootNode.setAttribute(
    'role',
    'img'
  );

  rootNode.style.position =
    'absolute';

  rootNode.style.inset =
    '0';

  rootNode.style.width =
    '100%';

  rootNode.style.height =
    '100%';

  rootNode.style.overflow =
    'hidden';

  rootNode.style.transformStyle =
    'preserve-3d';

  rootNode.style.perspective =
    `${H_EARTH_3D_RENDER_PROJECTION_MODEL.scene.perspectivePx}px`;

  rootNode.style.perspectiveOrigin =
    `${H_EARTH_3D_RENDER_PROJECTION_MODEL.scene.cameraOriginX}% ${H_EARTH_3D_RENDER_PROJECTION_MODEL.scene.cameraOriginY}%`;

  rootNode.style.isolation =
    'isolate';

  rootNode.style.pointerEvents =
    'auto';

  rootNode.style.background =
    'linear-gradient(180deg, rgba(82, 116, 132, 1) 0%, rgba(116, 145, 148, 1) 36%, rgba(29, 73, 91, 1) 50%, rgba(20, 54, 70, 1) 61%, rgba(76, 69, 55, 1) 100%)';

  return Object.freeze({
    created:
      true,

    rootNode,

    receiptId,

    failureCode:
      null,

    claimBoundaryPreserved:
      true
  });
}

export function createHEarthLayerContainers({
  renderRoot,
  descriptors =
    EMPTY_FROZEN_ARRAY
} = {}) {
  if (
    !renderRoot ||
    typeof renderRoot.appendChild !==
      'function'
  ) {
    return Object.freeze({
      created:
        false,

      layerContainersById:
        Object.freeze({}),

      layerCount:
        0,

      failureCodes:
        Object.freeze([
          'INVALID_RENDER_ROOT_FOR_LAYER_CONTAINERS'
        ]),

      warningCodes:
        EMPTY_FROZEN_ARRAY,

      claimBoundaryPreserved:
        true
    });
  }

  const documentRef =
    renderRoot.ownerDocument;

  const layerContainersById =
    {};

  const warningCodes = [];

  descriptors.forEach(
    (
      descriptor,
      descriptorIndex
    ) => {
      const layerNode =
        documentRef.createElement(
          'div'
        );

      const layerToken =
        normalizeHEarthRenderToken(
          descriptor.layerId
        );

      layerNode.className =
        [
          'h-earth-render-layer',
          `h-earth-render-layer-${layerToken}`,
          `h-earth-layer-role-${normalizeHEarthRenderToken(
            descriptor.role
          )}`,
          `h-earth-layer-primitive-${normalizeHEarthRenderToken(
            descriptor.primitiveIntent
          )}`
        ].join(' ');

      layerNode.setAttribute(
        H_EARTH_RENDER_OWNERSHIP_ATTRIBUTE,
        'true'
      );

      layerNode.setAttribute(
        H_EARTH_RENDER_LAYER_ATTRIBUTE,
        descriptor.layerId
      );

      layerNode.setAttribute(
        'data-h-earth-layer-order',
        String(
          descriptor.order
        )
      );

      layerNode.setAttribute(
        'data-h-earth-layer-index',
        String(
          descriptorIndex
        )
      );

      layerNode.setAttribute(
        'data-h-earth-primary-zone-id',
        String(
          descriptor.primaryZoneId ||
          ''
        )
      );

      layerNode.setAttribute(
        'data-h-earth-secondary-zone-id',
        String(
          descriptor.secondaryZoneId ||
          ''
        )
      );

      layerNode.setAttribute(
        'data-h-earth-region-id',
        String(
          descriptor.regionId ||
          ''
        )
      );

      layerNode.setAttribute(
        'data-h-earth-surface-family',
        String(
          descriptor.surfaceFamily ||
          ''
        )
      );

      layerNode.setAttribute(
        'data-h-earth-world-geometry-role',
        String(
          descriptor.worldGeometryRole ||
          ''
        )
      );

      layerNode.setAttribute(
        'data-h-earth-inspection-role',
        String(
          descriptor.inspectionRole ||
          ''
        )
      );

      layerNode.setAttribute(
        'aria-hidden',
        descriptor.publicStageReadable ===
        true
          ? 'false'
          : 'true'
      );

      layerNode.style.position =
        'absolute';

      layerNode.style.left =
        `${descriptor.projection.leftPercent}%`;

      layerNode.style.top =
        `${descriptor.projection.topPercent}%`;

      layerNode.style.width =
        `${descriptor.projection.widthPercent}%`;

      layerNode.style.height =
        `${descriptor.projection.heightPercent}%`;

      layerNode.style.transform =
        descriptor.projection.cssTransform;

      layerNode.style.transformOrigin =
        '50% 50%';

      layerNode.style.transformStyle =
        'preserve-3d';

      layerNode.style.zIndex =
        String(
          descriptor.order
        );

      layerNode.style.pointerEvents =
        descriptor.layerId ===
        H_EARTH_3D_PUBLIC_STAGE_LAYER_IDS
          .overlayAttachment
          ? 'none'
          : 'auto';

      layerNode.style.overflow =
        'visible';

      renderRoot.appendChild(
        layerNode
      );

      if (
        layerContainersById[
          descriptor.layerId
        ]
      ) {
        warningCodes.push(
          'DUPLICATE_LAYER_CONTAINER_ID'
        );
      }

      layerContainersById[
        descriptor.layerId
      ] =
        layerNode;
    }
  );

  return Object.freeze({
    created:
      Object.keys(
        layerContainersById
      ).length >
      0,

    layerContainersById:
      Object.freeze({
        ...layerContainersById
      }),

    layerCount:
      Object.keys(
        layerContainersById
      ).length,

    failureCodes:
      EMPTY_FROZEN_ARRAY,

    warningCodes:
      uniqueHEarthRenderCodes(
        warningCodes
      ),

    internalLayerConstructionUsed:
      true,

    externalLayerFileUsed:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function resolveHEarthMemberClassNames(
  descriptor,
  memberDescriptor
) {
  return Object.freeze([
    'h-earth-render-node',

    descriptor.primitiveProfile
      .elementClass,

    descriptor.material
      .className,

    `h-earth-render-node-${normalizeHEarthRenderToken(
      memberDescriptor.memberId
    )}`,

    `h-earth-layer-member-${normalizeHEarthRenderToken(
      descriptor.layerId
    )}`,

    `h-earth-object-family-${normalizeHEarthRenderToken(
      descriptor.objectIds[0] ||
      'none'
    )}`,

    `h-earth-zone-${normalizeHEarthRenderToken(
      descriptor.primaryZoneId ||
      'none'
    )}`,

    `h-earth-region-${normalizeHEarthRenderToken(
      descriptor.regionId ||
      'none'
    )}`
  ]);
}

export function applyHEarthPrimitiveMemberStyles(
  node,
  descriptor,
  memberDescriptor
) {
  if (
    !node ||
    !descriptor ||
    !memberDescriptor
  ) {
    return false;
  }

  const layout =
    memberDescriptor.layout;

  node.style.position =
    'absolute';

  node.style.left =
    `${layout.leftPercent}%`;

  node.style.top =
    `${layout.topPercent}%`;

  node.style.width =
    `${layout.widthPercent}%`;

  node.style.height =
    `${layout.heightPercent}%`;

  node.style.opacity =
    String(
      layout.opacity
    );

  node.style.transform =
    [
      `translate3d(${layout.translateXPercent}%, ${layout.translateYPercent}%, ${layout.translateZPx}px)`,
      `rotateX(${layout.rotateXDeg}deg)`,
      `rotateY(${layout.rotateYDeg}deg)`,
      `rotateZ(${layout.rotateZDeg}deg)`,
      `scale3d(${layout.scale}, ${layout.scale}, ${layout.scale})`
    ].join(' ');

  node.style.transformOrigin =
    '50% 50%';

  node.style.transformStyle =
    'preserve-3d';

  node.style.borderRadius =
    descriptor.primitiveProfile
      .borderRadius;

  if (
    descriptor.primitiveProfile
      .clipPath &&
    descriptor.primitiveProfile
      .clipPath !== 'none'
  ) {
    node.style.clipPath =
      descriptor.primitiveProfile
        .clipPath;
  }

  node.style.boxSizing =
    'border-box';

  node.style.background =
    'linear-gradient(145deg, var(--h-earth-material-highlight, transparent) 0%, var(--h-earth-material-mid, transparent) 38%, var(--h-earth-material-base, transparent) 68%, var(--h-earth-material-shadow, transparent) 100%)';

  node.style.backfaceVisibility =
    'hidden';

  node.style.willChange =
    'transform';

  if (
    descriptor.primitiveIntent ===
    'skyVolume'
  ) {
    node.style.background =
      'linear-gradient(180deg, rgba(77, 111, 129, 1) 0%, rgba(129, 157, 163, 0.98) 58%, rgba(189, 189, 164, 0.72) 100%)';
  }

  if (
    descriptor.primitiveIntent ===
    'atmosphericLayer'
  ) {
    node.style.background =
      'radial-gradient(ellipse at center, rgba(220, 226, 217, 0.32) 0%, rgba(139, 169, 174, 0.2) 46%, rgba(64, 92, 107, 0) 76%)';

    node.style.filter =
      'blur(12px)';
  }

  if (
    descriptor.primitiveIntent ===
    'horizonBand'
  ) {
    node.style.background =
      'linear-gradient(90deg, rgba(218, 218, 197, 0.08) 0%, rgba(222, 218, 190, 0.58) 45%, rgba(219, 216, 191, 0.62) 55%, rgba(218, 218, 197, 0.08) 100%)';

    node.style.filter =
      'blur(2px)';
  }

  if (
    descriptor.primitiveIntent ===
    'waterPlane'
  ) {
    node.style.background =
      'linear-gradient(180deg, rgba(118, 178, 187, 0.58) 0%, rgba(37, 111, 132, 0.94) 38%, rgba(12, 52, 73, 0.98) 100%)';

    node.style.boxShadow =
      'inset 0 1px 0 rgba(220, 238, 236, 0.42), inset 0 -18px 34px rgba(3, 27, 42, 0.42)';
  }

  if (
    descriptor.primitiveIntent ===
    'waterDepthBand'
  ) {
    node.style.background =
      'linear-gradient(180deg, rgba(196, 226, 220, 0.46) 0%, rgba(74, 153, 160, 0.84) 44%, rgba(20, 79, 96, 0.82) 100%)';

    node.style.boxShadow =
      '0 -2px 5px rgba(225, 244, 239, 0.22)';
  }

  if (
    descriptor.primitiveIntent ===
    'irregularShorelineBand'
  ) {
    node.style.background =
      'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(209, 233, 229, 0.82) 52%, rgba(129, 174, 179, 0.18) 100%)';

    node.style.filter =
      'blur(0.5px)';

    node.style.boxShadow =
      '0 0 8px rgba(227, 245, 240, 0.34)';
  }

  if (
    descriptor.primitiveIntent ===
    'terrainBand' ||
    descriptor.primitiveIntent ===
    'contouredTerrainBand'
  ) {
    node.style.boxShadow =
      'inset 0 3px 8px rgba(255, 236, 192, 0.08), inset 0 -20px 34px rgba(16, 19, 18, 0.24)';
  }

  if (
    descriptor.primitiveIntent ===
    'surfacePoolCluster'
  ) {
    node.style.background =
      'radial-gradient(ellipse at 42% 36%, rgba(202, 231, 225, 0.7) 0%, rgba(67, 134, 143, 0.76) 38%, rgba(15, 62, 75, 0.9) 74%, rgba(6, 34, 43, 0.92) 100%)';

    node.style.boxShadow =
      'inset 0 2px 3px rgba(238, 251, 246, 0.5), 0 2px 5px rgba(21, 30, 29, 0.42)';
  }

  if (
    descriptor.primitiveIntent ===
    'smallStoneCluster'
  ) {
    node.style.boxShadow =
      'inset 1px 1px 1px rgba(235, 222, 193, 0.2), 1px 2px 3px rgba(15, 18, 18, 0.46)';
  }

  if (
    descriptor.primitiveIntent ===
    'jaggedRockCluster' ||
    descriptor.primitiveIntent ===
    'offshoreDistantCluster'
  ) {
    node.style.boxShadow =
      'inset 2px 1px 3px rgba(177, 171, 145, 0.14), 4px 7px 9px rgba(5, 10, 12, 0.42)';
  }

  if (
    descriptor.primitiveIntent ===
    'elevatedArchitecturalCluster'
  ) {
    const role =
      layout.memberRole;

    if (
      role === 'manor-bluff'
    ) {
      node.style.clipPath =
        'polygon(0 100%, 8% 56%, 24% 47%, 38% 27%, 53% 35%, 72% 12%, 100% 100%)';

      node.style.background =
        'linear-gradient(155deg, rgba(117, 106, 85, 0.92) 0%, rgba(61, 62, 57, 0.98) 47%, rgba(25, 31, 33, 1) 100%)';
    } else if (
      role === 'manor-main-body'
    ) {
      node.style.background =
        'linear-gradient(145deg, rgba(169, 150, 117, 0.82) 0%, rgba(83, 78, 68, 0.98) 50%, rgba(30, 31, 30, 1) 100%)';

      node.style.border =
        '1px solid rgba(214, 192, 151, 0.26)';

      node.style.boxShadow =
        '0 8px 18px rgba(5, 10, 13, 0.52), inset 0 1px 0 rgba(225, 204, 164, 0.18)';
    } else {
      node.style.background =
        'linear-gradient(145deg, rgba(150, 133, 104, 0.78) 0%, rgba(72, 69, 61, 0.98) 54%, rgba(27, 29, 28, 1) 100%)';

      node.style.border =
        '1px solid rgba(203, 179, 138, 0.22)';

      node.style.boxShadow =
        '0 6px 14px rgba(4, 9, 12, 0.48)';
    }
  }

  if (
    descriptor.primitiveIntent ===
    'logicalAnchor'
  ) {
    node.style.background =
      'radial-gradient(circle, rgba(255, 246, 207, 0.98) 0%, rgba(218, 191, 117, 0.92) 26%, rgba(142, 101, 42, 0.42) 52%, rgba(142, 101, 42, 0) 74%)';

    node.style.boxShadow =
      '0 0 14px rgba(245, 221, 151, 0.78), 0 0 34px rgba(229, 191, 105, 0.34)';

    node.style.pointerEvents =
      'auto';

    node.style.cursor =
      'pointer';
  }

  return true;
}

export function applyHEarthRenderNodeAttributes(
  node,
  descriptor,
  memberDescriptor
) {
  if (
    !node ||
    !descriptor ||
    !memberDescriptor
  ) {
    return false;
  }

  node.setAttribute(
    H_EARTH_RENDER_OWNERSHIP_ATTRIBUTE,
    'true'
  );

  node.setAttribute(
    H_EARTH_RENDER_NODE_ATTRIBUTE,
    memberDescriptor.memberId
  );

  node.setAttribute(
    'data-h-earth-layer-id',
    descriptor.layerId
  );

  node.setAttribute(
    'data-h-earth-layer-order',
    String(
      descriptor.order
    )
  );

  node.setAttribute(
    'data-h-earth-member-index',
    String(
      memberDescriptor.memberIndex
    )
  );

  node.setAttribute(
    'data-h-earth-member-count',
    String(
      memberDescriptor.memberCount
    )
  );

  node.setAttribute(
    'data-h-earth-object-ids',
    descriptor.objectIds.join(',')
  );

  node.setAttribute(
    'data-h-earth-primary-object-id',
    String(
      descriptor.objectIds[0] ||
      ''
    )
  );

  node.setAttribute(
    'data-h-earth-primary-zone-id',
    String(
      descriptor.primaryZoneId ||
      ''
    )
  );

  node.setAttribute(
    'data-h-earth-secondary-zone-id',
    String(
      descriptor.secondaryZoneId ||
      ''
    )
  );

  node.setAttribute(
    'data-h-earth-region-id',
    String(
      descriptor.regionId ||
      ''
    )
  );

  node.setAttribute(
    'data-h-earth-primitive-intent',
    String(
      descriptor.primitiveIntent ||
      ''
    )
  );

  node.setAttribute(
    'data-h-earth-primitive-profile-id',
    String(
      descriptor.primitiveProfile
        .profileId
    )
  );

  node.setAttribute(
    'data-h-earth-world-geometry-role',
    String(
      descriptor.worldGeometryRole ||
      ''
    )
  );

  node.setAttribute(
    'data-h-earth-inspection-role',
    String(
      descriptor.inspectionRole ||
      ''
    )
  );

  node.setAttribute(
    'data-h-earth-source-address-count',
    String(
      descriptor.sourceAddressCount
    )
  );

  node.setAttribute(
    'data-h-earth-source-object-count',
    String(
      descriptor.sourceObjectCount
    )
  );

  node.setAttribute(
    'data-h-earth-internal-primitive-projection',
    'true'
  );

  node.setAttribute(
    'data-h-earth-external-geometry-file-used',
    'false'
  );

  node.setAttribute(
    'data-h-earth-renderer-activation-scope',
    'BOUNDED_PUBLIC_STAGE_DOM_CSS3D'
  );

  return true;
}

export function createHEarthPrimitiveMemberNode({
  documentRef,
  descriptor,
  memberDescriptor,
  controller =
    null
} = {}) {
  if (
    !documentRef ||
    typeof documentRef.createElement !==
      'function'
  ) {
    return Object.freeze({
      created:
        false,

      node:
        null,

      failureCode:
        'INVALID_DOCUMENT_REFERENCE',

      claimBoundaryPreserved:
        true
    });
  }

  const node =
    documentRef.createElement(
      'div'
    );

  resolveHEarthMemberClassNames(
    descriptor,
    memberDescriptor
  ).forEach(
    (className) =>
      node.classList.add(
        className
      )
  );

  applyHEarthMaterialToken(
    node,
    descriptor.material
  );

  applyHEarthPrimitiveMemberStyles(
    node,
    descriptor,
    memberDescriptor
  );

  applyHEarthRenderNodeAttributes(
    node,
    descriptor,
    memberDescriptor
  );

  const primaryObjectId =
    descriptor.objectIds[0] ||
    null;

  const selectableRegistry =
    controller?.selectableTargetRegistry ||
    controller
      ?.H_EARTH_3D_SELECTABLE_TARGET_REGISTRY ||
    null;

  const controllerTarget =
    primaryObjectId &&
    selectableRegistry
      ? selectableRegistry[
          primaryObjectId
        ] || null
      : null;

  if (
    descriptor.primitiveIntent ===
    'logicalAnchor'
  ) {
    node.setAttribute(
      'role',
      'button'
    );

    node.setAttribute(
      'tabindex',
      '0'
    );

    node.setAttribute(
      'aria-label',
      'Inspect Ground'
    );

    node.setAttribute(
      'data-h-earth-action',
      'Inspect Ground'
    );

    node.setAttribute(
      'data-h-earth-readout',
      'Ground Condition Read'
    );

    node.setAttribute(
      'data-h-earth-controller-target-present',
      controllerTarget
        ? 'true'
        : 'false'
    );
  } else {
    node.setAttribute(
      'aria-hidden',
      'true'
    );
  }

  return Object.freeze({
    created:
      true,

    node,

    controllerTarget,

    failureCode:
      null,

    internalNodeConstructionUsed:
      true,

    externalNodeFactoryUsed:
      false,

    claimBoundaryPreserved:
      true
  });
}

export function mountHEarthLayerDescriptor({
  descriptor,
  layerNode,
  controller =
    null
} = {}) {
  if (
    !descriptor ||
    !layerNode
  ) {
    return Object.freeze({
      mounted:
        false,

      createdNodeCount:
        0,

      placedNodeCount:
        0,

      skippedNodeCount:
        0,

      failureCodes:
        Object.freeze([
          'INVALID_LAYER_DESCRIPTOR_OR_CONTAINER'
        ]),

      warningCodes:
        EMPTY_FROZEN_ARRAY,

      claimBoundaryPreserved:
        true
    });
  }

  const documentRef =
    layerNode.ownerDocument;

  let createdNodeCount =
    0;

  let placedNodeCount =
    0;

  let skippedNodeCount =
    0;

  const warningCodes = [];
  const failureCodes = [];

  descriptor.memberDescriptors
    .forEach(
      (memberDescriptor) => {
        const result =
          createHEarthPrimitiveMemberNode({
            documentRef,

            descriptor,

            memberDescriptor,

            controller
          });

        if (
          result.created !== true ||
          !result.node
        ) {
          skippedNodeCount +=
            1;

          warningCodes.push(
            result.failureCode ||
            'PRIMITIVE_MEMBER_NODE_CREATION_FAILED'
          );

          return;
        }

        createdNodeCount +=
          1;

        layerNode.appendChild(
          result.node
        );

        placedNodeCount +=
          1;
      }
    );

  if (
    descriptor.memberCount > 0 &&
    placedNodeCount === 0
  ) {
    failureCodes.push(
      'NO_PRIMITIVE_MEMBER_NODES_PLACED'
    );
  }

  return Object.freeze({
    mounted:
      descriptor.memberCount === 0
        ? true
        : placedNodeCount > 0,

    layerId:
      descriptor.layerId,

    requestedNodeCount:
      descriptor.memberCount,

    createdNodeCount,

    placedNodeCount,

    skippedNodeCount,

    internalNodeConstructionUsed:
      true,

    internalMaterialResolutionUsed:
      true,

    internalPrimitiveProjectionUsed:
      true,

    warningCodes:
      uniqueHEarthRenderCodes(
        warningCodes
      ),

    failureCodes:
      uniqueHEarthRenderCodes(
        failureCodes
      ),

    claimBoundaryPreserved:
      true
  });
}

export function clearHEarthRendererOwnedNodes({
  mountNode
} = {}) {
  const validation =
    isValidHEarthMountNode(
      mountNode
    );

  if (!validation.valid) {
    return Object.freeze({
      cleared:
        false,

      removedCount:
        0,

      failureCode:
        validation.reason,

      claimBoundaryPreserved:
        true
    });
  }

  const ownedNodes =
    Array.from(
      mountNode.querySelectorAll(
        H_EARTH_RENDER_OWNED_SELECTOR
      )
    );

  const rootOwnedNodes =
    ownedNodes.filter(
      (node) =>
        node.parentNode ===
        mountNode
    );

  rootOwnedNodes.forEach(
    (node) => node.remove()
  );

  return Object.freeze({
    cleared:
      true,

    removedCount:
      rootOwnedNodes.length,

    nestedOwnedNodeCount:
      Math.max(
        0,
        ownedNodes.length -
        rootOwnedNodes.length
      ),

    rendererOwnedNodesOnly:
      true,

    routeShellPreserved:
      true,

    failureCode:
      null,

    claimBoundaryPreserved:
      true
  });
}

export function buildRendererMountReceipt({
  rendererMounted =
    false,

  mountAttempted =
    true,

  mountNodeValid =
    false,

  renderRootCreated =
    false,

  priorOwnedNodesCleared =
    false,

  priorOwnedNodeCountRemoved =
    0,

  compositionValidation =
    null,

  selectedRenderInputSource =
    'none',

  sourceDescriptorType =
    'NONE',

  compositionAccepted =
    false,

  layerContainersCreated =
    false,

  layerCount =
    0,

  descriptorCount =
    0,

  requestedNodeCount =
    0,

  createdNodeCount =
    0,

  placedNodeCount =
    0,

  skippedNodeCount =
    0,

  mountedLayerCount =
    0,

  failedLayerCount =
    0,

  materialResolutionCount =
    0,

  primitiveProjectionCount =
    0,

  internalMaterialResolutionUsed =
    false,

  internalLayerConstructionUsed =
    false,

  internalNodeConstructionUsed =
    false,

  internalPrimitiveProjectionUsed =
    false,

  warningCodes =
    EMPTY_FROZEN_ARRAY,

  failureCodes =
    EMPTY_FROZEN_ARRAY,

  boundary =
    EMPTY_FROZEN_OBJECT
} = {}) {
  return Object.freeze({
    receiptType:
      'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',

    contractId:
      H_EARTH_3D_RENDERER_CONTRACT
        .contractId,

    renewedFrom:
      H_EARTH_3D_RENDERER_CONTRACT
        .renewedFrom,

    governingCompositorContractId:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_CONTRACT
        .contractId,

    rendererMounted,

    mounted:
      rendererMounted,

    mountAttempted,

    mountNodeAccepted:
      mountNodeValid,

    mountNodeValid,

    renderRootCreated,

    priorRendererOwnedNodesCleared:
      priorOwnedNodesCleared,

    priorOwnedNodesCleared,

    priorOwnedNodeCountRemoved,

    selectedRenderInputSource,

    sourceDescriptorType,

    compositionAccepted,

    compositionValidation,

    compositorAuthorityConsumed:
      true,

    legacyCandidateSceneUsed:
      false,

    legacyEnvironmentSceneUsed:
      false,

    layerContainersCreated,

    layerContainerCount:
      layerCount,

    layerCount,

    descriptorCount,

    requestedNodeCount,

    createdNodeCount,

    placedNodeCount,

    skippedNodeCount,

    mountedLayerCount,

    failedLayerCount,

    materialResolutionCount,

    primitiveProjectionCount,

    internalMaterialResolutionUsed,

    internalLayerConstructionUsed,

    internalNodeConstructionUsed,

    internalPrimitiveProjectionUsed,

    staticSupportFileImports:
      false,

    dynamicSupportFileImports:
      false,

    externalMaterialFileUsed:
      false,

    externalLayerFileUsed:
      false,

    externalNodeFactoryUsed:
      false,

    externalGeometryFileUsed:
      false,

    absentSupportFilesTolerated:
      true,

    geometryExpansionApplied:
      false,

    geometryExpansionFilePresent:
      false,

    boundedDomCss3dSceneCreated:
      rendererMounted === true,

    createsDomCss3dScene:
      rendererMounted === true,

    publicStageCompositionMaterialized:
      rendererMounted === true,

    shorelineSceneMaterialized:
      rendererMounted === true &&
      placedNodeCount > 0,

    actorProxyCreated:
      false,

    groundContactCreated:
      false,

    collisionCreated:
      false,

    liveInspectGroundCreated:
      false,

    deterministicStateReceiptCreated:
      false,

    warningCodes:
      uniqueHEarthRenderCodes(
        warningCodes
      ),

    failureCodes:
      uniqueHEarthRenderCodes(
        failureCodes
      ),

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

    runtimeProofComplete:
      false,

    boundary:
      Object.freeze({
        ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
        ...boundary,

        claimBoundaryPreserved:
          true
      }),

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

    claimBoundaryPreserved:
      true
  });
}

export function buildRendererDestroyReceipt({
  destroyAttempted =
    true,

  destroyed =
    false,

  mountNodeValid =
    false,

  removedOwnedNodeCount =
    0,

  warningCodes =
    EMPTY_FROZEN_ARRAY,

  failureCodes =
    EMPTY_FROZEN_ARRAY,

  boundary =
    EMPTY_FROZEN_OBJECT
} = {}) {
  return Object.freeze({
    receiptType:
      'H_EARTH_3D_RENDERER_DESTROY_RECEIPT',

    contractId:
      H_EARTH_3D_RENDERER_CONTRACT
        .contractId,

    renewedFrom:
      H_EARTH_3D_RENDERER_CONTRACT
        .renewedFrom,

    destroyAttempted,

    destroyed,

    mountNodeAccepted:
      mountNodeValid,

    mountNodeValid,

    removedNodeCount:
      removedOwnedNodeCount,

    removedOwnedNodeCount,

    rendererOwnedNodesOnly:
      true,

    routeShellPreserved:
      true,

    sourceDescriptorsPreserved:
      true,

    warningCodes:
      uniqueHEarthRenderCodes(
        warningCodes
      ),

    failureCodes:
      uniqueHEarthRenderCodes(
        failureCodes
      ),

    finalRendererClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    boundary:
      Object.freeze({
        ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
        ...boundary,

        claimBoundaryPreserved:
          true
      }),

    claimBoundaryPreserved:
      true
  });
}

export function mountHEarthRenderer({
  mountNode,

  composition =
    H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,

  composedCandidateFrame =
    null,

  candidateRenderScene =
    null,

  renderer =
    null,

  controller =
    null,

  options =
    EMPTY_FROZEN_OBJECT,

  boundary =
    EMPTY_FROZEN_OBJECT
} = {}) {
  const mountValidation =
    isValidHEarthMountNode(
      mountNode
    );

  if (!mountValidation.valid) {
    return buildRendererMountReceipt({
      rendererMounted:
        false,

      mountNodeValid:
        false,

      failureCodes:
        Object.freeze([
          mountValidation.reason
        ]),

      boundary
    });
  }

  const selectedInput =
    selectHEarthRenderInput({
      composition:
        composition ||
        composedCandidateFrame,

      composedCandidateFrame,

      candidateRenderScene
    });

  if (
    selectedInput.accepted !==
    true
  ) {
    const clearResult =
      clearHEarthRendererOwnedNodes({
        mountNode
      });

    return buildRendererMountReceipt({
      rendererMounted:
        false,

      mountNodeValid:
        true,

      priorOwnedNodesCleared:
        clearResult.cleared === true,

      priorOwnedNodeCountRemoved:
        clearResult.removedCount ||
        0,

      compositionValidation:
        selectedInput
          .compositionValidation,

      selectedRenderInputSource:
        selectedInput.source,

      sourceDescriptorType:
        selectedInput
          .sourceDescriptorType,

      compositionAccepted:
        false,

      descriptorCount:
        selectedInput.descriptorCount,

      requestedNodeCount:
        selectedInput.sceneNodeCount,

      warningCodes:
        selectedInput.warningCodes,

      failureCodes:
        selectedInput.failureCodes,

      boundary
    });
  }

  try {
    const clearResult =
      clearHEarthRendererOwnedNodes({
        mountNode
      });

    const receiptId =
      `H_EARTH_3D_RENDERER_MOUNT_${Date.now()}`;

    const rootResult =
      createHEarthRenderRootNode({
        mountNode,

        receiptId,

        composition:
          selectedInput.composition,

        options
      });

    if (
      rootResult.created !==
        true ||
      !rootResult.rootNode
    ) {
      return buildRendererMountReceipt({
        rendererMounted:
          false,

        mountNodeValid:
          true,

        priorOwnedNodesCleared:
          clearResult.cleared === true,

        priorOwnedNodeCountRemoved:
          clearResult.removedCount ||
          0,

        compositionValidation:
          selectedInput
            .compositionValidation,

        selectedRenderInputSource:
          selectedInput.source,

        sourceDescriptorType:
          selectedInput
            .sourceDescriptorType,

        compositionAccepted:
          true,

        descriptorCount:
          selectedInput.descriptorCount,

        requestedNodeCount:
          selectedInput.sceneNodeCount,

        failureCodes:
          Object.freeze([
            rootResult.failureCode ||
            'RENDER_ROOT_CREATION_FAILED'
          ]),

        boundary
      });
    }

    mountNode.appendChild(
      rootResult.rootNode
    );

    const layerResult =
      createHEarthLayerContainers({
        renderRoot:
          rootResult.rootNode,

        descriptors:
          selectedInput.descriptors
      });

    if (
      layerResult.created !==
      true
    ) {
      rootResult.rootNode.remove();

      return buildRendererMountReceipt({
        rendererMounted:
          false,

        mountNodeValid:
          true,

        renderRootCreated:
          true,

        priorOwnedNodesCleared:
          clearResult.cleared === true,

        priorOwnedNodeCountRemoved:
          clearResult.removedCount ||
          0,

        compositionValidation:
          selectedInput
            .compositionValidation,

        selectedRenderInputSource:
          selectedInput.source,

        sourceDescriptorType:
          selectedInput
            .sourceDescriptorType,

        compositionAccepted:
          true,

        descriptorCount:
          selectedInput.descriptorCount,

        requestedNodeCount:
          selectedInput.sceneNodeCount,

        warningCodes:
          layerResult.warningCodes,

        failureCodes:
          layerResult.failureCodes,

        boundary
      });
    }

    let createdNodeCount =
      0;

    let placedNodeCount =
      0;

    let skippedNodeCount =
      0;

    let mountedLayerCount =
      0;

    let failedLayerCount =
      0;

    let materialResolutionCount =
      0;

    let primitiveProjectionCount =
      0;

    const warningCodes =
      [
        ...selectedInput.warningCodes,
        ...layerResult.warningCodes
      ];

    const failureCodes =
      [
        ...selectedInput.failureCodes
      ];

    selectedInput.descriptors
      .forEach(
        (descriptor) => {
          const layerNode =
            layerResult
              .layerContainersById[
                descriptor.layerId
              ];

          if (!layerNode) {
            failedLayerCount +=
              1;

            failureCodes.push(
              `LAYER_CONTAINER_MISSING:${descriptor.layerId}`
            );

            return;
          }

          const mountResult =
            mountHEarthLayerDescriptor({
              descriptor,

              layerNode,

              controller
            });

          createdNodeCount +=
            mountResult.createdNodeCount;

          placedNodeCount +=
            mountResult.placedNodeCount;

          skippedNodeCount +=
            mountResult.skippedNodeCount;

          materialResolutionCount +=
            mountResult.createdNodeCount;

          primitiveProjectionCount +=
            mountResult.createdNodeCount;

          if (
            mountResult.mounted ===
            true
          ) {
            mountedLayerCount +=
              1;
          } else {
            failedLayerCount +=
              1;
          }

          warningCodes.push(
            ...mountResult.warningCodes
          );

          failureCodes.push(
            ...mountResult.failureCodes
          );
        }
      );

    if (
      placedNodeCount === 0
    ) {
      failureCodes.push(
        'NO_PUBLIC_STAGE_NODES_PLACED'
      );
    }

    if (
      failedLayerCount > 0 &&
      mountedLayerCount > 0
    ) {
      warningCodes.push(
        'PUBLIC_STAGE_LAYER_MOUNT_PARTIAL'
      );
    }

    if (
      placedNodeCount > 0
    ) {
      rootResult.rootNode
        .classList.add(
          'h-earth-render-scene-mounted'
        );

      rootResult.rootNode
        .setAttribute(
          'data-h-earth-render-mounted',
          'true'
        );

      rootResult.rootNode
        .setAttribute(
          'data-h-earth-render-node-count',
          String(
            placedNodeCount
          )
        );

      rootResult.rootNode
        .setAttribute(
          'data-h-earth-render-layer-count',
          String(
            mountedLayerCount
          )
        );

      rootResult.rootNode
        .setAttribute(
          'data-h-earth-composition-layer-count',
          String(
            selectedInput.layerCount
          )
        );

      rootResult.rootNode
        .setAttribute(
          'data-h-earth-landscape-address-count',
          String(
            selectedInput.composition
              ?.landscapeLattice
              ?.addressCount ||
            0
          )
        );
    }

    return buildRendererMountReceipt({
      rendererMounted:
        placedNodeCount > 0,

      mountNodeValid:
        true,

      renderRootCreated:
        true,

      priorOwnedNodesCleared:
        clearResult.cleared === true,

      priorOwnedNodeCountRemoved:
        clearResult.removedCount ||
        0,

      compositionValidation:
        selectedInput
          .compositionValidation,

      selectedRenderInputSource:
        selectedInput.source,

      sourceDescriptorType:
        selectedInput
          .sourceDescriptorType,

      compositionAccepted:
        true,

      layerContainersCreated:
        layerResult.created ===
        true,

      layerCount:
        layerResult.layerCount,

      descriptorCount:
        selectedInput.descriptorCount,

      requestedNodeCount:
        selectedInput.sceneNodeCount,

      createdNodeCount,

      placedNodeCount,

      skippedNodeCount,

      mountedLayerCount,

      failedLayerCount,

      materialResolutionCount,

      primitiveProjectionCount,

      internalMaterialResolutionUsed:
        true,

      internalLayerConstructionUsed:
        true,

      internalNodeConstructionUsed:
        true,

      internalPrimitiveProjectionUsed:
        true,

      warningCodes,

      failureCodes,

      boundary
    });
  } catch (error) {
    return buildRendererMountReceipt({
      rendererMounted:
        false,

      mountNodeValid:
        true,

      compositionValidation:
        selectedInput
          .compositionValidation,

      selectedRenderInputSource:
        selectedInput.source,

      sourceDescriptorType:
        selectedInput
          .sourceDescriptorType,

      compositionAccepted:
        true,

      descriptorCount:
        selectedInput.descriptorCount,

      requestedNodeCount:
        selectedInput.sceneNodeCount,

      internalMaterialResolutionUsed:
        true,

      internalLayerConstructionUsed:
        true,

      internalNodeConstructionUsed:
        true,

      internalPrimitiveProjectionUsed:
        true,

      failureCodes:
        Object.freeze([
          'PUBLIC_STAGE_RENDERER_MOUNT_EXCEPTION',

          String(
            error?.message ||
            error ||
            'UNKNOWN_RENDERER_MOUNT_EXCEPTION'
          )
        ]),

      boundary
    });
  }
}

export function destroyHEarthRenderer({
  mountNode,

  boundary =
    EMPTY_FROZEN_OBJECT
} = {}) {
  const mountValidation =
    isValidHEarthMountNode(
      mountNode
    );

  if (!mountValidation.valid) {
    return buildRendererDestroyReceipt({
      destroyed:
        false,

      mountNodeValid:
        false,

      removedOwnedNodeCount:
        0,

      failureCodes:
        Object.freeze([
          mountValidation.reason
        ]),

      boundary
    });
  }

  const clearResult =
    clearHEarthRendererOwnedNodes({
      mountNode
    });

  if (
    clearResult.cleared !== true
  ) {
    return buildRendererDestroyReceipt({
      destroyed:
        false,

      mountNodeValid:
        true,

      removedOwnedNodeCount:
        0,

      failureCodes:
        Object.freeze([
          clearResult.failureCode ||
          'RENDERER_DESTROY_CLEAR_FAILED'
        ]),

      boundary
    });
  }

  return buildRendererDestroyReceipt({
    destroyed:
      true,

    mountNodeValid:
      true,

    removedOwnedNodeCount:
      clearResult.removedCount ||
      0,

    warningCodes:
      clearResult.removedCount >
      0
        ? EMPTY_FROZEN_ARRAY
        : Object.freeze([
            'NO_RENDERER_OWNED_ROOT_NODES_FOUND'
          ]),

    failureCodes:
      EMPTY_FROZEN_ARRAY,

    boundary
  });
}

export function getHEarthMountedRenderRoot(
  mountNode
) {
  if (
    !mountNode ||
    typeof mountNode.querySelector !==
      'function'
  ) {
    return null;
  }

  return (
    mountNode.querySelector(
      `[${H_EARTH_RENDER_ROOT_ATTRIBUTE}="true"][${H_EARTH_RENDER_OWNERSHIP_ATTRIBUTE}="true"]`
    ) ||
    null
  );
}

export function getHEarthMountedLayerNode(
  mountNode,
  layerId
) {
  const root =
    getHEarthMountedRenderRoot(
      mountNode
    );

  if (
    !root ||
    !layerId
  ) {
    return null;
  }

  return (
    root.querySelector(
      `[${H_EARTH_RENDER_LAYER_ATTRIBUTE}="${String(
        layerId
      )}"]`
    ) ||
    null
  );
}

export function getHEarthMountedObjectNodes(
  mountNode,
  objectId
) {
  const root =
    getHEarthMountedRenderRoot(
      mountNode
    );

  if (
    !root ||
    !objectId
  ) {
    return EMPTY_FROZEN_ARRAY;
  }

  return Object.freeze(
    Array.from(
      root.querySelectorAll(
        `[data-h-earth-primary-object-id="${String(
          objectId
        )}"]`
      )
    )
  );
}

export function getHEarthRendererDiagnosticSnapshot(
  mountNode
) {
  const root =
    getHEarthMountedRenderRoot(
      mountNode
    );

  const layerNodes =
    root
      ? Array.from(
          root.querySelectorAll(
            `[${H_EARTH_RENDER_LAYER_ATTRIBUTE}]`
          )
        )
      : [];

  const renderNodes =
    root
      ? Array.from(
          root.querySelectorAll(
            `[${H_EARTH_RENDER_NODE_ATTRIBUTE}]`
          )
        )
      : [];

  const materialKeys =
    new Set(
      renderNodes
        .map(
          (node) =>
            node.getAttribute(
              'data-h-earth-material-key'
            )
        )
        .filter(Boolean)
    );

  const layerIds =
    layerNodes
      .map(
        (node) =>
          node.getAttribute(
            H_EARTH_RENDER_LAYER_ATTRIBUTE
          )
      )
      .filter(Boolean);

  return Object.freeze({
    snapshotType:
      'H_EARTH_3D_RENDERER_DIAGNOSTIC_SNAPSHOT',

    rendererRootPresent:
      Boolean(root),

    rendererMounted:
      root?.getAttribute(
        'data-h-earth-render-mounted'
      ) === 'true',

    rendererContractId:
      root?.getAttribute(
        'data-h-earth-render-contract-id'
      ) ||
      null,

    compositorContractId:
      root?.getAttribute(
        'data-h-earth-compositor-contract-id'
      ) ||
      null,

    activeCell:
      root?.getAttribute(
        'data-h-earth-active-cell'
      ) ||
      null,

    sceneIdentity:
      root?.getAttribute(
        'data-h-earth-scene-identity'
      ) ||
      null,

    layerCount:
      layerNodes.length,

    renderNodeCount:
      renderNodes.length,

    layerIds:
      Object.freeze(
        layerIds
      ),

    materialKeys:
      Object.freeze([
        ...materialKeys
      ]),

    orderedLayerCountExpected:
      15,

    orderedLayerCountMatchesExpected:
      layerNodes.length === 15,

    landscapeAddressCount:
      normalizeHEarthRenderNumber(
        root?.getAttribute(
          'data-h-earth-landscape-address-count'
        ),
        0
      ),

    compositorAuthorityConsumed:
      Boolean(
        root?.getAttribute(
          'data-h-earth-compositor-contract-id'
        )
      ),

    externalSupportFilesUsed:
      false,

    actorProxyPresent:
      false,

    collisionPresent:
      false,

    liveInspectionPresent:
      false,

    runtimeProofComplete:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });
}

export const H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT =
  resolveHEarthPublicStageRenderInput({
    composition:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION
  });

// Compatibility alias.
//
// The legacy renderer exposed H_EARTH_3D_CANDIDATE_RENDER_SCENE as an
// independently created environment-driven candidate scene.
//
// Step 034O no longer creates that authority.
//
// This alias exposes the compositor-governed render input so existing imports
// fail less abruptly while the controller and index are renewed.
export const H_EARTH_3D_CANDIDATE_RENDER_SCENE =
  Object.freeze({
    sceneId:
      'H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT_COMPATIBILITY_ALIAS',

    contractId:
      H_EARTH_3D_RENDERER_CONTRACT
        .contractId,

    sourceDescriptorType:
      'PUBLIC_STAGE_COMPOSITION_DESCRIPTOR',

    composition:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,

    nodes:
      H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT
        .descriptors,

    nodeCount:
      H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT
        .descriptorCount,

    sourceNodeCount:
      H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT
        .descriptorCount,

    orderedLayerCount:
      H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT
        .layerCount,

    candidateRenderSceneParentDescriptorsOnly:
      true,

    rendererIndependentCompositionConsumed:
      true,

    legacyEnvironmentSceneAuthority:
      false,

    geometryPortUsed:
      false,

    geometryExpansionApplied:
      false,

    compatibilityAliasOnly:
      true,

    finalRendererClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    claimBoundaryPreserved:
      true
  });

export const H_EARTH_3D_RENDERER_RECEIPT =
  Object.freeze({
    receiptType:
      'H_EARTH_3D_RENDERER_RECEIPT',

    file:
      '/showroom/globe/h-earth/renderer.js',

    contractId:
      'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_PUBLIC_STAGE_COMPOSITION_CONSUMPTION_v1',

    renewedFrom:
      'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032E_GEOMETRY_032D_ORGANIC_VARIATION_SYNC_v1',

    governingCompositorContractId:
      'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034N_PUBLIC_STAGE_VISUAL_COMPOSITION_BRIDGE_v1',

    status:
      'PUBLIC_STAGE_RENDERER_SOURCE_CANDIDATE_PENDING_INSTALLATION_IMPORT_AND_RUNTIME_PROOF',

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

    compositorImported:
      true,

    compositorCompositionConsumed:
      true,

    compositorReceiptReferenced:
      Boolean(
        getPublicStageCompositionReceipt()
      ),

    compositorRendererHandoffReferenced:
      Boolean(
        getPublicStageRendererHandoff()
      ),

    legacyRendererSceneAuthorityRetired:
      true,

    legacyEnvironmentDirectSceneAuthorityRetired:
      true,

    rendererInventsLayerOrder:
      false,

    rendererInventsZoneComposition:
      false,

    rendererInventsLandscapeComposition:
      false,

    rendererInventsObjectAuthority:
      false,

    rendererInventsInspectionComposition:
      false,

    rendererInventsContextComposition:
      false,

    compositionValidationDefined:
      true,

    publicStageRenderInputDefined:
      true,

    mountApiDefined:
      true,

    destroyApiDefined:
      true,

    diagnosticSnapshotApiDefined:
      true,

    orderedLayerCountExpected:
      15,

    sourceOrderedLayerCount:
      H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT
        .layerCount,

    sourceOrderedLayerCountMatchesExpected:
      H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT
        .layerCount === 15,

    landscapeAddressCount:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION
        .landscapeLattice
        .addressCount,

    landscapeAddressCountMatchesExpected:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION
        .landscapeLattice
        .addressCountMatchesExpected,

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
          Boolean(
            H_EARTH_3D_RENDER_MATERIAL_TOKENS
              .manorContext
          ),

        tidePool:
          Boolean(
            H_EARTH_3D_RENDER_MATERIAL_TOKENS
              .tidePool
          ),

        stone:
          Boolean(
            H_EARTH_3D_RENDER_MATERIAL_TOKENS
              .stone
          )
      }),

    staticSupportFileImports:
      false,

    dynamicSupportFileImports:
      false,

    absentSupportFilesTolerated:
      true,

    materialsFilePresent:
      false,

    layersFilePresent:
      false,

    nodesFilePresent:
      false,

    geometryFilePresent:
      false,

    internalMaterialResolutionDefined:
      true,

    internalLayerConstructionDefined:
      true,

    internalNodeConstructionDefined:
      true,

    internalPrimitiveProjectionDefined:
      true,

    futureExtractionSeamsDefined:
      true,

    futureExtractionRequired:
      false,

    selfContainedRendererExecutionDefined:
      true,

    boundedDomCss3dSceneMaterializationDefined:
      true,

    geometryExpansionApplied:
      false,

    externalGeometryPortUsed:
      false,

    actorProxyCreated:
      false,

    groundContactCreated:
      false,

    collisionCreated:
      false,

    liveInspectGroundCreated:
      false,

    deterministicStateReceiptCreated:
      false,

    importResolutionVerified:
      false,

    moduleGraphExecutionVerified:
      false,

    mountExecutionVerified:
      false,

    mountedLayerCountVerified:
      false,

    mountedNodeCountVerified:
      false,

    visualOutputInspected:
      false,

    runtimeProofComplete:
      false,

    expectedNextProof:
      'INSTALL_RENDERER_AND_VERIFY_COMPOSITOR_IMPORT_MOUNT_LAYER_COUNT_NODE_COUNT_AND_SCENE_OUTPUT',

    expectedNextFileAfterProof:
      '/showroom/globe/h-earth/controller.js',

    expectedNextStepAfterProof:
      'STEP_034P_BOUNDED_GROUND_VIEW_CAMERA_AND_CONTROLLER_RENEWAL',

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
          'h-earth-renderer-step-034o-public-stage-composition-consumption-backup',

        sourceFile:
          '/showroom/globe/h-earth/renderer.js',

        contractId:
          'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_PUBLIC_STAGE_COMPOSITION_CONSUMPTION_v1',

        backupStatus:
          'PENDING_INSTALLATION_AND_DRIVE_BACKUP',

        driveDocumentId:
          null,

        connectorReadbackVerified:
          false
      }),

    claimCeiling:
      Object.freeze({
        WEBGL:
          false,

        CANVAS:
          false,

        SVG:
          false,

        OPEN_WORLD:
          false,

        ACTOR_PROXY:
          false,

        GROUND_CONTACT:
          false,

        COLLISION:
          false,

        PHYSICS:
          false,

        WALKING:
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
      H_EARTH_3D_RENDER_BOUNDARY_FLAGS,

    claimBoundaryPreserved:
      true
  });

export function getRendererReceipt() {
  return H_EARTH_3D_RENDERER_RECEIPT;
}

export const H_EARTH_3D_RENDERER =
  Object.freeze({
    id:
      'H_EARTH_3D_RENDERER',

    file:
      '/showroom/globe/h-earth/renderer.js',

    step:
      'STEP_034O_PUBLIC_STAGE_RENDERER_CONSUMPTION_RENEWAL',

    contract:
      H_EARTH_3D_RENDERER_CONTRACT,

    hostContract:
      H_EARTH_3D_RENDERER_HOST_CONTRACT,

    mountContract:
      H_EARTH_3D_RENDERER_MOUNT_CONTRACT,

    boundaryFlags:
      H_EARTH_3D_RENDER_BOUNDARY_FLAGS,

    projectionModel:
      H_EARTH_3D_RENDER_PROJECTION_MODEL,

    renderVolumeModel:
      H_EARTH_3D_RENDER_VOLUME_MODEL,

    materialTokens:
      H_EARTH_3D_RENDER_MATERIAL_TOKENS,

    nodeBudget:
      H_EARTH_3D_RENDER_NODE_BUDGET,

    internalSeams:
      H_EARTH_3D_RENDER_INTERNAL_SEAMS,

    layerOrder:
      H_EARTH_3D_RENDER_LAYER_ORDER,

    publicStageComposition:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION,

    publicStageCompositionReceipt:
      H_EARTH_3D_PUBLIC_STAGE_COMPOSITION_RECEIPT,

    publicStageRenderInput:
      H_EARTH_3D_PUBLIC_STAGE_RENDER_INPUT,

    candidateRenderScene:
      H_EARTH_3D_CANDIDATE_RENDER_SCENE,

    normalizeHEarthRenderNumber,
    clampHEarthRenderNumber,
    normalizeHEarthRenderToken,
    freezeHEarthArray,
    uniqueHEarthRenderCodes,

    isValidHEarthMountNode,
    resolveHEarthRendererComposition,
    validateHEarthPublicStageComposition,
    resolveHEarthMaterialToken,
    applyHEarthMaterialToken,
    resolveHEarthLayerProjection,
    resolveHEarthPrimitiveProfile,
    deterministicHEarthFraction,
    resolveHEarthPrimitiveMemberLayout,
    resolveHEarthPublicStageLayerDescriptor,
    resolveHEarthPublicStageRenderInput,
    selectHEarthRenderInput,

    createHEarthRenderRootNode,
    createHEarthLayerContainers,
    resolveHEarthMemberClassNames,
    applyHEarthPrimitiveMemberStyles,
    applyHEarthRenderNodeAttributes,
    createHEarthPrimitiveMemberNode,
    mountHEarthLayerDescriptor,
    clearHEarthRendererOwnedNodes,

    buildRendererMountReceipt,
    buildRendererDestroyReceipt,
    mountHEarthRenderer,
    destroyHEarthRenderer,

    getHEarthMountedRenderRoot,
    getHEarthMountedLayerNode,
    getHEarthMountedObjectNodes,
    getHEarthRendererDiagnosticSnapshot,

    getReceipt:
      getRendererReceipt,

    receipt:
      H_EARTH_3D_RENDERER_RECEIPT
  });

export default H_EARTH_3D_RENDERER;
