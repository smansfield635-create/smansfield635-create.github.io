/* TARGET FILE: /showroom/index.planet.js */
/* NEW FILE */
/* GROUP_B_PLANET_MODULE_AFTER_CONSUMER_COMPATIBILITY */
/* SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1 */

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1";

  const OWNER =
    "/showroom/index.planet.js";

  const GLOBAL_NAME =
    "SHOWROOM_PLANET";

  const EVENTS = Object.freeze({
    ready:
      "SHOWROOM_PLANET_READY",

    failure:
      "SHOWROOM_PLANET_FAILURE",

    disposed:
      "SHOWROOM_PLANET_DISPOSED",

    receipt:
      "SHOWROOM_PLANET_RECEIPT"
  });

  const ATTRIBUTES = Object.freeze({
    root:
      "data-showroom-planet-root",

    state:
      "data-showroom-planet-state",

    reducedMotion:
      "data-showroom-planet-reduced-motion",

    layer:
      "data-showroom-planet-layer",

    decorative:
      "data-showroom-planet-decorative"
  });

  const CLASS_NAMES = Object.freeze({
    root:
      "showroom-planet-root",

    shell:
      "showroom-planet-shell",

    atmosphere:
      "showroom-planet-atmosphere",

    surface:
      "showroom-planet-surface",

    axis:
      "showroom-planet-axis",

    glow:
      "showroom-planet-glow",

    fallback:
      "showroom-planet-fallback"
  });

  const STATES = Object.freeze({
    idle:
      "idle",

    mounted:
      "mounted",

    ready:
      "ready",

    paused:
      "paused",

    failed:
      "failed",

    unmounted:
      "unmounted",

    disposed:
      "disposed"
  });

  const DEFAULTS = Object.freeze({
    rotationDurationMs:
      36000,

    receiptAttribute:
      "data-showroom-planet-receipt",

    reducedMotionQuery:
      "(prefers-reduced-motion: reduce)"
  });

  const state = {
    target: null,
    root: null,
    receiptTarget: null,

    mounted: false,
    ready: false,
    failed: false,
    disposed: false,
    paused: false,

    reducedMotion: false,
    reducedMotionMedia: null,
    reducedMotionListener: null,

    frameId: 0,
    animationStartedAt: 0,
    pauseReason: "",
    lastReceipt: null,

    counters: {
      mounts: 0,
      unmounts: 0,
      ready: 0,
      failures: 0,
      pauses: 0,
      resumes: 0,
      disposals: 0,
      receipts: 0,
      animationFrames: 0
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

  function freezePlain(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return Object.freeze(
        value.map(freezePlain)
      );
    }

    const output = {};

    for (
      const [
        key,
        entry
      ] of Object.entries(value)
    ) {
      output[key] =
        freezePlain(entry);
    }

    return Object.freeze(output);
  }

  function currentStateName() {
    if (state.disposed) {
      return STATES.disposed;
    }

    if (state.failed) {
      return STATES.failed;
    }

    if (!state.mounted) {
      return STATES.unmounted;
    }

    if (state.paused) {
      return STATES.paused;
    }

    if (state.ready) {
      return STATES.ready;
    }

    return STATES.mounted;
  }

  function createReceipt(
    event,
    detail = {}
  ) {
    return freezePlain({
      contract:
        CONTRACT,

      owner:
        OWNER,

      event,

      timestamp:
        nowIso(),

      state:
        currentStateName(),

      mounted:
        state.mounted,

      ready:
        state.ready,

      failed:
        state.failed,

      disposed:
        state.disposed,

      paused:
        state.paused,

      reducedMotion:
        state.reducedMotion,

      targetAvailable:
        Boolean(state.target),

      rootAvailable:
        Boolean(state.root),

      navigationAuthority:
        false,

      routeAuthority:
        false,

      controllerDependency:
        false,

      compositorDependency:
        false,

      crystalsDependency:
        false,

      interactionsDependency:
        false,

      gestureDependency:
        false,

      compassAdapterDependency:
        false,

      compassRendererDependency:
        false,

      compassGeometryDependency:
        false,

      semanticActivationOwned:
        false,

      decorative:
        true,

      counters: {
        ...state.counters
      },

      ...detail
    });
  }

  function dispatch(
    eventName,
    detail = {}
  ) {
    const payload =
      createReceipt(
        eventName,
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

  function publishReceipt(
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

    if (
      state.receiptTarget &&
      isElement(state.receiptTarget)
    ) {
      const serialized =
        JSON.stringify(payload);

      if (
        "value" in
        state.receiptTarget
      ) {
        state.receiptTarget.value =
          serialized;
      }

      state.receiptTarget.textContent =
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

  function cancelAnimation() {
    if (state.frameId) {
      window.cancelAnimationFrame(
        state.frameId
      );
    }

    state.frameId =
      0;
  }

  function applyReducedMotionAttribute() {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      ATTRIBUTES.reducedMotion,
      state.reducedMotion
        ? "true"
        : "false"
    );
  }

  function applyStateAttribute() {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      ATTRIBUTES.state,
      currentStateName()
    );
  }

  function animationAllowed() {
    return Boolean(
      state.mounted &&
      state.ready &&
      !state.disposed &&
      !state.failed &&
      !state.paused &&
      !state.reducedMotion &&
      state.root
    );
  }

  function animationStep(timestamp) {
    state.frameId =
      0;

    if (!animationAllowed()) {
      return;
    }

    if (!state.animationStartedAt) {
      state.animationStartedAt =
        timestamp;
    }

    const elapsed =
      timestamp -
      state.animationStartedAt;

    const turn =
      (
        elapsed %
        DEFAULTS.rotationDurationMs
      ) /
      DEFAULTS.rotationDurationMs;

    state.root.style.setProperty(
      "--showroom-planet-turn",
      String(turn)
    );

    state.counters.animationFrames +=
      1;

    state.frameId =
      window.requestAnimationFrame(
        animationStep
      );
  }

  function startAnimation() {
    cancelAnimation();

    if (!animationAllowed()) {
      return false;
    }

    state.animationStartedAt =
      0;

    state.frameId =
      window.requestAnimationFrame(
        animationStep
      );

    return true;
  }

  function stopAnimation() {
    cancelAnimation();

    if (state.root) {
      state.root.style.setProperty(
        "--showroom-planet-turn",
        "0"
      );
    }
  }

  function handleReducedMotionChange(event) {
    const nextValue =
      Boolean(
        event &&
        event.matches
      );

    setReducedMotion(
      nextValue,
      "media-query"
    );
  }

  function bindReducedMotion() {
    if (
      typeof window.matchMedia !==
      "function"
    ) {
      state.reducedMotion =
        false;

      return;
    }

    const media =
      window.matchMedia(
        DEFAULTS.reducedMotionQuery
      );

    state.reducedMotionMedia =
      media;

    state.reducedMotion =
      Boolean(media.matches);

    state.reducedMotionListener =
      handleReducedMotionChange;

    if (
      typeof media.addEventListener ===
      "function"
    ) {
      media.addEventListener(
        "change",
        state.reducedMotionListener
      );
    } else if (
      typeof media.addListener ===
      "function"
    ) {
      media.addListener(
        state.reducedMotionListener
      );
    }
  }

  function unbindReducedMotion() {
    const media =
      state.reducedMotionMedia;

    const listener =
      state.reducedMotionListener;

    if (
      media &&
      listener
    ) {
      try {
        if (
          typeof media.removeEventListener ===
          "function"
        ) {
          media.removeEventListener(
            "change",
            listener
          );
        } else if (
          typeof media.removeListener ===
          "function"
        ) {
          media.removeListener(
            listener
          );
        }
      } catch {
        /* Best-effort reduced-motion listener cleanup. */
      }
    }

    state.reducedMotionMedia =
      null;

    state.reducedMotionListener =
      null;
  }

  function createLayer(
    className,
    layerName
  ) {
    const element =
      document.createElement("span");

    element.className =
      className;

    element.setAttribute(
      ATTRIBUTES.layer,
      layerName
    );

    element.setAttribute(
      "aria-hidden",
      "true"
    );

    return element;
  }

  function createPlanetDom() {
    const root =
      document.createElement("div");

    root.className =
      CLASS_NAMES.root;

    root.setAttribute(
      ATTRIBUTES.root,
      "true"
    );

    root.setAttribute(
      ATTRIBUTES.state,
      STATES.mounted
    );

    root.setAttribute(
      ATTRIBUTES.reducedMotion,
      state.reducedMotion
        ? "true"
        : "false"
    );

    root.setAttribute(
      ATTRIBUTES.decorative,
      "true"
    );

    root.setAttribute(
      "aria-hidden",
      "true"
    );

    root.setAttribute(
      "role",
      "presentation"
    );

    root.style.setProperty(
      "--showroom-planet-turn",
      "0"
    );

    const glow =
      createLayer(
        CLASS_NAMES.glow,
        "glow"
      );

    const shell =
      createLayer(
        CLASS_NAMES.shell,
        "shell"
      );

    const atmosphere =
      createLayer(
        CLASS_NAMES.atmosphere,
        "atmosphere"
      );

    const surface =
      createLayer(
        CLASS_NAMES.surface,
        "surface"
      );

    const axis =
      createLayer(
        CLASS_NAMES.axis,
        "axis"
      );

    const fallback =
      createLayer(
        CLASS_NAMES.fallback,
        "fallback"
      );

    fallback.textContent =
      "";

    shell.appendChild(surface);
    shell.appendChild(axis);

    root.appendChild(glow);
    root.appendChild(shell);
    root.appendChild(atmosphere);
    root.appendChild(fallback);

    return root;
  }

  function resolveReceiptTarget(options) {
    if (
      options &&
      isElement(options.receiptTarget)
    ) {
      return options.receiptTarget;
    }

    if (
      options &&
      typeof options.receiptSelector ===
        "string" &&
      options.receiptSelector.trim()
    ) {
      try {
        const found =
          document.querySelector(
            options.receiptSelector
          );

        return isElement(found)
          ? found
          : null;
      } catch {
        return null;
      }
    }

    if (
      state.target &&
      typeof state.target.querySelector ===
        "function"
    ) {
      try {
        const local =
          state.target.querySelector(
            `[${DEFAULTS.receiptAttribute}]`
          );

        return isElement(local)
          ? local
          : null;
      } catch {
        return null;
      }
    }

    return null;
  }

  function fail(
    reason,
    error = null
  ) {
    state.failed =
      true;

    state.ready =
      false;

    state.paused =
      false;

    stopAnimation();
    applyStateAttribute();

    state.counters.failures +=
      1;

    const errorPayload =
      error
        ? {
            name:
              error instanceof Error
                ? error.name
                : "Error",

            message:
              error instanceof Error
                ? error.message
                : String(error)
          }
        : null;

    publishReceipt(
      "failure",
      {
        reason:
          normalize(reason) ||
          "planet-failure",

        error:
          errorPayload
      }
    );

    dispatch(
      EVENTS.failure,
      {
        reason:
          normalize(reason) ||
          "planet-failure",

        error:
          errorPayload
      }
    );

    return false;
  }

  function markReady(reason) {
    state.ready =
      true;

    state.failed =
      false;

    state.paused =
      false;

    applyStateAttribute();
    applyReducedMotionAttribute();

    state.counters.ready +=
      1;

    publishReceipt(
      "ready",
      {
        reason:
          normalize(reason) ||
          "mounted",

        staticFallbackAvailable:
          true,

        animationAllowed:
          animationAllowed()
      }
    );

    dispatch(
      EVENTS.ready,
      {
        reason:
          normalize(reason) ||
          "mounted",

        staticFallbackAvailable:
          true,

        animationAllowed:
          animationAllowed()
      }
    );

    startAnimation();

    return true;
  }

  function mount(
    target,
    options = {}
  ) {
    if (state.disposed) {
      return false;
    }

    if (!isElement(target)) {
      fail(
        "invalid-mount-target"
      );

      return false;
    }

    if (state.mounted) {
      unmount(
        "remount"
      );
    }

    try {
      bindReducedMotion();

      state.target =
        target;

      state.receiptTarget =
        resolveReceiptTarget(
          options
        );

      const root =
        createPlanetDom();

      state.root =
        root;

      state.target.appendChild(
        root
      );

      state.mounted =
        true;

      state.ready =
        false;

      state.failed =
        false;

      state.paused =
        false;

      state.pauseReason =
        "";

      state.counters.mounts +=
        1;

      applyStateAttribute();
      applyReducedMotionAttribute();

      publishReceipt(
        "mounted",
        {
          targetAccepted:
            true,

          decorative:
            true,

          semanticActivation:
            "none",

          htmlIntegrationOwned:
            false,

          cssIntegrationOwned:
            false
        }
      );

      return markReady(
        "mounted"
      );
    } catch (error) {
      return fail(
        "mount-failed",
        error
      );
    }
  }

  function unmount(
    reason = "api"
  ) {
    if (!state.mounted) {
      return true;
    }

    stopAnimation();

    const root =
      state.root;

    if (
      root &&
      root.parentNode
    ) {
      try {
        root.parentNode.removeChild(
          root
        );
      } catch {
        /* Best-effort DOM cleanup. */
      }
    }

    unbindReducedMotion();

    state.root =
      null;

    state.target =
      null;

    state.receiptTarget =
      null;

    state.mounted =
      false;

    state.ready =
      false;

    state.failed =
      false;

    state.paused =
      false;

    state.pauseReason =
      "";

    state.counters.unmounts +=
      1;

    publishReceipt(
      "unmounted",
      {
        reason:
          normalize(reason) ||
          "api"
      }
    );

    return true;
  }

  function setReducedMotion(
    value,
    reason = "api"
  ) {
    if (state.disposed) {
      return false;
    }

    state.reducedMotion =
      Boolean(value);

    applyReducedMotionAttribute();

    if (state.reducedMotion) {
      stopAnimation();
    } else {
      startAnimation();
    }

    publishReceipt(
      "reduced-motion-updated",
      {
        reason:
          normalize(reason) ||
          "api",

        reducedMotion:
          state.reducedMotion
      }
    );

    return true;
  }

  function pause(
    reason = "api"
  ) {
    if (
      state.disposed ||
      !state.mounted
    ) {
      return false;
    }

    state.paused =
      true;

    state.pauseReason =
      normalize(reason) ||
      "api";

    stopAnimation();
    applyStateAttribute();

    state.counters.pauses +=
      1;

    publishReceipt(
      "paused",
      {
        reason:
          state.pauseReason
      }
    );

    return true;
  }

  function resume(
    reason = "api"
  ) {
    if (
      state.disposed ||
      !state.mounted ||
      state.failed
    ) {
      return false;
    }

    state.paused =
      false;

    state.pauseReason =
      "";

    applyStateAttribute();

    state.counters.resumes +=
      1;

    publishReceipt(
      "resumed",
      {
        reason:
          normalize(reason) ||
          "api",

        animationAllowed:
          animationAllowed()
      }
    );

    startAnimation();

    return true;
  }

  function dispose(
    reason = "api"
  ) {
    if (state.disposed) {
      return true;
    }

    unmount(
      `dispose:${
        normalize(reason) ||
        "api"
      }`
    );

    unbindReducedMotion();
    stopAnimation();

    state.disposed =
      true;

    state.ready =
      false;

    state.failed =
      false;

    state.paused =
      false;

    state.pauseReason =
      "";

    state.counters.disposals +=
      1;

    publishReceipt(
      "disposed",
      {
        reason:
          normalize(reason) ||
          "api",

        localDomRemoved:
          true,

        listenersRemoved:
          true,

        controllerStateMutated:
          false,

        compositorStateMutated:
          false,

        crystalsStateMutated:
          false,

        interactionsStateMutated:
          false,

        compassStateMutated:
          false
      }
    );

    dispatch(
      EVENTS.disposed,
      {
        reason:
          normalize(reason) ||
          "api",

        disposed:
          true
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

        pauseReason:
          state.pauseReason ||
          null
      }
    );
  }

  const api =
    Object.freeze({
      contract:
        CONTRACT,

      owner:
        OWNER,

      getState,

      mount,

      unmount,

      dispose,

      setReducedMotion,

      pause,

      resume
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

  publishReceipt(
    "module-loaded",
    {
      global:
        GLOBAL_NAME,

      autoMount:
        false,

      requiresExternalMountTarget:
        true,

      semanticActivation:
        "none",

      decorative:
        true
    }
  );
})();
