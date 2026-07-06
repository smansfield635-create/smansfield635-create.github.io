/* TARGET FILE: /laws/index.planet.js */
/* COMPLETE FILE */
/* LAWS_CENTER_PLANET_BRIDGE_TNT_v1 */

/*
  Contract:
  LAWS_CENTER_PLANET_BRIDGE_TNT_v1

  Purpose:
  - Mount the upstream Showroom/Audralia miniature planet renderer into
    the Laws center planet mount.
  - Keep the Laws center globe as a decorative visual object only.
  - Preserve Laws compass semantic click authority on
    [data-upstream-compass-control].
  - Publish Laws-specific receipts without duplicating the upstream
    Showroom planet renderer.

  Upstream dependencies:
  - /assets/audralia/audralia.planet.js
  - window.DGBAudraliaPlanetGeometry
  - AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1
  - /showroom/index.planet.js
  - window.SHOWROOM_PLANET
  - SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1

  Laws authority:
  - This file exposes window.LAWS_CENTER_PLANET.
  - The visible planet is decorative.
  - Click / tap authority remains [data-upstream-compass-control].
  - Route authority remains the Laws controller.
  - The semantic outcome remains Main Compass return selection.

  Does not own:
  - semantic navigation;
  - route decisions;
  - controller state;
  - compositor state;
  - crystal geometry or drawing;
  - pointer or gesture interpretation;
  - Laws route registry;
  - Laws evidence status;
  - Audralia geometry mutation;
  - Showroom renderer mutation.
*/

