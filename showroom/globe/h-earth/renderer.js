/**
 * /showroom/globe/h-earth/renderer.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_1_ENVIRONMENT_GEOMETRY_MATERIALIZATION_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Purpose:
 * Consume the backed compositor-approved Ground Cell 001 handoff and
 * materialize the first bounded environmental substrate through shared
 * world-space projection and DOM/CSS geometry.
 *
 * Direct semantic input:
 * - /showroom/globe/h-earth/compositor.js
 *
 * Narrow capacity utility input:
 * - /showroom/globe/h-earth/capacity.js
 *
 * Upstream truth is already normalized by:
 * - accepted Layers 1–3
 * - accepted Path 3 → /h-earth-3d/ binding chain
 * - H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001
 * - Steps 034I–034L
 * - renewed capacity.js
 * - renewed environment.js
 * - renewed compositor.js
 *
 * This file owns:
 * - compositor-handoff consumption
 * - shared static projection mathematics
 * - projected environment-primitive construction
 * - semantic renderer layer containers
 * - DOM/CSS materialization
 * - camera-depth sorting
 * - candidate mount/destroy lifecycle
 * - explicit resize/reprojection
 * - renderer-specific preflight
 * - renderer-specific receipts
 *
 * This file does not own:
 * - Path 3 authority
 * - matrix authority
 * - Ground Cell binding authority
 * - boundary/object/zone/lattice truth
 * - environmental meaning
 * - semantic layer order
 * - controller input
 * - action execution
 * - readout generation
 * - receipt custody outside renderer evidence
 * - route bootstrap
 * - diagnostic judgment
 * - actor creation
 * - collision
 * - ground-contact proof
 * - traversal
 * - gameplay
 * - fluid simulation
 * - visual-pass approval
 */

import {
  H_EARTH_3D_CAPACITY_CONTRACT_ID,
  H_EARTH_3D_PUBLIC_STAGE_IDS,
  H_EARTH_3D_RENDER_STAGE_LIMITS,
  H_EARTH_3D_NODE_BUDGET,
  H_EARTH_3D_CAPACITY_CLAIM_CEILINGS,
  evaluateHEarth3DViewportCapacity,
  evaluateHEarth3DNodeBudget
} from './capacity.js';

import {
  H_EARTH_3D_COMPOSITOR_CONTRACT_ID,
  H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF,
  H_EARTH_3D_COMPOSITION_LAYER_IDS,
  H_EARTH_3D_COMPOSITION_LAYER_ORDER,
  H_EARTH_3D_COMPOSITION_LAYER_MAP,
  H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS,
  getHEarth3DCompositorRendererHandoff,
  getHEarth3DCompositorReceipt,
  composeHEarth3DRendererLayers,
  evaluateHEarth3DRendererConsumption
} from './compositor.js';

export const H_EARTH_3D_RENDERER_CONTRACT_ID =
  'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_1_ENVIRONMENT_GEOMETRY_MATERIALIZATION_v1';

export const H_EARTH_3D_RENDERER_SCHEMA_VERSION = 1;

const deepFreeze = (value) => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
};

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const lerp = (start, end, amount) =>
  start + (end - start) * amount;

const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }

  const normalized = clamp(
    (value - edge0) / (edge1 - edge0),
    0,
    1
  );

  return normalized *
    normalized *
    (3 - 2 * normalized);
};

const isFiniteNumber = (value) =>
  typeof value === 'number' &&
  Number.isFinite(value);

const isNonEmptyString = (value) =>
  typeof value === 'string' &&
  value.trim().length > 0;

const createRendererIssue = (
  code,
  message,
  details = null,
  severity = 'ERROR'
) =>
  deepFreeze({
    code,
    severity,
    message,
    details
  });

const createVector = (
  x = 0,
  y = 0,
  z = 0
) => ({
  x,
  y,
  z
});

const subtractVector = (
  left,
  right
) =>
  createVector(
    left.x - right.x,
    left.y - right.y,
    left.z - right.z
  );

const addVector = (
  left,
  right
) =>
  createVector(
    left.x + right.x,
    left.y + right.y,
    left.z + right.z
  );

const scaleVector = (
  vector,
  scalar
) =>
  createVector(
    vector.x * scalar,
    vector.y * scalar,
    vector.z * scalar
  );

const dotVector = (
  left,
  right
) =>
  left.x * right.x +
  left.y * right.y +
  left.z * right.z;

const crossVector = (
  left,
  right
) =>
  createVector(
    left.y * right.z -
      left.z * right.y,

    left.z * right.x -
      left.x * right.z,

    left.x * right.y -
      left.y * right.x
  );

const getVectorLength = (vector) =>
  Math.hypot(
    vector.x,
    vector.y,
    vector.z
  );

const normalizeVector = (vector) => {
  const length =
    getVectorLength(vector);

  if (length <= Number.EPSILON) {
    return createVector(0, 0, 0);
  }

  return scaleVector(
    vector,
    1 / length
  );
};

const toRadians = (degrees) =>
  degrees * Math.PI / 180;

const round = (
  value,
  precision = 4
) => {
  const factor =
    10 ** precision;

  return Math.round(value * factor) /
    factor;
};

const COMPOSITOR_HANDOFF =
  getHEarth3DCompositorRendererHandoff();

const COMPOSITOR_RECEIPT =
  getHEarth3DCompositorReceipt();

const RENDERER_OWNED_LAYER_IDS =
  H_EARTH_3D_COMPOSITION_LAYER_ORDER.filter(
    (layerId) =>
      layerId !==
      H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
  );

const DEFAULT_VISIBLE_LAYER_IDS =
  COMPOSITOR_HANDOFF
    .composition
    .visibilityPolicy
    .defaultVisibleLayerIds
    .filter(
      (layerId) =>
        layerId !==
        H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
    );

/**
 * Renderer boundary flags.
 */
export const H_EARTH_3D_RENDERER_BOUNDARY_FLAGS = deepFreeze({
  ownsProjectionMathematics: true,
  ownsProjectedPrimitiveConstruction: true,
  ownsDOMCSSMaterialization: true,
  ownsSemanticLayerContainers: true,
  ownsCameraDepthSorting: true,
  ownsRendererMountLifecycle: true,
  ownsRendererReceipt: true,

  ownsPath3Authority: false,
  ownsMatrixAuthority: false,
  ownsGroundCellBindingAuthority: false,
  ownsBoundaryAuthority: false,
  ownsObjectAuthority: false,
  ownsZoneAuthority: false,
  ownsLandscapeLatticeAuthority: false,
  ownsEnvironmentMeaning: false,
  ownsSemanticLayerOrder: false,

  ownsCameraInputBehavior: false,
  ownsControllerBehavior: false,
  ownsRouteBootstrap: false,
  ownsDiagnosticJudgment: false,
  ownsActionExecution: false,
  ownsReadoutGeneration: false,
  ownsNonRendererReceiptCustody: false,

  createsActor: false,
  createsCollisionSystem: false,
  createsGroundContactSystem: false,
  createsTraversalSystem: false,
  createsGameplayLoop: false,
  createsFluidSimulation: false,

  matrixCollapse: false
});

/**
 * Upstream dependency record.
 */
export const H_EARTH_3D_RENDERER_SOURCE_REFERENCES = deepFreeze({
  capacity: deepFreeze({
    path:
      '/showroom/globe/h-earth/capacity.js',

    contractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    usage:
      'NARROW_CAPACITY_EVALUATION_AND_LIMITS'
  }),

  compositor: deepFreeze({
    path:
      '/showroom/globe/h-earth/compositor.js',

    contractId:
      H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

    usage:
      'PRIMARY_SEMANTIC_RENDERER_INPUT'
  }),

  normalizedUpstream: deepFreeze({
    environmentContractId:
      COMPOSITOR_HANDOFF.environmentContractId,

    bindingExpression:
      COMPOSITOR_HANDOFF
        .bindingIdentity
        .bindingExpression,

    activeCell:
      COMPOSITOR_HANDOFF
        .bindingIdentity
        .activeCell,

    spatialCellId:
      COMPOSITOR_HANDOFF
        .bindingIdentity
        .spatialCellId,

    sceneIdentity:
      COMPOSITOR_HANDOFF
        .bindingIdentity
        .sceneIdentity
  }),

  directImportsForbidden: deepFreeze([
    '/h-earth-3d/boundaries/matrix-boundaries.js',
    '/h-earth-3d/objects/ground-cell-001.objects.js',
    '/h-earth-3d/zones/ground-cell-001.zones.js',
    '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
    '/h-earth-3d/actions/inspect-ground.js',
    '/h-earth-3d/readouts/ground-condition-read.js',
    '/h-earth-3d/h-earth.receipts.js',
    '/showroom/globe/h-earth/controller.js'
  ])
});

/**
 * Renderer binding identity.
 */
export const H_EARTH_3D_RENDERER_BINDING_IDENTITY = deepFreeze({
  compositorContractId:
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

  capacityContractId:
    COMPOSITOR_HANDOFF.capacityContractId,

  environmentContractId:
    COMPOSITOR_HANDOFF.environmentContractId,

  matrix:
    COMPOSITOR_HANDOFF.bindingIdentity.matrix,

  matrixRole:
    COMPOSITOR_HANDOFF.bindingIdentity.matrixRole,

  activeCell:
    COMPOSITOR_HANDOFF.bindingIdentity.activeCell,

  domainCellId:
    COMPOSITOR_HANDOFF.bindingIdentity.domainCellId,

  spatialCellId:
    COMPOSITOR_HANDOFF.bindingIdentity.spatialCellId,

  bindingExpression:
    COMPOSITOR_HANDOFF
      .bindingIdentity
      .bindingExpression,

  sceneIdentity:
    COMPOSITOR_HANDOFF
      .bindingIdentity
      .sceneIdentity,

  coordinateFrame:
    COMPOSITOR_HANDOFF.coordinateFrame,

  descriptorOnlyUpstream: true,

  runtimeActivationAuthorized: false,
  visualPassAuthorized: false
});

/**
 * Render-stage implementation contract.
 */
export const H_EARTH_3D_RENDERER_STAGE_MODEL = deepFreeze({
  outputModel:
    H_EARTH_3D_RENDER_STAGE_LIMITS
      .permittedOutputModel,

  DOMAuthorized:
    H_EARTH_3D_RENDER_STAGE_LIMITS
      .domAuthorized,

  CSSAuthorized:
    H_EARTH_3D_RENDER_STAGE_LIMITS
      .cssAuthorized,

  CSSClipPathAuthorized:
    H_EARTH_3D_RENDER_STAGE_LIMITS
      .cssClipPathAuthorized,

  CSSGradientsAuthorized:
    H_EARTH_3D_RENDER_STAGE_LIMITS
      .cssGradientsAuthorized,

  webGLAuthorized: false,
  canvasAuthorized: false,
  iframeAuthorized: false,
  SVGDependencyAuthorized: false,

  rendererMountId:
    H_EARTH_3D_PUBLIC_STAGE_IDS
      .rendererMountId,

  stageClass:
    'h-earth-3d-render-stage',

  sceneRootClass:
    'h-earth-3d-render-scene',

  layerClass:
    'h-earth-3d-render-layer',

  primitiveClass:
    'h-earth-3d-render-primitive'
});

