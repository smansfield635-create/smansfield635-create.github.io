// TARGET FILE: /showroom/globe/audralia/planet/index.terrain.subterranean.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_TERRAIN_SUBTERRANEAN_PRESSURE_TNT_v1
//
// Owns below-datum terrain force.
// Reads terrain nodes.
// Does not render.
// Does not activate water.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PLANET_TERRAIN_SUBTERRANEAN_PRESSURE_TNT_v1";
  const NODE_CONTRACT = "AUDRALIA_PLANET_TERRAIN_NODES_256_LATTICE_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.terrain.subterranean.js";
  const API_NAME = "DGBAudraliaTerrainSubterranean";

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
    const value = Math.sin(seed * 91.7 + 41.3) * 21942.68173;
    return value - Math.floor(value);
  }

  function getNodePacket() {
    if (window.DGBAudraliaTerrainNodes && typeof window.DGBAudraliaTerrainNodes.getPacket === "function") {
      return window.DGBAudraliaTerrainNodes.getPacket();
    }

    return window.AUDRALIA_PLANET_TERRAIN_NODES_PACKET || null;
  }

  function classifyCell(cell) {
    if (cell.upliftPotential >= 0.72) return "UPLIFT_CORE";
    if (cell.faultPressure >= 0.68) return "FAULT_PRESSURE";
    if (cell.compression >= 0.64) return "COMPRESSION_ZONE";
    if (cell.collapsePotential >= 0.58) return "BASIN_PULL";
    return "STABLE_BURIED_MASS";
  }

  function computeCell(node) {
    const seed = node.localLattice.seed;
    const pulse = hash01(seed + node.seatIndex * 3);
    const shear = hash01(seed + node.row * 23 + node.column * 31);
    const deepMass = clamp(0.22 + node.subterraneanEligibility * 0.46 + node.summitPressure * 0.24 + pulse * 0.08, 0, 1);
    const crustStress = clamp(0.18 + node.terrainPotential * 0.28 + shear * 0.30 + Math.abs(node.column - 7.5) * 0.018, 0, 1);
    const compression = clamp((deepMass * 0.52) + (crustStress * 0.34) + (node.summitPressure * 0.14), 0, 1);
    const faultPressure = clamp(crustStress * 0.55 + shear * 0.30 + (node.row % 4 === 0 || node.column % 4 === 0 ? 0.12 : 0.02), 0, 1);
    const upliftPotential = clamp(deepMass * 0.50 + node.summitPressure * 0.34 + pulse * 0.16, 0, 1);
    const collapsePotential = clamp((1 - node.terrainPotential) * 0.34 + node.boundaryEligibility * 0.18 + hash01(seed + 401) * 0.26, 0, 1);
    const basinPotential = clamp(collapsePotential * 0.54 + (1 - upliftPotential) * 0.22 + node.boundaryEligibility * 0.20, 0, 1);

    const cell = {
      nodeId: node.nodeId,
      seatIndex: node.seatIndex,
      row: node.row,
      column: node.column,
      regionFamily: node.regionFamily,
      primarySummit: node.primarySummit,
      subterraneanPressure: round(deepMass),
      crustStress: round(crustStress),
      buriedMassForce: round(deepMass * compression),
      compression: round(compression),
      faultPressure: round(faultPressure),
      upliftPotential: round(upliftPotential),
      collapsePotential: round(collapsePotential),
      basinPotential: round(basinPotential),
      dryBelowDatum: true,
      activeWater: false,
      renders: false
    };

    cell.subterraneanClass = classifyCell(cell);
    return Object.freeze(cell);
  }

  function summarize(cells) {
    const totals = cells.reduce((acc, cell) => {
      acc.pressure += cell.subterraneanPressure;
      acc.uplift += cell.upliftPotential;
      acc.fault += cell.faultPressure;
      acc.collapse += cell.collapsePotential;
      acc.basin += cell.basinPotential;
      acc.classes[cell.subterraneanClass] = (acc.classes[cell.subterraneanClass] || 0) + 1;
      return acc;
    }, {
      pressure: 0,
      uplift: 0,
      fault: 0,
      collapse: 0,
      basin: 0,
      classes: {}
    });

    const count = Math.max(1, cells.length);

    return Object.freeze({
      averagePressure: round(totals.pressure / count),
      averageUplift: round(totals.uplift / count),
      averageFaultPressure: round(totals.fault / count),
      averageCollapsePotential: round(totals.collapse / count),
      averageBasinPotential: round(totals.basin / count),
      classCounts: Object.freeze({ ...totals.classes })
    });
  }

  function buildPacket() {
    const nodePacket = getNodePacket();

    if (!nodePacket || !Array.isArray(nodePacket.nodes)) {
      return Object.freeze({
        contract: CONTRACT,
        route: ROUTE,
        target: TARGET,
        nodeContract: NODE_CONTRACT,
        active: false,
        error: "TERRAIN_NODES_PACKET_MISSING",
        subterraneanActive: false,
        activeWater: false,
        hydration: false,
        renders: false,
        finalVisualPass: false,
        cells: Object.freeze([])
      });
    }

    const cells = Object.freeze(nodePacket.nodes.map(computeCell));

    return Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      target: TARGET,
      nodeContract: nodePacket.contract,
      role: "subterranean-terrain-pressure",
      active: true,
      subterraneanActive: true,
      nodeCount: nodePacket.nodes.length,
      seaLevelDatum: true,
      dryBelowDatum: true,
      activeWater: false,
      hydration: false,
      oceans: false,
      rivers: false,
      lakes: false,
      renders: false,
      finalVisualPass: false,
      summary: summarize(cells),
      cells
    });
  }

  let packet = buildPacket();

  function refresh() {
    packet = buildPacket();
    publish();
    return packet;
  }

  function getPacket() {
    return packet;
  }

  function getCell(nodeId) {
    return packet.cells.find((cell) => cell.nodeId === nodeId) || null;
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      target: TARGET,
      active: Boolean(packet.active),
      subterraneanActive: Boolean(packet.subterraneanActive),
      nodeCount: packet.nodeCount || 0,
      activeWater: false,
      hydration: false,
      renders: false,
      finalVisualPass: false,
      error: packet.error || ""
    });
  }

  function publish() {
    window.AUDRALIA_PLANET_TERRAIN_SUBTERRANEAN_PACKET = packet;
    window.AUDRALIA_PLANET_TERRAIN_SUBTERRANEAN_RECEIPT = status();

    window[API_NAME] = Object.freeze({
      contract: CONTRACT,
      getPacket,
      getCell,
      refresh,
      status
    });

    try {
      document.documentElement.dataset.audraliaTerrainSubterraneanContract = CONTRACT;
      document.documentElement.dataset.audraliaTerrainSubterraneanActive = packet.active ? "true" : "false";
      document.documentElement.dataset.audraliaTerrainActiveWater = "false";
    } catch (_error) {}
  }

  publish();
})();
