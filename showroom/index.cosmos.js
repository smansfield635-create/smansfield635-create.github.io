/* TARGET FILE: /showroom/index.cosmos.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_COSMOS_HARDENED_v2_IRREGULAR_STARFIELD_DUAL_SPACECRAFT */

/*
  Showroom — Autonomous cosmic atmosphere and dual spacecraft engine.

  Contract:
  - Creates one inert fixed 2D canvas behind the Showroom estate.
  - Creates two inert SVG spacecraft with independent randomized cubic Bézier flights.
  - Replaces geometric-looking star placement with an irregular natural star field.
  - Preserves stars, deep dust, glints, sparkles, rare meteors, adaptive quality,
    capped device-pixel ratio, and 30 FPS pacing.
  - Treats reduced motion as environmental authority.
  - Suspends dynamic work on document visibility loss, pagehide,
    reduced motion, failure, and destruction.
  - Does not suspend merely because the constellation scrolls out of view.
  - Fails independently without changing controller, compositor, crystals,
    interactions, Diamond, Window, semantic controls, or navigation.
  - Supports partial-initialization rollback and complete destruction.

  Public surfaces:
  - window.SHOWROOM_COSMOS
  - window.SHOWROOM_COSMOS_RECEIPT

  Events:
  - SHOWROOM_REDUCED_MOTION_CHANGE
  - SHOWROOM_COSMOS_FAILURE
  - SHOWROOM_COSMOS_READY
  - SHOWROOM_COSMOS_DESTROYED

  Generated surfaces:
  - #showroom-cosmos-runtime-style
  - #showroom-cosmos-layer
  - #showroom-cosmos-canvas
  - #showroom-cosmos-spacecraft
  - #showroom-cosmos-spacecraft-secondary

  External CSS note:
  - The static CSS star fallback should be visually reduced separately:
      --showroom-static-star-opacity: 0.18;
*/

