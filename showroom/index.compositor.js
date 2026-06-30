/* TARGET FILE: /showroom/index.compositor.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5 */
/*
  Upstream semantic authority:
  - /showroom/index.controller.js
  - SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
  - 7.0.0-controller-interaction-semantic-priority

  Frozen DOM attachment contract:
  - [data-showroom-root]
  - #showroom-orbit
  - [data-showroom-orbit-scene]
  - [data-showroom-scene]
  - [data-showroom-orbit-field]
  - [data-showroom-scene-field]
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
  - compositor-timed clear invocation;
  - authoritative projected hit coordinates;
  - bounded node and renderer registration;
  - semantic-projection fact publication;
  - semantic-projection feedback suppression;
  - recoverable held-state suspension;
  - terminal module-instance failure.

  Explicit exclusions:
  - no semantic navigation ownership;
  - no route or destination decisions;
  - no Compass navigation ownership;
  - no Compass renderer lifecycle ownership;
  - no crystal mesh, material, geometry, or animation ownership;
  - no pointer or gesture interpretation;
  - no interaction-priority calculation or publication;
  - no Diamond or Window ownership;
  - no front-host visibility ownership;
  - no rendering-context creation or context-family selection.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5";

  const OWNER =
    "/showroom/index.compositor.js";

  const CONTROLLER_GLOBAL =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_ID =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_VERSION =
    "7.0.0-controller-interaction-semantic-priority";

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    orbit:
      "#showroom-orbit",

    scene:
      "[data-showroom-orbit-scene][data-showroom-scene], " +
      "[data-showroom-orbit-scene], " +
      "[data-showroom-scene]",

    field:
      "[data-showroom-orbit-field][data-showroom-scene-field], " +
      "[data-showroom-orbit-field], " +
      "[data-showroom-scene-field]",

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
      "data-showroom-compositor-dpr",

    compositorClearMode:
      "data-showroom-compositor-clear-mode"
  });

  const EVENTS = Object.freeze({
    controllerReady:
      "SHOWROOM_CONTROLLER_READY",

    controllerFailure:
      "SHOWROOM_CONTROLLER_FAILURE",

    compositorReady:
      "SHOWROOM_COMPOSITOR_READY",

    compositorFailed:
      "SHOWROOM_COMPOSITOR_FAILURE",

    compositorDisposed:
      "SHOWROOM_COMPOSITOR_DISPOSED",

    compositorFrame:
      "SHOWROOM_COMPOSITOR_FRAME",

    compositorProjectionChanged:
      "SHOWROOM_COMPOSITOR_PROJECTION_CHANGED",

    compositorReceipt:
      "SHOWROOM_COMPOSITOR_RECEIPT"
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
    controllerBound: false,
    controllerBinding: false,
    pendingControllerFrame: null,
    pendingCompassRender: false,

    controllerFrameUnsubscribe: null,
    controllerHeldUnsubscribe: null,
    controllerCompassUnsubscribe: null,

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

    projectionIds:
      new Map(),

    lastNodeProjections:
      new Map(),

    pendingProjectionTombstones:
      new Map(),

    renderers:
      new Map(),

    clearOwners: {
      rear: null,
      front: null
    },

    classifications:
      new Map(),

    projectionSnapshot:
      Object.freeze({
        frameId: 0,
        timestamp: 0,
        nodes: Object.freeze([]),
        rear: Object.freeze([]),
        front: Object.freeze([]),
        hitRegions: Object.freeze([]),
        semanticRecords: Object.freeze([])
      }),

    frameId: 0,
    renderRequested: false,
    pendingRenderReason: "",
    rafId: 0,

    semanticProjectionPublishing: false,
    lastSemanticProjectionSignature: "",

    resizeObserver: null,
    mutationObserver: null,

    listeners: [],

    initialized: false,
    initializing: false,
    disposed: false,
    failed: false,
    held: false,

    readyPublished: false,
    readinessPending: true,
    readinessCompleting: false,

    counters: {
      renders: 0,
      resizePasses: 0,
      projectionPasses: 0,
      semanticProjectionPublications: 0,
      semanticProjectionSkips: 0,
      tombstonesPublished: 0,
      rearClears: 0,
      frontClears: 0,
      nodeRegistrations: 0,
      nodeRemovals: 0,
      rendererRegistrations: 0,
      rendererRemovals: 0,
      rendererReplacements: 0,
      holds: 0,
      holdReleases: 0,
      failures: 0
    }
  };

  function normalize(value) {
    return String(
      value == null
        ? ""
        : value
    ).trim();
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

        controllerModuleId:
          CONTROLLER_MODULE_ID,

        controllerModuleVersion:
          CONTROLLER_MODULE_VERSION,

        event,

        timestamp:
          nowIso(),

        frameId:
          state.frameId,

        initialized:
          state.initialized,

        disposed:
          state.disposed,

        failed:
          state.failed,

        held:
          state.held,

        controllerReady:
          state.controllerReady,

        controllerBound:
          state.controllerBound,

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

        clearOwners: {
          ...state.clearOwners
        },

        counters: {
          ...state.counters
        },

        ...detail
      });

    if (state.receipt) {
      const serialized =
        JSON.stringify(payload);

      if (
        "value" in
        state.receipt
      ) {
        state.receipt.value =
          serialized;
      }

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
        ),

      compositorClearMode:
        canvas.getAttribute(
          ATTRIBUTES.compositorClearMode
        )
    };
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

    restoreNullableAttribute(
      canvas,
      ATTRIBUTES.compositorClearMode,
      captured.compositorClearMode
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
        "Missing Showroom orbit scene."
      );
    }

    if (!state.field) {
      issues.push(
        "Missing Showroom orbit field."
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

    canvas.setAttribute(
      ATTRIBUTES.compositorClearMode,
      "renderer-callback-exclusive-owner"
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

    canvas.setAttribute(
      ATTRIBUTES.compositorClearMode,
      "renderer-callback-exclusive-owner"
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
        "Compositor canvases require the orbit field and Compass layer."
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

  function isValidControllerApi(controller) {
    return Boolean(
      controller &&
      typeof controller ===
        "object" &&
      controller.moduleId ===
        CONTROLLER_MODULE_ID &&
      controller.moduleVersion ===
        CONTROLLER_MODULE_VERSION &&
      typeof controller.getFrameState ===
        "function" &&
      typeof controller.subscribeFrameState ===
        "function" &&
      typeof controller.updateSemanticProjection ===
        "function"
    );
  }

  function isValidControllerFrame(frame) {
    return Boolean(
      frame &&
      typeof frame ===
        "object" &&
      frame.moduleId ===
        CONTROLLER_MODULE_ID &&
      frame.moduleVersion ===
        CONTROLLER_MODULE_VERSION &&
      typeof frame.state ===
        "string" &&
      typeof frame.navigationState ===
        "string" &&
      typeof frame.presentationMode ===
        "string" &&
      frame.presentation &&
      typeof frame.presentation ===
        "object" &&
      frame.compass &&
      typeof frame.compass ===
        "object" &&
      typeof frame.held ===
        "boolean" &&
      frame.orbitOrientation &&
      typeof frame.orbitOrientation ===
        "object" &&
      Array.isArray(
        frame.orbitOrientation
          .quaternion
      ) &&
      frame.orbitOrientation
        .quaternion.length ===
        4
    );
  }

  function resolveControllerGlobal() {
    return window[
      CONTROLLER_GLOBAL
    ] || null;
  }

  function readControllerFrame() {
    const controller =
      resolveControllerGlobal();

    if (!controller) {
      return {
        status:
          "unavailable",

        controller:
          null,

        frame:
          null
      };
    }

    if (!isValidControllerApi(controller)) {
      return {
        status:
          "invalid-controller",

        controller,

        frame:
          null
      };
    }

    let frame;

    try {
      frame =
        controller.getFrameState();
    } catch (error) {
      return {
        status:
          "frame-error",

        controller,

        frame:
          null,

        error
      };
    }

    if (!isValidControllerFrame(frame)) {
      return {
        status:
          "invalid-frame",

        controller,

        frame:
          null
      };
    }

    return {
      status:
        frame.held === true
          ? "controller-held"
          : "ready",

      controller,

      frame
    };
  }

  function unsubscribeController() {
    const keys = [
      "controllerFrameUnsubscribe",
      "controllerHeldUnsubscribe",
      "controllerCompassUnsubscribe"
    ];

    for (
      const key
      of keys
    ) {
      const unsubscribe =
        state[key];

      state[key] =
        null;

      if (
        typeof unsubscribe ===
        "function"
      ) {
        try {
          unsubscribe();
        } catch {
          /* Best-effort unsubscription. */
        }
      }
    }

    state.controllerBound =
      false;

    state.controllerBinding =
      false;

    state.pendingControllerFrame =
      null;

    state.pendingCompassRender =
      false;
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

  function normalizeProjectionKind(record) {
    const explicit =
      normalize(
        record.kind ||
        (
          record.metadata &&
          record.metadata.kind
        )
      ).toLowerCase();

    if (
      explicit === "cardinal" ||
      explicit === "coin"
    ) {
      return "cardinal";
    }

    if (
      explicit === "room" ||
      explicit === "child"
    ) {
      return "room";
    }

    if (record.childId) {
      return "room";
    }

    if (record.cardinalId) {
      return "cardinal";
    }

    return explicit ||
      "object";
  }

  function calculateCompassOverlap(
    screenX,
    screenY,
    radius
  ) {
    const distance =
      Math.hypot(
        screenX -
          state.compassPlane.screenX,

        screenY -
          state.compassPlane.screenY
      );

    return (
      distance <
      (
        Math.max(
          0,
          radius
        ) +
        Math.max(
          0,
          state.compassPlane.radius
        )
      )
    );
  }

  function createHiddenProjectionRecord(
    record
  ) {
    const previous =
      state.lastNodeProjections.get(
        record.id
      );

    const depthLayer =
      previous
        ? previous.depthLayer
        : (
            state.classifications.get(
              record.id
            ) ||
            CLASSIFICATIONS.REAR
          );

    return freezePlain({
      id:
        record.projectionId,

      kind:
        normalizeProjectionKind(
          record
        ),

      x:
        previous
          ? previous.x
          : 0,

      y:
        previous
          ? previous.y
          : 0,

      radiusPx:
        0,

      depthLayer,

      compassOverlap:
        false,

      visible:
        false
    });
  }

  function buildProjectionSnapshot() {
    const nodes = [];
    const rear = [];
    const front = [];
    const hitRegions = [];
    const semanticRecords = [];

    for (
      const [
        id,
        record
      ]
      of state.nodes
    ) {
      const semanticallyVisible =
        resolveNodeVisible(record);

      const worldPosition =
        semanticallyVisible
          ? resolveNodePosition(record)
          : null;

      const projection =
        worldPosition
          ? worldToScreen(
              worldPosition
            )
          : null;

      if (
        !semanticallyVisible ||
        !projection
      ) {
        semanticRecords.push(
          createHiddenProjectionRecord(
            record
          )
        );

        continue;
      }

      const depth =
        classifyDepth(
          id,
          projection.view.z
        );

      const hitRadius =
        resolveNodeRadius(record);

      const compassOverlap =
        calculateCompassOverlap(
          projection.screen.x,
          projection.screen.y,
          hitRadius
        );

      const snapshot =
        freezePlain({
          id,

          projectionId:
            record.projectionId,

          kind:
            normalizeProjectionKind(
              record
            ),

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

          compassOverlap,

          metadata:
            record.metadata
              ? {
                  ...record.metadata
                }
              : null
        });

      nodes.push(snapshot);

      const semanticRecord =
        freezePlain({
          id:
            record.projectionId,

          kind:
            snapshot.kind,

          x:
            projection.screen.x,

          y:
            projection.screen.y,

          radiusPx:
            projection.visible
              ? hitRadius
              : 0,

          depthLayer:
            depth.classification,

          compassOverlap:
            projection.visible
              ? compassOverlap
              : false,

          visible:
            projection.visible
        });

      semanticRecords.push(
        semanticRecord
      );

      state.lastNodeProjections.set(
        id,
        semanticRecord
      );

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

            projectionId:
              record.projectionId,

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

            kind:
              snapshot.kind,

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

    for (
      const tombstone
      of state.pendingProjectionTombstones.values()
    ) {
      semanticRecords.push(
        tombstone
      );
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
      ) => {
        const firstFront =
          first.classification ===
          CLASSIFICATIONS.FRONT;

        const secondFront =
          second.classification ===
          CLASSIFICATIONS.FRONT;

        if (
          firstFront !==
          secondFront
        ) {
          return firstFront
            ? -1
            : 1;
        }

        return (
          second.viewDepth -
          first.viewDepth
        );
      }
    );

    semanticRecords.sort(
      (
        first,
        second
      ) =>
        first.id.localeCompare(
          second.id
        )
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

      hitRegions,

      semanticRecords
    });
  }

  function roundProjectionNumber(value) {
    return (
      Math.round(
        toFiniteNumber(
          value,
          0
        ) *
        1000
      ) /
      1000
    );
  }

  function createSemanticProjectionSignature(
    records
  ) {
    return JSON.stringify(
      records.map(
        record => [
          record.id,
          record.kind,
          roundProjectionNumber(
            record.x
          ),
          roundProjectionNumber(
            record.y
          ),
          roundProjectionNumber(
            record.radiusPx
          ),
          record.depthLayer,
          record.compassOverlap,
          record.visible
        ]
      )
    );
  }

  function publishSemanticProjectionToController() {
    if (
      !state.controller ||
      typeof state.controller
        .updateSemanticProjection !==
        "function"
    ) {
      return false;
    }

    const records =
      state.projectionSnapshot
        .semanticRecords;

    const signature =
      createSemanticProjectionSignature(
        records
      );

    if (
      signature ===
      state.lastSemanticProjectionSignature
    ) {
      state.counters
        .semanticProjectionSkips +=
        1;

      return false;
    }

    state.semanticProjectionPublishing =
      true;

    try {
      const accepted =
        state.controller
          .updateSemanticProjection(
            records
          );

      if (accepted === false) {
        throw new Error(
          "The controller rejected the compositor semantic projection."
        );
      }

      state.lastSemanticProjectionSignature =
        signature;

      state.counters
        .semanticProjectionPublications +=
        1;

      if (
        state.pendingProjectionTombstones
          .size > 0
      ) {
        state.counters.tombstonesPublished +=
          state.pendingProjectionTombstones
            .size;

        state.pendingProjectionTombstones
          .clear();
      }

      return true;
    } finally {
      state.semanticProjectionPublishing =
        false;
    }
  }

  function getRenderFrame() {
    return freezePlain({
      contract:
        CONTRACT,

      controllerModuleId:
        CONTROLLER_MODULE_ID,

      controllerModuleVersion:
        CONTROLLER_MODULE_VERSION,

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

  function layerIsUsed(
    layer,
    renderers = state.renderers
  ) {
    const methodName =
      layer === LAYERS.REAR
        ? "renderRear"
        : "renderFront";

    for (
      const renderer
      of renderers.values()
    ) {
      if (
        typeof renderer[methodName] ===
        "function"
      ) {
        return true;
      }
    }

    return false;
  }

  function validateClearOwnershipForRenderers(
    renderers,
    clearOwners
  ) {
    const rearUsed =
      layerIsUsed(
        LAYERS.REAR,
        renderers
      );

    const frontUsed =
      layerIsUsed(
        LAYERS.FRONT,
        renderers
      );

    if (
      rearUsed &&
      !clearOwners.rear
    ) {
      throw new Error(
        "The active rear layer has no declared clear owner."
      );
    }

    if (
      frontUsed &&
      !clearOwners.front
    ) {
      throw new Error(
        "The active front layer has no declared clear owner."
      );
    }

    if (
      clearOwners.rear &&
      !renderers.has(
        clearOwners.rear
      )
    ) {
      throw new Error(
        "The declared rear clear owner is not registered."
      );
    }

    if (
      clearOwners.front &&
      !renderers.has(
        clearOwners.front
      )
    ) {
      throw new Error(
        "The declared front clear owner is not registered."
      );
    }

    const rearOwner =
      clearOwners.rear
        ? renderers.get(
            clearOwners.rear
          )
        : null;

    const frontOwner =
      clearOwners.front
        ? renderers.get(
            clearOwners.front
          )
        : null;

    if (
      rearOwner &&
      typeof rearOwner.clearRear !==
        "function"
    ) {
      throw new Error(
        "The rear clear owner does not implement clearRear()."
      );
    }

    if (
      frontOwner &&
      typeof frontOwner.clearFront !==
        "function"
    ) {
      throw new Error(
        "The front clear owner does not implement clearFront()."
      );
    }

    return true;
  }

  function clearLayerWithOwner(
    layer,
    renderFrame,
    ownerId = null
  ) {
    const resolvedOwnerId =
      ownerId ||
      (
        layer === LAYERS.REAR
          ? state.clearOwners.rear
          : state.clearOwners.front
      );

    if (!resolvedOwnerId) {
      throw new Error(
        `No clear owner exists for the ${layer} layer.`
      );
    }

    const renderer =
      state.renderers.get(
        resolvedOwnerId
      );

    if (!renderer) {
      throw new Error(
        `Clear owner "${resolvedOwnerId}" is not registered.`
      );
    }

    const methodName =
      layer === LAYERS.REAR
        ? "clearRear"
        : "clearFront";

    const clearMethod =
      renderer[methodName];

    if (
      typeof clearMethod !==
      "function"
    ) {
      throw new Error(
        `Clear owner "${resolvedOwnerId}" does not implement ${methodName}().`
      );
    }

    const canvas =
      layer === LAYERS.REAR
        ? state.rearCanvas
        : state.frontCanvas;

    clearMethod({
      contract:
        CONTRACT,

      frame:
        renderFrame,

      canvas,

      layer,

      reason:
        "frame-clear",

      rearCanvas:
        state.rearCanvas,

      frontCanvas:
        state.frontCanvas
    });

    if (
      layer ===
      LAYERS.REAR
    ) {
      state.counters.rearClears +=
        1;
    } else {
      state.counters.frontClears +=
        1;
    }

    return resolvedOwnerId;
  }

  function clearRegisteredLayers(
    renderFrame
  ) {
    validateClearOwnershipForRenderers(
      state.renderers,
      state.clearOwners
    );

    const rearUsed =
      layerIsUsed(
        LAYERS.REAR
      );

    const frontUsed =
      layerIsUsed(
        LAYERS.FRONT
      );

    const rearClearOwner =
      rearUsed
        ? clearLayerWithOwner(
            LAYERS.REAR,
            renderFrame
          )
        : null;

    const frontClearOwner =
      frontUsed
        ? clearLayerWithOwner(
            LAYERS.FRONT,
            renderFrame
          )
        : null;

    return freezePlain({
      rearRequired:
        rearUsed,

      frontRequired:
        frontUsed,

      rearCleared:
        rearUsed,

      frontCleared:
        frontUsed,

      rearClearOwner,

      frontClearOwner
    });
  }

  function finalClearOwnedLayers(
    renderer,
    reason
  ) {
    const renderFrame =
      getRenderFrame();

    if (
      renderer.clearRearOwned ===
        true
    ) {
      if (
        state.clearOwners.rear !==
        renderer.id
      ) {
        throw new Error(
          `Renderer "${renderer.id}" does not own the rear clear boundary.`
        );
      }

      renderer.clearRear({
        contract:
          CONTRACT,

        frame:
          renderFrame,

        canvas:
          state.rearCanvas,

        layer:
          LAYERS.REAR,

        reason,

        finalClear:
          true,

        rearCanvas:
          state.rearCanvas,

        frontCanvas:
          state.frontCanvas
      });

      state.counters.rearClears +=
        1;
    }

    if (
      renderer.clearFrontOwned ===
        true
    ) {
      if (
        state.clearOwners.front !==
        renderer.id
      ) {
        throw new Error(
          `Renderer "${renderer.id}" does not own the front clear boundary.`
        );
      }

      renderer.clearFront({
        contract:
          CONTRACT,

        frame:
          renderFrame,

        canvas:
          state.frontCanvas,

        layer:
          LAYERS.FRONT,

        reason,

        finalClear:
          true,

        rearCanvas:
          state.rearCanvas,

        frontCanvas:
          state.frontCanvas
      });

      state.counters.frontClears +=
        1;
    }
  }

  function renderRegisteredLayers(
    renderFrame,
    clearState
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
          .hitRegions,

      clearState,

      rendererMustNotClearSharedCanvas:
        true
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
    if (
      state.disposed ||
      state.failed
    ) {
      return;
    }

    state.failed =
      true;

    state.counters.failures +=
      1;

    cancelScheduledRender();

    state.controllerReady =
      false;

    state.readinessPending =
      false;

    state.readyPublished =
      false;

    state.held =
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

        terminalForCurrentInstance:
          true,

        error:
          errorPayload
      }
    );

    dispatch(
      EVENTS.compositorFailed,
      {
        reason,

        terminalForCurrentInstance:
          true,

        error:
          errorPayload
      }
    );
  }

  function enterHeldState(
    frame = null,
    reason = "controller-held"
  ) {
    if (
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    if (
      frame &&
      isValidControllerFrame(frame)
    ) {
      state.controllerFrame =
        frame;
    }

    state.controllerReady =
      false;

    if (state.held) {
      return false;
    }

    cancelScheduledRender();

    state.held =
      true;

    state.readinessPending =
      true;

    state.counters.holds +=
      1;

    setRootState(
      false,
      "held"
    );

    publishReceipt(
      "held",
      {
        reason
      }
    );

    return true;
  }

  function leaveHeldState(
    frame,
    reason = "controller-hold-released"
  ) {
    if (
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    if (!isValidControllerFrame(frame)) {
      failRuntime(
        new Error(
          "The controller returned an invalid frame after hold release."
        ),
        "controller-hold-release"
      );

      return false;
    }

    state.controllerFrame =
      frame;

    if (frame.held === true) {
      return enterHeldState(
        frame,
        reason
      );
    }

    state.controllerReady =
      true;

    if (!state.held) {
      return false;
    }

    state.held =
      false;

    state.readinessPending =
      false;

    state.counters.holdReleases +=
      1;

    if (!state.readyPublished) {
      completeReadiness(reason);
    } else {
      setRootState(
        true,
        "ready"
      );

      requestRender(reason);
    }

    publishReceipt(
      "hold-released",
      {
        reason
      }
    );

    return true;
  }

  function processControllerFrame(
    frame,
    reason
  ) {
    if (
      state.disposed ||
      state.failed
    ) {
      return;
    }

    if (!isValidControllerFrame(frame)) {
      failRuntime(
        new Error(
          "The controller published an incompatible frame."
        ),
        "controller-frame"
      );

      return;
    }

    state.controllerFrame =
      frame;

    if (frame.held === true) {
      enterHeldState(
        frame,
        reason
      );

      return;
    }

    if (state.held) {
      leaveHeldState(
        frame,
        reason
      );

      return;
    }

    state.controllerReady =
      true;

    if (!state.readyPublished) {
      completeReadiness(reason);

      return;
    }

    if (
      state.semanticProjectionPublishing
    ) {
      return;
    }

    requestRender(reason);
  }

  function handleControllerFrame(frame) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return;
    }

    if (!isValidControllerFrame(frame)) {
      failRuntime(
        new Error(
          "The controller published an incompatible frame."
        ),
        "controller-frame"
      );

      return;
    }

    if (state.controllerBinding) {
      state.pendingControllerFrame =
        frame;

      return;
    }

    processControllerFrame(
      frame,
      "controller-frame-subscription"
    );
  }

  function handleHeldSubscription(
    heldState
  ) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return;
    }

    if (state.controllerBinding) {
      if (
        heldState &&
        heldState.held === true &&
        state.pendingControllerFrame &&
        isValidControllerFrame(
          state.pendingControllerFrame
        )
      ) {
        state.pendingControllerFrame =
          freezePlain({
            ...state.pendingControllerFrame,

            held:
              true
          });
      }

      return;
    }

    const held =
      Boolean(
        heldState &&
        heldState.held === true
      );

    if (held) {
      enterHeldState(
        state.controllerFrame,
        normalize(
          heldState.reason
        ) ||
        "controller-held-subscription"
      );

      return;
    }

    if (!state.held) {
      return;
    }

    const controller =
      state.controller ||
      resolveControllerGlobal();

    if (
      !controller ||
      typeof controller.getFrameState !==
        "function"
    ) {
      state.readinessPending =
        true;

      setRootState(
        false,
        "pending-controller"
      );

      return;
    }

    let frame;

    try {
      frame =
        controller.getFrameState();
    } catch (error) {
      failRuntime(
        error,
        "controller-hold-release-frame"
      );

      return;
    }

    leaveHeldState(
      frame,
      "controller-held-subscription-released"
    );
  }

  function handleCompassSubscription() {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return;
    }

    if (
      state.controllerBinding ||
      state.semanticProjectionPublishing
    ) {
      state.pendingCompassRender =
        true;

      return;
    }

    requestRender(
      "controller-compass-state"
    );
  }

  function bindControllerSubscriptions(
    controller
  ) {
    if (
      state.controllerBinding ||
      state.controllerBound
    ) {
      return;
    }

    state.controllerBinding =
      true;

    state.pendingControllerFrame =
      null;

    state.pendingCompassRender =
      false;

    const acquired = [];

    try {
      const frameUnsubscribe =
        controller.subscribeFrameState(
          handleControllerFrame
        );

      if (
        frameUnsubscribe != null &&
        typeof frameUnsubscribe !==
          "function"
      ) {
        throw new Error(
          "subscribeFrameState() did not return an unsubscribe function."
        );
      }

      if (
        typeof frameUnsubscribe ===
          "function"
      ) {
        acquired.push(
          frameUnsubscribe
        );
      }

      state.controllerFrameUnsubscribe =
        frameUnsubscribe ||
        null;

      if (
        typeof controller.subscribeHeldState ===
          "function"
      ) {
        const heldUnsubscribe =
          controller.subscribeHeldState(
            handleHeldSubscription
          );

        if (
          heldUnsubscribe != null &&
          typeof heldUnsubscribe !==
            "function"
        ) {
          throw new Error(
            "subscribeHeldState() did not return an unsubscribe function."
          );
        }

        if (
          typeof heldUnsubscribe ===
            "function"
        ) {
          acquired.push(
            heldUnsubscribe
          );
        }

        state.controllerHeldUnsubscribe =
          heldUnsubscribe ||
          null;
      }

      if (
        typeof controller.subscribeCompassState ===
          "function"
      ) {
        const compassUnsubscribe =
          controller.subscribeCompassState(
            handleCompassSubscription
          );

        if (
          compassUnsubscribe != null &&
          typeof compassUnsubscribe !==
            "function"
        ) {
          throw new Error(
            "subscribeCompassState() did not return an unsubscribe function."
          );
        }

        if (
          typeof compassUnsubscribe ===
            "function"
        ) {
          acquired.push(
            compassUnsubscribe
          );
        }

        state.controllerCompassUnsubscribe =
          compassUnsubscribe ||
          null;
      }

      state.controllerBound =
        true;
    } catch (error) {
      for (
        const unsubscribe
        of acquired.reverse()
      ) {
        try {
          unsubscribe();
        } catch {
          /* Transaction rollback continues. */
        }
      }

      state.controllerFrameUnsubscribe =
        null;

      state.controllerHeldUnsubscribe =
        null;

      state.controllerCompassUnsubscribe =
        null;

      state.controllerBound =
        false;

      throw error;
    } finally {
      state.controllerBinding =
        false;
    }

    const retainedFrame =
      state.pendingControllerFrame;

    state.pendingControllerFrame =
      null;

    if (retainedFrame) {
      processControllerFrame(
        retainedFrame,
        "controller-binding-retained-frame"
      );
    }

    if (state.pendingCompassRender) {
      state.pendingCompassRender =
        false;

      requestRender(
        "controller-binding-retained-compass"
      );
    }
  }

  function bindResolvedController(
    controller,
    frame = null
  ) {
    if (!isValidControllerApi(controller)) {
      throw new Error(
        "The Showroom controller API is incompatible."
      );
    }

    const authoritativeFrame =
      frame ||
      controller.getFrameState();

    if (
      !isValidControllerFrame(
        authoritativeFrame
      )
    ) {
      throw new Error(
        "The Showroom controller frame is incompatible."
      );
    }

    state.controller =
      controller;

    state.controllerFrame =
      authoritativeFrame;

    state.controllerReady =
      authoritativeFrame.held !==
      true;

    state.held =
      authoritativeFrame.held ===
      true;

    bindControllerSubscriptions(
      controller
    );

    return authoritativeFrame;
  }

  function performRender() {
    state.renderRequested =
      false;

    state.rafId =
      0;

    if (
      state.disposed ||
      state.failed ||
      !state.initialized ||
      state.held ||
      !state.readyPublished ||
      !state.controllerReady ||
      !state.controllerFrame
    ) {
      return false;
    }

    const controllerResult =
      readControllerFrame();

    if (
      controllerResult.status ===
        "unavailable"
    ) {
      state.controllerReady =
        false;

      state.readinessPending =
        true;

      setRootState(
        false,
        "pending-controller"
      );

      return false;
    }

    if (
      controllerResult.status ===
        "controller-held"
    ) {
      enterHeldState(
        controllerResult.frame,
        "controller-held-during-render"
      );

      return false;
    }

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

    state.controller =
      controllerResult.controller;

    state.controllerFrame =
      controllerResult.frame;

    state.controllerReady =
      true;

    measureViewport();
    measureCompassPlane();
    rebuildMatrices();

    state.frameId +=
      1;

    state.projectionSnapshot =
      buildProjectionSnapshot();

    try {
      publishSemanticProjectionToController();
    } catch (error) {
      failRuntime(
        error,
        "semantic-projection-publication"
      );

      return false;
    }

    const renderFrame =
      getRenderFrame();

    let clearState;

    try {
      clearState =
        clearRegisteredLayers(
          renderFrame
        );
    } catch (error) {
      failRuntime(
        error,
        "shared-layer-clear"
      );

      return false;
    }

    renderRegisteredLayers(
      renderFrame,
      clearState
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
          renderFrame,

        clearState
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
      state.failed ||
      !state.initialized ||
      state.held
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

  function deriveProjectionId(
    definition,
    id
  ) {
    return normalize(
      definition.childId ||
      definition.cardinalId ||
      definition.semanticObjectId ||
      id
    );
  }

  function registerNode(definition) {
    if (
      state.disposed ||
      state.failed ||
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

    const projectionId =
      deriveProjectionId(
        definition,
        id
      );

    if (!projectionId) {
      throw new TypeError(
        `Compositor node "${id}" requires a stable controller projection id.`
      );
    }

    const currentProjectionOwner =
      state.projectionIds.get(
        projectionId
      );

    if (
      currentProjectionOwner &&
      currentProjectionOwner !==
        id
    ) {
      throw new Error(
        `Controller projection id "${projectionId}" is already owned by node "${currentProjectionOwner}".`
      );
    }

    const previousRecord =
      state.nodes.get(id);

    if (
      previousRecord &&
      previousRecord.projectionId !==
        projectionId
    ) {
      const collision =
        state.projectionIds.get(
          projectionId
        );

      if (
        collision &&
        collision !== id
      ) {
        throw new Error(
          `Controller projection id "${projectionId}" is already owned by node "${collision}".`
        );
      }
    }

    const record = {
      id,

      projectionId,

      kind:
        normalize(
          definition.kind
        ),

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
      Boolean(previousRecord);

    if (
      previousRecord &&
      previousRecord.projectionId !==
        projectionId
    ) {
      state.projectionIds.delete(
        previousRecord.projectionId
      );

      state.pendingProjectionTombstones.set(
        previousRecord.projectionId,
        createNodeTombstone(
          previousRecord
        )
      );
    }

    state.nodes.set(
      id,
      record
    );

    state.projectionIds.set(
      projectionId,
      id
    );

    state.pendingProjectionTombstones.delete(
      projectionId
    );

    if (!replacing) {
      state.counters.nodeRegistrations +=
        1;
    }

    state.lastSemanticProjectionSignature =
      "";

    requestRender(
      replacing
        ? "node-replaced"
        : "node-registered"
    );

    return Object.freeze({
      id,

      projectionId,

      unregister() {
        return unregisterNode(id);
      },

      requestRender
    });
  }

  function createNodeTombstone(record) {
    const previous =
      state.lastNodeProjections.get(
        record.id
      );

    return freezePlain({
      id:
        record.projectionId,

      kind:
        normalizeProjectionKind(
          record
        ),

      x:
        previous
          ? previous.x
          : 0,

      y:
        previous
          ? previous.y
          : 0,

      radiusPx:
        0,

      depthLayer:
        previous
          ? previous.depthLayer
          : (
              state.classifications.get(
                record.id
              ) ||
              CLASSIFICATIONS.REAR
            ),

      compassOverlap:
        false,

      visible:
        false
    });
  }

  function unregisterNode(id) {
    const normalizedId =
      normalize(id);

    const record =
      state.nodes.get(
        normalizedId
      );

    if (!record) {
      return false;
    }

    state.pendingProjectionTombstones.set(
      record.projectionId,
      createNodeTombstone(
        record
      )
    );

    state.nodes.delete(
      normalizedId
    );

    state.projectionIds.delete(
      record.projectionId
    );

    state.classifications.delete(
      normalizedId
    );

    state.lastNodeProjections.delete(
      normalizedId
    );

    state.lastSemanticProjectionSignature =
      "";

    state.counters.nodeRemovals +=
      1;

    requestRender(
      "node-unregistered"
    );

    return true;
  }

  function normalizeRendererDefinition(
    definition
  ) {
    if (
      !definition ||
      typeof definition !==
        "object"
    ) {
      throw new TypeError(
        "A compositor renderer definition is required."
      );
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

    const renderRear =
      typeof definition.renderRear ===
        "function"
        ? definition.renderRear
        : null;

    const renderFront =
      typeof definition.renderFront ===
        "function"
        ? definition.renderFront
        : null;

    if (
      !renderRear &&
      !renderFront
    ) {
      throw new TypeError(
        `Compositor renderer "${id}" must implement renderRear() or renderFront().`
      );
    }

    const clearRearOwned =
      definition.clearRearOwned ===
      true;

    const clearFrontOwned =
      definition.clearFrontOwned ===
      true;

    const clearRear =
      typeof definition.clearRear ===
        "function"
        ? definition.clearRear
        : null;

    const clearFront =
      typeof definition.clearFront ===
        "function"
        ? definition.clearFront
        : null;

    if (
      clearRearOwned &&
      !clearRear
    ) {
      throw new TypeError(
        `Renderer "${id}" declares rear clear ownership without clearRear().`
      );
    }

    if (
      clearFrontOwned &&
      !clearFront
    ) {
      throw new TypeError(
        `Renderer "${id}" declares front clear ownership without clearFront().`
      );
    }

    if (
      clearRear &&
      !clearRearOwned
    ) {
      throw new TypeError(
        `Renderer "${id}" provides clearRear() without declaring clearRearOwned: true.`
      );
    }

    if (
      clearFront &&
      !clearFrontOwned
    ) {
      throw new TypeError(
        `Renderer "${id}" provides clearFront() without declaring clearFrontOwned: true.`
      );
    }

    return {
      id,

      clearRearOwned,

      clearFrontOwned,

      clearRear,

      clearFront,

      beginFrame:
        typeof definition.beginFrame ===
          "function"
          ? definition.beginFrame
          : null,

      renderRear,

      renderFront,

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
  }

  function createProposedRendererState(
    incoming
  ) {
    const proposedRenderers =
      new Map(
        state.renderers
      );

    const proposedClearOwners = {
      ...state.clearOwners
    };

    const existing =
      proposedRenderers.get(
        incoming.id
      );

    if (
      existing &&
      existing.clearRearOwned &&
      proposedClearOwners.rear ===
        incoming.id
    ) {
      proposedClearOwners.rear =
        null;
    }

    if (
      existing &&
      existing.clearFrontOwned &&
      proposedClearOwners.front ===
        incoming.id
    ) {
      proposedClearOwners.front =
        null;
    }

    if (
      incoming.clearRearOwned
    ) {
      if (
        proposedClearOwners.rear &&
        proposedClearOwners.rear !==
          incoming.id
      ) {
        throw new Error(
          `Rear clear ownership already belongs to renderer "${proposedClearOwners.rear}".`
        );
      }

      proposedClearOwners.rear =
        incoming.id;
    }

    if (
      incoming.clearFrontOwned
    ) {
      if (
        proposedClearOwners.front &&
        proposedClearOwners.front !==
          incoming.id
      ) {
        throw new Error(
          `Front clear ownership already belongs to renderer "${proposedClearOwners.front}".`
        );
      }

      proposedClearOwners.front =
        incoming.id;
    }

    proposedRenderers.set(
      incoming.id,
      incoming
    );

    validateClearOwnershipForRenderers(
      proposedRenderers,
      proposedClearOwners
    );

    return {
      existing:
        existing || null,

      proposedRenderers,

      proposedClearOwners
    };
  }

  function registerRenderer(definition) {
    if (
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    const incoming =
      normalizeRendererDefinition(
        definition
      );

    const proposal =
      createProposedRendererState(
        incoming
      );

    const existing =
      proposal.existing;

    if (existing) {
      try {
        finalClearOwnedLayers(
          existing,
          "renderer-replacement-final-clear"
        );
      } catch (error) {
        failRuntime(
          error,
          "renderer-replacement-final-clear"
        );

        throw error;
      }

      if (
        typeof existing.dispose ===
          "function"
      ) {
        try {
          existing.dispose({
            reason:
              "renderer-replaced",

            rearCanvas:
              state.rearCanvas,

            frontCanvas:
              state.frontCanvas
          });
        } catch (error) {
          failRuntime(
            error,
            "renderer-replacement-dispose"
          );

          throw error;
        }
      }
    }

    state.renderers =
      proposal.proposedRenderers;

    state.clearOwners =
      proposal.proposedClearOwners;

    if (existing) {
      state.counters.rendererReplacements +=
        1;
    } else {
      state.counters.rendererRegistrations +=
        1;
    }

    requestRender(
      existing
        ? "renderer-replaced"
        : "renderer-registered"
    );

    return Object.freeze({
      id:
        incoming.id,

      rearCanvas:
        state.rearCanvas,

      frontCanvas:
        state.frontCanvas,

      clearRearOwned:
        incoming.clearRearOwned,

      clearFrontOwned:
        incoming.clearFrontOwned,

      sharedCanvasClearTimingAuthority:
        CONTRACT,

      compositorCreatesRenderingContext:
        false,

      rendererMustNotClearDuringRender:
        true,

      unregister() {
        return unregisterRenderer(
          incoming.id
        );
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

    try {
      finalClearOwnedLayers(
        renderer,
        "renderer-unregister-final-clear"
      );
    } catch (error) {
      failRuntime(
        error,
        "renderer-unregister-final-clear"
      );

      return false;
    }

    const proposedRenderers =
      new Map(
        state.renderers
      );

    proposedRenderers.delete(
      normalizedId
    );

    const proposedClearOwners = {
      ...state.clearOwners
    };

    if (
      proposedClearOwners.rear ===
      normalizedId
    ) {
      proposedClearOwners.rear =
        null;
    }

    if (
      proposedClearOwners.front ===
      normalizedId
    ) {
      proposedClearOwners.front =
        null;
    }

    try {
      validateClearOwnershipForRenderers(
        proposedRenderers,
        proposedClearOwners
      );
    } catch (error) {
      failRuntime(
        error,
        "renderer-unregister-clear-ownership"
      );

      return false;
    }

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
      } catch (error) {
        failRuntime(
          error,
          "renderer-unregister-dispose"
        );

        return false;
      }
    }

    state.renderers =
      proposedRenderers;

    state.clearOwners =
      proposedClearOwners;

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
      state.failed ||
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

    state.lastSemanticProjectionSignature =
      "";

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

    state.lastSemanticProjectionSignature =
      "";

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
        distance >
          region.radius
      ) {
        continue;
      }

      if (!best) {
        best =
          region;

        bestDistance =
          distance;

        continue;
      }

      const regionIsFront =
        region.classification ===
        CLASSIFICATIONS.FRONT;

      const bestIsFront =
        best.classification ===
        CLASSIFICATIONS.FRONT;

      if (
        regionIsFront &&
        !bestIsFront
      ) {
        best =
          region;

        bestDistance =
          distance;

        continue;
      }

      if (
        regionIsFront ===
          bestIsFront &&
        region.viewDepth >
          best.viewDepth
      ) {
        best =
          region;

        bestDistance =
          distance;

        continue;
      }

      if (
        regionIsFront ===
          bestIsFront &&
        Math.abs(
          region.viewDepth -
          best.viewDepth
        ) <= 1e-9 &&
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

      controllerGlobal:
        CONTROLLER_GLOBAL,

      controllerModuleId:
        CONTROLLER_MODULE_ID,

      controllerModuleVersion:
        CONTROLLER_MODULE_VERSION,

      initialized:
        state.initialized,

      initializing:
        state.initializing,

      disposed:
        state.disposed,

      failed:
        state.failed,

      held:
        state.held,

      readyPublished:
        state.readyPublished,

      readinessPending:
        state.readinessPending,

      readinessCompleting:
        state.readinessCompleting,

      controllerReady:
        state.controllerReady,

      controllerBound:
        state.controllerBound,

      controllerBinding:
        state.controllerBinding,

      semanticProjectionPublishing:
        state.semanticProjectionPublishing,

      lastSemanticProjectionSignature:
        state.lastSemanticProjectionSignature,

      pendingProjectionTombstones:
        Array.from(
          state.pendingProjectionTombstones
            .keys()
        ),

      pendingRenderReason:
        state.pendingRenderReason ||
        null,

      controllerAvailable:
        Boolean(
          state.controller
        ),

      controllerFrame:
        state.controllerFrame,

      clearOwners: {
        ...state.clearOwners
      },

      ownership: {
        registeredRendererLifecycleOwned:
          true,

        sharedCanvasClearTimingOwned:
          true,

        rendererContextFamilyOwned:
          false,

        semanticProjectionFactPublicationOwned:
          true,

        interactionPriorityOwned:
          false,

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

      registeredProjectionIds:
        Array.from(
          state.projectionIds.keys()
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
            state.lastSemanticProjectionSignature =
              "";

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
          state.lastSemanticProjectionSignature =
            "";

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
          state.lastSemanticProjectionSignature =
            "";

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
      state.failed ||
      !state.initialized ||
      state.readyPublished ||
      state.readinessCompleting
    ) {
      return READINESS_RESULTS.SKIPPED;
    }

    state.readinessCompleting =
      true;

    try {
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
        controllerResult.status ===
          "controller-held"
      ) {
        if (
          !state.controllerBound ||
          state.controller !==
            controllerResult.controller
        ) {
          bindResolvedController(
            controllerResult.controller,
            controllerResult.frame
          );
        }

        enterHeldState(
          controllerResult.frame,
          "controller-readiness-held"
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

      if (
        !state.controllerBound ||
        state.controller !==
          controllerResult.controller
      ) {
        bindResolvedController(
          controllerResult.controller,
          controllerResult.frame
        );
      } else {
        state.controller =
          controllerResult.controller;

        state.controllerFrame =
          controllerResult.frame;

        state.controllerReady =
          true;

        state.held =
          false;
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
        state.failed ||
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

          compositorCreatesRenderingContext:
            false,

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

          interactionPriorityOwned:
            false,

          semanticProjectionReturnedToController:
            true,

          semanticProjectionFeedbackSuppressed:
            true,

          hiddenNodeFalseRecordsPublished:
            true,

          removedNodeTombstonesPublished:
            true,

          projectionIdsCollisionChecked:
            true,

          sharedCanvasClearTimingAuthority:
            CONTRACT,

          rendererContextFamilySelectedByCompositor:
            false,

          sharedCanvasClearFrequency:
            "exactly-once-per-active-layer-per-frame",

          registeredRendererLifecycleOwned:
            true,

          heldStateRecoverable:
            true,

          terminalFailureForCurrentInstance:
            true
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

          semanticProjectionReturnedToController:
            true,

          interactionPriorityPublished:
            false,

          sharedCanvasClearTimingAuthority:
            CONTRACT,

          rendererContextFamilySelectedByCompositor:
            false,

          registeredRendererLifecycleOwned:
            true,

          heldStateRecoverable:
            true,

          terminalFailureForCurrentInstance:
            true,

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
    } catch (error) {
      failRuntime(
        error,
        "readiness-completion"
      );

      return READINESS_RESULTS.FAILED;
    } finally {
      state.readinessCompleting =
        false;
    }
  }

  function initializeControllerBinding() {
    addListener(
      window,
      EVENTS.controllerReady,
      () => {
        if (
          state.disposed ||
          state.failed ||
          !state.initialized
        ) {
          return;
        }

        completeReadiness(
          "controller-ready-event"
        );
      }
    );

    addListener(
      window,
      EVENTS.controllerFailure,
      event => {
        const reason =
          event &&
          event.detail &&
          event.detail.reason
            ? String(
                event.detail.reason
              )
            : "SHOWROOM_CONTROLLER_FAILURE";

        failRuntime(
          new Error(reason),
          "controller-failure-event"
        );
      }
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

      return READINESS_RESULTS.PENDING;
    }

    if (
      controllerResult.status !==
        "ready" &&
      controllerResult.status !==
        "controller-held"
    ) {
      throw new Error(
        `Controller binding failed: ${controllerResult.status}.`
      );
    }

    bindResolvedController(
      controllerResult.controller,
      controllerResult.frame
    );

    if (
      controllerResult.status ===
        "controller-held"
    ) {
      enterHeldState(
        controllerResult.frame,
        "controller-initially-held"
      );

      return READINESS_RESULTS.PENDING;
    }

    return READINESS_RESULTS.READY;
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        controllerGlobal:
          CONTROLLER_GLOBAL,

        controllerModuleId:
          CONTROLLER_MODULE_ID,

        controllerModuleVersion:
          CONTROLLER_MODULE_VERSION,

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
      try {
        finalClearOwnedLayers(
          renderer,
          `${reason}-final-clear`
        );
      } catch {
        /* Disposal continues. */
      }

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

    state.clearOwners.rear =
      null;

    state.clearOwners.front =
      null;
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
    unsubscribeController();
    removeListeners();

    disposeRenderers(
      "initialization-rollback"
    );

    state.nodes.clear();
    state.projectionIds.clear();
    state.lastNodeProjections.clear();
    state.pendingProjectionTombstones.clear();
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
    state.controllerBound = false;
    state.controllerBinding = false;

    state.initialized = false;
    state.initializing = false;
    state.failed = true;
    state.held = false;
    state.readyPublished = false;
    state.readinessPending = false;
    state.readinessCompleting = false;
    state.pendingRenderReason = "";
    state.semanticProjectionPublishing = false;
    state.lastSemanticProjectionSignature = "";

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

        terminalForCurrentInstance:
          true,

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

        controllerSubscriptionsRemoved:
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
          errorPayload,

        terminalForCurrentInstance:
          true
      }
    );
  }

  function initialize() {
    if (
      state.initialized ||
      state.initializing ||
      state.disposed ||
      state.failed
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

      const bindingResult =
        initializeControllerBinding();

      if (
        bindingResult ===
          READINESS_RESULTS.PENDING
      ) {
        publishReceipt(
          "pending",
          {
            reason:
              state.held
                ? "controller-held"
                : "controller-unavailable",

            domContract:
              "satisfied",

            canvasModel:
              "compositor-created-or-reused",

            compositorCreatesRenderingContext:
              false
          }
        );

        return;
      }

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
              state.held
                ? "controller-held"
                : "controller-unavailable",

            domContract:
              "satisfied",

            canvasModel:
              "compositor-created-or-reused",

            compositorCreatesRenderingContext:
              false
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
    unsubscribeController();
    removeListeners();

    disposeRenderers(
      "compositor-disposed"
    );

    state.nodes.clear();
    state.projectionIds.clear();
    state.lastNodeProjections.clear();
    state.pendingProjectionTombstones.clear();
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
    state.controllerBound = false;
    state.controllerBinding = false;

    state.initialized =
      false;

    state.initializing =
      false;

    state.held =
      false;

    state.readyPublished =
      false;

    state.readinessPending =
      false;

    state.readinessCompleting =
      false;

    state.pendingRenderReason =
      "";

    state.semanticProjectionPublishing =
      false;

    state.lastSemanticProjectionSignature =
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

        controllerSubscriptionsRemoved:
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
          false,

        compositorCreatedRenderingContext:
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
