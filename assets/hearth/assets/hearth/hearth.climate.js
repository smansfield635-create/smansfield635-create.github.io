// /assets/hearth/hearth.climate.js
// HEARTH_CLIMATE_REGION_BIOME_AUTHORITY_TNT_v1
// Full-file replacement / new file.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CLIMATE_REGION_BIOME_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_CLIMATE_REGION_BIOME_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.hearth-climate-region-biome-authority-v1";

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

  function fbm(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 4;

    for (let i = 0; i < 6; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function classifyBiome(field) {
    const {
      isLand,
      temperature,
      moisture,
      aridity,
      elevation,
      mountain,
      coast,
      ice,
      wetness,
      latitudeCold
    } = field;

    if (!isLand) {
      if (coast > 0.5) return "coastal-shelf";
      return "ocean";
    }

    if (ice > 0.64 || (latitudeCold > 0.72 && temperature < 0.25)) return "ice-cap";
    if (mountain > 0.7 && temperature < 0.42) return "snowy-mountains";
    if (mountain > 0.62) return "rocky-mountains";
    if (elevation > 0.66 && moisture > 0.46) return "highland-forest";
    if (elevation > 0.6 && moisture <= 0.46) return "dry-highlands";

    if (temperature > 0.68 && aridity > 0.7) return "hot-desert";
    if (temperature > 0.58 && aridity > 0.58) return "semi-desert";
    if (temperature > 0.56 && moisture > 0.7) return "wet-forest";
    if (temperature > 0.52 && moisture > 0.52) return "seasonal-forest";
    if (temperature > 0.56 && moisture > 0.36) return "savanna";

    if (temperature > 0.36 && moisture > 0.66 && wetness > 0.58) return "wetland";
    if (temperature > 0.34 && moisture > 0.54) return "temperate-forest";
    if (temperature > 0.3 && moisture > 0.34) return "plains";
    if (temperature > 0.24 && moisture <= 0.34) return "steppe";

    if (latitudeCold > 0.52 && moisture > 0.36) return "tundra";
    if (latitudeCold > 0.46 && moisture <= 0.36) return "cold-steppe";

    return "mixed-lowland";
  }

  function sampleClimate(u, v, base = {}, terrain = {}, elevation = {}) {
    const isLand = base.isLand === true;
    const lat = Number.isFinite(base.lat) ? base.lat : 0;
    const latitude01 = Math.abs(lat) / (Math.PI / 2);
    const coast = clamp(base.coast || 0, 0, 1);

    const regionalNoise = fbm(u * 1.13 + 0.07, v * 1.09 - 0.03, 41000);
    const moistureNoise = fbm(u * 1.81 - 0.17, v * 1.37 + 0.11, 42000);
    const heatNoise = fbm(u * 0.92 + 0.23, v * 1.52 - 0.19, 43000);

    const verticalRelief = clamp(elevation.verticalRelief || elevation.elevation || 0, 0, 1);
    const mountain = clamp(elevation.mountainRange || 0, 0, 1);
    const valley = clamp(elevation.valley || 0, 0, 1);
    const basin = clamp(elevation.basin || 0, 0, 1);
    const highlands = clamp(elevation.highlands || 0, 0, 1);
    const cliff = clamp(elevation.cliffWall || 0, 0, 1);
    const islandEdge = clamp(terrain.islandEdge || 0, 0, 1);

    const equatorHeat = clamp(1 - latitude01, 0, 1);
    const latitudeCold = clamp(latitude01, 0, 1);
    const altitudeCooling = verticalRelief * 0.34 + mountain * 0.28 + highlands * 0.12;

    const temperature = clamp(
      equatorHeat * 0.78 +
        heatNoise * 0.18 +
        regionalNoise * 0.08 -
        altitudeCooling -
        latitudeCold * 0.16,
      0,
      1
    );

    const oceanMoisture = coast * 0.44 + islandEdge * 0.18;
    const valleyMoisture = valley * 0.24 + basin * 0.2;
    const rainBand = Math.sin((0.5 - Math.abs(v - 0.5)) * Math.PI);
    const rainShadow = mountain * smoothstep(0.34, 0.86, highlands + cliff * 0.32) * 0.34;

    const moisture = clamp(
      oceanMoisture +
        valleyMoisture +
        moistureNoise * 0.42 +
        rainBand * 0.16 -
        rainShadow -
        temperature * 0.1,
      0,
      1
    );

    const wetness = clamp(moisture * 0.66 + basin * 0.2 + valley * 0.14, 0, 1);
    const aridity = clamp((1 - moisture) * 0.72 + temperature * 0.34 + rainShadow * 0.32 - coast * 0.18, 0, 1);
    const ice = clamp((elevation.snowLine || 0) * 0.72 + latitudeCold * 0.22 + mountain * 0.16 - temperature * 0.2, 0, 1);

    const field = {
      contract: CONTRACT,
      receipt: RECEIPT,
      isLand,
      latitude01,
      latitudeCold,
      temperature,
      moisture,
      wetness,
      aridity,
      elevation: verticalRelief,
      mountain,
      valley,
      basin,
      highlands,
      cliff,
      coast,
      islandEdge,
      ice,
      regionalNoise,
      moistureNoise,
      heatNoise,
      climateAuthorityLoaded: true,
      regionBiomeAuthorityLoaded: true,
      biomeColorNotBodyMassColor: true,
      bodyMassAssignedColoring: false,
      ownsBodyMassPlacement: false,
      ownsCoastline: false,
      ownsElevation: false,
      ownsMaterialRendering: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };

    return Object.freeze({
      ...field,
      biome: classifyBiome(field)
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "climate-region-biome",
      climateAuthorityLoaded: true,
      regionBiomeAuthorityLoaded: true,
      biomeColorNotBodyMassColor: true,
      bodyMassAssignedColoring: false,
      ownsBodyMassPlacement: false,
      ownsCoastline: false,
      ownsElevation: false,
      ownsMaterialRendering: false,
      runtimeTouched: false,
      controlsTouched: false,
      canvasTouched: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_CLIMATE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    sampleClimate,
    getStatus
  });

  window.HEARTH_CLIMATE_RECEIPT = getStatus();

  document.documentElement.dataset.hearthClimateAuthorityLoaded = "true";
  document.documentElement.dataset.hearthClimateAuthorityContract = CONTRACT;
  document.documentElement.dataset.hearthClimateAuthorityReceipt = RECEIPT;
  document.documentElement.dataset.hearthRegionBiomeAuthorityLoaded = "true";
  document.documentElement.dataset.hearthBiomeColorNotBodyMassColor = "true";
  document.documentElement.dataset.hearthBodyMassAssignedColoring = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