/**
 * Candidate projection camera.
 *
 * The values originate from the compositor-normalized capacity handoff.
 * This file computes projection from them but does not own controller behavior.
 */
export const H_EARTH_3D_RENDERER_CAMERA = deepFreeze({
  model:
    COMPOSITOR_HANDOFF
      .cameraCapacity
      .cameraModel,

  position: deepFreeze({
    ...COMPOSITOR_HANDOFF
      .cameraCapacity
      .initialProjectionCandidate
      .position
  }),

  target: deepFreeze({
    ...COMPOSITOR_HANDOFF
      .cameraCapacity
      .initialProjectionCandidate
      .target
  }),

  up: deepFreeze({
    ...COMPOSITOR_HANDOFF
      .cameraCapacity
      .initialProjectionCandidate
      .up
  }),

  verticalFovDegrees:
    COMPOSITOR_HANDOFF
      .cameraCapacity
      .initialProjectionCandidate
      .verticalFovDegrees,

  nearPlane:
    COMPOSITOR_HANDOFF
      .cameraCapacity
      .initialProjectionCandidate
      .nearPlane,

  farPlane:
    COMPOSITOR_HANDOFF
      .cameraCapacity
      .initialProjectionCandidate
      .farPlane,

  controllerOwned: false,
  staticProjectionCandidate: true
});

/**
 * Material presentation candidates.
 *
 * These are renderer presentation choices only.
 * They do not redefine environment material identity.
 */
export const H_EARTH_3D_RENDERER_MATERIAL_PRESENTATION =
  deepFreeze({
    H_EARTH_MATERIAL_SKY: deepFreeze({
      background:
        'linear-gradient(180deg, #526f80 0%, #78959c 34%, #a8b5b1 49%, #6a8d91 64%, #425b63 100%)',

      opacity: 1
    }),

    H_EARTH_MATERIAL_ATMOSPHERE: deepFreeze({
      background:
        'radial-gradient(circle at 52% 34%, rgba(228,235,228,0.34) 0%, rgba(205,220,216,0.16) 32%, rgba(93,119,126,0.04) 72%, rgba(31,48,57,0) 100%)',

      opacity: 1
    }),

    H_EARTH_MATERIAL_HAZE: deepFreeze({
      background:
        'linear-gradient(180deg, rgba(219,225,216,0) 0%, rgba(213,223,217,0.24) 44%, rgba(189,204,202,0.3) 51%, rgba(98,130,137,0.06) 100%)',

      opacity: 1
    }),

    H_EARTH_MATERIAL_DRY_SAND: deepFreeze({
      background:
        'linear-gradient(180deg, #9d8a68 0%, #7f7058 52%, #655b4d 100%)',

      boxShadow:
        'inset 0 1px 0 rgba(255,255,255,0.08)'
    }),

    H_EARTH_MATERIAL_WET_SAND: deepFreeze({
      background:
        'linear-gradient(180deg, #5c594f 0%, #4a4943 46%, #373a38 100%)',

      boxShadow:
        'inset 0 1px 0 rgba(205,220,212,0.08)'
    }),

    H_EARTH_MATERIAL_FOAM: deepFreeze({
      background:
        'linear-gradient(180deg, rgba(243,244,232,0.93) 0%, rgba(218,226,218,0.82) 58%, rgba(177,197,196,0.4) 100%)',

      filter:
        'drop-shadow(0 1px 1px rgba(26,47,53,0.34))'
    }),

    H_EARTH_MATERIAL_NEARSHORE_WATER: deepFreeze({
      background:
        'linear-gradient(180deg, rgba(66,126,143,0.92) 0%, rgba(39,101,122,0.94) 48%, rgba(26,75,96,0.96) 100%)',

      boxShadow:
        'inset 0 1px 0 rgba(191,224,225,0.15)'
    }),

    H_EARTH_MATERIAL_OPEN_WATER: deepFreeze({
      background:
        'linear-gradient(180deg, #2e6f83 0%, #20566d 48%, #153f56 100%)',

      boxShadow:
        'inset 0 1px 0 rgba(188,220,224,0.12)'
    }),

    H_EARTH_MATERIAL_WAVE: deepFreeze({
      background:
        'linear-gradient(180deg, rgba(208,229,226,0.68) 0%, rgba(130,177,181,0.52) 50%, rgba(58,121,139,0.12) 100%)',

      filter:
        'drop-shadow(0 1px 1px rgba(15,54,67,0.42))'
    }),

    H_EARTH_MATERIAL_TIDE_POOL: deepFreeze({
      background:
        'radial-gradient(ellipse at 46% 38%, rgba(111,175,181,0.94) 0%, rgba(45,110,127,0.9) 46%, rgba(28,65,78,0.98) 100%)',

      boxShadow:
        'inset 0 2px 4px rgba(7,31,38,0.55), 0 1px 0 rgba(190,220,213,0.14)'
    }),

    H_EARTH_MATERIAL_STONE: deepFreeze({
      background:
        'linear-gradient(145deg, #777469 0%, #55554e 54%, #333834 100%)',

      boxShadow:
        'inset -2px -3px 4px rgba(22,24,22,0.34), 0 2px 3px rgba(15,20,19,0.28)'
    }),

    H_EARTH_MATERIAL_JAGGED_ROCK: deepFreeze({
      background:
        'linear-gradient(140deg, #575b57 0%, #3b403d 48%, #252b29 100%)',

      filter:
        'drop-shadow(0 4px 4px rgba(15,20,20,0.42))'
    }),

    H_EARTH_MATERIAL_BLUFF: deepFreeze({
      background:
        'linear-gradient(165deg, #5f6254 0%, #444a41 48%, #292f2b 100%)',

      filter:
        'drop-shadow(0 5px 5px rgba(17,25,25,0.28))'
    }),

    H_EARTH_MATERIAL_MANOR_CONTEXT: deepFreeze({
      background:
        'linear-gradient(180deg, #697069 0%, #464d49 55%, #303633 100%)',

      filter:
        'drop-shadow(0 3px 4px rgba(20,28,28,0.34))'
    }),

    H_EARTH_MATERIAL_OFFSHORE_ISLET: deepFreeze({
      background:
        'linear-gradient(150deg, #4e5b58 0%, #354440 52%, #23322f 100%)',

      filter:
        'drop-shadow(0 2px 3px rgba(17,35,38,0.28))'
    }),

    H_EARTH_MATERIAL_INSPECTION_ANCHOR: deepFreeze({
      background:
        'radial-gradient(circle, rgba(231,220,170,0.96) 0%, rgba(190,169,96,0.84) 36%, rgba(85,72,35,0.2) 70%, rgba(85,72,35,0) 100%)',

      boxShadow:
        '0 0 0 1px rgba(239,229,184,0.48), 0 0 12px rgba(220,195,112,0.34)'
    })
  });

/**
 * Internal renderer state.
 */
const rendererState = {
  mounted: false,

  mountElement: null,
  stageElement: null,
  sceneElement: null,

  layerElements: new Map(),
  primitiveElements: [],

  currentViewport: null,
  currentCamera: null,
  currentProjection: null,

  visibleLayerIds: [
    ...DEFAULT_VISIBLE_LAYER_IDS
  ],

  lastMountReceipt: null,
  lastRenderReceipt: null,
  lastDestroyReceipt: null,

  mountCounter: 0,
  renderCounter: 0
};

/**
 * Resolves the normalized camera basis.
 */
export function resolveHEarth3DCameraBasis(
  camera =
    H_EARTH_3D_RENDERER_CAMERA
) {
  const position =
    createVector(
      camera.position.x,
      camera.position.y,
      camera.position.z
    );

  const target =
    createVector(
      camera.target.x,
      camera.target.y,
      camera.target.z
    );

  const worldUp =
    createVector(
      camera.up.x,
      camera.up.y,
      camera.up.z
    );

  const forward =
    normalizeVector(
      subtractVector(
        target,
        position
      )
    );

  const right =
    normalizeVector(
      crossVector(
        worldUp,
        forward
      )
    );

  const up =
    normalizeVector(
      crossVector(
        forward,
        right
      )
    );

  const focalLength =
    1 /
    Math.tan(
      toRadians(
        camera.verticalFovDegrees
      ) /
      2
    );

  return deepFreeze({
    position: deepFreeze(position),
    target: deepFreeze(target),

    forward: deepFreeze(forward),
    right: deepFreeze(right),
    up: deepFreeze(up),

    focalLength,

    nearPlane:
      camera.nearPlane,

    farPlane:
      camera.farPlane,

    verticalFovDegrees:
      camera.verticalFovDegrees
  });
}

/**
 * Resolves viewport metrics.
 */
export function resolveHEarth3DViewportMetrics({
  widthPx,
  heightPx,
  pixelRatio = 1
} = {}) {
  const width =
    isFiniteNumber(widthPx)
      ? Math.max(0, widthPx)
      : 0;

  const height =
    isFiniteNumber(heightPx)
      ? Math.max(0, heightPx)
      : 0;

  const aspectRatio =
    height > 0
      ? width / height
      : 0;

  const capacityEvaluation =
    evaluateHEarth3DViewportCapacity({
      widthPx: width,
      heightPx: height,
      pixelRatio
    });

  return deepFreeze({
    widthPx: width,
    heightPx: height,
    aspectRatio,
    pixelRatio,
    capacityEvaluation
  });
}

/**
 * Projects one world-space point.
 */
export function projectHEarth3DWorldPoint(
  point,
  projectionContext
) {
  if (
    !point ||
    !projectionContext
  ) {
    return deepFreeze({
      visible: false,
      reason: 'MISSING_POINT_OR_PROJECTION_CONTEXT'
    });
  }

  const {
    cameraBasis,
    viewport
  } = projectionContext;

  const worldPoint =
    createVector(
      point.x,
      point.y,
      point.z
    );

  const relative =
    subtractVector(
      worldPoint,
      cameraBasis.position
    );

  const cameraX =
    dotVector(
      relative,
      cameraBasis.right
    );

  const cameraY =
    dotVector(
      relative,
      cameraBasis.up
    );

  const cameraZ =
    dotVector(
      relative,
      cameraBasis.forward
    );

  if (
    cameraZ <=
      cameraBasis.nearPlane ||
    cameraZ >=
      cameraBasis.farPlane
  ) {
    return deepFreeze({
      visible: false,
      cameraDepth: cameraZ,
      reason: 'OUTSIDE_CAMERA_DEPTH_RANGE'
    });
  }

  const ndcX =
    (
      cameraX *
      cameraBasis.focalLength
    ) /
    (
      cameraZ *
      viewport.aspectRatio
    );

  const ndcY =
    (
      cameraY *
      cameraBasis.focalLength
    ) /
    cameraZ;

  const screenX =
    (ndcX + 1) *
    0.5 *
    viewport.widthPx;

  const screenY =
    (1 - ndcY) *
    0.5 *
    viewport.heightPx;

  return deepFreeze({
    visible: true,

    world: deepFreeze({
      x: point.x,
      y: point.y,
      z: point.z
    }),

    camera: deepFreeze({
      x: cameraX,
      y: cameraY,
      z: cameraZ
    }),

    ndc: deepFreeze({
      x: ndcX,
      y: ndcY
    }),

    screen: deepFreeze({
      x: screenX,
      y: screenY
    }),

    cameraDepth: cameraZ
  });
}

