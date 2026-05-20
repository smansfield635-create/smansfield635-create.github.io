// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_6_CONTINENTS_GRATITUDE_HYDROLOGY_RENDER_ADAPTER_TNT_v1
// Full-file replacement.
// Purpose: consume Gratitude topology + Gratitude downstream hydrology and render sea-level integration so Gratitude stops reading as a flat ornament.
// Parent-facing admission contract intentionally remains AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1 for route-bridge compatibility.
// Segment 1 remains active: Gratitude only. The other eight Summit children remain staged.
// Does not own: parent geometry, canvas creation, route bridge, runtime, FORM_VISIBLE, parent ocean body, global ocean ownership, sky, motion, elevation, height maps, mountains, animals, plants, climate, water physics, zoom, orbit, generated image, GraphicBox, or final visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const INTERNAL_CONTRACT = "AUDRALIA_G2_6_CONTINENTS_GRATITUDE_HYDROLOGY_RENDER_ADAPTER_TNT_v1";
  const PREVIOUS_INTERNAL_CONTRACT = "AUDRALIA_G2_6_CONTINENTS_CHILD_LOAD_AND_DRAW_RECEIPT_ALIGNMENT_TNT_v1";
  const CHILD_SPLIT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_TNT_v1";
  const SEGMENT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_SEGMENT_1_TNT_v1";
  const CHAIN_CONTRACT = "AUDRALIA_G2_6_SINGLE_CACHE_NONCE_CHAIN_ALIGNMENT_TNT_v1";
  const PARENT_COMPLIANCE_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const FAMILY = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents.js";
  const ROUTE = "/showroom/globe/audralia/";

  const GRATITUDE_TOPOLOGY_CONTRACT = "AUDRALIA_G2_6_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_CHILD_TNT_v1";
  const GRATITUDE_HYDROLOGY_CONTRACT = "AUDRALIA_G2_6_GRATITUDE_DOWNSTREAM_HYDROLOGY_SEA_LEVEL_INTEGRATION_TNT_v1";

  const DEG = Math.PI / 180;
  const TAU = Math.PI * 2;

  const TOTAL_LATTICE_CELLS = 256;
  const EXPOSED_LAND_CELLS = 89;
  const OCEAN_SEA_SHELF_CELLS = 167;
  const EXPOSED_LAND_RATIO = EXPOSED_LAND_CELLS / TOTAL_LATTICE_CELLS;
  const OCEAN_SEA_RATIO = OCEAN_SEA_SHELF_CELLS / TOTAL_LATTICE_CELLS;

  const LAND_ELEVATION = -0.004;
  const TOPOLOGY_MARK_ELEVATION = -0.0032;
  const HYDROLOGY_ELEVATION = -0.0038;

  const ACTIVE_CHILD_TIMEOUT_MS = 3400;
  const HYDROLOGY_TIMEOUT_MS = 3400;
  const POLL_MS = 50;

  const CHILDREN = Object.freeze([
    {
      id: "gratitude",
      summit: "Gratitude",
      cells: 21,
      active: true,
      requiredForVisual: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js",
      globalKey: "AUDRALIA_TOPOLOGY_GRATITUDE",
      expectedContracts: [
        GRATITUDE_TOPOLOGY_CONTRACT,
        "AUDRALIA_G2_6_GRATITUDE_FULL_TOPOLOGY_GROUND_BASIS_CHILD_TNT_v1",
        "AUDRALIA_G2_6_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_CHILD_TNT_v1",
        "AUDRALIA_G2_6_TOPOLOGY_ONLY_GRATITUDE_CHILD_TNT_v1"
      ],
      hydrology: {
        enabled: true,
        path: "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.hydrology.js",
        globalKey: "AUDRALIA_GRATITUDE_HYDROLOGY",
        expectedContract: GRATITUDE_HYDROLOGY_CONTRACT
      }
    },
    {
      id: "generosity",
      summit: "Generosity",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/generosity.js",
      globalKey: "AUDRALIA_TOPOLOGY_GENEROSITY",
      expectedContracts: [],
      hydrology: { enabled: false }
    },
    {
      id: "dependability",
      summit: "Dependability",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/dependability.js",
      globalKey: "AUDRALIA_TOPOLOGY_DEPENDABILITY",
      expectedContracts: [],
      hydrology: { enabled: false }
    },
    {
      id: "accountability",
      summit: "Accountability",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/accountability.js",
      globalKey: "AUDRALIA_TOPOLOGY_ACCOUNTABILITY",
      expectedContracts: [],
      hydrology: { enabled: false }
    },
    {
      id: "forgiveness",
      summit: "Forgiveness",
      cells: 8,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/forgiveness.js",
      globalKey: "AUDRALIA_TOPOLOGY_FORGIVENESS",
      expectedContracts: [],
      hydrology: { enabled: false }
    },
    {
      id: "humility",
      summit: "Humility",
      cells: 8,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/humility.js",
      globalKey: "AUDRALIA_TOPOLOGY_HUMILITY",
      expectedContracts: [],
      hydrology: { enabled: false }
    },
    {
      id: "self-control",
      summit: "Self-Control",
      cells: 5,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/self-control.js",
      globalKey: "AUDRALIA_TOPOLOGY_SELF_CONTROL",
      expectedContracts: [],
      hydrology: { enabled: false }
    },
    {
      id: "patience",
      summit: "Patience",
      cells: 5,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/patience.js",
      globalKey: "AUDRALIA_TOPOLOGY_PATIENCE",
      expectedContracts: [],
      hydrology: { enabled: false }
    },
    {
      id: "purity",
      summit: "Purity",
      cells: 3,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/purity.js",
      globalKey: "AUDRALIA_TOPOLOGY_PURITY",
      expectedContracts: [],
      hydrology: { enabled: false }
    }
  ]);

  const SUMMITS = Object.freeze(CHILDREN.map((child) => child.summit));

  const COLORS = Object.freeze({
    land: "rgba(62, 168, 108, 0.72)",
    landInterior: "rgba(72, 186, 116, 0.54)",
    landStroke: "rgba(235, 250, 236, 0.24)",

    shelf: "rgba(70, 190, 226, 0.20)",
    shelfStrong: "rgba(78, 205, 236, 0.28)",
    coastalBlend: "rgba(125, 222, 226, 0.22)",
    beach: "rgba(240, 222, 150, 0.54)",
    cliffEdge: "rgba(214, 216, 192, 0.54)",
    cavernMouth: "rgba(14, 18, 28, 0.72)",

    lake: "rgba(64, 190, 226, 0.50)",
    lakeEdge: "rgba(178, 244, 255, 0.28)",
    bay: "rgba(86, 210, 236, 0.48)",
    inlet: "rgba(120, 232, 242, 0.52)",
    peninsula: "rgba(125, 210, 134, 0.36)",
    lagoon: "rgba(112, 224, 224, 0.46)",
    wetland: "rgba(120, 188, 132, 0.46)",
    repairedWaterline: "rgba(132, 216, 206, 0.36)",
    hardWaterline: "rgba(215, 242, 248, 0.42)",
    waterlineShadow: "rgba(0, 12, 34, 0.26)"
  });

  const state = {
    contract: CONTRACT,
    internalContract: INTERNAL_CONTRACT,
    previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
    childSplitContract: CHILD_SPLIT_CONTRACT,
    segmentContract: SEGMENT_CONTRACT,
    chainContract: CHAIN_CONTRACT,
    parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,

    cacheNonce: "",
    active: true,
    classicScript: true,
    segment: 1,

    topologyOnly: true,
    hydrologyAdapterActive: true,
    hydrologyChildrenEnabled: true,
    terrainOwned: false,
    elevationOwned: false,
    ownsCanvas: false,
    ownsFormVisible: false,
    ownsOcean: false,
    ownsGlobalOcean: false,
    ownsRoute: false,
    waterPhysicsOwned: false,

    parentCompliance: true,
    parentFacingContractUnchanged: true,
    childObeysParentStandard: true,
    acceptsParentPayloadOnly: true,

    nineSummits256FibonacciModel: true,
    summitCount: 9,
    continentBodyCount: 9,
    totalLatticeCells: TOTAL_LATTICE_CELLS,
    exposedLandCells: EXPOSED_LAND_CELLS,
    oceanSeaShelfCells: OCEAN_SEA_SHELF_CELLS,
    exposedLandRatio: EXPOSED_LAND_RATIO,
    oceanSeaRatio: OCEAN_SEA_RATIO,
    primarySummit: "Gratitude",

    globalPublished: false,
    mountCalled: false,
    drawCount: 0,
    activeDrawnBodies: 0,
    activeTopologyCount: 0,

    childLoadStarted: false,
    childLoadComplete: false,
    activeChildLoadComplete: false,
    childVisualReady: false,
    childDrawAuthoritative: true,
    wrapperOnlyValid: false,

    hydrologyLoadStarted: false,
    hydrologyLoadComplete: false,
    hydrologyLoaded: false,
    hydrologyContractValid: false,
    hydrologyReadSucceeded: false,
    hydrologyVisualConsumed: false,
    hydrologyRenderPassCount: 0,
    activeHydrologyChildren: [],
    seaLevelZoneCount: 0,
    gratitudeHydrologyContract: "",
    gratitudeHydrologySource: "",
    renderAdapterRequired: false,

    lastParentContractSeen: "",
    lastDrawSkippedReason: "",
    lastDrawSummary: null,
    lastLoadSummary: null,
    lastHydrologySummary: null,

    childStatuses: {},
    childContracts: {},
    childSources: {},
    topologies: {},
    topologyErrors: {},

    hydrologyStatuses: {},
    hydrologyContracts: {},
    hydrologySources: {},
    hydrologies: {},
    hydrologyErrors: {},

    errors: [],

    visualPassClaim: false
  };

  const loadPromises = new Map();
  const hydrologyLoadPromises = new Map();

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function hasDocument() {
    return typeof document !== "undefined";
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function toRad(degrees) {
    return degrees * DEG;
  }

  function safeCall(fn, fallback) {
    try {
      return fn();
    } catch (_error) {
      return fallback;
    }
  }

  function getOwnScriptNonce() {
    if (!hasDocument()) return "";

    try {
      const scripts = Array.from(document.scripts);
      const own = scripts.reverse().find((script) => {
        const src = script.getAttribute("src") || "";
        return src.includes("/assets/audralia/clean/engine/audralia/engine/continents.js");
      });

      if (!own) return "";

      return new URL(own.src, window.location.href).searchParams.get("v") || "";
    } catch (_error) {
      return "";
    }
  }

  function getOrCreateCacheNonce() {
    if (!hasWindow() || !hasDocument()) {
      state.cacheNonce = state.cacheNonce || `${CHAIN_CONTRACT}__${Date.now()}`;
      return state.cacheNonce;
    }

    const root = document.documentElement;

    const nonce =
      state.cacheNonce ||
      (window.AUDRALIA_PAGE_CACHE_NONCE ? String(window.AUDRALIA_PAGE_CACHE_NONCE) : "") ||
      root.getAttribute("data-audralia-page-cache-nonce") ||
      root.getAttribute("data-audralia-route-bridge-cache-key") ||
      (window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT && window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey
        ? String(window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey)
        : "") ||
      getOwnScriptNonce() ||
      `${CHAIN_CONTRACT}__${Date.now()}__${Math.random().toString(36).slice(2, 8)}`;

    state.cacheNonce = nonce;
    window.AUDRALIA_PAGE_CACHE_NONCE = nonce;
    root.setAttribute("data-audralia-page-cache-nonce", nonce);
    root.setAttribute("data-audralia-single-cache-nonce-chain", "true");

    return nonce;
  }

  function childUrl(path) {
    return `${path}?v=${encodeURIComponent(getOrCreateCacheNonce())}`;
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.errors.push({ scope, message, time: nowIso() });
    publishReceipt(scope);
  }

  function setChildStatus(child, status, detail = "") {
    state.childStatuses[child.id] = status;
    if (detail) state.topologyErrors[child.id] = detail;
    publishReceipt(`child-${child.id}-${status}`);
  }

  function setHydrologyStatus(child, status, detail = "") {
    state.hydrologyStatuses[child.id] = status;
    if (detail) state.hydrologyErrors[child.id] = detail;
    publishReceipt(`hydrology-${child.id}-${status}`);
  }

  function parseRgba(color) {
    const match = String(color || "").match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);

    if (!match) return { r: 255, g: 255, b: 255, a: 1 };

    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4])
    };
  }

  function withAlpha(color, multiplier = 1, maxAlpha = 1) {
    const rgba = parseRgba(color);
    const alpha = clamp(Math.min(rgba.a, maxAlpha) * multiplier, 0, maxAlpha);
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
  }

  function depthAlpha(z, minVisible = 0.025, fullStrength = 0.38) {
    if (!Number.isFinite(z) || z <= minVisible) return 0;
    if (z >= fullStrength) return 1;

    const t = (z - minVisible) / Math.max(0.0001, fullStrength - minVisible);
    return clamp(t * t * (3 - 2 * t), 0, 1);
  }

  function validPayload(ctx, payload) {
    const valid = Boolean(
      ctx &&
        payload &&
        payload.geometry &&
        payload.project &&
        typeof payload.project === "function" &&
        Number.isFinite(payload.geometry.cx) &&
        Number.isFinite(payload.geometry.cy) &&
        Number.isFinite(payload.geometry.radius) &&
        payload.geometry.radius > 0
    );

    if (!valid) state.lastDrawSkippedReason = "invalid_parent_payload";

    return valid;
  }

  function parentContractSeen(payload) {
    const value =
      (payload && payload.contract) ||
      (payload && payload.state && payload.state.contract) ||
      "";

    state.lastParentContractSeen = String(value || "");

    return state.lastParentContractSeen;
  }

  function projectPoint(payload, lonDeg, latDeg, elevation = LAND_ELEVATION) {
    return payload.project(toRad(lonDeg), toRad(latDeg), elevation);
  }

  function projectBoundary(payload, boundary, elevation = LAND_ELEVATION) {
    return (boundary || []).map((point) => ({
      ...projectPoint(payload, Number(point.lon), Number(point.lat), elevation),
      lon: Number(point.lon),
      lat: Number(point.lat)
    }));
  }

  function averageLonLat(boundary) {
    if (!Array.isArray(boundary) || !boundary.length) {
      return { lon: 0, lat: 0 };
    }

    return boundary.reduce(
      (acc, point, index, array) => {
        acc.lon += Number(point.lon || 0) / array.length;
        acc.lat += Number(point.lat || 0) / array.length;
        return acc;
      },
      { lon: 0, lat: 0 }
    );
  }

  function averageProjected(payload, boundary, elevation = LAND_ELEVATION) {
    const avg = averageLonLat(boundary);
    return projectPoint(payload, avg.lon, avg.lat, elevation);
  }

  function projectedVisibility(points) {
    if (!Array.isArray(points) || !points.length) {
      return {
        visible: [],
        frontish: [],
        ratio: 0,
        frontRatio: 0
      };
    }

    const visible = points.filter((point) => point.visible && point.z > -0.08);
    const frontish = points.filter((point) => point.visible && point.z > 0.02);

    return {
      visible,
      frontish,
      ratio: visible.length / points.length,
      frontRatio: frontish.length / points.length
    };
  }

  function shapeVisibilityOk(points, minRatio = 0.28) {
    const visibility = projectedVisibility(points);
    return visibility.visible.length >= 3 && visibility.ratio >= minRatio;
  }

  function drawClosedPath(ctx, points) {
    if (!points || points.length < 3) return false;

    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();

    return true;
  }

  function segmentPoints(boundary, start, end) {
    if (!Array.isArray(boundary) || !boundary.length) return [];

    const count = boundary.length;
    const a = Math.max(0, Math.min(count - 1, Number(start) || 0));
    const b = Math.max(0, Math.min(count - 1, Number(end) || 0));

    if (a <= b) return boundary.slice(a, b + 1);

    return boundary.slice(a).concat(boundary.slice(0, b + 1));
  }

  function scaleBoundaryTowardCenter(boundary, scale = 0.92) {
    if (!Array.isArray(boundary) || !boundary.length) return [];

    const center = averageLonLat(boundary);

    return boundary.map((point) => ({
      lon: center.lon + (Number(point.lon) - center.lon) * scale,
      lat: center.lat + (Number(point.lat) - center.lat) * scale
    }));
  }

  function normalizeHydrologyBoundary(entry, fallbackBoundary = []) {
    if (entry && Array.isArray(entry.boundary) && entry.boundary.length) {
      return entry.boundary;
    }

    if (
      entry &&
      entry.profile &&
      Array.isArray(entry.profile.sourceBoundary) &&
      entry.profile.sourceBoundary.length
    ) {
      return entry.profile.sourceBoundary;
    }

    return fallbackBoundary;
  }

  function readChildGlobal(child) {
    if (!hasWindow()) return null;
    return window[child.globalKey] || null;
  }

  function readHydrologyGlobal(child) {
    if (!hasWindow() || !child.hydrology || !child.hydrology.globalKey) return null;
    return window[child.hydrology.globalKey] || null;
  }

  function childContract(api, topology) {
    const status =
      api && typeof api.getStatus === "function"
        ? safeCall(() => api.getStatus(), null)
        : api && typeof api.status === "function"
          ? safeCall(() => api.status(), null)
          : null;

    return (
      (status && status.contract) ||
      (api && api.CONTRACT) ||
      (topology && topology.contract) ||
      ""
    );
  }

  function hydrologyContract(api, hydrology) {
    const status =
      api && typeof api.getStatus === "function"
        ? safeCall(() => api.getStatus(), null)
        : api && typeof api.status === "function"
          ? safeCall(() => api.status(), null)
          : null;

    return (
      (status && status.contract) ||
      (api && api.CONTRACT) ||
      (hydrology && hydrology.contract) ||
      ""
    );
  }

  function validateTopologyObject(child, topology) {
    if (!topology || typeof topology !== "object") {
      return "missing_topology_object";
    }

    if (!Array.isArray(topology.landmasses)) {
      return "missing_landmasses_array";
    }

    if (!topology.landmasses.length) {
      return "empty_landmasses_array";
    }

    for (const landmass of topology.landmasses) {
      if (!landmass || typeof landmass !== "object") {
        return "invalid_landmass_object";
      }

      if (!Array.isArray(landmass.boundary)) {
        return `landmass_${landmass.id || "unknown"}_missing_boundary`;
      }

      if (landmass.boundary.length < 3) {
        return `landmass_${landmass.id || "unknown"}_boundary_too_short`;
      }
    }

    if (child.id === "gratitude" && topology.summit !== "Gratitude") {
      return "gratitude_child_returned_wrong_summit";
    }

    return "";
  }

  function validateHydrologyObject(child, hydrology) {
    if (!child.hydrology || !child.hydrology.enabled) {
      return "hydrology_not_enabled";
    }

    if (!hydrology || typeof hydrology !== "object") {
      return "missing_hydrology_object";
    }

    if (child.id === "gratitude" && hydrology.continent !== "Gratitude") {
      return "gratitude_hydrology_returned_wrong_continent";
    }

    if (!Array.isArray(hydrology.seaLevelZones)) {
      return "missing_sea_level_zones";
    }

    if (!hydrology.renderHints || typeof hydrology.renderHints !== "object") {
      return "missing_render_hints";
    }

    return "";
  }

  function normalizeTopology(child, api) {
    if (!api) return null;

    let topology = null;

    try {
      if (typeof api.getTopology === "function") {
        topology = api.getTopology();
      } else if (api.topology && typeof api.topology === "object") {
        topology = api.topology;
      }
    } catch (error) {
      recordError(`child.${child.id}.getTopology`, error);
      return null;
    }

    const invalidReason = validateTopologyObject(child, topology);

    if (invalidReason) {
      state.topologyErrors[child.id] = invalidReason;
      return null;
    }

    return topology;
  }

  function normalizeHydrology(child, api) {
    if (!api) return null;

    let hydrology = null;

    try {
      if (typeof api.getHydrology === "function") {
        hydrology = api.getHydrology();
      } else if (api.hydrology && typeof api.hydrology === "object") {
        hydrology = api.hydrology;
      }
    } catch (error) {
      recordError(`hydrology.${child.id}.getHydrology`, error);
      return null;
    }

    const invalidReason = validateHydrologyObject(child, hydrology);

    if (invalidReason) {
      state.hydrologyErrors[child.id] = invalidReason;
      return null;
    }

    return hydrology;
  }

  function syncAlreadyPublishedChild(child) {
    const api = readChildGlobal(child);

    if (!api) return false;

    const topology = normalizeTopology(child, api);

    if (!topology) {
      setChildStatus(child, "invalid_topology", state.topologyErrors[child.id] || "invalid topology");
      return false;
    }

    const contract = childContract(api, topology);

    state.topologies[child.id] = topology;
    state.childContracts[child.id] = contract || "unknown";
    state.childSources[child.id] = "published-global";
    setChildStatus(child, "active", "published global topology accepted");

    return true;
  }

  function syncAlreadyPublishedHydrology(child) {
    if (!child.hydrology || !child.hydrology.enabled) return false;

    const api = readHydrologyGlobal(child);

    if (!api) return false;

    const hydrology = normalizeHydrology(child, api);

    if (!hydrology) {
      setHydrologyStatus(child, "invalid_hydrology", state.hydrologyErrors[child.id] || "invalid hydrology");
      return false;
    }

    const contract = hydrologyContract(api, hydrology);

    state.hydrologies[child.id] = hydrology;
    state.hydrologyContracts[child.id] = contract || "unknown";
    state.hydrologySources[child.id] = "published-global";

    if (child.id === "gratitude") {
      state.hydrologyLoaded = true;
      state.hydrologyContractValid = contract === GRATITUDE_HYDROLOGY_CONTRACT;
      state.hydrologyReadSucceeded = true;
      state.gratitudeHydrologyContract = contract || "unknown";
      state.gratitudeHydrologySource = "published-global";
      state.seaLevelZoneCount = Array.isArray(hydrology.seaLevelZones) ? hydrology.seaLevelZones.length : 0;
    }

    if (!state.activeHydrologyChildren.includes(child.id)) {
      state.activeHydrologyChildren.push(child.id);
    }

    setHydrologyStatus(child, "active", "published hydrology accepted");

    return true;
  }

  function scriptAlreadyLoaded(path) {
    if (!hasDocument()) return false;

    const expected = childUrl(path);

    return Array.from(document.scripts).some((script) => {
      const src = script.getAttribute("src") || "";
      return src === expected;
    });
  }

  function loadClassicScript(path, child, mode) {
    return new Promise((resolve) => {
      if (!hasDocument()) {
        resolve({ path, loaded: false, reason: "document-unavailable" });
        return;
      }

      const wanted = childUrl(path);

      if (scriptAlreadyLoaded(path)) {
        resolve({ path: wanted, loaded: true, reused: true });
        return;
      }

      const script = document.createElement("script");
      script.src = wanted;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-audralia-loader-contract", INTERNAL_CONTRACT);
      script.setAttribute("data-audralia-loader-mode", mode);
      script.setAttribute("data-audralia-topology-child-id", child.id);
      script.setAttribute("data-audralia-single-cache-nonce-chain", CHAIN_CONTRACT);
      script.setAttribute("data-audralia-page-cache-nonce", getOrCreateCacheNonce());

      script.onload = () => resolve({ path: wanted, loaded: true, reused: false });
      script.onerror = () => resolve({ path: wanted, loaded: false, reused: false });

      document.head.appendChild(script);
    });
  }

  async function loadOneChild(child) {
    if (!child.active) {
      state.childStatuses[child.id] = "staged";
      return false;
    }

    if (syncAlreadyPublishedChild(child)) {
      return true;
    }

    const key = child.id;

    if (loadPromises.has(key)) {
      await loadPromises.get(key);
      return syncAlreadyPublishedChild(child);
    }

    setChildStatus(child, "loading", "active child script requested");

    const promise = (async () => {
      const result = await loadClassicScript(child.path, child, "topology");

      state.childSources[child.id] = result.path || child.path;

      if (!result.loaded) {
        setChildStatus(child, "missing_script", `failed to load ${child.path}`);
        return false;
      }

      const start = Date.now();

      while (Date.now() - start <= ACTIVE_CHILD_TIMEOUT_MS) {
        if (syncAlreadyPublishedChild(child)) {
          return true;
        }

        await sleep(POLL_MS);
      }

      setChildStatus(child, "loaded_no_global", `script loaded but ${child.globalKey} was not published`);
      return false;
    })();

    loadPromises.set(key, promise);

    return promise;
  }

  async function loadOneHydrology(child) {
    if (!child.active || !child.hydrology || !child.hydrology.enabled) {
      if (child.hydrology && child.hydrology.enabled === false) {
        state.hydrologyStatuses[child.id] = "not_enabled";
      }
      return false;
    }

    if (syncAlreadyPublishedHydrology(child)) {
      return true;
    }

    const key = child.id;

    if (hydrologyLoadPromises.has(key)) {
      await hydrologyLoadPromises.get(key);
      return syncAlreadyPublishedHydrology(child);
    }

    setHydrologyStatus(child, "loading", "active hydrology script requested");

    const promise = (async () => {
      const result = await loadClassicScript(child.hydrology.path, child, "hydrology");

      state.hydrologySources[child.id] = result.path || child.hydrology.path;

      if (!result.loaded) {
        setHydrologyStatus(child, "missing_script", `failed to load ${child.hydrology.path}`);
        return false;
      }

      const start = Date.now();

      while (Date.now() - start <= HYDROLOGY_TIMEOUT_MS) {
        if (syncAlreadyPublishedHydrology(child)) {
          return true;
        }

        await sleep(POLL_MS);
      }

      setHydrologyStatus(child, "loaded_no_global", `script loaded but ${child.hydrology.globalKey} was not published`);
      return false;
    })();

    hydrologyLoadPromises.set(key, promise);

    return promise;
  }

  async function loadTopologyChildren() {
    if (state.childLoadStarted && state.childLoadComplete) {
      return getStatus();
    }

    state.childLoadStarted = true;
    publishReceipt("topology-children-load-start");

    let activeLoaded = 0;

    for (const child of CHILDREN) {
      if (!child.active) {
        state.childStatuses[child.id] = "staged";
        continue;
      }

      const loaded = await loadOneChild(child);
      if (loaded) activeLoaded += 1;
    }

    state.activeTopologyCount = Object.keys(state.topologies).length;
    state.localTopologyChildrenLoaded = activeLoaded;
    state.activeChildLoadComplete = activeLoaded === CHILDREN.filter((child) => child.active).length;
    state.childLoadComplete = true;

    state.lastLoadSummary = {
      activeLoaded,
      activeRequired: CHILDREN.filter((child) => child.active).length,
      topologies: Object.keys(state.topologies),
      statuses: { ...state.childStatuses },
      contracts: { ...state.childContracts }
    };

    publishReceipt("topology-children-load-complete");

    loadHydrologyChildren().catch((error) => recordError("loadHydrologyChildren", error));
    requestParentRender();

    return getStatus();
  }

  async function loadHydrologyChildren() {
    if (state.hydrologyLoadStarted && state.hydrologyLoadComplete) {
      return getStatus();
    }

    state.hydrologyLoadStarted = true;
    publishReceipt("hydrology-children-load-start");

    let activeLoaded = 0;
    const activeHydrologyChildren = CHILDREN.filter((child) => child.active && child.hydrology && child.hydrology.enabled);

    for (const child of CHILDREN) {
      if (!child.active || !child.hydrology || !child.hydrology.enabled) {
        if (!child.active) state.hydrologyStatuses[child.id] = "staged";
        else state.hydrologyStatuses[child.id] = "not_enabled";
        continue;
      }

      const loaded = await loadOneHydrology(child);
      if (loaded) activeLoaded += 1;
    }

    state.hydrologyLoadComplete = true;

    if (activeLoaded > 0) {
      state.hydrologyLoaded = true;
    }

    state.lastHydrologySummary = {
      activeLoaded,
      activeRequired: activeHydrologyChildren.length,
      hydrologies: Object.keys(state.hydrologies),
      statuses: { ...state.hydrologyStatuses },
      contracts: { ...state.hydrologyContracts },
      activeHydrologyChildren: state.activeHydrologyChildren.slice()
    };

    publishReceipt("hydrology-children-load-complete");
    requestParentRender();

    return getStatus();
  }

  function requestParentRender() {
    if (!hasWindow()) return;

    try {
      const parent =
        window.AUDRALIA_CLEAN_CANVAS_AUTHORITY ||
        window.AUDRALIA_CLEAN_CANVAS_ENGINE ||
        window.AUDRALIA_CLEAN_ENGINE_PARENT ||
        window.AUDRALIA_ENGINE ||
        null;

      if (parent && typeof parent.requestRender === "function") {
        parent.requestRender();
      } else if (parent && typeof parent.render === "function") {
        parent.render();
      }
    } catch (error) {
      recordError("requestParentRender", error);
    }
  }

  function drawBoundaryStroke(ctx, payload, boundary, color, lineWidthFactor, alphaMax, elevation = HYDROLOGY_ELEVATION) {
    if (!Array.isArray(boundary) || boundary.length < 2) return false;

    const projected = projectBoundary(payload, boundary, elevation);
    const visibility = projectedVisibility(projected);

    if (visibility.visible.length < 2) return false;

    const center = averageProjected(payload, boundary, elevation);
    const alpha = Math.max(0.08, depthAlpha(center.z, -0.02, 0.44));

    if (!center.visible || alpha <= 0.01) return false;

    ctx.save();
    ctx.beginPath();

    projected.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.strokeStyle = withAlpha(color, alpha, alphaMax);
    ctx.lineWidth = Math.max(1, payload.geometry.radius * lineWidthFactor);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function drawBoundaryFill(ctx, payload, ring, color, alphaMax, elevation = HYDROLOGY_ELEVATION) {
    if (!Array.isArray(ring) || ring.length < 3) return false;

    const projected = projectBoundary(payload, ring, elevation);
    const visibility = projectedVisibility(projected);

    if (visibility.visible.length < 3) return false;

    const center = averageProjected(payload, ring, elevation);
    const alpha = Math.max(0.08, depthAlpha(center.z, -0.02, 0.5));

    if (!center.visible || alpha <= 0.01) return false;

    ctx.save();

    if (drawClosedPath(ctx, projected)) {
      ctx.fillStyle = withAlpha(color, alpha, alphaMax);
      ctx.fill();

      ctx.strokeStyle = withAlpha(color, alpha, Math.min(0.72, alphaMax + 0.14));
      ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.002);
      ctx.stroke();
    }

    ctx.restore();

    return true;
  }

  function drawLandmassWithSeaLevelModulation(ctx, payload, landmass, topology, hydrology) {
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];
    if (boundary.length < 3) return false;

    const projected = projectBoundary(payload, boundary, LAND_ELEVATION);
    const visibility = projectedVisibility(projected);

    if (!shapeVisibilityOk(projected, 0.2)) {
      return false;
    }

    const center = averageProjected(payload, boundary, LAND_ELEVATION);
    const alpha = Math.max(0.16, depthAlpha(center.z, -0.02, 0.36));

    if (!center.visible || alpha <= 0.01) return false;

    const hasHydrology = Boolean(hydrology);

    ctx.save();

    if (drawClosedPath(ctx, projected)) {
      ctx.fillStyle = withAlpha(topology.color || COLORS.land, alpha, hasHydrology ? 0.68 : 0.84);
      ctx.fill();

      ctx.strokeStyle = withAlpha(COLORS.landStroke, Math.max(0.24, alpha), hasHydrology ? 0.22 : 0.34);
      ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0028);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.restore();

    if (hasHydrology) {
      const innerBoundary = scaleBoundaryTowardCenter(boundary, 0.88);
      const innerProjected = projectBoundary(payload, innerBoundary, LAND_ELEVATION);

      if (shapeVisibilityOk(innerProjected, 0.22)) {
        ctx.save();

        if (drawClosedPath(ctx, innerProjected)) {
          ctx.fillStyle = withAlpha(COLORS.landInterior, alpha, 0.48);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    return visibility.visible.length >= 3;
  }

  function drawLandmass(ctx, payload, landmass, topology) {
    return drawLandmassWithSeaLevelModulation(ctx, payload, landmass, topology, null);
  }

  function drawHydrologyShelvesBeforeLand(ctx, payload, landmass, hydrology) {
    if (!hydrology) return 0;

    let count = 0;
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];

    for (const entry of hydrology.submergedEdgeRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, boundary);
      if (drawBoundaryStroke(ctx, payload, ring, COLORS.shelf, 0.021, 0.24, HYDROLOGY_ELEVATION)) count += 1;
      if (drawBoundaryStroke(ctx, payload, ring, COLORS.shelfStrong, 0.008, 0.2, HYDROLOGY_ELEVATION)) count += 1;
    }

    for (const entry of hydrology.coastalShelfRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, boundary);
      const district = entry.district || "";
      const isWest = district === "WEST_ADVERSITY_EDGE";
      const isSouth = district === "SOUTH_RESTORATION_BELT";
      const width = isWest ? 0.008 : isSouth ? 0.018 : 0.014;
      const alpha = isWest ? 0.18 : isSouth ? 0.32 : 0.26;

      if (drawBoundaryStroke(ctx, payload, ring, COLORS.coastalBlend, width, alpha, HYDROLOGY_ELEVATION)) count += 1;
    }

    return count;
  }

  function drawHydrologyBayInletCuts(ctx, payload, landmass, hydrology) {
    if (!hydrology) return 0;

    let count = 0;
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];

    for (const entry of hydrology.bayWaterRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, []);
      const source = ring.length ? ring : boundary;
      const width = entry.profile && entry.profile.carveStrength ? 0.006 + entry.profile.carveStrength * 0.012 : 0.013;

      if (drawBoundaryStroke(ctx, payload, source, COLORS.bay, width, 0.5, HYDROLOGY_ELEVATION)) count += 1;
      if (drawBoundaryStroke(ctx, payload, source, COLORS.shelf, Math.max(0.004, width * 0.52), 0.24, HYDROLOGY_ELEVATION)) count += 1;
    }

    for (const entry of hydrology.inletWaterRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, []);
      const source = ring.length ? ring : boundary;
      const width = entry.profile && entry.profile.carveStrength ? 0.004 + entry.profile.carveStrength * 0.01 : 0.01;

      if (drawBoundaryStroke(ctx, payload, source, COLORS.inlet, width, 0.54, HYDROLOGY_ELEVATION)) count += 1;
    }

    return count;
  }

  function drawHydrologyWetlandLagoonBlends(ctx, payload, landmass, hydrology) {
    if (!hydrology) return 0;

    let count = 0;
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];

    for (const entry of hydrology.wetlandBlendRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, boundary);
      if (drawBoundaryStroke(ctx, payload, ring, COLORS.wetland, 0.016, 0.46, HYDROLOGY_ELEVATION)) count += 1;
      if (drawBoundaryStroke(ctx, payload, ring, COLORS.lagoon, 0.007, 0.28, HYDROLOGY_ELEVATION)) count += 1;
    }

    for (const entry of hydrology.lagoonWaterRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, []);
      if (drawBoundaryFill(ctx, payload, ring, COLORS.lagoon, 0.42, HYDROLOGY_ELEVATION)) count += 1;
    }

    for (const entry of hydrology.repairedWaterlineRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, boundary);
      if (drawBoundaryStroke(ctx, payload, ring, COLORS.repairedWaterline, 0.007, 0.44, HYDROLOGY_ELEVATION)) count += 1;
    }

    return count;
  }

  function drawHydrologyInlandWaters(ctx, payload, hydrology) {
    if (!hydrology) return 0;

    let count = 0;

    for (const entry of hydrology.inlandLakeRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, []);
      if (!ring.length) continue;

      if (drawBoundaryFill(ctx, payload, ring, COLORS.lake, 0.48, HYDROLOGY_ELEVATION)) count += 1;
      if (drawBoundaryStroke(ctx, payload, ring, COLORS.lakeEdge, 0.0038, 0.34, HYDROLOGY_ELEVATION)) count += 1;
    }

    return count;
  }

  function drawHydrologyHardCoastWaterlines(ctx, payload, landmass, hydrology) {
    if (!hydrology) return 0;

    let count = 0;
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];

    for (const entry of hydrology.hardCoastWaterlineRegistry || []) {
      const ring = normalizeHydrologyBoundary(entry, boundary);
      if (drawBoundaryStroke(ctx, payload, ring, COLORS.waterlineShadow, 0.0072, 0.34, HYDROLOGY_ELEVATION)) count += 1;
      if (drawBoundaryStroke(ctx, payload, ring, COLORS.hardWaterline, 0.0032, 0.5, HYDROLOGY_ELEVATION)) count += 1;
    }

    for (const entry of hydrology.shelterMouthWaterRegistry || []) {
      if (!Number.isFinite(Number(entry.lon)) || !Number.isFinite(Number(entry.lat))) continue;
      if (drawPointMarker(ctx, payload, entry, COLORS.waterlineShadow, 0.009)) count += 1;
    }

    return count;
  }

  function drawBoundarySegment(ctx, payload, boundary, segment, color, lineWidthFactor) {
    const nodes = segmentPoints(boundary, segment.start, segment.end);
    if (nodes.length < 2) return false;

    const projected = projectBoundary(payload, nodes, TOPOLOGY_MARK_ELEVATION);
    const visibility = projectedVisibility(projected);

    if (visibility.visible.length < 2) return false;

    const center = averageProjected(payload, nodes, TOPOLOGY_MARK_ELEVATION);
    const alpha = Math.max(0.1, depthAlpha(center.z, -0.02, 0.42));

    if (!center.visible || alpha <= 0.01) return false;

    ctx.save();
    ctx.beginPath();

    projected.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.strokeStyle = withAlpha(color, alpha, 0.7);
    ctx.lineWidth = Math.max(1, payload.geometry.radius * lineWidthFactor);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function drawPointMarker(ctx, payload, point, color, radiusFactor) {
    const p = projectPoint(payload, point.lon, point.lat, TOPOLOGY_MARK_ELEVATION);
    const alpha = Math.max(0.12, depthAlpha(p.z, -0.01, 0.5));

    if (!p.visible || alpha <= 0.01) return false;

    const radius = Math.max(1.4, payload.geometry.radius * radiusFactor) * (0.82 + Math.max(0, p.scale) * 0.22);

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fillStyle = withAlpha(color, alpha, 0.74);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius * 1.55, 0, TAU);
    ctx.strokeStyle = withAlpha(color, alpha * 0.68, 0.36);
    ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0014);
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function drawWaterBoundary(ctx, payload, ring, color, alphaMax) {
    if (!Array.isArray(ring) || ring.length < 3) return false;

    const projected = projectBoundary(payload, ring, TOPOLOGY_MARK_ELEVATION);
    const visibility = projectedVisibility(projected);

    if (visibility.visible.length < 3) return false;

    const center = averageProjected(payload, ring, TOPOLOGY_MARK_ELEVATION);
    const alpha = Math.max(0.1, depthAlpha(center.z, -0.02, 0.5));

    if (!center.visible || alpha <= 0.01) return false;

    ctx.save();

    if (drawClosedPath(ctx, projected)) {
      ctx.fillStyle = withAlpha(color, alpha, alphaMax);
      ctx.fill();

      ctx.strokeStyle = withAlpha(color, alpha, Math.min(0.66, alphaMax + 0.14));
      ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0022);
      ctx.stroke();
    }

    ctx.restore();

    return true;
  }

  function drawTopologyClasses(ctx, payload, landmass) {
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];
    const topology = landmass.topology || {};
    const counts = {
      beaches: 0,
      cliffEdges: 0,
      bays: 0,
      inlets: 0,
      peninsulas: 0,
      wetlands: 0,
      cavernMouths: 0,
      lakes: 0,
      lagoons: 0
    };

    if (!boundary.length) return counts;

    for (const segment of topology.beaches || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.beach, 0.0058)) counts.beaches += 1;
    }

    for (const segment of topology.cliffEdges || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.cliffEdge, 0.0054)) counts.cliffEdges += 1;
    }

    for (const segment of topology.bays || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.bay, 0.0048)) counts.bays += 1;
    }

    for (const segment of topology.inlets || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.inlet, 0.0042)) counts.inlets += 1;
    }

    for (const segment of topology.peninsulas || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.peninsula, 0.0038)) counts.peninsulas += 1;
    }

    for (const segment of topology.wetlands || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.wetland, 0.0048)) counts.wetlands += 1;
    }

    for (const point of topology.cavernMouths || []) {
      if (drawPointMarker(ctx, payload, point, COLORS.cavernMouth, 0.0068)) counts.cavernMouths += 1;
    }

    for (const lake of topology.lakes || []) {
      if (drawWaterBoundary(ctx, payload, lake, COLORS.lake, 0.36)) counts.lakes += 1;
    }

    for (const lagoon of topology.lagoons || []) {
      if (drawWaterBoundary(ctx, payload, lagoon, COLORS.lagoon, 0.34)) counts.lagoons += 1;
    }

    return counts;
  }

  function drawTopology(ctx, payload, topology, childId) {
    if (!topology || !Array.isArray(topology.landmasses)) {
      return {
        drawnBodies: 0,
        classCounts: {},
        hydrologyCounts: {},
        hydrologyConsumed: false,
        reason: "invalid_topology"
      };
    }

    let drawnBodies = 0;

    const aggregateCounts = {
      beaches: 0,
      cliffEdges: 0,
      bays: 0,
      inlets: 0,
      peninsulas: 0,
      wetlands: 0,
      cavernMouths: 0,
      lakes: 0,
      lagoons: 0
    };

    const hydrologyCounts = {
      shelves: 0,
      bayInletCuts: 0,
      wetlandLagoonBlends: 0,
      inlandWaters: 0,
      hardCoastWaterlines: 0
    };

    const hydrology = state.hydrologies[childId] || null;
    let hydrologyConsumed = false;

    for (const landmass of topology.landmasses) {
      if (hydrology) {
        hydrologyCounts.shelves += drawHydrologyShelvesBeforeLand(ctx, payload, landmass, hydrology);
      }

      const didDraw = drawLandmassWithSeaLevelModulation(ctx, payload, landmass, topology, hydrology);

      if (!didDraw) continue;

      drawnBodies += 1;

      if (hydrology) {
        hydrologyCounts.bayInletCuts += drawHydrologyBayInletCuts(ctx, payload, landmass, hydrology);
        hydrologyCounts.wetlandLagoonBlends += drawHydrologyWetlandLagoonBlends(ctx, payload, landmass, hydrology);
        hydrologyCounts.inlandWaters += drawHydrologyInlandWaters(ctx, payload, hydrology);
        hydrologyCounts.hardCoastWaterlines += drawHydrologyHardCoastWaterlines(ctx, payload, landmass, hydrology);

        hydrologyConsumed = Object.values(hydrologyCounts).some((value) => value > 0);
      }

      const counts = drawTopologyClasses(ctx, payload, landmass);

      for (const key of Object.keys(aggregateCounts)) {
        aggregateCounts[key] += counts[key] || 0;
      }
    }

    return {
      drawnBodies,
      classCounts: aggregateCounts,
      hydrologyCounts,
      hydrologyConsumed,
      reason: drawnBodies > 0 ? "drawn" : "no_visible_landmass"
    };
  }

  function hydratePublishedChildrenBeforeDraw() {
    for (const child of CHILDREN) {
      if (!child.active) continue;

      if (!state.topologies[child.id]) {
        syncAlreadyPublishedChild(child);
      }

      if (!state.hydrologies[child.id]) {
        syncAlreadyPublishedHydrology(child);
      }
    }

    state.activeTopologyCount = Object.keys(state.topologies).length;
  }

  function draw(ctx, payload) {
    try {
      if (!validPayload(ctx, payload)) {
        publishReceipt("draw-skipped-invalid-parent-payload");
        return api;
      }

      if (payload && payload.cacheNonce) {
        state.cacheNonce = String(payload.cacheNonce);
      } else {
        getOrCreateCacheNonce();
      }

      parentContractSeen(payload);
      hydratePublishedChildrenBeforeDraw();

      state.drawCount += 1;
      state.activeDrawnBodies = 0;
      state.childVisualReady = false;
      state.wrapperOnlyValid = false;
      state.hydrologyVisualConsumed = false;
      state.lastDrawSkippedReason = "";

      if (!state.childLoadStarted) {
        loadTopologyChildren().catch((error) => recordError("loadTopologyChildren", error));
      }

      if (!state.hydrologyLoadStarted) {
        loadHydrologyChildren().catch((error) => recordError("loadHydrologyChildren", error));
      }

      const drawReports = [];

      for (const [childId, topology] of Object.entries(state.topologies)) {
        const report = drawTopology(ctx, payload, topology, childId);

        state.activeDrawnBodies += report.drawnBodies;

        if (report.hydrologyConsumed) {
          state.hydrologyVisualConsumed = true;
          state.hydrologyRenderPassCount += 1;
        }

        drawReports.push({
          childId,
          summit: topology.summit || "",
          topologyId: topology.id || "",
          drawnBodies: report.drawnBodies,
          classCounts: report.classCounts,
          hydrologyCounts: report.hydrologyCounts,
          hydrologyConsumed: report.hydrologyConsumed,
          reason: report.reason
        });
      }

      state.childVisualReady = state.activeDrawnBodies > 0;
      state.wrapperOnlyValid = !state.childVisualReady;

      state.lastDrawSummary = {
        drawCount: state.drawCount,
        activeTopologyCount: Object.keys(state.topologies).length,
        activeDrawnBodies: state.activeDrawnBodies,
        childVisualReady: state.childVisualReady,
        hydrologyAdapterActive: true,
        hydrologyVisualConsumed: state.hydrologyVisualConsumed,
        hydrologyRenderPassCount: state.hydrologyRenderPassCount,
        reports: drawReports,
        childStatuses: { ...state.childStatuses },
        hydrologyStatuses: { ...state.hydrologyStatuses }
      };

      if (!state.childVisualReady) {
        state.lastDrawSkippedReason = "continents_wrapper_valid_but_no_child_landmass_drawn";
      }

      publishReceipt(state.childVisualReady ? "draw-child-visible" : "draw-no-child-visible");

      return api;
    } catch (error) {
      recordError("draw", error);
      return api;
    }
  }

  function render(ctx, payload) {
    return draw(ctx, payload);
  }

  function paint(ctx, payload) {
    return draw(ctx, payload);
  }

  function drawContinents(ctx, payload) {
    return draw(ctx, payload);
  }

  function renderContinents(ctx, payload) {
    return draw(ctx, payload);
  }

  function paintContinents(ctx, payload) {
    return draw(ctx, payload);
  }

  function mount() {
    state.mountCalled = true;
    getOrCreateCacheNonce();

    loadTopologyChildren().catch((error) => recordError("mount.loadTopologyChildren", error));

    publishReceipt("mount");

    return api;
  }

  function init() {
    publishReceipt("init");
    return api;
  }

  function setup() {
    publishReceipt("setup");
    return api;
  }

  function boot() {
    publishReceipt("boot");
    return api;
  }

  function create() {
    publishReceipt("create");
    return api;
  }

  function getDistribution() {
    return CHILDREN.map((child) => ({
      id: child.id,
      summit: child.summit,
      cells: child.cells,
      active: child.active,
      requiredForVisual: Boolean(child.requiredForVisual),
      staged: Boolean(child.staged),
      path: child.path,
      globalKey: child.globalKey,
      status: state.childStatuses[child.id] || (child.active ? "pending" : "staged"),
      contract: state.childContracts[child.id] || "",
      source: state.childSources[child.id] || "",
      hydrologyEnabled: Boolean(child.hydrology && child.hydrology.enabled),
      hydrologyPath: child.hydrology && child.hydrology.path ? child.hydrology.path : "",
      hydrologyGlobalKey: child.hydrology && child.hydrology.globalKey ? child.hydrology.globalKey : "",
      hydrologyStatus: state.hydrologyStatuses[child.id] || "",
      hydrologyContract: state.hydrologyContracts[child.id] || "",
      hydrologySource: state.hydrologySources[child.id] || ""
    }));
  }

  function getTopologySummary() {
    return Object.entries(state.topologies).map(([childId, topology]) => ({
      childId,
      id: topology.id || "",
      summit: topology.summit || "",
      cells: topology.cells || 0,
      className: topology.className || "",
      localLattice: topology.localLattice || "",
      topologyOnly: topology.topologyOnly === true,
      terrainOwned: topology.terrainOwned === true,
      elevationOwned: topology.elevationOwned === true,
      landmassCount: Array.isArray(topology.landmasses) ? topology.landmasses.length : 0,
      boundaryNodeCounts: Array.isArray(topology.landmasses)
        ? topology.landmasses.map((landmass) => ({
            id: landmass.id || "",
            boundaryNodeCount: Array.isArray(landmass.boundary) ? landmass.boundary.length : 0
          }))
        : []
    }));
  }

  function getHydrologySummary() {
    return Object.entries(state.hydrologies).map(([childId, hydrology]) => ({
      childId,
      id: hydrology.id || "",
      continent: hydrology.continent || "",
      summit: hydrology.summit || "",
      contract: hydrology.contract || "",
      hydrologyOnly: hydrology.hydrologyOnly === true,
      topologyOwned: hydrology.topologyOwned === true,
      terrainOwned: hydrology.terrainOwned === true,
      elevationOwned: hydrology.elevationOwned === true,
      globalOceanOwned: hydrology.globalOceanOwned === true,
      directDrawing: hydrology.directDrawing === true,
      seaLevelZoneCount: Array.isArray(hydrology.seaLevelZones) ? hydrology.seaLevelZones.length : 0,
      coastalShelfCount: Array.isArray(hydrology.coastalShelfRegistry) ? hydrology.coastalShelfRegistry.length : 0,
      bayWaterCount: Array.isArray(hydrology.bayWaterRegistry) ? hydrology.bayWaterRegistry.length : 0,
      inletWaterCount: Array.isArray(hydrology.inletWaterRegistry) ? hydrology.inletWaterRegistry.length : 0,
      inlandLakeCount: Array.isArray(hydrology.inlandLakeRegistry) ? hydrology.inlandLakeRegistry.length : 0
    }));
  }

  function getVisualReadiness() {
    const activeChildren = CHILDREN.filter((child) => child.active);
    const activeStatuses = activeChildren.map((child) => ({
      id: child.id,
      status: state.childStatuses[child.id] || "pending",
      hasTopology: Boolean(state.topologies[child.id]),
      contract: state.childContracts[child.id] || "",
      source: state.childSources[child.id] || "",
      hydrologyStatus: state.hydrologyStatuses[child.id] || "",
      hasHydrology: Boolean(state.hydrologies[child.id]),
      hydrologyContract: state.hydrologyContracts[child.id] || "",
      hydrologySource: state.hydrologySources[child.id] || ""
    }));

    return {
      wrapperLoaded: true,
      parentFacingContractValid: true,
      childDrawAuthoritative: true,
      wrapperOnlyValid: state.wrapperOnlyValid,
      childVisualReady: state.childVisualReady,
      activeDrawnBodies: state.activeDrawnBodies,
      activeTopologyCount: Object.keys(state.topologies).length,
      hydrologyAdapterActive: true,
      hydrologyChildrenEnabled: true,
      activeHydrologyChildren: state.activeHydrologyChildren.slice(),
      hydrologyLoaded: state.hydrologyLoaded,
      hydrologyContractValid: state.hydrologyContractValid,
      hydrologyVisualConsumed: state.hydrologyVisualConsumed,
      hydrologyRenderPassCount: state.hydrologyRenderPassCount,
      seaLevelZoneCount: state.seaLevelZoneCount,
      activeStatuses,
      lastDrawSkippedReason: state.lastDrawSkippedReason,
      lastDrawSummary: state.lastDrawSummary,
      lastLoadSummary: state.lastLoadSummary,
      lastHydrologySummary: state.lastHydrologySummary
    };
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      internalContract: INTERNAL_CONTRACT,
      previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
      childSplitContract: CHILD_SPLIT_CONTRACT,
      segmentContract: SEGMENT_CONTRACT,
      chainContract: CHAIN_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      cacheNonce: state.cacheNonce || getOrCreateCacheNonce(),

      active: true,
      classicScript: true,
      segment: 1,

      topologyOnly: true,
      hydrologyAdapterActive: true,
      hydrologyChildrenEnabled: true,
      terrainOwned: false,
      elevationOwned: false,
      ownsCanvas: false,
      ownsFormVisible: false,
      ownsOcean: false,
      ownsGlobalOcean: false,
      ownsRoute: false,
      waterPhysicsOwned: false,

      parentCompliance: true,
      parentFacingContractUnchanged: true,
      childObeysParentStandard: true,
      acceptsParentPayloadOnly: true,

      wrapperLoaded: true,
      childDrawAuthoritative: true,
      wrapperOnlyValid: state.wrapperOnlyValid,
      childVisualReady: state.childVisualReady,

      childLoadStarted: state.childLoadStarted,
      childLoadComplete: state.childLoadComplete,
      activeChildLoadComplete: state.activeChildLoadComplete,
      childStatuses: { ...state.childStatuses },
      childContracts: { ...state.childContracts },
      childSources: { ...state.childSources },
      topologyErrors: { ...state.topologyErrors },
      topologySummary: getTopologySummary(),

      hydrologyLoadStarted: state.hydrologyLoadStarted,
      hydrologyLoadComplete: state.hydrologyLoadComplete,
      hydrologyLoaded: state.hydrologyLoaded,
      hydrologyContractValid: state.hydrologyContractValid,
      hydrologyReadSucceeded: state.hydrologyReadSucceeded,
      hydrologyVisualConsumed: state.hydrologyVisualConsumed,
      hydrologyRenderPassCount: state.hydrologyRenderPassCount,
      activeHydrologyChildren: state.activeHydrologyChildren.slice(),
      seaLevelZoneCount: state.seaLevelZoneCount,
      gratitudeHydrologyContract: state.gratitudeHydrologyContract,
      gratitudeHydrologySource: state.gratitudeHydrologySource,
      renderAdapterRequired: false,
      hydrologyStatuses: { ...state.hydrologyStatuses },
      hydrologyContracts: { ...state.hydrologyContracts },
      hydrologySources: { ...state.hydrologySources },
      hydrologyErrors: { ...state.hydrologyErrors },
      hydrologySummary: getHydrologySummary(),

      visualReadiness: getVisualReadiness(),

      nineSummits256FibonacciModel: true,
      summitCount: 9,
      continentBodyCount: 9,
      activeTopologyCount: Object.keys(state.topologies).length,
      activeDrawnBodies: state.activeDrawnBodies,
      summits: SUMMITS.slice(),
      totalLatticeCells: TOTAL_LATTICE_CELLS,
      exposedLandCells: EXPOSED_LAND_CELLS,
      oceanSeaShelfCells: OCEAN_SEA_SHELF_CELLS,
      exposedLandRatio: EXPOSED_LAND_RATIO,
      oceanSeaRatio: OCEAN_SEA_RATIO,
      primarySummit: "Gratitude",
      fibonacciDistribution: getDistribution(),
      landCellTotal: CHILDREN.reduce((sum, child) => sum + child.cells, 0),

      topologicalClassesOnly: true,
      hydrologySeaLevelOnly: true,
      cliffEdgeIsCategoryOnly: true,
      cavernMouthIsCategoryOnly: true,
      lakeIsBoundaryOnly: true,

      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
      lastParentContractSeen: state.lastParentContractSeen,
      lastDrawSkippedReason: state.lastDrawSkippedReason,
      lastDrawSummary: state.lastDrawSummary,
      lastLoadSummary: state.lastLoadSummary,
      lastHydrologySummary: state.lastHydrologySummary,

      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false,

      errors: state.errors.slice()
    };
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const status = {
      contract: CONTRACT,
      internalContract: INTERNAL_CONTRACT,
      previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
      childSplitContract: CHILD_SPLIT_CONTRACT,
      segmentContract: SEGMENT_CONTRACT,
      chainContract: CHAIN_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      cacheNonce: state.cacheNonce || "",
      mode: "g26_continents_gratitude_hydrology_render_adapter",
      scope,

      active: true,
      classicScript: true,
      segment: 1,

      topologyOnly: true,
      hydrologyAdapterActive: true,
      hydrologyChildrenEnabled: true,
      terrainOwned: false,
      elevationOwned: false,
      ownsFormVisible: false,
      ownsCanvas: false,
      ownsRoute: false,
      ownsOcean: false,
      ownsGlobalOcean: false,
      waterPhysicsOwned: false,

      parentCompliance: true,
      parentFacingContractUnchanged: true,
      childObeysParentStandard: true,
      acceptsParentPayloadOnly: true,

      wrapperLoaded: true,
      childDrawAuthoritative: true,
      wrapperOnlyValid: state.wrapperOnlyValid,
      childVisualReady: state.childVisualReady,

      childLoadStarted: state.childLoadStarted,
      childLoadComplete: state.childLoadComplete,
      activeChildLoadComplete: state.activeChildLoadComplete,
      childStatuses: { ...state.childStatuses },
      childContracts: { ...state.childContracts },
      childSources: { ...state.childSources },
      topologyErrors: { ...state.topologyErrors },
      topologySummary: getTopologySummary(),

      hydrologyLoadStarted: state.hydrologyLoadStarted,
      hydrologyLoadComplete: state.hydrologyLoadComplete,
      hydrologyLoaded: state.hydrologyLoaded,
      hydrologyContractValid: state.hydrologyContractValid,
      hydrologyReadSucceeded: state.hydrologyReadSucceeded,
      hydrologyVisualConsumed: state.hydrologyVisualConsumed,
      hydrologyRenderPassCount: state.hydrologyRenderPassCount,
      activeHydrologyChildren: state.activeHydrologyChildren.slice(),
      seaLevelZoneCount: state.seaLevelZoneCount,
      gratitudeHydrologyContract: state.gratitudeHydrologyContract,
      gratitudeHydrologySource: state.gratitudeHydrologySource,
      renderAdapterRequired: false,
      hydrologyStatuses: { ...state.hydrologyStatuses },
      hydrologyContracts: { ...state.hydrologyContracts },
      hydrologySources: { ...state.hydrologySources },
      hydrologyErrors: { ...state.hydrologyErrors },
      hydrologySummary: getHydrologySummary(),

      visualReadiness: getVisualReadiness(),

      nineSummits256FibonacciModel: true,
      summitCount: 9,
      continentBodyCount: 9,
      activeTopologyCount: Object.keys(state.topologies).length,
      activeDrawnBodies: state.activeDrawnBodies,

      totalLatticeCells: TOTAL_LATTICE_CELLS,
      exposedLandCells: EXPOSED_LAND_CELLS,
      oceanSeaShelfCells: OCEAN_SEA_SHELF_CELLS,
      exposedLandRatio: EXPOSED_LAND_RATIO,
      oceanSeaRatio: OCEAN_SEA_RATIO,
      primarySummit: "Gratitude",
      landCellTotal: CHILDREN.reduce((sum, child) => sum + child.cells, 0),
      summits: SUMMITS.slice(),
      distribution: getDistribution(),

      topologicalClassesOnly: true,
      hydrologySeaLevelOnly: true,
      cliffEdgeIsCategoryOnly: true,
      cavernMouthIsCategoryOnly: true,
      lakeIsBoundaryOnly: true,
      fiveContinentLawDeprecated: true,

      lastParentContractSeen: state.lastParentContractSeen,
      lastDrawSkippedReason: state.lastDrawSkippedReason,
      lastDrawSummary: state.lastDrawSummary,
      lastLoadSummary: state.lastLoadSummary,
      lastHydrologySummary: state.lastHydrologySummary,

      singleCacheNonceChain: true,
      visualPassClaim: false,
      formVisibleClaim: false,
      generatedImage: false,
      graphicBox: false,

      errors: state.errors.slice()
    };

    window.AUDRALIA_CONTINENTS_RECEIPT = status;
    window.AUDRALIA_CLEAN_CONTINENTS_RECEIPT = status;
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS_RECEIPT = status;
    window.AUDRALIA_NINE_SUMMITS_CONTINENTS_RECEIPT = status;
    window.AUDRALIA_TOPOLOGY_ONLY_CONTINENTS_RECEIPT = status;
    window.AUDRALIA_SINGLE_CACHE_NONCE_CONTINENTS_RECEIPT = status;
    window.AUDRALIA_CONTINENTS_CHILD_LOAD_AND_DRAW_RECEIPT = status;
    window.AUDRALIA_CONTINENTS_GRATITUDE_HYDROLOGY_RENDER_ADAPTER_RECEIPT = status;

    window.AUDRALIA_CONTINENTS_CHILD_VISUAL_READY = state.childVisualReady;
    window.AUDRALIA_CONTINENTS_ACTIVE_DRAWN_BODIES = state.activeDrawnBodies;
    window.AUDRALIA_CONTINENTS_WRAPPER_ONLY_VALID = state.wrapperOnlyValid;
    window.AUDRALIA_CONTINENTS_GRATITUDE_HYDROLOGY_RENDER_ADAPTER_ACTIVE = true;
    window.AUDRALIA_CONTINENTS_HYDROLOGY_VISUAL_CONSUMED = state.hydrologyVisualConsumed;
    window.AUDRALIA_CONTINENTS_HYDROLOGY_RENDER_PASS_COUNT = state.hydrologyRenderPassCount;

    if (hasDocument() && document.documentElement) {
      document.documentElement.setAttribute("data-audralia-continents-contract", CONTRACT);
      document.documentElement.setAttribute("data-audralia-continents-internal-contract", INTERNAL_CONTRACT);
      document.documentElement.setAttribute("data-audralia-continents-child-visual-ready", state.childVisualReady ? "true" : "false");
      document.documentElement.setAttribute("data-audralia-continents-active-drawn-bodies", String(state.activeDrawnBodies));
      document.documentElement.setAttribute("data-audralia-continents-wrapper-only-valid", state.wrapperOnlyValid ? "true" : "false");
      document.documentElement.setAttribute("data-audralia-continents-hydrology-adapter-active", "true");
      document.documentElement.setAttribute("data-audralia-continents-hydrology-loaded", state.hydrologyLoaded ? "true" : "false");
      document.documentElement.setAttribute("data-audralia-continents-hydrology-contract-valid", state.hydrologyContractValid ? "true" : "false");
      document.documentElement.setAttribute("data-audralia-continents-hydrology-visual-consumed", state.hydrologyVisualConsumed ? "true" : "false");
      document.documentElement.setAttribute("data-audralia-continents-hydrology-render-pass-count", String(state.hydrologyRenderPassCount));
      document.documentElement.setAttribute("data-audralia-continents-last-scope", scope);
    }

    try {
      window.dispatchEvent(new CustomEvent("audralia:continents:receipt", { detail: status }));
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:continents:receipt"));
      } catch (_ignored) {}
    }
  }

  const api = {
    CONTRACT,
    INTERNAL_CONTRACT,
    PREVIOUS_INTERNAL_CONTRACT,
    CHILD_SPLIT_CONTRACT,
    SEGMENT_CONTRACT,
    CHAIN_CONTRACT,
    PARENT_COMPLIANCE_CONTRACT,
    FAMILY,
    TARGET,
    ROUTE,

    SUMMITS,
    CHILDREN,

    TOTAL_LATTICE_CELLS,
    EXPOSED_LAND_CELLS,
    OCEAN_SEA_SHELF_CELLS,
    EXPOSED_LAND_RATIO,
    OCEAN_SEA_RATIO,

    loadTopologyChildren,
    loadHydrologyChildren,
    mount,
    init,
    setup,
    boot,
    create,

    draw,
    render,
    paint,
    drawContinents,
    renderContinents,
    paintContinents,

    getStatus,
    status: getStatus,
    getVisualReadiness,
    getDistribution,
    getTopologySummary,
    getHydrologySummary
  };

  if (hasWindow()) {
    getOrCreateCacheNonce();

    window.AUDRALIA_NINE_SUMMITS_CONTINENTS_ENGINE = api;
    window.AUDRALIA_CLEAN_CONTINENTS_ENGINE = api;
    window.AUDRALIA_CONTINENTS_ENGINE = api;
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS = api;

    window.AudraliaContinentsEngine = api;
    window.AudraliaContinents = api;
    window.audraliaContinents = api;

    window.AUDRALIA_NINE_SUMMITS_256_FIBONACCI_CONTINENTS_ACTIVE = true;
    window.AUDRALIA_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_ACTIVE = true;
    window.AUDRALIA_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_SEGMENT = 1;
    window.AUDRALIA_CONTINENTS_CHILD_LOAD_AND_DRAW_RECEIPT_ALIGNMENT_ACTIVE = true;
    window.AUDRALIA_CONTINENTS_GRATITUDE_HYDROLOGY_RENDER_ADAPTER_ACTIVE = true;
    window.AUDRALIA_LOCAL_TOPOLOGY_CHILDREN_ENABLED = true;
    window.AUDRALIA_TERRAIN_OWNED_BY_CONTINENTS = false;
    window.AUDRALIA_ELEVATION_OWNED_BY_CONTINENTS = false;
    window.AUDRALIA_FIVE_CONTINENT_LAW_ACTIVE = false;
    window.AUDRALIA_FIVE_CONTINENT_LAW_DEPRECATED = true;
    window.AUDRALIA_EXPOSED_LAND_CELLS = EXPOSED_LAND_CELLS;
    window.AUDRALIA_OCEAN_SEA_SHELF_CELLS = OCEAN_SEA_SHELF_CELLS;
    window.AUDRALIA_PRIMARY_SUMMIT = "Gratitude";

    state.globalPublished = true;
    publishReceipt("module-load");
  }
})();
