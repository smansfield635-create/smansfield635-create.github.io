// /assets/audralia/clean/engine/audralia/engine/continents.js
// AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_SEGMENT_1_TNT_v1
// Full-file replacement.
// Purpose: convert continents.js into a topology-only landmass orchestrator and load the first unique continent topology child: Gratitude.
// Parent-facing admission contract intentionally remains AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1 for bridge compatibility.
// Segment 1 loads Gratitude only. The other eight Summit continent children remain staged.
// Does not own: parent geometry, canvas creation, route bridge, runtime, FORM_VISIBLE, ocean body, seawater base, sky, motion, elevation, terrain, zoom, orbit, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const CHILD_SPLIT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_TNT_v1";
  const SEGMENT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_SEGMENT_1_TNT_v1";
  const PARENT_COMPLIANCE_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
  const PREVIOUS_CHILD_RENEWAL_CONTRACT = "AUDRALIA_G2_6_UNIQUE_CONTINENT_LATTICES_BACKSTORY_OBEDIENCE_TNT_v1";
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
  const TOPOLOGY_MARK_ELEVATION = -0.0035;

  const CHILD_CACHE_KEY = CHILD_SPLIT_CONTRACT;

  const CHILDREN = Object.freeze([
    {
      id: "gratitude",
      summit: "Gratitude",
      cells: 21,
      active: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js",
      globalKey: "AUDRALIA_TOPOLOGY_GRATITUDE"
    },
    {
      id: "generosity",
      summit: "Generosity",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/generosity.js",
      globalKey: "AUDRALIA_TOPOLOGY_GENEROSITY"
    },
    {
      id: "dependability",
      summit: "Dependability",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/dependability.js",
      globalKey: "AUDRALIA_TOPOLOGY_DEPENDABILITY"
    },
    {
      id: "accountability",
      summit: "Accountability",
      cells: 13,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/accountability.js",
      globalKey: "AUDRALIA_TOPOLOGY_ACCOUNTABILITY"
    },
    {
      id: "forgiveness",
      summit: "Forgiveness",
      cells: 8,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/forgiveness.js",
      globalKey: "AUDRALIA_TOPOLOGY_FORGIVENESS"
    },
    {
      id: "humility",
      summit: "Humility",
      cells: 8,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/humility.js",
      globalKey: "AUDRALIA_TOPOLOGY_HUMILITY"
    },
    {
      id: "self-control",
      summit: "Self-Control",
      cells: 5,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/self-control.js",
      globalKey: "AUDRALIA_TOPOLOGY_SELF_CONTROL"
    },
    {
      id: "patience",
      summit: "Patience",
      cells: 5,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/patience.js",
      globalKey: "AUDRALIA_TOPOLOGY_PATIENCE"
    },
    {
      id: "purity",
      summit: "Purity",
      cells: 3,
      active: false,
      staged: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents/purity.js",
      globalKey: "AUDRALIA_TOPOLOGY_PURITY"
    }
  ]);

  const SUMMITS = Object.freeze(CHILDREN.map((child) => child.summit));

  const COLORS = Object.freeze({
    land: "rgba(79, 170, 108, 0.72)",
    landStroke: "rgba(235, 250, 236, 0.20)",
    beach: "rgba(235, 222, 157, 0.42)",
    cliffEdge: "rgba(178, 183, 171, 0.34)",
    cavernMouth: "rgba(28, 32, 38, 0.38)",
    lake: "rgba(74, 182, 220, 0.32)",
    bay: "rgba(106, 218, 232, 0.22)",
    inlet: "rgba(126, 226, 235, 0.24)",
    peninsula: "rgba(109, 190, 122, 0.34)",
    lagoon: "rgba(112, 218, 220, 0.25)",
    wetland: "rgba(116, 178, 128, 0.30)",
    oceanAdjacency: "rgba(178, 244, 255, 0.16)"
  });

  const state = {
    contract: CONTRACT,
    childSplitContract: CHILD_SPLIT_CONTRACT,
    segmentContract: SEGMENT_CONTRACT,
    parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
    previousChildRenewalContract: PREVIOUS_CHILD_RENEWAL_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    segment: 1,
    topologyOnly: true,
    terrainOwned: false,
    elevationOwned: false,
    parentCompliance: true,
    parentFacingContractUnchanged: true,
    childObeysParentStandard: true,
    acceptsParentPayloadOnly: true,
    ownsFormVisible: false,
    ownsCanvas: false,
    ownsRoute: false,
    ownsOcean: false,
    localTopologyChildrenEnabled: true,
    localTopologyChildrenTotal: CHILDREN.length,
    localTopologyChildrenActive: CHILDREN.filter((child) => child.active).length,
    localTopologyChildrenLoaded: 0,
    localTopologyChildrenStaged: CHILDREN.filter((child) => child.staged).length,
    nineSummits256FibonacciModel: true,
    summitCount: 9,
    continentBodyCount: 9,
    activeDrawnBodies: 0,
    totalLatticeCells: TOTAL_LATTICE_CELLS,
    exposedLandCells: EXPOSED_LAND_CELLS,
    oceanSeaShelfCells: OCEAN_SEA_SHELF_CELLS,
    exposedLandRatio: EXPOSED_LAND_RATIO,
    oceanSeaRatio: OCEAN_SEA_RATIO,
    primarySummit: "Gratitude",
    active: true,
    classicScript: true,
    globalPublished: false,
    mountCalled: false,
    drawCount: 0,
    childLoadStarted: false,
    childLoadComplete: false,
    childStatuses: {},
    topologies: {},
    lastParentContractSeen: "",
    lastDrawSkippedReason: "",
    visualPassClaim: false,
    errors: []
  };

  let loadPromise = null;

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

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.errors.push({ scope, message, time: nowIso() });
    publishReceipt(scope);
  }

  function toRad(degrees) {
    return degrees * DEG;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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
      ...projectPoint(payload, point.lon, point.lat, elevation),
      lon: point.lon,
      lat: point.lat
    }));
  }

  function averageProjected(payload, boundary, elevation = LAND_ELEVATION) {
    if (!boundary || !boundary.length) return projectPoint(payload, 0, 0, elevation);

    const sum = boundary.reduce(
      (acc, point) => {
        acc.lon += point.lon;
        acc.lat += point.lat;
        return acc;
      },
      { lon: 0, lat: 0 }
    );

    return projectPoint(payload, sum.lon / boundary.length, sum.lat / boundary.length, elevation);
  }

  function shapeVisibilityOk(points, minRatio = 0.5) {
    if (!points || !points.length) return false;

    const visible = points.filter((point) => point.visible && point.z > -0.08);

    return visible.length / points.length >= minRatio;
  }

  function drawClosedPath(ctx, points) {
    if (!points || !points.length) return false;

    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();

    return true;
  }

  function segmentPoints(boundary, start, end) {
    if (!boundary || !boundary.length) return [];

    const count = boundary.length;
    const a = Math.max(0, Math.min(count - 1, Number(start) || 0));
    const b = Math.max(0, Math.min(count - 1, Number(end) || 0));

    if (a <= b) return boundary.slice(a, b + 1);

    return boundary.slice(a).concat(boundary.slice(0, b + 1));
  }

  function drawBoundarySegment(ctx, payload, boundary, segment, color, lineWidthFactor) {
    const nodes = segmentPoints(boundary, segment.start, segment.end);
    if (!nodes.length) return;

    const projected = projectBoundary(payload, nodes, TOPOLOGY_MARK_ELEVATION);
    if (!shapeVisibilityOk(projected, 0.45)) return;

    const center = averageProjected(payload, nodes, TOPOLOGY_MARK_ELEVATION);
    const alpha = depthAlpha(center.z, 0.04, 0.46);

    if (!center.visible || alpha <= 0.02) return;

    ctx.save();
    ctx.beginPath();

    projected.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.strokeStyle = withAlpha(color, alpha, 0.62);
    ctx.lineWidth = Math.max(1, payload.geometry.radius * lineWidthFactor);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawPointMarker(ctx, payload, point, color, radiusFactor) {
    const p = projectPoint(payload, point.lon, point.lat, TOPOLOGY_MARK_ELEVATION);
    const alpha = depthAlpha(p.z, 0.08, 0.52);

    if (!p.visible || alpha <= 0.03) return;

    const radius = Math.max(1, payload.geometry.radius * radiusFactor) * (0.78 + p.scale * 0.22);

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fillStyle = withAlpha(color, alpha, 0.62);
    ctx.fill();
    ctx.restore();
  }

  function drawWaterBoundary(ctx, payload, ring, color, alphaMax) {
    if (!ring || !ring.length) return;

    const projected = projectBoundary(payload, ring, TOPOLOGY_MARK_ELEVATION);
    if (!shapeVisibilityOk(projected, 0.52)) return;

    const center = averageProjected(payload, ring, TOPOLOGY_MARK_ELEVATION);
    const alpha = depthAlpha(center.z, 0.06, 0.52);

    if (!center.visible || alpha <= 0.03) return;

    ctx.save();

    if (drawClosedPath(ctx, projected)) {
      ctx.fillStyle = withAlpha(color, alpha, alphaMax);
      ctx.fill();
      ctx.strokeStyle = withAlpha(color, alpha, Math.min(0.52, alphaMax + 0.12));
      ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0018);
      ctx.stroke();
    }

    ctx.restore();
  }

  function scriptUrl(path) {
    return `${path}?v=${encodeURIComponent(CHILD_CACHE_KEY)}`;
  }

  function scriptAlreadyLoaded(path) {
    if (!hasDocument()) return false;

    const expected = scriptUrl(path);

    return Array.from(document.scripts).some((script) => {
      const src = script.getAttribute("src") || "";
      return src === expected;
    });
  }

  function loadClassicScript(path) {
    return new Promise((resolve) => {
      if (!hasDocument()) {
        resolve({ path, loaded: false, reason: "document-unavailable" });
        return;
      }

      if (scriptAlreadyLoaded(path)) {
        resolve({ path, loaded: true, reused: true });
        return;
      }

      const script = document.createElement("script");
      script.src = scriptUrl(path);
      script.async = false;
      script.defer = false;
      script.setAttribute("data-audralia-topology-child-loader", SEGMENT_CONTRACT);
      script.setAttribute("data-audralia-topology-cache-key", CHILD_CACHE_KEY);

      script.onload = () => resolve({ path, loaded: true, reused: false });
      script.onerror = () => resolve({ path, loaded: false, reused: false });

      document.head.appendChild(script);
    });
  }

  function readChildGlobal(child) {
    if (!hasWindow()) return null;
    return window[child.globalKey] || null;
  }

  function normalizeTopology(child, api) {
    if (!api) return null;

    try {
      if (typeof api.getTopology === "function") {
        return api.getTopology();
      }

      if (api.topology && typeof api.topology === "object") {
        return api.topology;
      }
    } catch (error) {
      recordError(`child.${child.id}.getTopology`, error);
      return null;
    }

    return null;
  }

  async function loadTopologyChildren() {
    if (loadPromise) return loadPromise;

    state.childLoadStarted = true;
    publishReceipt("topology-children-load-start");

    loadPromise = (async () => {
      for (const child of CHILDREN) {
        if (!child.active) {
          state.childStatuses[child.id] = "staged";
          continue;
        }

        state.childStatuses[child.id] = "loading";
        publishReceipt(`topology-child-${child.id}-loading`);

        const result = await loadClassicScript(child.path);

        if (!result.loaded) {
          state.childStatuses[child.id] = "missing";
          recordError(`child.${child.id}`, `Topology child failed to load: ${child.path}`);
          continue;
        }

        const childApi = readChildGlobal(child);

        if (!childApi) {
          state.childStatuses[child.id] = "loaded_no_global";
          recordError(`child.${child.id}`, `Topology child loaded but did not publish expected global: ${child.globalKey}`);
          continue;
        }

        const topology = normalizeTopology(child, childApi);

        if (!topology || !Array.isArray(topology.landmasses)) {
          state.childStatuses[child.id] = "invalid_topology";
          recordError(`child.${child.id}`, "Topology child returned invalid topology object.");
          continue;
        }

        state.topologies[child.id] = topology;
        state.childStatuses[child.id] = "active";
      }

      state.localTopologyChildrenLoaded = Object.values(state.childStatuses).filter((status) => status === "active").length;
      state.childLoadComplete = true;

      publishReceipt("topology-children-load-complete");
      requestParentRender();

      return getStatus();
    })();

    return loadPromise;
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
    } catch (_error) {}
  }

  function drawLandmass(ctx, payload, landmass, topology) {
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];
    if (!boundary.length) return false;

    const projected = projectBoundary(payload, boundary, LAND_ELEVATION);

    if (!shapeVisibilityOk(projected, 0.5)) return false;

    const center = averageProjected(payload, boundary, LAND_ELEVATION);
    const alpha = depthAlpha(center.z, 0.025, 0.38);

    if (!center.visible || alpha <= 0.02) return false;

    ctx.save();

    if (drawClosedPath(ctx, projected)) {
      ctx.fillStyle = withAlpha(topology.color || COLORS.land, alpha, 0.72);
      ctx.fill();

      ctx.strokeStyle = withAlpha(COLORS.landStroke, alpha, 0.22);
      ctx.lineWidth = Math.max(1, payload.geometry.radius * 0.0028);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.restore();

    return true;
  }

  function drawTopologyClasses(ctx, payload, landmass) {
    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : [];
    const topology = landmass.topology || {};

    if (!boundary.length) return;

    for (const segment of topology.beaches || []) {
      drawBoundarySegment(ctx, payload, boundary, segment, COLORS.beach, 0.0048);
    }

    for (const segment of topology.cliffEdges || []) {
      drawBoundarySegment(ctx, payload, boundary, segment, COLORS.cliffEdge, 0.0042);
    }

    for (const segment of topology.bays || []) {
      drawBoundarySegment(ctx, payload, boundary, segment, COLORS.bay, 0.0045);
    }

    for (const segment of topology.inlets || []) {
      drawBoundarySegment(ctx, payload, boundary, segment, COLORS.inlet, 0.0038);
    }

    for (const segment of topology.peninsulas || []) {
      drawBoundarySegment(ctx, payload, boundary, segment, COLORS.peninsula, 0.0036);
    }

    for (const segment of topology.wetlands || []) {
      drawBoundarySegment(ctx, payload, boundary, segment, COLORS.wetland, 0.0042);
    }

    for (const point of topology.cavernMouths || []) {
      drawPointMarker(ctx, payload, point, COLORS.cavernMouth, 0.0062);
    }

    for (const lake of topology.lakes || []) {
      drawWaterBoundary(ctx, payload, lake, COLORS.lake, 0.34);
    }

    for (const lagoon of topology.lagoons || []) {
      drawWaterBoundary(ctx, payload, lagoon, COLORS.lagoon, 0.28);
    }
  }

  function drawTopology(ctx, payload, topology) {
    if (!topology || !Array.isArray(topology.landmasses)) return 0;

    let drawn = 0;

    for (const landmass of topology.landmasses) {
      const didDraw = drawLandmass(ctx, payload, landmass, topology);

      if (didDraw) {
        drawn += 1;
        drawTopologyClasses(ctx, payload, landmass);
      }
    }

    return drawn;
  }

  function draw(ctx, payload) {
    try {
      if (!validPayload(ctx, payload)) {
        publishReceipt("draw-skipped-invalid-parent-payload");
        return api;
      }

      parentContractSeen(payload);

      state.drawCount += 1;
      state.lastDrawSkippedReason = "";
      state.activeDrawnBodies = 0;

      if (!state.childLoadStarted) {
        loadTopologyChildren().catch((error) => recordError("loadTopologyChildren", error));
      }

      for (const topology of Object.values(state.topologies)) {
        state.activeDrawnBodies += drawTopology(ctx, payload, topology);
      }

      publishReceipt("draw");

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
      staged: Boolean(child.staged),
      status: state.childStatuses[child.id] || (child.active ? "pending" : "staged"),
      path: child.path
    }));
  }

  function getTopologySummary() {
    return Object.values(state.topologies).map((topology) => ({
      id: topology.id,
      summit: topology.summit,
      cells: topology.cells,
      localLattice: topology.localLattice,
      topologyOnly: topology.topologyOnly === true,
      terrainOwned: topology.terrainOwned === true,
      elevationOwned: topology.elevationOwned === true,
      landmassCount: Array.isArray(topology.landmasses) ? topology.landmasses.length : 0
    }));
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      childSplitContract: CHILD_SPLIT_CONTRACT,
      segmentContract: SEGMENT_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      previousChildRenewalContract: PREVIOUS_CHILD_RENEWAL_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      active: true,
      classicScript: true,
      segment: 1,
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      parentCompliance: true,
      parentFacingContractUnchanged: true,
      childObeysParentStandard: true,
      acceptsParentPayloadOnly: true,
      ownsFormVisible: false,
      ownsCanvas: false,
      ownsRoute: false,
      ownsOcean: false,
      localTopologyChildrenEnabled: true,
      localTopologyChildrenTotal: CHILDREN.length,
      localTopologyChildrenActive: CHILDREN.filter((child) => child.active).length,
      localTopologyChildrenLoaded: state.localTopologyChildrenLoaded,
      localTopologyChildrenStaged: state.localTopologyChildrenStaged,
      childLoadStarted: state.childLoadStarted,
      childLoadComplete: state.childLoadComplete,
      childStatuses: { ...state.childStatuses },
      topologySummary: getTopologySummary(),
      nineSummits256FibonacciModel: true,
      summitCount: 9,
      continentBodyCount: 9,
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
      categoriesAllowed: [
        "LANDMASS",
        "OCEAN_ADJACENCY",
        "BEACH",
        "CLIFF_EDGE",
        "CAVERN_MOUTH",
        "LAKE",
        "BAY",
        "INLET",
        "PENINSULA",
        "ISLAND",
        "LAGOON",
        "WETLAND"
      ],
      forbiddenInThisLayer: [
        "elevation",
        "terrain height",
        "mountains",
        "valleys",
        "basins",
        "raised cliffs",
        "3D caverns",
        "terrain shading",
        "ocean rendering",
        "sky rendering",
        "motion activation"
      ],
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
      lastParentContractSeen: state.lastParentContractSeen,
      lastDrawSkippedReason: state.lastDrawSkippedReason,
      owns: [
        "topology-only orchestration",
        "Nine Summits continent model",
        "89 of 256 exposed-land budget",
        "167 of 256 ocean/seawater relationship budget",
        "parent-compliant landmass boundary rendering",
        "topology category overlays",
        "child topology loading"
      ],
      doesNotOwn: [
        "FORM_VISIBLE",
        "parent geometry",
        "canvas creation",
        "route fallback",
        "runtime handoff",
        "parent mount",
        "ocean body",
        "sky",
        "motion",
        "terrain",
        "elevation",
        "zoom",
        "orbit"
      ],
      visualPassClaim: false,
      errors: state.errors.slice()
    };
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const receipt = {
      contract: CONTRACT,
      childSplitContract: CHILD_SPLIT_CONTRACT,
      segmentContract: SEGMENT_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      previousChildRenewalContract: PREVIOUS_CHILD_RENEWAL_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      mode: "g26_topology_only_continent_child_split_segment_1",
      scope,
      active: true,
      classicScript: true,
      segment: 1,
      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      parentCompliance: true,
      parentFacingContractUnchanged: true,
      childObeysParentStandard: true,
      acceptsParentPayloadOnly: true,
      ownsFormVisible: false,
      ownsCanvas: false,
      ownsRoute: false,
      ownsOcean: false,
      localTopologyChildrenEnabled: true,
      localTopologyChildrenTotal: CHILDREN.length,
      localTopologyChildrenActive: CHILDREN.filter((child) => child.active).length,
      localTopologyChildrenLoaded: state.localTopologyChildrenLoaded,
      localTopologyChildrenStaged: state.localTopologyChildrenStaged,
      childLoadStarted: state.childLoadStarted,
      childLoadComplete: state.childLoadComplete,
      childStatuses: { ...state.childStatuses },
      topologySummary: getTopologySummary(),
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      drawCount: state.drawCount,
      nineSummits256FibonacciModel: true,
      summitCount: 9,
      continentBodyCount: 9,
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
      visualPassClaim: false,
      formVisibleClaim: false,
      generatedImage: false,
      graphicBox: false,
      errors: state.errors.slice()
    };

    window.AUDRALIA_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_NINE_SUMMITS_CONTINENTS_RECEIPT = receipt;
    window.AUDRALIA_TOPOLOGY_ONLY_CONTINENTS_RECEIPT = receipt;

    try {
      window.dispatchEvent(new CustomEvent("audralia:continents:receipt", { detail: receipt }));
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:continents:receipt"));
      } catch (_ignored) {}
    }
  }

  const api = {
    CONTRACT,
    CHILD_SPLIT_CONTRACT,
    SEGMENT_CONTRACT,
    PARENT_COMPLIANCE_CONTRACT,
    PREVIOUS_CHILD_RENEWAL_CONTRACT,
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
    status: getStatus
  };

  if (hasWindow()) {
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
