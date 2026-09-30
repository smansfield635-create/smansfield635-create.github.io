// /showroom/index.diamond.js
// SHOWROOM_DIAMOND_G3_NATIVE_WEBGL_OBJECT_LATTICE_RENDERER_TNT_v1
// Full-file replacement.
//
// Purpose:
// - Consume /showroom/index.diamond.geometry.js as the sole G3 geometry authority.
// - Render the 512-facet computational diamond through native WebGL.
// - Preserve Object View and Lattice View on one shared three-dimensional object.
// - Render the gold crown, cyan-white bridge girdle, sapphire pavilion,
//   internal 256-seat lattice, selected facets, and one ground shadow below.
// - Provide drag, touch, pinch, wheel zoom, idle rotation, reset, inspection,
//   reduced-motion handling, viewport suspension, and context-loss handling.
// - Preserve compatibility with the existing DGBShowroomDiamondG2 API name.
//
// Owns:
// - WebGL context and GPU resources
// - surface, lattice, node, girdle, selection, and shadow rendering
// - camera and object interaction state
// - pointer/touch/wheel interaction
// - facet picking
// - animation and renderer receipts
//
// Does not own:
// - geometry formulas
// - canonical seat construction
// - public UI button construction
// - Map Portal
// - route shell
// - product-engine execution

