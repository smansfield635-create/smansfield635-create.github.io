/* /assets/compass/upstream-compass.geometry.js

   Universal Compass shared geometry implementation candidate.

   Purpose:
   - define the exact UGC-04 integrated-center geometry occurrence;
   - construct deterministic three-dimensional mesh data;
   - enforce the shared noncumulative depth envelope;
   - expose one renderer-consumable buildModel() surface;
   - preserve buildBaselineMeshes() as a compatibility construction surface;
   - publish stable material identity on every finalized component mesh;
   - expose geometry validation, front-projection data, and static SVG fallback;
   - provide the anchoring geometry authority for the shared Universal Compass
     family.

   Candidate:
   UGC-04
   HYBRID_DOUBLE_RING_NORTH_NEEDLE_FOUR_POINT_ROSE

   Physical model:
   INTEGRATED_CONSTELLATION_CENTER

   Semantic model:
   UPSTREAM_RETURN_CONTROL

   Architectural rule:
   THE PAGE KNOWS ABOUT THE SHARED UNIVERSAL COMPASS.
   THE SHARED UNIVERSAL COMPASS DOES NOT KNOW THE ESTATE.

   Authorization boundary:

   SHARED_IMPLEMENTATION_CANDIDATE
   !=
   PRODUCTION_AUTHORIZATION

   Not authorized:
   - deployment;
   - public release;
   - final geometry freeze;
   - visual-pass claims.
*/

