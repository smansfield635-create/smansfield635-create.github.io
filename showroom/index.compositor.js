/* TARGET FILE: /showroom/index.compositor.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v2 */
/*
  Upstream semantic authority:
  - /showroom/index.controller.js
  - SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v5

  Frozen DOM attachment contract:
  - [data-showroom-root]
  - #showroom-orbit
  - [data-showroom-orbit-scene]
  - [data-showroom-orbit-field]
  - [data-showroom-compass-layer]
  - [data-showroom-compass-visual-mount]
  - [data-showroom-semantic-star-layer]
  - [data-showroom-front-host]

  Compositor authority:
  - camera eye and target;
  - view and projection matrices;
  - Compass visual-plane depth;
  - world-to-screen projection;
  - front/rear classification;
  - classification hysteresis;
  - rear/front canvas construction;
  - page-level render-layer ordering;
  - rear / Compass / front orchestration;
  - authoritative projected hit coordinates;
  - bounded renderer and node registration.

  Explicit exclusions:
  - no semantic navigation ownership;
  - no cardinal, cluster, child, route, or local-destination decisions;
  - no Compass navigation ownership;
  - no Compass renderer lifecycle ownership;
  - no crystal mesh, material, geometry, or animation ownership;
  - no pointer or gesture interpretation;
  - no Diamond or Window ownership;
  - no front-host visibility ownership.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v2";

  const OWNER =
    "/showroom/index.compositor.js";

  const CONTROLLER_CONTRACT =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v5";

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    orbit:
      "#showroom-orbit",

    scene:
      "[data-showroom-orbit-scene]",

    field:
      "[data-showroom-orbit-field]",

    compassLayer:
      "[data-showroom-compass-layer]",

    compassVisualMount:
      "[data-showroom-compass-visual-mount]",

    semanticLayer:
      "[data-showroom-semantic-star-layer]",

    frontHost:
      "[data-showroom-front-host]",

    rearCanvas:
      'canvas[data-showroom-compositor-layer="rear"]',

    frontCanvas:
      'canvas[data-showroom-compositor-layer="front"]',

    receipt:
      "[data-showroom-compositor-receipt]"
  });

  const ATTRIBUTES = Object.freeze({
    layer:
      "data-showroom-compositor-layer",

    compositorReady:
      "data-showroom-compositor-ready",

    compositorState:
      "data-showroom-compositor-state",

    compositorFrame:
      "data-showroom-compositor-frame",

    compositorOwned:
      "data-showroom-compositor-owned",

    compositorWidth:
      "data-showroom-compositor-width",

    compositorHeight:
      "data-showroom-compositor-height",

    compositorDpr:
      "data-showroom-compositor-dpr"
  });

  const EVENTS = Object.freeze({
    controllerReady:
      "showroom:controller-ready",

    controllerFrameChanged:
      "showroom:frame-state-changed",

    controllerStateChanged:
      "showroom:state-changed",

    compositorReady:
      "showroom:compositor-ready",

    compositorFailed:
      "showroom:compositor-failed",

    compositorDisposed:
      "showroom:compositor-disposed",

    compositorFrame:
      "showroom:compositor-frame",

    compositorProjectionChanged:
      "showroom:compositor-projection-changed",

    compositorReceipt:
      "showroom:compositor-receipt"
  });

  const LAYERS = Object.freeze({
    REAR:
      "rear",

    FRONT:
      "front"
  });

  const CLASSIFICATIONS = Object.freeze({
    REAR:
      "rear",

    FRONT:
      "front"
  });

  const READINESS_RESULTS = Object.freeze({
    READY:
      "ready",

    PENDING:
      "pending",

    FAILED:
      "failed",

    SKIPPED:
      "skipped"
  });

  const DEFAULT_CAMERA = Object.freeze({
    eye:
      Object.freeze([
        0,
        0,
        8
      ]),

    target:
      Object.freeze([
        0,
        0,
        0
      ]),

    up:
      Object.freeze([
        0,
        1,
        0
      ]),

    fieldOfViewDegrees:
      42,

    near:
      0.1,

    far:
      100,

    classificationHysteresis:
      0.075
  });

  const state = {
    root: null,
    orbit: null,
    scene: null,
    field: null,
    compassLayer: null,
    compassVisualMount: null,
    semanticLayer: null,
    frontHost: null,
    receipt: null,

    controller: null,
    controllerFrame: null,
    controllerReady: false,

    rearCanvas: null,
    frontCanvas: null,

    rearCanvasCreated: false,
    frontCanvasCreated: false,

    nativeRearCanvasState: null,
    nativeFrontCanvasState: null,

    nativeDomState: {
      fieldStyle: null,
      compassLayerStyle: null,
      semanticLayerStyle: null,
      rearCanvasPlacement: null,
      frontCanvasPlacement: null
    },

    domRestored: true,

    camera: {
      eye:
        DEFAULT_CAMERA.eye.slice(),

      target:
        DEFAULT_CAMERA.target.slice(),

      up:
        DEFAULT_CAMERA.up.slice(),

      fieldOfViewDegrees:
        DEFAULT_CAMERA.fieldOfViewDegrees,

      near:
        DEFAULT_CAMERA.near,

      far:
        DEFAULT_CAMERA.far,

      classificationHysteresis:
        DEFAULT_CAMERA.classificationHysteresis
    },

    matrices: {
      view:
        identityMatrix4(),

      projection:
        identityMatrix4(),

      viewProjection:
        identityMatrix4()
    },

    viewport: {
      cssWidth: 0,
      cssHeight: 0,
      pixelWidth: 0,
      pixelHeight: 0,
      devicePixelRatio: 1,
      left: 0,
      top: 0
    },

    compassPlane: {
      worldPoint: [
        0,
        0,
        0
      ],

      viewDepth: -8,

      screenX: 0,
      screenY: 0,

      radius: 0
    },

    nodes:
      new Map(),

    renderers:
      new Map(),

    classifications:
      new Map(),

    projectionSnapshot:
      Object.freeze({
        frameId: 0,
        timestamp: 0,
        nodes: Object.freeze([]),
        rear: Object.freeze([]),
        front: Object.freeze([]),
        hitRegions: Object.freeze([])
      }),

    frameId: 0,
    renderRequested: false,
    pendingRenderReason: "",
    rafId: 0,

    resizeObserver: null,
    mutationObserver: null,

    listeners: [],

    initialized: false,
    initializing: false,
    disposed: false,
    readyPublished: false,
    readinessPending: true,

    counters: {
      renders: 0,
      resizePasses: 0,
      projectionPasses: 0,
      nodeRegistrations: 0,
      nodeRemovals: 0,
      rendererRegistrations: 0,
      rendererRemovals: 0,
      failures: 0
    }
  };

  function normalize(value) {
    return String(value || "").trim();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function isCanvas(value) {
    return value instanceof HTMLCanvasElement;
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

  function toFiniteNumber(
    value,
    fallback
  ) {
    const numeric =
      Number(value);

    return Number.isFinite(numeric)
      ? numeric
      : fallback;
  }

  function freezePlain(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return Object.freeze(
        value.map(freezePlain)
      );
    }

    const output = {};

    for (
      const [
        key,
        entry
      ]
      of Object.entries(value)
    ) {
      output[key] =
        freezePlain(entry);
    }

    return Object.freeze(output);
  }

  function dispatch(
    eventName,
    detail = {}
  ) {
    const payload =
      freezePlain({
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

  function publishReceipt(
    event,
    detail = {}
  ) {
    const payload =
      freezePlain({
        contract:
          CONTRACT,

        owner:
          OWNER,

        controllerContract:
          CONTROLLER_CONTRACT,

        event,

        timestamp:
          nowIso(),

        frameId:
          state.frameId,

        initialized:
          state.initialized,

        disposed:
          state.disposed,

        controllerReady:
          state.controllerReady,

        readinessPending:
          state.readinessPending,

        readyPublished:
          state.readyPublished,

        viewport: {
          ...state.viewport
        },

        registeredNodes:
          state.nodes.size,

        registeredRenderers:
          state.renderers.size,

        counters: {
          ...state.counters
        },

        ...detail
      });

    if (state.receipt) {
      const serialized =
        JSON.stringify(payload);

      state.receipt.value =
        serialized;

      state.receipt.textContent =
        serialized;
    }

    dispatch(
      EVENTS.compositorReceipt,
      payload
    );

    return payload;
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

  function removeListeners() {
    for (
      const remove
      of state.listeners.splice(0)
    ) {
      try {
        remove();
      } catch {
        /* Best-effort disposal. */
      }
    }
  }

  function identityMatrix4() {
    return new Float64Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  function subtractVector3(
    a,
    b
  ) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function dotVector3(
    a,
    b
  ) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function crossVector3(
    a,
    b
  ) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function lengthVector3(vector) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalizeVector3(
    vector,
    fallback = [
      0,
      0,
      1
    ]
  ) {
    const length =
      lengthVector3(vector);

    if (
      !Number.isFinite(length) ||
      length <= 1e-9
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
    const output =
      new Float64Array(16);

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
        output[
          column * 4 + row
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

    return output;
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
      normalizeVector3(
        subtractVector3(
          eye,
          target
        ),
        [
          0,
          0,
          1
        ]
      );

    let right =
      normalizeVector3(
        crossVector3(
          up,
          forward
        ),
        [
          1,
          0,
          0
        ]
      );

    if (
      lengthVector3(right) <=
      1e-9
    ) {
      right = [
        1,
        0,
        0
      ];
    }

    const correctedUp =
      normalizeVector3(
        crossVector3(
          forward,
          right
        ),
        [
          0,
          1,
          0
        ]
      );

    return new Float64Array([
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

      -dotVector3(
        right,
        eye
      ),

      -dotVector3(
        correctedUp,
        eye
      ),

      -dotVector3(
        forward,
        eye
      ),

      1
    ]);
  }

  function createPerspectiveMatrix(
    fieldOfViewRadians,
    aspect,
    near,
    far
  ) {
    const safeAspect =
      Math.max(
        1e-6,
        aspect
      );

    const f =
      1 /
      Math.tan(
        fieldOfViewRadians / 2
      );

    const inverseRange =
      1 /
      (near - far);

    return new Float64Array([
      f / safeAspect,
      0,
      0,
      0,

      0,
      f,
      0,
      0,

      0,
      0,
      (far + near) *
        inverseRange,
      -1,

      0,
      0,
      2 *
        far *
        near *
        inverseRange,
      0
    ]);
  }

  function matrixToArray(matrix) {
    return Array.from(matrix);
  }

  function captureStyleAttribute(element) {
    return element
      ? element.getAttribute(
          "style"
        )
      : null;
  }

  function restoreStyleAttribute(
    element,
    capturedStyle
  ) {
    if (!element) {
      return;
    }

    if (capturedStyle === null) {
      element.removeAttribute(
        "style"
      );
    } else {
      element.setAttribute(
        "style",
        capturedStyle
      );
    }
  }

  function capturePlacement(element) {
    if (!element) {
      return null;
    }

    return {
      parent:
        element.parentNode,

      nextSibling:
        element.nextSibling
    };
  }

  function restorePlacement(
    element,
    placement
  ) {
    if (
      !element ||
      !placement ||
      !placement.parent
    ) {
      return;
    }

    const reference =
      placement.nextSibling &&
      placement.nextSibling.parentNode ===
        placement.parent
        ? placement.nextSibling
        : null;

    placement.parent.insertBefore(
      element,
      reference
    );
  }

  function captureCanvasState(canvas) {
    if (!canvas) {
      return null;
    }

    return {
      width:
        canvas.width,

      height:
        canvas.height,

      className:
        canvas.className,

      style:
        canvas.getAttribute(
          "style"
        ),

      ariaHidden:
        canvas.getAttribute(
          "aria-hidden"
        ),

      layer:
        canvas.getAttribute(
          ATTRIBUTES.layer
        ),

      compositorOwned:
        canvas.getAttribute(
          ATTRIBUTES.compositorOwned
        ),

      compositorWidth:
        canvas.getAttribute(
          ATTRIBUTES.compositorWidth
        ),

      compositorHeight:
        canvas.getAttribute(
          ATTRIBUTES.compositorHeight
        ),

      compositorDpr:
        canvas.getAttribute(
          ATTRIBUTES.compositorDpr
        )
    };
  }

  function restoreNullableAttribute(
    element,
    name,
    value
  ) {
    if (!element) {
      return;
    }

    if (value === null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(
        name,
        value
      );
    }
  }

  function restoreCanvasState(
    canvas,
    captured
  ) {
    if (
      !canvas ||
      !captured
    ) {
      return;
    }

    canvas.width =
      captured.width;

    canvas.height =
      captured.height;

    canvas.className =
      captured.className;

    restoreNullableAttribute(
      canvas,
      "style",
      captured.style
    );

    restoreNullableAttribute(
      canvas,
      "aria-hidden",
      captured.ariaHidden
    );

    restoreNullableAttribute(
      canvas,
      ATTRIBUTES.layer,
      captured.layer
    );

    restoreNullableAttribute(
      canvas,
      ATTRIBUTES.compositorOwned,
      captured.compositorOwned
    );

    restoreNullableAttribute(
      canvas,
      ATTRIBUTES.compositorWidth,
      captured.compositorWidth
    );

    restoreNullableAttribute(
      canvas,
      ATTRIBUTES.compositorHeight,
      captured.compositorHeight
    );

    restoreNullableAttribute(
      canvas,
      ATTRIBUTES.compositorDpr,
      captured.compositorDpr
    );
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    state.orbit =
      document.querySelector(
        SELECTORS.orbit
      );

    state.scene =
      document.querySelector(
        SELECTORS.scene
      );

    state.field =
      document.querySelector(
        SELECTORS.field
      );

    state.compassLayer =
      document.querySelector(
        SELECTORS.compassLayer
      );

    state.compassVisualMount =
      document.querySelector(
        SELECTORS.compassVisualMount
      );

    state.semanticLayer =
      document.querySelector(
        SELECTORS.semanticLayer
      );

    state.frontHost =
      document.querySelector(
        SELECTORS.frontHost
      );

    state.receipt =
      document.querySelector(
        SELECTORS.receipt
      );
  }

  function validateDom() {
    const issues = [];

    if (!state.root) {
      issues.push(
        "Missing [data-showroom-root]."
      );
    }

    if (!state.orbit) {
      issues.push(
        "Missing #showroom-orbit."
      );
    }

    if (!state.scene) {
      issues.push(
        "Missing [data-showroom-orbit-scene]."
      );
    }

    if (!state.field) {
      issues.push(
        "Missing [data-showroom-orbit-field]."
      );
    }

    if (!state.compassLayer) {
      issues.push(
        "Missing [data-showroom-compass-layer]."
      );
    }

    if (!state.compassVisualMount) {
      issues.push(
        "Missing [data-showroom-compass-visual-mount]."
      );
    }

    if (!state.semanticLayer) {
      issues.push(
        "Missing [data-showroom-semantic-star-layer]."
      );
    }

    if (!state.frontHost) {
      issues.push(
        "Missing [data-showroom-front-host]."
      );
    }

    if (
      state.field &&
      state.compassLayer &&
      !state.field.contains(
        state.compassLayer
      )
    ) {
      issues.push(
        "Compass layer is not inside the orbit field."
      );
    }

    if (
      state.compassLayer &&
      state.compassVisualMount &&
      !state.compassLayer.contains(
        state.compassVisualMount
      )
    ) {
      issues.push(
        "Compass visual mount is not inside the Compass layer."
      );
    }

    if (
      state.field &&
      state.semanticLayer &&
      !state.field.contains(
        state.semanticLayer
      )
    ) {
      issues.push(
        "Semantic layer is not inside the orbit field."
      );
    }

    return issues;
  }

  function createCanvas(layer) {
    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.setAttribute(
      ATTRIBUTES.layer,
      layer
    );

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      ATTRIBUTES.compositorOwned,
      "true"
    );

    canvas.className =
      [
        "showroom-compositor-canvas",
        `showroom-compositor-canvas--${layer}`
      ].join(" ");

    canvas.style.position =
      "absolute";

    canvas.style.inset =
      "0";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.pointerEvents =
      "none";

    canvas.style.display =
      "block";

    canvas.style.zIndex =
      layer === LAYERS.REAR
        ? "1"
        : "3";

    return canvas;
  }

  function prepareExistingCanvas(
    canvas,
    layer
  ) {
    canvas.setAttribute(
      ATTRIBUTES.layer,
      layer
    );

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.style.position =
      "absolute";

    canvas.style.inset =
      "0";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.pointerEvents =
      "none";

    canvas.style.display =
      "block";

    canvas.style.zIndex =
      layer === LAYERS.REAR
        ? "1"
        : "3";
  }

  function ensureFieldPositioningContext() {
    if (!state.field) {
      return;
    }

    const computed =
      window.getComputedStyle(
        state.field
      );

    if (
      computed.position ===
      "static"
    ) {
      state.field.style.position =
        "relative";
    }
  }

  function ensureCanvases() {
    if (
      !state.field ||
      !state.compassLayer
    ) {
      throw new Error(
        "Compositor canvases cannot be established without the orbit field and Compass layer."
      );
    }

    state.nativeDomState.fieldStyle =
      captureStyleAttribute(
        state.field
      );

    state.nativeDomState.compassLayerStyle =
      captureStyleAttribute(
        state.compassLayer
      );

    state.nativeDomState.semanticLayerStyle =
      captureStyleAttribute(
        state.semanticLayer
      );

    state.nativeDomState.rearCanvasPlacement =
      null;

    state.nativeDomState.frontCanvasPlacement =
      null;

    state.domRestored =
      false;

    ensureFieldPositioningContext();

    const existingRear =
      state.field.querySelector(
        SELECTORS.rearCanvas
      );

    const existingFront =
      state.field.querySelector(
        SELECTORS.frontCanvas
      );

    if (
      existingRear &&
      !isCanvas(existingRear)
    ) {
      throw new Error(
        "The declared rear compositor layer is not a canvas."
      );
    }

    if (
      existingFront &&
      !isCanvas(existingFront)
    ) {
      throw new Error(
        "The declared front compositor layer is not a canvas."
      );
    }

    if (existingRear) {
      state.rearCanvas =
        existingRear;

      state.rearCanvasCreated =
        false;

      state.nativeRearCanvasState =
        captureCanvasState(
          existingRear
        );

      state.nativeDomState.rearCanvasPlacement =
        capturePlacement(
          existingRear
        );

      prepareExistingCanvas(
        existingRear,
        LAYERS.REAR
      );
    } else {
      state.rearCanvas =
        createCanvas(
          LAYERS.REAR
        );

      state.rearCanvasCreated =
        true;

      state.nativeRearCanvasState =
        null;
    }

    if (existingFront) {
      state.frontCanvas =
        existingFront;

      state.frontCanvasCreated =
        false;

      state.nativeFrontCanvasState =
        captureCanvasState(
          existingFront
        );

      state.nativeDomState.frontCanvasPlacement =
        capturePlacement(
          existingFront
        );

      prepareExistingCanvas(
        existingFront,
        LAYERS.FRONT
      );
    } else {
      state.frontCanvas =
        createCanvas(
          LAYERS.FRONT
        );

      state.frontCanvasCreated =
        true;

      state.nativeFrontCanvasState =
        null;
    }

    if (
      state.rearCanvas.parentNode !==
        state.field ||
      state.rearCanvas.nextSibling !==
        state.compassLayer
    ) {
      state.field.insertBefore(
        state.rearCanvas,
        state.compassLayer
      );
    }

    const desiredFrontReference =
      state.compassLayer.nextSibling;

    if (
      state.frontCanvas.parentNode !==
        state.field ||
      state.frontCanvas.previousSibling !==
        state.compassLayer
    ) {
      state.field.insertBefore(
        state.frontCanvas,
        desiredFrontReference
      );
    }

    state.compassLayer.style.zIndex =
      "2";

    state.semanticLayer.style.zIndex =
      "4";
  }

  function restoreOwnedDom() {
    if (state.domRestored) {
      return;
    }

    state.domRestored =
      true;

    if (state.rearCanvas) {
      if (state.rearCanvasCreated) {
        state.rearCanvas.remove();
      } else {
        restorePlacement(
          state.rearCanvas,
          state.nativeDomState
            .rearCanvasPlacement
        );

        restoreCanvasState(
          state.rearCanvas,
          state.nativeRearCanvasState
        );
      }
    }

    if (state.frontCanvas) {
      if (state.frontCanvasCreated) {
        state.frontCanvas.remove();
      } else {
        restorePlacement(
          state.frontCanvas,
          state.nativeDomState
            .frontCanvasPlacement
        );

        restoreCanvasState(
          state.frontCanvas,
          state.nativeFrontCanvasState
        );
      }
    }

    restoreStyleAttribute(
      state.field,
      state.nativeDomState.fieldStyle
    );

    restoreStyleAttribute(
      state.compassLayer,
      state.nativeDomState
        .compassLayerStyle
    );

    restoreStyleAttribute(
      state.semanticLayer,
      state.nativeDomState
        .semanticLayerStyle
    );

    state.rearCanvas = null;
    state.frontCanvas = null;

    state.rearCanvasCreated = false;
    state.frontCanvasCreated = false;

    state.nativeRearCanvasState = null;
    state.nativeFrontCanvasState = null;

    state.nativeDomState.fieldStyle = null;
    state.nativeDomState.compassLayerStyle = null;
    state.nativeDomState.semanticLayerStyle = null;
    state.nativeDomState.rearCanvasPlacement = null;
    state.nativeDomState.frontCanvasPlacement = null;
  }

  function isValidControllerFrame(frame) {
    return Boolean(
      frame &&
      typeof frame === "object" &&
      frame.contract ===
        CONTROLLER_CONTRACT &&
      typeof frame.controllerReady ===
        "boolean" &&
      typeof frame.disposed ===
        "boolean" &&
      typeof frame.durableState ===
        "string" &&
      typeof frame.transientState ===
        "string" &&
      typeof frame.pageState ===
        "string" &&
      typeof frame.presentationMode ===
        "string" &&
      typeof frame.enhancementState ===
        "string"
    );
  }

  function readControllerFrame() {
    const controller =
      window.SHOWROOM_CONTROLLER;

    if (!controller) {
      state.controller = null;
      state.controllerFrame = null;
      state.controllerReady = false;

      return {
        status:
          "unavailable",

        frame:
          null
      };
    }

    if (
      controller.contract !==
        CONTROLLER_CONTRACT ||
      typeof controller.getFrameState !==
        "function"
    ) {
      state.controller = null;
      state.controllerFrame = null;
      state.controllerReady = false;

      return {
        status:
          "invalid-controller",

        frame:
          null
      };
    }

    let frame;

    try {
      frame =
        controller.getFrameState();
    } catch (error) {
      state.controller = null;
      state.controllerFrame = null;
      state.controllerReady = false;

      return {
        status:
          "frame-error",

        frame:
          null,

        error
      };
    }

    if (!isValidControllerFrame(frame)) {
      state.controller = null;
      state.controllerFrame = null;
      state.controllerReady = false;

      return {
        status:
          "invalid-frame",

        frame:
          null
      };
    }

    if (
      frame.controllerReady !== true ||
      frame.disposed === true
    ) {
      state.controller = null;
      state.controllerFrame = null;
      state.controllerReady = false;

      return {
        status:
          "controller-not-ready",

        frame:
          null
      };
    }

    state.controller =
      controller;

    state.controllerFrame =
      frame;

    state.controllerReady =
      true;

    return {
      status:
        "ready",

      frame
    };
  }

  function measureViewport() {
    if (
      !state.field ||
      !state.rearCanvas ||
      !state.frontCanvas
    ) {
      return false;
    }

    const rect =
      state.field.getBoundingClientRect();

    const cssWidth =
      Math.max(
        1,
        rect.width
      );

    const cssHeight =
      Math.max(
        1,
        rect.height
      );

    const devicePixelRatio =
      clamp(
        toFiniteNumber(
          window.devicePixelRatio,
          1
        ),
        1,
        3
      );

    const pixelWidth =
      Math.max(
        1,
        Math.round(
          cssWidth *
          devicePixelRatio
        )
      );

    const pixelHeight =
      Math.max(
        1,
        Math.round(
          cssHeight *
          devicePixelRatio
        )
      );

    const changed =
      cssWidth !==
        state.viewport.cssWidth ||
      cssHeight !==
        state.viewport.cssHeight ||
      pixelWidth !==
        state.viewport.pixelWidth ||
      pixelHeight !==
        state.viewport.pixelHeight ||
      devicePixelRatio !==
        state.viewport.devicePixelRatio ||
      rect.left !==
        state.viewport.left ||
      rect.top !==
        state.viewport.top;

    state.viewport.cssWidth =
      cssWidth;

    state.viewport.cssHeight =
      cssHeight;

    state.viewport.pixelWidth =
      pixelWidth;

    state.viewport.pixelHeight =
      pixelHeight;

    state.viewport.devicePixelRatio =
      devicePixelRatio;

    state.viewport.left =
      rect.left;

    state.viewport.top =
      rect.top;

    for (
      const canvas
      of [
        state.rearCanvas,
        state.frontCanvas
      ]
    ) {
      if (
        canvas.width !==
        pixelWidth
      ) {
        canvas.width =
          pixelWidth;
      }

      if (
        canvas.height !==
        pixelHeight
      ) {
        canvas.height =
          pixelHeight;
      }

      canvas.setAttribute(
        ATTRIBUTES.compositorWidth,
        String(pixelWidth)
      );

      canvas.setAttribute(
        ATTRIBUTES.compositorHeight,
        String(pixelHeight)
      );

      canvas.setAttribute(
        ATTRIBUTES.compositorDpr,
        String(devicePixelRatio)
      );
    }

    if (changed) {
      state.counters.resizePasses +=
        1;
    }

    return changed;
  }

  function measureCompassPlane() {
    if (
      !state.compassVisualMount ||
      !state.field
    ) {
      return;
    }

    const fieldRect =
      state.field.getBoundingClientRect();

    const compassRect =
      state.compassVisualMount
        .getBoundingClientRect();

    state.compassPlane.screenX =
      compassRect.left -
      fieldRect.left +
      compassRect.width / 2;

    state.compassPlane.screenY =
      compassRect.top -
      fieldRect.top +
      compassRect.height / 2;

    state.compassPlane.radius =
      Math.max(
        compassRect.width,
        compassRect.height
      ) / 2;
  }

  function rebuildMatrices() {
    const aspect =
      state.viewport.cssWidth /
      Math.max(
        1,
        state.viewport.cssHeight
      );

    const view =
      createLookAtMatrix(
        state.camera.eye,
        state.camera.target,
        state.camera.up
      );

    const projection =
      createPerspectiveMatrix(
        state.camera
          .fieldOfViewDegrees *
          Math.PI /
          180,

        aspect,

        state.camera.near,
        state.camera.far
      );

    state.matrices.view =
      view;

    state.matrices.projection =
      projection;

    state.matrices.viewProjection =
      multiplyMatrix4(
        projection,
        view
      );

    const planeView =
      transformVector4(
        view,
        [
          state.compassPlane
            .worldPoint[0],

          state.compassPlane
            .worldPoint[1],

          state.compassPlane
            .worldPoint[2],

          1
        ]
      );

    state.compassPlane.viewDepth =
      planeView[2];
  }

  function normalizeWorldPosition(value) {
    if (
      Array.isArray(value) &&
      value.length >= 3
    ) {
      const x =
        Number(value[0]);

      const y =
        Number(value[1]);

      const z =
        Number(value[2]);

      if (
        Number.isFinite(x) &&
        Number.isFinite(y) &&
        Number.isFinite(z)
      ) {
        return [
          x,
          y,
          z
        ];
      }
    }

    if (
      value &&
      typeof value ===
        "object"
    ) {
      const x =
        Number(value.x);

      const y =
        Number(value.y);

      const z =
        Number(value.z);

      if (
        Number.isFinite(x) &&
        Number.isFinite(y) &&
        Number.isFinite(z)
      ) {
        return [
          x,
          y,
          z
        ];
      }
    }

    return null;
  }

  function worldToScreen(
    worldPosition
  ) {
    const world =
      normalizeWorldPosition(
        worldPosition
      );

    if (!world) {
      return null;
    }

    const view =
      transformVector4(
        state.matrices.view,
        [
          world[0],
          world[1],
          world[2],
          1
        ]
      );

    const clip =
      transformVector4(
        state.matrices.projection,
        view
      );

    if (
      !Number.isFinite(
        clip[3]
      ) ||
      Math.abs(
        clip[3]
      ) <= 1e-9
    ) {
      return null;
    }

    const inverseW =
      1 /
      clip[3];

    const ndcX =
      clip[0] *
      inverseW;

    const ndcY =
      clip[1] *
      inverseW;

    const ndcZ =
      clip[2] *
      inverseW;

    const viewportCenterX =
      state.viewport.cssWidth /
      2;

    const viewportCenterY =
      state.viewport.cssHeight /
      2;

    const anchorOffsetX =
      state.compassPlane.screenX -
      viewportCenterX;

    const anchorOffsetY =
      state.compassPlane.screenY -
      viewportCenterY;

    const screenX =
      (
        ndcX * 0.5 +
        0.5
      ) *
      state.viewport.cssWidth +
      anchorOffsetX;

    const screenY =
      (
        -ndcY * 0.5 +
        0.5
      ) *
      state.viewport.cssHeight +
      anchorOffsetY;

    const visible =
      clip[3] > 0 &&
      ndcX >= -1.25 &&
      ndcX <= 1.25 &&
      ndcY >= -1.25 &&
      ndcY <= 1.25 &&
      ndcZ >= -1.25 &&
      ndcZ <= 1.25;

    return freezePlain({
      world: {
        x:
          world[0],

        y:
          world[1],

        z:
          world[2]
      },

      view: {
        x:
          view[0],

        y:
          view[1],

        z:
          view[2]
      },

      clip: {
        x:
          clip[0],

        y:
          clip[1],

        z:
          clip[2],

        w:
          clip[3]
      },

      ndc: {
        x:
          ndcX,

        y:
          ndcY,

        z:
          ndcZ
      },

      screen: {
        x:
          screenX,

        y:
          screenY
      },

      visible
    });
  }

  function classifyDepth(
    id,
    viewDepth
  ) {
    const delta =
      viewDepth -
      state.compassPlane.viewDepth;

    const previous =
      state.classifications.get(id);

    const hysteresis =
      state.camera
        .classificationHysteresis;

    let classification;

    if (
      previous ===
      CLASSIFICATIONS.FRONT
    ) {
      classification =
        delta < -hysteresis
          ? CLASSIFICATIONS.REAR
          : CLASSIFICATIONS.FRONT;
    } else if (
      previous ===
      CLASSIFICATIONS.REAR
    ) {
      classification =
        delta > hysteresis
          ? CLASSIFICATIONS.FRONT
          : CLASSIFICATIONS.REAR;
    } else {
      classification =
        delta >= 0
          ? CLASSIFICATIONS.FRONT
          : CLASSIFICATIONS.REAR;
    }

    state.classifications.set(
      id,
      classification
    );

    return {
      classification,
      delta
    };
  }

  function classifyWorldPoint(
    worldPosition,
    previousClassification = null
  ) {
    const projection =
      worldToScreen(
        worldPosition
      );

    if (!projection) {
      return null;
    }

    const delta =
      projection.view.z -
      state.compassPlane.viewDepth;

    const hysteresis =
      state.camera
        .classificationHysteresis;

    let classification;

    if (
      previousClassification ===
      CLASSIFICATIONS.FRONT
    ) {
      classification =
        delta < -hysteresis
          ? CLASSIFICATIONS.REAR
          : CLASSIFICATIONS.FRONT;
    } else if (
      previousClassification ===
      CLASSIFICATIONS.REAR
    ) {
      classification =
        delta > hysteresis
          ? CLASSIFICATIONS.FRONT
          : CLASSIFICATIONS.REAR;
    } else {
      classification =
        delta >= 0
          ? CLASSIFICATIONS.FRONT
          : CLASSIFICATIONS.REAR;
    }

    return freezePlain({
      classification,
      delta,
      projection
    });
  }

  function resolveNodePosition(record) {
    try {
      if (
        typeof record.getWorldPosition ===
          "function"
      ) {
        return normalizeWorldPosition(
          record.getWorldPosition()
        );
      }

      return normalizeWorldPosition(
        record.worldPosition
      );
    } catch {
      return null;
    }
  }

  function resolveNodeRadius(record) {
    try {
      if (
        typeof record.getHitRadius ===
          "function"
      ) {
        return Math.max(
          0,
          toFiniteNumber(
            record.getHitRadius(),
            0
          )
        );
      }

      return Math.max(
        0,
        toFiniteNumber(
          record.hitRadius,
          0
        )
      );
    } catch {
      return 0;
    }
  }

  function resolveNodeVisible(record) {
    try {
      if (
        typeof record.isVisible ===
          "function"
      ) {
        return (
          record.isVisible() !==
          false
        );
      }

      return record.visible !== false;
    } catch {
      return false;
    }
  }

  function buildProjectionSnapshot() {
    const nodes = [];
    const rear = [];
    const front = [];
    const hitRegions = [];

    for (
      const [
        id,
        record
      ]
      of state.nodes
    ) {
      if (!resolveNodeVisible(record)) {
        continue;
      }

      const worldPosition =
        resolveNodePosition(record);

      if (!worldPosition) {
        continue;
      }

      const projection =
        worldToScreen(
          worldPosition
        );

      if (!projection) {
        continue;
      }

      const depth =
        classifyDepth(
          id,
          projection.view.z
        );

      const hitRadius =
        resolveNodeRadius(record);

      const snapshot =
        freezePlain({
          id,

          semanticObjectId:
            record.semanticObjectId ||
            null,

          cardinalId:
            record.cardinalId ||
            null,

          childId:
            record.childId ||
            null,

          clusterId:
            record.clusterId ||
            null,

          classification:
            depth.classification,

          depthDelta:
            depth.delta,

          world:
            projection.world,

          view:
            projection.view,

          ndc:
            projection.ndc,

          screen:
            projection.screen,

          visible:
            projection.visible,

          hitRadius,

          metadata:
            record.metadata
              ? {
                  ...record.metadata
                }
              : null
        });

      nodes.push(snapshot);

      if (
        depth.classification ===
        CLASSIFICATIONS.FRONT
      ) {
        front.push(snapshot);
      } else {
        rear.push(snapshot);
      }

      if (
        projection.visible &&
        hitRadius > 0
      ) {
        hitRegions.push(
          freezePlain({
            id,

            semanticObjectId:
              record.semanticObjectId ||
              null,

            classification:
              depth.classification,

            x:
              projection.screen.x,

            y:
              projection.screen.y,

            radius:
              hitRadius,

            viewDepth:
              projection.view.z
          })
        );
      }
    }

    rear.sort(
      (
        first,
        second
      ) =>
        first.view.z -
        second.view.z
    );

    front.sort(
      (
        first,
        second
      ) =>
        first.view.z -
        second.view.z
    );

    hitRegions.sort(
      (
        first,
        second
      ) =>
        second.viewDepth -
        first.viewDepth
    );

    state.counters.projectionPasses +=
      1;

    return freezePlain({
      frameId:
        state.frameId,

      timestamp:
        performance.now(),

      nodes,

      rear,

      front,

      hitRegions
    });
  }

  function getRenderFrame() {
    return freezePlain({
      contract:
        CONTRACT,

      controllerContract:
        CONTROLLER_CONTRACT,

      frameId:
        state.frameId,

      controllerFrame:
        state.controllerFrame,

      viewport: {
        ...state.viewport
      },

      camera: {
        eye:
          state.camera.eye.slice(),

        target:
          state.camera.target.slice(),

        up:
          state.camera.up.slice(),

        fieldOfViewDegrees:
          state.camera
            .fieldOfViewDegrees,

        near:
          state.camera.near,

        far:
          state.camera.far,

        classificationHysteresis:
          state.camera
            .classificationHysteresis
      },

      matrices: {
        view:
          matrixToArray(
            state.matrices.view
          ),

        projection:
          matrixToArray(
            state.matrices.projection
          ),

        viewProjection:
          matrixToArray(
            state.matrices
              .viewProjection
          )
      },

      compassPlane: {
        worldPoint:
          state.compassPlane
            .worldPoint
            .slice(),

        viewDepth:
          state.compassPlane
            .viewDepth,

        screenX:
          state.compassPlane
            .screenX,

        screenY:
          state.compassPlane
            .screenY,

        radius:
          state.compassPlane
            .radius
      },

      projection:
        state.projectionSnapshot
    });
  }

  function invokeRenderer(
    renderer,
    methodName,
    payload
  ) {
    const method =
      renderer[methodName];

    if (
      typeof method !==
      "function"
    ) {
      return;
    }

    method(payload);
  }

  function renderRegisteredLayers(
    renderFrame
  ) {
    const basePayload = {
      contract:
        CONTRACT,

      frame:
        renderFrame,

      rearCanvas:
        state.rearCanvas,

      frontCanvas:
        state.frontCanvas,

      rearNodes:
        state.projectionSnapshot.rear,

      frontNodes:
        state.projectionSnapshot.front,

      allNodes:
        state.projectionSnapshot.nodes,

      hitRegions:
        state.projectionSnapshot
          .hitRegions
    };

    for (
      const renderer
      of state.renderers.values()
    ) {
      try {
        invokeRenderer(
          renderer,
          "beginFrame",
          basePayload
        );

        invokeRenderer(
          renderer,
          "renderRear",
          {
            ...basePayload,

            canvas:
              state.rearCanvas,

            nodes:
              state.projectionSnapshot
                .rear,

            layer:
              LAYERS.REAR
          }
        );

        invokeRenderer(
          renderer,
          "renderFront",
          {
            ...basePayload,

            canvas:
              state.frontCanvas,

            nodes:
              state.projectionSnapshot
                .front,

            layer:
              LAYERS.FRONT
          }
        );

        invokeRenderer(
          renderer,
          "endFrame",
          basePayload
        );
      } catch (error) {
        state.counters.failures +=
          1;

        publishReceipt(
          "renderer-frame-failed",
          {
            rendererId:
              renderer.id,

            error: {
              name:
                error instanceof Error
                  ? error.name
                  : "Error",

              message:
                error instanceof Error
                  ? error.message
                  : String(error)
            }
          }
        );
      }
    }
  }

  function failRuntime(
    error,
    reason
  ) {
    if (state.disposed) {
      return;
    }

    state.counters.failures +=
      1;

    cancelScheduledRender();

    state.controllerReady =
      false;

    state.readinessPending =
      false;

    state.readyPublished =
      false;

    setRootState(
      false,
      "failed"
    );

    const errorPayload = {
      name:
        error instanceof Error
          ? error.name
          : "Error",

      message:
        error instanceof Error
          ? error.message
          : String(error)
    };

    publishReceipt(
      "runtime-failed",
      {
        reason,

        error:
          errorPayload
      }
    );

    dispatch(
      EVENTS.compositorFailed,
      {
        reason,

        error:
          errorPayload
      }
    );
  }

  function performRender() {
    state.renderRequested =
      false;

    state.rafId =
      0;

    if (
      state.disposed ||
      !state.initialized ||
      !state.readyPublished ||
      !state.controllerReady ||
      !state.controllerFrame
    ) {
      return false;
    }

    const controllerResult =
      readControllerFrame();

    if (
      controllerResult.status !==
        "ready"
    ) {
      failRuntime(
        new Error(
          `Authoritative render blocked: ${controllerResult.status}.`
        ),
        "render-controller-validation"
      );

      return false;
    }

    measureViewport();
    measureCompassPlane();
    rebuildMatrices();

    state.frameId += 1;

    state.projectionSnapshot =
      buildProjectionSnapshot();

    const renderFrame =
      getRenderFrame();

    renderRegisteredLayers(
      renderFrame
    );

    state.counters.renders +=
      1;

    if (state.root) {
      state.root.setAttribute(
        ATTRIBUTES.compositorFrame,
        String(
          state.frameId
        )
      );
    }

    dispatch(
      EVENTS.compositorFrame,
      {
        frame:
          renderFrame
      }
    );

    dispatch(
      EVENTS.compositorProjectionChanged,
      {
        frameId:
          state.frameId,

        projection:
          state.projectionSnapshot
      }
    );

    return true;
  }

  function requestRender(
    reason = "requested"
  ) {
    if (
      state.disposed ||
      !state.initialized
    ) {
      return false;
    }

    if (!state.readyPublished) {
      state.pendingRenderReason =
        reason;

      return false;
    }

    if (state.renderRequested) {
      return true;
    }

    state.renderRequested =
      true;

    state.rafId =
      requestAnimationFrame(
        performRender
      );

    publishReceipt(
      "render-requested",
      {
        reason
      }
    );

    return true;
  }

  function cancelScheduledRender() {
    if (state.rafId) {
      cancelAnimationFrame(
        state.rafId
      );
    }

    state.rafId = 0;
    state.renderRequested = false;
  }

  function registerNode(definition) {
    if (
      state.disposed ||
      !definition ||
      typeof definition !==
        "object"
    ) {
      return false;
    }

    const id =
      normalize(
        definition.id
      );

    if (!id) {
      throw new TypeError(
        "A compositor node requires a stable id."
      );
    }

    if (
      typeof definition.getWorldPosition !==
        "function" &&
      !normalizeWorldPosition(
        definition.worldPosition
      )
    ) {
      throw new TypeError(
        `Compositor node "${id}" requires getWorldPosition() or a valid worldPosition.`
      );
    }

    const record = {
      id,

      semanticObjectId:
        normalize(
          definition.semanticObjectId
        ),

      cardinalId:
        normalize(
          definition.cardinalId
        ),

      childId:
        normalize(
          definition.childId
        ),

      clusterId:
        normalize(
          definition.clusterId
        ),

      semanticElement:
        isElement(
          definition.semanticElement
        )
          ? definition.semanticElement
          : null,

      getWorldPosition:
        typeof definition.getWorldPosition ===
          "function"
          ? definition.getWorldPosition
          : null,

      worldPosition:
        normalizeWorldPosition(
          definition.worldPosition
        ),

      getHitRadius:
        typeof definition.getHitRadius ===
          "function"
          ? definition.getHitRadius
          : null,

      hitRadius:
        Math.max(
          0,
          toFiniteNumber(
            definition.hitRadius,
            0
          )
        ),

      isVisible:
        typeof definition.isVisible ===
          "function"
          ? definition.isVisible
          : null,

      visible:
        definition.visible !== false,

      metadata:
        definition.metadata &&
        typeof definition.metadata ===
          "object"
          ? {
              ...definition.metadata
            }
          : null
    };

    const replacing =
      state.nodes.has(id);

    state.nodes.set(
      id,
      record
    );

    if (!replacing) {
      state.counters.nodeRegistrations +=
        1;
    }

    requestRender(
      replacing
        ? "node-replaced"
        : "node-registered"
    );

    return Object.freeze({
      id,

      unregister() {
        return unregisterNode(id);
      },

      requestRender
    });
  }

  function unregisterNode(id) {
    const normalizedId =
      normalize(id);

    if (
      !normalizedId ||
      !state.nodes.has(
        normalizedId
      )
    ) {
      return false;
    }

    state.nodes.delete(
      normalizedId
    );

    state.classifications.delete(
      normalizedId
    );

    state.counters.nodeRemovals +=
      1;

    requestRender(
      "node-unregistered"
    );

    return true;
  }

  function registerRenderer(definition) {
    if (
      state.disposed ||
      !definition ||
      typeof definition !==
        "object"
    ) {
      return false;
    }

    const id =
      normalize(
        definition.id
      );

    if (!id) {
      throw new TypeError(
        "A compositor renderer requires a stable id."
      );
    }

    if (
      typeof definition.renderRear !==
        "function" &&
      typeof definition.renderFront !==
        "function"
    ) {
      throw new TypeError(
        `Compositor renderer "${id}" must implement renderRear() or renderFront().`
      );
    }

    const renderer = {
      id,

      beginFrame:
        typeof definition.beginFrame ===
          "function"
          ? definition.beginFrame
          : null,

      renderRear:
        typeof definition.renderRear ===
          "function"
          ? definition.renderRear
          : null,

      renderFront:
        typeof definition.renderFront ===
          "function"
          ? definition.renderFront
          : null,

      endFrame:
        typeof definition.endFrame ===
          "function"
          ? definition.endFrame
          : null,

      dispose:
        typeof definition.dispose ===
          "function"
          ? definition.dispose
          : null
    };

    const replacing =
      state.renderers.get(id);

    if (
      replacing &&
      typeof replacing.dispose ===
        "function"
    ) {
      try {
        replacing.dispose({
          reason:
            "renderer-replaced",

          rearCanvas:
            state.rearCanvas,

          frontCanvas:
            state.frontCanvas
        });
      } catch {
        /* Replacement remains authoritative. */
      }
    }

    state.renderers.set(
      id,
      renderer
    );

    if (!replacing) {
      state.counters.rendererRegistrations +=
        1;
    }

    requestRender(
      replacing
        ? "renderer-replaced"
        : "renderer-registered"
    );

    return Object.freeze({
      id,

      rearCanvas:
        state.rearCanvas,

      frontCanvas:
        state.frontCanvas,

      unregister() {
        return unregisterRenderer(id);
      },

      requestRender
    });
  }

  function unregisterRenderer(id) {
    const normalizedId =
      normalize(id);

    const renderer =
      state.renderers.get(
        normalizedId
      );

    if (!renderer) {
      return false;
    }

    state.renderers.delete(
      normalizedId
    );

    if (
      typeof renderer.dispose ===
        "function"
    ) {
      try {
        renderer.dispose({
          reason:
            "renderer-unregistered",

          rearCanvas:
            state.rearCanvas,

          frontCanvas:
            state.frontCanvas
        });
      } catch {
        /* Removal remains authoritative. */
      }
    }

    state.counters.rendererRemovals +=
      1;

    requestRender(
      "renderer-unregistered"
    );

    return true;
  }

  function setCamera(update = {}) {
    if (
      state.disposed ||
      !update ||
      typeof update !==
        "object"
    ) {
      return false;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        update,
        "eye"
      )
    ) {
      const eye =
        normalizeWorldPosition(
          update.eye
        );

      if (!eye) {
        throw new TypeError(
          "Camera eye must contain three finite coordinates."
        );
      }

      state.camera.eye =
        eye;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        update,
        "target"
      )
    ) {
      const target =
        normalizeWorldPosition(
          update.target
        );

      if (!target) {
        throw new TypeError(
          "Camera target must contain three finite coordinates."
        );
      }

      state.camera.target =
        target;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        update,
        "up"
      )
    ) {
      const up =
        normalizeWorldPosition(
          update.up
        );

      if (!up) {
        throw new TypeError(
          "Camera up must contain three finite coordinates."
        );
      }

      state.camera.up =
        normalizeVector3(
          up,
          [
            0,
            1,
            0
          ]
        );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        update,
        "fieldOfViewDegrees"
      )
    ) {
      state.camera.fieldOfViewDegrees =
        clamp(
          toFiniteNumber(
            update.fieldOfViewDegrees,
            state.camera
              .fieldOfViewDegrees
          ),
          10,
          100
        );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        update,
        "near"
      )
    ) {
      state.camera.near =
        clamp(
          toFiniteNumber(
            update.near,
            state.camera.near
          ),
          0.001,
          10
        );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        update,
        "far"
      )
    ) {
      state.camera.far =
        clamp(
          toFiniteNumber(
            update.far,
            state.camera.far
          ),
          state.camera.near +
            0.001,
          10000
        );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        update,
        "classificationHysteresis"
      )
    ) {
      state.camera.classificationHysteresis =
        clamp(
          toFiniteNumber(
            update.classificationHysteresis,
            state.camera
              .classificationHysteresis
          ),
          0,
          2
        );
    }

    rebuildMatrices();

    requestRender(
      "camera-updated"
    );

    return getCamera();
  }

  function setOrbitCamera(update = {}) {
    const target =
      normalizeWorldPosition(
        update.target
      ) ||
      state.camera.target.slice();

    const offset =
      subtractVector3(
        state.camera.eye,
        state.camera.target
      );

    const currentDistance =
      Math.max(
        0.001,
        lengthVector3(offset)
      );

    const currentYaw =
      Math.atan2(
        offset[0],
        offset[2]
      );

    const currentPitch =
      Math.asin(
        clamp(
          offset[1] /
          currentDistance,
          -1,
          1
        )
      );

    const distance =
      clamp(
        toFiniteNumber(
          update.distance,
          currentDistance
        ),
        1,
        40
      );

    const yaw =
      toFiniteNumber(
        update.yaw,
        currentYaw
      );

    const pitch =
      clamp(
        toFiniteNumber(
          update.pitch,
          currentPitch
        ),
        -Math.PI * 0.48,
        Math.PI * 0.48
      );

    const horizontal =
      Math.cos(pitch) *
      distance;

    const eye = [
      target[0] +
        Math.sin(yaw) *
        horizontal,

      target[1] +
        Math.sin(pitch) *
        distance,

      target[2] +
        Math.cos(yaw) *
        horizontal
    ];

    return setCamera({
      eye,
      target
    });
  }

  function getCamera() {
    return freezePlain({
      eye:
        state.camera.eye.slice(),

      target:
        state.camera.target.slice(),

      up:
        state.camera.up.slice(),

      fieldOfViewDegrees:
        state.camera
          .fieldOfViewDegrees,

      near:
        state.camera.near,

      far:
        state.camera.far,

      classificationHysteresis:
        state.camera
          .classificationHysteresis
    });
  }

  function setCompassPlaneWorldPoint(
    worldPoint
  ) {
    const normalized =
      normalizeWorldPosition(
        worldPoint
      );

    if (!normalized) {
      throw new TypeError(
        "Compass plane world point must contain three finite coordinates."
      );
    }

    state.compassPlane.worldPoint =
      normalized;

    rebuildMatrices();

    requestRender(
      "compass-plane-updated"
    );

    return freezePlain({
      worldPoint:
        normalized.slice()
    });
  }

  function hitTest(
    clientX,
    clientY,
    options = {}
  ) {
    const x =
      Number(clientX);

    const y =
      Number(clientY);

    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y)
    ) {
      return null;
    }

    const fieldX =
      x -
      state.viewport.left;

    const fieldY =
      y -
      state.viewport.top;

    const requestedClassification =
      normalize(
        options.classification
      );

    const candidates =
      state.projectionSnapshot
        .hitRegions;

    let best = null;
    let bestDistance =
      Infinity;

    for (
      const region
      of candidates
    ) {
      if (
        requestedClassification &&
        region.classification !==
          requestedClassification
      ) {
        continue;
      }

      const distance =
        Math.hypot(
          fieldX -
            region.x,

          fieldY -
            region.y
        );

      if (
        distance <=
          region.radius &&
        distance <
          bestDistance
      ) {
        best =
          region;

        bestDistance =
          distance;
      }
    }

    if (!best) {
      return null;
    }

    return freezePlain({
      ...best,

      distance:
        bestDistance,

      fieldX,
      fieldY,

      clientX:
        x,

      clientY:
        y
    });
  }

  function getCanvases() {
    return Object.freeze({
      rear:
        state.rearCanvas,

      front:
        state.frontCanvas
    });
  }

  function getProjectionSnapshot() {
    return state.projectionSnapshot;
  }

  function getFrameState() {
    return getRenderFrame();
  }

  function getState() {
    return freezePlain({
      contract:
        CONTRACT,

      owner:
        OWNER,

      controllerContract:
        CONTROLLER_CONTRACT,

      initialized:
        state.initialized,

      initializing:
        state.initializing,

      disposed:
        state.disposed,

      readyPublished:
        state.readyPublished,

      readinessPending:
        state.readinessPending,

      controllerReady:
        state.controllerReady,

      pendingRenderReason:
        state.pendingRenderReason ||
        null,

      controllerAvailable:
        Boolean(
          state.controller
        ),

      controllerFrame:
        state.controllerFrame,

      ownership: {
        registeredRendererLifecycleOwned:
          true,

        compassRendererLifecycleOwned:
          false,

        compassNavigationOwned:
          false,

        semanticNavigationOwned:
          false
      },

      dom: {
        root:
          Boolean(state.root),

        orbit:
          Boolean(state.orbit),

        scene:
          Boolean(state.scene),

        field:
          Boolean(state.field),

        compassLayer:
          Boolean(
            state.compassLayer
          ),

        compassVisualMount:
          Boolean(
            state.compassVisualMount
          ),

        semanticLayer:
          Boolean(
            state.semanticLayer
          ),

        frontHost:
          Boolean(
            state.frontHost
          ),

        rearCanvas:
          Boolean(
            state.rearCanvas
          ),

        frontCanvas:
          Boolean(
            state.frontCanvas
          ),

        rearCanvasCreated:
          state.rearCanvasCreated,

        frontCanvasCreated:
          state.frontCanvasCreated,

        domRestored:
          state.domRestored
      },

      camera:
        getCamera(),

      viewport: {
        ...state.viewport
      },

      compassPlane: {
        worldPoint:
          state.compassPlane
            .worldPoint
            .slice(),

        viewDepth:
          state.compassPlane
            .viewDepth,

        screenX:
          state.compassPlane
            .screenX,

        screenY:
          state.compassPlane
            .screenY,

        radius:
          state.compassPlane
            .radius
      },

      registeredNodeIds:
        Array.from(
          state.nodes.keys()
        ),

      registeredRendererIds:
        Array.from(
          state.renderers.keys()
        ),

      projection:
        state.projectionSnapshot,

      counters: {
        ...state.counters
      }
    });
  }

  function initializeResizeObservation() {
    if (
      typeof ResizeObserver ===
        "function"
    ) {
      state.resizeObserver =
        new ResizeObserver(
          () => {
            requestRender(
              "resize-observer"
            );
          }
        );

      state.resizeObserver.observe(
        state.field
      );

      state.resizeObserver.observe(
        state.compassVisualMount
      );
    } else {
      addListener(
        window,
        "resize",
        () => {
          requestRender(
            "window-resize"
          );
        },
        {
          passive:
            true
        }
      );
    }
  }

  function initializeMutationObservation() {
    if (
      typeof MutationObserver !==
        "function" ||
      !state.compassLayer ||
      !state.compassVisualMount
    ) {
      return;
    }

    state.mutationObserver =
      new MutationObserver(
        () => {
          requestRender(
            "compass-layout-mutation"
          );
        }
      );

    state.mutationObserver.observe(
      state.compassLayer,
      {
        childList:
          true,

        subtree:
          true
      }
    );

    state.mutationObserver.observe(
      state.compassVisualMount,
      {
        attributes:
          true,

        attributeFilter: [
          "class",
          "style",
          "hidden"
        ]
      }
    );
  }

  function disconnectObservers() {
    if (state.resizeObserver) {
      try {
        state.resizeObserver.disconnect();
      } catch {
        /* Best-effort disposal. */
      }
    }

    if (state.mutationObserver) {
      try {
        state.mutationObserver.disconnect();
      } catch {
        /* Best-effort disposal. */
      }
    }

    state.resizeObserver = null;
    state.mutationObserver = null;
  }

  function completeReadiness(
    reason = "controller-ready"
  ) {
    if (
      state.disposed ||
      !state.initialized ||
      state.readyPublished
    ) {
      return READINESS_RESULTS.SKIPPED;
    }

    const controllerResult =
      readControllerFrame();

    if (
      controllerResult.status ===
        "unavailable"
    ) {
      state.readinessPending =
        true;

      setRootState(
        false,
        "pending-controller"
      );

      return READINESS_RESULTS.PENDING;
    }

    if (
      controllerResult.status !==
        "ready"
    ) {
      failRuntime(
        new Error(
          `Controller readiness failed: ${controllerResult.status}.`
        ),
        "controller-readiness"
      );

      return READINESS_RESULTS.FAILED;
    }

    const readinessReason =
      state.pendingRenderReason ||
      reason;

    state.readinessPending =
      false;

    state.readyPublished =
      true;

    state.pendingRenderReason =
      "";

    measureViewport();
    measureCompassPlane();
    rebuildMatrices();

    setRootState(
      true,
      "ready"
    );

    const initialRenderSucceeded =
      performRender();

    if (
      !initialRenderSucceeded ||
      !state.readyPublished ||
      !state.controllerReady ||
      !state.controllerFrame
    ) {
      return READINESS_RESULTS.FAILED;
    }

    publishReceipt(
      "ready",
      {
        reason:
          readinessReason,

        domContract:
          "satisfied",

        canvasModel:
          "compositor-created-or-reused",

        rearCanvasCreated:
          state.rearCanvasCreated,

        frontCanvasCreated:
          state.frontCanvasCreated,

        compassPlaneOwned:
          false,

        compassPlaneInspected:
          true,

        semanticNavigationOwned:
          false,

        registeredRendererLifecycleOwned:
          true,

        compassRendererLifecycleOwned:
          false
      }
    );

    dispatch(
      EVENTS.compositorReady,
      {
        reason:
          readinessReason,

        frame:
          getRenderFrame(),

        canvases: {
          rear:
            LAYERS.REAR,

          front:
            LAYERS.FRONT
        },

        registeredRendererLifecycleOwned:
          true,

        compassRendererLifecycleOwned:
          false,

        api: [
          "getState",
          "getFrameState",
          "getProjectionSnapshot",
          "getCanvases",
          "getCamera",
          "setCamera",
          "setOrbitCamera",
          "setCompassPlaneWorldPoint",
          "worldToScreen",
          "classifyWorldPoint",
          "hitTest",
          "registerNode",
          "unregisterNode",
          "registerRenderer",
          "unregisterRenderer",
          "requestRender",
          "dispose"
        ]
      }
    );

    return READINESS_RESULTS.READY;
  }

  function handleControllerFrame(event) {
    if (
      state.disposed ||
      !state.initialized
    ) {
      return;
    }

    const frame =
      event &&
      event.detail
        ? event.detail.frame
        : null;

    if (
      frame &&
      isValidControllerFrame(frame) &&
      frame.controllerReady === true &&
      frame.disposed === false
    ) {
      state.controllerFrame =
        frame;

      state.controllerReady =
        true;
    } else {
      const controllerResult =
        readControllerFrame();

      if (
        controllerResult.status !==
          "ready"
      ) {
        failRuntime(
          new Error(
            `Invalid controller frame: ${controllerResult.status}.`
          ),
          "controller-frame"
        );

        return;
      }
    }

    if (!state.readyPublished) {
      completeReadiness(
        "controller-frame"
      );

      return;
    }

    requestRender(
      "controller-frame"
    );
  }

  function initializeControllerBinding() {
    addListener(
      window,
      EVENTS.controllerReady,
      () => {
        completeReadiness(
          "controller-ready-event"
        );
      }
    );

    addListener(
      window,
      EVENTS.controllerFrameChanged,
      handleControllerFrame
    );

    addListener(
      window,
      EVENTS.controllerStateChanged,
      handleControllerFrame
    );

    const controllerResult =
      readControllerFrame();

    if (
      controllerResult.status ===
        "unavailable"
    ) {
      state.readinessPending =
        true;

      setRootState(
        false,
        "pending-controller"
      );

      return;
    }

    if (
      controllerResult.status !==
        "ready"
    ) {
      throw new Error(
        `Controller binding failed: ${controllerResult.status}.`
      );
    }
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        controllerContract:
          CONTROLLER_CONTRACT,

        getState,

        getFrameState,

        getProjectionSnapshot,

        getCanvases,

        getCamera,

        setCamera,

        setOrbitCamera,

        setCompassPlaneWorldPoint,

        worldToScreen,

        classifyWorldPoint,

        hitTest,

        registerNode,

        unregisterNode,

        registerRenderer,

        unregisterRenderer,

        requestRender,

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

  function removeApi() {
    try {
      delete window.SHOWROOM_COMPOSITOR;
    } catch {
      /* Best-effort disposal. */
    }
  }

  function setRootState(
    ready,
    value
  ) {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      ATTRIBUTES.compositorReady,
      ready
        ? "true"
        : "false"
    );

    state.root.setAttribute(
      ATTRIBUTES.compositorState,
      value
    );
  }

  function disposeRenderers(reason) {
    for (
      const renderer
      of state.renderers.values()
    ) {
      if (
        typeof renderer.dispose ===
          "function"
      ) {
        try {
          renderer.dispose({
            reason,

            rearCanvas:
              state.rearCanvas,

            frontCanvas:
              state.frontCanvas
          });
        } catch {
          /* Disposal continues. */
        }
      }
    }

    state.renderers.clear();
  }

  function rollbackInitialization(error) {
    const rearCanvasCreated =
      state.rearCanvasCreated;

    const frontCanvasCreated =
      state.frontCanvasCreated;

    const rearCanvasReused =
      Boolean(
        state.rearCanvas &&
        !state.rearCanvasCreated
      );

    const frontCanvasReused =
      Boolean(
        state.frontCanvas &&
        !state.frontCanvasCreated
      );

    cancelScheduledRender();
    disconnectObservers();
    removeListeners();

    disposeRenderers(
      "initialization-rollback"
    );

    state.nodes.clear();
    state.classifications.clear();

    removeApi();
    restoreOwnedDom();

    setRootState(
      false,
      "failed"
    );

    state.controller = null;
    state.controllerFrame = null;
    state.controllerReady = false;

    state.initialized = false;
    state.initializing = false;
    state.readyPublished = false;
    state.readinessPending = false;
    state.pendingRenderReason = "";

    state.counters.failures +=
      1;

    const errorPayload = {
      name:
        error instanceof Error
          ? error.name
          : "Error",

      message:
        error instanceof Error
          ? error.message
          : String(error)
    };

    publishReceipt(
      "fatal-error",
      {
        error:
          errorPayload,

        rearCompositorCanvasRemoved:
          rearCanvasCreated,

        frontCompositorCanvasRemoved:
          frontCanvasCreated,

        reusedRearCanvasRestored:
          rearCanvasReused,

        reusedFrontCanvasRestored:
          frontCanvasReused,

        compositorCanvasDomRestored:
          true,

        exactDomRestored:
          true,

        fieldStyleRestored:
          true,

        compassLayerStyleRestored:
          true,

        semanticLayerStyleRestored:
          true,

        listenersRemoved:
          true,

        observersDisconnected:
          true
      }
    );

    dispatch(
      EVENTS.compositorFailed,
      {
        error:
          errorPayload
      }
    );
  }

  function initialize() {
    if (
      state.initialized ||
      state.initializing ||
      state.disposed
    ) {
      return;
    }

    state.initializing =
      true;

    try {
      discoverDom();

      const issues =
        validateDom();

      if (issues.length) {
        throw new Error(
          issues.join(" ")
        );
      }

      ensureCanvases();
      initializeControllerBinding();
      initializeResizeObservation();
      initializeMutationObservation();
      exposeApi();

      state.initialized =
        true;

      state.initializing =
        false;

      setRootState(
        false,
        "pending-controller"
      );

      const readinessResult =
        completeReadiness(
          "startup"
        );

      if (
        readinessResult ===
          READINESS_RESULTS.PENDING
      ) {
        publishReceipt(
          "pending",
          {
            reason:
              "controller-unavailable",

            domContract:
              "satisfied",

            canvasModel:
              "compositor-created-or-reused"
          }
        );
      }
    } catch (error) {
      rollbackInitialization(
        error
      );
    }
  }

  function dispose() {
    if (state.disposed) {
      return;
    }

    const rearCanvasCreated =
      state.rearCanvasCreated;

    const frontCanvasCreated =
      state.frontCanvasCreated;

    const rearCanvasReused =
      Boolean(
        state.rearCanvas &&
        !state.rearCanvasCreated
      );

    const frontCanvasReused =
      Boolean(
        state.frontCanvas &&
        !state.frontCanvasCreated
      );

    state.disposed =
      true;

    cancelScheduledRender();
    disconnectObservers();
    removeListeners();

    disposeRenderers(
      "compositor-disposed"
    );

    state.nodes.clear();
    state.classifications.clear();

    removeApi();
    restoreOwnedDom();

    setRootState(
      false,
      "disposed"
    );

    state.controller = null;
    state.controllerFrame = null;
    state.controllerReady = false;

    state.initialized =
      false;

    state.initializing =
      false;

    state.readyPublished =
      false;

    state.readinessPending =
      false;

    state.pendingRenderReason =
      "";

    publishReceipt(
      "disposed",
      {
        rearCompositorCanvasRemoved:
          rearCanvasCreated,

        frontCompositorCanvasRemoved:
          frontCanvasCreated,

        reusedRearCanvasRestored:
          rearCanvasReused,

        reusedFrontCanvasRestored:
          frontCanvasReused,

        exactDomRestored:
          true,

        fieldStyleRestored:
          true,

        compassLayerStyleRestored:
          true,

        semanticLayerStyleRestored:
          true,

        registeredRendererLifecycleDisposed:
          true,

        compassRendererLifecycleMutated:
          false,

        controllerStateMutated:
          false,

        compassLifecycleMutated:
          false,

        frontHostMutated:
          false
      }
    );

    dispatch(
      EVENTS.compositorDisposed,
      {
        disposed:
          true
      }
    );
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
