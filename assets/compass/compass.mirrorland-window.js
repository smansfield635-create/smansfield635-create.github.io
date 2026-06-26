/* /assets/compass/compass.mirrorland-window.js
   DGB Compass — Mirrorland stained-glass Window renderer.
   Scope: Mirrorland Window geometry, visual transitions, renderer receipts,
   and completion/failure events only.

   This file does not own:
   - Compass navigation;
   - controller state;
   - route execution;
   - cardinal or petal rendering;
   - constellation gestures;
   - semantic HTML controls.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_MIRRORLAND_WINDOW_RENDERER_TNT_v2",
    file: "/assets/compass/compass.mirrorland-window.js",
    role: "MIRRORLAND_WINDOW_RENDERER_ONLY",
    controllerFile: "/assets/compass/compass.controller.js",
    protectedCrystalsFile: "/assets/compass/compass.crystals.js",
    requiredMount: "[data-compass-mirrorland-window-mount]",
    crystalsModified: false,
    controllerAuthority: true,
    navigationAuthority: false,
    routeAuthority: false,
    semanticControlAuthority: false,
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const WINDOW_STATES = Object.freeze({
    DORMANT: "dormant",
    REVEALING: "revealing",
    FOCUSED: "focused",
    WITHDRAWING: "withdrawing",
    NAVIGATING: "navigating"
  });

  const EVENTS = Object.freeze({
    REVEAL_COMPLETE:
      "MIRRORLAND_WINDOW_REVEAL_COMPLETE",

    WITHDRAWAL_COMPLETE:
      "MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE",

    RENDER_FAILURE:
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
  });

  const EVENT_SOURCE =
    "compass.mirrorland-window";

  const GEOMETRY = Object.freeze({
    WINDOW_CENTER_X: 0,
    WINDOW_CENTER_Y: 0,

    REAR_MOTION_Z: 0.02,
    PANE_DISC_Z: 0.12,
    LEAD_NETWORK_Z: 0.16,
    FRAME_RING_Z: 0.20,

    WINDOW_RADIUS: 1.55,
    INNER_GLASS_RADIUS: 1.34,
    FRAME_OUTER_RADIUS: 1.55,
    FRAME_INNER_RADIUS: 1.38,
    FRAME_RADIAL_WIDTH: 0.17,
    GLASS_TO_FRAME_GAP: 0.04,

    CENTER_MEDALLION_RADIUS: 0.24,
    INNER_RING_RADIUS: 0.60,
    MIDDLE_RING_RADIUS: 0.96,
    OUTER_PANE_RADIUS: 1.34,

    PRIMARY_SECTORS: 12,
    CENTER_PANE_COUNT: 1,
    INNER_PANE_COUNT: 12,
    MIDDLE_PANE_COUNT: 12,
    OUTER_BASE_PANE_COUNT: 12,
    ACCENT_SPLIT_COUNT: 8,
    TOTAL_PANE_COUNT: 45,

    RADIAL_ANGLE_VARIATION_MIN_DEG: 2,
    RADIAL_ANGLE_VARIATION_MAX_DEG: 4,
    RING_RADIUS_VARIATION_MIN: 0.02,
    RING_RADIUS_VARIATION_MAX: 0.05,
    PANE_DEPTH_VARIATION_MIN: 0.005,
    PANE_DEPTH_VARIATION_MAX: 0.015,

    REAR_SEGMENTS: 72,
    MEDALLION_SEGMENTS: 36,
    RING_SEGMENTS: 96,

    HALO_INNER_RADIUS: 1.48,
    HALO_OUTER_RADIUS: 1.70,

    LEAD_RADIAL_HALF_WIDTH: 0.018,
    LEAD_RING_HALF_WIDTH: 0.018,
    LEAD_ACCENT_HALF_WIDTH: 0.014
  });

  const TIMING = Object.freeze({
    REVEAL_DURATION_SECONDS: 1.55,
    WITHDRAWAL_DURATION_SECONDS: 1.15,
    NAVIGATING_FADE_SECONDS: 0.55,

    FRAME_REVEAL_START: 0.00,
    FRAME_REVEAL_END: 0.30,

    LEAD_REVEAL_START: 0.18,
    LEAD_REVEAL_END: 0.50,

    PANE_REVEAL_START: 0.38,
    PANE_REVEAL_END: 0.78,

    REAR_REVEAL_START: 0.62,
    REAR_REVEAL_END: 0.96,

    HALO_REVEAL_START: 0.08,
    HALO_REVEAL_END: 0.48,

    STABILITY_EPSILON: 0.001
  });

  const QUALITY = Object.freeze({
    devicePixelRatioCap: 2,
    clearAlpha: 0,
    windowScaleNdc: 0.78,
    maximumDeltaSeconds: 0.05
  });

  const LAYERS = Object.freeze({
    REAR: 1,
    PANE: 2,
    LEAD: 3,
    FRAME: 4,
    HALO: 5
  });

  const COLORS = Object.freeze({
    center: Object.freeze([
      [0.86, 0.95, 1.00],
      [0.72, 0.88, 1.00],
      [0.90, 0.96, 1.00]
    ]),

    inner: Object.freeze([
      [0.28, 0.58, 0.98],
      [0.42, 0.34, 0.88],
      [0.24, 0.72, 0.94],
      [0.55, 0.40, 0.92]
    ]),

    middle: Object.freeze([
      [0.26, 0.54, 0.96],
      [0.48, 0.32, 0.82],
      [0.88, 0.66, 0.24],
      [0.32, 0.72, 0.94],
      [0.62, 0.42, 0.88]
    ]),

    outer: Object.freeze([
      [0.14, 0.30, 0.66],
      [0.26, 0.42, 0.82],
      [0.58, 0.22, 0.34],
      [0.80, 0.48, 0.18],
      [0.38, 0.24, 0.68],
      [0.20, 0.56, 0.78]
    ]),

    rear: Object.freeze([
      0.16,
      0.28,
      0.52
    ]),

    lead: Object.freeze([
      0.055,
      0.060,
      0.075
    ]),

    frame: Object.freeze([
      0.090,
      0.075,
      0.060
    ]),

    frameGold: Object.freeze([
      0.62,
      0.44,
      0.18
    ]),

    halo: Object.freeze([
      0.28,
      0.58,
      0.92
    ])
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    rendererFile: CONTRACT.file,
    rendererRole: CONTRACT.role,
    requiredMount: CONTRACT.requiredMount,

    controllerAuthorityPreserved: true,
    navigationAuthority: false,
    routeAuthority: false,
    crystalsProtected: true,
    crystalsModified: false,

    rootStatus: "pending",
    sceneStatus: "pending",
    mountStatus: "pending",
    canvasStatus: "pending",
    webglContextStatus: "pending",
    shaderStatus: "pending",
    programStatus: "pending",
    geometryStatus: "pending",
    renderLoopStatus: "pending",

    mirrorlandWindowRendererAvailable: false,
    mirrorlandWindowGeometryAvailable: false,
    mirrorlandWindowGeometrySource:
      "INDEPENDENT_PRESENTATION_GEOMETRY",
    mirrorlandWindowSourceObjectUsed: false,
    mirrorlandWindowSourceMutated: false,

    mirrorlandWindowPaneCount:
      GEOMETRY.TOTAL_PANE_COUNT,

    mirrorlandWindowLeadTopology:
      "12_RADIAL_3_CONCENTRIC_8_OUTER_ACCENT_DIVISIONS",

    mirrorlandWindowIrregularityMethod:
      "FIXED_DETERMINISTIC_SEEDED_OFFSETS",

    mirrorlandWindowState:
      WINDOW_STATES.DORMANT,

    mirrorlandWindowTransitionId: "0",
    mirrorlandWindowReducedMotion: false,
    mirrorlandWindowDrawn: false,
    mirrorlandWindowStable: false,

    mirrorlandWindowFrameProgress: 0,
    mirrorlandWindowLeadProgress: 0,
    mirrorlandWindowPaneProgress: 0,
    mirrorlandWindowRearProgress: 0,
    mirrorlandWindowHaloProgress: 0,

    mirrorlandWindowRevealProgress: 0,
    mirrorlandWindowWithdrawalProgress: 1,

    mirrorlandWindowDrawCallsLastFrame: 0,
    mirrorlandWindowCompletionEventLastEmitted: "",
    mirrorlandWindowCompletionIdLastEmitted: "",
    mirrorlandWindowFailureReason: null,
    mirrorlandWindowFailureStage: null,
    mirrorlandWindowBlockingGlError: null,

    dormantContinuousRaf: false,
    dormantStaticFrameDrawn: false,
    demandDrivenRendering: true,

    windowCenter: "(0,0)",
    rearMotionZ: GEOMETRY.REAR_MOTION_Z,
    paneDiscZ: GEOMETRY.PANE_DISC_Z,
    leadNetworkZ: GEOMETRY.LEAD_NETWORK_Z,
    frameRingZ: GEOMETRY.FRAME_RING_Z,
    windowRadius: GEOMETRY.WINDOW_RADIUS,
    innerGlassRadius: GEOMETRY.INNER_GLASS_RADIUS,
    frameOuterRadius: GEOMETRY.FRAME_OUTER_RADIUS,
    frameInnerRadius: GEOMETRY.FRAME_INNER_RADIUS,
    rearMotionVisibleRadius:
      GEOMETRY.INNER_GLASS_RADIUS,

    visualPassClaimed: false
  };

  const state = {
    root: null,
    scene: null,
    mount: null,
    canvas: null,
    receiptSlot: null,

    gl: null,
    program: null,
    attribs: null,
    uniforms: null,
    meshes: new Map(),

    running: false,
    raf: 0,
    frameRequested: false,
    lastTimeSeconds: 0,
    timeSeconds: 0,

    width: 1,
    height: 1,
    pixelRatio: 1,

    controllerState:
      WINDOW_STATES.DORMANT,

    lastObservedControllerState:
      WINDOW_STATES.DORMANT,

    transitionId: "0",
    lastObservedTransitionId: "0",
    transitionStartSeconds: 0,

    reducedMotion: false,

    progress: {
      frame: 0,
      lead: 0,
      panes: 0,
      rear: 0,
      halo: 0
    },

    revealProgress: 0,
    withdrawalProgress: 1,

    lastRevealCompletionId: "",
    lastWithdrawalCompletionId: "",
    lastFailureSignature: "",

    geometryAvailable: false,
    blockingGlError: null,
    contextLost: false,

    resizeObserver: null,
    mutationObserver: null,
    mediaQuery: null,
    mediaQueryHandler: null
  };

  function clamp(
    value,
    minimum = 0,
    maximum = 1
  ) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function smoothstep01(value) {
    const t = clamp(value);

    return (
      t *
      t *
      (3 - 2 * t)
    );
  }

  function rangeProgress(
    progress,
    start,
    end
  ) {
    if (end <= start) {
      return progress >= end
        ? 1
        : 0;
    }

    return smoothstep01(
      (progress - start) /
      (end - start)
    );
  }

  function approximately(
    value,
    target,
    epsilon = TIMING.STABILITY_EPSILON
  ) {
    return (
      Math.abs(value - target) <=
      epsilon
    );
  }

  function exactDatasetBoolean(value) {
    return String(value || "") === "true";
  }

  function normalizeWindowState(value) {
    const requested = String(value || "")
      .trim()
      .toLowerCase();

    return Object.values(WINDOW_STATES)
      .includes(requested)
      ? requested
      : WINDOW_STATES.DORMANT;
  }

  function boundedTransitionId(value) {
    const raw = String(value || "0")
      .trim()
      .slice(0, 48);

    return raw || "0";
  }

  function seeded(seed) {
    const x =
      Math.sin(seed * 12.9898 + 78.233) *
      43758.5453;

    return x - Math.floor(x);
  }

  function signedSeeded(seed) {
    return (
      seeded(seed) * 2 - 1
    );
  }

  function degreesToRadians(value) {
    return (
      value *
      Math.PI /
      180
    );
  }

  function deterministicAngleVariation(seed) {
    const magnitude =
      GEOMETRY.RADIAL_ANGLE_VARIATION_MIN_DEG +
      seeded(seed + 101) *
      (
        GEOMETRY.RADIAL_ANGLE_VARIATION_MAX_DEG -
        GEOMETRY.RADIAL_ANGLE_VARIATION_MIN_DEG
      );

    return degreesToRadians(
      magnitude *
      (
        signedSeeded(seed + 211) < 0
          ? -1
          : 1
      )
    );
  }

  function deterministicRadiusVariation(seed) {
    const magnitude =
      GEOMETRY.RING_RADIUS_VARIATION_MIN +
      seeded(seed + 307) *
      (
        GEOMETRY.RING_RADIUS_VARIATION_MAX -
        GEOMETRY.RING_RADIUS_VARIATION_MIN
      );

    return (
      magnitude *
      (
        signedSeeded(seed + 401) < 0
          ? -1
          : 1
      )
    );
  }

  function deterministicDepthVariation(seed) {
    const magnitude =
      GEOMETRY.PANE_DEPTH_VARIATION_MIN +
      seeded(seed + 503) *
      (
        GEOMETRY.PANE_DEPTH_VARIATION_MAX -
        GEOMETRY.PANE_DEPTH_VARIATION_MIN
      );

    return (
      magnitude *
      (
        signedSeeded(seed + 601) < 0
          ? -1
          : 1
      )
    );
  }

  function colorFromPalette(
    palette,
    index,
    brightness = 1
  ) {
    const color =
      palette[index % palette.length];

    return [
      clamp(color[0] * brightness),
      clamp(color[1] * brightness),
      clamp(color[2] * brightness)
    ];
  }

  function isActiveAnimationState(value) {
    return (
      value === WINDOW_STATES.REVEALING ||
      value === WINDOW_STATES.FOCUSED ||
      value === WINDOW_STATES.WITHDRAWING ||
      value === WINDOW_STATES.NAVIGATING
    );
  }

  function shouldContinueRendering() {
    if (
      state.contextLost ||
      !state.geometryAvailable
    ) {
      return false;
    }

    if (
      state.controllerState ===
      WINDOW_STATES.FOCUSED
    ) {
      return true;
    }

    if (
      state.controllerState ===
      WINDOW_STATES.REVEALING
    ) {
      return !approximately(
        state.progress.rear,
        1
      );
    }

    if (
      state.controllerState ===
      WINDOW_STATES.WITHDRAWING
    ) {
      return !approximately(
        state.progress.frame,
        0
      );
    }

    if (
      state.controllerState ===
      WINDOW_STATES.NAVIGATING
    ) {
      const elapsed =
        Math.max(
          0,
          state.timeSeconds -
          state.transitionStartSeconds
        );

      return (
        elapsed <
        TIMING.NAVIGATING_FADE_SECONDS
      );
    }

    return false;
  }

  function currentLoopStatus() {
    if (state.contextLost) {
      return "held-context-lost";
    }

    if (state.running) {
      if (
        state.controllerState ===
        WINDOW_STATES.FOCUSED
      ) {
        return state.reducedMotion
          ? "active-focused-reduced-motion"
          : "active-focused";
      }

      return state.reducedMotion
        ? "active-transition-reduced-motion"
        : "active-transition";
    }

    if (
      state.controllerState ===
      WINDOW_STATES.DORMANT
    ) {
      return "idle-dormant";
    }

    if (
      state.controllerState ===
      WINDOW_STATES.NAVIGATING
    ) {
      return "idle-navigating";
    }

    return "idle";
  }

  function emitReceipt(extra = {}) {
    Object.assign(
      RECEIPT,
      {
        rootStatus:
          state.root
            ? "found"
            : "missing",

        sceneStatus:
          state.scene
            ? "found"
            : "missing",

        mountStatus:
          state.mount
            ? "found"
            : "missing",

        canvasStatus:
          state.canvas
            ? "found"
            : "missing",

        webglContextStatus:
          state.contextLost
            ? "lost"
            : state.gl
              ? "available"
              : "missing",

        renderLoopStatus:
          currentLoopStatus(),

        mirrorlandWindowRendererAvailable:
          !!(
            state.gl &&
            state.program &&
            state.geometryAvailable
          ),

        mirrorlandWindowGeometryAvailable:
          state.geometryAvailable === true,

        mirrorlandWindowState:
          state.controllerState,

        mirrorlandWindowTransitionId:
          state.transitionId,

        mirrorlandWindowReducedMotion:
          state.reducedMotion === true,

        mirrorlandWindowStable:
          isWindowStable(),

        mirrorlandWindowFrameProgress:
          state.progress.frame,

        mirrorlandWindowLeadProgress:
          state.progress.lead,

        mirrorlandWindowPaneProgress:
          state.progress.panes,

        mirrorlandWindowRearProgress:
          state.progress.rear,

        mirrorlandWindowHaloProgress:
          state.progress.halo,

        mirrorlandWindowRevealProgress:
          state.revealProgress,

        mirrorlandWindowWithdrawalProgress:
          state.withdrawalProgress,

        mirrorlandWindowFailureReason:
          RECEIPT.mirrorlandWindowFailureReason,

        mirrorlandWindowBlockingGlError:
          state.blockingGlError,

        dormantContinuousRaf: false,
        demandDrivenRendering: true,

        visualPassClaimed: false
      },
      extra,
      {
        visualPassClaimed: false
      }
    );

    const serialized =
      JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.compassMirrorlandWindowReceipt =
        serialized;

      state.root.dataset.compassMirrorlandWindowStatus =
        RECEIPT.mirrorlandWindowFailureReason
          ? "held"
          : "available";

      state.root.dataset.visualPassClaimed =
        "false";
    }

    if (state.canvas) {
      state.canvas.dataset.compassMirrorlandWindowReceipt =
        serialized;

      state.canvas.dataset.visualPassClaimed =
        "false";
    }

    if (state.receiptSlot) {
      state.receiptSlot.value =
        serialized;

      state.receiptSlot.textContent =
        serialized;

      state.receiptSlot.dataset.visualPassClaimed =
        "false";
    }

    globalThis.DGB_COMPASS_MIRRORLAND_WINDOW_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });
  }

  function boundedReasonCode(value) {
    const normalized = String(
      value ||
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
    )
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9:_-]+/g, "_")
      .slice(0, 120);

    return (
      normalized ||
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
    );
  }

  function boundedFailureStage(value) {
    const stage = String(value || "")
      .trim()
      .toLowerCase();

    const permitted = [
      "initialization",
      "geometry",
      "reveal",
      "focused",
      "withdrawal",
      "context"
    ];

    return permitted.includes(stage)
      ? stage
      : "context";
  }

  function dispatchFailure(
    reasonCode,
    stage = "context",
    glError = null
  ) {
    const boundedReason =
      boundedReasonCode(reasonCode);

    const boundedStage =
      boundedFailureStage(stage);

    const boundedGlError =
      glError === null ||
      typeof glError === "undefined"
        ? null
        : String(glError).slice(0, 160);

    const signature =
      [
        boundedReason,
        boundedStage,
        boundedGlError || ""
      ].join(":");

    RECEIPT.mirrorlandWindowFailureReason =
      boundedReason;

    RECEIPT.mirrorlandWindowFailureStage =
      boundedStage;

    RECEIPT.mirrorlandWindowBlockingGlError =
      boundedGlError;

    state.blockingGlError =
      boundedGlError ||
      boundedReason;

    stopRenderer(
      "held-render-failure"
    );

    emitReceipt({
      failureReason:
        boundedReason
    });

    if (
      state.root &&
      state.lastFailureSignature !== signature
    ) {
      state.lastFailureSignature =
        signature;

      state.root.dispatchEvent(
        new CustomEvent(
          EVENTS.RENDER_FAILURE,
          {
            bubbles: false,
            cancelable: false,
            detail: {
              source:
                EVENT_SOURCE,

              reasonCode:
                boundedReason,

              stage:
                boundedStage,

              glError:
                boundedGlError
            }
          }
        )
      );
    }
  }

  function dispatchCompletion(
    eventName,
    reportedWindowState,
    completionId
  ) {
    if (!state.root) return false;

    state.root.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          bubbles: false,
          cancelable: false,
          detail: {
            source:
              EVENT_SOURCE,

            windowState:
              reportedWindowState,

            completionId:
              completionId
          }
        }
      )
    );

    RECEIPT.mirrorlandWindowCompletionEventLastEmitted =
      eventName;

    RECEIPT.mirrorlandWindowCompletionIdLastEmitted =
      completionId;

    emitReceipt();

    return true;
  }

  function findRoot() {
    return document.querySelector(
      "[data-compass-root]"
    );
  }

  function findScene(root) {
    if (!root) return null;

    return (
      root.querySelector("[data-compass-scene]") ||
      root.querySelector(".compass-scene")
    );
  }

  function findMount(scene) {
    if (!scene) return null;

    return scene.querySelector(
      "[data-compass-mirrorland-window-mount]"
    );
  }

  function ensureCanvas(mount) {
    if (!mount) {
      throw new Error(
        "MISSING_DATA_COMPASS_MIRRORLAND_WINDOW_MOUNT"
      );
    }

    const existing =
      mount.querySelector(
        "canvas[data-compass-mirrorland-window-canvas]"
      );

    if (existing) {
      return existing;
    }

    const canvas =
      document.createElement("canvas");

    canvas.setAttribute(
      "data-compass-mirrorland-window-canvas",
      "true"
    );

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "role",
      "presentation"
    );

    canvas.dataset.visualPassClaimed =
      "false";

    canvas.style.position =
      "absolute";

    canvas.style.inset =
      "0";

    canvas.style.display =
      "block";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.pointerEvents =
      "none";

    canvas.style.touchAction =
      "none";

    canvas.style.userSelect =
      "none";

    mount.appendChild(canvas);

    return canvas;
  }

  function getGL(canvas) {
    return canvas.getContext(
      "webgl",
      {
        alpha: true,
        antialias: true,
        depth: true,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      }
    );
  }

  const VERTEX_SHADER_SOURCE = `
    attribute vec3 aPosition;
    attribute vec3 aColor;

    uniform vec2 uViewportScale;
    uniform float uLayerScale;
    uniform float uDepthLift;

    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vRadius;

    void main() {
      vec3 position = aPosition;

      position.xy *= uLayerScale;

      vec2 projected = vec2(
        position.x * uViewportScale.x,
        position.y * uViewportScale.y
      );

      float depth =
        clamp(
          0.45 - position.z * 0.24 - uDepthLift,
          -0.95,
          0.95
        );

      vColor = aColor;
      vPosition = position;
      vRadius = length(position.xy);

      gl_Position = vec4(
        projected,
        depth,
        1.0
      );
    }
  `;

  const FRAGMENT_SHADER_SOURCE = `
    precision mediump float;

    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vRadius;

    uniform float uTime;
    uniform float uLayer;
    uniform float uOpacity;
    uniform float uReducedMotion;
    uniform float uInnerGlassRadius;
    uniform float uHaloInnerRadius;
    uniform float uHaloOuterRadius;

    float hash21(vec2 p) {
      return fract(
        sin(
          dot(
            p,
            vec2(127.1, 311.7)
          )
        ) * 43758.5453123
      );
    }

    void main() {
      vec3 color = vColor;
      float alpha = uOpacity;

      if (uLayer < 1.5) {
        float movement =
          uReducedMotion > 0.5
            ? 0.0
            : uTime * 0.075;

        float waveA =
          sin(
            vPosition.x * 3.1 +
            movement * 4.0
          );

        float waveB =
          cos(
            vPosition.y * 3.7 -
            movement * 3.0
          );

        float haze =
          0.5 +
          0.5 *
          sin(
            vPosition.x * 2.2 +
            vPosition.y * 2.8 +
            movement * 2.2
          );

        float silhouette =
          smoothstep(
            0.62,
            0.98,
            hash21(
              floor(
                (vPosition.xy + movement) * 3.0
              )
            )
          );

        float edge =
          1.0 -
          smoothstep(
            uInnerGlassRadius * 0.76,
            uInnerGlassRadius,
            vRadius
          );

        color *=
          0.72 +
          waveA * 0.08 +
          waveB * 0.06 +
          haze * 0.16;

        color +=
          vec3(
            0.10,
            0.05,
            0.16
          ) *
          silhouette *
          0.15;

        alpha *=
          edge *
          (
            0.58 +
            haze * 0.24
          );
      } else if (
        uLayer > 1.5 &&
        uLayer < 2.5
      ) {
        float edgeGlow =
          0.92 +
          0.08 *
          sin(
            vPosition.x * 8.0 +
            vPosition.y * 6.0
          );

        float innerLight =
          0.92 +
          0.12 *
          (
            1.0 -
            clamp(
              vRadius /
              uInnerGlassRadius,
              0.0,
              1.0
            )
          );

        color *=
          edgeGlow *
          innerLight;

        alpha *= 0.72;
      } else if (
        uLayer > 2.5 &&
        uLayer < 3.5
      ) {
        float oldLead =
          0.86 +
          0.14 *
          sin(
            vPosition.x * 11.0 +
            vPosition.y * 9.0
          );

        color *= oldLead;
        alpha *= 0.96;
      } else if (
        uLayer > 3.5 &&
        uLayer < 4.5
      ) {
        float edgeLight =
          smoothstep(
            1.37,
            1.55,
            vRadius
          );

        color +=
          vec3(
            0.44,
            0.29,
            0.09
          ) *
          edgeLight *
          0.34;

        alpha *= 0.98;
      } else {
        float center =
          (
            uHaloInnerRadius +
            uHaloOuterRadius
          ) *
          0.5;

        float width =
          max(
            0.001,
            (
              uHaloOuterRadius -
              uHaloInnerRadius
            ) *
            0.5
          );

        float distanceFromCenter =
          abs(vRadius - center) /
          width;

        float halo =
          1.0 -
          smoothstep(
            0.0,
            1.0,
            distanceFromCenter
          );

        color *=
          0.72 +
          halo * 0.42;

        alpha *=
          halo *
          0.24;
      }

      if (alpha <= 0.002) {
        discard;
      }

      gl_FragColor =
        vec4(
          color,
          clamp(alpha, 0.0, 1.0)
        );
    }
  `;

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(shader);

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const info =
        gl.getShaderInfoLog(shader) ||
        "UNKNOWN_SHADER_ERROR";

      gl.deleteShader(shader);

      throw new Error(info);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        VERTEX_SHADER_SOURCE
      );

    const fragment =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        FRAGMENT_SHADER_SOURCE
      );

    const program =
      gl.createProgram();

    gl.attachShader(
      program,
      vertex
    );

    gl.attachShader(
      program,
      fragment
    );

    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const info =
        gl.getProgramInfoLog(program) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(program);

      throw new Error(info);
    }

    return program;
  }

  function pushVertex(
    positions,
    colors,
    point,
    color
  ) {
    positions.push(
      point[0],
      point[1],
      point[2]
    );

    colors.push(
      color[0],
      color[1],
      color[2]
    );
  }

  function pushTriangle(
    positions,
    colors,
    a,
    b,
    c,
    colorA,
    colorB = colorA,
    colorC = colorA
  ) {
    pushVertex(
      positions,
      colors,
      a,
      colorA
    );

    pushVertex(
      positions,
      colors,
      b,
      colorB
    );

    pushVertex(
      positions,
      colors,
      c,
      colorC
    );
  }

  function polarPoint(
    radius,
    angle,
    z
  ) {
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      z
    ];
  }

  function meshResult(
    positions,
    colors,
    metadata = {}
  ) {
    return Object.freeze({
      positions:
        new Float32Array(positions),

      colors:
        new Float32Array(colors),

      vertexCount:
        positions.length / 3,

      triangleCount:
        positions.length / 9,

      ...metadata
    });
  }

  function createDiscMesh(
    radius,
    z,
    segments,
    centerColor,
    edgeColor
  ) {
    const positions = [];
    const colors = [];

    const center = [
      0,
      0,
      z
    ];

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const angleA =
        Math.PI * 2 *
        index /
        segments;

      const angleB =
        Math.PI * 2 *
        (index + 1) /
        segments;

      pushTriangle(
        positions,
        colors,
        center,
        polarPoint(
          radius,
          angleA,
          z
        ),
        polarPoint(
          radius,
          angleB,
          z
        ),
        centerColor,
        edgeColor,
        edgeColor
      );
    }

    return meshResult(
      positions,
      colors
    );
  }

  function createAnnulusMesh(
    innerRadius,
    outerRadius,
    z,
    segments,
    innerColor,
    outerColor
  ) {
    const positions = [];
    const colors = [];

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const angleA =
        Math.PI * 2 *
        index /
        segments;

      const angleB =
        Math.PI * 2 *
        (index + 1) /
        segments;

      const innerA =
        polarPoint(
          innerRadius,
          angleA,
          z
        );

      const innerB =
        polarPoint(
          innerRadius,
          angleB,
          z
        );

      const outerA =
        polarPoint(
          outerRadius,
          angleA,
          z
        );

      const outerB =
        polarPoint(
          outerRadius,
          angleB,
          z
        );

      pushTriangle(
        positions,
        colors,
        innerA,
        outerA,
        outerB,
        innerColor,
        outerColor,
        outerColor
      );

      pushTriangle(
        positions,
        colors,
        innerA,
        outerB,
        innerB,
        innerColor,
        outerColor,
        innerColor
      );
    }

    return meshResult(
      positions,
      colors
    );
  }

  function createRadialStrip(
    positions,
    colors,
    angle,
    innerRadius,
    outerRadius,
    halfWidth,
    z,
    color
  ) {
    const perpendicularX =
      -Math.sin(angle) *
      halfWidth;

    const perpendicularY =
      Math.cos(angle) *
      halfWidth;

    const innerCenter =
      polarPoint(
        innerRadius,
        angle,
        z
      );

    const outerCenter =
      polarPoint(
        outerRadius,
        angle,
        z
      );

    const a = [
      innerCenter[0] + perpendicularX,
      innerCenter[1] + perpendicularY,
      z
    ];

    const b = [
      outerCenter[0] + perpendicularX,
      outerCenter[1] + perpendicularY,
      z
    ];

    const c = [
      outerCenter[0] - perpendicularX,
      outerCenter[1] - perpendicularY,
      z
    ];

    const d = [
      innerCenter[0] - perpendicularX,
      innerCenter[1] - perpendicularY,
      z
    ];

    pushTriangle(
      positions,
      colors,
      a,
      b,
      c,
      color
    );

    pushTriangle(
      positions,
      colors,
      a,
      c,
      d,
      color
    );
  }

  function createRingStrip(
    positions,
    colors,
    radius,
    halfWidth,
    z,
    segments,
    color,
    seedBase
  ) {
    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const angleA =
        Math.PI * 2 *
        index /
        segments;

      const angleB =
        Math.PI * 2 *
        (index + 1) /
        segments;

      const variationA =
        deterministicRadiusVariation(
          seedBase + index
        ) * 0.22;

      const variationB =
        deterministicRadiusVariation(
          seedBase + index + 1
        ) * 0.22;

      const radiusA =
        radius + variationA;

      const radiusB =
        radius + variationB;

      const innerA =
        polarPoint(
          radiusA - halfWidth,
          angleA,
          z
        );

      const outerA =
        polarPoint(
          radiusA + halfWidth,
          angleA,
          z
        );

      const innerB =
        polarPoint(
          radiusB - halfWidth,
          angleB,
          z
        );

      const outerB =
        polarPoint(
          radiusB + halfWidth,
          angleB,
          z
        );

      pushTriangle(
        positions,
        colors,
        innerA,
        outerA,
        outerB,
        color
      );

      pushTriangle(
        positions,
        colors,
        innerA,
        outerB,
        innerB,
        color
      );
    }
  }

  function buildBoundaryAngles() {
    const angles = [];

    for (
      let index = 0;
      index < GEOMETRY.PRIMARY_SECTORS;
      index += 1
    ) {
      const base =
        Math.PI * 2 *
        index /
        GEOMETRY.PRIMARY_SECTORS -
        Math.PI / 2;

      angles.push(
        base +
        deterministicAngleVariation(
          index + 701
        )
      );
    }

    return angles;
  }

  function nextBoundaryAngle(
    angles,
    index
  ) {
    if (
      index + 1 <
      angles.length
    ) {
      return angles[index + 1];
    }

    return (
      angles[0] +
      Math.PI * 2
    );
  }

  function variableRingRadius(
    baseRadius,
    sectorIndex,
    ringIndex
  ) {
    return (
      baseRadius +
      deterministicRadiusVariation(
        900 +
        ringIndex * 100 +
        sectorIndex
      )
    );
  }

  function appendPaneCell(
    positions,
    colors,
    innerRadiusA,
    innerRadiusB,
    outerRadiusA,
    outerRadiusB,
    angleA,
    angleB,
    z,
    color
  ) {
    const innerA =
      polarPoint(
        innerRadiusA,
        angleA,
        z
      );

    const outerA =
      polarPoint(
        outerRadiusA,
        angleA,
        z
      );

    const outerB =
      polarPoint(
        outerRadiusB,
        angleB,
        z
      );

    const innerB =
      polarPoint(
        innerRadiusB,
        angleB,
        z
      );

    const brightnessA =
      0.88 +
      seeded(
        Math.round(
          (
            angleA +
            Math.PI * 2
          ) * 1000
        )
      ) * 0.12;

    const brightnessB =
      0.90 +
      seeded(
        Math.round(
          (
            angleB +
            Math.PI * 2
          ) * 1300
        )
      ) * 0.10;

    const colorA = [
      clamp(color[0] * brightnessA),
      clamp(color[1] * brightnessA),
      clamp(color[2] * brightnessA)
    ];

    const colorB = [
      clamp(color[0] * brightnessB),
      clamp(color[1] * brightnessB),
      clamp(color[2] * brightnessB)
    ];

    pushTriangle(
      positions,
      colors,
      innerA,
      outerA,
      outerB,
      colorA,
      colorA,
      colorB
    );

    pushTriangle(
      positions,
      colors,
      innerA,
      outerB,
      innerB,
      colorA,
      colorB,
      colorB
    );
  }

  function createPaneAssemblyMesh() {
    const positions = [];
    const colors = [];

    const angles =
      buildBoundaryAngles();

    const centerZ =
      GEOMETRY.PANE_DISC_Z +
      deterministicDepthVariation(1101);

    const medallion =
      createDiscMesh(
        GEOMETRY.CENTER_MEDALLION_RADIUS,
        centerZ,
        GEOMETRY.MEDALLION_SEGMENTS,
        colorFromPalette(
          COLORS.center,
          0,
          1.08
        ),
        colorFromPalette(
          COLORS.center,
          0,
          1
        )
      );

    positions.push(
      ...medallion.positions
    );

    colors.push(
      ...medallion.colors
    );

    let paneCount = 1;

    for (
      let sector = 0;
      sector < GEOMETRY.PRIMARY_SECTORS;
      sector += 1
    ) {
      const angleA =
        angles[sector];

      const angleB =
        nextBoundaryAngle(
          angles,
          sector
        );

      const z =
        GEOMETRY.PANE_DISC_Z +
        deterministicDepthVariation(
          1200 + sector
        );

      appendPaneCell(
        positions,
        colors,
        variableRingRadius(
          GEOMETRY.CENTER_MEDALLION_RADIUS,
          sector,
          0
        ),
        variableRingRadius(
          GEOMETRY.CENTER_MEDALLION_RADIUS,
          (sector + 1) %
          GEOMETRY.PRIMARY_SECTORS,
          0
        ),
        variableRingRadius(
          GEOMETRY.INNER_RING_RADIUS,
          sector,
          1
        ),
        variableRingRadius(
          GEOMETRY.INNER_RING_RADIUS,
          (sector + 1) %
          GEOMETRY.PRIMARY_SECTORS,
          1
        ),
        angleA,
        angleB,
        z,
        colorFromPalette(
          COLORS.inner,
          sector,
          0.96 +
          seeded(1300 + sector) * 0.10
        )
      );

      paneCount += 1;
    }

    for (
      let sector = 0;
      sector < GEOMETRY.PRIMARY_SECTORS;
      sector += 1
    ) {
      const angleA =
        angles[sector];

      const angleB =
        nextBoundaryAngle(
          angles,
          sector
        );

      const z =
        GEOMETRY.PANE_DISC_Z +
        deterministicDepthVariation(
          1400 + sector
        );

      appendPaneCell(
        positions,
        colors,
        variableRingRadius(
          GEOMETRY.INNER_RING_RADIUS,
          sector,
          1
        ),
        variableRingRadius(
          GEOMETRY.INNER_RING_RADIUS,
          (sector + 1) %
          GEOMETRY.PRIMARY_SECTORS,
          1
        ),
        variableRingRadius(
          GEOMETRY.MIDDLE_RING_RADIUS,
          sector,
          2
        ),
        variableRingRadius(
          GEOMETRY.MIDDLE_RING_RADIUS,
          (sector + 1) %
          GEOMETRY.PRIMARY_SECTORS,
          2
        ),
        angleA,
        angleB,
        z,
        colorFromPalette(
          COLORS.middle,
          sector,
          0.94 +
          seeded(1500 + sector) * 0.12
        )
      );

      paneCount += 1;
    }

    for (
      let sector = 0;
      sector < GEOMETRY.PRIMARY_SECTORS;
      sector += 1
    ) {
      const angleA =
        angles[sector];

      const angleB =
        nextBoundaryAngle(
          angles,
          sector
        );

      const innerRadiusA =
        variableRingRadius(
          GEOMETRY.MIDDLE_RING_RADIUS,
          sector,
          2
        );

      const innerRadiusB =
        variableRingRadius(
          GEOMETRY.MIDDLE_RING_RADIUS,
          (sector + 1) %
          GEOMETRY.PRIMARY_SECTORS,
          2
        );

      if (
        sector <
        GEOMETRY.ACCENT_SPLIT_COUNT
      ) {
        const midpoint =
          (
            angleA +
            angleB
          ) * 0.5 +
          deterministicAngleVariation(
            1600 + sector
          ) * 0.18;

        const midpointInner =
          (
            innerRadiusA +
            innerRadiusB
          ) * 0.5;

        appendPaneCell(
          positions,
          colors,
          innerRadiusA,
          midpointInner,
          GEOMETRY.OUTER_PANE_RADIUS,
          GEOMETRY.OUTER_PANE_RADIUS,
          angleA,
          midpoint,
          GEOMETRY.PANE_DISC_Z +
          deterministicDepthVariation(
            1700 + sector * 2
          ),
          colorFromPalette(
            COLORS.outer,
            sector * 2,
            0.92 +
            seeded(1800 + sector) * 0.12
          )
        );

        appendPaneCell(
          positions,
          colors,
          midpointInner,
          innerRadiusB,
          GEOMETRY.OUTER_PANE_RADIUS,
          GEOMETRY.OUTER_PANE_RADIUS,
          midpoint,
          angleB,
          GEOMETRY.PANE_DISC_Z +
          deterministicDepthVariation(
            1701 + sector * 2
          ),
          colorFromPalette(
            COLORS.outer,
            sector * 2 + 1,
            0.92 +
            seeded(1900 + sector) * 0.12
          )
        );

        paneCount += 2;
      } else {
        appendPaneCell(
          positions,
          colors,
          innerRadiusA,
          innerRadiusB,
          GEOMETRY.OUTER_PANE_RADIUS,
          GEOMETRY.OUTER_PANE_RADIUS,
          angleA,
          angleB,
          GEOMETRY.PANE_DISC_Z +
          deterministicDepthVariation(
            2000 + sector
          ),
          colorFromPalette(
            COLORS.outer,
            sector,
            0.94 +
            seeded(2100 + sector) * 0.10
          )
        );

        paneCount += 1;
      }
    }

    if (
      paneCount !==
      GEOMETRY.TOTAL_PANE_COUNT
    ) {
      throw new Error(
        "MIRRORLAND_PANE_COUNT_MISMATCH:" +
        paneCount
      );
    }

    return meshResult(
      positions,
      colors,
      {
        paneCount
      }
    );
  }

  function createLeadNetworkMesh() {
    const positions = [];
    const colors = [];

    const angles =
      buildBoundaryAngles();

    for (
      let sector = 0;
      sector < GEOMETRY.PRIMARY_SECTORS;
      sector += 1
    ) {
      createRadialStrip(
        positions,
        colors,
        angles[sector],
        0,
        GEOMETRY.OUTER_PANE_RADIUS,
        GEOMETRY.LEAD_RADIAL_HALF_WIDTH,
        GEOMETRY.LEAD_NETWORK_Z,
        COLORS.lead
      );
    }

    createRingStrip(
      positions,
      colors,
      GEOMETRY.CENTER_MEDALLION_RADIUS,
      GEOMETRY.LEAD_RING_HALF_WIDTH,
      GEOMETRY.LEAD_NETWORK_Z,
      GEOMETRY.RING_SEGMENTS,
      COLORS.lead,
      2200
    );

    createRingStrip(
      positions,
      colors,
      GEOMETRY.INNER_RING_RADIUS,
      GEOMETRY.LEAD_RING_HALF_WIDTH,
      GEOMETRY.LEAD_NETWORK_Z,
      GEOMETRY.RING_SEGMENTS,
      COLORS.lead,
      2300
    );

    createRingStrip(
      positions,
      colors,
      GEOMETRY.MIDDLE_RING_RADIUS,
      GEOMETRY.LEAD_RING_HALF_WIDTH,
      GEOMETRY.LEAD_NETWORK_Z,
      GEOMETRY.RING_SEGMENTS,
      COLORS.lead,
      2400
    );

    for (
      let sector = 0;
      sector < GEOMETRY.ACCENT_SPLIT_COUNT;
      sector += 1
    ) {
      const angleA =
        angles[sector];

      const angleB =
        nextBoundaryAngle(
          angles,
          sector
        );

      const midpoint =
        (
          angleA +
          angleB
        ) * 0.5 +
        deterministicAngleVariation(
          2500 + sector
        ) * 0.18;

      createRadialStrip(
        positions,
        colors,
        midpoint,
        GEOMETRY.MIDDLE_RING_RADIUS,
        GEOMETRY.OUTER_PANE_RADIUS,
        GEOMETRY.LEAD_ACCENT_HALF_WIDTH,
        GEOMETRY.LEAD_NETWORK_Z + 0.002,
        COLORS.lead
      );
    }

    return meshResult(
      positions,
      colors
    );
  }

  function createFrameMesh() {
    const base =
      createAnnulusMesh(
        GEOMETRY.FRAME_INNER_RADIUS,
        GEOMETRY.FRAME_OUTER_RADIUS,
        GEOMETRY.FRAME_RING_Z,
        GEOMETRY.RING_SEGMENTS,
        COLORS.frame,
        COLORS.frameGold
      );

    const positions = [
      ...base.positions
    ];

    const colors = [
      ...base.colors
    ];

    createRingStrip(
      positions,
      colors,
      GEOMETRY.FRAME_INNER_RADIUS + 0.015,
      0.012,
      GEOMETRY.FRAME_RING_Z + 0.004,
      GEOMETRY.RING_SEGMENTS,
      COLORS.frameGold,
      2600
    );

    createRingStrip(
      positions,
      colors,
      GEOMETRY.FRAME_OUTER_RADIUS - 0.018,
      0.010,
      GEOMETRY.FRAME_RING_Z + 0.006,
      GEOMETRY.RING_SEGMENTS,
      COLORS.frameGold,
      2700
    );

    return meshResult(
      positions,
      colors
    );
  }

  function createRearMotionMesh() {
    return createDiscMesh(
      GEOMETRY.INNER_GLASS_RADIUS,
      GEOMETRY.REAR_MOTION_Z,
      GEOMETRY.REAR_SEGMENTS,
      [
        COLORS.rear[0] * 0.72,
        COLORS.rear[1] * 0.78,
        COLORS.rear[2] * 0.82
      ],
      COLORS.rear
    );
  }

  function createHaloMesh() {
    return createAnnulusMesh(
      GEOMETRY.HALO_INNER_RADIUS,
      GEOMETRY.HALO_OUTER_RADIUS,
      GEOMETRY.FRAME_RING_Z - 0.01,
      GEOMETRY.RING_SEGMENTS,
      COLORS.halo,
      [
        COLORS.halo[0] * 0.48,
        COLORS.halo[1] * 0.54,
        COLORS.halo[2] * 0.62
      ]
    );
  }

  function createBuffer(
    gl,
    target,
    data
  ) {
    const buffer =
      gl.createBuffer();

    gl.bindBuffer(
      target,
      buffer
    );

    gl.bufferData(
      target,
      data,
      gl.STATIC_DRAW
    );

    return buffer;
  }

  function buildGpuMesh(
    gl,
    mesh,
    layer
  ) {
    return Object.freeze({
      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.positions
        ),

      color:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.colors
        ),

      vertexCount:
        mesh.vertexCount,

      triangleCount:
        mesh.triangleCount,

      paneCount:
        mesh.paneCount || 0,

      layer
    });
  }

  function deleteMeshResources() {
    if (!state.gl) {
      state.meshes.clear();
      return;
    }

    state.meshes.forEach((mesh) => {
      if (mesh.position) {
        state.gl.deleteBuffer(
          mesh.position
        );
      }

      if (mesh.color) {
        state.gl.deleteBuffer(
          mesh.color
        );
      }
    });

    state.meshes.clear();
  }

  function buildGeometry(gl) {
    const meshes =
      new Map();

    meshes.set(
      "rear",
      buildGpuMesh(
        gl,
        createRearMotionMesh(),
        LAYERS.REAR
      )
    );

    meshes.set(
      "panes",
      buildGpuMesh(
        gl,
        createPaneAssemblyMesh(),
        LAYERS.PANE
      )
    );

    meshes.set(
      "lead",
      buildGpuMesh(
        gl,
        createLeadNetworkMesh(),
        LAYERS.LEAD
      )
    );

    meshes.set(
      "frame",
      buildGpuMesh(
        gl,
        createFrameMesh(),
        LAYERS.FRAME
      )
    );

    meshes.set(
      "halo",
      buildGpuMesh(
        gl,
        createHaloMesh(),
        LAYERS.HALO
      )
    );

    return meshes;
  }

  function bindAttribute(
    gl,
    buffer,
    location,
    size
  ) {
    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.enableVertexAttribArray(
      location
    );

    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function setupProgramAndGeometry() {
    const gl =
      state.gl;

    if (!gl) {
      throw new Error(
        "MIRRORLAND_WINDOW_GL_UNAVAILABLE"
      );
    }

    if (state.program) {
      gl.deleteProgram(
        state.program
      );

      state.program = null;
    }

    deleteMeshResources();

    state.program =
      createProgram(gl);

    state.attribs = {
      position:
        gl.getAttribLocation(
          state.program,
          "aPosition"
        ),

      color:
        gl.getAttribLocation(
          state.program,
          "aColor"
        )
    };

    state.uniforms = {
      viewportScale:
        gl.getUniformLocation(
          state.program,
          "uViewportScale"
        ),

      layerScale:
        gl.getUniformLocation(
          state.program,
          "uLayerScale"
        ),

      depthLift:
        gl.getUniformLocation(
          state.program,
          "uDepthLift"
        ),

      time:
        gl.getUniformLocation(
          state.program,
          "uTime"
        ),

      layer:
        gl.getUniformLocation(
          state.program,
          "uLayer"
        ),

      opacity:
        gl.getUniformLocation(
          state.program,
          "uOpacity"
        ),

      reducedMotion:
        gl.getUniformLocation(
          state.program,
          "uReducedMotion"
        ),

      innerGlassRadius:
        gl.getUniformLocation(
          state.program,
          "uInnerGlassRadius"
        ),

      haloInnerRadius:
        gl.getUniformLocation(
          state.program,
          "uHaloInnerRadius"
        ),

      haloOuterRadius:
        gl.getUniformLocation(
          state.program,
          "uHaloOuterRadius"
        )
    };

    state.meshes =
      buildGeometry(gl);

    state.geometryAvailable =
      (
        state.meshes.size === 5 &&
        state.meshes.get("panes") &&
        state.meshes.get("panes").paneCount ===
          GEOMETRY.TOTAL_PANE_COUNT
      );

    if (!state.geometryAvailable) {
      throw new Error(
        "MIRRORLAND_WINDOW_GEOMETRY_INCOMPLETE"
      );
    }

    RECEIPT.shaderStatus =
      "compiled";

    RECEIPT.programStatus =
      "linked";

    RECEIPT.geometryStatus =
      "built";

    RECEIPT.mirrorlandWindowPaneCount =
      state.meshes.get("panes").paneCount;

    emitReceipt();
  }

  function readControllerDatasets() {
    if (!state.root) {
      return false;
    }

    const dataset =
      state.root.dataset || {};

    const nextState =
      normalizeWindowState(
        dataset.mirrorlandWindowState
      );

    const nextTransitionId =
      boundedTransitionId(
        dataset.mirrorlandTransitionId
      );

    const mediaReducedMotion =
      !!(
        state.mediaQuery &&
        state.mediaQuery.matches
      );

    const nextReducedMotion =
      mediaReducedMotion ||
      exactDatasetBoolean(
        dataset.reducedMotion
      );

    const transitionChanged =
      (
        nextState !==
        state.lastObservedControllerState
      ) ||
      (
        nextTransitionId !==
        state.lastObservedTransitionId
      );

    const reducedMotionChanged =
      nextReducedMotion !==
      state.reducedMotion;

    state.controllerState =
      nextState;

    state.transitionId =
      nextTransitionId;

    state.reducedMotion =
      nextReducedMotion;

    if (transitionChanged) {
      state.lastObservedControllerState =
        nextState;

      state.lastObservedTransitionId =
        nextTransitionId;

      state.transitionStartSeconds =
        performance.now() * 0.001;

      if (
        nextState ===
        WINDOW_STATES.REVEALING
      ) {
        state.lastFailureSignature =
          "";
      }
    }

    return (
      transitionChanged ||
      reducedMotionChanged
    );
  }

  function setDormantProgress() {
    state.progress.frame = 0;
    state.progress.lead = 0;
    state.progress.panes = 0;
    state.progress.rear = 0;
    state.progress.halo = 0;

    state.revealProgress = 0;
    state.withdrawalProgress = 1;
  }

  function setFocusedProgress() {
    state.progress.frame = 1;
    state.progress.lead = 1;
    state.progress.panes = 1;
    state.progress.rear = 1;
    state.progress.halo = 1;

    state.revealProgress = 1;
    state.withdrawalProgress = 0;
  }

  function updateRevealProgress() {
    if (state.reducedMotion) {
      setFocusedProgress();
      return;
    }

    const elapsed =
      Math.max(
        0,
        state.timeSeconds -
        state.transitionStartSeconds
      );

    const overall =
      clamp(
        elapsed /
        TIMING.REVEAL_DURATION_SECONDS
      );

    state.revealProgress =
      overall;

    state.withdrawalProgress =
      1 - overall;

    state.progress.frame =
      rangeProgress(
        overall,
        TIMING.FRAME_REVEAL_START,
        TIMING.FRAME_REVEAL_END
      );

    state.progress.lead =
      rangeProgress(
        overall,
        TIMING.LEAD_REVEAL_START,
        TIMING.LEAD_REVEAL_END
      );

    state.progress.panes =
      rangeProgress(
        overall,
        TIMING.PANE_REVEAL_START,
        TIMING.PANE_REVEAL_END
      );

    state.progress.rear =
      rangeProgress(
        overall,
        TIMING.REAR_REVEAL_START,
        TIMING.REAR_REVEAL_END
      );

    state.progress.halo =
      rangeProgress(
        overall,
        TIMING.HALO_REVEAL_START,
        TIMING.HALO_REVEAL_END
      );
  }

  function updateWithdrawalProgress() {
    if (state.reducedMotion) {
      setDormantProgress();
      return;
    }

    const elapsed =
      Math.max(
        0,
        state.timeSeconds -
        state.transitionStartSeconds
      );

    const overall =
      clamp(
        elapsed /
        TIMING.WITHDRAWAL_DURATION_SECONDS
      );

    state.withdrawalProgress =
      overall;

    state.revealProgress =
      1 - overall;

    state.progress.rear =
      1 -
      rangeProgress(
        overall,
        0.00,
        0.28
      );

    state.progress.panes =
      1 -
      rangeProgress(
        overall,
        0.16,
        0.52
      );

    state.progress.lead =
      1 -
      rangeProgress(
        overall,
        0.40,
        0.72
      );

    state.progress.frame =
      1 -
      rangeProgress(
        overall,
        0.62,
        0.94
      );

    state.progress.halo =
      1 -
      rangeProgress(
        overall,
        0.28,
        0.86
      );
  }

  function updateNavigatingProgress() {
    if (state.reducedMotion) {
      state.progress.frame = 0.88;
      state.progress.lead = 0.76;
      state.progress.panes = 0.72;
      state.progress.rear = 0.58;
      state.progress.halo = 0.54;
      return;
    }

    const elapsed =
      Math.max(
        0,
        state.timeSeconds -
        state.transitionStartSeconds
      );

    const progress =
      smoothstep01(
        elapsed /
        TIMING.NAVIGATING_FADE_SECONDS
      );

    state.progress.frame =
      1 - progress * 0.12;

    state.progress.lead =
      1 - progress * 0.24;

    state.progress.panes =
      1 - progress * 0.28;

    state.progress.rear =
      1 - progress * 0.42;

    state.progress.halo =
      1 - progress * 0.46;
  }

  function updateVisualState() {
    switch (state.controllerState) {
      case WINDOW_STATES.REVEALING:
        updateRevealProgress();
        break;

      case WINDOW_STATES.FOCUSED:
        setFocusedProgress();
        break;

      case WINDOW_STATES.WITHDRAWING:
        updateWithdrawalProgress();
        break;

      case WINDOW_STATES.NAVIGATING:
        updateNavigatingProgress();
        break;

      case WINDOW_STATES.DORMANT:
      default:
        setDormantProgress();
        break;
    }
  }

  function isWindowStable() {
    if (
      state.controllerState ===
      WINDOW_STATES.FOCUSED
    ) {
      return (
        approximately(
          state.progress.frame,
          1
        ) &&
        approximately(
          state.progress.lead,
          1
        ) &&
        approximately(
          state.progress.panes,
          1
        ) &&
        approximately(
          state.progress.rear,
          1
        ) &&
        state.geometryAvailable === true &&
        !state.blockingGlError
      );
    }

    if (
      state.controllerState ===
      WINDOW_STATES.DORMANT
    ) {
      return (
        approximately(
          state.progress.frame,
          0
        ) &&
        approximately(
          state.progress.lead,
          0
        ) &&
        approximately(
          state.progress.panes,
          0
        ) &&
        approximately(
          state.progress.rear,
          0
        ) &&
        !state.blockingGlError
      );
    }

    return false;
  }

  function evaluateCompletion() {
    if (
      !state.root ||
      !state.geometryAvailable ||
      state.blockingGlError
    ) {
      return;
    }

    const completionId =
      state.transitionId;

    if (
      state.controllerState ===
      WINDOW_STATES.REVEALING
    ) {
      const revealReady =
        approximately(
          state.progress.frame,
          1
        ) &&
        approximately(
          state.progress.lead,
          1
        ) &&
        approximately(
          state.progress.panes,
          1
        ) &&
        approximately(
          state.progress.rear,
          1
        ) &&
        approximately(
          state.progress.halo,
          1
        );

      if (
        revealReady &&
        state.lastRevealCompletionId !==
          completionId
      ) {
        state.lastRevealCompletionId =
          completionId;

        dispatchCompletion(
          EVENTS.REVEAL_COMPLETE,
          WINDOW_STATES.FOCUSED,
          completionId
        );
      }

      return;
    }

    if (
      state.controllerState ===
      WINDOW_STATES.WITHDRAWING
    ) {
      const withdrawalReady =
        approximately(
          state.progress.rear,
          0
        ) &&
        approximately(
          state.progress.panes,
          0
        ) &&
        approximately(
          state.progress.lead,
          0
        ) &&
        approximately(
          state.progress.frame,
          0
        ) &&
        approximately(
          state.progress.halo,
          0
        );

      if (
        withdrawalReady &&
        state.lastWithdrawalCompletionId !==
          completionId
      ) {
        state.lastWithdrawalCompletionId =
          completionId;

        dispatchCompletion(
          EVENTS.WITHDRAWAL_COMPLETE,
          WINDOW_STATES.DORMANT,
          completionId
        );
      }
    }
  }

  function resize() {
    if (
      !state.canvas ||
      !state.gl
    ) {
      return;
    }

    const rect =
      state.canvas.getBoundingClientRect();

    const dpr =
      Math.min(
        globalThis.devicePixelRatio || 1,
        QUALITY.devicePixelRatioCap
      );

    const width =
      Math.max(
        1,
        Math.floor(
          rect.width * dpr
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height * dpr
        )
      );

    if (
      state.canvas.width !== width ||
      state.canvas.height !== height
    ) {
      state.canvas.width =
        width;

      state.canvas.height =
        height;
    }

    state.pixelRatio =
      dpr;

    state.width =
      width;

    state.height =
      height;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function viewportScale() {
    const aspect =
      state.width /
      Math.max(1, state.height);

    const base =
      QUALITY.windowScaleNdc /
      GEOMETRY.WINDOW_RADIUS;

    const verticalScale =
      base *
      Math.min(
        1,
        aspect
      );

    return [
      verticalScale /
      Math.max(
        0.001,
        aspect
      ),
      verticalScale
    ];
  }

  function layerOpacity(layerName) {
    if (
      state.controllerState ===
      WINDOW_STATES.DORMANT
    ) {
      if (
        layerName === "frame"
      ) {
        return 0.055;
      }

      if (
        layerName === "halo"
      ) {
        return 0.035;
      }

      return 0;
    }

    const progress =
      layerName === "frame"
        ? state.progress.frame
        : layerName === "lead"
          ? state.progress.lead
          : layerName === "panes"
            ? state.progress.panes
            : layerName === "rear"
              ? state.progress.rear
              : state.progress.halo;

    const baseOpacity =
      layerName === "rear"
        ? 0.72
        : layerName === "panes"
          ? 0.92
          : layerName === "lead"
            ? 0.96
            : layerName === "frame"
              ? 0.98
              : 0.72;

    return (
      clamp(progress) *
      baseOpacity
    );
  }

  function layerScale(layerName) {
    const progress =
      layerName === "frame"
        ? state.progress.frame
        : layerName === "lead"
          ? state.progress.lead
          : layerName === "panes"
            ? state.progress.panes
            : layerName === "rear"
              ? state.progress.rear
              : state.progress.halo;

    if (
      state.controllerState ===
      WINDOW_STATES.DORMANT
    ) {
      return (
        layerName === "frame" ||
        layerName === "halo"
          ? 0.94
          : 0.88
      );
    }

    return (
      0.88 +
      clamp(progress) * 0.12
    );
  }

  function drawMesh(
    meshName,
    drawContext
  ) {
    const mesh =
      state.meshes.get(meshName);

    if (!mesh) return 0;

    const opacity =
      layerOpacity(meshName);

    if (opacity <= 0.001) {
      return 0;
    }

    const gl =
      state.gl;

    bindAttribute(
      gl,
      mesh.position,
      state.attribs.position,
      3
    );

    bindAttribute(
      gl,
      mesh.color,
      state.attribs.color,
      3
    );

    gl.uniform2f(
      state.uniforms.viewportScale,
      drawContext.viewportScale[0],
      drawContext.viewportScale[1]
    );

    gl.uniform1f(
      state.uniforms.layerScale,
      layerScale(meshName)
    );

    gl.uniform1f(
      state.uniforms.depthLift,
      mesh.layer * 0.002
    );

    gl.uniform1f(
      state.uniforms.time,
      state.timeSeconds
    );

    gl.uniform1f(
      state.uniforms.layer,
      mesh.layer
    );

    gl.uniform1f(
      state.uniforms.opacity,
      opacity
    );

    gl.uniform1f(
      state.uniforms.reducedMotion,
      state.reducedMotion
        ? 1
        : 0
    );

    gl.uniform1f(
      state.uniforms.innerGlassRadius,
      GEOMETRY.INNER_GLASS_RADIUS
    );

    gl.uniform1f(
      state.uniforms.haloInnerRadius,
      GEOMETRY.HALO_INNER_RADIUS
    );

    gl.uniform1f(
      state.uniforms.haloOuterRadius,
      GEOMETRY.HALO_OUTER_RADIUS
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    return 1;
  }

  function drawWindow() {
    const gl =
      state.gl;

    if (
      !gl ||
      !state.program ||
      !state.geometryAvailable
    ) {
      return 0;
    }

    const scale =
      viewportScale();

    gl.useProgram(
      state.program
    );

    gl.disable(
      gl.CULL_FACE
    );

    gl.disable(
      gl.DEPTH_TEST
    );

    gl.enable(
      gl.BLEND
    );

    gl.clearColor(
      0,
      0,
      0,
      QUALITY.clearAlpha
    );

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    let drawCalls = 0;

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE
    );

    drawCalls +=
      drawMesh(
        "halo",
        {
          viewportScale: scale
        }
      );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    drawCalls +=
      drawMesh(
        "rear",
        {
          viewportScale: scale
        }
      );

    drawCalls +=
      drawMesh(
        "panes",
        {
          viewportScale: scale
        }
      );

    drawCalls +=
      drawMesh(
        "lead",
        {
          viewportScale: scale
        }
      );

    drawCalls +=
      drawMesh(
        "frame",
        {
          viewportScale: scale
        }
      );

    return drawCalls;
  }

  function inspectGlError(stage) {
    if (!state.gl) return null;

    const error =
      state.gl.getError();

    if (
      error ===
      state.gl.NO_ERROR
    ) {
      state.blockingGlError =
        null;

      RECEIPT.mirrorlandWindowBlockingGlError =
        null;

      return null;
    }

    const value =
      String(error);

    state.blockingGlError =
      value;

    dispatchFailure(
      "MIRRORLAND_WINDOW_GL_ERROR",
      stage,
      value
    );

    return value;
  }

  function stageForCurrentState() {
    if (
      state.controllerState ===
      WINDOW_STATES.REVEALING
    ) {
      return "reveal";
    }

    if (
      state.controllerState ===
      WINDOW_STATES.WITHDRAWING
    ) {
      return "withdrawal";
    }

    if (
      state.controllerState ===
      WINDOW_STATES.FOCUSED
    ) {
      return "focused";
    }

    return "context";
  }

  function renderFrame(nowMilliseconds) {
    state.frameRequested =
      false;

    if (
      state.contextLost ||
      !state.gl ||
      !state.program ||
      !state.geometryAvailable
    ) {
      state.running =
        false;

      emitReceipt();
      return;
    }

    const seconds =
      nowMilliseconds * 0.001;

    const delta =
      state.lastTimeSeconds
        ? Math.min(
            QUALITY.maximumDeltaSeconds,
            seconds -
            state.lastTimeSeconds
          )
        : 0.016;

    state.lastTimeSeconds =
      seconds;

    state.timeSeconds =
      seconds;

    void delta;

    readControllerDatasets();
    updateVisualState();
    resize();

    const drawCalls =
      drawWindow();

    const glError =
      inspectGlError(
        stageForCurrentState()
      );

    RECEIPT.mirrorlandWindowDrawn =
      drawCalls > 0;

    RECEIPT.mirrorlandWindowDrawCallsLastFrame =
      drawCalls;

    if (
      state.controllerState ===
      WINDOW_STATES.DORMANT
    ) {
      RECEIPT.dormantStaticFrameDrawn =
        true;
    }

    if (!glError) {
      evaluateCompletion();
    }

    const continueRendering =
      shouldContinueRendering();

    state.running =
      continueRendering;

    emitReceipt();

    if (continueRendering) {
      requestRenderFrame();
    }
  }

  function requestRenderFrame() {
    if (
      state.frameRequested ||
      state.contextLost ||
      !state.gl ||
      !state.program ||
      !state.geometryAvailable
    ) {
      return false;
    }

    state.frameRequested =
      true;

    state.raf =
      globalThis.requestAnimationFrame(
        renderFrame
      );

    return true;
  }

  function renderStaticFrame() {
    state.running =
      false;

    state.lastTimeSeconds =
      0;

    return requestRenderFrame();
  }

  function startRenderer() {
    if (
      state.contextLost ||
      !state.gl ||
      !state.program ||
      !state.geometryAvailable
    ) {
      return false;
    }

    state.running =
      isActiveAnimationState(
        state.controllerState
      );

    state.lastTimeSeconds =
      0;

    requestRenderFrame();
    emitReceipt();

    return true;
  }

  function stopRenderer(
    status = "stopped"
  ) {
    state.running =
      false;

    if (
      state.raf &&
      state.frameRequested
    ) {
      globalThis.cancelAnimationFrame(
        state.raf
      );
    }

    state.raf = 0;
    state.frameRequested = false;

    emitReceipt({
      renderLoopStatus:
        status
    });
  }

  function handleControllerDatasetChange() {
    const changed =
      readControllerDatasets();

    if (!changed) return;

    if (
      state.controllerState ===
      WINDOW_STATES.DORMANT
    ) {
      setDormantProgress();
      renderStaticFrame();
      return;
    }

    startRenderer();
  }

  function disposeResources() {
    stopRenderer(
      "disposed"
    );

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }

    if (state.mutationObserver) {
      state.mutationObserver.disconnect();
      state.mutationObserver = null;
    }

    if (
      state.mediaQuery &&
      state.mediaQueryHandler
    ) {
      if (
        typeof state.mediaQuery.removeEventListener ===
        "function"
      ) {
        state.mediaQuery.removeEventListener(
          "change",
          state.mediaQueryHandler
        );
      } else if (
        typeof state.mediaQuery.removeListener ===
        "function"
      ) {
        state.mediaQuery.removeListener(
          state.mediaQueryHandler
        );
      }
    }

    state.mediaQuery = null;
    state.mediaQueryHandler = null;

    deleteMeshResources();

    if (
      state.gl &&
      state.program
    ) {
      state.gl.deleteProgram(
        state.program
      );
    }

    state.program =
      null;

    state.geometryAvailable =
      false;

    emitReceipt({
      mirrorlandWindowRendererAvailable:
        false,

      mirrorlandWindowGeometryAvailable:
        false,

      renderLoopStatus:
        "disposed"
    });
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();

        state.contextLost =
          true;

        stopRenderer(
          "held-context-lost"
        );

        dispatchFailure(
          "MIRRORLAND_WINDOW_WEBGL_CONTEXT_LOST",
          "context",
          "WEBGL_CONTEXT_LOST"
        );
      }
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        state.contextLost =
          false;

        state.blockingGlError =
          null;

        RECEIPT.mirrorlandWindowFailureReason =
          null;

        RECEIPT.mirrorlandWindowFailureStage =
          null;

        RECEIPT.mirrorlandWindowBlockingGlError =
          null;

        try {
          setupProgramAndGeometry();
          readControllerDatasets();

          if (
            state.controllerState ===
            WINDOW_STATES.DORMANT
          ) {
            setDormantProgress();
            renderStaticFrame();
          } else {
            startRenderer();
          }

          emitReceipt({
            webglContextStatus:
              "restored"
          });
        } catch (error) {
          dispatchFailure(
            "MIRRORLAND_WINDOW_CONTEXT_RESTORE_FAILURE",
            "context",
            error &&
            error.message
              ? error.message
              : String(error)
          );
        }
      }
    );
  }

  function bindObservers() {
    if (
      typeof ResizeObserver ===
      "function"
    ) {
      state.resizeObserver =
        new ResizeObserver(() => {
          resize();
          renderStaticFrame();
        });

      state.resizeObserver.observe(
        state.mount
      );
    }

    if (
      typeof MutationObserver ===
      "function"
    ) {
      state.mutationObserver =
        new MutationObserver(
          handleControllerDatasetChange
        );

      state.mutationObserver.observe(
        state.root,
        {
          attributes: true,
          attributeFilter: [
            "data-mirrorland-window-state",
            "data-mirrorland-transition-id",
            "data-reduced-motion"
          ]
        }
      );
    }

    if (
      typeof globalThis.matchMedia ===
      "function"
    ) {
      state.mediaQuery =
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        );

      state.mediaQueryHandler =
        () => {
          const changed =
            readControllerDatasets();

          if (changed) {
            startRenderer();
          }
        };

      if (
        typeof state.mediaQuery.addEventListener ===
        "function"
      ) {
        state.mediaQuery.addEventListener(
          "change",
          state.mediaQueryHandler
        );
      } else if (
        typeof state.mediaQuery.addListener ===
        "function"
      ) {
        state.mediaQuery.addListener(
          state.mediaQueryHandler
        );
      }
    }
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_MIRRORLAND_WINDOW =
      Object.freeze({
        contract:
          CONTRACT,

        geometry:
          GEOMETRY,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        start:
          startRenderer,

        renderStatic:
          renderStaticFrame,

        stop:
          stopRenderer,

        dispose:
          disposeResources
      });
  }

  function init() {
    exposeApi();

    try {
      state.root =
        findRoot();

      if (!state.root) {
        throw new Error(
          "MISSING_DATA_COMPASS_ROOT"
        );
      }

      state.scene =
        findScene(state.root);

      if (!state.scene) {
        throw new Error(
          "MISSING_DATA_COMPASS_SCENE"
        );
      }

      state.mount =
        findMount(state.scene);

      if (!state.mount) {
        throw new Error(
          "MISSING_DATA_COMPASS_MIRRORLAND_WINDOW_MOUNT"
        );
      }

      state.receiptSlot =
        state.root.querySelector(
          "[data-compass-mirrorland-window-receipt]"
        );

      emitReceipt({
        initializationStage:
          "DOM_RESOLUTION"
      });

      state.canvas =
        ensureCanvas(state.mount);

      emitReceipt({
        canvasStatus:
          "created-or-found",

        initializationStage:
          "CANVAS"
      });

      state.gl =
        getGL(state.canvas);

      if (!state.gl) {
        throw new Error(
          "WEBGL_CONTEXT_UNAVAILABLE"
        );
      }

      bindContextLifecycle();

      state.gl.enable(
        state.gl.BLEND
      );

      state.gl.blendFunc(
        state.gl.SRC_ALPHA,
        state.gl.ONE_MINUS_SRC_ALPHA
      );

      state.gl.disable(
        state.gl.CULL_FACE
      );

      setupProgramAndGeometry();
      bindObservers();
      readControllerDatasets();
      resize();

      RECEIPT.mirrorlandWindowRendererAvailable =
        true;

      RECEIPT.mirrorlandWindowGeometryAvailable =
        true;

      emitReceipt({
        initializationStage:
          "INITIAL_STATIC_RENDER"
      });

      if (
        state.controllerState ===
        WINDOW_STATES.DORMANT
      ) {
        setDormantProgress();
        renderStaticFrame();
      } else {
        startRenderer();
      }
    } catch (error) {
      const message =
        error &&
        error.message
          ? error.message
          : String(error);

      dispatchFailure(
        message.startsWith("MIRRORLAND_") ||
        message.startsWith("WEBGL_") ||
        message.startsWith("MISSING_")
          ? message
          : "MIRRORLAND_WINDOW_INITIALIZATION_FAILURE",

        message.includes("GEOMETRY") ||
        message.includes("PANE")
          ? "geometry"
          : "initialization",

        message
      );
    }
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();
