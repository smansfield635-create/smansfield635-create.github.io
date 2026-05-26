// TARGET FILE: /showroom/globe/audralia/planet/index.canvas.terrain.nodes.subterranean.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_TNT_v1
//
// File 1 of 5 in the backward-build terrain strategy.
// Authority position:
// index.canvas.js
// └── index.canvas.terrain.nodes.js
//     └── index.canvas.terrain.nodes.subterranean.js
//
// Owns:
// - below-datum terrain force
// - subterranean pressure
// - buried mass force
// - crust stress
// - compression zones
// - uplift potential
// - fault pressure
// - collapse / basin pressure
// - hidden terrain consequence
//
// Does not own:
// - canvas rendering
// - canvas creation
// - drag / rotation
// - node baseline authority
// - above-sea terrain
// - boundary geometry
// - hydration
// - active water
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_TNT_v1";
  const SPEC_OPS = "AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_SPEC_OPS_v1";
  const CCR = "AUDRALIA_PLANET_FILE_1_SUBTERRANEAN_GRANDCHILD_CCR_v1";
  const FULL_PLAN = "AUDRALIA_PLANET_CANVAS_TERRAIN_BACKWARD_BUILD_FULL_PLAN_CCR_v1";

  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.subterranean.js";
  const FUTURE_NODE_CHILD = "/showroom/globe/audralia/planet/index.canvas.terrain.nodes.js";
  const API_NAME = "DGBAudraliaCanvasTerrainNodesSubterranean";

  const SEA_LEVEL_DATUM = 0.42;

  const CLASS = Object.freeze({
    UPLIFT_CORE: "UPLIFT_CORE",
    FAULT_PRESSURE: "FAULT_PRESSURE",
    COMPRESSION_ZONE: "COMPRESSION_ZONE",
    BASIN_PULL: "BASIN_PULL",
    STABLE_BURIED_MASS: "STABLE_BURIED_MASS"
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
    const value = Math.sin(safeSeed * 91.713 + 41.337) * 21942.68173;
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
      subterraneanEligibility: clamp(node.subterraneanEligibility, 0, 1),
      boundaryEligibility: clamp(node.boundaryEligibility, 0, 1),
      localLattice: Object.freeze({
        seed: localSeed
      })
    });
  }

  function summitModifier(primarySummit) {
    const text = String(primarySummit || "");

    if (text.includes("SUMMIT_01")) return 0.105;
    if (text.includes("SUMMIT_02")) return 0.072;
    if (text.includes("SUMMIT_03")) return 0.066;
    if (text.includes("SUMMIT_04")) return 0.060;
    if (text.includes("SUMMIT_05")) return 0.056;
    if (text.includes("SUMMIT_06")) return 0.050;
    if (text.includes("SUMMIT_07")) return 0.048;
    if (text.includes("SUMMIT_08")) return 0.044;
    if (text.includes("SUMMIT_09")) return 0.042;

    return 0.025;
  }

  function rowColumnPressure(node) {
    const centerRowDistance = Math.abs(Number(node.row) - 7.5) / 7.5;
    const centerColumnDistance = Math.abs(Number(node.column) - 7.5) / 7.5;
    const interiorWeight = 1 - clamp((centerRowDistance + centerColumnDistance) / 2, 0, 1);
    const meridianStress = node.column % 4 === 0 ? 0.055 : node.column % 2 === 0 ? 0.026 : 0.012;
    const latitudeStress = node.row % 4 === 0 ? 0.050 : node.row % 2 === 0 ? 0.024 : 0.010;

    return clamp(interiorWeight * 0.15 + meridianStress + latitudeStress, 0, 0.28);
  }

  function classifyCell(cell) {
    if (cell.upliftPotential >= 0.72 && cell.subterraneanPressure >= 0.58) return CLASS.UPLIFT_CORE;
    if (cell.faultPressure >= 0.68) return CLASS.FAULT_PRESSURE;
    if (cell.compression >= 0.64) return CLASS.COMPRESSION_ZONE;
    if (cell.basinPotential >= 0.58 || cell.collapsePotential >= 0.60) return CLASS.BASIN_PULL;
    return CLASS.STABLE_BURIED_MASS;
  }

  function computeCell(rawNode, fallbackIndex) {
    const node = normalizeNode(rawNode, fallbackIndex);
    const seed = node.localLattice.seed;

    const pulse = hash01(seed + node.seatIndex * 3 + 17);
    const shear = hash01(seed + node.row * 23 + node.column * 31 + 101);
    const buriedNoise = hash01(seed + node.seatIndex * 13 + 503);
    const collapseNoise = hash01(seed + node.row * 67 + node.column * 71 + 907);

    const summitForce = clamp(node.summitPressure + summitModifier(node.primarySummit), 0, 1);
    const positionPressure = rowColumnPressure(node);

    const subterraneanPressure = clamp(
      0.16 +
      node.subterraneanEligibility * 0.38 +
      node.terrainPotential * 0.16 +
      summitForce * 0.20 +
      positionPressure * 0.08 +
      pulse * 0.12,
      0,
      1
    );

    const crustStress = clamp(
      0.12 +
      node.terrainPotential * 0.22 +
      node.boundaryEligibility * 0.08 +
      shear * 0.30 +
      positionPressure * 0.28,
      0,
      1
    );

    const compression = clamp(
      subterraneanPressure * 0.46 +
      crustStress * 0.30 +
      summitForce * 0.18 +
      buriedNoise * 0.06,
      0,
      1
    );

    const faultPressure = clamp(
      crustStress * 0.48 +
      shear * 0.24 +
      node.boundaryEligibility * 0.12 +
      (node.row % 4 === 0 || node.column % 4 === 0 ? 0.10 : 0.025),
      0,
      1
    );

    const upliftPotential = clamp(
      subterraneanPressure * 0.42 +
      summitForce * 0.31 +
      node.terrainPotential * 0.14 +
      pulse * 0.13,
      0,
      1
    );

    const collapsePotential = clamp(
      (1 - node.terrainPotential) * 0.28 +
      node.boundaryEligibility * 0.18 +
      collapseNoise * 0.26 +
      (1 - upliftPotential) * 0.12,
      0,
      1
    );

    const basinPotential = clamp(
      collapsePotential * 0.44 +
      (1 - upliftPotential) * 0.20 +
      node.boundaryEligibility * 0.20 +
      (1 - subterraneanPressure) * 0.10,
      0,
      1
    );

    const buriedMassForce = clamp(
      subterraneanPressure * 0.45 +
      compression * 0.32 +
      summitForce * 0.13 +
      buriedNoise * 0.10,
      0,
      1
    );

    const cell = {
      nodeId: node.nodeId,
      seatIndex: node.seatIndex,
      row: node.row,
      column: node.column,
      regionFamily: node.regionFamily,
      primarySummit: node.primarySummit,
      subterraneanPressure: round(subterraneanPressure),
      crustStress: round(crustStress),
      buriedMassForce: round(buriedMassForce),
      compression: round(compression),
      faultPressure: round(faultPressure),
      upliftPotential: round(upliftPotential),
      collapsePotential: round(collapsePotential),
      basinPotential: round(basinPotential),
      dryBelowDatum: true,
      seaLevelDatum: true,
      seaLevelDatumValue: SEA_LEVEL_DATUM,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      renders: false,
      finalVisualPass: false
    };

    cell.subterraneanClass = classifyCell(cell);

    return Object.freeze(cell);
  }

  function summarize(cells) {
    const count = Math.max(1, cells.length);
    const totals = cells.reduce((acc, cell) => {
      acc.subterraneanPressure += cell.subterraneanPressure;
      acc.crustStress += cell.crustStress;
      acc.buriedMassForce += cell.buriedMassForce;
      acc.compression += cell.compression;
      acc.faultPressure += cell.faultPressure;
      acc.upliftPotential += cell.upliftPotential;
      acc.collapsePotential += cell.collapsePotential;
      acc.basinPotential += cell.basinPotential;
      acc.classCounts[cell.subterraneanClass] = (acc.classCounts[cell.subterraneanClass] || 0) + 1;
      return acc;
    }, {
      subterraneanPressure: 0,
      crustStress: 0,
      buriedMassForce: 0,
      compression: 0,
      faultPressure: 0,
      upliftPotential: 0,
      collapsePotential: 0,
      basinPotential: 0,
      classCounts: {}
    });

    return Object.freeze({
      cellCount: cells.length,
      averageSubterraneanPressure: round(totals.subterraneanPressure / count),
      averageCrustStress: round(totals.crustStress / count),
      averageBuriedMassForce: round(totals.buriedMassForce / count),
      averageCompression: round(totals.compression / count),
      averageFaultPressure: round(totals.faultPressure / count),
      averageUpliftPotential: round(totals.upliftPotential / count),
      averageCollapsePotential: round(totals.collapsePotential / count),
      averageBasinPotential: round(totals.basinPotential / count),
      classCounts: Object.freeze({ ...totals.classCounts })
    });
  }

  function inactivePacket(reason) {
    const receipt = Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      target: TARGET,
      active: false,
      dependencyStatus: reason,
      subterraneanActive: false,
      nodeCount: 0,
      activeWater: false,
      hydration: false,
      finalVisualPass: false
    });

    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      ccr: CCR,
      fullPlan: FULL_PLAN,
      route: ROUTE,
      target: TARGET,
      role: "subterranean-terrain-grandchild",
      authorityPosition: "canvas->terrain-nodes->subterranean",
      buildPosition: "1_of_5",
      parentNodeFile: FUTURE_NODE_CHILD,
      parentNodeContract: "WAITING_FOR_NODE_COMPOSER",
      active: false,
      dependencyStatus: reason,
      subterraneanActive: false,
      nodeCount: 0,
      seaLevelDatum: true,
      seaLevelDatumValue: SEA_LEVEL_DATUM,
      dryBelowDatum: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      renders: false,
      finalVisualPass: false,
      summary: summarize([]),
      cells: Object.freeze([]),
      receipt
    });
  }

  function activePacket(nodePacket) {
    const nodes = Array.isArray(nodePacket.nodes) ? nodePacket.nodes : [];
    const cells = freezeArray(nodes.map((node, index) => computeCell(node, index)));

    const receipt = Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      target: TARGET,
      active: true,
      dependencyStatus: "NODE_PACKET_CONNECTED",
      parentNodeContract: String(nodePacket.contract || "NODE_PACKET_CONTRACT_UNSPECIFIED"),
      subterraneanActive: true,
      nodeCount: nodes.length,
      activeWater: false,
      hydration: false,
      finalVisualPass: false
    });

    return Object.freeze({
      contract: CONTRACT,
      specOps: SPEC_OPS,
      ccr: CCR,
      fullPlan: FULL_PLAN,
      route: ROUTE,
      target: TARGET,
      role: "subterranean-terrain-grandchild",
      authorityPosition: "canvas->terrain-nodes->subterranean",
      buildPosition: "1_of_5",
      parentNodeFile: FUTURE_NODE_CHILD,
      parentNodeContract: String(nodePacket.contract || "NODE_PACKET_CONTRACT_UNSPECIFIED"),
      active: true,
      dependencyStatus: "NODE_PACKET_CONNECTED",
      subterraneanActive: true,
      nodeCount: nodes.length,
      seaLevelDatum: true,
      seaLevelDatumValue: SEA_LEVEL_DATUM,
      dryBelowDatum: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      renders: false,
      finalVisualPass: false,
      summary: summarize(cells),
      cells,
      receipt
    });
  }

  function buildPacket() {
    const nodePacket = getNodePacket();

    if (!nodePacket) {
      return inactivePacket("WAITING_FOR_NODE_COMPOSER");
    }

    if (!Array.isArray(nodePacket.nodes)) {
      return inactivePacket("NODE_PACKET_INVALID");
    }

    if (!nodePacket.nodes.length) {
      return inactivePacket("NODE_PACKET_EMPTY");
    }

    return activePacket(nodePacket);
  }

  let packet = buildPacket();

  function publish() {
    window.AUDRALIA_CANVAS_TERRAIN_NODES_SUBTERRANEAN_PACKET = packet;
    window.AUDRALIA_CANVAS_TERRAIN_NODES_SUBTERRANEAN_RECEIPT = packet.receipt;

    safeDataset("audraliaCanvasTerrainNodesSubterraneanContract", CONTRACT);
    safeDataset("audraliaCanvasTerrainNodesSubterraneanActive", packet.active ? "true" : "false");
    safeDataset("audraliaCanvasTerrainNodesSubterraneanDependency", packet.dependencyStatus);
    safeDataset("audraliaCanvasTerrainActiveWater", "false");
    safeDataset("audraliaCanvasTerrainHydration", "false");
    safeDataset("audraliaCanvasTerrainFinalVisualPass", "false");
  }

  function refresh() {
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
      specOps: SPEC_OPS,
      ccr: CCR,
      fullPlan: FULL_PLAN,
      route: ROUTE,
      target: TARGET,
      active: Boolean(packet.active),
      dependencyStatus: packet.dependencyStatus,
      subterraneanActive: Boolean(packet.subterraneanActive),
      nodeCount: packet.nodeCount || 0,
      cellCount: packet.cells.length,
      seaLevelDatum: true,
      dryBelowDatum: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
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
