/* TARGET FILE: /showroom/index.window.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_FOREGROUND_WINDOW_TNT_v1_1_DISSOLVE_REVEAL */

/*
  Purpose:
  - Install the Showroom-local Mirrorland Window renderer.
  - Render a foreground stained-glass veil above the Diamond.
  - Closed means glass is visible and the Diamond is hidden.
  - Opening means the glass dissolves/withdraws and the Diamond is revealed.
  - Open means the glass is gone or nearly invisible.
  - Restoring means the glass returns over the Diamond.
  - Keep the generated canvas pointer-transparent.
  - Keep [data-showroom-window-control] as the only Window interaction target.
  - Avoid Compass globals and shared Compass ownership.

  Notification-only events:
  - SHOWROOM_MIRRORLAND_WINDOW_OPEN_REQUEST
  - SHOWROOM_MIRRORLAND_WINDOW_RESTORE_REQUEST

  These events are emitted as lifecycle notifications. This file does not
  listen for them as external commands.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_MIRRORLAND_FOREGROUND_WINDOW_TNT_v1_1_DISSOLVE_REVEAL",

    previousId:
      "SHOWROOM_MIRRORLAND_FOREGROUND_WINDOW_TNT_v1",

    file:
      "/showroom/index.window.js",

    rendererClass:
      "SHOWROOM_LOCAL_2_5D_STAINED_GLASS_DISSOLVE_VEIL",

    visualModel:
      "closed-glass-visible-open-glass-dissolved",

    externalObjectDependencyRequired:
      false,

    compassGlobalDependency:
      false,

    canvasPointerEvents:
      "none",

    buttonOnlyInteraction:
      true,

    diamondOwnership:
      false,

    diamondPointerOwnership:
      false,

    routeOwnership:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const STATES = Object.freeze({
    CLOSED:
      "closed",

    OPENING:
      "opening",

    OPEN:
      "open",

    CLOSING:
      "closing",

    HELD:
      "held",

    DISPOSED:
      "disposed"
  });

  const EVENTS = Object.freeze({
    OPEN_REQUEST:
      "SHOWROOM_MIRRORLAND_WINDOW_OPEN_REQUEST",

    RESTORE_REQUEST:
      "SHOWROOM_MIRRORLAND_WINDOW_RESTORE_REQUEST",

    OPEN_COMPLETE:
      "SHOWROOM_MIRRORLAND_WINDOW_OPEN_COMPLETE",

    RESTORE_COMPLETE:
      "SHOWROOM_MIRRORLAND_WINDOW_RESTORE_COMPLETE",

    STATE:
      "SHOWROOM_MIRRORLAND_WINDOW_STATE",

    FAILURE:
      "SHOWROOM_MIRRORLAND_WINDOW_FAILURE",

    DISPOSED:
      "SHOWROOM_MIRRORLAND_WINDOW_DISPOSED"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    threshold:
      "#showroom-window-threshold",

    layer:
      "[data-showroom-window-layer]",

    mount:
      "[data-showroom-window-mount]",

    control:
      "[data-showroom-window-control]",

    label:
      "[data-showroom-window-label]",

    receipt:
      "[data-showroom-window-receipt]",

    existingCanvas:
      "canvas[data-showroom-window-canvas]"
  });

  const TIMING = Object.freeze({
    openMs:
      1120,

    restoreMs:
      860,

    reducedOpenMs:
      120,

    reducedRestoreMs:
      100,

    dissolveDrift:
      18,

    sparklePeriodSeconds:
      2.7
  });

  const DIMENSIONS = Object.freeze({
    designWidth:
      480,

    designHeight:
      720,

    glassScaleClosed:
      1,

    glassScaleOpen:
      1.015,

    glassOpacityClosed:
      0.96,

    glassOpacityOpen:
      0,

    leadWidthClosed:
      7.5,

    leadWidthOpen:
      0.4,

    innerLeadWidthClosed:
      3.2,

    innerLeadWidthOpen:
      0.15,

    ribWidthClosed:
      12.8,

    ribWidthOpen:
      0.3,

    ribHighlightWidthClosed:
      2.8,

    ribHighlightWidthOpen:
      0.1,

    maximumDevicePixelRatio:
      2
  });

  const COLORS = Object.freeze({
    frameNearBlack:
      Object.freeze([5, 8, 15]),

    frameMid:
      Object.freeze([16, 22, 34]),

    frameEdge:
      Object.freeze([38, 49, 70]),

    leadDark:
      Object.freeze([15, 19, 28]),

    leadLight:
      Object.freeze([75, 86, 108]),

    cyan:
      Object.freeze([87, 210, 231]),

    blue:
      Object.freeze([67, 112, 204]),

    violet:
      Object.freeze([133, 83, 201]),

    amber:
      Object.freeze([226, 164, 79]),

    rose:
      Object.freeze([198, 85, 132]),

    paleCyan:
      Object.freeze([161, 235, 244]),

    paleBlue:
      Object.freeze([143, 181, 234]),

    paleViolet:
      Object.freeze([184, 149, 232]),

    paleAmber:
      Object.freeze([239, 202, 132]),

    paleRose:
      Object.freeze([229, 151, 185])
  });

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    previousContractId:
      CONTRACT.previousId,

    file:
      CONTRACT.file,

    status:
      "pending",

    initialized:
      false,

    rendererState:
      STATES.CLOSED,

    activeTransitionId:
      "",

    canvasPresent:
      false,

    canvasPointerEvents:
      "none",

    buttonOnlyInteraction:
      true,

    paneCount:
      0,

    frameCount:
      0,

    veilAmount:
      1,

    glassAmount:
      1,

    visualSemantics:
      "closed-glass-visible-open-glass-dissolved",

    reducedMotion:
      false,

    reducedMotionSource:
      "startup",

    listenersBound:
      false,

    resizeBinding:
      "none",

    labelPresent:
      false,

    labelRequired:
      false,

    lastAction:
      "",

    lastFailure:
      null,

    ownsDiamond:
      false,

    ownsDiamondPointerInteraction:
      false,

    ownsRouteState:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  };

  const state = {
    root:
      null,

    threshold:
      null,

    layer:
      null,

    mount:
      null,

    control:
      null,

    label:
      null,

    receiptOutput:
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

    rendererState:
      STATES.CLOSED,

    activeTransitionId:
      "",

    transition: {
      from:
        1,

      to:
        1,

      progress:
        1,

      startTime:
        0,

      duration:
        0
    },

    veilAmount:
      1,

    reducedMotion:
      false,

    reducedMotionMediaQuery:
      null,

    raf:
      0,

    running:
      false,

    time:
      0,

    resizeObserver:
      null,

    resizeFallbackBound:
      false,

    eventsBound:
      false,

    reducedMotionBound:
      false,

    panes:
      [],

    frameSegments:
      [],

    geometryReady:
      false,

    initialized:
      false,

    failed:
      false,

    disposed:
      false
  };

  function qs(
    selector,
    owner = document
  ) {
    try {
      return owner.querySelector(
        selector
      );
    } catch (_) {
      return null;
    }
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
        Number.isFinite(value)
          ? value
          : minimum
      )
    );
  }

  function lerp(
    a,
    b,
    amount
  ) {
    return (
      a +
      (
        b -
        a
      ) *
      amount
    );
  }

  function easeOutCubic(
    value
  ) {
    const inverse =
      1 -
      value;

    return (
      1 -
      inverse *
      inverse *
      inverse
    );
  }

  function easeInOutCubic(
    value
  ) {
    return value < 0.5
      ? 4 *
        value *
        value *
        value
      : 1 -
        Math.pow(
          -2 *
            value +
            2,
          3
        ) /
        2;
  }

  function rgba(
    color,
    alpha
  ) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${clamp(alpha, 0, 1)})`;
  }

  function glassAmount() {
    return clamp(
      state.veilAmount,
      0,
      1
    );
  }

  function revealAmount() {
    return clamp(
      1 -
        state.veilAmount,
      0,
      1
    );
  }

  function transitionId(
    prefix
  ) {
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
                contract:
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

  function writeWindowState() {
    const value =
      state.rendererState;

    for (
      const node of [
        state.root,
        state.threshold,
        state.layer,
        state.mount,
        state.control
      ]
    ) {
      if (node) {
        node.dataset.showroomWindowState =
          value;
      }
    }

    if (state.control) {
      const expanded =
        value === STATES.OPEN ||
        value === STATES.OPENING;

      state.control.setAttribute(
        "aria-expanded",
        expanded
          ? "true"
          : "false"
      );

      if (!state.label) {
        state.control.setAttribute(
          "aria-label",
          expanded
            ? "Restore the Mirrorland Window and hide the Diamond"
            : "Open the Mirrorland Window and reveal the Diamond"
        );
      }
    }

    if (state.label) {
      state.label.textContent =
        value === STATES.OPEN ||
        value === STATES.OPENING
          ? "Restore the Window"
          : "Open the Window";
    }
  }

  function emitReceipt(
    extra = {}
  ) {
    Object.assign(
      RECEIPT,
      {
        status:
          state.disposed
            ? "disposed"
            : state.failed
              ? "held"
              : state.initialized
                ? "available"
                : "pending",

        initialized:
          state.initialized,

        rendererState:
          state.rendererState,

        activeTransitionId:
          state.activeTransitionId,

        canvasPresent:
          Boolean(state.canvas),

        paneCount:
          state.panes.length,

        frameCount:
          state.frameSegments.length,

        veilAmount:
          state.veilAmount,

        glassAmount:
          glassAmount(),

        reducedMotion:
          state.reducedMotion,

        listenersBound:
          state.eventsBound,

        resizeBinding:
          state.resizeObserver
            ? "ResizeObserver"
            : state.resizeFallbackBound
              ? "window-resize"
              : "none",

        labelPresent:
          Boolean(state.label),

        ownsDiamond:
          false,

        ownsDiamondPointerInteraction:
          false,

        ownsRouteState:
          false,

        visualPassClaimed:
          false,

        productionAuthorized:
          false,

        deploymentAuthorized:
          false
      },

      extra
    );

    const serialized =
      JSON.stringify(
        RECEIPT
      );

    if (state.root) {
      state.root.dataset.showroomWindowReceipt =
        serialized;

      state.root.dataset.showroomWindowRuntimeStatus =
        RECEIPT.status;

      state.root.dataset.showroomWindowReducedMotion =
        state.reducedMotion
          ? "true"
          : "false";

      state.root.dataset.visualPassClaimed =
        "false";
    }

    if (state.threshold) {
      state.threshold.dataset.showroomWindowReceipt =
        serialized;
    }

    if (state.canvas) {
      state.canvas.dataset.showroomWindowReceipt =
        serialized;

      state.canvas.dataset.visualPassClaimed =
        "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value =
        serialized;

      state.receiptOutput.textContent =
        serialized;

      state.receiptOutput.dataset.visualPassClaimed =
        "false";
    }

    globalThis.SHOWROOM_MIRRORLAND_WINDOW_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });

    dispatch(
      EVENTS.STATE,
      {
        receipt:
          globalThis.SHOWROOM_MIRRORLAND_WINDOW_RECEIPT
      }
    );
  }

  function emitFailure(
    reason
  ) {
    if (state.failed) {
      return;
    }

    state.failed =
      true;

    state.rendererState =
      STATES.HELD;

    state.running =
      false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );

      state.raf =
        0;
    }

    writeWindowState();

    emitReceipt({
      status:
        "held",

      initialized:
        false,

      lastAction:
        "window-render-failure",

      lastFailure:
        String(
          reason ||
            "UNKNOWN_SHOWROOM_WINDOW_FAILURE"
        )
    });

    dispatch(
      EVENTS.FAILURE,
      {
        transitionId:
          state.activeTransitionId,

        reason:
          String(
            reason ||
              "UNKNOWN_SHOWROOM_WINDOW_FAILURE"
          )
      }
    );
  }

  function createCanvas() {
    const existing =
      qs(
        SELECTORS.existingCanvas,
        state.mount
      );

    if (existing) {
      state.createdCanvas =
        false;

      existing.style.pointerEvents =
        "none";

      existing.setAttribute(
        "aria-hidden",
        "true"
      );

      existing.setAttribute(
        "role",
        "presentation"
      );

      return existing;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    state.createdCanvas =
      true;

    canvas.dataset.showroomWindowCanvas =
      "true";

    canvas.dataset.showroomWindowContract =
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

        pointerEvents:
          "none",

        touchAction:
          "none",

        background:
          "transparent",

        zIndex:
          "1"
      }
    );

    state.mount.appendChild(
      canvas
    );

    return canvas;
  }

  function createPane(
    id,
    color,
    points,
    options = {}
  ) {
    return Object.freeze({
      id,
      color,

      points:
        Object.freeze(
          points.map(
            point =>
              Object.freeze([
                point[0],
                point[1]
              ])
          )
        ),

      alpha:
        options.alpha ??
        0.74,

      glow:
        options.glow ??
        0.34,

      depth:
        options.depth ??
        0.5,

      phase:
        options.phase ??
        0,

      grain:
        options.grain ??
        0.12,

      highlight:
        options.highlight ??
        0.16
    });
  }

  function buildPanes() {
    return [
      createPane(
        "crown-left",
        COLORS.paleCyan,
        [[240, 46], [164, 106], [204, 168], [240, 134]],
        { alpha: 0.78, glow: 0.46, depth: 0.86, phase: 0.20 }
      ),

      createPane(
        "crown-right",
        COLORS.paleViolet,
        [[240, 46], [240, 134], [278, 168], [318, 106]],
        { alpha: 0.76, glow: 0.43, depth: 0.82, phase: 0.62 }
      ),

      createPane(
        "upper-left-edge",
        COLORS.blue,
        [[164, 106], [98, 210], [154, 246], [204, 168]],
        { alpha: 0.75, glow: 0.28, depth: 0.62, phase: 0.92 }
      ),

      createPane(
        "upper-right-edge",
        COLORS.violet,
        [[318, 106], [278, 168], [326, 246], [382, 210]],
        { alpha: 0.76, glow: 0.30, depth: 0.66, phase: 1.22 }
      ),

      createPane(
        "upper-center-left",
        COLORS.cyan,
        [[204, 168], [154, 246], [216, 268], [240, 208], [240, 134]],
        { alpha: 0.72, glow: 0.40, depth: 0.78, phase: 1.50 }
      ),

      createPane(
        "upper-center-right",
        COLORS.rose,
        [[240, 134], [240, 208], [264, 268], [326, 246], [278, 168]],
        { alpha: 0.72, glow: 0.37, depth: 0.76, phase: 1.84 }
      ),

      createPane(
        "mid-left-high",
        COLORS.paleBlue,
        [[98, 210], [66, 332], [148, 338], [154, 246]],
        { alpha: 0.72, glow: 0.25, depth: 0.56, phase: 2.20 }
      ),

      createPane(
        "mid-left-inner",
        COLORS.violet,
        [[154, 246], [148, 338], [212, 334], [216, 268]],
        { alpha: 0.76, glow: 0.31, depth: 0.72, phase: 2.52 }
      ),

      createPane(
        "mid-center",
        COLORS.paleAmber,
        [[216, 268], [212, 334], [240, 382], [268, 334], [264, 268], [240, 208]],
        { alpha: 0.76, glow: 0.50, depth: 0.90, phase: 2.92 }
      ),

      createPane(
        "mid-right-inner",
        COLORS.cyan,
        [[264, 268], [268, 334], [332, 338], [326, 246]],
        { alpha: 0.75, glow: 0.32, depth: 0.73, phase: 3.20 }
      ),

      createPane(
        "mid-right-high",
        COLORS.blue,
        [[326, 246], [332, 338], [414, 332], [382, 210]],
        { alpha: 0.72, glow: 0.26, depth: 0.57, phase: 3.58 }
      ),

      createPane(
        "lower-left-edge",
        COLORS.rose,
        [[66, 332], [82, 470], [156, 446], [148, 338]],
        { alpha: 0.74, glow: 0.25, depth: 0.58, phase: 3.90 }
      ),

      createPane(
        "lower-left-center",
        COLORS.cyan,
        [[148, 338], [156, 446], [216, 430], [240, 382], [212, 334]],
        { alpha: 0.74, glow: 0.35, depth: 0.75, phase: 4.20 }
      ),

      createPane(
        "lower-right-center",
        COLORS.violet,
        [[268, 334], [240, 382], [264, 430], [324, 446], [332, 338]],
        { alpha: 0.74, glow: 0.35, depth: 0.75, phase: 4.56 }
      ),

      createPane(
        "lower-right-edge",
        COLORS.amber,
        [[332, 338], [324, 446], [398, 470], [414, 332]],
        { alpha: 0.72, glow: 0.28, depth: 0.59, phase: 4.92 }
      ),

      createPane(
        "lower-left-deep",
        COLORS.blue,
        [[82, 470], [116, 594], [192, 530], [156, 446]],
        { alpha: 0.74, glow: 0.24, depth: 0.56, phase: 5.22 }
      ),

      createPane(
        "lower-center-left",
        COLORS.paleViolet,
        [[156, 446], [192, 530], [240, 624], [240, 500], [216, 430]],
        { alpha: 0.75, glow: 0.41, depth: 0.82, phase: 5.54 }
      ),

      createPane(
        "lower-center-right",
        COLORS.paleRose,
        [[264, 430], [240, 500], [240, 624], [288, 530], [324, 446]],
        { alpha: 0.75, glow: 0.41, depth: 0.82, phase: 5.88 }
      ),

      createPane(
        "lower-right-deep",
        COLORS.cyan,
        [[324, 446], [288, 530], [364, 594], [398, 470]],
        { alpha: 0.72, glow: 0.25, depth: 0.57, phase: 6.20 }
      ),

      createPane(
        "base-left",
        COLORS.amber,
        [[116, 594], [168, 660], [240, 676], [240, 624], [192, 530]],
        { alpha: 0.72, glow: 0.36, depth: 0.72, phase: 6.54 }
      ),

      createPane(
        "base-right",
        COLORS.blue,
        [[288, 530], [240, 624], [240, 676], [312, 660], [364, 594]],
        { alpha: 0.72, glow: 0.35, depth: 0.72, phase: 6.86 }
      )
    ];
  }

  function buildFrameSegments() {
    return Object.freeze([
      Object.freeze([
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

      Object.freeze([
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
  }

  function appendOuterWindow(
    context
  ) {
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
  }

  function appendInnerWindow(
    context
  ) {
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
  }

  function traceOuterWindow(
    context
  ) {
    context.beginPath();
    appendOuterWindow(context);
  }

  function traceInnerWindow(
    context
  ) {
    context.beginPath();
    appendInnerWindow(context);
  }

  function createPaneGradient(
    context,
    pane,
    glass,
    shimmer
  ) {
    const bounds =
      pane.points.reduce(
        (
          result,
          point
        ) => ({
          minimumX:
            Math.min(
              result.minimumX,
              point[0]
            ),

          maximumX:
            Math.max(
              result.maximumX,
              point[0]
            ),

          minimumY:
            Math.min(
              result.minimumY,
              point[1]
            ),

          maximumY:
            Math.max(
              result.maximumY,
              point[1]
            )
        }),
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

    const gradient =
      context.createLinearGradient(
        bounds.minimumX,
        bounds.minimumY,
        bounds.maximumX,
        bounds.maximumY
      );

    const alpha =
      pane.alpha *
      glass;

    gradient.addColorStop(
      0,
      rgba(
        pane.color,
        alpha *
          (
            0.52 +
            shimmer *
            0.04
          )
      )
    );

    gradient.addColorStop(
      0.48,
      rgba(
        pane.color,
        alpha *
          (
            0.92 +
            shimmer *
            0.06
          )
      )
    );

    gradient.addColorStop(
      1,
      rgba(
        pane.color,
        alpha *
          0.46
      )
    );

    return gradient;
  }

  function drawPane(
    context,
    pane,
    glass,
    time
  ) {
    if (glass <= 0.006) {
      return;
    }

    const shimmer =
      state.reducedMotion
        ? 0
        : Math.sin(
            time *
              0.72 +
              pane.phase
          );

    const dissolve =
      1 -
        glass;

    const depthShift =
      pane.depth *
      dissolve *
      TIMING.dissolveDrift;

    context.save();

    context.globalAlpha =
      glass;

    context.translate(
      shimmer *
        pane.depth *
        0.45 *
        glass,
      -depthShift
    );

    tracePolygon(
      context,
      pane.points
    );

    context.fillStyle =
      createPaneGradient(
        context,
        pane,
        glass,
        shimmer
      );

    context.shadowBlur =
      (
        8 +
        pane.glow *
          24
      ) *
      glass;

    context.shadowColor =
      rgba(
        pane.color,
        pane.glow *
          0.52 *
          glass
      );

    context.fill();

    context.shadowBlur =
      0;

    const highlight =
      context.createLinearGradient(
        0,
        0,
        DIMENSIONS.designWidth,
        DIMENSIONS.designHeight
      );

    highlight.addColorStop(
      0,
      `rgba(255, 255, 255, ${
        pane.highlight *
          0.66 *
          glass
      })`
    );

    highlight.addColorStop(
      0.42,
      "rgba(255, 255, 255, 0)"
    );

    highlight.addColorStop(
      1,
      `rgba(255, 255, 255, ${
        pane.highlight *
          0.12 *
          glass
      })`
    );

    context.fillStyle =
      highlight;

    context.fill();

    context.strokeStyle =
      `rgba(255, 255, 255, ${
        (
          0.03 +
          pane.highlight *
            0.20
        ) *
        glass
      })`;

    context.lineWidth =
      1.25 *
      glass;

    context.stroke();

    if (
      !state.reducedMotion &&
      pane.grain > 0 &&
      glass >= 0.22
    ) {
      context.globalCompositeOperation =
        "screen";

      for (
        let index = 0;
        index < 4;
        index += 1
      ) {
        const seed =
          pane.phase *
            10.7 +
          index *
            5.3;

        const x =
          pane.points[0][0] +
          (
            Math.sin(
              seed *
                4.9
            ) *
              0.5 +
            0.5
          ) *
            90;

        const y =
          pane.points[0][1] +
          (
            Math.sin(
              seed *
                2.7 +
                1.2
            ) *
              0.5 +
            0.5
          ) *
            120;

        context.fillStyle =
          `rgba(255, 255, 255, ${
            pane.grain *
              0.10 *
              glass
          })`;

        context.fillRect(
          x,
          y,
          1.2,
          1.2
        );
      }
    }

    context.restore();
  }

  function drawLeadLines(
    context,
    glass
  ) {
    if (glass <= 0.006) {
      return;
    }

    const darkWidth =
      lerp(
        DIMENSIONS.leadWidthOpen,
        DIMENSIONS.leadWidthClosed,
        glass
      );

    const lightWidth =
      lerp(
        DIMENSIONS.innerLeadWidthOpen,
        DIMENSIONS.innerLeadWidthClosed,
        glass
      );

    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    context.strokeStyle =
      rgba(
        COLORS.leadDark,
        0.94 *
          glass
      );

    context.lineWidth =
      darkWidth;

    state.panes.forEach(
      pane => {
        tracePolygon(
          context,
          pane.points
        );

        context.stroke();
      }
    );

    context.strokeStyle =
      rgba(
        COLORS.leadLight,
        0.36 *
          glass
      );

    context.lineWidth =
      lightWidth;

    state.panes.forEach(
      pane => {
        tracePolygon(
          context,
          pane.points
        );

        context.stroke();
      }
    );

    context.restore();
  }

  function drawOuterFrame(
    context,
    glass
  ) {
    if (glass <= 0.006) {
      return;
    }

    context.save();

    const frameGradient =
      context.createLinearGradient(
        0,
        0,
        DIMENSIONS.designWidth,
        0
      );

    frameGradient.addColorStop(
      0,
      rgba(
        COLORS.frameNearBlack,
        glass
      )
    );

    frameGradient.addColorStop(
      0.22,
      rgba(
        COLORS.frameMid,
        glass
      )
    );

    frameGradient.addColorStop(
      0.50,
      rgba(
        COLORS.frameNearBlack,
        glass
      )
    );

    frameGradient.addColorStop(
      0.78,
      rgba(
        COLORS.frameMid,
        glass
      )
    );

    frameGradient.addColorStop(
      1,
      rgba(
        COLORS.frameNearBlack,
        glass
      )
    );

    context.beginPath();

    appendOuterWindow(context);
    appendInnerWindow(context);

    context.fillStyle =
      frameGradient;

    context.shadowBlur =
      52 *
      glass;

    context.shadowColor =
      `rgba(65, 132, 183, ${
        0.24 *
          glass
      })`;

    context.fill(
      "evenodd"
    );

    context.shadowBlur =
      0;

    traceOuterWindow(context);

    context.strokeStyle =
      rgba(
        COLORS.frameEdge,
        0.72 *
          glass
      );

    context.lineWidth =
      7 *
      glass;

    context.stroke();

    traceInnerWindow(context);

    context.strokeStyle =
      rgba(
        COLORS.leadLight,
        0.36 *
          glass
      );

    context.lineWidth =
      3 *
      glass;

    context.stroke();

    context.restore();
  }

  function drawFrameRibs(
    context,
    glass
  ) {
    if (glass <= 0.006) {
      return;
    }

    const darkWidth =
      lerp(
        DIMENSIONS.ribWidthOpen,
        DIMENSIONS.ribWidthClosed,
        glass
      );

    const lightWidth =
      lerp(
        DIMENSIONS.ribHighlightWidthOpen,
        DIMENSIONS.ribHighlightWidthClosed,
        glass
      );

    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    state.frameSegments.forEach(
      segment => {
        context.beginPath();

        context.moveTo(
          segment[0][0],
          segment[0][1]
        );

        for (
          let index = 1;
          index < segment.length;
          index += 1
        ) {
          context.lineTo(
            segment[index][0],
            segment[index][1]
          );
        }

        context.strokeStyle =
          `rgba(9, 12, 18, ${
            0.98 *
              glass
          })`;

        context.lineWidth =
          darkWidth;

        context.stroke();

        context.strokeStyle =
          `rgba(79, 89, 110, ${
            0.36 *
              glass
          })`;

        context.lineWidth =
          lightWidth;

        context.stroke();
      }
    );

    context.restore();
  }

  function drawInnerLight(
    context,
    glass,
    time
  ) {
    if (glass <= 0.006) {
      return;
    }

    context.save();

    traceInnerWindow(context);

    context.clip();

    const pulse =
      state.reducedMotion
        ? 0.5
        : (
            Math.sin(
              time *
                1.10
            ) *
              0.5 +
            0.5
          );

    const centerGlow =
      context.createRadialGradient(
        240,
        356,
        20,
        240,
        356,
        310
      );

    centerGlow.addColorStop(
      0,
      `rgba(202, 240, 255, ${
        glass *
          (
            0.20 +
            pulse *
              0.08
          )
      })`
    );

    centerGlow.addColorStop(
      0.30,
      `rgba(95, 151, 221, ${
        glass *
          0.13
      })`
    );

    centerGlow.addColorStop(
      0.62,
      `rgba(118, 74, 169, ${
        glass *
          0.08
      })`
    );

    centerGlow.addColorStop(
      1,
      "rgba(0, 0, 0, 0)"
    );

    context.fillStyle =
      centerGlow;

    context.fillRect(
      0,
      0,
      DIMENSIONS.designWidth,
      DIMENSIONS.designHeight
    );

    if (
      !state.reducedMotion &&
      glass > 0.18
    ) {
      const beam =
        context.createLinearGradient(
          70,
          80,
          410,
          650
        );

      beam.addColorStop(
        0,
        "rgba(255, 255, 255, 0)"
      );

      beam.addColorStop(
        0.48,
        `rgba(255, 255, 255, ${
          glass *
            (
              0.030 +
              pulse *
                0.018
            )
        })`
      );

      beam.addColorStop(
        0.58,
        "rgba(255, 255, 255, 0)"
      );

      context.fillStyle =
        beam;

      context.fillRect(
        0,
        0,
        DIMENSIONS.designWidth,
        DIMENSIONS.designHeight
      );
    }

    context.restore();
  }

  function drawDiamondVeilDarkness(
    context,
    cssWidth,
    cssHeight,
    glass
  ) {
    if (glass <= 0.006) {
      return;
    }

    context.save();

    const gradient =
      context.createRadialGradient(
        cssWidth / 2,
        cssHeight * 0.42,
        Math.min(
          cssWidth,
          cssHeight
        ) *
          0.05,
        cssWidth / 2,
        cssHeight * 0.48,
        Math.max(
          cssWidth,
          cssHeight
        ) *
          0.68
      );

    gradient.addColorStop(
      0,
      `rgba(8, 12, 28, ${
        0.10 *
          glass
      })`
    );

    gradient.addColorStop(
      0.48,
      `rgba(5, 8, 18, ${
        0.22 *
          glass
      })`
    );

    gradient.addColorStop(
      1,
      `rgba(1, 3, 9, ${
        0.56 *
          glass
      })`
    );

    context.fillStyle =
      gradient;

    context.fillRect(
      0,
      0,
      cssWidth,
      cssHeight
    );

    context.restore();
  }

  function drawRevealHaze(
    context,
    cssWidth,
    cssHeight,
    reveal
  ) {
    if (
      reveal <= 0.02 ||
      reveal >= 0.98
    ) {
      return;
    }

    context.save();

    const haze =
      Math.sin(
        reveal *
          Math.PI
      );

    const gradient =
      context.createRadialGradient(
        cssWidth / 2,
        cssHeight * 0.44,
        12,
        cssWidth / 2,
        cssHeight * 0.44,
        Math.max(
          cssWidth,
          cssHeight
        ) *
          0.42
      );

    gradient.addColorStop(
      0,
      `rgba(185, 232, 255, ${
        0.13 *
          haze
      })`
    );

    gradient.addColorStop(
      0.38,
      `rgba(118, 151, 232, ${
        0.07 *
          haze
      })`
    );

    gradient.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      gradient;

    context.fillRect(
      0,
      0,
      cssWidth,
      cssHeight
    );

    context.restore();
  }

  function drawSparkles(
    context,
    glass,
    time
  ) {
    if (
      state.reducedMotion ||
      glass < 0.34
    ) {
      return;
    }

    context.save();

    traceInnerWindow(context);

    context.clip();

    const points = [
      [186, 180, 0.0],
      [292, 248, 1.4],
      [234, 340, 2.7],
      [148, 418, 4.1],
      [320, 516, 5.3],
      [248, 592, 6.4]
    ];

    points.forEach(
      point => {
        const pulse =
          Math.sin(
            time *
              (
                Math.PI *
                2 /
                TIMING.sparklePeriodSeconds
              ) +
              point[2]
          );

        const alpha =
          clamp(
            (
              pulse -
                0.52
            ) *
              1.9,
            0,
            1
          ) *
          glass *
          0.48;

        if (alpha <= 0.01) {
          return;
        }

        const radius =
          1.2 +
          alpha *
            2.4;

        const gradient =
          context.createRadialGradient(
            point[0],
            point[1],
            0,
            point[0],
            point[1],
            radius *
              5
          );

        gradient.addColorStop(
          0,
          `rgba(255, 250, 224, ${alpha})`
        );

        gradient.addColorStop(
          0.28,
          `rgba(187, 229, 255, ${
            alpha *
              0.48
          })`
        );

        gradient.addColorStop(
          1,
          "rgba(255, 255, 255, 0)"
        );

        context.fillStyle =
          gradient;

        context.beginPath();

        context.arc(
          point[0],
          point[1],
          radius *
            5,
          0,
          Math.PI *
            2
        );

        context.fill();
      }
    );

    context.restore();
  }

  function drawWindow() {
    const context =
      state.context;

    if (!context) {
      return;
    }

    context.clearRect(
      0,
      0,
      state.width,
      state.height
    );

    context.save();

    context.scale(
      state.pixelRatio,
      state.pixelRatio
    );

    const cssWidth =
      state.width /
      state.pixelRatio;

    const cssHeight =
      state.height /
      state.pixelRatio;

    const glass =
      glassAmount();

    const reveal =
      revealAmount();

    drawDiamondVeilDarkness(
      context,
      cssWidth,
      cssHeight,
      glass
    );

    drawRevealHaze(
      context,
      cssWidth,
      cssHeight,
      reveal
    );

    if (glass <= 0.004) {
      context.restore();
      return;
    }

    const designScale =
      Math.min(
        cssWidth /
          DIMENSIONS.designWidth,
        cssHeight /
          DIMENSIONS.designHeight
      );

    const scale =
      lerp(
        DIMENSIONS.glassScaleOpen,
        DIMENSIONS.glassScaleClosed,
        glass
      );

    const opacity =
      lerp(
        DIMENSIONS.glassOpacityOpen,
        DIMENSIONS.glassOpacityClosed,
        glass
      );

    const dissolve =
      1 -
        glass;

    const horizontalDrift =
      state.reducedMotion
        ? 0
        : Math.sin(
            state.time *
              0.23
          ) *
          1.6 *
          dissolve;

    const verticalDrift =
      state.reducedMotion
        ? 0
        : -TIMING.dissolveDrift *
            0.34 *
            dissolve +
          Math.sin(
            state.time *
              0.30 +
              1.2
          ) *
            1.2 *
            dissolve;

    context.translate(
      cssWidth /
        2 +
        horizontalDrift,
      cssHeight /
        2 +
        verticalDrift
    );

    context.scale(
      designScale *
        scale,
      designScale *
        scale
    );

    context.translate(
      -DIMENSIONS.designWidth /
        2,
      -DIMENSIONS.designHeight /
        2
    );

    context.globalAlpha =
      opacity;

    context.save();

    traceInnerWindow(context);

    context.clip();

    drawInnerLight(
      context,
      glass,
      state.time
    );

    state.panes.forEach(
      pane => {
        drawPane(
          context,
          pane,
          glass,
          state.time
        );
      }
    );

    context.restore();

    drawLeadLines(
      context,
      glass
    );

    drawFrameRibs(
      context,
      glass
    );

    drawOuterFrame(
      context,
      glass
    );

    drawSparkles(
      context,
      glass,
      state.time
    );

    context.restore();
    context.restore();
  }

  function resize() {
    if (
      !state.canvas ||
      !state.mount
    ) {
      return;
    }

    const rect =
      state.mount.getBoundingClientRect();

    const ratio =
      Math.min(
        globalThis.devicePixelRatio ||
          1,
        DIMENSIONS.maximumDevicePixelRatio
      );

    const width =
      Math.max(
        1,
        Math.floor(
          rect.width *
            ratio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height *
            ratio
        )
      );

    if (
      state.canvas.width !== width ||
      state.canvas.height !== height
    ) {
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
      ratio;
  }

  function completeOpen() {
    const id =
      state.activeTransitionId;

    if (!id) {
      emitFailure(
        "SHOWROOM_WINDOW_TRANSITION_ID_MISSING_AT_OPEN_COMPLETION"
      );

      return;
    }

    state.rendererState =
      STATES.OPEN;

    state.veilAmount =
      0;

    state.transition.progress =
      1;

    writeWindowState();

    emitReceipt({
      lastAction:
        "window-open-complete-diamond-revealed",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.OPEN_COMPLETE,
      {
        transitionId:
          id,

        diamondRevealed:
          true,

        glassVisible:
          false
      }
    );
  }

  function completeRestore() {
    const id =
      state.activeTransitionId;

    if (!id) {
      emitFailure(
        "SHOWROOM_WINDOW_TRANSITION_ID_MISSING_AT_RESTORE_COMPLETION"
      );

      return;
    }

    state.rendererState =
      STATES.CLOSED;

    state.veilAmount =
      1;

    state.transition.progress =
      1;

    state.activeTransitionId =
      "";

    writeWindowState();

    emitReceipt({
      lastAction:
        "window-restore-complete-diamond-hidden",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.RESTORE_COMPLETE,
      {
        transitionId:
          id,

        diamondRevealed:
          false,

        glassVisible:
          true
      }
    );
  }

  function updateTransition(
    now
  ) {
    if (
      state.rendererState !== STATES.OPENING &&
      state.rendererState !== STATES.CLOSING
    ) {
      return;
    }

    const duration =
      Math.max(
        1,
        state.transition.duration
      );

    const elapsed =
      now -
      state.transition.startTime;

    const rawProgress =
      clamp(
        elapsed /
          duration,
        0,
        1
      );

    const eased =
      state.rendererState === STATES.OPENING
        ? easeOutCubic(
            rawProgress
          )
        : easeInOutCubic(
            rawProgress
          );

    state.transition.progress =
      rawProgress;

    state.veilAmount =
      lerp(
        state.transition.from,
        state.transition.to,
        eased
      );

    if (rawProgress < 1) {
      return;
    }

    if (state.rendererState === STATES.OPENING) {
      completeOpen();
    } else {
      completeRestore();
    }
  }

  function render(
    now
  ) {
    if (
      !state.running ||
      state.failed ||
      state.disposed
    ) {
      return;
    }

    state.time =
      now *
      0.001;

    resize();

    updateTransition(
      now
    );

    drawWindow();

    state.raf =
      requestAnimationFrame(
        render
      );
  }

  function controllerReducedMotion() {
    const controller =
      globalThis
        .SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER;

    if (
      controller &&
      typeof controller.getFrameState === "function"
    ) {
      try {
        const frame =
          controller.getFrameState();

        return Boolean(
          frame &&
            frame.reducedMotion
        );
      } catch (_) {}
    }

    return false;
  }

  function rootReducedMotion() {
    return Boolean(
      state.root &&
        (
          state.root.dataset.showroomReducedMotion === "true" ||
          state.root.dataset.reducedMotion === "true"
        )
    );
  }

  function mediaReducedMotion() {
    return Boolean(
      state.reducedMotionMediaQuery &&
        state.reducedMotionMediaQuery.matches
    );
  }

  function resolveReducedMotion(
    requestedValue
  ) {
    const requestedReduced =
      requestedValue === true;

    state.reducedMotion =
      requestedReduced ||
      controllerReducedMotion() ||
      rootReducedMotion() ||
      mediaReducedMotion();

    if (state.root) {
      state.root.dataset.showroomWindowReducedMotion =
        state.reducedMotion
          ? "true"
          : "false";
    }

    return state.reducedMotion;
  }

  function startTransition({
    id,
    to,
    duration,
    rendererState,
    action
  }) {
    if (!id) {
      emitFailure(
        "SHOWROOM_WINDOW_TRANSITION_ID_MISSING"
      );

      return false;
    }

    state.activeTransitionId =
      id;

    state.rendererState =
      rendererState;

    state.transition = {
      from:
        state.veilAmount,

      to,

      progress:
        0,

      startTime:
        performance.now(),

      duration:
        Math.max(
          1,
          duration
        )
    };

    writeWindowState();

    emitReceipt({
      lastAction:
        action,

      lastFailure:
        null
    });

    return true;
  }

  function openWindow(
    id =
      transitionId("showroom-window-open")
  ) {
    if (
      state.failed ||
      state.disposed
    ) {
      return false;
    }

    resolveReducedMotion(false);

    if (
      state.rendererState === STATES.OPEN ||
      state.rendererState === STATES.OPENING
    ) {
      state.activeTransitionId =
        id;

      emitReceipt({
        lastAction:
          "window-already-open-or-opening",

        lastFailure:
          null
      });

      if (state.rendererState === STATES.OPEN) {
        dispatch(
          EVENTS.OPEN_COMPLETE,
          {
            transitionId:
              id,

            diamondRevealed:
              true,

            glassVisible:
              false
          }
        );
      }

      return true;
    }

    dispatch(
      EVENTS.OPEN_REQUEST,
      {
        transitionId:
          id,

        notificationOnly:
          true,

        requestedEffect:
          "dissolve-glass-reveal-diamond"
      }
    );

    return startTransition({
      id,

      to:
        0,

      duration:
        state.reducedMotion
          ? TIMING.reducedOpenMs
          : TIMING.openMs,

      rendererState:
        STATES.OPENING,

      action:
        "window-open-started-glass-dissolving"
    });
  }

  function restoreWindow(
    id =
      transitionId("showroom-window-restore")
  ) {
    if (
      state.failed ||
      state.disposed
    ) {
      return false;
    }

    resolveReducedMotion(false);

    if (
      state.rendererState === STATES.CLOSED ||
      state.rendererState === STATES.CLOSING
    ) {
      state.activeTransitionId =
        id;

      emitReceipt({
        lastAction:
          "window-already-closed-or-closing",

        lastFailure:
          null
      });

      if (state.rendererState === STATES.CLOSED) {
        dispatch(
          EVENTS.RESTORE_COMPLETE,
          {
            transitionId:
              id,

            diamondRevealed:
              false,

            glassVisible:
              true
          }
        );

        state.activeTransitionId =
          "";
      }

      return true;
    }

    dispatch(
      EVENTS.RESTORE_REQUEST,
      {
        transitionId:
          id,

        notificationOnly:
          true,

        requestedEffect:
          "restore-glass-hide-diamond"
      }
    );

    return startTransition({
      id,

      to:
        1,

      duration:
        state.reducedMotion
          ? TIMING.reducedRestoreMs
          : TIMING.restoreMs,

      rendererState:
        STATES.CLOSING,

      action:
        "window-restore-started-glass-returning"
    });
  }

  function toggleWindow() {
    if (
      state.rendererState === STATES.OPEN ||
      state.rendererState === STATES.OPENING
    ) {
      return restoreWindow();
    }

    return openWindow();
  }

  function handleControlClick(
    event
  ) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();

      if (
        typeof event.stopImmediatePropagation === "function"
      ) {
        event.stopImmediatePropagation();
      }
    }

    toggleWindow();
  }

  function handleReducedMotionMediaChange() {
    const previous =
      state.reducedMotion;

    resolveReducedMotion(false);

    emitReceipt({
      lastAction:
        "reduced-motion-media-updated",

      reducedMotionSource:
        "media-query-change",

      reducedMotionChanged:
        previous !== state.reducedMotion
    });
  }

  function handleWindowResize() {
    resize();
  }

  function bindEvents() {
    if (state.eventsBound) {
      return;
    }

    state.eventsBound =
      true;

    if (state.control) {
      state.control.addEventListener(
        "click",
        handleControlClick
      );
    }
  }

  function unbindEvents() {
    if (!state.eventsBound) {
      return;
    }

    state.eventsBound =
      false;

    if (state.control) {
      state.control.removeEventListener(
        "click",
        handleControlClick
      );
    }
  }

  function bindReducedMotion() {
    if (state.reducedMotionBound) {
      return;
    }

    state.reducedMotionBound =
      true;

    if (
      typeof globalThis.matchMedia === "function"
    ) {
      state.reducedMotionMediaQuery =
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        );

      if (
        typeof state.reducedMotionMediaQuery.addEventListener === "function"
      ) {
        state.reducedMotionMediaQuery.addEventListener(
          "change",
          handleReducedMotionMediaChange
        );
      } else if (
        typeof state.reducedMotionMediaQuery.addListener === "function"
      ) {
        state.reducedMotionMediaQuery.addListener(
          handleReducedMotionMediaChange
        );
      }
    }

    resolveReducedMotion(false);
  }

  function unbindReducedMotion() {
    if (!state.reducedMotionBound) {
      return;
    }

    state.reducedMotionBound =
      false;

    const media =
      state.reducedMotionMediaQuery;

    if (media) {
      if (
        typeof media.removeEventListener === "function"
      ) {
        media.removeEventListener(
          "change",
          handleReducedMotionMediaChange
        );
      } else if (
        typeof media.removeListener === "function"
      ) {
        media.removeListener(
          handleReducedMotionMediaChange
        );
      }
    }

    state.reducedMotionMediaQuery =
      null;
  }

  function bindResizeObserver() {
    if (
      state.resizeObserver ||
      state.resizeFallbackBound
    ) {
      return;
    }

    if (
      typeof ResizeObserver === "function"
    ) {
      state.resizeObserver =
        new ResizeObserver(
          resize
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
      handleWindowResize,
      {
        passive:
          true
      }
    );
  }

  function unbindResizeObserver() {
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
        handleWindowResize
      );
    }
  }

  function removeGeneratedCanvas() {
    if (
      state.createdCanvas &&
      state.canvas
    ) {
      state.canvas.remove();
    }

    state.canvas =
      null;

    state.context =
      null;

    state.createdCanvas =
      false;
  }

  function clearGeometry() {
    state.panes =
      [];

    state.frameSegments =
      [];

    state.geometryReady =
      false;
  }

  function rollbackPartialInitialization(
    reason
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

    unbindEvents();
    unbindReducedMotion();
    unbindResizeObserver();

    removeGeneratedCanvas();
    clearGeometry();

    state.initialized =
      false;

    emitFailure(
      reason
    );
  }

  function dispose() {
    if (state.disposed) {
      return;
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

    unbindEvents();
    unbindReducedMotion();
    unbindResizeObserver();

    removeGeneratedCanvas();
    clearGeometry();

    state.initialized =
      false;

    state.failed =
      false;

    state.rendererState =
      STATES.DISPOSED;

    state.activeTransitionId =
      "";

    state.transition = {
      from:
        state.veilAmount,

      to:
        state.veilAmount,

      progress:
        1,

      startTime:
        0,

      duration:
        0
    };

    writeWindowState();

    emitReceipt({
      status:
        "disposed",

      initialized:
        false,

      rendererState:
        STATES.DISPOSED,

      canvasPresent:
        false,

      paneCount:
        0,

      frameCount:
        0,

      lastAction:
        "window-renderer-disposed",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.DISPOSED,
      {
        disposed:
          true
      }
    );
  }

  function exposeApi() {
    globalThis.SHOWROOM_MIRRORLAND_WINDOW =
      Object.freeze({
        contract:
          CONTRACT,

        events:
          EVENTS,

        states:
          STATES,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        getState:
          () =>
            Object.freeze({
              rendererState:
                state.rendererState,

              activeTransitionId:
                state.activeTransitionId,

              veilAmount:
                state.veilAmount,

              glassAmount:
                glassAmount(),

              revealAmount:
                revealAmount(),

              reducedMotion:
                state.reducedMotion,

              running:
                state.running,

              initialized:
                state.initialized,

              disposed:
                state.disposed,

              visualSemantics:
                "closed-glass-visible-open-glass-dissolved",

              canvasPointerEvents:
                "none",

              buttonOnlyInteraction:
                true,

              ownsDiamond:
                false,

              ownsDiamondPointerInteraction:
                false
            }),

        open:
          openWindow,

        restore:
          restoreWindow,

        toggle:
          toggleWindow,

        stop:
          () => {
            if (
              state.disposed ||
              !state.running
            ) {
              return;
            }

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
                "stopped",

              lastAction:
                "window-renderer-stopped"
            });
          },

        start:
          () => {
            if (
              state.failed ||
              state.disposed ||
              state.running ||
              !state.initialized ||
              !state.context
            ) {
              return;
            }

            state.running =
              true;

            state.raf =
              requestAnimationFrame(
                render
              );

            emitReceipt({
              status:
                "available",

              lastAction:
                "window-renderer-started"
            });
          },

        dispose
      });
  }

  function resolveDom() {
    state.root =
      qs(
        SELECTORS.root
      );

    if (!state.root) {
      throw new Error(
        "SHOWROOM_ROOT_NOT_FOUND"
      );
    }

    state.threshold =
      qs(
        SELECTORS.threshold,
        state.root
      );

    if (!state.threshold) {
      throw new Error(
        "SHOWROOM_WINDOW_THRESHOLD_NOT_FOUND"
      );
    }

    state.layer =
      qs(
        SELECTORS.layer,
        state.threshold
      );

    if (!state.layer) {
      throw new Error(
        "SHOWROOM_WINDOW_LAYER_NOT_FOUND"
      );
    }

    state.mount =
      qs(
        SELECTORS.mount,
        state.layer
      );

    if (!state.mount) {
      throw new Error(
        "SHOWROOM_WINDOW_MOUNT_NOT_FOUND"
      );
    }

    state.control =
      qs(
        SELECTORS.control,
        state.layer
      );

    if (!state.control) {
      throw new Error(
        "SHOWROOM_WINDOW_CONTROL_NOT_FOUND"
      );
    }

    state.label =
      qs(
        SELECTORS.label,
        state.control
      );

    state.receiptOutput =
      qs(
        SELECTORS.receipt,
        state.root
      );
  }

  function initGeometry() {
    state.panes =
      buildPanes();

    state.frameSegments =
      Array.from(
        buildFrameSegments()
      );

    if (state.panes.length !== 21) {
      throw new Error(
        `SHOWROOM_WINDOW_PANE_COUNT_INVALID:${state.panes.length}`
      );
    }

    if (state.frameSegments.length !== 2) {
      throw new Error(
        `SHOWROOM_WINDOW_FRAME_SEGMENT_COUNT_INVALID:${state.frameSegments.length}`
      );
    }

    state.geometryReady =
      true;
  }

  function init() {
    try {
      state.failed =
        false;

      state.disposed =
        false;

      resolveDom();
      exposeApi();
      bindReducedMotion();
      initGeometry();

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
        throw new Error(
          "SHOWROOM_WINDOW_2D_CONTEXT_UNAVAILABLE"
        );
      }

      bindEvents();
      bindResizeObserver();

      resize();

      state.rendererState =
        STATES.CLOSED;

      state.veilAmount =
        1;

      state.activeTransitionId =
        "";

      state.transition = {
        from:
          1,

        to:
          1,

        progress:
          1,

        startTime:
          0,

        duration:
          0
      };

      state.initialized =
        true;

      state.running =
        true;

      writeWindowState();

      emitReceipt({
        status:
          "available",

        initialized:
          true,

        rendererState:
          STATES.CLOSED,

        glassAmount:
          1,

        lastAction:
          "window-renderer-initialized-glass-covering-diamond",

        lastFailure:
          null,

        reducedMotionSource:
          "startup"
      });

      state.raf =
        requestAnimationFrame(
          render
        );
    } catch (error) {
      rollbackPartialInitialization(
        `SHOWROOM_WINDOW_INIT_FAILURE:${
          error &&
          error.message
            ? error.message
            : String(error)
        }`
      );
    }
  }

  if (
    document.readyState === "loading"
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
