/* /products/archcoin/index.crystals.js
   ARCHCOIN compositor-integrated crystals renderer.

   Module:
   DGB_ARCHCOIN_CRYSTALS
   1.3.0-compositor-extracted-crystal-renderer

   Controller anchor:
   DGB_ARCHCOIN_CONTROLLER
   6.0.1-controller-presentation-and-native-home-corrections

   Compositor anchor:
   DGB_ARCHCOIN_COMPOSITOR
   1.0.0-camera-depth-layer-orchestration

   Owned:
   - crystal meshes and materials;
   - cardinal and room spherical geometry;
   - constellation and cluster quaternion state;
   - crystal target positions and animation;
   - WebGL programs, buffers, and crystal drawing;
   - canonical semantic-control relocation and projection association;
   - controller-facing orbit and cluster gestures;
   - cluster-exit gesture behavior.

   Not owned:
   - camera eye or camera target;
   - camera presets or interpolation;
   - view or projection matrices;
   - Compass-plane calculation;
   - world-to-screen mathematics;
   - depth classification;
   - rear/front canvas construction;
   - page-level layer ordering;
   - Compass navigation, geometry, state, or renderer lifecycle.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "ARCHCOIN_CRYSTALS_COMPOSITOR_INTEGRATED_RENDERER_v1",

    version:
      "1.3.0-compositor-extracted-crystal-renderer",

    file:
      "/products/archcoin/index.crystals.js",

    controllerModuleId:
      "DGB_ARCHCOIN_CONTROLLER",

    controllerModuleVersion:
      "6.0.1-controller-presentation-and-native-home-corrections",

    compositorModuleId:
      "DGB_ARCHCOIN_COMPOSITOR",

    compositorModuleVersion:
      "1.0.0-camera-depth-layer-orchestration",

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

  const GESTURE_SCOPES = Object.freeze({
    NONE:
      "",

    CONSTELLATION:
      "constellation",

    CLUSTER:
      "cluster"
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

  const QUALITY = Object.freeze({
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

    bloomDisableWidthPx:
      420,

    semanticRoomMaximumWidthPx:
      78,

    semanticRoomMaximumHeightPx:
      44,

    semanticRoomMinimumScale:
      0.54,

    semanticRoomMaximumScale:
      0.82,

    semanticCompassClearancePx:
      6,

    maximumDeltaSeconds:
      0.05,

    normalEpsilon:
      1e-7
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

    compositorModuleId:
      "",

    compositorModuleVersion:
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

    rearWebGlInitialized:
      false,

    frontWebGlInitialized:
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

    generatedRoomProxyCount:
      0,

    clonedRoomControlCount:
      0,

    projectedSelectionEnabled:
      false,

    compassCenterExclusionEnabled:
      false,

    cameraOwned:
      false,

    depthClassificationOwned:
      false,

    layerConstructionOwned:
      false,

    crystalGeometryOwned:
      true,

    semanticAssociationOwned:
      true,

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

    semanticLayer:
      null,

    compassControl:
      null,

    receiptOutput:
      null,

    controller:
      null,

    compositor:
      null,

    registry:
      new Map(),

    canonicalRoomElements:
      [],

    relocatedRoomElements:
      [],

    roomControlSnapshots:
      [],

    renderers:
      new Map(),

    frame:
      null,

    compositorFrame:
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

    clusterQuaternions:
      new Map(),

    clusterTargetQuaternions:
      new Map(),

    visualPrimaryWing:
      "north",

    settledPrimaryWing:
      "north",

    visualPrimaryRooms:
      new Map(),

    pointer:
      null,

    suppressClickUntil:
      0,

    listenersBound:
      false,

    reducedMotion:
      false,

    time:
      0,

    lastTime:
      0,

    raf:
      0,

    running:
      false,

    disposed:
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
      "ARCHCOIN_CRYSTAL_SHADER_CREATION_FAILED"
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

      throw new Error(
        information
      );
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
      "ARCHCOIN_CRYSTAL_PROGRAM_CREATION_FAILED"
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
      "ARCHCOIN_CRYSTAL_BUFFER_CREATION_FAILED"
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

  function bindAttrib(
    gl,
    buffer,
    location,
    size
  ) {
    invariant(
      location >=
        0,
      "ARCHCOIN_CRYSTAL_ATTRIBUTE_INVALID"
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

  function createRenderer(
    layer,
    cpuMeshes
  ) {
    const gl =
      layer.canvas.getContext(
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
      `ARCHCOIN_CRYSTALS_${layer.id}_WEBGL_UNAVAILABLE`
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

    const attribs =
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
      });

    const uniforms =
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
      });

    const meshes =
      new Map();

    for (
      const [key, mesh]
      of cpuMeshes.entries()
    ) {
      meshes.set(
        key,
        Object.freeze({
          vertexCount:
            mesh.vertexCount,

          position:
            createBuffer(
              gl,
              mesh.positions
            ),

          normal:
            createBuffer(
              gl,
              mesh.normals
            ),

          color:
            createBuffer(
              gl,
              mesh.colors
            )
        })
      );
    }

    const contextLost =
      event => {
        event.preventDefault();

        emitFailure(
          `ARCHCOIN_CRYSTALS_${layer.id}_CONTEXT_LOST`
        );
      };

    layer.canvas.addEventListener(
      "webglcontextlost",
      contextLost
    );

    return {
      id:
        layer.id,

      canvas:
        layer.canvas,

      gl,
      program,
      attribs,
      uniforms,
      meshes,
      contextLost
    };
  }

  function destroyRenderer(renderer) {
    if (!renderer) {
      return;
    }

    renderer.canvas
      .removeEventListener(
        "webglcontextlost",
        renderer.contextLost
      );

    for (
      const mesh
      of renderer.meshes.values()
    ) {
      renderer.gl
        .deleteBuffer(
          mesh.position
        );

      renderer.gl
        .deleteBuffer(
          mesh.normal
        );

      renderer.gl
        .deleteBuffer(
          mesh.color
        );
    }

    renderer.meshes.clear();

    renderer.gl
      .deleteProgram(
        renderer.program
      );
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

  function makeNode(options) {
    return {
      id:
        options.id,

      type:
        options.type,

      wing:
        options.wing,

      label:
        options.label,

      short:
        options.short,

      semanticElement:
        options.semanticElement,

      roomIndex:
        options.roomIndex ||
        0,

      roomCount:
        options.roomCount ||
        0,

      meshKey:
        options.meshKey,

      baseMaterial:
        options.material,

      material:
        options.material,

      phase:
        options.phase ||
        0,

      visible:
        false,

      depthLayer:
        "REAR",

      previousDepthLayer:
        "REAR",

      viewDepth:
        -Infinity,

      depthOffsetFromCompassPlane:
        -Infinity,

      sphereVector:
        options.type ===
        NODE_TYPES.CARDINAL
          ? SPHERE
              .constellation
              .vectors[
                options.wing
              ]
              .slice()
          : clusterBaseVector(
              options.roomIndex,
              options.roomCount
            ),

      depthScore:
        0,

      primaryScore:
        0,

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

  function requireController() {
    const controller =
      globalThis
        .DGB_ARCHCOIN_CONTROLLER;

    invariant(
      controller,
      "ARCHCOIN_CRYSTALS_CONTROLLER_REQUIRED"
    );

    invariant(
      controller.moduleId ===
        CONTRACT.controllerModuleId,
      "ARCHCOIN_CRYSTALS_CONTROLLER_MODULE_INVALID"
    );

    invariant(
      controller.moduleVersion ===
        CONTRACT
          .controllerModuleVersion,
      "ARCHCOIN_CRYSTALS_CONTROLLER_VERSION_INVALID"
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
          `ARCHCOIN_CRYSTALS_CONTROLLER_SURFACE_REQUIRED:${surface}`
        );
      }
    );

    return controller;
  }

  function requireCompositor() {
    const compositor =
      globalThis
        .DGB_ARCHCOIN_COMPOSITOR;

    invariant(
      compositor,
      "ARCHCOIN_CRYSTALS_COMPOSITOR_REQUIRED"
    );

    invariant(
      compositor.moduleId ===
        CONTRACT.compositorModuleId,
      "ARCHCOIN_CRYSTALS_COMPOSITOR_MODULE_INVALID"
    );

    invariant(
      compositor.moduleVersion ===
        CONTRACT
          .compositorModuleVersion,
      "ARCHCOIN_CRYSTALS_COMPOSITOR_VERSION_INVALID"
    );

    [
      "initialize",
      "beginFrame",
      "getViewMatrix",
      "getProjectionMatrix",
      "projectWorldPoint",
      "renderComposite",
      "getRearLayer",
      "getFrontLayer",
      "receipt"
    ].forEach(
      surface => {
        invariant(
          typeof compositor[
            surface
          ] ===
            "function",
          `ARCHCOIN_CRYSTALS_COMPOSITOR_SURFACE_REQUIRED:${surface}`
        );
      }
    );

    return compositor;
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-archcoin-root]"
      );

    invariant(
      state.root,
      "ARCHCOIN_CRYSTALS_ROOT_NOT_FOUND"
    );

    state.scene =
      qs(
        "[data-archcoin-scene]",
        state.root
      );

    invariant(
      state.scene,
      "ARCHCOIN_CRYSTALS_SCENE_NOT_FOUND"
    );

    state.field =
      qs(
        ".archcoin-scene__field",
        state.scene
      ) ||
      state.scene;

    state.semanticLayer =
      qs(
        "[data-archcoin-objects]",
        state.root
      );

    invariant(
      state.semanticLayer,
      "ARCHCOIN_CRYSTALS_SEMANTIC_LAYER_NOT_FOUND"
    );

    state.compassControl =
      qs(
        "[data-upstream-compass-control]",
        state.root
      );

    invariant(
      state.compassControl,
      "ARCHCOIN_CRYSTALS_COMPASS_CONTROL_NOT_FOUND"
    );

    state.receiptOutput =
      qs(
        "[data-archcoin-crystals-receipt]",
        state.root
      );
  }

  function captureAttribute(
    element,
    name
  ) {
    return Object.freeze({
      present:
        element.hasAttribute(
          name
        ),

      value:
        element.getAttribute(
          name
        )
    });
  }

  function restoreAttribute(
    element,
    name,
    snapshot
  ) {
    if (
      snapshot &&
      snapshot.present
    ) {
      element.setAttribute(
        name,
        snapshot.value
      );

      return;
    }

    element.removeAttribute(
      name
    );
  }

  function captureRoomControlSnapshot(
    element
  ) {
    return Object.freeze({
      element,

      parent:
        element.parentNode,

      nextSibling:
        element.nextSibling,

      style:
        captureAttribute(
          element,
          "style"
        ),

      ariaHidden:
        captureAttribute(
          element,
          "aria-hidden"
        ),

      tabIndex:
        captureAttribute(
          element,
          "tabindex"
        ),

      canonicalMarker:
        captureAttribute(
          element,
          "data-archcoin-canonical-room-control"
        ),

      relocationMarker:
        captureAttribute(
          element,
          "data-archcoin-relocated-to-semantic-layer"
        )
    });
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
      "ARCHCOIN_CRYSTALS_ROOM_CONTROL_COUNT_INVALID",
      {
        expected:
          16,

        actual:
          controls.length
      }
    );

    const ids =
      new Set();

    state.roomControlSnapshots =
      controls.map(
        captureRoomControlSnapshot
      );

    controls.forEach(
      element => {
        const roomId =
          normalizeRoomId(
            element.dataset
              .roomId
          );

        invariant(
          roomId,
          "ARCHCOIN_CRYSTALS_ROOM_ID_REQUIRED"
        );

        invariant(
          !ids.has(
            roomId
          ),
          `ARCHCOIN_CRYSTALS_DUPLICATE_ROOM_ID:${roomId}`
        );

        ids.add(
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
      "ARCHCOIN_CRYSTALS_ROOM_RELOCATION_FAILED"
    );

    state.semanticLayer.dataset
      .archcoinCanonicalRoomControlsRelocated =
      "true";

    state.semanticLayer.dataset
      .archcoinCanonicalRoomControlCount =
      "16";
  }

  function restoreCanonicalRoomControls() {
    for (
      const snapshot
      of state
        .roomControlSnapshots
        .slice()
        .reverse()
    ) {
      if (
        snapshot.parent &&
        snapshot.element
      ) {
        if (
          snapshot.nextSibling &&
          snapshot.nextSibling
            .parentNode ===
            snapshot.parent
        ) {
          snapshot.parent
            .insertBefore(
              snapshot.element,
              snapshot.nextSibling
            );
        } else {
          snapshot.parent
            .appendChild(
              snapshot.element
            );
        }
      }

      restoreAttribute(
        snapshot.element,
        "style",
        snapshot.style
      );

      restoreAttribute(
        snapshot.element,
        "aria-hidden",
        snapshot.ariaHidden
      );

      restoreAttribute(
        snapshot.element,
        "tabindex",
        snapshot.tabIndex
      );

      restoreAttribute(
        snapshot.element,
        "data-archcoin-canonical-room-control",
        snapshot.canonicalMarker
      );

      restoreAttribute(
        snapshot.element,
        "data-archcoin-relocated-to-semantic-layer",
        snapshot.relocationMarker
      );
    }

    state.roomControlSnapshots =
      [];

    state.canonicalRoomElements =
      [];

    state.relocatedRoomElements =
      [];
  }

  function buildRegistry() {
    const registry =
      new Map();

    const roomElements =
      canonicalRoomElements();

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
          `ARCHCOIN_CRYSTALS_CARDINAL_CONTROL_REQUIRED:${wing}`
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
              wing,

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
          `ARCHCOIN_CRYSTALS_WING_ROOM_COUNT_INVALID:${wing}`
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
              `ARCHCOIN_CRYSTALS_ROOM_ID_MISSING:${wing}:${roomIndex}`
            );

            invariant(
              !registry.has(
                id
              ),
              `ARCHCOIN_CRYSTALS_DUPLICATE_ROOM_ID:${id}`
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

    RECEIPT.cardinalCount =
      Array.from(
        registry.values()
      ).filter(
        node =>
          node.type ===
          NODE_TYPES.CARDINAL
      ).length;

    RECEIPT.roomCount =
      Array.from(
        registry.values()
      ).filter(
        node =>
          node.type ===
          NODE_TYPES.ROOM
      ).length;

    RECEIPT
      .canonicalSemanticRoomCount =
      roomElements.length;

    return registry;
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

  function clusterAnchorVectorInLocalSpace() {
    return normalizeVector(
      quaternionRotateVector(
        quaternionConjugate(
          quaternionNormalize(
            state
              .constellationQuaternion
          )
        ),
        clusterAnchorVector()
      )
    );
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

  function rotatedCardinalUnitVector(
    wing,
    quaternion =
      state
        .constellationQuaternion
  ) {
    return normalizeVector(
      quaternionRotateVector(
        quaternion,
        SPHERE.constellation
          .vectors[wing]
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

    let bestRoom =
      "";

    let bestScore =
      -Infinity;

    activeRoomNodes(
      wing
    ).forEach(
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
      clusterAnchorVectorInLocalSpace();

    let bestRoom =
      "";

    let bestScore =
      -Infinity;

    activeRoomNodes(
      wing
    ).forEach(
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
    const alignment =
      quaternionFromUnitVectors(
        rotatedCardinalUnitVector(
          wing,
          currentQuaternion
        ),
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

    const alignment =
      quaternionFromUnitVectors(
        rotatedRoomLocalUnitVector(
          node,
          currentLocalQuaternion
        ),
        clusterAnchorVectorInLocalSpace()
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

    return {
      x:
        activeWingUnit[0] *
          SPHERE.cluster
            .centerRadius +
        unit[0] *
          SPHERE.cluster
            .horizontalRadius,

      y:
        activeWingUnit[1] *
          SPHERE.cluster
            .centerRadius +
        unit[1] *
          SPHERE.cluster
            .verticalRadius,

      z:
        activeWingUnit[2] *
          SPHERE.cluster
            .centerRadius +
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

  function setUniformScale(
    target,
    scale
  ) {
    target.sx =
      scale;

    target.sy =
      scale;

    target.sz =
      scale;

    return target;
  }

  function resetNodeTargets() {
    state.registry.forEach(
      node => {
        node.visible =
          false;

        node.material =
          node.baseMaterial;

        Object.assign(
          node.target,
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

  function updateConstellationTargets() {
    state.visualPrimaryWing =
      nearestPrimaryWing();

    WINGS.forEach(
      wing => {
        const node =
          state.registry.get(
            wing
          );

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

        const scale =
          (
            primary
              ? QUALITY
                  .focusedCardinalScale
              : QUALITY
                  .cardinalScale
          ) *
          (
            0.72 +
            sphere.depth *
            0.42
          ) *
          (
            primary
              ? 1.10
              : 1
          );

        Object.assign(
          node.target,
          setUniformScale(
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

  function updateClusterTargets(
    frame,
    wing
  ) {
    const localQuaternion =
      state
        .clusterQuaternions
        .get(wing) ||
      [
        0,
        0,
        0,
        1
      ];

    const primaryRoom =
      nearestPrimaryRoom(
        wing,
        localQuaternion
      );

    state
      .visualPrimaryRooms
      .set(
        wing,
        primaryRoom
      );

    activeRoomNodes(
      wing
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
          node.id ===
          primaryRoom;

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
          (
            0.68 +
            sphere.depth *
            0.36
          ) *
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

        Object.assign(
          node.target,
          setUniformScale(
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

  function updateTargets() {
    resetNodeTargets();

    const frame =
      state.frame;

    if (
      !frame ||
      frame.held
    ) {
      state.sceneProjection =
        SCENE_PROJECTIONS.HELD;

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

      updateConstellationTargets();

      return;
    }

    const activeWing =
      normalizeWing(
        frame.activeClusterWing
      );

    if (
      frame.presentation &&
      frame.presentation
        .activeRoomCluster ===
        true &&
      frame.presentation
        .roomSelectionPermitted ===
        true &&
      activeWing
    ) {
      state.sceneProjection =
        SCENE_PROJECTIONS.CLUSTER;

      updateClusterTargets(
        frame,
        activeWing
      );

      return;
    }

    state.sceneProjection =
      SCENE_PROJECTIONS.HELD;
  }

  function updateQuaternionTargets(
    deltaSeconds
  ) {
    const frameConstellation =
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
        .constellationQuaternion =
        state.pointer
          .currentQuaternion
          .slice();

      state
        .constellationTargetQuaternion =
        state.pointer
          .currentQuaternion
          .slice();
    } else {
      state
        .constellationTargetQuaternion =
        frameConstellation
          .slice();

      state
        .constellationQuaternion =
        state.reducedMotion
          ? frameConstellation
              .slice()
          : quaternionSlerp(
              state
                .constellationQuaternion,

              state
                .constellationTargetQuaternion,

              Math.min(
                1,
                deltaSeconds *
                GESTURE.settleSpeed
              )
            );
    }

    WINGS.forEach(
      wing => {
        const frameLocal =
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
          state
            .clusterQuaternions
            .set(
              wing,
              state.pointer
                .currentQuaternion
                .slice()
            );

          state
            .clusterTargetQuaternions
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
            frameLocal.slice()
          );

        const current =
          state
            .clusterQuaternions
            .get(wing) ||
          frameLocal.slice();

        state
          .clusterQuaternions
          .set(
            wing,
            state.reducedMotion
              ? frameLocal.slice()
              : quaternionSlerp(
                  current,
                  frameLocal,
                  Math.min(
                    1,
                    deltaSeconds *
                    GESTURE.settleSpeed
                  )
                )
          );
      }
    );
  }

  function updateTransforms(
    deltaSeconds
  ) {
    const interpolation =
      state.reducedMotion
        ? 1
        : Math.min(
            1,
            deltaSeconds *
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
              node.transform[key] +
              (
                node.target[key] -
                node.transform[key]
              ) *
              interpolation;
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
          deltaSeconds *
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

  function worldCenter(node) {
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

    return [
      transform.x,
      transform.y +
        floatY,
      transform.z
    ];
  }

  function configureSharedUniforms(
    renderer
  ) {
    const gl =
      renderer.gl;

    gl.useProgram(
      renderer.program
    );

    gl.uniform3f(
      renderer.uniforms
        .keyLightView,
      -0.42,
      -0.82,
      -0.68
    );

    gl.uniform3f(
      renderer.uniforms
        .fillLightView,
      0.72,
      -0.24,
      -0.54
    );

    gl.uniform3f(
      renderer.uniforms
        .rimLightView,
      0.08,
      0.46,
      1
    );

    gl.uniform3f(
      renderer.uniforms
        .ambientColor,
      0.10,
      0.12,
      0.18
    );
  }

  function applyMaterial(
    renderer,
    materialName,
    prominence,
    haloStrength
  ) {
    const gl =
      renderer.gl;

    const material =
      MATERIALS[
        materialName
      ] ||
      MATERIALS
        .CARDINAL_IDLE;

    const bloomDisabled =
      state.compositorFrame
        .viewport
        .cssWidth <=
      QUALITY
        .bloomDisableWidthPx;

    gl.uniform1f(
      renderer.uniforms
        .twinkle,
      state.reducedMotion
        ? 0
        : 1
    );

    gl.uniform1f(
      renderer.uniforms
        .sparkle,
      state.reducedMotion
        ? 0
        : material.sparkle
    );

    gl.uniform1f(
      renderer.uniforms
        .prominence,
      prominence
    );

    gl.uniform1f(
      renderer.uniforms
        .specular,
      material.specular
    );

    gl.uniform1f(
      renderer.uniforms
        .rim,
      material.rim
    );

    gl.uniform1f(
      renderer.uniforms
        .emissive,
      material.emissive
    );

    gl.uniform1f(
      renderer.uniforms
        .alpha,
      material.alpha
    );

    gl.uniform1f(
      renderer.uniforms
        .contrast,
      material.contrast
    );

    gl.uniform1f(
      renderer.uniforms
        .haloStrength,
      bloomDisabled
        ? 0
        : material.halo *
          haloStrength
    );

    gl.uniform1f(
      renderer.uniforms
        .saturation,
      1
    );
  }

  function drawNode(
    renderer,
    node,
    haloPass
  ) {
    const mesh =
      renderer.meshes.get(
        node.meshKey
      );

    if (!mesh) {
      return 0;
    }

    const gl =
      renderer.gl;

    bindAttrib(
      gl,
      mesh.position,
      renderer.attribs
        .position,
      3
    );

    bindAttrib(
      gl,
      mesh.normal,
      renderer.attribs
        .normal,
      3
    );

    bindAttrib(
      gl,
      mesh.color,
      renderer.attribs
        .color,
      3
    );

    const model =
      modelMatrix(
        node,
        haloPass
      );

    const view =
      state.compositor
        .getViewMatrix();

    const projection =
      state.compositor
        .getProjectionMatrix();

    const normalMatrix =
      inverseTransposeNormalMatrix3(
        multiply4(
          view,
          model
        )
      );

    gl.uniformMatrix4fv(
      renderer.uniforms
        .model,
      false,
      new Float32Array(
        model
      )
    );

    gl.uniformMatrix4fv(
      renderer.uniforms
        .view,
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
        .viewNormalMatrix,
      false,
      new Float32Array(
        normalMatrix
      )
    );

    gl.uniform1f(
      renderer.uniforms
        .time,
      state.time
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
      0.075
    );

    applyMaterial(
      renderer,
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

  function drawCrystalNodes(
    renderer,
    nodes
  ) {
    const gl =
      renderer.gl;

    const layer =
      renderer.id ===
        "REAR"
        ? state.compositor
            .getRearLayer()
        : state.compositor
            .getFrontLayer();

    gl.viewport(
      0,
      0,
      layer.width,
      layer.height
    );

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
      renderer
    );

    let drawCalls =
      0;

    const bloomDisabled =
      layer.cssWidth <=
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
              renderer,
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
            renderer,
            node,
            false
          );
      }
    );

    const error =
      gl.getError();

    invariant(
      error ===
        gl.NO_ERROR,
      `ARCHCOIN_CRYSTALS_${renderer.id}_DRAW_FAILURE`,
      {
        error
      }
    );

    return Object.freeze({
      drawCalls,

      visibleNodeCount:
        nodes.length
    });
  }

  function compassRectInField() {
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

    return Boolean(
      rect &&
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

    const primary =
      node.wing ===
      state.visualPrimaryWing;

    const depth =
      clamp(
        node.depthScore,
        0,
        1
      );

    const interactive =
      state.sceneProjection ===
        SCENE_PROJECTIONS
          .CONSTELLATION &&
      node.visible &&
      node.transform
        .prominence >=
        0.12;

    const scale =
      0.64 +
      depth *
      0.22 +
      (
        primary
          ? 0.18
          : 0
      );

    element.style.left =
      `${screen.x}px`;

    element.style.top =
      `${screen.y}px`;

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

    element.dataset.active =
      interactive
        ? "true"
        : "false";

    element.dataset.primary =
      primary
        ? "true"
        : "false";

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

    const activeWing =
      normalizeWing(
        state.frame &&
        state.frame
          .activeClusterWing
      );

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
      state.frame.state ===
        "ROOM_SELECTED" &&
      state.frame.selectedRoom ===
        node.id;

    const primary =
      active &&
      node.id ===
        (
          state
            .visualPrimaryRooms
            .get(activeWing) ||
          ""
        );

    const depth =
      clamp(
        node.depthScore,
        0,
        1
      );

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
      active &&
      semanticPointIntersectsCompass(
        screen
      );

    element.style.left =
      `${screen.x}px`;

    element.style.top =
      `${screen.y}px`;

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
      active &&
      !compassProtected
        ? "auto"
        : "none";

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

  function syncSemanticObjects() {
    state.registry.forEach(
      node => {
        if (
          !node.visible ||
          node.transform
            .prominence <
            0.08
        ) {
          hideSemanticNode(
            node
          );

          return;
        }

        const screen =
          state.compositor
            .projectWorldPoint(
              worldCenter(
                node
              )
            );

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
        } else {
          syncRoomSemanticNode(
            node,
            screen
          );
        }
      }
    );
  }

  function emitReceipt(extra = {}) {
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

        compositorModuleId:
          state.compositor
            ? state.compositor
                .moduleId
            : "",

        compositorModuleVersion:
          state.compositor
            ? state.compositor
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
          state.visualPrimaryWing,

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

        canonicalRoomControlsRelocated:
          state
            .relocatedRoomElements
            .length ===
          16,

        relocatedCanonicalRoomCount:
          state
            .relocatedRoomElements
            .length,

        generatedRoomProxyCount:
          0,

        clonedRoomControlCount:
          0,

        projectedSelectionEnabled:
          false,

        compassCenterExclusionEnabled:
          false,

        cameraOwned:
          false,

        depthClassificationOwned:
          false,

        layerConstructionOwned:
          false,

        crystalGeometryOwned:
          true,

        semanticAssociationOwned:
          true,

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
        .archcoinCrystalsVersion =
        CONTRACT.version;

      state.root.dataset
        .archcoinCrystalsCameraOwned =
        "false";

      state.root.dataset
        .archcoinCrystalsDepthClassificationOwned =
        "false";

      state.root.dataset
        .archcoinCrystalsLayerConstructionOwned =
        "false";

      state.root.dataset
        .archcoinCrystalsCrystalGeometryOwned =
        "true";

      state.root.dataset
        .archcoinCompassCenterExclusionEnabled =
        "false";

      state.root.dataset
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

      lastError:
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

    const deltaSeconds =
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
        state.controller
          .getFrameState();

      state.reducedMotion =
        Boolean(
          state.frame
            .reducedMotion
        );

      state.compositorFrame =
        state.compositor
          .beginFrame({
            frame:
              state.frame,

            nowSeconds:
              seconds,

            deltaSeconds
          });

      updateQuaternionTargets(
        deltaSeconds
      );

      updateTargets();

      updateTransforms(
        deltaSeconds
      );

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

      const result =
        state.compositor
          .renderComposite({
            nodes:
              visibleNodes,

            getWorldCenter:
              worldCenter,

            getPreviousLayer:
              node =>
                node.previousDepthLayer,

            setClassification:
              (
                node,
                classification
              ) => {
                node.depthLayer =
                  classification.layer;

                node.previousDepthLayer =
                  classification.layer;

                node.viewDepth =
                  classification.viewDepth;

                node
                  .depthOffsetFromCompassPlane =
                  classification
                    .offsetFromCompassPlane;
              },

            sort:
              (
                a,
                b
              ) =>
                a.viewDepth -
                b.viewDepth,

            drawRear:
              nodes =>
                drawCrystalNodes(
                  state.renderers.get(
                    "REAR"
                  ),
                  nodes
                ),

            drawFront:
              nodes =>
                drawCrystalNodes(
                  state.renderers.get(
                    "FRONT"
                  ),
                  nodes
                )
          });

      emitReceipt({
        status:
          "available",

        rendererInitialized:
          true,

        rearDrawCallsLastFrame:
          result.rearResult
            ? result
                .rearResult
                .drawCalls
            : 0,

        frontDrawCallsLastFrame:
          result.frontResult
            ? result
                .frontResult
                .drawCalls
            : 0,

        rearVisibleObjectCount:
          result.rearNodes
            .length,

        frontVisibleObjectCount:
          result.frontNodes
            .length
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

    pointer.samples =
      pointer.samples
        .filter(
          sample =>
            sample.time >=
            time -
            Math.max(
              GESTURE
                .sampleWindowMs *
                2,
              260
            )
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

    const recent =
      pointer.samples.filter(
        sample =>
          sample.time >=
          endTime -
          GESTURE
            .sampleWindowMs
      );

    const releaseStart =
      recent.length
        ? recent[0]
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
    const viewport =
      state.compositorFrame
        .viewport;

    const yaw =
      (
        (
          clientX -
          pointer.startX
        ) /
        Math.max(
          1,
          viewport.cssWidth
        )
      ) *
      GESTURE
        .radiansPerViewport;

    const pitch =
      (
        (
          clientY -
          pointer.startY
        ) /
        Math.max(
          1,
          viewport.cssHeight
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

  function semanticNavigationControl(target) {
    return (
      target &&
      target.closest
        ? target.closest(
            "[data-archcoin-coin], [data-archcoin-room]"
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

    if (
      event.clientX <
        rect.left ||
      event.clientX >
        rect.right ||
      event.clientY <
        rect.top ||
      event.clientY >
        rect.bottom
    ) {
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

    const viewport =
      state.compositorFrame
        .viewport;

    const minimumDistance =
      Math.max(
        GESTURE
          .clusterExitMinimumDistancePx,

        Math.min(
          viewport.cssWidth,
          viewport.cssHeight
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

    try {
      event.currentTarget
        .setPointerCapture(
          event.pointerId
        );
    } catch (_) {}

    state.pointer = {
      id:
        event.pointerId,

      startX:
        event.clientX,

      startY:
        event.clientY,

      startTime:
        now,

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
          .POINTER_DOWN
    });
  }

  function handlePointerMove(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.id !==
        event.pointerId
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

    if (
      !pointer.dragging &&
      pointerDistance(
        pointer,
        event.clientX,
        event.clientY
      ) <
        GESTURE.dragDeadZonePx
    ) {
      return;
    }

    if (!pointer.dragging) {
      pointer.dragging =
        true;

      pointer
        .controllerGestureBegan =
        pointer.gestureScope ===
          GESTURE_SCOPES
            .CONSTELLATION
          ? state.controller
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
          : state.controller
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
            false;

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

      state.controller
        .requestOrbitPreview({
          quaternion:
            pointer
              .currentQuaternion,

          primaryWing,

          source:
            "archcoin-crystals-empty-scene-drag"
        });

      emitReceipt({
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

    state.controller
      .requestClusterPreview(
        pointer.wing,
        {
          quaternion:
            pointer
              .currentQuaternion,

          primaryRoom,

          source:
            "archcoin-crystals-empty-scene-cluster-drag"
        }
      );

    emitReceipt({
      lastGestureType:
        GESTURE_TYPES
          .CLUSTER_DRAG,

      gestureActive:
        true,

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

    const settled =
      settledConstellationQuaternion(
        primaryWing,
        pointer.currentQuaternion
      );

    state.visualPrimaryWing =
      primaryWing;

    state.settledPrimaryWing =
      primaryWing;

    state
      .constellationTargetQuaternion =
      settled.slice();

    if (
      state.reducedMotion
    ) {
      state
        .constellationQuaternion =
        settled.slice();
    }

    state.controller
      .requestOrbitCommit({
        quaternion:
          settled,

        primaryWing,

        source:
          "archcoin-crystals-empty-scene-release"
      });

    state.suppressClickUntil =
      performance.now() +
      GESTURE.suppressClickMs;

    event.preventDefault();

    emitReceipt({
      lastGestureType:
        GESTURE_TYPES
          .CONSTELLATION_SETTLE,

      primaryWing,

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

      gestureActive:
        false
    });
  }

  function finishClusterExit(
    pointer,
    event,
    metrics
  ) {
    state.controller
      .requestClusterCancel(
        pointer.wing,
        "cluster-exit-swipe"
      );

    state.controller
      .requestReturnToConstellation({
        scrollToScene:
          false,

        source:
          "archcoin-crystals-cluster-exit-swipe"
      });

    state.suppressClickUntil =
      performance.now() +
      GESTURE.suppressClickMs;

    event.preventDefault();

    emitReceipt({
      lastGestureType:
        GESTURE_TYPES
          .CLUSTER_EXIT,

      lastClusterExitQualified:
        true,

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

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

    const settled =
      settledClusterQuaternion(
        primaryRoom,
        pointer.wing,
        pointer.currentQuaternion
      );

    state
      .clusterTargetQuaternions
      .set(
        pointer.wing,
        settled.slice()
      );

    if (
      state.reducedMotion
    ) {
      state
        .clusterQuaternions
        .set(
          pointer.wing,
          settled.slice()
        );
    }

    state.controller
      .requestClusterCommit(
        pointer.wing,
        {
          quaternion:
            settled,

          primaryRoom,

          source:
            "archcoin-crystals-empty-scene-cluster-release"
        }
      );

    state.suppressClickUntil =
      performance.now() +
      GESTURE.suppressClickMs;

    event.preventDefault();

    emitReceipt({
      lastGestureType:
        GESTURE_TYPES
          .CLUSTER_SETTLE,

      primaryRoom,

      lastGestureDistance:
        metrics.distance,

      lastGestureDurationMs:
        metrics.durationMs,

      gestureActive:
        false
    });
  }

  function handlePointerUp(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.id !==
        event.pointerId
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
    } else {
      finishClusterDrag(
        pointer,
        event,
        metrics
      );
    }
  }

  function handlePointerCancel(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.id !==
        event.pointerId
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
        state.controller
          .requestOrbitCancel(
            "pointer-cancel"
          );
      } else {
        state.controller
          .requestClusterCancel(
            pointer.wing,
            "pointer-cancel"
          );
      }
    }

    clearGestureDatasets();

    emitReceipt({
      lastGestureType:
        GESTURE_TYPES.CANCELLED,

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

    state.scene.style.userSelect =
      "none";

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
      !state.listenersBound
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

  function initializeOrientations() {
    state.frame =
      state.controller
        .getFrameState();

    const constellation =
      constellationQuaternionFromFrame(
        state.frame
      );

    state
      .constellationQuaternion =
      constellation.slice();

    state
      .constellationTargetQuaternion =
      constellation.slice();

    state.visualPrimaryWing =
      nearestPrimaryWing(
        constellation
      );

    state.settledPrimaryWing =
      normalizeWing(
        state.frame
          .orbitFocus
      ) ||
      state.visualPrimaryWing;

    WINGS.forEach(
      wing => {
        const local =
          clusterQuaternionFromFrame(
            state.frame,
            wing
          );

        state
          .clusterQuaternions
          .set(
            wing,
            local.slice()
          );

        state
          .clusterTargetQuaternions
          .set(
            wing,
            local.slice()
          );

        state
          .visualPrimaryRooms
          .set(
            wing,
            nearestPrimaryRoom(
              wing,
              local
            )
          );
      }
    );

    updateTargets();
  }

  function initializeRenderers() {
    const cpuMeshes =
      createCpuMeshes();

    state.renderers.set(
      "REAR",
      createRenderer(
        state.compositor
          .getRearLayer(),
        cpuMeshes
      )
    );

    state.renderers.set(
      "FRONT",
      createRenderer(
        state.compositor
          .getFrontLayer(),
        cpuMeshes
      )
    );
  }

  function exposeApi() {
    globalThis
      .DGB_ARCHCOIN_CRYSTALS =
      Object.freeze({
        moduleId:
          "DGB_ARCHCOIN_CRYSTALS",

        moduleVersion:
          CONTRACT.version,

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

        getSceneProjection:
          () =>
            state
              .sceneProjection,

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
                    Object.freeze({
                      layer:
                        node.depthLayer,

                      viewDepth:
                        node.viewDepth,

                      offsetFromCompassPlane:
                        node
                          .depthOffsetFromCompassPlane
                    });

                  return result;
                },
                {}
              )
            ),

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

            return true;
          },

        start:
          () => {
            if (
              !state.running &&
              !state.disposed
            ) {
              state.running =
                true;

              state.lastTime =
                0;

              state.raf =
                requestAnimationFrame(
                  render
                );
            }

            return state.running;
          },

        dispose:
          dispose
      });
  }

  function dispose() {
    if (
      state.disposed
    ) {
      return true;
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

    unbindPointerBridge();

    state.registry.forEach(
      hideSemanticNode
    );

    for (
      const renderer
      of state.renderers.values()
    ) {
      destroyRenderer(
        renderer
      );
    }

    state.renderers.clear();

    restoreCanonicalRoomControls();

    emitReceipt({
      status:
        "disposed",

      rendererInitialized:
        false,

      rearWebGlInitialized:
        false,

      frontWebGlInitialized:
        false,

      rearVisibleObjectCount:
        0,

      frontVisibleObjectCount:
        0
    });

    return true;
  }

  function rollbackInitialization() {
    unbindPointerBridge();

    for (
      const renderer
      of state.renderers.values()
    ) {
      try {
        destroyRenderer(
          renderer
        );
      } catch (_) {}
    }

    state.renderers.clear();

    restoreCanonicalRoomControls();
  }

  function init() {
    try {
      resolveDom();

      state.controller =
        requireController();

      state.compositor =
        requireCompositor();

      state.compositor
        .initialize();

      relocateCanonicalRoomControls();

      state.registry =
        buildRegistry();

      initializeRenderers();

      initializeOrientations();

      bindPointerBridge();

      exposeApi();

      state.running =
        true;

      emitReceipt({
        status:
          "available",

        rendererInitialized:
          true,

        rearWebGlInitialized:
          true,

        frontWebGlInitialized:
          true,

        canonicalRoomControlsRelocated:
          true,

        relocatedCanonicalRoomCount:
          16
      });

      state.raf =
        requestAnimationFrame(
          render
        );
    } catch (error) {
      rollbackInitialization();

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
AUDRALIA_ARCHCOIN_CRYSTALS_COMPOSITOR_EXTRACTION_RESULT_v1

Artifact:
 /products/archcoin/index.crystals.js

Module:
 DGB_ARCHCOIN_CRYSTALS
 1.3.0-compositor-extracted-crystal-renderer

Removed ownership:
- camera eye
- camera target
- camera presets
- camera interpolation
- view matrix construction
- projection matrix construction
- perspective setup
- Compass-plane calculation
- world-to-screen projection mathematics
- front/rear depth classification
- depth hysteresis ownership
- rear/front canvas construction
- page-level layer ordering

Retained ownership:
- crystal meshes
- crystal materials
- WebGL crystal programs and buffers
- cardinal geometry
- room geometry
- orbit and cluster quaternion state
- crystal target positions
- crystal animation
- crystal drawing
- canonical room-control relocation
- semantic-control association
- controller-facing orbit and cluster gestures
- cluster-exit behavior
- lifecycle and failure reporting

Controller modified:
NO

Compass files modified:
NO

Runtime execution:
NOT PERFORMED

Visual pass:
NOT CLAIMED

Production authorization:
FALSE

Deployment authorization:
FALSE
*/
