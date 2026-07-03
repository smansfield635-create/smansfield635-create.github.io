/* TARGET FILE: /showroom/index.planet.js */
/* COMPLETE REPLACEMENT */
/* GROUP_F_AUDRALIA_PLANETARY_OBJECT_RENEWAL */
/* SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1 */
/* AUDRALIA_PLANETARY_MODEL_EMITTER_v2 */

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1";

  const MODEL =
    "AUDRALIA_PLANETARY_MODEL_EMITTER_v2";

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

    model:
      "data-showroom-planet-model",

    state:
      "data-showroom-planet-state",

    reducedMotion:
      "data-showroom-planet-reduced-motion",

    layer:
      "data-showroom-planet-layer",

    decorative:
      "data-showroom-planet-decorative",

    audralia:
      "data-showroom-planet-audralia",

    surfaceRole:
      "data-showroom-planet-surface-role",

    terrain:
      "data-showroom-planet-terrain",

    cloud:
      "data-showroom-planet-cloud",

    landmass:
      "data-showroom-planet-landmass"
  });

  const CLASS_NAMES = Object.freeze({
    root:
      "showroom-planet-root",

    glow:
      "showroom-planet-glow",

    orbitLine:
      "showroom-planet-orbit-line",

    shell:
      "showroom-planet-shell",

    body:
      "showroom-planet-body",

    ocean:
      "showroom-planet-ocean",

    terrain:
      "showroom-planet-terrain",

    terrainDeep:
      "showroom-planet-terrain--deep",

    terrainHigh:
      "showroom-planet-terrain--high",

    landmass:
      "showroom-planet-landmass",

    landmassNorth:
      "showroom-planet-landmass--north",

    landmassEast:
      "showroom-planet-landmass--east",

    landmassWest:
      "showroom-planet-landmass--west",

    landmassSouth:
      "showroom-planet-landmass--south",

    cloud:
      "showroom-planet-clouds",

    cloudLow:
      "showroom-planet-clouds--low",

    cloudHigh:
      "showroom-planet-clouds--high",

    atmosphere:
      "showroom-planet-atmosphere",

    rim:
      "showroom-planet-rim",

    terminator:
      "showroom-planet-terminator",

    shadow:
      "showroom-planet-shadow",

    axis:
      "showroom-planet-axis",

    meridian:
      "showroom-planet-meridian",

    fulcrum:
      "showroom-planet-fulcrum",

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
      52000,

    cloudDurationMs:
      82000,

    pulseDurationMs:
      9000,

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

      model:
        MODEL,

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

      audraliaVisualModel:
        true,

      autoMount:
        false,

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

  function setRootProperty(
    name,
    value
  ) {
    if (!state.root) {
      return;
    }

    state.root.style.setProperty(
      name,
      value
    );
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

    const bodyTurn =
      (
        elapsed %
        DEFAULTS.rotationDurationMs
      ) /
      DEFAULTS.rotationDurationMs;

    const cloudTurn =
      (
        elapsed %
        DEFAULTS.cloudDurationMs
      ) /
      DEFAULTS.cloudDurationMs;

    const pulse =
      (
        elapsed %
        DEFAULTS.pulseDurationMs
      ) /
      DEFAULTS.pulseDurationMs;

    setRootProperty(
      "--showroom-planet-turn",
      `${bodyTurn * 360}deg`
    );

    setRootProperty(
      "--showroom-planet-cloud-turn",
      `${cloudTurn * 360}deg`
    );

    setRootProperty(
      "--showroom-planet-pulse",
      String(pulse)
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

    setRootProperty(
      "--showroom-planet-turn",
      "0deg"
    );

    setRootProperty(
      "--showroom-planet-cloud-turn",
      "0deg"
    );

    setRootProperty(
      "--showroom-planet-pulse",
      "0"
    );
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
    layerName,
    options = {}
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

    if (options.surfaceRole) {
      element.setAttribute(
        ATTRIBUTES.surfaceRole,
        options.surfaceRole
      );
    }

    if (options.landmass) {
      element.setAttribute(
        ATTRIBUTES.landmass,
        options.landmass
      );
    }

    if (options.terrain) {
      element.setAttribute(
        ATTRIBUTES.terrain,
        options.terrain
      );
    }

    if (options.cloud) {
      element.setAttribute(
        ATTRIBUTES.cloud,
        options.cloud
      );
    }

    if (options.text != null) {
      element.textContent =
        String(options.text);
    }

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
      ATTRIBUTES.model,
      MODEL
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
      ATTRIBUTES.audralia,
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
      "0deg"
    );

    root.style.setProperty(
      "--showroom-planet-cloud-turn",
      "0deg"
    );

    root.style.setProperty(
      "--showroom-planet-pulse",
      "0"
    );

    const glow =
      createLayer(
        CLASS_NAMES.glow,
        "glow"
      );

    const orbitLine =
      createLayer(
        CLASS_NAMES.orbitLine,
        "orbit-line"
      );

    const shell =
      createLayer(
        CLASS_NAMES.shell,
        "shell"
      );

    const body =
      createLayer(
        CLASS_NAMES.body,
        "body",
        {
          surfaceRole:
            "world-body"
        }
      );

    const ocean =
      createLayer(
        CLASS_NAMES.ocean,
        "ocean",
        {
          surfaceRole:
            "ocean"
        }
      );

    const terrainDeep =
      createLayer(
        `${CLASS_NAMES.terrain} ${CLASS_NAMES.terrainDeep}`,
        "terrain-deep",
        {
          surfaceRole:
            "terrain",
          terrain:
            "deep"
        }
      );

    const terrainHigh =
      createLayer(
        `${CLASS_NAMES.terrain} ${CLASS_NAMES.terrainHigh}`,
        "terrain-high",
        {
          surfaceRole:
            "terrain",
          terrain:
            "high"
        }
      );

    const landNorth =
      createLayer(
        `${CLASS_NAMES.landmass} ${CLASS_NAMES.landmassNorth}`,
        "landmass-north",
        {
          surfaceRole:
            "landmass",
          landmass:
            "north"
        }
      );

    const landEast =
      createLayer(
        `${CLASS_NAMES.landmass} ${CLASS_NAMES.landmassEast}`,
        "landmass-east",
        {
          surfaceRole:
            "landmass",
          landmass:
            "east"
        }
      );

    const landWest =
      createLayer(
        `${CLASS_NAMES.landmass} ${CLASS_NAMES.landmassWest}`,
        "landmass-west",
        {
          surfaceRole:
            "landmass",
          landmass:
            "west"
        }
      );

    const landSouth =
      createLayer(
        `${CLASS_NAMES.landmass} ${CLASS_NAMES.landmassSouth}`,
        "landmass-south",
        {
          surfaceRole:
            "landmass",
          landmass:
            "south"
        }
      );

    const cloudLow =
      createLayer(
        `${CLASS_NAMES.cloud} ${CLASS_NAMES.cloudLow}`,
        "clouds-low",
        {
          surfaceRole:
            "clouds",
          cloud:
            "low"
        }
      );

    const cloudHigh =
      createLayer(
        `${CLASS_NAMES.cloud} ${CLASS_NAMES.cloudHigh}`,
        "clouds-high",
        {
          surfaceRole:
            "clouds",
          cloud:
            "high"
        }
      );

    const rim =
      createLayer(
        CLASS_NAMES.rim,
        "rim",
        {
          surfaceRole:
            "atmospheric-rim"
        }
      );

    const terminator =
      createLayer(
        CLASS_NAMES.terminator,
        "terminator",
        {
          surfaceRole:
            "terminator"
        }
      );

    const shadow =
      createLayer(
        CLASS_NAMES.shadow,
        "shadow",
        {
          surfaceRole:
            "shadow-limb"
        }
      );

    const meridian =
      createLayer(
        CLASS_NAMES.meridian,
        "meridian",
        {
          surfaceRole:
            "meridian"
        }
      );

    const fulcrum =
      createLayer(
        CLASS_NAMES.fulcrum,
        "fulcrum",
        {
          surfaceRole:
            "fulcrum"
        }
      );

    const axis =
      createLayer(
        CLASS_NAMES.axis,
        "axis",
        {
          surfaceRole:
            "axis"
        }
      );

    const atmosphere =
      createLayer(
        CLASS_NAMES.atmosphere,
        "atmosphere",
        {
          surfaceRole:
            "atmosphere"
        }
      );

    const fallback =
      createLayer(
        CLASS_NAMES.fallback,
        "fallback",
        {
          surfaceRole:
            "fallback",
          text:
            ""
        }
      );

    body.appendChild(
      ocean
    );

    body.appendChild(
      terrainDeep
    );

    body.appendChild(
      terrainHigh
    );

    body.appendChild(
      landNorth
    );

    body.appendChild(
      landEast
    );

    body.appendChild(
      landWest
    );

    body.appendChild(
      landSouth
    );

    body.appendChild(
      cloudLow
    );

    body.appendChild(
      cloudHigh
    );

    body.appendChild(
      rim
    );

    body.appendChild(
      terminator
    );

    body.appendChild(
      shadow
    );

    body.appendChild(
      meridian
    );

    body.appendChild(
      fulcrum
    );

    shell.appendChild(
      body
    );

    shell.appendChild(
      axis
    );

    root.appendChild(
      glow
    );

    root.appendChild(
      orbitLine
    );

    root.appendChild(
      shell
    );

    root.appendChild(
      atmosphere
    );

    root.appendChild(
      fallback
    );

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
          animationAllowed(),

        visualModel:
          MODEL,

        audraliaSurfaceHooks:
          true
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
          animationAllowed(),

        visualModel:
          MODEL,

        audraliaSurfaceHooks:
          true
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
            false,

          visualModel:
            MODEL,

          audraliaSurfaceHooks:
            [
              "body",
              "ocean",
              "terrain",
              "landmass",
              "clouds",
              "atmosphere",
              "rim",
              "terminator",
              "shadow",
              "meridian",
              "fulcrum",
              "axis",
              "orbit-line",
              "glow",
              "fallback"
            ]
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
        visualModel:
          MODEL,

        audraliaSurfaceHooks:
          true,

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

      model:
        MODEL,

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
        true,

      visualModel:
        MODEL,

      audraliaSurfaceHooks:
        true,

      navigationAuthority:
        false,

      productionAuthorization:
        false,

      deploymentAuthorization:
        false
    }
  );
})();
