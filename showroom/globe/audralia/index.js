// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1
//
// Role:
// - Audralia route compositor.
// - Consumes Audralia runtime only.
// - Renders Audralia as a true orthographic globe.
// - Shows only the front-facing hemisphere.
// - Reads current runtime surface output.
// - Displays land, beach, relief, hydration, water depth, glaciers, rivers, lakes, and ocean classes from runtime.
// - Does not generate land, terrain, or water in the route.
//
// Correction:
// - Previous route script still imported runtime with stale RUNTIME_VERSION.
// - This route forces the current runtime contract:
//   AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1
// - This route rejects stale window runtime APIs if their status receipt does not match.
// - Route remains downstream display only.
//
// Hard locks:
// - No route-owned land generation.
// - No route-owned water generation.
// - No topology rewrite.
// - No tectonics rewrite.
// - No terrain rewrite.
// - No hydration rewrite.
// - No climate.
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

  const PREVIOUS_RECEIPTS = Object.freeze([
    "AUDRALIA_ROUTE_RUNTIME_HYDRATION_WATER_RENDER_TNT_v1",
    "AUDRALIA_ROUTE_TRUE_ORTHOGRAPHIC_GLOBE_RENDER_TNT_v2",
    "AUDRALIA_ROUTE_TRUE_GLOBE_VISIBLE_HEMISPHERE_RENDER_TNT_v1"
  ]);

  const ROUTE = "/showroom/globe/audralia/";
  const BODY = "audralia";
  const LABEL = "Audralia";

  const RUNTIME_AUTHORITY = "/assets/audralia/audralia.runtime.js";
  const RUNTIME_VERSION = "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1";

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

    diskRotation: "forbidden",
    fullTextureOnVisibleFace: "forbidden",
    flatMapOnSphere: "forbidden",
    routeOwnedLandGeneration: "forbidden",
    routeOwnedWaterGeneration: "forbidden",
    topologyRewriteHere: "forbidden",
    tectonicsRewriteHere: "forbidden",
    terrainRewriteHere: "forbidden",
    hydrationRewriteHere: "forbidden",
    hydration: "runtime-read-only-active",
    climate: "forbidden",
    ecology: "forbidden",
    foliage: "forbidden",
    trees: "forbidden",
    vegetation: "forbidden",
    animals: "forbidden",
    marineLife: "forbidden",
    constructCivilization: "forbidden",
    visualPass: "HELD_UNTIL_OWNER_SCREENSHOT_CONFIRMATION"
  });

  const RUNTIME_CONTEXT = Object.freeze({
    consumesTectonicGenealogy: true,
    consumesHydrationParent: true,
    hydrationEnabled: true,
    hydrationAllowedToRender: true,
    allowsTectonics: true,
    allowsTopology: true,
    allowsTerrain: true,
    allowsHydration: true,
    allowsWater: true,
    allowsLand: true,
    allowsBeachOutline: true,
    allowsRelief: true,
    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,
    runtimeImportsOceansDirectly: false,
    foliageEnabled: false,
    climateEnabled: false,
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
    return ((value % 1) + 1) % 1;
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
  }

  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = fract(x);
    const fy = fract(y);

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    let total = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let normalizer = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
      normalizer += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return total / Math.max(0.00001, normalizer);
  }

  function cacheUrl(path, version) {
    return (
      path +
      "?v=" +
      encodeURIComponent(version) +
      "&consumer=" +
      encodeURIComponent(RECEIPT) +
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
    document.documentElement.dataset.audraliaPreviousRouteCompositors = PREVIOUS_RECEIPTS.join("|");
    document.documentElement.dataset.audraliaRouteCompositorStatus = status || "booting";
    document.documentElement.dataset.audraliaRuntimeAuthority = RUNTIME_AUTHORITY;
    document.documentElement.dataset.audraliaRuntimeVersion = RUNTIME_VERSION;
    document.documentElement.dataset.audraliaCompositorModel = CONTROL.compositorModel;
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
    document.documentElement.dataset.audraliaFoliage = CONTROL.foliage;
    document.documentElement.dataset.audraliaClimate = CONTROL.climate;
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
      document.body.dataset.publicReceipts = "hidden";
      document.body.dataset.earthAdoption = "blocked";
      document.body.dataset.noTrees = "true";
      document.body.dataset.noFoliage = "true";
      document.body.dataset.noVegetation = "true";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function ensureStyle() {
    if (document.getElementById("audralia-current-runtime-genealogy-globe-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-current-runtime-genealogy-globe-style";
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

  function runtimeReceipt(api) {
    if (!api) return "";

    try {
      if (typeof api.getRuntimeStatus === "function") {
        const status = api.getRuntimeStatus();
        return String(status && status.receipt ? status.receipt : "");
      }
    } catch (error) {}

    try {
      if (typeof api.createAudraliaRuntime === "function") {
        const instance = api.createAudraliaRuntime(RUNTIME_CONTEXT);
        if (instance && typeof instance.getStatus === "function") {
          const status = instance.getStatus();
          return String(status && status.receipt ? status.receipt : "");
        }
        return String(instance && instance.receipt ? instance.receipt : "");
      }
    } catch (error) {}

    return String(api.receipt || "");
  }

  function runtimeMatchesCurrent(api) {
    return runtimeReceipt(api) === RUNTIME_VERSION;
  }

  function getWindowRuntimeApi() {
    return (
      window.DGBAudraliaRuntime ||
      window.AudraliaRuntime ||
      window.audraliaRuntime ||
      null
    );
  }

  async function importCurrentRuntime() {
    try {
      const module = await import(cacheUrl(RUNTIME_AUTHORITY, RUNTIME_VERSION));
      return resolveRuntimeApi(module);
    } catch (error) {
      document.documentElement.dataset.audraliaRuntimeImportError = error && error.message ? error.message : String(error);
      return null;
    }
  }

  async function loadRuntimeAuthority() {
    const imported = await importCurrentRuntime();

    if (imported && runtimeMatchesCurrent(imported)) {
      document.documentElement.dataset.audraliaRuntimeSource = "fresh-import-current";
      return imported;
    }

    if (imported) {
      document.documentElement.dataset.audraliaRuntimeSource = "fresh-import-receipt-mismatch";
      document.documentElement.dataset.audraliaRuntimeImportedReceipt = runtimeReceipt(imported);
      return imported;
    }

    const existing = resolveRuntimeApi(getWindowRuntimeApi());

    if (existing && runtimeMatchesCurrent(existing)) {
      document.documentElement.dataset.audraliaRuntimeSource = "window-current";
      return existing;
    }

    if (existing) {
      document.documentElement.dataset.audraliaRuntimeSource = "window-stale-rejected";
      document.documentElement.dataset.audraliaRuntimeWindowReceipt = runtimeReceipt(existing);
    } else {
      document.documentElement.dataset.audraliaRuntimeSource = "runtime-unavailable";
    }

    return null;
  }

  function createRuntimeInstance(runtimeApi) {
    if (!runtimeApi) return null;

    if (typeof runtimeApi.createAudraliaRuntime === "function") {
      try {
        return runtimeApi.createAudraliaRuntime(RUNTIME_CONTEXT);
      } catch (error) {
        document.documentElement.dataset.audraliaRuntimeInstanceError = error && error.message ? error.message : String(error);
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

  function isLandSample(sample) {
    return Boolean(
      sample &&
        (
          sample.landVisibleToRoute ||
          sample.isLandFootprint ||
          sample.isAboveWaterLandFootprint ||
          sample.isLand ||
          sample.visualSurfaceClass === "beach_outline_land_surface" ||
          sample.visualSurfaceClass === "mountain_relief_land_surface" ||
          sample.visualSurfaceClass === "canyon_cut_land_surface" ||
          sample.visualSurfaceClass === "cliff_rock_land_surface" ||
          sample.visualSurfaceClass === "inland_terrain_land_surface"
        )
    );
  }

  function isIceSample(sample) {
    return Boolean(
      sample &&
        (
          sample.isIce ||
          sample.isGlacier ||
          sample.isPolarIceFootprint ||
          sample.isSouthPolarIceFootprint ||
          sample.isNorthPolarIceFootprint ||
          sample.southIce ||
          sample.surfaceClass === "polar_ice_footprint" ||
          sample.topologySurfaceClass === "polar_ice_footprint" ||
          sample.visualSurfaceClass === "glacier_ice_snowpack_surface"
        )
    );
  }

  function isBeachSample(sample) {
    return Boolean(
      sample &&
        (
          sample.isBeach ||
          sample.isSand ||
          sample.visualSurfaceClass === "beach_outline_land_surface" ||
          String(sample.beachType || "").includes("beach") ||
          String(sample.surfaceClass || "").includes("beach") ||
          String(sample.topologySurfaceClass || "").includes("beach")
        )
    );
  }

  function isRockSample(sample) {
    return Boolean(
      sample &&
        (
          sample.isRock ||
          sample.visualSurfaceClass === "cliff_rock_land_surface" ||
          String(sample.surfaceClass || "").includes("rock") ||
          String(sample.topologySurfaceClass || "").includes("rock") ||
          Number(sample.rockPressure) > 0.44
        )
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

  function hydrationColorFromRuntime(sample, baseColor) {
    if (!sample) return baseColor;

    const waterClass = String(sample.waterClass || "");
    const visualSurfaceClass = String(sample.visualSurfaceClass || "");

    const surfaceWaterIndex = clamp(Number(sample.surfaceWaterIndex) || 0, 0, 1);
    const hydrationActivationIndex = clamp(Number(sample.hydrationActivationIndex) || 0, 0, 1);
    const shelfPressure = clamp(Number(sample.shelfPressure) || Number(sample.shelfWaterIndex) || Number(sample.shelfDepthIndex) || 0, 0, 1);
    const bathymetry = clamp(Number(sample.bathymetryHydrationIndex) || Number(sample.visibleWaterDepthIndex) || Number(sample.oceanDepthIndex) || 0, 0, 1);
    const trench = clamp(Number(sample.trenchHydrationIndex) || Number(sample.trenchWaterIndex) || Number(sample.trenchDepthIndex) || 0, 0, 1);

    if (
      sample.isOceanWater ||
      sample.isCoastalWater ||
      sample.isShelfWater ||
      sample.isDeepOcean ||
      sample.isTrenchWater ||
      waterClass === "ocean_water" ||
      waterClass === "coastal_water" ||
      waterClass === "shelf_water" ||
      waterClass === "deep_ocean_water" ||
      waterClass === "trench_water" ||
      visualSurfaceClass.includes("ocean_water") ||
      visualSurfaceClass.includes("water_surface")
    ) {
      let water = [8, 62, 132, 255];

      if (sample.isCoastalWater || waterClass === "coastal_water" || visualSurfaceClass === "coastal_turquoise_water_surface") {
        water = [
          Math.round(mix(18, 42, shelfPressure)),
          Math.round(mix(104, 154, shelfPressure)),
          Math.round(mix(154, 214, shelfPressure)),
          255
        ];
      } else if (sample.isShelfWater || waterClass === "shelf_water" || visualSurfaceClass === "shelf_water_surface") {
        water = [
          Math.round(mix(10, 38, shelfPressure)),
          Math.round(mix(86, 140, shelfPressure)),
          Math.round(mix(138, 198, shelfPressure)),
          255
        ];
      } else if (sample.isTrenchWater || waterClass === "trench_water" || visualSurfaceClass === "trench_ocean_water_surface") {
        water = [
          Math.round(mix(0, 8, 1 - trench)),
          Math.round(mix(12, 40, 1 - trench)),
          Math.round(mix(58, 106, 1 - trench)),
          255
        ];
      } else if (sample.isDeepOcean || waterClass === "deep_ocean_water" || visualSurfaceClass === "deep_ocean_water_surface") {
        water = [
          Math.round(mix(2, 12, 1 - bathymetry)),
          Math.round(mix(30, 72, 1 - bathymetry)),
          Math.round(mix(92, 156, 1 - bathymetry)),
          255
        ];
      } else {
        water = [
          Math.round(mix(4, 22, shelfPressure)),
          Math.round(mix(42, 112, shelfPressure)),
          Math.round(mix(110, 188, shelfPressure)),
          255
        ];
      }

      return blendRgb(baseColor, water, clamp(0.72 + surfaceWaterIndex * 0.28, 0, 1));
    }

    if (sample.isGlacier || waterClass === "glacier_mass" || visualSurfaceClass === "glacier_ice_snowpack_surface") {
      const pressure = clamp(Number(sample.glacierMassPressure) || Number(sample.glacierSeatPressure) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [226, 242, 250, 255], clamp(0.34 + pressure * 0.50, 0, 0.92));
    }

    if (sample.isSnowpack || waterClass === "snowpack_source") {
      const pressure = clamp(Number(sample.snowpackPressure) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [234, 246, 252, 255], clamp(0.22 + pressure * 0.36, 0, 0.72));
    }

    if (sample.isLake || waterClass === "lake_fill" || visualSurfaceClass === "lake_water_on_land_surface") {
      const pressure = clamp(Number(sample.lakeFillPressure) || Number(sample.lakeBasinPressure) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [42, 126, 184, 255], clamp(0.22 + pressure * 0.56, 0, 0.82));
    }

    if (sample.isRiver || waterClass === "river_flow" || visualSurfaceClass === "river_water_on_land_surface") {
      const pressure = clamp(Number(sample.riverFlowPressure) || Number(sample.riverbedPressure) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [54, 152, 214, 255], clamp(0.18 + pressure * 0.48, 0, 0.72));
    }

    if (sample.isStream || waterClass === "stream_flow" || visualSurfaceClass === "stream_water_on_land_surface") {
      const pressure = clamp(Number(sample.streamFlowPressure) || Number(sample.streamPressure) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [70, 174, 224, 255], clamp(0.14 + pressure * 0.34, 0, 0.58));
    }

    if (sample.isDelta || waterClass === "delta_wetland" || visualSurfaceClass === "delta_wetland_surface") {
      const pressure = clamp(Number(sample.deltaWetness) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [54, 146, 168, 255], clamp(0.12 + pressure * 0.34, 0, 0.58));
    }

    if (sample.isFloodplain || waterClass === "floodplain_wetland" || visualSurfaceClass === "floodplain_wetland_surface") {
      const pressure = clamp(Number(sample.floodplainWetness) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [62, 136, 148, 255], clamp(0.10 + pressure * 0.30, 0, 0.48));
    }

    if (sample.isSpring || waterClass === "spring_seep") {
      const pressure = clamp(Number(sample.springSeepPressure) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [76, 166, 190, 255], clamp(0.08 + pressure * 0.28, 0, 0.44));
    }

    if (sample.isSubterraneanWater || waterClass === "subterranean_water") {
      const pressure = clamp(Number(sample.subterraneanWaterPressure) || hydrationActivationIndex, 0, 1);
      return blendRgb(baseColor, [48, 96, 118, 255], clamp(0.05 + pressure * 0.18, 0, 0.30));
    }

    return baseColor;
  }

  function topologyFirstColor(sample, u, v) {
    const lon = u * 2 - 1;
    const lat = 1 - v * 2;

    const detail = fbm(lon * 18.0 + 1.4, lat * 18.0 - 2.1, 911, 4);
    const broad = fbm(lon * 6.0 - 3.2, lat * 6.0 + 4.4, 707, 4);

    if (!sample) {
      const water = 0.32 + broad * 0.18 + detail * 0.08;
      return [
        clamp(Math.round(6 + water * 18), 0, 50),
        clamp(Math.round(34 + water * 70), 22, 130),
        clamp(Math.round(84 + water * 92), 62, 190),
        255
      ];
    }

    if (isIceSample(sample)) {
      const ice = clamp(
        Number(sample.glacierMassPressure) ||
          Number(sample.glacierSeatPressure) ||
          Number(sample.polarSeat) ||
          Number(sample.snowpackSourcePressure) ||
          0.72,
        0,
        1
      );

      const shade = mix(0.88, 1.08, broad * 0.42 + detail * 0.24 + ice * 0.28);

      return hydrationColorFromRuntime(sample, [
        clamp(Math.round(224 * shade), 188, 250),
        clamp(Math.round(236 * shade), 202, 252),
        clamp(Math.round(244 * shade), 210, 255),
        255
      ]);
    }

    if (!isLandSample(sample)) {
      const depth = clamp(
        Number(sample.oceanDepthIndex) ||
          Number(sample.bathymetryBlueprintIndex) ||
          Number(sample.basinDepthIndex) ||
          Math.abs(Number(sample.normalizedElevation) || 0.42),
        0,
        1
      );

      const shelf = clamp(
        Number(sample.shelfDepthIndex) ||
          Number(sample.reefShelfPermission) ||
          Number(sample.shelfPermission) ||
          Number(sample.coastalExposureIndex) ||
          0,
        0,
        1
      );

      const trench = clamp(
        Number(sample.trenchDepthIndex) ||
          Number(sample.trenchReinforcementPermission) ||
          0,
        0,
        1
      );

      return hydrationColorFromRuntime(sample, [
        clamp(Math.round(mix(4, 36, shelf) - trench * 8 + broad * 8), 0, 70),
        clamp(Math.round(mix(24, 132, shelf) - depth * 10 - trench * 12 + detail * 12), 14, 150),
        clamp(Math.round(mix(76, 182, shelf) - depth * 18 - trench * 20 + broad * 18), 54, 194),
        255
      ]);
    }

    const beach = isBeachSample(sample);
    const rock = isRockSample(sample);

    const elevation = clamp(
      Number(sample.normalizedElevation) ||
        Number(sample.terrainPressureHandoff) ||
        Number(sample.terrainRisePermission) ||
        Number(sample.topologyTerrainRisePermission) ||
        0.38,
      0,
      1
    );

    const cliff = clamp(
      Number(sample.cliffBaseCut) ||
        Number(sample.coastalCliffPressure) ||
        Number(sample.cliffPermission) ||
        Number(sample.cliffPressure) ||
        0,
      0,
      1
    );

    const mountain = clamp(
      Number(sample.mountainChainPermission) ||
        Number(sample.mountainPressure) ||
        Number(sample.ridge) ||
        0,
      0,
      1
    );

    const canyon = clamp(
      Number(sample.canyonPermission) ||
        Number(sample.canyonPressure) ||
        Number(sample.riverIncisionPressure) ||
        0,
      0,
      1
    );

    const whiteSand = clamp(
      Number(sample.whiteSandPressure) ||
        Number(sample.opalSoftnessIndex) ||
        0,
      0,
      1
    );

    const blackSand = clamp(
      Number(sample.blackSandPressure) ||
        Number(sample.diamondDarkSandIndex) ||
        0,
      0,
      1
    );

    const mineralHardness = clamp(
      Number(sample.exposedMineralHardnessIndex) ||
        Number(sample.diamondPressureIndex) ||
        Number(sample.graniteCratonIndex) ||
        Number(sample.slateFoldBeltIndex) ||
        (rock ? 0.46 : 0),
      0,
      1
    );

    let r = mix(92, 176, elevation * 0.58 + mineralHardness * 0.20);
    let g = mix(74, 144, elevation * 0.44 + mineralHardness * 0.10);
    let b = mix(58, 116, elevation * 0.34 + mineralHardness * 0.12);

    if (beach) {
      const sandLight = clamp(whiteSand * 0.72 + (1 - blackSand) * 0.20, 0, 1);
      const sandDark = clamp(blackSand * 0.70, 0, 1);

      r = mix(r, mix(86, 220, sandLight), 0.56);
      g = mix(g, mix(78, 210, sandLight), 0.50);
      b = mix(b, mix(74, 198, sandLight), 0.42);

      r = mix(r, 48, sandDark * 0.32);
      g = mix(g, 42, sandDark * 0.30);
      b = mix(b, 46, sandDark * 0.26);
    }

    if (rock || cliff > 0.35) {
      r = mix(r, 136, mineralHardness * 0.22 + cliff * 0.18);
      g = mix(g, 118, mineralHardness * 0.18 + cliff * 0.14);
      b = mix(b, 100, mineralHardness * 0.16 + cliff * 0.12);
    }

    const fracture = clamp(canyon * 0.34 + mountain * 0.18 + Math.max(0, detail - 0.55) * 0.62, 0, 1);
    const shade = mix(0.84, 1.12, broad * 0.46 + elevation * 0.20 + mountain * 0.10);
    const cut = mix(1, 0.76, fracture);

    return hydrationColorFromRuntime(sample, [
      clamp(Math.round(r * shade * cut), 42, 238),
      clamp(Math.round(g * shade * cut), 38, 236),
      clamp(Math.round(b * shade * cut), 34, 234),
      255
    ]);
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
        const color = topologyFirstColor(sample, u, v);

        runtimeSamples += 1;

        if (isIceSample(sample)) iceSamples += 1;
        else if (isLandSample(sample)) landSamples += 1;
        else waterSamples += 1;

        if (isBeachSample(sample)) beachSamples += 1;

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

        if (
          sample &&
          sample.fallbackFlags &&
          (
            sample.fallbackFlags.tectonicsFallbackUsed ||
            sample.fallbackFlags.topologyFallbackUsed ||
            sample.fallbackFlags.terrainFallbackUsed ||
            sample.fallbackFlags.hydrationFallbackUsed
          )
        ) {
          fallbackSamples += 1;
        }

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
        compositorStatus: runtimeApi ? "current-runtime-genealogy-surface-texture-active" : "runtime-unavailable-ocean-safe-fallback"
      })
    });
  }

  function createStage(mount) {
    const stage = document.createElement("div");
    stage.className = "audralia-orthographic-stage";
    stage.dataset.body = BODY;
    stage.dataset.route = ROUTE;
    stage.dataset.contract = RECEIPT;
    stage.dataset.previousContracts = PREVIOUS_RECEIPTS.join("|");
    stage.dataset.axisDegrees = String(CONTROL.axisDegrees);
    stage.dataset.compositorModel = CONTROL.compositorModel;
    stage.dataset.rotationModel = CONTROL.rotationModel;
    stage.dataset.projectionModel = CONTROL.projectionModel;
    stage.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    stage.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    stage.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    stage.dataset.flatMapOnSphere = CONTROL.flatMapOnSphere;
    stage.dataset.routeOwnedLandGeneration = CONTROL.routeOwnedLandGeneration;
    stage.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    stage.dataset.hydrationReadout = "runtime-only";
    stage.dataset.runtimeVersion = RUNTIME_VERSION;
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
    canvas.dataset.previousContracts = PREVIOUS_RECEIPTS.join("|");
    canvas.dataset.rotationModel = CONTROL.rotationModel;
    canvas.dataset.projectionModel = CONTROL.projectionModel;
    canvas.dataset.compositorModel = CONTROL.compositorModel;
    canvas.dataset.diskRotation = CONTROL.diskRotation;
    canvas.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    canvas.dataset.flatMapOnSphere = CONTROL.flatMapOnSphere;
    canvas.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    canvas.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    canvas.dataset.routeOwnedLandGeneration = CONTROL.routeOwnedLandGeneration;
    canvas.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    canvas.dataset.runtimeVersion = RUNTIME_VERSION;
    canvas.dataset.noTrees = "true";
    canvas.dataset.noFoliage = "true";
    canvas.dataset.noVegetation = "true";
    canvas.dataset.hydration = CONTROL.hydration;
    canvas.dataset.hydrationReadout = "runtime-only";
    canvas.dataset.visualPass = CONTROL.visualPass;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Audralia true orthographic globe render using current runtime genealogy surface");

    const label = document.createElement("div");
    label.className = "audralia-orthographic-label";
    label.textContent = "AUDRALIA · CURRENT RUNTIME";

    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-orthographic-hidden-receipt";
    receipt.dataset.contract = RECEIPT;
    receipt.dataset.previousContracts = PREVIOUS_RECEIPTS.join("|");
    receipt.dataset.route = ROUTE;
    receipt.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    receipt.dataset.runtimeVersion = RUNTIME_VERSION;
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
    receipt.dataset.visualPass = CONTROL.visualPass;
    receipt.textContent =
      "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1 " +
      "runtime=" + RUNTIME_VERSION + " " +
      "projection=orthographic visible_hemisphere=180deg hidden_hemisphere=180deg " +
      "route_owned_land_generation=false route_owned_water_generation=false " +
      "runtime_only=true stale_window_runtime_rejected=true visual_pass=held";

    stage.appendChild(axis);
    stage.appendChild(canvas);
    stage.appendChild(label);
    stage.appendChild(receipt);

    mount.replaceChildren(stage);

    mount.dataset.body = BODY;
    mount.dataset.route = ROUTE;
    mount.dataset.contract = RECEIPT;
    mount.dataset.previousContracts = PREVIOUS_RECEIPTS.join("|");
    mount.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    mount.dataset.runtimeVersion = RUNTIME_VERSION;
    mount.dataset.compositorModel = CONTROL.compositorModel;
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
    mount.dataset.visualPass = CONTROL.visualPass;

    return { stage, canvas };
  }

  function sizeCanvas(canvas, mount) {
    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const available = rect && rect.width ? rect.width : window.innerWidth - 32;
    const cssSize = clamp(Math.floor(available * 0.88), CONTROL.minSize, CONTROL.maxSize);
    const dpr = Math.min(1.25, Math.max(1, window.devicePixelRatio || 1));
    const px = Math.max(CONTROL.minSize, Math.floor(cssSize * dpr));

    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    return px;
  }

  function buildGeometry(size) {
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

    return Object.freeze({
      size,
      radius,
      count,
      indices,
      lonOffsets,
      vCoords,
      shades
    });
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

  function drawOrthographicSphere(state) {
    const size = sizeCanvas(state.canvas, state.mount);

    if (!state.geometry || state.geometry.size !== size) {
      state.geometry = buildGeometry(size);
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

    state.canvas.dataset.phase = state.phase.toFixed(5);
    state.canvas.dataset.velocity = state.velocity.toFixed(6);
    state.canvas.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    state.canvas.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    state.canvas.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    state.canvas.dataset.projectionModel = CONTROL.projectionModel;
    state.canvas.dataset.hydration = CONTROL.hydration;
    state.canvas.dataset.hydrationReadout = "runtime-only";
    state.canvas.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;

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

      drawOrthographicSphere(state);

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

    drawOrthographicSphere(state);

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
      geometry: null,
      phase: CONTROL.initialPhase,
      velocity: 0,
      dragging: false,
      lastX: 0,
      running: false,
      raf: 0,
      cleanup: []
    };

    activeState = state;

    attachControls(state);
    drawOrthographicSphere(state);

    state.running = true;
    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });

    markRoute("active");

    document.documentElement.dataset.audraliaRuntimeAuthorityLoaded = String(Boolean(runtimeApi));
    document.documentElement.dataset.audraliaRuntimeInstanceLoaded = String(Boolean(runtimeInstance));
    document.documentElement.dataset.audraliaRuntimeLoadedReceipt = runtimeReceipt(runtimeApi);
    document.documentElement.dataset.audraliaComposedTexture = texture.stats.compositorStatus;
    document.documentElement.dataset.audraliaProjectionModel = CONTROL.projectionModel;
    document.documentElement.dataset.audraliaVisibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    document.documentElement.dataset.audraliaHiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    document.documentElement.dataset.audraliaFullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    document.documentElement.dataset.audraliaFlatMapOnSphere = CONTROL.flatMapOnSphere;
    document.documentElement.dataset.audraliaHydrationReadout = "runtime-only";
    document.documentElement.dataset.audraliaHydratedSamples = String(texture.stats.hydratedSamples);
    document.documentElement.dataset.audraliaOceanWaterSamples = String(texture.stats.oceanWaterSamples);
    document.documentElement.dataset.audraliaRiverSamples = String(texture.stats.riverSamples);
    document.documentElement.dataset.audraliaStreamSamples = String(texture.stats.streamSamples);
    document.documentElement.dataset.audraliaLakeSamples = String(texture.stats.lakeSamples);
    document.documentElement.dataset.audraliaGlacierSamples = String(texture.stats.glacierSamples);
    document.documentElement.dataset.audraliaFoliageSamples = String(texture.stats.foliageSamples);
    document.documentElement.dataset.audraliaFallbackSamples = String(texture.stats.fallbackSamples);

    mount.dataset.runtimeAuthorityLoaded = String(Boolean(runtimeApi));
    mount.dataset.runtimeInstanceLoaded = String(Boolean(runtimeInstance));
    mount.dataset.runtimeLoadedReceipt = runtimeReceipt(runtimeApi);
    mount.dataset.composedTexture = texture.stats.compositorStatus;
    mount.dataset.runtimeSamples = String(texture.stats.runtimeSamples);
    mount.dataset.landSamples = String(texture.stats.landSamples);
    mount.dataset.waterSamples = String(texture.stats.waterSamples);
    mount.dataset.iceSamples = String(texture.stats.iceSamples);
    mount.dataset.beachSamples = String(texture.stats.beachSamples);
    mount.dataset.hydratedSamples = String(texture.stats.hydratedSamples);
    mount.dataset.oceanWaterSamples = String(texture.stats.oceanWaterSamples);
    mount.dataset.riverSamples = String(texture.stats.riverSamples);
    mount.dataset.streamSamples = String(texture.stats.streamSamples);
    mount.dataset.lakeSamples = String(texture.stats.lakeSamples);
    mount.dataset.glacierSamples = String(texture.stats.glacierSamples);
    mount.dataset.snowpackSamples = String(texture.stats.snowpackSamples);
    mount.dataset.floodplainSamples = String(texture.stats.floodplainSamples);
    mount.dataset.deltaSamples = String(texture.stats.deltaSamples);
    mount.dataset.springSamples = String(texture.stats.springSamples);
    mount.dataset.subterraneanSamples = String(texture.stats.subterraneanSamples);
    mount.dataset.foliageSamples = String(texture.stats.foliageSamples);
    mount.dataset.fallbackSamples = String(texture.stats.fallbackSamples);
    mount.dataset.maxSurfaceWaterIndex = String(texture.stats.maxSurfaceWaterIndex.toFixed(4));
    mount.dataset.maxHydrationActivationIndex = String(texture.stats.maxHydrationActivationIndex.toFixed(4));
    mount.dataset.projectionModel = CONTROL.projectionModel;
    mount.dataset.visibleLongitudeSpanDegrees = String(CONTROL.visibleLongitudeSpanDegrees);
    mount.dataset.hiddenLongitudeSpanDegrees = String(CONTROL.hiddenLongitudeSpanDegrees);
    mount.dataset.fullTextureOnVisibleFace = CONTROL.fullTextureOnVisibleFace;
    mount.dataset.flatMapOnSphere = CONTROL.flatMapOnSphere;
    mount.dataset.routeOwnedWaterGeneration = CONTROL.routeOwnedWaterGeneration;
    mount.dataset.hydrationReadout = "runtime-only";

    window.dispatchEvent(
      new CustomEvent("dgb:audralia-current-runtime-genealogy-globe-ready", {
        detail: {
          body: BODY,
          label: LABEL,
          route: ROUTE,
          contract: RECEIPT,
          previousReceipts: PREVIOUS_RECEIPTS,
          runtimeAuthority: RUNTIME_AUTHORITY,
          runtimeVersion: RUNTIME_VERSION,
          runtimeLoadedReceipt: runtimeReceipt(runtimeApi),
          runtimeLoaded: Boolean(runtimeApi),
          runtimeInstanceLoaded: Boolean(runtimeInstance),
          composedTexture: texture.stats.compositorStatus,
          runtimeSamples: texture.stats.runtimeSamples,
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
          noTrees: true,
          noFoliage: true,
          noVegetation: true,
          climate: CONTROL.climate,
          ecology: CONTROL.ecology,
          animals: CONTROL.animals,
          marineLife: CONTROL.marineLife,
          hydration: CONTROL.hydration,
          visualPass: CONTROL.visualPass
        }
      })
    );
  }

  window.DGBAudraliaRouteControl = Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    body: BODY,
    label: LABEL,
    route: ROUTE,
    runtimeAuthority: RUNTIME_AUTHORITY,
    runtimeVersion: RUNTIME_VERSION,
    control: CONTROL,
    boot,
    getStatus: function () {
      return Object.freeze({
        ok: Boolean(activeState),
        receipt: RECEIPT,
        previousReceipts: PREVIOUS_RECEIPTS,
        body: BODY,
        route: ROUTE,
        runtimeAuthority: RUNTIME_AUTHORITY,
        runtimeVersion: RUNTIME_VERSION,
        runtimeLoadedReceipt: activeState ? runtimeReceipt(activeState.runtimeApi) : "",
        runtimeLoaded: Boolean(activeState && activeState.runtimeApi),
        runtimeInstanceLoaded: Boolean(activeState && activeState.runtimeInstance),
        compositorModel: CONTROL.compositorModel,
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
        visualPassClaimed: false
      });
    }
  });

  window.DGBAudraliaExistingRouteCompositor = window.DGBAudraliaRouteControl;
  window.DGBAudraliaTrueGlobeRenderer = window.DGBAudraliaRouteControl;
  window.DGBAudraliaTrueOrthographicRenderer = window.DGBAudraliaRouteControl;
  window.DGBAudraliaRuntimeHydrationWaterRenderer = window.DGBAudraliaRouteControl;
  window.DGBAudraliaCurrentRuntimeGenealogyRenderer = window.DGBAudraliaRouteControl;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
