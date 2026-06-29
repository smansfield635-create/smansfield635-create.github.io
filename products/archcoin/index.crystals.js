/* /products/archcoin/index.crystals.js
   ARCHCOIN
   Depth-layered crystals renderer replacement.

   Module:
   DGB_ARCHCOIN_CRYSTALS
   1.2.0-depth-layered-compass-occlusion

   Controller anchor:
   DGB_ARCHCOIN_CONTROLLER
   6.0.1-controller-presentation-and-native-home-corrections

   Rendering stack:
   1. rear crystal canvas
   2. fixed-center Compass
   3. front crystal canvas
   4. semantic controls

   Controlling corrections:
   - No Compass exclusion radius.
   - No forced center avoidance.
   - Cardinal and room crystals retain their unmodified spherical positions.
   - Visible crystals are classified by camera-space depth every frame.
   - Rear crystals render below the Compass.
   - Front crystals render above the Compass.
   - Existing canonical room controls remain attached to projected crystals.
   - Compact semantic controls do not blanket the Compass interaction surface.
   - The Compass remains an independent fixed-center sibling.
   - Existing cluster-exit gesture behavior is preserved.

   Forbidden:
   - COMPASS_CENTER_EXCLUSION
   - forced avoidance rings
   - generated room proxies
   - projected semantic hit inference
   - direct route navigation
   - Compass orientation inheritance
   - additive cardinal-plus-cluster presentation
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "ARCHCOIN_CRYSTALS_CONTROLLER_V6_DEPTH_LAYERED_RENDERER_v1",

    version:
      "1.2.0-depth-layered-compass-occlusion",

    file:
      "/products/archcoin/index.crystals.js",

    controllerModuleId:
      "DGB_ARCHCOIN_CONTROLLER",

    controllerModuleVersion:
      "6.0.1-controller-presentation-and-native-home-corrections",

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
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

    ROOM:
      "room"
  });

  const SCENE_PROJECTIONS = Object.freeze({
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER:
      "CLUSTER",

    HELD:
      "HELD"
  });

  const DEPTH_LAYERS = Object.freeze({
    REAR:
      "REAR",

    FRONT:
      "FRONT"
  });

  const GESTURE_SCOPES = Object.freeze({
    NONE:
      "",

    CONSTELLATION:
      "constellation",

    CLUSTER:
      "cluster"
  });

  const POINTER_TERRITORIES = Object.freeze({
    BLOCKED_CONTROL:
      "BLOCKED_CONTROL",

    SEMANTIC_NAVIGATION_CONTROL:
      "SEMANTIC_NAVIGATION_CONTROL",

    EMPTY_SCENE:
      "EMPTY_SCENE",

    OUTSIDE_SCENE:
      "OUTSIDE_SCENE"
  });

  const GESTURE_TYPES = Object.freeze({
    IDLE:
      "IDLE",

    POINTER_DOWN:
      "POINTER_DOWN",

    CONSTELLATION_DRAG:
      "CONSTELLATION_DRAG",

    CONSTELLATION_SETTLE:
      "CONSTELLATION_SETTLE",

    CLUSTER_DRAG:
      "CLUSTER_DRAG",

    CLUSTER_SETTLE:
      "CLUSTER_SETTLE",

    CLUSTER_EXIT:
      "CLUSTER_EXIT",

    CANCELLED:
      "CANCELLED",

    BLOCKED:
      "BLOCKED"
  });

  const GESTURE = Object.freeze({
    dragDeadZonePx:
      6,

    radiansPerViewport:
      Math.PI * 1.12,

    settleSpeed:
      7.4,

    suppressClickMs:
      520,

    sampleWindowMs:
      140,

    maximumSamples:
      18,

    clusterExitMinimumDistancePx:
      78,

    clusterExitMinimumViewportFraction:
      0.14,

    clusterExitMaximumDurationMs:
      680,

    clusterExitMinimumAverageVelocity:
      0.16,

    clusterExitMinimumReleaseVelocity:
      0.12,

    clusterExitDirectionDominance:
      1.35,

    clusterExitMinimumOutwardAlignment:
      0.58
  });

  const SPHERE = Object.freeze({
    coordinateSystem:
      "RIGHT_HANDED_EUCLIDEAN_XYZ",

    orientationRepresentation:
      "UNIT_QUATERNION",

    constellation:
      Object.freeze({
        horizontalRadius:
          1.46,

        verticalRadius:
          1.28,

        depthRadius:
          1.14,

        primaryAnchor:
          Object.freeze([
            0,
            0.78,
            0.625
          ]),

        vectors:
          Object.freeze({
            north:
              Object.freeze([
                0,
                1,
                0
              ]),

            east:
              Object.freeze([
                1,
                0,
                0
              ]),

            south:
              Object.freeze([
                0,
                -1,
                0
              ]),

            west:
              Object.freeze([
                -1,
                0,
                0
              ])
          })
      }),

    cluster:
      Object.freeze({
        horizontalRadius:
          1.04,

        verticalRadius:
          0.90,

        depthRadius:
          0.84,

        centerRadius:
          0.26,

        primaryAnchor:
          Object.freeze([
            0,
            0.70,
            0.714
          ]),

        latitudeAmplitude:
          0.48,

        latitudeFrequency:
          1.73
      })
  });

  const ARCHCOIN_WING_TO_COIN = Object.freeze({
    north:
      "contract",

    east:
      "receivable",

    south:
      "payable",

    west:
      "allocation"
  });

  const PALETTE = Object.freeze({
    north:
      Object.freeze([
        0.79,
        0.84,
        1.0
      ]),

    east:
      Object.freeze([
        0.48,
        0.88,
        0.96
      ]),

    south:
      Object.freeze([
        1.0,
        0.73,
        0.42
      ]),

    west:
      Object.freeze([
        0.98,
        0.58,
        0.40
      ]),

    roomNorth:
      Object.freeze([
        0.72,
        0.80,
        1.0
      ]),

    roomEast:
      Object.freeze([
        0.44,
        0.82,
        0.92
      ]),

    roomSouth:
      Object.freeze([
        0.98,
        0.68,
        0.38
      ]),

    roomWest:
      Object.freeze([
        0.94,
        0.52,
        0.34
      ])
  });

  const MATERIALS = Object.freeze({
    CARDINAL_IDLE:
      Object.freeze({
        specular:
          1.12,

        rim:
          0.98,

        emissive:
          0.14,

        alpha:
          0.92,

        sparkle:
          0.18,

        halo:
          0.62,

        contrast:
          1.14
      }),

    CARDINAL_FOCUSED:
      Object.freeze({
        specular:
          1.38,

        rim:
          1.18,

        emissive:
          0.19,

        alpha:
          0.96,

        sparkle:
          0.24,

        halo:
          0.90,

        contrast:
          1.22
      }),

    ROOM_IDLE:
      Object.freeze({
        specular:
          1.02,

        rim:
          0.88,

        emissive:
          0.12,

        alpha:
          0.88,

        sparkle:
          0.14,

        halo:
          0.44,

        contrast:
          1.08
      }),

    ROOM_PRIMARY:
      Object.freeze({
        specular:
          1.18,

        rim:
          1.02,

        emissive:
          0.16,

        alpha:
          0.92,

        sparkle:
          0.18,

        halo:
          0.62,

        contrast:
          1.14
      }),

    ROOM_SELECTED:
      Object.freeze({
        specular:
          1.26,

        rim:
          1.08,

        emissive:
          0.18,

        alpha:
          0.94,

        sparkle:
          0.22,

        halo:
          0.72,

        contrast:
          1.18
      })
  });

  const QUALITY = Object.freeze({
    normalDevicePixelRatioCap:
      2,

    lowPowerDevicePixelRatioCap:
      1.5,

    lowPowerHardwareConcurrencyThreshold:
      4,

    mobileAspectThreshold:
      0.82,

    bloomDisableWidthPx:
      420,

    cardinalSegments:
      8,

    roomSegments:
      6,

    cardinalScale:
      0.96,

    focusedCardinalScale:
      1.28,

    roomScale:
      0.80,

    primaryRoomScale:
      1.02,

    selectedRoomScale:
      1.08,

    maxYaw:
      0.20,

    maxPitch:
      0.13,

    maximumDeltaSeconds:
      0.05,

    normalEpsilon:
      1e-7,

    depthLayerEpsilon:
      0.025,

    semanticRoomMaximumWidthPx:
      78,

    semanticRoomMaximumHeightPx:
      44,

    semanticRoomMinimumScale:
      0.54,

    semanticRoomMaximumScale:
      0.82,

    semanticCompassClearancePx:
      6
  });

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    contractVersion:
      CONTRACT.version,

    status:
      "pending",

    controllerModuleId:
      "",

    controllerModuleVersion:
      "",

    rendererInitialized:
      false,

    sceneProjection:
      SCENE_PROJECTIONS.HELD,

    cardinalCount:
      0,

    roomCount:
      0,

    canonicalSemanticRoomCount:
      0,

    relocatedCanonicalRoomCount:
      0,

    canonicalRoomControlsRelocated:
      false,

    rearCanvasCreated:
      false,

    frontCanvasCreated:
      false,

    rearDrawCallsLastFrame:
      0,

    frontDrawCallsLastFrame:
      0,

    rearVisibleObjectCount:
      0,

    frontVisibleObjectCount:
      0,

    activeClusterWing:
      "",

    primaryWing:
      "north",

    primaryRoom:
      "",

    gestureScope:
      GESTURE_SCOPES.NONE,

    gestureActive:
      false,

    lastPointerTerritory:
      "",

    lastGestureType:
      GESTURE_TYPES.IDLE,

    lastClusterExitQualified:
      false,

    reducedMotion:
      false,

    outerCardinalsRendered:
      false,

    activeRoomClusterRendered:
      false,

    additiveCoRenderingAuthorized:
      false,

    generatedRoomProxyCount:
      0,

    projectedSelectionEnabled:
      false,

    compassCenterExclusionEnabled:
      false,

    depthBasedCompassOcclusionEnabled:
      true,

    semanticCompassPointerProtection:
      true,

    roomVisualOrientationLaw:
      "CONSTELLATION_ORIENTATION * CLUSTER_LOCAL_ORIENTATION",

    compassLogicOwned:
      false,

    rearGlError:
      "not-checked",

    frontGlError:
      "not-checked",

    visualPassClaimed:
      false
  };

  const state = {
    root:
      null,

    scene:
      null,

    field:
      null,

    crystalsMount:
      null,

    semanticLayer:
      null,

    compassMount:
      null,

    compassControl:
      null,

    receiptOutput:
      null,

    controller:
      null,

    renderLayers:
      new Map(),

    registry:
      new Map(),

    canonicalRoomElements:
      [],

    relocatedRoomElements:
      [],

    width:
      1,

    height:
      1,

    cssWidth:
      1,

    cssHeight:
      1,

    pixelRatio:
      1,

    frame:
      null,

    sceneProjection:
      SCENE_PROJECTIONS.HELD,

    constellationQuaternion:
      [
        0,
        0,
        0,
        1
      ],

    constellationTargetQuaternion:
      [
        0,
        0,
        0,
        1
      ],

    visualPrimaryWing:
      "north",

    settledPrimaryWing:
      "north",

    clusterQuaternions:
      new Map(),

    clusterTargetQuaternions:
      new Map(),

    visualPrimaryRooms:
      new Map(),

    view:
      null,

    projection:
      null,

    camera:
      {
        eye:
          [
            0,
            0.78,
            6.45
          ],

        target:
          [
            0,
            0,
            0
          ],

        nextEye:
          [
            0,
            0.78,
            6.45
          ],

        nextTarget:
          [
            0,
            0,
            0
          ]
      },

    time:
      0,

    lastTime:
      0,

    raf:
      0,

    running:
      false,

    disposed:
      false,

    reducedMotion:
      false,

    pointer:
      null,

    suppressClickUntil:
      0,

    listenersBound:
      false
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

      vColor =
        aColor;

      vViewPosition =
        viewPosition.xyz;

      vWorldPosition =
        worldPosition.xyz;

      vHaloPass =
        uHaloPass;

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
        normalize(
          -uKeyLightView
        );

      vec3 fillDirection =
        normalize(
          -uFillLightView
        );

      vec3 rimDirection =
        normalize(
          -uRimLightView
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

    error.code =
      code;

    error.details =
      details;

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

    return Number.isFinite(
      number
    )
      ? number
      : fallback;
  }

  function normalizeWing(value) {
    const wing =
      String(value || "")
        .trim()
        .toLowerCase();

    return WINGS.includes(
      wing
    )
      ? wing
      : "";
  }

  function normalizeRoomId(value) {
    return String(
      value || ""
    ).trim();
  }

  function emitReceipt(extra = {}) {
    const rearLayer =
      state.renderLayers.get(
        DEPTH_LAYERS.REAR
      );

    const frontLayer =
      state.renderLayers.get(
        DEPTH_LAYERS.FRONT
      );

    Object.assign(
      RECEIPT,
      {
        controllerModuleId:
          state.controller
            ? state.controller
                .moduleId
            : "",

        controllerModuleVersion:
          state.controller
            ? state.controller
                .moduleVersion
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
            ? state
                .visualPrimaryRooms
                .get(
                  state.frame
                    .activeClusterWing
                ) ||
              ""
            : "",

        gestureScope:
          state.pointer
            ? state.pointer
                .gestureScope
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

        compassCenterExclusionEnabled:
          false,

        depthBasedCompassOcclusionEnabled:
          true,

        canonicalRoomControlsRelocated:
          state
            .relocatedRoomElements
            .length ===
          16,

        relocatedCanonicalRoomCount:
          state
            .relocatedRoomElements
            .length,

        rearCanvasCreated:
          Boolean(
            rearLayer &&
            rearLayer.canvas
          ),

        frontCanvasCreated:
          Boolean(
            frontLayer &&
            frontLayer.canvas
          ),

        compassLogicOwned:
          false,

        visualPassClaimed:
          false
      },
      extra
    );

    const serialized =
      JSON.stringify(
        RECEIPT
      );

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
        RECEIPT
          .outerCardinalsRendered
          ? "true"
          : "false";

      state.root.dataset
        .archcoinCrystalsActiveRoomClusterRendered =
        RECEIPT
          .activeRoomClusterRendered
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
        .archcoinCompassCenterExclusionEnabled =
        "false";

      state.root.dataset
        .archcoinDepthBasedCompassOcclusionEnabled =
        "true";

      state.root.dataset
        .archcoinCanonicalRoomControlsRelocated =
        RECEIPT
          .canonicalRoomControlsRelocated
          ? "true"
          : "false";

      state.root.dataset
        .archcoinRelocatedCanonicalRoomCount =
        String(
          RECEIPT
            .relocatedCanonicalRoomCount
        );

      state.root.dataset
        .visualPassClaimed =
        "false";
    }

    for (
      const layer
      of state.renderLayers.values()
    ) {
      if (!layer.canvas) {
        continue;
      }

      layer.canvas.dataset
        .archcoinCrystalsReceipt =
        serialized;

      layer.canvas.dataset
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

      state.receiptOutput
        .textContent =
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
    state.running =
      false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );

      state.raf =
        0;
    }

    emitReceipt({
      status:
        "held",

      rendererInitialized:
        false,

      rearGlError:
        String(
          reason ||
          "UNKNOWN_ERROR"
        ),

      frontGlError:
        String(
          reason ||
          "UNKNOWN_ERROR"
        )
    });

    globalThis.dispatchEvent(
      new CustomEvent(
        "ARCHCOIN_CRYSTALS_RENDER_FAILURE",
        {
          detail:
            Object.freeze({
              reason:
                String(
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
    fallback = [
      0,
      0,
      1
    ]
  ) {
    const length =
      vectorLength(
        vector
      );

    if (
      !Number.isFinite(
        length
      ) ||
      length <=
        1e-12
    ) {
      return fallback.slice();
    }

    return [
      vector[0] /
        length,

      vector[1] /
        length,

      vector[2] /
        length
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
    fallback = [
      0,
      0,
      0,
      1
    ]
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(
        value
      )
        ? Array.from(value)
        : [];

    if (
      source.length !==
      4
    ) {
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
      !Number.isFinite(
        length
      ) ||
      length <=
        1e-12
    ) {
      return fallback.slice();
    }

    return quaternion.map(
      component =>
        component /
        length
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
      normalizeVector(
        axis
      );

    const half =
      angle *
      0.5;

    const sine =
      Math.sin(
        half
      );

    return quaternionNormalize([
      normalizedAxis[0] *
        sine,

      normalizedAxis[1] *
        sine,

      normalizedAxis[2] *
        sine,

      Math.cos(
        half
      )
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
        dot(
          from,
          to
        ),
        -1,
        1
      );

    if (
      cosine >
      0.999999
    ) {
      return [
        0,
        0,
        0,
        1
      ];
    }

    if (
      cosine <
      -0.999999
    ) {
      let axis =
        cross(
          [
            1,
            0,
            0
          ],
          from
        );

      if (
        vectorLength(
          axis
        ) <
        1e-6
      ) {
        axis =
          cross(
            [
              0,
              1,
              0
            ],
            from
          );
      }

      return quaternionFromAxisAngle(
        normalizeVector(
          axis
        ),
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
      1 +
      cosine
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

    if (
      cosine <
      0
    ) {
      to = [
        -to[0],
        -to[1],
        -to[2],
        -to[3]
      ];

      cosine =
        -cosine;
    }

    const interpolation =
      clamp(
        amount,
        0,
        1
      );

    if (
      cosine >
      0.9995
    ) {
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
      Math.sin(
        theta
      );

    if (
      Math.abs(
        sineTheta
      ) <=
      1e-12
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

  function multiply4(
    a,
    b
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

    matrix[12] =
      x;

    matrix[13] =
      y;

    matrix[14] =
      z;

    return matrix;
  }

  function scale4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[0] =
      x;

    matrix[5] =
      y;

    matrix[10] =
      z;

    return matrix;
  }

  function rotateX4(angle) {
    const cosine =
      Math.cos(
        angle
      );

    const sine =
      Math.sin(
        angle
      );

    return [
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateY4(angle) {
    const cosine =
      Math.cos(
        angle
      );

    const sine =
      Math.sin(
        angle
      );

    return [
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateZ4(angle) {
    const cosine =
      Math.cos(
        angle
      );

    const sine =
      Math.sin(
        angle
      );

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
        fieldOfView /
        2
      );

    const range =
      1 /
      (
        near -
        far
      );

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
      (
        far +
        near
      ) *
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
        [
          1,
          0,
          0
        ]
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
      ) <=
        QUALITY.normalEpsilon
    ) {
      return [
        a00, a10, a20,
        a01, a11, a21,
        a02, a12, a22
      ];
    }

    determinant =
      1 /
      determinant;

    const inverse = [
      b01 *
        determinant,

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

      b11 *
        determinant,

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

      b21 *
        determinant,

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

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(
        type
      );

    invariant(
      shader,
      "ARCHCOIN_SHADER_CREATION_FAILED"
    );

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(
      shader
    );

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

      gl.deleteShader(
        shader
      );

      const error =
        new Error(
          information
        );

      error.code =
        "ARCHCOIN_SHADER_COMPILE_FAILED";

      throw error;
    }

    return shader;
  }

  function createProgram(gl) {
    const vertexShader =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragmentShader =
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
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.linkProgram(
      program
    );

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
      const information =
        gl.getProgramInfoLog(
          program
        ) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(
        program
      );

      const error =
        new Error(
          information
        );

      error.code =
        "ARCHCOIN_PROGRAM_LINK_FAILED";

      throw error;
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
      location >=
        0,
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
      options.points ||
      8;

    const radius =
      options.radius ||
      0.62;

    const inner =
      options.inner ||
      radius *
      0.46;

    const depth =
      options.depth ||
      0.42;

    const crown =
      options.crown ||
      0.22;

    const color =
      options.color ||
      PALETTE.north;

    const warmth =
      options.warmth ||
      0;

    const vertices = [];
    const faces = [];

    function add(point) {
      vertices.push(
        point
      );

      return (
        vertices.length -
        1
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
        depth +
        crown
      ]);

    const rearCrown =
      add([
        0,
        0,
        -depth -
        crown *
        0.72
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
        index %
        2 ===
        0;

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
        Math.PI /
        2;

      const activeRadius =
        isPoint
          ? radius
          : inner;

      const yScale =
        0.78;

      const ridge =
        isPoint
          ? 0.05
          : -0.02;

      outer.push(
        add([
          Math.cos(
            angle
          ) *
          activeRadius,

          Math.sin(
            angle
          ) *
          activeRadius *
          yScale,

          ridge
        ])
      );

      innerRing.push(
        add([
          Math.cos(
            angle
          ) *
          activeRadius *
          0.38,

          Math.sin(
            angle
          ) *
          activeRadius *
          yScale *
          0.38,

          depth *
          0.14
        ])
      );

      frontBevel.push(
        add([
          Math.cos(
            angle
          ) *
          activeRadius *
          0.72,

          Math.sin(
            angle
          ) *
          activeRadius *
          yScale *
          0.72,

          depth *
          0.52
        ])
      );

      rearBevel.push(
        add([
          Math.cos(
            angle
          ) *
          activeRadius *
          0.68,

          Math.sin(
            angle
          ) *
          activeRadius *
          yScale *
          0.68,

          -depth *
          0.48
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
            faceIndex %
            7
          ) *
          0.034;

        const sparkleLift =
          faceIndex %
          5 ===
          0
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
        positions.length /
        3
    });
  }

  function roomColorForWing(wing) {
    if (
      wing ===
      "north"
    ) {
      return PALETTE.roomNorth;
    }

    if (
      wing ===
      "east"
    ) {
      return PALETTE.roomEast;
    }

    if (
      wing ===
      "south"
    ) {
      return PALETTE.roomSouth;
    }

    return PALETTE.roomWest;
  }

  function createCpuMeshes() {
    const meshes =
      new Map();

    WINGS.forEach(
      wing => {
        const warm =
          wing ===
            "south" ||
          wing ===
            "west";

        meshes.set(
          `cardinal-${wing}`,
          createDiamondStarMesh({
            points:
              QUALITY
                .cardinalSegments,

            radius:
              0.72,

            inner:
              0.30,

            depth:
              0.42,

            crown:
              0.20,

            color:
              PALETTE[wing],

            warmth:
              warm
                ? 0.10
                : 0.02
          })
        );

        meshes.set(
          `room-${wing}`,
          createDiamondStarMesh({
            points:
              QUALITY
                .roomSegments,

            radius:
              0.42,

            inner:
              0.20,

            depth:
              0.25,

            crown:
              0.10,

            color:
              roomColorForWing(
                wing
              ),

            warmth:
              warm
                ? 0.08
                : 0.02
          })
        );
      }
    );

    return meshes;
  }

  function createCanvas(
    layerId,
    zIndex
  ) {
    const selector =
      `canvas[data-archcoin-crystals-layer="${layerId.toLowerCase()}"]`;

    const existing =
      qs(
        selector,
        state.field
      );

    const canvas =
      existing ||
      document.createElement(
        "canvas"
      );

    canvas.dataset
      .archcoinCrystalsCanvas =
      "true";

    canvas.dataset
      .archcoinCrystalsLayer =
      layerId.toLowerCase();

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

    canvas.style.zIndex =
      String(
        zIndex
      );

    canvas.style.contain =
      "strict";

    if (!existing) {
      state.field.appendChild(
        canvas
      );
    }

    return canvas;
  }

  function getGL(canvas) {
    return canvas.getContext(
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
  }

  function createGpuMesh(
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

  function createProgramLocations(
    gl,
    program
  ) {
    return Object.freeze({
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

          viewNormalMatrix:
            gl.getUniformLocation(
              program,
              "uViewNormalMatrix"
            ),

          time:
            gl.getUniformLocation(
              program,
              "uTime"
            ),

          prominence:
            gl.getUniformLocation(
              program,
              "uProminence"
            ),

          specular:
            gl.getUniformLocation(
              program,
              "uSpecular"
            ),

          rim:
            gl.getUniformLocation(
              program,
              "uRim"
            ),

          emissive:
            gl.getUniformLocation(
              program,
              "uEmissive"
            ),

          alpha:
            gl.getUniformLocation(
              program,
              "uAlpha"
            ),

          sparkle:
            gl.getUniformLocation(
              program,
              "uSparkle"
            ),

          twinkle:
            gl.getUniformLocation(
              program,
              "uTwinkle"
            ),

          contrast:
            gl.getUniformLocation(
              program,
              "uContrast"
            ),

          haloStrength:
            gl.getUniformLocation(
              program,
              "uHaloStrength"
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
            ),

          keyLightView:
            gl.getUniformLocation(
              program,
              "uKeyLightView"
            ),

          fillLightView:
            gl.getUniformLocation(
              program,
              "uFillLightView"
            ),

          rimLightView:
            gl.getUniformLocation(
              program,
              "uRimLightView"
            ),

          ambientColor:
            gl.getUniformLocation(
              program,
              "uAmbientColor"
            )
        })
    });
  }

  function createRenderLayer(
    layerId,
    zIndex,
    cpuMeshes
  ) {
    const canvas =
      createCanvas(
        layerId,
        zIndex
      );

    const gl =
      getGL(
        canvas
      );

    invariant(
      gl,
      `ARCHCOIN_${layerId}_WEBGL_CONTEXT_UNAVAILABLE`
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
      createProgram(
        gl
      );

    const locations =
      createProgramLocations(
        gl,
        program
      );

    const meshes =
      new Map();

    for (
      const [key, cpuMesh]
      of cpuMeshes.entries()
    ) {
      meshes.set(
        key,
        createGpuMesh(
          gl,
          cpuMesh
        )
      );
    }

    const layer = {
      id:
        layerId,

      canvas,

      gl,

      program,

      attribs:
        locations.attribs,

      uniforms:
        locations.uniforms,

      meshes,

      contextLost:
        false,

      contextListeners:
        []
    };

    bindLayerContextLifecycle(
      layer
    );

    return layer;
  }

  function bindLayerContextLifecycle(layer) {
    const onContextLost =
      event => {
        event.preventDefault();

        layer.contextLost =
          true;

        emitFailure(
          `ARCHCOIN_${layer.id}_WEBGL_CONTEXT_LOST`
        );
      };

    const onContextRestored =
      () => {
        emitFailure(
          `ARCHCOIN_${layer.id}_WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED`
        );
      };

    layer.canvas.addEventListener(
      "webglcontextlost",
      onContextLost
    );

    layer.canvas.addEventListener(
      "webglcontextrestored",
      onContextRestored
    );

    layer.contextListeners.push(
      {
        type:
          "webglcontextlost",

        listener:
          onContextLost
      },

      {
        type:
          "webglcontextrestored",

        listener:
          onContextRestored
      }
    );
  }

  function destroyRenderLayer(layer) {
    if (!layer) {
      return;
    }

    for (
      const record
      of layer.contextListeners
    ) {
      layer.canvas.removeEventListener(
        record.type,
        record.listener
      );
    }

    layer.contextListeners =
      [];

    for (
      const mesh
      of layer.meshes.values()
    ) {
      layer.gl.deleteBuffer(
        mesh.position
      );

      layer.gl.deleteBuffer(
        mesh.normal
      );

      layer.gl.deleteBuffer(
        mesh.color
      );
    }

    layer.meshes.clear();

    if (layer.program) {
      layer.gl.deleteProgram(
        layer.program
      );
    }

    if (
      layer.canvas &&
      layer.canvas.parentNode
    ) {
      layer.canvas.parentNode
        .removeChild(
          layer.canvas
        );
    }
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
      Math.PI /
      2;

    const latitude =
      Math.sin(
        (
          index +
          0.5
        ) *
        SPHERE.cluster
          .latitudeFrequency
      ) *
      SPHERE.cluster
        .latitudeAmplitude;

    const cosineLatitude =
      Math.cos(
        latitude
      );

    return normalizeVector([
      Math.cos(
        longitude
      ) *
      cosineLatitude,

      Math.sin(
        latitude
      ),

      Math.sin(
        longitude
      ) *
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

      visible:
        false,

      depthLayer:
        DEPTH_LAYERS.REAR,

      previousDepthLayer:
        DEPTH_LAYERS.REAR,

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

      depthScore:
        0,

      primaryScore:
        0,

      cameraDepth:
        -Infinity,

      transform:
        {
          x:
            0,

          y:
            0,

          z:
            0,

          rx:
            0,

          ry:
            0,

          rz:
            0,

          sx:
            1,

          sy:
            1,

          sz:
            1,

          prominence:
            0,

          halo:
            0,

          rotationSpeed:
            0.12,

          float:
            0
        },

      target:
        {
          x:
            0,

          y:
            0,

          z:
            -1,

          sx:
            0.5,

          sy:
            0.5,

          sz:
            0.5,

          prominence:
            0,

          halo:
            0,

          rotationSpeed:
            0.06,

          float:
            0
        }
    };
  }

  function canonicalRoomElements() {
    return qsa(
      "[data-archcoin-room]",
      state.root
    );
  }

  function relocateCanonicalRoomControls() {
    const controls =
      canonicalRoomElements();

    invariant(
      controls.length ===
        16,
      "ARCHCOIN_CANONICAL_ROOM_RELOCATION_COUNT_INVALID",
      {
        expected:
          16,

        actual:
          controls.length
      }
    );

    const roomIds =
      new Set();

    controls.forEach(
      element => {
        const roomId =
          normalizeRoomId(
            element.dataset
              .roomId
          );

        invariant(
          roomId,
          "ARCHCOIN_RELOCATED_ROOM_ID_REQUIRED"
        );

        invariant(
          !roomIds.has(
            roomId
          ),
          `ARCHCOIN_RELOCATED_ROOM_ID_DUPLICATE:${roomId}`
        );

        roomIds.add(
          roomId
        );

        state.semanticLayer
          .appendChild(
            element
          );

        element.dataset
          .archcoinCanonicalRoomControl =
          "true";

        element.dataset
          .archcoinRelocatedToSemanticLayer =
          "true";

        element.style.position =
          "absolute";

        element.style.left =
          "50%";

        element.style.top =
          "50%";

        element.style.right =
          "auto";

        element.style.bottom =
          "auto";

        element.style.width =
          "max-content";

        element.style.maxWidth =
          `${QUALITY.semanticRoomMaximumWidthPx}px`;

        element.style.minWidth =
          "0";

        element.style.maxHeight =
          `${QUALITY.semanticRoomMaximumHeightPx}px`;

        element.style.padding =
          "0.28rem 0.42rem";

        element.style.lineHeight =
          "1.08";

        element.style.whiteSpace =
          "normal";

        element.style.textAlign =
          "center";

        element.style.overflow =
          "hidden";

        element.style.textOverflow =
          "ellipsis";

        element.style.opacity =
          "0";

        element.style.pointerEvents =
          "none";

        element.style.transform =
          "translate(-50%, -50%) scale(0.5)";

        element.style.transformOrigin =
          "center";

        element.style.contain =
          "layout paint style";

        element.setAttribute(
          "aria-hidden",
          "true"
        );

        element.tabIndex =
          -1;
      }
    );

    state.canonicalRoomElements =
      controls.slice();

    state.relocatedRoomElements =
      controls.filter(
        element =>
          element.parentElement ===
          state.semanticLayer
      );

    invariant(
      state.relocatedRoomElements
        .length ===
        16,
      "ARCHCOIN_CANONICAL_ROOM_RELOCATION_FAILED",
      {
        expected:
          16,

        actual:
          state
            .relocatedRoomElements
            .length
      }
    );

    state.semanticLayer.style.zIndex =
      "4";

    state.semanticLayer.dataset
      .archcoinCanonicalRoomControlsRelocated =
      "true";

    state.semanticLayer.dataset
      .archcoinCanonicalRoomControlCount =
      "16";
  }

  function buildRegistry() {
    const registry =
      new Map();

    const roomElements =
      canonicalRoomElements();

    invariant(
      roomElements.length ===
        16,
      "ARCHCOIN_CANONICAL_ROOM_DECLARATION_COUNT_INVALID"
    );

    WINGS.forEach(
      (
        wing,
        wingIndex
      ) => {
        const coinElement =
          qs(
            `[data-archcoin-coin][data-wing="${wing}"]`,
            state.root
          );

        invariant(
          coinElement,
          `ARCHCOIN_COIN_SEMANTIC_NOT_FOUND:${wing}`
        );

        registry.set(
          wing,
          makeNode({
            id:
              wing,

            type:
              NODE_TYPES.CARDINAL,

            wing,

            label:
              coinElement.dataset
                .coinLabel ||
              coinElement.dataset
                .label ||
              ARCHCOIN_WING_TO_COIN[
                wing
              ],

            short:
              (
                coinElement.querySelector(
                  "span:last-child"
                ) ||
                {}
              ).textContent ||
              "",

            semanticElement:
              coinElement,

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

        const wingRooms =
          roomElements.filter(
            element =>
              normalizeWing(
                element.dataset
                  .wing
              ) ===
              wing
          );

        invariant(
          wingRooms.length ===
            4,
          `ARCHCOIN_WING_ROOM_COUNT_INVALID:${wing}`
        );

        wingRooms.forEach(
          (
            element,
            roomIndex
          ) => {
            const id =
              normalizeRoomId(
                element.dataset
                  .roomId
              );

            invariant(
              id,
              `ARCHCOIN_ROOM_ID_MISSING:${wing}:${roomIndex}`
            );

            invariant(
              !registry.has(
                id
              ),
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
                  wingRooms.length,

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
      cardinalCount ===
        4,
      "ARCHCOIN_CARDINAL_COUNT_INVALID"
    );

    invariant(
      roomCount ===
        16,
      "ARCHCOIN_ROOM_COUNT_INVALID"
    );

    RECEIPT.cardinalCount =
      cardinalCount;

    RECEIPT.roomCount =
      roomCount;

    RECEIPT
      .canonicalSemanticRoomCount =
      roomElements.length;

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
      "ARCHCOIN_CONTROLLER_MODULE_ID_INVALID"
    );

    invariant(
      controller.moduleVersion ===
        CONTRACT
          .controllerModuleVersion,
      "ARCHCOIN_CONTROLLER_MODULE_VERSION_INVALID",
      {
        expected:
          CONTRACT
            .controllerModuleVersion,

        actual:
          controller.moduleVersion
      }
    );

    [
      "getFrameState",
      "beginOrbitGesture",
      "requestOrbitPreview",
      "requestOrbitCommit",
      "requestOrbitCancel",
      "beginClusterGesture",
      "requestClusterPreview",
      "requestClusterCommit",
      "requestClusterCancel",
      "requestReturnToConstellation"
    ].forEach(
      surface => {
        invariant(
          typeof controller[
            surface
          ] ===
            "function",
          `ARCHCOIN_CONTROLLER_SURFACE_REQUIRED:${surface}`
        );
      }
    );

    return controller;
  }

  function getControllerFrame() {
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
      typeof frame
        .presentation ===
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
      [
        0,
        0,
        0,
        1
      ];

    if (
      frame &&
      frame.cluster &&
      frame.cluster.wing ===
        wing &&
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
    localQuaternion
  ) {
    return quaternionMultiply(
      state
        .constellationQuaternion,
      localQuaternion
    );
  }

  function rotatedRoomUnitVector(
    node,
    localQuaternion
  ) {
    return normalizeVector(
      quaternionRotateVector(
        effectiveClusterQuaternion(
          localQuaternion
        ),
        node.sphereVector
      )
    );
  }

  function rotatedRoomLocalUnitVector(
    node,
    localQuaternion
  ) {
    return normalizeVector(
      quaternionRotateVector(
        localQuaternion,
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
        const score =
          dot(
            rotatedCardinalUnitVector(
              wing,
              quaternion
            ),
            anchor
          );

        if (
          score >
          bestScore
        ) {
          bestScore =
            score;

          bestWing =
            wing;
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
        node.wing ===
          wing
    );
  }

  function nearestPrimaryRoom(
    wing,
    localQuaternion
  ) {
    const anchor =
      clusterAnchorVector();

    const rooms =
      activeRoomNodes(
        wing
      );

    let bestRoom =
      rooms[0]
        ? rooms[0].id
        : "";

    let bestScore =
      -Infinity;

    rooms.forEach(
      node => {
        const score =
          dot(
            rotatedRoomUnitVector(
              node,
              localQuaternion
            ),
            anchor
          );

        if (
          score >
          bestScore
        ) {
          bestScore =
            score;

          bestRoom =
            node.id;
        }
      }
    );

    return bestRoom;
  }

  function nearestPrimaryRoomLocal(
    wing,
    localQuaternion
  ) {
    const anchor =
      clusterAnchorVector();

    const rooms =
      activeRoomNodes(
        wing
      );

    let bestRoom =
      rooms[0]
        ? rooms[0].id
        : "";

    let bestScore =
      -Infinity;

    rooms.forEach(
      node => {
        const score =
          dot(
            rotatedRoomLocalUnitVector(
              node,
              localQuaternion
            ),
            anchor
          );

        if (
          score >
          bestScore
        ) {
          bestScore =
            score;

          bestRoom =
            node.id;
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
      node.wing !==
        wing
    ) {
      return currentLocalQuaternion
        .slice();
    }

    const currentVector =
      rotatedRoomLocalUnitVector(
        node,
        currentLocalQuaternion
      );

    const alignment =
      quaternionFromUnitVectors(
        currentVector,
        clusterAnchorVector()
      );

    return quaternionNormalize(
      quaternionMultiply(
        alignment,
        currentLocalQuaternion
      )
    );
  }

  function sphericalCardinalPosition(wing) {
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
          unit[2] +
          1
        ) /
        2,

      primary:
        clamp(
          (
            dot(
              unit,
              constellationAnchorVector()
            ) +
            1
          ) /
          2,
          0,
          1
        )
    };
  }

  function sphericalRoomPosition(
    node,
    localQuaternion
  ) {
    const unit =
      rotatedRoomUnitVector(
        node,
        localQuaternion
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
          unit[2] +
          1
        ) /
        2,

      primary:
        clamp(
          (
            dot(
              unit,
              clusterAnchorVector()
            ) +
            1
          ) /
          2,
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
    values.sx =
      scale;

    values.sy =
      scale;

    values.sz =
      scale;

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

      state
        .constellationQuaternion =
        state.reducedMotion
          ? frameConstellationQuaternion
              .slice()
          : quaternionSlerp(
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
          state.pointer.wing ===
            wing
        ) {
          const pointerQuaternion =
            state.pointer
              .currentQuaternion
              .slice();

          state
            .clusterTargetQuaternions
            .set(
              wing,
              pointerQuaternion
            );

          state
            .clusterQuaternions
            .set(
              wing,
              pointerQuaternion
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

        const current =
          state
            .clusterQuaternions
            .get(wing) ||
          frameLocalQuaternion
            .slice();

        state
          .clusterQuaternions
          .set(
            wing,
            state.reducedMotion
              ? frameLocalQuaternion
                  .slice()
              : quaternionSlerp(
                  current,
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
        node.visible =
          false;

        node.material =
          node.baseMaterial;

        node.depthScore =
          0;

        node.primaryScore =
          0;

        setTarget(
          node,
          {
            x:
              0,

            y:
              0,

            z:
              -1,

            sx:
              0.5,

            sy:
              0.5,

            sz:
              0.5,

            prominence:
              0,

            halo:
              0,

            rotationSpeed:
              0.06,

            float:
              0
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

        node.visible =
          true;

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

        const scale =
          prominenceScale *
          depthScale *
          (
            primary
              ? 1.10
              : 1
          );

        setTarget(
          node,
          withUniformScale(
            {
              x:
                sphere.x,

              y:
                sphere.y,

              z:
                sphere.z,

              prominence:
                clamp(
                  0.34 +
                  sphere.depth *
                  0.46 +
                  sphere.primary *
                  0.30,
                  0.10,
                  1.16
                ),

              halo:
                clamp(
                  0.24 +
                  sphere.depth *
                  0.34 +
                  sphere.primary *
                  0.54,
                  0,
                  1.28
                ),

              rotationSpeed:
                primary
                  ? 0.15
                  : 0.08 +
                    sphere.depth *
                    0.05,

              float:
                primary
                  ? 0.012
                  : 0.004 +
                    sphere.depth *
                    0.005
            },
            scale
          )
        );
      }
    );
  }

  function updateClusterRoomTargets(
    frame,
    activeWing
  ) {
    const localQuaternion =
      state
        .clusterQuaternions
        .get(activeWing) ||
      [
        0,
        0,
        0,
        1
      ];

    const primaryRoom =
      nearestPrimaryRoom(
        activeWing,
        localQuaternion
      );

    state
      .visualPrimaryRooms
      .set(
        activeWing,
        primaryRoom
      );

    activeRoomNodes(
      activeWing
    ).forEach(
      node => {
        const sphere =
          sphericalRoomPosition(
            node,
            localQuaternion
          );

        const selected =
          frame.state ===
            "ROOM_SELECTED" &&
          frame.selectedRoom ===
            node.id;

        const primary =
          primaryRoom ===
          node.id;

        node.visible =
          true;

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

        const scale =
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
          (
            primary
              ? 1.12
              : 1
          ) *
          (
            selected
              ? 1.07
              : 1
          );

        setTarget(
          node,
          withUniformScale(
            {
              x:
                sphere.x,

              y:
                sphere.y -
                0.06,

              z:
                sphere.z +
                0.14,

              prominence:
                clamp(
                  0.30 +
                  sphere.depth *
                  0.48 +
                  sphere.primary *
                  0.28 +
                  (
                    selected
                      ? 0.08
                      : 0
                  ),
                  0.10,
                  1.14
                ),

              halo:
                clamp(
                  0.20 +
                  sphere.depth *
                  0.30 +
                  sphere.primary *
                  0.44 +
                  (
                    selected
                      ? 0.18
                      : 0
                  ),
                  0,
                  1.12
                ),

              rotationSpeed:
                primary ||
                selected
                  ? 0.13
                  : 0.07 +
                    sphere.depth *
                    0.04,

              float:
                primary ||
                selected
                  ? 0.012
                  : 0.004 +
                    sphere.depth *
                    0.004
            },
            scale
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
        QUALITY.mobileAspectThreshold
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
        QUALITY.mobileAspectThreshold
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
        b -
        a
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
            deltaTime *
            6.2
          );

    state.registry.forEach(
      node => {
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
            node.transform[key] =
              lerp(
                node.transform[key],
                node.target[key],
                speed
              );
          }
        );

        if (
          state.reducedMotion
        ) {
          node.transform.rx =
            0;

          node.transform.ry =
            0;

          node.transform.rz =
            0;

          return;
        }

        node.transform.rz +=
          deltaTime *
          node.transform
            .rotationSpeed;

        node.transform.ry =
          Math.sin(
            state.time *
              0.42 +
            node.phase
          ) *
          QUALITY.maxYaw *
          Math.max(
            0.35,
            node.transform
              .prominence
          );

        node.transform.rx =
          Math.sin(
            state.time *
              0.31 +
            node.phase *
              0.73
          ) *
          QUALITY.maxPitch *
          Math.max(
            0.35,
            node.transform
              .prominence
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
          state.camera
            .nextEye[index],
          speed
        );

      state.camera.target[index] =
        lerp(
          state.camera.target[
            index
          ],
          state.camera
            .nextTarget[index],
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

  function classifyNodeDepth(node) {
    const model =
      modelMatrix(
        node,
        false
      );

    const modelView =
      multiply4(
        state.view,
        model
      );

    const viewCenter =
      transformPoint4(
        modelView,
        [
          0,
          0,
          0,
          1
        ]
      );

    node.cameraDepth =
      viewCenter[2];

    const threshold =
      QUALITY.depthLayerEpsilon;

    let nextLayer =
      node.previousDepthLayer;

    if (
      node.cameraDepth >
      threshold
    ) {
      nextLayer =
        DEPTH_LAYERS.FRONT;
    } else if (
      node.cameraDepth <
      -threshold
    ) {
      nextLayer =
        DEPTH_LAYERS.REAR;
    }

    node.depthLayer =
      nextLayer;

    node.previousDepthLayer =
      nextLayer;
  }

  function classifyVisibleNodeDepths() {
    state.registry.forEach(
      node => {
        if (
          !node.visible ||
          node.transform
            .prominence <
            0.04
        ) {
          return;
        }

        classifyNodeDepth(
          node
        );
      }
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
        [
          0,
          0,
          0,
          1
        ]
      );

    if (!clip[3]) {
      return null;
    }

    const normalizedX =
      clip[0] /
      clip[3];

    const normalizedY =
      clip[1] /
      clip[3];

    if (
      normalizedX <
        -1.30 ||
      normalizedX >
        1.30 ||
      normalizedY <
        -1.30 ||
      normalizedY >
        1.30
    ) {
      return null;
    }

    return {
      x:
        (
          (
            normalizedX +
            1
          ) /
          2
        ) *
        state.cssWidth,

      y:
        (
          (
            1 -
            normalizedY
          ) /
          2
        ) *
        state.cssHeight
    };
  }

  function compassRectInField() {
    if (
      !state.compassControl ||
      !state.field
    ) {
      return null;
    }

    const compassRect =
      state.compassControl
        .getBoundingClientRect();

    const fieldRect =
      state.field
        .getBoundingClientRect();

    if (
      compassRect.width <=
        0 ||
      compassRect.height <=
        0
    ) {
      return null;
    }

    return {
      left:
        compassRect.left -
        fieldRect.left -
        QUALITY
          .semanticCompassClearancePx,

      right:
        compassRect.right -
        fieldRect.left +
        QUALITY
          .semanticCompassClearancePx,

      top:
        compassRect.top -
        fieldRect.top -
        QUALITY
          .semanticCompassClearancePx,

      bottom:
        compassRect.bottom -
        fieldRect.top +
        QUALITY
          .semanticCompassClearancePx
    };
  }

  function semanticPointIntersectsCompass(
    screen
  ) {
    const rect =
      compassRectInField();

    if (!rect) {
      return false;
    }

    return (
      screen.x >=
        rect.left &&
      screen.x <=
        rect.right &&
      screen.y >=
        rect.top &&
      screen.y <=
        rect.bottom
    );
  }

  function hideSemanticNode(node) {
    const element =
      node.semanticElement;

    if (!element) {
      return;
    }

    element.style.opacity =
      "0";

    element.style.pointerEvents =
      "none";

    element.setAttribute(
      "aria-hidden",
      "true"
    );

    element.tabIndex =
      -1;

    element.dataset.active =
      "false";

    element.dataset.selected =
      "false";

    element.dataset.primary =
      "false";

    element.dataset.depthLayer =
      node.depthLayer
        .toLowerCase();

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
      depth *
      0.22 +
      (
        primary
          ? 0.18
          : 0
      );

    const interactive =
      state.sceneProjection ===
        SCENE_PROJECTIONS
          .CONSTELLATION &&
      node.visible &&
      node.transform
        .prominence >=
        0.12;

    element.style.left =
      `${screen.x}px`;

    element.style.top =
      `${screen.y}px`;

    element.style.right =
      "auto";

    element.style.bottom =
      "auto";

    element.style.transform =
      `translate(-50%, -50%) scale(${scale})`;

    element.style.opacity =
      String(
        clamp(
          0.22 +
          depth *
          0.54 +
          (
            primary
              ? 0.24
              : 0
          ),
          0.10,
          1
        )
      );

    element.style.pointerEvents =
      interactive
        ? "auto"
        : "none";

    element.style.zIndex =
      String(
        20 +
        Math.round(
          depth *
          60
        ) +
        (
          primary
            ? 12
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
      depth.toFixed(
        4
      );

    element.dataset.depthLayer =
      node.depthLayer
        .toLowerCase();

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
      node.wing ===
        activeWing &&
      node.transform
        .prominence >=
        0.12;

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
      clamp(
        QUALITY
          .semanticRoomMinimumScale +
        depth *
          0.14 +
        (
          primary
            ? 0.06
            : 0
        ) +
        (
          selected
            ? 0.04
            : 0
        ),
        QUALITY
          .semanticRoomMinimumScale,
        QUALITY
          .semanticRoomMaximumScale
      );

    const compassProtected =
      semanticPointIntersectsCompass(
        screen
      );

    const interactive =
      active &&
      !compassProtected;

    element.style.position =
      "absolute";

    element.style.left =
      `${screen.x}px`;

    element.style.top =
      `${screen.y}px`;

    element.style.right =
      "auto";

    element.style.bottom =
      "auto";

    element.style.transform =
      `translate(-50%, -50%) scale(${scale})`;

    element.style.opacity =
      String(
        clamp(
          0.30 +
          depth *
          0.48 +
          (
            primary
              ? 0.10
              : 0
          ) +
          (
            selected
              ? 0.08
              : 0
          ),
          0.18,
          0.96
        )
      );

    element.style.pointerEvents =
      interactive
        ? "auto"
        : "none";

    element.style.zIndex =
      String(
        20 +
        Math.round(
          depth *
          60
        ) +
        (
          primary
            ? 10
            : 0
        ) +
        (
          selected
            ? 8
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
      depth.toFixed(
        4
      );

    element.dataset.depthLayer =
      node.depthLayer
        .toLowerCase();

    element.dataset
      .compassPointerProtected =
      compassProtected
        ? "true"
        : "false";

    element.setAttribute(
      "aria-hidden",
      active
        ? "false"
        : "true"
    );

    element.tabIndex =
      interactive
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

  function syncSemanticObjects() {
    state.registry.forEach(
      node => {
        const screen =
          node.visible &&
          node.transform
            .prominence >=
            0.08
            ? projectNode(
                node
              )
            : null;

        if (!screen) {
          hideSemanticNode(
            node
          );

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
    );
  }

  function resizeLayers() {
    const rect =
      state.field
        .getBoundingClientRect();

    const lowPower =
      navigator
        .hardwareConcurrency &&
      navigator
        .hardwareConcurrency <=
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

    state.width =
      width;

    state.height =
      height;

    state.pixelRatio =
      pixelRatio;

    for (
      const layer
      of state.renderLayers.values()
    ) {
      if (
        layer.canvas.width !==
          width ||
        layer.canvas.height !==
          height
      ) {
        layer.canvas.width =
          width;

        layer.canvas.height =
          height;
      }

      layer.gl.viewport(
        0,
        0,
        width,
        height
      );
    }
  }

  function applyMaterial(
    layer,
    materialName,
    prominence,
    haloStrength
  ) {
    const gl =
      layer.gl;

    const material =
      MATERIALS[
        materialName
      ] ||
      MATERIALS
        .CARDINAL_IDLE;

    const bloomDisabled =
      state.cssWidth <=
      QUALITY
        .bloomDisableWidthPx;

    gl.uniform1f(
      layer.uniforms.twinkle,
      state.reducedMotion
        ? 0
        : 1
    );

    gl.uniform1f(
      layer.uniforms.sparkle,
      state.reducedMotion
        ? 0
        : material.sparkle
    );

    gl.uniform1f(
      layer.uniforms.prominence,
      prominence
    );

    gl.uniform1f(
      layer.uniforms.specular,
      material.specular
    );

    gl.uniform1f(
      layer.uniforms.rim,
      material.rim
    );

    gl.uniform1f(
      layer.uniforms.emissive,
      material.emissive
    );

    gl.uniform1f(
      layer.uniforms.alpha,
      material.alpha
    );

    gl.uniform1f(
      layer.uniforms.contrast,
      material.contrast
    );

    gl.uniform1f(
      layer.uniforms.haloStrength,
      bloomDisabled
        ? 0
        : material.halo *
          haloStrength
    );

    gl.uniform1f(
      layer.uniforms.saturation,
      1
    );
  }

  function drawNode(
    layer,
    node,
    haloPass
  ) {
    if (
      !node.visible ||
      node.transform
        .prominence <
        0.04 ||
      node.depthLayer !==
        layer.id
    ) {
      return 0;
    }

    const mesh =
      layer.meshes.get(
        node.meshKey
      );

    if (!mesh) {
      return 0;
    }

    const gl =
      layer.gl;

    bindAttrib(
      gl,
      mesh.position,
      layer.attribs.position,
      3
    );

    bindAttrib(
      gl,
      mesh.normal,
      layer.attribs.normal,
      3
    );

    bindAttrib(
      gl,
      mesh.color,
      layer.attribs.color,
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
      layer.uniforms.model,
      false,
      new Float32Array(
        model
      )
    );

    gl.uniformMatrix4fv(
      layer.uniforms.view,
      false,
      new Float32Array(
        state.view
      )
    );

    gl.uniformMatrix4fv(
      layer.uniforms.projection,
      false,
      new Float32Array(
        state.projection
      )
    );

    gl.uniformMatrix3fv(
      layer.uniforms
        .viewNormalMatrix,
      false,
      new Float32Array(
        normalMatrix
      )
    );

    gl.uniform1f(
      layer.uniforms.time,
      state.time
    );

    gl.uniform1f(
      layer.uniforms.haloPass,
      haloPass
        ? 1
        : 0
    );

    gl.uniform1f(
      layer.uniforms
        .haloExpansion,
      0.075
    );

    applyMaterial(
      layer,
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

  function configureSharedUniforms(layer) {
    const gl =
      layer.gl;

    gl.useProgram(
      layer.program
    );

    gl.uniform3f(
      layer.uniforms
        .keyLightView,
      -0.42,
      -0.82,
      -0.68
    );

    gl.uniform3f(
      layer.uniforms
        .fillLightView,
      0.72,
      -0.24,
      -0.54
    );

    gl.uniform3f(
      layer.uniforms
        .rimLightView,
      0.08,
      0.46,
      1
    );

    gl.uniform3f(
      layer.uniforms
        .ambientColor,
      0.10,
      0.12,
      0.18
    );
  }

  function sortLayerNodes(nodes) {
    return nodes.sort(
      (
        a,
        b
      ) =>
        a.cameraDepth -
        b.cameraDepth
    );
  }

  function renderLayer(
    layer,
    nodes
  ) {
    const gl =
      layer.gl;

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

    configureSharedUniforms(
      layer
    );

    let drawCalls =
      0;

    const bloomDisabled =
      state.cssWidth <=
      QUALITY
        .bloomDisableWidthPx;

    if (!bloomDisabled) {
      gl.depthMask(
        false
      );

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE
      );

      nodes.forEach(
        node => {
          drawCalls +=
            drawNode(
              layer,
              node,
              true
            );
        }
      );
    }

    gl.depthMask(
      true
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    nodes.forEach(
      node => {
        drawCalls +=
          drawNode(
            layer,
            node,
            false
          );
      }
    );

    const error =
      gl.getError();

    return {
      drawCalls,

      error
    };
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
      x:
        clientX,

      y:
        clientY,

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
          -GESTURE
            .maximumSamples
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
      Math.hypot(
        dx,
        dy
      );

    const durationMs =
      Math.max(
        1,
        endTime -
        pointer.startTime
      );

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
            x:
              pointer.startX,

            y:
              pointer.startY,

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
      dx,
      dy,
      distance,
      durationMs,

      averageVelocity:
        distance /
        durationMs,

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
    const dx =
      clientX -
      pointer.startX;

    const dy =
      clientY -
      pointer.startY;

    const yaw =
      (
        dx /
        Math.max(
          1,
          state.cssWidth
        )
      ) *
      GESTURE
        .radiansPerViewport;

    const pitch =
      (
        dy /
        Math.max(
          1,
          state.cssHeight
        )
      ) *
      GESTURE
        .radiansPerViewport;

    return quaternionNormalize(
      quaternionMultiply(
        quaternionFromAxisAngle(
          [
            1,
            0,
            0
          ],
          pitch
        ),
        quaternionMultiply(
          quaternionFromAxisAngle(
            [
              0,
              1,
              0
            ],
            yaw
          ),
          pointer
            .startQuaternion
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
            pointer
              .startQuaternion,

          primaryWing:
            state
              .visualPrimaryWing,

          source:
            "archcoin-crystals-empty-scene-pointer"
        }) !==
      false
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
        }) !==
      false
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
        }) !==
      false
    );
  }

  function requestControllerOrbitCancel(
    reason
  ) {
    return (
      state.controller
        .requestOrbitCancel(
          reason
        ) !==
      false
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
              pointer
                .startQuaternion,

            primaryRoom:
              state
                .visualPrimaryRooms
                .get(
                  pointer.wing
                ) ||
              "",

            source:
              "archcoin-crystals-empty-scene-cluster-pointer"
          }
        ) !==
      false
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
        ) !==
      false
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
        ) !==
      false
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
        ) !==
      false
    );
  }

  function requestControllerReturnToConstellation() {
    return (
      state.controller
        .requestReturnToConstellation({
          scrollToScene:
            false,

          source:
            "archcoin-crystals-cluster-exit-swipe"
        }) !==
      false
    );
  }

  function semanticNavigationControl(target) {
    return (
      target &&
      target.closest
        ? target.closest(
            [
              "[data-archcoin-coin]",
              "[data-archcoin-room]"
            ].join(", ")
          )
        : null
    );
  }

  function blockedControl(target) {
    return (
      target &&
      target.closest
        ? target.closest(
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
          )
        : null
    );
  }

  function classifyPointerTerritory(event) {
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
      frame.presentation
        .outerCardinalsActive ===
      true
    ) {
      return GESTURE_SCOPES
        .CONSTELLATION;
    }

    if (
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

  function clusterExitVector(wing) {
    if (
      wing ===
      "north"
    ) {
      return [
        0,
        1
      ];
    }

    if (
      wing ===
      "east"
    ) {
      return [
        1,
        0
      ];
    }

    if (
      wing ===
      "south"
    ) {
      return [
        0,
        -1
      ];
    }

    return [
      -1,
      0
    ];
  }

  function classifyClusterExitSwipe(
    pointer,
    metrics
  ) {
    if (
      pointer.gestureScope !==
      GESTURE_SCOPES.CLUSTER
    ) {
      return false;
    }

    const minimumDistance =
      Math.max(
        GESTURE
          .clusterExitMinimumDistancePx,

        Math.min(
          state.cssWidth,
          state.cssHeight
        ) *
        GESTURE
          .clusterExitMinimumViewportFraction
      );

    if (
      metrics.distance <
        minimumDistance ||
      metrics.durationMs >
        GESTURE
          .clusterExitMaximumDurationMs ||
      metrics.averageVelocity <
        GESTURE
          .clusterExitMinimumAverageVelocity ||
      metrics.releaseVelocity <
        GESTURE
          .clusterExitMinimumReleaseVelocity
    ) {
      return false;
    }

    const absoluteX =
      Math.abs(
        metrics.dx
      );

    const absoluteY =
      Math.abs(
        metrics.dy
      );

    if (
      Math.max(
        absoluteX,
        absoluteY
      ) <
      Math.min(
        absoluteX,
        absoluteY
      ) *
      GESTURE
        .clusterExitDirectionDominance
    ) {
      return false;
    }

    const movementLength =
      Math.max(
        QUALITY.normalEpsilon,
        metrics.distance
      );

    const movementUnit = [
      metrics.dx /
        movementLength,

      -metrics.dy /
        movementLength
    ];

    const exitVector =
      clusterExitVector(
        pointer.wing
      );

    return (
      movementUnit[0] *
        exitVector[0] +
      movementUnit[1] *
        exitVector[1] >=
      GESTURE
        .clusterExitMinimumOutwardAlignment
    );
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
            [
              0,
              0,
              0,
              1
            ]
          ).slice();

    const now =
      performance.now();

    state.pointer = {
      id:
        event.pointerId,

      startX:
        event.clientX,

      startY:
        event.clientY,

      startTime:
        now,

      territory,
      gestureScope,
      wing,

      dragging:
        false,

      controllerGestureBegan:
        false,

      startQuaternion,

      currentQuaternion:
        startQuaternion.slice(),

      samples:
        [
          {
            x:
              event.clientX,

            y:
              event.clientY,

            time:
              now
          }
        ]
    };

    emitReceipt({
      lastPointerTerritory:
        territory,

      lastGestureType:
        GESTURE_TYPES
          .POINTER_DOWN,

      lastClusterExitQualified:
        false
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
      pointer.dragging =
        true;

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
        state.pointer =
          null;

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
          pointer
            .currentQuaternion
        );

      state.visualPrimaryWing =
        primaryWing;

      requestControllerOrbitPreview(
        pointer.currentQuaternion,
        primaryWing
      );

      emitReceipt({
        status:
          "available",

        lastGestureType:
          GESTURE_TYPES
            .CONSTELLATION_DRAG,

        gestureActive:
          true,

        primaryWing
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
      status:
        "available",

      lastGestureType:
        GESTURE_TYPES
          .CLUSTER_DRAG,

      gestureActive:
        true,

      activeClusterWing:
        pointer.wing,

      primaryRoom
    });
  }

  function releasePointerCapture(event) {
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
    const primaryWing =
      nearestPrimaryWing(
        pointer.currentQuaternion
      );

    const settledQuaternion =
      settledConstellationQuaternion(
        primaryWing,
        pointer.currentQuaternion
      );

    state.settledPrimaryWing =
      primaryWing;

    state.visualPrimaryWing =
      primaryWing;

    state
      .constellationTargetQuaternion =
      settledQuaternion
        .slice();

    if (
      state.reducedMotion
    ) {
      state
        .constellationQuaternion =
        settledQuaternion
          .slice();
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

      lastClusterExitQualified:
        false,

      gestureActive:
        false
    });
  }

  function finishClusterExit(
    pointer,
    event,
    metrics
  ) {
    requestControllerClusterCancel(
      pointer.wing,
      "cluster-exit-swipe"
    );

    state
      .clusterTargetQuaternions
      .set(
        pointer.wing,
        pointer.startQuaternion
          .slice()
      );

    const returned =
      requestControllerReturnToConstellation();

    state.suppressClickUntil =
      performance.now() +
      GESTURE.suppressClickMs;

    event.preventDefault();

    emitReceipt({
      status:
        returned
          ? "available"
          : "held",

      lastGestureType:
        GESTURE_TYPES
          .CLUSTER_EXIT,

      activeClusterWing:
        pointer.wing,

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

      lastAverageVelocityPxPerMs:
        metrics.averageVelocity,

      lastReleaseVelocityPxPerMs:
        metrics.releaseVelocity,

      lastClusterExitQualified:
        true,

      gestureActive:
        false
    });
  }

  function finishClusterDrag(
    pointer,
    event,
    metrics
  ) {
    if (
      classifyClusterExitSwipe(
        pointer,
        metrics
      )
    ) {
      finishClusterExit(
        pointer,
        event,
        metrics
      );

      return;
    }

    const primaryRoom =
      nearestPrimaryRoomLocal(
        pointer.wing,
        pointer.currentQuaternion
      );

    const settledQuaternion =
      settledClusterQuaternion(
        primaryRoom,
        pointer.wing,
        pointer.currentQuaternion
      );

    state
      .clusterTargetQuaternions
      .set(
        pointer.wing,
        settledQuaternion
          .slice()
      );

    if (
      state.reducedMotion
    ) {
      state
        .clusterQuaternions
        .set(
          pointer.wing,
          settledQuaternion
            .slice()
        );
    }

    state
      .visualPrimaryRooms
      .set(
        pointer.wing,
        nearestPrimaryRoom(
          pointer.wing,
          settledQuaternion
        )
      );

    const committed =
      requestControllerClusterCommit(
        pointer.wing,
        settledQuaternion,
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

      lastClusterExitQualified:
        false,

      gestureActive:
        false
    });
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

    state.pointer =
      null;

    releasePointerCapture(
      event
    );

    clearGestureDatasets();

    if (!pointer.dragging) {
      emitReceipt({
        lastGestureType:
          GESTURE_TYPES.IDLE,

        lastClusterExitQualified:
          false,

        gestureActive:
          false
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

    state.pointer =
      null;

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
      lastGestureType:
        GESTURE_TYPES.CANCELLED,

      lastClusterExitQualified:
        false,

      gestureActive:
        false
    });
  }

  function handleSceneClickCapture(event) {
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
    if (
      state.listenersBound
    ) {
      return;
    }

    state.listenersBound =
      true;

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
        passive:
          false
      }
    );

    state.scene.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive:
          false
      }
    );

    state.scene.addEventListener(
      "pointerup",
      handlePointerUp,
      {
        passive:
          false
      }
    );

    state.scene.addEventListener(
      "pointercancel",
      handlePointerCancel,
      {
        passive:
          false
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

    state.listenersBound =
      false;

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

  function render(now) {
    if (
      !state.running ||
      state.disposed
    ) {
      return;
    }

    const seconds =
      now *
      0.001;

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

    state.lastTime =
      seconds;

    state.time =
      seconds;

    try {
      state.frame =
        getControllerFrame();

      state.reducedMotion =
        Boolean(
          state.frame
            .reducedMotion
        );

      resizeLayers();

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
          [
            0,
            1,
            0
          ]
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

      classifyVisibleNodeDepths();

      syncSemanticObjects();

      const visibleNodes =
        Array.from(
          state.registry.values()
        ).filter(
          node =>
            node.visible &&
            node.transform
              .prominence >=
              0.04
        );

      const rearNodes =
        sortLayerNodes(
          visibleNodes.filter(
            node =>
              node.depthLayer ===
              DEPTH_LAYERS.REAR
          )
        );

      const frontNodes =
        sortLayerNodes(
          visibleNodes.filter(
            node =>
              node.depthLayer ===
              DEPTH_LAYERS.FRONT
          )
        );

      const rearLayer =
        state.renderLayers.get(
          DEPTH_LAYERS.REAR
        );

      const frontLayer =
        state.renderLayers.get(
          DEPTH_LAYERS.FRONT
        );

      const rearResult =
        renderLayer(
          rearLayer,
          rearNodes
        );

      const frontResult =
        renderLayer(
          frontLayer,
          frontNodes
        );

      if (
        rearResult.error !==
        rearLayer.gl.NO_ERROR
      ) {
        emitFailure(
          "ARCHCOIN_REAR_CRYSTALS_WEBGL_RENDER_FAILURE",
          {
            error:
              rearResult.error
          }
        );

        return;
      }

      if (
        frontResult.error !==
        frontLayer.gl.NO_ERROR
      ) {
        emitFailure(
          "ARCHCOIN_FRONT_CRYSTALS_WEBGL_RENDER_FAILURE",
          {
            error:
              frontResult.error
          }
        );

        return;
      }

      emitReceipt({
        status:
          "available",

        rendererInitialized:
          true,

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

        rearDrawCallsLastFrame:
          rearResult.drawCalls,

        frontDrawCallsLastFrame:
          frontResult.drawCalls,

        rearVisibleObjectCount:
          rearNodes.length,

        frontVisibleObjectCount:
          frontNodes.length,

        rearGlError:
          "NO_ERROR",

        frontGlError:
          "NO_ERROR"
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
              : String(
                  error
                ),

          details:
            error &&
            error.details
              ? error.details
              : null
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
    if (
      state.disposed
    ) {
      return;
    }

    state.disposed =
      true;

    state.running =
      false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );

      state.raf =
        0;
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

    state.pointer =
      null;

    clearGestureDatasets();

    unbindPointerBridge();

    hideAllSemanticNodes();

    for (
      const layer
      of state.renderLayers.values()
    ) {
      destroyRenderLayer(
        layer
      );
    }

    state.renderLayers.clear();

    state.registry.clear();

    state.clusterQuaternions
      .clear();

    state
      .clusterTargetQuaternions
      .clear();

    state.visualPrimaryRooms
      .clear();

    emitReceipt({
      status:
        "disposed",

      rendererInitialized:
        false,

      gestureActive:
        false,

      rearDrawCallsLastFrame:
        0,

      frontDrawCallsLastFrame:
        0,

      rearVisibleObjectCount:
        0,

      frontVisibleObjectCount:
        0
    });
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

    state.field =
      qs(
        ".archcoin-scene__field",
        state.scene
      ) ||
      state.scene;

    invariant(
      state.field,
      "ARCHCOIN_SCENE_FIELD_NOT_FOUND"
    );

    state.crystalsMount =
      qs(
        "[data-archcoin-crystals-mount]",
        state.root
      );

    invariant(
      state.crystalsMount,
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

    state.compassMount =
      qs(
        "[data-upstream-compass-mount]",
        state.root
      );

    invariant(
      state.compassMount,
      "ARCHCOIN_COMPASS_MOUNT_NOT_FOUND"
    );

    state.compassControl =
      qs(
        "[data-upstream-compass-control]",
        state.compassMount
      );

    invariant(
      state.compassControl,
      "ARCHCOIN_COMPASS_CONTROL_NOT_FOUND"
    );

    state.receiptOutput =
      qs(
        "[data-archcoin-crystals-receipt]",
        state.root
      );
  }

  function initializeLayerOrder() {
    const fieldPosition =
      globalThis.getComputedStyle(
        state.field
      ).position;

    if (
      fieldPosition ===
      "static"
    ) {
      state.field.style.position =
        "relative";
    }

    state.crystalsMount.style.pointerEvents =
      "none";

    state.crystalsMount.style.opacity =
      "0";

    state.crystalsMount.style.visibility =
      "hidden";

    state.compassMount.style.zIndex =
      "2";

    state.compassMount.style.pointerEvents =
      "none";

    state.compassControl.style.pointerEvents =
      "auto";

    state.semanticLayer.style.zIndex =
      "4";

    state.semanticLayer.style.pointerEvents =
      "none";
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
      constellationQuaternion
        .slice();

    state
      .constellationTargetQuaternion =
      constellationQuaternion
        .slice();

    state.settledPrimaryWing =
      normalizeWing(
        state.frame
          .orbitFocus
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
            localQuaternion
              .slice()
          );

        state
          .clusterTargetQuaternions
          .set(
            wing,
            localQuaternion
              .slice()
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
            [
              0,
              0,
              0,
              1
            ]
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
                  [
                    0,
                    0,
                    0,
                    1
                  ]
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

      depthBasedCompassOcclusion:
        true,

      compassCenterExclusion:
        false,

      canonicalRoomControlsRelocated:
        state
          .relocatedRoomElements
          .length ===
        16,

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

        depthLayers:
          DEPTH_LAYERS,

        sceneProjections:
          SCENE_PROJECTIONS,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        getOrientation:
          getOrientationState,

        getSceneProjection:
          () =>
            state
              .sceneProjection,

        getDepthAssignments:
          () =>
            Object.freeze(
              Array.from(
                state.registry.values()
              ).reduce(
                (
                  result,
                  node
                ) => {
                  result[node.id] =
                    node.depthLayer;

                  return result;
                },
                {}
              )
            ),

        getRelocatedRoomControls:
          () =>
            Object.freeze(
              state
                .relocatedRoomElements
                .map(
                  element =>
                    element.dataset
                      .roomId ||
                    ""
                )
            ),

        start:
          () => {
            if (
              !state.running &&
              !state.disposed &&
              state.renderLayers
                .size ===
                2
            ) {
              state.running =
                true;

              state.lastTime =
                0;

              state.raf =
                requestAnimationFrame(
                  render
                );

              emitReceipt({
                status:
                  "available"
              });
            }

            return state.running;
          },

        stop:
          () => {
            state.running =
              false;

            if (state.raf) {
              cancelAnimationFrame(
                state.raf
              );

              state.raf =
                0;
            }

            emitReceipt({
              status:
                "stopped",

              gestureActive:
                false
            });

            return true;
          },

        dispose:
          disposeResources
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

    state.root.dataset
      .archcoinCanonicalRoomControlsRelocated =
      state
        .relocatedRoomElements
        .length ===
      16
        ? "true"
        : "false";

    state.root.dataset
      .archcoinRelocatedCanonicalRoomCount =
      String(
        state
          .relocatedRoomElements
          .length
      );

    state.root.dataset
      .archcoinClusterExitSwipeEnabled =
      "true";

    state.root.dataset
      .archcoinCompassCenterExclusionEnabled =
      "false";

    state.root.dataset
      .archcoinDepthBasedCompassOcclusionEnabled =
      "true";

    state.root.dataset
      .archcoinRearCrystalLayer =
      "true";

    state.root.dataset
      .archcoinFrontCrystalLayer =
      "true";
  }

  function init() {
    try {
      resolveDom();

      state.controller =
        requireController();

      initializeLayerOrder();

      relocateCanonicalRoomControls();

      const cpuMeshes =
        createCpuMeshes();

      state.renderLayers.set(
        DEPTH_LAYERS.REAR,
        createRenderLayer(
          DEPTH_LAYERS.REAR,
          1,
          cpuMeshes
        )
      );

      state.renderLayers.set(
        DEPTH_LAYERS.FRONT,
        createRenderLayer(
          DEPTH_LAYERS.FRONT,
          3,
          cpuMeshes
        )
      );

      state.registry =
        buildRegistry();

      initializeOrientations();

      bindPointerBridge();

      initializeRootDatasets();

      exposeApi();

      state.running =
        true;

      emitReceipt({
        status:
          "available",

        rendererInitialized:
          true,

        controllerModuleId:
          state.controller
            .moduleId,

        controllerModuleVersion:
          state.controller
            .moduleVersion,

        cardinalCount:
          4,

        roomCount:
          16,

        canonicalSemanticRoomCount:
          canonicalRoomElements()
            .length,

        relocatedCanonicalRoomCount:
          state
            .relocatedRoomElements
            .length,

        canonicalRoomControlsRelocated:
          state
            .relocatedRoomElements
            .length ===
          16,

        rearCanvasCreated:
          true,

        frontCanvasCreated:
          true,

        compassCenterExclusionEnabled:
          false,

        depthBasedCompassOcclusionEnabled:
          true,

        additiveCoRenderingAuthorized:
          false,

        generatedRoomProxyCount:
          0,

        projectedSelectionEnabled:
          false,

        compassLogicOwned:
          false,

        rearGlError:
          "NO_ERROR",

        frontGlError:
          "NO_ERROR"
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
              : String(
                  error
                ),

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
        once:
          true
      }
    );
  } else {
    init();
  }
})();

/*
ARCHCOIN_CRYSTALS_DEPTH_LAYERED_OCCLUSION_RESULT_v1

Artifact:
/products/archcoin/index.crystals.js

Module:
DGB_ARCHCOIN_CRYSTALS
1.2.0-depth-layered-compass-occlusion

Controller anchor:
DGB_ARCHCOIN_CONTROLLER
6.0.1-controller-presentation-and-native-home-corrections

Removed:
- SPHERE.compassExclusion
- deriveCompassExclusionRadiusWorld()
- applyCompassCenterExclusion()
- protected center radius
- forced room displacement
- empty Compass avoidance ring
- Compass-exclusion receipts and positioning law

Restored:
- unmodified spherical cardinal positions
- unmodified spherical room positions
- full crystal travel through the center region
- shared semantic projection from actual crystal centers

Added:
- rear crystal WebGL canvas
- front crystal WebGL canvas
- independent WebGL resources for both canvases
- common CPU mesh source
- common transforms
- common quaternion state
- common camera
- common materials
- common animation
- camera-space depth classification
- hysteresis around the front/rear split
- rear rendering below the fixed-center Compass
- front rendering above the fixed-center Compass
- semantic controls above both crystal layers
- compact room semantic controls
- Compass pointer protection when a room control crosses its footprint

Layer order:
REAR CRYSTALS
-> FIXED-CENTER COMPASS
-> FRONT CRYSTALS
-> SEMANTIC CONTROLS

Preserved:
- canonical room-control relocation
- no generated room proxies
- controller-owned cardinal selection
- controller-owned room selection
- controller-owned route entry
- constellation drag
- cluster drag
- cluster settlement
- cluster-exit swipe
- reduced-motion behavior
- context-loss reporting
- resource disposal
- exclusive CONSTELLATION / CLUSTER / HELD presentation

Compass law:
- fixed center
- independent sibling
- no inherited orbit orientation
- no inherited cluster orientation
- no navigation settlement participation
- independently clickable
- not owned by crystals
- visually crossed by foreground and background crystals

Other files modified:
NONE

Runtime execution:
NOT PERFORMED

Actual-page integration verification:
PENDING RELOAD

Production authorization:
FALSE

Deployment authorization:
FALSE
*/
