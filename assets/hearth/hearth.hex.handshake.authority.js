// /assets/hearth/hearth.hex.handshake.authority.js
// HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1
// Full-file replacement.
// Coordinate / pixel-handshake authority only.
// Purpose:
// - Restore the hexagonal pixel substrate as the body-bound planetary boundary authority.
// - Assign every atlas pixel a stable north / south / east / west four-pair handshake set.
// - Keep all land, water, and air children sampling the same seated planetary coordinate body.
// - Prevent air/atmosphere from becoming the planet boundary.
// Does not own:
// - land truth
// - water truth
// - air truth
// - hydrology
// - elevation
// - tectonics
// - material palette
// - canvas rendering
// - runtime motion
// - controls
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-29.hearth-hex-four-pair-pixel-handshake-authority-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const DEFAULT_WIDTH = 384;
  const DEFAULT_HEIGHT = 192;

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function normalize3(p) {
    const x = safeNumber(p && p.x, 0);
    const y = safeNumber(p && p.y, 0);
    const z = safeNumber(p && p.z, 1);
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
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

  function vectorToLonLat(p) {
    const n = normalize3(p);

    return {
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
    };
  }

  function lonToU(lon) {
    return wrap01((safeNumber(lon, 0) + 180) / 360);
  }

  function latToV(lat) {
    return clamp((90 - safeNumber(lat, 0)) / 180, 0, 1);
  }

  function uToLon(u) {
    return wrap01(u) * 360 - 180;
  }

  function vToLat(v) {
    return 90 - clamp01(v) * 180;
  }

  function makeId(col, row) {
    return `HXP_${row}_${col}`;
  }

  function normalizeGrid(options = {}) {
    const width = clamp(Math.round(safeNumber(options.width, DEFAULT_WIDTH)), 8, 4096);
    const height = clamp(Math.round(safeNumber(options.height, DEFAULT_HEIGHT)), 4, 2048);
    return { width, height };
  }

  function normalizePixel(input = {}, options = {}) {
    const grid = normalizeGrid(options);
    let u;
    let v;

    if (Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) {
      u = wrap01(input.u);
      v = clamp01(input.v);
    } else if (Number.isFinite(Number(input.lon)) && Number.isFinite(Number(input.lat))) {
      u = lonToU(input.lon);
      v = latToV(input.lat);
    } else if (
      Number.isFinite(Number(input.x)) &&
      Number.isFinite(Number(input.y)) &&
      Number.isFinite(Number(input.z))
    ) {
      const ll = vectorToLonLat(input);
      u = lonToU(ll.lon);
      v = latToV(ll.lat);
    } else if (Number.isFinite(Number(input.col)) && Number.isFinite(Number(input.row))) {
      u = (clamp(Math.round(Number(input.col)), 0, grid.width - 1) + 0.5) / grid.width;
      v = (clamp(Math.round(Number(input.row)), 0, grid.height - 1) + 0.5) / grid.height;
    } else {
      u = 0.5;
      v = 0.5;
    }

    const col = clamp(Math.floor(u * grid.width), 0, grid.width - 1);
    const row = clamp(Math.floor(v * grid.height), 0, grid.height - 1);
    const centerU = (col + 0.5) / grid.width;
    const centerV = (row + 0.5) / grid.height;
    const lon = uToLon(centerU);
    const lat = vToLat(centerV);
    const vector = lonLatToVector(lon, lat);

    return {
      grid,
      col,
      row,
      u: centerU,
      v: centerV,
      lon,
      lat,
      x: vector.x,
      y: vector.y,
      z: vector.z,
      pixelId: makeId(col, row)
    };
  }

  function neighborCoord(col, row, direction, grid) {
    const evenRow = row % 2 === 0;

    const hexOffsetsEven = {
      north: [0, -1],
      south: [0, 1],
      east: [1, 0],
      west: [-1, 0],
      northEast: [1, -1],
      northWest: [0, -1],
      southEast: [1, 1],
      southWest: [0, 1]
    };

    const hexOffsetsOdd = {
      north: [0, -1],
      south: [0, 1],
      east: [1, 0],
      west: [-1, 0],
      northEast: [0, -1],
      northWest: [-1, -1],
      southEast: [0, 1],
      southWest: [-1, 1]
    };

    const offsets = evenRow ? hexOffsetsEven : hexOffsetsOdd;
    const pair = offsets[direction] || [0, 0];
    const nCol = ((col + pair[0]) % grid.width + grid.width) % grid.width;
    const nRow = clamp(row + pair[1], 0, grid.height - 1);

    return { col: nCol, row: nRow };
  }

  function makeHandshake(pixel, direction) {
    const n = neighborCoord(pixel.col, pixel.row, direction, pixel.grid);
    const neighborId = makeId(n.col, n.row);
    const pairKey = [pixel.pixelId, neighborId].sort().join("__");
    const opposite = {
      north: "south",
      south: "north",
      east: "west",
      west: "east",
      northEast: "southWest",
      northWest: "southEast",
      southEast: "northWest",
      southWest: "northEast"
    }[direction] || "opposite";

    return {
      direction,
      opposite,
      fromPixelId: pixel.pixelId,
      toPixelId: neighborId,
      pairKey,
      from: {
        col: pixel.col,
        row: pixel.row,
        u: pixel.u,
        v: pixel.v,
        lon: pixel.lon,
        lat: pixel.lat,
        x: pixel.x,
        y: pixel.y,
        z: pixel.z
      },
      to: read({ col: n.col, row: n.row }, pixel.grid, { internal: true }).coordinate,
      handshakeClass: "body-bound-pixel-neighbor-pair",
      boundaryAuthority: "planetary-body-coordinate-substrate",
      atmosphericBoundaryAllowed: false,
      bodyBound: true,
      surfaceBound: true,
      allowedToFloat: false,
      visualPassClaimed: false
    };
  }

  function makeFourPairSet(pixel) {
    return {
      north: makeHandshake(pixel, "north"),
      south: makeHandshake(pixel, "south"),
      east: makeHandshake(pixel, "east"),
      west: makeHandshake(pixel, "west")
    };
  }

  function makeHexShoulders(pixel) {
    return {
      northEast: makeHandshake(pixel, "northEast"),
      northWest: makeHandshake(pixel, "northWest"),
      southEast: makeHandshake(pixel, "southEast"),
      southWest: makeHandshake(pixel, "southWest")
    };
  }

  function localContinuity(fourPairSet) {
    const pairs = Object.values(fourPairSet || {});
    const valid = pairs.filter((pair) => pair && pair.bodyBound && pair.surfaceBound && pair.atmosphericBoundaryAllowed === false);
    return clamp01(valid.length / 4);
  }

  function read(input = {}, options = {}, meta = {}) {
    const pixel = normalizePixel(input, options);
    const coordinate = {
      pixelId: pixel.pixelId,
      col: pixel.col,
      row: pixel.row,
      u: pixel.u,
      v: pixel.v,
      lon: pixel.lon,
      lat: pixel.lat,
      x: pixel.x,
      y: pixel.y,
      z: pixel.z
    };

    if (meta && meta.internal) {
      return { coordinate };
    }

    const fourPairSet = makeFourPairSet(pixel);
    const hexShoulders = makeHexShoulders(pixel);
    const continuity = localContinuity(fourPairSet);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "hearth-hex-four-pair-pixel-handshake-authority",
      status: "active",
      channel: "coordinate-handshake",
      coordinate,
      grid: pixel.grid,

      pixelId: coordinate.pixelId,
      col: coordinate.col,
      row: coordinate.row,
      u: coordinate.u,
      v: coordinate.v,
      lon: coordinate.lon,
      lat: coordinate.lat,
      x: coordinate.x,
      y: coordinate.y,
      z: coordinate.z,

      fourPairSet,
      fourPairDirections: ["north", "south", "east", "west"],
      fourPairKeys: Object.keys(fourPairSet).reduce((acc, key) => {
        acc[key] = fourPairSet[key].pairKey;
        return acc;
      }, {}),
      hexShoulders,
      shoulderDirections: ["northEast", "northWest", "southEast", "southWest"],

      bodyBoundaryAuthority: true,
      planetaryBoundarySource: "body-coordinate-handshake-not-air",
      atmosphereMayRenderOutsideBoundary: true,
      atmosphereMayDefineBoundary: false,
      atmosphericBoundaryRejection: 1,
      landWaterBoundaryMayUseHandshake: true,
      airBoundaryMayUseHandshake: false,

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      coordinateContinuity: continuity,
      fourPairContinuity: continuity,
      handshakeReady: continuity >= 1,
      diagnosticEligible: true,
      diagnosticClass: "four-pair-pixel-body-bound-handshake",

      ownsLand: false,
      ownsWater: false,
      ownsAir: false,
      ownsHydrology: false,
      ownsElevationGeneration: false,
      ownsTectonicCause: false,
      ownsMaterials: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function sample(input = {}, options = {}) {
    return read(input, options);
  }

  function getNeighbors(input = {}, options = {}) {
    const packet = read(input, options);
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      coordinate: packet.coordinate,
      fourPairSet: packet.fourPairSet,
      hexShoulders: packet.hexShoulders,
      visualPassClaimed: false
    };
  }

  function handshakeBetween(a, b, options = {}) {
    const pa = normalizePixel(a, options);
    const pb = normalizePixel(b, options);
    const dxRaw = pb.col - pa.col;
    const dyRaw = pb.row - pa.row;
    const width = safeNumber(options.width, DEFAULT_WIDTH);
    const dx = Math.abs(dxRaw) > width / 2 ? -Math.sign(dxRaw) : Math.sign(dxRaw);
    const dy = Math.sign(dyRaw);

    let direction = "custom";
    if (dx === 0 && dy < 0) direction = "north";
    else if (dx === 0 && dy > 0) direction = "south";
    else if (dx > 0 && dy === 0) direction = "east";
    else if (dx < 0 && dy === 0) direction = "west";
    else if (dx > 0 && dy < 0) direction = "northEast";
    else if (dx < 0 && dy < 0) direction = "northWest";
    else if (dx > 0 && dy > 0) direction = "southEast";
    else if (dx < 0 && dy > 0) direction = "southWest";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      direction,
      fromPixelId: pa.pixelId,
      toPixelId: pb.pixelId,
      pairKey: [pa.pixelId, pb.pixelId].sort().join("__"),
      from: read({ col: pa.col, row: pa.row }, pa.grid, { internal: true }).coordinate,
      to: read({ col: pb.col, row: pb.row }, pb.grid, { internal: true }).coordinate,
      handshakeClass: "body-bound-pixel-neighbor-pair",
      bodyBound: true,
      surfaceBound: true,
      atmosphericBoundaryAllowed: false,
      visualPassClaimed: false
    };
  }

  function wideProbe(options = {}) {
    const rows = clamp(Math.round(safeNumber(options.rows, 5)), 3, 33);
    const columns = clamp(Math.round(safeNumber(options.columns, 9)), 3, 65);
    const grid = normalizeGrid(options);
    const samples = [];

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < columns; c += 1) {
        const u = columns <= 1 ? 0.5 : (c + 0.5) / columns;
        const v = rows <= 1 ? 0.5 : (r + 0.5) / rows;
        samples.push(read({ u, v }, grid));
      }
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mode: "wide-probe",
      rows,
      columns,
      total: samples.length,
      minimumWideProbePoints: 25,
      wideProbeReady: samples.length >= 25,
      samples,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
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
      destinationFile: "/assets/hearth/hearth.hex.handshake.authority.js",
      role: "body-bound hex pixel coordinate substrate and four-pair handshake authority",
      purpose: "assign every Hearth atlas pixel a seated planetary coordinate and north/south/east/west four-pair handshake set before canvas multiplexing",
      pixelLaw: {
        substrate: "hexagonal-pixel-field",
        requiredPrimaryPairs: ["north", "south", "east", "west"],
        shouldersAvailable: ["northEast", "northWest", "southEast", "southWest"],
        everyPixelHasFourPairSet: true,
        bodyBoundarySource: "coordinate-body-handshake",
        atmosphereMayDefineBoundary: false,
        atmosphereMayRenderOutsideBoundary: true
      },
      exposedMethods: ["sample", "read", "getNeighbors", "handshakeBetween", "wideProbe", "getReceipt"],
      owns: [
        "hex-pixel-coordinate-normalization",
        "north-south-east-west-four-pair-handshake-set",
        "hex-shoulder-neighbor-receipts",
        "body-bound-coordinate-boundary-fields",
        "atmospheric-boundary-rejection-fields",
        "wide-probe-coordinate-handshake-read-mode"
      ],
      doesNotOwn: [
        "land truth",
        "water truth",
        "air truth",
        "hydrology",
        "elevation",
        "tectonics",
        "material palette",
        "canvas rendering",
        "runtime motion",
        "controls",
        "final visual pass claim"
      ],
      loadSafety: {
        noImports: true,
        noRequiredFetch: true,
        exportsImmediately: true,
        safeWithoutDom: true,
        safeWithoutCanvas: true,
        neverReturnsNullFromSample: true
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sample,
    read,
    getNeighbors,
    handshakeBetween,
    wideProbe,
    getReceipt,
    supportsHexPixelSubstrate: true,
    supportsFourPairSet: true,
    supportsNorthSouthEastWestHandshakes: true,
    supportsBodyBoundaryAuthority: true,
    supportsAtmosphericBoundaryRejection: true,
    ownsLand: false,
    ownsWater: false,
    ownsAir: false,
    ownsCanvas: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.hexHandshakeAuthority = api;
  root.HEARTH_HEX_HANDSHAKE_AUTHORITY = api;
  root.HearthHexHandshakeAuthority = api;
  root.HEARTH_HEX_HANDSHAKE_AUTHORITY_RECEIPT = getReceipt();
  root.HEARTH_HEX_HANDSHAKE_AUTHORITY_CONTRACT = CONTRACT;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;
    dataset.hearthHexHandshakeAuthorityLoaded = "true";
    dataset.hearthHexHandshakeAuthorityContract = CONTRACT;
    dataset.hearthHexHandshakeAuthorityReceipt = RECEIPT;
    dataset.hearthHexPixelSubstrate = "true";
    dataset.hearthHexFourPairSet = "true";
    dataset.hearthHexDirections = "north,south,east,west";
    dataset.hearthPlanetBoundarySource = "body-coordinate-handshake-not-air";
    dataset.hearthAtmosphereDefinesBoundary = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
