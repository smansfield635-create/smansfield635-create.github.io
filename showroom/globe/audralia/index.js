// showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1
//
// Active renewal:
// - AUDRALIA_ROUTE_TEXTURE_COMPOSER_CONSUMER_ONLY_SOFT_WATER_BLEND_TNT_v1
//
// Role:
// - Audralia route compositor.
// - Owns route boot, mount connection, runtime import, texture composition, and hex child handoff.
// - Consumes runtime truth only.
// - Consumes hex child renderer only.
// - Demotes route water painting to soft consumer-only blending.
// - Does not hard-paint DeepOcean.
// - Does not classify DeepOcean.
// - Does not create land.
// - Does not create water.
// - Does not mutate topology, tectonics, terrain, hydration, oceans, climate, runtime, hex child, or gauges.
//
// Hard locks:
// - No route-owned land generation.
// - No route-owned water generation.
// - No hard DeepOcean route color.
// - No DeepOcean showroom child.
// - No topology rewrite.
// - No tectonics rewrite.
// - No terrain rewrite.
// - No hydration rewrite.
// - No oceans rewrite.
// - No climate rewrite.
// - No runtime rewrite.
// - No hex rewrite.
// - No ecology.
// - No foliage.
// - No trees.
// - No vegetation.
// - No animals.
// - No marine life.
// - No construct civilization.
// - No graphic box.
// - No image generation.
// - No visual pass claim.

import * as RuntimeModule from "../../../assets/audralia/audralia.runtime.js?v=AUDRALIA_RUNTIME_ORGANIC_OCEAN_PLACEMENT_CONTRACT_v1";

import {
  drawAudraliaHexSurfaceFrame,
  getAudraliaHexSurfaceStatus
} from "./audralia.hex.surface.js?v=AUDRALIA_G8_HEX_CHILD_GLOBAL_AQUEOUS_GLAZE_LAYER_TNT_v1";

const RECEIPT = "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_ROUTE_TEXTURE_COMPOSER_CONSUMER_ONLY_SOFT_WATER_BLEND_TNT_v1";
const PREVIOUS_RENEWALS = Object.freeze([
  "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TWO_FILE_TNT_v1",
  "AUDRALIA_G6_SURFACE_SAMPLING_AND_TERRAIN_REFINEMENT_TNT_v1",
  "AUDRALIA_ROUTE_RUNTIME_HYDRATION_WATER_RENDER_TNT_v1",
  "AUDRALIA_ROUTE_TRUE_ORTHOGRAPHIC_GLOBE_RENDER_TNT_v2",
  "AUDRALIA_ROUTE_TRUE_GLOBE_VISIBLE_HEMISPHERE_RENDER_TNT_v1"
]);

const BODY = "audralia";
const ROUTE = "/showroom/globe/audralia/";
const RUNTIME_AUTHORITY = "/assets/audralia/audralia.runtime.js";
const HEX_CHILD_AUTHORITY = "/showroom/globe/audralia/audralia.hex.surface.js";

const DEFAULTS = Object.freeze({
  canvasSize: 792,
  textureWidth: 1024,
  textureHeight: 512,
  runtimeFieldWidth: 384,
  runtimeFieldHeight: 192,
  phase: 0.18084,
  velocity: 0,
  renderMode: "hex-surface-child",
  textureSofteningPasses: 1
});

