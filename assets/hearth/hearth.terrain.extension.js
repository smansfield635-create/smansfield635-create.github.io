// /assets/hearth/hearth.terrain.extension.js
// HEARTH_TERRAIN_EXTENSION_FINGERPRINT_AUTHORITY_TNT_v1
// Full-file replacement.
// Terrain-extension authority only.
// Purpose:
// - Define seven unique terrain fingerprints downstream of body-mass formation.
// - Do not own body-mass placement.
// - Do not own material palette.
// - Do not own runtime, controls, route, or canvas.
// - Provide terrain signals for assets to consume.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_TERRAIN_EXTENSION_FINGERPRINT_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_TERRAIN_EXTENSION_FINGERPRINT_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.hearth-terrain-extension-fingerprint-authority-v1";

  const TERRAIN_FINGERPRINTS = Object.freeze({
    "north-crown-mass": Object.freeze({
      id: 1,
      key: "north-crown-mass",
      name: "North Crown Mass",
      fingerprint: "fractured-polar-crown",
      features: [
        "glacier-mouths",
        "fjord-cuts",
        "polar-slate-ridges",
        "broken-ice-shelves",
        "cold-sea-channels"
      ]
    }),

    "equatorial-great-mass": Object.freeze({
      id: 2,
      key: "equatorial-great-mass",
      name: "Equatorial Great Mass",
      fingerprint: "rifted-habitable-continent",
      features: [
        "central-basin",
        "western-mountain-shoulder",
        "rift-corridor",
        "river-valley-potential",
        "torn-eastern-shelves"
      ]
    }),

    "northwest-temperate-mass": Object.freeze({
      id: 3,
      key: "northwest-temperate-mass",
      name: "Northwest Temperate Mass",
      fingerprint: "diagonal-temperate-highland",
      features: [
        "diagonal-mountain-spine",
        "highland-basin",
        "firm-western-coast",
        "soft-southeast-shelves",
        "older-stone-uplands"
      ]
    }),

    "northeast-broken-shelf-mass": Object.freeze({
      id: 4,
      key: "northeast-broken-shelf-mass",
      name: "Northeast Broken Shelf Mass",
      fingerprint: "fractured-shelf-archipelago",
      features: [
        "archipelago-fractures",
        "shelf-terraces",
        "shallow-bays",
        "broken-land-bridges",
        "turquoise-shelf-water"
      ]
    }),

    "southeast-warm-mass": Object.freeze({
      id: 5,
      key: "southeast-warm-mass",
      name: "Southeast Warm Mass",
      fingerprint: "warm-crescent-shelf",
      features: [
        "crescent-coastline",
        "wide-beaches",
        "shallow-continental-shelf",
        "warm-lowland-basin",
        "southern-stone-ridges"
      ]
    }),

    "southwest-ridge-mass": Object.freeze({
      id: 6,
      key: "southwest-ridge-mass",
      name: "Southwest Ridge Mass",
      fingerprint: "dark-tectonic-ridge-scar",
      features: [
        "tectonic-scar",
        "dark-mineral-ridges",
        "cliff-walls",
        "deep-water-dropoff",
        "sparse-beaches"
      ]
    }),

    "south-transitional-mass": Object.freeze({
      id: 7,
      key: "south-transitional-mass",
      name: "South Transitional Mass",
      fingerprint: "cold-storm-shelf-counterweight",
      features: [
        "storm-shelf",
        "cold-bays",
        "southern-ice-edge",
        "elongated-stone-shelf",
        "transitional-ridges"
      ]
    })
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
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
    const x = u * s;
    const y = v * s;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
  }

  function ridged(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.62;
    let scale = 6;

    for (let i = 0; i < 5; i += 1) {
      const n = noise(u, v, scale, seed + i * 79);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function faultLine(u, v, angle, offset, width) {
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const x = (u - 0.5) * ca - (v - 0.5) * sa;
    return Math.exp(-Math.pow(x - offset, 2) / Math.max(0.000001, width));
  }

  function sampleTerrain(u, v, base = {}) {
    const key = base.primaryMassKey || "";
    const massId = Number.isFinite(base.primaryMassId) ? base.primaryMassId : 0;
    const coast = clamp(base.coast || 0, 0, 1);
    const field = Number.isFinite(base.field) ? base.field : 0;
    const land = base.isLand === true;
    const ridge = ridged(u + massId * 0.037, v - massId * 0.041, 4000 + massId * 97);
    const bite = noise(u - massId * 0.061, v + massId * 0.083, 72, 5100 + massId * 131);
    const detail = noise(u + massId * 0.017, v - massId * 0.019, 144, 6200 + massId * 149);

    const common = {
      terrainContract: CONTRACT,
      terrainReceipt: RECEIPT,
      terrainFingerprint: TERRAIN_FINGERPRINTS[key]?.fingerprint || "ocean-or-unassigned",
      terrainFingerprintKey: key || "none",
      terrainFingerprintId: massId,
      fingerprintStrength: land ? clamp(0.35 + ridge * 0.45 + coast * 0.20, 0, 1) : 0,
      ridge: land ? ridge : 0,
      bite: land ? bite : 0,
      detail: land ? detail : 0,
      internalPressure: land ? smoothstep(0.02, 0.46, field) : 0,
      coastlinePressure: coast,
      shelfTerrace: !land ? clamp(coast * (0.38 + ridge * 0.62), 0, 1) : 0,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };

    if (!land) {
      return Object.freeze({
        ...common,
        glacierMouths: 0,
        fjordCuts: 0,
        riftCorridor: 0,
        basin: 0,
        riverValleyPotential: 0,
        diagonalSpine: 0,
        archipelagoFracture: 0,
        crescentShelf: 0,
        tectonicScar: 0,
        stormShelf: 0,
        cliffWalls: 0,
        deepWaterDropoff: clamp(coast * smoothstep(0.45, 0.92, ridge), 0, 1)
      });
    }

    switch (key) {
      case "north-crown-mass": {
        const prong = smoothstep(0.48, 0.94, ridged(u * 1.4 + 0.11, v * 1.8 - 0.18, 7101));
        const fjord = smoothstep(0.58, 0.96, bite) * coast;
        return Object.freeze({
          ...common,
          glacierMouths: clamp(fjord * 0.84 + prong * coast * 0.36, 0, 1),
          fjordCuts: clamp(fjord, 0, 1),
          polarSlateRidges: clamp(prong * 0.92, 0, 1),
          brokenIceShelves: clamp(coast * 0.78 + prong * 0.25, 0, 1),
          coldSeaChannels: clamp(coast * smoothstep(0.45, 0.88, detail), 0, 1),
          riftCorridor: 0,
          basin: 0,
          riverValleyPotential: 0,
          diagonalSpine: 0,
          archipelagoFracture: 0,
          crescentShelf: 0,
          tectonicScar: 0,
          stormShelf: 0,
          cliffWalls: clamp(prong * coast * 0.62, 0, 1),
          deepWaterDropoff: 0
        });
      }

      case "equatorial-great-mass": {
        const rift = faultLine(u, v, -0.58, -0.03, 0.012);
        const basin = smoothstep(0.42, 0.88, 1 - ridge) * smoothstep(0.08, 0.58, field);
        const westShoulder = smoothstep(0.18, 0.88, ridge) * smoothstep(0.18, 0.72, 1 - u);
        return Object.freeze({
          ...common,
          glacierMouths: 0,
          fjordCuts: 0,
          polarSlateRidges: 0,
          brokenIceShelves: 0,
          coldSeaChannels: 0,
          riftCorridor: clamp(rift * 0.88, 0, 1),
          basin: clamp(basin, 0, 1),
          westernMountainShoulder: clamp(westShoulder, 0, 1),
          riverValleyPotential: clamp(basin * smoothstep(0.36, 0.82, detail), 0, 1),
          tornEasternShelves: clamp(coast * smoothstep(0.46, 0.94, bite) * smoothstep(0.46, 0.92, u), 0, 1),
          diagonalSpine: 0,
          archipelagoFracture: 0,
          crescentShelf: 0,
          tectonicScar: 0,
          stormShelf: 0,
          cliffWalls: clamp(coast * ridge * 0.34, 0, 1),
          deepWaterDropoff: 0
        });
      }

      case "northwest-temperate-mass": {
        const spine = faultLine(u, v, 0.72, 0.02, 0.010);
        return Object.freeze({
          ...common,
          glacierMouths: 0,
          fjordCuts: 0,
          riftCorridor: 0,
          basin: clamp((1 - ridge) * smoothstep(0.16, 0.58, field) * 0.74, 0, 1),
          riverValleyPotential: clamp((1 - ridge) * detail * 0.62, 0, 1),
          diagonalSpine: clamp(spine * 0.92 + ridge * 0.22, 0, 1),
          firmWesternCoast: clamp(coast * smoothstep(0.55, 0.95, 1 - u), 0, 1),
          softSoutheastShelves: clamp(coast * smoothstep(0.48, 0.95, u) * smoothstep(0.44, 0.90, v), 0, 1),
          archipelagoFracture: 0,
          crescentShelf: 0,
          tectonicScar: 0,
          stormShelf: 0,
          cliffWalls: clamp(spine * coast * 0.48, 0, 1),
          deepWaterDropoff: 0
        });
      }

      case "northeast-broken-shelf-mass": {
        const fracture = smoothstep(0.52, 0.94, bite);
        const terrace = smoothstep(0.32, 0.86, ridge) * coast;
        return Object.freeze({
          ...common,
          glacierMouths: 0,
          fjordCuts: 0,
          riftCorridor: 0,
          basin: 0,
          riverValleyPotential: 0,
          diagonalSpine: 0,
          archipelagoFracture: clamp(fracture, 0, 1),
          shelfTerraces: clamp(terrace, 0, 1),
          shallowBays: clamp(coast * (0.45 + fracture * 0.55), 0, 1),
          brokenLandBridges: clamp(fracture * smoothstep(0.02, 0.32, field), 0, 1),
          crescentShelf: 0,
          tectonicScar: 0,
          stormShelf: 0,
          cliffWalls: clamp(coast * ridge * 0.20, 0, 1),
          deepWaterDropoff: 0
        });
      }

      case "southeast-warm-mass": {
        const crescent = faultLine(u, v, 0.30, 0.09, 0.026);
        return Object.freeze({
          ...common,
          glacierMouths: 0,
          fjordCuts: 0,
          riftCorridor: 0,
          basin: clamp((1 - ridge) * smoothstep(0.10, 0.60, field) * 0.66, 0, 1),
          riverValleyPotential: clamp((1 - ridge) * detail * 0.52, 0, 1),
          diagonalSpine: 0,
          archipelagoFracture: 0,
          crescentShelf: clamp(crescent * 0.82 + coast * 0.34, 0, 1),
          wideBeaches: clamp(coast * 0.88, 0, 1),
          warmLowlandBasin: clamp((1 - ridge) * 0.72, 0, 1),
          southernStoneRidges: clamp(ridge * smoothstep(0.55, 0.95, v), 0, 1),
          tectonicScar: 0,
          stormShelf: 0,
          cliffWalls: clamp(coast * ridge * 0.24, 0, 1),
          deepWaterDropoff: 0
        });
      }

      case "southwest-ridge-mass": {
        const scar = faultLine(u, v, -0.82, 0.00, 0.009);
        return Object.freeze({
          ...common,
          glacierMouths: 0,
          fjordCuts: 0,
          riftCorridor: 0,
          basin: clamp((1 - ridge) * smoothstep(0.16, 0.44, field) * 0.26, 0, 1),
          riverValleyPotential: 0,
          diagonalSpine: 0,
          archipelagoFracture: 0,
          crescentShelf: 0,
          tectonicScar: clamp(scar * 0.96 + ridge * 0.34, 0, 1),
          darkMineralRidges: clamp(ridge * 0.94, 0, 1),
          cliffWalls: clamp(coast * ridge * 0.86, 0, 1),
          deepWaterDropoff: clamp(coast * smoothstep(0.36, 0.82, ridge), 0, 1),
          sparseBeaches: clamp(coast * 0.18, 0, 1),
          stormShelf: 0
        });
      }

      case "south-transitional-mass": {
        const storm = smoothstep(0.38, 0.90, ridged(u * 1.2 - 0.11, v * 1.9 + 0.07, 8122));
        return Object.freeze({
          ...common,
          glacierMouths: 0,
          fjordCuts: clamp(coast * smoothstep(0.50, 0.92, bite) * 0.44, 0, 1),
          riftCorridor: 0,
          basin: 0,
          riverValleyPotential: 0,
          diagonalSpine: 0,
          archipelagoFracture: 0,
          crescentShelf: 0,
          tectonicScar: 0,
          stormShelf: clamp(storm * 0.84 + coast * 0.28, 0, 1),
          coldBays: clamp(coast * smoothstep(0.42, 0.88, detail), 0, 1),
          southernIceEdge: clamp(smoothstep(0.56, 0.96, v) * 0.82, 0, 1),
          transitionalRidges: clamp(ridge * 0.58, 0, 1),
          cliffWalls: clamp(coast * ridge * 0.42, 0, 1),
          deepWaterDropoff: 0
        });
      }

      default:
        return Object.freeze(common);
    }
  }

  function getFingerprint(key) {
    return TERRAIN_FINGERPRINTS[key] || null;
  }

  function getFingerprints() {
    return Object.freeze(
      Object.keys(TERRAIN_FINGERPRINTS).map((key) => TERRAIN_FINGERPRINTS[key])
    );
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "terrain-fingerprint-extension",
      terrainExtensionLoaded: true,
      terrainFingerprintCount: 7,
      eachBodyHasUniqueTerrain: true,
      ownsBodyMassPlacement: false,
      ownsMaterialPalette: false,
      runtimeTouched: false,
      controlsTouched: false,
      canvasTouched: false,
      routeTouched: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      fingerprints: getFingerprints()
    });
  }

  window.HEARTH_TERRAIN_EXTENSION = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleTerrain,
    getFingerprint,
    getFingerprints,
    getStatus
  });

  window.HEARTH_TERRAIN_EXTENSION_RECEIPT = getStatus();

  document.documentElement.dataset.hearthTerrainExtensionLoaded = "true";
  document.documentElement.dataset.hearthTerrainExtensionContract = CONTRACT;
  document.documentElement.dataset.hearthTerrainExtensionReceipt = RECEIPT;
  document.documentElement.dataset.hearthTerrainFingerprintCount = "7";
  document.documentElement.dataset.hearthEachBodyHasUniqueTerrain = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
