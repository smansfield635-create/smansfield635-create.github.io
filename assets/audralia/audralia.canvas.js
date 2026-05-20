// TARGET FILE: /assets/audralia/audralia.canvas.js
/*
  AUDRALIA_CANVAS_ORGANIC_CHAIN_CONSUMER_RENEWAL_TNT_v1
  Full-file replacement.
  Canvas consumer only.
  Purpose:
  - Consumes landmap, hydrology, topology, elevation, land surface, optional climate, and optional lattice.
  - Projects Audralia as a contained, touch-scoped, organic globe.
  - Corrects the one-big-land-glob read through visible hydrology, shelves, coastal interruption, interior water, relief, and material variation.
  - Does not own land footprint.
  - Does not own hydrology.
  - Does not own topology.
  - Does not own elevation.
  - Does not own climate.
  - Does not own route.
  - Does not touch Gauges.
  No generated image. No GraphicBox. No visual-pass claim.
*/

(() => {
  "use strict";

  const COMPATIBLE_CONTRACT = "AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3";
  const CONTRACT = "AUDRALIA_CANVAS_ORGANIC_CHAIN_CONSUMER_RENEWAL_TNT_v1";
  const RECEIPT = "AUDRALIA_CANVAS_ORGANIC_CHAIN_CONSUMER_RENEWAL_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CANVAS_FULL_VISIBILITY_LOWERED_GLOBE_TNT_v5";
  const VERSION = "2026-05-19.audralia-canvas-organic-chain-consumer-renewal-v1";

  const TAU = Math.PI * 2;
  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;

  const GEOMETRY = Object.freeze({
    centerX: 0.5,
    centerY: 0.53,
    radius: 0.382,
    pointerRadius: 0.405,
    atmosphereRadius: 1.13,
    textureWidth: 560,
    textureHeight: 280,
    maxCanvasSize: 760,
    minCanvasSize: 300,
    maxDpr: 1.35,
    maxSpherePixels: 540,
    minSpherePixels: 320
  });

  const EXPECTED = Object.freeze({
    lattice: "AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_TNT_v1",
    topology: "AUDRALIA_PARENT_TOPOLOGY_AUTHORITY_TNT_v1",
    landmap: "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1",
    elevation: "AUDRALIA_256_LATTICE_ELEVATION_DEPTH_FIELD_TNT_v1",
    hydrology: "AUDRALIA_ORGANIC_HYDRATION_AND_WATERSHED_AUTHORITY_TNT_v1",
    surface: "AUDRALIA_ELEVATION_CONSUMPTION_VISIBLE_RELIEF_SURFACE_TNT_v3"
  });

  const COLORS = Object.freeze({
    deepOcean: [2, 14, 42],
    ocean: [5, 49, 94],
    openOcean: [6, 65, 112],
    shelf: [20, 114, 139],
    shallow: [70, 166, 162],
    lagoon: [116, 199, 174],
    inlandWater: [22, 105, 132],
    river: [31, 126, 137],
    estuary: [62, 151, 139],
    wetland: [62, 122, 90],
    marsh: [89, 137, 90],
    beach: [196, 177, 118],
    wetBeach: [150, 150, 107],
    fallbackLand: [93, 129, 78],
    forest: [49, 112, 69],
    livingGreen: [89, 153, 89],
    highland: [122, 121, 87],
    ridge: [139, 130, 99],
    mountain: [119, 116, 101],
    basin: [105, 93, 67],
    desert: [176, 133, 78],
    snow: [216, 230, 224],
    atmosphere: [83, 156, 194],
    atmosphereBright: [142, 210, 226],
    cloud: [225, 236, 234],
    shadow: [14, 24, 34],
    gold: [198, 166, 91]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
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

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function text(value) {
    return String(value || "").trim().toLowerCase();
  }

  function includesAny(value, terms) {
    const source = text(value);
    return terms.some((term) => source.includes(term));
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
    const s = Math.max(2, Math.floor(scale));
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
    const c = hash(((x0 % s) + s) % s, y1, seed);
    const d = hash(((x1 % s) + s) % s, y1, seed);

    return lerp(lerp(a, b, sx), lerp(c, d, sx), sy);
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
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridgeNoise(u, v, seed, octaves = 4) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 4.0;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 197);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function loadScriptOnce(path, flag) {
    if (document.documentElement.dataset[flag] === "true") return Promise.resolve(true);

    return new Promise((resolve) => {
      const existing = document.querySelector(`script[data-audralia-canvas-loader="${flag}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      const separator = path.includes("?") ? "&" : "?";
      script.src = `${path}${separator}v=${encodeURIComponent(CONTRACT)}`;
      script.defer = true;
      script.dataset.audraliaCanvasLoader = flag;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.visualPassClaimed = "false";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async function ensureAuthorities() {
    if (!window.AUDRALIA_LATTICE256?.coordinatesFromUV) {
      await loadScriptOnce("/assets/audralia/audralia.lattice256.js", "audraliaLattice256Loaded");
    }

    if (!window.AUDRALIA_TOPOLOGY?.sampleTopology && !window.AUDRALIA_TOPOLOGY?.sample) {
      await loadScriptOnce("/assets/audralia/audralia.topology.js", "audraliaTopologyLoaded");
    }

    if (!window.AUDRALIA_LANDMAP?.sampleLandmap && !window.AUDRALIA_LANDMAP?.sample) {
      await loadScriptOnce("/assets/audralia/audralia.landmap.js", "audraliaLandmapLoaded");
    }

    if (!window.AUDRALIA_ELEVATION?.sampleElevation && !window.AUDRALIA_ELEVATION?.sample) {
      await loadScriptOnce("/assets/audralia/audralia.elevation.js", "audraliaElevationLoaded");
    }

    if (!window.AUDRALIA_HYDROLOGY?.sampleHydrology && !window.AUDRALIA_HYDROLOGY?.sample) {
      await loadScriptOnce("/assets/audralia/audralia.hydrology.js", "audraliaHydrologyLoaded");
    }

    if (!window.AUDRALIA_CLIMATE_RENDER?.sampleClimate && !window.AUDRALIA_CLIMATE_RENDER?.sample) {
      await loadScriptOnce("/assets/audralia/audralia.climate.render.js", "audraliaClimateLoaded");
    }

    if (!window.AUDRALIA_LAND_SURFACE?.sampleSurface && !window.AUDRALIA_LAND_SURFACE?.sample) {
      await loadScriptOnce("/assets/audralia/audralia.land.surface.js", "audraliaLandSurfaceLoaded");
    }

    return Object.freeze({
      latticeLoaded: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
      topologyLoaded: Boolean(window.AUDRALIA_TOPOLOGY?.sampleTopology || window.AUDRALIA_TOPOLOGY?.sample),
      landmapLoaded: Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap || window.AUDRALIA_LANDMAP?.sample),
      elevationLoaded: Boolean(window.AUDRALIA_ELEVATION?.sampleElevation || window.AUDRALIA_ELEVATION?.sample),
      hydrologyLoaded: Boolean(window.AUDRALIA_HYDROLOGY?.sampleHydrology || window.AUDRALIA_HYDROLOGY?.sample),
      climateLoaded: Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate || window.AUDRALIA_CLIMATE_RENDER?.sample),
      landSurfaceLoaded: Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface || window.AUDRALIA_LAND_SURFACE?.sample),
      topologyContract: String(window.AUDRALIA_TOPOLOGY?.contract || ""),
      landmapContract: String(window.AUDRALIA_LANDMAP?.contract || ""),
      elevationContract: String(window.AUDRALIA_ELEVATION?.contract || ""),
      hydrologyContract: String(window.AUDRALIA_HYDROLOGY?.contract || ""),
      landSurfaceContract: String(window.AUDRALIA_LAND_SURFACE?.contract || "")
    });
  }

  function fallbackMap(u, v) {
    const latitude = 90 - v * 180;
    const longitude = u * 360 - 180;
    const absLat = Math.abs(latitude);
    const equator = 1 - absLat / 90;

    const broad = fbm(u * 1.12 + 0.18, v * 0.92 - 0.11, 930001, 5);
    const ridge = fbm(u * 2.8 - 0.21, v * 2.1 + 0.14, 930777, 4);
    const cut = ridgeNoise(u * 4.4 + 0.09, v * 3.8 - 0.19, 930888, 4);
    const landSignal = broad * 0.50 + ridge * 0.22 + equator * 0.14 - cut * 0.10;
    const isLand = landSignal > 0.52;
    const isBeach = landSignal > 0.48 && landSignal <= 0.52;
    const isShelf = landSignal > 0.42 && landSignal <= 0.48;

    return Object.freeze({
      u,
      v,
      longitude,
      latitude,
      cell256: Math.max(1, Math.min(256, Math.floor(v * 16) * 16 + Math.floor(u * 16) + 1)),
      cell64: Math.max(1, Math.min(64, Math.floor(v * 8) * 8 + Math.floor(u * 8) + 1)),
      cell16: Math.max(1, Math.min(16, Math.floor(v * 4) * 4 + Math.floor(u * 4) + 1)),
      quadrant: latitude >= 0 ? (longitude >= 0 ? "NE" : "NW") : (longitude >= 0 ? "SE" : "SW"),
      band: absLat < 23 ? "equatorial" : absLat < 50 ? "temperate" : "polar",
      primarySummit: "Gratitude",
      internalSummit: "Stability",
      summitProvince: "Gratitude",
      terrainClass: isLand ? "highland" : isBeach ? "beach" : isShelf ? "shelf" : "ocean",
      topology: isLand ? "highland-shoulder" : isBeach ? "coastal-beach" : isShelf ? "continental-shelf" : "deep-ocean",
      elevation: isLand ? "highland" : isBeach ? "shore" : isShelf ? "shelf-sea" : "sea",
      shelf: smoothstep(0.42, 0.52, landSignal),
      beachEdge: smoothstep(0.42, 0.54, landSignal),
      isOcean: !isLand && !isBeach && !isShelf,
      isLand,
      isShelf,
      isBeach,
      isPolarIce: absLat > 74 && isLand
    });
  }

  function sampleMap(u, v) {
    const uu = wrap01(Number.isFinite(Number(u)) ? Number(u) : 0);
    const vv = clamp(Number.isFinite(Number(v)) ? Number(v) : 0, 0, 1);

    try {
      if (window.AUDRALIA_LANDMAP?.sampleLandmap) return window.AUDRALIA_LANDMAP.sampleLandmap(uu, vv);
      if (window.AUDRALIA_LANDMAP?.sample) return window.AUDRALIA_LANDMAP.sample(uu, vv);
    } catch {
      document.documentElement.dataset.audraliaCanvasLandmapSampleFailed = "true";
    }

    return fallbackMap(uu, vv);
  }

  function sampleElevation(map) {
    try {
      if (window.AUDRALIA_ELEVATION?.sampleElevation) return window.AUDRALIA_ELEVATION.sampleElevation(map);
      if (window.AUDRALIA_ELEVATION?.sample) return window.AUDRALIA_ELEVATION.sample(map);
    } catch {
      document.documentElement.dataset.audraliaCanvasElevationSampleFailed = "true";
    }

    return null;
  }

  function sampleTopology(map) {
    try {
      if (window.AUDRALIA_TOPOLOGY?.sampleTopology) {
        return window.AUDRALIA_TOPOLOGY.sampleTopology(map.u, map.v, {
          longitude: Number(map.longitude || 0) * Math.PI / 180,
          latitude: Number(map.latitude || 0) * Math.PI / 180,
          landmap: map
        });
      }

      if (window.AUDRALIA_TOPOLOGY?.sample) {
        return window.AUDRALIA_TOPOLOGY.sample(map.u, map.v, {
          longitude: Number(map.longitude || 0) * Math.PI / 180,
          latitude: Number(map.latitude || 0) * Math.PI / 180,
          landmap: map
        });
      }
    } catch {
      document.documentElement.dataset.audraliaCanvasTopologySampleFailed = "true";
    }

    return null;
  }

  function sampleHydrology(map) {
    try {
      if (window.AUDRALIA_HYDROLOGY?.sampleHydrology) return window.AUDRALIA_HYDROLOGY.sampleHydrology(map);
      if (window.AUDRALIA_HYDROLOGY?.sample) return window.AUDRALIA_HYDROLOGY.sample(map);
    } catch {
      document.documentElement.dataset.audraliaCanvasHydrologySampleFailed = "true";
    }

    return null;
  }

  function sampleSurface(map) {
    try {
      if (window.AUDRALIA_LAND_SURFACE?.sampleSurface) return window.AUDRALIA_LAND_SURFACE.sampleSurface(map);
      if (window.AUDRALIA_LAND_SURFACE?.sample) return window.AUDRALIA_LAND_SURFACE.sample(map);
    } catch {
      document.documentElement.dataset.audraliaCanvasLandSurfaceSampleFailed = "true";
    }

    return null;
  }

  function isOceanLike(map) {
    return Boolean(map?.isOcean || map?.isShelf || map?.terrainClass === "ocean" || map?.terrainClass === "shelf");
  }

  function isBeachLike(map) {
    return Boolean(map?.isBeach || map?.terrainClass === "beach" || includesAny(map?.topology, ["beach", "shore"]));
  }

  function isLandLike(map) {
    return !isOceanLike(map) && !isBeachLike(map);
  }

  function oceanColor(map, hydro, topo) {
    const u = map.u;
    const v = map.v;
    const shelf = clamp(Number(map.shelf || 0), 0, 1);
    const depthSignal = topo ? clamp(Number(topo.belowSeaDepth || topo.seaFloorShape || 0.55), 0, 1) : fbm(u * 0.8, v * 0.7, 710000, 5);
    const texture = fbm(u * 1.4 + 0.19, v * 1.0 - 0.14, 710700, 5);
    const coastal = clamp(shelf * 0.62 + Number(map.beachEdge || 0) * 0.34 + Number(hydro?.coastalShelfWater || 0) * 0.30, 0, 1);

    let color = mix(COLORS.deepOcean, COLORS.ocean, smoothstep(0.10, 0.82, 1 - depthSignal));
    color = mix(color, COLORS.openOcean, texture * 0.22);
    color = mix(color, COLORS.shelf, smoothstep(0.20, 0.86, coastal) * 0.72);
    color = mix(color, COLORS.shallow, smoothstep(0.58, 1.0, coastal) * 0.62);

    if (hydro?.class === "lagoon-water") color = mix(color, COLORS.lagoon, 0.42);
    if (hydro?.class === "bay-water" || hydro?.class === "inlet-water") color = mix(color, COLORS.estuary, 0.26);

    return shade(color, (fbm(u * 7.0, v * 5.0, 711000, 3) - 0.5) * 7 - depthSignal * 4);
  }

  function beachColor(map, hydro) {
    const u = map.u;
    const v = map.v;
    const wet = clamp(Number(hydro?.estuary || 0) * 0.44 + Number(hydro?.delta || 0) * 0.32 + Number(map.shelf || 0) * 0.22, 0, 1);
    let color = mix(COLORS.beach, COLORS.wetBeach, wet);
    color = mix(color, COLORS.lagoon, clamp(Number(hydro?.lagoon || 0) * 0.20, 0, 0.30));
    return shade(color, (fbm(u * 10.0, v * 7.0, 720000, 3) - 0.5) * 8);
  }

  function fallbackLandColor(map, hydro, elevation, topo) {
    const u = map.u;
    const v = map.v;
    const terrain = [map.terrainClass, map.topology, map.elevation, elevation?.class, elevation?.zone, elevation?.form].map(text).join(" ");
    const relief = clamp(Number(elevation?.relief || 0.35), 0, 1);
    const mountain = clamp(Number(elevation?.mountain || 0), 0, 1);
    const basin = clamp(Number(elevation?.basin || 0), 0, 1);
    const ridge = clamp(Number(elevation?.ridge || 0), 0, 1);
    const wetland = clamp(Number(hydro?.wetland || 0) + Number(hydro?.marshBasin || 0) * 0.7, 0, 1);
    const waterMemory = clamp(Number(hydro?.watershed || 0) * 0.28 + Number(hydro?.drainage || 0) * 0.24, 0, 1);
    const topLand = topo ? clamp(Number(topo.landEligibility || 0.5), 0, 1) : 0.5;
    const grain = (fbm(u * 7.0 + 0.12, v * 5.8 - 0.24, 730000, 4) - 0.5) * 16;

    let color = COLORS.fallbackLand;

    if (includesAny(terrain, ["forest", "wetland", "lowland"])) color = mix(color, COLORS.forest, 0.42);
    if (includesAny(terrain, ["mountain", "ridge", "highland", "plateau"])) color = mix(color, COLORS.highland, 0.45);
    if (includesAny(terrain, ["basin", "dry"])) color = mix(color, COLORS.basin, 0.42);
    if (includesAny(terrain, ["polar", "snow", "ice"])) color = mix(color, COLORS.snow, 0.72);

    color = mix(color, COLORS.livingGreen, clamp(wetland * 0.42 + waterMemory * 0.28, 0, 0.55));
    color = mix(color, COLORS.highland, relief * 0.26);
    color = mix(color, COLORS.ridge, ridge * 0.26);
    color = mix(color, COLORS.mountain, mountain * 0.42);
    color = mix(color, COLORS.basin, basin * 0.24);
    color = mix(color, COLORS.gold, clamp(topLand * 0.08, 0, 0.14));

    return shade(color, grain + mountain * 10 - basin * 9);
  }

  function authorityLandColor(map, hydro, elevation, topo) {
    const surface = sampleSurface(map);

    if (surface?.allowed && Array.isArray(surface.color)) {
      let color = surface.color;
      color = mix(color, COLORS.wetland, clamp(Number(hydro?.wetland || 0) * 0.22, 0, 0.26));
      color = mix(color, COLORS.estuary, clamp(Number(hydro?.delta || 0) * 0.16, 0, 0.22));
      color = shade(color, clamp(Number(elevation?.shadowPressure || 0), 0, 1) * -8);
      return color;
    }

    return fallbackLandColor(map, hydro, elevation, topo);
  }

  function hydrologyOverlayColor(base, map, hydro) {
    if (!hydro) return base;

    const waterStrength = Math.max(
      Number(hydro.inlandSea || 0) * 1.12,
      Number(hydro.lake || 0) * 1.05,
      Number(hydro.river || 0) * 0.88,
      Number(hydro.delta || 0) * 0.78,
      Number(hydro.estuary || 0) * 0.82
    );

    const coastCutStrength = Math.max(
      Number(hydro.bay || 0) * 0.72,
      Number(hydro.inlet || 0) * 0.78,
      Number(hydro.lagoon || 0) * 0.70
    );

    const wetStrength = Math.max(
      Number(hydro.wetland || 0) * 0.62,
      Number(hydro.marshBasin || 0) * 0.58,
      Number(hydro.watershed || 0) * 0.20
    );

    const riverThread =
      ridgeNoise(map.u * 18.0 + 0.27, map.v * 14.0 - 0.11, 740000, 3) *
      smoothstep(0.58, 0.92, Number(hydro.river || 0));

    let color = base;

    if (waterStrength > 0.66) {
      const water = hydro.class === "river" ? COLORS.river : hydro.class === "estuary" ? COLORS.estuary : COLORS.inlandWater;
      color = mix(color, water, clamp((waterStrength - 0.56) * 1.8, 0, 0.78));
    }

    if (riverThread > 0.42) {
      color = mix(color, COLORS.river, clamp((riverThread - 0.36) * 0.62, 0, 0.48));
    }

    if (coastCutStrength > 0.54) {
      color = mix(color, COLORS.shallow, clamp((coastCutStrength - 0.48) * 0.80, 0, 0.46));
    }

    if (wetStrength > 0.42) {
      color = mix(color, COLORS.wetland, clamp((wetStrength - 0.34) * 0.52, 0, 0.32));
    }

    return color;
  }

  function surfaceColor(map) {
    const hydro = sampleHydrology(map);
    const elevation = sampleElevation(map);
    const topo = sampleTopology(map);

    if (isOceanLike(map)) {
      return oceanColor(map, hydro, topo);
    }

    if (isBeachLike(map)) {
      return beachColor(map, hydro);
    }

    let color = authorityLandColor(map, hydro, elevation, topo);
    color = hydrologyOverlayColor(color, map, hydro);
    return color;
  }

  function buildTexture(width, height) {
    const data = new Uint8ClampedArray(width * height * 4);
    let landPixels = 0;
    let waterPixels = 0;
    let hydrologyPixels = 0;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const map = sampleMap(u, v);
        const hydro = sampleHydrology(map);
        const color = surfaceColor(map);
        const index = (y * width + x) * 4;

        if (isLandLike(map)) landPixels += 1;
        else waterPixels += 1;

        if (hydro?.isSurfaceWater || hydro?.isLandformShaping) hydrologyPixels += 1;

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255;
      }
    }

    return Object.freeze({
      width,
      height,
      data,
      landRatio: Number((landPixels / Math.max(1, width * height)).toFixed(4)),
      waterRatio: Number((waterPixels / Math.max(1, width * height)).toFixed(4)),
      hydrologyRatio: Number((hydrologyPixels / Math.max(1, width * height)).toFixed(4))
    });
  }

  function textureSample(texture, u, v) {
    const x = Math.floor(wrap01(u) * texture.width) % texture.width;
    const y = clamp(Math.floor(clamp(v, 0, 1) * (texture.height - 1)), 0, texture.height - 1);
    const index = (y * texture.width + x) * 4;
    return [texture.data[index], texture.data[index + 1], texture.data[index + 2]];
  }

  function getBestRect(mount) {
    const stage = mount.closest("[data-audralia-stage='true'], .stage, #audralia-stage");
    const parent = mount.parentElement;

    const rects = [
      mount.getBoundingClientRect(),
      stage ? stage.getBoundingClientRect() : null,
      parent ? parent.getBoundingClientRect() : null
    ].filter(Boolean);

    const usable = rects.find((rect) => rect.width >= 80 && rect.height >= 80);

    if (usable) return usable;

    return {
      width: Math.max(320, Math.min(window.innerWidth || 420, GEOMETRY.maxCanvasSize)),
      height: Math.max(320, Math.min(window.innerWidth || 420, GEOMETRY.maxCanvasSize))
    };
  }

  function geometry(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const base = Math.min(width, height);
    const radius = base * GEOMETRY.radius;

    return Object.freeze({
      width,
      height,
      cx: width * GEOMETRY.centerX,
      cy: height * GEOMETRY.centerY,
      radius,
      sphereSize: clamp(Math.floor(radius * 2), GEOMETRY.minSpherePixels, GEOMETRY.maxSpherePixels)
    });
  }

  function drawFallback(ctx, canvas, now = performance.now()) {
    const g = geometry(canvas);
    const { width, height, cx, cy, radius } = g;

    ctx.clearRect(0, 0, width, height);

    const background = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.8);
    background.addColorStop(0, "rgba(16,54,68,.50)");
    background.addColorStop(0.48, "rgba(4,15,34,.78)");
    background.addColorStop(1, "rgba(1,4,13,.96)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const halo = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.18);
    halo.addColorStop(0, "rgba(142,202,226,0)");
    halo.addColorStop(0.68, "rgba(142,202,226,.13)");
    halo.addColorStop(1, "rgba(142,202,226,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.20, 0, TAU);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();

    const ocean = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.28, radius * 0.1, cx, cy, radius);
    ocean.addColorStop(0, "rgb(27,116,142)");
    ocean.addColorStop(0.38, "rgb(7,68,112)");
    ocean.addColorStop(1, "rgb(3,18,44)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const t = now * 0.001;
    const drift = Math.sin(t * INV_PHI) * radius * 0.035;

    ctx.fillStyle = "rgba(96,150,88,.94)";
    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.28 + drift, cy - radius * 0.08, radius * 0.34, radius * 0.55, -0.38, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx + radius * 0.22 + drift, cy + radius * 0.02, radius * 0.26, radius * 0.45, 0.34, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(72,164,164,.70)";
    ctx.lineWidth = Math.max(2, radius * 0.018);
    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.28 + drift, cy - radius * 0.08, radius * 0.38, radius * 0.59, -0.38, 0, TAU);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + radius * 0.22 + drift, cy + radius * 0.02, radius * 0.30, radius * 0.49, 0.34, 0, TAU);
    ctx.stroke();

    ctx.restore();

    return true;
  }

  function drawBackground(ctx, canvas, state) {
    const width = canvas.width;
    const height = canvas.height;
    const cx = width * 0.5;
    const cy = height * 0.48;

    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createRadialGradient(cx, cy, width * 0.05, cx, cy, width * 0.82);
    bg.addColorStop(0, "rgba(26,72,80,.72)");
    bg.addColorStop(0.38, "rgba(6,19,38,.96)");
    bg.addColorStop(1, "rgba(1,4,13,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.45;

    for (let i = 0; i < 62; i += 1) {
      const x = hash(i + 11, 4, 8801) * width;
      const y = hash(i + 17, 7, 8802) * height;
      const r = 0.6 + hash(i, 9, 8803) * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(210,248,230,.11)";
      ctx.fill();
    }

    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = "rgba(158,240,191,.22)";
    ctx.lineWidth = Math.max(1, width * 0.0011);

    for (let i = 0; i < 7; i += 1) {
      const y = height * (0.19 + i * 0.092);
      ctx.beginPath();
      ctx.moveTo(width * 0.08, y);
      ctx.bezierCurveTo(width * 0.30, y - 20, width * 0.66, y + 18, width * 0.92, y - 6);
      ctx.stroke();
    }

    ctx.restore();

    const glow = ctx.createRadialGradient(state.cx, state.cy, state.radius * 0.42, state.cx, state.cy, state.radius * 1.42);
    glow.addColorStop(0, "rgba(158,240,191,.02)");
    glow.addColorStop(0.56, "rgba(141,216,255,.08)");
    glow.addColorStop(0.82, "rgba(158,240,191,.11)");
    glow.addColorStop(1, "rgba(158,240,191,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * 1.42, 0, TAU);
    ctx.fill();
  }

  function buildSphereImage(texture, state, now) {
    const size = state.sphereSize;
    const radius = size * 0.5;
    const image = state.sphereCtx.createImageData(size, size);
    const out = image.data;

    const rotation = state.rotation;
    const tilt = state.tilt;
    const sinTilt = Math.sin(tilt);
    const cosTilt = Math.cos(tilt);
    const light = [-0.46, 0.30, 0.84];
    const cloudShift = now * 0.00003;

    for (let y = 0; y < size; y += 1) {
      const ny = (y - radius) / radius;

      for (let x = 0; x < size; x += 1) {
        const nx = (x - radius) / radius;
        const d2 = nx * nx + ny * ny;
        const index = (y * size + x) * 4;

        if (d2 > 1) {
          out[index + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - d2);
        const y3 = -ny * cosTilt - z * sinTilt;
        const z3 = -ny * sinTilt + z * cosTilt;
        const x3 = nx;

        const latitude = Math.asin(clamp(y3, -1, 1));
        const longitude = Math.atan2(x3, z3) + rotation;
        const u = longitude / TAU + 0.5;
        const v = 0.5 - latitude / Math.PI;

        let color = textureSample(texture, u, v);

        const lightDot = clamp(x3 * light[0] + y3 * light[1] + z * light[2], -1, 1);
        const daylight = 0.30 + Math.max(0, lightDot) * 0.86;
        const night = smoothstep(-0.50, 0.12, lightDot);
        const limb = Math.pow(1 - z, 1.72);
        const rim = Math.pow(1 - z, 3.10);

        const cloudNoise = fbm(
          longitude * 2.1 + Math.sin(latitude * 4.0) * 0.30 + cloudShift,
          latitude * 3.0 - cloudShift,
          760000,
          4
        );

        const cloud = smoothstep(0.67, 0.88, cloudNoise) * smoothstep(-0.92, 0.55, lightDot) * 0.18;

        let r = color[0] * daylight;
        let g = color[1] * daylight;
        let b = color[2] * daylight;

        r = lerp(r * 0.42, r, night);
        g = lerp(g * 0.50, g, night);
        b = lerp(b * 0.70, b, night);

        r = lerp(r, COLORS.cloud[0], cloud);
        g = lerp(g, COLORS.cloud[1], cloud);
        b = lerp(b, COLORS.cloud[2], cloud);

        r = lerp(r, COLORS.atmosphere[0], limb * 0.24);
        g = lerp(g, COLORS.atmosphere[1], limb * 0.20);
        b = lerp(b, COLORS.atmosphere[2], limb * 0.26);

        r = lerp(r, COLORS.atmosphereBright[0], rim * 0.34);
        g = lerp(g, COLORS.atmosphereBright[1], rim * 0.30);
        b = lerp(b, COLORS.atmosphereBright[2], rim * 0.32);

        out[index] = clamp(Math.round(r), 0, 255);
        out[index + 1] = clamp(Math.round(g), 0, 255);
        out[index + 2] = clamp(Math.round(b), 0, 255);
        out[index + 3] = clamp(Math.round(255 * smoothstep(1.006, 0.985, d2)), 0, 255);
      }
    }

    state.sphereCtx.putImageData(image, 0, 0);
  }

  function drawAtmosphere(ctx, state) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const halo = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.radius * 0.92,
      state.cx,
      state.cy,
      state.radius * GEOMETRY.atmosphereRadius
    );

    halo.addColorStop(0, "rgba(142,202,226,0)");
    halo.addColorStop(0.40, "rgba(142,202,226,.040)");
    halo.addColorStop(0.76, "rgba(142,202,226,.104)");
    halo.addColorStop(1, "rgba(142,202,226,0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * GEOMETRY.atmosphereRadius, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function draw(ctx, canvas, texture, state, now) {
    drawBackground(ctx, canvas, state);
    buildSphereImage(texture, state, now);

    const diameter = state.radius * 2;
    ctx.drawImage(state.sphereCanvas, state.cx - state.radius, state.cy - state.radius, diameter, diameter);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.23;

    const spec = ctx.createRadialGradient(
      state.cx - state.radius * 0.24,
      state.cy - state.radius * 0.36,
      0,
      state.cx - state.radius * 0.24,
      state.cy - state.radius * 0.36,
      state.radius * 0.72
    );

    spec.addColorStop(0, "rgba(255,255,255,.58)");
    spec.addColorStop(0.25, "rgba(214,255,235,.18)");
    spec.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "rgba(243,200,111,.18)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.0013);
    ctx.beginPath();
    ctx.ellipse(state.cx, state.cy, state.radius * 1.08, state.radius * 0.68, -0.08, 0, TAU);
    ctx.stroke();
    ctx.restore();

    drawAtmosphere(ctx, state);
  }

  function pointerToMap(event, canvas, state) {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX || 0) - rect.left) / Math.max(1, rect.width);
    const y = ((event.clientY || 0) - rect.top) / Math.max(1, rect.height);
    const px = (x - GEOMETRY.centerX) / GEOMETRY.pointerRadius;
    const py = (y - GEOMETRY.centerY) / GEOMETRY.pointerRadius;
    const rr = px * px + py * py;

    if (rr > 1) return null;

    const z = Math.sqrt(1 - rr);
    const cosSpin = Math.cos(state.rotation);
    const sinSpin = Math.sin(state.rotation);
    const cosTilt = Math.cos(state.tilt);
    const sinTilt = Math.sin(state.tilt);

    let sx = px;
    let sy = py;
    let sz = z;

    const ty = sy * cosTilt - sz * sinTilt;
    const tz = sy * sinTilt + sz * cosTilt;

    sy = ty;
    sz = tz;

    const wx = sx * cosSpin - sz * sinSpin;
    const wz = sx * sinSpin + sz * cosSpin;
    const longitude = Math.atan2(wz, wx);
    const latitude = Math.asin(clamp(sy, -1, 1));
    const u = longitude / TAU + 0.5;
    const v = 0.5 - latitude / Math.PI;

    return sampleMap(u, v);
  }

  function mount(mountNode, options = {}) {
    const mount = mountNode && mountNode.nodeType === 1 ? mountNode : document.body;

    mount.querySelectorAll("canvas[data-audralia-parent-chain-canvas='true']").forEach((node) => node.remove());
    mount.querySelectorAll("canvas[data-audralia-visible-canvas='true']").forEach((node) => node.remove());

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";
    mount.style.minHeight = mount.style.minHeight || "300px";
    mount.style.zIndex = mount.style.zIndex || "2";

    const canvas = document.createElement("canvas");
    canvas.dataset.audraliaParentChainCanvas = "true";
    canvas.dataset.audraliaVisibleCanvas = "true";
    canvas.dataset.audraliaCanvasContract = COMPATIBLE_CONTRACT;
    canvas.dataset.audraliaCanvasRenderContract = CONTRACT;
    canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    canvas.dataset.audraliaPreviousCanvasContract = PREVIOUS_CONTRACT;
    canvas.dataset.audraliaOrganicChainConsumer = "true";
    canvas.dataset.audraliaCanvasOwnsFootprint = "false";
    canvas.dataset.audraliaCanvasOwnsHydrology = "false";
    canvas.dataset.audraliaCanvasOwnsTopology = "false";
    canvas.dataset.audraliaCanvasOwnsElevation = "false";
    canvas.dataset.audraliaCanvasOwnsClimate = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.setAttribute("aria-label", "Audralia organic landform and hydrology globe");

    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      zIndex: "4",
      display: "block",
      width: "100%",
      height: "100%",
      minWidth: `${GEOMETRY.minCanvasSize}px`,
      minHeight: `${GEOMETRY.minCanvasSize}px`,
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      cursor: "grab",
      background: "transparent"
    });

    mount.appendChild(canvas);

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    const sphereCanvas = document.createElement("canvas");
    const sphereCtx = sphereCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false
    });

    const state = {
      disposed: false,
      mounted: true,
      ready: false,
      dragging: false,
      lastX: 0,
      lastY: 0,
      rotation: -0.92,
      targetRotation: -0.92,
      tilt: -0.11,
      targetTilt: -0.11,
      velocity: 0.000055,
      lastTime: performance.now(),
      lastRender: 0,
      frames: 0,
      visiblePixelsPainted: false,
      fallbackPainted: false,
      advancedTextureReady: false,
      organicChainConsumer: true,
      renderError: "",
      authorityStatus: {
        latticeLoaded: false,
        topologyLoaded: false,
        landmapLoaded: false,
        elevationLoaded: false,
        hydrologyLoaded: false,
        climateLoaded: false,
        landSurfaceLoaded: false
      },
      textureStatus: {
        landRatio: 0,
        waterRatio: 0,
        hydrologyRatio: 0
      },
      reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      width: 1,
      height: 1,
      dpr: 1,
      radius: 180,
      cx: 0,
      cy: 0,
      sphereSize: 360,
      sphereCanvas,
      sphereCtx,
      visible: true
    };

    let texture = null;
    let resizeTimer = null;
    let animationFrame = 0;

    function emitStatus(phase) {
      document.documentElement.dataset.audraliaCanvasLoaded = "true";
      document.documentElement.dataset.audraliaCanvasContract = COMPATIBLE_CONTRACT;
      document.documentElement.dataset.audraliaCanvasRenderContract = CONTRACT;
      document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
      document.documentElement.dataset.audraliaCanvasPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.audraliaCanvasMounted = String(state.mounted);
      document.documentElement.dataset.audraliaVisiblePixelsPainted = String(state.visiblePixelsPainted);
      document.documentElement.dataset.audraliaFallbackPainted = String(state.fallbackPainted);
      document.documentElement.dataset.audraliaAdvancedTextureReady = String(state.advancedTextureReady);
      document.documentElement.dataset.audraliaOrganicChainConsumer = "true";
      document.documentElement.dataset.audraliaCanvasFrames = String(state.frames);
      document.documentElement.dataset.audraliaCanvasRenderError = state.renderError;
      document.documentElement.dataset.audraliaLattice256Loaded = String(state.authorityStatus.latticeLoaded);
      document.documentElement.dataset.audraliaTopologyLoaded = String(state.authorityStatus.topologyLoaded);
      document.documentElement.dataset.audraliaLandmapLoaded = String(state.authorityStatus.landmapLoaded);
      document.documentElement.dataset.audraliaElevationLoaded = String(state.authorityStatus.elevationLoaded);
      document.documentElement.dataset.audraliaHydrologyLoaded = String(state.authorityStatus.hydrologyLoaded);
      document.documentElement.dataset.audraliaClimateLoaded = String(state.authorityStatus.climateLoaded);
      document.documentElement.dataset.audraliaLandSurfaceLoaded = String(state.authorityStatus.landSurfaceLoaded);
      document.documentElement.dataset.audraliaTextureLandRatio = String(state.textureStatus.landRatio);
      document.documentElement.dataset.audraliaTextureWaterRatio = String(state.textureStatus.waterRatio);
      document.documentElement.dataset.audraliaTextureHydrologyRatio = String(state.textureStatus.hydrologyRatio);
      document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
      document.documentElement.dataset.audraliaCanvasOwnsHydrology = "false";
      document.documentElement.dataset.audraliaCanvasOwnsTopology = "false";
      document.documentElement.dataset.audraliaCanvasOwnsElevation = "false";
      document.documentElement.dataset.audraliaCanvasOwnsClimate = "false";
      document.documentElement.dataset.generatedImage = "false";
      document.documentElement.dataset.graphicBox = "false";
      document.documentElement.dataset.visualPassClaimed = "false";

      canvas.dataset.visiblePixelsPainted = String(state.visiblePixelsPainted);
      canvas.dataset.fallbackPainted = String(state.fallbackPainted);
      canvas.dataset.advancedTextureReady = String(state.advancedTextureReady);

      if (typeof options.onStatus === "function") {
        options.onStatus(phase, {
          mounted: state.mounted,
          canvasFound: true,
          controlsBound: true,
          frames: state.frames,
          visiblePixelsPainted: state.visiblePixelsPainted,
          fallbackPainted: state.fallbackPainted,
          advancedTextureReady: state.advancedTextureReady,
          renderError: state.renderError,
          organicChainConsumer: true,
          textureLandRatio: state.textureStatus.landRatio,
          textureWaterRatio: state.textureStatus.waterRatio,
          textureHydrologyRatio: state.textureStatus.hydrologyRatio,
          ...state.authorityStatus,
          canvasOwnsFootprint: false,
          canvasOwnsHydrology: false,
          canvasOwnsTopology: false,
          canvasOwnsElevation: false,
          canvasOwnsClimate: false,
          generatedImage: false,
          graphicBox: false,
          visualPassClaimed: false
        });
      }
    }

    function resize() {
      if (!ctx) {
        state.renderError = "Canvas context unavailable";
        emitStatus("context-unavailable");
        return;
      }

      const rect = getBestRect(mount);
      const dpr = Math.min(GEOMETRY.maxDpr, window.devicePixelRatio || 1);
      const width = Math.max(GEOMETRY.minCanvasSize, Math.floor((rect.width || 420) * dpr));
      const height = Math.max(GEOMETRY.minCanvasSize, Math.floor((rect.height || rect.width || 420) * dpr));

      state.width = width;
      state.height = height;
      state.dpr = dpr;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const g = geometry(canvas);
      state.cx = g.cx;
      state.cy = g.cy;
      state.radius = g.radius;
      state.sphereSize = g.sphereSize;

      if (sphereCanvas.width !== state.sphereSize || sphereCanvas.height !== state.sphereSize) {
        sphereCanvas.width = state.sphereSize;
        sphereCanvas.height = state.sphereSize;
      }

      if (!state.ready) {
        state.visiblePixelsPainted = drawFallback(ctx, canvas);
        state.fallbackPainted = state.visiblePixelsPainted;
      }

      emitStatus("resized");
    }

    function scheduleResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 80);
    }

    function pointerDown(event) {
      state.dragging = true;
      state.lastX = event.clientX || 0;
      state.lastY = event.clientY || 0;
      canvas.style.cursor = "grabbing";

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {}

      const map = pointerToMap(event, canvas, state);
      if (map) {
        document.documentElement.dataset.audraliaLastCell256 = String(map.cell256 || "");
        document.documentElement.dataset.audraliaLastTerrainClass = String(map.terrainClass || "");
      }
    }

    function pointerMove(event) {
      if (!state.dragging) return;

      const x = event.clientX || 0;
      const y = event.clientY || 0;
      const dx = x - state.lastX;
      const dy = y - state.lastY;

      state.targetRotation += dx * 0.010;
      state.targetTilt = clamp(state.targetTilt + dy * 0.0045, -0.72, 0.62);
      state.lastX = x;
      state.lastY = y;
    }

    function pointerUp(event) {
      state.dragging = false;
      canvas.style.cursor = "grab";

      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {}
    }

    function tick(now) {
      if (state.disposed) return;

      const dt = Math.min(64, now - state.lastTime);
      state.lastTime = now;

      if (!state.reducedMotion && !state.dragging) {
        state.targetRotation += dt * state.velocity;
      }

      state.rotation += (state.targetRotation - state.rotation) * 0.16;
      state.tilt += (state.targetTilt - state.tilt) * 0.14;

      if (ctx && texture && state.ready && state.visible && now - state.lastRender > 42) {
        try {
          draw(ctx, canvas, texture, state, now);
          state.frames += 1;
          state.visiblePixelsPainted = true;
          state.renderError = "";
          state.lastRender = now;
          emitStatus("rendering");
        } catch (error) {
          state.renderError = error instanceof Error ? error.message : String(error);
          state.visiblePixelsPainted = drawFallback(ctx, canvas, now);
          state.fallbackPainted = state.visiblePixelsPainted;
          emitStatus("render-fallback-after-error");
        }
      }

      animationFrame = window.requestAnimationFrame(tick);
    }

    resize();

    window.addEventListener("resize", scheduleResize, { passive: true });
    canvas.addEventListener("pointerdown", pointerDown, { passive: true });
    canvas.addEventListener("pointermove", pointerMove, { passive: true });
    canvas.addEventListener("pointerup", pointerUp, { passive: true });
    canvas.addEventListener("pointercancel", pointerUp, { passive: true });
    canvas.addEventListener("lostpointercapture", pointerUp, { passive: true });

    let observer = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          state.visible = entries.some((entry) => entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    ensureAuthorities()
      .then((authorityStatus) => {
        state.authorityStatus = authorityStatus;

        try {
          texture = buildTexture(GEOMETRY.textureWidth, GEOMETRY.textureHeight);
          state.textureStatus = {
            landRatio: texture.landRatio,
            waterRatio: texture.waterRatio,
            hydrologyRatio: texture.hydrologyRatio
          };
          state.advancedTextureReady = true;
          state.ready = true;
          emitStatus("texture-ready");
          animationFrame = window.requestAnimationFrame(tick);
        } catch (error) {
          state.renderError = error instanceof Error ? error.message : String(error);
          texture = buildTexture(384, 192);
          state.textureStatus = {
            landRatio: texture.landRatio,
            waterRatio: texture.waterRatio,
            hydrologyRatio: texture.hydrologyRatio
          };
          state.advancedTextureReady = false;
          state.fallbackPainted = true;
          state.ready = true;
          emitStatus("texture-fallback-ready");
          animationFrame = window.requestAnimationFrame(tick);
        }
      })
      .catch((error) => {
        state.renderError = error instanceof Error ? error.message : String(error);
        state.visiblePixelsPainted = drawFallback(ctx, canvas);
        state.fallbackPainted = state.visiblePixelsPainted;
        emitStatus("authority-load-fallback");
      });

    function dispose() {
      state.disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", scheduleResize);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.removeEventListener("lostpointercapture", pointerUp);

      if (observer) observer.disconnect();

      canvas.remove();
      state.mounted = false;
      emitStatus("disposed");
    }

    window.__AUDRALIA_CANVAS_DISPOSE__ = dispose;

    return Object.freeze({
      canvas,
      controlsBound: true,
      dispose,
      getStatus
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: COMPATIBLE_CONTRACT,
      renderContract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-canvas-organic-chain-consumer",
      mathBinding: "high_order_computable_planetary_math",
      geometry: GEOMETRY,
      expected: EXPECTED,
      consumesLandmap: true,
      consumesHydrology: true,
      consumesTopology: true,
      consumesElevation: true,
      consumesLandSurface: true,
      consumesClimateWhenAvailable: true,
      canvasOwnsFootprint: false,
      canvasOwnsHydrology: false,
      canvasOwnsTopology: false,
      canvasOwnsElevation: false,
      canvasOwnsClimate: false,
      canvasOwnsRoute: false,
      coordinateInspection: true,
      organicChainConsumer: true,
      oneBigGlobTargeted: true,
      visibleHydrology: true,
      coastalInterruption: true,
      inlandWater: true,
      reliefShading: true,
      boxedContainment: true,
      touchScope: "box-only",
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_CANVAS = Object.freeze({
    contract: COMPATIBLE_CONTRACT,
    renderContract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    expected: EXPECTED,
    mount,
    getStatus
  });

  window.AUDRALIA_CANVAS_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaCanvasLoaded = "true";
  document.documentElement.dataset.audraliaCanvasContract = COMPATIBLE_CONTRACT;
  document.documentElement.dataset.audraliaCanvasRenderContract = CONTRACT;
  document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
  document.documentElement.dataset.audraliaCanvasPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaCanvasExposesMount = "true";
  document.documentElement.dataset.audraliaOrganicChainConsumer = "true";
  document.documentElement.dataset.audraliaCanvasConsumesLandmap = "true";
  document.documentElement.dataset.audraliaCanvasConsumesHydrology = "true";
  document.documentElement.dataset.audraliaCanvasConsumesTopology = "true";
  document.documentElement.dataset.audraliaCanvasConsumesElevation = "true";
  document.documentElement.dataset.audraliaCanvasConsumesLandSurface = "true";
  document.documentElement.dataset.audraliaCanvasOwnsFootprint = "false";
  document.documentElement.dataset.audraliaCanvasOwnsHydrology = "false";
  document.documentElement.dataset.audraliaCanvasOwnsTopology = "false";
  document.documentElement.dataset.audraliaCanvasOwnsElevation = "false";
  document.documentElement.dataset.audraliaCanvasOwnsClimate = "false";
  document.documentElement.dataset.audraliaOneBigGlobTargeted = "true";
  document.documentElement.dataset.audraliaVisibleHydrology = "true";
  document.documentElement.dataset.audraliaCoastalInterruption = "true";
  document.documentElement.dataset.audraliaInlandWater = "true";
  document.documentElement.dataset.audraliaReliefShading = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