/**
 * Projects a world-space polygon.
 */
export function projectHEarth3DWorldPolygon(
  points,
  projectionContext
) {
  if (
    !Array.isArray(points) ||
    points.length < 3
  ) {
    return deepFreeze({
      visible: false,
      reason: 'POLYGON_REQUIRES_AT_LEAST_THREE_POINTS',
      points: deepFreeze([])
    });
  }

  const projectedPoints =
    points.map(
      (point) =>
        projectHEarth3DWorldPoint(
          point,
          projectionContext
        )
    );

  const visiblePoints =
    projectedPoints.filter(
      (point) =>
        point.visible
    );

  if (visiblePoints.length < 3) {
    return deepFreeze({
      visible: false,
      reason: 'INSUFFICIENT_VISIBLE_POLYGON_POINTS',
      points: deepFreeze(projectedPoints)
    });
  }

  const averageDepth =
    visiblePoints.reduce(
      (sum, point) =>
        sum + point.cameraDepth,
      0
    ) /
    visiblePoints.length;

  const clipPath =
    visiblePoints
      .map(
        (point) =>
          `${round(point.screen.x, 2)}px ${round(point.screen.y, 2)}px`
      )
      .join(', ');

  return deepFreeze({
    visible: true,

    points:
      deepFreeze(projectedPoints),

    visiblePoints:
      deepFreeze(visiblePoints),

    averageDepth,

    clipPath:
      `polygon(${clipPath})`
  });
}

/**
 * Renderer-only shallow surface candidate.
 *
 * This stays inside the environment-supplied permitted elevation envelope.
 * It is not a collision or walkability surface.
 */
export function resolveHEarth3DProjectedGroundElevation(
  x,
  z
) {
  const broad =
    0.045 *
    Math.sin(
      x * 0.27 +
      z * 0.13
    );

  const cross =
    0.022 *
    Math.sin(
      x * 0.53 -
      z * 0.19
    );

  const shorelineDepression =
    -0.085 *
    smoothstep(
      10.8,
      14.1,
      z
    );

  return clamp(
    broad +
      cross +
      shorelineDepression,
    -0.18,
    0.12
  );
}

/**
 * Renderer-only shoreline profile construction.
 *
 * The profile remains within the environment-supplied permitted range.
 */
export function resolveHEarth3DProjectedShorelineDepth(
  x
) {
  const shoreline =
    COMPOSITOR_HANDOFF
      .environment
      .shoreline;

  const primaryAmplitude =
    Math.min(
      0.54,
      shoreline
        .profileCapacity
        .primaryAmplitudeMaximum
    );

  const secondaryAmplitude =
    Math.min(
      0.22,
      shoreline
        .profileCapacity
        .secondaryAmplitudeMaximum
    );

  const depth =
    shoreline.nominalDepthZ +
    primaryAmplitude *
      Math.sin(
        x * 0.29 +
        0.4
      ) +
    secondaryAmplitude *
      Math.sin(
        x * 0.71 -
        0.85
      );

  return clamp(
    depth,
    shoreline
      .permittedDepthRange
      .zMin,
    shoreline
      .permittedDepthRange
      .zMax
  );
}

/**
 * Creates a projection context.
 */
export function createHEarth3DProjectionContext({
  widthPx,
  heightPx,
  pixelRatio = 1,
  camera =
    H_EARTH_3D_RENDERER_CAMERA
} = {}) {
  const viewport =
    resolveHEarth3DViewportMetrics({
      widthPx,
      heightPx,
      pixelRatio
    });

  const cameraBasis =
    resolveHEarth3DCameraBasis(
      camera
    );

  return deepFreeze({
    viewport,
    camera,
    cameraBasis
  });
}

const setStyles = (
  element,
  styles
) => {
  for (
    const [property, value]
    of Object.entries(styles)
  ) {
    if (
      value !== null &&
      value !== undefined
    ) {
      element.style[property] =
        String(value);
    }
  }

  return element;
};

const applyMaterialPresentation = (
  element,
  materialId
) => {
  const presentation =
    H_EARTH_3D_RENDERER_MATERIAL_PRESENTATION[
      materialId
    ];

  if (!presentation) {
    return element;
  }

  setStyles(
    element,
    presentation
  );

  element.dataset.materialId =
    materialId;

  return element;
};

const createLayerElement = (
  layerDescriptor
) => {
  const element =
    document.createElement('div');

  element.className =
    `${H_EARTH_3D_RENDERER_STAGE_MODEL.layerClass} ` +
    `${H_EARTH_3D_RENDERER_STAGE_MODEL.layerClass}--${layerDescriptor.key}`;

  element.dataset.layerId =
    layerDescriptor.id;

  element.dataset.layerKey =
    layerDescriptor.key;

  element.dataset.semanticRole =
    layerDescriptor.semanticRole;

  element.dataset.groupId =
    layerDescriptor.groupId;

  setStyles(element, {
    position: 'absolute',
    inset: '0',
    overflow: 'visible',
    pointerEvents:
      layerDescriptor.id ===
      H_EARTH_3D_COMPOSITION_LAYER_IDS.inspectionAnchor
        ? 'auto'
        : 'none'
  });

  return element;
};

const createPrimitiveElement = ({
  layerId,
  primitiveId,
  primitiveClass,
  materialId = null,
  cameraDepth = 0,
  interactive = false
}) => {
  const element =
    document.createElement('div');

  element.className =
    `${H_EARTH_3D_RENDERER_STAGE_MODEL.primitiveClass} ` +
    `${H_EARTH_3D_RENDERER_STAGE_MODEL.primitiveClass}--${primitiveClass}`;

  element.dataset.layerId =
    layerId;

  element.dataset.primitiveId =
    primitiveId;

  element.dataset.primitiveClass =
    primitiveClass;

  element.dataset.cameraDepth =
    String(round(cameraDepth, 4));

  setStyles(element, {
    position: 'absolute',
    inset: '0',
    transformOrigin: '50% 50%',
    pointerEvents:
      interactive
        ? 'auto'
        : 'none'
  });

  if (materialId) {
    applyMaterialPresentation(
      element,
      materialId
    );
  }

  return element;
};

const resolveDepthZIndex = (
  cameraDepth,
  semanticIndex,
  localOffset = 0
) => {
  const depthComponent =
    Math.round(
      100000 -
      cameraDepth * 100
    );

  const semanticComponent =
    semanticIndex * 1000;

  return (
    depthComponent +
    semanticComponent +
    localOffset
  );
};

const getSemanticIndex = (
  layerId
) =>
  Math.max(
    0,
    H_EARTH_3D_COMPOSITION_LAYER_ORDER
      .indexOf(layerId)
  );

const appendPrimitive = (
  layerElement,
  element
) => {
  layerElement.appendChild(element);

  rendererState
    .primitiveElements
    .push(element);

  return element;
};

const createPolygonPrimitive = ({
  layerDescriptor,
  primitiveId,
  primitiveClass,
  materialId,
  points,
  projectionContext,
  opacity = 1,
  localZOffset = 0
}) => {
  const projection =
    projectHEarth3DWorldPolygon(
      points,
      projectionContext
    );

  if (!projection.visible) {
    return null;
  }

  const element =
    createPrimitiveElement({
      layerId:
        layerDescriptor.id,

      primitiveId,
      primitiveClass,
      materialId,

      cameraDepth:
        projection.averageDepth
    });

  setStyles(element, {
    clipPath:
      projection.clipPath,

    opacity,

    zIndex:
      resolveDepthZIndex(
        projection.averageDepth,
        getSemanticIndex(
          layerDescriptor.id
        ),
        localZOffset
      )
  });

  return element;
};

const createWorldRectanglePoints = ({
  xMin,
  xMax,
  zMin,
  zMax,
  yResolver
}) => [
  createVector(
    xMin,
    yResolver(xMin, zMin),
    zMin
  ),

  createVector(
    xMax,
    yResolver(xMax, zMin),
    zMin
  ),

  createVector(
    xMax,
    yResolver(xMax, zMax),
    zMax
  ),

  createVector(
    xMin,
    yResolver(xMin, zMax),
    zMax
  )
];

const createBands = ({
  layerDescriptor,
  materialId,
  xMin,
  xMax,
  zMin,
  zMax,
  bandCount,
  yResolver,
  projectionContext,
  primitivePrefix,
  opacityResolver = () => 1
}) => {
  const primitives = [];

  for (
    let index = 0;
    index < bandCount;
    index += 1
  ) {
    const startAmount =
      index / bandCount;

    const endAmount =
      (index + 1) / bandCount;

    const bandZMin =
      lerp(
        zMin,
        zMax,
        startAmount
      );

    const bandZMax =
      lerp(
        zMin,
        zMax,
        endAmount
      );

    const primitive =
      createPolygonPrimitive({
        layerDescriptor,

        primitiveId:
          `${primitivePrefix}_${String(index + 1).padStart(2, '0')}`,

        primitiveClass:
          'surface-band',

        materialId,

        points:
          createWorldRectanglePoints({
            xMin,
            xMax,
            zMin: bandZMin,
            zMax: bandZMax,
            yResolver
          }),

        projectionContext,

        opacity:
          opacityResolver(
            (
              bandZMin +
              bandZMax
            ) /
            2
          ),

        localZOffset: index
      });

    if (primitive) {
      primitives.push(primitive);
    }
  }

  return primitives;
};

const createCurveRibbonPoints = ({
  xMin,
  xMax,
  sampleCount,
  centerDepthResolver,
  width,
  yResolver
}) => {
  const nearPoints = [];
  const farPoints = [];

  for (
    let index = 0;
    index < sampleCount;
    index += 1
  ) {
    const amount =
      sampleCount <= 1
        ? 0
        : index /
          (sampleCount - 1);

    const x =
      lerp(
        xMin,
        xMax,
        amount
      );

    const centerZ =
      centerDepthResolver(
        x,
        index
      );

    const nearZ =
      centerZ -
      width / 2;

    const farZ =
      centerZ +
      width / 2;

    nearPoints.push(
      createVector(
        x,
        yResolver(
          x,
          nearZ,
          index
        ),
        nearZ
      )
    );

    farPoints.push(
      createVector(
        x,
        yResolver(
          x,
          farZ,
          index
        ),
        farZ
      )
    );
  }

  return [
    ...nearPoints,
    ...farPoints.reverse()
  ];
};