const HARD_LOCKS = Object.freeze({
  routeOwnedLandGeneration: false,
  routeOwnedWaterGeneration: false,
  deepOceanRouteHardPaint: false,
  deepOceanRouteClassification: false,
  topologyRewrittenHere: false,
  tectonicsRewrittenHere: false,
  terrainRewrittenHere: false,
  hydrationRewrittenHere: false,
  oceansRewrittenHere: false,
  climateRewrittenHere: false,
  runtimeRewrittenHere: false,
  hexRewrittenHere: false,
  noTrees: true,
  noFoliage: true,
  noVegetation: true,
  noGreenYellowDots: true,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function readRuntimeApi() {
  return RuntimeModule.default && typeof RuntimeModule.default === "object"
    ? RuntimeModule.default
    : RuntimeModule;
}

function createRuntimeInstance() {
  const api = readRuntimeApi();

  if (api && typeof api.createAudraliaRuntime === "function") {
    return api.createAudraliaRuntime({
      fieldWidth: DEFAULTS.runtimeFieldWidth,
      fieldHeight: DEFAULTS.runtimeFieldHeight
    });
  }

  return api;
}

function safeRuntimeStatus(runtime) {
  const api = readRuntimeApi();

  try {
    if (runtime && typeof runtime.getStatus === "function") return runtime.getStatus();
    if (api && typeof api.getStatus === "function") return api.getStatus();
  } catch (error) {
    return {
      ok: false,
      error: String(error && error.message ? error.message : error)
    };
  }

  return {
    ok: false,
    error: "AUDRALIA_RUNTIME_STATUS_UNAVAILABLE"
  };
}

function safeRuntimeStats(runtime) {
  const api = readRuntimeApi();

  try {
    if (runtime && typeof runtime.getRuntimeStats === "function") return runtime.getRuntimeStats();
    if (runtime && typeof runtime.getStats === "function") return runtime.getStats();
    if (api && typeof api.getRuntimeStats === "function") return api.getRuntimeStats();
    if (api && typeof api.getStats === "function") return api.getStats();
  } catch (error) {
    return {
      totalSamples: 0,
      error: String(error && error.message ? error.message : error)
    };
  }

  return {
    totalSamples: 0
  };
}

function safeSampleRuntime(runtime, u, v) {
  const api = readRuntimeApi();
  const input = { u: wrap01(u), v: clamp(v, 0, 1), x: wrap01(u), y: clamp(v, 0, 1) };

  try {
    if (runtime && typeof runtime.sampleRuntimeState === "function") return runtime.sampleRuntimeState(input);
    if (runtime && typeof runtime.sampleAudraliaPlanetState === "function") return runtime.sampleAudraliaPlanetState(input);
    if (runtime && typeof runtime.sampleSurface === "function") return runtime.sampleSurface(input);

    if (api && typeof api.sampleRuntimeState === "function") return api.sampleRuntimeState(input);
    if (api && typeof api.sampleAudraliaPlanetState === "function") return api.sampleAudraliaPlanetState(input);
    if (api && typeof api.sampleSurface === "function") return api.sampleSurface(input);
  } catch (error) {
    return {
      routeSampleError: true,
      routeSampleErrorMessage: String(error && error.message ? error.message : error),
      u: input.u,
      v: input.v
    };
  }

  return {
    routeSampleError: true,
    routeSampleErrorMessage: "AUDRALIA_RUNTIME_SAMPLE_UNAVAILABLE",
    u: input.u,
    v: input.v
  };
}

function isSolidSurface(sample) {
  return Boolean(
    sample &&
      (
        sample.solidSurfaceLand ||
        sample.solidSurface ||
        sample.topologyLandFootprint ||
        sample.isIce ||
        sample.isGlacier ||
        sample.isSnowpack
      )
  );
}

function isVisibleTerrainLand(sample) {
  return Boolean(
    sample &&
      (
        sample.visibleTerrainLand ||
        sample.landVisibleToRoute ||
        sample.isLand ||
        sample.land ||
        sample.isAboveWaterLandFootprint
      )
  );
}

function isIceSurface(sample) {
  const text = [
    sample && sample.visualSurfaceClass,
    sample && sample.surfaceClass,
    sample && sample.waterClass
  ].join(" ");

  return Boolean(
    sample &&
      (
        sample.isIce ||
        sample.isGlacier ||
        sample.isSnowpack ||
        text.includes("ice") ||
        text.includes("glacier") ||
        text.includes("snowpack")
      )
  );
}

function isWaterSurface(sample) {
  return Boolean(
    sample &&
      (
        sample.isOceanWater ||
        sample.isWater ||
        sample.waterVisibleToRoute ||
        sample.waterClass === "ocean_water" ||
        sample.waterClass === "shelf_water" ||
        sample.waterClass === "coastal_water" ||
        sample.waterClass === "terrain_moisture"
      ) &&
      !isVisibleTerrainLand(sample) &&
      !isIceSurface(sample)
  );
}

function isShelfSurface(sample) {
  return Boolean(
    sample &&
      (
        sample.isShelfWater ||
        sample.isCoastalWater ||
        Number(sample.shelfWaterIndex) > 0.30 ||
        Number(sample.coastalTurquoiseIndex) > 0.34 ||
        sample.waterClass === "shelf_water" ||
        sample.waterClass === "coastal_water" ||
        String(sample.visualSurfaceClass || "").includes("shelf")
      ) &&
      isWaterSurface(sample)
  );
}

function sampleNumber(sample, keys, fallback = 0) {
  if (!sample || typeof sample !== "object") return fallback;

  for (let i = 0; i < keys.length; i += 1) {
    const value = Number(sample[keys[i]]);
    if (Number.isFinite(value)) return value;
  }

  return fallback;
}

function colorMix(a, b, t) {
  return [
    Math.round(mix(a[0], b[0], t)),
    Math.round(mix(a[1], b[1], t)),
    Math.round(mix(a[2], b[2], t)),
    255
  ];
}

function applyLight(color, amount) {
  return [
    clamp(Math.round(color[0] * amount), 0, 255),
    clamp(Math.round(color[1] * amount), 0, 255),
    clamp(Math.round(color[2] * amount), 0, 255),
    color[3] === undefined ? 255 : color[3]
  ];
}

function stableDither(u, v) {
  const s = Math.sin((u * 127.1 + v * 311.7) * 43758.5453123);
  return s - Math.floor(s);
}

function landColor(sample, u, v) {
  const elevation = clamp(
    sampleNumber(sample, ["normalizedElevation", "elevation"], 0.28),
    0,
    1
  );

  const mineral = clamp(
    sampleNumber(sample, ["mineralReliefIndex", "exposedMineralHardnessIndex", "diamondGraniteSlateReliefIndex"], 0.35),
    0,
    1
  );

  const ridge = clamp(
    sampleNumber(sample, ["ridgePressure", "mountainPressure", "terrainPressureHandoff"], 0.30),
    0,
    1
  );

  const basin = clamp(
    sampleNumber(sample, ["basinPressure", "ancientWeatheringIndex", "erosionMemoryIndex"], 0.28),
    0,
    1
  );

  const beach = Boolean(sample && sample.isBeach) || sampleNumber(sample, ["beachOutlinePressure", "beachWaterContactIndex"], 0) > 0.18;

  const baseLow = [142, 116, 80, 255];
  const baseMid = [164, 136, 92, 255];
  const baseHigh = [188, 160, 112, 255];
  const rock = [110, 104, 96, 255];
  const sand = [194, 172, 124, 255];

  let color = colorMix(baseLow, baseMid, clamp(elevation * 0.85 + basin * 0.10, 0, 1));
  color = colorMix(color, baseHigh, clamp(elevation * 0.24, 0, 0.42));
  color = colorMix(color, rock, clamp(mineral * ridge * 0.18, 0, 0.26));

  if (beach) {
    color = colorMix(color, sand, clamp(0.22 + sampleNumber(sample, ["beachOutlinePressure"], 0) * 0.18, 0.18, 0.42));
  }

  const grain = (stableDither(u * 19.0, v * 19.0) - 0.5) * 0.035;
  return applyLight(color, clamp(0.96 + grain + ridge * 0.035 - basin * 0.018, 0.88, 1.08));
}

function iceColor(sample, u, v) {
  const relief = clamp(sampleNumber(sample, ["glacierSeatPressure", "snowpackPressure", "ridgePressure"], 0.5), 0, 1);
  const color = colorMix([205, 222, 226, 255], [240, 248, 250, 255], clamp(0.35 + relief * 0.30, 0, 1));
  const grain = (stableDither(u * 13.0, v * 13.0) - 0.5) * 0.028;
  return applyLight(color, clamp(0.96 + grain, 0.90, 1.06));
}

function waterColorConsumerOnly(sample, u, v) {
  const shelf = clamp(
    sampleNumber(sample, ["coastalTurquoiseIndex", "shelfWaterIndex", "coastalShelfBlueIndex", "shelfDepthIndex"], 0),
    0,
    1
  );

  const routeSafeDepth = clamp(
    sampleNumber(sample, ["oceanDepthIndex", "visibleWaterDepthIndex", "bathymetryHydrationIndex", "basinDepthIndex"], 0.28),
    0,
    1
  );

  const softDeepField = clamp(
    sampleNumber(sample, ["deepOceanBlendIndex", "deepOceanFeatherIndex", "organicDeepOceanPresenceIndex"], 0),
    0,
    1
  );

  const hydration = clamp(
    sampleNumber(sample, ["surfaceWaterIndex", "hydrationActivationIndex", "hydrationConductionIndex"], 0.58),
    0,
    1
  );

  const openWater = [28, 126, 184, 255];
  const softBlue = [24, 112, 176, 255];
  const mildDepth = [18, 100, 166, 255];
  const turquoise = [54, 197, 207, 255];
  const paleShelf = [84, 213, 211, 255];

  let color = colorMix(openWater, softBlue, clamp(routeSafeDepth * 0.30, 0, 0.34));

  // DeepOcean is allowed only as a soft depth influence.
  // It must not become a hard visible object or dark navy class.
  color = colorMix(color, mildDepth, clamp(softDeepField * 0.16, 0, 0.18));

  // Shelf/coastal water remains the dominant visible water expression.
  color = colorMix(color, turquoise, clamp(shelf * 0.58, 0, 0.66));
  color = colorMix(color, paleShelf, clamp(Math.max(0, shelf - 0.60) * 0.20, 0, 0.22));

  const motion = (stableDither(u * 17.0 + 0.11, v * 17.0 - 0.23) - 0.5) * 0.030;
  const hydrationLift = clamp((hydration - 0.45) * 0.045, -0.015, 0.035);

  return applyLight(color, clamp(0.96 + motion + hydrationLift, 0.88, 1.08));
}

function runtimeSurfaceColor(sample, u, v) {
  if (!sample || sample.routeSampleError) {
    return [34, 86, 126, 255];
  }

  if (isIceSurface(sample)) {
    return iceColor(sample, u, v);
  }

  if (isVisibleTerrainLand(sample)) {
    return landColor(sample, u, v);
  }

  if (isWaterSurface(sample)) {
    return waterColorConsumerOnly(sample, u, v);
  }

  if (isSolidSurface(sample)) {
    return landColor(sample, u, v);
  }

  return waterColorConsumerOnly(sample, u, v);
}

function buildTexture(runtime, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  const image = context.createImageData(width, height);
  const data = image.data;

  const counters = {
    runtimeSamples: 0,
    solidSurfaceSamples: 0,
    landSamples: 0,
    waterSamples: 0,
    iceSamples: 0,
    beachSamples: 0,
    hydratedSamples: 0,
    oceanWaterSamples: 0,
    shelfSamples: 0,
    softDepthSamples: 0,
    hardDeepOceanRouteClassSamples: 0,
    fallbackSamples: 0,
    maxSurfaceWaterIndex: 0,
    maxHydrationActivationIndex: 0,
    maxRouteSafeDepthIndex: 0,
    maxSoftDeepOceanBlendIndex: 0,
    maxTurquoise: 0
  };

  for (let y = 0; y < height; y += 1) {
    const v = height <= 1 ? 0.5 : y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = width <= 1 ? 0.5 : x / (width - 1);
      const sample = safeSampleRuntime(runtime, u, v);
      const color = runtimeSurfaceColor(sample, u, v);
      const index = (y * width + x) * 4;

      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = color[3];

      counters.runtimeSamples += 1;

      if (sample && sample.routeSampleError) counters.fallbackSamples += 1;
      if (isSolidSurface(sample)) counters.solidSurfaceSamples += 1;
      if (isVisibleTerrainLand(sample)) counters.landSamples += 1;
      if (isWaterSurface(sample)) counters.waterSamples += 1;
      if (isIceSurface(sample)) counters.iceSamples += 1;
      if (sample && sample.isBeach) counters.beachSamples += 1;
      if (sample && sample.isHydrated) counters.hydratedSamples += 1;
      if (sample && sample.isOceanWater) counters.oceanWaterSamples += 1;
      if (isShelfSurface(sample)) counters.shelfSamples += 1;

      const softDepth = sampleNumber(sample, ["deepOceanBlendIndex", "deepOceanFeatherIndex", "organicDeepOceanPresenceIndex"], 0);
      if (softDepth > 0.10) counters.softDepthSamples += 1;

      const hardClass =
        Boolean(sample && sample.isDeepOcean) ||
        String(sample && sample.waterClass ? sample.waterClass : "").includes("deep_ocean") ||
        String(sample && sample.visualSurfaceClass ? sample.visualSurfaceClass : "").includes("deep_ocean");

      if (hardClass) counters.hardDeepOceanRouteClassSamples += 1;

      counters.maxSurfaceWaterIndex = Math.max(counters.maxSurfaceWaterIndex, sampleNumber(sample, ["surfaceWaterIndex"], 0));
      counters.maxHydrationActivationIndex = Math.max(counters.maxHydrationActivationIndex, sampleNumber(sample, ["hydrationActivationIndex"], 0));
      counters.maxRouteSafeDepthIndex = Math.max(counters.maxRouteSafeDepthIndex, sampleNumber(sample, ["oceanDepthIndex", "visibleWaterDepthIndex"], 0));
      counters.maxSoftDeepOceanBlendIndex = Math.max(counters.maxSoftDeepOceanBlendIndex, softDepth);
      counters.maxTurquoise = Math.max(counters.maxTurquoise, sampleNumber(sample, ["coastalTurquoiseIndex", "shelfWaterIndex"], 0));
    }
  }

  context.putImageData(image, 0, 0);

  return {
    canvas,
    width,
    height,
    data,
    counters
  };
}

function drawNonRuntimeFailure(mount, message) {
  mount.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "audralia-runtime-failure-panel";
  panel.setAttribute("role", "status");
  panel.dataset.body = BODY;
  panel.dataset.route = ROUTE;
  panel.dataset.receipt = RECEIPT;
  panel.dataset.activeRenewal = ACTIVE_RENEWAL;
  panel.dataset.ok = "false";
  panel.dataset.visualPassClaimed = "false";

  const title = document.createElement("h2");
  title.textContent = "Audralia runtime unavailable.";

  const detail = document.createElement("p");
  detail.textContent = message;

  panel.append(title, detail);
  mount.appendChild(panel);
}

function createCanvas(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.className = "audralia-true-globe-canvas audralia-hex-runtime-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Audralia current runtime globe");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.maxWidth = "792px";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.borderRadius = "50%";
  return canvas;
}

