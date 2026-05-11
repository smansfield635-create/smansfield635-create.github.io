// /assets/audralia/audralia.lattice256.js
// AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_TNT_v1
// New file.
// 256-cell coordinate atlas authority.
// Owns latitude/longitude cell addressing.
// Does not render.
// Does not create land.
// Does not create water.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.audralia-g1-256-lattice-atlas-authority-v1";

  const ROWS = 16;
  const COLUMNS = 16;
  const CELL_COUNT = 256;
  const LAT_STEP = 180 / ROWS;
  const LON_STEP = 360 / COLUMNS;

  const BOOK_SUMMITS = Object.freeze([
    "Gratitude",
    "Generosity",
    "Dependability",
    "Accountability",
    "Forgiveness",
    "Humility",
    "Self-Control",
    "Patience",
    "Purity"
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function wrapLongitude(longitude) {
    let value = Number(longitude);
    while (value < -180) value += 360;
    while (value > 180) value -= 360;
    return value;
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function bandForLatitude(latitude) {
    const abs = Math.abs(latitude);
    if (abs >= 78.75) return "polar-cap";
    if (abs >= 67.5) return "polar";
    if (abs >= 45) return "cold-temperate";
    if (abs >= 22.5) return "temperate";
    if (abs >= 11.25) return "subtropical";
    return "equatorial";
  }

  function quadrantFor(latitude, longitude) {
    return `${latitude >= 0 ? "N" : "S"}${longitude >= 0 ? "E" : "W"}`;
  }

  function summitForCell(cell256) {
    return BOOK_SUMMITS[(cell256 - 1) % BOOK_SUMMITS.length];
  }

  function rowFromLatitude(latitude) {
    const clamped = clamp(latitude, -90, 90);
    return clamp(Math.floor((90 - clamped) / LAT_STEP) + 1, 1, ROWS);
  }

  function columnFromLongitude(longitude) {
    const wrapped = wrapLongitude(longitude);
    const adjusted = wrapped === 180 ? 179.999999 : wrapped;
    return clamp(Math.floor((adjusted + 180) / LON_STEP) + 1, 1, COLUMNS);
  }

  function cellId(row, column) {
    return (row - 1) * COLUMNS + column;
  }

  function buildCell(row, column) {
    const id = cellId(row, column);

    const latitudeMax = 90 - (row - 1) * LAT_STEP;
    const latitudeMin = latitudeMax - LAT_STEP;
    const latitudeCenter = (latitudeMin + latitudeMax) / 2;

    const longitudeMin = -180 + (column - 1) * LON_STEP;
    const longitudeMax = longitudeMin + LON_STEP;
    const longitudeCenter = (longitudeMin + longitudeMax) / 2;

    const band = bandForLatitude(latitudeCenter);
    const quadrant = quadrantFor(latitudeCenter, longitudeCenter);
    const internalSummit = summitForCell(id);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      cell256: id,
      row,
      column,
      latitudeMin,
      latitudeMax,
      latitudeCenter,
      longitudeMin,
      longitudeMax,
      longitudeCenter,
      quadrant,
      band,
      primarySummit: "Gratitude",
      internalSummit,
      cell16: Math.floor((row - 1) / 4) * 4 + Math.floor((column - 1) / 4) + 1,
      cell64: Math.floor((row - 1) / 2) * 8 + Math.floor((column - 1) / 2) + 1,
      ownsFootprint: false,
      ownsRendering: false,
      ownsCoordinates: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const CELLS = Object.freeze(
    Array.from({ length: CELL_COUNT }, (_, index) => {
      const row = Math.floor(index / COLUMNS) + 1;
      const column = (index % COLUMNS) + 1;
      return buildCell(row, column);
    })
  );

  function coordinatesFromUV(u, v) {
    const uu = wrap01(Number.isFinite(u) ? u : 0);
    const vv = clamp(Number.isFinite(v) ? v : 0, 0, 1);

    const longitude = uu * 360 - 180;
    const latitude = 90 - vv * 180;

    return coordinatesFromLatLon(latitude, longitude);
  }

  function coordinatesFromLatLon(latitude, longitude) {
    const lat = clamp(Number(latitude), -90, 90);
    const lon = wrapLongitude(Number(longitude));

    const row = rowFromLatitude(lat);
    const column = columnFromLongitude(lon);
    const id = cellId(row, column);
    const cell = CELLS[id - 1];

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      latitude: lat,
      longitude: lon,
      latitudeRadians: (lat / 180) * Math.PI,
      longitudeRadians: (lon / 180) * Math.PI,
      u: wrap01((lon + 180) / 360),
      v: clamp((90 - lat) / 180, 0, 1),
      hemisphereNS: lat >= 0 ? "north" : "south",
      hemisphereEW: lon >= 0 ? "east" : "west",
      quadrant: cell.quadrant,
      band: cell.band,
      row,
      column,
      cell16: cell.cell16,
      cell64: cell.cell64,
      cell256: id,
      primarySummit: cell.primarySummit,
      internalSummit: cell.internalSummit
    });
  }

  function getCellById(id) {
    const index = clamp(Math.floor(Number(id) || 1), 1, CELL_COUNT) - 1;
    return CELLS[index];
  }

  function getCellByUV(u, v) {
    return getCellById(coordinatesFromUV(u, v).cell256);
  }

  function getCellByLatLon(latitude, longitude) {
    return getCellById(coordinatesFromLatLon(latitude, longitude).cell256);
  }

  function getAllCells() {
    return CELLS;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "audralia-256-lattice-atlas-authority",
      rows: ROWS,
      columns: COLUMNS,
      cellCount: CELL_COUNT,
      latitudeStep: LAT_STEP,
      longitudeStep: LON_STEP,
      primarySummit: "Gratitude",
      internalSummitCycle: BOOK_SUMMITS,
      ownsCoordinates: true,
      ownsFootprint: false,
      ownsRendering: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_LATTICE256 = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    cells: CELLS,
    getAllCells,
    getCellById,
    getCellByUV,
    getCellByLatLon,
    coordinatesFromUV,
    coordinatesFromLatLon,
    getStatus
  });

  window.AUDRALIA_LATTICE256_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaLattice256Loaded = "true";
  document.documentElement.dataset.audraliaLattice256Contract = CONTRACT;
  document.documentElement.dataset.audraliaLattice256Receipt = RECEIPT;
  document.documentElement.dataset.audraliaLattice256Cells = String(CELL_COUNT);
  document.documentElement.dataset.audraliaCoordinateSystem = "longitude-latitude-16-64-256";
  document.documentElement.dataset.audraliaPrimarySummit = "Gratitude";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
