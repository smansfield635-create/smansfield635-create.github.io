// /assets/hearth/hearth.hex.four-pair.authority.js
// HEARTH_HEX_FOUR_PAIR_3D_BODY_GATE_AUTHORITY_TNT_v2
// Full-file replacement.
// 3D Hex Four-Pair Authority / Chapel 1 ↔ Chapel 2 bridge foundation only.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_HEX_FOUR_PAIR_3D_BODY_GATE_AUTHORITY_TNT_v2";
  const RECEIPT = "HEARTH_HEX_FOUR_PAIR_3D_BODY_GATE_AUTHORITY_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const ROUTE = "/showroom/globe/hearth/";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const VERSION = "2026-06-09.hearth-hex-four-pair-3d-body-gate-authority-v2";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";
  const DEG = Math.PI / 180;

  const BODY = Object.freeze({
    coordinateModel: "RT3D-BODY-SPHERE",
    mechanicalCoordinate: "RT3D-X16_Y16_Z256",
    columns: 64,
    rows: 32,
    stateCount: 256,
    chapelBridge: "CHAPEL_1_TO_CHAPEL_2",
    gateRole: "3D_BODY_GATE_AUTHORITY"
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
    webgl: false,
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

    authorityLoaded: true,
    body3dGateAuthority: true,
    compatibility2dMode: false,
    chapelBridgeActive: true,

    sampleCount: 0,
    readCount: 0,
    gatePacketCount: 0,
    wideProbeCount: 0,

    lastCellId: "NONE",
    lastStateId: "NONE",
    lastGatePacket: null,
    lastWideProbe: null,

    firstFailedCoordinate: "NONE",
    recommendedNextFile: HEX_SURFACE_FILE,
    recommendedNextAction: "SEND_3D_BODY_GATE_PACKET_TO_HEX_SURFACE",
    postgameStatus: "HEARTH_3D_BODY_GATE_AUTHORITY_READY",

    owns3dBodyAddressing: true,
    ownsFourPairBodyHandshake: true,
    owns256DiagnosticScope: true,

    ownsCanvas: false,
    ownsCanvasDrawing: false,
    ownsControls: false,
    ownsHexSurface: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsFinalVisualPass: false,

    createdAt: nowIso(),
    updatedAt: nowIso(),

    ...FINAL_FALSE
  };

  function nowIso() {
    try { return new Date().toISOString(); }
    catch (_error) { return String(Date.now()); }
  }

  function n(value, fallback = 0) {
    const out = Number(value);
    return Number.isFinite(out) ? out : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, n(value, min)));
  }

  function wrap01(value) {
    const out = n(value, 0);
    return ((out % 1) + 1) % 1;
  }

  function wrapDeg(value) {
    const out = n(value, 0);
    return ((((out + 180) % 360) + 360) % 360) - 180;
  }

  function pad(value, size) {
    return String(value).padStart(size, "0");
  }

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_error) { return value; }
  }

  function normalize3(point) {
    const x = n(point && point.x, 0);
    const y = n(point && point.y, 0);
    const z = n(point && point.z, 1);
    const length = Math.hypot(x, y, z) || 1;
    return { x: x / length, y: y / length, z: z / length };
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = n(lonDeg, 0) * DEG;
    const lat = clamp(latDeg, -90, 90) * DEG;
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
    return wrap01((wrapDeg(lon) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - clamp(lat, -90, 90)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrapDeg(wrap01(u) * 360 - 180);
  }

  function vToLat(v) {
    return clamp(90 - clamp(v, 0, 1) * 180, -90, 90);
  }

  function parseInput(input, y, z) {
    if (Array.isArray(input) && input.length >= 3) {
      return normalize3({ x: input[0], y: input[1], z: input[2] });
    }

    if (arguments.length >= 3) {
      return normalize3({ x: input, y, z });
    }

    if (input && typeof input === "object") {
      if (Number.isFinite(Number(input.x)) && Number.isFinite(Number(input.y)) && Number.isFinite(Number(input.z))) {
        return normalize3(input);
      }

      if (Number.isFinite(Number(input.lon)) && Number.isFinite(Number(input.lat))) {
        return lonLatToVector(input.lon, input.lat);
      }

      if (Number.isFinite(Number(input.longitude)) && Number.isFinite(Number(input.latitude))) {
        return lonLatToVector(input.longitude, input.latitude);
      }

      if (Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) {
        return lonLatToVector(uToLon(input.u), vToLat(input.v));
      }

      if (Number.isFinite(Number(input.row)) && Number.isFinite(Number(input.column))) {
        return cellFromRowColumn(input.row, input.column).vector;
      }
    }

    return lonLatToVector(0, 0);
  }

  function rowColumnFromVector(vector) {
    const ll = vectorToLonLat(vector);
    const u = lonToU(ll.lon);
    const v = latToV(ll.lat);

    return {
      row: clamp(Math.floor(v * BODY.rows), 0, BODY.rows - 1),
      column: Math.floor(wrap01(u) * BODY.columns),
      u,
      v,
      lon: ll.lon,
      lat: ll.lat
    };
  }

  function stateIdFor(row, column) {
    const mixed =
      row * 37 +
      column * 19 +
      row * column * 7 +
      ((row ^ column) * 13) +
      113;

    return ((mixed % BODY.stateCount) + BODY.stateCount) % BODY.stateCount;
  }

  function cellId(row, column) {
    return `HEARTH_3D_BODY_R${pad(row, 2)}_C${pad(column, 2)}`;
  }

  function cellFromRowColumn(row, column) {
    const r = clamp(Math.round(row), 0, BODY.rows - 1);
    const c = ((Math.round(column) % BODY.columns) + BODY.columns) % BODY.columns;
    const u = wrap01((c + 0.5) / BODY.columns);
    const v = clamp((r + 0.5) / BODY.rows, 0, 1);
    const lon = uToLon(u);
    const lat = vToLat(v);
    const vector = lonLatToVector(lon, lat);
    const sid = stateIdFor(r, c);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "HEARTH_3D_BODY_GATE_AUTHORITY",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      coordinateModel: BODY.coordinateModel,
      mechanicalCoordinate: BODY.mechanicalCoordinate,
      cellId: cellId(r, c),
      hexId: cellId(r, c),
      row: r,
      column: c,
      stateId: sid,
      stateClass: `state-${pad(sid, 3)}`,
      u,
      v,
      lon,
      lat,
      x: vector.x,
      y: vector.y,
      z: vector.z,
      vector,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...FINAL_FALSE
    };
  }

  function cellFromVector(vector) {
    const rc = rowColumnFromVector(vector);
    const cell = cellFromRowColumn(rc.row, rc.column);

    return {
      ...cell,
      sourceU: rc.u,
      sourceV: rc.v,
      sourceLon: rc.lon,
      sourceLat: rc.lat,
      sourceX: vector.x,
      sourceY: vector.y,
      sourceZ: vector.z
    };
  }

  function neighbor(cell, direction) {
    let row = cell.row;
    let column = cell.column;
    let polarClamp = false;

    if (direction === "north") row -= 1;
    if (direction === "south") row += 1;
    if (direction === "east") column += 1;
    if (direction === "west") column -= 1;

    if (row < 0) {
      row = 0;
      polarClamp = true;
    }

    if (row >= BODY.rows) {
      row = BODY.rows - 1;
      polarClamp = true;
    }

    const target = cellFromRowColumn(row, column);

    return {
      direction,
      reciprocalDirection: {
        north: "south",
        south: "north",
        east: "west",
        west: "east"
      }[direction],
      fromCellId: cell.cellId,
      toCellId: target.cellId,
      fromStateId: cell.stateId,
      toStateId: target.stateId,
      fromVector: { x: cell.x, y: cell.y, z: cell.z },
      toVector: { x: target.x, y: target.y, z: target.z },
      axis: direction === "north" || direction === "south" ? "north-south-body-axis" : "east-west-body-axis",
      polarClamp,
      bodyBound: true,
      surfaceBound: true,
      ...FINAL_FALSE
    };
  }

  function fourPair(cell) {
    const north = neighbor(cell, "north");
    const south = neighbor(cell, "south");
    const east = neighbor(cell, "east");
    const west = neighbor(cell, "west");

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      setClass: "3d-body-four-pair-set",
      centerCellId: cell.cellId,
      centerStateId: cell.stateId,
      north,
      south,
      east,
      west,
      northSouthPair: [north, south],
      eastWestPair: [east, west],
      fourPairSet: [north, south, east, west],
      everyPixelHasNorthSouthEastWest: true,
      everyPixelHasFourPairSet: true,
      bodyBound: true,
      surfaceBound: true,
      ...FINAL_FALSE
    };
  }

  function sample(input, y, z) {
    const vector = parseInput.apply(null, arguments);
    const cell = cellFromVector(vector);
    const pair = fourPair(cell);

    state.sampleCount += 1;
    state.lastCellId = cell.cellId;
    state.lastStateId = String(cell.stateId);
    state.updatedAt = nowIso();

    return {
      ...cell,
      fourPair: pair,
      fourPairSet: pair.fourPairSet,
      north: pair.north,
      south: pair.south,
      east: pair.east,
      west: pair.west,
      northSouthPair: pair.northSouthPair,
      eastWestPair: pair.eastWestPair,
      gridColumns: BODY.columns,
      gridRows: BODY.rows,
      stateCount: BODY.stateCount,
      gateRole: BODY.gateRole,
      chapelBridge: BODY.chapelBridge,
      owns3dBodyAddressing: true,
      ownsCanvasDrawing: false,
      ownsHexSurface: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsMaterialTruth: false,
      ...FINAL_FALSE
    };
  }

  function composeGatePacket(input = {}, options = {}) {
    const s = sample(input);

    const packet = {
      packetType: "HEARTH_3D_BODY_GATE_PACKET_v2",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_HEX_FOUR_PAIR_3D_BODY_GATE_AUTHORITY",
      destinationFile: HEX_SURFACE_FILE,
      handoffTo: "HEARTH_HEX_SURFACE",

      route: ROUTE,
      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,

      coordinateModel: BODY.coordinateModel,
      mechanicalCoordinate: BODY.mechanicalCoordinate,
      chapelBridge: BODY.chapelBridge,
      gateRole: BODY.gateRole,

      canonicalMapTuple: {
        tupleType: "HEARTH_3D_BODY_CANONICAL_MAP_TUPLE_v2",
        cellId: s.cellId,
        hexId: s.hexId,
        row: s.row,
        column: s.column,
        stateId: s.stateId,
        stateClass: s.stateClass,
        u: s.u,
        v: s.v,
        lon: s.lon,
        lat: s.lat,
        x: s.x,
        y: s.y,
        z: s.z,
        bodyBound: true,
        surfaceBound: true,
        floatsAboveBody: false,
        allowedToFloat: false,
        ...FINAL_FALSE
      },

      coord: {
        u: s.u,
        v: s.v,
        lon: s.lon,
        lat: s.lat,
        x: s.x,
        y: s.y,
        z: s.z
      },

      cellId: s.cellId,
      hexId: s.hexId,
      row: s.row,
      column: s.column,
      stateId: s.stateId,
      stateClass: s.stateClass,

      fourPair: clone(s.fourPair),
      fourPairSet: clone(s.fourPairSet),
      north: clone(s.north),
      south: clone(s.south),
      east: clone(s.east),
      west: clone(s.west),
      northSouthPair: clone(s.northSouthPair),
      eastWestPair: clone(s.eastWestPair),

      input: clone(input),
      options: clone(options),

      hexSurfaceGateAuthorized: true,
      canvasLifecycleAuthorized: false,
      canvasDrawingAuthorized: false,
      terrainTruthAuthorized: false,
      hydrologyTruthAuthorized: false,
      materialTruthAuthorized: false,

      composedAt: nowIso(),
      ...FINAL_FALSE
    };

    state.gatePacketCount += 1;
    state.lastGatePacket = clone(packet);
    state.recommendedNextFile = HEX_SURFACE_FILE;
    state.recommendedNextAction = "HEARTH_HEX_SURFACE_CONSUME_3D_BODY_GATE_PACKET";
    state.postgameStatus = "3D_BODY_GATE_PACKET_COMPOSED_FOR_HEX_SURFACE";
    state.updatedAt = nowIso();

    publishGatePacket(packet);
    publishGlobals();

    return packet;
  }

  function wideProbe(options = {}) {
    const rows = clamp(Math.round(n(options.rows, 6)), 2, 32);
    const columns = clamp(Math.round(n(options.columns, 12)), 2, 64);
    const points = [];

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < columns; c += 1) {
        const u = (c + 0.5) / columns;
        const v = (r + 0.5) / rows;
        const s = sample({ u, v });
        points.push({
          index: points.length,
          probeRow: r,
          probeColumn: c,
          cellId: s.cellId,
          stateId: s.stateId,
          row: s.row,
          column: s.column,
          u: s.u,
          v: s.v,
          lon: s.lon,
          lat: s.lat,
          x: s.x,
          y: s.y,
          z: s.z,
          hasNorth: Boolean(s.north),
          hasSouth: Boolean(s.south),
          hasEast: Boolean(s.east),
          hasWest: Boolean(s.west),
          bodyBound: true,
          surfaceBound: true,
          visualPassClaimed: false
        });
      }
    }

    const failed = points.filter((p) => !p.hasNorth || !p.hasSouth || !p.hasEast || !p.hasWest);

    const result = {
      contract: CONTRACT,
      receipt: RECEIPT,
      mode: "3d-body-wide-probe",
      rows,
      columns,
      total: points.length,
      failedCount: failed.length,
      passed: failed.length === 0,
      points,
      failed,
      bodyBound: true,
      surfaceBound: true,
      everySampleHasFourPair: failed.length === 0,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      probedAt: nowIso()
    };

    state.wideProbeCount += 1;
    state.lastWideProbe = clone(result);
    state.updatedAt = nowIso();

    updateDataset();
    publishGlobals();

    return result;
  }

  function read(input) {
    state.readCount += 1;
    if (input && input.mode === "wide-probe") return wideProbe(input);
    if (input && input.mode === "gate-packet") return composeGatePacket(input);
    return sample.apply(null, arguments);
  }

  function getCell(input) {
    return sample(input);
  }

  function getNeighbors(input) {
    const s = sample(input);
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      centerCellId: s.cellId,
      centerStateId: s.stateId,
      north: s.north,
      south: s.south,
      east: s.east,
      west: s.west,
      fourPair: s.fourPair,
      ...FINAL_FALSE
    };
  }

  function getFourPairSet(input) {
    return sample(input).fourPair;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,

      authorityLoaded: true,
      body3dGateAuthority: true,
      compatibility2dMode: false,
      chapelBridgeActive: true,

      coordinateModel: BODY.coordinateModel,
      mechanicalCoordinate: BODY.mechanicalCoordinate,
      columns: BODY.columns,
      rows: BODY.rows,
      stateCount: BODY.stateCount,

      sampleCount: state.sampleCount,
      readCount: state.readCount,
      gatePacketCount: state.gatePacketCount,
      wideProbeCount: state.wideProbeCount,
      lastCellId: state.lastCellId,
      lastStateId: state.lastStateId,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      owns3dBodyAddressing: true,
      ownsFourPairBodyHandshake: true,
      owns256DiagnosticScope: true,
      ownsCanvas: false,
      ownsCanvasDrawing: false,
      ownsControls: false,
      ownsHexSurface: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsMaterialTruth: false,
      ownsFinalVisualPass: false,

      updatedAt: state.updatedAt,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getStatus(),
      role: "3D Hex Four-Pair Body Gate Authority",
      purpose: [
        "Upgrade Hearth hex authority from 2D grid compatibility to 3D body-bound gate authority.",
        "Provide canonical 3D surface addressing for Chapel 1 to Chapel 2 transmission.",
        "Assign north, south, east, and west handshakes on the body surface.",
        "Compose lawful 3D body gate packets for Hex Surface.",
        "Preserve 256-state diagnostic scope without drawing or final-visual claims."
      ],
      lastGatePacket: clone(state.lastGatePacket),
      lastWideProbe: clone(state.lastWideProbe)
    };
  }

  function getReceiptText() {
    const r = getStatus();
    return [
      "HEARTH_HEX_FOUR_PAIR_3D_BODY_GATE_AUTHORITY_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      "",
      `body3dGateAuthority=${r.body3dGateAuthority}`,
      `compatibility2dMode=${r.compatibility2dMode}`,
      `chapelBridgeActive=${r.chapelBridgeActive}`,
      `coordinateModel=${r.coordinateModel}`,
      `mechanicalCoordinate=${r.mechanicalCoordinate}`,
      "",
      `columns=${r.columns}`,
      `rows=${r.rows}`,
      `stateCount=${r.stateCount}`,
      "",
      `sampleCount=${r.sampleCount}`,
      `readCount=${r.readCount}`,
      `gatePacketCount=${r.gatePacketCount}`,
      `wideProbeCount=${r.wideProbeCount}`,
      "",
      `lastCellId=${r.lastCellId}`,
      `lastStateId=${r.lastStateId}`,
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextAction=${r.recommendedNextAction}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      `owns3dBodyAddressing=${r.owns3dBodyAddressing}`,
      `ownsFourPairBodyHandshake=${r.ownsFourPairBodyHandshake}`,
      `ownsCanvasDrawing=${r.ownsCanvasDrawing}`,
      `ownsHexSurface=${r.ownsHexSurface}`,
      `ownsTerrainTruth=${r.ownsTerrainTruth}`,
      `ownsFinalVisualPass=${r.ownsFinalVisualPass}`,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    const d = doc.documentElement.dataset;

    d.hearthHexFourPairAuthorityLoaded = "true";
    d.hearthHexFourPairAuthorityContract = CONTRACT;
    d.hearthHexFourPairAuthorityReceipt = RECEIPT;
    d.hearthHexFourPairAuthorityPreviousContract = PREVIOUS_CONTRACT;
    d.hearthHexFourPairAuthorityVersion = VERSION;
    d.hearthHexFourPairAuthorityFile = FILE;

    d.hearthHexFourPair3dBodyGateAuthority = "true";
    d.hearthHexFourPairCompatibility2dMode = "false";
    d.hearthHexFourPairChapelBridgeActive = "true";
    d.hearthHexFourPairCoordinateModel = BODY.coordinateModel;
    d.hearthHexFourPairMechanicalCoordinate = BODY.mechanicalCoordinate;

    d.hearthHexFourPairGridColumns = String(BODY.columns);
    d.hearthHexFourPairGridRows = String(BODY.rows);
    d.hearthHexFourPairStateCount = String(BODY.stateCount);

    d.hearthHexFourPairSampleCount = String(state.sampleCount);
    d.hearthHexFourPairGatePacketCount = String(state.gatePacketCount);
    d.hearthHexFourPairWideProbeCount = String(state.wideProbeCount);

    d.hearthHexFourPairRecommendedNextFile = state.recommendedNextFile;
    d.hearthHexFourPairRecommendedNextAction = state.recommendedNextAction;
    d.hearthHexFourPairPostgameStatus = state.postgameStatus;

    d.hearthHexFourPairOwnsCanvasDrawing = "false";
    d.hearthHexFourPairOwnsHexSurface = "false";
    d.hearthHexFourPairOwnsTerrainTruth = "false";
    d.hearthHexFourPairOwnsFinalVisualPass = "false";

    d.generatedImage = "false";
    d.graphicBox = "false";
    d.webgl = "false";
    d.visualPassClaimed = "false";
  }

  function publishGatePacket(packet) {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_3D_BODY_GATE_PACKET = clone(packet);
    root.HEARTH_HEX_FOUR_PAIR_3D_BODY_GATE_PACKET = clone(packet);
    root.HEARTH.hexFourPair3dBodyGatePacket = clone(packet);
    root.DEXTER_LAB.hearthHexFourPair3dBodyGatePacket = clone(packet);
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY = api;
    root.HEARTH_HEX_FOUR_PAIR_AUTHORITY = api;
    root.HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY = api;
    root.HEARTH_HEX_HANDSHAKE_AUTHORITY = api;
    root.HEARTH_HEXGRID_AUTHORITY = api;
    root.HEARTH_HEX_FOUR_PAIR_3D_BODY_GATE_AUTHORITY = api;
    root.HEARTH_3D_BODY_GATE_AUTHORITY = api;

    root.HEARTH.hexFourPairAuthority = api;
    root.HEARTH.hexAuthority = api;
    root.HEARTH.hexFourPair3dBodyGateAuthority = api;
    root.HEARTH.body3dGateAuthority = api;

    root.DEXTER_LAB.hearthHexFourPairAuthority = api;
    root.DEXTER_LAB.hearthHexAuthority = api;
    root.DEXTER_LAB.hearthHexFourPair3dBodyGateAuthority = api;

    root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_STATUS = getStatus();
    root.HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_OBJECT = getReceipt();
    root.HEARTH_HEX_FOUR_PAIR_3D_BODY_GATE_AUTHORITY_RECEIPT_OBJECT = getReceipt();

    root.HEARTH.hexFourPairAuthorityReceipt = getReceipt();
    root.HEARTH.hexFourPair3dBodyGateAuthorityReceipt = getReceipt();

    updateDataset();
    return api;
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    FILE,
    ROUTE,
    VERSION,
    BODY,
    PLANET_ID,
    PLANET_LABEL,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    sample,
    read,
    getCell,
    getNeighbors,
    getFourPairSet,
    wideProbe,
    composeGatePacket,

    getStatus,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    body3dGateAuthority: true,
    compatibility2dMode: false,
    chapelBridgeActive: true,

    owns3dBodyAddressing: true,
    ownsFourPairBodyHandshake: true,
    owns256DiagnosticScope: true,
    ownsCanvas: false,
    ownsCanvasDrawing: false,
    ownsControls: false,
    ownsHexSurface: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsFinalVisualPass: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  };

  try {
    updateDataset();
    publishGlobals();
    wideProbe({ rows: 6, columns: 12 });
    publishGlobals();
  } catch (error) {
    state.firstFailedCoordinate = "HEARTH_3D_BODY_GATE_AUTHORITY_BOOT_ERROR";
    state.postgameStatus = error && error.message ? error.message : String(error);
    state.updatedAt = nowIso();
    updateDataset();
    publishGlobals();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
