// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1
//
// Active renewal:
// - AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TWO_FILE_TNT_v1
//
// Role:
// - Existing Audralia route compositor.
// - Owns route boot, mount, controls, runtime import, and child-renderer handoff.
// - Consumes Audralia runtime only.
// - Renders Audralia as a true orthographic globe.
// - Delegates hexagonal surface sampling to the route-child renderer.
//
// Hard locks:
// - No route-owned land generation.
// - No route-owned water generation.
// - No topology rewrite.
// - No tectonics rewrite.
// - No terrain rewrite.
// - No hydration rewrite.
// - No climate rewrite.
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

(function () {
  "use strict";

  const RECEIPT = "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1";
  const ACTIVE_RENEWAL = "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TWO_FILE_TNT_v1";
  const HEX_CHILD_RECEIPT = "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1";

  const PREVIOUS_RECEIPTS = Object.freeze([
    "AUDRALIA_G6_SURFACE_SAMPLING_AND_TERRAIN_REFINEMENT_TNT_v1",
    "AUDRALIA_ROUTE_RUNTIME_HYDRATION_WATER_RENDER_TNT_v1",
    "AUDRALIA_ROUTE_TRUE_ORTHOGRAPHIC_GLOBE_RENDER_TNT_v2",
    "AUDRALIA_ROUTE_TRUE_GLOBE_VISIBLE_HEMISPHERE_RENDER_TNT_v1"
  ]);

  const ROUTE = "/showroom/globe/audralia/";
  const BODY = "audralia";
  const LABEL = "Audralia";

  const RUNTIME_AUTHORITY = "/assets/audralia/audralia.runtime.js";
  const RUNTIME_VERSION = "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1";
  const HEX_CHILD_AUTHORITY = "/showroom/globe/audralia/audralia.hex.surface.js";

  const CONTROL = Object.freeze({
    axisDegrees: 21.5,
    textureWidth: 1024,
    textureHeight: 512,
    minSize: 320,
    maxSize: 660,
    initialPhase: 0.18,
    autoStep: 0.00042,
    dragFactor: 0.00172,
    releaseFriction: 0.952,
    minVelocity: 0.000014,

    rotationModel: "true-orthographic-front-hemisphere",
    projectionModel: "orthographic-sphere-coordinate-sampling",
    visibleLongitudeSpanDegrees: 180,
    hiddenLongitudeSpanDegrees: 180,
    phaseWindow: "front_hemisphere_only",
    compositorModel: "runtime-consumer-current-genealogy-surface-globe",
    activeSurfaceRenderer: "hexagonal-route-child-renderer",

    diskRotation: "forbidden",
    fullTextureOnVisibleFace: "forbidden",
    flatMapOnSphere: "forbidden",
    routeOwnedLandGeneration: "forbidden",
    routeOwnedWaterGeneration: "forbidden",
    topologyRewriteHere: "forbidden",
    tectonicsRewriteHere: "forbidden",
    terrainRewriteHere: "forbidden",
    hydrationRewriteHere: "forbidden",
    climateRewriteHere: "forbidden",
    hydration: "runtime-read-only-active",
    climate: "runtime-read-only-invariant",
    ecology: "forbidden",
    foliage: "forbidden",
    trees: "forbidden",
    vegetation: "forbidden",
    animals: "forbidden",
    marineLife: "forbidden",
    constructCivilization: "forbidden",
    graphicBox: "false",
    imageGeneration: "false",
    visualPass: "HELD_UNTIL_OWNER_SCREENSHOT_CONFIRMATION"
  });

  const RUNTIME_CONTEXT = Object.freeze({
    topologyFirst: true,
    tectonicsEnabled: true,
    terrainEnabled: true,
    hydrationEnabled: true,
    climateEnabled: true,
    hydrationConsumedAfterTerrain: true,
    g6SurfaceSamplingActive: true,
    g7HexSurfaceChildRendererActive: true,
    foliageEnabled: false,
    ecologyEnabled: false,
    faunaEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    visualPassClaimed: false
  });

  let activeState = null;

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

  function cacheUrl(path, version) {
    return (
      path +
      "?v=" +
      encodeURIComponent(version) +
      "&consumer=" +
      encodeURIComponent(RECEIPT) +
      "&active=" +
      encodeURIComponent(ACTIVE_RENEWAL) +
      "&t=" +
      String(Date.now())
    );
  }

  function getMount() {
    return (
      document.getElementById("audraliaRenderMount") ||
      document.querySelector("[data-audralia-render-mount]") ||
      document.querySelector("[data-body='audralia'][data-render-mount]")
    );
  }

  function markRoute(status) {
    document.documentElement.dataset.activeBody = BODY;
    document.documentElement.dataset.activeRoute = ROUTE;
    document.documentElement.dataset.audraliaRouteCompositor = RECEIPT;
    document.documentElement.dataset.audraliaRouteActiveRenewal = ACTIVE_RENEWAL;
    document.documentElement.dataset.audraliaHexSurfaceChild = HEX_CHILD_RECEIPT;
    document.documentElement.dataset.audraliaPreviousRouteCompositors = PREVIOUS_RECEIPTS.join("|");
    document.documentElement.dataset.audraliaRouteCompositorStatus = status || "booting";
    document.documentElement.dataset.audraliaRuntimeAuthority = RUNTIME_AUTHORITY;
    document.documentElement.dataset.audraliaRuntimeVersion = RUNTIME_VERSION;
    document.documentElement.dataset.audraliaHexSurfaceChildAuthority = HEX_CHILD_AUTHORITY;
    document.documentElement.dataset.audraliaCompositorModel = CONTROL.compositorModel;
    document.documentElement.dataset.audraliaActiveSurfaceRenderer = CONTROL.activeSurfaceRenderer;
    document.documentElement.dataset.audraliaRotationModel = CONTROL.rotationModel;
    document.documentElement.dataset.audraliaProjectionModel = CONTROL.projectionModel;
    document.documentElement.dataset.audraliaVisibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    document.documentElement.dataset.audraliaHiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    document.documentElement.dataset.audraliaFullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    document.documentElement.dataset.audraliaFlatMapOnSphere = CONTROL.flatMapOnSphere;
    document.documentElement.dataset.audraliaRouteOwnedLandGeneration = CONTROL.routeOwnedLandGeneration;
    document.documentElement.dataset.audraliaRouteOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    document.documentElement.dataset.audraliaHydration = CONTROL.hydration;
    document.documentElement.dataset.audraliaHydrationReadout = "runtime-only";
    document.documentElement.dataset.audraliaClimate = CONTROL.climate;
    document.documentElement.dataset.audraliaFoliage = CONTROL.foliage;
    document.documentElement.dataset.audraliaEcology = CONTROL.ecology;
    document.documentElement.dataset.audraliaAnimals = CONTROL.animals;
    document.documentElement.dataset.audraliaMarineLife = CONTROL.marineLife;
    document.documentElement.dataset.noTrees = "true";
    document.documentElement.dataset.noFoliage = "true";
    document.documentElement.dataset.noVegetation = "true";
    document.documentElement.dataset.earthAdoption = "blocked";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.activeBody = BODY;
      document.body.dataset.activeRoute = ROUTE;
      document.body.dataset.audraliaRouteCompositor = RECEIPT;
      document.body.dataset.audraliaRouteActiveRenewal = ACTIVE_RENEWAL;
      document.body.dataset.audraliaHexSurfaceChild = HEX_CHILD_RECEIPT;
      document.body.dataset.publicReceipts = "hidden";
      document.body.dataset.earthAdoption = "blocked";
      document.body.dataset.noTrees = "true";
      document.body.dataset.noFoliage = "true";
      document.body.dataset.noVegetation = "true";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.imageGeneration = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function ensureStyle() {
    if (document.getElementById("audralia-g7-hex-surface-route-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-g7-hex-surface-route-style";
    style.textContent = `
      #audraliaRenderMount,
      [data-audralia-render-mount],
      [data-body="audralia"][data-render-mount] {
        position: relative;
        display: grid;
        place-items: center;
        min-height: clamp(360px, 74vw, 740px);
        overflow: visible;
        isolation: isolate;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .audralia-orthographic-stage {
        position: relative;
        display: grid;
        place-items: center;
        width: min(100%, 780px);
        aspect-ratio: 1 / 1;
        overflow: visible;
        isolation: isolate;
      }

      .audralia-orthographic-stage::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(78vw, 650px);
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background:
          radial-gradient(circle, rgba(82, 164, 232, 0.17), transparent 66%),
          radial-gradient(circle, rgba(255, 255, 255, 0.045), transparent 44%);
        filter: blur(2px);
        pointer-events: none;
        z-index: 0;
      }

      .audralia-orthographic-axis {
        position: absolute;
        left: 50%;
        top: 50%;
        height: min(84vw, 700px);
        width: 2px;
        transform: translate(-50%, -50%) rotate(var(--audralia-axis-deg));
        transform-origin: center;
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(212, 235, 255, 0.12) 12%,
          rgba(212, 235, 255, 0.30) 50%,
          rgba(212, 235, 255, 0.12) 88%,
          transparent 100%
        );
        pointer-events: none;
        z-index: 1;
      }

      .audralia-orthographic-canvas {
        position: relative;
        z-index: 2;
        display: block;
        width: min(100%, 660px);
        max-width: min(100%, 660px);
        aspect-ratio: 1 / 1;
        border: 0;
        outline: 0;
        border-radius: 50%;
        background: transparent;
        box-shadow:
          inset -28px -20px 48px rgba(0, 0, 0, 0.34),
          inset 12px 10px 24px rgba(255, 255, 255, 0.07),
          0 0 0 1px rgba(184, 217, 255, 0.18),
          0 0 36px rgba(105, 177, 255, 0.22),
          0 0 90px rgba(105, 177, 255, 0.13);
        transform: none !important;
        rotate: none !important;
        scale: none !important;
        translate: none !important;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .audralia-orthographic-label {
        position: absolute;
        left: 50%;
        bottom: clamp(18px, 5vw, 44px);
        z-index: 4;
        transform: translateX(-50%);
        border: 1px solid rgba(210, 235, 255, 0.18);
        border-radius: 999px;
        padding: 0.62rem 0.96rem;
        color: rgba(246, 239, 224, 0.92);
        background: rgba(5, 10, 20, 0.70);
        font: 900 clamp(0.7rem, 2.4vw, 0.92rem) / 1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        pointer-events: none;
      }

      .audralia-orthographic-hidden-receipt {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  function resolveRuntimeApi(module) {
    if (!module) return null;

    if (typeof module.sampleAudraliaPlanetState === "function") return module;
    if (typeof module.sampleRuntimeState === "function") return module;
    if (typeof module.createAudraliaRuntime === "function") return module;

    if (module.default) {
      if (typeof module.default.sampleAudraliaPlanetState === "function") return module.default;
      if (typeof module.default.sampleRuntimeState === "function") return module.default;
      if (typeof module.default.createAudraliaRuntime === "function") return module.default;
    }

    return null;
  }

  function getWindowRuntimeApi() {
    return (
      window.DGBAudraliaRuntime ||
      window.AudraliaRuntime ||
      window.audraliaRuntime ||
      null
    );
  }

  async function loadRuntimeAuthority() {
    const existing = resolveRuntimeApi(getWindowRuntimeApi());

    if (existing) {
      return existing;
    }

    try {
      const module = await import(cacheUrl(RUNTIME_AUTHORITY, RUNTIME_VERSION));
      return resolveRuntimeApi(module);
    } catch (error) {
      return null;
    }
  }

  async function loadHexSurfaceChild() {
    if (window.DGBAudraliaHexSurfaceRenderer) {
      return window.DGBAudraliaHexSurfaceRenderer;
    }

    try {
      const module = await import(cacheUrl(HEX_CHILD_AUTHORITY, ACTIVE_RENEWAL));
      return module.default || module;
    } catch (error) {
      return null;
    }
  }

  function createRuntimeInstance(runtimeApi) {
    if (!runtimeApi) return null;

    if (typeof runtimeApi.createAudraliaRuntime === "function") {
      try {
        return runtimeApi.createAudraliaRuntime({
          ...RUNTIME_CONTEXT,
          fieldWidth: 384,
          fieldHeight: 192,
          targetLandRatio: 0.292
        });
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  function sampleRuntimeState(runtimeApi, runtimeInstance, u, v) {
    const context = RUNTIME_CONTEXT;

    try {
      if (runtimeInstance && typeof runtimeInstance.sampleRuntimeState === "function") {
        return runtimeInstance.sampleRuntimeState(u, v, context);
      }

      if (runtimeInstance && typeof runtimeInstance.sampleAudraliaPlanetState === "function") {
        return runtimeInstance.sampleAudraliaPlanetState(u, v, context);
      }

      if (runtimeApi && typeof runtimeApi.sampleAudraliaPlanetState === "function") {
        return runtimeApi.sampleAudraliaPlanetState(u, v, context);
      }

      if (runtimeApi && typeof runtimeApi.sampleRuntimeState === "function") {
        return runtimeApi.sampleRuntimeState(u, v, context);
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function isIceSample(sample) {
    if (!sample) return false;

    const visualSurfaceClass = String(sample.visualSurfaceClass || "");
    const waterClass = String(sample.waterClass || "");

    return Boolean(
      sample.isPolarIceFootprint ||
        sample.isSouthPolarIceFootprint ||
        sample.isNorthPolarIceFootprint ||
        sample.isIce ||
        sample.isGlacier ||
        sample.isSnowpack ||
        waterClass === "glacier_mass" ||
        visualSurfaceClass.includes("glacier_ice") ||
        visualSurfaceClass.includes("snowpack")
    );
  }

  function isLandSample(sample) {
    if (!sample) return false;

    return Boolean(
      sample.isLandFootprint ||
        sample.isAboveWaterLandFootprint ||
        sample.landVisibleToRoute ||
        sample.landStillVisibleAfterHydration ||
        sample.isLand ||
        sample.land === true
    );
  }

  function isSolidSurfaceSample(sample) {
    if (!sample) return false;
    return Boolean(sample.solidSurfaceLand || sample.topologyLandFootprint || isLandSample(sample) || isIceSample(sample));
  }

  function isWaterSample(sample) {
    if (!sample) return false;

    if (isIceSample(sample)) return false;

    return Boolean(
      sample.isOceanWater ||
        sample.isCoastalWater ||
        sample.isShelfWater ||
        sample.isDeepOcean ||
        sample.isTrenchWater ||
        sample.isRiver ||
        sample.isStream ||
        sample.isLake ||
        sample.waterVisibleToRoute ||
        sample.isWater ||
        String(sample.visualSurfaceClass || "").includes("water")
    );
  }

  function blendRgb(base, overlay, amount) {
    const t = clamp(amount, 0, 1);

    return [
      clamp(Math.round(mix(base[0], overlay[0], t)), 0, 255),
      clamp(Math.round(mix(base[1], overlay[1], t)), 0, 255),
      clamp(Math.round(mix(base[2], overlay[2], t)), 0, 255),
      255
    ];
  }

  function runtimeSurfaceColor(sample, u, v) {
    if (!sample) {
      return [8, 56, 120, 255];
    }

    const visualSurfaceClass = String(sample.visualSurfaceClass || "");
    const waterClass = String(sample.waterClass || "");
    const elevation = clamp(Number(sample.normalizedElevation) || 0, -1, 1);
    const ridge = clamp(Number(sample.ridge) || Number(sample.mountainPressure) || 0, 0, 1);
    const canyon = clamp(Number(sample.canyonPressure) || 0, 0, 1);
    const cliff = clamp(Number(sample.cliffPressure) || Number(sample.coastalCliffPressure) || 0, 0, 1);
    const mineral = clamp(Number(sample.exposedMineralHardnessIndex) || Number(sample.diamondPressureIndex) || 0, 0, 1);
    const turquoise = clamp(Number(sample.coastalTurquoiseIndex) || Number(sample.coastalShelfBlueIndex) || 0, 0, 1);
    const depth = clamp(Number(sample.visibleWaterDepthIndex) || Number(sample.oceanDepthIndex) || 0, 0, 1);
    const shelf = clamp(Number(sample.shelfWaterIndex) || Number(sample.shelfDepthIndex) || 0, 0, 1);
    const hydration = clamp(Number(sample.hydrationActivationIndex) || Number(sample.surfaceWaterIndex) || 0, 0, 1);

    if (isIceSample(sample)) {
      const icePressure = clamp(Number(sample.glacierMassPressure) || Number(sample.snowpackPressure) || 0.72, 0, 1);
      const shadow = 1 - Math.abs(v - 0.5) * 0.10;
      return [
        clamp(Math.round(mix(196, 238, icePressure) * shadow), 166, 250),
        clamp(Math.round(mix(218, 247, icePressure) * shadow), 180, 252),
        clamp(Math.round(mix(232, 255, icePressure) * shadow), 196, 255),
        255
      ];
    }

    if (isWaterSample(sample) || waterClass.includes("ocean") || visualSurfaceClass.includes("water")) {
      let base;

      if (sample.isTrenchWater || waterClass === "trench_water" || visualSurfaceClass.includes("trench")) {
        base = [2, 20, 66, 255];
      } else if (sample.isDeepOcean || waterClass === "deep_ocean_water" || visualSurfaceClass.includes("deep_ocean")) {
        base = [5, 40, 104, 255];
      } else if (sample.isShelfWater || waterClass === "shelf_water" || visualSurfaceClass.includes("shelf")) {
        base = [22, 132, 174, 255];
      } else if (sample.isCoastalWater || waterClass === "coastal_water" || visualSurfaceClass.includes("coastal")) {
        base = [34, 154, 190, 255];
      } else if (sample.isRiver || sample.isStream || sample.isLake) {
        base = [42, 138, 198, 255];
      } else {
        base = [8, 72, 146, 255];
      }

      const deepened = blendRgb(base, [0, 18, 72, 255], clamp(depth * 0.42, 0, 0.55));
      const shelfBlend = blendRgb(deepened, [42, 188, 206, 255], clamp(turquoise * 0.58 + shelf * 0.22, 0, 0.78));
      const hydrated = blendRgb(shelfBlend, [62, 174, 212, 255], clamp(hydration * 0.08, 0, 0.16));

      return hydrated;
    }

    let land = [132, 104, 78, 255];

    if (visualSurfaceClass.includes("beach") || sample.isBeach) {
      const whiteSand = clamp(Number(sample.whiteSandPressure) || Number(sample.opalSoftnessIndex) || 0, 0, 1);
      const blackSand = clamp(Number(sample.blackSandPressure) || Number(sample.diamondDarkSandIndex) || 0, 0, 1);
      land = blendRgb([138, 114, 86, 255], [214, 196, 154, 255], clamp(whiteSand * 0.60, 0, 0.72));
      land = blendRgb(land, [58, 50, 50, 255], clamp(blackSand * 0.22, 0, 0.34));
    } else if (visualSurfaceClass.includes("mountain") || ridge > 0.52) {
      land = blendRgb([126, 104, 88, 255], [166, 146, 118, 255], clamp(ridge * 0.36 + elevation * 0.18, 0, 0.62));
    } else if (visualSurfaceClass.includes("canyon") || canyon > 0.50) {
      land = blendRgb([120, 86, 62, 255], [88, 66, 58, 255], clamp(canyon * 0.35, 0, 0.55));
    } else if (visualSurfaceClass.includes("cliff") || cliff > 0.50) {
      land = blendRgb([116, 102, 92, 255], [152, 136, 114, 255], clamp(cliff * 0.34 + mineral * 0.18, 0, 0.56));
    } else {
      land = blendRgb([124, 98, 72, 255], [156, 124, 88, 255], clamp(elevation * 0.42 + mineral * 0.18, 0, 0.58));
    }

    if (sample.isRiver || sample.isStream || sample.isLake) {
      land = blendRgb(land, [44, 138, 190, 255], clamp(Number(sample.surfaceWaterIndex) || 0.18, 0, 0.44));
    }

    if (sample.hydrationColorInfluence && Number(sample.hydrationColorInfluence.a) > 0) {
      land = blendRgb(
        land,
        [
          Number(sample.hydrationColorInfluence.r) || land[0],
          Number(sample.hydrationColorInfluence.g) || land[1],
          Number(sample.hydrationColorInfluence.b) || land[2],
          255
        ],
        clamp(Number(sample.hydrationColorInfluence.a) * 0.24, 0, 0.34)
      );
    }

    return land;
  }

  function composeRuntimeTexture(runtimeApi, runtimeInstance) {
    const width = CONTROL.textureWidth;
    const height = CONTROL.textureHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let runtimeSamples = 0;
    let solidSurfaceSamples = 0;
    let landSamples = 0;
    let waterSamples = 0;
    let iceSamples = 0;
    let beachSamples = 0;
    let hydratedSamples = 0;
    let oceanWaterSamples = 0;
    let riverSamples = 0;
    let streamSamples = 0;
    let lakeSamples = 0;
    let glacierSamples = 0;
    let snowpackSamples = 0;
    let floodplainSamples = 0;
    let deltaSamples = 0;
    let springSamples = 0;
    let subterraneanSamples = 0;
    let foliageSamples = 0;
    let fallbackSamples = 0;

    let maxSurfaceWaterIndex = 0;
    let maxHydrationActivationIndex = 0;

    for (let py = 0; py < height; py += 1) {
      const v = height <= 1 ? 0.5 : py / (height - 1);

      for (let px = 0; px < width; px += 1) {
        const u = width <= 1 ? 0.5 : px / (width - 1);
        const index = (py * width + px) * 4;

        const sample = sampleRuntimeState(runtimeApi, runtimeInstance, u, v);
        const color = runtimeSurfaceColor(sample, u, v);

        runtimeSamples += 1;

        if (isSolidSurfaceSample(sample)) solidSurfaceSamples += 1;
        if (isLandSample(sample)) landSamples += 1;
        if (isWaterSample(sample)) waterSamples += 1;
        if (isIceSample(sample)) iceSamples += 1;
        if (sample && (sample.isBeach || String(sample.visualSurfaceClass || "").includes("beach"))) beachSamples += 1;
        if (sample && sample.isHydrated) hydratedSamples += 1;
        if (sample && sample.isOceanWater) oceanWaterSamples += 1;
        if (sample && sample.isRiver) riverSamples += 1;
        if (sample && sample.isStream) streamSamples += 1;
        if (sample && sample.isLake) lakeSamples += 1;
        if (sample && sample.isGlacier) glacierSamples += 1;
        if (sample && sample.isSnowpack) snowpackSamples += 1;
        if (sample && sample.isFloodplain) floodplainSamples += 1;
        if (sample && sample.isDelta) deltaSamples += 1;
        if (sample && sample.isSpring) springSamples += 1;
        if (sample && sample.isSubterraneanWater) subterraneanSamples += 1;
        if (sample && sample.fallbackUsed) fallbackSamples += 1;

        if (sample) {
          maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, Number(sample.surfaceWaterIndex) || 0);
          maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, Number(sample.hydrationActivationIndex) || 0);
        }

        if (sample && (sample.foliage || sample.trees || sample.vegetation)) {
          foliageSamples += 1;
        }

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = color[3];
      }
    }

    ctx.putImageData(image, 0, 0);

    const textureImage = ctx.getImageData(0, 0, width, height);

    return Object.freeze({
      canvas,
      image: textureImage,
      data: textureImage.data,
      width,
      height,
      stats: Object.freeze({
        runtimeSamples,
        solidSurfaceSamples,
        landSamples,
        waterSamples,
        iceSamples,
        beachSamples,
        hydratedSamples,
        oceanWaterSamples,
        riverSamples,
        streamSamples,
        lakeSamples,
        glacierSamples,
        snowpackSamples,
        floodplainSamples,
        deltaSamples,
        springSamples,
        subterraneanSamples,
        foliageSamples,
        fallbackSamples,
        maxSurfaceWaterIndex,
        maxHydrationActivationIndex,
        compositorStatus: runtimeApi ? "current-runtime-hex-surface-texture-active" : "runtime-unavailable-ocean-safe-fallback"
      })
    });
  }

  function createStage(mount) {
    const stage = document.createElement("div");
    stage.className = "audralia-orthographic-stage";
    stage.dataset.body = BODY;
    stage.dataset.route = ROUTE;
    stage.dataset.contract = RECEIPT;
    stage.dataset.activeRenewal = ACTIVE_RENEWAL;
    stage.dataset.hexSurfaceChild = HEX_CHILD_RECEIPT;
    stage.dataset.previousContracts = PREVIOUS_RECEIPTS.join("|");
    stage.dataset.axisDegrees = String(CONTROL.axisDegrees);
    stage.dataset.compositorModel = CONTROL.compositorModel;
    stage.dataset.activeSurfaceRenderer = CONTROL.activeSurfaceRenderer;
    stage.dataset.rotationModel = CONTROL.rotationModel;
    stage.dataset.projectionModel = CONTROL.projectionModel;
    stage.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    stage.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    stage.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    stage.dataset.flatMapOnSphere = CONTROL.flatMapOnSphere;
    stage.dataset.routeOwnedLandGeneration = CONTROL.routeOwnedLandGeneration;
    stage.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    stage.dataset.hydrationReadout = "runtime-only";
    stage.dataset.noTrees = "true";
    stage.dataset.noFoliage = "true";
    stage.dataset.noVegetation = "true";
    stage.style.setProperty("--audralia-axis-deg", CONTROL.axisDegrees + "deg");

    const axis = document.createElement("div");
    axis.className = "audralia-orthographic-axis";
    axis.dataset.axis = "audralia-fixed-axis";

    const canvas = document.createElement("canvas");
    canvas.className = "audralia-orthographic-canvas";
    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.activeRenewal = ACTIVE_RENEWAL;
    canvas.dataset.hexSurfaceChild = HEX_CHILD_RECEIPT;
    canvas.dataset.previousContracts = PREVIOUS_RECEIPTS.join("|");
    canvas.dataset.rotationModel = CONTROL.rotationModel;
    canvas.dataset.projectionModel = CONTROL.projectionModel;
    canvas.dataset.compositorModel = CONTROL.compositorModel;
    canvas.dataset.activeSurfaceRenderer = CONTROL.activeSurfaceRenderer;
    canvas.dataset.diskRotation = CONTROL.diskRotation;
    canvas.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    canvas.dataset.flatMapOnSphere = CONTROL.flatMapOnSphere;
    canvas.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    canvas.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    canvas.dataset.routeOwnedLandGeneration = CONTROL.routeOwnedLandGeneration;
    canvas.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    canvas.dataset.noTrees = "true";
    canvas.dataset.noFoliage = "true";
    canvas.dataset.noVegetation = "true";
    canvas.dataset.hydration = CONTROL.hydration;
    canvas.dataset.hydrationReadout = "runtime-only";
    canvas.dataset.visualPass = CONTROL.visualPass;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Audralia true orthographic globe render with hexagonal runtime surface sampling");

    const label = document.createElement("div");
    label.className = "audralia-orthographic-label";
    label.textContent = "AUDRALIA · HEX RUNTIME";

    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-orthographic-hidden-receipt";
    receipt.dataset.contract = RECEIPT;
    receipt.dataset.activeRenewal = ACTIVE_RENEWAL;
    receipt.dataset.hexSurfaceChild = HEX_CHILD_RECEIPT;
    receipt.dataset.previousContracts = PREVIOUS_RECEIPTS.join("|");
    receipt.dataset.route = ROUTE;
    receipt.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    receipt.dataset.runtimeVersion = RUNTIME_VERSION;
    receipt.dataset.hexSurfaceChildAuthority = HEX_CHILD_AUTHORITY;
    receipt.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    receipt.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    receipt.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    receipt.dataset.flatMapOnSphere = CONTROL.flatMapOnSphere;
    receipt.dataset.routeOwnedLandGeneration = CONTROL.routeOwnedLandGeneration;
    receipt.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    receipt.dataset.noTrees = "true";
    receipt.dataset.noFoliage = "true";
    receipt.dataset.noVegetation = "true";
    receipt.dataset.hydration = CONTROL.hydration;
    receipt.dataset.hydrationReadout = "runtime-only";
    receipt.dataset.graphicBox = "false";
    receipt.dataset.imageGeneration = "false";
    receipt.dataset.visualPass = CONTROL.visualPass;
    receipt.textContent =
      "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1 " +
      "ACTIVE_RENEWAL=AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TWO_FILE_TNT_v1 " +
      "HEX_CHILD=AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1 " +
      "projection=orthographic visible_hemisphere=180deg hidden_hemisphere=180deg " +
      "full_texture_on_visible_face=false flat_map_on_sphere=false " +
      "route_owned_land_generation=false route_owned_water_generation=false " +
      "runtime_hydration_readout=true hex_surface_child=true graphic_box=false image_generation=false visual_pass=held";

    stage.appendChild(axis);
    stage.appendChild(canvas);
    stage.appendChild(label);
    stage.appendChild(receipt);

    mount.replaceChildren(stage);

    mount.dataset.body = BODY;
    mount.dataset.route = ROUTE;
    mount.dataset.contract = RECEIPT;
    mount.dataset.activeRenewal = ACTIVE_RENEWAL;
    mount.dataset.hexSurfaceChild = HEX_CHILD_RECEIPT;
    mount.dataset.previousContracts = PREVIOUS_RECEIPTS.join("|");
    mount.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    mount.dataset.runtimeVersion = RUNTIME_VERSION;
    mount.dataset.hexSurfaceChildAuthority = HEX_CHILD_AUTHORITY;
    mount.dataset.compositorModel = CONTROL.compositorModel;
    mount.dataset.activeSurfaceRenderer = CONTROL.activeSurfaceRenderer;
    mount.dataset.rotationModel = CONTROL.rotationModel;
    mount.dataset.projectionModel = CONTROL.projectionModel;
    mount.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    mount.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    mount.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    mount.dataset.flatMapOnSphere = CONTROL.flatMapOnSphere;
    mount.dataset.routeOwnedLandGeneration = CONTROL.routeOwnedLandGeneration;
    mount.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    mount.dataset.newFileRequired = "false";
    mount.dataset.noTrees = "true";
    mount.dataset.noFoliage = "true";
    mount.dataset.noVegetation = "true";
    mount.dataset.hydration = CONTROL.hydration;
    mount.dataset.hydrationReadout = "runtime-only";
    mount.dataset.earthAdoption = "blocked";
    mount.dataset.graphicBox = "false";
    mount.dataset.imageGeneration = "false";
    mount.dataset.visualPass = CONTROL.visualPass;

    return { stage, canvas };
  }

  function sizeCanvas(canvas, mount) {
    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const available = rect && rect.width ? rect.width : window.innerWidth - 32;
    const cssSize = clamp(Math.floor(available * 0.88), CONTROL.minSize, CONTROL.maxSize);
    const dpr = Math.min(1.25, Math.max(1, window.devicePixelRatio || 1));
    const px = Math.max(CONTROL.minSize, Math.floor(cssSize * dpr));
    const changed = canvas.width !== px || canvas.height !== px;

    if (changed) {
      canvas.width = px;
      canvas.height = px;
    }

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    return { size: px, changed };
  }

  function buildFallbackGeometry(size) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;

    let count = 0;

    for (let py = 0; py < size; py += 1) {
      const y = (py + 0.5 - cy) / radius;

      for (let px = 0; px < size; px += 1) {
        const x = (px + 0.5 - cx) / radius;
        if (x * x + y * y <= 1) count += 1;
      }
    }

    const indices = new Uint32Array(count);
    const lonOffsets = new Float32Array(count);
    const vCoords = new Float32Array(count);
    const shades = new Float32Array(count);

    const lightX = -0.42;
    const lightY = 0.36;
    const lightZ = 0.83;

    let i = 0;

    for (let py = 0; py < size; py += 1) {
      const y = (py + 0.5 - cy) / radius;

      for (let px = 0; px < size; px += 1) {
        const x = (px + 0.5 - cx) / radius;
        const r2 = x * x + y * y;

        if (r2 > 1) continue;

        const z = Math.sqrt(Math.max(0, 1 - r2));
        const lonOffset = Math.atan2(x, z) / (Math.PI * 2);
        const latitude = Math.asin(clamp(-y, -1, 1));
        const v = clamp(0.5 - latitude / Math.PI, 0, 1);

        const dot = clamp(x * lightX + (-y) * lightY + z * lightZ, -1, 1);
        const edgeShadow = clamp(1 - Math.pow(r2, 1.7) * 0.34, 0.52, 1);
        const hemisphereShade = clamp(0.68 + dot * 0.34, 0.44, 1.10);
        const shade = clamp(edgeShadow * hemisphereShade, 0.42, 1.12);

        indices[i] = (py * size + px) * 4;
        lonOffsets[i] = lonOffset;
        vCoords[i] = v;
        shades[i] = shade;
        i += 1;
      }
    }

    return Object.freeze({ size, radius, count, indices, lonOffsets, vCoords, shades });
  }

  function sampleTexture(texture, u, v) {
    const tx = Math.floor(wrap01(u) * (texture.width - 1));
    const ty = Math.floor(clamp(v, 0, 1) * (texture.height - 1));
    const index = (ty * texture.width + tx) * 4;

    return [
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2],
      texture.data[index + 3]
    ];
  }

  function drawFallbackOrthographicSphere(state) {
    const sizing = sizeCanvas(state.canvas, state.mount);
    const size = sizing.size;

    if (sizing.changed) {
      state.geometry = null;
      state.hexGeometry = null;
    }

    if (!state.geometry || state.geometry.size !== size) {
      state.geometry = buildFallbackGeometry(size);
    }

    const output = state.ctx.createImageData(size, size);
    const data = output.data;
    const geometry = state.geometry;
    const texture = state.texture;

    for (let i = 0; i < geometry.count; i += 1) {
      const out = geometry.indices[i];
      const u = wrap01(state.phase + geometry.lonOffsets[i]);
      const v = geometry.vCoords[i];
      const color = sampleTexture(texture, u, v);
      const shade = geometry.shades[i];

      data[out] = clamp(Math.round(color[0] * shade), 0, 255);
      data[out + 1] = clamp(Math.round(color[1] * shade), 0, 255);
      data[out + 2] = clamp(Math.round(color[2] * shade), 0, 255);
      data[out + 3] = color[3];
    }

    state.ctx.putImageData(output, 0, 0);

    state.ctx.save();

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;

    state.ctx.beginPath();
    state.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    state.ctx.clip();

    const highlight = state.ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.36,
      radius * 0.02,
      cx,
      cy,
      radius * 1.16
    );

    highlight.addColorStop(0, "rgba(255,255,255,0.16)");
    highlight.addColorStop(0.32, "rgba(255,255,255,0.045)");
    highlight.addColorStop(0.74, "rgba(0,0,0,0.10)");
    highlight.addColorStop(1, "rgba(0,0,0,0.42)");

    state.ctx.fillStyle = highlight;
    state.ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const edge = state.ctx.createRadialGradient(cx, cy, radius * 0.68, cx, cy, radius);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.78, "rgba(8,23,44,0.16)");
    edge.addColorStop(1, "rgba(4,10,20,0.56)");

    state.ctx.fillStyle = edge;
    state.ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    state.ctx.restore();

    state.ctx.save();
    state.ctx.beginPath();
    state.ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    state.ctx.strokeStyle = "rgba(190,226,255,0.28)";
    state.ctx.lineWidth = Math.max(1, size * 0.003);
    state.ctx.stroke();
    state.ctx.restore();
  }

  function drawFrame(state) {
    const sizing = sizeCanvas(state.canvas, state.mount);

    if (sizing.changed) {
      state.geometry = null;
      state.hexGeometry = null;
    }

    if (state.hexRenderer && typeof state.hexRenderer.drawAudraliaHexSurfaceFrame === "function") {
      try {
        const result = state.hexRenderer.drawAudraliaHexSurfaceFrame(state, {
          hexDensity: 176,
          edgeDarkening: 0.105,
          seamSoftening: 0.055
        });

        state.lastHexResult = result;
        state.canvas.dataset.renderMode = "hex-surface-child";
        state.mount.dataset.renderMode = "hex-surface-child";
      } catch (error) {
        state.lastHexError = String(error && error.message ? error.message : error);
        state.canvas.dataset.renderMode = "fallback-orthographic-pixel";
        state.mount.dataset.renderMode = "fallback-orthographic-pixel";
        drawFallbackOrthographicSphere(state);
      }
    } else {
      state.canvas.dataset.renderMode = "fallback-orthographic-pixel";
      state.mount.dataset.renderMode = "fallback-orthographic-pixel";
      drawFallbackOrthographicSphere(state);
    }

    state.canvas.dataset.phase = state.phase.toFixed(5);
    state.canvas.dataset.velocity = state.velocity.toFixed(6);
    state.canvas.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    state.canvas.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    state.canvas.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    state.canvas.dataset.projectionModel = CONTROL.projectionModel;
    state.canvas.dataset.hydration = CONTROL.hydration;
    state.canvas.dataset.hydrationReadout = "runtime-only";
    state.canvas.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    state.canvas.dataset.activeRenewal = ACTIVE_RENEWAL;
    state.canvas.dataset.hexSurfaceChild = HEX_CHILD_RECEIPT;

    state.mount.dataset.phase = state.phase.toFixed(5);
    state.mount.dataset.velocity = state.velocity.toFixed(6);
  }

  function attachControls(state) {
    const canvas = state.canvas;

    function point(event) {
      const source = event.touches && event.touches[0] ? event.touches[0] : event;
      return { x: source.clientX };
    }

    function down(event) {
      const p = point(event);
      state.dragging = true;
      state.lastX = p.x;
      state.velocity = 0;
      canvas.dataset.dragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (error) {}
      }

      if (event.cancelable) event.preventDefault();
    }

    function move(event) {
      if (!state.dragging) return;

      const p = point(event);
      const dx = p.x - state.lastX;
      state.lastX = p.x;

      const delta = -dx * CONTROL.dragFactor;
      state.phase = wrap01(state.phase + delta);
      state.velocity = delta * 0.58;

      drawFrame(state);

      if (event.cancelable) event.preventDefault();
    }

    function up() {
      state.dragging = false;
      canvas.dataset.dragging = "false";
    }

    canvas.addEventListener("pointerdown", down, { passive: false });
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    state.cleanup.push(function () {
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    });
  }

  function tick(state) {
    if (!state.running) return;

    state.phase = wrap01(state.phase + CONTROL.autoStep + state.velocity);
    state.velocity *= CONTROL.releaseFriction;

    if (Math.abs(state.velocity) < CONTROL.minVelocity) {
      state.velocity = 0;
    }

    drawFrame(state);

    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });
  }

  function destroyActiveState() {
    if (!activeState) return;

    activeState.running = false;

    if (activeState.raf) {
      window.cancelAnimationFrame(activeState.raf);
    }

    activeState.cleanup.forEach(function (fn) {
      fn();
    });

    activeState = null;
  }

  function applyStatsToDatasets(mount, texture, runtimeApi, runtimeInstance, hexRenderer) {
    const stats = texture.stats;

    document.documentElement.dataset.audraliaRuntimeAuthorityLoaded = String(Boolean(runtimeApi));
    document.documentElement.dataset.audraliaRuntimeInstanceLoaded = String(Boolean(runtimeInstance));
    document.documentElement.dataset.audraliaRuntimeLoadedReceipt = RUNTIME_VERSION;
    document.documentElement.dataset.audraliaComposedTexture = stats.compositorStatus;
    document.documentElement.dataset.audraliaProjectionModel = CONTROL.projectionModel;
    document.documentElement.dataset.audraliaVisibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    document.documentElement.dataset.audraliaHiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    document.documentElement.dataset.audraliaFullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    document.documentElement.dataset.audraliaFlatMapOnSphere = CONTROL.flatMapOnSphere;
    document.documentElement.dataset.audraliaHydrationReadout = "runtime-only";
    document.documentElement.dataset.audraliaActiveRenewal = ACTIVE_RENEWAL;
    document.documentElement.dataset.audraliaHexSurfaceChildLoaded = String(Boolean(hexRenderer));
    document.documentElement.dataset.audraliaSolidSurfaceSamples = String(stats.solidSurfaceSamples);
    document.documentElement.dataset.audraliaHydratedSamples = String(stats.hydratedSamples);
    document.documentElement.dataset.audraliaOceanWaterSamples = String(stats.oceanWaterSamples);
    document.documentElement.dataset.audraliaRiverSamples = String(stats.riverSamples);
    document.documentElement.dataset.audraliaStreamSamples = String(stats.streamSamples);
    document.documentElement.dataset.audraliaLakeSamples = String(stats.lakeSamples);
    document.documentElement.dataset.audraliaGlacierSamples = String(stats.glacierSamples);
    document.documentElement.dataset.audraliaFoliageSamples = String(stats.foliageSamples);

    mount.dataset.runtimeAuthorityLoaded = String(Boolean(runtimeApi));
    mount.dataset.runtimeInstanceLoaded = String(Boolean(runtimeInstance));
    mount.dataset.runtimeLoadedReceipt = RUNTIME_VERSION;
    mount.dataset.hexSurfaceChildLoaded = String(Boolean(hexRenderer));
    mount.dataset.composedTexture = stats.compositorStatus;
    mount.dataset.runtimeSamples = String(stats.runtimeSamples);
    mount.dataset.solidSurfaceSamples = String(stats.solidSurfaceSamples);
    mount.dataset.landSamples = String(stats.landSamples);
    mount.dataset.waterSamples = String(stats.waterSamples);
    mount.dataset.iceSamples = String(stats.iceSamples);
    mount.dataset.beachSamples = String(stats.beachSamples);
    mount.dataset.hydratedSamples = String(stats.hydratedSamples);
    mount.dataset.oceanWaterSamples = String(stats.oceanWaterSamples);
    mount.dataset.riverSamples = String(stats.riverSamples);
    mount.dataset.streamSamples = String(stats.streamSamples);
    mount.dataset.lakeSamples = String(stats.lakeSamples);
    mount.dataset.glacierSamples = String(stats.glacierSamples);
    mount.dataset.snowpackSamples = String(stats.snowpackSamples);
    mount.dataset.floodplainSamples = String(stats.floodplainSamples);
    mount.dataset.deltaSamples = String(stats.deltaSamples);
    mount.dataset.springSamples = String(stats.springSamples);
    mount.dataset.subterraneanSamples = String(stats.subterraneanSamples);
    mount.dataset.foliageSamples = String(stats.foliageSamples);
    mount.dataset.fallbackSamples = String(stats.fallbackSamples);
    mount.dataset.maxSurfaceWaterIndex = String(stats.maxSurfaceWaterIndex.toFixed(4));
    mount.dataset.maxHydrationActivationIndex = String(stats.maxHydrationActivationIndex.toFixed(4));
    mount.dataset.projectionModel = CONTROL.projectionModel;
    mount.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    mount.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    mount.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    mount.dataset.flatMapOnSphere = CONTROL.flatMapOnSphere;
    mount.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    mount.dataset.hydrationReadout = "runtime-only";
  }

  async function boot() {
    markRoute("booting");
    ensureStyle();

    const mount = getMount();

    if (!mount) {
      markRoute("missing-mount");
      return;
    }

    destroyActiveState();

    const runtimeApi = await loadRuntimeAuthority();
    const runtimeInstance = createRuntimeInstance(runtimeApi);
    const hexRenderer = await loadHexSurfaceChild();
    const texture = composeRuntimeTexture(runtimeApi, runtimeInstance);
    const parts = createStage(mount);
    const ctx = parts.canvas.getContext("2d", { alpha: true, willReadFrequently: true });

    const state = {
      mount,
      stage: parts.stage,
      canvas: parts.canvas,
      ctx,
      texture,
      runtimeApi,
      runtimeInstance,
      hexRenderer,
      geometry: null,
      hexGeometry: null,
      phase: CONTROL.initialPhase,
      velocity: 0,
      dragging: false,
      lastX: 0,
      running: false,
      raf: 0,
      cleanup: [],
      lastHexResult: null,
      lastHexError: ""
    };

    activeState = state;

    applyStatsToDatasets(mount, texture, runtimeApi, runtimeInstance, hexRenderer);
    attachControls(state);
    drawFrame(state);

    state.running = true;
    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });

    markRoute("active");

    window.dispatchEvent(
      new CustomEvent("dgb:audralia-g7-hex-surface-globe-ready", {
        detail: {
          body: BODY,
          label: LABEL,
          route: ROUTE,
          receipt: RECEIPT,
          activeRenewal: ACTIVE_RENEWAL,
          hexSurfaceChild: HEX_CHILD_RECEIPT,
          previousReceipts: PREVIOUS_RECEIPTS,
          runtimeAuthority: RUNTIME_AUTHORITY,
          runtimeVersion: RUNTIME_VERSION,
          hexSurfaceChildAuthority: HEX_CHILD_AUTHORITY,
          runtimeLoaded: Boolean(runtimeApi),
          runtimeInstanceLoaded: Boolean(runtimeInstance),
          hexSurfaceChildLoaded: Boolean(hexRenderer),
          composedTexture: texture.stats.compositorStatus,
          runtimeSamples: texture.stats.runtimeSamples,
          solidSurfaceSamples: texture.stats.solidSurfaceSamples,
          landSamples: texture.stats.landSamples,
          waterSamples: texture.stats.waterSamples,
          iceSamples: texture.stats.iceSamples,
          beachSamples: texture.stats.beachSamples,
          hydratedSamples: texture.stats.hydratedSamples,
          oceanWaterSamples: texture.stats.oceanWaterSamples,
          riverSamples: texture.stats.riverSamples,
          streamSamples: texture.stats.streamSamples,
          lakeSamples: texture.stats.lakeSamples,
          glacierSamples: texture.stats.glacierSamples,
          snowpackSamples: texture.stats.snowpackSamples,
          floodplainSamples: texture.stats.floodplainSamples,
          deltaSamples: texture.stats.deltaSamples,
          springSamples: texture.stats.springSamples,
          subterraneanSamples: texture.stats.subterraneanSamples,
          foliageSamples: texture.stats.foliageSamples,
          fallbackSamples: texture.stats.fallbackSamples,
          maxSurfaceWaterIndex: texture.stats.maxSurfaceWaterIndex,
          maxHydrationActivationIndex: texture.stats.maxHydrationActivationIndex,
          projectionModel: CONTROL.projectionModel,
          visibleLongitudeSpanDegrees: CONTROL.visibleLongitudeSpanDegrees,
          hiddenLongitudeSpanDegrees: CONTROL.hiddenLongitudeSpanDegrees,
          fullTextureOnVisibleFace: false,
          flatMapOnSphere: false,
          routeOwnedLandGeneration: false,
          routeOwnedWaterGeneration: false,
          runtimeHydrationReadout: true,
          hexSurfaceChildRenderer: Boolean(hexRenderer),
          noTrees: true,
          noFoliage: true,
          noVegetation: true,
          climate: CONTROL.climate,
          ecology: CONTROL.ecology,
          animals: CONTROL.animals,
          marineLife: CONTROL.marineLife,
          hydration: CONTROL.hydration,
          graphicBox: false,
          imageGeneration: false,
          visualPass: CONTROL.visualPass
        }
      })
    );
  }

  window.DGBAudraliaRouteControl = Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    hexSurfaceChild: HEX_CHILD_RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    body: BODY,
    label: LABEL,
    route: ROUTE,
    runtimeAuthority: RUNTIME_AUTHORITY,
    runtimeVersion: RUNTIME_VERSION,
    hexSurfaceChildAuthority: HEX_CHILD_AUTHORITY,
    control: CONTROL,
    boot,
    getStatus: function () {
      return Object.freeze({
        ok: Boolean(activeState && activeState.runtimeApi && activeState.runtimeInstance),
        receipt: RECEIPT,
        activeRenewal: ACTIVE_RENEWAL,
        hexSurfaceChild: HEX_CHILD_RECEIPT,
        previousReceipts: PREVIOUS_RECEIPTS,
        body: BODY,
        route: ROUTE,
        runtimeAuthority: RUNTIME_AUTHORITY,
        runtimeVersion: RUNTIME_VERSION,
        runtimeLoadedReceipt: activeState && activeState.runtimeApi ? RUNTIME_VERSION : "",
        runtimeLoaded: Boolean(activeState && activeState.runtimeApi),
        runtimeInstanceLoaded: Boolean(activeState && activeState.runtimeInstance),
        hexSurfaceChildLoaded: Boolean(activeState && activeState.hexRenderer),
        compositorModel: CONTROL.compositorModel,
        activeSurfaceRenderer: CONTROL.activeSurfaceRenderer,
        rotationModel: CONTROL.rotationModel,
        projectionModel: CONTROL.projectionModel,
        phase: activeState ? activeState.phase : null,
        velocity: activeState ? activeState.velocity : null,
        visibleLongitudeSpanDegrees: CONTROL.visibleLongitudeSpanDegrees,
        hiddenLongitudeSpanDegrees: CONTROL.hiddenLongitudeSpanDegrees,
        fullTextureOnVisibleFace: false,
        flatMapOnSphere: false,
        routeOwnedLandGeneration: false,
        routeOwnedWaterGeneration: false,
        runtimeHydrationReadout: true,
        topologyRewrittenHere: false,
        tectonicsRewrittenHere: false,
        terrainRewrittenHere: false,
        hydrationRewrittenHere: false,
        climateRewrittenHere: false,
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
        visualPassClaimed: false
      });
    }
  });

  window.DGBAudraliaExistingRouteCompositor = window.DGBAudraliaRouteControl;
  window.DGBAudraliaTrueGlobeRenderer = window.DGBAudraliaRouteControl;
  window.DGBAudraliaTrueOrthographicRenderer = window.DGBAudraliaRouteControl;
  window.DGBAudraliaRuntimeHydrationWaterRenderer = window.DGBAudraliaRouteControl;
  window.DGBAudraliaG7HexSurfaceRouteRenderer = window.DGBAudraliaRouteControl;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
