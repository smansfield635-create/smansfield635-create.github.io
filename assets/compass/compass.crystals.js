/* /assets/compass/compass.crystals.js
   Diamond Gate Bridge Compass
   Cardinal and room crystal renderer with spherical constellation and
   spherical room-cluster manipulation.

   Full-file replacement scope:
   - Preserve all four cardinal stars and nineteen room stars.
   - Preserve authoritative cardinal declarations, room declarations,
     routes, accessibility metadata, semantic controls, materials,
     Mirrorland recession behavior, WebGL rendering, and receipts.
   - Preserve the shared right-handed Euclidean X/Y/Z cardinal sphere.
   - Add an independent right-handed Euclidean X/Y/Z sphere for each
     cardinal room cluster.
   - Allow controlled pulls to rotate the active room cluster continuously.
   - Distinguish systematic drags from quick swipe/flick gestures using
     duration, travel, release velocity, and recent motion samples.
   - Treat controlled release as cluster settlement.
   - Treat a short, fast, clearly directional flick as a request to return
     to the cardinal constellation.
   - Never interpret a slow or systematic pull as a return swipe merely
     because the finger was lifted.
   - Allow constellation drag from a cardinal star, cardinal label, or
     open constellation space.
   - Allow cluster drag from a room star, room proxy position, or open
     cluster space.
   - Keep tap-to-open-cardinal and tap-to-select-room behavior distinct
     from drag and flick behavior.
   - Compute position, depth, scale, prominence, halo, label opacity,
     semantic stacking, and hit priority from rotated three-dimensional
     vectors.
   - Snap the nearest cardinal or room star to the primary anchor after
     controlled drag release.
   - Preserve constellation and cluster orientations through Mirrorland
     recession and controller restoration.
   - Suppress accidental semantic clicks after drag, flick, or rendered
     star selection.
   - Support pointer capture, cancellation, reduced motion, and context loss.

   Ownership:
   - Celestial scene background.
   - Four cardinal crystal stars.
   - Nineteen room crystal stars.
   - Cardinal spherical orientation rendering.
   - Active room-cluster spherical orientation rendering.
   - Crystal shaders, materials, camera, projection, semantic positioning,
     accessibility proxies, hit testing, gesture sampling, drag/flick
     classification, front-star detection, and release settlement.

   Non-ownership:
   - Controller state commitment beyond published controller APIs.
   - Mirrorland geometry, materials, hit testing, state, or rendering.
   - Navigation.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "DGB_COMPASS_CRYSTALS_SPHERICAL_CONSTELLATION_AND_CLUSTER_REBUILD_v3",

    previousId:
      "DGB_COMPASS_CRYSTALS_SPHERICAL_ORBIT_REBUILD_v2",

    file:
      "/assets/compass/compass.crystals.js",

    releaseId:
      "dgb-compass-spherical-clusters-v3",

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

  const POINTER_TERRITORIES = Object.freeze({
    BLOCKED_CONTROL:
      "BLOCKED_CONTROL",

    RENDERED_CARDINAL:
      "RENDERED_CARDINAL",

    RENDERED_ROOM:
      "RENDERED_ROOM",

    MIRRORLAND_THRESHOLD:
      "MIRRORLAND_THRESHOLD",

    EMPTY_SCENE:
      "EMPTY_SCENE",

    OUTSIDE_SCENE:
      "OUTSIDE_SCENE"
  });

  const GESTURE_TYPES = Object.freeze({
    POINTER_DOWN:
      "pointerdown",

    TAP:
      "tap",

    EMPTY_TAP:
      "empty-tap",

    CONSTELLATION_DRAG:
      "constellation-drag",

    CONSTELLATION_SETTLE:
      "constellation-settle",

    CLUSTER_DRAG:
      "cluster-drag",

    CLUSTER_SETTLE:
      "cluster-settle",

    CLUSTER_FLICK_RETURN:
      "cluster-flick-return",

    AMBIGUOUS:
      "ambiguous",

    CANCELLED:
      "cancelled",

    BLOCKED:
      "blocked"
  });

  const GESTURE = Object.freeze({
    dragDeadZonePx:
      6,

    maximumTapDistancePx:
      12,

    minimumDragDistancePx:
      8,

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

    flickMaximumDurationMs:
      260,

    flickMinimumDistancePx:
      52,

    flickMinimumAverageVelocityPxPerMs:
      0.55,

    flickMinimumReleaseVelocityPxPerMs:
      0.72,

    flickMinimumDirectionalRatio:
      1.28,

    flickMaximumPauseBeforeReleaseMs:
      90,

    flickMaximumPathEfficiencyLoss:
      0.22
  });

  const SPHERE = Object.freeze({
    coordinateSystem:
      "RIGHT_HANDED_EUCLIDEAN_XYZ",

    orientationRepresentation:
      "UNIT_QUATERNION",

    constellation: Object.freeze({
      horizontalRadius:
        1.50,

      verticalRadius:
        1.34,

      depthRadius:
        1.16,

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

    cluster: Object.freeze({
      horizontalRadius:
        1.36,

      verticalRadius:
        1.18,

      depthRadius:
        1.04,

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

  const STAR_PALETTE = Object.freeze({
    north:
      Object.freeze([
        0.72,
        0.88,
        1
      ]),

    east:
      Object.freeze([
        0.56,
        0.92,
        1
      ]),

    south:
      Object.freeze([
        1,
        0.82,
        0.48
      ]),

    west:
      Object.freeze([
        0.96,
        0.68,
        0.46
      ]),

    roomNorth:
      Object.freeze([
        0.66,
        0.84,
        1
      ]),

    roomEast:
      Object.freeze([
        0.55,
        0.90,
        0.96
      ]),

    roomSouth:
      Object.freeze([
        1,
        0.76,
        0.42
      ]),

    roomWest:
      Object.freeze([
        0.94,
        0.62,
        0.42
      ])
  });

  const MATERIALS = Object.freeze({
    CARDINAL_IDLE:
      Object.freeze({
        specular:
          1.18,

        rim:
          1.02,

        emissive:
          0.17,

        alpha:
          0.90,

        sparkle:
          0.26,

        halo:
          0.82,

        contrast:
          1.16
      }),

    CARDINAL_FOCUSED:
      Object.freeze({
        specular:
          1.50,

        rim:
          1.30,

        emissive:
          0.24,

        alpha:
          0.96,

        sparkle:
          0.36,

        halo:
          1.18,

        contrast:
          1.24
      }),

    CARDINAL_SELECTED:
      Object.freeze({
        specular:
          1.62,

        rim:
          1.38,

        emissive:
          0.28,

        alpha:
          0.97,

        sparkle:
          0.42,

        halo:
          1.25,

        contrast:
          1.28
      }),

    ROOM_IDLE:
      Object.freeze({
        specular:
          1.04,

        rim:
          0.90,

        emissive:
          0.15,

        alpha:
          0.88,

        sparkle:
          0.22,

        halo:
          0.64,

        contrast:
          1.10
      }),

    ROOM_PRIMARY:
      Object.freeze({
        specular:
          1.24,

        rim:
          1.08,

        emissive:
          0.21,

        alpha:
          0.94,

        sparkle:
          0.30,

        halo:
          0.86,

        contrast:
          1.17
      }),

    ROOM_SELECTED:
      Object.freeze({
        specular:
          1.34,

        rim:
          1.14,

        emissive:
          0.24,

        alpha:
          0.95,

        sparkle:
          0.34,

        halo:
          0.96,

        contrast:
          1.20
      })
  });

  const QUALITY = Object.freeze({
    normalDevicePixelRatioCap:
      2,

    lowPowerDevicePixelRatioCap:
      1.5,

    mobileAspectThreshold:
      0.82,

    atmosphereReductionWidthPx:
      520,

    bloomDisableWidthPx:
      420,

    cardinalSegments:
      8,

    roomSegments:
      6,

    cardinalScale:
      0.96,

    focusedCardinalScale:
      1.30,

    selectedCardinalScale:
      1.38,

    roomScale:
      0.88,

    primaryRoomScale:
      1.12,

    selectedRoomScale:
      1.18,

    maxYaw:
      0.22,

    maxPitch:
      0.14
  });

  const RECESSION = Object.freeze({
    NORMAL:
      Object.freeze({
        scale:
          1,

        outwardDesktop:
          1,

        outwardMobile:
          1,

        zOffset:
          0,

        prominence:
          1,

        controllerProminenceFloor:
          0,

        halo:
          1,

        material:
          1,

        saturation:
          1,

        labelScale:
          1,

        labelOpacity:
          1,

        rotation:
          1,

        float:
          1,

        interactive:
          true
      }),

    REVEALING:
      Object.freeze({
        scale:
          0.86,

        outwardDesktop:
          1.075,

        outwardMobile:
          1.04,

        zOffset:
          -0.50,

        prominence:
          0.88,

        controllerProminenceFloor:
          0.76,

        halo:
          0.52,

        material:
          0.74,

        saturation:
          0.76,

        labelScale:
          0.90,

        labelOpacity:
          0.82,

        rotation:
          0.68,

        float:
          0.64,

        interactive:
          false
      }),

    FOCUSED:
      Object.freeze({
        scale:
          0.72,

        outwardDesktop:
          1.14,

        outwardMobile:
          1.075,

        zOffset:
          -0.92,

        prominence:
          0.78,

        controllerProminenceFloor:
          0.62,

        halo:
          0.30,

        material:
          0.58,

        saturation:
          0.61,

        labelScale:
          0.78,

        labelOpacity:
          0.68,

        rotation:
          0.42,

        float:
          0.36,

        interactive:
          false
      }),

    WITHDRAWING:
      Object.freeze({
        scale:
          0.82,

        outwardDesktop:
          1.09,

        outwardMobile:
          1.05,

        zOffset:
          -0.60,

        prominence:
          0.84,

        controllerProminenceFloor:
          0.70,

        halo:
          0.44,

        material:
          0.68,

        saturation:
          0.70,

        labelScale:
          0.86,

        labelOpacity:
          0.76,

        rotation:
          0.58,

        float:
          0.54,

        interactive:
          false
      }),

    NAVIGATING:
      Object.freeze({
        scale:
          0.66,

        outwardDesktop:
          1.16,

        outwardMobile:
          1.08,

        zOffset:
          -1.08,

        prominence:
          0.68,

        controllerProminenceFloor:
          0.50,

        halo:
          0.20,

        material:
          0.46,

        saturation:
          0.50,

        labelScale:
          0.72,

        labelOpacity:
          0.54,

        rotation:
          0.26,

        float:
          0.20,

        interactive:
          false
      }),

    HELD:
      Object.freeze({
        scale:
          0.90,

        outwardDesktop:
          1,

        outwardMobile:
          1,

        zOffset:
          -0.20,

        prominence:
          0.74,

        controllerProminenceFloor:
          0.68,

        halo:
          0.22,

        material:
          0.50,

        saturation:
          0.44,

        labelScale:
          0.90,

        labelOpacity:
          0.66,

        rotation:
          0,

        float:
          0,

        interactive:
          false
      })
  });

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    previousContractId:
      CONTRACT.previousId,

    status:
      "pending",

    rendererInitialized:
      false,

    registryCardinalCount:
      0,

    registryRoomCount:
      0,

    mirrorlandRegistryPresent:
      false,

    roomProxyCount:
      0,

    roomProxyPresentation:
      "NONVISUAL_ACCESSIBILITY_CONTROL",

    recessionProfile:
      "NORMAL",

    sphericalConstellationEnabled:
      true,

    sphericalClustersEnabled:
      true,

    coordinateSystem:
      SPHERE.coordinateSystem,

    orientationRepresentation:
      SPHERE.orientationRepresentation,

    primaryWing:
      "north",

    activeClusterWing:
      "",

    primaryRoom:
      "",

    gestureActive:
      false,

    lastPointerTerritory:
      "",

    lastGestureType:
      "",

    lastGestureDistance:
      0,

    lastGestureDurationMs:
      0,

    lastAverageVelocityPxPerMs:
      0,

    lastReleaseVelocityPxPerMs:
      0,

    glError:
      "not-checked",

    visualPassClaimed:
      false
  };

  const state = {
    root:
      null,

    scene:
      null,

    mount:
      null,

    semanticLayer:
      null,

    receiptOutput:
      null,

    canvas:
      null,

    gl:
      null,

    program:
      null,

    attribs:
      null,

    uniforms:
      null,

    meshes:
      new Map(),

    registry:
      new Map(),

    roomProxies:
      new Map(),

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

    recessionName:
      "NORMAL",

    recession:
      RECESSION.NORMAL,

    constellationQuaternion:
      [0, 0, 0, 1],

    constellationTargetQuaternion:
      [0, 0, 0, 1],

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

    camera: {
      eye:
        [0, 0.78, 6.7],

      target:
        [0, 0, 0],

      nextEye:
        [0, 0.78, 6.7],

      nextTarget:
        [0, 0, 0]
    },

    time:
      0,

    lastTime:
      0,

    raf:
      0,

    running:
      false,

    reducedMotion:
      false,

    pointer:
      null,

    suppressClickUntil:
      0,

    atmosphere: {
      stars:
        [],

      initialized:
        false,

      canvas:
        null,

      context:
        null
    }
  };

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uNormalMatrix;
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vHaloPass;

    void main() {
      vec3 pos = aPosition;

      if (uHaloPass > 0.5) {
        pos += normalize(aNormal) * uHaloExpansion;
      }

      vec4 world = uModel * vec4(pos, 1.0);
      vec4 view = uView * world;

      vNormal = normalize(uNormalMatrix * aNormal);
      vColor = aColor;
      vViewPosition = view.xyz;
      vWorldPosition = world.xyz;
      vHaloPass = uHaloPass;

      gl_Position = uProjection * view;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
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

    uniform vec3 uKeyLight;
    uniform vec3 uFillLight;
    uniform vec3 uRimLight;
    uniform vec3 uAmbientColor;

    float hash31(vec3 p) {
      return fract(
        sin(
          dot(
            p,
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
      vec3 n =
        normalize(vNormal);

      vec3 viewDir =
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
          n,
          viewDir
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

      float key =
        max(
          dot(
            n,
            normalize(
              -uKeyLight
            )
          ),
          0.0
        );

      float fill =
        max(
          dot(
            n,
            normalize(
              -uFillLight
            )
          ),
          0.0
        );

      float rear =
        max(
          dot(
            n,
            normalize(
              -uRimLight
            )
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

      float facing =
        pow(
          max(
            dot(
              reflect(
                normalize(
                  uKeyLight
                ),
                n
              ),
              viewDir
            ),
            0.0
          ),
          28.0
        );

      float facetBand =
        pow(
          abs(
            dot(
              n,
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
              n +
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

      vec3 spec =
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
            spec +
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

  function normalizeWing(
    value
  ) {
    const wing =
      String(value || "")
        .trim()
        .toLowerCase();

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeRoomId(
    value
  ) {
    return String(value || "")
      .trim();
  }

  function cssEscape(
    value
  ) {
    const text =
      String(value || "");

    if (
      globalThis.CSS &&
      typeof globalThis.CSS.escape ===
        "function"
    ) {
      return globalThis.CSS.escape(
        text
      );
    }

    return text.replace(
      /["\\]/g,
      "\\$&"
    );
  }

  function emitReceipt(
    extra = {}
  ) {
    const frameCluster =
      state.frame &&
      state.frame.cluster
        ? state.frame.cluster
        : null;

    Object.assign(
      RECEIPT,
      {
        status:
          RECEIPT.status ||
          "available",

        recessionProfile:
          state.recessionName,

        sphericalConstellationEnabled:
          true,

        sphericalClustersEnabled:
          true,

        coordinateSystem:
          SPHERE.coordinateSystem,

        orientationRepresentation:
          SPHERE.orientationRepresentation,

        primaryWing:
          state.visualPrimaryWing ||
          state.settledPrimaryWing ||
          "north",

        activeClusterWing:
          frameCluster
            ? frameCluster.wing
            : "",

        primaryRoom:
          frameCluster
            ? (
                state.visualPrimaryRooms.get(
                  frameCluster.wing
                ) ||
                frameCluster.primaryRoom ||
                ""
              )
            : "",

        gestureActive:
          Boolean(
            state.pointer &&
            state.pointer.dragging
          ),

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
      state.root.dataset.compassCrystalsReceipt =
        serialized;

      state.root.dataset.compassCrystalsStatus =
        RECEIPT.status;

      state.root.dataset.visualPassClaimed =
        "false";
    }

    if (state.canvas) {
      state.canvas.dataset.compassCrystalsReceipt =
        serialized;

      state.canvas.dataset.visualPassClaimed =
        "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value =
        serialized;

      state.receiptOutput.textContent =
        serialized;

      state.receiptOutput.dataset.visualPassClaimed =
        "false";
    }

    globalThis.DGB_COMPASS_CRYSTALS_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });
  }

  function emitFailure(
    reason
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

      glError:
        String(
          reason ||
          "UNKNOWN_ERROR"
        )
    });

    globalThis.dispatchEvent(
      new CustomEvent(
        "COMPASS_CRYSTALS_RENDER_FAILURE",
        {
          detail:
            Object.freeze({
              reason:
                String(
                  reason ||
                  "UNKNOWN_ERROR"
                )
            })
        }
      )
    );
  }

  function vectorLength(
    vector
  ) {
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

  function dot(
    a,
    b
  ) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function cross(
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

  function subtract(
    a,
    b
  ) {
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
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
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
        a,
        b
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
      angle * 0.5;

    const sine =
      Math.sin(
        half
      );

    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
  }

  function quaternionRotateVector(
    quaternion,
    vector
  ) {
    const q =
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
          q,
          pure
        ),
        quaternionConjugate(q)
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
      (
        from[0] * to[0] +
        from[1] * to[1] +
        from[2] * to[2] +
        from[3] * to[3]
      );

    if (cosine < 0) {
      to = [
        -to[0],
        -to[1],
        -to[2],
        -to[3]
      ];

      cosine =
        -cosine;
    }

    if (cosine > 0.9995) {
      return quaternionNormalize([
        from[0] +
          (
            to[0] -
            from[0]
          ) *
          amount,

        from[1] +
          (
            to[1] -
            from[1]
          ) *
          amount,

        from[2] +
          (
            to[2] -
            from[2]
          ) *
          amount,

        from[3] +
          (
            to[3] -
            from[3]
          ) *
          amount
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

    const weightFrom =
      Math.sin(
        (
          1 -
          amount
        ) *
        theta
      ) /
      sineTheta;

    const weightTo =
      Math.sin(
        amount *
        theta
      ) /
      sineTheta;

    return quaternionNormalize([
      from[0] * weightFrom +
        to[0] * weightTo,

      from[1] * weightFrom +
        to[1] * weightTo,

      from[2] * weightFrom +
        to[2] * weightTo,

      from[3] * weightFrom +
        to[3] * weightTo
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

  function constellationQuaternionFromFrame(
    frame
  ) {
    if (
      frame &&
      frame.orbitOrientation
    ) {
      return orientationQuaternion(
        frame.orbitOrientation,
        state.constellationTargetQuaternion
      );
    }

    const serialized =
      state.root &&
      state.root.dataset
        ? state.root.dataset
            .orbitQuaternion
        : "";

    if (serialized) {
      try {
        return quaternionNormalize(
          JSON.parse(
            serialized
          ),
          state.constellationTargetQuaternion
        );
      } catch (_) {}
    }

    return state.constellationTargetQuaternion.slice();
  }

  function clusterQuaternionFromFrame(
    frame,
    wing
  ) {
    if (
      frame &&
      frame.cluster &&
      frame.cluster.wing === wing &&
      frame.cluster.orientation
    ) {
      return orientationQuaternion(
        frame.cluster.orientation,
        state.clusterTargetQuaternions.get(
          wing
        ) ||
        [0, 0, 0, 1]
      );
    }

    const serialized =
      state.root &&
      state.root.dataset &&
      state.root.dataset
        .activeClusterWing === wing
        ? state.root.dataset
            .clusterQuaternion
        : "";

    if (serialized) {
      try {
        return quaternionNormalize(
          JSON.parse(
            serialized
          ),
          state.clusterTargetQuaternions.get(
            wing
          ) ||
          [0, 0, 0, 1]
        );
      } catch (_) {}
    }

    return (
      state.clusterTargetQuaternions.get(
        wing
      ) ||
      [0, 0, 0, 1]
    ).slice();
  }

  function getControllerFrame() {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    if (
      api &&
      typeof api.getFrameState ===
        "function"
    ) {
      return api.getFrameState();
    }

    const dataset =
      state.root &&
      state.root.dataset
        ? state.root.dataset
        : {};

    let orbitQuaternion =
      state.constellationTargetQuaternion.slice();

    if (
      dataset.orbitQuaternion
    ) {
      try {
        orbitQuaternion =
          quaternionNormalize(
            JSON.parse(
              dataset.orbitQuaternion
            )
          );
      } catch (_) {}
    }

    let clusterQuaternion = [
      0,
      0,
      0,
      1
    ];

    if (
      dataset.clusterQuaternion
    ) {
      try {
        clusterQuaternion =
          quaternionNormalize(
            JSON.parse(
              dataset.clusterQuaternion
            )
          );
      } catch (_) {}
    }

    const activeWing =
      normalizeWing(
        dataset.activeClusterWing
      );

    return Object.freeze({
      state:
        dataset.compassMode ||
        "CONSTELLATION",

      orbitFocus:
        dataset.orbitFocus ||
        "north",

      orbitPreviewFocus:
        dataset.orbitPreviewFocus ||
        dataset.orbitFocus ||
        "north",

      orbitPhase:
        dataset.orbitPhase ||
        "COMMITTED",

      orbitGestureActive:
        dataset.orbitGestureActive ===
        "true",

      orbitOrientation:
        Object.freeze({
          quaternion:
            Object.freeze(
              orbitQuaternion
            ),

          primaryId:
            dataset.orbitPreviewFocus ||
            dataset.orbitFocus ||
            "north"
        }),

      activeClusterWing:
        activeWing,

      cluster:
        activeWing
          ? Object.freeze({
              wing:
                activeWing,

              roomIds:
                Object.freeze([]),

              primaryRoom:
                dataset.clusterPrimaryRoom ||
                "",

              previewPrimaryRoom:
                dataset.clusterPreviewPrimaryRoom ||
                "",

              phase:
                dataset.clusterPhase ||
                "COMMITTED",

              gestureActive:
                dataset.clusterGestureActive ===
                "true",

              revision:
                Number(
                  dataset.clusterRevision ||
                  0
                ),

              orientation:
                Object.freeze({
                  quaternion:
                    Object.freeze(
                      clusterQuaternion
                    ),

                  primaryId:
                    dataset.clusterPreviewPrimaryRoom ||
                    dataset.clusterPrimaryRoom ||
                    ""
                })
            })
          : null,

      selectedCardinal:
        dataset.selectedCardinal ||
        "",

      selectedRoom:
        dataset.selectedRoom ||
        "",

      selectedDestinationType:
        dataset.selectedDestinationType ||
        "",

      selectedDestinationId:
        dataset.selectedDestinationId ||
        "",

      selectedDestinationLabel:
        dataset.selectedDestinationLabel ||
        "",

      selectedRoute:
        dataset.selectedRoute ||
        "",

      reducedMotion:
        dataset.reducedMotion ===
        "true",

      prominence:
        Object.freeze({
          compass:
            Number(
              dataset.compassProminence ||
              1
            ),

          window:
            Number(
              dataset.windowProminence ||
              0
            )
        })
    });
  }

  function recessionNameForFrame(
    frame
  ) {
    if (!frame) {
      return "NORMAL";
    }

    if (
      frame.state ===
      "MIRRORLAND_REVEALING"
    ) {
      return "REVEALING";
    }

    if (
      frame.state ===
      "MIRRORLAND_FOCUSED"
    ) {
      return "FOCUSED";
    }

    if (
      frame.state ===
      "MIRRORLAND_WITHDRAWING"
    ) {
      return "WITHDRAWING";
    }

    if (
      frame.state ===
      "NAVIGATING"
    ) {
      return "NAVIGATING";
    }

    if (
      frame.state ===
      "HELD"
    ) {
      return "HELD";
    }

    return "NORMAL";
  }

  function updateRecessionProfile() {
    state.recessionName =
      recessionNameForFrame(
        state.frame
      );

    state.recession =
      RECESSION[
        state.recessionName
      ] ||
      RECESSION.NORMAL;
  }

  function isMirrorlandLifecycleState() {
    return (
      state.recessionName ===
        "REVEALING" ||
      state.recessionName ===
        "FOCUSED" ||
      state.recessionName ===
        "WITHDRAWING" ||
      state.recessionName ===
        "NAVIGATING"
    );
  }

  function constellationCanRotate() {
    return Boolean(
      state.frame &&
      state.frame.state ===
        "CONSTELLATION" &&
      state.recession.interactive &&
      !isMirrorlandLifecycleState()
    );
  }

  function clusterCanRotate() {
    return Boolean(
      state.frame &&
      (
        state.frame.state ===
          "CLUSTER_OPEN" ||
        state.frame.state ===
          "ROOM_SELECTED"
      ) &&
      state.frame.cluster &&
      state.frame.cluster.wing &&
      state.recession.interactive &&
      !isMirrorlandLifecycleState()
    );
  }

  function activeOutwardMultiplier() {
    const aspect =
      state.cssWidth /
      Math.max(
        1,
        state.cssHeight
      );

    return aspect <
      QUALITY.mobileAspectThreshold
      ? state.recession.outwardMobile
      : state.recession.outwardDesktop;
  }

  function createCanvas() {
    const existing =
      qs(
        "canvas[data-compass-crystals-canvas]",
        state.mount
      );

    if (existing) {
      return existing;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.dataset.compassCrystalsCanvas =
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

  function getGL(
    canvas
  ) {
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

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(
        type
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
      const info =
        gl.getShaderInfoLog(
          shader
        ) ||
        "UNKNOWN_SHADER_ERROR";

      gl.deleteShader(
        shader
      );

      throw new Error(
        info
      );
    }

    return shader;
  }

  function createProgram(
    gl
  ) {
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

    gl.deleteShader(
      vertex
    );

    gl.deleteShader(
      fragment
    );

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

      throw new Error(
        info
      );
    }

    return program;
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

  function rotateX4(
    angle
  ) {
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

  function rotateY4(
    angle
  ) {
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

  function rotateZ4(
    angle
  ) {
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
        fieldOfView / 2
      );

    const range =
      1 /
      (
        near -
        far
      );

    return [
      factor / aspect, 0, 0, 0,
      0, factor, 0, 0,
      0, 0,
      (far + near) * range, -1,
      0, 0,
      2 * far * near * range, 0
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
        )
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

  function normalMatrix3(
    model
  ) {
    return [
      model[0],
      model[1],
      model[2],

      model[4],
      model[5],
      model[6],

      model[8],
      model[9],
      model[10]
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
      radius * 0.46;

    const depth =
      options.depth ||
      0.42;

    const crown =
      options.crown ||
      0.22;

    const color =
      options.color ||
      STAR_PALETTE.north;

    const warmth =
      options.warmth ||
      0;

    const vertices = [];
    const faces = [];

    function add(
      point
    ) {
      vertices.push(
        point
      );

      return vertices.length -
        1;
    }

    function face(
      a,
      b,
      c
    ) {
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
        index % 2 ===
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
        Math.PI / 2;

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
            faceIndex % 7
          ) *
          0.034;

        const sparkleLift =
          faceIndex % 5 === 0
            ? 0.13
            : 0;

        [a, b, c].forEach(
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
                  warmth * 0.06 +
                  sparkleLift,
                1
              ),

              Math.min(
                color[1] *
                  lift +
                  warmth * 0.04 +
                  sparkleLift,
                1
              ),

              Math.min(
                color[2] *
                  lift +
                  warmth * 0.02 +
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

  function roomColorForWing(
    wing
  ) {
    if (wing === "north") {
      return STAR_PALETTE.roomNorth;
    }

    if (wing === "east") {
      return STAR_PALETTE.roomEast;
    }

    if (wing === "south") {
      return STAR_PALETTE.roomSouth;
    }

    return STAR_PALETTE.roomWest;
  }

  function buildMeshes(
    gl
  ) {
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

              radius:
                0.72,

              inner:
                0.30,

              depth:
                0.42,

              crown:
                0.20,

              color:
                STAR_PALETTE[wing],

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
      roomIndex,
      roomCount,
      meshKey,
      baseMaterial:
        material,
      material,
      phase,
      visible:
        true,

      sphereVector:
        type ===
        NODE_TYPES.CARDINAL
          ? SPHERE.constellation
              .vectors[
                wing
              ].slice()
          : clusterBaseVector(
              roomIndex,
              roomCount
            ),

      depthScore:
        0,

      primaryScore:
        0,

      transform: {
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
          1,

        halo:
          0,

        rotationSpeed:
          0.12,

        float:
          0
      },

      target: {
        x:
          0,

        y:
          0,

        z:
          0,

        sx:
          1,

        sy:
          1,

        sz:
          1,

        prominence:
          1,

        halo:
          0,

        rotationSpeed:
          0.12,

        float:
          0
      }
    };
  }

  function buildRegistry() {
    const registry =
      new Map();

    WINGS.forEach(
      (
        wing,
        wingIndex
      ) => {
        const semantic =
          qs(
            `[data-compass-cardinal][data-wing="${wing}"]`,
            state.root
          );

        if (!semantic) {
          throw new Error(
            `CARDINAL_SEMANTIC_NOT_FOUND:${wing}`
          );
        }

        registry.set(
          wing,

          makeNode({
            id:
              wing,

            type:
              NODE_TYPES.CARDINAL,

            wing,

            label:
              semantic.dataset
                .coordinateLabel ||
              semantic.dataset.label ||
              wing,

            short:
              (
                semantic.querySelector(
                  "span:last-child"
                ) ||
                {}
              ).textContent ||
              "",

            meshKey:
              `cardinal-${wing}`,

            material:
              "CARDINAL_IDLE",

            phase:
              wingIndex * 1.37 +
              0.22
          })
        );

        const roomElements =
          qsa(
            `[data-compass-room-declarations] [data-compass-room][data-wing="${wing}"]`,
            state.root
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

            if (!id) {
              throw new Error(
                `ROOM_ID_MISSING:${wing}:${roomIndex}`
              );
            }

            registry.set(
              id,

              makeNode({
                id,

                type:
                  NODE_TYPES.ROOM,

                wing,

                label:
                  element.dataset.label ||
                  element.textContent
                    .trim(),

                short:
                  element.dataset.localFunction ||
                  "",

                roomIndex,

                roomCount:
                  roomElements.length,

                meshKey:
                  `room-${wing}`,

                material:
                  "ROOM_IDLE",

                phase:
                  wingIndex * 1.13 +
                  roomIndex * 0.47
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

    if (cardinalCount !== 4) {
      throw new Error(
        `CARDINAL_COUNT_INVALID:${cardinalCount}`
      );
    }

    if (roomCount !== 19) {
      throw new Error(
        `ROOM_COUNT_INVALID:${roomCount}`
      );
    }

    emitReceipt({
      registryCardinalCount:
        cardinalCount,

      registryRoomCount:
        roomCount,

      mirrorlandRegistryPresent:
        false
    });

    return registry;
  }

  function authoritativeRoomElement(
    roomId
  ) {
    return qs(
      `[data-compass-room-declarations] [data-compass-room][data-room-id="${cssEscape(roomId)}"]`,
      state.root
    );
  }

  function applyNonvisualProxyPresentation(
    proxy
  ) {
    proxy.style.position =
      "absolute";

    proxy.style.display =
      "block";

    proxy.style.width =
      "44px";

    proxy.style.height =
      "44px";

    proxy.style.minWidth =
      "0";

    proxy.style.maxWidth =
      "none";

    proxy.style.padding =
      "0";

    proxy.style.margin =
      "0";

    proxy.style.border =
      "0";

    proxy.style.borderRadius =
      "999px";

    proxy.style.background =
      "transparent";

    proxy.style.boxShadow =
      "none";

    proxy.style.backdropFilter =
      "none";

    proxy.style.color =
      "transparent";

    proxy.style.fontSize =
      "0";

    proxy.style.lineHeight =
      "0";

    proxy.style.overflow =
      "visible";

    proxy.style.pointerEvents =
      "none";

    proxy.style.cursor =
      "default";

    proxy.style.webkitTapHighlightColor =
      "transparent";
  }

  function createRoomProxy(
    node
  ) {
    const declaration =
      authoritativeRoomElement(
        node.id
      );

    if (!declaration) {
      throw new Error(
        `ROOM_DECLARATION_NOT_FOUND:${node.id}`
      );
    }

    const existing =
      qs(
        `[data-compass-room-proxy][data-room-id="${cssEscape(node.id)}"]`,
        state.semanticLayer
      );

    if (existing) {
      applyNonvisualProxyPresentation(
        existing
      );

      existing.textContent =
        "";

      return existing;
    }

    const proxy =
      document.createElement(
        "button"
      );

    proxy.type =
      "button";

    proxy.className =
      "compass-room-proxy-control";

    proxy.dataset.compassRoomProxy =
      "true";

    proxy.dataset.compassDestination =
      "true";

    proxy.setAttribute(
      "data-compass-room",
      ""
    );

    proxy.dataset.roomId =
      node.id;

    proxy.dataset.wing =
      node.wing;

    proxy.dataset.destinationType =
      declaration.dataset
        .destinationType ||
      "petal";

    proxy.dataset.destinationId =
      declaration.dataset
        .destinationId ||
      node.id;

    proxy.dataset.label =
      declaration.dataset.label ||
      node.label;

    proxy.dataset.route =
      declaration.dataset.route ||
      declaration.getAttribute(
        "href"
      ) ||
      "";

    proxy.dataset.preview =
      declaration.dataset.preview ||
      "";

    proxy.dataset.localCoordinate =
      declaration.dataset
        .localCoordinate ||
      "";

    proxy.dataset.localFunction =
      declaration.dataset
        .localFunction ||
      node.short ||
      "";

    proxy.dataset.whyEnter =
      declaration.dataset.whyEnter ||
      "";

    proxy.dataset.selected =
      "false";

    proxy.dataset.primary =
      "false";

    proxy.dataset.presentation =
      "nonvisual";

    proxy.setAttribute(
      "aria-label",
      `${node.label}. ${
        node.short ||
        "Open this Compass path."
      }`
    );

    proxy.textContent =
      "";

    applyNonvisualProxyPresentation(
      proxy
    );

    state.semanticLayer.appendChild(
      proxy
    );

    return proxy;
  }

  function buildRoomProxies() {
    const proxies =
      new Map();

    state.registry.forEach(
      node => {
        if (
          node.type !==
          NODE_TYPES.ROOM
        ) {
          return;
        }

        proxies.set(
          node.id,
          createRoomProxy(
            node
          )
        );
      }
    );

    if (proxies.size !== 19) {
      throw new Error(
        `ROOM_PROXY_COUNT_INVALID:${proxies.size}`
      );
    }

    emitReceipt({
      roomProxyCount:
        proxies.size,

      roomProxyPresentation:
        "NONVISUAL_ACCESSIBILITY_CONTROL"
    });

    return proxies;
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
      state.constellationQuaternion
  ) {
    const base =
      SPHERE.constellation
        .vectors[
          wing
        ] ||
      SPHERE.constellation
        .vectors.north;

    return normalizeVector(
      quaternionRotateVector(
        quaternion,
        base
      )
    );
  }

  function rotatedRoomUnitVector(
    node,
    quaternion
  ) {
    return normalizeVector(
      quaternionRotateVector(
        quaternion,
        node.sphereVector
      )
    );
  }

  function nearestPrimaryWing(
    quaternion =
      state.constellationQuaternion
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
          bestScore =
            score;

          bestWing =
            wing;
        }
      }
    );

    return bestWing;
  }

  function activeRoomNodes(
    wing
  ) {
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
    quaternion
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
        const vector =
          rotatedRoomUnitVector(
            node,
            quaternion
          );

        const score =
          dot(
            vector,
            anchor
          );

        if (score > bestScore) {
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
    currentQuaternion
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
      return currentQuaternion.slice();
    }

    const currentVector =
      rotatedRoomUnitVector(
        node,
        currentQuaternion
      );

    const alignment =
      quaternionFromUnitVectors(
        currentVector,
        clusterAnchorVector()
      );

    return quaternionNormalize(
      quaternionMultiply(
        alignment,
        currentQuaternion
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
    quaternion
  ) {
    const unit =
      rotatedRoomUnitVector(
        node,
        quaternion
      );

    return {
      unit,

      x:
        unit[0] *
        SPHERE.cluster
          .horizontalRadius,

      y:
        unit[1] *
        SPHERE.cluster
          .verticalRadius,

      z:
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
        "constellation"
    ) {
      state.constellationTargetQuaternion =
        state.pointer
          .currentQuaternion
          .slice();

      state.constellationQuaternion =
        state.pointer
          .currentQuaternion
          .slice();
    } else {
      state.constellationTargetQuaternion =
        frameConstellationQuaternion;

      if (state.reducedMotion) {
        state.constellationQuaternion =
          frameConstellationQuaternion.slice();
      } else {
        state.constellationQuaternion =
          quaternionSlerp(
            state.constellationQuaternion,
            state.constellationTargetQuaternion,
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
        const frameQuaternion =
          clusterQuaternionFromFrame(
            state.frame,
            wing
          );

        if (
          state.pointer &&
          state.pointer.dragging &&
          state.pointer.gestureScope ===
            "cluster" &&
          state.pointer.wing ===
            wing
        ) {
          state.clusterTargetQuaternions.set(
            wing,
            state.pointer
              .currentQuaternion
              .slice()
          );

          state.clusterQuaternions.set(
            wing,
            state.pointer
              .currentQuaternion
              .slice()
          );

          return;
        }

        state.clusterTargetQuaternions.set(
          wing,
          frameQuaternion.slice()
        );

        const current =
          state.clusterQuaternions.get(
            wing
          ) ||
          frameQuaternion.slice();

        if (state.reducedMotion) {
          state.clusterQuaternions.set(
            wing,
            frameQuaternion.slice()
          );

          return;
        }

        state.clusterQuaternions.set(
          wing,
          quaternionSlerp(
            current,
            frameQuaternion,
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

  function updateTargets() {
    const frame =
      state.frame;

    const recession =
      state.recession;

    const outward =
      activeOutwardMultiplier();

    const mirrorlandActive =
      isMirrorlandLifecycleState();

    const activeWing =
      normalizeWing(
        frame.selectedCardinal ||
        frame.activeClusterWing ||
        frame.orbitFocus
      ) ||
      "north";

    const clusterOpen =
      frame.state ===
        "CLUSTER_OPEN" ||
      frame.state ===
        "ROOM_SELECTED" ||
      (
        mirrorlandActive &&
        Boolean(
          frame.selectedCardinal
        )
      );

    state.visualPrimaryWing =
      nearestPrimaryWing(
        state.constellationQuaternion
      );

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

    if (!clusterOpen) {
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

          const committedPrimary =
            wing ===
            frame.orbitFocus;

          node.visible =
            true;

          node.depthScore =
            sphere.depth;

          node.primaryScore =
            sphere.primary;

          node.material =
            primary
              ? "CARDINAL_FOCUSED"
              : committedPrimary
                ? "CARDINAL_SELECTED"
                : "CARDINAL_IDLE";

          const depthScale =
            0.72 +
            sphere.depth *
            0.42;

          const primaryLift =
            primary
              ? 1.14
              : 1;

          const ordinaryScale =
            (
              primary
                ? QUALITY
                    .focusedCardinalScale
                : committedPrimary
                  ? QUALITY
                      .cardinalScale *
                    1.06
                  : QUALITY
                      .cardinalScale
            ) *
            depthScale *
            primaryLift;

          const prominence =
            (
              0.34 +
              sphere.depth *
              0.46 +
              sphere.primary *
              0.30
            ) *
            recession.prominence;

          const halo =
            (
              0.24 +
              sphere.depth *
              0.34 +
              sphere.primary *
              0.54
            ) *
            recession.halo;

          const rotationSpeed =
            (
              primary
                ? 0.16
                : 0.08 +
                  sphere.depth *
                  0.05
            ) *
            recession.rotation;

          const float =
            (
              primary
                ? 0.012
                : 0.004 +
                  sphere.depth *
                  0.005
            ) *
            recession.float;

          setTarget(
            node,
            withUniformScale(
              {
                x:
                  sphere.x *
                  outward,

                y:
                  sphere.y *
                  outward,

                z:
                  sphere.z +
                  recession.zOffset,

                prominence:
                  clamp(
                    prominence,
                    0.10,
                    1.12
                  ),

                halo:
                  clamp(
                    halo,
                    0,
                    1.24
                  ),

                rotationSpeed,

                float
              },

              ordinaryScale *
              recession.scale
            )
          );
        }
      );

      state.camera.nextEye = [
        0,
        0.76,

        state.cssWidth /
          Math.max(
            1,
            state.cssHeight
          ) <
        QUALITY.mobileAspectThreshold
          ? 7.30
          : 6.20
      ];

      state.camera.nextTarget = [
        0,
        0.03,
        0.06
      ];

      return;
    }

    const clusterQuaternion =
      state.clusterQuaternions.get(
        activeWing
      ) ||
      [0, 0, 0, 1];

    const primaryRoom =
      nearestPrimaryRoom(
        activeWing,
        clusterQuaternion
      );

    state.visualPrimaryRooms.set(
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
            clusterQuaternion
          );

        const selected =
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
          0.70 +
          sphere.depth *
          0.38;

        const primaryLift =
          primary
            ? 1.14
            : 1;

        const selectedLift =
          selected
            ? 1.08
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
          (
            0.30 +
            sphere.depth *
            0.48 +
            sphere.primary *
            0.28 +
            (
              selected
                ? 0.08
                : 0
            )
          ) *
          recession.prominence;

        const halo =
          (
            0.20 +
            sphere.depth *
            0.30 +
            sphere.primary *
            0.44 +
            (
              selected
                ? 0.18
                : 0
            )
          ) *
          recession.halo;

        const rotationSpeed =
          (
            primary ||
            selected
              ? 0.13
              : 0.07 +
                sphere.depth *
                0.04
          ) *
          recession.rotation;

        const float =
          (
            primary ||
            selected
              ? 0.012
              : 0.004 +
                sphere.depth *
                0.004
          ) *
          recession.float;

        setTarget(
          node,
          withUniformScale(
            {
              x:
                sphere.x *
                outward,

              y:
                (
                  sphere.y -
                  0.08
                ) *
                outward,

              z:
                sphere.z +
                0.18 +
                recession.zOffset,

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

            ordinaryScale *
            recession.scale
          )
        );
      }
    );

    state.camera.nextEye = [
      0,
      0.62,

      state.cssWidth /
        Math.max(
          1,
          state.cssHeight
        ) <
      QUALITY.mobileAspectThreshold
        ? 7.62
        : 6.08
    ];

    state.camera.nextTarget = [
      0,
      0.02,
      0.06
    ];
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
          current.rx =
            0;

          current.ry =
            0;

          current.rz =
            0;

          return;
        }

        current.rz +=
          deltaTime *
          current.rotationSpeed;

        current.ry =
          Math.sin(
            state.time * 0.42 +
            node.phase
          ) *
          QUALITY.maxYaw *
          Math.max(
            0.35,
            current.prominence
          );

        current.rx =
          Math.sin(
            state.time * 0.31 +
            node.phase * 0.73
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
          state.camera.eye[index],
          state.camera
            .nextEye[index],
          speed
        );

      state.camera.target[index] =
        lerp(
          state.camera.target[index],
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
            state.time * 0.95 +
            node.roomIndex * 0.72 +
            node.phase
          ) *
          transform.float;

    const haloScale =
      haloPass
        ? 1 +
          transform.halo * 0.10
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

  function projectNode(
    node
  ) {
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
      clip[0] /
      clip[3];

    const y =
      clip[1] /
      clip[3];

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
          ) /
          2
        ) *
        state.cssWidth,

      y:
        (
          (
            1 - y
          ) /
          2
        ) *
        state.cssHeight
    };
  }

  function semanticElementForNode(
    node
  ) {
    if (
      node.type ===
      NODE_TYPES.CARDINAL
    ) {
      return qs(
        `[data-compass-cardinal][data-wing="${node.wing}"]`,
        state.semanticLayer
      );
    }

    if (
      node.type ===
      NODE_TYPES.ROOM
    ) {
      return (
        state.roomProxies.get(
          node.id
        ) ||
        null
      );
    }

    return null;
  }

  function syncCardinalSemanticNode(
    node,
    element,
    screen
  ) {
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

    const selected =
      state.frame.selectedCardinal ===
      node.wing;

    const depth =
      clamp(
        node.depthScore,
        0,
        1
      );

    const scale =
      (
        0.64 +
        depth * 0.22 +
        (
          primary
            ? 0.18
            : 0
        )
      ) *
      state.recession.labelScale;

    const opacity =
      clamp(
        (
          0.22 +
          depth * 0.54 +
          (
            primary
              ? 0.24
              : 0
          )
        ) *
        state.recession.labelOpacity,
        0.10,
        1
      );

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
      String(opacity);

    const interactive =
      state.recession.interactive &&
      node.transform.prominence >=
        0.12;

    element.style.pointerEvents =
      interactive
        ? "auto"
        : "none";

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
  }

  function syncRoomProxyNode(
    node,
    element,
    screen
  ) {
    applyNonvisualProxyPresentation(
      element
    );

    element.textContent =
      "";

    element.style.left =
      `${screen.x}px`;

    element.style.top =
      `${screen.y}px`;

    element.style.right =
      "auto";

    element.style.bottom =
      "auto";

    element.style.transform =
      "translate(-50%, -50%)";

    element.style.opacity =
      "1";

    element.style.zIndex =
      String(
        10 +
        Math.round(
          node.depthScore * 80
        ) +
        (
          node.primaryScore > 0.92
            ? 20
            : 0
        )
      );

    element.style.pointerEvents =
      "none";

    const keyboardAvailable =
      state.recession.interactive &&
      node.visible &&
      node.transform.prominence >=
        0.18;

    element.setAttribute(
      "aria-hidden",
      keyboardAvailable
        ? "false"
        : "true"
    );

    element.tabIndex =
      keyboardAvailable
        ? 0
        : -1;

    const selected =
      state.frame.selectedRoom ===
      node.id;

    const activeWing =
      state.frame.cluster
        ? state.frame.cluster.wing
        : "";

    const primaryRoom =
      activeWing
        ? state.visualPrimaryRooms.get(
            activeWing
          )
        : "";

    const primary =
      node.id ===
      primaryRoom;

    element.dataset.selected =
      selected
        ? "true"
        : "false";

    element.dataset.primary =
      primary
        ? "true"
        : "false";

    element.dataset.depth =
      clamp(
        node.depthScore,
        0,
        1
      ).toFixed(4);

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

  function hideSemanticNode(
    node,
    element
  ) {
    if (
      node.type ===
      NODE_TYPES.ROOM
    ) {
      applyNonvisualProxyPresentation(
        element
      );
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
  }

  function syncSemanticNode(
    node
  ) {
    const element =
      semanticElementForNode(
        node
      );

    if (!element) {
      return;
    }

    const screen =
      node.visible &&
      node.transform.prominence >=
        0.08
        ? projectNode(node)
        : null;

    if (!screen) {
      hideSemanticNode(
        node,
        element
      );

      return;
    }

    if (
      node.type ===
      NODE_TYPES.ROOM
    ) {
      syncRoomProxyNode(
        node,
        element,
        screen
      );

      return;
    }

    syncCardinalSemanticNode(
      node,
      element,
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
      rect.width <=
        QUALITY
          .atmosphereReductionWidthPx ||
      (
        navigator.hardwareConcurrency &&
        navigator.hardwareConcurrency <=
          4
      );

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
      state.canvas.width !==
        width ||
      state.canvas.height !==
        height
    ) {
      state.canvas.width =
        width;

      state.canvas.height =
        height;
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

    state.width =
      width;

    state.height =
      height;

    state.pixelRatio =
      pixelRatio;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function bindAttrib(
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

  function effectiveControllerProminence() {
    const controllerValue =
      Number(
        state.frame.prominence &&
        state.frame.prominence
          .compass !==
        undefined
          ? state.frame.prominence
              .compass
          : 1
      );

    return Math.max(
      controllerValue,
      state.recession
        .controllerProminenceFloor
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

    const softness =
      state.recession.material;

    gl.uniform1f(
      state.uniforms.twinkle,

      state.reducedMotion
        ? 0
        : softness
    );

    gl.uniform1f(
      state.uniforms.sparkle,

      state.reducedMotion
        ? 0
        : material.sparkle *
          softness
    );

    gl.uniform1f(
      state.uniforms.prominence,
      prominence
    );

    gl.uniform1f(
      state.uniforms.specular,
      material.specular *
      softness
    );

    gl.uniform1f(
      state.uniforms.rim,
      material.rim *
      softness
    );

    gl.uniform1f(
      state.uniforms.emissive,
      material.emissive *
      softness
    );

    gl.uniform1f(
      state.uniforms.alpha,
      material.alpha
    );

    gl.uniform1f(
      state.uniforms.contrast,

      1 +
      (
        material.contrast -
        1
      ) *
      softness
    );

    gl.uniform1f(
      state.uniforms.haloStrength,

      bloomDisabled
        ? 0
        : material.halo *
          haloStrength *
          softness
    );

    gl.uniform1f(
      state.uniforms.saturation,
      state.recession.saturation
    );
  }

  function drawNode(
    node,
    haloPass
  ) {
    if (
      !node.visible ||
      node.transform.prominence <
        0.04
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
      state.uniforms.normalMatrix,
      false,
      new Float32Array(
        normalMatrix3(
          model
        )
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
      state.uniforms.haloExpansion,
      0.075
    );

    applyMaterial(
      node.material,

      node.transform.prominence *
      effectiveControllerProminence(),

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

    const averageVelocity =
      distance /
      durationMs;

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

    const releaseVelocity =
      releaseDistance /
      releaseDuration;

    let pathLength =
      0;

    let previous = {
      x:
        pointer.startX,

      y:
        pointer.startY
    };

    pointer.samples.forEach(
      sample => {
        pathLength +=
          Math.hypot(
            sample.x -
            previous.x,

            sample.y -
            previous.y
          );

        previous =
          sample;
      }
    );

    pathLength +=
      Math.hypot(
        endX -
        previous.x,

        endY -
        previous.y
      );

    const pathEfficiency =
      pathLength > 0
        ? distance /
          pathLength
        : 1;

    const absX =
      Math.abs(dx);

    const absY =
      Math.abs(dy);

    const directionalRatio =
      Math.max(
        absX,
        absY
      ) /
      Math.max(
        1,
        Math.min(
          absX,
          absY
        )
      );

    const lastSample =
      pointer.samples.length
        ? pointer.samples[
            pointer.samples.length -
            1
          ]
        : null;

    const pauseBeforeRelease =
      lastSample
        ? Math.max(
            0,
            endTime -
            lastSample.time
          )
        : durationMs;

    return {
      dx,
      dy,
      distance,
      durationMs,
      averageVelocity,
      releaseVelocity,
      pathLength,
      pathEfficiency,
      directionalRatio,
      pauseBeforeRelease
    };
  }

  function isQuickClusterFlick(
    metrics
  ) {
    return (
      metrics.durationMs <=
        GESTURE
          .flickMaximumDurationMs &&
      metrics.distance >=
        GESTURE
          .flickMinimumDistancePx &&
      metrics.averageVelocity >=
        GESTURE
          .flickMinimumAverageVelocityPxPerMs &&
      metrics.releaseVelocity >=
        GESTURE
          .flickMinimumReleaseVelocityPxPerMs &&
      metrics.directionalRatio >=
        GESTURE
          .flickMinimumDirectionalRatio &&
      metrics.pauseBeforeRelease <=
        GESTURE
          .flickMaximumPauseBeforeReleaseMs &&
      (
        1 -
        metrics.pathEfficiency
      ) <=
        GESTURE
          .flickMaximumPathEfficiencyLoss
    );
  }

  function findHitAtClientPoint(
    clientX,
    clientY,
    allowedTypes = null
  ) {
    if (!state.recession.interactive) {
      return null;
    }

    const rect =
      state.scene
        .getBoundingClientRect();

    const x =
      clientX -
      rect.left;

    const y =
      clientY -
      rect.top;

    const baseRadius =
      Math.max(
        42,
        Math.min(
          82,
          rect.width * 0.092
        )
      );

    let best =
      null;

    let bestScore =
      Infinity;

    state.registry.forEach(
      node => {
        if (
          allowedTypes &&
          !allowedTypes.includes(
            node.type
          )
        ) {
          return;
        }

        if (
          !node.visible ||
          node.transform.prominence <
            0.10
        ) {
          return;
        }

        const screen =
          projectNode(
            node
          );

        if (!screen) {
          return;
        }

        const depthBonus =
          node.depthScore * 16;

        const radius =
          baseRadius +
          depthBonus;

        const distance =
          Math.hypot(
            x -
            screen.x,
            y -
            screen.y
          );

        if (distance > radius) {
          return;
        }

        const depthPenalty =
          (
            1 -
            node.depthScore
          ) *
          12;

        const score =
          distance +
          depthPenalty;

        if (score < bestScore) {
          best =
            node;

          bestScore =
            score;
        }
      }
    );

    return best;
  }

  function blockedSemanticControl(
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
        "[data-compass-enter]",
        "[data-compass-return-to-orbit]",
        "[data-compass-mirrorland-back]",
        "[data-compass-lens-tab]",
        "[data-compass-lens-panel] a",
        "[data-compass-panel] a",
        "[data-compass-panel] button",
        "summary",
        "input",
        "textarea",
        "select"
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
      return {
        territory:
          POINTER_TERRITORIES
            .OUTSIDE_SCENE,

        nodeId:
          ""
      };
    }

    if (
      event.target &&
      event.target.closest &&
      event.target.closest(
        "[data-compass-object='mirrorland']"
      )
    ) {
      return {
        territory:
          POINTER_TERRITORIES
            .MIRRORLAND_THRESHOLD,

        nodeId:
          ""
      };
    }

    if (
      blockedSemanticControl(
        event.target
      )
    ) {
      return {
        territory:
          POINTER_TERRITORIES
            .BLOCKED_CONTROL,

        nodeId:
          ""
      };
    }

    const semanticCardinal =
      event.target &&
      event.target.closest
        ? event.target.closest(
            "[data-compass-cardinal]"
          )
        : null;

    if (semanticCardinal) {
      return {
        territory:
          POINTER_TERRITORIES
            .RENDERED_CARDINAL,

        nodeId:
          normalizeWing(
            semanticCardinal.dataset.wing ||
            semanticCardinal.dataset.cardinalId
          )
      };
    }

    const roomProxy =
      event.target &&
      event.target.closest
        ? event.target.closest(
            "[data-compass-room-proxy]"
          )
        : null;

    if (roomProxy) {
      return {
        territory:
          POINTER_TERRITORIES
            .RENDERED_ROOM,

        nodeId:
          normalizeRoomId(
            roomProxy.dataset.roomId
          )
      };
    }

    if (!state.recession.interactive) {
      return {
        territory:
          POINTER_TERRITORIES
            .EMPTY_SCENE,

        nodeId:
          ""
      };
    }

    const cardinalHit =
      findHitAtClientPoint(
        event.clientX,
        event.clientY,
        [
          NODE_TYPES.CARDINAL
        ]
      );

    if (cardinalHit) {
      return {
        territory:
          POINTER_TERRITORIES
            .RENDERED_CARDINAL,

        nodeId:
          cardinalHit.id
      };
    }

    const roomHit =
      findHitAtClientPoint(
        event.clientX,
        event.clientY,
        [
          NODE_TYPES.ROOM
        ]
      );

    if (roomHit) {
      return {
        territory:
          POINTER_TERRITORIES
            .RENDERED_ROOM,

        nodeId:
          roomHit.id
      };
    }

    return {
      territory:
        POINTER_TERRITORIES
          .EMPTY_SCENE,

      nodeId:
        ""
    };
  }

  function requestControllerOrbitBegin(
    pointer
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.beginOrbitGesture ===
        "function" &&
      api.beginOrbitGesture({
        quaternion:
          pointer.startQuaternion,

        primaryWing:
          state.visualPrimaryWing,

        source:
          "crystals-pointer"
      }) !== false
    );
  }

  function requestControllerOrbitPreview(
    quaternion,
    primaryWing
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.requestOrbitPreview ===
        "function" &&
      api.requestOrbitPreview({
        quaternion,
        primaryWing,
        source:
          "crystals-drag"
      }) !== false
    );
  }

  function requestControllerOrbitCommit(
    quaternion,
    primaryWing
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.requestOrbitCommit ===
        "function" &&
      api.requestOrbitCommit({
        quaternion,
        primaryWing,
        source:
          "crystals-release-snap"
      }) !== false
    );
  }

  function requestControllerOrbitCancel(
    reason
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.requestOrbitCancel ===
        "function" &&
      api.requestOrbitCancel(
        reason
      ) !== false
    );
  }

  function requestControllerClusterBegin(
    pointer
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.beginClusterGesture ===
        "function" &&
      api.beginClusterGesture(
        pointer.wing,
        {
          quaternion:
            pointer.startQuaternion,

          primaryRoom:
            state.visualPrimaryRooms.get(
              pointer.wing
            ) ||
            "",

          source:
            "crystals-cluster-pointer"
        }
      ) !== false
    );
  }

  function requestControllerClusterPreview(
    wing,
    quaternion,
    primaryRoom
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.requestClusterPreview ===
        "function" &&
      api.requestClusterPreview(
        wing,
        {
          quaternion,
          primaryRoom,
          source:
            "crystals-cluster-drag"
        }
      ) !== false
    );
  }

  function requestControllerClusterCommit(
    wing,
    quaternion,
    primaryRoom
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.requestClusterCommit ===
        "function" &&
      api.requestClusterCommit(
        wing,
        {
          quaternion,
          primaryRoom,
          source:
            "crystals-cluster-release-snap"
        }
      ) !== false
    );
  }

  function requestControllerClusterCancel(
    wing,
    reason
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.requestClusterCancel ===
        "function" &&
      api.requestClusterCancel(
        wing,
        reason
      ) !== false
    );
  }

  function requestControllerReturnToConstellation() {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    return Boolean(
      api &&
      typeof api.requestReturnToConstellation ===
        "function" &&
      api.requestReturnToConstellation({
        source:
          "cluster-flick",
        scrollToScene:
          true
      }) !== false
    );
  }

  function requestNodeSelection(
    node,
    territory
  ) {
    const api =
      globalThis
        .DGB_COMPASS_CONTROLLER;

    let available =
      false;

    if (
      node.type ===
        NODE_TYPES.CARDINAL &&
      api &&
      typeof api.requestCardinalSelection ===
        "function"
    ) {
      available =
        api.requestCardinalSelection(
          node.wing
        ) !== false;
    }

    if (
      node.type ===
        NODE_TYPES.ROOM &&
      api &&
      typeof api.requestRoomSelection ===
        "function"
    ) {
      available =
        api.requestRoomSelection(
          node.id
        ) !== false;
    }

    emitReceipt({
      status:
        available
          ? "available"
          : "held",

      lastPointerTerritory:
        territory,

      lastGestureType:
        GESTURE_TYPES.TAP,

      glError:
        available
          ? "NO_ERROR"
          : "CONTROLLER_SELECTION_API_UNAVAILABLE"
    });

    return available;
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
        dx /
        width
      ) *
      GESTURE.radiansPerViewport;

    const pitch =
      (
        dy /
        height
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

  function handlePointerDown(
    event
  ) {
    if (state.pointer) {
      return;
    }

    const classification =
      classifyPointerTerritory(
        event
      );

    if (
      classification.territory ===
        POINTER_TERRITORIES.OUTSIDE_SCENE ||
      classification.territory ===
        POINTER_TERRITORIES.BLOCKED_CONTROL ||
      classification.territory ===
        POINTER_TERRITORIES.MIRRORLAND_THRESHOLD
    ) {
      emitReceipt({
        lastPointerTerritory:
          classification.territory,

        lastGestureType:
          GESTURE_TYPES.BLOCKED
      });

      return;
    }

    const frameState =
      state.frame
        ? state.frame.state
        : "";

    const gestureScope =
      frameState ===
        "CONSTELLATION"
        ? "constellation"
        : (
            frameState ===
              "CLUSTER_OPEN" ||
            frameState ===
              "ROOM_SELECTED"
          )
          ? "cluster"
          : "";

    if (!gestureScope) {
      return;
    }

    const wing =
      gestureScope ===
        "cluster"
        ? normalizeWing(
            state.frame &&
            state.frame.cluster
              ? state.frame.cluster.wing
              : state.frame.selectedCardinal
          )
        : "";

    if (
      gestureScope ===
        "cluster" &&
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
        "constellation"
        ? state.constellationQuaternion
            .slice()
        : (
            state.clusterQuaternions.get(
              wing
            ) ||
            [0, 0, 0, 1]
          ).slice();

    const now =
      performance.now();

    state.pointer = {
      id:
        event.pointerId,

      pointerType:
        event.pointerType ||
        "unknown",

      startX:
        event.clientX,

      startY:
        event.clientY,

      lastX:
        event.clientX,

      lastY:
        event.clientY,

      startTime:
        now,

      territory:
        classification.territory,

      nodeId:
        classification.nodeId,

      gestureScope,

      wing,

      dragging:
        false,

      controllerGestureBegan:
        false,

      startQuaternion,

      currentQuaternion:
        startQuaternion.slice(),

      samples: [
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
        classification.territory,

      lastGestureType:
        GESTURE_TYPES.POINTER_DOWN
    });
  }

  function handlePointerMove(
    event
  ) {
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

    pointer.lastX =
      event.clientX;

    pointer.lastY =
      event.clientY;

    addPointerSample(
      pointer,
      event.clientX,
      event.clientY,
      now
    );

    const canRotate =
      pointer.gestureScope ===
        "constellation"
        ? constellationCanRotate()
        : clusterCanRotate();

    if (!canRotate) {
      return;
    }

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
          "constellation"
          ? requestControllerOrbitBegin(
              pointer
            )
          : requestControllerClusterBegin(
              pointer
            );

      state.scene.dataset.compassDragging =
        "true";

      state.root.dataset.compassDragging =
        "true";

      state.root.dataset.compassGestureScope =
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
      "constellation"
    ) {
      state.constellationQuaternion =
        pointer.currentQuaternion.slice();

      state.constellationTargetQuaternion =
        pointer.currentQuaternion.slice();

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
        status:
          "available",

        lastPointerTerritory:
          pointer.territory,

        lastGestureType:
          GESTURE_TYPES
            .CONSTELLATION_DRAG,

        lastGestureDistance:
          distance,

        primaryWing,

        gestureActive:
          true,

        glError:
          "NO_ERROR"
      });

      return;
    }

    state.clusterQuaternions.set(
      pointer.wing,
      pointer.currentQuaternion.slice()
    );

    state.clusterTargetQuaternions.set(
      pointer.wing,
      pointer.currentQuaternion.slice()
    );

    const primaryRoom =
      nearestPrimaryRoom(
        pointer.wing,
        pointer.currentQuaternion
      );

    state.visualPrimaryRooms.set(
      pointer.wing,
      primaryRoom
    );

    requestControllerClusterPreview(
      pointer.wing,
      pointer.currentQuaternion,
      primaryRoom
    );

    emitReceipt({
      status:
        "available",

      lastPointerTerritory:
        pointer.territory,

      lastGestureType:
        GESTURE_TYPES.CLUSTER_DRAG,

      lastGestureDistance:
        distance,

      activeClusterWing:
        pointer.wing,

      primaryRoom,

      gestureActive:
        true,

      glError:
        "NO_ERROR"
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
      pointer.currentQuaternion.slice();

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

    state.constellationTargetQuaternion =
      settledQuaternion.slice();

    if (state.reducedMotion) {
      state.constellationQuaternion =
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

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

      lastAverageVelocityPxPerMs:
        metrics.averageVelocity,

      lastReleaseVelocityPxPerMs:
        metrics.releaseVelocity,

      primaryWing,

      gestureActive:
        false,

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
    if (
      isQuickClusterFlick(
        metrics
      )
    ) {
      requestControllerClusterCancel(
        pointer.wing,
        "cluster-flick-return"
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

        lastPointerTerritory:
          pointer.territory,

        lastGestureType:
          GESTURE_TYPES
            .CLUSTER_FLICK_RETURN,

        lastGestureDistance:
          metrics.distance,

        lastGestureDurationMs:
          metrics.durationMs,

        lastAverageVelocityPxPerMs:
          metrics.averageVelocity,

        lastReleaseVelocityPxPerMs:
          metrics.releaseVelocity,

        activeClusterWing:
          pointer.wing,

        gestureActive:
          false,

        glError:
          returned
            ? "NO_ERROR"
            : "CONTROLLER_RETURN_TO_CONSTELLATION_UNAVAILABLE"
      });

      return;
    }

    const currentQuaternion =
      pointer.currentQuaternion.slice();

    const primaryRoom =
      nearestPrimaryRoom(
        pointer.wing,
        currentQuaternion
      );

    const settledQuaternion =
      settledClusterQuaternion(
        primaryRoom,
        pointer.wing,
        currentQuaternion
      );

    state.clusterTargetQuaternions.set(
      pointer.wing,
      settledQuaternion.slice()
    );

    if (state.reducedMotion) {
      state.clusterQuaternions.set(
        pointer.wing,
        settledQuaternion.slice()
      );
    }

    state.visualPrimaryRooms.set(
      pointer.wing,
      primaryRoom
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

      lastPointerTerritory:
        pointer.territory,

      lastGestureType:
        GESTURE_TYPES.CLUSTER_SETTLE,

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

      lastAverageVelocityPxPerMs:
        metrics.averageVelocity,

      lastReleaseVelocityPxPerMs:
        metrics.releaseVelocity,

      activeClusterWing:
        pointer.wing,

      primaryRoom,

      gestureActive:
        false,

      glError:
        committed
          ? "NO_ERROR"
          : "CONTROLLER_CLUSTER_COMMIT_UNAVAILABLE"
    });
  }

  function finishTap(
    pointer,
    event,
    metrics
  ) {
    if (!state.recession.interactive) {
      return;
    }

    let node =
      pointer.nodeId
        ? state.registry.get(
            pointer.nodeId
          )
        : null;

    if (!node) {
      node =
        findHitAtClientPoint(
          event.clientX,
          event.clientY
        );
    }

    if (!node) {
      emitReceipt({
        lastPointerTerritory:
          pointer.territory,

        lastGestureType:
          GESTURE_TYPES.EMPTY_TAP,

        lastGestureDistance:
          metrics.distance,

        lastGestureDurationMs:
          metrics.durationMs
      });

      return;
    }

    const frameState =
      state.frame
        ? state.frame.state
        : "";

    if (
      node.type ===
        NODE_TYPES.CARDINAL &&
      frameState !==
        "CONSTELLATION"
    ) {
      return;
    }

    if (
      node.type ===
        NODE_TYPES.ROOM &&
      frameState !==
        "CLUSTER_OPEN" &&
      frameState !==
        "ROOM_SELECTED"
    ) {
      return;
    }

    state.suppressClickUntil =
      performance.now() +
      GESTURE.suppressClickMs;

    event.preventDefault();

    requestNodeSelection(
      node,
      pointer.territory
    );
  }

  function clearGestureDatasets() {
    state.scene.dataset.compassDragging =
      "false";

    state.root.dataset.compassDragging =
      "false";

    state.root.dataset.compassGestureScope =
      "";
  }

  function handlePointerUp(
    event
  ) {
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

    if (
      pointer.dragging &&
      pointer.gestureScope ===
        "constellation"
    ) {
      finishConstellationDrag(
        pointer,
        event,
        metrics
      );

      return;
    }

    if (
      pointer.dragging &&
      pointer.gestureScope ===
        "cluster"
    ) {
      finishClusterDrag(
        pointer,
        event,
        metrics
      );

      return;
    }

    if (
      metrics.distance <=
        GESTURE.maximumTapDistancePx
    ) {
      finishTap(
        pointer,
        event,
        metrics
      );

      return;
    }

    if (pointer.controllerGestureBegan) {
      if (
        pointer.gestureScope ===
        "constellation"
      ) {
        requestControllerOrbitCancel(
          "ambiguous-release"
        );
      } else {
        requestControllerClusterCancel(
          pointer.wing,
          "ambiguous-release"
        );
      }
    }

    emitReceipt({
      lastPointerTerritory:
        pointer.territory,

      lastGestureType:
        GESTURE_TYPES.AMBIGUOUS,

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

      lastAverageVelocityPxPerMs:
        metrics.averageVelocity,

      lastReleaseVelocityPxPerMs:
        metrics.releaseVelocity,

      gestureActive:
        false
    });
  }

  function handlePointerCancel(
    event
  ) {
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

    if (pointer.controllerGestureBegan) {
      if (
        pointer.gestureScope ===
        "constellation"
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
      "constellation"
    ) {
      state.constellationTargetQuaternion =
        pointer.startQuaternion.slice();
    } else {
      state.clusterTargetQuaternions.set(
        pointer.wing,
        pointer.startQuaternion.slice()
      );
    }

    clearGestureDatasets();

    emitReceipt({
      lastPointerTerritory:
        pointer.territory,

      lastGestureType:
        GESTURE_TYPES.CANCELLED,

      gestureActive:
        false
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
    state.scene.style.touchAction =
      "none";

    state.scene.style.overscrollBehavior =
      "contain";

    state.scene.style.webkitUserSelect =
      "none";

    state.scene.style.userSelect =
      "none";

    state.scene.dataset.compassDragging =
      "false";

    state.root.dataset.compassDragging =
      "false";

    state.root.dataset.compassGestureScope =
      "";

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

  function drawAtmosphere() {
    const context =
      state.atmosphere.context;

    if (!context) {
      return;
    }

    const width =
      state.cssWidth;

    const height =
      state.cssHeight;

    context.clearRect(
      0,
      0,
      width,
      height
    );

    const reduced =
      width <=
      QUALITY
        .atmosphereReductionWidthPx;

    const count =
      reduced
        ? 34
        : 78;

    if (
      !state.atmosphere.initialized ||
      state.atmosphere.stars.length !==
        count
    ) {
      state.atmosphere.stars =
        Array.from(
          {
            length:
              count
          },

          (
            _,
            index
          ) => ({
            x:
              (
                Math.sin(
                  index * 47.17
                ) *
                0.5 +
                0.5
              ) *
              width,

            y:
              (
                Math.sin(
                  index * 19.31 +
                  1.8
                ) *
                0.5 +
                0.5
              ) *
              height,

            radius:
              0.45 +
              (
                index % 5
              ) *
              0.16,

            alpha:
              0.18 +
              (
                index % 7
              ) *
              0.055
          })
        );

      state.atmosphere.initialized =
        true;
    }

    const atmosphereWeight =
      state.recessionName ===
        "FOCUSED"
        ? 0.62
        : state.recessionName ===
            "REVEALING"
          ? 0.78
          : state.recessionName ===
              "WITHDRAWING"
            ? 0.72
            : state.recessionName ===
                "NAVIGATING"
              ? 0.48
              : 1;

    context.save();

    state.atmosphere.stars.forEach(
      (
        star,
        index
      ) => {
        const twinkle =
          state.reducedMotion
            ? 1
            : 0.78 +
              Math.sin(
                state.time * 0.32 +
                index * 0.73
              ) *
              0.22;

        context.beginPath();

        context.fillStyle =
          `rgba(210, 232, 255, ${
            Math.max(
              0,
              star.alpha *
              twinkle *
              atmosphereWeight
            )
          })`;

        context.arc(
          star.x,
          star.y,
          star.radius,
          0,
          Math.PI * 2
        );

        context.fill();
      }
    );

    context.strokeStyle =
      `rgba(143, 187, 224, ${
        0.10 *
        atmosphereWeight
      })`;

    context.lineWidth =
      1;

    const activeQuaternion =
      state.frame &&
      state.frame.cluster &&
      (
        state.frame.state ===
          "CLUSTER_OPEN" ||
        state.frame.state ===
          "ROOM_SELECTED"
      )
        ? (
            state.clusterQuaternions.get(
              state.frame.cluster.wing
            ) ||
            [0, 0, 0, 1]
          )
        : state.constellationQuaternion;

    const orientationVector =
      quaternionRotateVector(
        activeQuaternion,
        [0, 1, 0]
      );

    const ellipseRotation =
      clamp(
        orientationVector[0] *
        0.34,
        -0.34,
        0.34
      );

    const verticalCompression =
      0.82 +
      Math.abs(
        orientationVector[2]
      ) *
      0.18;

    context.beginPath();

    context.ellipse(
      width * 0.5,
      height * 0.5,
      width * 0.29,
      height * 0.20 *
      verticalCompression,
      ellipseRotation,
      0,
      Math.PI * 2
    );

    context.stroke();

    context.beginPath();

    context.ellipse(
      width * 0.5,
      height * 0.5,
      width * 0.36,
      height * 0.25 *
      verticalCompression,
      -ellipseRotation * 0.72,
      0,
      Math.PI * 2
    );

    context.stroke();

    context.restore();
  }

  function createAtmosphereCanvas() {
    const existing =
      qs(
        "canvas[data-compass-atmosphere-canvas]",
        state.mount
      );

    const canvas =
      existing ||
      document.createElement(
        "canvas"
      );

    if (!existing) {
      canvas.dataset.compassAtmosphereCanvas =
        "true";

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

      canvas.style.display =
        "block";

      canvas.style.pointerEvents =
        "none";

      state.mount.prepend(
        canvas
      );
    }

    state.atmosphere.canvas =
      canvas;

    state.atmosphere.context =
      canvas.getContext(
        "2d"
      );
  }

  function resizeAtmosphere() {
    const canvas =
      state.atmosphere.canvas;

    if (!canvas) {
      return;
    }

    const ratio =
      Math.min(
        state.pixelRatio,
        1.5
      );

    const width =
      Math.max(
        1,
        Math.floor(
          state.cssWidth *
          ratio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          state.cssHeight *
          ratio
        )
      );

    if (
      canvas.width !==
        width ||
      canvas.height !==
        height
    ) {
      canvas.width =
        width;

      canvas.height =
        height;

      canvas.style.width =
        `${state.cssWidth}px`;

      canvas.style.height =
        `${state.cssHeight}px`;

      state.atmosphere.context
        .setTransform(
          ratio,
          0,
          0,
          ratio,
          0,
          0
        );

      state.atmosphere.initialized =
        false;
    }
  }

  function sortNodesForDraw(
    nodes
  ) {
    return nodes.sort(
      (
        a,
        b
      ) =>
        a.transform.z -
        b.transform.z
    );
  }

  function render(
    now
  ) {
    if (!state.running) {
      return;
    }

    const seconds =
      now * 0.001;

    const deltaTime =
      state.lastTime
        ? Math.min(
            0.05,
            seconds -
            state.lastTime
          )
        : 0.016;

    state.lastTime =
      seconds;

    state.time =
      seconds;

    state.frame =
      getControllerFrame();

    state.reducedMotion =
      Boolean(
        state.frame.reducedMotion
      );

    updateRecessionProfile();

    resize();
    resizeAtmosphere();

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
          QUALITY.mobileAspectThreshold
            ? 4.45
            : 4.85
        ),

        aspect,
        0.1,
        60
      );

    drawAtmosphere();

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
      state.uniforms.keyLight,
      -0.42,
      -0.82,
      -0.68
    );

    gl.uniform3f(
      state.uniforms.fillLight,
      0.72,
      -0.24,
      -0.54
    );

    gl.uniform3f(
      state.uniforms.rimLight,
      0.08,
      0.46,
      1
    );

    gl.uniform3f(
      state.uniforms.ambientColor,
      0.10,
      0.12,
      0.18
    );

    let drawCalls =
      0;

    const bloomDisabled =
      state.cssWidth <=
      QUALITY.bloomDisableWidthPx;

    const drawNodes =
      sortNodesForDraw(
        Array.from(
          state.registry.values()
        )
      );

    if (!bloomDisabled) {
      gl.depthMask(
        false
      );

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

    gl.depthMask(
      true
    );

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

    emitReceipt({
      status:
        error ===
        gl.NO_ERROR
          ? "available"
          : "held",

      rendererInitialized:
        true,

      registryCardinalCount:
        4,

      registryRoomCount:
        19,

      mirrorlandRegistryPresent:
        false,

      roomProxyCount:
        state.roomProxies.size,

      roomProxyPresentation:
        "NONVISUAL_ACCESSIBILITY_CONTROL",

      recessionProfile:
        state.recessionName,

      primaryWing:
        state.visualPrimaryWing,

      activeClusterWing:
        state.frame.cluster
          ? state.frame.cluster.wing
          : "",

      primaryRoom:
        state.frame.cluster
          ? (
              state.visualPrimaryRooms.get(
                state.frame.cluster.wing
              ) ||
              ""
            )
          : "",

      gestureActive:
        Boolean(
          state.pointer &&
          state.pointer.dragging
        ),

      glError:
        error ===
        gl.NO_ERROR
          ? "NO_ERROR"
          : String(error),

      drawCallsLastFrame:
        drawCalls
    });

    state.raf =
      requestAnimationFrame(
        render
      );
  }

  function disposeResources() {
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
        state.pointer.gestureScope ===
        "constellation"
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

    state.roomProxies.forEach(
      proxy => {
        proxy.remove();
      }
    );

    state.meshes.clear();
    state.registry.clear();
    state.roomProxies.clear();
    state.clusterQuaternions.clear();
    state.clusterTargetQuaternions.clear();
    state.visualPrimaryRooms.clear();

    emitReceipt({
      status:
        "disposed",

      rendererInitialized:
        false,

      roomProxyCount:
        0,

      gestureActive:
        false
    });
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener(
      "webglcontextlost",
      event => {
        event.preventDefault();

        emitFailure(
          "WEBGL_CONTEXT_LOST"
        );
      }
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        emitReceipt({
          status:
            "held",

          rendererInitialized:
            false,

          glError:
            "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED"
        });
      }
    );
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-compass-root]"
      );

    if (!state.root) {
      throw new Error(
        "COMPASS_ROOT_NOT_FOUND"
      );
    }

    state.scene =
      qs(
        "[data-compass-scene]",
        state.root
      );

    if (!state.scene) {
      throw new Error(
        "COMPASS_SCENE_NOT_FOUND"
      );
    }

    state.mount =
      qs(
        "[data-compass-crystals-mount]",
        state.root
      );

    if (!state.mount) {
      throw new Error(
        "CRYSTALS_MOUNT_NOT_FOUND"
      );
    }

    state.semanticLayer =
      qs(
        "[data-compass-objects]",
        state.root
      );

    if (!state.semanticLayer) {
      throw new Error(
        "SEMANTIC_LAYER_NOT_FOUND"
      );
    }

    state.receiptOutput =
      qs(
        "[data-compass-crystals-receipt]",
        state.root
      );
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CRYSTALS =
      Object.freeze({
        contract:
          CONTRACT,

        sphere:
          SPHERE,

        gesture:
          GESTURE,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        getOrientation:
          () => {
            const clusters =
              {};

            WINGS.forEach(
              wing => {
                clusters[wing] =
                  Object.freeze({
                    quaternion:
                      Object.freeze(
                        (
                          state.clusterQuaternions.get(
                            wing
                          ) ||
                          [0, 0, 0, 1]
                        ).slice()
                      ),

                    targetQuaternion:
                      Object.freeze(
                        (
                          state.clusterTargetQuaternions.get(
                            wing
                          ) ||
                          [0, 0, 0, 1]
                        ).slice()
                      ),

                    primaryRoom:
                      state.visualPrimaryRooms.get(
                        wing
                      ) ||
                      ""
                  });
              }
            );

            return Object.freeze({
              constellation:
                Object.freeze({
                  quaternion:
                    Object.freeze(
                      state.constellationQuaternion
                        .slice()
                    ),

                  targetQuaternion:
                    Object.freeze(
                      state.constellationTargetQuaternion
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

              gestureActive:
                Boolean(
                  state.pointer &&
                  state.pointer.dragging
                )
            });
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
                "stopped"
            });
          },

        start:
          () => {
            if (
              !state.running &&
              state.gl &&
              state.program
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
          },

        dispose:
          disposeResources
      });
  }

  function initializeOrientations() {
    state.frame =
      getControllerFrame();

    const constellationQuaternion =
      constellationQuaternionFromFrame(
        state.frame
      );

    state.constellationQuaternion =
      constellationQuaternion.slice();

    state.constellationTargetQuaternion =
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
        const quaternion =
          clusterQuaternionFromFrame(
            state.frame,
            wing
          );

        state.clusterQuaternions.set(
          wing,
          quaternion.slice()
        );

        state.clusterTargetQuaternions.set(
          wing,
          quaternion.slice()
        );

        state.visualPrimaryRooms.set(
          wing,
          nearestPrimaryRoom(
            wing,
            quaternion
          )
        );
      }
    );
  }

  function init() {
    try {
      resolveDom();
      exposeApi();

      createAtmosphereCanvas();

      state.canvas =
        createCanvas();

      const gl =
        getGL(
          state.canvas
        );

      if (!gl) {
        throw new Error(
          "WEBGL_CONTEXT_UNAVAILABLE"
        );
      }

      state.gl =
        gl;

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
        createProgram(
          gl
        );

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

          normalMatrix:
            gl.getUniformLocation(
              state.program,
              "uNormalMatrix"
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

          keyLight:
            gl.getUniformLocation(
              state.program,
              "uKeyLight"
            ),

          fillLight:
            gl.getUniformLocation(
              state.program,
              "uFillLight"
            ),

          rimLight:
            gl.getUniformLocation(
              state.program,
              "uRimLight"
            ),

          ambientColor:
            gl.getUniformLocation(
              state.program,
              "uAmbientColor"
            )
        });

      state.meshes =
        buildMeshes(
          gl
        );

      state.registry =
        buildRegistry();

      state.roomProxies =
        buildRoomProxies();

      initializeOrientations();

      bindPointerBridge();

      state.running =
        true;

      state.root.dataset.sphericalOrbitEnabled =
        "true";

      state.root.dataset.sphericalClustersEnabled =
        "true";

      state.root.dataset.orbitCoordinateSystem =
        SPHERE.coordinateSystem;

      state.root.dataset.orbitRepresentation =
        SPHERE.orientationRepresentation;

      emitReceipt({
        status:
          "available",

        rendererInitialized:
          true,

        registryCardinalCount:
          4,

        registryRoomCount:
          19,

        mirrorlandRegistryPresent:
          false,

        roomProxyCount:
          state.roomProxies.size,

        roomProxyPresentation:
          "NONVISUAL_ACCESSIBILITY_CONTROL",

        recessionProfile:
          "NORMAL",

        sphericalConstellationEnabled:
          true,

        sphericalClustersEnabled:
          true,

        primaryWing:
          state.visualPrimaryWing,

        gestureActive:
          false,

        glError:
          "NO_ERROR"
      });

      state.raf =
        requestAnimationFrame(
          render
        );
    } catch (error) {
      emitFailure(
        `CRYSTALS_INIT_FAILURE:${
          error &&
          error.message
            ? error.message
            : String(error)
        }`
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
