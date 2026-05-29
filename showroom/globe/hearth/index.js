// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_RUNTIME_TABLE_VISIBLE_CARRIER_TNT_v1
// Full-file replacement.
// Purpose:
// - Make hearth.js the active Hearth route conductor.
// - Retire hearth.climate.route.js from active route-carrier duty.
// - Mount a visible carrier area immediately.
// - Load Runtime Table, source authorities, channel authorities, hex authorities, and canvas in chronological order.
// - Treat Runtime Table as diagnostic/procedural-plan equipment only.
// - Never blank the visible carrier because Runtime Table, child channels, or wide-probe diagnostics are missing/degraded.
// - Hand visible drawing to /assets/hearth/hearth.canvas.js.
// Does not own:
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology classification
// - material palette
// - land truth
// - water truth
// - air truth
// - canvas drawing
// - atlas pixel painting
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_RUNTIME_TABLE_VISIBLE_CARRIER_TNT_v1";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_RUNTIME_TABLE_VISIBLE_CARRIER_RECEIPT_v1";
  const PREVIOUS_ROUTE_CONTRACT = "HEARTH_SOURCE_ALIGNED_VISIBLE_GLOBE_ROUTE_TNT_v17";
  const RETIRED_CLIMATE_ROUTE_CONTRACT = "HEARTH_CLIMATE_ROUTE_RETIRED_ACTIVE_CARRIER_TOMBSTONE_TNT_v1";
  const VERSION = "2026-05-29.hearth-route-conductor-runtime-table-visible-carrier-v1";

  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const RETIRED_CLIMATE_ROUTE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";

  const SOURCE_STACK = Object.freeze([
    {
      key: "runtime-table",
      src: RUNTIME_TABLE_FILE,
      globalNames: ["LAB_RUNTIME_TABLE", "RUNTIME_TABLE", "DexterRuntimeTable"],
      required: false,
      stage: "00-runtime-table"
    },
    {
      key: "tectonics",
      src: "/assets/hearth/hearth.tectonics.js",
      globalNames: ["HEARTH_TECTONICS", "HearthTectonics"],
      required: false,
      stage: "01-source-tectonics"
    },
    {
      key: "elevation",
      src: "/assets/hearth/hearth.elevation.js",
      globalNames: ["HEARTH_ELEVATION", "HearthElevation"],
      required: false,
      stage: "02-source-elevation"
    },
    {
      key: "composition",
      src: "/assets/hearth/hearth.composition.js",
      globalNames: ["HEARTH_COMPOSITION", "HearthComposition"],
      required: false,
      stage: "03-source-composition"
    },
    {
      key: "hydrology",
      src: "/assets/hearth/hearth.hydrology.js",
      globalNames: ["HEARTH_HYDROLOGY", "HearthHydrology"],
      required: false,
      stage: "04-source-hydrology"
    },
    {
      key: "materials",
      src: "/assets/hearth/hearth.materials.js",
      globalNames: ["HEARTH_MATERIALS", "HearthMaterials"],
      required: false,
      stage: "05-source-materials"
    },
    {
      key: "land-channel",
      src: "/assets/hearth/hearth.land.channel.js",
      globalNames: ["HEARTH_LAND_CHANNEL"],
      required: false,
      stage: "06-channel-land"
    },
    {
      key: "water-channel",
      src: "/assets/hearth/hearth.water.channel.js",
      globalNames: ["HEARTH_WATER_CHANNEL"],
      required: false,
      stage: "07-channel-water"
    },
    {
      key: "air-channel",
      src: "/assets/hearth/hearth.air.channel.js",
      globalNames: ["HEARTH_AIR_CHANNEL"],
      required: false,
      stage: "08-channel-air"
    },
    {
      key: "hex-four-pair-authority",
      src: "/assets/hearth/hearth.hex.four-pair.authority.js",
      globalNames: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "HEARTH_HEX_HANDSHAKE_AUTHORITY"
      ],
      required: false,
      stage: "09-hex-four-pair-authority"
    },
    {
      key: "hex-surface",
      src: "/assets/hearth/hearth.hex.surface.js",
      globalNames: ["HEARTH_HEX_SURFACE"],
      required: false,
      stage: "10-hex-surface-consumer"
    },
    {
      key: "canvas",
      src: CANVAS_FILE,
      globalNames: ["HEARTH_CANVAS", "HearthCanvas"],
      required: false,
      stage: "11-visible-canvas-carrier"
    }
  ]);

  const EXPECTED_CONTRACTS = Object.freeze({
    route: CONTRACT,
    climateRouteRetirement: RETIRED_CLIMATE_ROUTE_CONTRACT,
    runtimeTable: "LAB_UNIVERSAL_PLANET_WIDE_PROBE_DIAGNOSTIC_LOADING_STANDARD_TNT_v1",
    tectonics: "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2",
    elevation: "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2",
    composition: "HEARTH_TECTONICS_SEATED_COMPOSITION_COORDINATION_TNT_v2",
    hydrology: "HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_TNT_v1",
    materials: "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1",
    land: "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1",
    water: "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
    air: "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1",
    hexFourPair: "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1",
    hexSurface: "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1",
    canvas: "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1"
  });

  const DEFAULT_SAMPLE_POINT = Object.freeze({
    u: 0.5,
    v: 0.5,
    lon: 0,
    lat: 0,
    x: 0,
    y: 0,
    z: 1
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousRouteContract: PREVIOUS_ROUTE_CONTRACT,
    version: VERSION,

    routeFile: ROUTE_FILE,
    retiredClimateRouteFile: RETIRED_CLIMATE_ROUTE_FILE,
    canvasFile: CANVAS_FILE,
    runtimeTableFile: RUNTIME_TABLE_FILE,

    booted: false,
    booting: false,
    mounted: false,
    mountFound: false,
    mountCreated: false,
    fallbackShellMounted: false,
    canvasCarrierRequested: false,
    canvasCarrierLoaded: false,
    canvasCarrierBound: false,
    canvasCarrierFailed: false,

    runtimeTableRequested: false,
    runtimeTableLoaded: false,
    runtimeTablePlanCreated: false,
    runtimeTablePlanFailed: false,
    runtimeTableMissingDoesNotBlockCarrier: true,

    visibleCarrierFirst: true,
    wideProbeDeferred: true,
    singleAnchorIsLocalProofOnly: true,
    childFailureDoesNotEraseVisualization: true,
    visualizationBlocksOnlyWhenCarrierUnsafe: true,

    activeRouteClaimed: true,
    climateRouteActiveCarrier: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    mount: null,
    fallbackShell: null,
    lastPlan: null,
    lastCanvasReceipt: null,
    lastError: "",
    loaded: {},
    failed: {},
    ledger: []
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function log(event, detail = {}) {
    const entry = Object.freeze({
      event,
      detail: clone(detail),
      at: nowIso()
    });

    state.ledger.push(entry);
    publishDataset(event);
    return entry;
  }

  function readGlobal(names) {
    const list = Array.isArray(names) ? names : [names];

    for (const name of list) {
      if (name && root[name]) return root[name];
    }

    return null;
  }

  function contractOf(value) {
    if (!value || typeof value !== "object") return "";

    return String(
      value.contract ||
      value.CONTRACT ||
      value.runtimeTableContract ||
      value.canvasContract ||
      value.routeContract ||
      ""
    );
  }

  function receiptOf(value) {
    if (!value || typeof value !== "object") return null;

    if (isFunction(value.getReceipt)) {
      try {
        const receipt = value.getReceipt();
        if (receipt && typeof receipt === "object") return receipt;
      } catch (_error) {}
    }

    if (value.receiptPacket && typeof value.receiptPacket === "object") return value.receiptPacket;
    if (value.receipt && typeof value.receipt === "object") return value.receipt;

    return null;
  }

  function scriptKeyFor(src) {
    return String(src || "")
      .replace(/[^\w.-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96);
  }

  function cacheBustedSrc(src) {
    const clean = String(src || "");
    if (!clean) return "";
    const joiner = clean.includes("?") ? "&" : "?";
    return `${clean}${joiner}routeContract=${encodeURIComponent(CONTRACT)}&v=${encodeURIComponent(VERSION)}`;
  }

  function findExistingScript(src, key) {
    if (!doc) return null;

    const scripts = Array.from(doc.querySelectorAll("script[src]"));
    const clean = String(src || "");

    return scripts.find((script) => {
      const attr = script.getAttribute("src") || "";
      return (
        script.dataset.hearthRouteLoaderKey === key ||
        attr === clean ||
        attr.startsWith(`${clean}?`) ||
        attr.includes(clean)
      );
    }) || null;
  }

  function globalReady(dependency) {
    if (!dependency || !dependency.globalNames) return false;
    return Boolean(readGlobal(dependency.globalNames));
  }

  function loadScriptOnce(dependency) {
    return new Promise((resolve) => {
      if (!doc || !doc.createElement) {
        resolve({
          key: dependency.key,
          src: dependency.src,
          loaded: false,
          skipped: true,
          error: "DOCUMENT_UNAVAILABLE"
        });
        return;
      }

      const key = scriptKeyFor(dependency.src || dependency.key);

      if (globalReady(dependency)) {
        state.loaded[dependency.key] = true;

        resolve({
          key: dependency.key,
          src: dependency.src,
          loaded: true,
          existingGlobal: true,
          contract: contractOf(readGlobal(dependency.globalNames))
        });
        return;
      }

      const existing = findExistingScript(dependency.src, key);

      if (existing && existing.dataset.hearthRouteLoaderLoaded === "true") {
        state.loaded[dependency.key] = true;

        resolve({
          key: dependency.key,
          src: dependency.src,
          loaded: true,
          existingScript: true,
          contract: contractOf(readGlobal(dependency.globalNames))
        });
        return;
      }

      if (existing && existing.dataset.hearthRouteLoaderPending === "true") {
        const startedAt = Date.now();

        const poll = () => {
          if (globalReady(dependency)) {
            state.loaded[dependency.key] = true;
            existing.dataset.hearthRouteLoaderLoaded = "true";
            existing.dataset.hearthRouteLoaderPending = "false";

            resolve({
              key: dependency.key,
              src: dependency.src,
              loaded: true,
              existingScript: true,
              contract: contractOf(readGlobal(dependency.globalNames))
            });
            return;
          }

          if (Date.now() - startedAt > 2500) {
            resolve({
              key: dependency.key,
              src: dependency.src,
              loaded: false,
              existingScript: true,
              timeout: true,
              optional: dependency.required !== true
            });
            return;
          }

          root.setTimeout(poll, 80);
        };

        poll();
        return;
      }

      const script = existing || doc.createElement("script");

      script.dataset.hearthRouteLoaderKey = key;
      script.dataset.hearthRouteLoaderStage = dependency.stage || "";
      script.dataset.hearthRouteLoaderSource = dependency.src;
      script.dataset.hearthRouteLoaderContract = CONTRACT;
      script.dataset.hearthRouteLoaderPending = "true";
      script.dataset.hearthRouteLoaderLoaded = "false";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      script.async = false;
      script.defer = false;

      let settled = false;

      const finish = (payload) => {
        if (settled) return;
        settled = true;

        script.dataset.hearthRouteLoaderPending = "false";
        script.dataset.hearthRouteLoaderLoaded = String(Boolean(payload.loaded));
        script.dataset.hearthRouteLoaderFailed = String(!payload.loaded);

        if (payload.loaded) state.loaded[dependency.key] = true;
        else state.failed[dependency.key] = payload.error || "LOAD_FAILED";

        resolve(payload);
      };

      script.onload = () => {
        root.setTimeout(() => {
          const authority = readGlobal(dependency.globalNames);
          finish({
            key: dependency.key,
            src: dependency.src,
            loaded: true,
            scriptLoaded: true,
            globalPresent: Boolean(authority),
            contract: contractOf(authority),
            receipt: receiptOf(authority)
          });
        }, 0);
      };

      script.onerror = () => {
        finish({
          key: dependency.key,
          src: dependency.src,
          loaded: false,
          error: "SCRIPT_LOAD_ERROR",
          optional: dependency.required !== true
        });
      };

      script.src = cacheBustedSrc(dependency.src);

      const target = doc.head || doc.documentElement || doc.body;

      if (!existing && target) {
        target.appendChild(script);
      } else if (existing) {
        finish({
          key: dependency.key,
          src: dependency.src,
          loaded: false,
          error: "SCRIPT_EXISTS_BUT_GLOBAL_NOT_READY",
          optional: dependency.required !== true
        });
      } else {
        finish({
          key: dependency.key,
          src: dependency.src,
          loaded: false,
          error: "SCRIPT_APPEND_TARGET_MISSING",
          optional: dependency.required !== true
        });
      }
    });
  }

  async function loadDependency(dependency) {
    log("LOAD_DEPENDENCY_START", {
      key: dependency.key,
      stage: dependency.stage,
      src: dependency.src,
      required: dependency.required === true
    });

    const result = await loadScriptOnce(dependency);

    log(result.loaded ? "LOAD_DEPENDENCY_PASS" : "LOAD_DEPENDENCY_DEGRADED", {
      key: dependency.key,
      stage: dependency.stage,
      src: dependency.src,
      loaded: result.loaded,
      globalPresent: result.globalPresent,
      contract: result.contract || "",
      error: result.error || "",
      optional: dependency.required !== true
    });

    return result;
  }

  function mountNode() {
    if (!doc) return null;

    let node =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount]") ||
      doc.querySelector("[data-hearth-carrier-mount]");

    if (!node) {
      node = doc.createElement("section");
      node.id = "hearthCanvasMount";
      node.setAttribute("aria-label", "Hearth visual carrier");

      const parent =
        doc.getElementById("hearth-main") ||
        doc.querySelector("main") ||
        doc.body ||
        doc.documentElement;

      parent.appendChild(node);
      state.mountCreated = true;
    }

    node.id = "hearthCanvasMount";
    node.dataset.hearthCanvasMount = "true";
    node.dataset.hearthCarrierMount = "true";
    node.dataset.hearthRouteConductorContract = CONTRACT;
    node.dataset.hearthRouteConductorReceipt = RECEIPT;
    node.dataset.hearthVisibleCarrierFirst = "true";
    node.dataset.hearthClimateRouteActiveCarrier = "false";
    node.dataset.hearthRuntimeTableDiagnosticOnly = "true";
    node.dataset.hearthRuntimeTableCannotBlankCarrier = "true";
    node.dataset.generatedImage = "false";
    node.dataset.graphicBox = "false";
    node.dataset.webgl = "false";
    node.dataset.visualPassClaimed = "false";

    if (!node.style.position) node.style.position = "relative";
    if (!node.style.minHeight) node.style.minHeight = "360px";
    node.style.touchAction = "none";
    node.style.userSelect = "none";
    node.style.overflow = "hidden";

    state.mount = node;
    state.mountFound = true;
    state.mounted = true;

    return node;
  }

  function mountFallbackShell(mount) {
    if (!doc || !mount) return null;

    let shell = mount.querySelector("[data-hearth-route-fallback-shell]");

    if (!shell) {
      shell = doc.createElement("div");
      shell.dataset.hearthRouteFallbackShell = "true";
      shell.dataset.hearthRouteConductorContract = CONTRACT;
      shell.dataset.hearthWaitingForCanvasCarrier = "true";
      shell.dataset.generatedImage = "false";
      shell.dataset.graphicBox = "false";
      shell.dataset.webgl = "false";
      shell.dataset.visualPassClaimed = "false";

      shell.setAttribute("aria-live", "polite");
      shell.textContent = "Hearth carrier loading.";

      shell.style.position = "absolute";
      shell.style.inset = "0";
      shell.style.display = "grid";
      shell.style.placeItems = "center";
      shell.style.minHeight = "320px";
      shell.style.pointerEvents = "none";
      shell.style.opacity = "0.72";
      shell.style.font = "12px/1.4 system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
      shell.style.letterSpacing = "0.08em";
      shell.style.textTransform = "uppercase";

      mount.appendChild(shell);
    }

    state.fallbackShell = shell;
    state.fallbackShellMounted = true;

    return shell;
  }

  function hideFallbackShell() {
    if (!state.fallbackShell) return;

    state.fallbackShell.hidden = true;
    state.fallbackShell.style.display = "none";
    state.fallbackShell.dataset.hearthCanvasCarrierTookOver = "true";
  }

  function publishDataset(status = "boot") {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthRouteConductorLoaded = "true";
    dataset.hearthRouteConductorContract = CONTRACT;
    dataset.hearthRouteConductorReceipt = RECEIPT;
    dataset.hearthRouteConductorVersion = VERSION;
    dataset.hearthRouteConductorPreviousRouteContract = PREVIOUS_ROUTE_CONTRACT;
    dataset.hearthActiveRouteFile = ROUTE_FILE;
    dataset.hearthActiveRouteConductorFile = ROUTE_FILE;
    dataset.hearthActiveRouteConductorContract = CONTRACT;
    dataset.hearthActiveRouteConductorReceipt = RECEIPT;

    dataset.hearthClimateRouteRetiredFile = RETIRED_CLIMATE_ROUTE_FILE;
    dataset.hearthClimateRouteRetiredExpectedContract = RETIRED_CLIMATE_ROUTE_CONTRACT;
    dataset.hearthClimateRouteActiveCarrier = "false";

    dataset.hearthCanvasCarrierFile = CANVAS_FILE;
    dataset.hearthRuntimeTableFile = RUNTIME_TABLE_FILE;
    dataset.hearthRuntimeTableDiagnosticOnly = "true";
    dataset.hearthRuntimeTableCannotBlankCarrier = "true";

    dataset.hearthVisibleCarrierFirst = "true";
    dataset.hearthWideProbeDeferred = "true";
    dataset.hearthSingleAnchorIsLocalProofOnly = "true";
    dataset.hearthChildFailureDoesNotEraseVisualization = "true";
    dataset.hearthVisualizationBlocksOnlyWhenCarrierUnsafe = "true";

    dataset.hearthRouteMounted = String(Boolean(state.mounted));
    dataset.hearthRouteMountFound = String(Boolean(state.mountFound));
    dataset.hearthRouteMountCreated = String(Boolean(state.mountCreated));
    dataset.hearthRouteFallbackShellMounted = String(Boolean(state.fallbackShellMounted));
    dataset.hearthCanvasCarrierRequested = String(Boolean(state.canvasCarrierRequested));
    dataset.hearthCanvasCarrierLoaded = String(Boolean(state.canvasCarrierLoaded));
    dataset.hearthCanvasCarrierBound = String(Boolean(state.canvasCarrierBound));
    dataset.hearthCanvasCarrierFailed = String(Boolean(state.canvasCarrierFailed));

    dataset.hearthRuntimeTableRequested = String(Boolean(state.runtimeTableRequested));
    dataset.hearthRuntimeTableLoaded = String(Boolean(state.runtimeTableLoaded));
    dataset.hearthRuntimeTablePlanCreated = String(Boolean(state.runtimeTablePlanCreated));
    dataset.hearthRuntimeTablePlanFailed = String(Boolean(state.runtimeTablePlanFailed));

    dataset.hearthRouteBootStatus = status;
    dataset.hearthRouteLastError = state.lastError || "";

    dataset.hearthTectonicsLoaded = String(Boolean(state.loaded.tectonics));
    dataset.hearthElevationLoaded = String(Boolean(state.loaded.elevation));
    dataset.hearthCompositionLoaded = String(Boolean(state.loaded.composition));
    dataset.hearthHydrologyLoaded = String(Boolean(state.loaded.hydrology));
    dataset.hearthMaterialsLoaded = String(Boolean(state.loaded.materials));
    dataset.hearthLandChannelLoaded = String(Boolean(state.loaded["land-channel"]));
    dataset.hearthWaterChannelLoaded = String(Boolean(state.loaded["water-channel"]));
    dataset.hearthAirChannelLoaded = String(Boolean(state.loaded["air-channel"]));
    dataset.hearthHexFourPairAuthorityLoadedByRoute = String(Boolean(state.loaded["hex-four-pair-authority"]));
    dataset.hearthHexSurfaceLoadedByRoute = String(Boolean(state.loaded["hex-surface"]));

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishStatusNode(status = "boot") {
    if (!doc) return;

    const node =
      doc.getElementById("hearth-route-status") ||
      doc.querySelector("[data-hearth-route-status]") ||
      doc.getElementById("hearth-status") ||
      doc.querySelector("[data-hearth-status]");

    if (!node) return;

    node.textContent = [
      "Hearth route conductor active.",
      `Status ${status}`,
      `Route conductor ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `Active route ${ROUTE_FILE}`,
      `Retired climate route ${RETIRED_CLIMATE_ROUTE_FILE}`,
      `Canvas carrier ${CANVAS_FILE}`,
      `Runtime Table ${RUNTIME_TABLE_FILE}`,
      `Mounted ${state.mounted}`,
      `Fallback shell ${state.fallbackShellMounted}`,
      `Canvas requested ${state.canvasCarrierRequested}`,
      `Canvas loaded ${state.canvasCarrierLoaded}`,
      `Canvas bound ${state.canvasCarrierBound}`,
      `Runtime Table loaded ${state.runtimeTableLoaded}`,
      `Runtime Table plan created ${state.runtimeTablePlanCreated}`,
      "Runtime Table can blank carrier false",
      "Visible carrier first true",
      "Wide-probe deferred true",
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      "Visual pass claimed false",
      state.lastError ? `Error ${state.lastError}` : ""
    ].filter(Boolean).join("\n");
  }

  function getRuntimeTableApi() {
    return (
      root.LAB_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (
        root.DEXTER_LAB &&
        root.DEXTER_LAB.runtimeTable
      ) ||
      null
    );
  }

  function createRouteFallbackPlan(reason = "RUNTIME_TABLE_UNAVAILABLE") {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      planContract: "HEARTH_ROUTE_CONDUCTOR_FALLBACK_VISIBLE_CARRIER_PLAN_v1",
      planReceipt: "HEARTH_ROUTE_CONDUCTOR_FALLBACK_VISIBLE_CARRIER_PLAN_RECEIPT_v1",
      version: VERSION,
      authority: "hearth-route-conductor",
      planetId: "hearth",
      planetLabel: "Hearth",
      planGenerated: true,
      planValid: true,
      constructionReady: true,
      runtimeAllowed: true,
      visualCarrierAllowed: true,
      visualizationBlocked: false,
      visualizationBlockReason: "",
      visualCarrierMode: "fallback-shell-until-canvas-api",
      atlasStartAuthorized: true,
      atlasStartMode: "canvas-carrier-when-loaded",
      runtimeTableAvailable: false,
      runtimeTableMissingDoesNotBlockCarrier: true,
      fallbackReason: reason,
      childFailureDoesNotEraseVisualization: true,
      wideProbeBlocksFirstVisibleRender: false,
      singleAnchorIsLocalProofOnly: true,
      coherentExpressionPass: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };
  }

  function createRuntimeTablePlan() {
    const api = getRuntimeTableApi();

    if (!api || typeof api !== "object") {
      state.runtimeTablePlanFailed = true;
      state.lastPlan = createRouteFallbackPlan("RUNTIME_TABLE_GLOBAL_MISSING");
      log("RUNTIME_TABLE_PLAN_FALLBACK", {
        reason: "RUNTIME_TABLE_GLOBAL_MISSING"
      });
      return state.lastPlan;
    }

    try {
      let plan = null;

      if (isFunction(api.createHearthVisualCarrierPlan)) {
        plan = api.createHearthVisualCarrierPlan({
          samplePoint: DEFAULT_SAMPLE_POINT,
          planetId: "hearth",
          planetLabel: "Hearth",
          routeMounted: true,
          canvasMounted: true,
          fallbackShellAvailable: true,
          renderMetadata: {
            routeMounted: true,
            canvasMounted: true,
            fallbackShellAvailable: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true,
            imageRendered: false,
            atlasReady: false,
            projectionReady: false
          }
        }, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth",
          runHearthTable: true
        });
      } else if (isFunction(api.createVisualCarrierPlan)) {
        plan = api.createVisualCarrierPlan({
          samplePoint: DEFAULT_SAMPLE_POINT,
          planetId: "hearth",
          planetLabel: "Hearth",
          routeMounted: true,
          canvasMounted: true,
          fallbackShellAvailable: true
        }, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth"
        });
      } else if (isFunction(api.runProceduralPlan)) {
        plan = api.runProceduralPlan({
          samplePoint: DEFAULT_SAMPLE_POINT,
          planetId: "hearth",
          planetLabel: "Hearth",
          routeMounted: true,
          canvasMounted: true,
          fallbackShellAvailable: true
        }, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth"
        });
      }

      if (!plan || typeof plan !== "object") {
        state.runtimeTablePlanFailed = true;
        state.lastPlan = createRouteFallbackPlan("RUNTIME_TABLE_PLAN_METHOD_RETURNED_EMPTY");
        log("RUNTIME_TABLE_PLAN_FALLBACK", {
          reason: "RUNTIME_TABLE_PLAN_METHOD_RETURNED_EMPTY"
        });
        return state.lastPlan;
      }

      plan.runtimeTableMissingDoesNotBlockCarrier = true;
      plan.visibleCarrierFirst = true;
      plan.wideProbeBlocksFirstVisibleRender = false;
      plan.visualPassClaimed = false;
      plan.generatedImage = false;
      plan.graphicBox = false;
      plan.webGL = false;

      state.runtimeTablePlanCreated = true;
      state.runtimeTablePlanFailed = false;
      state.lastPlan = plan;

      log("RUNTIME_TABLE_PLAN_CREATED", {
        planContract: plan.planContract || "",
        visualCarrierAllowed: plan.visualCarrierAllowed,
        atlasStartAuthorized: plan.atlasStartAuthorized,
        coherenceStatus: plan.coherenceStatus || "",
        coherenceScore: plan.coherenceScore || null,
        recommendedNextRenewalTarget: plan.recommendedNextRenewalTarget || ""
      });

      return plan;
    } catch (error) {
      state.runtimeTablePlanFailed = true;
      state.lastError = error && error.message ? error.message : String(error);
      state.lastPlan = createRouteFallbackPlan("RUNTIME_TABLE_PLAN_EXCEPTION");

      log("RUNTIME_TABLE_PLAN_ERROR", {
        error: state.lastError
      });

      return state.lastPlan;
    }
  }

  function getCanvasApi() {
    return (
      root.HEARTH_CANVAS ||
      root.HearthCanvas ||
      (
        root.HEARTH &&
        root.HEARTH.canvas
      ) ||
      (
        root.HEARTH &&
        root.HEARTH.canvasCarrier
      ) ||
      null
    );
  }

  function callCanvasMethod(api, methodName, payload) {
    if (!api || !isFunction(api[methodName])) return null;

    try {
      return api[methodName](payload);
    } catch (error) {
      return {
        __hearthCanvasCallError: true,
        method: methodName,
        message: error && error.message ? error.message : String(error)
      };
    }
  }

  function bindCanvasCarrier() {
    const api = getCanvasApi();

    if (!api || typeof api !== "object") {
      state.canvasCarrierFailed = true;
      state.lastError = "HEARTH_CANVAS_API_MISSING";
      log("CANVAS_BIND_DEGRADED", {
        reason: "HEARTH_CANVAS_API_MISSING"
      });
      publishStatusNode("canvas-api-missing-fallback-shell-held");
      return false;
    }

    const payload = {
      contract: CONTRACT,
      receipt: RECEIPT,
      routeFile: ROUTE_FILE,
      mount: state.mount,
      mountNode: state.mount,
      mountId: "hearthCanvasMount",
      runtimeTablePlan: state.lastPlan || createRuntimeTablePlan(),
      routeStatus: getStatus(),
      samplePoint: DEFAULT_SAMPLE_POINT,
      visibleCarrierFirst: true,
      runtimeTableMissingDoesNotBlockCarrier: true,
      childFailureDoesNotEraseVisualization: true,
      wideProbeDeferred: true,
      singleAnchorIsLocalProofOnly: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    const methods = [
      "mount",
      "boot",
      "start",
      "attach",
      "render",
      "drawFrame",
      "drawHearthCanvasFrame",
      "draw"
    ];

    let result = null;
    let usedMethod = "";

    for (const method of methods) {
      result = callCanvasMethod(api, method, payload);

      if (result && result.__hearthCanvasCallError) {
        state.lastError = result.message;
        log("CANVAS_METHOD_ERROR", {
          method,
          error: result.message
        });
        continue;
      }

      if (result !== null) {
        usedMethod = method;
        break;
      }
    }

    state.canvasCarrierBound = Boolean(usedMethod);
    state.canvasCarrierFailed = !state.canvasCarrierBound;
    state.lastCanvasReceipt = receiptOf(api) || result || null;

    if (state.canvasCarrierBound) {
      hideFallbackShell();

      if (state.mount) {
        state.mount.dataset.hearthCanvasCarrierBound = "true";
        state.mount.dataset.hearthCanvasCarrierMethod = usedMethod;
      }

      log("CANVAS_BIND_PASS", {
        method: usedMethod,
        canvasContract: contractOf(api),
        canvasReceipt: state.lastCanvasReceipt && state.lastCanvasReceipt.receipt ? state.lastCanvasReceipt.receipt : ""
      });

      publishStatusNode("canvas-bound");
      return true;
    }

    log("CANVAS_BIND_DEGRADED", {
      reason: "NO_CANVAS_METHOD_ACCEPTED",
      canvasContract: contractOf(api)
    });

    publishStatusNode("canvas-method-missing-fallback-shell-held");
    return false;
  }

  async function loadStack() {
    for (const dependency of SOURCE_STACK) {
      if (dependency.key === "runtime-table") state.runtimeTableRequested = true;
      if (dependency.key === "canvas") state.canvasCarrierRequested = true;

      const result = await loadDependency(dependency);

      if (dependency.key === "runtime-table") {
        state.runtimeTableLoaded = Boolean(result.loaded && readGlobal(dependency.globalNames));
      }

      if (dependency.key === "canvas") {
        state.canvasCarrierLoaded = Boolean(result.loaded && readGlobal(dependency.globalNames));
      }

      if (dependency.key === "runtime-table") {
        createRuntimeTablePlan();
      }

      if (dependency.key === "canvas") {
        bindCanvasCarrier();
      }
    }

    publishDataset("stack-loaded-or-degraded");
    publishStatusNode("stack-loaded-or-degraded");

    log("LOAD_STACK_COMPLETE", {
      loaded: clone(state.loaded),
      failed: clone(state.failed),
      canvasCarrierBound: state.canvasCarrierBound,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated
    });
  }

  function getStatus() {
    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousRouteContract: PREVIOUS_ROUTE_CONTRACT,
      retiredClimateRouteContract: RETIRED_CLIMATE_ROUTE_CONTRACT,
      version: VERSION,
      authority: "hearth-route-conductor",
      routeFile: ROUTE_FILE,
      retiredClimateRouteFile: RETIRED_CLIMATE_ROUTE_FILE,
      canvasFile: CANVAS_FILE,
      runtimeTableFile: RUNTIME_TABLE_FILE,

      booted: state.booted,
      booting: state.booting,
      mounted: state.mounted,
      mountFound: state.mountFound,
      mountCreated: state.mountCreated,
      fallbackShellMounted: state.fallbackShellMounted,

      activeRouteClaimed: true,
      climateRouteActiveCarrier: false,
      hearthJsOwnsRouteConduction: true,
      hearthClimateRouteRetiredFromCarrierDuty: true,
      hearthCanvasOwnsVisibleCarrier: true,
      runtimeTableDiagnosticOnly: true,
      runtimeTableCannotBlankCarrier: true,

      runtimeTableRequested: state.runtimeTableRequested,
      runtimeTableLoaded: state.runtimeTableLoaded,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanFailed: state.runtimeTablePlanFailed,

      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierLoaded: state.canvasCarrierLoaded,
      canvasCarrierBound: state.canvasCarrierBound,
      canvasCarrierFailed: state.canvasCarrierFailed,

      visibleCarrierFirst: true,
      wideProbeDeferred: true,
      singleAnchorIsLocalProofOnly: true,
      childFailureDoesNotEraseVisualization: true,
      visualizationBlocksOnlyWhenCarrierUnsafe: true,

      expectedContracts: { ...EXPECTED_CONTRACTS },
      loaded: clone(state.loaded),
      failed: clone(state.failed),
      lastPlan: clone(state.lastPlan),
      lastCanvasReceipt: clone(state.lastCanvasReceipt),
      ledger: clone(state.ledger),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      lastError: state.lastError
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousRouteContract: PREVIOUS_ROUTE_CONTRACT,
      retiredClimateRouteContract: RETIRED_CLIMATE_ROUTE_CONTRACT,
      version: VERSION,
      authority: "hearth-route-conductor-runtime-table-visible-carrier",
      status: "active",
      destinationFile: ROUTE_FILE,

      purpose: [
        "make hearth.js the single active route conductor",
        "retire hearth.climate.route.js from carrier duty",
        "mount visible carrier first",
        "load source stack chronologically",
        "load Runtime Table without allowing diagnostic failure to erase the carrier",
        "load and bind /assets/hearth/hearth.canvas.js as visible carrier owner"
      ],

      sequence: [
        "mount visible carrier area",
        "publish route conductor receipt",
        "load Runtime Table as optional diagnostic equipment",
        "load tectonics",
        "load elevation",
        "load composition",
        "load hydrology",
        "load materials",
        "load land channel",
        "load water channel",
        "load air channel",
        "load hex four-pair authority",
        "load hex surface consumer",
        "load canvas carrier",
        "bind canvas carrier",
        "defer wide-probe"
      ],

      expectedFiles: {
        retiredClimateRoute: RETIRED_CLIMATE_ROUTE_FILE,
        runtimeTable: RUNTIME_TABLE_FILE,
        canvas: CANVAS_FILE
      },

      expectedContracts: { ...EXPECTED_CONTRACTS },

      owns: [
        "route conduction",
        "script load sequence",
        "visible-carrier-first mounting",
        "runtime-table optional plan request",
        "canvas-carrier binding attempt",
        "route receipts",
        "chronological synchronization ledger"
      ],

      doesNotOwn: [
        "tectonic cause",
        "elevation generation",
        "composition classification",
        "hydrology classification",
        "material palette",
        "land truth",
        "water truth",
        "air truth",
        "canvas drawing",
        "atlas pixel painting",
        "runtime motion",
        "controls",
        "wide-probe truth",
        "final visual pass claim"
      ],

      laws: [
        "Runtime Table is diagnostic and procedural-plan equipment only",
        "Runtime Table absence cannot blank Hearth",
        "child channel absence degrades coherence but does not erase visualization",
        "single anchor sample is local proof only",
        "wide-probe runs after first visible carrier",
        "climate route is tombstoned, not active carrier",
        "canvas owns visible carrier drawing"
      ],

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function boot() {
    if (state.booted || state.booting) return getStatus();

    state.booting = true;
    state.lastError = "";

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = ROUTE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR_FILE__ = ROUTE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ACTIVE_CANVAS_FILE__ = CANVAS_FILE;
    root.__HEARTH_RUNTIME_TABLE_FILE__ = RUNTIME_TABLE_FILE;
    root.__HEARTH_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    const mount = mountNode();
    mountFallbackShell(mount);

    publishDataset("visible-carrier-mounted");
    publishStatusNode("visible-carrier-mounted");

    log("BOOT_VISIBLE_CARRIER_FIRST", {
      routeFile: ROUTE_FILE,
      mountFound: state.mountFound,
      mountCreated: state.mountCreated,
      fallbackShellMounted: state.fallbackShellMounted,
      runtimeTableCannotBlankCarrier: true
    });

    state.booted = true;
    state.booting = false;

    loadStack().catch((error) => {
      state.lastError = error && error.message ? error.message : String(error);
      state.canvasCarrierFailed = true;

      log("LOAD_STACK_ERROR", {
        error: state.lastError
      });

      publishStatusNode("stack-error-fallback-shell-held");
    });

    return getStatus();
  }

  function reload() {
    state.booted = false;
    state.booting = false;
    state.canvasCarrierBound = false;
    state.canvasCarrierFailed = false;
    state.runtimeTablePlanCreated = false;
    state.runtimeTablePlanFailed = false;
    state.lastError = "";
    return boot();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousRouteContract: PREVIOUS_ROUTE_CONTRACT,
    retiredClimateRouteContract: RETIRED_CLIMATE_ROUTE_CONTRACT,
    version: VERSION,

    boot,
    reload,
    mountNode,
    createRuntimeTablePlan,
    bindCanvasCarrier,
    getStatus,
    getReceipt,

    routeFile: ROUTE_FILE,
    retiredClimateRouteFile: RETIRED_CLIMATE_ROUTE_FILE,
    canvasFile: CANVAS_FILE,
    runtimeTableFile: RUNTIME_TABLE_FILE,
    sourceStack: SOURCE_STACK.map((item) => ({ ...item })),
    expectedContracts: { ...EXPECTED_CONTRACTS },

    activeRouteConductor: true,
    hearthJsOwnsRouteConduction: true,
    hearthCanvasOwnsVisibleCarrier: true,
    climateRouteActiveCarrier: false,
    runtimeTableDiagnosticOnly: true,
    runtimeTableCannotBlankCarrier: true,
    visibleCarrierFirst: true,
    wideProbeDeferred: true,
    singleAnchorIsLocalProofOnly: true,
    childFailureDoesNotEraseVisualization: true,
    visualizationBlocksOnlyWhenCarrierUnsafe: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.routeConductor = api;
  root.HEARTH.hearthRoute = api;

  root.HEARTH_ROUTE_CONDUCTOR = api;
  root.HEARTH_ROUTE = api;
  root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = getReceipt();
  root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;
  root.HEARTH_ACTIVE_ROUTE_CONDUCTOR = api;

  if (doc && doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