const buildSkyLayer = ({
  layerDescriptor,
  layerElement
}) => {
  const primitive =
    createPrimitiveElement({
      layerId:
        layerDescriptor.id,

      primitiveId:
        'H_EARTH_SKY_BACKGROUND',

      primitiveClass:
        'sky-background',

      materialId:
        layerDescriptor.materialId,

      cameraDepth:
        H_EARTH_3D_RENDERER_CAMERA
          .farPlane -
        0.1
    });

  setStyles(primitive, {
    inset: '0',
    zIndex: 0
  });

  appendPrimitive(
    layerElement,
    primitive
  );
};

const buildAtmosphereLayer = ({
  layerDescriptor,
  layerElement
}) => {
  const primary =
    createPrimitiveElement({
      layerId:
        layerDescriptor.id,

      primitiveId:
        'H_EARTH_ATMOSPHERE_PRIMARY',

      primitiveClass:
        'atmosphere-overlay',

      materialId:
        layerDescriptor.materialId,

      cameraDepth:
        H_EARTH_3D_RENDERER_CAMERA
          .farPlane -
        0.2
    });

  setStyles(primary, {
    inset: '0',
    zIndex: 1
  });

  appendPrimitive(
    layerElement,
    primary
  );

  const horizonHaze =
    createPrimitiveElement({
      layerId:
        layerDescriptor.id,

      primitiveId:
        'H_EARTH_ATMOSPHERE_HORIZON_HAZE',

      primitiveClass:
        'horizon-haze-overlay',

      materialId:
        COMPOSITOR_HANDOFF
          .environment
          .materials
          .haze
          .id,

      cameraDepth:
        H_EARTH_3D_RENDERER_CAMERA
          .farPlane -
        0.3
    });

  setStyles(horizonHaze, {
    inset: '30% 0 28% 0',
    opacity: 0.86,
    zIndex: 2
  });

  appendPrimitive(
    layerElement,
    horizonHaze
  );
};

const buildHorizonLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  const water =
    COMPOSITOR_HANDOFF.environment.water;

  const farLeft =
    projectHEarth3DWorldPoint(
      createVector(
        water.openWater.xMin,
        water.waterDatumY,
        water.openWater.zMax
      ),
      projectionContext
    );

  const farRight =
    projectHEarth3DWorldPoint(
      createVector(
        water.openWater.xMax,
        water.waterDatumY,
        water.openWater.zMax
      ),
      projectionContext
    );

  if (
    !farLeft.visible ||
    !farRight.visible
  ) {
    return;
  }

  const horizonY =
    (
      farLeft.screen.y +
      farRight.screen.y
    ) /
    2;

  const primitive =
    createPrimitiveElement({
      layerId:
        layerDescriptor.id,

      primitiveId:
        'H_EARTH_DERIVED_HORIZON',

      primitiveClass:
        'derived-horizon',

      materialId:
        layerDescriptor.materialId,

      cameraDepth:
        (
          farLeft.cameraDepth +
          farRight.cameraDepth
        ) /
        2
    });

  setStyles(primitive, {
    left: '0',
    right: '0',
    top:
      `${round(horizonY - 16, 2)}px`,

    height: '32px',
    opacity: 0.58,

    zIndex:
      resolveDepthZIndex(
        primitive.dataset.cameraDepth,
        getSemanticIndex(
          layerDescriptor.id
        )
      )
  });

  appendPrimitive(
    layerElement,
    primitive
  );
};

const buildOpenWaterLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  const water =
    COMPOSITOR_HANDOFF.environment.water;

  const primitives =
    createBands({
      layerDescriptor,

      materialId:
        layerDescriptor.materialId,

      xMin:
        water.openWater.xMin,

      xMax:
        water.openWater.xMax,

      zMin:
        water.openWater.zMin,

      zMax:
        water.openWater.zMax,

      bandCount:
        COMPOSITOR_HANDOFF
          .environment
          .primitivePlan
          .substrate
          .openWaterBands,

      yResolver: () =>
        water.waterDatumY,

      projectionContext,

      primitivePrefix:
        'H_EARTH_OPEN_WATER_BAND',

      opacityResolver: (z) =>
        lerp(
          0.96,
          0.72,
          smoothstep(
            water.openWater.zMin,
            water.openWater.zMax,
            z
          )
        )
    });

  for (const primitive of primitives) {
    appendPrimitive(
      layerElement,
      primitive
    );
  }
};

const buildNearshoreWaterLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  const water =
    COMPOSITOR_HANDOFF.environment.water;

  const primitives =
    createBands({
      layerDescriptor,

      materialId:
        layerDescriptor.materialId,

      xMin:
        water.nearshore.xMin,

      xMax:
        water.nearshore.xMax,

      zMin:
        water.nearshore.zMin,

      zMax:
        water.nearshore.zMax,

      bandCount:
        COMPOSITOR_HANDOFF
          .environment
          .primitivePlan
          .substrate
          .nearshoreWaterBands,

      yResolver: () =>
        water.waterDatumY,

      projectionContext,

      primitivePrefix:
        'H_EARTH_NEARSHORE_WATER_BAND',

      opacityResolver: (z) =>
        lerp(
          0.98,
          0.86,
          smoothstep(
            water.nearshore.zMin,
            water.nearshore.zMax,
            z
          )
        )
    });

  for (const primitive of primitives) {
    appendPrimitive(
      layerElement,
      primitive
    );
  }
};

const buildWaveLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  const water =
    COMPOSITOR_HANDOFF.environment.water;

  const waveBands =
    water.waveBands;

  waveBands
    .depthCandidates
    .slice(
      0,
      waveBands.count
    )
    .forEach(
      (
        baseDepth,
        waveIndex
      ) => {
        const points =
          createCurveRibbonPoints({
            xMin: -13.5,
            xMax: 13.5,
            sampleCount: 25,

            centerDepthResolver: (
              x
            ) =>
              baseDepth +
              0.18 *
                Math.sin(
                  x * 0.43 +
                  waveIndex * 1.31
                ),

            width:
              waveBands.preferredRibbonWidth,

            yResolver: (
              x,
              z
            ) =>
              water.waterDatumY +
              0.035 +
              0.018 *
                Math.sin(
                  x * 0.51 +
                  waveIndex * 0.92 +
                  z * 0.04
                )
          });

        const primitive =
          createPolygonPrimitive({
            layerDescriptor,

            primitiveId:
              `H_EARTH_WAVE_RIBBON_${String(waveIndex + 1).padStart(2, '0')}`,

            primitiveClass:
              'wave-ribbon',

            materialId:
              layerDescriptor.materialId,

            points,
            projectionContext,

            opacity:
              waveIndex === 0
                ? 0.86
                : 0.68
          });

        if (primitive) {
          appendPrimitive(
            layerElement,
            primitive
          );
        }
      }
    );
};

const buildShorelineFoamLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  const shoreline =
    COMPOSITOR_HANDOFF
      .environment
      .shoreline;

  const points =
    createCurveRibbonPoints({
      xMin:
        shoreline.xMin,

      xMax:
        shoreline.xMax,

      sampleCount:
        shoreline
          .profileCapacity
          .preferredSampleCount,

      centerDepthResolver: (x) =>
        resolveHEarth3DProjectedShorelineDepth(
          x
        ),

      width:
        shoreline
          .foamContact
          .preferredWidth,

      yResolver: (
        x,
        z
      ) =>
        resolveHEarth3DProjectedGroundElevation(
          x,
          z
        ) +
        0.025
    });

  const primitive =
    createPolygonPrimitive({
      layerDescriptor,

      primitiveId:
        'H_EARTH_SHORELINE_FOAM_RIBBON',

      primitiveClass:
        'shoreline-foam-ribbon',

      materialId:
        layerDescriptor.materialId,

      points,
      projectionContext,
      opacity: 0.94
    });

  if (primitive) {
    appendPrimitive(
      layerElement,
      primitive
    );
  }
};

const buildGroundLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext,
  sourceDescriptor,
  bandCount,
  primitivePrefix
}) => {
  const primitives =
    createBands({
      layerDescriptor,

      materialId:
        layerDescriptor.materialId,

      xMin:
        sourceDescriptor.xMin,

      xMax:
        sourceDescriptor.xMax,

      zMin:
        sourceDescriptor.zMin,

      zMax:
        sourceDescriptor.zMax,

      bandCount,

      yResolver:
        resolveHEarth3DProjectedGroundElevation,

      projectionContext,
      primitivePrefix
    });

  for (const primitive of primitives) {
    appendPrimitive(
      layerElement,
      primitive
    );
  }
};

const projectEllipse = ({
  center,
  radiusX,
  radiusZ,
  y,
  projectionContext
}) => {
  const centerProjection =
    projectHEarth3DWorldPoint(
      createVector(
        center.x,
        y,
        center.z
      ),
      projectionContext
    );

  const xProjection =
    projectHEarth3DWorldPoint(
      createVector(
        center.x + radiusX,
        y,
        center.z
      ),
      projectionContext
    );

  const zProjection =
    projectHEarth3DWorldPoint(
      createVector(
        center.x,
        y,
        center.z + radiusZ
      ),
      projectionContext
    );

  if (
    !centerProjection.visible ||
    !xProjection.visible ||
    !zProjection.visible
  ) {
    return null;
  }

  const width =
    Math.max(
      2,
      Math.abs(
        xProjection.screen.x -
        centerProjection.screen.x
      ) *
      2
    );

  const height =
    Math.max(
      2,
      Math.abs(
        zProjection.screen.y -
        centerProjection.screen.y
      ) *
      2
    );

  return {
    centerProjection,
    width,
    height
  };
};

const buildTidePoolLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  for (
    const pool
    of COMPOSITOR_HANDOFF
      .environment
      .tidePools
  ) {
    const groundY =
      resolveHEarth3DProjectedGroundElevation(
        pool.center.x,
        pool.center.z
      );

    const ellipse =
      projectEllipse({
        center:
          pool.center,

        radiusX:
          pool.radiusX,

        radiusZ:
          pool.radiusZ,

        y:
          groundY -
          pool.candidateDepressionDepth,

        projectionContext
      });

    if (!ellipse) {
      continue;
    }

    const primitive =
      createPrimitiveElement({
        layerId:
          layerDescriptor.id,

        primitiveId:
          pool.id,

        primitiveClass:
          'tide-pool',

        materialId:
          layerDescriptor.materialId,

        cameraDepth:
          ellipse
            .centerProjection
            .cameraDepth
      });

    setStyles(primitive, {
      left:
        `${round(
          ellipse.centerProjection.screen.x -
          ellipse.width / 2,
          2
        )}px`,

      top:
        `${round(
          ellipse.centerProjection.screen.y -
          ellipse.height / 2,
          2
        )}px`,

      width:
        `${round(ellipse.width, 2)}px`,

      height:
        `${round(ellipse.height, 2)}px`,

      borderRadius: '50%',

      transform:
        `rotate(${pool.rotationDegrees}deg)`,

      zIndex:
        resolveDepthZIndex(
          ellipse
            .centerProjection
            .cameraDepth,

          getSemanticIndex(
            layerDescriptor.id
          )
        )
    });

    appendPrimitive(
      layerElement,
      primitive
    );
  }
};

const buildStoneLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  for (
    const stone
    of COMPOSITOR_HANDOFF
      .environment
      .stones
  ) {
    const groundY =
      resolveHEarth3DProjectedGroundElevation(
        stone.x,
        stone.z
      );

    const ellipse =
      projectEllipse({
        center: {
          x: stone.x,
          z: stone.z
        },

        radiusX:
          stone.radiusX,

        radiusZ:
          stone.radiusZ,

        y:
          groundY +
          stone.height * 0.45,

        projectionContext
      });

    if (!ellipse) {
      continue;
    }

    const heightProjection =
      projectHEarth3DWorldPoint(
        createVector(
          stone.x,
          groundY +
            stone.height,
          stone.z
        ),
        projectionContext
      );

    const visualHeight =
      heightProjection.visible
        ? Math.max(
            ellipse.height,
            Math.abs(
              heightProjection.screen.y -
              ellipse
                .centerProjection
                .screen.y
            ) *
            2
          )
        : ellipse.height;

    const primitive =
      createPrimitiveElement({
        layerId:
          layerDescriptor.id,

        primitiveId:
          stone.id,

        primitiveClass:
          'grounded-stone',

        materialId:
          layerDescriptor.materialId,

        cameraDepth:
          ellipse
            .centerProjection
            .cameraDepth
      });

    setStyles(primitive, {
      left:
        `${round(
          ellipse.centerProjection.screen.x -
          ellipse.width / 2,
          2
        )}px`,

      top:
        `${round(
          ellipse.centerProjection.screen.y -
          visualHeight / 2,
          2
        )}px`,

      width:
        `${round(ellipse.width, 2)}px`,

      height:
        `${round(visualHeight, 2)}px`,

      borderRadius:
        '58% 42% 51% 49% / 61% 47% 53% 39%',

      transform:
        `rotate(${round((stone.x + stone.z) * 2.7, 2)}deg)`,

      zIndex:
        resolveDepthZIndex(
          ellipse
            .centerProjection
            .cameraDepth,

          getSemanticIndex(
            layerDescriptor.id
          )
        )
    });

    appendPrimitive(
      layerElement,
      primitive
    );
  }
};

const buildJaggedRockLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  for (
    const rock
    of COMPOSITOR_HANDOFF
      .environment
      .jaggedRocks
  ) {
    const baseY =
      resolveHEarth3DProjectedGroundElevation(
        rock.center.x,
        rock.center.z
      );

    const halfWidth =
      rock.width / 2;

    const halfDepth =
      rock.depth / 2;

    const points = [
      createVector(
        rock.center.x -
          halfWidth,
        baseY,
        rock.center.z -
          halfDepth * 0.2
      ),

      createVector(
        rock.center.x -
          halfWidth * 0.52,
        baseY +
          rock.height * 0.56,
        rock.center.z
      ),

      createVector(
        rock.center.x -
          halfWidth * 0.12,
        baseY +
          rock.height,
        rock.center.z +
          halfDepth * 0.08
      ),

      createVector(
        rock.center.x +
          halfWidth * 0.42,
        baseY +
          rock.height * 0.68,
        rock.center.z
      ),

      createVector(
        rock.center.x +
          halfWidth,
        baseY,
        rock.center.z -
          halfDepth * 0.15
      ),

      createVector(
        rock.center.x,
        baseY -
          0.02,
        rock.center.z +
          halfDepth
      )
    ];

    const primitive =
      createPolygonPrimitive({
        layerDescriptor,

        primitiveId:
          rock.id,

        primitiveClass:
          'jagged-rock',

        materialId:
          layerDescriptor.materialId,

        points,
        projectionContext
      });

    if (primitive) {
      setStyles(primitive, {
        transform:
          `rotate(${rock.rotationDegrees}deg)`
      });

      appendPrimitive(
        layerElement,
        primitive
      );
    }
  }
};

const buildManorBluffLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  const context =
    COMPOSITOR_HANDOFF
      .environment
      .backgroundContext
      .manorBluff;

  const bluff =
    context.bluff;

  const manor =
    context.manor;

  const bluffHalfWidth =
    bluff.width / 2;

  const bluffHalfDepth =
    bluff.depth / 2;

  const bluffTop =
    createPolygonPrimitive({
      layerDescriptor,

      primitiveId:
        'H_EARTH_BLUFF_TOP',

      primitiveClass:
        'bluff-top',

      materialId:
        bluff.materialId,

      points: [
        createVector(
          bluff.center.x -
            bluffHalfWidth,
          bluff.plateauElevationY,
          bluff.center.z -
            bluffHalfDepth
        ),

        createVector(
          bluff.center.x +
            bluffHalfWidth,
          bluff.plateauElevationY,
          bluff.center.z -
            bluffHalfDepth
        ),

        createVector(
          bluff.center.x +
            bluffHalfWidth * 0.84,
          bluff.plateauElevationY +
            0.12,
          bluff.center.z +
            bluffHalfDepth
        ),

        createVector(
          bluff.center.x -
            bluffHalfWidth * 0.76,
          bluff.plateauElevationY +
            0.06,
          bluff.center.z +
            bluffHalfDepth
        )
      ],

      projectionContext,
      opacity: 0.94
    });

  if (bluffTop) {
    appendPrimitive(
      layerElement,
      bluffTop
    );
  }

  const cliffFace =
    createPolygonPrimitive({
      layerDescriptor,

      primitiveId:
        'H_EARTH_BLUFF_CLIFF_FACE',

      primitiveClass:
        'bluff-cliff-face',

      materialId:
        bluff.materialId,

      points: [
        createVector(
          bluff.center.x -
            bluffHalfWidth,
          bluff.baseElevationY,
          bluff.center.z -
            bluffHalfDepth
        ),

        createVector(
          bluff.center.x +
            bluffHalfWidth,
          bluff.baseElevationY,
          bluff.center.z -
            bluffHalfDepth
        ),

        createVector(
          bluff.center.x +
            bluffHalfWidth,
          bluff.plateauElevationY,
          bluff.center.z -
            bluffHalfDepth
        ),

        createVector(
          bluff.center.x -
            bluffHalfWidth,
          bluff.plateauElevationY,
          bluff.center.z -
            bluffHalfDepth
        )
      ],

      projectionContext,
      opacity: 0.96,
      localZOffset: 1
    });

  if (cliffFace) {
    appendPrimitive(
      layerElement,
      cliffFace
    );
  }

  const manorHalfWidth =
    manor.silhouetteWidth / 2;

  const manorBaseY =
    manor.baseElevationY;

  const manorTopY =
    manorBaseY +
    manor.silhouetteHeight;

  const manorBody =
    createPolygonPrimitive({
      layerDescriptor,

      primitiveId:
        'H_EARTH_MANOR_CONTEXT_SILHOUETTE',

      primitiveClass:
        'manor-context-silhouette',

      materialId:
        manor.materialId,

      points: [
        createVector(
          manor.center.x -
            manorHalfWidth,
          manorBaseY,
          manor.center.z
        ),

        createVector(
          manor.center.x -
            manorHalfWidth,
          manorBaseY +
            manor.silhouetteHeight * 0.56,
          manor.center.z
        ),

        createVector(
          manor.center.x -
            manorHalfWidth * 0.48,
          manorBaseY +
            manor.silhouetteHeight * 0.56,
          manor.center.z
        ),

        createVector(
          manor.center.x -
            manorHalfWidth * 0.34,
          manorTopY,
          manor.center.z
        ),

        createVector(
          manor.center.x,
          manorBaseY +
            manor.silhouetteHeight * 0.7,
          manor.center.z
        ),

        createVector(
          manor.center.x +
            manorHalfWidth * 0.4,
          manorTopY -
            0.35,
          manor.center.z
        ),

        createVector(
          manor.center.x +
            manorHalfWidth * 0.55,
          manorBaseY +
            manor.silhouetteHeight * 0.55,
          manor.center.z
        ),

        createVector(
          manor.center.x +
            manorHalfWidth,
          manorBaseY +
            manor.silhouetteHeight * 0.55,
          manor.center.z
        ),

        createVector(
          manor.center.x +
            manorHalfWidth,
          manorBaseY,
          manor.center.z
        )
      ],

      projectionContext,
      opacity: 0.9,
      localZOffset: 2
    });

  if (manorBody) {
    appendPrimitive(
      layerElement,
      manorBody
    );
  }
};

const buildOffshoreIsletLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  const waterDatum =
    COMPOSITOR_HANDOFF
      .environment
      .water
      .waterDatumY;

  const islets =
    COMPOSITOR_HANDOFF
      .environment
      .backgroundContext
      .offshoreIslets;

  for (const islet of islets) {
    const halfWidth =
      islet.width / 2;

    const baseY =
      waterDatum;

    const points = [
      createVector(
        islet.center.x -
          halfWidth,
        baseY,
        islet.center.z
      ),

      createVector(
        islet.center.x -
          halfWidth * 0.62,
        baseY +
          islet.height * 0.38,
        islet.center.z
      ),

      createVector(
        islet.center.x -
          halfWidth * 0.15,
        baseY +
          islet.height,
        islet.center.z
      ),

      createVector(
        islet.center.x +
          halfWidth * 0.34,
        baseY +
          islet.height * 0.57,
        islet.center.z
      ),

      createVector(
        islet.center.x +
          halfWidth,
        baseY,
        islet.center.z
      )
    ];

    const primitive =
      createPolygonPrimitive({
        layerDescriptor,

        primitiveId:
          islet.id,

        primitiveClass:
          'offshore-islet',

        materialId:
          layerDescriptor.materialId,

        points,
        projectionContext,

        opacity:
          lerp(
            0.72,
            0.5,
            smoothstep(
              22,
              28,
              islet.center.z
            )
          )
      });

    if (primitive) {
      appendPrimitive(
        layerElement,
        primitive
      );
    }
  }
};

