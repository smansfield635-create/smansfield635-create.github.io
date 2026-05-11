// /assets/audralia/audralia.landmap.js
// AUDRALIA_G1_LAYER_ONE_LANDMAP_RENEWAL_TNT_v1
// Full-file replacement.
// Layer One authority.
// Ocean mask first. Landmap second.
// Owns Audralia G1 ocean-dominant mask and coordinate classification.
// Does not render.
// Does not create lush surface.
// Does not authorize rivers, lakes, streams, or brooks.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_LAYER_ONE_LANDMAP_RENEWAL_TNT_v1";
  const RECEIPT = "AUDRALIA_G1_LAYER_ONE_LANDMAP_RENEWAL_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_256_LATTICE_LANDMAP_CLASSIFICATION_TNT_v2";
  const VERSION = "2026-05-10.audralia-g1-layer-one-landmap-renewal-v1";

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
    const uu = wrap01(Number.isFinite(u) ? u : 0);
    const vv = clamp(Number.isFinite(v) ? v : 0, 0, 1);
    const longitude = uu * 360 - 180;
    const latitude = 90 - vv * 180;

    const row = clamp(Math.floor(vv * 16) + 1, 1, 16);
    const column = clamp(Math.floor(uu * 16) + 1, 1, 16);
    const cell256 = (row - 1) * 16 + column;
    const cell64 = Math.floor((row - 1) / 2) * 8 + Math.floor((column - 1) / 2) + 1;
    const cell16 = Math.floor((row - 1) / 4) * 4 + Math.floor((column - 1) / 4) + 1;

    const absLat = Math.abs(latitude);
    let band = "temperate";
    if (absLat >= 78.75) band = "polar-cap";
    else if (absLat >= 67.5) band = "polar";
    else if (absLat >= 45) band = "cold-temperate";
    else if (absLat >= 22.5) band = "temperate";
    else if (absLat >= 11.25) band = "subtropical";
    else band = "equatorial";

    return Object.freeze({
      u: uu,
      v: vv,
      longitude,
      latitude,
      longitudeRadians: (longitude / 180) * Math.PI,
      latitudeRadians: (latitude / 180) * Math.PI,
      row,
      column,
      cell16,
      cell64,
      cell256,
      quadrant: `${latitude >= 0 ? "N" : "S"}${longitude >= 0 ? "E" : "W"}`,
      band,
      primarySummit: "Gratitude",
      internalSummit: BOOK_SUMMITS[(cell256 - 1) % BOOK_SUMMITS.length]
    });
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
    const lon = coord.longitudeRadians;
    const lat = coord.latitudeRadians;
    const absLatDegrees = Math.abs(coord.latitude);
    const absLatUnit = absLatDegrees / 90;

    const oceanBasin = fbm(uu * 0.84 - 0.23, vv * 0.72 + 0.11, 810000, 6);
    const deepOceanBias = fbm(uu * 1.18 + 0.31, vv * 0.94 - 0.19, 810700, 5);
    const continentalSeed = fbm(uu * 0.64 + 0.11, vv * 0.58 - 0.07, 1700000, 6);
    const landMassSeed = fbm(uu * 0.96 - 0.21, vv * 0.86 + 0.14, 1700500, 6);
    const southernSeed = fbm(uu * 0.82 + 0.37, vv * 1.04 - 0.28, 1700600, 5);
    const islandChain = ridged(uu * 2.08 - 0.13, vv * 1.62 + 0.08, 1701000, 5);
    const fracture = ridged(uu * 3.1 + 0.2, vv * 2.42 - 0.14, 1702000, 4);
    const interiorBreak = fbm(uu * 1.72 + 0.18, vv * 1.38 - 0.2, 1703500, 5);

    const plateArc =
      Math.sin(lon * 1.02 + Math.cos(lat * 1.35) * 0.52) * 0.1 +
      Math.cos(lon * 0.58 - Math.sin(lat * 1.12) * 0.46) * 0.08;

    const shelfPressure = ridged(uu * 2.28, vv * 1.72, 212000, 5);
    const basinPressure = 1 - fbm(uu * 1.82, vv * 1.44, 213000, 5);
    const highlandPressure = ridged(uu * 1.52, vv * 1.18, 510000, 5);
    const mountainPressure = ridged(uu * 2.4 + 0.17, vv * 1.85 - 0.09, 520000, 5);
    const icePressure = ridged(uu * 5.2 - 0.13, vv * 4.4 + 0.08, 530000, 4);

    const polarRestraint = smoothstep(0.72, 1, absLatUnit) * 0.13;
    const oceanDominance = oceanBasin * 0.32 + deepOceanBias * 0.2 + 0.16;

    const landPotential = clamp(
      continentalSeed * 0.27 +
        landMassSeed * 0.25 +
        southernSeed * 0.12 +
        islandChain * 0.11 +
        fracture * 0.07 +
        plateArc +
        0.08 -
        oceanDominance -
        polarRestraint,
      0,
      1
    );

    const islandPotential = clamp(
      islandChain * 0.5 +
        fracture * 0.22 +
        landMassSeed * 0.12 -
        deepOceanBias * 0.18 -
        polarRestraint * 0.45,
      0,
      1
    );

    const separationCut = clamp(
      smoothstep(0.62, 0.9, interiorBreak * 0.5 + deepOceanBias * 0.3 + fracture * 0.18) *
        (1 - smoothstep(0.62, 0.9, landPotential + continentalSeed * 0.18)),
      0,
      1
    );

    const exposure = clamp(
      Math.max(landPotential, islandPotential * 0.78) - separationCut * 0.11,
      0,
      1
    );

    const validLand = exposure > 0.485;
    const validIsland = !validLand && islandPotential > 0.62 && deepOceanBias < 0.74 && absLatDegrees < 72;
    const provisionalLand = validLand || validIsland;

    const continentalContext = clamp(
      landPotential * 0.48 +
        continentalSeed * 0.18 +
        landMassSeed * 0.16 +
        islandPotential * 0.08,
      0,
      1
    );

    const shelf = clamp(
      shelfPressure * 0.45 +
        smoothstep(0.38, 0.56, exposure) * 0.34 +
        islandPotential * 0.1 -
        deepOceanBias * 0.08,
      0,
      1
    );

    const coastBand =
      smoothstep(0.425, 0.505, exposure) *
      (1 - smoothstep(0.545, 0.69, exposure));

    const beachEdge = clamp(coastBand * smoothstep(0.32, 0.82, shelf), 0, 1);

    const polarZone = absLatDegrees >= 67.5;
    const polarCap = absLatDegrees >= 78.75;
    const polarIce = polarZone && (icePressure > 0.56 || polarCap) && (provisionalLand || continentalContext > 0.44);

    const enclosedInlandHold =
      !provisionalLand &&
      continentalContext > 0.57 &&
      deepOceanBias < 0.66 &&
      (highlandPressure > 0.46 || mountainPressure > 0.46 || absLatDegrees > 45);

    const iceHighland = polarIce || (enclosedInlandHold && (absLatDegrees > 45 || icePressure > 0.55));
    const mountainHighland = !iceHighland && enclosedInlandHold;

    const isLand = provisionalLand || iceHighland || mountainHighland;
    const isSeaConnectedWater = !isLand && continentalContext < 0.58;
    const isShelf = !isLand && shelf > 0.5 && isSeaConnectedWater;
    const isBeach = !isLand && beachEdge > 0.16 && isSeaConnectedWater;
    const isOcean = !isLand && !isShelf && !isBeach;

    const isCoast = isLand && exposure > 0.43 && exposure < 0.62;
    const isIsland = isLand && validIsland;
    const isInland = isLand && !isCoast && !isIsland;
    const isBasin = isInland && basinPressure > 0.6 && !iceHighland;
    const isHighland = isLand && (highlandPressure > 0.63 || mountainHighland);
    const isIceHighland = isLand && iceHighland;
    const isPolarIce = isIceHighland && polarZone;

    const hydrologyHeld = isBasin || enclosedInlandHold;

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
      version: VERSION,

      ...coord,

      primarySummit: "Gratitude",
      internalSummit: coord.internalSummit,

      oceanMaskFirst: true,
      layerOneLandmap: true,
      layerTwoLushSurfaceAllowedOnlyOnValidLand: true,

      landPotential,
      islandPotential,
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

      isSeaConnectedWater,
      isInlandWaterCandidate: enclosedInlandHold,
      reclassAsHighlandIce: iceHighland,
      reclassAsMountain: mountainHighland,
      reclassAsPolarIce: isPolarIce,
      hydrologyHeld,

      beachEligible: isBeach || isCoast,
      mountainEligible: isHighland || isIceHighland || isPolarIce || mountainHighland,
      lushSurfaceEligible: isLand && !isOcean && !isShelf && !isBeach,
      groundcoverEligible: isLand && !isPolarIce && !isIceHighland,
      lakeEligible: false,
      riverEligible: false,

      stableFootprint: true,
      oceanDominantMask: true,
      canvasOwnsFootprint: false,
      landSurfaceCanCreateLand: false,
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
    if (window.AUDRALIA_LATTICE256?.getCellById) {
      const cell = window.AUDRALIA_LATTICE256.getCellById(cell256);
      return sampleLandmap((cell.longitudeCenter + 180) / 360, (90 - cell.latitudeCenter) / 180);
    }

    const id = clamp(Math.floor(Number(cell256) || 1), 1, 256);
    const row = Math.floor((id - 1) / 16) + 1;
    const column = ((id - 1) % 16) + 1;
    const latCenter = 90 - (row - 0.5) * 11.25;
    const lonCenter = -180 + (column - 0.5) * 22.5;
    return sampleLandmap((lonCenter + 180) / 360, (90 - latCenter) / 180);
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-g1-layer-one-landmap-renewal",
      layer: 1,
      oceanMaskFirst: true,
      ownsOceanDominantMask: true,
      ownsFootprintClassification: true,
      consumesLattice256: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
      hydrologyAuthored: false,
      trueWaterSeaConnectedOnly: true,
      inlandWaterReclassified: true,
      polarFanArtifactsReclassified: true,
      canvasOwnsFootprint: false,
      landSurfaceCanCreateLand: false,
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
  document.documentElement.dataset.audraliaLayerOneLandmapRenewal = "true";
  document.documentElement.dataset.audraliaOceanMaskFirst = "true";
  document.documentElement.dataset.audraliaOceanDominantMask = "true";
  document.documentElement.dataset.audraliaHydrologyAuthored = "false";
  document.documentElement.dataset.audraliaTrueWaterSeaConnectedOnly = "true";
  document.documentElement.dataset.audraliaInlandWaterReclassified = "true";
  document.documentElement.dataset.audraliaPolarFanArtifactsReclassified = "true";
  document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
  document.documentElement.dataset.audraliaLandSurfaceCanCreateLand = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