function createLabel() {
  const label = document.createElement("div");
  label.className = "audralia-globe-label";
  label.textContent = "AUDRALIA · HEX RUNTIME";
  label.dataset.labelText = "AUDRALIA · HEX RUNTIME";
  return label;
}

function createHiddenReceipt(status) {
  const receipt = document.createElement("div");
  receipt.hidden = true;
  receipt.setAttribute("aria-hidden", "true");
  receipt.className = "audralia-route-receipt";
  receipt.dataset.body = BODY;
  receipt.dataset.route = ROUTE;
  receipt.dataset.receipt = RECEIPT;
  receipt.dataset.activeRenewal = ACTIVE_RENEWAL;
  receipt.dataset.runtimeVersion = status.runtimeVersion || "";
  receipt.dataset.hexSurfaceChild = "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1";
  receipt.dataset.routeTextureComposer = ACTIVE_RENEWAL;
  receipt.dataset.consumerOnlySoftWaterBlend = "true";
  receipt.dataset.hardDeepOceanRouteColor = "removed";
  receipt.dataset.deepOceanRouteClassification = "forbidden";
  receipt.dataset.visualPassClaimed = "false";
  receipt.textContent = [
    "AUDRALIA_ROUTE=CONSUMER_ONLY_SOFT_WATER_BLEND",
    "HARD_DEEP_OCEAN_ROUTE_COLOR=REMOVED",
    "ROUTE_OWNED_LAND=false",
    "ROUTE_OWNED_WATER=false",
    "VISUAL_PASS=HELD"
  ].join(" · ");
  return receipt;
}