(() => {
  "use strict";

  const GLOBAL_KEY =
    "SHOWROOM_COSMOS";

  const RECEIPT_KEY =
    "SHOWROOM_COSMOS_RECEIPT";

  const STYLE_ID =
    "showroom-cosmos-runtime-style";

  const LAYER_ID =
    "showroom-cosmos-layer";

  const CANVAS_ID =
    "showroom-cosmos-canvas";

  const SPACECRAFT_PRIMARY_ID =
    "showroom-cosmos-spacecraft";

  const SPACECRAFT_SECONDARY_ID =
    "showroom-cosmos-spacecraft-secondary";

  const REDUCED_MOTION_EVENT =
    "SHOWROOM_REDUCED_MOTION_CHANGE";

  const FAILURE_EVENT =
    "SHOWROOM_COSMOS_FAILURE";

  const READY_EVENT =
    "SHOWROOM_COSMOS_READY";

  const DESTROYED_EVENT =
    "SHOWROOM_COSMOS_DESTROYED";

  const CONTROLLER_GLOBAL =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  if (
    window[GLOBAL_KEY] &&
    window[GLOBAL_KEY].initialized
  ) {
    return;
  }

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_COSMOS_HARDENED_v2_IRREGULAR_STARFIELD_DUAL_SPACECRAFT",

    previousId:
      "SHOWROOM_COSMOS_HARDENED_v1",

    version:
      "2.0.0",

    file:
      "/showroom/index.cosmos.js",

    releaseId:
      "showroom-cosmos-hardened-v2-irregular-starfield-dual-spacecraft",

    owner:
      "/showroom/index.cosmos.js",

    rendererClass:
      "AUTONOMOUS_FIXED_2D_IRREGULAR_COSMOS_AND_DUAL_SPACECRAFT",

    attachmentSelector:
      "[data-showroom-root]",

    decorative:
      true,

    interactive:
      false,

    compositorParticipant:
      false,

    controllerAuthority:
      false,

    crystalAuthority:
      false,

    gestureAuthority:
      false,

    routeAuthority:
      false,

    diamondAuthority:
      false,

    windowAuthority:
      false,

    pointerAuthority:
      false,

    irregularStarField:
      true,

    dualSpacecraft:
      true,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const CONFIG = Object.freeze({
    selector:
      "[data-showroom-root]",

    receiptSelector:
      "[data-showroom-cosmos-receipt]",

    frameRate:
      30,

    maximumDeltaMs:
      80,

    pixelRatioMaximum:
      1.5,

    pixelRatioMobileMaximum:
      1.25,

    minimumStars:
      95,

    maximumStars:
      300,

    starAreaDivisor:
      7100,

    minimumDust:
      24,

    maximumDust:
      74,

    dustAreaDivisor:
      27500,

    minimumGlints:
      6,

    maximumGlints:
      18,

    minimumSparkles:
      5,

    maximumSparkles:
      14,

    maximumMeteors:
      1,

    meteorSpawnMinimumMs:
      12000,

    meteorSpawnMaximumMs:
      32000,

    spacecraftCandidateCount:
      18,

    spacecraftPathSeparationBias:
      0.32,

    adaptiveCheckIntervalMs:
      5000,

    adaptiveSlowRenderMs:
      8.25,

    adaptiveFastRenderMs:
      3.15,

    adaptiveMinimumQuality:
      0.46,

    adaptiveMaximumQuality:
      1,

    adaptiveStepDown:
      0.12,

    adaptiveStepUp:
      0.05,

    protectedSelectors:
      Object.freeze([
        "[data-showroom-threshold-introduction]",
        "[data-showroom-orbit-scene]",
        "[data-showroom-controller-panel]",
        "[data-showroom-diamond-stage]",
        "[data-showroom-window-layer]",
        "[data-showroom-diamond-controls]",
        ".showroom-diamond-lenses",
        ".showroom-discovery__item",
        ".showroom-footer"
      ])
  });

  const SPACECRAFT_CONFIGS = Object.freeze([
    Object.freeze({
      key:
        "primary",

      id:
        SPACECRAFT_PRIMARY_ID,

      label:
        "primary",

      variant:
        "gold-cyan-cruiser",

      initialDelayMinimumMs:
        5200,

      initialDelayMaximumMs:
        13500,

      delayMinimumMs:
        21000,

      delayMaximumMs:
        54000,

      durationMinimumMs:
        9500,

      durationMaximumMs:
        17500,

      horizontalBias:
        0.72,

      scaleDesktopMinimum:
        0.50,

      scaleDesktopMaximum:
        0.86,

      scaleMobileMinimum:
        0.38,

      scaleMobileMaximum:
        0.64,

      opacityMinimum:
        0.40,

      opacityMaximum:
        0.66
    }),

    Object.freeze({
      key:
        "secondary",

      id:
        SPACECRAFT_SECONDARY_ID,

      label:
        "secondary",

      variant:
        "blue-violet-scout",

      initialDelayMinimumMs:
        12000,

      initialDelayMaximumMs:
        26000,

      delayMinimumMs:
        36000,

      delayMaximumMs:
        82000,

      durationMinimumMs:
        7600,

      durationMaximumMs:
        14500,

      horizontalBias:
        0.58,

      scaleDesktopMinimum:
        0.34,

      scaleDesktopMaximum:
        0.58,

      scaleMobileMinimum:
        0.26,

      scaleMobileMaximum:
        0.46,

      opacityMinimum:
        0.30,

      opacityMaximum:
        0.52
    })
  ]);

  const COLORS = Object.freeze({
    stone:
      "255, 248, 224",

    whiteSoft:
      "231, 238, 246",

    blue:
      "124, 220, 255",

    blueSoft:
      "172, 235, 255",

    gold:
      "232, 199, 119",

    violet:
      "159, 137, 255",

    teal:
      "102, 224, 210",

    dust:
      "188, 213, 226",

    dustBlue:
      "138, 188, 226",

    dustViolet:
      "177, 154, 225"
  });

  const RECEIPT = {
    contract:
      CONTRACT.id,

    contractId:
      CONTRACT.id,

    previousContractId:
      CONTRACT.previousId,

    version:
      CONTRACT.version,

    owner:
      CONTRACT.owner,

    status:
      "pending",

    timestamp:
      new Date().toISOString(),

    initialized:
      false,

    running:
      false,

    suspended:
      false,

    suspensionReasons:
      [],

    destroyed:
      false,

    failed:
      false,

    failureReason:
      null,

    documentVisible:
      !document.hidden,

    pageActive:
      true,

    rootConnected:
      false,

    reducedMotion:
      false,

    reducedMotionSource:
      "startup",

    mediaReducedMotion:
      false,

    rootReducedMotion:
      false,

    controllerAvailable:
      false,

    controllerReducedMotion:
      false,

    layerPresent:
      false,

    canvasPresent:
      false,

    contextPresent:
      false,

    canvasReady:
      false,

    contextReady:
      false,

    spacecraftPresent:
      false,

    spacecraftCount:
      0,

    activeSpacecraftCount:
      0,

    spacecraftTimerCount:
      0,

    viewportWidth:
      0,

    viewportHeight:
      0,

    pixelWidth:
      0,

    pixelHeight:
      0,

    devicePixelRatio:
      1,

    effectiveDevicePixelRatio:
      1,

    mobileMode:
      false,

    targetFps:
      CONFIG.frameRate,

    quality:
      1,

    particleCounts: {
      stars:
        0,

      dust:
        0,

      glints:
        0,

      sparkles:
        0,

      meteors:
        0
    },

    starCount:
      0,

    dustCount:
      0,

    glintCount:
      0,

    sparkleCount:
      0,

    meteorCount:
      0,

    activeMeteor:
      false,

    activeSpacecraft:
      false,

    spacecraftActive:
      false,

    spacecraftTimerActive:
      false,

    animationFrameActive:
      false,

    listenersBound:
      false,

    resizeObserverBound:
      false,

    controllerSubscriptionBound:
      false,

    staticFrameRendered:
      false,

    irregularStarField:
      true,

    dualSpacecraft:
      true,

    controllerMutated:
      false,

    compositorMutated:
      false,

    crystalsMutated:
      false,

    interactionsMutated:
      false,

    diamondMutated:
      false,

    windowMutated:
      false,

    navigationAffected:
      false,

    pointerAuthority:
      false,

    staticFallbackRetained:
      true,

    lastAction:
      "",

    lastFailure:
      null,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  };

  const state = {
    initialized:
      false,

    destroyed:
      false,

    failed:
      false,

    running:
      false,

    suspended:
      false,

    pageActive:
      true,

    documentVisible:
      !document.hidden,

    reducedMotion:
      false,

    suspensionReasons:
      new Set(),

    root:
      null,

    receiptOutput:
      null,

    layer:
      null,

    canvas:
      null,

    context:
      null,

    spacecrafts:
      [],

    createdStyle:
      false,

    createdLayer:
      false,

    width:
      0,

    height:
      0,

    pixelRatio:
      1,

    stars:
      [],

    dust:
      [],

    glints:
      [],

    sparkles:
      [],

    meteors:
      [],

    quality:
      1,

    renderCostSamples:
      [],

    lastAdaptiveCheck:
      0,

    frameHandle:
      0,

    lastFrameTime:
      0,

    accumulatedFrameTime:
      0,

    nextMeteorTime:
      0,

    resizeObserver:
      null,

    motionQuery:
      null,

    controller:
      null,

    controllerFrameUnsubscribe:
      null,

    listenersBound:
      false,

    boundResize:
      null,

    boundVisibility:
      null,

    boundPageHide:
      null,

    boundPageShow:
      null,

    boundMotionChange:
      null,

    boundSharedMotionChange:
      null,

    boundControllerReady:
      null,

    boundControllerFailure:
      null
  };

  const api = {
    initialized:
      false,

    contract:
      CONTRACT,

    start,
    stop,

    suspend(
      reason =
        "api"
    ) {
      return suspendEnvironment(
        `api:${normalizeReason(reason)}`
      );
    },

    resume(
      reason =
        "api"
    ) {
      return resumeEnvironment(
        `api:${normalizeReason(reason)}`
      );
    },

    destroy,

    resize,

    renderStaticFrame:
      drawStaticFrame,

    launchSpacecraft,

    spawnSpacecraft:
      launchSpacecraft,

    cancelSpacecraft(
      keyOrReason =
        "api",
      maybeReason =
        ""
    ) {
      const craft =
        getSpacecraftByKey(
          keyOrReason
        );

      if (craft) {
        return cancelSpacecraftFlight(
          craft,
          false,
          maybeReason || "api"
        );
      }

      return cancelAllSpacecraftFlights(
        String(keyOrReason || "api")
      );
    },

    setReducedMotion(
      value,
      source =
        "api"
    ) {
      return applyReducedMotionChange(
        value === true,
        `api:${normalizeReason(source)}`
      );
    },

    setQuality,

    receipt:
      () =>
        freezePlain({
          ...RECEIPT
        }),

    getState:
      () =>
        freezePlain({
          contract:
            CONTRACT.id,

          initialized:
            state.initialized,

          running:
            state.running,

          suspended:
            state.suspended,

          suspensionReasons:
            Array.from(
              state.suspensionReasons
            ),

          destroyed:
            state.destroyed,

          failed:
            state.failed,

          documentVisible:
            state.documentVisible,

          pageActive:
            state.pageActive,

          rootConnected:
            Boolean(
              state.root &&
              state.root.isConnected
            ),

          reducedMotion:
            state.reducedMotion,

          quality:
            state.quality,

          viewport: {
            width:
              state.width,

            height:
              state.height,

            pixelRatio:
              state.pixelRatio
          },

          spacecrafts:
            state.spacecrafts.map(
              craft => ({
                key:
                  craft.key,

                id:
                  craft.id,

                active:
                  Boolean(
                    craft.flight
                  ),

                timerActive:
                  Boolean(
                    craft.timer
                  )
              })
            ),

          spacecraftActive:
            state.spacecrafts.some(
              craft => Boolean(
                craft.flight
              )
            ),

          spacecraftTimerActive:
            state.spacecrafts.some(
              craft => Boolean(
                craft.timer
              )
            ),

          meteorCount:
            state.meteors.length,

          particleCounts: {
            stars:
              state.stars.length,

            dust:
              state.dust.length,

            glints:
              state.glints.length,

            sparkles:
              state.sparkles.length,

            meteors:
              state.meteors.length
          },

          controllerMutated:
            false,

          compositorMutated:
            false,

          crystalsMutated:
            false,

          interactionsMutated:
            false,

          diamondMutated:
            false,

          windowMutated:
            false,

          navigationAffected:
            false,

          pointerAuthority:
            false
        })
  };

  window[GLOBAL_KEY] =
    api;

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

  function random(
    minimum,
    maximum
  ) {
    return (
      minimum +
      Math.random() *
      (
        maximum -
        minimum
      )
    );
  }

  function randomChoice(
    values
  ) {
    return values[
      Math.floor(
        Math.random() *
        values.length
      )
    ];
  }

  function randomSign() {
    return Math.random() <
      0.5
      ? -1
      : 1;
  }

  function normalizeReason(
    value
  ) {
    return String(
      value == null
        ? ""
        : value
    ).trim() ||
      "unspecified";
  }

  function nowIso() {
    return new Date()
      .toISOString();
  }

  function freezePlain(
    value
  ) {
    if (
      value === null ||
      typeof value !==
        "object"
    ) {
      return value;
    }

    if (
      Array.isArray(value)
    ) {
      return Object.freeze(
        value.map(
          freezePlain
        )
      );
    }

    const output = {};

    for (
      const [
        key,
        entry
      ] of Object.entries(
        value
      )
    ) {
      output[key] =
        freezePlain(entry);
    }

    return Object.freeze(
      output
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

  function dispatch(
    eventName,
    detail = {}
  ) {
    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail:
            freezePlain({
              contract:
                CONTRACT.id,

              previousContract:
                CONTRACT.previousId,

              version:
                CONTRACT.version,

              owner:
                CONTRACT.owner,

              timestamp:
                nowIso(),

              controllerMutated:
                false,

              compositorMutated:
                false,

              crystalsMutated:
                false,

              interactionsMutated:
                false,

              diamondMutated:
                false,

              windowMutated:
                false,

              navigationAffected:
                false,

              pointerAuthority:
                false,

              ...detail
            })
        }
      )
    );
  }

  function resolveReceiptOutput() {
    state.receiptOutput =
      state.root
        ? state.root.querySelector(
            CONFIG.receiptSelector
          )
        : document.querySelector(
            CONFIG.receiptSelector
          );
  }

  function spacecraftActiveCount() {
    return state.spacecrafts.filter(
      craft => Boolean(
        craft.flight
      )
    ).length;
  }

  function spacecraftTimerCount() {
    return state.spacecrafts.filter(
      craft => Boolean(
        craft.timer
      )
    ).length;
  }

  function emitReceipt(
    extra = {}
  ) {
    const rootConnected =
      Boolean(
        state.root &&
        state.root.isConnected
      );

    const controllerAvailable =
      Boolean(
        resolveController(
          false
        )
      );

    const mediaMotion =
      mediaReducedMotion();

    const rootMotion =
      rootReducedMotion();

    const controllerMotion =
      controllerReducedMotion();

    Object.assign(
      RECEIPT,
      {
        contract:
          CONTRACT.id,

        contractId:
          CONTRACT.id,

        previousContractId:
          CONTRACT.previousId,

        version:
          CONTRACT.version,

        owner:
          CONTRACT.owner,

        status:
          state.destroyed
            ? "destroyed"
            : state.failed
              ? "held"
              : state.initialized
                ? "available"
                : "pending",

        timestamp:
          nowIso(),

        initialized:
          state.initialized,

        running:
          state.running,

        suspended:
          state.suspended,

        suspensionReasons:
          Array.from(
            state.suspensionReasons
          ),

        destroyed:
          state.destroyed,

        failed:
          state.failed,

        failureReason:
          state.failed
            ? RECEIPT.lastFailure
            : null,

        documentVisible:
          state.documentVisible,

        pageActive:
          state.pageActive,

        rootConnected,

        reducedMotion:
          state.reducedMotion,

        mediaReducedMotion:
          mediaMotion,

        rootReducedMotion:
          rootMotion,

        controllerAvailable,

        controllerReducedMotion:
          controllerMotion,

        layerPresent:
          Boolean(
            state.layer
          ),

        canvasPresent:
          Boolean(
            state.canvas
          ),

        contextPresent:
          Boolean(
            state.context
          ),

        canvasReady:
          Boolean(
            state.canvas &&
            state.canvas.width >
              0 &&
            state.canvas.height >
              0
          ),

        contextReady:
          Boolean(
            state.context
          ),

        spacecraftPresent:
          state.spacecrafts.length >
          0,

        spacecraftCount:
          state.spacecrafts.length,

        activeSpacecraftCount:
          spacecraftActiveCount(),

        spacecraftTimerCount:
          spacecraftTimerCount(),

        viewportWidth:
          state.width,

        viewportHeight:
          state.height,

        pixelWidth:
          state.canvas
            ? state.canvas.width
            : 0,

        pixelHeight:
          state.canvas
            ? state.canvas.height
            : 0,

        devicePixelRatio:
          window.devicePixelRatio ||
          1,

        effectiveDevicePixelRatio:
          state.pixelRatio,

        mobileMode:
          state.width <=
          820,

        targetFps:
          CONFIG.frameRate,

        particleCounts: {
          stars:
            state.stars.length,

          dust:
            state.dust.length,

          glints:
            state.glints.length,

          sparkles:
            state.sparkles.length,

          meteors:
            state.meteors.length
        },

        starCount:
          state.stars.length,

        dustCount:
          state.dust.length,

        glintCount:
          state.glints.length,

        sparkleCount:
          state.sparkles.length,

        meteorCount:
          state.meteors.length,

        activeMeteor:
          state.meteors.length >
          0,

        activeSpacecraft:
          spacecraftActiveCount() >
          0,

        spacecraftActive:
          spacecraftActiveCount() >
          0,

        spacecraftTimerActive:
          spacecraftTimerCount() >
          0,

        animationFrameActive:
          Boolean(
            state.frameHandle
          ),

        quality:
          state.quality,

        listenersBound:
          state.listenersBound,

        resizeObserverBound:
          Boolean(
            state.resizeObserver
          ),

        controllerSubscriptionBound:
          typeof state
            .controllerFrameUnsubscribe ===
          "function",

        irregularStarField:
          true,

        dualSpacecraft:
          true,

        controllerMutated:
          false,

        compositorMutated:
          false,

        crystalsMutated:
          false,

        interactionsMutated:
          false,

        diamondMutated:
          false,

        windowMutated:
          false,

        navigationAffected:
          false,

        pointerAuthority:
          false,

        staticFallbackRetained:
          true,

        visualPassClaimed:
          false,

        productionAuthorized:
          false,

        deploymentAuthorized:
          false
      },

      extra
    );

    const snapshot =
      freezePlain({
        ...RECEIPT,

        particleCounts: {
          ...RECEIPT
            .particleCounts
        },

        suspensionReasons: [
          ...RECEIPT
            .suspensionReasons
        ],

        spacecrafts:
          state.spacecrafts.map(
            craft => ({
              key:
                craft.key,

              id:
                craft.id,

              variant:
                craft.variant,

              active:
                Boolean(
                  craft.flight
                ),

              timerActive:
                Boolean(
                  craft.timer
                )
            })
          )
      });

    const serialized =
      JSON.stringify(
        snapshot
      );

    if (
      state.root &&
      state.root.dataset
    ) {
      state.root.dataset
        .showroomCosmosReceipt =
        serialized;

      state.root.dataset
        .showroomCosmosStatus =
        snapshot.status;

      state.root.dataset
        .showroomCosmosReducedMotion =
        state.reducedMotion
          ? "true"
          : "false";

      state.root.dataset
        .showroomCosmosRunning =
        state.running
          ? "true"
          : "false";

      state.root.dataset
        .showroomCosmosSuspended =
        state.suspended
          ? "true"
          : "false";

      state.root.dataset
        .showroomCosmosIrregularStarField =
        "true";

      state.root.dataset
        .showroomCosmosDualSpacecraft =
        "true";
    }

    if (
      state.layer &&
      state.layer.dataset
    ) {
      state.layer.dataset
        .showroomCosmosReceipt =
        serialized;

      state.layer.dataset
        .showroomCosmosStatus =
        snapshot.status;

      state.layer.dataset
        .showroomCosmosRunning =
        state.running
          ? "true"
          : "false";

      state.layer.dataset
        .showroomCosmosIrregularStarField =
        "true";

      state.layer.dataset
        .showroomCosmosDualSpacecraft =
        "true";
    }

    if (
      state.receiptOutput
    ) {
      if (
        "value" in
        state.receiptOutput
      ) {
        state.receiptOutput.value =
          serialized;
      }

      state.receiptOutput.textContent =
        serialized;
    }

    window[RECEIPT_KEY] =
      snapshot;

    return snapshot;
  }

  function dispatchFailure(
    reason
  ) {
    dispatch(
      FAILURE_EVENT,
      {
        reason:
          normalizeReason(
            reason ||
            "UNKNOWN_COSMOS_FAILURE"
          ),

        nonfatal:
          true,

        staticFallbackRetained:
          true
      }
    );
  }

  function emitFailure(
    reason
  ) {
    if (
      state.failed ||
      state.destroyed
    ) {
      return;
    }

    state.failed =
      true;

    state.suspensionReasons
      .add(
        "failure"
      );

    stopAnimationFrame();
    clearAllSpacecraftTimers();
    hideAndResetAllSpacecraft();

    for (
      const craft of
      state.spacecrafts
    ) {
      craft.flight =
        null;
    }

    state.meteors.length =
      0;

    state.suspended =
      true;

    drawStaticFrame();

    emitReceipt({
      status:
        "held",

      lastAction:
        "cosmos-render-failure",

      lastFailure:
        normalizeReason(
          reason ||
          "UNKNOWN_COSMOS_FAILURE"
        ),

      failureReason:
        normalizeReason(
          reason ||
          "UNKNOWN_COSMOS_FAILURE"
        ),

      staticFrameRendered:
        Boolean(
          state.context
        )
    });

    dispatchFailure(
      reason
    );
  }

  function mediaReducedMotion() {
    return Boolean(
      state.motionQuery &&
      state.motionQuery.matches
    );
  }

  function rootReducedMotion() {
    return Boolean(
      state.root &&
      state.root.dataset &&
      (
        state.root.dataset
          .reducedMotion ===
          "true" ||
        state.root.dataset
          .showroomReducedMotion ===
          "true" ||
        state.root.dataset
          .showroomRendererReducedMotion ===
          "true"
      )
    );
  }

  function resolveController(
    bindSubscription =
      true
  ) {
    const controller =
      window[
        CONTROLLER_GLOBAL
      ];

    if (
      !controller ||
      typeof controller !==
        "object" ||
      typeof controller.getFrameState !==
        "function"
    ) {
      state.controller =
        null;

      return null;
    }

    state.controller =
      controller;

    if (bindSubscription) {
      bindControllerSubscription();
    }

    return controller;
  }

  function controllerReducedMotion() {
    const controller =
      state.controller ||
      resolveController(
        false
      );

    if (
      !controller ||
      typeof controller.getFrameState !==
        "function"
    ) {
      return false;
    }

    try {
      const frame =
        controller.getFrameState();

      return Boolean(
        frame &&
        frame.reducedMotion
      );
    } catch {
      return false;
    }
  }

  function resolveReducedMotion(
    requestedValue
  ) {
    state.reducedMotion =
      requestedValue === true ||
      mediaReducedMotion() ||
      rootReducedMotion() ||
      controllerReducedMotion();

    if (
      state.root &&
      state.root.dataset
    ) {
      state.root.dataset
        .showroomCosmosReducedMotion =
        state.reducedMotion
          ? "true"
          : "false";
    }

    return state.reducedMotion;
  }

  function createRuntimeStyle() {
    const existing =
      document.getElementById(
        STYLE_ID
      );

    if (existing) {
      state.createdStyle =
        false;

      return;
    }

    const style =
      document.createElement(
        "style"
      );

    state.createdStyle =
      true;

    style.id =
      STYLE_ID;

    style.textContent = `
      #${LAYER_ID} {
        position: fixed;
        inset: 0;
        z-index: 1;
        overflow: hidden;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        contain: strict;
        isolation: isolate;
      }

      #${CANVAS_ID} {
        position: absolute;
        inset: 0;
        z-index: 0;
        display: block;
        width: 100%;
        height: 100%;
        max-width: none;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        opacity: 0.82;
      }

      .showroom-cosmos-spacecraft {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        display: block;
        max-width: none;
        overflow: visible;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        opacity: 0;
        transform:
          translate3d(-280px, -180px, 0)
          rotate(0deg)
          scale(0.58);
        transform-origin: 50% 50%;
        will-change: transform, opacity;
      }

      #${SPACECRAFT_PRIMARY_ID} {
        width: 148px;
        height: 60px;
        filter:
          drop-shadow(0 0 5px rgba(124, 220, 255, 0.20))
          drop-shadow(0 0 10px rgba(232, 199, 119, 0.08));
      }

      #${SPACECRAFT_SECONDARY_ID} {
        width: 118px;
        height: 48px;
        filter:
          drop-shadow(0 0 4px rgba(124, 220, 255, 0.16))
          drop-shadow(0 0 9px rgba(159, 137, 255, 0.08));
      }

      .showroom-cosmos-spacecraft[data-flying="true"] {
        opacity: 1;
      }

      .showroom-cosmos-spacecraft .showroom-spacecraft-engine-core {
        animation:
          showroom-spacecraft-engine-pulse
          1.45s
          ease-in-out
          infinite
          alternate;
        transform-origin: center;
      }

      .showroom-cosmos-spacecraft .showroom-spacecraft-running-light {
        animation:
          showroom-spacecraft-light-pulse
          2.25s
          ease-in-out
          infinite
          alternate;
      }

      .showroom-cosmos-spacecraft
      .showroom-spacecraft-running-light--secondary {
        animation-delay: -1.1s;
      }

      #${SPACECRAFT_SECONDARY_ID} .showroom-spacecraft-engine-core {
        animation-duration: 1.12s;
      }

      #${SPACECRAFT_SECONDARY_ID} .showroom-spacecraft-running-light {
        animation-duration: 1.72s;
      }

      @keyframes showroom-spacecraft-engine-pulse {
        0% {
          opacity: 0.42;
          transform: scaleX(0.80);
        }

        100% {
          opacity: 0.84;
          transform: scaleX(1.05);
        }
      }

      @keyframes showroom-spacecraft-light-pulse {
        0% {
          opacity: 0.34;
        }

        100% {
          opacity: 0.82;
        }
      }

      @media (max-width: 820px) {
        #${CANVAS_ID} {
          opacity: 0.76;
        }

        #${SPACECRAFT_PRIMARY_ID} {
          width: 124px;
          height: 50px;
        }

        #${SPACECRAFT_SECONDARY_ID} {
          width: 102px;
          height: 41px;
        }
      }

      @media (max-width: 560px) {
        #${CANVAS_ID} {
          opacity: 0.70;
        }

        #${SPACECRAFT_PRIMARY_ID} {
          width: 98px;
          height: 40px;
          filter:
            drop-shadow(0 0 3px rgba(124, 220, 255, 0.15))
            drop-shadow(0 0 7px rgba(232, 199, 119, 0.05));
        }

        #${SPACECRAFT_SECONDARY_ID} {
          width: 82px;
          height: 34px;
          filter:
            drop-shadow(0 0 3px rgba(124, 220, 255, 0.13))
            drop-shadow(0 0 6px rgba(159, 137, 255, 0.05));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .showroom-cosmos-spacecraft {
          display: none !important;
          animation: none !important;
        }

        .showroom-cosmos-spacecraft * {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function createLayer() {
    const existing =
      document.getElementById(
        LAYER_ID
      );

    if (existing) {
      state.createdLayer =
        false;

      state.layer =
        existing;

      state.canvas =
        existing.querySelector(
          `#${CANVAS_ID}`
        );

      if (!state.canvas) {
        throw new Error(
          "SHOWROOM_COSMOS_EXISTING_LAYER_CANVAS_MISSING"
        );
      }

      state.context =
        state.canvas.getContext(
          "2d",
          {
            alpha:
              true,

            desynchronized:
              false
          }
        );

      if (!state.context) {
        throw new Error(
          "SHOWROOM_COSMOS_2D_CONTEXT_UNAVAILABLE"
        );
      }

      state.spacecrafts =
        SPACECRAFT_CONFIGS.map(
          config => {
            let element =
              existing.querySelector(
                `#${config.id}`
              );

            if (!element) {
              element =
                createSpacecraft(
                  config
                );

              existing.appendChild(
                element
              );
            }

            return createSpacecraftState(
              config,
              element
            );
          }
        );

      return;
    }

    const layer =
      document.createElement(
        "div"
      );

    const canvas =
      document.createElement(
        "canvas"
      );

    state.createdLayer =
      true;

    layer.id =
      LAYER_ID;

    layer.setAttribute(
      "aria-hidden",
      "true"
    );

    layer.setAttribute(
      "data-showroom-cosmos-runtime",
      "true"
    );

    layer.setAttribute(
      "data-showroom-cosmos-interactive",
      "false"
    );

    layer.setAttribute(
      "data-showroom-cosmos-irregular-star-field",
      "true"
    );

    layer.setAttribute(
      "data-showroom-cosmos-dual-spacecraft",
      "true"
    );

    canvas.id =
      CANVAS_ID;

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "data-showroom-cosmos-surface",
      "2d-canvas"
    );

    layer.appendChild(
      canvas
    );

    state.spacecrafts =
      SPACECRAFT_CONFIGS.map(
        config => {
          const element =
            createSpacecraft(
              config
            );

          layer.appendChild(
            element
          );

          return createSpacecraftState(
            config,
            element
          );
        }
      );

    document.body.prepend(
      layer
    );

    state.layer =
      layer;

    state.canvas =
      canvas;

    state.context =
      canvas.getContext(
        "2d",
        {
          alpha:
            true,

          desynchronized:
            false
        }
      );

    if (!state.context) {
      throw new Error(
        "SHOWROOM_COSMOS_2D_CONTEXT_UNAVAILABLE"
      );
    }
  }

  function createSpacecraftState(
    config,
    element
  ) {
    return {
      key:
        config.key,

      id:
        config.id,

      variant:
        config.variant,

      config,

      element,

      flight:
        null,

      timer:
        0,

      lastPath:
        null
    };
  }

  function createSpacecraft(
    config
  ) {
    const namespace =
      "http://www.w3.org/2000/svg";

    const svg =
      document.createElementNS(
        namespace,
        "svg"
      );

    svg.id =
      config.id;

    svg.classList.add(
      "showroom-cosmos-spacecraft"
    );

    svg.setAttribute(
      "viewBox",
      "0 0 240 96"
    );

    svg.setAttribute(
      "role",
      "presentation"
    );

    svg.setAttribute(
      "aria-hidden",
      "true"
    );

    svg.setAttribute(
      "focusable",
      "false"
    );

    svg.setAttribute(
      "data-flying",
      "false"
    );

    svg.setAttribute(
      "data-showroom-cosmos-spacecraft",
      config.key
    );

    svg.setAttribute(
      "data-showroom-cosmos-spacecraft-variant",
      config.variant
    );

    svg.innerHTML =
      config.key ===
        "secondary"
        ? spacecraftMarkupSecondary()
        : spacecraftMarkupPrimary();

    return svg;
  }

  function spacecraftMarkupPrimary() {
    return `
      <defs>
        <linearGradient
          id="showroom-spacecraft-primary-hull-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stop-color="#f4df9f" />
          <stop offset="22%" stop-color="#8eaab7" />
          <stop offset="52%" stop-color="#253642" />
          <stop offset="78%" stop-color="#111923" />
          <stop offset="100%" stop-color="#060a10" />
        </linearGradient>

        <linearGradient
          id="showroom-spacecraft-primary-wing-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stop-color="#101923" />
          <stop offset="48%" stop-color="#334d60" />
          <stop offset="100%" stop-color="#090e15" />
        </linearGradient>

        <linearGradient
          id="showroom-spacecraft-primary-canopy-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stop-color="#d8f7ff" stop-opacity="0.90" />
          <stop offset="34%" stop-color="#72d9ff" stop-opacity="0.66" />
          <stop offset="74%" stop-color="#2b385c" stop-opacity="0.88" />
          <stop offset="100%" stop-color="#090d18" />
        </linearGradient>

        <linearGradient
          id="showroom-spacecraft-primary-engine-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stop-color="#72d9ff" stop-opacity="0" />
          <stop offset="40%" stop-color="#72d9ff" stop-opacity="0.46" />
          <stop offset="78%" stop-color="#e8c777" stop-opacity="0.68" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.82" />
        </linearGradient>

        <radialGradient id="showroom-spacecraft-primary-light-gradient">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="38%" stop-color="#e8c777" />
          <stop offset="100%" stop-color="#d8b86a" stop-opacity="0" />
        </radialGradient>
      </defs>

      <g>
        <path
          class="showroom-spacecraft-engine-core"
          d="M41 42 L4 48 L41 54 Z"
          fill="url(#showroom-spacecraft-primary-engine-gradient)"
          opacity="0.72"
        />

        <path
          d="M49 34 L17 25 L37 46 L17 69 L55 58 Z"
          fill="url(#showroom-spacecraft-primary-wing-gradient)"
          stroke="rgba(124,220,255,0.34)"
          stroke-width="1.2"
        />

        <path
          d="M52 36 L31 14 L76 34 Z"
          fill="#162533"
          stroke="rgba(232,199,119,0.32)"
          stroke-width="1.1"
        />

        <path
          d="M52 58 L31 82 L79 60 Z"
          fill="#101d29"
          stroke="rgba(124,220,255,0.26)"
          stroke-width="1.1"
        />

        <path
          d="M43 40
             C69 26, 112 21, 163 29
             C189 33, 211 42, 231 48
             C211 54, 188 63, 160 68
             C112 75, 70 68, 43 56
             Z"
          fill="url(#showroom-spacecraft-primary-hull-gradient)"
          stroke="rgba(232,199,119,0.48)"
          stroke-width="1.35"
        />

        <path
          d="M102 31
             C117 18, 147 17, 166 31
             L173 43
             L101 43
             Z"
          fill="url(#showroom-spacecraft-primary-canopy-gradient)"
          stroke="rgba(124,220,255,0.54)"
          stroke-width="1.2"
        />

        <path
          d="M99 48 L219 48"
          fill="none"
          stroke="rgba(124,220,255,0.28)"
          stroke-width="1"
        />

        <path
          d="M67 43 L91 35 L92 60 L68 54 Z"
          fill="rgba(7,12,18,0.78)"
          stroke="rgba(232,199,119,0.34)"
          stroke-width="1"
        />

        <path
          d="M116 60 C138 65, 167 61, 194 53"
          fill="none"
          stroke="rgba(232,199,119,0.24)"
          stroke-width="1.1"
        />

        <path
          d="M164 29 L185 18 L180 37 Z"
          fill="#162432"
          stroke="rgba(124,220,255,0.30)"
          stroke-width="1"
        />

        <ellipse
          cx="49"
          cy="48"
          rx="9"
          ry="13"
          fill="#060b11"
          stroke="rgba(124,220,255,0.42)"
          stroke-width="1.3"
        />

        <ellipse
          cx="49"
          cy="48"
          rx="4.2"
          ry="7.2"
          fill="#72d9ff"
          opacity="0.66"
        />

        <circle
          class="showroom-spacecraft-running-light"
          cx="204"
          cy="44"
          r="7"
          fill="url(#showroom-spacecraft-primary-light-gradient)"
        />

        <circle
          class="showroom-spacecraft-running-light showroom-spacecraft-running-light--secondary"
          cx="84"
          cy="59"
          r="4.6"
          fill="url(#showroom-spacecraft-primary-light-gradient)"
          opacity="0.56"
        />

        <circle
          cx="184"
          cy="56"
          r="2.1"
          fill="#72d9ff"
          opacity="0.70"
        />

        <circle
          cx="155"
          cy="63"
          r="1.8"
          fill="#e8c777"
          opacity="0.66"
        />

        <path
          d="M111 37 L157 37"
          fill="none"
          stroke="rgba(255,255,255,0.24)"
          stroke-width="0.8"
        />

        <path
          d="M59 40 C89 29, 132 26, 170 32"
          fill="none"
          stroke="rgba(255,248,224,0.25)"
          stroke-width="1"
        />
      </g>
    `;
  }

  function spacecraftMarkupSecondary() {
    return `
      <defs>
        <linearGradient
          id="showroom-spacecraft-secondary-hull-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stop-color="#d9f7ff" />
          <stop offset="24%" stop-color="#8394c8" />
          <stop offset="54%" stop-color="#26314d" />
          <stop offset="80%" stop-color="#101626" />
          <stop offset="100%" stop-color="#060912" />
        </linearGradient>

        <linearGradient
          id="showroom-spacecraft-secondary-wing-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stop-color="#0d1425" />
          <stop offset="50%" stop-color="#35446a" />
          <stop offset="100%" stop-color="#080c16" />
        </linearGradient>

        <linearGradient
          id="showroom-spacecraft-secondary-canopy-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stop-color="#f0fbff" stop-opacity="0.86" />
          <stop offset="34%" stop-color="#8fe8ff" stop-opacity="0.60" />
          <stop offset="76%" stop-color="#3a316c" stop-opacity="0.82" />
          <stop offset="100%" stop-color="#090b18" />
        </linearGradient>

        <linearGradient
          id="showroom-spacecraft-secondary-engine-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stop-color="#b697ff" stop-opacity="0" />
          <stop offset="42%" stop-color="#75e9ff" stop-opacity="0.42" />
          <stop offset="82%" stop-color="#b697ff" stop-opacity="0.58" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.72" />
        </linearGradient>

        <radialGradient id="showroom-spacecraft-secondary-light-gradient">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="42%" stop-color="#75e9ff" />
          <stop offset="100%" stop-color="#b697ff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <g>
        <path
          class="showroom-spacecraft-engine-core"
          d="M48 42 L10 48 L48 54 Z"
          fill="url(#showroom-spacecraft-secondary-engine-gradient)"
          opacity="0.66"
        />

        <path
          d="M54 38 L20 30 L42 48 L20 66 L58 58 Z"
          fill="url(#showroom-spacecraft-secondary-wing-gradient)"
          stroke="rgba(159,137,255,0.32)"
          stroke-width="1"
        />

        <path
          d="M55 39 L36 18 L84 38 Z"
          fill="#141d34"
          stroke="rgba(124,220,255,0.26)"
          stroke-width="0.95"
        />

        <path
          d="M55 57 L36 78 L86 58 Z"
          fill="#10192c"
          stroke="rgba(159,137,255,0.24)"
          stroke-width="0.95"
        />

        <path
          d="M47 41
             C72 29, 115 25, 156 32
             C181 36, 205 43, 226 48
             C204 54, 180 62, 154 66
             C113 72, 73 67, 47 55
             Z"
          fill="url(#showroom-spacecraft-secondary-hull-gradient)"
          stroke="rgba(124,220,255,0.38)"
          stroke-width="1.15"
        />

        <path
          d="M100 33
             C116 23, 143 23, 160 34
             L166 44
             L99 44
             Z"
          fill="url(#showroom-spacecraft-secondary-canopy-gradient)"
          stroke="rgba(182,151,255,0.44)"
          stroke-width="1"
        />

        <path
          d="M96 49 L212 49"
          fill="none"
          stroke="rgba(124,220,255,0.22)"
          stroke-width="0.8"
        />

        <path
          d="M73 44 L95 37 L96 59 L74 54 Z"
          fill="rgba(7,12,22,0.76)"
          stroke="rgba(159,137,255,0.28)"
          stroke-width="0.9"
        />

        <ellipse
          cx="54"
          cy="48"
          rx="7.5"
          ry="11.2"
          fill="#060b13"
          stroke="rgba(159,137,255,0.36)"
          stroke-width="1.1"
        />

        <ellipse
          cx="54"
          cy="48"
          rx="3.4"
          ry="6.0"
          fill="#b697ff"
          opacity="0.58"
        />

        <circle
          class="showroom-spacecraft-running-light"
          cx="196"
          cy="45"
          r="5.6"
          fill="url(#showroom-spacecraft-secondary-light-gradient)"
        />

        <circle
          class="showroom-spacecraft-running-light showroom-spacecraft-running-light--secondary"
          cx="91"
          cy="59"
          r="3.8"
          fill="url(#showroom-spacecraft-secondary-light-gradient)"
          opacity="0.50"
        />

        <circle
          cx="176"
          cy="56"
          r="1.8"
          fill="#75e9ff"
          opacity="0.62"
        />

        <circle
          cx="151"
          cy="62"
          r="1.5"
          fill="#b697ff"
          opacity="0.58"
        />

        <path
          d="M109 38 L150 38"
          fill="none"
          stroke="rgba(255,255,255,0.20)"
          stroke-width="0.7"
        />

        <path
          d="M63 42 C92 32, 130 30, 166 34"
          fill="none"
          stroke="rgba(231,238,246,0.20)"
          stroke-width="0.85"
        />
      </g>
    `;
  }

  function initialize() {
    if (
      state.initialized ||
      state.destroyed
    ) {
      return;
    }

    try {
      const root =
        document.querySelector(
          CONFIG.selector
        );

      if (!root) {
        throw new Error(
          "SHOWROOM_ROOT_NOT_FOUND"
        );
      }

      state.root =
        root;

      resolveReceiptOutput();

      state.documentVisible =
        !document.hidden;

      state.pageActive =
        true;

      state.motionQuery =
        typeof window.matchMedia ===
          "function"
          ? window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            )
          : null;

      resolveController(
        false
      );

      resolveReducedMotion(
        false
      );

      createRuntimeStyle();
      createLayer();
      installObservers();
      bindControllerSubscription();
      resize();

      state.initialized =
        true;

      api.initialized =
        true;

      state.nextMeteorTime =
        performance.now() +
        random(
          CONFIG
            .meteorSpawnMinimumMs,
          CONFIG
            .meteorSpawnMaximumMs
        );

      if (
        canEnvironmentRun()
      ) {
        scheduleAllSpacecraftFlights(
          true
        );
      }

      emitReceipt({
        status:
          "available",

        lastAction:
          "cosmos-initialized-irregular-starfield-dual-spacecraft",

        lastFailure:
          null,

        reducedMotionSource:
          "startup",

        staticFrameRendered:
          true
      });

      dispatch(
        READY_EVENT,
        {
          initialized:
            true,

          rendererClass:
            CONTRACT
              .rendererClass,

          generatedSurfaces:
            Object.freeze([
              STYLE_ID,
              LAYER_ID,
              CANVAS_ID,
              SPACECRAFT_PRIMARY_ID,
              SPACECRAFT_SECONDARY_ID
            ]),

          irregularStarField:
            true,

          dualSpacecraft:
            true,

          functionalDependency:
            false
        }
      );

      evaluateRunningState(
        "startup"
      );
    } catch (error) {
      rollbackPartialInitialization(
        `SHOWROOM_COSMOS_INIT_FAILURE:${
          error &&
          error.message
            ? error.message
            : String(error)
        }`
      );
    }
  }

  function installObservers() {
    if (
      state.listenersBound
    ) {
      return;
    }

    state.boundResize =
      handleWindowResize;

    state.boundVisibility =
      handleVisibilityChange;

    state.boundPageHide =
      handlePageHide;

    state.boundPageShow =
      handlePageShow;

    state.boundMotionChange =
      handleMotionQueryChange;

    state.boundSharedMotionChange =
      handleSharedMotionChange;

    state.boundControllerReady =
      handleControllerReady;

    state.boundControllerFailure =
      handleControllerFailure;

    window.addEventListener(
      "resize",
      state.boundResize,
      {
        passive:
          true
      }
    );

    document.addEventListener(
      "visibilitychange",
      state.boundVisibility
    );

    window.addEventListener(
      "pagehide",
      state.boundPageHide
    );

    window.addEventListener(
      "pageshow",
      state.boundPageShow
    );

    window.addEventListener(
      REDUCED_MOTION_EVENT,
      state.boundSharedMotionChange
    );

    window.addEventListener(
      "SHOWROOM_CONTROLLER_READY",
      state.boundControllerReady
    );

    window.addEventListener(
      "SHOWROOM_CONTROLLER_FAILURE",
      state.boundControllerFailure
    );

    if (
      state.motionQuery
    ) {
      if (
        typeof state.motionQuery
          .addEventListener ===
        "function"
      ) {
        state.motionQuery
          .addEventListener(
            "change",
            state.boundMotionChange
          );
      } else if (
        typeof state.motionQuery
          .addListener ===
        "function"
      ) {
        state.motionQuery
          .addListener(
            state.boundMotionChange
          );
      }
    }

    if (
      "ResizeObserver" in
      window
    ) {
      state.resizeObserver =
        new ResizeObserver(
          handleObservedResize
        );

      state.resizeObserver.observe(
        document.documentElement
      );
    }

    state.listenersBound =
      true;
  }

  function uninstallObservers() {
    if (
      state.boundResize
    ) {
      window.removeEventListener(
        "resize",
        state.boundResize
      );
    }

    if (
      state.boundVisibility
    ) {
      document.removeEventListener(
        "visibilitychange",
        state.boundVisibility
      );
    }

    if (
      state.boundPageHide
    ) {
      window.removeEventListener(
        "pagehide",
        state.boundPageHide
      );
    }

    if (
      state.boundPageShow
    ) {
      window.removeEventListener(
        "pageshow",
        state.boundPageShow
      );
    }

    if (
      state.boundSharedMotionChange
    ) {
      window.removeEventListener(
        REDUCED_MOTION_EVENT,
        state.boundSharedMotionChange
      );
    }

    if (
      state.boundControllerReady
    ) {
      window.removeEventListener(
        "SHOWROOM_CONTROLLER_READY",
        state.boundControllerReady
      );
    }

    if (
      state.boundControllerFailure
    ) {
      window.removeEventListener(
        "SHOWROOM_CONTROLLER_FAILURE",
        state.boundControllerFailure
      );
    }

    if (
      state.motionQuery &&
      state.boundMotionChange
    ) {
      if (
        typeof state.motionQuery
          .removeEventListener ===
        "function"
      ) {
        state.motionQuery
          .removeEventListener(
            "change",
            state.boundMotionChange
          );
      } else if (
        typeof state.motionQuery
          .removeListener ===
        "function"
      ) {
        state.motionQuery
          .removeListener(
            state.boundMotionChange
          );
      }
    }

    if (
      state.resizeObserver
    ) {
      state.resizeObserver
        .disconnect();

      state.resizeObserver =
        null;
    }

    unsubscribeController();

    state.boundResize =
      null;

    state.boundVisibility =
      null;

    state.boundPageHide =
      null;

    state.boundPageShow =
      null;

    state.boundMotionChange =
      null;

    state.boundSharedMotionChange =
      null;

    state.boundControllerReady =
      null;

    state.boundControllerFailure =
      null;

    state.listenersBound =
      false;
  }

  function bindControllerSubscription() {
    const controller =
      state.controller ||
      resolveController(
        false
      );

    if (
      !controller ||
      typeof controller
        .subscribeFrameState !==
        "function" ||
      typeof state
        .controllerFrameUnsubscribe ===
        "function"
    ) {
      return false;
    }

    try {
      const unsubscribe =
        controller.subscribeFrameState(
          () => {
            applyReducedMotionChange(
              false,
              "controller-frame"
            );
          }
        );

      if (
        unsubscribe != null &&
        typeof unsubscribe !==
          "function"
      ) {
        throw new Error(
          "SHOWROOM_COSMOS_INVALID_CONTROLLER_UNSUBSCRIBE"
        );
      }

      state.controllerFrameUnsubscribe =
        unsubscribe ||
        null;

      return true;
    } catch {
      state.controllerFrameUnsubscribe =
        null;

      return false;
    }
  }

  function unsubscribeController() {
    const unsubscribe =
      state.controllerFrameUnsubscribe;

    state.controllerFrameUnsubscribe =
      null;

    if (
      typeof unsubscribe ===
        "function"
    ) {
      try {
        unsubscribe();
      } catch {
        /* Best-effort unsubscription. */
      }
    }
  }

  function handleWindowResize() {
    resize();
  }

  function handleObservedResize() {
    resize();
  }

  function handleVisibilityChange() {
    state.documentVisible =
      !document.hidden;

    evaluateRunningState(
      state.documentVisible
        ? "document-visible"
        : "document-hidden"
    );
  }

  function handlePageHide() {
    state.pageActive =
      false;

    suspendEnvironment(
      "pagehide"
    );
  }

  function handlePageShow() {
    if (
      state.destroyed ||
      state.failed
    ) {
      return;
    }

    state.pageActive =
      true;

    state.documentVisible =
      !document.hidden;

    if (
      state.root &&
      !state.root.isConnected
    ) {
      emitFailure(
        "SHOWROOM_ROOT_DISCONNECTED"
      );

      return;
    }

    resize();

    evaluateRunningState(
      "pageshow"
    );
  }

  function handleMotionQueryChange(
    event
  ) {
    applyReducedMotionChange(
      Boolean(
        event.matches
      ),
      "media-query-change"
    );
  }

  function handleSharedMotionChange(
    event
  ) {
    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    applyReducedMotionChange(
      detail.reducedMotion ===
        true,
      detail.source ||
        "shared-controller-event"
    );
  }

  function handleControllerReady() {
    resolveController(
      true
    );

    applyReducedMotionChange(
      false,
      "controller-ready"
    );
  }

  function handleControllerFailure() {
    unsubscribeController();

    state.controller =
      null;

    applyReducedMotionChange(
      false,
      "controller-unavailable"
    );
  }

  function applyReducedMotionChange(
    requestedValue,
    source
  ) {
    if (
      state.destroyed ||
      state.failed
    ) {
      return false;
    }

    const previous =
      state.reducedMotion;

    resolveReducedMotion(
      requestedValue
    );

    if (
      state.reducedMotion
    ) {
      suspendEnvironment(
        "reduced-motion"
      );
    } else {
      state.suspensionReasons
        .delete(
          "reduced-motion"
        );

      evaluateRunningState(
        "reduced-motion-cleared"
      );
    }

    drawStaticFrame();

    emitReceipt({
      lastAction:
        "cosmos-reduced-motion-updated",

      reducedMotionSource:
        normalizeReason(
          source
        ),

      reducedMotionChanged:
        previous !==
        state.reducedMotion,

      staticFrameRendered:
        Boolean(
          state.context
        )
    });

    return previous !==
      state.reducedMotion;
  }

  function environmentFailureReason() {
    if (
      !state.initialized
    ) {
      return "not-initialized";
    }

    if (
      state.destroyed
    ) {
      return "destroyed";
    }

    if (
      state.failed
    ) {
      return "failure";
    }

    if (
      !state.root ||
      !state.root.isConnected
    ) {
      return "root-disconnected";
    }

    if (
      !state.context
    ) {
      return "context-unavailable";
    }

    if (
      !state.documentVisible
    ) {
      return "document-hidden";
    }

    if (
      !state.pageActive
    ) {
      return "page-inactive";
    }

    if (
      state.reducedMotion
    ) {
      return "reduced-motion";
    }

    return "";
  }

  function canEnvironmentRun() {
    return (
      environmentFailureReason() ===
      ""
    );
  }

  function evaluateRunningState(
    source =
      "environment-check"
  ) {
    if (
      state.destroyed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    resolveReducedMotion(
      false
    );

    const reason =
      environmentFailureReason();

    if (!reason) {
      return resumeEnvironment(
        source
      );
    }

    if (
      reason ===
      "root-disconnected"
    ) {
      emitFailure(
        "SHOWROOM_ROOT_DISCONNECTED"
      );

      return false;
    }

    return suspendEnvironment(
      reason
    );
  }

  function resumeEnvironment(
    reason =
      "environment"
  ) {
    if (
      !canEnvironmentRun()
    ) {
      return false;
    }

    state.suspensionReasons
      .clear();

    state.suspended =
      false;

    const started =
      start();

    scheduleMissingSpacecraftFlights(
      true
    );

    if (
      state.nextMeteorTime <=
      performance.now()
    ) {
      state.nextMeteorTime =
        performance.now() +
        random(
          CONFIG
            .meteorSpawnMinimumMs,
          CONFIG
            .meteorSpawnMaximumMs
        );
    }

    emitReceipt({
      lastAction:
        `cosmos-environment-resumed:${normalizeReason(reason)}`
    });

    return (
      started ||
      state.running
    );
  }

  function suspendEnvironment(
    reason
  ) {
    if (
      state.destroyed
    ) {
      return false;
    }

    const normalizedReason =
      normalizeReason(
        reason
      );

    const wasSuspended =
      state.suspended;

    state.suspensionReasons
      .add(
        normalizedReason
      );

    state.suspended =
      true;

    stopAnimationFrame();
    clearAllSpacecraftTimers();

    cancelAllSpacecraftFlights(
      normalizedReason,
      false
    );

    state.meteors.length =
      0;

    drawStaticFrame();

    if (
      !wasSuspended ||
      !RECEIPT
        .suspensionReasons
        .includes(
          normalizedReason
        )
    ) {
      emitReceipt({
        lastAction:
          `cosmos-environment-suspended:${normalizedReason}`,

        staticFrameRendered:
          Boolean(
            state.context
          )
      });
    }

    return true;
  }

  function start() {
    if (
      state.running ||
      !canEnvironmentRun()
    ) {
      return false;
    }

    state.suspensionReasons
      .clear();

    state.suspended =
      false;

    state.running =
      true;

    state.lastFrameTime =
      performance.now();

    state.accumulatedFrameTime =
      0;

    state.frameHandle =
      requestAnimationFrame(
        frame
      );

    emitReceipt({
      lastAction:
        "cosmos-render-loop-started"
    });

    return true;
  }

  function stop() {
    stopAnimationFrame();

    emitReceipt({
      lastAction:
        "cosmos-render-loop-stopped"
    });

    return true;
  }

  function stopAnimationFrame() {
    state.running =
      false;

    if (
      state.frameHandle
    ) {
      cancelAnimationFrame(
        state.frameHandle
      );

      state.frameHandle =
        0;
    }
  }

  function frame(
    timestamp
  ) {
    if (
      !state.running ||
      state.destroyed ||
      state.failed
    ) {
      return;
    }

    if (
      !canEnvironmentRun()
    ) {
      evaluateRunningState(
        "frame-environment-invalid"
      );

      return;
    }

    const rawDelta =
      timestamp -
      state.lastFrameTime;

    const delta =
      clamp(
        rawDelta,
        0,
        CONFIG.maximumDeltaMs
      );

    state.lastFrameTime =
      timestamp;

    state.accumulatedFrameTime +=
      delta;

    const targetFrameDuration =
      1000 /
      CONFIG.frameRate;

    if (
      state.accumulatedFrameTime >=
      targetFrameDuration
    ) {
      const renderStart =
        performance.now();

      try {
        update(
          state.accumulatedFrameTime,
          timestamp
        );

        draw(
          timestamp
        );
      } catch (error) {
        emitFailure(
          `SHOWROOM_COSMOS_FRAME_FAILURE:${
            error &&
            error.message
              ? error.message
              : String(error)
          }`
        );

        return;
      }

      const renderCost =
        performance.now() -
        renderStart;

      registerRenderCost(
        renderCost,
        timestamp
      );

      state.accumulatedFrameTime %=
        targetFrameDuration;
    }

    state.frameHandle =
      requestAnimationFrame(
        frame
      );
  }

  function registerRenderCost(
    renderCost,
    timestamp
  ) {
    state.renderCostSamples.push(
      renderCost
    );

    if (
      state.renderCostSamples.length >
      90
    ) {
      state.renderCostSamples.shift();
    }

    if (
      timestamp -
      state.lastAdaptiveCheck <
      CONFIG
        .adaptiveCheckIntervalMs
    ) {
      return;
    }

    state.lastAdaptiveCheck =
      timestamp;

    if (
      !state.renderCostSamples
        .length
    ) {
      return;
    }

    const average =
      state.renderCostSamples
        .reduce(
          (
            sum,
            value
          ) =>
            sum +
            value,
          0
        ) /
      state.renderCostSamples
        .length;

    state.renderCostSamples
      .length =
      0;

    if (
      average >
      CONFIG
        .adaptiveSlowRenderMs
    ) {
      setQuality(
        state.quality -
        CONFIG.adaptiveStepDown
      );
    } else if (
      average <
      CONFIG
        .adaptiveFastRenderMs
    ) {
      setQuality(
        state.quality +
        CONFIG.adaptiveStepUp
      );
    }
  }

  function setQuality(
    value
  ) {
    const numeric =
      Number(value);

    const next =
      clamp(
        Number.isFinite(
          numeric
        )
          ? numeric
          : CONFIG
              .adaptiveMinimumQuality,

        CONFIG
          .adaptiveMinimumQuality,

        CONFIG
          .adaptiveMaximumQuality
      );

    if (
      Math.abs(
        next -
        state.quality
      ) <
      0.02
    ) {
      return false;
    }

    state.quality =
      next;

    rebuildParticleField();
    drawStaticFrame();

    emitReceipt({
      lastAction:
        "cosmos-quality-updated",

      staticFrameRendered:
        Boolean(
          state.context
        )
    });

    return true;
  }

  function resize() {
    if (
      !state.canvas ||
      !state.context ||
      state.destroyed
    ) {
      return false;
    }

    const width =
      Math.max(
        1,
        window.innerWidth
      );

    const height =
      Math.max(
        1,
        window.innerHeight
      );

    const mobileMaximum =
      width <=
      820
        ? CONFIG
            .pixelRatioMobileMaximum
        : CONFIG
            .pixelRatioMaximum;

    const pixelRatio =
      clamp(
        window.devicePixelRatio ||
        1,
        1,
        mobileMaximum
      );

    if (
      width ===
        state.width &&
      height ===
        state.height &&
      pixelRatio ===
        state.pixelRatio
    ) {
      return false;
    }

    state.width =
      width;

    state.height =
      height;

    state.pixelRatio =
      pixelRatio;

    state.canvas.width =
      Math.round(
        width *
        pixelRatio
      );

    state.canvas.height =
      Math.round(
        height *
        pixelRatio
      );

    state.canvas.style.width =
      `${width}px`;

    state.canvas.style.height =
      `${height}px`;

    state.context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    state.context.imageSmoothingEnabled =
      true;

    rebuildParticleField();
    drawStaticFrame();

    emitReceipt({
      lastAction:
        "cosmos-resized",

      staticFrameRendered:
        true
    });

    return true;
  }

  function rebuildParticleField() {
    const area =
      state.width *
      state.height;

    const mobileFactor =
      state.width <=
      560
        ? 0.62
        : state.width <=
            820
          ? 0.78
          : 1;

    const quality =
      state.quality *
      mobileFactor;

    const starCount =
      clamp(
        Math.floor(
          (
            area /
            CONFIG.starAreaDivisor
          ) *
          quality
        ),
        CONFIG.minimumStars,
        CONFIG.maximumStars
      );

    const dustCount =
      clamp(
        Math.floor(
          (
            area /
            CONFIG.dustAreaDivisor
          ) *
          quality
        ),
        CONFIG.minimumDust,
        CONFIG.maximumDust
      );

    const glintCount =
      clamp(
        Math.floor(
          CONFIG.maximumGlints *
          quality
        ),
        CONFIG.minimumGlints,
        CONFIG.maximumGlints
      );

    const sparkleCount =
      clamp(
        Math.floor(
          CONFIG.maximumSparkles *
          quality
        ),
        CONFIG.minimumSparkles,
        CONFIG.maximumSparkles
      );

    state.stars =
      createIrregularStarField(
        starCount
      );

    state.dust =
      createIrregularDustField(
        dustCount
      );

    state.glints =
      createIrregularGlintField(
        glintCount
      );

    state.sparkles =
      createIrregularSparkleField(
        sparkleCount
      );

    state.meteors.length =
      0;
  }

  function createIrregularStarField(
    count
  ) {
    const stars =
      [];

    const looseMinimumDistance =
      state.width <=
      560
        ? 14
        : state.width <=
            820
          ? 18
          : 23;

    const centerProtectionRadius =
      Math.min(
        state.width,
        state.height
      ) * 0.075;

    const centerX =
      state.width * 0.5;

    const centerY =
      state.height * 0.5;

    const voids =
      createStarVoids();

    let attempts =
      0;

    const maximumAttempts =
      count * 20;

    while (
      stars.length < count &&
      attempts < maximumAttempts
    ) {
      attempts +=
        1;

      const candidate =
        createStarCandidate();

      const centerDistance =
        Math.hypot(
          candidate.x -
          centerX,
          candidate.y -
          centerY
        );

      if (
        centerDistance <
        centerProtectionRadius &&
        Math.random() <
        0.76
      ) {
        continue;
      }

      if (
        isInsideSoftVoid(
          candidate,
          voids
        ) &&
        Math.random() <
        0.82
      ) {
        continue;
      }

      const minimumDistance =
        looseMinimumDistance *
        (
          0.34 +
          candidate.depth *
          0.78
        );

      const tooClose =
        stars.some(
          existing => {
            const distance =
              Math.hypot(
                existing.x -
                  candidate.x,
                existing.y -
                  candidate.y
              );

            const weightedDistance =
              minimumDistance *
              (
                existing.radius >
                  1.05 ||
                candidate.radius >
                  1.05
                  ? 1.18
                  : 0.56
              );

            return distance <
              weightedDistance;
          }
        );

      if (
        tooClose &&
        Math.random() <
        0.86
      ) {
        continue;
      }

      stars.push(
        candidate
      );
    }

    while (
      stars.length < count
    ) {
      stars.push(
        createStarCandidate()
      );
    }

    return stars;
  }

  function createStarVoids() {
    const count =
      state.width <=
      560
        ? 2
        : 3;

    return Array.from(
      {
        length:
          count
      },
      () => ({
        x:
          random(
            state.width * 0.12,
            state.width * 0.88
          ),

        y:
          random(
            state.height * 0.12,
            state.height * 0.88
          ),

        radius:
          random(
            Math.min(
              state.width,
              state.height
            ) * 0.08,
            Math.min(
              state.width,
              state.height
            ) * 0.18
          )
      })
    );
  }

  function isInsideSoftVoid(
    candidate,
    voids
  ) {
    return voids.some(
      voidPoint => {
        const distance =
          Math.hypot(
            candidate.x -
              voidPoint.x,
            candidate.y -
              voidPoint.y
          );

        return distance <
          voidPoint.radius;
      }
    );
  }

  function createStarCandidate() {
    const depthRoll =
      Math.random();

    const depth =
      depthRoll < 0.62
        ? random(
            0.12,
            0.42
          )
        : depthRoll < 0.91
          ? random(
              0.42,
              0.78
            )
          : random(
              0.78,
              1
            );

    const bandRoll =
      Math.random();

    let radius;

    if (
      bandRoll < 0.68
    ) {
      radius =
        random(
          0.24,
          0.66
        );
    } else if (
      bandRoll < 0.93
    ) {
      radius =
        random(
          0.66,
          1.12
        );
    } else {
      radius =
        random(
          1.12,
          1.78
        );
    }

    const color =
      chooseStarColor();

    const margin =
      6;

    return {
      x:
        random(
          -margin,
          state.width +
          margin
        ),

      y:
        random(
          -margin,
          state.height +
          margin
        ),

      radius:
        radius *
        (
          0.72 +
          depth *
          0.46
        ),

      alpha:
        random(
          0.075,
          0.42
        ) *
        (
          0.72 +
          depth *
          0.58
        ),

      color,
      depth,

      phase:
        random(
          0,
          Math.PI *
          2
        ),

      twinkleRate:
        random(
          0.00040,
          0.00145
        ) *
        (
          0.78 +
          depth *
          0.42
        ),

      driftX:
        random(
          -0.0026,
          0.0026
        ) *
        (
          0.22 +
          depth
        ),

      driftY:
        random(
          -0.0018,
          0.0018
        ) *
        (
          0.22 +
          depth
        )
    };
  }

  function chooseStarColor() {
    const paletteRoll =
      Math.random();

    if (
      paletteRoll <=
      0.735
    ) {
      return COLORS.stone;
    }

    if (
      paletteRoll <=
      0.865
    ) {
      return COLORS.whiteSoft;
    }

    if (
      paletteRoll <=
      0.925
    ) {
      return COLORS.blue;
    }

    if (
      paletteRoll <=
      0.970
    ) {
      return COLORS.gold;
    }

    if (
      paletteRoll <=
      0.990
    ) {
      return COLORS.violet;
    }

    return COLORS.teal;
  }

  function createStar() {
    return createStarCandidate();
  }

  function createIrregularDustField(
    count
  ) {
    return Array.from(
      {
        length:
          count
      },
      () => ({
        x:
          Math.random() *
          state.width,

        y:
          Math.random() *
          state.height,

        radius:
          random(
            0.35,
            1.35
          ),

        alpha:
          random(
            0.016,
            0.082
          ),

        speedX:
          random(
            -0.0048,
            0.0048
          ),

        speedY:
          random(
            -0.0036,
            0.0036
          ),

        phase:
          random(
            0,
            Math.PI *
            2
          ),

        color:
          randomChoice([
            COLORS.dust,
            COLORS.dust,
            COLORS.dustBlue,
            COLORS.dustViolet
          ])
      })
    );
  }

  function createDust() {
    return createIrregularDustField(
      1
    )[0];
  }

  function createIrregularGlintField(
    count
  ) {
    const glints =
      [];

    const minimumDistance =
      state.width <=
      560
        ? 86
        : 138;

    let attempts =
      0;

    while (
      glints.length < count &&
      attempts < count * 24
    ) {
      attempts +=
        1;

      const candidate =
        createGlint();

      const tooClose =
        glints.some(
          glint =>
            Math.hypot(
              glint.x -
                candidate.x,
              glint.y -
                candidate.y
            ) <
            minimumDistance
        );

      if (
        tooClose
      ) {
        continue;
      }

      glints.push(
        candidate
      );
    }

    while (
      glints.length < count
    ) {
      glints.push(
        createGlint()
      );
    }

    return glints;
  }

  function createGlint() {
    return {
      x:
        random(
          0.04,
          0.96
        ) *
        state.width,

      y:
        random(
          0.04,
          0.96
        ) *
        state.height,

      radius:
        random(
          1.15,
          2.05
        ),

      alpha:
        random(
          0.20,
          0.48
        ),

      phase:
        random(
          0,
          Math.PI *
          2
        ),

      rate:
        random(
          0.00048,
          0.00125
        ),

      color:
        randomChoice([
          COLORS.stone,
          COLORS.whiteSoft,
          COLORS.blue,
          COLORS.gold
        ]),

      angle:
        random(
          0,
          Math.PI
        )
    };
  }

  function createIrregularSparkleField(
    count
  ) {
    const sparkles =
      [];

    let attempts =
      0;

    const minimumDistance =
      state.width <=
      560
        ? 76
        : 126;

    while (
      sparkles.length < count &&
      attempts < count * 22
    ) {
      attempts +=
        1;

      const candidate =
        createSparkle();

      const tooClose =
        sparkles.some(
          sparkle =>
            Math.hypot(
              sparkle.x -
                candidate.x,
              sparkle.y -
                candidate.y
            ) <
            minimumDistance
        );

      if (
        tooClose
      ) {
        continue;
      }

      sparkles.push(
        candidate
      );
    }

    while (
      sparkles.length < count
    ) {
      sparkles.push(
        createSparkle()
      );
    }

    return sparkles;
  }

  function createSparkle() {
    return {
      x:
        random(
          0.06,
          0.94
        ) *
        state.width,

      y:
        random(
          0.04,
          0.96
        ) *
        state.height,

      radius:
        random(
          0.85,
          1.65
        ),

      alpha:
        random(
          0.20,
          0.44
        ),

      phase:
        random(
          0,
          Math.PI *
          2
        ),

      rate:
        random(
          0.00085,
          0.0020
        ),

      color:
        randomChoice([
          COLORS.stone,
          COLORS.blue,
          COLORS.gold,
          COLORS.teal
        ])
    };
  }

  function update(
    delta,
    timestamp
  ) {
    updateStars(
      delta
    );

    updateDust(
      delta
    );

    updateMeteors(
      delta,
      timestamp
    );

    updateSpacecrafts(
      timestamp
    );
  }

  function updateStars(
    delta
  ) {
    for (
      const star of
      state.stars
    ) {
      star.x +=
        star.driftX *
        delta;

      star.y +=
        star.driftY *
        delta;

      if (
        star.x <
        -4
      ) {
        star.x =
          state.width +
          4;
      } else if (
        star.x >
        state.width +
        4
      ) {
        star.x =
          -4;
      }

      if (
        star.y <
        -4
      ) {
        star.y =
          state.height +
          4;
      } else if (
        star.y >
        state.height +
        4
      ) {
        star.y =
          -4;
      }
    }
  }

  function updateDust(
    delta
  ) {
    for (
      const particle of
      state.dust
    ) {
      particle.x +=
        particle.speedX *
        delta;

      particle.y +=
        particle.speedY *
        delta;

      if (
        particle.x <
        -8
      ) {
        particle.x =
          state.width +
          8;
      } else if (
        particle.x >
        state.width +
        8
      ) {
        particle.x =
          -8;
      }

      if (
        particle.y <
        -8
      ) {
        particle.y =
          state.height +
          8;
      } else if (
        particle.y >
        state.height +
        8
      ) {
        particle.y =
          -8;
      }
    }
  }

  function updateMeteors(
    delta,
    timestamp
  ) {
    if (
      timestamp >=
        state.nextMeteorTime &&
      state.meteors.length <
        CONFIG.maximumMeteors
    ) {
      state.meteors.push(
        createMeteor()
      );

      state.nextMeteorTime =
        timestamp +
        random(
          CONFIG
            .meteorSpawnMinimumMs,
          CONFIG
            .meteorSpawnMaximumMs
        );

      emitReceipt({
        lastAction:
          "meteor-created"
      });
    }

    for (
      let index =
        state.meteors.length -
        1;
      index >=
        0;
      index -=
        1
    ) {
      const meteor =
        state.meteors[index];

      meteor.elapsed +=
        delta;

      meteor.x +=
        meteor.velocityX *
        delta;

      meteor.y +=
        meteor.velocityY *
        delta;

      if (
        meteor.elapsed >=
          meteor.duration ||
        meteor.x <
          -meteor.length *
          2 ||
        meteor.x >
          state.width +
          meteor.length *
          2 ||
        meteor.y <
          -meteor.length *
          2 ||
        meteor.y >
          state.height +
          meteor.length *
          2
      ) {
        state.meteors.splice(
          index,
          1
        );
      }
    }
  }

  function createMeteor() {
    const fromRight =
      Math.random() <
      0.72;

    const downward =
      Math.random() <
      0.82;

    const length =
      random(
        60,
        state.width <=
        560
          ? 100
          : 150
      );

    const speed =
      random(
        0.38,
        0.62
      );

    return {
      x:
        fromRight
          ? state.width +
            length
          : -length,

      y:
        random(
          -40,
          state.height *
          0.44
        ),

      velocityX:
        fromRight
          ? -speed
          : speed,

      velocityY:
        downward
          ? random(
              0.12,
              0.25
            )
          : random(
              -0.18,
              -0.08
            ),

      length,

      alpha:
        random(
          0.24,
          0.54
        ),

      width:
        random(
          0.58,
          1.05
        ),

      elapsed:
        0,

      duration:
        random(
          1350,
          2350
        ),

      color:
        Math.random() <
        0.72
          ? COLORS.blue
          : COLORS.gold
    };
  }

  function draw(
    timestamp
  ) {
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

    drawDust(
      context,
      timestamp
    );

    drawStars(
      context,
      timestamp
    );

    drawGlints(
      context,
      timestamp
    );

    drawSparkles(
      context,
      timestamp
    );

    drawMeteors(
      context
    );
  }

  function drawStaticFrame() {
    if (
      !state.context ||
      state.destroyed
    ) {
      return false;
    }

    try {
      draw(
        performance.now()
      );

      RECEIPT.staticFrameRendered =
        true;

      return true;
    } catch (error) {
      emitFailure(
        `SHOWROOM_COSMOS_STATIC_FRAME_FAILURE:${
          error &&
          error.message
            ? error.message
            : String(error)
        }`
      );

      return false;
    }
  }

  function drawDust(
    context,
    timestamp
  ) {
    context.save();

    for (
      const particle of
      state.dust
    ) {
      const shimmer =
        state.reducedMotion
          ? 1
          : 0.74 +
            Math.sin(
              timestamp *
              0.00024 +
              particle.phase
            ) *
            0.26;

      context.fillStyle =
        `rgba(${particle.color}, ${
          particle.alpha *
          shimmer
        })`;

      context.beginPath();

      context.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI *
        2
      );

      context.fill();
    }

    context.restore();
  }

  function drawStars(
    context,
    timestamp
  ) {
    context.save();

    for (
      const star of
      state.stars
    ) {
      const twinkle =
        state.reducedMotion
          ? 1
          : 0.76 +
            Math.sin(
              timestamp *
              star.twinkleRate +
              star.phase
            ) *
            0.24;

      const alpha =
        clamp(
          star.alpha *
          twinkle,
          0.022,
          0.76
        );

      context.fillStyle =
        `rgba(${star.color}, ${alpha})`;

      context.beginPath();

      context.arc(
        star.x,
        star.y,
        star.radius,
        0,
        Math.PI *
        2
      );

      context.fill();

      if (
        star.radius >
          1.08 &&
        alpha >
          0.16
      ) {
        context.fillStyle =
          `rgba(${star.color}, ${alpha * 0.13})`;

        context.beginPath();

        context.arc(
          star.x,
          star.y,
          star.radius * 2.65,
          0,
          Math.PI *
          2
        );

        context.fill();
      }
    }

    context.restore();
  }

  function drawGlints(
    context,
    timestamp
  ) {
    context.save();

    context.lineCap =
      "round";

    for (
      const glint of
      state.glints
    ) {
      const pulse =
        state.reducedMotion
          ? 0.42
          : 0.5 +
            Math.sin(
              timestamp *
              glint.rate +
              glint.phase
            ) *
            0.5;

      if (
        pulse <
        0.56
      ) {
        continue;
      }

      const alpha =
        glint.alpha *
        Math.pow(
          pulse,
          2.6
        );

      const reach =
        glint.radius *
        (
          2.0 +
          pulse *
          2.2
        );

      context.strokeStyle =
        `rgba(${glint.color}, ${alpha})`;

      context.lineWidth =
        0.52;

      const cos =
        Math.cos(
          glint.angle
        );

      const sin =
        Math.sin(
          glint.angle
        );

      context.beginPath();

      context.moveTo(
        glint.x -
          cos *
          reach,
        glint.y -
          sin *
          reach
      );

      context.lineTo(
        glint.x +
          cos *
          reach,
        glint.y +
          sin *
          reach
      );

      context.moveTo(
        glint.x -
          sin *
          reach *
          0.62,
        glint.y +
          cos *
          reach *
          0.62
      );

      context.lineTo(
        glint.x +
          sin *
          reach *
          0.62,
        glint.y -
          cos *
          reach *
          0.62
      );

      context.stroke();

      context.fillStyle =
        `rgba(${glint.color}, ${
          clamp(
            alpha *
            1.08,
            0,
            1
          )
        })`;

      context.beginPath();

      context.arc(
        glint.x,
        glint.y,
        glint.radius * 0.66,
        0,
        Math.PI *
        2
      );

      context.fill();
    }

    context.restore();
  }

  function drawSparkles(
    context,
    timestamp
  ) {
    if (
      state.reducedMotion
    ) {
      return;
    }

    context.save();

    context.lineCap =
      "round";

    for (
      const sparkle of
      state.sparkles
    ) {
      const pulse =
        0.5 +
        Math.sin(
          timestamp *
          sparkle.rate +
          sparkle.phase
        ) *
        0.5;

      if (
        pulse <
        0.68
      ) {
        continue;
      }

      const alpha =
        sparkle.alpha *
        Math.pow(
          pulse,
          2.35
        );

      const reach =
        sparkle.radius *
        (
          1.6 +
          pulse *
          1.8
        );

      context.strokeStyle =
        `rgba(${sparkle.color}, ${alpha})`;

      context.lineWidth =
        0.48;

      context.beginPath();

      context.moveTo(
        sparkle.x -
        reach,
        sparkle.y
      );

      context.lineTo(
        sparkle.x +
        reach,
        sparkle.y
      );

      context.moveTo(
        sparkle.x,
        sparkle.y -
        reach
      );

      context.lineTo(
        sparkle.x,
        sparkle.y +
        reach
      );

      context.stroke();

      context.fillStyle =
        `rgba(${sparkle.color}, ${
          clamp(
            alpha *
            1.04,
            0,
            1
          )
        })`;

      context.beginPath();

      context.arc(
        sparkle.x,
        sparkle.y,
        sparkle.radius * 0.74,
        0,
        Math.PI *
        2
      );

      context.fill();
    }

    context.restore();
  }

  function drawMeteors(
    context
  ) {
    context.save();

    context.lineCap =
      "round";

    for (
      const meteor of
      state.meteors
    ) {
      const progress =
        meteor.elapsed /
        meteor.duration;

      const fade =
        progress <
        0.2
          ? progress /
            0.2
          : progress >
              0.72
            ? (
                1 -
                progress
              ) /
              0.28
            : 1;

      const magnitude =
        Math.hypot(
          meteor.velocityX,
          meteor.velocityY
        );

      if (
        magnitude <=
        0
      ) {
        continue;
      }

      const directionX =
        meteor.velocityX /
        magnitude;

      const directionY =
        meteor.velocityY /
        magnitude;

      const tailX =
        meteor.x -
        directionX *
        meteor.length;

      const tailY =
        meteor.y -
        directionY *
        meteor.length;

      const gradient =
        context.createLinearGradient(
          tailX,
          tailY,
          meteor.x,
          meteor.y
        );

      gradient.addColorStop(
        0,
        `rgba(${meteor.color}, 0)`
      );

      gradient.addColorStop(
        0.68,
        `rgba(${meteor.color}, ${
          meteor.alpha *
          fade *
          0.34
        })`
      );

      gradient.addColorStop(
        1,
        `rgba(${COLORS.stone}, ${
          meteor.alpha *
          fade
        })`
      );

      context.strokeStyle =
        gradient;

      context.lineWidth =
        meteor.width;

      context.beginPath();

      context.moveTo(
        tailX,
        tailY
      );

      context.lineTo(
        meteor.x,
        meteor.y
      );

      context.stroke();

      context.fillStyle =
        `rgba(${COLORS.stone}, ${
          meteor.alpha *
          fade
        })`;

      context.beginPath();

      context.arc(
        meteor.x,
        meteor.y,
        meteor.width *
        1.25,
        0,
        Math.PI *
        2
      );

      context.fill();
    }

    context.restore();
  }

  function getSpacecraftByKey(
    key
  ) {
    const normalized =
      String(
        key || ""
      ).trim();

    return state.spacecrafts.find(
      craft =>
        craft.key ===
          normalized ||
        craft.id ===
          normalized
    ) ||
      null;
  }

  function scheduleAllSpacecraftFlights(
    initial =
      false
  ) {
    let scheduled =
      false;

    for (
      const craft of
      state.spacecrafts
    ) {
      scheduled =
        scheduleNextSpacecraftFlight(
          craft,
          initial
        ) ||
        scheduled;
    }

    return scheduled;
  }

  function scheduleMissingSpacecraftFlights(
    initial =
      false
  ) {
    let scheduled =
      false;

    for (
      const craft of
      state.spacecrafts
    ) {
      if (
        !craft.flight &&
        !craft.timer
      ) {
        scheduled =
          scheduleNextSpacecraftFlight(
            craft,
            initial
          ) ||
          scheduled;
      }
    }

    return scheduled;
  }

  function clearSpacecraftTimer(
    craft
  ) {
    if (
      craft &&
      craft.timer
    ) {
      clearTimeout(
        craft.timer
      );

      craft.timer =
        0;
    }
  }

  function clearAllSpacecraftTimers() {
    for (
      const craft of
      state.spacecrafts
    ) {
      clearSpacecraftTimer(
        craft
      );
    }
  }

  function scheduleNextSpacecraftFlight(
    craft,
    initial =
      false
  ) {
    if (
      !craft ||
      !canEnvironmentRun() ||
      !craft.element ||
      craft.flight
    ) {
      return false;
    }

    clearSpacecraftTimer(
      craft
    );

    const config =
      craft.config;

    const delay =
      initial
        ? random(
            config
              .initialDelayMinimumMs,
            config
              .initialDelayMaximumMs
          )
        : random(
            config
              .delayMinimumMs,
            config
              .delayMaximumMs
          );

    craft.timer =
      window.setTimeout(
        () => handleSpacecraftTimer(
          craft
        ),
        delay
      );

    emitReceipt({
      lastAction:
        `spacecraft-flight-scheduled:${craft.key}`
    });

    return true;
  }

  function handleSpacecraftTimer(
    craft
  ) {
    craft.timer =
      0;

    if (
      !canEnvironmentRun()
    ) {
      return;
    }

    launchSpacecraft(
      craft.key
    );
  }

  function launchSpacecraft(
    key =
      ""
  ) {
    const craft =
      getSpacecraftByKey(
        key
      ) ||
      chooseAvailableSpacecraft();

    if (
      !craft ||
      !canEnvironmentRun() ||
      !craft.element ||
      craft.flight
    ) {
      return false;
    }

    const config =
      craft.config;

    const path =
      generateSpacecraftPath(
        craft
      );

    const duration =
      random(
        config
          .durationMinimumMs,
        config
          .durationMaximumMs
      );

    const scale =
      random(
        state.width <=
        560
          ? config.scaleMobileMinimum
          : config.scaleDesktopMinimum,

        state.width <=
        560
          ? config.scaleMobileMaximum
          : config.scaleDesktopMaximum
      );

    const opacity =
      random(
        config.opacityMinimum,
        config.opacityMaximum
      );

    craft.flight = {
      path,

      startTime:
        performance.now(),

      duration,
      scale,
      opacity,

      completed:
        false
    };

    craft.lastPath =
      path;

    craft.element.setAttribute(
      "data-flying",
      "true"
    );

    craft.element.style.opacity =
      String(
        opacity
      );

    if (
      !state.running
    ) {
      start();
    }

    emitReceipt({
      lastAction:
        `spacecraft-flight-launched:${craft.key}`
    });

    return true;
  }

  function chooseAvailableSpacecraft() {
    const available =
      state.spacecrafts.filter(
        craft =>
          !craft.flight &&
          !craft.timer
      );

    if (
      available.length
    ) {
      return randomChoice(
        available
      );
    }

    return state.spacecrafts.find(
      craft => !craft.flight
    ) ||
      null;
  }

  function hideAndResetSpacecraft(
    craft
  ) {
    if (
      !craft ||
      !craft.element
    ) {
      return;
    }

    craft.element.setAttribute(
      "data-flying",
      "false"
    );

    craft.element.style.opacity =
      "0";

    craft.element.style.transform =
      "translate3d(-280px, -180px, 0) rotate(0deg) scale(0.58)";
  }

  function hideAndResetAllSpacecraft() {
    for (
      const craft of
      state.spacecrafts
    ) {
      hideAndResetSpacecraft(
        craft
      );
    }
  }

  function cancelSpacecraftFlight(
    craft,
    scheduleNext =
      false,
    reason =
      "cancelled",
    publish =
      true
  ) {
    if (!craft) {
      return false;
    }

    clearSpacecraftTimer(
      craft
    );

    craft.flight =
      null;

    hideAndResetSpacecraft(
      craft
    );

    if (
      scheduleNext &&
      canEnvironmentRun()
    ) {
      scheduleNextSpacecraftFlight(
        craft,
        false
      );
    }

    if (
      publish
    ) {
      emitReceipt({
        lastAction:
          `spacecraft-flight-cancelled:${craft.key}:${normalizeReason(reason)}`
      });
    }

    return true;
  }

  function cancelAllSpacecraftFlights(
    reason =
      "cancelled",
    publish =
      true
  ) {
    let changed =
      false;

    for (
      const craft of
      state.spacecrafts
    ) {
      clearSpacecraftTimer(
        craft
      );

      if (
        craft.flight
      ) {
        changed =
          true;
      }

      craft.flight =
        null;

      hideAndResetSpacecraft(
        craft
      );
    }

    if (
      publish
    ) {
      emitReceipt({
        lastAction:
          `spacecraft-flights-cancelled:${normalizeReason(reason)}`
      });
    }

    return changed;
  }

  function updateSpacecrafts(
    timestamp
  ) {
    for (
      const craft of
      state.spacecrafts
    ) {
      updateSpacecraft(
        craft,
        timestamp
      );
    }
  }

  function updateSpacecraft(
    craft,
    timestamp
  ) {
    const flight =
      craft.flight;

    if (
      !flight ||
      !craft.element
    ) {
      return;
    }

    const rawProgress =
      (
        timestamp -
        flight.startTime
      ) /
      flight.duration;

    if (
      rawProgress >=
      1
    ) {
      completeSpacecraftFlight(
        craft
      );

      return;
    }

    const progress =
      clamp(
        rawProgress,
        0,
        1
      );

    const eased =
      easeInOutCubic(
        progress
      );

    const point =
      cubicPoint(
        flight.path,
        eased
      );

    const tangent =
      cubicTangent(
        flight.path,
        eased
      );

    const angle =
      Math.atan2(
        tangent.y,
        tangent.x
      ) *
      (
        180 /
        Math.PI
      );

    const fadeIn =
      clamp(
        progress /
        0.08,
        0,
        1
      );

    const fadeOut =
      clamp(
        (
          1 -
          progress
        ) /
        0.10,
        0,
        1
      );

    const opacity =
      flight.opacity *
      Math.min(
        fadeIn,
        fadeOut
      );

    const depthPulse =
      0.97 +
      Math.sin(
        progress *
        Math.PI
      ) *
      (
        craft.key ===
          "secondary"
          ? 0.045
          : 0.07
      );

    const scale =
      flight.scale *
      depthPulse;

    craft.element.style.opacity =
      String(
        opacity
      );

    craft.element.style.transform =
      `translate3d(${point.x}px, ${point.y}px, 0) ` +
      `rotate(${angle}deg) ` +
      `scale(${scale})`;
  }

  function completeSpacecraftFlight(
    craft
  ) {
    craft.flight =
      null;

    hideAndResetSpacecraft(
      craft
    );

    if (
      canEnvironmentRun()
    ) {
      scheduleNextSpacecraftFlight(
        craft,
        false
      );
    }

    emitReceipt({
      lastAction:
        `spacecraft-flight-completed:${craft.key}`
    });
  }

  function generateSpacecraftPath(
    craft
  ) {
    const protectedRects =
      collectProtectedRects();

    let bestPath =
      null;

    let bestScore =
      Number.POSITIVE_INFINITY;

    for (
      let attempt =
        0;
      attempt <
        CONFIG
          .spacecraftCandidateCount;
      attempt +=
        1
    ) {
      const candidate =
        createRandomPath(
          craft
        );

      const score =
        scorePath(
          candidate,
          protectedRects
        ) +
        scorePathSimilarity(
          candidate,
          craft.lastPath
        ) +
        scoreActivePathConflict(
          candidate,
          craft
        );

      if (
        score <
        bestScore
      ) {
        bestScore =
          score;

        bestPath =
          candidate;
      }

      if (
        score <=
        0.42
      ) {
        break;
      }
    }

    return (
      bestPath ||
      createRandomPath(
        craft
      )
    );
  }

  function createRandomPath(
    craft
  ) {
    const config =
      craft.config;

    const marginX =
      Math.max(
        180,
        state.width *
        0.16
      );

    const marginY =
      Math.max(
        120,
        state.height *
        0.14
      );

    const horizontal =
      Math.random() <
      config.horizontalBias;

    const reverse =
      Math.random() <
      0.5;

    let start;
    let end;

    if (
      horizontal
    ) {
      start = {
        x:
          reverse
            ? state.width +
              marginX
            : -marginX,

        y:
          random(
            -marginY *
            0.22,
            state.height *
            0.84
          )
      };

      end = {
        x:
          reverse
            ? -marginX
            : state.width +
              marginX,

        y:
          clamp(
            start.y +
            random(
              -state.height *
              0.36,
              state.height *
              0.36
            ),
            -marginY *
            0.45,
            state.height +
            marginY *
            0.45
          )
      };
    } else {
      start = {
        x:
          random(
            -marginX *
            0.25,
            state.width +
            marginX *
            0.25
          ),

        y:
          reverse
            ? state.height +
              marginY
            : -marginY
      };

      end = {
        x:
          clamp(
            start.x +
            random(
              -state.width *
              0.46,
              state.width *
              0.46
            ),
            -marginX *
            0.45,
            state.width +
            marginX *
            0.45
          ),

        y:
          reverse
            ? -marginY
            : state.height +
              marginY
      };
    }

    const dx =
      end.x -
      start.x;

    const dy =
      end.y -
      start.y;

    const normalLength =
      Math.max(
        1,
        Math.hypot(
          dx,
          dy
        )
      );

    const normalX =
      -dy /
      normalLength;

    const normalY =
      dx /
      normalLength;

    const curveStrength =
      random(
        craft.key ===
          "secondary"
          ? 0.10
          : 0.08,
        craft.key ===
          "secondary"
          ? 0.34
          : 0.28
      ) *
      Math.min(
        state.width,
        state.height
      ) *
      randomSign();

    const control1 = {
      x:
        start.x +
        dx *
        random(
          0.18,
          0.36
        ) +
        normalX *
        curveStrength,

      y:
        start.y +
        dy *
        random(
          0.18,
          0.36
        ) +
        normalY *
        curveStrength
    };

    const control2 = {
      x:
        start.x +
        dx *
        random(
          0.64,
          0.84
        ) -
        normalX *
        curveStrength *
        random(
          0.45,
          1
        ),

      y:
        start.y +
        dy *
        random(
          0.64,
          0.84
        ) -
        normalY *
        curveStrength *
        random(
          0.45,
          1
        )
    };

    return {
      start,
      control1,
      control2,
      end
    };
  }

  function collectProtectedRects() {
    const selectors =
      CONFIG
        .protectedSelectors
        .join(",");

    const nodes =
      document.querySelectorAll(
        selectors
      );

    const padding =
      state.width <=
      560
        ? 18
        : 34;

    return Array.from(
      nodes
    )
      .filter(
        node => {
          const style =
            window.getComputedStyle(
              node
            );

          return (
            style.display !==
              "none" &&
            style.visibility !==
              "hidden" &&
            Number.parseFloat(
              style.opacity ||
              "1"
            ) >
              0.05
          );
        }
      )
      .map(
        node => {
          const rect =
            node.getBoundingClientRect();

          return {
            left:
              rect.left -
              padding,

            right:
              rect.right +
              padding,

            top:
              rect.top -
              padding,

            bottom:
              rect.bottom +
              padding
          };
        }
      )
      .filter(
        rect =>
          (
            rect.right >
              0 &&
            rect.left <
              state.width &&
            rect.bottom >
              0 &&
            rect.top <
              state.height
          )
      );
  }

  function scorePath(
    path,
    protectedRects
  ) {
    let score =
      0;

    const samples =
      30;

    for (
      let index =
        0;
      index <=
        samples;
      index +=
        1
    ) {
      const t =
        index /
        samples;

      const point =
        cubicPoint(
          path,
          t
        );

      for (
        const rect of
        protectedRects
      ) {
        if (
          point.x >=
            rect.left &&
          point.x <=
            rect.right &&
          point.y >=
            rect.top &&
          point.y <=
            rect.bottom
        ) {
          score +=
            1;
        }
      }

      const centerDistance =
        Math.abs(
          point.x -
          state.width *
          0.5
        );

      const centerPenalty =
        centerDistance <
        state.width *
        0.16
          ? 0.06
          : 0;

      score +=
        centerPenalty;
    }

    return score;
  }

  function scorePathSimilarity(
    path,
    previousPath
  ) {
    if (
      !previousPath
    ) {
      return 0;
    }

    const startDistance =
      Math.hypot(
        path.start.x -
        previousPath.start.x,

        path.start.y -
        previousPath.start.y
      );

    const endDistance =
      Math.hypot(
        path.end.x -
        previousPath.end.x,

        path.end.y -
        previousPath.end.y
      );

    const controlDistance =
      Math.hypot(
        path.control1.x -
        previousPath.control1.x,

        path.control1.y -
        previousPath.control1.y
      );

    const threshold =
      Math.min(
        state.width,
        state.height
      ) *
      0.32;

    let penalty =
      0;

    if (
      startDistance <
      threshold
    ) {
      penalty +=
        3;
    }

    if (
      endDistance <
      threshold
    ) {
      penalty +=
        3;
    }

    if (
      controlDistance <
      threshold
    ) {
      penalty +=
        2;
    }

    return penalty;
  }

  function scoreActivePathConflict(
    path,
    craft
  ) {
    let penalty =
      0;

    const samples =
      12;

    for (
      const other of
      state.spacecrafts
    ) {
      if (
        other ===
          craft ||
        !other.flight
      ) {
        continue;
      }

      for (
        let index =
          0;
        index <=
          samples;
        index +=
          1
      ) {
        const t =
          index /
          samples;

        const candidatePoint =
          cubicPoint(
            path,
            t
          );

        const otherPoint =
          cubicPoint(
            other.flight.path,
            t
          );

        const distance =
          Math.hypot(
            candidatePoint.x -
              otherPoint.x,
            candidatePoint.y -
              otherPoint.y
          );

        if (
          distance <
          Math.min(
            state.width,
            state.height
          ) *
          CONFIG.spacecraftPathSeparationBias
        ) {
          penalty +=
            0.32;
        }
      }
    }

    return penalty;
  }

  function cubicPoint(
    path,
    t
  ) {
    const oneMinusT =
      1 -
      t;

    const oneMinusTSquared =
      oneMinusT *
      oneMinusT;

    const tSquared =
      t *
      t;

    return {
      x:
        oneMinusTSquared *
        oneMinusT *
        path.start.x +
        3 *
        oneMinusTSquared *
        t *
        path.control1.x +
        3 *
        oneMinusT *
        tSquared *
        path.control2.x +
        tSquared *
        t *
        path.end.x,

      y:
        oneMinusTSquared *
        oneMinusT *
        path.start.y +
        3 *
        oneMinusTSquared *
        t *
        path.control1.y +
        3 *
        oneMinusT *
        tSquared *
        path.control2.y +
        tSquared *
        t *
        path.end.y
    };
  }

  function cubicTangent(
    path,
    t
  ) {
    const oneMinusT =
      1 -
      t;

    return {
      x:
        3 *
        oneMinusT *
        oneMinusT *
        (
          path.control1.x -
          path.start.x
        ) +
        6 *
        oneMinusT *
        t *
        (
          path.control2.x -
          path.control1.x
        ) +
        3 *
        t *
        t *
        (
          path.end.x -
          path.control2.x
        ),

      y:
        3 *
        oneMinusT *
        oneMinusT *
        (
          path.control1.y -
          path.start.y
        ) +
        6 *
        oneMinusT *
        t *
        (
          path.control2.y -
          path.control1.y
        ) +
        3 *
        t *
        t *
        (
          path.end.y -
          path.control2.y
        )
    };
  }

  function removeCreatedSurfaces() {
    if (
      state.createdLayer &&
      state.layer
    ) {
      state.layer.remove();
    }

    if (
      state.createdStyle
    ) {
      document
        .getElementById(
          STYLE_ID
        )
        ?.remove();
    }

    state.createdLayer =
      false;

    state.createdStyle =
      false;

    state.layer =
      null;

    state.canvas =
      null;

    state.context =
      null;

    state.spacecrafts =
      [];
  }

  function clearCollections() {
    state.stars.length =
      0;

    state.dust.length =
      0;

    state.glints.length =
      0;

    state.sparkles.length =
      0;

    state.meteors.length =
      0;

    state.renderCostSamples.length =
      0;

    for (
      const craft of
      state.spacecrafts
    ) {
      craft.flight =
        null;

      craft.lastPath =
        null;

      craft.timer =
        0;
    }
  }

  function rollbackPartialInitialization(
    reason
  ) {
    stopAnimationFrame();
    clearAllSpacecraftTimers();
    hideAndResetAllSpacecraft();
    uninstallObservers();
    removeCreatedSurfaces();
    clearCollections();

    state.initialized =
      false;

    state.suspended =
      true;

    state.suspensionReasons
      .add(
        "initialization-failure"
      );

    api.initialized =
      false;

    emitFailure(
      reason
    );
  }

  function destroy(
    reason =
      "api"
  ) {
    if (
      state.destroyed
    ) {
      return true;
    }

    state.destroyed =
      true;

    state.pageActive =
      false;

    state.suspensionReasons
      .clear();

    state.suspensionReasons
      .add(
        "destroyed"
      );

    stopAnimationFrame();
    clearAllSpacecraftTimers();
    hideAndResetAllSpacecraft();
    uninstallObservers();
    removeCreatedSurfaces();
    clearCollections();

    state.motionQuery =
      null;

    state.controller =
      null;

    state.initialized =
      false;

    state.running =
      false;

    state.suspended =
      false;

    api.initialized =
      false;

    const finalReceipt =
      emitReceipt({
        status:
          "destroyed",

        lastAction:
          `cosmos-destroyed:${normalizeReason(reason)}`,

        lastFailure:
          null,

        failureReason:
          null,

        staticFrameRendered:
          false
      });

    dispatch(
      DESTROYED_EVENT,
      {
        reason:
          normalizeReason(
            reason
          ),

        destroyed:
          true,

        receipt:
          finalReceipt
      }
    );

    state.root =
      null;

    state.receiptOutput =
      null;

    return true;
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
})();
