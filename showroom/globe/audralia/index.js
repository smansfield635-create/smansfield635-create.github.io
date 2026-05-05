// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_COMPOSITOR_NO_FOLIAGE_GEOLOGY_RENDER_TNT_v1
//
// Role:
// - Existing Audralia route compositor.
// - Consumes parent baseline authority and latest terrain authority.
// - Converts terrain samples into geology-only visible texture.
// - Owns route boot, visible texture composition, axis rotation, touch spin.
//
// Hard locks:
// - No trees.
// - No foliage.
// - No forests.
// - No vegetation clusters.
// - No green/yellow decorative dots.
// - No active hydration.
// - No ecology.
// - No climate.
// - No parent rewrite.
// - No terrain rewrite.
// - No topology rewrite.
// - No visual pass claim.

(function () {
  "use strict";

  const RECEIPT = "AUDRALIA_ROUTE_COMPOSITOR_NO_FOLIAGE_GEOLOGY_RENDER_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/";
  const BODY = "audralia";
  const LABEL = "Audralia";

  const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
  const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";

  const PARENT_VERSION = "AUDRALIA_PARENT_BASELINE_LAND_WATER_RESTORE_TNT_v1";
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
    rotationModel: "audralia-geology-only-surface-phase",
    compositorModel: "parent-baseline-plus-latest-terrain-geology-only",
    touchModel: "horizontal-spin-only",
    diskRotation: "forbidden",
    wholeCanvasRotation: "forbidden",
    textureStretch: "forbidden",
    hydration: "held",
    foliage: "forbidden",
    ecology: "forbidden",
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION"
  });

  const TERRAIN_CONTEXT = Object.freeze({
    coherenceIndex: 0.94,
    collaborativeExpression: 0.9
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
    document.documentElement.dataset.audraliaParentAuthority = PARENT_AUTHORITY;
    document.documentElement.dataset.audraliaTerrainAuthority = TERRAIN_AUTHORITY;
    document.documentElement.dataset.audraliaTerrainVersion = TERRAIN_VERSION;
    document.documentElement.dataset.audraliaCompositorModel = CONTROL.compositorModel;
    document.documentElement.dataset.audraliaHydration = CONTROL.hydration;
    document.documentElement.dataset.audraliaFoliage = CONTROL.foliage;
    document.documentElement.dataset.audraliaEcology = CONTROL.ecology;
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
      document.body.dataset.publicReceipts = "hidden";
      document.body.dataset.earthAdoption = "blocked";
      document.body.dataset.noTrees = "true";
      document.body.dataset.noFoliage = "true";
      document.body.dataset.noVegetation = "true";
    }
  }

  function ensureStyle() {
    if (document.getElementById("audralia-geology-only-compositor-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-geology-only-compositor-style";
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

      .audralia-geology-stage {
        position: relative;
        display: grid;
        place-items: center;
        width: min(100%, 780px);
        aspect-ratio: 1 / 1;
        overflow: visible;
        isolation: isolate;
      }

      .audralia-geology-stage::before {
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

      .audralia-geology-axis {
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

      .audralia-geology-canvas {
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

      .audralia-geology-label {
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

      .audralia-geology-hidden-receipt {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  function getParentApi() {
    return (
      window.DGBAudraliaPlanetRender ||
      window.AudraliaPlanetRender ||
      window.audraliaPlanetRender ||
      window.DGBAudreliaPlanetRender ||
      window.AudreliaPlanetRender ||
      window.audreliaPlanetRender ||
      null
    );
  }

  function loadParentAuthority() {
    const existing = getParentApi();

    if (existing) {
      return Promise.resolve(existing);
    }

    return new Promise(function (resolve) {
      const script = document.createElement("script");
      script.src = cacheUrl(PARENT_AUTHORITY, PARENT_VERSION);
      script.defer = true;
      script.dataset.audraliaParentAuthority = "true";
      script.dataset.consumer = RECEIPT;

      script.onload = function () {
        resolve(getParentApi());
      };

      script.onerror = function () {
        resolve(null);
      };

      document.head.appendChild(script);
    });
  }

  function loadTerrainAuthority() {
    return import(cacheUrl(TERRAIN_AUTHORITY, TERRAIN_VERSION))
      .then(function (module) {
        if (module && typeof module.sampleTerrain === "function") return module;
        if (module && module.default && typeof module.default.sampleTerrain === "function") return module.default;
        return null;
      })
      .catch(function () {
        return null;
      });
  }

  function fallbackTerrainSample(u, v) {
    const lon = u * 2 - 1;
    const lat = 1 - v * 2;

    const northPolar = lat > 0.72;
    const southIce = lat < -0.76;

    function blob(cx, cy, rx, ry, elevation) {
      const dx = lon - cx;
      const dy = lat - cy;
      const pressure = Math.exp(-((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)));
      return { pressure, elevation };
    }

    const bodies = [
      blob(-0.10, 0.02, 0.38, 0.25, 0.30),
      blob(-0.63, 0.00, 0.25, 0.20, 0.29),
      blob(0.58, 0.04, 0.25, 0.21, 0.27),
      blob(0.16, -0.46, 0.35, 0.16, 0.23),
      blob(0.02, 0.82, 0.44, 0.13, 0.44)
    ];

    let best = { pressure: 0, elevation: 0 };

    for (const body of bodies) {
      if (body.pressure > best.pressure) best = body;
    }

    const landPressure = best.pressure;
    const isIce = southIce;
    const isLand = !isIce && landPressure >= 0.5;
    const isWater = !isLand && !isIce;

    const ridgeNoise = fbm(lon * 7.4, lat * 7.4, 300, 5);
    const detailNoise = fbm(lon * 19.0, lat * 19.0, 401, 4);
    const elevation = isLand ? clamp(best.elevation + (ridgeNoise - 0.5) * 0.16, 0, 1) : -clamp(0.22 + (1 - landPressure) * 0.62, 0, 1);

    const mountainPressure = isLand ? clamp((elevation - 0.42) * 1.5 + ridgeNoise * 0.25, 0, 1) : 0;
    const canyonPressure = isLand ? clamp((detailNoise - 0.54) * 1.6 + mountainPressure * 0.2, 0, 1) : 0;
    const coastPressure = clamp(1 - Math.abs(landPressure - 0.5) / 0.16, 0, 1);

    return {
      isLand,
      isWater,
      isIce,
      southIce,
      normalizedElevation: isIce ? 0 : elevation,
      elevationMeters: isLand ? Math.round(elevation * 9600) : Math.round(elevation * 5600),
      landPressure,
      regionId: isLand ? Math.max(1, Math.min(9, Math.round(elevation * 9))) : 0,
      regionRelativeElevation: isLand ? elevation : 0,
      ridge: isLand ? clamp(mountainPressure * 0.65 + ridgeNoise * 0.35, 0, 1) : 0,
      basin: isLand ? clamp((1 - mountainPressure) * 0.35, 0, 1) : 0,
      slope: isLand ? clamp(mountainPressure * 0.55 + canyonPressure * 0.35, 0, 1) : 0,
      coastPressure,
      shelfPermission: isWater ? coastPressure : coastPressure * 0.28,
      dryInteriorPressure: isLand ? clamp((1 - coastPressure) * 0.45, 0, 1) : 0,
      polarSeat: northPolar || isIce ? 1 : 0,
      oceanDepth: isWater ? clamp(0.18 + (1 - coastPressure) * 0.72, 0, 1) : 0,
      trenchPressure: isWater ? clamp(detailNoise * (1 - coastPressure), 0, 1) : 0,
      bathymetryPressure: isWater ? clamp(0.22 + detailNoise * 0.5, 0, 1) : 0,
      watershedId: isWater ? "ocean" : "fallback_watershed",
      watershedStrength: isLand ? clamp(mountainPressure * 0.45 + 0.22, 0, 1) : 0,
      riverbedPressure: isLand ? clamp(canyonPressure * 0.45 + mountainPressure * 0.16, 0, 1) : 0,
      streamPressure: isLand ? clamp(canyonPressure * 0.36 + mountainPressure * 0.26, 0, 1) : 0,
      lakeBasinPressure: isLand ? clamp((1 - mountainPressure) * 0.35, 0, 1) : 0,
      glacierSeatPressure: isLand || isIce ? clamp((northPolar ? 0.7 : 0) + mountainPressure * 0.26, 0, 1) : 0,
      valleyChannelPressure: isLand ? clamp(canyonPressure * 0.55 + mountainPressure * 0.18, 0, 1) : 0,
      floodplainPressure: isLand ? clamp(coastPressure * 0.4 + (1 - elevation) * 0.2, 0, 1) : 0,
      deltaReceiverPressure: isLand || isWater ? clamp(coastPressure * 0.5, 0, 1) : 0,
      snowpackSourcePressure: northPolar ? 0.72 : 0,
      hydrologyReadinessIndex: isLand ? clamp(canyonPressure * 0.3 + mountainPressure * 0.24 + coastPressure * 0.18, 0, 1) : coastPressure * 0.2,
      mountainPressure,
      mountainHardness: mountainPressure,
      canyonPressure,
      riverIncisionPressure: isLand ? canyonPressure * 0.74 : 0,
      streamBranchPressure: isLand ? canyonPressure * 0.54 : 0,
      basinCutPressure: isLand ? clamp((1 - mountainPressure) * 0.22, 0, 1) : 0,
      reliefHardness: isLand ? clamp(mountainPressure * 0.55 + canyonPressure * 0.35, 0, 1) : 0,
      geologicalIslet: false,
      foliage: false,
      trees: false,
      vegetation: false
    };
  }

  function sampleTerrain(terrainApi, u, v) {
    if (terrainApi && typeof terrainApi.sampleTerrain === "function") {
      try {
        const sample = terrainApi.sampleTerrain(u, v, TERRAIN_CONTEXT);
        if (sample) return sample;
      } catch (error) {
        return fallbackTerrainSample(u, v);
      }
    }

    return fallbackTerrainSample(u, v);
  }

  function terrainSampleToGeologyColor(sample, u, v) {
    const lon = u * 2 - 1;
    const lat = 1 - v * 2;

    const reliefNoise = fbm(lon * 15.0 + 0.7, lat * 15.0 - 1.2, 741, 4);
    const microRelief = fbm(lon * 35.0 - 3.1, lat * 35.0 + 2.6, 951, 3);

    if (sample.isIce || sample.southIce) {
      const glacier = clamp(sample.glacierSeatPressure || sample.polarSeat || 0, 0, 1);
      const shade = mix(0.88, 1.08, reliefNoise * 0.55 + glacier * 0.35);

      return {
        r: clamp(Math.round(224 * shade), 190, 248),
        g: clamp(Math.round(236 * shade), 202, 252),
        b: clamp(Math.round(242 * shade), 210, 255),
        a: 255
      };
    }

    if (!sample.isLand) {
      const shelf = clamp(sample.shelfPermission || 0, 0, 1);
      const depth = clamp(sample.oceanDepth || Math.abs(sample.normalizedElevation || 0), 0, 1);
      const trench = clamp(sample.trenchPressure || 0, 0, 1);
      const bathymetry = clamp(sample.bathymetryPressure || 0, 0, 1);
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

    const elevation = clamp(sample.normalizedElevation || 0, 0, 1);
    const ridge = clamp(sample.ridge || 0, 0, 1);
    const mountain = clamp(sample.mountainPressure || 0, 0, 1);
    const hard = clamp(sample.mountainHardness || sample.reliefHardness || 0, 0, 1);
    const canyon = clamp(sample.canyonPressure || 0, 0, 1);
    const incision = clamp(sample.riverIncisionPressure || 0, 0, 1);
    const stream = clamp(sample.streamBranchPressure || sample.streamPressure || 0, 0, 1);
    const basin = clamp(sample.basin || sample.basinCutPressure || 0, 0, 1);
    const lakeBasin = clamp(sample.lakeBasinPressure || 0, 0, 1);
    const glacier = clamp(sample.glacierSeatPressure || sample.snowpackSourcePressure || 0, 0, 1);
    const coast = clamp(sample.coastPressure || 0, 0, 1);
    const dry = clamp(sample.dryInteriorPressure || 0, 0, 1);
    const slope = clamp(sample.slope || 0, 0, 1);

    const landform = clamp(elevation * 0.34 + ridge * 0.20 + mountain * 0.18 + hard * 0.16 + slope * 0.12, 0, 1);
    const fracture = clamp(canyon * 0.42 + incision * 0.32 + stream * 0.16 + (microRelief > 0.62 ? (microRelief - 0.62) * 0.8 : 0), 0, 1);
    const basinShadow = clamp(basin * 0.34 + lakeBasin * 0.32, 0, 1);
    const coastalShelf = clamp(coast * 0.36, 0, 1);

    let r = mix(96, 186, landform);
    let g = mix(82, 154, landform * 0.55);
    let b = mix(62, 132, landform * 0.50);

    r = mix(r, 198, mountain * 0.28 + hard * 0.18);
    g = mix(g, 184, mountain * 0.22 + hard * 0.18);
    b = mix(b, 164, mountain * 0.22 + hard * 0.18);

    r = mix(r, 104, fracture * 0.46);
    g = mix(g, 82, fracture * 0.42);
    b = mix(b, 68, fracture * 0.38);

    r = mix(r, 112, basinShadow * 0.30);
    g = mix(g, 96, basinShadow * 0.26);
    b = mix(b, 82, basinShadow * 0.24);

    r = mix(r, 188, coastalShelf * 0.30);
    g = mix(g, 164, coastalShelf * 0.24);
    b = mix(b, 122, coastalShelf * 0.20);

    r = mix(r, 184, dry * 0.22);
    g = mix(g, 128, dry * 0.20);
    b = mix(b, 86, dry * 0.16);

    r = mix(r, 226, glacier * 0.42);
    g = mix(g, 236, glacier * 0.44);
    b = mix(b, 240, glacier * 0.46);

    const reliefShade = mix(0.88, 1.10, reliefNoise * 0.52 + ridge * 0.18 + mountain * 0.16);
    const incisionShade = mix(1, 0.72, fracture * 0.62);

    return {
      r: clamp(Math.round(r * reliefShade * incisionShade), 55, 238),
      g: clamp(Math.round(g * reliefShade * incisionShade), 48, 240),
      b: clamp(Math.round(b * reliefShade * incisionShade), 42, 246),
      a: 255
    };
  }

  function composeGeologyTexture(terrainApi) {
    const width = CONTROL.textureWidth;
    const height = CONTROL.textureHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    let terrainSamples = 0;
    let landSamples = 0;
    let waterSamples = 0;
    let iceSamples = 0;
    let foliageSamples = 0;

    let maxMountain = 0;
    let maxCanyon = 0;
    let maxRiverIncision = 0;
    let maxBathymetry = 0;

    for (let py = 0; py < height; py += 1) {
      const v = height <= 1 ? 0.5 : py / (height - 1);

      for (let px = 0; px < width; px += 1) {
        const u = width <= 1 ? 0.5 : px / (width - 1);
        const index = (py * width + px) * 4;
        const sample = sampleTerrain(terrainApi, u, v);
        const color = terrainSampleToGeologyColor(sample, u, v);

        terrainSamples += 1;

        if (sample.isIce || sample.southIce) iceSamples += 1;
        else if (sample.isLand) landSamples += 1;
        else waterSamples += 1;

        if (sample.foliage || sample.trees || sample.vegetation) {
          foliageSamples += 1;
        }

        maxMountain = Math.max(maxMountain, Number(sample.mountainPressure) || 0);
        maxCanyon = Math.max(maxCanyon, Number(sample.canyonPressure) || 0);
        maxRiverIncision = Math.max(maxRiverIncision, Number(sample.riverIncisionPressure) || 0);
        maxBathymetry = Math.max(maxBathymetry, Number(sample.bathymetryPressure) || 0);

        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = color.a;
      }
    }

    ctx.putImageData(image, 0, 0);

    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.parentAuthority = PARENT_AUTHORITY;
    canvas.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    canvas.dataset.terrainVersion = TERRAIN_VERSION;
    canvas.dataset.compositorStatus = terrainApi ? "latest-terrain-geology-only" : "fallback-geology-only";
    canvas.dataset.terrainSamples = String(terrainSamples);
    canvas.dataset.landSamples = String(landSamples);
    canvas.dataset.waterSamples = String(waterSamples);
    canvas.dataset.iceSamples = String(iceSamples);
    canvas.dataset.foliageSamples = String(foliageSamples);
    canvas.dataset.maxMountain = maxMountain.toFixed(4);
    canvas.dataset.maxCanyon = maxCanyon.toFixed(4);
    canvas.dataset.maxRiverIncision = maxRiverIncision.toFixed(4);
    canvas.dataset.maxBathymetry = maxBathymetry.toFixed(4);
    canvas.dataset.noTrees = "true";
    canvas.dataset.noFoliage = "true";
    canvas.dataset.noVegetation = "true";
    canvas.dataset.hydration = CONTROL.hydration;
    canvas.dataset.visualPass = CONTROL.visualPass;

    return canvas;
  }

  function createStage(mount) {
    const stage = document.createElement("div");
    stage.className = "audralia-geology-stage";
    stage.dataset.body = BODY;
    stage.dataset.route = ROUTE;
    stage.dataset.contract = RECEIPT;
    stage.dataset.axisDegrees = String(CONTROL.axisDegrees);
    stage.dataset.compositorModel = CONTROL.compositorModel;
    stage.dataset.noTrees = "true";
    stage.dataset.noFoliage = "true";
    stage.dataset.noVegetation = "true";
    stage.style.setProperty("--audralia-axis-deg", CONTROL.axisDegrees + "deg");

    const axis = document.createElement("div");
    axis.className = "audralia-geology-axis";
    axis.dataset.axis = "audralia-fixed-axis";

    const canvas = document.createElement("canvas");
    canvas.className = "audralia-geology-canvas";
    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.rotationModel = CONTROL.rotationModel;
    canvas.dataset.touchModel = CONTROL.touchModel;
    canvas.dataset.compositorModel = CONTROL.compositorModel;
    canvas.dataset.diskRotation = CONTROL.diskRotation;
    canvas.dataset.textureStretch = CONTROL.textureStretch;
    canvas.dataset.noTrees = "true";
    canvas.dataset.noFoliage = "true";
    canvas.dataset.noVegetation = "true";
    canvas.dataset.hydration = CONTROL.hydration;
    canvas.dataset.visualPass = CONTROL.visualPass;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Audralia geology-only terrain globe with no foliage");

    const label = document.createElement("div");
    label.className = "audralia-geology-label";
    label.textContent = "AUDRALIA · GEOLOGY ONLY";

    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-geology-hidden-receipt";
    receipt.dataset.contract = RECEIPT;
    receipt.dataset.route = ROUTE;
    receipt.dataset.parentAuthority = PARENT_AUTHORITY;
    receipt.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    receipt.dataset.terrainVersion = TERRAIN_VERSION;
    receipt.dataset.noTrees = "true";
    receipt.dataset.noFoliage = "true";
    receipt.dataset.noVegetation = "true";
    receipt.dataset.hydration = CONTROL.hydration;
    receipt.dataset.visualPass = CONTROL.visualPass;
    receipt.textContent =
      "AUDRALIA_ROUTE_COMPOSITOR_NO_FOLIAGE_GEOLOGY_RENDER_TNT_v1 latest_terrain=true geology_only=true no_trees=true no_foliage=true hydration=held visual_pass=held";

    stage.appendChild(axis);
    stage.appendChild(canvas);
    stage.appendChild(label);
    stage.appendChild(receipt);

    mount.replaceChildren(stage);

    mount.dataset.body = BODY;
    mount.dataset.route = ROUTE;
    mount.dataset.contract = RECEIPT;
    mount.dataset.parentAuthority = PARENT_AUTHORITY;
    mount.dataset.terrainAuthority = TERRAIN_AUTHORITY;
    mount.dataset.terrainVersion = TERRAIN_VERSION;
    mount.dataset.compositorModel = CONTROL.compositorModel;
    mount.dataset.rotationModel = CONTROL.rotationModel;
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

  function boot() {
    markRoute("booting");
    ensureStyle();

    const mount = getMount();

    if (!mount) {
      markRoute("missing-mount");
      return;
    }

    destroyActiveState();

    Promise.all([loadParentAuthority(), loadTerrainAuthority()]).then(function (results) {
      const parentApi = results[0];
      const terrainApi = results[1];

      const geologyTexture = composeGeologyTexture(terrainApi);
      const parts = createStage(mount);
      const ctx = parts.canvas.getContext("2d", { alpha: true });

      const state = {
        mount,
        stage: parts.stage,
        canvas: parts.canvas,
        ctx,
        texture: geologyTexture,
        parentApi,
        terrainApi,
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

      document.documentElement.dataset.audraliaParentAuthorityLoaded = String(Boolean(parentApi));
      document.documentElement.dataset.audraliaTerrainAuthorityLoaded = String(Boolean(terrainApi));
      document.documentElement.dataset.audraliaComposedTexture = geologyTexture.dataset.compositorStatus || "unknown";
      document.documentElement.dataset.audraliaFoliageSamples = geologyTexture.dataset.foliageSamples || "0";

      mount.dataset.parentAuthorityLoaded = String(Boolean(parentApi));
      mount.dataset.terrainAuthorityLoaded = String(Boolean(terrainApi));
      mount.dataset.composedTexture = geologyTexture.dataset.compositorStatus || "unknown";
      mount.dataset.terrainSamples = geologyTexture.dataset.terrainSamples || "0";
      mount.dataset.landSamples = geologyTexture.dataset.landSamples || "0";
      mount.dataset.waterSamples = geologyTexture.dataset.waterSamples || "0";
      mount.dataset.iceSamples = geologyTexture.dataset.iceSamples || "0";
      mount.dataset.foliageSamples = geologyTexture.dataset.foliageSamples || "0";
      mount.dataset.maxMountain = geologyTexture.dataset.maxMountain || "0";
      mount.dataset.maxCanyon = geologyTexture.dataset.maxCanyon || "0";
      mount.dataset.maxRiverIncision = geologyTexture.dataset.maxRiverIncision || "0";
      mount.dataset.maxBathymetry = geologyTexture.dataset.maxBathymetry || "0";

      window.dispatchEvent(
        new CustomEvent("dgb:audralia-geology-only-compositor-ready", {
          detail: {
            body: BODY,
            label: LABEL,
            route: ROUTE,
            contract: RECEIPT,
            parentAuthority: PARENT_AUTHORITY,
            terrainAuthority: TERRAIN_AUTHORITY,
            terrainVersion: TERRAIN_VERSION,
            parentLoaded: Boolean(parentApi),
            terrainLoaded: Boolean(terrainApi),
            composedTexture: geologyTexture.dataset.compositorStatus || "unknown",
            terrainSamples: geologyTexture.dataset.terrainSamples || "0",
            landSamples: geologyTexture.dataset.landSamples || "0",
            waterSamples: geologyTexture.dataset.waterSamples || "0",
            iceSamples: geologyTexture.dataset.iceSamples || "0",
            foliageSamples: geologyTexture.dataset.foliageSamples || "0",
            noTrees: true,
            noFoliage: true,
            noVegetation: true,
            hydration: CONTROL.hydration,
            visualPass: CONTROL.visualPass
          }
        })
      );
    });
  }

  window.DGBAudraliaRouteControl = Object.freeze({
    receipt: RECEIPT,
    body: BODY,
    label: LABEL,
    route: ROUTE,
    parentAuthority: PARENT_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    parentVersion: PARENT_VERSION,
    terrainVersion: TERRAIN_VERSION,
    control: CONTROL,
    boot,
    getStatus: function () {
      return Object.freeze({
        ok: Boolean(activeState),
        receipt: RECEIPT,
        body: BODY,
        route: ROUTE,
        parentAuthority: PARENT_AUTHORITY,
        terrainAuthority: TERRAIN_AUTHORITY,
        parentLoaded: Boolean(activeState && activeState.parentApi),
        terrainLoaded: Boolean(activeState && activeState.terrainApi),
        compositorModel: CONTROL.compositorModel,
        rotationModel: CONTROL.rotationModel,
        phase: activeState ? activeState.phase : null,
        velocity: activeState ? activeState.velocity : null,
        noTrees: true,
        noFoliage: true,
        noVegetation: true,
        noGreenYellowDots: true,
        hydrationHeld: true,
        parentReopened: false,
        terrainRewrittenHere: false,
        topologyRewrittenHere: false,
        visualPassClaimed: false
      });
    }
  });

  window.DGBAudraliaExistingRouteCompositor = window.DGBAudraliaRouteControl;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
