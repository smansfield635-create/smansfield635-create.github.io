// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.terrain.nodes.boundary.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_TNT_v1
//
// File 3 of 5 in the backward-build terrain strategy.
// Authority position:
// index.canvas.js
// └── index.canvas.terrain.nodes.js
//     ├── index.canvas.terrain.nodes.subterranean.js
//     ├── index.canvas.terrain.nodes.above-sea.js
//     └── index.canvas.terrain.nodes.boundary.js
//
// Owns:
// - dry water-edge datum geometry
// - coastline boundary candidates
// - bay / inlet / peninsula / shelf candidate logic
// - beach candidates only
// - island fragment candidates
// - shoreline fracture candidates
//
// Does not own:
// - canvas rendering
// - canvas creation
// - drag / rotation
// - node baseline authority
// - subterranean authority
// - above-sea terrain authority
// - active water
// - hydration
// - oceans / rivers / lakes
// - beach rendering
// - climate / biome
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_TNT_v1";
  const SPEC_OPS = "AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_SPEC_OPS_v1";
  const CCR = "AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_CCR_v1";
  const FULL_PLAN = "AUDRALIA_PLANET_CANVAS_TERRAIN_BACKWARD_BUILD_FULL_PLAN_CCR_v1";

  const PREVIOUS_FILE_1_CONTRACT = "AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_TNT_v1";
  const PREVIOUS_FILE_2_CONTRACT = "AUDRALIA_PLANET_FILE_2_ABOVE_SEA_GRANDCHILD_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.boundary.js";
  const FUTURE_NODE_CHILD = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.js";
  const SUBTERRANEAN_FILE = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.subterranean.js";
  const ABOVE_SEA_FILE = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.above-sea.js";
  const API_NAME = "DGBAudraliaCanvasTerrainNodesBoundary";

  const SEA_LEVEL_DATUM = 0.42;
  const DEFAULT_ROWS = 16;
  const DEFAULT_COLUMNS = 16;

  const BOUNDARY_CLASS = Object.freeze({
    BEACH: "beach-candidate",
    ISLAND_FRAGMENT: "island-fragment-candidate",
    PENINSULA: "peninsula-candidate",
    BAY: "bay-candidate",
    INLET: "inlet-candidate",
    SHELF: "coastal-shelf-candidate",
    WATER_EDGE: "water-edge-candidate",
    FRACTURE: "shoreline-fracture-candidate",
    INTERIOR_HELD: "interior-dry-boundary-held"
  });

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  function round(value, places = 6) {
    const factor = 10 ** places;
    return Math.round(Number(value) * factor) / factor;
  }

  function hash01(seed) {
    const number = Number(seed);
    const safeSeed = Number.isFinite(number) ? number : 1;
    const value = Math.sin(safeSeed * 73.719 + 509.431) * 27182.81828;
    return value - Math.floor(value);
  }

  function stringSeed(value) {
    const text = String(value || "");
    let hash = 0;

    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    }

    return Math.abs(hash) + 1;
  }

  function freezeArray(items) {
    return Object.freeze(items.map((item) => Object.freeze(item)));
  }

  function safeDataset(key, value) {
    try {
      if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.dataset[key] = String(value);
      }
    } catch (_error) {}
  }

  function getNodePacket() {
    const api = window.DGBAudraliaCanvasTerrainNodes;

    if (api && typeof api.getNodePacket === "function") {
      try {
        const packet = api.getNodePacket();
        if (packet && Array.isArray(packet.nodes)) return packet;
      } catch (_error) {}
    }

    const globalPacket = window.AUDRALIA_CANVAS_TERRAIN_NODES_PACKET;

    if (globalPacket && Array.isArray(globalPacket.nodes)) {
      return globalPacket;
    }

    return null;
  }

  function getAboveSeaPacket() {
    const api = window.DGBAudraliaCanvasTerrainNodesAboveSea;

    if (api && typeof api.getPacket === "function") {
      try {
        const packet = api.getPacket();
        if (packet && Array.isArray(packet.cells)) return packet;
      } catch (_error) {}
    }

    const globalPacket = window.AUDRALIA_CANVAS_TERRAIN_NODES_ABOVE_SEA_PACKET;

    if (globalPacket && Array.isArray(globalPacket.cells)) {
      return globalPacket;
    }

    return null;
  }

  function getSubterraneanPacket() {
    const api = window.DGBAudraliaCanvasTerrainNodesSubterranean;

    if (api && typeof api.getPacket === "function") {
      try {
        const packet = api.getPacket();
        if (packet && Array.isArray(packet.cells)) return packet;
      } catch (_error) {}
    }

    const globalPacket = window.AUDRALIA_CANVAS_TERRAIN_NODES_SUBTERRANEAN_PACKET;

    if (globalPacket && Array.isArray(globalPacket.cells)) {
      return globalPacket;
    }

    return null;
  }

  function normalizeNode(node, fallbackIndex) {
    const seatIndex = Number.isFinite(Number(node.seatIndex)) ? Number(node.seatIndex) : fallbackIndex;
    const row = Number.isFinite(Number(node.row)) ? Number(node.row) : Math.floor(seatIndex / DEFAULT_COLUMNS);
    const column = Number.isFinite(Number(node.column)) ? Number(node.column) : seatIndex % DEFAULT_COLUMNS;
    const nodeId = String(node.nodeId || "ATN-" + String(seatIndex + 1).padStart(3, "0"));

    const localSeed =
      node.localLattice && Number.isFinite(Number(node.localLattice.seed))
        ? Number(node.localLattice.seed)
        : stringSeed(nodeId) + seatIndex * 977;

    return Object.freeze({
      nodeId,
      seatIndex,
      row,
      column,
      regionFamily: String(node.regionFamily || "unclassified-dry-node"),
      primarySummit: String(node.primarySummit || "SUMMIT_UNASSIGNED"),
      summitPressure: clamp(node.summitPressure, 0, 1),
      terrainPotential: clamp(node.terrainPotential, 0, 1),
      boundaryEligibility: clamp(node.boundaryEligibility, 0, 1),
      localLattice: Object.freeze({
        seed: localSeed
      })
    });
  }

  function normalizeAboveSea(cell) {
    if (!cell || typeof cell !== "object") {
      return null;
    }

    return Object.freeze({
      nodeId: String(cell.nodeId || ""),
      elevation: clamp(cell.elevation, 0, 1),
      aboveSeaDatum: Boolean(cell.aboveSeaDatum),
      elevationBand: String(cell.elevationBand || "UNCLASSIFIED_ELEVATION"),
      landform: String(cell.landform || "unclassified-landform"),
      mountainSignal: clamp(cell.mountainSignal, 0, 1),
      ridgeSignal: clamp(cell.ridgeSignal, 0, 1),
      basinSignal: clamp(cell.basinSignal, 0, 1),
      plateauSignal: clamp(cell.plateauSignal, 0, 1),
      escarpmentSignal: clamp(cell.escarpmentSignal, 0, 1),
      summitEmergenceSignal: clamp(cell.summitEmergenceSignal, 0, 1)
    });
  }

  function normalizeSubterranean(cell) {
    if (!cell || typeof cell !== "object") {
      return Object.freeze({
        connected: false,
        subterraneanPressure: 0.24,
        crustStress: 0.22,
        buriedMassForce: 0.20,
        compression: 0.20,
        faultPressure: 0.16,
        upliftPotential: 0.20,
        collapsePotential: 0.20,
        basinPotential: 0.18,
        subterraneanClass: "MISSING_OR_INACTIVE"
      });
    }

    return Object.freeze({
      connected: true,
      subterraneanPressure: clamp(cell.subterraneanPressure, 0, 1),
      crustStress: clamp(cell.crustStress, 0, 1),
      buriedMassForce: clamp(cell.buriedMassForce, 0, 1),
      compression: clamp(cell.compression, 0, 1),
      faultPressure: clamp(cell.faultPressure, 0, 1),
      upliftPotential: clamp(cell.upliftPotential, 0, 1),
      collapsePotential: clamp(cell.collapsePotential, 0, 1),
      basinPotential: clamp(cell.basinPotential, 0, 1),
      subterraneanClass: String(cell.subterraneanClass || "UNCLASSIFIED_SUBTERRANEAN")
    });
  }

  function mapByNode(cells) {
    const map = new Map();

    for (const cell of cells || []) {
      if (cell && cell.nodeId) map.set(String(cell.nodeId), cell);
    }

    return map;
  }

  function coordinateKey(row, column) {
    return String(row) + ":" + String(column);
  }

  function buildNodeCoordinateMap(nodes) {
    const map = new Map();

    for (const node of nodes) {
      map.set(coordinateKey(node.row, node.column), node.nodeId);
    }

    return map;
  }

  function neighborIds(node, nodeCoordinateMap, rows, columns) {
    const ids = [];

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
        if (rowOffset === 0 && columnOffset === 0) continue;

        const row = node.row + rowOffset;
        const column = (node.column + columnOffset + columns) % columns;

        if (row < 0 || row >= rows) continue;

        const id = nodeCoordinateMap.get(coordinateKey(row, column));
        if (id) ids.push(id);
      }
    }

    return ids;
  }

  function summitBoundaryModifier(primarySummit) {
    const text = String(primarySummit || "");

    if (text.includes("SUMMIT_01")) return 0.042;
    if (text.includes("SUMMIT_02")) return 0.058;
    if (text.includes("SUMMIT_03")) return 0.066;
    if (text.includes("SUMMIT_04")) return 0.060;
    if (text.includes("SUMMIT_05")) return 0.064;
    if (text.includes("SUMMIT_06")) return 0.070;
    if (text.includes("SUMMIT_07")) return 0.068;
    if (text.includes("SUMMIT_08")) return 0.056;
    if (text.includes("SUMMIT_09")) return 0.040;

    return 0.020;
  }

  function edgePositionSignal(node, rows, columns) {
    const northSouthEdge = Math.min(node.row, rows - 1 - node.row) / Math.max(1, rows / 2);
    const eastWestEdge = Math.min(node.column, columns - 1 - node.column) / Math.max(1, columns / 2);
    const edgeCloseness = 1 - clamp(Math.min(northSouthEdge, eastWestEdge), 0, 1);
    const wrappedColumnRim = node.column <= 1 || node.column >= columns - 2 ? 0.12 : 0;

    return clamp(edgeCloseness * 0.32 + wrappedColumnRim, 0, 0.42);
  }

  function computeDatumProximity(elevation) {
    return clamp(1 - Math.abs(elevation - SEA_LEVEL_DATUM) / 0.30, 0, 1);
  }

  function computeBoundaryClass(cell) {
    if (cell.isBeachCandidate) return BOUNDARY_CLASS.BEACH;
    if (cell.isIslandFragmentCandidate) return BOUNDARY_CLASS.ISLAND_FRAGMENT;
    if (cell.peninsulaScore >= 0.66) return BOUNDARY_CLASS.PENINSULA;
    if (cell.bayScore >= 0.64) return BOUNDARY_CLASS.BAY;
    if (cell.inletScore >= 0.61) return BOUNDARY_CLASS.INLET;
    if (cell.shelfScore >= 0.60) return BOUNDARY_CLASS.SHELF;
    if (cell.fractureScore >= 0.58) return BOUNDARY_CLASS.FRACTURE;
    if (cell.boundaryScore >= 0.52) return BOUNDARY_CLASS.WATER_EDGE;
    return BOUNDARY_CLASS.INTERIOR_HELD;
  }

  function computeRawCell(node, aboveSea, subterranean, aboveSeaMap, nodeCoordinateMap, rows, columns, computationMode) {
    const sub = normalizeSubterranean(subterranean);
    const elevation = aboveSea ? aboveSea.elevation : 0;
    const datumProximity = computeDatumProximity(elevation);
    const neighborAboveCells = neighborIds(node, nodeCoordinateMap, rows, columns)
      .map((id) => aboveSeaMap.get(id))
      .filter(Boolean)
      .map(normalizeAboveSea)
      .filter(Boolean);

    const neighborAboveCount = neighborAboveCells.filter((cell) => cell.aboveSeaDatum).length;
    const neighborBelowDatumDryCount = Math.max(0, neighborAboveCells.length - neighborAboveCount);
    const neighborContrast = neighborAboveCells.length
      ? Math.abs(neighborAboveCount - neighborBelowDatumDryCount) / neighborAboveCells.length
      : 0;

    const seed = node.localLattice.seed;
    const shorelineNoise = hash01(seed + node.seatIndex * 19 + 419);
    const inletNoise = hash01(seed + node.row * 43 + node.column * 47 + 1009);
    const islandNoise = hash01(seed + node.row * 61 + node.column * 67 + 1301);
    const edgeSignal = edgePositionSignal(node, rows, columns);
    const summitBoundary = summitBoundaryModifier(node.primarySummit);

    const slopeSignal = clamp(
      aboveSea.ridgeSignal * 0.28 +
      aboveSea.escarpmentSignal * 0.34 +
      aboveSea.mountainSignal * 0.10 +
      sub.faultPressure * 0.20 +
      sub.crustStress * 0.08,
      0,
      1
    );

    const boundaryScore = clamp(
      datumProximity * 0.34 +
      neighborContrast * 0.24 +
      node.boundaryEligibility * 0.18 +
      edgeSignal * 0.10 +
      slopeSignal * 0.08 +
      summitBoundary * 0.06 +
      shorelineNoise * 0.06,
      0,
      1
    );

    const shelfScore = clamp(
      datumProximity * 0.38 +
      node.boundaryEligibility * 0.24 +
      (1 - slopeSignal) * 0.18 +
      edgeSignal * 0.10 +
      shorelineNoise * 0.10,
      0,
      1
    );

    const bayScore = clamp(
      (neighborBelowDatumDryCount / Math.max(1, neighborAboveCells.length)) * 0.30 +
      datumProximity * 0.24 +
      aboveSea.basinSignal * 0.16 +
      sub.basinPotential * 0.18 +
      sub.collapsePotential * 0.08 +
      inletNoise * 0.04,
      0,
      1
    );

    const inletScore = clamp(
      neighborContrast * 0.26 +
      datumProximity * 0.20 +
      aboveSea.escarpmentSignal * 0.16 +
      sub.faultPressure * 0.18 +
      edgeSignal * 0.08 +
      inletNoise * 0.12,
      0,
      1
    );

    const peninsulaScore = clamp(
      (neighborAboveCount / Math.max(1, neighborAboveCells.length)) * 0.24 +
      node.boundaryEligibility * 0.20 +
      slopeSignal * 0.18 +
      datumProximity * 0.14 +
      aboveSea.ridgeSignal * 0.12 +
      summitBoundary * 0.06 +
      shorelineNoise * 0.06,
      0,
      1
    );

    const islandScore = clamp(
      node.boundaryEligibility * 0.22 +
      neighborContrast * 0.25 +
      datumProximity * 0.22 +
      edgeSignal * 0.10 +
      (aboveSea.aboveSeaDatum ? 0.08 : 0) +
      islandNoise * 0.13,
      0,
      1
    );

    const beachScore = clamp(
      shelfScore * 0.34 +
      datumProximity * 0.26 +
      (1 - slopeSignal) * 0.17 +
      node.boundaryEligibility * 0.10 +
      neighborContrast * 0.07 +
      shorelineNoise * 0.06,
      0,
      1
    );

    const fractureScore = clamp(
      aboveSea.escarpmentSignal * 0.24 +
      aboveSea.ridgeSignal * 0.18 +
      sub.faultPressure * 0.25 +
      sub.crustStress * 0.13 +
      neighborContrast * 0.10 +
      inletNoise * 0.10,
      0,
      1
    );

    return {
      nodeId: node.nodeId,
      seatIndex: node.seatIndex,
      row: node.row,
      column: node.column,
      regionFamily: node.regionFamily,
      primarySummit: node.primarySummit,
      elevation: round(elevation),
      seaLevelDatum: true,
      seaLevelDatumValue: SEA_LEVEL_DATUM,
      aboveSeaDatum: Boolean(aboveSea && aboveSea.aboveSeaDatum),
      datumProximity: round(datumProximity),
      neighborAboveCount,
      neighborBelowDatumDryCount,
      boundaryScore: round(boundaryScore),
      shelfScore: round(shelfScore),
      bayScore: round(bayScore),
      inletScore: round(inletScore),
      peninsulaScore: round(peninsulaScore),
      islandScore: round(islandScore),
      beachScore: round(beachScore),
      fractureScore: round(fractureScore),
      boundaryClass: BOUNDARY_CLASS.INTERIOR_HELD,
      isBeachCandidate: false,
      isIslandFragmentCandidate: islandScore >= 0.68 && neighborContrast >= 0.32 && datumProximity >= 0.32,
      computationMode,
      dryBoundaryGeometry: true,
      waterEdgeDatumOnly: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      climate: false,
      biome: false,
      renders: false,
      finalVisualPass: false
    };
  }

  function applyCandidateScarcity(rawCells) {
    const beachSet = new Set();

    rawCells
      .filter((cell) => cell.beachScore >= 0.62 && cell.shelfScore >= 0.54 && cell.datumProximity >= 0.44)
      .sort((a, b) => b.beachScore - a.beachScore || b.boundaryScore - a.boundaryScore || a.seatIndex - b.seatIndex)
      .slice(0, 12)
      .forEach((cell) => beachSet.add(cell.nodeId));

    return freezeArray(rawCells.map((cell) => {
      const next = { ...cell };
      next.isBeachCandidate = beachSet.has(cell.nodeId);
      next.boundaryClass = computeBoundaryClass(next);
      return next;
    }));
  }

  function featureList(cells, className, scoreKey, limit) {
    return freezeArray(
      cells
        .filter((cell) => cell.boundaryClass === className)
        .sort((a, b) => b[scoreKey] - a[scoreKey] || b.boundaryScore - a.boundaryScore || a.seatIndex - b.seatIndex)
        .slice(0, limit)
        .map((cell) => ({
          nodeId: cell.nodeId,
          row: cell.row,
          column: cell.column,
          regionFamily: cell.regionFamily,
          boundaryClass: cell.boundaryClass,
          score: round(cell[scoreKey]),
          dryGeometryOnly: true,
          activeWater: false
        }))
    );
  }

  function emptyFeatures() {
    return Object.freeze({
      beaches: Object.freeze([]),
      bays: Object.freeze([]),
      inlets: Object.freeze([]),
      peninsulas: Object.freeze([]),
      shelves: Object.freeze([]),
      islandFragments: Object.freeze([]),
      shorelineFractures: Object.freeze([]),
      waterEdge: Object.freeze([])
    });
  }

  function buildFeatures(cells) {
    return Object.freeze({
      beaches: featureList(cells, BOUNDARY_CLASS.BEACH, "beachScore", 12),
      bays: featureList(cells, BOUNDARY_CLASS.BAY, "bayScore", 16),
      inlets: featureList(cells, BOUNDARY_CLASS.INLET, "inletScore", 16),
      peninsulas: featureList(cells, BOUNDARY_CLASS.PENINSULA, "peninsulaScore", 16),
      shelves: featureList(cells, BOUNDARY_CLASS.SHELF, "shelfScore", 20),
      islandFragments: featureList(cells, BOUNDARY_CLASS.ISLAND_FRAGMENT, "islandScore", 16),
      shorelineFractures: featureList(cells, BOUNDARY_CLASS.FRACTURE, "fractureScore", 20),
      waterEdge: featureList(cells, BOUNDARY_CLASS.WATER_EDGE, "boundaryScore", 32)
    });
  }

  function summarize(cells) {
    const count = Math.max(1, cells.length);
    const totals = cells.reduce((acc, cell) => {
      acc.boundaryScore += cell.boundaryScore;
      acc.shelfScore += cell.shelfScore;
      acc.bayScore += cell.bayScore;
      acc.inletScore += cell.inletScore;
      acc.peninsulaScore += cell.peninsulaScore;
      acc.islandScore += cell.islandScore;
      acc.beachScore += cell.beachScore;
      acc.fractureScore += cell.fractureScore;
      acc.classCounts[cell.boundaryClass] = (acc.classCounts[cell.boundaryClass] || 0) + 1;

      if (cell.isBeachCandidate) acc.beachCandidateCount += 1;
      if (cell.isIslandFragmentCandidate) acc.islandFragmentCandidateCount += 1;

      return acc;
    }, {
      boundaryScore: 0,
      shelfScore: 0,
      bayScore: 0,
      inletScore: 0,
      peninsulaScore: 0,
      islandScore: 0,
      beachScore: 0,
      fractureScore: 0,
      beachCandidateCount: 0,
      islandFragmentCandidateCount: 0,
      classCounts: {}
    });

    return Object.freeze({
      cellCount: cells.length,
      seaLevelDatum: true,
      seaLevelDatumValue: SEA_LEVEL_DATUM,
      waterEdgeGeometry: cells.length > 0,
      dryBoundaryGeometry: true,
      beachCandidatesOnly: true,
      averageBoundaryScore: round(totals.boundaryScore / count),
      averageShelfScore: round(totals.shelfScore / count),
      averageBayScore: round(totals.bayScore / count),
      averageInletScore: round(totals.inletScore / count),
      averagePeninsulaScore: round(totals.peninsulaScore / count),
      averageIslandScore: round(totals.islandScore / count),
      averageBeachScore: round(totals.beachScore / count),
      averageFractureScore: round(totals.fractureScore / count),
      beachCandidateCount: totals.beachCandidateCount,
      islandFragmentCandidateCount: totals.islandFragmentCandidateCount,
      boundaryClassCounts: Object.freeze({ ...totals.classCounts })
    });
  }

  function inactivePacket(reason, aboveSeaDependency, subterraneanDependency) {
    const receipt = Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      target: TARGET,
      active: false,
      dependencyStatus: reason,
      aboveSeaDependency,
      subterraneanDependency,
      computationMode: "INACTIVE",
      boundaryActive: false,
      nodeCount: 0,
      activeWater: false,
      hydration: false,
      beachRendering: false,
      finalVisualPass: false
    });

    return Object.freeze({
      contract: CONTRACT,
      specOps: "AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_SPEC_OPS_v1",
      ccr: CCR,
      fullPlan: FULL_PLAN,
      previousFile1Contract: PREVIOUS_FILE_1_CONTRACT,
      previousFile2Contract: PREVIOUS_FILE_2_CONTRACT,
      route: ROUTE,
      target: TARGET,
      role: "dry-boundary-geometry-grandchild",
      authorityPosition: "canvas->terrain-nodes->boundary",
      buildPosition: "3_of_5",
      parentNodeFile: FUTURE_NODE_CHILD,
      subterraneanFile: SUBTERRANEAN_FILE,
      aboveSeaFile: ABOVE_SEA_FILE,
      parentNodeContract: "WAITING_FOR_NODE_COMPOSER",
      subterraneanContract: subterraneanDependency,
      aboveSeaContract: aboveSeaDependency,
      active: false,
      dependencyStatus: reason,
      subterraneanDependency,
      aboveSeaDependency,
      computationMode: "INACTIVE",
      boundaryActive: false,
      nodeCount: 0,
      seaLevelDatum: true,
      seaLevelDatumValue: SEA_LEVEL_DATUM,
      waterEdgeGeometry: false,
      coastlineBoundary: false,
      beachCandidatesOnly: true,
      dryBoundaryGeometry: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      climate: false,
      biome: false,
      renders: false,
      finalVisualPass: false,
      summary: summarize([]),
      features: emptyFeatures(),
      cells: Object.freeze([]),
      receipt
    });
  }

  function activePacket(nodePacket, aboveSeaPacket, subterraneanPacket) {
    const rows = Number.isFinite(Number(nodePacket.macroRows)) ? Number(nodePacket.macroRows) : DEFAULT_ROWS;
    const columns = Number.isFinite(Number(nodePacket.macroColumns)) ? Number(nodePacket.macroColumns) : DEFAULT_COLUMNS;

    const nodes = freezeArray((nodePacket.nodes || []).map(normalizeNode));
    const nodeCoordinateMap = buildNodeCoordinateMap(nodes);
    const aboveSeaMap = mapByNode(aboveSeaPacket.cells || []);
    const subterraneanConnected = Boolean(
      subterraneanPacket &&
      subterraneanPacket.active &&
      Array.isArray(subterraneanPacket.cells)
    );
    const subterraneanMap = mapByNode(subterraneanConnected ? subterraneanPacket.cells : []);

    const computationMode = subterraneanConnected
      ? "NODE_PLUS_ABOVE_SEA_PLUS_SUBTERRANEAN"
      : "NODE_PLUS_ABOVE_SEA";

    const rawCells = nodes.map((node) => {
      const aboveSea = normalizeAboveSea(aboveSeaMap.get(node.nodeId));

      return computeRawCell(
        node,
        aboveSea,
        subterraneanMap.get(node.nodeId),
        aboveSeaMap,
        nodeCoordinateMap,
        rows,
        columns,
        computationMode
      );
    });

    const cells = applyCandidateScarcity(rawCells);
    const features = buildFeatures(cells);

    const receipt = Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      target: TARGET,
      active: true,
      dependencyStatus: "NODE_PACKET_CONNECTED",
      aboveSeaDependency: "CONNECTED",
      subterraneanDependency: subterraneanConnected ? "CONNECTED" : "MISSING_OR_INACTIVE",
      computationMode,
      parentNodeContract: String(nodePacket.contract || "NODE_PACKET_CONTRACT_UNSPECIFIED"),
      aboveSeaContract: String(aboveSeaPacket.contract || "ABOVE_SEA_CONTRACT_UNSPECIFIED"),
      subterraneanContract: subterraneanConnected
        ? String(subterraneanPacket.contract || "SUBTERRANEAN_CONTRACT_UNSPECIFIED")
        : "MISSING_OR_INACTIVE",
      boundaryActive: true,
      nodeCount: nodes.length,
      waterEdgeGeometry: true,
      activeWater: false,
      hydration: false,
      beachRendering: false,
      finalVisualPass: false
    });

    return Object.freeze({
      contract: CONTRACT,
      specOps: "AUDRALIA_PLANET_FILE_3_BOUNDARY_GRANDCHILD_SPEC_OPS_v1",
      ccr: CCR,
      fullPlan: FULL_PLAN,
      previousFile1Contract: PREVIOUS_FILE_1_CONTRACT,
      previousFile2Contract: PREVIOUS_FILE_2_CONTRACT,
      route: ROUTE,
      target: TARGET,
      role: "dry-boundary-geometry-grandchild",
      authorityPosition: "canvas->terrain-nodes->boundary",
      buildPosition: "3_of_5",
      parentNodeFile: FUTURE_NODE_CHILD,
      subterraneanFile: SUBTERRANEAN_FILE,
      aboveSeaFile: ABOVE_SEA_FILE,
      parentNodeContract: String(nodePacket.contract || "NODE_PACKET_CONTRACT_UNSPECIFIED"),
      subterraneanContract: subterraneanConnected
        ? String(subterraneanPacket.contract || "SUBTERRANEAN_CONTRACT_UNSPECIFIED")
        : "MISSING_OR_INACTIVE",
      aboveSeaContract: String(aboveSeaPacket.contract || "ABOVE_SEA_CONTRACT_UNSPECIFIED"),
      active: true,
      dependencyStatus: "NODE_PACKET_CONNECTED",
      subterraneanDependency: subterraneanConnected ? "CONNECTED" : "MISSING_OR_INACTIVE",
      aboveSeaDependency: "CONNECTED",
      computationMode,
      boundaryActive: true,
      nodeCount: nodes.length,
      seaLevelDatum: true,
      seaLevelDatumValue: SEA_LEVEL_DATUM,
      waterEdgeGeometry: true,
      coastlineBoundary: true,
      beachCandidatesOnly: true,
      dryBoundaryGeometry: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      climate: false,
      biome: false,
      renders: false,
      finalVisualPass: false,
      summary: summarize(cells),
      features,
      cells,
      receipt
    });
  }

  function buildPacket() {
    const nodePacket = getNodePacket();

    if (!nodePacket) {
      return inactivePacket("WAITING_FOR_NODE_COMPOSER", "UNRESOLVED", "UNRESOLVED");
    }

    if (!Array.isArray(nodePacket.nodes) || !nodePacket.nodes.length) {
      return inactivePacket("NODE_PACKET_INVALID_OR_EMPTY", "UNRESOLVED", "UNRESOLVED");
    }

    const aboveSeaPacket = getAboveSeaPacket();

    if (!aboveSeaPacket || !aboveSeaPacket.active || !Array.isArray(aboveSeaPacket.cells) || !aboveSeaPacket.cells.length) {
      return inactivePacket("WAITING_FOR_ABOVE_SEA_PACKET", "MISSING_OR_INACTIVE", "UNRESOLVED");
    }

    return activePacket(nodePacket, aboveSeaPacket, getSubterraneanPacket());
  }

  let packet = buildPacket();

  function publish() {
    window.AUDRALIA_CANVAS_TERRAIN_NODES_BOUNDARY_PACKET = packet;
    window.AUDRALIA_CANVAS_TERRAIN_NODES_BOUNDARY_RECEIPT = packet.receipt;

    safeDataset("audraliaCanvasTerrainNodesBoundaryContract", CONTRACT);
    safeDataset("audraliaCanvasTerrainNodesBoundaryActive", packet.active ? "true" : "false");
    safeDataset("audraliaCanvasTerrainNodesBoundaryDependency", packet.dependencyStatus);
    safeDataset("audraliaCanvasTerrainNodesBoundaryAboveSeaDependency", packet.aboveSeaDependency);
    safeDataset("audraliaCanvasTerrainNodesBoundarySubterraneanDependency", packet.subterraneanDependency);
    safeDataset("audraliaCanvasTerrainWaterEdgeGeometry", packet.waterEdgeGeometry ? "true" : "false");
    safeDataset("audraliaCanvasTerrainActiveWater", "false");
    safeDataset("audraliaCanvasTerrainHydration", "false");
    safeDataset("audraliaCanvasTerrainFinalVisualPass", "false");
  }

  function refresh() {
    const subterraneanApi = window.DGBAudraliaCanvasTerrainNodesSubterranean;
    const aboveSeaApi = window.DGBAudraliaCanvasTerrainNodesAboveSea;

    if (subterraneanApi && typeof subterraneanApi.refresh === "function") {
      try {
        subterraneanApi.refresh();
      } catch (_error) {}
    }

    if (aboveSeaApi && typeof aboveSeaApi.refresh === "function") {
      try {
        aboveSeaApi.refresh();
      } catch (_error2) {}
    }

    packet = buildPacket();
    publish();
    return packet;
  }

  function getPacket() {
    return packet;
  }

  function getCell(nodeId) {
    const id = String(nodeId || "");
    return packet.cells.find((cell) => cell.nodeId === id) || null;
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      ccr: CCR,
      fullPlan: FULL_PLAN,
      previousFile1Contract: PREVIOUS_FILE_1_CONTRACT,
      previousFile2Contract: PREVIOUS_FILE_2_CONTRACT,
      route: ROUTE,
      target: TARGET,
      active: Boolean(packet.active),
      dependencyStatus: packet.dependencyStatus,
      aboveSeaDependency: packet.aboveSeaDependency,
      subterraneanDependency: packet.subterraneanDependency,
      computationMode: packet.computationMode,
      boundaryActive: Boolean(packet.boundaryActive),
      nodeCount: packet.nodeCount || 0,
      cellCount: packet.cells.length,
      seaLevelDatum: true,
      waterEdgeGeometry: Boolean(packet.waterEdgeGeometry),
      coastlineBoundary: Boolean(packet.coastlineBoundary),
      beachCandidatesOnly: true,
      dryBoundaryGeometry: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      beachRendering: false,
      climate: false,
      biome: false,
      renders: false,
      finalVisualPass: false
    });
  }

  window[API_NAME] = Object.freeze({
    contract: CONTRACT,
    getPacket,
    getCell,
    refresh,
    status
  });

  publish();
})();
