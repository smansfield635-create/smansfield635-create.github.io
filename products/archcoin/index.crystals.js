/* /products/archcoin/index.crystals.js
   ARCHCOIN
   Controlled crystals renderer replacement.

   Controller anchor:
   DGB_ARCHCOIN_CONTROLLER
   6.0.0-controller-foundation-renewal

   Source disposition:
   RETAINED_MECHANICAL_CORE + DISCARDED_ARCHITECTURAL_SHELL

   Dependency position:
   1. /products/archcoin/index.controller.js
   2. /assets/compass/upstream-compass.geometry.js
   3. /assets/compass/upstream-compass.renderer.js
   4. /products/archcoin/index.crystals.js
   5. /products/archcoin/index.html
   6. /assets/compass/upstream-compass.css
   7. /products/archcoin/index.css

   Controlling boundaries:
   - The controller owns navigation state, presentation law, selection meaning,
     canonical routes, restoration law, orientation state, reduced motion,
     held state, and gesture commit authority.
   - This file consumes controller state and renders ARCHCOIN crystals.
   - This file does not reconstruct controller state from datasets.
   - This file does not select cardinals or rooms.
   - Existing canonical HTML controls retain direct activation authority.
   - This file may position those existing controls over rendered crystals.
   - Empty scene space may initiate state-appropriate dragging.
   - The shared Compass is an independent sibling and is outside this file.

   Exclusive scene law:
   - CONSTELLATION:
     render the four outer cardinals only.
   - CLUSTER:
     render the active four-room cluster only.
   - HELD:
     render no active navigation crystals.

   Room visual transform:
   CONSTELLATION_ORIENTATION
   * CLUSTER_LOCAL_ORIENTATION
   * ROOM_LOCAL_POSITION

   Important geometric boundary:
   createDiamondStarMesh()
   is page-local ARCHCOIN crystal geometry.

   It does not consume, modify, or reopen:
   /assets/compass/upstream-compass.geometry.js

   Forbidden:
   - COMPASS_DECISION
   - CONSTELLATION_WITH_CLUSTER
   - additive cardinal-plus-cluster rendering
   - generated room proxies
   - projected selection or hit inference
   - mixed cardinal-and-room selection territory
   - direct navigation
   - Compass state, rendering, motion, or route logic
   - panel or viewport policy
   - dataset-based controller reconstruction
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_CRYSTALS_CONTROLLER_V6_EXCLUSIVE_RENDERER_v1",
    version: "1.0.0-controlled-replacement",
    file: "/products/archcoin/index.crystals.js",
    controllerModuleId: "DGB_ARCHCOIN_CONTROLLER",
    controllerModuleVersion:
      "6.0.0-controller-foundation-renewal",
    sourceDisposition:
      "RETAINED_MECHANICAL_CORE_PLUS_DISCARDED_ARCHITECTURAL_SHELL",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const NODE_TYPES = Object.freeze({
    CARDINAL: "cardinal",
    ROOM: "room"
  });

  const SCENE_PROJECTIONS = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER",
    HELD: "HELD"
  });

  const GESTURE_SCOPES = Object.freeze({
    NONE: "",
    CONSTELLATION: "constellation",
    CLUSTER: "cluster"
  });

  const POINTER_TERRITORIES = Object.freeze({
    BLOCKED_CONTROL: "BLOCKED_CONTROL",
    SEMANTIC_NAVIGATION_CONTROL:
      "SEMANTIC_NAVIGATION_CONTROL",
    EMPTY_SCENE: "EMPTY_SCENE",
    OUTSIDE_SCENE: "OUTSIDE_SCENE"
  });

  const GESTURE_TYPES = Object.freeze({
    IDLE: "IDLE",
    POINTER_DOWN: "POINTER_DOWN",
    CONSTELLATION_DRAG: "CONSTELLATION_DRAG",
    CONSTELLATION_SETTLE: "CONSTELLATION_SETTLE",
    CLUSTER_DRAG: "CLUSTER_DRAG",
    CLUSTER_SETTLE: "CLUSTER_SETTLE",
    CANCELLED: "CANCELLED",
    BLOCKED: "BLOCKED"
  });

  const GESTURE = Object.freeze({
    dragDeadZonePx: 6,
    radiansPerViewport: Math.PI * 1.12,
    settleSpeed: 7.4,
    suppressClickMs: 520,
    sampleWindowMs: 140,
    maximumSamples: 18
  });

  const SPHERE = Object.freeze({
    coordinateSystem:
      "RIGHT_HANDED_EUCLIDEAN_XYZ",

    orientationRepresentation:
      "UNIT_QUATERNION",

    constellation: Object.freeze({
      horizontalRadius: 1.46,
      verticalRadius: 1.28,
      depthRadius: 1.14,

      primaryAnchor: Object.freeze([
        0,
        0.78,
        0.625
      ]),

      vectors: Object.freeze({
        north: Object.freeze([0, 1, 0]),
        east: Object.freeze([1, 0, 0]),
        south: Object.freeze([0, -1, 0]),
        west: Object.freeze([-1, 0, 0])
      })
    }),

    cluster: Object.freeze({
      horizontalRadius: 1.04,
      verticalRadius: 0.90,
      depthRadius: 0.84,

      centerRadius: 0.26,

      primaryAnchor: Object.freeze([
        0,
        0.70,
        0.714
      ]),

      latitudeAmplitude: 0.48,
      latitudeFrequency: 1.73
    })
  });

  const ARCHCOIN_WING_TO_COIN = Object.freeze({
    north: "contract",
    east: "receivable",
    south: "payable",
    west: "allocation"
  });

  const PALETTE = Object.freeze({
    north: Object.freeze([
      0.79,
      0.84,
      1.0
    ]),

    east: Object.freeze([
      0.48,
      0.88,
      0.96
    ]),

    south: Object.freeze([
      1.0,
      0.73,
      0.42
    ]),

    west: Object.freeze([
      0.98,
      0.58,
      0.40
    ]),

    roomNorth: Object.freeze([
      0.72,
      0.80,
      1.0
    ]),

    roomEast: Object.freeze([
      0.44,
      0.82,
      0.92
    ]),

    roomSouth: Object.freeze([
      0.98,
      0.68,
      0.38
    ]),

    roomWest: Object.freeze([
      0.94,
      0.52,
      0.34
    ])
  });

  const MATERIALS = Object.freeze({
    CARDINAL_IDLE: Object.freeze({
      specular: 1.12,
      rim: 0.98,
      emissive: 0.14,
      alpha: 0.92,
      sparkle: 0.18,
      halo: 0.62,
      contrast: 1.14
    }),

    CARDINAL_FOCUSED: Object.freeze({
      specular: 1.38,
      rim: 1.18,
      emissive: 0.19,
      alpha: 0.96,
      sparkle: 0.24,
      halo: 0.90,
      contrast: 1.22
    }),

    ROOM_IDLE: Object.freeze({
      specular: 1.02,
      rim: 0.88,
      emissive: 0.12,
      alpha: 0.88,
      sparkle: 0.14,
      halo: 0.44,
      contrast: 1.08
    }),

    ROOM_PRIMARY: Object.freeze({
      specular: 1.18,
      rim: 1.02,
      emissive: 0.16,
      alpha: 0.92,
      sparkle: 0.18,
      halo: 0.62,
      contrast: 1.14
    }),

    ROOM_SELECTED: Object.freeze({
      specular: 1.26,
      rim: 1.08,
      emissive: 0.18,
      alpha: 0.94,
      sparkle: 0.22,
      halo: 0.72,
      contrast: 1.18
    })
  });

  const QUALITY = Object.freeze({
    normalDevicePixelRatioCap: 2,
    lowPowerDevicePixelRatioCap: 1.5,
    lowPowerHardwareConcurrencyThreshold: 4,
    mobileAspectThreshold: 0.82,
    bloomDisableWidthPx: 420,

    cardinalSegments: 8,
    roomSegments: 6,

    cardinalScale: 0.96,
    focusedCardinalScale: 1.28,

    roomScale: 0.80,
    primaryRoomScale: 1.02,
    selectedRoomScale: 1.08,

    maxYaw: 0.20,
    maxPitch: 0.13,

    maximumDeltaSeconds: 0.05,
    normalEpsilon: 1e-7
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    contractVersion: CONTRACT.version,

    status: "pending",

    controllerModuleId: "",
    controllerModuleVersion: "",

    rendererInitialized: false,

    sceneProjection:
      SCENE_PROJECTIONS.HELD,

    cardinalCount: 0,
    roomCount: 0,
    canonicalSemanticRoomCount: 0,

    activeClusterWing: "",
    primaryWing: "north",
    primaryRoom: "",

    gestureScope:
      GESTURE_SCOPES.NONE,

    gestureActive: false,

    lastPointerTerritory: "",
    lastGestureType:
      GESTURE_TYPES.IDLE,

    reducedMotion: false,

    outerCardinalsRendered: false,
    activeRoomClusterRendered: false,
    additiveCoRenderingAuthorized: false,

    generatedRoomProxyCount: 0,
    projectedSelectionEnabled: false,

    roomVisualOrientationLaw:
      "CONSTELLATION_ORIENTATION * CLUSTER_LOCAL_ORIENTATION",

    compassLogicOwned: false,

    glError: "not-checked",
    drawCallsLastFrame: 0,

    visualPassClaimed: false
  };

  const state = {
    root: null,
    scene: null,
    mount: null,
    semanticLayer: null,
    receiptOutput: null,

    controller: null,

    canvas: null,
    gl: null,
    program: null,
    attribs: null,
    uniforms: null,

    meshes: new Map(),
    registry: new Map(),

    width: 1,
    height: 1,
    cssWidth: 1,
    cssHeight: 1,
    pixelRatio: 1,

    frame: null,

    sceneProjection:
      SCENE_PROJECTIONS.HELD,

    constellationQuaternion: [
      0,
      0,
      0,
      1
    ],

    constellationTargetQuaternion: [
      0,
      0,
      0,
      1
    ],

    visualPrimaryWing: "north",
    settledPrimaryWing: "north",

    clusterQuaternions: new Map(),
    clusterTargetQuaternions:
      new Map(),

    visualPrimaryRooms: new Map(),

    view: null,
    projection: null,

    camera: {
      eye: [
        0,
        0.78,
        6.45
      ],

      target: [
        0,
        0,
        0
      ],

      nextEye: [
        0,
        0.78,
        6.45
      ],

      nextTarget: [
        0,
        0,
        0
      ]
    },

    time: 0,
    lastTime: 0,
    raf: 0,

    running: false,
    disposed: false,
    reducedMotion: false,

    pointer: null,
    suppressClickUntil: 0,

    listenersBound: false,
    contextListenersBound: false
  };

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uViewNormalMatrix;
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vViewNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    void main() {
      vec3 position = aPosition;

      if (uHaloPass > 0.5) {
        position +=
          normalize(aNormal) *
          uHaloExpansion;
      }

      vec4 worldPosition =
        uModel *
        vec4(position, 1.0);

      vec4 viewPosition =
        uView *
        worldPosition;

      vViewNormal =
        normalize(
          uViewNormalMatrix *
          aNormal
        );

      vColor = aColor;
      vViewPosition = viewPosition.xyz;
      vWorldPosition = worldPosition.xyz;
      vHaloPass = uHaloPass;

      gl_Position =
        uProjection *
        viewPosition;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vViewNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    uniform float uTime;
    uniform float uProminence;
    uniform float uSpecular;
    uniform float uRim;
    uniform float uEmissive;
    uniform float uAlpha;
    uniform float uSparkle;
    uniform float uTwinkle;
    uniform float uContrast;
    uniform float uHaloStrength;
    uniform float uSaturation;

    uniform vec3 uKeyLightView;
    uniform vec3 uFillLightView;
    uniform vec3 uRimLightView;
    uniform vec3 uAmbientColor;

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
        normalize(vViewNormal);

      vec3 viewDirection =
        normalize(-vViewPosition);

      vec3 sourceBase =
        max(
          vColor,
          vec3(0.02)
        );

      float luminance =
        dot(
          sourceBase,
          vec3(
            0.2126,
            0.7152,
            0.0722
          )
        );

      vec3 base =
        mix(
          vec3(luminance),
          sourceBase,
          clamp(
            uSaturation,
            0.0,
            1.0
          )
        );

      float facingToCamera =
        dot(
          normal,
          viewDirection
        );

      float rearSuppression =
        smoothstep(
          -0.18,
          0.34,
          facingToCamera
        );

      float sideRim =
        pow(
          1.0 -
          abs(facingToCamera),
          2.4
        );

      vec3 keyDirection =
        normalize(-uKeyLightView);

      vec3 fillDirection =
        normalize(-uFillLightView);

      vec3 rimDirection =
        normalize(-uRimLightView);

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

      float fresnel =
        pow(
          1.0 -
          max(
            facingToCamera,
            0.0
          ),
          2.05
        );

      vec3 halfDirection =
        normalize(
          keyDirection +
          viewDirection
        );

      float facing =
        pow(
          max(
            dot(
              normal,
              halfDirection
            ),
            0.0
          ),
          28.0
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
            18.0
          )
        );

      float sparklePhase =
        sin(
          uTime *
          1.85 +
          sparkleSeed *
          6.28318
        );

      float sparkle =
        smoothstep(
          0.74,
          1.0,
          facing +
          facetBand *
          0.34
        ) *
        (
          0.76 +
          sparklePhase *
          0.24
        ) *
        uSparkle *
        rearSuppression;

      float twinkle =
        1.0 +
        sin(
          uTime *
          0.70 +
          sparkleSeed *
          6.28318
        ) *
        0.045 *
        uTwinkle;

      if (vHaloPass > 0.5) {
        vec3 haloColor =
          base *
          (
            0.70 +
            fresnel *
            1.18 +
            sideRim *
            0.42 +
            rear *
            0.24
          ) *
          uHaloStrength *
          twinkle;

        float haloAlpha =
          clamp(
            (
              0.040 +
              fresnel *
              0.18 +
              sideRim *
              0.08
            ) *
            uProminence *
            uHaloStrength,
            0.0,
            0.34
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
        0.82 +
        fill *
        0.30 +
        rear *
        0.14;

      diffuse =
        mix(
          diffuse,
          pow(
            diffuse,
            0.68
          ),
          clamp(
            uContrast -
            1.0,
            0.0,
            0.7
          )
        );

      vec3 lit =
        base *
        diffuse *
        twinkle;

      vec3 specular =
        vec3(
          1.0,
          0.96,
          0.82
        ) *
        facing *
        uSpecular *
        rearSuppression;

      vec3 rim =
        base *
        (
          fresnel *
          0.72 +
          sideRim *
          0.38
        ) *
        uRim;

      vec3 coolRim =
        vec3(
          0.68,
          0.86,
          1.0
        ) *
        (
          fresnel *
          0.22 +
          sideRim *
          0.14
        ) *
        uRim;

      vec3 emissive =
        base *
        uEmissive;

      vec3 spark =
        vec3(
          1.0,
          0.96,
          0.78
        ) *
        sparkle;

      float rearDim =
        mix(
          0.62,
          1.0,
          rearSuppression
        );

      vec3 color =
        (
          (
            lit +
            specular +
            rim +
            coolRim +
            emissive +
            spark
          ) *
          uProminence +
          uAmbientColor *
          base *
          0.20
        ) *
        rearDim;

      float alpha =
        clamp(
          uAlpha *
          (
            0.70 +
            uProminence *
            0.30 +
            fresnel *
            0.08
          ),
          0.12,
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

    error.code = code;
    error.details = details;

    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(
      selector
    );
  }

  function qsa(
    selector,
    root = document
  ) {
    return Array.from(
      root.querySelectorAll(
        selector
      )
    );
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.max(
      minimum,
      Math.min(
        maximum,
        value
      )
    );
  }

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function normalizeWing(value) {
    const wing =
      String(value || "")
        .trim()
        .toLowerCase();

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeRoomId(value) {
    return String(
      value || ""
    ).trim();
  }

  function emitReceipt(extra = {}) {
    Object.assign(
      RECEIPT,
      {
        controllerModuleId:
          state.controller
            ? state.controller.moduleId
            : "",

        controllerModuleVersion:
          state.controller
            ? state.controller.moduleVersion
            : "",

        sceneProjection:
          state.sceneProjection,

        activeClusterWing:
          state.frame
            ? normalizeWing(
                state.frame
                  .activeClusterWing
              )
            : "",

        primaryWing:
          state.visualPrimaryWing ||
          state.settledPrimaryWing ||
          "north",

        primaryRoom:
          state.frame &&
          state.frame
            .activeClusterWing
            ? state.visualPrimaryRooms.get(
                state.frame
                  .activeClusterWing
              ) ||
              ""
            : "",

        gestureScope:
          state.pointer
            ? state.pointer.gestureScope
            : GESTURE_SCOPES.NONE,

        gestureActive:
          Boolean(
            state.pointer &&
            state.pointer.dragging
          ),

        reducedMotion:
          state.reducedMotion,

        outerCardinalsRendered:
          state.sceneProjection ===
          SCENE_PROJECTIONS
            .CONSTELLATION,

        activeRoomClusterRendered:
          state.sceneProjection ===
          SCENE_PROJECTIONS
            .CLUSTER,

        additiveCoRenderingAuthorized:
          false,

        generatedRoomProxyCount:
          0,

        projectedSelectionEnabled:
          false,

        compassLogicOwned:
          false,

        visualPassClaimed:
          false
      },
      extra
    );

    const serialized =
      JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset
        .archcoinCrystalsReceipt =
        serialized;

      state.root.dataset
        .archcoinCrystalsStatus =
        RECEIPT.status;

      state.root.dataset
        .archcoinSceneProjection =
        state.sceneProjection;

      state.root.dataset
        .archcoinCrystalsOuterCardinalsRendered =
        RECEIPT.outerCardinalsRendered
          ? "true"
          : "false";

      state.root.dataset
        .archcoinCrystalsActiveRoomClusterRendered =
        RECEIPT.activeRoomClusterRendered
          ? "true"
          : "false";

      state.root.dataset
        .archcoinCrystalsAdditiveCoRenderingAuthorized =
        "false";

      state.root.dataset
        .archcoinCrystalsGeneratedRoomProxyCount =
        "0";

      state.root.dataset
        .archcoinCrystalsProjectedSelectionEnabled =
        "false";

      state.root.dataset
        .visualPassClaimed =
        "false";
    }

    if (state.canvas) {
      state.canvas.dataset
        .archcoinCrystalsReceipt =
        serialized;

      state.canvas.dataset
        .visualPassClaimed =
        "false";
    }

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

    globalThis
      .DGB_ARCHCOIN_CRYSTALS_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });
  }

  function emitFailure(
    reason,
    details = null
  ) {
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );

      state.raf = 0;
    }

    emitReceipt({
      status: "held",
      rendererInitialized: false,
      glError: String(
        reason ||
        "UNKNOWN_ERROR"
      )
    });

    globalThis.dispatchEvent(
      new CustomEvent(
        "ARCHCOIN_CRYSTALS_RENDER_FAILURE",
        {
          detail: Object.freeze({
            reason: String(
              reason ||
              "UNKNOWN_ERROR"
            ),
            details
          })
        }
      )
    );
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
    fallback = [0, 0, 1]
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

  function dot(a, b) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function cross(a, b) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function subtract(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function quaternionNormalize(
    value,
    fallback = [0, 0, 0, 1]
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(
        source[0],
        fallback[0]
      ),

      finiteNumber(
        source[1],
        fallback[1]
      ),

      finiteNumber(
        source[2],
        fallback[2]
      ),

      finiteNumber(
        source[3],
        fallback[3]
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
      length <= 1e-12
    ) {
      return fallback.slice();
    }

    return quaternion.map(
      component =>
        component / length
    );
  }

  function quaternionMultiplyRaw(
    a,
    b
  ) {
    return [
      a[3] * b[0] +
        a[0] * b[3] +
        a[1] * b[2] -
        a[2] * b[1],

      a[3] * b[1] -
        a[0] * b[2] +
        a[1] * b[3] +
        a[2] * b[0],

      a[3] * b[2] +
        a[0] * b[1] -
        a[1] * b[0] +
        a[2] * b[3],

      a[3] * b[3] -
        a[0] * b[0] -
        a[1] * b[1] -
        a[2] * b[2]
    ];
  }

  function quaternionMultiply(
    a,
    b
  ) {
    return quaternionNormalize(
      quaternionMultiplyRaw(
        quaternionNormalize(a),
        quaternionNormalize(b)
      )
    );
  }

  function quaternionConjugate(
    quaternion
  ) {
    return [
      -quaternion[0],
      -quaternion[1],
      -quaternion[2],
      quaternion[3]
    ];
  }

  function quaternionFromAxisAngle(
    axis,
    angle
  ) {
    const normalizedAxis =
      normalizeVector(axis);

    const half =
      angle * 0.5;

    const sine =
      Math.sin(half);

    return quaternionNormalize([
      normalizedAxis[0] *
        sine,

      normalizedAxis[1] *
        sine,

      normalizedAxis[2] *
        sine,

      Math.cos(half)
    ]);
  }

  function quaternionRotateVector(
    quaternion,
    vector
  ) {
    const normalized =
      quaternionNormalize(
        quaternion
      );

    const pure = [
      vector[0],
      vector[1],
      vector[2],
      0
    ];

    const rotated =
      quaternionMultiplyRaw(
        quaternionMultiplyRaw(
          normalized,
          pure
        ),
        quaternionConjugate(
          normalized
        )
      );

    return [
      rotated[0],
      rotated[1],
      rotated[2]
    ];
  }

  function quaternionFromUnitVectors(
    fromVector,
    toVector
  ) {
    const from =
      normalizeVector(
        fromVector
      );

    const to =
      normalizeVector(
        toVector
      );

    const cosine =
      clamp(
        dot(from, to),
        -1,
        1
      );

    if (cosine > 0.999999) {
      return [
        0,
        0,
        0,
        1
      ];
    }

    if (cosine < -0.999999) {
      let axis =
        cross(
          [1, 0, 0],
          from
        );

      if (
        vectorLength(axis) <
        1e-6
      ) {
        axis =
          cross(
            [0, 1, 0],
            from
          );
      }

      return quaternionFromAxisAngle(
        normalizeVector(axis),
        Math.PI
      );
    }

    const axis =
      cross(
        from,
        to
      );

    return quaternionNormalize([
      axis[0],
      axis[1],
      axis[2],
      1 + cosine
    ]);
  }

  function quaternionSlerp(
    fromValue,
    toValue,
    amount
  ) {
    const from =
      quaternionNormalize(
        fromValue
      );

    let to =
      quaternionNormalize(
        toValue
      );

    let cosine =
      from[0] * to[0] +
      from[1] * to[1] +
      from[2] * to[2] +
      from[3] * to[3];

    if (cosine < 0) {
      to = [
        -to[0],
        -to[1],
        -to[2],
        -to[3]
      ];

      cosine = -cosine;
    }

    const interpolation =
      clamp(
        amount,
        0,
        1
      );

    if (cosine > 0.9995) {
      return quaternionNormalize([
        from[0] +
          (
            to[0] -
            from[0]
          ) *
          interpolation,

        from[1] +
          (
            to[1] -
            from[1]
          ) *
          interpolation,

        from[2] +
          (
            to[2] -
            from[2]
          ) *
          interpolation,

        from[3] +
          (
            to[3] -
            from[3]
          ) *
          interpolation
      ]);
    }

    const theta =
      Math.acos(
        clamp(
          cosine,
          -1,
          1
        )
      );

    const sineTheta =
      Math.sin(theta);

    if (
      Math.abs(
        sineTheta
      ) <= 1e-12
    ) {
      return from;
    }

    const weightFrom =
      Math.sin(
        (
          1 -
          interpolation
        ) *
        theta
      ) /
      sineTheta;

    const weightTo =
      Math.sin(
        interpolation *
        theta
      ) /
      sineTheta;

    return quaternionNormalize([
      from[0] *
        weightFrom +
      to[0] *
        weightTo,

      from[1] *
        weightFrom +
      to[1] *
        weightTo,

      from[2] *
        weightFrom +
      to[2] *
        weightTo,

      from[3] *
        weightFrom +
      to[3] *
        weightTo
    ]);
  }

  function orientationQuaternion(
    orientation,
    fallback
  ) {
    if (
      orientation &&
      (
        Array.isArray(
          orientation.quaternion
        ) ||
        ArrayBuffer.isView(
          orientation.quaternion
        )
      )
    ) {
      return quaternionNormalize(
        orientation.quaternion,
        fallback
      );
    }

    return quaternionNormalize(
      fallback
    );
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
          output[
            column * 4 +
            row
          ] +=
            a[
              index * 4 +
              row
            ] *
            b[
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

  function scale4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[0] = x;
    matrix[5] = y;
    matrix[10] = z;

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

  function perspective4(
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const factor =
      1 /
      Math.tan(
        fieldOfView / 2
      );

    const range =
      1 /
      (near - far);

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
      (far + near) *
        range,
      -1,

      0,
      0,
      2 *
        far *
        near *
        range,
      0
    ];
  }

  function lookAt4(
    eye,
    center,
    up
  ) {
    const z =
      normalizeVector(
        subtract(
          eye,
          center
        )
      );

    const x =
      normalizeVector(
        cross(
          up,
          z
        ),
        [1, 0, 0]
      );

    const y =
      cross(
        z,
        x
      );

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot(x, eye),
      -dot(y, eye),
      -dot(z, eye),
      1
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
      ) <= QUALITY.normalEpsilon
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
      ) *
      determinant,

      (
        a12 * a01 -
        a02 * a11
      ) *
      determinant,

      b11 * determinant,

      (
        a22 * a00 -
        a02 * a20
      ) *
      determinant,

      (
        -a12 * a00 +
        a02 * a10
      ) *
      determinant,

      b21 * determinant,

      (
        -a21 * a00 +
        a01 * a20
      ) *
      determinant,

      (
        a11 * a00 -
        a01 * a10
      ) *
      determinant
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

  function transformPoint4(
    matrix,
    point
  ) {
    return [
      matrix[0] * point[0] +
        matrix[4] * point[1] +
        matrix[8] * point[2] +
        matrix[12] * point[3],

      matrix[1] * point[0] +
        matrix[5] * point[1] +
        matrix[9] * point[2] +
        matrix[13] * point[3],

      matrix[2] * point[0] +
        matrix[6] * point[1] +
        matrix[10] * point[2] +
        matrix[14] * point[3],

      matrix[3] * point[0] +
        matrix[7] * point[1] +
        matrix[11] * point[2] +
        matrix[15] * point[3]
    ];
  }

  function createCanvas() {
    const existing =
      qs(
        "canvas[data-archcoin-crystals-canvas]",
        state.mount
      );

    if (existing) {
      return existing;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.dataset
      .archcoinCrystalsCanvas =
      "true";

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "role",
      "presentation"
    );

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

    state.mount.prepend(
      canvas
    );

    return canvas;
  }

  function getGL(canvas) {
    return canvas.getContext(
      "webgl",
      {
        antialias: true,
        alpha: true,
        depth: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false
      }
    );
  }

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

    invariant(
      shader,
      "ARCHCOIN_SHADER_CREATION_FAILED"
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
      const info =
        gl.getShaderInfoLog(
          shader
        ) ||
        "UNKNOWN_SHADER_ERROR";

      gl.deleteShader(
        shader
      );

      throw new Error(info);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragment =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );

    const program =
      gl.createProgram();

    invariant(
      program,
      "ARCHCOIN_PROGRAM_CREATION_FAILED"
    );

    gl.attachShader(
      program,
      vertex
    );

    gl.attachShader(
      program,
      fragment
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const info =
        gl.getProgramInfoLog(
          program
        ) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(
        program
      );

      throw new Error(info);
    }

    return program;
  }

  function createBuffer(
    gl,
    target,
    data
  ) {
    const buffer =
      gl.createBuffer();

    invariant(
      buffer,
      "ARCHCOIN_BUFFER_CREATION_FAILED"
    );

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

  function bindAttrib(
    gl,
    buffer,
    location,
    size
  ) {
    invariant(
      location >= 0,
      "ARCHCOIN_ATTRIBUTE_LOCATION_INVALID",
      {
        location
      }
    );

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

  function createDiamondStarMesh(
    options = {}
  ) {
    const points =
      options.points || 8;

    const radius =
      options.radius || 0.62;

    const inner =
      options.inner ||
      radius * 0.46;

    const depth =
      options.depth || 0.42;

    const crown =
      options.crown || 0.22;

    const color =
      options.color ||
      PALETTE.north;

    const warmth =
      options.warmth || 0;

    const vertices = [];
    const faces = [];

    function add(point) {
      vertices.push(point);

      return (
        vertices.length - 1
      );
    }

    function face(a, b, c) {
      faces.push([
        a,
        b,
        c
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

    const outer = [];
    const innerRing = [];
    const frontBevel = [];
    const rearBevel = [];

    for (
      let index = 0;
      index < points * 2;
      index += 1
    ) {
      const isPoint =
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
        isPoint
          ? radius
          : inner;

      const yScale = 0.78;

      const ridge =
        isPoint
          ? 0.05
          : -0.02;

      outer.push(
        add([
          Math.cos(angle) *
            activeRadius,

          Math.sin(angle) *
            activeRadius *
            yScale,

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
            yScale *
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
            yScale *
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
            yScale *
            0.68,

          -depth * 0.48
        ])
      );
    }

    const count =
      outer.length;

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const next =
        (
          index + 1
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
        outer[index],
        outer[next]
      );

      face(
        frontBevel[index],
        outer[next],
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
        outer[next],
        outer[index]
      );

      face(
        rearBevel[index],
        rearBevel[next],
        outer[next]
      );
    }

    const positions = [];
    const normals = [];
    const colors = [];

    faces.forEach(
      (
        triangle,
        faceIndex
      ) => {
        const a =
          vertices[
            triangle[0]
          ];

        const b =
          vertices[
            triangle[1]
          ];

        const c =
          vertices[
            triangle[2]
          ];

        const normal =
          normalizeVector(
            cross(
              subtract(
                b,
                a
              ),
              subtract(
                c,
                a
              )
            )
          );

        const lift =
          0.84 +
          (
            faceIndex % 7
          ) *
          0.034;

        const sparkleLift =
          faceIndex % 5 === 0
            ? 0.13
            : 0;

        [
          a,
          b,
          c
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
              Math.min(
                color[0] *
                  lift +
                warmth *
                  0.06 +
                sparkleLift,
                1
              ),

              Math.min(
                color[1] *
                  lift +
                warmth *
                  0.04 +
                sparkleLift,
                1
              ),

              Math.min(
                color[2] *
                  lift +
                warmth *
                  0.02 +
                sparkleLift,
                1
              )
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

      vertexCount:
        positions.length / 3
    });
  }

  function buildGpuMesh(
    gl,
    mesh
  ) {
    return Object.freeze({
      vertexCount:
        mesh.vertexCount,

      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.positions
        ),

      normal:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.normals
        ),

      color:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.colors
        )
    });
  }

  function roomColorForWing(wing) {
    if (wing === "north") {
      return PALETTE.roomNorth;
    }

    if (wing === "east") {
      return PALETTE.roomEast;
    }

    if (wing === "south") {
      return PALETTE.roomSouth;
    }

    return PALETTE.roomWest;
  }

  function buildMeshes(gl) {
    const meshes =
      new Map();

    WINGS.forEach(
      wing => {
        const warm =
          wing === "south" ||
          wing === "west";

        meshes.set(
          `cardinal-${wing}`,
          buildGpuMesh(
            gl,
            createDiamondStarMesh({
              points:
                QUALITY.cardinalSegments,

              radius: 0.72,
              inner: 0.30,
              depth: 0.42,
              crown: 0.20,

              color:
                PALETTE[wing],

              warmth:
                warm
                  ? 0.10
                  : 0.02
            })
          )
        );

        meshes.set(
          `room-${wing}`,
          buildGpuMesh(
            gl,
            createDiamondStarMesh({
              points:
                QUALITY.roomSegments,

              radius: 0.42,
              inner: 0.20,
              depth: 0.25,
              crown: 0.10,

              color:
                roomColorForWing(
                  wing
                ),

              warmth:
                warm
                  ? 0.08
                  : 0.02
            })
          )
        );
      }
    );

    return meshes;
  }

  function clusterBaseVector(
    index,
    count
  ) {
    const safeCount =
      Math.max(
        1,
        count
      );

    const longitude =
      (
        Math.PI *
        2 *
        index
      ) /
      safeCount -
      Math.PI / 2;

    const latitude =
      Math.sin(
        (
          index + 0.5
        ) *
        SPHERE.cluster
          .latitudeFrequency
      ) *
      SPHERE.cluster
        .latitudeAmplitude;

    const cosineLatitude =
      Math.cos(latitude);

    return normalizeVector([
      Math.cos(longitude) *
        cosineLatitude,

      Math.sin(latitude),

      Math.sin(longitude) *
        cosineLatitude
    ]);
  }

  function makeNode({
    id,
    type,
    wing,
    label,
    short,
    semanticElement,
    roomIndex = 0,
    roomCount = 0,
    meshKey,
    material,
    phase = 0
  }) {
    return {
      id,
      type,
      wing,
      label,
      short,
      semanticElement,

      roomIndex,
      roomCount,
      meshKey,

      baseMaterial:
        material,

      material,
      phase,

      visible: false,

      sphereVector:
        type ===
        NODE_TYPES.CARDINAL
          ? SPHERE
              .constellation
              .vectors[wing]
              .slice()
          : clusterBaseVector(
              roomIndex,
              roomCount
            ),

      depthScore: 0,
      primaryScore: 0,

      transform: {
        x: 0,
        y: 0,
        z: 0,

        rx: 0,
        ry: 0,
        rz: 0,

        sx: 1,
        sy: 1,
        sz: 1,

        prominence: 0,
        halo: 0,

        rotationSpeed: 0.12,
        float: 0
      },

      target: {
        x: 0,
        y: 0,
        z: -1,

        sx: 0.5,
        sy: 0.5,
        sz: 0.5,

        prominence: 0,
        halo: 0,

        rotationSpeed: 0.06,
        float: 0
      }
    };
  }

  function canonicalRoomElements() {
    return qsa(
      "[data-archcoin-room]",
      state.root
    );
  }

  function buildRegistry() {
    const registry =
      new Map();

    const roomDeclarations =
      canonicalRoomElements();

    invariant(
      roomDeclarations.length === 16,
      "ARCHCOIN_CANONICAL_ROOM_DECLARATION_COUNT_INVALID",
      {
        expected: 16,
        actual:
          roomDeclarations.length
      }
    );

    WINGS.forEach(
      (
        wing,
        wingIndex
      ) => {
        const semantic =
          qs(
            `[data-archcoin-coin][data-wing="${wing}"]`,
            state.root
          );

        invariant(
          semantic,
          `ARCHCOIN_COIN_SEMANTIC_NOT_FOUND:${wing}`
        );

        registry.set(
          wing,
          makeNode({
            id: wing,

            type:
              NODE_TYPES.CARDINAL,

            wing,

            label:
              semantic.dataset
                .coinLabel ||
              semantic.dataset
                .label ||
              ARCHCOIN_WING_TO_COIN[
                wing
              ],

            short:
              (
                semantic.querySelector(
                  "span:last-child"
                ) ||
                {}
              ).textContent ||
              "",

            semanticElement:
              semantic,

            meshKey:
              `cardinal-${wing}`,

            material:
              "CARDINAL_IDLE",

            phase:
              wingIndex *
                1.37 +
              0.22
          })
        );

        const roomElements =
          roomDeclarations.filter(
            element =>
              normalizeWing(
                element.dataset.wing
              ) === wing
          );

        invariant(
          roomElements.length === 4,
          `ARCHCOIN_WING_ROOM_COUNT_INVALID:${wing}`,
          {
            expected: 4,
            actual:
              roomElements.length
          }
        );

        roomElements.forEach(
          (
            element,
            roomIndex
          ) => {
            const id =
              normalizeRoomId(
                element.dataset.roomId
              );

            invariant(
              id,
              `ARCHCOIN_ROOM_ID_MISSING:${wing}:${roomIndex}`
            );

            invariant(
              !registry.has(id),
              `ARCHCOIN_DUPLICATE_ROOM_ID:${id}`
            );

            registry.set(
              id,
              makeNode({
                id,

                type:
                  NODE_TYPES.ROOM,

                wing,

                label:
                  element.dataset
                    .label ||
                  element.textContent
                    .trim(),

                short:
                  element.dataset
                    .localFunction ||
                  element.dataset
                    .roomFunction ||
                  "",

                semanticElement:
                  element,

                roomIndex,

                roomCount:
                  roomElements.length,

                meshKey:
                  `room-${wing}`,

                material:
                  "ROOM_IDLE",

                phase:
                  wingIndex *
                    1.13 +
                  roomIndex *
                    0.47
              })
            );
          }
        );
      }
    );

    const cardinalCount =
      Array.from(
        registry.values()
      ).filter(
        node =>
          node.type ===
          NODE_TYPES.CARDINAL
      ).length;

    const roomCount =
      Array.from(
        registry.values()
      ).filter(
        node =>
          node.type ===
          NODE_TYPES.ROOM
      ).length;

    invariant(
      cardinalCount === 4,
      "ARCHCOIN_CARDINAL_COUNT_INVALID",
      {
        cardinalCount
      }
    );

    invariant(
      roomCount === 16,
      "ARCHCOIN_ROOM_COUNT_INVALID",
      {
        roomCount
      }
    );

    emitReceipt({
      cardinalCount,
      roomCount,

      canonicalSemanticRoomCount:
        roomDeclarations.length
    });

    return registry;
  }

  function requireController() {
    const controller =
      globalThis
        .DGB_ARCHCOIN_CONTROLLER;

    invariant(
      controller,
      "ARCHCOIN_CONTROLLER_REQUIRED"
    );

    invariant(
      controller.moduleId ===
        CONTRACT.controllerModuleId,
      "ARCHCOIN_CONTROLLER_MODULE_ID_INVALID",
      {
        expected:
          CONTRACT.controllerModuleId,

        actual:
          controller.moduleId
      }
    );

    invariant(
      controller.moduleVersion ===
        CONTRACT.controllerModuleVersion,
      "ARCHCOIN_CONTROLLER_MODULE_VERSION_INVALID",
      {
        expected:
          CONTRACT.controllerModuleVersion,

        actual:
          controller.moduleVersion
      }
    );

    invariant(
      typeof controller
        .getFrameState ===
        "function",
      "ARCHCOIN_CONTROLLER_FRAME_SURFACE_REQUIRED"
    );

    [
      "beginOrbitGesture",
      "requestOrbitPreview",
      "requestOrbitCommit",
      "requestOrbitCancel",
      "beginClusterGesture",
      "requestClusterPreview",
      "requestClusterCommit",
      "requestClusterCancel"
    ].forEach(
      surface => {
        invariant(
          typeof controller[
            surface
          ] === "function",
          `ARCHCOIN_CONTROLLER_SURFACE_REQUIRED:${surface}`
        );
      }
    );

    return controller;
  }

  function getControllerFrame() {
    invariant(
      state.controller &&
      typeof state.controller
        .getFrameState ===
        "function",
      "ARCHCOIN_CONTROLLER_FRAME_SURFACE_UNAVAILABLE"
    );

    const frame =
      state.controller
        .getFrameState();

    invariant(
      frame &&
      typeof frame ===
        "object",
      "ARCHCOIN_CONTROLLER_FRAME_INVALID"
    );

    invariant(
      frame.presentation &&
      typeof frame.presentation ===
        "object",
      "ARCHCOIN_CONTROLLER_PRESENTATION_CONTRACT_REQUIRED"
    );

    return frame;
  }

  function constellationQuaternionFromFrame(
    frame
  ) {
    return orientationQuaternion(
      frame &&
      frame.orbitOrientation,
      state
        .constellationTargetQuaternion
    );
  }

  function clusterQuaternionFromFrame(
    frame,
    wing
  ) {
    const fallback =
      state
        .clusterTargetQuaternions
        .get(wing) ||
      [0, 0, 0, 1];

    if (
      frame &&
      frame.cluster &&
      frame.cluster.wing === wing &&
      frame.cluster.orientation
    ) {
      return orientationQuaternion(
        frame.cluster.orientation,
        fallback
      );
    }

    return fallback.slice();
  }

  function constellationAnchorVector() {
    return normalizeVector(
      SPHERE.constellation
        .primaryAnchor
    );
  }

  function clusterAnchorVector() {
    return normalizeVector(
      SPHERE.cluster
        .primaryAnchor
    );
  }

  function rotatedCardinalUnitVector(
    wing,
    quaternion =
      state
        .constellationQuaternion
  ) {
    const base =
      SPHERE.constellation
        .vectors[wing] ||
      SPHERE.constellation
        .vectors.north;

    return normalizeVector(
      quaternionRotateVector(
        quaternion,
        base
      )
    );
  }

  function effectiveClusterQuaternion(
    clusterLocalQuaternion
  ) {
    return quaternionMultiply(
      state
        .constellationQuaternion,
      clusterLocalQuaternion
    );
  }

  function rotatedRoomUnitVector(
    node,
    clusterLocalQuaternion
  ) {
    return normalizeVector(
      quaternionRotateVector(
        effectiveClusterQuaternion(
          clusterLocalQuaternion
        ),
        node.sphereVector
      )
    );
  }

  function rotatedRoomLocalUnitVector(
    node,
    clusterLocalQuaternion
  ) {
    return normalizeVector(
      quaternionRotateVector(
        clusterLocalQuaternion,
        node.sphereVector
      )
    );
  }

  function nearestPrimaryWing(
    quaternion =
      state
        .constellationQuaternion
  ) {
    const anchor =
      constellationAnchorVector();

    let bestWing =
      "north";

    let bestScore =
      -Infinity;

    WINGS.forEach(
      wing => {
        const vector =
          rotatedCardinalUnitVector(
            wing,
            quaternion
          );

        const score =
          dot(
            vector,
            anchor
          );

        if (score > bestScore) {
          bestScore = score;
          bestWing = wing;
        }
      }
    );

    return bestWing;
  }

  function activeRoomNodes(wing) {
    return Array.from(
      state.registry.values()
    ).filter(
      node =>
        node.type ===
          NODE_TYPES.ROOM &&
        node.wing === wing
    );
  }

  function nearestPrimaryRoom(
    wing,
    clusterLocalQuaternion
  ) {
    const anchor =
      clusterAnchorVector();

    const rooms =
      activeRoomNodes(wing);

    let bestRoom =
      rooms[0]
        ? rooms[0].id
        : "";

    let bestScore =
      -Infinity;

    rooms.forEach(
      node => {
        const vector =
          rotatedRoomUnitVector(
            node,
            clusterLocalQuaternion
          );

        const score =
          dot(
            vector,
            anchor
          );

        if (score > bestScore) {
          bestScore = score;
          bestRoom = node.id;
        }
      }
    );

    return bestRoom;
  }

  function nearestPrimaryRoomLocal(
    wing,
    clusterLocalQuaternion
  ) {
    const anchor =
      clusterAnchorVector();

    const rooms =
      activeRoomNodes(wing);

    let bestRoom =
      rooms[0]
        ? rooms[0].id
        : "";

    let bestScore =
      -Infinity;

    rooms.forEach(
      node => {
        const vector =
          rotatedRoomLocalUnitVector(
            node,
            clusterLocalQuaternion
          );

        const score =
          dot(
            vector,
            anchor
          );

        if (score > bestScore) {
          bestScore = score;
          bestRoom = node.id;
        }
      }
    );

    return bestRoom;
  }

  function settledConstellationQuaternion(
    wing,
    currentQuaternion
  ) {
    const currentVector =
      rotatedCardinalUnitVector(
        wing,
        currentQuaternion
      );

    const alignment =
      quaternionFromUnitVectors(
        currentVector,
        constellationAnchorVector()
      );

    return quaternionNormalize(
      quaternionMultiply(
        alignment,
        currentQuaternion
      )
    );
  }

  function settledClusterQuaternion(
    roomId,
    wing,
    currentLocalQuaternion
  ) {
    const node =
      state.registry.get(
        roomId
      );

    if (
      !node ||
      node.type !==
        NODE_TYPES.ROOM ||
      node.wing !== wing
    ) {
      return currentLocalQuaternion
        .slice();
    }

    const currentLocalVector =
      rotatedRoomLocalUnitVector(
        node,
        currentLocalQuaternion
      );

    const alignment =
      quaternionFromUnitVectors(
        currentLocalVector,
        clusterAnchorVector()
      );

    return quaternionNormalize(
      quaternionMultiply(
        alignment,
        currentLocalQuaternion
      )
    );
  }

  function sphericalCardinalPosition(
    wing
  ) {
    const unit =
      rotatedCardinalUnitVector(
        wing
      );

    return {
      unit,

      x:
        unit[0] *
        SPHERE.constellation
          .horizontalRadius,

      y:
        unit[1] *
        SPHERE.constellation
          .verticalRadius,

      z:
        unit[2] *
        SPHERE.constellation
          .depthRadius,

      depth:
        (
          unit[2] + 1
        ) / 2,

      primary:
        clamp(
          (
            dot(
              unit,
              constellationAnchorVector()
            ) +
            1
          ) / 2,
          0,
          1
        )
    };
  }

  function sphericalRoomPosition(
    node,
    clusterLocalQuaternion
  ) {
    const unit =
      rotatedRoomUnitVector(
        node,
        clusterLocalQuaternion
      );

    const activeWingUnit =
      rotatedCardinalUnitVector(
        node.wing
      );

    const clusterCenter = [
      activeWingUnit[0] *
        SPHERE.cluster
          .centerRadius,

      activeWingUnit[1] *
        SPHERE.cluster
          .centerRadius,

      activeWingUnit[2] *
        SPHERE.cluster
          .centerRadius
    ];

    return {
      unit,

      x:
        clusterCenter[0] +
        unit[0] *
        SPHERE.cluster
          .horizontalRadius,

      y:
        clusterCenter[1] +
        unit[1] *
        SPHERE.cluster
          .verticalRadius,

      z:
        clusterCenter[2] +
        unit[2] *
        SPHERE.cluster
          .depthRadius,

      depth:
        (
          unit[2] + 1
        ) / 2,

      primary:
        clamp(
          (
            dot(
              unit,
              clusterAnchorVector()
            ) +
            1
          ) / 2,
          0,
          1
        )
    };
  }

  function setTarget(
    node,
    values
  ) {
    Object.assign(
      node.target,
      values
    );
  }

  function withUniformScale(
    values,
    scale
  ) {
    values.sx = scale;
    values.sy = scale;
    values.sz = scale;

    return values;
  }

  function syncQuaternionTargets(
    deltaTime
  ) {
    const frameConstellationQuaternion =
      constellationQuaternionFromFrame(
        state.frame
      );

    if (
      state.pointer &&
      state.pointer.dragging &&
      state.pointer.gestureScope ===
        GESTURE_SCOPES
          .CONSTELLATION
    ) {
      state
        .constellationTargetQuaternion =
        state.pointer
          .currentQuaternion
          .slice();

      state
        .constellationQuaternion =
        state.pointer
          .currentQuaternion
          .slice();
    } else {
      state
        .constellationTargetQuaternion =
        frameConstellationQuaternion
          .slice();

      if (state.reducedMotion) {
        state
          .constellationQuaternion =
          frameConstellationQuaternion
            .slice();
      } else {
        state
          .constellationQuaternion =
          quaternionSlerp(
            state
              .constellationQuaternion,

            state
              .constellationTargetQuaternion,

            Math.min(
              1,
              deltaTime *
              GESTURE.settleSpeed
            )
          );
      }
    }

    WINGS.forEach(
      wing => {
        const frameLocalQuaternion =
          clusterQuaternionFromFrame(
            state.frame,
            wing
          );

        if (
          state.pointer &&
          state.pointer.dragging &&
          state.pointer.gestureScope ===
            GESTURE_SCOPES.CLUSTER &&
          state.pointer.wing === wing
        ) {
          state
            .clusterTargetQuaternions
            .set(
              wing,
              state.pointer
                .currentQuaternion
                .slice()
            );

          state
            .clusterQuaternions
            .set(
              wing,
              state.pointer
                .currentQuaternion
                .slice()
            );

          return;
        }

        state
          .clusterTargetQuaternions
          .set(
            wing,
            frameLocalQuaternion
              .slice()
          );

        const currentLocal =
          state
            .clusterQuaternions
            .get(wing) ||
          frameLocalQuaternion
            .slice();

        if (state.reducedMotion) {
          state
            .clusterQuaternions
            .set(
              wing,
              frameLocalQuaternion
                .slice()
            );

          return;
        }

        state
          .clusterQuaternions
          .set(
            wing,
            quaternionSlerp(
              currentLocal,
              frameLocalQuaternion,
              Math.min(
                1,
                deltaTime *
                GESTURE.settleSpeed
              )
            )
          );
      }
    );
  }

  function resetNodeTargets() {
    state.registry.forEach(
      node => {
        node.visible = false;

        node.material =
          node.baseMaterial;

        node.depthScore = 0;
        node.primaryScore = 0;

        setTarget(
          node,
          {
            x: 0,
            y: 0,
            z: -1,

            sx: 0.5,
            sy: 0.5,
            sz: 0.5,

            prominence: 0,
            halo: 0,

            rotationSpeed: 0.06,
            float: 0
          }
        );
      }
    );
  }

  function updateOuterCoinTargets() {
    state.visualPrimaryWing =
      nearestPrimaryWing(
        state
          .constellationQuaternion
      );

    WINGS.forEach(
      wing => {
        const node =
          state.registry.get(
            wing
          );

        if (!node) {
          return;
        }

        const sphere =
          sphericalCardinalPosition(
            wing
          );

        const primary =
          wing ===
          state.visualPrimaryWing;

        node.visible = true;
        node.depthScore =
          sphere.depth;

        node.primaryScore =
          sphere.primary;

        node.material =
          primary
            ? "CARDINAL_FOCUSED"
            : "CARDINAL_IDLE";

        const depthScale =
          0.72 +
          sphere.depth *
          0.42;

        const prominenceScale =
          primary
            ? QUALITY
                .focusedCardinalScale
            : QUALITY
                .cardinalScale;

        const ordinaryScale =
          prominenceScale *
          depthScale *
          (
            primary
              ? 1.10
              : 1
          );

        const prominence =
          0.34 +
          sphere.depth *
          0.46 +
          sphere.primary *
          0.30;

        const halo =
          0.24 +
          sphere.depth *
          0.34 +
          sphere.primary *
          0.54;

        const rotationSpeed =
          primary
            ? 0.15
            : 0.08 +
              sphere.depth *
              0.05;

        const float =
          primary
            ? 0.012
            : 0.004 +
              sphere.depth *
              0.005;

        setTarget(
          node,
          withUniformScale(
            {
              x: sphere.x,
              y: sphere.y,
              z: sphere.z,

              prominence:
                clamp(
                  prominence,
                  0.10,
                  1.16
                ),

              halo:
                clamp(
                  halo,
                  0,
                  1.28
                ),

              rotationSpeed,
              float
            },
            ordinaryScale
          )
        );
      }
    );
  }

  function updateClusterRoomTargets(
    frame,
    activeWing
  ) {
    const clusterLocalQuaternion =
      state
        .clusterQuaternions
        .get(activeWing) ||
      [0, 0, 0, 1];

    const primaryRoom =
      nearestPrimaryRoom(
        activeWing,
        clusterLocalQuaternion
      );

    state
      .visualPrimaryRooms
      .set(
        activeWing,
        primaryRoom
      );

    const activeRooms =
      activeRoomNodes(
        activeWing
      );

    activeRooms.forEach(
      node => {
        const sphere =
          sphericalRoomPosition(
            node,
            clusterLocalQuaternion
          );

        const selected =
          frame.state ===
            "ROOM_SELECTED" &&
          frame.selectedRoom ===
            node.id;

        const primary =
          primaryRoom ===
          node.id;

        node.visible = true;
        node.depthScore =
          sphere.depth;

        node.primaryScore =
          sphere.primary;

        node.material =
          selected
            ? "ROOM_SELECTED"
            : primary
              ? "ROOM_PRIMARY"
              : "ROOM_IDLE";

        const depthScale =
          0.68 +
          sphere.depth *
          0.36;

        const primaryLift =
          primary
            ? 1.12
            : 1;

        const selectedLift =
          selected
            ? 1.07
            : 1;

        const ordinaryScale =
          (
            selected
              ? QUALITY
                  .selectedRoomScale
              : primary
                ? QUALITY
                    .primaryRoomScale
                : QUALITY
                    .roomScale
          ) *
          depthScale *
          primaryLift *
          selectedLift;

        const prominence =
          0.30 +
          sphere.depth *
          0.48 +
          sphere.primary *
          0.28 +
          (
            selected
              ? 0.08
              : 0
          );

        const halo =
          0.20 +
          sphere.depth *
          0.30 +
          sphere.primary *
          0.44 +
          (
            selected
              ? 0.18
              : 0
          );

        const rotationSpeed =
          primary ||
          selected
            ? 0.13
            : 0.07 +
              sphere.depth *
              0.04;

        const float =
          primary ||
          selected
            ? 0.012
            : 0.004 +
              sphere.depth *
              0.004;

        setTarget(
          node,
          withUniformScale(
            {
              x: sphere.x,

              y:
                sphere.y -
                0.06,

              z:
                sphere.z +
                0.14,

              prominence:
                clamp(
                  prominence,
                  0.10,
                  1.14
                ),

              halo:
                clamp(
                  halo,
                  0,
                  1.12
                ),

              rotationSpeed,
              float
            },
            ordinaryScale
          )
        );
      }
    );
  }

  function updateConstellationCamera() {
    state.camera.nextEye = [
      0,
      0.76,

      state.cssWidth /
        Math.max(
          1,
          state.cssHeight
        ) <
        QUALITY
          .mobileAspectThreshold
        ? 7.10
        : 6.05
    ];

    state.camera.nextTarget = [
      0,
      0.03,
      0.06
    ];
  }

  function updateClusterCamera() {
    state.camera.nextEye = [
      0,
      0.62,

      state.cssWidth /
        Math.max(
          1,
          state.cssHeight
        ) <
        QUALITY
          .mobileAspectThreshold
        ? 7.68
        : 6.28
    ];

    state.camera.nextTarget = [
      0,
      0.02,
      0.04
    ];
  }

  function updateHeldTargets() {
    state.camera.nextEye = [
      0,
      0.76,
      6.45
    ];

    state.camera.nextTarget = [
      0,
      0,
      0
    ];
  }

  function updateTargets() {
    const frame =
      state.frame;

    resetNodeTargets();

    if (
      !frame ||
      frame.held
    ) {
      state.sceneProjection =
        SCENE_PROJECTIONS.HELD;

      updateHeldTargets();
      return;
    }

    if (
      frame.presentation &&
      frame.presentation
        .outerCardinalsActive ===
        true
    ) {
      state.sceneProjection =
        SCENE_PROJECTIONS
          .CONSTELLATION;

      updateOuterCoinTargets();
      updateConstellationCamera();
      return;
    }

    if (
      frame.presentation &&
      frame.presentation
        .activeRoomCluster ===
        true &&
      frame.presentation
        .roomSelectionPermitted ===
        true &&
      normalizeWing(
        frame.activeClusterWing
      ) &&
      frame.cluster &&
      frame.cluster.wing ===
        frame.activeClusterWing
    ) {
      state.sceneProjection =
        SCENE_PROJECTIONS.CLUSTER;

      updateClusterRoomTargets(
        frame,
        frame.activeClusterWing
      );

      updateClusterCamera();
      return;
    }

    state.sceneProjection =
      SCENE_PROJECTIONS.HELD;

    updateHeldTargets();
  }

  function lerp(
    a,
    b,
    amount
  ) {
    return (
      a +
      (
        b - a
      ) *
      amount
    );
  }

  function updateTransforms(
    deltaTime
  ) {
    const speed =
      state.reducedMotion
        ? 1
        : Math.min(
            1,
            deltaTime * 6.2
          );

    state.registry.forEach(
      node => {
        const current =
          node.transform;

        const target =
          node.target;

        [
          "x",
          "y",
          "z",
          "sx",
          "sy",
          "sz",
          "prominence",
          "halo",
          "rotationSpeed",
          "float"
        ].forEach(
          key => {
            current[key] =
              lerp(
                current[key],
                target[key],
                speed
              );
          }
        );

        if (state.reducedMotion) {
          current.rx = 0;
          current.ry = 0;
          current.rz = 0;

          return;
        }

        current.rz +=
          deltaTime *
          current.rotationSpeed;

        current.ry =
          Math.sin(
            state.time *
              0.42 +
            node.phase
          ) *
          QUALITY.maxYaw *
          Math.max(
            0.35,
            current.prominence
          );

        current.rx =
          Math.sin(
            state.time *
              0.31 +
            node.phase *
              0.73
          ) *
          QUALITY.maxPitch *
          Math.max(
            0.35,
            current.prominence
          );
      }
    );

    for (
      let index = 0;
      index < 3;
      index += 1
    ) {
      state.camera.eye[index] =
        lerp(
          state.camera.eye[
            index
          ],
          state.camera.nextEye[
            index
          ],
          speed
        );

      state.camera.target[
        index
      ] =
        lerp(
          state.camera.target[
            index
          ],
          state.camera.nextTarget[
            index
          ],
          speed
        );
    }
  }

  function modelMatrix(
    node,
    haloPass
  ) {
    const transform =
      node.transform;

    const floatY =
      state.reducedMotion
        ? 0
        : Math.sin(
            state.time *
              0.95 +
            node.roomIndex *
              0.72 +
            node.phase
          ) *
          transform.float;

    const haloScale =
      haloPass
        ? 1 +
          transform.halo *
          0.10
        : 1;

    return multiply4(
      translate4(
        transform.x,
        transform.y +
          floatY,
        transform.z
      ),

      multiply4(
        rotateZ4(
          transform.rz
        ),

        multiply4(
          rotateY4(
            transform.ry
          ),

          multiply4(
            rotateX4(
              transform.rx
            ),

            scale4(
              transform.sx *
                haloScale,

              transform.sy *
                haloScale,

              transform.sz *
                haloScale
            )
          )
        )
      )
    );
  }

  function projectNode(node) {
    if (
      !state.view ||
      !state.projection
    ) {
      return null;
    }

    const model =
      modelMatrix(
        node,
        false
      );

    const mvp =
      multiply4(
        state.projection,
        multiply4(
          state.view,
          model
        )
      );

    const clip =
      transformPoint4(
        mvp,
        [0, 0, 0, 1]
      );

    if (!clip[3]) {
      return null;
    }

    const x =
      clip[0] / clip[3];

    const y =
      clip[1] / clip[3];

    if (
      x < -1.30 ||
      x > 1.30 ||
      y < -1.30 ||
      y > 1.30
    ) {
      return null;
    }

    return {
      x:
        (
          (
            x + 1
          ) / 2
        ) *
        state.cssWidth,

      y:
        (
          (
            1 - y
          ) / 2
        ) *
        state.cssHeight
    };
  }

  function hideSemanticNode(node) {
    const element =
      node.semanticElement;

    if (!element) {
      return;
    }

    element.style.opacity = "0";
    element.style.pointerEvents =
      "none";

    element.setAttribute(
      "aria-hidden",
      "true"
    );

    element.tabIndex = -1;

    element.dataset.active =
      "false";

    element.dataset.selected =
      "false";

    element.dataset.primary =
      "false";

    element.removeAttribute(
      "aria-current"
    );
  }

  function syncCardinalSemanticNode(
    node,
    screen
  ) {
    const element =
      node.semanticElement;

    if (!element) {
      return;
    }

    const primaryLabel =
      element.querySelector(
        "span:first-child"
      );

    const secondaryLabel =
      element.querySelector(
        "span:last-child"
      );

    if (primaryLabel) {
      primaryLabel.textContent =
        node.label;
    }

    if (secondaryLabel) {
      secondaryLabel.textContent =
        node.short;
    }

    const primary =
      node.wing ===
      state.visualPrimaryWing;

    const depth =
      clamp(
        node.depthScore,
        0,
        1
      );

    const scale =
      0.64 +
      depth * 0.22 +
      (
        primary
          ? 0.18
          : 0
      );

    const opacity =
      clamp(
        0.22 +
        depth * 0.54 +
        (
          primary
            ? 0.24
            : 0
        ),
        0.10,
        1
      );

    const interactive =
      state.sceneProjection ===
        SCENE_PROJECTIONS
          .CONSTELLATION &&
      node.visible &&
      node.transform
        .prominence >= 0.12;

    element.style.left =
      `${screen.x}px`;

    element.style.top =
      `${screen.y}px`;

    element.style.right = "auto";
    element.style.bottom = "auto";

    element.style.transform =
      `translate(-50%, -50%) scale(${scale})`;

    element.style.opacity =
      String(opacity);

    element.style.pointerEvents =
      interactive
        ? "auto"
        : "none";

    element.style.zIndex =
      String(
        10 +
        Math.round(
          depth * 80
        ) +
        (
          primary
            ? 20
            : 0
        )
      );

    element.dataset.active =
      interactive
        ? "true"
        : "false";

    element.dataset.selected =
      "false";

    element.dataset.primary =
      primary
        ? "true"
        : "false";

    element.dataset.depth =
      depth.toFixed(4);

    element.setAttribute(
      "aria-hidden",
      interactive
        ? "false"
        : "true"
    );

    element.tabIndex =
      interactive
        ? 0
        : -1;

    if (primary) {
      element.setAttribute(
        "aria-current",
        "true"
      );
    } else {
      element.removeAttribute(
        "aria-current"
      );
    }
  }

  function syncRoomSemanticNode(
    node,
    screen
  ) {
    const element =
      node.semanticElement;

    if (!element) {
      return;
    }

    const depth =
      clamp(
        node.depthScore,
        0,
        1
      );

    const activeWing =
      state.frame
        ? normalizeWing(
            state.frame
              .activeClusterWing
          )
        : "";

    const active =
      state.sceneProjection ===
        SCENE_PROJECTIONS.CLUSTER &&
      node.visible &&
      node.wing === activeWing &&
      node.transform
        .prominence >= 0.12;

    const selected =
      active &&
      state.frame &&
      state.frame.state ===
        "ROOM_SELECTED" &&
      state.frame.selectedRoom ===
        node.id;

    const primaryRoom =
      activeWing
        ? state
            .visualPrimaryRooms
            .get(activeWing) ||
          ""
        : "";

    const primary =
      active &&
      node.id ===
        primaryRoom;

    const scale =
      0.72 +
      depth * 0.20 +
      (
        primary
          ? 0.12
          : 0
      ) +
      (
        selected
          ? 0.08
          : 0
      );

    const opacity =
      clamp(
        0.24 +
        depth * 0.56 +
        (
          primary
            ? 0.12
            : 0
        ) +
        (
          selected
            ? 0.10
            : 0
        ),
        0.10,
        1
      );

    element.style.position =
      "absolute";

    element.style.left =
      `${screen.x}px`;

    element.style.top =
      `${screen.y}px`;

    element.style.right = "auto";
    element.style.bottom = "auto";

    element.style.transform =
      `translate(-50%, -50%) scale(${scale})`;

    element.style.opacity =
      String(opacity);

    element.style.pointerEvents =
      active
        ? "auto"
        : "none";

    element.style.zIndex =
      String(
        10 +
        Math.round(
          depth * 80
        ) +
        (
          primary
            ? 20
            : 0
        ) +
        (
          selected
            ? 12
            : 0
        )
      );

    element.dataset.active =
      active
        ? "true"
        : "false";

    element.dataset.selected =
      selected
        ? "true"
        : "false";

    element.dataset.primary =
      primary
        ? "true"
        : "false";

    element.dataset.depth =
      depth.toFixed(4);

    element.setAttribute(
      "aria-hidden",
      active
        ? "false"
        : "true"
    );

    element.tabIndex =
      active
        ? 0
        : -1;

    if (
      selected ||
      primary
    ) {
      element.setAttribute(
        "aria-current",
        "true"
      );
    } else {
      element.removeAttribute(
        "aria-current"
      );
    }
  }

  function syncSemanticNode(node) {
    if (
      !node.semanticElement
    ) {
      return;
    }

    const screen =
      node.visible &&
      node.transform
        .prominence >= 0.08
        ? projectNode(node)
        : null;

    if (!screen) {
      hideSemanticNode(node);
      return;
    }

    if (
      node.type ===
      NODE_TYPES.CARDINAL
    ) {
      syncCardinalSemanticNode(
        node,
        screen
      );

      return;
    }

    syncRoomSemanticNode(
      node,
      screen
    );
  }

  function syncSemanticObjects() {
    state.registry.forEach(
      syncSemanticNode
    );
  }

  function resize() {
    const rect =
      state.canvas
        .getBoundingClientRect();

    const lowPower =
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <=
        QUALITY
          .lowPowerHardwareConcurrencyThreshold;

    const cap =
      lowPower
        ? QUALITY
            .lowPowerDevicePixelRatioCap
        : QUALITY
            .normalDevicePixelRatioCap;

    const pixelRatio =
      Math.min(
        globalThis.devicePixelRatio ||
        1,
        cap
      );

    const width =
      Math.max(
        1,
        Math.floor(
          rect.width *
          pixelRatio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height *
          pixelRatio
        )
      );

    if (
      state.canvas.width !== width ||
      state.canvas.height !== height
    ) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.cssWidth =
      Math.max(
        1,
        rect.width
      );

    state.cssHeight =
      Math.max(
        1,
        rect.height
      );

    state.width = width;
    state.height = height;
    state.pixelRatio =
      pixelRatio;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function applyMaterial(
    materialName,
    prominence,
    haloStrength
  ) {
    const gl =
      state.gl;

    const material =
      MATERIALS[
        materialName
      ] ||
      MATERIALS.CARDINAL_IDLE;

    const bloomDisabled =
      state.cssWidth <=
      QUALITY.bloomDisableWidthPx;

    gl.uniform1f(
      state.uniforms.twinkle,
      state.reducedMotion
        ? 0
        : 1
    );

    gl.uniform1f(
      state.uniforms.sparkle,
      state.reducedMotion
        ? 0
        : material.sparkle
    );

    gl.uniform1f(
      state.uniforms.prominence,
      prominence
    );

    gl.uniform1f(
      state.uniforms.specular,
      material.specular
    );

    gl.uniform1f(
      state.uniforms.rim,
      material.rim
    );

    gl.uniform1f(
      state.uniforms.emissive,
      material.emissive
    );

    gl.uniform1f(
      state.uniforms.alpha,
      material.alpha
    );

    gl.uniform1f(
      state.uniforms.contrast,
      material.contrast
    );

    gl.uniform1f(
      state.uniforms.haloStrength,
      bloomDisabled
        ? 0
        : material.halo *
          haloStrength
    );

    gl.uniform1f(
      state.uniforms.saturation,
      1
    );
  }

  function drawNode(
    node,
    haloPass
  ) {
    if (
      !node.visible ||
      node.transform
        .prominence < 0.04
    ) {
      return 0;
    }

    const mesh =
      state.meshes.get(
        node.meshKey
      );

    if (!mesh) {
      return 0;
    }

    const gl =
      state.gl;

    bindAttrib(
      gl,
      mesh.position,
      state.attribs.position,
      3
    );

    bindAttrib(
      gl,
      mesh.normal,
      state.attribs.normal,
      3
    );

    bindAttrib(
      gl,
      mesh.color,
      state.attribs.color,
      3
    );

    const model =
      modelMatrix(
        node,
        haloPass
      );

    const modelView =
      multiply4(
        state.view,
        model
      );

    const normalMatrix =
      inverseTransposeNormalMatrix3(
        modelView
      );

    gl.uniformMatrix4fv(
      state.uniforms.model,
      false,
      new Float32Array(
        model
      )
    );

    gl.uniformMatrix4fv(
      state.uniforms.view,
      false,
      new Float32Array(
        state.view
      )
    );

    gl.uniformMatrix4fv(
      state.uniforms.projection,
      false,
      new Float32Array(
        state.projection
      )
    );

    gl.uniformMatrix3fv(
      state.uniforms
        .viewNormalMatrix,
      false,
      new Float32Array(
        normalMatrix
      )
    );

    gl.uniform1f(
      state.uniforms.time,
      state.time
    );

    gl.uniform1f(
      state.uniforms.haloPass,
      haloPass
        ? 1
        : 0
    );

    gl.uniform1f(
      state.uniforms
        .haloExpansion,
      0.075
    );

    applyMaterial(
      node.material,
      node.transform
        .prominence,
      node.transform.halo
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    return 1;
  }

  function pointerDistance(
    pointer,
    clientX,
    clientY
  ) {
    return Math.hypot(
      clientX -
        pointer.startX,

      clientY -
        pointer.startY
    );
  }

  function addPointerSample(
    pointer,
    clientX,
    clientY,
    time
  ) {
    pointer.samples.push({
      x: clientX,
      y: clientY,
      time
    });

    const minimumTime =
      time -
      Math.max(
        GESTURE.sampleWindowMs *
          2,
        260
      );

    pointer.samples =
      pointer.samples
        .filter(
          sample =>
            sample.time >=
            minimumTime
        )
        .slice(
          -GESTURE.maximumSamples
        );
  }

  function gestureMetrics(
    pointer,
    endX,
    endY,
    endTime
  ) {
    const dx =
      endX -
      pointer.startX;

    const dy =
      endY -
      pointer.startY;

    const distance =
      Math.hypot(dx, dy);

    const durationMs =
      Math.max(
        1,
        endTime -
        pointer.startTime
      );

    const averageVelocity =
      distance / durationMs;

    const recentSamples =
      pointer.samples.filter(
        sample =>
          sample.time >=
          endTime -
          GESTURE.sampleWindowMs
      );

    const releaseStart =
      recentSamples.length
        ? recentSamples[0]
        : {
            x: pointer.startX,
            y: pointer.startY,
            time:
              pointer.startTime
          };

    const releaseDistance =
      Math.hypot(
        endX -
          releaseStart.x,

        endY -
          releaseStart.y
      );

    const releaseDuration =
      Math.max(
        1,
        endTime -
        releaseStart.time
      );

    return {
      distance,
      durationMs,
      averageVelocity,

      releaseVelocity:
        releaseDistance /
        releaseDuration
    };
  }

  function dragQuaternionFromPointer(
    pointer,
    clientX,
    clientY
  ) {
    const width =
      Math.max(
        1,
        state.cssWidth
      );

    const height =
      Math.max(
        1,
        state.cssHeight
      );

    const dx =
      clientX -
      pointer.startX;

    const dy =
      clientY -
      pointer.startY;

    const yaw =
      (
        dx / width
      ) *
      GESTURE.radiansPerViewport;

    const pitch =
      (
        dy / height
      ) *
      GESTURE.radiansPerViewport;

    const yawQuaternion =
      quaternionFromAxisAngle(
        [0, 1, 0],
        yaw
      );

    const pitchQuaternion =
      quaternionFromAxisAngle(
        [1, 0, 0],
        pitch
      );

    return quaternionNormalize(
      quaternionMultiply(
        pitchQuaternion,
        quaternionMultiply(
          yawQuaternion,
          pointer.startQuaternion
        )
      )
    );
  }

  function requestControllerOrbitBegin(
    pointer
  ) {
    return (
      state.controller
        .beginOrbitGesture({
          quaternion:
            pointer.startQuaternion,

          primaryWing:
            state.visualPrimaryWing,

          source:
            "archcoin-crystals-empty-scene-pointer"
        }) !== false
    );
  }

  function requestControllerOrbitPreview(
    quaternion,
    primaryWing
  ) {
    return (
      state.controller
        .requestOrbitPreview({
          quaternion,
          primaryWing,

          source:
            "archcoin-crystals-empty-scene-drag"
        }) !== false
    );
  }

  function requestControllerOrbitCommit(
    quaternion,
    primaryWing
  ) {
    return (
      state.controller
        .requestOrbitCommit({
          quaternion,
          primaryWing,

          source:
            "archcoin-crystals-empty-scene-release"
        }) !== false
    );
  }

  function requestControllerOrbitCancel(
    reason
  ) {
    return (
      state.controller
        .requestOrbitCancel(
          reason
        ) !== false
    );
  }

  function requestControllerClusterBegin(
    pointer
  ) {
    return (
      state.controller
        .beginClusterGesture(
          pointer.wing,
          {
            quaternion:
              pointer.startQuaternion,

            primaryRoom:
              state
                .visualPrimaryRooms
                .get(pointer.wing) ||
              "",

            source:
              "archcoin-crystals-empty-scene-cluster-pointer"
          }
        ) !== false
    );
  }

  function requestControllerClusterPreview(
    wing,
    quaternion,
    primaryRoom
  ) {
    return (
      state.controller
        .requestClusterPreview(
          wing,
          {
            quaternion,
            primaryRoom,

            source:
              "archcoin-crystals-empty-scene-cluster-drag"
          }
        ) !== false
    );
  }

  function requestControllerClusterCommit(
    wing,
    quaternion,
    primaryRoom
  ) {
    return (
      state.controller
        .requestClusterCommit(
          wing,
          {
            quaternion,
            primaryRoom,

            source:
              "archcoin-crystals-empty-scene-cluster-release"
          }
        ) !== false
    );
  }

  function requestControllerClusterCancel(
    wing,
    reason
  ) {
    return (
      state.controller
        .requestClusterCancel(
          wing,
          reason
        ) !== false
    );
  }

  function blockedControl(target) {
    if (
      !target ||
      !target.closest
    ) {
      return null;
    }

    return target.closest(
      [
        "[data-upstream-compass-control]",
        "[data-archcoin-enter]",
        "[data-archcoin-return-to-orbit]",
        "[data-archcoin-read-more]",
        "[data-archcoin-lens-tab]",
        "[data-archcoin-panel]",
        "a",
        "button",
        "summary",
        "input",
        "textarea",
        "select"
      ].join(", ")
    );
  }

  function semanticNavigationControl(
    target
  ) {
    if (
      !target ||
      !target.closest
    ) {
      return null;
    }

    return target.closest(
      [
        "[data-archcoin-coin]",
        "[data-archcoin-room]"
      ].join(", ")
    );
  }

  function classifyPointerTerritory(
    event
  ) {
    const rect =
      state.scene
        .getBoundingClientRect();

    const inside =
      event.clientX >=
        rect.left &&
      event.clientX <=
        rect.right &&
      event.clientY >=
        rect.top &&
      event.clientY <=
        rect.bottom;

    if (!inside) {
      return POINTER_TERRITORIES
        .OUTSIDE_SCENE;
    }

    if (
      semanticNavigationControl(
        event.target
      )
    ) {
      return POINTER_TERRITORIES
        .SEMANTIC_NAVIGATION_CONTROL;
    }

    if (
      blockedControl(
        event.target
      )
    ) {
      return POINTER_TERRITORIES
        .BLOCKED_CONTROL;
    }

    return POINTER_TERRITORIES
      .EMPTY_SCENE;
  }

  function resolveGestureScope(frame) {
    if (
      !frame ||
      frame.held
    ) {
      return GESTURE_SCOPES.NONE;
    }

    if (
      frame.presentation &&
      frame.presentation
        .outerCardinalsActive ===
        true
    ) {
      return GESTURE_SCOPES
        .CONSTELLATION;
    }

    if (
      frame.presentation &&
      frame.presentation
        .activeRoomCluster ===
        true &&
      normalizeWing(
        frame.activeClusterWing
      )
    ) {
      return GESTURE_SCOPES.CLUSTER;
    }

    return GESTURE_SCOPES.NONE;
  }

  function handlePointerDown(event) {
    if (state.pointer) {
      return;
    }

    const territory =
      classifyPointerTerritory(
        event
      );

    if (
      territory !==
      POINTER_TERRITORIES
        .EMPTY_SCENE
    ) {
      emitReceipt({
        lastPointerTerritory:
          territory,

        lastGestureType:
          GESTURE_TYPES.BLOCKED
      });

      return;
    }

    const gestureScope =
      resolveGestureScope(
        state.frame
      );

    if (!gestureScope) {
      return;
    }

    const wing =
      gestureScope ===
      GESTURE_SCOPES.CLUSTER
        ? normalizeWing(
            state.frame
              .activeClusterWing
          )
        : "";

    if (
      gestureScope ===
        GESTURE_SCOPES.CLUSTER &&
      !wing
    ) {
      return;
    }

    try {
      event.currentTarget
        .setPointerCapture(
          event.pointerId
        );
    } catch (_) {}

    const startQuaternion =
      gestureScope ===
      GESTURE_SCOPES
        .CONSTELLATION
        ? state
            .constellationQuaternion
            .slice()
        : (
            state
              .clusterQuaternions
              .get(wing) ||
            [0, 0, 0, 1]
          ).slice();

    const now =
      performance.now();

    state.pointer = {
      id: event.pointerId,

      startX: event.clientX,
      startY: event.clientY,

      startTime: now,

      territory,
      gestureScope,
      wing,

      dragging: false,

      controllerGestureBegan:
        false,

      startQuaternion,

      currentQuaternion:
        startQuaternion.slice(),

      samples: [
        {
          x: event.clientX,
          y: event.clientY,
          time: now
        }
      ]
    };

    emitReceipt({
      lastPointerTerritory:
        territory,

      lastGestureType:
        GESTURE_TYPES
          .POINTER_DOWN
    });
  }

  function handlePointerMove(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      event.pointerId !==
        pointer.id
    ) {
      return;
    }

    const now =
      performance.now();

    addPointerSample(
      pointer,
      event.clientX,
      event.clientY,
      now
    );

    const distance =
      pointerDistance(
        pointer,
        event.clientX,
        event.clientY
      );

    if (
      !pointer.dragging &&
      distance <
        GESTURE.dragDeadZonePx
    ) {
      return;
    }

    if (!pointer.dragging) {
      pointer.dragging = true;

      pointer.controllerGestureBegan =
        pointer.gestureScope ===
        GESTURE_SCOPES
          .CONSTELLATION
          ? requestControllerOrbitBegin(
              pointer
            )
          : requestControllerClusterBegin(
              pointer
            );

      if (
        !pointer
          .controllerGestureBegan
      ) {
        state.pointer = null;
        clearGestureDatasets();
        return;
      }

      state.scene.dataset
        .archcoinDragging =
        "true";

      state.root.dataset
        .archcoinDragging =
        "true";

      state.root.dataset
        .archcoinGestureScope =
        pointer.gestureScope;
    }

    event.preventDefault();

    pointer.currentQuaternion =
      dragQuaternionFromPointer(
        pointer,
        event.clientX,
        event.clientY
      );

    if (
      pointer.gestureScope ===
      GESTURE_SCOPES
        .CONSTELLATION
    ) {
      state
        .constellationQuaternion =
        pointer.currentQuaternion
          .slice();

      state
        .constellationTargetQuaternion =
        pointer.currentQuaternion
          .slice();

      const primaryWing =
        nearestPrimaryWing(
          pointer.currentQuaternion
        );

      state.visualPrimaryWing =
        primaryWing;

      requestControllerOrbitPreview(
        pointer.currentQuaternion,
        primaryWing
      );

      emitReceipt({
        status: "available",

        lastPointerTerritory:
          pointer.territory,

        lastGestureType:
          GESTURE_TYPES
            .CONSTELLATION_DRAG,

        gestureActive: true,

        primaryWing,

        glError: "NO_ERROR"
      });

      return;
    }

    state
      .clusterQuaternions
      .set(
        pointer.wing,
        pointer.currentQuaternion
          .slice()
      );

    state
      .clusterTargetQuaternions
      .set(
        pointer.wing,
        pointer.currentQuaternion
          .slice()
      );

    const primaryRoom =
      nearestPrimaryRoomLocal(
        pointer.wing,
        pointer.currentQuaternion
      );

    state
      .visualPrimaryRooms
      .set(
        pointer.wing,
        nearestPrimaryRoom(
          pointer.wing,
          pointer.currentQuaternion
        )
      );

    requestControllerClusterPreview(
      pointer.wing,
      pointer.currentQuaternion,
      primaryRoom
    );

    emitReceipt({
      status: "available",

      lastPointerTerritory:
        pointer.territory,

      lastGestureType:
        GESTURE_TYPES
          .CLUSTER_DRAG,

      gestureActive: true,

      activeClusterWing:
        pointer.wing,

      primaryRoom,

      glError: "NO_ERROR"
    });
  }

  function releasePointerCapture(
    event
  ) {
    try {
      if (
        event.currentTarget
          .hasPointerCapture &&
        event.currentTarget
          .hasPointerCapture(
            event.pointerId
          )
      ) {
        event.currentTarget
          .releasePointerCapture(
            event.pointerId
          );
      }
    } catch (_) {}
  }

  function finishConstellationDrag(
    pointer,
    event,
    metrics
  ) {
    const currentQuaternion =
      pointer.currentQuaternion
        .slice();

    const primaryWing =
      nearestPrimaryWing(
        currentQuaternion
      );

    const settledQuaternion =
      settledConstellationQuaternion(
        primaryWing,
        currentQuaternion
      );

    state.settledPrimaryWing =
      primaryWing;

    state.visualPrimaryWing =
      primaryWing;

    state
      .constellationTargetQuaternion =
      settledQuaternion.slice();

    if (state.reducedMotion) {
      state
        .constellationQuaternion =
        settledQuaternion.slice();
    }

    const committed =
      requestControllerOrbitCommit(
        settledQuaternion,
        primaryWing
      );

    state.suppressClickUntil =
      performance.now() +
      GESTURE.suppressClickMs;

    event.preventDefault();

    emitReceipt({
      status:
        committed
          ? "available"
          : "held",

      lastPointerTerritory:
        pointer.territory,

      lastGestureType:
        GESTURE_TYPES
          .CONSTELLATION_SETTLE,

      primaryWing,

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

      lastAverageVelocityPxPerMs:
        metrics.averageVelocity,

      lastReleaseVelocityPxPerMs:
        metrics.releaseVelocity,

      gestureActive: false,

      glError:
        committed
          ? "NO_ERROR"
          : "CONTROLLER_ORBIT_COMMIT_UNAVAILABLE"
    });
  }

  function finishClusterDrag(
    pointer,
    event,
    metrics
  ) {
    const currentLocalQuaternion =
      pointer.currentQuaternion
        .slice();

    const primaryRoom =
      nearestPrimaryRoomLocal(
        pointer.wing,
        currentLocalQuaternion
      );

    const settledLocalQuaternion =
      settledClusterQuaternion(
        primaryRoom,
        pointer.wing,
        currentLocalQuaternion
      );

    state
      .clusterTargetQuaternions
      .set(
        pointer.wing,
        settledLocalQuaternion
          .slice()
      );

    if (state.reducedMotion) {
      state
        .clusterQuaternions
        .set(
          pointer.wing,
          settledLocalQuaternion
            .slice()
        );
    }

    state
      .visualPrimaryRooms
      .set(
        pointer.wing,
        nearestPrimaryRoom(
          pointer.wing,
          settledLocalQuaternion
        )
      );

    const committed =
      requestControllerClusterCommit(
        pointer.wing,
        settledLocalQuaternion,
        primaryRoom
      );

    state.suppressClickUntil =
      performance.now() +
      GESTURE.suppressClickMs;

    event.preventDefault();

    emitReceipt({
      status:
        committed
          ? "available"
          : "held",

      lastPointerTerritory:
        pointer.territory,

      lastGestureType:
        GESTURE_TYPES
          .CLUSTER_SETTLE,

      activeClusterWing:
        pointer.wing,

      primaryRoom,

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

      lastAverageVelocityPxPerMs:
        metrics.averageVelocity,

      lastReleaseVelocityPxPerMs:
        metrics.releaseVelocity,

      gestureActive: false,

      glError:
        committed
          ? "NO_ERROR"
          : "CONTROLLER_CLUSTER_COMMIT_UNAVAILABLE"
    });
  }

  function clearGestureDatasets() {
    if (state.scene) {
      state.scene.dataset
        .archcoinDragging =
        "false";
    }

    if (state.root) {
      state.root.dataset
        .archcoinDragging =
        "false";

      state.root.dataset
        .archcoinGestureScope =
        "";
    }
  }

  function handlePointerUp(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      event.pointerId !==
        pointer.id
    ) {
      return;
    }

    const now =
      performance.now();

    addPointerSample(
      pointer,
      event.clientX,
      event.clientY,
      now
    );

    const metrics =
      gestureMetrics(
        pointer,
        event.clientX,
        event.clientY,
        now
      );

    state.pointer = null;

    releasePointerCapture(
      event
    );

    clearGestureDatasets();

    if (!pointer.dragging) {
      emitReceipt({
        lastPointerTerritory:
          pointer.territory,

        lastGestureType:
          GESTURE_TYPES.IDLE,

        gestureActive: false
      });

      return;
    }

    if (
      pointer.gestureScope ===
      GESTURE_SCOPES
        .CONSTELLATION
    ) {
      finishConstellationDrag(
        pointer,
        event,
        metrics
      );

      return;
    }

    finishClusterDrag(
      pointer,
      event,
      metrics
    );
  }

  function handlePointerCancel(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      event.pointerId !==
        pointer.id
    ) {
      return;
    }

    state.pointer = null;

    releasePointerCapture(
      event
    );

    if (
      pointer
        .controllerGestureBegan
    ) {
      if (
        pointer.gestureScope ===
        GESTURE_SCOPES
          .CONSTELLATION
      ) {
        requestControllerOrbitCancel(
          "pointer-cancel"
        );
      } else {
        requestControllerClusterCancel(
          pointer.wing,
          "pointer-cancel"
        );
      }
    }

    if (
      pointer.gestureScope ===
      GESTURE_SCOPES
        .CONSTELLATION
    ) {
      state
        .constellationTargetQuaternion =
        pointer.startQuaternion
          .slice();
    } else {
      state
        .clusterTargetQuaternions
        .set(
          pointer.wing,
          pointer.startQuaternion
            .slice()
        );
    }

    clearGestureDatasets();

    emitReceipt({
      lastPointerTerritory:
        pointer.territory,

      lastGestureType:
        GESTURE_TYPES.CANCELLED,

      gestureActive: false
    });
  }

  function handleSceneClickCapture(
    event
  ) {
    if (
      performance.now() <
      state.suppressClickUntil
    ) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  function bindPointerBridge() {
    if (state.listenersBound) {
      return;
    }

    state.listenersBound = true;

    state.scene.style.touchAction =
      "none";

    state.scene.style.overscrollBehavior =
      "contain";

    state.scene.style.webkitUserSelect =
      "none";

    state.scene.style.userSelect =
      "none";

    clearGestureDatasets();

    state.scene.addEventListener(
      "pointerdown",
      handlePointerDown,
      {
        passive: false
      }
    );

    state.scene.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: false
      }
    );

    state.scene.addEventListener(
      "pointerup",
      handlePointerUp,
      {
        passive: false
      }
    );

    state.scene.addEventListener(
      "pointercancel",
      handlePointerCancel,
      {
        passive: false
      }
    );

    state.scene.addEventListener(
      "click",
      handleSceneClickCapture,
      true
    );
  }

  function unbindPointerBridge() {
    if (
      !state.listenersBound ||
      !state.scene
    ) {
      return;
    }

    state.listenersBound = false;

    state.scene.removeEventListener(
      "pointerdown",
      handlePointerDown
    );

    state.scene.removeEventListener(
      "pointermove",
      handlePointerMove
    );

    state.scene.removeEventListener(
      "pointerup",
      handlePointerUp
    );

    state.scene.removeEventListener(
      "pointercancel",
      handlePointerCancel
    );

    state.scene.removeEventListener(
      "click",
      handleSceneClickCapture,
      true
    );
  }

  function sortNodesForDraw(nodes) {
    return nodes.sort(
      (a, b) =>
        a.transform.z -
        b.transform.z
    );
  }

  function render(now) {
    if (
      !state.running ||
      state.disposed
    ) {
      return;
    }

    const seconds =
      now * 0.001;

    const deltaTime =
      state.lastTime
        ? Math.min(
            QUALITY
              .maximumDeltaSeconds,

            Math.max(
              0,
              seconds -
              state.lastTime
            )
          )
        : 0.016;

    state.lastTime = seconds;
    state.time = seconds;

    try {
      state.frame =
        getControllerFrame();

      state.reducedMotion =
        Boolean(
          state.frame
            .reducedMotion
        );

      resize();

      syncQuaternionTargets(
        deltaTime
      );

      updateTargets();

      updateTransforms(
        deltaTime
      );

      const aspect =
        state.width /
        Math.max(
          1,
          state.height
        );

      state.view =
        lookAt4(
          state.camera.eye,
          state.camera.target,
          [0, 1, 0]
        );

      state.projection =
        perspective4(
          Math.PI /
          (
            aspect <
            QUALITY
              .mobileAspectThreshold
              ? 4.45
              : 4.85
          ),
          aspect,
          0.1,
          60
        );

      const gl =
        state.gl;

      gl.clearColor(
        0.015,
        0.018,
        0.034,
        0
      );

      gl.clear(
        gl.COLOR_BUFFER_BIT |
        gl.DEPTH_BUFFER_BIT
      );

      syncSemanticObjects();

      gl.useProgram(
        state.program
      );

      gl.uniform3f(
        state.uniforms
          .keyLightView,
        -0.42,
        -0.82,
        -0.68
      );

      gl.uniform3f(
        state.uniforms
          .fillLightView,
        0.72,
        -0.24,
        -0.54
      );

      gl.uniform3f(
        state.uniforms
          .rimLightView,
        0.08,
        0.46,
        1
      );

      gl.uniform3f(
        state.uniforms
          .ambientColor,
        0.10,
        0.12,
        0.18
      );

      let drawCalls = 0;

      const bloomDisabled =
        state.cssWidth <=
        QUALITY
          .bloomDisableWidthPx;

      const drawNodes =
        sortNodesForDraw(
          Array.from(
            state.registry.values()
          )
        );

      if (!bloomDisabled) {
        gl.depthMask(false);

        gl.blendFunc(
          gl.SRC_ALPHA,
          gl.ONE
        );

        drawNodes.forEach(
          node => {
            drawCalls +=
              drawNode(
                node,
                true
              );
          }
        );
      }

      gl.depthMask(true);

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );

      drawNodes.forEach(
        node => {
          drawCalls +=
            drawNode(
              node,
              false
            );
        }
      );

      const error =
        gl.getError();

      if (
        error !==
        gl.NO_ERROR
      ) {
        emitFailure(
          "ARCHCOIN_CRYSTALS_WEBGL_RENDER_FAILURE",
          {
            error
          }
        );

        return;
      }

      emitReceipt({
        status: "available",

        rendererInitialized: true,

        sceneProjection:
          state.sceneProjection,

        activeClusterWing:
          state.frame
            .activeClusterWing ||
          "",

        primaryWing:
          state.visualPrimaryWing,

        primaryRoom:
          state.frame
            .activeClusterWing
            ? state
                .visualPrimaryRooms
                .get(
                  state.frame
                    .activeClusterWing
                ) ||
              ""
            : "",

        glError: "NO_ERROR",

        drawCallsLastFrame:
          drawCalls
      });

      state.raf =
        requestAnimationFrame(
          render
        );
    } catch (error) {
      emitFailure(
        "ARCHCOIN_CRYSTALS_FRAME_FAILURE",
        {
          code:
            error &&
            error.code
              ? error.code
              : "",

          message:
            error &&
            error.message
              ? error.message
              : String(error)
        }
      );
    }
  }

  function hideAllSemanticNodes() {
    state.registry.forEach(
      hideSemanticNode
    );
  }

  function disposeResources() {
    if (state.disposed) {
      return;
    }

    state.disposed = true;
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );

      state.raf = 0;
    }

    if (
      state.pointer &&
      state.pointer
        .controllerGestureBegan
    ) {
      if (
        state.pointer
          .gestureScope ===
        GESTURE_SCOPES
          .CONSTELLATION
      ) {
        requestControllerOrbitCancel(
          "renderer-dispose"
        );
      } else {
        requestControllerClusterCancel(
          state.pointer.wing,
          "renderer-dispose"
        );
      }
    }

    state.pointer = null;

    clearGestureDatasets();
    unbindPointerBridge();
    unbindContextLifecycle();

    hideAllSemanticNodes();

    if (state.gl) {
      state.meshes.forEach(
        mesh => {
          state.gl.deleteBuffer(
            mesh.position
          );

          state.gl.deleteBuffer(
            mesh.normal
          );

          state.gl.deleteBuffer(
            mesh.color
          );
        }
      );

      if (state.program) {
        state.gl.deleteProgram(
          state.program
        );
      }
    }

    state.meshes.clear();
    state.registry.clear();

    state.clusterQuaternions
      .clear();

    state
      .clusterTargetQuaternions
      .clear();

    state.visualPrimaryRooms
      .clear();

    emitReceipt({
      status: "disposed",
      rendererInitialized: false,
      gestureActive: false,
      drawCallsLastFrame: 0
    });
  }

  function handleContextLost(event) {
    event.preventDefault();

    emitFailure(
      "WEBGL_CONTEXT_LOST"
    );
  }

  function handleContextRestored() {
    emitFailure(
      "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED"
    );
  }

  function bindContextLifecycle() {
    if (
      state.contextListenersBound ||
      !state.canvas
    ) {
      return;
    }

    state.contextListenersBound =
      true;

    state.canvas.addEventListener(
      "webglcontextlost",
      handleContextLost
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      handleContextRestored
    );
  }

  function unbindContextLifecycle() {
    if (
      !state.contextListenersBound ||
      !state.canvas
    ) {
      return;
    }

    state.contextListenersBound =
      false;

    state.canvas.removeEventListener(
      "webglcontextlost",
      handleContextLost
    );

    state.canvas.removeEventListener(
      "webglcontextrestored",
      handleContextRestored
    );
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-archcoin-root]"
      );

    invariant(
      state.root,
      "ARCHCOIN_ROOT_NOT_FOUND"
    );

    state.scene =
      qs(
        "[data-archcoin-scene]",
        state.root
      );

    invariant(
      state.scene,
      "ARCHCOIN_SCENE_NOT_FOUND"
    );

    state.mount =
      qs(
        "[data-archcoin-crystals-mount]",
        state.root
      );

    invariant(
      state.mount,
      "ARCHCOIN_CRYSTALS_MOUNT_NOT_FOUND"
    );

    state.semanticLayer =
      qs(
        "[data-archcoin-objects]",
        state.root
      );

    invariant(
      state.semanticLayer,
      "ARCHCOIN_SEMANTIC_LAYER_NOT_FOUND"
    );

    state.receiptOutput =
      qs(
        "[data-archcoin-crystals-receipt]",
        state.root
      );
  }

  function initializeOrientations() {
    state.frame =
      getControllerFrame();

    const constellationQuaternion =
      constellationQuaternionFromFrame(
        state.frame
      );

    state
      .constellationQuaternion =
      constellationQuaternion.slice();

    state
      .constellationTargetQuaternion =
      constellationQuaternion.slice();

    state.settledPrimaryWing =
      normalizeWing(
        state.frame.orbitFocus
      ) ||
      nearestPrimaryWing(
        constellationQuaternion
      );

    state.visualPrimaryWing =
      nearestPrimaryWing(
        constellationQuaternion
      );

    WINGS.forEach(
      wing => {
        const localQuaternion =
          clusterQuaternionFromFrame(
            state.frame,
            wing
          );

        state
          .clusterQuaternions
          .set(
            wing,
            localQuaternion.slice()
          );

        state
          .clusterTargetQuaternions
          .set(
            wing,
            localQuaternion.slice()
          );

        state
          .visualPrimaryRooms
          .set(
            wing,
            nearestPrimaryRoom(
              wing,
              localQuaternion
            )
          );
      }
    );

    updateTargets();
  }

  function getOrientationState() {
    const clusters = {};

    WINGS.forEach(
      wing => {
        const localQuaternion =
          (
            state
              .clusterQuaternions
              .get(wing) ||
            [0, 0, 0, 1]
          ).slice();

        clusters[wing] =
          Object.freeze({
            localQuaternion:
              Object.freeze(
                localQuaternion
              ),

            targetLocalQuaternion:
              Object.freeze(
                (
                  state
                    .clusterTargetQuaternions
                    .get(wing) ||
                  [0, 0, 0, 1]
                ).slice()
              ),

            effectiveVisualQuaternion:
              Object.freeze(
                effectiveClusterQuaternion(
                  localQuaternion
                )
              ),

            primaryRoom:
              state
                .visualPrimaryRooms
                .get(wing) ||
              ""
          });
      }
    );

    return Object.freeze({
      constellation:
        Object.freeze({
          quaternion:
            Object.freeze(
              state
                .constellationQuaternion
                .slice()
            ),

          targetQuaternion:
            Object.freeze(
              state
                .constellationTargetQuaternion
                .slice()
            ),

          primaryWing:
            state.visualPrimaryWing,

          settledPrimaryWing:
            state.settledPrimaryWing
        }),

      clusters:
        Object.freeze(
          clusters
        ),

      sceneProjection:
        state.sceneProjection,

      activeClusterWing:
        state.frame
          ? state.frame
              .activeClusterWing ||
            ""
          : "",

      roomVisualOrientationLaw:
        "CONSTELLATION_ORIENTATION * CLUSTER_LOCAL_ORIENTATION",

      gestureActive:
        Boolean(
          state.pointer &&
          state.pointer.dragging
        )
    });
  }

  function exposeApi() {
    globalThis
      .DGB_ARCHCOIN_CRYSTALS =
      Object.freeze({
        contract:
          CONTRACT,

        sphere:
          SPHERE,

        gesture:
          GESTURE,

        sceneProjections:
          SCENE_PROJECTIONS,

        receipt: () =>
          Object.freeze({
            ...RECEIPT
          }),

        getOrientation:
          getOrientationState,

        getSceneProjection:
          () =>
            state.sceneProjection,

        start: () => {
          if (
            !state.running &&
            !state.disposed &&
            state.gl &&
            state.program
          ) {
            state.running = true;
            state.lastTime = 0;

            state.raf =
              requestAnimationFrame(
                render
              );

            emitReceipt({
              status: "available"
            });
          }

          return state.running;
        },

        stop: () => {
          state.running = false;

          if (state.raf) {
            cancelAnimationFrame(
              state.raf
            );

            state.raf = 0;
          }

          emitReceipt({
            status: "stopped",
            gestureActive: false
          });

          return true;
        },

        dispose:
          disposeResources
      });
  }

  function initializeProgramLocations(
    gl
  ) {
    state.attribs =
      Object.freeze({
        position:
          gl.getAttribLocation(
            state.program,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            state.program,
            "aNormal"
          ),

        color:
          gl.getAttribLocation(
            state.program,
            "aColor"
          )
      });

    state.uniforms =
      Object.freeze({
        model:
          gl.getUniformLocation(
            state.program,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            state.program,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            state.program,
            "uProjection"
          ),

        viewNormalMatrix:
          gl.getUniformLocation(
            state.program,
            "uViewNormalMatrix"
          ),

        time:
          gl.getUniformLocation(
            state.program,
            "uTime"
          ),

        prominence:
          gl.getUniformLocation(
            state.program,
            "uProminence"
          ),

        specular:
          gl.getUniformLocation(
            state.program,
            "uSpecular"
          ),

        rim:
          gl.getUniformLocation(
            state.program,
            "uRim"
          ),

        emissive:
          gl.getUniformLocation(
            state.program,
            "uEmissive"
          ),

        alpha:
          gl.getUniformLocation(
            state.program,
            "uAlpha"
          ),

        sparkle:
          gl.getUniformLocation(
            state.program,
            "uSparkle"
          ),

        twinkle:
          gl.getUniformLocation(
            state.program,
            "uTwinkle"
          ),

        contrast:
          gl.getUniformLocation(
            state.program,
            "uContrast"
          ),

        haloStrength:
          gl.getUniformLocation(
            state.program,
            "uHaloStrength"
          ),

        saturation:
          gl.getUniformLocation(
            state.program,
            "uSaturation"
          ),

        haloPass:
          gl.getUniformLocation(
            state.program,
            "uHaloPass"
          ),

        haloExpansion:
          gl.getUniformLocation(
            state.program,
            "uHaloExpansion"
          ),

        keyLightView:
          gl.getUniformLocation(
            state.program,
            "uKeyLightView"
          ),

        fillLightView:
          gl.getUniformLocation(
            state.program,
            "uFillLightView"
          ),

        rimLightView:
          gl.getUniformLocation(
            state.program,
            "uRimLightView"
          ),

        ambientColor:
          gl.getUniformLocation(
            state.program,
            "uAmbientColor"
          )
      });
  }

  function initializeRootDatasets() {
    state.root.dataset
      .sphericalOrbitEnabled =
      "true";

    state.root.dataset
      .sphericalClustersEnabled =
      "true";

    state.root.dataset
      .orbitCoordinateSystem =
      SPHERE.coordinateSystem;

    state.root.dataset
      .orbitRepresentation =
      SPHERE
        .orientationRepresentation;

    state.root.dataset
      .archcoinCrystalsControllerAnchor =
      `${CONTRACT.controllerModuleId}@${CONTRACT.controllerModuleVersion}`;

    state.root.dataset
      .archcoinCrystalsProjectionContract =
      "CONSTELLATION_OR_CLUSTER_OR_HELD";

    state.root.dataset
      .archcoinCrystalsAdditiveCoRenderingAuthorized =
      "false";

    state.root.dataset
      .archcoinCrystalsGeneratedRoomProxyCount =
      "0";

    state.root.dataset
      .archcoinCrystalsProjectedSelectionEnabled =
      "false";

    state.root.dataset
      .archcoinCrystalsCompassLogicOwned =
      "false";

    state.root.dataset
      .archcoinCrystalsRoomVisualOrientationLaw =
      "CONSTELLATION_ORIENTATION * CLUSTER_LOCAL_ORIENTATION";
  }

  function init() {
    try {
      resolveDom();

      state.controller =
        requireController();

      exposeApi();

      state.canvas =
        createCanvas();

      const gl =
        getGL(
          state.canvas
        );

      invariant(
        gl,
        "WEBGL_CONTEXT_UNAVAILABLE"
      );

      state.gl = gl;

      bindContextLifecycle();

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

      state.program =
        createProgram(gl);

      initializeProgramLocations(
        gl
      );

      state.meshes =
        buildMeshes(gl);

      state.registry =
        buildRegistry();

      initializeOrientations();

      bindPointerBridge();

      initializeRootDatasets();

      state.running = true;

      emitReceipt({
        status: "available",

        rendererInitialized: true,

        controllerModuleId:
          state.controller.moduleId,

        controllerModuleVersion:
          state.controller
            .moduleVersion,

        cardinalCount: 4,
        roomCount: 16,

        canonicalSemanticRoomCount:
          canonicalRoomElements()
            .length,

        sceneProjection:
          state.sceneProjection,

        additiveCoRenderingAuthorized:
          false,

        generatedRoomProxyCount: 0,

        projectedSelectionEnabled:
          false,

        compassLogicOwned: false,

        glError: "NO_ERROR"
      });

      state.raf =
        requestAnimationFrame(
          render
        );
    } catch (error) {
      emitFailure(
        "ARCHCOIN_CRYSTALS_INIT_FAILURE",
        {
          code:
            error &&
            error.code
              ? error.code
              : "",

          message:
            error &&
            error.message
              ? error.message
              : String(error),

          details:
            error &&
            error.details
              ? error.details
              : null
        }
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

/*
ARCHCOIN_CRYSTALS_CONTROLLED_REPLACEMENT_RESULT_v1

Disposition:
CRYSTALS_CONTROLLED_REPLACEMENT_SOURCE_CANDIDATE

Controller anchor:
DGB_ARCHCOIN_CONTROLLER
6.0.0-controller-foundation-renewal

Source strategy:
RETAINED_MECHANICAL_CORE
+
DISCARDED_ARCHITECTURAL_SHELL

Retained:
- WebGL context creation
- shader compilation and linking
- GPU buffer creation
- page-local ARCHCOIN crystal mesh geometry
- matrix mathematics
- quaternion mathematics
- cardinal spherical placement
- cluster-local room placement
- constellation orientation
- cluster-local orientation
- constellation settlement
- cluster settlement
- depth sorting
- materials and lighting
- reduced-motion rendering
- context-loss reporting
- renderer lifecycle
- resource disposal
- controller orbit gesture requests
- controller cluster gesture requests
- synchronization of existing canonical semantic elements

Exclusive scene states:
- CONSTELLATION
- CLUSTER
- HELD

Exclusive projection law:
- frame.presentation.outerCardinalsActive
  renders cardinal nodes only

- frame.presentation.activeRoomCluster
  renders active-wing room nodes only

- frame.held
  renders no active navigation nodes

Activation law:
- existing [data-archcoin-coin]
  retains cardinal-selection authority

- existing [data-archcoin-room]
  retains room-selection authority

- crystals does not select either node type

Pointer law:
- semantic navigation control:
  normal semantic activation is preserved

- Compass, panel, or ordinary control:
  crystals does not capture

- empty scene:
  state-appropriate drag may begin

Removed:
- COMPASS_DECISION
- CONSTELLATION_WITH_CLUSTER
- cardinal-plus-cluster co-rendering
- CARDINAL_CLUSTER_CONTEXT
- generated room proxies
- proxy activation handlers
- projected selection inference
- projected cardinal hit testing
- projected room hit testing
- mixed cardinal-and-room hit resolution
- crystals-owned cardinal selection
- crystals-owned room selection
- destination-type reinterpretation
- restoration-field reinterpretation
- dataset-based controller-frame reconstruction
- Compass scene preservation
- Compass orientation compatibility surfaces
- Compass receipt assertions
- getConstellationParentOrientation()
- obsolete additive public API assertions

Geometric separation:
- createDiamondStarMesh()
  is page-local ARCHCOIN crystal geometry

- /assets/compass/upstream-compass.geometry.js
  is not consumed, modified, or reopened by this file

Other files modified:
NONE

Downstream files remain unchanged.
Runtime and visual acceptance remain pending.
*/