const DGB_UPSTREAM_COMPASS_GEOMETRY = (() => {
  "use strict";

  const MODULE_ID =
    "DGB_UPSTREAM_COMPASS_GEOMETRY";

  const MODULE_VERSION =
    "1.1.0-integrated-center-candidate";

  const OCCURRENCE_ID =
    "UGC_04_INTEGRATED_CENTER_OCCURRENCE_002";

  const CANDIDATE_ID =
    "UGC-04";

  const PHYSICAL_PROJECTION =
    "INTEGRATED_CONSTELLATION_CENTER";

  const SEMANTIC_RELATIONSHIP =
    "UPSTREAM_RETURN_CONTROL";

  const EPSILON =
    1e-9;

  const TAU =
    Math.PI * 2;

  const MATERIAL_KEYS = Object.freeze({
    OUTER_RING:
      "OUTER_RING",

    INNER_RING:
      "INNER_RING",

    PRINCIPAL_DIRECTION:
      "PRINCIPAL_DIRECTION",

    NORTH_NEEDLE:
      "NORTH_NEEDLE",

    CENTRAL_HUB:
      "CENTRAL_HUB",

    INTERCARDINAL_TICK:
      "INTERCARDINAL_TICK"
  });

  const STATUS = Object.freeze({
    artifactClass:
      "UNIVERSAL_COMPASS_SHARED_GEOMETRY_IMPLEMENTATION_CANDIDATE",

    candidateId:
      CANDIDATE_ID,

    occurrenceId:
      OCCURRENCE_ID,

    physicalProjection:
      PHYSICAL_PROJECTION,

    semanticRelationship:
      SEMANTIC_RELATIONSHIP,

    sharedReusableComponent:
      true,

    productionAuthorized:
      false,

    repositoryIntegrationAuthorized:
      false,

    deploymentAuthorized:
      false,

    publicReleaseAuthorized:
      false,

    finalGeometryFrozen:
      false,

    canonical:
      false,

    visualPassClaimed:
      false
  });

  const COORDINATE_SYSTEM = Object.freeze({
    dimensionality:
      3,

    handedness:
      "RIGHT_HANDED",

    axes:
      Object.freeze({
        x:
          "EAST_WEST",

        y:
          "NORTH_SOUTH",

        z:
          "REAR_FRONT_DEPTH"
      }),

    origin:
      Object.freeze([0, 0, 0]),

    north:
      Object.freeze([0, 1, 0]),

    east:
      Object.freeze([1, 0, 0]),

    south:
      Object.freeze([0, -1, 0]),

    west:
      Object.freeze([-1, 0, 0]),

    cameraFacingDirection:
      Object.freeze([0, 0, 1]),

    canonicalObjectPlaneZ:
      0
  });

  /*
   * Renewed dimensional envelope.
   *
   * The original 0.20 total depth read as a lightly extruded badge under a
   * front-biased camera. This envelope remains bounded and noncumulative, but
   * supplies enough front/rear separation for the shared renderer to expose
   * ring walls, needle depth, hub depth, and controlled parallax.
   */
  const DEPTH_ENVELOPE = Object.freeze({
    canonicalObjectPlaneZ:
      0,

    rearLimitZ:
      -0.18,

    frontLimitZ:
      0.28,

    baselineTotalDepth:
      0.46,

    absoluteRearLimitZ:
      -0.22,

    absoluteFrontLimitZ:
      0.32,

    absoluteMaximumTotalDepth:
      0.54,

    componentDepthsAre:
      "BOUNDED_WITHIN_SHARED_DEPTH_ENVELOPE_NOT_CUMULATIVELY_STACKED",

    outerRingZInterval:
      Object.freeze([-0.14, 0.14]),

    innerRingZInterval:
      Object.freeze([-0.10, 0.10]),

    principalDirectionZInterval:
      Object.freeze([-0.08, 0.18]),

    centralHubZInterval:
      Object.freeze([-0.12, 0.24]),

    northNeedleZInterval:
      Object.freeze([-0.04, 0.28]),

    intercardinalTickZInterval:
      Object.freeze([-0.06, 0.12])
  });

  const CONSTANTS = Object.freeze({
    normalizedOuterRadius:
      1,

    outerRing:
      Object.freeze({
        outerRadius:
          1.0,

        innerRadius:
          0.925,

        desktopSegments:
          48,

        mobileSegments:
          24,

        lowPowerSegments:
          16
      }),

    innerRing:
      Object.freeze({
        outerRadius:
          0.735,

        innerRadius:
          0.705,

        desktopSegments:
          48,

        mobileSegments:
          24,

        lowPowerSegments:
          16
      }),

    hub:
      Object.freeze({
        radius:
          0.18,

        desktopSegments:
          32,

        mobileSegments:
          24,

        lowPowerSegments:
          16
      }),

    northNeedle:
      Object.freeze({
        xyVertices:
          Object.freeze([
            Object.freeze([0.0, 0.82]),
            Object.freeze([-0.055, 0.22]),
            Object.freeze([-0.09, 0.10]),
            Object.freeze([0.09, 0.10]),
            Object.freeze([0.055, 0.22])
          ])
      }),

    southDirection:
      Object.freeze({
        xyVertices:
          Object.freeze([
            Object.freeze([-0.075, -0.12]),
            Object.freeze([0.0, -0.44]),
            Object.freeze([0.075, -0.12])
          ])
      }),

    eastDirection:
      Object.freeze({
        xyVertices:
          Object.freeze([
            Object.freeze([0.12, -0.07]),
            Object.freeze([0.40, 0.0]),
            Object.freeze([0.12, 0.07])
          ])
      }),

    westDirection:
      Object.freeze({
        xyVertices:
          Object.freeze([
            Object.freeze([-0.12, 0.07]),
            Object.freeze([-0.40, 0.0]),
            Object.freeze([-0.12, -0.07])
          ])
      }),

    intercardinalTicks:
      Object.freeze({
        baselineEnabled:
          false,

        radialCenter:
          0.72,

        radialLength:
          0.10,

        tangentialWidth:
          0.035,

        anglesRadians:
          Object.freeze([
            Math.PI / 4,
            (3 * Math.PI) / 4,
            (5 * Math.PI) / 4,
            (7 * Math.PI) / 4
          ])
      }),

    semanticHitEnvelope:
      Object.freeze({
        radius:
          1.08,

        zInterval:
          Object.freeze([-0.22, 0.32]),

        preferredCssTarget:
          Object.freeze([44, 44]),

        governedMinimumCssTarget:
          Object.freeze([24, 24])
      }),

    placement:
      Object.freeze({
        physicalProjection:
          PHYSICAL_PROJECTION,

        semanticRelationship:
          SEMANTIC_RELATIONSHIP,

        defaultPosition:
          Object.freeze([0, 0, 0]),

        defaultScale:
          Object.freeze([1, 1, 1]),

        /*
         * A shallow permanent compound tilt allows depth to remain legible even
         * before gesture response is applied. The renderer may add bounded
         * axial response, but does not inherit ARCHCOIN orbital settlement.
         */
        defaultQuaternion:
          Object.freeze([
            -0.103553,
            0.153046,
            -0.015929,
            0.982635
          ]),

        localQuaternionShared:
          false,

        localSettlementParticipation:
          false
      })
  });

  const QUALITY_PROFILES = Object.freeze({
    desktop:
      Object.freeze({
        id:
          "desktop",

        outerRingSegments:
          CONSTANTS.outerRing.desktopSegments,

        innerRingSegments:
          CONSTANTS.innerRing.desktopSegments,

        hubSegments:
          CONSTANTS.hub.desktopSegments
      }),

    mobile:
      Object.freeze({
        id:
          "mobile",

        outerRingSegments:
          CONSTANTS.outerRing.mobileSegments,

        innerRingSegments:
          CONSTANTS.innerRing.mobileSegments,

        hubSegments:
          CONSTANTS.hub.mobileSegments
      }),

    lowPower:
      Object.freeze({
        id:
          "lowPower",

        outerRingSegments:
          CONSTANTS.outerRing.lowPowerSegments,

        innerRingSegments:
          CONSTANTS.innerRing.lowPowerSegments,

        hubSegments:
          CONSTANTS.hub.lowPowerSegments
      })
  });

  const ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION = Object.freeze({
    recursiveFreezeExemptionClass:
      "ALL_ARRAYBUFFER_VIEWS",

    expectedFinalizedMeshBufferClass:
      Object.freeze([
        "Float32Array",
        "Uint16Array",
        "Uint32Array"
      ]),

    dataViewStatus:
      "EXEMPT_IF_ENCOUNTERED_BUT_NOT_AN_EXPECTED_FINALIZED_MESH_BUFFER_SURFACE"
  });

  const BUFFER_MUTATION_CONTRACT = Object.freeze({
    typedArrayObjectsRecursivelyFrozen:
      false,

    containingMeshRecordsFrozen:
      true,

    bufferContentsMutableDuringConstruction:
      true,

    bufferContentsMutableAfterFinalization:
      false,

    postFinalizationMutationPolicy:
      "PROHIBITED_BY_MODULE_CONTRACT",

    externalMutationAuthority:
      false,

    structuralImmutabilityClaim:
      true,

    typedArrayElementImmutabilityClaim:
      false,

    expectedFinalizedMeshBufferClass:
      Object.freeze([
        "Float32Array",
        "Uint16Array",
        "Uint32Array"
      ]),

    dataViewExpectedAsFinalizedMeshBuffer:
      false,

    rendererMutationPermitted:
      false,

    validationMutationPermitted:
      false,

    fallbackMutationPermitted:
      false,

    productionGradeImmutableBufferStrategy:
      "UNRESOLVED_AND_NOT_REQUIRED_FOR_SHARED_IMPLEMENTATION_CANDIDATE"
  });

  const FALLBACK_EMISSION_AUTHORITY = Object.freeze({
    ownership:
      MODULE_ID,

    projectionSchemaSurface:
      "createFrontProjectionSchema",

    concreteEmissionSurface:
      "buildStaticSvgFallback",

    emissionFormat:
      "INLINE_SVG_STRING",

    canonicalViewBox:
      "0 0 200 200",

    sourceOfGeometry:
      "UGC_04_INTEGRATED_CENTER_OCCURRENCE_002_CONSTANTS_AND_FRONT_PROJECTION_SCHEMA",

    separateFallbackBuilderRequired:
      false,

    separateHandAuthoredFallbackGeometry:
      false,

    monochromeCapable:
      true,

    animationRequired:
      false,

    rendererRequired:
      false,

    intentionallyTwoDimensional:
      true,

    productionAuthorized:
      false
  });

  function invariant(condition, code, details = null) {
    if (!condition) {
      const error =
        new Error(code);

      error.code =
        code;

      error.details =
        details;

      throw error;
    }
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

  function cloneVector(vector) {
    return vector.slice();
  }

  function freezeVector(vector) {
    return Object.freeze(
      cloneVector(vector)
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

    for (const key of Object.keys(value)) {
      deepFreeze(value[key]);
    }

    return value;
  }

  function resolveQualityProfile(profile) {
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
      const candidate = {
        id:
          String(
            profile.id ||
            "custom"
          ),

        outerRingSegments:
          Number(
            profile.outerRingSegments
          ),

        innerRingSegments:
          Number(
            profile.innerRingSegments
          ),

        hubSegments:
          Number(
            profile.hubSegments
          )
      };

      validateSegmentCount(
        candidate.outerRingSegments,
        "CUSTOM_OUTER_RING_SEGMENT_COUNT_INVALID"
      );

      validateSegmentCount(
        candidate.innerRingSegments,
        "CUSTOM_INNER_RING_SEGMENT_COUNT_INVALID"
      );

      validateSegmentCount(
        candidate.hubSegments,
        "CUSTOM_HUB_SEGMENT_COUNT_INVALID"
      );

      return Object.freeze(candidate);
    }

    return QUALITY_PROFILES.desktop;
  }

  function validateSegmentCount(value, code) {
    invariant(
      Number.isInteger(value) &&
      value >= 8 &&
      value <= 256,
      code,
      {
        value
      }
    );
  }

  function validateMaterialKey(materialKey) {
    invariant(
      Object.values(MATERIAL_KEYS).includes(materialKey),
      "MESH_MATERIAL_KEY_INVALID",
      {
        materialKey
      }
    );
  }

  function createEmptyMesh(
    componentId,
    primitive,
    materialKey
  ) {
    validateMaterialKey(materialKey);

    return {
      componentId,
      primitive,
      materialKey,
      positions:
        [],
      normals:
        [],
      indices:
        [],
      groups:
        [],
      metadata:
        {}
    };
  }

  function pushVertex(mesh, position, normal) {
    invariant(
      Array.isArray(position) &&
      position.length === 3 &&
      position.every(isFiniteNumber),
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
      normal.every(isFiniteNumber),
      "VERTEX_NORMAL_INVALID",
      {
        componentId:
          mesh.componentId,
        normal
      }
    );

    mesh.positions.push(
      position[0],
      position[1],
      position[2]
    );

    mesh.normals.push(
      normal[0],
      normal[1],
      normal[2]
    );

    return (
      mesh.positions.length / 3 -
      1
    );
  }

  function pushTriangle(mesh, a, b, c) {
    invariant(
      [a, b, c].every(
        (value) =>
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

    mesh.indices.push(a, b, c);
  }

  function normalize2(x, y) {
    const length =
      Math.hypot(x, y);

    invariant(
      length > EPSILON,
      "ZERO_LENGTH_VECTOR_FORBIDDEN"
    );

    return [
      x / length,
      y / length
    ];
  }

  function polygonSignedArea(vertices) {
    let sum =
      0;

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

      sum +=
        current[0] * next[1] -
        next[0] * current[1];
    }

    return sum / 2;
  }

  function validatePolygon(vertices, code) {
    invariant(
      Array.isArray(vertices) &&
      vertices.length >= 3,
      code,
      {
        reason:
          "POLYGON_REQUIRES_AT_LEAST_THREE_VERTICES"
      }
    );

    for (const vertex of vertices) {
      invariant(
        Array.isArray(vertex) &&
        vertex.length === 2 &&
        vertex.every(isFiniteNumber),
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

  function computeBoundsFromPositions(positions) {
    invariant(
      positions &&
      positions.length >= 3 &&
      positions.length % 3 === 0,
      "BOUNDING_POSITION_BUFFER_INVALID"
    );

    let minimumX =
      Infinity;

    let minimumY =
      Infinity;

    let minimumZ =
      Infinity;

    let maximumX =
      -Infinity;

    let maximumY =
      -Infinity;

    let maximumZ =
      -Infinity;

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
        Math.min(minimumX, x);

      minimumY =
        Math.min(minimumY, y);

      minimumZ =
        Math.min(minimumZ, z);

      maximumX =
        Math.max(maximumX, x);

      maximumY =
        Math.max(maximumY, y);

      maximumZ =
        Math.max(maximumZ, z);
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
        ])
    });
  }

  function finalizeMesh(mesh) {
    validateMaterialKey(
      mesh.materialKey
    );

    invariant(
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
      mesh.indices.length % 3 === 0,
      "INDEX_BUFFER_TRIANGLE_ALIGNMENT_FAILURE",
      {
        componentId:
          mesh.componentId
      }
    );

    const vertexCount =
      mesh.positions.length / 3;

    for (const index of mesh.indices) {
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
          (group) =>
            Object.freeze({
              ...group
            })
        ),

      metadata:
        deepFreeze({
          ...mesh.metadata,
          materialKey:
            mesh.materialKey
        }),

      bounds,

      vertexCount,

      triangleCount:
        mesh.indices.length / 3
    });
  }

  function createExtrudedAnnulus({
    componentId,
    materialKey,
    outerRadius,
    innerRadius,
    zRear,
    zFront,
    segments
  }) {
    validateSegmentCount(
      segments,
      "ANNULUS_SEGMENT_COUNT_INVALID"
    );

    invariant(
      isFiniteNumber(outerRadius) &&
      isFiniteNumber(innerRadius) &&
      outerRadius > innerRadius &&
      innerRadius > 0,
      "ANNULUS_RADIUS_RELATION_INVALID",
      {
        componentId,
        outerRadius,
        innerRadius
      }
    );

    invariant(
      isFiniteNumber(zRear) &&
      isFiniteNumber(zFront) &&
      zFront > zRear,
      "ANNULUS_DEPTH_INTERVAL_INVALID",
      {
        componentId,
        zRear,
        zFront
      }
    );

    const mesh =
      createEmptyMesh(
        componentId,
        "EXTRUDED_ANNULUS",
        materialKey
      );

    const frontOuter =
      [];

    const frontInner =
      [];

    const rearOuter =
      [];

    const rearInner =
      [];

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const theta =
        (TAU * index) /
        segments;

      const cosine =
        Math.cos(theta);

      const sine =
        Math.sin(theta);

      frontOuter.push(
        pushVertex(
          mesh,
          [
            outerRadius * cosine,
            outerRadius * sine,
            zFront
          ],
          [0, 0, 1]
        )
      );

      frontInner.push(
        pushVertex(
          mesh,
          [
            innerRadius * cosine,
            innerRadius * sine,
            zFront
          ],
          [0, 0, 1]
        )
      );

      rearOuter.push(
        pushVertex(
          mesh,
          [
            outerRadius * cosine,
            outerRadius * sine,
            zRear
          ],
          [0, 0, -1]
        )
      );

      rearInner.push(
        pushVertex(
          mesh,
          [
            innerRadius * cosine,
            innerRadius * sine,
            zRear
          ],
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
        (index + 1) %
        segments;

      pushTriangle(
        mesh,
        frontOuter[index],
        frontOuter[next],
        frontInner[index]
      );

      pushTriangle(
        mesh,
        frontOuter[next],
        frontInner[next],
        frontInner[index]
      );

      pushTriangle(
        mesh,
        rearOuter[index],
        rearInner[index],
        rearOuter[next]
      );

      pushTriangle(
        mesh,
        rearOuter[next],
        rearInner[index],
        rearInner[next]
      );
    }

    const outerWallStart =
      mesh.indices.length;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const next =
        (index + 1) %
        segments;

      const thetaA =
        (TAU * index) /
        segments;

      const thetaB =
        (TAU * next) /
        segments;

      const aNormal = [
        Math.cos(thetaA),
        Math.sin(thetaA),
        0
      ];

      const bNormal = [
        Math.cos(thetaB),
        Math.sin(thetaB),
        0
      ];

      const aFront =
        pushVertex(
          mesh,
          [
            outerRadius * aNormal[0],
            outerRadius * aNormal[1],
            zFront
          ],
          aNormal
        );

      const bFront =
        pushVertex(
          mesh,
          [
            outerRadius * bNormal[0],
            outerRadius * bNormal[1],
            zFront
          ],
          bNormal
        );

      const aRear =
        pushVertex(
          mesh,
          [
            outerRadius * aNormal[0],
            outerRadius * aNormal[1],
            zRear
          ],
          aNormal
        );

      const bRear =
        pushVertex(
          mesh,
          [
            outerRadius * bNormal[0],
            outerRadius * bNormal[1],
            zRear
          ],
          bNormal
        );

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

    const innerWallStart =
      mesh.indices.length;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const next =
        (index + 1) %
        segments;

      const thetaA =
        (TAU * index) /
        segments;

      const thetaB =
        (TAU * next) /
        segments;

      const aNormal = [
        -Math.cos(thetaA),
        -Math.sin(thetaA),
        0
      ];

      const bNormal = [
        -Math.cos(thetaB),
        -Math.sin(thetaB),
        0
      ];

      const aFront =
        pushVertex(
          mesh,
          [
            -innerRadius * aNormal[0],
            -innerRadius * aNormal[1],
            zFront
          ],
          aNormal
        );

      const bFront =
        pushVertex(
          mesh,
          [
            -innerRadius * bNormal[0],
            -innerRadius * bNormal[1],
            zFront
          ],
          bNormal
        );

      const aRear =
        pushVertex(
          mesh,
          [
            -innerRadius * aNormal[0],
            -innerRadius * aNormal[1],
            zRear
          ],
          aNormal
        );

      const bRear =
        pushVertex(
          mesh,
          [
            -innerRadius * bNormal[0],
            -innerRadius * bNormal[1],
            zRear
          ],
          bNormal
        );

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
    }

    mesh.groups.push(
      {
        id:
          "ANNULUS_FRONT_AND_REAR",

        indexStart:
          0,

        indexCount:
          outerWallStart
      },

      {
        id:
          "ANNULUS_OUTER_WALL",

        indexStart:
          outerWallStart,

        indexCount:
          innerWallStart -
          outerWallStart
      },

      {
        id:
          "ANNULUS_INNER_WALL",

        indexStart:
          innerWallStart,

        indexCount:
          mesh.indices.length -
          innerWallStart
      }
    );

    mesh.metadata = {
      outerRadius,
      innerRadius,
      zRear,
      zFront,
      segments
    };

    return finalizeMesh(mesh);
  }

  function createExtrudedConvexPolygon({
    componentId,
    materialKey,
    xyVertices,
    zRear,
    zFront,
    primitive =
      "EXTRUDED_CONVEX_POLYGON"
  }) {
    validatePolygon(
      xyVertices,
      "EXTRUDED_POLYGON_INVALID"
    );

    invariant(
      isFiniteNumber(zRear) &&
      isFiniteNumber(zFront) &&
      zFront > zRear,
      "EXTRUDED_POLYGON_DEPTH_INVALID",
      {
        componentId,
        zRear,
        zFront
      }
    );

    const mesh =
      createEmptyMesh(
        componentId,
        primitive,
        materialKey
      );

    const front =
      [];

    const rear =
      [];

    for (const vertex of xyVertices) {
      front.push(
        pushVertex(
          mesh,
          [
            vertex[0],
            vertex[1],
            zFront
          ],
          [0, 0, 1]
        )
      );

      rear.push(
        pushVertex(
          mesh,
          [
            vertex[0],
            vertex[1],
            zRear
          ],
          [0, 0, -1]
        )
      );
    }

    for (
      let index = 1;
      index <
      xyVertices.length - 1;
      index += 1
    ) {
      pushTriangle(
        mesh,
        front[0],
        front[index],
        front[index + 1]
      );

      pushTriangle(
        mesh,
        rear[0],
        rear[index + 1],
        rear[index]
      );
    }

    const sideStart =
      mesh.indices.length;

    for (
      let index = 0;
      index < xyVertices.length;
      index += 1
    ) {
      const next =
        (index + 1) %
        xyVertices.length;

      const a =
        xyVertices[index];

      const b =
        xyVertices[next];

      const edgeX =
        b[0] - a[0];

      const edgeY =
        b[1] - a[1];

      const normal2 =
        normalize2(
          edgeY,
          -edgeX
        );

      const normal = [
        normal2[0],
        normal2[1],
        0
      ];

      const aFront =
        pushVertex(
          mesh,
          [
            a[0],
            a[1],
            zFront
          ],
          normal
        );

      const bFront =
        pushVertex(
          mesh,
          [
            b[0],
            b[1],
            zFront
          ],
          normal
        );

      const aRear =
        pushVertex(
          mesh,
          [
            a[0],
            a[1],
            zRear
          ],
          normal
        );

      const bRear =
        pushVertex(
          mesh,
          [
            b[0],
            b[1],
            zRear
          ],
          normal
        );

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

    mesh.groups.push(
      {
        id:
          "POLYGON_FRONT_AND_REAR",

        indexStart:
          0,

        indexCount:
          sideStart
      },

      {
        id:
          "POLYGON_SIDE_WALLS",

        indexStart:
          sideStart,

        indexCount:
          mesh.indices.length -
          sideStart
      }
    );

    mesh.metadata = {
      xyVertices:
        xyVertices.map(
          cloneVector
        ),

      zRear,

      zFront
    };

    return finalizeMesh(mesh);
  }

  function createExtrudedCylinder({
    componentId,
    materialKey,
    radius,
    zRear,
    zFront,
    segments
  }) {
    validateSegmentCount(
      segments,
      "CYLINDER_SEGMENT_COUNT_INVALID"
    );

    invariant(
      isFiniteNumber(radius) &&
      radius > 0,
      "CYLINDER_RADIUS_INVALID",
      {
        componentId,
        radius
      }
    );

    invariant(
      isFiniteNumber(zRear) &&
      isFiniteNumber(zFront) &&
      zFront > zRear,
      "CYLINDER_DEPTH_INTERVAL_INVALID",
      {
        componentId,
        zRear,
        zFront
      }
    );

    const mesh =
      createEmptyMesh(
        componentId,
        "EXTRUDED_CYLINDER",
        materialKey
      );

    const frontCenter =
      pushVertex(
        mesh,
        [0, 0, zFront],
        [0, 0, 1]
      );

    const rearCenter =
      pushVertex(
        mesh,
        [0, 0, zRear],
        [0, 0, -1]
      );

    const front =
      [];

    const rear =
      [];

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const theta =
        (TAU * index) /
        segments;

      const cosine =
        Math.cos(theta);

      const sine =
        Math.sin(theta);

      front.push(
        pushVertex(
          mesh,
          [
            radius * cosine,
            radius * sine,
            zFront
          ],
          [0, 0, 1]
        )
      );

      rear.push(
        pushVertex(
          mesh,
          [
            radius * cosine,
            radius * sine,
            zRear
          ],
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
        (index + 1) %
        segments;

      pushTriangle(
        mesh,
        frontCenter,
        front[index],
        front[next]
      );

      pushTriangle(
        mesh,
        rearCenter,
        rear[next],
        rear[index]
      );
    }

    const sideStart =
      mesh.indices.length;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const next =
        (index + 1) %
        segments;

      const thetaA =
        (TAU * index) /
        segments;

      const thetaB =
        (TAU * next) /
        segments;

      const normalA = [
        Math.cos(thetaA),
        Math.sin(thetaA),
        0
      ];

      const normalB = [
        Math.cos(thetaB),
        Math.sin(thetaB),
        0
      ];

      const aFront =
        pushVertex(
          mesh,
          [
            radius * normalA[0],
            radius * normalA[1],
            zFront
          ],
          normalA
        );

      const bFront =
        pushVertex(
          mesh,
          [
            radius * normalB[0],
            radius * normalB[1],
            zFront
          ],
          normalB
        );

      const aRear =
        pushVertex(
          mesh,
          [
            radius * normalA[0],
            radius * normalA[1],
            zRear
          ],
          normalA
        );

      const bRear =
        pushVertex(
          mesh,
          [
            radius * normalB[0],
            radius * normalB[1],
            zRear
          ],
          normalB
        );

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

    mesh.groups.push(
      {
        id:
          "CYLINDER_CAPS",

        indexStart:
          0,

        indexCount:
          sideStart
      },

      {
        id:
          "CYLINDER_SIDE_WALL",

        indexStart:
          sideStart,

        indexCount:
          mesh.indices.length -
          sideStart
      }
    );

    mesh.metadata = {
      radius,
      zRear,
      zFront,
      segments
    };

    return finalizeMesh(mesh);
  }

  function createIntercardinalTickPolygon(
    angle,
    radialCenter,
    radialLength,
    tangentialWidth
  ) {
    const direction = [
      Math.cos(angle),
      Math.sin(angle)
    ];

    const tangent = [
      -direction[1],
      direction[0]
    ];

    const radialHalf =
      radialLength / 2;

    const tangentHalf =
      tangentialWidth / 2;

    const center = [
      direction[0] *
        radialCenter,

      direction[1] *
        radialCenter
    ];

    const rearCenter = [
      center[0] -
        direction[0] *
        radialHalf,

      center[1] -
        direction[1] *
        radialHalf
    ];

    const frontCenter = [
      center[0] +
        direction[0] *
        radialHalf,

      center[1] +
        direction[1] *
        radialHalf
    ];

    return [
      [
        rearCenter[0] -
          tangent[0] *
          tangentHalf,

        rearCenter[1] -
          tangent[1] *
          tangentHalf
      ],

      [
        frontCenter[0] -
          tangent[0] *
          tangentHalf,

        frontCenter[1] -
          tangent[1] *
          tangentHalf
      ],

      [
        frontCenter[0] +
          tangent[0] *
          tangentHalf,

        frontCenter[1] +
          tangent[1] *
          tangentHalf
      ],

      [
        rearCenter[0] +
          tangent[0] *
          tangentHalf,

        rearCenter[1] +
          tangent[1] *
          tangentHalf
      ]
    ];
  }

  function summarizeMeshes(meshes) {
    invariant(
      Array.isArray(meshes) &&
      meshes.length > 0,
      "MESH_COLLECTION_REQUIRED"
    );

    let vertexCount =
      0;

    let triangleCount =
      0;

    const aggregatePositions =
      [];

    for (const mesh of meshes) {
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
      {
        minimumZ
      }
    );

    invariant(
      maximumZ <=
        DEPTH_ENVELOPE.absoluteFrontLimitZ +
        EPSILON,
      "ABSOLUTE_FRONT_DEPTH_LIMIT_EXCEEDED",
      {
        maximumZ
      }
    );

    invariant(
      maximumZ - minimumZ <=
        DEPTH_ENVELOPE.absoluteMaximumTotalDepth +
        EPSILON,
      "ABSOLUTE_TOTAL_DEPTH_EXCEEDED",
      {
        minimumZ,
        maximumZ,
        totalDepth:
          maximumZ - minimumZ
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
        Math.hypot(x, y);

      invariant(
        radius <=
          CONSTANTS.normalizedOuterRadius +
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

  function validateEastWestMirror() {
    const east =
      CONSTANTS.eastDirection.xyVertices;

    const west =
      CONSTANTS.westDirection.xyVertices;

    invariant(
      east.length === west.length,
      "EAST_WEST_VERTEX_COUNT_MISMATCH"
    );

    const mirroredEast =
      east.map(
        ([x, y]) =>
          [-x, y]
      );

    const normalizedWest = [
      west[2],
      west[1],
      west[0]
    ];

    for (
      let index = 0;
      index < mirroredEast.length;
      index += 1
    ) {
      invariant(
        Math.abs(
          mirroredEast[index][0] -
          normalizedWest[index][0]
        ) <= EPSILON &&
        Math.abs(
          mirroredEast[index][1] -
          normalizedWest[index][1]
        ) <= EPSILON,
        "EAST_WEST_MIRROR_SYMMETRY_FAILURE",
        {
          index,
          mirroredEast:
            mirroredEast[index],
          normalizedWest:
            normalizedWest[index]
        }
      );
    }
  }

  function validateNorthDominance() {
    const northMaximum =
      Math.max(
        ...CONSTANTS.northNeedle.xyVertices.map(
          ([, y]) => y
        )
      );

    const otherMaximum =
      Math.max(
        Math.abs(
          Math.min(
            ...CONSTANTS.southDirection.xyVertices.map(
              ([, y]) => y
            )
          )
        ),

        Math.max(
          ...CONSTANTS.eastDirection.xyVertices.map(
            ([x]) =>
              Math.abs(x)
          )
        ),

        Math.max(
          ...CONSTANTS.westDirection.xyVertices.map(
            ([x]) =>
              Math.abs(x)
          )
        )
      );

    invariant(
      northMaximum >
        otherMaximum,
      "NORTH_NEEDLE_NOT_DOMINANT",
      {
        northMaximum,
        otherMaximum
      }
    );
  }

  function validateRingSeparation() {
    invariant(
      CONSTANTS.innerRing.outerRadius <
        CONSTANTS.outerRing.innerRadius,
      "INNER_RING_INTERSECTS_OUTER_RING",
      {
        innerRingOuterRadius:
          CONSTANTS.innerRing.outerRadius,

        outerRingInnerRadius:
          CONSTANTS.outerRing.innerRadius
      }
    );
  }

  function validateHubOverlap() {
    const hubRadius =
      CONSTANTS.hub.radius;

    const requiredVertices = [
      CONSTANTS.northNeedle.xyVertices,
      CONSTANTS.southDirection.xyVertices,
      CONSTANTS.eastDirection.xyVertices,
      CONSTANTS.westDirection.xyVertices
    ];

    for (
      let polygonIndex = 0;
      polygonIndex < requiredVertices.length;
      polygonIndex += 1
    ) {
      const polygon =
        requiredVertices[polygonIndex];

      const intersectsHub =
        polygon.some(
          ([x, y]) =>
            Math.hypot(x, y) <=
            hubRadius +
            EPSILON
        );

      invariant(
        intersectsHub,
        "PRINCIPAL_COMPONENT_DOES_NOT_OVERLAP_HUB",
        {
          polygonIndex,
          hubRadius
        }
      );
    }
  }

  function buildBaselineMeshes(options = {}) {
    const quality =
      resolveQualityProfile(
        options.quality ||
        "desktop"
      );

    const includeIntercardinalTicks =
      options.includeIntercardinalTicks ===
      true;

    const outerRing =
      createExtrudedAnnulus({
        componentId:
          "UGC04_OUTER_HOUSING_RING",

        materialKey:
          MATERIAL_KEYS.OUTER_RING,

        outerRadius:
          CONSTANTS.outerRing.outerRadius,

        innerRadius:
          CONSTANTS.outerRing.innerRadius,

        zRear:
          DEPTH_ENVELOPE.outerRingZInterval[0],

        zFront:
          DEPTH_ENVELOPE.outerRingZInterval[1],

        segments:
          quality.outerRingSegments
      });

    const innerRing =
      createExtrudedAnnulus({
        componentId:
          "UGC04_INNER_DIRECTION_RING",

        materialKey:
          MATERIAL_KEYS.INNER_RING,

        outerRadius:
          CONSTANTS.innerRing.outerRadius,

        innerRadius:
          CONSTANTS.innerRing.innerRadius,

        zRear:
          DEPTH_ENVELOPE.innerRingZInterval[0],

        zFront:
          DEPTH_ENVELOPE.innerRingZInterval[1],

        segments:
          quality.innerRingSegments
      });

    const southDirection =
      createExtrudedConvexPolygon({
        componentId:
          "UGC04_SOUTH_DIRECTION",

        materialKey:
          MATERIAL_KEYS.PRINCIPAL_DIRECTION,

        primitive:
          "EXTRUDED_TRIANGULAR_BLADE",

        xyVertices:
          CONSTANTS.southDirection.xyVertices,

        zRear:
          DEPTH_ENVELOPE.principalDirectionZInterval[0],

        zFront:
          DEPTH_ENVELOPE.principalDirectionZInterval[1]
      });

    const eastDirection =
      createExtrudedConvexPolygon({
        componentId:
          "UGC04_EAST_DIRECTION",

        materialKey:
          MATERIAL_KEYS.PRINCIPAL_DIRECTION,

        primitive:
          "EXTRUDED_TRIANGULAR_BLADE",

        xyVertices:
          CONSTANTS.eastDirection.xyVertices,

        zRear:
          DEPTH_ENVELOPE.principalDirectionZInterval[0],

        zFront:
          DEPTH_ENVELOPE.principalDirectionZInterval[1]
      });

    const westDirection =
      createExtrudedConvexPolygon({
        componentId:
          "UGC04_WEST_DIRECTION",

        materialKey:
          MATERIAL_KEYS.PRINCIPAL_DIRECTION,

        primitive:
          "EXTRUDED_TRIANGULAR_BLADE",

        xyVertices:
          CONSTANTS.westDirection.xyVertices,

        zRear:
          DEPTH_ENVELOPE.principalDirectionZInterval[0],

        zFront:
          DEPTH_ENVELOPE.principalDirectionZInterval[1]
      });

    const northNeedle =
      createExtrudedConvexPolygon({
        componentId:
          "UGC04_DOMINANT_NORTH_NEEDLE",

        materialKey:
          MATERIAL_KEYS.NORTH_NEEDLE,

        primitive:
          "EXTRUDED_NORTH_NEEDLE",

        xyVertices:
          CONSTANTS.northNeedle.xyVertices,

        zRear:
          DEPTH_ENVELOPE.northNeedleZInterval[0],

        zFront:
          DEPTH_ENVELOPE.northNeedleZInterval[1]
      });

    const centralHub =
      createExtrudedCylinder({
        componentId:
          "UGC04_CENTRAL_HUB",

        materialKey:
          MATERIAL_KEYS.CENTRAL_HUB,

        radius:
          CONSTANTS.hub.radius,

        zRear:
          DEPTH_ENVELOPE.centralHubZInterval[0],

        zFront:
          DEPTH_ENVELOPE.centralHubZInterval[1],

        segments:
          quality.hubSegments
      });

    const meshes = [
      outerRing,
      innerRing,
      southDirection,
      eastDirection,
      westDirection,
      northNeedle,
      centralHub
    ];

    if (includeIntercardinalTicks) {
      for (
        let index = 0;
        index <
        CONSTANTS.intercardinalTicks.anglesRadians.length;
        index += 1
      ) {
        const angle =
          CONSTANTS.intercardinalTicks.anglesRadians[index];

        const polygon =
          createIntercardinalTickPolygon(
            angle,
            CONSTANTS.intercardinalTicks.radialCenter,
            CONSTANTS.intercardinalTicks.radialLength,
            CONSTANTS.intercardinalTicks.tangentialWidth
          );

        meshes.push(
          createExtrudedConvexPolygon({
            componentId:
              `UGC04_INTERCARDINAL_TICK_${index + 1}`,

            materialKey:
              MATERIAL_KEYS.INTERCARDINAL_TICK,

            primitive:
              "EXTRUDED_INTERCARDINAL_TICK",

            xyVertices:
              polygon,

            zRear:
              DEPTH_ENVELOPE.intercardinalTickZInterval[0],

            zFront:
              DEPTH_ENVELOPE.intercardinalTickZInterval[1]
          })
        );
      }
    }

    const model =
      deepFreeze({
        moduleId:
          MODULE_ID,

        moduleVersion:
          MODULE_VERSION,

        occurrenceId:
          OCCURRENCE_ID,

        candidateId:
          CANDIDATE_ID,

        qualityProfile:
          quality,

        includeIntercardinalTicks,

        physicalProjection:
          PHYSICAL_PROJECTION,

        semanticRelationship:
          SEMANTIC_RELATIONSHIP,

        componentCount:
          meshes.length,

        meshes,

        semanticHitEnvelope:
          CONSTANTS.semanticHitEnvelope,

        rootTransform:
          CONSTANTS.placement,

        aggregate:
          summarizeMeshes(meshes)
      });

    validateModel(model);

    return model;
  }

  /*
   * Canonical renderer-consumable model builder.
   *
   * buildBaselineMeshes() remains exposed for compatibility, but buildModel()
   * is the stable shared renderer entry surface.
   */
  function buildModel(options = {}) {
    return buildBaselineMeshes(options);
  }

  function validateModel(model) {
    invariant(
      model &&
      model.moduleId === MODULE_ID,
      "MODEL_MODULE_ID_MISMATCH"
    );

    invariant(
      model.occurrenceId ===
      OCCURRENCE_ID,
      "MODEL_OCCURRENCE_ID_MISMATCH"
    );

    invariant(
      model.physicalProjection ===
      PHYSICAL_PROJECTION,
      "INTEGRATED_CONSTELLATION_CENTER_MODEL_REQUIRED"
    );

    invariant(
      model.semanticRelationship ===
      SEMANTIC_RELATIONSHIP,
      "UPSTREAM_SEMANTIC_RELATION_REQUIRED"
    );

    validateRingSeparation();
    validateNorthDominance();
    validateEastWestMirror();
    validateHubOverlap();

    for (const mesh of model.meshes) {
      validateMaterialKey(
        mesh.materialKey
      );

      validateDepthBounds(
        mesh.bounds
      );

      validateRadialBounds(
        mesh
      );
    }

    validateDepthBounds(
      model.aggregate.bounds
    );

    invariant(
      model.aggregate.actualTotalDepth <=
        DEPTH_ENVELOPE.absoluteMaximumTotalDepth +
        EPSILON,
      "MODEL_TOTAL_DEPTH_EXCEEDS_ABSOLUTE_MAXIMUM"
    );

    invariant(
      model.aggregate.actualTotalDepth >=
        DEPTH_ENVELOPE.baselineTotalDepth -
        EPSILON,
      "MODEL_TOTAL_DEPTH_BELOW_RENEWED_BASELINE"
    );

    invariant(
      model.rootTransform.localQuaternionShared ===
      false,
      "LOCAL_QUATERNION_SHARING_FORBIDDEN"
    );

    invariant(
      model.rootTransform.localSettlementParticipation ===
      false,
      "LOCAL_SETTLEMENT_PARTICIPATION_FORBIDDEN"
    );

    invariant(
      Array.isArray(
        model.rootTransform.defaultQuaternion
      ) &&
      model.rootTransform.defaultQuaternion.length ===
        4,
      "DEFAULT_QUATERNION_REQUIRED"
    );

    return deepFreeze({
      pass:
        true,

      moduleId:
        MODULE_ID,

      occurrenceId:
        OCCURRENCE_ID,

      candidateId:
        CANDIDATE_ID,

      componentCount:
        model.componentCount,

      vertexCount:
        model.aggregate.vertexCount,

      triangleCount:
        model.aggregate.triangleCount,

      bounds:
        model.aggregate.bounds,

      actualTotalDepth:
        model.aggregate.actualTotalDepth,

      physicalProjection:
        PHYSICAL_PROJECTION,

      semanticRelationship:
        SEMANTIC_RELATIONSHIP,

      materialIdentityPresent:
        model.meshes.every(
          (mesh) =>
            typeof mesh.materialKey ===
              "string" &&
            mesh.materialKey.length >
              0
        ),

      productionAuthorized:
        false
    });
  }

  function createFrontProjectionSchema(options = {}) {
    const includeIntercardinalTicks =
      options.includeIntercardinalTicks ===
      true;

    const schema = {
      sourceModule:
        MODULE_ID,

      candidateId:
        CANDIDATE_ID,

      occurrenceId:
        OCCURRENCE_ID,

      physicalProjection:
        PHYSICAL_PROJECTION,

      projectionSchemaBacked:
        true,

      intentionallyTwoDimensional:
        true,

      viewBox:
        "0 0 200 200",

      normalizedToSvg:
        Object.freeze({
          scale:
            90,

          centerX:
            100,

          centerY:
            100,

          x:
            "100 + 90*x",

          y:
            "100 - 90*y"
        }),

      layers:
        [
          {
            id:
              "OUTER_RING",

            materialKey:
              MATERIAL_KEYS.OUTER_RING,

            type:
              "ANNULUS",

            outerRadius:
              CONSTANTS.outerRing.outerRadius,

            innerRadius:
              CONSTANTS.outerRing.innerRadius
          },

          {
            id:
              "INNER_RING",

            materialKey:
              MATERIAL_KEYS.INNER_RING,

            type:
              "ANNULUS",

            outerRadius:
              CONSTANTS.innerRing.outerRadius,

            innerRadius:
              CONSTANTS.innerRing.innerRadius
          },

          {
            id:
              "SOUTH_DIRECTION",

            materialKey:
              MATERIAL_KEYS.PRINCIPAL_DIRECTION,

            type:
              "POLYGON",

            vertices:
              CONSTANTS.southDirection.xyVertices
          },

          {
            id:
              "EAST_DIRECTION",

            materialKey:
              MATERIAL_KEYS.PRINCIPAL_DIRECTION,

            type:
              "POLYGON",

            vertices:
              CONSTANTS.eastDirection.xyVertices
          },

          {
            id:
              "WEST_DIRECTION",

            materialKey:
              MATERIAL_KEYS.PRINCIPAL_DIRECTION,

            type:
              "POLYGON",

            vertices:
              CONSTANTS.westDirection.xyVertices
          },

          {
            id:
              "NORTH_NEEDLE",

            materialKey:
              MATERIAL_KEYS.NORTH_NEEDLE,

            type:
              "POLYGON",

            vertices:
              CONSTANTS.northNeedle.xyVertices
          },

          {
            id:
              "CENTRAL_HUB",

            materialKey:
              MATERIAL_KEYS.CENTRAL_HUB,

            type:
              "CIRCLE",

            radius:
              CONSTANTS.hub.radius
          }
        ]
    };

    if (includeIntercardinalTicks) {
      schema.layers.splice(
        2,
        0,
        ...CONSTANTS.intercardinalTicks.anglesRadians.map(
          (angle, index) => ({
            id:
              `INTERCARDINAL_TICK_${index + 1}`,

            materialKey:
              MATERIAL_KEYS.INTERCARDINAL_TICK,

            type:
              "POLYGON",

            vertices:
              createIntercardinalTickPolygon(
                angle,
                CONSTANTS.intercardinalTicks.radialCenter,
                CONSTANTS.intercardinalTicks.radialLength,
                CONSTANTS.intercardinalTicks.tangentialWidth
              )
          })
        )
      );
    }

    return deepFreeze(schema);
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

  function escapeXmlAttribute(value) {
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

  function createPolygonPoints(vertices) {
    return vertices
      .map(
        ([x, y]) =>
          `${mapSvgX(x)},${mapSvgY(y)}`
      )
      .join(" ");
  }

  function getUtf8ByteLength(value) {
    if (
      typeof TextEncoder !==
      "undefined"
    ) {
      return new TextEncoder()
        .encode(value)
        .byteLength;
    }

    return unescape(
      encodeURIComponent(value)
    ).length;
  }

  function createSvgStringFromProjectionSchema(
    schema,
    options
  ) {
    const title =
      String(options.title);

    const className =
      String(options.className);

    const includeTitle =
      options.includeTitle ===
      true;

    const ariaHidden =
      options.ariaHidden ===
      true;

    const focusable =
      options.focusable ===
      true;

    invariant(
      ariaHidden ||
      includeTitle,
      "ACCESSIBLE_SVG_REQUIRES_TITLE_WHEN_NOT_ARIA_HIDDEN"
    );

    const lines = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeXmlAttribute(schema.viewBox)}" class="${escapeXmlAttribute(className)}" aria-hidden="${ariaHidden ? "true" : "false"}" focusable="${focusable ? "true" : "false"}" data-ugc04-fallback="true" data-ugc04-source-module="${escapeXmlAttribute(MODULE_ID)}" data-ugc04-occurrence-id="${escapeXmlAttribute(OCCURRENCE_ID)}" data-ugc04-physical-projection="${escapeXmlAttribute(PHYSICAL_PROJECTION)}">`
    ];

    if (includeTitle) {
      lines.push(
        `<title>${escapeXmlText(title)}</title>`
      );
    }

    for (const layer of schema.layers) {
      if (
        layer.type ===
        "ANNULUS"
      ) {
        lines.push(
          `<path data-ugc04-layer="${escapeXmlAttribute(layer.id)}" data-ugc04-material-key="${escapeXmlAttribute(layer.materialKey)}" d="${escapeXmlAttribute(
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
          `<polygon data-ugc04-layer="${escapeXmlAttribute(layer.id)}" data-ugc04-material-key="${escapeXmlAttribute(layer.materialKey)}" points="${escapeXmlAttribute(
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
          `<circle data-ugc04-layer="${escapeXmlAttribute(layer.id)}" data-ugc04-material-key="${escapeXmlAttribute(layer.materialKey)}" cx="100" cy="100" r="${escapeXmlAttribute(
            String(
              layer.radius * 90
            )
          )}" fill="currentColor"/>`
        );

        continue;
      }

      invariant(
        false,
        "UNSUPPORTED_PROJECTION_LAYER_TYPE",
        {
          layerId:
            layer.id,
          type:
            layer.type
        }
      );
    }

    lines.push("</svg>");

    return lines.join("");
  }

  function buildStaticSvgFallback(options = {}) {
    const {
      title =
        "Return to Master Compass",

      className =
        "ugc04-static-fallback",

      includeTitle =
        true,

      includeIntercardinalTicks =
        false,

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

    const svgString =
      createSvgStringFromProjectionSchema(
        schema,
        {
          title,
          className,
          includeTitle,
          ariaHidden,
          focusable
        }
      );

    return deepFreeze({
      viewBox:
        schema.viewBox,

      svgString,

      stringLength:
        svgString.length,

      utf8ByteLength:
        getUtf8ByteLength(
          svgString
        ),

      layerCount:
        schema.layers.length,

      projectionSchemaBacked:
        true,

      intentionallyTwoDimensional:
        true,

      sourceModule:
        MODULE_ID,

      candidateId:
        CANDIDATE_ID,

      occurrenceId:
        OCCURRENCE_ID,

      physicalProjection:
        PHYSICAL_PROJECTION,

      includeIntercardinalTicks,

      monochromeCapable:
        true,

      animationRequired:
        false,

      rendererRequired:
        false,

      productionAuthorized:
        false
    });
  }

  function createPrototypeReceipt(options = {}) {
    const model =
      options.model ||
      buildModel({
        quality:
          options.quality ||
          "desktop",

        includeIntercardinalTicks:
          options.includeIntercardinalTicks ===
          true
      });

    const validation =
      validateModel(model);

    const fallback =
      buildStaticSvgFallback({
        includeIntercardinalTicks:
          model.includeIntercardinalTicks
      });

    return deepFreeze({
      receiptSchema:
        "DGB_UPSTREAM_COMPASS_GEOMETRY_PROTOTYPE_RECEIPT_v2",

      moduleId:
        MODULE_ID,

      moduleVersion:
        MODULE_VERSION,

      candidateId:
        CANDIDATE_ID,

      occurrenceId:
        OCCURRENCE_ID,

      artifactClass:
        STATUS.artifactClass,

      geometryVersion:
        MODULE_VERSION,

      buildSurface:
        "buildModel",

      compatibilityBuildSurface:
        "buildBaselineMeshes",

      physicalProjection:
        PHYSICAL_PROJECTION,

      semanticRelationship:
        SEMANTIC_RELATIONSHIP,

      qualityProfile:
        model.qualityProfile.id,

      intercardinalTicksEnabled:
        model.includeIntercardinalTicks,

      componentCount:
        model.componentCount,

      vertexCount:
        model.aggregate.vertexCount,

      triangleCount:
        model.aggregate.triangleCount,

      aggregateBounds:
        model.aggregate.bounds,

      actualTotalDepth:
        model.aggregate.actualTotalDepth,

      depthEnvelope:
        DEPTH_ENVELOPE,

      materialKeys:
        MATERIAL_KEYS,

      componentMaterialIdentity:
        Object.freeze(
          model.meshes.map(
            (mesh) =>
              Object.freeze({
                componentId:
                  mesh.componentId,

                materialKey:
                  mesh.materialKey
              })
          )
        ),

      semanticHitEnvelope:
        CONSTANTS.semanticHitEnvelope,

      rootTransform:
        CONSTANTS.placement,

      arrayBufferViewPolicyClarification:
        ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION,

      bufferMutationContract:
        BUFFER_MUTATION_CONTRACT,

      fallbackEmission:
        Object.freeze({
          authority:
            MODULE_ID,

          projectionSchemaSurface:
            "createFrontProjectionSchema",

          concreteEmissionSurface:
            "buildStaticSvgFallback",

          generated:
            true,

          projectionSchemaBacked:
            true,

          intentionallyTwoDimensional:
            true,

          separateHandAuthoredGeometry:
            false,

          canonicalViewBox:
            fallback.viewBox,

          stringLength:
            fallback.stringLength,

          utf8ByteLength:
            fallback.utf8ByteLength,

          layerCount:
            fallback.layerCount,

          productionAuthorized:
            false
        }),

      validation,

      authorization:
        Object.freeze({
          productionAuthorized:
            false,

          repositoryIntegrationAuthorized:
            false,

          deploymentAuthorized:
            false,

          publicReleaseAuthorized:
            false,

          finalGeometryFrozen:
            false
        }),

      disposition:
        "UNIVERSAL_COMPASS_INTEGRATED_CENTER_GEOMETRY_CANDIDATE_CONSTRUCTED_AND_READY_FOR_SHARED_RENDERER_CONSUMPTION"
    });
  }

  function assertBooleanChecks(
    checks,
    codePrefix
  ) {
    invariant(
      checks &&
      typeof checks ===
        "object" &&
      !Array.isArray(checks),
      `${codePrefix}_CHECK_RECORD_INVALID`,
      {
        checks
      }
    );

    for (
      const [name, passed]
      of Object.entries(checks)
    ) {
      invariant(
        typeof passed ===
        "boolean",
        `${codePrefix}_${name}_NOT_BOOLEAN`,
        {
          check:
            name,
          passed
        }
      );

      invariant(
        passed ===
        true,
        `${codePrefix}_${name}`,
        {
          check:
            name,
          passed
        }
      );
    }

    return true;
  }

  function runSelfTest() {
    const desktop =
      buildModel({
        quality:
          "desktop"
      });

    const mobile =
      buildModel({
        quality:
          "mobile"
      });

    const lowPower =
      buildModel({
        quality:
          "lowPower"
      });

    const optionalTicks =
      buildModel({
        quality:
          "desktop",

        includeIntercardinalTicks:
          true
      });

    const compatibilityDesktop =
      buildBaselineMeshes({
        quality:
          "desktop"
      });

    const firstMesh =
      desktop.meshes[0];

    const geometryChecks =
      deepFreeze({
        canonicalBuildModelSurfacePresent:
          typeof buildModel ===
          "function",

        compatibilityBuildSurfacePresent:
          typeof buildBaselineMeshes ===
          "function",

        buildSurfacesEquivalent:
          desktop.componentCount ===
            compatibilityDesktop.componentCount &&
          desktop.aggregate.vertexCount ===
            compatibilityDesktop.aggregate.vertexCount &&
          desktop.aggregate.triangleCount ===
            compatibilityDesktop.aggregate.triangleCount,

        desktopModelValid:
          validateModel(desktop).pass ===
          true,

        mobileModelValid:
          validateModel(mobile).pass ===
          true,

        lowPowerModelValid:
          validateModel(lowPower).pass ===
          true,

        optionalTicksModelValid:
          validateModel(optionalTicks).pass ===
          true,

        integratedCenterIdentity:
          desktop.physicalProjection ===
          PHYSICAL_PROJECTION,

        upstreamReturnSemanticIdentity:
          desktop.semanticRelationship ===
          SEMANTIC_RELATIONSHIP,

        dimensionalEnvelopeExpanded:
          desktop.aggregate.actualTotalDepth >=
          DEPTH_ENVELOPE.baselineTotalDepth -
            EPSILON,

        materialIdentityPresent:
          desktop.meshes.every(
            (mesh) =>
              Object.values(
                MATERIAL_KEYS
              ).includes(
                mesh.materialKey
              )
          ),

        outerRingMaterialIdentity:
          desktop.meshes.some(
            (mesh) =>
              mesh.componentId ===
                "UGC04_OUTER_HOUSING_RING" &&
              mesh.materialKey ===
                MATERIAL_KEYS.OUTER_RING
          ),

        innerRingMaterialIdentity:
          desktop.meshes.some(
            (mesh) =>
              mesh.componentId ===
                "UGC04_INNER_DIRECTION_RING" &&
              mesh.materialKey ===
                MATERIAL_KEYS.INNER_RING
          ),

        northNeedleMaterialIdentity:
          desktop.meshes.some(
            (mesh) =>
              mesh.componentId ===
                "UGC04_DOMINANT_NORTH_NEEDLE" &&
              mesh.materialKey ===
                MATERIAL_KEYS.NORTH_NEEDLE
          ),

        centralHubMaterialIdentity:
          desktop.meshes.some(
            (mesh) =>
              mesh.componentId ===
                "UGC04_CENTRAL_HUB" &&
              mesh.materialKey ===
                MATERIAL_KEYS.CENTRAL_HUB
          ),

        localQuaternionSharingExcluded:
          desktop.rootTransform.localQuaternionShared ===
          false,

        localSettlementParticipationExcluded:
          desktop.rootTransform.localSettlementParticipation ===
          false
      });

    assertBooleanChecks(
      geometryChecks,
      "SELF_TEST_GEOMETRY_CHECK_FAILED"
    );

    const ordinaryObjectFreezeProbe =
      deepFreeze({
        a:
          {
            b:
              {
                c:
                  1
              }
          }
      });

    const bufferChecks =
      deepFreeze({
        meshRecordFrozen:
          Object.isFrozen(
            firstMesh
          ) === true,

        positionsAreArrayBufferView:
          isArrayBufferView(
            firstMesh.positions
          ) === true,

        normalsAreArrayBufferView:
          isArrayBufferView(
            firstMesh.normals
          ) === true,

        indicesAreArrayBufferView:
          isArrayBufferView(
            firstMesh.indices
          ) === true,

        positionsTypeValid:
          firstMesh.positions.constructor.name ===
          "Float32Array",

        normalsTypeValid:
          firstMesh.normals.constructor.name ===
          "Float32Array",

        indicesTypeValid:
          firstMesh.indices.constructor.name ===
            "Uint16Array" ||
          firstMesh.indices.constructor.name ===
            "Uint32Array",

        materialKeyPresent:
          typeof firstMesh.materialKey ===
            "string" &&
          firstMesh.materialKey.length >
            0,

        typedArrayElementImmutabilityNotClaimed:
          BUFFER_MUTATION_CONTRACT.typedArrayElementImmutabilityClaim ===
          false,

        bufferMutationAfterFinalizationContractuallyProhibited:
          BUFFER_MUTATION_CONTRACT.bufferContentsMutableAfterFinalization ===
            false &&
          BUFFER_MUTATION_CONTRACT.postFinalizationMutationPolicy ===
            "PROHIBITED_BY_MODULE_CONTRACT",

        externalMutationAuthorityDenied:
          BUFFER_MUTATION_CONTRACT.externalMutationAuthority ===
          false,

        rendererMutationAuthorityDenied:
          BUFFER_MUTATION_CONTRACT.rendererMutationPermitted ===
          false
      });

    assertBooleanChecks(
      bufferChecks,
      "SELF_TEST_BUFFER_CHECK_FAILED"
    );

    const baselineSvg =
      buildStaticSvgFallback();

    const optionalTickSvg =
      buildStaticSvgFallback({
        includeIntercardinalTicks:
          true
      });

    const accessibleSvg =
      buildStaticSvgFallback({
        ariaHidden:
          false,

        includeTitle:
          true
      });

    const fallbackChecks =
      deepFreeze({
        buildSurfacePresent:
          typeof buildStaticSvgFallback ===
          "function",

        projectionSchemaPresent:
          typeof createFrontProjectionSchema ===
          "function",

        projectionSchemaBacked:
          baselineSvg.projectionSchemaBacked ===
          true,

        intentionallyTwoDimensional:
          baselineSvg.intentionallyTwoDimensional ===
          true,

        noIndependentGeometryConstants:
          FALLBACK_EMISSION_AUTHORITY.separateHandAuthoredFallbackGeometry ===
          false,

        svgStringNonempty:
          typeof baselineSvg.svgString ===
            "string" &&
          baselineSvg.svgString.length >
            0,

        svgElementPresent:
          baselineSvg.svgString
            .trimStart()
            .startsWith("<svg"),

        canonicalViewBoxPresent:
          baselineSvg.svgString.includes(
            'viewBox="0 0 200 200"'
          ),

        physicalProjectionPresent:
          baselineSvg.svgString.includes(
            `data-ugc04-physical-projection="${PHYSICAL_PROJECTION}"`
          ),

        outerRingPresent:
          baselineSvg.svgString.includes(
            'data-ugc04-layer="OUTER_RING"'
          ),

        innerRingPresent:
          baselineSvg.svgString.includes(
            'data-ugc04-layer="INNER_RING"'
          ),

        northNeedlePresent:
          baselineSvg.svgString.includes(
            'data-ugc04-layer="NORTH_NEEDLE"'
          ),

        centralHubPresent:
          baselineSvg.svgString.includes(
            'data-ugc04-layer="CENTRAL_HUB"'
          ),

        materialIdentityPresent:
          baselineSvg.svgString.includes(
            'data-ugc04-material-key="OUTER_RING"'
          ) &&
          baselineSvg.svgString.includes(
            'data-ugc04-material-key="NORTH_NEEDLE"'
          ),

        baselineTicksAbsent:
          !baselineSvg.svgString.includes(
            "INTERCARDINAL_TICK_"
          ),

        optionalTicksPresent:
          optionalTickSvg.svgString.includes(
            "INTERCARDINAL_TICK_"
          ),

        accessibleTitleRulePass:
          accessibleSvg.svgString.includes(
            "<title"
          ) &&
          accessibleSvg.svgString.includes(
            "Return to Master Compass"
          ),

        monochromeCapable:
          baselineSvg.monochromeCapable ===
          true,

        animationNotRequired:
          baselineSvg.animationRequired ===
          false,

        rendererNotRequired:
          baselineSvg.rendererRequired ===
          false,

        productionAuthorizationFalse:
          baselineSvg.productionAuthorized ===
          false
      });

    assertBooleanChecks(
      fallbackChecks,
      "SELF_TEST_FALLBACK_CHECK_FAILED"
    );

    const receipt =
      createPrototypeReceipt({
        model:
          desktop
      });

    const receiptChecks =
      deepFreeze({
        canonicalBuildSurfaceDeclared:
          receipt.buildSurface ===
          "buildModel",

        compatibilityBuildSurfaceDeclared:
          receipt.compatibilityBuildSurface ===
          "buildBaselineMeshes",

        componentMaterialIdentityPresent:
          Array.isArray(
            receipt.componentMaterialIdentity
          ) &&
          receipt.componentMaterialIdentity.length ===
            desktop.componentCount,

        expandedDepthRecorded:
          receipt.actualTotalDepth >=
          DEPTH_ENVELOPE.baselineTotalDepth -
            EPSILON,

        fallbackEvidencePresent:
          receipt.fallbackEmission &&
          receipt.fallbackEmission.generated ===
            true,

        productionAuthorizationFalse:
          receipt.authorization.productionAuthorized ===
          false
      });

    assertBooleanChecks(
      receiptChecks,
      "SELF_TEST_RECEIPT_CHECK_FAILED"
    );

    const ordinaryObjectFreezeChecks =
      deepFreeze({
        deepFreezeOrdinaryObjectPass:
          Object.isFrozen(
            ordinaryObjectFreezeProbe
          ) &&
          Object.isFrozen(
            ordinaryObjectFreezeProbe.a
          ) &&
          Object.isFrozen(
            ordinaryObjectFreezeProbe.a.b
          )
      });

    assertBooleanChecks(
      ordinaryObjectFreezeChecks,
      "SELF_TEST_ORDINARY_OBJECT_FREEZE_CHECK_FAILED"
    );

    return deepFreeze({
      pass:
        true,

      moduleId:
        MODULE_ID,

      moduleVersion:
        MODULE_VERSION,

      occurrenceId:
        OCCURRENCE_ID,

      physicalProjection:
        PHYSICAL_PROJECTION,

      semanticRelationship:
        SEMANTIC_RELATIONSHIP,

      profiles:
        Object.freeze({
          desktop:
            validateModel(desktop),

          mobile:
            validateModel(mobile),

          lowPower:
            validateModel(lowPower),

          optionalTicks:
            validateModel(optionalTicks)
        }),

      geometryChecks,

      bufferChecks,

      fallbackChecks,

      receiptChecks,

      ordinaryObjectFreezeChecks,

      productionAuthorized:
        false
    });
  }

  return deepFreeze({
    moduleId:
      MODULE_ID,

    moduleVersion:
      MODULE_VERSION,

    occurrenceId:
      OCCURRENCE_ID,

    candidateId:
      CANDIDATE_ID,

    physicalProjection:
      PHYSICAL_PROJECTION,

    semanticRelationship:
      SEMANTIC_RELATIONSHIP,

    status:
      STATUS,

    coordinateSystem:
      COORDINATE_SYSTEM,

    depthEnvelope:
      DEPTH_ENVELOPE,

    constants:
      CONSTANTS,

    materialKeys:
      MATERIAL_KEYS,

    qualityProfiles:
      QUALITY_PROFILES,

    arrayBufferViewPolicyClarification:
      ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION,

    bufferMutationContract:
      BUFFER_MUTATION_CONTRACT,

    fallbackEmissionAuthority:
      FALLBACK_EMISSION_AUTHORITY,

    buildModel,

    buildBaselineMeshes,

    createFrontProjectionSchema,

    buildStaticSvgFallback,

    createPrototypeReceipt,

    validateModel,

    runSelfTest
  });
})();

if (
  typeof globalThis !==
  "undefined"
) {
  globalThis.DGB_UPSTREAM_COMPASS_GEOMETRY =
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
