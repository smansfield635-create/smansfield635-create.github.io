/* TARGET FILE: /showroom/globe/hearth/jeeves/jeeves.threshold.js */
/* TNT FULL-FILE REPLACEMENT */
/* DIAMOND_GATE_BRIDGE_JEEVES_ESTATE_THRESHOLD_RENDERER_TNT_v1 */
/*
  Purpose:
  - Render the Mirrorland stained-glass Window at the estate entrance.
  - Consume /assets/shared/mirrorland-window.geometry.js.
  - Coordinate the four-phase Jeeves estate-arrival introduction.
  - Present the visitor's transition from “Talk to the House” to Jeeves.
  - Freeze the page during guided arrival and restore normal access afterward.
  - Preserve skip, replay, keyboard, reduced-motion, and failure fallbacks.
  - Render a smaller settled stained-glass seal after the introduction.
  - Dispatch threshold lifecycle events consumed by the Jeeves runtime.

  Owns:
  - Jeeves threshold DOM coordination
  - threshold canvas creation
  - threshold stained-glass rendering
  - settled entrance-seal rendering
  - four-phase onboarding state
  - introduction progress
  - threshold reveal animation
  - page scroll locking during onboarding
  - skip and replay controls
  - session-level completion memory
  - threshold lifecycle events
  - threshold renderer receipt

  Does not own:
  - Mirrorland geometry definitions
  - Compass Mirrorland lifecycle
  - Jeeves dialogue
  - Jeeves conversation timing
  - Jeeves route execution
  - specialist interpretation
  - destination-page content
  - page styling
  - production, deployment, or public-release authority
*/

