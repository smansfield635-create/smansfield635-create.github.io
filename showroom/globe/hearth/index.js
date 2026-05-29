// /showroom/globe/hearth/index.js
// HEARTH_INDEX_JS_ROUTE_BRIDGE_RECONSTRUCTION_TNT_v1
// Full-file replacement.
// Index bridge / compatibility loader only.
// Purpose:
// - Reconstruct index.js after accidental overwrite.
// - Keep filename/job alignment: index.js is NOT hearth.js.
// - Restore immediate loading screen.
// - Delegate active route authority to /showroom/globe/hearth/hearth.js.
// - Load /assets/hearth/hearth.canvas.js only as degraded emergency delegation if hearth.js cannot boot.
// - Retire hearth.climate.route.js from active carrier duty.
// - Never require Runtime Table, source stack, or wide-probe before first visible carrier.
// Does not own:
// - active route conduction
// - canvas drawing
// - atlas pixel painting
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology truth
// - material palette truth
// - runtime motion
// - controls authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_INDEX_JS_ROUTE_BRIDGE_RECONSTRUCTION_TNT_v1";
  const RECEIPT = "HEARTH_INDEX_JS_ROUTE_BRIDGE_RECONSTRUCTION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "ACCIDENTAL_HEARTH_JS_OVERWRITE_IN_INDEX_JS";
  const REQUIRED_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CARRIER_FIRST_RECOVERY_TNT_v1";
  const VERSION = "2026-05-29.hearth-index-js-route-bridge-reconstruction-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ACTIVE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const RETIRED_CLIMATE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const MOUNT_ID = "hearthCanvasMount";
  const STATUS_ID = "hearth-route-status";

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    file: INDEX_FILE,
    role: "index-bridge-compatibility-loader",
    activeRouteConductor: ACTIVE_CONDUCTOR_FILE,
    retiredClimateRoute: RETIRED_CLIMATE_FILE,
    bootStarted: false,
    bootComplete: false,
    mountReady: false,
    loadingScreenReady: false,
    conductorPresent: false,
    conductorLoaded: false,
    conductorBootRequested: false,
    conductorBootOk: false,
    conductorContract: "",
    canvasFallbackRequested: false,
    canvasFallbackLoaded: false,
    canvasFallbackBootOk: false,
    canvasCarrierVisible: false,
    dragInspectionLikelyBound: false,
    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,
    firstFailedCoordinate: "INDEX_BRIDGE_NOT_STARTED",
    recommendedNextRenewalTarget: "index-bridge-boot",
    error: "",
    updatedAt: ""
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function cacheKey() {
    return `${CONTRACT}-${Date.now()}`;
  }

  function safeText(value) {
    return value === undefined || value === null ? "" : String(value);
  }

  function safeCall(fn, fallback = null) {
    try {
      return fn();
    } catch (error) {
      state.error = error && error.message ? error.message : String(error);
      return fallback;
    }
  }

  function getGlobal(names) {
    for (const name of names) {
      if (root[name]) return root[name];
    }
    return null;
  }

  function ensureMount() {
    if (!doc) return null;

    let mount =
      doc.getElementById(MOUNT_ID) ||
      doc.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = MOUNT_ID;
      mount.dataset.hearthCanvasMount = "true";

      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthIndexBridge = CONTRACT;
    mount.dataset.hearthIndexBridgeReceipt = RECEIPT;
    mount.dataset.hearthActiveRouteConductor = ACTIVE_CONDUCTOR_FILE;
    mount.dataset.hearthClimateRouteRetired = "true";
    mount.dataset.hearthVisibleCarrierFirst = "true";
    mount.dataset.runtimeTableRequiredForFirstRender = "false";
    mount.dataset.sourceStackRequiredForFirstRender = "false";
    mount.dataset.wideProbeDeferred = "true";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";
    mount.style.webkitUserSelect = "none";
    mount.style.webkitTouchCallout = "none";

    state.mountReady = true;
    return mount;
  }

  function ensureLoadingScreen(mount) {
    if (!doc || !mount) return null;

    mount.querySelectorAll("[data-hearth-mount-fallback]").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
    });

    let screen = mount.querySelector("[data-hearth-index-loading-screen]");

    if (!screen) {
      screen = doc.createElement("div");
      screen.dataset.hearthIndexLoadingScreen = "true";
      screen.setAttribute("aria-live", "polite");
      screen.textContent = "Hearth visible carrier loading.";

      screen.style.position = "absolute";
      screen.style.inset = "0";
      screen.style.zIndex = "8";
      screen.style.display = "grid";
      screen.style.placeItems = "center";
      screen.style.padding = "20px";
      screen.style.textAlign = "center";
      screen.style.pointerEvents = "none";
      screen.style.color = "rgba(238,246,255,.82)";
      screen.style.font = "900 clamp(1rem,4.4vw,1.45rem)/1.15 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
      screen.style.letterSpacing = "-.035em";
      screen.style.background = [
        "radial-gradient(circle at 50% 50%, rgba(9,42,67,.74), rgba(2,8,18,.42) 58%, rgba(2,8,18,.78))",
        "linear-gradient(180deg, rgba(3,9,20,.20), rgba(3,9,20,.72))"
      ].join(",");

      mount.appendChild(screen);
    }

    state.loadingScreenReady = true;
    return screen;
  }

  function markCanvasVisibility() {
    if (!doc) return false;

    const mount =
      doc.getElementById(MOUNT_ID) ||
      doc.querySelector("[data-hearth-canvas-mount]");

    const canvas = mount
      ? mount.querySelector("canvas")
      : doc.querySelector("#hearthCanvasMount canvas");

    const canvasApi = getGlobal(["HEARTH_CANVAS", "HearthCanvas"]);
    const apiState = canvasApi && canvasApi.state ? canvasApi.state : null;

    state.canvasCarrierVisible = Boolean(
      canvas ||
      root.HEARTH_CANVAS_POSTGAME_RECEIPT?.canvasCarrierMounted === true ||
      root.HEARTH_CANVAS_RECEIPT?.canvasCarrierMounted === true ||
      apiState?.mounted === true ||
      apiState?.firstFramePainted === true
    );

    state.dragInspectionLikelyBound = Boolean(
      apiState?.dragInspectionBound === true ||
      root.HEARTH_CANVAS_POSTGAME_RECEIPT?.dragInspectionBound === true ||
      root.HEARTH_CANVAS_RECEIPT?.dragInspectionBound === true
    );

    if (state.canvasCarrierVisible) {
      state.firstFailedCoordinate = "POST_FRAME_DIAGNOSTIC_PENDING";
      state.recommendedNextRenewalTarget = "post-frame-diagnostic-receipt";
    }

    return state.canvasCarrierVisible;
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthIndexBridgeLoaded = "true";
    dataset.hearthIndexBridgeContract = CONTRACT;
    dataset.hearthIndexBridgeReceipt = RECEIPT;
    dataset.hearthIndexBridgePreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthIndexBridgeRole = "compatibility-loader";
    dataset.hearthIndexBridgeIsActiveConductor = "false";
    dataset.hearthActiveRouteFile = ACTIVE_CONDUCTOR_FILE;
    dataset.hearthActiveRouteContract = REQUIRED_CONDUCTOR_CONTRACT;
    dataset.hearthClimateRouteRetired = "true";
    dataset.hearthRetiredClimateRouteFile = RETIRED_CLIMATE_FILE;
    dataset.hearthVisibleCarrierFirst = "true";
    dataset.hearthRuntimeTableRequiredForFirstRender = "false";
    dataset.hearthSourceStackRequiredForFirstRender = "false";
    dataset.hearthWideProbeDeferred = "true";
    dataset.hearthConductorPresent = String(state.conductorPresent);
    dataset.hearthConductorLoaded = String(state.conductorLoaded);
    dataset.hearthConductorBootRequested = String(state.conductorBootRequested);
    dataset.hearthConductorBootOk = String(state.conductorBootOk);
    dataset.hearthCanvasFallbackRequested = String(state.canvasFallbackRequested);
    dataset.hearthCanvasFallbackBootOk = String(state.canvasFallbackBootOk);
    dataset.hearthCanvasCarrierVisible = String(state.canvasCarrierVisible);
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishStatus(status) {
    state.updatedAt = nowIso();
    markCanvasVisibility();
    publishDataset();

    const receipt = getReceipt({ status });

    root.HEARTH_INDEX_BRIDGE = api;
    root.HEARTH_INDEX_BRIDGE_RECEIPT = receipt;
    root.HEARTH_INDEX_JS_RECEIPT = receipt;
    root.__HEARTH_INDEX_BRIDGE_FILE__ = INDEX_FILE;
    root.__HEARTH_ACTIVE_ROUTE_FILE__ = ACTIVE_CONDUCTOR_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = REQUIRED_CONDUCTOR_CONTRACT;
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;

    const node = doc
      ? doc.getElementById(STATUS_ID) || doc.querySelector("[data-hearth-route-status]")
      : null;

    if (node) {
      node.textContent = [
        "Hearth index bridge reconstructed.",
        `Index bridge ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Index file ${INDEX_FILE}`,
        `Active conductor ${ACTIVE_CONDUCTOR_FILE}`,
        `Required conductor contract ${REQUIRED_CONDUCTOR_CONTRACT}`,
        `Climate route retired ${RETIRED_CLIMATE_FILE}`,
        `Mount ready ${state.mountReady}`,
        `Loading screen ready ${state.loadingScreenReady}`,
        `Conductor present ${state.conductorPresent}`,
        `Conductor loaded ${state.conductorLoaded}`,
        `Conductor boot requested ${state.conductorBootRequested}`,
        `Conductor boot ok ${state.conductorBootOk}`,
        `Canvas fallback requested ${state.canvasFallbackRequested}`,
        `Canvas fallback boot ok ${state.canvasFallbackBootOk}`,
        `Canvas carrier visible ${state.canvasCarrierVisible}`,
        `Drag inspection likely bound ${state.dragInspectionLikelyBound}`,
        "Runtime Table required for first render false",
        "Source stack required for first render false",
        "Wide probe deferred true",
        "Generated image false",
        "GraphicBox false",
        "WebGL false",
        "Visual pass claimed false",
        `First failed coordinate ${state.firstFailedCoordinate}`,
        `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
        state.error ? `Error ${state.error}` : "",
        `Status ${status}`
      ].filter(Boolean).join("\n");
    }
  }

  function retireClimateRoute() {
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;
    root.__HEARTH_RETIRED_ROUTE_FILE__ = RETIRED_CLIMATE_FILE;

    [
      "__HEARTH_VISIBLE_RECOVERY_DISPOSE__",
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__"
    ].forEach((name) => {
      if (typeof root[name] === "function") safeCall(() => root[name](), null);

      try {
        root[name] = undefined;
        delete root[name];
      } catch (_error) {}
    });

    if (doc) {
      doc.querySelectorAll("script[src*='hearth.climate.route.js']").forEach((script) => {
        script.dataset.hearthClimateRouteRetired = "true";
        script.dataset.retiredBy = CONTRACT;
      });
    }
  }

  function scriptAlreadyPresent(src) {
    if (!doc) return null;
    const clean = src.split("?")[0];

    return Array.from(doc.scripts || []).find((script) => {
      const actual = script.getAttribute("src") || "";
      return actual.includes(clean);
    }) || null;
  }

  function loadScript(src, key, globalNames, timeoutMs = 3500) {
    const existingGlobal = getGlobal(globalNames);

    if (existingGlobal) {
      return Promise.resolve({
        key,
        src,
        loaded: true,
        globalPresent: true,
        status: "GLOBAL_PRESENT",
        error: ""
      });
    }

    if (!doc || !doc.head) {
      return Promise.resolve({
        key,
        src,
        loaded: false,
        globalPresent: false,
        status: "DOCUMENT_HEAD_MISSING",
        error: "document.head unavailable"
      });
    }

    const existing = scriptAlreadyPresent(src);

    if (existing && getGlobal(globalNames)) {
      return Promise.resolve({
        key,
        src,
        loaded: true,
        globalPresent: true,
        status: "SCRIPT_ALREADY_PRESENT_GLOBAL_READY",
        error: ""
      });
    }

    return new Promise((resolve) => {
      const script = doc.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(cacheKey())}`;
      script.defer = true;
      script.dataset.hearthFile = "true";
      script.dataset.hearthLoadedByIndexBridge = CONTRACT;
      script.dataset.hearthScriptKey = key;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      function finish(status, error = "") {
        if (settled) return;
        settled = true;

        resolve({
          key,
          src,
          loaded: status === "LOADED" || Boolean(getGlobal(globalNames)),
          globalPresent: Boolean(getGlobal(globalNames)),
          status,
          error
        });
      }

      script.onload = () => finish("LOADED");
      script.onerror = () => finish("LOAD_FAILED", "script load error");

      doc.head.appendChild(script);

      root.setTimeout(() => {
        if (!settled) {
          finish(
            getGlobal(globalNames) ? "TIMEOUT_GLOBAL_PRESENT" : "LOAD_TIMEOUT",
            getGlobal(globalNames) ? "" : "script load timeout"
          );
        }
      }, timeoutMs);
    });
  }

  async function delegateToConductor() {
    let conductor = getGlobal(["HEARTH_ROUTE_CONDUCTOR", "HearthRouteConductor", "HEARTH_ACTIVE_ROUTE"]);

    state.conductorPresent = Boolean(conductor);
    state.conductorContract = safeText(conductor && conductor.contract);

    if (!conductor) {
      const loaded = await loadScript(
        ACTIVE_CONDUCTOR_FILE,
        "hearth-route-conductor",
        ["HEARTH_ROUTE_CONDUCTOR", "HearthRouteConductor", "HEARTH_ACTIVE_ROUTE"],
        4200
      );

      state.conductorLoaded = loaded.loaded;
      conductor = getGlobal(["HEARTH_ROUTE_CONDUCTOR", "HearthRouteConductor", "HEARTH_ACTIVE_ROUTE"]);
      state.conductorPresent = Boolean(conductor);
      state.conductorContract = safeText(conductor && conductor.contract);

      if (!conductor) {
        state.firstFailedCoordinate = "CONDUCTOR_GLOBAL_MISSING";
        state.recommendedNextRenewalTarget = "/showroom/globe/hearth/hearth.js";
        publishStatus("CONDUCTOR_GLOBAL_MISSING");
        return false;
      }
    } else {
      state.conductorLoaded = true;
    }

    const method =
      typeof conductor.boot === "function" ? "boot" :
        typeof conductor.start === "function" ? "start" :
          typeof conductor.init === "function" ? "init" :
            typeof conductor.run === "function" ? "run" :
              "";

    if (!method) {
      state.firstFailedCoordinate = "CONDUCTOR_BOOT_METHOD_MISSING";
      state.recommendedNextRenewalTarget = "/showroom/globe/hearth/hearth.js";
      publishStatus("CONDUCTOR_BOOT_METHOD_MISSING");
      return false;
    }

    state.conductorBootRequested = true;
    publishStatus("CONDUCTOR_BOOT_REQUESTED");

    try {
      const result = conductor[method]({
        calledBy: CONTRACT,
        indexBridgeFile: INDEX_FILE,
        mount: ensureMount(),
        visibleCarrierFirst: true,
        runtimeTableRequiredForFirstRender: false,
        sourceStackRequiredForFirstRender: false,
        wideProbeDeferred: true,
        climateRouteRetired: true,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      });

      if (result && typeof result.then === "function") {
        await result;
      }

      state.conductorBootOk = true;
      state.firstFailedCoordinate = markCanvasVisibility()
        ? "POST_FRAME_DIAGNOSTIC_PENDING"
        : "CONDUCTOR_BOOTED_WAITING_FOR_CANVAS";
      state.recommendedNextRenewalTarget = markCanvasVisibility()
        ? "post-frame-diagnostic-receipt"
        : "/assets/hearth/hearth.canvas.js";
      publishStatus("CONDUCTOR_BOOTED");
      return true;
    } catch (error) {
      state.error = error && error.message ? error.message : String(error);
      state.conductorBootOk = false;
      state.firstFailedCoordinate = "CONDUCTOR_BOOT_ERROR";
      state.recommendedNextRenewalTarget = "/showroom/globe/hearth/hearth.js";
      publishStatus("CONDUCTOR_BOOT_ERROR");
      return false;
    }
  }

  async function degradedCanvasFallback(reason) {
    state.canvasFallbackRequested = true;
    publishStatus(`CANVAS_FALLBACK_REQUESTED_${reason || "UNKNOWN"}`);

    let canvasApi = getGlobal(["HEARTH_CANVAS", "HearthCanvas"]);

    if (!canvasApi) {
      const loaded = await loadScript(
        CANVAS_FILE,
        "hearth-canvas",
        ["HEARTH_CANVAS", "HearthCanvas"],
        4200
      );

      state.canvasFallbackLoaded = loaded.loaded;
      canvasApi = getGlobal(["HEARTH_CANVAS", "HearthCanvas"]);
    } else {
      state.canvasFallbackLoaded = true;
    }

    if (!canvasApi) {
      state.firstFailedCoordinate = "CANVAS_GLOBAL_MISSING";
      state.recommendedNextRenewalTarget = "/assets/hearth/hearth.canvas.js";
      publishStatus("CANVAS_GLOBAL_MISSING");
      return false;
    }

    const method =
      typeof canvasApi.boot === "function" ? "boot" :
        typeof canvasApi.mount === "function" ? "mount" :
          typeof canvasApi.start === "function" ? "start" :
            typeof canvasApi.init === "function" ? "init" :
              typeof canvasApi.mountVisibleCarrier === "function" ? "mountVisibleCarrier" :
                typeof canvasApi.bootVisibleCarrier === "function" ? "bootVisibleCarrier" :
                  "";

    if (!method) {
      state.firstFailedCoordinate = "CANVAS_BOOT_METHOD_MISSING";
      state.recommendedNextRenewalTarget = "/assets/hearth/hearth.canvas.js";
      publishStatus("CANVAS_BOOT_METHOD_MISSING");
      return false;
    }

    try {
      const result = canvasApi[method]({
        calledBy: CONTRACT,
        mount: ensureMount(),
        indexBridgeFallback: true,
        activeRouteConductor: ACTIVE_CONDUCTOR_FILE,
        conductorDegradedReason: reason || "CONDUCTOR_UNAVAILABLE",
        visibleCarrierFirst: true,
        runtimeTableRequiredForFirstRender: false,
        sourceStackRequiredForFirstRender: false,
        runtimeTableMode: "INDEX_BRIDGE_DEGRADED_CANVAS_DELEGATION",
        wideProbeDeferred: true,
        climateRouteRetired: true,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      });

      if (result && typeof result.then === "function") {
        await result;
      }

      state.canvasFallbackBootOk = true;
      markCanvasVisibility();

      state.firstFailedCoordinate = state.canvasCarrierVisible
        ? "CONDUCTOR_DEGRADED_CANVAS_VISIBLE"
        : "CANVAS_FALLBACK_BOOTED_PENDING_FRAME";

      state.recommendedNextRenewalTarget = state.canvasCarrierVisible
        ? "/showroom/globe/hearth/hearth.js"
        : "/assets/hearth/hearth.canvas.js";

      publishStatus("CANVAS_FALLBACK_BOOTED");
      return state.canvasCarrierVisible;
    } catch (error) {
      state.error = error && error.message ? error.message : String(error);
      state.canvasFallbackBootOk = false;
      state.firstFailedCoordinate = "CANVAS_FALLBACK_BOOT_ERROR";
      state.recommendedNextRenewalTarget = "/assets/hearth/hearth.canvas.js";
      publishStatus("CANVAS_FALLBACK_BOOT_ERROR");
      return false;
    }
  }

  function startVisibilityWatchdog() {
    let ticks = 0;

    const timer = root.setInterval(() => {
      ticks += 1;
      const visible = markCanvasVisibility();

      if (visible) {
        publishStatus("VISIBLE_CARRIER_CONFIRMED");
        root.clearInterval(timer);
        return;
      }

      if (ticks === 10 && state.conductorBootOk && !state.canvasCarrierVisible) {
        degradedCanvasFallback("CONDUCTOR_BOOTED_BUT_CANVAS_NOT_VISIBLE");
      }

      if (ticks >= 30) {
        state.firstFailedCoordinate = state.canvasCarrierVisible
          ? "POST_FRAME_DIAGNOSTIC_PENDING"
          : "VISIBLE_CARRIER_NOT_CONFIRMED";

        state.recommendedNextRenewalTarget = state.canvasCarrierVisible
          ? "post-frame-diagnostic-receipt"
          : "/assets/hearth/hearth.canvas.js";

        publishStatus(state.canvasCarrierVisible ? "VISIBLE_CARRIER_CONFIRMED" : "VISIBLE_CARRIER_NOT_CONFIRMED");
        root.clearInterval(timer);
      }
    }, 300);
  }

  async function boot() {
    if (state.bootStarted) {
      publishStatus("BOOT_ALREADY_STARTED");
      return getReceipt({ status: "BOOT_ALREADY_STARTED" });
    }

    state.bootStarted = true;
    state.firstFailedCoordinate = "INDEX_BRIDGE_BOOT_STARTED";
    state.recommendedNextRenewalTarget = "active-route-conductor";
    state.updatedAt = nowIso();

    retireClimateRoute();

    const mount = ensureMount();
    ensureLoadingScreen(mount);

    publishStatus("LOADING_SCREEN_READY");

    const conductorOk = await delegateToConductor();

    if (!conductorOk) {
      await degradedCanvasFallback("CONDUCTOR_UNAVAILABLE");
    }

    startVisibilityWatchdog();

    state.bootComplete = true;
    publishStatus("INDEX_BRIDGE_BOOT_COMPLETE");

    return getReceipt({ status: "INDEX_BRIDGE_BOOT_COMPLETE" });
  }

  function getReceipt(extra = {}) {
    const visible = markCanvasVisibility();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      requiredConductorContract: REQUIRED_CONDUCTOR_CONTRACT,
      version: VERSION,
      authority: "hearth-index-route-bridge",
      destinationFile: INDEX_FILE,
      status: extra.status || (visible ? "VISIBLE_CARRIER_DELEGATED" : "LOADING_SCREEN_ACTIVE"),

      fileNameMatchesRole: true,
      indexJsIsNotHearthJs: true,
      activeRouteConductor: ACTIVE_CONDUCTOR_FILE,
      conductorContract: state.conductorContract,
      conductorPresent: state.conductorPresent,
      conductorLoaded: state.conductorLoaded,
      conductorBootRequested: state.conductorBootRequested,
      conductorBootOk: state.conductorBootOk,

      retiredClimateRoute: true,
      retiredClimateRouteFile: RETIRED_CLIMATE_FILE,
      climateRouteActive: false,

      mountReady: state.mountReady,
      loadingScreenReady: state.loadingScreenReady,
      canvasFallbackRequested: state.canvasFallbackRequested,
      canvasFallbackLoaded: state.canvasFallbackLoaded,
      canvasFallbackBootOk: state.canvasFallbackBootOk,
      canvasCarrierVisible: state.canvasCarrierVisible,
      dragInspectionLikelyBound: state.dragInspectionLikelyBound,

      runtimeTableRequiredForFirstRender: false,
      runtimeTableMissingDoesNotBlockCarrier: true,
      sourceStackRequiredForFirstRender: false,
      sourceFailureDoesNotBlankCarrier: true,
      visibleCarrierFirst: true,
      wideProbeDeferred: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      ownsActiveRouteConduction: false,
      ownsCanvasDrawing: false,
      ownsAtlasPixelPainting: false,
      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsHydrologyTruth: false,
      ownsMaterialPaletteTruth: false,
      ownsRuntimeMotion: false,
      ownsControlsAuthority: false,
      ownsFinalVisualPass: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      error: state.error,
      updatedAt: state.updatedAt || nowIso(),
      ...extra
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    requiredConductorContract: REQUIRED_CONDUCTOR_CONTRACT,
    version: VERSION,

    boot,
    start: boot,
    init: boot,
    run: boot,
    getReceipt,

    indexFile: INDEX_FILE,
    activeRouteConductor: ACTIVE_CONDUCTOR_FILE,
    retiredClimateRoute: RETIRED_CLIMATE_FILE,

    supportsIndexBridgeReconstruction: true,
    supportsLoadingScreenRestore: true,
    supportsConductorDelegation: true,
    supportsCanvasFallbackDelegation: true,
    supportsClimateRouteRetirement: true,
    supportsVisibleCarrierFirst: true,

    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.indexBridge = api;

  root.HEARTH_INDEX_BRIDGE = api;
  root.HearthIndexBridge = api;
  root.HEARTH_INDEX_JS = api;
  root.HEARTH_INDEX_BRIDGE_CONTRACT = CONTRACT;
  root.HEARTH_INDEX_BRIDGE_RECEIPT = getReceipt({ status: "LOADED_NOT_BOOTED" });
  root.__HEARTH_INDEX_BRIDGE_FILE__ = INDEX_FILE;
  root.__HEARTH_ACTIVE_ROUTE_FILE__ = ACTIVE_CONDUCTOR_FILE;
  root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = REQUIRED_CONDUCTOR_CONTRACT;
  root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;

  publishDataset();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => {
        boot();
      }, { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