const buildInspectionAnchorLayer = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  const anchor =
    COMPOSITOR_HANDOFF
      .environment
      .inspectionAnchor;

  const groundY =
    resolveHEarth3DProjectedGroundElevation(
      anchor.positionCandidate.x,
      anchor.positionCandidate.z
    );

  const projection =
    projectHEarth3DWorldPoint(
      createVector(
        anchor.positionCandidate.x,
        groundY + 0.035,
        anchor.positionCandidate.z
      ),
      projectionContext
    );

  if (!projection.visible) {
    return;
  }

  const radiusProjection =
    projectHEarth3DWorldPoint(
      createVector(
        anchor.positionCandidate.x +
          anchor.radius,
        groundY + 0.035,
        anchor.positionCandidate.z
      ),
      projectionContext
    );

  if (!radiusProjection.visible) {
    return;
  }

  const radiusPx =
    Math.max(
      8,
      Math.abs(
        radiusProjection.screen.x -
        projection.screen.x
      )
    );

  const primitive =
    createPrimitiveElement({
      layerId:
        layerDescriptor.id,

      primitiveId:
        anchor.id,

      primitiveClass:
        'inspection-anchor',

      materialId:
        layerDescriptor.materialId,

      cameraDepth:
        projection.cameraDepth,

      interactive: true
    });

  primitive.tabIndex = 0;

  primitive.setAttribute(
    'role',
    'button'
  );

  primitive.setAttribute(
    'aria-label',
    'Inspect Ground'
  );

  primitive.dataset.actionId =
    anchor.actionId;

  primitive.dataset.readoutId =
    anchor.readoutId;

  primitive.dataset.receiptId =
    anchor.receiptId;

  setStyles(primitive, {
    left:
      `${round(
        projection.screen.x -
        radiusPx,
        2
      )}px`,

    top:
      `${round(
        projection.screen.y -
        radiusPx,
        2
      )}px`,

    width:
      `${round(radiusPx * 2, 2)}px`,

    height:
      `${round(radiusPx * 2, 2)}px`,

    borderRadius: '50%',
    cursor: 'pointer',

    zIndex:
      resolveDepthZIndex(
        projection.cameraDepth,
        getSemanticIndex(
          layerDescriptor.id
        ),
        10
      )
  });

  appendPrimitive(
    layerElement,
    primitive
  );
};

