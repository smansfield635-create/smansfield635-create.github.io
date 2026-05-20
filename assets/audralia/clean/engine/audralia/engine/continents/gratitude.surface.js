// /assets/audralia/clean/engine/audralia/engine/continents/gratitude.surface.js
// AUDRALIA_G2_6_GRATITUDE_DOWNSTREAM_HEX_SAMPLED_SURFACE_MATERIAL_TNT_v1
// Full-file creation.
// Purpose: define Gratitude as a downstream hex-sampled spherical surface-material authority so continents.js can later stop rendering Gratitude as a flat badge/decal.
// Classic script. No imports. No exports. No direct drawing.
// Downstream of:
// - /assets/audralia/clean/engine/audralia/engine/continents/gratitude.js
// - /assets/audralia/clean/engine/audralia/engine/continents/gratitude.hydrology.js
// Surface here means sampled material classification and render guidance, not terrain elevation.
// Does not own: topology identity, hydrology identity, global ocean, parent planet, route bridge, runtime, canvas, FORM_VISIBLE, terrain elevation, mountains, ridges, valleys, basins, animals, plants, sky, climate, motion, or final visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_GRATITUDE_DOWNSTREAM_HEX_SAMPLED_SURFACE_MATERIAL_TNT_v1";
  const TOPOLOGY_CONTRACT_EXPECTED = "AUDRALIA_G2_6_GRATITUDE_HEX_PREFACE_ORGANIC_TOPOLOGY_CHILD_TNT_v1";
  const HYDROLOGY_CONTRACT_EXPECTED = "AUDRALIA_G2_6_GRATITUDE_DOWNSTREAM_HYDROLOGY_SEA_LEVEL_INTEGRATION_TNT_v1";
  const DOWNSTREAM_OF_TOPOLOGY = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js";
  const DOWNSTREAM_OF_HYDROLOGY = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.hydrology.js";
  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.surface.js";
  const ROUTE = "/showroom/globe/audralia/";

  const CONTINENT = "Gratitude";
  const SUMMIT = "Gratitude";

  const TAU = Math.PI * 2;
  const PHI = 1.618033988749895;

  const SURFACE_CLASS = Object.freeze({
    INTERIOR_LAND: "GRATITUDE_INTERIOR_LAND",
    COASTAL_LAND: "GRATITUDE_COASTAL_LAND",
    EDGE_LAND: "GRATITUDE_EDGE_LAND",
    NORTH_CONTINUANCE_SURFACE: "GRATITUDE_NORTH_CONTINUANCE_SURFACE",
    WEST_ADVERSITY_HARD_COAST_SURFACE: "GRATITUDE_WEST_ADVERSITY_HARD_COAST_SURFACE",
    EAST_REOPENING_WATER_CARVED_SURFACE: "GRATITUDE_EAST_REOPENING_WATER_CARVED_SURFACE",
    SOUTH_RESTORATION_WETLAND_SURFACE: "GRATITUDE_SOUTH_RESTORATION_WETLAND_SURFACE",
    MEMORY_LAKE_WATER: "GRATITUDE_MEMORY_LAKE_WATER",
    LAGOON_WATER: "GRATITUDE_LAGOON_WATER",
    BAY_WATER: "GRATITUDE_BAY_WATER",
    INLET_WATER: "GRATITUDE_INLET_WATER",
    BEACH_TRANSITION: "GRATITUDE_BEACH_TRANSITION",
    COASTAL_SHELF: "GRATITUDE_COASTAL_SHELF",
    REPAIRED_WATERLINE: "GRATITUDE_REPAIRED_WATERLINE",
    OUTSIDE: "GRATITUDE_SURFACE_OUTSIDE"
  });

  const DISTRICT = Object.freeze({
    WEST_ADVERSITY_EDGE: "WEST_ADVERSITY_EDGE",
    NORTH_CONTINUANCE_SHOULDER: "NORTH_CONTINUANCE_SHOULDER",
    EAST_REOPENING_COAST: "EAST_REOPENING_COAST",
    SOUTH_RESTORATION_BELT: "SOUTH_RESTORATION_BELT",
    INTERIOR_MEMORY_FIELD: "INTERIOR_MEMORY_FIELD",
    SHELTER_MOUTH_BELT: "SHELTER_MOUTH_BELT",
    SUBMERGED_EDGE_RING: "SUBMERGED_EDGE_RING"
  });

  const HYDROLOGY_CATEGORY_TO_SURFACE = Object.freeze({
    COASTAL_SHELF: SURFACE_CLASS.COASTAL_SHELF,
    BEACH_TRANSITION: SURFACE_CLASS.BEACH_TRANSITION,
    HARD_COAST_WATERLINE: SURFACE_CLASS.WEST_ADVERSITY_HARD_COAST_SURFACE,
    BAY_WATER_BODY: SURFACE_CLASS.BAY_WATER,
    INLET_WATER_CUT: SURFACE_CLASS.INLET_WATER,
    LAGOON_WATER_BODY: SURFACE_CLASS.LAGOON_WATER,
    WETLAND_TRANSITION: SURFACE_CLASS.SOUTH_RESTORATION_WETLAND_SURFACE,
    INLAND_LAKE_WATER: SURFACE_CLASS.MEMORY_LAKE_WATER,
    SUBMERGED_EDGE: SURFACE_CLASS.COASTAL_SHELF,
    REPAIRED_WATERLINE: SURFACE_CLASS.REPAIRED_WATERLINE,
    SEA_LEVEL_BLEND: SURFACE_CLASS.COASTAL_LAND
  });

  const MATERIAL_COLORS = Object.freeze({
    interiorLand: Object.freeze([54, 133, 78, 1]),
    coastalLand: Object.freeze([70, 150, 88, 0.78]),
    edgeLand: Object.freeze([75, 156, 96, 0.62]),
    northContinuance: Object.freeze([83, 158, 100, 0.76]),
    westAdversity: Object.freeze([70, 108, 82, 0.80]),
    eastReopening: Object.freeze([72, 158, 116, 0.68]),
    southRestoration: Object.freeze([82, 150, 100, 0.60]),
    memoryLake: Object.freeze([54, 178, 208, 0.70]),
    lagoonWater: Object.freeze([92, 205, 202, 0.62]),
    bayWater: Object.freeze([70, 190, 220, 0.58]),
    inletWater: Object.freeze([94, 214, 230, 0.62]),
    beachTransition: Object.freeze([210, 192, 124, 0.52]),
    coastalShelf: Object.freeze([60, 176, 206, 0.34]),
    repairedWaterline: Object.freeze([108, 194, 180, 0.46]),
    outside: Object.freeze([0, 0, 0, 0])
  });

  const FALLBACK_BOUNDARY = Object.freeze([
    p(-83.8, -8.8), p(-87.2, -3.1), p(-84.4, 2.6), p(-87.8, 8.7),
    p(-84.6, 15.2), p(-86.7, 22.4), p(-79.8, 29.4), p(-73.2, 35.8),
    p(-65.4, 41.2), p(-55.2, 44.5), p(-43.8, 44.1), p(-32.6, 40.7),
    p(-23.1, 35.7), p(-15.9, 28.4), p(-8.8, 20.6), p(-13.8, 14.7),
    p(-6.2, 8.2), p(-13.4, 2.2), p(-8.4, -4.8), p(-16.8, -10.6),
    p(-21.6, -17.4), p(-30.2, -22.2), p(-38.6, -27.8), p(-48.3, -30.8),
    p(-57.4, -28.5), p(-65.6, -33.2), p(-72.4, -27.6), p(-78.2, -22.2),
    p(-72.5, -17.6), p(-80.5, -13.8)
  ]);

  const FALLBACK_LAKES = Object.freeze([
    organicRing(-47.8, 14.3, 8.8, 6.1, 24, 5101, 0.06),
    organicRing(-60.1, -9.6, 6.9, 4.8, 20, 5102, 0.07),
    organicRing(-35.9, 31.2, 3.8, 2.7, 14, 5103, 0.08),
    organicRing(-40.4, -22.7, 4.4, 3.0, 14, 5104, 0.08)
  ]);

  const FALLBACK_LAGOONS = Object.freeze([
    organicRing(-53.2, -27.1, 8.4, 3.2, 18, 5201, 0.09),
    organicRing(-13.5, 3.2, 4.4, 2.7, 14, 5202, 0.09)
  ]);

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function mix(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return Object.freeze([
      Math.round(mix(a[0], b[0], k)),
      Math.round(mix(a[1], b[1], k)),
      Math.round(mix(a[2], b[2], k)),
      mix(a[3] === undefined ? 1 : a[3], b[3] === undefined ? 1 : b[3], k)
    ]);
  }

  function multiplyColor(color, factor, alphaFactor = 1) {
    return Object.freeze([
      clamp(Math.round(color[0] * factor), 0, 255),
      clamp(Math.round(color[1] * factor), 0, 255),
      clamp(Math.round(color[2] * factor), 0, 255),
      clamp01((color[3] === undefined ? 1 : color[3]) * alphaFactor)
    ]);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((finite(value, 0) - finite(edge0, 0)) / Math.max(0.000001, finite(edge1, 1) - finite(edge0, 0)));
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    const number = finite(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function p(lon, lat) {
    return Object.freeze({
      lon: roundCoord(lon),
      lat: roundCoord(lat)
    });
  }

  function roundCoord(value) {
    return Math.round(Number(value) * 1000) / 1000;
  }

  function lonLatToUV(lon, lat) {
    return Object.freeze({
      u: wrap01((finite(lon, 0) + 180) / 360),
      v: clamp01((90 - finite(lat, 0)) / 180)
    });
  }

  function uvToLonLat(u, v) {
    return Object.freeze({
      lon: wrap01(u) * 360 - 180,
      lat: 90 - clamp01(v) * 180
    });
  }

  function hash2(x, y, seed) {
    return fract(Math.sin(finite(x, 0) * 127.1 + finite(y, 0) * 311.7 + finite(seed, 0) * 74.7) * 43758.5453123);
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

  function fbm(x, y, seed, octaves = 4) {
    let total = 0;
    let amplitude = 0.52;
    let frequency = 1;
    let normalizer = 0;

    for (let index = 0; index < octaves; index += 1) {
      total += valueNoise(x * frequency, y * frequency, seed + index * 29.37) * amplitude;
      normalizer += amplitude;
      amplitude *= 0.5;
      frequency *= PHI;
    }

    return total / Math.max(0.000001, normalizer);
  }

  function cubeRound(q, r) {
    const s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return Object.freeze({ q: rq, r: rr });
  }

  function nearestHexCenter(xPx, yPx, hexRadius) {
    const q = (Math.sqrt(3) / 3 * xPx - 1 / 3 * yPx) / Math.max(0.000001, hexRadius);
    const r = (2 / 3 * yPx) / Math.max(0.000001, hexRadius);
    const rounded = cubeRound(q, r);

    return Object.freeze({
      x: hexRadius * Math.sqrt(3) * (rounded.q + rounded.r / 2),
      y: hexRadius * 1.5 * rounded.r,
      q: rounded.q,
      r: rounded.r
    });
  }

  function hexDistance(localX, localY, hexRadius) {
    const q = (Math.sqrt(3) / 3 * localX - 1 / 3 * localY) / Math.max(0.000001, hexRadius);
    const r = (2 / 3 * localY) / Math.max(0.000001, hexRadius);
    const s = -q - r;

    return Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
  }

  function computeHexContext(lon, lat, context = {}) {
    if (
      Number.isFinite(Number(context.hexQ)) &&
      Number.isFinite(Number(context.hexR)) &&
      Number.isFinite(Number(context.hexSeed))
    ) {
      return Object.freeze({
        q: Number(context.hexQ),
        r: Number(context.hexR),
        seed: Number(context.hexSeed),
        edgeFactor: clamp01(context.edgeFactor),
        source: "adapter"
      });
    }

    const uv = lonLatToUV(lon, lat);
    const x = (uv.u - 0.5) * 920;
    const y = (uv.v - 0.5) * 460;
    const hexRadius = 2.4;
    const center = nearestHexCenter(x, y, hexRadius);
    const edge = smoothstep(0.74, 1.03, hexDistance(x - center.x, y - center.y, hexRadius));
    const seed = hash2(center.q, center.r, 6001);

    return Object.freeze({
      q: center.q,
      r: center.r,
      seed,
      edgeFactor: edge,
      source: "surface-fallback"
    });
  }

  function organicRing(cx, cy, rx, ry, count, seed, wobble = 0.08) {
    const points = [];

    for (let i = 0; i < count; i += 1) {
      const angle = (TAU * i) / count;
      const pulseA = Math.sin(angle * 3 + seed * 0.011) * wobble;
      const pulseB = Math.cos(angle * 5 + seed * 0.017) * wobble * 0.55;
      const pulseC = Math.sin(angle * 7 + seed * 0.023) * wobble * 0.28;
      const scale = 1 + pulseA + pulseB + pulseC;

      points.push(p(cx + Math.cos(angle) * rx * scale, cy + Math.sin(angle) * ry * scale));
    }

    return Object.freeze(points);
  }

  function distanceToSegment(point, a, b) {
    const x = finite(point.lon, 0);
    const y = finite(point.lat, 0);
    const x1 = finite(a.lon, 0);
    const y1 = finite(a.lat, 0);
    const x2 = finite(b.lon, 0);
    const y2 = finite(b.lat, 0);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;

    if (len2 <= 0.000001) {
      const ddx = x - x1;
      const ddy = y - y1;
      return Math.sqrt(ddx * ddx + ddy * ddy);
    }

    const t = clamp(((x - x1) * dx + (y - y1) * dy) / len2, 0, 1);
    const px = x1 + t * dx;
    const py = y1 + t * dy;
    const ddx = x - px;
    const ddy = y - py;

    return Math.sqrt(ddx * ddx + ddy * ddy);
  }

  function nearestBoundaryDistance(lon, lat, boundary) {
    if (!Array.isArray(boundary) || boundary.length < 2) {
      return Object.freeze({
        distance: 999,
        segmentIndex: -1,
        point: null
      });
    }

    const point = { lon, lat };
    let best = 999;
    let index = -1;

    for (let i = 0; i < boundary.length; i += 1) {
      const a = boundary[i];
      const b = boundary[(i + 1) % boundary.length];
      const d = distanceToSegment(point, a, b);

      if (d < best) {
        best = d;
        index = i;
      }
    }

    return Object.freeze({
      distance: best,
      segmentIndex: index,
      point
    });
  }

  function pointInPolygon(lon, lat, polygon) {
    if (!Array.isArray(polygon) || polygon.length < 3) return false;

    let inside = false;
    const x = finite(lon, 0);
    const y = finite(lat, 0);

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const xi = finite(polygon[i].lon, 0);
      const yi = finite(polygon[i].lat, 0);
      const xj = finite(polygon[j].lon, 0);
      const yj = finite(polygon[j].lat, 0);

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / Math.max(0.000001, yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function readTopology() {
    const result = {
      attempted: false,
      succeeded: false,
      contract: "",
      contractValid: false,
      topologyId: "",
      topology: null,
      error: "",
      source: "none"
    };

    if (!hasWindow()) {
      result.error = "window_unavailable";
      return result;
    }

    result.attempted = true;

    try {
      const api = window.AUDRALIA_TOPOLOGY_GRATITUDE || null;

      if (!api) {
        result.error = "AUDRALIA_TOPOLOGY_GRATITUDE_missing";
        return result;
      }

      result.source = "window.AUDRALIA_TOPOLOGY_GRATITUDE";

      const status =
        typeof api.getStatus === "function"
          ? api.getStatus()
          : typeof api.status === "function"
            ? api.status()
            : null;

      result.contract = status && status.contract ? String(status.contract) : String(api.CONTRACT || "");
      result.contractValid = result.contract === TOPOLOGY_CONTRACT_EXPECTED;

      if (typeof api.getTopology !== "function") {
        result.error = "getTopology_missing";
        return result;
      }

      const topology = api.getTopology();

      if (!topology || !Array.isArray(topology.landmasses) || !topology.landmasses.length) {
        result.error = "invalid_topology_shape";
        return result;
      }

      result.topology = topology;
      result.topologyId = topology.id || "";
      result.succeeded = true;
      result.error = "";

      return result;
    } catch (error) {
      result.error = error && error.message ? error.message : String(error);
      return result;
    }
  }

  function readHydrology() {
    const result = {
      attempted: false,
      succeeded: false,
      contract: "",
      contractValid: false,
      hydrologyId: "",
      hydrology: null,
      error: "",
      source: "none"
    };

    if (!hasWindow()) {
      result.error = "window_unavailable";
      return result;
    }

    result.attempted = true;

    try {
      const api = window.AUDRALIA_GRATITUDE_HYDROLOGY || null;

      if (!api) {
        result.error = "AUDRALIA_GRATITUDE_HYDROLOGY_missing";
        return result;
      }

      result.source = "window.AUDRALIA_GRATITUDE_HYDROLOGY";

      const status =
        typeof api.getStatus === "function"
          ? api.getStatus()
          : typeof api.status === "function"
            ? api.status()
            : null;

      result.contract = status && status.contract ? String(status.contract) : String(api.CONTRACT || "");
      result.contractValid = result.contract === HYDROLOGY_CONTRACT_EXPECTED;

      if (typeof api.getHydrology !== "function") {
        result.error = "getHydrology_missing";
        return result;
      }

      const hydrology = api.getHydrology();

      if (!hydrology || typeof hydrology !== "object") {
        result.error = "invalid_hydrology_shape";
        return result;
      }

      result.hydrology = hydrology;
      result.hydrologyId = hydrology.id || "";
      result.succeeded = true;
      result.error = "";

      return result;
    } catch (error) {
      result.error = error && error.message ? error.message : String(error);
      return result;
    }
  }

  function getPrimaryBoundary(topologyRead) {
    if (
      topologyRead &&
      topologyRead.succeeded &&
      topologyRead.topology &&
      topologyRead.topology.landmasses &&
      topologyRead.topology.landmasses[0] &&
      Array.isArray(topologyRead.topology.landmasses[0].boundary)
    ) {
      return topologyRead.topology.landmasses[0].boundary;
    }

    return FALLBACK_BOUNDARY;
  }

  function getPrimaryLandmass(topologyRead) {
    if (
      topologyRead &&
      topologyRead.succeeded &&
      topologyRead.topology &&
      topologyRead.topology.landmasses &&
      topologyRead.topology.landmasses[0]
    ) {
      return topologyRead.topology.landmasses[0];
    }

    return {
      id: "gratitude-fallback-surface-landmass",
      boundary: FALLBACK_BOUNDARY,
      topology: {
        lakes: FALLBACK_LAKES,
        lagoons: FALLBACK_LAGOONS
      }
    };
  }

  function getHydrologyRings(hydrology, key, fallback) {
    if (!hydrology || !Array.isArray(hydrology[key])) return fallback || [];

    return hydrology[key]
      .map((entry) => {
        if (entry && Array.isArray(entry.boundary) && entry.boundary.length) return entry.boundary;
        return null;
      })
      .filter(Boolean);
  }

  function getSourceBoundary(entry) {
    if (!entry) return [];

    if (Array.isArray(entry.boundary) && entry.boundary.length) return entry.boundary;

    if (entry.profile && Array.isArray(entry.profile.sourceBoundary) && entry.profile.sourceBoundary.length) {
      return entry.profile.sourceBoundary;
    }

    return [];
  }

  function classifyDistrict(lon, lat, boundaryDistance) {
    if (lat >= 24) return DISTRICT.NORTH_CONTINUANCE_SHOULDER;
    if (lon <= -68) return DISTRICT.WEST_ADVERSITY_EDGE;
    if (lon >= -24 && lat > -18) return DISTRICT.EAST_REOPENING_COAST;
    if (lat <= -16) return DISTRICT.SOUTH_RESTORATION_BELT;
    if (boundaryDistance > 5.6) return DISTRICT.INTERIOR_MEMORY_FIELD;
    return DISTRICT.INTERIOR_MEMORY_FIELD;
  }

  function coastBandFromDistance(distance, inside) {
    if (!inside && distance <= 2.2) return "outside_shelf";
    if (distance <= 1.1) return "waterline";
    if (distance <= 2.7) return "edge";
    if (distance <= 5.4) return "coastal";
    return "interior";
  }

  function sampleHydrologyInfluence(lon, lat, hydrology, landmass) {
    const lakes = getHydrologyRings(hydrology, "inlandLakeRegistry", FALLBACK_LAKES.map((boundary, index) => ({ boundary, id: `fallback-lake-${index}` })));
    const lagoons = getHydrologyRings(hydrology, "lagoonWaterRegistry", FALLBACK_LAGOONS.map((boundary, index) => ({ boundary, id: `fallback-lagoon-${index}` })));

    for (const ring of lakes) {
      if (pointInPolygon(lon, lat, ring)) {
        return Object.freeze({
          class: SURFACE_CLASS.MEMORY_LAKE_WATER,
          category: "INLAND_LAKE_WATER",
          strength: 1,
          water: true,
          source: "inlandLakeRegistry"
        });
      }
    }

    for (const ring of lagoons) {
      if (pointInPolygon(lon, lat, ring)) {
        return Object.freeze({
          class: SURFACE_CLASS.LAGOON_WATER,
          category: "LAGOON_WATER_BODY",
          strength: 1,
          water: true,
          source: "lagoonWaterRegistry"
        });
      }
    }

    const registryChecks = [
      { key: "bayWaterRegistry", category: "BAY_WATER_BODY", className: SURFACE_CLASS.BAY_WATER, threshold: 2.8 },
      { key: "inletWaterRegistry", category: "INLET_WATER_CUT", className: SURFACE_CLASS.INLET_WATER, threshold: 2.0 },
      { key: "wetlandBlendRegistry", category: "WETLAND_TRANSITION", className: SURFACE_CLASS.SOUTH_RESTORATION_WETLAND_SURFACE, threshold: 3.3 },
      { key: "beachTransitionRegistry", category: "BEACH_TRANSITION", className: SURFACE_CLASS.BEACH_TRANSITION, threshold: 2.5 },
      { key: "hardCoastWaterlineRegistry", category: "HARD_COAST_WATERLINE", className: SURFACE_CLASS.WEST_ADVERSITY_HARD_COAST_SURFACE, threshold: 1.8 },
      { key: "repairedWaterlineRegistry", category: "REPAIRED_WATERLINE", className: SURFACE_CLASS.REPAIRED_WATERLINE, threshold: 2.3 },
      { key: "coastalShelfRegistry", category: "COASTAL_SHELF", className: SURFACE_CLASS.COASTAL_SHELF, threshold: 3.4 },
      { key: "submergedEdgeRegistry", category: "SUBMERGED_EDGE", className: SURFACE_CLASS.COASTAL_SHELF, threshold: 4.2 }
    ];

    for (const check of registryChecks) {
      const entries = safeArray(hydrology && hydrology[check.key]);

      for (const entry of entries) {
        const sourceBoundary = getSourceBoundary(entry);
        if (!sourceBoundary.length) continue;

        const nearest = nearestBoundaryDistance(lon, lat, sourceBoundary);

        if (nearest.distance <= check.threshold) {
          return Object.freeze({
            class: check.className,
            category: check.category,
            strength: clamp01(1 - nearest.distance / Math.max(0.000001, check.threshold)),
            water: check.category.includes("WATER") || check.category.includes("INLET") || check.category.includes("BAY") || check.category.includes("SHELF"),
            source: check.key,
            district: entry.district || ""
          });
        }
      }
    }

    const boundary = Array.isArray(landmass.boundary) ? landmass.boundary : FALLBACK_BOUNDARY;
    const nearestCoast = nearestBoundaryDistance(lon, lat, boundary);

    if (nearestCoast.distance <= 3.2) {
      return Object.freeze({
        class: SURFACE_CLASS.COASTAL_LAND,
        category: "SEA_LEVEL_BLEND",
        strength: clamp01(1 - nearestCoast.distance / 3.2),
        water: false,
        source: "coast-distance"
      });
    }

    return Object.freeze({
      class: "",
      category: "",
      strength: 0,
      water: false,
      source: "none"
    });
  }

  function baseMaterialFor(surfaceClass, district, coastStrength) {
    if (surfaceClass === SURFACE_CLASS.MEMORY_LAKE_WATER) return MATERIAL_COLORS.memoryLake;
    if (surfaceClass === SURFACE_CLASS.LAGOON_WATER) return MATERIAL_COLORS.lagoonWater;
    if (surfaceClass === SURFACE_CLASS.BAY_WATER) return MATERIAL_COLORS.bayWater;
    if (surfaceClass === SURFACE_CLASS.INLET_WATER) return MATERIAL_COLORS.inletWater;
    if (surfaceClass === SURFACE_CLASS.BEACH_TRANSITION) return MATERIAL_COLORS.beachTransition;
    if (surfaceClass === SURFACE_CLASS.COASTAL_SHELF) return MATERIAL_COLORS.coastalShelf;
    if (surfaceClass === SURFACE_CLASS.REPAIRED_WATERLINE) return MATERIAL_COLORS.repairedWaterline;
    if (surfaceClass === SURFACE_CLASS.WEST_ADVERSITY_HARD_COAST_SURFACE) return MATERIAL_COLORS.westAdversity;
    if (surfaceClass === SURFACE_CLASS.EAST_REOPENING_WATER_CARVED_SURFACE) return MATERIAL_COLORS.eastReopening;
    if (surfaceClass === SURFACE_CLASS.SOUTH_RESTORATION_WETLAND_SURFACE) return MATERIAL_COLORS.southRestoration;
    if (surfaceClass === SURFACE_CLASS.NORTH_CONTINUANCE_SURFACE) return MATERIAL_COLORS.northContinuance;

    if (district === DISTRICT.WEST_ADVERSITY_EDGE) return MATERIAL_COLORS.westAdversity;
    if (district === DISTRICT.NORTH_CONTINUANCE_SHOULDER) return MATERIAL_COLORS.northContinuance;
    if (district === DISTRICT.EAST_REOPENING_COAST) return MATERIAL_COLORS.eastReopening;
    if (district === DISTRICT.SOUTH_RESTORATION_BELT) return MATERIAL_COLORS.southRestoration;

    if (coastStrength > 0.6) return MATERIAL_COLORS.edgeLand;
    if (coastStrength > 0.25) return MATERIAL_COLORS.coastalLand;

    return MATERIAL_COLORS.interiorLand;
  }

  function resolveSurfaceClass(inside, coastBand, district, hydrologyInfluence) {
    if (hydrologyInfluence && hydrologyInfluence.class) return hydrologyInfluence.class;

    if (!inside) {
      return coastBand === "outside_shelf" ? SURFACE_CLASS.COASTAL_SHELF : SURFACE_CLASS.OUTSIDE;
    }

    if (district === DISTRICT.WEST_ADVERSITY_EDGE && (coastBand === "waterline" || coastBand === "edge")) {
      return SURFACE_CLASS.WEST_ADVERSITY_HARD_COAST_SURFACE;
    }

    if (district === DISTRICT.NORTH_CONTINUANCE_SHOULDER && coastBand !== "interior") {
      return SURFACE_CLASS.NORTH_CONTINUANCE_SURFACE;
    }

    if (district === DISTRICT.EAST_REOPENING_COAST && coastBand !== "interior") {
      return SURFACE_CLASS.EAST_REOPENING_WATER_CARVED_SURFACE;
    }

    if (district === DISTRICT.SOUTH_RESTORATION_BELT && coastBand !== "interior") {
      return SURFACE_CLASS.SOUTH_RESTORATION_WETLAND_SURFACE;
    }

    if (coastBand === "waterline" || coastBand === "edge") return SURFACE_CLASS.EDGE_LAND;
    if (coastBand === "coastal") return SURFACE_CLASS.COASTAL_LAND;

    return SURFACE_CLASS.INTERIOR_LAND;
  }

  function applySampleMaterial(color, sample, hexContext, context = {}) {
    const edgeFactor = clamp01(hexContext.edgeFactor);
    const micro = fbm(hexContext.q * 0.17 + hexContext.seed * 2.0, hexContext.r * 0.17 - hexContext.seed * 3.0, 6201, 3);
    const sphericalDepth = clamp01(context.sphericalDepth === undefined ? 1 : context.sphericalDepth);
    const lightDot = clamp(context.lightDot === undefined ? 0.72 : context.lightDot, -1, 1);
    const limbFade = clamp01(context.limbFade === undefined ? 1 - Math.pow(1 - sphericalDepth, 1.8) : context.limbFade);

    let out = color;

    const microShade = clamp(0.94 + (micro - 0.5) * 0.12, 0.86, 1.10);
    const edgeShade = clamp(1 - edgeFactor * 0.028, 0.90, 1.02);
    const sphereShade = clamp(0.55 + sphericalDepth * 0.52, 0.44, 1.07);
    const lightShade = clamp(0.58 + Math.max(0, lightDot) * 0.42, 0.45, 1.06);

    out = multiplyColor(out, microShade * edgeShade * sphereShade * lightShade, limbFade);

    if (sample.hardCoast) {
      out = mixColor(out, [45, 62, 58, out[3]], 0.18);
    }

    if (sample.wetland) {
      out = mixColor(out, [92, 160, 116, out[3]], 0.22);
    }

    if (sample.beach) {
      out = mixColor(out, [216, 196, 132, out[3]], 0.22);
    }

    if (sample.shelf || sample.bay || sample.inlet || sample.lagoon || sample.lake) {
      out = mixColor(out, [58, 178, 205, out[3]], 0.18);
    }

    return Object.freeze([
      out[0],
      out[1],
      out[2],
      clamp01(out[3])
    ]);
  }

  function sampleSurface(lonInput, latInput, context = {}) {
    const lon = finite(lonInput, 0);
    const lat = clamp(finite(latInput, 0), -90, 90);
    const uv = lonLatToUV(lon, lat);

    const topologyRead = readTopology();
    const hydrologyRead = readHydrology();
    const landmass = getPrimaryLandmass(topologyRead);
    const boundary = Array.isArray(landmass.boundary) && landmass.boundary.length ? landmass.boundary : FALLBACK_BOUNDARY;

    const inside = pointInPolygon(lon, lat, boundary);
    const nearest = nearestBoundaryDistance(lon, lat, boundary);
    const coastBand = coastBandFromDistance(nearest.distance, inside);
    const nearCoast = coastBand !== "interior";
    const coastStrength = clamp01(1 - nearest.distance / 6.0);
    const district = classifyDistrict(lon, lat, nearest.distance);
    const hydrologyInfluence = sampleHydrologyInfluence(lon, lat, hydrologyRead.hydrology, landmass);
    const surfaceClass = resolveSurfaceClass(inside, coastBand, district, hydrologyInfluence);
    const hexContext = computeHexContext(lon, lat, context);

    const water =
      surfaceClass === SURFACE_CLASS.MEMORY_LAKE_WATER ||
      surfaceClass === SURFACE_CLASS.LAGOON_WATER ||
      surfaceClass === SURFACE_CLASS.BAY_WATER ||
      surfaceClass === SURFACE_CLASS.INLET_WATER ||
      surfaceClass === SURFACE_CLASS.COASTAL_SHELF;

    const land =
      inside &&
      !water &&
      surfaceClass !== SURFACE_CLASS.OUTSIDE;

    const allowed = inside || surfaceClass === SURFACE_CLASS.COASTAL_SHELF || hydrologyInfluence.strength > 0.12;

    let alpha = allowed ? 0.68 : 0;
    if (inside && coastBand === "interior") alpha = 0.82;
    if (inside && coastBand === "coastal") alpha = 0.66;
    if (inside && coastBand === "edge") alpha = 0.52;
    if (coastBand === "waterline") alpha = 0.46;
    if (!inside && surfaceClass === SURFACE_CLASS.COASTAL_SHELF) alpha = 0.28;
    if (water) alpha = Math.max(alpha, 0.50);

    const base = baseMaterialFor(surfaceClass, district, coastStrength);
    const color = applySampleMaterial(base, {
      hardCoast: surfaceClass === SURFACE_CLASS.WEST_ADVERSITY_HARD_COAST_SURFACE,
      wetland: surfaceClass === SURFACE_CLASS.SOUTH_RESTORATION_WETLAND_SURFACE,
      beach: surfaceClass === SURFACE_CLASS.BEACH_TRANSITION,
      shelf: surfaceClass === SURFACE_CLASS.COASTAL_SHELF,
      bay: surfaceClass === SURFACE_CLASS.BAY_WATER,
      inlet: surfaceClass === SURFACE_CLASS.INLET_WATER,
      lagoon: surfaceClass === SURFACE_CLASS.LAGOON_WATER,
      lake: surfaceClass === SURFACE_CLASS.MEMORY_LAKE_WATER
    }, hexContext, context);

    return Object.freeze({
      allowed,
      contract: CONTRACT,
      continent: CONTINENT,
      summit: SUMMIT,

      lon,
      lat,
      u: uv.u,
      v: uv.v,

      insideGratitude: inside,
      nearCoast,
      coastDistance: nearest.distance,
      coastBand,
      boundarySegmentIndex: nearest.segmentIndex,
      district,

      materialClass: surfaceClass,
      visualSurfaceClass: surfaceClass,

      land,
      water,
      shelf: surfaceClass === SURFACE_CLASS.COASTAL_SHELF,
      beach: surfaceClass === SURFACE_CLASS.BEACH_TRANSITION,
      wetland: surfaceClass === SURFACE_CLASS.SOUTH_RESTORATION_WETLAND_SURFACE,
      lagoon: surfaceClass === SURFACE_CLASS.LAGOON_WATER,
      lake: surfaceClass === SURFACE_CLASS.MEMORY_LAKE_WATER,
      bay: surfaceClass === SURFACE_CLASS.BAY_WATER,
      inlet: surfaceClass === SURFACE_CLASS.INLET_WATER,
      hardCoast: surfaceClass === SURFACE_CLASS.WEST_ADVERSITY_HARD_COAST_SURFACE,
      repairedWaterline: surfaceClass === SURFACE_CLASS.REPAIRED_WATERLINE,
      interiorLand: surfaceClass === SURFACE_CLASS.INTERIOR_LAND,
      edgeLand: surfaceClass === SURFACE_CLASS.EDGE_LAND || surfaceClass === SURFACE_CLASS.COASTAL_LAND,

      alpha: clamp01(alpha),
      color,
      materialAlpha: clamp01(alpha * color[3]),
      edgeSoftness: district === DISTRICT.WEST_ADVERSITY_EDGE ? 0.18 : district === DISTRICT.SOUTH_RESTORATION_BELT ? 0.78 : 0.48,

      hexQ: hexContext.q,
      hexR: hexContext.r,
      hexSeed: hexContext.seed,
      hexEdgeFactor: hexContext.edgeFactor,
      microVariation: fbm(hexContext.q * 0.17 + hexContext.seed * 2.0, hexContext.r * 0.17 - hexContext.seed * 3.0, 6201, 3),

      sphericalDepthInfluence: clamp01(context.sphericalDepth === undefined ? 1 : context.sphericalDepth),

      hydrologyInfluence: {
        class: hydrologyInfluence.class,
        category: hydrologyInfluence.category,
        strength: hydrologyInfluence.strength,
        source: hydrologyInfluence.source
      },

      sourceReads: {
        topologyAttempted: topologyRead.attempted,
        topologySucceeded: topologyRead.succeeded,
        topologyContract: topologyRead.contract,
        topologyContractValid: topologyRead.contractValid,
        hydrologyAttempted: hydrologyRead.attempted,
        hydrologySucceeded: hydrologyRead.succeeded,
        hydrologyContract: hydrologyRead.contract,
        hydrologyContractValid: hydrologyRead.contractValid
      },

      renderGuidance: {
        shouldDrawAsSphereMaterialSample: true,
        shouldUseProjectedPolygonFill: false,
        shouldBlendCoast: nearCoast,
        shouldReduceDecalEdge: true,
        shouldShowSeaLevelShelf: surfaceClass === SURFACE_CLASS.COASTAL_SHELF,
        shouldShowBayCut: surfaceClass === SURFACE_CLASS.BAY_WATER,
        shouldShowInletCut: surfaceClass === SURFACE_CLASS.INLET_WATER,
        shouldShowWetlandBlend: surfaceClass === SURFACE_CLASS.SOUTH_RESTORATION_WETLAND_SURFACE,
        shouldShowLakeIntegration: surfaceClass === SURFACE_CLASS.MEMORY_LAKE_WATER,
        shouldFadeAtLimb: true
      },

      ownsDrawing: false,
      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false
    });
  }

  function sampleSurfaceUV(uInput, vInput, context = {}) {
    const lonLat = uvToLonLat(uInput, vInput);
    return sampleSurface(lonLat.lon, lonLat.lat, {
      ...context,
      u: wrap01(uInput),
      v: clamp01(vInput)
    });
  }

  const HEX_SAMPLING_RULES = Object.freeze({
    model: "hidden_hex_sampled_spherical_material",
    visibleHexGrid: false,
    honeycombOutlinesAllowed: false,
    hexPixelIntent: "sample discipline only",
    edgeFactorUsed: true,
    microSeedsUsed: true,
    cubeRoundUsed: true,
    nearestHexCenterUsed: true,
    hexDistanceUsed: true,
    sphericalDepthExpectedFromAdapter: true,
    adapterMustProvideSphereContext: true,
    terrainElevationRequired: false,
    purpose: "Break badge/decal read by letting Gratitude become a sphere-bound material field."
  });

  const MATERIAL_RULES = Object.freeze({
    [SURFACE_CLASS.INTERIOR_LAND]: {
      color: MATERIAL_COLORS.interiorLand,
      meaning: "Stable inner land material with low water influence.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.COASTAL_LAND]: {
      color: MATERIAL_COLORS.coastalLand,
      meaning: "Near-coast land material with reduced opacity and sea-level blending.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.EDGE_LAND]: {
      color: MATERIAL_COLORS.edgeLand,
      meaning: "Waterline-adjacent land material; must not render as hard sticker edge.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.NORTH_CONTINUANCE_SURFACE]: {
      color: MATERIAL_COLORS.northContinuance,
      meaning: "Broad, older, settled northern shelf/continuance material.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.WEST_ADVERSITY_HARD_COAST_SURFACE]: {
      color: MATERIAL_COLORS.westAdversity,
      meaning: "Harder west-coast material; no raised cliff geometry.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.EAST_REOPENING_WATER_CARVED_SURFACE]: {
      color: MATERIAL_COLORS.eastReopening,
      meaning: "East-side material interrupted by bay and inlet water access.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.SOUTH_RESTORATION_WETLAND_SURFACE]: {
      color: MATERIAL_COLORS.southRestoration,
      meaning: "Soft repaired southern wetland/lagoon-influenced material.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.MEMORY_LAKE_WATER]: {
      color: MATERIAL_COLORS.memoryLake,
      meaning: "Interior water material held inside Gratitude.",
      land: false,
      water: true
    },
    [SURFACE_CLASS.LAGOON_WATER]: {
      color: MATERIAL_COLORS.lagoonWater,
      meaning: "Protected lagoon water material.",
      land: false,
      water: true
    },
    [SURFACE_CLASS.BAY_WATER]: {
      color: MATERIAL_COLORS.bayWater,
      meaning: "Bay water material carving into the coast.",
      land: false,
      water: true
    },
    [SURFACE_CLASS.INLET_WATER]: {
      color: MATERIAL_COLORS.inletWater,
      meaning: "Narrow inlet water material.",
      land: false,
      water: true
    },
    [SURFACE_CLASS.BEACH_TRANSITION]: {
      color: MATERIAL_COLORS.beachTransition,
      meaning: "Soft shore transition material.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.COASTAL_SHELF]: {
      color: MATERIAL_COLORS.coastalShelf,
      meaning: "Submerged or shallow shelf material outside or under the waterline.",
      land: false,
      water: true
    },
    [SURFACE_CLASS.REPAIRED_WATERLINE]: {
      color: MATERIAL_COLORS.repairedWaterline,
      meaning: "Repaired waterline material where loss became survivable boundary.",
      land: true,
      water: false
    },
    [SURFACE_CLASS.OUTSIDE]: {
      color: MATERIAL_COLORS.outside,
      meaning: "Outside Gratitude surface field.",
      land: false,
      water: false
    }
  });

  const SURFACE_CLASSES = Object.freeze(Object.keys(SURFACE_CLASS).map((key) => SURFACE_CLASS[key]));

  const SPHERICAL_MATERIAL_MODEL = Object.freeze({
    requiresSphereSampling: true,
    requiresProjectedPolygonFill: false,
    usesSphericalDepth: true,
    usesLimbFade: true,
    usesLightDot: true,
    usesHexSamples: true,
    usesMaterialAlpha: true,
    terrainElevationRequired: false,
    reason: "Gratitude must render through sphere-bound samples rather than screen-space polygon fill."
  });

  const RENDER_HINTS = Object.freeze({
    recommendedDrawOrder: Object.freeze([
      "parent_ocean_body",
      "gratitude_hex_surface_samples",
      "gratitude_hydrology_material_interruptions",
      "gratitude_lake_and_lagoon_samples",
      "gratitude_coastal_waterline_samples",
      "minimal_topology_marks_if_needed",
      "parent_atmosphere_or_rim"
    ]),
    adapterRequirements: Object.freeze({
      loadSurfaceFile: true,
      validateSurfaceContract: true,
      buildOrReuseHexSurfaceGeometry: true,
      computeLonLatPerSphereSample: true,
      callSampleSurface: true,
      disablePrimarySolidPolygonFillWhenSurfaceSucceeds: true,
      allowPolygonFallbackOnly: true,
      useSphericalDepth: true,
      useLimbFade: true,
      useLightDot: true,
      useHexEdgeFactor: true,
      noVisibleHexGrid: true,
      noTerrainElevation: true
    }),
    badgeReductionRule: "If surface adapter succeeds, solid projected polygon fill must not remain the primary land renderer.",
    visualPassClaim: false
  });

  const FUTURE_HANDOFFS = Object.freeze({
    continentsAdapter: {
      required: true,
      target: "/assets/audralia/clean/engine/audralia/engine/continents.js",
      contract: "AUDRALIA_G2_6_CONTINENTS_GRATITUDE_HEX_SURFACE_RENDER_ADAPTER_TNT_v1",
      purpose: "Load Gratitude surface, sample material by lon/lat, and render Gratitude through sphere-bound hex samples instead of solid polygon fill.",
      mustReport: Object.freeze([
        "surfaceAdapterActive",
        "surfaceChildrenEnabled",
        "activeSurfaceChildren",
        "surfaceLoaded",
        "surfaceContractValid",
        "surfaceVisualConsumed",
        "surfaceRenderPassCount",
        "hexSurfaceSamples",
        "gratitudeSurfaceContract",
        "polygonFillPrimary false",
        "visualPassClaim false"
      ])
    },
    terrain: {
      mayReadLater: Object.freeze([
        "materialClass",
        "district",
        "coastBand",
        "hydrologyInfluence",
        "nearCoast"
      ]),
      mayNotAssume: Object.freeze([
        "elevation",
        "mountains",
        "ridges",
        "valleys",
        "basins",
        "snowline"
      ])
    },
    hydrology: {
      currentHydrologyConsumed: true,
      hydrologyOwnedHere: false
    }
  });

  const CATEGORY_MEANINGS = Object.freeze({
    surfaceOnly: "This file classifies material samples only; it does not draw.",
    hexSampled: "Hex sampling is hidden sample discipline only; no visible honeycomb grid.",
    sphericalMaterial: "Surface values must be consumed through sphere-bound sampling.",
    topologyRead: "Topology supplies Gratitude boundary and internal rings.",
    hydrologyRead: "Hydrology supplies sea-level material influences.",
    badgeReduction: "The future renderer must reduce or disable primary solid polygon fill when surface samples succeed.",
    noTerrain: "No elevation, mountains, ridges, valleys, basins, climate, plants, animals, or sky are defined here."
  });

  function getSurface() {
    const topologyRead = readTopology();
    const hydrologyRead = readHydrology();

    return clone(Object.freeze({
      id: "gratitude-downstream-hex-sampled-surface-material",
      continent: CONTINENT,
      summit: SUMMIT,
      contract: CONTRACT,
      downstreamOf: Object.freeze([DOWNSTREAM_OF_TOPOLOGY, DOWNSTREAM_OF_HYDROLOGY]),
      topologyContractExpected: TOPOLOGY_CONTRACT_EXPECTED,
      hydrologyContractExpected: HYDROLOGY_CONTRACT_EXPECTED,
      target: TARGET,
      route: ROUTE,

      surfaceOnly: true,
      topologyOwned: false,
      hydrologyOwned: false,
      terrainOwned: false,
      elevationOwned: false,
      globalOceanOwned: false,
      directDrawing: false,
      formVisibleClaim: false,
      visualPassClaim: false,

      sourceReaders: Object.freeze({
        topology: Object.freeze({
          global: "window.AUDRALIA_TOPOLOGY_GRATITUDE",
          method: "getTopology",
          expectedContract: TOPOLOGY_CONTRACT_EXPECTED,
          attempted: topologyRead.attempted,
          succeeded: topologyRead.succeeded,
          actualContract: topologyRead.contract,
          contractValid: topologyRead.contractValid,
          error: topologyRead.error
        }),
        hydrology: Object.freeze({
          global: "window.AUDRALIA_GRATITUDE_HYDROLOGY",
          method: "getHydrology",
          expectedContract: HYDROLOGY_CONTRACT_EXPECTED,
          attempted: hydrologyRead.attempted,
          succeeded: hydrologyRead.succeeded,
          actualContract: hydrologyRead.contract,
          contractValid: hydrologyRead.contractValid,
          error: hydrologyRead.error
        }),
        fallbackAllowed: true,
        fallbackReason: "Surface contract can publish before the future render adapter consumes live topology and hydrology."
      }),

      hexSamplingRules: HEX_SAMPLING_RULES,
      materialRules: MATERIAL_RULES,
      surfaceClasses: SURFACE_CLASSES,
      hydrologyMaterialMap: HYDROLOGY_CATEGORY_TO_SURFACE,
      sphericalMaterialModel: SPHERICAL_MATERIAL_MODEL,
      renderHints: RENDER_HINTS,
      futureHandoffs: FUTURE_HANDOFFS,
      categoryMeanings: CATEGORY_MEANINGS
    }));
  }

  function getMaterialRules() {
    return clone(MATERIAL_RULES);
  }

  function getHexSamplingRules() {
    return clone(HEX_SAMPLING_RULES);
  }

  function getRenderHints() {
    return clone(RENDER_HINTS);
  }

  function getFutureHandoffs() {
    return clone(FUTURE_HANDOFFS);
  }

  function getStatus() {
    const topologyRead = readTopology();
    const hydrologyRead = readHydrology();

    return {
      contract: CONTRACT,
      target: TARGET,
      route: ROUTE,
      downstreamOf: [DOWNSTREAM_OF_TOPOLOGY, DOWNSTREAM_OF_HYDROLOGY],
      topologyContractExpected: TOPOLOGY_CONTRACT_EXPECTED,
      hydrologyContractExpected: HYDROLOGY_CONTRACT_EXPECTED,

      topologyReadAttempted: topologyRead.attempted,
      topologyReadSucceeded: topologyRead.succeeded,
      topologyReadContract: topologyRead.contract,
      topologyContractValid: topologyRead.contractValid,
      topologyReadSource: topologyRead.source,
      topologyReadError: topologyRead.error,

      hydrologyReadAttempted: hydrologyRead.attempted,
      hydrologyReadSucceeded: hydrologyRead.succeeded,
      hydrologyReadContract: hydrologyRead.contract,
      hydrologyContractValid: hydrologyRead.contractValid,
      hydrologyReadSource: hydrologyRead.source,
      hydrologyReadError: hydrologyRead.error,

      surfaceOnly: true,
      topologyOwned: false,
      hydrologyOwned: false,
      terrainOwned: false,
      elevationOwned: false,
      globalOceanOwned: false,
      directDrawing: false,
      formVisibleClaim: false,

      pointInPolygonActive: true,
      coastDistanceActive: true,
      hiddenHexSamplingActive: true,
      visibleHexGrid: false,
      sphericalMaterialModelActive: true,

      surfaceClassCount: SURFACE_CLASSES.length,
      materialRuleCount: Object.keys(MATERIAL_RULES).length,

      renderAdapterRequired: true,
      futureContinentsAdapterContract: "AUDRALIA_G2_6_CONTINENTS_GRATITUDE_HEX_SURFACE_RENDER_ADAPTER_TNT_v1",

      owns: [
        "Gratitude sampled material classification",
        "point-in-Gratitude eligibility",
        "coast distance approximation",
        "coast-band classification",
        "hidden hex sample guidance",
        "micro material variation",
        "surface material classes",
        "hydrology-to-material mapping",
        "future render adapter hints"
      ],

      doesNotOwn: [
        "topology identity",
        "hydrology identity",
        "global ocean",
        "parent planet",
        "canvas",
        "route bridge",
        "runtime",
        "FORM_VISIBLE",
        "terrain elevation",
        "mountains",
        "ridges",
        "valleys",
        "basins",
        "animals",
        "plants",
        "sky",
        "climate",
        "motion",
        "final visual pass"
      ],

      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false
    };
  }

  const api = {
    CONTRACT,
    TOPOLOGY_CONTRACT_EXPECTED,
    HYDROLOGY_CONTRACT_EXPECTED,
    DOWNSTREAM_OF_TOPOLOGY,
    DOWNSTREAM_OF_HYDROLOGY,
    TARGET,
    ROUTE,
    CONTINENT,
    SUMMIT,

    getSurface,
    getStatus,
    status: getStatus,
    sampleSurface,
    sampleSurfaceUV,
    getMaterialRules,
    getHexSamplingRules,
    getRenderHints,
    getFutureHandoffs,

    pointInPolygon,
    nearestBoundaryDistance,
    cubeRound,
    nearestHexCenter,
    hexDistance
  };

  if (hasWindow()) {
    window.AUDRALIA_GRATITUDE_SURFACE = api;
    window.AUDRALIA_GRATITUDE_SURFACE_RECEIPT = getStatus();
    window.AUDRALIA_GRATITUDE_DOWNSTREAM_HEX_SAMPLED_SURFACE_ACTIVE = true;
  }
})();