function writeDataset(target, status, textureCounters, runtimeStats, runtimeStatus, hexStatus) {
  target.dataset.audraliaRenderMount = "true";
  target.dataset.renderMount = "true";
  target.dataset.body = BODY;
  target.dataset.route = ROUTE;
  target.dataset.contract = RECEIPT;
  target.dataset.activeRenewal = ACTIVE_RENEWAL;
  target.dataset.routeTextureComposer = ACTIVE_RENEWAL;
  target.dataset.previousContracts = PREVIOUS_RENEWALS.join("|");
  target.dataset.routeScript = "showroom/globe/audralia/index.js";
  target.dataset.routeScriptContract = RECEIPT;

  target.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
  target.dataset.runtimeContract = runtimeStatus && runtimeStatus.receipt ? runtimeStatus.receipt : "";
  target.dataset.runtimeVersion = runtimeStatus && runtimeStatus.receipt ? runtimeStatus.receipt : "";
  target.dataset.runtimeActiveRenewal = runtimeStatus && runtimeStatus.activeRenewal ? runtimeStatus.activeRenewal : "";
  target.dataset.runtimeAuthorityLoaded = String(Boolean(status.runtimeLoaded));
  target.dataset.runtimeInstanceLoaded = String(Boolean(status.runtimeInstanceLoaded));
  target.dataset.runtimeLoadedReceipt = runtimeStatus && runtimeStatus.receipt ? runtimeStatus.receipt : "";

  target.dataset.hexSurfaceChildAuthority = HEX_CHILD_AUTHORITY;
  target.dataset.hexSurfaceChild = hexStatus && hexStatus.receipt ? hexStatus.receipt : "";
  target.dataset.hexSurfaceChildLoaded = String(Boolean(status.hexSurfaceChildLoaded));

  target.dataset.compositorModel = "runtime-consumer-current-genealogy-surface-globe";
  target.dataset.activeSurfaceRenderer = "hexagonal-route-child-renderer";
  target.dataset.rotationModel = "true-orthographic-front-hemisphere";
  target.dataset.projectionModel = "orthographic-sphere-coordinate-sampling";
  target.dataset.visibleLongitudeSpanDegrees = "180";
  target.dataset.hiddenLongitudeSpanDegrees = "180";
  target.dataset.fullTextureOnVisibleFace = "forbidden";
  target.dataset.flatMapOnSphere = "forbidden";

  target.dataset.composedTexture = "consumer-only-soft-water-blend-texture-active";
  target.dataset.consumerOnlySoftWaterBlend = "true";
  target.dataset.hardDeepOceanRouteColor = "removed";
  target.dataset.deepOceanRouteClassification = "forbidden";
  target.dataset.deepOceanHardBlobSuppression = "active";
  target.dataset.routeSoftWaterBlend = "active";

  target.dataset.runtimeSamples = String(textureCounters.runtimeSamples);
  target.dataset.solidSurfaceSamples = String(textureCounters.solidSurfaceSamples);
  target.dataset.landSamples = String(textureCounters.landSamples);
  target.dataset.waterSamples = String(textureCounters.waterSamples);
  target.dataset.iceSamples = String(textureCounters.iceSamples);
  target.dataset.beachSamples = String(textureCounters.beachSamples);
  target.dataset.hydratedSamples = String(textureCounters.hydratedSamples);
  target.dataset.oceanWaterSamples = String(textureCounters.oceanWaterSamples);
  target.dataset.shelfSamples = String(textureCounters.shelfSamples);
  target.dataset.softDepthSamples = String(textureCounters.softDepthSamples);
  target.dataset.hardDeepOceanRouteClassSamples = String(textureCounters.hardDeepOceanRouteClassSamples);
  target.dataset.fallbackSamples = String(textureCounters.fallbackSamples);

  target.dataset.maxSurfaceWaterIndex = textureCounters.maxSurfaceWaterIndex.toFixed(4);
  target.dataset.maxHydrationActivationIndex = textureCounters.maxHydrationActivationIndex.toFixed(4);
  target.dataset.maxRouteSafeDepthIndex = textureCounters.maxRouteSafeDepthIndex.toFixed(4);
  target.dataset.maxSoftDeepOceanBlendIndex = textureCounters.maxSoftDeepOceanBlendIndex.toFixed(4);
  target.dataset.maxTurquoise = textureCounters.maxTurquoise.toFixed(4);

  target.dataset.routeOwnedLandGeneration = "forbidden";
  target.dataset.routeOwnedWaterGeneration = "forbidden";
  target.dataset.topologyRewrittenHere = "false";
  target.dataset.tectonicsRewrittenHere = "false";
  target.dataset.terrainRewrittenHere = "false";
  target.dataset.hydrationRewrittenHere = "false";
  target.dataset.oceansRewrittenHere = "false";
  target.dataset.climateRewrittenHere = "false";
  target.dataset.runtimeRewrittenHere = "false";
  target.dataset.hexRewrittenHere = "false";

  target.dataset.noTrees = "true";
  target.dataset.noFoliage = "true";
  target.dataset.noVegetation = "true";
  target.dataset.noGreenYellowDots = "true";
  target.dataset.hydration = "runtime-read-only-active";
  target.dataset.hydrationReadout = "runtime-only";

  target.dataset.graphicBox = "false";
  target.dataset.imageGeneration = "false";
  target.dataset.publicReceipts = "hidden";
  target.dataset.rawReceipts = "suppressed";
  target.dataset.visualPass = "HELD_UNTIL_OWNER_SCREENSHOT_CONFIRMATION";
  target.dataset.visualPassClaimed = "false";

  target.dataset.renderMode = DEFAULTS.renderMode;
  target.dataset.phase = String(DEFAULTS.phase);
  target.dataset.velocity = String(DEFAULTS.velocity);

  if (runtimeStats && typeof runtimeStats === "object") {
    target.dataset.runtimeSolidSurfaceLandRatio = String(runtimeStats.solidSurfaceLandRatio || "");
    target.dataset.runtimeLiquidWaterRatio = String(runtimeStats.liquidWaterRatio || "");
    target.dataset.runtimeOrganicOceanPlacementActive = String(Boolean(runtimeStats.organicOceanPlacementActive));
    target.dataset.runtimeHardDeepOceanRouteClassSuppressed = String(Boolean(runtimeStats.hardDeepOceanRouteClassSuppressed));
    target.dataset.runtimeDeepOceanIsDepthFieldNotRouteBlob = String(Boolean(runtimeStats.deepOceanIsDepthFieldNotRouteBlob));
  }
}

