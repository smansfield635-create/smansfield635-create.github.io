/* /assets/compass/upstream-compass.geometry.js
   Shared fixed-center Home Compass geometry authority.

   Module:
   DGB_UPSTREAM_COMPASS_GEOMETRY
   3.0.0-fixed-center-independent-sibling

   Dependency position:
   1. /products/archcoin/index.controller.js
   2. /assets/compass/upstream-compass.geometry.js
   3. /assets/compass/upstream-compass.renderer.js
   4. /products/archcoin/index.crystals.js
   5. /products/archcoin/index.html
   6. /assets/compass/upstream-compass.css
   7. /products/archcoin/index.css

   Governing boundaries:
   - The controller owns upstream-request meaning, navigation, route law,
     held state, and the fixed-center behavioral contract.
   - This file owns only the physical Home Compass form, CPU-side mesh data,
     component dimensions, material keys, quality profiles, model bounds,
     static fallback shape data, and local visual-control alignment dimensions.
   - The renderer owns GPU resources, camera, lighting, visual interpolation,
     mounting, and enhanced/fallback presentation.
   - HTML owns the semantic control.
   - CSS presents already-closed state.

   Fixed-center transform law:
   FIXED_CENTER_PLACEMENT
   * LOCAL_PRESENTATION_TRANSFORM

   The Home Compass:
   - is a fixed-center independent sibling;
   - does not inherit navigation, constellation, or cluster orientation;
   - does not participate in navigation settlement;
   - publishes no quaternion;
   - receives no independent gesture-delta stream;
   - owns no pointer listeners;
   - owns no selection or navigation authority.

   Compatibility:
   - buildModel(options) remains the canonical construction surface.
   - buildBaselineMeshes(options) remains as a compatibility alias.
   - presentationTransforms.fixedCenter is canonical.
   - presentationTransforms.embedded is a deprecated alias to the exact same
     fixed-center transform for bounded renderer compatibility.
   - The obsolete decisionApproach transform is removed.

   Physical geometry:
   - component dimensions are unchanged;
   - shape vertex literals are unchanged;
   - material keys are unchanged;
   - quality profiles are unchanged;
   - mesh construction mathematics are unchanged;
   - radial and depth envelopes are unchanged.
*/

