// /assets/audralia/audralia.land.surface.js
// AUDRALIA_G1_LAYER_TWO_LUSH_LAND_SURFACE_TNT_v1
// New file.
// Layer Two authority.
// Lush land surface template only.
// Applies only where Layer One Landmap authorizes valid land.
// Does not create land.
// Does not erase ocean.
// Does not authorize lakes, rivers, streams, or brooks.
// No trees. No bushes. No forest canopy.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_LAYER_TWO_LUSH_LAND_SURFACE_TNT_v1";
  const RECEIPT = "AUDRALIA_G1_LAYER_TWO_LUSH_LAND_SURFACE_RECEIPT_v1";
  const TEMPLATE_CAPTURE = "AUDRALIA_G1_LUSH_LAND_SURFACE_TEMPLATE_CAPTURE_v1";
  const VERSION = "2026-05-10.audralia-g1-layer-two-lush-land-surface-v1";

  const COLORS = Object.freeze({
    lushBase: [93, 132, 77],
    lushDeep: [67, 112, 69],
    softPlain: [129, 145, 91],
    wetLowland: [68, 116, 93],
    marshHold: [50, 96, 75],
    dryPlain: [155, 142, 89],
    highland: [130, 132, 112],
    mountain: [106, 110, 102],
    darkStone: [74, 78, 76],
    ice: [188, 218, 224],
    snow: [221, 234, 231],
    beachBlend: [197, 181, 124],
    mineralGlint: [202, 190, 142],
    summitWarmth: [196, 166, 94]
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

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
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

    const a = hash(((x0 % s) + s) % s, y0, seed);
    const b = hash(((x1 % s) + s) % s, y0, seed);
    const c = hash(((x0 % s) + s) % s, y1);
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

  function sampleSurface(map) {
    const u = map?.u || 0;
    const v = map?.v || 0;

    if (!map || !map.isLand || map.isOcean || map.isShelf || map.isBeach) {
      return Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        templateCapture: TEMPLATE_CAPTURE,
        allowed: false,
        reason: "landmap-did-not-authorize-valid-land",
        color: [0, 0, 0],
        landSurfaceCanCreateLand: false,
        oceanMaskOutranksSurface: true,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });
    }

    const softVariation = fbm(u * 2.2 + 0.15, v * 1.82 - 0.11, 930000, 5);
    const biological = fbm(u * 1.35 - 0.19, v * 1.08 + 0.12, 930700, 5);
    const moisture = fbm(u * 1.58 + 0.07, v * 1.35 - 0.17, 931000, 5);
    const dryness = fbm(u * 1.18 - 0.03, v * 0.92 + 0.22, 931500, 5);
    const highlandRelief = ridged(u * 1.52, v * 1.18, 932000, 5);
    const mountainRelief = ridged(u * 2.4 + 0.17, v * 1.85 - 0.09, 932400, 5);
    const mineral = ridged(u * 8.2 - 0.17, v * 6.7 + 0.13, 933000, 4);
    const summitPulse = fbm((map.cell256 || 1) / 256, v * 0.85, 933700, 3);

    let color = COLORS.lushBase;

    color = mix(color, COLORS.lushDeep, smoothstep(0.42, 0.86, biological) * 0.34);
    color = mix(color, COLORS.softPlain, smoothstep(0.42, 0.78, softVariation) * 0.22);
    color = mix(color, COLORS.wetLowland, smoothstep(0.54, 0.88, moisture) * 0.22);
    color = mix(color, COLORS.dryPlain, smoothstep(0.66, 0.92, dryness) * 0.16);

    if (map.terrainClass === "coast") {
      color = mix(color, COLORS.beachBlend, (map.beachEdge || 0) * 0.16);
    }

    if (map.terrainClass === "basin-highland") {
      color = mix(color, COLORS.marshHold, smoothstep(0.48, 0.86, moisture) * 0.34);
    }

    if (map.terrainClass === "mountain-highland") {
      color = mix(color, COLORS.highland, 0.38);
      color = mix(color, COLORS.mountain, smoothstep(0.48, 0.9, mountainRelief) * 0.38);
      color = mix(color, COLORS.snow, smoothstep(0.77, 0.95, mountainRelief) * 0.2);
    }

    if (map.terrainClass === "ice-highland") {
      color = mix(COLORS.highland, COLORS.ice, 0.58);
      color = mix(color, COLORS.snow, smoothstep(0.5, 0.9, map.icePressure || highlandRelief) * 0.34);
      color = mix(color, COLORS.darkStone, smoothstep(0.7, 0.95, mountainRelief) * 0.16);
    }

    if (map.terrainClass === "polar-ice") {
      color = mix(COLORS.ice, COLORS.snow, 0.64);
      color = mix(color, COLORS.highland, smoothstep(0.58, 0.9, mountainRelief) * 0.18);
    }

    color = mix(color, COLORS.mineralGlint, smoothstep(0.82, 0.96, mineral) * 0.08);
    color = mix(color, COLORS.summitWarmth, smoothstep(0.8, 0.96, summitPulse) * 0.045);

    const relief =
      highlandRelief * 7 +
      mountainRelief * (map.mountainEligible ? 8 : 3) +
      softVariation * 4 -
      dryness * 3;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      templateCapture: TEMPLATE_CAPTURE,
      allowed: true,
      color: shade(color, relief - 5),
      softVariation,
      biological,
      moisture,
      dryness,
      highlandRelief,
      mountainRelief,
      mineral,
      summitPulse,
      lushLandSurface: true,
      landOnlyBiologicalPotential: true,
      highlandCapable: true,
      noTrees: true,
      noBushes: true,
      noForestCanopy: true,
      landSurfaceCanCreateLand: false,
      oceanMaskOutranksSurface: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      templateCapture: TEMPLATE_CAPTURE,
      version: VERSION,
      authority: "audralia-g1-layer-two-lush-land-surface",
      layer: 2,
      lushLandSurface: true,
      landOnlyBiologicalPotential: true,
      appliesOnlyToValidLand: true,
      oceanMaskOutranksSurface: true,
      landSurfaceCanCreateLand: false,
      landSurfaceCanEraseOcean: false,
      hydrologyAuthored: false,
      trees: false,
      bushes: false,
      forestCanopy: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_LAND_SURFACE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    templateCapture: TEMPLATE_CAPTURE,
    version: VERSION,
    sampleSurface,
    getStatus
  });

  window.AUDRALIA_LAND_SURFACE_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaLandSurfaceLoaded = "true";
  document.documentElement.dataset.audraliaLandSurfaceContract = CONTRACT;
  document.documentElement.dataset.audraliaLandSurfaceReceipt = RECEIPT;
  document.documentElement.dataset.audraliaLushLandSurfaceTemplateCapture = TEMPLATE_CAPTURE;
  document.documentElement.dataset.audraliaLayerTwoLushLandSurface = "true";
  document.documentElement.dataset.audraliaLandSurfaceAppliesOnlyToValidLand = "true";
  document.documentElement.dataset.audraliaOceanMaskOutranksSurface = "true";
  document.documentElement.dataset.audraliaLandSurfaceCanCreateLand = "false";
  document.documentElement.dataset.audraliaLandSurfaceCanEraseOcean = "false";
  document.documentElement.dataset.audraliaTrees = "false";
  document.documentElement.dataset.audraliaBushes = "false";
  document.documentElement.dataset.audraliaForestCanopy = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
