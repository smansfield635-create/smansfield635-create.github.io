/* /assets/compass/compass.mirrorland-window.js
   DGB Compass — Self-contained Mirrorland stained-glass Window renderer.

   Responsibilities:
   - construct and validate Mirrorland geometry internally;
   - render the dormant miniature and active Window states;
   - read controller state from Compass root datasets;
   - emit reveal, withdrawal, and failure events;
   - provide a visible fallback glint when WebGL is unavailable.

   This file does not own:
   - navigation;
   - Compass state;
   - semantic controls;
   - pointer handling;
   - cardinal or room rendering;
   - constellation gestures;
   - external geometry objects.

   Script order:
   1. compass.controller.js
   2. compass.mirrorland-window.js
   3. compass.crystals.js
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_MIRRORLAND_WINDOW_RENDERER_v5",
    file: "/assets/compass/compass.mirrorland-window.js",
    source: "compass.mirrorland-window",
    role: "SELF_CONTAINED_MIRRORLAND_WINDOW_RENDERER",
    geometryOwnership: "INTERNAL",
    externalGeometryRequired: false,
    pointerAuthority: false,
    controllerAuthority: false,
    navigationAuthority: false,
    visualPassClaimed: false
  });

  const STATES = Object.freeze({
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

    FAILURE:
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
  });

  const PROFILE = Object.freeze({
    dormantScale: 0.31,
    focusedScale: 1,
    navigatingScale: 1.04,
    revealDurationMs: 920,
    withdrawalDurationMs: 760,
    dormantMotionOpacity: 0,
    focusedMotionOpacity: 0.84,
    reducedMotionOpacity: 0.34
  });

  const QUALITY = Object.freeze({
    devicePixelRatioCap: 2,
    dormantFrameIntervalMs: 1000 / 24,
    activeFrameIntervalMs: 1000 / 60,
    fieldOfView: Math.PI / 4.7,
    near: 0.1,
    far: 40,
    cameraZDesktop: 3.45,
    cameraZMobile: 3.72,
    mobileAspectThreshold: 0.82,
    completionTolerance: 0.002
  });

  const PALETTE = Object.freeze({
    frame: [0.43, 0.29, 0.12],
    frameHighlight: [0.82, 0.62, 0.27],
    lead: [0.13, 0.16, 0.22],
    glass: Object.freeze([
      [0.14, 0.58, 0.76],
      [0.23, 0.38, 0.75],
      [0.49, 0.24, 0.68],
      [0.78, 0.35, 0.29],
      [0.88, 0.63, 0.20],
      [0.20, 0.68, 0.57],
      [0.29, 0.48, 0.78],
      [0.62, 0.29, 0.59],
      [0.83, 0.44, 0.25],
      [0.74, 0.69, 0.28],
      [0.18, 0.61, 0.70],
      [0.37, 0.36, 0.72]
    ])
  });

  const state = {
    root: null,
    scene: null,
    mount: null,
    canvas: null,
    fallback: null,

    gl: null,
    program: null,
    attributes: null,
    uniforms: null,
    meshes: Object.create(null),

    running: false,
    held: false,
    raf: 0,
    lastFrameMs: 0,

    width: 1,
    height: 1,
    pixelRatio: 1,

    currentState: STATES.DORMANT,
    previousState: "",
    stateEnteredAtMs: 0,

    transitionId: "",
    completionEmitted: false,
    lastCompletionKey: "",

    reducedMotion: false,

    profile: {
      scale: PROFILE.dormantScale,
      reveal: 0,
      motionOpacity: 0,
      glassLight: 0.54,
      frameLight: 0.72
    },

    observer: null,
    failureSignature: ""
  };

  const RECEIPT = {
    contractId: CONTRACT.id,
    rendererSource: CONTRACT.source,
    rendererRole: CONTRACT.role,

    rendererInitialized: false,
    rendererAvailable: false,

    geometryOwnership: "INTERNAL",
    externalGeometryRequired: false,
    geometryConstructed: false,
    geometryValidated: false,

    frameVertexCount: 0,
    leadVertexCount: 0,
    glassVertexCount: 0,
    motionVertexCount: 0,

    currentState: STATES.DORMANT,
    previousState: "",
    activeTransitionId: "",

    currentScale: PROFILE.dormantScale,
    revealProgress: 0,
    motionOpacity: 0,

    reducedMotion: false,
    transitionRunning: false,
    transitionCompletionEmitted: false,
    lastControllerCompletionEvent: "",

    canvasStatus: "pending",
    webglStatus: "pending",
    shaderStatus: "pending",
    bufferStatus: "pending",
    renderLoopStatus: "pending",

    fallbackGlintCreated: false,
    fallbackGlintVisible: false,

    drawCallsLastFrame: 0,
    glError: "not-checked",

    failureStage: null,
    failureReason: null,
    visualPassClaimed: false
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function first(selectors, root = document) {
    for (const selector of selectors) {
      const element = $(selector, root);

      if (element) {
        return element;
      }
    }

    return null;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function easeOutCubic(value) {
    const t = clamp(value, 0, 1);
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(value) {
    const t = clamp(value, 0, 1);

    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function normalizeState(value) {
    const requested = String(
      value || STATES.DORMANT
    )
      .trim()
      .toLowerCase();

    return Object.values(STATES).includes(requested)
      ? requested
      : STATES.DORMANT;
  }

  function transitionIdFromRoot() {
    return String(
      state.root &&
      state.root.dataset
        ? state.root.dataset.mirrorlandTransitionId || ""
        : ""
    );
  }

  function dispatch(type, detail) {
    (state.root || document).dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        detail
      })
    );
  }

  function emitReceipt(extra = {}) {
    Object.assign(
      RECEIPT,
      {
        rendererAvailable:
          !!state.gl &&
          !state.held,

        currentState:
          state.currentState,

        previousState:
          state.previousState,

        activeTransitionId:
          state.transitionId,

        currentScale:
          state.profile.scale,

        revealProgress:
          state.profile.reveal,

        motionOpacity:
          state.profile.motionOpacity,

        reducedMotion:
          state.reducedMotion,

        transitionRunning:
          state.currentState === STATES.REVEALING ||
          state.currentState === STATES.WITHDRAWING,

        transitionCompletionEmitted:
          state.completionEmitted,

        fallbackGlintCreated:
          !!state.fallback,

        fallbackGlintVisible:
          !!state.fallback &&
          state.fallback.hidden !== true,

        visualPassClaimed: false
      },
      extra,
      {
        visualPassClaimed: false
      }
    );

    const receipt = Object.freeze({
      ...RECEIPT
    });

    const serialized = JSON.stringify(receipt);

    if (state.root) {
      state.root.dataset.compassMirrorlandWindowReceipt =
        serialized;

      state.root.dataset.compassMirrorlandWindowRendererStatus =
        RECEIPT.failureReason
          ? "held"
          : "available";
    }

    if (state.canvas) {
      state.canvas.dataset.compassMirrorlandWindowReceipt =
        serialized;
    }

    const slot = state.root
      ? $(
          "[data-compass-mirrorland-window-receipt]",
          state.root
        )
      : null;

    if (slot) {
      slot.value = serialized;
      slot.textContent = serialized;
    }

    globalThis.DGB_COMPASS_MIRRORLAND_WINDOW_RECEIPT =
      receipt;
  }

  function installFallbackStyle() {
    if (
      document.getElementById(
        "dgb-mirrorland-window-fallback-style"
      )
    ) {
      return;
    }

    const style = document.createElement("style");

    style.id =
      "dgb-mirrorland-window-fallback-style";

    style.textContent = `
      @keyframes dgb-mirrorland-window-glint {
        0%, 68%, 100% {
          opacity: .12;
          transform: translate(-50%, -50%) scale(.76) rotate(0deg);
        }

        74% {
          opacity: .74;
          transform: translate(-50%, -50%) scale(1.08) rotate(7deg);
        }

        82% {
          opacity: .30;
          transform: translate(-50%, -50%) scale(.94) rotate(-4deg);
        }
      }

      [data-compass-mirrorland-window-fallback-glint] {
        position: absolute;
        left: 50%;
        top: 50%;
        width: clamp(34px, 7vw, 58px);
        aspect-ratio: 1;
        z-index: 1;
        pointer-events: none;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background:
          linear-gradient(
            45deg,
            transparent 42%,
            rgba(255, 238, 179, .72) 49%,
            transparent 56%
          ),
          linear-gradient(
            -45deg,
            transparent 42%,
            rgba(117, 221, 255, .52) 49%,
            transparent 56%
          ),
          radial-gradient(
            circle,
            rgba(255, 247, 214, .72) 0 2px,
            rgba(216, 184, 106, .24) 3px 12%,
            rgba(124, 220, 255, .12) 24%,
            transparent 64%
          );
        box-shadow:
          0 0 14px rgba(255, 239, 182, .18),
          0 0 30px rgba(124, 220, 255, .13);
        animation:
          dgb-mirrorland-window-glint
          6.8s
          ease-in-out
          infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        [data-compass-mirrorland-window-fallback-glint] {
          animation: none;
          opacity: .30;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureFallback() {
    if (!state.mount) return null;

    installFallbackStyle();

    const existing = $(
      "[data-compass-mirrorland-window-fallback-glint]",
      state.mount
    );

    if (existing) {
      state.fallback = existing;
      return existing;
    }

    const glint = document.createElement("span");

    glint.setAttribute(
      "data-compass-mirrorland-window-fallback-glint",
      "true"
    );

    glint.setAttribute(
      "aria-hidden",
      "true"
    );

    state.mount.appendChild(glint);
    state.fallback = glint;

    emitReceipt({
      fallbackGlintCreated: true,
      fallbackGlintVisible: true
    });

    return glint;
  }

  function showFallback() {
    const glint = ensureFallback();

    if (glint) {
      glint.hidden = false;
    }
  }

  function hideFallback() {
    if (state.fallback) {
      state.fallback.hidden = true;
    }
  }

  function failureReasonCode(reason) {
    return String(
      reason || "MIRRORLAND_WINDOW_RENDER_FAILURE"
    )
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9:_-]+/g, "_")
      .slice(0, 120);
  }

  function notifyFailure(reason, stage = "context") {
    const reasonCode =
      failureReasonCode(reason);

    const signature =
      `${reasonCode}:${stage}`;

    if (signature === state.failureSignature) {
      return;
    }

    state.failureSignature = signature;

    dispatch(
      EVENTS.FAILURE,
      Object.freeze({
        source: CONTRACT.source,
        reasonCode,
        stage,
        glError: null
      })
    );
  }

  function fail(reason, stage = "context") {
    state.held = true;
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
    }

    showFallback();

    emitReceipt({
      rendererInitialized: false,
      rendererAvailable: false,
      renderLoopStatus: "held",
      failureStage: stage,
      failureReason: reason,
      glError:
        state.gl
          ? String(state.gl.getError())
          : "unavailable"
    });

    notifyFailure(reason, stage);
  }

  function ensureCanvas() {
    const existing = $(
      "canvas[data-compass-mirrorland-window-canvas]",
      state.mount
    );

    if (existing) {
      return existing;
    }

    const canvas = document.createElement("canvas");

    canvas.setAttribute(
      "data-compass-mirrorland-window-canvas",
      "true"
    );

    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";

    if (
      getComputedStyle(state.mount).position === "static"
    ) {
      state.mount.style.position = "absolute";
      state.mount.style.inset = "0";
    }

    state.mount.appendChild(canvas);

    return canvas;
  }

  function createContext(canvas) {
    return canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false
    });
  }

  function pushTriangle(
    positions,
    colors,
    a,
    b,
    c,
    color
  ) {
    [a, b, c].forEach((point) => {
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
    });
  }

  function buildAnnulus(
    innerRadius,
    outerRadius,
    segments,
    z,
    color
  ) {
    const positions = [];
    const colors = [];

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const a0 =
        Math.PI * 2 * index / segments;

      const a1 =
        Math.PI * 2 * (index + 1) / segments;

      const outer0 = [
        Math.cos(a0) * outerRadius,
        Math.sin(a0) * outerRadius,
        z
      ];

      const outer1 = [
        Math.cos(a1) * outerRadius,
        Math.sin(a1) * outerRadius,
        z
      ];

      const inner0 = [
        Math.cos(a0) * innerRadius,
        Math.sin(a0) * innerRadius,
        z
      ];

      const inner1 = [
        Math.cos(a1) * innerRadius,
        Math.sin(a1) * innerRadius,
        z
      ];

      pushTriangle(
        positions,
        colors,
        outer0,
        outer1,
        inner1,
        color
      );

      pushTriangle(
        positions,
        colors,
        outer0,
        inner1,
        inner0,
        color
      );
    }

    return { positions, colors };
  }

  function buildGlass() {
    const positions = [];
    const colors = [];
    const segments = PALETTE.glass.length;
    const radius = 0.86;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const a0 =
        Math.PI * 2 * index / segments -
        Math.PI / 2;

      const a1 =
        Math.PI * 2 * (index + 1) / segments -
        Math.PI / 2;

      const midpoint =
        (a0 + a1) / 2;

      const center = [0, 0, 0];
      const inner = [
        Math.cos(midpoint) * 0.22,
        Math.sin(midpoint) * 0.22,
        0
      ];

      const outer0 = [
        Math.cos(a0) * radius,
        Math.sin(a0) * radius,
        0
      ];

      const outer1 = [
        Math.cos(a1) * radius,
        Math.sin(a1) * radius,
        0
      ];

      const color =
        PALETTE.glass[index];

      pushTriangle(
        positions,
        colors,
        center,
        outer0,
        inner,
        color
      );

      pushTriangle(
        positions,
        colors,
        inner,
        outer0,
        outer1,
        color
      );

      pushTriangle(
        positions,
        colors,
        center,
        inner,
        outer1,
        color.map((value) =>
          Math.min(1, value * 1.08)
        )
      );
    }

    return { positions, colors };
  }

  function buildRadialBar(
    angle,
    innerRadius,
    outerRadius,
    halfWidth,
    z,
    color
  ) {
    const direction = [
      Math.cos(angle),
      Math.sin(angle)
    ];

    const perpendicular = [
      -direction[1],
      direction[0]
    ];

    const a = [
      direction[0] * innerRadius +
        perpendicular[0] * halfWidth,
      direction[1] * innerRadius +
        perpendicular[1] * halfWidth,
      z
    ];

    const b = [
      direction[0] * outerRadius +
        perpendicular[0] * halfWidth,
      direction[1] * outerRadius +
        perpendicular[1] * halfWidth,
      z
    ];

    const c = [
      direction[0] * outerRadius -
        perpendicular[0] * halfWidth,
      direction[1] * outerRadius -
        perpendicular[1] * halfWidth,
      z
    ];

    const d = [
      direction[0] * innerRadius -
        perpendicular[0] * halfWidth,
      direction[1] * innerRadius -
        perpendicular[1] * halfWidth,
      z
    ];

    const positions = [];
    const colors = [];

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

    return { positions, colors };
  }

  function combineGeometry(parts) {
    const positions = [];
    const colors = [];

    parts.forEach((part) => {
      positions.push(...part.positions);
      colors.push(...part.colors);
    });

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      vertexCount: positions.length / 3
    };
  }

  function constructGeometry() {
    const frame = combineGeometry([
      buildAnnulus(
        0.88,
        1.04,
        64,
        0.05,
        PALETTE.frame
      ),
      buildAnnulus(
        0.98,
        1.08,
        64,
        0.08,
        PALETTE.frameHighlight
      )
    ]);

    const leadParts = [
      buildAnnulus(
        0.19,
        0.245,
        48,
        0.07,
        PALETTE.lead
      ),
      buildAnnulus(
        0.845,
        0.89,
        64,
        0.07,
        PALETTE.lead
      )
    ];

    for (
      let index = 0;
      index < 12;
      index += 1
    ) {
      leadParts.push(
        buildRadialBar(
          Math.PI * 2 * index / 12 -
            Math.PI / 2,
          0.20,
          0.88,
          0.018,
          0.075,
          PALETTE.lead
        )
      );
    }

    const lead = combineGeometry(leadParts);
    const glass = combineGeometry([buildGlass()]);

    const motion = combineGeometry([
      {
        positions: [
          -0.86, -0.86, -0.05,
           0.86, -0.86, -0.05,
           0.86,  0.86, -0.05,

          -0.86, -0.86, -0.05,
           0.86,  0.86, -0.05,
          -0.86,  0.86, -0.05
        ],
        colors: [
          0.04, 0.18, 0.30,
          0.04, 0.18, 0.30,
          0.04, 0.18, 0.30,

          0.04, 0.18, 0.30,
          0.04, 0.18, 0.30,
          0.04, 0.18, 0.30
        ]
      }
    ]);

    validateGeometry({
      frame,
      lead,
      glass,
      motion
    });

    return {
      frame,
      lead,
      glass,
      motion
    };
  }

  function validateMesh(mesh, label) {
    if (
      !mesh ||
      !(mesh.positions instanceof Float32Array) ||
      !(mesh.colors instanceof Float32Array)
    ) {
      throw new Error(
        `MIRRORLAND_${label}_GEOMETRY_INVALID`
      );
    }

    if (
      mesh.positions.length === 0 ||
      mesh.positions.length % 3 !== 0 ||
      mesh.colors.length !== mesh.positions.length
    ) {
      throw new Error(
        `MIRRORLAND_${label}_ATTRIBUTE_LENGTH_INVALID`
      );
    }

    for (
      let index = 0;
      index < mesh.positions.length;
      index += 1
    ) {
      if (!Number.isFinite(mesh.positions[index])) {
        throw new Error(
          `MIRRORLAND_${label}_NONFINITE_POSITION`
        );
      }
    }
  }

  function validateGeometry(geometry) {
    validateMesh(geometry.frame, "FRAME");
    validateMesh(geometry.lead, "LEAD");
    validateMesh(geometry.glass, "GLASS");
    validateMesh(geometry.motion, "MOTION");
  }

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    varying vec3 vColor;
    varying vec2 vLocal;

    void main() {
      vColor = aColor;
      vLocal = aPosition.xy;

      gl_Position =
        uProjection *
        uView *
        uModel *
        vec4(aPosition, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vColor;
    varying vec2 vLocal;

    uniform float uTime;
    uniform float uKind;
    uniform float uOpacity;
    uniform float uReveal;
    uniform float uLight;
    uniform float uReducedMotion;

    float hash21(vec2 p) {
      return fract(
        sin(
          dot(
            p,
            vec2(127.1, 311.7)
          )
        ) *
        43758.5453123
      );
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(
        mix(
          hash21(i),
          hash21(i + vec2(1.0, 0.0)),
          u.x
        ),
        mix(
          hash21(i + vec2(0.0, 1.0)),
          hash21(i + vec2(1.0, 1.0)),
          u.x
        ),
        u.y
      );
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;

      for (int index = 0; index < 4; index++) {
        value += noise(p) * amplitude;
        p = p * 2.02 + vec2(17.1, 9.2);
        amplitude *= 0.5;
      }

      return value;
    }

    void main() {
      if (uKind < 0.5) {
        vec3 color =
          vColor *
          (
            0.68 +
            uLight * 0.38
          );

        gl_FragColor =
          vec4(
            color,
            uOpacity
          );

        return;
      }

      if (uKind < 1.5) {
        float grain =
          hash21(
            floor(vLocal * 90.0)
          );

        vec3 color =
          vColor *
          (
            0.84 +
            grain * 0.12 +
            uLight * 0.18
          );

        gl_FragColor =
          vec4(
            color,
            uOpacity
          );

        return;
      }

      if (uKind < 2.5) {
        float radius =
          length(vLocal);

        float edge =
          smoothstep(
            0.34,
            0.94,
            radius
          );

        float shimmer =
          uReducedMotion > 0.5
            ? 0.0
            : sin(
                uTime * 1.15 +
                vLocal.x * 8.0 -
                vLocal.y * 5.0
              ) * 0.04;

        vec3 color =
          vColor *
          (
            0.78 +
            uLight * 0.34 +
            shimmer
          );

        color +=
          vec3(0.16, 0.29, 0.42) *
          edge *
          0.18;

        gl_FragColor =
          vec4(
            color,
            uOpacity *
            (
              0.68 +
              uReveal * 0.20
            )
          );

        return;
      }

      float radius =
        length(vLocal / 0.86);

      if (radius > 1.0) {
        discard;
      }

      float time =
        uReducedMotion > 0.5
          ? 0.0
          : uTime;

      float distant =
        fbm(
          vLocal * 2.5 +
          vec2(
            time * 0.025,
            -time * 0.017
          )
        );

      float veil =
        fbm(
          vLocal * 4.2 +
          vec2(
            -time * 0.018,
            time * 0.023
          )
        );

      vec3 color =
        vec3(0.012, 0.034, 0.078);

      color +=
        vec3(0.06, 0.31, 0.42) *
        smoothstep(0.44, 0.80, distant) *
        0.72;

      color +=
        vec3(0.30, 0.10, 0.38) *
        smoothstep(0.38, 0.78, veil) *
        0.35;

      color +=
        vec3(0.52, 0.31, 0.08) *
        pow(
          smoothstep(0.54, 0.84, distant),
          2.2
        ) *
        0.22;

      float fade =
        1.0 -
        smoothstep(
          0.82,
          1.0,
          radius
        );

      gl_FragColor =
        vec4(
          color,
          uOpacity *
          fade *
          smoothstep(
            0.05,
            0.72,
            uReveal
          )
        );
    }
  `;

  function compileShader(type, source) {
    const gl = state.gl;
    const shader = gl.createShader(type);

    if (!shader) {
      throw new Error(
        "MIRRORLAND_SHADER_CREATION_FAILED"
      );
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const message =
        gl.getShaderInfoLog(shader) ||
        "UNKNOWN_SHADER_ERROR";

      gl.deleteShader(shader);

      throw new Error(
        "MIRRORLAND_SHADER_COMPILE_FAILED:" +
        message
      );
    }

    return shader;
  }

  function buildProgram() {
    const gl = state.gl;

    const vertex = compileShader(
      gl.VERTEX_SHADER,
      vertexShaderSource
    );

    const fragment = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const program = gl.createProgram();

    if (!program) {
      throw new Error(
        "MIRRORLAND_PROGRAM_CREATION_FAILED"
      );
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const message =
        gl.getProgramInfoLog(program) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(program);

      throw new Error(
        "MIRRORLAND_PROGRAM_LINK_FAILED:" +
        message
      );
    }

    return program;
  }

  function createBuffer(data) {
    const gl = state.gl;
    const buffer = gl.createBuffer();

    if (!buffer) {
      throw new Error(
        "MIRRORLAND_BUFFER_CREATION_FAILED"
      );
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      data,
      gl.STATIC_DRAW
    );

    return buffer;
  }

  function buildGpuMesh(mesh) {
    return {
      position: createBuffer(mesh.positions),
      color: createBuffer(mesh.colors),
      vertexCount: mesh.vertexCount
    };
  }

  function buildResources() {
    const geometry = constructGeometry();

    state.meshes.frame =
      buildGpuMesh(geometry.frame);

    state.meshes.lead =
      buildGpuMesh(geometry.lead);

    state.meshes.glass =
      buildGpuMesh(geometry.glass);

    state.meshes.motion =
      buildGpuMesh(geometry.motion);

    emitReceipt({
      geometryConstructed: true,
      geometryValidated: true,

      frameVertexCount:
        geometry.frame.vertexCount,

      leadVertexCount:
        geometry.lead.vertexCount,

      glassVertexCount:
        geometry.glass.vertexCount,

      motionVertexCount:
        geometry.motion.vertexCount,

      bufferStatus: "built"
    });
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(a, b) {
    const output =
      new Array(16).fill(0);

    for (
      let row = 0;
      row < 4;
      row += 1
    ) {
      for (
        let column = 0;
        column < 4;
        column += 1
      ) {
        for (
          let index = 0;
          index < 4;
          index += 1
        ) {
          output[column * 4 + row] +=
            a[index * 4 + row] *
            b[column * 4 + index];
        }
      }
    }

    return output;
  }

  function translate4(x, y, z) {
    const matrix = identity4();

    matrix[12] = x;
    matrix[13] = y;
    matrix[14] = z;

    return matrix;
  }

  function scale4(x, y, z) {
    const matrix = identity4();

    matrix[0] = x;
    matrix[5] = y;
    matrix[10] = z;

    return matrix;
  }

  function perspective4(
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const factor =
      1 / Math.tan(fieldOfView / 2);

    const inverse =
      1 / (near - far);

    return [
      factor / aspect,
      0,
      0,
      0,

      0,
      factor,
      0,
      0,

      0,
      0,
      (far + near) * inverse,
      -1,

      0,
      0,
      2 * far * near * inverse,
      0
    ];
  }

  function resize() {
    const rect =
      state.canvas.getBoundingClientRect();

    const ratio = Math.min(
      globalThis.devicePixelRatio || 1,
      QUALITY.devicePixelRatioCap
    );

    const width = Math.max(
      1,
      Math.floor(rect.width * ratio)
    );

    const height = Math.max(
      1,
      Math.floor(rect.height * ratio)
    );

    if (
      state.canvas.width !== width ||
      state.canvas.height !== height
    ) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.width = width;
    state.height = height;
    state.pixelRatio = ratio;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function readControllerState(nowMs) {
    const dataset = state.root.dataset || {};

    const requested = normalizeState(
      dataset.mirrorlandWindowState
    );

    if (requested !== state.currentState) {
      state.previousState =
        state.currentState;

      state.currentState =
        requested;

      state.stateEnteredAtMs =
        nowMs;

      state.completionEmitted =
        false;

      state.transitionId =
        requested === STATES.REVEALING ||
        requested === STATES.WITHDRAWING
          ? transitionIdFromRoot()
          : "";
    } else if (
      (
        requested === STATES.REVEALING ||
        requested === STATES.WITHDRAWING
      ) &&
      !state.transitionId
    ) {
      state.transitionId =
        transitionIdFromRoot();
    }

    state.reducedMotion =
      (
        typeof globalThis.matchMedia === "function" &&
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) ||
      dataset.reducedMotion === "true";
  }

  function profileForState(nowMs) {
    if (state.currentState === STATES.DORMANT) {
      return {
        scale: PROFILE.dormantScale,
        reveal: 0,
        motionOpacity: 0,
        glassLight: 0.54,
        frameLight: 0.72
      };
    }

    if (state.currentState === STATES.REVEALING) {
      const duration =
        state.reducedMotion
          ? 1
          : PROFILE.revealDurationMs;

      const progress = clamp(
        (
          nowMs -
          state.stateEnteredAtMs
        ) /
        duration,
        0,
        1
      );

      const eased =
        easeOutCubic(progress);

      return {
        scale: lerp(
          PROFILE.dormantScale,
          PROFILE.focusedScale,
          eased
        ),

        reveal: progress,

        motionOpacity:
          state.reducedMotion
            ? lerp(
                0,
                PROFILE.reducedMotionOpacity,
                smoothstep(progress)
              )
            : lerp(
                0,
                PROFILE.focusedMotionOpacity,
                smoothstep(
                  clamp(
                    (progress - 0.28) / 0.72,
                    0,
                    1
                  )
                )
              ),

        glassLight:
          lerp(0.54, 1, eased),

        frameLight:
          lerp(0.72, 1, eased)
      };
    }

    if (state.currentState === STATES.WITHDRAWING) {
      const duration =
        state.reducedMotion
          ? 1
          : PROFILE.withdrawalDurationMs;

      const progress = clamp(
        (
          nowMs -
          state.stateEnteredAtMs
        ) /
        duration,
        0,
        1
      );

      const eased =
        easeInOutCubic(progress);

      return {
        scale: lerp(
          PROFILE.focusedScale,
          PROFILE.dormantScale,
          eased
        ),

        reveal: 1 - progress,

        motionOpacity: lerp(
          state.reducedMotion
            ? PROFILE.reducedMotionOpacity
            : PROFILE.focusedMotionOpacity,
          0,
          smoothstep(progress)
        ),

        glassLight:
          lerp(1, 0.54, eased),

        frameLight:
          lerp(1, 0.72, eased)
      };
    }

    if (state.currentState === STATES.NAVIGATING) {
      return {
        scale: PROFILE.navigatingScale,
        reveal: 1,
        motionOpacity:
          state.reducedMotion
            ? PROFILE.reducedMotionOpacity
            : 1,
        glassLight: 1.08,
        frameLight: 1.08
      };
    }

    return {
      scale: PROFILE.focusedScale,
      reveal: 1,
      motionOpacity:
        state.reducedMotion
          ? PROFILE.reducedMotionOpacity
          : PROFILE.focusedMotionOpacity,
      glassLight: 1,
      frameLight: 1
    };
  }

  function emitCompletion() {
    if (state.completionEmitted) {
      return;
    }

    const completionId =
      state.transitionId ||
      transitionIdFromRoot();

    if (!completionId) {
      fail(
        "MIRRORLAND_WINDOW_COMPLETION_ID_MISSING",
        state.currentState === STATES.WITHDRAWING
          ? "withdrawal"
          : "reveal"
      );

      return;
    }

    const eventName =
      state.currentState === STATES.WITHDRAWING
        ? EVENTS.WITHDRAWAL_COMPLETE
        : EVENTS.REVEAL_COMPLETE;

    const reportedState =
      state.currentState === STATES.WITHDRAWING
        ? STATES.DORMANT
        : STATES.FOCUSED;

    const key =
      `${eventName}:${completionId}`;

    if (key === state.lastCompletionKey) {
      return;
    }

    state.completionEmitted = true;
    state.lastCompletionKey = key;

    dispatch(
      eventName,
      Object.freeze({
        source: CONTRACT.source,
        windowState: reportedState,
        completionId: String(completionId)
      })
    );

    emitReceipt({
      lastControllerCompletionEvent:
        eventName
    });
  }

  function updateProfile(nowMs) {
    state.profile =
      profileForState(nowMs);

    if (
      state.currentState === STATES.REVEALING &&
      state.profile.reveal >=
        1 - QUALITY.completionTolerance
    ) {
      emitCompletion();
    }

    if (
      state.currentState === STATES.WITHDRAWING &&
      state.profile.reveal <=
        QUALITY.completionTolerance
    ) {
      emitCompletion();
    }
  }

  function bindMesh(mesh) {
    const gl = state.gl;

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      mesh.position
    );

    gl.enableVertexAttribArray(
      state.attributes.position
    );

    gl.vertexAttribPointer(
      state.attributes.position,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      mesh.color
    );

    gl.enableVertexAttribArray(
      state.attributes.color
    );

    gl.vertexAttribPointer(
      state.attributes.color,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function drawMesh(
    mesh,
    kind,
    opacity,
    light,
    model,
    view,
    projection,
    nowMs
  ) {
    const gl = state.gl;

    bindMesh(mesh);

    gl.uniformMatrix4fv(
      state.uniforms.model,
      false,
      new Float32Array(model)
    );

    gl.uniformMatrix4fv(
      state.uniforms.view,
      false,
      new Float32Array(view)
    );

    gl.uniformMatrix4fv(
      state.uniforms.projection,
      false,
      new Float32Array(projection)
    );

    gl.uniform1f(
      state.uniforms.time,
      nowMs * 0.001
    );

    gl.uniform1f(
      state.uniforms.kind,
      kind
    );

    gl.uniform1f(
      state.uniforms.opacity,
      opacity
    );

    gl.uniform1f(
      state.uniforms.reveal,
      state.profile.reveal
    );

    gl.uniform1f(
      state.uniforms.light,
      light
    );

    gl.uniform1f(
      state.uniforms.reducedMotion,
      state.reducedMotion ? 1 : 0
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    return 1;
  }

  function renderScene(nowMs) {
    const gl = state.gl;

    resize();

    const aspect =
      state.width /
      Math.max(1, state.height);

    const cameraZ =
      aspect < QUALITY.mobileAspectThreshold
        ? QUALITY.cameraZMobile
        : QUALITY.cameraZDesktop;

    const model = multiply4(
      translate4(0, 0, 0),
      scale4(
        state.profile.scale,
        state.profile.scale,
        state.profile.scale
      )
    );

    const view =
      translate4(0, 0, -cameraZ);

    const projection =
      perspective4(
        QUALITY.fieldOfView,
        aspect,
        QUALITY.near,
        QUALITY.far
      );

    gl.clearColor(0, 0, 0, 0);

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    gl.useProgram(state.program);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);

    let drawCalls = 0;

    if (
      state.profile.motionOpacity > 0.001
    ) {
      gl.enable(gl.BLEND);

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );

      gl.depthMask(false);

      drawCalls += drawMesh(
        state.meshes.motion,
        3,
        state.profile.motionOpacity,
        1,
        model,
        view,
        projection,
        nowMs
      );

      gl.depthMask(true);
    }

    gl.disable(gl.BLEND);

    drawCalls += drawMesh(
      state.meshes.frame,
      0,
      1,
      state.profile.frameLight,
      model,
      view,
      projection,
      nowMs
    );

    drawCalls += drawMesh(
      state.meshes.lead,
      1,
      1,
      state.profile.frameLight,
      model,
      view,
      projection,
      nowMs
    );

    gl.enable(gl.BLEND);

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.depthMask(false);

    drawCalls += drawMesh(
      state.meshes.glass,
      2,
      0.90,
      state.profile.glassLight,
      model,
      view,
      projection,
      nowMs
    );

    gl.depthMask(true);

    const error = gl.getError();

    emitReceipt({
      rendererInitialized: true,
      rendererAvailable: true,
      renderLoopStatus:
        state.running
          ? "active"
          : "single-frame",
      drawCallsLastFrame: drawCalls,
      glError:
        error === gl.NO_ERROR
          ? "NO_ERROR"
          : String(error),
      failureStage: null,
      failureReason: null
    });

    if (error !== gl.NO_ERROR) {
      fail(
        `MIRRORLAND_WEBGL_ERROR_${error}`,
        state.currentState === STATES.REVEALING
          ? "reveal"
          : state.currentState === STATES.WITHDRAWING
            ? "withdrawal"
            : "context"
      );
    }
  }

  function shouldAnimateContinuously() {
    return (
      state.currentState === STATES.REVEALING ||
      state.currentState === STATES.WITHDRAWING ||
      (
        !state.reducedMotion &&
        (
          state.currentState === STATES.FOCUSED ||
          state.currentState === STATES.NAVIGATING
        )
      )
    );
  }

  function renderOnce(nowMs) {
    if (
      state.held ||
      !state.gl
    ) {
      return;
    }

    readControllerState(nowMs);
    updateProfile(nowMs);
    renderScene(nowMs);
  }

  function render(nowMs) {
    if (
      !state.running ||
      state.held
    ) {
      return;
    }

    const interval =
      shouldAnimateContinuously()
        ? QUALITY.activeFrameIntervalMs
        : QUALITY.dormantFrameIntervalMs;

    if (
      state.lastFrameMs &&
      nowMs - state.lastFrameMs < interval
    ) {
      state.raf =
        requestAnimationFrame(render);

      return;
    }

    state.lastFrameMs = nowMs;

    try {
      renderOnce(nowMs);
    } catch (error) {
      fail(
        error && error.message
          ? error.message
          : String(error),
        state.currentState === STATES.REVEALING
          ? "reveal"
          : state.currentState === STATES.WITHDRAWING
            ? "withdrawal"
            : "context"
      );

      return;
    }

    state.raf =
      requestAnimationFrame(render);
  }

  function bindStateObserver() {
    if (
      state.observer ||
      !state.root
    ) {
      return;
    }

    state.observer =
      new MutationObserver((mutations) => {
        const relevant = mutations.some(
          (mutation) =>
            mutation.type === "attributes" &&
            (
              mutation.attributeName ===
                "data-mirrorland-window-state" ||
              mutation.attributeName ===
                "data-mirrorland-transition-id" ||
              mutation.attributeName ===
                "data-reduced-motion"
            )
        );

        if (!relevant) {
          return;
        }

        if (
          state.held &&
          (
            normalizeState(
              state.root.dataset.mirrorlandWindowState
            ) === STATES.REVEALING ||
            normalizeState(
              state.root.dataset.mirrorlandWindowState
            ) === STATES.WITHDRAWING
          )
        ) {
          notifyFailure(
            RECEIPT.failureReason ||
            "MIRRORLAND_WINDOW_RENDERER_HELD",
            normalizeState(
              state.root.dataset.mirrorlandWindowState
            ) === STATES.WITHDRAWING
              ? "withdrawal"
              : "reveal"
          );
        }
      });

    state.observer.observe(state.root, {
      attributes: true,
      attributeFilter: [
        "data-mirrorland-window-state",
        "data-mirrorland-transition-id",
        "data-reduced-motion"
      ]
    });
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();

        fail(
          "WEBGL_CONTEXT_LOST",
          "context"
        );
      }
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        fail(
          "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED",
          "context"
        );
      }
    );
  }

  function dispose() {
    state.running = false;

    cancelAnimationFrame(state.raf);

    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }

    if (state.gl) {
      Object.values(state.meshes).forEach(
        (mesh) => {
          if (mesh.position) {
            state.gl.deleteBuffer(mesh.position);
          }

          if (mesh.color) {
            state.gl.deleteBuffer(mesh.color);
          }
        }
      );

      if (state.program) {
        state.gl.deleteProgram(state.program);
      }
    }

    emitReceipt({
      rendererInitialized: false,
      rendererAvailable: false,
      renderLoopStatus: "disposed"
    });
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_MIRRORLAND_WINDOW =
      Object.freeze({
        contract: CONTRACT,

        receipt() {
          return Object.freeze({
            ...RECEIPT
          });
        },

        start() {
          if (
            !state.running &&
            !state.held &&
            state.gl
          ) {
            state.running = true;
            state.lastFrameMs = 0;
            state.raf =
              requestAnimationFrame(render);
          }
        },

        stop() {
          state.running = false;
          cancelAnimationFrame(state.raf);

          emitReceipt({
            renderLoopStatus: "stopped"
          });
        },

        requestRender() {
          if (
            !state.running &&
            !state.held &&
            state.gl
          ) {
            renderOnce(performance.now());
          }
        },

        dispose
      });
  }

  function initializeDom() {
    state.root = first([
      "[data-compass-root]",
      "#compass",
      "main"
    ]);

    if (!state.root) {
      throw new Error(
        "MISSING_COMPASS_ROOT"
      );
    }

    state.scene = first(
      [
        "[data-compass-scene]",
        ".compass-scene"
      ],
      state.root
    );

    state.mount = first(
      [
        "[data-compass-mirrorland-window-mount]",
        ".compass-scene__mirrorland-window"
      ],
      state.root
    );

    if (!state.scene) {
      throw new Error(
        "MISSING_COMPASS_SCENE"
      );
    }

    if (!state.mount) {
      throw new Error(
        "MISSING_MIRRORLAND_WINDOW_MOUNT"
      );
    }

    ensureFallback();
  }

  function initializeWebGl() {
    state.canvas = ensureCanvas();

    emitReceipt({
      canvasStatus: "created-or-found"
    });

    state.gl =
      createContext(state.canvas);

    if (!state.gl) {
      throw new Error(
        "WEBGL_CONTEXT_UNAVAILABLE"
      );
    }

    emitReceipt({
      webglStatus: "acquired"
    });

    bindContextLifecycle();

    state.program = buildProgram();

    emitReceipt({
      shaderStatus: "compiled-and-linked"
    });

    state.attributes = {
      position:
        state.gl.getAttribLocation(
          state.program,
          "aPosition"
        ),

      color:
        state.gl.getAttribLocation(
          state.program,
          "aColor"
        )
    };

    state.uniforms = {
      model:
        state.gl.getUniformLocation(
          state.program,
          "uModel"
        ),

      view:
        state.gl.getUniformLocation(
          state.program,
          "uView"
        ),

      projection:
        state.gl.getUniformLocation(
          state.program,
          "uProjection"
        ),

      time:
        state.gl.getUniformLocation(
          state.program,
          "uTime"
        ),

      kind:
        state.gl.getUniformLocation(
          state.program,
          "uKind"
        ),

      opacity:
        state.gl.getUniformLocation(
          state.program,
          "uOpacity"
        ),

      reveal:
        state.gl.getUniformLocation(
          state.program,
          "uReveal"
        ),

      light:
        state.gl.getUniformLocation(
          state.program,
          "uLight"
        ),

      reducedMotion:
        state.gl.getUniformLocation(
          state.program,
          "uReducedMotion"
        )
    };

    buildResources();
  }

  function init() {
    exposeApi();

    try {
      initializeDom();
      initializeWebGl();
      bindStateObserver();

      state.currentState =
        normalizeState(
          state.root.dataset.mirrorlandWindowState
        );

      state.previousState = "";
      state.stateEnteredAtMs =
        performance.now();

      state.transitionId =
        state.currentState === STATES.REVEALING ||
        state.currentState === STATES.WITHDRAWING
          ? transitionIdFromRoot()
          : "";

      state.reducedMotion =
        (
          typeof globalThis.matchMedia === "function" &&
          globalThis.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
        ) ||
        state.root.dataset.reducedMotion === "true";

      state.held = false;
      state.running = true;

      hideFallback();

      state.raf =
        requestAnimationFrame(render);

      emitReceipt({
        rendererInitialized: true,
        rendererAvailable: true,
        renderLoopStatus: "active",
        failureStage: null,
        failureReason: null
      });
    } catch (error) {
      if (state.mount) {
        showFallback();
      }

      if (state.root) {
        bindStateObserver();

        fail(
          error && error.message
            ? error.message
            : String(error),
          "initialization"
        );
      } else {
        RECEIPT.failureStage =
          "initialization";

        RECEIPT.failureReason =
          error && error.message
            ? error.message
            : String(error);

        globalThis.DGB_COMPASS_MIRRORLAND_WINDOW_RECEIPT =
          Object.freeze({
            ...RECEIPT
          });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
