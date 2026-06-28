/* /assets/compass/upstream-compass.geometry.js

   Universal Compass shared geometry implementation candidate.

   Purpose:
   - define the exact UGC-04 baseline geometry occurrence;
   - construct deterministic three-dimensional mesh data;
   - enforce the shared noncumulative depth envelope;
   - expose geometry validation, front-projection data, and static SVG fallback;
   - provide the anchoring geometry authority for the shared Universal Compass family.

   Candidate:
   UGC-04
   HYBRID_DOUBLE_RING_NORTH_NEEDLE_FOUR_POINT_ROSE

   Physical model:
   FIXED_CENTER_HUB

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

  const MODULE_ID = "DGB_UPSTREAM_COMPASS_GEOMETRY";
  const MODULE_VERSION = "1.0.0-candidate";
  const OCCURRENCE_ID = "UGC_04_BASELINE_OCCURRENCE_001";
  const CANDIDATE_ID = "UGC-04";
  const EPSILON = 1e-9;
  const TAU = Math.PI * 2;

  const STATUS = Object.freeze({
    artifactClass: "UNIVERSAL_COMPASS_SHARED_GEOMETRY_IMPLEMENTATION_CANDIDATE",
    candidateId: CANDIDATE_ID,
    occurrenceId: OCCURRENCE_ID,
    sharedReusableComponent: true,
    productionAuthorized: false,
    repositoryIntegrationAuthorized: false,
    deploymentAuthorized: false,
    publicReleaseAuthorized: false,
    finalGeometryFrozen: false,
    canonical: false,
    visualPassClaimed: false
  });

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
    cameraFacingDirection: Object.freeze([0, 0, 1]),
    canonicalObjectPlaneZ: 0
  });

  const DEPTH_ENVELOPE = Object.freeze({
    canonicalObjectPlaneZ: 0,
    rearLimitZ: -0.08,
    frontLimitZ: 0.12,
    baselineTotalDepth: 0.20,
    absoluteRearLimitZ: -0.10,
    absoluteFrontLimitZ: 0.14,
    absoluteMaximumTotalDepth: 0.24,
    componentDepthsAre:
      "BOUNDED_WITHIN_SHARED_DEPTH_ENVELOPE_NOT_CUMULATIVELY_STACKED",

    outerRingZInterval: Object.freeze([-0.04, 0.04]),
    innerRingZInterval: Object.freeze([-0.025, 0.02]),
    principalDirectionZInterval: Object.freeze([-0.02, 0.065]),
    centralHubZInterval: Object.freeze([-0.01, 0.11]),
    northNeedleZInterval: Object.freeze([0, 0.12]),
    intercardinalTickZInterval: Object.freeze([-0.01, 0.035])
  });

  const CONSTANTS = Object.freeze({
    normalizedOuterRadius: 1,

    outerRing: Object.freeze({
      outerRadius: 1.0,
      innerRadius: 0.925,
      desktopSegments: 48,
      mobileSegments: 24,
      lowPowerSegments: 16
    }),

    innerRing: Object.freeze({
      outerRadius: 0.735,
      innerRadius: 0.705,
      desktopSegments: 48,
      mobileSegments: 24,
      lowPowerSegments: 16
    }),

    hub: Object.freeze({
      radius: 0.18,
      desktopSegments: 32,
      mobileSegments: 24,
      lowPowerSegments: 16
    }),

    northNeedle: Object.freeze({
      xyVertices: Object.freeze([
        Object.freeze([0.0, 0.82]),
        Object.freeze([-0.055, 0.22]),
        Object.freeze([-0.09, 0.10]),
        Object.freeze([0.09, 0.10]),
        Object.freeze([0.055, 0.22])
      ])
    }),

    southDirection: Object.freeze({
      xyVertices: Object.freeze([
        Object.freeze([-0.075, -0.12]),
        Object.freeze([0.0, -0.44]),
        Object.freeze([0.075, -0.12])
      ])
    }),

    eastDirection: Object.freeze({
      xyVertices: Object.freeze([
        Object.freeze([0.12, -0.07]),
        Object.freeze([0.40, 0.0]),
        Object.freeze([0.12, 0.07])
      ])
    }),

    westDirection: Object.freeze({
      xyVertices: Object.freeze([
        Object.freeze([-0.12, 0.07]),
        Object.freeze([-0.40, 0.0]),
        Object.freeze([-0.12, -0.07])
      ])
    }),

    intercardinalTicks: Object.freeze({
      baselineEnabled: false,
      radialCenter: 0.72,
      radialLength: 0.10,
      tangentialWidth: 0.035,
      anglesRadians: Object.freeze([
        Math.PI / 4,
        (3 * Math.PI) / 4,
        (5 * Math.PI) / 4,
        (7 * Math.PI) / 4
      ])
    }),

    semanticHitEnvelope: Object.freeze({
      radius: 1.08,
      zInterval: Object.freeze([-0.08, 0.14]),
      preferredCssTarget: Object.freeze([44, 44]),
      governedMinimumCssTarget: Object.freeze([24, 24])
    }),

    placement: Object.freeze({
      physicalProjection: "FIXED_CENTER_HUB",
      semanticRelationship: "UPSTREAM_RETURN_CONTROL",
      defaultPosition: Object.freeze([0, 0, 0]),
      defaultScale: Object.freeze([1, 1, 1]),
      defaultQuaternion: Object.freeze([0, 0, 0, 1]),
      localQuaternionShared: false,
      localSettlementParticipation: false
    })
  });

  const QUALITY_PROFILES = Object.freeze({
    desktop: Object.freeze({
      id: "desktop",
      outerRingSegments: CONSTANTS.outerRing.desktopSegments,
      innerRingSegments: CONSTANTS.innerRing.desktopSegments,
      hubSegments: CONSTANTS.hub.desktopSegments
    }),

    mobile: Object.freeze({
      id: "mobile",
      outerRingSegments: CONSTANTS.outerRing.mobileSegments,
      innerRingSegments: CONSTANTS.innerRing.mobileSegments,
      hubSegments: CONSTANTS.hub.mobileSegments
    }),

    lowPower: Object.freeze({
      id: "lowPower",
      outerRingSegments: CONSTANTS.outerRing.lowPowerSegments,
      innerRingSegments: CONSTANTS.innerRing.lowPowerSegments,
      hubSegments: CONSTANTS.hub.lowPowerSegments
    })
  });

  const ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION = Object.freeze({
    recursiveFreezeExemptionClass: "ALL_ARRAYBUFFER_VIEWS",
    expectedFinalizedMeshBufferClass: Object.freeze([
      "Float32Array",
      "Uint16Array",
      "Uint32Array"
    ]),
    dataViewStatus: "EXEMPT_IF_ENCOUNTERED_BUT_NOT_AN_EXPECTED_FINALIZED_MESH_BUFFER_SURFACE"
  });

  const BUFFER_MUTATION_CONTRACT = Object.freeze({
    typedArrayObjectsRecursivelyFrozen: false,
    containingMeshRecordsFrozen: true,
    bufferContentsMutableDuringConstruction: true,
    bufferContentsMutableAfterFinalization: false,
    postFinalizationMutationPolicy: "PROHIBITED_BY_MODULE_CONTRACT",
    externalMutationAuthority: false,
    structuralImmutabilityClaim: true,
    typedArrayElementImmutabilityClaim: false,
    expectedFinalizedMeshBufferClass: Object.freeze([
      "Float32Array",
      "Uint16Array",
      "Uint32Array"
    ]),
    dataViewExpectedAsFinalizedMeshBuffer: false,
    rendererMutationPermitted: false,
    validationMutationPermitted: false,
    fallbackMutationPermitted: false,
    productionGradeImmutableBufferStrategy:
      "UNRESOLVED_AND_NOT_REQUIRED_FOR_SHARED_IMPLEMENTATION_CANDIDATE"
  });

  const FALLBACK_EMISSION_AUTHORITY = Object.freeze({
    ownership: MODULE_ID,
    projectionSchemaSurface: "createFrontProjectionSchema",
    concreteEmissionSurface: "buildStaticSvgFallback",
    emissionFormat: "INLINE_SVG_STRING",
    canonicalViewBox: "0 0 200 200",
    sourceOfGeometry: "UGC_04_BASELINE_OCCURRENCE_001_CONSTANTS_AND_FRONT_PROJECTION_SCHEMA",
    separateFallbackBuilderRequired: false,
    separateHandAuthoredFallbackGeometry: false,
    monochromeCapable: true,
    animationRequired: false,
    rendererRequired: false,
    productionAuthorized: false
  });

  function invariant(condition, code, details = null) {
    if (!condition) {
      const error = new Error(code);
      error.code = code;
      error.details = details;
      throw error;
    }
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
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
    return Object.freeze(cloneVector(vector));
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
    if (typeof profile === "string" && QUALITY_PROFILES[profile]) {
      return QUALITY_PROFILES[profile];
    }

    if (profile && typeof profile === "object") {
      const candidate = {
        id: String(profile.id || "custom"),
        outerRingSegments: Number(profile.outerRingSegments),
        innerRingSegments: Number(profile.innerRingSegments),
        hubSegments: Number(profile.hubSegments)
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
      { value }
    );
  }

  function createEmptyMesh(componentId, primitive) {
    return {
      componentId,
      primitive,
      positions: [],
      normals: [],
      indices: [],
      groups: [],
      metadata: {}
    };
  }

  function pushVertex(mesh, position, normal) {
    invariant(
      Array.isArray(position) &&
        position.length === 3 &&
        position.every(isFiniteNumber),
      "VERTEX_POSITION_INVALID",
      { componentId: mesh.componentId, position }
    );

    invariant(
      Array.isArray(normal) &&
        normal.length === 3 &&
        normal.every(isFiniteNumber),
      "VERTEX_NORMAL_INVALID",
      { componentId: mesh.componentId, normal }
    );

    mesh.positions.push(position[0], position[1], position[2]);
    mesh.normals.push(normal[0], normal[1], normal[2]);

    return mesh.positions.length / 3 - 1;
  }

  function pushTriangle(mesh, a, b, c) {
    invariant(
      [a, b, c].every(
        (value) => Number.isInteger(value) && value >= 0
      ),
      "TRIANGLE_INDEX_INVALID",
      { componentId: mesh.componentId, indices: [a, b, c] }
    );

    mesh.indices.push(a, b, c);
  }

  function normalize2(x, y) {
    const length = Math.hypot(x, y);
    invariant(length > EPSILON, "ZERO_LENGTH_VECTOR_FORBIDDEN");
    return [x / length, y / length];
  }

  function polygonSignedArea(vertices) {
    let sum = 0;

    for (let index = 0; index < vertices.length; index += 1) {
      const current = vertices[index];
      const next = vertices[(index + 1) % vertices.length];
      sum += current[0] * next[1] - next[0] * current[1];
    }

    return sum / 2;
  }

  function validatePolygon(vertices, code) {
    invariant(
      Array.isArray(vertices) && vertices.length >= 3,
      code,
      { reason: "POLYGON_REQUIRES_AT_LEAST_THREE_VERTICES" }
    );

    for (const vertex of vertices) {
      invariant(
        Array.isArray(vertex) &&
          vertex.length === 2 &&
          vertex.every(isFiniteNumber),
        code,
        { reason: "POLYGON_VERTEX_INVALID", vertex }
      );
    }

    invariant(
      polygonSignedArea(vertices) > EPSILON,
      code,
      { reason: "POLYGON_MUST_BE_COUNTERCLOCKWISE" }
    );
  }

  function computeBoundsFromPositions(positions) {
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

    for (let index = 0; index < positions.length; index += 3) {
      const x = positions[index];
      const y = positions[index + 1];
      const z = positions[index + 2];

      minimumX = Math.min(minimumX, x);
      minimumY = Math.min(minimumY, y);
      minimumZ = Math.min(minimumZ, z);
      maximumX = Math.max(maximumX, x);
      maximumY = Math.max(maximumY, y);
      maximumZ = Math.max(maximumZ, z);
    }

    return Object.freeze({
      minimum: freezeVector([minimumX, minimumY, minimumZ]),
      maximum: freezeVector([maximumX, maximumY, maximumZ]),
      size: freezeVector([
        maximumX - minimumX,
        maximumY - minimumY,
        maximumZ - minimumZ
      ])
    });
  }

  function finalizeMesh(mesh) {
    invariant(
      mesh.positions.length % 3 === 0,
      "POSITION_BUFFER_ALIGNMENT_FAILURE",
      { componentId: mesh.componentId }
    );

    invariant(
      mesh.normals.length === mesh.positions.length,
      "NORMAL_BUFFER_LENGTH_MISMATCH",
      { componentId: mesh.componentId }
    );

    invariant(
      mesh.indices.length % 3 === 0,
      "INDEX_BUFFER_TRIANGLE_ALIGNMENT_FAILURE",
      { componentId: mesh.componentId }
    );

    const vertexCount = mesh.positions.length / 3;

    for (const index of mesh.indices) {
      invariant(
        index >= 0 && index < vertexCount,
        "INDEX_OUT_OF_RANGE",
        { componentId: mesh.componentId, index, vertexCount }
      );
    }

    const bounds = computeBoundsFromPositions(mesh.positions);

    return deepFreeze({
      componentId: mesh.componentId,
      primitive: mesh.primitive,
      positions: new Float32Array(mesh.positions),
      normals: new Float32Array(mesh.normals),
      indices:
        vertexCount > 65535
          ? new Uint32Array(mesh.indices)
          : new Uint16Array(mesh.indices),
      groups: mesh.groups.map((group) => Object.freeze({ ...group })),
      metadata: deepFreeze({ ...mesh.metadata }),
      bounds,
      vertexCount,
      triangleCount: mesh.indices.length / 3
    });
  }

  function createExtrudedAnnulus({
    componentId,
    outerRadius,
    innerRadius,
    zRear,
    zFront,
    segments
  }) {
    validateSegmentCount(segments, "ANNULUS_SEGMENT_COUNT_INVALID");

    invariant(
      isFiniteNumber(outerRadius) &&
        isFiniteNumber(innerRadius) &&
        outerRadius > innerRadius &&
        innerRadius > 0,
      "ANNULUS_RADIUS_RELATION_INVALID",
      { componentId, outerRadius, innerRadius }
    );

    invariant(
      isFiniteNumber(zRear) &&
        isFiniteNumber(zFront) &&
        zFront > zRear,
      "ANNULUS_DEPTH_INTERVAL_INVALID",
      { componentId, zRear, zFront }
    );

    const mesh = createEmptyMesh(componentId, "EXTRUDED_ANNULUS");
    const frontOuter = [];
    const frontInner = [];
    const rearOuter = [];
    const rearInner = [];

    for (let index = 0; index < segments; index += 1) {
      const theta = (TAU * index) / segments;
      const cosine = Math.cos(theta);
      const sine = Math.sin(theta);

      frontOuter.push(
        pushVertex(mesh, [outerRadius * cosine, outerRadius * sine, zFront], [0, 0, 1])
      );
      frontInner.push(
        pushVertex(mesh, [innerRadius * cosine, innerRadius * sine, zFront], [0, 0, 1])
      );
      rearOuter.push(
        pushVertex(mesh, [outerRadius * cosine, outerRadius * sine, zRear], [0, 0, -1])
      );
      rearInner.push(
        pushVertex(mesh, [innerRadius * cosine, innerRadius * sine, zRear], [0, 0, -1])
      );
    }

    for (let index = 0; index < segments; index += 1) {
      const next = (index + 1) % segments;

      pushTriangle(mesh, frontOuter[index], frontOuter[next], frontInner[index]);
      pushTriangle(mesh, frontOuter[next], frontInner[next], frontInner[index]);

      pushTriangle(mesh, rearOuter[index], rearInner[index], rearOuter[next]);
      pushTriangle(mesh, rearOuter[next], rearInner[index], rearInner[next]);
    }

    const outerWallStart = mesh.indices.length;

    for (let index = 0; index < segments; index += 1) {
      const next = (index + 1) % segments;
      const thetaA = (TAU * index) / segments;
      const thetaB = (TAU * next) / segments;

      const aNormal = [Math.cos(thetaA), Math.sin(thetaA), 0];
      const bNormal = [Math.cos(thetaB), Math.sin(thetaB), 0];

      const aFront = pushVertex(
        mesh,
        [outerRadius * aNormal[0], outerRadius * aNormal[1], zFront],
        aNormal
      );
      const bFront = pushVertex(
        mesh,
        [outerRadius * bNormal[0], outerRadius * bNormal[1], zFront],
        bNormal
      );
      const aRear = pushVertex(
        mesh,
        [outerRadius * aNormal[0], outerRadius * aNormal[1], zRear],
        aNormal
      );
      const bRear = pushVertex(
        mesh,
        [outerRadius * bNormal[0], outerRadius * bNormal[1], zRear],
        bNormal
      );

      pushTriangle(mesh, aFront, bFront, aRear);
      pushTriangle(mesh, bFront, bRear, aRear);
    }

    const innerWallStart = mesh.indices.length;

    for (let index = 0; index < segments; index += 1) {
      const next = (index + 1) % segments;
      const thetaA = (TAU * index) / segments;
      const thetaB = (TAU * next) / segments;

      const aNormal = [-Math.cos(thetaA), -Math.sin(thetaA), 0];
      const bNormal = [-Math.cos(thetaB), -Math.sin(thetaB), 0];

      const aFront = pushVertex(
        mesh,
        [-innerRadius * aNormal[0], -innerRadius * aNormal[1], zFront],
        aNormal
      );
      const bFront = pushVertex(
        mesh,
        [-innerRadius * bNormal[0], -innerRadius * bNormal[1], zFront],
        bNormal
      );
      const aRear = pushVertex(
        mesh,
        [-innerRadius * aNormal[0], -innerRadius * aNormal[1], zRear],
        aNormal
      );
      const bRear = pushVertex(
        mesh,
        [-innerRadius * bNormal[0], -innerRadius * bNormal[1], zRear],
        bNormal
      );

      pushTriangle(mesh, aFront, aRear, bFront);
      pushTriangle(mesh, bFront, aRear, bRear);
    }

    mesh.groups.push(
      {
        id: "ANNULUS_FRONT_AND_REAR",
        indexStart: 0,
        indexCount: outerWallStart
      },
      {
        id: "ANNULUS_OUTER_WALL",
        indexStart: outerWallStart,
        indexCount: innerWallStart - outerWallStart
      },
      {
        id: "ANNULUS_INNER_WALL",
        indexStart: innerWallStart,
        indexCount: mesh.indices.length - innerWallStart
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
    xyVertices,
    zRear,
    zFront,
    primitive = "EXTRUDED_CONVEX_POLYGON"
  }) {
    validatePolygon(xyVertices, "EXTRUDED_POLYGON_INVALID");

    invariant(
      isFiniteNumber(zRear) &&
        isFiniteNumber(zFront) &&
        zFront > zRear,
      "EXTRUDED_POLYGON_DEPTH_INVALID",
      { componentId, zRear, zFront }
    );

    const mesh = createEmptyMesh(componentId, primitive);
    const front = [];
    const rear = [];

    for (const vertex of xyVertices) {
      front.push(pushVertex(mesh, [vertex[0], vertex[1], zFront], [0, 0, 1]));
      rear.push(pushVertex(mesh, [vertex[0], vertex[1], zRear], [0, 0, -1]));
    }

    for (let index = 1; index < xyVertices.length - 1; index += 1) {
      pushTriangle(mesh, front[0], front[index], front[index + 1]);
      pushTriangle(mesh, rear[0], rear[index + 1], rear[index]);
    }

    const sideStart = mesh.indices.length;

    for (let index = 0; index < xyVertices.length; index += 1) {
      const next = (index + 1) % xyVertices.length;
      const a = xyVertices[index];
      const b = xyVertices[next];
      const edgeX = b[0] - a[0];
      const edgeY = b[1] - a[1];
      const normal2 = normalize2(edgeY, -edgeX);
      const normal = [normal2[0], normal2[1], 0];

      const aFront = pushVertex(mesh, [a[0], a[1], zFront], normal);
      const bFront = pushVertex(mesh, [b[0], b[1], zFront], normal);
      const aRear = pushVertex(mesh, [a[0], a[1], zRear], normal);
      const bRear = pushVertex(mesh, [b[0], b[1], zRear], normal);

      pushTriangle(mesh, aFront, bFront, aRear);
      pushTriangle(mesh, bFront, bRear, aRear);
    }

    mesh.groups.push(
      {
        id: "POLYGON_FRONT_AND_REAR",
        indexStart: 0,
        indexCount: sideStart
      },
      {
        id: "POLYGON_SIDE_WALLS",
        indexStart: sideStart,
        indexCount: mesh.indices.length - sideStart
      }
    );

    mesh.metadata = {
      xyVertices: xyVertices.map(cloneVector),
      zRear,
      zFront
    };

    return finalizeMesh(mesh);
  }

  function createExtrudedCylinder({
    componentId,
    radius,
    zRear,
    zFront,
    segments
  }) {
    validateSegmentCount(segments, "CYLINDER_SEGMENT_COUNT_INVALID");

    invariant(
      isFiniteNumber(radius) && radius > 0,
      "CYLINDER_RADIUS_INVALID",
      { componentId, radius }
    );

    invariant(
      isFiniteNumber(zRear) &&
        isFiniteNumber(zFront) &&
        zFront > zRear,
      "CYLINDER_DEPTH_INTERVAL_INVALID",
      { componentId, zRear, zFront }
    );

    const mesh = createEmptyMesh(componentId, "EXTRUDED_CYLINDER");
    const frontCenter = pushVertex(mesh, [0, 0, zFront], [0, 0, 1]);
    const rearCenter = pushVertex(mesh, [0, 0, zRear], [0, 0, -1]);
    const front = [];
    const rear = [];

    for (let index = 0; index < segments; index += 1) {
      const theta = (TAU * index) / segments;
      const cosine = Math.cos(theta);
      const sine = Math.sin(theta);

      front.push(pushVertex(mesh, [radius * cosine, radius * sine, zFront], [0, 0, 1]));
      rear.push(pushVertex(mesh, [radius * cosine, radius * sine, zRear], [0, 0, -1]));
    }

    for (let index = 0; index < segments; index += 1) {
      const next = (index + 1) % segments;
      pushTriangle(mesh, frontCenter, front[index], front[next]);
      pushTriangle(mesh, rearCenter, rear[next], rear[index]);
    }

    const sideStart = mesh.indices.length;

    for (let index = 0; index < segments; index += 1) {
      const next = (index + 1) % segments;
      const thetaA = (TAU * index) / segments;
      const thetaB = (TAU * next) / segments;

      const normalA = [Math.cos(thetaA), Math.sin(thetaA), 0];
      const normalB = [Math.cos(thetaB), Math.sin(thetaB), 0];

      const aFront = pushVertex(mesh, [radius * normalA[0], radius * normalA[1], zFront], normalA);
      const bFront = pushVertex(mesh, [radius * normalB[0], radius * normalB[1], zFront], normalB);
      const aRear = pushVertex(mesh, [radius * normalA[0], radius * normalA[1], zRear], normalA);
      const bRear = pushVertex(mesh, [radius * normalB[0], radius * normalB[1], zRear], normalB);

      pushTriangle(mesh, aFront, bFront, aRear);
      pushTriangle(mesh, bFront, bRear, aRear);
    }

    mesh.groups.push(
      {
        id: "CYLINDER_CAPS",
        indexStart: 0,
        indexCount: sideStart
      },
      {
        id: "CYLINDER_SIDE_WALL",
        indexStart: sideStart,
        indexCount: mesh.indices.length - sideStart
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
    const direction = [Math.cos(angle), Math.sin(angle)];
    const tangent = [-direction[1], direction[0]];
    const radialHalf = radialLength / 2;
    const tangentHalf = tangentialWidth / 2;

    const center = [
      direction[0] * radialCenter,
      direction[1] * radialCenter
    ];

    const rearCenter = [
      center[0] - direction[0] * radialHalf,
      center[1] - direction[1] * radialHalf
    ];

    const frontCenter = [
      center[0] + direction[0] * radialHalf,
      center[1] + direction[1] * radialHalf
    ];

    return [
      [
        rearCenter[0] - tangent[0] * tangentHalf,
        rearCenter[1] - tangent[1] * tangentHalf
      ],
      [
        frontCenter[0] - tangent[0] * tangentHalf,
        frontCenter[1] - tangent[1] * tangentHalf
      ],
      [
        frontCenter[0] + tangent[0] * tangentHalf,
        frontCenter[1] + tangent[1] * tangentHalf
      ],
      [
        rearCenter[0] + tangent[0] * tangentHalf,
        rearCenter[1] + tangent[1] * tangentHalf
      ]
    ];
  }

  function summarizeMeshes(meshes) {
    invariant(
      Array.isArray(meshes) && meshes.length > 0,
      "MESH_COLLECTION_REQUIRED"
    );

    let vertexCount = 0;
    let triangleCount = 0;
    const aggregatePositions = [];

    for (const mesh of meshes) {
      vertexCount += mesh.vertexCount;
      triangleCount += mesh.triangleCount;

      for (let index = 0; index < mesh.positions.length; index += 1) {
        aggregatePositions.push(mesh.positions[index]);
      }
    }

    const bounds = computeBoundsFromPositions(aggregatePositions);

    return deepFreeze({
      vertexCount,
      triangleCount,
      bounds,
      actualTotalDepth: bounds.size[2]
    });
  }

  function validateDepthBounds(bounds) {
    const minimumZ = bounds.minimum[2];
    const maximumZ = bounds.maximum[2];

    invariant(
      minimumZ >= DEPTH_ENVELOPE.absoluteRearLimitZ - EPSILON,
      "ABSOLUTE_REAR_DEPTH_LIMIT_EXCEEDED",
      { minimumZ }
    );

    invariant(
      maximumZ <= DEPTH_ENVELOPE.absoluteFrontLimitZ + EPSILON,
      "ABSOLUTE_FRONT_DEPTH_LIMIT_EXCEEDED",
      { maximumZ }
    );

    invariant(
      maximumZ - minimumZ <= DEPTH_ENVELOPE.absoluteMaximumTotalDepth + EPSILON,
      "ABSOLUTE_TOTAL_DEPTH_EXCEEDED",
      {
        minimumZ,
        maximumZ,
        totalDepth: maximumZ - minimumZ
      }
    );
  }

  function validateRadialBounds(mesh) {
    for (let index = 0; index < mesh.positions.length; index += 3) {
      const x = mesh.positions[index];
      const y = mesh.positions[index + 1];
      const radius = Math.hypot(x, y);

      invariant(
        radius <= CONSTANTS.normalizedOuterRadius + EPSILON,
        "COMPONENT_EXCEEDS_OUTER_RADIUS",
        { componentId: mesh.componentId, radius, x, y }
      );
    }
  }

  function validateEastWestMirror() {
    const east = CONSTANTS.eastDirection.xyVertices;
    const west = CONSTANTS.westDirection.xyVertices;

    invariant(east.length === west.length, "EAST_WEST_VERTEX_COUNT_MISMATCH");

    const mirroredEast = east.map(([x, y]) => [-x, y]);
    const normalizedWest = [west[2], west[1], west[0]];

    for (let index = 0; index < mirroredEast.length; index += 1) {
      invariant(
        Math.abs(mirroredEast[index][0] - normalizedWest[index][0]) <= EPSILON &&
          Math.abs(mirroredEast[index][1] - normalizedWest[index][1]) <= EPSILON,
        "EAST_WEST_MIRROR_SYMMETRY_FAILURE",
        {
          index,
          mirroredEast: mirroredEast[index],
          normalizedWest: normalizedWest[index]
        }
      );
    }
  }

  function validateNorthDominance() {
    const northMaximum = Math.max(
      ...CONSTANTS.northNeedle.xyVertices.map(([, y]) => y)
    );

    const otherMaximum = Math.max(
      Math.abs(Math.min(...CONSTANTS.southDirection.xyVertices.map(([, y]) => y))),
      Math.max(...CONSTANTS.eastDirection.xyVertices.map(([x]) => Math.abs(x))),
      Math.max(...CONSTANTS.westDirection.xyVertices.map(([x]) => Math.abs(x)))
    );

    invariant(
      northMaximum > otherMaximum,
      "NORTH_NEEDLE_NOT_DOMINANT",
      { northMaximum, otherMaximum }
    );
  }

  function validateRingSeparation() {
    invariant(
      CONSTANTS.innerRing.outerRadius < CONSTANTS.outerRing.innerRadius,
      "INNER_RING_INTERSECTS_OUTER_RING",
      {
        innerRingOuterRadius: CONSTANTS.innerRing.outerRadius,
        outerRingInnerRadius: CONSTANTS.outerRing.innerRadius
      }
    );
  }

  function validateHubOverlap() {
    const hubRadius = CONSTANTS.hub.radius;
    const requiredVertices = [
      CONSTANTS.northNeedle.xyVertices,
      CONSTANTS.southDirection.xyVertices,
      CONSTANTS.eastDirection.xyVertices,
      CONSTANTS.westDirection.xyVertices
    ];

    for (let polygonIndex = 0; polygonIndex < requiredVertices.length; polygonIndex += 1) {
      const polygon = requiredVertices[polygonIndex];
      const intersectsHub = polygon.some(
        ([x, y]) => Math.hypot(x, y) <= hubRadius + EPSILON
      );

      invariant(
        intersectsHub,
        "PRINCIPAL_COMPONENT_DOES_NOT_OVERLAP_HUB",
        { polygonIndex, hubRadius }
      );
    }
  }

  function buildBaselineMeshes(options = {}) {
    const quality = resolveQualityProfile(options.quality || "desktop");
    const includeIntercardinalTicks = options.includeIntercardinalTicks === true;

    const outerRing = createExtrudedAnnulus({
      componentId: "UGC04_OUTER_HOUSING_RING",
      outerRadius: CONSTANTS.outerRing.outerRadius,
      innerRadius: CONSTANTS.outerRing.innerRadius,
      zRear: DEPTH_ENVELOPE.outerRingZInterval[0],
      zFront: DEPTH_ENVELOPE.outerRingZInterval[1],
      segments: quality.outerRingSegments
    });

    const innerRing = createExtrudedAnnulus({
      componentId: "UGC04_INNER_DIRECTION_RING",
      outerRadius: CONSTANTS.innerRing.outerRadius,
      innerRadius: CONSTANTS.innerRing.innerRadius,
      zRear: DEPTH_ENVELOPE.innerRingZInterval[0],
      zFront: DEPTH_ENVELOPE.innerRingZInterval[1],
      segments: quality.innerRingSegments
    });

    const southDirection = createExtrudedConvexPolygon({
      componentId: "UGC04_SOUTH_DIRECTION",
      primitive: "EXTRUDED_TRIANGULAR_BLADE",
      xyVertices: CONSTANTS.southDirection.xyVertices,
      zRear: DEPTH_ENVELOPE.principalDirectionZInterval[0],
      zFront: DEPTH_ENVELOPE.principalDirectionZInterval[1]
    });

    const eastDirection = createExtrudedConvexPolygon({
      componentId: "UGC04_EAST_DIRECTION",
      primitive: "EXTRUDED_TRIANGULAR_BLADE",
      xyVertices: CONSTANTS.eastDirection.xyVertices,
      zRear: DEPTH_ENVELOPE.principalDirectionZInterval[0],
      zFront: DEPTH_ENVELOPE.principalDirectionZInterval[1]
    });

    const westDirection = createExtrudedConvexPolygon({
      componentId: "UGC04_WEST_DIRECTION",
      primitive: "EXTRUDED_TRIANGULAR_BLADE",
      xyVertices: CONSTANTS.westDirection.xyVertices,
      zRear: DEPTH_ENVELOPE.principalDirectionZInterval[0],
      zFront: DEPTH_ENVELOPE.principalDirectionZInterval[1]
    });

    const northNeedle = createExtrudedConvexPolygon({
      componentId: "UGC04_DOMINANT_NORTH_NEEDLE",
      primitive: "EXTRUDED_NORTH_NEEDLE",
      xyVertices: CONSTANTS.northNeedle.xyVertices,
      zRear: DEPTH_ENVELOPE.northNeedleZInterval[0],
      zFront: DEPTH_ENVELOPE.northNeedleZInterval[1]
    });

    const centralHub = createExtrudedCylinder({
      componentId: "UGC04_CENTRAL_HUB",
      radius: CONSTANTS.hub.radius,
      zRear: DEPTH_ENVELOPE.centralHubZInterval[0],
      zFront: DEPTH_ENVELOPE.centralHubZInterval[1],
      segments: quality.hubSegments
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
      for (let index = 0; index < CONSTANTS.intercardinalTicks.anglesRadians.length; index += 1) {
        const angle = CONSTANTS.intercardinalTicks.anglesRadians[index];
        const polygon = createIntercardinalTickPolygon(
          angle,
          CONSTANTS.intercardinalTicks.radialCenter,
          CONSTANTS.intercardinalTicks.radialLength,
          CONSTANTS.intercardinalTicks.tangentialWidth
        );

        meshes.push(
          createExtrudedConvexPolygon({
            componentId: `UGC04_INTERCARDINAL_TICK_${index + 1}`,
            primitive: "EXTRUDED_INTERCARDINAL_TICK",
            xyVertices: polygon,
            zRear: DEPTH_ENVELOPE.intercardinalTickZInterval[0],
            zFront: DEPTH_ENVELOPE.intercardinalTickZInterval[1]
          })
        );
      }
    }

    const model = deepFreeze({
      moduleId: MODULE_ID,
      moduleVersion: MODULE_VERSION,
      occurrenceId: OCCURRENCE_ID,
      candidateId: CANDIDATE_ID,
      qualityProfile: quality,
      includeIntercardinalTicks,
      physicalProjection: "FIXED_CENTER_HUB",
      semanticRelationship: "UPSTREAM_RETURN_CONTROL",
      componentCount: meshes.length,
      meshes,
      semanticHitEnvelope: CONSTANTS.semanticHitEnvelope,
      rootTransform: CONSTANTS.placement,
      aggregate: summarizeMeshes(meshes)
    });

    validateModel(model);
    return model;
  }

  function validateModel(model) {
    invariant(model && model.moduleId === MODULE_ID, "MODEL_MODULE_ID_MISMATCH");
    invariant(model.occurrenceId === OCCURRENCE_ID, "MODEL_OCCURRENCE_ID_MISMATCH");
    invariant(model.physicalProjection === "FIXED_CENTER_HUB", "FIXED_CENTER_HUB_MODEL_REQUIRED");
    invariant(
      model.semanticRelationship === "UPSTREAM_RETURN_CONTROL",
      "UPSTREAM_SEMANTIC_RELATION_REQUIRED"
    );

    validateRingSeparation();
    validateNorthDominance();
    validateEastWestMirror();
    validateHubOverlap();

    for (const mesh of model.meshes) {
      validateDepthBounds(mesh.bounds);
      validateRadialBounds(mesh);
    }

    validateDepthBounds(model.aggregate.bounds);

    invariant(
      model.aggregate.actualTotalDepth <= DEPTH_ENVELOPE.absoluteMaximumTotalDepth + EPSILON,
      "MODEL_TOTAL_DEPTH_EXCEEDS_ABSOLUTE_MAXIMUM"
    );

    invariant(
      model.rootTransform.localQuaternionShared === false,
      "LOCAL_QUATERNION_SHARING_FORBIDDEN"
    );

    invariant(
      model.rootTransform.localSettlementParticipation === false,
      "LOCAL_SETTLEMENT_PARTICIPATION_FORBIDDEN"
    );

    return deepFreeze({
      pass: true,
      moduleId: MODULE_ID,
      occurrenceId: OCCURRENCE_ID,
      candidateId: CANDIDATE_ID,
      componentCount: model.componentCount,
      vertexCount: model.aggregate.vertexCount,
      triangleCount: model.aggregate.triangleCount,
      bounds: model.aggregate.bounds,
      actualTotalDepth: model.aggregate.actualTotalDepth,
      physicalProjection: "FIXED_CENTER_HUB",
      semanticRelationship: "UPSTREAM_RETURN_CONTROL",
      productionAuthorized: false
    });
  }

  function createFrontProjectionSchema(options = {}) {
    const includeIntercardinalTicks = options.includeIntercardinalTicks === true;

    const schema = {
      sourceModule: MODULE_ID,
      candidateId: CANDIDATE_ID,
      occurrenceId: OCCURRENCE_ID,
      projectionSchemaBacked: true,
      viewBox: "0 0 200 200",

      normalizedToSvg: Object.freeze({
        scale: 90,
        centerX: 100,
        centerY: 100,
        x: "100 + 90*x",
        y: "100 - 90*y"
      }),

      layers: [
        {
          id: "OUTER_RING",
          type: "ANNULUS",
          outerRadius: CONSTANTS.outerRing.outerRadius,
          innerRadius: CONSTANTS.outerRing.innerRadius
        },
        {
          id: "INNER_RING",
          type: "ANNULUS",
          outerRadius: CONSTANTS.innerRing.outerRadius,
          innerRadius: CONSTANTS.innerRing.innerRadius
        },
        {
          id: "SOUTH_DIRECTION",
          type: "POLYGON",
          vertices: CONSTANTS.southDirection.xyVertices
        },
        {
          id: "EAST_DIRECTION",
          type: "POLYGON",
          vertices: CONSTANTS.eastDirection.xyVertices
        },
        {
          id: "WEST_DIRECTION",
          type: "POLYGON",
          vertices: CONSTANTS.westDirection.xyVertices
        },
        {
          id: "NORTH_NEEDLE",
          type: "POLYGON",
          vertices: CONSTANTS.northNeedle.xyVertices
        },
        {
          id: "CENTRAL_HUB",
          type: "CIRCLE",
          radius: CONSTANTS.hub.radius
        }
      ]
    };

    if (includeIntercardinalTicks) {
      schema.layers.splice(
        2,
        0,
        ...CONSTANTS.intercardinalTicks.anglesRadians.map((angle, index) => ({
          id: `INTERCARDINAL_TICK_${index + 1}`,
          type: "POLYGON",
          vertices: createIntercardinalTickPolygon(
            angle,
            CONSTANTS.intercardinalTicks.radialCenter,
            CONSTANTS.intercardinalTicks.radialLength,
            CONSTANTS.intercardinalTicks.tangentialWidth
          )
        }))
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
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeXmlAttribute(value) {
    return escapeXmlText(value).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }

  function createAnnulusEvenOddPath(outerRadius, innerRadius) {
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
      .map(([x, y]) => `${mapSvgX(x)},${mapSvgY(y)}`)
      .join(" ");
  }

  function getUtf8ByteLength(value) {
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(value).byteLength;
    }

    return unescape(encodeURIComponent(value)).length;
  }

  function createSvgStringFromProjectionSchema(schema, options) {
    const title = String(options.title);
    const className = String(options.className);
    const includeTitle = options.includeTitle === true;
    const ariaHidden = options.ariaHidden === true;
    const focusable = options.focusable === true;

    invariant(
      ariaHidden || includeTitle,
      "ACCESSIBLE_SVG_REQUIRES_TITLE_WHEN_NOT_ARIA_HIDDEN"
    );

    const lines = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeXmlAttribute(schema.viewBox)}" class="${escapeXmlAttribute(className)}" aria-hidden="${ariaHidden ? "true" : "false"}" focusable="${focusable ? "true" : "false"}" data-ugc04-fallback="true" data-ugc04-source-module="${escapeXmlAttribute(MODULE_ID)}" data-ugc04-occurrence-id="${escapeXmlAttribute(OCCURRENCE_ID)}">`
    ];

    if (includeTitle) {
      lines.push(`<title>${escapeXmlText(title)}</title>`);
    }

    for (const layer of schema.layers) {
      if (layer.type === "ANNULUS") {
        lines.push(
          `<path data-ugc04-layer="${escapeXmlAttribute(layer.id)}" d="${escapeXmlAttribute(
            createAnnulusEvenOddPath(layer.outerRadius, layer.innerRadius)
          )}" fill="currentColor" fill-rule="evenodd"/>`
        );
        continue;
      }

      if (layer.type === "POLYGON") {
        lines.push(
          `<polygon data-ugc04-layer="${escapeXmlAttribute(layer.id)}" points="${escapeXmlAttribute(
            createPolygonPoints(layer.vertices)
          )}" fill="currentColor"/>`
        );
        continue;
      }

      if (layer.type === "CIRCLE") {
        lines.push(
          `<circle data-ugc04-layer="${escapeXmlAttribute(layer.id)}" cx="100" cy="100" r="${escapeXmlAttribute(
            String(layer.radius * 90)
          )}" fill="currentColor"/>`
        );
        continue;
      }

      invariant(false, "UNSUPPORTED_PROJECTION_LAYER_TYPE", {
        layerId: layer.id,
        type: layer.type
      });
    }

    lines.push(`</svg>`);
    return lines.join("");
  }

  function buildStaticSvgFallback(options = {}) {
    const {
      title = "Return to Master Compass",
      className = "ugc04-static-fallback",
      includeTitle = true,
      includeIntercardinalTicks = false,
      ariaHidden = true,
      focusable = false
    } = options;

    invariant(
      ariaHidden || includeTitle,
      "ACCESSIBLE_SVG_REQUIRES_TITLE_WHEN_NOT_ARIA_HIDDEN"
    );

    const schema = createFrontProjectionSchema({
      includeIntercardinalTicks
    });

    const svgString = createSvgStringFromProjectionSchema(schema, {
      title,
      className,
      includeTitle,
      ariaHidden,
      focusable
    });

    return deepFreeze({
      viewBox: schema.viewBox,
      svgString,
      stringLength: svgString.length,
      utf8ByteLength: getUtf8ByteLength(svgString),
      layerCount: schema.layers.length,
      projectionSchemaBacked: true,
      sourceModule: MODULE_ID,
      candidateId: CANDIDATE_ID,
      occurrenceId: OCCURRENCE_ID,
      includeIntercardinalTicks,
      monochromeCapable: true,
      animationRequired: false,
      rendererRequired: false,
      productionAuthorized: false
    });
  }

  function createPrototypeReceipt(options = {}) {
    const model =
      options.model ||
      buildBaselineMeshes({
        quality: options.quality || "desktop",
        includeIntercardinalTicks: options.includeIntercardinalTicks === true
      });

    const validation = validateModel(model);
    const fallback = buildStaticSvgFallback({
      includeIntercardinalTicks: model.includeIntercardinalTicks
    });

    return deepFreeze({
      receiptSchema: "DGB_UPSTREAM_COMPASS_GEOMETRY_PROTOTYPE_RECEIPT_v1",
      moduleId: MODULE_ID,
      moduleVersion: MODULE_VERSION,
      candidateId: CANDIDATE_ID,
      occurrenceId: OCCURRENCE_ID,
      artifactClass: STATUS.artifactClass,
      geometryVersion: MODULE_VERSION,
      physicalProjection: "FIXED_CENTER_HUB",
      semanticRelationship: "UPSTREAM_RETURN_CONTROL",
      qualityProfile: model.qualityProfile.id,
      intercardinalTicksEnabled: model.includeIntercardinalTicks,
      componentCount: model.componentCount,
      vertexCount: model.aggregate.vertexCount,
      triangleCount: model.aggregate.triangleCount,
      aggregateBounds: model.aggregate.bounds,
      actualTotalDepth: model.aggregate.actualTotalDepth,
      depthEnvelope: DEPTH_ENVELOPE,
      semanticHitEnvelope: CONSTANTS.semanticHitEnvelope,
      rootTransform: CONSTANTS.placement,
      arrayBufferViewPolicyClarification: ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION,
      bufferMutationContract: BUFFER_MUTATION_CONTRACT,
      fallbackEmission: Object.freeze({
        authority: MODULE_ID,
        projectionSchemaSurface: "createFrontProjectionSchema",
        concreteEmissionSurface: "buildStaticSvgFallback",
        generated: true,
        projectionSchemaBacked: true,
        separateHandAuthoredGeometry: false,
        canonicalViewBox: fallback.viewBox,
        stringLength: fallback.stringLength,
        utf8ByteLength: fallback.utf8ByteLength,
        layerCount: fallback.layerCount,
        productionAuthorized: false
      }),
      validation,
      authorization: Object.freeze({
        productionAuthorized: false,
        repositoryIntegrationAuthorized: false,
        deploymentAuthorized: false,
        publicReleaseAuthorized: false,
        finalGeometryFrozen: false
      }),
      disposition: "UNIVERSAL_COMPASS_GEOMETRY_CANDIDATE_CONSTRUCTED_AND_READY_FOR_SHARED_RENDERER_CONSUMPTION"
    });
  }

  function assertBooleanChecks(checks, codePrefix) {
    invariant(
      checks &&
        typeof checks === "object" &&
        !Array.isArray(checks),
      `${codePrefix}_CHECK_RECORD_INVALID`,
      { checks }
    );

    for (const [name, passed] of Object.entries(checks)) {
      invariant(
        typeof passed === "boolean",
        `${codePrefix}_${name}_NOT_BOOLEAN`,
        { check: name, passed }
      );

      invariant(
        passed === true,
        `${codePrefix}_${name}`,
        { check: name, passed }
      );
    }

    return true;
  }

  function runSelfTest() {
    const desktop = buildBaselineMeshes({ quality: "desktop" });
    const mobile = buildBaselineMeshes({ quality: "mobile" });
    const lowPower = buildBaselineMeshes({ quality: "lowPower" });
    const optionalTicks = buildBaselineMeshes({
      quality: "desktop",
      includeIntercardinalTicks: true
    });

    const firstMesh = desktop.meshes[0];

    const geometryChecks = deepFreeze({
      desktopModelValid: validateModel(desktop).pass === true,
      mobileModelValid: validateModel(mobile).pass === true,
      lowPowerModelValid: validateModel(lowPower).pass === true,
      optionalTicksModelValid: validateModel(optionalTicks).pass === true,
      fixedCenterHubIdentity: desktop.physicalProjection === "FIXED_CENTER_HUB",
      upstreamReturnSemanticIdentity: desktop.semanticRelationship === "UPSTREAM_RETURN_CONTROL",
      localQuaternionSharingExcluded: desktop.rootTransform.localQuaternionShared === false,
      localSettlementParticipationExcluded: desktop.rootTransform.localSettlementParticipation === false
    });

    assertBooleanChecks(geometryChecks, "SELF_TEST_GEOMETRY_CHECK_FAILED");

    const ordinaryObjectFreezeProbe = deepFreeze({
      a: { b: { c: 1 } }
    });

    const arrayBufferViewPolicyEvidence = deepFreeze({
      recursiveFreezeExemptionClass:
        ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION.recursiveFreezeExemptionClass,
      expectedFinalizedMeshBufferClass:
        ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION.expectedFinalizedMeshBufferClass,
      dataViewStatus:
        ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION.dataViewStatus
    });

    const arrayBufferViewPolicyChecks = deepFreeze({
      recursiveFreezeExemptionBound:
        ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION.recursiveFreezeExemptionClass ===
        "ALL_ARRAYBUFFER_VIEWS",
      expectedBufferClassListPresent:
        Array.isArray(ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION.expectedFinalizedMeshBufferClass) &&
        ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION.expectedFinalizedMeshBufferClass.length >= 3,
      dataViewPolicyDeclared:
        ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION.dataViewStatus ===
        "EXEMPT_IF_ENCOUNTERED_BUT_NOT_AN_EXPECTED_FINALIZED_MESH_BUFFER_SURFACE"
    });

    assertBooleanChecks(
      arrayBufferViewPolicyChecks,
      "SELF_TEST_ARRAYBUFFER_POLICY_CHECK_FAILED"
    );

    const bufferEvidence = deepFreeze({
      positionsConstructorName: firstMesh.positions.constructor.name,
      normalsConstructorName: firstMesh.normals.constructor.name,
      indicesConstructorName: firstMesh.indices.constructor.name,
      positionsByteLength: firstMesh.positions.byteLength,
      normalsByteLength: firstMesh.normals.byteLength,
      indicesByteLength: firstMesh.indices.byteLength,
      positionsElementCount: firstMesh.positions.length,
      normalsElementCount: firstMesh.normals.length,
      indicesElementCount: firstMesh.indices.length,
      dataViewUsedAsFinalizedMeshBuffer:
        firstMesh.positions.constructor.name === "DataView" ||
        firstMesh.normals.constructor.name === "DataView" ||
        firstMesh.indices.constructor.name === "DataView",
      typedArrayElementImmutabilityClaim:
        BUFFER_MUTATION_CONTRACT.typedArrayElementImmutabilityClaim,
      meshRecordFrozenObserved: Object.isFrozen(firstMesh),
      positionsArrayBufferViewObserved: isArrayBufferView(firstMesh.positions),
      normalsArrayBufferViewObserved: isArrayBufferView(firstMesh.normals),
      indicesArrayBufferViewObserved: isArrayBufferView(firstMesh.indices)
    });

    const bufferChecks = deepFreeze({
      meshRecordFrozen: bufferEvidence.meshRecordFrozenObserved === true,
      positionsAreArrayBufferView: bufferEvidence.positionsArrayBufferViewObserved === true,
      normalsAreArrayBufferView: bufferEvidence.normalsArrayBufferViewObserved === true,
      indicesAreArrayBufferView: bufferEvidence.indicesArrayBufferViewObserved === true,
      positionsTypeValid: bufferEvidence.positionsConstructorName === "Float32Array",
      normalsTypeValid: bufferEvidence.normalsConstructorName === "Float32Array",
      indicesTypeValid:
        bufferEvidence.indicesConstructorName === "Uint16Array" ||
        bufferEvidence.indicesConstructorName === "Uint32Array",
      positionsByteLengthValid:
        Number.isInteger(bufferEvidence.positionsByteLength) &&
        bufferEvidence.positionsByteLength > 0,
      normalsByteLengthValid:
        Number.isInteger(bufferEvidence.normalsByteLength) &&
        bufferEvidence.normalsByteLength > 0,
      indicesByteLengthValid:
        Number.isInteger(bufferEvidence.indicesByteLength) &&
        bufferEvidence.indicesByteLength > 0,
      positionsElementCountValid:
        Number.isInteger(bufferEvidence.positionsElementCount) &&
        bufferEvidence.positionsElementCount > 0 &&
        bufferEvidence.positionsElementCount % 3 === 0,
      normalsElementCountValid:
        Number.isInteger(bufferEvidence.normalsElementCount) &&
        bufferEvidence.normalsElementCount === bufferEvidence.positionsElementCount,
      indicesElementCountValid:
        Number.isInteger(bufferEvidence.indicesElementCount) &&
        bufferEvidence.indicesElementCount > 0 &&
        bufferEvidence.indicesElementCount % 3 === 0,
      dataViewExcludedFromFinalizedMesh:
        bufferEvidence.dataViewUsedAsFinalizedMeshBuffer === false,
      typedArrayElementImmutabilityNotClaimed:
        bufferEvidence.typedArrayElementImmutabilityClaim === false,
      bufferMutableDuringConstructionContractBound:
        BUFFER_MUTATION_CONTRACT.bufferContentsMutableDuringConstruction === true,
      bufferMutationAfterFinalizationContractuallyProhibited:
        BUFFER_MUTATION_CONTRACT.bufferContentsMutableAfterFinalization === false &&
        BUFFER_MUTATION_CONTRACT.postFinalizationMutationPolicy ===
          "PROHIBITED_BY_MODULE_CONTRACT",
      externalMutationAuthorityDenied:
        BUFFER_MUTATION_CONTRACT.externalMutationAuthority === false,
      rendererMutationAuthorityDenied:
        BUFFER_MUTATION_CONTRACT.rendererMutationPermitted === false,
      validationMutationAuthorityDenied:
        BUFFER_MUTATION_CONTRACT.validationMutationPermitted === false,
      fallbackMutationAuthorityDenied:
        BUFFER_MUTATION_CONTRACT.fallbackMutationPermitted === false
    });

    assertBooleanChecks(bufferChecks, "SELF_TEST_BUFFER_CHECK_FAILED");

    const baselineSvg = buildStaticSvgFallback();
    const optionalTickSvg = buildStaticSvgFallback({ includeIntercardinalTicks: true });
    const titleOmittedSvg = buildStaticSvgFallback({ includeTitle: false });
    const accessibleSvg = buildStaticSvgFallback({
      ariaHidden: false,
      includeTitle: true
    });
    const escapedClassSvg = buildStaticSvgFallback({
      className: 'a"b<c>d'
    });

    const fallbackEvidence = deepFreeze({
      baselineSvgString: baselineSvg.svgString,
      optionalTickSvgString: optionalTickSvg.svgString,
      titleOmittedSvgString: titleOmittedSvg.svgString,
      accessibleSvgString: accessibleSvg.svgString,
      escapedClassSvgString: escapedClassSvg.svgString,
      baselineLayerCount: baselineSvg.layerCount,
      optionalTickLayerCount: optionalTickSvg.layerCount,
      baselineUtf8ByteLength: baselineSvg.utf8ByteLength
    });

    const fallbackChecks = deepFreeze({
      buildSurfacePresent: typeof buildStaticSvgFallback === "function",
      projectionSchemaPresent: typeof createFrontProjectionSchema === "function",
      projectionSchemaBacked: baselineSvg.projectionSchemaBacked === true,
      noIndependentGeometryConstants:
        FALLBACK_EMISSION_AUTHORITY.separateHandAuthoredFallbackGeometry === false,
      svgStringNonempty:
        typeof baselineSvg.svgString === "string" &&
        baselineSvg.svgString.length > 0,
      svgElementPresent:
        baselineSvg.svgString.trimStart().startsWith("<svg"),
      canonicalViewBoxPresent:
        baselineSvg.svgString.includes('viewBox="0 0 200 200"'),
      outerRingPresent:
        baselineSvg.svgString.includes('data-ugc04-layer="OUTER_RING"'),
      innerRingPresent:
        baselineSvg.svgString.includes('data-ugc04-layer="INNER_RING"'),
      southDirectionPresent:
        baselineSvg.svgString.includes('data-ugc04-layer="SOUTH_DIRECTION"'),
      eastDirectionPresent:
        baselineSvg.svgString.includes('data-ugc04-layer="EAST_DIRECTION"'),
      westDirectionPresent:
        baselineSvg.svgString.includes('data-ugc04-layer="WEST_DIRECTION"'),
      northNeedlePresent:
        baselineSvg.svgString.includes('data-ugc04-layer="NORTH_NEEDLE"'),
      centralHubPresent:
        baselineSvg.svgString.includes('data-ugc04-layer="CENTRAL_HUB"'),
      allBaselineLayersPresent:
        baselineSvg.svgString.includes('data-ugc04-layer="OUTER_RING"') &&
        baselineSvg.svgString.includes('data-ugc04-layer="INNER_RING"') &&
        baselineSvg.svgString.includes('data-ugc04-layer="SOUTH_DIRECTION"') &&
        baselineSvg.svgString.includes('data-ugc04-layer="EAST_DIRECTION"') &&
        baselineSvg.svgString.includes('data-ugc04-layer="WEST_DIRECTION"') &&
        baselineSvg.svgString.includes('data-ugc04-layer="NORTH_NEEDLE"') &&
        baselineSvg.svgString.includes('data-ugc04-layer="CENTRAL_HUB"'),
      baselineTicksAbsent:
        !baselineSvg.svgString.includes("INTERCARDINAL_TICK_"),
      optionalTicksPresent:
        optionalTickSvg.svgString.includes("INTERCARDINAL_TICK_"),
      titleOmissionPass:
        !titleOmittedSvg.svgString.includes("<title"),
      accessibleTitleRulePass:
        accessibleSvg.svgString.includes("<title") &&
        accessibleSvg.svgString.includes("Return to Master Compass"),
      exactEscapedClassAttributePass:
        escapedClassSvg.svgString.includes('class="a&quot;b&lt;c&gt;d"'),
      monochromeCapable: baselineSvg.monochromeCapable === true,
      animationNotRequired: baselineSvg.animationRequired === false,
      rendererNotRequired: baselineSvg.rendererRequired === false,
      productionAuthorizationFalse: baselineSvg.productionAuthorized === false
    });

    assertBooleanChecks(fallbackChecks, "SELF_TEST_FALLBACK_CHECK_FAILED");

    const receipt = createPrototypeReceipt({ model: desktop });

    const receiptChecks = deepFreeze({
      bufferAndFallbackEvidencePresent:
        receipt.bufferMutationContract &&
        receipt.fallbackEmission &&
        receipt.fallbackEmission.generated === true
    });

    assertBooleanChecks(receiptChecks, "SELF_TEST_RECEIPT_CHECK_FAILED");

    const authorizationChecks = deepFreeze({
      productionAuthorizationFalse: STATUS.productionAuthorized === false,
      repositoryIntegrationAuthorizationFalse:
        STATUS.repositoryIntegrationAuthorized === false
    });

    assertBooleanChecks(authorizationChecks, "SELF_TEST_AUTHORIZATION_CHECK_FAILED");

    const ordinaryObjectFreezeChecks = deepFreeze({
      deepFreezeOrdinaryObjectPass:
        Object.isFrozen(ordinaryObjectFreezeProbe) &&
        Object.isFrozen(ordinaryObjectFreezeProbe.a) &&
        Object.isFrozen(ordinaryObjectFreezeProbe.a.b)
    });

    assertBooleanChecks(
      ordinaryObjectFreezeChecks,
      "SELF_TEST_ORDINARY_OBJECT_FREEZE_CHECK_FAILED"
    );

    const correctionGate = deepFreeze({
      ALL_ARRAYBUFFER_VIEWS_EXEMPT_FROM_RECURSIVE_OBJECT_FREEZE:
        arrayBufferViewPolicyChecks.recursiveFreezeExemptionBound,
      EXPECTED_FINALIZED_MESH_BUFFER_CLASSES_DECLARED:
        bufferChecks.positionsTypeValid &&
        bufferChecks.normalsTypeValid &&
        bufferChecks.indicesTypeValid,
      DATAVIEW_EXEMPT_BUT_NOT_EXPECTED_AS_FINAL_MESH_BUFFER:
        bufferChecks.dataViewExcludedFromFinalizedMesh,
      ORDINARY_OBJECT_RECURSIVE_FREEZE_PRESERVED:
        ordinaryObjectFreezeChecks.deepFreezeOrdinaryObjectPass,
      CONTAINING_MESH_RECORDS_FROZEN:
        bufferChecks.meshRecordFrozen,
      TYPED_ARRAY_ELEMENT_IMMUTABILITY_NOT_CLAIMED:
        bufferChecks.typedArrayElementImmutabilityNotClaimed,
      WRITE_ONCE_AFTER_FINALIZATION_CONTRACT_BOUND:
        bufferChecks.bufferMutationAfterFinalizationContractuallyProhibited,
      EXTERNAL_BUFFER_MUTATION_AUTHORITY_DENIED:
        bufferChecks.externalMutationAuthorityDenied,
      RENDERER_BUFFER_MUTATION_AUTHORITY_DENIED:
        bufferChecks.rendererMutationAuthorityDenied,
      VALIDATION_BUFFER_MUTATION_AUTHORITY_DENIED:
        bufferChecks.validationMutationAuthorityDenied,
      FALLBACK_BUFFER_MUTATION_AUTHORITY_DENIED:
        bufferChecks.fallbackMutationAuthorityDenied,
      CREATE_FRONT_PROJECTION_SCHEMA_PRESERVED:
        fallbackChecks.projectionSchemaPresent,
      BUILD_STATIC_SVG_FALLBACK_EXPOSED:
        fallbackChecks.buildSurfacePresent,
      SVG_DERIVED_FROM_CANONICAL_PROJECTION_SCHEMA:
        fallbackChecks.projectionSchemaBacked,
      NO_SECOND_FALLBACK_GEOMETRY_CONSTANT_SET:
        fallbackChecks.noIndependentGeometryConstants,
      NONEMPTY_INLINE_SVG_GENERATED:
        fallbackChecks.svgStringNonempty,
      CANONICAL_VIEWBOX_PRESENT:
        fallbackChecks.canonicalViewBoxPresent,
      BASELINE_GEOMETRY_LAYERS_PRESENT:
        fallbackChecks.allBaselineLayersPresent,
      EXACT_ESCAPED_CLASS_ATTRIBUTE_ASSERTION_PASS:
        fallbackChecks.exactEscapedClassAttributePass,
      ACCESSIBLE_TITLE_RULE_PASS:
        fallbackChecks.accessibleTitleRulePass,
      MONOCHROME_CAPABLE:
        fallbackChecks.monochromeCapable,
      ANIMATION_NOT_REQUIRED:
        fallbackChecks.animationNotRequired,
      RENDERER_NOT_REQUIRED:
        fallbackChecks.rendererNotRequired,
      PROTOTYPE_RECEIPT_UPGRADED:
        receiptChecks.bufferAndFallbackEvidencePresent,
      PRODUCTION_AUTHORIZATION_FALSE:
        authorizationChecks.productionAuthorizationFalse,
      REPOSITORY_INTEGRATION_AUTHORIZATION_FALSE:
        authorizationChecks.repositoryIntegrationAuthorizationFalse
    });

    assertBooleanChecks(correctionGate, "SELF_TEST_CORRECTION_GATE_FAILED");

    return deepFreeze({
      pass: true,
      moduleId: MODULE_ID,
      occurrenceId: OCCURRENCE_ID,
      profiles: Object.freeze({
        desktop: validateModel(desktop),
        mobile: validateModel(mobile),
        lowPower: validateModel(lowPower),
        optionalTicks: validateModel(optionalTicks)
      }),
      geometryChecks,
      arrayBufferViewPolicyEvidence,
      arrayBufferViewPolicyChecks,
      bufferEvidence,
      bufferChecks,
      fallbackEvidence,
      fallbackChecks,
      receiptChecks,
      authorizationChecks,
      correctionGate,
      productionAuthorized: false
    });
  }

  return deepFreeze({
    moduleId: MODULE_ID,
    moduleVersion: MODULE_VERSION,
    occurrenceId: OCCURRENCE_ID,
    status: STATUS,
    coordinateSystem: COORDINATE_SYSTEM,
    depthEnvelope: DEPTH_ENVELOPE,
    constants: CONSTANTS,
    qualityProfiles: QUALITY_PROFILES,
    arrayBufferViewPolicyClarification: ARRAY_BUFFER_VIEW_POLICY_CLARIFICATION,
    bufferMutationContract: BUFFER_MUTATION_CONTRACT,
    fallbackEmissionAuthority: FALLBACK_EMISSION_AUTHORITY,
    buildBaselineMeshes,
    createFrontProjectionSchema,
    buildStaticSvgFallback,
    createPrototypeReceipt,
    validateModel,
    runSelfTest
  });
})();

if (typeof globalThis !== "undefined") {
  globalThis.DGB_UPSTREAM_COMPASS_GEOMETRY = DGB_UPSTREAM_COMPASS_GEOMETRY;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = DGB_UPSTREAM_COMPASS_GEOMETRY;
}
