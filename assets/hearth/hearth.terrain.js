// /assets/hearth/hearth.terrain.js
// HEARTH_G3_PLANET_SURFACE_AREA_MULTI_RANGE_TERRAIN_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Upgrade Hearth terrain from close-up land panels into planet-scale surface-area terrain.
// - Preserve four independently sized General Regions.
// - Preserve sixteen Countries.
// - Preserve nine progressive Summit regions per General Region.
// - Add multiple mountain-range systems distributed across the planet surface.
// - Return relief, ridge, upland, lowland, range IDs, and surface-scale values.
// - Keep zoning as the governing map authority.
// - Keep hydration passive and downstream.
// - No rivers. No climate. No weather. No clouds. No humidity. No atmospheric moisture.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_PLANET_SURFACE_AREA_MULTI_RANGE_TERRAIN_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-planet-surface-area-multi-range-terrain";
  const RECEIPT = "HEARTH_G3_PLANET_SURFACE_AREA_MULTI_RANGE_TERRAIN_RECEIPT";

  const TAU = Math.PI * 2;
  const LAND_THRESHOLD = 0.105;

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "Restore one planet-scale terrain surface.",
    T2: "Preserve four General Regions.",
    T3: "Preserve sixteen Countries.",
    T4: "Preserve nine Summit regions per General Region.",
    T5: "Distribute multiple mountain-range systems.",
    T6: "Return relief, ridge, upland, lowland, and range IDs.",
    T7: "Keep hydration passive and downstream.",
    T8: "Reject close-up regional-panel terrain.",
    T9: "Return one full-planet terrain authority receipt."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.terrain.js",
    axis: "planet surface area → terrain distribution → orbital readability",
    artifact: "One full-surface Hearth terrain field with 4 General Regions, 16 Countries, 36 Summit regions, and multiple mountain ranges.",
    attack: "Reject close-up panels, one-mountain thinking, hydration-first drift, terrain-as-country-boundary drift, blue-only fallback, climate/weather/cloud leakage, and globe-template relapse."
  });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, clamp(t, 0, 1)));

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / ((b - a) || 1e-9), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cross3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function norm3(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  function dirFromLonLat(lonDeg, latDeg) {
    const lon = (lonDeg * Math.PI) / 180;
    const lat = (latDeg * Math.PI) / 180;
    const cl = Math.cos(lat);

    return [
      cl * Math.sin(lon),
      Math.sin(lat),
      cl * Math.cos(lon)
    ];
  }

  function makeBasis(center) {
    const up = Math.abs(center[1]) > 0.92 ? [1, 0, 0] : [0, 1, 0];
    const east = norm3(cross3(up, center));
    const north = norm3(cross3(center, east));

    return { east, north };
  }

  function hash3(a, b, c) {
    const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function wave3(v, seed) {
    return (
      Math.sin(v[0] * 5.7 + v[1] * 3.1 + v[2] * 4.2 + seed) * 0.046 +
      Math.cos(v[0] * 8.3 - v[1] * 2.8 + v[2] * 6.1 + seed * 1.7) * 0.035 +
      Math.sin(v[0] * 13.1 + v[1] * 7.2 - v[2] * 4.7 + seed * 2.3) * 0.021
    );
  }

  function microSurface(v, seed) {
    return clamp(
      0.5 +
      Math.sin(v[0] * 17.0 + v[1] * 11.0 + v[2] * 9.0 + seed) * 0.18 +
      Math.cos(v[0] * 23.0 - v[1] * 13.0 + v[2] * 15.0 + seed * 0.71) * 0.12,
      0,
      1
    );
  }

  function cap(v, center, radius, amplitude) {
    const d = dot3(v, center);
    const edge = Math.cos(radius);
    return smoothstep(edge, 1, d) * amplitude;
  }

  function segmentDistance(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const wx = px - ax;
    const wy = py - ay;
    const c1 = vx * wx + vy * wy;
    const c2 = vx * vx + vy * vy || 1e-9;
    const t = clamp(c1 / c2, 0, 1);

    return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
  }

  function gridBoundary(value, divider, width) {
    return 1 - smoothstep(width, width * 2.4, Math.abs(value - divider));
  }

  function summitBoundary(progress, width) {
    const scaled = progress * 9;
    const frac = scaled - Math.floor(scaled);
    const d = Math.min(frac, 1 - frac);

    return 1 - smoothstep(width, width * 2.2, d);
  }

  const SUMMIT_LABELS = Object.freeze([
    "S1 Base",
    "S2 Entry",
    "S3 Tooling",
    "S4 Systems",
    "S5 Coordination",
    "S6 Applied",
    "S7 Specialized",
    "S8 Restricted",
    "S9 Summit"
  ]);

  const GENERAL_REGION_SOURCE = [
    {
      id: "GR01",
      name: "Baseward West",
      centerLonLat: [-104, 20],
      size: [0.96, 0.66],
      color: [139, 114, 72],
      countryBase: 1,
      seed: 0.13,
      lobes: [
        [-104, 20, 0.62, 0.88],
        [-136, 38, 0.36, 0.40],
        [-78, 8, 0.35, 0.38],
        [-122, -18, 0.28, 0.23],
        [-154, -6, 0.20, 0.15]
      ],
      cuts: [
        [-92, 39, 0.19, 0.18],
        [-146, 8, 0.16, 0.11],
        [-67, 29, 0.13, 0.10]
      ],
      ranges: [
        ["GR01-R1", -0.74, 0.34, 0.45, -0.28, 0.135, 0.92],
        ["GR01-R2", -0.62, -0.20, 0.18, 0.44, 0.110, 0.68],
        ["GR01-R3", 0.10, -0.48, 0.68, 0.10, 0.095, 0.56]
      ]
    },
    {
      id: "GR02",
      name: "Rising South",
      centerLonLat: [-26, -28],
      size: [0.74, 0.82],
      color: [154, 124, 80],
      countryBase: 5,
      seed: 0.39,
      lobes: [
        [-26, -28, 0.58, 0.80],
        [-50, -8, 0.32, 0.35],
        [-4, -44, 0.32, 0.30],
        [-58, -52, 0.22, 0.17],
        [4, -14, 0.21, 0.15]
      ],
      cuts: [
        [-12, -4, 0.18, 0.14],
        [-49, -34, 0.13, 0.10],
        [-8, -61, 0.12, 0.08]
      ],
      ranges: [
        ["GR02-R1", -0.50, 0.62, 0.34, -0.74, 0.120, 0.86],
        ["GR02-R2", -0.74, -0.16, 0.20, 0.18, 0.090, 0.58],
        ["GR02-R3", -0.16, -0.64, 0.58, -0.22, 0.100, 0.62]
      ]
    },
    {
      id: "GR03",
      name: "Middle Eastward",
      centerLonLat: [58, 18],
      size: [1.00, 0.62],
      color: [133, 125, 82],
      countryBase: 9,
      seed: 0.64,
      lobes: [
        [58, 18, 0.64, 0.86],
        [26, 34, 0.34, 0.29],
        [92, 31, 0.38, 0.38],
        [78, -8, 0.27, 0.21],
        [116, 4, 0.23, 0.16]
      ],
      cuts: [
        [42, -2, 0.20, 0.16],
        [108, 12, 0.17, 0.12],
        [34, 52, 0.12, 0.08]
      ],
      ranges: [
        ["GR03-R1", -0.78, 0.18, 0.78, 0.36, 0.105, 0.78],
        ["GR03-R2", -0.36, -0.46, 0.40, 0.42, 0.120, 0.82],
        ["GR03-R3", 0.18, -0.34, 0.82, -0.06, 0.090, 0.50]
      ]
    },
    {
      id: "GR04",
      name: "Summitward North",
      centerLonLat: [138, 43],
      size: [0.66, 0.56],
      color: [127, 126, 94],
      countryBase: 13,
      seed: 0.86,
      lobes: [
        [138, 43, 0.44, 0.68],
        [164, 52, 0.27, 0.28],
        [116, 31, 0.26, 0.24],
        [-176, 56, 0.22, 0.16],
        [148, 22, 0.18, 0.11]
      ],
      cuts: [
        [151, 28, 0.15, 0.10],
        [124, 55, 0.12, 0.08],
        [174, 40, 0.11, 0.07]
      ],
      ranges: [
        ["GR04-R1", -0.62, -0.08, 0.64, 0.38, 0.095, 0.88],
        ["GR04-R2", -0.46, 0.48, 0.28, -0.42, 0.105, 0.72],
        ["GR04-R3", 0.18, 0.50, 0.76, -0.20, 0.080, 0.50]
      ]
    }
  ];

  const GENERAL_REGIONS = GENERAL_REGION_SOURCE.map((region, index) => {
    const center = dirFromLonLat(region.centerLonLat[0], region.centerLonLat[1]);

    return Object.freeze({
      ...region,
      index,
      center,
      basis: makeBasis(center),
      countries: [
        region.countryBase,
        region.countryBase + 1,
        region.countryBase + 2,
        region.countryBase + 3
      ],
      lobes: region.lobes.map(([lon, lat, radius, amplitude]) => ({
        center: dirFromLonLat(lon, lat),
        radius,
        amplitude
      })),
      cuts: region.cuts.map(([lon, lat, radius, amplitude]) => ({
        center: dirFromLonLat(lon, lat),
        radius,
        amplitude
      })),
      ranges: region.ranges.map(([id, ax, ay, bx, by, width, strength]) => ({
        id,
        ax,
        ay,
        bx,
        by,
        width,
        strength
      })),
      summitLabels: SUMMIT_LABELS
    });
  });

  function regionField(v, region) {
    let field = -0.125;

    for (const lobe of region.lobes) {
      field += cap(v, lobe.center, lobe.radius, lobe.amplitude);
    }

    for (const cut of region.cuts) {
      field -= cap(v, cut.center, cut.radius, cut.amplitude);
    }

    const localX = dot3(v, region.basis.east) / region.size[0];
    const localY = dot3(v, region.basis.north) / region.size[1];

    const taper =
      0.07 *
      Math.sin((localX * 1.9 + localY * 0.7 + region.seed) * TAU) *
      smoothstep(1.32, 0.18, Math.hypot(localX, localY));

    field += wave3(v, region.seed * 10.0) + taper;

    return field;
  }

  function localize(v, region) {
    const rawX = dot3(v, region.basis.east) / region.size[0];
    const rawY = dot3(v, region.basis.north) / region.size[1];

    const warpX =
      Math.sin((rawY * 1.35 + region.seed) * TAU) * 0.026 +
      Math.cos((rawX * 2.10 + region.seed * 0.33) * TAU) * 0.016;

    const warpY =
      Math.cos((rawX * 1.20 + region.seed * 0.72) * TAU) * 0.024 +
      Math.sin((rawY * 2.20 + region.seed * 0.41) * TAU) * 0.014;

    return {
      x: rawX + warpX,
      y: rawY + warpY
    };
  }

  function bestRegion(v) {
    let best = null;
    let second = null;

    for (const region of GENERAL_REGIONS) {
      const field = regionField(v, region);

      if (!best || field > best.field) {
        second = best;
        best = { region, field };
      } else if (!second || field > second.field) {
        second = { region, field };
      }
    }

    return {
      best,
      second,
      margin: best && second ? best.field - second.field : 1
    };
  }

  function mountainSample(local, region, field) {
    let ridge = 0;
    let bestRange = null;

    for (const range of region.ranges) {
      const d = segmentDistance(local.x, local.y, range.ax, range.ay, range.bx, range.by);
      const intensity = (1 - smoothstep(range.width, range.width * 2.75, d)) * range.strength;

      if (intensity > ridge) {
        ridge = intensity;
        bestRange = range;
      }
    }

    const uplandBase = smoothstep(LAND_THRESHOLD + 0.06, LAND_THRESHOLD + 0.44, field);
    const surfaceNoise = microSurface([local.x, local.y, field], region.seed * 19.0);

    const ridgeNoise = 0.80 + surfaceNoise * 0.22;
    const ridgeValue = clamp(ridge * ridgeNoise, 0, 1);
    const upland = clamp(uplandBase * 0.58 + ridgeValue * 0.42, 0, 1);
    const relief = clamp(ridgeValue * 0.62 + uplandBase * 0.28 + surfaceNoise * 0.10, 0, 1);
    const lowland = clamp((1 - upland) * smoothstep(LAND_THRESHOLD + 0.015, LAND_THRESHOLD + 0.22, field), 0, 1);

    return {
      mountainRangeId: bestRange && ridgeValue > 0.12 ? bestRange.id : null,
      ridge: ridgeValue,
      relief,
      upland,
      lowland,
      surfaceNoise
    };
  }

  function terrainColor(region, terrain) {
    let [r, g, b] = region.color;

    r = mix(r, 92, terrain.lowland * 0.16);
    g = mix(g, 132, terrain.lowland * 0.18);
    b = mix(b, 82, terrain.lowland * 0.10);

    r = mix(r, 118, terrain.upland * 0.22);
    g = mix(g, 108, terrain.upland * 0.18);
    b = mix(b, 88, terrain.upland * 0.14);

    r = mix(r, 84, terrain.relief * 0.28);
    g = mix(g, 82, terrain.relief * 0.25);
    b = mix(b, 78, terrain.relief * 0.22);

    r = mix(r, 218, terrain.ridge * 0.28);
    g = mix(g, 206, terrain.ridge * 0.24);
    b = mix(b, 176, terrain.ridge * 0.18);

    return [r, g, b];
  }

  function waterSample(region, shelf = 0, waterDepth = 1, coast = shelf) {
    return {
      land: false,
      visibleLand: false,
      region: region ? region.id : null,
      regionName: region ? region.name : null,
      generalRegion: region || null,
      countryId: null,
      countryIndex: null,
      summit: null,
      summitLabel: null,
      technologyRank: null,
      accessRank: null,
      coast: clamp(coast, 0, 1),
      shelf: clamp(shelf, 0, 1),
      waterDepth: clamp(waterDepth, 0, 1),
      regionBoundary: 0,
      countryBoundary: 0,
      summitBoundary: 0,
      citySeat: 0,
      localU: 0,
      localV: 0,
      color: null,
      mountainRangeId: null,
      relief: 0,
      ridge: 0,
      upland: 0,
      lowland: 0,
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      authority: "terrain-boundary-and-relief"
    };
  }

  function sampleVector(vec) {
    const v = norm3(vec);
    const selected = bestRegion(v);

    if (!selected.best) {
      return waterSample(null, 0, 1);
    }

    const region = selected.best.region;
    const field = selected.best.field;
    const land = field > LAND_THRESHOLD;
    const coast = 1 - smoothstep(0.015, 0.115, Math.abs(field - LAND_THRESHOLD));

    if (!land) {
      const shelf = clamp(coast * 0.94, 0, 1);
      const waterDepth = clamp((LAND_THRESHOLD - field) * 1.75, 0, 1);
      return waterSample(region, shelf, waterDepth, coast);
    }

    const local = localize(v, region);
    const u = clamp((local.x + 1) * 0.5, 0, 1);
    const q = clamp((local.y + 1) * 0.5, 0, 1);

    const countryDividerX = 0.5 + Math.sin((q * 1.15 + region.seed) * TAU) * 0.035;
    const countryDividerY = 0.5 + Math.cos((u * 1.05 + region.seed * 0.7) * TAU) * 0.030;

    const col = u >= countryDividerX ? 1 : 0;
    const row = q >= countryDividerY ? 1 : 0;
    const countryIndex = row * 2 + col;
    const countryId = region.countryBase + countryIndex;

    const summitProgress = clamp(u * 0.56 + (1 - q) * 0.44, 0, 0.999999);
    const summit = Math.floor(summitProgress * 9) + 1;

    const countryBoundary = Math.max(
      gridBoundary(u, countryDividerX, 0.010),
      gridBoundary(q, countryDividerY, 0.010)
    );

    const summitLine = summitBoundary(summitProgress, 0.018);

    const microX = Math.floor(u * 7);
    const microY = Math.floor(q * 6);
    const seatHash = hash3(microX + countryId * 11, microY + summit * 17, region.index + 1);
    const fu = u * 7 - microX;
    const fq = q * 6 - microY;
    const citySeat = seatHash > 0.72
      ? 1 - smoothstep(0.018, 0.052, Math.hypot(fu - 0.5, fq - 0.5))
      : 0;

    const regionBoundary = clamp(
      Math.max(
        coast,
        1 - smoothstep(0.020, 0.095, Math.abs(selected.margin))
      ),
      0,
      1
    );

    const mountain = mountainSample(local, region, field);
    const color = terrainColor(region, mountain);

    return {
      land: true,
      visibleLand: true,
      region: region.id,
      regionName: region.name,
      generalRegion: region,
      countryId,
      countryIndex,
      summit,
      summitLabel: SUMMIT_LABELS[summit - 1],
      technologyRank: summit,
      accessRank: 10 - summit,
      coast,
      shelf: 0,
      waterDepth: 0,
      field,
      regionBoundary,
      countryBoundary,
      summitBoundary: summitLine,
      citySeat,
      localU: u,
      localV: q,
      color,
      mountainRangeId: mountain.mountainRangeId,
      relief: mountain.relief,
      ridge: mountain.ridge,
      upland: mountain.upland,
      lowland: mountain.lowland,
      surfaceNoise: mountain.surfaceNoise,
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      authority: "terrain-boundary-and-relief"
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "planet-surface-area-multi-range-terrain",
      authority: "terrain-boundary-and-relief",
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      visibleLandGuarantee: true,
      generalRegions: GENERAL_REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        countries: region.countries,
        summitRegions: SUMMIT_LABELS,
        size: region.size,
        mountainRanges: region.ranges.map((range) => range.id)
      })),
      totals: {
        generalRegions: 4,
        countries: 16,
        summitRegionsPerGeneralRegion: 9,
        totalSummitRegions: 36,
        mountainRanges: GENERAL_REGIONS.reduce((sum, region) => sum + region.ranges.length, 0)
      },
      owns: [
        "landmass-family boundary",
        "General Region assignment",
        "Country assignment",
        "Summit region assignment",
        "city-zone seat placeholders",
        "coast threshold",
        "multiple mountain-range systems",
        "relief",
        "ridge",
        "upland",
        "lowland",
        "planet surface-area terrain scale"
      ],
      doesNotOwn: [
        "hydration expansion",
        "rivers",
        "weather",
        "climate",
        "clouds",
        "humidity",
        "atmospheric moisture"
      ],
      ticTacToeDynamicProtocol: TIC_TAC_TOE_DYNAMIC_PROTOCOL,
      systemicQuadAAttack: SYSTEMIC_QUAD_A_ATTACK
    });
  }

  function dispose() {
    if (window.HEARTH_TERRAIN && window.HEARTH_TERRAIN.contract === CONTRACT) {
      try {
        delete window.HEARTH_TERRAIN;
      } catch (_) {
        window.HEARTH_TERRAIN = null;
      }
    }
  }

  window.HEARTH_TERRAIN = Object.freeze({
    receipt,
    contract: CONTRACT,
    familyContract: FAMILY_CONTRACT,
    version: VERSION,
    standard: "planet-surface-area-multi-range-terrain",
    authority: "terrain-boundary-and-relief",
    visibleLandGuarantee: true,
    sampleVector,
    regions: () => GENERAL_REGIONS.slice(),
    summitLabels: () => SUMMIT_LABELS.slice()
  });

  window.__HEARTH_TERRAIN_BOUNDARY_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthTerrainLoaded = "true";
  document.documentElement.dataset.hearthTerrainContract = CONTRACT;
  document.documentElement.dataset.hearthTerrainFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthTerrainVersion = VERSION;
  document.documentElement.dataset.hearthTerrainStandard = "planet-surface-area-multi-range-terrain";
  document.documentElement.dataset.hearthTerrainSurfaceScale = "planet";
  document.documentElement.dataset.hearthTerrainVisibleLandGuarantee = "true";
})();