function buildRouteStatus(statusInput) {
  const status = statusInput || {};

  return Object.freeze({
    ok: Boolean(status.ok),
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousReceipts: PREVIOUS_RENEWALS,
    body: BODY,
    route: ROUTE,
    runtimeAuthority: RUNTIME_AUTHORITY,
    runtimeVersion: status.runtimeVersion || "",
    runtimeActiveRenewal: status.runtimeActiveRenewal || "",
    runtimeLoadedReceipt: status.runtimeVersion || "",
    runtimeLoaded: Boolean(status.runtimeLoaded),
    runtimeInstanceLoaded: Boolean(status.runtimeInstanceLoaded),
    hexSurfaceChildLoaded: Boolean(status.hexSurfaceChildLoaded),
    hexSurfaceChild: status.hexSurfaceChild || "",
    routeTextureComposer: ACTIVE_RENEWAL,
    consumerOnlySoftWaterBlend: true,
    hardDeepOceanRouteColor: false,
    deepOceanRouteClassification: false,
    deepOceanHardBlobSuppression: true,
    compositorModel: "runtime-consumer-current-genealogy-surface-globe",
    activeSurfaceRenderer: "hexagonal-route-child-renderer",
    rotationModel: "true-orthographic-front-hemisphere",
    projectionModel: "orthographic-sphere-coordinate-sampling",
    phase: DEFAULTS.phase,
    velocity: DEFAULTS.velocity,
    visibleLongitudeSpanDegrees: 180,
    hiddenLongitudeSpanDegrees: 180,
    fullTextureOnVisibleFace: false,
    flatMapOnSphere: false,
    routeOwnedLandGeneration: false,
    routeOwnedWaterGeneration: false,
    runtimeHydrationReadout: true,
    topologyRewrittenHere: false,
    tectonicsRewrittenHere: false,
    terrainRewrittenHere: false,
    hydrationRewrittenHere: false,
    oceansRewrittenHere: false,
    climateRewrittenHere: false,
    runtimeRewrittenHere: false,
    hexRewrittenHere: false,
    noTrees: true,
    noFoliage: true,
    noVegetation: true,
    noGreenYellowDots: true,
    hydrationHeld: false,
    hydrationReadOnlyFromRuntime: true,
    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    textureCounters: status.textureCounters || null,
    runtimeStats: status.runtimeStats || null
  });
}

