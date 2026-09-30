// /assets/showroom/globe/planet/planet.lattice.js
// AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1
// Full-file replacement.
// File 3 of 16.
// Universal planet-family lattice authority.
// Purpose:
// - Provides the reusable 16 × 16 / 256-state planet lattice for Showroom Globe planet-family builds.
// - Maps UV, longitude/latitude, rows, columns, quadrants, bands, 4-cell, 16-cell, 64-cell, and 256-cell addresses.
// - Provides Nine Summits address mapping without owning planet identity.
// - Supports Audralia as the first specific planet instance without becoming Audralia-specific.
// - Does not render.
// - Does not mount.
// - Does not draw.
// - Does not own manifest law, math primitives, palette constants, land, water, weather, surface, motion state, controls, canvas, route, or HTML.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-planet-family-lattice-v1";

  const GRID_SIZE = 16;
  const TOTAL_CELLS = 256;
  const QUADRANT_SIZE = 8;
  const FAMILY_ANCHOR = "/showroom/globe/";
  const PRIMARY_NODE = 3;
  const SUBNODE_RANGE = Object.freeze([33, 48]);

  const SUMMIT_SEQUENCE = Object.freeze([
    "Gratitude",
    "Balance",
    "Stability",
    "Peace",
    "Joy",
    "Dignity",
    "Free Will",
    "Love",
    "Stewardship"
  ]);

  const CARDINAL_SEQUENCE = Object.freeze([
    "North",
    "North-Northeast",
    "Northeast",
    "East-Northeast",
    "East",
    "East-Southeast",
    "Southeast",
    "South-Southeast",
    "South",
    "South-Southwest",
    "Southwest",
    "West-Southwest",
    "West",
    "West-Northwest",
    "Northwest",
    "North-Northwest"
  ]);

  function math() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function finite(value, fallback = 0) {
    const helper = math();
    if (helper?.finite) return helper.finite(value, fallback);
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const helper = math();
    if (helper?.clamp) return helper.clamp(value, min, max);
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const helper = math();
    if (helper?.wrap01) return helper.wrap01(value);
    const number = finite(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function wrapDegrees(value) {
    const helper = math();
    if (helper?.wrapDegrees) return helper.wrapDegrees(value);
    let out = finite(value, 0);
    while (out < -180) out += 360;
    while (out > 180) out -= 360;
    return out;
  }

  function radiansToDegrees(value) {
    const helper = math();
    if (helper?.radiansToDegrees) return helper.radiansToDegrees(value);
    return finite(value, 0) * 180 / Math.PI;
  }

  function degreesToRadians(value) {
    const helper = math();
    if (helper?.degreesToRadians) return helper.degreesToRadians(value);
    return finite(value, 0) * Math.PI / 180;
  }

  function uvToLonLat(uInput, vInput) {
    const helper = math();
    if (helper?.uvToLonLat) return helper.uvToLonLat(uInput, vInput);

    const u = wrap01(uInput);
    const v = clamp01(vInput);

    return Object.freeze({
      u,
      v,
      longitudeDegrees: u * 360 - 180,
      latitudeDegrees: 90 - v * 180,
      longitudeRadians: (u * Math.PI * 2) - Math.PI,
      latitudeRadians: (Math.PI / 2) - v * Math.PI
    });
  }

  function lonLatToUV(longitudeDegrees, latitudeDegrees) {
    const helper = math();
    if (helper?.lonLatToUV) return helper.lonLatToUV(longitudeDegrees, latitudeDegrees);

    const lon = wrapDegrees(longitudeDegrees);
    const lat = clamp(latitudeDegrees, -90, 90);

    return Object.freeze({
      u: wrap01((lon + 180) / 360),
      v: clamp01((90 - lat) / 180),
      longitudeDegrees: lon,
      latitudeDegrees: lat,
      longitudeRadians: degreesToRadians(lon),
      latitudeRadians: degreesToRadians(lat)
    });
  }

  function normalizeRowCol(rowInput, colInput) {
    const row = clamp(Math.floor(finite(rowInput, 0)), 0, GRID_SIZE - 1);
    const col = ((Math.floor(finite(colInput, 0)) % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;

    return Object.freeze({ row, col });
  }

  function cell256FromRowCol(rowInput, colInput) {
    const { row, col } = normalizeRowCol(rowInput, colInput);
    return row * GRID_SIZE + col + 1;
  }

  function rowColFromCell256(cell256Input) {
    const cell256 = clamp(Math.floor(finite(cell256Input, 1)), 1, TOTAL_CELLS);
    const zero = cell256 - 1;

    return Object.freeze({
      cell256,
      row16: Math.floor(zero / GRID_SIZE),
      col16: zero % GRID_SIZE
    });
  }

  function cell64FromRowCol(rowInput, colInput) {
    const { row, col } = normalizeRowCol(rowInput, colInput);
    return Math.floor(row / 2) * 8 + Math.floor(col / 2) + 1;
  }

  function cell16FromRowCol(rowInput, colInput) {
    const { row, col } = normalizeRowCol(rowInput, colInput);
    return Math.floor(row / 4) * 4 + Math.floor(col / 4) + 1;
  }

  function cell4FromRowCol(rowInput, colInput) {
    const { row, col } = normalizeRowCol(rowInput, colInput);
    const north = row < 8;
    const east = col >= 8;

    if (north && east) return 1;
    if (!north && east) return 2;
    if (!north && !east) return 3;
    return 4;
  }

  function quadrantFromRowCol(rowInput, colInput) {
    const { row, col } = normalizeRowCol(rowInput, colInput);
    const north = row < 8;
    const east = col >= 8;

    if (north && east) return "NE";
    if (!north && east) return "SE";
    if (!north && !east) return "SW";
    return "NW";
  }

  function hemisphereFromLonLat(longitudeDegrees, latitudeDegrees) {
    const lon = wrapDegrees(longitudeDegrees);
    const lat = clamp(latitudeDegrees, -90, 90);

    return Object.freeze({
      northSouth: lat >= 0 ? "North" : "South",
      eastWest: lon >= 0 ? "East" : "West",
      quadrant: lat >= 0
        ? lon >= 0 ? "NE" : "NW"
        : lon >= 0 ? "SE" : "SW"
    });
  }

  function latitudeBand(latitudeDegrees) {
    const lat = clamp(latitudeDegrees, -90, 90);
    const abs = Math.abs(lat);

    if (abs >= 78) return lat >= 0 ? "north-polar" : "south-polar";
    if (abs >= 60) return lat >= 0 ? "north-subpolar" : "south-subpolar";
    if (abs >= 42) return lat >= 0 ? "north-cool-temperate" : "south-cool-temperate";
    if (abs >= 24) return lat >= 0 ? "north-temperate" : "south-temperate";
    if (abs >= 10) return lat >= 0 ? "north-subtropical" : "south-subtropical";
    return "equatorial";
  }

  function longitudeBand(longitudeDegrees) {
    const lon = wrapDegrees(longitudeDegrees);
    const normalized = lon + 180;
    const index = clamp(Math.floor(normalized / 22.5), 0, 15);
    return CARDINAL_SEQUENCE[index];
  }

  function summitForAddress(cell256, cell64, cell16, row16, col16) {
    const c256 = clamp(Math.floor(finite(cell256, 1)), 1, 256);
    const c64 = clamp(Math.floor(finite(cell64, 1)), 1, 64);
    const c16 = clamp(Math.floor(finite(cell16, 1)), 1, 16);
    const row = clamp(Math.floor(finite(row16, 0)), 0, 15);
    const col = clamp(Math.floor(finite(col16, 0)), 0, 15);

    const primaryIndex = (c16 + row + Math.floor(col / 2) - 1) % SUMMIT_SEQUENCE.length;
    const secondaryIndex = (c64 + c256 + col + row - 1) % SUMMIT_SEQUENCE.length;
    const internalIndex = (c256 + c64 + c16 - 3) % SUMMIT_SEQUENCE.length;

    return Object.freeze({
      primarySummit: SUMMIT_SEQUENCE[primaryIndex],
      secondarySummit: SUMMIT_SEQUENCE[secondaryIndex],
      internalSummit: SUMMIT_SEQUENCE[internalIndex],
      primaryIndex,
      secondaryIndex,
      internalIndex
    });
  }

  function coordinatesFromUV(uInput, vInput) {
    const u = wrap01(uInput);
    const v = clamp01(vInput);
    const row16 = clamp(Math.floor(v * GRID_SIZE), 0, GRID_SIZE - 1);
    const col16 = clamp(Math.floor(u * GRID_SIZE), 0, GRID_SIZE - 1);
    const cell256 = cell256FromRowCol(row16, col16);
    const cell64 = cell64FromRowCol(row16, col16);
    const cell16 = cell16FromRowCol(row16, col16);
    const cell4 = cell4FromRowCol(row16, col16);
    const lonLat = uvToLonLat(u, v);
    const summit = summitForAddress(cell256, cell64, cell16, row16, col16);
    const hemisphere = hemisphereFromLonLat(lonLat.longitudeDegrees, lonLat.latitudeDegrees);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "universal-planet-family-lattice",
      u,
      v,
      row16,
      col16,
      localU: u * GRID_SIZE - col16,
      localV: v * GRID_SIZE - row16,
      cell256,
      cell64,
      cell16,
      cell4,
      quadrant: quadrantFromRowCol(row16, col16),
      hemisphere,
      latitudeBand: latitudeBand(lonLat.latitudeDegrees),
      longitudeBand: longitudeBand(lonLat.longitudeDegrees),
      longitudeDegrees: lonLat.longitudeDegrees,
      latitudeDegrees: lonLat.latitudeDegrees,
      longitudeRadians: lonLat.longitudeRadians,
      latitudeRadians: lonLat.latitudeRadians,
      primarySummit: summit.primarySummit,
      secondarySummit: summit.secondarySummit,
      internalSummit: summit.internalSummit,
      summitIndexes: Object.freeze({
        primary: summit.primaryIndex,
        secondary: summit.secondaryIndex,
        internal: summit.internalIndex
      }),
      nodeAddress: Object.freeze({
        primaryNode: 3,
        subnodeRange: SUBNODE_RANGE,
        fileNode: PRIMARY_NODE,
        cell256,
        family: "16x16",
        construct: "16_squared_256"
      }),
      ownsLand: false,
      ownsWater: false,
      ownsClimate: false,
      ownsSurface: false,
      ownsAtmosphere: false,
      ownsCanvas: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function coordinatesFromLonLat(longitudeDegrees, latitudeDegrees) {
    const uv = lonLatToUV(longitudeDegrees, latitudeDegrees);
    return coordinatesFromUV(uv.u, uv.v);
  }

  function coordinatesFromRadians(longitudeRadians, latitudeRadians) {
    return coordinatesFromLonLat(
      radiansToDegrees(longitudeRadians),
      radiansToDegrees(latitudeRadians)
    );
  }

  function coordinatesFromCell256(cell256Input) {
    const rowCol = rowColFromCell256(cell256Input);
    const u = (rowCol.col16 + 0.5) / GRID_SIZE;
    const v = (rowCol.row16 + 0.5) / GRID_SIZE;
    return coordinatesFromUV(u, v);
  }

  function cellBounds(cell256Input) {
    const rowCol = rowColFromCell256(cell256Input);
    const minU = rowCol.col16 / GRID_SIZE;
    const maxU = (rowCol.col16 + 1) / GRID_SIZE;
    const minV = rowCol.row16 / GRID_SIZE;
    const maxV = (rowCol.row16 + 1) / GRID_SIZE;
    const nw = uvToLonLat(minU, minV);
    const se = uvToLonLat(maxU, maxV);

    return Object.freeze({
      cell256: rowCol.cell256,
      row16: rowCol.row16,
      col16: rowCol.col16,
      minU,
      maxU,
      minV,
      maxV,
      centerU: (minU + maxU) * 0.5,
      centerV: (minV + maxV) * 0.5,
      westLongitudeDegrees: nw.longitudeDegrees,
      eastLongitudeDegrees: se.longitudeDegrees,
      northLatitudeDegrees: nw.latitudeDegrees,
      southLatitudeDegrees: se.latitudeDegrees
    });
  }

  function neighborCells(cell256Input) {
    const rowCol = rowColFromCell256(cell256Input);
    const northRow = Math.max(0, rowCol.row16 - 1);
    const southRow = Math.min(15, rowCol.row16 + 1);
    const westCol = (rowCol.col16 + 15) % 16;
    const eastCol = (rowCol.col16 + 1) % 16;

    return Object.freeze({
      cell256: rowCol.cell256,
      north: cell256FromRowCol(northRow, rowCol.col16),
      south: cell256FromRowCol(southRow, rowCol.col16),
      east: cell256FromRowCol(rowCol.row16, eastCol),
      west: cell256FromRowCol(rowCol.row16, westCol),
      northeast: cell256FromRowCol(northRow, eastCol),
      northwest: cell256FromRowCol(northRow, westCol),
      southeast: cell256FromRowCol(southRow, eastCol),
      southwest: cell256FromRowCol(southRow, westCol)
    });
  }

  function iterateCells(callback) {
    const results = [];

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        const cell = coordinatesFromCell256(cell256FromRowCol(row, col));
        if (typeof callback === "function") {
          results.push(callback(cell));
        } else {
          results.push(cell);
        }
      }
    }

    return Object.freeze(results);
  }

  function subnodeForPrimaryNode(primaryNodeInput, localIndexInput) {
    const primaryNode = clamp(Math.floor(finite(primaryNodeInput, 1)), 1, 16);
    const localIndex = clamp(Math.floor(finite(localIndexInput, 1)), 1, 16);
    return (primaryNode - 1) * 16 + localIndex;
  }

  function primaryNodeForSubnode(subnodeInput) {
    const subnode = clamp(Math.floor(finite(subnodeInput, 1)), 1, 256);
    const primaryNode = Math.floor((subnode - 1) / 16) + 1;
    const localIndex = ((subnode - 1) % 16) + 1;

    return Object.freeze({
      subnode,
      primaryNode,
      localIndex,
      start: (primaryNode - 1) * 16 + 1,
      end: primaryNode * 16
    });
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_lattice_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/showroom/globe/planet/planet.lattice.js",
        contract: CONTRACT
      });
    } catch (error) {
      return Object.freeze({
        manifestAvailable: true,
        valid: false,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function validateMathRegistration() {
    const helper = math();

    return Object.freeze({
      mathAvailable: Boolean(helper),
      expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
      actualContract: helper?.contract || null,
      valid: !helper || helper.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
      reason: !helper
        ? "math_not_loaded_yet_lattice_has_safe_fallbacks"
        : helper.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1"
          ? "math_contract_matches"
          : "math_contract_mismatch"
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "universal-planet-family-lattice",
      fileNumber: 3,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      universalAnchor: FAMILY_ANCHOR,
      gridSize: GRID_SIZE,
      totalCells: TOTAL_CELLS,
      construct: "16_squared_256",
      summitSequence: SUMMIT_SEQUENCE,
      cardinalSequence: CARDINAL_SEQUENCE,
      owns: Object.freeze([
        "16x16 coordinate field",
        "256-cell address structure",
        "cell4 address",
        "cell16 address",
        "cell64 address",
        "cell256 address",
        "quadrant labels",
        "latitude bands",
        "longitude bands",
        "Nine Summits address mapping",
        "neighbor address helpers",
        "cell bounds"
      ]),
      doesNotOwn: Object.freeze([
        "manifest law",
        "math primitives",
        "palette constants",
        "Audralia identity",
        "landmask",
        "hydrology",
        "elevation",
        "climate",
        "biome",
        "surface truth",
        "atmosphere truth",
        "runtime state",
        "controls",
        "canvas composition",
        "route bridge",
        "HTML expression"
      ]),
      manifestRegistration: validateManifestRegistration(),
      mathRegistration: validateMathRegistration(),
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      oneFileOneJob: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    GRID_SIZE,
    TOTAL_CELLS,
    QUADRANT_SIZE,
    FAMILY_ANCHOR,
    PRIMARY_NODE,
    SUBNODE_RANGE,
    SUMMIT_SEQUENCE,
    CARDINAL_SEQUENCE,

    normalizeRowCol,
    cell256FromRowCol,
    rowColFromCell256,
    cell64FromRowCol,
    cell16FromRowCol,
    cell4FromRowCol,
    quadrantFromRowCol,
    hemisphereFromLonLat,
    latitudeBand,
    longitudeBand,
    summitForAddress,

    coordinatesFromUV,
    coordinatesFromLonLat,
    coordinatesFromRadians,
    coordinatesFromCell256,
    cellBounds,
    neighborCells,
    iterateCells,
    subnodeForPrimaryNode,
    primaryNodeForSubnode,

    validateManifestRegistration,
    validateMathRegistration,
    getStatus
  });

  window.DGB_PLANET_FAMILY_LATTICE = API;
  window.DGB_PLANET_FAMILY_LATTICE_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_LATTICE = API;
  window.AUDRALIA_CLEAN_CANVAS_LATTICE_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.planetFamilyLatticeLoaded = "true";
    document.documentElement.dataset.planetFamilyLatticeContract = CONTRACT;
    document.documentElement.dataset.planetFamilyLatticeReceipt = RECEIPT;
    document.documentElement.dataset.planetFamilyLatticeVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasLatticeLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasLatticeContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasLatticeReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasLatticeNode = "3";
    document.documentElement.dataset.audraliaCleanCanvasLatticeSubnodes = "33-48";
    document.documentElement.dataset.audraliaCleanCanvasGridSize = "16";
    document.documentElement.dataset.audraliaCleanCanvasTotalCells = "256";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();
