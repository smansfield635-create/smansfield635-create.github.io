/* /assets/compass/compass.mirrorland-window.js
   Diamond Gate Bridge Compass
   Self-contained Mirrorland Window renderer.

   Ownership:
   - Mirrorland Window canvas creation.
   - Stained-glass geometry.
   - Internal window animation.
   - Reveal and withdrawal lifecycle.
   - Mirrorland renderer receipts.
   - Reveal, withdrawal, and failure completion events.

   Non-ownership:
   - Compass state authority.
   - Cardinal or room rendering.
   - Navigation.
   - Compass gesture interpretation.
   - External Mirrorland review objects.

   No external Mirrorland object dependency is required.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_MIRRORLAND_WINDOW_FIVE_FILE_REBUILD_v1",
    file: "/assets/compass/compass.mirrorland-window.js",
    releaseId: "dgb-compass-mirrorland-rebuild-v1",
    rendererClass: "SELF_CONTAINED_2D_CRYSTALLINE_STAINED_GLASS",
    externalObjectDependencyRequired: false,
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const STATES = Object.freeze({
    DORMANT: "DORMANT",
    REVEALING: "MIRRORLAND_REVEALING",
    FOCUSED: "MIRRORLAND_FOCUSED",
    WITHDRAWING: "MIRRORLAND_WITHDRAWING",
    HELD: "HELD"
  });

  const EVENTS = Object.freeze({
    REVEAL_REQUEST:
      "DGB_MIRRORLAND_WINDOW_REVEAL_REQUEST",

    WITHDRAW_REQUEST:
      "DGB_MIRRORLAND_WINDOW_WITHDRAW_REQUEST",

    REVEAL_COMPLETE:
      "MIRRORLAND_WINDOW_REVEAL_COMPLETE",

    WITHDRAWAL_COMPLETE:
      "MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE",

    RENDER_FAILURE:
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
  });

  const TIMING = Object.freeze({
    revealMs: 1450,
    withdrawalMs: 980,

    reducedRevealMs: 120,
    reducedWithdrawalMs: 100,

    dormantPulseSeconds: 6.8,
    focusedPulseSeconds: 4.2,

    sparklePeriodSeconds: 2.9
  });

  const DIMENSIONS = Object.freeze({
    designWidth: 480,
    designHeight: 720,

    leadWidth: 8,
    innerLeadWidth: 4,

    dormantScale: 0.72,
    focusedScale: 1,

    dormantOpacity: 0.62,
    focusedOpacity: 1,

    dormantDepth: 0.14,
    focusedDepth: 1,

    maximumDevicePixelRatio: 2
  });

  const COLORS = Object.freeze({
    frameNearBlack: "#05080f",
    frameMid: "#101622",
    frameEdge: "#253044",

    leadDark: "#11151d",
    leadLight: "#455065",

    cyan: Object.freeze([87, 210, 231]),
    blue: Object.freeze([67, 112, 204]),
    violet: Object.freeze([133, 83, 201]),
    amber: Object.freeze([226, 164, 79]),
    rose: Object.freeze([198, 85, 132]),

    paleCyan: Object.freeze([161, 235, 244]),
    paleBlue: Object.freeze([143, 181, 234]),
    paleViolet: Object.freeze([184, 149, 232]),
    paleAmber: Object.freeze([239, 202, 132]),
    paleRose: Object.freeze([229, 151, 185])
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    status: "pending",
    rendererInitialized: false,
    rendererState: STATES.DORMANT,
    activeTransitionId: "",
    externalDependencyPresent: false,
    externalDependencyRequired: false,
    canvasPresent: false,
    paneCount: 0,
    frameCount: 0,
    reducedMotion: false,
    lastAction: "",
    lastFailure: null,
    visualPassClaimed: false
  };

  const state = {
    root: null,
    scene: null,
    mount: null,
    receiptOutput: null,

    canvas: null,
    context: null,

    width: 1,
    height: 1,
    pixelRatio: 1,

    rendererState: STATES.DORMANT,
    activeTransitionId: "",

    transition: {
      from: 0,
      to: 0,
      progress: 0,
      startTime: 0,
      duration: 0
    },

    revealAmount: 0,
    targetRevealAmount: 0,

    reducedMotion: false,

    raf: 0,
    running: false,
    lastTime: 0,
    time: 0,

    resizeObserver: null,

    panes: [],
    frameSegments: [],

    geometryReady: false,
    initialized: false,
    failed: false
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function clamp(value, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
  }

  function lerp(a, b, amount) {
    return a + (b - a) * amount;
  }

  function easeOutCubic(value) {
    const inverse = 1 - value;
    return 1 - inverse * inverse * inverse;
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 -
          Math.pow(-2 * value + 2, 3) /
            2;
  }

  function rgba(color, alpha) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
  }

  function emitReceipt(extra = {}) {
    Object.assign(
      RECEIPT,
      {
        status:
          state.failed
            ? "held"
            : "available",

        rendererInitialized:
          state.initialized,

        rendererState:
          state.rendererState,

        activeTransitionId:
          state.activeTransitionId,

        externalDependencyPresent:
          Boolean(
            globalThis
              .DGB_MIRRORLAND_SELF_CONTAINED_REVIEW_OBJECT_v1
          ),

        externalDependencyRequired:
          false,

        canvasPresent:
          Boolean(state.canvas),

        paneCount:
          state.panes.length,

        frameCount:
          state.frameSegments.length,

        reducedMotion:
          state.reducedMotion,

        visualPassClaimed:
          false
      },
      extra
    );

    const serialized =
      JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset
        .compassMirrorlandWindowReceipt =
        serialized;

      state.root.dataset
        .compassMirrorlandWindowStatus =
        RECEIPT.status;

      state.root.dataset
        .visualPassClaimed =
        "false";
    }

    if (state.canvas) {
      state.canvas.dataset
        .compassMirrorlandWindowReceipt =
        serialized;

      state.canvas.dataset
        .visualPassClaimed =
        "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value =
        serialized;

      state.receiptOutput.textContent =
        serialized;

      state.receiptOutput.dataset
        .visualPassClaimed =
        "false";
    }

    globalThis
      .DGB_COMPASS_MIRRORLAND_WINDOW_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });
  }

  function dispatch(type, detail = {}) {
    globalThis.dispatchEvent(
      new CustomEvent(type, {
        detail: Object.freeze({
          ...detail
        })
      })
    );
  }

  function emitFailure(reason) {
    if (state.failed) {
      return;
    }

    state.failed = true;
    state.rendererState =
      STATES.HELD;

    state.running = false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );

      state.raf = 0;
    }

    emitReceipt({
      status: "held",
      rendererInitialized: false,
      lastAction:
        "mirrorland-render-failure",
      lastFailure:
        String(
          reason ||
          "UNKNOWN_MIRRORLAND_RENDER_FAILURE"
        )
    });

    dispatch(
      EVENTS.RENDER_FAILURE,
      {
        transitionId:
          state.activeTransitionId,

        reason:
          String(
            reason ||
            "UNKNOWN_MIRRORLAND_RENDER_FAILURE"
          )
      }
    );
  }

  function createCanvas() {
    const existing =
      qs(
        "canvas[data-compass-mirrorland-window-canvas]",
        state.mount
      );

    if (existing) {
      return existing;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.dataset
      .compassMirrorlandWindowCanvas =
      "true";

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "role",
      "presentation"
    );

    canvas.style.position =
      "absolute";

    canvas.style.top = "50%";
    canvas.style.left = "50%";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.display =
      "block";

    canvas.style.pointerEvents =
      "none";

    canvas.style.transform =
      "translate(-50%, -50%)";

    canvas.style.transformOrigin =
      "center";

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
          points.map((point) =>
            Object.freeze([
              point[0],
              point[1]
            ])
          )
        ),

      alpha:
        options.alpha ?? 0.70,

      glow:
        options.glow ?? 0.30,

      depth:
        options.depth ?? 0.5,

      phase:
        options.phase ?? 0,

      grain:
        options.grain ?? 0.12,

      highlight:
        options.highlight ?? 0.16
    });
  }

  function buildPanes() {
    const panes = [
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
    ];

    return panes;
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

  function traceOuterWindow(
    context
  ) {
    context.beginPath();

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

  function traceInnerWindow(
    context
  ) {
    context.beginPath();

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

  function createPaneGradient(
    context,
    pane,
    revealAmount,
    shimmer
  ) {
    const bounds =
      pane.points.reduce(
        (result, point) => ({
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
          minimumX: Infinity,
          maximumX: -Infinity,
          minimumY: Infinity,
          maximumY: -Infinity
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
      (
        0.52 +
        revealAmount * 0.48
      );

    gradient.addColorStop(
      0,
      rgba(
        pane.color,
        clamp(
          alpha *
            (
              0.68 +
              shimmer * 0.10
            ),
          0,
          1
        )
      )
    );

    gradient.addColorStop(
      0.48,
      rgba(
        pane.color,
        clamp(
          alpha *
            (
              0.92 +
              shimmer * 0.12
            ),
          0,
          1
        )
      )
    );

    gradient.addColorStop(
      1,
      rgba(
        pane.color,
        clamp(
          alpha * 0.58,
          0,
          1
        )
      )
    );

    return gradient;
  }

  function drawPane(
    context,
    pane,
    revealAmount,
    time
  ) {
    const shimmer =
      state.reducedMotion
        ? 0
        : Math.sin(
            time * 0.72 +
            pane.phase
          );

    const depthShift =
      pane.depth *
      revealAmount *
      2.2;

    context.save();

    context.translate(
      shimmer *
        pane.depth *
        0.6,
      -depthShift * 0.18
    );

    tracePolygon(
      context,
      pane.points
    );

    context.fillStyle =
      createPaneGradient(
        context,
        pane,
        revealAmount,
        shimmer
      );

    context.shadowBlur =
      10 +
      pane.glow *
        26 *
        revealAmount;

    context.shadowColor =
      rgba(
        pane.color,
        pane.glow *
          (
            0.20 +
            revealAmount * 0.42
          )
      );

    context.fill();

    context.shadowBlur = 0;

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
        (
          0.18 +
          revealAmount * 0.50
        )
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
        0.15
      })`
    );

    context.fillStyle =
      highlight;

    context.fill();

    context.strokeStyle =
      `rgba(255, 255, 255, ${
        0.035 +
        pane.highlight *
          revealAmount *
          0.26
      })`;

    context.lineWidth = 1.4;

    context.stroke();

    if (
      !state.reducedMotion &&
      pane.grain > 0
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
          index * 5.3;

        const x =
          pane.points[0][0] +
          (
            Math.sin(
              seed * 4.9
            ) *
              0.5 +
            0.5
          ) *
          90;

        const y =
          pane.points[0][1] +
          (
            Math.sin(
              seed * 2.7 +
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
            revealAmount
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
    revealAmount
  ) {
    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    context.strokeStyle =
      `rgba(7, 10, 16, ${
        0.88 +
        revealAmount * 0.08
      })`;

    context.lineWidth =
      DIMENSIONS.leadWidth;

    state.panes.forEach(
      (pane) => {
        tracePolygon(
          context,
          pane.points
        );

        context.stroke();
      }
    );

    context.strokeStyle =
      `rgba(74, 83, 102, ${
        0.22 +
        revealAmount * 0.16
      })`;

    context.lineWidth =
      DIMENSIONS.innerLeadWidth;

    state.panes.forEach(
      (pane) => {
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
    revealAmount
  ) {
    context.save();

    traceOuterWindow(context);

    const frameGradient =
      context.createLinearGradient(
        0,
        0,
        DIMENSIONS.designWidth,
        0
      );

    frameGradient.addColorStop(
      0,
      COLORS.frameNearBlack
    );

    frameGradient.addColorStop(
      0.22,
      COLORS.frameMid
    );

    frameGradient.addColorStop(
      0.50,
      COLORS.frameNearBlack
    );

    frameGradient.addColorStop(
      0.78,
      COLORS.frameMid
    );

    frameGradient.addColorStop(
      1,
      COLORS.frameNearBlack
    );

    context.fillStyle =
      frameGradient;

    context.shadowBlur =
      28 +
      revealAmount * 34;

    context.shadowColor =
      `rgba(65, 132, 183, ${
        0.08 +
        revealAmount * 0.16
      })`;

    context.fill();

    context.shadowBlur = 0;

    context.strokeStyle =
      `rgba(94, 108, 132, ${
        0.46 +
        revealAmount * 0.24
      })`;

    context.lineWidth = 7;

    context.stroke();

    traceInnerWindow(context);

    context.globalCompositeOperation =
      "destination-out";

    context.fill();

    context.restore();
  }

  function drawFrameRibs(
    context,
    revealAmount
  ) {
    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    state.frameSegments.forEach(
      (segment) => {
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
            0.92 +
            revealAmount * 0.06
          })`;

        context.lineWidth = 14;
        context.stroke();

        context.strokeStyle =
          `rgba(79, 89, 110, ${
            0.20 +
            revealAmount * 0.16
          })`;

        context.lineWidth = 3;
        context.stroke();
      }
    );

    context.restore();
  }

  function drawInnerLight(
    context,
    revealAmount,
    time
  ) {
    context.save();

    traceInnerWindow(
      context
    );

    context.clip();

    const pulse =
      state.reducedMotion
        ? 0.5
        : (
            Math.sin(
              time *
                (
                  state.rendererState ===
                  STATES.FOCUSED
                    ? 1.45
                    : 0.86
                )
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
        0.10 +
        revealAmount *
          (
            0.16 +
            pulse * 0.08
          )
      })`
    );

    centerGlow.addColorStop(
      0.30,
      `rgba(95, 151, 221, ${
        0.06 +
        revealAmount * 0.10
      })`
    );

    centerGlow.addColorStop(
      0.62,
      `rgba(118, 74, 169, ${
        0.04 +
        revealAmount * 0.08
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

    if (!state.reducedMotion) {
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
          0.018 +
          revealAmount *
            (
              0.024 +
              pulse * 0.018
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

  function drawDormantShadow(
    context,
    revealAmount
  ) {
    const dormantWeight =
      1 - revealAmount;

    if (dormantWeight <= 0) {
      return;
    }

    context.save();

    traceOuterWindow(
      context
    );

    context.strokeStyle =
      `rgba(193, 171, 118, ${
        0.08 +
        dormantWeight * 0.08
      })`;

    context.lineWidth = 2;

    context.shadowBlur =
      18;

    context.shadowColor =
      `rgba(94, 158, 202, ${
        dormantWeight * 0.10
      })`;

    context.stroke();

    context.restore();
  }

  function drawSparkles(
    context,
    revealAmount,
    time
  ) {
    if (
      state.reducedMotion ||
      revealAmount < 0.42
    ) {
      return;
    }

    context.save();

    traceInnerWindow(
      context
    );

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
      (point) => {
        const pulse =
          Math.sin(
            time *
              (
                Math.PI * 2 /
                TIMING
                  .sparklePeriodSeconds
              ) +
            point[2]
          );

        const alpha =
          clamp(
            (
              pulse - 0.52
            ) *
            1.9,
            0,
            1
          ) *
          revealAmount *
          0.52;

        if (alpha <= 0.01) {
          return;
        }

        const radius =
          1.2 +
          alpha * 2.4;

        const gradient =
          context.createRadialGradient(
            point[0],
            point[1],
            0,
            point[0],
            point[1],
            radius * 5
          );

        gradient.addColorStop(
          0,
          `rgba(255, 250, 224, ${
            alpha
          })`
        );

        gradient.addColorStop(
          0.28,
          `rgba(187, 229, 255, ${
            alpha * 0.48
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
          radius * 5,
          0,
          Math.PI * 2
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

    const designScale =
      Math.min(
        cssWidth /
          DIMENSIONS.designWidth,

        cssHeight /
          DIMENSIONS.designHeight
      );

    const reveal =
      clamp(
        state.revealAmount,
        0,
        1
      );

    const scale =
      lerp(
        DIMENSIONS.dormantScale,
        DIMENSIONS.focusedScale,
        reveal
      );

    const opacity =
      lerp(
        DIMENSIONS.dormantOpacity,
        DIMENSIONS.focusedOpacity,
        reveal
      );

    const horizontalDrift =
      state.reducedMotion
        ? 0
        : Math.sin(
            state.time * 0.24
          ) *
          1.2 *
          (
            1 -
            reveal * 0.65
          );

    const verticalDrift =
      state.reducedMotion
        ? 0
        : Math.sin(
            state.time * 0.31 +
            1.2
          ) *
          1.6 *
          (
            1 -
            reveal * 0.52
          );

    context.translate(
      cssWidth / 2 +
        horizontalDrift,

      cssHeight / 2 +
        verticalDrift
    );

    context.scale(
      designScale * scale,
      designScale * scale
    );

    context.translate(
      -DIMENSIONS.designWidth / 2,
      -DIMENSIONS.designHeight / 2
    );

    context.globalAlpha =
      opacity;

    drawDormantShadow(
      context,
      reveal
    );

    context.save();

    traceInnerWindow(
      context
    );

    context.clip();

    drawInnerLight(
      context,
      reveal,
      state.time
    );

    state.panes.forEach(
      (pane) => {
        drawPane(
          context,
          pane,
          reveal,
          state.time
        );
      }
    );

    context.restore();

    drawLeadLines(
      context,
      reveal
    );

    drawFrameRibs(
      context,
      reveal
    );

    drawOuterFrame(
      context,
      reveal
    );

    drawSparkles(
      context,
      reveal,
      state.time
    );

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
      state.mount
        .getBoundingClientRect();

    const ratio =
      Math.min(
        globalThis.devicePixelRatio || 1,
        DIMENSIONS
          .maximumDevicePixelRatio
      );

    const width =
      Math.max(
        1,
        Math.floor(
          rect.width * ratio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height * ratio
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

    state.width = width;
    state.height = height;
    state.pixelRatio = ratio;
  }

  function completeReveal() {
    const transitionId =
      state.activeTransitionId;

    state.rendererState =
      STATES.FOCUSED;

    state.revealAmount = 1;
    state.targetRevealAmount = 1;

    state.transition.progress = 1;

    emitReceipt({
      lastAction:
        "mirrorland-reveal-complete",
      lastFailure: null
    });

    dispatch(
      EVENTS.REVEAL_COMPLETE,
      {
        transitionId
      }
    );
  }

  function completeWithdrawal() {
    const transitionId =
      state.activeTransitionId;

    state.rendererState =
      STATES.DORMANT;

    state.revealAmount = 0;
    state.targetRevealAmount = 0;

    state.transition.progress = 1;

    state.activeTransitionId = "";

    emitReceipt({
      lastAction:
        "mirrorland-withdrawal-complete",
      lastFailure: null
    });

    dispatch(
      EVENTS.WITHDRAWAL_COMPLETE,
      {
        transitionId
      }
    );
  }

  function updateTransition(now) {
    if (
      state.rendererState !==
        STATES.REVEALING &&
      state.rendererState !==
        STATES.WITHDRAWING
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
        elapsed / duration,
        0,
        1
      );

    const eased =
      state.rendererState ===
      STATES.REVEALING
        ? easeOutCubic(
            rawProgress
          )
        : easeInOutCubic(
            rawProgress
          );

    state.transition.progress =
      rawProgress;

    state.revealAmount =
      lerp(
        state.transition.from,
        state.transition.to,
        eased
      );

    if (rawProgress < 1) {
      return;
    }

    if (
      state.rendererState ===
      STATES.REVEALING
    ) {
      completeReveal();
    } else {
      completeWithdrawal();
    }
  }

  function render(now) {
    if (
      !state.running ||
      state.failed
    ) {
      return;
    }

    state.time =
      now * 0.001;

    state.lastTime = now;

    resize();
    updateTransition(now);
    drawWindow();

    state.raf =
      requestAnimationFrame(
        render
      );
  }

  function startTransition({
    transitionId,
    target,
    duration,
    rendererState,
    action
  }) {
    if (!transitionId) {
      emitFailure(
        "MIRRORLAND_TRANSITION_ID_MISSING"
      );

      return false;
    }

    state.activeTransitionId =
      transitionId;

    state.rendererState =
      rendererState;

    state.targetRevealAmount =
      target;

    state.transition = {
      from:
        state.revealAmount,

      to:
        target,

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

    emitReceipt({
      lastAction:
        action,

      lastFailure:
        null
    });

    return true;
  }

  function requestReveal(event) {
    if (state.failed) {
      return;
    }

    const detail =
      event.detail || {};

    const transitionId =
      String(
        detail.transitionId || ""
      ).trim();

    state.reducedMotion =
      Boolean(
        detail.reducedMotion
      ) ||
      state.reducedMotion;

    if (
      state.rendererState ===
        STATES.REVEALING &&
      transitionId ===
        state.activeTransitionId
    ) {
      return;
    }

    if (
      state.rendererState ===
        STATES.FOCUSED
    ) {
      state.activeTransitionId =
        transitionId;

      emitReceipt({
        lastAction:
          "mirrorland-already-focused"
      });

      dispatch(
        EVENTS.REVEAL_COMPLETE,
        {
          transitionId
        }
      );

      return;
    }

    startTransition({
      transitionId,

      target:
        1,

      duration:
        state.reducedMotion
          ? TIMING.reducedRevealMs
          : TIMING.revealMs,

      rendererState:
        STATES.REVEALING,

      action:
        "mirrorland-reveal-started"
    });
  }

  function requestWithdrawal(event) {
    if (state.failed) {
      return;
    }

    const detail =
      event.detail || {};

    const transitionId =
      String(
        detail.transitionId || ""
      ).trim();

    state.reducedMotion =
      Boolean(
        detail.reducedMotion
      ) ||
      state.reducedMotion;

    if (
      state.rendererState ===
        STATES.WITHDRAWING &&
      transitionId ===
        state.activeTransitionId
    ) {
      return;
    }

    if (
      state.rendererState ===
        STATES.DORMANT
    ) {
      state.activeTransitionId =
        transitionId;

      emitReceipt({
        lastAction:
          "mirrorland-already-dormant"
      });

      dispatch(
        EVENTS.WITHDRAWAL_COMPLETE,
        {
          transitionId
        }
      );

      state.activeTransitionId =
        "";

      return;
    }

    startTransition({
      transitionId,

      target:
        0,

      duration:
        state.reducedMotion
          ? TIMING
              .reducedWithdrawalMs
          : TIMING
              .withdrawalMs,

      rendererState:
        STATES.WITHDRAWING,

      action:
        "mirrorland-withdrawal-started"
    });
  }

  function bindEvents() {
    globalThis.addEventListener(
      EVENTS.REVEAL_REQUEST,
      requestReveal
    );

    globalThis.addEventListener(
      EVENTS.WITHDRAW_REQUEST,
      requestWithdrawal
    );
  }

  function readReducedMotion() {
    const media =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    state.reducedMotion =
      media.matches ||
      (
        state.root &&
        state.root.dataset
          .reducedMotion === "true"
      );

    if (
      typeof media
        .addEventListener ===
      "function"
    ) {
      media.addEventListener(
        "change",
        (event) => {
          state.reducedMotion =
            event.matches ||
            (
              state.root &&
              state.root.dataset
                .reducedMotion ===
                "true"
            );

          emitReceipt({
            lastAction:
              "reduced-motion-updated"
          });
        }
      );
    }
  }

  function bindResizeObserver() {
    if (
      typeof ResizeObserver !==
      "function"
    ) {
      globalThis.addEventListener(
        "resize",
        resize,
        {
          passive: true
        }
      );

      return;
    }

    state.resizeObserver =
      new ResizeObserver(
        resize
      );

    state.resizeObserver.observe(
      state.mount
    );
  }

  function exposeApi() {
    globalThis
      .DGB_COMPASS_MIRRORLAND_WINDOW =
      Object.freeze({
        contract:
          CONTRACT,

        receipt: () =>
          Object.freeze({
            ...RECEIPT
          }),

        getState: () =>
          Object.freeze({
            rendererState:
              state.rendererState,

            activeTransitionId:
              state.activeTransitionId,

            revealAmount:
              state.revealAmount,

            reducedMotion:
              state.reducedMotion
          }),

        reveal:
          (
            transitionId =
              `manual-reveal-${Date.now()}`
          ) => {
            requestReveal({
              detail: {
                transitionId,
                reducedMotion:
                  state.reducedMotion
              }
            });
          },

        withdraw:
          (
            transitionId =
              `manual-withdraw-${Date.now()}`
          ) => {
            requestWithdrawal({
              detail: {
                transitionId,
                reducedMotion:
                  state.reducedMotion
              }
            });
          },

        stop: () => {
          state.running = false;

          if (state.raf) {
            cancelAnimationFrame(
              state.raf
            );

            state.raf = 0;
          }

          emitReceipt({
            status: "stopped",
            lastAction:
              "mirrorland-renderer-stopped"
          });
        },

        start: () => {
          if (
            state.failed ||
            state.running
          ) {
            return;
          }

          state.running = true;

          state.raf =
            requestAnimationFrame(
              render
            );

          emitReceipt({
            status: "available",
            lastAction:
              "mirrorland-renderer-started"
          });
        }
      });
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-compass-root]"
      );

    if (!state.root) {
      throw new Error(
        "COMPASS_ROOT_NOT_FOUND"
      );
    }

    state.scene =
      qs(
        "[data-compass-scene]",
        state.root
      );

    if (!state.scene) {
      throw new Error(
        "COMPASS_SCENE_NOT_FOUND"
      );
    }

    state.mount =
      qs(
        "[data-compass-mirrorland-window-mount]",
        state.root
      );

    if (!state.mount) {
      throw new Error(
        "MIRRORLAND_WINDOW_MOUNT_NOT_FOUND"
      );
    }

    state.receiptOutput =
      qs(
        "[data-compass-mirrorland-window-receipt]",
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

    if (
      state.panes.length < 12
    ) {
      throw new Error(
        "MIRRORLAND_PANE_GEOMETRY_INCOMPLETE"
      );
    }

    state.geometryReady =
      true;
  }

  function init() {
    try {
      resolveDom();
      readReducedMotion();
      initGeometry();

      state.canvas =
        createCanvas();

      state.context =
        state.canvas.getContext(
          "2d",
          {
            alpha: true,
            desynchronized: true
          }
        );

      if (!state.context) {
        throw new Error(
          "MIRRORLAND_2D_CONTEXT_UNAVAILABLE"
        );
      }

      bindEvents();
      bindResizeObserver();
      exposeApi();

      resize();

      state.rendererState =
        STATES.DORMANT;

      state.revealAmount =
        0;

      state.targetRevealAmount =
        0;

      state.initialized =
        true;

      state.running =
        true;

      emitReceipt({
        status: "available",

        rendererInitialized:
          true,

        rendererState:
          STATES.DORMANT,

        lastAction:
          "mirrorland-renderer-initialized",

        lastFailure:
          null
      });

      state.raf =
        requestAnimationFrame(
          render
        );
    } catch (error) {
      emitFailure(
        `MIRRORLAND_INIT_FAILURE:${
          error &&
          error.message
            ? error.message
            : String(error)
        }`
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
        once: true
      }
    );
  } else {
    init();
  }
})();
