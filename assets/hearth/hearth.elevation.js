// /assets/hearth/hearth.elevation.js
// HEARTH_CONTINENTAL_GROWTH_LANDBRIDGE_ELEVATION_TNT_v1
// Full-file replacement.
// Elevation authority only.
// Purpose:
// - Reclassify the existing visible blobs as continental shield cores.
// - Build outward continental growth around those cores.
// - Create a broken elevation-driven landbridge corridor between them.
// - Publish normalized downstream sample data for composition, hydrology, islands, cliffs, valleys, mountains, and materials.
// Does not own:
// - materials
// - colors
// - canvas drawing
// - runtime motion
// - controls
// - route UI
// - final visual claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CONTINENTAL_GROWTH_LANDBRIDGE_ELEVATION_TNT_v1";
  const RECEIPT = "HEARTH_ELEVATION_AUTHORITY_ACTIVE_CONTINENTAL_GROWTH_LANDBRIDGE_v1";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const SEA_LEVEL = 0.0;

  const clamp01 = (v) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, Number.isFinite(v) ? v : a));
  const mix = (a, b, t) => a + (b - a) * clamp01(t);

  const smoothstep = (edge0, edge1, x) => {
    const t = clamp01((x - edge0) / (edge1 - edge0 || 1));
    return t * t * (3 - 2 * t);
  };

  const smootherstep = (edge0, edge1, x) => {
    const t = clamp01((x - edge0) / (edge1 - edge0 || 1));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  const fract = (v) => v - Math.floor(v);

  const hash = (n) => fract(Math.sin(n) * 43758.5453123);

  const hash3 = (x, y, z) => {
    return hash(x * 127.1 + y * 311.7 + z * 74.7);
  };

  const valueNoise3 = (x, y, z) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);

    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const w = zf * zf * (3 - 2 * zf);

    const h000 = hash3(xi, yi, zi);
    const h100 = hash3(xi + 1, yi, zi);
    const h010 = hash3(xi, yi + 1, zi);
    const h110 = hash3(xi + 1, yi + 1, zi);
    const h001 = hash3(xi, yi, zi + 1);
    const h101 = hash3(xi + 1, yi, zi + 1);
    const h011 = hash3(xi, yi + 1, zi + 1);
    const h111 = hash3(xi + 1, yi + 1, zi + 1);

    const x00 = mix(h000, h100, u);
    const x10 = mix(h010, h110, u);
    const x01 = mix(h001, h101, u);
    const x11 = mix(h011, h111, u);

    const y0 = mix(x00, x10, v);
    const y1 = mix(x01, x11, v);

    return mix(y0, y1, w);
  };

  const fbm3 = (x, y, z, octaves = 5) => {
    let value = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      value += valueNoise3(x * freq, y * freq, z * freq) * amp;
      norm += amp;
      freq *= 2.03;
      amp *= 0.52;
    }

    return norm ? value / norm : 0;
  };

  const normalize3 = (p) => {
    const x = Number.isFinite(p.x) ? p.x : 0;
    const y = Number.isFinite(p.y) ? p.y : 0;
    const z = Number.isFinite(p.z) ? p.z : 1;
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  };

  const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

  const angularDistance = (a, b) => Math.acos(clamp(dot3(a, b), -1, 1));

  const lonLatToVector = (lonDeg, latDeg) => {
    const lon = lonDeg * DEG;
    const lat = latDeg * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  };

  const vectorToLonLat = (p) => {
    const n = normalize3(p);
    return {
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
    };
  };

  const slerp = (a, b, t) => {
    const omega = angularDistance(a, b);
    if (omega < 1e-6) return { ...a };

    const sinOmega = Math.sin(omega);
    const s0 = Math.sin((1 - t) * omega) / sinOmega;
    const s1 = Math.sin(t * omega) / sinOmega;

    return normalize3({
      x: a.x * s0 + b.x * s1,
      y: a.y * s0 + b.y * s1,
      z: a.z * s0 + b.z * s1
    });
  };

  const parseInput = (...args) => {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (
        Number.isFinite(p.x) &&
        Number.isFinite(p.y) &&
        Number.isFinite(p.z)
      ) {
        return normalize3(p);
      }

      if (Number.isFinite(p.lon) && Number.isFinite(p.lat)) {
        return lonLatToVector(p.lon, p.lat);
      }

      if (Number.isFinite(p.longitude) && Number.isFinite(p.latitude)) {
        return lonLatToVector(p.longitude, p.latitude);
      }

      if (Number.isFinite(p.u) && Number.isFinite(p.v)) {
        const lon = mix(-180, 180, p.u);
        const lat = mix(-90, 90, p.v);
        return lonLatToVector(lon, lat);
      }
    }

    if (args.length >= 3) {
      return normalize3({ x: args[0], y: args[1], z: args[2] });
    }

    if (args.length >= 2) {
      return lonLatToVector(args[0], args[1]);
    }

    return lonLatToVector(0, 0);
  };

  /*
    These two continental cores intentionally behave as shield anchors.
    They are not final shapes. They are uplift centers that downstream
    layers can grow into readable continents.
  */
  const CONTINENTAL_CORES = [
    {
      id: "hearth-western-shield-core",
      center: lonLatToVector(-42, 12),
      radius: 0.72,
      shelfRadius: 1.12,
      height: 0.88,
      shield: 0.74,
      irregularity: 0.17,
      seed: 11.37
    },
    {
      id: "hearth-eastern-shield-core",
      center: lonLatToVector(47, -8),
      radius: 0.66,
      shelfRadius: 1.04,
      height: 0.82,
      shield: 0.68,
      irregularity: 0.19,
      seed: 29.91
    }
  ];

  const BASIN_NODES = [
    {
      center: lonLatToVector(-5, 7),
      radius: 0.26,
      depth: 0.22,
      seed: 71.2
    },
    {
      center: lonLatToVector(18, -18),
      radius: 0.22,
      depth: 0.17,
      seed: 88.6
    },
    {
      center: lonLatToVector(-28, -11),
      radius: 0.21,
      depth: 0.13,
      seed: 43.8
    }
  ];

  const bridgePathNodes = (() => {
    const a = CONTINENTAL_CORES[0].center;
    const b = CONTINENTAL_CORES[1].center;
    const nodes = [];

    for (let i = 0; i <= 18; i += 1) {
      const t = i / 18;
      const base = slerp(a, b, t);

      const wobbleA = fbm3(
        base.x * 3.2 + 5.1,
        base.y * 3.2 + 8.7,
        base.z * 3.2 + 1.9,
        4
      ) - 0.5;

      const wobbleB = fbm3(
        base.x * 5.2 + 12.1,
        base.y * 5.2 + 3.7,
        base.z * 5.2 + 9.9,
        4
      ) - 0.5;

      const offsetLon = wobbleA * 7.5;
      const offsetLat = wobbleB * 5.0;
      const ll = vectorToLonLat(base);

      nodes.push({
        t,
        center: lonLatToVector(ll.lon + offsetLon, ll.lat + offsetLat)
      });
    }

    return nodes;
  })();

  const coreField = (p) => {
    let strongest = 0;
    let shield = 0;
    let shelf = 0;
    let coreId = null;

    CONTINENTAL_CORES.forEach((core) => {
      const d = angularDistance(p, core.center);

      const grain = fbm3(
        p.x * 3.4 + core.seed,
        p.y * 3.4 + core.seed * 0.37,
        p.z * 3.4 - core.seed * 0.19,
        5
      );

      const edgeBreak = fbm3(
        p.x * 9.5 - core.seed,
        p.y * 9.5 + core.seed * 0.73,
        p.z * 9.5 + core.seed * 0.17,
        4
      );

      const radiusShift = (grain - 0.5) * core.irregularity;
      const effectiveRadius = core.radius + radiusShift;
      const effectiveShelf = core.shelfRadius + radiusShift * 1.6;

      const coreRise = smootherstep(effectiveRadius, 0.05, d);
      const shelfRise = smootherstep(effectiveShelf, effectiveRadius * 0.78, d);
      const edgeFracture = (edgeBreak - 0.5) * 0.16 * smootherstep(effectiveRadius * 1.12, effectiveRadius * 0.55, d);

      const shapedCore = clamp01(coreRise + edgeFracture);
      const shapedShelf = clamp01(shelfRise * (1 - shapedCore * 0.35));

      if (shapedCore > strongest) {
        strongest = shapedCore;
        coreId = core.id;
      }

      shield = Math.max(shield, shapedCore * core.shield);
      shelf = Math.max(shelf, shapedShelf);
    });

    return {
      corePotential: clamp01(strongest),
      shieldPotential: clamp01(shield),
      shelfPotential: clamp01(shelf),
      dominantCoreId: coreId
    };
  };

  const bridgeField = (p) => {
    let minDistance = Infinity;
    let pathT = 0;

    bridgePathNodes.forEach((node) => {
      const d = angularDistance(p, node.center);
      if (d < minDistance) {
        minDistance = d;
        pathT = node.t;
      }
    });

    const widthBase = 0.26;
    const widthNoise = fbm3(p.x * 6.1 + 17, p.y * 6.1 - 4, p.z * 6.1 + 9, 4);
    const width = widthBase + (widthNoise - 0.5) * 0.08;

    const corridor = smootherstep(width, 0.03, minDistance);
    const narrowRidge = smootherstep(width * 0.48, 0.01, minDistance);

    const segmentation =
      0.52 +
      0.22 * Math.sin(pathT * TAU * 2.0 + 0.6) +
      0.16 * Math.sin(pathT * TAU * 5.0 + 2.1) +
      0.10 * Math.sin(pathT * TAU * 9.0 - 0.8);

    const fracture = fbm3(
      p.x * 12.7 + pathT * 4.0,
      p.y * 12.7 - pathT * 7.0,
      p.z * 12.7 + 23.5,
      5
    );

    const saddleA = Math.exp(-Math.pow((pathT - 0.34) / 0.085, 2));
    const saddleB = Math.exp(-Math.pow((pathT - 0.62) / 0.105, 2));
    const channelBreak = Math.max(saddleA, saddleB);

    const bridgePotential = clamp01(corridor * (0.65 + segmentation * 0.35));
    const ridgePotential = clamp01(narrowRidge * (0.48 + segmentation * 0.62) * (1 - channelBreak * 0.34));
    const saddlePotential = clamp01(corridor * channelBreak);
    const islandPotential = clamp01(corridor * (1 - narrowRidge * 0.32) * smoothstep(0.44, 0.83, fracture) * (0.5 + channelBreak * 0.5));

    const bridgeLift =
      bridgePotential * 0.28 +
      ridgePotential * 0.34 -
      saddlePotential * 0.28 +
      islandPotential * 0.12;

    return {
      bridgePotential,
      ridgePotential,
      saddlePotential,
      islandPotential,
      bridgeLift,
      bridgePathT: pathT,
      bridgeDistance: minDistance
    };
  };

  const basinField = (p, bridge) => {
    let basin = 0;

    BASIN_NODES.forEach((node) => {
      const d = angularDistance(p, node.center);
      const pocket = smootherstep(node.radius, 0.02, d);
      const rough = fbm3(
        p.x * 10.4 + node.seed,
        p.y * 10.4 - node.seed * 0.27,
        p.z * 10.4 + node.seed * 0.41,
        4
      );

      basin = Math.max(basin, pocket * node.depth * (0.75 + rough * 0.5));
    });

    const nearBridgeLowland = bridge.bridgePotential * bridge.saddlePotential * 0.42;
    return clamp01(basin + nearBridgeLowland);
  };

  const worldTexture = (p) => {
    const broad = fbm3(p.x * 2.4 + 101, p.y * 2.4 - 31, p.z * 2.4 + 9, 5);
    const mid = fbm3(p.x * 7.3 - 14, p.y * 7.3 + 61, p.z * 7.3 - 18, 5);
    const fine = fbm3(p.x * 19.1 + 5, p.y * 19.1 + 13, p.z * 19.1 - 3, 4);

    return {
      broad: broad - 0.5,
      mid: mid - 0.5,
      fine: fine - 0.5
    };
  };

  const terrainHint = (state) => {
    const e = state.elevation;

    if (state.corePotential > 0.62 && e > 0.24) return "continental_core";
    if (state.bridgePotential > 0.5 && state.ridgePotential > 0.42 && e > 0.08) return "exposed_bridge";
    if (state.bridgePotential > 0.48 && state.saddlePotential > 0.38 && e > -0.1 && e <= 0.12) return "shallow_saddle";
    if (state.bridgePotential > 0.46 && e > -0.09 && e <= 0.08) return "submerged_bridge";
    if (state.ridgePotential > 0.48 && e > 0.05) return "ridge_corridor";
    if (state.basinPotential > 0.42 && e < 0.08) return "basin";
    if (state.islandPotential > 0.54 && e > -0.055 && e < 0.24) return "island_seed";
    if (state.shelfPotential > 0.44 && e > -0.16 && e < 0.16) return "continental_shelf";
    if (state.coastPotential > 0.58) return "coast_edge";

    return "deep_ocean";
  };

  const sample = (...args) => {
    const p = parseInput(...args);

    const cores = coreField(p);
    const bridge = bridgeField(p);
    const basinPotential = basinField(p, bridge);
    const texture = worldTexture(p);

    const continentalLift =
      cores.corePotential * 0.78 +
      cores.shieldPotential * 0.2 +
      cores.shelfPotential * 0.18;

    const bridgeLift = bridge.bridgeLift;

    const roughLift =
      texture.broad * 0.16 +
      texture.mid * 0.07 +
      texture.fine * 0.025;

    const oceanBias = -0.42;

    let elevation =
      oceanBias +
      continentalLift +
      bridgeLift +
      roughLift -
      basinPotential * 0.34;

    const emergencePush =
      Math.max(cores.corePotential, bridge.bridgePotential * 0.72, bridge.islandPotential * 0.62);

    elevation += emergencePush * 0.08;

    elevation = clamp(elevation, -1, 1);

    const landPotential = clamp01(smoothstep(-0.08, 0.28, elevation));
    const waterDepthPotential = elevation < SEA_LEVEL ? clamp01(-elevation / 0.72) : 0;
    const coastPotential = clamp01(1 - Math.abs(elevation - SEA_LEVEL) / 0.135) * clamp01(cores.shelfPotential + bridge.bridgePotential * 0.9 + bridge.islandPotential * 0.7);

    const shelfPotential = clamp01(
      cores.shelfPotential * 0.82 +
      bridge.bridgePotential * smoothstep(-0.20, 0.08, elevation) * 0.35
    );

    const state = {
      contract: CONTRACT,
      receipt: RECEIPT,

      x: p.x,
      y: p.y,
      z: p.z,

      elevation,
      seaLevel: SEA_LEVEL,

      landPotential,
      shelfPotential,
      bridgePotential: bridge.bridgePotential,
      ridgePotential: bridge.ridgePotential,
      saddlePotential: bridge.saddlePotential,
      basinPotential,
      islandPotential: bridge.islandPotential,
      coastPotential,
      waterDepthPotential,

      corePotential: cores.corePotential,
      shieldPotential: cores.shieldPotential,
      dominantCoreId: cores.dominantCoreId,

      bridgePathT: bridge.bridgePathT,
      bridgeDistance: bridge.bridgeDistance,

      isLand: elevation > SEA_LEVEL,
      isShallowWater: elevation <= SEA_LEVEL && elevation > -0.16,
      isDeepWater: elevation <= -0.16,

      terrainClassHint: "deep_ocean"
    };

    state.terrainClassHint = terrainHint(state);

    return state;
  };

  const sampleElevation = (...args) => sample(...args).elevation;
  const getElevation = sampleElevation;
  const readElevation = sampleElevation;

  const read = (...args) => sample(...args);

  const classify = (...args) => sample(...args).terrainClassHint;

  const isLand = (...args) => sample(...args).isLand;

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    authority: "elevation",
    status: "active",
    seaLevel: SEA_LEVEL,
    cores: CONTINENTAL_CORES.map((core) => core.id),
    bridge: "continental-growth-landbridge-elevation-pressure",
    downstream: [
      "hearth.composition.js",
      "hearth.hydrology.js",
      "hearth.hydration.js",
      "hearth.islands.js",
      "hearth.cliffs.js",
      "hearth.valleys.js",
      "hearth.mountains.js",
      "hearth.materials.js"
    ],
    forbiddenOwnership: [
      "materials",
      "canvas",
      "runtime",
      "controls",
      "route-ui"
    ]
  });

  const api = {
    CONTRACT,
    RECEIPT,
    SEA_LEVEL,

    sample,
    read,
    classify,
    isLand,

    sampleElevation,
    getElevation,
    readElevation,

    getReceipt,

    cores: CONTINENTAL_CORES.map((core) => ({
      id: core.id,
      radius: core.radius,
      shelfRadius: core.shelfRadius,
      height: core.height
    })),

    terrainHints: [
      "continental_core",
      "continental_shelf",
      "exposed_bridge",
      "submerged_bridge",
      "ridge_corridor",
      "shallow_saddle",
      "basin",
      "island_seed",
      "coast_edge",
      "deep_ocean"
    ]
  };

  const root = typeof window !== "undefined" ? window : globalThis;

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.elevation = api;
  root.HEARTH_ELEVATION = api;
  root.HearthElevation = api;

  root.HEARTH_ELEVATION_RECEIPT = getReceipt();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
