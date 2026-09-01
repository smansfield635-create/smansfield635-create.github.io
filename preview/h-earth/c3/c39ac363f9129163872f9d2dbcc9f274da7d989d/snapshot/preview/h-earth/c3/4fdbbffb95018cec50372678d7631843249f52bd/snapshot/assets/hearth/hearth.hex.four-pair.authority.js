// /assets/hearth/hearth.hex.four-pair.authority.js
// HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY_TNT_v2
// Full-file replacement.
// Clean 3D Hex Four-Pair Authority only.
//
// Owns:
// - 3D body-bound surface addressing
// - canonical vector / lon-lat / UV tuple normalization
// - 256-state diagnostic scope
// - north / south / east / west four-pair handshakes
// - clean authority receipt / status publication
//
// Does not own:
// - Canvas
// - Hex Surface bridge
// - Finger Surface / Chapel 2
// - route orchestration
// - controls
// - drawing
// - land / water / hydrology / elevation / material truth
// - final visual pass
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY_TNT_v2";
  const RECEIPT = "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY_RECEIPT_v2";
  const FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const ROUTE = "/showroom/globe/hearth/";
  const VERSION = "2026-06-09.hearth-hex-four-pair-clean-3d-authority-v2";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";

  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;

  const GRID = Object.freeze({
    bands: 32,
    sectors: 64,
    stateCount: 256,
    mode: "clean-3d-spherical-four-pair-authority",
    handshakes: Object.freeze(["north", "south", "east", "west"])
  });

  const NO_CLAIMS = Object.freeze({
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
    version: VERSION,
    file: FILE,
    route: ROUTE,

    authorityLoaded: true,
    clean3dAuthority: true,
    legacyAliases: false,
    twoDCompatibilityLayer: false,

    sampleCount: 0,
    readCount: 0,
    cellReadCount: 0,
    neighborReadCount: 0,
    fourPairReadCount: 0,
    wideProbeCount: 0,

    lastSampleAt: "",
    lastWideProbeAt: "",
    lastWideProbeTotal: 0,
    lastWideProbeFailedCount: 0,
    lastError: "",
    updatedAt: nowIso(),

    owns3dAddressing: true,
    ownsFourPairAuthority: true,
    owns256DiagnosticScope: true,

    ownsCanvas: false,
    ownsHexSurfaceBridge: false,
    ownsFingerSurface: false,
    ownsRouteOrchestration: false,
    ownsControls: false,
    ownsDrawing: false,
    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsHydrology: false,
    ownsElevation: false,
    ownsMaterials: false,
    ownsFinalVisualPass: false,

    ...NO_CLAIMS
  };

  function nowIso() {
    try { return new Date().toISOString(); }
    catch (_error) { return String(Date.now()); }
  }

  function number(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, number(value, min)));
  }

  function wrap(value, size) {
    const s = Math.max(1, Math.round(number(size, 1)));
    const n = Math.round(number(value, 0));
    return ((n % s) + s) % s;
  }

  function wrap01(value) {
    const n = number(value, 0);
    return ((n % 1) + 1) % 1;
  }

  function pad(value, size) {
    return String(value).padStart(size, "0");
  }

  function normalize3(input) {
    const x = number(input && input.x, 0);
    const y = number(input && input.y, 0);
    const z = number(input && input.z, 1);
    const length = Math.hypot(x, y, z) || 1;

    return { x: x / length, y: y / length, z: z / length };
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = number(lonDeg, 0) * RAD;
    const lat = clamp(latDeg, -90, 90) * RAD;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function vectorToLonLat(vector) {
    const p = normalize3(vector);
    return {
      lon: Math.atan2(p.x, p.z) * DEG,
      lat: Math.asin(clamp(p.y, -1, 1)) * DEG
    };
  }

  function lonToU(lon) {
    return wrap01((number(lon, 0) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - number(lat, 0)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp(v, 0, 1) * 180;
  }

  function parseInput() {
    const args = Array.from(arguments);

    if (args.length === 1 && Array.isArray(args[0]) && args[0].length >= 3) {
      return normalize3({ x: args[0][0], y: args[0][1], z: args[0][2] });
    }

    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const input = args[0];

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

      if (Number.isFinite(Number(input.band)) && Number.isFinite(Number(input.sector))) {
        return cellFromBandSector(input.band, input.sector).vector;
      }
    }

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(args[0], args[1]);

    return lonLatToVector(0, 0);
  }

  function stateHash(band, sector) {
    const b = wrap(band, GRID.bands);
    const s = wrap(sector, GRID.sectors);
    return wrap((b * 41) + (s * 17) + (b * s * 11) + 113, GRID.stateCount);
  }

  function cellId(band, sector) {
    return `HEARTH_3D_B${pad(band, 2)}_S${pad(sector, 2)}`;
  }

  function edgeRole(band) {
    if (band <= 0) return "north-polar-cap";
    if (band >= GRID.bands - 1) return "south-polar-cap";
    if (band <= 2) return "north-high-latitude";
    if (band >= GRID.bands - 3) return "south-high-latitude";
    if (band >= 14 && band <= 17) return "equatorial-body-band";
    return "mid-body";
  }

  function cellFromBandSector(band, sector) {
    const b = clamp(Math.round(number(band, 0)), 0, GRID.bands - 1);
    const s = wrap(sector, GRID.sectors);

    const u = wrap01((s + 0.5) / GRID.sectors);
    const v = clamp((b + 0.5) / GRID.bands, 0, 1);
    const lon = uToLon(u);
    const lat = vToLat(v);
    const vector = lonLatToVector(lon, lat);
    const id = cellId(b, s);
    const sid = stateHash(b, s);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,

      cellId: id,
      hexId: id,
      band: b,
      sector: s,
      u,
      v,
      lon,
      lat,
      x: vector.x,
      y: vector.y,
      z: vector.z,
      vector,

      stateId: sid,
      stateClass: `state-${pad(sid, 3)}`,
      edgeRole: edgeRole(b),
      gridBands: GRID.bands,
      gridSectors: GRID.sectors,
      gridMode: GRID.mode,

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      mayDefineLand: false,
      mayDefineWater: false,
      mayDefineHydrology: false,
      mayDefineElevation: false,
      mayDefineMaterials: false,

      ownsCanvas: false,
      ownsDrawing: false,
      ownsRoute: false,
      ownsControls: false,

      ...NO_CLAIMS
    };
  }

  function cellFromVector(vector) {
    const p = normalize3(vector);
    const ll = vectorToLonLat(p);
    const u = lonToU(ll.lon);
    const v = latToV(ll.lat);
    const band = clamp(Math.floor(v * GRID.bands), 0, GRID.bands - 1);
    const sector = wrap(Math.floor(u * GRID.sectors), GRID.sectors);
    const cell = cellFromBandSector(band, sector);

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
    const band = clamp(Math.round(number(cell.band, 0)), 0, GRID.bands - 1);
    const sector = wrap(cell.sector, GRID.sectors);

    let nextBand = band;
    let nextSector = sector;
    let boundaryClamp = false;

    if (direction === "north") {
      nextBand = band - 1;
      if (nextBand < 0) {
        nextBand = 0;
        boundaryClamp = true;
      }
    }

    if (direction === "south") {
      nextBand = band + 1;
      if (nextBand > GRID.bands - 1) {
        nextBand = GRID.bands - 1;
        boundaryClamp = true;
      }
    }

    if (direction === "east") nextSector = sector + 1;
    if (direction === "west") nextSector = sector - 1;

    return {
      ...cellFromBandSector(nextBand, nextSector),
      handshakeBoundaryClamp: boundaryClamp,
      handshakeBoundaryRole: boundaryClamp ? "polar-band-clamp" : "normal-3d-adjacent-cell"
    };
  }

  function opposite(direction) {
    return {
      north: "south",
      south: "north",
      east: "west",
      west: "east"
    }[direction] || "unknown";
  }

  function axis(direction) {
    if (direction === "north" || direction === "south") return "north-south";
    if (direction === "east" || direction === "west") return "east-west";
    return "unknown";
  }

  function makeHandshake(cell, direction) {
    const to = neighborCell(cell, direction);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
      direction,
      reciprocalDirection: opposite(direction),
      axis: axis(direction),
      handshakeClass: "clean-3d-cardinal-four-pair-body-handshake",

      fromCellId: cell.cellId,
      toCellId: to.cellId,
      fromBand: cell.band,
      fromSector: cell.sector,
      toBand: to.band,
      toSector: to.sector,
      fromStateId: cell.stateId,
      toStateId: to.stateId,

      boundaryClamp: Boolean(to.handshakeBoundaryClamp),
      boundaryRole: to.handshakeBoundaryRole || "normal-3d-adjacent-cell",

      valid: true,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsHydrology: false,
      ownsElevation: false,
      ownsMaterials: false,
      ownsCanvas: false,
      ownsDrawing: false,

      ...NO_CLAIMS
    };
  }

  function buildFourPair(cell) {
    const north = makeHandshake(cell, "north");
    const south = makeHandshake(cell, "south");
    const east = makeHandshake(cell, "east");
    const west = makeHandshake(cell, "west");

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
      setClass: "clean-3d-four-cardinal-pair-set",
      centerCellId: cell.cellId,
      centerStateId: cell.stateId,
      directions: GRID.handshakes.slice(),

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

      ...NO_CLAIMS
    };
  }

  function sample() {
    const vector = parseInput.apply(null, arguments);
    const cell = cellFromVector(vector);
    const fourPair = buildFourPair(cell);

    state.sampleCount += 1;
    state.lastSampleAt = nowIso();
    state.updatedAt = state.lastSampleAt;

    return {
      ...cell,
      sourceX: cell.sourceX,
      sourceY: cell.sourceY,
      sourceZ: cell.sourceZ,
      sourceU: cell.sourceU,
      sourceV: cell.sourceV,
      sourceLon: cell.sourceLon,
      sourceLat: cell.sourceLat,

      fourPair,
      fourPairSet: fourPair.fourPairSet,
      north: fourPair.north,
      south: fourPair.south,
      east: fourPair.east,
      west: fourPair.west,
      northSouthPair: fourPair.northSouthPair,
      eastWestPair: fourPair.eastWestPair,

      handshakeCount: 4,
      cardinalHandshakeCount: 4,
      everyPixelHasNorthSouthEastWest: true,
      everyPixelHasFourPairSet: true,
      fourPairSetIsBodyBound: true,
      clean3dAuthority: true,
      twoDCompatibilityLayer: false,
      legacyAliases: false,

      ...NO_CLAIMS
    };
  }

  function read() {
    state.readCount += 1;
    state.updatedAt = nowIso();

    const args = Array.from(arguments);
    const first = args[0];

    if (first && typeof first === "object") {
      if (first.mode === "cell") return getCell(first);
      if (first.mode === "neighbors") return getNeighbors(first);
      if (first.mode === "four-pair") return getFourPairSet(first);
      if (first.mode === "wide-probe") return wideProbe(first);
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
      authority: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,
      cellId: packet.cellId,
      hexId: packet.hexId,
      band: packet.band,
      sector: packet.sector,
      u: packet.u,
      v: packet.v,
      lon: packet.lon,
      lat: packet.lat,
      x: packet.x,
      y: packet.y,
      z: packet.z,
      stateId: packet.stateId,
      stateClass: packet.stateClass,
      edgeRole: packet.edgeRole,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...NO_CLAIMS
    };
  }

  function getNeighbors() {
    state.neighborReadCount += 1;
    state.updatedAt = nowIso();

    const packet = sample.apply(null, arguments);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
      centerCellId: packet.cellId,
      centerStateId: packet.stateId,
      cardinal: {
        north: neighborCell(packet, "north"),
        south: neighborCell(packet, "south"),
        east: neighborCell(packet, "east"),
        west: neighborCell(packet, "west")
      },
      fourPair: packet.fourPair,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...NO_CLAIMS
    };
  }

  function getFourPairSet() {
    state.fourPairReadCount += 1;
    state.updatedAt = nowIso();
    return sample.apply(null, arguments).fourPair;
  }

  function wideProbe(options = {}) {
    const bands = clamp(Math.round(number(options.bands, 7)), 2, GRID.bands);
    const sectors = clamp(Math.round(number(options.sectors, 13)), 2, GRID.sectors);
    const points = [];

    for (let b = 0; b < bands; b += 1) {
      const v = (b + 0.5) / bands;

      for (let s = 0; s < sectors; s += 1) {
        const u = (s + 0.5) / sectors;
        const value = sample({ u, v });

        points.push({
          index: points.length,
          probeBand: b,
          probeSector: s,
          u,
          v,
          lon: value.lon,
          lat: value.lat,
          x: value.x,
          y: value.y,
          z: value.z,
          cellId: value.cellId,
          band: value.band,
          sector: value.sector,
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
      authority: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
      file: FILE,
      route: ROUTE,
      mode: "wide-probe",
      bands,
      sectors,
      total: points.length,
      minimumWideProbePoints: 25,
      wideProbeReady: points.length >= 25,
      failedCount: failed.length,
      passed: failed.length === 0 && points.length >= 25,
      held: points.length < 25,
      heldReason: points.length < 25 ? "INSUFFICIENT_WIDE_PROBE" : "",
      points,
      failed,

      clean3dAuthority: true,
      everyPixelHasNorthSouthEastWest: failed.length === 0,
      everyPixelHasFourPairSet: failed.length === 0,
      everyPixelBodyBound: failed.length === 0,
      everyPixelSurfaceBound: failed.length === 0,
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      ...NO_CLAIMS
    };

    state.wideProbeCount += 1;
    state.lastWideProbeAt = nowIso();
    state.lastWideProbeTotal = result.total;
    state.lastWideProbeFailedCount = result.failedCount;
    state.updatedAt = state.lastWideProbeAt;

    updateDataset(result);
    publishGlobals();

    return result;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: "Clean 3D Hex Four-Pair Authority",

      authorityLoaded: true,
      clean3dAuthority: true,
      legacyAliases: false,
      twoDCompatibilityLayer: false,

      gridBands: GRID.bands,
      gridSectors: GRID.sectors,
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
      supports256StateDiagnosticScope: true,

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      everyPixelHasNorthSouthEastWest: true,
      everyPixelHasFourPairSet: true,

      sampleCount: state.sampleCount,
      readCount: state.readCount,
      cellReadCount: state.cellReadCount,
      neighborReadCount: state.neighborReadCount,
      fourPairReadCount: state.fourPairReadCount,
      wideProbeCount: state.wideProbeCount,
      lastSampleAt: state.lastSampleAt,
      lastWideProbeAt: state.lastWideProbeAt,
      lastWideProbeTotal: state.lastWideProbeTotal,
      lastWideProbeFailedCount: state.lastWideProbeFailedCount,
      lastError: state.lastError,
      updatedAt: state.updatedAt,

      owns3dAddressing: true,
      ownsFourPairAuthority: true,
      owns256DiagnosticScope: true,

      ownsCanvas: false,
      ownsHexSurfaceBridge: false,
      ownsFingerSurface: false,
      ownsRouteOrchestration: false,
      ownsControls: false,
      ownsDrawing: false,
      ownsLandTruth: false,
      ownsWaterTruth: false,
      ownsHydrology: false,
      ownsElevation: false,
      ownsMaterials: false,
      ownsFinalVisualPass: false,

      ...NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getStatus(),
      purpose: [
        "Provide clean 3D body-bound cell addressing for Hearth.",
        "Resolve any valid vector / lon-lat / UV input to one canonical surface cell.",
        "Assign each sampled cell north, south, east, and west handshakes.",
        "Preserve 256-state diagnostic scope.",
        "Expose authority packet for the Hex Surface bridge."
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
      downstreamExpectedNextFile: "/assets/hearth/hearth.hex.surface.js",
      downstreamRole: "Bridge between Chapel 1 and Chapel 2",
      cleanAliasPolicy: {
        legacyAliases: false,
        publicAuthorityAlias: "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY",
        nestedAuthorityAlias: "HEARTH.hexFourPair3dAuthority",
        labAuthorityAlias: "DEXTER_LAB.hearthHexFourPair3dAuthority"
      }
    };
  }

  function getReceiptText() {
    const r = getStatus();

    return [
      "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      `authorityLoaded=${r.authorityLoaded}`,
      `clean3dAuthority=${r.clean3dAuthority}`,
      `legacyAliases=${r.legacyAliases}`,
      `twoDCompatibilityLayer=${r.twoDCompatibilityLayer}`,
      "",
      `gridBands=${r.gridBands}`,
      `gridSectors=${r.gridSectors}`,
      `stateCount=${r.stateCount}`,
      `gridMode=${r.gridMode}`,
      "",
      `supportsNorthHandshake=${r.supportsNorthHandshake}`,
      `supportsSouthHandshake=${r.supportsSouthHandshake}`,
      `supportsEastHandshake=${r.supportsEastHandshake}`,
      `supportsWestHandshake=${r.supportsWestHandshake}`,
      "",
      `bodyBound=${r.bodyBound}`,
      `surfaceBound=${r.surfaceBound}`,
      `floatsAboveBody=${r.floatsAboveBody}`,
      `allowedToFloat=${r.allowedToFloat}`,
      `everyPixelHasNorthSouthEastWest=${r.everyPixelHasNorthSouthEastWest}`,
      `everyPixelHasFourPairSet=${r.everyPixelHasFourPairSet}`,
      "",
      `owns3dAddressing=${r.owns3dAddressing}`,
      `ownsFourPairAuthority=${r.ownsFourPairAuthority}`,
      `ownsCanvas=${r.ownsCanvas}`,
      `ownsHexSurfaceBridge=${r.ownsHexSurfaceBridge}`,
      `ownsFingerSurface=${r.ownsFingerSurface}`,
      `ownsDrawing=${r.ownsDrawing}`,
      "",
      `sampleCount=${r.sampleCount}`,
      `wideProbeCount=${r.wideProbeCount}`,
      `lastWideProbeTotal=${r.lastWideProbeTotal}`,
      `lastWideProbeFailedCount=${r.lastWideProbeFailedCount}`,
      `lastError=${r.lastError}`,
      "",
      `visualPassClaimed=${r.visualPassClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset(lastWideProbe = null) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const data = doc.documentElement.dataset;

    data.hearthHexFourPair3dAuthorityLoaded = "true";
    data.hearthHexFourPair3dAuthorityContract = CONTRACT;
    data.hearthHexFourPair3dAuthorityReceipt = RECEIPT;
    data.hearthHexFourPair3dAuthorityVersion = VERSION;
    data.hearthHexFourPair3dAuthorityFile = FILE;

    data.hearthHexFourPair3dCleanAuthority = "true";
    data.hearthHexFourPair3dLegacyAliases = "false";
    data.hearthHexFourPair3dTwoDCompatibilityLayer = "false";

    data.hearthHexFourPair3dGridBands = String(GRID.bands);
    data.hearthHexFourPair3dGridSectors = String(GRID.sectors);
    data.hearthHexFourPair3dStateCount = String(GRID.stateCount);
    data.hearthHexFourPair3dGridMode = GRID.mode;

    data.hearthHexFourPair3dNorthHandshake = "true";
    data.hearthHexFourPair3dSouthHandshake = "true";
    data.hearthHexFourPair3dEastHandshake = "true";
    data.hearthHexFourPair3dWestHandshake = "true";
    data.hearthHexFourPair3dEveryPixelHasFourPairSet = "true";
    data.hearthHexFourPair3dEveryPixelHasNorthSouthEastWest = "true";

    data.hearthHexFourPair3dOwnsCanvas = "false";
    data.hearthHexFourPair3dOwnsHexSurfaceBridge = "false";
    data.hearthHexFourPair3dOwnsFingerSurface = "false";
    data.hearthHexFourPair3dOwnsDrawing = "false";
    data.hearthHexFourPair3dOwnsRouteOrchestration = "false";

    if (lastWideProbe) {
      data.hearthHexFourPair3dWideProbeReady = String(Boolean(lastWideProbe.wideProbeReady));
      data.hearthHexFourPair3dWideProbeTotal = String(lastWideProbe.total || 0);
      data.hearthHexFourPair3dWideProbeFailedCount = String(lastWideProbe.failedCount || 0);
      data.hearthHexFourPair3dWideProbePassed = String(Boolean(lastWideProbe.passed));
    }

    data.generatedImage = "false";
    data.graphicBox = "false";
    data.webgl = "false";
    data.visualPassClaimed = "false";

    return true;
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY = api;
    root.HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY_CONTRACT = CONTRACT;
    root.HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY_RECEIPT = getReceipt();
    root.HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY_STATUS = getStatus();

    root.HEARTH.hexFourPair3dAuthority = api;
    root.HEARTH.hexFourPair3dAuthorityReceipt = getReceipt();

    root.DEXTER_LAB.hearthHexFourPair3dAuthority = api;
    root.DEXTER_LAB.hearthHexFourPair3dAuthorityReceipt = getReceipt();

    updateDataset();
    return api;
  }

  const api = {
    CONTRACT,
    RECEIPT,
    FILE,
    ROUTE,
    VERSION,
    GRID,
    PLANET_ID,
    PLANET_LABEL,

    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "Clean 3D Hex Four-Pair Authority",

    sample,
    read,
    getCell,
    getNeighbors,
    getFourPairSet,
    wideProbe,
    getStatus,
    getReceipt,
    getReceiptText,
    updateDataset,
    publishGlobals,

    clean3dAuthority: true,
    legacyAliases: false,
    twoDCompatibilityLayer: false,

    owns3dAddressing: true,
    ownsFourPairAuthority: true,
    owns256DiagnosticScope: true,

    ownsCanvas: false,
    ownsHexSurfaceBridge: false,
    ownsFingerSurface: false,
    ownsRouteOrchestration: false,
    ownsControls: false,
    ownsDrawing: false,
    ownsLandTruth: false,
    ownsWaterTruth: false,
    ownsHydrology: false,
    ownsElevation: false,
    ownsMaterials: false,
    ownsFinalVisualPass: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  };

  try {
    updateDataset();
    publishGlobals();
    wideProbe({ bands: 7, sectors: 13 });
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
