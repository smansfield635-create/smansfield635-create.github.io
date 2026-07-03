/* TARGET FILE: /showroom/index.planet.js */
/* COMPLETE REPLACEMENT */
/* GROUP_F_AUDRALIA_PLANETARY_OBJECT_RENEWAL */
/* SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1 */
/* AUDRALIA_GEOMETRY_AUTHORITY_MINIATURE_RENDERER_v1 */
/* 
  Purpose:
  - Render the Showroom center planet from the canonical Audralia geometry
    authority instead of invented CSS geography.
  - Preserve the Showroom center object as the Main Compass return selector.
  - Keep the planet decorative and non-navigational.
  - Reduce renderer-origin yellow glare and improve miniature globe integrity.

  Source geometry authority:
  - /assets/audralia/audralia.planet.js
  - window.DGBAudraliaPlanetGeometry
  - AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1

  Showroom authority:
  - This file exposes window.SHOWROOM_PLANET.
  - The visible planet is decorative.
  - Click / tap authority remains [data-showroom-compass-control].
  - Route authority remains the Showroom controller.
  - The semantic outcome remains Main Compass return selection, not Audralia navigation.

  Does not own:
  - semantic navigation;
  - route decisions;
  - controller state;
  - compositor state;
  - crystal geometry or drawing;
  - pointer or gesture interpretation;
  - Compass adapter, renderer, or geometry;
  - Audralia geometry mutation.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_PLANETARY_FULCRUM_INDEPENDENT_CENTER_PLANET_TNT_v1";

  const MODEL =
    "AUDRALIA_GEOMETRY_AUTHORITY_MINIATURE_RENDERER_v1";

  const VISUAL_REVISION =
    "AUDRALIA_GEOMETRY_AUTHORITY_MINIATURE_RENDERER_GLARE_REDUCTION_v1";

  const AUDRALIA_GEOMETRY_CONTRACT =
    "AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1";

  const OWNER =
    "/showroom/index.planet.js";

  const GLOBAL_NAME =
    "SHOWROOM_PLANET";

  const AUDRALIA_GEOMETRY_GLOBAL =
    "DGBAudraliaPlanetGeometry";

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

  const STATES = Object.freeze({
    mounted:
      "mounted",

    ready:
      "ready",

    waiting:
      "waiting-for-audralia-geometry",

    fallback:
      "fallback",

    paused:
      "paused",

    failed:
      "failed",

    unmounted:
      "unmounted",

    disposed:
      "disposed"
  });

  const ATTRIBUTES = Object.freeze({
    root:
      "data-showroom-planet-root",

    model:
      "data-showroom-planet-model",

    visualRevision:
      "data-showroom-planet-visual-revision",

    sourceContract:
      "data-showroom-planet-source-contract",

    state:
      "data-showroom-planet-state",

    reducedMotion:
      "data-showroom-planet-reduced-motion",

    decorative:
      "data-showroom-planet-decorative",

    audralia:
      "data-showroom-planet-audralia",

    layer:
      "data-showroom-planet-layer",

    surfaceRole:
      "data-showroom-planet-surface-role"
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

    canvas:
      "showroom-planet-canvas",

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

  const DEFAULTS = Object.freeze({
    terrainLevel:
      4,

    oceanLevel:
      3,

    cloudLevel:
      3,

    atmosphereLevel:
      2,

    maximumDevicePixelRatio:
      2,

    baseCanvasCssPixels:
      256,

    geometryWaitMs:
      2600,

    geometryPollMs:
      80,

    rotationDurationMs:
      72000,

    cloudDurationMs:
      104000,

    pulseDurationMs:
      12000,

    receiptAttribute:
      "data-showroom-planet-receipt",

    reducedMotionQuery:
      "(prefers-reduced-motion: reduce)"
  });

  const MATERIAL_HINT = Object.freeze({
    DEEP_OCEAN:
      0,

    OPEN_OCEAN:
      1,

    SHELF:
      2,

    COAST:
      3,

    BEACH:
      4,

    LOWLAND:
      5,

    FOREST:
      6,

    ARID:
      7,

    UPLAND:
      8,

    ROCK:
      9,

    SNOW:
      10,

    LAKE:
      11,

    INLAND_SEA:
      12
  });

  const WATER_CLASS = Object.freeze({
    NONE:
      0,

    DEEP_OCEAN:
      1,

    OPEN_OCEAN:
      2,

    SHELF_WATER:
      3,

    COASTAL_WATER:
      4,

    INLAND_SEA:
      5,

    LAKE:
      6,

    CHANNEL:
      7,

    RIVER_PATH:
      8
  });

  const COLORS = Object.freeze({
    space:
      "rgba(0, 0, 0, 0)",

    deepOcean:
      [8, 24, 58],

    openOcean:
      [15, 64, 112],

    shelf:
      [30, 121, 145],

    coastal:
      [54, 151, 160],

    inlandSea:
      [34, 103, 132],

    lake:
      [48, 133, 160],

    beach:
      [176, 153, 103],

    coast:
      [132, 124, 83],

    lowland:
      [56, 116, 74],

    forest:
      [30, 86, 68],

    arid:
      [132, 112, 77],

    upland:
      [82, 113, 88],

    rock:
      [104, 106, 112],

    snow:
      [208, 220, 218],

    cloud:
      [226, 240, 243],

    atmosphere:
      [108, 218, 255],

    rim:
      [145, 233, 255],

    night:
      [3, 7, 21],

    coolDay:
      [186, 224, 228],

    polarDay:
      [214, 232, 229],

    oceanDay:
      [118, 209, 219]
  });

  const state = {
    target:
      null,

    root:
      null,

    shell:
      null,

    body:
      null,

    canvas:
      null,

    context:
      null,

    fallback:
      null,

    receiptTarget:
      null,

    geometryAuthority:
      null,

    geometryPacket:
      null,

    terrainMesh:
      null,

    cloudMesh:
      null,

    lastGeometryHash:
      "",

    mounted:
      false,

    ready:
      false,

    failed:
      false,

    disposed:
      false,

    paused:
      false,

    fallbackMode:
      false,

    waitingForGeometry:
      false,

    reducedMotion:
      false,

    reducedMotionMedia:
      null,

    reducedMotionListener:
      null,

    frameId:
      0,

    geometryWaitTimer:
      0,

    animationStartedAt:
      0,

    lastRenderTurn:
      NaN,

    lastCanvasSize:
      0,

    pauseReason:
      "",

    lastReceipt:
      null,

    counters: {
      mounts:
        0,

      unmounts:
        0,

      ready:
        0,

      failures:
        0,

      fallbacks:
        0,

      pauses:
        0,

      resumes:
        0,

      disposals:
        0,

      receipts:
        0,

      geometryAttempts:
        0,

      geometryAccepted:
        0,

      geometryUnavailable:
        0,

      renderFrames:
        0,

      renderSkips:
        0,

      canvasResizes:
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

  function isCanvas(value) {
    return (
      typeof HTMLCanvasElement !== "undefined" &&
      value instanceof HTMLCanvasElement
    );
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    const numeric =
      Number(value);

    if (!Number.isFinite(numeric)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(
        maximum,
        numeric
      )
    );
  }

  function resolveLevel(
    value,
    fallback
  ) {
    if (
      value == null ||
      value === ""
    ) {
      return fallback;
    }

    return clamp(
      value,
      0,
      6
    );
  }

  function freezePlain(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (ArrayBuffer.isView(value)) {
      return Object.freeze(
        Array.from(value)
      );
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
      if (typeof entry !== "function") {
        output[key] =
          freezePlain(entry);
      }
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

    if (state.fallbackMode) {
      return STATES.fallback;
    }

    if (state.waitingForGeometry) {
      return STATES.waiting;
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

      visualRevision:
        VISUAL_REVISION,

      owner:
        OWNER,

      sourceAuthority:
        "/assets/audralia/audralia.planet.js",

      sourceGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      sourceContract:
        AUDRALIA_GEOMETRY_CONTRACT,

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

      fallbackMode:
        state.fallbackMode,

      waitingForGeometry:
        state.waitingForGeometry,

      reducedMotion:
        state.reducedMotion,

      targetAvailable:
        Boolean(state.target),

      rootAvailable:
        Boolean(state.root),

      canvasAvailable:
        Boolean(state.canvas),

      geometryAuthorityAvailable:
        Boolean(state.geometryAuthority),

      geometryPacketAvailable:
        Boolean(state.geometryPacket),

      terrainMeshAvailable:
        Boolean(state.terrainMesh),

      geometryHash:
        state.lastGeometryHash ||
        "",

      visualIdentity:
        "mini-audralia",

      navigationMeaning:
        "main-compass-return-selection",

      clickAuthority:
        "[data-showroom-compass-control]",

      semanticActivationOwned:
        false,

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

      audraliaGeometryMutated:
        false,

      decorative:
        true,

      autoMount:
        false,

      webGL:
        false,

      generatedImage:
        false,

      visualPassClaimed:
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

  function createLayer(
    className,
    layerName,
    options = {}
  ) {
    const element =
      document.createElement(
        options.tagName ||
        "span"
      );

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

    if (options.text != null) {
      element.textContent =
        String(options.text);
    }

    return element;
  }

  function applyAbsoluteFill(element) {
    element.style.position =
      "absolute";

    element.style.inset =
      "0";

    element.style.width =
      "100%";

    element.style.height =
      "100%";

    element.style.pointerEvents =
      "none";
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
      ATTRIBUTES.visualRevision,
      VISUAL_REVISION
    );

    root.setAttribute(
      ATTRIBUTES.sourceContract,
      AUDRALIA_GEOMETRY_CONTRACT
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
        "glow",
        {
          surfaceRole:
            "decorative-glow"
        }
      );

    const orbitLine =
      createLayer(
        CLASS_NAMES.orbitLine,
        "orbit-line",
        {
          surfaceRole:
            "decorative-orbit-line"
        }
      );

    const shell =
      createLayer(
        CLASS_NAMES.shell,
        "shell",
        {
          surfaceRole:
            "render-shell"
        }
      );

    const body =
      createLayer(
        CLASS_NAMES.body,
        "body",
        {
          surfaceRole:
            "audralia-render-body"
        }
      );

    const canvas =
      document.createElement("canvas");

    canvas.className =
      CLASS_NAMES.canvas;

    canvas.setAttribute(
      ATTRIBUTES.layer,
      "audralia-canvas-renderer"
    );

    canvas.setAttribute(
      ATTRIBUTES.surfaceRole,
      "audralia-authority-rendered-surface"
    );

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.style.display =
      "block";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.pointerEvents =
      "none";

    canvas.style.borderRadius =
      "50%";

    canvas.style.position =
      "relative";

    canvas.style.zIndex =
      "2";

    const atmosphere =
      createLayer(
        CLASS_NAMES.atmosphere,
        "atmosphere",
        {
          surfaceRole:
            "css-atmospheric-augmentation"
        }
      );

    const rim =
      createLayer(
        CLASS_NAMES.rim,
        "rim",
        {
          surfaceRole:
            "css-atmospheric-rim"
        }
      );

    const terminator =
      createLayer(
        CLASS_NAMES.terminator,
        "terminator",
        {
          surfaceRole:
            "css-terminator-overlay"
        }
      );

    const shadow =
      createLayer(
        CLASS_NAMES.shadow,
        "shadow",
        {
          surfaceRole:
            "css-shadow-limb"
        }
      );

    const meridian =
      createLayer(
        CLASS_NAMES.meridian,
        "meridian",
        {
          surfaceRole:
            "css-meridian"
        }
      );

    const fulcrum =
      createLayer(
        CLASS_NAMES.fulcrum,
        "fulcrum",
        {
          surfaceRole:
            "css-fulcrum"
        }
      );

    const axis =
      createLayer(
        CLASS_NAMES.axis,
        "axis",
        {
          surfaceRole:
            "css-axis"
        }
      );

    const fallback =
      createLayer(
        CLASS_NAMES.fallback,
        "fallback",
        {
          surfaceRole:
            "static-fallback",
          text:
            ""
        }
      );

    applyAbsoluteFill(body);
    applyAbsoluteFill(atmosphere);
    applyAbsoluteFill(rim);
    applyAbsoluteFill(terminator);
    applyAbsoluteFill(shadow);
    applyAbsoluteFill(meridian);
    applyAbsoluteFill(fulcrum);
    applyAbsoluteFill(axis);
    applyAbsoluteFill(fallback);

    body.appendChild(
      canvas
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

    state.shell =
      shell;

    state.body =
      body;

    state.canvas =
      canvas;

    state.context =
      canvas.getContext(
        "2d",
        {
          alpha:
            true
        }
      );

    state.fallback =
      fallback;

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
      typeof options.receiptSelector === "string" &&
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

  function applyStateAttribute() {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      ATTRIBUTES.state,
      currentStateName()
    );
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

  function setFallbackText(text) {
    if (!state.fallback) {
      return;
    }

    state.fallback.textContent =
      normalize(text);
  }

  function resolveGeometryAuthority() {
    const authority =
      window[AUDRALIA_GEOMETRY_GLOBAL];

    if (
      !authority ||
      typeof authority !== "object"
    ) {
      return null;
    }

    if (
      authority.contract !==
      AUDRALIA_GEOMETRY_CONTRACT
    ) {
      return null;
    }

    if (
      typeof authority.createGeometry !==
        "function"
    ) {
      return null;
    }

    return authority;
  }

  function acceptGeometryAuthority(authority) {
    state.geometryAuthority =
      authority;

    return true;
  }

  function createGeometryPacket(options = {}) {
    const authority =
      state.geometryAuthority ||
      resolveGeometryAuthority();

    if (!authority) {
      return null;
    }

    acceptGeometryAuthority(
      authority
    );

    state.counters.geometryAttempts +=
      1;

    const packet =
      authority.createGeometry({
        terrainLevel:
          resolveLevel(
            options.terrainLevel,
            DEFAULTS.terrainLevel
          ),

        oceanLevel:
          resolveLevel(
            options.oceanLevel,
            DEFAULTS.oceanLevel
          ),

        cloudLevel:
          resolveLevel(
            options.cloudLevel,
            DEFAULTS.cloudLevel
          ),

        atmosphereLevel:
          resolveLevel(
            options.atmosphereLevel,
            DEFAULTS.atmosphereLevel
          ),

        includeHydrology:
          false,

        deepValidation:
          false
      });

    if (
      !packet ||
      packet.contract !==
        AUDRALIA_GEOMETRY_CONTRACT ||
      !packet.terrain ||
      !packet.terrain.positions ||
      !packet.terrain.indices
    ) {
      throw new Error(
        "The Audralia geometry packet is invalid."
      );
    }

    state.geometryPacket =
      packet;

    state.terrainMesh =
      packet.terrain;

    state.cloudMesh =
      packet.clouds ||
      null;

    state.lastGeometryHash =
      normalize(
        packet.geometryHash ||
        packet.terrain.geometryHash ||
        ""
      );

    state.counters.geometryAccepted +=
      1;

    return packet;
  }

  function clearGeometryWaitTimer() {
    if (state.geometryWaitTimer) {
      clearTimeout(
        state.geometryWaitTimer
      );
    }

    state.geometryWaitTimer =
      0;
  }

  function waitForGeometryAuthority(
    startedAt,
    options
  ) {
    if (
      state.disposed ||
      !state.mounted ||
      state.failed
    ) {
      return;
    }

    const authority =
      resolveGeometryAuthority();

    if (authority) {
      try {
        acceptGeometryAuthority(
          authority
        );

        createGeometryPacket(
          options
        );

        state.waitingForGeometry =
          false;

        state.fallbackMode =
          false;

        markReady(
          "audralia-geometry-authority-available"
        );

        return;
      } catch (error) {
        fail(
          "audralia-geometry-packet-failed",
          error
        );

        return;
      }
    }

    const elapsed =
      performance.now() -
      startedAt;

    if (
      elapsed >=
      DEFAULTS.geometryWaitMs
    ) {
      state.counters.geometryUnavailable +=
        1;

      enterFallbackMode(
        "audralia-geometry-authority-unavailable"
      );

      return;
    }

    state.geometryWaitTimer =
      setTimeout(
        () => {
          waitForGeometryAuthority(
            startedAt,
            options
          );
        },
        DEFAULTS.geometryPollMs
      );
  }

  function initializeGeometry(options = {}) {
    const authority =
      resolveGeometryAuthority();

    if (authority) {
      acceptGeometryAuthority(
        authority
      );

      createGeometryPacket(
        options
      );

      return true;
    }

    state.waitingForGeometry =
      true;

    applyStateAttribute();

    publishReceipt(
      "waiting-for-audralia-geometry-authority",
      {
        nonterminal:
          true,

        requiredScript:
          "/assets/audralia/audralia.planet.js",

        requiredGlobal:
          AUDRALIA_GEOMETRY_GLOBAL,

        requiredContract:
          AUDRALIA_GEOMETRY_CONTRACT
      }
    );

    waitForGeometryAuthority(
      performance.now(),
      options
    );

    return false;
  }

  function enterFallbackMode(reason) {
    state.waitingForGeometry =
      false;

    state.fallbackMode =
      true;

    state.ready =
      true;

    state.failed =
      false;

    state.counters.fallbacks +=
      1;

    setFallbackText(
      "Audralia"
    );

    applyStateAttribute();
    applyReducedMotionAttribute();

    renderFallbackDisk();

    publishReceipt(
      "fallback",
      {
        reason:
          normalize(reason) ||
          "fallback",

        sourceGeometryUsed:
          false,

        audraliaGeometryAuthorityRequired:
          true,

        semanticActivation:
          "none",

        clickAuthority:
          "[data-showroom-compass-control]",

        navigationMeaning:
          "main-compass-return-selection"
      }
    );

    dispatch(
      EVENTS.ready,
      {
        reason:
          "fallback",

        fallback:
          true,

        sourceGeometryUsed:
          false
      }
    );

    return true;
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

    state.waitingForGeometry =
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
      event => {
        setReducedMotion(
          Boolean(
            event &&
            event.matches
          ),
          "media-query"
        );
      };

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
        /* Best-effort listener cleanup. */
      }
    }

    state.reducedMotionMedia =
      null;

    state.reducedMotionListener =
      null;
  }

  function ensureCanvasSize() {
    if (
      !state.canvas ||
      !state.context
    ) {
      return false;
    }

    const rect =
      state.canvas.getBoundingClientRect();

    const cssSize =
      Math.max(
        96,
        Math.round(
          Math.max(
            rect.width,
            rect.height,
            DEFAULTS.baseCanvasCssPixels
          )
        )
      );

    const devicePixelRatio =
      clamp(
        window.devicePixelRatio || 1,
        1,
        DEFAULTS.maximumDevicePixelRatio
      );

    const pixelSize =
      Math.max(
        96,
        Math.round(
          cssSize *
          devicePixelRatio
        )
      );

    if (
      state.canvas.width !== pixelSize ||
      state.canvas.height !== pixelSize
    ) {
      state.canvas.width =
        pixelSize;

      state.canvas.height =
        pixelSize;

      state.lastCanvasSize =
        pixelSize;

      state.counters.canvasResizes +=
        1;

      return true;
    }

    return false;
  }

  function clearCanvas() {
    if (
      !state.context ||
      !state.canvas
    ) {
      return;
    }

    state.context.clearRect(
      0,
      0,
      state.canvas.width,
      state.canvas.height
    );
  }

  function colorToCss(
    color,
    alpha = 1
  ) {
    return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${clamp(alpha, 0, 1)})`;
  }

  function mixColor(
    base,
    overlay,
    amount
  ) {
    const t =
      clamp(
        amount,
        0,
        1
      );

    return [
      base[0] +
        (overlay[0] - base[0]) *
        t,

      base[1] +
        (overlay[1] - base[1]) *
        t,

      base[2] +
        (overlay[2] - base[2]) *
        t
    ];
  }

  function shadeColor(
    base,
    light,
    waterClass
  ) {
    const l =
      clamp(
        light,
        0,
        1
      );

    const nightMix =
      (1 - l) *
      0.54;

    const dimmed =
      mixColor(
        base,
        COLORS.night,
        nightMix
      );

    const dayTarget =
      waterClass === WATER_CLASS.DEEP_OCEAN ||
      waterClass === WATER_CLASS.OPEN_OCEAN ||
      waterClass === WATER_CLASS.SHELF_WATER ||
      waterClass === WATER_CLASS.COASTAL_WATER ||
      waterClass === WATER_CLASS.INLAND_SEA ||
      waterClass === WATER_CLASS.LAKE
        ? COLORS.oceanDay
        : COLORS.coolDay;

    return mixColor(
      dimmed,
      dayTarget,
      Math.pow(l, 2.15) * 0.095
    );
  }

  function materialColor(
    materialHint,
    waterClass
  ) {
    if (
      waterClass === WATER_CLASS.DEEP_OCEAN
    ) {
      return COLORS.deepOcean;
    }

    if (
      waterClass === WATER_CLASS.OPEN_OCEAN
    ) {
      return COLORS.openOcean;
    }

    if (
      waterClass === WATER_CLASS.SHELF_WATER
    ) {
      return COLORS.shelf;
    }

    if (
      waterClass === WATER_CLASS.COASTAL_WATER
    ) {
      return COLORS.coastal;
    }

    if (
      waterClass === WATER_CLASS.LAKE
    ) {
      return COLORS.lake;
    }

    if (
      waterClass === WATER_CLASS.INLAND_SEA
    ) {
      return COLORS.inlandSea;
    }

    switch (materialHint) {
      case MATERIAL_HINT.BEACH:
        return COLORS.beach;

      case MATERIAL_HINT.COAST:
        return COLORS.coast;

      case MATERIAL_HINT.FOREST:
        return COLORS.forest;

      case MATERIAL_HINT.ARID:
        return COLORS.arid;

      case MATERIAL_HINT.UPLAND:
        return COLORS.upland;

      case MATERIAL_HINT.ROCK:
        return COLORS.rock;

      case MATERIAL_HINT.SNOW:
        return COLORS.snow;

      case MATERIAL_HINT.LAKE:
        return COLORS.lake;

      case MATERIAL_HINT.INLAND_SEA:
        return COLORS.inlandSea;

      case MATERIAL_HINT.LOWLAND:
      default:
        return COLORS.lowland;
    }
  }

  function rotatePoint(
    x,
    y,
    z,
    yaw,
    pitch
  ) {
    const cosYaw =
      Math.cos(yaw);

    const sinYaw =
      Math.sin(yaw);

    const yawX =
      x * cosYaw +
      z * sinYaw;

    const yawZ =
      -x * sinYaw +
      z * cosYaw;

    const cosPitch =
      Math.cos(pitch);

    const sinPitch =
      Math.sin(pitch);

    return {
      x:
        yawX,

      y:
        y * cosPitch -
        yawZ * sinPitch,

      z:
        y * sinPitch +
        yawZ * cosPitch
    };
  }

  function projectPoint(
    point,
    center,
    scale
  ) {
    return {
      x:
        center +
        point.x *
        scale,

      y:
        center -
        point.y *
        scale,

      z:
        point.z
    };
  }

  function triangleVisible(
    a,
    b,
    c
  ) {
    const abx =
      b.x -
      a.x;

    const aby =
      b.y -
      a.y;

    const acx =
      c.x -
      a.x;

    const acy =
      c.y -
      a.y;

    return (
      abx * acy -
      aby * acx
    ) < 0;
  }

  function drawTriangle(
    context,
    a,
    b,
    c,
    color
  ) {
    context.beginPath();

    context.moveTo(
      a.x,
      a.y
    );

    context.lineTo(
      b.x,
      b.y
    );

    context.lineTo(
      c.x,
      c.y
    );

    context.closePath();

    context.fillStyle =
      color;

    context.fill();
  }

  function createLightVector() {
    return {
      x:
        -0.18,

      y:
        0.24,

      z:
        0.94
    };
  }

  function dotLight(point, light) {
    const length =
      Math.hypot(
        point.x,
        point.y,
        point.z
      ) || 1;

    return clamp(
      (
        point.x / length *
          light.x +
        point.y / length *
          light.y +
        point.z / length *
          light.z
      ) *
        0.56 +
        0.44,
      0,
      1
    );
  }

  function drawBaseSphere(
    context,
    center,
    radius,
    pulse
  ) {
    const baseGradient =
      context.createRadialGradient(
        center - radius * 0.22,
        center - radius * 0.2,
        radius * 0.08,
        center,
        center,
        radius
      );

    baseGradient.addColorStop(
      0,
      `rgba(96, 178, 181, ${0.32 + pulse * 0.015})`
    );

    baseGradient.addColorStop(
      0.34,
      "rgba(23, 91, 132, 0.94)"
    );

    baseGradient.addColorStop(
      0.68,
      "rgba(12, 42, 82, 0.98)"
    );

    baseGradient.addColorStop(
      1,
      "rgba(5, 14, 39, 1)"
    );

    context.save();

    context.beginPath();

    context.arc(
      center,
      center,
      radius,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      baseGradient;

    context.fill();

    context.restore();
  }

  function drawAtmosphere(
    context,
    size,
    center,
    radius,
    pulse
  ) {
    const atmosphereGradient =
      context.createRadialGradient(
        center - radius * 0.18,
        center - radius * 0.18,
        radius * 0.16,
        center,
        center,
        radius * 1.1
      );

    atmosphereGradient.addColorStop(
      0,
      "rgba(255, 255, 255, 0.045)"
    );

    atmosphereGradient.addColorStop(
      0.5,
      `rgba(116, 224, 255, ${0.042 + pulse * 0.012})`
    );

    atmosphereGradient.addColorStop(
      0.78,
      `rgba(116, 224, 255, ${0.082 + pulse * 0.018})`
    );

    atmosphereGradient.addColorStop(
      1,
      "rgba(116, 224, 255, 0)"
    );

    context.save();

    context.beginPath();

    context.arc(
      center,
      center,
      radius * 1.1,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      atmosphereGradient;

    context.fill();

    context.restore();

    context.save();

    context.beginPath();

    context.arc(
      center,
      center,
      radius * 1.01,
      0,
      Math.PI * 2
    );

    context.strokeStyle =
      "rgba(152, 238, 255, 0.22)";

    context.lineWidth =
      Math.max(
        1,
        size * 0.006
      );

    context.stroke();

    context.restore();
  }

  function drawTerminator(
    context,
    center,
    radius
  ) {
    const gradient =
      context.createRadialGradient(
        center + radius * 0.48,
        center + radius * 0.12,
        radius * 0.08,
        center + radius * 0.36,
        center + radius * 0.12,
        radius * 1.18
      );

    gradient.addColorStop(
      0,
      "rgba(0, 0, 0, 0)"
    );

    gradient.addColorStop(
      0.48,
      "rgba(0, 0, 0, 0.07)"
    );

    gradient.addColorStop(
      1,
      "rgba(0, 0, 0, 0.5)"
    );

    context.save();

    context.beginPath();

    context.arc(
      center,
      center,
      radius,
      0,
      Math.PI * 2
    );

    context.clip();

    context.fillStyle =
      gradient;

    context.fillRect(
      center - radius,
      center - radius,
      radius * 2,
      radius * 2
    );

    context.restore();
  }

  function drawSubtleSpecular(
    context,
    center,
    radius
  ) {
    const gradient =
      context.createRadialGradient(
        center - radius * 0.22,
        center - radius * 0.18,
        radius * 0.02,
        center - radius * 0.12,
        center - radius * 0.08,
        radius * 0.42
      );

    gradient.addColorStop(
      0,
      "rgba(218, 247, 250, 0.105)"
    );

    gradient.addColorStop(
      0.35,
      "rgba(168, 232, 238, 0.046)"
    );

    gradient.addColorStop(
      1,
      "rgba(168, 232, 238, 0)"
    );

    context.save();

    context.beginPath();

    context.arc(
      center,
      center,
      radius,
      0,
      Math.PI * 2
    );

    context.clip();

    context.fillStyle =
      gradient;

    context.fillRect(
      center - radius,
      center - radius,
      radius * 2,
      radius * 2
    );

    context.restore();
  }

  function drawClouds(
    context,
    center,
    radius,
    yaw,
    cloudTurn
  ) {
    const cloudCount =
      34;

    context.save();

    context.beginPath();

    context.arc(
      center,
      center,
      radius * 1.01,
      0,
      Math.PI * 2
    );

    context.clip();

    for (
      let index = 0;
      index < cloudCount;
      index += 1
    ) {
      const latitude =
        Math.sin(index * 12.9898) *
        0.78;

      const longitude =
        index * 2.399963 +
        cloudTurn *
        Math.PI *
        2;

      const band =
        0.62 +
        0.38 *
        Math.sin(index * 5.231);

      const directionX =
        Math.cos(latitude) *
        Math.cos(longitude);

      const directionY =
        Math.sin(latitude);

      const directionZ =
        Math.cos(latitude) *
        Math.sin(longitude);

      const rotated =
        rotatePoint(
          directionX,
          directionY,
          directionZ,
          yaw,
          -0.22
        );

      if (rotated.z <= -0.08) {
        continue;
      }

      const projected =
        projectPoint(
          rotated,
          center,
          radius * 0.94
        );

      const alpha =
        clamp(
          0.035 +
          rotated.z *
          0.08,
          0,
          0.12
        );

      const width =
        radius *
        (
          0.13 +
          band *
          0.075
        );

      const height =
        radius *
        (
          0.02 +
          band *
          0.018
        );

      context.save();

      context.translate(
        projected.x,
        projected.y
      );

      context.rotate(
        longitude * 0.37
      );

      context.beginPath();

      context.ellipse(
        0,
        0,
        width,
        height,
        0,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        colorToCss(
          COLORS.cloud,
          alpha
        );

      context.fill();

      context.restore();
    }

    context.restore();
  }

  function renderFallbackDisk() {
    if (
      !state.context ||
      !state.canvas
    ) {
      return false;
    }

    ensureCanvasSize();

    const context =
      state.context;

    const size =
      state.canvas.width;

    const center =
      size / 2;

    const radius =
      size * 0.39;

    clearCanvas();

    drawAtmosphere(
      context,
      size,
      center,
      radius,
      0.12
    );

    const gradient =
      context.createRadialGradient(
        center - radius * 0.22,
        center - radius * 0.24,
        radius * 0.12,
        center,
        center,
        radius
      );

    gradient.addColorStop(
      0,
      "rgba(170, 216, 205, 0.62)"
    );

    gradient.addColorStop(
      0.3,
      "rgba(65, 148, 154, 0.88)"
    );

    gradient.addColorStop(
      0.66,
      "rgba(34, 80, 129, 0.96)"
    );

    gradient.addColorStop(
      1,
      "rgba(9, 23, 60, 1)"
    );

    context.beginPath();

    context.arc(
      center,
      center,
      radius,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      gradient;

    context.fill();

    drawSubtleSpecular(
      context,
      center,
      radius
    );

    drawTerminator(
      context,
      center,
      radius
    );

    return true;
  }

  function renderGeometryFrame(
    turn,
    cloudTurn,
    pulse
  ) {
    if (
      !state.context ||
      !state.canvas ||
      !state.terrainMesh
    ) {
      state.counters.renderSkips +=
        1;

      return false;
    }

    ensureCanvasSize();

    const context =
      state.context;

    const mesh =
      state.terrainMesh;

    const positions =
      mesh.positions;

    const indices =
      mesh.indices;

    const materialHints =
      mesh.materialHints ||
      null;

    const waterClasses =
      mesh.waterClasses ||
      null;

    const size =
      state.canvas.width;

    const center =
      size / 2;

    const radius =
      size * 0.39;

    const yaw =
      turn *
      Math.PI *
      2;

    const pitch =
      -0.24;

    const light =
      createLightVector();

    const projected =
      new Array(
        mesh.vertexCount
      );

    for (
      let vertexIndex = 0;
      vertexIndex < mesh.vertexCount;
      vertexIndex += 1
    ) {
      const offset =
        vertexIndex *
        3;

      const rotated =
        rotatePoint(
          positions[offset],
          positions[offset + 1],
          positions[offset + 2],
          yaw,
          pitch
        );

      projected[vertexIndex] =
        projectPoint(
          rotated,
          center,
          radius
        );
    }

    const triangles = [];

    for (
      let index = 0;
      index < indices.length;
      index += 3
    ) {
      const ia =
        indices[index];

      const ib =
        indices[index + 1];

      const ic =
        indices[index + 2];

      const a =
        projected[ia];

      const b =
        projected[ib];

      const c =
        projected[ic];

      const averageZ =
        (
          a.z +
          b.z +
          c.z
        ) /
        3;

      if (averageZ <= -0.04) {
        continue;
      }

      if (
        !triangleVisible(
          a,
          b,
          c
        )
      ) {
        continue;
      }

      triangles.push({
        ia,
        ib,
        ic,
        a,
        b,
        c,
        z:
          averageZ
      });
    }

    triangles.sort(
      (
        first,
        second
      ) =>
        first.z -
        second.z
    );

    clearCanvas();

    drawAtmosphere(
      context,
      size,
      center,
      radius,
      pulse
    );

    context.save();

    context.beginPath();

    context.arc(
      center,
      center,
      radius * 1.015,
      0,
      Math.PI * 2
    );

    context.clip();

    drawBaseSphere(
      context,
      center,
      radius,
      pulse
    );

    for (
      const triangle
      of triangles
    ) {
      const materialHint =
        materialHints
          ? Math.round(
              (
                materialHints[triangle.ia] +
                materialHints[triangle.ib] +
                materialHints[triangle.ic]
              ) /
              3
            )
          : MATERIAL_HINT.LOWLAND;

      const waterClass =
        waterClasses
          ? Math.round(
              (
                waterClasses[triangle.ia] +
                waterClasses[triangle.ib] +
                waterClasses[triangle.ic]
              ) /
              3
            )
          : WATER_CLASS.NONE;

      const baseColor =
        materialColor(
          materialHint,
          waterClass
        );

      const lightValue =
        (
          dotLight(
            triangle.a,
            light
          ) +
          dotLight(
            triangle.b,
            light
          ) +
          dotLight(
            triangle.c,
            light
          )
        ) /
        3;

      const color =
        shadeColor(
          baseColor,
          lightValue,
          waterClass
        );

      drawTriangle(
        context,
        triangle.a,
        triangle.b,
        triangle.c,
        colorToCss(
          color,
          0.985
        )
      );
    }

    context.restore();

    drawClouds(
      context,
      center,
      radius,
      yaw,
      cloudTurn
    );

    drawSubtleSpecular(
      context,
      center,
      radius
    );

    drawTerminator(
      context,
      center,
      radius
    );

    state.counters.renderFrames +=
      1;

    return true;
  }

  function animationAllowed() {
    return Boolean(
      state.mounted &&
      state.ready &&
      !state.disposed &&
      !state.failed &&
      !state.paused &&
      !state.reducedMotion &&
      state.root &&
      state.canvas
    );
  }

  function renderStatic() {
    if (state.fallbackMode) {
      return renderFallbackDisk();
    }

    if (!state.terrainMesh) {
      return false;
    }

    return renderGeometryFrame(
      0.08,
      0.18,
      0
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
      `${turn * 360}deg`
    );

    setRootProperty(
      "--showroom-planet-cloud-turn",
      `${cloudTurn * 360}deg`
    );

    setRootProperty(
      "--showroom-planet-pulse",
      String(pulse)
    );

    renderGeometryFrame(
      turn,
      cloudTurn,
      pulse
    );

    state.lastRenderTurn =
      turn;

    state.frameId =
      window.requestAnimationFrame(
        animationStep
      );
  }

  function startAnimation() {
    cancelAnimation();

    if (!animationAllowed()) {
      renderStatic();

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

  function cancelAnimation() {
    if (state.frameId) {
      window.cancelAnimationFrame(
        state.frameId
      );
    }

    state.frameId =
      0;
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

    renderStatic();
  }

  function markReady(reason) {
    state.ready =
      true;

    state.failed =
      false;

    state.paused =
      false;

    state.fallbackMode =
      false;

    state.waitingForGeometry =
      false;

    setFallbackText("");

    applyStateAttribute();
    applyReducedMotionAttribute();

    state.counters.ready +=
      1;

    renderStatic();

    publishReceipt(
      "ready",
      {
        reason:
          normalize(reason) ||
          "mounted",

        sourceGeometryUsed:
          Boolean(state.geometryPacket),

        sourceGeometryContract:
          AUDRALIA_GEOMETRY_CONTRACT,

        sourceGeometryHash:
          state.lastGeometryHash,

        terrainLevel:
          state.terrainMesh
            ? state.terrainMesh.level
            : null,

        terrainVertexCount:
          state.terrainMesh
            ? state.terrainMesh.vertexCount
            : null,

        terrainTriangleCount:
          state.terrainMesh
            ? state.terrainMesh.triangleCount
            : null,

        landCoverage:
          state.terrainMesh &&
          state.terrainMesh.metrics
            ? state.terrainMesh.metrics.landCoverage
            : null,

        oceanCoverage:
          state.terrainMesh &&
          state.terrainMesh.metrics
            ? state.terrainMesh.metrics.oceanCoverage
            : null,

        staticFallbackAvailable:
          true,

        animationAllowed:
          animationAllowed(),

        visualIdentity:
          "mini-audralia",

        visualRevision:
          VISUAL_REVISION,

        visualCorrection:
          "renderer-origin-glare-reduction-and-cool-balanced-globe-lighting",

        navigationMeaning:
          "main-compass-return-selection",

        clickAuthority:
          "[data-showroom-compass-control]",

        semanticActivation:
          "none",

        webGL:
          false,

        canvas2dRenderer:
          true
      }
    );

    dispatch(
      EVENTS.ready,
      {
        reason:
          normalize(reason) ||
          "mounted",

        sourceGeometryUsed:
          Boolean(state.geometryPacket),

        visualIdentity:
          "mini-audralia",

        visualRevision:
          VISUAL_REVISION,

        navigationMeaning:
          "main-compass-return-selection"
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

      if (
        !state.context ||
        !isCanvas(state.canvas)
      ) {
        throw new Error(
          "The mini Audralia planet requires a Canvas 2D context."
        );
      }

      state.mounted =
        true;

      state.ready =
        false;

      state.failed =
        false;

      state.paused =
        false;

      state.fallbackMode =
        false;

      state.waitingForGeometry =
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

          visualIdentity:
            "mini-audralia",

          visualRevision:
            VISUAL_REVISION,

          navigationMeaning:
            "main-compass-return-selection",

          clickAuthority:
            "[data-showroom-compass-control]",

          audraliaGeometryAuthorityRequired:
            true,

          audraliaGeometryAuthorityGlobal:
            AUDRALIA_GEOMETRY_GLOBAL,

          audraliaGeometryAuthorityContract:
            AUDRALIA_GEOMETRY_CONTRACT,

          canvas2dRenderer:
            true,

          webGL:
            false
        }
      );

      const geometryReady =
        initializeGeometry(
          options
        );

      if (geometryReady) {
        return markReady(
          "mounted-with-audralia-geometry-authority"
        );
      }

      return true;
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

    clearGeometryWaitTimer();
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

    state.target =
      null;

    state.root =
      null;

    state.shell =
      null;

    state.body =
      null;

    state.canvas =
      null;

    state.context =
      null;

    state.fallback =
      null;

    state.receiptTarget =
      null;

    state.geometryPacket =
      null;

    state.terrainMesh =
      null;

    state.cloudMesh =
      null;

    state.lastGeometryHash =
      "";

    state.mounted =
      false;

    state.ready =
      false;

    state.failed =
      false;

    state.paused =
      false;

    state.fallbackMode =
      false;

    state.waitingForGeometry =
      false;

    state.pauseReason =
      "";

    state.animationStartedAt =
      0;

    state.lastRenderTurn =
      NaN;

    state.lastCanvasSize =
      0;

    state.counters.unmounts +=
      1;

    publishReceipt(
      "unmounted",
      {
        reason:
          normalize(reason) ||
          "api",

        localDomRemoved:
          true
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

    clearGeometryWaitTimer();
    unbindReducedMotion();
    cancelAnimation();

    state.disposed =
      true;

    state.ready =
      false;

    state.failed =
      false;

    state.paused =
      false;

    state.fallbackMode =
      false;

    state.waitingForGeometry =
      false;

    state.pauseReason =
      "";

    state.geometryAuthority =
      null;

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

        geometryAuthorityMutated:
          false,

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
        visualIdentity:
          "mini-audralia",

        visualRevision:
          VISUAL_REVISION,

        navigationMeaning:
          "main-compass-return-selection",

        sourceGeometryContract:
          AUDRALIA_GEOMETRY_CONTRACT,

        sourceGeometryHash:
          state.lastGeometryHash,

        terrainLevel:
          state.terrainMesh
            ? state.terrainMesh.level
            : null,

        terrainVertexCount:
          state.terrainMesh
            ? state.terrainMesh.vertexCount
            : null,

        terrainTriangleCount:
          state.terrainMesh
            ? state.terrainMesh.triangleCount
            : null,

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

      visualRevision:
        VISUAL_REVISION,

      owner:
        OWNER,

      sourceAuthorityGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      sourceAuthorityContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      visualIdentity:
        "mini-audralia",

      navigationMeaning:
        "main-compass-return-selection",

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

      visualIdentity:
        "mini-audralia",

      visualRevision:
        VISUAL_REVISION,

      navigationMeaning:
        "main-compass-return-selection",

      clickAuthority:
        "[data-showroom-compass-control]",

      requiredGeometryAuthority:
        "/assets/audralia/audralia.planet.js",

      requiredGeometryGlobal:
        AUDRALIA_GEOMETRY_GLOBAL,

      requiredGeometryContract:
        AUDRALIA_GEOMETRY_CONTRACT,

      canvas2dRenderer:
        true,

      webGL:
        false,

      navigationAuthority:
        false,

      productionAuthorization:
        false,

      deploymentAuthorization:
        false
    }
  );
})();
