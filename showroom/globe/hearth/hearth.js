// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_CARRIER_FIRST_RECOVERY_TNT_v1
// Full-file replacement.
// Active Hearth route conductor only.
// Purpose:
// - Make hearth.js the active Hearth route conductor.
// - Restore loading screen immediately.
// - Load /assets/hearth/hearth.canvas.js as the visible carrier.
// - Retire hearth.climate.route.js from active route authority.
// - Consume Runtime Table if present, but never require it for first visible render.
// - Load/verify source authorities without letting source failure blank the carrier.
// - Execute visible-carrier-first sequence.
// Does not own:
// - canvas drawing
// - atlas pixel painting
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology truth
// - material palette truth
// - runtime motion
// - controls authority
// - route shell HTML
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CARRIER_FIRST_RECOVERY_TNT_v1";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CARRIER_FIRST_RECOVERY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_TECTONIC_PARENT_CHAIN_ROUTE_TNT_v21";
  const BASELINE_CONTRACT = "HEARTH_SOURCE_ALIGNED_VISIBLE_GLOBE_ROUTE_TNT_v17";
  const VERSION = "2026-05-29.hearth-route-conductor-carrier-first-recovery-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const documentRef = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const ACTIVE_ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const RETIRED_ROUTE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";
  const MOUNT_ID = "hearthCanvasMount";
  const STATUS_ID = "hearth-route-status";

  const SCRIPT_PLAN = Object.freeze([
    {
      key: "runtime-table",
      role: "diagnostic-procedural-plan-equipment",
      src: "/assets/lab/runtime-table.js",
      requiredForFirstRender: false,
      globalNames: ["LAB_RUNTIME_TABLE", "DexterRuntimeTable", "RUNTIME_TABLE"]
    },
    {
      key: "tectonics",
      role: "source-truth-provider",
      src: "/assets/hearth/hearth.tectonics.js",
      requiredForFirstRender: false,
      globalNames: ["HEARTH_TECTONICS", "HearthTectonics"]
    },
    {
      key: "elevation",
      role: "source-truth-provider",
      src: "/assets/hearth/hearth.elevation.js",
      requiredForFirstRender: false,
      globalNames: ["HEARTH_ELEVATION", "HearthElevation"]
    },
    {
      key: "composition",
      role: "source-truth-provider",
      src: "/assets/hearth/hearth.composition.js",
      requiredForFirstRender: false,
      globalNames: ["HEARTH_COMPOSITION", "HearthComposition"]
    },
    {
      key: "hydrology",
      role: "source-truth-provider",
      src: "/assets/hearth/hearth.hydrology.js",
      requiredForFirstRender: false,
      globalNames: ["HEARTH_HYDROLOGY", "HearthHydrology"]
    },
    {
      key: "materials",
      role: "source-truth-provider",
      src: "/assets/hearth/hearth.materials.js",
      requiredForFirstRender: false,
      globalNames: ["HEARTH_MATERIALS", "HearthMaterials"]
    },
    {
      key: "canvas",
      role: "visible-carrier-drawing-authority",
      src: "/assets/hearth/hearth.canvas.js",
      requiredForFirstRender: true,
      globalNames: ["HEARTH_CANVAS", "HearthCanvas"]
    }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    route: ROUTE,
    activeRouteFile: ACTIVE_ROUTE_FILE,
    retiredClimateRoute: true,
    bootStarted: false,
    bootComplete: false,
    mountReady: false,
    loadingScreenReady: false,
    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    runtimeTablePresent: false,
    runtimeTableMode: "UNTOUCHED",
    runtimePlan: null,
    sourceAuthorityHeld: true,
    sourceStatus: {},
    scriptStatus: {},
    scriptErrors: [],
    visibleCarrierFirst: true,
    wideProbeDeferred: true,
    firstFailedCoordinate: "BOOT_NOT_STARTED",
    recommendedNextRenewalTarget: "route-conductor-boot",
    dragInspectionBound: false,
    imageRendered: false,
    coherentExpressionPass: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
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

  function isObject(value) {
    return Boolean(value && typeof value === "object");
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
    for (const name of names || []) {
      if (root[name]) return root[name];
    }
    return null;
  }

  function publishDataset() {
    if (!documentRef || !documentRef.documentElement) return;

    const dataset = documentRef.documentElement.dataset;

    dataset.hearthRouteConductorLoaded = "true";
    dataset.hearthRouteConductorContract = CONTRACT;
    dataset.hearthRouteConductorReceipt = RECEIPT;
    dataset.hearthRouteConductorPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthActiveRouteFile = ACTIVE_ROUTE_FILE;
    dataset.hearthActiveRouteContract = CONTRACT;
    dataset.hearthClimateRouteRetired = "true";
    dataset.hearthRetiredRouteFile = RETIRED_ROUTE_FILE;
    dataset.hearthVisibleCarrierFirst = "true";
    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthRuntimeTablePresent = String(state.runtimeTablePresent);
    dataset.hearthRuntimeTableMode = state.runtimeTableMode;
    dataset.hearthRuntimeTableRequiredForFirstRender = "false";
    dataset.hearthSourceStackRequiredForFirstRender = "false";
    dataset.hearthWideProbeDeferred = "true";
    dataset.hearthRouteShellLoaded = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishStatus(status) {
    state.updatedAt = nowIso();
    publishDataset();

    const receipt = getReceipt({ status });
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_RECEIPT = receipt;
    root.HEARTH_ACTIVE_ROUTE_RECEIPT = receipt;
    root.__HEARTH_ACTIVE_ROUTE_FILE__ = ACTIVE_ROUTE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;

    const node = documentRef
      ? documentRef.getElementById(STATUS_ID) || documentRef.querySelector("[data-hearth-route-status]")
      : null;

    if (node) {
      node.textContent = [
        "Hearth route conductor active.",
        `Route conductor ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Active file ${ACTIVE_ROUTE_FILE}`,
        `Retired climate route ${RETIRED_ROUTE_FILE}`,
        `Mount ready ${state.mountReady}`,
        `Loading screen ready ${state.loadingScreenReady}`,
        `Canvas carrier requested ${state.canvasCarrierRequested}`,
        `Canvas carrier mounted ${state.canvasCarrierMounted}`,
        `Runtime Table present ${state.runtimeTablePresent}`,
        `Runtime Table mode ${state.runtimeTableMode}`,
        "Runtime Table required for first render false",
        "Source stack required for first render false",
        "Visible carrier first true",
        "Wide probe deferred true",
        `Drag inspection bound ${state.dragInspectionBound}`,
        `Image rendered ${state.imageRendered}`,
        `Coherent expression pass ${state.coherentExpressionPass}`,
        "Visual pass claimed false",
        "Generated image false",
        "GraphicBox false",
        "WebGL false",
        `First failed coordinate ${state.firstFailedCoordinate}`,
        `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
        state.error ? `Error ${state.error}` : "",
        `Status ${status}`
      ].filter(Boolean).join("\n");
    }
  }

  function ensureMount() {
    if (!documentRef) return null;

    let mount =
      documentRef.getElementById(MOUNT_ID) ||
      documentRef.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = documentRef.createElement("section");
      mount.id = MOUNT_ID;
      mount.dataset.hearthCanvasMount = "true";

      const parent = documentRef.getElementById("hearth-main") || documentRef.body || documentRef.documentElement;
      parent.appendChild(mount);
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthRouteConductor = CONTRACT;
    mount.dataset.hearthActiveRouteFile = ACTIVE_ROUTE_FILE;
    mount.dataset.hearthClimateRouteRetired = "true";
    mount.dataset.hearthVisibleCarrierFirst = "true";
    mount.dataset.runtimeTableRequiredForFirstRender = "false";
    mount.dataset.sourceStackRequiredForFirstRender = "false";
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
    if (!documentRef || !mount) return null;

    mount.querySelectorAll("[data-hearth-mount-fallback]").forEach((node) => {
      node.hidden = true;
      node.style.display = "none";
    });

    let overlay = mount.querySelector("[data-hearth-route-loading-screen]");

    if (!overlay) {
      overlay = documentRef.createElement("div");
      overlay.dataset.hearthRouteLoadingScreen = "true";
      overlay.setAttribute("aria-live", "polite");
      overlay.textContent = "Hearth visible carrier loading.";
      overlay.style.position = "absolute";
      overlay.style.inset = "0";
      overlay.style.zIndex = "8";
      overlay.style.display = "grid";
      overlay.style.placeItems = "center";
      overlay.style.padding = "20px";
      overlay.style.textAlign = "center";
      overlay.style.pointerEvents = "none";
      overlay.style.color = "rgba(238,246,255,.82)";
      overlay.style.font = "900 clamp(1rem,4.4vw,1.45rem)/1.15 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
      overlay.style.letterSpacing = "-.035em";
      overlay.style.background = [
        "radial-gradient(circle at 50% 50%, rgba(9, 42, 67, .72), rgba(2, 8, 18, .46) 58%, rgba(2, 8, 18, .78))",
        "linear-gradient(180deg, rgba(3,9,20,.24), rgba(3,9,20,.72))"
      ].join(",");
      mount.appendChild(overlay);
    }

    state.loadingScreenReady = true;
    return overlay;
  }

  function retireClimateRouteRuntime() {
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;
    root.__HEARTH_RETIRED_ROUTE_FILE__ = RETIRED_ROUTE_FILE;

    [
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__",
      "__HEARTH_VISIBLE_RECOVERY_DISPOSE__"
    ].forEach((name) => {
      if (typeof root[name] === "function") {
        safeCall(() => root[name](), null);
      }

      try {
        root[name] = undefined;
        delete root[name];
      } catch (_error) {}
    });

    if (documentRef) {
      documentRef.querySelectorAll("script[src*='hearth.climate.route.js']").forEach((script) => {
        script.dataset.hearthClimateRouteRetired = "true";
        script.dataset.hearthRetiredBy = CONTRACT;
      });
    }
  }

  function existingScriptFor(src) {
    if (!documentRef) return null;
    const clean = src.split("?")[0];
    return Array.from(documentRef.scripts || []).find((script) => {
      const actual = script.getAttribute("src") || "";
      return actual.includes(clean);
    }) || null;
  }

  function loadScript(item) {
    const existingGlobal = getGlobal(item.globalNames);
    if (existingGlobal) {
      state.scriptStatus[item.key] = {
        key: item.key,
        src: item.src,
        role: item.role,
        status: "GLOBAL_PRESENT",
        requiredForFirstRender: item.requiredForFirstRender === true,
        loaded: true,
        globalPresent: true,
        error: ""
      };
      return Promise.resolve(state.scriptStatus[item.key]);
    }

    if (!documentRef || !documentRef.head) {
      state.scriptStatus[item.key] = {
        key: item.key,
        src: item.src,
        role: item.role,
        status: item.requiredForFirstRender ? "DOCUMENT_UNAVAILABLE_REQUIRED" : "DOCUMENT_UNAVAILABLE_DEGRADED",
        requiredForFirstRender: item.requiredForFirstRender === true,
        loaded: false,
        globalPresent: false,
        error: "document.head unavailable"
      };
      return Promise.resolve(state.scriptStatus[item.key]);
    }

    const existing = existingScriptFor(item.src);

    if (existing && getGlobal(item.globalNames)) {
      state.scriptStatus[item.key] = {
        key: item.key,
        src: item.src,
        role: item.role,
        status: "SCRIPT_ALREADY_PRESENT_GLOBAL_READY",
        requiredForFirstRender: item.requiredForFirstRender === true,
        loaded: true,
        globalPresent: true,
        error: ""
      };
      return Promise.resolve(state.scriptStatus[item.key]);
    }

    return new Promise((resolve) => {
      const script = documentRef.createElement("script");
      script.src = `${item.src}?v=${encodeURIComponent(cacheKey())}`;
      script.defer = true;
      script.dataset.hearthFile = "true";
      script.dataset.hearthRouteConductor = CONTRACT;
      script.dataset.hearthScriptKey = item.key;
      script.dataset.hearthScriptRole = item.role;
      script.dataset.requiredForFirstRender = String(item.requiredForFirstRender === true);
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      const finish = (status, error = "") => {
        if (settled) return;
        settled = true;

        const globalPresent = Boolean(getGlobal(item.globalNames));
        const record = {
          key: item.key,
          src: item.src,
          role: item.role,
          status,
          requiredForFirstRender: item.requiredForFirstRender === true,
          loaded: status === "LOADED" || globalPresent,
          globalPresent,
          error
        };

        state.scriptStatus[item.key] = record;

        if (error) {
          state.scriptErrors.push({
            key: item.key,
            src: item.src,
            role: item.role,
            error,
            requiredForFirstRender: item.requiredForFirstRender === true,
            at: nowIso()
          });
        }

        resolve(record);
      };

      script.onload = () => finish("LOADED");
      script.onerror = () => finish(item.requiredForFirstRender ? "LOAD_FAILED_REQUIRED" : "LOAD_FAILED_DEGRADED", "script load error");

      documentRef.head.appendChild(script);

      window.setTimeout(() => {
        if (!settled) {
          const globalPresent = Boolean(getGlobal(item.globalNames));
          finish(
            globalPresent ? "TIMEOUT_GLOBAL_PRESENT" : item.requiredForFirstRender ? "LOAD_TIMEOUT_REQUIRED" : "LOAD_TIMEOUT_DEGRADED",
            globalPresent ? "" : "script load timeout"
          );
        }
      }, item.requiredForFirstRender ? 3500 : 2400);
    });
  }

  function inspectSources() {
    const sources = {
      runtimeTable: Boolean(getGlobal(["LAB_RUNTIME_TABLE", "DexterRuntimeTable", "RUNTIME_TABLE"])),
      tectonics: Boolean(getGlobal(["HEARTH_TECTONICS", "HearthTectonics"])),
      elevation: Boolean(getGlobal(["HEARTH_ELEVATION", "HearthElevation"])),
      composition: Boolean(getGlobal(["HEARTH_COMPOSITION", "HearthComposition"])),
      hydrology: Boolean(getGlobal(["HEARTH_HYDROLOGY", "HearthHydrology"])),
      materials: Boolean(getGlobal(["HEARTH_MATERIALS", "HearthMaterials"])),
      canvas: Boolean(getGlobal(["HEARTH_CANVAS", "HearthCanvas"]))
    };

    state.sourceStatus = sources;
    state.runtimeTablePresent = sources.runtimeTable;
    return sources;
  }

  function createRuntimePlanIfAvailable() {
    const runtimeTable = getGlobal(["LAB_RUNTIME_TABLE", "DexterRuntimeTable", "RUNTIME_TABLE"]);

    state.runtimeTablePresent = Boolean(runtimeTable);

    if (!runtimeTable) {
      state.runtimeTableMode = "MISSING_DEGRADED_DIAGNOSTIC_MODE";
      state.runtimePlan = null;
      return null;
    }

    try {
      if (typeof runtimeTable.createHearthVisualCarrierPlan === "function") {
        state.runtimePlan = runtimeTable.createHearthVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          routeMounted: true,
          canvasMounted: state.canvasCarrierMounted,
          fallbackShellAvailable: true,
          imageRendered: state.imageRendered,
          renderMetadata: {
            routeMounted: true,
            canvasMounted: state.canvasCarrierMounted,
            fallbackShellAvailable: true,
            visibleCarrierAllowed: true,
            visualCarrierAllowed: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true,
            wideProbeDeferred: true
          },
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          probeSamples: []
        });
        state.runtimeTableMode = "PLAN_CONSUMED_NON_BLOCKING";
        return state.runtimePlan;
      }

      if (typeof runtimeTable.createVisualCarrierPlan === "function") {
        state.runtimePlan = runtimeTable.createVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          routeMounted: true,
          canvasMounted: state.canvasCarrierMounted,
          fallbackShellAvailable: true,
          imageRendered: state.imageRendered,
          renderMetadata: {
            routeMounted: true,
            canvasMounted: state.canvasCarrierMounted,
            fallbackShellAvailable: true,
            visibleCarrierAllowed: true,
            visualCarrierAllowed: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true,
            wideProbeDeferred: true
          },
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          probeSamples: []
        });
        state.runtimeTableMode = "PLAN_CONSUMED_NON_BLOCKING";
        return state.runtimePlan;
      }

      state.runtimeTableMode = "PRESENT_NO_PLAN_API_DEGRADED";
      state.runtimePlan = null;
      return null;
    } catch (error) {
      state.runtimeTableMode = "PLAN_ERROR_DEGRADED";
      state.error = error && error.message ? error.message : String(error);
      state.runtimePlan = null;
      return null;
    }
  }

  function mountCanvasCarrier(mount) {
    const canvasApi = getGlobal(["HEARTH_CANVAS", "HearthCanvas"]);

    state.canvasCarrierRequested = true;

    if (!canvasApi) {
      state.canvasCarrierMounted = false;
      state.firstFailedCoordinate = "CANVAS_GLOBAL_MISSING";
      state.recommendedNextRenewalTarget = "/assets/hearth/hearth.canvas.js";
      publishStatus("CANVAS_GLOBAL_MISSING");
      return false;
    }

    const bootMethod =
      typeof canvasApi.boot === "function" ? "boot" :
        typeof canvasApi.mount === "function" ? "mount" :
          typeof canvasApi.start === "function" ? "start" :
            typeof canvasApi.init === "function" ? "init" :
              typeof canvasApi.mountVisibleCarrier === "function" ? "mountVisibleCarrier" :
                typeof canvasApi.bootVisibleCarrier === "function" ? "bootVisibleCarrier" :
                  "";

    if (!bootMethod) {
      state.canvasCarrierMounted = false;
      state.firstFailedCoordinate = "CANVAS_BOOT_METHOD_MISSING";
      state.recommendedNextRenewalTarget = "/assets/hearth/hearth.canvas.js";
      publishStatus("CANVAS_BOOT_METHOD_MISSING");
      return false;
    }

    const result = safeCall(() => canvasApi[bootMethod]({
      mount,
      routeConductorContract: CONTRACT,
      routeConductorReceipt: RECEIPT,
      activeRouteFile: ACTIVE_ROUTE_FILE,
      retiredClimateRoute: true,
      visibleCarrierFirst: true,
      runtimeTablePlan: state.runtimePlan,
      wideProbeDeferred: true,
      sourceAuthorityHeld: true
    }), null);

    state.canvasCarrierMounted = Boolean(
      result &&
      (
        result.canvasCarrierMounted === true ||
        result.postgameStatus === "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING" ||
        result.postgameStatus === "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_DEGRADED" ||
        result.status === "BOOTED_VISIBLE_CARRIER_FIRST" ||
        result.status === "ALREADY_BOOTED"
      )
    );

    if (!state.canvasCarrierMounted && canvasApi.state && canvasApi.state.mounted) {
      state.canvasCarrierMounted = true;
    }

    state.dragInspectionBound = Boolean(
      canvasApi.state && canvasApi.state.dragInspectionBound
    );

    state.imageRendered = Boolean(
      canvasApi.state && canvasApi.state.firstFramePainted
    );

    if (state.canvasCarrierMounted) {
      state.firstFailedCoordinate = "POST_FRAME_DIAGNOSTIC_PENDING";
      state.recommendedNextRenewalTarget = "post-frame-diagnostic-receipt";
      publishStatus("VISIBLE_CARRIER_REQUESTED");
      return true;
    }

    state.firstFailedCoordinate = "CANVAS_BOOT_RETURNED_UNMOUNTED";
    state.recommendedNextRenewalTarget = "/assets/hearth/hearth.canvas.js";
    publishStatus("CANVAS_BOOT_RETURNED_UNMOUNTED");
    return false;
  }

  function watchCanvasReceipt() {
    let checks = 0;

    const timer = root.setInterval(() => {
      checks += 1;

      const canvasApi = getGlobal(["HEARTH_CANVAS", "HearthCanvas"]);
      const receipt =
        canvasApi && typeof canvasApi.getReceipt === "function"
          ? safeCall(() => canvasApi.getReceipt(), null)
          : root.HEARTH_CANVAS_POSTGAME_RECEIPT || root.HEARTH_CANVAS_RECEIPT || null;

      if (receipt) {
        state.canvasCarrierMounted = receipt.canvasCarrierMounted === true || state.canvasCarrierMounted;
        state.dragInspectionBound = receipt.dragInspectionBound === true || state.dragInspectionBound;
        state.imageRendered = receipt.imageRendered === true || state.imageRendered;
        state.runtimeTablePresent = receipt.runtimeTablePresent === true || state.runtimeTablePresent;
        if (receipt.runtimeTableMode) state.runtimeTableMode = receipt.runtimeTableMode;

        if (state.imageRendered) {
          state.firstFailedCoordinate = "POST_FRAME_DIAGNOSTIC_PENDING";
          state.recommendedNextRenewalTarget = "post-frame-diagnostic-receipt";
        }

        publishStatus(state.imageRendered ? "VISIBLE_CARRIER_RENDERING" : "VISIBLE_CARRIER_MOUNTED_PENDING_FRAME");
      }

      if (checks >= 40 || state.imageRendered) {
        root.clearInterval(timer);
      }
    }, 250);
  }

  async function boot() {
    if (!documentRef) return getReceipt({ status: "NO_DOCUMENT" });
    if (state.bootStarted) return getReceipt({ status: "BOOT_ALREADY_STARTED" });

    state.bootStarted = true;
    state.updatedAt = nowIso();
    state.firstFailedCoordinate = "BOOT_STARTED";
    state.recommendedNextRenewalTarget = "route-conductor-sequence";

    retireClimateRouteRuntime();

    const mount = ensureMount();
    ensureLoadingScreen(mount);

    publishStatus("LOADING_SCREEN_READY");

    const canvasItem = SCRIPT_PLAN.find((item) => item.key === "canvas");
    const optionalItems = SCRIPT_PLAN.filter((item) => item.key !== "canvas");

    for (const item of optionalItems) {
      await loadScript(item);
      inspectSources();
      publishStatus(`OPTIONAL_${item.key.toUpperCase()}_CHECKED`);
    }

    createRuntimePlanIfAvailable();

    await loadScript(canvasItem);
    inspectSources();
    createRuntimePlanIfAvailable();

    const mounted = mountCanvasCarrier(mount);

    if (!mounted) {
      state.bootComplete = false;
      state.firstFailedCoordinate = "VISIBLE_CARRIER_BOOT_FAILED";
      state.recommendedNextRenewalTarget = "/assets/hearth/hearth.canvas.js";
      publishStatus("VISIBLE_CARRIER_BOOT_FAILED");
      return getReceipt({ status: "VISIBLE_CARRIER_BOOT_FAILED" });
    }

    state.bootComplete = true;
    state.firstFailedCoordinate = "POST_FRAME_DIAGNOSTIC_PENDING";
    state.recommendedNextRenewalTarget = "post-frame-diagnostic-receipt";
    publishStatus("VISIBLE_CARRIER_ACTIVE");
    watchCanvasReceipt();

    return getReceipt({ status: "VISIBLE_CARRIER_ACTIVE" });
  }

  function getReceipt(extra = {}) {
    const allowedStatus = state.canvasCarrierMounted
      ? state.runtimeTablePresent
        ? "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_DEGRADED"
        : "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING"
      : state.mountReady
        ? "VISIBLE_CARRIER_ACTIVE_SOURCE_DEGRADED"
        : "BLOCKED_CARRIER_STRUCTURAL_FAILURE";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-route-conductor",
      destinationFile: "/showroom/globe/hearth/hearth.js",
      route: ROUTE,
      status: extra.status || allowedStatus,

      routeShellLoaded: true,
      activeRouteConductor: "hearth.js",
      activeRouteFile: ACTIVE_ROUTE_FILE,
      retiredClimateRoute: true,
      retiredClimateRouteFile: RETIRED_ROUTE_FILE,
      climateRouteActive: false,

      mountReady: state.mountReady,
      loadingScreenReady: state.loadingScreenReady,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,

      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTableMissingDoesNotBlockCarrier: true,
      runtimeTableRequiredForFirstRender: false,

      sourceAuthorityHeld: true,
      sourceStackRequiredForFirstRender: false,
      sourceStatus: { ...state.sourceStatus },
      scriptStatus: { ...state.scriptStatus },
      scriptErrors: state.scriptErrors.slice(),

      visibleCarrierFirst: true,
      wideProbeDeferred: true,
      dragInspectionBound: state.dragInspectionBound,
      receiptOverlayIndependent: true,

      imageRendered: state.imageRendered,
      coherentExpressionPass: false,
      visualPassClaimed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      postgameStatusAllowed: [
        "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY",
        "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_DEGRADED",
        "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING",
        "VISIBLE_CARRIER_ACTIVE_SOURCE_DEGRADED",
        "BLOCKED_CARRIER_STRUCTURAL_FAILURE"
      ],
      postgameStatusForbidden: [
        "BLANK_PENDING_RUNTIME_TABLE",
        "BLANK_PENDING_WIDE_PROBE",
        "CLIMATE_ROUTE_ACTIVE",
        "RECEIPT_REMOVAL_DISABLED_INSPECTION",
        "VISUAL_PASS_CLAIMED"
      ],

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
      error: state.error,
      updatedAt: state.updatedAt || nowIso(),
      ...extra
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    boot,
    start: boot,
    init: boot,
    run: boot,
    getReceipt,

    activeRouteFile: ACTIVE_ROUTE_FILE,
    retiredRouteFile: RETIRED_ROUTE_FILE,

    supportsCarrierFirstRecovery: true,
    supportsLoadingScreenRestore: true,
    supportsCanvasCarrierDelegation: true,
    supportsRuntimeTableOptionalConsumption: true,
    supportsSourceAuthorityHeld: true,
    supportsClimateRouteRetirement: true,

    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,
    visibleCarrierFirst: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.routeConductor = api;

  root.HEARTH_ROUTE_CONDUCTOR = api;
  root.HearthRouteConductor = api;
  root.HEARTH_ACTIVE_ROUTE = api;
  root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;
  root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = getReceipt({ status: "LOADED_NOT_BOOTED" });
  root.__HEARTH_ACTIVE_ROUTE_FILE__ = ACTIVE_ROUTE_FILE;
  root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
  root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;

  publishDataset();

  if (documentRef) {
    if (documentRef.readyState === "loading") {
      documentRef.addEventListener("DOMContentLoaded", () => {
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
