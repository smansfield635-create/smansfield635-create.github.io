// /showroom/globe/hearth/hearth.climate.route.js
// HEARTH_CLIMATE_ROUTE_HEX_FOUR_PAIR_FULL_RENEWAL_TNT_v1
// Full-file replacement.
// Route orchestration authority only.
// Purpose:
// - Renew the Hearth climate route from scratch around the hex four-pair body-bound handshake standard.
// - Load parent-chain authorities in a clean order before visual mount.
// - Load the hex four-pair pixel handshake authority before canvas.
// - Load the renewed Hearth canvas with a fresh route cache key.
// - Reject/flag the old Runtime-Table-directed canvas if it remains resident.
// - Mount only a canvas that proves the expected hex four-pair canvas contract.
// - Preserve map portal, page HTML, parent authorities, runtime, controls, child channels, and final visual-pass separation.
// Does not own:
// - page HTML
// - map portal
// - parent truth generation
// - hex authority truth
// - canvas drawing law
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;

  const CONTRACT = "HEARTH_CLIMATE_ROUTE_HEX_FOUR_PAIR_FULL_RENEWAL_TNT_v1";
  const RECEIPT = "HEARTH_CLIMATE_ROUTE_HEX_FOUR_PAIR_FULL_RENEWAL_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_ELEVATION_COMPOSITION_MATERIAL_ROUTE_SYNC_TNT_v22";
  const BASELINE_CONTRACT = "HEARTH_TECTONIC_PARENT_CHAIN_ROUTE_TNT_v21";
  const VERSION = "2026-05-29.hearth-climate-route-hex-four-pair-full-renewal-v1";

  const EXPECTED = Object.freeze({
    runtimeTable: "LAB_UNIVERSAL_PLANET_WIDE_PROBE_DIAGNOSTIC_LOADING_STANDARD_TNT_v1",
    tectonics: "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2",
    elevation: "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2",
    composition: "HEARTH_TECTONICS_SEATED_COMPOSITION_COORDINATION_TNT_v2",
    hydrology: "HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_TNT_v1",
    materials: "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1",
    land: "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1",
    water: "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
    air: "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1",
    hex: "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1",
    canvas: "HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1"
  });

  const STALE_CANVAS_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1",
    "HEARTH_CANVAS_ATLAS_START_SEQUENCING_HARDENING_TNT_v1",
    "HEARTH_CANVAS_VISIBLE_PLANET_NONBLOCKING_WATER_CHILD_DIAGNOSTIC_RECOVERY_TNT_v1"
  ]);

  const PATHS = Object.freeze({
    runtimeTable: "/assets/lab/runtime-table.js",
    tectonics: "/assets/hearth/hearth.tectonics.js",
    elevation: "/assets/hearth/hearth.elevation.js",
    composition: "/assets/hearth/hearth.composition.js",
    hydrology: "/assets/hearth/hearth.hydrology.js",
    materials: "/assets/hearth/hearth.materials.js",
    land: "/assets/hearth/hearth.land.channel.js",
    water: "/assets/hearth/hearth.water.channel.js",
    air: "/assets/hearth/hearth.air.channel.js",
    canvas: "/assets/hearth/hearth.canvas.js"
  });

  const HEX_AUTHORITY_CANDIDATES = Object.freeze([
    "/assets/hearth/hearth.hex.four-pair.authority.js",
    "/assets/hearth/hearth.hex.four-pair.handshake.js",
    "/assets/hearth/hearth.hex.handshake.js",
    "/assets/hearth/hearth.hexgrid.handshake.js",
    "/assets/hearth/hearth.hexgrid.render.js"
  ]);

  const SELECTORS = Object.freeze([
    "[data-hearth-planet-mount]",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-carrier]",
    "[data-hearth-active-planet-carrier]",
    "[data-active-visible-planet-carrier]",
    "[data-hearth-planet-stage]",
    "[data-hearth-visual-stage]",
    "[data-planet-stage='hearth']",
    "#hearth-planet-mount",
    "#hearth-canvas-mount",
    "#hearth-planet-stage",
    ".hearth-planet-mount",
    ".hearth-canvas-mount",
    ".hearth-planet-stage",
    ".hearth-planet-viewport",
    ".hearth-visible-carrier",
    ".planet-stage",
    ".globe-stage"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    status: "CREATED",
    startedAt: "",
    completedAt: "",
    routeMounted: false,
    mountTargetFound: false,
    mountSelector: "",
    mountMode: "",
    mountedApiPresent: false,
    canvasContract: "",
    canvasReceipt: "",
    hexContract: "",
    hexReceipt: "",
    oldCanvasRejected: false,
    oldCanvasContractSeen: "",
    requiredHexReady: false,
    requiredCanvasReady: false,
    parentChainReady: false,
    channelChainReady: false,
    loadResults: [],
    failures: [],
    warnings: [],
    diagnosticExport: "",
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function asText(value) {
    if (value === undefined || value === null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);

    try {
      return JSON.stringify(value);
    } catch (_error) {
      return String(value);
    }
  }

  function clonePlain(value) {
    if (!value || typeof value !== "object") return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function safeCall(fn, fallback) {
    try {
      return typeof fn === "function" ? fn() : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getDatasetTarget() {
    return root.document && root.document.documentElement ? root.document.documentElement.dataset : null;
  }

  function setDatasetPairs(pairs) {
    const dataset = getDatasetTarget();
    if (!dataset) return;

    Object.keys(pairs || {}).forEach((key) => {
      dataset[key] = asText(pairs[key]);
    });
  }

  function mark(status, extra = {}) {
    state.status = status;
    Object.assign(state, extra || {});

    setDatasetPairs({
      hearthRouteControllerLoaded: true,
      hearthRouteControllerContract: CONTRACT,
      hearthRouteControllerReceipt: RECEIPT,
      hearthRoutePreviousContract: PREVIOUS_CONTRACT,
      hearthRouteBaselineContract: BASELINE_CONTRACT,
      hearthRouteVersion: VERSION,
      hearthActiveRouteContract: CONTRACT,
      activeRouteContract: CONTRACT,
      hearthClimateRouteLoaded: true,
      hearthClimateRouteContract: CONTRACT,
      hearthClimateRouteReceipt: RECEIPT,
      hearthClimateRouteStatus: state.status,
      hearthClimateRouteHexRequired: true,
      hearthClimateRouteExpectedHexContract: EXPECTED.hex,
      hearthClimateRouteExpectedCanvasContract: EXPECTED.canvas,
      hearthClimateRouteHexContract: state.hexContract,
      hearthClimateRouteCanvasContract: state.canvasContract,
      hearthClimateRouteOldCanvasRejected: state.oldCanvasRejected,
      hearthClimateRouteOldCanvasContractSeen: state.oldCanvasContractSeen,
      hearthClimateRouteMounted: state.routeMounted,
      hearthClimateRouteMountMode: state.mountMode,
      hearthClimateRouteParentChainReady: state.parentChainReady,
      hearthClimateRouteChannelChainReady: state.channelChainReady,
      hearthClimateRouteRequiredHexReady: state.requiredHexReady,
      hearthClimateRouteRequiredCanvasReady: state.requiredCanvasReady,
      hearthClimateRouteFailureCount: state.failures.length,
      hearthClimateRouteWarningCount: state.warnings.length,
      hearthClimateRouteLoadResultCount: state.loadResults.length,
      hearthParentChainAligned: state.parentChainReady,
      hearthParentChainOrder: "tectonics-elevation-composition-hydrology-materials-land-water-air-hex-canvas",
      activeVisiblePlanetCarrier: state.routeMounted,
      generatedImage: false,
      graphicBox: false,
      webgl: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    });
  }

  function resolveNested(path) {
    if (!path || typeof path !== "string") return undefined;
    const parts = path.split(".").filter(Boolean);
    let cursor = root;

    for (const part of parts) {
      if (!cursor || typeof cursor !== "object") return undefined;
      cursor = cursor[part];
    }

    return cursor;
  }

  function resolveGlobal(names) {
    const list = Array.isArray(names) ? names : [names];

    for (const name of list) {
      const value = resolveNested(name);
      if (value) return value;
    }

    return null;
  }

  function getReceiptFromApi(api) {
    if (!api || typeof api !== "object") return null;

    if (typeof api.getReceipt === "function") {
      const receipt = safeCall(() => api.getReceipt(), null);
      if (receipt && typeof receipt === "object") return receipt;
    }

    if (api.receipt && typeof api.receipt === "object") return api.receipt;
    return null;
  }

  function getContractFromApi(api) {
    if (!api || typeof api !== "object") return "";

    if (typeof api.contract === "string" && api.contract) return api.contract;
    if (typeof api.CONTRACT === "string" && api.CONTRACT) return api.CONTRACT;

    const receipt = getReceiptFromApi(api);
    if (receipt && typeof receipt.contract === "string" && receipt.contract) return receipt.contract;
    if (receipt && typeof receipt.compatibilityContract === "string" && receipt.compatibilityContract) return receipt.compatibilityContract;

    return "";
  }

  function getReceiptNameFromApi(api) {
    if (!api || typeof api !== "object") return "";

    if (typeof api.receipt === "string" && api.receipt) return api.receipt;
    if (typeof api.RECEIPT === "string" && api.RECEIPT) return api.RECEIPT;

    const receipt = getReceiptFromApi(api);
    if (receipt && typeof receipt.receipt === "string" && receipt.receipt) return receipt.receipt;

    return "";
  }

  function getContractGlobal(names) {
    const list = Array.isArray(names) ? names : [names];

    for (const name of list) {
      const value = resolveNested(name);
      if (typeof value === "string" && value) return value;
    }

    return "";
  }

  function validateItem(item) {
    const api = resolveGlobal(item.globalNames || []);
    const contract = getContractFromApi(api) || getContractGlobal(item.contractGlobals || []);
    const receipt = getReceiptNameFromApi(api) || getContractGlobal(item.receiptGlobals || []);
    const expected = item.expectedContract || "";
    const compatible = Array.isArray(item.compatibleContracts) ? item.compatibleContracts : [];
    const contractOk = Boolean(contract) && (!expected || contract === expected || compatible.includes(contract));
    const present = Boolean(api || contract);
    const validationOk = present && (!expected || contractOk);

    return {
      key: item.key,
      label: item.label,
      path: item.path || "",
      expectedContract: expected,
      actualContract: contract,
      actualReceipt: receipt,
      present,
      contractOk,
      validationOk,
      api: api || null
    };
  }

  function createScriptSrc(path, cacheKey) {
    const joiner = path.includes("?") ? "&" : "?";
    return `${path}${joiner}v=${encodeURIComponent(cacheKey)}&route=${encodeURIComponent(CONTRACT)}&t=${Date.now()}`;
  }

  function removeScriptsByMarker(marker) {
    if (!root.document || !marker) return;

    root.document.querySelectorAll(`script[data-hearth-route-loader-marker="${marker}"]`).forEach((script) => {
      if (script && script.parentNode) {
        try {
          script.parentNode.removeChild(script);
        } catch (_error) {}
      }
    });
  }

  function removeScriptsByPath(path) {
    if (!root.document || !path) return;

    root.document.querySelectorAll("script[src]").forEach((script) => {
      const src = script.getAttribute("src") || "";
      if (src.includes(path) && script.parentNode) {
        try {
          script.parentNode.removeChild(script);
        } catch (_error) {}
      }
    });
  }

  function clearStaleCanvasGlobals() {
    const current = validateItem(ITEMS.canvas);
    const currentContract = current.actualContract;

    if (!currentContract || currentContract === EXPECTED.canvas) return current;

    if (STALE_CANVAS_CONTRACTS.includes(currentContract)) {
      state.oldCanvasRejected = true;
      state.oldCanvasContractSeen = currentContract;
      state.warnings.push(`Rejected stale Hearth canvas contract: ${currentContract}`);
    } else {
      state.warnings.push(`Rejected unexpected Hearth canvas contract: ${currentContract}`);
    }

    const staleApi = current.api;

    try {
      if (root.HEARTH && root.HEARTH.canvas === staleApi) delete root.HEARTH.canvas;
    } catch (_error) {
      if (root.HEARTH && root.HEARTH.canvas === staleApi) root.HEARTH.canvas = null;
    }

    [
      "HEARTH_CANVAS",
      "HearthCanvas",
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH_CANVAS_CONTRACT",
      "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED",
      "HEARTH_CANVAS_VISIBLE_CARRIER",
      "HEARTH_CANVAS_TRUE_SHELL_FIRST"
    ].forEach((name) => {
      try {
        delete root[name];
      } catch (_error) {
        root[name] = undefined;
      }
    });

    removeScriptsByPath(PATHS.canvas);
    return current;
  }

  function clearStaleHexGlobals() {
    const current = validateItem(ITEMS.hex);
    const currentContract = current.actualContract;

    if (!currentContract || currentContract === EXPECTED.hex) return current;

    state.warnings.push(`Rejected unexpected Hearth hex authority contract: ${currentContract}`);

    const staleApi = current.api;

    try {
      if (root.HEARTH && root.HEARTH.hexFourPairAuthority === staleApi) delete root.HEARTH.hexFourPairAuthority;
    } catch (_error) {
      if (root.HEARTH && root.HEARTH.hexFourPairAuthority === staleApi) root.HEARTH.hexFourPairAuthority = null;
    }

    [
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
      "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_HANDSHAKE_AUTHORITY",
      "HEARTH_HEXGRID_AUTHORITY"
    ].forEach((name) => {
      try {
        delete root[name];
      } catch (_error) {
        root[name] = undefined;
      }
    });

    HEX_AUTHORITY_CANDIDATES.forEach(removeScriptsByPath);
    return current;
  }

  function loadScriptDetailed(item, overrides = {}) {
    return new Promise((resolve) => {
      const cacheKey = overrides.cacheKey || item.cacheKey || VERSION;
      const result = {
        key: item.key,
        label: item.label,
        path: overrides.path || item.path || "",
        scriptPath: overrides.path || item.path || "",
        scriptCacheKey: cacheKey,
        marker: item.marker,
        expectedContract: item.expectedContract || "",
        actualContract: "",
        actualReceipt: "",
        requested: false,
        loaded: false,
        alreadyPresent: false,
        scriptElementCreated: false,
        scriptElementAppended: false,
        documentHeadAvailable: false,
        globalPresent: false,
        contractOk: false,
        validationOk: false,
        timeoutCheck: false,
        error: "",
        errorType: "",
        at: nowIso()
      };

      const applyValidation = () => {
        const validation = validateItem({ ...item, path: result.path });
        result.actualContract = validation.actualContract;
        result.actualReceipt = validation.actualReceipt;
        result.globalPresent = validation.present;
        result.contractOk = validation.contractOk;
        result.validationOk = validation.validationOk;
        return validation;
      };

      const existing = applyValidation();
      if (existing.validationOk && overrides.forceFresh !== true) {
        result.loaded = true;
        result.alreadyPresent = true;
        resolve(result);
        return;
      }

      if (!root.document || !root.document.head || !result.path) {
        result.error = !result.path ? "script-path-missing" : "document-head-unavailable";
        result.errorType = !result.path ? "path" : "document";
        resolve(result);
        return;
      }

      result.documentHeadAvailable = true;

      if (item.marker) removeScriptsByMarker(item.marker);
      if (overrides.forceFresh === true && result.path) removeScriptsByPath(result.path);

      const script = root.document.createElement("script");
      const src = createScriptSrc(result.path, cacheKey);

      result.requested = true;
      result.scriptElementCreated = true;
      result.requestedSrc = src;

      script.src = src;
      script.defer = true;
      script.dataset.hearthRouteLoaderMarker = item.marker || item.key;
      script.dataset.hearthRouteContract = CONTRACT;
      script.dataset.hearthRouteReceipt = RECEIPT;
      script.dataset.expectedContract = item.expectedContract || "";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      const settle = (kind, errorText) => {
        if (settled) return;
        settled = true;

        result.timeoutCheck = kind === "timeout";
        result.error = errorText || "";
        result.errorType = kind === "load" ? "" : kind;

        applyValidation();
        result.loaded = result.validationOk;

        resolve(result);
      };

      script.onload = () => settle("load", "");
      script.onerror = () => settle("error", "script-load-error");

      try {
        root.document.head.appendChild(script);
        result.scriptElementAppended = true;
      } catch (error) {
        result.error = error && error.message ? error.message : String(error);
        result.errorType = "append-error";
        resolve(result);
        return;
      }

      setTimeout(() => {
        if (!settled) settle("timeout", "script-load-timeout");
      }, overrides.timeoutMs || item.timeoutMs || 7000);
    });
  }

  async function loadFirstValid(item, candidates, options = {}) {
    const failures = [];

    const already = validateItem(item);
    if (already.validationOk && options.forceFresh !== true) {
      const existingResult = {
        key: item.key,
        label: item.label,
        path: already.path || item.path || "",
        scriptPath: already.path || item.path || "",
        expectedContract: item.expectedContract || "",
        actualContract: already.actualContract,
        actualReceipt: already.actualReceipt,
        requested: false,
        loaded: true,
        alreadyPresent: true,
        globalPresent: true,
        contractOk: true,
        validationOk: true,
        candidateFailures: [],
        at: nowIso()
      };
      return existingResult;
    }

    for (const path of candidates) {
      const result = await loadScriptDetailed({ ...item, path }, {
        path,
        forceFresh: options.forceFresh === true,
        cacheKey: options.cacheKey || item.cacheKey || VERSION,
        timeoutMs: options.timeoutMs || item.timeoutMs || 7000
      });

      if (result.validationOk) {
        result.candidateFailures = failures;
        return result;
      }

      failures.push({
        path,
        error: result.error,
        errorType: result.errorType,
        actualContract: result.actualContract,
        expectedContract: result.expectedContract,
        globalPresent: result.globalPresent,
        contractOk: result.contractOk,
        validationOk: result.validationOk
      });
    }

    return {
      key: item.key,
      label: item.label,
      path: candidates[0] || "",
      scriptPath: candidates[0] || "",
      expectedContract: item.expectedContract || "",
      actualContract: "",
      actualReceipt: "",
      requested: true,
      loaded: false,
      alreadyPresent: false,
      globalPresent: false,
      contractOk: false,
      validationOk: false,
      error: "no-valid-candidate-loaded",
      errorType: "candidate-failure",
      candidateFailures: failures,
      at: nowIso()
    };
  }

  const ITEMS = Object.freeze({
    runtimeTable: {
      key: "runtimeTable",
      label: "Lab Runtime Table",
      path: PATHS.runtimeTable,
      marker: "hearth-route-lab-runtime-table",
      expectedContract: EXPECTED.runtimeTable,
      cacheKey: "lab-universal-planet-wide-probe-diagnostic-loading-standard-v1",
      globalNames: [
        "LAB_RUNTIME_TABLE",
        "LAB_VISUAL_CARRIER_PLAN_AUTHORITY",
        "DEXTER_LAB.runtimeTable"
      ],
      contractGlobals: ["LAB_RUNTIME_TABLE_CONTRACT"],
      required: false
    },
    tectonics: {
      key: "tectonics",
      label: "Hearth Tectonics Authority",
      path: PATHS.tectonics,
      marker: "hearth-route-tectonics",
      expectedContract: EXPECTED.tectonics,
      cacheKey: "hearth-tectonics-route-renewal-v2",
      globalNames: ["HEARTH_TECTONICS", "HearthTectonics", "HEARTH.tectonics"],
      contractGlobals: ["HEARTH_TECTONICS_CONTRACT"],
      required: false
    },
    elevation: {
      key: "elevation",
      label: "Hearth Elevation Authority",
      path: PATHS.elevation,
      marker: "hearth-route-elevation",
      expectedContract: EXPECTED.elevation,
      cacheKey: "hearth-elevation-route-renewal-v2",
      globalNames: ["HEARTH_ELEVATION", "HearthElevation", "HEARTH.elevation"],
      contractGlobals: ["HEARTH_ELEVATION_CONTRACT"],
      required: false
    },
    composition: {
      key: "composition",
      label: "Hearth Composition Authority",
      path: PATHS.composition,
      marker: "hearth-route-composition",
      expectedContract: EXPECTED.composition,
      cacheKey: "hearth-composition-route-renewal-v2",
      globalNames: ["HEARTH_COMPOSITION", "HearthComposition", "HEARTH.composition"],
      contractGlobals: ["HEARTH_COMPOSITION_CONTRACT"],
      required: false
    },
    hydrology: {
      key: "hydrology",
      label: "Hearth Hydrology Authority",
      path: PATHS.hydrology,
      marker: "hearth-route-hydrology",
      expectedContract: EXPECTED.hydrology,
      cacheKey: "hearth-hydrology-route-renewal-v1",
      globalNames: ["HEARTH_HYDROLOGY", "HearthHydrology", "HEARTH.hydrology"],
      contractGlobals: ["HEARTH_HYDROLOGY_CONTRACT"],
      required: false
    },
    materials: {
      key: "materials",
      label: "Hearth Materials Authority",
      path: PATHS.materials,
      marker: "hearth-route-materials",
      expectedContract: EXPECTED.materials,
      cacheKey: "hearth-materials-route-renewal-v1",
      globalNames: ["HEARTH_MATERIALS", "HearthMaterials", "HEARTH.materials"],
      contractGlobals: ["HEARTH_MATERIALS_CONTRACT"],
      required: false
    },
    land: {
      key: "land",
      label: "Hearth Land Channel",
      path: PATHS.land,
      marker: "hearth-route-land-channel",
      expectedContract: EXPECTED.land,
      cacheKey: "hearth-land-channel-active-v1",
      globalNames: ["HEARTH_LAND_CHANNEL", "HearthLandChannel", "HEARTH.landChannel"],
      contractGlobals: ["HEARTH_LAND_CHANNEL_CONTRACT"],
      required: false
    },
    water: {
      key: "water",
      label: "Hearth Water Channel",
      path: PATHS.water,
      marker: "hearth-route-water-channel",
      expectedContract: EXPECTED.water,
      cacheKey: "hearth-water-channel-runtime-table-directed-v1",
      globalNames: ["HEARTH_WATER_CHANNEL", "HearthWaterChannel", "HEARTH.waterChannel"],
      contractGlobals: ["HEARTH_WATER_CHANNEL_CONTRACT"],
      required: false
    },
    air: {
      key: "air",
      label: "Hearth Air Channel",
      path: PATHS.air,
      marker: "hearth-route-air-channel",
      expectedContract: EXPECTED.air,
      cacheKey: "hearth-air-channel-active-v1",
      globalNames: ["HEARTH_AIR_CHANNEL", "HearthAirChannel", "HEARTH.airChannel"],
      contractGlobals: ["HEARTH_AIR_CHANNEL_CONTRACT"],
      required: false
    },
    hex: {
      key: "hex",
      label: "Hearth Hex Four-Pair Pixel Handshake Authority",
      path: HEX_AUTHORITY_CANDIDATES[0],
      marker: "hearth-route-hex-four-pair-authority",
      expectedContract: EXPECTED.hex,
      cacheKey: "hearth-hex-four-pair-pixel-handshake-authority-v1",
      globalNames: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_HANDSHAKE_AUTHORITY",
        "HEARTH_HEXGRID_AUTHORITY",
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hexAuthority"
      ],
      contractGlobals: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_CONTRACT",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY_CONTRACT",
        "HEARTH_HEX_AUTHORITY_CONTRACT"
      ],
      required: true
    },
    canvas: {
      key: "canvas",
      label: "Hearth Canvas Hex Four-Pair Body Boundary Carrier",
      path: PATHS.canvas,
      marker: "hearth-route-hex-four-pair-canvas",
      expectedContract: EXPECTED.canvas,
      cacheKey: "hearth-canvas-hex-four-pair-body-boundary-carrier-v1",
      globalNames: ["HEARTH_CANVAS", "HearthCanvas", "HEARTH.canvas"],
      contractGlobals: ["HEARTH_CANVAS_CONTRACT"],
      receiptGlobals: ["HEARTH_CANVAS_RECEIPT"],
      required: true
    }
  });

  function waitForDomReady() {
    if (!root.document) return Promise.resolve();
    if (root.document.readyState === "interactive" || root.document.readyState === "complete") return Promise.resolve();

    return new Promise((resolve) => {
      root.document.addEventListener("DOMContentLoaded", resolve, { once: true });
    });
  }

  function setLoadResultDataset(result) {
    const prefix = `hearthClimateRoute${result.key.charAt(0).toUpperCase()}${result.key.slice(1)}`;

    setDatasetPairs({
      [`${prefix}Loaded`]: result.validationOk,
      [`${prefix}Requested`]: result.requested,
      [`${prefix}AlreadyPresent`]: result.alreadyPresent,
      [`${prefix}ExpectedContract`]: result.expectedContract,
      [`${prefix}ActualContract`]: result.actualContract,
      [`${prefix}Path`]: result.scriptPath || result.path,
      [`${prefix}Error`]: result.error || "",
      [`${prefix}ValidationOk`]: result.validationOk
    });
  }

  function recordLoadResult(result) {
    const compact = {
      key: result.key,
      label: result.label,
      path: result.scriptPath || result.path || "",
      expectedContract: result.expectedContract || "",
      actualContract: result.actualContract || "",
      actualReceipt: result.actualReceipt || "",
      requested: Boolean(result.requested),
      loaded: Boolean(result.loaded),
      alreadyPresent: Boolean(result.alreadyPresent),
      globalPresent: Boolean(result.globalPresent),
      contractOk: Boolean(result.contractOk),
      validationOk: Boolean(result.validationOk),
      error: result.error || "",
      errorType: result.errorType || "",
      candidateFailures: result.candidateFailures || [],
      at: result.at || nowIso()
    };

    state.loadResults.push(compact);
    setLoadResultDataset(compact);

    if (!compact.validationOk) {
      const message = `${compact.key} failed validation. expected=${compact.expectedContract || "none"}; actual=${compact.actualContract || "none"}; path=${compact.path || "none"}; error=${compact.error || compact.errorType || "none"}`;
      if (ITEMS[compact.key] && ITEMS[compact.key].required) state.failures.push(message);
      else state.warnings.push(message);
    }

    return compact;
  }

  function findMountTarget() {
    if (!root.document) return null;

    const currentFrame = root.document.querySelector("[data-hearth-canvas-frame]");
    if (currentFrame && currentFrame.parentElement) {
      state.mountSelector = "existing [data-hearth-canvas-frame] parent";
      return currentFrame.parentElement;
    }

    const currentCanvas = root.document.querySelector("canvas.hearth-canvas-texture, canvas[data-hearth-canvas-texture='true']");
    if (currentCanvas && currentCanvas.parentElement) {
      const parent = currentCanvas.parentElement.parentElement || currentCanvas.parentElement;
      state.mountSelector = "existing Hearth canvas parent";
      return parent;
    }

    for (const selector of SELECTORS) {
      const node = root.document.querySelector(selector);
      if (node) {
        state.mountSelector = selector;
        return node;
      }
    }

    const main = root.document.querySelector("main") || root.document.body;
    if (!main) return null;

    const fallback = root.document.createElement("section");
    fallback.dataset.hearthPlanetMount = "true";
    fallback.dataset.hearthClimateRouteCreatedMount = "true";
    fallback.style.position = "relative";
    fallback.style.display = "grid";
    fallback.style.placeItems = "center";
    fallback.style.width = "100%";
    fallback.style.minHeight = "300px";
    fallback.style.margin = "16px auto";
    fallback.style.overflow = "hidden";

    main.appendChild(fallback);
    state.mountSelector = "route-created-fallback-mount";
    return fallback;
  }

  function prepareMount(target) {
    if (!target || !root.document) return;

    target.querySelectorAll([
      "[data-hearth-canvas-frame]",
      "[data-hearth-runtime-loading-panel]",
      "[data-hearth-route-block-panel]",
      "[data-hearth-route-status-panel]",
      "canvas.hearth-canvas-texture",
      "canvas[data-hearth-canvas-texture='true']"
    ].join(",")).forEach((node) => {
      if (node && node.parentNode) {
        try {
          node.parentNode.removeChild(node);
        } catch (_error) {}
      }
    });

    const style = root.getComputedStyle ? root.getComputedStyle(target) : null;
    if (style && style.position === "static") target.style.position = "relative";
    if (!target.style.minHeight) target.style.minHeight = "260px";
  }

  function renderRoutePanel(target, title, lines, tone = "warn") {
    if (!root.document || !target) return null;

    target.querySelectorAll("[data-hearth-route-block-panel]").forEach((node) => node.remove());

    const panel = root.document.createElement("aside");
    panel.dataset.hearthRouteBlockPanel = "true";
    panel.dataset.hearthClimateRouteContract = CONTRACT;
    panel.dataset.visualPassClaimed = "false";
    panel.style.boxSizing = "border-box";
    panel.style.width = "min(100%, 640px)";
    panel.style.margin = "12px auto";
    panel.style.padding = "14px 16px";
    panel.style.borderRadius = "18px";
    panel.style.border = tone === "fail" ? "1px solid rgba(255,142,126,.36)" : "1px solid rgba(230,198,122,.32)";
    panel.style.background = "linear-gradient(180deg, rgba(5,9,19,.90), rgba(2,5,12,.82))";
    panel.style.color = "rgba(238,246,255,.92)";
    panel.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    panel.style.fontSize = "12px";
    panel.style.lineHeight = "1.45";
    panel.style.boxShadow = "0 18px 50px rgba(0,0,0,.32)";

    const items = (Array.isArray(lines) ? lines : [lines]).map((line) => `<li>${escapeHtml(line)}</li>`).join("");

    panel.innerHTML = [
      `<strong style="display:block;text-transform:uppercase;letter-spacing:.11em;color:${tone === "fail" ? "rgba(255,188,176,.95)" : "rgba(230,198,122,.95)"};margin-bottom:8px;">${escapeHtml(title)}</strong>`,
      `<ul style="margin:0;padding-left:18px;">${items}</ul>`
    ].join("");

    target.appendChild(panel);
    return panel;
  }

  function buildMountOptions() {
    return {
      routeContract: CONTRACT,
      routeReceipt: RECEIPT,
      previousRouteContract: PREVIOUS_CONTRACT,
      expectedHexAuthorityContract: EXPECTED.hex,
      expectedCanvasContract: EXPECTED.canvas,
      requireHexFourPairAuthority: true,
      requireBodyBoundHandshake: true,
      rejectStaleCanvasContract: true,
      atlasWidth: 384,
      atlasHeight: 192,
      rowsPerChunk: 2,
      allowLargeTexture: false,
      visibleCarrierFirst: true,
      wideProbeBlocksFirstVisibleRender: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      onStatus(event, detail) {
        setDatasetPairs({
          hearthClimateRouteLastCanvasEvent: event,
          hearthClimateRouteLastCanvasEventAt: nowIso(),
          hearthClimateRouteLastCanvasEventContract: detail && detail.contract ? detail.contract : ""
        });
      }
    };
  }

  function mountCanvas(target) {
    const canvasApi = validateItem(ITEMS.canvas).api;

    if (!target || !canvasApi) {
      state.failures.push("Canvas mount failed: mount target or canvas API unavailable.");
      return null;
    }

    prepareMount(target);

    const options = buildMountOptions();
    let mounted = null;

    if (typeof canvasApi.mount === "function") {
      mounted = safeCall(() => canvasApi.mount(target, options), null);
      state.mountMode = "canvas-api.mount";
    }

    if (!mounted && typeof canvasApi.createShellFirstMount === "function") {
      mounted = safeCall(() => canvasApi.createShellFirstMount(target, options), null);
      state.mountMode = "canvas-api.createShellFirstMount";
    }

    if (!mounted && typeof canvasApi.createCanvas === "function") {
      const canvas = safeCall(() => canvasApi.createCanvas(options), null);
      if (canvas && canvas.nodeType === 1) {
        target.appendChild(canvas);
        mounted = { canvas, node: target, fallbackMount: true };
        state.mountMode = "canvas-api.createCanvas-append";
      }
    }

    if (!mounted && typeof canvasApi.createTextureCanvas === "function") {
      const canvas = safeCall(() => canvasApi.createTextureCanvas(options), null);
      if (canvas && canvas.nodeType === 1) {
        target.appendChild(canvas);
        mounted = { canvas, node: target, fallbackMount: true };
        state.mountMode = "canvas-api.createTextureCanvas-append";
      }
    }

    if (!mounted) {
      state.failures.push("Canvas API loaded but exposed no supported mount/create method.");
      return null;
    }

    if (mounted.canvas && mounted.canvas.dataset) {
      mounted.canvas.dataset.hearthClimateRouteMounted = "true";
      mounted.canvas.dataset.hearthClimateRouteContract = CONTRACT;
      mounted.canvas.dataset.hearthClimateRouteReceipt = RECEIPT;
      mounted.canvas.dataset.hearthClimateRouteExpectedHexContract = EXPECTED.hex;
      mounted.canvas.dataset.hearthClimateRouteExpectedCanvasContract = EXPECTED.canvas;
      mounted.canvas.dataset.generatedImage = "false";
      mounted.canvas.dataset.graphicBox = "false";
      mounted.canvas.dataset.webgl = "false";
      mounted.canvas.dataset.visualPassClaimed = "false";
    }

    return mounted;
  }

  function summarizeReadiness() {
    const byKey = {};
    state.loadResults.forEach((result) => {
      byKey[result.key] = result;
    });

    state.parentChainReady = ["tectonics", "elevation", "composition", "hydrology", "materials"].every((key) => Boolean(byKey[key] && byKey[key].validationOk));
    state.channelChainReady = ["land", "water", "air"].every((key) => Boolean(byKey[key] && byKey[key].validationOk));
    state.requiredHexReady = Boolean(byKey.hex && byKey.hex.validationOk);
    state.requiredCanvasReady = Boolean(byKey.canvas && byKey.canvas.validationOk);

    const hexValidation = validateItem(ITEMS.hex);
    const canvasValidation = validateItem(ITEMS.canvas);

    state.hexContract = hexValidation.actualContract;
    state.hexReceipt = hexValidation.actualReceipt;
    state.canvasContract = canvasValidation.actualContract;
    state.canvasReceipt = canvasValidation.actualReceipt;
  }

  function createDiagnosticExport() {
    const dataset = {};

    if (root.document && root.document.documentElement && root.document.documentElement.dataset) {
      Object.keys(root.document.documentElement.dataset).forEach((key) => {
        dataset[key] = root.document.documentElement.dataset[key];
      });
    }

    const exportText = [
      "HEARTH_CLIMATE_ROUTE_DIAGNOSTIC_RECEIPT_EXPORT",
      "",
      `timestamp=${nowIso()}`,
      `routeContract=${CONTRACT}`,
      `routeReceipt=${RECEIPT}`,
      `previousRouteContract=${PREVIOUS_CONTRACT}`,
      `baselineRouteContract=${BASELINE_CONTRACT}`,
      `status=${state.status}`,
      `routeMounted=${String(Boolean(state.routeMounted))}`,
      `mountTargetFound=${String(Boolean(state.mountTargetFound))}`,
      `mountSelector=${state.mountSelector || ""}`,
      `mountMode=${state.mountMode || ""}`,
      `expectedHexContract=${EXPECTED.hex}`,
      `actualHexContract=${state.hexContract || ""}`,
      `expectedCanvasContract=${EXPECTED.canvas}`,
      `actualCanvasContract=${state.canvasContract || ""}`,
      `oldCanvasRejected=${String(Boolean(state.oldCanvasRejected))}`,
      `oldCanvasContractSeen=${state.oldCanvasContractSeen || ""}`,
      `parentChainReady=${String(Boolean(state.parentChainReady))}`,
      `channelChainReady=${String(Boolean(state.channelChainReady))}`,
      `requiredHexReady=${String(Boolean(state.requiredHexReady))}`,
      `requiredCanvasReady=${String(Boolean(state.requiredCanvasReady))}`,
      `generatedImage=false`,
      `graphicBox=false`,
      `webGL=false`,
      `visualPassClaimed=false`,
      "",
      "LOAD_RESULTS",
      JSON.stringify(state.loadResults, null, 2),
      "",
      "FAILURES",
      JSON.stringify(state.failures, null, 2),
      "",
      "WARNINGS",
      JSON.stringify(state.warnings, null, 2),
      "",
      "DOCUMENT_ROOT_DATASET",
      JSON.stringify(dataset, null, 2)
    ].join("\n");

    state.diagnosticExport = exportText;

    setDatasetPairs({
      hearthClimateRouteDiagnosticExportAvailable: true,
      hearthClimateRouteDiagnosticExportLength: exportText.length,
      hearthClimateRouteDiagnosticExportUpdatedAt: nowIso()
    });

    return exportText;
  }

  async function boot() {
    if (state.status === "BOOTING" || state.status === "MOUNTED") return api;

    state.startedAt = nowIso();
    state.loadResults = [];
    state.failures = [];
    state.warnings = [];

    mark("BOOTING");

    await waitForDomReady();

    mark("DOM_READY");

    const loadOrder = [
      ITEMS.runtimeTable,
      ITEMS.tectonics,
      ITEMS.elevation,
      ITEMS.composition,
      ITEMS.hydrology,
      ITEMS.materials,
      ITEMS.land,
      ITEMS.water,
      ITEMS.air
    ];

    for (const item of loadOrder) {
      const result = await loadScriptDetailed(item, { timeoutMs: 7000 });
      recordLoadResult(result);
      mark(`LOADED_${item.key.toUpperCase()}`);
    }

    clearStaleHexGlobals();
    const hexResult = await loadFirstValid(ITEMS.hex, HEX_AUTHORITY_CANDIDATES, {
      forceFresh: false,
      timeoutMs: 7000,
      cacheKey: ITEMS.hex.cacheKey
    });
    recordLoadResult(hexResult);
    summarizeReadiness();
    mark("HEX_AUTHORITY_VALIDATED");

    if (!state.requiredHexReady) {
      const target = findMountTarget();
      state.mountTargetFound = Boolean(target);
      renderRoutePanel(target, "Hearth route blocked before canvas", [
        `Required hex authority did not validate: ${EXPECTED.hex}`,
        "The route will not mount the old non-hex canvas over this failure.",
        "Deploy the hex four-pair pixel handshake authority, then reload this route."
      ], "fail");
      mark("BLOCKED_HEX_AUTHORITY_MISSING");
      createDiagnosticExport();
      return api;
    }

    clearStaleCanvasGlobals();
    const canvasResult = await loadScriptDetailed(ITEMS.canvas, {
      forceFresh: true,
      timeoutMs: 8000,
      cacheKey: ITEMS.canvas.cacheKey
    });
    recordLoadResult(canvasResult);
    summarizeReadiness();
    mark("CANVAS_VALIDATED");

    if (!state.requiredCanvasReady) {
      const target = findMountTarget();
      state.mountTargetFound = Boolean(target);
      renderRoutePanel(target, "Hearth route blocked by canvas contract", [
        `Expected canvas: ${EXPECTED.canvas}`,
        `Actual canvas: ${state.canvasContract || "missing"}`,
        state.oldCanvasRejected
          ? `Old canvas was rejected: ${state.oldCanvasContractSeen}`
          : "No valid renewed canvas contract was found.",
        "The route is intentionally refusing to mount the stale Runtime-Table-directed carrier."
      ], "fail");
      mark("BLOCKED_CANVAS_CONTRACT_MISMATCH");
      createDiagnosticExport();
      return api;
    }

    const target = findMountTarget();
    state.mountTargetFound = Boolean(target);

    if (!target) {
      state.failures.push("No Hearth mount target found and fallback mount could not be created.");
      mark("BLOCKED_NO_MOUNT_TARGET");
      createDiagnosticExport();
      return api;
    }

    const mounted = mountCanvas(target);
    state.routeMounted = Boolean(mounted);
    state.mountedApiPresent = Boolean(mounted);

    if (!mounted) {
      renderRoutePanel(target, "Hearth canvas mount failed", [
        "The expected canvas contract loaded, but no supported mount/create method completed.",
        "Renew the canvas API surface or add a compatible mount method."
      ], "fail");
      mark("BLOCKED_CANVAS_MOUNT_FAILED");
      createDiagnosticExport();
      return api;
    }

    state.completedAt = nowIso();
    summarizeReadiness();
    mark("MOUNTED", {
      routeMounted: true
    });
    createDiagnosticExport();

    setDatasetPairs({
      hearthVisibleGlobeMounted: true,
      hearthCanvasFound: true,
      hearthControlsBound: true,
      hearthActiveVisiblePlanetCarrier: true,
      activeVisiblePlanetCarrier: true,
      hearthCanvasHexFourPairRouteMounted: true,
      hearthHexFourPairAuthorityValidated: true,
      hearthCanvasOldRuntimeTableCarrierRejected: state.oldCanvasRejected,
      coherentExpressionPassIsNotVisualPassClaim: true,
      imageRenderedIsNotCoherencePass: true,
      constructionReadyIsNotCoherencePass: true,
      visualPassClaimed: false
    });

    return api;
  }

  function getReceipt() {
    summarizeReadiness();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-climate-route-hex-four-pair-full-renewal",
      status: state.status,
      destinationFile: "/showroom/globe/hearth/hearth.climate.route.js",
      role: "Hearth route orchestration and clean hex/canvas binding authority",

      expectedContracts: clonePlain(EXPECTED),
      staleCanvasContractsRejected: Array.from(STALE_CANVAS_CONTRACTS),
      oldCanvasRejected: state.oldCanvasRejected,
      oldCanvasContractSeen: state.oldCanvasContractSeen,

      loadOrder: [
        PATHS.runtimeTable,
        PATHS.tectonics,
        PATHS.elevation,
        PATHS.composition,
        PATHS.hydrology,
        PATHS.materials,
        PATHS.land,
        PATHS.water,
        PATHS.air,
        HEX_AUTHORITY_CANDIDATES[0],
        PATHS.canvas
      ],
      hexAuthorityCandidates: Array.from(HEX_AUTHORITY_CANDIDATES),
      mountSelectors: Array.from(SELECTORS),

      routeMounted: state.routeMounted,
      mountTargetFound: state.mountTargetFound,
      mountSelector: state.mountSelector,
      mountMode: state.mountMode,
      parentChainReady: state.parentChainReady,
      channelChainReady: state.channelChainReady,
      requiredHexReady: state.requiredHexReady,
      requiredCanvasReady: state.requiredCanvasReady,
      hexContract: state.hexContract,
      canvasContract: state.canvasContract,
      failures: state.failures.slice(),
      warnings: state.warnings.slice(),
      loadResults: clonePlain(state.loadResults),

      owns: [
        "route-load-order",
        "script-cache-renewal",
        "parent-chain-load-validation",
        "hex-authority-before-canvas-gate",
        "stale-canvas-rejection",
        "canvas-contract-validation",
        "mount-target-selection",
        "canvas-mount-call",
        "route-diagnostic-export",
        "document-dataset-route-receipts"
      ],
      doesNotOwn: [
        "page HTML",
        "map portal",
        "parent truth generation",
        "hex authority truth",
        "canvas drawing law",
        "runtime motion",
        "controls",
        "final visual pass claim"
      ],

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  function getDiagnosticExport() {
    return createDiagnosticExport();
  }

  function copyDiagnosticExport() {
    const text = createDiagnosticExport();

    if (root.navigator && root.navigator.clipboard && typeof root.navigator.clipboard.writeText === "function") {
      return root.navigator.clipboard.writeText(text).then(
        () => {
          setDatasetPairs({ hearthClimateRouteDiagnosticExportCopied: true, hearthClimateRouteDiagnosticExportCopyError: "" });
          return true;
        },
        (error) => {
          setDatasetPairs({
            hearthClimateRouteDiagnosticExportCopied: false,
            hearthClimateRouteDiagnosticExportCopyError: error && error.message ? error.message : String(error)
          });
          return false;
        }
      );
    }

    setDatasetPairs({
      hearthClimateRouteDiagnosticExportCopied: false,
      hearthClimateRouteDiagnosticExportCopyError: "clipboard unavailable"
    });
    return Promise.resolve(false);
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    state,

    boot,
    getReceipt,
    getDiagnosticExport,
    copyDiagnosticExport,
    validateItem,
    loadScriptDetailed,
    loadFirstValid,
    findMountTarget,
    mountCanvas,

    expectedContracts: EXPECTED,
    hexAuthorityCandidates: HEX_AUTHORITY_CANDIDATES,
    staleCanvasContractsRejected: STALE_CANVAS_CONTRACTS,

    routeOrchestrationAuthority: true,
    renewsFromScratch: true,
    loadsHexAuthorityBeforeCanvas: true,
    rejectsStaleCanvasContract: true,
    requiresHexFourPairAuthority: true,
    requiresHexFourPairCanvas: true,
    preservesMapPortal: true,
    ownsPageHtml: false,
    ownsRuntimeMotion: false,
    ownsControls: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.climateRoute = api;
  root.HEARTH_CLIMATE_ROUTE = api;
  root.HEARTH_CLIMATE_ROUTE_CONTRACT = CONTRACT;
  root.HEARTH_CLIMATE_ROUTE_RECEIPT = RECEIPT;
  root.HEARTH_CLIMATE_ROUTE_HEX_FOUR_PAIR_FULL_RENEWAL = true;

  setDatasetPairs({
    hearthRouteControllerLoaded: true,
    hearthRouteControllerContract: CONTRACT,
    hearthRouteControllerReceipt: RECEIPT,
    hearthRoutePreviousContract: PREVIOUS_CONTRACT,
    hearthRouteBaselineContract: BASELINE_CONTRACT,
    hearthRouteVersion: VERSION,
    hearthClimateRouteLoaded: true,
    hearthClimateRouteContract: CONTRACT,
    hearthClimateRouteReceipt: RECEIPT,
    hearthClimateRouteExpectedHexContract: EXPECTED.hex,
    hearthClimateRouteExpectedCanvasContract: EXPECTED.canvas,
    hearthClimateRouteHexBeforeCanvas: true,
    hearthClimateRouteRejectsStaleCanvas: true,
    generatedImage: false,
    graphicBox: false,
    webgl: false,
    visualPassClaimed: false
  });

  if (root.document) {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
