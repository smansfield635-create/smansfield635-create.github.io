/* /assets/compass/compass.mirrorland-window.js
   DGB Compass — Architectural Mirrorland stained-glass Window renderer.

   Full replacement aligned to the live Compass controller.

   Responsibilities:
   - consume the retained architectural Window object;
   - validate and report the exact geometry-object receipt;
   - build separate surface, mask, and motion GPU resources;
   - render frame, lead, glass, and rear motion;
   - use stencil masking when available;
   - use fragment clipping when stencil is unavailable;
   - preserve a dormant miniature;
   - preserve a visible fallback discovery glint if WebGL is held;
   - emit the live controller completion and failure protocols;
   - emit supplemental dgb:* telemetry events.

   This file does not own:
   - Compass navigation;
   - controller state;
   - route execution;
   - cardinal or petal rendering;
   - constellation gestures;
   - semantic controls;
   - Mirrorland geometry generation.

   Required script order:
   1. compass.controller.js
   2. DGB_MIRRORLAND_ARCHITECTURAL_STAINED_GLASS_WINDOW_PREBUILD_v1.js
   3. DGB_MIRRORLAND_ARCHITECTURAL_STAINED_GLASS_WINDOW_OBJECT_v1.js
   4. compass.mirrorland-window.js
   5. compass.crystals.js
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "DGB_COMPASS_MIRRORLAND_ARCHITECTURAL_WINDOW_RENDERER_TNT_v4",

    file:
      "/assets/compass/compass.mirrorland-window.js",

    source:
      "compass.mirrorland-window",

    role:
      "MIRRORLAND_ARCHITECTURAL_WINDOW_RENDERER",

    geometryObjectId:
      "DGB_MIRRORLAND_ARCHITECTURAL_STAINED_GLASS_WINDOW_OBJECT_v1",

    prebuildId:
      "DGB_MIRRORLAND_ARCHITECTURAL_STAINED_GLASS_WINDOW_PREBUILD_v1",

    geometryGenerationAuthorized:
      false,

    sourceGeometryMutationAuthorized:
      false,

    navigationAuthority:
      false,

    controllerAuthority:
      false,

    semanticControlAuthority:
      false,

    cardinalRenderingAuthority:
      false,

    petalRenderingAuthority:
      false,

    crystalsAuthority:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const STATES = Object.freeze({
    DORMANT:
      "dormant",

    REVEALING:
      "revealing",

    FOCUSED:
      "focused",

    WITHDRAWING:
      "withdrawing",

    NAVIGATING:
      "navigating"
  });

  const STATE_VALUES =
    Object.freeze(
      Object.values(STATES)
    );

  const CONTROLLER_EVENTS = Object.freeze({
    REVEAL_COMPLETE:
      "MIRRORLAND_WINDOW_REVEAL_COMPLETE",

    WITHDRAWAL_COMPLETE:
      "MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE",

    RENDER_FAILURE:
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
  });

  const TELEMETRY_EVENTS = Object.freeze({
    READY:
      "dgb:mirrorland-window-ready",

    TRANSITION_COMPLETE:
      "dgb:mirrorland-window-transition-complete",

    FAILURE:
      "dgb:mirrorland-window-failure",

    RECEIPT:
      "dgb:mirrorland-window-receipt"
  });

  const MASK_MODES = Object.freeze({
    PENDING:
      "PENDING",

    STENCIL:
      "STENCIL",

    FRAGMENT_CLIP:
      "FRAGMENT_CLIP_FALLBACK",

    FALLBACK_GLINT:
      "FALLBACK_GLINT_ONLY"
  });

  const DEFAULT_PROFILES = Object.freeze({
    dormant:
      Object.freeze({
        scale:
          0.31,

        motionOpacity:
          0,

        glassTransmission:
          0.52,

        glassEmissive:
          0.72,

        frameHighlight:
          0.74,

        leadContrast:
          0.88,

        parallax:
          0,

        revealProgress:
          0
      }),

    revealing:
      Object.freeze({
        startScale:
          0.31,

        endScale:
          1,

        durationMs:
          920,

        motionDelayMs:
          380,

        motionStartOpacity:
          0,

        motionEndOpacity:
          0.82,

        glassTransmissionStart:
          0.52,

        glassTransmissionEnd:
          1,

        frameHighlightStart:
          0.74,

        frameHighlightEnd:
          1,

        leadContrastStart:
          0.88,

        leadContrastEnd:
          1
      }),

    focused:
      Object.freeze({
        scale:
          1,

        motionOpacity:
          0.88,

        glassTransmission:
          1,

        glassEmissive:
          1,

        frameHighlight:
          1,

        leadContrast:
          1,

        parallax:
          1,

        revealProgress:
          1
      }),

    withdrawing:
      Object.freeze({
        startScale:
          1,

        endScale:
          0.31,

        durationMs:
          760,

        motionStartOpacity:
          0.88,

        motionEndOpacity:
          0,

        glassTransmissionStart:
          1,

        glassTransmissionEnd:
          0.52,

        frameHighlightStart:
          1,

        frameHighlightEnd:
          0.74,

        leadContrastStart:
          1,

        leadContrastEnd:
          0.88
      }),

    navigating:
      Object.freeze({
        scale:
          1.04,

        motionOpacity:
          1,

        glassTransmission:
          1,

        glassEmissive:
          1,

        frameHighlight:
          1.08,

        leadContrast:
          1.04,

        parallax:
          1,

        revealProgress:
          1
      })
  });

  const QUALITY = Object.freeze({
    devicePixelRatioCap:
      2,

    fieldOfViewRadians:
      Math.PI / 4.7,

    near:
      0.1,

    far:
      40,

    cameraZDesktop:
      3.45,

    cameraZMobile:
      3.72,

    mobileAspectThreshold:
      0.82,

    maximumParallaxX:
      0.055,

    maximumParallaxY:
      0.038,

    transitionCompletionTolerance:
      0.002,

    idleFrameIntervalMs:
      1000 / 24,

    activeFrameIntervalMs:
      1000 / 60,

    persistentGlErrorThreshold:
      3,

    maximumGlErrorsPerFrame:
      8,

    targetGeometryDiameter:
      2.18
  });

  const RECEIPT = {
    contractId:
      CONTRACT.id,

    rendererSource:
      CONTRACT.source,

    rendererRole:
      CONTRACT.role,

    geometryObjectId:
      CONTRACT.geometryObjectId,

    rendererInitialized:
      false,

    rendererAvailable:
      false,

    geometryObjectFound:
      false,

    geometryObjectValidated:
      false,

    geometryValidationResult:
      "pending",

    geometryValidationReceipt:
      null,

    geometryFailureDetail:
      null,

    sourceGeometryMutated:
      false,

    frameBuffersBuilt:
      false,

    leadBuffersBuilt:
      false,

    glassBuffersBuilt:
      false,

    apertureBuffersBuilt:
      false,

    motionBuffersBuilt:
      false,

    stencilRequested:
      true,

    stencilAvailable:
      false,

    stencilBits:
      0,

    apertureMaskMode:
      MASK_MODES.PENDING,

    apertureUsesStencilMask:
      false,

    apertureUsesFragmentClip:
      false,

    apertureDrawnAsOpaqueForeground:
      false,

    fallbackGlintCreated:
      false,

    fallbackGlintVisible:
      false,

    dormantMiniatureEnabled:
      true,

    dormantMotionVisible:
      false,

    dormantMotionRunning:
      false,

    focusedMotionVisible:
      false,

    focusedMotionRunning:
      false,

    currentState:
      STATES.DORMANT,

    previousState:
      "",

    activeTransitionId:
      "",

    currentScale:
      DEFAULT_PROFILES.dormant.scale,

    currentMotionOpacity:
      0,

    currentGlassTransmission:
      DEFAULT_PROFILES.dormant.glassTransmission,

    transitionProgress:
      0,

    transitionRunning:
      false,

    transitionCompletionEmitted:
      false,

    lastControllerCompletionEvent:
      "",

    reducedMotion:
      false,

    reducedMotionUsesStaticRearLight:
      false,

    canvasStatus:
      "pending",

    webglStatus:
      "pending",

    stencilStatus:
      "pending",

    shaderStatus:
      "pending",

    bufferStatus:
      "pending",

    renderLoopStatus:
      "pending",

    drawCallsLastFrame:
      0,

    frameDrawCallsLastFrame:
      0,

    leadDrawCallsLastFrame:
      0,

    glassDrawCallsLastFrame:
      0,

    motionDrawCallsLastFrame:
      0,

    stencilDrawCallsLastFrame:
      0,

    glError:
      "not-checked",

    glErrorCodes:
      [],

    consecutiveGlErrorFrames:
      0,

    failureStage:
      null,

    failureReason:
      null,

    failureReasonCode:
      null,

    visualPassClaimed:
      false
  };

  const state = {
    root:
      null,

    scene:
      null,

    mount:
      null,

    canvas:
      null,

    fallbackGlint:
      null,

    gl:
      null,

    geometryObject:
      null,

    programs:
      Object.create(null),

    resources:
      Object.create(null),

    locations:
      Object.create(null),

    capabilities: {
      stencilRequested:
        true,

      stencilAvailable:
        false,

      stencilBits:
        0,

      maskMode:
        MASK_MODES.PENDING
    },

    geometryMetrics: {
      center:
        [0, 0, 0],

      baseFitScale:
        1,

      motionCenter:
        [0, 0],

      motionHalfExtent:
        [1, 1]
    },

    running:
      false,

    held:
      false,

    raf:
      0,

    lastRenderMs:
      0,

    lastReceiptMs:
      0,

    width:
      1,

    height:
      1,

    pixelRatio:
      1,

    reducedMotion:
      false,

    currentState:
      STATES.DORMANT,

    previousState:
      "",

    stateEnteredAtMs:
      0,

    activeTransitionId:
      "",

    transitionCompletionEmitted:
      false,

    lastCompletedTransitionKey:
      "",

    currentProfile: {
      scale:
        DEFAULT_PROFILES.dormant.scale,

      motionOpacity:
        0,

      glassTransmission:
        DEFAULT_PROFILES.dormant.glassTransmission,

      glassEmissive:
        DEFAULT_PROFILES.dormant.glassEmissive,

      frameHighlight:
        DEFAULT_PROFILES.dormant.frameHighlight,

      leadContrast:
        DEFAULT_PROFILES.dormant.leadContrast,

      parallax:
        0,

      revealProgress:
        0
    },

    pointer: {
      x:
        0,

      y:
        0,

      targetX:
        0,

      targetY:
        0
    },

    matrices: {
      model:
        null,

      view:
        null,

      projection:
        null
    },

    consecutiveGlErrorFrames:
      0,

    lastFailureSignature:
      ""
  };

  function qs(
    selectors,
    root = document
  ) {
    for (const selector of selectors) {
      const element =
        root.querySelector(selector);

      if (element) {
        return element;
      }
    }

    return null;
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
        value
      )
    );
  }

  function lerp(
    start,
    end,
    amount
  ) {
    return (
      start +
      (
        end -
        start
      ) *
      amount
    );
  }

  function smoothstep01(value) {
    const t =
      clamp(
        value,
        0,
        1
      );

    return (
      t *
      t *
      (
        3 -
        2 *
        t
      )
    );
  }

  function easeOutCubic(value) {
    const t =
      clamp(
        value,
        0,
        1
      );

    return (
      1 -
      Math.pow(
        1 -
        t,
        3
      )
    );
  }

  function easeInOutCubic(value) {
    const t =
      clamp(
        value,
        0,
        1
      );

    return (
      t < 0.5
        ? 4 *
          t *
          t *
          t
        : 1 -
          Math.pow(
            -2 *
            t +
            2,
            3
          ) /
          2
    );
  }

  function normalizeState(value) {
    const candidate =
      String(
        value ||
        STATES.DORMANT
      )
        .trim()
        .toLowerCase();

    return STATE_VALUES.includes(
      candidate
    )
      ? candidate
      : STATES.DORMANT;
  }

  function readTransitionId() {
    return String(
      state.root &&
      state.root.dataset
        ? state.root.dataset
            .mirrorlandTransitionId ||
          ""
        : ""
    );
  }

  function safeSnapshot(value) {
    if (
      value === null ||
      typeof value ===
        "undefined"
    ) {
      return value;
    }

    try {
      return JSON.parse(
        JSON.stringify(value)
      );
    } catch (_error) {
      return {
        snapshotStatus:
          "UNSERIALIZABLE",

        valueType:
          typeof value
      };
    }
  }

  function dispatch(
    type,
    detail
  ) {
    const target =
      state.root ||
      document;

    target.dispatchEvent(
      new CustomEvent(
        type,
        {
          bubbles:
            true,

          detail
        }
      )
    );
  }

  function controllerDetail(
    windowState,
    completionId
  ) {
    return Object.freeze({
      source:
        CONTRACT.source,

      windowState,

      completionId:
        String(
          completionId ||
          ""
        )
    });
  }

  function boundedReasonCode(value) {
    const normalized =
      String(
        value ||
        "MIRRORLAND_WINDOW_RENDER_FAILURE"
      )
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9:_-]+/g,
          "_"
        )
        .slice(
          0,
          120
        );

    return (
      normalized ||
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
    );
  }

  function emitReceipt(
    extra = {},
    forceEvent = false
  ) {
    Object.assign(
      RECEIPT,
      {
        rendererAvailable:
          !!state.gl &&
          !state.held,

        currentState:
          state.currentState,

        previousState:
          state.previousState,

        activeTransitionId:
          state.activeTransitionId,

        currentScale:
          state.currentProfile.scale,

        currentMotionOpacity:
          state.currentProfile.motionOpacity,

        currentGlassTransmission:
          state.currentProfile.glassTransmission,

        transitionProgress:
          state.currentProfile.revealProgress,

        transitionRunning:
          state.currentState ===
            STATES.REVEALING ||
          state.currentState ===
            STATES.WITHDRAWING,

        transitionCompletionEmitted:
          state.transitionCompletionEmitted,

        reducedMotion:
          state.reducedMotion,

        stencilRequested:
          state.capabilities
            .stencilRequested,

        stencilAvailable:
          state.capabilities
            .stencilAvailable,

        stencilBits:
          state.capabilities
            .stencilBits,

        apertureMaskMode:
          state.capabilities
            .maskMode,

        apertureUsesStencilMask:
          state.capabilities
            .maskMode ===
          MASK_MODES.STENCIL,

        apertureUsesFragmentClip:
          state.capabilities
            .maskMode ===
          MASK_MODES.FRAGMENT_CLIP,

        fallbackGlintCreated:
          !!state.fallbackGlint,

        fallbackGlintVisible:
          !!state.fallbackGlint &&
          state.fallbackGlint.hidden !==
            true,

        dormantMotionVisible:
          state.currentState ===
            STATES.DORMANT
            ? state.currentProfile
                .motionOpacity >
              0.001
            : false,

        dormantMotionRunning:
          false,

        focusedMotionVisible:
          (
            state.currentState ===
              STATES.FOCUSED ||
            state.currentState ===
              STATES.NAVIGATING
          ) &&
          state.currentProfile
            .motionOpacity >
            0.001,

        focusedMotionRunning:
          (
            state.currentState ===
              STATES.FOCUSED ||
            state.currentState ===
              STATES.NAVIGATING
          ) &&
          !state.reducedMotion &&
          !state.held,

        consecutiveGlErrorFrames:
          state
            .consecutiveGlErrorFrames,

        visualPassClaimed:
          false
      },
      extra,
      {
        visualPassClaimed:
          false
      }
    );

    const serialized =
      JSON.stringify(
        RECEIPT
      );

    if (state.root) {
      state.root.dataset
        .compassMirrorlandWindowReceipt =
        serialized;

      state.root.dataset
        .compassMirrorlandWindowRendererStatus =
        RECEIPT.failureReason
          ? "held"
          : "available";

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

    const receiptElement =
      state.root
        ? state.root.querySelector(
            "[data-compass-mirrorland-window-receipt]"
          )
        : null;

    if (receiptElement) {
      receiptElement.value =
        serialized;

      receiptElement.textContent =
        serialized;

      receiptElement.dataset
        .visualPassClaimed =
        "false";
    }

    globalThis
      .DGB_COMPASS_MIRRORLAND_WINDOW_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });

    const now =
      performance.now();

    if (
      forceEvent ||
      now -
        state.lastReceiptMs >
        500
    ) {
      state.lastReceiptMs =
        now;

      dispatch(
        TELEMETRY_EVENTS.RECEIPT,
        Object.freeze({
          ...RECEIPT
        })
      );
    }
  }

  function installFallbackStyle() {
    if (
      document.getElementById(
        "dgb-mirrorland-window-fallback-style"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "dgb-mirrorland-window-fallback-style";

    style.textContent = `
      @keyframes dgb-mirrorland-fallback-glint {
        0%,
        70%,
        100% {
          opacity: 0.10;
          transform:
            translate(-50%, -50%)
            scale(0.76)
            rotate(0deg);
          filter:
            brightness(0.74)
            saturate(0.80);
        }

        74% {
          opacity: 0.76;
          transform:
            translate(-50%, -50%)
            scale(1.08)
            rotate(7deg);
          filter:
            brightness(1.40)
            saturate(1.15);
        }

        79% {
          opacity: 0.28;
          transform:
            translate(-50%, -50%)
            scale(0.92)
            rotate(-4deg);
          filter:
            brightness(0.94)
            saturate(0.92);
        }

        84% {
          opacity: 0.52;
          transform:
            translate(-50%, -50%)
            scale(1.00)
            rotate(2deg);
          filter:
            brightness(1.16)
            saturate(1.02);
        }
      }

      [data-compass-mirrorland-window-fallback-glint] {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1;
        width: clamp(36px, 7vw, 58px);
        aspect-ratio: 1;
        pointer-events: none;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background:
          linear-gradient(
            45deg,
            transparent 42%,
            rgba(255, 239, 182, 0.68) 49%,
            transparent 56%
          ),
          linear-gradient(
            -45deg,
            transparent 42%,
            rgba(117, 221, 255, 0.48) 49%,
            transparent 56%
          ),
          radial-gradient(
            circle,
            rgba(255, 247, 214, 0.68) 0 2px,
            rgba(216, 184, 106, 0.22) 3px 10%,
            rgba(124, 220, 255, 0.12) 22%,
            transparent 62%
          );
        box-shadow:
          0 0 12px rgba(255, 239, 182, 0.16),
          0 0 28px rgba(124, 220, 255, 0.12),
          0 0 54px rgba(216, 184, 106, 0.07);
        opacity: 0.16;
        animation:
          dgb-mirrorland-fallback-glint
          6.8s
          ease-in-out
          infinite;
      }

      [data-compass-mirrorland-window-fallback-glint]::before,
      [data-compass-mirrorland-window-fallback-glint]::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
      }

      [data-compass-mirrorland-window-fallback-glint]::before {
        width: 150%;
        height: 1px;
        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(124, 220, 255, 0.32),
            rgba(255, 239, 182, 0.54),
            rgba(124, 220, 255, 0.32),
            transparent
          );
      }

      [data-compass-mirrorland-window-fallback-glint]::after {
        width: 1px;
        height: 150%;
        background:
          linear-gradient(
            180deg,
            transparent,
            rgba(216, 184, 106, 0.28),
            rgba(255, 247, 214, 0.54),
            rgba(124, 220, 255, 0.26),
            transparent
          );
      }

      [data-mirrorland-window-state="revealing"]
      [data-compass-mirrorland-window-fallback-glint],
      [data-mirrorland-window-state="focused"]
      [data-compass-mirrorland-window-fallback-glint],
      [data-mirrorland-window-state="withdrawing"]
      [data-compass-mirrorland-window-fallback-glint],
      [data-mirrorland-window-state="navigating"]
      [data-compass-mirrorland-window-fallback-glint] {
        opacity: 0.32;
      }

      @media (prefers-reduced-motion: reduce) {
        [data-compass-mirrorland-window-fallback-glint] {
          animation: none;
          opacity: 0.30;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function ensureFallbackGlint() {
    if (!state.mount) {
      return null;
    }

    installFallbackStyle();

    const existing =
      state.mount.querySelector(
        "[data-compass-mirrorland-window-fallback-glint]"
      );

    if (existing) {
      state.fallbackGlint =
        existing;

      return existing;
    }

    const glint =
      document.createElement(
        "span"
      );

    glint.setAttribute(
      "data-compass-mirrorland-window-fallback-glint",
      "true"
    );

    glint.setAttribute(
      "aria-hidden",
      "true"
    );

    state.mount.appendChild(
      glint
    );

    state.fallbackGlint =
      glint;

    emitReceipt({
      fallbackGlintCreated:
        true,

      fallbackGlintVisible:
        true
    });

    return glint;
  }

  function hideFallbackGlint() {
    if (state.fallbackGlint) {
      state.fallbackGlint.hidden =
        true;
    }
  }

  function showFallbackGlint() {
    const glint =
      ensureFallbackGlint();

    if (glint) {
      glint.hidden =
        false;
    }
  }

  function emitControllerFailure(
    reasonCode,
    stage,
    glError = null
  ) {
    const detail =
      Object.freeze({
        source:
          CONTRACT.source,

        reasonCode:
          boundedReasonCode(
            reasonCode
          ),

        stage:
          String(
            stage ||
            "context"
          ),

        glError:
          glError === null ||
          typeof glError ===
            "undefined"
            ? null
            : String(
                glError
              ).slice(
                0,
                160
              )
      });

    const signature =
      [
        detail.reasonCode,
        detail.stage,
        detail.glError || ""
      ].join("|");

    if (
      state.lastFailureSignature ===
      signature &&
      state.currentState ===
        STATES.DORMANT
    ) {
      return;
    }

    state.lastFailureSignature =
      signature;

    dispatch(
      CONTROLLER_EVENTS
        .RENDER_FAILURE,
      detail
    );

    dispatch(
      TELEMETRY_EVENTS.FAILURE,
      Object.freeze({
        contractId:
          CONTRACT.id,

        ...detail
      })
    );
  }

  function fail(
    stage,
    reason,
    extra = {},
    options = {}
  ) {
    state.held =
      true;

    state.running =
      false;

    if (state.raf) {
      cancelAnimationFrame(
        state.raf
      );
    }

    state.capabilities.maskMode =
      MASK_MODES.FALLBACK_GLINT;

    showFallbackGlint();

    const reasonCode =
      boundedReasonCode(
        options.reasonCode ||
        reason
      );

    const glError =
      options.glError ===
        null ||
      typeof options.glError ===
        "undefined"
        ? null
        : options.glError;

    emitReceipt(
      {
        ...extra,

        rendererInitialized:
          false,

        rendererAvailable:
          false,

        failureStage:
          stage,

        failureReason:
          reason,

        failureReasonCode:
          reasonCode,

        glError:
          glError === null
            ? RECEIPT.glError
            : String(
                glError
              ),

        renderLoopStatus:
          "held",

        apertureMaskMode:
          MASK_MODES.FALLBACK_GLINT
      },
      true
    );

    if (
      options.notifyController !==
      false
    ) {
      emitControllerFailure(
        reasonCode,
        stage,
        glError
      );
    }
  }

  function exposeApi() {
    globalThis
      .DGB_COMPASS_MIRRORLAND_WINDOW =
      Object.freeze({
        contract:
          CONTRACT,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        start:
          () => {
            if (
              !state.running &&
              !state.held &&
              state.gl &&
              state.programs.surface
            ) {
              state.running =
                true;

              state.lastRenderMs =
                0;

              state.raf =
                requestAnimationFrame(
                  render
                );

              emitReceipt({
                renderLoopStatus:
                  "active"
              });
            }
          },

        stop:
          () => {
            state.running =
              false;

            cancelAnimationFrame(
              state.raf
            );

            emitReceipt({
              renderLoopStatus:
                "stopped"
            });
          },

        requestRender:
          () => {
            if (
              !state.running &&
              !state.held &&
              state.gl
            ) {
              renderOnce(
                performance.now()
              );
            }
          },

        dispose
      });
  }

  function findRoot() {
    return (
      qs([
        "[data-compass-root]",
        "#compass",
        "main"
      ]) ||
      null
    );
  }

  function resolveGeometryObject() {
    const object =
      globalThis[
        CONTRACT.geometryObjectId
      ];

    if (!object) {
      throw Object.assign(
        new Error(
          "ARCHITECTURAL_WINDOW_OBJECT_UNAVAILABLE"
        ),
        {
          stage:
            "geometry",

          reasonCode:
            "ARCHITECTURAL_WINDOW_OBJECT_UNAVAILABLE"
        }
      );
    }

    RECEIPT.geometryObjectFound =
      true;

    RECEIPT.geometryValidationReceipt =
      safeSnapshot(
        object.validation
      );

    RECEIPT.geometryValidationResult =
      object.validation &&
      object.validation.result
        ? String(
            object.validation.result
          )
        : "missing";

    if (
      object.identity !==
      CONTRACT.geometryObjectId
    ) {
      throw Object.assign(
        new Error(
          "ARCHITECTURAL_WINDOW_OBJECT_IDENTITY_INVALID"
        ),
        {
          stage:
            "geometry",

          reasonCode:
            "ARCHITECTURAL_WINDOW_OBJECT_IDENTITY_INVALID",

          geometryDetail: {
            expected:
              CONTRACT
                .geometryObjectId,

            received:
              object.identity ||
              null
          }
        }
      );
    }

    if (
      !object.validation ||
      object.validation.result !==
        "REVIEW_PASS" ||
      object.validation
        .structurallyValid !==
        true
    ) {
      throw Object.assign(
        new Error(
          "ARCHITECTURAL_WINDOW_OBJECT_VALIDATION_FAILED"
        ),
        {
          stage:
            "geometry",

          reasonCode:
            "ARCHITECTURAL_WINDOW_OBJECT_VALIDATION_FAILED",

          geometryDetail:
            safeSnapshot(
              object.validation
            )
        }
      );
    }

    if (
      !object.geometry ||
      !object.geometry.frame ||
      !object.geometry.lead ||
      !object.geometry.glass ||
      !object.geometry.apertureMask ||
      !object.geometry.motionBoundary
    ) {
      throw Object.assign(
        new Error(
          "ARCHITECTURAL_WINDOW_GEOMETRY_INCOMPLETE"
        ),
        {
          stage:
            "geometry",

          reasonCode:
            "ARCHITECTURAL_WINDOW_GEOMETRY_INCOMPLETE",

          geometryDetail: {
            frame:
              !!(
                object.geometry &&
                object.geometry.frame
              ),

            lead:
              !!(
                object.geometry &&
                object.geometry.lead
              ),

            glass:
              !!(
                object.geometry &&
                object.geometry.glass
              ),

            apertureMask:
              !!(
                object.geometry &&
                object.geometry
                  .apertureMask
              ),

            motionBoundary:
              !!(
                object.geometry &&
                object.geometry
                  .motionBoundary
              )
          }
        }
      );
    }

    RECEIPT.geometryObjectValidated =
      true;

    return object;
  }

  function ensureCanvas(mount) {
    const existing =
      mount.querySelector(
        "canvas[data-compass-mirrorland-window-canvas]"
      );

    if (existing) {
      return existing;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.setAttribute(
      "data-compass-mirrorland-window-canvas",
      "true"
    );

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

    canvas.style.display =
      "block";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.pointerEvents =
      "none";

    if (
      getComputedStyle(
        mount
      ).position ===
      "static"
    ) {
      mount.style.position =
        "absolute";

      mount.style.inset =
        "0";
    }

    mount.appendChild(
      canvas
    );

    return canvas;
  }

  function createContext(canvas) {
    return canvas.getContext(
      "webgl",
      {
        alpha:
          true,

        antialias:
          true,

        depth:
          true,

        stencil:
          true,

        premultipliedAlpha:
          true,

        preserveDrawingBuffer:
          false,

        powerPreference:
          "high-performance"
      }
    );
  }

  function toFloat32Array(
    value,
    label
  ) {
    if (
      value instanceof
      Float32Array
    ) {
      return value;
    }

    if (
      ArrayBuffer.isView(value) ||
      Array.isArray(value)
    ) {
      return new Float32Array(
        value
      );
    }

    throw new Error(
      "INVALID_FLOAT_ARRAY:" +
      label
    );
  }

  function normalizeIndices(
    gl,
    geometry
  ) {
    const source =
      geometry.indices;

    if (
      !source ||
      typeof source.length !==
        "number"
    ) {
      throw new Error(
        "INVALID_INDEX_ARRAY:" +
        (
          geometry.id ||
          "UNKNOWN"
        )
      );
    }

    let maximum =
      0;

    for (
      let index = 0;
      index < source.length;
      index += 1
    ) {
      maximum =
        Math.max(
          maximum,
          Number(
            source[index]
          ) ||
          0
        );
    }

    const requestsUint =
      geometry.indexType ===
        "UNSIGNED_INT" ||
      source instanceof
        Uint32Array ||
      maximum >
        65535;

    if (requestsUint) {
      const extension =
        gl.getExtension(
          "OES_element_index_uint"
        );

      if (!extension) {
        throw new Error(
          "UNSIGNED_INT_INDEX_EXTENSION_UNAVAILABLE:" +
          (
            geometry.id ||
            "UNKNOWN"
          )
        );
      }

      return {
        data:
          source instanceof
          Uint32Array
            ? source
            : new Uint32Array(
                source
              ),

        type:
          gl.UNSIGNED_INT
      };
    }

    return {
      data:
        source instanceof
        Uint16Array
          ? source
          : new Uint16Array(
              source
            ),

      type:
        gl.UNSIGNED_SHORT
    };
  }

  function createBuffer(
    gl,
    target,
    data
  ) {
    const buffer =
      gl.createBuffer();

    if (!buffer) {
      throw new Error(
        "WEBGL_BUFFER_CREATION_FAILED"
      );
    }

    gl.bindBuffer(
      target,
      buffer
    );

    gl.bufferData(
      target,
      data,
      gl.STATIC_DRAW
    );

    return buffer;
  }

  function requireGeometryField(
    geometry,
    field,
    resourceClass
  ) {
    if (
      !geometry ||
      !geometry[field] ||
      typeof geometry[field].length !==
        "number" ||
      geometry[field].length ===
        0
    ) {
      throw new Error(
        resourceClass +
        "_RESOURCE_MISSING_" +
        field.toUpperCase() +
        ":" +
        (
          geometry &&
          geometry.id
            ? geometry.id
            : "UNKNOWN"
        )
      );
    }
  }

  function buildSurfaceResource(
    gl,
    geometry
  ) {
    requireGeometryField(
      geometry,
      "positions",
      "SURFACE"
    );

    requireGeometryField(
      geometry,
      "normals",
      "SURFACE"
    );

    requireGeometryField(
      geometry,
      "colors",
      "SURFACE"
    );

    requireGeometryField(
      geometry,
      "indices",
      "SURFACE"
    );

    const positions =
      toFloat32Array(
        geometry.positions,
        geometry.id +
        ":positions"
      );

    const normals =
      toFloat32Array(
        geometry.normals,
        geometry.id +
        ":normals"
      );

    const colors =
      toFloat32Array(
        geometry.colors,
        geometry.id +
        ":colors"
      );

    if (
      positions.length % 3 !==
        0 ||
      normals.length !==
        positions.length ||
      colors.length !==
        positions.length
    ) {
      throw new Error(
        "SURFACE_ATTRIBUTE_LENGTH_MISMATCH:" +
        geometry.id
      );
    }

    const indexPayload =
      normalizeIndices(
        gl,
        geometry
      );

    return Object.freeze({
      id:
        geometry.id,

      resourceClass:
        "surface",

      materialId:
        geometry.materialId,

      positions,

      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          positions
        ),

      normal:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          normals
        ),

      color:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          colors
        ),

      index:
        createBuffer(
          gl,
          gl.ELEMENT_ARRAY_BUFFER,
          indexPayload.data
        ),

      indexCount:
        indexPayload.data.length,

      indexType:
        indexPayload.type,

      vertexCount:
        positions.length / 3,

      triangleCount:
        indexPayload.data.length /
        3
    });
  }

  function buildMaskResource(
    gl,
    geometry
  ) {
    requireGeometryField(
      geometry,
      "positions",
      "MASK"
    );

    requireGeometryField(
      geometry,
      "indices",
      "MASK"
    );

    const positions =
      toFloat32Array(
        geometry.positions,
        geometry.id +
        ":positions"
      );

    if (
      positions.length % 3 !==
      0
    ) {
      throw new Error(
        "MASK_POSITION_LENGTH_INVALID:" +
        geometry.id
      );
    }

    const indexPayload =
      normalizeIndices(
        gl,
        geometry
      );

    return Object.freeze({
      id:
        geometry.id,

      resourceClass:
        "mask",

      positions,

      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          positions
        ),

      index:
        createBuffer(
          gl,
          gl.ELEMENT_ARRAY_BUFFER,
          indexPayload.data
        ),

      indexCount:
        indexPayload.data.length,

      indexType:
        indexPayload.type,

      vertexCount:
        positions.length / 3,

      triangleCount:
        indexPayload.data.length /
        3
    });
  }

  function buildMotionResource(
    gl,
    geometry
  ) {
    requireGeometryField(
      geometry,
      "positions",
      "MOTION"
    );

    requireGeometryField(
      geometry,
      "indices",
      "MOTION"
    );

    const positions =
      toFloat32Array(
        geometry.positions,
        geometry.id +
        ":positions"
      );

    if (
      positions.length % 3 !==
      0
    ) {
      throw new Error(
        "MOTION_POSITION_LENGTH_INVALID:" +
        geometry.id
      );
    }

    const indexPayload =
      normalizeIndices(
        gl,
        geometry
      );

    return Object.freeze({
      id:
        geometry.id,

      resourceClass:
        "motion",

      positions,

      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          positions
        ),

      index:
        createBuffer(
          gl,
          gl.ELEMENT_ARRAY_BUFFER,
          indexPayload.data
        ),

      indexCount:
        indexPayload.data.length,

      indexType:
        indexPayload.type,

      vertexCount:
        positions.length / 3,

      triangleCount:
        indexPayload.data.length /
        3
    });
  }

  function computeBounds(
    positionArrays
  ) {
    const minimum =
      [
        Infinity,
        Infinity,
        Infinity
      ];

    const maximum =
      [
        -Infinity,
        -Infinity,
        -Infinity
      ];

    positionArrays.forEach(
      (positions) => {
        for (
          let index = 0;
          index < positions.length;
          index += 3
        ) {
          minimum[0] =
            Math.min(
              minimum[0],
              positions[index]
            );

          minimum[1] =
            Math.min(
              minimum[1],
              positions[index + 1]
            );

          minimum[2] =
            Math.min(
              minimum[2],
              positions[index + 2]
            );

          maximum[0] =
            Math.max(
              maximum[0],
              positions[index]
            );

          maximum[1] =
            Math.max(
              maximum[1],
              positions[index + 1]
            );

          maximum[2] =
            Math.max(
              maximum[2],
              positions[index + 2]
            );
        }
      }
    );

    if (
      !Number.isFinite(
        minimum[0]
      ) ||
      !Number.isFinite(
        maximum[0]
      )
    ) {
      return {
        minimum:
          [-1, -1, -0.1],

        maximum:
          [1, 1, 0.1]
      };
    }

    return {
      minimum,
      maximum
    };
  }

  function computeGeometryMetrics() {
    const surfaceBounds =
      computeBounds([
        state.resources.frame
          .positions,
        state.resources.lead
          .positions,
        state.resources.glass
          .positions
      ]);

    const center =
      [
        (
          surfaceBounds.minimum[0] +
          surfaceBounds.maximum[0]
        ) /
        2,

        (
          surfaceBounds.minimum[1] +
          surfaceBounds.maximum[1]
        ) /
        2,

        (
          surfaceBounds.minimum[2] +
          surfaceBounds.maximum[2]
        ) /
        2
      ];

    const width =
      Math.max(
        0.0001,
        surfaceBounds.maximum[0] -
        surfaceBounds.minimum[0]
      );

    const height =
      Math.max(
        0.0001,
        surfaceBounds.maximum[1] -
        surfaceBounds.minimum[1]
      );

    const maximumDimension =
      Math.max(
        width,
        height
      );

    const motionBounds =
      computeBounds([
        state.resources.motion
          .positions
      ]);

    const motionCenter =
      [
        (
          motionBounds.minimum[0] +
          motionBounds.maximum[0]
        ) /
        2,

        (
          motionBounds.minimum[1] +
          motionBounds.maximum[1]
        ) /
        2
      ];

    const motionHalfExtent =
      [
        Math.max(
          0.0001,
          (
            motionBounds.maximum[0] -
            motionBounds.minimum[0]
          ) /
          2
        ),

        Math.max(
          0.0001,
          (
            motionBounds.maximum[1] -
            motionBounds.minimum[1]
          ) /
          2
        )
      ];

    state.geometryMetrics = {
      center,

      baseFitScale:
        QUALITY
          .targetGeometryDiameter /
        maximumDimension,

      motionCenter,

      motionHalfExtent
    };
  }

  const surfaceVertexShader = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uNormalMatrix;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec4 world =
        uModel *
        vec4(
          aPosition,
          1.0
        );

      vec4 view =
        uView *
        world;

      vNormal =
        normalize(
          uNormalMatrix *
          aNormal
        );

      vColor =
        aColor;

      vViewPosition =
        view.xyz;

      vWorldPosition =
        world.xyz;

      gl_Position =
        uProjection *
        view;
    }
  `;

  const surfaceFragmentShader = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    uniform float uTime;
    uniform float uMaterialKind;
    uniform float uOpacity;
    uniform float uTransmission;
    uniform float uEmissive;
    uniform float uHighlight;
    uniform float uContrast;
    uniform float uRevealProgress;
    uniform float uReducedMotion;

    uniform vec3 uKeyLight;
    uniform vec3 uFillLight;
    uniform vec3 uRimLight;

    float hash31(vec3 p) {
      return fract(
        sin(
          dot(
            p,
            vec3(
              12.9898,
              78.233,
              37.719
            )
          )
        ) *
        43758.5453
      );
    }

    void main() {
      vec3 normal =
        normalize(
          vNormal
        );

      vec3 viewDirection =
        normalize(
          -vViewPosition
        );

      float cameraFacing =
        max(
          dot(
            normal,
            viewDirection
          ),
          0.0
        );

      float key =
        max(
          dot(
            normal,
            normalize(
              -uKeyLight
            )
          ),
          0.0
        );

      float fill =
        max(
          dot(
            normal,
            normalize(
              -uFillLight
            )
          ),
          0.0
        );

      float rim =
        pow(
          1.0 -
          cameraFacing,
          2.1
        );

      float grain =
        hash31(
          floor(
            vWorldPosition *
            93.0
          )
        );

      if (
        uMaterialKind <
        0.5
      ) {
        vec3 metalBase =
          vColor *
          (
            0.42 +
            key *
            0.58 +
            fill *
            0.22
          );

        vec3 warmEdge =
          vec3(
            0.62,
            0.42,
            0.17
          ) *
          rim *
          0.28 *
          uHighlight;

        float patina =
          (
            grain -
            0.5
          ) *
          0.055;

        vec3 color =
          metalBase +
          warmEdge +
          patina;

        gl_FragColor =
          vec4(
            color,
            uOpacity
          );

        return;
      }

      if (
        uMaterialKind <
        1.5
      ) {
        vec3 leadBase =
          vColor *
          (
            0.48 +
            key *
            0.40 +
            fill *
            0.14
          ) *
          uContrast;

        vec3 coolEdge =
          vec3(
            0.18,
            0.23,
            0.29
          ) *
          rim *
          0.16;

        float oxidation =
          (
            grain -
            0.5
          ) *
          0.035;

        vec3 color =
          leadBase +
          coolEdge +
          oxidation;

        gl_FragColor =
          vec4(
            color,
            uOpacity
          );

        return;
      }

      float irregularity =
        (
          hash31(
            vWorldPosition *
            51.0 +
            normal *
            7.0
          ) -
          0.5
        );

      vec3 reflectedLight =
        reflect(
          normalize(
            uKeyLight
          ),
          normal
        );

      float highlight =
        pow(
          max(
            dot(
              reflectedLight,
              viewDirection
            ),
            0.0
          ),
          24.0
        );

      float edgeAbsorption =
        pow(
          1.0 -
          cameraFacing,
          1.45
        );

      float dormantRestraint =
        mix(
          0.76,
          1.0,
          uRevealProgress
        );

      vec3 transmittedColor =
        vColor *
        (
          0.76 +
          key *
          0.24 +
          fill *
          0.12
        ) *
        dormantRestraint;

      transmittedColor +=
        vec3(
          0.62,
          0.78,
          0.94
        ) *
        rim *
        0.15;

      transmittedColor +=
        vec3(
          1.0,
          0.91,
          0.72
        ) *
        highlight *
        0.24 *
        uHighlight;

      transmittedColor +=
        vColor *
        uEmissive *
        0.16;

      transmittedColor *=
        1.0 +
        irregularity *
        0.11;

      transmittedColor *=
        1.0 -
        edgeAbsorption *
        0.18;

      float glassAlpha =
        clamp(
          uOpacity *
          (
            0.58 +
            (
              1.0 -
              uTransmission
            ) *
            0.30 +
            edgeAbsorption *
            0.08
          ),
          0.26,
          0.94
        );

      gl_FragColor =
        vec4(
          transmittedColor,
          glassAlpha
        );
    }
  `;

  const maskVertexShader = `
    attribute vec3 aPosition;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    void main() {
      gl_Position =
        uProjection *
        uView *
        uModel *
        vec4(
          aPosition,
          1.0
        );
    }
  `;

  const maskFragmentShader = `
    precision mediump float;

    void main() {
      gl_FragColor =
        vec4(
          1.0
        );
    }
  `;

  const motionVertexShader = `
    attribute vec3 aPosition;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    uniform vec2 uMotionCenter;
    uniform vec2 uMotionHalfExtent;

    varying vec2 vUv;
    varying vec2 vCenteredUv;
    varying vec3 vWorldPosition;

    void main() {
      vec4 world =
        uModel *
        vec4(
          aPosition,
          1.0
        );

      vec2 normalized =
        (
          aPosition.xy -
          uMotionCenter
        ) /
        max(
          uMotionHalfExtent,
          vec2(
            0.0001
          )
        );

      vCenteredUv =
        normalized;

      vUv =
        normalized *
        0.5 +
        0.5;

      vWorldPosition =
        world.xyz;

      gl_Position =
        uProjection *
        uView *
        world;
    }
  `;

  const motionFragmentShader = `
    precision mediump float;

    varying vec2 vUv;
    varying vec2 vCenteredUv;
    varying vec3 vWorldPosition;

    uniform float uTime;
    uniform float uOpacity;
    uniform float uReducedMotion;
    uniform float uRevealProgress;
    uniform float uFragmentClipEnabled;
    uniform vec2 uParallax;

    float hash21(vec2 p) {
      return fract(
        sin(
          dot(
            p,
            vec2(
              127.1,
              311.7
            )
          )
        ) *
        43758.5453123
      );
    }

    float noise(vec2 p) {
      vec2 i =
        floor(p);

      vec2 f =
        fract(p);

      vec2 u =
        f *
        f *
        (
          3.0 -
          2.0 *
          f
        );

      return mix(
        mix(
          hash21(
            i +
            vec2(
              0.0,
              0.0
            )
          ),
          hash21(
            i +
            vec2(
              1.0,
              0.0
            )
          ),
          u.x
        ),
        mix(
          hash21(
            i +
            vec2(
              0.0,
              1.0
            )
          ),
          hash21(
            i +
            vec2(
              1.0,
              1.0
            )
          ),
          u.x
        ),
        u.y
      );
    }

    float fbm(vec2 p) {
      float value =
        0.0;

      float amplitude =
        0.5;

      for (
        int index = 0;
        index < 4;
        index++
      ) {
        value +=
          noise(p) *
          amplitude;

        p =
          p *
          2.02 +
          vec2(
            17.1,
            9.2
          );

        amplitude *=
          0.5;
      }

      return value;
    }

    void main() {
      float activeTime =
        uReducedMotion >
        0.5
          ? 0.0
          : uTime;

      vec2 centered =
        vUv -
        0.5;

      float normalizedRadius =
        length(
          vCenteredUv
        );

      if (
        uFragmentClipEnabled >
          0.5 &&
        normalizedRadius >
          1.0
      ) {
        discard;
      }

      float radial =
        length(
          centered
        );

      vec2 parallaxUv =
        vUv +
        uParallax *
        (
          0.24 +
          radial *
          0.16
        );

      float distant =
        fbm(
          parallaxUv *
          3.2 +
          vec2(
            activeTime *
            0.018,
            -activeTime *
            0.012
          )
        );

      float veil =
        fbm(
          parallaxUv *
          5.0 +
          vec2(
            -activeTime *
            0.026,
            activeTime *
            0.015
          )
        );

      float nearShadow =
        fbm(
          parallaxUv *
          7.6 +
          vec2(
            activeTime *
            0.014,
            activeTime *
            0.009
          )
        );

      float distantLight =
        smoothstep(
          0.47,
          0.82,
          distant
        );

      float atmosphericVeil =
        smoothstep(
          0.35,
          0.78,
          veil
        );

      float shadowDrift =
        smoothstep(
          0.44,
          0.76,
          nearShadow
        );

      vec3 deepWorld =
        vec3(
          0.015,
          0.042,
          0.090
        );

      vec3 mineralLight =
        vec3(
          0.080,
          0.300,
          0.410
        ) *
        distantLight *
        0.72;

      vec3 violetDistance =
        vec3(
          0.220,
          0.110,
          0.350
        ) *
        atmosphericVeil *
        0.38;

      vec3 oldGold =
        vec3(
          0.520,
          0.310,
          0.095
        ) *
        pow(
          distantLight,
          2.3
        ) *
        0.24;

      vec3 color =
        deepWorld +
        mineralLight +
        violetDistance +
        oldGold;

      color *=
        1.0 -
        shadowDrift *
        0.24;

      float circularFade =
        1.0 -
        smoothstep(
          0.84,
          1.0,
          normalizedRadius
        );

      float reveal =
        smoothstep(
          0.04,
          0.72,
          uRevealProgress
        );

      gl_FragColor =
        vec4(
          color,
          uOpacity *
          circularFade *
          reveal
        );
    }
  `;

  function compileShader(
    gl,
    type,
    source,
    label
  ) {
    const shader =
      gl.createShader(type);

    if (!shader) {
      throw new Error(
        "SHADER_CREATION_FAILED:" +
        label
      );
    }

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(
      shader
    );

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const info =
        gl.getShaderInfoLog(
          shader
        ) ||
        "UNKNOWN_SHADER_COMPILE_ERROR";

      gl.deleteShader(
        shader
      );

      throw new Error(
        "SHADER_COMPILE_FAILED:" +
        label +
        ":" +
        info
      );
    }

    return shader;
  }

  function createProgram(
    gl,
    vertexSource,
    fragmentSource,
    label
  ) {
    const vertexShader =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexSource,
        label + ":vertex"
      );

    const fragmentShader =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentSource,
        label + ":fragment"
      );

    const program =
      gl.createProgram();

    if (!program) {
      gl.deleteShader(
        vertexShader
      );

      gl.deleteShader(
        fragmentShader
      );

      throw new Error(
        "PROGRAM_CREATION_FAILED:" +
        label
      );
    }

    gl.attachShader(
      program,
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(
      vertexShader
    );

    gl.deleteShader(
      fragmentShader
    );

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const info =
        gl.getProgramInfoLog(
          program
        ) ||
        "UNKNOWN_PROGRAM_LINK_ERROR";

      gl.deleteProgram(
        program
      );

      throw new Error(
        "PROGRAM_LINK_FAILED:" +
        label +
        ":" +
        info
      );
    }

    return program;
  }

  function buildPrograms(gl) {
    const surface =
      createProgram(
        gl,
        surfaceVertexShader,
        surfaceFragmentShader,
        "surface"
      );

    const mask =
      createProgram(
        gl,
        maskVertexShader,
        maskFragmentShader,
        "mask"
      );

    const motion =
      createProgram(
        gl,
        motionVertexShader,
        motionFragmentShader,
        "motion"
      );

    state.programs.surface =
      surface;

    state.programs.mask =
      mask;

    state.programs.motion =
      motion;

    state.locations.surface = {
      attributes: {
        position:
          gl.getAttribLocation(
            surface,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            surface,
            "aNormal"
          ),

        color:
          gl.getAttribLocation(
            surface,
            "aColor"
          )
      },

      uniforms: {
        model:
          gl.getUniformLocation(
            surface,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            surface,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            surface,
            "uProjection"
          ),

        normalMatrix:
          gl.getUniformLocation(
            surface,
            "uNormalMatrix"
          ),

        time:
          gl.getUniformLocation(
            surface,
            "uTime"
          ),

        materialKind:
          gl.getUniformLocation(
            surface,
            "uMaterialKind"
          ),

        opacity:
          gl.getUniformLocation(
            surface,
            "uOpacity"
          ),

        transmission:
          gl.getUniformLocation(
            surface,
            "uTransmission"
          ),

        emissive:
          gl.getUniformLocation(
            surface,
            "uEmissive"
          ),

        highlight:
          gl.getUniformLocation(
            surface,
            "uHighlight"
          ),

        contrast:
          gl.getUniformLocation(
            surface,
            "uContrast"
          ),

        revealProgress:
          gl.getUniformLocation(
            surface,
            "uRevealProgress"
          ),

        reducedMotion:
          gl.getUniformLocation(
            surface,
            "uReducedMotion"
          ),

        keyLight:
          gl.getUniformLocation(
            surface,
            "uKeyLight"
          ),

        fillLight:
          gl.getUniformLocation(
            surface,
            "uFillLight"
          ),

        rimLight:
          gl.getUniformLocation(
            surface,
            "uRimLight"
          )
      }
    };

    state.locations.mask = {
      attributes: {
        position:
          gl.getAttribLocation(
            mask,
            "aPosition"
          )
      },

      uniforms: {
        model:
          gl.getUniformLocation(
            mask,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            mask,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            mask,
            "uProjection"
          )
      }
    };

    state.locations.motion = {
      attributes: {
        position:
          gl.getAttribLocation(
            motion,
            "aPosition"
          )
      },

      uniforms: {
        model:
          gl.getUniformLocation(
            motion,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            motion,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            motion,
            "uProjection"
          ),

        motionCenter:
          gl.getUniformLocation(
            motion,
            "uMotionCenter"
          ),

        motionHalfExtent:
          gl.getUniformLocation(
            motion,
            "uMotionHalfExtent"
          ),

        time:
          gl.getUniformLocation(
            motion,
            "uTime"
          ),

        opacity:
          gl.getUniformLocation(
            motion,
            "uOpacity"
          ),

        reducedMotion:
          gl.getUniformLocation(
            motion,
            "uReducedMotion"
          ),

        revealProgress:
          gl.getUniformLocation(
            motion,
            "uRevealProgress"
          ),

        fragmentClipEnabled:
          gl.getUniformLocation(
            motion,
            "uFragmentClipEnabled"
          ),

        parallax:
          gl.getUniformLocation(
            motion,
            "uParallax"
          )
      }
    };
  }

  function buildResources(gl) {
    const geometry =
      state.geometryObject.geometry;

    try {
      state.resources.frame =
        buildSurfaceResource(
          gl,
          geometry.frame
        );

      RECEIPT.frameBuffersBuilt =
        true;

      state.resources.lead =
        buildSurfaceResource(
          gl,
          geometry.lead
        );

      RECEIPT.leadBuffersBuilt =
        true;

      state.resources.glass =
        buildSurfaceResource(
          gl,
          geometry.glass
        );

      RECEIPT.glassBuffersBuilt =
        true;

      state.resources.aperture =
        buildMaskResource(
          gl,
          geometry.apertureMask
        );

      RECEIPT.apertureBuffersBuilt =
        true;

      state.resources.motion =
        buildMotionResource(
          gl,
          geometry.motionBoundary
        );

      RECEIPT.motionBuffersBuilt =
        true;

      computeGeometryMetrics();

      emitReceipt({
        bufferStatus:
          "built"
      });
    } catch (error) {
      throw Object.assign(
        error,
        {
          stage:
            "geometry",

          reasonCode:
            "ARCHITECTURAL_WINDOW_GPU_RESOURCE_BUILD_FAILED",

          geometryDetail: {
            message:
              error &&
              error.message
                ? error.message
                : String(
                    error
                  ),

            frameBuffersBuilt:
              RECEIPT
                .frameBuffersBuilt,

            leadBuffersBuilt:
              RECEIPT
                .leadBuffersBuilt,

            glassBuffersBuilt:
              RECEIPT
                .glassBuffersBuilt,

            apertureBuffersBuilt:
              RECEIPT
                .apertureBuffersBuilt,

            motionBuffersBuilt:
              RECEIPT
                .motionBuffersBuilt
          }
        }
      );
    }
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(
    a,
    b
  ) {
    const result =
      new Array(16).fill(0);

    for (
      let row = 0;
      row < 4;
      row += 1
    ) {
      for (
        let column = 0;
        column < 4;
        column += 1
      ) {
        for (
          let index = 0;
          index < 4;
          index += 1
        ) {
          result[
            column * 4 +
            row
          ] +=
            a[
              index * 4 +
              row
            ] *
            b[
              column * 4 +
              index
            ];
        }
      }
    }

    return result;
  }

  function translate4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[12] =
      x;

    matrix[13] =
      y;

    matrix[14] =
      z;

    return matrix;
  }

  function scale4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[0] =
      x;

    matrix[5] =
      y;

    matrix[10] =
      z;

    return matrix;
  }

  function rotateX4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      1, 0, 0, 0,
      0, cosine, sine, 0,
      0, -sine, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function rotateY4(angle) {
    const cosine =
      Math.cos(angle);

    const sine =
      Math.sin(angle);

    return [
      cosine, 0, -sine, 0,
      0, 1, 0, 0,
      sine, 0, cosine, 0,
      0, 0, 0, 1
    ];
  }

  function perspective4(
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const factor =
      1 /
      Math.tan(
        fieldOfView /
        2
      );

    const rangeInverse =
      1 /
      (
        near -
        far
      );

    return [
      factor / aspect,
      0,
      0,
      0,

      0,
      factor,
      0,
      0,

      0,
      0,
      (
        far +
        near
      ) *
      rangeInverse,
      -1,

      0,
      0,
      (
        2 *
        far *
        near
      ) *
      rangeInverse,
      0
    ];
  }

  function subtract3(
    a,
    b
  ) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function cross3(
    a,
    b
  ) {
    return [
      a[1] * b[2] -
      a[2] * b[1],

      a[2] * b[0] -
      a[0] * b[2],

      a[0] * b[1] -
      a[1] * b[0]
    ];
  }

  function normalize3(vector) {
    const length =
      Math.hypot(
        vector[0],
        vector[1],
        vector[2]
      ) ||
      1;

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function dot3(
    a,
    b
  ) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function lookAt4(
    eye,
    center,
    up
  ) {
    const z =
      normalize3(
        subtract3(
          eye,
          center
        )
      );

    const x =
      normalize3(
        cross3(
          up,
          z
        )
      );

    const y =
      cross3(
        z,
        x
      );

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot3(x, eye),
      -dot3(y, eye),
      -dot3(z, eye),
      1
    ];
  }

  function normalMatrix3(model) {
    return [
      model[0],
      model[1],
      model[2],

      model[4],
      model[5],
      model[6],

      model[8],
      model[9],
      model[10]
    ];
  }

  function readControllerState(nowMs) {
    const dataset =
      state.root.dataset ||
      {};

    const requestedState =
      normalizeState(
        dataset.mirrorlandWindowState
      );

    if (
      requestedState !==
      state.currentState
    ) {
      state.previousState =
        state.currentState;

      state.currentState =
        requestedState;

      state.stateEnteredAtMs =
        nowMs;

      state.transitionCompletionEmitted =
        false;

      if (
        requestedState ===
          STATES.REVEALING ||
        requestedState ===
          STATES.WITHDRAWING
      ) {
        state.activeTransitionId =
          readTransitionId();
      } else if (
        requestedState ===
          STATES.DORMANT
      ) {
        state.activeTransitionId =
          "";
      }
    } else if (
      (
        requestedState ===
          STATES.REVEALING ||
        requestedState ===
          STATES.WITHDRAWING
      ) &&
      !state.activeTransitionId
    ) {
      state.activeTransitionId =
        readTransitionId();
    }

    state.reducedMotion =
      (
        typeof globalThis
          .matchMedia ===
          "function" &&
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) ||
      dataset.reducedMotion ===
        "true";
  }

  function profileForState(nowMs) {
    const objectProfiles =
      state.geometryObject &&
      state.geometryObject
        .runtimeProfiles
        ? state.geometryObject
            .runtimeProfiles
        : {};

    const dormant =
      objectProfiles.dormant ||
      DEFAULT_PROFILES.dormant;

    const revealing =
      objectProfiles.revealing ||
      DEFAULT_PROFILES.revealing;

    const focused =
      objectProfiles.focused ||
      DEFAULT_PROFILES.focused;

    const withdrawing =
      objectProfiles.withdrawing ||
      DEFAULT_PROFILES.withdrawing;

    const navigating =
      objectProfiles.navigating ||
      DEFAULT_PROFILES.navigating;

    if (
      state.currentState ===
      STATES.DORMANT
    ) {
      return {
        scale:
          dormant.scale ??
          DEFAULT_PROFILES
            .dormant.scale,

        motionOpacity:
          0,

        glassTransmission:
          dormant
            .glassTransmissionMultiplier ??
          DEFAULT_PROFILES
            .dormant
            .glassTransmission,

        glassEmissive:
          dormant
            .glassEmissiveMultiplier ??
          DEFAULT_PROFILES
            .dormant
            .glassEmissive,

        frameHighlight:
          dormant
            .frameHighlightMultiplier ??
          DEFAULT_PROFILES
            .dormant
            .frameHighlight,

        leadContrast:
          dormant
            .leadContrastMultiplier ??
          DEFAULT_PROFILES
            .dormant
            .leadContrast,

        parallax:
          0,

        revealProgress:
          0
      };
    }

    if (
      state.currentState ===
      STATES.REVEALING
    ) {
      const duration =
        state.reducedMotion
          ? 1
          : revealing.durationMs ??
            DEFAULT_PROFILES
              .revealing
              .durationMs;

      const rawProgress =
        clamp(
          (
            nowMs -
            state.stateEnteredAtMs
          ) /
          Math.max(
            1,
            duration
          ),
          0,
          1
        );

      const eased =
        easeOutCubic(
          rawProgress
        );

      const motionDelay =
        state.reducedMotion
          ? 0
          : revealing
              .motionStartDelayMs ??
            revealing.motionDelayMs ??
            DEFAULT_PROFILES
              .revealing
              .motionDelayMs;

      const motionDuration =
        Math.max(
          1,
          duration -
          motionDelay
        );

      const motionProgress =
        clamp(
          (
            nowMs -
            state.stateEnteredAtMs -
            motionDelay
          ) /
          motionDuration,
          0,
          1
        );

      return {
        scale:
          lerp(
            revealing.startScale ??
              dormant.scale ??
              DEFAULT_PROFILES
                .revealing
                .startScale,

            revealing.endScale ??
              focused.scale ??
              DEFAULT_PROFILES
                .revealing
                .endScale,

            eased
          ),

        motionOpacity:
          state.reducedMotion
            ? lerp(
                0,
                0.34,
                smoothstep01(
                  motionProgress
                )
              )
            : lerp(
                revealing
                  .motionFieldStartOpacity ??
                  revealing
                    .motionStartOpacity ??
                  DEFAULT_PROFILES
                    .revealing
                    .motionStartOpacity,

                revealing
                  .motionFieldEndOpacity ??
                  revealing
                    .motionEndOpacity ??
                  DEFAULT_PROFILES
                    .revealing
                    .motionEndOpacity,

                smoothstep01(
                  motionProgress
                )
              ),

        glassTransmission:
          lerp(
            revealing
              .glassTransmissionStart ??
              DEFAULT_PROFILES
                .revealing
                .glassTransmissionStart,

            revealing
              .glassTransmissionEnd ??
              DEFAULT_PROFILES
                .revealing
                .glassTransmissionEnd,

            eased
          ),

        glassEmissive:
          lerp(
            dormant
              .glassEmissiveMultiplier ??
              DEFAULT_PROFILES
                .dormant
                .glassEmissive,

            focused
              .glassEmissiveMultiplier ??
              DEFAULT_PROFILES
                .focused
                .glassEmissive,

            eased
          ),

        frameHighlight:
          lerp(
            revealing
              .frameHighlightStart ??
              DEFAULT_PROFILES
                .revealing
                .frameHighlightStart,

            revealing
              .frameHighlightEnd ??
              DEFAULT_PROFILES
                .revealing
                .frameHighlightEnd,

            eased
          ),

        leadContrast:
          lerp(
            revealing
              .leadContrastStart ??
              DEFAULT_PROFILES
                .revealing
                .leadContrastStart,

            revealing
              .leadContrastEnd ??
              DEFAULT_PROFILES
                .revealing
                .leadContrastEnd,

            eased
          ),

        parallax:
          eased,

        revealProgress:
          rawProgress
      };
    }

    if (
      state.currentState ===
      STATES.WITHDRAWING
    ) {
      const duration =
        state.reducedMotion
          ? 1
          : withdrawing.durationMs ??
            DEFAULT_PROFILES
              .withdrawing
              .durationMs;

      const rawProgress =
        clamp(
          (
            nowMs -
            state.stateEnteredAtMs
          ) /
          Math.max(
            1,
            duration
          ),
          0,
          1
        );

      const eased =
        easeInOutCubic(
          rawProgress
        );

      return {
        scale:
          lerp(
            withdrawing.startScale ??
              DEFAULT_PROFILES
                .withdrawing
                .startScale,

            withdrawing.endScale ??
              DEFAULT_PROFILES
                .withdrawing
                .endScale,

            eased
          ),

        motionOpacity:
          lerp(
            withdrawing
              .motionFieldStartOpacity ??
              withdrawing
                .motionStartOpacity ??
              DEFAULT_PROFILES
                .withdrawing
                .motionStartOpacity,

            withdrawing
              .motionFieldEndOpacity ??
              withdrawing
                .motionEndOpacity ??
              DEFAULT_PROFILES
                .withdrawing
                .motionEndOpacity,

            smoothstep01(
              rawProgress
            )
          ),

        glassTransmission:
          lerp(
            withdrawing
              .glassTransmissionStart ??
              DEFAULT_PROFILES
                .withdrawing
                .glassTransmissionStart,

            withdrawing
              .glassTransmissionEnd ??
              DEFAULT_PROFILES
                .withdrawing
                .glassTransmissionEnd,

            eased
          ),

        glassEmissive:
          lerp(
            focused
              .glassEmissiveMultiplier ??
              DEFAULT_PROFILES
                .focused
                .glassEmissive,

            dormant
              .glassEmissiveMultiplier ??
              DEFAULT_PROFILES
                .dormant
                .glassEmissive,

            eased
          ),

        frameHighlight:
          lerp(
            withdrawing
              .frameHighlightStart ??
              DEFAULT_PROFILES
                .withdrawing
                .frameHighlightStart,

            withdrawing
              .frameHighlightEnd ??
              DEFAULT_PROFILES
                .withdrawing
                .frameHighlightEnd,

            eased
          ),

        leadContrast:
          lerp(
            withdrawing
              .leadContrastStart ??
              DEFAULT_PROFILES
                .withdrawing
                .leadContrastStart,

            withdrawing
              .leadContrastEnd ??
              DEFAULT_PROFILES
                .withdrawing
                .leadContrastEnd,

            eased
          ),

        parallax:
          1 -
          eased,

        revealProgress:
          1 -
          rawProgress
      };
    }

    if (
      state.currentState ===
      STATES.NAVIGATING
    ) {
      return {
        scale:
          navigating.scale ??
          DEFAULT_PROFILES
            .navigating.scale,

        motionOpacity:
          state.reducedMotion
            ? 0.42
            : navigating
                .motionFieldOpacity ??
              navigating
                .motionOpacity ??
              DEFAULT_PROFILES
                .navigating
                .motionOpacity,

        glassTransmission:
          navigating
            .glassTransmissionMultiplier ??
          DEFAULT_PROFILES
            .navigating
            .glassTransmission,

        glassEmissive:
          navigating
            .glassEmissiveMultiplier ??
          DEFAULT_PROFILES
            .navigating
            .glassEmissive,

        frameHighlight:
          navigating
            .frameHighlightMultiplier ??
          DEFAULT_PROFILES
            .navigating
            .frameHighlight,

        leadContrast:
          navigating
            .leadContrastMultiplier ??
          DEFAULT_PROFILES
            .navigating
            .leadContrast,

        parallax:
          1,

        revealProgress:
          1
      };
    }

    return {
      scale:
        focused.scale ??
        DEFAULT_PROFILES
          .focused.scale,

      motionOpacity:
        state.reducedMotion
          ? 0.42
          : focused
              .motionFieldOpacity ??
            focused.motionOpacity ??
            DEFAULT_PROFILES
              .focused
              .motionOpacity,

      glassTransmission:
        focused
          .glassTransmissionMultiplier ??
        DEFAULT_PROFILES
          .focused
          .glassTransmission,

      glassEmissive:
        focused
          .glassEmissiveMultiplier ??
        DEFAULT_PROFILES
          .focused
          .glassEmissive,

      frameHighlight:
        focused
          .frameHighlightMultiplier ??
        DEFAULT_PROFILES
          .focused
          .frameHighlight,

      leadContrast:
        focused
          .leadContrastMultiplier ??
        DEFAULT_PROFILES
          .focused
          .leadContrast,

      parallax:
        state.reducedMotion
          ? 0
          : 1,

      revealProgress:
        1
    };
  }

  function emitTransitionComplete() {
    if (
      state.transitionCompletionEmitted
    ) {
      return;
    }

    const completionId =
      String(
        state.activeTransitionId ||
        readTransitionId()
      );

    if (!completionId) {
      fail(
        state.currentState ===
          STATES.WITHDRAWING
          ? "withdrawal"
          : "reveal",
        "MIRRORLAND_WINDOW_COMPLETION_ID_MISSING",
        {},
        {
          reasonCode:
            "MIRRORLAND_WINDOW_COMPLETION_ID_MISSING"
        }
      );

      return;
    }

    const completionState =
      state.currentState ===
        STATES.WITHDRAWING
        ? STATES.DORMANT
        : STATES.FOCUSED;

    const eventName =
      state.currentState ===
        STATES.WITHDRAWING
        ? CONTROLLER_EVENTS
            .WITHDRAWAL_COMPLETE
        : CONTROLLER_EVENTS
            .REVEAL_COMPLETE;

    const key =
      [
        eventName,
        completionId
      ].join(":");

    if (
      state.lastCompletedTransitionKey ===
      key
    ) {
      return;
    }

    state.transitionCompletionEmitted =
      true;

    state.lastCompletedTransitionKey =
      key;

    const controllerPayload =
      controllerDetail(
        completionState,
        completionId
      );

    dispatch(
      eventName,
      controllerPayload
    );

    const telemetryPayload =
      Object.freeze({
        contractId:
          CONTRACT.id,

        source:
          CONTRACT.source,

        transitionState:
          state.currentState,

        windowState:
          completionState,

        completionId,

        previousState:
          state.previousState,

        scale:
          state.currentProfile.scale,

        motionOpacity:
          state.currentProfile
            .motionOpacity
      });

    dispatch(
      TELEMETRY_EVENTS
        .TRANSITION_COMPLETE,
      telemetryPayload
    );

    emitReceipt(
      {
        lastControllerCompletionEvent:
          eventName,

        lastTransitionCompletion:
          telemetryPayload
      },
      true
    );
  }

  function updateProfile(nowMs) {
    state.currentProfile =
      profileForState(
        nowMs
      );

    if (
      state.currentState ===
        STATES.REVEALING &&
      state.currentProfile
        .revealProgress >=
        1 -
        QUALITY
          .transitionCompletionTolerance
    ) {
      emitTransitionComplete();
    }

    if (
      state.currentState ===
        STATES.WITHDRAWING &&
      state.currentProfile
        .revealProgress <=
        QUALITY
          .transitionCompletionTolerance
    ) {
      emitTransitionComplete();
    }
  }

  function updatePointerParallax() {
    const amount =
      state.currentProfile.parallax;

    const targetX =
      state.reducedMotion
        ? 0
        : state.pointer.targetX *
          amount;

    const targetY =
      state.reducedMotion
        ? 0
        : state.pointer.targetY *
          amount;

    state.pointer.x =
      lerp(
        state.pointer.x,
        targetX,
        0.055
      );

    state.pointer.y =
      lerp(
        state.pointer.y,
        targetY,
        0.055
      );
  }

  function resize() {
    const rect =
      state.canvas
        .getBoundingClientRect();

    const ratio =
      Math.min(
        globalThis
          .devicePixelRatio ||
        1,

        QUALITY
          .devicePixelRatioCap
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
      state.canvas.width !==
        width ||
      state.canvas.height !==
        height
    ) {
      state.canvas.width =
        width;

      state.canvas.height =
        height;
    }

    state.width =
      width;

    state.height =
      height;

    state.pixelRatio =
      ratio;

    state.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function updateMatrices() {
    const aspect =
      state.width /
      Math.max(
        1,
        state.height
      );

    const cameraZ =
      aspect <
      QUALITY.mobileAspectThreshold
        ? QUALITY.cameraZMobile
        : QUALITY.cameraZDesktop;

    const parallaxX =
      state.pointer.x *
      QUALITY.maximumParallaxX;

    const parallaxY =
      state.pointer.y *
      QUALITY.maximumParallaxY;

    const profileScale =
      state.currentProfile.scale;

    const geometryScale =
      state.geometryMetrics
        .baseFitScale;

    const finalScale =
      profileScale *
      geometryScale;

    const center =
      state.geometryMetrics.center;

    const tiltX =
      state.reducedMotion
        ? 0
        : -parallaxY *
          0.28;

    const tiltY =
      state.reducedMotion
        ? 0
        : parallaxX *
          0.34;

    const centerTranslation =
      translate4(
        -center[0],
        -center[1],
        -center[2]
      );

    const scaled =
      multiply4(
        scale4(
          finalScale,
          finalScale,
          finalScale
        ),
        centerTranslation
      );

    const rotated =
      multiply4(
        rotateY4(
          tiltY
        ),
        multiply4(
          rotateX4(
            tiltX
          ),
          scaled
        )
      );

    state.matrices.model =
      rotated;

    state.matrices.view =
      lookAt4(
        [
          parallaxX,
          parallaxY,
          cameraZ
        ],
        [
          0,
          0,
          0
        ],
        [
          0,
          1,
          0
        ]
      );

    state.matrices.projection =
      perspective4(
        QUALITY
          .fieldOfViewRadians,
        aspect,
        QUALITY.near,
        QUALITY.far
      );
  }

  function bindAttribute(
    gl,
    buffer,
    location,
    size
  ) {
    if (
      location <
      0
    ) {
      return;
    }

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.enableVertexAttribArray(
      location
    );

    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function bindSurfaceResource(
    resource
  ) {
    const gl =
      state.gl;

    const locations =
      state.locations.surface;

    bindAttribute(
      gl,
      resource.position,
      locations.attributes
        .position,
      3
    );

    bindAttribute(
      gl,
      resource.normal,
      locations.attributes
        .normal,
      3
    );

    bindAttribute(
      gl,
      resource.color,
      locations.attributes
        .color,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      resource.index
    );
  }

  function applySurfaceMatrices(
    nowMs
  ) {
    const gl =
      state.gl;

    const uniforms =
      state.locations.surface
        .uniforms;

    gl.uniformMatrix4fv(
      uniforms.model,
      false,
      new Float32Array(
        state.matrices.model
      )
    );

    gl.uniformMatrix4fv(
      uniforms.view,
      false,
      new Float32Array(
        state.matrices.view
      )
    );

    gl.uniformMatrix4fv(
      uniforms.projection,
      false,
      new Float32Array(
        state.matrices
          .projection
      )
    );

    gl.uniformMatrix3fv(
      uniforms.normalMatrix,
      false,
      new Float32Array(
        normalMatrix3(
          state.matrices.model
        )
      )
    );

    gl.uniform1f(
      uniforms.time,
      nowMs *
      0.001
    );

    gl.uniform1f(
      uniforms.revealProgress,
      state.currentProfile
        .revealProgress
    );

    gl.uniform1f(
      uniforms.reducedMotion,
      state.reducedMotion
        ? 1
        : 0
    );

    gl.uniform3f(
      uniforms.keyLight,
      -0.36,
      -0.74,
      -0.62
    );

    gl.uniform3f(
      uniforms.fillLight,
      0.68,
      -0.18,
      -0.48
    );

    gl.uniform3f(
      uniforms.rimLight,
      0.12,
      0.52,
      1
    );
  }

  function drawSurface(
    resource,
    options,
    nowMs
  ) {
    const gl =
      state.gl;

    const program =
      state.programs.surface;

    const uniforms =
      state.locations.surface
        .uniforms;

    gl.useProgram(
      program
    );

    bindSurfaceResource(
      resource
    );

    applySurfaceMatrices(
      nowMs
    );

    gl.uniform1f(
      uniforms.materialKind,
      options.materialKind
    );

    gl.uniform1f(
      uniforms.opacity,
      options.opacity
    );

    gl.uniform1f(
      uniforms.transmission,
      options.transmission
    );

    gl.uniform1f(
      uniforms.emissive,
      options.emissive
    );

    gl.uniform1f(
      uniforms.highlight,
      options.highlight
    );

    gl.uniform1f(
      uniforms.contrast,
      options.contrast
    );

    gl.drawElements(
      gl.TRIANGLES,
      resource.indexCount,
      resource.indexType,
      0
    );

    return 1;
  }

  function applyMaskMatrices() {
    const gl =
      state.gl;

    const uniforms =
      state.locations.mask
        .uniforms;

    gl.uniformMatrix4fv(
      uniforms.model,
      false,
      new Float32Array(
        state.matrices.model
      )
    );

    gl.uniformMatrix4fv(
      uniforms.view,
      false,
      new Float32Array(
        state.matrices.view
      )
    );

    gl.uniformMatrix4fv(
      uniforms.projection,
      false,
      new Float32Array(
        state.matrices
          .projection
      )
    );
  }

  function drawApertureStencil() {
    if (
      !state.capabilities
        .stencilAvailable
    ) {
      return 0;
    }

    const gl =
      state.gl;

    const resource =
      state.resources.aperture;

    const program =
      state.programs.mask;

    const locations =
      state.locations.mask;

    gl.enable(
      gl.STENCIL_TEST
    );

    gl.stencilMask(
      0xFF
    );

    gl.stencilFunc(
      gl.ALWAYS,
      1,
      0xFF
    );

    gl.stencilOp(
      gl.KEEP,
      gl.KEEP,
      gl.REPLACE
    );

    gl.colorMask(
      false,
      false,
      false,
      false
    );

    gl.depthMask(
      false
    );

    gl.disable(
      gl.DEPTH_TEST
    );

    gl.disable(
      gl.BLEND
    );

    gl.useProgram(
      program
    );

    bindAttribute(
      gl,
      resource.position,
      locations.attributes
        .position,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      resource.index
    );

    applyMaskMatrices();

    gl.drawElements(
      gl.TRIANGLES,
      resource.indexCount,
      resource.indexType,
      0
    );

    gl.colorMask(
      true,
      true,
      true,
      true
    );

    gl.depthMask(
      true
    );

    gl.stencilMask(
      0x00
    );

    gl.stencilFunc(
      gl.EQUAL,
      1,
      0xFF
    );

    gl.stencilOp(
      gl.KEEP,
      gl.KEEP,
      gl.KEEP
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    return 1;
  }

  function drawMotion(nowMs) {
    const opacity =
      state.currentProfile
        .motionOpacity;

    if (
      opacity <=
      0.001
    ) {
      return 0;
    }

    const gl =
      state.gl;

    const program =
      state.programs.motion;

    const locations =
      state.locations.motion;

    const resource =
      state.resources.motion;

    gl.useProgram(
      program
    );

    bindAttribute(
      gl,
      resource.position,
      locations.attributes
        .position,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      resource.index
    );

    gl.uniformMatrix4fv(
      locations.uniforms.model,
      false,
      new Float32Array(
        state.matrices.model
      )
    );

    gl.uniformMatrix4fv(
      locations.uniforms.view,
      false,
      new Float32Array(
        state.matrices.view
      )
    );

    gl.uniformMatrix4fv(
      locations.uniforms
        .projection,
      false,
      new Float32Array(
        state.matrices
          .projection
      )
    );

    gl.uniform2f(
      locations.uniforms
        .motionCenter,
      state.geometryMetrics
        .motionCenter[0],
      state.geometryMetrics
        .motionCenter[1]
    );

    gl.uniform2f(
      locations.uniforms
        .motionHalfExtent,
      state.geometryMetrics
        .motionHalfExtent[0],
      state.geometryMetrics
        .motionHalfExtent[1]
    );

    gl.uniform1f(
      locations.uniforms.time,
      nowMs *
      0.001
    );

    gl.uniform1f(
      locations.uniforms.opacity,
      opacity
    );

    gl.uniform1f(
      locations.uniforms
        .reducedMotion,
      state.reducedMotion
        ? 1
        : 0
    );

    gl.uniform1f(
      locations.uniforms
        .revealProgress,
      state.currentProfile
        .revealProgress
    );

    gl.uniform1f(
      locations.uniforms
        .fragmentClipEnabled,
      state.capabilities
        .stencilAvailable
        ? 0
        : 1
    );

    gl.uniform2f(
      locations.uniforms
        .parallax,
      state.pointer.x *
      0.018,
      state.pointer.y *
      0.014
    );

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.disable(
      gl.DEPTH_TEST
    );

    gl.depthMask(
      false
    );

    gl.drawElements(
      gl.TRIANGLES,
      resource.indexCount,
      resource.indexType,
      0
    );

    gl.depthMask(
      true
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    return 1;
  }

  function glErrorName(code) {
    const gl =
      state.gl;

    const names =
      new Map([
        [
          gl.NO_ERROR,
          "NO_ERROR"
        ],
        [
          gl.INVALID_ENUM,
          "INVALID_ENUM"
        ],
        [
          gl.INVALID_VALUE,
          "INVALID_VALUE"
        ],
        [
          gl.INVALID_OPERATION,
          "INVALID_OPERATION"
        ],
        [
          gl.OUT_OF_MEMORY,
          "OUT_OF_MEMORY"
        ],
        [
          gl.INVALID_FRAMEBUFFER_OPERATION,
          "INVALID_FRAMEBUFFER_OPERATION"
        ]
      ]);

    return (
      names.get(code) ||
      "GL_ERROR_" +
      String(code)
    );
  }

  function collectGlErrors() {
    const gl =
      state.gl;

    const errors =
      [];

    for (
      let index = 0;
      index <
        QUALITY
          .maximumGlErrorsPerFrame;
      index += 1
    ) {
      const code =
        gl.getError();

      if (
        code ===
        gl.NO_ERROR
      ) {
        break;
      }

      errors.push(
        glErrorName(code)
      );
    }

    return errors;
  }

  function evaluateGlErrors(
    errors
  ) {
    if (
      errors.length ===
      0
    ) {
      state
        .consecutiveGlErrorFrames =
        0;

      return;
    }

    state
      .consecutiveGlErrorFrames +=
      1;

    emitReceipt({
      glError:
        errors.join(","),

      glErrorCodes:
        errors.slice(),

      consecutiveGlErrorFrames:
        state
          .consecutiveGlErrorFrames
    });

    if (
      state
        .consecutiveGlErrorFrames >=
      QUALITY
        .persistentGlErrorThreshold
    ) {
      const stage =
        state.currentState ===
          STATES.REVEALING
          ? "reveal"
          : state.currentState ===
              STATES.WITHDRAWING
            ? "withdrawal"
            : state.currentState ===
                STATES.FOCUSED ||
              state.currentState ===
                STATES.NAVIGATING
              ? "focused"
              : "context";

      fail(
        stage,
        "PERSISTENT_WEBGL_ERROR",
        {
          glError:
            errors.join(","),

          glErrorCodes:
            errors.slice()
        },
        {
          reasonCode:
            "PERSISTENT_WEBGL_ERROR",

          glError:
            errors.join(",")
        }
      );
    }
  }

  function renderScene(nowMs) {
    const gl =
      state.gl;

    resize();
    updateMatrices();

    gl.clearColor(
      0,
      0,
      0,
      0
    );

    if (
      state.capabilities
        .stencilAvailable
    ) {
      gl.clearStencil(
        0
      );

      gl.clear(
        gl.COLOR_BUFFER_BIT |
        gl.DEPTH_BUFFER_BIT |
        gl.STENCIL_BUFFER_BIT
      );
    } else {
      gl.clear(
        gl.COLOR_BUFFER_BIT |
        gl.DEPTH_BUFFER_BIT
      );
    }

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthFunc(
      gl.LEQUAL
    );

    gl.disable(
      gl.CULL_FACE
    );

    let frameDrawCalls =
      0;

    let leadDrawCalls =
      0;

    let glassDrawCalls =
      0;

    let motionDrawCalls =
      0;

    let stencilDrawCalls =
      0;

    if (
      state.capabilities
        .stencilAvailable
    ) {
      stencilDrawCalls +=
        drawApertureStencil();
    } else {
      gl.disable(
        gl.STENCIL_TEST
      );
    }

    motionDrawCalls +=
      drawMotion(
        nowMs
      );

    gl.disable(
      gl.STENCIL_TEST
    );

    gl.stencilMask(
      0xFF
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthMask(
      true
    );

    gl.disable(
      gl.BLEND
    );

    frameDrawCalls +=
      drawSurface(
        state.resources.frame,
        {
          materialKind:
            0,

          opacity:
            1,

          transmission:
            0,

          emissive:
            0,

          highlight:
            state.currentProfile
              .frameHighlight,

          contrast:
            1
        },
        nowMs
      );

    leadDrawCalls +=
      drawSurface(
        state.resources.lead,
        {
          materialKind:
            1,

          opacity:
            1,

          transmission:
            0,

          emissive:
            0,

          highlight:
            0.42,

          contrast:
            state.currentProfile
              .leadContrast
        },
        nowMs
      );

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.depthMask(
      false
    );

    glassDrawCalls +=
      drawSurface(
        state.resources.glass,
        {
          materialKind:
            2,

          opacity:
            0.88,

          transmission:
            state.currentProfile
              .glassTransmission,

          emissive:
            state.currentProfile
              .glassEmissive,

          highlight:
            state.currentProfile
              .frameHighlight,

          contrast:
            1
        },
        nowMs
      );

    gl.depthMask(
      true
    );

    const drawCalls =
      frameDrawCalls +
      leadDrawCalls +
      glassDrawCalls +
      motionDrawCalls +
      stencilDrawCalls;

    const errors =
      collectGlErrors();

    emitReceipt({
      rendererInitialized:
        true,

      rendererAvailable:
        true,

      renderLoopStatus:
        state.running
          ? "active"
          : "single-frame",

      drawCallsLastFrame:
        drawCalls,

      frameDrawCallsLastFrame:
        frameDrawCalls,

      leadDrawCallsLastFrame:
        leadDrawCalls,

      glassDrawCallsLastFrame:
        glassDrawCalls,

      motionDrawCallsLastFrame:
        motionDrawCalls,

      stencilDrawCallsLastFrame:
        stencilDrawCalls,

      apertureDrawnAsOpaqueForeground:
        false,

      reducedMotionUsesStaticRearLight:
        state.reducedMotion &&
        state.currentProfile
          .motionOpacity >
          0.001,

      glError:
        errors.length ===
        0
          ? "NO_ERROR"
          : errors.join(","),

      glErrorCodes:
        errors.slice(),

      failureReason:
        null,

      failureReasonCode:
        null
    });

    evaluateGlErrors(
      errors
    );
  }

  function shouldAnimateContinuously() {
    if (
      state.currentState ===
        STATES.REVEALING ||
      state.currentState ===
        STATES.WITHDRAWING
    ) {
      return true;
    }

    if (
      (
        state.currentState ===
          STATES.FOCUSED ||
        state.currentState ===
          STATES.NAVIGATING
      ) &&
      !state.reducedMotion
    ) {
      return true;
    }

    return false;
  }

  function renderOnce(nowMs) {
    if (
      state.held ||
      !state.gl
    ) {
      return;
    }

    readControllerState(
      nowMs
    );

    updateProfile(
      nowMs
    );

    updatePointerParallax();

    renderScene(
      nowMs
    );
  }

  function render(nowMs) {
    if (
      !state.running ||
      state.held
    ) {
      return;
    }

    const desiredInterval =
      shouldAnimateContinuously()
        ? QUALITY
            .activeFrameIntervalMs
        : QUALITY
            .idleFrameIntervalMs;

    if (
      state.lastRenderMs &&
      nowMs -
        state.lastRenderMs <
        desiredInterval
    ) {
      state.raf =
        requestAnimationFrame(
          render
        );

      return;
    }

    state.lastRenderMs =
      nowMs;

    try {
      renderOnce(
        nowMs
      );
    } catch (error) {
      const stage =
        state.currentState ===
          STATES.REVEALING
          ? "reveal"
          : state.currentState ===
              STATES.WITHDRAWING
            ? "withdrawal"
            : state.currentState ===
                STATES.FOCUSED ||
              state.currentState ===
                STATES.NAVIGATING
              ? "focused"
              : "context";

      fail(
        stage,
        "MIRRORLAND_WINDOW_RENDER_LOOP_FAILURE:" +
        (
          error &&
          error.message
            ? error.message
            : String(
                error
              )
        ),
        {},
        {
          reasonCode:
            "MIRRORLAND_WINDOW_RENDER_LOOP_FAILURE"
        }
      );

      return;
    }

    if (
      state.running &&
      !state.held
    ) {
      state.raf =
        requestAnimationFrame(
          render
        );
    }
  }

  function bindPointerParallax() {
    const surface =
      state.scene ||
      state.mount;

    if (!surface) {
      return;
    }

    surface.addEventListener(
      "pointermove",
      (event) => {
        if (
          state.currentState ===
            STATES.DORMANT ||
          state.reducedMotion
        ) {
          state.pointer.targetX =
            0;

          state.pointer.targetY =
            0;

          return;
        }

        const rect =
          surface
            .getBoundingClientRect();

        const normalizedX =
          (
            event.clientX -
            rect.left
          ) /
          Math.max(
            1,
            rect.width
          ) *
          2 -
          1;

        const normalizedY =
          (
            event.clientY -
            rect.top
          ) /
          Math.max(
            1,
            rect.height
          ) *
          2 -
          1;

        state.pointer.targetX =
          clamp(
            normalizedX,
            -1,
            1
          );

        state.pointer.targetY =
          clamp(
            -normalizedY,
            -1,
            1
          );
      },
      {
        passive:
          true
      }
    );

    surface.addEventListener(
      "pointerleave",
      () => {
        state.pointer.targetX =
          0;

        state.pointer.targetY =
          0;
      },
      {
        passive:
          true
      }
    );
  }

  function handleHeldStateChange() {
    const requestedState =
      normalizeState(
        state.root.dataset
          .mirrorlandWindowState
      );

    state.previousState =
      state.currentState;

    state.currentState =
      requestedState;

    if (
      requestedState ===
        STATES.REVEALING ||
      requestedState ===
        STATES.WITHDRAWING
    ) {
      state.activeTransitionId =
        readTransitionId();

      emitControllerFailure(
        RECEIPT.failureReasonCode ||
        "MIRRORLAND_WINDOW_RENDERER_HELD",
        requestedState ===
          STATES.WITHDRAWING
          ? "withdrawal"
          : "reveal",
        RECEIPT.glError ===
          "not-checked"
          ? null
          : RECEIPT.glError
      );
    }
  }

  function bindStateObserver() {
    if (
      !state.root ||
      state.resources
        .stateObserver
    ) {
      return;
    }

    const observer =
      new MutationObserver(
        (mutations) => {
          const relevant =
            mutations.some(
              (mutation) =>
                mutation.type ===
                  "attributes" &&
                (
                  mutation.attributeName ===
                    "data-mirrorland-window-state" ||
                  mutation.attributeName ===
                    "data-mirrorland-transition-id" ||
                  mutation.attributeName ===
                    "data-reduced-motion"
                )
            );

          if (!relevant) {
            return;
          }

          if (state.held) {
            handleHeldStateChange();
            return;
          }

          if (
            !state.running &&
            state.gl
          ) {
            try {
              renderOnce(
                performance.now()
              );
            } catch (error) {
              fail(
                "context",
                "MIRRORLAND_WINDOW_OBSERVER_RENDER_FAILURE:" +
                (
                  error &&
                  error.message
                    ? error.message
                    : String(
                        error
                      )
                ),
                {},
                {
                  reasonCode:
                    "MIRRORLAND_WINDOW_OBSERVER_RENDER_FAILURE"
                }
              );
            }
          }
        }
      );

    observer.observe(
      state.root,
      {
        attributes:
          true,

        attributeFilter: [
          "data-mirrorland-window-state",
          "data-mirrorland-transition-id",
          "data-reduced-motion"
        ]
      }
    );

    state.resources.stateObserver =
      observer;
  }

  function bindContextLifecycle() {
    state.canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();

        state.running =
          false;

        cancelAnimationFrame(
          state.raf
        );

        fail(
          "context",
          "WEBGL_CONTEXT_LOST",
          {
            webglStatus:
              "lost"
          },
          {
            reasonCode:
              "WEBGL_CONTEXT_LOST"
          }
        );
      }
    );

    state.canvas.addEventListener(
      "webglcontextrestored",
      () => {
        state.held =
          true;

        showFallbackGlint();

        emitReceipt(
          {
            webglStatus:
              "restored",

            renderLoopStatus:
              "reload-required",

            failureReason:
              "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED",

            failureReasonCode:
              "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED"
          },
          true
        );

        emitControllerFailure(
          "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED",
          "context",
          null
        );
      }
    );
  }

  function deleteResource(
    resource
  ) {
    if (
      !resource ||
      !state.gl
    ) {
      return;
    }

    [
      "position",
      "normal",
      "color",
      "index"
    ].forEach(
      (field) => {
        if (resource[field]) {
          state.gl.deleteBuffer(
            resource[field]
          );
        }
      }
    );
  }

  function dispose() {
    state.running =
      false;

    cancelAnimationFrame(
      state.raf
    );

    if (
      state.resources
        .stateObserver
    ) {
      state.resources
        .stateObserver
        .disconnect();

      state.resources.stateObserver =
        null;
    }

    if (state.gl) {
      [
        "frame",
        "lead",
        "glass",
        "aperture",
        "motion"
      ].forEach(
        (key) => {
          deleteResource(
            state.resources[key]
          );
        }
      );

      [
        "surface",
        "mask",
        "motion"
      ].forEach(
        (key) => {
          if (
            state.programs[key]
          ) {
            state.gl.deleteProgram(
              state.programs[key]
            );
          }
        }
      );
    }

    emitReceipt(
      {
        rendererInitialized:
          false,

        rendererAvailable:
          false,

        renderLoopStatus:
          "disposed"
      },
      true
    );
  }

  function initializeDom() {
    state.root =
      findRoot();

    if (!state.root) {
      throw Object.assign(
        new Error(
          "MISSING_COMPASS_ROOT"
        ),
        {
          stage:
            "initialization",

          reasonCode:
            "MISSING_COMPASS_ROOT"
        }
      );
    }

    state.scene =
      qs(
        [
          "[data-compass-scene]",
          ".compass-scene"
        ],
        state.root
      );

    state.mount =
      qs(
        [
          "[data-compass-mirrorland-window-mount]",
          ".compass-scene__mirrorland-window"
        ],
        state.root
      );

    if (!state.scene) {
      throw Object.assign(
        new Error(
          "MISSING_COMPASS_SCENE"
        ),
        {
          stage:
            "initialization",

          reasonCode:
            "MISSING_COMPASS_SCENE"
        }
      );
    }

    if (!state.mount) {
      throw Object.assign(
        new Error(
          "MISSING_MIRRORLAND_WINDOW_MOUNT"
        ),
        {
          stage:
            "initialization",

          reasonCode:
            "MISSING_MIRRORLAND_WINDOW_MOUNT"
        }
      );
    }

    ensureFallbackGlint();
  }

  function initializeWebGl() {
    state.canvas =
      ensureCanvas(
        state.mount
      );

    emitReceipt({
      canvasStatus:
        "created-or-found"
    });

    state.gl =
      createContext(
        state.canvas
      );

    if (!state.gl) {
      throw Object.assign(
        new Error(
          "WEBGL_CONTEXT_UNAVAILABLE"
        ),
        {
          stage:
            "initialization",

          reasonCode:
            "WEBGL_CONTEXT_UNAVAILABLE"
        }
      );
    }

    const stencilBits =
      Number(
        state.gl.getParameter(
          state.gl.STENCIL_BITS
        )
      ) ||
      0;

    state.capabilities
      .stencilBits =
      stencilBits;

    state.capabilities
      .stencilAvailable =
      stencilBits >=
      1;

    state.capabilities
      .maskMode =
      state.capabilities
        .stencilAvailable
        ? MASK_MODES.STENCIL
        : MASK_MODES
            .FRAGMENT_CLIP;

    emitReceipt({
      webglStatus:
        "acquired",

      stencilStatus:
        state.capabilities
          .stencilAvailable
          ? "available:" +
            stencilBits
          : "unavailable-fragment-fallback",

      stencilAvailable:
        state.capabilities
          .stencilAvailable,

      stencilBits,

      apertureMaskMode:
        state.capabilities
          .maskMode
    });

    bindContextLifecycle();

    state.gl.enable(
      state.gl.DEPTH_TEST
    );

    state.gl.depthFunc(
      state.gl.LEQUAL
    );

    state.gl.disable(
      state.gl.CULL_FACE
    );

    buildPrograms(
      state.gl
    );

    emitReceipt({
      shaderStatus:
        "compiled-and-linked"
    });

    buildResources(
      state.gl
    );
  }

  function init() {
    exposeApi();

    try {
      initializeDom();

      state.geometryObject =
        resolveGeometryObject();

      emitReceipt({
        geometryObjectFound:
          true,

        geometryObjectValidated:
          true,

        geometryValidationResult:
          state.geometryObject
            .validation.result,

        geometryValidationReceipt:
          safeSnapshot(
            state.geometryObject
              .validation
          )
      });

      initializeWebGl();

      bindPointerParallax();
      bindStateObserver();

      state.currentState =
        normalizeState(
          state.root.dataset
            .mirrorlandWindowState
        );

      state.previousState =
        "";

      state.stateEnteredAtMs =
        performance.now();

      state.activeTransitionId =
        (
          state.currentState ===
            STATES.REVEALING ||
          state.currentState ===
            STATES.WITHDRAWING
        )
          ? readTransitionId()
          : "";

      state.reducedMotion =
        (
          typeof globalThis
            .matchMedia ===
            "function" &&
          globalThis.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
        ) ||
        state.root.dataset
          .reducedMotion ===
          "true";

      state.held =
        false;

      state.running =
        true;

      hideFallbackGlint();

      state.raf =
        requestAnimationFrame(
          render
        );

      emitReceipt(
        {
          rendererInitialized:
            true,

          rendererAvailable:
            true,

          renderLoopStatus:
            "active",

          failureStage:
            null,

          failureReason:
            null,

          failureReasonCode:
            null
        },
        true
      );

      dispatch(
        TELEMETRY_EVENTS.READY,
        Object.freeze({
          contractId:
            CONTRACT.id,

          source:
            CONTRACT.source,

          geometryObjectId:
            CONTRACT.geometryObjectId,

          state:
            state.currentState,

          reducedMotion:
            state.reducedMotion,

          stencilAvailable:
            state.capabilities
              .stencilAvailable,

          apertureMaskMode:
            state.capabilities
              .maskMode
        })
      );
    } catch (error) {
      const stage =
        error &&
        error.stage
          ? error.stage
          : "initialization";

      const reasonCode =
        error &&
        error.reasonCode
          ? error.reasonCode
          : "MIRRORLAND_WINDOW_INIT_FAILURE";

      const message =
        error &&
        error.message
          ? error.message
          : String(
              error
            );

      if (!state.root) {
        RECEIPT.failureStage =
          stage;

        RECEIPT.failureReason =
          "MIRRORLAND_WINDOW_INIT_FAILURE:" +
          message;

        RECEIPT.failureReasonCode =
          boundedReasonCode(
            reasonCode
          );

        globalThis
          .DGB_COMPASS_MIRRORLAND_WINDOW_RECEIPT =
          Object.freeze({
            ...RECEIPT
          });

        return;
      }

      if (state.mount) {
        showFallbackGlint();
      }

      if (
        !state.resources
          .stateObserver
      ) {
        bindStateObserver();
      }

      fail(
        stage,
        "MIRRORLAND_WINDOW_INIT_FAILURE:" +
        message,
        {
          geometryFailureDetail:
            error &&
            error.geometryDetail
              ? safeSnapshot(
                  error.geometryDetail
                )
              : null,

          geometryValidationReceipt:
            RECEIPT
              .geometryValidationReceipt,

          geometryValidationResult:
            RECEIPT
              .geometryValidationResult
        },
        {
          reasonCode
        }
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
        once:
          true
      }
    );
  } else {
    init();
  }
})();
