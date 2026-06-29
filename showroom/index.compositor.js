/* TARGET FILE: /showroom/index.compositor.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_COMPASS_CENTERED_DEPTH_COMPOSITOR_TNT_v1 */
/*
  Controlling contracts:
  - /showroom/index.html
  - SHOWROOM_MIRRORLAND_OFFICIAL_GATE_COMPACT_INSTRUCTIONS_AND_GAUGES_HTML_TNT_v5

  - /showroom/index.controller.js
  - SHOWROOM_MIRRORLAND_FOCAL_CONTROLLER_TNT_v3

  - /showroom/index.interactions.js
  - SHOWROOM_CONSTELLATION_POINTER_GESTURE_INTERPRETER_TNT_v2

  - /showroom/index.crystals.js
  - SHOWROOM_MIRRORLAND_CONSTELLATION_CRYSTALS_TNT_v2

  Compositor authority:
  - Resolve the existing [data-showroom-orbit-field] as the only
    constellation viewport and coordinate origin.
  - Create or adopt one rear crystal canvas and one front crystal canvas.
  - Place the fixed Compass visually between the rear and front passes.
  - Own the orbit camera, view matrix, projection matrix, viewport sizing,
    world-to-screen projection, Compass-plane depth classification,
    per-node hysteresis, render-pass ordering, frame coalescing, and canvas
    lifecycle.
  - Register bounded visual nodes supplied by the crystals module.
  - Invoke registered draw callbacks without inheriting crystal geometry,
    material, orbital-target, or animation authority.
  - Align projected semantic controls with the same orbit-field origin.
  - Observe orbit-field resizing and capped device-pixel ratio.
  - Publish readiness, state, recoverable-error, failure, disposal, and
    public-API receipts.

  Layer order:
  - cosmic field;
  - rear crystal canvas;
  - fixed Compass layer;
  - front crystal canvas;
  - quick guide and semantic controls.

  Controller contract:
  - The controller owns canonical page state, active cluster, active front,
    held state, reduced-motion reflection, dialogs, navigation, fallback
    restoration, and crystal-readiness interpretation.
  - The compositor may observe controller-owned state only as a redraw or
    presentation input.
  - The compositor must not mutate controller state or report crystals ready.

  Interactions contract:
  - The interactions module owns raw pointer input, pointer capture,
    drag sensitivity, tap arbitration, swipe classification, gesture axes,
    gesture quaternions, motion feel, and semantic activation.
  - The compositor installs no pointer, click, touch, wheel, keyboard, or
    gesture listeners.
  - The compositor does not interpret motion events.

  Crystals contract:
  - Crystals register one node per semantic star.
  - Each node may supply getWorldPosition(), isVisible(), getSortBias(),
    getMetadata(), draw(), and hysteresis.
  - The compositor exposes registerNode(), unregisterNode(),
    projectWorldToScreen(), requestFrame(), and dispose().
  - Crystals remain responsible for meshes, materials, orbital positions,
    animation, semantic-control association, and drawing.

  Does not own:
  - page navigation;
  - active-front or cluster commitment;
  - fallback-star visibility;
  - pointer or gesture interpretation;
  - semantic activation;
  - crystal geometry, materials, motion, or meaning;
  - Compass geometry, rendering, navigation, or lifecycle;
  - Diamond rendering, camera, controls, or lifecycle;
  - Mirrorland Window rendering or lifecycle;
  - gauge or information-tab behavior;
  - Mirrorland preface or Page Instructions disclosures.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_COMPASS_CENTERED_DEPTH_COMPOSITOR_TNT_v1";

  const OWNER =
    "/showroom/index.compositor.js";

  const EVENTS = Object.freeze({
    ready:
      "showroom:compositor-ready",

    receipt:
      "showroom:compositor-receipt",

    failed:
      "showroom:compositor-failed",

    disposed:
      "showroom:compositor-disposed",

    requestFrame:
      "showroom:compositor-request-frame",

    stateChanged:
      "showroom:state-changed",

    clusterChanged:
      "showroom:cluster-changed",

    frontChanged:
      "showroom:front-changed",

    interactionState:
      "showroom:interaction-state"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    receipt:
      "[data-showroom-compositor-receipt]",

    orbitField:
      "[data-showroom-orbit-field]",

    compassLayer:
      "[data-showroom-compass-layer]",

    compassMount:
      "[data-upstream-compass-mount]",

    rearCanvas:
      'canvas[data-showroom-compositor-layer="rear"]',

    frontCanvas:
      'canvas[data-showroom-compositor-layer="front"]'
  });

  const ATTRIBUTES = Object.freeze({
    ready:
      "data-showroom-compositor-ready",

    state:
      "data-showroom-compositor-state",

    held:
      "data-showroom-held",

    reducedMotion:
      "data-showroom-reduced-motion",

    activeCluster:
      "data-showroom-active-cluster",

    pageState:
      "data-showroom-state",

    presentationMode:
      "data-showroom-presentation-mode",

    enhancementState:
      "data-showroom-enhancement-state",

    layer:
      "data-showroom-compositor-layer",

    genericLayer:
      "data-showroom-layer",

    canvasOwner:
      "data-showroom-compositor-canvas-owner",

    viewportWidth:
      "data-showroom-compositor-width",

    viewportHeight:
      "data-showroom-compositor-height",

    deviceScale:
      "data-showroom-compositor-device-scale"
  });

  const LAYERS = Object.freeze({
    REAR:
      "rear",

    FRONT:
      "front"
  });

  const CONFIG = Object.freeze({
    coordinateSystem:
      "RIGHT_HANDED_EUCLIDEAN_XYZ",

    matrixConvention:
      "COLUMN_MAJOR_OPENGL_STYLE",

    cameraTarget:
      Object.freeze([
        0,
        0,
        0
      ]),

    cameraUp:
      Object.freeze([
        0,
        1,
        0
      ]),

    fieldRadiusX:
      2.18,

    fieldRadiusY:
      1.68,

    maximumFieldDepth:
      1.72,

    verticalFieldOfViewDegrees:
      52,

    horizontalViewportOccupancy:
      0.78,

    verticalViewportOccupancy:
      0.72,

    cameraNear:
      0.1,

    cameraFar:
      40,

    compassPlaneWorldZ:
      0,

    defaultHysteresis:
      0.08,

    visibilityMargin:
      1.32,

    maximumDeviceScale:
      2,

    minimumViewportDimension:
      2,

    rearCanvasZIndex:
      4,

    compassLayerZIndex:
      6,

    frontCanvasZIndex:
      7,

    frameFailureLimit:
      8,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const state = {
    root: null,
    receipt: null,
    orbitField: null,
    compassLayer: null,
    compassMount: null,

    rearCanvas: null,
    frontCanvas: null,

    rearContext: null,
    frontContext: null,

    ownsRearCanvas: false,
    ownsFrontCanvas: false,

    nodes: new Map(),
    classifications: new Map(),

    viewport: {
      cssWidth: 0,
      cssHeight: 0,
      pixelWidth: 0,
      pixelHeight: 0,
      deviceScale: 1,
      centerX: 0,
      centerY: 0,
      compassRadius: 0,
      aspect: 1
    },

    camera: {
      eye:
        [0, 0, 6],

      target:
        CONFIG.cameraTarget.slice(),

      up:
        CONFIG.cameraUp.slice(),

      distance:
        6,

      verticalFieldOfView:
        degreesToRadians(
          CONFIG.verticalFieldOfViewDegrees
        ),

      viewMatrix:
        identityMatrix4(),

      projectionMatrix:
        identityMatrix4(),

      viewProjectionMatrix:
        identityMatrix4()
    },

    held: false,
    reducedMotion: false,
    activeClusterId: "",
    pageState: "",
    presentationMode: "",
    enhancementState: "",

    initialized: false,
    ready: false,
    failed: false,
    disposed: false,

    frameRequested: false,
    frameId: 0,
    frameReasons: new Set(),
    frameFailureCount: 0,
    lastFrameTime: 0,

    listeners: [],
    observers: [],

    counters: {
      createdCanvases: 0,
      adoptedCanvases: 0,
      registeredNodes: 0,
      unregisteredNodes: 0,
      renderedFrames: 0,
      rearDraws: 0,
      frontDraws: 0,
      classifications: 0,
      hysteresisRetentions: 0,
      resizeEvents: 0,
      projectionCalls: 0,
      drawErrors: 0,
      recoverableErrors: 0,
      failures: 0
    }
  };

  function normalize(value) {
    return String(value || "").trim();
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.min(
      maximum,
      Math.max(
        minimum,
        value
      )
    );
  }

  function degreesToRadians(degrees) {
    return (
      Number(degrees) *
      Math.PI /
      180
    );
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function identityMatrix4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function vectorSubtract(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function vectorDot(a, b) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function vectorCross(a, b) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function vectorNormalize(
    vector,
    fallback = [0, 0, 1]
  ) {
    const length =
      Math.hypot(
        vector[0],
        vector[1],
        vector[2]
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-8
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function multiplyMatrix4(
    left,
    right
  ) {
    const result =
      new Array(16).fill(0);

    for (
      let column = 0;
      column < 4;
      column += 1
    ) {
      for (
        let row = 0;
        row < 4;
        row += 1
      ) {
        result[
          column * 4 +
          row
        ] =
          left[row] *
            right[column * 4] +
          left[4 + row] *
            right[column * 4 + 1] +
          left[8 + row] *
            right[column * 4 + 2] +
          left[12 + row] *
            right[column * 4 + 3];
      }
    }

    return result;
  }

  function transformVector4(
    matrix,
    vector
  ) {
    return [
      matrix[0] * vector[0] +
        matrix[4] * vector[1] +
        matrix[8] * vector[2] +
        matrix[12] * vector[3],

      matrix[1] * vector[0] +
        matrix[5] * vector[1] +
        matrix[9] * vector[2] +
        matrix[13] * vector[3],

      matrix[2] * vector[0] +
        matrix[6] * vector[1] +
        matrix[10] * vector[2] +
        matrix[14] * vector[3],

      matrix[3] * vector[0] +
        matrix[7] * vector[1] +
        matrix[11] * vector[2] +
        matrix[15] * vector[3]
    ];
  }

  function createLookAtMatrix(
    eye,
    target,
    up
  ) {
    const forward =
      vectorNormalize(
        vectorSubtract(
          eye,
          target
        ),
        [0, 0, 1]
      );

    const right =
      vectorNormalize(
        vectorCross(
          up,
          forward
        ),
        [1, 0, 0]
      );

    const correctedUp =
      vectorCross(
        forward,
        right
      );

    return [
      right[0],
      correctedUp[0],
      forward[0],
      0,

      right[1],
      correctedUp[1],
      forward[1],
      0,

      right[2],
      correctedUp[2],
      forward[2],
      0,

      -vectorDot(
        right,
        eye
      ),

      -vectorDot(
        correctedUp,
        eye
      ),

      -vectorDot(
        forward,
        eye
      ),

      1
    ];
  }

  function createPerspectiveMatrix(
    verticalFieldOfView,
    aspect,
    near,
    far
  ) {
    const safeAspect =
      Math.max(
        0.01,
        aspect
      );

    const focal =
      1 /
      Math.tan(
        verticalFieldOfView /
        2
      );

    const rangeInverse =
      1 /
      (
        near -
        far
      );

    return [
      focal / safeAspect,
      0,
      0,
      0,

      0,
      focal,
      0,
      0,

      0,
      0,
      (
        far +
        near
      ) *
      rangeInverse,
      -1,

      0,
      0,
      (
        2 *
        far *
        near
      ) *
      rangeInverse,
      0
    ];
  }

  function addListener(
    target,
    type,
    handler,
    options
  ) {
    if (
      !target ||
      typeof target.addEventListener !==
        "function"
    ) {
      return;
    }

    target.addEventListener(
      type,
      handler,
      options
    );

    state.listeners.push(() => {
      target.removeEventListener(
        type,
        handler,
        options
      );
    });
  }

  function addObserver(observer) {
    if (observer) {
      state.observers.push(
        observer
      );
    }
  }

  function setRootAttribute(
    name,
    value
  ) {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      name,
      String(value)
    );
  }

  function dispatch(
    eventName,
    detail = {}
  ) {
    const payload =
      Object.freeze({
        contract:
          CONTRACT,

        owner:
          OWNER,

        timestamp:
          nowIso(),

        ...detail
      });

    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function serializeError(error) {
    return Object.freeze({
      name:
        error instanceof Error
          ? error.name
          : "Error",

      message:
        error instanceof Error
          ? error.message
          : String(error)
    });
  }

  function createReceipt(
    event,
    extra = {}
  ) {
    return Object.freeze({
      contract:
        CONTRACT,

      owner:
        OWNER,

      event,

      timestamp:
        nowIso(),

      initialized:
        state.initialized,

      ready:
        state.ready,

      failed:
        state.failed,

      disposed:
        state.disposed,

      nodeCount:
        state.nodes.size,

      coordinateSystem:
        CONFIG.coordinateSystem,

      matrixConvention:
        CONFIG.matrixConvention,

      viewport:
        Object.freeze({
          cssWidth:
            state.viewport.cssWidth,

          cssHeight:
            state.viewport.cssHeight,

          pixelWidth:
            state.viewport.pixelWidth,

          pixelHeight:
            state.viewport.pixelHeight,

          deviceScale:
            state.viewport.deviceScale,

          centerX:
            state.viewport.centerX,

          centerY:
            state.viewport.centerY,

          compassRadius:
            state.viewport.compassRadius,

          aspect:
            state.viewport.aspect
        }),

      camera:
        Object.freeze({
          eye:
            Object.freeze(
              state.camera.eye.slice()
            ),

          target:
            Object.freeze(
              state.camera.target.slice()
            ),

          distance:
            state.camera.distance,

          verticalFieldOfView:
            state.camera.verticalFieldOfView
        }),

      controllerState:
        Object.freeze({
          held:
            state.held,

          reducedMotion:
            state.reducedMotion,

          activeClusterId:
            state.activeClusterId ||
            null,

          pageState:
            state.pageState ||
            null,

          presentationMode:
            state.presentationMode ||
            null,

          enhancementState:
            state.enhancementState ||
            null
        }),

      visualPassClaimed:
        CONFIG.visualPassClaimed,

      productionAuthorized:
        CONFIG.productionAuthorized,

      deploymentAuthorized:
        CONFIG.deploymentAuthorized,

      counters:
        Object.freeze({
          ...state.counters
        }),

      ...extra
    });
  }

  function publishReceipt(
    event,
    extra = {}
  ) {
    const payload =
      createReceipt(
        event,
        extra
      );

    if (state.receipt) {
      const serialized =
        JSON.stringify(
          payload
        );

      state.receipt.value =
        serialized;

      state.receipt.textContent =
        serialized;
    }

    dispatch(
      EVENTS.receipt,
      payload
    );

    return payload;
  }

  function reportRecoverableError(
    scope,
    error,
    extra = {}
  ) {
    state.counters.recoverableErrors +=
      1;

    publishReceipt(
      "recoverable-error",
      {
        scope,

        error:
          serializeError(
            error
          ),

        ...extra
      }
    );
  }

  function resolveCanvasContext(canvas) {
    if (!canvas) {
      return null;
    }

    return canvas.getContext(
      "2d",
      {
        alpha: true,
        desynchronized: true
      }
    );
  }

  function prepareCanvasElement(
    canvas,
    layer,
    owned
  ) {
    canvas.setAttribute(
      ATTRIBUTES.layer,
      layer
    );

    canvas.setAttribute(
      ATTRIBUTES.genericLayer,
      layer
    );

    canvas.setAttribute(
      ATTRIBUTES.canvasOwner,
      owned
        ? CONTRACT
        : (
            canvas.getAttribute(
              ATTRIBUTES.canvasOwner
            ) ||
            "adopted"
          )
    );

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "role",
      "presentation"
    );

    canvas.tabIndex =
      -1;

    canvas.style.position =
      "absolute";

    canvas.style.inset =
      "0";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.display =
      "block";

    canvas.style.pointerEvents =
      "none";

    canvas.style.background =
      "transparent";

    canvas.style.contain =
      "strict";

    canvas.style.userSelect =
      "none";

    canvas.style.webkitUserSelect =
      "none";

    canvas.style.touchAction =
      "none";

    canvas.style.zIndex =
      String(
        layer === LAYERS.REAR
          ? CONFIG.rearCanvasZIndex
          : CONFIG.frontCanvasZIndex
      );
  }

  function createCanvas(layer) {
    const canvas =
      document.createElement(
        "canvas"
      );

    prepareCanvasElement(
      canvas,
      layer,
      true
    );

    state.counters.createdCanvases +=
      1;

    return canvas;
  }

  function adoptOrCreateCanvas(layer) {
    const selector =
      layer === LAYERS.REAR
        ? SELECTORS.rearCanvas
        : SELECTORS.frontCanvas;

    let canvas =
      state.orbitField.querySelector(
        selector
      );

    let owned = false;

    if (!canvas) {
      canvas =
        createCanvas(layer);

      owned = true;
    } else {
      prepareCanvasElement(
        canvas,
        layer,
        false
      );

      state.counters.adoptedCanvases +=
        1;
    }

    return Object.freeze({
      canvas,
      owned
    });
  }

  function placeCanvasLayers() {
    const rearResult =
      adoptOrCreateCanvas(
        LAYERS.REAR
      );

    const frontResult =
      adoptOrCreateCanvas(
        LAYERS.FRONT
      );

    state.rearCanvas =
      rearResult.canvas;

    state.frontCanvas =
      frontResult.canvas;

    state.ownsRearCanvas =
      rearResult.owned;

    state.ownsFrontCanvas =
      frontResult.owned;

    if (
      state.compassLayer &&
      state.compassLayer.parentElement ===
        state.orbitField
    ) {
      state.orbitField.insertBefore(
        state.rearCanvas,
        state.compassLayer
      );

      state.orbitField.insertBefore(
        state.frontCanvas,
        state.compassLayer.nextSibling
      );
    } else {
      state.orbitField.prepend(
        state.rearCanvas
      );

      state.orbitField.append(
        state.frontCanvas
      );
    }

    if (state.compassLayer) {
      state.compassLayer.style.zIndex =
        String(
          CONFIG.compassLayerZIndex
        );
    }

    state.rearContext =
      resolveCanvasContext(
        state.rearCanvas
      );

    state.frontContext =
      resolveCanvasContext(
        state.frontCanvas
      );

    if (
      !state.rearContext ||
      !state.frontContext
    ) {
      throw new Error(
        "The Showroom compositor could not obtain both 2D canvas contexts."
      );
    }
  }

  function calculateResponsiveCameraDistance(
    aspect
  ) {
    const verticalHalfAngle =
      state.camera.verticalFieldOfView /
      2;

    const tangent =
      Math.max(
        0.01,
        Math.tan(
          verticalHalfAngle
        )
      );

    const horizontalDistance =
      CONFIG.fieldRadiusX /
      (
        tangent *
        Math.max(
          0.01,
          aspect
        ) *
        CONFIG.horizontalViewportOccupancy
      );

    const verticalDistance =
      CONFIG.fieldRadiusY /
      (
        tangent *
        CONFIG.verticalViewportOccupancy
      );

    return (
      Math.max(
        horizontalDistance,
        verticalDistance
      ) +
      CONFIG.maximumFieldDepth +
      0.36
    );
  }

  function measureCompassCenter(
    fieldRect
  ) {
    const reference =
      state.compassLayer ||
      state.compassMount;

    if (
      !reference ||
      !reference.isConnected
    ) {
      return Object.freeze({
        x:
          fieldRect.width *
          0.5,

        y:
          fieldRect.height *
          0.5,

        radius:
          0
      });
    }

    const compassRect =
      reference.getBoundingClientRect();

    if (
      compassRect.width <= 0 ||
      compassRect.height <= 0
    ) {
      return Object.freeze({
        x:
          fieldRect.width *
          0.5,

        y:
          fieldRect.height *
          0.5,

        radius:
          0
      });
    }

    return Object.freeze({
      x:
        compassRect.left -
        fieldRect.left +
        compassRect.width *
        0.5,

      y:
        compassRect.top -
        fieldRect.top +
        compassRect.height *
        0.5,

      radius:
        Math.min(
          compassRect.width,
          compassRect.height
        ) *
        0.5
    });
  }

  function configureContext(
    context,
    deviceScale
  ) {
    context.setTransform(
      deviceScale,
      0,
      0,
      deviceScale,
      0,
      0
    );

    context.imageSmoothingEnabled =
      true;

    if (
      "imageSmoothingQuality" in
      context
    ) {
      context.imageSmoothingQuality =
        "high";
    }
  }

  function updateMatrices() {
    const distance =
      calculateResponsiveCameraDistance(
        state.viewport.aspect
      );

    state.camera.distance =
      distance;

    state.camera.eye = [
      0,
      0,
      distance
    ];

    state.camera.viewMatrix =
      createLookAtMatrix(
        state.camera.eye,
        state.camera.target,
        state.camera.up
      );

    state.camera.projectionMatrix =
      createPerspectiveMatrix(
        state.camera.verticalFieldOfView,
        state.viewport.aspect,
        CONFIG.cameraNear,
        CONFIG.cameraFar
      );

    state.camera.viewProjectionMatrix =
      multiplyMatrix4(
        state.camera.projectionMatrix,
        state.camera.viewMatrix
      );
  }

  function resizeCanvases(
    reason = "resize"
  ) {
    if (
      state.disposed ||
      state.failed ||
      !state.orbitField ||
      !state.rearCanvas ||
      !state.frontCanvas
    ) {
      return false;
    }

    const fieldRect =
      state.orbitField
        .getBoundingClientRect();

    const cssWidth =
      Math.max(
        0,
        fieldRect.width
      );

    const cssHeight =
      Math.max(
        0,
        fieldRect.height
      );

    if (
      cssWidth <
        CONFIG.minimumViewportDimension ||
      cssHeight <
        CONFIG.minimumViewportDimension
    ) {
      return false;
    }

    const deviceScale =
      clamp(
        Number(
          window.devicePixelRatio
        ) || 1,
        1,
        CONFIG.maximumDeviceScale
      );

    const pixelWidth =
      Math.max(
        1,
        Math.round(
          cssWidth *
          deviceScale
        )
      );

    const pixelHeight =
      Math.max(
        1,
        Math.round(
          cssHeight *
          deviceScale
        )
      );

    const compass =
      measureCompassCenter(
        fieldRect
      );

    const changed =
      state.viewport.cssWidth !==
        cssWidth ||
      state.viewport.cssHeight !==
        cssHeight ||
      state.viewport.pixelWidth !==
        pixelWidth ||
      state.viewport.pixelHeight !==
        pixelHeight ||
      state.viewport.deviceScale !==
        deviceScale ||
      state.viewport.centerX !==
        compass.x ||
      state.viewport.centerY !==
        compass.y;

    state.viewport.cssWidth =
      cssWidth;

    state.viewport.cssHeight =
      cssHeight;

    state.viewport.pixelWidth =
      pixelWidth;

    state.viewport.pixelHeight =
      pixelHeight;

    state.viewport.deviceScale =
      deviceScale;

    state.viewport.centerX =
      compass.x;

    state.viewport.centerY =
      compass.y;

    state.viewport.compassRadius =
      compass.radius;

    state.viewport.aspect =
      cssWidth /
      Math.max(
        1,
        cssHeight
      );

    if (
      state.rearCanvas.width !==
      pixelWidth
    ) {
      state.rearCanvas.width =
        pixelWidth;
    }

    if (
      state.rearCanvas.height !==
      pixelHeight
    ) {
      state.rearCanvas.height =
        pixelHeight;
    }

    if (
      state.frontCanvas.width !==
      pixelWidth
    ) {
      state.frontCanvas.width =
        pixelWidth;
    }

    if (
      state.frontCanvas.height !==
      pixelHeight
    ) {
      state.frontCanvas.height =
        pixelHeight;
    }

    configureContext(
      state.rearContext,
      deviceScale
    );

    configureContext(
      state.frontContext,
      deviceScale
    );

    updateMatrices();

    setRootAttribute(
      ATTRIBUTES.viewportWidth,
      Math.round(
        cssWidth
      )
    );

    setRootAttribute(
      ATTRIBUTES.viewportHeight,
      Math.round(
        cssHeight
      )
    );

    setRootAttribute(
      ATTRIBUTES.deviceScale,
      deviceScale
    );

    if (changed) {
      state.counters.resizeEvents +=
        1;

      requestFrame(
        reason
      );
    }

    return true;
  }

  function normalizeWorldPosition(
    position
  ) {
    if (
      !position ||
      typeof position !==
        "object"
    ) {
      return null;
    }

    const x =
      Number(
        position.x
      );

    const y =
      Number(
        position.y
      );

    const z =
      Number(
        position.z
      );

    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      !Number.isFinite(z)
    ) {
      return null;
    }

    return Object.freeze({
      x,
      y,
      z
    });
  }

  function projectWorldToScreen(
    position
  ) {
    state.counters.projectionCalls +=
      1;

    if (
      state.disposed ||
      state.failed ||
      state.viewport.cssWidth <
        CONFIG.minimumViewportDimension ||
      state.viewport.cssHeight <
        CONFIG.minimumViewportDimension
    ) {
      return Object.freeze({
        visible:
          false,

        screen:
          Object.freeze({
            x: 0,
            y: 0
          }),

        world:
          null,

        ndc:
          null,

        clip:
          null,

        cameraDepth:
          Infinity,

        compassPlaneDistance:
          0,

        layer:
          null
      });
    }

    const world =
      normalizeWorldPosition(
        position
      );

    if (!world) {
      return Object.freeze({
        visible:
          false,

        screen:
          Object.freeze({
            x: 0,
            y: 0
          }),

        world:
          null,

        ndc:
          null,

        clip:
          null,

        cameraDepth:
          Infinity,

        compassPlaneDistance:
          0,

        layer:
          null
      });
    }

    const worldVector = [
      world.x,
      world.y,
      world.z,
      1
    ];

    const viewPosition =
      transformVector4(
        state.camera.viewMatrix,
        worldVector
      );

    const clipPosition =
      transformVector4(
        state.camera.projectionMatrix,
        viewPosition
      );

    const clipW =
      clipPosition[3];

    if (
      !Number.isFinite(clipW) ||
      Math.abs(clipW) <= 1e-8
    ) {
      return Object.freeze({
        visible:
          false,

        screen:
          Object.freeze({
            x:
              state.viewport.centerX,

            y:
              state.viewport.centerY
          }),

        world,

        ndc:
          null,

        clip:
          Object.freeze({
            x:
              clipPosition[0],

            y:
              clipPosition[1],

            z:
              clipPosition[2],

            w:
              clipW
          }),

        cameraDepth:
          Infinity,

        compassPlaneDistance:
          world.z -
          CONFIG.compassPlaneWorldZ,

        layer:
          null
      });
    }

    const ndcX =
      clipPosition[0] /
      clipW;

    const ndcY =
      clipPosition[1] /
      clipW;

    const ndcZ =
      clipPosition[2] /
      clipW;

    const screenX =
      state.viewport.centerX +
      ndcX *
      state.viewport.cssWidth *
      0.5;

    const screenY =
      state.viewport.centerY -
      ndcY *
      state.viewport.cssHeight *
      0.5;

    const cameraDepth =
      Math.max(
        0,
        -viewPosition[2]
      );

    const visible =
      clipW > 0 &&
      Number.isFinite(screenX) &&
      Number.isFinite(screenY) &&
      Math.abs(ndcX) <=
        CONFIG.visibilityMargin &&
      Math.abs(ndcY) <=
        CONFIG.visibilityMargin &&
      ndcZ >= -1.2 &&
      ndcZ <= 1.2;

    return Object.freeze({
      visible,

      screen:
        Object.freeze({
          x:
            screenX,

          y:
            screenY
        }),

      world,

      view:
        Object.freeze({
          x:
            viewPosition[0],

          y:
            viewPosition[1],

          z:
            viewPosition[2],

          w:
            viewPosition[3]
        }),

      ndc:
        Object.freeze({
          x:
            ndcX,

          y:
            ndcY,

          z:
            ndcZ
        }),

      clip:
        Object.freeze({
          x:
            clipPosition[0],

          y:
            clipPosition[1],

          z:
            clipPosition[2],

          w:
            clipW
        }),

      cameraDepth,

      compassPlaneDistance:
        world.z -
        CONFIG.compassPlaneWorldZ,

      compassCenter:
        Object.freeze({
          x:
            state.viewport.centerX,

          y:
            state.viewport.centerY,

          radius:
            state.viewport.compassRadius
        }),

      viewport:
        Object.freeze({
          width:
            state.viewport.cssWidth,

          height:
            state.viewport.cssHeight,

          deviceScale:
            state.viewport.deviceScale
        }),

      layer:
        null
    });
  }

  function validateRegistrationDefinition(
    definition
  ) {
    if (
      !definition ||
      typeof definition !==
        "object"
    ) {
      throw new TypeError(
        "A compositor node definition must be an object."
      );
    }

    const id =
      normalize(
        definition.id
      );

    if (!id) {
      throw new Error(
        "A compositor node definition is missing an id."
      );
    }

    if (
      typeof definition.getWorldPosition !==
        "function"
    ) {
      throw new Error(
        `Compositor node "${id}" is missing getWorldPosition().`
      );
    }

    if (
      typeof definition.draw !==
        "function"
    ) {
      throw new Error(
        `Compositor node "${id}" is missing draw().`
      );
    }

    return id;
  }

  function createNodeRecord(
    definition
  ) {
    const id =
      validateRegistrationDefinition(
        definition
      );

    const hysteresis =
      clamp(
        Number(
          definition.hysteresis
        ) ||
        CONFIG.defaultHysteresis,
        0,
        0.5
      );

    return {
      id,

      owner:
        normalize(
          definition.owner
        ) ||
        "unknown",

      getWorldPosition:
        definition.getWorldPosition,

      isVisible:
        typeof definition.isVisible ===
          "function"
          ? definition.isVisible
          : () => true,

      getSortBias:
        typeof definition.getSortBias ===
          "function"
          ? definition.getSortBias
          : () => 0,

      getMetadata:
        typeof definition.getMetadata ===
          "function"
          ? definition.getMetadata
          : () => null,

      draw:
        definition.draw,

      hysteresis,

      disposed:
        false
    };
  }

  function unregisterNode(nodeId) {
    const id =
      normalize(
        typeof nodeId ===
          "object" &&
        nodeId
          ? nodeId.id
          : nodeId
      );

    if (!id) {
      return false;
    }

    const record =
      state.nodes.get(id);

    if (!record) {
      return false;
    }

    record.disposed =
      true;

    state.nodes.delete(id);
    state.classifications.delete(id);

    state.counters.unregisteredNodes +=
      1;

    requestFrame(
      "node-unregistered"
    );

    publishReceipt(
      "node-unregistered",
      {
        nodeId:
          id
      }
    );

    return true;
  }

  function registerNode(definition) {
    if (
      state.disposed ||
      state.failed ||
      !state.ready
    ) {
      throw new Error(
        "The Showroom compositor is not available for node registration."
      );
    }

    const record =
      createNodeRecord(
        definition
      );

    if (
      state.nodes.has(
        record.id
      )
    ) {
      unregisterNode(
        record.id
      );
    }

    state.nodes.set(
      record.id,
      record
    );

    state.counters.registeredNodes +=
      1;

    requestFrame(
      "node-registered"
    );

    publishReceipt(
      "node-registered",
      {
        nodeId:
          record.id,

        nodeOwner:
          record.owner,

        hysteresis:
          record.hysteresis
      }
    );

    let unregistered = false;

    return Object.freeze({
      id:
        record.id,

      owner:
        record.owner,

      unregister() {
        if (unregistered) {
          return false;
        }

        unregistered = true;

        return unregisterNode(
          record.id
        );
      }
    });
  }

  function classifyNode(
    record,
    projection
  ) {
    const previous =
      state.classifications.get(
        record.id
      );

    const distance =
      projection.compassPlaneDistance;

    let layer;

    if (
      distance >
      record.hysteresis
    ) {
      layer =
        LAYERS.FRONT;
    } else if (
      distance <
      -record.hysteresis
    ) {
      layer =
        LAYERS.REAR;
    } else if (previous) {
      layer =
        previous;

      state.counters.hysteresisRetentions +=
        1;
    } else {
      layer =
        distance >= 0
          ? LAYERS.FRONT
          : LAYERS.REAR;
    }

    state.classifications.set(
      record.id,
      layer
    );

    state.counters.classifications +=
      1;

    return layer;
  }

  function clearContext(context) {
    context.save();

    context.setTransform(
      1,
      0,
      0,
      1,
      0,
      0
    );

    context.clearRect(
      0,
      0,
      state.viewport.pixelWidth,
      state.viewport.pixelHeight
    );

    context.restore();

    configureContext(
      context,
      state.viewport.deviceScale
    );
  }

  function safelyReadNodeVisibility(
    record
  ) {
    try {
      return Boolean(
        record.isVisible()
      );
    } catch (error) {
      reportRecoverableError(
        "node-visibility",
        error,
        {
          nodeId:
            record.id
        }
      );

      return false;
    }
  }

  function safelyReadNodePosition(
    record
  ) {
    try {
      return normalizeWorldPosition(
        record.getWorldPosition()
      );
    } catch (error) {
      reportRecoverableError(
        "node-world-position",
        error,
        {
          nodeId:
            record.id
        }
      );

      return null;
    }
  }

  function safelyReadSortBias(
    record
  ) {
    try {
      const value =
        Number(
          record.getSortBias()
        );

      return Number.isFinite(value)
        ? value
        : 0;
    } catch (error) {
      reportRecoverableError(
        "node-sort-bias",
        error,
        {
          nodeId:
            record.id
        }
      );

      return 0;
    }
  }

  function safelyReadMetadata(
    record
  ) {
    try {
      return record.getMetadata();
    } catch (error) {
      reportRecoverableError(
        "node-metadata",
        error,
        {
          nodeId:
            record.id
        }
      );

      return null;
    }
  }

  function collectRenderableEntries() {
    const rear = [];
    const front = [];

    for (
      const record
      of state.nodes.values()
    ) {
      if (
        record.disposed ||
        !safelyReadNodeVisibility(
          record
        )
      ) {
        continue;
      }

      const worldPosition =
        safelyReadNodePosition(
          record
        );

      if (!worldPosition) {
        continue;
      }

      const baseProjection =
        projectWorldToScreen(
          worldPosition
        );

      if (
        !baseProjection.visible
      ) {
        continue;
      }

      const layer =
        classifyNode(
          record,
          baseProjection
        );

      const projection =
        Object.freeze({
          ...baseProjection,

          layer
        });

      const entry = {
        record,
        projection,

        sortBias:
          safelyReadSortBias(
            record
          ),

        metadata:
          safelyReadMetadata(
            record
          )
      };

      if (
        layer ===
        LAYERS.FRONT
      ) {
        front.push(entry);
      } else {
        rear.push(entry);
      }
    }

    const painterSort = (
      left,
      right
    ) => {
      const leftDepth =
        left.projection.cameraDepth +
        left.sortBias;

      const rightDepth =
        right.projection.cameraDepth +
        right.sortBias;

      return (
        rightDepth -
        leftDepth
      );
    };

    rear.sort(
      painterSort
    );

    front.sort(
      painterSort
    );

    return Object.freeze({
      rear,
      front
    });
  }

  function drawEntry(
    context,
    entry,
    layer,
    timestamp
  ) {
    context.save();

    try {
      entry.record.draw(
        Object.freeze({
          context,

          projection:
            entry.projection,

          layer,

          metadata:
            entry.metadata,

          timestamp,

          viewport:
            Object.freeze({
              width:
                state.viewport.cssWidth,

              height:
                state.viewport.cssHeight,

              deviceScale:
                state.viewport.deviceScale,

              centerX:
                state.viewport.centerX,

              centerY:
                state.viewport.centerY,

              compassRadius:
                state.viewport.compassRadius
            }),

          camera:
            Object.freeze({
              eye:
                Object.freeze(
                  state.camera.eye.slice()
                ),

              target:
                Object.freeze(
                  state.camera.target.slice()
                ),

              distance:
                state.camera.distance,

              viewMatrix:
                Object.freeze(
                  state.camera.viewMatrix
                    .slice()
                ),

              projectionMatrix:
                Object.freeze(
                  state.camera
                    .projectionMatrix
                    .slice()
                ),

              viewProjectionMatrix:
                Object.freeze(
                  state.camera
                    .viewProjectionMatrix
                    .slice()
                )
            }),

          requestFrame,

          compositorContract:
            CONTRACT
        })
      );

      if (
        layer ===
        LAYERS.FRONT
      ) {
        state.counters.frontDraws +=
          1;
      } else {
        state.counters.rearDraws +=
          1;
      }
    } catch (error) {
      state.counters.drawErrors +=
        1;

      reportRecoverableError(
        "node-draw",
        error,
        {
          nodeId:
            entry.record.id,

          layer
        }
      );
    } finally {
      context.restore();
    }
  }

  function renderFrame(timestamp) {
    state.frameRequested =
      false;

    state.frameId =
      0;

    const reasons =
      Array.from(
        state.frameReasons
      );

    state.frameReasons.clear();

    if (
      state.disposed ||
      state.failed ||
      !state.ready
    ) {
      return;
    }

    try {
      resizeCanvases(
        "frame-measurement"
      );

      if (
        state.viewport.cssWidth <
          CONFIG.minimumViewportDimension ||
        state.viewport.cssHeight <
          CONFIG.minimumViewportDimension
      ) {
        return;
      }

      clearContext(
        state.rearContext
      );

      clearContext(
        state.frontContext
      );

      const entries =
        collectRenderableEntries();

      for (
        const entry
        of entries.rear
      ) {
        drawEntry(
          state.rearContext,
          entry,
          LAYERS.REAR,
          timestamp
        );
      }

      for (
        const entry
        of entries.front
      ) {
        drawEntry(
          state.frontContext,
          entry,
          LAYERS.FRONT,
          timestamp
        );
      }

      state.lastFrameTime =
        timestamp;

      state.frameFailureCount =
        0;

      state.counters.renderedFrames +=
        1;

      if (
        reasons.includes(
          "manual-refresh"
        )
      ) {
        publishReceipt(
          "frame-rendered",
          {
            reasons,

            rearNodeCount:
              entries.rear.length,

            frontNodeCount:
              entries.front.length
          }
        );
      }
    } catch (error) {
      state.frameFailureCount +=
        1;

      reportRecoverableError(
        "render-frame",
        error,
        {
          reasons,

          consecutiveFrameFailures:
            state.frameFailureCount
        }
      );

      if (
        state.frameFailureCount >=
        CONFIG.frameFailureLimit
      ) {
        fail(
          new Error(
            `The Showroom compositor exceeded ${CONFIG.frameFailureLimit} consecutive frame failures.`
          )
        );
      }
    }
  }

  function requestFrame(
    reason = "unspecified"
  ) {
    if (
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    state.frameReasons.add(
      normalize(reason) ||
      "unspecified"
    );

    if (
      state.frameRequested
    ) {
      return true;
    }

    state.frameRequested =
      true;

    state.frameId =
      window.requestAnimationFrame(
        renderFrame
      );

    return true;
  }

  function readControllerState() {
    if (!state.root) {
      return;
    }

    state.held =
      state.root.getAttribute(
        ATTRIBUTES.held
      ) === "true";

    state.reducedMotion =
      state.root.getAttribute(
        ATTRIBUTES.reducedMotion
      ) === "true" ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    state.activeClusterId =
      normalize(
        state.root.getAttribute(
          ATTRIBUTES.activeCluster
        )
      );

    state.pageState =
      normalize(
        state.root.getAttribute(
          ATTRIBUTES.pageState
        )
      );

    state.presentationMode =
      normalize(
        state.root.getAttribute(
          ATTRIBUTES.presentationMode
        )
      );

    state.enhancementState =
      normalize(
        state.root.getAttribute(
          ATTRIBUTES.enhancementState
        )
      );
  }

  function handleControllerSignal(
    event
  ) {
    readControllerState();

    requestFrame(
      event &&
      event.type
        ? event.type
        : "controller-signal"
    );
  }

  function initializeObservers() {
    if (
      "ResizeObserver" in
      window
    ) {
      const resizeObserver =
        new ResizeObserver(
          () => {
            resizeCanvases(
              "resize-observer"
            );
          }
        );

      resizeObserver.observe(
        state.orbitField
      );

      if (
        state.compassLayer &&
        state.compassLayer !==
          state.orbitField
      ) {
        resizeObserver.observe(
          state.compassLayer
        );
      }

      addObserver(
        resizeObserver
      );
    } else {
      addListener(
        window,
        "resize",
        () => {
          resizeCanvases(
            "window-resize"
          );
        },
        {
          passive: true
        }
      );
    }

    const rootObserver =
      new MutationObserver(
        () => {
          readControllerState();

          requestFrame(
            "root-state-mutated"
          );
        }
      );

    rootObserver.observe(
      state.root,
      {
        attributes:
          true,

        attributeFilter: [
          ATTRIBUTES.held,
          ATTRIBUTES.reducedMotion,
          ATTRIBUTES.activeCluster,
          ATTRIBUTES.pageState,
          ATTRIBUTES.presentationMode,
          ATTRIBUTES.enhancementState
        ]
      }
    );

    addObserver(
      rootObserver
    );
  }

  function initializeEvents() {
    addListener(
      window,
      EVENTS.requestFrame,
      event => {
        const detail =
          event &&
          event.detail
            ? event.detail
            : {};

        requestFrame(
          normalize(
            detail.reason
          ) ||
          "external-request"
        );
      }
    );

    addListener(
      window,
      EVENTS.stateChanged,
      handleControllerSignal
    );

    addListener(
      window,
      EVENTS.clusterChanged,
      handleControllerSignal
    );

    addListener(
      window,
      EVENTS.frontChanged,
      handleControllerSignal
    );

    addListener(
      window,
      EVENTS.interactionState,
      handleControllerSignal
    );

    addListener(
      window,
      "pageshow",
      () => {
        resizeCanvases(
          "pageshow"
        );

        requestFrame(
          "pageshow"
        );
      }
    );
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        registerNode,

        unregisterNode,

        projectWorldToScreen,

        requestFrame,

        refresh() {
          readControllerState();

          resizeCanvases(
            "manual-refresh"
          );

          requestFrame(
            "manual-refresh"
          );

          return createReceipt(
            "manual-refresh"
          );
        },

        getState() {
          return createReceipt(
            "state-requested",
            {
              nodeIds:
                Object.freeze(
                  Array.from(
                    state.nodes.keys()
                  )
                ),

              classifications:
                Object.freeze(
                  Array.from(
                    state.classifications
                      .entries()
                  ).map(
                    (
                      [
                        nodeId,
                        layer
                      ]
                    ) =>
                      Object.freeze({
                        nodeId,
                        layer
                      })
                  )
                ),

              viewMatrix:
                Object.freeze(
                  state.camera.viewMatrix
                    .slice()
                ),

              projectionMatrix:
                Object.freeze(
                  state.camera
                    .projectionMatrix
                    .slice()
                ),

              viewProjectionMatrix:
                Object.freeze(
                  state.camera
                    .viewProjectionMatrix
                    .slice()
                )
            }
          );
        },

        dispose
      });

    Object.defineProperty(
      window,
      "SHOWROOM_COMPOSITOR",
      {
        configurable:
          true,

        enumerable:
          false,

        writable:
          false,

        value:
          api
      }
    );
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    state.receipt =
      document.querySelector(
        SELECTORS.receipt
      );

    state.orbitField =
      document.querySelector(
        SELECTORS.orbitField
      );

    state.compassLayer =
      state.orbitField
        ? state.orbitField
            .querySelector(
              SELECTORS.compassLayer
            )
        : null;

    state.compassMount =
      state.orbitField
        ? state.orbitField
            .querySelector(
              SELECTORS.compassMount
            )
        : null;
  }

  function validateDom() {
    const issues = [];

    if (!state.root) {
      issues.push(
        "Missing [data-showroom-root]."
      );
    }

    if (!state.receipt) {
      issues.push(
        "Missing [data-showroom-compositor-receipt]."
      );
    }

    if (!state.orbitField) {
      issues.push(
        "Missing [data-showroom-orbit-field]."
      );
    }

    if (!state.compassLayer) {
      issues.push(
        "Missing [data-showroom-compass-layer] inside the orbit field."
      );
    }

    if (
      state.orbitField &&
      state.compassLayer &&
      state.compassLayer.parentElement !==
        state.orbitField
    ) {
      issues.push(
        "The Compass layer is not a direct child of the orbit field."
      );
    }

    if (issues.length) {
      throw new Error(
        issues.join(" ")
      );
    }
  }

  function clearCanvas(
    canvas,
    context
  ) {
    if (
      !canvas ||
      !context
    ) {
      return;
    }

    try {
      context.save();

      context.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
      );

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.restore();
    } catch {
      /* Canvas cleanup remains best-effort. */
    }
  }

  function removeOrRestoreCanvas(
    canvas,
    owned
  ) {
    if (!canvas) {
      return;
    }

    if (
      owned &&
      canvas.parentNode
    ) {
      canvas.parentNode.removeChild(
        canvas
      );

      return;
    }

    canvas.removeAttribute(
      ATTRIBUTES.layer
    );

    canvas.removeAttribute(
      ATTRIBUTES.genericLayer
    );

    canvas.removeAttribute(
      ATTRIBUTES.canvasOwner
    );

    canvas.removeAttribute(
      "role"
    );

    canvas.removeAttribute(
      "tabindex"
    );

    canvas.style.removeProperty(
      "position"
    );

    canvas.style.removeProperty(
      "inset"
    );

    canvas.style.removeProperty(
      "width"
    );

    canvas.style.removeProperty(
      "height"
    );

    canvas.style.removeProperty(
      "display"
    );

    canvas.style.removeProperty(
      "pointer-events"
    );

    canvas.style.removeProperty(
      "background"
    );

    canvas.style.removeProperty(
      "contain"
    );

    canvas.style.removeProperty(
      "user-select"
    );

    canvas.style.removeProperty(
      "-webkit-user-select"
    );

    canvas.style.removeProperty(
      "touch-action"
    );

    canvas.style.removeProperty(
      "z-index"
    );
  }

  function rollbackDom() {
    clearCanvas(
      state.rearCanvas,
      state.rearContext
    );

    clearCanvas(
      state.frontCanvas,
      state.frontContext
    );

    removeOrRestoreCanvas(
      state.rearCanvas,
      state.ownsRearCanvas
    );

    removeOrRestoreCanvas(
      state.frontCanvas,
      state.ownsFrontCanvas
    );

    if (state.compassLayer) {
      state.compassLayer.style.removeProperty(
        "z-index"
      );
    }
  }

  function fail(error) {
    if (
      state.failed ||
      state.disposed
    ) {
      return;
    }

    state.failed =
      true;

    state.ready =
      false;

    state.counters.failures +=
      1;

    if (state.frameId) {
      window.cancelAnimationFrame(
        state.frameId
      );

      state.frameId =
        0;
    }

    state.frameRequested =
      false;

    state.frameReasons.clear();

    rollbackDom();

    setRootAttribute(
      ATTRIBUTES.ready,
      "false"
    );

    setRootAttribute(
      ATTRIBUTES.state,
      "failed"
    );

    const serialized =
      serializeError(error);

    publishReceipt(
      "failed",
      {
        error:
          serialized
      }
    );

    dispatch(
      EVENTS.failed,
      {
        error:
          serialized
      }
    );
  }

  function initialize() {
    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    try {
      discoverDom();
      validateDom();

      readControllerState();
      placeCanvasLayers();

      resizeCanvases(
        "initial-layout"
      );

      initializeObservers();
      initializeEvents();
      exposeApi();

      state.initialized =
        true;

      state.ready =
        true;

      setRootAttribute(
        ATTRIBUTES.ready,
        "true"
      );

      setRootAttribute(
        ATTRIBUTES.state,
        "ready"
      );

      requestFrame(
        "initial-frame"
      );

      publishReceipt(
        "ready",
        {
          rearCanvasOwned:
            state.ownsRearCanvas,

          frontCanvasOwned:
            state.ownsFrontCanvas,

          compassLayerResolved:
            Boolean(
              state.compassLayer
            ),

          pointerTransparent:
            true
        }
      );

      dispatch(
        EVENTS.ready,
        {
          rearCanvas:
            true,

          frontCanvas:
            true,

          orbitField:
            true,

          compassLayer:
            true,

          api:
            Object.freeze([
              "registerNode",
              "unregisterNode",
              "projectWorldToScreen",
              "requestFrame",
              "refresh",
              "getState",
              "dispose"
            ])
        }
      );
    } catch (error) {
      fail(error);
    }
  }

  function dispose() {
    if (state.disposed) {
      return;
    }

    state.disposed =
      true;

    state.ready =
      false;

    if (state.frameId) {
      window.cancelAnimationFrame(
        state.frameId
      );

      state.frameId =
        0;
    }

    state.frameRequested =
      false;

    state.frameReasons.clear();

    for (
      const removeListener
      of state.listeners.splice(0)
    ) {
      try {
        removeListener();
      } catch {
        /* Disposal remains best-effort. */
      }
    }

    for (
      const observer
      of state.observers.splice(0)
    ) {
      try {
        observer.disconnect();
      } catch {
        /* Disposal remains best-effort. */
      }
    }

    for (
      const record
      of state.nodes.values()
    ) {
      record.disposed =
        true;
    }

    state.nodes.clear();
    state.classifications.clear();

    rollbackDom();

    setRootAttribute(
      ATTRIBUTES.ready,
      "false"
    );

    setRootAttribute(
      ATTRIBUTES.state,
      "disposed"
    );

    publishReceipt(
      "disposed"
    );

    dispatch(
      EVENTS.disposed
    );

    try {
      delete window.SHOWROOM_COMPOSITOR;
    } catch {
      /* Noncritical cleanup. */
    }
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once:
          true
      }
    );
  } else {
    initialize();
  }

  window.addEventListener(
    "pagehide",
    event => {
      if (!event.persisted) {
        dispose();
      }
    },
    {
      once:
        true
    }
  );
})();
