// /assets/hearth/hearth.terrain.js
// HEARTH_G3_BOUNDARY_TERRAIN_VISIBILITY_RESTORE_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Restore visible land:true terrain samples.
// - Preserve four independently sized General Regions.
// - Preserve sixteen Countries.
// - Preserve nine progressive Summit regions per General Region.
// - Keep this file as boundary/cartographic authority only.
// - No mountains. No terrain-detail escalation. No rivers. No hydration ownership.
// - No climate, weather, clouds, humidity, atmospheric moisture, rainfall, wind, storms, or seasons.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_BOUNDARY_TERRAIN_VISIBILITY_RESTORE_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-boundary-terrain-visibility-restore";
  const RECEIPT = "HEARTH_G3_BOUNDARY_TERRAIN_VISIBILITY_RESTORE_RECEIPT";

  const TAU = Math.PI * 2;
  const LAND_THRESHOLD = 0.135;

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "Restore terrain authority only.",
    T2: "Guarantee visible land:true samples.",
    T3: "Preserve four independently sized General Regions.",
    T4: "Preserve sixteen Countries.",
    T5: "Preserve nine Summit regions per General Region.",
    T6: "Keep hydration passive and downstream.",
    T7: "Reject mountains, rivers, weather, climate, clouds, humidity.",
    T8: "Expose stable window.HEARTH_TERRAIN.",
    T9: "Return visible G3 boundary receipts."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.terrain.js",
    axis: "G3 visible landmass-family boundary authority",
    artifact: "Visible land:true terrain samples for 4 General Regions, 16 Countries, and 36 Summit regions.",
    attack: "Reject all-water fallback, late terrain failure, round blob drift, hydration reshaping, mountains, rivers, weather, climate, clouds, humidity."
  });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

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
      Math.sin(v[0] * 5.7 + v[1] * 3.1 + v[2] * 4.2 + seed) * 0.050 +
      Math.cos(v[0] * 8.3 - v[1] * 2.8 + v[2] * 6.1 + seed * 1.7) * 0.038 +
      Math.sin(v[0] * 13.1 + v[1] * 7.2 - v[2] * 4.7 + seed * 2.3) * 0.024
    );
  }

  function cap(v, center, radius, amplitude) {
    const d = dot3(v, center);
    const edge = Math.cos(radius);

    return smoothstep(edge, 1, d) * amplitude;
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
      size: [0.92, 0.62],
      color: [143, 116, 72],
      countryBase: 1,
      seed: 0.13,
      lobes: [
        [-104, 20, 0.56, 0.86],
        [-132, 36, 0.34, 0.42],
        [-82, 4, 0.31, 0.36],
        [-118, -12, 0.24, 0.20]
      ],
      cuts: [
        [-92, 38, 0.18, 0.20],
        [-145, 6, 0.16, 0.13]
      ]
    },
    {
      id: "GR02",
      name: "Rising South",
      centerLonLat: [-26, -28],
      size: [0.70, 0.78],
      color: [158, 126, 82],
      countryBase: 5,
      seed: 0.39,
      lobes: [
        [-26, -28, 0.52, 0.78],
        [-48, -8, 0.29, 0.35],
        [-4, -42, 0.28, 0.28],
        [-54, -50, 0.20, 0.16]
      ],
      cuts: [
        [-12, -4, 0.18, 0.16],
        [-48, -34, 0.13, 0.11]
      ]
    },
    {
      id: "GR03",
      name: "Middle Eastward",
      centerLonLat: [58, 18],
      size: [0.96, 0.58],
      color: [134, 126, 83],
      countryBase: 9,
      seed: 0.64,
      lobes: [
        [58, 18, 0.58, 0.84],
        [28, 32, 0.30, 0.28],
        [90, 30, 0.35, 0.36],
        [76, -6, 0.24, 0.18]
      ],
      cuts: [
        [42, -2, 0.20, 0.18],
        [106, 12, 0.16, 0.13]
      ]
    },
    {
      id: "GR04",
      name: "Summitward North",
      centerLonLat: [138, 43],
      size: [0.62, 0.52],
      color: [128, 126, 94],
      countryBase: 13,
      seed: 0.86,
      lobes: [
        [138, 43, 0.40, 0.66],
        [164, 52, 0.25, 0.28],
        [116, 31, 0.23, 0.22],
        [-176, 56, 0.18, 0.14]
      ],
      cuts: [
        [151, 28, 0.15, 0.12],
        [124, 55, 0.12, 0.08]
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
      summitLabels: SUMMIT_LABELS
    });
  });

  function regionField(v, region) {
    let field = -0.16;

    for (const lobe of region.lobes) {
      field += cap(v, lobe.center, lobe.radius, lobe.amplitude);
    }

    for (const cut of region.cuts) {
      field -= cap(v, cut.center, cut.radius, cut.amplitude);
    }

    const localX = dot3(v, region.basis.east) / region.size[0];
    const localY = dot3(v, region.basis.north) / region.size[1];

    const taper =
      0.08 *
      Math.sin((localX * 1.9 + localY * 0.7 + region.seed) * TAU) *
      smoothstep(1.20, 0.15, Math.hypot(localX, localY));

    field += wave3(v, region.seed * 10.0) + taper;

    return field;
  }

  function localize(v, region) {
    const rawX = dot3(v, region.basis.east) / region.size[0];
    const rawY = dot3(v, region.basis.north) / region.size[1];

    const warpX =
      Math.sin((rawY * 1.35 + region.seed) * TAU) * 0.030 +
      Math.cos((rawX * 2.10 + region.seed * 0.33) * TAU) * 0.018;

    const warpY =
      Math.cos((rawX * 1.20 + region.seed * 0.72) * TAU) * 0.028 +
      Math.sin((rawY * 2.20 + region.seed * 0.41) * TAU) * 0.016;

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
      const waterDepth = clamp((LAND_THRESHOLD - field) * 1.90, 0, 1);
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
      color: region.color,
      authority: "terrain-boundary-only"
    };
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
      authority: "terrain-boundary-only"
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "boundary-aligned-landmass-family",
      authority: "terrain-boundary-only",
      visibleLandGuarantee: true,
      generalRegions: GENERAL_REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        countries: region.countries,
        summitRegions: SUMMIT_LABELS,
        size: region.size
      })),
      totals: {
        generalRegions: 4,
        countries: 16,
        summitRegionsPerGeneralRegion: 9,
        totalSummitRegions: 36
      },
      owns: [
        "landmass-family boundary",
        "General Region assignment",
        "Country assignment",
        "Summit region assignment",
        "city-zone seat placeholders",
        "coast threshold"
      ],
      doesNotOwn: [
        "hydration expansion",
        "rivers",
        "mountains",
        "terrain detail",
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
    standard: "boundary-aligned-landmass-family",
    authority: "terrain-boundary-only",
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
  document.documentElement.dataset.hearthTerrainStandard = "boundary-aligned-landmass-family";
  document.documentElement.dataset.hearthTerrainVisibleLandGuarantee = "true";
})();
