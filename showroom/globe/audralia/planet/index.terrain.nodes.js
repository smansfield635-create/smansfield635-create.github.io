// TARGET FILE: /showroom/globe/audralia/planet/index.terrain.nodes.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_PLANET_TERRAIN_NODES_256_LATTICE_TNT_v1
//
// Owns:
// - Planetary terrain nodes.
// - 16 × 16 macro seat alignment.
// - 256-state local lattice identity per node.
// - Nine Summits geographic influence.
// - Dry-world terrain eligibility.
// Does not render.
// Does not activate water.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_PLANET_TERRAIN_NODES_256_LATTICE_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.terrain.nodes.js";
  const API_NAME = "DGBAudraliaTerrainNodes";

  const MACRO_ROWS = 16;
  const MACRO_COLUMNS = 16;
  const MACRO_NODE_COUNT = 256;
  const LOCAL_ROWS = 16;
  const LOCAL_COLUMNS = 16;
  const LOCAL_STATE_COUNT = 256;
  const TAU = Math.PI * 2;

  const FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  const NINE_SUMMITS = Object.freeze([
    { id: "SUMMIT_01_CROWN", lat: -20.0, lon: 134.0, rank: 1.00, family: "central-crown" },
    { id: "SUMMIT_02_NORTH_GATE", lat: -10.5, lon: 132.0, rank: 0.82, family: "north-memory" },
    { id: "SUMMIT_03_EAST_RISE", lat: -24.0, lon: 150.0, rank: 0.78, family: "east-ridge" },
    { id: "SUMMIT_04_SOUTH_ANCHOR", lat: -38.0, lon: 137.0, rank: 0.76, family: "south-anchor" },
    { id: "SUMMIT_05_WEST_SHELF", lat: -26.5, lon: 114.0, rank: 0.74, family: "west-shelf" },
    { id: "SUMMIT_06_NORTHEAST_EDGE", lat: -15.5, lon: 146.5, rank: 0.68, family: "northeast-edge" },
    { id: "SUMMIT_07_SOUTHEAST_FAULT", lat: -36.5, lon: 148.5, rank: 0.66, family: "southeast-fault" },
    { id: "SUMMIT_08_SOUTHWEST_BASIN", lat: -34.0, lon: 117.5, rank: 0.62, family: "southwest-basin" },
    { id: "SUMMIT_09_INNER_BOWL", lat: -27.0, lon: 129.0, rank: 0.60, family: "inner-bowl" }
  ]);

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
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return value - Math.floor(value);
  }

  function toRad(degrees) {
    return (degrees / 180) * Math.PI;
  }

  function toDeg(radians) {
    return (radians / Math.PI) * 180;
  }

  function centeredLon(lon) {
    return toRad(lon - 134.5);
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
      const d = angularDistance(latitude, longitude, toRad(summit.lat), centeredLon(summit.lon));
      const spread = 0.42 + summit.rank * 0.18;
      const influence = Math.exp(-(d * d) / (spread * spread)) * summit.rank;

      return Object.freeze({
        summitId: summit.id,
        family: summit.family,
        rank: summit.rank,
        influence: round(influence),
        order: index + 1
      });
    }).sort((a, b) => b.influence - a.influence || a.order - b.order);
  }

  function regionalFamily(latitude, longitude, topSummit, row, column) {
    if (topSummit && topSummit.influence > 0.42) return topSummit.family;
    if (row <= 3) return "northern-dry-memory";
    if (row >= 12) return "southern-datum-pressure";
    if (column <= 3) return "western-shelf";
    if (column >= 12) return "eastern-rise";
    return "interior-clay-mass";
  }

  function makeNode(row, column) {
    const v = (row + 0.5) / MACRO_ROWS;
    const latitude = Math.asin(1 - 2 * v);
    const longitude = (column / MACRO_COLUMNS) * TAU - Math.PI;
    const seatIndex = row * MACRO_COLUMNS + column;
    const macroState = seatIndex + 1;
    const fibonacci = FIBONACCI_SEQUENCE[row];
    const fibPhase = fibonacci / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];
    const summitSet = summitInfluence(latitude, longitude);
    const primarySummit = summitSet[0];
    const secondarySummit = summitSet[1];
    const noise = hash01(macroState + 19);
    const latitudePressure = 1 - Math.abs(Math.sin(latitude)) * 0.18;
    const summitPressure = clamp((primarySummit.influence * 0.72) + (secondarySummit.influence * 0.28), 0, 1);
    const terrainPotential = clamp(0.18 + summitPressure * 0.52 + fibPhase * 0.18 + noise * 0.12, 0, 1);
    const boundaryEligibility = clamp(
      Math.abs(column - 7.5) > 4.25 || row <= 3 || row >= 12
        ? 0.42 + noise * 0.28 + (1 - terrainPotential) * 0.24
        : 0.10 + noise * 0.18,
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
      fibonacciPhase: round(fibPhase),
      localLattice: Object.freeze({
        stateCount: LOCAL_STATE_COUNT,
        rows: LOCAL_ROWS,
        columns: LOCAL_COLUMNS,
        seed: Math.floor((macroState * 977) + (fibonacci * 13) + (primarySummit.order * 101)),
        representation: "DETERMINISTIC_16_BY_16_LOCAL_STATE_LATTICE"
      }),
      regionFamily: regionalFamily(latitude, longitude, primarySummit, row, column),
      nineSummitsInfluence: Object.freeze(summitSet.slice(0, 3)),
      primarySummit: primarySummit.summitId,
      secondarySummit: secondarySummit.summitId,
      summitPressure: round(summitPressure),
      latitudePressure: round(latitudePressure),
      terrainPotential: round(terrainPotential),
      subterraneanEligibility: round(clamp(0.24 + terrainPotential * 0.52 + summitPressure * 0.24, 0, 1)),
      aboveSeaEligibility: round(clamp(0.18 + terrainPotential * 0.58 + latitudePressure * 0.18, 0, 1)),
      boundaryEligibility: round(boundaryEligibility),
      dryWorldStatus: "DRY_TERRAIN_NODE_READY",
      seaLevelDatumOnly: true,
      activeWater: false,
      hydration: false,
      renders: false
    });
  }

  function getLocalState(nodeIdOrIndex, localStateIndex) {
    const node = getNode(nodeIdOrIndex);
    const index = clamp(Math.floor(localStateIndex), 0, LOCAL_STATE_COUNT - 1);
    const row = Math.floor(index / LOCAL_COLUMNS);
    const column = index % LOCAL_COLUMNS;
    const seed = node ? node.localLattice.seed : 1;
    const signal = hash01(seed + index * 17);
    const opposing = hash01(seed + index * 29 + 7);
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
      nodeId: node ? node.nodeId : "UNKNOWN",
      localStateIndex: index,
      row,
      column,
      localRole: roleList[Math.floor(signal * roleList.length) % roleList.length],
      pressureSignal: round(signal),
      oppositionSignal: round(opposing),
      dryState: true,
      activeWater: false
    });
  }

  const nodes = Object.freeze(Array.from({ length: MACRO_NODE_COUNT }, (_unused, index) => {
    return makeNode(Math.floor(index / MACRO_COLUMNS), index % MACRO_COLUMNS);
  }));

  function getNode(nodeIdOrIndex) {
    if (typeof nodeIdOrIndex === "number") return nodes[clamp(Math.floor(nodeIdOrIndex), 0, nodes.length - 1)];
    const id = String(nodeIdOrIndex || "");
    return nodes.find((node) => node.nodeId === id) || null;
  }

  const packet = Object.freeze({
    contract: CONTRACT,
    route: ROUTE,
    target: TARGET,
    role: "terrain-node-authority",
    parentCanvas: "/showroom/globe/audralia/planet/index.canvas.js",
    macroRows: MACRO_ROWS,
    macroColumns: MACRO_COLUMNS,
    macroNodeCount: MACRO_NODE_COUNT,
    localLatticeRows: LOCAL_ROWS,
    localLatticeColumns: LOCAL_COLUMNS,
    localStateCountPerNode: LOCAL_STATE_COUNT,
    localStateModel: "HYBRID_256_GLOBAL_SEATS_WITH_256_STATE_LOCAL_LATTICE_IDENTITY",
    totalRepresentedLocalStates: MACRO_NODE_COUNT * LOCAL_STATE_COUNT,
    nineSummitsGeographicAuthority: true,
    seaLevelDatum: true,
    activeWater: false,
    hydration: false,
    oceans: false,
    rivers: false,
    lakes: false,
    renders: false,
    finalVisualPass: false,
    nodes
  });

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      route: ROUTE,
      target: TARGET,
      nodeCount: nodes.length,
      localStateCountPerNode: LOCAL_STATE_COUNT,
      totalRepresentedLocalStates: MACRO_NODE_COUNT * LOCAL_STATE_COUNT,
      nineSummitsGeographicAuthority: true,
      seaLevelDatum: true,
      activeWater: false,
      hydration: false,
      renders: false,
      finalVisualPass: false
    });
  }

  function getPacket() {
    return packet;
  }

  function publish() {
    window.AUDRALIA_PLANET_TERRAIN_NODES_PACKET = packet;
    window.AUDRALIA_PLANET_TERRAIN_NODES_RECEIPT = status();

    window[API_NAME] = Object.freeze({
      contract: CONTRACT,
      getPacket,
      getNode,
      getLocalState,
      status
    });

    try {
      document.documentElement.dataset.audraliaTerrainNodesContract = CONTRACT;
      document.documentElement.dataset.audraliaTerrainNodesActive = "true";
      document.documentElement.dataset.audraliaTerrainNodeCount = String(nodes.length);
      document.documentElement.dataset.audraliaTerrainLocalStateModel = "256-per-node";
      document.documentElement.dataset.audraliaTerrainActiveWater = "false";
    } catch (_error) {}
  }

  publish();
})();