const DGB_UPSTREAM_COMPASS_GEOMETRY = (() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_UPSTREAM_COMPASS_GEOMETRY",
    version: "3.0.0-fixed-center-independent-sibling",
    file: "/assets/compass/upstream-compass.geometry.js"
  });

  const MODEL_ID =
    "DGB_HOME_COMPASS_FIXED_CENTER_INSTRUMENT_v3";

  const LEGACY_MODEL_IDS = Object.freeze([
    "DGB_HOME_COMPASS_EMBEDDED_INSTRUMENT_v2"
  ]);

  const OBJECT_IDENTITY = Object.freeze({
    objectClass:
      "HOME_COMPASS_FIXED_CENTER_INSTRUMENT",

    physicalProjection:
      "FIXED_CENTER_INDEPENDENT_SIBLING",

    semanticRole:
      "UPSTREAM_HOME_COMPASS",

    inheritsNavigationOrientation:
      false,

    inheritsConstellationOrientation:
      false,

    inheritsClusterOrientation:
      false,

    participatesInNavigationSettlement:
      false,

    receivesIndependentGestureDeltas:
      false,

    publishesQuaternion:
      false,

    ownsNavigation:
      false,

    ownsSelectionState:
      false,

    ownsCameraTiming:
      false,

    ownsPointerListeners:
      false
  });

  const COMPATIBILITY = Object.freeze({
    legacyModelIds:
      LEGACY_MODEL_IDS,

    embeddedTransformAlias:
      true,

    decisionApproachTransform:
      false,

    buildBaselineMeshesAlias:
      true
  });

  const EPSILON = 1e-7;
  const TAU = Math.PI * 2;

  const MATERIAL_KEYS = Object.freeze({
    OUTER_HOUSING: "OUTER_HOUSING",
    OUTER_BEZEL: "OUTER_BEZEL",
    INNER_BEZEL: "INNER_BEZEL",
    DIAL_BED: "DIAL_BED",
    PRINCIPAL_DIRECTION: "PRINCIPAL_DIRECTION",
    PRINCIPAL_DIRECTION_FACET: "PRINCIPAL_DIRECTION_FACET",
    NORTH_NEEDLE: "NORTH_NEEDLE",
    NORTH_NEEDLE_FACET: "NORTH_NEEDLE_FACET",
    HUB_BASE: "HUB_BASE",
    HUB_CROWN: "HUB_CROWN",
    HUB_JEWEL: "HUB_JEWEL",
    INTERCARDINAL_TICK: "INTERCARDINAL_TICK"
  });

  const MATERIAL_KEY_SET =
    new Set(Object.values(MATERIAL_KEYS));

  const COORDINATE_SYSTEM = Object.freeze({
    dimensionality: 3,
    handedness: "RIGHT_HANDED",

    axes: Object.freeze({
      x: "EAST_WEST",
      y: "NORTH_SOUTH",
      z: "REAR_FRONT_DEPTH"
    }),

    origin: Object.freeze([0, 0, 0]),
    north: Object.freeze([0, 1, 0]),
    east: Object.freeze([1, 0, 0]),
    south: Object.freeze([0, -1, 0]),
    west: Object.freeze([-1, 0, 0]),
    cameraFacingDirection: Object.freeze([0, 0, 1])
  });

  /*
   * All component intervals occupy one noncumulative object envelope.
   *
   * Actual occupied model depth:
   * rear-most geometry:  -0.18
   * front-most geometry:  0.30
   * total occupied depth:  0.48
   */
  const DEPTH_ENVELOPE = Object.freeze({
    rearLimitZ: -0.18,
    frontLimitZ: 0.30,
    occupiedTotalDepth: 0.48,
    absoluteRearLimitZ: -0.21,
    absoluteFrontLimitZ: 0.33,
    absoluteMaximumTotalDepth: 0.54,
    minimumInstrumentDepth: 0.40,

    componentDepthsAre:
      "BOUNDED_WITHIN_ONE_SHARED_NONCUMULATIVE_OBJECT_ENVELOPE"
  });

  const COMPONENT_DIMENSIONS = Object.freeze({
    outerHousing: Object.freeze({
      outerRadius: 1.0,
      innerRadius: 0.89,
      zRear: -0.18,
      zFront: 0.14,
      bevelDepth: 0.045,
      outerBevelWidth: 0.035,
      innerBevelWidth: 0.025
    }),

    outerBezel: Object.freeze({
      outerRadius: 0.865,
      innerRadius: 0.805,
      zRear: -0.13,
      zFront: 0.17,
      bevelDepth: 0.035,
      outerBevelWidth: 0.022,
      innerBevelWidth: 0.018
    }),

    innerBezel: Object.freeze({
      outerRadius: 0.745,
      innerRadius: 0.685,
      zRear: -0.11,
      zFront: 0.16,
      bevelDepth: 0.032,
      outerBevelWidth: 0.020,
      innerBevelWidth: 0.016
    }),

    dialBed: Object.freeze({
      radius: 0.675,
      zRear: -0.16,
      zFront: -0.035,
      bevelDepth: 0.025,
      bevelWidth: 0.025
    }),

    principalDirection: Object.freeze({
      zRear: -0.075,
      zFront: 0.17,
      bevelDepth: 0.034,
      bevelInset: 0.075
    }),

    principalDirectionFacet: Object.freeze({
      zRear: 0.135,
      zFront: 0.205,
      bevelDepth: 0.016,
      bevelInset: 0.12
    }),

    northNeedle: Object.freeze({
      zRear: -0.055,
      zFront: 0.235,
      bevelDepth: 0.040,
      bevelInset: 0.065
    }),

    northNeedleFacet: Object.freeze({
      zRear: 0.195,
      zFront: 0.30,
      bevelDepth: 0.020,
      bevelInset: 0.13
    }),

    hubBase: Object.freeze({
      radius: 0.205,
      zRear: -0.10,
      zFront: 0.205,
      bevelDepth: 0.035,
      bevelWidth: 0.025
    }),

    hubCrown: Object.freeze({
      radius: 0.145,
      zRear: 0.16,
      zFront: 0.265,
      bevelDepth: 0.025,
      bevelWidth: 0.018
    }),

    hubJewel: Object.freeze({
      radius: 0.078,
      zRear: 0.235,
      zFront: 0.292,
      bevelDepth: 0.014,
      bevelWidth: 0.012
    }),

    intercardinalTick: Object.freeze({
      radialCenter: 0.775,
      radialLength: 0.105,
      tangentialWidth: 0.035,
      zRear: -0.025,
      zFront: 0.11,
      bevelDepth: 0.018,
      bevelInset: 0.12
    })
  });

  const SHAPES = Object.freeze({
    northNeedle: Object.freeze([
      Object.freeze([0.0, 0.855]),
      Object.freeze([-0.064, 0.31]),
      Object.freeze([-0.118, 0.12]),
      Object.freeze([0.118, 0.12]),
      Object.freeze([0.064, 0.31])
    ]),

    northNeedleFacet: Object.freeze([
      Object.freeze([0.0, 0.79]),
      Object.freeze([-0.029, 0.32]),
      Object.freeze([-0.052, 0.18]),
      Object.freeze([0.052, 0.18]),
      Object.freeze([0.029, 0.32])
    ]),

    southDirection: Object.freeze([
      Object.freeze([-0.092, -0.10]),
      Object.freeze([0.0, -0.49]),
      Object.freeze([0.092, -0.10])
    ]),

    southFacet: Object.freeze([
      Object.freeze([-0.040, -0.14]),
      Object.freeze([0.0, -0.405]),
      Object.freeze([0.040, -0.14])
    ]),

    eastDirection: Object.freeze([
      Object.freeze([0.10, -0.09]),
      Object.freeze([0.47, 0.0]),
      Object.freeze([0.10, 0.09])
    ]),

    eastFacet: Object.freeze([
      Object.freeze([0.14, -0.040]),
      Object.freeze([0.385, 0.0]),
      Object.freeze([0.14, 0.040])
    ]),

    westDirection: Object.freeze([
      Object.freeze([-0.10, 0.09]),
      Object.freeze([-0.47, 0.0]),
      Object.freeze([-0.10, -0.09])
    ]),

    westFacet: Object.freeze([
      Object.freeze([-0.14, 0.040]),
      Object.freeze([-0.385, 0.0]),
      Object.freeze([-0.14, -0.040])
    ])
  });

  const QUALITY_PROFILES = Object.freeze({
    desktop: Object.freeze({
      id: "desktop",
      annulusSegments: 72,
      dialSegments: 64,
      hubSegments: 48,
      includeIntercardinalTicks: true
    }),

    mobile: Object.freeze({
      id: "mobile",
      annulusSegments: 44,
      dialSegments: 40,
      hubSegments: 32,
      includeIntercardinalTicks: true
    }),

    lowPower: Object.freeze({
      id: "lowPower",
      annulusSegments: 28,
      dialSegments: 28,
      hubSegments: 24,
      includeIntercardinalTicks: false
    })
  });

  /*
   * Canonical fixed-center local posture.
   *
   * The renderer may combine this local posture only with its own fixed-center
   * placement matrix. No ARCHCOIN orbit or cluster quaternion is permitted.
   */
  const FIXED_CENTER_TRANSFORM = Object.freeze({
    id: "fixedCenter",

    position: Object.freeze([
      0,
      0,
      0
    ]),

    quaternion: Object.freeze([
      -0.067790,
      0.105687,
      -0.007225,
      0.992061
    ]),

    scale: Object.freeze([
      1,
      1,
      1
    ])
  });

  /*
   * `embedded` is retained only as a bounded compatibility alias.
   * It is the exact same immutable transform object as `fixedCenter`.
   * It does not authorize parent-orientation inheritance.
   */
  const PRESENTATION_TRANSFORMS = Object.freeze({
    fixedCenter:
      FIXED_CENTER_TRANSFORM,

    embedded:
      FIXED_CENTER_TRANSFORM
  });

  const ROOT_TRANSFORM = Object.freeze({
    placementMode:
      "FIXED_CENTER",

    parentOrientationMode:
      "NONE",

    inheritsNavigationOrientation:
      false,

    inheritsConstellationOrientation:
      false,

    inheritsClusterOrientation:
      false,

    participatesInNavigationSettlement:
      false,

    independentGestureAuthority:
      false,

    independentSettlementAuthority:
      false,

    publishesQuaternion:
      false,

    localTransformOrder:
      "FIXED_CENTER_PLACEMENT * LOCAL_PRESENTATION_TRANSFORM",

    defaultPresentationTransform:
      PRESENTATION_TRANSFORMS.fixedCenter
  });

  /*
   * This envelope is renderer-facing alignment data only.
   * It does not grant geometry semantic-listener or pointer authority.
   */
  const VISUAL_CONTROL_ALIGNMENT_ENVELOPE = Object.freeze({
    shape:
      "CIRCULAR_DISC",

    localCenter:
      Object.freeze([
        0,
        0,
        0.04
      ]),

    radius:
      1.06,

    zInterval:
      Object.freeze([
        DEPTH_ENVELOPE.absoluteRearLimitZ,
        DEPTH_ENVELOPE.absoluteFrontLimitZ
      ]),

    preferredCssTarget:
      Object.freeze([
        44,
        44
      ]),

    governedMinimumCssTarget:
      Object.freeze([
        24,
        24
      ]),

    geometryIsSemanticListener:
      false,

    semanticControlOwnedByHtml:
      true,

    rendererMayAlignVisualModelToSemanticControl:
      true
  });

  /*
   * Deprecated public alias retained for bounded renderer compatibility.
   */
  const SEMANTIC_HIT_ENVELOPE =
    VISUAL_CONTROL_ALIGNMENT_ENVELOPE;

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

  function isFiniteNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value)
    );
  }

  function isArrayBufferView(value) {
    return (
      typeof ArrayBuffer !== "undefined" &&
      ArrayBuffer.isView(value)
    );
  }

  function cloneVector(value) {
    return Array.from(value);
  }

  function freezeVector(value) {
    return Object.freeze(
      cloneVector(value)
    );
  }

  function deepFreeze(value) {
    if (
      value === null ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    if (isArrayBufferView(value)) {
      return value;
    }

    Object.freeze(value);

    for (
      const key
      of Object.keys(value)
    ) {
      deepFreeze(value[key]);
    }

    return value;
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

  function validateSegmentCount(
    value,
    code
  ) {
    invariant(
      Number.isInteger(value) &&
      value >= 12 &&
      value <= 256,
      code,
      { value }
    );
  }

  function resolveQualityProfile(
    profile
  ) {
    if (
      typeof profile === "string" &&
      QUALITY_PROFILES[profile]
    ) {
      return QUALITY_PROFILES[profile];
    }

    if (
      profile &&
      typeof profile === "object"
    ) {
      const resolved = {
        id:
          String(
            profile.id ||
            "custom"
          ),

        annulusSegments:
          Number(
            profile.annulusSegments
          ),

        dialSegments:
          Number(
            profile.dialSegments
          ),

        hubSegments:
          Number(
            profile.hubSegments
          ),

        includeIntercardinalTicks:
          profile.includeIntercardinalTicks !==
          false
      };

      validateSegmentCount(
        resolved.annulusSegments,
        "CUSTOM_ANNULUS_SEGMENT_COUNT_INVALID"
      );

      validateSegmentCount(
        resolved.dialSegments,
        "CUSTOM_DIAL_SEGMENT_COUNT_INVALID"
      );

      validateSegmentCount(
        resolved.hubSegments,
        "CUSTOM_HUB_SEGMENT_COUNT_INVALID"
      );

      return Object.freeze(
        resolved
      );
    }

    return QUALITY_PROFILES.desktop;
  }

  function validateMaterialKey(
    materialKey
  ) {
    invariant(
      MATERIAL_KEY_SET.has(
        materialKey
      ),
      "MESH_MATERIAL_KEY_INVALID",
      { materialKey }
    );
  }

  function vectorLength3(vector) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalize3(vector) {
    const length =
      vectorLength3(vector);

    invariant(
      length > EPSILON,
      "ZERO_LENGTH_VECTOR_FORBIDDEN",
      { vector }
    );

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function subtract3(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function cross3(a, b) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function faceNormal(a, b, c) {
    return normalize3(
      cross3(
        subtract3(b, a),
        subtract3(c, a)
      )
    );
  }

  function polygonSignedArea(
    vertices
  ) {
    let area = 0;

    for (
      let index = 0;
      index < vertices.length;
      index += 1
    ) {
      const current =
        vertices[index];

      const next =
        vertices[
          (index + 1) %
          vertices.length
        ];

      area +=
        current[0] * next[1] -
        next[0] * current[1];
    }

    return area * 0.5;
  }

  function validatePolygon(
    vertices,
    code
  ) {
    invariant(
      Array.isArray(vertices) &&
      vertices.length >= 3,
      code,
      {
        reason:
          "POLYGON_REQUIRES_AT_LEAST_THREE_VERTICES"
      }
    );

    for (
      const vertex
      of vertices
    ) {
      invariant(
        Array.isArray(vertex) &&
        vertex.length === 2 &&
        vertex.every(
          isFiniteNumber
        ),
        code,
        {
          reason:
            "POLYGON_VERTEX_INVALID",
          vertex
        }
      );
    }

    invariant(
      polygonSignedArea(vertices) >
        EPSILON,
      code,
      {
        reason:
          "POLYGON_MUST_BE_COUNTERCLOCKWISE"
      }
    );
  }

  function polygonCentroid(
    vertices
  ) {
    let x = 0;
    let y = 0;

    for (
      const vertex
      of vertices
    ) {
      x += vertex[0];
      y += vertex[1];
    }

    return [
      x / vertices.length,
      y / vertices.length
    ];
  }

  function scalePolygonAroundCentroid(
    vertices,
    scale
  ) {
    invariant(
      isFiniteNumber(scale) &&
      scale > 0 &&
      scale <= 1,
      "POLYGON_SCALE_INVALID",
      { scale }
    );

    const centroid =
      polygonCentroid(vertices);

    return vertices.map(
      ([x, y]) => [
        centroid[0] +
          (
            x -
            centroid[0]
          ) *
          scale,

        centroid[1] +
          (
            y -
            centroid[1]
          ) *
          scale
      ]
    );
  }

  function createEmptyMesh(
    componentId,
    primitive,
    materialKey
  ) {
    validateMaterialKey(
      materialKey
    );

    return {
      componentId,
      primitive,
      materialKey,
      positions: [],
      normals: [],
      indices: [],
      groups: [],
      metadata: {}
    };
  }

  function pushVertex(
    mesh,
    position,
    normal
  ) {
    invariant(
      Array.isArray(position) &&
      position.length === 3 &&
      position.every(
        isFiniteNumber
      ),
      "VERTEX_POSITION_INVALID",
      {
        componentId:
          mesh.componentId,
        position
      }
    );

    invariant(
      Array.isArray(normal) &&
      normal.length === 3 &&
      normal.every(
        isFiniteNumber
      ),
      "VERTEX_NORMAL_INVALID",
      {
        componentId:
          mesh.componentId,
        normal
      }
    );

    const normalizedNormal =
      normalize3(normal);

    mesh.positions.push(
      position[0],
      position[1],
      position[2]
    );

    mesh.normals.push(
      normalizedNormal[0],
      normalizedNormal[1],
      normalizedNormal[2]
    );

    return (
      mesh.positions.length / 3 -
      1
    );
  }

  function pushTriangle(
    mesh,
    a,
    b,
    c
  ) {
    invariant(
      [a, b, c].every(
        value =>
          Number.isInteger(value) &&
          value >= 0
      ),
      "TRIANGLE_INDEX_INVALID",
      {
        componentId:
          mesh.componentId,
        indices:
          [a, b, c]
      }
    );

    mesh.indices.push(
      a,
      b,
      c
    );
  }

  function pushFlatTriangle(
    mesh,
    a,
    b,
    c,
    reverse = false
  ) {
    const normal =
      reverse
        ? faceNormal(c, b, a)
        : faceNormal(a, b, c);

    const ia =
      pushVertex(
        mesh,
        a,
        normal
      );

    const ib =
      pushVertex(
        mesh,
        b,
        normal
      );

    const ic =
      pushVertex(
        mesh,
        c,
        normal
      );

    if (reverse) {
      pushTriangle(
        mesh,
        ic,
        ib,
        ia
      );
    } else {
      pushTriangle(
        mesh,
        ia,
        ib,
        ic
      );
    }
  }

  function pushFlatQuad(
    mesh,
    a,
    b,
    c,
    d,
    reverse = false
  ) {
    const normal =
      reverse
        ? faceNormal(d, c, b)
        : faceNormal(a, b, c);

    const ia =
      pushVertex(
        mesh,
        a,
        normal
      );

    const ib =
      pushVertex(
        mesh,
        b,
        normal
      );

    const ic =
      pushVertex(
        mesh,
        c,
        normal
      );

    const id =
      pushVertex(
        mesh,
        d,
        normal
      );

    if (reverse) {
      pushTriangle(
        mesh,
        id,
        ic,
        ib
      );

      pushTriangle(
        mesh,
        id,
        ib,
        ia
      );
    } else {
      pushTriangle(
        mesh,
        ia,
        ib,
        ic
      );

      pushTriangle(
        mesh,
        ia,
        ic,
        id
      );
    }
  }

  function computeBoundsFromPositions(
    positions
  ) {
    invariant(
      positions &&
      positions.length >= 3 &&
      positions.length % 3 === 0,
      "BOUNDING_POSITION_BUFFER_INVALID"
    );

    let minimumX = Infinity;
    let minimumY = Infinity;
    let minimumZ = Infinity;
    let maximumX = -Infinity;
    let maximumY = -Infinity;
    let maximumZ = -Infinity;

    for (
      let index = 0;
      index < positions.length;
      index += 3
    ) {
      const x =
        positions[index];

      const y =
        positions[index + 1];

      const z =
        positions[index + 2];

      minimumX =
        Math.min(
          minimumX,
          x
        );

      minimumY =
        Math.min(
          minimumY,
          y
        );

      minimumZ =
        Math.min(
          minimumZ,
          z
        );

      maximumX =
        Math.max(
          maximumX,
          x
        );

      maximumY =
        Math.max(
          maximumY,
          y
        );

      maximumZ =
        Math.max(
          maximumZ,
          z
        );
    }

    return Object.freeze({
      minimum:
        freezeVector([
          minimumX,
          minimumY,
          minimumZ
        ]),

      maximum:
        freezeVector([
          maximumX,
          maximumY,
          maximumZ
        ]),

      size:
        freezeVector([
          maximumX - minimumX,
          maximumY - minimumY,
          maximumZ - minimumZ
        ]),

      center:
        freezeVector([
          (
            minimumX +
            maximumX
          ) *
          0.5,

          (
            minimumY +
            maximumY
          ) *
          0.5,

          (
            minimumZ +
            maximumZ
          ) *
          0.5
        ])
    });
  }

  function finalizeMesh(mesh) {
    validateMaterialKey(
      mesh.materialKey
    );

    invariant(
      mesh.positions.length > 0 &&
      mesh.positions.length % 3 === 0,
      "POSITION_BUFFER_ALIGNMENT_FAILURE",
      {
        componentId:
          mesh.componentId
      }
    );

    invariant(
      mesh.normals.length ===
      mesh.positions.length,
      "NORMAL_BUFFER_LENGTH_MISMATCH",
      {
        componentId:
          mesh.componentId
      }
    );

    invariant(
      mesh.indices.length > 0 &&
      mesh.indices.length % 3 === 0,
      "INDEX_BUFFER_TRIANGLE_ALIGNMENT_FAILURE",
      {
        componentId:
          mesh.componentId
      }
    );

    const vertexCount =
      mesh.positions.length / 3;

    for (
      const index
      of mesh.indices
    ) {
      invariant(
        index >= 0 &&
        index < vertexCount,
        "INDEX_OUT_OF_RANGE",
        {
          componentId:
            mesh.componentId,
          index,
          vertexCount
        }
      );
    }

    const bounds =
      computeBoundsFromPositions(
        mesh.positions
      );

    return deepFreeze({
      componentId:
        mesh.componentId,

      primitive:
        mesh.primitive,

      materialKey:
        mesh.materialKey,

      positions:
        new Float32Array(
          mesh.positions
        ),

      normals:
        new Float32Array(
          mesh.normals
        ),

      indices:
        vertexCount > 65535
          ? new Uint32Array(
              mesh.indices
            )
          : new Uint16Array(
              mesh.indices
            ),

      groups:
        mesh.groups.map(
          group =>
            Object.freeze({
              ...group
            })
        ),

      metadata:
        deepFreeze({
          ...mesh.metadata
        }),

      bounds,

      vertexCount,

      triangleCount:
        mesh.indices.length / 3
    });
  }

  function createCirclePoint(
    radius,
    theta,
    z
  ) {
    return [
      radius *
        Math.cos(theta),

      radius *
        Math.sin(theta),

      z
    ];
  }

  function pushAnnularSurfaceBand(
    mesh,
    {
      outerRadius,
      innerRadius,
      z,
      segments,
      normal
    }
  ) {
    const start =
      mesh.indices.length;

    const outer = [];
    const inner = [];

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const theta =
        TAU *
        index /
        segments;

      outer.push(
        pushVertex(
          mesh,
          createCirclePoint(
            outerRadius,
            theta,
            z
          ),
          normal
        )
      );

      inner.push(
        pushVertex(
          mesh,
          createCirclePoint(
            innerRadius,
            theta,
            z
          ),
          normal
        )
      );
    }

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        segments;

      if (normal[2] > 0) {
        pushTriangle(
          mesh,
          outer[index],
          outer[next],
          inner[index]
        );

        pushTriangle(
          mesh,
          outer[next],
          inner[next],
          inner[index]
        );
      } else {
        pushTriangle(
          mesh,
          outer[index],
          inner[index],
          outer[next]
        );

        pushTriangle(
          mesh,
          outer[next],
          inner[index],
          inner[next]
        );
      }
    }

    return {
      indexStart:
        start,

      indexCount:
        mesh.indices.length -
        start
    };
  }

  function pushCircularSlopeBand(
    mesh,
    {
      radiusA,
      zA,
      radiusB,
      zB,
      segments,
      inward = false
    }
  ) {
    const start =
      mesh.indices.length;

    const deltaRadius =
      radiusB -
      radiusA;

    const deltaZ =
      zB -
      zA;

    const radialSign =
      inward
        ? -1
        : 1;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        segments;

      const thetaA =
        TAU *
        index /
        segments;

      const thetaB =
        TAU *
        next /
        segments;

      const a =
        createCirclePoint(
          radiusA,
          thetaA,
          zA
        );

      const b =
        createCirclePoint(
          radiusA,
          thetaB,
          zA
        );

      const c =
        createCirclePoint(
          radiusB,
          thetaB,
          zB
        );

      const d =
        createCirclePoint(
          radiusB,
          thetaA,
          zB
        );

      const slopeNormalA =
        normalize3([
          radialSign *
            Math.cos(thetaA) *
            Math.abs(deltaZ),

          radialSign *
            Math.sin(thetaA) *
            Math.abs(deltaZ),

          inward
            ? Math.abs(
                deltaRadius
              )
            : -Math.abs(
                deltaRadius
              )
        ]);

      const slopeNormalB =
        normalize3([
          radialSign *
            Math.cos(thetaB) *
            Math.abs(deltaZ),

          radialSign *
            Math.sin(thetaB) *
            Math.abs(deltaZ),

          inward
            ? Math.abs(
                deltaRadius
              )
            : -Math.abs(
                deltaRadius
              )
        ]);

      const ia =
        pushVertex(
          mesh,
          a,
          slopeNormalA
        );

      const ib =
        pushVertex(
          mesh,
          b,
          slopeNormalB
        );

      const ic =
        pushVertex(
          mesh,
          c,
          slopeNormalB
        );

      const id =
        pushVertex(
          mesh,
          d,
          slopeNormalA
        );

      if (inward) {
        pushTriangle(
          mesh,
          ia,
          ic,
          ib
        );

        pushTriangle(
          mesh,
          ia,
          id,
          ic
        );
      } else {
        pushTriangle(
          mesh,
          ia,
          ib,
          ic
        );

        pushTriangle(
          mesh,
          ia,
          ic,
          id
        );
      }
    }

    return {
      indexStart:
        start,

      indexCount:
        mesh.indices.length -
        start
    };
  }

  function pushCircularWall(
    mesh,
    {
      radius,
      zRear,
      zFront,
      segments,
      inward = false
    }
  ) {
    const start =
      mesh.indices.length;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        segments;

      const thetaA =
        TAU *
        index /
        segments;

      const thetaB =
        TAU *
        next /
        segments;

      const normalA = [
        (
          inward
            ? -1
            : 1
        ) *
        Math.cos(thetaA),

        (
          inward
            ? -1
            : 1
        ) *
        Math.sin(thetaA),

        0
      ];

      const normalB = [
        (
          inward
            ? -1
            : 1
        ) *
        Math.cos(thetaB),

        (
          inward
            ? -1
            : 1
        ) *
        Math.sin(thetaB),

        0
      ];

      const aFront =
        pushVertex(
          mesh,
          createCirclePoint(
            radius,
            thetaA,
            zFront
          ),
          normalA
        );

      const bFront =
        pushVertex(
          mesh,
          createCirclePoint(
            radius,
            thetaB,
            zFront
          ),
          normalB
        );

      const aRear =
        pushVertex(
          mesh,
          createCirclePoint(
            radius,
            thetaA,
            zRear
          ),
          normalA
        );

      const bRear =
        pushVertex(
          mesh,
          createCirclePoint(
            radius,
            thetaB,
            zRear
          ),
          normalB
        );

      if (inward) {
        pushTriangle(
          mesh,
          aFront,
          aRear,
          bFront
        );

        pushTriangle(
          mesh,
          bFront,
          aRear,
          bRear
        );
      } else {
        pushTriangle(
          mesh,
          aFront,
          bFront,
          aRear
        );

        pushTriangle(
          mesh,
          bFront,
          bRear,
          aRear
        );
      }
    }

    return {
      indexStart:
        start,

      indexCount:
        mesh.indices.length -
        start
    };
  }

  function createBeveledAnnulus({
    componentId,
    materialKey,
    outerRadius,
    innerRadius,
    zRear,
    zFront,
    bevelDepth,
    outerBevelWidth,
    innerBevelWidth,
    segments
  }) {
    validateSegmentCount(
      segments,
      "ANNULUS_SEGMENT_COUNT_INVALID"
    );

    invariant(
      isFiniteNumber(
        outerRadius
      ) &&
      isFiniteNumber(
        innerRadius
      ) &&
      outerRadius >
        innerRadius &&
      innerRadius > 0,
      "ANNULUS_RADIUS_RELATION_INVALID",
      {
        componentId,
        outerRadius,
        innerRadius
      }
    );

    invariant(
      zFront > zRear,
      "ANNULUS_DEPTH_INTERVAL_INVALID",
      {
        componentId,
        zRear,
        zFront
      }
    );

    invariant(
      bevelDepth > 0 &&
      bevelDepth * 2 <
        zFront - zRear,
      "ANNULUS_BEVEL_DEPTH_INVALID",
      {
        componentId,
        bevelDepth
      }
    );

    invariant(
      outerBevelWidth > 0 &&
      innerBevelWidth > 0 &&
      outerRadius -
        outerBevelWidth >
      innerRadius +
        innerBevelWidth,
      "ANNULUS_BEVEL_WIDTH_INVALID",
      {
        componentId,
        outerBevelWidth,
        innerBevelWidth
      }
    );

    const mesh =
      createEmptyMesh(
        componentId,
        "BEVELED_ANNULUS",
        materialKey
      );

    const outerFaceRadius =
      outerRadius -
      outerBevelWidth;

    const innerFaceRadius =
      innerRadius +
      innerBevelWidth;

    const zFrontShoulder =
      zFront -
      bevelDepth;

    const zRearShoulder =
      zRear +
      bevelDepth;

    const frontFace =
      pushAnnularSurfaceBand(
        mesh,
        {
          outerRadius:
            outerFaceRadius,

          innerRadius:
            innerFaceRadius,

          z:
            zFront,

          segments,

          normal:
            [0, 0, 1]
        }
      );

    const frontOuterBevel =
      pushCircularSlopeBand(
        mesh,
        {
          radiusA:
            outerFaceRadius,

          zA:
            zFront,

          radiusB:
            outerRadius,

          zB:
            zFrontShoulder,

          segments,

          inward:
            false
        }
      );

    const outerWall =
      pushCircularWall(
        mesh,
        {
          radius:
            outerRadius,

          zRear:
            zRearShoulder,

          zFront:
            zFrontShoulder,

          segments,

          inward:
            false
        }
      );

    const rearOuterBevel =
      pushCircularSlopeBand(
        mesh,
        {
          radiusA:
            outerRadius,

          zA:
            zRearShoulder,

          radiusB:
            outerFaceRadius,

          zB:
            zRear,

          segments,

          inward:
            false
        }
      );

    const rearFace =
      pushAnnularSurfaceBand(
        mesh,
        {
          outerRadius:
            outerFaceRadius,

          innerRadius:
            innerFaceRadius,

          z:
            zRear,

          segments,

          normal:
            [0, 0, -1]
        }
      );

    const rearInnerBevel =
      pushCircularSlopeBand(
        mesh,
        {
          radiusA:
            innerFaceRadius,

          zA:
            zRear,

          radiusB:
            innerRadius,

          zB:
            zRearShoulder,

          segments,

          inward:
            true
        }
      );

    const innerWall =
      pushCircularWall(
        mesh,
        {
          radius:
            innerRadius,

          zRear:
            zRearShoulder,

          zFront:
            zFrontShoulder,

          segments,

          inward:
            true
        }
      );

    const frontInnerBevel =
      pushCircularSlopeBand(
        mesh,
        {
          radiusA:
            innerRadius,

          zA:
            zFrontShoulder,

          radiusB:
            innerFaceRadius,

          zB:
            zFront,

          segments,

          inward:
            true
        }
      );

    mesh.groups.push(
      {
        id:
          "FRONT_FACE",
        ...frontFace
      },
      {
        id:
          "FRONT_OUTER_BEVEL",
        ...frontOuterBevel
      },
      {
        id:
          "OUTER_WALL",
        ...outerWall
      },
      {
        id:
          "REAR_OUTER_BEVEL",
        ...rearOuterBevel
      },
      {
        id:
          "REAR_FACE",
        ...rearFace
      },
      {
        id:
          "REAR_INNER_BEVEL",
        ...rearInnerBevel
      },
      {
        id:
          "INNER_WALL",
        ...innerWall
      },
      {
        id:
          "FRONT_INNER_BEVEL",
        ...frontInnerBevel
      }
    );

    mesh.metadata = {
      outerRadius,
      innerRadius,
      zRear,
      zFront,
      bevelDepth,
      outerBevelWidth,
      innerBevelWidth,
      segments
    };

    return finalizeMesh(mesh);
  }

  function createBeveledDisc({
    componentId,
    materialKey,
    radius,
    zRear,
    zFront,
    bevelDepth,
    bevelWidth,
    segments
  }) {
    validateSegmentCount(
      segments,
      "DISC_SEGMENT_COUNT_INVALID"
    );

    invariant(
      radius > 0 &&
      bevelWidth > 0 &&
      radius > bevelWidth,
      "DISC_RADIUS_INVALID",
      {
        componentId,
        radius,
        bevelWidth
      }
    );

    invariant(
      zFront > zRear &&
      bevelDepth > 0 &&
      bevelDepth * 2 <
        zFront - zRear,
      "DISC_DEPTH_INVALID",
      {
        componentId,
        zRear,
        zFront,
        bevelDepth
      }
    );

    const mesh =
      createEmptyMesh(
        componentId,
        "BEVELED_DISC",
        materialKey
      );

    const faceRadius =
      radius -
      bevelWidth;

    const zFrontShoulder =
      zFront -
      bevelDepth;

    const zRearShoulder =
      zRear +
      bevelDepth;

    const frontStart =
      mesh.indices.length;

    const frontCenter =
      pushVertex(
        mesh,
        [0, 0, zFront],
        [0, 0, 1]
      );

    const frontRim = [];

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const theta =
        TAU *
        index /
        segments;

      frontRim.push(
        pushVertex(
          mesh,
          createCirclePoint(
            faceRadius,
            theta,
            zFront
          ),
          [0, 0, 1]
        )
      );
    }

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        segments;

      pushTriangle(
        mesh,
        frontCenter,
        frontRim[index],
        frontRim[next]
      );
    }

    const frontFace = {
      indexStart:
        frontStart,

      indexCount:
        mesh.indices.length -
        frontStart
    };

    const frontBevel =
      pushCircularSlopeBand(
        mesh,
        {
          radiusA:
            faceRadius,

          zA:
            zFront,

          radiusB:
            radius,

          zB:
            zFrontShoulder,

          segments,

          inward:
            false
        }
      );

    const wall =
      pushCircularWall(
        mesh,
        {
          radius,

          zRear:
            zRearShoulder,

          zFront:
            zFrontShoulder,

          segments,

          inward:
            false
        }
      );

    const rearBevel =
      pushCircularSlopeBand(
        mesh,
        {
          radiusA:
            radius,

          zA:
            zRearShoulder,

          radiusB:
            faceRadius,

          zB:
            zRear,

          segments,

          inward:
            false
        }
      );

    const rearStart =
      mesh.indices.length;

    const rearCenter =
      pushVertex(
        mesh,
        [0, 0, zRear],
        [0, 0, -1]
      );

    const rearRim = [];

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const theta =
        TAU *
        index /
        segments;

      rearRim.push(
        pushVertex(
          mesh,
          createCirclePoint(
            faceRadius,
            theta,
            zRear
          ),
          [0, 0, -1]
        )
      );
    }

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        segments;

      pushTriangle(
        mesh,
        rearCenter,
        rearRim[next],
        rearRim[index]
      );
    }

    const rearFace = {
      indexStart:
        rearStart,

      indexCount:
        mesh.indices.length -
        rearStart
    };

    mesh.groups.push(
      {
        id:
          "FRONT_FACE",
        ...frontFace
      },
      {
        id:
          "FRONT_BEVEL",
        ...frontBevel
      },
      {
        id:
          "SIDE_WALL",
        ...wall
      },
      {
        id:
          "REAR_BEVEL",
        ...rearBevel
      },
      {
        id:
          "REAR_FACE",
        ...rearFace
      }
    );

    mesh.metadata = {
      radius,
      zRear,
      zFront,
      bevelDepth,
      bevelWidth,
      segments
    };

    return finalizeMesh(mesh);
  }

  function pushPolygonFace(
    mesh,
    vertices,
    z,
    frontFacing
  ) {
    const start =
      mesh.indices.length;

    const normal =
      frontFacing
        ? [0, 0, 1]
        : [0, 0, -1];

    const indices =
      vertices.map(
        vertex =>
          pushVertex(
            mesh,
            [
              vertex[0],
              vertex[1],
              z
            ],
            normal
          )
      );

    for (
      let index = 1;
      index < vertices.length - 1;
      index += 1
    ) {
      if (frontFacing) {
        pushTriangle(
          mesh,
          indices[0],
          indices[index],
          indices[index + 1]
        );
      } else {
        pushTriangle(
          mesh,
          indices[0],
          indices[index + 1],
          indices[index]
        );
      }
    }

    return {
      indexStart:
        start,

      indexCount:
        mesh.indices.length -
        start
    };
  }

  function pushPolygonBand(
    mesh,
    outerVertices,
    outerZ,
    innerVertices,
    innerZ,
    reverse = false
  ) {
    invariant(
      outerVertices.length ===
      innerVertices.length,
      "POLYGON_BAND_VERTEX_COUNT_MISMATCH"
    );

    const start =
      mesh.indices.length;

    for (
      let index = 0;
      index < outerVertices.length;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        outerVertices.length;

      const a = [
        outerVertices[index][0],
        outerVertices[index][1],
        outerZ
      ];

      const b = [
        outerVertices[next][0],
        outerVertices[next][1],
        outerZ
      ];

      const c = [
        innerVertices[next][0],
        innerVertices[next][1],
        innerZ
      ];

      const d = [
        innerVertices[index][0],
        innerVertices[index][1],
        innerZ
      ];

      pushFlatQuad(
        mesh,
        a,
        b,
        c,
        d,
        reverse
      );
    }

    return {
      indexStart:
        start,

      indexCount:
        mesh.indices.length -
        start
    };
  }

  function pushPolygonWall(
    mesh,
    vertices,
    zRear,
    zFront
  ) {
    const start =
      mesh.indices.length;

    for (
      let index = 0;
      index < vertices.length;
      index += 1
    ) {
      const next =
        (
          index + 1
        ) %
        vertices.length;

      const a =
        vertices[index];

      const b =
        vertices[next];

      const frontA = [
        a[0],
        a[1],
        zFront
      ];

      const frontB = [
        b[0],
        b[1],
        zFront
      ];

      const rearB = [
        b[0],
        b[1],
        zRear
      ];

      const rearA = [
        a[0],
        a[1],
        zRear
      ];

      pushFlatQuad(
        mesh,
        frontA,
        frontB,
        rearB,
        rearA,
        false
      );
    }

    return {
      indexStart:
        start,

      indexCount:
        mesh.indices.length -
        start
    };
  }

  function createBeveledConvexPolygon({
    componentId,
    materialKey,
    xyVertices,
    zRear,
    zFront,
    bevelDepth,
    bevelInset,
    primitive =
      "BEVELED_CONVEX_POLYGON"
  }) {
    validatePolygon(
      xyVertices,
      "BEVELED_POLYGON_INVALID"
    );

    invariant(
      zFront > zRear &&
      bevelDepth > 0 &&
      bevelDepth * 2 <
        zFront - zRear,
      "BEVELED_POLYGON_DEPTH_INVALID",
      {
        componentId,
        zRear,
        zFront,
        bevelDepth
      }
    );

    invariant(
      bevelInset > 0 &&
      bevelInset < 0.45,
      "BEVELED_POLYGON_INSET_INVALID",
      {
        componentId,
        bevelInset
      }
    );

    const mesh =
      createEmptyMesh(
        componentId,
        primitive,
        materialKey
      );

    const faceScale =
      1 -
      bevelInset;

    const faceVertices =
      scalePolygonAroundCentroid(
        xyVertices,
        faceScale
      );

    const zFrontShoulder =
      zFront -
      bevelDepth;

    const zRearShoulder =
      zRear +
      bevelDepth;

    const frontFace =
      pushPolygonFace(
        mesh,
        faceVertices,
        zFront,
        true
      );

    const frontBevel =
      pushPolygonBand(
        mesh,
        faceVertices,
        zFront,
        xyVertices,
        zFrontShoulder,
        false
      );

    const wall =
      pushPolygonWall(
        mesh,
        xyVertices,
        zRearShoulder,
        zFrontShoulder
      );

    const rearBevel =
      pushPolygonBand(
        mesh,
        xyVertices,
        zRearShoulder,
        faceVertices,
        zRear,
        false
      );

    const rearFace =
      pushPolygonFace(
        mesh,
        faceVertices,
        zRear,
        false
      );

    mesh.groups.push(
      {
        id:
          "FRONT_FACE",
        ...frontFace
      },
      {
        id:
          "FRONT_BEVEL",
        ...frontBevel
      },
      {
        id:
          "SIDE_WALL",
        ...wall
      },
      {
        id:
          "REAR_BEVEL",
        ...rearBevel
      },
      {
        id:
          "REAR_FACE",
        ...rearFace
      }
    );

    mesh.metadata = {
      xyVertices:
        xyVertices.map(
          cloneVector
        ),

      zRear,
      zFront,
      bevelDepth,
      bevelInset
    };

    return finalizeMesh(mesh);
  }

  function createIntercardinalTickPolygon(
    angle
  ) {
    const definition =
      COMPONENT_DIMENSIONS
        .intercardinalTick;

    const direction = [
      Math.cos(angle),
      Math.sin(angle)
    ];

    const tangent = [
      -direction[1],
      direction[0]
    ];

    const radialHalf =
      definition.radialLength *
      0.5;

    const tangentialHalf =
      definition.tangentialWidth *
      0.5;

    const center = [
      direction[0] *
        definition.radialCenter,

      direction[1] *
        definition.radialCenter
    ];

    const innerCenter = [
      center[0] -
        direction[0] *
        radialHalf,

      center[1] -
        direction[1] *
        radialHalf
    ];

    const outerCenter = [
      center[0] +
        direction[0] *
        radialHalf,

      center[1] +
        direction[1] *
        radialHalf
    ];

    return [
      [
        innerCenter[0] -
          tangent[0] *
          tangentialHalf,

        innerCenter[1] -
          tangent[1] *
          tangentialHalf
      ],

      [
        outerCenter[0] -
          tangent[0] *
          tangentialHalf,

        outerCenter[1] -
          tangent[1] *
          tangentialHalf
      ],

      [
        outerCenter[0] +
          tangent[0] *
          tangentialHalf,

        outerCenter[1] +
          tangent[1] *
          tangentialHalf
      ],

      [
        innerCenter[0] +
          tangent[0] *
          tangentialHalf,

        innerCenter[1] +
          tangent[1] *
          tangentialHalf
      ]
    ];
  }

  function summarizeMeshes(meshes) {
    invariant(
      Array.isArray(meshes) &&
      meshes.length > 0,
      "MESH_COLLECTION_REQUIRED"
    );

    let vertexCount = 0;
    let triangleCount = 0;

    const aggregatePositions = [];

    for (
      const mesh
      of meshes
    ) {
      vertexCount +=
        mesh.vertexCount;

      triangleCount +=
        mesh.triangleCount;

      for (
        let index = 0;
        index < mesh.positions.length;
        index += 1
      ) {
        aggregatePositions.push(
          mesh.positions[index]
        );
      }
    }

    const bounds =
      computeBoundsFromPositions(
        aggregatePositions
      );

    return deepFreeze({
      vertexCount,
      triangleCount,
      bounds,

      actualTotalDepth:
        bounds.size[2]
    });
  }

  function validateDepthBounds(bounds) {
    const minimumZ =
      bounds.minimum[2];

    const maximumZ =
      bounds.maximum[2];

    invariant(
      minimumZ >=
        DEPTH_ENVELOPE.absoluteRearLimitZ -
        EPSILON,
      "ABSOLUTE_REAR_DEPTH_LIMIT_EXCEEDED",
      { minimumZ }
    );

    invariant(
      maximumZ <=
        DEPTH_ENVELOPE.absoluteFrontLimitZ +
        EPSILON,
      "ABSOLUTE_FRONT_DEPTH_LIMIT_EXCEEDED",
      { maximumZ }
    );

    invariant(
      maximumZ -
        minimumZ <=
        DEPTH_ENVELOPE.absoluteMaximumTotalDepth +
        EPSILON,
      "ABSOLUTE_TOTAL_DEPTH_EXCEEDED",
      {
        minimumZ,
        maximumZ,

        totalDepth:
          maximumZ -
          minimumZ
      }
    );
  }

  function validateRadialBounds(mesh) {
    for (
      let index = 0;
      index < mesh.positions.length;
      index += 3
    ) {
      const x =
        mesh.positions[index];

      const y =
        mesh.positions[index + 1];

      const radius =
        Math.hypot(
          x,
          y
        );

      invariant(
        radius <=
          COMPONENT_DIMENSIONS
            .outerHousing
            .outerRadius +
          EPSILON,
        "COMPONENT_EXCEEDS_OUTER_RADIUS",
        {
          componentId:
            mesh.componentId,
          radius,
          x,
          y
        }
      );
    }
  }

  function validateMesh(mesh) {
    invariant(
      mesh &&
      typeof mesh === "object",
      "MESH_RECORD_REQUIRED"
    );

    invariant(
      typeof mesh.componentId ===
        "string" &&
      mesh.componentId.length > 0,
      "MESH_COMPONENT_ID_REQUIRED"
    );

    validateMaterialKey(
      mesh.materialKey
    );

    invariant(
      mesh.positions instanceof
        Float32Array,
      "MESH_POSITION_BUFFER_INVALID",
      {
        componentId:
          mesh.componentId
      }
    );

    invariant(
      mesh.normals instanceof
        Float32Array,
      "MESH_NORMAL_BUFFER_INVALID",
      {
        componentId:
          mesh.componentId
      }
    );

    invariant(
      mesh.indices instanceof
        Uint16Array ||
      mesh.indices instanceof
        Uint32Array,
      "MESH_INDEX_BUFFER_INVALID",
      {
        componentId:
          mesh.componentId
      }
    );

    invariant(
      mesh.positions.length ===
        mesh.normals.length,
      "MESH_POSITION_NORMAL_LENGTH_MISMATCH",
      {
        componentId:
          mesh.componentId
      }
    );

    invariant(
      mesh.positions.length % 3 === 0,
      "MESH_POSITION_ALIGNMENT_INVALID",
      {
        componentId:
          mesh.componentId
      }
    );

    invariant(
      mesh.indices.length % 3 === 0,
      "MESH_INDEX_ALIGNMENT_INVALID",
      {
        componentId:
          mesh.componentId
      }
    );

    const vertexCount =
      mesh.positions.length / 3;

    for (
      const index
      of mesh.indices
    ) {
      invariant(
        index >= 0 &&
        index < vertexCount,
        "MESH_INDEX_OUT_OF_RANGE",
        {
          componentId:
            mesh.componentId,
          index,
          vertexCount
        }
      );
    }

    validateDepthBounds(
      mesh.bounds
    );

    validateRadialBounds(
      mesh
    );

    return true;
  }

  function validateFixedCenterIdentity(
    objectIdentity
  ) {
    invariant(
      objectIdentity &&
      objectIdentity.objectClass ===
        "HOME_COMPASS_FIXED_CENTER_INSTRUMENT",
      "MODEL_OBJECT_CLASS_INVALID"
    );

    invariant(
      objectIdentity.physicalProjection ===
        "FIXED_CENTER_INDEPENDENT_SIBLING",
      "MODEL_PHYSICAL_PROJECTION_INVALID"
    );

    invariant(
      objectIdentity.inheritsNavigationOrientation ===
        false,
      "MODEL_NAVIGATION_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      objectIdentity.inheritsConstellationOrientation ===
        false,
      "MODEL_CONSTELLATION_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      objectIdentity.inheritsClusterOrientation ===
        false,
      "MODEL_CLUSTER_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      objectIdentity.participatesInNavigationSettlement ===
        false,
      "MODEL_NAVIGATION_SETTLEMENT_PARTICIPATION_FORBIDDEN"
    );

    invariant(
      objectIdentity.receivesIndependentGestureDeltas ===
        false,
      "MODEL_INDEPENDENT_GESTURE_DELTAS_FORBIDDEN"
    );

    invariant(
      objectIdentity.publishesQuaternion ===
        false,
      "MODEL_QUATERNION_PUBLICATION_FORBIDDEN"
    );

    invariant(
      objectIdentity.ownsNavigation ===
        false,
      "MODEL_NAVIGATION_AUTHORITY_FORBIDDEN"
    );

    invariant(
      objectIdentity.ownsSelectionState ===
        false,
      "MODEL_SELECTION_AUTHORITY_FORBIDDEN"
    );

    invariant(
      objectIdentity.ownsPointerListeners ===
        false,
      "MODEL_POINTER_AUTHORITY_FORBIDDEN"
    );
  }

  function validateRootTransform(
    rootTransform
  ) {
    invariant(
      rootTransform &&
      rootTransform.placementMode ===
        "FIXED_CENTER",
      "MODEL_FIXED_CENTER_PLACEMENT_REQUIRED"
    );

    invariant(
      rootTransform.parentOrientationMode ===
        "NONE",
      "MODEL_PARENT_ORIENTATION_MODE_INVALID"
    );

    invariant(
      rootTransform.inheritsNavigationOrientation ===
        false,
      "ROOT_NAVIGATION_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      rootTransform.inheritsConstellationOrientation ===
        false,
      "ROOT_CONSTELLATION_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      rootTransform.inheritsClusterOrientation ===
        false,
      "ROOT_CLUSTER_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      rootTransform.participatesInNavigationSettlement ===
        false,
      "ROOT_NAVIGATION_SETTLEMENT_PARTICIPATION_FORBIDDEN"
    );

    invariant(
      rootTransform.independentGestureAuthority ===
        false,
      "ROOT_INDEPENDENT_GESTURE_AUTHORITY_FORBIDDEN"
    );

    invariant(
      rootTransform.independentSettlementAuthority ===
        false,
      "ROOT_INDEPENDENT_SETTLEMENT_AUTHORITY_FORBIDDEN"
    );

    invariant(
      rootTransform.publishesQuaternion ===
        false,
      "ROOT_QUATERNION_PUBLICATION_FORBIDDEN"
    );

    invariant(
      rootTransform.localTransformOrder ===
        "FIXED_CENTER_PLACEMENT * LOCAL_PRESENTATION_TRANSFORM",
      "MODEL_LOCAL_TRANSFORM_ORDER_INVALID"
    );

    invariant(
      rootTransform.defaultPresentationTransform ===
        PRESENTATION_TRANSFORMS.fixedCenter,
      "MODEL_DEFAULT_PRESENTATION_TRANSFORM_INVALID"
    );
  }

  function validatePresentationTransforms(
    presentationTransforms
  ) {
    invariant(
      presentationTransforms &&
      presentationTransforms.fixedCenter,
      "MODEL_FIXED_CENTER_PRESENTATION_TRANSFORM_REQUIRED"
    );

    invariant(
      presentationTransforms.fixedCenter.id ===
        "fixedCenter",
      "MODEL_FIXED_CENTER_TRANSFORM_ID_INVALID"
    );

    invariant(
      presentationTransforms.embedded ===
        presentationTransforms.fixedCenter,
      "MODEL_EMBEDDED_COMPATIBILITY_ALIAS_INVALID"
    );

    invariant(
      !Object.prototype.hasOwnProperty.call(
        presentationTransforms,
        "decisionApproach"
      ),
      "MODEL_DECISION_APPROACH_TRANSFORM_FORBIDDEN"
    );
  }

  function validateModel(model) {
    invariant(
      model &&
      model.moduleId ===
        MODULE.id,
      "MODEL_MODULE_ID_MISMATCH"
    );

    invariant(
      model.moduleVersion ===
        MODULE.version,
      "MODEL_MODULE_VERSION_MISMATCH"
    );

    invariant(
      model.modelId ===
        MODEL_ID,
      "MODEL_ID_MISMATCH"
    );

    validateFixedCenterIdentity(
      model.objectIdentity
    );

    invariant(
      Array.isArray(model.meshes) &&
      model.meshes.length >= 14,
      "MODEL_COMPONENT_COLLECTION_INVALID",
      {
        componentCount:
          model.meshes
            ? model.meshes.length
            : 0
      }
    );

    const componentIds =
      new Set();

    for (
      const mesh
      of model.meshes
    ) {
      validateMesh(mesh);

      invariant(
        !componentIds.has(
          mesh.componentId
        ),
        "MODEL_DUPLICATE_COMPONENT_ID",
        {
          componentId:
            mesh.componentId
        }
      );

      componentIds.add(
        mesh.componentId
      );
    }

    validateDepthBounds(
      model.bounds
    );

    invariant(
      model.bounds.minimum[2] <=
        DEPTH_ENVELOPE.rearLimitZ +
        EPSILON,
      "MODEL_REAR_OCCUPANCY_INCOMPLETE",
      {
        actual:
          model.bounds.minimum[2],

        expected:
          DEPTH_ENVELOPE.rearLimitZ
      }
    );

    invariant(
      model.bounds.maximum[2] >=
        DEPTH_ENVELOPE.frontLimitZ -
        EPSILON,
      "MODEL_FRONT_OCCUPANCY_INCOMPLETE",
      {
        actual:
          model.bounds.maximum[2],

        expected:
          DEPTH_ENVELOPE.frontLimitZ
      }
    );

    invariant(
      model.aggregate.actualTotalDepth >=
        DEPTH_ENVELOPE.minimumInstrumentDepth -
        EPSILON,
      "MODEL_INSTRUMENT_DEPTH_INSUFFICIENT",
      {
        actual:
          model.aggregate.actualTotalDepth,

        minimum:
          DEPTH_ENVELOPE.minimumInstrumentDepth
      }
    );

    invariant(
      model.aggregate.actualTotalDepth <=
        DEPTH_ENVELOPE.absoluteMaximumTotalDepth +
        EPSILON,
      "MODEL_TOTAL_DEPTH_EXCEEDS_ABSOLUTE_MAXIMUM"
    );

    validateRootTransform(
      model.rootTransform
    );

    validatePresentationTransforms(
      model.presentationTransforms
    );

    invariant(
      model.visualControlAlignmentEnvelope &&
      model.visualControlAlignmentEnvelope
        .geometryIsSemanticListener ===
        false,
      "GEOMETRY_SEMANTIC_LISTENER_AUTHORITY_FORBIDDEN"
    );

    invariant(
      model.visualControlAlignmentEnvelope
        .semanticControlOwnedByHtml ===
        true,
      "HTML_SEMANTIC_CONTROL_AUTHORITY_REQUIRED"
    );

    invariant(
      model.visualControlAlignmentEnvelope
        .rendererMayAlignVisualModelToSemanticControl ===
        true,
      "RENDERER_VISUAL_ALIGNMENT_CONTRACT_REQUIRED"
    );

    invariant(
      model.compatibility &&
      model.compatibility
        .decisionApproachTransform ===
        false,
      "MODEL_DECISION_APPROACH_COMPATIBILITY_FORBIDDEN"
    );

    return true;
  }

  function buildModel(options = {}) {
    const quality =
      resolveQualityProfile(
        options.quality ||
        options.qualityProfileId ||
        "desktop"
      );

    const includeIntercardinalTicks =
      options.includeIntercardinalTicks !==
      undefined
        ? options.includeIntercardinalTicks ===
          true
        : quality
            .includeIntercardinalTicks;

    const meshes = [];

    meshes.push(
      createBeveledAnnulus({
        componentId:
          "HOME_COMPASS_OUTER_HOUSING",

        materialKey:
          MATERIAL_KEYS.OUTER_HOUSING,

        ...COMPONENT_DIMENSIONS
          .outerHousing,

        segments:
          quality.annulusSegments
      })
    );

    meshes.push(
      createBeveledAnnulus({
        componentId:
          "HOME_COMPASS_OUTER_BEZEL",

        materialKey:
          MATERIAL_KEYS.OUTER_BEZEL,

        ...COMPONENT_DIMENSIONS
          .outerBezel,

        segments:
          quality.annulusSegments
      })
    );

    meshes.push(
      createBeveledAnnulus({
        componentId:
          "HOME_COMPASS_INNER_BEZEL",

        materialKey:
          MATERIAL_KEYS.INNER_BEZEL,

        ...COMPONENT_DIMENSIONS
          .innerBezel,

        segments:
          quality.annulusSegments
      })
    );

    meshes.push(
      createBeveledDisc({
        componentId:
          "HOME_COMPASS_RECESSED_DIAL_BED",

        materialKey:
          MATERIAL_KEYS.DIAL_BED,

        ...COMPONENT_DIMENSIONS
          .dialBed,

        segments:
          quality.dialSegments
      })
    );

    meshes.push(
      createBeveledConvexPolygon({
        componentId:
          "HOME_COMPASS_SOUTH_DIRECTION",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION,

        primitive:
          "BEVELED_SOUTH_BLADE",

        xyVertices:
          SHAPES.southDirection,

        ...COMPONENT_DIMENSIONS
          .principalDirection
      })
    );

    meshes.push(
      createBeveledConvexPolygon({
        componentId:
          "HOME_COMPASS_SOUTH_DIRECTION_FACET",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION_FACET,

        primitive:
          "RAISED_SOUTH_BLADE_FACET",

        xyVertices:
          SHAPES.southFacet,

        ...COMPONENT_DIMENSIONS
          .principalDirectionFacet
      })
    );

    meshes.push(
      createBeveledConvexPolygon({
        componentId:
          "HOME_COMPASS_EAST_DIRECTION",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION,

        primitive:
          "BEVELED_EAST_BLADE",

        xyVertices:
          SHAPES.eastDirection,

        ...COMPONENT_DIMENSIONS
          .principalDirection
      })
    );

    meshes.push(
      createBeveledConvexPolygon({
        componentId:
          "HOME_COMPASS_EAST_DIRECTION_FACET",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION_FACET,

        primitive:
          "RAISED_EAST_BLADE_FACET",

        xyVertices:
          SHAPES.eastFacet,

        ...COMPONENT_DIMENSIONS
          .principalDirectionFacet
      })
    );

    meshes.push(
      createBeveledConvexPolygon({
        componentId:
          "HOME_COMPASS_WEST_DIRECTION",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION,

        primitive:
          "BEVELED_WEST_BLADE",

        xyVertices:
          SHAPES.westDirection,

        ...COMPONENT_DIMENSIONS
          .principalDirection
      })
    );

    meshes.push(
      createBeveledConvexPolygon({
        componentId:
          "HOME_COMPASS_WEST_DIRECTION_FACET",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION_FACET,

        primitive:
          "RAISED_WEST_BLADE_FACET",

        xyVertices:
          SHAPES.westFacet,

        ...COMPONENT_DIMENSIONS
          .principalDirectionFacet
      })
    );

    meshes.push(
      createBeveledConvexPolygon({
        componentId:
          "HOME_COMPASS_DOMINANT_NORTH_NEEDLE",

        materialKey:
          MATERIAL_KEYS.NORTH_NEEDLE,

        primitive:
          "BEVELED_DOMINANT_NORTH_NEEDLE",

        xyVertices:
          SHAPES.northNeedle,

        ...COMPONENT_DIMENSIONS
          .northNeedle
      })
    );

    meshes.push(
      createBeveledConvexPolygon({
        componentId:
          "HOME_COMPASS_NORTH_NEEDLE_FACET",

        materialKey:
          MATERIAL_KEYS
            .NORTH_NEEDLE_FACET,

        primitive:
          "RAISED_NORTH_NEEDLE_FACET",

        xyVertices:
          SHAPES.northNeedleFacet,

        ...COMPONENT_DIMENSIONS
          .northNeedleFacet
      })
    );

    if (includeIntercardinalTicks) {
      const angles = [
        Math.PI / 4,
        3 * Math.PI / 4,
        5 * Math.PI / 4,
        7 * Math.PI / 4
      ];

      for (
        let index = 0;
        index < angles.length;
        index += 1
      ) {
        meshes.push(
          createBeveledConvexPolygon({
            componentId:
              `HOME_COMPASS_INTERCARDINAL_TICK_${index + 1}`,

            materialKey:
              MATERIAL_KEYS
                .INTERCARDINAL_TICK,

            primitive:
              "BEVELED_INTERCARDINAL_TICK",

            xyVertices:
              createIntercardinalTickPolygon(
                angles[index]
              ),

            ...COMPONENT_DIMENSIONS
              .intercardinalTick
          })
        );
      }
    }

    meshes.push(
      createBeveledDisc({
        componentId:
          "HOME_COMPASS_HUB_BASE",

        materialKey:
          MATERIAL_KEYS.HUB_BASE,

        ...COMPONENT_DIMENSIONS
          .hubBase,

        segments:
          quality.hubSegments
      })
    );

    meshes.push(
      createBeveledDisc({
        componentId:
          "HOME_COMPASS_HUB_CROWN",

        materialKey:
          MATERIAL_KEYS.HUB_CROWN,

        ...COMPONENT_DIMENSIONS
          .hubCrown,

        segments:
          quality.hubSegments
      })
    );

    meshes.push(
      createBeveledDisc({
        componentId:
          "HOME_COMPASS_HUB_JEWEL",

        materialKey:
          MATERIAL_KEYS.HUB_JEWEL,

        ...COMPONENT_DIMENSIONS
          .hubJewel,

        segments:
          quality.hubSegments
      })
    );

    const aggregate =
      summarizeMeshes(meshes);

    const model =
      deepFreeze({
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        modelId:
          MODEL_ID,

        legacyModelIds:
          LEGACY_MODEL_IDS,

        objectIdentity:
          OBJECT_IDENTITY,

        compatibility:
          COMPATIBILITY,

        coordinateSystem:
          COORDINATE_SYSTEM,

        qualityProfile:
          quality,

        includeIntercardinalTicks,

        materialKeys:
          MATERIAL_KEYS,

        componentCount:
          meshes.length,

        meshes,

        rootTransform:
          ROOT_TRANSFORM,

        presentationTransforms:
          PRESENTATION_TRANSFORMS,

        visualControlAlignmentEnvelope:
          VISUAL_CONTROL_ALIGNMENT_ENVELOPE,

        /*
         * Deprecated alias retained for renderer compatibility.
         */
        semanticHitEnvelope:
          SEMANTIC_HIT_ENVELOPE,

        depthEnvelope:
          DEPTH_ENVELOPE,

        bounds:
          aggregate.bounds,

        aggregate,

        fallbackProjection:
          createFrontProjectionSchema({
            includeIntercardinalTicks
          })
      });

    validateModel(model);

    return model;
  }

  /*
   * Compatibility construction surface.
   * It returns the exact same fixed-center model contract as buildModel().
   */
  function buildBaselineMeshes(
    options = {}
  ) {
    return buildModel(options);
  }

  function createFrontProjectionSchema(
    options = {}
  ) {
    const includeIntercardinalTicks =
      options.includeIntercardinalTicks ===
      true;

    const layers = [
      {
        id:
          "OUTER_HOUSING",

        materialKey:
          MATERIAL_KEYS.OUTER_HOUSING,

        type:
          "ANNULUS",

        outerRadius:
          COMPONENT_DIMENSIONS
            .outerHousing
            .outerRadius,

        innerRadius:
          COMPONENT_DIMENSIONS
            .outerHousing
            .innerRadius
      },

      {
        id:
          "OUTER_BEZEL",

        materialKey:
          MATERIAL_KEYS.OUTER_BEZEL,

        type:
          "ANNULUS",

        outerRadius:
          COMPONENT_DIMENSIONS
            .outerBezel
            .outerRadius,

        innerRadius:
          COMPONENT_DIMENSIONS
            .outerBezel
            .innerRadius
      },

      {
        id:
          "INNER_BEZEL",

        materialKey:
          MATERIAL_KEYS.INNER_BEZEL,

        type:
          "ANNULUS",

        outerRadius:
          COMPONENT_DIMENSIONS
            .innerBezel
            .outerRadius,

        innerRadius:
          COMPONENT_DIMENSIONS
            .innerBezel
            .innerRadius
      },

      {
        id:
          "DIAL_BED",

        materialKey:
          MATERIAL_KEYS.DIAL_BED,

        type:
          "CIRCLE",

        radius:
          COMPONENT_DIMENSIONS
            .dialBed
            .radius
      },

      {
        id:
          "SOUTH_DIRECTION",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION,

        type:
          "POLYGON",

        vertices:
          SHAPES.southDirection
      },

      {
        id:
          "SOUTH_DIRECTION_FACET",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION_FACET,

        type:
          "POLYGON",

        vertices:
          SHAPES.southFacet
      },

      {
        id:
          "EAST_DIRECTION",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION,

        type:
          "POLYGON",

        vertices:
          SHAPES.eastDirection
      },

      {
        id:
          "EAST_DIRECTION_FACET",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION_FACET,

        type:
          "POLYGON",

        vertices:
          SHAPES.eastFacet
      },

      {
        id:
          "WEST_DIRECTION",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION,

        type:
          "POLYGON",

        vertices:
          SHAPES.westDirection
      },

      {
        id:
          "WEST_DIRECTION_FACET",

        materialKey:
          MATERIAL_KEYS
            .PRINCIPAL_DIRECTION_FACET,

        type:
          "POLYGON",

        vertices:
          SHAPES.westFacet
      },

      {
        id:
          "NORTH_NEEDLE",

        materialKey:
          MATERIAL_KEYS.NORTH_NEEDLE,

        type:
          "POLYGON",

        vertices:
          SHAPES.northNeedle
      },

      {
        id:
          "NORTH_NEEDLE_FACET",

        materialKey:
          MATERIAL_KEYS
            .NORTH_NEEDLE_FACET,

        type:
          "POLYGON",

        vertices:
          SHAPES.northNeedleFacet
      },

      {
        id:
          "HUB_BASE",

        materialKey:
          MATERIAL_KEYS.HUB_BASE,

        type:
          "CIRCLE",

        radius:
          COMPONENT_DIMENSIONS
            .hubBase
            .radius
      },

      {
        id:
          "HUB_CROWN",

        materialKey:
          MATERIAL_KEYS.HUB_CROWN,

        type:
          "CIRCLE",

        radius:
          COMPONENT_DIMENSIONS
            .hubCrown
            .radius
      },

      {
        id:
          "HUB_JEWEL",

        materialKey:
          MATERIAL_KEYS.HUB_JEWEL,

        type:
          "CIRCLE",

        radius:
          COMPONENT_DIMENSIONS
            .hubJewel
            .radius
      }
    ];

    if (includeIntercardinalTicks) {
      const angles = [
        Math.PI / 4,
        3 * Math.PI / 4,
        5 * Math.PI / 4,
        7 * Math.PI / 4
      ];

      const tickLayers =
        angles.map(
          (
            angle,
            index
          ) => ({
            id:
              `INTERCARDINAL_TICK_${index + 1}`,

            materialKey:
              MATERIAL_KEYS
                .INTERCARDINAL_TICK,

            type:
              "POLYGON",

            vertices:
              createIntercardinalTickPolygon(
                angle
              )
          })
        );

      layers.splice(
        4,
        0,
        ...tickLayers
      );
    }

    return deepFreeze({
      sourceModule:
        MODULE.id,

      sourceVersion:
        MODULE.version,

      modelId:
        MODEL_ID,

      legacyModelIds:
        LEGACY_MODEL_IDS,

      objectIdentity:
        OBJECT_IDENTITY,

      viewBox:
        "0 0 200 200",

      normalizedToSvg:
        Object.freeze({
          scale: 90,
          centerX: 100,
          centerY: 100,
          x: "100 + 90*x",
          y: "100 - 90*y"
        }),

      intentionallyTwoDimensional:
        true,

      includeIntercardinalTicks,

      layers
    });
  }

  function mapSvgX(x) {
    return 100 + 90 * x;
  }

  function mapSvgY(y) {
    return 100 - 90 * y;
  }

  function escapeXmlText(value) {
    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      );
  }

  function escapeXmlAttribute(
    value
  ) {
    return escapeXmlText(value)
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&apos;"
      );
  }

  function createAnnulusEvenOddPath(
    outerRadius,
    innerRadius
  ) {
    return [
      `M ${mapSvgX(outerRadius)} ${mapSvgY(0)}`,

      `A ${outerRadius * 90} ${outerRadius * 90} 0 1 0 ${mapSvgX(-outerRadius)} ${mapSvgY(0)}`,

      `A ${outerRadius * 90} ${outerRadius * 90} 0 1 0 ${mapSvgX(outerRadius)} ${mapSvgY(0)}`,

      `M ${mapSvgX(innerRadius)} ${mapSvgY(0)}`,

      `A ${innerRadius * 90} ${innerRadius * 90} 0 1 1 ${mapSvgX(-innerRadius)} ${mapSvgY(0)}`,

      `A ${innerRadius * 90} ${innerRadius * 90} 0 1 1 ${mapSvgX(innerRadius)} ${mapSvgY(0)}`
    ].join(" ");
  }

  function createPolygonPoints(
    vertices
  ) {
    return vertices
      .map(
        ([x, y]) =>
          `${mapSvgX(x)},${mapSvgY(y)}`
      )
      .join(" ");
  }

  function buildStaticSvgFallback(
    options = {}
  ) {
    const {
      title =
        "Home Compass",

      className =
        "dgb-upstream-compass-static-fallback",

      includeTitle =
        true,

      includeIntercardinalTicks =
        true,

      ariaHidden =
        true,

      focusable =
        false
    } = options;

    invariant(
      ariaHidden ||
      includeTitle,
      "ACCESSIBLE_SVG_REQUIRES_TITLE_WHEN_NOT_ARIA_HIDDEN"
    );

    const schema =
      createFrontProjectionSchema({
        includeIntercardinalTicks
      });

    const lines = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeXmlAttribute(schema.viewBox)}" class="${escapeXmlAttribute(className)}" aria-hidden="${ariaHidden ? "true" : "false"}" focusable="${focusable ? "true" : "false"}" data-upstream-compass-fallback="true" data-upstream-compass-model="${escapeXmlAttribute(MODEL_ID)}" data-upstream-compass-object-class="${escapeXmlAttribute(OBJECT_IDENTITY.objectClass)}" data-upstream-compass-placement="fixed-center">`
    ];

    if (includeTitle) {
      lines.push(
        `<title>${escapeXmlText(title)}</title>`
      );
    }

    for (
      const layer
      of schema.layers
    ) {
      if (
        layer.type ===
        "ANNULUS"
      ) {
        lines.push(
          `<path data-compass-layer="${escapeXmlAttribute(layer.id)}" data-material-key="${escapeXmlAttribute(layer.materialKey)}" d="${escapeXmlAttribute(
            createAnnulusEvenOddPath(
              layer.outerRadius,
              layer.innerRadius
            )
          )}" fill="currentColor" fill-rule="evenodd"/>`
        );

        continue;
      }

      if (
        layer.type ===
        "POLYGON"
      ) {
        lines.push(
          `<polygon data-compass-layer="${escapeXmlAttribute(layer.id)}" data-material-key="${escapeXmlAttribute(layer.materialKey)}" points="${escapeXmlAttribute(
            createPolygonPoints(
              layer.vertices
            )
          )}" fill="currentColor"/>`
        );

        continue;
      }

      if (
        layer.type ===
        "CIRCLE"
      ) {
        lines.push(
          `<circle data-compass-layer="${escapeXmlAttribute(layer.id)}" data-material-key="${escapeXmlAttribute(layer.materialKey)}" cx="100" cy="100" r="${escapeXmlAttribute(
            String(
              layer.radius * 90
            )
          )}" fill="currentColor"/>`
        );

        continue;
      }

      invariant(
        false,
        "UNSUPPORTED_FALLBACK_LAYER_TYPE",
        {
          layerId:
            layer.id,
          type:
            layer.type
        }
      );
    }

    lines.push(
      "</svg>"
    );

    const svgString =
      lines.join("");

    return deepFreeze({
      viewBox:
        schema.viewBox,

      svgString,

      layerCount:
        schema.layers.length,

      sourceModule:
        MODULE.id,

      sourceVersion:
        MODULE.version,

      modelId:
        MODEL_ID,

      legacyModelIds:
        LEGACY_MODEL_IDS,

      objectClass:
        OBJECT_IDENTITY.objectClass,

      physicalProjection:
        OBJECT_IDENTITY.physicalProjection,

      placementMode:
        ROOT_TRANSFORM.placementMode,

      intentionallyTwoDimensional:
        true,

      rendererRequired:
        false,

      animationRequired:
        false,

      geometryOwnsFallbackPromotion:
        false
    });
  }

  function runSelfTest(
    options = {}
  ) {
    const qualityIds =
      options.qualityIds ||
      [
        "desktop",
        "mobile",
        "lowPower"
      ];

    const models =
      qualityIds.map(
        qualityProfileId =>
          buildModel({
            qualityProfileId
          })
      );

    return deepFreeze({
      receiptSchema:
        "DGB_UPSTREAM_COMPASS_GEOMETRY_FIXED_CENTER_VALIDATION_RECEIPT_v1",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      modelId:
        MODEL_ID,

      pass:
        models.every(
          model =>
            validateModel(model) ===
            true
        ),

      fixedCenter:
        true,

      inheritsNavigationOrientation:
        false,

      inheritsConstellationOrientation:
        false,

      inheritsClusterOrientation:
        false,

      participatesInNavigationSettlement:
        false,

      publishesQuaternion:
        false,

      ownsNavigation:
        false,

      ownsSelectionState:
        false,

      ownsPointerListeners:
        false,

      decisionApproachPresent:
        false,

      embeddedAliasMatchesFixedCenter:
        PRESENTATION_TRANSFORMS.embedded ===
        PRESENTATION_TRANSFORMS.fixedCenter,

      qualityProfilesValidated:
        Object.freeze(
          qualityIds.slice()
        ),

      models:
        Object.freeze(
          models.map(
            model =>
              Object.freeze({
                qualityProfile:
                  model.qualityProfile.id,

                componentCount:
                  model.componentCount,

                vertexCount:
                  model.aggregate.vertexCount,

                triangleCount:
                  model.aggregate.triangleCount,

                minimumZ:
                  model.bounds.minimum[2],

                maximumZ:
                  model.bounds.maximum[2],

                totalDepth:
                  model.aggregate.actualTotalDepth
              })
          )
        )
    });
  }

  return deepFreeze({
    moduleId:
      MODULE.id,

    moduleVersion:
      MODULE.version,

    modelId:
      MODEL_ID,

    legacyModelIds:
      LEGACY_MODEL_IDS,

    objectIdentity:
      OBJECT_IDENTITY,

    compatibility:
      COMPATIBILITY,

    coordinateSystem:
      COORDINATE_SYSTEM,

    materialKeys:
      MATERIAL_KEYS,

    qualityProfiles:
      QUALITY_PROFILES,

    depthEnvelope:
      DEPTH_ENVELOPE,

    componentDimensions:
      COMPONENT_DIMENSIONS,

    presentationTransforms:
      PRESENTATION_TRANSFORMS,

    rootTransform:
      ROOT_TRANSFORM,

    visualControlAlignmentEnvelope:
      VISUAL_CONTROL_ALIGNMENT_ENVELOPE,

    /*
     * Deprecated alias retained pending renderer renewal.
     */
    semanticHitEnvelope:
      SEMANTIC_HIT_ENVELOPE,

    buildModel,

    buildBaselineMeshes,

    createFrontProjectionSchema,

    buildStaticSvgFallback,

    validateModel,

    runSelfTest
  });
})();

