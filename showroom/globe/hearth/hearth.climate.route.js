// /showroom/globe/hearth/hearth.climate.route.js
// HEARTH_CLIMATE_ROUTE_HEX_FOUR_PAIR_FULL_RENEWAL_TNT_v1
// Full-file replacement.
// Route/load-order authority only.
// Purpose:
// - Renew Hearth climate route from scratch around the body-bound hex four-pair authority.
// - Load /assets/hearth/hearth.hex.four-pair.authority.js before route validation.
// - Validate every sampled pixel has north, south, east, west handshakes.
// - Prevent a missing/stale hex authority from falsely blocking the visible planet carrier before the route attempts to load it.
// - Preserve visible Hearth canvas mounting.
// - Preserve parent-chain authority separation.
// - Keep hex center as influence/handshake identity, not visual land/water truth.
// Does not own:
// - land truth
// - water truth
// - air truth
// - hydrology truth
// - elevation generation
// - material palette generation
// - canvas drawing
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

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";

  const EXPECTED = Object.freeze({
    hexFourPair: "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1",
    tectonics: "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2",
    elevation: "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2",
    composition: "HEARTH_TECTONICS_SEATED_COMPOSITION_COORDINATION_TNT_v2",
    hydrology: "HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_TNT_v1",
    materials: "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1",
    hexSurface: "HEARTH_G3_HEX_SURFACE_GLOBAL_API_REPAIR_TNT_v1",
    canvas: "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1"
  });

  const PATHS = Object.freeze({
    hexFourPair: "/assets/hearth/hearth.hex.four-pair.authority.js",
    tectonics: "/assets/hearth/hearth.tectonics.js",
    elevation: "/assets/hearth/hearth.elevation.js",
    composition: "/assets/hearth/hearth.composition.js",
    hydrology: "/assets/hearth/hearth.hydrology.js",
    materials: "/assets/hearth/hearth.materials.js",
    hexSurface: "/assets/hearth/hearth.hex.surface.js",
    canvas: "/assets/hearth/hearth.canvas.js"
  });

  const CACHE = Object.freeze({
    route: "hearth-climate-route-hex-four-pair-full-renewal-v1",
    hexFourPair: "hearth-hex-four-pair-pixel-handshake-authority-v1",
    tectonics: "hearth-tectonics-structural-cause-v2",
    elevation: "hearth-tectonics-seated-elevation-resolver-v2",
    composition: "hearth-tectonics-seated-composition-coordination-v2",
    hydrology: "hearth-sea-level-waterline-beach-boundary-hydrology-v1",
    materials: "hearth-submerged-port-basin-waterline-materials-v1",
    hexSurface: "hearth-g3-hex-surface-global-api-repair-v1",
    canvas: "hearth-canvas-runtime-table-directed-visible-carrier-v1"
  });

  const SCRIPT_MANIFEST = Object.freeze([
    {
      key: "hexFourPair",
      label: "Hearth Hex Four-Pair Pixel Handshake Authority",
      path: PATHS.hexFourPair,
      expectedContract: EXPECTED.hexFourPair,
      cacheKey: CACHE.hexFourPair,
      required: true,
      marker: "hearth-hex-four-pair-authority",
      globals: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_HANDSHAKE_AUTHORITY",
        "HEARTH_HEXGRID_AUTHORITY"
      ]
    },
    {
      key: "tectonics",
      label: "Hearth Tectonics Authority",
      path: PATHS.tectonics,
      expectedContract: EXPECTED.tectonics,
      cacheKey: CACHE.tectonics,
      required: false,
      marker: "hearth-tectonics-authority",
      globals: [
        "HEARTH_TECTONICS",
        "HEARTH_TECTONICS_AUTHORITY",
        "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY"
      ]
    },
    {
      key: "elevation",
      label: "Hearth Elevation Authority",
      path: PATHS.elevation,
      expectedContract: EXPECTED.elevation,
      cacheKey: CACHE.elevation,
      required: false,
      marker: "hearth-elevation-authority",
      globals: [
        "HEARTH_ELEVATION",
        "HEARTH_ELEVATION_AUTHORITY",
        "HEARTH_TECTONICS_SEATED_ELEVATION"
      ]
    },
    {
      key: "composition",
      label: "Hearth Composition Authority",
      path: PATHS.composition,
      expectedContract: EXPECTED.composition,
      cacheKey: CACHE.composition,
      required: false,
      marker: "hearth-composition-authority",
      globals: [
        "HEARTH_COMPOSITION",
        "HEARTH_COMPOSITION_AUTHORITY",
        "HEARTH_TECTONICS_SEATED_COMPOSITION"
      ]
    },
    {
      key: "hydrology",
      label: "Hearth Hydrology Authority",
      path: PATHS.hydrology,
      expectedContract: EXPECTED.hydrology,
      cacheKey: CACHE.hydrology,
      required: false,
      marker: "hearth-hydrology-authority",
      globals: [
        "HEARTH_HYDROLOGY",
        "HEARTH_HYDROLOGY_AUTHORITY",
        "HEARTH_SEA_LEVEL_WATERLINE_HYDROLOGY"
      ]
    },
    {
      key: "materials",
      label: "Hearth Materials Authority",
      path: PATHS.materials,
      expectedContract: EXPECTED.materials,
      cacheKey: CACHE.materials,
      required: false,
      marker: "hearth-materials-authority",
      globals: [
        "HEARTH_MATERIALS",
        "HEARTH_MATERIALS_AUTHORITY",
        "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS"
      ]
    },
    {
      key: "hexSurface",
      label: "Hearth Hex Surface Renderer",
      path: PATHS.hexSurface,
      expectedContract: EXPECTED.hexSurface,
      cacheKey: CACHE.hexSurface,
      required: false,
      marker: "hearth-hex-surface-renderer",
      globals: [
        "HEARTH_HEX_SURFACE"
      ]
    },
    {
      key: "canvas",
      label: "Hearth Canvas Authority",
      path: PATHS.canvas,
      expectedContract: EXPECTED.canvas,
      cacheKey: CACHE.canvas,
      required: true,
      marker: "hearth-canvas-authority",
      globals: [
        "HEARTH_CANVAS",
        "HearthCanvas"
      ]
    }
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "[data-hearth-planet-mount]",
    "[data-hearth-canvas-mount]",
    "[data-hearth-globe-mount]",
    "[data-hearth-active-planet-mount]",
    "[data-planet-stage='hearth']",
    "[data-globe-stage='hearth']",
    "#hearth-planet-mount",
    "#hearth-canvas-mount",
    "#hearth-globe-mount",
    ".hearth-planet-mount",
    ".hearth-canvas-mount",
    ".hearth-globe-mount",
    "[data-globe-stage]",
    "[data-planet-stage]"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    bootStarted: false,
    bootComplete: false,
    bootError: "",
    routeMounted: false,
    mountTargetFound: false,
    mountTargetSelector: "",
    createdMountTarget: false,
    scriptResults: [],
    scriptMap: {},
    hexValidation: null,
    parentChainStatus: null,
    canvasApi: null,
    canvasMountApi: null,
    canvasMountResult: null,
    status: "PENDING",
    handoff: "PENDING",
    updatedAt: "",
    visualPassClaimed: false
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function boolString(value) {
    return String(Boolean(value));
  }

  function getDocument() {
    return root.document && root.document.documentElement ? root.document : null;
  }

  function getRootDataset() {
    const doc = getDocument();
    return doc && doc.documentElement && doc.documentElement.dataset
      ? doc.documentElement.dataset
      : null;
  }

  function writeDataset(pairs) {
    const dataset = getRootDataset();
    if (!dataset) return;

    Object.keys(pairs || {}).forEach((key) => {
      dataset[key] = safeString(pairs[key]);
    });
  }

  function appendCacheKey(path, cacheKey) {
    const joiner = path.includes("?") ? "&" : "?";
    return `${path}${joiner}v=${encodeURIComponent(cacheKey || CACHE.route)}`;
  }

  function readGlobal(name) {
    try {
      return root[name];
    } catch (_error) {
      return null;
    }
  }

  function contractOf(value) {
    if (!value || typeof value !== "object") return "";
    return safeString(
      value.contract ||
      value.CONTRACT ||
      value.compatibilityContract ||
      value.boundaryHandshakeContract ||
      value.receipt ||
      value.RECEIPT ||
      ""
    );
  }

  function receiptOf(value) {
    if (!value || typeof value !== "object") return "";
    return safeString(value.receipt || value.RECEIPT || value.contract || "");
  }

  function resolveGlobal(item) {
    for (const name of item.globals || []) {
      const value = readGlobal(name);
      if (value && typeof value === "object") {
        return {
          name,
          value
        };
      }
    }

    return {
      name: "",
      value: null
    };
  }

  function validateManifestItem(item) {
    const resolved = resolveGlobal(item);
    const actualContract = contractOf(resolved.value);
    const actualReceipt = receiptOf(resolved.value);

    const contractOk = Boolean(
      resolved.value &&
      (
        actualContract === item.expectedContract ||
        actualReceipt === item.expectedContract ||
        actualReceipt === item.expectedReceipt
      )
    );

    return {
      key: item.key,
      label: item.label,
      path: item.path,
      expectedContract: item.expectedContract,
      required: Boolean(item.required),
      globalName: resolved.name,
      globalPresent: Boolean(resolved.value),
      actualContract,
      actualReceipt,
      contractOk,
      validationOk: Boolean(resolved.value && contractOk),
      authority: resolved.value || null
    };
  }

  function removeStaleScriptMarkers(marker) {
    const doc = getDocument();
    if (!doc || !marker) return;

    const selector = `script[data-hearth-route-loader-marker="${marker}"]`;
    const scripts = Array.from(doc.querySelectorAll(selector));

    scripts.forEach((script) => {
      try {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (_error) {}
    });
  }

  function loadScriptDetailed(item, options = {}) {
    return new Promise((resolve) => {
      const doc = getDocument();

      const initial = validateManifestItem(item);
      const result = {
        key: item.key,
        label: item.label,
        path: item.path,
        scriptPath: item.path,
        scriptCacheKey: item.cacheKey,
        expectedContract: item.expectedContract,
        required: Boolean(item.required),
        requestedSrc: "",
        requested: false,
        scriptElementCreated: false,
        scriptElementAppended: false,
        documentHeadAvailable: Boolean(doc && doc.head),
        loaded: false,
        alreadyPresent: false,
        globalPresent: initial.globalPresent,
        globalName: initial.globalName,
        actualContract: initial.actualContract,
        actualReceipt: initial.actualReceipt,
        contractOk: initial.contractOk,
        validationOk: initial.validationOk,
        error: "",
        errorType: "",
        failureCoordinate: "S0_NOT_STARTED",
        at: nowIso()
      };

      if (initial.validationOk) {
        result.loaded = true;
        result.alreadyPresent = true;
        result.failureCoordinate = "S9_ALREADY_VALIDATED";
        resolve(result);
        return;
      }

      if (!doc || !doc.head) {
        result.error = "document-head-unavailable";
        result.errorType = "document";
        result.failureCoordinate = "S1_DOCUMENT_HEAD_UNAVAILABLE";
        resolve(result);
        return;
      }

      removeStaleScriptMarkers(item.marker);

      const script = doc.createElement("script");
      const src = appendCacheKey(item.path, item.cacheKey);

      result.requested = true;
      result.requestedSrc = src;
      result.scriptElementCreated = true;
      result.failureCoordinate = "S2_SCRIPT_REQUEST_PREPARED";

      script.src = src;
      script.defer = true;
      script.dataset.hearthRouteLoaderMarker = item.marker;
      script.dataset.hearthRouteContract = CONTRACT;
      script.dataset.hearthRouteReceipt = RECEIPT;
      script.dataset.hearthRouteExpectedContract = item.expectedContract || "";
      script.dataset.hearthRouteRequired = boolString(item.required);
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      const settle = (kind, errorText = "") => {
        if (settled) return;
        settled = true;

        const validation = validateManifestItem(item);

        result.globalPresent = validation.globalPresent;
        result.globalName = validation.globalName;
        result.actualContract = validation.actualContract;
        result.actualReceipt = validation.actualReceipt;
        result.contractOk = validation.contractOk;
        result.validationOk = validation.validationOk;
        result.loaded = kind === "load" ? validation.validationOk : false;
        result.error = errorText;
        result.errorType = kind === "load" ? "" : kind;

        if (validation.validationOk) {
          result.failureCoordinate = "S9_CHILD_VALIDATED";
        } else if (kind === "error") {
          result.failureCoordinate = "S4_SCRIPT_NETWORK_LOAD_FAILURE";
        } else if (kind === "timeout") {
          result.failureCoordinate = "S5_SCRIPT_LOAD_TIMEOUT";
        } else if (validation.globalPresent && !validation.contractOk) {
          result.failureCoordinate = "S7_CONTRACT_MISMATCH";
        } else {
          result.failureCoordinate = "S6_GLOBAL_ACTOR_MISSING";
        }

        resolve(result);
      };

      script.onload = () => settle("load", "");
      script.onerror = () => settle("error", "load-error");

      try {
        doc.head.appendChild(script);
        result.scriptElementAppended = true;
        result.failureCoordinate = "S3_SCRIPT_APPENDED";
      } catch (error) {
        result.error = error && error.message ? error.message : String(error);
        result.errorType = "append-error";
        result.failureCoordinate = "S3_SCRIPT_APPEND_FAILURE";
        resolve(result);
        return;
      }

      setTimeout(() => {
        settle("timeout", "script-load-timeout");
      }, options.timeoutMs || 6500);
    });
  }

  function loadManifestInOrder(items, options = {}) {
    const results = [];

    return items.reduce((chain, item) => {
      return chain.then(() => loadScriptDetailed(item, options).then((result) => {
        results.push(result);
        state.scriptMap[result.key] = result;
        state.scriptResults = results.slice();

        writeDataset({
          hearthRouteLastLoadedScriptKey: result.key,
          hearthRouteLastLoadedScriptContract: result.actualContract || "",
          hearthRouteLastLoadedScriptExpectedContract: result.expectedContract || "",
          hearthRouteLastLoadedScriptValidationOk: result.validationOk,
          hearthRouteLastLoadedScriptFailureCoordinate: result.failureCoordinate || ""
        });

        return result;
      }));
    }, Promise.resolve()).then(() => results);
  }

  function resolveHexAuthority() {
    const candidates = [
      root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY,
      root.HEARTH_HEX_FOUR_PAIR_AUTHORITY,
      root.HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY,
      root.HEARTH_HEX_HANDSHAKE_AUTHORITY,
      root.HEARTH_HEXGRID_AUTHORITY,
      root.HEARTH && root.HEARTH.hexFourPairAuthority,
      root.HEARTH && root.HEARTH.hexAuthority
    ];

    return candidates.find((candidate) => candidate && typeof candidate === "object") || null;
  }

  function validateHexFourPairAuthority() {
    const hex = resolveHexAuthority();

    const validation = {
      contract: CONTRACT,
      receipt: RECEIPT,
      expectedContract: EXPECTED.hexFourPair,
      path: PATHS.hexFourPair,
      authorityPresent: Boolean(hex),
      actualContract: contractOf(hex),
      actualReceipt: receiptOf(hex),
      contractOk: false,
      sampleOk: false,
      cellOk: false,
      fourPairOk: false,
      fourPairDirectionsOk: false,
      fourPairBodyBoundOk: false,
      wideProbeOk: false,
      wideProbeTotal: 0,
      wideProbeFailedCount: 0,
      northHandshake: false,
      southHandshake: false,
      eastHandshake: false,
      westHandshake: false,
      validationOk: false,
      status: "MISSING",
      failureCoordinate: "",
      error: "",
      sample: null,
      wideProbe: null,
      visualPassClaimed: false
    };

    validation.contractOk = Boolean(hex && contractOf(hex) === EXPECTED.hexFourPair);

    if (!hex) {
      validation.failureCoordinate = "H0_HEX_AUTHORITY_GLOBAL_MISSING";
      validation.status = "MISSING";
      return validation;
    }

    if (!validation.contractOk) {
      validation.failureCoordinate = "H1_HEX_AUTHORITY_CONTRACT_MISMATCH";
      validation.status = "DEGRADED";
    }

    try {
      if (typeof hex.sample === "function") {
        const sample = hex.sample({ u: 0.5, v: 0.5 });
        validation.sample = sample || null;
        validation.sampleOk = Boolean(sample && typeof sample === "object");
        validation.cellOk = Boolean(
          sample &&
          sample.cellId &&
          Number.isFinite(Number(sample.u)) &&
          Number.isFinite(Number(sample.v)) &&
          Number.isFinite(Number(sample.x)) &&
          Number.isFinite(Number(sample.y)) &&
          Number.isFinite(Number(sample.z))
        );

        validation.northHandshake = Boolean(sample && sample.north && sample.north.direction === "north");
        validation.southHandshake = Boolean(sample && sample.south && sample.south.direction === "south");
        validation.eastHandshake = Boolean(sample && sample.east && sample.east.direction === "east");
        validation.westHandshake = Boolean(sample && sample.west && sample.west.direction === "west");

        validation.fourPairDirectionsOk = Boolean(
          validation.northHandshake &&
          validation.southHandshake &&
          validation.eastHandshake &&
          validation.westHandshake
        );

        validation.fourPairOk = Boolean(
          sample &&
          sample.everyPixelHasFourPairSet === true &&
          Array.isArray(sample.fourPairSet) &&
          sample.fourPairSet.length === 4 &&
          validation.fourPairDirectionsOk
        );

        validation.fourPairBodyBoundOk = Boolean(
          sample &&
          sample.bodyBound === true &&
          sample.surfaceBound === true &&
          sample.floatsAboveBody === false &&
          sample.allowedToFloat === false
        );
      } else {
        validation.failureCoordinate = "H2_HEX_AUTHORITY_SAMPLE_METHOD_MISSING";
        validation.status = "DEGRADED";
      }
    } catch (error) {
      validation.error = error && error.message ? error.message : String(error);
      validation.failureCoordinate = "H3_HEX_AUTHORITY_SAMPLE_ERROR";
      validation.status = "DEGRADED";
    }

    try {
      if (typeof hex.wideProbe === "function") {
        const wideProbe = hex.wideProbe({ rows: 5, columns: 9 });
        validation.wideProbe = wideProbe || null;
        validation.wideProbeTotal = safeNumber(wideProbe && wideProbe.total, 0);
        validation.wideProbeFailedCount = safeNumber(wideProbe && wideProbe.failedCount, 0);
        validation.wideProbeOk = Boolean(
          wideProbe &&
          wideProbe.wideProbeReady === true &&
          wideProbe.everyPixelHasNorthSouthEastWest === true &&
          wideProbe.everyPixelHasFourPairSet === true &&
          validation.wideProbeTotal >= 25 &&
          validation.wideProbeFailedCount === 0
        );
      } else {
        validation.failureCoordinate = validation.failureCoordinate || "H4_HEX_AUTHORITY_WIDE_PROBE_METHOD_MISSING";
        validation.status = "DEGRADED";
      }
    } catch (error) {
      validation.error = validation.error || (error && error.message ? error.message : String(error));
      validation.failureCoordinate = validation.failureCoordinate || "H5_HEX_AUTHORITY_WIDE_PROBE_ERROR";
      validation.status = "DEGRADED";
    }

    validation.validationOk = Boolean(
      validation.authorityPresent &&
      validation.contractOk &&
      validation.sampleOk &&
      validation.cellOk &&
      validation.fourPairOk &&
      validation.fourPairBodyBoundOk &&
      validation.wideProbeOk
    );

    if (validation.validationOk) {
      validation.status = "PASS";
      validation.failureCoordinate = "H9_HEX_FOUR_PAIR_AUTHORITY_VALIDATED";
    } else if (!validation.failureCoordinate) {
      validation.status = "DEGRADED";
      validation.failureCoordinate = "H8_HEX_FOUR_PAIR_AUTHORITY_INCOMPLETE";
    }

    return validation;
  }

  function resolveCanvasApi() {
    return (
      root.HEARTH_CANVAS ||
      root.HearthCanvas ||
      (root.HEARTH && root.HEARTH.canvas) ||
      null
    );
  }

  function findMountTarget() {
    const doc = getDocument();
    if (!doc) {
      return {
        element: null,
        selector: "",
        created: false
      };
    }

    for (const selector of MOUNT_SELECTORS) {
      const found = doc.querySelector(selector);

      if (found) {
        return {
          element: found,
          selector,
          created: false
        };
      }
    }

    const parent =
      doc.querySelector("main") ||
      doc.querySelector("[role='main']") ||
      doc.body ||
      null;

    if (!parent) {
      return {
        element: null,
        selector: "",
        created: false
      };
    }

    const section = doc.createElement("section");
    section.dataset.hearthRouteCreatedMount = "true";
    section.dataset.hearthPlanetMount = "true";
    section.dataset.hearthCanvasMount = "true";
    section.dataset.hearthRouteContract = CONTRACT;
    section.dataset.hearthRouteReceipt = RECEIPT;
    section.style.position = "relative";
    section.style.display = "grid";
    section.style.placeItems = "center";
    section.style.width = "100%";
    section.style.minHeight = "320px";
    section.style.margin = "0 auto";
    section.style.overflow = "hidden";

    parent.appendChild(section);

    return {
      element: section,
      selector: "[data-hearth-route-created-mount]",
      created: true
    };
  }

  function validateParentChain() {
    const required = [
      "tectonics",
      "elevation",
      "composition",
      "hydrology",
      "materials"
    ];

    const checks = required.map((key) => {
      const manifest = SCRIPT_MANIFEST.find((item) => item.key === key);
      const validation = manifest ? validateManifestItem(manifest) : null;

      return {
        key,
        expectedContract: manifest ? manifest.expectedContract : "",
        actualContract: validation ? validation.actualContract : "",
        globalPresent: validation ? validation.globalPresent : false,
        contractOk: validation ? validation.contractOk : false,
        validationOk: validation ? validation.validationOk : false,
        required: false
      };
    });

    const loadedCount = checks.filter((item) => item.globalPresent).length;
    const validCount = checks.filter((item) => item.validationOk).length;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      chainOrder: [
        "hex-four-pair-authority",
        "tectonics",
        "elevation",
        "composition",
        "hydrology",
        "materials",
        "hex-surface",
        "canvas"
      ],
      tectonicsBeforeElevation: true,
      elevationBeforeComposition: true,
      hydrologyBeforeMaterials: true,
      loadedCount,
      validCount,
      total: checks.length,
      allLoaded: loadedCount === checks.length,
      allValid: validCount === checks.length,
      checks,
      parentChainFailureDoesNotEraseVisibleCarrier: true,
      visualPassClaimed: false
    };
  }

  function mountCanvas(options = {}) {
    const canvas = resolveCanvasApi();
    state.canvasApi = canvas;

    const result = {
      contract: CONTRACT,
      receipt: RECEIPT,
      canvasAuthorityPresent: Boolean(canvas),
      canvasActualContract: contractOf(canvas),
      canvasExpectedContract: EXPECTED.canvas,
      canvasContractOk: Boolean(canvas && contractOf(canvas) === EXPECTED.canvas),
      mountTargetFound: false,
      mountTargetSelector: "",
      createdMountTarget: false,
      mounted: false,
      controlsBound: false,
      imageRendered: false,
      error: "",
      visualPassClaimed: false
    };

    if (!canvas) {
      result.error = "HEARTH_CANVAS authority missing after route load.";
      return result;
    }

    const target = findMountTarget();

    result.mountTargetFound = Boolean(target.element);
    result.mountTargetSelector = target.selector || "";
    result.createdMountTarget = Boolean(target.created);

    state.mountTargetFound = result.mountTargetFound;
    state.mountTargetSelector = result.mountTargetSelector;
    state.createdMountTarget = result.createdMountTarget;

    if (!target.element) {
      result.error = "No Hearth mount target or fallback parent available.";
      return result;
    }

    try {
      if (typeof canvas.mount === "function") {
        const mountApi = canvas.mount(target.element, {
          size: options.size || 460,
          atlasWidth: options.atlasWidth || 384,
          atlasHeight: options.atlasHeight || 192,
          rowsPerChunk: options.rowsPerChunk || 2,
          allowLargeTexture: options.allowLargeTexture === true,
          routeContract: CONTRACT,
          routeReceipt: RECEIPT,
          requiredHexFourPairContract: EXPECTED.hexFourPair,
          hexFourPairAuthorityValidated: Boolean(state.hexValidation && state.hexValidation.validationOk),
          routeBlocksCanvasForHexMissing: false,
          onStatus(event, detail) {
            writeDataset({
              hearthRouteLastCanvasEvent: event || "",
              hearthRouteLastCanvasEventAt: nowIso(),
              hearthRouteLastCanvasEventContract: detail && detail.contract ? detail.contract : "",
              hearthRouteLastCanvasEventVisualPassClaimed: "false"
            });
          }
        });

        state.canvasMountApi = mountApi || null;

        result.mounted = Boolean(mountApi);
        result.controlsBound = Boolean(mountApi && (mountApi.controlsBound || mountApi.state && mountApi.state.controlsBound));
        result.imageRendered = Boolean(mountApi && mountApi.state && mountApi.state.imageRendered);

        if (mountApi && mountApi.canvas && mountApi.canvas.dataset) {
          mountApi.canvas.dataset.hearthClimateRouteContract = CONTRACT;
          mountApi.canvas.dataset.hearthClimateRouteReceipt = RECEIPT;
          mountApi.canvas.dataset.hearthClimateRoutePreviousContract = PREVIOUS_CONTRACT;
          mountApi.canvas.dataset.hearthClimateRouteBaselineContract = BASELINE_CONTRACT;
          mountApi.canvas.dataset.hearthHexFourPairAuthorityRequired = "true";
          mountApi.canvas.dataset.hearthHexFourPairAuthorityValidated = boolString(state.hexValidation && state.hexValidation.validationOk);
          mountApi.canvas.dataset.hearthRouteBlocksCanvasForHexMissing = "false";
          mountApi.canvas.dataset.hearthRouteNeverBlocksVisibleCarrierForHexMissing = "true";
          mountApi.canvas.dataset.rawSphereVisualContinuity = "true";
          mountApi.canvas.dataset.hexCenterVisualOverride = "false";
          mountApi.canvas.dataset.hexCenterOwnsInfluenceOnly = "true";
          mountApi.canvas.dataset.visualPassClaimed = "false";
        }

        return result;
      }

      if (typeof canvas.createShellFirstMount === "function") {
        const mountApi = canvas.createShellFirstMount(target.element, {
          size: options.size || 460,
          atlasWidth: options.atlasWidth || 384,
          atlasHeight: options.atlasHeight || 192,
          rowsPerChunk: options.rowsPerChunk || 2,
          allowLargeTexture: options.allowLargeTexture === true
        });

        state.canvasMountApi = mountApi || null;

        result.mounted = Boolean(mountApi);
        result.controlsBound = Boolean(mountApi && (mountApi.controlsBound || mountApi.state && mountApi.state.controlsBound));
        result.imageRendered = Boolean(mountApi && mountApi.state && mountApi.state.imageRendered);
        return result;
      }

      result.error = "HEARTH_CANVAS has no mount/createShellFirstMount method.";
      return result;
    } catch (error) {
      result.error = error && error.message ? error.message : String(error);
      return result;
    }
  }

  function calculateHandoff() {
    const hexOk = Boolean(state.hexValidation && state.hexValidation.validationOk);
    const canvasMounted = Boolean(state.canvasMountResult && state.canvasMountResult.mounted);
    const canvasContractOk = Boolean(state.canvasMountResult && state.canvasMountResult.canvasContractOk);
    const parent = state.parentChainStatus || {};
    const parentValid = Boolean(parent.validCount >= 3 || parent.allValid);

    if (canvasMounted && hexOk && canvasContractOk && parentValid) {
      return {
        status: "PASS",
        handoff: "FULL_PASS",
        coherentRouteLoad: true
      };
    }

    if (canvasMounted && canvasContractOk) {
      return {
        status: "DEGRADED_VISIBLE_CARRIER",
        handoff: "VISIBLE_CARRIER_PASS_HEX_OR_PARENT_DEGRADED",
        coherentRouteLoad: false
      };
    }

    return {
      status: "BLOCKED",
      handoff: "VISIBLE_CARRIER_NOT_MOUNTED",
      coherentRouteLoad: false
    };
  }

  function createReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-climate-route-hex-four-pair-full-renewal",
      status: state.status,
      handoff: state.handoff,
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      destinationFile: "/showroom/globe/hearth/hearth.climate.route.js",

      activeHexAuthority: PATHS.hexFourPair,
      activeCanvasAuthority: PATHS.canvas,
      expectedContracts: EXPECTED,

      routeLoadOrder: [
        "hex-four-pair-authority",
        "tectonics",
        "elevation",
        "composition",
        "hydrology",
        "materials",
        "hex-surface",
        "canvas"
      ],

      hexGate: {
        required: true,
        path: PATHS.hexFourPair,
        expectedContract: EXPECTED.hexFourPair,
        loadedBeforeRouteValidation: true,
        validation: state.hexValidation,
        routeBlocksCanvasForHexMissing: false,
        routeNeverBlocksVisibleCarrierForHexMissing: true
      },

      rawContinuityLaw: {
        rawSpherePositionOwnsVisualContinuity: true,
        hexCenterOwnsInfluenceOnly: true,
        hexCenterVisualOverride: false,
        fourPairHandshakeOwnsLandTruth: false,
        fourPairHandshakeOwnsWaterTruth: false,
        fourPairHandshakeOwnsAirTruth: false
      },

      parentChainStatus: state.parentChainStatus,
      canvasMountResult: state.canvasMountResult,
      scriptResults: state.scriptResults,

      owns: [
        "route-load-order",
        "hex-four-pair-authority-loading",
        "hex-four-pair-authority-validation",
        "parent-chain-script-loading",
        "canvas-authority-loading",
        "visible-carrier-mount-handoff",
        "route-dataset-receipts"
      ],

      doesNotOwn: [
        "land truth",
        "water truth",
        "air truth",
        "hydrology truth",
        "elevation generation",
        "material palette generation",
        "canvas drawing",
        "runtime motion",
        "controls",
        "final visual pass claim"
      ],

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeOwnedLandGeneration: false,
      routeOwnedWaterGeneration: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  function publishStatus() {
    state.updatedAt = nowIso();

    const hex = state.hexValidation || {};
    const canvas = state.canvasMountResult || {};
    const parent = state.parentChainStatus || {};

    writeDataset({
      hearthClimateRouteLoaded: "true",
      hearthClimateRouteContract: CONTRACT,
      hearthClimateRouteReceipt: RECEIPT,
      hearthClimateRoutePreviousContract: PREVIOUS_CONTRACT,
      hearthClimateRouteBaselineContract: BASELINE_CONTRACT,
      hearthClimateRouteVersion: VERSION,

      hearthActiveRouteContract: CONTRACT,
      activeRouteContract: CONTRACT,
      hearthActiveRouteFile: "/showroom/globe/hearth/hearth.climate.route.js",

      hearthRouteStatus: state.status,
      hearthRouteHandoff: state.handoff,
      hearthRouteBootStarted: state.bootStarted,
      hearthRouteBootComplete: state.bootComplete,
      hearthRouteBootError: state.bootError,
      hearthRouteUpdatedAt: state.updatedAt,

      hearthRouteLoadOrder: "hex-four-pair-authority,tectonics,elevation,composition,hydrology,materials,hex-surface,canvas",
      hearthRouteHexAuthorityLoadedBeforeValidation: "true",

      hearthHexFourPairAuthorityRequired: "true",
      hearthHexFourPairAuthorityPath: PATHS.hexFourPair,
      hearthHexFourPairAuthorityExpectedContract: EXPECTED.hexFourPair,
      hearthHexFourPairAuthorityPresent: Boolean(hex.authorityPresent),
      hearthHexFourPairAuthorityActualContract: hex.actualContract || "",
      hearthHexFourPairAuthorityContractOk: Boolean(hex.contractOk),
      hearthHexFourPairAuthoritySampleOk: Boolean(hex.sampleOk),
      hearthHexFourPairAuthorityCellOk: Boolean(hex.cellOk),
      hearthHexFourPairAuthorityFourPairOk: Boolean(hex.fourPairOk),
      hearthHexFourPairAuthorityFourPairDirectionsOk: Boolean(hex.fourPairDirectionsOk),
      hearthHexFourPairAuthorityBodyBoundOk: Boolean(hex.fourPairBodyBoundOk),
      hearthHexFourPairAuthorityWideProbeOk: Boolean(hex.wideProbeOk),
      hearthHexFourPairAuthorityWideProbeTotal: safeNumber(hex.wideProbeTotal, 0),
      hearthHexFourPairAuthorityWideProbeFailedCount: safeNumber(hex.wideProbeFailedCount, 0),
      hearthHexFourPairAuthorityValidationOk: Boolean(hex.validationOk),
      hearthHexFourPairAuthorityStatus: hex.status || "UNKNOWN",
      hearthHexFourPairAuthorityFailureCoordinate: hex.failureCoordinate || "",
      hearthHexFourPairAuthorityError: hex.error || "",

      hearthHexNorthHandshake: Boolean(hex.northHandshake),
      hearthHexSouthHandshake: Boolean(hex.southHandshake),
      hearthHexEastHandshake: Boolean(hex.eastHandshake),
      hearthHexWestHandshake: Boolean(hex.westHandshake),
      hearthHexEveryPixelHasNorthSouthEastWest: Boolean(hex.fourPairDirectionsOk),
      hearthHexEveryPixelHasFourPairSet: Boolean(hex.fourPairOk),
      hearthHexBodyBoundHandshake: Boolean(hex.fourPairBodyBoundOk),

      hearthRouteBlocksCanvasForHexMissing: "false",
      hearthRouteNeverBlocksVisibleCarrierForHexMissing: "true",
      childFailureDoesNotEraseVisualization: "true",

      rawSpherePositionOwnsVisualContinuity: "true",
      hexCenterOwnsInfluenceOnly: "true",
      hexCenterVisualOverride: "false",

      hearthParentChainLoadedCount: safeNumber(parent.loadedCount, 0),
      hearthParentChainValidCount: safeNumber(parent.validCount, 0),
      hearthParentChainAllLoaded: Boolean(parent.allLoaded),
      hearthParentChainAllValid: Boolean(parent.allValid),
      hearthParentChainFailureDoesNotEraseVisibleCarrier: "true",

      hearthCanvasAuthorityPresent: Boolean(canvas.canvasAuthorityPresent),
      hearthCanvasExpectedContract: EXPECTED.canvas,
      hearthCanvasActualContract: canvas.canvasActualContract || "",
      hearthCanvasContractOk: Boolean(canvas.canvasContractOk),
      hearthVisibleGlobeMounted: Boolean(canvas.mounted),
      hearthVisiblePlanetCarrier: Boolean(canvas.mounted),
      hearthCanvasFound: Boolean(canvas.canvasAuthorityPresent),
      hearthControlsBound: Boolean(canvas.controlsBound),
      hearthCanvasMountTargetFound: Boolean(canvas.mountTargetFound),
      hearthCanvasMountTargetSelector: canvas.mountTargetSelector || "",
      hearthCanvasMountCreated: Boolean(canvas.createdMountTarget),
      hearthCanvasMountError: canvas.error || "",

      generatedImage: "false",
      graphicBox: "false",
      webgl: "false",
      routeOwnedLandGeneration: "false",
      routeOwnedWaterGeneration: "false",
      routeMutation: "false",
      runtimeMutation: "false",
      controlsMutation: "false",
      visualPassClaimed: "false"
    });

    root.HEARTH_CLIMATE_ROUTE_RECEIPT = createReceipt();
    root.HEARTH_CLIMATE_ROUTE_STATUS = {
      contract: CONTRACT,
      receipt: RECEIPT,
      status: state.status,
      handoff: state.handoff,
      hexValidation: state.hexValidation,
      parentChainStatus: state.parentChainStatus,
      canvasMountResult: state.canvasMountResult,
      scriptResults: state.scriptResults,
      updatedAt: state.updatedAt,
      visualPassClaimed: false
    };

    return root.HEARTH_CLIMATE_ROUTE_STATUS;
  }

  function boot(options = {}) {
    if (state.bootStarted && !options.force) {
      return Promise.resolve(publishStatus());
    }

    state.bootStarted = true;
    state.bootComplete = false;
    state.bootError = "";
    state.status = "LOADING";
    state.handoff = "PENDING";
    state.updatedAt = nowIso();

    writeDataset({
      hearthClimateRouteLoaded: "true",
      hearthClimateRouteContract: CONTRACT,
      hearthClimateRouteReceipt: RECEIPT,
      hearthClimateRouteBootStarted: "true",
      hearthClimateRouteBootComplete: "false",
      hearthClimateRouteVersion: VERSION,
      hearthRouteLoadOrder: "hex-four-pair-authority,tectonics,elevation,composition,hydrology,materials,hex-surface,canvas",
      hearthRouteHexAuthorityLoadedBeforeValidation: "true",
      hearthRouteBlocksCanvasForHexMissing: "false",
      hearthRouteNeverBlocksVisibleCarrierForHexMissing: "true",
      rawSpherePositionOwnsVisualContinuity: "true",
      hexCenterOwnsInfluenceOnly: "true",
      hexCenterVisualOverride: "false",
      visualPassClaimed: "false"
    });

    const hexManifest = SCRIPT_MANIFEST.filter((item) => item.key === "hexFourPair");
    const remainingManifest = SCRIPT_MANIFEST.filter((item) => item.key !== "hexFourPair");

    return loadManifestInOrder(hexManifest, options)
      .then(() => {
        state.hexValidation = validateHexFourPairAuthority();
        publishStatus();

        return loadManifestInOrder(remainingManifest, options);
      })
      .then(() => {
        state.hexValidation = validateHexFourPairAuthority();
        state.parentChainStatus = validateParentChain();
        state.canvasMountResult = mountCanvas(options);

        const handoff = calculateHandoff();

        state.status = handoff.status;
        state.handoff = handoff.handoff;
        state.routeMounted = Boolean(state.canvasMountResult && state.canvasMountResult.mounted);
        state.bootComplete = true;

        publishStatus();

        return root.HEARTH_CLIMATE_ROUTE_STATUS;
      })
      .catch((error) => {
        state.bootError = error && error.message ? error.message : String(error);
        state.status = "ERROR";
        state.handoff = "ROUTE_BOOT_ERROR";
        state.bootComplete = false;

        publishStatus();

        return root.HEARTH_CLIMATE_ROUTE_STATUS;
      });
  }

  function getStatus() {
    return publishStatus();
  }

  function getReceipt() {
    return createReceipt();
  }

  function remount(options = {}) {
    state.canvasMountResult = mountCanvas({
      ...options,
      force: true
    });

    const handoff = calculateHandoff();

    state.status = handoff.status;
    state.handoff = handoff.handoff;
    state.routeMounted = Boolean(state.canvasMountResult && state.canvasMountResult.mounted);

    return publishStatus();
  }

  function validate() {
    state.hexValidation = validateHexFourPairAuthority();
    state.parentChainStatus = validateParentChain();

    const handoff = calculateHandoff();

    state.status = handoff.status;
    state.handoff = handoff.handoff;

    return publishStatus();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    authority: "hearth-climate-route-hex-four-pair-full-renewal",

    boot,
    validate,
    remount,
    getStatus,
    getReceipt,

    validateHexFourPairAuthority,
    validateParentChain,
    mountCanvas,
    resolveHexAuthority,
    resolveCanvasApi,

    expectedContracts: EXPECTED,
    paths: PATHS,
    scriptManifest: SCRIPT_MANIFEST,

    routeLoadOrder: [
      "hex-four-pair-authority",
      "tectonics",
      "elevation",
      "composition",
      "hydrology",
      "materials",
      "hex-surface",
      "canvas"
    ],

    hexFourPairAuthorityRequired: true,
    hexAuthorityLoadedBeforeValidation: true,
    routeBlocksCanvasForHexMissing: false,
    routeNeverBlocksVisibleCarrierForHexMissing: true,
    childFailureDoesNotEraseVisualization: true,

    rawSpherePositionOwnsVisualContinuity: true,
    hexCenterOwnsInfluenceOnly: true,
    hexCenterVisualOverride: false,

    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsAirTruth: false,
    ownsCanvasDrawing: false,
    ownsRuntimeMotion: false,
    ownsControls: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    routeOwnedLandGeneration: false,
    routeOwnedWaterGeneration: false,
    runtimeMutation: false,
    controlsMutation: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.climateRoute = api;
  root.HEARTH.activeRoute = api;

  root.HEARTH_CLIMATE_ROUTE = api;
  root.HEARTH_ACTIVE_ROUTE = api;
  root.HEARTH_CLIMATE_ROUTE_CONTRACT = CONTRACT;
  root.HEARTH_CLIMATE_ROUTE_RECEIPT = getReceipt();

  writeDataset({
    hearthClimateRouteLoaded: "true",
    hearthClimateRouteContract: CONTRACT,
    hearthClimateRouteReceipt: RECEIPT,
    hearthClimateRoutePreviousContract: PREVIOUS_CONTRACT,
    hearthClimateRouteBaselineContract: BASELINE_CONTRACT,
    hearthClimateRouteVersion: VERSION,
    hearthActiveRouteContract: CONTRACT,
    activeRouteContract: CONTRACT,
    hearthActiveRouteFile: "/showroom/globe/hearth/hearth.climate.route.js",
    hearthRouteHexAuthorityLoadedBeforeValidation: "true",
    hearthRouteBlocksCanvasForHexMissing: "false",
    hearthRouteNeverBlocksVisibleCarrierForHexMissing: "true",
    rawSpherePositionOwnsVisualContinuity: "true",
    hexCenterOwnsInfluenceOnly: "true",
    hexCenterVisualOverride: "false",
    generatedImage: "false",
    graphicBox: "false",
    webgl: "false",
    visualPassClaimed: "false"
  });

  function autoBoot() {
    boot({
      timeoutMs: 6500,
      size: 460,
      atlasWidth: 384,
      atlasHeight: 192,
      rowsPerChunk: 2
    });
  }

  if (getDocument()) {
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
    } else {
      setTimeout(autoBoot, 0);
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
