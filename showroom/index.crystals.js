/* TARGET FILE: /showroom/index.crystals.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_FOUR_BY_FOUR_NARRATIVE_CONSTELLATION_CRYSTALS_TNT_v4 */
/*
  Static final-review candidate.

  Controller dependency:
  - SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v5

  Compositor dependency:
  - SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v2

  Owned:
  - cardinal and child crystal CPU geometry;
  - crystal materials, palettes, shaders, GPU programs, and GPU buffers;
  - crystal world targets and interpolated visual state;
  - bounded crystal animation-state scheduling;
  - WebGL drawing through registered compositor callbacks;
  - canonical semantic-control association;
  - crystal renderer and node registration lifecycle;
  - crystal context-loss recovery and bounded receipts.

  Not owned:
  - navigation or semantic authorization;
  - controller state commitment;
  - pointer, tap, drag, swipe, or gesture interpretation;
  - camera eye, camera target, view matrices, or projection matrices;
  - world-to-screen projection;
  - front/rear classification;
  - compositor canvas construction, dimensions, or disposal;
  - Compass state, geometry, renderer, navigation, or lifecycle;
  - semantic-control creation, relocation, styling, or visibility;
  - front-host visibility;
  - fallback visibility;
  - controller-reflected root readiness attributes.

  Lifecycle policy:
  - core construction may complete before compositor readiness;
  - compositor runtime surfaces activate exactly once after controller-certified
    compositor readiness;
  - temporary WebGL context loss retains controller-level crystal readiness,
    marks crystals internally degraded, suspends drawing/animation requests,
    retains registrations, and attempts recovery;
  - successful context restoration resumes drawing without emitting a second
    crystals-ready event solely for recovery;
  - failed restoration is terminal and tears down all crystal-owned runtime
    surfaces.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_FOUR_BY_FOUR_NARRATIVE_CONSTELLATION_CRYSTALS_TNT_v4";

  const OWNER =
    "/showroom/index.crystals.js";

  const CONTROLLER_CONTRACT =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v5";

  const COMPOSITOR_CONTRACT =
    "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v2";

  const RENDERER_ID =
    "showroom-crystal-renderer";

  const EVENTS = Object.freeze({
    controllerReady:
      "showroom:controller-ready",

    frameChanged:
      "showroom:frame-state-changed",

    stateChanged:
      "showroom:state-changed",

    previewChanged:
      "showroom:preview-changed",

    clusterChanged:
      "showroom:cluster-changed",

    frontChanged:
      "showroom:front-changed",

    enhancementReadinessChanged:
      "showroom:enhancement-readiness-changed",

    compositorReady:
      "showroom:compositor-ready",

    compositorFailed:
      "showroom:compositor-failed",

    compositorDisposed:
      "showroom:compositor-disposed",

    crystalsReady:
      "showroom:crystals-ready",

    crystalsFailed:
      "showroom:crystals-failed",

    crystalsDisposed:
      "showroom:crystals-disposed",

    crystalsReceipt:
      "showroom:crystals-receipt"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    field:
      "[data-showroom-orbit-field]",

    semanticLayer:
      "[data-showroom-semantic-star-layer]",

    cardinalControls:
      "[data-showroom-cardinal-control]",

    childControls:
      "[data-showroom-child-control]",

    receipt:
      "[data-showroom-crystals-receipt]"
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const NODE_TYPES = Object.freeze({
    CARDINAL:
      "cardinal",

    CHILD:
      "child"
  });

  const PRESENTATION_MODES = Object.freeze({
    BASELINE:
      "baseline",

    CONSTELLATION:
      "constellation",

    CLUSTER:
      "cluster",

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

  const CONTEXT_IDS = Object.freeze({
    REAR:
      "rear",

    FRONT:
      "front"
  });

  const CARDINAL_TARGETS = Object.freeze({
    north:
      Object.freeze({
        x: 0,
        y: 1.32,
        z: -0.54
      }),

    east:
      Object.freeze({
        x: 1.50,
        y: 0,
        z: 0.62
      }),

    south:
      Object.freeze({
        x: 0,
        y: -1.32,
        z: 0.48
      }),

    west:
      Object.freeze({
        x: -1.50,
        y: 0,
        z: -0.66
      })
  });

  const CHILD_LAYOUT = Object.freeze({
    collapsed:
      Object.freeze({
        horizontalRadius:
          1.08,

        verticalRadius:
          0.94,

        depthRadius:
          0.88,

        centerOffset:
          0.24
      }),

    expanded:
      Object.freeze({
        horizontalRadius:
          1.26,

        verticalRadius:
          1.08,

        depthRadius:
          0.98,

        centerOffset:
          0.34
      }),

    positions:
      Object.freeze({
        1:
          Object.freeze({
            x: -0.72,
            y: 0.70,
            z: -0.54
          }),

        2:
          Object.freeze({
            x: 0.72,
            y: 0.70,
            z: 0.56
          }),

        3:
          Object.freeze({
            x: 0.72,
            y: -0.70,
            z: -0.48
          }),

        4:
          Object.freeze({
            x: -0.72,
            y: -0.70,
            z: 0.52
          })
      })
  });

  const QUALITY = Object.freeze({
    bloomDisableWidthPx:
      420,

    normalMatrixEpsilon:
      1e-7,

    maximumDeltaSeconds:
      0.05,

    transformSettleSpeed:
      7.1,

    reducedMotionSettleSpeed:
      24,

    ambientFrameIntervalMs:
      1000 / 30,

    cardinalHitRadius:
      78,

    childHitRadius:
      48,

    visibilityThreshold:
      0.035
  });

  const PALETTES = Object.freeze({
    north:
      Object.freeze({
        primary:
          Object.freeze([
            0.76,
            0.86,
            1
          ]),

        secondary:
          Object.freeze([
            0.94,
            0.98,
            1
          ]),

        warmSpecular:
          Object.freeze([
            1,
            0.97,
            0.86
          ]),

        coolRim:
          Object.freeze([
            0.62,
            0.82,
            1
          ])
      }),

    east:
      Object.freeze({
        primary:
          Object.freeze([
            1,
            0.76,
            0.30
          ]),

        secondary:
          Object.freeze([
            1,
            0.92,
            0.68
          ]),

        warmSpecular:
          Object.freeze([
            1,
            0.91,
            0.62
          ]),

        coolRim:
          Object.freeze([
            0.78,
            0.86,
            1
          ])
      }),

    south:
      Object.freeze({
        primary:
          Object.freeze([
            1,
            0.54,
            0.62
          ]),

        secondary:
          Object.freeze([
            0.76,
            0.56,
            0.96
          ]),

        warmSpecular:
          Object.freeze([
            1,
            0.88,
            0.80
          ]),

        coolRim:
          Object.freeze([
            0.72,
            0.64,
            1
          ])
      }),

    west:
      Object.freeze({
        primary:
          Object.freeze([
            0.28,
            0.44,
            0.96
          ]),

        secondary:
          Object.freeze([
            0.48,
            0.36,
            0.86
          ]),

        warmSpecular:
          Object.freeze([
            0.91,
            0.92,
            1
          ]),

        coolRim:
          Object.freeze([
            0.54,
            0.72,
            1
          ])
      })
  });

  const MATERIALS = Object.freeze({
    CARDINAL:
      Object.freeze({
        baseScale:
          0.76,

        activeScale:
          1.02,

        selectedScale:
          1.10,

        previewScale:
          1.08,

        opacity:
          0.95,

        emissive:
          0.19,

        rim:
          1.18,

        sparkle:
          0.22,

        halo:
          0.78,

        float:
          0.012,

        spin:
          0.15,

        saturation:
          1
      }),

    LOCAL:
      Object.freeze({
        baseScale:
          0.66,

        activeScale:
          0.82,

        selectedScale:
          0.91,

        previewScale:
          0.88,

        opacity:
          0.90,

        emissive:
          0.11,

        rim:
          0.84,

        sparkle:
          0.10,

        halo:
          0.38,

        float:
          0.007,

        spin:
          0.08,

        saturation:
          0.88
      }),

    PORTAL:
      Object.freeze({
        baseScale:
          0.69,

        activeScale:
          0.87,

        selectedScale:
          0.96,

        previewScale:
          0.94,

        opacity:
          0.93,

        emissive:
          0.17,

        rim:
          1.12,

        sparkle:
          0.18,

        halo:
          0.62,

        float:
          0.009,

        spin:
          0.10,

        saturation:
          1
      }),

    PRIMARY_PORTAL:
      Object.freeze({
        baseScale:
          0.74,

        activeScale:
          0.94,

        selectedScale:
          1.03,

        previewScale:
          1,

        opacity:
          0.96,

        emissive:
          0.22,

        rim:
          1.24,

        sparkle:
          0.22,

        halo:
          0.78,

        float:
          0.009,

        spin:
          0.10,

        saturation:
          1
      })
  });

  const state = {
    root:
      null,

    field:
      null,

    semanticLayer:
      null,

    receiptOutput:
      null,

    controller:
      null,

    compositor:
      null,

    controllerFrame:
      null,

    compositorFrame:
      null,

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

    listeners:
      [],

    animationRaf:
      0,

    lastAnimationTime:
      0,

    lastAmbientRequestTime:
      0,

    animationRunning:
      false,

    contextDegraded:
      false,

    runtimeSurfacesActivated:
      false,

    waitingForCompositor:
      false,

    initialized:
      false,

    initializing:
      false,

    ready:
      false,

    readyPublished:
      false,

    disposed:
      false,

    failed:
      false,

    failureReason:
      "",

    counters:
      {
        nodeRegistrations:
          0,

        nodeUnregistrations:
          0,

        rendererRegistrations:
          0,

        rendererUnregistrations:
          0,

        rearDrawCalls:
          0,

        frontDrawCalls:
          0,

        rearFrames:
          0,

        frontFrames:
          0,

        contextLosses:
          0,

        contextRestores:
          0,

        animationRequests:
          0,

        failures:
          0
      }
  };

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;
    attribute float aSparkleIndex;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uNormalMatrix;

    uniform float uScale;
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vSparkleIndex;
    varying float vHaloPass;

    void main() {
      vec3 position =
        aPosition *
        uScale;

      if (uHaloPass > 0.5) {
        position +=
          normalize(aNormal) *
          uHaloExpansion;
      }

      vec4 world =
        uModel *
        vec4(
          position,
          1.0
        );

      vec4 view =
        uView *
        world;

      vNormal =
        normalize(
          uNormalMatrix *
          aNormal
        );

      vColor =
        aColor;

      vViewPosition =
        view.xyz;

      vWorldPosition =
        world.xyz;

      vSparkleIndex =
        aSparkleIndex;

      vHaloPass =
        uHaloPass;

      gl_Position =
        uProjection *
        view;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vSparkleIndex;
    varying float vHaloPass;

    uniform float uTime;
    uniform float uOpacity;
    uniform float uEmissive;
    uniform float uRimStrength;
    uniform float uSparkleStrength;
    uniform float uHaloStrength;
    uniform float uReducedMotion;
    uniform float uSaturation;

    uniform vec3 uPrimaryColor;
    uniform vec3 uSecondaryColor;
    uniform vec3 uWarmSpecular;
    uniform vec3 uCoolRim;

    float hash31(vec3 point) {
      return fract(
        sin(
          dot(
            point,
            vec3(
              12.9898,
              78.233,
              37.719
            )
          )
        ) *
        43758.5453
      );
    }

    void main() {
      vec3 normal =
        normalize(vNormal);

      vec3 viewDirection =
        normalize(
          -vViewPosition
        );

      float facingToCamera =
        dot(
          normal,
          viewDirection
        );

      float rearSuppression =
        smoothstep(
          -0.22,
          0.34,
          facingToCamera
        );

      float sideRim =
        pow(
          1.0 -
          abs(
            facingToCamera
          ),
          2.35
        );

      float fresnel =
        pow(
          1.0 -
          max(
            facingToCamera,
            0.0
          ),
          2.10
        );

      vec3 keyDirection =
        normalize(
          vec3(
            0.46,
            0.78,
            0.64
          )
        );

      vec3 fillDirection =
        normalize(
          vec3(
            -0.72,
            0.20,
            0.58
          )
        );

      vec3 rimDirection =
        normalize(
          vec3(
            0.10,
            -0.48,
            0.88
          )
        );

      float key =
        max(
          dot(
            normal,
            keyDirection
          ),
          0.0
        );

      float fill =
        max(
          dot(
            normal,
            fillDirection
          ),
          0.0
        );

      float rear =
        max(
          dot(
            normal,
            rimDirection
          ),
          0.0
        );

      vec3 halfDirection =
        normalize(
          keyDirection +
          viewDirection
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

      float facetBand =
        pow(
          abs(
            dot(
              normal,
              normalize(
                vec3(
                  0.45,
                  0.72,
                  0.53
                )
              )
            )
          ),
          5.0
        );

      float sparkleSeed =
        hash31(
          floor(
            (
              normal +
              vWorldPosition
            ) *
            18.0 +
            vSparkleIndex
          )
        );

      float sparklePhase =
        uReducedMotion > 0.5
          ? 1.0
          : (
              0.76 +
              sin(
                uTime *
                1.55 +
                sparkleSeed *
                6.28318
              ) *
              0.24
            );

      float sparkle =
        smoothstep(
          0.76,
          1.0,
          specular +
          facetBand *
          0.34
        ) *
        sparklePhase *
        uSparkleStrength *
        rearSuppression;

      vec3 mixedBase =
        mix(
          uSecondaryColor,
          uPrimaryColor,
          clamp(
            vColor.r,
            0.0,
            1.0
          )
        );

      float luminance =
        dot(
          mixedBase,
          vec3(
            0.2126,
            0.7152,
            0.0722
          )
        );

      vec3 base =
        mix(
          vec3(luminance),
          mixedBase,
          clamp(
            uSaturation,
            0.0,
            1.0
          )
        );

      if (vHaloPass > 0.5) {
        vec3 haloColor =
          (
            base *
            0.72 +
            uCoolRim *
            fresnel *
            0.56
          ) *
          (
            0.64 +
            fresnel *
            1.16 +
            sideRim *
            0.42 +
            rear *
            0.20
          ) *
          uHaloStrength;

        float haloAlpha =
          clamp(
            (
              0.035 +
              fresnel *
              0.17 +
              sideRim *
              0.08
            ) *
            uHaloStrength *
            uOpacity,
            0.0,
            0.32
          );

        gl_FragColor =
          vec4(
            haloColor,
            haloAlpha
          );

        return;
      }

      float diffuse =
        0.24 +
        key *
        0.80 +
        fill *
        0.28 +
        rear *
        0.13;

      vec3 lit =
        base *
        diffuse;

      vec3 warmHighlight =
        uWarmSpecular *
        specular *
        (
          0.86 +
          uRimStrength *
          0.20
        ) *
        rearSuppression;

      vec3 primaryRim =
        base *
        (
          fresnel *
          0.66 +
          sideRim *
          0.34
        ) *
        uRimStrength;

      vec3 secondaryRim =
        uCoolRim *
        (
          fresnel *
          0.24 +
          sideRim *
          0.15
        ) *
        uRimStrength;

      vec3 emissive =
        base *
        uEmissive;

      vec3 sparkleColor =
        uWarmSpecular *
        sparkle;

      float rearDim =
        mix(
          0.60,
          1.0,
          rearSuppression
        );

      vec3 color =
        (
          lit +
          warmHighlight +
          primaryRim +
          secondaryRim +
          emissive +
          sparkleColor
        ) *
        rearDim;

      float alpha =
        clamp(
          uOpacity *
          (
            0.72 +
            fresnel *
            0.08
          ),
          0.08,
          1.0
        );

      gl_FragColor =
        vec4(
          color,
          alpha
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
      value ||
      ""
    ).trim();
  }

  function normalizeLower(value) {
    return normalize(value)
      .toLowerCase();
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

  function isCanvas(value) {
    return (
      typeof HTMLCanvasElement !==
        "undefined" &&
      value instanceof
        HTMLCanvasElement
    );
  }

  function nowIso() {
    return new Date()
      .toISOString();
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
        value.map(
          freezePlain
        )
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

    return Object.freeze(
      output
    );
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

        controllerContract:
          CONTROLLER_CONTRACT,

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

  function countNodesByType(type) {
    let count = 0;

    for (
      const node
      of state.registry.values()
    ) {
      if (
        node.type ===
        type
      ) {
        count += 1;
      }
    }

    return count;
  }

  function isContextReady(id) {
    const renderer =
      state.contexts.get(id);

    return Boolean(
      renderer &&
      renderer.available &&
      renderer.contextLost !==
        true &&
      renderer.gl &&
      renderer.program
    );
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

        compositorContract:
          COMPOSITOR_CONTRACT,

        event,

        timestamp:
          nowIso(),

        initialized:
          state.initialized,

        ready:
          state.ready,

        disposed:
          state.disposed,

        failed:
          state.failed,

        contextDegraded:
          state.contextDegraded,

        runtimeSurfacesActivated:
          state
            .runtimeSurfacesActivated,

        waitingForCompositor:
          state
            .waitingForCompositor,

        cardinalCount:
          countNodesByType(
            NODE_TYPES.CARDINAL
          ),

        childCount:
          countNodesByType(
            NODE_TYPES.CHILD
          ),

        nodeCount:
          state.registry.size,

        registeredNodeCount:
          state
            .nodeRegistrations
            .size,

        rendererRegistered:
          Boolean(
            state
              .rendererRegistration
          ),

        rearContextReady:
          isContextReady(
            CONTEXT_IDS.REAR
          ),

        frontContextReady:
          isContextReady(
            CONTEXT_IDS.FRONT
          ),

        renderRafOwned:
          false,

        animationStateSchedulerOwned:
          true,

        navigationOwned:
          false,

        classificationOwned:
          false,

        canvasLifecycleOwned:
          false,

        registeredRendererLifecycleOwned:
          true,

        semanticControlCreationOwned:
          false,

        semanticControlPositioningOwned:
          false,

        counters:
          {
            ...state.counters
          },

        ...detail
      });

    const serialized =
      JSON.stringify(
        payload
      );

    if (state.receiptOutput) {
      if (
        "value" in
        state.receiptOutput
      ) {
        state.receiptOutput.value =
          serialized;
      }

      state.receiptOutput.textContent =
        serialized;
    }

    dispatch(
      EVENTS.crystalsReceipt,
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
      typeof target
        .addEventListener !==
        "function"
    ) {
      return;
    }

    target.addEventListener(
      type,
      handler,
      options
    );

    state.listeners.push(
      () => {
        target.removeEventListener(
          type,
          handler,
          options
        );
      }
    );
  }

  function removeListeners() {
    for (
      const remove
      of state.listeners.splice(0)
    ) {
      try {
        remove();
      } catch {
        /* Best-effort listener disposal. */
      }
    }
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
      length <=
        1e-12
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
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
      new Array(16)
        .fill(0);

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
          output[
            column * 4 +
            row
          ] +=
            left[
              index * 4 +
              row
            ] *
            right[
              column * 4 +
              index
            ];
        }
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

    matrix[12] = x;
    matrix[13] = y;
    matrix[14] = z;

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
    modelView
  ) {
    const a00 =
      modelView[0];

    const a01 =
      modelView[4];

    const a02 =
      modelView[8];

    const a10 =
      modelView[1];

    const a11 =
      modelView[5];

    const a12 =
      modelView[9];

    const a20 =
      modelView[2];

    const a21 =
      modelView[6];

    const a22 =
      modelView[10];

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
      !Number.isFinite(
        determinant
      ) ||
      Math.abs(
        determinant
      ) <=
        QUALITY
          .normalMatrixEpsilon
    ) {
      return [
        a00, a10, a20,
        a01, a11, a21,
        a02, a12, a22
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

  function createDiamondMesh(options) {
    const points =
      options.points;

    const radius =
      options.radius;

    const inner =
      options.inner;

    const depth =
      options.depth;

    const crown =
      options.crown;

    const verticalCompression =
      options.verticalCompression;

    const outerRidge =
      options.outerRidge;

    const innerRidge =
      options.innerRidge;

    const vertices = [];
    const faces = [];

    function add(point) {
      vertices.push(point);

      return (
        vertices.length -
        1
      );
    }

    function face(
      first,
      second,
      third
    ) {
      faces.push([
        first,
        second,
        third
      ]);
    }

    const frontApex =
      add([
        0,
        0,
        depth
      ]);

    const rearApex =
      add([
        0,
        0,
        -depth
      ]);

    const frontCrown =
      add([
        0,
        0,
        depth + crown
      ]);

    const rearCrown =
      add([
        0,
        0,
        -depth -
          crown * 0.72
      ]);

    const perimeter = [];
    const innerRing = [];
    const frontBevel = [];
    const rearBevel = [];

    for (
      let index = 0;
      index < points * 2;
      index += 1
    ) {
      const isOuterPoint =
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
        isOuterPoint
          ? radius
          : inner;

      const ridge =
        isOuterPoint
          ? outerRidge
          : innerRidge;

      perimeter.push(
        add([
          Math.cos(angle) *
            activeRadius,

          Math.sin(angle) *
            activeRadius *
            verticalCompression,

          ridge
        ])
      );

      innerRing.push(
        add([
          Math.cos(angle) *
            activeRadius *
            0.38,

          Math.sin(angle) *
            activeRadius *
            verticalCompression *
            0.38,

          depth * 0.14
        ])
      );

      frontBevel.push(
        add([
          Math.cos(angle) *
            activeRadius *
            0.72,

          Math.sin(angle) *
            activeRadius *
            verticalCompression *
            0.72,

          depth * 0.52
        ])
      );

      rearBevel.push(
        add([
          Math.cos(angle) *
            activeRadius *
            0.68,

          Math.sin(angle) *
            activeRadius *
            verticalCompression *
            0.68,

          -depth * 0.48
        ])
      );
    }

    const count =
      perimeter.length;

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const next =
        (
          index +
          1
        ) %
        count;

      face(
        frontApex,
        innerRing[index],
        innerRing[next]
      );

      face(
        frontCrown,
        frontBevel[next],
        frontBevel[index]
      );

      face(
        frontBevel[index],
        perimeter[index],
        perimeter[next]
      );

      face(
        frontBevel[index],
        perimeter[next],
        frontBevel[next]
      );

      face(
        innerRing[index],
        frontBevel[index],
        frontBevel[next]
      );

      face(
        innerRing[index],
        frontBevel[next],
        innerRing[next]
      );

      face(
        rearApex,
        rearBevel[next],
        rearBevel[index]
      );

      face(
        rearCrown,
        rearBevel[index],
        rearBevel[next]
      );

      face(
        rearBevel[index],
        perimeter[next],
        perimeter[index]
      );

      face(
        rearBevel[index],
        rearBevel[next],
        perimeter[next]
      );
    }

    const positions = [];
    const normals = [];
    const colors = [];
    const sparkleIndices = [];

    faces.forEach(
      (
        triangle,
        faceIndex
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

        const colorLift =
          clamp(
            0.70 +
            (
              faceIndex %
              9
            ) *
            0.035,
            0.70,
            1
          );

        const sparkleIndex =
          faceIndex % 5 === 0
            ? 1
            : 0;

        [
          first,
          second,
          third
        ].forEach(
          point => {
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

            colors.push(
              colorLift,
              colorLift,
              colorLift
            );

            sparkleIndices.push(
              sparkleIndex
            );
          }
        );
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

      colors:
        new Float32Array(
          colors
        ),

      sparkleIndices:
        new Float32Array(
          sparkleIndices
        ),

      vertexCount:
        positions.length / 3,

      summary:
        Object.freeze({
          majorPoints:
            points,

          perimeterPositions:
            points * 2,

          outerRadius:
            radius,

          innerRadius:
            inner,

          frontDepth:
            depth,

          rearDepth:
            -depth,

          frontCrownExtension:
            crown,

          rearCrownExtension:
            crown * 0.72,

          verticalCompression,

          outerRidge,

          innerRidge
        })
    });
  }

  function buildCpuMeshes() {
    state.cpuMeshes.set(
      NODE_TYPES.CARDINAL,
      createDiamondMesh({
        points:
          8,

        radius:
          0.72,

        inner:
          0.30,

        depth:
          0.42,

        crown:
          0.20,

        verticalCompression:
          0.78,

        outerRidge:
          0.05,

        innerRidge:
          -0.02
      })
    );

    state.cpuMeshes.set(
      NODE_TYPES.CHILD,
      createDiamondMesh({
        points:
          6,

        radius:
          0.42,

        inner:
          0.20,

        depth:
          0.25,

        crown:
          0.10,

        verticalCompression:
          0.82,

        outerRidge:
          0.04,

        innerRidge:
          -0.015
      })
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
      const information =
        gl.getShaderInfoLog(
          shader
        ) ||
        "UNKNOWN_SHADER_ERROR";

      gl.deleteShader(shader);

      throw new Error(
        information
      );
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex =
      createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragment =
      createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );

    const program =
      gl.createProgram();

    invariant(
      program,
      "SHOWROOM_CRYSTALS_PROGRAM_CREATION_FAILED"
    );

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
      const information =
        gl.getProgramInfoLog(
          program
        ) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(program);

      throw new Error(
        information
      );
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

  function bindAttribute(
    renderer,
    buffer,
    location,
    size
  ) {
    invariant(
      location >=
        0,
      "SHOWROOM_CRYSTALS_ATTRIBUTE_LOCATION_INVALID"
    );

    const gl =
      renderer.gl;

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

      color:
        createBuffer(
          gl,
          cpuMesh.colors
        ),

      sparkleIndex:
        createBuffer(
          gl,
          cpuMesh.sparkleIndices
        )
    };
  }

  function destroyContextRenderer(
    renderer,
    options = {}
  ) {
    if (!renderer) {
      return;
    }

    if (
      options.removeListeners !==
      false
    ) {
      renderer.canvas.removeEventListener(
        "webglcontextlost",
        renderer.onContextLost
      );

      renderer.canvas.removeEventListener(
        "webglcontextrestored",
        renderer.onContextRestored
      );
    }

    if (
      renderer.gl &&
      !renderer.contextLost
    ) {
      for (
        const mesh
        of renderer.meshes.values()
      ) {
        renderer.gl.deleteBuffer(
          mesh.position
        );

        renderer.gl.deleteBuffer(
          mesh.normal
        );

        renderer.gl.deleteBuffer(
          mesh.color
        );

        renderer.gl.deleteBuffer(
          mesh.sparkleIndex
        );
      }

      if (renderer.program) {
        renderer.gl.deleteProgram(
          renderer.program
        );
      }
    }

    renderer.meshes.clear();

    renderer.available =
      false;
  }

  function rebuildContextRenderer(id) {
    const current =
      state.contexts.get(id);

    invariant(
      current,
      `SHOWROOM_CRYSTALS_CONTEXT_NOT_FOUND:${id}`
    );

    const canvas =
      current.canvas;

    destroyContextRenderer(
      current,
      {
        removeListeners:
          true
      }
    );

    const replacement =
      createContextRenderer(
        id,
        canvas
      );

    state.contexts.set(
      id,
      replacement
    );
  }

  function createContextRenderer(
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
          antialias:
            true,

          alpha:
            true,

          depth:
            true,

          premultipliedAlpha:
            true,

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

    const renderer = {
      id,
      canvas,
      gl,
      program,

      available:
        true,

      contextLost:
        false,

      width:
        0,

      height:
        0,

      attribs:
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

          color:
            gl.getAttribLocation(
              program,
              "aColor"
            ),

          sparkleIndex:
            gl.getAttribLocation(
              program,
              "aSparkleIndex"
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

          scale:
            gl.getUniformLocation(
              program,
              "uScale"
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

          warmSpecular:
            gl.getUniformLocation(
              program,
              "uWarmSpecular"
            ),

          coolRim:
            gl.getUniformLocation(
              program,
              "uCoolRim"
            ),

          reducedMotion:
            gl.getUniformLocation(
              program,
              "uReducedMotion"
            ),

          saturation:
            gl.getUniformLocation(
              program,
              "uSaturation"
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

      meshes:
        new Map(),

      onContextLost:
        null,

      onContextRestored:
        null
    };

    for (
      const [
        type,
        cpuMesh
      ]
      of state.cpuMeshes
    ) {
      renderer.meshes.set(
        type,
        buildGpuMesh(
          gl,
          cpuMesh
        )
      );
    }

    renderer.onContextLost =
      event => {
        event.preventDefault();

        renderer.available =
          false;

        renderer.contextLost =
          true;

        state.contextDegraded =
          true;

        state.counters
          .contextLosses +=
          1;

        stopAnimationDriver();

        publishReceipt(
          "context-lost",
          {
            context:
              id,

            recoverable:
              true,

            recoveryRequested:
              true,

            controllerReadinessRevoked:
              false,

            fallbackRestorationRequested:
              false,

            rendererRegistrationRetained:
              true,

            nodeRegistrationsRetained:
              true,

            compositorCanvasRemoved:
              false
          }
        );
      };

    renderer.onContextRestored =
      () => {
        state.counters
          .contextRestores +=
          1;

        try {
          rebuildContextRenderer(id);

          const rearReady =
            isContextReady(
              CONTEXT_IDS.REAR
            );

          const frontReady =
            isContextReady(
              CONTEXT_IDS.FRONT
            );

          publishReceipt(
            "context-restored",
            {
              context:
                id,

              resourcesRecreated:
                true,

              rearContextReady:
                rearReady,

              frontContextReady:
                frontReady
            }
          );

          readControllerFrame();

          if (
            rearReady &&
            frontReady
          ) {
            state.contextDegraded =
              false;

            state.compositor.requestRender(
              `crystal-context-restored:${id}`
            );

            evaluateAnimationDriver();

            publishReceipt(
              "context-recovery-complete",
              {
                context:
                  id,

                controllerReadinessRetained:
                  true,

                fallbackRestorationOccurred:
                  false
              }
            );
          }
        } catch (error) {
          failRuntime(
            error,
            `context-restore:${id}`
          );
        }
      };

    canvas.addEventListener(
      "webglcontextlost",
      renderer.onContextLost
    );

    canvas.addEventListener(
      "webglcontextrestored",
      renderer.onContextRestored
    );

    return renderer;
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

    state.contexts.set(
      CONTEXT_IDS.REAR,
      createContextRenderer(
        CONTEXT_IDS.REAR,
        canvases.rear
      )
    );

    state.contexts.set(
      CONTEXT_IDS.FRONT,
      createContextRenderer(
        CONTEXT_IDS.FRONT,
        canvases.front
      )
    );
  }

  function destroyGpuResources() {
    for (
      const renderer
      of state.contexts.values()
    ) {
      try {
        destroyContextRenderer(
          renderer
        );
      } catch {
        /* Continue bounded resource disposal. */
      }
    }

    state.contexts.clear();
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

    state.receiptOutput =
      state.root.querySelector(
        SELECTORS.receipt
      );
  }

  function validateDom() {
    invariant(
      state.root,
      "SHOWROOM_CRYSTALS_ROOT_REQUIRED"
    );

    invariant(
      state.field,
      "SHOWROOM_CRYSTALS_ORBIT_FIELD_REQUIRED"
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

    const cardinals =
      Array.from(
        state.root.querySelectorAll(
          SELECTORS.cardinalControls
        )
      );

    const children =
      Array.from(
        state.root.querySelectorAll(
          SELECTORS.childControls
        )
      );

    invariant(
      cardinals.length ===
        4,
      "SHOWROOM_CRYSTALS_CARDINAL_COUNT_INVALID",
      {
        expected:
          4,

        actual:
          cardinals.length
      }
    );

    invariant(
      children.length ===
        16,
      "SHOWROOM_CRYSTALS_CHILD_COUNT_INVALID",
      {
        expected:
          16,

        actual:
          children.length
      }
    );

    for (
      const element
      of [
        ...cardinals,
        ...children
      ]
    ) {
      invariant(
        state.field.contains(
          element
        ),
        "SHOWROOM_CRYSTALS_CONTROL_OUTSIDE_FIELD",
        {
          objectId:
            element.dataset
              .showroomObjectId ||
            ""
        }
      );
    }

    return {
      cardinals,
      children
    };
  }

  function readDescriptor(
    element,
    type
  ) {
    const objectId =
      normalize(
        element.dataset
          .showroomObjectId
      );

    const cardinalId =
      normalizeWing(
        element.dataset
          .showroomCardinalId
      );

    const clusterId =
      normalizeWing(
        element.dataset
          .showroomClusterId
      );

    const childId =
      normalize(
        element.dataset
          .showroomChildId
      );

    const behavior =
      normalizeLower(
        element.dataset
          .showroomObjectBehavior
      );

    const visualClass =
      normalize(
        element.dataset
          .showroomVisualClass
      ).toUpperCase();

    const emphasis =
      normalizeLower(
        element.dataset
          .showroomEmphasis
      );

    const label =
      normalize(
        type ===
          NODE_TYPES.CARDINAL
          ? element.dataset
              .showroomCardinalLabel
          : element.dataset
              .showroomChildLabel
      ) ||
      normalize(
        element.getAttribute(
          "aria-label"
        )
      ) ||
      normalize(
        element.textContent
      );

    invariant(
      objectId,
      "SHOWROOM_CRYSTALS_OBJECT_ID_REQUIRED"
    );

    invariant(
      cardinalId,
      `SHOWROOM_CRYSTALS_CARDINAL_ID_REQUIRED:${objectId}`
    );

    if (
      type ===
      NODE_TYPES.CHILD
    ) {
      invariant(
        clusterId,
        `SHOWROOM_CRYSTALS_CLUSTER_ID_REQUIRED:${objectId}`
      );

      invariant(
        childId,
        `SHOWROOM_CRYSTALS_CHILD_ID_REQUIRED:${objectId}`
      );

      invariant(
        clusterId ===
          cardinalId,
        `SHOWROOM_CRYSTALS_CHILD_PARENT_MISMATCH:${objectId}`,
        {
          cardinalId,
          clusterId
        }
      );
    }

    return {
      type,
      objectId,
      cardinalId,

      clusterId:
        type ===
        NODE_TYPES.CARDINAL
          ? cardinalId
          : clusterId,

      childId:
        type ===
        NODE_TYPES.CHILD
          ? childId
          : "",

      behavior,
      visualClass,
      emphasis,
      label,

      semanticElement:
        element
    };
  }

  function materialFamilyForDescriptor(
    descriptor
  ) {
    if (
      descriptor.type ===
      NODE_TYPES.CARDINAL
    ) {
      return MATERIAL_FAMILIES.CARDINAL;
    }

    if (
      descriptor.visualClass ===
        "PRIMARY_PORTAL" ||
      descriptor.emphasis ===
        "primary-external"
    ) {
      return MATERIAL_FAMILIES
        .PRIMARY_PORTAL;
    }

    if (
      descriptor.visualClass ===
        "PORTAL" ||
      descriptor.emphasis ===
        "external" ||
      descriptor.behavior ===
        "portal"
    ) {
      return MATERIAL_FAMILIES.PORTAL;
    }

    return MATERIAL_FAMILIES.LOCAL;
  }

  function childOrdinal(childId) {
    const match =
      normalize(childId)
        .match(
          /-(\d+)$/
        );

    invariant(
      match,
      `SHOWROOM_CRYSTALS_CHILD_SUFFIX_INVALID:${childId}`
    );

    const ordinal =
      Number(match[1]);

    invariant(
      ordinal >=
        1 &&
      ordinal <=
        4,
      `SHOWROOM_CRYSTALS_CHILD_ORDINAL_INVALID:${childId}`
    );

    return ordinal;
  }

  function cardinalUnitDirection(wing) {
    const target =
      CARDINAL_TARGETS[wing];

    return normalizeVector([
      target.x,
      target.y,
      target.z
    ]);
  }

  function cardinalCenterOffset(
    wing,
    distance
  ) {
    const direction =
      cardinalUnitDirection(
        wing
      );

    return {
      x:
        direction[0] *
        distance,

      y:
        direction[1] *
        distance,

      z:
        direction[2] *
        distance
    };
  }

  function childLocalPosition(
    ordinal,
    layout
  ) {
    const source =
      CHILD_LAYOUT.positions[
        ordinal
      ];

    return {
      x:
        source.x *
        layout.horizontalRadius,

      y:
        source.y *
        layout.verticalRadius,

      z:
        source.z *
        layout.depthRadius
    };
  }

  function rotateChildLocalForWing(
    wing,
    local
  ) {
    switch (wing) {
      case "north":
        return {
          x:
            local.x,

          y:
            local.y,

          z:
            local.z
        };

      case "east":
        return {
          x:
            local.y,

          y:
            -local.x,

          z:
            -local.z
        };

      case "south":
        return {
          x:
            -local.x,

          y:
            -local.y,

          z:
            local.z
        };

      case "west":
        return {
          x:
            -local.y,

          y:
            local.x,

          z:
            -local.z
        };

      default:
        return {
          x:
            local.x,

          y:
            local.y,

          z:
            local.z
        };
    }
  }

  function childTarget(
    wing,
    ordinal,
    expanded
  ) {
    const layout =
      expanded
        ? CHILD_LAYOUT.expanded
        : CHILD_LAYOUT.collapsed;

    const cardinal =
      CARDINAL_TARGETS[wing];

    const centerOffset =
      cardinalCenterOffset(
        wing,
        layout.centerOffset
      );

    const local =
      rotateChildLocalForWing(
        wing,
        childLocalPosition(
          ordinal,
          layout
        )
      );

    return {
      x:
        cardinal.x +
        centerOffset.x +
        local.x,

      y:
        cardinal.y +
        centerOffset.y +
        local.y,

      z:
        cardinal.z +
        centerOffset.z +
        local.z
    };
  }

  function collapsedChildTarget(
    wing,
    ordinal
  ) {
    return childTarget(
      wing,
      ordinal,
      false
    );
  }

  function expandedChildTarget(
    wing,
    ordinal
  ) {
    return childTarget(
      wing,
      ordinal,
      true
    );
  }

  function makeNode(descriptor) {
    const materialFamily =
      materialFamilyForDescriptor(
        descriptor
      );

    const nodeId =
      `crystal:${descriptor.objectId}`;

    const cardinalTarget =
      CARDINAL_TARGETS[
        descriptor.cardinalId
      ];

    const initialPosition =
      descriptor.type ===
      NODE_TYPES.CARDINAL
        ? {
            ...cardinalTarget
          }
        : collapsedChildTarget(
            descriptor.cardinalId,
            childOrdinal(
              descriptor.childId
            )
          );

    return {
      id:
        nodeId,

      objectId:
        descriptor.objectId,

      semanticObjectId:
        descriptor.objectId,

      type:
        descriptor.type,

      cardinalId:
        descriptor.cardinalId,

      clusterId:
        descriptor.clusterId,

      childId:
        descriptor.childId,

      behavior:
        descriptor.behavior,

      visualClass:
        descriptor.visualClass,

      emphasis:
        descriptor.emphasis,

      label:
        descriptor.label,

      semanticElement:
        descriptor.semanticElement,

      materialFamily,

      visible:
        false,

      targetVisible:
        false,

      settled:
        false,

      phase:
        state.registry.size *
        0.61 +
        (
          descriptor.type ===
          NODE_TYPES.CARDINAL
            ? 0.23
            : 0.47
        ),

      current:
        {
          x:
            initialPosition.x,

          y:
            initialPosition.y,

          z:
            initialPosition.z,

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

          saturation:
            1,

          rx:
            0,

          ry:
            0,

          rz:
            0,

          float:
            0,

          spin:
            0
        },

      target:
        {
          x:
            initialPosition.x,

          y:
            initialPosition.y,

          z:
            initialPosition.z,

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

          saturation:
            1,

          float:
            0,

          spin:
            0
        }
    };
  }

  function buildRegistry(
    cardinalElements,
    childElements
  ) {
    const objectIds =
      new Set();

    const clusterCounts =
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
      of cardinalElements
    ) {
      const descriptor =
        readDescriptor(
          element,
          NODE_TYPES.CARDINAL
        );

      invariant(
        !objectIds.has(
          descriptor.objectId
        ),
        `SHOWROOM_CRYSTALS_DUPLICATE_OBJECT_ID:${descriptor.objectId}`
      );

      objectIds.add(
        descriptor.objectId
      );

      const node =
        makeNode(descriptor);

      state.registry.set(
        node.id,
        node
      );
    }

    for (
      const element
      of childElements
    ) {
      const descriptor =
        readDescriptor(
          element,
          NODE_TYPES.CHILD
        );

      invariant(
        !objectIds.has(
          descriptor.objectId
        ),
        `SHOWROOM_CRYSTALS_DUPLICATE_OBJECT_ID:${descriptor.objectId}`
      );

      objectIds.add(
        descriptor.objectId
      );

      clusterCounts.set(
        descriptor.clusterId,
        (
          clusterCounts.get(
            descriptor.clusterId
          ) ||
          0
        ) +
        1
      );

      const node =
        makeNode(descriptor);

      state.registry.set(
        node.id,
        node
      );
    }

    invariant(
      objectIds.size ===
        20,
      "SHOWROOM_CRYSTALS_UNIQUE_OBJECT_COUNT_INVALID",
      {
        expected:
          20,

        actual:
          objectIds.size
      }
    );

    for (
      const wing
      of WINGS
    ) {
      invariant(
        clusterCounts.get(
          wing
        ) ===
          4,
        `SHOWROOM_CRYSTALS_CLUSTER_COUNT_INVALID:${wing}`,
        {
          expected:
            4,

          actual:
            clusterCounts.get(
              wing
            )
        }
      );

      const cardinalNode =
        Array.from(
          state.registry.values()
        ).find(
          node =>
            node.type ===
              NODE_TYPES.CARDINAL &&
            node.cardinalId ===
              wing
        );

      invariant(
        cardinalNode,
        `SHOWROOM_CRYSTALS_CARDINAL_NODE_REQUIRED:${wing}`
      );
    }
  }

  function requireController() {
    const controller =
      window.SHOWROOM_CONTROLLER;

    invariant(
      controller,
      "SHOWROOM_CRYSTALS_CONTROLLER_REQUIRED"
    );

    invariant(
      controller.contract ===
        CONTROLLER_CONTRACT,
      "SHOWROOM_CRYSTALS_CONTROLLER_CONTRACT_INVALID"
    );

    invariant(
      typeof controller
        .getFrameState ===
        "function",
      "SHOWROOM_CRYSTALS_CONTROLLER_FRAME_SURFACE_REQUIRED"
    );

    return controller;
  }

  function validateControllerFrame(frame) {
    return Boolean(
      frame &&
      typeof frame ===
        "object" &&
      frame.contract ===
        CONTROLLER_CONTRACT &&
      frame.controllerReady ===
        true &&
      frame.disposed ===
        false &&
      typeof frame
        .presentationMode ===
        "string" &&
      typeof frame.held ===
        "boolean" &&
      typeof frame
        .reducedMotion ===
        "boolean" &&
      frame.preview &&
      typeof frame.preview ===
        "object" &&
      frame.readiness &&
      typeof frame.readiness ===
        "object"
    );
  }

  function readControllerFrame() {
    const frame =
      state.controller
        .getFrameState();

    invariant(
      validateControllerFrame(
        frame
      ),
      "SHOWROOM_CRYSTALS_CONTROLLER_FRAME_INVALID"
    );

    state.controllerFrame =
      frame;

    return frame;
  }

  function requireCompositor() {
    const compositor =
      window.SHOWROOM_COMPOSITOR;

    invariant(
      compositor,
      "SHOWROOM_CRYSTALS_COMPOSITOR_REQUIRED"
    );

    invariant(
      compositor.contract ===
        COMPOSITOR_CONTRACT,
      "SHOWROOM_CRYSTALS_COMPOSITOR_CONTRACT_INVALID"
    );

    [
      "getFrameState",
      "getProjectionSnapshot",
      "getCanvases",
      "registerNode",
      "registerRenderer",
      "requestRender"
    ].forEach(
      surface => {
        invariant(
          typeof compositor[
            surface
          ] ===
            "function",
          `SHOWROOM_CRYSTALS_COMPOSITOR_SURFACE_REQUIRED:${surface}`
        );
      }
    );

    return compositor;
  }

  function compositorIsAuthoritativelyReady() {
    return Boolean(
      state.controllerFrame &&
      state.controllerFrame
        .readiness &&
      state.controllerFrame
        .readiness
        .compositor ===
        true &&
      state.controllerFrame
        .readiness
        .compositorFailed !==
        true
    );
  }

  function frameValue(
    frame,
    key,
    fallback = ""
  ) {
    return (
      frame &&
      Object.prototype
        .hasOwnProperty.call(
          frame,
          key
        )
        ? frame[key]
        : fallback
    );
  }

  function previewObjectId(frame) {
    return normalize(
      frame &&
      frame.preview
        ? frame.preview.objectId
        : ""
    );
  }

  function activeCardinalId(frame) {
    return normalizeWing(
      frameValue(
        frame,
        "activeCardinalId",
        ""
      )
    );
  }

  function activeClusterId(frame) {
    return normalizeWing(
      frameValue(
        frame,
        "activeClusterId",
        ""
      )
    );
  }

  function activeChildId(frame) {
    return normalize(
      frameValue(
        frame,
        "activeChildId",
        ""
      )
    );
  }

  function pendingRouteId(frame) {
    return normalize(
      frameValue(
        frame,
        "pendingRouteId",
        ""
      )
    );
  }

  function presentationMode(frame) {
    const mode =
      normalizeLower(
        frame.presentationMode
      );

    if (
      Object.values(
        PRESENTATION_MODES
      ).includes(mode)
    ) {
      return mode;
    }

    return PRESENTATION_MODES.BASELINE;
  }

  function nodeMatchesObject(
    node,
    objectId
  ) {
    return Boolean(
      objectId &&
      (
        node.objectId ===
          objectId ||
        node.childId ===
          objectId ||
        node.cardinalId ===
          objectId
      )
    );
  }

  function routeMatchesNode(
    node,
    routeId
  ) {
    if (!routeId) {
      return false;
    }

    const semanticRoute =
      normalize(
        node.semanticElement.dataset
          .showroomRouteId ||
        node.semanticElement.dataset
          .showroomRoute ||
        node.semanticElement
          .getAttribute(
            "href"
          )
      );

    return (
      node.objectId ===
        routeId ||
      node.childId ===
        routeId ||
      semanticRoute ===
        routeId
    );
  }

  function materialForNode(node) {
    return (
      MATERIALS[
        node.materialFamily
      ] ||
      MATERIALS.LOCAL
    );
  }

  function setTargetVisual(
    node,
    values
  ) {
    Object.assign(
      node.target,
      values
    );
  }

  function computeTargets() {
    const frame =
      state.controllerFrame;

    const mode =
      presentationMode(frame);

    if (
      frame.held ===
      true
    ) {
      for (
        const node
        of state.registry.values()
      ) {
        node.target.float =
          0;

        node.target.spin =
          0;

        node.target.sparkle =
          0;
      }

      return;
    }

    const previewId =
      previewObjectId(frame);

    const activeCardinal =
      activeCardinalId(frame);

    const activeCluster =
      activeClusterId(frame) ||
      activeCardinal;

    const activeChild =
      activeChildId(frame);

    const pendingRoute =
      pendingRouteId(frame);

    for (
      const node
      of state.registry.values()
    ) {
      const material =
        materialForNode(node);

      const isPreviewed =
        nodeMatchesObject(
          node,
          previewId
        );

      const previewSupportsNode =
        Boolean(
          previewId &&
          node.type ===
            NODE_TYPES.CARDINAL &&
          Array.from(
            state.registry.values()
          ).some(
            candidate =>
              candidate.type ===
                NODE_TYPES.CHILD &&
              candidate.cardinalId ===
                node.cardinalId &&
              nodeMatchesObject(
                candidate,
                previewId
              )
          )
        );

      const isActiveCardinal =
        node.type ===
          NODE_TYPES.CARDINAL &&
        node.cardinalId ===
          activeCardinal;

      const isActiveChild =
        node.type ===
          NODE_TYPES.CHILD &&
        nodeMatchesObject(
          node,
          activeChild
        );

      const isPendingRoute =
        routeMatchesNode(
          node,
          pendingRoute
        );

      const inActiveCluster =
        node.type ===
          NODE_TYPES.CHILD &&
        node.clusterId ===
          activeCluster;

      let position;

      if (
        node.type ===
        NODE_TYPES.CARDINAL
      ) {
        position = {
          ...CARDINAL_TARGETS[
            node.cardinalId
          ]
        };
      } else {
        position =
          inActiveCluster &&
          mode ===
            PRESENTATION_MODES.CLUSTER
            ? expandedChildTarget(
                node.cardinalId,
                childOrdinal(
                  node.childId
                )
              )
            : collapsedChildTarget(
                node.cardinalId,
                childOrdinal(
                  node.childId
                )
              );
      }

      let scale =
        material.baseScale;

      let opacity =
        material.opacity;

      let emissive =
        material.emissive;

      let rim =
        material.rim;

      let sparkle =
        material.sparkle;

      let halo =
        material.halo;

      let saturation =
        material.saturation;

      let visible =
        mode !==
        PRESENTATION_MODES.BASELINE;

      if (
        mode ===
        PRESENTATION_MODES.BASELINE
      ) {
        opacity =
          0;

        scale =
          0.01;

        halo =
          0;

        sparkle =
          0;

        visible =
          false;
      }

      if (
        mode ===
        PRESENTATION_MODES.CONSTELLATION
      ) {
        if (
          node.type ===
          NODE_TYPES.CARDINAL
        ) {
          scale =
            isActiveCardinal
              ? material.activeScale
              : material.baseScale;

          opacity =
            isActiveCardinal
              ? 1
              : 0.94;
        } else {
          scale *=
            0.82;

          opacity *=
            0.64;

          halo *=
            0.62;

          sparkle *=
            0.58;
        }
      }

      if (
        mode ===
        PRESENTATION_MODES.CLUSTER
      ) {
        if (
          node.type ===
          NODE_TYPES.CARDINAL
        ) {
          if (
            node.cardinalId ===
            activeCluster
          ) {
            scale =
              material.activeScale;

            opacity =
              1;

            emissive *=
              1.16;

            rim *=
              1.12;

            halo *=
              1.10;
          } else {
            scale *=
              0.74;

            opacity *=
              0.46;

            emissive *=
              0.64;

            rim *=
              0.68;

            halo *=
              0.42;

            sparkle *=
              0.34;

            position.x *=
              1.06;

            position.y *=
              1.06;

            position.z -=
              0.18;
          }
        } else if (
          inActiveCluster
        ) {
          scale =
            material.activeScale;

          opacity =
            0.96;
        } else {
          scale *=
            0.68;

          opacity *=
            0.28;

          emissive *=
            0.54;

          rim *=
            0.58;

          halo *=
            0.30;

          sparkle *=
            0.20;

          position.x *=
            1.05;

          position.y *=
            1.05;

          position.z -=
            0.28;
        }
      }

      if (
        mode ===
        PRESENTATION_MODES.FRONT
      ) {
        const ancestryVisible =
          (
            node.type ===
              NODE_TYPES.CARDINAL &&
            node.cardinalId ===
              activeCardinal
          ) ||
          (
            node.type ===
              NODE_TYPES.CHILD &&
            (
              nodeMatchesObject(
                node,
                activeChild
              ) ||
              node.clusterId ===
                activeCluster
            )
          );

        if (ancestryVisible) {
          scale *=
            nodeMatchesObject(
              node,
              activeChild
            )
              ? 0.94
              : 0.82;

          opacity *=
            nodeMatchesObject(
              node,
              activeChild
            )
              ? 0.90
              : 0.72;

          emissive *=
            0.82;

          halo *=
            0.58;

          sparkle *=
            0.36;
        } else {
          scale *=
            0.58;

          opacity *=
            0.16;

          emissive *=
            0.42;

          rim *=
            0.46;

          halo *=
            0.18;

          sparkle =
            0;

          position.x *=
            1.08;

          position.y *=
            1.08;

          position.z -=
            0.58;
        }
      }

      if (
        isActiveCardinal ||
        isActiveChild
      ) {
        scale =
          Math.max(
            scale,
            material.selectedScale
          );

        opacity =
          Math.max(
            opacity,
            0.98
          );

        emissive *=
          1.24;

        rim *=
          1.18;

        halo *=
          1.18;
      }

      if (isPreviewed) {
        scale =
          Math.max(
            scale,
            material.previewScale
          );

        emissive *=
          1.20;

        rim *=
          1.18;

        halo *=
          1.12;

        opacity =
          Math.max(
            opacity,
            0.96
          );
      } else if (
        previewSupportsNode
      ) {
        scale *=
          1.04;

        emissive *=
          1.08;

        rim *=
          1.06;

        halo *=
          1.05;
      }

      if (isPendingRoute) {
        scale *=
          1.06;

        emissive *=
          1.24;

        rim *=
          1.22;

        halo *=
          1.26;

        sparkle *=
          1.12;

        opacity =
          Math.max(
            opacity,
            0.98
          );
      }

      if (
        frame.reducedMotion ===
        true
      ) {
        sparkle =
          0;
      }

      node.targetVisible =
        visible;

      setTargetVisual(
        node,
        {
          x:
            position.x,

          y:
            position.y,

          z:
            position.z,

          scale:
            clamp(
              scale,
              0.01,
              1.34
            ),

          opacity:
            clamp(
              opacity,
              0,
              1
            ),

          emissive:
            clamp(
              emissive,
              0,
              0.52
            ),

          rim:
            clamp(
              rim,
              0,
              1.72
            ),

          sparkle:
            clamp(
              sparkle,
              0,
              0.52
            ),

          halo:
            clamp(
              halo,
              0,
              1.42
            ),

          saturation:
            clamp(
              saturation,
              0,
              1
            ),

          float:
            frame.reducedMotion
              ? 0
              : material.float,

          spin:
            frame.reducedMotion
              ? 0
              : material.spin
        }
      );
    }
  }

  function nodeHasActiveInterpolation(
    node
  ) {
    const keys = [
      "x",
      "y",
      "z",
      "scale",
      "opacity",
      "emissive",
      "rim",
      "sparkle",
      "halo",
      "saturation",
      "float",
      "spin"
    ];

    return keys.some(
      key =>
        Math.abs(
          node.current[key] -
          node.target[key]
        ) >
        (
          key ===
            "opacity" ||
          key ===
            "scale"
            ? 0.001
            : 0.002
        )
    );
  }

  function updateNodeState(
    node,
    deltaSeconds
  ) {
    const frame =
      state.controllerFrame;

    if (
      frame.held ===
      true
    ) {
      node.current.float =
        0;

      node.current.spin =
        0;

      node.current.sparkle =
        0;

      node.visible =
        node.current.opacity >
        QUALITY
          .visibilityThreshold;

      return false;
    }

    const reducedMotion =
      frame.reducedMotion ===
      true;

    const interpolation =
      Math.min(
        1,
        deltaSeconds *
        (
          reducedMotion
            ? QUALITY
                .reducedMotionSettleSpeed
            : QUALITY
                .transformSettleSpeed
        )
      );

    const keys = [
      "x",
      "y",
      "z",
      "scale",
      "opacity",
      "emissive",
      "rim",
      "sparkle",
      "halo",
      "saturation",
      "float",
      "spin"
    ];

    for (
      const key
      of keys
    ) {
      node.current[key] =
        lerp(
          node.current[key],
          node.target[key],
          interpolation
        );
    }

    if (reducedMotion) {
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
          state.lastAnimationTime *
          0.00042 +
          node.phase
        ) *
        0.19 *
        Math.max(
          0.34,
          node.current.opacity
        );

      node.current.rx =
        Math.sin(
          state.lastAnimationTime *
          0.00031 +
          node.phase *
          0.73
        ) *
        0.12 *
        Math.max(
          0.34,
          node.current.opacity
        );
    }

    node.visible =
      node.targetVisible ||
      node.current.opacity >
        QUALITY
          .visibilityThreshold;

    node.settled =
      !nodeHasActiveInterpolation(
        node
      );

    return !node.settled;
  }

  function ambientMotionPermitted() {
    const frame =
      state.controllerFrame;

    return Boolean(
      frame &&
      frame.held !==
        true &&
      frame.reducedMotion !==
        true &&
      presentationMode(frame) !==
        PRESENTATION_MODES.BASELINE &&
      document.visibilityState !==
        "hidden"
    );
  }

  function shouldAnimationContinue() {
    if (
      state.disposed ||
      state.failed ||
      state.contextDegraded ||
      !state.ready ||
      !state.controllerFrame ||
      document.visibilityState ===
        "hidden"
    ) {
      return false;
    }

    if (
      state.controllerFrame.held ===
      true
    ) {
      return false;
    }

    for (
      const node
      of state.registry.values()
    ) {
      if (
        nodeHasActiveInterpolation(
          node
        )
      ) {
        return true;
      }
    }

    return ambientMotionPermitted();
  }

  function animationStep(now) {
    state.animationRaf =
      0;

    if (
      state.disposed ||
      state.failed ||
      state.contextDegraded ||
      !state.ready
    ) {
      state.animationRunning =
        false;

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
        updateNodeState(
          node,
          deltaSeconds
        ) ||
        changed;
    }

    const ambient =
      ambientMotionPermitted();

    if (
      changed ||
      ambient
    ) {
      if (
        !ambient ||
        now -
          state.lastAmbientRequestTime >=
          QUALITY
            .ambientFrameIntervalMs
      ) {
        state.lastAmbientRequestTime =
          now;

        state.counters
          .animationRequests +=
          1;

        state.compositor.requestRender(
          "crystal-animation"
        );
      }
    }

    if (
      shouldAnimationContinue()
    ) {
      state.animationRaf =
        requestAnimationFrame(
          animationStep
        );

      return;
    }

    state.animationRunning =
      false;

    state.lastAnimationTime =
      0;
  }

  function startAnimationDriver() {
    if (
      state.animationRunning ||
      state.disposed ||
      state.failed ||
      state.contextDegraded ||
      !state.ready ||
      document.visibilityState ===
        "hidden"
    ) {
      return;
    }

    state.animationRunning =
      true;

    state.lastAnimationTime =
      0;

    state.animationRaf =
      requestAnimationFrame(
        animationStep
      );
  }

  function stopAnimationDriver() {
    if (state.animationRaf) {
      cancelAnimationFrame(
        state.animationRaf
      );
    }

    state.animationRaf =
      0;

    state.animationRunning =
      false;

    state.lastAnimationTime =
      0;
  }

  function evaluateAnimationDriver() {
    if (
      shouldAnimationContinue()
    ) {
      startAnimationDriver();
    } else {
      stopAnimationDriver();

      if (
        state.ready &&
        !state.contextDegraded &&
        !state.disposed &&
        !state.failed
      ) {
        state.compositor.requestRender(
          "crystal-settled"
        );
      }
    }
  }

  function nodeWorldPosition(node) {
    const floatY =
      (
        state.controllerFrame &&
        state.controllerFrame.held !==
          true &&
        state.controllerFrame
          .reducedMotion !==
          true
      )
        ? Math.sin(
            state.lastAnimationTime *
            0.00095 +
            node.phase
          ) *
          node.current.float
        : 0;

    return [
      node.current.x,
      node.current.y +
        floatY,
      node.current.z
    ];
  }

  function nodeHitRadius(node) {
    const base =
      node.type ===
      NODE_TYPES.CARDINAL
        ? QUALITY.cardinalHitRadius
        : QUALITY.childHitRadius;

    return Math.max(
      18,
      base *
      node.current.scale *
      clamp(
        node.current.opacity,
        0.30,
        1
      )
    );
  }

  function registerNodes() {
    for (
      const node
      of state.registry.values()
    ) {
      const registration =
        state.compositor
          .registerNode({
            id:
              node.id,

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
                node.visible &&
                node.current.opacity >
                  QUALITY
                    .visibilityThreshold,

            metadata:
              {
                contract:
                  CONTRACT,

                type:
                  node.type,

                objectId:
                  node.objectId,

                cardinalId:
                  node.cardinalId,

                clusterId:
                  node.clusterId,

                childId:
                  node.childId,

                behavior:
                  node.behavior,

                visualClass:
                  node.visualClass,

                emphasis:
                  node.emphasis,

                materialFamily:
                  node.materialFamily,

                label:
                  node.label
              }
          });

      invariant(
        registration &&
        typeof registration
          .unregister ===
          "function",
        `SHOWROOM_CRYSTALS_NODE_REGISTRATION_FAILED:${node.id}`
      );

      state.nodeRegistrations.set(
        node.id,
        registration
      );

      state.counters
        .nodeRegistrations +=
        1;
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
        if (
          registration &&
          typeof registration
            .unregister ===
            "function"
        ) {
          registration.unregister();

          state.counters
            .nodeUnregistrations +=
            1;
        }
      } catch {
        /* Continue bounded disposal. */
      }
    }

    state.nodeRegistrations.clear();
  }

  function resizeRenderer(
    renderer,
    payload
  ) {
    const frame =
      payload.frame;

    const viewport =
      frame &&
      frame.viewport
        ? frame.viewport
        : null;

    invariant(
      viewport,
      "SHOWROOM_CRYSTALS_RENDER_VIEWPORT_REQUIRED"
    );

    const expectedWidth =
      Math.max(
        1,
        Math.round(
          finiteNumber(
            viewport.pixelWidth,
            renderer.canvas.width
          )
        )
      );

    const expectedHeight =
      Math.max(
        1,
        Math.round(
          finiteNumber(
            viewport.pixelHeight,
            renderer.canvas.height
          )
        )
      );

    invariant(
      renderer.canvas.width ===
        expectedWidth &&
      renderer.canvas.height ===
        expectedHeight,
      `SHOWROOM_CRYSTALS_${renderer.id.toUpperCase()}_CANVAS_DIMENSION_MISMATCH`,
      {
        expectedWidth,
        expectedHeight,

        actualWidth:
          renderer.canvas.width,

        actualHeight:
          renderer.canvas.height
      }
    );

    renderer.width =
      renderer.canvas.width;

    renderer.height =
      renderer.canvas.height;

    renderer.gl.viewport(
      0,
      0,
      renderer.width,
      renderer.height
    );
  }

  function matrixFromFrame(
    frame,
    key
  ) {
    const matrix =
      frame &&
      frame.matrices
        ? frame.matrices[key]
        : null;

    invariant(
      Array.isArray(matrix) &&
      matrix.length ===
        16,
      `SHOWROOM_CRYSTALS_${key.toUpperCase()}_MATRIX_REQUIRED`
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

  function paletteForNode(node) {
    return (
      PALETTES[
        node.cardinalId
      ] ||
      PALETTES.north
    );
  }

  function applyNodeUniforms(
    renderer,
    node,
    frame,
    haloPass
  ) {
    const gl =
      renderer.gl;

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
      paletteForNode(node);

    const reducedMotion =
      Boolean(
        state.controllerFrame &&
        state.controllerFrame
          .reducedMotion
      );

    const cssWidth =
      finiteNumber(
        frame.viewport.cssWidth,
        0
      );

    const haloStrength =
      cssWidth <=
      QUALITY
        .bloomDisableWidthPx
        ? 0
        : node.current.halo;

    gl.uniformMatrix4fv(
      renderer.uniforms.model,
      false,
      new Float32Array(
        model
      )
    );

    gl.uniformMatrix4fv(
      renderer.uniforms.view,
      false,
      new Float32Array(
        view
      )
    );

    gl.uniformMatrix4fv(
      renderer.uniforms
        .projection,
      false,
      new Float32Array(
        projection
      )
    );

    gl.uniformMatrix3fv(
      renderer.uniforms
        .normalMatrix,
      false,
      new Float32Array(
        normalMatrix
      )
    );

    gl.uniform1f(
      renderer.uniforms.time,
      state.lastAnimationTime *
        0.001
    );

    gl.uniform1f(
      renderer.uniforms.opacity,
      node.current.opacity
    );

    gl.uniform1f(
      renderer.uniforms.scale,
      node.current.scale
    );

    gl.uniform1f(
      renderer.uniforms
        .emissive,
      node.current.emissive
    );

    gl.uniform1f(
      renderer.uniforms
        .rimStrength,
      node.current.rim
    );

    gl.uniform1f(
      renderer.uniforms
        .sparkleStrength,
      reducedMotion
        ? 0
        : node.current.sparkle
    );

    gl.uniform1f(
      renderer.uniforms
        .haloStrength,
      haloStrength
    );

    gl.uniform3fv(
      renderer.uniforms
        .primaryColor,
      new Float32Array(
        palette.primary
      )
    );

    gl.uniform3fv(
      renderer.uniforms
        .secondaryColor,
      new Float32Array(
        palette.secondary
      )
    );

    gl.uniform3fv(
      renderer.uniforms
        .warmSpecular,
      new Float32Array(
        palette.warmSpecular
      )
    );

    gl.uniform3fv(
      renderer.uniforms
        .coolRim,
      new Float32Array(
        palette.coolRim
      )
    );

    gl.uniform1f(
      renderer.uniforms
        .reducedMotion,
      reducedMotion
        ? 1
        : 0
    );

    gl.uniform1f(
      renderer.uniforms
        .saturation,
      node.current.saturation
    );

    gl.uniform1f(
      renderer.uniforms
        .haloPass,
      haloPass
        ? 1
        : 0
    );

    gl.uniform1f(
      renderer.uniforms
        .haloExpansion,
      node.type ===
        NODE_TYPES.CARDINAL
        ? 0.075
        : 0.055
    );
  }

  function drawNode(
    renderer,
    node,
    frame,
    haloPass
  ) {
    const mesh =
      renderer.meshes.get(
        node.type
      );

    if (!mesh) {
      return 0;
    }

    bindAttribute(
      renderer,
      mesh.position,
      renderer.attribs.position,
      3
    );

    bindAttribute(
      renderer,
      mesh.normal,
      renderer.attribs.normal,
      3
    );

    bindAttribute(
      renderer,
      mesh.color,
      renderer.attribs.color,
      3
    );

    bindAttribute(
      renderer,
      mesh.sparkleIndex,
      renderer.attribs
        .sparkleIndex,
      1
    );

    applyNodeUniforms(
      renderer,
      node,
      frame,
      haloPass
    );

    renderer.gl.drawArrays(
      renderer.gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    return 1;
  }

  function drawLayer(
    rendererId,
    payload
  ) {
    const renderer =
      state.contexts.get(
        rendererId
      );

    if (
      !renderer ||
      !renderer.available ||
      renderer.contextLost
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

    resizeRenderer(
      renderer,
      payload
    );

    const gl =
      renderer.gl;

    gl.clearColor(
      0,
      0,
      0,
      0
    );

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    gl.useProgram(
      renderer.program
    );

    const nodes =
      Array.isArray(
        payload.nodes
      )
        ? payload.nodes
        : [];

    const resolvedNodes = [];

    for (
      const projectedNode
      of nodes
    ) {
      const node =
        state.registry.get(
          projectedNode.id
        );

      if (
        node &&
        node.visible &&
        node.current.opacity >
          QUALITY
            .visibilityThreshold
      ) {
        resolvedNodes.push(
          node
        );
      }
    }

    let drawCalls =
      0;

    const haloEnabled =
      finiteNumber(
        payload.frame.viewport
          .cssWidth,
        0
      ) >
      QUALITY
        .bloomDisableWidthPx;

    if (haloEnabled) {
      gl.depthMask(false);

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE
      );

      for (
        const node
        of resolvedNodes
      ) {
        drawCalls +=
          drawNode(
            renderer,
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
      of resolvedNodes
    ) {
      drawCalls +=
        drawNode(
          renderer,
          node,
          payload.frame,
          false
        );
    }

    const error =
      gl.getError();

    invariant(
      error ===
        gl.NO_ERROR,
      `SHOWROOM_CRYSTALS_${rendererId.toUpperCase()}_DRAW_FAILED`,
      {
        error
      }
    );

    return {
      drawCalls,

      nodeCount:
        resolvedNodes.length,

      skipped:
        false
    };
  }

  function registerRenderer() {
    const registration =
      state.compositor
        .registerRenderer({
          id:
            RENDERER_ID,

          beginFrame:
            payload => {
              state.compositorFrame =
                payload.frame;

              return true;
            },

          renderRear:
            payload => {
              try {
                const result =
                  drawLayer(
                    CONTEXT_IDS.REAR,
                    payload
                  );

                state.counters
                  .rearDrawCalls =
                  result.drawCalls;

                state.counters
                  .rearFrames +=
                  1;

                return result;
              } catch (error) {
                queueMicrotask(
                  () => {
                    failRuntime(
                      error,
                      "rear-render"
                    );
                  }
                );

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

          renderFront:
            payload => {
              try {
                const result =
                  drawLayer(
                    CONTEXT_IDS.FRONT,
                    payload
                  );

                state.counters
                  .frontDrawCalls =
                  result.drawCalls;

                state.counters
                  .frontFrames +=
                  1;

                return result;
              } catch (error) {
                queueMicrotask(
                  () => {
                    failRuntime(
                      error,
                      "front-render"
                    );
                  }
                );

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

          endFrame:
            () =>
              true,

          dispose:
            () => {
              destroyGpuResources();

              state.ready =
                false;
            }
        });

    invariant(
      registration &&
      typeof registration
        .unregister ===
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
      registration &&
      typeof registration
        .unregister ===
        "function"
    ) {
      try {
        registration.unregister();

        state.counters
          .rendererUnregistrations +=
          1;
      } catch {
        /* Continue bounded disposal. */
      }
    }
  }

  function tryCompleteReadiness(reason) {
    if (
      state.ready ||
      state.failed ||
      state.disposed
    ) {
      return false;
    }

    if (
      !compositorIsAuthoritativelyReady()
    ) {
      if (
        !state.waitingForCompositor
      ) {
        state.waitingForCompositor =
          true;

        publishReceipt(
          "waiting-for-compositor",
          {
            reason,

            compositorReady:
              false,

            runtimeSurfacesActivated:
              state
                .runtimeSurfacesActivated
          }
        );
      }

      return false;
    }

    invariant(
      state.contextDegraded !==
        true,
      "SHOWROOM_CRYSTALS_CONTEXT_DEGRADED"
    );

    invariant(
      state.controller &&
      state.controller.contract ===
        CONTROLLER_CONTRACT,
      "SHOWROOM_CRYSTALS_CONTROLLER_NOT_ACCEPTED"
    );

    invariant(
      validateControllerFrame(
        state.controllerFrame
      ),
      "SHOWROOM_CRYSTALS_CONTROLLER_FRAME_NOT_ACCEPTED"
    );

    invariant(
      state.compositor &&
      state.compositor.contract ===
        COMPOSITOR_CONTRACT,
      "SHOWROOM_CRYSTALS_COMPOSITOR_NOT_ACCEPTED"
    );

    invariant(
      state.runtimeSurfacesActivated ===
        true,
      "SHOWROOM_CRYSTALS_RUNTIME_SURFACES_NOT_ACTIVATED"
    );

    invariant(
      countNodesByType(
        NODE_TYPES.CARDINAL
      ) ===
        4,
      "SHOWROOM_CRYSTALS_READY_CARDINAL_COUNT_INVALID"
    );

    invariant(
      countNodesByType(
        NODE_TYPES.CHILD
      ) ===
        16,
      "SHOWROOM_CRYSTALS_READY_CHILD_COUNT_INVALID"
    );

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

    state.waitingForCompositor =
      false;

    state.ready =
      true;

    state.readyPublished =
      true;

    publishReceipt(
      "ready",
      {
        reason,

        cardinalCount:
          4,

        childCount:
          16,

        nodeCount:
          20,

        rendererRegistered:
          true,

        rearContextReady:
          true,

        frontContextReady:
          true,

        gpuResourcesCreated:
          true,

        initialTargetsComputed:
          true,

        runtimeSurfacesActivated:
          true,

        renderRafOwned:
          false,

        animationStateSchedulerOwned:
          true,

        navigationOwned:
          false,

        classificationOwned:
          false,

        canvasLifecycleOwned:
          false,

        registeredRendererLifecycleOwned:
          true
      }
    );

    dispatch(
      EVENTS.crystalsReady,
      {
        reason,

        cardinalCount:
          4,

        childCount:
          16,

        nodeCount:
          20,

        rendererRegistered:
          true,

        rearContextReady:
          true,

        frontContextReady:
          true,

        runtimeSurfacesActivated:
          true,

        renderRafOwned:
          false,

        animationStateSchedulerOwned:
          true,

        navigationOwned:
          false,

        classificationOwned:
          false,

        canvasLifecycleOwned:
          false,

        registeredRendererLifecycleOwned:
          true
      }
    );

    state.compositor.requestRender(
      "crystals-ready"
    );

    evaluateAnimationDriver();

    return true;
  }

  function activateCompositorRuntime(reason) {
    if (
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    if (
      state.runtimeSurfacesActivated
    ) {
      return tryCompleteReadiness(
        reason
      );
    }

    if (
      !compositorIsAuthoritativelyReady()
    ) {
      if (
        !state.waitingForCompositor
      ) {
        state.waitingForCompositor =
          true;

        publishReceipt(
          "waiting-for-compositor",
          {
            reason,

            compositorReady:
              false,

            runtimeSurfacesActivated:
              false
          }
        );
      }

      return false;
    }

    state.waitingForCompositor =
      false;

    try {
      createGpuResources();

      registerNodes();

      registerRenderer();

      state.runtimeSurfacesActivated =
        true;

      return tryCompleteReadiness(
        reason
      );
    } catch (error) {
      failRuntime(
        error,
        `runtime-activation:${reason}`
      );

      return false;
    }
  }

  function updateFromController(reason) {
    if (
      state.disposed ||
      state.failed ||
      !state.controller
    ) {
      return false;
    }

    try {
      readControllerFrame();

      computeTargets();

      if (
        !state.runtimeSurfacesActivated ||
        !state.ready
      ) {
        activateCompositorRuntime(
          `controller-update:${reason}`
        );

        return true;
      }

      if (
        !state.contextDegraded
      ) {
        state.compositor.requestRender(
          `crystal-state:${reason}`
        );

        evaluateAnimationDriver();
      }

      return true;
    } catch (error) {
      failRuntime(
        error,
        `controller-update:${reason}`
      );

      return false;
    }
  }

  function initializeBindings() {
    const controllerEvents = [
      EVENTS.controllerReady,
      EVENTS.frameChanged,
      EVENTS.stateChanged,
      EVENTS.previewChanged,
      EVENTS.clusterChanged,
      EVENTS.frontChanged,
      EVENTS.enhancementReadinessChanged
    ];

    for (
      const eventName
      of controllerEvents
    ) {
      addListener(
        window,
        eventName,
        () => {
          updateFromController(
            eventName
          );
        }
      );
    }

    addListener(
      window,
      EVENTS.compositorReady,
      () => {
        if (
          state.initialized &&
          !state.failed &&
          !state.disposed
        ) {
          try {
            readControllerFrame();

            activateCompositorRuntime(
              "compositor-ready-event"
            );
          } catch (error) {
            failRuntime(
              error,
              "compositor-ready-event"
            );
          }
        }
      }
    );

    addListener(
      window,
      EVENTS.compositorFailed,
      () => {
        failRuntime(
          new Error(
            "The accepted compositor reported runtime failure."
          ),
          "compositor-failed"
        );
      }
    );

    addListener(
      window,
      EVENTS.compositorDisposed,
      () => {
        dispose(
          "compositor-disposed"
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
          stopAnimationDriver();

          return;
        }

        updateFromController(
          "document-visible"
        );
      }
    );

    addListener(
      window,
      "pagehide",
      event => {
        if (!event.persisted) {
          dispose(
            "page-hide"
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
    const normalized =
      normalize(id);

    const node =
      state.registry.get(
        normalized
      ) ||
      Array.from(
        state.registry.values()
      ).find(
        candidate =>
          candidate.objectId ===
            normalized ||
          candidate.childId ===
            normalized
      );

    if (!node) {
      return null;
    }

    return freezePlain({
      id:
        node.id,

      objectId:
        node.objectId,

      type:
        node.type,

      cardinalId:
        node.cardinalId,

      clusterId:
        node.clusterId,

      childId:
        node.childId,

      behavior:
        node.behavior,

      visualClass:
        node.visualClass,

      emphasis:
        node.emphasis,

      materialFamily:
        node.materialFamily,

      visible:
        node.visible,

      targetVisible:
        node.targetVisible,

      settled:
        node.settled,

      current:
        {
          ...node.current
        },

      target:
        {
          ...node.target
        },

      worldPosition:
        nodeWorldPosition(
          node
        ),

      hitRadius:
        nodeHitRadius(
          node
        )
    });
  }

  function getGeometrySummary() {
    const cardinal =
      state.cpuMeshes.get(
        NODE_TYPES.CARDINAL
      );

    const child =
      state.cpuMeshes.get(
        NODE_TYPES.CHILD
      );

    return freezePlain({
      cardinal:
        cardinal
          ? {
              ...cardinal.summary,

              vertexCount:
                cardinal.vertexCount
            }
          : null,

      child:
        child
          ? {
              ...child.summary,

              vertexCount:
                child.vertexCount
            }
          : null,

      cardinalTargets:
        CARDINAL_TARGETS,

      childLayout:
        CHILD_LAYOUT
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

  function getState() {
    return freezePlain({
      contract:
        CONTRACT,

      owner:
        OWNER,

      controllerContract:
        CONTROLLER_CONTRACT,

      compositorContract:
        COMPOSITOR_CONTRACT,

      initialized:
        state.initialized,

      initializing:
        state.initializing,

      ready:
        state.ready,

      readyPublished:
        state.readyPublished,

      disposed:
        state.disposed,

      failed:
        state.failed,

      failureReason:
        state.failureReason,

      contextDegraded:
        state.contextDegraded,

      runtimeSurfacesActivated:
        state
          .runtimeSurfacesActivated,

      waitingForCompositor:
        state
          .waitingForCompositor,

      presentationMode:
        state.controllerFrame
          ? presentationMode(
              state.controllerFrame
            )
          : PRESENTATION_MODES.BASELINE,

      held:
        Boolean(
          state.controllerFrame &&
          state.controllerFrame.held
        ),

      reducedMotion:
        Boolean(
          state.controllerFrame &&
          state.controllerFrame
            .reducedMotion
        ),

      cardinalCount:
        countNodesByType(
          NODE_TYPES.CARDINAL
        ),

      childCount:
        countNodesByType(
          NODE_TYPES.CHILD
        ),

      nodeCount:
        state.registry.size,

      registeredNodeCount:
        state
          .nodeRegistrations
          .size,

      rendererRegistered:
        Boolean(
          state
            .rendererRegistration
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

      renderRafOwned:
        false,

      animationStateSchedulerOwned:
        true,

      navigationOwned:
        false,

      pointerInterpretationOwned:
        false,

      classificationOwned:
        false,

      cameraOwned:
        false,

      canvasLifecycleOwned:
        false,

      semanticControlCreationOwned:
        false,

      semanticControlPositioningOwned:
        false,

      registeredRendererLifecycleOwned:
        true,

      counters:
        {
          ...state.counters
        }
    });
  }

  function requestRender(
    reason = "crystal-api"
  ) {
    if (
      state.disposed ||
      state.failed ||
      state.contextDegraded ||
      !state.ready ||
      !state
        .runtimeSurfacesActivated
    ) {
      return false;
    }

    return state.compositor
      .requestRender(
        reason
      );
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        controllerContract:
          CONTROLLER_CONTRACT,

        compositorContract:
          COMPOSITOR_CONTRACT,

        getState,

        getNodeState,

        getGeometrySummary,

        getMaterialSummary,

        requestRender,

        dispose() {
          return dispose(
            "public-api-dispose"
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
      delete window
        .SHOWROOM_CRYSTALS;
    } catch {
      /* Best-effort API removal. */
    }
  }

  function teardownOwnedRuntime() {
    stopAnimationDriver();

    removeListeners();

    unregisterNodes();

    unregisterRenderer();

    destroyGpuResources();

    removeApi();

    state.runtimeSurfacesActivated =
      false;
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

    state.ready =
      false;

    state.readyPublished =
      false;

    state.initialized =
      false;

    state.initializing =
      false;

    state.waitingForCompositor =
      false;

    state.failureReason =
      reason;

    state.counters.failures +=
      1;

    teardownOwnedRuntime();

    const errorPayload = {
      name:
        error instanceof
        Error
          ? error.name
          : "Error",

      message:
        error instanceof
        Error
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

        error:
          errorPayload,

        nodesUnregistered:
          true,

        rendererUnregistered:
          true,

        gpuResourcesDisposed:
          true,

        compositorCanvasesRemoved:
          false,

        semanticControlsChanged:
          false
      }
    );

    dispatch(
      EVENTS.crystalsFailed,
      {
        reason,

        error:
          errorPayload
      }
    );
  }

  function rollbackInitialization(error) {
    state.initialized =
      false;

    state.initializing =
      false;

    state.ready =
      false;

    state.readyPublished =
      false;

    failRuntime(
      error,
      "initialization"
    );

    state.registry.clear();

    state.cpuMeshes.clear();
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

    state.runtimeSurfacesActivated =
      false;

    state.waitingForCompositor =
      false;

    teardownOwnedRuntime();

    state.registry.clear();

    state.cpuMeshes.clear();

    state.controller =
      null;

    state.compositor =
      null;

    state.controllerFrame =
      null;

    state.compositorFrame =
      null;

    state.initialized =
      false;

    state.initializing =
      false;

    state.contextDegraded =
      false;

    publishReceipt(
      "disposed",
      {
        reason,

        nodeCount:
          0,

        registeredNodeCount:
          0,

        rendererRegistered:
          false,

        rearContextReady:
          false,

        frontContextReady:
          false,

        compositorCanvasesRemoved:
          false,

        compositorDisposed:
          false,

        controllerDisposed:
          false,

        semanticControlsChanged:
          false,

        fallbackVisibilityChanged:
          false,

        compassLifecycleMutated:
          false,

        frontHostVisibilityMutated:
          false
      }
    );

    dispatch(
      EVENTS.crystalsDisposed,
      {
        reason,

        disposed:
          true,

        compositorCanvasesRemoved:
          false,

        compositorDisposed:
          false,

        controllerDisposed:
          false,

        semanticControlsChanged:
          false,

        fallbackVisibilityChanged:
          false,

        compassLifecycleMutated:
          false,

        frontHostVisibilityMutated:
          false
      }
    );

    return true;
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

      const dom =
        validateDom();

      state.controller =
        requireController();

      state.compositor =
        requireCompositor();

      readControllerFrame();

      buildCpuMeshes();

      buildRegistry(
        dom.cardinals,
        dom.children
      );

      computeTargets();

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

      initializeBindings();

      exposeApi();

      state.initialized =
        true;

      state.initializing =
        false;

      activateCompositorRuntime(
        "startup"
      );
    } catch (error) {
      rollbackInitialization(
        error
      );
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
})();
