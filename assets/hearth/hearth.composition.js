// /assets/hearth/hearth.composition.js
// HEARTH_DIAMOND_OPAL_SUMMIT_COMPOSITION_AUTHORITY_TNT_v1
// Full-file replacement / new file.
// Purpose:
// - Add Hearth composition authority beneath visible terrain.
// - Define diamond + opal as dominant deep planetary composition.
// - Define marble, slate, granite, stone, clay, dirt, sand, gold, silver, platinum, and precious mineral abundance.
// - Bind nine-to-one composition logic.
// - Higher summit = more expensive environment = higher diamond/opal/platinum/gold density.
// - This file does not render trees, bushes, forest canopy, animals, or vegetation topology.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAMOND_OPAL_SUMMIT_COMPOSITION_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_DIAMOND_OPAL_SUMMIT_COMPOSITION_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.hearth-diamond-opal-summit-composition-v1";

  const TAU = Math.PI * 2;

  const NINE_TO_ONE_RATIO = Object.freeze({
    structuralRatio: 9,
    preciousExposureRatio: 1,
    structuralShare: 0.9,
    preciousSurfaceExposureShare: 0.1,
    summitScale: 9,
    originScale: 1
  });

  const DEEP_PLANETARY_SIGNATURE = Object.freeze({
    diamond: 0.42,
    opal: 0.28,
    marble: 0.08,
    slate: 0.06,
    granite: 0.06,
    quartz: 0.04,
    platinum: 0.025,
    gold: 0.02,
    silver: 0.015,
    tracePreciousMinerals: 0.02
  });

  const STRUCTURAL_MATERIALS = Object.freeze([
    "marble",
    "slate",
    "granite",
    "quartzite",
    "basalt",
    "limestone",
    "sandstone",
    "clay",
    "soil",
    "sand",
    "rock"
  ]);

  const PRECIOUS_MATERIALS = Object.freeze([
    "diamond",
    "opal",
    "platinum",
    "gold",
    "silver",
    "quartz",
    "sapphire",
    "emerald",
    "ruby",
    "trace-precious-minerals"
  ]);

  const MATERIAL_TONES = Object.freeze({
    marble: [186, 182, 168],
    slate: [70, 78, 88],
    granite: [122, 120, 112],
    quartzite: [164, 159, 145],
    basalt: [45, 50, 58],
    limestone: [174, 166, 134],
    sandstone: [173, 139, 88],
    clay: [144, 92, 62],
    soil: [102, 82, 54],
    sand: [196, 171, 108],
    rock: [96, 98, 92],

    diamond: [210, 235, 240],
    opal: [166, 211, 211],
    platinum: [196, 198, 194],
    gold: [218, 176, 73],
    silver: [186, 192, 194],
    quartz: [198, 196, 184],
    sapphire: [62, 86, 148],
    emerald: [48, 134, 86],
    ruby: [142, 50, 62],
    "trace-precious-minerals": [151, 128, 112]
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

  function mix(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
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

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
  }

  function fbm(u, v, seed, octaves = 6) {
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

  function ridged(u, v, seed, octaves = 6) {
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

  function chooseWeighted(items, weights, selector) {
    const total = weights.reduce((sum, value) => sum + Math.max(0, value), 0);
    let cursor = selector * Math.max(0.000001, total);

    for (let i = 0; i < items.length; i += 1) {
      cursor -= Math.max(0, weights[i]);
      if (cursor <= 0) return items[i];
    }

    return items[items.length - 1];
  }

  function summitLevelFromPressure(pressure) {
    return clamp(Math.ceil(clamp(pressure, 0, 0.999999) * 9), 1, 9);
  }

  function sampleSummitPressure(u, v, context = {}) {
    const elevation = clamp(context.elevation || context.elevationPressure || 0, 0, 1);
    const ridge = clamp(context.ridge || context.mountain || context.mountainPressure || 0, 0, 1);
    const cliff = clamp(context.cliff || context.cliffPressure || 0, 0, 1);
    const deepPressure = ridged(u * 1.4 + 0.09, v * 1.2 - 0.07, 130000, 6);
    const seamPressure = fbm(u * 2.1 - 0.14, v * 1.7 + 0.11, 131000, 5);

    return clamp(
      deepPressure * 0.38 +
        seamPressure * 0.18 +
        elevation * 0.2 +
        ridge * 0.18 +
        cliff * 0.06,
      0,
      1
    );
  }

  function structuralMaterial(u, v, summitLevel) {
    const selector = fbm(u * 1.7 + 0.13, v * 1.3 - 0.09, 140000, 5);
    const high = summitLevel / 9;

    return chooseWeighted(
      STRUCTURAL_MATERIALS,
      [
        0.72 + high * 0.18, // marble
        0.76,               // slate
        0.88 + high * 0.16, // granite
        0.42 + high * 0.22, // quartzite
        0.52,               // basalt
        0.44,               // limestone
        0.38,               // sandstone
        0.36 * (1 - high),  // clay
        0.32 * (1 - high),  // soil
        0.28 * (1 - high),  // sand
        0.62                // rock
      ],
      selector
    );
  }

  function preciousMaterial(u, v, summitLevel) {
    const selector = fbm(u * 2.3 - 0.17, v * 1.9 + 0.12, 150000, 5);
    const high = summitLevel / 9;

    return chooseWeighted(
      PRECIOUS_MATERIALS,
      [
        0.52 + high * 1.85, // diamond
        0.72 + high * 1.35, // opal
        0.08 + high * 1.2,  // platinum
        0.1 + high * 1.0,   // gold
        0.18 + high * 0.48, // silver
        0.38,               // quartz
        0.05 + high * 0.18, // sapphire
        0.05 + high * 0.16, // emerald
        0.04 + high * 0.14, // ruby
        0.24                // trace
      ],
      selector
    );
  }

  function sampleComposition(u, v, context = {}) {
    const pressure = sampleSummitPressure(u, v, context);
    const summitLevel = summitLevelFromPressure(pressure);
    const summitNormalized = summitLevel / 9;

    const structural = structuralMaterial(u, v, summitLevel);
    const precious = preciousMaterial(u, v, summitLevel);

    const seam = ridged(u * 2.8 + 0.21, v * 2.1 - 0.18, 160000, 5);
    const inlay = smoothstep(0.58, 0.94, seam) * smoothstep(0.18, 1, summitNormalized);
    const exposedPreciousShare = clamp(
      NINE_TO_ONE_RATIO.preciousSurfaceExposureShare *
        (0.35 + summitNormalized * 1.15) *
        (0.55 + inlay * 0.85),
      0.02,
      0.32
    );

    const structuralShare = clamp(1 - exposedPreciousShare, 0.68, 0.98);
    const expenseIndex = clamp(
      summitNormalized * 0.55 +
        inlay * 0.25 +
        (precious === "diamond" ? 0.12 : 0) +
        (precious === "platinum" ? 0.1 : 0) +
        (precious === "gold" ? 0.08 : 0) +
        (precious === "opal" ? 0.06 : 0),
      0,
      1
    );

    const structuralTone = MATERIAL_TONES[structural] || MATERIAL_TONES.rock;
    const preciousTone = MATERIAL_TONES[precious] || MATERIAL_TONES["trace-precious-minerals"];
    const inlayTone = mix(structuralTone, preciousTone, exposedPreciousShare);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      ratio: NINE_TO_ONE_RATIO,
      deepPlanetarySignature: DEEP_PLANETARY_SIGNATURE,

      summitLevel,
      summitNormalized,
      summitPressure: pressure,
      expenseIndex,

      structuralMaterial: structural,
      preciousMaterial: precious,
      primaryInlay: precious === "diamond" || precious === "opal" ? precious : summitLevel >= 7 ? "diamond-opal-inlay" : "mineral-inlay",

      structuralShare,
      preciousSurfaceExposureShare: exposedPreciousShare,
      diamondOpalDominantInterior: true,

      marbleSlateGraniteAbundant: true,
      platinumGoldSilverAbundant: summitLevel >= 6,
      diamondsAbundant: summitLevel >= 7,
      opalAbundant: summitLevel >= 5,

      seamPressure: seam,
      inlayExposure: inlay,
      tone: inlayTone,

      ownsVisibleTerrainShape: false,
      ownsGrass: false,
      ownsTrees: false,
      ownsBushes: false,
      ownsForestCanopy: false,
      ownsAnimals: false,
      ownsRoute: false,
      ownsCanvas: false,

      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function tintTerrainColor(baseColor, composition, intensity = 0.12) {
    const safeBase = Array.isArray(baseColor) ? baseColor : [110, 118, 90];
    const tone = composition && Array.isArray(composition.tone) ? composition.tone : MATERIAL_TONES.rock;
    const summitBoost = composition ? composition.summitNormalized * 0.06 : 0;
    const inlayBoost = composition ? composition.inlayExposure * 0.08 : 0;

    return mix(safeBase, tone, clamp(intensity + summitBoost + inlayBoost, 0, 0.28));
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "hearth-composition",
      compositionFileAdded: true,
      nineToOneRatio: NINE_TO_ONE_RATIO,
      diamondOpalDominantInterior: true,
      marbleSlateGraniteAbundant: true,
      platinumGoldSilverAbundantBySummit: true,
      higherSummitHigherExpense: true,
      terrainOnlyStageCompatible: true,
      vegetationTopologyHeld: true,
      ownsVisibleTerrainShape: false,
      ownsGrass: false,
      ownsTrees: false,
      ownsBushes: false,
      ownsForestCanopy: false,
      ownsAnimals: false,
      ownsRoute: false,
      ownsCanvas: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_COMPOSITION = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    ratio: NINE_TO_ONE_RATIO,
    deepPlanetarySignature: DEEP_PLANETARY_SIGNATURE,
    sampleComposition,
    tintTerrainColor,
    getStatus
  });

  window.HEARTH_COMPOSITION_RECEIPT = getStatus();

  document.documentElement.dataset.hearthCompositionLoaded = "true";
  document.documentElement.dataset.hearthCompositionContract = CONTRACT;
  document.documentElement.dataset.hearthCompositionReceipt = RECEIPT;
  document.documentElement.dataset.hearthCompositionNineToOne = "true";
  document.documentElement.dataset.hearthDiamondOpalDominantInterior = "true";
  document.documentElement.dataset.hearthHigherSummitHigherExpense = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
