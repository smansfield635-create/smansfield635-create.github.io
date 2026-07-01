/* TARGET FILE: /showroom/index.crystals.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_FOUR_BY_FOUR_NARRATIVE_CONSTELLATION_CRYSTALS_TNT_v8 */
/*
  Accepted dependencies:
  - window.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
  - controller module:
    SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
    7.0.0-controller-interaction-semantic-priority
  - window.SHOWROOM_COMPOSITOR
  - compositor contract:
    SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5

  Crystals authority:
  - cardinal and room crystal geometry;
  - crystal mesh, material, shader, buffer, and WebGL-context lifecycle;
  - canonical four-cardinal and four-room-cluster positions;
  - controller-quaternion-driven visual targets;
  - bounded visual interpolation and ambient crystal animation;
  - semantic-control association;
  - compositor node registration;
  - one compositor renderer registration;
  - exclusive rear/front clear callbacks;
  - projection-aware rear/front drawing;
  - crystal readiness, degradation, recovery, failure, and disposal;
  - bounded compositor-readiness waiting and startup orchestration.

  Frozen non-additive presentation rule:
  - CONSTELLATION exposes only four cardinal crystals;
  - CLUSTER exposes only the four rooms in the active cluster;
  - outgoing populations become compositor-invisible immediately;
  - inactive nodes publish visible:false immediately;
  - outgoing populations do not visually fade after replacement;
  - only the newly accepted population may interpolate into view.

  Visual-sizing renewal:
  - cardinal crystals are increased by 50 percent;
  - room crystals are increased by 50 percent;
  - cardinal positions are moved outward toward the second orbit ring;
  - room-cluster positions are moved outward proportionally;
  - original depth coordinates remain unchanged;
  - compositor hit radii continue to scale with rendered crystal size.

  Startup orchestration:
  - validate the compositor contract when available;
  - initialize immediately when the compositor is already ready;
  - otherwise wait for SHOWROOM_COMPOSITOR_READY;
  - fail only on compositor failure, compositor disposal, invalid dependency,
    initialization failure, or bounded readiness timeout;
  - prevent duplicate bootstrap and duplicate runtime initialization.

  Explicit exclusions:
  - no navigation-state mutation;
  - no selected-wing or selected-room mutation;
  - no canonical-route ownership;
  - no controller-transition ownership;
  - no Compass navigation, geometry, rendering, or lifecycle ownership;
  - no compositor camera or matrix ownership;
  - no world-to-screen projection;
  - no front/rear classification;
  - no interaction-priority ownership;
  - no pointer or gesture interpretation;
  - no return behavior;
  - no controller-panel ownership;
  - no front-host visibility ownership;
  - no Diamond or Window ownership;
  - no page-level layer ordering;
  - no semantic-control creation, replacement, removal, hiding, or relocation.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_FOUR_BY_FOUR_NARRATIVE_CONSTELLATION_CRYSTALS_TNT_v8";

  const OWNER =
    "/showroom/index.crystals.js";

  const CONTROLLER_GLOBAL =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_ID =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_VERSION =
    "7.0.0-controller-interaction-semantic-priority";

  const COMPOSITOR_GLOBAL =
    "SHOWROOM_COMPOSITOR";

  const COMPOSITOR_CONTRACT =
    "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5";

  const RENDERER_ID =
    "showroom-crystals-renderer";

  const EVENTS = Object.freeze({
    controllerFailure:
      "SHOWROOM_CONTROLLER_FAILURE",

    compositorReady:
      "SHOWROOM_COMPOSITOR_READY",

    compositorFailure:
      "SHOWROOM_COMPOSITOR_FAILURE",

    compositorDisposed:
      "SHOWROOM_COMPOSITOR_DISPOSED",

    crystalsReady:
      "SHOWROOM_CRYSTALS_READY",

    crystalsFailure:
      "ARCHCOIN_CRYSTALS_RENDER_FAILURE",

    crystalsDisposed:
      "SHOWROOM_CRYSTALS_DISPOSED",

    crystalsReceipt:
      "SHOWROOM_CRYSTALS_RECEIPT"
  });

  const STARTUP = Object.freeze({
    compositorReadyTimeoutMs:
      8000
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    field:
      "[data-showroom-orbit-field][data-showroom-scene-field], " +
      "[data-showroom-orbit-field], " +
      "[data-showroom-scene-field]",

    semanticLayer:
      "[data-showroom-semantic-star-layer]",

    cardinalControls:
      "[data-showroom-cardinal-control][data-showroom-cardinal-id]",

    roomControls:
      "[data-showroom-child-control][data-showroom-child-id]" +
      "[data-showroom-cardinal-id]",

    receipt:
      "[data-showroom-crystals-receipt]"
  });

  const ATTRIBUTES = Object.freeze({
    ready:
      "data-showroom-crystals-ready",

    state:
      "data-showroom-crystals-state",

    contract:
      "data-showroom-crystals-contract",

    renderer:
      "data-showroom-crystals-renderer"
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const NODE_KINDS = Object.freeze({
    CARDINAL:
      "cardinal",

    ROOM:
      "room"
  });

  const DISPLAY_MODES = Object.freeze({
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER:
      "CLUSTER"
  });

  const CONTEXT_IDS = Object.freeze({
    REAR:
      "rear",

    FRONT:
      "front"
  });

  const MATERIAL_FAMILIES = Object.freeze({
    CARDINAL:
      "CARDINAL",

    LOCAL:
      "LOCAL",

    PORTAL:
      "PORTAL",

    PRIMARY_PORTAL:
      "PRIMARY_PORTAL"
  });

  const QUALITY = Object.freeze({
    maximumDeltaSeconds:
      0.05,

    interpolationSpeed:
      8.2,

    reducedMotionInterpolationSpeed:
      26,

    ambientFrameIntervalMs:
      1000 / 30,

    cardinalHitRadius:
      76,

    roomHitRadius:
      48,

    visibleOpacityThreshold:
      0.025,

    haloDisableWidth:
      420
  });

  const CARDINAL_BASE_POSITIONS = Object.freeze({
    north:
      Object.freeze([
        0,
        1.68,
        -0.48
      ]),

    east:
      Object.freeze([
        1.86,
        0,
        0.54
      ]),

    south:
      Object.freeze([
        0,
        -1.68,
        0.44
      ]),

    west:
      Object.freeze([
        -1.86,
        0,
        -0.58
      ])
  });

  const ROOM_BASE_POSITIONS = Object.freeze({
    1:
      Object.freeze([
        -1.06,
        0.94,
        -0.46
      ]),

    2:
      Object.freeze([
        1.06,
        0.94,
        0.50
      ]),

    3:
      Object.freeze([
        1.06,
        -0.94,
        -0.42
      ]),

    4:
      Object.freeze([
        -1.06,
        -0.94,
        0.46
      ])
  });

  const PALETTES = Object.freeze({
    north:
      Object.freeze({
        primary:
          Object.freeze([
            0.70,
            0.84,
            1.00
          ]),

        secondary:
          Object.freeze([
            0.93,
            0.98,
            1.00
          ]),

        rim:
          Object.freeze([
            0.54,
            0.76,
            1.00
          ]),

        highlight:
          Object.freeze([
            1.00,
            0.97,
            0.86
          ])
      }),

    east:
      Object.freeze({
        primary:
          Object.freeze([
            1.00,
            0.67,
            0.18
          ]),

        secondary:
          Object.freeze([
            1.00,
            0.91,
            0.59
          ]),

        rim:
          Object.freeze([
            0.92,
            0.70,
            0.24
          ]),

        highlight:
          Object.freeze([
            1.00,
            0.96,
            0.80
          ])
      }),

    south:
      Object.freeze({
        primary:
          Object.freeze([
            1.00,
            0.48,
            0.58
          ]),

        secondary:
          Object.freeze([
            0.72,
            0.49,
            0.94
          ]),

        rim:
          Object.freeze([
            0.75,
            0.57,
            1.00
          ]),

        highlight:
          Object.freeze([
            1.00,
            0.88,
            0.80
          ])
      }),

    west:
      Object.freeze({
        primary:
          Object.freeze([
            0.23,
            0.39,
            0.95
          ]),

        secondary:
          Object.freeze([
            0.47,
            0.34,
            0.84
          ]),

        rim:
          Object.freeze([
            0.48,
            0.67,
            1.00
          ]),

        highlight:
          Object.freeze([
            0.91,
            0.94,
            1.00
          ])
      })
  });

  const MATERIALS = Object.freeze({
    CARDINAL:
      Object.freeze({
        baseScale:
          1.23,

        activeScale:
          1.50,

        opacity:
          0.97,

        emissive:
          0.18,

        rim:
          1.12,

        sparkle:
          0.18,

        halo:
          0.70,

        idleSpin:
          0.16,

        idleFloat:
          0.018
      }),

    LOCAL:
      Object.freeze({
        baseScale:
          1.125,

        activeScale:
          1.32,

        opacity:
          0.93,

        emissive:
          0.10,

        rim:
          0.84,

        sparkle:
          0.08,

        halo:
          0.30,

        idleSpin:
          0.08,

        idleFloat:
          0.010
      }),

    PORTAL:
      Object.freeze({
        baseScale:
          1.17,

        activeScale:
          1.38,

        opacity:
          0.95,

        emissive:
          0.16,

        rim:
          1.08,

        sparkle:
          0.16,

        halo:
          0.54,

        idleSpin:
          0.10,

        idleFloat:
          0.012
      }),

    PRIMARY_PORTAL:
      Object.freeze({
        baseScale:
          1.23,

        activeScale:
          1.47,

        opacity:
          0.98,

        emissive:
          0.21,

        rim:
          1.22,

        sparkle:
          0.21,

        halo:
          0.72,

        idleSpin:
          0.11,

        idleFloat:
          0.013
      })
  });

  const state = {
    root: null,
    field: null,
    semanticLayer: null,
    receipt: null,

    controller: null,
    compositor: null,
    controllerFrame: null,

    bootstrapBound:
      false,

    waitingForCompositor:
      false,

    compositorReadyTimer:
      0,

    waitingReceiptPublished:
      false,

    controllerBinding:
      false,

    controllerBound:
      false,

    pendingControllerFrame:
      null,

    frameUnsubscribe:
      null,

    reducedMotionUnsubscribe:
      null,

    listeners:
      [],

    registry:
      new Map(),

    nodeRegistrations:
      new Map(),

    rendererRegistration:
      null,

    cpuMeshes:
      new Map(),

    contexts:
      new Map(),

    animationFrame:
      0,

    animationRunning:
      false,

    lastAnimationTime:
      0,

    lastCompositorRequestTime:
      0,

    reducedMotion:
      false,

    contextDegraded:
      false,

    initialized:
      false,

    initializing:
      false,

    ready:
      false,

    readyPublished:
      false,

    held:
      false,

    failed:
      false,

    disposed:
      false,

    failureReason:
      "",

    counters: {
      nodeRegistrations:
        0,

      nodeUnregistrations:
        0,

      rendererRegistrations:
        0,

      rendererUnregistrations:
        0,

      rearClears:
        0,

      frontClears:
        0,

      rearFrames:
        0,

      frontFrames:
        0,

      lastRearDrawCalls:
        0,

      lastFrontDrawCalls:
        0,

      totalRearDrawCalls:
        0,

      totalFrontDrawCalls:
        0,

      contextLosses:
        0,

      contextRestores:
        0,

      animationRequests:
        0,

      holds:
        0,

      holdReleases:
        0,

      compositorWaits:
        0,

      compositorReadySignals:
        0,

      failures:
        0
    }
  };

  const VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute float aFacet;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uNormalMatrix;
    uniform float uScale;
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vFacet;
    varying float vHaloPass;

    void main() {
      vec3 position =
        aPosition * uScale;

      if (uHaloPass > 0.5) {
        position +=
          normalize(aNormal) *
          uHaloExpansion;
      }

      vec4 world =
        uModel *
        vec4(position, 1.0);

      vec4 view =
        uView *
        world;

      vNormal =
        normalize(
          uNormalMatrix *
          aNormal
        );

      vViewPosition =
        view.xyz;

      vFacet =
        aFacet;

      vHaloPass =
        uHaloPass;

      gl_Position =
        uProjection *
        view;
    }
  `;

  const FRAGMENT_SHADER = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vFacet;
    varying float vHaloPass;

    uniform float uTime;
    uniform float uOpacity;
    uniform float uEmissive;
    uniform float uRimStrength;
    uniform float uSparkleStrength;
    uniform float uHaloStrength;
    uniform float uReducedMotion;

    uniform vec3 uPrimaryColor;
    uniform vec3 uSecondaryColor;
    uniform vec3 uRimColor;
    uniform vec3 uHighlightColor;

    void main() {
      vec3 normal =
        normalize(vNormal);

      vec3 viewDirection =
        normalize(-vViewPosition);

      float facing =
        max(
          dot(
            normal,
            viewDirection
          ),
          0.0
        );

      float fresnel =
        pow(
          1.0 - facing,
          2.25
        );

      vec3 lightDirection =
        normalize(
          vec3(
            0.42,
            0.76,
            0.58
          )
        );

      vec3 halfDirection =
        normalize(
          lightDirection +
          viewDirection
        );

      float diffuse =
        max(
          dot(
            normal,
            lightDirection
          ),
          0.0
        );

      float specular =
        pow(
          max(
            dot(
              normal,
              halfDirection
            ),
            0.0
          ),
          30.0
        );

      float sparklePhase =
        uReducedMotion > 0.5
          ? 1.0
          : (
              0.70 +
              0.30 *
              sin(
                uTime * 1.7 +
                vFacet * 8.2
              )
            );

      float sparkle =
        smoothstep(
          0.72,
          1.0,
          specular +
          vFacet * 0.28
        ) *
        sparklePhase *
        uSparkleStrength;

      vec3 base =
        mix(
          uSecondaryColor,
          uPrimaryColor,
          clamp(
            0.34 +
            diffuse * 0.66,
            0.0,
            1.0
          )
        );

      if (vHaloPass > 0.5) {
        vec3 haloColor =
          base * 0.45 +
          uRimColor *
          fresnel *
          0.92;

        float haloAlpha =
          clamp(
            (
              0.025 +
              fresnel * 0.18
            ) *
            uHaloStrength *
            uOpacity,
            0.0,
            0.28
          );

        gl_FragColor =
          vec4(
            haloColor,
            haloAlpha
          );

        return;
      }

      vec3 color =
        base *
        (
          0.22 +
          diffuse * 0.82
        );

      color +=
        uHighlightColor *
        specular *
        0.92;

      color +=
        uRimColor *
        fresnel *
        uRimStrength;

      color +=
        base *
        uEmissive;

      color +=
        uHighlightColor *
        sparkle;

      gl_FragColor =
        vec4(
          color,
          clamp(
            uOpacity,
            0.0,
            1.0
          )
        );
    }
  `;

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error =
      new Error(code);

    error.code =
      code;

    error.details =
      details;

    throw error;
  }

  function normalize(value) {
    return String(
      value == null
        ? ""
        : value
    ).trim();
  }

  function normalizeLower(value) {
    return normalize(value)
      .toLowerCase();
  }

  function normalizeUpper(value) {
    return normalize(value)
      .toUpperCase();
  }

  function normalizeWing(value) {
    const wing =
      normalizeLower(value);

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const numeric =
      Number(value);

    return Number.isFinite(numeric)
      ? numeric
      : fallback;
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

  function lerp(
    from,
    to,
    amount
  ) {
    return (
      from +
      (
        to -
        from
      ) *
      amount
    );
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isCanvas(value) {
    return (
      typeof HTMLCanvasElement !==
        "undefined" &&
      value instanceof
        HTMLCanvasElement
    );
  }

  function freezePlain(value) {
    if (
      value === null ||
      typeof value !==
        "object"
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

        controllerModuleId:
          CONTROLLER_MODULE_ID,

        controllerModuleVersion:
          CONTROLLER_MODULE_VERSION,

        compositorContract:
          COMPOSITOR_CONTRACT,

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

        event,

        timestamp:
          nowIso(),

        bootstrapBound:
          state.bootstrapBound,

        waitingForCompositor:
          state.waitingForCompositor,

        initialized:
          state.initialized,

        initializing:
          state.initializing,

        ready:
          state.ready,

        held:
          state.held,

        contextDegraded:
          state.contextDegraded,

        failed:
          state.failed,

        disposed:
          state.disposed,

        cardinalCount:
          countNodesByKind(
            NODE_KINDS.CARDINAL
          ),

        roomCount:
          countNodesByKind(
            NODE_KINDS.ROOM
          ),

        registeredNodeCount:
          state.nodeRegistrations.size,

        rendererRegistered:
          Boolean(
            state.rendererRegistration
          ),

        rearContextReady:
          isContextReady(
            CONTEXT_IDS.REAR
          ),

        frontContextReady:
          isContextReady(
            CONTEXT_IDS.FRONT
          ),

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
      EVENTS.crystalsReceipt,
      payload
    );

    return payload;
  }

  function setRootState(
    ready,
    value
  ) {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      ATTRIBUTES.ready,
      ready
        ? "true"
        : "false"
    );

    state.root.setAttribute(
      ATTRIBUTES.state,
      value
    );

    state.root.setAttribute(
      ATTRIBUTES.contract,
      CONTRACT
    );

    state.root.setAttribute(
      ATTRIBUTES.renderer,
      RENDERER_ID
    );
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

  function clearCompositorReadyTimeout() {
    if (!state.compositorReadyTimer) {
      return;
    }

    window.clearTimeout(
      state.compositorReadyTimer
    );

    state.compositorReadyTimer =
      0;
  }

  function startCompositorReadyTimeout() {
    clearCompositorReadyTimeout();

    state.compositorReadyTimer =
      window.setTimeout(
        () => {
          state.compositorReadyTimer =
            0;

          if (
            state.initialized ||
            state.initializing ||
            state.failed ||
            state.disposed
          ) {
            return;
          }

          failRuntime(
            new Error(
              "SHOWROOM_CRYSTALS_COMPOSITOR_READY_TIMEOUT"
            ),
            "compositor-ready-timeout"
          );
        },
        STARTUP.compositorReadyTimeoutMs
      );
  }

  function countNodesByKind(kind) {
    let count = 0;

    for (
      const node
      of state.registry.values()
    ) {
      if (node.kind === kind) {
        count += 1;
      }
    }

    return count;
  }

  function vectorLength(vector) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalizeVector(
    vector,
    fallback = [
      0,
      0,
      1
    ]
  ) {
    const length =
      vectorLength(vector);

    if (
      !Number.isFinite(length) ||
      length <= 1e-12
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function subtract(
    first,
    second
  ) {
    return [
      first[0] - second[0],
      first[1] - second[1],
      first[2] - second[2]
    ];
  }

  function cross(
    first,
    second
  ) {
    return [
      first[1] * second[2] -
        first[2] * second[1],

      first[2] * second[0] -
        first[0] * second[2],

      first[0] * second[1] -
        first[1] * second[0]
    ];
  }

  function normalizeQuaternion(value) {
    const source =
      Array.isArray(value)
        ? value
        : (
            value &&
            Array.isArray(
              value.quaternion
            )
              ? value.quaternion
              : null
          );

    if (
      !source ||
      source.length !== 4
    ) {
      return [
        0,
        0,
        0,
        1
      ];
    }

    const quaternion = [
      finiteNumber(
        source[0],
        0
      ),

      finiteNumber(
        source[1],
        0
      ),

      finiteNumber(
        source[2],
        0
      ),

      finiteNumber(
        source[3],
        1
      )
    ];

    const length =
      Math.hypot(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3]
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-9
    ) {
      return [
        0,
        0,
        0,
        1
      ];
    }

    return [
      quaternion[0] / length,
      quaternion[1] / length,
      quaternion[2] / length,
      quaternion[3] / length
    ];
  }

  function rotateVectorByQuaternion(
    vector,
    quaternionValue
  ) {
    const quaternion =
      normalizeQuaternion(
        quaternionValue
      );

    const x =
      quaternion[0];

    const y =
      quaternion[1];

    const z =
      quaternion[2];

    const w =
      quaternion[3];

    const vx =
      vector[0];

    const vy =
      vector[1];

    const vz =
      vector[2];

    const tx =
      2 *
      (
        y * vz -
        z * vy
      );

    const ty =
      2 *
      (
        z * vx -
        x * vz
      );

    const tz =
      2 *
      (
        x * vy -
        y * vx
      );

    return [
      vx +
        w * tx +
        (
          y * tz -
          z * ty
        ),

      vy +
        w * ty +
        (
          z * tx -
          x * tz
        ),

      vz +
        w * tz +
        (
          x * ty -
          y * tx
        )
    ];
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(
    left,
    right
  ) {
    const output =
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
        output[
          column * 4 +
          row
        ] =
          left[row] *
            right[column * 4] +
          left[4 + row] *
            right[
              column * 4 + 1
            ] +
          left[8 + row] *
            right[
              column * 4 + 2
            ] +
          left[12 + row] *
            right[
              column * 4 + 3
            ];
      }
    }

    return output;
  }

  function translate4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[12] =
      x;

    matrix[13] =
      y;

    matrix[14] =
      z;

    return matrix;
  }

  function rotateX4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateY4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateZ4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      cosine, sine, 0, 0,
      -sine, cosine, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function inverseTransposeNormalMatrix3(
    matrix
  ) {
    const a00 =
      matrix[0];

    const a01 =
      matrix[4];

    const a02 =
      matrix[8];

    const a10 =
      matrix[1];

    const a11 =
      matrix[5];

    const a12 =
      matrix[9];

    const a20 =
      matrix[2];

    const a21 =
      matrix[6];

    const a22 =
      matrix[10];

    const b01 =
      a22 * a11 -
      a12 * a21;

    const b11 =
      -a22 * a10 +
      a12 * a20;

    const b21 =
      a21 * a10 -
      a11 * a20;

    let determinant =
      a00 * b01 +
      a01 * b11 +
      a02 * b21;

    if (
      !Number.isFinite(determinant) ||
      Math.abs(determinant) <= 1e-8
    ) {
      return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ];
    }

    determinant =
      1 / determinant;

    const inverse = [
      b01 * determinant,

      (
        -a22 * a01 +
        a02 * a21
      ) * determinant,

      (
        a12 * a01 -
        a02 * a11
      ) * determinant,

      b11 * determinant,

      (
        a22 * a00 -
        a02 * a20
      ) * determinant,

      (
        -a12 * a00 +
        a02 * a10
      ) * determinant,

      b21 * determinant,

      (
        -a21 * a00 +
        a01 * a20
      ) * determinant,

      (
        a11 * a00 -
        a01 * a10
      ) * determinant
    ];

    return [
      inverse[0],
      inverse[3],
      inverse[6],

      inverse[1],
      inverse[4],
      inverse[7],

      inverse[2],
      inverse[5],
      inverse[8]
    ];
  }

  function createCrystalMesh(options) {
    const points =
      options.points;

    const radius =
      options.radius;

    const innerRadius =
      options.innerRadius;

    const depth =
      options.depth;

    const crown =
      options.crown;

    const compression =
      options.compression;

    const vertices = [];
    const triangles = [];

    function addVertex(
      x,
      y,
      z
    ) {
      vertices.push([
        x,
        y,
        z
      ]);

      return (
        vertices.length -
        1
      );
    }

    function addTriangle(
      first,
      second,
      third
    ) {
      triangles.push([
        first,
        second,
        third
      ]);
    }

    const frontApex =
      addVertex(
        0,
        0,
        depth + crown
      );

    const rearApex =
      addVertex(
        0,
        0,
        -depth
      );

    const outer = [];
    const inner = [];

    for (
      let index = 0;
      index < points * 2;
      index += 1
    ) {
      const outerPoint =
        index % 2 === 0;

      const angle =
        (
          Math.PI *
          2 *
          index
        ) /
        (
          points *
          2
        ) -
        Math.PI / 2;

      const activeRadius =
        outerPoint
          ? radius
          : innerRadius;

      outer.push(
        addVertex(
          Math.cos(angle) *
            activeRadius,

          Math.sin(angle) *
            activeRadius *
            compression,

          outerPoint
            ? 0.04
            : -0.02
        )
      );

      inner.push(
        addVertex(
          Math.cos(angle) *
            activeRadius *
            0.42,

          Math.sin(angle) *
            activeRadius *
            compression *
            0.42,

          depth * 0.30
        )
      );
    }

    for (
      let index = 0;
      index < outer.length;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        outer.length;

      addTriangle(
        frontApex,
        inner[index],
        inner[next]
      );

      addTriangle(
        inner[index],
        outer[index],
        outer[next]
      );

      addTriangle(
        inner[index],
        outer[next],
        inner[next]
      );

      addTriangle(
        rearApex,
        outer[next],
        outer[index]
      );
    }

    const positions = [];
    const normals = [];
    const facets = [];

    triangles.forEach(
      (
        triangle,
        triangleIndex
      ) => {
        const first =
          vertices[
            triangle[0]
          ];

        const second =
          vertices[
            triangle[1]
          ];

        const third =
          vertices[
            triangle[2]
          ];

        const normal =
          normalizeVector(
            cross(
              subtract(
                second,
                first
              ),
              subtract(
                third,
                first
              )
            )
          );

        const facet =
          (
            triangleIndex %
            11
          ) /
          10;

        for (
          const point
          of [
            first,
            second,
            third
          ]
        ) {
          positions.push(
            point[0],
            point[1],
            point[2]
          );

          normals.push(
            normal[0],
            normal[1],
            normal[2]
          );

          facets.push(facet);
        }
      }
    );

    return Object.freeze({
      positions:
        new Float32Array(
          positions
        ),

      normals:
        new Float32Array(
          normals
        ),

      facets:
        new Float32Array(
          facets
        ),

      vertexCount:
        positions.length / 3,

      summary:
        Object.freeze({
          points,
          radius,
          innerRadius,
          depth,
          crown,
          compression,

          vertexCount:
            positions.length / 3
        })
    });
  }

  function buildCpuMeshes() {
    state.cpuMeshes.set(
      NODE_KINDS.CARDINAL,
      createCrystalMesh({
        points:
          8,

        radius:
          0.68,

        innerRadius:
          0.30,

        depth:
          0.42,

        crown:
          0.18,

        compression:
          0.80
      })
    );

    state.cpuMeshes.set(
      NODE_KINDS.ROOM,
      createCrystalMesh({
        points:
          6,

        radius:
          0.42,

        innerRadius:
          0.20,

        depth:
          0.25,

        crown:
          0.10,

        compression:
          0.84
      })
    );
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    invariant(
      state.root,
      "SHOWROOM_CRYSTALS_ROOT_REQUIRED"
    );

    state.field =
      state.root.querySelector(
        SELECTORS.field
      );

    state.semanticLayer =
      state.root.querySelector(
        SELECTORS.semanticLayer
      );

    state.receipt =
      state.root.querySelector(
        SELECTORS.receipt
      );
  }

  function validateDom() {
    invariant(
      state.field,
      "SHOWROOM_CRYSTALS_FIELD_REQUIRED"
    );

    invariant(
      state.semanticLayer,
      "SHOWROOM_CRYSTALS_SEMANTIC_LAYER_REQUIRED"
    );

    invariant(
      state.field.contains(
        state.semanticLayer
      ),
      "SHOWROOM_CRYSTALS_SEMANTIC_LAYER_OUTSIDE_FIELD"
    );

    const cardinalControls =
      Array.from(
        state.root.querySelectorAll(
          SELECTORS.cardinalControls
        )
      );

    const roomControls =
      Array.from(
        state.root.querySelectorAll(
          SELECTORS.roomControls
        )
      );

    invariant(
      cardinalControls.length === 4,
      "SHOWROOM_CRYSTALS_CARDINAL_COUNT_INVALID",
      {
        expected:
          4,

        actual:
          cardinalControls.length
      }
    );

    invariant(
      roomControls.length === 16,
      "SHOWROOM_CRYSTALS_ROOM_COUNT_INVALID",
      {
        expected:
          16,

        actual:
          roomControls.length
      }
    );

    for (
      const element
      of [
        ...cardinalControls,
        ...roomControls
      ]
    ) {
      invariant(
        state.field.contains(element),
        "SHOWROOM_CRYSTALS_CONTROL_OUTSIDE_FIELD"
      );
    }

    return {
      cardinalControls,
      roomControls
    };
  }

  function requireController() {
    const controller =
      window[
        CONTROLLER_GLOBAL
      ];

    invariant(
      controller,
      "SHOWROOM_CRYSTALS_CONTROLLER_REQUIRED"
    );

    invariant(
      controller.moduleId ===
        CONTROLLER_MODULE_ID,
      "SHOWROOM_CRYSTALS_CONTROLLER_MODULE_ID_INVALID"
    );

    invariant(
      controller.moduleVersion ===
        CONTROLLER_MODULE_VERSION,
      "SHOWROOM_CRYSTALS_CONTROLLER_MODULE_VERSION_INVALID"
    );

    invariant(
      typeof controller.getFrameState ===
        "function",
      "SHOWROOM_CRYSTALS_CONTROLLER_FRAME_API_REQUIRED"
    );

    invariant(
      typeof controller.subscribeFrameState ===
        "function",
      "SHOWROOM_CRYSTALS_CONTROLLER_FRAME_SUBSCRIPTION_REQUIRED"
    );

    return controller;
  }

  function requireCompositor() {
    const compositor =
      window[
        COMPOSITOR_GLOBAL
      ];

    invariant(
      compositor,
      "SHOWROOM_CRYSTALS_COMPOSITOR_REQUIRED"
    );

    invariant(
      compositor.contract ===
        COMPOSITOR_CONTRACT,
      "SHOWROOM_CRYSTALS_COMPOSITOR_CONTRACT_INVALID"
    );

    for (
      const method
      of [
        "getState",
        "getFrameState",
        "getCanvases",
        "registerNode",
        "registerRenderer",
        "requestRender"
      ]
    ) {
      invariant(
        typeof compositor[method] ===
          "function",
        `SHOWROOM_CRYSTALS_COMPOSITOR_METHOD_REQUIRED:${method}`
      );
    }

    return compositor;
  }

  function validControllerFrame(frame) {
    return Boolean(
      frame &&
      typeof frame ===
        "object" &&
      frame.moduleId ===
        CONTROLLER_MODULE_ID &&
      frame.moduleVersion ===
        CONTROLLER_MODULE_VERSION &&
      typeof frame.navigationState ===
        "string" &&
      typeof frame.presentationMode ===
        "string" &&
      frame.presentation &&
      typeof frame.presentation ===
        "object" &&
      frame.orbitOrientation &&
      typeof frame.orbitOrientation ===
        "object" &&
      Array.isArray(
        frame.orbitOrientation
          .quaternion
      ) &&
      frame.orbitOrientation
        .quaternion.length ===
        4 &&
      (
        frame.cluster === null ||
        (
          frame.cluster &&
          typeof frame.cluster ===
            "object"
        )
      ) &&
      typeof frame.held ===
        "boolean"
    );
  }

  function readControllerFrame() {
    const frame =
      state.controller
        .getFrameState();

    invariant(
      validControllerFrame(frame),
      "SHOWROOM_CRYSTALS_CONTROLLER_FRAME_INVALID"
    );

    return frame;
  }

  function compositorReady() {
    if (
      !state.compositor ||
      typeof state.compositor.getState !==
        "function"
    ) {
      return false;
    }

    const compositorState =
      state.compositor.getState();

    return Boolean(
      compositorState &&
      compositorState.initialized ===
        true &&
      compositorState.readyPublished ===
        true &&
      compositorState.failed !==
        true &&
      compositorState.disposed !==
        true
    );
  }

  function cardinalIdFromElement(
    element
  ) {
    return normalizeWing(
      element.dataset
        .showroomCardinalId
    );
  }

  function childIdFromElement(
    element
  ) {
    return normalize(
      element.dataset
        .showroomChildId
    );
  }

  function roomOrdinal(childId) {
    const match =
      normalize(childId).match(
        /-(\d+)$/
      );

    invariant(
      match,
      `SHOWROOM_CRYSTALS_ROOM_ID_INVALID:${childId}`
    );

    const ordinal =
      Number(match[1]);

    invariant(
      ordinal >= 1 &&
      ordinal <= 4,
      `SHOWROOM_CRYSTALS_ROOM_ORDINAL_INVALID:${childId}`
    );

    return ordinal;
  }

  function semanticLabel(element) {
    return (
      normalize(
        element.getAttribute(
          "aria-label"
        )
      ) ||
      normalize(
        element.dataset
          .showroomCardinalLabel
      ) ||
      normalize(
        element.dataset
          .showroomChildLabel
      ) ||
      normalize(
        element.textContent
      )
    );
  }

  function materialFamilyForElement(
    element,
    kind
  ) {
    if (
      kind ===
      NODE_KINDS.CARDINAL
    ) {
      return MATERIAL_FAMILIES.CARDINAL;
    }

    const visualClass =
      normalizeUpper(
        element.dataset
          .showroomVisualClass
      );

    const emphasis =
      normalizeLower(
        element.dataset
          .showroomEmphasis
      );

    const behavior =
      normalizeLower(
        element.dataset
          .showroomObjectBehavior
      );

    if (
      visualClass ===
        "PRIMARY_PORTAL" ||
      emphasis ===
        "primary-external"
    ) {
      return MATERIAL_FAMILIES
        .PRIMARY_PORTAL;
    }

    if (
      visualClass ===
        "PORTAL" ||
      emphasis ===
        "external" ||
      behavior ===
        "portal"
    ) {
      return MATERIAL_FAMILIES.PORTAL;
    }

    return MATERIAL_FAMILIES.LOCAL;
  }

  function createNodeRecord(
    element,
    kind
  ) {
    const cardinalId =
      cardinalIdFromElement(
        element
      );

    invariant(
      cardinalId,
      "SHOWROOM_CRYSTALS_CARDINAL_ID_REQUIRED"
    );

    const childId =
      kind === NODE_KINDS.ROOM
        ? childIdFromElement(
            element
          )
        : "";

    if (
      kind === NODE_KINDS.ROOM
    ) {
      invariant(
        childId ===
          `${cardinalId}-${roomOrdinal(childId)}`,
        `SHOWROOM_CRYSTALS_ROOM_PARENT_MISMATCH:${childId}`
      );
    }

    const id =
      kind === NODE_KINDS.CARDINAL
        ? `crystal-cardinal-${cardinalId}`
        : `crystal-room-${childId}`;

    const projectionId =
      kind === NODE_KINDS.CARDINAL
        ? cardinalId
        : childId;

    const initialPosition =
      kind === NODE_KINDS.CARDINAL
        ? CARDINAL_BASE_POSITIONS[
            cardinalId
          ].slice()
        : ROOM_BASE_POSITIONS[
            roomOrdinal(
              childId
            )
          ].slice();

    return {
      id,
      projectionId,
      kind,

      semanticObjectId:
        projectionId,

      cardinalId,

      childId,

      clusterId:
        cardinalId,

      semanticElement:
        element,

      label:
        semanticLabel(element),

      materialFamily:
        materialFamilyForElement(
          element,
          kind
        ),

      phase:
        state.registry.size *
        0.71 +
        (
          kind ===
          NODE_KINDS.CARDINAL
            ? 0.19
            : 0.43
        ),

      targetVisible:
        false,

      visible:
        false,

      settled:
        true,

      current: {
        x:
          initialPosition[0],

        y:
          initialPosition[1],

        z:
          initialPosition[2],

        scale:
          0.01,

        opacity:
          0,

        emissive:
          0,

        rim:
          0,

        sparkle:
          0,

        halo:
          0,

        rx:
          0,

        ry:
          0,

        rz:
          0,

        spin:
          0,

        float:
          0
      },

      target: {
        x:
          initialPosition[0],

        y:
          initialPosition[1],

        z:
          initialPosition[2],

        scale:
          0.01,

        opacity:
          0,

        emissive:
          0,

        rim:
          0,

        sparkle:
          0,

        halo:
          0,

        spin:
          0,

        float:
          0
      }
    };
  }

  function buildRegistry(
    cardinalControls,
    roomControls
  ) {
    const projectionIds =
      new Set();

    const cardinalCounts =
      new Map(
        WINGS.map(
          wing => [
            wing,
            0
          ]
        )
      );

    const roomCounts =
      new Map(
        WINGS.map(
          wing => [
            wing,
            0
          ]
        )
      );

    for (
      const element
      of cardinalControls
    ) {
      const node =
        createNodeRecord(
          element,
          NODE_KINDS.CARDINAL
        );

      invariant(
        !state.registry.has(
          node.id
        ),
        `SHOWROOM_CRYSTALS_DUPLICATE_NODE_ID:${node.id}`
      );

      invariant(
        !projectionIds.has(
          node.projectionId
        ),
        `SHOWROOM_CRYSTALS_DUPLICATE_PROJECTION_ID:${node.projectionId}`
      );

      projectionIds.add(
        node.projectionId
      );

      cardinalCounts.set(
        node.cardinalId,
        (
          cardinalCounts.get(
            node.cardinalId
          ) ||
          0
        ) +
        1
      );

      state.registry.set(
        node.id,
        node
      );
    }

    for (
      const element
      of roomControls
    ) {
      const node =
        createNodeRecord(
          element,
          NODE_KINDS.ROOM
        );

      invariant(
        !state.registry.has(
          node.id
        ),
        `SHOWROOM_CRYSTALS_DUPLICATE_NODE_ID:${node.id}`
      );

      invariant(
        !projectionIds.has(
          node.projectionId
        ),
        `SHOWROOM_CRYSTALS_DUPLICATE_PROJECTION_ID:${node.projectionId}`
      );

      projectionIds.add(
        node.projectionId
      );

      roomCounts.set(
        node.cardinalId,
        (
          roomCounts.get(
            node.cardinalId
          ) ||
          0
        ) +
        1
      );

      state.registry.set(
        node.id,
        node
      );
    }

    invariant(
      state.registry.size === 20,
      "SHOWROOM_CRYSTALS_NODE_COUNT_INVALID"
    );

    for (
      const wing
      of WINGS
    ) {
      invariant(
        cardinalCounts.get(wing) ===
          1,
        `SHOWROOM_CRYSTALS_CARDINAL_DUPLICATION:${wing}`
      );

      invariant(
        roomCounts.get(wing) === 4,
        `SHOWROOM_CRYSTALS_ROOM_CLUSTER_COUNT_INVALID:${wing}`
      );
    }
  }

  function activeClusterId(frame) {
    const candidates = [
      frame.activeClusterWing,

      frame.cluster
        ? frame.cluster.wing
        : "",

      frame.selectedCardinal
    ];

    for (
      const candidate
      of candidates
    ) {
      const wing =
        normalizeWing(candidate);

      if (wing) {
        return wing;
      }
    }

    return "";
  }

  function activeRoomId(frame) {
    const candidates = [
      frame.cluster
        ? frame.cluster.activeChildId
        : "",

      frame.cluster
        ? frame.cluster.selectedChildId
        : "",

      frame.activeChildId,

      frame.selectedRoom
    ];

    for (
      const candidate
      of candidates
    ) {
      const value =
        normalize(candidate);

      if (value) {
        return value;
      }
    }

    return "";
  }

  function orbitQuaternion(frame) {
    return normalizeQuaternion(
      frame.orbitOrientation
    );
  }

  function clusterQuaternion(frame) {
    const candidates = [
      frame.cluster &&
      frame.cluster.orientation
        ? frame.cluster.orientation
        : null,

      frame.cluster &&
      frame.cluster.clusterOrientation
        ? frame.cluster
            .clusterOrientation
        : null,

      frame.clusterOrientation ||
        null
    ];

    for (
      const candidate
      of candidates
    ) {
      if (
        candidate &&
        Array.isArray(
          candidate.quaternion
        )
      ) {
        return normalizeQuaternion(
          candidate
        );
      }

      if (Array.isArray(candidate)) {
        return normalizeQuaternion(
          candidate
        );
      }
    }

    return orbitQuaternion(frame);
  }

  function displayMode(frame) {
    const navigationState =
      normalizeUpper(
        frame.navigationState
      );

    const presentationMode =
      normalizeUpper(
        frame.presentationMode
      );

    if (
      navigationState ===
        "CLUSTER_OPEN" ||
      navigationState ===
        "ROOM_SELECTED" ||
      presentationMode ===
        "CLUSTER"
    ) {
      return DISPLAY_MODES.CLUSTER;
    }

    return DISPLAY_MODES.CONSTELLATION;
  }

  function selectedCardinalId(frame) {
    const candidates = [
      frame.selectedCardinal,

      frame.activeClusterWing,

      frame.cluster
        ? frame.cluster.wing
        : ""
    ];

    for (
      const candidate
      of candidates
    ) {
      const wing =
        normalizeWing(candidate);

      if (wing) {
        return wing;
      }
    }

    return "";
  }

  function materialForNode(node) {
    return (
      MATERIALS[
        node.materialFamily
      ] ||
      MATERIALS.LOCAL
    );
  }

  function snapNodeInactive(node) {
    node.target.scale =
      0.01;

    node.target.opacity =
      0;

    node.target.emissive =
      0;

    node.target.rim =
      0;

    node.target.sparkle =
      0;

    node.target.halo =
      0;

    node.target.spin =
      0;

    node.target.float =
      0;

    node.current.scale =
      0.01;

    node.current.opacity =
      0;

    node.current.emissive =
      0;

    node.current.rim =
      0;

    node.current.sparkle =
      0;

    node.current.halo =
      0;

    node.current.spin =
      0;

    node.current.float =
      0;

    node.visible =
      false;

    node.settled =
      true;
  }

  function computeTargets(frame) {
    if (
      state.held ||
      frame.held === true
    ) {
      return;
    }

    const mode =
      displayMode(frame);

    const activeCluster =
      activeClusterId(frame);

    const activeRoom =
      activeRoomId(frame);

    const selectedCardinal =
      selectedCardinalId(frame);

    const orbit =
      orbitQuaternion(frame);

    const cluster =
      clusterQuaternion(frame);

    for (
      const node
      of state.registry.values()
    ) {
      const material =
        materialForNode(node);

      let position;

      let visible =
        false;

      let selected =
        false;

      if (
        node.kind ===
        NODE_KINDS.CARDINAL
      ) {
        position =
          rotateVectorByQuaternion(
            CARDINAL_BASE_POSITIONS[
              node.cardinalId
            ],
            orbit
          );

        visible =
          mode ===
          DISPLAY_MODES.CONSTELLATION;

        selected =
          node.cardinalId ===
          selectedCardinal;
      } else {
        position =
          rotateVectorByQuaternion(
            ROOM_BASE_POSITIONS[
              roomOrdinal(
                node.childId
              )
            ],
            cluster
          );

        visible =
          mode ===
            DISPLAY_MODES.CLUSTER &&
          node.clusterId ===
            activeCluster;

        selected =
          node.childId ===
          activeRoom;
      }

      node.targetVisible =
        visible;

      node.target.x =
        position[0];

      node.target.y =
        position[1];

      node.target.z =
        position[2];

      if (!visible) {
        snapNodeInactive(node);
        continue;
      }

      /*
        Newly accepted presentation nodes become semantically visible
        immediately. Their material values may still interpolate into place.
      */
      node.visible =
        true;

      node.target.scale =
        selected
          ? material.activeScale
          : material.baseScale;

      node.target.opacity =
        material.opacity;

      node.target.emissive =
        selected
          ? clamp(
              material.emissive *
              1.28,
              0,
              0.55
            )
          : material.emissive;

      node.target.rim =
        selected
          ? clamp(
              material.rim *
              1.18,
              0,
              1.7
            )
          : material.rim;

      node.target.sparkle =
        state.reducedMotion
          ? 0
          : (
              selected
                ? clamp(
                    material.sparkle *
                    1.24,
                    0,
                    0.52
                  )
                : material.sparkle
            );

      node.target.halo =
        selected
          ? clamp(
              material.halo *
              1.18,
              0,
              1.4
            )
          : material.halo;

      node.target.spin =
        state.reducedMotion
          ? 0
          : material.idleSpin;

      node.target.float =
        state.reducedMotion
          ? 0
          : material.idleFloat;

      node.settled =
        !nodeHasInterpolation(node);
    }
  }

  function nodeHasInterpolation(node) {
    for (
      const key
      of [
        "x",
        "y",
        "z",
        "scale",
        "opacity",
        "emissive",
        "rim",
        "sparkle",
        "halo",
        "spin",
        "float"
      ]
    ) {
      if (
        Math.abs(
          node.current[key] -
          node.target[key]
        ) > 0.0015
      ) {
        return true;
      }
    }

    return false;
  }

  function updateNode(
    node,
    deltaSeconds,
    now
  ) {
    if (state.held) {
      return false;
    }

    if (!node.targetVisible) {
      node.visible =
        false;

      node.settled =
        true;

      return false;
    }

    const interpolation =
      Math.min(
        1,
        deltaSeconds *
        (
          state.reducedMotion
            ? QUALITY
                .reducedMotionInterpolationSpeed
            : QUALITY
                .interpolationSpeed
        )
      );

    for (
      const key
      of [
        "x",
        "y",
        "z",
        "scale",
        "opacity",
        "emissive",
        "rim",
        "sparkle",
        "halo",
        "spin",
        "float"
      ]
    ) {
      node.current[key] =
        lerp(
          node.current[key],
          node.target[key],
          interpolation
        );
    }

    if (state.reducedMotion) {
      node.current.rx =
        0;

      node.current.ry =
        0;

      node.current.rz =
        0;
    } else {
      node.current.rz +=
        deltaSeconds *
        node.current.spin;

      node.current.ry =
        Math.sin(
          now * 0.00042 +
          node.phase
        ) *
        0.18;

      node.current.rx =
        Math.sin(
          now * 0.00031 +
          node.phase * 0.73
        ) *
        0.11;
    }

    node.visible =
      node.targetVisible;

    node.settled =
      !nodeHasInterpolation(node);

    return !node.settled;
  }

  function ambientMotionRequired() {
    return Boolean(
      state.ready &&
      !state.held &&
      !state.reducedMotion &&
      !state.contextDegraded &&
      document.visibilityState !==
        "hidden" &&
      Array.from(
        state.registry.values()
      ).some(
        node =>
          node.targetVisible &&
          node.visible &&
          (
            node.current.spin > 0 ||
            node.current.float > 0 ||
            node.current.sparkle > 0
          )
      )
    );
  }

  function animationRequired() {
    if (
      !state.ready ||
      state.failed ||
      state.disposed ||
      state.held ||
      state.contextDegraded ||
      document.visibilityState ===
        "hidden"
    ) {
      return false;
    }

    for (
      const node
      of state.registry.values()
    ) {
      if (
        node.targetVisible &&
        nodeHasInterpolation(node)
      ) {
        return true;
      }
    }

    return ambientMotionRequired();
  }

  function animationStep(now) {
    state.animationFrame =
      0;

    if (!animationRequired()) {
      state.animationRunning =
        false;

      state.lastAnimationTime =
        0;

      return;
    }

    const deltaSeconds =
      state.lastAnimationTime
        ? Math.min(
            QUALITY
              .maximumDeltaSeconds,

            Math.max(
              0,
              (
                now -
                state.lastAnimationTime
              ) /
              1000
            )
          )
        : 0.016;

    state.lastAnimationTime =
      now;

    let changed =
      false;

    for (
      const node
      of state.registry.values()
    ) {
      changed =
        updateNode(
          node,
          deltaSeconds,
          now
        ) ||
        changed;
    }

    const ambient =
      ambientMotionRequired();

    if (
      changed ||
      (
        ambient &&
        now -
          state.lastCompositorRequestTime >=
          QUALITY
            .ambientFrameIntervalMs
      )
    ) {
      state.lastCompositorRequestTime =
        now;

      state.counters
        .animationRequests +=
        1;

      state.compositor.requestRender(
        "crystals-animation"
      );
    }

    if (animationRequired()) {
      state.animationFrame =
        requestAnimationFrame(
          animationStep
        );
    } else {
      state.animationRunning =
        false;

      state.lastAnimationTime =
        0;
    }
  }

  function startAnimation() {
    if (
      state.animationRunning ||
      !animationRequired()
    ) {
      return;
    }

    state.animationRunning =
      true;

    state.lastAnimationTime =
      0;

    state.animationFrame =
      requestAnimationFrame(
        animationStep
      );
  }

  function stopAnimation() {
    if (state.animationFrame) {
      cancelAnimationFrame(
        state.animationFrame
      );
    }

    state.animationFrame =
      0;

    state.animationRunning =
      false;

    state.lastAnimationTime =
      0;
  }

  function evaluateAnimation() {
    if (animationRequired()) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }

  function nodeWorldPosition(node) {
    const floatOffset =
      (
        node.targetVisible &&
        node.visible &&
        !state.held &&
        !state.reducedMotion
      )
        ? Math.sin(
            state.lastAnimationTime *
            0.00092 +
            node.phase
          ) *
          node.current.float
        : 0;

    return [
      node.current.x,
      node.current.y +
        floatOffset,
      node.current.z
    ];
  }

  function nodeHitRadius(node) {
    if (
      !node.targetVisible ||
      !node.visible
    ) {
      return 0;
    }

    const base =
      node.kind ===
      NODE_KINDS.CARDINAL
        ? QUALITY.cardinalHitRadius
        : QUALITY.roomHitRadius;

    return Math.max(
      0,
      base *
      node.current.scale *
      clamp(
        node.current.opacity,
        0,
        1
      )
    );
  }

  function createShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

    invariant(
      shader,
      "SHOWROOM_CRYSTALS_SHADER_CREATION_FAILED"
    );

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
      const message =
        gl.getShaderInfoLog(
          shader
        ) ||
        "UNKNOWN_SHADER_ERROR";

      gl.deleteShader(shader);

      throw new Error(message);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertexShader =
      createShader(
        gl,
        gl.VERTEX_SHADER,
        VERTEX_SHADER
      );

    const fragmentShader =
      createShader(
        gl,
        gl.FRAGMENT_SHADER,
        FRAGMENT_SHADER
      );

    const program =
      gl.createProgram();

    invariant(
      program,
      "SHOWROOM_CRYSTALS_PROGRAM_CREATION_FAILED"
    );

    gl.attachShader(
      program,
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.linkProgram(program);

    gl.deleteShader(
      vertexShader
    );

    gl.deleteShader(
      fragmentShader
    );

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const message =
        gl.getProgramInfoLog(
          program
        ) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(program);

      throw new Error(message);
    }

    return program;
  }

  function createBuffer(
    gl,
    data
  ) {
    const buffer =
      gl.createBuffer();

    invariant(
      buffer,
      "SHOWROOM_CRYSTALS_BUFFER_CREATION_FAILED"
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      data,
      gl.STATIC_DRAW
    );

    return buffer;
  }

  function buildGpuMesh(
    gl,
    cpuMesh
  ) {
    return {
      vertexCount:
        cpuMesh.vertexCount,

      position:
        createBuffer(
          gl,
          cpuMesh.positions
        ),

      normal:
        createBuffer(
          gl,
          cpuMesh.normals
        ),

      facet:
        createBuffer(
          gl,
          cpuMesh.facets
        )
    };
  }

  function bindAttribute(
    context,
    buffer,
    location,
    size
  ) {
    invariant(
      location >= 0,
      "SHOWROOM_CRYSTALS_ATTRIBUTE_LOCATION_INVALID"
    );

    const gl =
      context.gl;

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

  function isContextReady(id) {
    const context =
      state.contexts.get(id);

    return Boolean(
      context &&
      context.available &&
      context.contextLost !==
        true &&
      context.gl &&
      context.program
    );
  }

  function destroyContext(
    context,
    removeListeners = true
  ) {
    if (!context) {
      return;
    }

    if (
      removeListeners &&
      context.canvas
    ) {
      context.canvas.removeEventListener(
        "webglcontextlost",
        context.onContextLost
      );

      context.canvas.removeEventListener(
        "webglcontextrestored",
        context.onContextRestored
      );
    }

    if (
      context.gl &&
      context.contextLost !==
        true
    ) {
      for (
        const mesh
        of context.meshes.values()
      ) {
        context.gl.deleteBuffer(
          mesh.position
        );

        context.gl.deleteBuffer(
          mesh.normal
        );

        context.gl.deleteBuffer(
          mesh.facet
        );
      }

      if (context.program) {
        context.gl.deleteProgram(
          context.program
        );
      }
    }

    context.meshes.clear();

    context.available =
      false;

    context.program =
      null;
  }

  function createContext(
    id,
    canvas
  ) {
    invariant(
      isCanvas(canvas),
      `SHOWROOM_CRYSTALS_${id.toUpperCase()}_CANVAS_REQUIRED`
    );

    const gl =
      canvas.getContext(
        "webgl",
        {
          alpha:
            true,

          antialias:
            true,

          depth:
            true,

          premultipliedAlpha:
            false,

          preserveDrawingBuffer:
            false
        }
      );

    invariant(
      gl,
      `SHOWROOM_CRYSTALS_${id.toUpperCase()}_WEBGL_UNAVAILABLE`
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthFunc(
      gl.LEQUAL
    );

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.disable(
      gl.CULL_FACE
    );

    const program =
      createProgram(gl);

    const context = {
      id,
      canvas,
      gl,
      program,

      available:
        true,

      contextLost:
        false,

      meshes:
        new Map(),

      attributes:
        Object.freeze({
          position:
            gl.getAttribLocation(
              program,
              "aPosition"
            ),

          normal:
            gl.getAttribLocation(
              program,
              "aNormal"
            ),

          facet:
            gl.getAttribLocation(
              program,
              "aFacet"
            )
        }),

      uniforms:
        Object.freeze({
          model:
            gl.getUniformLocation(
              program,
              "uModel"
            ),

          view:
            gl.getUniformLocation(
              program,
              "uView"
            ),

          projection:
            gl.getUniformLocation(
              program,
              "uProjection"
            ),

          normalMatrix:
            gl.getUniformLocation(
              program,
              "uNormalMatrix"
            ),

          scale:
            gl.getUniformLocation(
              program,
              "uScale"
            ),

          time:
            gl.getUniformLocation(
              program,
              "uTime"
            ),

          opacity:
            gl.getUniformLocation(
              program,
              "uOpacity"
            ),

          emissive:
            gl.getUniformLocation(
              program,
              "uEmissive"
            ),

          rimStrength:
            gl.getUniformLocation(
              program,
              "uRimStrength"
            ),

          sparkleStrength:
            gl.getUniformLocation(
              program,
              "uSparkleStrength"
            ),

          haloStrength:
            gl.getUniformLocation(
              program,
              "uHaloStrength"
            ),

          reducedMotion:
            gl.getUniformLocation(
              program,
              "uReducedMotion"
            ),

          primaryColor:
            gl.getUniformLocation(
              program,
              "uPrimaryColor"
            ),

          secondaryColor:
            gl.getUniformLocation(
              program,
              "uSecondaryColor"
            ),

          rimColor:
            gl.getUniformLocation(
              program,
              "uRimColor"
            ),

          highlightColor:
            gl.getUniformLocation(
              program,
              "uHighlightColor"
            ),

          haloPass:
            gl.getUniformLocation(
              program,
              "uHaloPass"
            ),

          haloExpansion:
            gl.getUniformLocation(
              program,
              "uHaloExpansion"
            )
        }),

      onContextLost:
        null,

      onContextRestored:
        null
    };

    for (
      const [
        kind,
        cpuMesh
      ]
      of state.cpuMeshes
    ) {
      context.meshes.set(
        kind,
        buildGpuMesh(
          gl,
          cpuMesh
        )
      );
    }

    context.onContextLost =
      event => {
        event.preventDefault();

        context.contextLost =
          true;

        context.available =
          false;

        state.contextDegraded =
          true;

        state.counters
          .contextLosses +=
          1;

        stopAnimation();

        setRootState(
          false,
          "degraded"
        );

        publishReceipt(
          "context-lost",
          {
            context:
              id,

            recoverable:
              true,

            registrationsRetained:
              true
          }
        );
      };

    context.onContextRestored =
      () => {
        state.counters
          .contextRestores +=
          1;

        try {
          rebuildContext(id);

          if (
            isContextReady(
              CONTEXT_IDS.REAR
            ) &&
            isContextReady(
              CONTEXT_IDS.FRONT
            )
          ) {
            state.contextDegraded =
              false;

            setRootState(
              true,
              state.held
                ? "held"
                : "ready"
            );

            state.compositor.requestRender(
              `crystals-context-restored:${id}`
            );

            evaluateAnimation();

            publishReceipt(
              "context-restored",
              {
                context:
                  id,

                recoveryComplete:
                  true
              }
            );
          }
        } catch (error) {
          failRuntime(
            error,
            `context-restoration:${id}`
          );
        }
      };

    canvas.addEventListener(
      "webglcontextlost",
      context.onContextLost
    );

    canvas.addEventListener(
      "webglcontextrestored",
      context.onContextRestored
    );

    return context;
  }

  function rebuildContext(id) {
    const previous =
      state.contexts.get(id);

    invariant(
      previous,
      `SHOWROOM_CRYSTALS_CONTEXT_REQUIRED:${id}`
    );

    const canvas =
      previous.canvas;

    destroyContext(
      previous,
      true
    );

    state.contexts.set(
      id,
      createContext(
        id,
        canvas
      )
    );
  }

  function createGpuResources() {
    const canvases =
      state.compositor
        .getCanvases();

    invariant(
      canvases &&
      isCanvas(canvases.rear) &&
      isCanvas(canvases.front),
      "SHOWROOM_CRYSTALS_COMPOSITOR_CANVASES_REQUIRED"
    );

    const rear =
      createContext(
        CONTEXT_IDS.REAR,
        canvases.rear
      );

    try {
      const front =
        createContext(
          CONTEXT_IDS.FRONT,
          canvases.front
        );

      state.contexts.set(
        CONTEXT_IDS.REAR,
        rear
      );

      state.contexts.set(
        CONTEXT_IDS.FRONT,
        front
      );
    } catch (error) {
      destroyContext(
        rear,
        true
      );

      throw error;
    }
  }

  function destroyGpuResources() {
    for (
      const context
      of state.contexts.values()
    ) {
      try {
        destroyContext(
          context,
          true
        );
      } catch {
        /* Bounded resource disposal. */
      }
    }

    state.contexts.clear();
  }

  function matrixFromFrame(
    frame,
    name
  ) {
    const matrix =
      frame &&
      frame.matrices
        ? frame.matrices[name]
        : null;

    invariant(
      Array.isArray(matrix) &&
      matrix.length === 16,
      `SHOWROOM_CRYSTALS_${name.toUpperCase()}_MATRIX_REQUIRED`
    );

    return matrix;
  }

  function modelMatrix(node) {
    const position =
      nodeWorldPosition(node);

    return multiply4(
      translate4(
        position[0],
        position[1],
        position[2]
      ),
      multiply4(
        rotateZ4(
          node.current.rz
        ),
        multiply4(
          rotateY4(
            node.current.ry
          ),
          rotateX4(
            node.current.rx
          )
        )
      )
    );
  }

  function applyUniforms(
    context,
    node,
    frame,
    haloPass
  ) {
    const gl =
      context.gl;

    const view =
      matrixFromFrame(
        frame,
        "view"
      );

    const projection =
      matrixFromFrame(
        frame,
        "projection"
      );

    const model =
      modelMatrix(node);

    const modelView =
      multiply4(
        view,
        model
      );

    const normalMatrix =
      inverseTransposeNormalMatrix3(
        modelView
      );

    const palette =
      PALETTES[
        node.cardinalId
      ] ||
      PALETTES.north;

    const haloStrength =
      finiteNumber(
        frame.viewport.cssWidth,
        0
      ) <=
      QUALITY.haloDisableWidth
        ? 0
        : node.current.halo;

    gl.uniformMatrix4fv(
      context.uniforms.model,
      false,
      new Float32Array(
        model
      )
    );

    gl.uniformMatrix4fv(
      context.uniforms.view,
      false,
      new Float32Array(
        view
      )
    );

    gl.uniformMatrix4fv(
      context.uniforms
        .projection,
      false,
      new Float32Array(
        projection
      )
    );

    gl.uniformMatrix3fv(
      context.uniforms
        .normalMatrix,
      false,
      new Float32Array(
        normalMatrix
      )
    );

    gl.uniform1f(
      context.uniforms.scale,
      node.current.scale
    );

    gl.uniform1f(
      context.uniforms.time,
      state.lastAnimationTime *
        0.001
    );

    gl.uniform1f(
      context.uniforms.opacity,
      node.current.opacity
    );

    gl.uniform1f(
      context.uniforms.emissive,
      node.current.emissive
    );

    gl.uniform1f(
      context.uniforms
        .rimStrength,
      node.current.rim
    );

    gl.uniform1f(
      context.uniforms
        .sparkleStrength,
      state.reducedMotion
        ? 0
        : node.current.sparkle
    );

    gl.uniform1f(
      context.uniforms
        .haloStrength,
      haloStrength
    );

    gl.uniform1f(
      context.uniforms
        .reducedMotion,
      state.reducedMotion
        ? 1
        : 0
    );

    gl.uniform3fv(
      context.uniforms
        .primaryColor,
      new Float32Array(
        palette.primary
      )
    );

    gl.uniform3fv(
      context.uniforms
        .secondaryColor,
      new Float32Array(
        palette.secondary
      )
    );

    gl.uniform3fv(
      context.uniforms.rimColor,
      new Float32Array(
        palette.rim
      )
    );

    gl.uniform3fv(
      context.uniforms
        .highlightColor,
      new Float32Array(
        palette.highlight
      )
    );

    gl.uniform1f(
      context.uniforms.haloPass,
      haloPass
        ? 1
        : 0
    );

    gl.uniform1f(
      context.uniforms
        .haloExpansion,
      node.kind ===
        NODE_KINDS.CARDINAL
        ? 0.075
        : 0.052
    );
  }

  function drawNode(
    context,
    node,
    frame,
    haloPass
  ) {
    const mesh =
      context.meshes.get(
        node.kind
      );

    if (!mesh) {
      return 0;
    }

    bindAttribute(
      context,
      mesh.position,
      context.attributes.position,
      3
    );

    bindAttribute(
      context,
      mesh.normal,
      context.attributes.normal,
      3
    );

    bindAttribute(
      context,
      mesh.facet,
      context.attributes.facet,
      1
    );

    applyUniforms(
      context,
      node,
      frame,
      haloPass
    );

    context.gl.drawArrays(
      context.gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    return 1;
  }

  function resizeContext(
    context,
    frame
  ) {
    const viewport =
      frame.viewport;

    invariant(
      viewport,
      "SHOWROOM_CRYSTALS_VIEWPORT_REQUIRED"
    );

    const expectedWidth =
      Math.max(
        1,
        Math.round(
          finiteNumber(
            viewport.pixelWidth,
            context.canvas.width
          )
        )
      );

    const expectedHeight =
      Math.max(
        1,
        Math.round(
          finiteNumber(
            viewport.pixelHeight,
            context.canvas.height
          )
        )
      );

    invariant(
      context.canvas.width ===
        expectedWidth &&
      context.canvas.height ===
        expectedHeight,
      `SHOWROOM_CRYSTALS_${context.id.toUpperCase()}_CANVAS_SIZE_INVALID`
    );

    context.gl.viewport(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
  }

  function clearLayer(
    contextId,
    payload
  ) {
    const context =
      state.contexts.get(
        contextId
      );

    if (
      !context ||
      !context.available ||
      context.contextLost
    ) {
      return false;
    }

    resizeContext(
      context,
      payload.frame
    );

    const gl =
      context.gl;

    gl.colorMask(
      true,
      true,
      true,
      true
    );

    gl.depthMask(true);

    gl.clearColor(
      0,
      0,
      0,
      0
    );

    gl.clearDepth(1);

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    const error =
      gl.getError();

    invariant(
      error === gl.NO_ERROR,
      `SHOWROOM_CRYSTALS_${contextId.toUpperCase()}_CLEAR_FAILED`,
      {
        error
      }
    );

    if (
      contextId ===
      CONTEXT_IDS.REAR
    ) {
      state.counters.rearClears +=
        1;
    } else {
      state.counters.frontClears +=
        1;
    }

    return true;
  }

  function drawLayer(
    contextId,
    payload
  ) {
    const context =
      state.contexts.get(
        contextId
      );

    if (
      !context ||
      !context.available ||
      context.contextLost
    ) {
      return {
        drawCalls:
          0,

        nodeCount:
          0,

        skipped:
          true
      };
    }

    resizeContext(
      context,
      payload.frame
    );

    const gl =
      context.gl;

    gl.useProgram(
      context.program
    );

    const projectedNodes =
      Array.isArray(payload.nodes)
        ? payload.nodes
        : [];

    const nodes = [];

    for (
      const projectedNode
      of projectedNodes
    ) {
      const node =
        state.registry.get(
          projectedNode.id
        );

      if (
        node &&
        node.targetVisible &&
        node.visible &&
        node.current.opacity >
          QUALITY
            .visibleOpacityThreshold
      ) {
        nodes.push(node);
      }
    }

    let drawCalls = 0;

    const haloEnabled =
      finiteNumber(
        payload.frame.viewport
          .cssWidth,
        0
      ) >
      QUALITY.haloDisableWidth;

    if (haloEnabled) {
      gl.depthMask(false);

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE
      );

      for (
        const node
        of nodes
      ) {
        drawCalls +=
          drawNode(
            context,
            node,
            payload.frame,
            true
          );
      }
    }

    gl.depthMask(true);

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    for (
      const node
      of nodes
    ) {
      drawCalls +=
        drawNode(
          context,
          node,
          payload.frame,
          false
        );
    }

    const error =
      gl.getError();

    invariant(
      error === gl.NO_ERROR,
      `SHOWROOM_CRYSTALS_${contextId.toUpperCase()}_DRAW_FAILED`,
      {
        error
      }
    );

    return {
      drawCalls,

      nodeCount:
        nodes.length,

      skipped:
        false
    };
  }

  function registerNodesTransactional() {
    const acquired = [];

    try {
      for (
        const node
        of state.registry.values()
      ) {
        const registration =
          state.compositor
            .registerNode({
              id:
                node.id,

              kind:
                node.kind,

              semanticObjectId:
                node.semanticObjectId,

              cardinalId:
                node.cardinalId,

              childId:
                node.childId,

              clusterId:
                node.clusterId,

              semanticElement:
                node.semanticElement,

              getWorldPosition:
                () =>
                  nodeWorldPosition(
                    node
                  ),

              getHitRadius:
                () =>
                  nodeHitRadius(
                    node
                  ),

              isVisible:
                () =>
                  node.targetVisible &&
                  node.visible,

              metadata: {
                contract:
                  CONTRACT,

                projectionId:
                  node.projectionId,

                kind:
                  node.kind,

                cardinalId:
                  node.cardinalId,

                childId:
                  node.childId,

                clusterId:
                  node.clusterId,

                materialFamily:
                  node.materialFamily,

                label:
                  node.label
              }
            });

        invariant(
          registration &&
          typeof registration.unregister ===
            "function",
          `SHOWROOM_CRYSTALS_NODE_REGISTRATION_FAILED:${node.id}`
        );

        acquired.push({
          id:
            node.id,

          registration
        });
      }

      for (
        const entry
        of acquired
      ) {
        state.nodeRegistrations.set(
          entry.id,
          entry.registration
        );

        state.counters
          .nodeRegistrations +=
          1;
      }
    } catch (error) {
      for (
        const entry
        of acquired.reverse()
      ) {
        try {
          entry.registration
            .unregister();
        } catch {
          /* Transaction rollback continues. */
        }
      }

      throw error;
    }

    invariant(
      state.nodeRegistrations.size ===
        20,
      "SHOWROOM_CRYSTALS_REGISTERED_NODE_COUNT_INVALID"
    );
  }

  function unregisterNodes() {
    for (
      const registration
      of state.nodeRegistrations.values()
    ) {
      try {
        registration.unregister();

        state.counters
          .nodeUnregistrations +=
          1;
      } catch {
        /* Bounded disposal. */
      }
    }

    state.nodeRegistrations.clear();
  }

  function registerRendererTransactional() {
    const registration =
      state.compositor
        .registerRenderer({
          id:
            RENDERER_ID,

          clearRearOwned:
            true,

          clearFrontOwned:
            true,

          clearRear(payload) {
            return clearLayer(
              CONTEXT_IDS.REAR,
              payload
            );
          },

          clearFront(payload) {
            return clearLayer(
              CONTEXT_IDS.FRONT,
              payload
            );
          },

          beginFrame(payload) {
            if (
              state.failed ||
              state.disposed
            ) {
              return false;
            }

            return Boolean(
              payload &&
              payload.frame
            );
          },

          renderRear(payload) {
            try {
              const result =
                drawLayer(
                  CONTEXT_IDS.REAR,
                  payload
                );

              state.counters
                .lastRearDrawCalls =
                result.drawCalls;

              state.counters
                .totalRearDrawCalls +=
                result.drawCalls;

              state.counters
                .rearFrames +=
                1;

              return result;
            } catch (error) {
              queueMicrotask(() => {
                failRuntime(
                  error,
                  "rear-render"
                );
              });

              return {
                drawCalls:
                  0,

                nodeCount:
                  0,

                skipped:
                  true,

                failed:
                  true
              };
            }
          },

          renderFront(payload) {
            try {
              const result =
                drawLayer(
                  CONTEXT_IDS.FRONT,
                  payload
                );

              state.counters
                .lastFrontDrawCalls =
                result.drawCalls;

              state.counters
                .totalFrontDrawCalls +=
                result.drawCalls;

              state.counters
                .frontFrames +=
                1;

              return result;
            } catch (error) {
              queueMicrotask(() => {
                failRuntime(
                  error,
                  "front-render"
                );
              });

              return {
                drawCalls:
                  0,

                nodeCount:
                  0,

                skipped:
                  true,

                failed:
                  true
              };
            }
          },

          endFrame() {
            return true;
          },

          dispose() {
            destroyGpuResources();
          }
        });

    invariant(
      registration &&
      typeof registration.unregister ===
        "function",
      "SHOWROOM_CRYSTALS_RENDERER_REGISTRATION_FAILED"
    );

    state.rendererRegistration =
      registration;

    state.counters
      .rendererRegistrations +=
      1;
  }

  function unregisterRenderer() {
    const registration =
      state.rendererRegistration;

    state.rendererRegistration =
      null;

    if (
      !registration ||
      typeof registration.unregister !==
        "function"
    ) {
      return;
    }

    try {
      registration.unregister();

      state.counters
        .rendererUnregistrations +=
        1;
    } catch {
      /* Bounded disposal. */
    }
  }

  function processFrame(
    frame,
    reason
  ) {
    if (
      state.failed ||
      state.disposed
    ) {
      return;
    }

    invariant(
      validControllerFrame(frame),
      "SHOWROOM_CRYSTALS_CONTROLLER_FRAME_INVALID"
    );

    state.controllerFrame =
      frame;

    state.reducedMotion =
      frame.reducedMotion ===
      true;

    if (frame.held === true) {
      if (!state.held) {
        state.held =
          true;

        state.counters.holds +=
          1;

        stopAnimation();

        setRootState(
          state.ready,
          "held"
        );

        publishReceipt(
          "held",
          {
            reason
          }
        );
      }

      return;
    }

    if (state.held) {
      state.held =
        false;

      state.counters
        .holdReleases +=
        1;

      publishReceipt(
        "hold-released",
        {
          reason
        }
      );
    }

    computeTargets(frame);

    if (state.ready) {
      setRootState(
        true,
        "ready"
      );

      state.compositor.requestRender(
        `crystals-state:${reason}`
      );

      evaluateAnimation();
    }
  }

  function handleFrameSubscription(
    frame
  ) {
    if (state.controllerBinding) {
      state.pendingControllerFrame =
        frame;

      return;
    }

    try {
      processFrame(
        frame,
        "controller-frame"
      );
    } catch (error) {
      failRuntime(
        error,
        "controller-frame"
      );
    }
  }

  function bindControllerTransactional() {
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

    const acquired = [];

    try {
      const frameUnsubscribe =
        state.controller
          .subscribeFrameState(
            handleFrameSubscription
          );

      invariant(
        frameUnsubscribe == null ||
        typeof frameUnsubscribe ===
          "function",
        "SHOWROOM_CRYSTALS_FRAME_UNSUBSCRIBE_INVALID"
      );

      if (
        typeof frameUnsubscribe ===
          "function"
      ) {
        acquired.push(
          frameUnsubscribe
        );
      }

      state.frameUnsubscribe =
        frameUnsubscribe ||
        null;

      if (
        typeof state.controller
          .subscribeReducedMotion ===
          "function"
      ) {
        const reducedMotionUnsubscribe =
          state.controller
            .subscribeReducedMotion(
              value => {
                const reduced =
                  typeof value ===
                    "boolean"
                    ? value
                    : Boolean(
                        value &&
                        value.reducedMotion ===
                          true
                      );

                state.reducedMotion =
                  reduced;

                if (
                  !state.controllerBinding &&
                  state.controllerFrame
                ) {
                  computeTargets(
                    state.controllerFrame
                  );

                  if (state.ready) {
                    state.compositor
                      .requestRender(
                        "crystals-reduced-motion"
                      );

                    evaluateAnimation();
                  }
                }
              }
            );

        invariant(
          reducedMotionUnsubscribe ==
            null ||
          typeof reducedMotionUnsubscribe ===
            "function",
          "SHOWROOM_CRYSTALS_REDUCED_MOTION_UNSUBSCRIBE_INVALID"
        );

        if (
          typeof reducedMotionUnsubscribe ===
            "function"
        ) {
          acquired.push(
            reducedMotionUnsubscribe
          );
        }

        state.reducedMotionUnsubscribe =
          reducedMotionUnsubscribe ||
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

      state.frameUnsubscribe =
        null;

      state.reducedMotionUnsubscribe =
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
      processFrame(
        retainedFrame,
        "controller-binding-retained-frame"
      );
    }
  }

  function unbindController() {
    for (
      const key
      of [
        "frameUnsubscribe",
        "reducedMotionUnsubscribe"
      ]
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
  }

  function activateRuntime() {
    invariant(
      compositorReady(),
      "SHOWROOM_CRYSTALS_COMPOSITOR_NOT_READY_DURING_ACTIVATION"
    );

    createGpuResources();

    try {
      registerNodesTransactional();

      try {
        registerRendererTransactional();
      } catch (error) {
        unregisterNodes();
        throw error;
      }
    } catch (error) {
      destroyGpuResources();
      throw error;
    }
  }

  function publishReady() {
    invariant(
      state.nodeRegistrations.size ===
        20,
      "SHOWROOM_CRYSTALS_READY_NODE_COUNT_INVALID"
    );

    invariant(
      state.rendererRegistration,
      "SHOWROOM_CRYSTALS_READY_RENDERER_REQUIRED"
    );

    invariant(
      isContextReady(
        CONTEXT_IDS.REAR
      ),
      "SHOWROOM_CRYSTALS_READY_REAR_CONTEXT_REQUIRED"
    );

    invariant(
      isContextReady(
        CONTEXT_IDS.FRONT
      ),
      "SHOWROOM_CRYSTALS_READY_FRONT_CONTEXT_REQUIRED"
    );

    state.ready =
      true;

    state.readyPublished =
      true;

    state.waitingForCompositor =
      false;

    state.waitingReceiptPublished =
      false;

    clearCompositorReadyTimeout();

    setRootState(
      true,
      state.held
        ? "held"
        : "ready"
    );

    publishReceipt(
      "ready",
      {
        cardinalCount:
          4,

        roomCount:
          16,

        semanticControlsPreserved:
          true,

        nonAdditivePresentation:
          true,

        inactiveNodesPublishVisibleFalse:
          true,

        outgoingPopulationSnappedInactive:
          true,

        clearRearOwned:
          true,

        clearFrontOwned:
          true,

        compositorTimedClearing:
          true,

        rendererCreatedContexts:
          true,

        compositorCreatedContexts:
          false,

        depthClassificationOwned:
          false,

        interactionPriorityOwned:
          false,

        compassLifecycleMutated:
          false,

        cardinalScaleIncrease:
          1.5,

        roomScaleIncrease:
          1.5,

        cardinalPositionsMovedOutward:
          true,

        roomPositionsMovedOutward:
          true,

        originalDepthCoordinatesPreserved:
          true,

        hitRadiusScalesWithVisualSize:
          true,

        compositorReadinessWaitSupported:
          true,

        compositorReadyTimeoutMs:
          STARTUP.compositorReadyTimeoutMs
      }
    );

    dispatch(
      EVENTS.crystalsReady,
      {
        cardinalCount:
          4,

        roomCount:
          16,

        semanticControlsPreserved:
          true,

        nonAdditivePresentation:
          true,

        clearRearOwned:
          true,

        clearFrontOwned:
          true,

        rendererCreatedContexts:
          true,

        cardinalScaleIncrease:
          1.5,

        roomScaleIncrease:
          1.5,

        positionsMovedOutward:
          true,

        compositorReadinessWaitSupported:
          true
      }
    );

    state.compositor.requestRender(
      "crystals-ready"
    );

    evaluateAnimation();
  }

  function initializeBindings() {
    addListener(
      window,
      EVENTS.controllerFailure,
      event => {
        failRuntime(
          new Error(
            event &&
            event.detail &&
            event.detail.reason
              ? event.detail.reason
              : "SHOWROOM_CONTROLLER_FAILURE"
          ),
          "controller-failure"
        );
      }
    );

    addListener(
      window,
      EVENTS.compositorReady,
      () => {
        if (
          state.failed ||
          state.disposed ||
          state.initialized ||
          state.initializing
        ) {
          return;
        }

        state.counters
          .compositorReadySignals +=
          1;

        try {
          tryInitializeRuntime(
            "compositor-ready-event"
          );
        } catch (error) {
          failRuntime(
            error,
            "compositor-ready-event"
          );
        }
      }
    );

    addListener(
      window,
      EVENTS.compositorFailure,
      event => {
        failRuntime(
          new Error(
            event &&
            event.detail &&
            event.detail.reason
              ? event.detail.reason
              : "SHOWROOM_COMPOSITOR_FAILURE"
          ),
          "compositor-failure"
        );
      }
    );

    addListener(
      window,
      EVENTS.compositorDisposed,
      () => {
        if (
          state.initialized ||
          state.ready
        ) {
          dispose(
            "compositor-disposed"
          );

          return;
        }

        failRuntime(
          new Error(
            "SHOWROOM_COMPOSITOR_DISPOSED_BEFORE_CRYSTALS_READY"
          ),
          "compositor-disposed-before-ready"
        );
      }
    );

    addListener(
      document,
      "visibilitychange",
      () => {
        if (
          document.visibilityState ===
            "hidden"
        ) {
          stopAnimation();
        } else {
          evaluateAnimation();

          if (
            state.ready &&
            state.compositor
          ) {
            state.compositor.requestRender(
              "crystals-document-visible"
            );
          }
        }
      }
    );

    addListener(
      window,
      "pagehide",
      event => {
        if (!event.persisted) {
          dispose(
            "pagehide"
          );
        }
      },
      {
        once:
          true
      }
    );
  }

  function getNodeState(id) {
    const normalizedId =
      normalize(id);

    const node =
      state.registry.get(
        normalizedId
      ) ||
      Array.from(
        state.registry.values()
      ).find(
        candidate =>
          candidate.projectionId ===
            normalizedId
      );

    if (!node) {
      return null;
    }

    return freezePlain({
      id:
        node.id,

      projectionId:
        node.projectionId,

      kind:
        node.kind,

      cardinalId:
        node.cardinalId,

      childId:
        node.childId,

      clusterId:
        node.clusterId,

      visible:
        node.visible,

      targetVisible:
        node.targetVisible,

      settled:
        node.settled,

      current: {
        ...node.current
      },

      target: {
        ...node.target
      },

      worldPosition:
        nodeWorldPosition(node),

      hitRadius:
        nodeHitRadius(node)
    });
  }

  function getState() {
    return freezePlain({
      contract:
        CONTRACT,

      owner:
        OWNER,

      controllerModuleId:
        CONTROLLER_MODULE_ID,

      controllerModuleVersion:
        CONTROLLER_MODULE_VERSION,

      compositorContract:
        COMPOSITOR_CONTRACT,

      bootstrapBound:
        state.bootstrapBound,

      waitingForCompositor:
        state.waitingForCompositor,

      compositorReadyTimeoutActive:
        Boolean(
          state.compositorReadyTimer
        ),

      initialized:
        state.initialized,

      initializing:
        state.initializing,

      ready:
        state.ready,

      readyPublished:
        state.readyPublished,

      held:
        state.held,

      reducedMotion:
        state.reducedMotion,

      contextDegraded:
        state.contextDegraded,

      failed:
        state.failed,

      disposed:
        state.disposed,

      failureReason:
        state.failureReason,

      controllerBound:
        state.controllerBound,

      presentationMode:
        state.controllerFrame
          ? displayMode(
              state.controllerFrame
            )
          : DISPLAY_MODES.CONSTELLATION,

      activeCluster:
        state.controllerFrame
          ? activeClusterId(
              state.controllerFrame
            )
          : "",

      activeRoom:
        state.controllerFrame
          ? activeRoomId(
              state.controllerFrame
            )
          : "",

      cardinalCount:
        countNodesByKind(
          NODE_KINDS.CARDINAL
        ),

      roomCount:
        countNodesByKind(
          NODE_KINDS.ROOM
        ),

      visibleCardinalCount:
        Array.from(
          state.registry.values()
        ).filter(
          node =>
            node.kind ===
              NODE_KINDS.CARDINAL &&
            node.targetVisible &&
            node.visible
        ).length,

      visibleRoomCount:
        Array.from(
          state.registry.values()
        ).filter(
          node =>
            node.kind ===
              NODE_KINDS.ROOM &&
            node.targetVisible &&
            node.visible
        ).length,

      registeredNodeCount:
        state.nodeRegistrations.size,

      rendererRegistered:
        Boolean(
          state.rendererRegistration
        ),

      rearContextReady:
        isContextReady(
          CONTEXT_IDS.REAR
        ),

      frontContextReady:
        isContextReady(
          CONTEXT_IDS.FRONT
        ),

      animationRunning:
        state.animationRunning,

      visualRenewal: {
        cardinalScaleMultiplier:
          1.5,

        roomScaleMultiplier:
          1.5,

        cardinalPositionsMovedOutward:
          true,

        roomPositionsMovedOutward:
          true,

        depthCoordinatesPreserved:
          true,

        proportionalHitRadius:
          true
      },

      startupContract: {
        compositorReadyEvent:
          EVENTS.compositorReady,

        boundedWait:
          true,

        timeoutMs:
          STARTUP.compositorReadyTimeoutMs,

        duplicateInitializationPrevented:
          true
      },

      ownership: {
        cardinalGeometryOwned:
          true,

        roomGeometryOwned:
          true,

        WebGLContextsOwned:
          true,

        clearCallbacksOwned:
          true,

        clearTimingOwned:
          false,

        cameraOwned:
          false,

        projectionOwned:
          false,

        depthClassificationOwned:
          false,

        interactionPriorityOwned:
          false,

        semanticNavigationOwned:
          false,

        compassOwned:
          false
      },

      presentationContract: {
        nonAdditive:
          true,

        outgoingPopulationFadeAuthorized:
          false,

        inactiveSemanticVisibility:
          false,

        constellationVisiblePopulation:
          "four-cardinals-only",

        clusterVisiblePopulation:
          "four-active-cluster-rooms-only"
      },

      counters: {
        ...state.counters
      }
    });
  }

  function getGeometrySummary() {
    const cardinal =
      state.cpuMeshes.get(
        NODE_KINDS.CARDINAL
      );

    const room =
      state.cpuMeshes.get(
        NODE_KINDS.ROOM
      );

    return freezePlain({
      cardinal:
        cardinal
          ? cardinal.summary
          : null,

      room:
        room
          ? room.summary
          : null,

      cardinalBasePositions:
        CARDINAL_BASE_POSITIONS,

      roomBasePositions:
        ROOM_BASE_POSITIONS
    });
  }

  function getMaterialSummary() {
    return freezePlain({
      palettes:
        PALETTES,

      materials:
        MATERIALS
    });
  }

  function requestRender(
    reason = "crystals-api"
  ) {
    if (
      !state.ready ||
      state.failed ||
      state.disposed ||
      state.contextDegraded
    ) {
      return false;
    }

    return state.compositor
      .requestRender(reason);
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        controllerModuleId:
          CONTROLLER_MODULE_ID,

        controllerModuleVersion:
          CONTROLLER_MODULE_VERSION,

        compositorContract:
          COMPOSITOR_CONTRACT,

        getState,

        getNodeState,

        getGeometrySummary,

        getMaterialSummary,

        requestRender,

        dispose() {
          return dispose(
            "public-api"
          );
        }
      });

    Object.defineProperty(
      window,
      "SHOWROOM_CRYSTALS",
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
      delete window.SHOWROOM_CRYSTALS;
    } catch {
      /* Best-effort removal. */
    }
  }

  function teardownRuntime() {
    clearCompositorReadyTimeout();

    stopAnimation();

    unbindController();

    removeListeners();

    /*
      Renderer unregistration occurs before explicit node and GPU cleanup.
      The compositor therefore retains authority to invoke final rear/front
      clear callbacks before calling the renderer dispose callback.
    */
    unregisterRenderer();

    unregisterNodes();

    destroyGpuResources();

    removeApi();
  }

  function failRuntime(
    error,
    reason
  ) {
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

    state.readyPublished =
      false;

    state.waitingForCompositor =
      false;

    state.failureReason =
      reason;

    state.counters.failures +=
      1;

    setRootState(
      false,
      "failed"
    );

    teardownRuntime();

    const errorPayload = {
      name:
        error instanceof Error
          ? error.name
          : "Error",

      message:
        error instanceof Error
          ? error.message
          : String(error),

      code:
        error &&
        error.code
          ? error.code
          : "",

      details:
        error &&
        error.details
          ? error.details
          : null
    };

    publishReceipt(
      "failed",
      {
        reason,

        terminalForCurrentInstance:
          true,

        error:
          errorPayload,

        semanticControlsChanged:
          false,

        compositorDisposed:
          false,

        controllerMutated:
          false,

        compassMutated:
          false
      }
    );

    dispatch(
      EVENTS.crystalsFailure,
      {
        reason,

        terminalForCurrentInstance:
          true,

        error:
          errorPayload
      }
    );
  }

  function dispose(
    reason = "crystals-disposed"
  ) {
    if (state.disposed) {
      return true;
    }

    state.disposed =
      true;

    state.ready =
      false;

    state.readyPublished =
      false;

    state.waitingForCompositor =
      false;

    setRootState(
      false,
      "disposed"
    );

    teardownRuntime();

    state.registry.clear();
    state.cpuMeshes.clear();

    state.controller =
      null;

    state.compositor =
      null;

    state.controllerFrame =
      null;

    state.initialized =
      false;

    state.initializing =
      false;

    state.held =
      false;

    state.contextDegraded =
      false;

    publishReceipt(
      "disposed",
      {
        reason,

        semanticControlsChanged:
          false,

        compositorCanvasesRemoved:
          false,

        compositorDisposed:
          false,

        controllerDisposed:
          false,

        compassMutated:
          false,

        DiamondMutated:
          false,

        WindowMutated:
          false
      }
    );

    dispatch(
      EVENTS.crystalsDisposed,
      {
        reason,

        disposed:
          true
      }
    );

    return true;
  }

  function initializeRuntime() {
    if (
      state.initialized ||
      state.initializing ||
      state.failed ||
      state.disposed
    ) {
      return;
    }

    state.initializing =
      true;

    state.waitingForCompositor =
      false;

    state.waitingReceiptPublished =
      false;

    clearCompositorReadyTimeout();

    setRootState(
      false,
      "initializing"
    );

    try {
      const dom =
        validateDom();

      state.controllerFrame =
        readControllerFrame();

      state.reducedMotion =
        state.controllerFrame
          .reducedMotion ===
        true;

      state.held =
        state.controllerFrame.held ===
        true;

      buildCpuMeshes();

      buildRegistry(
        dom.cardinalControls,
        dom.roomControls
      );

      /*
        Initial target computation occurs while not held. If the controller is
        initially held, preserve the neutral hidden node state until the first
        accepted non-held frame arrives.
      */
      if (!state.held) {
        computeTargets(
          state.controllerFrame
        );

        for (
          const node
          of state.registry.values()
        ) {
          Object.assign(
            node.current,
            node.target
          );

          node.visible =
            node.targetVisible;

          node.settled =
            true;
        }
      }

      /*
        Enhanced readiness remains false until WebGL contexts, all 20 nodes,
        and the exclusive-clear renderer registration succeed.
      */
      activateRuntime();

      bindControllerTransactional();

      exposeApi();

      state.initialized =
        true;

      state.initializing =
        false;

      publishReady();
    } catch (error) {
      state.initializing =
        false;

      failRuntime(
        error,
        "initialization"
      );
    }
  }

  function tryInitializeRuntime(
    reason = "bootstrap"
  ) {
    if (
      state.initialized ||
      state.initializing ||
      state.failed ||
      state.disposed
    ) {
      return;
    }

    state.controller =
      requireController();

    state.compositor =
      requireCompositor();

    if (!compositorReady()) {
      if (!state.waitingForCompositor) {
        state.counters
          .compositorWaits +=
          1;
      }

      state.waitingForCompositor =
        true;

      setRootState(
        false,
        "waiting-for-compositor"
      );

      if (!state.waitingReceiptPublished) {
        state.waitingReceiptPublished =
          true;

        publishReceipt(
          "waiting-for-compositor",
          {
            reason,

            recoverable:
              true,

            event:
              EVENTS.compositorReady,

            timeoutMs:
              STARTUP.compositorReadyTimeoutMs
          }
        );
      }

      if (!state.compositorReadyTimer) {
        startCompositorReadyTimeout();
      }

      return;
    }

    state.waitingForCompositor =
      false;

    state.waitingReceiptPublished =
      false;

    clearCompositorReadyTimeout();

    initializeRuntime();
  }

  function bootstrap() {
    if (
      state.bootstrapBound ||
      state.failed ||
      state.disposed
    ) {
      return;
    }

    state.bootstrapBound =
      true;

    try {
      discoverDom();

      setRootState(
        false,
        "bootstrapping"
      );

      /*
        Bind readiness, failure, disposal, visibility, and page lifecycle
        listeners before the first compositor readiness check. A later
        SHOWROOM_COMPOSITOR_READY event can therefore resume startup.
      */
      initializeBindings();

      startCompositorReadyTimeout();

      tryInitializeRuntime(
        "initial-bootstrap"
      );
    } catch (error) {
      failRuntime(
        error,
        "bootstrap"
      );
    }
  }

  if (
    document.readyState ===
      "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      bootstrap,
      {
        once:
          true
      }
    );
  } else {
    bootstrap();
  }
})();
