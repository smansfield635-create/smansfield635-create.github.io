/* TARGET FILE: /showroom/index.window.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_WINDOW_OBJECT_v1_TRUE_3D_CURTAIN_HOST */

/*
  Window Object Host

  Role:
  - Own the Mirrorland Window visual object only.
  - Translate the existing stained-glass design into a normalized X/Y/Z
    geometric compound.
  - Render the Window as a dimensional foreground curtain.
  - Expose a stable object API for a separate controller.

  Owns:
  - [data-showroom-window-mount] canvas creation
  - pointer-transparent visual canvas
  - normalized object-space geometry
  - pane/frame/aperture/depth/material definitions
  - curtain amount rendering
  - visual show/hide transitions
  - object-level receipt

  Does not own:
  - [data-showroom-window-control]
  - labels
  - aria-expanded
  - open/restore decision
  - Diamond renderer state
  - Diamond wake behavior
  - route state
  - orbit gestures
  - Compass or star interactions
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_WINDOW_OBJECT_v1_TRUE_3D_CURTAIN_HOST",

    file:
      "/showroom/index.window.js",

    publicSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

    previousSingleFileContract:
      "SHOWROOM_MIRRORLAND_FOREGROUND_WINDOW_TNT_v1_2_APERTURE_CONTROL_HARDENING",

    role:
      "visual-object-host-only",

    rendererModel:
      "canvas-2d-dimensional-geometry-with-webgl-upgrade-seam",

    defaultCurtainAmount:
      1,

    canvasPointerEvents:
      "none",

    buttonOwnership:
      false,

    pageStateOwnership:
      false,

    diamondOwnership:
      false,

    diamondWakeOwnership:
      false,

    gestureOwnership:
      false,

    routeOwnership:
      false,

    compassOwnership:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const SELECTORS = Object.freeze({
    mount:
      "[data-showroom-window-mount]",

    existingCanvas:
      "canvas[data-showroom-window-canvas]"
  });

  const EVENTS = Object.freeze({
    READY:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_READY",

    RENDERED:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_RENDERED",

    TRANSITION_START:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_TRANSITION_START",

    TRANSITION_COMPLETE:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_TRANSITION_COMPLETE",

    DISPOSED:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_DISPOSED",

    FAILURE:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_FAILURE"
  });

  const DESIGN = Object.freeze({
    width:
      480,

    height:
      720,

    centerX:
      240,

    centerY:
      360,

    objectHalfWidth:
      240,

    objectHalfHeight:
      360
  });

  const DEPTH = Object.freeze({
    rearShadow:
      -0.18,

    rearGlass:
      -0.08,

    glass:
      0,

    glassHighlight:
      0.025,

    leadBack:
      0.035,

    leadFace:
      0.075,

    frameBack:
      0.03,

    frameFace:
      0.13,

    frameEdge:
      0.19,

    apertureBack:
      0.06,

    apertureFace:
      0.18,

    dust:
      0.22
  });

  const MATERIALS = Object.freeze({
    frame:
      Object.freeze({
        base:
          Object.freeze([13, 17, 25]),

        mid:
          Object.freeze([31, 38, 52]),

        edge:
          Object.freeze([94, 75, 48]),

        gold:
          Object.freeze([205, 151, 82]),

        shadow:
          Object.freeze([2, 3, 7]),

        patina:
          Object.freeze([45, 74, 76]),

        roughness:
          0.74,

        metallic:
          0.76
      }),

    lead:
      Object.freeze({
        base:
          Object.freeze([16, 18, 25]),

        edge:
          Object.freeze([71, 76, 88]),

        highlight:
          Object.freeze([154, 142, 117]),

        patina:
          Object.freeze([40, 65, 67]),

        roughness:
          0.68,

        metallic:
          0.82
      }),

    aperture:
      Object.freeze({
        dark:
          Object.freeze([9, 10, 14]),

        rim:
          Object.freeze([119, 87, 50]),

        bright:
          Object.freeze([227, 179, 104]),

        coldEdge:
          Object.freeze([124, 162, 178])
      }),

    glass:
      Object.freeze({
        cyan:
          Object.freeze([61, 190, 207]),

        teal:
          Object.freeze([45, 149, 159]),

        blue:
          Object.freeze([43, 92, 172]),

        deepBlue:
          Object.freeze([22, 58, 126]),

        violet:
          Object.freeze([111, 70, 180]),

        deepViolet:
          Object.freeze([77, 48, 133]),

        rose:
          Object.freeze([177, 74, 115]),

        amber:
          Object.freeze([208, 146, 65]),

        paleCyan:
          Object.freeze([133, 216, 225]),

        paleViolet:
          Object.freeze([166, 130, 211]),

        paleRose:
          Object.freeze([213, 129, 164])
      })
  });

  const COLORS = Object.freeze({
    transparent:
      "rgba(0, 0, 0, 0)"
  });

  const TIMING = Object.freeze({
    showMs:
      760,

    hideMs:
      980,

    reducedMs:
      80
  });

  const RENDER = Object.freeze({
    maxDevicePixelRatio:
      2,

    focalLength:
      3.1,

    basePerspective:
      0.92,

    idleTiltX:
      -0.035,

    idleTiltY:
      0.045,

    idleTiltZ:
      0,

    objectScale:
      0.92,

    apertureClearAlpha:
      1,

    glassAlpha:
      0.72,

    leadWidth:
      5.6,

    leadHighlightWidth:
      1.35,

    paneBevelOffset:
      3.4,

    frameOuterLine:
      18,

    frameInnerLine:
      9,

    frameGlow:
      34
  });

  const state = {
    mount:
      null,

    canvas:
      null,

    context:
      null,

    createdCanvas:
      false,

    resizeObserver:
      null,

    resizeFallbackBound:
      false,

    width:
      1,

    height:
      1,

    pixelRatio:
      1,

    curtainAmount:
      1,

    transition:
      null,

    raf:
      0,

    running:
      false,

    initialized:
      false,

    disposed:
      false,

    failed:
      false,

    geometry:
      null,

    lastRenderTime:
      0,

    reducedMotion:
      false,

    reducedMotionQuery:
      null,

    reducedMotionBound:
      false
  };

  const receipt = {
    contractId:
      CONTRACT.id,

    file:
      CONTRACT.file,

    publicSurface:
      CONTRACT.publicSurface,

    status:
      "pending",

    initialized:
      false,

    disposed:
      false,

    failed:
      false,

    canvasPresent:
      false,

    geometryPresent:
      false,

    curtainAmount:
      1,

    paneCount:
      0,

    frameCurveCount:
      0,

    aperturePointCount:
      0,

    rendererModel:
      CONTRACT.rendererModel,

    canvasPointerEvents:
      CONTRACT.canvasPointerEvents,

    ownsButton:
      false,

    ownsPageState:
      false,

    ownsDiamond:
      false,

    ownsDiamondWake:
      false,

    ownsGestures:
      false,

    ownsRoute:
      false,

    ownsCompass:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false,

    lastAction:
      "",

    lastFailure:
      null
  };

  function freezeDeep(value) {
    if (
      !value ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    Object.freeze(value);

    Object.getOwnPropertyNames(value).forEach(
      key => freezeDeep(value[key])
    );

    return value;
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    const number =
      Number(value);

    if (!Number.isFinite(number)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(
        maximum,
        number
      )
    );
  }

  function lerp(
    a,
    b,
    amount
  ) {
    return a + (b - a) * amount;
  }

  function easeOutCubic(value) {
    const inverse =
      1 - value;

    return 1 - inverse * inverse * inverse;
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function rgba(
    color,
    alpha
  ) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${clamp(alpha, 0, 1)})`;
  }

  function hsla(
    h,
    s,
    l,
    a
  ) {
    return `hsla(${h}, ${s}%, ${l}%, ${clamp(a, 0, 1)})`;
  }

  function nowId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
  }

  function dispatch(
    type,
    detail = {}
  ) {
    try {
      globalThis.dispatchEvent(
        new CustomEvent(
          type,
          {
            detail:
              Object.freeze({
                contractId:
                  CONTRACT.id,

                file:
                  CONTRACT.file,

                ...detail
              })
          }
        )
      );
    } catch (_) {}
  }

  function updateReceipt(extra = {}) {
    Object.assign(
      receipt,
      {
        status:
          state.disposed
            ? "disposed"
            : state.failed
              ? "failed"
              : state.initialized
                ? "available"
                : "pending",

        initialized:
          state.initialized,

        disposed:
          state.disposed,

        failed:
          state.failed,

        canvasPresent:
          Boolean(state.canvas),

        geometryPresent:
          Boolean(state.geometry),

        curtainAmount:
          state.curtainAmount,

        paneCount:
          state.geometry
            ? state.geometry.panes.length
            : 0,

        frameCurveCount:
          state.geometry
            ? state.geometry.frame.curves.length
            : 0,

        aperturePointCount:
          state.geometry
            ? state.geometry.aperture.points.length
            : 0,

        ownsButton:
          false,

        ownsPageState:
          false,

        ownsDiamond:
          false,

        ownsDiamondWake:
          false,

        ownsGestures:
          false,

        ownsRoute:
          false,

        ownsCompass:
          false,

        visualPassClaimed:
          false,

        productionAuthorized:
          false,

        deploymentAuthorized:
          false,

        ...extra
      }
    );

    globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT_RECEIPT =
      Object.freeze({
        ...receipt
      });

    if (state.canvas) {
      state.canvas.dataset.showroomWindowObjectReceipt =
        JSON.stringify(receipt);

      state.canvas.dataset.visualPassClaimed =
        "false";
    }

    if (state.mount) {
      state.mount.dataset.showroomWindowObjectStatus =
        receipt.status;

      state.mount.dataset.showroomWindowObjectContract =
        CONTRACT.id;

      state.mount.dataset.visualPassClaimed =
        "false";
    }
  }

  function fail(reason) {
    state.failed =
      true;

    stopRenderLoop();

    updateReceipt({
      status:
        "failed",

      lastAction:
        "window-object-failed",

      lastFailure:
        String(reason || "UNKNOWN_WINDOW_OBJECT_FAILURE")
    });

    dispatch(
      EVENTS.FAILURE,
      {
        reason:
          String(reason || "UNKNOWN_WINDOW_OBJECT_FAILURE"),

        receipt:
          getReceipt()
      }
    );
  }

  function normalizePoint(
    point,
    z = 0
  ) {
    return Object.freeze({
      x:
        (point[0] - DESIGN.centerX) / DESIGN.objectHalfWidth,

      y:
        (DESIGN.centerY - point[1]) / DESIGN.objectHalfHeight,

      z
    });
  }

  function normalizePolygon(
    points,
    z = 0
  ) {
    return Object.freeze(
      points.map(point =>
        normalizePoint(point, z)
      )
    );
  }

  function createPane(
    id,
    points,
    material,
    z,
    options = {}
  ) {
    const normalized =
      normalizePolygon(points, z);

    return freezeDeep({
      id,
      points:
        normalized,

      sourcePoints:
        points.map(point =>
          Object.freeze([point[0], point[1]])
        ),

      material,
      z,

      glassDepth:
        options.glassDepth ?? 0.035,

      bevel:
        options.bevel ?? 0.018,

      alpha:
        options.alpha ?? 0.72,

      roughness:
        options.roughness ?? 0.62,

      age:
        options.age ?? 0.36,

      refraction:
        options.refraction ?? 0.24,

      internalGlow:
        options.internalGlow ?? 0.22,

      phase:
        options.phase ?? 0
    });
  }

  function createFrameCurve(
    id,
    points,
    z,
    width,
    material
  ) {
    return freezeDeep({
      id,

      points:
        normalizePolygon(points, z),

      sourcePoints:
        points.map(point =>
          Object.freeze([point[0], point[1]])
        ),

      z,
      width,
      material
    });
  }

  function makeGeometry() {
    const glass =
      MATERIALS.glass;

    const panes = Object.freeze([
      createPane(
        "crown-left",
        [[240, 46], [164, 106], [204, 168], [240, 134]],
        glass.paleCyan,
        DEPTH.glass,
        { alpha: 0.66, internalGlow: 0.32, phase: 0.15 }
      ),

      createPane(
        "crown-right",
        [[240, 46], [240, 134], [278, 168], [318, 106]],
        glass.paleViolet,
        DEPTH.glass,
        { alpha: 0.64, internalGlow: 0.30, phase: 0.51 }
      ),

      createPane(
        "upper-left-edge",
        [[164, 106], [98, 210], [154, 246], [204, 168]],
        glass.blue,
        DEPTH.glass,
        { alpha: 0.68, age: 0.48, phase: 0.91 }
      ),

      createPane(
        "upper-right-edge",
        [[318, 106], [278, 168], [326, 246], [382, 210]],
        glass.violet,
        DEPTH.glass,
        { alpha: 0.67, age: 0.45, phase: 1.22 }
      ),

      createPane(
        "upper-center-left",
        [[204, 168], [154, 246], [216, 268], [240, 208], [240, 134]],
        glass.cyan,
        DEPTH.glass,
        { alpha: 0.65, refraction: 0.34, phase: 1.63 }
      ),

      createPane(
        "upper-center-right",
        [[240, 134], [240, 208], [264, 268], [326, 246], [278, 168]],
        glass.rose,
        DEPTH.glass,
        { alpha: 0.64, refraction: 0.31, phase: 1.92 }
      ),

      createPane(
        "mid-left-high",
        [[98, 210], [66, 332], [148, 338], [154, 246]],
        glass.deepBlue,
        DEPTH.glass,
        { alpha: 0.69, age: 0.55, phase: 2.27 }
      ),

      createPane(
        "mid-left-inner",
        [[154, 246], [148, 338], [212, 334], [216, 268]],
        glass.deepViolet,
        DEPTH.glass,
        { alpha: 0.67, internalGlow: 0.18, phase: 2.56 }
      ),

      createPane(
        "mid-center",
        [[216, 268], [212, 334], [240, 382], [268, 334], [264, 268], [240, 208]],
        glass.paleCyan,
        DEPTH.glass,
        { alpha: 0.62, internalGlow: 0.35, phase: 2.94 }
      ),

      createPane(
        "mid-right-inner",
        [[264, 268], [268, 334], [332, 338], [326, 246]],
        glass.teal,
        DEPTH.glass,
        { alpha: 0.66, internalGlow: 0.20, phase: 3.18 }
      ),

      createPane(
        "mid-right-high",
        [[326, 246], [332, 338], [414, 332], [382, 210]],
        glass.blue,
        DEPTH.glass,
        { alpha: 0.68, age: 0.50, phase: 3.52 }
      ),

      createPane(
        "lower-left-edge",
        [[66, 332], [82, 470], [156, 446], [148, 338]],
        glass.rose,
        DEPTH.glass,
        { alpha: 0.68, age: 0.58, phase: 3.86 }
      ),

      createPane(
        "lower-left-center",
        [[148, 338], [156, 446], [216, 430], [240, 382], [212, 334]],
        glass.cyan,
        DEPTH.glass,
        { alpha: 0.65, refraction: 0.30, phase: 4.19 }
      ),

      createPane(
        "lower-right-center",
        [[268, 334], [240, 382], [264, 430], [324, 446], [332, 338]],
        glass.violet,
        DEPTH.glass,
        { alpha: 0.65, refraction: 0.30, phase: 4.54 }
      ),

      createPane(
        "lower-right-edge",
        [[332, 338], [324, 446], [398, 470], [414, 332]],
        glass.amber,
        DEPTH.glass,
        { alpha: 0.67, age: 0.53, internalGlow: 0.23, phase: 4.89 }
      ),

      createPane(
        "lower-left-deep",
        [[82, 470], [116, 594], [192, 530], [156, 446]],
        glass.blue,
        DEPTH.glass,
        { alpha: 0.68, age: 0.54, phase: 5.23 }
      ),

      createPane(
        "lower-center-left",
        [[156, 446], [192, 530], [240, 624], [240, 500], [216, 430]],
        glass.paleViolet,
        DEPTH.glass,
        { alpha: 0.64, internalGlow: 0.28, phase: 5.57 }
      ),

      createPane(
        "lower-center-right",
        [[264, 430], [240, 500], [240, 624], [288, 530], [324, 446]],
        glass.paleRose,
        DEPTH.glass,
        { alpha: 0.64, internalGlow: 0.28, phase: 5.91 }
      ),

      createPane(
        "lower-right-deep",
        [[324, 446], [288, 530], [364, 594], [398, 470]],
        glass.teal,
        DEPTH.glass,
        { alpha: 0.68, age: 0.53, phase: 6.26 }
      ),

      createPane(
        "base-left",
        [[116, 594], [168, 660], [240, 676], [240, 624], [192, 530]],
        glass.amber,
        DEPTH.glass,
        { alpha: 0.65, internalGlow: 0.26, phase: 6.58 }
      ),

      createPane(
        "base-right",
        [[288, 530], [240, 624], [240, 676], [312, 660], [364, 594]],
        glass.deepBlue,
        DEPTH.glass,
        { alpha: 0.67, age: 0.50, phase: 6.91 }
      )
    ]);

    const outerLeft = [
      [240, 24],
      [170, 54],
      [106, 120],
      [66, 220],
      [48, 344],
      [60, 482],
      [104, 594],
      [164, 660],
      [240, 704]
    ];

    const outerRight = [
      [240, 24],
      [310, 54],
      [374, 120],
      [414, 220],
      [432, 344],
      [420, 482],
      [376, 594],
      [316, 660],
      [240, 704]
    ];

    const innerLeft = [
      [240, 50],
      [180, 82],
      [126, 146],
      [92, 238],
      [80, 344],
      [90, 462],
      [128, 566],
      [178, 632],
      [240, 676]
    ];

    const innerRight = [
      [240, 50],
      [300, 82],
      [354, 146],
      [388, 238],
      [400, 344],
      [390, 462],
      [352, 566],
      [302, 632],
      [240, 676]
    ];

    const centralSpineTop =
      [[240, 56], [240, 134], [240, 208], [240, 236]];

    const centralSpineBottom =
      [[240, 416], [240, 500], [240, 624], [240, 676]];

    const frame = freezeDeep({
      curves:
        Object.freeze([
          createFrameCurve(
            "outer-left",
            outerLeft,
            DEPTH.frameFace,
            18,
            MATERIALS.frame
          ),

          createFrameCurve(
            "outer-right",
            outerRight,
            DEPTH.frameFace,
            18,
            MATERIALS.frame
          ),

          createFrameCurve(
            "inner-left",
            innerLeft,
            DEPTH.frameFace,
            9,
            MATERIALS.frame
          ),

          createFrameCurve(
            "inner-right",
            innerRight,
            DEPTH.frameFace,
            9,
            MATERIALS.frame
          ),

          createFrameCurve(
            "central-spine-top",
            centralSpineTop,
            DEPTH.leadFace,
            7,
            MATERIALS.lead
          ),

          createFrameCurve(
            "central-spine-bottom",
            centralSpineBottom,
            DEPTH.leadFace,
            7,
            MATERIALS.lead
          )
        ]),

      source:
        Object.freeze({
          outerLeft,
          outerRight,
          innerLeft,
          innerRight,
          centralSpineTop,
          centralSpineBottom
        })
    });

    const aperturePoints =
      [[240, 236], [276, 328], [240, 416], [204, 328]];

    const aperture = freezeDeep({
      id:
        "central-diamond-viewing-aperture",

      points:
        normalizePolygon(
          aperturePoints,
          DEPTH.apertureFace
        ),

      sourcePoints:
        aperturePoints.map(point =>
          Object.freeze([point[0], point[1]])
        ),

      bevelPlanes:
        Object.freeze([
          DEPTH.apertureBack,
          DEPTH.apertureFace,
          DEPTH.frameEdge
        ]),

      transparent:
        true,

      subtractivePhase1:
        "canvas-destination-out",

      subtractiveFuture:
        "explicit-geometry-stencil-or-triangulation"
    });

    return freezeDeep({
      contractId:
        CONTRACT.id,

      design:
        DESIGN,

      depth:
        DEPTH,

      materials:
        MATERIALS,

      coordinateSystem:
        Object.freeze({
          name:
            "W",

          x:
            "left-right-normalized-from-original-480-design-width",

          y:
            "vertical-normalized-from-original-720-design-height",

          z:
            "depth-positive-toward-viewer",

          origin:
            "center-of-original-window-design"
        }),

      panes,
      frame,
      aperture
    });
  }

  function rotatePoint(
    point,
    tiltX,
    tiltY,
    tiltZ
  ) {
    let x =
      point.x;

    let y =
      point.y;

    let z =
      point.z;

    const cosX =
      Math.cos(tiltX);

    const sinX =
      Math.sin(tiltX);

    const y1 =
      y * cosX - z * sinX;

    const z1 =
      y * sinX + z * cosX;

    y = y1;
    z = z1;

    const cosY =
      Math.cos(tiltY);

    const sinY =
      Math.sin(tiltY);

    const x2 =
      x * cosY + z * sinY;

    const z2 =
      -x * sinY + z * cosY;

    x = x2;
    z = z2;

    const cosZ =
      Math.cos(tiltZ);

    const sinZ =
      Math.sin(tiltZ);

    const x3 =
      x * cosZ - y * sinZ;

    const y3 =
      x * sinZ + y * cosZ;

    return {
      x:
        x3,

      y:
        y3,

      z:
        z2
    };
  }

  function projectPoint(
    point,
    layout,
    extraZ = 0
  ) {
    const rotated =
      rotatePoint(
        {
          x:
            point.x,

          y:
            point.y,

          z:
            point.z + extraZ
        },
        RENDER.idleTiltX,
        RENDER.idleTiltY,
        RENDER.idleTiltZ
      );

    const perspective =
      RENDER.focalLength /
      (
        RENDER.focalLength -
        rotated.z *
          RENDER.basePerspective
      );

    return {
      x:
        layout.centerX +
        rotated.x *
          layout.scaleX *
          perspective,

      y:
        layout.centerY -
        rotated.y *
          layout.scaleY *
          perspective,

      z:
        rotated.z,

      perspective
    };
  }

  function projectPolygon(
    points,
    layout,
    extraZ = 0
  ) {
    return points.map(point =>
      projectPoint(
        point,
        layout,
        extraZ
      )
    );
  }

  function traceProjectedPolygon(
    context,
    points
  ) {
    if (!points.length) {
      return;
    }

    context.beginPath();

    context.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      let index = 1;
      index < points.length;
      index += 1
    ) {
      context.lineTo(
        points[index].x,
        points[index].y
      );
    }

    context.closePath();
  }

  function traceProjectedCurve(
    context,
    points
  ) {
    if (!points.length) {
      return;
    }

    context.beginPath();

    context.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      let index = 1;
      index < points.length;
      index += 1
    ) {
      const previous =
        points[index - 1];

      const current =
        points[index];

      const midX =
        (previous.x + current.x) / 2;

      const midY =
        (previous.y + current.y) / 2;

      context.quadraticCurveTo(
        previous.x,
        previous.y,
        midX,
        midY
      );
    }

    const last =
      points[points.length - 1];

    context.lineTo(
      last.x,
      last.y
    );
  }

  function projectedBounds(points) {
    return points.reduce(
      (box, point) => ({
        minX:
          Math.min(box.minX, point.x),

        maxX:
          Math.max(box.maxX, point.x),

        minY:
          Math.min(box.minY, point.y),

        maxY:
          Math.max(box.maxY, point.y)
      }),
      {
        minX:
          Infinity,

        maxX:
          -Infinity,

        minY:
          Infinity,

        maxY:
          -Infinity
      }
    );
  }

  function makeLayout() {
    const cssWidth =
      state.width / state.pixelRatio;

    const cssHeight =
      state.height / state.pixelRatio;

    const stageScale =
      Math.min(
        cssWidth / DESIGN.width,
        cssHeight / DESIGN.height
      );

    const objectScale =
      stageScale *
      RENDER.objectScale;

    return {
      cssWidth,
      cssHeight,

      centerX:
        cssWidth / 2,

      centerY:
        cssHeight / 2,

      scaleX:
        DESIGN.objectHalfWidth * objectScale,

      scaleY:
        DESIGN.objectHalfHeight * objectScale,

      stageScale,
      objectScale
    };
  }

  function createCanvas() {
    const existing =
      state.mount.querySelector(
        SELECTORS.existingCanvas
      );

    if (existing) {
      state.createdCanvas =
        false;

      existing.setAttribute(
        "aria-hidden",
        "true"
      );

      existing.setAttribute(
        "role",
        "presentation"
      );

      Object.assign(
        existing.style,
        {
          position:
            "absolute",

          inset:
            "0",

          width:
            "100%",

          height:
            "100%",

          display:
            "block",

          background:
            "transparent",

          pointerEvents:
            "none",

          touchAction:
            "none",

          zIndex:
            "1"
        }
      );

      return existing;
    }

    const canvas =
      document.createElement("canvas");

    state.createdCanvas =
      true;

    canvas.dataset.showroomWindowCanvas =
      "true";

    canvas.dataset.showroomWindowObject =
      "true";

    canvas.dataset.showroomWindowObjectContract =
      CONTRACT.id;

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "role",
      "presentation"
    );

    Object.assign(
      canvas.style,
      {
        position:
          "absolute",

        inset:
          "0",

        width:
          "100%",

        height:
          "100%",

        display:
          "block",

        background:
          "transparent",

        pointerEvents:
          "none",

        touchAction:
          "none",

        zIndex:
          "1"
      }
    );

    state.mount.appendChild(canvas);

    return canvas;
  }

  function resize() {
    if (
      !state.canvas ||
      !state.mount
    ) {
      return false;
    }

    const rect =
      state.mount.getBoundingClientRect();

    const pixelRatio =
      Math.min(
        globalThis.devicePixelRatio || 1,
        RENDER.maxDevicePixelRatio
      );

    const width =
      Math.max(
        1,
        Math.floor(rect.width * pixelRatio)
      );

    const height =
      Math.max(
        1,
        Math.floor(rect.height * pixelRatio)
      );

    const changed =
      state.canvas.width !== width ||
      state.canvas.height !== height;

    if (changed) {
      state.canvas.width =
        width;

      state.canvas.height =
        height;
    }

    state.canvas.style.width =
      `${Math.max(1, rect.width)}px`;

    state.canvas.style.height =
      `${Math.max(1, rect.height)}px`;

    state.width =
      width;

    state.height =
      height;

    state.pixelRatio =
      pixelRatio;

    return changed;
  }

  function clearCanvas() {
    if (!state.context) {
      return;
    }

    state.context.clearRect(
      0,
      0,
      state.width,
      state.height
    );
  }

  function drawSceneShadow(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.004) {
      return;
    }

    context.save();

    const gradient =
      context.createRadialGradient(
        layout.centerX,
        layout.centerY + layout.scaleY * 0.05,
        layout.scaleX * 0.12,
        layout.centerX,
        layout.centerY + layout.scaleY * 0.05,
        layout.scaleX * 1.02
      );

    gradient.addColorStop(
      0,
      `rgba(7, 11, 24, ${0.08 * amount})`
    );

    gradient.addColorStop(
      0.55,
      `rgba(2, 4, 12, ${0.22 * amount})`
    );

    gradient.addColorStop(
      1,
      `rgba(0, 0, 0, ${0.64 * amount})`
    );

    context.fillStyle =
      gradient;

    context.fillRect(
      0,
      0,
      layout.cssWidth,
      layout.cssHeight
    );

    context.restore();
  }

  function paneGradient(
    context,
    pane,
    projected,
    amount
  ) {
    const bounds =
      projectedBounds(projected);

    const gradient =
      context.createLinearGradient(
        bounds.minX,
        bounds.minY,
        bounds.maxX,
        bounds.maxY
      );

    gradient.addColorStop(
      0,
      rgba(
        pane.material,
        pane.alpha * 0.42 * amount
      )
    );

    gradient.addColorStop(
      0.35,
      rgba(
        pane.material,
        pane.alpha * 0.84 * amount
      )
    );

    gradient.addColorStop(
      0.72,
      rgba(
        pane.material,
        pane.alpha * 0.64 * amount
      )
    );

    gradient.addColorStop(
      1,
      rgba(
        pane.material,
        pane.alpha * 0.28 * amount
      )
    );

    return gradient;
  }

  function drawPaneBackDepth(
    context,
    pane,
    layout,
    amount
  ) {
    const rear =
      projectPolygon(
        pane.points,
        layout,
        -pane.glassDepth
      );

    const front =
      projectPolygon(
        pane.points,
        layout,
        pane.glassDepth
      );

    context.save();

    context.globalAlpha =
      amount;

    for (
      let index = 0;
      index < front.length;
      index += 1
    ) {
      const next =
        (index + 1) % front.length;

      context.beginPath();

      context.moveTo(
        rear[index].x,
        rear[index].y
      );

      context.lineTo(
        rear[next].x,
        rear[next].y
      );

      context.lineTo(
        front[next].x,
        front[next].y
      );

      context.lineTo(
        front[index].x,
        front[index].y
      );

      context.closePath();

      context.fillStyle =
        rgba(
          pane.material,
          0.16 * amount
        );

      context.fill();
    }

    context.restore();
  }

  function drawGlassTexture(
    context,
    pane,
    projected,
    amount
  ) {
    if (amount <= 0.03) {
      return;
    }

    const bounds =
      projectedBounds(projected);

    const width =
      Math.max(1, bounds.maxX - bounds.minX);

    const height =
      Math.max(1, bounds.maxY - bounds.minY);

    context.save();

    traceProjectedPolygon(
      context,
      projected
    );

    context.clip();

    const haze =
      context.createRadialGradient(
        bounds.minX + width * 0.32,
        bounds.minY + height * 0.28,
        2,
        bounds.minX + width * 0.42,
        bounds.minY + height * 0.36,
        Math.max(width, height) * 0.88
      );

    haze.addColorStop(
      0,
      `rgba(255, 255, 255, ${0.18 * pane.refraction * amount})`
    );

    haze.addColorStop(
      0.42,
      `rgba(255, 255, 255, ${0.045 * amount})`
    );

    haze.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      haze;

    context.fillRect(
      bounds.minX,
      bounds.minY,
      width,
      height
    );

    const veinCount =
      4;

    context.lineWidth =
      Math.max(0.6, layoutLineWidth(0.6));

    for (
      let index = 0;
      index < veinCount;
      index += 1
    ) {
      const seed =
        pane.phase * 17.3 + index * 9.1;

      const x0 =
        bounds.minX +
        width *
          (
            0.12 +
            0.76 *
              (
                Math.sin(seed) * 0.5 + 0.5
              )
          );

      const y0 =
        bounds.minY +
        height *
          (
            0.10 +
            0.78 *
              (
                Math.sin(seed * 1.71) * 0.5 + 0.5
              )
          );

      context.beginPath();

      context.moveTo(
        x0,
        y0
      );

      context.bezierCurveTo(
        x0 + Math.sin(seed * 0.7) * width * 0.12,
        y0 + height * 0.20,
        x0 + Math.cos(seed * 0.5) * width * 0.16,
        y0 + height * 0.42,
        x0 + Math.sin(seed * 0.9) * width * 0.08,
        y0 + height * 0.72
      );

      context.strokeStyle =
        `rgba(255, 255, 255, ${0.045 * pane.age * amount})`;

      context.stroke();
    }

    context.restore();
  }

  function layoutLineWidth(value) {
    const scale =
      Math.max(
        0.8,
        Math.min(
          2.4,
          Math.min(state.width, state.height) / 700
        )
      );

    return value * scale;
  }

  function drawPane(
    context,
    pane,
    layout,
    amount
  ) {
    if (amount <= 0.004) {
      return;
    }

    drawPaneBackDepth(
      context,
      pane,
      layout,
      amount
    );

    const projected =
      projectPolygon(
        pane.points,
        layout,
        pane.glassDepth
      );

    context.save();

    context.globalAlpha =
      amount;

    context.shadowBlur =
      layoutLineWidth(12) *
      pane.internalGlow *
      amount;

    context.shadowColor =
      rgba(
        pane.material,
        0.36 * pane.internalGlow * amount
      );

    traceProjectedPolygon(
      context,
      projected
    );

    context.fillStyle =
      paneGradient(
        context,
        pane,
        projected,
        amount
      );

    context.fill();

    context.shadowBlur =
      0;

    traceProjectedPolygon(
      context,
      projected
    );

    context.strokeStyle =
      `rgba(255, 255, 255, ${0.10 * amount})`;

    context.lineWidth =
      layoutLineWidth(1.05);

    context.stroke();

    drawGlassTexture(
      context,
      pane,
      projected,
      amount
    );

    context.restore();
  }

  function drawAllPanes(
    context,
    layout,
    amount
  ) {
    state.geometry.panes.forEach(
      pane => drawPane(
        context,
        pane,
        layout,
        amount
      )
    );
  }

  function drawLeadNetwork(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.004) {
      return;
    }

    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    state.geometry.panes.forEach(
      pane => {
        const back =
          projectPolygon(
            pane.points,
            layout,
            DEPTH.leadBack
          );

        const face =
          projectPolygon(
            pane.points,
            layout,
            DEPTH.leadFace
          );

        traceProjectedPolygon(
          context,
          back
        );

        context.strokeStyle =
          rgba(
            MATERIALS.lead.base,
            0.92 * amount
          );

        context.lineWidth =
          layoutLineWidth(RENDER.leadWidth + 2.5);

        context.stroke();

        traceProjectedPolygon(
          context,
          face
        );

        context.strokeStyle =
          rgba(
            MATERIALS.lead.base,
            0.98 * amount
          );

        context.lineWidth =
          layoutLineWidth(RENDER.leadWidth);

        context.stroke();

        traceProjectedPolygon(
          context,
          face
        );

        context.strokeStyle =
          rgba(
            MATERIALS.lead.highlight,
            0.24 * amount
          );

        context.lineWidth =
          layoutLineWidth(RENDER.leadHighlightWidth);

        context.stroke();
      }
    );

    context.restore();
  }

  function drawFrameCurves(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.004) {
      return;
    }

    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    state.geometry.frame.curves.forEach(
      curve => {
        const back =
          projectPolygon(
            curve.points,
            layout,
            DEPTH.frameBack
          );

        const face =
          projectPolygon(
            curve.points,
            layout,
            curve.z
          );

        const edge =
          projectPolygon(
            curve.points,
            layout,
            DEPTH.frameEdge
          );

        traceProjectedCurve(
          context,
          back
        );

        context.strokeStyle =
          rgba(
            MATERIALS.frame.shadow,
            0.86 * amount
          );

        context.lineWidth =
          layoutLineWidth(curve.width + 8);

        context.stroke();

        traceProjectedCurve(
          context,
          face
        );

        context.shadowBlur =
          layoutLineWidth(RENDER.frameGlow) *
          0.18 *
          amount;

        context.shadowColor =
          rgba(
            MATERIALS.frame.gold,
            0.18 * amount
          );

        context.strokeStyle =
          rgba(
            MATERIALS.frame.base,
            0.98 * amount
          );

        context.lineWidth =
          layoutLineWidth(curve.width);

        context.stroke();

        context.shadowBlur =
          0;

        traceProjectedCurve(
          context,
          edge
        );

        context.strokeStyle =
          rgba(
            MATERIALS.frame.gold,
            0.36 * amount
          );

        context.lineWidth =
          layoutLineWidth(Math.max(1.2, curve.width * 0.18));

        context.stroke();

        traceProjectedCurve(
          context,
          edge
        );

        context.strokeStyle =
          rgba(
            MATERIALS.frame.patina,
            0.18 * amount
          );

        context.lineWidth =
          layoutLineWidth(Math.max(0.9, curve.width * 0.10));

        context.stroke();
      }
    );

    context.restore();
  }

  function drawOuterFrameSilhouette(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.004) {
      return;
    }

    const left =
      projectPolygon(
        state.geometry.frame.curves[0].points,
        layout,
        DEPTH.frameFace
      );

    const right =
      projectPolygon(
        state.geometry.frame.curves[1].points,
        layout,
        DEPTH.frameFace
      );

    const outer =
      left.concat(
        right.slice().reverse()
      );

    context.save();

    traceProjectedPolygon(
      context,
      outer
    );

    context.strokeStyle =
      rgba(
        MATERIALS.frame.shadow,
        0.86 * amount
      );

    context.lineWidth =
      layoutLineWidth(25);

    context.shadowBlur =
      layoutLineWidth(24) *
      amount;

    context.shadowColor =
      `rgba(0, 0, 0, ${0.72 * amount})`;

    context.stroke();

    context.shadowBlur =
      0;

    traceProjectedPolygon(
      context,
      outer
    );

    context.strokeStyle =
      rgba(
        MATERIALS.frame.gold,
        0.22 * amount
      );

    context.lineWidth =
      layoutLineWidth(2.2);

    context.stroke();

    context.restore();
  }

  function drawApertureClear(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.004) {
      return;
    }

    const aperture =
      projectPolygon(
        state.geometry.aperture.points,
        layout,
        DEPTH.apertureFace
      );

    context.save();

    context.globalCompositeOperation =
      "destination-out";

    traceProjectedPolygon(
      context,
      aperture
    );

    context.fillStyle =
      `rgba(0, 0, 0, ${RENDER.apertureClearAlpha})`;

    context.fill();

    context.restore();
  }

  function drawApertureBevel(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.004) {
      return;
    }

    const back =
      projectPolygon(
        state.geometry.aperture.points,
        layout,
        DEPTH.apertureBack
      );

    const face =
      projectPolygon(
        state.geometry.aperture.points,
        layout,
        DEPTH.apertureFace
      );

    const edge =
      projectPolygon(
        state.geometry.aperture.points,
        layout,
        DEPTH.frameEdge
      );

    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    traceProjectedPolygon(
      context,
      back
    );

    context.strokeStyle =
      rgba(
        MATERIALS.aperture.dark,
        0.96 * amount
      );

    context.lineWidth =
      layoutLineWidth(18);

    context.stroke();

    traceProjectedPolygon(
      context,
      face
    );

    context.strokeStyle =
      rgba(
        MATERIALS.aperture.rim,
        0.86 * amount
      );

    context.lineWidth =
      layoutLineWidth(10.5);

    context.stroke();

    traceProjectedPolygon(
      context,
      edge
    );

    context.strokeStyle =
      rgba(
        MATERIALS.aperture.bright,
        0.38 * amount
      );

    context.lineWidth =
      layoutLineWidth(2.1);

    context.stroke();

    traceProjectedPolygon(
      context,
      edge
    );

    context.strokeStyle =
      rgba(
        MATERIALS.aperture.coldEdge,
        0.20 * amount
      );

    context.lineWidth =
      layoutLineWidth(0.9);

    context.stroke();

    context.restore();
  }

  function drawAgedDustAndEdgeWear(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.08) {
      return;
    }

    context.save();

    context.globalCompositeOperation =
      "screen";

    const dustAlpha =
      0.035 * amount;

    for (
      let index = 0;
      index < 36;
      index += 1
    ) {
      const seed =
        index * 12.9898;

      const x =
        layout.centerX +
        Math.sin(seed) *
          layout.scaleX *
          0.72 +
        Math.sin(seed * 2.17) *
          layout.scaleX *
          0.08;

      const y =
        layout.centerY +
        Math.cos(seed * 0.77) *
          layout.scaleY *
          0.82;

      const radius =
        layoutLineWidth(
          0.55 +
          (
            Math.sin(seed * 1.31) * 0.5 + 0.5
          ) *
            1.4
        );

      context.fillStyle =
        `rgba(230, 218, 184, ${
          dustAlpha *
          (
            0.3 +
            (
              Math.sin(seed * 0.43) * 0.5 + 0.5
            ) *
              0.7
          )
        })`;

      context.beginPath();

      context.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      context.fill();
    }

    context.restore();
  }

  function drawCurtainObject() {
    if (
      !state.context ||
      !state.geometry
    ) {
      return;
    }

    const context =
      state.context;

    resize();

    clearCanvas();

    const amount =
      clamp(
        state.curtainAmount,
        0,
        1
      );

    if (amount <= 0.002) {
      return;
    }

    const layout =
      makeLayout();

    context.save();

    context.scale(
      state.pixelRatio,
      state.pixelRatio
    );

    drawSceneShadow(
      context,
      layout,
      amount
    );

    drawOuterFrameSilhouette(
      context,
      layout,
      amount
    );

    drawAllPanes(
      context,
      layout,
      amount
    );

    drawLeadNetwork(
      context,
      layout,
      amount
    );

    drawFrameCurves(
      context,
      layout,
      amount
    );

    drawApertureClear(
      context,
      layout,
      amount
    );

    drawApertureBevel(
      context,
      layout,
      amount
    );

    drawAgedDustAndEdgeWear(
      context,
      layout,
      amount
    );

    context.restore();
  }

  function render() {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    drawCurtainObject();

    state.lastRenderTime =
      performance.now();

    updateReceipt({
      lastAction:
        "window-object-rendered",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.RENDERED,
      {
        curtainAmount:
          state.curtainAmount,

        receipt:
          getReceipt()
      }
    );

    return true;
  }

  function stopRenderLoop() {
    state.running =
      false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf =
        0;
    }
  }

  function transitionStep(now) {
    state.raf =
      0;

    if (
      !state.transition ||
      state.disposed ||
      state.failed
    ) {
      state.running =
        false;

      return;
    }

    const transition =
      state.transition;

    const elapsed =
      now - transition.startTime;

    const raw =
      clamp(
        elapsed / transition.duration,
        0,
        1
      );

    const eased =
      transition.to > transition.from
        ? easeInOutCubic(raw)
        : easeOutCubic(raw);

    state.curtainAmount =
      lerp(
        transition.from,
        transition.to,
        eased
      );

    drawCurtainObject();

    updateReceipt({
      lastAction:
        "window-object-transition-rendered",

      transitionId:
        transition.id,

      transitionTarget:
        transition.to
    });

    if (raw < 1) {
      state.raf =
        requestAnimationFrame(transitionStep);

      return;
    }

    state.curtainAmount =
      transition.to;

    drawCurtainObject();

    const completed =
      state.transition;

    state.transition =
      null;

    state.running =
      false;

    updateReceipt({
      lastAction:
        completed.to >= 1
          ? "window-object-curtain-shown"
          : "window-object-curtain-hidden",

      transitionId:
        completed.id,

      transitionTarget:
        completed.to,

      lastFailure:
        null
    });

    dispatch(
      EVENTS.TRANSITION_COMPLETE,
      {
        transitionId:
          completed.id,

        curtainAmount:
          state.curtainAmount,

        receipt:
          getReceipt()
      }
    );
  }

  function startTransition(
    target,
    duration,
    reason
  ) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    const to =
      clamp(target, 0, 1);

    const from =
      clamp(state.curtainAmount, 0, 1);

    stopRenderLoop();

    const id =
      nowId("window-object-transition");

    state.transition =
      {
        id,
        from,
        to,
        startTime:
          performance.now(),

        duration:
          state.reducedMotion
            ? TIMING.reducedMs
            : Math.max(1, duration),

        reason:
          String(reason || "unspecified")
      };

    state.running =
      true;

    updateReceipt({
      lastAction:
        "window-object-transition-started",

      transitionId:
        id,

      transitionFrom:
        from,

      transitionTarget:
        to,

      transitionReason:
        state.transition.reason,

      lastFailure:
        null
    });

    dispatch(
      EVENTS.TRANSITION_START,
      {
        transitionId:
          id,

        from,
        to,

        reason:
          state.transition.reason,

        receipt:
          getReceipt()
      }
    );

    state.raf =
      requestAnimationFrame(transitionStep);

    return true;
  }

  function setCurtainAmount(value) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    stopRenderLoop();

    state.transition =
      null;

    state.curtainAmount =
      clamp(value, 0, 1);

    drawCurtainObject();

    updateReceipt({
      lastAction:
        "window-object-curtain-amount-set",

      lastFailure:
        null
    });

    return true;
  }

  function showCurtain(options = {}) {
    return startTransition(
      1,
      Number.isFinite(options.duration)
        ? options.duration
        : TIMING.showMs,
      options.reason || "showCurtain"
    );
  }

  function hideCurtain(options = {}) {
    return startTransition(
      0,
      Number.isFinite(options.duration)
        ? options.duration
        : TIMING.hideMs,
      options.reason || "hideCurtain"
    );
  }

  function bindResize() {
    if (
      state.resizeObserver ||
      state.resizeFallbackBound
    ) {
      return;
    }

    if (typeof ResizeObserver === "function") {
      state.resizeObserver =
        new ResizeObserver(
          () => {
            resize();
            drawCurtainObject();

            updateReceipt({
              lastAction:
                "window-object-resized"
            });
          }
        );

      state.resizeObserver.observe(
        state.mount
      );

      return;
    }

    state.resizeFallbackBound =
      true;

    globalThis.addEventListener(
      "resize",
      handleResizeFallback,
      {
        passive:
          true
      }
    );
  }

  function unbindResize() {
    if (state.resizeObserver) {
      state.resizeObserver.disconnect();

      state.resizeObserver =
        null;
    }

    if (state.resizeFallbackBound) {
      state.resizeFallbackBound =
        false;

      globalThis.removeEventListener(
        "resize",
        handleResizeFallback
      );
    }
  }

  function handleResizeFallback() {
    resize();
    drawCurtainObject();

    updateReceipt({
      lastAction:
        "window-object-resized"
    });
  }

  function bindReducedMotion() {
    if (state.reducedMotionBound) {
      return;
    }

    state.reducedMotionBound =
      true;

    if (typeof globalThis.matchMedia === "function") {
      state.reducedMotionQuery =
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        );

      state.reducedMotion =
        Boolean(state.reducedMotionQuery.matches);

      if (
        typeof state.reducedMotionQuery.addEventListener === "function"
      ) {
        state.reducedMotionQuery.addEventListener(
          "change",
          handleReducedMotionChange
        );
      } else if (
        typeof state.reducedMotionQuery.addListener === "function"
      ) {
        state.reducedMotionQuery.addListener(
          handleReducedMotionChange
        );
      }
    }
  }

  function unbindReducedMotion() {
    if (!state.reducedMotionBound) {
      return;
    }

    state.reducedMotionBound =
      false;

    if (state.reducedMotionQuery) {
      if (
        typeof state.reducedMotionQuery.removeEventListener === "function"
      ) {
        state.reducedMotionQuery.removeEventListener(
          "change",
          handleReducedMotionChange
        );
      } else if (
        typeof state.reducedMotionQuery.removeListener === "function"
      ) {
        state.reducedMotionQuery.removeListener(
          handleReducedMotionChange
        );
      }
    }

    state.reducedMotionQuery =
      null;
  }

  function handleReducedMotionChange() {
    state.reducedMotion =
      Boolean(
        state.reducedMotionQuery &&
        state.reducedMotionQuery.matches
      );

    updateReceipt({
      lastAction:
        "window-object-reduced-motion-updated"
    });
  }

  function dispose() {
    if (state.disposed) {
      return true;
    }

    stopRenderLoop();

    unbindResize();
    unbindReducedMotion();

    if (
      state.createdCanvas &&
      state.canvas
    ) {
      state.canvas.remove();
    } else if (state.canvas) {
      state.canvas
        .getContext("2d")
        ?.clearRect(
          0,
          0,
          state.canvas.width,
          state.canvas.height
        );
    }

    state.disposed =
      true;

    state.initialized =
      false;

    state.transition =
      null;

    state.canvas =
      null;

    state.context =
      null;

    updateReceipt({
      status:
        "disposed",

      initialized:
        false,

      disposed:
        true,

      canvasPresent:
        false,

      lastAction:
        "window-object-disposed",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.DISPOSED,
      {
        receipt:
          getReceipt()
      }
    );

    return true;
  }

  function getReceipt() {
    return Object.freeze({
      ...receipt
    });
  }

  function getGeometryReceipt() {
    if (!state.geometry) {
      return Object.freeze({
        present:
          false
      });
    }

    return Object.freeze({
      present:
        true,

      coordinateSystem:
        state.geometry.coordinateSystem,

      design:
        state.geometry.design,

      paneCount:
        state.geometry.panes.length,

      frameCurveCount:
        state.geometry.frame.curves.length,

      aperturePointCount:
        state.geometry.aperture.points.length,

      apertureTransparent:
        state.geometry.aperture.transparent,

      depth:
        state.geometry.depth,

      materialGroups:
        Object.keys(state.geometry.materials)
    });
  }

  function exposeObjectApi() {
    globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT =
      Object.freeze({
        contract:
          CONTRACT,

        events:
          EVENTS,

        showCurtain,

        hideCurtain,

        setCurtainAmount,

        resize:
          () => {
            const changed =
              resize();

            drawCurtainObject();

            updateReceipt({
              lastAction:
                "window-object-resize-requested",

              resized:
                changed
            });

            return changed;
          },

        render,

        dispose,

        getReceipt,

        getGeometryReceipt,

        getCurtainAmount:
          () => state.curtainAmount,

        isReady:
          () => Boolean(
            state.initialized &&
            !state.failed &&
            !state.disposed
          )
      });
  }

  function init() {
    try {
      state.mount =
        document.querySelector(
          SELECTORS.mount
        );

      if (!state.mount) {
        throw new Error(
          "SHOWROOM_WINDOW_MOUNT_NOT_FOUND"
        );
      }

      state.geometry =
        makeGeometry();

      if (state.geometry.panes.length !== 21) {
        throw new Error(
          `SHOWROOM_WINDOW_GEOMETRY_PANE_COUNT_INVALID:${state.geometry.panes.length}`
        );
      }

      state.canvas =
        createCanvas();

      state.context =
        state.canvas.getContext(
          "2d",
          {
            alpha:
              true,

            desynchronized:
              true
          }
        );

      if (!state.context) {
        state.context =
          state.canvas.getContext(
            "2d",
            {
              alpha:
                true
            }
          );
      }

      if (!state.context) {
        throw new Error(
          "SHOWROOM_WINDOW_CANVAS_2D_CONTEXT_UNAVAILABLE"
        );
      }

      state.curtainAmount =
        CONTRACT.defaultCurtainAmount;

      bindReducedMotion();
      bindResize();

      resize();

      state.initialized =
        true;

      exposeObjectApi();

      drawCurtainObject();

      updateReceipt({
        status:
          "available",

        initialized:
          true,

        canvasPresent:
          true,

        geometryPresent:
          true,

        curtainAmount:
          state.curtainAmount,

        lastAction:
          "window-object-initialized-default-curtain-visible",

        lastFailure:
          null
      });

      dispatch(
        EVENTS.READY,
        {
          receipt:
            getReceipt(),

          geometry:
            getGeometryReceipt()
        }
      );
    } catch (error) {
      exposeObjectApi();

      fail(
        error && error.message
          ? error.message
          : String(error)
      );
    }
  }

  if (document.readyState === "loading") {
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
