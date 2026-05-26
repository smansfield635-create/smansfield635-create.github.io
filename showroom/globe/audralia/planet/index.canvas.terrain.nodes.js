// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.terrain.nodes.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_FILE_4_TERRAIN_NODES_COMPOSER_TNT_v1
//
// File 4 of 5 in the backward-build terrain strategy.
// Authority position:
// index.canvas.js
// └── index.canvas.terrain.nodes.js
//     ├── index.canvas.terrain.nodes.subterranean.js
//     ├── index.canvas.terrain.nodes.above-sea.js
//     └── index.canvas.terrain.nodes.boundary.js
//
// Owns:
// - terrain node baseline
// - 16 × 16 macro node grid
// - 256 terrain nodes
// - local 256-state lattice identity per node
// - computable Nine Summits influence
// - downstream child discovery
// - downstream grandchild refresh sequence
// - one canvas-safe terrain feed
//
// Does not own:
// - canvas rendering
// - canvas creation
// - drag / rotation
// - child authority recomputation
// - hydration
// - active water
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PLANET_FILE_4_TERRAIN_NODES_COMPOSER_TNT_v1";
  const SPEC_OPS = "AUDRALIA_PLANET_FILE_4_TERRAIN_NODES_COMPOSER_SPEC_OPS_v1";
  const CCR = "AUDRALIA_PLANET_FILE_4_TERRAIN_NODES_COMPOSER_CCR_v1";
  const FULL_PLAN = "AUDRALIA_PLANET_CANVAS_TERRAIN_BACKWARD_BUILD_FULL_PLAN_CCR_v1";

  const PREVIOUS_FILE_1_CONTRACT = "AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_TNT_v1";
  const PREVIOUS_FILE_2_CONTRACT = "AUDRALIA_PLANET_FILE_2_ABOVE_SEA_GRANDCHILD_TNT_v1";
  const PREVIOUS_FILE_3_CONTRACT = "AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.js";
  const PARENT_CANVAS = "/showroom/globe/audralia/planet/index.canvas.js";
  const API_NAME = "DGBAudraliaCanvasTerrainNodes";

  const MACRO_ROWS = 16;
  const MACRO_COLUMNS = 16;
  const MACRO_NODE_COUNT = 256;
  const LOCAL_LATTICE_ROWS = 16;
  const LOCAL_LATTICE_COLUMNS = 16;
  const LOCAL_STATE_COUNT = 256;
  const TOTAL_REPRESENTED_LOCAL_STATES = MACRO_NODE_COUNT * LOCAL_STATE_COUNT;
  const TAU = Math.PI * 2;

  const FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  const NINE_SUMMITS = Object.freeze([
    { summitId: "SUMMIT_01_CROWN", latitude: -20.0, longitude: 134.0, rank: 1.00, family: "central-crown" },
    { summitId: "SUMMIT_02_NORTH_GATE", latitude: -10.5, longitude: 132.0, rank: 0.82, family: "north-memory" },
    { summitId: "SUMMIT_03_EAST_RISE", latitude: -24.0, longitude: 150.0, rank: 0.78, family: "east-ridge" },
    { summitId: "SUMMIT_04_SOUTH_ANCHOR", latitude: -38.0, longitude: 137.0, rank: 0.76, family: "south-anchor" },
    { summitId: "SUMMIT_05_WEST_SHELF", latitude: -26.5, longitude: 114.0, rank: 0.74, family: "west-shelf" },
    { summitId: "SUMMIT_06_NORTHEAST_EDGE", latitude: -15.5, longitude: 146.5, rank: 0.68, family: "northeast-edge" },
    { summitId: "SUMMIT_07_SOUTHEAST_FAULT", latitude: -36.5, longitude: 148.5, rank: 0.66, family: "southeast-fault" },
    { summitId: "SUMMIT_08_SOUTHWEST_BASIN", latitude: -34.0, longitude: 117.5, rank: 0.62, family: "southwest-basin" },
    { summitId: "SUMMIT_09_INNER_BOWL", latitude: -27.0, longitude: 129.0, rank: 0.60, family: "inner-bowl" }
  ]);

  let nodePacket = null;
  let childPackets = null;
  let canvasTerrainFeed = null;
  let composing = false;
  let compositionCount = 0;

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  function round(value, places = 6) {
    const factor = 10 ** places;
    return Math.round(Number(value) * factor) / factor;
  }

  function toRad(degrees) {
    return (degrees / 180) * Math.PI;
  }

  function toDeg(radians) {
    return (radians / Math.PI) * 180;
  }

  function centeredSummitLongitude(longitude) {
    return toRad(longitude - 134.5);
  }

  function hash01(seed) {
    const number = Number(seed);
    const safeSeed = Number.isFinite(number) ? number : 1;
    const value = Math.sin(safeSeed * 127.117 + 311.731) * 43758.5453123;
    return value - Math.floor(value);
  }

  function safeDataset(key, value) {
    try {
      if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.dataset[key] = String(value);
      }
    } catch (_error) {}
  }

  function freezeArray(items) {
    return Object.freeze(items.map((item) => Object.freeze(item)));
  }

  function angularDistance(latA, lonA, latB, lonB) {
    const s1 = Math.sin(latA);
    const s2 = Math.sin(latB);
    const c1 = Math.cos(latA);
    const c2 = Math.cos(latB);
    return Math.acos(clamp(s1 * s2 + c1 * c2 * Math.cos(lonA - lonB), -1, 1));
  }

  function summitInfluence(latitude, longitude) {
    return NINE_SUMMITS.map((summit, index) => {
      const distance = angularDistance(
        latitude,
        longitude,
        toRad(summit.latitude),
        centeredSummitLongitude(summit.longitude)
      );

      const spread = 0.42 + summit.rank * 0.18;
      const influence = Math.exp(-(distance * distance) / (spread * spread)) * summit.rank;

      return Object.freeze({
        summitId: summit.summitId,
        family: summit.family,
        rank: summit.rank,
        influence: round(influence),
        order: index + 1
      });
    }).sort((a, b) => b.influence - a.influence || a.order - b.order);
  }

  function regionFamily(latitude, longitude, topSummit, row, column) {
    if (topSummit && topSummit.influence >= 0.42) return topSummit.family;
    if (row <= 3) return "northern-dry-memory";
    if (row >= 12) return "southern-datum-pressure";
    if (column <= 3) return "western-shelf";
    if (column >= 12) return "eastern-rise";
    if (latitude > -0.18) return "upper-interior-clay";
    if (latitude < -0.72) return "lower-interior-clay";
    if (longitude < -0.45) return "inner-west-basin";
    if (longitude > 0.45) return "inner-east-rise";
    return "interior-clay-mass";
  }

  function makeLocalLatticeSeed(macroState, fibonacci, primarySummitOrder, secondarySummitOrder) {
    return Math.floor(
      macroState * 977 +
      fibonacci * 13 +
      primarySummitOrder * 101 +
      secondarySummitOrder * 53
    );
  }

  function makeNode(row, column) {
    const v = (row + 0.5) / MACRO_ROWS;
    const latitude = Math.asin(1 - 2 * v);
    const longitude = (column / MACRO_COLUMNS) * TAU - Math.PI;
    const seatIndex = row * MACRO_COLUMNS + column;
    const macroState = seatIndex + 1;
    const fibonacci = FIBONACCI_SEQUENCE[row];
    const fibonacciPhase = fibonacci / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];

    const influences = summitInfluence(latitude, longitude);
    const primary = influences[0];
    const secondary = influences[1];

    const summitPressure = clamp(
      primary.influence * 0.72 +
      secondary.influence * 0.28,
      0,
      1
    );

    const latitudePressure = clamp(1 - Math.abs(Math.sin(latitude)) * 0.18, 0, 1);
    const deterministicTexture = hash01(macroState + row * 17 + column * 31);
    const edgePressure = clamp(
      (row <= 2 || row >= 13 ? 0.16 : 0) +
      (column <= 2 || column >= 13 ? 0.14 : 0),
      0,
      0.30
    );

    const terrainPotential = clamp(
      0.18 +
      summitPressure * 0.46 +
      latitudePressure * 0.10 +
      fibonacciPhase * 0.14 +
      deterministicTexture * 0.12,
      0,
      1
    );

    const subterraneanEligibility = clamp(
      0.22 +
      terrainPotential * 0.42 +
      summitPressure * 0.25 +
      deterministicTexture * 0.11,
      0,
      1
    );

    const aboveSeaEligibility = clamp(
      0.18 +
      terrainPotential * 0.48 +
      latitudePressure * 0.16 +
      summitPressure * 0.12 +
      deterministicTexture * 0.06,
      0,
      1
    );

    const boundaryEligibility = clamp(
      0.12 +
      edgePressure +
      (1 - terrainPotential) * 0.13 +
      deterministicTexture * 0.18 +
      (column % 4 === 0 || row % 4 === 0 ? 0.07 : 0.02),
      0,
      1
    );

    const localSeed = makeLocalLatticeSeed(
      macroState,
      fibonacci,
      primary.order,
      secondary.order
    );

    return Object.freeze({
      nodeId: "ATN-" + String(macroState).padStart(3, "0"),
      seatIndex,
      macroState,
      row,
      column,
      latitude: round(latitude),
      longitude: round(longitude),
      latitudeDeg: round(toDeg(latitude), 4),
      longitudeDeg: round(toDeg(longitude), 4),
      fibonacci,
      fibonacciPhase: round(fibonacciPhase),
      localLattice: Object.freeze({
        stateCount: LOCAL_STATE_COUNT,
        rows: LOCAL_LATTICE_ROWS,
        columns: LOCAL_LATTICE_COLUMNS,
        seed: localSeed,
        representation: "DETERMINISTIC_16_BY_16_LOCAL_STATE_LATTICE"
      }),
      regionFamily: regionFamily(latitude, longitude, primary, row, column),
      nineSummitsInfluence: Object.freeze(influences.slice(0, 4)),
      primarySummit: primary.summitId,
      secondarySummit: secondary.summitId,
      summitPressure: round(summitPressure),
      latitudePressure: round(latitudePressure),
      terrainPotential: round(terrainPotential),
      subterraneanEligibility: round(subterraneanEligibility),
      aboveSeaEligibility: round(aboveSeaEligibility),
      boundaryEligibility: round(boundaryEligibility),
      dryWorldStatus: "DRY_TERRAIN_NODE_READY",
      seaLevelDatumOnly: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      renders: false,
      finalVisualPass: false
    });
  }

  function buildNodes() {
    const nodes = [];

    for (let row = 0; row < MACRO_ROWS; row += 1) {
      for (let column = 0; column < MACRO_COLUMNS; column += 1) {
        nodes.push(makeNode(row, column));
      }
    }

    return freezeArray(nodes);
  }

  function makeNodePacket(nodes) {
    const receipt = Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      target: TARGET,
      parentCanvas: PARENT_CANVAS,
      nodeCount: nodes.length,
      macroRows: MACRO_ROWS,
      macroColumns: MACRO_COLUMNS,
      localStateCountPerNode: LOCAL_STATE_COUNT,
      totalRepresentedLocalStates: TOTAL_REPRESENTED_LOCAL_STATES,
      activeWater: false,
      hydration: false,
      finalVisualPass: false
    });

    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      ccr: CCR,
      fullPlan: FULL_PLAN,
      previousFile1Contract: PREVIOUS_FILE_1_CONTRACT,
      previousFile2Contract: PREVIOUS_FILE_2_CONTRACT,
      previousFile3Contract: PREVIOUS_FILE_3_CONTRACT,
      route: ROUTE,
      target: TARGET,
      role: "canvas-terrain-nodes-composer",
      parentCanvas: PARENT_CANVAS,
      macroRows: MACRO_ROWS,
      macroColumns: MACRO_COLUMNS,
      macroNodeCount: MACRO_NODE_COUNT,
      localLatticeRows: LOCAL_LATTICE_ROWS,
      localLatticeColumns: LOCAL_LATTICE_COLUMNS,
      localStateCountPerNode: LOCAL_STATE_COUNT,
      localStateModel: "256_GLOBAL_TERRAIN_NODES_WITH_256_STATE_LOCAL_LATTICE_PER_NODE",
      totalRepresentedLocalStates: TOTAL_REPRESENTED_LOCAL_STATES,
      nineSummitsGeographicAuthority: true,
      seaLevelDatum: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      renders: false,
      finalVisualPass: false,
      nodes,
      receipt
    });
  }

  function getPacketFromApi(apiName, methodName, globalName) {
    const api = window[apiName];

    if (api && typeof api[methodName] === "function") {
      try {
        const packet = api[methodName]();
        if (packet && typeof packet === "object") return packet;
      } catch (_error) {}
    }

    const globalPacket = window[globalName];
    if (globalPacket && typeof globalPacket === "object") return globalPacket;

    return null;
  }

  function refreshChild(apiName) {
    const api = window[apiName];

    if (api && typeof api.refresh === "function") {
      try {
        return api.refresh();
      } catch (_error) {
        return null;
      }
    }

    return null;
  }

  function inactiveChildPacket(label) {
    return Object.freeze({
      contract: label + "_MISSING",
      active: false,
      dependencyStatus: "MISSING_OR_INACTIVE",
      cells: Object.freeze([]),
      summary: Object.freeze({ cellCount: 0 }),
      receipt: Object.freeze({
        active: false,
        dependencyStatus: "MISSING_OR_INACTIVE"
      })
    });
  }

  function collectChildPackets() {
    const subterranean = getPacketFromApi(
      "DGBAudraliaCanvasTerrainNodesSubterranean",
      "getPacket",
      "AUDRALIA_CANVAS_TERRAIN_NODES_SUBTERRANEAN_PACKET"
    ) || inactiveChildPacket("SUBTERRANEAN");

    const aboveSea = getPacketFromApi(
      "DGBAudraliaCanvasTerrainNodesAboveSea",
      "getPacket",
      "AUDRALIA_CANVAS_TERRAIN_NODES_ABOVE_SEA_PACKET"
    ) || inactiveChildPacket("ABOVE_SEA");

    const boundary = getPacketFromApi(
      "DGBAudraliaCanvasTerrainNodesBoundary",
      "getPacket",
      "AUDRALIA_CANVAS_TERRAIN_NODES_BOUNDARY_PACKET"
    ) || inactiveChildPacket("BOUNDARY");

    return Object.freeze({
      subterranean,
      aboveSea,
      boundary
    });
  }

  function mapCells(cells) {
    const map = new Map();

    if (!Array.isArray(cells)) return map;

    for (const cell of cells) {
      if (cell && cell.nodeId) map.set(String(cell.nodeId), cell);
    }

    return map;
  }

  function computeFeedMode(children) {
    const subterraneanActive = Boolean(children.subterranean && children.subterranean.active);
    const aboveSeaActive = Boolean(children.aboveSea && children.aboveSea.active);
    const boundaryActive = Boolean(children.boundary && children.boundary.active);

    if (subterraneanActive && aboveSeaActive && boundaryActive) return "FULL_DRY_TERRAIN_CHAIN";
    if (aboveSeaActive && boundaryActive) return "NODE_PLUS_ABOVE_SEA_PLUS_BOUNDARY";
    if (aboveSeaActive) return "NODE_PLUS_ABOVE_SEA";
    if (subterraneanActive) return "NODE_PLUS_SUBTERRANEAN";
    return "NODE_BASELINE_ONLY";
  }

  function renderWeight(value, fallback = 0) {
    return round(clamp(value, 0, 1), 6);
  }

  function buildRenderableCells(nodes, children) {
    const subterraneanMap = mapCells(children.subterranean && children.subterranean.cells);
    const aboveSeaMap = mapCells(children.aboveSea && children.aboveSea.cells);
    const boundaryMap = mapCells(children.boundary && children.boundary.cells);

    return freezeArray(nodes.map((node) => {
      const sub = subterraneanMap.get(node.nodeId) || null;
      const above = aboveSeaMap.get(node.nodeId) || null;
      const boundary = boundaryMap.get(node.nodeId) || null;

      const subterraneanPressure = sub ? clamp(sub.subterraneanPressure, 0, 1) : 0;
      const elevation = above ? clamp(above.elevation, 0, 1) : 0;
      const boundaryScore = boundary ? clamp(boundary.boundaryScore, 0, 1) : 0;

      const pressureRenderWeight = renderWeight(subterraneanPressure);
      const elevationRenderWeight = renderWeight(elevation);
      const boundaryRenderWeight = renderWeight(boundaryScore);
      const terrainRenderWeight = renderWeight(
        node.terrainPotential * 0.32 +
        pressureRenderWeight * 0.20 +
        elevationRenderWeight * 0.30 +
        boundaryRenderWeight * 0.18
      );

      return {
        nodeId: node.nodeId,
        seatIndex: node.seatIndex,
        row: node.row,
        column: node.column,
        latitude: node.latitude,
        longitude: node.longitude,
        regionFamily: node.regionFamily,
        primarySummit: node.primarySummit,
        terrainPotential: node.terrainPotential,
        subterraneanClass: sub ? String(sub.subterraneanClass || "UNCLASSIFIED_SUBTERRANEAN") : "SUBTERRANEAN_HELD",
        subterraneanPressure: round(subterraneanPressure),
        elevation: round(elevation),
        elevationBand: above ? String(above.elevationBand || "ELEVATION_HELD") : "ELEVATION_HELD",
        landform: above ? String(above.landform || "LANDFORM_HELD") : "LANDFORM_HELD",
        boundaryClass: boundary ? String(boundary.boundaryClass || "BOUNDARY_HELD") : "BOUNDARY_HELD",
        boundaryScore: round(boundaryScore),
        beachCandidate: Boolean(boundary && boundary.isBeachCandidate),
        islandFragmentCandidate: Boolean(boundary && boundary.isIslandFragmentCandidate),
        terrainRenderWeight,
        pressureRenderWeight,
        elevationRenderWeight,
        boundaryRenderWeight,
        activeWater: false,
        hydration: false,
        finalVisualPass: false
      };
    }));
  }

  function summarizeFeed(nodes, renderableCells, children, mode) {
    const count = Math.max(1, renderableCells.length);

    const totals = renderableCells.reduce((acc, cell) => {
      acc.terrain += cell.terrainRenderWeight;
      acc.pressure += cell.pressureRenderWeight;
      acc.elevation += cell.elevationRenderWeight;
      acc.boundary += cell.boundaryRenderWeight;
      if (cell.beachCandidate) acc.beachCandidates += 1;
      if (cell.islandFragmentCandidate) acc.islandFragments += 1;
      acc.regionFamilies[cell.regionFamily] = (acc.regionFamilies[cell.regionFamily] || 0) + 1;
      acc.landforms[cell.landform] = (acc.landforms[cell.landform] || 0) + 1;
      acc.boundaryClasses[cell.boundaryClass] = (acc.boundaryClasses[cell.boundaryClass] || 0) + 1;
      return acc;
    }, {
      terrain: 0,
      pressure: 0,
      elevation: 0,
      boundary: 0,
      beachCandidates: 0,
      islandFragments: 0,
      regionFamilies: {},
      landforms: {},
      boundaryClasses: {}
    });

    return Object.freeze({
      feedMode: mode,
      nodeCount: nodes.length,
      renderableCellCount: renderableCells.length,
      averageTerrainRenderWeight: round(totals.terrain / count),
      averagePressureRenderWeight: round(totals.pressure / count),
      averageElevationRenderWeight: round(totals.elevation / count),
      averageBoundaryRenderWeight: round(totals.boundary / count),
      beachCandidateCount: totals.beachCandidates,
      islandFragmentCandidateCount: totals.islandFragments,
      subterraneanActive: Boolean(children.subterranean && children.subterranean.active),
      aboveSeaActive: Boolean(children.aboveSea && children.aboveSea.active),
      boundaryActive: Boolean(children.boundary && children.boundary.active),
      regionFamilyCounts: Object.freeze({ ...totals.regionFamilies }),
      landformCounts: Object.freeze({ ...totals.landforms }),
      boundaryClassCounts: Object.freeze({ ...totals.boundaryClasses })
    });
  }

  function makeCanvasTerrainFeed(children) {
    const nodes = nodePacket.nodes || [];
    const mode = computeFeedMode(children);
    const renderableCells = buildRenderableCells(nodes, children);

    const receipt = Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      parentCanvas: PARENT_CANVAS,
      feedRole: "canvas-safe-terrain-feed",
      feedMode: mode,
      terrainNodesActive: true,
      subterraneanActive: Boolean(children.subterranean && children.subterranean.active),
      aboveSeaActive: Boolean(children.aboveSea && children.aboveSea.active),
      boundaryActive: Boolean(children.boundary && children.boundary.active),
      nodeCount: nodes.length,
      renderableCellCount: renderableCells.length,
      activeWater: false,
      hydration: false,
      finalVisualPass: false,
      compositionCount
    });

    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      ccr: CCR,
      fullPlan: FULL_PLAN,
      route: ROUTE,
      parentCanvas: PARENT_CANVAS,
      feedRole: "canvas-safe-terrain-feed",
      feedMode: mode,
      terrainNodesActive: true,
      subterraneanActive: Boolean(children.subterranean && children.subterranean.active),
      aboveSeaActive: Boolean(children.aboveSea && children.aboveSea.active),
      boundaryActive: Boolean(children.boundary && children.boundary.active),
      seaLevelDatum: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      finalVisualPass: false,
      nodeCount: nodes.length,
      localStateModel: nodePacket.localStateModel,
      terrainCells: nodes,
      renderableCells,
      summary: summarizeFeed(nodes, renderableCells, children, mode),
      childPackets: children,
      receipt
    });
  }

  function publishNodePacket() {
    window.AUDRALIA_CANVAS_TERRAIN_NODES_PACKET = nodePacket;
    window.AUDRALIA_CANVAS_TERRAIN_NODES_RECEIPT = nodePacket.receipt;

    safeDataset("audraliaCanvasTerrainNodesContract", CONTRACT);
    safeDataset("audraliaCanvasTerrainNodesActive", "true");
    safeDataset("audraliaCanvasTerrainNodeCount", nodePacket.nodes.length);
    safeDataset("audraliaCanvasTerrainLocalStateModel", nodePacket.localStateModel);
    safeDataset("audraliaCanvasTerrainActiveWater", "false");
    safeDataset("audraliaCanvasTerrainHydration", "false");
    safeDataset("audraliaCanvasTerrainFinalVisualPass", "false");
  }

  function publishFeed() {
    window.AUDRALIA_CANVAS_TERRAIN_FEED_PACKET = canvasTerrainFeed;

    safeDataset("audraliaCanvasTerrainFeedActive", canvasTerrainFeed ? "true" : "false");
    safeDataset("audraliaCanvasTerrainFeedMode", canvasTerrainFeed ? canvasTerrainFeed.feedMode : "UNBUILT");
    safeDataset("audraliaCanvasTerrainSubterraneanActive", canvasTerrainFeed && canvasTerrainFeed.subterraneanActive ? "true" : "false");
    safeDataset("audraliaCanvasTerrainAboveSeaActive", canvasTerrainFeed && canvasTerrainFeed.aboveSeaActive ? "true" : "false");
    safeDataset("audraliaCanvasTerrainBoundaryActive", canvasTerrainFeed && canvasTerrainFeed.boundaryActive ? "true" : "false");
    safeDataset("audraliaCanvasTerrainActiveWater", "false");
    safeDataset("audraliaCanvasTerrainHydration", "false");
    safeDataset("audraliaCanvasTerrainFinalVisualPass", "false");
  }

  function refreshComposition() {
    if (composing) {
      return canvasTerrainFeed || status();
    }

    composing = true;

    try {
      compositionCount += 1;

      publishNodePacket();

      refreshChild("DGBAudraliaCanvasTerrainNodesSubterranean");
      refreshChild("DGBAudraliaCanvasTerrainNodesAboveSea");
      refreshChild("DGBAudraliaCanvasTerrainNodesBoundary");

      childPackets = collectChildPackets();
      canvasTerrainFeed = makeCanvasTerrainFeed(childPackets);

      publishFeed();

      return canvasTerrainFeed;
    } finally {
      composing = false;
    }
  }

  function getNodePacket() {
    return nodePacket;
  }

  function getNode(nodeIdOrIndex) {
    if (typeof nodeIdOrIndex === "number") {
      const index = clamp(Math.floor(nodeIdOrIndex), 0, nodePacket.nodes.length - 1);
      return nodePacket.nodes[index] || null;
    }

    const id = String(nodeIdOrIndex || "");
    return nodePacket.nodes.find((node) => node.nodeId === id) || null;
  }

  function getLocalState(nodeIdOrIndex, localStateIndex) {
    const node = getNode(nodeIdOrIndex);
    const index = clamp(Math.floor(Number(localStateIndex)), 0, LOCAL_STATE_COUNT - 1);
    const row = Math.floor(index / LOCAL_LATTICE_COLUMNS);
    const column = index % LOCAL_LATTICE_COLUMNS;

    if (!node) {
      return Object.freeze({
        nodeId: "UNKNOWN",
        localStateIndex: index,
        row,
        column,
        localRole: "missing-node",
        pressureSignal: 0,
        oppositionSignal: 0,
        dryState: true,
        activeWater: false
      });
    }

    const seed = node.localLattice.seed;
    const pressureSignal = hash01(seed + index * 17);
    const oppositionSignal = hash01(seed + index * 29 + 7);
    const roleList = [
      "subterranean-pressure",
      "uplift-memory",
      "ridge-vector",
      "basin-vector",
      "plateau-seat",
      "boundary-sensitivity",
      "summit-alignment",
      "dry-mass-carrier"
    ];

    return Object.freeze({
      nodeId: node.nodeId,
      localStateIndex: index,
      row,
      column,
      localRole: roleList[Math.floor(pressureSignal * roleList.length) % roleList.length],
      pressureSignal: round(pressureSignal),
      oppositionSignal: round(oppositionSignal),
      dryState: true,
      activeWater: false
    });
  }

  function getChildPackets() {
    return childPackets || collectChildPackets();
  }

  function getCanvasTerrainFeed() {
    return canvasTerrainFeed || refreshComposition();
  }

  function status() {
    const feed = canvasTerrainFeed;

    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      ccr: CCR,
      fullPlan: FULL_PLAN,
      route: ROUTE,
      target: TARGET,
      parentCanvas: PARENT_CANVAS,
      active: true,
      terrainNodesActive: Boolean(nodePacket && nodePacket.nodes && nodePacket.nodes.length === MACRO_NODE_COUNT),
      nodeCount: nodePacket && nodePacket.nodes ? nodePacket.nodes.length : 0,
      localStateModel: nodePacket ? nodePacket.localStateModel : "UNBUILT",
      totalRepresentedLocalStates: TOTAL_REPRESENTED_LOCAL_STATES,
      feedActive: Boolean(feed),
      feedMode: feed ? feed.feedMode : "UNBUILT",
      subterraneanActive: Boolean(feed && feed.subterraneanActive),
      aboveSeaActive: Boolean(feed && feed.aboveSeaActive),
      boundaryActive: Boolean(feed && feed.boundaryActive),
      compositionCount,
      composing,
      seaLevelDatum: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      renders: false,
      finalVisualPass: false
    });
  }

  nodePacket = makeNodePacket(buildNodes());

  window[API_NAME] = Object.freeze({
    contract: CONTRACT,
    getNodePacket,
    getNode,
    getLocalState,
    getChildPackets,
    getCanvasTerrainFeed,
    refreshComposition,
    status
  });

  publishNodePacket();
  refreshComposition();
})();