function exposeStatus(status) {
  const routeStatus = buildRouteStatus(status);

  window.DGBAudraliaRouteStatus = routeStatus;
  window.AudraliaRouteStatus = routeStatus;
  window.audraliaRouteStatus = routeStatus;

  window.dispatchEvent(
    new CustomEvent("dgb:audralia-route-status", {
      detail: routeStatus
    })
  );

  return routeStatus;
}

function findMount() {
  return (
    document.getElementById("audraliaRenderMount") ||
    document.getElementById("audreliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audrelia-render-mount]") ||
    document.querySelector("[data-body='audralia'][data-render-mount]") ||
    document.querySelector("[data-body='audrelia'][data-render-mount]")
  );
}

function renderAudraliaRoute() {
  const mount = findMount();

  if (!mount) {
    exposeStatus({
      ok: false,
      runtimeLoaded: false,
      runtimeInstanceLoaded: false,
      hexSurfaceChildLoaded: false,
      runtimeVersion: "",
      runtimeActiveRenewal: "",
      hexSurfaceChild: "",
      error: "AUDRALIA_ROUTE_MOUNT_NOT_FOUND"
    });
    return;
  }

  const runtime = createRuntimeInstance();
  const runtimeStatus = safeRuntimeStatus(runtime);
  const runtimeStats = safeRuntimeStats(runtime);

  const runtimeLoaded = Boolean(runtimeStatus && runtimeStatus.ok !== false);
  const runtimeInstanceLoaded = Boolean(runtime);

  if (!runtimeLoaded || !runtimeInstanceLoaded) {
    drawNonRuntimeFailure(mount, "The Audralia runtime did not load. Route refused fallback rendering.");
    exposeStatus({
      ok: false,
      runtimeLoaded,
      runtimeInstanceLoaded,
      hexSurfaceChildLoaded: false,
      runtimeVersion: runtimeStatus && runtimeStatus.receipt ? runtimeStatus.receipt : "",
      runtimeActiveRenewal: runtimeStatus && runtimeStatus.activeRenewal ? runtimeStatus.activeRenewal : "",
      hexSurfaceChild: "",
      runtimeStats,
      error: runtimeStatus && runtimeStatus.error ? runtimeStatus.error : "AUDRALIA_RUNTIME_NOT_LOADED"
    });
    return;
  }

  const texture = buildTexture(runtime, DEFAULTS.textureWidth, DEFAULTS.textureHeight);
  const canvas = createCanvas(DEFAULTS.canvasSize);
  const ctx = canvas.getContext("2d", { alpha: true });

  const state = {
    canvas,
    ctx,
    texture,
    phase: DEFAULTS.phase,
    velocity: DEFAULTS.velocity
  };

  let hexResult = null;
  let hexStatus = null;

  try {
    hexResult = drawAudraliaHexSurfaceFrame(state, {
      globalGlazeStrength: 1,
      landGlazeOpacity: 0.115,
      waterGlazeOpacity: 0.160,
      shelfGlazeOpacity: 0.245,
      terrainRecovery: 0.42
    });

    hexStatus = getAudraliaHexSurfaceStatus(state);
  } catch (error) {
    drawNonRuntimeFailure(mount, `Hex child renderer failed: ${String(error && error.message ? error.message : error)}`);
    exposeStatus({
      ok: false,
      runtimeLoaded: true,
      runtimeInstanceLoaded: true,
      hexSurfaceChildLoaded: false,
      runtimeVersion: runtimeStatus && runtimeStatus.receipt ? runtimeStatus.receipt : "",
      runtimeActiveRenewal: runtimeStatus && runtimeStatus.activeRenewal ? runtimeStatus.activeRenewal : "",
      hexSurfaceChild: "",
      runtimeStats,
      textureCounters: texture.counters,
      error: String(error && error.message ? error.message : error)
    });
    return;
  }

  const label = createLabel();

  mount.replaceChildren();
  mount.appendChild(canvas);
  mount.appendChild(label);

  const currentStatus = {
    ok: true,
    runtimeLoaded: true,
    runtimeInstanceLoaded: true,
    hexSurfaceChildLoaded: Boolean(hexResult && hexResult.ok),
    runtimeVersion: runtimeStatus && runtimeStatus.receipt ? runtimeStatus.receipt : "",
    runtimeActiveRenewal: runtimeStatus && runtimeStatus.activeRenewal ? runtimeStatus.activeRenewal : "",
    hexSurfaceChild: hexStatus && hexStatus.receipt ? hexStatus.receipt : "",
    runtimeStats,
    textureCounters: texture.counters
  };

  writeDataset(mount, currentStatus, texture.counters, runtimeStats, runtimeStatus, hexStatus);
  writeDataset(canvas, currentStatus, texture.counters, runtimeStats, runtimeStatus, hexStatus);

  mount.appendChild(createHiddenReceipt(currentStatus));

  exposeStatus(currentStatus);
}

function boot() {
  renderAudraliaRoute();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  RECEIPT,
  ACTIVE_RENEWAL,
  PREVIOUS_RENEWALS,
  renderAudraliaRoute,
  runtimeSurfaceColor,
  waterColorConsumerOnly,
  buildTexture,
  buildRouteStatus
};

export default Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  previousRenewals: PREVIOUS_RENEWALS,
  renderAudraliaRoute,
  runtimeSurfaceColor,
  waterColorConsumerOnly,
  buildTexture,
  buildRouteStatus
});