(function installShowroomDiamondG3(root, doc) {
  "use strict";

  const CONTRACT =
    "SHOWROOM_DIAMOND_G3_NATIVE_WEBGL_OBJECT_LATTICE_RENDERER_TNT_v1";

  const GEOMETRY_CONTRACT =
    "SHOWROOM_DIAMOND_G3_16X16_256_SEAT_GEOMETRY_AUTHORITY_TNT_v1";

  const PREVIOUS_RENDERER =
    "SHOWROOM_DIAMOND_G2_SUNFLOWER_PHYLLOTAXIS_CORE_SPIRAL_RENDERER_TNT_v5";

  const CONTRACT_FAMILY =
    "SHOWROOM_DIAMOND_G3_TRUE_3D_OBJECT_LATTICE_FOUR_FILE_FAMILY_v1";

  const ROUTE = "/showroom/";
  const FILE = "/showroom/index.diamond.js";
  const API_NAME = "DGBShowroomDiamondG3";
  const COMPATIBILITY_API_NAME = "DGBShowroomDiamondG2";

  const EVENT_READY = "showroom-diamond-g3-ready";
  const EVENT_STATE = "showroom-diamond-g3-state";
  const EVENT_SELECTION = "showroom-diamond-g3-selection";
  const EVENT_CONTEXT_LOST = "showroom-diamond-g3-context-lost";
  const EVENT_FALLBACK = "showroom-diamond-g3-fallback";

  const STAGE_SELECTOR = "[data-showroom-diamond-stage]";
  const CANVAS_SELECTOR = "[data-showroom-diamond-canvas]";
  const FALLBACK_SELECTOR = "[data-showroom-diamond-fallback]";

  const DIMENSIONS = Object.freeze({
    object: Object.freeze({
      view: "object",
      lens: "crystal",
      label: "Object Only",
      description:
        "Object View active · gold crown · bridge girdle · sapphire pavilion"
    }),

    memory: Object.freeze({
      view: "object",
      lens: "crystal",
      label: "World Memory",
      description:
        "World Memory active · physical object with restrained internal pressure"
    }),

    behind: Object.freeze({
      view: "lattice",
      lens: "lattice",
      label: "Lattice Behind",
      description:
        "Lattice Behind active · transparent shell with major structural proof"
    }),

    through: Object.freeze({
      view: "lattice",
      lens: "lattice",
      label: "Lattice Through",
      description:
        "Lattice Through active · 256-seat internal structure visible"
    }),

    full: Object.freeze({
      view: "lattice",
      lens: "lattice",
      label: "Full Proof",
      description:
        "Full Proof active · complete 16 × 16 / 256-seat geometry"
    })
  });

  const INITIAL = Object.freeze({
    yaw: -0.58,
    pitch: -0.18,
    distance: 3.85,
    target: Object.freeze([0, -0.12, 0]),
    pitchMinimum: -0.78,
    pitchMaximum: 0.52,
    distanceMinimum: 2.75,
    distanceMaximum: 5.40,
    fieldOfViewDegrees: 32,
    idleRotationRadiansPerSecond: 0.075,
    idleDelayMilliseconds: 2500,
    dragYawScale: 0.0082,
    dragPitchScale: 0.0060,
    wheelScale: 0.0022,
    inertiaDamping: 0.90,
    clickMovementThreshold: 7,
    clickDurationThreshold: 460,
    doubleTapThreshold: 320,
    shadowGroundY: -1.31,
    shadowLayers: 13
  });

  const state = {
    geometry: null,
    validation: null,

    stage: null,
    canvas: null,
    fallback: null,
    gl: null,

    programs: null,
    buffers: null,
    locations: null,

    resizeObserver: null,
    intersectionObserver: null,
    abortController:
      typeof AbortController !== "undefined"
        ? new AbortController()
        : null,

    width: 0,
    height: 0,
    cssWidth: 0,
    cssHeight: 0,
    dpr: 1,

    modelMatrix: new Float32Array(16),
    viewMatrix: new Float32Array(16),
    projectionMatrix: new Float32Array(16),
    projectionViewMatrix: new Float32Array(16),
    inverseProjectionViewMatrix: new Float32Array(16),

    yaw: INITIAL.yaw,
    pitch: INITIAL.pitch,
    distance: INITIAL.distance,
    velocityYaw: 0,
    velocityPitch: 0,

    lens: "crystal",
    dimension: "object",
    view: "object",
    autoRotate: true,

    selectedFacetIndex: -1,
    selectedFacetId: null,

    pointers: new Map(),
    primaryPointerId: null,
    pointerDownTime: 0,
    pointerStartX: 0,
    pointerStartY: 0,
    pointerMoved: false,
    lastPinchDistance: 0,
    lastTapTime: 0,
    lastInteractionTime: now(),

    running: false,
    initialized: false,
    ready: false,
    disposed: false,
    contextLost: false,
    visibleInViewport: true,
    documentVisible: !doc.hidden,

    raf: 0,
    lastFrameTime: 0,
    renderCount: 0,
    resizeCount: 0,
    selectionCount: 0,
    contextLossCount: 0,
    errors: [],

    selectedNodePositions: new Float32Array(0),
    shadowVertexCount: 0,
    lastPublishedSignature: ""
  };

  const signal = state.abortController
    ? state.abortController.signal
    : undefined;

  if (
    root.__SHOWROOM_DIAMOND_G3_RENDERER_CONTROLLER__ &&
    typeof root.__SHOWROOM_DIAMOND_G3_RENDERER_CONTROLLER__.dispose === "function"
  ) {
    try {
      root.__SHOWROOM_DIAMOND_G3_RENDERER_CONTROLLER__.dispose();
    } catch (_error) {}
  }

  if (
    root.__SHOWROOM_DIAMOND_G2_RENDERER_CONTROLLER__ &&
    typeof root.__SHOWROOM_DIAMOND_G2_RENDERER_CONTROLLER__.stop === "function"
  ) {
    try {
      root.__SHOWROOM_DIAMOND_G2_RENDERER_CONTROLLER__.stop();
    } catch (_error) {}
  }

  const reducedMotion =
    typeof root.matchMedia === "function"
      ? root.matchMedia("(prefers-reduced-motion: reduce)")
      : {
          matches: false,
          addEventListener() {},
          removeEventListener() {}
        };

  const mobileQuery =
    typeof root.matchMedia === "function"
      ? root.matchMedia("(max-width: 760px), (pointer: coarse)")
      : { matches: false };

  function now() {
    return (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
        ? performance.now()
        : Date.now()
    );
  }

  function clamp(value, minimum, maximum) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(
        maximum,
        number
      )
    );
  }

  function query(selector, within) {
    const owner = within || doc;

    try {
      return owner.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function setDataset(name, value) {
    const text = String(value);

    try {
      doc.documentElement.dataset[name] = text;

      if (doc.body) {
        doc.body.dataset[name] = text;
      }
    } catch (_error) {}
  }

  function dispatch(name, detail) {
    try {
      root.dispatchEvent(
        new CustomEvent(name, {
          detail
        })
      );
    } catch (_error) {}
  }

  function recordError(scope, error) {
    const message =
      error && error.message
        ? error.message
        : String(error || scope);

    state.errors.push(
      Object.freeze({
        scope,
        message,
        time: new Date().toISOString()
      })
    );

    setDataset(
      "showroomDiamondG3Error",
      message
    );

    publishState(
      `error:${scope}`,
      true
    );
  }

  function setFallbackVisible(visible, reason) {
    if (state.stage) {
      state.stage.dataset.webglState = visible
        ? "failed"
        : "ready";

      state.stage.dataset.diamondFallbackReason =
        reason || "none";
    }

    if (state.canvas) {
      state.canvas.hidden = Boolean(visible);
    }

    if (state.fallback) {
      state.fallback.hidden = !visible;
    }

    if (visible) {
      dispatch(
        EVENT_FALLBACK,
        Object.freeze({
          contract: CONTRACT,
          route: ROUTE,
          reason: reason || "renderer-unavailable",
          status: status()
        })
      );
    }
  }

  function status() {
    const geometryReceipt =
      state.geometry &&
      typeof state.geometry.getReceipt === "function"
        ? state.geometry.getReceipt()
        : null;

    return Object.freeze({
      contract: CONTRACT,
      geometryContract: GEOMETRY_CONTRACT,
      previousRenderer: PREVIOUS_RENDERER,
      contractFamily: CONTRACT_FAMILY,
      route: ROUTE,
      file: FILE,
      role: "diamond_renderer",
      generation: "G3",

      activeLens: state.lens,
      activeDimension: state.dimension,
      activeView: state.view,
      autoRotate: state.autoRotate,

      yaw: state.yaw,
      pitch: state.pitch,
      distance: state.distance,

      selectedFacetIndex: state.selectedFacetIndex,
      selectedFacetId: state.selectedFacetId,

      geometryReady: Boolean(state.geometry),
      geometryReceipt,
      radialCount: geometryReceipt
        ? geometryReceipt.radialCount
        : 0,
      bandCount: geometryReceipt
        ? geometryReceipt.bandCount
        : 0,
      seatCount: geometryReceipt
        ? geometryReceipt.seatCount
        : 0,
      surfaceTriangleCount: geometryReceipt
        ? geometryReceipt.surfaceTriangleCount
        : 0,
      latticeEdgeCount: geometryReceipt
        ? geometryReceipt.latticeEdgeCount
        : 0,

      canvasReady: Boolean(state.canvas),
      webglReady: Boolean(state.gl),
      initialized: state.initialized,
      ready: state.ready,
      running: state.running,
      disposed: state.disposed,
      contextLost: state.contextLost,
      visibleInViewport: state.visibleInViewport,
      documentVisible: state.documentVisible,

      viewport: Object.freeze({
        width: state.width,
        height: state.height,
        cssWidth: state.cssWidth,
        cssHeight: state.cssHeight,
        dpr: state.dpr
      }),

      renderCount: state.renderCount,
      resizeCount: state.resizeCount,
      selectionCount: state.selectionCount,
      contextLossCount: state.contextLossCount,

      generatedImage: false,
      graphicBox: false,
      externalThreeLibrary: false,
      nativeWebGL: true,
      ownsGeometry: false,
      ownsUI: false,
      ownsMapPortal: false,

      errors: state.errors.slice()
    });
  }

  function publishState(scope, force) {
    const snapshot = status();

    const signature = JSON.stringify({
      scope,
      ready: snapshot.ready,
      running: snapshot.running,
      activeLens: snapshot.activeLens,
      activeDimension: snapshot.activeDimension,
      activeView: snapshot.activeView,
      autoRotate: snapshot.autoRotate,
      selectedFacetIndex: snapshot.selectedFacetIndex,
      contextLost: snapshot.contextLost,
      errorCount: snapshot.errors.length
    });

    if (!force && signature === state.lastPublishedSignature) {
      return snapshot;
    }

    state.lastPublishedSignature = signature;

    const payload = Object.freeze({
      ...snapshot,
      scope,
      time: new Date().toISOString()
    });

    root.SHOWROOM_DIAMOND_G3_RENDERER_RECEIPT = payload;
    root.DGB_SHOWROOM_DIAMOND_G3_STATUS = payload;

    setDataset(
      "showroomDiamondG3RendererContract",
      CONTRACT
    );

    setDataset(
      "showroomDiamondG3RendererActive",
      state.ready
    );

    setDataset(
      "showroomDiamondG3View",
      state.view
    );

    setDataset(
      "showroomDiamondG3Lens",
      state.lens
    );

    setDataset(
      "showroomDiamondG3Dimension",
      state.dimension
    );

    setDataset(
      "showroomDiamondG3SelectedFacet",
      state.selectedFacetId || "none"
    );

    setDataset(
      "showroomDiamondG3GeneratedImage",
      "false"
    );

    setDataset(
      "showroomDiamondG3GraphicBox",
      "false"
    );

    dispatch(
      EVENT_STATE,
      payload
    );

    return payload;
  }

  function getReceipt() {
    const snapshot = status();

    return Object.freeze({
      contract: CONTRACT,
      geometryContract: GEOMETRY_CONTRACT,
      contractFamily: CONTRACT_FAMILY,
      route: ROUTE,
      file: FILE,
      generation: "G3",
      status:
        state.ready &&
        !state.contextLost &&
        state.errors.length === 0
          ? "READY"
          : state.contextLost
            ? "CONTEXT_LOST"
            : state.errors.length
              ? "ERROR"
              : "HELD",
      geometryHash:
        snapshot.geometryReceipt &&
        snapshot.geometryReceipt.geometryHash
          ? snapshot.geometryReceipt.geometryHash
          : null,
      radialCount: snapshot.radialCount,
      bandCount: snapshot.bandCount,
      seatCount: snapshot.seatCount,
      surfaceTriangleCount: snapshot.surfaceTriangleCount,
      latticeEdgeCount: snapshot.latticeEdgeCount,
      renderCount: snapshot.renderCount,
      selectionCount: snapshot.selectionCount,
      nativeWebGL: true,
      externalThreeLibrary: false,
      generatedImage: false,
      graphicBox: false,
      ownsGeometry: false,
      ownsUI: false,
      ownsMapPortal: false
    });
  }

  function createMat4() {
    return new Float32Array(16);
  }

  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }

  function multiply(out, a, b) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];

    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];

    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];

    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];

    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    return out;
  }

  function perspective(out, fieldOfView, aspect, near, far) {
    const f = 1 / Math.tan(fieldOfView / 2);
    const inverseRange = 1 / (near - far);

    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * inverseRange;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * inverseRange;
    out[15] = 0;

    return out;
  }

  function subtractVector(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function crossVector(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function dotVector(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function normalizeVector(vector) {
    const length = Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    ) || 1;

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function lookAt(out, eye, target, up) {
    const z = normalizeVector(
      subtractVector(
        eye,
        target
      )
    );

    const x = normalizeVector(
      crossVector(
        up,
        z
      )
    );

    const y = crossVector(
      z,
      x
    );

    out[0] = x[0];
    out[1] = y[0];
    out[2] = z[0];
    out[3] = 0;
    out[4] = x[1];
    out[5] = y[1];
    out[6] = z[1];
    out[7] = 0;
    out[8] = x[2];
    out[9] = y[2];
    out[10] = z[2];
    out[11] = 0;
    out[12] = -dotVector(x, eye);
    out[13] = -dotVector(y, eye);
    out[14] = -dotVector(z, eye);
    out[15] = 1;

    return out;
  }

  function fromYawPitch(out, yaw, pitch) {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cx = Math.cos(pitch);
    const sx = Math.sin(pitch);

    // Column-major RY(yaw) * RX(pitch).
    out[0] = cy;
    out[1] = 0;
    out[2] = -sy;
    out[3] = 0;

    out[4] = sy * sx;
    out[5] = cx;
    out[6] = cy * sx;
    out[7] = 0;

    out[8] = sy * cx;
    out[9] = -sx;
    out[10] = cy * cx;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  function invert(out, a) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    let determinant =
      b00 * b11 -
      b01 * b10 +
      b02 * b09 +
      b03 * b08 -
      b04 * b07 +
      b05 * b06;

    if (!determinant) {
      return null;
    }

    determinant = 1 / determinant;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * determinant;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * determinant;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * determinant;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * determinant;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * determinant;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * determinant;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * determinant;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * determinant;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * determinant;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * determinant;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * determinant;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * determinant;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * determinant;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * determinant;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * determinant;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * determinant;

    return out;
  }

  function transformPoint(matrix, point) {
    const x = point[0];
    const y = point[1];
    const z = point[2];

    const w =
      matrix[3] * x +
      matrix[7] * y +
      matrix[11] * z +
      matrix[15];

    const inverseW = w && w !== 1
      ? 1 / w
      : 1;

    return [
      (
        matrix[0] * x +
        matrix[4] * y +
        matrix[8] * z +
        matrix[12]
      ) * inverseW,

      (
        matrix[1] * x +
        matrix[5] * y +
        matrix[9] * z +
        matrix[13]
      ) * inverseW,

      (
        matrix[2] * x +
        matrix[6] * y +
        matrix[10] * z +
        matrix[14]
      ) * inverseW
    ];
  }

  function transformPoint4(matrix, point) {
    const x = point[0];
    const y = point[1];
    const z = point[2];
    const w = point[3];

    return [
      matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w,
      matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w,
      matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w,
      matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w
    ];
  }

  function unproject(ndcX, ndcY, ndcZ) {
    const result = transformPoint4(
      state.inverseProjectionViewMatrix,
      [ndcX, ndcY, ndcZ, 1]
    );

    const inverseW = result[3]
      ? 1 / result[3]
      : 1;

    return [
      result[0] * inverseW,
      result[1] * inverseW,
      result[2] * inverseW
    ];
  }

  function compileShader(type, source) {
    const gl = state.gl;
    const shader = gl.createShader(type);

    if (!shader) {
      throw new Error("Unable to create WebGL shader.");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message =
        gl.getShaderInfoLog(shader) ||
        "Shader compilation failed.";

      gl.deleteShader(shader);
      throw new Error(message);
    }

    return shader;
  }

  function createProgram(vertexSource, fragmentSource) {
    const gl = state.gl;
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();

    if (!program) {
      throw new Error("Unable to create WebGL program.");
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message =
        gl.getProgramInfoLog(program) ||
        "Program linking failed.";

      gl.deleteProgram(program);
      throw new Error(message);
    }

    return program;
  }

  const SURFACE_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute float aMaterialRegion;
    attribute float aFacetIndex;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    varying vec3 vLocalPosition;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vMaterialRegion;
    varying float vFacetIndex;

    void main(void) {
      vLocalPosition = aPosition;

      vec4 worldPosition =
        uModel *
        vec4(aPosition, 1.0);

      vWorldPosition = worldPosition.xyz;
      vNormal = normalize(mat3(uModel) * aNormal);
      vMaterialRegion = aMaterialRegion;
      vFacetIndex = aFacetIndex;

      gl_Position =
        uProjection *
        uView *
        worldPosition;
    }
  `;

  const SURFACE_FRAGMENT_SHADER = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    varying vec3 vLocalPosition;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vMaterialRegion;
    varying float vFacetIndex;

    uniform vec3 uCameraPosition;
    uniform vec3 uWarmKeyPosition;
    uniform vec3 uCoolFillPosition;
    uniform vec3 uRearRimPosition;
    uniform float uSurfaceOpacity;
    uniform float uModeMix;
    uniform float uSelectedFacet;

    void materialParameters(
      float id,
      out vec3 baseColor,
      out vec3 secondaryColor,
      out vec3 emissiveColor,
      out float emissiveStrength,
      out float metallic,
      out float roughness
    ) {
      if (id < 0.5) {
        baseColor = vec3(0.94, 0.72, 0.30);
        secondaryColor = vec3(1.00, 0.91, 0.66);
        emissiveColor = vec3(0.20, 0.10, 0.02);
        emissiveStrength = 0.06;
        metallic = 0.78;
        roughness = 0.18;
      } else if (id < 1.5) {
        baseColor = vec3(0.94, 0.60, 0.16);
        secondaryColor = vec3(1.00, 0.82, 0.42);
        emissiveColor = vec3(0.18, 0.07, 0.01);
        emissiveStrength = 0.05;
        metallic = 0.82;
        roughness = 0.22;
      } else if (id < 2.5) {
        baseColor = vec3(0.78, 0.39, 0.07);
        secondaryColor = vec3(0.98, 0.67, 0.19);
        emissiveColor = vec3(0.14, 0.04, 0.00);
        emissiveStrength = 0.04;
        metallic = 0.86;
        roughness = 0.25;
      } else if (id < 3.5) {
        baseColor = vec3(0.52, 0.23, 0.035);
        secondaryColor = vec3(0.83, 0.43, 0.10);
        emissiveColor = vec3(0.10, 0.025, 0.00);
        emissiveStrength = 0.03;
        metallic = 0.88;
        roughness = 0.28;
      } else if (id < 4.5) {
        baseColor = vec3(0.45, 0.86, 1.00);
        secondaryColor = vec3(0.93, 0.98, 1.00);
        emissiveColor = vec3(0.18, 0.66, 0.95);
        emissiveStrength = 0.34;
        metallic = 0.34;
        roughness = 0.14;
      } else if (id < 5.5) {
        baseColor = vec3(0.72, 0.94, 1.00);
        secondaryColor = vec3(1.00, 0.89, 0.55);
        emissiveColor = vec3(0.42, 0.88, 1.00);
        emissiveStrength = 0.62;
        metallic = 0.26;
        roughness = 0.10;
      } else if (id < 6.5) {
        baseColor = vec3(0.12, 0.43, 0.94);
        secondaryColor = vec3(0.32, 0.72, 1.00);
        emissiveColor = vec3(0.02, 0.12, 0.35);
        emissiveStrength = 0.08;
        metallic = 0.44;
        roughness = 0.18;
      } else if (id < 7.5) {
        baseColor = vec3(0.035, 0.18, 0.66);
        secondaryColor = vec3(0.10, 0.43, 0.96);
        emissiveColor = vec3(0.01, 0.06, 0.24);
        emissiveStrength = 0.06;
        metallic = 0.48;
        roughness = 0.20;
      } else if (id < 8.5) {
        baseColor = vec3(0.02, 0.075, 0.36);
        secondaryColor = vec3(0.06, 0.22, 0.70);
        emissiveColor = vec3(0.005, 0.025, 0.14);
        emissiveStrength = 0.05;
        metallic = 0.52;
        roughness = 0.23;
      } else if (id < 9.5) {
        baseColor = vec3(0.008, 0.025, 0.16);
        secondaryColor = vec3(0.035, 0.10, 0.43);
        emissiveColor = vec3(0.002, 0.01, 0.07);
        emissiveStrength = 0.04;
        metallic = 0.56;
        roughness = 0.26;
      } else {
        baseColor = vec3(0.015, 0.03, 0.12);
        secondaryColor = vec3(0.08, 0.16, 0.44);
        emissiveColor = vec3(0.01, 0.025, 0.10);
        emissiveStrength = 0.05;
        metallic = 0.58;
        roughness = 0.24;
      }
    }

    vec3 lightContribution(
      vec3 normal,
      vec3 worldPosition,
      vec3 lightPosition,
      vec3 lightColor,
      float strength
    ) {
      vec3 direction = normalize(lightPosition - worldPosition);
      float diffuse = max(dot(normal, direction), 0.0);
      return lightColor * diffuse * strength;
    }

    void main(void) {
      vec3 normal = normalize(vNormal);

      if (!gl_FrontFacing) {
        normal = -normal;
      }

      vec3 viewDirection = normalize(uCameraPosition - vWorldPosition);

      vec3 baseColor;
      vec3 secondaryColor;
      vec3 emissiveColor;
      float emissiveStrength;
      float metallic;
      float roughness;

      materialParameters(
        vMaterialRegion,
        baseColor,
        secondaryColor,
        emissiveColor,
        emissiveStrength,
        metallic,
        roughness
      );

      float facing = clamp(dot(normal, viewDirection), 0.0, 1.0);
      float visibilityFloor = 0.24 + facing * 0.16;
      float fresnel = pow(1.0 - facing, 2.15);

      vec3 warm = lightContribution(
        normal,
        vWorldPosition,
        uWarmKeyPosition,
        vec3(1.00, 0.76, 0.40),
        0.78
      );

      vec3 cool = lightContribution(
        normal,
        vWorldPosition,
        uCoolFillPosition,
        vec3(0.28, 0.68, 1.00),
        0.56
      );

      vec3 rim = lightContribution(
        normal,
        vWorldPosition,
        uRearRimPosition,
        vec3(0.42, 0.34, 1.00),
        0.52
      );

      vec3 cameraFill =
        vec3(0.84, 0.88, 1.00) *
        (0.13 + facing * 0.17);

      vec3 keyDirection = normalize(uWarmKeyPosition - vWorldPosition);
      vec3 halfVector = normalize(keyDirection + viewDirection);

      float specularPower = mix(18.0, 82.0, 1.0 - roughness);
      float specular = pow(max(dot(normal, halfVector), 0.0), specularPower);

      float upperField = clamp(vLocalPosition.y + 0.15, 0.0, 1.0);
      float lowerField = clamp(-vLocalPosition.y + 0.05, 0.0, 1.0);
      float facetVariation = 0.90 + 0.10 * sin(vFacetIndex * 1.6180339);

      vec3 litBase =
        baseColor *
        (visibilityFloor + warm + cool + rim + cameraFill);

      litBase = mix(
        litBase,
        secondaryColor * (0.36 + warm + cool * 0.4),
        fresnel * (0.24 + metallic * 0.20)
      );

      litBase *= facetVariation;

      vec3 emission = emissiveColor * emissiveStrength;

      float girdleMask =
        step(3.5, vMaterialRegion) *
        (1.0 - step(5.5, vMaterialRegion));

      emission +=
        vec3(0.28, 0.76, 1.00) *
        girdleMask *
        (0.14 + fresnel * 0.36);

      vec3 crownAccent =
        vec3(1.00, 0.72, 0.26) *
        upperField *
        0.055;

      vec3 pavilionAccent =
        vec3(0.12, 0.42, 1.00) *
        lowerField *
        0.070;

      vec3 color =
        litBase +
        emission +
        crownAccent +
        pavilionAccent +
        secondaryColor * specular * (0.28 + metallic * 0.42);

      float selected =
        1.0 -
        step(0.45, abs(vFacetIndex - uSelectedFacet));

      color = mix(
        color,
        color + vec3(0.82, 0.94, 1.00) * 0.72,
        selected
      );

      color +=
        vec3(0.16, 0.48, 1.00) *
        fresnel *
        (0.10 + uModeMix * 0.14);

      color = color / (vec3(1.0) + color * 0.34);
      color = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));

      float alpha = uSurfaceOpacity;
      alpha = mix(alpha, min(1.0, alpha + 0.18), selected);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const LATTICE_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute float aEdgeClass;
    attribute float aColorClass;
    attribute float aOpacityClass;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    varying float vEdgeClass;
    varying float vColorClass;
    varying float vOpacityClass;

    void main(void) {
      vEdgeClass = aEdgeClass;
      vColorClass = aColorClass;
      vOpacityClass = aOpacityClass;

      gl_Position =
        uProjection *
        uView *
        uModel *
        vec4(aPosition, 1.0);
    }
  `;

  const LATTICE_FRAGMENT_SHADER = `
    precision mediump float;

    varying float vEdgeClass;
    varying float vColorClass;
    varying float vOpacityClass;

    uniform float uAlphaScale;
    uniform float uGirdleOnly;

    void main(void) {
      vec3 gold = vec3(1.00, 0.68, 0.20);
      vec3 cyan = vec3(0.35, 0.88, 1.00);

      vec3 color = mix(
        gold,
        cyan,
        step(0.5, vColorClass)
      );

      float opacity = 0.18;

      if (vOpacityClass < 0.5) {
        opacity = 0.92;
      } else if (vOpacityClass < 1.5) {
        opacity = 0.48;
      } else {
        opacity = 0.20;
      }

      float edgeBoost =
        vEdgeClass > 2.5
          ? 1.12
          : 1.0;

      opacity *= edgeBoost;

      if (uGirdleOnly > 0.5) {
        color = vec3(0.58, 0.94, 1.00);
        opacity = 0.72;
      }

      gl_FragColor = vec4(
        color,
        opacity * uAlphaScale
      );
    }
  `;

  const NODE_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute float aMajor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform float uPointScale;

    varying float vMajor;

    void main(void) {
      vMajor = aMajor;

      gl_Position =
        uProjection *
        uView *
        uModel *
        vec4(aPosition, 1.0);

      gl_PointSize =
        (aMajor > 0.5 ? 5.5 : 3.2) *
        uPointScale;
    }
  `;

  const NODE_FRAGMENT_SHADER = `
    precision mediump float;

    varying float vMajor;

    uniform vec3 uNodeColor;
    uniform float uNodeAlpha;

    void main(void) {
      vec2 coordinate = gl_PointCoord * 2.0 - 1.0;
      float radius = dot(coordinate, coordinate);

      if (radius > 1.0) {
        discard;
      }

      float edge = smoothstep(1.0, 0.58, radius);
      float core = smoothstep(0.54, 0.0, radius);

      vec3 color =
        mix(
          uNodeColor * 0.58,
          vec3(0.94, 0.99, 1.00),
          core
        );

      float alpha =
        (0.34 + edge * 0.66) *
        uNodeAlpha *
        (vMajor > 0.5 ? 1.0 : 0.58);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const SHADOW_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute float aAlpha;

    uniform mat4 uView;
    uniform mat4 uProjection;

    varying float vAlpha;

    void main(void) {
      vAlpha = aAlpha;

      gl_Position =
        uProjection *
        uView *
        vec4(aPosition, 1.0);
    }
  `;

  const SHADOW_FRAGMENT_SHADER = `
    precision mediump float;

    varying float vAlpha;

    void main(void) {
      gl_FragColor = vec4(
        0.005,
        0.008,
        0.020,
        vAlpha
      );
    }
  `;

  function createBuffer(target, data, usage) {
    const gl = state.gl;
    const buffer = gl.createBuffer();

    if (!buffer) {
      throw new Error("Unable to create WebGL buffer.");
    }

    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage || gl.STATIC_DRAW);

    return buffer;
  }

  function bindFloatAttribute(buffer, location, size) {
    const gl = state.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function bindUnsignedByteAttribute(buffer, location) {
    const gl = state.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      1,
      gl.UNSIGNED_BYTE,
      false,
      0,
      0
    );
  }

  function bindUnsignedShortAttribute(buffer, location) {
    const gl = state.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      1,
      gl.UNSIGNED_SHORT,
      false,
      0,
      0
    );
  }

  function locateGeometry() {
    const geometry = root.DGBShowroomDiamondGeometryG3;

    if (!geometry) {
      return null;
    }

    if (geometry.contract !== GEOMETRY_CONTRACT) {
      throw new Error(
        `Geometry contract mismatch. Expected ${GEOMETRY_CONTRACT}, received ${geometry.contract || "unknown"}.`
      );
    }

    if (typeof geometry.validate !== "function") {
      throw new Error("Geometry authority does not expose validate().");
    }

    const validation = geometry.validate();

    if (!validation || !validation.passed) {
      throw new Error(
        "Geometry authority validation did not pass."
      );
    }

    state.validation = validation;
    return geometry;
  }

  function ensureStageAndCanvas() {
    state.stage = query(STAGE_SELECTOR);

    if (!state.stage) {
      throw new Error(
        `Missing ${STAGE_SELECTOR}.`
      );
    }

    state.fallback = query(
      FALLBACK_SELECTOR,
      state.stage
    );

    let canvas = query(
      CANVAS_SELECTOR,
      state.stage
    );

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.setAttribute(
        "data-showroom-diamond-canvas",
        ""
      );
      canvas.setAttribute(
        "aria-hidden",
        "true"
      );
      state.stage.appendChild(canvas);
    }

    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      background: "transparent",
      touchAction: "none"
    });

    canvas.setAttribute(
      "data-showroom-diamond-g3-renderer",
      CONTRACT
    );

    canvas.setAttribute(
      "data-showroom-diamond-geometry",
      GEOMETRY_CONTRACT
    );

    canvas.setAttribute(
      "data-render-mode",
      "native-webgl"
    );

    canvas.setAttribute(
      "data-object-view",
      "true"
    );

    canvas.setAttribute(
      "data-lattice-view",
      "true"
    );

    canvas.setAttribute(
      "data-old-2d-geometry-retired",
      "true"
    );

    state.stage.style.touchAction = "none";
    state.stage.dataset.diamondGeneration = "G3";
    state.stage.dataset.diamondRenderMode = "native-webgl";
    state.stage.dataset.webglState = "loading";

    state.canvas = canvas;
  }

  function createContext() {
    const options = {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance"
    };

    state.gl =
      state.canvas.getContext("webgl", options) ||
      state.canvas.getContext("experimental-webgl", options);

    if (!state.gl) {
      throw new Error("Native WebGL is unavailable.");
    }

    state.gl.clearColor(0, 0, 0, 0);
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.depthFunc(state.gl.LEQUAL);
    state.gl.enable(state.gl.BLEND);
    state.gl.blendFunc(
      state.gl.SRC_ALPHA,
      state.gl.ONE_MINUS_SRC_ALPHA
    );
  }

  function buildGirdleLineData() {
    const positions = [];
    const edgeClasses = [];
    const colorClasses = [];
    const opacityClasses = [];

    for (
      let radial = 0;
      radial < state.geometry.radialCount;
      radial += 1
    ) {
      const next =
        (radial + 1) %
        state.geometry.radialCount;

      const a = state.geometry.getSeat(
        `DG3-B7-R${radial}`
      );

      const b = state.geometry.getSeat(
        `DG3-B7-R${next}`
      );

      if (!a || !b) {
        continue;
      }

      positions.push(
        ...a.surfacePosition,
        ...b.surfacePosition
      );

      edgeClasses.push(0, 0);
      colorClasses.push(1, 1);
      opacityClasses.push(0, 0);
    }

    return {
      positions: new Float32Array(positions),
      edgeClasses: new Uint8Array(edgeClasses),
      colorClasses: new Uint8Array(colorClasses),
      opacityClasses: new Uint8Array(opacityClasses),
      vertexCount: positions.length / 3
    };
  }

  function buildMajorNodeData() {
    const positions = [];
    const major = [];

    for (const seat of state.geometry.seats) {
      if (!seat.major) {
        continue;
      }

      positions.push(...seat.latticePosition);
      major.push(1);
    }

    return {
      positions: new Float32Array(positions),
      major: new Uint8Array(major),
      vertexCount: positions.length / 3
    };
  }

  function createProgramsAndBuffers() {
    const gl = state.gl;
    const geometry = state.geometry;

    const surfaceProgram = createProgram(
      SURFACE_VERTEX_SHADER,
      SURFACE_FRAGMENT_SHADER
    );

    const latticeProgram = createProgram(
      LATTICE_VERTEX_SHADER,
      LATTICE_FRAGMENT_SHADER
    );

    const nodeProgram = createProgram(
      NODE_VERTEX_SHADER,
      NODE_FRAGMENT_SHADER
    );

    const shadowProgram = createProgram(
      SHADOW_VERTEX_SHADER,
      SHADOW_FRAGMENT_SHADER
    );

    state.programs = {
      surface: surfaceProgram,
      lattice: latticeProgram,
      node: nodeProgram,
      shadow: shadowProgram
    };

    const girdle = buildGirdleLineData();
    const majorNodes = buildMajorNodeData();

    state.buffers = {
      surfacePosition: createBuffer(
        gl.ARRAY_BUFFER,
        geometry.surfaceMesh.positions
      ),

      surfaceNormal: createBuffer(
        gl.ARRAY_BUFFER,
        geometry.surfaceMesh.normals
      ),

      surfaceMaterial: createBuffer(
        gl.ARRAY_BUFFER,
        geometry.surfaceMesh.materialRegionIndices
      ),

      surfaceFacet: createBuffer(
        gl.ARRAY_BUFFER,
        geometry.surfaceMesh.facetIndices
      ),

      latticePosition: createBuffer(
        gl.ARRAY_BUFFER,
        geometry.lattice.linePositions
      ),

      latticeEdgeClass: createBuffer(
        gl.ARRAY_BUFFER,
        geometry.lattice.lineEdgeClasses
      ),

      latticeColorClass: createBuffer(
        gl.ARRAY_BUFFER,
        geometry.lattice.lineColorClasses
      ),

      latticeOpacityClass: createBuffer(
        gl.ARRAY_BUFFER,
        geometry.lattice.lineOpacityClasses
      ),

      girdlePosition: createBuffer(
        gl.ARRAY_BUFFER,
        girdle.positions
      ),

      girdleEdgeClass: createBuffer(
        gl.ARRAY_BUFFER,
        girdle.edgeClasses
      ),

      girdleColorClass: createBuffer(
        gl.ARRAY_BUFFER,
        girdle.colorClasses
      ),

      girdleOpacityClass: createBuffer(
        gl.ARRAY_BUFFER,
        girdle.opacityClasses
      ),

      majorNodePosition: createBuffer(
        gl.ARRAY_BUFFER,
        majorNodes.positions
      ),

      majorNodeFlag: createBuffer(
        gl.ARRAY_BUFFER,
        majorNodes.major
      ),

      selectedNodePosition: gl.createBuffer(),
      selectedNodeFlag: gl.createBuffer(),
      shadowPosition: gl.createBuffer(),
      shadowAlpha: gl.createBuffer(),

      counts: Object.freeze({
        surface: geometry.surfaceMesh.vertexCount,
        lattice: geometry.lattice.lineVertexCount,
        girdle: girdle.vertexCount,
        majorNodes: majorNodes.vertexCount
      })
    };

    if (
      !state.buffers.selectedNodePosition ||
      !state.buffers.selectedNodeFlag ||
      !state.buffers.shadowPosition ||
      !state.buffers.shadowAlpha
    ) {
      throw new Error(
        "Unable to allocate dynamic WebGL buffers."
      );
    }

    state.locations = {
      surface: {
        position: gl.getAttribLocation(
          surfaceProgram,
          "aPosition"
        ),
        normal: gl.getAttribLocation(
          surfaceProgram,
          "aNormal"
        ),
        material: gl.getAttribLocation(
          surfaceProgram,
          "aMaterialRegion"
        ),
        facet: gl.getAttribLocation(
          surfaceProgram,
          "aFacetIndex"
        ),
        model: gl.getUniformLocation(
          surfaceProgram,
          "uModel"
        ),
        view: gl.getUniformLocation(
          surfaceProgram,
          "uView"
        ),
        projection: gl.getUniformLocation(
          surfaceProgram,
          "uProjection"
        ),
        camera: gl.getUniformLocation(
          surfaceProgram,
          "uCameraPosition"
        ),
        warmKey: gl.getUniformLocation(
          surfaceProgram,
          "uWarmKeyPosition"
        ),
        coolFill: gl.getUniformLocation(
          surfaceProgram,
          "uCoolFillPosition"
        ),
        rearRim: gl.getUniformLocation(
          surfaceProgram,
          "uRearRimPosition"
        ),
        surfaceOpacity: gl.getUniformLocation(
          surfaceProgram,
          "uSurfaceOpacity"
        ),
        modeMix: gl.getUniformLocation(
          surfaceProgram,
          "uModeMix"
        ),
        selectedFacet: gl.getUniformLocation(
          surfaceProgram,
          "uSelectedFacet"
        )
      },

      lattice: {
        position: gl.getAttribLocation(
          latticeProgram,
          "aPosition"
        ),
        edgeClass: gl.getAttribLocation(
          latticeProgram,
          "aEdgeClass"
        ),
        colorClass: gl.getAttribLocation(
          latticeProgram,
          "aColorClass"
        ),
        opacityClass: gl.getAttribLocation(
          latticeProgram,
          "aOpacityClass"
        ),
        model: gl.getUniformLocation(
          latticeProgram,
          "uModel"
        ),
        view: gl.getUniformLocation(
          latticeProgram,
          "uView"
        ),
        projection: gl.getUniformLocation(
          latticeProgram,
          "uProjection"
        ),
        alphaScale: gl.getUniformLocation(
          latticeProgram,
          "uAlphaScale"
        ),
        girdleOnly: gl.getUniformLocation(
          latticeProgram,
          "uGirdleOnly"
        )
      },

      node: {
        position: gl.getAttribLocation(
          nodeProgram,
          "aPosition"
        ),
        major: gl.getAttribLocation(
          nodeProgram,
          "aMajor"
        ),
        model: gl.getUniformLocation(
          nodeProgram,
          "uModel"
        ),
        view: gl.getUniformLocation(
          nodeProgram,
          "uView"
        ),
        projection: gl.getUniformLocation(
          nodeProgram,
          "uProjection"
        ),
        pointScale: gl.getUniformLocation(
          nodeProgram,
          "uPointScale"
        ),
        nodeColor: gl.getUniformLocation(
          nodeProgram,
          "uNodeColor"
        ),
        nodeAlpha: gl.getUniformLocation(
          nodeProgram,
          "uNodeAlpha"
        )
      },

      shadow: {
        position: gl.getAttribLocation(
          shadowProgram,
          "aPosition"
        ),
        alpha: gl.getAttribLocation(
          shadowProgram,
          "aAlpha"
        ),
        view: gl.getUniformLocation(
          shadowProgram,
          "uView"
        ),
        projection: gl.getUniformLocation(
          shadowProgram,
          "uProjection"
        )
      }
    };
  }

  function resizeCanvas() {
    if (!state.canvas || !state.gl) {
      return;
    }

    const rectangle =
      state.canvas.getBoundingClientRect();

    const ratioCap = mobileQuery.matches
      ? 1.65
      : 2.0;

    const ratio = Math.max(
      1,
      Math.min(
        ratioCap,
        root.devicePixelRatio || 1
      )
    );

    const cssWidth = Math.max(
      1,
      rectangle.width ||
      state.stage.clientWidth ||
      640
    );

    const cssHeight = Math.max(
      1,
      rectangle.height ||
      state.stage.clientHeight ||
      640
    );

    const width = Math.max(
      1,
      Math.round(cssWidth * ratio)
    );

    const height = Math.max(
      1,
      Math.round(cssHeight * ratio)
    );

    if (
      state.canvas.width !== width ||
      state.canvas.height !== height
    ) {
      state.canvas.width = width;
      state.canvas.height = height;
      state.resizeCount += 1;
    }

    state.width = width;
    state.height = height;
    state.cssWidth = cssWidth;
    state.cssHeight = cssHeight;
    state.dpr = ratio;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );

    updateMatrices();
  }

  function updateMatrices() {
    const aspect =
      state.width /
      Math.max(state.height, 1);

    perspective(
      state.projectionMatrix,
      INITIAL.fieldOfViewDegrees * Math.PI / 180,
      aspect,
      0.10,
      30.0
    );

    const cameraPosition = [
      0,
      0.16,
      state.distance
    ];

    lookAt(
      state.viewMatrix,
      cameraPosition,
      INITIAL.target,
      [0, 1, 0]
    );

    fromYawPitch(
      state.modelMatrix,
      state.yaw,
      state.pitch
    );

    multiply(
      state.projectionViewMatrix,
      state.projectionMatrix,
      state.viewMatrix
    );

    invert(
      state.inverseProjectionViewMatrix,
      state.projectionViewMatrix
    );
  }

  function drawShadow() {
    const gl = state.gl;
    const shadow = buildShadowGeometry();

    if (!shadow.vertexCount) {
      return;
    }

    state.shadowVertexCount = shadow.vertexCount;

    gl.useProgram(state.programs.shadow);

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      state.buffers.shadowPosition
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      shadow.positions,
      gl.DYNAMIC_DRAW
    );

    gl.enableVertexAttribArray(
      state.locations.shadow.position
    );

    gl.vertexAttribPointer(
      state.locations.shadow.position,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      state.buffers.shadowAlpha
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      shadow.alphas,
      gl.DYNAMIC_DRAW
    );

    gl.enableVertexAttribArray(
      state.locations.shadow.alpha
    );

    gl.vertexAttribPointer(
      state.locations.shadow.alpha,
      1,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.uniformMatrix4fv(
      state.locations.shadow.view,
      false,
      state.viewMatrix
    );

    gl.uniformMatrix4fv(
      state.locations.shadow.projection,
      false,
      state.projectionMatrix
    );

    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      shadow.vertexCount
    );

    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
  }

  function drawSurface() {
    const gl = state.gl;
    const locations = state.locations.surface;

    gl.useProgram(state.programs.surface);

    bindFloatAttribute(
      state.buffers.surfacePosition,
      locations.position,
      3
    );

    bindFloatAttribute(
      state.buffers.surfaceNormal,
      locations.normal,
      3
    );

    bindUnsignedByteAttribute(
      state.buffers.surfaceMaterial,
      locations.material
    );

    bindUnsignedShortAttribute(
      state.buffers.surfaceFacet,
      locations.facet
    );

    gl.uniformMatrix4fv(
      locations.model,
      false,
      state.modelMatrix
    );

    gl.uniformMatrix4fv(
      locations.view,
      false,
      state.viewMatrix
    );

    gl.uniformMatrix4fv(
      locations.projection,
      false,
      state.projectionMatrix
    );

    gl.uniform3fv(
      locations.camera,
      [0, 0.16, state.distance]
    );

    gl.uniform3fv(
      locations.warmKey,
      [-2.8, 3.6, 4.2]
    );

    gl.uniform3fv(
      locations.coolFill,
      [3.0, 1.8, 2.6]
    );

    gl.uniform3fv(
      locations.rearRim,
      [0, 2.2, -4.0]
    );

    const latticeMode = state.view === "lattice";

    const opacity = latticeMode
      ? state.dimension === "full"
        ? 0.18
        : 0.25
      : 1.0;

    gl.uniform1f(
      locations.surfaceOpacity,
      opacity
    );

    gl.uniform1f(
      locations.modeMix,
      latticeMode ? 1 : 0
    );

    gl.uniform1f(
      locations.selectedFacet,
      state.selectedFacetIndex
    );

    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.depthMask(!latticeMode);

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      state.buffers.counts.surface
    );

    gl.depthMask(true);
  }

  function bindLatticeBuffers(
    position,
    edgeClass,
    colorClass,
    opacityClass
  ) {
    const locations = state.locations.lattice;

    bindFloatAttribute(
      position,
      locations.position,
      3
    );

    bindUnsignedByteAttribute(
      edgeClass,
      locations.edgeClass
    );

    bindUnsignedByteAttribute(
      colorClass,
      locations.colorClass
    );

    bindUnsignedByteAttribute(
      opacityClass,
      locations.opacityClass
    );
  }

  function setLatticeMatrices() {
    const gl = state.gl;
    const locations = state.locations.lattice;

    gl.uniformMatrix4fv(
      locations.model,
      false,
      state.modelMatrix
    );

    gl.uniformMatrix4fv(
      locations.view,
      false,
      state.viewMatrix
    );

    gl.uniformMatrix4fv(
      locations.projection,
      false,
      state.projectionMatrix
    );
  }

  function drawGirdleGlow() {
    const gl = state.gl;
    const locations = state.locations.lattice;

    gl.useProgram(state.programs.lattice);

    bindLatticeBuffers(
      state.buffers.girdlePosition,
      state.buffers.girdleEdgeClass,
      state.buffers.girdleColorClass,
      state.buffers.girdleOpacityClass
    );

    setLatticeMatrices();

    gl.uniform1f(
      locations.alphaScale,
      state.view === "lattice"
        ? 0.58
        : 0.42
    );

    gl.uniform1f(
      locations.girdleOnly,
      1
    );

    gl.depthMask(false);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE
    );

    gl.drawArrays(
      gl.LINES,
      0,
      state.buffers.counts.girdle
    );

    gl.depthMask(true);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );
  }

  function drawLattice() {
    if (state.view !== "lattice") {
      return;
    }

    const gl = state.gl;
    const locations = state.locations.lattice;

    gl.useProgram(state.programs.lattice);

    bindLatticeBuffers(
      state.buffers.latticePosition,
      state.buffers.latticeEdgeClass,
      state.buffers.latticeColorClass,
      state.buffers.latticeOpacityClass
    );

    setLatticeMatrices();

    const strength =
      state.dimension === "full"
        ? 0.92
        : state.dimension === "behind"
          ? 0.58
          : 0.76;

    gl.uniform1f(
      locations.alphaScale,
      strength
    );

    gl.uniform1f(
      locations.girdleOnly,
      0
    );

    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE
    );

    gl.drawArrays(
      gl.LINES,
      0,
      state.buffers.counts.lattice
    );

    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );
  }

  function drawNodeSet(
    positionBuffer,
    majorBuffer,
    count,
    color,
    alpha,
    pointScale
  ) {
    if (!count) {
      return;
    }

    const gl = state.gl;
    const locations = state.locations.node;

    gl.useProgram(state.programs.node);

    bindFloatAttribute(
      positionBuffer,
      locations.position,
      3
    );

    bindUnsignedByteAttribute(
      majorBuffer,
      locations.major
    );

    gl.uniformMatrix4fv(
      locations.model,
      false,
      state.modelMatrix
    );

    gl.uniformMatrix4fv(
      locations.view,
      false,
      state.viewMatrix
    );

    gl.uniformMatrix4fv(
      locations.projection,
      false,
      state.projectionMatrix
    );

    gl.uniform1f(
      locations.pointScale,
      pointScale
    );

    gl.uniform3fv(
      locations.nodeColor,
      color
    );

    gl.uniform1f(
      locations.nodeAlpha,
      alpha
    );

    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE
    );

    gl.drawArrays(
      gl.POINTS,
      0,
      count
    );

    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );
  }

  function drawNodes() {
    if (state.view === "lattice") {
      drawNodeSet(
        state.buffers.majorNodePosition,
        state.buffers.majorNodeFlag,
        state.buffers.counts.majorNodes,
        [0.52, 0.90, 1.00],
        state.dimension === "full"
          ? 0.76
          : 0.56,
        state.dpr
      );
    }

    if (state.selectedNodePositions.length) {
      const gl = state.gl;
      const count =
        state.selectedNodePositions.length /
        3;

      const flags = new Uint8Array(count);
      flags.fill(1);

      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        state.buffers.selectedNodePosition
      );

      gl.bufferData(
        gl.ARRAY_BUFFER,
        state.selectedNodePositions,
        gl.DYNAMIC_DRAW
      );

      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        state.buffers.selectedNodeFlag
      );

      gl.bufferData(
        gl.ARRAY_BUFFER,
        flags,
        gl.DYNAMIC_DRAW
      );

      drawNodeSet(
        state.buffers.selectedNodePosition,
        state.buffers.selectedNodeFlag,
        count,
        [1.00, 0.84, 0.32],
        1.0,
        state.dpr * 1.35
      );
    }
  }

  function renderScene() {
    if (
      !state.ready ||
      state.contextLost ||
      !state.gl
    ) {
      return false;
    }

    resizeCanvas();
    updateMatrices();

    const gl = state.gl;

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    drawShadow();
    drawSurface();
    drawGirdleGlow();
    drawLattice();
    drawNodes();

    state.renderCount += 1;
    return true;
  }

  function renderOnce() {
    return renderScene();
  }

  function frame(time) {
    if (!state.running || state.disposed) {
      state.raf = 0;
      return;
    }

    state.raf = root.requestAnimationFrame(frame);

    if (
      !state.visibleInViewport ||
      !state.documentVisible ||
      state.contextLost
    ) {
      state.lastFrameTime = time;
      return;
    }

    const previous = state.lastFrameTime || time;
    const deltaSeconds = Math.min(
      0.05,
      Math.max(
        0,
        (time - previous) / 1000
      )
    );

    state.lastFrameTime = time;

    const interacting = state.pointers.size > 0;

    if (!interacting) {
      state.yaw +=
        state.velocityYaw *
        deltaSeconds *
        60;

      state.pitch +=
        state.velocityPitch *
        deltaSeconds *
        60;

      const damping = Math.pow(
        INITIAL.inertiaDamping,
        deltaSeconds * 60
      );

      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00002) {
        state.velocityYaw = 0;
      }

      if (Math.abs(state.velocityPitch) < 0.00002) {
        state.velocityPitch = 0;
      }

      const idle =
        time -
        state.lastInteractionTime >=
        INITIAL.idleDelayMilliseconds;

      if (
        state.autoRotate &&
        idle &&
        !reducedMotion.matches
      ) {
        state.yaw +=
          INITIAL.idleRotationRadiansPerSecond *
          deltaSeconds;
      }
    }

    state.pitch = clamp(
      state.pitch,
      INITIAL.pitchMinimum,
      INITIAL.pitchMaximum
    );

    state.distance = clamp(
      state.distance,
      INITIAL.distanceMinimum,
      INITIAL.distanceMaximum
    );

    renderScene();
  }

  function start() {
    if (
      state.disposed ||
      state.contextLost ||
      !state.ready
    ) {
      return status();
    }

    if (!state.running) {
      state.running = true;
      state.lastFrameTime = 0;
      state.raf = root.requestAnimationFrame(frame);
      publishState("start", true);
    }

    return status();
  }

  function stop() {
    state.running = false;

    if (state.raf) {
      root.cancelAnimationFrame(state.raf);
      state.raf = 0;
    }

    publishState("stop", true);
    return status();
  }

  function setInteractionTime() {
    state.lastInteractionTime = now();
  }

  function setView(nextView) {
    state.view = nextView === "lattice"
      ? "lattice"
      : "object";

    state.lens = state.view === "lattice"
      ? "lattice"
      : "crystal";

    state.dimension = state.view === "lattice"
      ? "through"
      : "object";

    setInteractionTime();
    renderOnce();
    publishState("set-view", true);

    return status();
  }

  function setLens(nextLens) {
    state.lens = nextLens === "lattice"
      ? "lattice"
      : "crystal";

    state.view = state.lens === "lattice"
      ? "lattice"
      : "object";

    if (state.view === "lattice") {
      if (
        state.dimension === "object" ||
        state.dimension === "memory"
      ) {
        state.dimension = "through";
      }
    } else if (
      state.dimension === "behind" ||
      state.dimension === "through" ||
      state.dimension === "full"
    ) {
      state.dimension = "object";
    }

    setInteractionTime();
    renderOnce();
    publishState("set-lens", true);

    return status();
  }

  function setDimension(nextDimension) {
    const normalized =
      Object.prototype.hasOwnProperty.call(
        DIMENSIONS,
        nextDimension
      )
        ? nextDimension
        : "object";

    const definition = DIMENSIONS[normalized];

    state.dimension = normalized;
    state.view = definition.view;
    state.lens = definition.lens;

    setInteractionTime();
    renderOnce();
    publishState("set-dimension", true);

    return status();
  }

  function setAutoRotate(enabled) {
    state.autoRotate = Boolean(enabled);
    setInteractionTime();
    publishState("set-auto-rotate", true);
    return status();
  }

  function setZoom(distance) {
    state.distance = clamp(
      distance,
      INITIAL.distanceMinimum,
      INITIAL.distanceMaximum
    );

    setInteractionTime();
    renderOnce();
    publishState("set-zoom", true);

    return status();
  }

  function clearSelection() {
    state.selectedFacetIndex = -1;
    state.selectedFacetId = null;
    state.selectedNodePositions = new Float32Array(0);
  }

  function reset() {
    state.yaw = INITIAL.yaw;
    state.pitch = INITIAL.pitch;
    state.distance = INITIAL.distance;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.autoRotate = true;
    state.view = "object";
    state.lens = "crystal";
    state.dimension = "object";
    clearSelection();
    setInteractionTime();
    renderOnce();
    publishState("reset", true);
    return status();
  }

  function rayTriangleIntersection(origin, direction, a, b, c) {
    const edge1 = subtractVector(b, a);
    const edge2 = subtractVector(c, a);
    const pVector = crossVector(direction, edge2);
    const determinant = dotVector(edge1, pVector);

    if (Math.abs(determinant) < 1e-8) {
      return null;
    }

    const inverseDeterminant = 1 / determinant;
    const tVector = subtractVector(origin, a);
    const u = dotVector(tVector, pVector) * inverseDeterminant;

    if (u < 0 || u > 1) {
      return null;
    }

    const qVector = crossVector(tVector, edge1);
    const v = dotVector(direction, qVector) * inverseDeterminant;

    if (v < 0 || u + v > 1) {
      return null;
    }

    const distance = dotVector(edge2, qVector) * inverseDeterminant;

    if (distance <= 1e-7) {
      return null;
    }

    return {
      distance,
      u,
      v
    };
  }

  function surfacePositionForSource(sourceId) {
    if (sourceId === "DG3-TABLE-ANCHOR") {
      return state.geometry.anchors.table.position;
    }

    if (sourceId === "DG3-CULET-ANCHOR") {
      return state.geometry.anchors.culet.position;
    }

    const seat = state.geometry.getSeat(sourceId);
    return seat
      ? seat.surfacePosition
      : null;
  }

  function updateSelectedNodes(facet) {
    const positions = [];

    for (const sourceId of facet.sourceIds) {
      const seat = state.geometry.getSeat(sourceId);

      if (seat) {
        positions.push(...seat.latticePosition);
      }
    }

    state.selectedNodePositions = new Float32Array(positions);
  }

  function inspectAt(clientX, clientY) {
    if (
      !state.ready ||
      !state.canvas ||
      !state.geometry
    ) {
      return null;
    }

    updateMatrices();

    const rectangle = state.canvas.getBoundingClientRect();

    const x = Number.isFinite(clientX)
      ? clientX
      : rectangle.left + rectangle.width / 2;

    const y = Number.isFinite(clientY)
      ? clientY
      : rectangle.top + rectangle.height / 2;

    const ndcX =
      ((x - rectangle.left) / Math.max(rectangle.width, 1)) * 2 - 1;

    const ndcY =
      1 - ((y - rectangle.top) / Math.max(rectangle.height, 1)) * 2;

    const nearPoint = unproject(ndcX, ndcY, -1);
    const farPoint = unproject(ndcX, ndcY, 1);
    const direction = normalizeVector(
      subtractVector(
        farPoint,
        nearPoint
      )
    );

    let nearest = null;

    for (const facet of state.geometry.surfaceMesh.facets) {
      const localA = surfacePositionForSource(facet.sourceIds[0]);
      const localB = surfacePositionForSource(facet.sourceIds[1]);
      const localC = surfacePositionForSource(facet.sourceIds[2]);

      if (!localA || !localB || !localC) {
        continue;
      }

      const a = transformPoint(state.modelMatrix, localA);
      const b = transformPoint(state.modelMatrix, localB);
      const c = transformPoint(state.modelMatrix, localC);

      const hit = rayTriangleIntersection(
        nearPoint,
        direction,
        a,
        b,
        c
      );

      if (!hit) {
        continue;
      }

      if (!nearest || hit.distance < nearest.distance) {
        nearest = {
          distance: hit.distance,
          facet
        };
      }
    }

    if (!nearest) {
      clearSelection();
      renderOnce();
      publishState("selection-clear", true);
      return null;
    }

    const facet = nearest.facet;

    state.selectedFacetIndex = facet.facetIndex;
    state.selectedFacetId = facet.id;
    state.selectionCount += 1;
    updateSelectedNodes(facet);
    setInteractionTime();
    renderOnce();

    const selection = Object.freeze({
      facetId: facet.id,
      facetIndex: facet.facetIndex,
      role: facet.zone,
      surfaceRole: facet.surfaceRole,
      materialRegion: facet.materialRegion,
      bandUpper: facet.bandUpper,
      bandLower: facet.bandLower,
      radialStart: facet.radialStart,
      radialEnd: facet.radialEnd,
      seatIds: facet.sourceIds.slice(),
      center: facet.center.slice(),
      normal: facet.normal.slice(),
      distance: nearest.distance
    });

    dispatch(
      EVENT_SELECTION,
      selection
    );

    publishState("selection", true);
    return selection;
  }

  function pointerDistance(a, b) {
    return Math.hypot(
      a.x - b.x,
      a.y - b.y
    );
  }

  function pointerArray() {
    return Array.from(state.pointers.values());
  }

  function bindInteraction() {
    const target = state.stage;

    target.setAttribute("tabindex", target.getAttribute("tabindex") || "0");

    target.addEventListener(
      "pointerdown",
      event => {
        setInteractionTime();

        const point = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          previousX: event.clientX,
          previousY: event.clientY
        };

        state.pointers.set(event.pointerId, point);

        if (state.primaryPointerId === null) {
          state.primaryPointerId = event.pointerId;
          state.pointerDownTime = now();
          state.pointerStartX = event.clientX;
          state.pointerStartY = event.clientY;
          state.pointerMoved = false;
        }

        if (state.pointers.size >= 2) {
          const points = pointerArray();
          state.lastPinchDistance = pointerDistance(points[0], points[1]);
        }

        state.velocityYaw = 0;
        state.velocityPitch = 0;

        try {
          target.setPointerCapture(event.pointerId);
        } catch (_error) {}

        event.preventDefault();
      },
      signal
        ? { signal, passive: false }
        : { passive: false }
    );

    target.addEventListener(
      "pointermove",
      event => {
        const point = state.pointers.get(event.pointerId);

        if (!point) {
          return;
        }

        point.previousX = point.x;
        point.previousY = point.y;
        point.x = event.clientX;
        point.y = event.clientY;

        setInteractionTime();

        if (state.pointers.size >= 2) {
          const points = pointerArray();
          const distance = pointerDistance(points[0], points[1]);

          if (state.lastPinchDistance > 0) {
            const ratio = distance / state.lastPinchDistance;

            state.distance = clamp(
              state.distance / Math.max(ratio, 0.01),
              INITIAL.distanceMinimum,
              INITIAL.distanceMaximum
            );
          }

          state.lastPinchDistance = distance;
          state.pointerMoved = true;
          renderOnce();
          event.preventDefault();
          return;
        }

        if (event.pointerId !== state.primaryPointerId) {
          return;
        }

        const dx = point.x - point.previousX;
        const dy = point.y - point.previousY;

        if (
          Math.hypot(
            point.x - state.pointerStartX,
            point.y - state.pointerStartY
          ) >= INITIAL.clickMovementThreshold
        ) {
          state.pointerMoved = true;
        }

        state.yaw += dx * INITIAL.dragYawScale;
        state.pitch = clamp(
          state.pitch + dy * INITIAL.dragPitchScale,
          INITIAL.pitchMinimum,
          INITIAL.pitchMaximum
        );

        state.velocityYaw = clamp(
          dx * 0.0015,
          -0.045,
          0.045
        );

        state.velocityPitch = clamp(
          dy * 0.0011,
          -0.032,
          0.032
        );

        renderOnce();
        event.preventDefault();
      },
      signal
        ? { signal, passive: false }
        : { passive: false }
    );

    function releasePointer(event) {
      const wasPrimary =
        event.pointerId === state.primaryPointerId;

      const point = state.pointers.get(event.pointerId);
      state.pointers.delete(event.pointerId);

      try {
        target.releasePointerCapture(event.pointerId);
      } catch (_error) {}

      if (state.pointers.size < 2) {
        state.lastPinchDistance = 0;
      }

      if (wasPrimary) {
        const duration = now() - state.pointerDownTime;
        const moved = state.pointerMoved;

        if (
          point &&
          !moved &&
          duration <= INITIAL.clickDurationThreshold
        ) {
          const tapTime = now();

          if (
            tapTime -
            state.lastTapTime <=
            INITIAL.doubleTapThreshold
          ) {
            reset();
            state.lastTapTime = 0;
          } else {
            state.lastTapTime = tapTime;
            inspectAt(point.x, point.y);
          }
        }

        const remaining = pointerArray();

        state.primaryPointerId = remaining.length
          ? remaining[0].id
          : null;

        if (remaining.length) {
          state.pointerStartX = remaining[0].x;
          state.pointerStartY = remaining[0].y;
          state.pointerDownTime = now();
          state.pointerMoved = false;
        }
      }

      setInteractionTime();
      event.preventDefault();
    }

    target.addEventListener(
      "pointerup",
      releasePointer,
      signal
        ? { signal, passive: false }
        : { passive: false }
    );

    target.addEventListener(
      "pointercancel",
      releasePointer,
      signal
        ? { signal, passive: false }
        : { passive: false }
    );

    target.addEventListener(
      "wheel",
      event => {
        state.distance = clamp(
          state.distance +
          event.deltaY *
          INITIAL.wheelScale,
          INITIAL.distanceMinimum,
          INITIAL.distanceMaximum
        );

        setInteractionTime();
        renderOnce();
        event.preventDefault();
      },
      signal
        ? { signal, passive: false }
        : { passive: false }
    );
  }

  function setupObservers() {
    resizeCanvas();

    if (typeof ResizeObserver !== "undefined") {
      state.resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
        renderOnce();
      });

      state.resizeObserver.observe(state.stage);
    }

    if (typeof IntersectionObserver !== "undefined") {
      state.intersectionObserver = new IntersectionObserver(
        entries => {
          state.visibleInViewport = entries.some(
            entry => entry.isIntersecting
          );
        },
        {
          rootMargin: "160px 0px"
        }
      );

      state.intersectionObserver.observe(state.stage);
    }

    root.addEventListener(
      "resize",
      () => {
        resizeCanvas();
        renderOnce();
      },
      signal
        ? { signal, passive: true }
        : { passive: true }
    );

    root.addEventListener(
      "orientationchange",
      () => {
        root.setTimeout(() => {
          resizeCanvas();
          renderOnce();
        }, 120);
      },
      signal
        ? { signal, passive: true }
        : { passive: true }
    );

    doc.addEventListener(
      "visibilitychange",
      () => {
        state.documentVisible = !doc.hidden;
        state.lastFrameTime = 0;
      },
      signal
        ? { signal }
        : false
    );

    reducedMotion.addEventListener?.(
      "change",
      () => {
        setInteractionTime();
        renderOnce();
        publishState("reduced-motion-change", true);
      }
    );
  }

  function setupContextEvents() {
    state.canvas.addEventListener(
      "webglcontextlost",
      event => {
        event.preventDefault();

        state.contextLost = true;
        state.contextLossCount += 1;
        stop();
        setFallbackVisible(true, "webgl-context-lost");

        const payload = Object.freeze({
          contract: CONTRACT,
          contextLossCount: state.contextLossCount,
          status: status()
        });

        dispatch(
          EVENT_CONTEXT_LOST,
          payload
        );

        publishState("context-lost", true);
      },
      signal
        ? { signal, passive: false }
        : { passive: false }
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        try {
          state.contextLost = false;
          createContext();
          createProgramsAndBuffers();
          resizeCanvas();
          setFallbackVisible(false, "context-restored");
          state.ready = true;
          renderOnce();
          start();
          publishState("context-restored", true);
        } catch (error) {
          recordError("context-restored", error);
          setFallbackVisible(true, "context-restore-failed");
        }
      },
      signal
        ? { signal }
        : false
    );
  }

  function convexHull(points) {
    if (points.length <= 3) {
      return points.slice();
    }

    const sorted = points
      .slice()
      .sort((a, b) =>
        a[0] === b[0]
          ? a[1] - b[1]
          : a[0] - b[0]
      );

    function cross2(origin, a, b) {
      return (
        (a[0] - origin[0]) *
        (b[1] - origin[1]) -
        (a[1] - origin[1]) *
        (b[0] - origin[0])
      );
    }

    const lower = [];

    for (const point of sorted) {
      while (
        lower.length >= 2 &&
        cross2(
          lower[lower.length - 2],
          lower[lower.length - 1],
          point
        ) <= 0
      ) {
        lower.pop();
      }

      lower.push(point);
    }

    const upper = [];

    for (
      let index = sorted.length - 1;
      index >= 0;
      index -= 1
    ) {
      const point = sorted[index];

      while (
        upper.length >= 2 &&
        cross2(
          upper[upper.length - 2],
          upper[upper.length - 1],
          point
        ) <= 0
      ) {
        upper.pop();
      }

      upper.push(point);
    }

    lower.pop();
    upper.pop();

    return lower.concat(upper);
  }

  function buildShadowGeometry() {
    const lightDirection = normalizeVector([
      0.62,
      -1.0,
      -0.34
    ]);

    const projected = [];

    const sourcePoints = [
      ...state.geometry.seats.map(
        seat => seat.surfacePosition
      ),
      state.geometry.anchors.table.position,
      state.geometry.anchors.culet.position
    ];

    for (const localPoint of sourcePoints) {
      const worldPoint = transformPoint(
        state.modelMatrix,
        localPoint
      );

      if (Math.abs(lightDirection[1]) < 1e-6) {
        continue;
      }

      const factor =
        (INITIAL.shadowGroundY - worldPoint[1]) /
        lightDirection[1];

      if (factor < 0) {
        continue;
      }

      projected.push([
        worldPoint[0] + lightDirection[0] * factor,
        worldPoint[2] + lightDirection[2] * factor
      ]);
    }

    const hull = convexHull(projected);

    if (hull.length < 3) {
      return {
        positions: new Float32Array(0),
        alphas: new Float32Array(0),
        vertexCount: 0
      };
    }

    const center = hull.reduce(
      (accumulator, point) => {
        accumulator[0] += point[0];
        accumulator[1] += point[1];
        return accumulator;
      },
      [0, 0]
    );

    center[0] /= hull.length;
    center[1] /= hull.length;

    const positions = [];
    const alphas = [];

    for (
      let layer = 0;
      layer < INITIAL.shadowLayers;
      layer += 1
    ) {
      const normalized =
        layer /
        Math.max(INITIAL.shadowLayers - 1, 1);

      const scale =
        1.16 - normalized * 0.16;

      const alpha =
        0.008 + normalized * 0.010;

      const y =
        INITIAL.shadowGroundY +
        0.002 +
        layer * 0.0006;

      const ring = hull.map(point => [
        center[0] + (point[0] - center[0]) * scale,
        center[1] + (point[1] - center[1]) * scale
      ]);

      for (
        let index = 0;
        index < ring.length;
        index += 1
      ) {
        const next =
          (index + 1) % ring.length;

        const triangle = [
          [center[0], y, center[1]],
          [ring[index][0], y, ring[index][1]],
          [ring[next][0], y, ring[next][1]]
        ];

        for (const vertex of triangle) {
          positions.push(...vertex);
          alphas.push(alpha);
        }
      }
    }

    return {
      positions: new Float32Array(positions),
      alphas: new Float32Array(alphas),
      vertexCount: positions.length / 3
    };
  }

  function disposeProgramsAndBuffers() {
    if (!state.gl) {
      return;
    }

    const gl = state.gl;

    if (state.programs) {
      for (const program of Object.values(state.programs)) {
        if (program) {
          gl.deleteProgram(program);
        }
      }
    }

    if (state.buffers) {
      for (const [key, buffer] of Object.entries(state.buffers)) {
        if (key === "counts") {
          continue;
        }

        if (buffer) {
          gl.deleteBuffer(buffer);
        }
      }
    }

    state.programs = null;
    state.buffers = null;
    state.locations = null;
  }

  function dispose() {
    if (state.disposed) {
      return status();
    }

    stop();
    state.disposed = true;

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
    }

    if (state.intersectionObserver) {
      state.intersectionObserver.disconnect();
    }

    if (state.abortController) {
      try {
        state.abortController.abort();
      } catch (_error) {}
    }

    disposeProgramsAndBuffers();

    state.ready = false;
    state.initialized = false;

    publishState("dispose", true);
    return status();
  }

  function exposeApi() {
    const api = Object.freeze({
      contract: CONTRACT,
      geometryContract: GEOMETRY_CONTRACT,
      contractFamily: CONTRACT_FAMILY,
      setLens,
      setDimension,
      setView,
      setAutoRotate,
      setZoom,
      reset,
      inspectAt,
      render: renderOnce,
      renderOnce,
      start,
      stop,
      dispose,
      status,
      getReceipt
    });

    root[API_NAME] = api;
    root[COMPATIBILITY_API_NAME] = api;

    root.__SHOWROOM_DIAMOND_G3_RENDERER_CONTROLLER__ = {
      contract: CONTRACT,
      state,
      start,
      stop,
      dispose,
      setLens,
      setDimension,
      setView,
      reset,
      status
    };
  }

  function completeInitialization() {
    state.geometry = locateGeometry();

    if (!state.geometry) {
      return false;
    }

    ensureStageAndCanvas();
    createContext();
    createProgramsAndBuffers();
    bindInteraction();
    setupObservers();
    setupContextEvents();
    exposeApi();

    state.initialized = true;
    state.ready = true;
    state.disposed = false;

    resizeCanvas();
    updateMatrices();
    setFallbackVisible(false, "none");
    renderOnce();
    start();

    const payload = publishState("init-complete", true);

    dispatch(
      EVENT_READY,
      payload
    );

    return true;
  }

  function waitForGeometry(attempt) {
    if (state.disposed || state.initialized) {
      return;
    }

    try {
      if (completeInitialization()) {
        return;
      }
    } catch (error) {
      recordError("init", error);
      setFallbackVisible(true, "initialization-failed");
      exposeApi();
      return;
    }

    const nextAttempt = attempt + 1;

    setDataset(
      "showroomDiamondG3RendererHeld",
      "awaiting-geometry-authority"
    );

    if (nextAttempt >= 120) {
      exposeApi();
      setFallbackVisible(true, "geometry-authority-missing");
      publishState("geometry-missing", true);
      return;
    }

    root.setTimeout(
      () => waitForGeometry(nextAttempt),
      50
    );
  }

  function initialize() {
    try {
      exposeApi();
      waitForGeometry(0);
    } catch (error) {
      recordError("bootstrap", error);
      setFallbackVisible(true, "bootstrap-failed");
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener(
      "DOMContentLoaded",
      initialize,
      signal
        ? { signal, once: true }
        : { once: true }
    );
  } else {
    initialize();
  }
})(window, document);
