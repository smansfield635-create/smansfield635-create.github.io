// /assets/hearth/hearth.tectonics.js
// HEARTH_PRE_TERRAIN_DEPTH_TECTONICS_AUTHORITY_TNT_v1
// Full-file replacement / restored child authority.
// Pre-terrain buried depth + tectonic pressure authority only.
// Produces numeric structural fields for elevation/composition consumers.
// Does not render, paint, color, classify final land/ocean, own climate, own hydrology, own materials, own canvas, own runtime, or claim visual pass.
// No generated image. No GraphicBox. No WebGL. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_PRE_TERRAIN_DEPTH_TECTONICS_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_PRE_TERRAIN_DEPTH_TECTONICS_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-28.hearth-pre-terrain-depth-tectonics-authority-v1";

  const TWO_PI = Math.PI * 2;
  const HALF_PI = Math.PI / 2;
  const EPSILON = 0.000001;

  function clamp(value, min = 0, max = 1) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(EPSILON, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
  }

  function normalizeSampleInput(u, v) {
    return {
      u: wrap01(u),
      v: clamp(v, 0, 1)
    };
  }

  function lonFromU(u) {
    return wrap01(u) * TWO_PI - Math.PI;
  }

  function latFromV(v) {
    return HALF_PI - clamp(v, 0, 1) * Math.PI;
  }

  function vectorFromLatLon(lat, lon) {
    const cosLat = Math.cos(lat);
    return {
      x: cosLat * Math.cos(lon),
      y: Math.sin(lat),
      z: cosLat * Math.sin(lon)
    };
  }

  function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function angularDistance(a, b) {
    return Math.acos(clamp(dot(a, b), -1, 1));
  }

  function sphericalInfluence(point, center, radius, falloff = 1) {
    const d = angularDistance(point, center.vector);
    const t = 1 - clamp(d / Math.max(EPSILON, radius), 0, 1);
    return Math.pow(smoothstep(0, 1, t), falloff);
  }

  function hash3(a, b, c) {
    let h = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul((b | 0) ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= Math.imul((c | 0) ^ 0x165667b1, 0x9e3779b1);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(1, Math.floor(scale));
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const xf = x - x0;
    const yf = y - y0;

    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const ax0 = ((x0 % s) + s) % s;
    const ax1 = ((x1 % s) + s) % s;

    const n00 = hash3(ax0, y0, seed);
    const n10 = hash3(ax1, y0, seed);
    const n01 = hash3(ax0, y1, seed);
    const n11 = hash3(ax1, y1, seed);

    return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy);
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 313) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(EPSILON, norm);
  }

  function center(latDeg, lonDeg, radius, weight, falloff = 1) {
    const lat = (latDeg / 180) * Math.PI;
    const lon = (lonDeg / 180) * Math.PI;

    return Object.freeze({
      lat,
      lon,
      radius,
      weight,
      falloff,
      vector: vectorFromLatLon(lat, lon)
    });
  }

  const COMPRESSION_CENTERS = Object.freeze([
    center(42, -138, 1.08, 0.88, 1.35),
    center(18, -62, 0.94, 0.72, 1.2),
    center(-24, -18, 1.0, 0.82, 1.28),
    center(35, 44, 0.9, 0.66, 1.15),
    center(-38, 112, 1.04, 0.78, 1.3),
    center(8, 156, 0.86, 0.58, 1.05)
  ]);

  const BASIN_CENTERS = Object.freeze([
    center(8, -118, 0.72, 0.7, 1.6),
    center(-12, -54, 0.68, 0.62, 1.45),
    center(28, 8, 0.78, 0.66, 1.52),
    center(-44, 54, 0.7, 0.58, 1.38),
    center(14, 122, 0.75, 0.64, 1.46)
  ]);

  const RIDGE_CENTERS = Object.freeze([
    center(55, -92, 0.46, 0.78, 1.85),
    center(12, -28, 0.42, 0.62, 1.7),
    center(-31, 22, 0.48, 0.74, 1.82),
    center(38, 88, 0.44, 0.66, 1.76),
    center(-18, 146, 0.45, 0.7, 1.8)
  ]);

  const SCAR_CENTERS = Object.freeze([
    center(61, -158, 0.38, 0.56, 2.0),
    center(26, -96, 0.34, 0.48, 1.8),
    center(-5, -12, 0.42, 0.64, 1.9),
    center(-36, 78, 0.36, 0.52, 1.86),
    center(19, 171, 0.33, 0.46, 1.75)
  ]);

  function weightedField(point, centers) {
    let total = 0;
    let max = 0;

    centers.forEach((item) => {
      const value = sphericalInfluence(point, item, item.radius, item.falloff) * item.weight;
      total += value;
      max += Math.max(EPSILON, item.weight);
    });

    return clamp(total / Math.max(EPSILON, max), 0, 1);
  }

  function seamArcPressure(u, v, phase, frequency, width) {
    const wave = Math.sin((u * frequency + phase) * TWO_PI);
    const latitudeBend = Math.cos((v - 0.5) * Math.PI);
    const folded = Math.abs(wave * 0.72 + latitudeBend * 0.28);
    return 1 - smoothstep(width, width + 0.34, folded);
  }

  function channelCutPressure(u, v) {
    const a = seamArcPressure(u + 0.07, v, 0.18, 2.0, 0.18);
    const b = seamArcPressure(u - 0.11, v + 0.03, 0.61, 3.0, 0.14);
    const c = seamArcPressure(u + 0.23, v - 0.04, 0.39, 1.5, 0.13);
    const aged = fbm(u * 1.17 + 0.09, v * 0.94 - 0.04, 51000, 4);
    return clamp((a * 0.36 + b * 0.32 + c * 0.24) * (0.72 + aged * 0.28), 0, 1);
  }

  function shelfCutPressure(u, v, compression, basin) {
    const latitudeShelf = Math.pow(Math.sin(clamp(v, 0, 1) * Math.PI), 0.75);
    const edgeMemoryA = seamArcPressure(u, v, 0.73, 4.0, 0.12);
    const edgeMemoryB = seamArcPressure(u + 0.19, v, 0.27, 2.5, 0.16);
    const boundaryTension = Math.abs(compression - basin);
    return clamp(
      edgeMemoryA * 0.28 +
        edgeMemoryB * 0.22 +
        smoothstep(0.08, 0.42, boundaryTension) * 0.32 +
        latitudeShelf * 0.18,
      0,
      1
    );
  }

  function classifyTectonics(field) {
    if (field.basinPressure > 0.72 && field.subsurfacePressure < 0.45) return "deep-basin-seed";
    if (field.ridgePressure > 0.68 && field.plateStress > 0.54) return "ridge-pressure-seed";
    if (field.scarPressure > 0.62 && field.ancientChannelCut > 0.46) return "ancient-cut-structure";
    if (field.shelfCutPressure > 0.64) return "buried-shelf-boundary";
    if (field.crustalCompression > 0.66) return "compressed-crust";
    if (field.depth > 0.64) return "old-deep-body";
    if (field.plateStress > 0.58) return "lateral-plate-stress";
    return "stable-pre-terrain-body";
  }

  function sampleTectonics(uInput, vInput, context = {}) {
    const input = normalizeSampleInput(uInput, vInput);
    const u = input.u;
    const v = input.v;

    const lat = Number.isFinite(context.lat) ? context.lat : latFromV(v);
    const lon = Number.isFinite(context.lon) ? context.lon : lonFromU(u);
    const point = vectorFromLatLon(lat, lon);

    const ancientNoise = fbm(u * 0.94 + 0.03, v * 1.08 - 0.02, 47000, 5);
    const deepNoise = fbm(u * 1.62 - 0.21, v * 1.31 + 0.14, 48000, 5);
    const fractureNoise = fbm(u * 2.26 + 0.17, v * 1.89 - 0.09, 49000, 4);

    const compression = weightedField(point, COMPRESSION_CENTERS);
    const basin = weightedField(point, BASIN_CENTERS);
    const ridge = weightedField(point, RIDGE_CENTERS);
    const scar = weightedField(point, SCAR_CENTERS);

    const plateArcA = seamArcPressure(u, v, 0.11, 2.0, 0.16);
    const plateArcB = seamArcPressure(u + 0.13, v - 0.02, 0.47, 3.0, 0.13);
    const plateArcC = seamArcPressure(u - 0.21, v + 0.05, 0.82, 1.5, 0.18);

    const plateStress = clamp(
      plateArcA * 0.34 +
        plateArcB * 0.3 +
        plateArcC * 0.2 +
        ridge * 0.18 +
        fractureNoise * 0.12,
      0,
      1
    );

    const crustalCompression = clamp(
      compression * 0.66 +
        ridge * 0.2 +
        plateStress * 0.2 +
        ancientNoise * 0.14 -
        basin * 0.16,
      0,
      1
    );

    const ridgePressure = clamp(
      ridge * 0.68 +
        plateStress * 0.26 +
        compression * 0.18 +
        deepNoise * 0.08,
      0,
      1
    );

    const basinPressure = clamp(
      basin * 0.72 +
        (1 - compression) * 0.14 +
        (1 - ridge) * 0.08 +
        deepNoise * 0.12,
      0,
      1
    );

    const scarPressure = clamp(
      scar * 0.58 +
        fractureNoise * 0.22 +
        plateStress * 0.14 +
        channelCutPressure(u, v) * 0.12,
      0,
      1
    );

    const ancientChannelCut = channelCutPressure(u, v);
    const shelfCut = shelfCutPressure(u, v, compression, basin);

    const depth = clamp(
      0.34 +
        ancientNoise * 0.18 +
        deepNoise * 0.16 +
        compression * 0.22 +
        basin * 0.12 +
        scarPressure * 0.08,
      0,
      1
    );

    const subsurfacePressure = clamp(
      depth * 0.32 +
        crustalCompression * 0.24 +
        plateStress * 0.18 +
        ridgePressure * 0.18 +
        scarPressure * 0.1 -
        basinPressure * 0.1,
      0,
      1
    );

    const buriedStructure = clamp(
      subsurfacePressure * 0.28 +
        crustalCompression * 0.2 +
        ridgePressure * 0.16 +
        basinPressure * 0.12 +
        scarPressure * 0.1 +
        ancientChannelCut * 0.08 +
        shelfCut * 0.06,
      0,
      1
    );

    const elevationInfluence = clamp(
      0.5 +
        crustalCompression * 0.24 +
        ridgePressure * 0.22 +
        subsurfacePressure * 0.16 -
        basinPressure * 0.25 -
        ancientChannelCut * 0.1 -
        shelfCut * 0.08 +
        (deepNoise - 0.5) * 0.08,
      0,
      1
    );

    const field = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      u,
      v,
      lat,
      lon,
      depth,
      subsurfacePressure,
      plateStress,
      crustalCompression,
      ridgePressure,
      basinPressure,
      scarPressure,
      ancientChannelCut,
      shelfCutPressure: shelfCut,
      buriedStructure,
      elevationInfluence,
      preTerrainDepthAuthorityLoaded: true,
      ownsElevation: false,
      ownsMaterialRendering: false,
      ownsAtmosphere: false,
      ownsHydrology: false,
      ownsFinalLandOcean: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    return Object.freeze({
      ...field,
      tectonicClass: classifyTectonics(field)
    });
  }

  function sample(u, v, context = {}) {
    return sampleTectonics(u, v, context);
  }

  function read(u, v, context = {}) {
    return sampleTectonics(u, v, context);
  }

  function sampleGrid(columns = 16, rows = 16) {
    const width = Math.max(1, Math.floor(columns));
    const height = Math.max(1, Math.floor(rows));
    const cells = [];

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        cells.push(sampleTectonics((x + 0.5) / width, (y + 0.5) / height));
      }
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      columns: width,
      rows: height,
      count: cells.length,
      cells: Object.freeze(cells)
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "pre-terrain-depth-tectonics",
      preTerrainDepthAuthorityLoaded: true,
      tectonicsBeforeElevation: true,
      numericStructuralAuthorityOnly: true,
      producesElevationInfluence: true,
      ownsElevation: false,
      ownsMaterialRendering: false,
      ownsAtmosphere: false,
      ownsHydrology: false,
      ownsFinalLandOcean: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    });
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleTectonics,
    sample,
    read,
    sampleGrid,
    getStatus
  });

  window.HEARTH_TECTONICS = api;
  window.HearthTectonics = api;
  window.HEARTH = window.HEARTH || {};
  window.HEARTH.tectonics = api;
  window.HEARTH_TECTONICS_RECEIPT = getStatus();

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.hearthTectonicsAuthorityLoaded = "true";
    document.documentElement.dataset.hearthTectonicsAuthorityContract = CONTRACT;
    document.documentElement.dataset.hearthTectonicsAuthorityReceipt = RECEIPT;
    document.documentElement.dataset.hearthPreTerrainDepthAuthorityLoaded = "true";
    document.documentElement.dataset.hearthTectonicsBeforeElevation = "true";
    document.documentElement.dataset.hearthTectonicsNumericStructuralAuthorityOnly = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.webgl = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();