(() => {
  "use strict";

  const GLOBAL_NAME =
    "JEEVES_THRESHOLD";

  const CONTRACT = Object.freeze({
    id:
      "DIAMOND_GATE_BRIDGE_JEEVES_ESTATE_THRESHOLD_RENDERER_TNT_v1",

    file:
      "/showroom/globe/hearth/jeeves/jeeves.threshold.js",

    version:
      "1.0.0",

    geometryAuthority:
      "/assets/shared/mirrorland-window.geometry.js",

    geometryGlobal:
      "DGB_MIRRORLAND_WINDOW_GEOMETRY",

    phaseCount:
      4,

    arrivalMetaphor:
      "ESTATE_FRONT_DOOR",

    rendererClass:
      "JEEVES_MIRRORLAND_THRESHOLD_2D_CANVAS",

    conversationAuthority:
      false,

    voiceAuthority:
      false,

    routeAuthority:
      false,

    compassAuthority:
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

  const EVENTS = Object.freeze({
    GEOMETRY_READY:
      "dgb:mirrorland-window-geometry-ready",

    GEOMETRY_ERROR:
      "dgb:mirrorland-window-geometry-error",

    READY:
      "jeeves:threshold-ready",

    PHASE_CHANGE:
      "jeeves:threshold-phase-change",

    COMPLETE:
      "jeeves:threshold-complete",

    SKIP:
      "jeeves:threshold-skip",

    REPLAY_REQUEST:
      "jeeves:threshold-replay-request",

    REPLAY:
      "jeeves:threshold-replay",

    ERROR:
      "jeeves:threshold-error"
  });

  const SELECTORS = Object.freeze({
    threshold:
      "[data-jeeves-threshold]",

    page:
      "[data-jeeves-page]",

    windowMount:
      "[data-jeeves-threshold-window-mount]",

    settledWindowMount:
      "[data-jeeves-settled-window-mount]",

    advance:
      "[data-jeeves-threshold-advance]",

    skip:
      "[data-jeeves-threshold-skip]",

    status:
      "[data-jeeves-threshold-status]",

    progressLabel:
      "[data-jeeves-threshold-progress-label]",

    progressValue:
      "[data-jeeves-threshold-progress-value]",

    actionNote:
      "[data-jeeves-threshold-action-note]",

    panels:
      "[data-jeeves-threshold-panel]",

    replay:
      "[data-jeeves-replay-welcome]"
  });

  const PHASES = Object.freeze([
    Object.freeze({
      id:
        "arrival",

      index:
        1,

      label:
        "Arrival",

      button:
        "Approach the entrance",

      note:
        "Continue through the guided arrival sequence.",

      status:
        "The Mirrorland threshold is coming into view.",

      reveal:
        0.30,

      emphasis:
        "crown"
    }),

    Object.freeze({
      id:
        "host",

      index:
        2,

      label:
        "Your Host",

      button:
        "Meet Jeeves",

      note:
        "Jeeves is waiting at the front door.",

      status:
        "Jeeves is receiving you at the estate entrance.",

      reveal:
        0.58,

      emphasis:
        "center"
    }),

    Object.freeze({
      id:
        "conversation",

      index:
        3,

      label:
        "Conversation",

      button:
        "Learn the conversation",

      note:
        "Messages arrive one at a time and may be advanced individually.",

      status:
        "The hosted conversation is being prepared.",

      reveal:
        0.82,

      emphasis:
        "center"
    }),

    Object.freeze({
      id:
        "access",

      index:
        4,

      label:
        "Estate Access",

      button:
        "Enter the estate",

      note:
        "Open the full page and begin with Jeeves.",

      status:
        "The estate is ready to open.",

      reveal:
        1,

      emphasis:
        "branches"
    })
  ]);

  const TIMING = Object.freeze({
    revealMs:
      760,

    phaseRevealMs:
      620,

    settleMs:
      520,

    closeMs:
      460,

    replayOpenMs:
      420,

    reducedMs:
      1,

    geometryWaitMs:
      4500,

    maximumDevicePixelRatio:
      2,

    dormantPulseSeconds:
      7.8,

    focusedPulseSeconds:
      4.2,

    sparklePeriodSeconds:
      2.9
  });

  const STORAGE = Object.freeze({
    key:
      "DGB_JEEVES_ESTATE_THRESHOLD_COMPLETED_v1",

    completed:
      "true"
  });

  const state = {
    threshold:
      null,

    page:
      null,

    windowMount:
      null,

    settledWindowMount:
      null,

    advance:
      null,

    skip:
      null,

    status:
      null,

    progressLabel:
      null,

    progressValue:
      null,

    actionNote:
      null,

    panels:
      [],

    replayControls:
      [],

    geometry:
      null,

    primaryRenderer:
      null,

    settledRenderer:
      null,

    phaseIndex:
      0,

    thresholdState:
      "pending",

    initialized:
      false,

    ready:
      false,

    running:
      false,

    replaying:
      false,

    reducedMotion:
      false,

    scrollLocked:
      false,

    lockedScrollY:
      0,

    geometryTimer:
      null,

    completionTimer:
      null,

    lastAction:
      "",

    lastFailure:
      null
  };

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    status:
      "pending",

    initialized:
      false,

    ready:
      false,

    thresholdPresent:
      false,

    pagePresent:
      false,

    primaryCanvasPresent:
      false,

    settledCanvasPresent:
      false,

    geometryAvailable:
      false,

    geometryContract:
      "",

    paneCount:
      0,

    phaseCount:
      PHASES.length,

    activePhase:
      "",

    activePhaseIndex:
      0,

    thresholdState:
      "pending",

    pageAccess:
      "guided",

    reducedMotion:
      false,

    scrollLocked:
      false,

    replaying:
      false,

    lastAction:
      "",

    lastFailure:
      null,

    visualPassClaimed:
      false
  };

  if (
    Object.prototype.hasOwnProperty.call(
      globalThis,
      GLOBAL_NAME
    )
  ) {
    return;
  }

  const query = (
    selector,
    root = document
  ) => root.querySelector(selector);

  const queryAll = (
    selector,
    root = document
  ) => Array.from(
    root.querySelectorAll(selector)
  );

  const normalize = value => {
    if (
      value === null ||
      typeof value === "undefined"
    ) {
      return "";
    }

    return String(value)
      .replace(/\s+/g, " ")
      .trim();
  };

  const clamp = (
    value,
    minimum,
    maximum
  ) => Math.max(
    minimum,
    Math.min(maximum, value)
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

  const easeOutCubic = value => {
    const inverse =
      1 - value;

    return (
      1 -
      inverse *
      inverse *
      inverse
    );
  };

  const easeInOutCubic = value => (
    value < 0.5
      ? 4 *
        value *
        value *
        value
      : 1 -
        Math.pow(
          -2 * value + 2,
          3
        ) /
        2
  );

  const rgba = (
    color,
    alpha
  ) => (
    `rgba(` +
    `${color[0]}, ` +
    `${color[1]}, ` +
    `${color[2]}, ` +
    `${alpha}` +
    `)`
  );

  const emit = (
    type,
    detail = {}
  ) => {
    if (
      typeof globalThis.dispatchEvent !==
        "function" ||
      typeof globalThis.CustomEvent !==
        "function"
    ) {
      return;
    }

    globalThis.dispatchEvent(
      new CustomEvent(
        type,
        {
          detail:
            Object.freeze({
              contract:
                CONTRACT.id,

              ...detail
            })
        }
      )
    );
  };

  const updateReceipt = (
    extra = {}
  ) => {
    Object.assign(
      RECEIPT,
      {
        status:
          state.lastFailure
            ? "held"
            : state.ready
              ? "available"
              : "pending",

        initialized:
          state.initialized,

        ready:
          state.ready,

        thresholdPresent:
          Boolean(
            state.threshold
          ),

        pagePresent:
          Boolean(
            state.page
          ),

        primaryCanvasPresent:
          Boolean(
            state.primaryRenderer &&
            state.primaryRenderer.canvas
          ),

        settledCanvasPresent:
          Boolean(
            state.settledRenderer &&
            state.settledRenderer.canvas
          ),

        geometryAvailable:
          Boolean(
            state.geometry &&
            state.geometry.ready
          ),

        geometryContract:
          state.geometry &&
          state.geometry.contract
            ? state.geometry.contract.id
            : "",

        paneCount:
          state.geometry
            ? state.geometry.paneCount
            : 0,

        phaseCount:
          PHASES.length,

        activePhase:
          PHASES[state.phaseIndex]
            ? PHASES[state.phaseIndex].id
            : "",

        activePhaseIndex:
          state.phaseIndex + 1,

        thresholdState:
          state.thresholdState,

        pageAccess:
          state.page
            ? normalize(
                state.page.getAttribute(
                  "data-jeeves-access"
                )
              ) ||
              "guided"
            : "guided",

        reducedMotion:
          state.reducedMotion,

        scrollLocked:
          state.scrollLocked,

        replaying:
          state.replaying,

        lastAction:
          state.lastAction,

        lastFailure:
          state.lastFailure,

        visualPassClaimed:
          false
      },
      extra
    );

    const frozen =
      Object.freeze({
        ...RECEIPT
      });

    if (state.threshold) {
      state.threshold.dataset
        .jeevesThresholdReceipt =
        JSON.stringify(frozen);
    }

    globalThis
      .JEEVES_THRESHOLD_RECEIPT =
      frozen;
  };

  const fail = (
    code,
    error = null
  ) => {
    const reason =
      error &&
      error.message
        ? `${code}:${error.message}`
        : code;

    state.lastFailure =
      reason;

    state.lastAction =
      "threshold-failure";

    state.thresholdState =
      "held";

    if (state.threshold) {
      state.threshold.setAttribute(
        "data-threshold-state",
        "held"
      );
    }

    unlockPageScroll();

    openPageAccess();

    hideThresholdImmediately();

    updateReceipt();

    emit(
      EVENTS.ERROR,
      {
        code,
        reason,
        fallback:
          "page-opened"
      }
    );

    emit(
      EVENTS.COMPLETE,
      {
        source:
          "threshold-failure-fallback",

        failed:
          true,

        reason
      }
    );
  };

  const readReducedMotion = () => {
    const media =
      typeof globalThis.matchMedia ===
        "function"
        ? globalThis.matchMedia(
            "(prefers-reduced-motion: reduce)"
          )
        : null;

    state.reducedMotion =
      Boolean(
        media &&
        media.matches
      ) ||
      (
        state.threshold &&
        state.threshold.dataset
          .reducedMotion === "true"
      );

    if (
      media &&
      typeof media.addEventListener ===
        "function"
    ) {
      media.addEventListener(
        "change",
        event => {
          state.reducedMotion =
            Boolean(
              event.matches
            ) ||
            (
              state.threshold &&
              state.threshold.dataset
                .reducedMotion === "true"
            );

          if (
            state.primaryRenderer
          ) {
            state.primaryRenderer
              .setReducedMotion(
                state.reducedMotion
              );
          }

          if (
            state.settledRenderer
          ) {
            state.settledRenderer
              .setReducedMotion(
                state.reducedMotion
              );
          }

          updateReceipt();
        }
      );
    }
  };

  const hasCompletedSession = () => {
    try {
      return (
        globalThis.sessionStorage
          .getItem(
            STORAGE.key
          ) ===
        STORAGE.completed
      );
    } catch {
      return false;
    }
  };

  const rememberCompletion = () => {
    try {
      globalThis.sessionStorage
        .setItem(
          STORAGE.key,
          STORAGE.completed
        );
    } catch {
      /* Storage is optional. */
    }
  };

  const clearCompletionMemory = () => {
    try {
      globalThis.sessionStorage
        .removeItem(
          STORAGE.key
        );
    } catch {
      /* Storage is optional. */
    }
  };

  const lockPageScroll = () => {
    if (
      state.scrollLocked ||
      !document.body
    ) {
      return;
    }

    state.lockedScrollY =
      globalThis.scrollY ||
      document.documentElement
        .scrollTop ||
      0;

    document.documentElement
      .setAttribute(
        "data-jeeves-scroll-lock",
        "true"
      );

    document.body
      .setAttribute(
        "data-jeeves-scroll-lock",
        "true"
      );

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${state.lockedScrollY}px`;

    document.body.style.left =
      "0";

    document.body.style.right =
      "0";

    document.body.style.width =
      "100%";

    state.scrollLocked =
      true;

    updateReceipt();
  };

  function unlockPageScroll() {
    if (
      !state.scrollLocked ||
      !document.body
    ) {
      return;
    }

    document.documentElement
      .removeAttribute(
        "data-jeeves-scroll-lock"
      );

    document.body
      .removeAttribute(
        "data-jeeves-scroll-lock"
      );

    document.body.style.position =
      "";

    document.body.style.top =
      "";

    document.body.style.left =
      "";

    document.body.style.right =
      "";

    document.body.style.width =
      "";

    globalThis.scrollTo(
      0,
      state.lockedScrollY
    );

    state.scrollLocked =
      false;

    updateReceipt();
  }

  const openPageAccess = () => {
    if (state.page) {
      state.page.setAttribute(
        "data-jeeves-access",
        "open"
      );
    }

    document.documentElement
      .setAttribute(
        "data-jeeves-access",
        "open"
      );

    if (document.body) {
      document.body.setAttribute(
        "data-jeeves-access",
        "open"
      );
    }
  };

  const closePageAccess = () => {
    if (state.page) {
      state.page.setAttribute(
        "data-jeeves-access",
        "guided"
      );
    }

    document.documentElement
      .setAttribute(
        "data-jeeves-access",
        "guided"
      );

    if (document.body) {
      document.body.setAttribute(
        "data-jeeves-access",
        "guided"
      );
    }
  };

  const getGeometry = () => {
    const geometry =
      globalThis
        .DGB_MIRRORLAND_WINDOW_GEOMETRY;

    if (
      !geometry ||
      geometry.ready !== true ||
      typeof geometry.getPanes !==
        "function" ||
      typeof geometry.getFrameSegments !==
        "function" ||
      typeof geometry.tracePolygon !==
        "function" ||
      typeof geometry.traceOuterWindow !==
        "function" ||
      typeof geometry.traceInnerWindow !==
        "function" ||
      typeof geometry.appendOuterWindow !==
        "function" ||
      typeof geometry.appendInnerWindow !==
        "function"
    ) {
      return null;
    }

    return geometry;
  };

  const createCanvas = (
    mount,
    role
  ) => {
    if (!mount) {
      return null;
    }

    const existing =
      query(
        `canvas[data-jeeves-threshold-canvas="${role}"]`,
        mount
      );

    if (existing) {
      return existing;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.dataset
      .jeevesThresholdCanvas =
      role;

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

    canvas.style.inset =
      "0";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.display =
      "block";

    canvas.style.pointerEvents =
      "none";

    mount.appendChild(
      canvas
    );

    return canvas;
  };

  const createRenderer = ({
    mount,
    role,
    settled = false
  }) => {
    if (
      !mount ||
      !state.geometry
    ) {
      return null;
    }

    const geometry =
      state.geometry;

    const dimensions =
      geometry.dimensions;

    const colors =
      geometry.colors;

    const panes =
      geometry.getPanes();

    const frameSegments =
      geometry.getFrameSegments();

    const canvas =
      createCanvas(
        mount,
        role
      );

    if (!canvas) {
      return null;
    }

    const context =
      canvas.getContext(
        "2d",
        {
          alpha: true,
          desynchronized: true
        }
      );

    if (!context) {
      throw new Error(
        `JEEVES_THRESHOLD_CONTEXT_UNAVAILABLE:${role}`
      );
    }

    const renderer = {
      mount,
      role,
      settled,
      canvas,
      context,

      width:
        1,

      height:
        1,

      pixelRatio:
        1,

      reveal:
        settled
          ? 0.62
          : 0,

      targetReveal:
        settled
          ? 0.62
          : 0,

      transition: {
        active:
          false,

        from:
          settled
            ? 0.62
            : 0,

        to:
          settled
            ? 0.62
            : 0,

        start:
          0,

        duration:
          1
      },

      phaseEmphasis:
        settled
          ? "settled"
          : "crown",

      reducedMotion:
        state.reducedMotion,

      running:
        true,

      raf:
        0,

      resizeObserver:
        null,

      time:
        0,

      resize() {
        const rect =
          mount.getBoundingClientRect();

        const ratio =
          Math.min(
            globalThis.devicePixelRatio ||
              1,

            TIMING
              .maximumDevicePixelRatio
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
          canvas.width !== width ||
          canvas.height !== height
        ) {
          canvas.width =
            width;

          canvas.height =
            height;
        }

        canvas.style.width =
          `${Math.max(
            1,
            rect.width
          )}px`;

        canvas.style.height =
          `${Math.max(
            1,
            rect.height
          )}px`;

        this.width =
          width;

        this.height =
          height;

        this.pixelRatio =
          ratio;
      },

      setReducedMotion(value) {
        this.reducedMotion =
          Boolean(value);
      },

      setPhaseEmphasis(value) {
        this.phaseEmphasis =
          normalize(value) ||
          "center";
      },

      setReveal(
        target,
        duration =
          TIMING.phaseRevealMs
      ) {
        const normalizedTarget =
          clamp(
            Number(target),
            0,
            1
          );

        if (
          this.reducedMotion
        ) {
          this.reveal =
            normalizedTarget;

          this.targetReveal =
            normalizedTarget;

          this.transition.active =
            false;

          return;
        }

        this.targetReveal =
          normalizedTarget;

        this.transition = {
          active:
            true,

          from:
            this.reveal,

          to:
            normalizedTarget,

          start:
            performance.now(),

          duration:
            Math.max(
              1,
              Number(duration) ||
              TIMING.phaseRevealMs
            )
        };
      },

      updateTransition(now) {
        if (
          !this.transition.active
        ) {
          return;
        }

        const elapsed =
          now -
          this.transition.start;

        const progress =
          clamp(
            elapsed /
            this.transition.duration,
            0,
            1
          );

        const eased =
          easeInOutCubic(
            progress
          );

        this.reveal =
          lerp(
            this.transition.from,
            this.transition.to,
            eased
          );

        if (
          progress >= 1
        ) {
          this.reveal =
            this.transition.to;

          this.transition.active =
            false;
        }
      },

      getPaneEmphasis(pane) {
        const id =
          pane.id;

        if (
          this.phaseEmphasis ===
          "crown"
        ) {
          return (
            id.startsWith(
              "crown"
            ) ||
            id.startsWith(
              "upper"
            )
              ? 1
              : 0.70
          );
        }

        if (
          this.phaseEmphasis ===
          "center"
        ) {
          return (
            id.includes(
              "center"
            ) ||
            id.includes(
              "inner"
            ) ||
            id ===
              "mid-center"
              ? 1
              : 0.76
          );
        }

        if (
          this.phaseEmphasis ===
          "branches"
        ) {
          return (
            id.startsWith(
              "lower"
            ) ||
            id.startsWith(
              "base"
            )
              ? 1
              : 0.82
          );
        }

        return 1;
      },

      createPaneGradient(
        pane,
        shimmer
      ) {
        const bounds =
          geometry.getBounds(
            pane.points
          );

        const gradient =
          context.createLinearGradient(
            bounds.minimumX,
            bounds.minimumY,
            bounds.maximumX,
            bounds.maximumY
          );

        const panePresence =
          geometry.revealWeight(
            this.reveal,
            settled
              ? 0.34
              : 0.20,
            1
          );

        const emphasis =
          this.getPaneEmphasis(
            pane
          );

        const alpha =
          pane.alpha *
          panePresence *
          emphasis;

        gradient.addColorStop(
          0,
          rgba(
            pane.color,
            clamp(
              alpha *
              (
                0.62 +
                shimmer *
                0.07
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
                0.86 +
                shimmer *
                  0.10
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
              alpha *
              0.50,
              0,
              1
            )
          )
        );

        return gradient;
      },

      drawPane(pane) {
        const shimmer =
          this.reducedMotion
            ? 0
            : Math.sin(
                this.time *
                  0.72 +
                pane.phase
              );

        const emphasis =
          this.getPaneEmphasis(
            pane
          );

        const depthShift =
          pane.depth *
          this.reveal *
          (
            settled
              ? 0.8
              : 2.2
          );

        const paneGlowWeight =
          geometry.revealWeight(
            this.reveal,
            0.08,
            1
          );

        context.save();

        context.translate(
          shimmer *
            pane.depth *
            (
              settled
                ? 0.18
                : 0.55
            ),

          -depthShift *
            0.18
        );

        geometry.tracePolygon(
          context,
          pane.points
        );

        context.fillStyle =
          this.createPaneGradient(
            pane,
            shimmer
          );

        context.shadowBlur =
          geometry.revealWeight(
            this.reveal,
            1,
            (
              8 +
              pane.glow *
              25
            ) *
            emphasis
          );

        context.shadowColor =
          rgba(
            pane.color,
            pane.glow *
              paneGlowWeight *
              0.54 *
              emphasis
          );

        context.fill();

        context.shadowBlur =
          0;

        const highlight =
          context.createLinearGradient(
            0,
            0,
            dimensions.designWidth,
            dimensions.designHeight
          );

        const highlightWeight =
          geometry.revealWeight(
            this.reveal,
            0.06,
            1
          ) *
          emphasis;

        highlight.addColorStop(
          0,
          `rgba(255, 255, 255, ${
            pane.highlight *
            0.68 *
            highlightWeight
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
            0.15 *
            highlightWeight
          })`
        );

        context.fillStyle =
          highlight;

        context.fill();

        context.strokeStyle =
          `rgba(255, 255, 255, ${
            geometry.revealWeight(
              this.reveal,
              0.012,
              0.035 +
              pane.highlight *
                0.24
            ) *
            emphasis
          })`;

        context.lineWidth =
          geometry.revealWeight(
            this.reveal,
            0.6,
            settled
              ? 1
              : 1.4
          );

        context.stroke();

        context.restore();
      },

      drawInnerLight() {
        context.save();

        geometry.traceInnerWindow(
          context
        );

        context.clip();

        const pulse =
          this.reducedMotion
            ? 0.5
            : (
                Math.sin(
                  this.time *
                  (
                    settled
                      ? 0.72
                      : 1.32
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
            (
              0.05 +
              this.reveal *
              (
                0.17 +
                pulse *
                  0.07
              )
            ) *
            (
              settled
                ? 0.62
                : 1
            )
          })`
        );

        centerGlow.addColorStop(
          0.30,
          `rgba(95, 151, 221, ${
            (
              0.025 +
              this.reveal *
                0.11
            ) *
            (
              settled
                ? 0.68
                : 1
            )
          })`
        );

        centerGlow.addColorStop(
          0.62,
          `rgba(118, 74, 169, ${
            (
              0.015 +
              this.reveal *
                0.08
            ) *
            (
              settled
                ? 0.64
                : 1
            )
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
          dimensions.designWidth,
          dimensions.designHeight
        );

        if (
          !this.reducedMotion &&
          this.reveal > 0.20 &&
          !settled
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
              this.reveal *
              (
                0.022 +
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
            dimensions.designWidth,
            dimensions.designHeight
          );
        }

        context.restore();
      },

      drawLeadLines() {
        const darkOpacity =
          geometry.revealWeight(
            this.reveal,
            settled
              ? 0.40
              : 0.22,
            0.94
          );

        const lightOpacity =
          geometry.revealWeight(
            this.reveal,
            0.06,
            settled
              ? 0.25
              : 0.38
          );

        const outerWidth =
          geometry.revealWeight(
            this.reveal,
            dimensions
              .leadWidthDormant,
            settled
              ? 6.2
              : dimensions
                  .leadWidthFocused
          );

        const innerWidth =
          geometry.revealWeight(
            this.reveal,
            dimensions
              .innerLeadWidthDormant,
            settled
              ? 2.2
              : dimensions
                  .innerLeadWidthFocused
          );

        context.save();

        context.lineJoin =
          "round";

        context.lineCap =
          "round";

        context.strokeStyle =
          rgba(
            colors.leadDark,
            darkOpacity
          );

        context.lineWidth =
          outerWidth;

        panes.forEach(pane => {
          geometry.tracePolygon(
            context,
            pane.points
          );

          context.stroke();
        });

        context.strokeStyle =
          rgba(
            colors.leadLight,
            lightOpacity
          );

        context.lineWidth =
          innerWidth;

        panes.forEach(pane => {
          geometry.tracePolygon(
            context,
            pane.points
          );

          context.stroke();
        });

        context.restore();
      },

      drawFrameRibs() {
        const darkOpacity =
          geometry.revealWeight(
            this.reveal,
            0.22,
            settled
              ? 0.78
              : 0.98
          );

        const lightOpacity =
          geometry.revealWeight(
            this.reveal,
            0.05,
            settled
              ? 0.23
              : 0.36
          );

        const darkWidth =
          geometry.revealWeight(
            this.reveal,
            dimensions
              .ribWidthDormant,
            settled
              ? 10
              : dimensions
                  .ribWidthFocused
          );

        const lightWidth =
          geometry.revealWeight(
            this.reveal,
            dimensions
              .ribHighlightWidthDormant,
            settled
              ? 2
              : dimensions
                  .ribHighlightWidthFocused
          );

        context.save();

        context.lineJoin =
          "round";

        context.lineCap =
          "round";

        frameSegments.forEach(
          segment => {
            context.beginPath();

            context.moveTo(
              segment[0][0],
              segment[0][1]
            );

            for (
              let index = 1;
              index <
                segment.length;
              index += 1
            ) {
              context.lineTo(
                segment[index][0],
                segment[index][1]
              );
            }

            context.strokeStyle =
              `rgba(9, 12, 18, ${darkOpacity})`;

            context.lineWidth =
              darkWidth;

            context.stroke();

            context.strokeStyle =
              `rgba(79, 89, 110, ${lightOpacity})`;

            context.lineWidth =
              lightWidth;

            context.stroke();
          }
        );

        context.restore();
      },

      drawOuterFrame() {
        const frameOpacity =
          geometry.revealWeight(
            this.reveal,
            0.28,
            settled
              ? 0.82
              : 1
          );

        const edgeOpacity =
          geometry.revealWeight(
            this.reveal,
            0.12,
            settled
              ? 0.48
              : 0.70
          );

        const innerEdgeOpacity =
          geometry.revealWeight(
            this.reveal,
            0.06,
            settled
              ? 0.22
              : 0.34
          );

        context.save();

        const frameGradient =
          context.createLinearGradient(
            0,
            0,
            dimensions.designWidth,
            0
          );

        frameGradient.addColorStop(
          0,
          rgba(
            colors.frameNearBlack,
            frameOpacity
          )
        );

        frameGradient.addColorStop(
          0.22,
          rgba(
            colors.frameMid,
            frameOpacity
          )
        );

        frameGradient.addColorStop(
          0.50,
          rgba(
            colors.frameNearBlack,
            frameOpacity
          )
        );

        frameGradient.addColorStop(
          0.78,
          rgba(
            colors.frameMid,
            frameOpacity
          )
        );

        frameGradient.addColorStop(
          1,
          rgba(
            colors.frameNearBlack,
            frameOpacity
          )
        );

        context.beginPath();

        geometry.appendOuterWindow(
          context
        );

        geometry.appendInnerWindow(
          context
        );

        context.fillStyle =
          frameGradient;

        context.shadowBlur =
          geometry.revealWeight(
            this.reveal,
            4,
            settled
              ? 20
              : 52
          );

        context.shadowColor =
          `rgba(65, 132, 183, ${
            geometry.revealWeight(
              this.reveal,
              0.02,
              settled
                ? 0.13
                : 0.24
            )
          })`;

        context.fill(
          "evenodd"
        );

        context.shadowBlur =
          0;

        geometry.traceOuterWindow(
          context
        );

        context.strokeStyle =
          rgba(
            colors.frameEdge,
            edgeOpacity
          );

        context.lineWidth =
          geometry.revealWeight(
            this.reveal,
            3,
            settled
              ? 5
              : 7
          );

        context.stroke();

        geometry.traceInnerWindow(
          context
        );

        context.strokeStyle =
          rgba(
            colors.leadLight,
            innerEdgeOpacity
          );

        context.lineWidth =
          geometry.revealWeight(
            this.reveal,
            1,
            settled
              ? 2
              : 3
          );

        context.stroke();

        context.restore();
      },

      drawSparkles() {
        if (
          this.reducedMotion ||
          this.reveal < 0.44 ||
          settled
        ) {
          return;
        }

        context.save();

        geometry.traceInnerWindow(
          context
        );

        context.clip();

        const points = [
          [186, 180, 0],
          [292, 248, 1.4],
          [234, 340, 2.7],
          [148, 418, 4.1],
          [320, 516, 5.3],
          [248, 592, 6.4]
        ];

        points.forEach(point => {
          const pulse =
            Math.sin(
              this.time *
              (
                Math.PI *
                2 /
                TIMING
                  .sparklePeriodSeconds
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
            this.reveal *
            0.52;

          if (
            alpha <= 0.01
          ) {
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
        });

        context.restore();
      },

      draw() {
        context.clearRect(
          0,
          0,
          this.width,
          this.height
        );

        context.save();

        context.scale(
          this.pixelRatio,
          this.pixelRatio
        );

        const cssWidth =
          this.width /
          this.pixelRatio;

        const cssHeight =
          this.height /
          this.pixelRatio;

        const designScale =
          Math.min(
            cssWidth /
              dimensions.designWidth,

            cssHeight /
              dimensions.designHeight
          );

        const reveal =
          clamp(
            this.reveal,
            0,
            1
          );

        const scale =
          settled
            ? lerp(
                0.78,
                0.94,
                reveal
              )
            : lerp(
                dimensions
                  .dormantScale,
                dimensions
                  .focusedScale,
                reveal
              );

        const opacity =
          settled
            ? lerp(
                0.62,
                0.88,
                reveal
              )
            : lerp(
                dimensions
                  .dormantOpacity,
                dimensions
                  .focusedOpacity,
                reveal
              );

        const horizontalDrift =
          this.reducedMotion
            ? 0
            : Math.sin(
                this.time *
                0.24
              ) *
              (
                settled
                  ? 0.18
                  : 0.72
              ) *
              (
                1 -
                reveal *
                  0.62
              );

        const verticalDrift =
          this.reducedMotion
            ? 0
            : Math.sin(
                this.time *
                  0.31 +
                1.2
              ) *
              (
                settled
                  ? 0.22
                  : 0.88
              ) *
              (
                1 -
                reveal *
                  0.56
              );

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
          -dimensions.designWidth /
            2,

          -dimensions.designHeight /
            2
        );

        context.globalAlpha =
          opacity;

        context.save();

        geometry.traceInnerWindow(
          context
        );

        context.clip();

        this.drawInnerLight();

        panes.forEach(
          pane => {
            this.drawPane(
              pane
            );
          }
        );

        context.restore();

        this.drawLeadLines();
        this.drawFrameRibs();
        this.drawOuterFrame();
        this.drawSparkles();

        context.restore();
      },

      frame(now) {
        if (
          !this.running
        ) {
          return;
        }

        this.time =
          now *
          0.001;

        this.resize();

        this.updateTransition(
          now
        );

        this.draw();

        this.raf =
          requestAnimationFrame(
            nextNow =>
              this.frame(
                nextNow
              )
          );
      },

      start() {
        if (
          this.running &&
          this.raf
        ) {
          return;
        }

        this.running =
          true;

        this.raf =
          requestAnimationFrame(
            now =>
              this.frame(now)
          );
      },

      stop() {
        this.running =
          false;

        if (this.raf) {
          cancelAnimationFrame(
            this.raf
          );

          this.raf =
            0;
        }
      }
    };

    if (
      typeof ResizeObserver ===
        "function"
    ) {
      renderer.resizeObserver =
        new ResizeObserver(
          () =>
            renderer.resize()
        );

      renderer.resizeObserver
        .observe(
          mount
        );
    } else {
      globalThis.addEventListener(
        "resize",
        () =>
          renderer.resize(),
        {
          passive:
            true
        }
      );
    }

    renderer.resize();
    renderer.start();

    return renderer;
  };

  const setText = (
    node,
    value
  ) => {
    if (!node) {
      return;
    }

    node.textContent =
      normalize(value);
  };

  const setThresholdState = value => {
    state.thresholdState =
      value;

    if (state.threshold) {
      state.threshold.setAttribute(
        "data-threshold-state",
        value
      );
    }

    document.documentElement
      .setAttribute(
        "data-jeeves-threshold-state",
        value
      );

    if (document.body) {
      document.body.setAttribute(
        "data-jeeves-threshold-state",
        value
      );
    }

    updateReceipt();
  };

  const getCurrentPhase = () =>
    PHASES[
      clamp(
        state.phaseIndex,
        0,
        PHASES.length - 1
      )
    ];

  const updatePhasePresentation = ({
    announce = true
  } = {}) => {
    const phase =
      getCurrentPhase();

    if (!phase) {
      return;
    }

    state.phaseIndex =
      phase.index - 1;

    if (state.threshold) {
      state.threshold.setAttribute(
        "data-threshold-phase",
        phase.id
      );

      state.threshold.setAttribute(
        "data-threshold-phase-index",
        String(
          phase.index
        )
      );

      state.threshold.setAttribute(
        "data-threshold-phase-total",
        String(
          PHASES.length
        )
      );

      state.threshold.setAttribute(
        "data-threshold-emphasis",
        phase.emphasis
      );
    }

    state.panels.forEach(
      panel => {
        const isActive =
          normalize(
            panel.getAttribute(
              "data-jeeves-threshold-panel"
            )
          ) ===
          phase.id;

        panel.hidden =
          !isActive;

        panel.setAttribute(
          "aria-hidden",
          isActive
            ? "false"
            : "true"
        );
      }
    );

    setText(
      state.progressLabel,
      `${phase.label} · ${phase.index} of ${PHASES.length}`
    );

    if (state.progressValue) {
      state.progressValue.style
        .width =
        `${
          (
            phase.index /
            PHASES.length
          ) *
          100
        }%`;
    }

    setText(
      state.advance,
      phase.button
    );

    setText(
      state.actionNote,
      phase.note
    );

    setText(
      state.status,
      phase.status
    );

    if (
      state.primaryRenderer
    ) {
      state.primaryRenderer
        .setPhaseEmphasis(
          phase.emphasis
        );

      state.primaryRenderer
        .setReveal(
          phase.reveal,
          state.reducedMotion
            ? TIMING.reducedMs
            : TIMING.phaseRevealMs
        );
    }

    state.lastAction =
      `phase:${phase.id}`;

    updateReceipt();

    if (announce) {
      emit(
        EVENTS.PHASE_CHANGE,
        {
          phase:
            phase.id,

          phaseIndex:
            phase.index,

          phaseCount:
            PHASES.length,

          reveal:
            phase.reveal,

          emphasis:
            phase.emphasis
        }
      );
    }
  };

  const showThreshold = ({
    replay = false
  } = {}) => {
    if (!state.threshold) {
      return;
    }

    if (state.completionTimer) {
      clearTimeout(
        state.completionTimer
      );

      state.completionTimer =
        null;
    }

    state.replaying =
      Boolean(replay);

    state.phaseIndex =
      0;

    closePageAccess();

    lockPageScroll();

    state.threshold.hidden =
      false;

    state.threshold.removeAttribute(
      "inert"
    );

    state.threshold.setAttribute(
      "aria-hidden",
      "false"
    );

    setThresholdState(
      replay
        ? "replaying"
        : "active"
    );

    if (
      state.primaryRenderer
    ) {
      state.primaryRenderer
        .setReveal(
          0,
          state.reducedMotion
            ? TIMING.reducedMs
            : TIMING.replayOpenMs
        );
    }

    updatePhasePresentation({
      announce:
        true
    });

    globalThis.setTimeout(
      () => {
        if (state.advance) {
          state.advance.focus({
            preventScroll:
              true
          });
        }
      },
      state.reducedMotion
        ? 0
        : 120
    );

    state.lastAction =
      replay
        ? "threshold-replay-opened"
        : "threshold-opened";

    updateReceipt();
  };

  const hideThresholdImmediately = () => {
    if (!state.threshold) {
      return;
    }

    state.threshold.hidden =
      true;

    state.threshold.setAttribute(
      "aria-hidden",
      "true"
    );

    state.threshold.setAttribute(
      "inert",
      ""
    );
  };

  const settleThresholdWindow = () => {
    if (!state.settledRenderer) {
      return;
    }

    state.settledRenderer
      .setPhaseEmphasis(
        "settled"
      );

    state.settledRenderer
      .setReveal(
        0.68,
        state.reducedMotion
          ? TIMING.reducedMs
          : TIMING.settleMs
      );
  };

  const completeIntroduction = ({
    source =
      "guided-complete",
    skipped =
      false,
    remember =
      true
  } = {}) => {
    if (
      state.thresholdState ===
        "completing" ||
      state.thresholdState ===
        "complete" ||
      state.thresholdState ===
        "skipped"
    ) {
      return;
    }

    setThresholdState(
      "completing"
    );

    if (remember) {
      rememberCompletion();
    }

    if (
      state.primaryRenderer
    ) {
      state.primaryRenderer
        .setReveal(
          1,
          state.reducedMotion
            ? TIMING.reducedMs
            : TIMING.closeMs
        );
    }

    const finish = () => {
      hideThresholdImmediately();

      unlockPageScroll();

      openPageAccess();

      settleThresholdWindow();

      state.replaying =
        false;

      setThresholdState(
        skipped
          ? "skipped"
          : "complete"
      );

      state.lastAction =
        skipped
          ? "threshold-skipped"
          : "threshold-completed";

      updateReceipt();

      emit(
        skipped
          ? EVENTS.SKIP
          : EVENTS.COMPLETE,
        {
          source,
          skipped,
          phase:
            getCurrentPhase()
              ? getCurrentPhase().id
              : "",

          phaseIndex:
            state.phaseIndex + 1,

          phaseCount:
            PHASES.length
        }
      );
    };

    if (
      state.reducedMotion
    ) {
      finish();
      return;
    }

    state.completionTimer =
      globalThis.setTimeout(
        finish,
        TIMING.closeMs
      );
  };

  const advancePhase = () => {
    if (
      state.thresholdState !==
        "active" &&
      state.thresholdState !==
        "replaying"
    ) {
      return;
    }

    if (
      state.phaseIndex >=
      PHASES.length - 1
    ) {
      completeIntroduction({
        source:
          state.replaying
            ? "replay-complete"
            : "guided-complete",

        skipped:
          false,

        remember:
          true
      });

      return;
    }

    state.phaseIndex +=
      1;

    updatePhasePresentation({
      announce:
        true
    });
  };

  const skipIntroduction = () => {
    completeIntroduction({
      source:
        state.replaying
          ? "replay-skipped"
          : "visitor-skip",

      skipped:
        true,

      remember:
        true
    });
  };

  const replayIntroduction = () => {
    if (
      !state.ready ||
      !state.threshold
    ) {
      return false;
    }

    clearCompletionMemory();

    emit(
      EVENTS.REPLAY,
      {
        source:
          "threshold-renderer",

        priorState:
          state.thresholdState
      }
    );

    showThreshold({
      replay:
        true
    });

    return true;
  };

  const installControlListeners = () => {
    if (state.advance) {
      state.advance.addEventListener(
        "click",
        advancePhase
      );
    }

    if (state.skip) {
      state.skip.addEventListener(
        "click",
        skipIntroduction
      );
    }

    state.replayControls.forEach(
      control => {
        control.addEventListener(
          "click",
          replayIntroduction
        );
      }
    );

    globalThis.addEventListener(
      EVENTS.REPLAY_REQUEST,
      replayIntroduction
    );

    if (state.threshold) {
      state.threshold.addEventListener(
        "keydown",
        event => {
          if (
            event.key ===
            "Escape"
          ) {
            event.preventDefault();

            skipIntroduction();

            return;
          }

          if (
            event.key !==
              "ArrowRight"
          ) {
            return;
          }

          const target =
            event.target;

          if (
            target &&
            typeof target.closest ===
              "function" &&
            target.closest(
              "button, a, summary, input, textarea, select"
            )
          ) {
            return;
          }

          event.preventDefault();

          advancePhase();
        }
      );
    }
  };

  const resolveDom = () => {
    state.threshold =
      query(
        SELECTORS.threshold
      );

    state.page =
      query(
        SELECTORS.page
      );

    state.windowMount =
      query(
        SELECTORS.windowMount,
        state.threshold ||
        document
      );

    state.settledWindowMount =
      query(
        SELECTORS.settledWindowMount,
        state.page ||
        document
      );

    state.advance =
      query(
        SELECTORS.advance,
        state.threshold ||
        document
      );

    state.skip =
      query(
        SELECTORS.skip,
        state.threshold ||
        document
      );

    state.status =
      query(
        SELECTORS.status,
        state.threshold ||
        document
      );

    state.progressLabel =
      query(
        SELECTORS.progressLabel,
        state.threshold ||
        document
      );

    state.progressValue =
      query(
        SELECTORS.progressValue,
        state.threshold ||
        document
      );

    state.actionNote =
      query(
        SELECTORS.actionNote,
        state.threshold ||
        document
      );

    state.panels =
      queryAll(
        SELECTORS.panels,
        state.threshold ||
        document
      );

    state.replayControls =
      queryAll(
        SELECTORS.replay,
        state.page ||
        document
      );

    if (!state.threshold) {
      throw new Error(
        "JEEVES_THRESHOLD_ROOT_NOT_FOUND"
      );
    }

    if (!state.page) {
      throw new Error(
        "JEEVES_PAGE_ROOT_NOT_FOUND"
      );
    }

    if (!state.windowMount) {
      throw new Error(
        "JEEVES_THRESHOLD_WINDOW_MOUNT_NOT_FOUND"
      );
    }

    if (!state.settledWindowMount) {
      throw new Error(
        "JEEVES_SETTLED_WINDOW_MOUNT_NOT_FOUND"
      );
    }

    if (!state.advance) {
      throw new Error(
        "JEEVES_THRESHOLD_ADVANCE_CONTROL_NOT_FOUND"
      );
    }

    if (!state.skip) {
      throw new Error(
        "JEEVES_THRESHOLD_SKIP_CONTROL_NOT_FOUND"
      );
    }

    if (
      state.panels.length !==
      PHASES.length
    ) {
      throw new Error(
        `JEEVES_THRESHOLD_PANEL_COUNT_INVALID:${state.panels.length}`
      );
    }
  };

  const initializeRenderers = () => {
    state.primaryRenderer =
      createRenderer({
        mount:
          state.windowMount,

        role:
          "primary",

        settled:
          false
      });

    state.settledRenderer =
      createRenderer({
        mount:
          state.settledWindowMount,

        role:
          "settled",

        settled:
          true
      });

    if (
      !state.primaryRenderer ||
      !state.settledRenderer
    ) {
      throw new Error(
        "JEEVES_THRESHOLD_RENDERER_CREATION_FAILED"
      );
    }
  };

  const exposeApi = () => {
    const API = {
      contract:
        CONTRACT,

      events:
        EVENTS,

      phases:
        PHASES,

      get ready() {
        return state.ready;
      },

      get receipt() {
        return Object.freeze({
          ...RECEIPT
        });
      },

      getState() {
        return Object.freeze({
          thresholdState:
            state.thresholdState,

          phase:
            getCurrentPhase()
              ? getCurrentPhase().id
              : "",

          phaseIndex:
            state.phaseIndex + 1,

          phaseCount:
            PHASES.length,

          replaying:
            state.replaying,

          reducedMotion:
            state.reducedMotion,

          scrollLocked:
            state.scrollLocked,

          completedThisSession:
            hasCompletedSession()
        });
      },

      advance() {
        advancePhase();
        return true;
      },

      skip() {
        skipIntroduction();
        return true;
      },

      replay() {
        return replayIntroduction();
      },

      complete() {
        completeIntroduction({
          source:
            "public-api",

          skipped:
            false,

          remember:
            true
        });

        return true;
      },

      setPhase(phaseId) {
        const index =
          PHASES.findIndex(
            phase =>
              phase.id ===
              normalize(phaseId)
          );

        if (index < 0) {
          return false;
        }

        state.phaseIndex =
          index;

        updatePhasePresentation({
          announce:
            true
        });

        return true;
      }
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
  };

  const completePreviouslySeenSession = () => {
    state.phaseIndex =
      PHASES.length - 1;

    updatePhasePresentation({
      announce:
        false
    });

    hideThresholdImmediately();

    openPageAccess();

    unlockPageScroll();

    settleThresholdWindow();

    setThresholdState(
      "complete"
    );

    state.lastAction =
      "threshold-session-restored";

    updateReceipt();

    globalThis.setTimeout(
      () => {
        emit(
          EVENTS.COMPLETE,
          {
            source:
              "session-restored",

            skipped:
              false,

            silentOpening:
              false,

            phase:
              "access",

            phaseIndex:
              PHASES.length,

            phaseCount:
              PHASES.length
          }
        );
      },
      0
    );
  };

  const beginFirstArrival = () => {
    state.phaseIndex =
      0;

    showThreshold({
      replay:
        false
    });
  };

  const finishInitialization = () => {
    state.initialized =
      true;

    state.ready =
      true;

    state.running =
      true;

    state.lastAction =
      "threshold-renderer-initialized";

    setThresholdState(
      "ready"
    );

    updateReceipt();

    emit(
      EVENTS.READY,
      {
        geometryContract:
          state.geometry.contract.id,

        paneCount:
          state.geometry.paneCount,

        phaseCount:
          PHASES.length,

        completedThisSession:
          hasCompletedSession()
      }
    );

    if (
      hasCompletedSession()
    ) {
      completePreviouslySeenSession();
    } else {
      beginFirstArrival();
    }
  };

  const initializeWithGeometry = () => {
    if (state.initialized) {
      return;
    }

    try {
      state.geometry =
        getGeometry();

      if (!state.geometry) {
        return;
      }

      if (state.geometryTimer) {
        clearTimeout(
          state.geometryTimer
        );

        state.geometryTimer =
          null;
      }

      resolveDom();

      readReducedMotion();

      initializeRenderers();

      installControlListeners();

      exposeApi();

      finishInitialization();
    } catch (error) {
      fail(
        "JEEVES_THRESHOLD_INIT_FAILURE",
        error
      );
    }
  };

  const scheduleGeometryFailure = () => {
    if (state.geometryTimer) {
      clearTimeout(
        state.geometryTimer
      );
    }

    state.geometryTimer =
      globalThis.setTimeout(
        () => {
          if (
            state.initialized ||
            getGeometry()
          ) {
            initializeWithGeometry();
            return;
          }

          fail(
            "JEEVES_THRESHOLD_GEOMETRY_UNAVAILABLE"
          );
        },
        TIMING.geometryWaitMs
      );
  };

  const boot = () => {
    if (state.initialized) {
      return;
    }

    if (getGeometry()) {
      initializeWithGeometry();
      return;
    }

    scheduleGeometryFailure();
  };

  globalThis.addEventListener(
    EVENTS.GEOMETRY_READY,
    initializeWithGeometry
  );

  globalThis.addEventListener(
    EVENTS.GEOMETRY_ERROR,
    () => {
      if (state.initialized) {
        return;
      }

      fail(
        "JEEVES_THRESHOLD_GEOMETRY_REPORTED_ERROR"
      );
    }
  );

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {
        once:
          true
      }
    );
  } else {
    globalThis.setTimeout(
      boot,
      0
    );
  }
})();
