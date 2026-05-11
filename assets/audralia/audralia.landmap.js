// /assets/audralia/audralia.landmap.js
// AUDRALIA_G1_256_LATTICE_LANDMAP_CLASSIFICATION_TNT_v2
// Full-file replacement.
// Landmap classification authority.
// Consumes /assets/audralia/audralia.lattice256.js when present.
// Owns accepted Audralia G1 land/water footprint classification.
// Reclassifies inland water-looking pockets as highland / mountain / ice until hydrology is authored.
// Converts polar fan artifacts into ice/highland.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_256_LATTICE_LANDMAP_CLASSIFICATION_TNT_v2";
  const RECEIPT = "AUDRALIA_G1_256_LATTICE_LANDMAP_CLASSIFICATION_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_COORDINATE_LANDMAP_AUTHORITY_TNT_v1";
  const LATTICE_CONTRACT = "AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-10.audralia-g1-256-lattice-landmap-classification-v2";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function hash(x, y, seed) {
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
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

    const a = hash(((x0 % s) + s) % s, y0, seed);
    const b = hash(((x1 % s) + s) % s, y0, seed);
    const c = hash(((x0 % s) + s) % s, y1, seed);
    const d = hash(((x1 % s) + s) % s, y1, seed);

    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridged(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.62;
    let scale = 6.5;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function fallbackCoordinates(u, v) {
    const uu = wrap01(u);
    const vv = clamp(v, 0, 1);
    const longitude = uu * 360 - 180;
    const latitude = 90 - vv * 180;
    const row = clamp(Math.floor(vv * 16) + 1, 1, 16);
    const column = clamp(Math.floor(uu * 16) + 1, 1, 16);
    const cell256 = (row - 1) * 16 + column;

    const abs = Math.abs(latitude);
    let band = "temperate";
    if (abs >= 78.75) band = "polar-cap";
    else if (abs >= 67.5) band = "polar";
    else if (abs >= 45) band = "cold-temperate";
    else if (abs >= 22.5) band = "temperate";
    else if (abs >= 11.25) band = "subtropical";
    else band = "equatorial";

    const summits = ["Gratitude", "Generosity", "Dependability", "Accountability", "Forgiveness", "Humility", "Self-Control", "Patience", "Purity"];

    return {
      u: uu,
      v: vv,
      longitude,
      latitude,
      longitudeRadians: (longitude / 180) * Math.PI,
      latitudeRadians: (latitude / 180) * Math.PI,
      row,
      column,
      cell16: Math.floor((row - 1) / 4) * 4 + Math.floor((column - 1) / 4) + 1,
      cell64: Math.floor((row - 1) / 2) * 8 + Math.floor((column - 1) / 2) + 1,
      cell256,
      quadrant: `${latitude >= 0 ? "N" : "S"}${longitude >= 0 ? "E" : "W"}`,
      band,
      primarySummit: "Gratitude",
      internalSummit: summits[(cell256 - 1) % summits.length]
    };
  }

  function coordinatesFromUV(u, v) {
    if (window.AUDRALIA_LATTICE256?.coordinatesFromUV) {
      return window.AUDRALIA_LATTICE256.coordinatesFromUV(u, v);
    }
    return fallbackCoordinates(u, v);
  }

  function sampleLandmap(u, v) {
    const coord = coordinatesFromUV(u, v);
    const uu = coord.u;
    const vv = coord.v;
    const latRad = coord.latitudeRadians;
    const lonRad = coord.longitudeRadians;
    const absLat = Math.abs(coord.latitude);

    const continentalMemory = fbm(uu * 0.62 + 0.11, vv * 0.56 - 0.07, 1700000, 6);
    const mediumMass = fbm(uu * 0.92 - 0.21, vv * 0.82 + 0.14, 1700500, 6);
    const southernMass = fbm(uu * 0.78 + 0.37, vv * 1.02 - 0.28, 1700600, 5);
    const islandChain = ridged(uu * 2.0 - 0.13, vv * 1.55 + 0.08, 1701000, 5);
    const brokenCoast = ridged(uu * 3.1 + 0.2, vv * 2.42 - 0.14, 1702000, 4);
    const oceanBasin = fbm(uu * 1.06 - 0.22, vv * 0.86 + 0.15, 1703000, 5);
    const interiorBreak = fbm(uu * 1.62 + 0.18, vv * 1.34 - 0.2, 1703500, 5);

    const plateArc =
      Math.sin(lonRad * 1.02 + Math.cos(latRad * 1.35) * 0.52) * 0.12 +
      Math.cos(lonRad * 0.58 - Math.sin(latRad * 1.12) * 0.46) * 0.1;

    const landEligibility = ridged(uu * 1.5, vv * 1.2, 211000, 5);
    const islandEligibility = ridged(uu * 2.6, vv * 2.0, 214000, 4);
    const shelfPressure = ridged(uu * 2.2, vv * 1.7, 212000, 5);
    const basinPressure = 1 - fbm(uu * 1.8, vv * 1.4, 213000, 5);
    const highlandPressure = ridged(uu * 1.52, vv * 1.18, 510000, 5);
    const mountainPressure = ridged(uu * 2.4 + 0.17, vv * 1.85 - 0.09, 520000, 5);
    const icePressure = ridged(uu * 5.2 - 0.13, vv * 4.4 + 0.08, 530000, 4);

    const latitudeRestraint = Math.abs(latRad) / (Math.PI / 2);

    const macroLand = clamp(
      continentalMemory * 0.3 +
        mediumMass * 0.25 +
        southernMass * 0.13 +
        landEligibility * 0.42 +
        plateArc * 0.08 -
        oceanBasin * 0.09 -
        latitudeRestraint * 0.03,
      0,
      1
    );

    const separationCut = clamp(
      smoothstep(0.62, 0.9, interiorBreak * 0.5 + oceanBasin * 0.32 + brokenCoast * 0.18) *
        (1 - smoothstep(0.62, 0.9, macroLand + landEligibility * 0.15)),
      0,
      1
    );

    const landSignal = clamp(
      macroLand * 0.92 +
        islandEligibility * 0.08 -
        separationCut * 0.12 -
        0.035,
      0,
      1
    );

    const islandSignal = smoothstep(
      0.52,
      0.84,
      islandChain * 0.5 +
        brokenCoast * 0.24 +
        islandEligibility * 0.22 +
        mediumMass * 0.08 -
        oceanBasin * 0.045
    );

    const exposure = clamp(Math.max(landSignal, islandSignal * 0.86), 0, 1);

    const shelf = clamp(
      shelfPressure * 0.5 +
        smoothstep(0.34, 0.58, landSignal) * 0.3 +
        islandSignal * 0.14,
      0,
      1
    );

    const continentalContext = clamp(
      macroLand * 0.48 +
        landEligibility * 0.22 +
        mediumMass * 0.14 +
        continentalMemory * 0.12 +
        islandSignal * 0.08,
      0,
      1
    );

    const coastBand =
      smoothstep(0.365, 0.49, exposure) *
      (1 - smoothstep(0.505, 0.64, exposure));

    const beachEdge = clamp(coastBand * smoothstep(0.28, 0.78, shelf), 0, 1);

    const polarZone = absLat >= 67.5;
    const polarCap = absLat >= 78.75;

    const land = exposure > 0.405;
    const shelfWater = !land && shelf > 0.48 && continentalContext < 0.74;
    const seaConnectedWater = !land && continentalContext < 0.62;
    const inlandWaterCandidate = !land && continentalContext >= 0.62;
    const polarFanArtifact = polarZone && (icePressure > 0.48 || inlandWaterCandidate || exposure > 0.32);

    const reclassAsHighlandIce =
      polarFanArtifact ||
      (inlandWaterCandidate && (highlandPressure > 0.45 || mountainPressure > 0.45 || absLat > 45));

    const reclassAsMountain =
      !reclassAsHighlandIce &&
      inlandWaterCandidate &&
      (mountainPressure > 0.5 || highlandPressure > 0.56);

    const isLand = land || reclassAsHighlandIce || reclassAsMountain;
    const isBeach = !isLand && beachEdge > 0.14 && seaConnectedWater;
    const isShelf = !isLand && !isBeach && shelfWater;
    const isOcean = !isLand && !isBeach && !isShelf;

    const isCoast = isLand && exposure > 0.36 && exposure < 0.58;
    const isIsland = isLand && islandSignal > landSignal && islandSignal > 0.58;
    const isInland = isLand && exposure >= 0.58;
    const isBasin = isInland && basinPressure > 0.58 && !reclassAsHighlandIce;
    const isHighland = isLand && (highlandPressure > 0.62 || reclassAsMountain);
    const isIceHighland = isLand && reclassAsHighlandIce;
    const isPolarIce = polarZone && isIceHighland;
    const hydrologyHeld = inlandWaterCandidate || isBasin;

    let topology = "ocean";
    if (isPolarIce) topology = "polar";
    else if (isIceHighland) topology = "highland";
    else if (isHighland) topology = "highland";
    else if (isBasin) topology = "basin";
    else if (isInland) topology = "inland";
    else if (isIsland) topology = "island";
    else if (isCoast) topology = "coast";
    else if (isBeach) topology = "beach-edge";
    else if (isShelf) topology = "shelf";

    let elevation = "sea";
    if (isPolarIce) elevation = "ice-cap";
    else if (isIceHighland) elevation = "ice-highland";
    else if (isHighland) elevation = "mountain";
    else if (isBasin) elevation = "raised-basin";
    else if (isInland || isIsland || isCoast) elevation = "raised-land";
    else if (isBeach) elevation = "sea-level-coast";
    else if (isShelf) elevation = "shelf";

    let terrainClass = "ocean";
    if (isPolarIce) terrainClass = "polar-ice";
    else if (isIceHighland) terrainClass = "ice-highland";
    else if (isHighland) terrainClass = "mountain-highland";
    else if (isBasin) terrainClass = "basin-highland";
    else if (isInland) terrainClass = "inland";
    else if (isIsland) terrainClass = "island";
    else if (isCoast) terrainClass = "coast";
    else if (isBeach) terrainClass = "beach";
    else if (isShelf) terrainClass = "shelf";

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      latticeContract: LATTICE_CONTRACT,
      ...coord,

      primarySummit: "Gratitude",
      internalSummit: coord.internalSummit,

      landSignal,
      islandSignal,
      exposure,
      shelf,
      beachEdge,
      continentalContext,
      basinPressure,
      highlandPressure,
      mountainPressure,
      icePressure,
      separationCut,

      topology,
      elevation,
      terrainClass,

      isLand,
      isOcean,
      isShelf,
      isBeach,
      isCoast,
      isIsland,
      isInland,
      isBasin,
      isHighland,
      isIceHighland,
      isPolarIce,

      isSeaConnectedWater: seaConnectedWater || isShelf || isBeach,
      isInlandWaterCandidate: inlandWaterCandidate,
      reclassAsHighlandIce,
      reclassAsMountain,
      reclassAsPolarIce: isPolarIce,
      hydrologyHeld,

      beachEligible: isBeach || isCoast,
      mountainEligible: isHighland || isIceHighland || isPolarIce || reclassAsMountain,
      groundcoverEligible: isLand && !isPolarIce && !isIceHighland,
      lakeEligible: false,
      riverEligible: false,

      stableFootprint: true,
      canvasOwnsFootprint: false,
      beachesCanCreateLand: false,
      mountainsCanCreateLand: false,
      groundcoverCanCreateLand: false,
      hydrologyAuthored: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getCellSummary(cell256) {
    const cell = window.AUDRALIA_LATTICE256?.getCellById
      ? window.AUDRALIA_LATTICE256.getCellById(cell256)
      : null;

    const lat = cell ? cell.latitudeCenter : 0;
    const lon = cell ? cell.longitudeCenter : 0;
    const u = (lon + 180) / 360;
    const v = (90 - lat) / 180;

    return sampleLandmap(u, v);
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      latticeContract: LATTICE_CONTRACT,
      version: VERSION,
      authority: "audralia-g1-256-lattice-landmap-classification",
      ownsFootprintClassification: true,
      consumesLattice256: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
      hydrologyAuthored: false,
      trueWaterSeaConnectedOnly: true,
      inlandWaterReclassified: true,
      polarFanArtifactsReclassified: true,
      canvasOwnsFootprint: false,
      beachesCanCreateLand: false,
      mountainsCanCreateLand: false,
      groundcoverCanCreateLand: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_LANDMAP = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    latticeContract: LATTICE_CONTRACT,
    version: VERSION,
    sampleLandmap,
    getCellSummary,
    coordinatesFromUV,
    getStatus
  });

  window.AUDRALIA_LANDMAP_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaLandmapLoaded = "true";
  document.documentElement.dataset.audraliaLandmapContract = CONTRACT;
  document.documentElement.dataset.audraliaLandmapReceipt = RECEIPT;
  document.documentElement.dataset.audraliaLandmapConsumesLattice256 = String(Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV));
  document.documentElement.dataset.audraliaHydrologyAuthored = "false";
  document.documentElement.dataset.audraliaTrueWaterSeaConnectedOnly = "true";
  document.documentElement.dataset.audraliaInlandWaterReclassified = "true";
  document.documentElement.dataset.audraliaPolarFanArtifactsReclassified = "true";
  document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
  document.documentElement.dataset.audraliaBeachesCanCreateLand = "false";
  document.documentElement.dataset.audraliaMountainsCanCreateLand = "false";
  document.documentElement.dataset.audraliaGroundcoverCanCreateLand = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
