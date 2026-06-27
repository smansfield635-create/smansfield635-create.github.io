/* TARGET FILE: /assets/shared/mirrorland-window.geometry.js */
/* TNT FULL-FILE REPLACEMENT */
/* DIAMOND_GATE_BRIDGE_SHARED_MIRRORLAND_WINDOW_GEOMETRY_TNT_v1 */
/*
  Purpose:
  - Provide one reusable, frozen Mirrorland stained-glass geometry source.
  - Preserve the existing 21-pane Mirrorland Window design exactly.
  - Preserve the 480 × 720 design coordinate system.
  - Preserve the established frame, inner-window, rib, and pane geometry.
  - Allow bounded renderers to draw the same Window without duplicating
    its structural definitions.
  - Support the Compass Mirrorland renderer and the Jeeves estate-threshold
    renderer without transferring lifecycle ownership between them.

  Owns:
  - Mirrorland Window design dimensions
  - Mirrorland Window color definitions
  - immutable 21-pane definitions
  - immutable frame-rib segments
  - outer-window path construction
  - inner-window path construction
  - polygon tracing
  - reusable geometric bounds helpers
  - geometry validation
  - shared geometry receipt
  - frozen public geometry API

  Does not own:
  - canvas creation
  - canvas mounting
  - canvas sizing
  - device-pixel-ratio handling
  - animation timing
  - reveal or withdrawal state
  - renderer state
  - pane painting
  - gradients
  - light, shimmer, pulse, sparkle, or grain animation
  - Compass DOM contracts
  - Jeeves DOM contracts
  - Compass events
  - Jeeves threshold events
  - navigation
  - page access
  - conversation behavior
  - production, deployment, or public-release authority
*/

