// /assets/hearth/hearth.hydration.js
// HEARTH_G3_7_HYDRATION_ENGINE_TNT_v1
// Full-file replacement.
// Purpose:
// - Hydration authority for Hearth G3.
// - Own ocean material, shelf wetness, basin/lake candidates, river/drainage candidates,
//   glacier/frozen-water storage candidates, wetlands, water saturation, and water-material classification.
// - Does NOT own clouds, weather, rainfall, climate, seasons, wind, storms, or atmosphere.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_7_HYDRATION_ENGINE_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-7-hydration-engine";
  const RECEIPT = "HEARTH_G3_7_HYDRATION_ENGINE_RECEIPT";

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / ((b - a) || 1e-9), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapLon(lon) {
    let v = lon;
    while (v < -180) v += 360;
    while (v >= 180) v -= 360;
    return v;
  }

  function hash2(x, y, seed = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed = 0) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed = 0, octaves = 5) {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      sum += valueNoise(x * freq, y * freq, seed + i * 21.17) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? sum / norm : 0;
  }

  function ridgeWater(lon, lat, x1, y1, x2, y2, width, amp) {
    const vx = x2 - x1;
    const vy = y2 - y1;
    const wx = lon - x1;
    const wy = lat - y1;
    const c1 = wx * vx + wy * vy;
    const c2 = vx * vx + vy * vy || 1;
    const t = clamp(c1 / c2, 0, 1);
    const sx = x1 + vx * t;
    const sy = y1 + vy * t;
    const d = Math.hypot(lon - sx, lat - sy);
    return amp * (1 - smoothstep(width * 0.22, width, d));
  }

  const RIVER_CANDIDATES = [
    { name: "nile-candidate", x1: 31, y1: 2, x2: 31, y2: 30, width: 2.8, amp: 0.42 },
    { name: "amazon-candidate", x1: -73, y1: -4, x2: -48, y2: -1, width: 4.0, amp: 0.50 },
    { name: "mississippi-candidate", x1: -96, y1: 47, x2: -90, y2: 29, width: 3.5, amp: 0.36 },
    { name: "ganges-candidate", x1: 76, y1: 30, x2: 90, y2: 23, width: 3.0, amp: 0.40 },
    { name: "yangtze-candidate", x1: 91, y1: 32, x2: 121, y2: 31, width: 3.0, amp: 0.38 },
    { name: "congo-candidate", x1: 18, y1: 1, x2: 12, y2: -6, width: 3.4, amp: 0.34 },
    { name: "murray-candidate", x1: 142, y1: -28, x2: 139, y2: -35, width: 2.5, amp: 0.26 }
  ];

  const BASIN_CANDIDATES = [
    { name: "great-lakes-basin", lon: -84, lat: 45, rx: 8, ry: 4, amp: 0.65 },
    { name: "east-africa-lakes", lon: 32, lat: -4, rx: 5, ry: 8, amp: 0.46 },
    { name: "caspian-basin", lon: 50, lat: 42, rx: 8, ry: 4, amp: 0.48 },
    { name: "siberian-wet-basin", lon: 82, lat: 58, rx: 16, ry: 7, amp: 0.25 },
    { name: "austral-basin", lon: 136, lat: -29, rx: 12, ry: 8, amp: 0.22 }
  ];

  function basinField(lon, lat) {
    let v = 0;
    let owner = "none";

    for (const b of BASIN_CANDIDATES) {
      const dx = (wrapLon(lon - b.lon)) / b.rx;
      const dy = (lat - b.lat) / b.ry;
      const q = 1 - (dx * dx + dy * dy);
      const n = b.amp * smoothstep(-0.35, 0.92, q);
      if (n > v) owner = b.name;
      v = Math.max(v, n);
    }

    return { value: clamp(v, 0, 1), owner };
  }

  function riverField(lon, lat, terrainSample) {
    let v = 0;
    let owner = "none";

    for (const r of RIVER_CANDIDATES) {
      const n = ridgeWater(lon, lat, r.x1, r.y1, r.x2, r.y2, r.width, r.amp);
      if (n > v) owner = r.name;
      v = Math.max(v, n);
    }

    const elevationGate = terrainSample && terrainSample.land
      ? smoothstep(0.08, 0.72, 1 - Math.abs((terrainSample.elevation || 0) - 0.32))
      : 0;

    return {
      value: clamp(v * elevationGate, 0, 1),
      owner
    };
  }

  function sample(lonInput, latInput, terrainSample = null) {
    const lon = wrapLon(lonInput);
    const lat = clamp(latInput, -89.999, 89.999);
    const nx = (lon + 180) / 360;
    const ny = (90 - lat) / 180;
    const latAbs = Math.abs(lat);

    const t = terrainSample || {};
    const land = !!t.land;
    const elevation = Number.isFinite(t.elevation) ? t.elevation : 0;
    const coast = clamp(t.coast || 0, 0, 1);
    const shelf = clamp(t.shelf || 0, 0, 1);
    const bathymetry = clamp(t.bathymetry || 0, 0, 1);
    const ice = clamp(t.ice || 0, 0, 1);
    const moisture = clamp(t.moisture || 0.5, 0, 1);
    const aridity = clamp(t.aridity || 0, 0, 1);
    const roughness = clamp(t.roughness || 0, 0, 1);

    const basin = basinField(lon, lat);
    const river = riverField(lon, lat, t);

    const drainageNoise = fbm(nx * 36 + 4, ny * 22 - 9, 401.4, 4);
    const wetlandNoise = fbm(nx * 54 - 12, ny * 31 + 3, 515.2, 3);
    const meltNoise = fbm(nx * 22 + 2, ny * 17 - 6, 722.6, 3);
    const surfaceCurrent = fbm(nx * 40 + 18, ny * 21 - 7, 604.8, 4);

    const ocean = land ? 0 : 1;
    const shallowWater = land ? 0 : clamp(shelf * 1.08, 0, 1);
    const deepWater = land ? 0 : smoothstep(0.30, 0.92, bathymetry);
    const abyssWater = land ? 0 : smoothstep(0.62, 1.0, bathymetry);

    const coastalWetness = land
      ? clamp(coast * 0.72 + moisture * 0.22 - aridity * 0.18, 0, 1)
      : clamp(coast * 0.35 + shelf * 0.70, 0, 1);

    const lake = land
      ? clamp(basin.value * (0.35 + moisture * 0.45) * (1 - aridity * 0.45), 0, 1)
      : 0;

    const riverCandidate = land
      ? clamp(river.value * (0.42 + moisture * 0.40) * (1 - aridity * 0.38), 0, 1)
      : 0;

    const drainageCandidate = land
      ? clamp(
          riverCandidate * 0.62 +
          smoothstep(0.58, 0.88, drainageNoise) * 0.18 * smoothstep(0.10, 0.72, elevation) +
          coast * 0.10,
          0,
          1
        )
      : 0;

    const wetland = land
      ? clamp(
          coastalWetness * 0.35 +
          lake * 0.32 +
          smoothstep(0.66, 0.92, wetlandNoise) * moisture * 0.20 -
          aridity * 0.22,
          0,
          1
        )
      : 0;

    const frozenStorage = land
      ? clamp(
          ice * 0.72 +
          smoothstep(0.62, 0.92, elevation) * smoothstep(45, 78, latAbs) * 0.28 +
          smoothstep(0.72, 0.94, meltNoise) * ice * 0.16,
          0,
          1
        )
      : 0;

    const meltCandidate = land
      ? clamp(frozenStorage * smoothstep(0.10, 0.62, 1 - latAbs / 90) * (0.35 + drainageNoise * 0.25), 0, 1)
      : 0;

    const saturation = land
      ? clamp(coastalWetness * 0.28 + lake * 0.35 + riverCandidate * 0.28 + wetland * 0.36 + meltCandidate * 0.16, 0, 1)
      : clamp(shallowWater * 0.55 + deepWater * 0.35 + coast * 0.20, 0, 1);

    let material = "dry-land";
    if (!land) {
      if (abyssWater > 0.50) material = "abyss-ocean";
      else if (deepWater > 0.42) material = "deep-ocean";
      else if (shallowWater > 0.45) material = "shallow-shelf";
      else material = "ocean";
    } else if (frozenStorage > 0.55) {
      material = "frozen-storage";
    } else if (lake > 0.45) {
      material = "lake-basin";
    } else if (riverCandidate > 0.40) {
      material = "river-candidate";
    } else if (wetland > 0.38) {
      material = "wetland";
    } else if (coastalWetness > 0.45) {
      material = "coastal-wet-terrain";
    }

    return {
      contract: CONTRACT,
      generation: "G3.7-candidate",
      lon,
      lat,
      land,
      ocean,
      shallowWater,
      deepWater,
      abyssWater,
      coastalWetness,
      lake,
      lakeBasin: basin.owner,
      riverCandidate,
      riverPath: river.owner,
      drainageCandidate,
      wetland,
      frozenStorage,
      meltCandidate,
      saturation,
      surfaceCurrent: clamp(surfaceCurrent, 0, 1),
      roughWater: clamp(surfaceCurrent * 0.45 + roughness * 0.18 + bathymetry * 0.16, 0, 1),
      material,
      g4Deferred: true,
      noClouds: true,
      noWeather: true,
      noClimate: true
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      owner: "/assets/hearth/hearth.hydration.js",
      generation: {
        previousCandidate: "G3.6",
        currentCandidate: "G3.7",
        focus: "hydration engine",
        g3Definition: "terrain hydration, ocean material, shelves, lakes, basins, drainage, frozen-water storage",
        g4Deferred: "clouds, weather, climate"
      },
      api: "window.HEARTH_HYDRATION.sample(lonDegrees, latDegrees, terrainSample)",
      owns: [
        "ocean-material",
        "shallow-water",
        "deep-water",
        "abyss-water",
        "coastal-wetness",
        "lake-basins",
        "river-candidates",
        "drainage-candidates",
        "wetlands",
        "frozen-water-storage",
        "melt-candidates",
        "water-saturation"
      ],
      doesNotOwn: [
        "clouds",
        "weather",
        "climate",
        "rainfall",
        "storms",
        "wind",
        "seasons",
        "atmosphere",
        "canvas-projection",
        "route-shell"
      ],
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      graphicBox: false
    });
  }

  window.HEARTH_HYDRATION = Object.freeze({
    contract: CONTRACT,
    version: VERSION,
    sample,
    receipt
  });

  document.documentElement.dataset.hearthHydrationLoaded = "true";
  document.documentElement.dataset.hearthHydrationContract = CONTRACT;
  document.documentElement.dataset.hearthHydrationVersion = VERSION;
})();
