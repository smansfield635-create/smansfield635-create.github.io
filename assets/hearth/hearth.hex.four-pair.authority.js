// /assets/hearth/hearth.hex.four-pair.authority.js
// HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1
// Full-file replacement.
// Hex four-pair pixel handshake authority only.
// Purpose:
// - Create the missing body-bound hex pixel handshake authority required by hearth.climate.route.js.
// - Assign every sampled pixel/cell to a stable hex-addressed body coordinate.
// - Give every pixel four cardinal handshakes: north, south, east, west.
// - Preserve hex-supplemental neighbors without letting them override the four-pair set.
// - Expose Runtime Table / canvas-readable sample, read, neighbor, four-pair, and wide-probe methods.
// Does not own:
// - land truth
// - water truth
// - air truth
// - hydrology
// - elevation
// - materials
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;

  const CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-29.hearth-hex-four-pair-pixel-handshake-authority-v1";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";

  const GRID = Object.freeze({
    columns: 96,
    rows: 48,
    stateCount: 256,
    mode: "odd-r-offset-hex-cardinal-four-pair",
    cardinalHandshakes: ["north", "south", "east", "west"],
    supplementalHexHandshakes: ["northEast", "southEast", "southWest", "northWest"]
  });

  const DEG = Math.PI / 180;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const n = safeNumber(value, 0);
    return ((n % 1) + 1) % 1;
  }

  function wrapInt(value, size) {
    const n = Math.round(safeNumber(value, 0));
    const s = Math.max(1, Math.round(safeNumber(size, 1)));
    return ((n % s) + s) % s;
  }

  function normalize3(point) {
    const x = safeNumber(point && point.x, 0);
    const y = safeNumber(point && point.y, 0);
    const z = safeNumber(point && point.z, 1);
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
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

  function parseInput(...args) {
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
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(args[0], args[1]);

    return lonLatToVector(0, 0);
  }

  function stateHash(row, column) {
    const r = wrapInt(row, GRID.rows);
    const c = wrapInt(column, GRID.columns);
    return wrapInt((r * 37 + c * 19 + r * c * 7 + 113), GRID.stateCount);
  }

  function rowEdgeRole(row) {
    if (row <= 0) return "north-polar-cap";
    if (row >= GRID.rows - 1) return "south-polar-cap";
    if (row <= 3) return "north-high-latitude";
    if (row >= GRID.rows - 4) return "south-high-latitude";
    return "mid-body";
  }

  function cellId(row, column) {
    const r = clamp(Math.round(row), 0, GRID.rows - 1);
    const c = wrapInt(column, GRID.columns);
    return `HEARTH_HEX_R${String(r).padStart(2, "0")}_C${String(c).padStart(2, "0")}`;
  }

  function axialFromOffset(row, column) {
    const r = clamp(Math.round(row), 0, GRID.rows - 1);
    const c = wrapInt(column, GRID.columns);
    const q = c - ((r - (r & 1)) / 2);
    const axialR = r - Math.floor(GRID.rows / 2);
    const s = -q - axialR;

    return {
      q,
      r: axialR,
      s
    };
  }

  function cellFromRowColumn(row, column) {
    const r = clamp(Math.round(row), 0, GRID.rows - 1);
    const c = wrapInt(column, GRID.columns);
    const axial = axialFromOffset(r, c);
    const centerU = wrap01((c + 0.5 - ((r & 1) ? 0.5 : 0)) / GRID.columns);
    const centerV = clamp01((r + 0.5) / GRID.rows);
    const lon = uToLon(centerU);
    const lat = vToLat(centerV);
    const vector = lonLatToVector(lon, lat);
    const id = cellId(r, c);
    const stateId = stateHash(r, c);

    return {
      id,
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
      stateClass: `state-${String(stateId).padStart(3, "0")}`,
      parity: r & 1 ? "odd-row" : "even-row",
      edgeRole: rowEdgeRole(r),
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      mayDefineLand: false,
      mayDefineWater: false,
      mayDefineAir: false
    };
  }

  function cellFromVector(point) {
    const p = normalize3(point);
    const ll = vectorToLonLat(p);
    const u = lonToU(ll.lon);
    const v = latToV(ll.lat);

    const rawRow = clamp(Math.floor(v * GRID.rows), 0, GRID.rows - 1);
    const rowOffset = rawRow & 1 ? 0.5 / GRID.columns : 0;
    const rawColumn = Math.floor(wrap01(u + rowOffset) * GRID.columns);

    const cell = cellFromRowColumn(rawRow, rawColumn);

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
    let polarClamp = false;

    if (direction === "north") {
      nextRow = row - 1;
      if (nextRow < 0) {
        nextRow = 0;
        polarClamp = true;
      }
    }

    if (direction === "south") {
      nextRow = row + 1;
      if (nextRow > GRID.rows - 1) {
        nextRow = GRID.rows - 1;
        polarClamp = true;
      }
    }

    if (direction === "east") nextColumn = column + 1;
    if (direction === "west") nextColumn = column - 1;

    if (direction === "northEast") {
      nextRow = row - 1;
      nextColumn = column + (odd ? 1 : 0);
      if (nextRow < 0) {
        nextRow = 0;
        polarClamp = true;
      }
    }

    if (direction === "northWest") {
      nextRow = row - 1;
      nextColumn = column - (odd ? 0 : 1);
      if (nextRow < 0) {
        nextRow = 0;
        polarClamp = true;
      }
    }

    if (direction === "southEast") {
      nextRow = row + 1;
      nextColumn = column + (odd ? 1 : 0);
      if (nextRow > GRID.rows - 1) {
        nextRow = GRID.rows - 1;
        polarClamp = true;
      }
    }

    if (direction === "southWest") {
      nextRow = row + 1;
      nextColumn = column - (odd ? 0 : 1);
      if (nextRow > GRID.rows - 1) {
        nextRow = GRID.rows - 1;
        polarClamp = true;
      }
    }

    return {
      ...cellFromRowColumn(nextRow, nextColumn),
      handshakeBoundaryClamp: polarClamp,
      handshakeBoundaryRole: polarClamp ? "polar-row-clamp" : "normal-adjacent-cell"
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

  function makeHandshake(cell, direction, supplemental = false) {
    const to = neighborCell(cell, direction);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "hearth-hex-four-pair-pixel-handshake-authority",
      planetId: PLANET_ID,
      direction,
      reciprocalDirection: oppositeDirection(direction),
      axis: axisForDirection(direction),
      pairKey: pairKeyForDirection(direction),
      handshakeClass: supplemental ? "hex-supplemental-read-only-handshake" : "cardinal-four-pair-body-handshake",
      supplemental,
      cardinal: !supplemental,
      fromCellId: cell.id,
      toCellId: to.id,
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
      visualPassClaimed: false
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
      setClass: "four-cardinal-pair-set",
      setSize: 4,
      centerCellId: cell.id,
      centerStateId: cell.stateId,
      directions: ["north", "south", "east", "west"],
      north,
      south,
      east,
      west,
      northSouthPair: [north, south],
      eastWestPair: [east, west],
      fourPairSet: [north, south, east, west],
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false
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
      setClass: "supplemental-hex-diagonal-set",
      setSize: 4,
      centerCellId: cell.id,
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
      allowedToFloat: false
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
      groupClass: "four-cell-local-pixel-set",
      groupId: `HEARTH_HEX_FOUR_CELL_R${String(originRow).padStart(2, "0")}_C${String(originColumn).padStart(2, "0")}`,
      originRow,
      originColumn,
      centerCellId: cell.id,
      cells: {
        northWest,
        northEast,
        southWest,
        southEast
      },
      cellIds: [northWest.id, northEast.id, southWest.id, southEast.id],
      stateIds: [northWest.stateId, northEast.stateId, southWest.stateId, southEast.stateId],
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false
    };
  }

  function sample(...args) {
    const vector = parseInput(...args);
    const cell = cellFromVector(vector);
    const fourPair = buildFourPairSet(cell);
    const supplemental = buildSupplementalHexSet(cell);
    const localQuadGroup = buildLocalQuadGroup(cell);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "hearth-hex-four-pair-pixel-handshake-authority",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,

      x: cell.sourceX,
      y: cell.sourceY,
      z: cell.sourceZ,
      u: cell.sourceU,
      v: cell.sourceV,
      lon: cell.sourceLon,
      lat: cell.sourceLat,

      cellId: cell.id,
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

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function read(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object" && args[0].mode === "wide-probe") {
      return wideProbe(args[0]);
    }

    if (args.length === 1 && args[0] && typeof args[0] === "object" && args[0].mode === "neighbors") {
      return getNeighbors(args[0]);
    }

    return sample(...args);
  }

  function getNeighbors(...args) {
    const packet = sample(...args);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "hearth-hex-four-pair-pixel-handshake-authority",
      planetId: PLANET_ID,
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
      visualPassClaimed: false
    };
  }

  function getFourPairSet(...args) {
    return sample(...args).fourPair;
  }

  function getCell(...args) {
    const packet = sample(...args);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      planetId: PLANET_ID,
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
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      visualPassClaimed: false
    };
  }

  function wideProbe(options = {}) {
    const rows = clamp(Math.round(safeNumber(options.rows, 5)), 2, 24);
    const columns = clamp(Math.round(safeNumber(options.columns, 9)), 2, 48);
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
          edgeRole: value.edgeRole,
          hasFourPairSet: Boolean(value.everyPixelHasFourPairSet),
          cardinalHandshakeCount: value.cardinalHandshakeCount,
          bodyBound: value.bodyBound,
          surfaceBound: value.surfaceBound,
          floatsAboveBody: value.floatsAboveBody,
          allowedToFloat: value.allowedToFloat
        });
      }
    }

    const failed = points.filter((point) => (
      !point.hasFourPairSet ||
      point.cardinalHandshakeCount !== 4 ||
      point.bodyBound !== true ||
      point.surfaceBound !== true ||
      point.floatsAboveBody !== false ||
      point.allowedToFloat !== false
    ));

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "hearth-hex-four-pair-pixel-handshake-authority",
      planetId: PLANET_ID,
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
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "hearth-hex-four-pair-pixel-handshake-authority",
      status: "active",
      destinationFile: "/assets/hearth/hearth.hex.four-pair.authority.js",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,

      grid: {
        columns: GRID.columns,
        rows: GRID.rows,
        stateCount: GRID.stateCount,
        mode: GRID.mode,
        cardinalHandshakes: Array.from(GRID.cardinalHandshakes),
        supplementalHexHandshakes: Array.from(GRID.supplementalHexHandshakes)
      },

      purpose: [
        "bind each Hearth hex/pixel sample to body coordinates",
        "assign north, south, east, and west handshakes to every sampled pixel",
        "group every sampled pixel into a four-pair set",
        "provide read-only supplemental hex diagonals without overriding the four-pair cardinal set",
        "feed the renewed Hearth canvas with a body-bound handshake layer"
      ],

      exposedMethods: [
        "sample",
        "read",
        "getCell",
        "getNeighbors",
        "getFourPairSet",
        "wideProbe",
        "getReceipt"
      ],

      renderLaw: [
        "hex handshake authority is body-bound",
        "each pixel has north, south, east, and west handshakes",
        "north/south and east/west are paired as the primary four-pair set",
        "supplemental hex diagonals are read-only helpers",
        "hex authority cannot define land",
        "hex authority cannot define water",
        "hex authority cannot define air",
        "hex authority cannot draw canvas output",
        "hex authority cannot claim visual pass"
      ],

      owns: [
        "hex-cell-addressing",
        "odd-r-offset-grid-addressing",
        "cardinal-four-pair-handshake-fields",
        "north-south-pair-fields",
        "east-west-pair-fields",
        "supplemental-hex-neighbor-fields",
        "local-four-cell-group-fields",
        "wide-probe-handshake-readiness"
      ],

      doesNotOwn: [
        "land truth",
        "water truth",
        "air truth",
        "hydrology",
        "elevation",
        "materials",
        "canvas drawing",
        "runtime motion",
        "controls",
        "route orchestration",
        "final visual pass claim"
      ],

      expectedRouteConsumer: "HEARTH_CLIMATE_ROUTE_HEX_FOUR_PAIR_FULL_RENEWAL_TNT_v1",
      expectedCanvasConsumer: "HEARTH_CANVAS_HEX_FOUR_PAIR_BODY_BOUNDARY_CARRIER_TNT_v1",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    authority: "hearth-hex-four-pair-pixel-handshake-authority",

    sample,
    read,
    getCell,
    getNeighbors,
    getFourPairSet,
    wideProbe,
    getReceipt,

    grid: GRID,
    planetId: PLANET_ID,
    planetLabel: PLANET_LABEL,

    supportsNorthHandshake: true,
    supportsSouthHandshake: true,
    supportsEastHandshake: true,
    supportsWestHandshake: true,
    supportsFourPairSet: true,
    supportsWideProbe: true,
    supportsBodyBoundHandshake: true,

    bodyBound: true,
    surfaceBound: true,
    floatsAboveBody: false,
    allowedToFloat: false,

    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsAirTruth: false,
    ownsCanvas: false,
    ownsRuntime: false,
    ownsControls: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.hexFourPairAuthority = api;
  root.HEARTH.hexAuthority = api;

  root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY = api;
  root.HEARTH_HEX_FOUR_PAIR_AUTHORITY = api;
  root.HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY = api;
  root.HEARTH_HEX_HANDSHAKE_AUTHORITY = api;
  root.HEARTH_HEXGRID_AUTHORITY = api;

  root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_CONTRACT = CONTRACT;
  root.HEARTH_HEX_FOUR_PAIR_AUTHORITY_CONTRACT = CONTRACT;
  root.HEARTH_HEX_AUTHORITY_CONTRACT = CONTRACT;
  root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT = RECEIPT;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthHexFourPairAuthorityLoaded = "true";
    dataset.hearthHexFourPairAuthorityContract = CONTRACT;
    dataset.hearthHexFourPairAuthorityReceipt = RECEIPT;
    dataset.hearthHexFourPairAuthorityVersion = VERSION;
    dataset.hearthHexFourPairAuthorityPlanet = PLANET_ID;

    dataset.hearthHexFourPairGridColumns = String(GRID.columns);
    dataset.hearthHexFourPairGridRows = String(GRID.rows);
    dataset.hearthHexFourPairStateCount = String(GRID.stateCount);
    dataset.hearthHexFourPairGridMode = GRID.mode;

    dataset.hearthHexNorthHandshake = "true";
    dataset.hearthHexSouthHandshake = "true";
    dataset.hearthHexEastHandshake = "true";
    dataset.hearthHexWestHandshake = "true";
    dataset.hearthHexEveryPixelHasFourPairSet = "true";
    dataset.hearthHexBodyBoundHandshake = "true";
    dataset.hearthHexSurfaceBoundHandshake = "true";
    dataset.hearthHexAllowedToFloat = "false";

    dataset.hearthHexMayDefineLand = "false";
    dataset.hearthHexMayDefineWater = "false";
    dataset.hearthHexMayDefineAir = "false";
    dataset.hearthHexOwnsCanvas = "false";
    dataset.hearthHexOwnsRuntime = "false";
    dataset.hearthHexOwnsControls = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
