/* TARGET FILE: /showroom/index.window.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_WINDOW_OBJECT_v1_2_CRISP_3D_COMPOUND_CURTAIN_HOST */

/*
  Mirrorland Window Object Host

  Purpose:
  - Render the Mirrorland Window as a motionless 3D compound curtain.
  - Keep the Window as a foreground visual object over the Diamond.
  - Expose a stable object API for /showroom/index.window.controller.js.
  - Remain pointer-transparent except for behavior owned elsewhere.
  - Never own button behavior, Diamond behavior, route state, orbit gestures,
    Compass, stars, or broad page state.

  Strategic changes from prior object model:
  - Replace cartoon stroke language with compound layered geometry.
  - Treat glass as inset plates.
  - Treat lead came as raised strips.
  - Treat the frame as layered architectural bands.
  - Treat the aperture as a beveled transparent opening.
  - Keep the object frozen in time; splendor comes from material and depth.
  - Remove per-frame receipt/dataset writes during transitions.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_WINDOW_OBJECT_v1_2_CRISP_3D_COMPOUND_CURTAIN_HOST",

    previousId:
      "SHOWROOM_WINDOW_OBJECT_v1_TRUE_3D_CURTAIN_HOST",

    file:
      "/showroom/index.window.js",

    publicSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

    role:
      "visual-object-host-only",

    rendererModel:
      "canvas-2d-crisp-3d-compound-geometry-with-webgl-upgrade-seam",

    motionModel:
      "motionless-object-transition-only",

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

    starOwnership:
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
    rearOcclusion:
      -0.28,

    rearGlassShadow:
      -0.15,

    glassBack:
      -0.085,

    glassCore:
      -0.018,

    glassFace:
      0.018,

    glassBevel:
      0.050,

    cameSide:
      0.075,

    cameFace:
      0.132,

    mullionSide:
      0.150,

    mullionFace:
      0.220,

    frameBack:
      0.010,

    frameBody:
      0.125,

    frameFace:
      0.245,

    frameLip:
      0.318,

    apertureWall:
      0.155,

    apertureFace:
      0.298,

    apertureLip:
      0.370,

    surfaceAge:
      0.385
  });

  const MATERIALS = Object.freeze({
    frame:
      Object.freeze({
        shadow:
          Object.freeze([1, 2, 5]),

        black:
          Object.freeze([7, 10, 15]),

        body:
          Object.freeze([20, 25, 33]),

        stone:
          Object.freeze([34, 38, 44]),

        bevel:
          Object.freeze([58, 58, 62]),

        gold:
          Object.freeze([168, 117, 58]),

        goldBright:
          Object.freeze([232, 178, 96]),

        patina:
          Object.freeze([32, 66, 67]),

        coldEdge:
          Object.freeze([93, 126, 132])
      }),

    lead:
      Object.freeze({
        shadow:
          Object.freeze([4, 5, 9]),

        dark:
          Object.freeze([11, 13, 18]),

        body:
          Object.freeze([27, 29, 35]),

        bevel:
          Object.freeze([70, 70, 74]),

        highlight:
          Object.freeze([157, 145, 112]),

        cold:
          Object.freeze([80, 111, 116])
      }),

    aperture:
      Object.freeze({
        wall:
          Object.freeze([4, 5, 8]),

        bronze:
          Object.freeze([115, 75, 36]),

        gold:
          Object.freeze([204, 139, 62]),

        bright:
          Object.freeze([255, 218, 139]),

        cold:
          Object.freeze([122, 169, 181])
      }),

    glass:
      Object.freeze({
        frost:
          Object.freeze([132, 197, 203]),

        cyan:
          Object.freeze([58, 170, 181]),

        cyanDeep:
          Object.freeze([21, 111, 126]),

        blue:
          Object.freeze([42, 82, 151]),

        blueDeep:
          Object.freeze([16, 42, 98]),

        violet:
          Object.freeze([100, 64, 151]),

        violetDeep:
          Object.freeze([56, 36, 98]),

        rose:
          Object.freeze([151, 66, 99]),

        roseDeep:
          Object.freeze([95, 35, 65]),

        amber:
          Object.freeze([180, 119, 47]),

        amberDeep:
          Object.freeze([113, 69, 27]),

        paleViolet:
          Object.freeze([145, 115, 181])
      })
  });

  const RENDER = Object.freeze({
    maxDevicePixelRatio:
      2,

    objectScale:
      0.925,

    focalLength:
      3.35,

    perspectiveStrength:
      0.88,

    frozenTiltX:
      -0.038,

    frozenTiltY:
      0.058,

    frozenTiltZ:
      0,

    contactShadowAlpha:
      0.46,

    frameShadowBlur:
      20,

    glassAlpha:
      0.72,

    cameWidth:
      7.2,

    cameSideWidth:
      10.8,

    cameBevelWidth:
      4.2,

    cameHighlightWidth:
      1.15,

    outerFrameWidth:
      29,

    outerFrameFaceWidth:
      21,

    outerFrameLipWidth:
      5.8,

    innerFrameWidth:
      13,

    innerFrameLipWidth:
      3.3,

    mullionInset:
      7,

    apertureWallWidth:
      18,

    apertureFaceWidth:
      11.5,

    apertureLipWidth:
      2.5,

    textureLineCount:
      5,

    textureSpeckCount:
      32
  });

  const TIMING = Object.freeze({
    showMs:
      760,

    hideMs:
      980,

    reducedMs:
      80
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

    width:
      1,

    height:
      1,

    pixelRatio:
      1,

    geometry:
      null,

    curtainAmount:
      1,

    transition:
      null,

    raf:
      0,

    running:
      false,

    resizeObserver:
      null,

    resizeFallbackBound:
      false,

    reducedMotion:
      false,

    reducedMotionQuery:
      null,

    reducedMotionBound:
      false,

    initialized:
      false,

    disposed:
      false,

    failed:
      false,

    lastRenderTime:
      0
  };

  const receipt = {
    contractId:
      CONTRACT.id,

    previousContractId:
      CONTRACT.previousId,

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

    uniqueCameSegmentCount:
      0,

    frameBandCount:
      0,

    aperturePointCount:
      0,

    rendererModel:
      CONTRACT.rendererModel,

    motionModel:
      CONTRACT.motionModel,

    canvasPointerEvents:
      CONTRACT.canvasPointerEvents,

    perFrameReceiptWrites:
      false,

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

    ownsStars:
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

        uniqueCameSegmentCount:
          state.geometry
            ? state.geometry.cameSegments.length
            : 0,

        frameBandCount:
          state.geometry
            ? state.geometry.frameBands.length
            : 0,

        aperturePointCount:
          state.geometry
            ? state.geometry.aperture.outer.length
            : 0,

        perFrameReceiptWrites:
          false,

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

        ownsStars:
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
      state.canvas.dataset.showroomWindowObjectContract =
        CONTRACT.id;

      state.canvas.dataset.showroomWindowObjectStatus =
        receipt.status;

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

  function sourcePointKey(point) {
    return `${Math.round(point[0])},${Math.round(point[1])}`;
  }

  function segmentKey(
    a,
    b
  ) {
    const keyA =
      sourcePointKey(a);

    const keyB =
      sourcePointKey(b);

    return keyA < keyB
      ? `${keyA}|${keyB}`
      : `${keyB}|${keyA}`;
  }

  function createPane(
    id,
    sourcePoints,
    material,
    options = {}
  ) {
    return freezeDeep({
      id,

      sourcePoints:
        sourcePoints.map(point =>
          Object.freeze([point[0], point[1]])
        ),

      points:
        normalizePolygon(sourcePoints, DEPTH.glassCore),

      material,

      rearZ:
        DEPTH.glassBack,

      coreZ:
        DEPTH.glassCore,

      faceZ:
        DEPTH.glassFace,

      bevelZ:
        DEPTH.glassBevel,

      alpha:
        options.alpha ?? 0.70,

      age:
        options.age ?? 0.42,

      refraction:
        options.refraction ?? 0.28,

      internalContrast:
        options.internalContrast ?? 0.32,

      coldLight:
        options.coldLight ?? 0.22,

      warmLight:
        options.warmLight ?? 0.10,

      phase:
        options.phase ?? 0
    });
  }

  function buildPanes() {
    const glass =
      MATERIALS.glass;

    return Object.freeze([
      createPane(
        "crown-left",
        [[240, 48], [164, 108], [204, 168], [240, 134]],
        glass.frost,
        { alpha: 0.64, refraction: 0.38, coldLight: 0.30, phase: 0.12 }
      ),

      createPane(
        "crown-right",
        [[240, 48], [240, 134], [278, 168], [318, 108]],
        glass.paleViolet,
        { alpha: 0.63, refraction: 0.35, phase: 0.44 }
      ),

      createPane(
        "upper-left-edge",
        [[164, 108], [98, 210], [154, 246], [204, 168]],
        glass.blue,
        { alpha: 0.69, age: 0.50, internalContrast: 0.42, phase: 0.82 }
      ),

      createPane(
        "upper-right-edge",
        [[318, 108], [278, 168], [326, 246], [382, 210]],
        glass.violet,
        { alpha: 0.68, age: 0.48, internalContrast: 0.40, phase: 1.16 }
      ),

      createPane(
        "upper-center-left",
        [[204, 168], [154, 246], [216, 268], [240, 208], [240, 134]],
        glass.cyan,
        { alpha: 0.65, refraction: 0.36, coldLight: 0.30, phase: 1.52 }
      ),

      createPane(
        "upper-center-right",
        [[240, 134], [240, 208], [264, 268], [326, 246], [278, 168]],
        glass.rose,
        { alpha: 0.64, refraction: 0.32, warmLight: 0.17, phase: 1.88 }
      ),

      createPane(
        "mid-left-high",
        [[98, 210], [66, 332], [148, 338], [154, 246]],
        glass.blueDeep,
        { alpha: 0.71, age: 0.58, internalContrast: 0.45, phase: 2.22 }
      ),

      createPane(
        "mid-left-inner",
        [[154, 246], [148, 338], [212, 334], [216, 268]],
        glass.violetDeep,
        { alpha: 0.69, age: 0.50, phase: 2.58 }
      ),

      createPane(
        "mid-center",
        [[216, 268], [212, 334], [240, 382], [268, 334], [264, 268], [240, 208]],
        glass.frost,
        { alpha: 0.58, refraction: 0.44, coldLight: 0.34, phase: 2.93 }
      ),

      createPane(
        "mid-right-inner",
        [[264, 268], [268, 334], [332, 338], [326, 246]],
        glass.cyanDeep,
        { alpha: 0.68, age: 0.46, phase: 3.18 }
      ),

      createPane(
        "mid-right-high",
        [[326, 246], [332, 338], [414, 332], [382, 210]],
        glass.blue,
        { alpha: 0.69, age: 0.52, internalContrast: 0.42, phase: 3.54 }
      ),

      createPane(
        "lower-left-edge",
        [[66, 332], [82, 470], [156, 446], [148, 338]],
        glass.roseDeep,
        { alpha: 0.70, age: 0.60, warmLight: 0.18, phase: 3.90 }
      ),

      createPane(
        "lower-left-center",
        [[148, 338], [156, 446], [216, 430], [240, 382], [212, 334]],
        glass.cyan,
        { alpha: 0.66, refraction: 0.34, coldLight: 0.28, phase: 4.23 }
      ),

      createPane(
        "lower-right-center",
        [[268, 334], [240, 382], [264, 430], [324, 446], [332, 338]],
        glass.violet,
        { alpha: 0.66, refraction: 0.32, phase: 4.55 }
      ),

      createPane(
        "lower-right-edge",
        [[332, 338], [324, 446], [398, 470], [414, 332]],
        glass.amber,
        { alpha: 0.69, age: 0.54, warmLight: 0.26, phase: 4.92 }
      ),

      createPane(
        "lower-left-deep",
        [[82, 470], [116, 594], [192, 530], [156, 446]],
        glass.blue,
        { alpha: 0.70, age: 0.56, internalContrast: 0.42, phase: 5.24 }
      ),

      createPane(
        "lower-center-left",
        [[156, 446], [192, 530], [240, 624], [240, 500], [216, 430]],
        glass.paleViolet,
        { alpha: 0.64, refraction: 0.34, phase: 5.56 }
      ),

      createPane(
        "lower-center-right",
        [[264, 430], [240, 500], [240, 624], [288, 530], [324, 446]],
        glass.rose,
        { alpha: 0.64, refraction: 0.33, warmLight: 0.16, phase: 5.92 }
      ),

      createPane(
        "lower-right-deep",
        [[324, 446], [288, 530], [364, 594], [398, 470]],
        glass.cyanDeep,
        { alpha: 0.69, age: 0.53, coldLight: 0.22, phase: 6.23 }
      ),

      createPane(
        "base-left",
        [[116, 594], [168, 660], [240, 676], [240, 624], [192, 530]],
        glass.amberDeep,
        { alpha: 0.68, age: 0.58, warmLight: 0.24, phase: 6.54 }
      ),

      createPane(
        "base-right",
        [[288, 530], [240, 624], [240, 676], [312, 660], [364, 594]],
        glass.blueDeep,
        { alpha: 0.69, age: 0.54, internalContrast: 0.42, phase: 6.88 }
      )
    ]);
  }

  function collectCameSegments(panes) {
    const map =
      new Map();

    panes.forEach(pane => {
      pane.sourcePoints.forEach(
        (point, index) => {
          const next =
            pane.sourcePoints[
              (index + 1) % pane.sourcePoints.length
            ];

          const key =
            segmentKey(point, next);

          if (!map.has(key)) {
            map.set(
              key,
              freezeDeep({
                id:
                  `came-${map.size + 1}`,

                source:
                  Object.freeze([
                    Object.freeze([point[0], point[1]]),
                    Object.freeze([next[0], next[1]])
                  ]),

                points:
                  Object.freeze([
                    normalizePoint(point, DEPTH.cameFace),
                    normalizePoint(next, DEPTH.cameFace)
                  ])
              })
            );
          }
        }
      );
    });

    return Object.freeze(
      Array.from(map.values())
    );
  }

  function buildFrameBands() {
    const outerLeft =
      [[240, 22], [174, 50], [111, 112], [70, 210], [50, 338], [62, 478], [106, 592], [165, 662], [240, 706]];

    const outerRight =
      [[240, 22], [306, 50], [369, 112], [410, 210], [430, 338], [418, 478], [374, 592], [315, 662], [240, 706]];

    const faceLeft =
      [[240, 31], [178, 61], [120, 122], [82, 216], [64, 340], [75, 470], [116, 580], [172, 649], [240, 692]];

    const faceRight =
      [[240, 31], [302, 61], [360, 122], [398, 216], [416, 340], [405, 470], [364, 580], [308, 649], [240, 692]];

    const innerLeft =
      [[240, 55], [184, 85], [132, 150], [98, 238], [84, 342], [94, 458], [132, 560], [181, 628], [240, 672]];

    const innerRight =
      [[240, 55], [296, 85], [348, 150], [382, 238], [396, 342], [386, 458], [348, 560], [299, 628], [240, 672]];

    const mullionTop =
      [[233, 62], [247, 62], [247, 228], [233, 228]];

    const mullionBottom =
      [[233, 428], [247, 428], [247, 674], [233, 674]];

    const topCap =
      [[224, 30], [256, 30], [276, 45], [260, 62], [220, 62], [204, 45]];

    const bottomCap =
      [[218, 676], [262, 676], [278, 694], [240, 710], [202, 694]];

    function band(
      id,
      source,
      z,
      width,
      tier
    ) {
      return freezeDeep({
        id,
        source:
          source.map(point =>
            Object.freeze([point[0], point[1]])
          ),

        points:
          normalizePolygon(source, z),

        z,
        width,
        tier
      });
    }

    return Object.freeze([
      band("outer-left-back-band", outerLeft, DEPTH.frameBack, RENDER.outerFrameWidth, "outer-back"),
      band("outer-right-back-band", outerRight, DEPTH.frameBack, RENDER.outerFrameWidth, "outer-back"),
      band("outer-left-face-band", faceLeft, DEPTH.frameFace, RENDER.outerFrameFaceWidth, "outer-face"),
      band("outer-right-face-band", faceRight, DEPTH.frameFace, RENDER.outerFrameFaceWidth, "outer-face"),
      band("inner-left-lip-band", innerLeft, DEPTH.frameLip, RENDER.innerFrameWidth, "inner-lip"),
      band("inner-right-lip-band", innerRight, DEPTH.frameLip, RENDER.innerFrameWidth, "inner-lip"),
      band("center-mullion-top-compound", mullionTop, DEPTH.mullionFace, 0, "mullion"),
      band("center-mullion-bottom-compound", mullionBottom, DEPTH.mullionFace, 0, "mullion"),
      band("top-metal-cap", topCap, DEPTH.frameLip, 0, "cap"),
      band("bottom-metal-cap", bottomCap, DEPTH.frameLip, 0, "cap")
    ]);
  }

  function buildAperture() {
    const outer =
      [[240, 232], [283, 328], [240, 424], [197, 328]];

    const middle =
      [[240, 252], [268, 328], [240, 404], [212, 328]];

    const inner =
      [[240, 272], [258, 328], [240, 384], [222, 328]];

    const clear =
      [[240, 266], [264, 328], [240, 390], [216, 328]];

    return freezeDeep({
      id:
        "central-diamond-aperture-compound",

      transparent:
        true,

      outer:
        normalizePolygon(outer, DEPTH.apertureFace),

      middle:
        normalizePolygon(middle, DEPTH.apertureLip),

      inner:
        normalizePolygon(inner, DEPTH.apertureWall),

      clear:
        normalizePolygon(clear, DEPTH.apertureLip),

      source:
        Object.freeze({
          outer:
            outer.map(point => Object.freeze([point[0], point[1]])),

          middle:
            middle.map(point => Object.freeze([point[0], point[1]])),

          inner:
            inner.map(point => Object.freeze([point[0], point[1]])),

          clear:
            clear.map(point => Object.freeze([point[0], point[1]]))
        }),

      subtractivePhase1:
        "canvas-destination-out",

      subtractiveFuture:
        "explicit-3d-aperture-bevel-geometry"
    });
  }

  function makeGeometry() {
    const panes =
      buildPanes();

    const cameSegments =
      collectCameSegments(panes);

    const frameBands =
      buildFrameBands();

    const aperture =
      buildAperture();

    return freezeDeep({
      contractId:
        CONTRACT.id,

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
            "center-of-original-window-design",

          motion:
            "object-frozen-in-time"
        }),

      design:
        DESIGN,

      depth:
        DEPTH,

      materials:
        MATERIALS,

      panes,
      cameSegments,
      frameBands,
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

    x = x3;
    y = y3;

    return {
      x,
      y,
      z
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
        RENDER.frozenTiltX,
        RENDER.frozenTiltY,
        RENDER.frozenTiltZ
      );

    const perspective =
      RENDER.focalLength /
      (
        RENDER.focalLength -
        rotated.z * RENDER.perspectiveStrength
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
      projectPoint(point, layout, extraZ)
    );
  }

  function tracePolygon(
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

  function traceCurve(
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

  function boundsOf(points) {
    return points.reduce(
      (bounds, point) => ({
        minX:
          Math.min(bounds.minX, point.x),

        maxX:
          Math.max(bounds.maxX, point.x),

        minY:
          Math.min(bounds.minY, point.y),

        maxY:
          Math.max(bounds.maxY, point.y)
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

  function lineWidth(value) {
    const scale =
      Math.max(
        0.75,
        Math.min(
          2.4,
          Math.min(state.width, state.height) / 760
        )
      );

    return value * scale;
  }

  function makeLayout() {
    const cssWidth =
      state.width / state.pixelRatio;

    const cssHeight =
      state.height / state.pixelRatio;

    const fit =
      Math.min(
        cssWidth / DESIGN.width,
        cssHeight / DESIGN.height
      );

    const objectScale =
      fit * RENDER.objectScale;

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

      objectScale
    };
  }

  function createCanvas() {
    const existing =
      state.mount.querySelector(
        SELECTORS.existingCanvas
      );

    const canvas =
      existing ||
      document.createElement("canvas");

    state.createdCanvas =
      !existing;

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

    if (!existing) {
      state.mount.appendChild(canvas);
    }

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

  function drawContactShadow(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.002) {
      return;
    }

    context.save();

    const gradient =
      context.createRadialGradient(
        layout.centerX,
        layout.centerY + layout.scaleY * 0.06,
        layout.scaleX * 0.16,
        layout.centerX,
        layout.centerY + layout.scaleY * 0.04,
        layout.scaleX * 1.04
      );

    gradient.addColorStop(
      0,
      `rgba(0, 0, 0, ${0.10 * amount})`
    );

    gradient.addColorStop(
      0.55,
      `rgba(0, 0, 0, ${0.28 * amount})`
    );

    gradient.addColorStop(
      1,
      `rgba(0, 0, 0, ${RENDER.contactShadowAlpha * amount})`
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

  function drawFrameBand(
    context,
    band,
    layout,
    amount
  ) {
    if (amount <= 0.002) {
      return;
    }

    const projected =
      projectPolygon(
        band.points,
        layout
      );

    context.save();

    context.globalAlpha =
      amount;

    if (
      band.tier === "mullion" ||
      band.tier === "cap"
    ) {
      tracePolygon(
        context,
        projected
      );

      const box =
        boundsOf(projected);

      const gradient =
        context.createLinearGradient(
          box.minX,
          box.minY,
          box.maxX,
          box.maxY
        );

      gradient.addColorStop(
        0,
        rgba(MATERIALS.frame.shadow, 0.96)
      );

      gradient.addColorStop(
        0.34,
        rgba(MATERIALS.frame.body, 0.97)
      );

      gradient.addColorStop(
        0.64,
        rgba(MATERIALS.frame.bevel, 0.88)
      );

      gradient.addColorStop(
        1,
        rgba(MATERIALS.frame.shadow, 0.98)
      );

      context.fillStyle =
        gradient;

      context.shadowBlur =
        lineWidth(8) * amount;

      context.shadowColor =
        `rgba(0, 0, 0, ${0.46 * amount})`;

      context.fill();

      context.shadowBlur =
        0;

      tracePolygon(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.gold, 0.22 * amount);

      context.lineWidth =
        lineWidth(1.2);

      context.stroke();

      context.restore();

      return;
    }

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    if (band.tier === "outer-back") {
      traceCurve(
        context,
        projected
      );

      context.shadowBlur =
        lineWidth(RENDER.frameShadowBlur) * amount;

      context.shadowColor =
        `rgba(0, 0, 0, ${0.68 * amount})`;

      context.strokeStyle =
        rgba(MATERIALS.frame.shadow, 0.94 * amount);

      context.lineWidth =
        lineWidth(band.width + 8);

      context.stroke();

      context.shadowBlur =
        0;
    }

    if (band.tier === "outer-face") {
      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.black, 0.98 * amount);

      context.lineWidth =
        lineWidth(band.width + 4);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.body, 0.96 * amount);

      context.lineWidth =
        lineWidth(band.width);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.patina, 0.18 * amount);

      context.lineWidth =
        lineWidth(band.width * 0.62);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.gold, 0.34 * amount);

      context.lineWidth =
        lineWidth(RENDER.outerFrameLipWidth);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.goldBright, 0.20 * amount);

      context.lineWidth =
        lineWidth(1.1);

      context.stroke();
    }

    if (band.tier === "inner-lip") {
      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.shadow, 0.86 * amount);

      context.lineWidth =
        lineWidth(band.width + 5);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.body, 0.95 * amount);

      context.lineWidth =
        lineWidth(band.width);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.gold, 0.30 * amount);

      context.lineWidth =
        lineWidth(RENDER.innerFrameLipWidth);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.coldEdge, 0.14 * amount);

      context.lineWidth =
        lineWidth(0.9);

      context.stroke();
    }

    context.restore();
  }

  function drawFrameBands(
    context,
    layout,
    amount
  ) {
    state.geometry.frameBands
      .filter(band => band.tier === "outer-back")
      .forEach(band => drawFrameBand(context, band, layout, amount));

    state.geometry.frameBands
      .filter(band => band.tier === "outer-face")
      .forEach(band => drawFrameBand(context, band, layout, amount));

    state.geometry.frameBands
      .filter(band => band.tier === "inner-lip")
      .forEach(band => drawFrameBand(context, band, layout, amount));
  }

  function glassGradient(
    context,
    pane,
    projected,
    amount
  ) {
    const box =
      boundsOf(projected);

    const gradient =
      context.createLinearGradient(
        box.minX,
        box.minY,
        box.maxX,
        box.maxY
      );

    gradient.addColorStop(
      0,
      rgba(pane.material, pane.alpha * 0.22 * amount)
    );

    gradient.addColorStop(
      0.24,
      rgba(pane.material, pane.alpha * 0.72 * amount)
    );

    gradient.addColorStop(
      0.48,
      rgba(pane.material, pane.alpha * 0.52 * amount)
    );

    gradient.addColorStop(
      0.76,
      rgba(pane.material, pane.alpha * 0.82 * amount)
    );

    gradient.addColorStop(
      1,
      rgba(pane.material, pane.alpha * 0.24 * amount)
    );

    return gradient;
  }

  function drawGlassSidewalls(
    context,
    pane,
    layout,
    amount
  ) {
    const rear =
      projectPolygon(
        pane.points,
        layout,
        pane.rearZ - pane.coreZ
      );

    const face =
      projectPolygon(
        pane.points,
        layout,
        pane.faceZ - pane.coreZ
      );

    context.save();

    context.globalAlpha =
      amount;

    for (
      let index = 0;
      index < face.length;
      index += 1
    ) {
      const next =
        (index + 1) % face.length;

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
        face[next].x,
        face[next].y
      );

      context.lineTo(
        face[index].x,
        face[index].y
      );

      context.closePath();

      context.fillStyle =
        rgba(
          pane.material,
          0.15 * amount
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
    const box =
      boundsOf(projected);

    const width =
      Math.max(1, box.maxX - box.minX);

    const height =
      Math.max(1, box.maxY - box.minY);

    context.save();

    tracePolygon(
      context,
      projected
    );

    context.clip();

    const haze =
      context.createRadialGradient(
        box.minX + width * 0.34,
        box.minY + height * 0.24,
        1,
        box.minX + width * 0.47,
        box.minY + height * 0.42,
        Math.max(width, height) * 0.86
      );

    haze.addColorStop(
      0,
      `rgba(255, 255, 255, ${0.10 * pane.refraction * amount})`
    );

    haze.addColorStop(
      0.38,
      `rgba(255, 255, 255, ${0.034 * amount})`
    );

    haze.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      haze;

    context.fillRect(
      box.minX,
      box.minY,
      width,
      height
    );

    context.lineWidth =
      lineWidth(0.58);

    for (
      let index = 0;
      index < RENDER.textureLineCount;
      index += 1
    ) {
      const seed =
        pane.phase * 19.31 + index * 7.17;

      const x =
        box.minX +
        width *
          (
            0.10 +
            0.78 *
              (
                Math.sin(seed) * 0.5 + 0.5
              )
          );

      const y =
        box.minY +
        height *
          (
            0.08 +
            0.76 *
              (
                Math.sin(seed * 1.37) * 0.5 + 0.5
              )
          );

      context.beginPath();

      context.moveTo(
        x,
        y
      );

      context.bezierCurveTo(
        x + Math.sin(seed * 0.83) * width * 0.10,
        y + height * 0.18,
        x + Math.cos(seed * 0.59) * width * 0.14,
        y + height * 0.44,
        x + Math.sin(seed * 1.03) * width * 0.07,
        y + height * 0.76
      );

      context.strokeStyle =
        `rgba(255, 255, 255, ${0.038 * pane.age * amount})`;

      context.stroke();
    }

    for (
      let index = 0;
      index < 4;
      index += 1
    ) {
      const seed =
        pane.phase * 11.73 + index * 5.91;

      const x =
        box.minX + width * (Math.sin(seed) * 0.5 + 0.5);

      const y =
        box.minY + height * (Math.cos(seed * 1.9) * 0.5 + 0.5);

      context.fillStyle =
        `rgba(235, 242, 228, ${0.026 * pane.age * amount})`;

      context.fillRect(
        x,
        y,
        lineWidth(0.75),
        lineWidth(0.75)
      );
    }

    context.restore();
  }

  function drawGlassPane(
    context,
    pane,
    layout,
    amount
  ) {
    if (amount <= 0.002) {
      return;
    }

    drawGlassSidewalls(
      context,
      pane,
      layout,
      amount
    );

    const face =
      projectPolygon(
        pane.points,
        layout,
        pane.faceZ - pane.coreZ
      );

    context.save();

    context.globalAlpha =
      amount;

    tracePolygon(
      context,
      face
    );

    context.shadowBlur =
      lineWidth(4.5) * amount;

    context.shadowColor =
      rgba(
        pane.material,
        0.14 * amount
      );

    context.fillStyle =
      glassGradient(
        context,
        pane,
        face,
        amount
      );

    context.fill();

    context.shadowBlur =
      0;

    tracePolygon(
      context,
      face
    );

    context.strokeStyle =
      `rgba(255, 255, 255, ${0.09 * amount})`;

    context.lineWidth =
      lineWidth(0.78);

    context.stroke();

    drawGlassTexture(
      context,
      pane,
      face,
      amount
    );

    context.restore();
  }

  function drawGlassPanes(
    context,
    layout,
    amount
  ) {
    state.geometry.panes.forEach(
      pane => drawGlassPane(context, pane, layout, amount)
    );
  }

  function drawCameSegment(
    context,
    segment,
    layout,
    amount
  ) {
    const side =
      projectPolygon(
        segment.points,
        layout,
        DEPTH.cameSide - DEPTH.cameFace
      );

    const face =
      projectPolygon(
        segment.points,
        layout,
        0
      );

    context.save();

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    context.globalAlpha =
      amount;

    context.beginPath();

    context.moveTo(
      side[0].x,
      side[0].y
    );

    context.lineTo(
      side[1].x,
      side[1].y
    );

    context.strokeStyle =
      rgba(MATERIALS.lead.shadow, 0.92 * amount);

    context.lineWidth =
      lineWidth(RENDER.cameSideWidth);

    context.stroke();

    context.beginPath();

    context.moveTo(
      face[0].x,
      face[0].y
    );

    context.lineTo(
      face[1].x,
      face[1].y
    );

    context.strokeStyle =
      rgba(MATERIALS.lead.dark, 0.98 * amount);

    context.lineWidth =
      lineWidth(RENDER.cameWidth + 1.3);

    context.stroke();

    context.beginPath();

    context.moveTo(
      face[0].x,
      face[0].y
    );

    context.lineTo(
      face[1].x,
      face[1].y
    );

    context.strokeStyle =
      rgba(MATERIALS.lead.body, 0.98 * amount);

    context.lineWidth =
      lineWidth(RENDER.cameWidth);

    context.stroke();

    context.beginPath();

    context.moveTo(
      face[0].x,
      face[0].y
    );

    context.lineTo(
      face[1].x,
      face[1].y
    );

    context.strokeStyle =
      rgba(MATERIALS.lead.bevel, 0.38 * amount);

    context.lineWidth =
      lineWidth(RENDER.cameBevelWidth);

    context.stroke();

    context.beginPath();

    context.moveTo(
      face[0].x,
      face[0].y
    );

    context.lineTo(
      face[1].x,
      face[1].y
    );

    context.strokeStyle =
      rgba(MATERIALS.lead.highlight, 0.24 * amount);

    context.lineWidth =
      lineWidth(RENDER.cameHighlightWidth);

    context.stroke();

    context.restore();
  }

  function drawLeadCame(
    context,
    layout,
    amount
  ) {
    state.geometry.cameSegments.forEach(
      segment => drawCameSegment(context, segment, layout, amount)
    );
  }

  function drawMullionsAndCaps(
    context,
    layout,
    amount
  ) {
    state.geometry.frameBands
      .filter(
        band =>
          band.tier === "mullion" ||
          band.tier === "cap"
      )
      .forEach(
        band => drawFrameBand(context, band, layout, amount)
      );
  }

  function drawApertureClear(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.002) {
      return;
    }

    const clear =
      projectPolygon(
        state.geometry.aperture.clear,
        layout
      );

    context.save();

    context.globalCompositeOperation =
      "destination-out";

    tracePolygon(
      context,
      clear
    );

    context.fillStyle =
      "rgba(0, 0, 0, 1)";

    context.fill();

    context.restore();
  }

  function drawApertureBevel(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.002) {
      return;
    }

    const outer =
      projectPolygon(
        state.geometry.aperture.outer,
        layout
      );

    const middle =
      projectPolygon(
        state.geometry.aperture.middle,
        layout
      );

    const inner =
      projectPolygon(
        state.geometry.aperture.inner,
        layout
      );

    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    tracePolygon(
      context,
      outer
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.wall, 0.96 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureWallWidth);

    context.shadowBlur =
      lineWidth(8) * amount;

    context.shadowColor =
      `rgba(0, 0, 0, ${0.60 * amount})`;

    context.stroke();

    context.shadowBlur =
      0;

    tracePolygon(
      context,
      outer
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.bronze, 0.92 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureFaceWidth);

    context.stroke();

    tracePolygon(
      context,
      middle
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.gold, 0.70 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureFaceWidth * 0.60);

    context.stroke();

    tracePolygon(
      context,
      inner
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.bright, 0.36 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureLipWidth);

    context.stroke();

    tracePolygon(
      context,
      inner
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.cold, 0.22 * amount);

    context.lineWidth =
      lineWidth(0.85);

    context.stroke();

    context.restore();
  }

  function drawSurfaceAge(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.05) {
      return;
    }

    context.save();

    context.globalCompositeOperation =
      "screen";

    for (
      let index = 0;
      index < RENDER.textureSpeckCount;
      index += 1
    ) {
      const seed =
        index * 15.873;

      const x =
        layout.centerX +
        Math.sin(seed) * layout.scaleX * 0.74 +
        Math.sin(seed * 0.31) * layout.scaleX * 0.08;

      const y =
        layout.centerY +
        Math.cos(seed * 0.79) * layout.scaleY * 0.83;

      const radius =
        lineWidth(
          0.32 +
          (Math.sin(seed * 2.31) * 0.5 + 0.5) * 0.76
        );

      context.beginPath();

      context.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        `rgba(225, 218, 185, ${0.018 * amount})`;

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

    resize();
    clearCanvas();

    const amount =
      clamp(state.curtainAmount, 0, 1);

    if (amount <= 0.002) {
      return;
    }

    const context =
      state.context;

    const layout =
      makeLayout();

    context.save();

    context.scale(
      state.pixelRatio,
      state.pixelRatio
    );

    drawContactShadow(context, layout, amount);
    drawFrameBands(context, layout, amount);
    drawGlassPanes(context, layout, amount);
    drawLeadCame(context, layout, amount);
    drawMullionsAndCaps(context, layout, amount);
    drawApertureClear(context, layout, amount);
    drawApertureBevel(context, layout, amount);
    drawSurfaceAge(context, layout, amount);

    context.restore();

    state.lastRenderTime =
      performance.now();
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

  function handleResizeFallback() {
    resize();
    drawCurtainObject();

    updateReceipt({
      lastAction:
        "window-object-resized"
    });
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
      const context =
        state.canvas.getContext("2d");

      if (context) {
        context.clearRect(
          0,
          0,
          state.canvas.width,
          state.canvas.height
        );
      }
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

      uniqueCameSegmentCount:
        state.geometry.cameSegments.length,

      frameBandCount:
        state.geometry.frameBands.length,

      aperturePointCount:
        state.geometry.aperture.outer.length,

      apertureTransparent:
        state.geometry.aperture.transparent,

      depth:
        state.geometry.depth,

      materialGroups:
        Object.keys(state.geometry.materials),

      geometryQualityIntent:
        "crisp-compound-frame-came-glass-aperture-depth"
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
          "window-object-initialized-crisp-3d-curtain-visible",

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