const buildLayerContent = ({
  layerDescriptor,
  layerElement,
  projectionContext
}) => {
  switch (layerDescriptor.id) {
    case H_EARTH_3D_COMPOSITION_LAYER_IDS.sky:
      buildSkyLayer({
        layerDescriptor,
        layerElement
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.atmosphere:
      buildAtmosphereLayer({
        layerDescriptor,
        layerElement
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.horizon:
      buildHorizonLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.offshoreIslets:
      buildOffshoreIsletLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.manorBluffContext:
      buildManorBluffLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.openWater:
      buildOpenWaterLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.nearshoreWater:
      buildNearshoreWaterLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.waveBands:
      buildWaveLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.shorelineFoam:
      buildShorelineFoamLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.wetSand:
      buildGroundLayer({
        layerDescriptor,
        layerElement,
        projectionContext,

        sourceDescriptor:
          COMPOSITOR_HANDOFF
            .environment
            .ground
            .wetSand,

        bandCount:
          COMPOSITOR_HANDOFF
            .environment
            .primitivePlan
            .substrate
            .wetSandBands,

        primitivePrefix:
          'H_EARTH_WET_SAND_BAND'
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.drySand:
      buildGroundLayer({
        layerDescriptor,
        layerElement,
        projectionContext,

        sourceDescriptor:
          COMPOSITOR_HANDOFF
            .environment
            .ground
            .drySand,

        bandCount:
          COMPOSITOR_HANDOFF
            .environment
            .primitivePlan
            .substrate
            .drySandBands,

        primitivePrefix:
          'H_EARTH_DRY_SAND_BAND'
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.tidePools:
      buildTidePoolLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.stones:
      buildStoneLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.jaggedRocks:
      buildJaggedRockLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    case H_EARTH_3D_COMPOSITION_LAYER_IDS.inspectionAnchor:
      buildInspectionAnchorLayer({
        layerDescriptor,
        layerElement,
        projectionContext
      });
      break;

    default:
      break;
  }
};

const createStageElement = () => {
  const element =
    document.createElement('div');

  element.className =
    H_EARTH_3D_RENDERER_STAGE_MODEL
      .stageClass;

  element.dataset.rendererContractId =
    H_EARTH_3D_RENDERER_CONTRACT_ID;

  element.dataset.compositorContractId =
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID;

  element.dataset.activeCell =
    H_EARTH_3D_RENDERER_BINDING_IDENTITY
      .activeCell;

  element.dataset.spatialCellId =
    H_EARTH_3D_RENDERER_BINDING_IDENTITY
      .spatialCellId;

  setStyles(element, {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '420px',
    overflow: 'hidden',
    isolation: 'isolate',
    background: '#526f80',
    contain:
      'layout paint style',
    userSelect: 'none',
    touchAction: 'none'
  });

  return element;
};

const createSceneElement = () => {
  const element =
    document.createElement('div');

  element.className =
    H_EARTH_3D_RENDERER_STAGE_MODEL
      .sceneRootClass;

  element.dataset.coordinateFrame =
    H_EARTH_3D_RENDERER_BINDING_IDENTITY
      .coordinateFrame;

  setStyles(element, {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    transformOrigin: '50% 50%'
  });

  return element;
};

const clearSceneContent = () => {
  rendererState
    .layerElements
    .clear();

  rendererState
    .primitiveElements
    .length = 0;

  if (
    rendererState.sceneElement
  ) {
    rendererState
      .sceneElement
      .replaceChildren();
  }
};

/**
 * Static renderer dependency preflight.
 */
export const H_EARTH_3D_RENDERER_DEPENDENCY_PREFLIGHT = (() => {
  const issues = [];

  const compositorPresent =
    Boolean(
      COMPOSITOR_HANDOFF
    );

  const compositorContractMatches =
    COMPOSITOR_HANDOFF?.contractId ===
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID;

  const capacityContractMatches =
    COMPOSITOR_HANDOFF?.capacityContractId ===
    H_EARTH_3D_CAPACITY_CONTRACT_ID;

  const environmentContractPresent =
    isNonEmptyString(
      COMPOSITOR_HANDOFF
        ?.environmentContractId
    );

  const bindingIdentityMatches =
    COMPOSITOR_HANDOFF
      ?.bindingIdentity
      ?.activeCell ===
      'H_EARTH_GROUND_CELL_001' &&
    COMPOSITOR_HANDOFF
      ?.bindingIdentity
      ?.spatialCellId ===
      'H_EARTH_REGION_CELL_X07_Z08';

  const coordinateFrameMatches =
    COMPOSITOR_HANDOFF
      ?.coordinateFrame ===
    COMPOSITOR_HANDOFF
      ?.worldBounds
      ?.coordinateFrame;

  const orderedLayersPresent =
    Array.isArray(
      COMPOSITOR_HANDOFF
        ?.composition
        ?.orderedLayerIds
    ) &&
    Array.isArray(
      COMPOSITOR_HANDOFF
        ?.composition
        ?.layers
    );

  const requiredLayersPresent =
    COMPOSITOR_HANDOFF
      ?.composition
      ?.visibilityPolicy
      ?.requiredLayerIds
      ?.every(
        (layerId) =>
          Boolean(
            H_EARTH_3D_COMPOSITION_LAYER_MAP[
              layerId
            ]
          )
      ) === true;

  const outputModelAllowed =
    H_EARTH_3D_RENDER_STAGE_LIMITS
      .permittedOutputModel ===
    'DOM_CSS3D_BOUNDED_STAGE';

  if (!compositorPresent) {
    issues.push(
      createRendererIssue(
        'COMPOSITOR_HANDOFF_MISSING',
        'The compositor renderer handoff is missing.'
      )
    );
  }

  if (!compositorContractMatches) {
    issues.push(
      createRendererIssue(
        'COMPOSITOR_CONTRACT_MISMATCH',
        'The compositor handoff contract does not match the backed dependency.'
      )
    );
  }

  if (!capacityContractMatches) {
    issues.push(
      createRendererIssue(
        'CAPACITY_CONTRACT_MISMATCH',
        'The compositor handoff capacity contract does not match the renewed capacity dependency.'
      )
    );
  }

  if (!environmentContractPresent) {
    issues.push(
      createRendererIssue(
        'ENVIRONMENT_CONTRACT_MISSING',
        'The compositor handoff does not identify the renewed environment contract.'
      )
    );
  }

  if (!bindingIdentityMatches) {
    issues.push(
      createRendererIssue(
        'BINDING_IDENTITY_MISMATCH',
        'The compositor handoff does not match Ground Cell 001 and region cell X07 Z08.'
      )
    );
  }

  if (!coordinateFrameMatches) {
    issues.push(
      createRendererIssue(
        'COORDINATE_FRAME_MISMATCH',
        'The compositor coordinate frame and world-bounds frame do not match.'
      )
    );
  }

  if (!orderedLayersPresent) {
    issues.push(
      createRendererIssue(
        'SEMANTIC_LAYER_ORDER_MISSING',
        'The compositor handoff does not provide ordered semantic layers.'
      )
    );
  }

  if (!requiredLayersPresent) {
    issues.push(
      createRendererIssue(
        'REQUIRED_LAYER_DESCRIPTOR_MISSING',
        'At least one required compositor layer descriptor is missing.'
      )
    );
  }

  if (!outputModelAllowed) {
    issues.push(
      createRendererIssue(
        'OUTPUT_MODEL_NOT_AUTHORIZED',
        'The renewed capacity contract does not authorize DOM/CSS3D bounded output.'
      )
    );
  }

  const compositorEvaluation =
    evaluateHEarth3DRendererConsumption({
      compositorContractIdMatches,
      capacityContractIdMatches,
      environmentContractIdMatches:
        environmentContractPresent,

      bindingIdentityMatches,
      coordinateFrameMatches,

      requiredLayerOrderConsumed:
        orderedLayersPresent,

      requiredLayersPresent,

      primitiveBudgetWithinCapacity:
        COMPOSITOR_HANDOFF
          ?.preflight
          ?.primitivePlanWithinCapacity ===
        true,

      rendererOutputModelAllowed:
        outputModelAllowed,

      rendererImportedSuccessfully:
        true,

      rendererConstructedSuccessfully:
        issues.length === 0
    });

  return deepFreeze({
    eligible:
      issues.length === 0 &&
      compositorEvaluation
        .rendererPreflightEligible,

    status:
      issues.length === 0 &&
      compositorEvaluation
        .rendererPreflightEligible
        ? 'RENDERER_DEPENDENCY_PREFLIGHT_ELIGIBLE'
        : 'RENDERER_DEPENDENCY_PREFLIGHT_NOT_ELIGIBLE',

    issues:
      deepFreeze(issues),

    compositorEvaluation,

    rendererMounted: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  });
})();

/**
 * Rebuilds renderer-owned scene content.
 */
export function renderHEarth3DEnvironment({
  widthPx,
  heightPx,
  pixelRatio = 1,
  visibleLayerIds =
    rendererState.visibleLayerIds,
  camera =
    H_EARTH_3D_RENDERER_CAMERA
} = {}) {
  if (
    !rendererState.mounted ||
    !rendererState.sceneElement
  ) {
    return deepFreeze({
      rendered: false,
      status: 'RENDERER_NOT_MOUNTED',
      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const viewport =
    resolveHEarth3DViewportMetrics({
      widthPx,
      heightPx,
      pixelRatio
    });

  if (
    !viewport
      .capacityEvaluation
      .eligible
  ) {
    return deepFreeze({
      rendered: false,

      status:
        'VIEWPORT_OUTSIDE_RENDERER_CAPACITY',

      viewport,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const composedLayers =
    composeHEarth3DRendererLayers({
      visibleLayerIds,
      includeOverlay: false
    });

  if (!composedLayers.eligible) {
    return deepFreeze({
      rendered: false,

      status:
        'COMPOSITOR_LAYER_SELECTION_NOT_ELIGIBLE',

      composedLayers,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const projectionContext =
    createHEarth3DProjectionContext({
      widthPx,
      heightPx,
      pixelRatio,
      camera
    });

  clearSceneContent();

  for (
    const layerDescriptor
    of composedLayers.orderedLayers
  ) {
    if (
      layerDescriptor.id ===
      H_EARTH_3D_COMPOSITION_LAYER_IDS.overlay
    ) {
      continue;
    }

    const layerElement =
      createLayerElement(
        layerDescriptor
      );

    rendererState
      .layerElements
      .set(
        layerDescriptor.id,
        layerElement
      );

    rendererState
      .sceneElement
      .appendChild(
        layerElement
      );

    buildLayerContent({
      layerDescriptor,
      layerElement,
      projectionContext
    });
  }

  const nodeBudgetEvaluation =
    evaluateHEarth3DNodeBudget({
      semanticLayerContainers:
        rendererState
          .layerElements
          .size,

      environmentPrimitives:
        rendererState
          .primitiveElements
          .length,

      interactionNodes:
        rendererState
          .primitiveElements
          .filter(
            (element) =>
              element.dataset.layerId ===
              H_EARTH_3D_COMPOSITION_LAYER_IDS
                .inspectionAnchor
          )
          .length,

      diagnosticOwnedNodes: 0
    });

  if (!nodeBudgetEvaluation.eligible) {
    clearSceneContent();

    return deepFreeze({
      rendered: false,

      status:
        'RENDERER_NODE_BUDGET_EXCEEDED',

      nodeBudgetEvaluation,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  rendererState.renderCounter += 1;

  rendererState.currentViewport =
    viewport;

  rendererState.currentCamera =
    camera;

  rendererState.currentProjection =
    projectionContext;

  rendererState.visibleLayerIds = [
    ...visibleLayerIds
  ];

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDER_EXECUTION_RECEIPT',

      contractId:
        H_EARTH_3D_RENDERER_CONTRACT_ID,

      renderSequence:
        rendererState.renderCounter,

      rendered: true,

      status:
        'ENVIRONMENT_GEOMETRY_MATERIALIZED_CANDIDATE',

      viewport,

      semanticLayerContainerCount:
        rendererState
          .layerElements
          .size,

      environmentPrimitiveCount:
        rendererState
          .primitiveElements
          .length,

      orderedLayerIds:
        composedLayers
          .orderedLayerIds,

      nodeBudgetEvaluation,

      sharedProjectionApplied: true,
      continuousGroundMaterialized: true,
      shorelineRibbonMaterialized: true,
      waterBandsMaterialized: true,
      sparseGroundedDetailsMaterialized: true,
      simplifiedBackgroundContextMaterialized: true,
      inspectionAnchorMaterialized: true,

      sceneReadsAsWorld: null,
      sceneReadsAsDiorama: null,

      visualCoherenceStatus:
        'PENDING_VISUAL_REVIEW',

      actorReadyGroundPlane:
        'CANDIDATE_DESCRIPTOR_ONLY',

      groundContactProven: false,
      collisionProven: false,

      rendererPassClaim: false,
      visualPassClaim: false,
      playableEnvironmentClaim: false,
      validationClaim: false,
      productionClaim: false
    });

  rendererState.lastRenderReceipt =
    receipt;

  return receipt;
}

/**
 * Mounts the renderer candidate into a supplied element.
 */
export function mountHEarth3DRenderer({
  mountElement = null,
  mountId =
    H_EARTH_3D_PUBLIC_STAGE_IDS
      .rendererMountId,

  visibleLayerIds =
    DEFAULT_VISIBLE_LAYER_IDS,

  camera =
    H_EARTH_3D_RENDERER_CAMERA
} = {}) {
  if (
    typeof document === 'undefined'
  ) {
    return deepFreeze({
      mounted: false,
      status: 'DOCUMENT_NOT_AVAILABLE',
      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  if (
    !H_EARTH_3D_RENDERER_DEPENDENCY_PREFLIGHT
      .eligible
  ) {
    return deepFreeze({
      mounted: false,

      status:
        'RENDERER_DEPENDENCY_PREFLIGHT_NOT_ELIGIBLE',

      preflight:
        H_EARTH_3D_RENDERER_DEPENDENCY_PREFLIGHT,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  if (rendererState.mounted) {
    destroyHEarth3DRenderer();
  }

  const resolvedMountElement =
    mountElement ||
    (
      isNonEmptyString(mountId)
        ? document.getElementById(
            mountId
          )
        : null
    );

  if (!resolvedMountElement) {
    return deepFreeze({
      mounted: false,

      status:
        'RENDERER_MOUNT_ELEMENT_NOT_FOUND',

      mountId,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const rect =
    resolvedMountElement
      .getBoundingClientRect();

  const widthPx =
    Math.max(
      rect.width,
      resolvedMountElement.clientWidth
    );

  const heightPx =
    Math.max(
      rect.height,
      resolvedMountElement.clientHeight
    );

  const pixelRatio =
    typeof window !== 'undefined'
      ? window.devicePixelRatio || 1
      : 1;

  const viewport =
    resolveHEarth3DViewportMetrics({
      widthPx,
      heightPx,
      pixelRatio
    });

  if (
    !viewport
      .capacityEvaluation
      .eligible
  ) {
    return deepFreeze({
      mounted: false,

      status:
        'RENDERER_VIEWPORT_OUTSIDE_CAPACITY',

      viewport,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const stageElement =
    createStageElement();

  const sceneElement =
    createSceneElement();

  stageElement.appendChild(
    sceneElement
  );

  resolvedMountElement
    .replaceChildren(
      stageElement
    );

  rendererState.mounted = true;

  rendererState.mountElement =
    resolvedMountElement;

  rendererState.stageElement =
    stageElement;

  rendererState.sceneElement =
    sceneElement;

  rendererState.mountCounter += 1;

  const renderReceipt =
    renderHEarth3DEnvironment({
      widthPx,
      heightPx,
      pixelRatio,
      visibleLayerIds,
      camera
    });

  if (!renderReceipt.rendered) {
    destroyHEarth3DRenderer();

    return deepFreeze({
      mounted: false,

      status:
        'RENDERER_INITIAL_MATERIALIZATION_FAILED',

      renderReceipt,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',

      contractId:
        H_EARTH_3D_RENDERER_CONTRACT_ID,

      mountSequence:
        rendererState.mountCounter,

      mounted: true,

      status:
        'RENDERER_CANDIDATE_MOUNTED',

      mountId:
        resolvedMountElement.id ||
        null,

      compositorContractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      capacityContractId:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      environmentContractId:
        COMPOSITOR_HANDOFF
          .environmentContractId,

      bindingIdentity:
        H_EARTH_3D_RENDERER_BINDING_IDENTITY,

      viewport,

      renderReceipt,

      controllerMounted: false,
      routeBootstrapExecuted: false,

      runtimeActivationClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      playableEnvironmentClaim: false,
      validationClaim: false,
      productionClaim: false
    });

  rendererState.lastMountReceipt =
    receipt;

  return receipt;
}

/**
 * Explicitly reprojects the mounted renderer.
 *
 * No ResizeObserver or controller behavior is created here.
 */
export function resizeHEarth3DRenderer({
  widthPx = null,
  heightPx = null,
  pixelRatio = null
} = {}) {
  if (
    !rendererState.mounted ||
    !rendererState.mountElement
  ) {
    return deepFreeze({
      resized: false,
      status: 'RENDERER_NOT_MOUNTED',
      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const rect =
    rendererState
      .mountElement
      .getBoundingClientRect();

  const resolvedWidth =
    isFiniteNumber(widthPx)
      ? widthPx
      : Math.max(
          rect.width,
          rendererState
            .mountElement
            .clientWidth
        );

  const resolvedHeight =
    isFiniteNumber(heightPx)
      ? heightPx
      : Math.max(
          rect.height,
          rendererState
            .mountElement
            .clientHeight
        );

  const resolvedPixelRatio =
    isFiniteNumber(pixelRatio)
      ? pixelRatio
      : typeof window !== 'undefined'
        ? window.devicePixelRatio || 1
        : 1;

  const renderReceipt =
    renderHEarth3DEnvironment({
      widthPx:
        resolvedWidth,

      heightPx:
        resolvedHeight,

      pixelRatio:
        resolvedPixelRatio,

      visibleLayerIds:
        rendererState
          .visibleLayerIds,

      camera:
        rendererState
          .currentCamera ||
        H_EARTH_3D_RENDERER_CAMERA
    });

  return deepFreeze({
    resized:
      renderReceipt.rendered ===
      true,

    status:
      renderReceipt.rendered
        ? 'RENDERER_REPROJECTED'
        : 'RENDERER_REPROJECTION_FAILED',

    renderReceipt,

    rendererPassClaim: false,
    visualPassClaim: false
  });
}

/**
 * Updates the static projection camera candidate.
 *
 * This is a renderer projection update only, not controller behavior.
 */
export function setHEarth3DRendererCamera(
  cameraCandidate
) {
  if (
    !cameraCandidate ||
    !cameraCandidate.position ||
    !cameraCandidate.target ||
    !cameraCandidate.up
  ) {
    return deepFreeze({
      updated: false,
      status: 'INVALID_CAMERA_CANDIDATE',
      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const normalizedCamera =
    deepFreeze({
      model:
        cameraCandidate.model ||
        H_EARTH_3D_RENDERER_CAMERA.model,

      position: deepFreeze({
        x:
          cameraCandidate.position.x,

        y:
          cameraCandidate.position.y,

        z:
          cameraCandidate.position.z
      }),

      target: deepFreeze({
        x:
          cameraCandidate.target.x,

        y:
          cameraCandidate.target.y,

        z:
          cameraCandidate.target.z
      }),

      up: deepFreeze({
        x:
          cameraCandidate.up.x,

        y:
          cameraCandidate.up.y,

        z:
          cameraCandidate.up.z
      }),

      verticalFovDegrees:
        cameraCandidate
          .verticalFovDegrees ??
        H_EARTH_3D_RENDERER_CAMERA
          .verticalFovDegrees,

      nearPlane:
        cameraCandidate.nearPlane ??
        H_EARTH_3D_RENDERER_CAMERA
          .nearPlane,

      farPlane:
        cameraCandidate.farPlane ??
        H_EARTH_3D_RENDERER_CAMERA
          .farPlane,

      controllerOwned: false,
      staticProjectionCandidate: true
    });

  rendererState.currentCamera =
    normalizedCamera;

  if (!rendererState.mounted) {
    return deepFreeze({
      updated: true,

      status:
        'RENDERER_CAMERA_CANDIDATE_UPDATED_NOT_MOUNTED',

      camera:
        normalizedCamera,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const receipt =
    resizeHEarth3DRenderer();

  return deepFreeze({
    updated:
      receipt.resized,

    status:
      receipt.resized
        ? 'RENDERER_CAMERA_CANDIDATE_APPLIED'
        : 'RENDERER_CAMERA_CANDIDATE_APPLY_FAILED',

    camera:
      normalizedCamera,

    renderReceipt:
      receipt.renderReceipt,

    controllerBehaviorCreated: false,

    rendererPassClaim: false,
    visualPassClaim: false
  });
}

/**
 * Updates compositor-approved layer visibility.
 */
export function setHEarth3DRendererVisibleLayers(
  visibleLayerIds
) {
  if (!Array.isArray(visibleLayerIds)) {
    return deepFreeze({
      updated: false,
      status: 'INVALID_VISIBLE_LAYER_SELECTION',
      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const composed =
    composeHEarth3DRendererLayers({
      visibleLayerIds,
      includeOverlay: false
    });

  if (!composed.eligible) {
    return deepFreeze({
      updated: false,

      status:
        'VISIBLE_LAYER_SELECTION_NOT_ELIGIBLE',

      composed,

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  rendererState.visibleLayerIds = [
    ...visibleLayerIds
  ];

  if (!rendererState.mounted) {
    return deepFreeze({
      updated: true,

      status:
        'VISIBLE_LAYER_SELECTION_UPDATED_NOT_MOUNTED',

      visibleLayerIds:
        deepFreeze([
          ...visibleLayerIds
        ]),

      rendererPassClaim: false,
      visualPassClaim: false
    });
  }

  const receipt =
    resizeHEarth3DRenderer();

  return deepFreeze({
    updated:
      receipt.resized,

    status:
      receipt.resized
        ? 'VISIBLE_LAYER_SELECTION_APPLIED'
        : 'VISIBLE_LAYER_SELECTION_APPLY_FAILED',

    visibleLayerIds:
      deepFreeze([
        ...visibleLayerIds
      ]),

    renderReceipt:
      receipt.renderReceipt,

    rendererPassClaim: false,
    visualPassClaim: false
  });
}

/**
 * Destroys renderer-owned DOM.
 */
export function destroyHEarth3DRenderer() {
  const wasMounted =
    rendererState.mounted;

  const removedPrimitiveCount =
    rendererState
      .primitiveElements
      .length;

  const removedLayerCount =
    rendererState
      .layerElements
      .size;

  if (
    rendererState.mountElement &&
    rendererState.stageElement &&
    rendererState.stageElement.parentNode ===
      rendererState.mountElement
  ) {
    rendererState
      .mountElement
      .removeChild(
        rendererState.stageElement
      );
  }

  rendererState.mounted = false;

  rendererState.mountElement = null;
  rendererState.stageElement = null;
  rendererState.sceneElement = null;

  rendererState
    .layerElements
    .clear();

  rendererState
    .primitiveElements
    .length = 0;

  rendererState.currentViewport = null;
  rendererState.currentProjection = null;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDERER_DESTROY_RECEIPT',

      contractId:
        H_EARTH_3D_RENDERER_CONTRACT_ID,

      destroyed:
        wasMounted,

      status:
        wasMounted
          ? 'RENDERER_OWNED_DOM_REMOVED'
          : 'RENDERER_WAS_NOT_MOUNTED',

      removedLayerCount,
      removedPrimitiveCount,

      routeDOMRemoved: false,
      controllerDestroyed: false,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false
    });

  rendererState.lastDestroyReceipt =
    receipt;

  return receipt;
}

/**
 * Returns current renderer state without exposing mutable DOM collections.
 */
export function getHEarth3DRendererState() {
  return deepFreeze({
    mounted:
      rendererState.mounted,

    mountId:
      rendererState
        .mountElement
        ?.id ??
      null,

    semanticLayerContainerCount:
      rendererState
        .layerElements
        .size,

    environmentPrimitiveCount:
      rendererState
        .primitiveElements
        .length,

    visibleLayerIds:
      deepFreeze([
        ...rendererState
          .visibleLayerIds
      ]),

    currentViewport:
      rendererState
        .currentViewport,

    currentCamera:
      rendererState
        .currentCamera,

    mountSequence:
      rendererState
        .mountCounter,

    renderSequence:
      rendererState
        .renderCounter,

    lastMountReceipt:
      rendererState
        .lastMountReceipt,

    lastRenderReceipt:
      rendererState
        .lastRenderReceipt,

    lastDestroyReceipt:
      rendererState
        .lastDestroyReceipt
  });
}

/**
 * Claim ceilings.
 */
export const H_EARTH_3D_RENDERER_CLAIM_CEILINGS =
  deepFreeze({
    runtimeActivationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    playableEnvironmentClaim: false,
    validationClaim: false,
    productionClaim: false,

    actorClaim: false,
    groundContactClaim: false,
    collisionClaim: false,
    traversalClaim: false,
    gameplayClaim: false,
    fluidSimulationClaim: false,

    matrixCollapse: false
  });

/**
 * Static renderer receipt.
 */
export const H_EARTH_3D_RENDERER_RECEIPT =
  deepFreeze({
    receiptType:
      'H_EARTH_3D_ENVIRONMENT_GEOMETRY_RENDERER_RECEIPT',

    contractId:
      H_EARTH_3D_RENDERER_CONTRACT_ID,

    file:
      '/showroom/globe/h-earth/renderer.js',

    compositorContractConsumed: true,
    capacityUtilitiesConsumed: true,

    directEnvironmentImport: false,
    directSourceSpineImport: false,
    directActionImport: false,
    directReadoutImport: false,
    directReceiptImport: false,
    controllerImport: false,

    acceptedBindingIdentityConsumed: true,

    bindingExpression:
      H_EARTH_3D_RENDERER_BINDING_IDENTITY
        .bindingExpression,

    sharedProjectionDefined: true,
    environmentGeometryConstructionDefined: true,
    DOMCSSMaterializationDefined: true,
    semanticLayerContainersDefined: true,
    cameraDepthSortingDefined: true,
    mountLifecycleDefined: true,
    explicitResizeReprojectionDefined: true,

    rendererDependencyPreflightStatus:
      H_EARTH_3D_RENDERER_DEPENDENCY_PREFLIGHT
        .status,

    rendererDependencyPreflightEligible:
      H_EARTH_3D_RENDERER_DEPENDENCY_PREFLIGHT
        .eligible,

    repositoryInstallationVerified: false,
    importResolutionVerified: false,
    moduleGraphExecutionVerified: false,
    routeMountVerified: false,
    rendererMountVerified: false,
    visualOutputInspected: false,

    visualCoherenceStatus:
      'NOT_INSPECTED',

    sceneReadsAsWorld: null,
    sceneReadsAsDiorama: null,

    nextRequired:
      'BACK_UP_RENDERER_THEN_RENEW_CONTROLLER_AGAINST_BACKED_RENDERER_CONTRACT',

    ...H_EARTH_3D_RENDERER_CLAIM_CEILINGS
  });

/**
 * Complete renderer contract.
 */
export const H_EARTH_3D_RENDERER_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_RENDERER_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_RENDERER_SCHEMA_VERSION,

    file:
      '/showroom/globe/h-earth/renderer.js',

    layer:
      'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

    role:
      'COMPOSITOR_APPROVED_ENVIRONMENT_PROJECTION_AND_DOM_CSS_MATERIALIZATION',

    status:
      'CURRENT_ROLE_RENEWAL_CANDIDATE',

    bindingIdentity:
      H_EARTH_3D_RENDERER_BINDING_IDENTITY,

    sourceReferences:
      H_EARTH_3D_RENDERER_SOURCE_REFERENCES,

    stageModel:
      H_EARTH_3D_RENDERER_STAGE_MODEL,

    camera:
      H_EARTH_3D_RENDERER_CAMERA,

    materialPresentation:
      H_EARTH_3D_RENDERER_MATERIAL_PRESENTATION,

    rendererOwnedLayerIds:
      deepFreeze([
        ...RENDERER_OWNED_LAYER_IDS
      ]),

    dependencyPreflight:
      H_EARTH_3D_RENDERER_DEPENDENCY_PREFLIGHT,

    boundaryFlags:
      H_EARTH_3D_RENDERER_BOUNDARY_FLAGS,

    claimCeilings:
      H_EARTH_3D_RENDERER_CLAIM_CEILINGS
  });

/**
 * Returns the immutable renderer contract.
 */
export function getHEarth3DRendererContract() {
  return H_EARTH_3D_RENDERER_CONTRACT;
}

/**
 * Returns the immutable static renderer receipt.
 */
export function getHEarth3DRendererReceipt() {
  return H_EARTH_3D_RENDERER_RECEIPT;
}

/**
 * Returns the renderer dependency preflight.
 */
export function getHEarth3DRendererDependencyPreflight() {
  return H_EARTH_3D_RENDERER_DEPENDENCY_PREFLIGHT;
}

/**
 * Returns the latest runtime-scoped renderer receipts.
 */
export function getHEarth3DRendererOperationalReceipts() {
  return deepFreeze({
    mount:
      rendererState
        .lastMountReceipt,

    render:
      rendererState
        .lastRenderReceipt,

    destroy:
      rendererState
        .lastDestroyReceipt
  });
}

/**
 * Compatibility alias for prior render entry naming.
 */
export function mountHEarthCandidateRenderer(
  options = {}
) {
  return mountHEarth3DRenderer(
    options
  );
}

/**
 * Compatibility alias for prior renderer destruction naming.
 */
export function destroyHEarthCandidateRenderer() {
  return destroyHEarth3DRenderer();
}

/**
 * Compatibility compositor-governed scene projection.
 *
 * This does not revive an independent renderer scene authority.
 */
export const H_EARTH_3D_CANDIDATE_RENDER_SCENE =
  H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF;

/**
 * Compatibility getter.
 */
export function getHEarth3DCandidateRenderScene() {
  return H_EARTH_3D_CANDIDATE_RENDER_SCENE;
}

export default H_EARTH_3D_RENDERER_CONTRACT;
