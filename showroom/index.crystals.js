/* TARGET FILE: /showroom/index.crystals.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_CONSTELLATION_CRYSTALS_TNT_v3 */
/*
  Renewal objectives:
  - Preserve crystal geometry, materials, orbital targets, animation,
    compositor registration, semantic association, and fallback recovery.
  - Scope crystal discovery exclusively to [data-showroom-orbit-field].
  - Use the compositor projection as the single positioning authority for
    both crystal drawing and semantic hit targets.
  - Keep every semantic hit target strictly inside the orbit field.
  - Clear fallback right/bottom constraints before projected positioning.
  - Avoid duplicate semantic DOM writes during compositor drawing.
  - Suspend animation and compositor frame requests while the orbit field
    is offscreen, the document is hidden, or page scrolling is active.
  - Resume safely when the scene becomes visible or interaction/state changes.
  - Avoid continuous reduced-motion animation when the scene is settled.
  - Preserve compositor, controller, interactions, Compass, Diamond,
    Window, gauge, information, navigation, and dialog authority boundaries.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CRYSTALS_TNT_v3";

  const OWNER =
    "/showroom/index.crystals.js";

  const EVENTS = Object.freeze({
    ready:
      "showroom:crystals-ready",

    receipt:
      "showroom:crystals-receipt",

    failed:
      "showroom:crystals-failed",

    disposed:
      "showroom:crystals-disposed",

    compositorReady:
      "showroom:compositor-ready",

    compositorFailed:
      "showroom:compositor-failed",

    compositorDisposed:
      "showroom:compositor-disposed",

    compositorRequestFrame:
      "showroom:compositor-request-frame",

    orbitMotion:
      "showroom:orbit-motion",

    orbitMotionStart:
      "showroom:orbit-motion-start",

    orbitMotionEnd:
      "showroom:orbit-motion-end",

    clusterChanged:
      "showroom:cluster-changed",

    stateChanged:
      "showroom:state-changed"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    receipt:
      "[data-showroom-crystals-receipt]",

    orbitField:
      "[data-showroom-orbit-field]",

    semanticObject:
      "[data-showroom-object]",

    fallbackStar:
      "[data-showroom-fallback-star]",

    primaryLayer:
      "[data-showroom-primary-stars]",

    cluster:
      "[data-showroom-cluster]"
  });

  const ATTRIBUTES = Object.freeze({
    ready:
      "data-showroom-crystals-ready",

    state:
      "data-showroom-crystals-state",

    activeCluster:
      "data-showroom-active-cluster",

    held:
      "data-showroom-held",

    reducedMotion:
      "data-showroom-reduced-motion",

    objectId:
      "data-showroom-object-id",

    objectSize:
      "data-showroom-object-size",

    objectBehavior:
      "data-showroom-object-behavior",

    clusterId:
      "data-showroom-cluster-id",

    fallbackRendering:
      "data-showroom-fallback-star-rendering",

    fallbackVisibility:
      "data-showroom-fallback-star-visibility",

    sceneVisible:
      "data-showroom-crystals-scene-visible",

    suspended:
      "data-showroom-crystals-suspended"
  });

  const NODE_TYPES = Object.freeze({
    LARGE:
      "large",

    SMALL:
      "small"
  });

  const GEOMETRY_TYPES = Object.freeze({
    CARDINAL:
      "cardinal-star",

    CHILD:
      "child-star"
  });

  const MATERIAL_FAMILIES = Object.freeze({
    CARDINAL:
      "cardinal",

    GAUGE:
      "gauge",

    INFORMATION:
      "information"
  });

  const CONFIG = Object.freeze({
    coordinateSystem:
      "RIGHT_HANDED_EUCLIDEAN_XYZ",

    orientationRepresentation:
      "UNIT_QUATERNION",

    largePoints:
      8,

    childPoints:
      6,

    largeRadius:
      58,

    largeInnerRatio:
      0.42,

    childRadius:
      34,

    childInnerRatio:
      0.46,

    largeDepth:
      0.42,

    childDepth:
      0.28,

    largeCrown:
      0.22,

    childCrown:
      0.13,

    constellationRadiusX:
      2.05,

    constellationRadiusY:
      1.54,

    constellationRadiusZ:
      1.58,

    gaugeClusterRadiusX:
      1.58,

    gaugeClusterRadiusY:
      1.16,

    gaugeClusterRadiusZ:
      1.18,

    informationClusterRadiusX:
      1.46,

    informationClusterRadiusY:
      1.08,

    informationClusterRadiusZ:
      1.12,

    largeBaseScale:
      0.88,

    childBaseScale:
      0.82,

    rearScaleMultiplier:
      0.78,

    frontScaleMultiplier:
      1.16,

    activeClusterScaleMultiplier:
      1.08,

    inactiveChildScale:
      0.35,

    interpolationSpeed:
      7.2,

    reducedMotionInterpolationSpeed:
      22,

    idleRotationSpeed:
      0.18,

    childRotationSpeed:
      0.24,

    haloExpansion:
      1.18,

    semanticMinimumSize:
      44,

    semanticLargeSize:
      108,

    semanticChildSize:
      74,

    semanticViewportPadding:
      4,

    semanticWriteTolerance:
      0.35,

    readinessTimeoutMs:
      5000,

    pageScrollPauseMs:
      150,

    settlementPositionEpsilon:
      0.002,

    settlementScalarEpsilon:
      0.002,

    settlementQuaternionEpsilon:
      0.0008,

    intersectionThreshold:
      0.04,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const PALETTE = Object.freeze({
    cardinalCool:
      Object.freeze({
        core:
          "rgba(160, 220, 255, 0.96)",

        middle:
          "rgba(90, 177, 242, 0.94)",

        edge:
          "rgba(31, 88, 165, 0.96)",

        highlight:
          "rgba(238, 250, 255, 0.98)",

        shadow:
          "rgba(10, 31, 76, 0.86)",

        halo:
          "rgba(90, 183, 255, 0.26)"
      }),

    cardinalWarm:
      Object.freeze({
        core:
          "rgba(255, 222, 150, 0.97)",

        middle:
          "rgba(239, 168, 73, 0.95)",

        edge:
          "rgba(149, 71, 21, 0.96)",

        highlight:
          "rgba(255, 250, 224, 0.99)",

        shadow:
          "rgba(70, 24, 9, 0.86)",

        halo:
          "rgba(255, 177, 73, 0.27)"
      }),

    gauge:
      Object.freeze({
        core:
          "rgba(174, 255, 255, 0.98)",

        middle:
          "rgba(61, 224, 240, 0.96)",

        edge:
          "rgba(9, 104, 147, 0.97)",

        highlight:
          "rgba(239, 255, 255, 1)",

        shadow:
          "rgba(3, 37, 65, 0.88)",

        halo:
          "rgba(49, 232, 255, 0.31)"
      }),

    information:
      Object.freeze({
        core:
          "rgba(231, 194, 255, 0.98)",

        middle:
          "rgba(169, 91, 232, 0.96)",

        edge:
          "rgba(78, 28, 145, 0.97)",

        highlight:
          "rgba(251, 239, 255, 1)",

        shadow:
          "rgba(34, 10, 68, 0.88)",

        halo:
          "rgba(180, 103, 255, 0.31)"
      })
  });

  const LARGE_BASE_VECTORS = Object.freeze({
    "characters-route":
      Object.freeze([0, 1, 0]),

    "elara-route":
      Object.freeze([1, 0, 0]),

    "gauge-cluster":
      Object.freeze([0, -1, 0]),

    "information-cluster":
      Object.freeze([-1, 0, 0])
  });

  const state = {
    root: null,
    receipt: null,
    orbitField: null,

    semanticObjects:
      new Map(),

    nodes:
      new Map(),

    registrations:
      new Map(),

    geometries:
      new Map(),

    compositor:
      null,

    compositorOwnedByCrystals:
      false,

    orientation:
      [0, 0, 0, 1],

    targetOrientation:
      [0, 0, 0, 1],

    clusterOrientations:
      new Map(),

    clusterTargetOrientations:
      new Map(),

    activeClusterId:
      "",

    reducedMotion:
      false,

    held:
      false,

    sceneVisible:
      true,

    documentVisible:
      !document.hidden,

    pageScrolling:
      false,

    interactionActive:
      false,

    dirty:
      true,

    running:
      false,

    initialized:
      false,

    ready:
      false,

    failed:
      false,

    disposed:
      false,

    raf:
      0,

    lastTime:
      0,

    readinessTimer:
      0,

    scrollResumeTimer:
      0,

    listeners:
      [],

    observers:
      [],

    counters: {
      largeNodes:
        0,

      smallNodes:
        0,

      registeredNodes:
        0,

      visibleNodes:
        0,

      drawCalls:
        0,

      semanticUpdates:
        0,

      semanticWritesSkipped:
        0,

      semanticRejectedOutsideField:
        0,

      motionEvents:
        0,

      suspendedFrames:
        0,

      resumedAnimations:
        0,

      failures:
        0
    }
  };

  function normalize(value) {
    return String(value || "").trim();
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

  function nearlyEqual(
    left,
    right,
    epsilon
  ) {
    return (
      Math.abs(
        left - right
      ) <= epsilon
    );
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function addListener(
    target,
    type,
    handler,
    options
  ) {
    if (!target) {
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

  function addObserver(observer) {
    if (observer) {
      state.observers.push(
        observer
      );
    }
  }

  function setRootAttribute(
    name,
    value
  ) {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      name,
      String(value)
    );
  }

  function dispatch(
    eventName,
    detail = {}
  ) {
    const payload =
      Object.freeze({
        contract:
          CONTRACT,

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

  function createReceipt(
    event,
    extra = {}
  ) {
    return Object.freeze({
      contract:
        CONTRACT,

      owner:
        OWNER,

      event,

      timestamp:
        nowIso(),

      initialized:
        state.initialized,

      ready:
        state.ready,

      failed:
        state.failed,

      disposed:
        state.disposed,

      running:
        state.running,

      sceneVisible:
        state.sceneVisible,

      documentVisible:
        state.documentVisible,

      pageScrolling:
        state.pageScrolling,

      interactionActive:
        state.interactionActive,

      suspended:
        isRenderingSuspended(),

      coordinateSystem:
        CONFIG.coordinateSystem,

      orientationRepresentation:
        CONFIG.orientationRepresentation,

      geometryCount:
        state.geometries.size,

      nodeCount:
        state.nodes.size,

      activeClusterId:
        state.activeClusterId || null,

      reducedMotion:
        state.reducedMotion,

      held:
        state.held,

      visualPassClaimed:
        CONFIG.visualPassClaimed,

      productionAuthorized:
        CONFIG.productionAuthorized,

      deploymentAuthorized:
        CONFIG.deploymentAuthorized,

      counters:
        Object.freeze({
          ...state.counters
        }),

      ...extra
    });
  }

  function publishReceipt(
    event,
    extra = {}
  ) {
    const payload =
      createReceipt(
        event,
        extra
      );

    if (state.receipt) {
      const serialized =
        JSON.stringify(
          payload
        );

      state.receipt.value =
        serialized;

      state.receipt.textContent =
        serialized;
    }

    dispatch(
      EVENTS.receipt,
      payload
    );

    return payload;
  }

  function serializeError(error) {
    return Object.freeze({
      name:
        error instanceof Error
          ? error.name
          : "Error",

      message:
        error instanceof Error
          ? error.message
          : String(error)
    });
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
      length <= 1e-8
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function quaternionNormalize(
    quaternion,
    fallback = [0, 0, 0, 1]
  ) {
    const source =
      Array.isArray(quaternion) ||
      ArrayBuffer.isView(
        quaternion
      )
        ? Array.from(
            quaternion
          )
        : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const normalized = [
      Number(source[0]) || 0,
      Number(source[1]) || 0,
      Number(source[2]) || 0,
      Number(source[3]) || 1
    ];

    const length =
      Math.hypot(
        normalized[0],
        normalized[1],
        normalized[2],
        normalized[3]
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-8
    ) {
      return fallback.slice();
    }

    return normalized.map(
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

    if (cosine < 0) {
      cosine =
        -cosine;

      to = [
        -to[0],
        -to[1],
        -to[2],
        -to[3]
      ];
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
      Math.sin(theta);

    const weightFrom =
      Math.sin(
        (
          1 - amount
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

  function quaternionFromObject(
    quaternionObject
  ) {
    if (
      !quaternionObject ||
      typeof quaternionObject !==
        "object"
    ) {
      return [0, 0, 0, 1];
    }

    return quaternionNormalize([
      quaternionObject.x,
      quaternionObject.y,
      quaternionObject.z,
      quaternionObject.w
    ]);
  }

  function quaternionDistance(
    left,
    right
  ) {
    const a =
      quaternionNormalize(left);

    const b =
      quaternionNormalize(right);

    const direct =
      Math.hypot(
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2],
        a[3] - b[3]
      );

    const inverse =
      Math.hypot(
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2],
        a[3] + b[3]
      );

    return Math.min(
      direct,
      inverse
    );
  }

  function createDiamondStarGeometry(
    options = {}
  ) {
    const points =
      Math.max(
        3,
        Math.floor(
          Number(options.points) ||
          CONFIG.largePoints
        )
      );

    const radius =
      Number(options.radius) ||
      CONFIG.largeRadius;

    const inner =
      Number(options.inner) ||
      radius *
      CONFIG.largeInnerRatio;

    const depth =
      Number(options.depth) ||
      CONFIG.largeDepth;

    const crown =
      Number(options.crown) ||
      CONFIG.largeCrown;

    const vertices = [];
    const faces = [];

    function add(vertex) {
      vertices.push(vertex);

      return (
        vertices.length - 1
      );
    }

    function face(
      a,
      b,
      c,
      band
    ) {
      faces.push(
        Object.freeze({
          indices:
            Object.freeze([
              a,
              b,
              c
            ]),

          band
        })
      );
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
          index + 1
        ) %
        count;

      face(
        frontApex,
        innerRing[index],
        innerRing[next],
        "front-core"
      );

      face(
        frontCrown,
        frontBevel[next],
        frontBevel[index],
        "front-highlight"
      );

      face(
        frontBevel[index],
        outer[index],
        outer[next],
        "front-edge"
      );

      face(
        frontBevel[index],
        outer[next],
        frontBevel[next],
        "front-middle"
      );

      face(
        innerRing[index],
        frontBevel[index],
        frontBevel[next],
        "front-middle"
      );

      face(
        innerRing[index],
        frontBevel[next],
        innerRing[next],
        "front-core"
      );

      face(
        rearApex,
        rearBevel[next],
        rearBevel[index],
        "rear-shadow"
      );

      face(
        rearCrown,
        rearBevel[index],
        rearBevel[next],
        "rear-shadow"
      );

      face(
        rearBevel[index],
        outer[next],
        outer[index],
        "rear-edge"
      );

      face(
        rearBevel[index],
        rearBevel[next],
        outer[next],
        "rear-middle"
      );
    }

    return Object.freeze({
      points,
      radius,
      inner,
      depth,
      crown,

      vertices:
        Object.freeze(
          vertices.map(
            vertex =>
              Object.freeze(
                vertex.slice()
              )
          )
        ),

      faces:
        Object.freeze(
          faces.slice()
        )
    });
  }

  function buildGeometries() {
    state.geometries.set(
      GEOMETRY_TYPES.CARDINAL,
      createDiamondStarGeometry({
        points:
          CONFIG.largePoints,

        radius:
          CONFIG.largeRadius,

        inner:
          CONFIG.largeRadius *
          CONFIG.largeInnerRatio,

        depth:
          CONFIG.largeDepth,

        crown:
          CONFIG.largeCrown
      })
    );

    state.geometries.set(
      GEOMETRY_TYPES.CHILD,
      createDiamondStarGeometry({
        points:
          CONFIG.childPoints,

        radius:
          CONFIG.childRadius,

        inner:
          CONFIG.childRadius *
          CONFIG.childInnerRatio,

        depth:
          CONFIG.childDepth,

        crown:
          CONFIG.childCrown
      })
    );
  }

  function paletteForNode(node) {
    if (
      node.materialFamily ===
      MATERIAL_FAMILIES.GAUGE
    ) {
      return PALETTE.gauge;
    }

    if (
      node.materialFamily ===
      MATERIAL_FAMILIES.INFORMATION
    ) {
      return PALETTE.information;
    }

    return node.warm
      ? PALETTE.cardinalWarm
      : PALETTE.cardinalCool;
  }

  function childBaseVector(
    index,
    count
  ) {
    const safeCount =
      Math.max(
        1,
        count
      );

    const angle =
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
        1.73
      ) *
      0.30;

    const cosineLatitude =
      Math.cos(latitude);

    return normalizeVector([
      Math.cos(angle) *
        cosineLatitude,

      Math.sin(latitude),

      Math.sin(angle) *
        cosineLatitude
    ]);
  }

  function createNode(
    semanticElement,
    index,
    clusterCount
  ) {
    const id =
      normalize(
        semanticElement.getAttribute(
          ATTRIBUTES.objectId
        )
      );

    const size =
      normalize(
        semanticElement.getAttribute(
          ATTRIBUTES.objectSize
        )
      );

    const behavior =
      normalize(
        semanticElement.getAttribute(
          ATTRIBUTES.objectBehavior
        )
      );

    const clusterId =
      normalize(
        semanticElement.getAttribute(
          ATTRIBUTES.clusterId
        )
      );

    const large =
      size === NODE_TYPES.LARGE;

    let materialFamily =
      MATERIAL_FAMILIES.CARDINAL;

    if (
      behavior === "gauge"
    ) {
      materialFamily =
        MATERIAL_FAMILIES.GAUGE;
    } else if (
      behavior ===
      "information"
    ) {
      materialFamily =
        MATERIAL_FAMILIES.INFORMATION;
    }

    const baseVector =
      large
        ? (
            LARGE_BASE_VECTORS[id] ||
            [0, 1, 0]
          ).slice()
        : childBaseVector(
            index,
            clusterCount
          );

    return {
      id,
      size,
      behavior,
      clusterId,
      semanticElement,

      geometryType:
        large
          ? GEOMETRY_TYPES.CARDINAL
          : GEOMETRY_TYPES.CHILD,

      materialFamily,

      warm:
        id === "gauge-cluster" ||
        id === "information-cluster",

      baseVector,

      worldPosition: {
        x: 0,
        y: 0,
        z: 0
      },

      targetPosition: {
        x: 0,
        y: 0,
        z: 0
      },

      scale:
        large
          ? CONFIG.largeBaseScale
          : CONFIG.inactiveChildScale,

      targetScale:
        large
          ? CONFIG.largeBaseScale
          : CONFIG.inactiveChildScale,

      opacity:
        large
          ? 1
          : 0,

      targetOpacity:
        large
          ? 1
          : 0,

      prominence:
        1,

      targetProminence:
        1,

      halo:
        large
          ? 0.78
          : 0.62,

      targetHalo:
        large
          ? 0.78
          : 0.62,

      localRotationX:
        0,

      localRotationY:
        0,

      localRotationZ:
        index * 0.42,

      phase:
        index * 0.71 +
        (
          large
            ? 0.24
            : 1.08
        ),

      visible:
        large,

      registration:
        null,

      lastSemantic:
        {
          visible:
            false,

          x:
            NaN,

          y:
            NaN,

          size:
            NaN,

          interactive:
            false
        }
    };
  }

  function discoverSemanticObjects() {
    const elements =
      Array.from(
        state.orbitField
          .querySelectorAll(
            SELECTORS.semanticObject
          )
      );

    const clusterCounts =
      new Map();

    for (const element of elements) {
      const size =
        normalize(
          element.getAttribute(
            ATTRIBUTES.objectSize
          )
        );

      if (size !== NODE_TYPES.SMALL) {
        continue;
      }

      const clusterElement =
        element.closest(
          SELECTORS.cluster
        );

      const clusterId =
        clusterElement
          ? normalize(
              clusterElement.getAttribute(
                ATTRIBUTES.clusterId
              )
            )
          : "";

      clusterCounts.set(
        clusterId,
        (
          clusterCounts.get(
            clusterId
          ) ||
          0
        ) +
        1
      );
    }

    const clusterIndices =
      new Map();

    for (const element of elements) {
      if (
        !state.orbitField.contains(
          element
        )
      ) {
        continue;
      }

      const id =
        normalize(
          element.getAttribute(
            ATTRIBUTES.objectId
          )
        );

      if (!id) {
        throw new Error(
          "A semantic constellation object is missing data-showroom-object-id."
        );
      }

      const size =
        normalize(
          element.getAttribute(
            ATTRIBUTES.objectSize
          )
        );

      const clusterElement =
        element.closest(
          SELECTORS.cluster
        );

      const clusterId =
        clusterElement
          ? normalize(
              clusterElement.getAttribute(
                ATTRIBUTES.clusterId
              )
            )
          : "";

      const index =
        clusterIndices.get(
          clusterId
        ) ||
        0;

      const count =
        clusterCounts.get(
          clusterId
        ) ||
        1;

      const node =
        createNode(
          element,
          index,
          count
        );

      state.semanticObjects.set(
        id,
        element
      );

      state.nodes.set(
        id,
        node
      );

      if (
        size === NODE_TYPES.SMALL
      ) {
        clusterIndices.set(
          clusterId,
          index + 1
        );

        state.counters.smallNodes += 1;
      } else {
        state.counters.largeNodes += 1;
      }
    }

    if (
      state.counters.largeNodes !== 4
    ) {
      throw new Error(
        `Expected four large constellation stars; found ${state.counters.largeNodes}.`
      );
    }

    if (
      state.counters.smallNodes !== 7
    ) {
      throw new Error(
        `Expected seven child stars; found ${state.counters.smallNodes}.`
      );
    }
  }

  function resolveActiveCluster() {
    if (!state.root) {
      return "";
    }

    return normalize(
      state.root.getAttribute(
        ATTRIBUTES.activeCluster
      )
    );
  }

  function updateRootState() {
    if (!state.root) {
      return;
    }

    state.activeClusterId =
      resolveActiveCluster();

    state.reducedMotion =
      state.root.getAttribute(
        ATTRIBUTES.reducedMotion
      ) === "true" ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    state.held =
      state.root.getAttribute(
        ATTRIBUTES.held
      ) === "true";
  }

  function radiusForCluster(
    clusterId
  ) {
    if (
      clusterId === "gauges"
    ) {
      return Object.freeze({
        x:
          CONFIG.gaugeClusterRadiusX,

        y:
          CONFIG.gaugeClusterRadiusY,

        z:
          CONFIG.gaugeClusterRadiusZ
      });
    }

    return Object.freeze({
      x:
        CONFIG.informationClusterRadiusX,

      y:
        CONFIG.informationClusterRadiusY,

      z:
        CONFIG.informationClusterRadiusZ
    });
  }

  function updateNodeTargets() {
    const orientation =
      state.orientation;

    for (
      const node
      of state.nodes.values()
    ) {
      if (
        node.size ===
        NODE_TYPES.LARGE
      ) {
        const vector =
          normalizeVector(
            quaternionRotateVector(
              orientation,
              node.baseVector
            )
          );

        node.targetPosition.x =
          vector[0] *
          CONFIG.constellationRadiusX;

        node.targetPosition.y =
          vector[1] *
          CONFIG.constellationRadiusY;

        node.targetPosition.z =
          vector[2] *
          CONFIG.constellationRadiusZ;

        const depth =
          (
            vector[2] + 1
          ) /
          2;

        node.targetScale =
          CONFIG.largeBaseScale *
          lerp(
            CONFIG.rearScaleMultiplier,
            CONFIG.frontScaleMultiplier,
            depth
          );

        node.targetOpacity =
          state.held
            ? 0.56
            : lerp(
                0.72,
                1,
                depth
              );

        node.targetProminence =
          state.held
            ? 0.58
            : lerp(
                0.72,
                1.16,
                depth
              );

        node.targetHalo =
          state.held
            ? 0.22
            : lerp(
                0.42,
                1.02,
                depth
              );

        node.visible =
          true;

        continue;
      }

      const clusterActive =
        node.clusterId ===
        state.activeClusterId;

      const clusterQuaternion =
        state.clusterOrientations.get(
          node.clusterId
        ) ||
        [0, 0, 0, 1];

      const vector =
        normalizeVector(
          quaternionRotateVector(
            clusterQuaternion,
            node.baseVector
          )
        );

      const radius =
        radiusForCluster(
          node.clusterId
        );

      node.targetPosition.x =
        vector[0] *
        radius.x;

      node.targetPosition.y =
        vector[1] *
        radius.y;

      node.targetPosition.z =
        vector[2] *
        radius.z +
        0.10;

      const depth =
        (
          vector[2] + 1
        ) /
          2;

      node.targetScale =
        clusterActive
          ? (
              CONFIG.childBaseScale *
              CONFIG.activeClusterScaleMultiplier *
              lerp(
                CONFIG.rearScaleMultiplier,
                CONFIG.frontScaleMultiplier,
                depth
              )
            )
          : CONFIG.inactiveChildScale;

      node.targetOpacity =
        clusterActive
          ? (
              state.held
                ? 0.48
                : lerp(
                    0.68,
                    1,
                    depth
                  )
            )
          : 0;

      node.targetProminence =
        clusterActive
          ? (
              state.held
                ? 0.50
                : lerp(
                    0.68,
                    1.12,
                    depth
                  )
            )
          : 0;

      node.targetHalo =
        clusterActive
          ? (
              state.held
                ? 0.18
                : lerp(
                    0.38,
                    0.92,
                    depth
                  )
            )
          : 0;

      node.visible =
        clusterActive ||
        node.opacity > 0.03;
    }
  }

  function updateInterpolatedState(
    deltaSeconds,
    now
  ) {
    const speed =
      state.reducedMotion
        ? CONFIG
            .reducedMotionInterpolationSpeed
        : CONFIG.interpolationSpeed;

    const amount =
      clamp(
        deltaSeconds *
        speed,
        0,
        1
      );

    state.orientation =
      quaternionSlerp(
        state.orientation,
        state.targetOrientation,
        amount
      );

    for (
      const [
        clusterId,
        target
      ]
      of state
        .clusterTargetOrientations
        .entries()
    ) {
      const current =
        state.clusterOrientations.get(
          clusterId
        ) ||
        [0, 0, 0, 1];

      state.clusterOrientations.set(
        clusterId,
        quaternionSlerp(
          current,
          target,
          amount
        )
      );
    }

    updateNodeTargets();

    for (
      const node
      of state.nodes.values()
    ) {
      node.worldPosition.x =
        lerp(
          node.worldPosition.x,
          node.targetPosition.x,
          amount
        );

      node.worldPosition.y =
        lerp(
          node.worldPosition.y,
          node.targetPosition.y,
          amount
        );

      node.worldPosition.z =
        lerp(
          node.worldPosition.z,
          node.targetPosition.z,
          amount
        );

      node.scale =
        lerp(
          node.scale,
          node.targetScale,
          amount
        );

      node.opacity =
        lerp(
          node.opacity,
          node.targetOpacity,
          amount
        );

      node.prominence =
        lerp(
          node.prominence,
          node.targetProminence,
          amount
        );

      node.halo =
        lerp(
          node.halo,
          node.targetHalo,
          amount
        );

      if (
        !state.reducedMotion &&
        !state.pageScrolling
      ) {
        const speedMultiplier =
          node.size ===
          NODE_TYPES.LARGE
            ? CONFIG.idleRotationSpeed
            : CONFIG.childRotationSpeed;

        node.localRotationZ +=
          deltaSeconds *
          speedMultiplier;

        node.localRotationY =
          Math.sin(
            now *
            0.00042 +
            node.phase
          ) *
          0.16;

        node.localRotationX =
          Math.sin(
            now *
            0.00031 +
            node.phase * 0.73
          ) *
          0.10;
      } else if (
        state.reducedMotion
      ) {
        node.localRotationX = 0;
        node.localRotationY = 0;
      }
    }
  }

  function isNodeSettled(node) {
    return (
      nearlyEqual(
        node.worldPosition.x,
        node.targetPosition.x,
        CONFIG.settlementPositionEpsilon
      ) &&
      nearlyEqual(
        node.worldPosition.y,
        node.targetPosition.y,
        CONFIG.settlementPositionEpsilon
      ) &&
      nearlyEqual(
        node.worldPosition.z,
        node.targetPosition.z,
        CONFIG.settlementPositionEpsilon
      ) &&
      nearlyEqual(
        node.scale,
        node.targetScale,
        CONFIG.settlementScalarEpsilon
      ) &&
      nearlyEqual(
        node.opacity,
        node.targetOpacity,
        CONFIG.settlementScalarEpsilon
      ) &&
      nearlyEqual(
        node.prominence,
        node.targetProminence,
        CONFIG.settlementScalarEpsilon
      ) &&
      nearlyEqual(
        node.halo,
        node.targetHalo,
        CONFIG.settlementScalarEpsilon
      )
    );
  }

  function isSceneSettled() {
    if (
      quaternionDistance(
        state.orientation,
        state.targetOrientation
      ) >
      CONFIG.settlementQuaternionEpsilon
    ) {
      return false;
    }

    for (
      const [
        clusterId,
        target
      ]
      of state
        .clusterTargetOrientations
        .entries()
    ) {
      const current =
        state.clusterOrientations.get(
          clusterId
        ) ||
        [0, 0, 0, 1];

      if (
        quaternionDistance(
          current,
          target
        ) >
        CONFIG.settlementQuaternionEpsilon
      ) {
        return false;
      }
    }

    for (
      const node
      of state.nodes.values()
    ) {
      if (!isNodeSettled(node)) {
        return false;
      }
    }

    return true;
  }

  function rotateLocalVertex(
    vertex,
    node
  ) {
    const x0 =
      vertex[0] *
      node.scale;

    const y0 =
      vertex[1] *
      node.scale;

    const z0 =
      vertex[2] *
      node.scale *
      42;

    const cosX =
      Math.cos(
        node.localRotationX
      );

    const sinX =
      Math.sin(
        node.localRotationX
      );

    const y1 =
      y0 * cosX -
      z0 * sinX;

    const z1 =
      y0 * sinX +
      z0 * cosX;

    const cosY =
      Math.cos(
        node.localRotationY
      );

    const sinY =
      Math.sin(
        node.localRotationY
      );

    const x2 =
      x0 * cosY +
      z1 * sinY;

    const z2 =
      -x0 * sinY +
      z1 * cosY;

    const cosZ =
      Math.cos(
        node.localRotationZ
      );

    const sinZ =
      Math.sin(
        node.localRotationZ
      );

    return Object.freeze({
      x:
        x2 * cosZ -
        y1 * sinZ,

      y:
        x2 * sinZ +
        y1 * cosZ,

      z:
        z2
    });
  }

  function projectLocalVertex(
    vertex,
    node,
    center
  ) {
    const rotated =
      rotateLocalVertex(
        vertex,
        node
      );

    const perspective =
      clamp(
        1 +
        rotated.z *
        0.004,
        0.72,
        1.34
      );

    return Object.freeze({
      x:
        center.x +
        rotated.x *
        perspective,

      y:
        center.y +
        rotated.y *
        perspective,

      depth:
        rotated.z
    });
  }

  function faceFill(
    face,
    palette,
    faceIndex
  ) {
    switch (face.band) {
      case "front-highlight":
        return palette.highlight;

      case "front-core":
        return faceIndex % 2
          ? palette.core
          : palette.middle;

      case "front-edge":
        return palette.edge;

      case "front-middle":
        return faceIndex % 3
          ? palette.middle
          : palette.core;

      case "rear-edge":
        return palette.edge;

      case "rear-middle":
        return palette.shadow;

      case "rear-shadow":
      default:
        return palette.shadow;
    }
  }

  function drawHalo(
    context,
    node,
    center,
    radius,
    palette
  ) {
    if (
      node.halo <= 0.01 ||
      node.opacity <= 0.01
    ) {
      return;
    }

    const haloRadius =
      radius *
      CONFIG.haloExpansion *
      (
        1 +
        node.halo * 0.20
      );

    const gradient =
      context.createRadialGradient(
        center.x,
        center.y,
        radius * 0.24,
        center.x,
        center.y,
        haloRadius
      );

    gradient.addColorStop(
      0,
      palette.halo
    );

    gradient.addColorStop(
      0.45,
      palette.halo
    );

    gradient.addColorStop(
      1,
      "rgba(0, 0, 0, 0)"
    );

    context.save();

    context.globalAlpha =
      clamp(
        node.opacity *
        node.halo,
        0,
        1
      );

    context.fillStyle =
      gradient;

    context.beginPath();

    context.arc(
      center.x,
      center.y,
      haloRadius,
      0,
      Math.PI * 2
    );

    context.fill();

    context.restore();
  }

  function drawFacetedCrystal(
    context,
    node,
    projection
  ) {
    const geometry =
      state.geometries.get(
        node.geometryType
      );

    if (!geometry) {
      return;
    }

    const palette =
      paletteForNode(node);

    const center =
      projection.screen;

    const projectedVertices =
      geometry.vertices.map(
        vertex =>
          projectLocalVertex(
            vertex,
            node,
            center
          )
      );

    const sortedFaces =
      geometry.faces
        .map(
          (
            face,
            index
          ) => {
            const a =
              projectedVertices[
                face.indices[0]
              ];

            const b =
              projectedVertices[
                face.indices[1]
              ];

            const c =
              projectedVertices[
                face.indices[2]
              ];

            return {
              face,
              index,
              depth:
                (
                  a.depth +
                  b.depth +
                  c.depth
                ) /
                3
            };
          }
        )
        .sort(
          (
            a,
            b
          ) =>
            a.depth -
            b.depth
        );

    const radius =
      geometry.radius *
      node.scale;

    drawHalo(
      context,
      node,
      center,
      radius,
      palette
    );

    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    context.shadowColor =
      palette.halo;

    context.shadowBlur =
      node.halo *
      8;

    for (
      const entry
      of sortedFaces
    ) {
      const face =
        entry.face;

      const a =
        projectedVertices[
          face.indices[0]
        ];

      const b =
        projectedVertices[
          face.indices[1]
        ];

      const c =
        projectedVertices[
          face.indices[2]
        ];

      const highlight =
        clamp(
          (
            entry.depth +
            radius
          ) /
          (
            radius * 2
          ),
          0,
          1
        );

      context.beginPath();

      context.moveTo(
        a.x,
        a.y
      );

      context.lineTo(
        b.x,
        b.y
      );

      context.lineTo(
        c.x,
        c.y
      );

      context.closePath();

      context.fillStyle =
        faceFill(
          face,
          palette,
          entry.index
        );

      context.globalAlpha =
        clamp(
          node.opacity *
          (
            0.72 +
            highlight * 0.28
          ),
          0,
          1
        );

      context.fill();

      context.strokeStyle =
        entry.depth > 0
          ? "rgba(255, 255, 255, 0.22)"
          : "rgba(6, 18, 42, 0.30)";

      context.lineWidth =
        node.size ===
        NODE_TYPES.LARGE
          ? 0.72
          : 0.56;

      context.stroke();
    }

    const shine =
      context.createLinearGradient(
        center.x -
        radius * 0.72,
        center.y -
        radius * 0.72,
        center.x +
        radius * 0.72,
        center.y +
        radius * 0.72
      );

    shine.addColorStop(
      0,
      "rgba(255,255,255,0)"
    );

    shine.addColorStop(
      0.42,
      "rgba(255,255,255,0.04)"
    );

    shine.addColorStop(
      0.50,
      "rgba(255,255,255,0.52)"
    );

    shine.addColorStop(
      0.58,
      "rgba(255,255,255,0.04)"
    );

    shine.addColorStop(
      1,
      "rgba(255,255,255,0)"
    );

    context.globalAlpha =
      clamp(
        node.opacity *
        node.prominence *
        0.76,
        0,
        0.92
      );

    context.strokeStyle =
      shine;

    context.lineWidth =
      node.size ===
      NODE_TYPES.LARGE
        ? 2.1
        : 1.5;

    context.beginPath();

    context.moveTo(
      center.x -
      radius * 0.52,
      center.y +
      radius * 0.42
    );

    context.lineTo(
      center.x +
      radius * 0.48,
      center.y -
      radius * 0.48
    );

    context.stroke();

    context.restore();
  }

  function isProjectionStrictlyInsideField(
    projection,
    size
  ) {
    if (
      !projection ||
      !projection.visible ||
      !projection.screen
    ) {
      return false;
    }

    const width =
      projection.viewport &&
      Number.isFinite(
        projection.viewport.width
      )
        ? projection.viewport.width
        : state.orbitField.clientWidth;

    const height =
      projection.viewport &&
      Number.isFinite(
        projection.viewport.height
      )
        ? projection.viewport.height
        : state.orbitField.clientHeight;

    const radius =
      size * 0.5;

    const padding =
      CONFIG.semanticViewportPadding;

    return (
      projection.screen.x -
        radius >=
        padding &&
      projection.screen.y -
        radius >=
        padding &&
      projection.screen.x +
        radius <=
        width -
        padding &&
      projection.screen.y +
        radius <=
        height -
        padding
    );
  }

  function disableSemanticControl(node) {
    const element =
      node.semanticElement;

    if (!element) {
      return;
    }

    const cache =
      node.lastSemantic;

    if (
      cache.visible === false &&
      cache.interactive === false
    ) {
      state.counters.semanticWritesSkipped +=
        1;

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

    cache.visible =
      false;

    cache.interactive =
      false;

    state.counters.semanticUpdates +=
      1;
  }

  function syncSemanticControl(
    node,
    projection
  ) {
    const element =
      node.semanticElement;

    if (
      !element ||
      !state.orbitField.contains(
        element
      )
    ) {
      return;
    }

    if (
      !node.visible ||
      node.opacity <= 0.025 ||
      !projection ||
      !projection.visible
    ) {
      disableSemanticControl(node);

      return;
    }

    const baseSize =
      node.size ===
      NODE_TYPES.LARGE
        ? CONFIG.semanticLargeSize
        : CONFIG.semanticChildSize;

    const size =
      Math.max(
        CONFIG.semanticMinimumSize,
        baseSize *
        clamp(
          node.scale,
          0.64,
          1.35
        )
      );

    if (
      !isProjectionStrictlyInsideField(
        projection,
        size
      )
    ) {
      state.counters
        .semanticRejectedOutsideField +=
        1;

      disableSemanticControl(node);

      return;
    }

    const x =
      projection.screen.x;

    const y =
      projection.screen.y;

    const interactive =
      !state.held &&
      state.sceneVisible &&
      state.documentVisible &&
      !state.pageScrolling;

    const cache =
      node.lastSemantic;

    const positionChanged =
      !nearlyEqual(
        cache.x,
        x,
        CONFIG.semanticWriteTolerance
      ) ||
      !nearlyEqual(
        cache.y,
        y,
        CONFIG.semanticWriteTolerance
      );

    const sizeChanged =
      !nearlyEqual(
        cache.size,
        size,
        CONFIG.semanticWriteTolerance
      );

    const stateChanged =
      cache.visible !== true ||
      cache.interactive !== interactive;

    if (
      !positionChanged &&
      !sizeChanged &&
      !stateChanged
    ) {
      state.counters.semanticWritesSkipped +=
        1;

      return;
    }

    element.style.position =
      "absolute";

    element.style.left =
      `${x}px`;

    element.style.top =
      `${y}px`;

    element.style.right =
      "auto";

    element.style.bottom =
      "auto";

    element.style.width =
      `${size}px`;

    element.style.height =
      `${size}px`;

    element.style.margin =
      "0";

    element.style.transform =
      "translate(-50%, -50%)";

    element.style.opacity =
      "1";

    element.style.pointerEvents =
      interactive
        ? "auto"
        : "none";

    element.style.background =
      "transparent";

    element.style.borderColor =
      "transparent";

    element.style.boxShadow =
      "none";

    element.style.color =
      "transparent";

    element.style.webkitTapHighlightColor =
      "transparent";

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

    element.setAttribute(
      ATTRIBUTES.fallbackRendering,
      "hidden"
    );

    cache.visible =
      true;

    cache.interactive =
      interactive;

    cache.x =
      x;

    cache.y =
      y;

    cache.size =
      size;

    state.counters.semanticUpdates +=
      1;
  }

  function drawNode({
    context,
    projection
  }, node) {
    if (
      state.disposed ||
      state.failed ||
      !node.visible ||
      node.opacity <= 0.015
    ) {
      return;
    }

    drawFacetedCrystal(
      context,
      node,
      projection
    );

    state.counters.drawCalls +=
      1;
  }

  function positionSemanticControls() {
    if (
      !state.compositor ||
      typeof state.compositor
        .projectWorldToScreen !==
        "function"
    ) {
      return;
    }

    let visibleCount = 0;

    for (
      const node
      of state.nodes.values()
    ) {
      if (
        !node.visible ||
        node.opacity <= 0.025
      ) {
        disableSemanticControl(
          node
        );

        continue;
      }

      const projection =
        state.compositor
          .projectWorldToScreen(
            node.worldPosition
          );

      syncSemanticControl(
        node,
        projection
      );

      if (
        projection &&
        projection.visible
      ) {
        visibleCount += 1;
      }
    }

    state.counters.visibleNodes =
      visibleCount;
  }

  function nodeMetadata(node) {
    return Object.freeze({
      objectId:
        node.id,

      size:
        node.size,

      behavior:
        node.behavior,

      clusterId:
        node.clusterId ||
        null,

      geometry:
        node.geometryType,

      materialFamily:
        node.materialFamily,

      opacity:
        node.opacity,

      scale:
        node.scale,

      prominence:
        node.prominence,

      halo:
        node.halo
    });
  }

  function registerNode(node) {
    if (
      !state.compositor ||
      typeof state.compositor
        .registerNode !==
        "function"
    ) {
      throw new Error(
        "SHOWROOM_COMPOSITOR.registerNode() is unavailable."
      );
    }

    const registration =
      state.compositor.registerNode({
        id:
          node.id,

        owner:
          OWNER,

        getWorldPosition() {
          return {
            x:
              node.worldPosition.x,

            y:
              node.worldPosition.y,

            z:
              node.worldPosition.z
          };
        },

        isVisible() {
          return (
            node.visible &&
            node.opacity > 0.015
          );
        },

        getSortBias() {
          return node.size ===
            NODE_TYPES.LARGE
            ? 0.005
            : 0.012;
        },

        getMetadata() {
          return nodeMetadata(
            node
          );
        },

        draw(drawContext) {
          drawNode(
            drawContext,
            node
          );
        },

        hysteresis:
          node.size ===
          NODE_TYPES.LARGE
            ? 0.09
            : 0.07
      });

    node.registration =
      registration;

    state.registrations.set(
      node.id,
      registration
    );

    state.counters.registeredNodes +=
      1;
  }

  function unregisterAllNodes() {
    for (
      const [
        nodeId,
        registration
      ]
      of state.registrations
        .entries()
    ) {
      try {
        if (
          registration &&
          typeof registration.unregister ===
            "function"
        ) {
          registration.unregister();
        } else if (
          state.compositor &&
          typeof state.compositor
            .unregisterNode ===
            "function"
        ) {
          state.compositor.unregisterNode(
            nodeId
          );
        }
      } catch {
        /* Best-effort rollback. */
      }
    }

    state.registrations.clear();
    state.counters.registeredNodes = 0;
  }

  function requestCompositorFrame(
    reason
  ) {
    if (
      state.disposed ||
      state.failed ||
      isRenderingSuspended()
    ) {
      return false;
    }

    if (
      state.compositor &&
      typeof state.compositor
        .requestFrame ===
        "function"
    ) {
      state.compositor.requestFrame(
        reason
      );

      return true;
    }

    window.dispatchEvent(
      new CustomEvent(
        EVENTS.compositorRequestFrame,
        {
          detail:
            Object.freeze({
              reason,

              source:
                CONTRACT
            })
        }
      )
    );

    return true;
  }

  function isRenderingSuspended() {
    return (
      !state.sceneVisible ||
      !state.documentVisible ||
      state.pageScrolling
    );
  }

  function reflectSuspensionState() {
    const suspended =
      isRenderingSuspended();

    setRootAttribute(
      ATTRIBUTES.sceneVisible,
      state.sceneVisible
        ? "true"
        : "false"
    );

    setRootAttribute(
      ATTRIBUTES.suspended,
      suspended
        ? "true"
        : "false"
    );

    for (
      const node
      of state.nodes.values()
    ) {
      if (suspended) {
        disableSemanticControl(
          node
        );
      }
    }
  }

  function stopAnimationLoop() {
    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );

      state.raf = 0;
    }

    state.lastTime = 0;
  }

  function ensureAnimation(
    reason = "state-change"
  ) {
    if (
      state.failed ||
      state.disposed ||
      !state.ready
    ) {
      return false;
    }

    state.dirty = true;

    reflectSuspensionState();

    if (isRenderingSuspended()) {
      stopAnimationLoop();

      return false;
    }

    if (!state.running) {
      state.running = true;
      state.lastTime = 0;
      state.counters.resumedAnimations +=
        1;

      state.raf =
        requestAnimationFrame(
          animate
        );
    }

    requestCompositorFrame(
      reason
    );

    return true;
  }

  function shouldContinueAnimating() {
    if (
      isRenderingSuspended() ||
      state.held
    ) {
      return false;
    }

    if (state.interactionActive) {
      return true;
    }

    if (!isSceneSettled()) {
      return true;
    }

    if (
      !state.reducedMotion &&
      state.sceneVisible &&
      state.documentVisible &&
      !state.pageScrolling
    ) {
      return true;
    }

    return false;
  }

  function animate(now) {
    state.raf = 0;

    if (
      !state.running ||
      state.disposed ||
      state.failed ||
      isRenderingSuspended()
    ) {
      state.counters.suspendedFrames +=
        1;

      stopAnimationLoop();

      return;
    }

    const seconds =
      now * 0.001;

    const delta =
      state.lastTime
        ? clamp(
            seconds -
            state.lastTime,
            0,
            0.05
          )
        : 0.016;

    state.lastTime =
      seconds;

    updateRootState();

    updateInterpolatedState(
      delta,
      now
    );

    positionSemanticControls();

    requestCompositorFrame(
      "crystal-animation"
    );

    state.dirty = false;

    if (
      shouldContinueAnimating()
    ) {
      state.raf =
        requestAnimationFrame(
          animate
        );

      return;
    }

    stopAnimationLoop();
  }

  function handleOrbitMotion(event) {
    if (
      state.disposed ||
      state.failed ||
      state.held
    ) {
      return;
    }

    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    const quaternion =
      quaternionFromObject(
        detail.quaternion
      );

    const activeClusterId =
      normalize(
        detail.activeClusterId
      );

    if (
      detail.mode === "cluster" ||
      detail.mode ===
        "cluster-child" ||
      detail.mode ===
        "cluster-parent"
    ) {
      const clusterId =
        activeClusterId ||
        state.activeClusterId;

      if (clusterId) {
        const current =
          state.clusterTargetOrientations
            .get(clusterId) ||
          [0, 0, 0, 1];

        state.clusterTargetOrientations
          .set(
            clusterId,
            quaternionMultiply(
              quaternion,
              current
            )
          );
      }
    } else {
      state.targetOrientation =
        quaternionMultiply(
          quaternion,
          state.targetOrientation
        );
    }

    state.counters.motionEvents += 1;

    ensureAnimation(
      "interaction-motion"
    );
  }

  function handleMotionStart() {
    state.interactionActive =
      true;

    ensureAnimation(
      "interaction-motion-start"
    );
  }

  function handleMotionEnd() {
    state.interactionActive =
      false;

    ensureAnimation(
      "interaction-motion-end"
    );
  }

  function handleClusterChanged(
    event
  ) {
    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    state.activeClusterId =
      detail.expanded
        ? normalize(
            detail.clusterId
          )
        : (
            state.activeClusterId ===
            normalize(
              detail.clusterId
            )
              ? ""
              : state.activeClusterId
          );

    updateNodeTargets();

    ensureAnimation(
      "cluster-state-changed"
    );
  }

  function handleDocumentVisibility() {
    state.documentVisible =
      !document.hidden;

    reflectSuspensionState();

    if (state.documentVisible) {
      ensureAnimation(
        "document-visible"
      );
    } else {
      stopAnimationLoop();
    }
  }

  function handlePageScroll() {
    if (
      state.disposed ||
      state.failed
    ) {
      return;
    }

    state.pageScrolling =
      true;

    reflectSuspensionState();
    stopAnimationLoop();

    if (state.scrollResumeTimer) {
      clearTimeout(
        state.scrollResumeTimer
      );
    }

    state.scrollResumeTimer =
      window.setTimeout(
        () => {
          state.scrollResumeTimer = 0;
          state.pageScrolling = false;

          reflectSuspensionState();

          ensureAnimation(
            "page-scroll-ended"
          );
        },
        CONFIG.pageScrollPauseMs
      );
  }

  function initializeVisibilityObserver() {
    if (
      "IntersectionObserver" in
      window
    ) {
      const observer =
        new IntersectionObserver(
          entries => {
            const entry =
              entries[0];

            if (!entry) {
              return;
            }

            const visible =
              entry.isIntersecting &&
              entry.intersectionRatio >=
                CONFIG.intersectionThreshold;

            if (
              state.sceneVisible ===
              visible
            ) {
              return;
            }

            state.sceneVisible =
              visible;

            reflectSuspensionState();

            if (visible) {
              ensureAnimation(
                "scene-visible"
              );
            } else {
              stopAnimationLoop();
            }

            publishReceipt(
              visible
                ? "scene-visible"
                : "scene-hidden"
            );
          },
          {
            root:
              null,

            threshold:
              [
                0,
                CONFIG.intersectionThreshold,
                0.25,
                0.75
              ]
          }
        );

      observer.observe(
        state.orbitField
      );

      addObserver(observer);

      return;
    }

    state.sceneVisible =
      true;
  }

  function initializeRootObserver() {
    if (!state.root) {
      return;
    }

    const observer =
      new MutationObserver(
        () => {
          updateRootState();
          updateNodeTargets();

          ensureAnimation(
            "root-state-mutated"
          );
        }
      );

    observer.observe(
      state.root,
      {
        attributes:
          true,

        attributeFilter:
          [
            ATTRIBUTES.activeCluster,
            ATTRIBUTES.reducedMotion,
            ATTRIBUTES.held
          ]
      }
    );

    addObserver(observer);
  }

  function setFallbackPaintVisible(
    visible
  ) {
    const fallbackStars =
      Array.from(
        state.orbitField
          .querySelectorAll(
            SELECTORS.fallbackStar
          )
      );

    const fallbackLayers =
      Array.from(
        state.orbitField
          .querySelectorAll(
            [
              SELECTORS.primaryLayer,
              SELECTORS.cluster
            ].join(",")
          )
      );

    for (
      const star
      of fallbackStars
    ) {
      star.setAttribute(
        ATTRIBUTES.fallbackRendering,
        visible
          ? "visible"
          : "hidden"
      );

      if (visible) {
        star.style.removeProperty(
          "opacity"
        );

        star.style.removeProperty(
          "pointer-events"
        );

        star.style.removeProperty(
          "background"
        );

        star.style.removeProperty(
          "border-color"
        );

        star.style.removeProperty(
          "box-shadow"
        );

        star.style.removeProperty(
          "color"
        );
      }
    }

    for (
      const layer
      of fallbackLayers
    ) {
      layer.setAttribute(
        ATTRIBUTES.fallbackVisibility,
        visible
          ? "visible"
          : "semantic-only"
      );
    }

    setRootAttribute(
      ATTRIBUTES.ready,
      visible
        ? "false"
        : "true"
    );
  }

  function resolveCompositor() {
    const compositor =
      window.SHOWROOM_COMPOSITOR;

    if (
      !compositor ||
      typeof compositor
        .registerNode !==
        "function" ||
      typeof compositor
        .projectWorldToScreen !==
        "function" ||
      typeof compositor
        .requestFrame !==
        "function"
    ) {
      return false;
    }

    state.compositor =
      compositor;

    return true;
  }

  function completeReadiness() {
    if (
      state.ready ||
      state.failed ||
      state.disposed
    ) {
      return;
    }

    if (
      state.registrations.size !==
      state.nodes.size
    ) {
      throw new Error(
        "Not every crystal node was registered with the compositor."
      );
    }

    state.ready = true;

    setRootAttribute(
      ATTRIBUTES.ready,
      "true"
    );

    setRootAttribute(
      ATTRIBUTES.state,
      "ready"
    );

    setFallbackPaintVisible(
      false
    );

    reflectSuspensionState();

    publishReceipt(
      "ready"
    );

    dispatch(
      EVENTS.ready,
      {
        nodeCount:
          state.nodes.size,

        largeNodeCount:
          state.counters.largeNodes,

        smallNodeCount:
          state.counters.smallNodes,

        geometryCount:
          state.geometries.size,

        semanticControlsAssociated:
          state.semanticObjects.size
      }
    );

    ensureAnimation(
      "initial-animation"
    );
  }

  function registerAllNodes() {
    unregisterAllNodes();

    for (
      const node
      of state.nodes.values()
    ) {
      registerNode(node);
    }

    completeReadiness();
  }

  function attemptCompositorConnection() {
    if (
      state.disposed ||
      state.failed ||
      state.ready
    ) {
      return;
    }

    if (!resolveCompositor()) {
      return;
    }

    try {
      registerAllNodes();
    } catch (error) {
      fail(error);
    }
  }

  function validateDom() {
    const issues = [];

    if (!state.root) {
      issues.push(
        "Missing [data-showroom-root]."
      );
    }

    if (!state.orbitField) {
      issues.push(
        "Missing [data-showroom-orbit-field]."
      );
    }

    if (!state.receipt) {
      issues.push(
        "Missing [data-showroom-crystals-receipt]."
      );
    }

    if (issues.length) {
      throw new Error(
        issues.join(" ")
      );
    }
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    state.receipt =
      document.querySelector(
        SELECTORS.receipt
      );

    state.orbitField =
      document.querySelector(
        SELECTORS.orbitField
      );
  }

  function initializeClusterOrientations() {
    state.clusterOrientations.set(
      "gauges",
      [0, 0, 0, 1]
    );

    state.clusterTargetOrientations.set(
      "gauges",
      [0, 0, 0, 1]
    );

    state.clusterOrientations.set(
      "information",
      [0, 0, 0, 1]
    );

    state.clusterTargetOrientations.set(
      "information",
      [0, 0, 0, 1]
    );
  }

  function initializeEvents() {
    addListener(
      window,
      EVENTS.compositorReady,
      attemptCompositorConnection
    );

    addListener(
      window,
      EVENTS.compositorFailed,
      () => {
        fail(
          new Error(
            "The Showroom compositor reported a failure."
          )
        );
      }
    );

    addListener(
      window,
      EVENTS.compositorDisposed,
      () => {
        if (
          !state.disposed
        ) {
          fail(
            new Error(
              "The Showroom compositor was disposed while crystals were active."
            )
          );
        }
      }
    );

    addListener(
      window,
      EVENTS.orbitMotion,
      handleOrbitMotion
    );

    addListener(
      window,
      EVENTS.orbitMotionStart,
      handleMotionStart
    );

    addListener(
      window,
      EVENTS.orbitMotionEnd,
      handleMotionEnd
    );

    addListener(
      window,
      EVENTS.clusterChanged,
      handleClusterChanged
    );

    addListener(
      window,
      EVENTS.stateChanged,
      () => {
        updateRootState();
        updateNodeTargets();

        ensureAnimation(
          "controller-state-changed"
        );
      }
    );

    addListener(
      document,
      "visibilitychange",
      handleDocumentVisibility
    );

    addListener(
      window,
      "scroll",
      handlePageScroll,
      {
        passive:
          true
      }
    );

    addListener(
      window,
      "orientationchange",
      () => {
        ensureAnimation(
          "orientation-change"
        );
      }
    );
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        getState() {
          return createReceipt(
            "state-requested",
            {
              nodeIds:
                Object.freeze(
                  Array.from(
                    state.nodes.keys()
                  )
                ),

              geometryTypes:
                Object.freeze(
                  Array.from(
                    state.geometries.keys()
                  )
                ),

              orientation:
                Object.freeze(
                  state.orientation.slice()
                ),

              targetOrientation:
                Object.freeze(
                  state.targetOrientation
                    .slice()
                )
            }
          );
        },

        getNode(nodeId) {
          const node =
            state.nodes.get(
              normalize(nodeId)
            );

          if (!node) {
            return null;
          }

          return Object.freeze({
            id:
              node.id,

            size:
              node.size,

            behavior:
              node.behavior,

            clusterId:
              node.clusterId,

            geometryType:
              node.geometryType,

            materialFamily:
              node.materialFamily,

            worldPosition:
              Object.freeze({
                ...node.worldPosition
              }),

            visible:
              node.visible,

            opacity:
              node.opacity,

            scale:
              node.scale
          });
        },

        refresh() {
          updateRootState();
          updateNodeTargets();
          positionSemanticControls();

          ensureAnimation(
            "crystals-api-refresh"
          );

          return createReceipt(
            "api-refresh"
          );
        },

        start() {
          return ensureAnimation(
            "api-start"
          );
        },

        stop() {
          stopAnimationLoop();

          return true;
        },

        dispose
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

  function resetSemanticElement(
    node
  ) {
    const element =
      node.semanticElement;

    if (!element) {
      return;
    }

    const properties = [
      "left",
      "top",
      "right",
      "bottom",
      "width",
      "height",
      "margin",
      "transform",
      "position",
      "opacity",
      "pointer-events",
      "background",
      "border-color",
      "box-shadow",
      "color",
      "-webkit-tap-highlight-color"
    ];

    for (
      const property
      of properties
    ) {
      element.style.removeProperty(
        property
      );
    }

    element.removeAttribute(
      "aria-hidden"
    );

    element.removeAttribute(
      ATTRIBUTES.fallbackRendering
    );

    node.lastSemantic.visible =
      false;

    node.lastSemantic.interactive =
      false;

    node.lastSemantic.x =
      NaN;

    node.lastSemantic.y =
      NaN;

    node.lastSemantic.size =
      NaN;
  }

  function rollbackAfterFailure() {
    stopAnimationLoop();
    unregisterAllNodes();
    setFallbackPaintVisible(true);

    for (
      const node
      of state.nodes.values()
    ) {
      resetSemanticElement(
        node
      );
    }

    if (
      state.compositorOwnedByCrystals &&
      state.compositor &&
      typeof state.compositor.dispose ===
        "function"
    ) {
      try {
        state.compositor.dispose();
      } catch {
        /* Best-effort ownership rollback. */
      }
    }
  }

  function fail(error) {
    if (
      state.failed ||
      state.disposed
    ) {
      return;
    }

    state.failed = true;
    state.ready = false;

    state.counters.failures += 1;

    if (state.readinessTimer) {
      clearTimeout(
        state.readinessTimer
      );

      state.readinessTimer = 0;
    }

    if (state.scrollResumeTimer) {
      clearTimeout(
        state.scrollResumeTimer
      );

      state.scrollResumeTimer = 0;
    }

    rollbackAfterFailure();

    setRootAttribute(
      ATTRIBUTES.ready,
      "false"
    );

    setRootAttribute(
      ATTRIBUTES.state,
      "failed"
    );

    const serialized =
      serializeError(error);

    publishReceipt(
      "failed",
      {
        error:
          serialized
      }
    );

    dispatch(
      EVENTS.failed,
      {
        error:
          serialized
      }
    );
  }

  function initialize() {
    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    try {
      discoverDom();
      validateDom();

      buildGeometries();
      discoverSemanticObjects();
      initializeClusterOrientations();

      updateRootState();
      updateNodeTargets();

      initializeRootObserver();
      initializeVisibilityObserver();
      initializeEvents();
      exposeApi();

      state.initialized = true;

      setRootAttribute(
        ATTRIBUTES.ready,
        "false"
      );

      setRootAttribute(
        ATTRIBUTES.state,
        "connecting"
      );

      setFallbackPaintVisible(
        true
      );

      reflectSuspensionState();

      publishReceipt(
        "initialized-awaiting-compositor"
      );

      attemptCompositorConnection();

      if (!state.ready) {
        state.readinessTimer =
          window.setTimeout(
            () => {
              if (
                !state.ready &&
                !state.failed &&
                !state.disposed
              ) {
                fail(
                  new Error(
                    "Timed out while waiting for the Showroom compositor."
                  )
                );
              }
            },
            CONFIG.readinessTimeoutMs
          );
      }
    } catch (error) {
      fail(error);
    }
  }

  function dispose() {
    if (state.disposed) {
      return;
    }

    state.disposed = true;
    state.ready = false;

    stopAnimationLoop();

    if (state.readinessTimer) {
      clearTimeout(
        state.readinessTimer
      );

      state.readinessTimer = 0;
    }

    if (state.scrollResumeTimer) {
      clearTimeout(
        state.scrollResumeTimer
      );

      state.scrollResumeTimer = 0;
    }

    unregisterAllNodes();

    for (
      const removeListener
      of state.listeners.splice(0)
    ) {
      try {
        removeListener();
      } catch {
        /* Best-effort disposal. */
      }
    }

    for (
      const observer
      of state.observers.splice(0)
    ) {
      try {
        observer.disconnect();
      } catch {
        /* Best-effort disposal. */
      }
    }

    setFallbackPaintVisible(
      true
    );

    for (
      const node
      of state.nodes.values()
    ) {
      resetSemanticElement(
        node
      );
    }

    setRootAttribute(
      ATTRIBUTES.ready,
      "false"
    );

    setRootAttribute(
      ATTRIBUTES.state,
      "disposed"
    );

    setRootAttribute(
      ATTRIBUTES.suspended,
      "true"
    );

    publishReceipt(
      "disposed"
    );

    dispatch(
      EVENTS.disposed
    );

    state.semanticObjects.clear();
    state.nodes.clear();
    state.geometries.clear();
    state.clusterOrientations.clear();
    state.clusterTargetOrientations.clear();

    try {
      delete window.SHOWROOM_CRYSTALS;
    } catch {
      /* Noncritical cleanup. */
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

  window.addEventListener(
    "pagehide",
    event => {
      if (!event.persisted) {
        dispose();
      }
    },
    {
      once:
        true
    }
  );
})();
