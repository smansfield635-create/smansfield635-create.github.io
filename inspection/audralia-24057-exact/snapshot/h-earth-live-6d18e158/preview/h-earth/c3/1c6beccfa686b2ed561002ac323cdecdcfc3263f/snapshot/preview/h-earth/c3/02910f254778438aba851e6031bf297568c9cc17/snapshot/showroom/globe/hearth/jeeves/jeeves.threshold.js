/* TARGET FILE: /showroom/globe/hearth/jeeves/jeeves.threshold.js */
/* TNT FULL-FILE REPLACEMENT */
/* DIAMOND_GATE_BRIDGE_JEEVES_TWO_STAGE_ESTATE_THRESHOLD_RENDERER_TNT_v2 */
/*
  Purpose:
  - Render the Mirrorland stained-glass Window at the estate entrance.
  - Consume /assets/shared/mirrorland-window.geometry.js.
  - Reduce the estate tutorial from four prompts to two deliberate stages.
  - Begin with a compact threshold Window.
  - Grow the Window to full presentation size after the first continuation.
  - Open the page after the second continuation.
  - Eliminate canvas jitter, repeated resizing, perpetual shimmer,
    positional drift, recurring sparkles, and unnecessary animation loops.
  - Freeze page access during the guided arrival and restore it afterward.
  - Preserve skip, replay, keyboard, reduced-motion, session-memory,
    and graceful-failure behavior.
  - Render a smaller static settled stained-glass seal after entry.
  - Dispatch lifecycle events consumed by the Jeeves conversation runtime.

  Two-stage path:
  1. arrival
     - compact Window
     - partial reveal
     - first existing arrival panel
     - Continue
  2. welcome
     - full-size Window
     - complete reveal
     - existing host panel
     - Enter the estate

  Compatibility:
  - The current HTML may still contain four threshold panels.
  - This runtime uses only the existing arrival and host panels.
  - Existing conversation and access panels remain suppressed.
  - A later HTML renewal may rename the host panel to welcome without
    changing the public threshold lifecycle.

  Owns:
  - Jeeves threshold DOM coordination
  - threshold canvas creation
  - static stained-glass drawing
  - compact-to-full Window growth state
  - two-stage onboarding state
  - reveal-transition animation
  - page scroll locking during onboarding
  - skip and replay controls
  - session-level completion memory
  - settled entrance-seal drawing
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

  const RECEIPT_GLOBAL_NAME =
    "JEEVES_THRESHOLD_RECEIPT";

  const CONTRACT = Object.freeze({
    id:
      "DIAMOND_GATE_BRIDGE_JEEVES_TWO_STAGE_ESTATE_THRESHOLD_RENDERER_TNT_v2",

    previousContract:
      "DIAMOND_GATE_BRIDGE_JEEVES_ESTATE_THRESHOLD_RENDERER_TNT_v1",

    file:
      "/showroom/globe/hearth/jeeves/jeeves.threshold.js",

    version:
      "2.0.0",

    geometryAuthority:
      "/assets/shared/mirrorland-window.geometry.js",

    geometryGlobal:
      "DGB_MIRRORLAND_WINDOW_GEOMETRY",

    phaseCount:
      2,

    arrivalMetaphor:
      "ESTATE_FRONT_DOOR",

    rendererClass:
      "STATIC_REVEAL_TRANSITION_2D_CANVAS",

    rendererLoop:
      "TRANSITION_ONLY",

    perFrameResize:
      false,

    positionalDrift:
      false,

    perpetualShimmer:
      false,

    perpetualPulse:
      false,

    recurringSparkles:
      false,

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

      panelId:
        "arrival",

      index:
        1,

      label:
        "Arrival",

      button:
        "Continue",

      note:
        "Continue to meet the host at the estate entrance.",

      status:
        "The Mirrorland threshold is coming into view.",

      reveal:
        0.34,

      emphasis:
        "crown",

      windowSize:
        "compact"
    }),

    Object.freeze({
      id:
        "welcome",

      panelId:
        "host",

      index:
        2,

      label:
        "Welcome",

      button:
        "Enter the estate",

      note:
        "Open the page and begin the hosted conversation with Jeeves.",

      status:
        "Jeeves is ready to receive you at the front door.",

      reveal:
        1,

      emphasis:
        "all",

      windowSize:
        "full"
    })
  ]);

  const TIMING = Object.freeze({
    revealMs:
      720,

    growthMs:
      760,

    closeMs:
      360,

    settledRevealMs:
      420,

    replayResetMs:
      280,

    reducedMs:
      1,

    geometryWaitMs:
      4500,

    maximumDevicePixelRatio:
      2,

    resizeToleranceCssPixels:
      2
  });

  const STORAGE = Object.freeze({
    key:
      "DGB_JEEVES_ESTATE_THRESHOLD_COMPLETED_v2",

    legacyKey:
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

    focusTimer:
      null,

    lastAction:
      "",

    lastFailure:
      null
  };

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    previousContract:
      CONTRACT.previousContract,

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

    windowSize:
      "compact",

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

    primaryRendererRunning:
      false,

    settledRendererRunning:
      false,

    perFrameResize:
      false,

    positionalDrift:
      false,

    perpetualShimmer:
      false,

    recurringSparkles:
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
      typeof value ===
        "undefined"
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

  const publishReceipt = () => {
    const frozenReceipt =
      Object.freeze({
        ...RECEIPT
      });

    if (state.threshold) {
      state.threshold.dataset
        .jeevesThresholdReceipt =
        JSON.stringify(
          frozenReceipt
        );
    }

    if (
      !Object.prototype
        .hasOwnProperty.call(
          globalThis,
          RECEIPT_GLOBAL_NAME
        )
    ) {
      Object.defineProperty(
        globalThis,
        RECEIPT_GLOBAL_NAME,
        {
          value:
            frozenReceipt,

          enumerable:
            true,

          configurable:
            true,

          writable:
            true
        }
      );

      return;
    }

    try {
      globalThis[
        RECEIPT_GLOBAL_NAME
      ] =
        frozenReceipt;
    } catch {
      /* Receipt publication is noncritical. */
    }
  };

  const updateReceipt = (
    extra = {}
  ) => {
    const currentPhase =
      PHASES[
        clamp(
          state.phaseIndex,
          0,
          PHASES.length - 1
        )
      ] ||
      null;

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
            ? state.geometry
                .contract.id
            : "",

        paneCount:
          state.geometry
            ? state.geometry
                .paneCount
            : 0,

        phaseCount:
          PHASES.length,

        activePhase:
          currentPhase
            ? currentPhase.id
            : "",

        activePhaseIndex:
          currentPhase
            ? currentPhase.index
            : 0,

        windowSize:
          currentPhase
            ? currentPhase
                .windowSize
            : "compact",

        thresholdState:
          state.thresholdState,

        pageAccess:
          state.page
            ? normalize(
                state.page
                  .getAttribute(
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

        primaryRendererRunning:
          Boolean(
            state.primaryRenderer &&
            state.primaryRenderer.running
          ),

        settledRendererRunning:
          Boolean(
            state.settledRenderer &&
            state.settledRenderer.running
          ),

        lastAction:
          state.lastAction,

        lastFailure:
          state.lastFailure,

        visualPassClaimed:
          false
      },
      extra
    );

    publishReceipt();
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
          .reducedMotion ===
          "true"
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
                .reducedMotion ===
                "true"
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
          STORAGE.completed ||
        globalThis.sessionStorage
          .getItem(
            STORAGE.legacyKey
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

      globalThis.sessionStorage
        .removeItem(
          STORAGE.legacyKey
        );
    } catch {
      /* Session storage is optional. */
    }
  };

  const clearCompletionMemory = () => {
    try {
      globalThis.sessionStorage
        .removeItem(
          STORAGE.key
        );

      globalThis.sessionStorage
        .removeItem(
          STORAGE.legacyKey
        );
    } catch {
      /* Session storage is optional. */
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

    document.body.setAttribute(
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

  const unlockPageScroll = () => {
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

    document.body.removeAttribute(
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
  };

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
      typeof geometry
        .getFrameSegments !==
        "function" ||
      typeof geometry
        .tracePolygon !==
        "function" ||
      typeof geometry
        .traceOuterWindow !==
        "function" ||
      typeof geometry
        .traceInnerWindow !==
        "function" ||
      typeof geometry
        .appendOuterWindow !==
        "function" ||
      typeof geometry
        .appendInnerWindow !==
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
          alpha:
            true
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

      cssWidth:
        0,

      cssHeight:
        0,

      pixelRatio:
        1,

      reveal:
        settled
          ? 0.68
          : 0,

      targetReveal:
        settled
          ? 0.68
          : 0,

      transition: {
        active:
          false,

        from:
          settled
            ? 0.68
            : 0,

        to:
          settled
            ? 0.68
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
        false,

      raf:
        0,

      resizeObserver:
        null,

      fallbackResizeHandler:
        null,

      resize(
        force = false
      ) {
        const rect =
          mount
            .getBoundingClientRect();

        const nextCssWidth =
          Math.max(
            1,
            rect.width
          );

        const nextCssHeight =
          Math.max(
            1,
            rect.height
          );

        const widthDifference =
          Math.abs(
            nextCssWidth -
            this.cssWidth
          );

        const heightDifference =
          Math.abs(
            nextCssHeight -
            this.cssHeight
          );

        if (
          !force &&
          this.cssWidth > 0 &&
          this.cssHeight > 0 &&
          widthDifference <
            TIMING
              .resizeToleranceCssPixels &&
          heightDifference <
            TIMING
              .resizeToleranceCssPixels
        ) {
          return false;
        }

        const ratio =
          Math.min(
            globalThis.devicePixelRatio ||
              1,

            TIMING
              .maximumDevicePixelRatio
          );

        const nextWidth =
          Math.max(
            1,
            Math.round(
              nextCssWidth *
              ratio
            )
          );

        const nextHeight =
          Math.max(
            1,
            Math.round(
              nextCssHeight *
              ratio
            )
          );

        this.cssWidth =
          nextCssWidth;

        this.cssHeight =
          nextCssHeight;

        this.pixelRatio =
          ratio;

        this.width =
          nextWidth;

        this.height =
          nextHeight;

        if (
          canvas.width !==
            nextWidth ||
          canvas.height !==
            nextHeight
        ) {
          canvas.width =
            nextWidth;

          canvas.height =
            nextHeight;
        }

        canvas.style.width =
          `${nextCssWidth}px`;

        canvas.style.height =
          `${nextCssHeight}px`;

        this.draw();

        return true;
      },

      setReducedMotion(value) {
        this.reducedMotion =
          Boolean(value);

        if (
          this.reducedMotion &&
          this.transition.active
        ) {
          this.reveal =
            this.transition.to;

          this.targetReveal =
            this.transition.to;

          this.transition.active =
            false;

          this.stop();
          this.draw();
        }
      },

      setPhaseEmphasis(value) {
        this.phaseEmphasis =
          normalize(value) ||
          "all";

        this.draw();
      },

      setReveal(
        target,
        duration =
          TIMING.revealMs
      ) {
        const normalizedTarget =
          clamp(
            Number(target),
            0,
            1
          );

        this.targetReveal =
          normalizedTarget;

        if (
          this.reducedMotion ||
          duration <= 1
        ) {
          this.reveal =
            normalizedTarget;

          this.transition.active =
            false;

          this.stop();
          this.draw();

          return;
        }

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
              TIMING.revealMs
            )
        };

        this.start();
      },

      updateTransition(now) {
        if (
          !this.transition.active
        ) {
          return false;
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

        return true;
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
              : 0.72
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
              : 0.80
          );
        }

        return 1;
      },

      createPaneGradient(pane) {
        const bounds =
          geometry.getBounds(
            pane.points
          );

        const gradient =
          context
            .createLinearGradient(
              bounds.minimumX,
              bounds.minimumY,
              bounds.maximumX,
              bounds.maximumY
            );

        const panePresence =
          geometry.revealWeight(
            this.reveal,
            settled
              ? 0.48
              : 0.22,
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
              0.66,
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
              0.90,
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
              0.52,
              0,
              1
            )
          )
        );

        return gradient;
      },

      drawPane(pane) {
        const emphasis =
          this.getPaneEmphasis(
            pane
          );

        const paneGlowWeight =
          geometry.revealWeight(
            this.reveal,
            0.08,
            1
          );

        context.save();

        geometry.tracePolygon(
          context,
          pane.points
        );

        context.fillStyle =
          this.createPaneGradient(
            pane
          );

        context.shadowBlur =
          geometry.revealWeight(
            this.reveal,
            1,
            (
              8 +
              pane.glow *
              22
            ) *
            emphasis
          );

        context.shadowColor =
          rgba(
            pane.color,
            pane.glow *
              paneGlowWeight *
              0.50 *
              emphasis
          );

        context.fill();

        context.shadowBlur =
          0;

        const highlight =
          context
            .createLinearGradient(
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
            0.64 *
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
            0.14 *
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
                0.22
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

        const fixedPulse =
          0.5;

        const centerGlow =
          context
            .createRadialGradient(
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
                fixedPulse *
                0.05
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
          context
            .createLinearGradient(
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
              ? 18
              : 44
          );

        context.shadowColor =
          `rgba(65, 132, 183, ${
            geometry.revealWeight(
              this.reveal,
              0.02,
              settled
                ? 0.13
                : 0.22
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

        context.translate(
          cssWidth /
            2,
          cssHeight /
            2
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

        context.restore();
      },

      frame(now) {
        if (
          !this.running
        ) {
          return;
        }

        this.updateTransition(
          now
        );

        this.draw();

        if (
          this.transition.active
        ) {
          this.raf =
            globalThis
              .requestAnimationFrame(
                nextNow =>
                  this.frame(
                    nextNow
                  )
              );

          return;
        }

        this.stop();
        this.draw();
      },

      start() {
        if (this.running) {
          return;
        }

        this.running =
          true;

        this.raf =
          globalThis
            .requestAnimationFrame(
              now =>
                this.frame(now)
            );

        updateReceipt();
      },

      stop() {
        this.running =
          false;

        if (this.raf) {
          globalThis
            .cancelAnimationFrame(
              this.raf
            );

          this.raf =
            0;
        }

        updateReceipt();
      },

      destroy() {
        this.stop();

        if (
          this.resizeObserver
        ) {
          this.resizeObserver
            .disconnect();

          this.resizeObserver =
            null;
        }

        if (
          this.fallbackResizeHandler
        ) {
          globalThis
            .removeEventListener(
              "resize",
              this
                .fallbackResizeHandler
            );

          this.fallbackResizeHandler =
            null;
        }
      }
    };

    if (
      typeof ResizeObserver ===
        "function"
    ) {
      renderer.resizeObserver =
        new ResizeObserver(
          entries => {
            const entry =
              entries[0];

            if (!entry) {
              return;
            }

            renderer.resize(
              false
            );
          }
        );

      renderer.resizeObserver
        .observe(
          mount
        );
    } else {
      renderer
        .fallbackResizeHandler =
        () => {
          renderer.resize(
            false
          );
        };

      globalThis.addEventListener(
        "resize",
        renderer
          .fallbackResizeHandler,
        {
          passive:
            true
        }
      );
    }

    renderer.resize(
      true
    );

    renderer.draw();

    return renderer;
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

  const resolvePanelId = panel =>
    normalize(
      panel.getAttribute(
        "data-jeeves-threshold-panel"
      )
    );

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
        "data-threshold-source-panel",
        phase.panelId
      );

      state.threshold.setAttribute(
        "data-threshold-window-size",
        phase.windowSize
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
          resolvePanelId(panel) ===
          phase.panelId;

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
      state.progressValue.style.width =
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
            : (
                phase.windowSize ===
                  "full"
                  ? TIMING.growthMs
                  : TIMING.revealMs
              )
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

          sourcePanel:
            phase.panelId,

          phaseIndex:
            phase.index,

          phaseCount:
            PHASES.length,

          reveal:
            phase.reveal,

          emphasis:
            phase.emphasis,

          windowSize:
            phase.windowSize
        }
      );
    }
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

  const showThreshold = ({
    replay = false
  } = {}) => {
    if (!state.threshold) {
      return;
    }

    if (state.completionTimer) {
      globalThis.clearTimeout(
        state.completionTimer
      );

      state.completionTimer =
        null;
    }

    if (state.focusTimer) {
      globalThis.clearTimeout(
        state.focusTimer
      );

      state.focusTimer =
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
        .resize(
          true
        );

      state.primaryRenderer
        .setPhaseEmphasis(
          "crown"
        );

      state.primaryRenderer
        .setReveal(
          0,
          state.reducedMotion
            ? TIMING.reducedMs
            : TIMING.replayResetMs
        );
    }

    updatePhasePresentation({
      announce:
        true
    });

    state.focusTimer =
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

  const settleThresholdWindow = () => {
    if (!state.settledRenderer) {
      return;
    }

    state.settledRenderer
      .resize(
        true
      );

    state.settledRenderer
      .setPhaseEmphasis(
        "settled"
      );

    state.settledRenderer
      .setReveal(
        0.68,
        state.reducedMotion
          ? TIMING.reducedMs
          : TIMING
              .settledRevealMs
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

    const finish = () => {
      if (
        state.primaryRenderer
      ) {
        state.primaryRenderer
          .stop();
      }

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
            PHASES.length,

          windowSize:
            getCurrentPhase()
              ? getCurrentPhase()
                  .windowSize
              : "full"
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
      state.phaseIndex === 0
    ) {
      state.phaseIndex =
        1;

      updatePhasePresentation({
        announce:
          true
      });

      return;
    }

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
              [
                "button",
                "a",
                "summary",
                "input",
                "textarea",
                "select"
              ].join(", ")
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
        SELECTORS
          .settledWindowMount,
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

    if (
      !state.settledWindowMount
    ) {
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

    const availablePanelIds =
      new Set(
        state.panels.map(
          resolvePanelId
        )
      );

    PHASES.forEach(phase => {
      if (
        !availablePanelIds.has(
          phase.panelId
        )
      ) {
        throw new Error(
          `JEEVES_THRESHOLD_REQUIRED_PANEL_MISSING:${phase.panelId}`
        );
      }
    });
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
          state
            .settledWindowMount,

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

    state.settledRenderer.stop();
    state.settledRenderer.draw();
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
        const phase =
          getCurrentPhase();

        return Object.freeze({
          thresholdState:
            state.thresholdState,

          phase:
            phase
              ? phase.id
              : "",

          sourcePanel:
            phase
              ? phase.panelId
              : "",

          phaseIndex:
            phase
              ? phase.index
              : 0,

          phaseCount:
            PHASES.length,

          windowSize:
            phase
              ? phase.windowSize
              : "compact",

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
        const normalizedId =
          normalize(
            phaseId
          );

        const index =
          PHASES.findIndex(
            phase =>
              phase.id ===
                normalizedId ||
              phase.panelId ===
                normalizedId
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

    Object.freeze(API);

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

    if (
      state.primaryRenderer
    ) {
      state.primaryRenderer
        .stop();
    }

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
              "welcome",

            phaseIndex:
              PHASES.length,

            phaseCount:
              PHASES.length,

            windowSize:
              "full"
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
          state.geometry
            .contract.id,

        paneCount:
          state.geometry
            .paneCount,

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

    if (state.primaryRenderer) {
      state.primaryRenderer.stop();
    }

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
        globalThis.clearTimeout(
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
      globalThis.clearTimeout(
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
