// /assets/hearth/hearth.hex.four-pair.authority.js
// HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1
// Full-file replacement.
// Hex Four-Pair Authority only.
// Purpose:
// - Preserve the canonical contract expected by the Canvas Hub.
// - Provide body-bound pixel/cell addressing for Hearth.
// - Assign every sampled cell north, south, east, and west handshakes.
// - Preserve 256-state diagnostic scope.
// - Provide wide-probe proof for the Canvas Hub.
// - Keep this file as authority-only: no drawing, no mounting, no runtime restart, no route orchestration.
// Does not own:
// - Canvas Hub
// - Hex Surface Renderer
// - Composite
// - land truth
// - water truth
// - air truth
// - hydrology
// - elevation
// - materials
// - atmosphere
// - lighting
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - F13
// - F21
// - ready text
// - final visual pass

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const ROUTE = "/showroom/globe/hearth/";
  const CANVAS_HUB_CONTRACT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const VERSION = "2026-06-03.hearth-hex-four-pair-authority-canvas-hub-compatible-v1";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";
  const DEG = Math.PI / 180;

  const GRID = Object.freeze({
    columns: 96,
    rows: 48,
    stateCount: 256,
    mode: "odd-r-offset-hex-cardinal-four-pair",
    cardinalHandshakes: Object.freeze(["north", "south", "east", "west"]),
    supplementalHexHandshakes: Object.freeze(["northEast", "southEast", "southWest", "northWest"])
  });

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "Hex Four-Pair Authority",

    authorityLoaded: true,
    canvasHubCompatible: true,
    canvasHubExpectedContract: CANVAS_HUB_CONTRACT,
    ownsPixelCellAddressing: true,
    ownsFourPairHandshakeAuthority: true,
    owns256StateDiagnosticScope: true,

    sampleCount: 0,
    readCount: 0,
    neighborReadCount: 0,
    fourPairReadCount: 0,
    cellReadCount: 0,
    wideProbeCount: 0,

    lastSampleAt: "",
    lastWideProbeAt: "",
    lastWideProbeTotal: 0,
    lastWideProbeFailedCount: 0,
    lastError: "",
    updatedAt: nowIso(),

    ownsCanvasHub: false,
    ownsHexSurfaceRenderer: false,
    ownsComposite: false,
    ownsCanvasDrawing: false,
    ownsMounting: false,
    ownsRuntimeRestart: false,
    ownsRouteOrchestration: false,
    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsAirTruth: false,
    ownsHydrology: false,
    ownsElevation: false,
    ownsMaterials: false,
    ownsAtmosphere: false,
    ownsLighting: false,

    ...FINAL_FALSE
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const number = safeNumber(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function wrapInt(value, size) {
    const n = Math.round(safeNumber(value, 0));
    const s = Math.max(1, Math.round(safeNumber(size, 1)));
    return ((n % s) + s) % s;
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function pad3(value) {
    return String(value).padStart(3, "0");
  }

  function normalize3(point) {
    const x = safeNumber(point && point.x, 0);
    const y = safeNumber(point && point.y, 0);
    const z = safeNumber(point && point.z, 1);
    const length = Math.hypot(x, y, z) || 1;

    return {
      x: x / length,
      y: y / length,
      z: z / length
    };
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = safeNumber(lonDeg, 0) * DEG;
    const lat = safeNumber(latDeg, 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function vectorToLonLat(point) {
    const p = normalize3(point);

    return {
      lon: Math.atan2(p.x, p.z) / DEG,
      lat: Math.asin(clamp(p.y, -1, 1)) / DEG
    };
  }

  function lonToU(lon) {
    return wrap01((safeNumber(lon, 0) + 180) / 360);
  }

  function latToV(lat) {
    return clamp01((90 - safeNumber(lat, 0)) / 180);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp01(v) * 180;
  }

  function parseInput() {
    const args = Array.prototype.slice.call(arguments);

    if (args.length === 1 && Array.isArray(args[0]) && args[0].length >= 3) {
      return normalize3({ x: args[0][0], y: args[0][1], z: args[0][2] });
    }

    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const input = args[0];

      if (Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) {
        return lonLatToVector(uToLon(input.u), vToLat(input.v));
      }

      if (Number.isFinite(Number(input.lon)) && Number.isFinite(Number(input.lat))) {
        return lonLatToVector(input.lon, input.lat);
      }

      if (Number.isFinite(Number(input.longitude)) && Number.isFinite(Number(input.latitude))) {
        return lonLatToVector(input.longitude, input.latitude);
      }

      if (
        Number.isFinite(Number(input.x)) &&
        Number.isFinite(Number(input.y)) &&
        Number.isFinite(Number(input.z))
      ) {
        return normalize3(input);
      }

      if (
        Number.isFinite(Number(input.row)) &&
        Number.isFinite(Number(input.column))
      ) {
        const cell = cellFromRowColumn(input.row, input.column);
        return normalize3({ x: cell.x, y: cell.y, z: cell.z });
      }
    }

    if (args.length >= 3) {
      return normalize3({ x: args[0], y: args[1], z: args[2] });
    }

    if (args.length >= 2) {
      return lonLatToVector(args[0], args[1]);
    }

    return lonLatToVector(0, 0);
  }

  function stateHash(row, column) {
    const r = wrapInt(row, GRID.rows);
    const c = wrapInt(column, GRID.columns);
    const mixed =
      r * 37 +
      c * 19 +
      r * c * 7 +
      ((r ^ c) * 13) +
      113;

    return wrapInt(mixed, GRID.stateCount);
  }

  function rowEdgeRole(row) {
    const r = clamp(Math.round(row), 0, GRID.rows - 1);

    if (r <= 0) return "north-polar-cap";
    if (r >= GRID.rows - 1) return "south-polar-cap";
    if (r <= 3) return "north-high-latitude";
    if (r >= GRID.rows - 4) return "south-high-latitude";
    if (r >= 21 && r <= 26) return "equatorial-body-band";
    return "mid-body";
  }

  function cellId(row, column) {
    const r = clamp(Math.round(row), 0, GRID.rows - 1);
    const c = wrapInt(column, GRID.columns);
    return `HEARTH_HEX_R${pad2(r)}_C${pad2(c)}`;
  }

  function axialFromOffset(row, column) {
    const r = clamp(Math.round(row), 0, GRID.rows - 1);
    const c = wrapInt(column, GRID.columns);
    const q = c - ((r - (r & 1)) / 2);
    const axialR = r - Math.floor(GRID.rows / 2);
    const s = -q - axialR;

    return { q, r: axialR, s };
  }

  function cellFromRowColumn(row, column) {
    const r = clamp(Math.round(row), 0, GRID.rows - 1);
    const c = wrapInt(column, GRID.columns);
    const axial = axialFromOffset(r, c);
    const rowOffset = r & 1 ? 0.5 : 0;
    const centerU = wrap01((c + 0.5 - rowOffset) / GRID.columns);
    const centerV = clamp01((r + 0.5) / GRID.rows);
    const lon = uToLon(centerU);
    const lat = vToLat(centerV);
    const vector = lonLatToVector(lon, lat);
    const id = cellId(r, c);
    const stateId = stateHash(r, c);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "Hex Four-Pair Authority",
      id,
      cellId: id,
      hexId: id,
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      row: r,
      column: c,
      q: axial.q,
      r: axial.r,
      s: axial.s,
      u: centerU,
      v: centerV,
      lon,
      lat,
      x: vector.x,
      y: vector.y,
      z: vector.z,
      stateId,
      stateClass: `state-${pad3(stateId)}`,
      parity: r & 1 ? "odd-row" : "even-row",
      edgeRole: rowEdgeRole(r),
      gridColumns: GRID.columns,
      gridRows: GRID.rows,
      gridMode: GRID.mode,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineLand: false,
      mayDefineWater: false,
      mayDefineAir: false,
      mayDefineHydrology: false,
      mayDefineElevation: false,
      mayDefineMaterials: false,
      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsAirTruth: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ...FINAL_FALSE
    };
  }

  function cellFromVector(point) {
    const p = normalize3(point);
    const ll = vectorToLonLat(p);
    const u = lonToU(ll.lon);
    const v = latToV(ll.lat);
    const row = clamp(Math.floor(v * GRID.rows), 0, GRID.rows - 1);
    const rowOffset = row & 1 ? 0.5 / GRID.columns : 0;
    const column = Math.floor(wrap01(u + rowOffset) * GRID.columns);
    const cell = cellFromRowColumn(row, column);

    return {
      ...cell,
      sourceU: u,
      sourceV: v,
      sourceLon: ll.lon,
      sourceLat: ll.lat,
      sourceX: p.x,
      sourceY: p.y,
      sourceZ: p.z
    };
  }

  function neighborCell(cell, direction) {
    const row = clamp(Math.round(cell.row), 0, GRID.rows - 1);
    const column = wrapInt(cell.column, GRID.columns);
    const odd = row & 1;

    let nextRow = row;
    let nextColumn = column;
    let boundaryClamp = false;

    if (direction === "north") {
      nextRow = row - 1;
      if (nextRow < 0) {
        nextRow = 0;
        boundaryClamp = true;
      }
    } else if (direction === "south") {
      nextRow = row + 1;
      if (nextRow > GRID.rows - 1) {
        nextRow = GRID.rows - 1;
        boundaryClamp = true;
      }
    } else if (direction === "east") {
      nextColumn = column + 1;
    } else if (direction === "west") {
      nextColumn = column - 1;
    } else if (direction === "northEast") {
      nextRow = row - 1;
      nextColumn = column + (odd ? 1 : 0);
      if (nextRow < 0) {
        nextRow = 0;
        boundaryClamp = true;
      }
    } else if (direction === "northWest") {
      nextRow = row - 1;
      nextColumn = column - (odd ? 0 : 1);
      if (nextRow < 0) {
        nextRow = 0;
        boundaryClamp = true;
      }
    } else if (direction === "southEast") {
      nextRow = row + 1;
      nextColumn = column + (odd ? 1 : 0);
      if (nextRow > GRID.rows - 1) {
        nextRow = GRID.rows - 1;
        boundaryClamp = true;
      }
    } else if (direction === "southWest") {
      nextRow = row + 1;
      nextColumn = column - (odd ? 0 : 1);
      if (nextRow > GRID.rows - 1) {
        nextRow = GRID.rows - 1;
        boundaryClamp = true;
      }
    }

    return {
      ...cellFromRowColumn(nextRow, nextColumn),
      handshakeBoundaryClamp: boundaryClamp,
      handshakeBoundaryRole: boundaryClamp ? "polar-row-clamp" : "normal-adjacent-cell"
    };
  }

  function oppositeDirection(direction) {
    return {
      north: "south",
      south: "north",
      east: "west",
      west: "east",
      northEast: "southWest",
      southWest: "northEast",
      northWest: "southEast",
      southEast: "northWest"
    }[direction] || "";
  }

  function axisForDirection(direction) {
    if (direction === "north" || direction === "south") return "north-south";
    if (direction === "east" || direction === "west") return "east-west";
    if (direction === "northEast" || direction === "southWest") return "northeast-southwest";
    if (direction === "northWest" || direction === "southEast") return "northwest-southeast";
    return "unknown";
  }

  function pairKeyForDirection(direction) {
    if (direction === "north" || direction === "south") return "NS";
    if (direction === "east" || direction === "west") return "EW";
    if (direction === "northEast" || direction === "southWest") return "NESW";
    if (direction === "northWest" || direction === "southEast") return "NWSE";
    return "UNKNOWN";
  }

  function makeHandshake(cell, direction, supplemental) {
    const to = neighborCell(cell, direction);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "Hex Four-Pair Authority",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      direction,
      reciprocalDirection: oppositeDirection(direction),
      axis: axisForDirection(direction),
      pairKey: pairKeyForDirection(direction),
      handshakeClass: supplemental ? "hex-supplemental-read-only-handshake" : "cardinal-four-pair-body-handshake",
      supplemental: Boolean(supplemental),
      cardinal: !supplemental,
      fromCellId: cell.cellId,
      toCellId: to.cellId,
      fromRow: cell.row,
      fromColumn: cell.column,
      toRow: to.row,
      toColumn: to.column,
      fromStateId: cell.stateId,
      toStateId: to.stateId,
      boundaryClamp: Boolean(to.handshakeBoundaryClamp),
      boundaryRole: to.handshakeBoundaryRole || "normal-adjacent-cell",
      valid: true,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      handshakeOwnsLand: false,
      handshakeOwnsWater: false,
      handshakeOwnsAir: false,
      handshakeOwnsElevation: false,
      handshakeOwnsHydrology: false,
      handshakeOwnsMaterials: false,
      handshakeOwnsCanvas: false,
      handshakeOwnsDrawing: false,
      ...FINAL_FALSE
    };
  }

  function buildFourPairSet(cell) {
    const north = makeHandshake(cell, "north", false);
    const south = makeHandshake(cell, "south", false);
    const east = makeHandshake(cell, "east", false);
    const west = makeHandshake(cell, "west", false);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "Hex Four-Pair Authority",
      setClass: "four-cardinal-pair-set",
      setSize: 4,
      centerCellId: cell.cellId,
      centerStateId: cell.stateId,
      directions: ["north", "south", "east", "west"],
      north,
      south,
      east,
      west,
      northSouthPair: [north, south],
      eastWestPair: [east, west],
      fourPairSet: [north, south, east, west],
      everyPixelHasNorthSouthEastWest: true,
      everyPixelHasFourPairSet: true,
      handshakePairsAreReciprocal: true,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...FINAL_FALSE
    };
  }

  function buildSupplementalHexSet(cell) {
    const northEast = makeHandshake(cell, "northEast", true);
    const southEast = makeHandshake(cell, "southEast", true);
    const southWest = makeHandshake(cell, "southWest", true);
    const northWest = makeHandshake(cell, "northWest", true);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "Hex Four-Pair Authority",
      setClass: "supplemental-hex-diagonal-set",
      setSize: 4,
      centerCellId: cell.cellId,
      directions: ["northEast", "southEast", "southWest", "northWest"],
      northEast,
      southEast,
      southWest,
      northWest,
      supplementalSet: [northEast, southEast, southWest, northWest],
      readOnly: true,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...FINAL_FALSE
    };
  }

  function buildLocalQuadGroup(cell) {
    const originRow = clamp(Math.floor(cell.row / 2) * 2, 0, GRID.rows - 1);
    const originColumn = wrapInt(Math.floor(cell.column / 2) * 2, GRID.columns);

    const northWest = cellFromRowColumn(originRow, originColumn);
    const northEast = cellFromRowColumn(originRow, originColumn + 1);
    const southWest = cellFromRowColumn(Math.min(originRow + 1, GRID.rows - 1), originColumn);
    const southEast = cellFromRowColumn(Math.min(originRow + 1, GRID.rows - 1), originColumn + 1);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "Hex Four-Pair Authority",
      groupClass: "four-cell-local-pixel-set",
      groupId: `HEARTH_HEX_FOUR_CELL_R${pad2(originRow)}_C${pad2(originColumn)}`,
      originRow,
      originColumn,
      centerCellId: cell.cellId,
      cells: {
        northWest,
        northEast,
        southWest,
        southEast
      },
      cellIds: [northWest.cellId, northEast.cellId, southWest.cellId, southEast.cellId],
      stateIds: [northWest.stateId, northEast.stateId, southWest.stateId, southEast.stateId],
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...FINAL_FALSE
    };
  }

  function sample() {
    const vector = parseInput.apply(null, arguments);
    const cell = cellFromVector(vector);
    const fourPair = buildFourPairSet(cell);
    const supplemental = buildSupplementalHexSet(cell);
    const localQuadGroup = buildLocalQuadGroup(cell);

    state.sampleCount += 1;
    state.lastSampleAt = nowIso();
    state.updatedAt = state.lastSampleAt;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "Hex Four-Pair Authority",
      file: FILE,
      route: ROUTE,
      canvasHubCompatible: true,
      canvasHubExpectedContract: CANVAS_HUB_CONTRACT,
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,

      x: cell.sourceX,
      y: cell.sourceY,
      z: cell.sourceZ,
      u: cell.sourceU,
      v: cell.sourceV,
      lon: cell.sourceLon,
      lat: cell.sourceLat,

      cellId: cell.cellId,
      hexId: cell.hexId,
      row: cell.row,
      column: cell.column,
      q: cell.q,
      r: cell.r,
      s: cell.s,
      parity: cell.parity,
      edgeRole: cell.edgeRole,
      stateId: cell.stateId,
      stateClass: cell.stateClass,

      gridColumns: GRID.columns,
      gridRows: GRID.rows,
      gridMode: GRID.mode,
      stateCount: GRID.stateCount,

      fourPair,
      fourPairSet: fourPair.fourPairSet,
      north: fourPair.north,
      south: fourPair.south,
      east: fourPair.east,
      west: fourPair.west,
      northSouthPair: fourPair.northSouthPair,
      eastWestPair: fourPair.eastWestPair,

      supplementalHexSet: supplemental,
      supplementalHexHandshakes: supplemental.supplementalSet,
      localQuadGroup,

      handshakeCount: 4,
      cardinalHandshakeCount: 4,
      supplementalHandshakeCount: 4,
      everyPixelHasNorthSouthEastWest: true,
      everyPixelHasFourPairSet: true,
      fourPairSetIsBodyBound: true,
      handshakePairsAreReciprocal: true,

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      mayDefineLand: false,
      mayDefineWater: false,
      mayDefineAir: false,
      mayDefineElevation: false,
      mayDefineHydrology: false,
      mayDefineMaterials: false,

      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsAirTruth: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsDrawing: false,

      ...FINAL_FALSE
    };
  }

  function read() {
    const args = Array.prototype.slice.call(arguments);

    state.readCount += 1;
    state.updatedAt = nowIso();

    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      if (args[0].mode === "wide-probe") return wideProbe(args[0]);
      if (args[0].mode === "neighbors") return getNeighbors(args[0]);
      if (args[0].mode === "cell") return getCell(args[0]);
      if (args[0].mode === "four-pair") return getFourPairSet(args[0]);
    }

    return sample.apply(null, args);
  }

  function getCell() {
    state.cellReadCount += 1;
    state.updatedAt = nowIso();

    const packet = sample.apply(null, arguments);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "Hex Four-Pair Authority",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      cellId: packet.cellId,
      hexId: packet.hexId,
      row: packet.row,
      column: packet.column,
      q: packet.q,
      r: packet.r,
      s: packet.s,
      u: packet.u,
      v: packet.v,
      lon: packet.lon,
      lat: packet.lat,
      x: packet.x,
      y: packet.y,
      z: packet.z,
      parity: packet.parity,
      edgeRole: packet.edgeRole,
      stateId: packet.stateId,
      stateClass: packet.stateClass,
      gridColumns: GRID.columns,
      gridRows: GRID.rows,
      gridMode: GRID.mode,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...FINAL_FALSE
    };
  }

  function getNeighbors() {
    state.neighborReadCount += 1;
    state.updatedAt = nowIso();

    const packet = sample.apply(null, arguments);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "Hex Four-Pair Authority",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      centerCellId: packet.cellId,
      centerStateId: packet.stateId,
      cardinal: {
        north: neighborCell(packet, "north"),
        south: neighborCell(packet, "south"),
        east: neighborCell(packet, "east"),
        west: neighborCell(packet, "west")
      },
      supplemental: {
        northEast: neighborCell(packet, "northEast"),
        southEast: neighborCell(packet, "southEast"),
        southWest: neighborCell(packet, "southWest"),
        northWest: neighborCell(packet, "northWest")
      },
      fourPair: packet.fourPair,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...FINAL_FALSE
    };
  }

  function getFourPairSet() {
    state.fourPairReadCount += 1;
    state.updatedAt = nowIso();
    return sample.apply(null, arguments).fourPair;
  }

  function wideProbe(options = {}) {
    const rows = clamp(Math.round(safeNumber(options.rows, 5)), 2, 32);
    const columns = clamp(Math.round(safeNumber(options.columns, 9)), 2, 64);
    const points = [];

    for (let row = 0; row < rows; row += 1) {
      const v = rows <= 1 ? 0.5 : (row + 0.5) / rows;

      for (let column = 0; column < columns; column += 1) {
        const u = columns <= 1 ? 0.5 : (column + 0.5) / columns;
        const value = sample({ u, v });

        points.push({
          index: points.length,
          probeRow: row,
          probeColumn: column,
          u,
          v,
          lon: value.lon,
          lat: value.lat,
          cellId: value.cellId,
          row: value.row,
          column: value.column,
          stateId: value.stateId,
          stateClass: value.stateClass,
          edgeRole: value.edgeRole,
          hasNorth: Boolean(value.north && value.north.direction === "north"),
          hasSouth: Boolean(value.south && value.south.direction === "south"),
          hasEast: Boolean(value.east && value.east.direction === "east"),
          hasWest: Boolean(value.west && value.west.direction === "west"),
          hasFourPairSet: Boolean(value.everyPixelHasFourPairSet),
          cardinalHandshakeCount: value.cardinalHandshakeCount,
          bodyBound: value.bodyBound,
          surfaceBound: value.surfaceBound,
          floatsAboveBody: value.floatsAboveBody,
          allowedToFloat: value.allowedToFloat,
          visualPassClaimed: false
        });
      }
    }

    const failed = points.filter((point) => (
      point.hasNorth !== true ||
      point.hasSouth !== true ||
      point.hasEast !== true ||
      point.hasWest !== true ||
      point.hasFourPairSet !== true ||
      point.cardinalHandshakeCount !== 4 ||
      point.bodyBound !== true ||
      point.surfaceBound !== true ||
      point.floatsAboveBody !== false ||
      point.allowedToFloat !== false ||
      point.visualPassClaimed !== false
    ));

    const result = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "Hex Four-Pair Authority",
      file: FILE,
      route: ROUTE,
      canvasHubCompatible: true,
      canvasHubExpectedContract: CANVAS_HUB_CONTRACT,
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      mode: "wide-probe",
      rows,
      columns,
      total: points.length,
      minimumWideProbePoints: 25,
      wideProbeReady: points.length >= 25,
      failedCount: failed.length,
      passed: failed.length === 0 && points.length >= 25,
      held: points.length < 25,
      heldReason: points.length < 25 ? "INSUFFICIENT_WIDE_PROBE" : "",
      points,
      failed,
      everyPixelHasNorthSouthEastWest: failed.length === 0,
      everyPixelHasFourPairSet: failed.length === 0,
      everyPixelBodyBound: failed.length === 0,
      everyPixelSurfaceBound: failed.length === 0,
      everyPixelAllowedToFloat: false,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ownsCanvas: false,
      ownsDrawing: false,
      ...FINAL_FALSE
    };

    state.wideProbeCount += 1;
    state.lastWideProbeAt = nowIso();
    state.lastWideProbeTotal = result.total;
    state.lastWideProbeFailedCount = result.failedCount;
    state.updatedAt = state.lastWideProbeAt;

    updateDataset(result);

    return result;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: "Hex Four-Pair Authority",
      authorityLoaded: true,
      apiReady: true,
      canvasHubCompatible: true,
      canvasHubExpectedContract: CANVAS_HUB_CONTRACT,

      gridColumns: GRID.columns,
      gridRows: GRID.rows,
      stateCount: GRID.stateCount,
      gridMode: GRID.mode,

      supportsSample: true,
      supportsRead: true,
      supportsGetCell: true,
      supportsGetNeighbors: true,
      supportsGetFourPairSet: true,
      supportsWideProbe: true,
      supportsNorthHandshake: true,
      supportsSouthHandshake: true,
      supportsEastHandshake: true,
      supportsWestHandshake: true,
      supportsFourPairSet: true,
      supportsBodyBoundHandshake: true,
      supports256StateDiagnosticScope: true,

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      everyPixelHasNorthSouthEastWest: true,
      everyPixelHasFourPairSet: true,

      sampleCount: state.sampleCount,
      readCount: state.readCount,
      neighborReadCount: state.neighborReadCount,
      fourPairReadCount: state.fourPairReadCount,
      cellReadCount: state.cellReadCount,
      wideProbeCount: state.wideProbeCount,
      lastSampleAt: state.lastSampleAt,
      lastWideProbeAt: state.lastWideProbeAt,
      lastWideProbeTotal: state.lastWideProbeTotal,
      lastWideProbeFailedCount: state.lastWideProbeFailedCount,
      lastError: state.lastError,
      updatedAt: state.updatedAt,

      ownsCanvasHub: false,
      ownsHexSurfaceRenderer: false,
      ownsComposite: false,
      ownsCanvasDrawing: false,
      ownsMounting: false,
      ownsRuntimeRestart: false,
      ownsRouteOrchestration: false,
      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsAirTruth: false,
      ownsHydrology: false,
      ownsElevation: false,
      ownsMaterials: false,
      ownsAtmosphere: false,
      ownsLighting: false,

      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getStatus(),
      destinationFile: FILE,
      purpose: [
        "Provide body-bound pixel/cell addressing for Hearth.",
        "Assign every sampled cell north, south, east, and west handshakes.",
        "Preserve the 256-state diagnostic scope.",
        "Provide wide-probe proof for the Canvas Hub.",
        "Keep pixel authority separate from drawing authority."
      ],
      exposedMethods: [
        "sample",
        "read",
        "getCell",
        "getNeighbors",
        "getFourPairSet",
        "wideProbe",
        "getStatus",
        "getReceipt",
        "getReceiptText"
      ],
      owns: [
        "pixel-cell-addressing",
        "odd-r-offset-grid-addressing",
        "cardinal-four-pair-handshake-fields",
        "north-south-pair-fields",
        "east-west-pair-fields",
        "supplemental-hex-neighbor-fields",
        "local-four-cell-group-fields",
        "wide-probe-handshake-readiness",
        "256-state diagnostic scope"
      ],
      doesNotOwn: [
        "Canvas Hub",
        "Hex Surface Renderer",
        "Composite",
        "land truth",
        "water truth",
        "air truth",
        "hydrology",
        "elevation",
        "materials",
        "atmosphere",
        "lighting",
        "canvas drawing",
        "runtime motion",
        "controls",
        "route orchestration",
        "F13",
        "F21",
        "ready text",
        "final visual pass"
      ]
    };
  }

  function getReceiptText() {
    const r = getStatus();

    return [
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      `authorityLoaded=${r.authorityLoaded}`,
      `apiReady=${r.apiReady}`,
      `canvasHubCompatible=${r.canvasHubCompatible}`,
      `canvasHubExpectedContract=${r.canvasHubExpectedContract}`,
      "",
      `gridColumns=${r.gridColumns}`,
      `gridRows=${r.gridRows}`,
      `stateCount=${r.stateCount}`,
      `gridMode=${r.gridMode}`,
      "",
      `supportsNorthHandshake=${r.supportsNorthHandshake}`,
      `supportsSouthHandshake=${r.supportsSouthHandshake}`,
      `supportsEastHandshake=${r.supportsEastHandshake}`,
      `supportsWestHandshake=${r.supportsWestHandshake}`,
      `supportsFourPairSet=${r.supportsFourPairSet}`,
      `supportsWideProbe=${r.supportsWideProbe}`,
      "",
      `bodyBound=${r.bodyBound}`,
      `surfaceBound=${r.surfaceBound}`,
      `floatsAboveBody=${r.floatsAboveBody}`,
      `allowedToFloat=${r.allowedToFloat}`,
      `everyPixelHasNorthSouthEastWest=${r.everyPixelHasNorthSouthEastWest}`,
      `everyPixelHasFourPairSet=${r.everyPixelHasFourPairSet}`,
      "",
      `ownsCanvasHub=${r.ownsCanvasHub}`,
      `ownsHexSurfaceRenderer=${r.ownsHexSurfaceRenderer}`,
      `ownsComposite=${r.ownsComposite}`,
      `ownsCanvasDrawing=${r.ownsCanvasDrawing}`,
      `ownsLandTruth=${r.ownsLandTruth}`,
      `ownsWaterTruth=${r.ownsWaterTruth}`,
      `ownsAirTruth=${r.ownsAirTruth}`,
      "",
      `sampleCount=${r.sampleCount}`,
      `wideProbeCount=${r.wideProbeCount}`,
      `lastWideProbeTotal=${r.lastWideProbeTotal}`,
      `lastWideProbeFailedCount=${r.lastWideProbeFailedCount}`,
      `lastError=${r.lastError}`,
      "",
      `f13Claimed=${r.f13Claimed}`,
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21Claimed=${r.f21Claimed}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset(lastWideProbe = null) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const dataset = doc.documentElement.dataset;

    dataset.hearthHexFourPairAuthorityLoaded = "true";
    dataset.hearthHexFourPairAuthorityContract = CONTRACT;
    dataset.hearthHexFourPairAuthorityReceipt = RECEIPT;
    dataset.hearthHexFourPairAuthorityVersion = VERSION;
    dataset.hearthHexFourPairAuthorityFile = FILE;
    dataset.hearthHexFourPairAuthorityRole = "Hex Four-Pair Authority";
    dataset.hearthHexFourPairAuthorityCanvasHubCompatible = "true";
    dataset.hearthHexFourPairAuthorityCanvasHubExpectedContract = CANVAS_HUB_CONTRACT;

    dataset.hearthHexFourPairGridColumns = String(GRID.columns);
    dataset.hearthHexFourPairGridRows = String(GRID.rows);
    dataset.hearthHexFourPairStateCount = String(GRID.stateCount);
    dataset.hearthHexFourPairGridMode = GRID.mode;

    dataset.hearthHexNorthHandshake = "true";
    dataset.hearthHexSouthHandshake = "true";
    dataset.hearthHexEastHandshake = "true";
    dataset.hearthHexWestHandshake = "true";
    dataset.hearthHexEveryPixelHasFourPairSet = "true";
    dataset.hearthHexEveryPixelHasNorthSouthEastWest = "true";
    dataset.hearthHexBodyBoundHandshake = "true";
    dataset.hearthHexSurfaceBoundHandshake = "true";
    dataset.hearthHexAllowedToFloat = "false";

    dataset.hearthHexMayDefineLand = "false";
    dataset.hearthHexMayDefineWater = "false";
    dataset.hearthHexMayDefineAir = "false";
    dataset.hearthHexOwnsCanvas = "false";
    dataset.hearthHexOwnsDrawing = "false";
    dataset.hearthHexOwnsRuntime = "false";
    dataset.hearthHexOwnsControls = "false";

    if (lastWideProbe) {
      dataset.hearthHexFourPairWideProbeReady = String(Boolean(lastWideProbe.wideProbeReady));
      dataset.hearthHexFourPairWideProbeTotal = String(lastWideProbe.total || 0);
      dataset.hearthHexFourPairWideProbeFailedCount = String(lastWideProbe.failedCount || 0);
      dataset.hearthHexFourPairWideProbePassed = String(Boolean(lastWideProbe.passed));
    }

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    return true;
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.hexFourPairAuthority = api;
    root.HEARTH.hexAuthority = api;

    root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY = api;
    root.HEARTH_HEX_FOUR_PAIR_AUTHORITY = api;
    root.HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY = api;
    root.HEARTH_HEX_HANDSHAKE_AUTHORITY = api;
    root.HEARTH_HEXGRID_AUTHORITY = api;

    root.DEXTER_LAB.hearthHexFourPairAuthority = api;
    root.DEXTER_LAB.hearthHexAuthority = api;

    root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_CONTRACT = CONTRACT;
    root.HEARTH_HEX_FOUR_PAIR_AUTHORITY_CONTRACT = CONTRACT;
    root.HEARTH_HEX_AUTHORITY_CONTRACT = CONTRACT;
    root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT = RECEIPT;
    root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_STATUS = getStatus();
    root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_OBJECT = getReceipt();

    root.HEARTH.hexFourPairAuthorityReceipt = getReceipt();
    root.HEARTH.hexAuthorityReceipt = getReceipt();
    root.DEXTER_LAB.hearthHexFourPairAuthorityReceipt = getReceipt();

    return api;
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    FILE,
    ROUTE,
    VERSION,
    GRID,
    PLANET_ID,
    PLANET_LABEL,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "Hex Four-Pair Authority",

    sample,
    read,
    getCell,
    getNeighbors,
    getFourPairSet,
    wideProbe,
    getStatus,
    getReceipt,
    getReceiptText,

    canvasHubCompatible: true,
    canvasHubExpectedContract: CANVAS_HUB_CONTRACT,

    supportsSample: true,
    supportsRead: true,
    supportsGetCell: true,
    supportsGetNeighbors: true,
    supportsGetFourPairSet: true,
    supportsWideProbe: true,
    supportsNorthHandshake: true,
    supportsSouthHandshake: true,
    supportsEastHandshake: true,
    supportsWestHandshake: true,
    supportsFourPairSet: true,
    supportsBodyBoundHandshake: true,
    supports256StateDiagnosticScope: true,

    bodyBound: true,
    surfaceBound: true,
    floatsAboveBody: false,
    allowedToFloat: false,

    ownsPixelCellAddressing: true,
    ownsFourPairHandshakeAuthority: true,
    owns256StateDiagnosticScope: true,

    ownsCanvasHub: false,
    ownsHexSurfaceRenderer: false,
    ownsComposite: false,
    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsAirTruth: false,
    ownsCanvas: false,
    ownsDrawing: false,
    ownsRuntime: false,
    ownsControls: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  };

  try {
    updateDataset();
    publishGlobals();
    wideProbe({ rows: 5, columns: 9 });
    updateDataset();
    publishGlobals();
  } catch (error) {
    state.lastError = error && error.message ? String(error.message) : String(error);
    state.updatedAt = nowIso();

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
