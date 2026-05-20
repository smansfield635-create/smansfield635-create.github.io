// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_6_CONTINENTS_CHILD_LOAD_AND_DRAW_RECEIPT_ALIGNMENT_TNT_v1
// Full-file replacement.
// Purpose: make continents.js authoritative for child-load and draw truth, not merely wrapper-load truth.
// Parent-facing admission contract intentionally remains AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1 for route-bridge compatibility.
// Segment 1 remains active: Gratitude only. The other eight Summit children remain staged.
// Does not own: parent geometry, canvas creation, route bridge, runtime, FORM_VISIBLE, ocean body, seawater base, sky, motion, elevation, height maps, mountains, animals, plants, zoom, orbit, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const INTERNAL_CONTRACT = "AUDRALIA_G2_6_CONTINENTS_CHILD_LOAD_AND_DRAW_RECEIPT_ALIGNMENT_TNT_v1";
  const CHILD_SPLIT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_TNT_v1";
  const SEGMENT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_SEGMENT_1_TNT_v1";
  const CHAIN_CONTRACT = "AUDRALIA_G2_6_SINGLE_CACHE_NONCE_CHAIN_ALIGNMENT_TNT_v1";
  const PARENT_COMPLIANCE_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_SEGMENT_1_TNT_v1";
  const FAMILY = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents.js";
  const ROUTE = "/showroom/globe/audralia/";

  const DEG = Math.PI / 180;
  const TAU = Math.PI * 2;

  const TOTAL_LATTICE_CELLS = 256;
  const EXPOSED_LAND_CELLS = 89;
  const OCEAN_SEA_SHELF_CELLS = 167;
  const EXPOSED_LAND_RATIO = EXPOSED_LAND_CELLS / TOTAL_LATTICE_CELLS;
  const OCEAN_SEA_RATIO = OCEAN_SEA_SHELF_CELLS / TOTAL_LATTICE_CELLS;

  const LAND_ELEVATION = -0.004;
  const TOPOLOGY_MARK_ELEVATION = -0.0032;

  const ACTIVE_CHILD_TIMEOUT_MS = 3400;
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
        "AUDRALIA_G2_6_GRATITUDE_FULL_TOPOLOGY_GROUND_BASIS_CHILD_TNT_v1",
        "AUDRALIA_G2_6_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_CHILD_TNT_v1",
        "AUDRALIA_G2_6_TOPOLOGY_ONLY_GRATITUDE_CHILD_TNT_v1"
      ]
    },
    {
      id: "generosity",
      summit: "Generosity",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/generosity.js",
      globalKey: "AUDRALIA_TOPOLOGY_GENEROSITY",
      expectedContracts: []
    },
    {
      id: "dependability",
      summit: "Dependability",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/dependability.js",
      globalKey: "AUDRALIA_TOPOLOGY_DEPENDABILITY",
      expectedContracts: []
    },
    {
      id: "accountability",
      summit: "Accountability",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/accountability.js",
      globalKey: "AUDRALIA_TOPOLOGY_ACCOUNTABILITY",
      expectedContracts: []
    },
    {
      id: "forgiveness",
      summit: "Forgiveness",
      cells: 8,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/forgiveness.js",
      globalKey: "AUDRALIA_TOPOLOGY_FORGIVENESS",
      expectedContracts: []
    },
    {
      id: "humility",
      summit: "Humility",
      cells: 8,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/humility.js",
      globalKey: "AUDRALIA_TOPOLOGY_HUMILITY",
      expectedContracts: []
    },
    {
      id: "self-control",
      summit: "Self-Control",
      cells: 5,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/self-control.js",
      globalKey: "AUDRALIA_TOPOLOGY_SELF_CONTROL",
      expectedContracts: []
    },
    {
      id: "patience",
      summit: "Patience",
      cells: 5,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/patience.js",
      globalKey: "AUDRALIA_TOPOLOGY_PATIENCE",
      expectedContracts: []
    },
    {
      id: "purity",
      summit: "Purity",
      cells: 3,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/purity.js",
      globalKey: "AUDRALIA_TOPOLOGY_PURITY",
      expectedContracts: []
    }
  ]);

  const SUMMITS = Object.freeze(CHILDREN.map((child) => child.summit));

  const COLORS = Object.freeze({
    land: "rgba(70, 178, 108, 0.80)",
    landStroke: "rgba(235, 250, 236, 0.26)",
    beach: "rgba(240, 222, 150, 0.58)",
    cliffEdge: "rgba(205, 205, 186, 0.52)",
    cavernMouth: "rgba(18, 22, 30, 0.74)",
    lake: "rgba(64, 190, 226, 0.48)",
    bay: "rgba(106, 225, 238, 0.42)",
    inlet: "rgba(132, 236, 242, 0.48)",
    peninsula: "rgba(125, 210, 134, 0.46)",
    lagoon: "rgba(112, 224, 224, 0.42)",
    wetland: "rgba(122, 188, 128, 0.48)",
    diagnostic: "rgba(255, 205, 112, 0.72)"
  });

  const state = {
    contract: CONTRACT,
    internalContract: INTERNAL_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
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
    terrainOwned: false,
    elevationOwned: false,
    ownsCanvas: false,
    ownsFormVisible: false,
    ownsOcean: false,
    ownsRoute: false,

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

    lastParentContractSeen: "",
    lastDrawSkippedReason: "",
    lastDrawSummary: null,
    lastLoadSummary: null,

    childStatuses: {},
    childContracts: {},
    childSources: {},
    topologies: {},
    topologyErrors: {},
    errors: [],

    visualPassClaim: false
  };

  const loadPromises = new Map();

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
    return boundary.map((point) => ({
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

  function readChildGlobal(child) {
    if (!hasWindow()) return null;
    return window[child.globalKey] || null;
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

  function safeCall(fn, fallback) {
    try {
      return fn();
    } catch (_error) {
      return fallback;
    }
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

  function scriptAlreadyLoaded(path) {
    if (!hasDocument()) return false;

    const expected = childUrl(path);

    return Array.from(document.scripts).some((script) => {
      const src = script.getAttribute("src") || "";
      return src === expected;
    });
  }

  function loadClassicScript(path, child) {
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
      script.setAttribute("data-audralia-topology-child-loader", INTERNAL_CONTRACT);
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
      const result = await loadClassicScript(child.path, child);

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

  function drawLandmass(ctx, payload, landmass, topology) {
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];
    if (boundary.length < 3) return false;

    const projected = projectBoundary(payload, boundary, LAND_ELEVATION);
    const visibility = projectedVisibility(projected);

    if (!shapeVisibilityOk(projected, 0.2)) {
      return false;
    }

    const center = averageProjected(payload, boundary, LAND_ELEVATION);
    const alpha = Math.max(0.18, depthAlpha(center.z, -0.02, 0.36));

    if (!center.visible || alpha <= 0.01) return false;

    ctx.save();

    if (drawClosedPath(ctx, projected)) {
      ctx.fillStyle = withAlpha(topology.color || COLORS.land, alpha, 0.84);
      ctx.fill();

      ctx.strokeStyle = withAlpha(COLORS.landStroke, Math.max(0.26, alpha), 0.34);
      ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0032);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.restore();

    return visibility.visible.length >= 3;
  }

  function drawBoundarySegment(ctx, payload, boundary, segment, color, lineWidthFactor) {
    const nodes = segmentPoints(boundary, segment.start, segment.end);
    if (nodes.length < 2) return false;

    const projected = projectBoundary(payload, nodes, TOPOLOGY_MARK_ELEVATION);
    const visibility = projectedVisibility(projected);

    if (visibility.visible.length < 2) return false;

    const center = averageProjected(payload, nodes, TOPOLOGY_MARK_ELEVATION);
    const alpha = Math.max(0.12, depthAlpha(center.z, -0.02, 0.42));

    if (!center.visible || alpha <= 0.01) return false;

    ctx.save();
    ctx.beginPath();

    projected.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.strokeStyle = withAlpha(color, alpha, 0.72);
    ctx.lineWidth = Math.max(1, payload.geometry.radius * lineWidthFactor);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function drawPointMarker(ctx, payload, point, color, radiusFactor) {
    const p = projectPoint(payload, point.lon, point.lat, TOPOLOGY_MARK_ELEVATION);
    const alpha = Math.max(0.14, depthAlpha(p.z, -0.01, 0.5));

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
    const alpha = Math.max(0.12, depthAlpha(center.z, -0.02, 0.5));

    if (!center.visible || alpha <= 0.01) return false;

    ctx.save();

    if (drawClosedPath(ctx, projected)) {
      ctx.fillStyle = withAlpha(color, alpha, alphaMax);
      ctx.fill();

      ctx.strokeStyle = withAlpha(color, alpha, Math.min(0.7, alphaMax + 0.18));
      ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0024);
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
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.beach, 0.0062)) counts.beaches += 1;
    }

    for (const segment of topology.cliffEdges || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.cliffEdge, 0.0058)) counts.cliffEdges += 1;
    }

    for (const segment of topology.bays || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.bay, 0.0054)) counts.bays += 1;
    }

    for (const segment of topology.inlets || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.inlet, 0.0048)) counts.inlets += 1;
    }

    for (const segment of topology.peninsulas || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.peninsula, 0.0044)) counts.peninsulas += 1;
    }

    for (const segment of topology.wetlands || []) {
      if (drawBoundarySegment(ctx, payload, boundary, segment, COLORS.wetland, 0.0056)) counts.wetlands += 1;
    }

    for (const point of topology.cavernMouths || []) {
      if (drawPointMarker(ctx, payload, point, COLORS.cavernMouth, 0.0076)) counts.cavernMouths += 1;
    }

    for (const lake of topology.lakes || []) {
      if (drawWaterBoundary(ctx, payload, lake, COLORS.lake, 0.5)) counts.lakes += 1;
    }

    for (const lagoon of topology.lagoons || []) {
      if (drawWaterBoundary(ctx, payload, lagoon, COLORS.lagoon, 0.46)) counts.lagoons += 1;
    }

    return counts;
  }

  function drawTopology(ctx, payload, topology) {
    if (!topology || !Array.isArray(topology.landmasses)) {
      return {
        drawnBodies: 0,
        classCounts: {},
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

    for (const landmass of topology.landmasses) {
      const didDraw = drawLandmass(ctx, payload, landmass, topology);

      if (!didDraw) continue;

      drawnBodies += 1;

      const counts = drawTopologyClasses(ctx, payload, landmass);

      for (const key of Object.keys(aggregateCounts)) {
        aggregateCounts[key] += counts[key] || 0;
      }
    }

    return {
      drawnBodies,
      classCounts: aggregateCounts,
      reason: drawnBodies > 0 ? "drawn" : "no_visible_landmass"
    };
  }

  function hydratePublishedChildrenBeforeDraw() {
    for (const child of CHILDREN) {
      if (!child.active) continue;

      if (!state.topologies[child.id]) {
        syncAlreadyPublishedChild(child);
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
      state.lastDrawSkippedReason = "";

      if (!state.childLoadStarted) {
        loadTopologyChildren().catch((error) => recordError("loadTopologyChildren", error));
      }

      const drawReports = [];

      for (const [childId, topology] of Object.entries(state.topologies)) {
        const report = drawTopology(ctx, payload, topology);
        state.activeDrawnBodies += report.drawnBodies;
        drawReports.push({
          childId,
          summit: topology.summit || "",
          topologyId: topology.id || "",
          drawnBodies: report.drawnBodies,
          classCounts: report.classCounts,
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
        reports: drawReports,
        childStatuses: { ...state.childStatuses }
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
      source: state.childSources[child.id] || ""
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

  function getVisualReadiness() {
    const activeChildren = CHILDREN.filter((child) => child.active);
    const activeStatuses = activeChildren.map((child) => ({
      id: child.id,
      status: state.childStatuses[child.id] || "pending",
      hasTopology: Boolean(state.topologies[child.id]),
      contract: state.childContracts[child.id] || "",
      source: state.childSources[child.id] || ""
    }));

    return {
      wrapperLoaded: true,
      parentFacingContractValid: true,
      childDrawAuthoritative: true,
      wrapperOnlyValid: state.wrapperOnlyValid,
      childVisualReady: state.childVisualReady,
      activeDrawnBodies: state.activeDrawnBodies,
      activeTopologyCount: Object.keys(state.topologies).length,
      activeStatuses,
      lastDrawSkippedReason: state.lastDrawSkippedReason,
      lastDrawSummary: state.lastDrawSummary,
      lastLoadSummary: state.lastLoadSummary
    };
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      internalContract: INTERNAL_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
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
      terrainOwned: false,
      elevationOwned: false,
      ownsCanvas: false,
      ownsFormVisible: false,
      ownsOcean: false,
      ownsRoute: false,

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
      previousContract: PREVIOUS_CONTRACT,
      childSplitContract: CHILD_SPLIT_CONTRACT,
      segmentContract: SEGMENT_CONTRACT,
      chainContract: CHAIN_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      cacheNonce: state.cacheNonce || "",
      mode: "g26_continents_child_load_and_draw_receipt_alignment",
      scope,

      active: true,
      classicScript: true,
      segment: 1,

      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      ownsFormVisible: false,
      ownsCanvas: false,
      ownsRoute: false,
      ownsOcean: false,

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
      cliffEdgeIsCategoryOnly: true,
      cavernMouthIsCategoryOnly: true,
      lakeIsBoundaryOnly: true,
      fiveContinentLawDeprecated: true,

      lastParentContractSeen: state.lastParentContractSeen,
      lastDrawSkippedReason: state.lastDrawSkippedReason,
      lastDrawSummary: state.lastDrawSummary,
      lastLoadSummary: state.lastLoadSummary,

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

    window.AUDRALIA_CONTINENTS_CHILD_VISUAL_READY = state.childVisualReady;
    window.AUDRALIA_CONTINENTS_ACTIVE_DRAWN_BODIES = state.activeDrawnBodies;
    window.AUDRALIA_CONTINENTS_WRAPPER_ONLY_VALID = state.wrapperOnlyValid;

    if (hasDocument() && document.documentElement) {
      document.documentElement.setAttribute("data-audralia-continents-contract", CONTRACT);
      document.documentElement.setAttribute("data-audralia-continents-internal-contract", INTERNAL_CONTRACT);
      document.documentElement.setAttribute("data-audralia-continents-child-visual-ready", state.childVisualReady ? "true" : "false");
      document.documentElement.setAttribute("data-audralia-continents-active-drawn-bodies", String(state.activeDrawnBodies));
      document.documentElement.setAttribute("data-audralia-continents-wrapper-only-valid", state.wrapperOnlyValid ? "true" : "false");
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
    PREVIOUS_CONTRACT,
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
    getTopologySummary
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
