// /assets/audralia/clean/engine/continents.js
// AUDRALIA_G2_5_CONTINENTS_CHILD_ENGINE_TNT_v1
// Child engine for Audralia clean-canvas stack.
// Owns: five-continent law, exposed-land eligibility, submerged shelves, South Pole ice-only rule, North Polar continent, Nine-Summits terrain pressure.
// Does not own: mount, canvas creation, motion, sky, route bridge, HTML, or parent Globe.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_CONTINENTS_CHILD_ENGINE_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_5_CONTINENTS_CHILD_ENGINE_RECEIPT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const VERSION = "2026-05-20.audralia-g2-5-continents-child-engine-v1";

  const PLANET = Object.freeze({
    seed: 25645161,
    nodeCount: 256,
    sectorCount: 16,
    regionCount: 4,
    summitCount: 9,
    continentCount: 5,
    mainContinents: 4,
    northPolarContinent: true,
    southPoleIceOnly: true,
    terrainPressureBelowSeaLevel: true,
    seaLevelExposureClassification: true,
    seaLevel: 0.735,
    exposedLandTarget: "ocean-dominant",
    continents: Object.freeze([
      Object.freeze({
        id: "MAIN_A",
        kind: "main",
        u: -0.42,
        v: -0.10,
        rx: 0.30,
        ry: 0.22,
        angle: -0.54,
        lift: 0.030,
        spine: Object.freeze([
          [-1.00, -0.18],
          [-0.62, 0.12],
          [-0.18, -0.04],
          [0.34, 0.20],
          [0.92, -0.02]
        ])
      }),
      Object.freeze({
        id: "MAIN_B",
        kind: "main",
        u: -0.12,
        v: 0.31,
        rx: 0.25,
        ry: 0.19,
        angle: 0.44,
        lift: 0.034,
        spine: Object.freeze([
          [-0.92, 0.16],
          [-0.48, -0.08],
          [-0.04, 0.10],
          [0.42, -0.18],
          [0.92, 0.12]
        ])
      }),
      Object.freeze({
        id: "MAIN_C",
        kind: "main",
        u: 0.26,
        v: 0.02,
        rx: 0.31,
        ry: 0.23,
        angle: 0.18,
        lift: 0.026,
        spine: Object.freeze([
          [-0.94, 0.02],
          [-0.56, -0.24],
          [-0.06, -0.04],
          [0.46, 0.22],
          [0.96, 0.08]
        ])
      }),
      Object.freeze({
        id: "MAIN_D",
        kind: "main",
        u: 0.18,
        v: -0.42,
        rx: 0.24,
        ry: 0.17,
        angle: -0.72,
        lift: 0.038,
        spine: Object.freeze([
          [-0.90, -0.12],
          [-0.44, 0.16],
          [0.00, -0.10],
          [0.46, 0.10],
          [0.86, -0.04]
        ])
      }),
      Object.freeze({
        id: "NORTH_POLAR",
        kind: "north-polar",
        u: 0.02,
        v: 0.77,
        rx: 0.42,
        ry: 0.16,
        angle: 0.02,
        lift: 0.112,
        spine: Object.freeze([
          [-1.00, 0.00],
          [-0.52, 0.16],
          [0.00, -0.04],
          [0.50, 0.14],
          [1.00, -0.02]
        ])
      })
    ])
  });

  const state = {
    lastRatios: null,
    lastClassificationAt: null,
    classificationCount: 0
  };

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function now() {
    return new Date().toISOString();
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.00001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function normalize3(v) {
    const x = Number(v?.x || 0);
    const y = Number(v?.y || 0);
    const z = Number(v?.z || 0);
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function hash2(x, y, seed = PLANET.seed) {
    let n = Math.imul(x ^ seed, 374761393) ^ Math.imul(y + seed, 668265263);
    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function valueNoise(x, y, scale, seedOffset = 0) {
    const sx = x * scale;
    const sy = y * scale;
    const x0 = Math.floor(sx);
    const y0 = Math.floor(sy);
    const tx = fade(sx - x0);
    const ty = fade(sy - y0);

    const a = hash2(x0, y0, PLANET.seed + seedOffset);
    const b = hash2(x0 + 1, y0, PLANET.seed + seedOffset);
    const c = hash2(x0, y0 + 1, PLANET.seed + seedOffset);
    const d = hash2(x0 + 1, y0 + 1, PLANET.seed + seedOffset);

    return lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
  }

  function fbm(x, y, baseScale, octaves, seedOffset = 0) {
    let total = 0;
    let amp = 0.5;
    let scale = baseScale;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x, y, scale, seedOffset + i * 997) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= 2.03;
    }

    return total / Math.max(0.0001, norm);
  }

  function wrapUnitDistance(a, b) {
    let d = a - b;
    if (d > 1) d -= 2;
    if (d < -1) d += 2;
    return d;
  }

  function normalToUV(worldNormal) {
    const n = normalize3(worldNormal);
    const lon = Math.atan2(n.x, n.z);
    const lat = Math.asin(clamp(n.y, -1, 1));

    return {
      normal: n,
      lon,
      lat,
      u: lon / Math.PI,
      v: lat / (Math.PI / 2)
    };
  }

  function distanceToSegment(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const wx = px - ax;
    const wy = py - ay;
    const len2 = vx * vx + vy * vy || 1;
    const t = clamp01((wx * vx + wy * vy) / len2);
    const qx = ax + vx * t;
    const qy = ay + vy * t;

    return {
      distance: Math.hypot(px - qx, py - qy),
      t
    };
  }

  function spineField(localX, localY, spine) {
    let best = 0;

    for (let i = 0; i < spine.length - 1; i += 1) {
      const a = spine[i];
      const b = spine[i + 1];
      const d = distanceToSegment(localX, localY, a[0], a[1], b[0], b[1]);
      const width = 0.34 + 0.10 * Math.sin((i + 1) * 1.7);
      const core = 1 - smoothstep(width * 0.36, width, d.distance);
      const taper = smoothstep(-0.08, 0.18, d.t) * (1 - smoothstep(0.82, 1.10, d.t));
      best = Math.max(best, core * (0.72 + taper * 0.28));
    }

    return clamp01(best);
  }

  function continentInfluence(continent, u, v, roughness) {
    const du = wrapUnitDistance(u, continent.u);
    const dv = v - continent.v;
    const cos = Math.cos(continent.angle);
    const sin = Math.sin(continent.angle);

    const x = (du * cos - dv * sin) / continent.rx;
    const y = (du * sin + dv * cos) / continent.ry;

    const spine = spineField(x, y, continent.spine);

    const lobeA = Math.max(0, 1 - Math.hypot(x + 0.36, y - 0.10) / (0.55 + roughness * 0.18));
    const lobeB = Math.max(0, 1 - Math.hypot(x - 0.30, y + 0.06) / (0.48 + roughness * 0.16));
    const lobeC = Math.max(0, 1 - Math.hypot(x - 0.02, y - 0.28) / (0.42 + roughness * 0.14));

    const bayNoise = fbm(u * 1.7 + continent.rx * 11, v * 1.3 - continent.ry * 9, 19.0, 3, 4300);
    const inletNoise = fbm(u - continent.rx * 7, v + continent.ry * 8, 31.0, 2, 5100);
    const edgeNoise = fbm(u + continent.rx * 17, v - continent.ry * 19, 44.0, 2, 6100);

    const ridgeBody = spine * 0.84 + lobeA * 0.24 + lobeB * 0.22 + lobeC * 0.17;
    const bayCuts = smoothstep(0.58, 0.88, bayNoise) * 0.22 + smoothstep(0.64, 0.92, inletNoise) * 0.16;
    const roughEdge = (roughness - 0.5) * 0.14 + (edgeNoise - 0.5) * 0.09;

    const field = ridgeBody + roughEdge - bayCuts;

    return clamp01(smoothstep(0.18, 0.74, field));
  }

  function continentField(u, v) {
    const roughA = fbm(u + 3.0, v - 1.5, 8.0, 4, 400);
    const roughB = fbm(u - 4.2, v + 2.4, 18.0, 3, 900);
    const roughness = clamp01(roughA * 0.70 + roughB * 0.30);

    let best = {
      id: "OCEAN",
      kind: "ocean",
      strength: 0,
      lift: 0,
      main: false,
      northPolar: false
    };

    for (const continent of PLANET.continents) {
      const influence = continentInfluence(continent, u, v, roughness);

      if (influence > best.strength) {
        best = {
          id: continent.id,
          kind: continent.kind,
          strength: influence,
          lift: continent.lift,
          main: continent.kind === "main",
          northPolar: continent.kind === "north-polar"
        };
      }
    }

    return best;
  }

  function summitPressure(worldNormal) {
    const n = normalize3(worldNormal);

    const summitSeeds = [
      [-0.52, -0.35, 0.72],
      [-0.25, -0.54, 0.76],
      [0.08, -0.45, 0.84],
      [0.38, -0.24, 0.80],
      [0.55, 0.02, 0.72],
      [0.34, 0.34, 0.74],
      [0.02, 0.50, 0.80],
      [-0.34, 0.30, 0.78],
      [-0.58, 0.02, 0.70]
    ];

    let field = 0;

    for (let i = 0; i < summitSeeds.length; i += 1) {
      const s = normalize3({ x: summitSeeds[i][0], y: summitSeeds[i][1], z: summitSeeds[i][2] });
      const alignment = Math.max(0, dot3(n, s));
      field += Math.pow(alignment, 42) * (0.92 + (i % 3) * 0.10);
    }

    return clamp01(field);
  }

  function classifySurface(worldNormal, context = {}) {
    const uv = normalToUV(worldNormal);
    const n = uv.normal;
    const u = uv.u;
    const v = uv.v;

    const seaLevel = Number.isFinite(context.seaLevel) ? context.seaLevel : PLANET.seaLevel;
    const continent = continentField(u, v);

    const broad = fbm(u + 1.72, v + 2.36, 2.25, 5, 100);
    const coast = fbm(u + 4.1, v - 1.7, 7.0, 5, 600);
    const ridgeNoise = fbm(u - 3.5, v + 5.2, 14.5, 4, 1200);
    const grain = fbm(u + 8.0, v - 7.0, 34.0, 3, 1800);

    const terrainCandidate = clamp01(
      continent.strength * 0.88 +
      broad * 0.055 +
      coast * 0.045 +
      ridgeNoise * 0.025
    );

    const summit = summitPressure(n);
    const ridge = clamp01((ridgeNoise - 0.49) * 1.85);
    const basin = clamp01((0.57 - broad) * 1.22 + (0.42 - coast) * 0.64);

    const northPolarBoost = continent.northPolar ? 0.115 : 0;
    const mainLift = continent.main ? continent.lift || 0 : 0;

    let elevation = clamp01(
      terrainCandidate * 0.66 +
      summit * 0.24 +
      ridge * 0.105 +
      northPolarBoost +
      mainLift -
      basin * 0.255
    );

    const southPole = v < -0.68;
    const southIce = smoothstep(-0.68, -0.95, v) * (0.76 + grain * 0.24);
    const northIce = smoothstep(0.79, 0.96, v) * (0.30 + grain * 0.30);
    const polarIce = clamp01(Math.max(southIce, northIce));

    if (southPole) {
      elevation = Math.min(elevation, seaLevel - 0.065);
    }

    const exposedLand =
      !southPole &&
      continent.strength > 0.36 &&
      terrainCandidate > 0.44 &&
      elevation > seaLevel;

    const exposureDistance = elevation - seaLevel;

    const nearSeaShelf =
      !exposedLand &&
      terrainCandidate > 0.33 &&
      elevation > seaLevel - 0.16;

    const drownedContinent =
      !exposedLand &&
      terrainCandidate > 0.47 &&
      elevation <= seaLevel;

    const deepOcean =
      !exposedLand &&
      !nearSeaShelf &&
      !drownedContinent;

    const mountain = exposedLand
      ? clamp01(summit * 1.35 + smoothstep(0.76, 0.96, elevation) * 0.64)
      : 0;

    const coastLine = exposedLand ? smoothstep(0.060, 0.0, Math.abs(exposureDistance)) : 0;

    state.classificationCount += 1;
    state.lastClassificationAt = now();

    return Object.freeze({
      contract: CONTRACT,
      normal: n,
      lon: uv.lon,
      lat: uv.lat,
      u,
      v,
      continent,
      broad,
      coast,
      ridgeNoise,
      grain,
      terrainCandidate,
      elevation,
      seaLevel,
      exposureDistance,
      exposedLand,
      nearSeaShelf,
      drownedContinent,
      deepOcean,
      summit,
      mountain,
      basin,
      ridge,
      polarIce,
      southPole,
      southIce,
      northIce,
      coastLine,
      classification: exposedLand
        ? "exposed-land"
        : southPole
          ? "south-pole-ice-water"
          : drownedContinent
            ? "drowned-continent"
            : nearSeaShelf
              ? "near-sea-shelf"
              : "deep-ocean"
    });
  }

  function sampleRatios(options = {}) {
    const samples = Number.isFinite(options.samples) ? Math.max(64, Math.min(4096, options.samples)) : 1024;
    const stats = {
      total: 0,
      exposedLand: 0,
      shelf: 0,
      drownedContinent: 0,
      deepOcean: 0,
      ice: 0,
      northPolar: 0,
      southPole: 0
    };

    for (let i = 0; i < samples; i += 1) {
      const t = (i + 0.5) / samples;
      const z = 1 - 2 * t;
      const radial = Math.sqrt(Math.max(0, 1 - z * z));
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      const n = {
        x: Math.cos(theta) * radial,
        y: z,
        z: Math.sin(theta) * radial
      };

      const surface = classifySurface(n, options);

      stats.total += 1;
      if (surface.exposedLand) stats.exposedLand += 1;
      if (surface.nearSeaShelf) stats.shelf += 1;
      if (surface.drownedContinent) stats.drownedContinent += 1;
      if (surface.deepOcean) stats.deepOcean += 1;
      if (surface.polarIce > 0.40 || surface.southPole) stats.ice += 1;
      if (surface.continent.northPolar) stats.northPolar += 1;
      if (surface.southPole) stats.southPole += 1;
    }

    state.lastRatios = Object.freeze({
      total: stats.total,
      exposedLandRatio: Number((stats.exposedLand / stats.total).toFixed(4)),
      shelfRatio: Number((stats.shelf / stats.total).toFixed(4)),
      drownedContinentRatio: Number((stats.drownedContinent / stats.total).toFixed(4)),
      deepOceanRatio: Number((stats.deepOcean / stats.total).toFixed(4)),
      iceRatio: Number((stats.ice / stats.total).toFixed(4)),
      northPolarInfluenceRatio: Number((stats.northPolar / stats.total).toFixed(4)),
      southPoleRatio: Number((stats.southPole / stats.total).toFixed(4))
    });

    return state.lastRatios;
  }

  function getContinentStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      route: ROUTE,
      planet: PLANET,
      lastRatios: state.lastRatios,
      lastClassificationAt: state.lastClassificationAt,
      classificationCount: state.classificationCount,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const AUDRALIA_CONTINENTS_ENGINE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    route: ROUTE,
    planet: PLANET,
    classifySurface,
    sampleRatios,
    getContinentStatus,
    getStatus: getContinentStatus
  });

  const global = win();

  global.AUDRALIA_CONTINENTS_ENGINE = AUDRALIA_CONTINENTS_ENGINE;
  global.AudraliaContinentsEngine = AUDRALIA_CONTINENTS_ENGINE;
  global.audraliaContinentsEngine = AUDRALIA_CONTINENTS_ENGINE;
})();
