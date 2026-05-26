// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.terrain.nodes.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_FILE_4B_TERRAIN_NODES_DISPLAY_PACKET_COMPOSER_TNT_v1
//
// Direct child display-packet composer.
// Canvas remains display-only.
// This file owns downstream meaning translation into neutral canvas primitives.
//
// Owns:
// - terrain node baseline
// - 16 × 16 macro node grid
// - 256 terrain nodes
// - local 256-state lattice identity per node
// - computable Nine Summits influence
// - downstream child discovery and packet collection
// - canvas-safe terrain feed
// - canvas-ready display packet
//
// Does not own:
// - canvas rendering
// - canvas creation
// - drag / rotation
// - hydration
// - active water
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PLANET_FILE_4B_TERRAIN_NODES_DISPLAY_PACKET_COMPOSER_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_PLANET_FILE_4_TERRAIN_NODES_COMPOSER_TNT_v1";
  const SPEC_OPS = "AUDRALIA_PLANET_DISPLAY_ONLY_CANVAS_AND_DOWNSTREAM_DISPLAY_PACKET_SPEC_OPS_v1";
  const NEWS = "AUDRALIA_PLANET_DISPLAY_ONLY_CANVAS_AND_DOWNSTREAM_DISPLAY_PACKET_NEWS_v1";
  const CCR = "AUDRALIA_PLANET_DISPLAY_ONLY_CANVAS_AND_DOWNSTREAM_DISPLAY_PACKET_CCR_v1";

  const PREVIOUS_FILE_1_CONTRACT = "AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_TNT_v1";
  const PREVIOUS_FILE_2_CONTRACT = "AUDRALIA_PLANET_FILE_2_ABOVE_SEA_GRANDCHILD_TNT_v1";
  const PREVIOUS_FILE_3_CONTRACT = "AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.js";
  const PARENT_CANVAS = "/showroom/globe/audralia/planet/index.canvas.js";
  const API_NAME = "DGBAudraliaCanvasTerrainNodes";
  const PRIMITIVE_PROTOCOL = "AUDRALIA_CANVAS_DISPLAY_PRIMITIVES_v1";

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
  let canvasDisplayPacket = null;
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

    const summitPressure = clamp(primary.influence * 0.72 + secondary.influence * 0.28, 0, 1);
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
        seed: makeLocalLatticeSeed(macroState, fibonacci, primary.order, secondary.order),
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
      previousContract: PREVIOUS_CONTRACT,
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
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      previousFile1Contract: PREVIOUS_FILE_1_CONTRACT,
      previousFile2Contract: PREVIOUS_FILE_2_CONTRACT,
      previousFile3Contract: PREVIOUS_FILE_3_CONTRACT,
      route: ROUTE,
      target: TARGET,
      role: "canvas-terrain-nodes-display-packet-composer",
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

    return Object.freeze({ subterranean, aboveSea, boundary });
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
    return round(clamp(Number.isFinite(Number(value)) ? value : fallback, 0, 1), 6);
  }

  function buildRenderableCells(nodes, children) {
    const subterraneanMap = mapCells(children.subterranean && children.subterranean.cells);
    const aboveSeaMap = mapCells(children.aboveSea && children.aboveSea.cells);
    const boundaryMap = mapCells(children.boundary && children.boundary.cells);

    return freezeArray(nodes.map((node) => {
      const sub = subterraneanMap.get(node.nodeId) || null;
      const above = aboveSeaMap.get(node.nodeId) || null;
      const boundary = boundaryMap.get(node.nodeId) || null;

      const subterraneanPressure = sub ? clamp(sub.subterraneanPressure, 0, 1) : node.subterraneanEligibility;
      const elevation = above ? clamp(above.elevation, 0, 1) : node.aboveSeaEligibility * 0.42;
      const boundaryScore = boundary ? clamp(boundary.boundaryScore, 0, 1) : node.boundaryEligibility * 0.55;

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
        subterraneanClass: sub ? String(sub.subterraneanClass || "UNCLASSIFIED_SUBTERRANEAN") : "SUBTERRANEAN_NODE_BASELINE",
        subterraneanPressure: round(subterraneanPressure),
        elevation: round(elevation),
        elevationBand: above ? String(above.elevationBand || "ELEVATION_NODE_BASELINE") : "ELEVATION_NODE_BASELINE",
        landform: above ? String(above.landform || "LANDFORM_NODE_BASELINE") : "LANDFORM_NODE_BASELINE",
        boundaryClass: boundary ? String(boundary.boundaryClass || "BOUNDARY_NODE_BASELINE") : "BOUNDARY_NODE_BASELINE",
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
      previousContract: PREVIOUS_CONTRACT,
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
      previousContract: PREVIOUS_CONTRACT,
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

  function colorForCell(cell, group) {
    const terrain = clamp(cell.terrainRenderWeight, 0, 1);
    const pressure = clamp(cell.pressureRenderWeight, 0, 1);
    const elevation = clamp(cell.elevationRenderWeight, 0, 1);
    const boundary = clamp(cell.boundaryRenderWeight, 0, 1);

    if (group === "pressure") {
      return `rgba(${Math.round(70 + pressure * 52)},${Math.round(54 + pressure * 38)},${Math.round(36 + pressure * 24)},1)`;
    }

    if (group === "elevation") {
      return `rgba(${Math.round(156 + elevation * 72)},${Math.round(116 + elevation * 54)},${Math.round(66 + elevation * 38)},1)`;
    }

    if (group === "boundary") {
      return `rgba(${Math.round(196 + boundary * 42)},${Math.round(165 + boundary * 38)},${Math.round(96 + boundary * 28)},1)`;
    }

    if (group === "texture") {
      return `rgba(${Math.round(88 + terrain * 70)},${Math.round(74 + terrain * 50)},${Math.round(50 + terrain * 30)},1)`;
    }

    return `rgba(${Math.round(118 + terrain * 80)},${Math.round(91 + terrain * 58)},${Math.round(58 + terrain * 40)},1)`;
  }

  function modeWeight(body, surface, terrain, lattice, receipt) {
    return Object.freeze({
      body: round(body, 3),
      surface: round(surface, 3),
      terrain: round(terrain, 3),
      lattice: round(lattice, 3),
      receipt: round(receipt, 3)
    });
  }

  function primitiveBase(type, id, group) {
    return {
      type,
      id,
      group,
      activeWater: false,
      hydration: false,
      finalVisualPass: false
    };
  }

  function makeDisplayPrimitives(feed) {
    const cells = Array.isArray(feed && feed.renderableCells) ? feed.renderableCells : [];
    const primitives = [];

    for (const cell of cells) {
      const terrain = clamp(cell.terrainRenderWeight, 0, 1);
      const pressure = clamp(cell.pressureRenderWeight, 0, 1);
      const elevation = clamp(cell.elevationRenderWeight, 0, 1);
      const boundary = clamp(cell.boundaryRenderWeight, 0, 1);
      const lat = round(cell.latitude, 6);
      const lon = round(cell.longitude, 6);

      primitives.push(Object.freeze({
        ...primitiveBase("ellipse", cell.nodeId + "-baseMass", "baseMass"),
        lat,
        lon,
        width: round(0.042 + terrain * 0.055),
        height: round(0.024 + elevation * 0.045),
        rotation: round(lon + pressure * 0.42),
        fill: colorForCell(cell, "baseMass"),
        stroke: "rgba(255,232,163,.18)",
        lineWidth: round(0.35 + terrain * 0.45),
        alpha: round(0.34 + terrain * 0.42),
        modeWeight: modeWeight(0.30, 0.54, 0.86, 0.14, 0.34),
        zWeight: round(0.48 + terrain * 0.34)
      }));

      primitives.push(Object.freeze({
        ...primitiveBase("ellipse", cell.nodeId + "-pressure", "pressure"),
        lat,
        lon,
        width: round(0.030 + pressure * 0.052),
        height: round(0.016 + pressure * 0.030),
        rotation: round(lon + pressure * 0.72),
        fill: colorForCell(cell, "pressure"),
        stroke: "rgba(43,31,22,.40)",
        lineWidth: round(0.28 + pressure * 0.55),
        alpha: round(0.18 + pressure * 0.46),
        modeWeight: modeWeight(0.12, 0.36, 0.92, 0.08, 0.30),
        zWeight: round(0.50 + pressure * 0.38)
      }));

      if (elevation >= 0.18) {
        primitives.push(Object.freeze({
          ...primitiveBase("textureStroke", cell.nodeId + "-elevation-texture", "elevation"),
          lat,
          lon,
          length: round(0.032 + elevation * 0.060),
          angle: round(lon + 0.72 + elevation * 0.32),
          stroke: colorForCell(cell, "elevation"),
          lineWidth: round(0.42 + elevation * 0.72),
          alpha: round(0.22 + elevation * 0.48),
          modeWeight: modeWeight(0.06, 0.44, 1.00, 0.10, 0.28),
          zWeight: round(0.55 + elevation * 0.38)
        }));
      }

      if (boundary >= 0.22) {
        primitives.push(Object.freeze({
          ...primitiveBase("ring", cell.nodeId + "-boundary-ring", "boundary"),
          lat,
          lon,
          radiusX: round(0.014 + boundary * 0.040),
          radiusY: round(0.006 + boundary * 0.018),
          rotation: round(lon + 1.05),
          stroke: colorForCell(cell, "boundary"),
          lineWidth: round(0.36 + boundary * 0.50),
          alpha: round(0.18 + boundary * 0.42),
          modeWeight: modeWeight(0.05, 0.34, 0.94, 0.08, 0.22),
          zWeight: round(0.48 + boundary * 0.38)
        }));
      }

      if (cell.islandFragmentCandidate || boundary >= 0.68) {
        primitives.push(Object.freeze({
          ...primitiveBase("point", cell.nodeId + "-fragment-point", "texture"),
          lat: round(lat + 0.010 * (hash01(cell.seatIndex + 9) - 0.5)),
          lon: round(lon + 0.014 * (hash01(cell.seatIndex + 21) - 0.5)),
          radius: round(0.004 + boundary * 0.011),
          fill: colorForCell(cell, "texture"),
          alpha: round(0.18 + boundary * 0.34),
          modeWeight: modeWeight(0.04, 0.28, 0.72, 0.05, 0.22),
          zWeight: round(0.44 + boundary * 0.30)
        }));
      }
    }

    const summitNodes = nodePacket.nodes
      .filter((node) => node.summitPressure >= 0.34)
      .sort((a, b) => b.summitPressure - a.summitPressure)
      .slice(0, 18);

    for (const node of summitNodes) {
      primitives.push(Object.freeze({
        ...primitiveBase("point", node.nodeId + "-summit-point", "elevation"),
        lat: node.latitude,
        lon: node.longitude,
        radius: round(0.006 + node.summitPressure * 0.014),
        fill: "rgba(238,199,112,1)",
        alpha: round(0.22 + node.summitPressure * 0.44),
        modeWeight: modeWeight(0.08, 0.42, 0.94, 0.10, 0.26),
        zWeight: round(0.62 + node.summitPressure * 0.30)
      }));
    }

    primitives.push(Object.freeze({
      ...primitiveBase("ring", "receipt-sphere-ring", "receipt"),
      lat: 0,
      lon: 0,
      radiusX: 1.018,
      radiusY: 1.018,
      rotation: 0,
      stroke: "rgba(244,207,131,.48)",
      lineWidth: 1.1,
      alpha: 0.44,
      modeWeight: modeWeight(0.00, 0.00, 0.08, 0.00, 1.00),
      zWeight: 1
    }));

    return freezeArray(primitives);
  }

  function summarizePrimitives(primitives) {
    const groups = {};

    for (const primitive of primitives) {
      groups[primitive.group] = (groups[primitive.group] || 0) + 1;
    }

    return Object.freeze({
      primitiveCount: primitives.length,
      primitiveGroups: Object.freeze({ ...groups }),
      primitiveTypes: Object.freeze(primitives.reduce((acc, primitive) => {
        acc[primitive.type] = (acc[primitive.type] || 0) + 1;
        return acc;
      }, {}))
    });
  }

  function makeCanvasDisplayPacket(feed) {
    const primitives = makeDisplayPrimitives(feed);
    const primitiveSummary = summarizePrimitives(primitives);

    const receipt = Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      target: TARGET,
      parentCanvas: PARENT_CANVAS,
      displayRole: "canvas-ready-display-packet",
      primitiveProtocol: PRIMITIVE_PROTOCOL,
      primitiveCount: primitives.length,
      primitiveGroups: primitiveSummary.primitiveGroups,
      feedMode: feed.feedMode,
      activeWater: false,
      hydration: false,
      finalVisualPass: false,
      compositionCount
    });

    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      target: TARGET,
      parentCanvas: PARENT_CANVAS,
      displayRole: "canvas-ready-display-packet",
      primitiveProtocol: PRIMITIVE_PROTOCOL,
      displayPacketActive: true,
      feedMode: feed.feedMode,
      terrainNodesActive: true,
      subterraneanActive: Boolean(feed.subterraneanActive),
      aboveSeaActive: Boolean(feed.aboveSeaActive),
      boundaryActive: Boolean(feed.boundaryActive),
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      finalVisualPass: false,
      primitiveCount: primitives.length,
      primitiveGroups: primitiveSummary.primitiveGroups,
      primitiveTypes: primitiveSummary.primitiveTypes,
      primitives,
      summary: Object.freeze({
        ...primitiveSummary,
        terrainFeedSummary: feed.summary
      }),
      receipt
    });
  }

  function publishNodePacket() {
    window.AUDRALIA_CANVAS_TERRAIN_NODES_PACKET = nodePacket;
    window.AUDRALIA_CANVAS_TERRAIN_NODES_RECEIPT = nodePacket.receipt;

    safeDataset("audraliaCanvasTerrainNodesContract", CONTRACT);
    safeDataset("audraliaCanvasTerrainNodesPreviousContract", PREVIOUS_CONTRACT);
    safeDataset("audraliaCanvasTerrainNodesActive", "true");
    safeDataset("audraliaCanvasTerrainNodeCount", nodePacket.nodes.length);
    safeDataset("audraliaCanvasTerrainLocalStateModel", nodePacket.localStateModel);
    safeDataset("audraliaCanvasTerrainActiveWater", "false");
    safeDataset("audraliaCanvasTerrainHydration", "false");
    safeDataset("audraliaCanvasTerrainFinalVisualPass", "false");
  }

  function publishFeed() {
    window.AUDRALIA_CANVAS_TERRAIN_FEED_PACKET = canvasTerrainFeed;
    window.AUDRALIA_CANVAS_DISPLAY_PACKET = canvasDisplayPacket;
    window.AUDRALIA_CANVAS_DISPLAY_PACKET_RECEIPT = canvasDisplayPacket ? canvasDisplayPacket.receipt : null;

    safeDataset("audraliaCanvasTerrainFeedActive", canvasTerrainFeed ? "true" : "false");
    safeDataset("audraliaCanvasTerrainFeedMode", canvasTerrainFeed ? canvasTerrainFeed.feedMode : "UNBUILT");
    safeDataset("audraliaCanvasTerrainSubterraneanActive", canvasTerrainFeed && canvasTerrainFeed.subterraneanActive ? "true" : "false");
    safeDataset("audraliaCanvasTerrainAboveSeaActive", canvasTerrainFeed && canvasTerrainFeed.aboveSeaActive ? "true" : "false");
    safeDataset("audraliaCanvasTerrainBoundaryActive", canvasTerrainFeed && canvasTerrainFeed.boundaryActive ? "true" : "false");
    safeDataset("audraliaCanvasDisplayPacketActive", canvasDisplayPacket ? "true" : "false");
    safeDataset("audraliaCanvasDisplayPrimitiveProtocol", PRIMITIVE_PROTOCOL);
    safeDataset("audraliaCanvasDisplayPrimitiveCount", canvasDisplayPacket ? canvasDisplayPacket.primitiveCount : 0);
    safeDataset("audraliaCanvasDisplayPrimitiveGroups", canvasDisplayPacket ? Object.keys(canvasDisplayPacket.primitiveGroups).join(",") : "");
    safeDataset("audraliaCanvasTerrainActiveWater", "false");
    safeDataset("audraliaCanvasTerrainHydration", "false");
    safeDataset("audraliaCanvasTerrainFinalVisualPass", "false");
  }

  function refreshComposition() {
    if (composing) {
      return canvasDisplayPacket || canvasTerrainFeed || status();
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
      canvasDisplayPacket = makeCanvasDisplayPacket(canvasTerrainFeed);

      publishFeed();

      return canvasDisplayPacket;
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
    if (!canvasTerrainFeed) refreshComposition();
    return canvasTerrainFeed;
  }

  function getCanvasDisplayPacket() {
    if (!canvasDisplayPacket) refreshComposition();
    return canvasDisplayPacket;
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      specOps: SPEC_OPS,
      news: NEWS,
      ccr: CCR,
      route: ROUTE,
      target: TARGET,
      parentCanvas: PARENT_CANVAS,
      active: true,
      terrainNodesActive: Boolean(nodePacket && nodePacket.nodes && nodePacket.nodes.length === MACRO_NODE_COUNT),
      nodeCount: nodePacket && nodePacket.nodes ? nodePacket.nodes.length : 0,
      localStateModel: nodePacket ? nodePacket.localStateModel : "UNBUILT",
      totalRepresentedLocalStates: TOTAL_REPRESENTED_LOCAL_STATES,
      feedActive: Boolean(canvasTerrainFeed),
      feedMode: canvasTerrainFeed ? canvasTerrainFeed.feedMode : "UNBUILT",
      displayPacketActive: Boolean(canvasDisplayPacket),
      primitiveProtocol: PRIMITIVE_PROTOCOL,
      primitiveCount: canvasDisplayPacket ? canvasDisplayPacket.primitiveCount : 0,
      primitiveGroups: canvasDisplayPacket ? canvasDisplayPacket.primitiveGroups : Object.freeze({}),
      subterraneanActive: Boolean(canvasTerrainFeed && canvasTerrainFeed.subterraneanActive),
      aboveSeaActive: Boolean(canvasTerrainFeed && canvasTerrainFeed.aboveSeaActive),
      boundaryActive: Boolean(canvasTerrainFeed && canvasTerrainFeed.boundaryActive),
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
    previousContract: PREVIOUS_CONTRACT,
    primitiveProtocol: PRIMITIVE_PROTOCOL,
    getNodePacket,
    getNode,
    getLocalState,
    getChildPackets,
    getCanvasTerrainFeed,
    getCanvasDisplayPacket,
    refreshComposition,
    status
  });

  publishNodePacket();
  refreshComposition();
})();
