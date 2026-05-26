// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.terrain.nodes.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_FILE_4C_STRUCTURAL_SPIRAL_NODE_MAP_TNT_v1
//
// Direct child structural spiral-node map.
// Corrects File 4B bubble artifacts by suppressing premature visible primitives.
//
// Owns:
// - 256 macro terrain nodes.
// - 256 internal spiral lattice seats per macro node.
// - 65,536 assignable structural spiral coordinates.
// - four node-size classes.
// - subterranean depth tiers.
// - above-sea height tiers.
// - boundary tiers.
// - neighbor links.
// - child assignment maps.
// - valid debug-safe display packet for File 5B.
//
// Does not own:
// - canvas drawing.
// - visible terrain expression.
// - water.
// - hydration.
// - final visual pass.

(() => {
  "use strict";

  if (typeof window === "undefined") return;

  const CONTRACT = "AUDRALIA_PLANET_FILE_4C_STRUCTURAL_SPIRAL_NODE_MAP_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_PLANET_FILE_4B_TERRAIN_NODES_DISPLAY_PACKET_COMPOSER_TNT_v1";
  const PARENT_CANVAS_CONTRACT = "AUDRALIA_PLANET_FILE_5B_DISPLAY_ONLY_CANVAS_INTERPRETER_TNT_v1";
  const PRIMITIVE_PROTOCOL = "AUDRALIA_CANVAS_DISPLAY_PRIMITIVES_v1";

  const FILE_1_CONTRACT = "AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_TNT_v1";
  const FILE_2_CONTRACT = "AUDRALIA_PLANET_FILE_2_ABOVE_SEA_GRANDCHILD_TNT_v1";
  const FILE_3_CONTRACT = "AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.js";
  const PARENT_CANVAS = "/showroom/globe/audralia/planet/index.canvas.js";
  const API_NAME = "DGBAudraliaCanvasTerrainNodes";

  const MACRO_ROWS = 16;
  const MACRO_COLUMNS = 16;
  const MACRO_NODE_COUNT = 256;
  const SPIRAL_SEATS_PER_NODE = 256;
  const TOTAL_SPIRAL_SEATS = MACRO_NODE_COUNT * SPIRAL_SEATS_PER_NODE;
  const TAU = Math.PI * 2;
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

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

  const DIRECTIONS = Object.freeze([
    { direction: "N", dr: -1, dc: 0 },
    { direction: "NE", dr: -1, dc: 1 },
    { direction: "E", dr: 0, dc: 1 },
    { direction: "SE", dr: 1, dc: 1 },
    { direction: "S", dr: 1, dc: 0 },
    { direction: "SW", dr: 1, dc: -1 },
    { direction: "W", dr: 0, dc: -1 },
    { direction: "NW", dr: -1, dc: -1 }
  ]);

  let structuralNodeMap = null;
  let nodePacket = null;
  let canvasTerrainFeed = null;
  let canvasDisplayPacket = null;
  let childPackets = null;
  let compositionCount = 0;
  let composing = false;

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function round(value, places = 6) {
    const factor = 10 ** places;
    return Math.round(finite(value, 0) * factor) / factor;
  }

  function toRad(degrees) {
    return (finite(degrees, 0) / 180) * Math.PI;
  }

  function toDeg(radians) {
    return (finite(radians, 0) / Math.PI) * 180;
  }

  function centeredTemplateLon(longitude) {
    return toRad(longitude - 134.5);
  }

  function hash01(seed) {
    const safe = finite(seed, 1);
    const value = Math.sin(safe * 127.117 + 311.731) * 43758.5453123;
    return value - Math.floor(value);
  }

  function freezeArray(items) {
    return Object.freeze(items.map((item) => Object.freeze(item)));
  }

  function safeDataset(key, value) {
    try {
      if (document && document.documentElement) {
        document.documentElement.dataset[key] = String(value);
      }
    } catch (_error) {}
  }

  function angularDistance(latA, lonA, latB, lonB) {
    const s1 = Math.sin(latA);
    const s2 = Math.sin(latB);
    const c1 = Math.cos(latA);
    const c2 = Math.cos(latB);
    return Math.acos(clamp(s1 * s2 + c1 * c2 * Math.cos(lonA - lonB), -1, 1));
  }

  function macroNodeId(index) {
    return "ATN-" + String(index + 1).padStart(3, "0");
  }

  function spiralSeatId(index) {
    return "SL-" + String(index + 1).padStart(3, "0");
  }

  function spiralAddress(nodeId, spiralIndex) {
    return nodeId + "." + spiralSeatId(spiralIndex);
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
        api.refresh();
      } catch (_error) {}
    }

    if (api && typeof api.refreshComposition === "function") {
      try {
        api.refreshComposition();
      } catch (_error) {}
    }
  }

  function inactiveChildPacket(label) {
    return Object.freeze({
      contract: label + "_MISSING",
      active: false,
      cells: Object.freeze([]),
      summary: Object.freeze({ cellCount: 0 }),
      receipt: Object.freeze({
        active: false,
        dependencyStatus: "MISSING_OR_INACTIVE"
      })
    });
  }

  function collectChildPackets() {
    refreshChild("DGBAudraliaCanvasTerrainNodesSubterranean");
    refreshChild("DGBAudraliaCanvasTerrainNodesAboveSea");
    refreshChild("DGBAudraliaCanvasTerrainNodesBoundary");

    return Object.freeze({
      subterranean: getPacketFromApi(
        "DGBAudraliaCanvasTerrainNodesSubterranean",
        "getPacket",
        "AUDRALIA_CANVAS_TERRAIN_NODES_SUBTERRANEAN_PACKET"
      ) || inactiveChildPacket("SUBTERRANEAN"),

      aboveSea: getPacketFromApi(
        "DGBAudraliaCanvasTerrainNodesAboveSea",
        "getPacket",
        "AUDRALIA_CANVAS_TERRAIN_NODES_ABOVE_SEA_PACKET"
      ) || inactiveChildPacket("ABOVE_SEA"),

      boundary: getPacketFromApi(
        "DGBAudraliaCanvasTerrainNodesBoundary",
        "getPacket",
        "AUDRALIA_CANVAS_TERRAIN_NODES_BOUNDARY_PACKET"
      ) || inactiveChildPacket("BOUNDARY")
    });
  }

  function cellsByNodeId(packet) {
    const map = new Map();
    const cells = packet && Array.isArray(packet.cells) ? packet.cells : [];

    for (const cell of cells) {
      if (cell && cell.nodeId) map.set(String(cell.nodeId), cell);
    }

    return map;
  }

  function summitInfluence(latitude, longitude) {
    return NINE_SUMMITS.map((summit, index) => {
      const distance = angularDistance(
        latitude,
        longitude,
        toRad(summit.latitude),
        centeredTemplateLon(summit.longitude)
      );

      const spread = 0.42 + summit.rank * 0.18;
      const influence = Math.exp(-(distance * distance) / (spread * spread)) * summit.rank;

      return Object.freeze({
        summitId: summit.summitId,
        family: summit.family,
        rank: round(summit.rank),
        influence: round(influence),
        order: index + 1
      });
    }).sort((a, b) => b.influence - a.influence || a.order - b.order);
  }

  function makePreliminaryNodes(children) {
    const subterranean = cellsByNodeId(children.subterranean);
    const aboveSea = cellsByNodeId(children.aboveSea);
    const boundary = cellsByNodeId(children.boundary);
    const nodes = [];

    for (let row = 0; row < MACRO_ROWS; row += 1) {
      for (let column = 0; column < MACRO_COLUMNS; column += 1) {
        const seatIndex = row * MACRO_COLUMNS + column;
        const nodeId = macroNodeId(seatIndex);
        const macroState = seatIndex + 1;
        const v = (row + 0.5) / MACRO_ROWS;
        const latitude = Math.asin(1 - 2 * v);
        const longitude = (column / MACRO_COLUMNS) * TAU - Math.PI;
        const fibonacci = FIBONACCI_SEQUENCE[row];
        const fibonacciPhase = fibonacci / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];

        const influences = summitInfluence(latitude, longitude);
        const primary = influences[0];
        const secondary = influences[1];

        const sub = subterranean.get(nodeId) || null;
        const above = aboveSea.get(nodeId) || null;
        const edge = boundary.get(nodeId) || null;

        const summitPressure = clamp(primary.influence * 0.72 + secondary.influence * 0.28, 0, 1);
        const latitudePressure = clamp(1 - Math.abs(Math.sin(latitude)) * 0.18, 0, 1);
        const deterministic = hash01(macroState * 19 + row * 37 + column * 73);
        const edgePressure = clamp(
          (row <= 2 || row >= 13 ? 0.18 : 0) +
          (column <= 2 || column >= 13 ? 0.16 : 0) +
          deterministic * 0.08,
          0,
          0.42
        );

        const subterraneanPressure = clamp(
          finite(sub && sub.subterraneanPressure, 0.18) * 0.52 +
          summitPressure * 0.28 +
          deterministic * 0.20,
          0,
          1
        );

        const compressionRoot = clamp(
          finite(sub && sub.compressionRoot, subterraneanPressure) * 0.46 +
          subterraneanPressure * 0.34 +
          summitPressure * 0.20,
          0,
          1
        );

        const aboveSeaPotential = clamp(
          finite(above && above.elevation, 0.22) * 0.46 +
          summitPressure * 0.24 +
          latitudePressure * 0.14 +
          deterministic * 0.16,
          0,
          1
        );

        const boundaryInfluence = clamp(
          finite(edge && edge.boundaryScore, 0.18) * 0.48 +
          edgePressure * 0.32 +
          deterministic * 0.20,
          0,
          1
        );

        const terrainPotential = clamp(
          summitPressure * 0.28 +
          subterraneanPressure * 0.20 +
          aboveSeaPotential * 0.28 +
          boundaryInfluence * 0.12 +
          fibonacciPhase * 0.08 +
          deterministic * 0.04,
          0,
          1
        );

        nodes.push({
          nodeId,
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
          deterministicSeed: Math.floor(macroState * 977 + fibonacci * 13 + primary.order * 101 + secondary.order * 53),
          deterministic: round(deterministic),
          nineSummitsInfluence: Object.freeze(influences.slice(0, 4)),
          primarySummit: primary.summitId,
          secondarySummit: secondary.summitId,
          summitPressure: round(summitPressure),
          terrainPotential: round(terrainPotential),
          subterraneanPressure: round(subterraneanPressure),
          compressionRoot: round(compressionRoot),
          upliftPotential: round(clamp(subterraneanPressure * 0.46 + aboveSeaPotential * 0.44 + summitPressure * 0.10, 0, 1)),
          aboveSeaPotential: round(aboveSeaPotential),
          slopePotential: round(clamp(aboveSeaPotential * 0.52 + boundaryInfluence * 0.24 + deterministic * 0.24, 0, 1)),
          ridgePotential: round(clamp(aboveSeaPotential * 0.38 + summitPressure * 0.42 + compressionRoot * 0.20, 0, 1)),
          boundaryInfluence: round(boundaryInfluence),
          transitionPotential: round(clamp(boundaryInfluence * 0.62 + terrainPotential * 0.18 + deterministic * 0.20, 0, 1)),
          sizeScore: round(clamp(summitPressure * 0.45 + terrainPotential * 0.32 + aboveSeaPotential * 0.14 + deterministic * 0.09, 0, 1)),
          childSignals: Object.freeze({
            subterranean: Boolean(sub),
            aboveSea: Boolean(above),
            boundary: Boolean(edge)
          })
        });
      }
    }

    return nodes;
  }

  function assignNodeClasses(nodes) {
    const rankedBySize = nodes.slice().sort((a, b) => b.sizeScore - a.sizeScore || a.seatIndex - b.seatIndex);

    rankedBySize.forEach((node, rank) => {
      if (rank < 12) {
        node.sizeClass = "S4";
        node.sizeWeight = 1.00;
        node.nodeRadius = 0.050;
      } else if (rank < 48) {
        node.sizeClass = "S3";
        node.sizeWeight = 0.76;
        node.nodeRadius = 0.038;
      } else if (rank < 128) {
        node.sizeClass = "S2";
        node.sizeWeight = 0.54;
        node.nodeRadius = 0.028;
      } else {
        node.sizeClass = "S1";
        node.sizeWeight = 0.34;
        node.nodeRadius = 0.019;
      }
    });

    for (const node of nodes) {
      const depthScore = clamp(
        node.subterraneanPressure * 0.42 +
        node.compressionRoot * 0.34 +
        node.sizeWeight * 0.14 +
        node.deterministic * 0.10,
        0,
        1
      );

      const heightScore = clamp(
        node.aboveSeaPotential * 0.48 +
        node.ridgePotential * 0.24 +
        node.sizeWeight * 0.16 +
        node.deterministic * 0.12,
        0,
        1
      );

      const boundaryScore = clamp(
        node.boundaryInfluence * 0.58 +
        node.transitionPotential * 0.24 +
        node.deterministic * 0.18,
        0,
        1
      );

      node.depthWeight = round(depthScore);
      node.heightWeight = round(heightScore);
      node.boundaryWeight = round(boundaryScore);

      node.depthTier =
        depthScore >= 0.76 ? "D4" :
        depthScore >= 0.56 ? "D3" :
        depthScore >= 0.34 ? "D2" :
        "D1";

      node.heightTier =
        heightScore >= 0.76 ? "H4" :
        heightScore >= 0.56 ? "H3" :
        heightScore >= 0.34 ? "H2" :
        "H1";

      node.boundaryTier =
        boundaryScore >= 0.82 ? "B4" :
        boundaryScore >= 0.64 ? "B3" :
        boundaryScore >= 0.42 ? "B2" :
        boundaryScore >= 0.24 ? "B1" :
        "B0";
    }

    return nodes;
  }

  function nodeAt(nodes, row, column) {
    const normalizedRow = clamp(row, 0, MACRO_ROWS - 1);
    const normalizedColumn = ((column % MACRO_COLUMNS) + MACRO_COLUMNS) % MACRO_COLUMNS;
    return nodes[normalizedRow * MACRO_COLUMNS + normalizedColumn] || null;
  }

  function contrast(a, b, key) {
    if (!a || !b) return 0;
    return round(Math.abs(finite(a[key], 0) - finite(b[key], 0)));
  }

  function continuityRole(score) {
    if (score >= 0.78) return "strong-continuity";
    if (score >= 0.52) return "moderate-continuity";
    if (score >= 0.28) return "transition-continuity";
    return "low-continuity";
  }

  function makeNeighborLinks(node, nodes) {
    return freezeArray(DIRECTIONS.map((item) => {
      const neighbor = nodeAt(nodes, node.row + item.dr, node.column + item.dc);
      const depthContrast = contrast(node, neighbor, "depthWeight");
      const heightContrast = contrast(node, neighbor, "heightWeight");
      const boundaryContrast = contrast(node, neighbor, "boundaryWeight");
      const terrainContinuity = clamp(1 - ((depthContrast + heightContrast + boundaryContrast) / 3), 0, 1);

      return {
        direction: item.direction,
        neighborNodeId: neighbor ? neighbor.nodeId : null,
        distanceClass: item.direction.length === 1 ? "cardinal" : "diagonal",
        terrainContinuity: round(terrainContinuity),
        depthContrast,
        heightContrast,
        boundaryContrast,
        continuityRole: continuityRole(terrainContinuity)
      };
    }));
  }

  function assignmentBandFor(node, spiralRing, radialPhase, depthInfluence, heightInfluence, boundaryInfluence) {
    if (spiralRing <= 2) return "root";
    if (depthInfluence >= 0.74) return "compression";
    if (heightInfluence >= 0.78 && node.sizeClass === "S4") return "summit";
    if (heightInfluence >= 0.66) return "ridge";
    if (boundaryInfluence >= 0.70) return "edge";
    if (boundaryInfluence >= 0.54) return "transition";
    if (heightInfluence >= 0.46) return "slope";
    if (radialPhase <= 0.42) return "uplift";
    if (radialPhase >= 0.82 && boundaryInfluence >= 0.34) return "shelf";
    if (depthInfluence <= 0.28 && heightInfluence <= 0.34) return "basin";
    return "reserve";
  }

  function makeSpiralSeat(node, index) {
    const spiralIndex = index + 1;
    const spiralRing = Math.floor(index / 16) + 1;
    const ringIndex = spiralRing - 1;
    const positionInRing = index % 16;
    const radialPhase = Math.sqrt((index + 0.5) / SPIRAL_SEATS_PER_NODE);
    const seedPhase = hash01(node.deterministicSeed + 47) * TAU;
    const rawAngle = index * GOLDEN_ANGLE + seedPhase;
    const localAngle = rawAngle % TAU;
    const spiralTurn = Math.floor(rawAngle / TAU);
    const angularPhase = (positionInRing + 0.5) / 16;
    const localRadius = clamp(radialPhase * node.nodeRadius, 0, 1);
    const localX = Math.cos(localAngle) * localRadius;
    const localY = Math.sin(localAngle) * localRadius;

    const localHash = hash01(node.deterministicSeed + index * 31 + ringIndex * 17);
    const depthInfluence = clamp(node.depthWeight * (1 - radialPhase * 0.28) + localHash * 0.20, 0, 1);
    const heightInfluence = clamp(node.heightWeight * (0.42 + radialPhase * 0.52) + hash01(node.deterministicSeed + index * 41) * 0.14, 0, 1);
    const boundaryInfluence = clamp(node.boundaryWeight * radialPhase + hash01(node.deterministicSeed + index * 53) * 0.18, 0, 1);
    const assignmentBand = assignmentBandFor(node, spiralRing, radialPhase, depthInfluence, heightInfluence, boundaryInfluence);

    return Object.freeze({
      address: spiralAddress(node.nodeId, index),
      parentNodeId: node.nodeId,
      spiralIndex,
      spiralRing,
      spiralTurn,
      radialPhase: round(radialPhase),
      angularPhase: round(angularPhase),
      localX: round(localX),
      localY: round(localY),
      localRadius: round(localRadius),
      localAngle: round(localAngle),
      assignmentBand,
      depthInfluence: round(depthInfluence),
      heightInfluence: round(heightInfluence),
      boundaryInfluence: round(boundaryInfluence),
      expressionReserved: true,
      visibleNow: false,
      activeWater: false,
      hydration: false,
      finalVisualPass: false
    });
  }

  function makeSpiralLattice(node) {
    const seats = [];

    for (let i = 0; i < SPIRAL_SEATS_PER_NODE; i += 1) {
      seats.push(makeSpiralSeat(node, i));
    }

    return freezeArray(seats);
  }

  function emptyAssignmentMaps() {
    return {
      subterraneanSeatMap: {
        root: [],
        compression: [],
        uplift: [],
        nearSurface: []
      },
      aboveSeaSeatMap: {
        basin: [],
        slope: [],
        ridge: [],
        summit: []
      },
      boundarySeatMap: {
        interior: [],
        transition: [],
        edge: [],
        shelf: []
      },
      expressionSeatMap: {
        reserve: [],
        structuralDebug: [],
        futureVisibleExpression: []
      }
    };
  }

  function addSeatToAssignmentMaps(maps, seat) {
    const address = seat.address;

    if (seat.assignmentBand === "root") maps.subterraneanSeatMap.root.push(address);
    else if (seat.assignmentBand === "compression") maps.subterraneanSeatMap.compression.push(address);
    else if (seat.assignmentBand === "uplift") maps.subterraneanSeatMap.uplift.push(address);
    else if (seat.depthInfluence >= 0.48) maps.subterraneanSeatMap.nearSurface.push(address);

    if (seat.assignmentBand === "basin") maps.aboveSeaSeatMap.basin.push(address);
    else if (seat.assignmentBand === "slope") maps.aboveSeaSeatMap.slope.push(address);
    else if (seat.assignmentBand === "ridge") maps.aboveSeaSeatMap.ridge.push(address);
    else if (seat.assignmentBand === "summit") maps.aboveSeaSeatMap.summit.push(address);

    if (seat.assignmentBand === "transition") maps.boundarySeatMap.transition.push(address);
    else if (seat.assignmentBand === "edge") maps.boundarySeatMap.edge.push(address);
    else if (seat.assignmentBand === "shelf") maps.boundarySeatMap.shelf.push(address);
    else if (seat.boundaryInfluence < 0.24) maps.boundarySeatMap.interior.push(address);

    if (seat.assignmentBand === "reserve") maps.expressionSeatMap.reserve.push(address);
    if (seat.spiralIndex === 1 || seat.spiralIndex === 64 || seat.spiralIndex === 128 || seat.spiralIndex === 256) {
      maps.expressionSeatMap.structuralDebug.push(address);
    }

    maps.expressionSeatMap.futureVisibleExpression.push(address);
  }

  function freezeAssignmentMaps(maps) {
    return Object.freeze({
      subterraneanSeatMap: Object.freeze({
        root: Object.freeze(maps.subterraneanSeatMap.root),
        compression: Object.freeze(maps.subterraneanSeatMap.compression),
        uplift: Object.freeze(maps.subterraneanSeatMap.uplift),
        nearSurface: Object.freeze(maps.subterraneanSeatMap.nearSurface)
      }),
      aboveSeaSeatMap: Object.freeze({
        basin: Object.freeze(maps.aboveSeaSeatMap.basin),
        slope: Object.freeze(maps.aboveSeaSeatMap.slope),
        ridge: Object.freeze(maps.aboveSeaSeatMap.ridge),
        summit: Object.freeze(maps.aboveSeaSeatMap.summit)
      }),
      boundarySeatMap: Object.freeze({
        interior: Object.freeze(maps.boundarySeatMap.interior),
        transition: Object.freeze(maps.boundarySeatMap.transition),
        edge: Object.freeze(maps.boundarySeatMap.edge),
        shelf: Object.freeze(maps.boundarySeatMap.shelf)
      }),
      expressionSeatMap: Object.freeze({
        reserve: Object.freeze(maps.expressionSeatMap.reserve),
        structuralDebug: Object.freeze(maps.expressionSeatMap.structuralDebug),
        futureVisibleExpression: Object.freeze(maps.expressionSeatMap.futureVisibleExpression)
      })
    });
  }

  function assignmentReceiptFor(spBuffer) {
    const counts = spBuffer.reduce((acc, seat) => {
      acc[seat.assignmentBand] = (acc[seat.assignmentBand] || 0) + 1;
      return acc;
    }, {});

    return Object.freeze({
      seatCount: spBuffer.length,
      assignmentBandCounts: Object.freeze(counts),
      visibleNow: false,
      expressionReserved: true
    });
  }

  function countBy(nodes, key) {
    const counts = {};
    for (const node of nodes) counts[node[key]] = (counts[node[key]] || 0) + 1;
    return Object.freeze(counts);
  }

  function makeStructuralNodeMap(children) {
    const mutableNodes = assignNodeClasses(makePreliminaryNodes(children));
    const assignmentMaps = emptyAssignmentMaps();
    const finalNodes = [];

    for (const node of mutableNodes) {
      const neighborLinks = makeNeighborLinks(node, mutableNodes);
      const spiralLattice = makeSpiralLattice(node);

      for (const seat of spiralLattice) addSeatToAssignmentMaps(assignmentMaps, seat);

      finalNodes.push(Object.freeze({
        nodeId: node.nodeId,
        seatIndex: node.seatIndex,
        macroState: node.macroState,
        row: node.row,
        column: node.column,
        latitude: node.latitude,
        longitude: node.longitude,
        latitudeDeg: node.latitudeDeg,
        longitudeDeg: node.longitudeDeg,

        sizeClass: node.sizeClass,
        sizeWeight: round(node.sizeWeight),
        nodeRadius: round(node.nodeRadius),

        depthTier: node.depthTier,
        depthWeight: node.depthWeight,
        subterraneanPressure: node.subterraneanPressure,
        compressionRoot: node.compressionRoot,
        upliftPotential: node.upliftPotential,

        heightTier: node.heightTier,
        heightWeight: node.heightWeight,
        aboveSeaPotential: node.aboveSeaPotential,
        slopePotential: node.slopePotential,
        ridgePotential: node.ridgePotential,

        boundaryTier: node.boundaryTier,
        boundaryWeight: node.boundaryWeight,
        boundaryInfluence: node.boundaryInfluence,
        transitionPotential: node.transitionPotential,

        terrainPotential: node.terrainPotential,
        summitInfluence: node.nineSummitsInfluence,
        primarySummit: node.primarySummit,
        secondarySummit: node.secondarySummit,

        neighborLinks,
        spiralLatticeSeed: node.deterministicSeed,
        spiralLattice,
        assignmentReceipts: assignmentReceiptFor(spiralLattice),

        childSignals: node.childSignals,
        visibleNow: false,
        renders: false,
        activeWater: false,
        hydration: false,
        finalVisualPass: false
      }));
    }

    const frozenMaps = freezeAssignmentMaps(assignmentMaps);

    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      parentCanvasContract: PARENT_CANVAS_CONTRACT,
      route: ROUTE,
      target: TARGET,
      role: "hidden-structural-spiral-node-map",
      structuralNodeMapActive: true,

      macroRows: MACRO_ROWS,
      macroColumns: MACRO_COLUMNS,
      macroNodeCount: finalNodes.length,
      spiralLatticePerNode: true,
      spiralSeatsPerNode: SPIRAL_SEATS_PER_NODE,
      totalSpiralSeats: TOTAL_SPIRAL_SEATS,

      addressProtocol: "ATN-###.SL-###",
      nodeSizeClasses: countBy(finalNodes, "sizeClass"),
      depthTierCounts: countBy(finalNodes, "depthTier"),
      heightTierCounts: countBy(finalNodes, "heightTier"),
      boundaryTierCounts: countBy(finalNodes, "boundaryTier"),

      subterraneanSeatMap: frozenMaps.subterraneanSeatMap,
      aboveSeaSeatMap: frozenMaps.aboveSeaSeatMap,
      boundarySeatMap: frozenMaps.boundarySeatMap,
      expressionSeatMap: frozenMaps.expressionSeatMap,

      nodes: freezeArray(finalNodes),

      visibleTerrainExpression: false,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      finalVisualPass: false,

      receipt: Object.freeze({
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        target: TARGET,
        macroNodeCount: finalNodes.length,
        spiralLatticePerNode: true,
        spiralSeatsPerNode: SPIRAL_SEATS_PER_NODE,
        totalSpiralSeats: TOTAL_SPIRAL_SEATS,
        visibleTerrainExpression: false,
        activeWater: false,
        hydration: false,
        finalVisualPass: false
      })
    });
  }

  function makeNodePacket(map) {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      target: TARGET,
      role: "canvas-terrain-nodes-structural-map",
      structuralNodeMapActive: true,
      macroNodeCount: map.macroNodeCount,
      spiralLatticePerNode: true,
      spiralSeatsPerNode: SPIRAL_SEATS_PER_NODE,
      totalSpiralSeats: TOTAL_SPIRAL_SEATS,
      nodes: map.nodes,
      nodeSizeClasses: map.nodeSizeClasses,
      depthTierCounts: map.depthTierCounts,
      heightTierCounts: map.heightTierCounts,
      boundaryTierCounts: map.boundaryTierCounts,
      activeWater: false,
      hydration: false,
      finalVisualPass: false,
      receipt: map.receipt
    });
  }

  function makeCanvasTerrainFeed(map, children) {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      parentCanvas: PARENT_CANVAS,
      feedRole: "hidden-structural-node-map-feed",
      feedMode: "STRUCTURAL_SPIRAL_NODE_MAP_ONLY",
      structuralNodeMapActive: true,
      terrainNodesActive: true,
      visibleTerrainExpression: false,

      macroNodeCount: map.macroNodeCount,
      spiralLatticePerNode: true,
      spiralSeatsPerNode: SPIRAL_SEATS_PER_NODE,
      totalSpiralSeats: TOTAL_SPIRAL_SEATS,

      terrainCells: map.nodes,
      renderableCells: Object.freeze([]),

      subterraneanActive: Boolean(children.subterranean && children.subterranean.active),
      aboveSeaActive: Boolean(children.aboveSea && children.aboveSea.active),
      boundaryActive: Boolean(children.boundary && children.boundary.active),

      childPackets: children,

      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      finalVisualPass: false,

      summary: Object.freeze({
        macroNodeCount: map.macroNodeCount,
        spiralSeatsPerNode: SPIRAL_SEATS_PER_NODE,
        totalSpiralSeats: TOTAL_SPIRAL_SEATS,
        visibleTerrainExpression: false,
        renderableCellCount: 0,
        nodeSizeClasses: map.nodeSizeClasses,
        depthTierCounts: map.depthTierCounts,
        heightTierCounts: map.heightTierCounts,
        boundaryTierCounts: map.boundaryTierCounts
      }),

      receipt: Object.freeze({
        contract: CONTRACT,
        feedMode: "STRUCTURAL_SPIRAL_NODE_MAP_ONLY",
        structuralNodeMapActive: true,
        visibleTerrainExpression: false,
        renderableCellCount: 0,
        activeWater: false,
        hydration: false,
        finalVisualPass: false
      })
    });
  }

  function makeCanvasDisplayPacket(map, feed) {
    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      target: TARGET,
      parentCanvas: PARENT_CANVAS,
      displayRole: "debug-safe-structural-node-map-packet",
      primitiveProtocol: PRIMITIVE_PROTOCOL,
      displayPacketActive: true,

      feedMode: "STRUCTURAL_SPIRAL_NODE_MAP_ONLY",
      structuralNodeMapActive: true,
      spiralLatticePerNode: true,
      macroNodeCount: map.macroNodeCount,
      spiralSeatsPerNode: SPIRAL_SEATS_PER_NODE,
      totalSpiralSeats: TOTAL_SPIRAL_SEATS,

      terrainNodesActive: true,
      subterraneanActive: Boolean(feed.subterraneanActive),
      aboveSeaActive: Boolean(feed.aboveSeaActive),
      boundaryActive: Boolean(feed.boundaryActive),

      visibleTerrainExpression: false,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      finalVisualPass: false,

      primitiveCount: 0,
      primitiveGroups: Object.freeze({}),
      primitiveTypes: Object.freeze({}),
      primitives: Object.freeze([]),

      summary: Object.freeze({
        macroNodeCount: map.macroNodeCount,
        spiralSeatsPerNode: SPIRAL_SEATS_PER_NODE,
        totalSpiralSeats: TOTAL_SPIRAL_SEATS,
        visibleTerrainExpression: false,
        primitiveCount: 0,
        bubblePrimitivesSuppressed: true,
        terrainExpressionHeld: true
      }),

      receipt: Object.freeze({
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        displayRole: "debug-safe-structural-node-map-packet",
        primitiveProtocol: PRIMITIVE_PROTOCOL,
        primitiveCount: 0,
        structuralNodeMapActive: true,
        visibleTerrainExpression: false,
        activeWater: false,
        hydration: false,
        finalVisualPass: false
      })
    });
  }

  function publish() {
    window.AUDRALIA_STRUCTURAL_SPIRAL_NODE_MAP_PACKET = structuralNodeMap;
    window.AUDRALIA_STRUCTURAL_SPIRAL_NODE_MAP_RECEIPT = structuralNodeMap ? structuralNodeMap.receipt : null;

    window.AUDRALIA_CANVAS_TERRAIN_NODES_PACKET = nodePacket;
    window.AUDRALIA_CANVAS_TERRAIN_NODES_RECEIPT = nodePacket ? nodePacket.receipt : null;

    window.AUDRALIA_CANVAS_TERRAIN_FEED_PACKET = canvasTerrainFeed;
    window.AUDRALIA_CANVAS_DISPLAY_PACKET = canvasDisplayPacket;
    window.AUDRALIA_CANVAS_DISPLAY_PACKET_RECEIPT = canvasDisplayPacket ? canvasDisplayPacket.receipt : null;

    window.AUDRALIA_PLANET_FILE_4C_STRUCTURAL_SPIRAL_NODE_MAP_STATUS = status();

    safeDataset("audraliaCanvasTerrainNodesContract", CONTRACT);
    safeDataset("audraliaCanvasTerrainNodesPreviousContract", PREVIOUS_CONTRACT);
    safeDataset("audraliaStructuralNodeMapActive", "true");
    safeDataset("audraliaMacroNodeCount", MACRO_NODE_COUNT);
    safeDataset("audraliaSpiralLatticePerNode", "true");
    safeDataset("audraliaSpiralSeatsPerNode", SPIRAL_SEATS_PER_NODE);
    safeDataset("audraliaTotalSpiralSeats", TOTAL_SPIRAL_SEATS);
    safeDataset("audraliaVisibleTerrainExpression", "false");
    safeDataset("audraliaCanvasDisplayPacketActive", "true");
    safeDataset("audraliaCanvasDisplayPrimitiveProtocol", PRIMITIVE_PROTOCOL);
    safeDataset("audraliaCanvasDisplayPrimitiveCount", 0);
    safeDataset("audraliaCanvasTerrainFeedMode", "STRUCTURAL_SPIRAL_NODE_MAP_ONLY");
    safeDataset("audraliaCanvasTerrainActiveWater", "false");
    safeDataset("audraliaCanvasTerrainHydration", "false");
    safeDataset("audraliaCanvasTerrainFinalVisualPass", "false");
  }

  function refreshComposition() {
    if (composing) return canvasDisplayPacket || status();

    composing = true;

    try {
      compositionCount += 1;
      childPackets = collectChildPackets();

      if (!structuralNodeMap) {
        structuralNodeMap = makeStructuralNodeMap(childPackets);
        nodePacket = makeNodePacket(structuralNodeMap);
      }

      canvasTerrainFeed = makeCanvasTerrainFeed(structuralNodeMap, childPackets);
      canvasDisplayPacket = makeCanvasDisplayPacket(structuralNodeMap, canvasTerrainFeed);

      publish();
      return canvasDisplayPacket;
    } finally {
      composing = false;
    }
  }

  function getStructuralNodeMap() {
    if (!structuralNodeMap) refreshComposition();
    return structuralNodeMap;
  }

  function getNodePacket() {
    if (!nodePacket) refreshComposition();
    return nodePacket;
  }

  function getNode(nodeIdOrIndex) {
    if (!structuralNodeMap) refreshComposition();

    if (typeof nodeIdOrIndex === "number") {
      return structuralNodeMap.nodes[clamp(Math.floor(nodeIdOrIndex), 0, structuralNodeMap.nodes.length - 1)] || null;
    }

    const id = String(nodeIdOrIndex || "");
    return structuralNodeMap.nodes.find((node) => node.nodeId === id) || null;
  }

  function getSpiralLattice(nodeIdOrIndex) {
    const node = getNode(nodeIdOrIndex);
    return node ? node.spiralLattice : Object.freeze([]);
  }

  function getSpiralSeat(address) {
    if (!address) return null;

    const parts = String(address).split(".");
    if (parts.length !== 2) return null;

    const node = getNode(parts[0]);
    if (!node) return null;

    const match = /^SL-(\d{3})$/.exec(parts[1]);
    if (!match) return null;

    const index = clamp(parseInt(match[1], 10) - 1, 0, SPIRAL_SEATS_PER_NODE - 1);
    return node.spiralLattice[index] || null;
  }

  function getLocalState(nodeIdOrIndex, localStateIndex) {
    const node = getNode(nodeIdOrIndex);
    const index = clamp(Math.floor(finite(localStateIndex, 0)), 0, SPIRAL_SEATS_PER_NODE - 1);

    if (!node) {
      return Object.freeze({
        nodeId: "UNKNOWN",
        localStateIndex: index,
        address: "UNKNOWN.SL-" + String(index + 1).padStart(3, "0"),
        visibleNow: false,
        activeWater: false
      });
    }

    const seat = node.spiralLattice[index];

    return Object.freeze({
      nodeId: node.nodeId,
      localStateIndex: index,
      address: seat.address,
      assignmentBand: seat.assignmentBand,
      depthInfluence: seat.depthInfluence,
      heightInfluence: seat.heightInfluence,
      boundaryInfluence: seat.boundaryInfluence,
      visibleNow: false,
      activeWater: false
    });
  }

  function getChildPackets() {
    if (!childPackets) refreshComposition();
    return childPackets;
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
    const map = structuralNodeMap;

    return Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      parentCanvasContract: PARENT_CANVAS_CONTRACT,
      primitiveProtocol: PRIMITIVE_PROTOCOL,
      route: ROUTE,
      target: TARGET,
      active: true,

      structuralNodeMapActive: Boolean(map),
      macroNodeCount: map ? map.macroNodeCount : 0,
      spiralLatticePerNode: true,
      spiralSeatsPerNode: SPIRAL_SEATS_PER_NODE,
      totalSpiralSeats: map ? map.totalSpiralSeats : TOTAL_SPIRAL_SEATS,

      nodeSizeClasses: map ? map.nodeSizeClasses : Object.freeze({}),
      depthTierCounts: map ? map.depthTierCounts : Object.freeze({}),
      heightTierCounts: map ? map.heightTierCounts : Object.freeze({}),
      boundaryTierCounts: map ? map.boundaryTierCounts : Object.freeze({}),

      displayPacketActive: Boolean(canvasDisplayPacket),
      visibleTerrainExpression: false,
      primitiveCount: canvasDisplayPacket ? canvasDisplayPacket.primitiveCount : 0,
      primitiveGroups: canvasDisplayPacket ? canvasDisplayPacket.primitiveGroups : Object.freeze({}),

      subterraneanActive: Boolean(canvasTerrainFeed && canvasTerrainFeed.subterraneanActive),
      aboveSeaActive: Boolean(canvasTerrainFeed && canvasTerrainFeed.aboveSeaActive),
      boundaryActive: Boolean(canvasTerrainFeed && canvasTerrainFeed.boundaryActive),

      compositionCount,
      composing,

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

  window[API_NAME] = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    primitiveProtocol: PRIMITIVE_PROTOCOL,
    getStructuralNodeMap,
    getNodePacket,
    getNode,
    getSpiralLattice,
    getSpiralSeat,
    getLocalState,
    getChildPackets,
    getCanvasTerrainFeed,
    getCanvasDisplayPacket,
    refreshComposition,
    status
  });

  refreshComposition();
})();
