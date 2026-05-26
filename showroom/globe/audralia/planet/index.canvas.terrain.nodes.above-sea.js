// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.terrain.nodes.above-sea.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_FILE_2_ABOVE_SEA_GRANDCHILD_TNT_v1
//
// File 2 of 5 in the backward-build terrain strategy.
// Authority position:
// index.canvas.js
// └── index.canvas.terrain.nodes.js
//     ├── index.canvas.terrain.nodes.subterranean.js
//     └── index.canvas.terrain.nodes.above-sea.js
//
// Owns:
// - dry above-sea terrain expression
// - elevation bands
// - above-sea datum classification
// - mountain / ridge / basin / plateau / escarpment signals
// - summit emergence signal
// - regional elevation hierarchy
//
// Does not own:
// - canvas rendering
// - canvas creation
// - drag / rotation
// - node baseline authority
// - subterranean authority
// - boundary geometry
// - coastline geometry
// - beach candidates
// - hydration
// - active water
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PLANET_FILE_2_ABOVE_SEA_GRANDCHILD_TNT_v1";
  const SPEC_OPS = "AUDRALIA_PLANET_FILE_2_ABOVE_SEA_GRANDCHILD_SPEC_OPS_v1";
  const CCR = "AUDRALIA_PLANET_FILE_2_ABOVE_SEA_GRANDCHILD_CCR_v1";
  const FULL_PLAN = "AUDRALIA_PLANET_CANVAS_TERRAIN_BACKWARD_BUILD_FULL_PLAN_CCR_v1";
  const PREVIOUS_FILE_CONTRACT = "AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.above-sea.js";
  const FUTURE_NODE_CHILD = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.js";
  const SUBTERRANEAN_FILE = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.subterranean.js";
  const API_NAME = "DGBAudraliaCanvasTerrainNodesAboveSea";

  const SEA_LEVEL_DATUM = 0.42;

  const ELEVATION_BAND = Object.freeze({
    BELOW_DATUM_DRY_BASIN: "BELOW_DATUM_DRY_BASIN",
    LOW_DRY_SHELF: "LOW_DRY_SHELF",
    LOWLAND_EXPOSED: "LOWLAND_EXPOSED",
    PLATEAU_RISE: "PLATEAU_RISE",
    RIDGE_FIELD: "RIDGE_FIELD",
    MOUNTAIN_FIELD: "MOUNTAIN_FIELD",
    SUMMIT_FIELD: "SUMMIT_FIELD"
  });

  const LANDFORM = Object.freeze({
    CENTRAL_SUMMIT: "central-summit",
    MOUNTAIN: "mountain",
    RIDGE: "ridge",
    BASIN: "basin",
    ESCARPMENT: "escarpment",
    PLATEAU: "plateau",
    DRY_BELOW_DATUM_SHELF: "dry-below-datum-shelf",
    DRY_LOWLAND: "dry-lowland"
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
    const value = Math.sin(safeSeed * 83.317 + 271.193) * 31415.92653;
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
      if (document && document.documentElement) {
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
    const row = Number.isFinite(Number(node.row)) ? Number(node.row) : Math.floor(seatIndex / 16);
    const column = Number.isFinite(Number(node.column)) ? Number(node.column) : seatIndex % 16;
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
      aboveSeaEligibility: clamp(node.aboveSeaEligibility, 0, 1),
      boundaryEligibility: clamp(node.boundaryEligibility, 0, 1),
      localLattice: Object.freeze({
        seed: localSeed
      })
    });
  }

  function normalizeSubterranean(cell) {
    if (!cell || typeof cell !== "object") {
      return Object.freeze({
        connected: false,
        subterraneanPressure: 0.28,
        crustStress: 0.24,
        buriedMassForce: 0.24,
        compression: 0.24,
        faultPressure: 0.18,
        upliftPotential: 0.22,
        collapsePotential: 0.22,
        basinPotential: 0.20,
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

  function buildSubterraneanMap(packet) {
    const map = new Map();

    if (!packet || !Array.isArray(packet.cells) || !packet.active) return map;

    for (const cell of packet.cells) {
      if (cell && cell.nodeId) map.set(String(cell.nodeId), cell);
    }

    return map;
  }

  function summitModifier(primarySummit) {
    const text = String(primarySummit || "");

    if (text.includes("SUMMIT_01")) return 0.115;
    if (text.includes("SUMMIT_02")) return 0.070;
    if (text.includes("SUMMIT_03")) return 0.066;
    if (text.includes("SUMMIT_04")) return 0.058;
    if (text.includes("SUMMIT_05")) return 0.054;
    if (text.includes("SUMMIT_06")) return 0.050;
    if (text.includes("SUMMIT_07")) return 0.048;
    if (text.includes("SUMMIT_08")) return 0.044;
    if (text.includes("SUMMIT_09")) return 0.042;

    return 0.020;
  }

  function positionElevation(node) {
    const centerRowDistance = Math.abs(Number(node.row) - 7.5) / 7.5;
    const centerColumnDistance = Math.abs(Number(node.column) - 7.5) / 7.5;
    const interiorWeight = 1 - clamp((centerRowDistance + centerColumnDistance) / 2, 0, 1);
    const rowShelf = node.row <= 2 || node.row >= 13 ? -0.035 : 0;
    const rimRise = node.column <= 2 || node.column >= 13 ? 0.028 : 0;

    return clamp(interiorWeight * 0.105 + rowShelf + rimRise, -0.05, 0.14);
  }

  function elevationBand(value) {
    if (value < 0.30) return ELEVATION_BAND.BELOW_DATUM_DRY_BASIN;
    if (value < SEA_LEVEL_DATUM) return ELEVATION_BAND.LOW_DRY_SHELF;
    if (value < 0.52) return ELEVATION_BAND.LOWLAND_EXPOSED;
    if (value < 0.64) return ELEVATION_BAND.PLATEAU_RISE;
    if (value < 0.76) return ELEVATION_BAND.RIDGE_FIELD;
    if (value < 0.88) return ELEVATION_BAND.MOUNTAIN_FIELD;
    return ELEVATION_BAND.SUMMIT_FIELD;
  }

  function classifyLandform(node, sub, elevation, signals) {
    if (signals.summitEmergenceSignal >= 0.82 && elevation >= 0.78) return LANDFORM.CENTRAL_SUMMIT;
    if (signals.mountainSignal >= 0.70 && elevation >= 0.68) return LANDFORM.MOUNTAIN;
    if (signals.ridgeSignal >= 0.66 && elevation >= 0.54) return LANDFORM.RIDGE;
    if (signals.basinSignal >= 0.62 && elevation < 0.54) return LANDFORM.BASIN;
    if (signals.escarpmentSignal >= 0.62 && elevation >= 0.48) return LANDFORM.ESCARPMENT;
    if (signals.plateauSignal >= 0.58 && elevation >= 0.52) return LANDFORM.PLATEAU;
    if (elevation < SEA_LEVEL_DATUM) return LANDFORM.DRY_BELOW_DATUM_SHELF;
    return LANDFORM.DRY_LOWLAND;
  }

  function computeSignals(node, sub, elevation, seedNoise) {
    const mountainSignal = clamp(
      (elevation - 0.56) * 1.35 +
      sub.upliftPotential * 0.34 +
      node.summitPressure * 0.18 +
      seedNoise * 0.08,
      0,
      1
    );

    const ridgeSignal = clamp(
      sub.faultPressure * 0.42 +
      sub.crustStress * 0.22 +
      node.