(() => {
  "use strict";

  const GLOBAL_NAME =
    "DGB_MIRRORLAND_WINDOW_GEOMETRY";

  const READY_EVENT =
    "dgb:mirrorland-window-geometry-ready";

  const ERROR_EVENT =
    "dgb:mirrorland-window-geometry-error";

  if (
    Object.prototype.hasOwnProperty.call(
      globalThis,
      GLOBAL_NAME
    )
  ) {
    return;
  }

  const CONTRACT = Object.freeze({
    id:
      "DIAMOND_GATE_BRIDGE_SHARED_MIRRORLAND_WINDOW_GEOMETRY_TNT_v1",

    file:
      "/assets/shared/mirrorland-window.geometry.js",

    version:
      "1.0.0",

    geometryClass:
      "IMMUTABLE_2D_CRYSTALLINE_STAINED_GLASS_GEOMETRY",

    design:
      "MIRRORLAND_WINDOW_21_PANE",

    paneCount:
      21,

    frameSegmentCount:
      2,

    coordinateSystem:
      "FIXED_480_BY_720_DESIGN_SPACE",

    sharedGeometry:
      true,

    renderer:
      false,

    selfMounting:
      false,

    canvasOwner:
      false,

    lifecycleOwner:
      false,

    compassAuthority:
      false,

    jeevesThresholdAuthority:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false,

    publicReleaseAuthorized:
      false
  });

  const DIMENSIONS = Object.freeze({
    designWidth:
      480,

    designHeight:
      720,

    centerX:
      240,

    centerY:
      360,

    outerTop:
      24,

    outerBottom:
      714,

    innerTop:
      48,

    innerBottom:
      682,

    dormantScale:
      0.30,

    focusedScale:
      1,

    dormantOpacity:
      0.38,

    focusedOpacity:
      1,

    leadWidthDormant:
      4.5,

    leadWidthFocused:
      8,

    innerLeadWidthDormant:
      1.4,

    innerLeadWidthFocused:
      4,

    ribWidthDormant:
      7,

    ribWidthFocused:
      14,

    ribHighlightWidthDormant:
      1.2,

    ribHighlightWidthFocused:
      3,

    maximumDevicePixelRatio:
      2
  });

  const COLOR_SOURCE = {
    frameNearBlack:
      [5, 8, 15],

    frameMid:
      [16, 22, 34],

    frameEdge:
      [37, 48, 68],

    leadDark:
      [17, 21, 29],

    leadLight:
      [69, 80, 101],

    cyan:
      [87, 210, 231],

    blue:
      [67, 112, 204],

    violet:
      [133, 83, 201],

    amber:
      [226, 164, 79],

    rose:
      [198, 85, 132],

    paleCyan:
      [161, 235, 244],

    paleBlue:
      [143, 181, 234],

    paleViolet:
      [184, 149, 232],

    paleAmber:
      [239, 202, 132],

    paleRose:
      [229, 151, 185]
  };

  const freezeColor = color =>
    Object.freeze([
      Number(color[0]),
      Number(color[1]),
      Number(color[2])
    ]);

  const COLORS = Object.freeze(
    Object.fromEntries(
      Object.entries(
        COLOR_SOURCE
      ).map(
        ([name, color]) => [
          name,
          freezeColor(color)
        ]
      )
    )
  );

  const clamp = (
    value,
    minimum,
    maximum
  ) => Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );

  const lerp = (
    start,
    end,
    amount
  ) => (
    start +
    (
      end -
      start
    ) *
    amount
  );

  const revealWeight = (
    revealAmount,
    dormantValue,
    focusedValue
  ) => lerp(
    dormantValue,
    focusedValue,
    clamp(
      revealAmount,
      0,
      1
    )
  );

  const rgba = (
    color,
    alpha
  ) => {
    if (
      !Array.isArray(color) ||
      color.length < 3
    ) {
      throw new TypeError(
        "MIRRORLAND_RGBA_COLOR_INVALID"
      );
    }

    return (
      `rgba(` +
      `${Number(color[0])}, ` +
      `${Number(color[1])}, ` +
      `${Number(color[2])}, ` +
      `${Number(alpha)}` +
      `)`
    );
  };

  const freezePoint = point => {
    if (
      !Array.isArray(point) ||
      point.length < 2
    ) {
      throw new TypeError(
        "MIRRORLAND_POINT_INVALID"
      );
    }

    const x =
      Number(point[0]);

    const y =
      Number(point[1]);

    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y)
    ) {
      throw new TypeError(
        "MIRRORLAND_POINT_COORDINATE_INVALID"
      );
    }

    return Object.freeze([
      x,
      y
    ]);
  };

  const freezePointCollection = points => {
    if (
      !Array.isArray(points) ||
      points.length < 2
    ) {
      throw new TypeError(
        "MIRRORLAND_POINT_COLLECTION_INVALID"
      );
    }

    return Object.freeze(
      points.map(
        freezePoint
      )
    );
  };

  const createPane = (
    id,
    color,
    points,
    options = {}
  ) => {
    const normalizedId =
      String(id || "")
        .trim();

    if (!normalizedId) {
      throw new TypeError(
        "MIRRORLAND_PANE_ID_MISSING"
      );
    }

    if (
      !Array.isArray(color) ||
      color.length < 3
    ) {
      throw new TypeError(
        `MIRRORLAND_PANE_COLOR_INVALID:${normalizedId}`
      );
    }

    const pane = {
      id:
        normalizedId,

      color:
        freezeColor(color),

      points:
        freezePointCollection(
          points
        ),

      alpha:
        Number(
          options.alpha ??
          0.70
        ),

      glow:
        Number(
          options.glow ??
          0.30
        ),

      depth:
        Number(
          options.depth ??
          0.5
        ),

      phase:
        Number(
          options.phase ??
          0
        ),

      grain:
        Number(
          options.grain ??
          0.12
        ),

      highlight:
        Number(
          options.highlight ??
          0.16
        )
    };

    [
      "alpha",
      "glow",
      "depth",
      "phase",
      "grain",
      "highlight"
    ].forEach(key => {
      if (
        !Number.isFinite(
          pane[key]
        )
      ) {
        throw new TypeError(
          `MIRRORLAND_PANE_OPTION_INVALID:${normalizedId}:${key}`
        );
      }
    });

    return Object.freeze(
      pane
    );
  };

  const PANE_SOURCE = Object.freeze([
    createPane(
      "crown-left",
      COLORS.paleCyan,
      [
        [240, 46],
        [164, 106],
        [204, 168],
        [240, 134]
      ],
      {
        alpha: 0.74,
        glow: 0.45,
        depth: 0.86,
        phase: 0.20
      }
    ),

    createPane(
      "crown-right",
      COLORS.paleViolet,
      [
        [240, 46],
        [240, 134],
        [278, 168],
        [318, 106]
      ],
      {
        alpha: 0.72,
        glow: 0.42,
        depth: 0.82,
        phase: 0.62
      }
    ),

    createPane(
      "upper-left-edge",
      COLORS.blue,
      [
        [164, 106],
        [98, 210],
        [154, 246],
        [204, 168]
      ],
      {
        alpha: 0.72,
        glow: 0.28,
        depth: 0.62,
        phase: 0.92
      }
    ),

    createPane(
      "upper-right-edge",
      COLORS.violet,
      [
        [318, 106],
        [278, 168],
        [326, 246],
        [382, 210]
      ],
      {
        alpha: 0.74,
        glow: 0.30,
        depth: 0.66,
        phase: 1.22
      }
    ),

    createPane(
      "upper-center-left",
      COLORS.cyan,
      [
        [204, 168],
        [154, 246],
        [216, 268],
        [240, 208],
        [240, 134]
      ],
      {
        alpha: 0.66,
        glow: 0.38,
        depth: 0.78,
        phase: 1.50
      }
    ),

    createPane(
      "upper-center-right",
      COLORS.rose,
      [
        [240, 134],
        [240, 208],
        [264, 268],
        [326, 246],
        [278, 168]
      ],
      {
        alpha: 0.68,
        glow: 0.36,
        depth: 0.76,
        phase: 1.84
      }
    ),

    createPane(
      "mid-left-high",
      COLORS.paleBlue,
      [
        [98, 210],
        [66, 332],
        [148, 338],
        [154, 246]
      ],
      {
        alpha: 0.68,
        glow: 0.25,
        depth: 0.56,
        phase: 2.20
      }
    ),

    createPane(
      "mid-left-inner",
      COLORS.violet,
      [
        [154, 246],
        [148, 338],
        [212, 334],
        [216, 268]
      ],
      {
        alpha: 0.74,
        glow: 0.30,
        depth: 0.72,
        phase: 2.52
      }
    ),

    createPane(
      "mid-center",
      COLORS.paleAmber,
      [
        [216, 268],
        [212, 334],
        [240, 382],
        [268, 334],
        [264, 268],
        [240, 208]
      ],
      {
        alpha: 0.70,
        glow: 0.48,
        depth: 0.90,
        phase: 2.92
      }
    ),

    createPane(
      "mid-right-inner",
      COLORS.cyan,
      [
        [264, 268],
        [268, 334],
        [332, 338],
        [326, 246]
      ],
      {
        alpha: 0.72,
        glow: 0.31,
        depth: 0.73,
        phase: 3.20
      }
    ),

    createPane(
      "mid-right-high",
      COLORS.blue,
      [
        [326, 246],
        [332, 338],
        [414, 332],
        [382, 210]
      ],
      {
        alpha: 0.68,
        glow: 0.26,
        depth: 0.57,
        phase: 3.58
      }
    ),

    createPane(
      "lower-left-edge",
      COLORS.rose,
      [
        [66, 332],
        [82, 470],
        [156, 446],
        [148, 338]
      ],
      {
        alpha: 0.72,
        glow: 0.25,
        depth: 0.58,
        phase: 3.90
      }
    ),

    createPane(
      "lower-left-center",
      COLORS.cyan,
      [
        [148, 338],
        [156, 446],
        [216, 430],
        [240, 382],
        [212, 334]
      ],
      {
        alpha: 0.70,
        glow: 0.34,
        depth: 0.75,
        phase: 4.20
      }
    ),

    createPane(
      "lower-right-center",
      COLORS.violet,
      [
        [268, 334],
        [240, 382],
        [264, 430],
        [324, 446],
        [332, 338]
      ],
      {
        alpha: 0.72,
        glow: 0.34,
        depth: 0.75,
        phase: 4.56
      }
    ),

    createPane(
      "lower-right-edge",
      COLORS.amber,
      [
        [332, 338],
        [324, 446],
        [398, 470],
        [414, 332]
      ],
      {
        alpha: 0.70,
        glow: 0.28,
        depth: 0.59,
        phase: 4.92
      }
    ),

    createPane(
      "lower-left-deep",
      COLORS.blue,
      [
        [82, 470],
        [116, 594],
        [192, 530],
        [156, 446]
      ],
      {
        alpha: 0.72,
        glow: 0.24,
        depth: 0.56,
        phase: 5.22
      }
    ),

    createPane(
      "lower-center-left",
      COLORS.paleViolet,
      [
        [156, 446],
        [192, 530],
        [240, 624],
        [240, 500],
        [216, 430]
      ],
      {
        alpha: 0.72,
        glow: 0.40,
        depth: 0.82,
        phase: 5.54
      }
    ),

    createPane(
      "lower-center-right",
      COLORS.paleRose,
      [
        [264, 430],
        [240, 500],
        [240, 624],
        [288, 530],
        [324, 446]
      ],
      {
        alpha: 0.72,
        glow: 0.40,
        depth: 0.82,
        phase: 5.88
      }
    ),

    createPane(
      "lower-right-deep",
      COLORS.cyan,
      [
        [324, 446],
        [288, 530],
        [364, 594],
        [398, 470]
      ],
      {
        alpha: 0.70,
        glow: 0.25,
        depth: 0.57,
        phase: 6.20
      }
    ),

    createPane(
      "base-left",
      COLORS.amber,
      [
        [116, 594],
        [168, 660],
        [240, 676],
        [240, 624],
        [192, 530]
      ],
      {
        alpha: 0.68,
        glow: 0.35,
        depth: 0.72,
        phase: 6.54
      }
    ),

    createPane(
      "base-right",
      COLORS.blue,
      [
        [288, 530],
        [240, 624],
        [240, 676],
        [312, 660],
        [364, 594]
      ],
      {
        alpha: 0.70,
        glow: 0.34,
        depth: 0.72,
        phase: 6.86
      }
    )
  ]);

  const FRAME_SEGMENTS = Object.freeze([
    freezePointCollection([
      [240, 34],
      [165, 78],
      [104, 144],
      [66, 232],
      [48, 350],
      [58, 482],
      [96, 590],
      [158, 662],
      [240, 694]
    ]),

    freezePointCollection([
      [240, 34],
      [315, 78],
      [376, 144],
      [414, 232],
      [432, 350],
      [422, 482],
      [384, 590],
      [322, 662],
      [240, 694]
    ])
  ]);

  const PANE_BY_ID = new Map(
    PANE_SOURCE.map(
      pane => [
        pane.id,
        pane
      ]
    )
  );

  const assertContext = context => {
    if (
      !context ||
      typeof context.beginPath !==
        "function" ||
      typeof context.moveTo !==
        "function" ||
      typeof context.lineTo !==
        "function"
    ) {
      throw new TypeError(
        "MIRRORLAND_DRAWING_CONTEXT_INVALID"
      );
    }
  };

  const tracePolygon = (
    context,
    points
  ) => {
    assertContext(
      context
    );

    if (
      !Array.isArray(points) ||
      !points.length
    ) {
      return false;
    }

    context.beginPath();

    context.moveTo(
      points[0][0],
      points[0][1]
    );

    for (
      let index = 1;
      index < points.length;
      index += 1
    ) {
      context.lineTo(
        points[index][0],
        points[index][1]
      );
    }

    context.closePath();

    return true;
  };

  const appendOuterWindow = context => {
    assertContext(
      context
    );

    if (
      typeof context.bezierCurveTo !==
        "function"
    ) {
      throw new TypeError(
        "MIRRORLAND_BEZIER_CONTEXT_INVALID"
      );
    }

    context.moveTo(
      240,
      24
    );

    context.bezierCurveTo(
      154,
      62,
      82,
      148,
      52,
      258
    );

    context.bezierCurveTo(
      22,
      382,
      52,
      538,
      132,
      640
    );

    context.bezierCurveTo(
      166,
      680,
      202,
      706,
      240,
      714
    );

    context.bezierCurveTo(
      278,
      706,
      314,
      680,
      348,
      640
    );

    context.bezierCurveTo(
      428,
      538,
      458,
      382,
      428,
      258
    );

    context.bezierCurveTo(
      398,
      148,
      326,
      62,
      240,
      24
    );

    context.closePath();

    return true;
  };

  const appendInnerWindow = context => {
    assertContext(
      context
    );

    if (
      typeof context.bezierCurveTo !==
        "function"
    ) {
      throw new TypeError(
        "MIRRORLAND_BEZIER_CONTEXT_INVALID"
      );
    }

    context.moveTo(
      240,
      48
    );

    context.bezierCurveTo(
      170,
      82,
      112,
      158,
      84,
      262
    );

    context.bezierCurveTo(
      58,
      366,
      82,
      510,
      148,
      604
    );

    context.bezierCurveTo(
      178,
      646,
      208,
      670,
      240,
      682
    );

    context.bezierCurveTo(
      272,
      670,
      302,
      646,
      332,
      604
    );

    context.bezierCurveTo(
      398,
      510,
      422,
      366,
      396,
      262
    );

    context.bezierCurveTo(
      368,
      158,
      310,
      82,
      240,
      48
    );

    context.closePath();

    return true;
  };

  const traceOuterWindow = context => {
    assertContext(
      context
    );

    context.beginPath();

    appendOuterWindow(
      context
    );

    return true;
  };

  const traceInnerWindow = context => {
    assertContext(
      context
    );

    context.beginPath();

    appendInnerWindow(
      context
    );

    return true;
  };

  const getBounds = points => {
    if (
      !Array.isArray(points) ||
      !points.length
    ) {
      return null;
    }

    const bounds =
      points.reduce(
        (
          result,
          point
        ) => {
          const x =
            Number(point[0]);

          const y =
            Number(point[1]);

          return {
            minimumX:
              Math.min(
                result.minimumX,
                x
              ),

            maximumX:
              Math.max(
                result.maximumX,
                x
              ),

            minimumY:
              Math.min(
                result.minimumY,
                y
              ),

            maximumY:
              Math.max(
                result.maximumY,
                y
              )
          };
        },
        {
          minimumX:
            Infinity,

          maximumX:
            -Infinity,

          minimumY:
            Infinity,

          maximumY:
            -Infinity
        }
      );

    return Object.freeze({
      ...bounds,

      width:
        bounds.maximumX -
        bounds.minimumX,

      height:
        bounds.maximumY -
        bounds.minimumY,

      centerX:
        (
          bounds.minimumX +
          bounds.maximumX
        ) /
        2,

      centerY:
        (
          bounds.minimumY +
          bounds.maximumY
        ) /
        2
    });
  };

  const getPane = paneId => {
    const normalizedId =
      String(paneId || "")
        .trim();

    return (
      PANE_BY_ID.get(
        normalizedId
      ) ||
      null
    );
  };

  const getPanes = () =>
    PANE_SOURCE;

  const getFrameSegments = () =>
    FRAME_SEGMENTS;

  const createPaneSnapshot = pane =>
    Object.freeze({
      id:
        pane.id,

      color:
        Object.freeze([
          ...pane.color
        ]),

      points:
        Object.freeze(
          pane.points.map(
            point =>
              Object.freeze([
                ...point
              ])
          )
        ),

      alpha:
        pane.alpha,

      glow:
        pane.glow,

      depth:
        pane.depth,

      phase:
        pane.phase,

      grain:
        pane.grain,

      highlight:
        pane.highlight
    });

  const createPanes = () =>
    Object.freeze(
      PANE_SOURCE.map(
        createPaneSnapshot
      )
    );

  const createFrameSegments = () =>
    Object.freeze(
      FRAME_SEGMENTS.map(
        segment =>
          Object.freeze(
            segment.map(
              point =>
                Object.freeze([
                  ...point
                ])
            )
          )
      )
    );

  const getGeometryBounds = () => {
    const allPanePoints =
      PANE_SOURCE.flatMap(
        pane =>
          pane.points
      );

    return getBounds(
      allPanePoints
    );
  };

  const validate = () => {
    const errors = [];

    if (
      DIMENSIONS.designWidth !==
        480 ||
      DIMENSIONS.designHeight !==
        720
    ) {
      errors.push(
        "DESIGN_DIMENSIONS_MISMATCH"
      );
    }

    if (
      PANE_SOURCE.length !==
        CONTRACT.paneCount
    ) {
      errors.push(
        "PANE_COUNT_MISMATCH"
      );
    }

    if (
      FRAME_SEGMENTS.length !==
        CONTRACT.frameSegmentCount
    ) {
      errors.push(
        "FRAME_SEGMENT_COUNT_MISMATCH"
      );
    }

    const paneIds =
      new Set();

    PANE_SOURCE.forEach(
      pane => {
        if (
          paneIds.has(
            pane.id
          )
        ) {
          errors.push(
            `DUPLICATE_PANE_ID:${pane.id}`
          );
        }

        paneIds.add(
          pane.id
        );

        if (
          pane.points.length < 3
        ) {
          errors.push(
            `PANE_POINT_COUNT_INVALID:${pane.id}`
          );
        }

        pane.points.forEach(
          point => {
            if (
              point[0] < 0 ||
              point[0] >
                DIMENSIONS.designWidth ||
              point[1] < 0 ||
              point[1] >
                DIMENSIONS.designHeight
            ) {
              errors.push(
                `PANE_POINT_OUT_OF_BOUNDS:${pane.id}`
              );
            }
          }
        );
      }
    );

    FRAME_SEGMENTS.forEach(
      (
        segment,
        index
      ) => {
        if (
          segment.length < 2
        ) {
          errors.push(
            `FRAME_SEGMENT_INCOMPLETE:${index}`
          );
        }
      }
    );

    return Object.freeze({
      valid:
        errors.length === 0,

      errors:
        Object.freeze([
          ...errors
        ]),

      paneCount:
        PANE_SOURCE.length,

      frameSegmentCount:
        FRAME_SEGMENTS.length,

      designWidth:
        DIMENSIONS.designWidth,

      designHeight:
        DIMENSIONS.designHeight
    });
  };

  const validation =
    validate();

  const RECEIPT = Object.freeze({
    contractId:
      CONTRACT.id,

    status:
      validation.valid
        ? "available"
        : "held",

    geometryAvailable:
      validation.valid,

    geometryImmutable:
      true,

    designWidth:
      DIMENSIONS.designWidth,

    designHeight:
      DIMENSIONS.designHeight,

    paneCount:
      PANE_SOURCE.length,

    frameSegmentCount:
      FRAME_SEGMENTS.length,

    outerWindowPathAvailable:
      true,

    innerWindowPathAvailable:
      true,

    polygonTracerAvailable:
      true,

    compassLifecycleOwned:
      false,

    jeevesLifecycleOwned:
      false,

    canvasOwned:
      false,

    validationErrors:
      validation.errors,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false,

    publicReleaseAuthorized:
      false
  });

  const API = {
    contract:
      CONTRACT,

    dimensions:
      DIMENSIONS,

    colors:
      COLORS,

    receipt:
      RECEIPT,

    paneIds:
      Object.freeze(
        PANE_SOURCE.map(
          pane =>
            pane.id
        )
      ),

    get ready() {
      return (
        validation.valid ===
        true
      );
    },

    get paneCount() {
      return PANE_SOURCE.length;
    },

    get frameSegmentCount() {
      return FRAME_SEGMENTS.length;
    },

    clamp,

    lerp,

    revealWeight,

    rgba,

    createPane,

    createPanes,

    createFrameSegments,

    getPanes,

    getPane,

    getFrameSegments,

    getBounds,

    getGeometryBounds,

    tracePolygon,

    appendOuterWindow,

    appendInnerWindow,

    traceOuterWindow,

    traceInnerWindow,

    validate
  };

  Object.freeze(
    API
  );

  Object.defineProperty(
    globalThis,
    GLOBAL_NAME,
    {
      value:
        API,

      enumerable:
        true,

      configurable:
        false,

      writable:
        false
    }
  );

  Object.defineProperty(
    globalThis,
    "DGB_MIRRORLAND_WINDOW_GEOMETRY_RECEIPT",
    {
      value:
        RECEIPT,

      enumerable:
        true,

      configurable:
        false,

      writable:
        false
    }
  );

  if (
    typeof globalThis.dispatchEvent ===
      "function" &&
    typeof globalThis.CustomEvent ===
      "function"
  ) {
    globalThis.dispatchEvent(
      new CustomEvent(
        validation.valid
          ? READY_EVENT
          : ERROR_EVENT,
        {
          detail:
            Object.freeze({
              contract:
                CONTRACT.id,

              globalName:
                GLOBAL_NAME,

              ready:
                validation.valid,

              paneCount:
                PANE_SOURCE.length,

              frameSegmentCount:
                FRAME_SEGMENTS.length,

              errors:
                validation.errors
            })
        }
      )
    );
  }
})();