if (
  typeof globalThis !==
  "undefined"
) {
  globalThis
    .DGB_UPSTREAM_COMPASS_GEOMETRY =
    DGB_UPSTREAM_COMPASS_GEOMETRY;
}

if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    DGB_UPSTREAM_COMPASS_GEOMETRY;
}

/*
AUDRALIA_ARCHCOIN_SHARED_HOME_COMPASS_GEOMETRY_RENEWAL_RESULT_v1

Disposition:
FIXED_CENTER_GEOMETRY_CONTRACT_SHELL_SOURCE_CANDIDATE

Module:
DGB_UPSTREAM_COMPASS_GEOMETRY
3.0.0-fixed-center-independent-sibling

Physical core:
PRESERVED

Preserved without physical alteration:
- all material keys
- all component dimensions
- all shape vertex literals
- all quality profiles
- all mesh construction algorithms
- all depth-envelope literals
- all radial-envelope literals
- buildModel(options)
- buildBaselineMeshes(options)
- createFrontProjectionSchema(options)
- buildStaticSvgFallback(options)
- global export
- CommonJS export

Renewed identity:
- HOME_COMPASS_FIXED_CENTER_INSTRUMENT
- FIXED_CENTER_INDEPENDENT_SIBLING
- UPSTREAM_HOME_COMPASS

Renewed transform law:
FIXED_CENTER_PLACEMENT
*
LOCAL_PRESENTATION_TRANSFORM

Orientation and settlement law:
- inheritsNavigationOrientation = false
- inheritsConstellationOrientation = false
- inheritsClusterOrientation = false
- participatesInNavigationSettlement = false
- receivesIndependentGestureDeltas = false
- publishesQuaternion = false

Authority boundary:
- ownsNavigation = false
- ownsSelectionState = false
- ownsPointerListeners = false
- ownsCameraTiming = false
- geometryIsSemanticListener = false
- semanticControlOwnedByHtml = true

Removed:
- parent-orientation inheritance
- integrated-constellation-center projection
- parentOrientationMode = INHERIT
- PARENT_ORIENTATION * PRESENTATION_LOCAL_TRANSFORM
- decisionApproach presentation transform
- validation requiring parent inheritance
- validation requiring decisionApproach
- destinationType and destinationId from physical object identity
- destination metadata from static fallback output

Bounded compatibility retained:
- buildBaselineMeshes remains an alias to buildModel
- presentationTransforms.embedded remains an alias to fixedCenter
- semanticHitEnvelope remains an alias to visualControlAlignmentEnvelope
- legacy model ID is published as compatibility metadata

Files modified:
- /assets/compass/upstream-compass.geometry.js only

Runtime execution:
NOT PERFORMED

Renderer compatibility:
PENDING RENDERER INSPECTION

Production authorization:
FALSE

Deployment authorization:
FALSE
*/
