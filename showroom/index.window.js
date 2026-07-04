/* TARGET FILE: /showroom/index.window.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_WINDOW_OBJECT_v1_3_FOREGROUND_LENS_APERTURE_FOCUS_OPTIMIZED_BASE */

/*
  Mirrorland Window Object Host

  Purpose:
  - Render the Mirrorland Window as a foreground stained-glass lens over the Diamond.
  - Keep the Diamond relationship visually readable through the aperture and filtered glass.
  - Make the central aperture the focal chrome-gold optical threshold.
  - Become visually dormant when open so the Diamond can be revealed and manipulated.
  - Expose a stable object API for /showroom/index.window.controller.js.
  - Remain pointer-transparent except for behavior owned elsewhere.
  - Never own button behavior, Diamond behavior, route state, orbit gestures,
    Compass, stars, or broad page state.

  v1_3 optimization:
  - Replaces blackout behavior with object-local shadow.
  - Refines aperture geometry for a stronger Diamond focus.
  - Narrows and interrupts central mullion geometry.
  - Makes glass panes behave as transmissive foreground lens plates.
  - Adds chrome-gold aperture material model.
  - Adds definition-ready receipt fields without consuming an external definition file.
  - Preserves the public API and controller contract from v1_2.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_WINDOW_OBJECT_v1_3_FOREGROUND_LENS_APERTURE_FOCUS_OPTIMIZED_BASE",

    previousId:
      "SHOWROOM_WINDOW_OBJECT_v1_2_CRISP_3D_COMPOUND_CURTAIN_HOST",

    file:
      "/showroom/index.window.js",

    publicSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

    role:
      "visual-object-host-only",

    rendererModel:
      "canvas-2d-foreground-lens-aperture-focus-definition-ready",

    motionModel:
      "motionless-object-transition-only",

    foregroundLensModel:
      true,

    apertureFocusModel:
      true,

    definitionReady:
      true,

    definitionExternalized:
      false,

    definitionConsumerReady:
      true,

    defaultCurtainAmount:
      1,

    canvasPointerEvents:
      "none",

    dormantWhenOpen:
      true,

    openStateRenderSuppressed:
      true,

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
      -0.20,

    rearGlassShadow:
      -0.12,

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

    apertureGlow:
      0.382,

    surfaceAge:
      0.392
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

        goldHairline:
          Object.freeze([238, 189, 104]),

        cold:
          Object.freeze([80, 111, 116])
      }),

    aperture:
      Object.freeze({
        wall:
          Object.freeze([3, 4, 7]),

        deepBronze:
          Object.freeze([94, 58, 24]),

        bronze:
          Object.freeze([139, 86, 32]),

        gold:
          Object.freeze([225, 154, 54]),

        chromeGold:
          Object.freeze([255, 196, 78]),

        bright:
          Object.freeze([255, 225, 142]),

        whiteGold:
          Object.freeze([255, 244, 203]),

        cold:
          Object.freeze([126, 194, 210]),

        coldEdge:
          Object.freeze([87, 168, 194]),

        innerLight:
          Object.freeze([255, 212, 105])
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

    objectShadowAlpha:
      0.28,

    objectShadowBlur:
      22,

    frameShadowBlur:
      18,

    glassAlpha:
      0.46,

    glassTransmission:
      0.54,

    centerGlassTransmission:
      0.68,

    cameWidth:
      6.7,

    cameSideWidth:
      9.8,

    cameBevelWidth:
      3.7,

    cameHighlightWidth:
      1.05,

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
      20,

    apertureFaceWidth:
      13.5,

    apertureChromeWidth:
      8.4,

    apertureLipWidth:
      2.9,

    apertureGlowAlpha:
      0.40,

    apertureSpecularAlpha:
      0.72,

    apertureInnerGlowAlpha:
      0.24,

    textureLineCount:
      5,

    textureSpeckCount:
      28
  });

  const TIMING = Object.freeze({
    showMs:
      760,

    hideMs:
      980,

    reducedMs:
      80
  });

  const VISIBILITY = Object.freeze({
    hiddenCutoff:
      0.002,

    transitionHiddenCutoff:
      0.004
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
      0,

    dormant:
      false
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

    canvasDormant:
      false,

    dormantWhenOpen:
      true,

    openStateRenderSuppressed:
      true,

    foregroundLensModel:
      true,

    apertureFocusModel:
      true,

    definitionReady:
      true,

    definitionExternalized:
      false,

    definitionConsumerReady:
      true,

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

  function isCurtainHidden(value = state.curtainAmount) {
    return clamp(value, 0, 1) <= VISIBILITY.hiddenCutoff;
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

        canvasDormant:
          Boolean(state.dormant || isCurtainHidden()),

        dormantWhenOpen:
          true,

        openStateRenderSuppressed:
          true,

        foregroundLensModel:
          true,

        apertureFocusModel:
          true,

        definitionReady:
          true,

        definitionExternalized:
          false,

        definitionConsumerReady:
          true,

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

      state.canvas.dataset.showroomWindowCanvasDormant =
        receipt.canvasDormant
          ? "true"
          : "false";

      state.canvas.dataset.visualPassClaimed =
        "false";
    }

    if (state.mount) {
      state.mount.dataset.showroomWindowObjectStatus =
        receipt.status;

      state.mount.dataset.showroomWindowObjectContract =
        CONTRACT.id;

      state.mount.dataset.showroomWindowCanvasDormant =
        receipt.canvasDormant
          ? "true"
          : "false";

      state.mount.dataset.showroomWindowForegroundLens =
        "true";

      state.mount.dataset.showroomWindowApertureFocus =
        "true";

      state.mount.dataset.visualPassClaimed =
        "false";
    }
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
        options.alpha ?? 0.44,

      age:
        options.age ?? 0.42,

      refraction:
        options.refraction ?? 0.34,

      internalContrast:
        options.internalContrast ?? 0.28,

      coldLight:
        options.coldLight ?? 0.22,

      warmLight:
        options.warmLight ?? 0.10,

      transmission:
        options.transmission ?? RENDER.glassTransmission,

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
        { alpha: 0.42, transmission: 0.58, refraction: 0.40, coldLight: 0.30, phase: 0.12 }
      ),

      createPane(
        "crown-right",
        [[240, 48], [240, 134], [278, 168], [318, 108]],
        glass.paleViolet,
        { alpha: 0.41, transmission: 0.58, refraction: 0.37, phase: 0.44 }
      ),

      createPane(
        "upper-left-edge",
        [[164, 108], [98, 210], [154, 246], [204, 168]],
        glass.blue,
        { alpha: 0.46, transmission: 0.52, age: 0.50, internalContrast: 0.38, phase: 0.82 }
      ),

      createPane(
        "upper-right-edge",
        [[318, 108], [278, 168], [326, 246], [382, 210]],
        glass.violet,
        { alpha: 0.45, transmission: 0.52, age: 0.48, internalContrast: 0.36, phase: 1.16 }
      ),

      createPane(
        "upper-center-left",
        [[204, 168], [154, 246], [216, 268], [240, 208], [240, 134]],
        glass.cyan,
        { alpha: 0.39, transmission: 0.64, refraction: 0.40, coldLight: 0.30, phase: 1.52 }
      ),

      createPane(
        "upper-center-right",
        [[240, 134], [240, 208], [264, 268], [326, 246], [278, 168]],
        glass.rose,
        { alpha: 0.40, transmission: 0.62, refraction: 0.36, warmLight: 0.17, phase: 1.88 }
      ),

      createPane(
        "mid-left-high",
        [[98, 210], [66, 332], [148, 338], [154, 246]],
        glass.blueDeep,
        { alpha: 0.47, transmission: 0.50, age: 0.58, internalContrast: 0.40, phase: 2.22 }
      ),

      createPane(
        "mid-left-inner",
        [[154, 246], [148, 338], [212, 334], [216, 268]],
        glass.violetDeep,
        { alpha: 0.43, transmission: 0.56, age: 0.50, phase: 2.58 }
      ),

      createPane(
        "mid-center",
        [[216, 268], [212, 334], [240, 382], [268, 334], [264, 268], [240, 208]],
        glass.frost,
        { alpha: 0.30, transmission: 0.76, refraction: 0.52, coldLight: 0.40, phase: 2.93 }
      ),

      createPane(
        "mid-right-inner",
        [[264, 268], [268, 334], [332, 338], [326, 246]],
        glass.cyanDeep,
        { alpha: 0.41, transmission: 0.58, age: 0.46, phase: 3.18 }
      ),

      createPane(
        "mid-right-high",
        [[326, 246], [332, 338], [414, 332], [382, 210]],
        glass.blue,
        { alpha: 0.45, transmission: 0.52, age: 0.52, internalContrast: 0.38, phase: 3.54 }
      ),

      createPane(
        "lower-left-edge",
        [[66, 332], [82, 470], [156, 446], [148, 338]],
        glass.roseDeep,
        { alpha: 0.46, transmission: 0.50, age: 0.60, warmLight: 0.18, phase: 3.90 }
      ),

      createPane(
        "lower-left-center",
        [[148, 338], [156, 446], [216, 430], [240, 382], [212, 334]],
        glass.cyan,
        { alpha: 0.39, transmission: 0.64, refraction: 0.38, coldLight: 0.28, phase: 4.23 }
      ),

      createPane(
        "lower-right-center",
        [[268, 334], [240, 382], [264, 430], [324, 446], [332, 338]],
        glass.violet,
        { alpha: 0.40, transmission: 0.62, refraction: 0.36, phase: 4.55 }
      ),

      createPane(
        "lower-right-edge",
        [[332, 338], [324, 446], [398, 470], [414, 332]],
        glass.amber,
        { alpha: 0.45, transmission: 0.52, age: 0.54, warmLight: 0.26, phase: 4.92 }
      ),

      createPane(
        "lower-left-deep",
        [[82, 470], [116, 594], [192, 530], [156, 446]],
        glass.blue,
        { alpha: 0.45, transmission: 0.52, age: 0.56, internalContrast: 0.38, phase: 5.24 }
      ),

      createPane(
        "lower-center-left",
        [[156, 446], [192, 530], [240, 624], [240, 500], [216, 430]],
        glass.paleViolet,
        { alpha: 0.41, transmission: 0.60, refraction: 0.36, phase: 5.56 }
      ),

      createPane(
        "lower-center-right",
        [[264, 430], [240, 500], [240, 624], [288, 530], [324, 446]],
        glass.rose,
        { alpha: 0.41, transmission: 0.60, refraction: 0.35, warmLight: 0.16, phase: 5.92 }
      ),

      createPane(
        "lower-right-deep",
        [[324, 446], [288, 530], [364, 594], [398, 470]],
        glass.cyanDeep,
        { alpha: 0.44, transmission: 0.54, age: 0.53, coldLight: 0.22, phase: 6.23 }
      ),

      createPane(
        "base-left",
        [[116, 594], [168, 660], [240, 676], [240, 624], [192, 530]],
        glass.amberDeep,
        { alpha: 0.44, transmission: 0.54, age: 0.58, warmLight: 0.24, phase: 6.54 }
      ),

      createPane(
        "base-right",
        [[288, 530], [240, 624], [240, 676], [312, 660], [364, 594]],
        glass.blueDeep,
        { alpha: 0.44, transmission: 0.54, age: 0.54, internalContrast: 0.38, phase: 6.88 }
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
      [[236, 62], [244, 62], [244, 207], [241, 222], [239, 222], [236, 207]];

    const mullionBottom =
      [[236, 449], [239, 434], [241, 434], [244, 449], [244, 674], [236, 674]];

    const mullionTopGoldHairline =
      [[239, 68], [241, 68], [241, 201], [240, 214], [239, 201]];

    const mullionBottomGoldHairline =
      [[239, 455], [240, 442], [241, 455], [241, 668], [239, 668]];

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

      band("center-mullion-top-compound-refined", mullionTop, DEPTH.mullionFace, 0, "mullion"),
      band("center-mullion-bottom-compound-refined", mullionBottom, DEPTH.mullionFace, 0, "mullion"),

      band("center-mullion-top-gold-hairline", mullionTopGoldHairline, DEPTH.apertureLip, 0, "mullion-hairline"),
      band("center-mullion-bottom-gold-hairline", mullionBottomGoldHairline, DEPTH.apertureLip, 0, "mullion-hairline"),

      band("top-metal-cap", topCap, DEPTH.frameLip, 0, "cap"),
      band("bottom-metal-cap", bottomCap, DEPTH.frameLip, 0, "cap")
    ]);
  }

  function buildAperture() {
    const outer =
      [[240, 214], [306, 328], [240, 442], [174, 328]];

    const middle =
      [[240, 234], [290, 328], [240, 422], [190, 328]];

    const inner =
      [[240, 252], [274, 328], [240, 404], [206, 328]];

    const clear =
      [[240, 260], [266, 328], [240, 396], [214, 328]];

    const glow =
      [[240, 226], [298, 328], [240, 430], [182, 328]];

    const specularTopLeft =
      [[224, 286], [235, 270], [241, 274], [231, 292]];

    const specularBottomRight =
      [[256, 370], [266, 352], [272, 356], [262, 374]];

    return freezeDeep({
      id:
        "central-diamond-aperture-foreground-lens-compound",

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

      glow:
        normalizePolygon(glow, DEPTH.apertureGlow),

      specular:
        Object.freeze([
          normalizePolygon(specularTopLeft, DEPTH.surfaceAge),
          normalizePolygon(specularBottomRight, DEPTH.surfaceAge)
        ]),

      source:
        Object.freeze({
          outer:
            outer.map(point => Object.freeze([point[0], point[1]])),

          middle:
            middle.map(point => Object.freeze([point[0], point[1]])),

          inner:
            inner.map(point => Object.freeze([point[0], point[1]])),

          clear:
            clear.map(point => Object.freeze([point[0], point[1]])),

          glow:
            glow.map(point => Object.freeze([point[0], point[1]])),

          specular:
            Object.freeze([
              specularTopLeft.map(point => Object.freeze([point[0], point[1]])),
              specularBottomRight.map(point => Object.freeze([point[0], point[1]]))
            ])
        }),

      subtractivePhase1:
        "canvas-destination-out",

      subtractiveFuture:
        "explicit-3d-aperture-bevel-geometry",

      focalRole:
        "foreground-lens-focus-to-diamond-behind",

      diamondOwnership:
        false
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

      render:
        RENDER,

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

    y =
      y1;

    z =
      z1;

    const cosY =
      Math.cos(tiltY);

    const sinY =
      Math.sin(tiltY);

    const x2 =
      x * cosY + z * sinY;

    const z2 =
      -x * sinY + z * cosY;

    x =
      x2;

    z =
      z2;

    const cosZ =
      Math.cos(tiltZ);

    const sinZ =
      Math.sin(tiltZ);

    const x3 =
      x * cosZ - y * sinZ;

    const y3 =
      x * sinZ + y * cosZ;

    x =
      x3;

    y =
      y3;

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

    canvas.dataset.showroomWindowCanvasDormant =
      "false";

    canvas.dataset.showroomWindowForegroundLens =
      "true";

    canvas.dataset.showroomWindowApertureFocus =
      "true";

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

        opacity:
          "1",

        visibility:
          "visible",

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

  function showCanvasForCurtain() {
    state.dormant =
      false;

    if (state.canvas) {
      state.canvas.style.opacity =
        "1";

      state.canvas.style.visibility =
        "visible";

      state.canvas.style.display =
        "block";

      state.canvas.style.pointerEvents =
        "none";

      state.canvas.style.touchAction =
        "none";

      state.canvas.style.background =
        "transparent";

      state.canvas.dataset.showroomWindowCanvasDormant =
        "false";
    }

    if (state.mount) {
      state.mount.style.pointerEvents =
        "none";

      state.mount.style.background =
        "transparent";

      state.mount.dataset.showroomWindowCanvasDormant =
        "false";
    }
  }

  function hideCanvasForCurtain() {
    state.dormant =
      true;

    clearCanvas();

    if (state.canvas) {
      state.canvas.style.opacity =
        "0";

      state.canvas.style.visibility =
        "hidden";

      state.canvas.style.display =
        "block";

      state.canvas.style.pointerEvents =
        "none";

      state.canvas.style.touchAction =
        "none";

      state.canvas.style.background =
        "transparent";

      state.canvas.dataset.showroomWindowCanvasDormant =
        "true";
    }

    if (state.mount) {
      state.mount.style.pointerEvents =
        "none";

      state.mount.style.background =
        "transparent";

      state.mount.dataset.showroomWindowCanvasDormant =
        "true";
    }
  }

  function applyCanvasVisibility() {
    if (isCurtainHidden()) {
      hideCanvasForCurtain();
    } else {
      showCanvasForCurtain();
    }
  }

  function handleHiddenResizeOrRender() {
    state.curtainAmount =
      0;

    resize();
    hideCanvasForCurtain();

    return false;
  }

  function drawObjectLocalShadow(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.035) {
      return;
    }

    context.save();

    context.globalAlpha =
      amount;

    const centerX =
      layout.centerX;

    const centerY =
      layout.centerY + layout.scaleY * 0.065;

    const radiusX =
      layout.scaleX * 0.82;

    const radiusY =
      layout.scaleY * 0.88;

    const gradient =
      context.createRadialGradient(
        centerX,
        centerY,
        radiusX * 0.20,
        centerX,
        centerY,
        radiusX
      );

    gradient.addColorStop(
      0,
      `rgba(0, 0, 0, ${0.03 * amount})`
    );

    gradient.addColorStop(
      0.58,
      `rgba(0, 0, 0, ${0.10 * amount})`
    );

    gradient.addColorStop(
      1,
      `rgba(0, 0, 0, ${RENDER.objectShadowAlpha * amount})`
    );

    context.beginPath();

    context.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      gradient;

    context.filter =
      `blur(${lineWidth(RENDER.objectShadowBlur)}px)`;

    context.fill();

    context.filter =
      "none";

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

    if (band.tier === "mullion-hairline") {
      tracePolygon(
        context,
        projected
      );

      context.fillStyle =
        rgba(MATERIALS.lead.goldHairline, 0.58 * amount);

      context.shadowBlur =
        lineWidth(5) * amount;

      context.shadowColor =
        rgba(MATERIALS.aperture.chromeGold, 0.30 * amount);

      context.fill();

      context.shadowBlur =
        0;

      context.restore();

      return;
    }

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
        rgba(MATERIALS.frame.shadow, 0.92)
      );

      gradient.addColorStop(
        0.34,
        rgba(MATERIALS.frame.body, 0.94)
      );

      gradient.addColorStop(
        0.62,
        rgba(MATERIALS.frame.bevel, 0.74)
      );

      gradient.addColorStop(
        0.82,
        rgba(MATERIALS.frame.gold, 0.22)
      );

      gradient.addColorStop(
        1,
        rgba(MATERIALS.frame.shadow, 0.94)
      );

      context.fillStyle =
        gradient;

      context.shadowBlur =
        lineWidth(6) * amount;

      context.shadowColor =
        `rgba(0, 0, 0, ${0.38 * amount})`;

      context.fill();

      context.shadowBlur =
        0;

      tracePolygon(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.goldBright, 0.16 * amount);

      context.lineWidth =
        lineWidth(0.9);

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
        `rgba(0, 0, 0, ${0.54 * amount})`;

      context.strokeStyle =
        rgba(MATERIALS.frame.shadow, 0.88 * amount);

      context.lineWidth =
        lineWidth(band.width + 7);

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
        rgba(MATERIALS.frame.black, 0.94 * amount);

      context.lineWidth =
        lineWidth(band.width + 4);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.body, 0.94 * amount);

      context.lineWidth =
        lineWidth(band.width);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.patina, 0.14 * amount);

      context.lineWidth =
        lineWidth(band.width * 0.58);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.gold, 0.30 * amount);

      context.lineWidth =
        lineWidth(RENDER.outerFrameLipWidth);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.goldBright, 0.18 * amount);

      context.lineWidth =
        lineWidth(1.0);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.coldEdge, 0.08 * amount);

      context.lineWidth =
        lineWidth(0.85);

      context.stroke();
    }

    if (band.tier === "inner-lip") {
      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.shadow, 0.78 * amount);

      context.lineWidth =
        lineWidth(band.width + 4);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.body, 0.90 * amount);

      context.lineWidth =
        lineWidth(band.width);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.gold, 0.28 * amount);

      context.lineWidth =
        lineWidth(RENDER.innerFrameLipWidth);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.goldBright, 0.14 * amount);

      context.lineWidth =
        lineWidth(0.8);

      context.stroke();

      traceCurve(
        context,
        projected
      );

      context.strokeStyle =
        rgba(MATERIALS.frame.coldEdge, 0.12 * amount);

      context.lineWidth =
        lineWidth(0.8);

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

    const baseAlpha =
      pane.alpha *
      RENDER.glassAlpha *
      amount;

    gradient.addColorStop(
      0,
      rgba(pane.material, baseAlpha * 0.18)
    );

    gradient.addColorStop(
      0.22,
      rgba(pane.material, baseAlpha * 0.62)
    );

    gradient.addColorStop(
      0.48,
      rgba(pane.material, baseAlpha * 0.34)
    );

    gradient.addColorStop(
      0.74,
      rgba(pane.material, baseAlpha * 0.66)
    );

    gradient.addColorStop(
      1,
      rgba(pane.material, baseAlpha * 0.20)
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
          0.07 * amount
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
      `rgba(255, 255, 255, ${0.12 * pane.refraction * amount})`
    );

    haze.addColorStop(
      0.38,
      `rgba(255, 255, 255, ${0.040 * amount})`
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

    const centerTransmission =
      pane.id === "mid-center"
        ? RENDER.centerGlassTransmission
        : pane.transmission;

    const lens =
      context.createRadialGradient(
        box.minX + width * 0.50,
        box.minY + height * 0.50,
        1,
        box.minX + width * 0.50,
        box.minY + height * 0.50,
        Math.max(width, height) * 0.64
      );

    lens.addColorStop(
      0,
      `rgba(255, 240, 180, ${0.055 * centerTransmission * amount})`
    );

    lens.addColorStop(
      0.48,
      `rgba(100, 210, 230, ${0.030 * centerTransmission * amount})`
    );

    lens.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.globalCompositeOperation =
      "screen";

    context.fillStyle =
      lens;

    context.fillRect(
      box.minX,
      box.minY,
      width,
      height
    );

    context.globalCompositeOperation =
      "source-over";

    context.lineWidth =
      lineWidth(0.52);

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
        `rgba(255, 255, 255, ${0.034 * pane.age * amount})`;

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
        `rgba(235, 242, 228, ${0.022 * pane.age * amount})`;

      context.fillRect(
        x,
        y,
        lineWidth(0.65),
        lineWidth(0.65)
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
      lineWidth(3.2) * amount;

    context.shadowColor =
      rgba(
        pane.material,
        0.08 * amount
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
      `rgba(255, 255, 255, ${0.105 * amount})`;

    context.lineWidth =
      lineWidth(0.70);

    context.stroke();

    tracePolygon(
      context,
      face
    );

    context.strokeStyle =
      `rgba(88, 209, 228, ${0.050 * amount})`;

    context.lineWidth =
      lineWidth(0.44);

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
    if (amount <= 0.002) {
      return;
    }

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
      rgba(MATERIALS.lead.shadow, 0.86 * amount);

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
      rgba(MATERIALS.lead.dark, 0.94 * amount);

    context.lineWidth =
      lineWidth(RENDER.cameWidth + 1.1);

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
      rgba(MATERIALS.lead.body, 0.92 * amount);

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
      rgba(MATERIALS.lead.bevel, 0.32 * amount);

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
      rgba(MATERIALS.lead.highlight, 0.20 * amount);

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
          band.tier === "mullion-hairline" ||
          band.tier === "cap"
      )
      .forEach(
        band => drawFrameBand(context, band, layout, amount)
      );
  }

  function drawApertureGlow(
    context,
    layout,
    amount
  ) {
    if (amount <= 0.002) {
      return;
    }

    const glow =
      projectPolygon(
        state.geometry.aperture.glow,
        layout
      );

    const box =
      boundsOf(glow);

    const centerX =
      (box.minX + box.maxX) / 2;

    const centerY =
      (box.minY + box.maxY) / 2;

    const radius =
      Math.max(
        box.maxX - box.minX,
        box.maxY - box.minY
      ) * 0.62;

    context.save();

    context.globalCompositeOperation =
      "screen";

    const gradient =
      context.createRadialGradient(
        centerX,
        centerY,
        radius * 0.10,
        centerX,
        centerY,
        radius
      );

    gradient.addColorStop(
      0,
      rgba(MATERIALS.aperture.whiteGold, RENDER.apertureGlowAlpha * 0.42 * amount)
    );

    gradient.addColorStop(
      0.32,
      rgba(MATERIALS.aperture.chromeGold, RENDER.apertureGlowAlpha * 0.30 * amount)
    );

    gradient.addColorStop(
      0.58,
      rgba(MATERIALS.aperture.coldEdge, RENDER.apertureGlowAlpha * 0.16 * amount)
    );

    gradient.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      gradient;

    tracePolygon(
      context,
      glow
    );

    context.fill();

    context.restore();
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

  function drawApertureInnerLight(
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

    const box =
      boundsOf(clear);

    const centerX =
      (box.minX + box.maxX) / 2;

    const centerY =
      (box.minY + box.maxY) / 2;

    const radius =
      Math.max(
        box.maxX - box.minX,
        box.maxY - box.minY
      ) * 0.76;

    context.save();

    context.globalCompositeOperation =
      "screen";

    tracePolygon(
      context,
      clear
    );

    context.clip();

    const gradient =
      context.createRadialGradient(
        centerX,
        centerY,
        radius * 0.05,
        centerX,
        centerY,
        radius
      );

    gradient.addColorStop(
      0,
      rgba(MATERIALS.aperture.whiteGold, RENDER.apertureInnerGlowAlpha * amount)
    );

    gradient.addColorStop(
      0.44,
      rgba(MATERIALS.aperture.innerLight, RENDER.apertureInnerGlowAlpha * 0.48 * amount)
    );

    gradient.addColorStop(
      0.72,
      rgba(MATERIALS.aperture.cold, RENDER.apertureInnerGlowAlpha * 0.28 * amount)
    );

    gradient.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      gradient;

    context.fillRect(
      box.minX,
      box.minY,
      box.maxX - box.minX,
      box.maxY - box.minY
    );

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
      rgba(MATERIALS.aperture.wall, 0.94 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureWallWidth);

    context.shadowBlur =
      lineWidth(8) * amount;

    context.shadowColor =
      `rgba(0, 0, 0, ${0.48 * amount})`;

    context.stroke();

    context.shadowBlur =
      0;

    tracePolygon(
      context,
      outer
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.deepBronze, 0.92 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureFaceWidth + 2.4);

    context.stroke();

    tracePolygon(
      context,
      outer
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.bronze, 0.66 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureFaceWidth);

    context.stroke();

    tracePolygon(
      context,
      middle
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.gold, 0.78 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureChromeWidth);

    context.stroke();

    tracePolygon(
      context,
      middle
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.chromeGold, 0.56 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureChromeWidth * 0.56);

    context.stroke();

    tracePolygon(
      context,
      inner
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.bright, 0.58 * amount);

    context.lineWidth =
      lineWidth(RENDER.apertureLipWidth);

    context.stroke();

    tracePolygon(
      context,
      inner
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.whiteGold, 0.32 * amount);

    context.lineWidth =
      lineWidth(0.95);

    context.stroke();

    tracePolygon(
      context,
      inner
    );

    context.strokeStyle =
      rgba(MATERIALS.aperture.cold, 0.28 * amount);

    context.lineWidth =
      lineWidth(0.75);

    context.stroke();

    context.restore();

    drawApertureSpeculars(
      context,
      layout,
      amount
    );
  }

  function drawApertureSpeculars(
    context,
    layout,
    amount
  ) {
    if (
      amount <= 0.002 ||
      !state.geometry.aperture.specular
    ) {
      return;
    }

    context.save();

    context.globalCompositeOperation =
      "screen";

    state.geometry.aperture.specular.forEach(
      (shape, index) => {
        const projected =
          projectPolygon(
            shape,
            layout
          );

        tracePolygon(
          context,
          projected
        );

        const box =
          boundsOf(projected);

        const gradient =
          context.createLinearGradient(
            box.minX,
            box.maxY,
            box.maxX,
            box.minY
          );

        gradient.addColorStop(
          0,
          rgba(MATERIALS.aperture.chromeGold, 0.06 * amount)
        );

        gradient.addColorStop(
          0.45,
          rgba(MATERIALS.aperture.whiteGold, RENDER.apertureSpecularAlpha * amount)
        );

        gradient.addColorStop(
          1,
          rgba(MATERIALS.aperture.cold, 0.16 * amount)
        );

        context.fillStyle =
          gradient;

        context.shadowBlur =
          lineWidth(index === 0 ? 5 : 3) * amount;

        context.shadowColor =
          rgba(MATERIALS.aperture.chromeGold, 0.34 * amount);

        context.fill();

        context.shadowBlur =
          0;
      }
    );

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
          0.28 +
          (Math.sin(seed * 2.31) * 0.5 + 0.5) * 0.62
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
        `rgba(225, 218, 185, ${0.014 * amount})`;

      context.fill();
    }

    context.restore();
  }

  function drawCurtainObject() {
    if (
      !state.context ||
      !state.geometry
    ) {
      return false;
    }

    resize();

    state.curtainAmount =
      clamp(state.curtainAmount, 0, 1);

    if (isCurtainHidden()) {
      state.curtainAmount =
        0;

      hideCanvasForCurtain();

      return false;
    }

    showCanvasForCurtain();
    clearCanvas();

    const amount =
      state.curtainAmount;

    const context =
      state.context;

    const layout =
      makeLayout();

    context.save();

    context.scale(
      state.pixelRatio,
      state.pixelRatio
    );

    drawObjectLocalShadow(context, layout, amount);
    drawFrameBands(context, layout, amount);
    drawGlassPanes(context, layout, amount);
    drawLeadCame(context, layout, amount);
    drawMullionsAndCaps(context, layout, amount);
    drawApertureGlow(context, layout, amount);
    drawApertureClear(context, layout, amount);
    drawApertureInnerLight(context, layout, amount);
    drawApertureBevel(context, layout, amount);
    drawSurfaceAge(context, layout, amount);

    context.restore();

    state.lastRenderTime =
      performance.now();

    return true;
  }

  function render() {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    if (isCurtainHidden()) {
      handleHiddenResizeOrRender();

      updateReceipt({
        lastAction:
          "window-object-render-hidden-suppressed",

        curtainAmount:
          0,

        canvasDormant:
          true,

        lastFailure:
          null
      });

      return true;
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

    if (
      transition.to <= 0 &&
      state.curtainAmount <= VISIBILITY.transitionHiddenCutoff
    ) {
      state.curtainAmount =
        0;

      const completed =
        state.transition;

      state.transition =
        null;

      state.running =
        false;

      hideCanvasForCurtain();

      updateReceipt({
        lastAction:
          "window-object-curtain-hidden-dormant",

        transitionId:
          completed.id,

        transitionTarget:
          completed.to,

        curtainAmount:
          0,

        canvasDormant:
          true,

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

      return;
    }

    drawCurtainObject();

    if (raw < 1) {
      state.raf =
        requestAnimationFrame(transitionStep);

      return;
    }

    state.curtainAmount =
      transition.to;

    const completed =
      state.transition;

    state.transition =
      null;

    state.running =
      false;

    if (completed.to <= 0.002) {
      state.curtainAmount =
        0;

      hideCanvasForCurtain();
    } else {
      showCanvasForCurtain();
      drawCurtainObject();
    }

    updateReceipt({
      lastAction:
        completed.to >= 1
          ? "window-object-curtain-shown"
          : "window-object-curtain-hidden-dormant",

      transitionId:
        completed.id,

      transitionTarget:
        completed.to,

      curtainAmount:
        state.curtainAmount,

      canvasDormant:
        isCurtainHidden(),

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

    if (to > 0) {
      showCanvasForCurtain();
    }

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

    if (isCurtainHidden()) {
      state.curtainAmount =
        0;

      hideCanvasForCurtain();

      updateReceipt({
        lastAction:
          "window-object-curtain-hidden-dormant-set",

        curtainAmount:
          0,

        canvasDormant:
          true,

        lastFailure:
          null
      });

      return true;
    }

    showCanvasForCurtain();
    drawCurtainObject();

    updateReceipt({
      lastAction:
        "window-object-curtain-amount-set",

      curtainAmount:
        state.curtainAmount,

      canvasDormant:
        false,

      lastFailure:
        null
    });

    return true;
  }

  function showCurtain(options = {}) {
    showCanvasForCurtain();

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

    if (isCurtainHidden()) {
      state.curtainAmount =
        0;

      hideCanvasForCurtain();
    } else {
      drawCurtainObject();
    }

    updateReceipt({
      lastAction:
        "window-object-resized",

      canvasDormant:
        isCurtainHidden()
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

            if (isCurtainHidden()) {
              state.curtainAmount =
                0;

              hideCanvasForCurtain();
            } else {
              drawCurtainObject();
            }

            updateReceipt({
              lastAction:
                "window-object-resized",

              canvasDormant:
                isCurtainHidden()
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

      state.canvas.style.opacity =
        "0";

      state.canvas.style.visibility =
        "hidden";

      state.canvas.style.pointerEvents =
        "none";
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

    state.dormant =
      true;

    updateReceipt({
      status:
        "disposed",

      initialized:
        false,

      disposed:
        true,

      canvasPresent:
        false,

      canvasDormant:
        true,

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

      apertureFocalRole:
        state.geometry.aperture.focalRole,

      diamondOwnership:
        false,

      depth:
        state.geometry.depth,

      materialGroups:
        Object.keys(state.geometry.materials),

      renderModel:
        state.geometry.render,

      geometryQualityIntent:
        "foreground-lens-aperture-focus-chrome-gold-definition-ready"
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
            if (
              state.disposed ||
              state.failed ||
              !state.initialized
            ) {
              return false;
            }

            const changed =
              resize();

            if (isCurtainHidden()) {
              state.curtainAmount =
                0;

              hideCanvasForCurtain();
            } else {
              drawCurtainObject();
            }

            updateReceipt({
              lastAction:
                "window-object-resize-requested",

              resized:
                changed,

              canvasDormant:
                isCurtainHidden()
            });

            return changed;
          },

        render,

        dispose,

        getReceipt,

        getGeometryReceipt,

        getCurtainAmount:
          () => state.curtainAmount,

        isDormant:
          () => Boolean(
            state.dormant ||
            isCurtainHidden()
          ),

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
      const previous =
        globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT;

      if (
        previous &&
        typeof previous.dispose === "function"
      ) {
        try {
          previous.dispose();
        } catch (_) {}
      }

      state.mount =
        document.querySelector(
          SELECTORS.mount
        );

      if (!state.mount) {
        throw new Error(
          "SHOWROOM_WINDOW_MOUNT_NOT_FOUND"
        );
      }

      state.mount.style.pointerEvents =
        "none";

      state.mount.style.background =
        "transparent";

      state.mount.dataset.showroomWindowForegroundLens =
        "true";

      state.mount.dataset.showroomWindowApertureFocus =
        "true";

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

      applyCanvasVisibility();
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

        canvasDormant:
          isCurtainHidden(),

        lastAction:
          "window-object-initialized-foreground-lens-aperture-focus",

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
