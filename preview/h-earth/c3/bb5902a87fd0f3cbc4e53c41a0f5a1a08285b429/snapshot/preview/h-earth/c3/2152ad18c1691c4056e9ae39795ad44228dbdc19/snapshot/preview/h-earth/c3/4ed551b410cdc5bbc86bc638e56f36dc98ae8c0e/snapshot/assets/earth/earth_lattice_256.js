/* /assets/earth/earth_lattice_256.js
   EARTH_G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW_TNT_v1
   256-state lattice surface authority only.
*/

(function () {
  "use strict";

  const VERSION = "EARTH_G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW_TNT_v1";
  const TWO_PI = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function hash2(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }

  function noise2(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    const a = hash2(ix, iy);
    const b = hash2(ix + 1, iy);
    const c = hash2(ix, iy + 1);
    const d = hash2(ix + 1, iy + 1);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y) {
    let value = 0;
    let amplitude = 0.54;
    let frequency = 1;

    for (let i = 0; i < 5; i += 1) {
      value += noise2(x * frequency, y * frequency) * amplitude;
      frequency *= 2.03;
      amplitude *= 0.52;
    }

    return clamp(value, 0, 1);
  }

  function colorMix(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
    ];
  }

  function classifyDirection(latIndex, lonIndex) {
    if (latIndex >= 12) return "north";
    if (latIndex <= 3) return "south";
    if (lonIndex >= 8) return "east";
    return "west";
  }

  function sample(lat, lon, input) {
    const options = input || {};
    const time = Number(options.timeSeconds || 0);
    const cloudPhase = Number(options.cloudPhase || 0);

    const u = wrap01(lon / TWO_PI + 0.5);
    const v = clamp(0.5 - lat / Math.PI, 0, 1);
    const absLat = Math.abs(lat) / HALF_PI;

    const latIndex = clamp(Math.floor(((lat + HALF_PI) / Math.PI) * 16), 0, 15);
    const lonIndex = clamp(Math.floor(u * 16), 0, 15);
    const stateId = latIndex * 16 + lonIndex;
    const direction = classifyDirection(latIndex, lonIndex);

    const continentalBias =
      0.48 * fbm(u * 2.8 + 0.17, v * 1.9 - 0.21) +
      0.26 * fbm(u * 6.1 - 1.4, v * 4.6 + 0.8) +
      0.16 * Math.sin(lon * 2.1 + Math.sin(lat * 3.0)) +
      0.10 * Math.cos(lat * 5.2 + Math.sin(lon * 1.7));

    const threshold = 0.44 + absLat * 0.12 - 0.04 * Math.sin(lon * 3.0);
    const coastDistance = Math.abs(continentalBias - threshold);
    const ice = smoothstep(0.74, 0.96, absLat + fbm(u * 5.0, v * 5.0) * 0.07);
    const land = continentalBias > threshold && ice < 0.88;
    const coast = coastDistance < 0.048 && ice < 0.85;

    const elevation = land
      ? clamp((continentalBias - threshold) * 2.4 + fbm(u * 12.0, v * 8.0) * 0.42, 0, 1)
      : 0;

    const oceanDepth = land
      ? 0
      : clamp((threshold - continentalBias) * 2.8 + fbm(u * 7.0 + 4.0, v * 5.0) * 0.25, 0, 1);

    const moisture = clamp(
      0.52 +
      0.28 * Math.cos(lat * 2.0) +
      0.18 * fbm(u * 8.0 + 9.0, v * 6.0 - 2.0) -
      0.20 * elevation,
      0,
      1
    );

    const arid = land && moisture < 0.42 && Math.abs(lat) > 0.16 && Math.abs(lat) < 0.72;
    const forest = land && moisture >= 0.54 && elevation < 0.62;
    const highland = land && elevation >= 0.62;

    let biome = "deep_ocean";
    let base = [4, 18, 46];
    let water = 1;

    if (ice > 0.84) {
      biome = "ice";
      base = colorMix([220, 236, 242], [245, 249, 246], clamp(ice, 0, 1));
      water = land ? 0.1 : 0.7;
    } else if (land) {
      water = 0;

      if (highland) {
        biome = "highland";
        base = colorMix([91, 91, 70], [180, 174, 142], elevation);
      } else if (arid) {
        biome = "arid";
        base = colorMix([124, 104, 62], [181, 151, 86], 0.55 + elevation * 0.35);
      } else if (forest) {
        biome = "forest";
        base = colorMix([28, 88, 58], [63, 127, 70], moisture);
      } else {
        biome = "lowland";
        base = colorMix([54, 108, 70], [114, 128, 74], elevation * 0.55);
      }
    } else if (coast || oceanDepth < 0.18) {
      biome = "shelf";
      base = colorMix([14, 76, 101], [36, 142, 148], 1 - oceanDepth);
    } else {
      biome = "deep_ocean";
      base = colorMix([3, 17, 48], [8, 50, 89], 1 - oceanDepth);
    }

    if (coast && ice < 0.75) {
      base = colorMix(base, land ? [180, 166, 116] : [44, 154, 155], 0.32);
    }

    const cloudNoise =
      0.58 * fbm(u * 10.0 + cloudPhase * 6.0, v * 5.4 + time * 0.015) +
      0.24 * fbm(u * 24.0 - cloudPhase * 10.0, v * 11.0 + 2.0) +
      0.12 * Math.sin((u + cloudPhase) * TWO_PI * 3.0 + v * 7.0);

    const stormBand = smoothstep(0.10, 0.55, Math.cos(lat * 3.0) * 0.5 + 0.5);
    const cloudAlpha = clamp(smoothstep(0.58, 0.92, cloudNoise) * (0.28 + stormBand * 0.48), 0, 0.72);

    return {
      version: VERSION,
      stateId,
      latIndex,
      lonIndex,
      direction,
      biome,
      color: base,
      land,
      water,
      ice,
      coast,
      elevation,
      oceanDepth,
      moisture,
      cloudAlpha
    };
  }

  function getStatus() {
    return {
      version: VERSION,
      contract: VERSION,
      lattice: "16x16",
      states: 256,
      owns: [
        "256_state_surface_classification",
        "land_ocean_ice_cloud_state_map",
        "latitude_longitude_state_addressing",
        "biome_terrain_water_atmosphere_state_ids"
      ],
      doesNotOwn: [
        "canvas_projection",
        "runtime_lifecycle",
        "material_css",
        "route_shell",
        "image_generation",
        "GraphicBox"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  window.DGBEarthLattice256 = Object.freeze({
    version: VERSION,
    sample,
    getStatus
  });
})();
