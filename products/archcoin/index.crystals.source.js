/* /products/archcoin/index.crystals.js
   ARCHCOIN controller-decoupled crystal renderer.

   Module:
   DGB_ARCHCOIN_CRYSTALS
   2.0.0-controller-decoupled-crystal-renderer

   Controller anchor:
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Compositor anchor:
   DGB_ARCHCOIN_COMPOSITOR
   1.0.0-camera-depth-layer-orchestration

   Owned:
   - crystal meshes and materials;
   - cardinal and room geometry;
   - controller-state interpolation for visual rendering;
   - crystal target positions and animation;
   - WebGL programs, buffers, and crystal drawing;
   - canonical crystal-to-semantic-control association;
   - visible-node delivery to the compositor;
   - compositor projection-record forwarding to the controller;
   - crystal-renderer lifecycle and failure reporting.

   Not owned:
   - pointer or swipe interpretation;
   - drag quaternion generation;
   - orbit or cluster gesture authority;
   - cluster-exit decisions;
   - semantic interaction authorization;
   - label styling or label offsets;
   - Compass-overlap policy;
   - camera eye or camera target;
   - view or projection matrix construction;
   - Compass-plane depth calculation;
   - front/rear classification;
   - rear/front canvas construction;
   - page-level layer ordering;
   - Compass navigation, geometry, state, or renderer lifecycle.

   Runtime flow:
   controller frame
   -> visual quaternion interpolation
   -> crystal world targets
   -> compositor depth classification
   -> rear/front WebGL drawing
   -> compositor projection records
   -> controller.updateSemanticProjection(records)
   -> CSS presents canonical labels

   Source status:
   COORDINATED_RENEWAL_SOURCE_CANDIDATE
   !=
   RUNTIME_PASS
   !=
   VISUAL_PASS
   !=
   PRODUCTION_AUTHORIZATION
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "ARCHCOIN_CRYSTALS_CONTROLLER_DECOUPLED_RENDERER_v1",

    version:
      "2.0.0-controller-decoupled-crystal-renderer",

    file:
      "/products/archcoin/index.crystals.js",

    controllerModuleId:
      "DGB_ARCHCOIN_CONTROLLER",

    controllerModuleVersion:
      "7.0.0-controller-interaction-semantic-priority",

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

  const DEPTH_LAYERS = Object.freeze({
    FRONT:
      "FRONT",

    REAR:
      "REAR"
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

    /*
     * Cardinal scale is intentionally reduced from the former renderer.
     * The crystal remains dominant without consuming the full mobile field.
     */
    cardinalScale:
      0.72,

    focusedCardinalScale:
      0.94,

    roomScale:
      0.68,

    primaryRoomScale:
      0.84,

    selectedRoomScale:
      0.91,

    visualSettleSpeed:
      7.4,

    transformSettleSpeed:
      6.2,

    maximumDeltaSeconds:
      0.05,

    maximumYaw:
      0.20,

    maximumPitch:
      0.13,

    bloomDisableWidthPx:
      420,

    normalEpsilon:
      1e-7,

    projectionVisibilityThreshold:
      0.08
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

    semanticProjectionRecordCount:
      0,

    semanticProjectionSubmitted:
      false,

    activeClusterWing:
      "",

    primaryWing:
      "north",

    primaryRoom:
      "",

    reducedMotion:
      false,

    generatedRoomProxyCount:
      0,

    clonedRoomControlCount:
      0,

    pointerInterpreterOwned:
      false,

    swipeInterpreterOwned:
      false,

    clusterExitOwned:
      false,

    semanticInteractionAuthorityOwned:
      false,

    labelPresentationOwned:
      false,

    compassOverlapPolicyOwned:
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

    receiptOutput:
      null,

    controller:
      null,

    compositor:
      null,

    compositorInitializedHere:
      false,

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

    visualPrimaryRooms:
      new Map(),

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
      gl.createShader(type);

    invariant(
      shader,
      "ARCHCOIN_CRYSTAL_SHADER_CREATION_FAILED"
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
      vertices.push(point);

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

          depth *
            0.14
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

          depth *
            0.52
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
      createProgram(gl);

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
      const [
        key,
        mesh
      ]
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

    renderer.canvas.removeEventListener(
      "webglcontextlost",
      renderer.contextLost
    );

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
    }

    renderer.meshes.clear();

    renderer.gl.deleteProgram(
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
      Math.cos(longitude) *
        cosineLatitude,

      Math.sin(latitude),

      Math.sin(longitude) *
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
        DEPTH_LAYERS.REAR,

      previousDepthLayer:
        DEPTH_LAYERS.REAR,

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

      projectedScreen:
        null,

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
      "updateSemanticProjection"
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
        "[data-archcoin-scene-field]",
        state.scene
      ) ||
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
            element.dataset.roomId
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

        state.semanticLayer.appendChild(
          element
        );

        element.dataset.archcoinCanonicalRoomControl =
          "true";

        element.dataset.archcoinRelocatedToSemanticLayer =
          "true";
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
      state.relocatedRoomElements.length ===
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
          snapshot.nextSibling.parentNode ===
            snapshot.parent
        ) {
          snapshot.parent.insertBefore(
            snapshot.element,
            snapshot.nextSibling
          );
        } else {
          snapshot.parent.appendChild(
            snapshot.element
          );
        }
      }

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
                element.dataset.wing
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
                element.dataset.roomId
              );

            invariant(
              id,
              `ARCHCOIN_CRYSTALS_ROOM_ID_MISSING:${wing}:${roomIndex}`
            );

            invariant(
              !registry.has(id),
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
                  element.dataset.label ||
                  element.textContent.trim(),

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

    RECEIPT.canonicalSemanticRoomCount =
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
      state.constellationQuaternion
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
      state.constellationQuaternion,
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

    state.visualPrimaryRooms.set(
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

  /*
   * The controller is the only authoritative quaternion owner.
   *
   * This renderer keeps interpolated visual copies only. It never creates,
   * previews, commits, cancels, or settles gesture state.
   */
  function updateQuaternionTargets(
    deltaSeconds
  ) {
    const frameConstellation =
      constellationQuaternionFromFrame(
        state.frame
      );

    state.constellationTargetQuaternion =
      frameConstellation.slice();

    state.constellationQuaternion =
      state.reducedMotion
        ? frameConstellation.slice()
        : quaternionSlerp(
            state.constellationQuaternion,
            state.constellationTargetQuaternion,
            Math.min(
              1,
              deltaSeconds *
              QUALITY
                .visualSettleSpeed
            )
          );

    WINGS.forEach(
      wing => {
        const frameLocal =
          clusterQuaternionFromFrame(
            state.frame,
            wing
          );

        state.clusterTargetQuaternions.set(
          wing,
          frameLocal.slice()
        );

        const current =
          state.clusterQuaternions.get(
            wing
          ) ||
          frameLocal.slice();

        state.clusterQuaternions.set(
          wing,
          state.reducedMotion
            ? frameLocal.slice()
            : quaternionSlerp(
                current,
                frameLocal,
                Math.min(
                  1,
                  deltaSeconds *
                  QUALITY
                    .visualSettleSpeed
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
            QUALITY
              .transformSettleSpeed
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
          QUALITY.maximumYaw *
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
          QUALITY.maximumPitch *
          Math.max(
            0.35,
            node.transform
              .prominence
          );
      }
    );
  }

  function nodeFloatY(node) {
    return state.reducedMotion
      ? 0
      : Math.sin(
          state.time *
            0.95 +
          node.roomIndex *
            0.72 +
          node.phase
        ) *
        node.transform.float;
  }

  function modelMatrix(
    node,
    haloPass
  ) {
    const transform =
      node.transform;

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
          nodeFloatY(node),
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
    return [
      node.transform.x,

      node.transform.y +
        nodeFloatY(node),

      node.transform.z
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
        DEPTH_LAYERS.REAR
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
      gl.depthMask(false);

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

    gl.depthMask(true);

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

  function projectedRadiusForNode(node) {
    const base =
      node.type ===
        NODE_TYPES.CARDINAL
        ? 78
        : 48;

    return Math.max(
      18,
      base *
      node.transform.sx
    );
  }

  /*
   * Crystals supplies identity and world position.
   * Compositor supplies screen position, depth, and overlap facts.
   * Controller supplies interaction authorization.
   * CSS supplies visible label presentation.
   */
  function buildSemanticProjectionRecords(
    visibleNodes
  ) {
    const records = [];

    visibleNodes.forEach(
      node => {
        const projected =
          state.compositor
            .projectWorldPoint(
              worldCenter(
                node
              ),
              {
                projectedRadius:
                  projectedRadiusForNode(
                    node
                  ),

                nodeId:
                  node.id,

                nodeType:
                  node.type
              }
            );

        node.projectedScreen =
          projected ||
          null;

        if (!projected) {
          records.push({
            id:
              node.id,

            kind:
              node.type,

            x:
              0,

            y:
              0,

            depthLayer:
              node.depthLayer
                .toLowerCase(),

            compassOverlap:
              false,

            visible:
              false
          });

          return;
        }

        records.push({
          id:
            node.id,

          kind:
            node.type,

          x:
            finiteNumber(
              projected.x,
              0
            ),

          y:
            finiteNumber(
              projected.y,
              0
            ),

          depthLayer:
            node.depthLayer
              .toLowerCase(),

          compassOverlap:
            Boolean(
              projected
                .compassOverlap
            ),

          visible:
            node.visible &&
            node.transform
              .prominence >=
              QUALITY
                .projectionVisibilityThreshold &&
            projected.visible !==
              false
        });
      }
    );

    return records;
  }

  function submitSemanticProjection(
    records
  ) {
    const accepted =
      state.controller
        .updateSemanticProjection(
          records
        );

    RECEIPT.semanticProjectionRecordCount =
      records.length;

    RECEIPT.semanticProjectionSubmitted =
      accepted !==
      false;
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

        pointerInterpreterOwned:
          false,

        swipeInterpreterOwned:
          false,

        clusterExitOwned:
          false,

        semanticInteractionAuthorityOwned:
          false,

        labelPresentationOwned:
          false,

        compassOverlapPolicyOwned:
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
        .archcoinCrystalsPointerInterpreterOwned =
        "false";

      state.root.dataset
        .archcoinCrystalsSwipeInterpreterOwned =
        "false";

      state.root.dataset
        .archcoinCrystalsClusterExitOwned =
        "false";

      state.root.dataset
        .archcoinCrystalsLabelPresentationOwned =
        "false";

      state.root.dataset
        .archcoinCrystalsSemanticInteractionAuthorityOwned =
        "false";

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

                node.depthOffsetFromCompassPlane =
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
                    DEPTH_LAYERS.REAR
                  ),
                  nodes
                ),

            drawFront:
              nodes =>
                drawCrystalNodes(
                  state.renderers.get(
                    DEPTH_LAYERS.FRONT
                  ),
                  nodes
                )
          });

      const projectionRecords =
        buildSemanticProjectionRecords(
          visibleNodes
        );

      submitSemanticProjection(
        projectionRecords
      );

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
            .length,

        semanticProjectionRecordCount:
          projectionRecords.length,

        semanticProjectionSubmitted:
          true
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

  function initializeOrientations() {
    state.frame =
      state.controller
        .getFrameState();

    const constellation =
      constellationQuaternionFromFrame(
        state.frame
      );

    state.constellationQuaternion =
      constellation.slice();

    state.constellationTargetQuaternion =
      constellation.slice();

    state.visualPrimaryWing =
      nearestPrimaryWing(
        constellation
      );

    WINGS.forEach(
      wing => {
        const local =
          clusterQuaternionFromFrame(
            state.frame,
            wing
          );

        state.clusterQuaternions.set(
          wing,
          local.slice()
        );

        state.clusterTargetQuaternions.set(
          wing,
          local.slice()
        );

        state.visualPrimaryRooms.set(
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
      DEPTH_LAYERS.REAR,
      createRenderer(
        state.compositor
          .getRearLayer(),
        cpuMeshes
      )
    );

    state.renderers.set(
      DEPTH_LAYERS.FRONT,
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

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        getSceneProjection:
          () =>
            state.sceneProjection,

        getRelocatedRoomControls:
          () =>
            Object.freeze(
              state.relocatedRoomElements.map(
                element =>
                  element.dataset.roomId ||
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

    try {
      state.controller
        .updateSemanticProjection([]);
    } catch (_) {}

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
        0,

      semanticProjectionRecordCount:
        0,

      semanticProjectionSubmitted:
        true
    });

    return true;
  }

  function rollbackInitialization() {
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

    /*
     * The compositor is disposed only if this initialization attempt was the
     * party that initialized it and the compositor exposes a disposal surface.
     */
    if (
      state.compositorInitializedHere &&
      state.compositor &&
      typeof state.compositor
        .dispose ===
        "function"
    ) {
      try {
        state.compositor.dispose();
      } catch (_) {}
    }
  }

  function initializeCompositor() {
    const receiptBefore =
      typeof state.compositor
        .receipt ===
        "function"
        ? state.compositor.receipt()
        : null;

    const alreadyInitialized =
      Boolean(
        receiptBefore &&
        receiptBefore.initialized
      );

    state.compositor.initialize();

    state.compositorInitializedHere =
      !alreadyInitialized;
  }

  function init() {
    try {
      resolveDom();

      state.controller =
        requireController();

      state.compositor =
        requireCompositor();

      initializeCompositor();

      relocateCanonicalRoomControls();

      state.registry =
        buildRegistry();

      initializeRenderers();

      initializeOrientations();

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
          16,

        pointerInterpreterOwned:
          false,

        swipeInterpreterOwned:
          false,

        clusterExitOwned:
          false,

        labelPresentationOwned:
          false,

        semanticInteractionAuthorityOwned:
          false
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
        once:
          true
      }
    );
  } else {
    init();
  }
})();

/*
AUDRALIA_ARCHCOIN_CRYSTALS_CONTROLLER_DECOUPLING_RESULT_v1

Artifact:
 /products/archcoin/index.crystals.js

Module:
 DGB_ARCHCOIN_CRYSTALS
 2.0.0-controller-decoupled-crystal-renderer

Controller dependency:
 DGB_ARCHCOIN_CONTROLLER
 7.0.0-controller-interaction-semantic-priority

Compositor dependency:
 DGB_ARCHCOIN_COMPOSITOR
 1.0.0-camera-depth-layer-orchestration

Removed:
- pointerdown handling
- pointermove handling
- pointerup handling
- pointercancel handling
- pointer capture
- drag dead-zone interpretation
- swipe classification
- drag quaternion generation
- orbit gesture begin calls
- orbit gesture preview calls
- orbit gesture commit calls
- orbit gesture cancel calls
- cluster gesture begin calls
- cluster gesture preview calls
- cluster gesture commit calls
- cluster gesture cancel calls
- cluster-exit classification
- cluster-exit transition calls
- post-drag click suppression
- pointer-territory classification
- Compass bounding-rectangle measurement
- Compass-overlap policy decisions
- semantic pointer-event authorization
- semantic tabindex authorization
- semantic aria-hidden authorization
- inline label position styling
- inline label transform styling
- inline label scale styling
- inline label opacity styling
- inline label size styling
- inline label typography styling

Retained:
- crystal meshes
- crystal materials
- shader programs
- WebGL buffers
- cardinal geometry
- room geometry
- controller-frame quaternion consumption
- nonauthoritative visual quaternion interpolation
- crystal target calculation
- crystal motion
- rear crystal drawing
- front crystal drawing
- canonical control association
- canonical room-control relocation
- visible-node delivery to compositor
- renderer lifecycle
- failure reporting

Added:
- controller 7.0.0 dependency
- bounded semantic projection records
- projected screen position forwarding
- compositor depth result forwarding
- compositor Compass-overlap result forwarding
- controller.updateSemanticProjection(records)
- reduced constellation crystal scale
- conditional compositor rollback disposal

Runtime authority:
- swipe remains mandatory
- swipe owner is controller
- crystals only responds visually to controller state

Controller modified:
FALSE

Compositor modified:
FALSE

HTML modified:
FALSE

CSS modified:
FALSE

Runtime execution:
NOT PERFORMED

Visual acceptance:
NOT CLAIMED

Production authorization:
FALSE

Deployment authorization:
FALSE
*/
