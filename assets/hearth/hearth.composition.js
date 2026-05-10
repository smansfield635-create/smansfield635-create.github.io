// /assets/hearth/hearth.composition.js
// HEARTH_COMPOSITION_PARENT_AUTHORITY_TNT_v2
// Full-file replacement.
// Parent composition authority only.
// Owns diamond/opal/mineral substrate, nine-to-one ratio, summit expense pressure.
// Does not own route, canvas, hydrology, terrain shape, grass, rivers, vegetation, or visual pass.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_COMPOSITION_PARENT_AUTHORITY_TNT_v2";
  const RECEIPT = "HEARTH_COMPOSITION_PARENT_AUTHORITY_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_DIAMOND_OPAL_SUMMIT_COMPOSITION_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-10.hearth-composition-parent-authority-v2";

  const RATIO = Object.freeze({
    structural: 9,
    exposedPrecious: 1,
    structuralShare: 0.9,
    exposedPreciousShare: 0.1,
    summitScale: 9,
    originScale: 1
  });

  const TONES = Object.freeze({
    diamond: [208, 235, 240],
    opal: [160, 210, 210],
    marble: [184, 180, 164],
    slate: [68, 76, 86],
    granite: [124, 123, 114],
    quartz: [196, 193, 180],
    platinum: [196, 198, 194],
    gold: [218, 176, 73],
    silver: [186, 192, 194],
    clay: [145, 94, 63],
    basalt: [43, 48, 56],
    stone: [96, 98, 92]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function mix(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
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

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
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

  function chooseWeighted(items, weights, selector) {
    const total = weights.reduce((sum, value) => sum + Math.max(0, value), 0);
    let cursor = selector * Math.max(0.000001, total);

    for (let i = 0; i < items.length; i += 1) {
      cursor -= Math.max(0, weights[i]);
      if (cursor <= 0) return items[i];
    }

    return items[items.length - 1];
  }

  function sampleComposition(u, v, context = {}) {
    const elevation = clamp(context.elevation || 0, 0, 1);
    const mountain = clamp(context.mountain || 0, 0, 1);
    const cliff = clamp(context.cliff || 0, 0, 1);
    const wonder = clamp(context.wonderPressure || 0, 0, 1);
    const mineralNoise = ridged(u * 1.5 + 0.07, v * 1.2 - 0.04, 130000, 5);
    const seamNoise = fbm(u * 2.1 - 0.13, v * 1.7 + 0.11, 131000, 5);

    const summitPressure = clamp(
      mineralNoise * 0.28 +
        seamNoise * 0.16 +
        elevation * 0.18 +
        mountain * 0.22 +
        cliff * 0.06 +
        wonder * 0.22,
      0,
      1
    );

    const summitLevel = clamp(Math.ceil(summitPressure * 9), 1, 9);
    const summitNormalized = summitLevel / 9;

    const structural = chooseWeighted(
      ["marble", "slate", "granite", "quartz", "basalt", "clay", "stone"],
      [
        0.55 + summitNormalized * 0.34,
        0.62,
        0.76 + summitNormalized * 0.24,
        0.34 + summitNormalized * 0.28,
        0.48,
        0.32 * (1 - summitNormalized),
        0.72
      ],
      fbm(u * 1.9, v * 1.4, 140000, 4)
    );

    const precious = chooseWeighted(
      ["diamond", "opal", "platinum", "gold", "silver", "quartz"],
      [
        0.36 + summitNormalized * 1.9,
        0.48 + summitNormalized * 1.35,
        0.05 + summitNormalized * 1.1,
        0.06 + summitNormalized * 0.95,
        0.16 + summitNormalized * 0.42,
        0.38
      ],
      fbm(u * 2.2 - 0.17, v * 1.8 + 0.12, 150000, 4)
    );

    const vein = smoothstep(0.66, 0.94, ridged(u * 3.0 + 0.13, v * 2.1 - 0.09, 160000, 4));
    const exposure = clamp(0.018 + summitNormalized * 0.055 + vein * 0.055 + wonder * 0.04, 0.012, 0.16);
    const tone = mix(TONES[structural] || TONES.stone, TONES[precious] || TONES.quartz, exposure);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      summitLevel,
      summitNormalized,
      summitPressure,
      structuralMaterial: structural,
      preciousMaterial: precious,
      exposure,
      tone,
      ratio: RATIO,
      diamondOpalDominantInterior: true,
      higherSummitHigherExpense: true,
      platinumGoldDiamondDensityIncreasesWithSummit: true,
      ownsRoute: false,
      ownsCanvas: false,
      ownsHydrology: false,
      ownsVegetation: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function tintTerrain(baseColor, composition, intensity = 0.08) {
    if (!composition || !Array.isArray(composition.tone)) return baseColor;
    return mix(baseColor, composition.tone, clamp(intensity + composition.exposure * 0.55, 0, 0.18));
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "composition-parent",
      nineToOneRatio: RATIO,
      diamondOpalDominantInterior: true,
      higherSummitHigherExpense: true,
      routeOwner: false,
      canvasOwner: false,
      hydrologyOwner: false,
      materialOwner: false,
      vegetationTopologyHeld: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_COMPOSITION = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleComposition,
    tintTerrain,
    getStatus
  });

  window.HEARTH_COMPOSITION_RECEIPT = getStatus();

  document.documentElement.dataset.hearthCompositionLoaded = "true";
  document.documentElement.dataset.hearthCompositionContract = CONTRACT;
  document.documentElement.dataset.hearthCompositionReceipt = RECEIPT;
  document.documentElement.dataset.hearthCompositionParentAuthority = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
