// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_RUNTIME_TOPOLOGY_FIRST_CONSUMER_TNT_v1
//
// Role:
// - Audralia route compositor.
// - Consumes /assets/audralia/audralia.runtime.js first.
// - Draws visible Audralia from runtime-approved topology + terrain state.
// - Uses topology for land / void / beaches / sand / rock / coastline / shelves / sub-sea / subterranean blueprint.
// - Uses terrain only as elevation and relief overlay beyond topology.
// - Owns route boot, visible texture composition, axis rotation, and touch spin.
//
// Hard locks:
// - No procedural land fallback.
// - No route-owned landmass generation.
// - No route-owned island generation.
// - No terrain-first rendering.
// - No direct terrain import.
// - No direct topology import.
// - No trees.
// - No foliage.
// - No vegetation.
// - No active hydration.
// - No ecology.
// - No climate.
// - No parent rewrite.
// - No terrain rewrite.
// - No topology rewrite.
// - No runtime rewrite.
// - No visual pass claim.

(function () {
  "use strict";

  const RECEIPT = "AUDRALIA_ROUTE_RUNTIME_TOPOLOGY_FIRST_CONSUMER_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/";
  const BODY = "audralia";
  const LABEL = "Audralia";

  const RUNTIME_AUTHORITY = "/assets/audralia/audralia.runtime.js";
  const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
  const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";
  const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";

  const RUNTIME_VERSION = "AUDRALIA_G1_PLANET_RUNTIME_ORCHESTRATOR_TNT_v1";
  const TOPOLOGY_VERSION = "AUDRALIA_G1_TOPOLOGY_CONNECTED_LANDFOOTPRINT_AND_IRREGULAR_COAST_TNT_v1";
  const TERRAIN_VERSION = "AUDRALIA_G1_FULL_PLANET_TERRAIN_PURIFICATION_MAP_TNT_v1";

  const CONTROL = Object.freeze({
    axisDegrees: 21.5,
    textureWidth: 960,
    textureHeight: 480,
    minSize: 320,
    maxSize: 720,
    initialPhase: 0.18,
    autoStep: 0.00046,
    dragFactor: 0.00174,
    releaseFriction: 0.952,
    minVelocity: 0.000014,
    rotationModel: "audralia-runtime-topology-first-surface-phase",
    compositorModel: "runtime-topology-first-terrain-relief-second",
    touchModel: "horizontal-spin-only",
    diskRotation: "forbidden",
    wholeCanvasRotation: "forbidden",
    textureStretch: "forbidden",
    hydration: "held",
    foliage: "closed",
    ecology: "closed",
    climate: "closed",
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION"
  });

  const RUNTIME_CONTEXT = Object.freeze({
    topologyContext: Object.freeze({
      blueprintResolution: 0.92,
      coastlineComplexity: 0.9,
      connectionStrength: 0.9,
      subterraneanPressure: 0.74
    }),
    terrainContext: Object.freeze({
      coherenceIndex: 0.94,
      collaborativeExpression: 0.9
    })
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
      document.getElementById("audreliaRenderMount") ||
      document.querySelector("[data-audralia-render-mount]") ||
      document.querySelector("[data-audrelia-render-mount]") ||
      document.querySelector("[data-body='audralia'][data-render-mount]") ||
      document.querySelector("[data-body='audrelia'][data-render-mount]")
    );
  }

  function markRoute(status) {
    document.documentElement.dataset.activeBody = BODY;
    document.documentElement.dataset.activeRoute = ROUTE;
    document.documentElement.dataset.audraliaRouteCompositor = RECEIPT;
    document.documentElement.dataset.audraliaRouteCompositorStatus = status || "booting";
    document.documentElement.dataset.audraliaRuntimeAuthority = RUNTIME_AUTHORITY;
    document.documentElement.dataset.audraliaTopologyAuthority = TOPOLOGY_AUTHORITY;
    document.documentElement.dataset.audraliaTerrainAuthority = TERRAIN_AUTHORITY;
    document.documentElement.dataset.audraliaParentAuthority = PARENT_AUTHORITY;
    document.documentElement.dataset.audraliaRuntimeVersion = RUNTIME_VERSION;
    document.documentElement.dataset.audraliaTopologyVersion = TOPOLOGY_VERSION;
    document.documentElement.dataset.audraliaTerrainVersion = TERRAIN_VERSION;
    document.documentElement.dataset.audraliaCompositorModel = CONTROL.compositorModel;
    document.documentElement.dataset.audraliaHydration = CONTROL.hydration;
    document.documentElement.dataset.audraliaFoliage = CONTROL.foliage;
    document.documentElement.dataset.audraliaEcology = CONTROL.ecology;
    document.documentElement.dataset.audraliaClimate = CONTROL.climate;
    document.documentElement.dataset.noTrees = "true";
    document.documentElement.dataset.noFoliage = "true";
    document.documentElement.dataset.noVegetation = "true";
    document.documentElement.dataset.noGreenYellowDots = "true";
    document.documentElement.dataset.earthAdoption = "blocked";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.activeBody = BODY;
      document.body.dataset.activeRoute = ROUTE;
      document.body.dataset.audraliaRouteCompositor = RECEIPT;
      document.body.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
      document.body.dataset.topologyAuthority = TOPOLOGY_AUTHORITY;
      document.body.dataset.terrainAuthority = TERRAIN_AUTHORITY;
      document.body.dataset.publicReceipts = "hidden";
      document.body.dataset.earthAdoption = "blocked";
      document.body.dataset.noTrees = "true";
      document.body.dataset.noFoliage = "true";
      document.body.dataset.noVegetation = "true";
    }
  }

  function ensureStyle() {
    if (document.getElementById("audralia-runtime-topology-compositor-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-runtime-topology-compositor-style";
    style.textContent = `
      #audraliaRenderMount,
      #audreliaRenderMount,
      [data-audralia-render-mount],
      [data-audrelia-render-mount],
      [data-body="audralia"][data-render-mount],
      [data-body="audrelia"][data-render-mount] {
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

      .audralia-runtime-stage {
        position: relative;
        display: grid;
        place-items: center;
        width: min(100%, 780px);
        aspect-ratio: 1 / 1;
        overflow: visible;
        isolation: isolate;
      }

      .audralia-runtime-stage::before {
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

      .audralia-runtime-axis {
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

      .audralia-runtime-canvas {
        position: relative;
        z-index: 2;
        display: block;
        width: min(100%, 690px);
        max-width: min(100%, 690px);
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

      .audralia-runtime-label {
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

      .audralia-runtime-hidden-receipt {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  async function loadRuntimeAuthority() {
    try {
      const module = await import(cacheUrl(RUNTIME_AUTHORITY, RUNTIME_VERSION));
      const api = module && module.default ? module.default : module;

      if (!api || typeof api.sampleAudraliaPlanetState !== "function") {
        return {
          api: null,
          runtime: null,
          loaded: false,
          error: "runtime API missing sampleAudraliaPlanetState"
        };
      }

      let runtime = null;

      if (typeof api.createAudraliaRuntime === "function") {
        try {
          runtime = await api.createAudraliaRuntime({
            consumer: RECEIPT,
            route: ROUTE,
            topologyFirst: true,
            visualPassClaimed: false
          });
        } catch (error) {
          runtime = null;
        }
      }

      return {
        api,
        runtime,
        loaded: true,
        error: null
      };
    } catch (error) {
      return {
        api: null,
        runtime: null,
        loaded: false,
        error: error && error.message ? error.message : String(error)
      };
    }
  }

  function fallbackRuntimeHoldState(u, v) {
    const lon = u * 2 - 1;
    const lat = 1 - v * 2;
    const depthNoise = fbm(lon * 4.0 + 2.1, lat * 4.0 - 1.7, 800, 4);

    return Object.freeze({
      receipt: RECEIPT,
      planetaryObject: LABEL,
      generation: "ROUTE_SAFE_RUNTIME_HOLD",
      u,
      v,
      lon,
      lat,

      topology: Object.freeze({
        isLandFootprint: false,
        isVoidFootprint: true,
        isAboveWaterLandFootprint: false,
        isCoastline: false,
        isBeach: false,
        isSand: false,
        isRock: false,
        isShelf: false,
        isIslandFootprint: false,
        isConnectedLandSystem: false,
        isSouthPolarIceFootprint: false,
        surfaceClass: "runtime_hold_void_ocean",
        surfaceClassId: 3,
        oceanDepthIndex: clamp(0.46 + depthNoise * 0.36, 0, 1),
        shelfDepthIndex: 0,
        trenchDepthIndex: clamp(depthNoise * 0.22, 0, 1),
        bathymetryBlueprintIndex: clamp(0.28 + depthNoise * 0.42, 0, 1),
        subterraneanDepthIndex: clamp(0.18 + depthNoise * 0.18, 0, 1),
        terrainRisePermission: 0,
        terrainBlockPermission: 1,
        beachPressure: 0,
        sandPressure: 0,
        rockPressure: 0,
        coastlineIrregularityIndex: 0,
        foliage: false,
        trees: false,
        vegetation: false,
        visualPassClaimed: false
      }),

      terrain: Object.freeze({
        isLand: false,
        isWater: true,
        isIce: false,
        normalizedElevation: -0.48,
        ridge: 0,
        basin: 0,
        slope: 0,
        mountainPressure: 0,
        canyonPressure: 0,
        riverIncisionPressure: 0,
        streamBranchPressure: 0,
        hydrologyReadinessIndex: 0,
        foliage: false,
        trees: false,
        vegetation: false,
        visualPassClaimed: false
      }),

      topologySurfaceClass: "runtime_hold_void_ocean",
      topologySurfaceClassId: 3,
      topologyLandFootprint: false,
      topologyVoidFootprint: true,
      topologySeaLevelBoundary: -1,
      topologyOceanDepthIndex: clamp(0.46 + depthNoise * 0.36, 0, 1),
      topologySubterraneanDepthIndex: clamp(0.18 + depthNoise * 0.18, 0, 1),
      topologyTerrainRisePermission: 0,
      topologyTerrainBlockPermission: 1,

      terrainIsLand: false,
      terrainIsWater: true,
      terrainIsIce: false,
      terrainElevation: -0.48,
      terrainRidge: 0,
      terrainBasin: 0,
      terrainMountainPressure: 0,
      terrainCanyonPressure: 0,
      terrainHydrologyReadinessIndex: 0,

      terrainAllowedByTopology: true,
      runtimeIntegrityAtSample: false,
      lifeLeakDetected: false,
      renderHint: "runtime_hold_no_land_generation",

      hydrationGate: CONTROL.hydration,
      foliageGate: CONTROL.foliage,
      ecologyGate: CONTROL.ecology,
      climateGate: CONTROL.climate,

      foliage: false,
      trees: false,
      vegetation: false,
      activeHydrationOwnedHere: false,
      visualPassClaimed: false
    });
  }

  function sampleRuntimeState(runtimeApi, u, v) {
    if (runtimeApi && typeof runtimeApi.sampleAudraliaPlanetState === "function") {
      try {
        const sample = runtimeApi.sampleAudraliaPlanetState(u, v, RUNTIME_CONTEXT);
        if (sample) return sample;
      } catch (error) {
        return fallbackRuntimeHoldState(u, v);
      }
    }

    return fallbackRuntimeHoldState(u, v);
  }

  function topologyFirstColor(state, u, v) {
    const topology = state && state.topology ? state.topology : {};
    const terrain = state && state.terrain ? state.terrain : {};

    const lon = u * 2 - 1;
    const lat = 1 - v * 2;

    const reliefNoise = fbm(lon * 15.0 + 0.7, lat * 15.0 - 1.2, 741, 4);
    const microRelief = fbm(lon * 35.0 - 3.1, lat * 35.0 + 2.6, 951, 3);

    const topologyLand = Boolean(
      state.topologyLandFootprint ||
        topology.isLandFootprint ||
        topology.isAboveWaterLandFootprint
    );

    const topologyVoid = Boolean(
      state.topologyVoidFootprint ||
        topology.isVoidFootprint ||
        !topologyLand
    );

    const southIce = Boolean(
      topology.isSouthPolarIceFootprint ||
        terrain.isIce ||
        state.terrainIsIce
    );

    const aboveWaterLand = topologyLand && !southIce;

    if (southIce) {
      const iceRelief = clamp(
        Number(terrain.glacierSeatPressure) ||
          Number(terrain.polarSeat) ||
          Number(topology.polarRisePermission) ||
          0,
        0,
        1
      );

      const shade = mix(0.88, 1.08, reliefNoise * 0.55 + iceRelief * 0.35);

      return {
        r: clamp(Math.round(224 * shade), 190, 248),
        g: clamp(Math.round(236 * shade), 202, 252),
        b: clamp(Math.round(242 * shade), 210, 255),
        a: 255
      };
    }

    if (topologyVoid) {
      const shelf = clamp(Number(topology.shelfDepthIndex) || Number(topology.reefShelfPermission) || 0, 0, 1);
      const depth = clamp(
        Number(state.topologyOceanDepthIndex) ||
          Number(topology.oceanDepthIndex) ||
          Number(topology.bathymetryBlueprintIndex) ||
          0.48,
        0,
        1
      );

      const trench = clamp(Number(topology.trenchDepthIndex) || 0, 0, 1);
      const bathymetry = clamp(Number(topology.bathymetryBlueprintIndex) || depth, 0, 1);
      const band = reliefNoise * 0.08 + microRelief * 0.04;

      const r = mix(5, 48, shelf) - trench * 5 - depth * 4 + band * 8;
      const g = mix(24, 130, shelf) - trench * 14 - depth * 8 + band * 12;
      const b = mix(72, 176, shelf) - trench * 22 - bathymetry * 10 + band * 10;

      return {
        r: clamp(Math.round(r), 0, 80),
        g: clamp(Math.round(g), 12, 150),
        b: clamp(Math.round(b), 52, 190),
        a: 255
      };
    }

    const elevation = clamp(Number(terrain.normalizedElevation) || Number(state.terrainElevation) || 0.12, 0, 1);
    const terrainAllowed = state.terrainAllowedByTopology !== false;
    const terrainWeight = terrainAllowed ? 1 : 0;

    const ridge = clamp((Number(terrain.ridge) || Number(state.terrainRidge) || 0) * terrainWeight, 0, 1);
    const mountain = clamp((Number(terrain.mountainPressure) || Number(state.terrainMountainPressure) || 0) * terrainWeight, 0, 1);
    const hard = clamp((Number(terrain.mountainHardness) || Number(terrain.reliefHardness) || 0) * terrainWeight, 0, 1);
    const canyon = clamp((Number(terrain.canyonPressure) || Number(state.terrainCanyonPressure) || 0) * terrainWeight, 0, 1);
    const incision = clamp((Number(terrain.riverIncisionPressure) || 0) * terrainWeight, 0, 1);
    const stream = clamp((Number(terrain.streamBranchPressure) || Number(terrain.streamPressure) || 0) * terrainWeight, 0, 1);
    const basin = clamp((Number(terrain.basin) || Number(terrain.basinCutPressure) || 0) * terrainWeight, 0, 1);
    const lakeBasin = clamp((Number(terrain.lakeBasinPressure) || 0) * terrainWeight, 0, 1);
    const glacier = clamp((Number(terrain.glacierSeatPressure) || Number(terrain.snowpackSourcePressure) || 0) * terrainWeight, 0, 1);
    const slope = clamp((Number(terrain.slope) || 0) * terrainWeight, 0, 1);

    const beach = clamp(Number(topology.beachPressure) || 0, 0, 1);
    const sand = clamp(Number(topology.sandPressure) || 0, 0, 1);
    const rock = clamp(Number(topology.rockPressure) || 0, 0, 1);
    const cliff = clamp(Number(topology.coastalCliffPressure) || 0, 0, 1);
    const coast = clamp(Number(topology.shorelinePressure) || Number(topology.coastlineIrregularityIndex) || 0, 0, 1);
    const connection = clamp(Number(topology.connectedFootprintPressure) || 0, 0, 1);
    const subterranean = clamp(Number(topology.subterraneanDepthIndex) || 0, 0, 1);

    const terrainRise = clamp(Number(topology.terrainRisePermission) || Number(state.topologyTerrainRisePermission) || 0, 0, 1);
    const landform = clamp(
      terrainRise * 0.22 +
        elevation * 0.18 +
        ridge * 0.18 +
        mountain * 0.15 +
        hard * 0.12 +
        slope * 0.08 +
        connection * 0.07,
      0,
      1
    );

    const fracture = clamp(
      canyon * 0.42 +
        incision * 0.32 +
        stream * 0.16 +
        cliff * 0.20 +
        (microRelief > 0.62 ? (microRelief - 0.62) * 0.8 : 0),
      0,
      1
    );

    const basinShadow = clamp(basin * 0.32 + lakeBasin * 0.28 + subterranean * 0.08, 0, 1);
    const coastalShelf = clamp(coast * 0.30 + beach * 0.18, 0, 1);

    let r = mix(92, 176, landform);
    let g = mix(78, 142, landform * 0.52);
    let b = mix(58, 122, landform * 0.48);

    r = mix(r, 198, mountain * 0.26 + hard * 0.18);
    g = mix(g, 184, mountain * 0.20 + hard * 0.16);
    b = mix(b, 164, mountain * 0.20 + hard * 0.16);

    r = mix(r, 104, fracture * 0.46);
    g = mix(g, 82, fracture * 0.42);
    b = mix(b, 68, fracture * 0.38);

    r = mix(r, 112, basinShadow * 0.30);
    g = mix(g, 96, basinShadow * 0.26);
    b = mix(b, 82, basinShadow * 0.24);

    r = mix(r, 194, sand * 0.42 + beach * 0.22);
    g = mix(g, 164, sand * 0.34 + beach * 0.18);
    b = mix(b, 112, sand * 0.26 + beach * 0.14);

    r = mix(r, 168, rock * 0.30 + cliff * 0.18);
    g = mix(g, 150, rock * 0.24 + cliff * 0.16);
    b = mix(b, 126, rock * 0.20 + cliff * 0.14);

    r = mix(r, 188, coastalShelf * 0.24);
    g = mix(g, 164, coastalShelf * 0.20);
    b = mix(b, 122, coastalShelf * 0.16);

    r = mix(r, 226, glacier * 0.42);
    g = mix(g, 236, glacier * 0.44);
    b = mix(b, 240, glacier * 0.46);

    const reliefShade = mix(0.88, 1.10, reliefNoise * 0.48 + ridge * 0.16 + mountain * 0.14 + connection * 0.06);
    const incisionShade = mix(1, 0.72, fracture * 0.58);

    return {
      r: clamp(Math.round(r * reliefShade * incisionShade), 55, 238),
      g: clamp(Math.round(g * reliefShade * incisionShade), 48, 240),
      b: clamp(Math.round(b * reliefShade * incisionShade), 42, 246),
      a: 255
    };
  }

  function composeRuntimeTexture(runtimeApi) {
    const width = CONTROL.textureWidth;
    const height = CONTROL.textureHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let runtimeSamples = 0;
    let topologyLandSamples = 0;
    let topologyVoidSamples = 0;
    let topologyCoastSamples = 0;
    let topologyBeachSamples = 0;
    let topologyRockSamples = 0;
    let topologyConnectedSamples = 0;
    let terrainReliefSamples = 0;
    let mismatchSamples = 0;
    let lifeLeakSamples = 0;

    let maxTerrainRise = 0;
    let maxOceanDepth = 0;
    let maxSubterraneanDepth = 0;
    let maxMountain = 0;
    let maxCanyon = 0;

    for (let py = 0; py < height; py += 1) {
      const v = height <= 1 ? 0.5 : py / (height - 1);

      for (let px = 0; px < width; px += 1) {
        const u = width <= 1 ? 0.5 : px / (width - 1);
        const index = (py * width + px) * 4;

        const state = sampleRuntimeState(runtimeApi, u, v);
        const topology = state.topology || {};
        const terrain = state.terrain || {};
        const color = topologyFirstColor(state, u, v);

        runtimeSamples += 1;

        if (state.topologyLandFootprint || topology.isLandFootprint) topologyLandSamples += 1;
        if (state.topologyVoidFootprint || topology.isVoidFootprint) topologyVoidSamples += 1;
        if (topology.isCoastline) topologyCoastSamples += 1;
        if (topology.isBeach || topology.isSand) topologyBeachSamples += 1;
        if (topology.isRock) topologyRockSamples += 1;
        if (topology.isConnectedLandSystem) topologyConnectedSamples += 1;
        if ((terrain.ridge || terrain.mountainPressure || terrain.canyonPressure) && (state.topologyLandFootprint || topology.isLandFootprint)) terrainReliefSamples += 1;
        if (state.terrainAllowedByTopology === false) mismatchSamples += 1;
        if (state.lifeLeakDetected || state.foliage || state.trees || state.vegetation || topology.foliage || terrain.foliage) lifeLeakSamples += 1;

        maxTerrainRise = Math.max(maxTerrainRise, Number(state.topologyTerrainRisePermission) || Number(topology.terrainRisePermission) || 0);
        maxOceanDepth = Math.max(maxOceanDepth, Number(state.topologyOceanDepthIndex) || Number(topology.oceanDepthIndex) || 0);
        maxSubterraneanDepth = Math.max(maxSubterraneanDepth, Number(state.topologySubterraneanDepthIndex) || Number(topology.subterraneanDepthIndex) || 0);
        maxMountain = Math.max(maxMountain, Number(state.terrainMountainPressure) || Number(terrain.mountainPressure) || 0);
        maxCanyon = Math.max(maxCanyon, Number(state.terrainCanyonPressure) || Number(terrain.canyonPressure) || 0);

        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = color.a;
      }
    }

    ctx.putImageData(image, 0, 0);

    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    canvas.dataset.topologyAuthority = TOPOLOGY_AUTHORITY;
    canvas.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    canvas.dataset.parentAuthority = PARENT_AUTHORITY;
    canvas.dataset.runtimeVersion = RUNTIME_VERSION;
    canvas.dataset.topologyVersion = TOPOLOGY_VERSION;
    canvas.dataset.terrainVersion = TERRAIN_VERSION;
    canvas.dataset.compositorStatus = runtimeApi ? "runtime-topology-first" : "runtime-hold-no-land-generation";

    canvas.dataset.runtimeSamples = String(runtimeSamples);
    canvas.dataset.topologyLandSamples = String(topologyLandSamples);
    canvas.dataset.topologyVoidSamples = String(topologyVoidSamples);
    canvas.dataset.topologyCoastSamples = String(topologyCoastSamples);
    canvas.dataset.topologyBeachSamples = String(topologyBeachSamples);
    canvas.dataset.topologyRockSamples = String(topologyRockSamples);
    canvas.dataset.topologyConnectedSamples = String(topologyConnectedSamples);
    canvas.dataset.terrainReliefSamples = String(terrainReliefSamples);
    canvas.dataset.mismatchSamples = String(mismatchSamples);
    canvas.dataset.lifeLeakSamples = String(lifeLeakSamples);

    canvas.dataset.maxTerrainRise = maxTerrainRise.toFixed(4);
    canvas.dataset.maxOceanDepth = maxOceanDepth.toFixed(4);
    canvas.dataset.maxSubterraneanDepth = maxSubterraneanDepth.toFixed(4);
    canvas.dataset.maxMountain = maxMountain.toFixed(4);
    canvas.dataset.maxCanyon = maxCanyon.toFixed(4);

    canvas.dataset.noTrees = "true";
    canvas.dataset.noFoliage = "true";
    canvas.dataset.noVegetation = "true";
    canvas.dataset.hydration = CONTROL.hydration;
    canvas.dataset.visualPass = CONTROL.visualPass;

    return canvas;
  }

  function createStage(mount) {
    const stage = document.createElement("div");
    stage.className = "audralia-runtime-stage";
    stage.dataset.body = BODY;
    stage.dataset.route = ROUTE;
    stage.dataset.contract = RECEIPT;
    stage.dataset.axisDegrees = String(CONTROL.axisDegrees);
    stage.dataset.compositorModel = CONTROL.compositorModel;
    stage.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    stage.dataset.topologyAuthority = TOPOLOGY_AUTHORITY;
    stage.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    stage.dataset.noTrees = "true";
    stage.dataset.noFoliage = "true";
    stage.dataset.noVegetation = "true";
    stage.style.setProperty("--audralia-axis-deg", CONTROL.axisDegrees + "deg");

    const axis = document.createElement("div");
    axis.className = "audralia-runtime-axis";
    axis.dataset.axis = "audralia-fixed-axis";

    const canvas = document.createElement("canvas");
    canvas.className = "audralia-runtime-canvas";
    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.rotationModel = CONTROL.rotationModel;
    canvas.dataset.touchModel = CONTROL.touchModel;
    canvas.dataset.compositorModel = CONTROL.compositorModel;
    canvas.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    canvas.dataset.topologyAuthority = TOPOLOGY_AUTHORITY;
    canvas.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    canvas.dataset.diskRotation = CONTROL.diskRotation;
    canvas.dataset.textureStretch = CONTROL.textureStretch;
    canvas.dataset.noTrees = "true";
    canvas.dataset.noFoliage = "true";
    canvas.dataset.noVegetation = "true";
    canvas.dataset.hydration = CONTROL.hydration;
    canvas.dataset.visualPass = CONTROL.visualPass;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Audralia runtime topology-first globe with terrain relief overlay");

    const label = document.createElement("div");
    label.className = "audralia-runtime-label";
    label.textContent = "AUDRALIA · TOPOLOGY FIRST";

    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-runtime-hidden-receipt";
    receipt.dataset.contract = RECEIPT;
    receipt.dataset.route = ROUTE;
    receipt.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    receipt.dataset.topologyAuthority = TOPOLOGY_AUTHORITY;
    receipt.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    receipt.dataset.parentAuthority = PARENT_AUTHORITY;
    receipt.dataset.runtimeVersion = RUNTIME_VERSION;
    receipt.dataset.topologyVersion = TOPOLOGY_VERSION;
    receipt.dataset.terrainVersion = TERRAIN_VERSION;
    receipt.dataset.noTrees = "true";
    receipt.dataset.noFoliage = "true";
    receipt.dataset.noVegetation = "true";
    receipt.dataset.hydration = CONTROL.hydration;
    receipt.dataset.visualPass = CONTROL.visualPass;
    receipt.textContent =
      "AUDRALIA_ROUTE_RUNTIME_TOPOLOGY_FIRST_CONSUMER_TNT_v1 runtime=true topology_first=true terrain_relief_second=true no_route_land_generation=true no_trees=true no_foliage=true hydration=held visual_pass=held";

    stage.appendChild(axis);
    stage.appendChild(canvas);
    stage.appendChild(label);
    stage.appendChild(receipt);

    mount.replaceChildren(stage);

    mount.dataset.body = BODY;
    mount.dataset.route = ROUTE;
    mount.dataset.contract = RECEIPT;
    mount.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
    mount.dataset.topologyAuthority = TOPOLOGY_AUTHORITY;
    mount.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    mount.dataset.parentAuthority = PARENT_AUTHORITY;
    mount.dataset.runtimeVersion = RUNTIME_VERSION;
    mount.dataset.topologyVersion = TOPOLOGY_VERSION;
    mount.dataset.terrainVersion = TERRAIN_VERSION;
    mount.dataset.compositorModel = CONTROL.compositorModel;
    mount.dataset.rotationModel = CONTROL.rotationModel;
    mount.dataset.noRouteLandGeneration = "true";
    mount.dataset.newFileRequired = "false";
    mount.dataset.noTrees = "true";
    mount.dataset.noFoliage = "true";
    mount.dataset.noVegetation = "true";
    mount.dataset.hydration = CONTROL.hydration;
    mount.dataset.earthAdoption = "blocked";
    mount.dataset.visualPass = CONTROL.visualPass;

    return { stage, canvas };
  }

  function sizeCanvas(canvas, mount) {
    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const available = rect && rect.width ? rect.width : window.innerWidth - 32;
    const cssSize = clamp(Math.floor(available * 0.88), CONTROL.minSize, CONTROL.maxSize);
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const px = Math.max(CONTROL.minSize, Math.floor(cssSize * dpr));

    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    return px;
  }

  function drawWrappedStrip(ctx, texture, phase, sy, sh, dx, dy, dw, dh) {
    if (!texture || !texture.width || !texture.height || dw <= 0 || dh <= 0) return;

    const sourceWidth = texture.width;
    const sourceHeight = texture.height;
    const start = wrap01(phase) * sourceWidth;
    const safeSy = clamp(sy, 0, sourceHeight - 1);
    const safeSh = clamp(sh, 1, sourceHeight - safeSy);

    const firstSourceWidth = sourceWidth - start;
    const firstDestWidth = dw * (firstSourceWidth / sourceWidth);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(texture, start, safeSy, firstSourceWidth, safeSh, dx, dy, firstDestWidth, dh);

    if (secondDestWidth > 0.5) {
      ctx.drawImage(texture, 0, safeSy, start, safeSh, dx + firstDestWidth, dy, secondDestWidth, dh);
    }
  }

  function drawSphere(ctx, texture, phase, size) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;
    const stripHeight = Math.max(2, Math.floor(size / 280));
    const sourceHeight = texture.height || CONTROL.textureHeight;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (let y = -radius; y <= radius; y += stripHeight) {
      const yMid = y + stripHeight / 2;
      const normalizedY = yMid / radius;
      const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
      const destWidth = radius * 2 * chord;
      const destX = cx - destWidth / 2;
      const destY = cy + y;
      const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
      const sy = Math.floor(v * (sourceHeight - 1));
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.72));

      drawWrappedStrip(ctx, texture, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
    }

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const light = ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.36,
      radius * 0.03,
      cx,
      cy,
      radius * 1.16
    );

    light.addColorStop(0, "rgba(255,255,255,0.20)");
    light.addColorStop(0.35, "rgba(255,255,255,0.06)");
    light.addColorStop(0.74, "rgba(0,0,0,0.12)");
    light.addColorStop(1, "rgba(0,0,0,0.46)");

    ctx.fillStyle = light;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const edge = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.82, "rgba(8,23,44,0.12)");
    edge.addColorStop(1, "rgba(10,24,42,0.40)");

    ctx.fillStyle = edge;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(190,226,255,0.28)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function draw(state) {
    const size = sizeCanvas(state.canvas, state.mount);
    drawSphere(state.ctx, state.texture, state.phase, size);

    state.canvas.dataset.phase = state.phase.toFixed(5);
    state.canvas.dataset.velocity = state.velocity.toFixed(6);
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

      draw(state);

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

    draw(state);

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

  function applyTextureReceipts(mount, texture) {
    document.documentElement.dataset.audraliaRuntimeLoaded = texture.dataset.runtimeLoaded || "false";
    document.documentElement.dataset.audraliaRuntimeStatus = texture.dataset.runtimeStatus || "unknown";
    document.documentElement.dataset.audraliaComposedTexture = texture.dataset.compositorStatus || "unknown";
    document.documentElement.dataset.audraliaTopologyLandSamples = texture.dataset.topologyLandSamples || "0";
    document.documentElement.dataset.audraliaTopologyVoidSamples = texture.dataset.topologyVoidSamples || "0";
    document.documentElement.dataset.audraliaTopologyConnectedSamples = texture.dataset.topologyConnectedSamples || "0";
    document.documentElement.dataset.audraliaMismatchSamples = texture.dataset.mismatchSamples || "0";
    document.documentElement.dataset.audraliaLifeLeakSamples = texture.dataset.lifeLeakSamples || "0";

    mount.dataset.runtimeLoaded = texture.dataset.runtimeLoaded || "false";
    mount.dataset.runtimeStatus = texture.dataset.runtimeStatus || "unknown";
    mount.dataset.composedTexture = texture.dataset.compositorStatus || "unknown";
    mount.dataset.runtimeSamples = texture.dataset.runtimeSamples || "0";
    mount.dataset.topologyLandSamples = texture.dataset.topologyLandSamples || "0";
    mount.dataset.topologyVoidSamples = texture.dataset.topologyVoidSamples || "0";
    mount.dataset.topologyCoastSamples = texture.dataset.topologyCoastSamples || "0";
    mount.dataset.topologyBeachSamples = texture.dataset.topologyBeachSamples || "0";
    mount.dataset.topologyRockSamples = texture.dataset.topologyRockSamples || "0";
    mount.dataset.topologyConnectedSamples = texture.dataset.topologyConnectedSamples || "0";
    mount.dataset.terrainReliefSamples = texture.dataset.terrainReliefSamples || "0";
    mount.dataset.mismatchSamples = texture.dataset.mismatchSamples || "0";
    mount.dataset.lifeLeakSamples = texture.dataset.lifeLeakSamples || "0";
    mount.dataset.maxTerrainRise = texture.dataset.maxTerrainRise || "0";
    mount.dataset.maxOceanDepth = texture.dataset.maxOceanDepth || "0";
    mount.dataset.maxSubterraneanDepth = texture.dataset.maxSubterraneanDepth || "0";
    mount.dataset.maxMountain = texture.dataset.maxMountain || "0";
    mount.dataset.maxCanyon = texture.dataset.maxCanyon || "0";
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

    const runtimeLoad = await loadRuntimeAuthority();
    const runtimeApi = runtimeLoad.api;
    const runtime = runtimeLoad.runtime;

    const runtimeTexture = composeRuntimeTexture(runtimeApi);
    runtimeTexture.dataset.runtimeLoaded = String(Boolean(runtimeLoad.loaded));
    runtimeTexture.dataset.runtimeStatus =
      runtime && runtime.status
        ? runtime.status
        : runtimeLoad.loaded
          ? "loaded"
          : "hold";
    runtimeTexture.dataset.runtimeError = runtimeLoad.error || "";

    const parts = createStage(mount);
    const ctx = parts.canvas.getContext("2d", { alpha: true });

    const state = {
      mount,
      stage: parts.stage,
      canvas: parts.canvas,
      ctx,
      texture: runtimeTexture,
      runtimeApi,
      runtime,
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
    draw(state);

    state.running = true;
    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });

    markRoute("active");
    applyTextureReceipts(mount, runtimeTexture);

    window.dispatchEvent(
      new CustomEvent("dgb:audralia-runtime-topology-first-compositor-ready", {
        detail: {
          body: BODY,
          label: LABEL,
          route: ROUTE,
          contract: RECEIPT,
          runtimeAuthority: RUNTIME_AUTHORITY,
          topologyAuthority: TOPOLOGY_AUTHORITY,
          terrainAuthority: TERRAIN_AUTHORITY,
          parentAuthority: PARENT_AUTHORITY,
          runtimeVersion: RUNTIME_VERSION,
          topologyVersion: TOPOLOGY_VERSION,
          terrainVersion: TERRAIN_VERSION,
          runtimeLoaded: Boolean(runtimeLoad.loaded),
          runtimeStatus: runtimeTexture.dataset.runtimeStatus || "unknown",
          composedTexture: runtimeTexture.dataset.compositorStatus || "unknown",
          runtimeSamples: runtimeTexture.dataset.runtimeSamples || "0",
          topologyLandSamples: runtimeTexture.dataset.topologyLandSamples || "0",
          topologyVoidSamples: runtimeTexture.dataset.topologyVoidSamples || "0",
          topologyConnectedSamples: runtimeTexture.dataset.topologyConnectedSamples || "0",
          terrainReliefSamples: runtimeTexture.dataset.terrainReliefSamples || "0",
          mismatchSamples: runtimeTexture.dataset.mismatchSamples || "0",
          lifeLeakSamples: runtimeTexture.dataset.lifeLeakSamples || "0",
          noRouteLandGeneration: true,
          noTrees: true,
          noFoliage: true,
          noVegetation: true,
          hydration: CONTROL.hydration,
          visualPass: CONTROL.visualPass
        }
      })
    );
  }

  window.DGBAudraliaRouteControl = Object.freeze({
    receipt: RECEIPT,
    body: BODY,
    label: LABEL,
    route: ROUTE,
    runtimeAuthority: RUNTIME_AUTHORITY,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    parentAuthority: PARENT_AUTHORITY,
    runtimeVersion: RUNTIME_VERSION,
    topologyVersion: TOPOLOGY_VERSION,
    terrainVersion: TERRAIN_VERSION,
    control: CONTROL,
    boot,
    getStatus: function () {
      return Object.freeze({
        ok: Boolean(activeState),
        receipt: RECEIPT,
        body: BODY,
        route: ROUTE,
        runtimeAuthority: RUNTIME_AUTHORITY,
        topologyAuthority: TOPOLOGY_AUTHORITY,
        terrainAuthority: TERRAIN_AUTHORITY,
        parentAuthority: PARENT_AUTHORITY,
        runtimeLoaded: Boolean(activeState && activeState.runtimeApi),
        runtimeStatus: activeState && activeState.runtime && activeState.runtime.status ? activeState.runtime.status : null,
        compositorModel: CONTROL.compositorModel,
        rotationModel: CONTROL.rotationModel,
        phase: activeState ? activeState.phase : null,
        velocity: activeState ? activeState.velocity : null,
        noRouteLandGeneration: true,
        topologyFirst: true,
        terrainReliefSecond: true,
        noTrees: true,
        noFoliage: true,
        noVegetation: true,
        noGreenYellowDots: true,
        hydrationHeld: true,
        runtimeRewrittenHere: false,
        topologyRewrittenHere: false,
        terrainRewrittenHere: false,
        parentReopened: false,
        visualPassClaimed: false
      });
    }
  });

  window.DGBAudraliaRuntimeTopologyFirstCompositor = window.DGBAudraliaRouteControl;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