(() => {
  "use strict";

  const CONTRACT =
    "LAWS_CENTER_PLANET_BRIDGE_TNT_v1";

  const OWNER =
    "/laws/index.planet.js";

  const GLOBAL_NAME =
    "LAWS_CENTER_PLANET";

  const UPSTREAM_GLOBAL =
    "SHOWROOM_PLANET";

  const UPSTREAM_CONTRACT =
    "SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1";

  const AUDRALIA_GEOMETRY_GLOBAL =
    "DGBAudraliaPlanetGeometry";

  const AUDRALIA_GEOMETRY_CONTRACT =
    "AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1";

  const SELECTORS = Object.freeze({
    root:
      "[data-laws-root]",

    mount:
      "[data-laws-planet-mount]",

    receipt:
      "[data-laws-planet-receipt]",

    compassControl:
      "[data-upstream-compass-control]"
  });

  const EVENTS = Object.freeze({
    ready:
      "LAWS_CENTER_PLANET_READY",

    receipt:
      "LAWS_CENTER_PLANET_RECEIPT",

    failure:
      "LAWS_CENTER_PLANET_FAILURE",

    disposed:
      "LAWS_CENTER_PLANET_DISPOSED"
  });

  const STATES = Object.freeze({
    moduleLoaded:
      "module-loaded",

    waiting:
      "waiting",

    mounted:
      "mounted",

    ready:
      "ready",

    failed:
      "failed",

    unmounted:
      "unmounted",

    disposed:
      "disposed"
  });

  const DEFAULTS = Object.freeze({
    maximumAttempts:
      50,

    pollMs:
      100,

    terrainLevel:
      4,

    oceanLevel:
      3,

    cloudLevel:
      3,

    atmosphereLevel:
      2
  });

  const state = {
    root:
      null,

    mount:
      null,

    receiptTarget:
      null,

    upstream:
      null,

    mounted:
      false,

    ready:
      false,

    failed:
      false,

    disposed:
      false,

    waiting:
      false,

    attempts:
      0,

    timer:
      0,

    lastReceipt:
      null,

    counters: {
      moduleLoads:
        0,

      mountAttempts:
        0,

      mounts:
        0,

      ready:
        0,

      failures:
        0,

      unmounts:
        0,

      disposals:
        0,

      receipts:
        0
    }
  };

  function normalize(value) {
    return String(
      value == null
        ? ""
        : value
    ).trim();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return (
      typeof Element !== "undefined" &&
      value instanceof Element
    );
  }

  function getRoot() {
    return document.querySelector(
      SELECTORS.root
    );
  }

  function getMount() {
    return document.querySelector(
      SELECTORS.mount
    );
  }

  function getReceiptTarget() {
    return document.querySelector(
      SELECTORS.receipt
    );
  }

  function getCompassControl() {
    return document.querySelector(
      SELECTORS.compassControl
    );
  }

  function getUpstream() {
    const upstream =
      window[UPSTREAM_GLOBAL];

    if (
      !upstream ||
      typeof upstream !== "object"
    ) {
      return null;
    }

    if (
      upstream.contract !==
      UPSTREAM_CONTRACT
    ) {
      return null;
    }

    if (
      typeof upstream.mount !== "function"
    ) {
      return null;
    }

    return upstream;
  }

  function geometryAvailable() {
    const authority =
      window[AUDRALIA_GEOMETRY_GLOBAL];

    if (
      !authority ||
      typeof authority !== "object"
    ) {
      return false;
    }

    if (
      authority.contract ===
      AUDRALIA_GEOMETRY_CONTRACT
    ) {
      return true;
    }

    if (
      authority.status &&
      authority.status.contract ===
      AUDRALIA_GEOMETRY_CONTRACT
    ) {
      return true;
    }

    if (
      typeof authority.getStatus === "function"
    ) {
      try {
        const status =
          authority.getStatus();

        return Boolean(
          status &&
          status.contract ===
            AUDRALIA_GEOMETRY_CONTRACT
        );
      } catch {
        return false;
      }
    }

    return false;
  }

  function currentStateName() {
    if (state.disposed) {
      return STATES.disposed;
    }

    if (state.failed) {
      return STATES.failed;
    }

    if (state.ready) {
      return STATES.ready;
    }

    if (state.mounted) {
      return STATES.mounted;
    }

    if (state.waiting) {
      return STATES.waiting;
    }

    return STATES.moduleLoaded;
  }

  function setRootStatus(value) {
    const root =
      state.root ||
      getRoot();

    if (!root) {
      return;
    }

    state.root =
      root;

    root.setAttribute(
      "data-laws-planet-status",
      value
    );

    root.setAttribute(
      "data-laws-center-planet",
      "showroom-audralia-webgl"
    );

    root.setAttribute(
      "data-laws-center-planet-authority",
      "decorative-only"
    );

    root.setAttribute(
      "data-laws-center-planet-route-authority",
      "false"
    );

    root.setAttribute(
      "data-laws-center-planet-click-authority",
      "false"
    );

    root.setAttribute(
      "data-laws-center-planet-click-authority-owner",
      "data-upstream-compass-control"
    );
  }

  function createReceipt(
    event,
    detail = {}
  ) {
    return Object.freeze({
      contract:
        CONTRACT,

      owner:
        OWNER,

      event:
        event,

      timestamp:
        nowIso(),

      state:
        currentStateName(),

      upstreamGlobal:
        UPSTREAM_GLOBAL,

      upstreamContract:
        UPSTREAM_CONTRACT,

      upstreamAvailable:
        Boolean(getUpstream()),

      geometryGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      geometryContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      geometryAvailable:
        geometryAvailable(),

      mountSelector:
        SELECTORS.mount,

      mountAvailable:
        Boolean(state.mount || getMount()),

      compassControlSelector:
        SELECTORS.compassControl,

      compassControlAvailable:
        Boolean(getCompassControl()),

      mounted:
        state.mounted,

      ready:
        state.ready,

      failed:
        state.failed,

      disposed:
        state.disposed,

      waiting:
        state.waiting,

      attempts:
        state.attempts,

      visualIdentity:
        "mini-audralia",

      rendererMode:
        "upstream-showroom-webgl-3d",

      navigationMeaning:
        "main-compass-return-selection",

      decorative:
        true,

      clickAuthority:
        false,

      clickAuthorityOwner:
        "[data-upstream-compass-control]",

      semanticActivationOwned:
        false,

      navigationAuthority:
        false,

      routeAuthority:
        false,

      controllerAuthority:
        false,

      controllerStateMutated:
        false,

      compositorAuthority:
        false,

      compositorStateMutated:
        false,

      crystalsAuthority:
        false,

      crystalsStateMutated:
        false,

      interactionsAuthority:
        false,

      interactionsStateMutated:
        false,

      gestureAuthority:
        false,

      lawsRegistryMutated:
        false,

      lawsEvidenceAuthority:
        false,

      empiricalClaimAuthority:
        false,

      audraliaGeometryMutated:
        false,

      showroomRendererMutated:
        false,

      visualPassClaimed:
        false,

      runtimeExecutionClaimed:
        false,

      productionAuthorization:
        false,

      deploymentAuthorization:
        false,

      counters: {
        ...state.counters
      },

      ...detail
    });
  }

  function writeReceipt(
    event,
    detail = {}
  ) {
    const payload =
      createReceipt(
        event,
        detail
      );

    state.lastReceipt =
      payload;

    state.counters.receipts +=
      1;

    const target =
      state.receiptTarget ||
      getReceiptTarget();

    if (target) {
      state.receiptTarget =
        target;

      const serialized =
        JSON.stringify(payload);

      if ("value" in target) {
        target.value =
          serialized;
      }

      target.textContent =
        serialized;
    }

    window.dispatchEvent(
      new CustomEvent(
        EVENTS.receipt,
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function dispatch(
    eventName,
    event,
    detail = {}
  ) {
    const payload =
      writeReceipt(
        event,
        detail
      );

    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function clearTimer() {
    if (state.timer) {
      window.clearInterval(
        state.timer
      );
    }

    state.timer =
      0;
  }

  function resolveSurfaces() {
    state.root =
      getRoot();

    state.mount =
      getMount();

    state.receiptTarget =
      getReceiptTarget();

    state.upstream =
      getUpstream();

    return Boolean(
      state.root &&
      state.mount &&
      state.upstream
    );
  }

  function markMounted(detail = {}) {
    state.mounted =
      true;

    state.ready =
      true;

    state.failed =
      false;

    state.waiting =
      false;

    state.counters.mounts +=
      1;

    state.counters.ready +=
      1;

    if (state.mount) {
      state.mount.setAttribute(
        "data-laws-planet-mounted",
        "true"
      );

      state.mount.setAttribute(
        "data-laws-planet-decorative",
        "true"
      );

      state.mount.setAttribute(
        "data-laws-planet-click-authority",
        "false"
      );

      state.mount.setAttribute(
        "data-laws-planet-navigation-authority",
        "false"
      );

      state.mount.setAttribute(
        "data-laws-planet-route-authority",
        "false"
      );
    }

    setRootStatus(
      "ready"
    );

    dispatch(
      EVENTS.ready,
      "ready",
      {
        reason:
          "laws-center-planet-mounted",

        ...detail
      }
    );
  }

  function fail(
    reason,
    detail = {}
  ) {
    clearTimer();

    state.failed =
      true;

    state.ready =
      false;

    state.waiting =
      false;

    state.counters.failures +=
      1;

    setRootStatus(
      "failed"
    );

    dispatch(
      EVENTS.failure,
      "failure",
      {
        reason:
          normalize(reason) ||
          "laws-center-planet-failure",

        ...detail
      }
    );

    return false;
  }

  function mountOnce(options = {}) {
    if (state.disposed) {
      return false;
    }

    state.counters.mountAttempts +=
      1;

    resolveSurfaces();

    if (!state.mount) {
      return false;
    }

    if (
      state.mount.getAttribute(
        "data-laws-planet-mounted"
      ) === "true"
    ) {
      state.mounted =
        true;

      state.ready =
        true;

      state.failed =
        false;

      setRootStatus(
        "ready"
      );

      return true;
    }

    if (!state.upstream) {
      return false;
    }

    try {
      const result =
        state.upstream.mount(
          state.mount,
          {
            terrainLevel:
              options.terrainLevel ||
              DEFAULTS.terrainLevel,

            oceanLevel:
              options.oceanLevel ||
              DEFAULTS.oceanLevel,

            cloudLevel:
              options.cloudLevel ||
              DEFAULTS.cloudLevel,

            atmosphereLevel:
              options.atmosphereLevel ||
              DEFAULTS.atmosphereLevel,

            receiptTarget:
              state.receiptTarget ||
              getReceiptTarget()
          }
        );

      if (result === false) {
        return false;
      }

      markMounted({
        upstreamMountResult:
          result !== false,

        sourceGeometryAvailable:
          geometryAvailable(),

        showroomPlanetAvailable:
          Boolean(state.upstream)
      });

      return true;
    } catch (error) {
      return fail(
        "upstream-mount-threw",
        {
          error:
            error instanceof Error
              ? {
                  name:
                    error.name,

                  message:
                    error.message
                }
              : {
                  name:
                    "Error",

                  message:
                    String(error)
                }
        }
      );
    }
  }

  function mount(options = {}) {
    if (state.disposed) {
      return false;
    }

    if (mountOnce(options)) {
      return true;
    }

    state.waiting =
      true;

    state.failed =
      false;

    setRootStatus(
      "waiting"
    );

    writeReceipt(
      "waiting",
      {
        reason:
          "waiting-for-mount-surfaces-or-upstream-renderer",

        requiredMount:
          SELECTORS.mount,

        requiredUpstreamGlobal:
          UPSTREAM_GLOBAL,

        requiredUpstreamContract:
          UPSTREAM_CONTRACT,

        requiredGeometryGlobal:
          AUDRALIA_GEOMETRY_GLOBAL,

        requiredGeometryContract:
          AUDRALIA_GEOMETRY_CONTRACT
      }
    );

    clearTimer();

    state.attempts =
      0;

    state.timer =
      window.setInterval(
        () => {
          state.attempts +=
            1;

          if (mountOnce(options)) {
            clearTimer();
            return;
          }

          if (
            state.attempts >=
            DEFAULTS.maximumAttempts
          ) {
            fail(
              "mount-timeout",
              {
                maximumAttempts:
                  DEFAULTS.maximumAttempts,

                pollMs:
                  DEFAULTS.pollMs,

                mountAvailable:
                  Boolean(getMount()),

                upstreamAvailable:
                  Boolean(getUpstream()),

                geometryAvailable:
                  geometryAvailable()
              }
            );
          }
        },
        DEFAULTS.pollMs
      );

    return true;
  }

  function unmount(reason = "api") {
    clearTimer();

    if (
      state.upstream &&
      typeof state.upstream.unmount === "function"
    ) {
      try {
        state.upstream.unmount(
          `laws-center-planet:${normalize(reason) || "api"}`
        );
      } catch {
        /* Upstream unmount is best-effort. */
      }
    }

    if (state.mount) {
      state.mount.removeAttribute(
        "data-laws-planet-mounted"
      );

      state.mount.removeAttribute(
        "data-laws-planet-decorative"
      );

      state.mount.removeAttribute(
        "data-laws-planet-click-authority"
      );

      state.mount.removeAttribute(
        "data-laws-planet-navigation-authority"
      );

      state.mount.removeAttribute(
        "data-laws-planet-route-authority"
      );
    }

    state.mounted =
      false;

    state.ready =
      false;

    state.failed =
      false;

    state.waiting =
      false;

    state.counters.unmounts +=
      1;

    setRootStatus(
      "unmounted"
    );

    writeReceipt(
      "unmounted",
      {
        reason:
          normalize(reason) ||
          "api"
      }
    );

    return true;
  }

  function pause(reason = "api") {
    if (
      state.upstream &&
      typeof state.upstream.pause === "function"
    ) {
      try {
        state.upstream.pause(
          `laws-center-planet:${normalize(reason) || "api"}`
        );
      } catch {
        /* Upstream pause is best-effort. */
      }
    }

    writeReceipt(
      "paused",
      {
        reason:
          normalize(reason) ||
          "api"
      }
    );

    return true;
  }

  function resume(reason = "api") {
    if (
      state.upstream &&
      typeof state.upstream.resume === "function"
    ) {
      try {
        state.upstream.resume(
          `laws-center-planet:${normalize(reason) || "api"}`
        );
      } catch {
        /* Upstream resume is best-effort. */
      }
    }

    writeReceipt(
      "resumed",
      {
        reason:
          normalize(reason) ||
          "api"
      }
    );

    return true;
  }

  function setReducedMotion(value, reason = "api") {
    if (
      state.upstream &&
      typeof state.upstream.setReducedMotion === "function"
    ) {
      try {
        state.upstream.setReducedMotion(
          Boolean(value),
          `laws-center-planet:${normalize(reason) || "api"}`
        );
      } catch {
        /* Upstream reduced-motion call is best-effort. */
      }
    }

    writeReceipt(
      "reduced-motion-updated",
      {
        reducedMotion:
          Boolean(value),

        reason:
          normalize(reason) ||
          "api"
      }
    );

    return true;
  }

  function dispose(reason = "api") {
    if (state.disposed) {
      return true;
    }

    unmount(
      `dispose:${normalize(reason) || "api"}`
    );

    clearTimer();

    state.disposed =
      true;

    state.ready =
      false;

    state.failed =
      false;

    state.waiting =
      false;

    state.counters.disposals +=
      1;

    setRootStatus(
      "disposed"
    );

    dispatch(
      EVENTS.disposed,
      "disposed",
      {
        reason:
          normalize(reason) ||
          "api",

        localBridgeDisposed:
          true,

        upstreamRendererDisposed:
          false,

        upstreamRendererMutation:
          false
      }
    );

    return true;
  }

  function getState() {
    return createReceipt(
      "state-requested",
      {
        lastReceipt:
          state.lastReceipt
            ? {
                event:
                  state.lastReceipt.event,

                timestamp:
                  state.lastReceipt.timestamp,

                state:
                  state.lastReceipt.state
              }
            : null,

        emittedDomSurfaces:
          [
            ".showroom-planet-root",
            ".showroom-planet-glow",
            ".showroom-planet-orbit-line",
            ".showroom-planet-shell",
            ".showroom-planet-body",
            ".showroom-planet-canvas",
            ".showroom-planet-atmosphere",
            ".showroom-planet-rim",
            ".showroom-planet-terminator",
            ".showroom-planet-shadow",
            ".showroom-planet-meridian",
            ".showroom-planet-fulcrum",
            ".showroom-planet-axis",
            ".showroom-planet-fallback"
          ]
      }
    );
  }

  function initialize() {
    state.counters.moduleLoads +=
      1;

    resolveSurfaces();

    writeReceipt(
      "module-loaded",
      {
        global:
          GLOBAL_NAME,

        autoMount:
          true,

        bridgeOnly:
          true,

        upstreamRendererDuplicated:
          false,

        requiresExternalMountTarget:
          true,

        requiredMount:
          SELECTORS.mount,

        requiredUpstreamGlobal:
          UPSTREAM_GLOBAL,

        requiredUpstreamContract:
          UPSTREAM_CONTRACT,

        requiredGeometryGlobal:
          AUDRALIA_GEOMETRY_GLOBAL,

        requiredGeometryContract:
          AUDRALIA_GEOMETRY_CONTRACT,

        decorative:
          true,

        clickAuthority:
          false,

        clickAuthorityOwner:
          "[data-upstream-compass-control]",

        navigationAuthority:
          false,

        routeAuthority:
          false,

        productionAuthorization:
          false,

        deploymentAuthorization:
          false
      }
    );

    mount();
  }

  const api =
    Object.freeze({
      contract:
        CONTRACT,

      owner:
        OWNER,

      upstreamGlobal:
        UPSTREAM_GLOBAL,

      upstreamContract:
        UPSTREAM_CONTRACT,

      sourceAuthorityGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      sourceAuthorityContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      visualIdentity:
        "mini-audralia",

      rendererMode:
        "upstream-showroom-webgl-3d",

      navigationMeaning:
        "main-compass-return-selection",

      decorative:
        true,

      getState,

      mount,

      unmount,

      dispose,

      pause,

      resume,

      setReducedMotion
    });

  Object.defineProperty(
    window,
    GLOBAL_NAME,
    {
      configurable:
        true,

      enumerable:
        false,

      writable:
        false,

      value:
        api
    }
  );

  if (document.readyState === "loading") {
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
