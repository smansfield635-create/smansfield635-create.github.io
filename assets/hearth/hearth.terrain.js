// /assets/hearth/hearth.terrain.js
// HEARTH_G3_4_MAP_GENERATION_TERRAIN_AUTHORITY_TNT_v1
// Full-file replacement.
// Purpose:
// - Fix Hearth G3 generational concern.
// - Upgrade map correctness, terrain scaffold, elevation, mountain ranges, coast shelves, and bathymetry.
// - Remove antimeridian/seam-prone terrain logic.
// - G3 only: body mass, terrain, map, coastline, elevation, bathymetry.
// - G4 deferred: clouds, weather, climate.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_4_MAP_GENERATION_TERRAIN_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-4-map-generation-terrain";
  const RECEIPT = "HEARTH_G3_4_TERRAIN_AUTHORITY_RECEIPT";

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

  function lonDelta(a, b) {
    return wrapLon(a - b);
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
      sum += valueNoise(x * freq, y * freq, seed + i * 19.31) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? sum / norm : 0;
  }

  function pointInPolygon(lon, lat, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const crosses = yi > lat !== yj > lat;
      if (!crosses) continue;

      const xAtY = ((xj - xi) * (lat - yi)) / ((yj - yi) || 1e-9) + xi;
      if (lon < xAtY) inside = !inside;
    }

    return inside;
  }

  function distanceToSegment(lon, lat, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const wx = lon - ax;
    const wy = lat - ay;
    const c1 = wx * vx + wy * vy;
    const c2 = vx * vx + vy * vy || 1;
    const t = clamp(c1 / c2, 0, 1);
    const sx = ax + vx * t;
    const sy = ay + vy * t;
    return Math.hypot(lon - sx, lat - sy);
  }

  function signedDistanceToPolygon(lon, lat, polygon) {
    let minD = Infinity;

    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      minD = Math.min(minD, distanceToSegment(lon, lat, a[0], a[1], b[0], b[1]));
    }

    return pointInPolygon(lon, lat, polygon) ? minD : -minD;
  }

  function ridgeLine(lon, lat, x1, y1, x2, y2, width, amp) {
    const vx = lonDelta(x2, x1);
    const vy = y2 - y1;
    const wx = lonDelta(lon, x1);
    const wy = lat - y1;
    const c1 = wx * vx + wy * vy;
    const c2 = vx * vx + vy * vy || 1;
    const t = clamp(c1 / c2, 0, 1);
    const sx = x1 + vx * t;
    const sy = y1 + vy * t;
    const d = Math.hypot(lonDelta(lon, sx), lat - sy);
    return amp * (1 - smoothstep(width * 0.25, width, d));
  }

  function ellipseCut(lon, lat, cx, cy, rx, ry, amp) {
    const dx = lonDelta(lon, cx) / rx;
    const dy = (lat - cy) / ry;
    const q = 1 - (dx * dx + dy * dy);
    return amp * smoothstep(-0.35, 0.92, q);
  }

  // No polygon crosses -180/180. Polar terrain is handled separately to avoid seam artifacts.
  const LAND_POLYGONS = [
    {
      name: "north-west-body",
      weight: 1.0,
      points: [
        [-168, 65], [-150, 59], [-136, 54], [-126, 47], [-121, 38],
        [-113, 30], [-103, 23], [-91, 18], [-80, 23], [-72, 34],
        [-64, 46], [-54, 55], [-62, 64], [-86, 71], [-118, 72],
        [-146, 70]
      ]
    },
    {
      name: "south-west-body",
      weight: 1.0,
      points: [
        [-82, 12], [-68, 7], [-55, -3], [-45, -16], [-40, -28],
        [-47, -42], [-58, -55], [-69, -52], [-75, -37], [-80, -20],
        [-86, -5]
      ]
    },
    {
      name: "greenland-ice-body",
      weight: 0.76,
      points: [
        [-60, 60], [-42, 63], [-29, 72], [-39, 82], [-58, 82],
        [-71, 74], [-68, 66]
      ]
    },
    {
      name: "africa-body",
      weight: 1.0,
      points: [
        [-18, 34], [4, 38], [22, 34], [38, 24], [45, 8],
        [41, -12], [32, -29], [19, -36], [6, -31], [-7, -16],
        [-15, 2]
      ]
    },
    {
      name: "eurasia-body",
      weight: 1.08,
      points: [
        [-10, 36], [8, 46], [30, 54], [57, 62], [88, 67],
        [118, 62], [150, 49], [145, 35], [127, 26], [113, 13],
        [96, 8], [80, 18], [62, 25], [43, 31], [24, 36], [8, 41]
      ]
    },
    {
      name: "india-body",
      weight: 0.72,
      points: [
        [68, 25], [82, 26], [91, 20], [89, 10], [80, 5], [72, 13]
      ]
    },
    {
      name: "arabia-body",
      weight: 0.56,
      points: [
        [37, 31], [51, 27], [56, 17], [49, 11], [42, 14], [35, 23]
      ]
    },
    {
      name: "southeast-body",
      weight: 0.48,
      points: [
        [96, 23], [111, 17], [124, 5], [121, -8], [106, -6], [97, 6]
      ]
    },
    {
      name: "austral-body",
      weight: 0.86,
      points: [
        [112, -13], [130, -10], [150, -18], [153, -33], [140, -43],
        [120, -37], [112, -24]
      ]
    },
    {
      name: "southern-isle",
      weight: 0.34,
      points: [
        [41, -46], [56, -48], [58, -55], [45, -56], [35, -51]
      ]
    },
    {
      name: "new-zealand-body",
      weight: 0.28,
      points: [
        [166, -35], [178, -42], [172, -49], [162, -42]
      ]
    }
  ];

  const MOUNTAIN_RANGES = [
    { name: "andes", x1: -75, y1: 10, x2: -70, y2: -54, width: 6.4, amp: 0.68 },
    { name: "rockies", x1: -130, y1: 56, x2: -106, y2: 28, width: 9.5, amp: 0.40 },
    { name: "sierras", x1: -122, y1: 43, x2: -113, y2: 31, width: 5.2, amp: 0.25 },
    { name: "himalaya", x1: 66, y1: 30, x2: 94, y2: 34, width: 8.3, amp: 0.80 },
    { name: "central-asia", x1: 84, y1: 42, x2: 118, y2: 55, width: 12.5, amp: 0.34 },
    { name: "east-africa-rift", x1: 38, y1: -5, x2: 30, y2: -30, width: 6.5, amp: 0.28 },
    { name: "alps", x1: 7, y1: 45, x2: 20, y2: 46, width: 5.0, amp: 0.24 },
    { name: "great-divide", x1: 134, y1: -20, x2: 150, y2: -36, width: 7.4, amp: 0.25 }
  ];

  const LAKES = [
    { lon: -84, lat: 45, rx: 7, ry: 3.5, amp: 0.62 },
    { lon: -74, lat: 44, rx: 5, ry: 2.4, amp: 0.50 },
    { lon: 31, lat: 0, rx: 4, ry: 7, amp: 0.34 },
    { lon: 48, lat: 42, rx: 7, ry: 4, amp: 0.42 },
    { lon: 90, lat: 55, rx: 10, ry: 4, amp: 0.22 }
  ];

  function continentDistance(lon, lat) {
    let best = -Infinity;
    let owner = "ocean";

    for (const p of LAND_POLYGONS) {
      const sd = signedDistanceToPolygon(lon, lat, p.points) * p.weight;
      if (sd > best) {
        best = sd;
        owner = p.name;
      }
    }

    // Seam-safe Antarctica: latitude belt, not a polygon crossing the dateline.
    const antarcticEdge =
      lat < -61
        ? (Math.abs(lat) - 61) * 0.75 +
          (fbm((lon + 180) / 46, lat / 18, 212.1, 4) - 0.5) * 5.0
        : -Infinity;

    if (antarcticEdge > best) {
      best = antarcticEdge;
      owner = "antarctic-belt";
    }

    return { signed: best, owner };
  }

  function mountainField(lon, lat) {
    let ridge = 0;
    let mountain = 0;
    let range = "none";

    for (const m of MOUNTAIN_RANGES) {
      const v = ridgeLine(lon, lat, m.x1, m.y1, m.x2, m.y2, m.width, m.amp);
      mountain += v;
      if (v > ridge) {
        ridge = v;
        range = m.name;
      }
    }

    return {
      ridge: clamp(ridge, 0, 1),
      mountain: clamp(mountain, 0, 1),
      range
    };
  }

  function waterCuts(lon, lat) {
    let cut = 0;
    for (const l of LAKES) cut += ellipseCut(lon, lat, l.lon, l.lat, l.rx, l.ry, l.amp);
    cut += ellipseCut(lon, lat, 34, 39, 12, 8, 0.34);
    cut += ellipseCut(lon, lat, -84, 12, 11, 7, 0.28);
    cut += ellipseCut(lon, lat, 118, -4, 17, 10, 0.22);
    return cut;
  }

  function sample(lonInput, latInput) {
    const lon = wrapLon(lonInput);
    const lat = clamp(latInput, -89.999, 89.999);
    const nx = (lon + 180) / 360;
    const ny = (90 - lat) / 180;
    const latAbs = Math.abs(lat);

    const base = continentDistance(lon, lat);
    const coastalInfluence = 1 - smoothstep(0, 8, Math.abs(base.signed));

    const coastNoise =
      (fbm(nx * 72, ny * 41, 31.2, 4) - 0.5) * 4.4 * coastalInfluence +
      (fbm(nx * 162, ny * 91, 87.9, 3) - 0.5) * 1.3 * coastalInfluence;

    const islandGain =
      coastalInfluence * smoothstep(0.75, 0.94, fbm(nx * 116, ny * 64, 44.8, 3)) * 1.6;

    const mountains = mountainField(lon, lat);
    const lakeLoss = waterCuts(lon, lat) * 7.0;

    const signedDistance = base.signed + coastNoise + islandGain - lakeLoss;
    const land = signedDistance > 0;

    const terrainNoise = fbm(nx * 42 + 11, ny * 34 - 3, 13.9, 5);
    const fineNoise = fbm(nx * 136, ny * 78, 19.4, 3);
    const reliefNoise = fbm(nx * 235, ny * 132, 122.4, 2);
    const moisture = fbm(nx * 12.5 - 4, ny * 8.2 + 5, 22.5, 5);

    const aridity =
      smoothstep(8, 30, latAbs) *
      (1 - smoothstep(31, 57, latAbs)) *
      (1 - moisture * 0.55);

    const inland = smoothstep(0, 20, signedDistance);
    const coast = clamp(1 - smoothstep(0.10, 4.7, Math.abs(signedDistance)), 0, 1);

    const shelf = land ? 0 : 1 - smoothstep(0.35, 7.2, -signedDistance);
    const slope = land ? 0 : smoothstep(4.5, 20, -signedDistance) * (1 - smoothstep(20, 42, -signedDistance));
    const abyss = land ? 0 : smoothstep(22, 58, -signedDistance);
    const bathymetry = land ? 0 : smoothstep(0, 38, -signedDistance);

    const elevation = land
      ? clamp(
          inland * 0.56 +
          Math.pow(inland, 1.65) * 0.22 +
          mountains.mountain * 1.06 +
          (terrainNoise - 0.5) * 0.12,
          0,
          1
        )
      : -bathymetry;

    const highland = land ? smoothstep(0.42, 0.80, elevation) : 0;
    const mountain = land ? smoothstep(0.52, 0.94, elevation + mountains.mountain * 0.62) : 0;

    const glacialLat = smoothstep(62, 84, latAbs);
    const highSnow = land ? smoothstep(0.58, 0.92, elevation + terrainNoise * 0.16) : 0;
    const ice = clamp(glacialLat * 0.80 + highSnow * 0.38, 0, 1);

    const relief = land
      ? clamp(0.18 + elevation * 0.60 + mountains.mountain * 0.75 + reliefNoise * 0.16, 0, 1)
      : clamp(0.05 + shelf * 0.24 + slope * 0.16 + abyss * 0.22, 0, 1);

    const roughness = land
      ? clamp(0.30 + terrainNoise * 0.40 + Math.max(0, elevation) * 0.38 + mountains.mountain * 0.42, 0, 1)
      : clamp(0.10 + fbm(nx * 32 + 18, ny * 18 - 7, 31.6, 5) * 0.18 + abyss * 0.14, 0, 1);

    let biome = "ocean";
    if (land) {
      if (ice > 0.55) biome = "ice";
      else if (mountain > 0.55) biome = "mountain";
      else if (aridity > 0.56) biome = "arid";
      else if (moisture > 0.58) biome = "green";
      else if (highland > 0.45) biome = "highland";
      else biome = "lowland";
    } else if (shelf > 0.45) biome = "shelf";
    else if (slope > 0.30) biome = "slope";
    else if (abyss > 0.45) biome = "abyss";

    return {
      contract: CONTRACT,
      generation: "G3.4-candidate",
      lon,
      lat,
      land,
      continent: base.owner,
      signedDistance,
      elevation,
      relief,
      ridge: mountains.ridge,
      mountain,
      rangeName: mountains.range,
      highland,
      shelf,
      slope,
      abyss,
      bathymetry,
      coast,
      ice,
      moisture,
      aridity,
      roughness,
      fineNoise,
      biome,
      g4Deferred: true
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      owner: "/assets/hearth/hearth.terrain.js",
      generation: {
        previousAccepted: "G2",
        currentCandidate: "G3.4",
        focus: "map generation, terrain authority, seam removal, mountain ranges",
        g4Deferred: "clouds, weather, climate"
      },
      api: "window.HEARTH_TERRAIN.sample(lonDegrees, latDegrees)",
      owns: [
        "cartographic-body-mass",
        "terrain-elevation",
        "mountain-ranges",
        "relief",
        "coast-shelves",
        "bathymetry",
        "polar-frozen-terrain",
        "biome-signals"
      ],
      seamPolicy: "no dateline-crossing land polygons; polar belt computed by latitude field",
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      graphicBox: false
    });
  }

  window.HEARTH_TERRAIN = Object.freeze({
    contract: CONTRACT,
    version: VERSION,
    sample,
    receipt
  });

  document.documentElement.dataset.hearthTerrainLoaded = "true";
  document.documentElement.dataset.hearthTerrainContract = CONTRACT;
  document.documentElement.dataset.hearthTerrainVersion = VERSION;
})();
