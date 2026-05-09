// /assets/hearth/hearth.terrain.js
// HEARTH_G3_CLIMATE_SHAPED_COASTAL_LANDFORM_TERRAIN_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Execute Hearth G3 climate-shaped terrain foundation.
// - Terrain owns rigid landmass borders, cliffs, stronger peninsulas, carved bays, escarpments, plateaus, valleys, mountains, and summit pressure.
// - Beaches/sand remain excluded for a later beach/coastal engine.
// - Islands remain excluded for /assets/hearth/hearth.islands.js.
// - Hydration remains passive.
// - No active weather, climate engine, clouds, humidity, rivers, lakes, or generated images.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_CLIMATE_SHAPED_COASTAL_LANDFORM_TERRAIN_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-09.hearth-g3-climate-shaped-coastal-landform-terrain";
  const RECEIPT = "HEARTH_G3_CLIMATE_SHAPED_COASTAL_LANDFORM_TERRAIN_RECEIPT";

  const TAU = Math.PI * 2;
  const LAND_THRESHOLD = 0.108;
  const PLANET_AGE_FACTOR = 4;
  const ROCK_FACTOR = 4;
  const MOUNTAIN_HEIGHT_FACTOR = 4;

  const LANDFORM_CATEGORIES = Object.freeze(["hill", "mountain", "cliff", "valley"]);

  const DIRECTION_PRECEDENCE = Object.freeze({
    north: { rank: 4, rockyMultiplier: 1.0, heightMultiplier: 1.0, cliffMultiplier: 1.0 },
    south: { rank: 3, rockyMultiplier: 0.82, heightMultiplier: 0.86, cliffMultiplier: 0.82 },
    east: { rank: 2, rockyMultiplier: 0.64, heightMultiplier: 0.72, cliffMultiplier: 0.66 },
    west: { rank: 1, rockyMultiplier: 0.46, heightMultiplier: 0.58, cliffMultiplier: 0.48 }
  });

  const BOUNDARY_LAW = Object.freeze({
    organic: [
      "rigid landmass border",
      "cliff coast",
      "bay",
      "inlet",
      "attached peninsula",
      "coastal escarpment",
      "plateau shelf",
      "spiral mountain range",
      "natural basin",
      "ring mountain",
      "central mountain",
      "summit peak",
      "hill field",
      "mountain field",
      "cliff field",
      "valley field"
    ],
    manMade: ["country assignment only"],
    excludedFromTerrain: [
      "detached islands",
      "beaches",
      "sand systems",
      "active weather",
      "clouds",
      "humidity",
      "rivers",
      "lakes"
    ],
    rule:
      "Terrain expresses climate-shaped land without owning active climate/weather. Beaches and sand remain future beach/coastal authority."
  });

  const GEOMETRY_256 = Object.freeze({
    formula: "16 countries x 16 landform seats per country = 256",
    countries: 16,
    seatsPerCountry: 16,
    totalLandformSeats: 256,
    categories: LANDFORM_CATEGORIES,
    directionPrecedence: "north-south-east-west"
  });

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "One planet-scale terrain surface.",
    T2: "Four General Regions remain organic land bodies.",
    T3: "Sixteen Countries remain the only man-made assignment layer.",
    T4: "Each Country receives sixteen landform seats.",
    T5: "Rigid borders and bays are terrain-owned coastline geometry.",
    T6: "Cliffs, peninsulas, valleys, hills, mountains, and summit pressure remain terrain-owned.",
    T7: "Beaches and sand remain excluded.",
    T8: "Hydration remains passive and downstream.",
    T9: "Return G3 climate-shaped terrain receipt."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.terrain.js",
    axis: "rigid coast -> bays / peninsulas -> cliffs -> valleys / ranges -> central mountain -> summit",
    artifact:
      "A G3 Hearth terrain field with climate-shaped landforms, rigid borders, stronger peninsulas, carved bays, cliff coasts, valleys, hills, mountains, and summit pressure.",
    attack:
      "Reject smooth blob land, soft rounded borders, beach logic inside terrain, island logic inside terrain, active weather, clouds, humidity, rivers, lakes, generated images, and graphic blocks."
  });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
  const mix = (a, b, t) => Math.round(lerp(a, b, t));

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
    return [cl * Math.sin(lon), Math.sin(lat), cl * Math.cos(lon)];
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

  function angleDelta(a, b) {
    return Math.atan2(Math.sin(a - b), Math.cos(a - b));
  }

  function wave3(v, seed) {
    return (
      Math.sin(v[0] * 5.7 + v[1] * 3.1 + v[2] * 4.2 + seed) * 0.052 +
      Math.cos(v[0] * 8.3 - v[1] * 2.8 + v[2] * 6.1 + seed * 1.7) * 0.042 +
      Math.sin(v[0] * 13.1 + v[1] * 7.2 - v[2] * 4.7 + seed * 2.3) * 0.028
    );
  }

  function microSurface(x, y, seed) {
    return clamp(
      0.5 +
        Math.sin(x * 23.0 + y * 17.0 + seed) * 0.2 +
        Math.cos(x * 31.0 - y * 19.0 + seed * 0.71) * 0.15 +
        Math.sin(x * 43.0 + y * 29.0 + seed * 1.31) * 0.08,
      0,
      1
    );
  }

  function cap(v, center, radius, amplitude) {
    const d = dot3(v, center);
    const edge = Math.cos(radius);
    return smoothstep(edge, 1, d) * amplitude;
  }

  function pointDistance(px, py, cx, cy) {
    return Math.hypot(px - cx, py - cy);
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
      master: [0.0, 0.02],
      exteriorProfile: "broad-weathered-escarpment",
      basin: { id: "GR01-BASIN-WEST-CROWN", x: -0.28, y: 0.18, radius: 0.245, ringRadius: 0.335, strength: 0.72 },
      peninsulaBias: [0.18, -0.08, 0.34, -0.22],
      bayBias: [-0.38, 0.24, 0.44, -0.16],
      lobes: [
        [-104, 20, 0.62, 0.88],
        [-136, 38, 0.36, 0.4],
        [-78, 8, 0.35, 0.38],
        [-122, -18, 0.28, 0.23],
        [-154, -6, 0.2, 0.15]
      ],
      cuts: [
        [-92, 39, 0.19, 0.18],
        [-146, 8, 0.16, 0.11],
        [-67, 29, 0.13, 0.1]
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
      master: [-0.03, -0.02],
      exteriorProfile: "steep-southern-rim",
      basin: { id: "GR02-BASIN-SOUTH-BOWL", x: 0.2, y: -0.3, radius: 0.215, ringRadius: 0.305, strength: 0.62 },
      peninsulaBias: [-0.1, 0.24, -0.18, 0.3],
      bayBias: [0.26, -0.34, 0.1, -0.46],
      lobes: [
        [-26, -28, 0.58, 0.8],
        [-50, -8, 0.32, 0.35],
        [-4, -44, 0.32, 0.3],
        [-58, -52, 0.22, 0.17],
        [4, -14, 0.21, 0.15]
      ],
      cuts: [
        [-12, -4, 0.18, 0.14],
        [-49, -34, 0.13, 0.1],
        [-8, -61, 0.12, 0.08]
      ]
    },
    {
      id: "GR03",
      name: "Middle Eastward",
      centerLonLat: [58, 18],
      size: [1.0, 0.62],
      color: [133, 125, 82],
      countryBase: 9,
      seed: 0.64,
      master: [0.02, 0.0],
      exteriorProfile: "broken-coastal-plateau",
      basin: { id: "GR03-BASIN-EAST-RING", x: 0.34, y: 0.18, radius: 0.235, ringRadius: 0.325, strength: 0.68 },
      peninsulaBias: [0.28, 0.18, -0.12, -0.26],
      bayBias: [-0.22, 0.36, -0.4, 0.18],
      lobes: [
        [58, 18, 0.64, 0.86],
        [26, 34, 0.34, 0.29],
        [92, 31, 0.38, 0.38],
        [78, -8, 0.27, 0.21],
        [116, 4, 0.23, 0.16]
      ],
      cuts: [
        [42, -2, 0.2, 0.16],
        [108, 12, 0.17, 0.12],
        [34, 52, 0.12, 0.08]
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
      master: [0.0, 0.04],
      exteriorProfile: "high-northern-craton-rim",
      basin: null,
      peninsulaBias: [-0.18, 0.26, 0.12, -0.2],
      bayBias: [0.34, -0.26, 0.18, -0.32],
      lobes: [
        [138, 43, 0.44, 0.68],
        [164, 52, 0.27, 0.28],
        [116, 31, 0.26, 0.24],
        [-176, 56, 0.22, 0.16],
        [148, 22, 0.18, 0.11]
      ],
      cuts: [
        [151, 28, 0.15, 0.1],
        [124, 55, 0.12, 0.08],
        [174, 40, 0.11, 0.07]
      ]
    }
  ];

  const SPIRAL_LANES = Object.freeze([
    { key: "N", name: "north", countryOffset: 0, angle: Math.PI / 2, curl: -0.62, plateauRadius: 0.74, edgeRadius: 0.88, width: 0.126 },
    { key: "S", name: "south", countryOffset: 2, angle: -Math.PI / 2, curl: -0.5, plateauRadius: 0.74, edgeRadius: 0.88, width: 0.116 },
    { key: "E", name: "east", countryOffset: 1, angle: 0, curl: 0.44, plateauRadius: 0.74, edgeRadius: 0.9, width: 0.108 },
    { key: "W", name: "west", countryOffset: 3, angle: Math.PI, curl: 0.38, plateauRadius: 0.74, edgeRadius: 0.9, width: 0.098 }
  ].map((lane) => ({
    ...lane,
    precedence: DIRECTION_PRECEDENCE[lane.name],
    strength: DIRECTION_PRECEDENCE[lane.name].rockyMultiplier
  })));

  const GENERAL_REGIONS = GENERAL_REGION_SOURCE.map((region, index) => {
    const center = dirFromLonLat(region.centerLonLat[0], region.centerLonLat[1]);

    return Object.freeze({
      ...region,
      index,
      center,
      basis: makeBasis(center),
      masterMountainId: `${region.id}-FINAL-MOUNTAIN`,
      summitId: `${region.id}-SUMMIT-PEAK`,
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
      spiralRanges: SPIRAL_LANES.map((lane) => ({
        id: `${region.id}-SPIRAL-RANGE-${lane.key}`,
        direction: lane.name,
        countryId: region.countryBase + lane.countryOffset,
        lane
      })),
      escarpments: SPIRAL_LANES.map((lane) => ({
        id: `${region.id}-ESCARPMENT-${lane.key}`,
        direction: lane.name,
        countryId: region.countryBase + lane.countryOffset,
        lane
      })),
      plateaus: SPIRAL_LANES.map((lane) => ({
        id: `${region.id}-PLATEAU-${lane.key}`,
        direction: lane.name,
        countryId: region.countryBase + lane.countryOffset,
        metroplexId: `${region.id}-METROPLEX-${lane.key}`,
        lane,
        radius: lane.plateauRadius,
        strength: 0.48 + lane.precedence.rockyMultiplier * 0.28
      }))
    });
  });

  function regionField(v, region) {
    let field = -0.125;

    for (const lobe of region.lobes) field += cap(v, lobe.center, lobe.radius, lobe.amplitude);
    for (const cut of region.cuts) field -= cap(v, cut.center, cut.radius, cut.amplitude);

    const localX = dot3(v, region.basis.east) / region.size[0];
    const localY = dot3(v, region.basis.north) / region.size[1];

    const coastJag =
      Math.sin((localX * 4.6 + region.seed) * TAU) * 0.025 +
      Math.cos((localY * 5.2 + region.seed * 0.7) * TAU) * 0.022 +
      Math.sin((localX * 9.1 - localY * 6.4 + region.seed * 1.3) * TAU) * 0.013;

    const taper =
      0.075 *
      Math.sin((localX * 1.9 + localY * 0.7 + region.seed) * TAU) *
      smoothstep(1.32, 0.18, Math.hypot(localX, localY));

    field += wave3(v, region.seed * 10.0) + taper + coastJag;
    return field;
  }

  function localize(v, region) {
    const rawX = dot3(v, region.basis.east) / region.size[0];
    const rawY = dot3(v, region.basis.north) / region.size[1];

    const warpX =
      Math.sin((rawY * 1.35 + region.seed) * TAU) * 0.028 +
      Math.cos((rawX * 2.1 + region.seed * 0.33) * TAU) * 0.018;

    const warpY =
      Math.cos((rawX * 1.2 + region.seed * 0.72) * TAU) * 0.026 +
      Math.sin((rawY * 2.2 + region.seed * 0.41) * TAU) * 0.016;

    return {
      x: rawX + warpX - region.master[0],
      y: rawY + warpY - region.master[1],
      rawX: rawX + warpX,
      rawY: rawY + warpY
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

    return { best, second, margin: best && second ? best.field - second.field : 1 };
  }

  function spiralExpectedAngle(r, lane, region) {
    const t = smoothstep(0.04, 1.04, r);
    const wobble =
      Math.sin(t * TAU * 1.4 + region.seed * TAU + lane.countryOffset * 0.87) * 0.095 +
      Math.cos(t * TAU * 0.7 + region.seed * 3.1) * 0.052;
    return lane.angle + lane.curl * t + wobble;
  }

  function spiralRangeStrength(local, region, range) {
    const lane = range.lane;
    const r = Math.hypot(local.x, local.y);
    const theta = Math.atan2(local.y, local.x);
    const expected = spiralExpectedAngle(r, lane, region);
    const angularDistance = Math.abs(angleDelta(theta, expected));

    const width = lane.width + smoothstep(0.05, 0.85, r) * 0.034;
    const angularBand = 1 - smoothstep(width, width * 2.65, angularDistance);
    const radialBirth = smoothstep(0.055, 0.16, r);
    const radialEnd = 1 - smoothstep(0.96, 1.18, r);
    const brokenStone =
      0.72 + microSurface(local.x * 1.6, local.y * 1.6, region.seed * 33 + lane.countryOffset) * 0.44;

    return clamp(
      angularBand *
        radialBirth *
        radialEnd *
        lane.precedence.rockyMultiplier *
        brokenStone *
        (ROCK_FACTOR / 2.6),
      0,
      1.35
    );
  }

  function nearestSpiralRange(local, region) {
    let best = null;
    let bestStrength = 0;

    for (const range of region.spiralRanges) {
      const strength = spiralRangeStrength(local, region, range);
      if (strength > bestStrength) {
        bestStrength = strength;
        best = range;
      }
    }

    return { range: best, rangeStrength: clamp(bestStrength, 0, 1.35) };
  }

  function nearestPlateau(local, region) {
    const r = Math.hypot(local.x, local.y);
    const theta = Math.atan2(local.y, local.x);
    let best = null;
    let bestStrength = 0;

    for (const plateau of region.plateaus) {
      const lane = plateau.lane;
      const expected = spiralExpectedAngle(lane.plateauRadius, lane, region);
      const angularDistance = Math.abs(angleDelta(theta, expected));
      const radialDistance = Math.abs(r - lane.plateauRadius);
      const strength =
        (1 - smoothstep(0.16, 0.38, angularDistance)) *
        (1 - smoothstep(0.045, 0.145, radialDistance)) *
        plateau.strength;

      if (strength > bestStrength) {
        bestStrength = strength;
        best = plateau;
      }
    }

    return { plateau: best, plateauStrength: clamp(bestStrength, 0, 1) };
  }

  function nearestEscarpment(local, region) {
    const r = Math.hypot(local.x, local.y);
    const theta = Math.atan2(local.y, local.x);
    let best = null;
    let bestStrength = 0;

    for (const escarpment of region.escarpments) {
      const lane = escarpment.lane;
      const expected = spiralExpectedAngle(lane.edgeRadius, lane, region);
      const angularDistance = Math.abs(angleDelta(theta, expected));
      const radialDistance = Math.abs(r - lane.edgeRadius);
      const strength =
        (1 - smoothstep(0.18, 0.46, angularDistance)) *
        (1 - smoothstep(0.026, 0.122, radialDistance)) *
        (0.64 + lane.precedence.rockyMultiplier * 0.34);

      if (strength > bestStrength) {
        bestStrength = strength;
        best = escarpment;
      }
    }

    return { escarpment: best, escarpmentStrength: clamp(bestStrength, 0, 1.2) };
  }

  function basinSample(local, region) {
    if (!region.basin) {
      return {
        basinId: null,
        basinStrength: 0,
        depressionStrength: 0,
        ringMountainId: null,
        ringMountainStrength: 0,
        basinInteriorStrength: 0
      };
    }

    const b = region.basin;
    const d = pointDistance(local.rawX, local.rawY, b.x, b.y);
    const depressionStrength = (1 - smoothstep(b.radius * 0.52, b.radius, d)) * b.strength;
    const ringDistance = Math.abs(d - b.ringRadius);
    const ringMountainStrength = (1 - smoothstep(0.035, 0.115, ringDistance)) * b.strength * 1.12;
    const basinInteriorStrength = (1 - smoothstep(b.radius * 0.18, b.radius * 0.92, d)) * b.strength;
    const basinStrength = clamp(Math.max(depressionStrength, ringMountainStrength * 0.92), 0, 1);

    return {
      basinId: basinStrength > 0.08 ? b.id : null,
      basinStrength,
      depressionStrength,
      ringMountainId: ringMountainStrength > 0.1 ? `${b.id}-RING-MOUNTAIN` : null,
      ringMountainStrength,
      basinInteriorStrength
    };
  }

  function peninsulaSample(local, region) {
    const r = Math.hypot(local.x, local.y);
    const theta = Math.atan2(local.y, local.x);

    let bestStrength = 0;
    let bestId = null;
    let bestDirection = null;

    SPIRAL_LANES.forEach((lane, i) => {
      const bias = region.peninsulaBias[i] || 0;
      const expected = lane.angle + bias + Math.sin(region.seed * TAU + i) * 0.13;
      const angularDistance = Math.abs(angleDelta(theta, expected));
      const radialBand = 1 - smoothstep(0.70, 1.18, Math.abs(r - 0.96));
      const angularBand = 1 - smoothstep(0.095, 0.34, angularDistance);
      const taper = smoothstep(0.72, 0.96, r) * (1 - smoothstep(1.18, 1.38, r));
      const strength =
        angularBand *
        radialBand *
        taper *
        (0.44 + lane.precedence.rockyMultiplier * 0.34 + hash3(region.index + 5, i + 31, 88) * 0.2);

      if (strength > bestStrength) {
        bestStrength = strength;
        bestId = `${region.id}-PENINSULA-${lane.key}`;
        bestDirection = lane.name;
      }
    });

    return {
      peninsulaId: bestStrength > 0.09 ? bestId : null,
      peninsulaDirection: bestStrength > 0.09 ? bestDirection : null,
      peninsulaStrength: clamp(bestStrength, 0, 1.18),
      peninsulaBoundaryType: "organic"
    };
  }

  function baySample(local, region, coast) {
    const r = Math.hypot(local.x, local.y);
    const theta = Math.atan2(local.y, local.x);

    let bestStrength = 0;
    let bestId = null;
    let bestDirection = null;

    SPIRAL_LANES.forEach((lane, i) => {
      const bias = region.bayBias[i] || 0;
      const expected = lane.angle + bias + Math.cos(region.seed * TAU + i * 0.5) * 0.15;
      const angularDistance = Math.abs(angleDelta(theta, expected));
      const radialBand = 1 - smoothstep(0.045, 0.22, Math.abs(r - 0.88));
      const angularBand = 1 - smoothstep(0.085, 0.28, angularDistance);
      const carve = smoothstep(0.08, 0.72, coast);
      const strength =
        angularBand *
        radialBand *
        carve *
        (0.44 + lane.precedence.cliffMultiplier * 0.25 + hash3(region.index + 7, i + 61, 29) * 0.22);

      if (strength > bestStrength) {
        bestStrength = strength;
        bestId = `${region.id}-BAY-${lane.key}`;
        bestDirection = lane.name;
      }
    });

    return {
      bayId: bestStrength > 0.08 ? bestId : null,
      bayDirection: bestStrength > 0.08 ? bestDirection : null,
      bayStrength: clamp(bestStrength, 0, 1),
      inletStrength: clamp(bestStrength * 0.82, 0, 1),
      bayBoundaryType: "organic-carved-coast"
    };
  }

  function exteriorSample(local, region, coast, bay, peninsula) {
    const r = Math.hypot(local.x, local.y);
    const outer = smoothstep(0.60, 1.04, r);
    const escarped = smoothstep(0.07, 0.52, coast);

    const rigidBorderStrength = clamp(
      outer * 0.38 +
        escarped * 0.62 +
        bay.bayStrength * 0.24 +
        peninsula.peninsulaStrength * 0.18 +
        microSurface(local.rawX * 2.3, local.rawY * 2.3, region.seed * 91) * 0.16,
      0,
      1.35
    );

    const coastalFractureStrength = clamp(
      coast * 0.34 +
        rigidBorderStrength * 0.38 +
        bay.inletStrength * 0.28 +
        peninsula.peninsulaStrength * 0.18,
      0,
      1.35
    );

    return {
      exteriorProfile: region.exteriorProfile,
      exteriorStrength: clamp(Math.max(outer * 0.64, escarped * 0.94), 0, 1.2),
      exteriorSlope: clamp(outer * 0.82 + coast * 0.42, 0, 1.2),
      exteriorBoundaryType: "organic-climate-shaped",
      rigidBorderStrength,
      coastalFractureStrength
    };
  }

  function countryAssignment(local, region) {
    const theta = Math.atan2(local.y, local.x);
    let bestLane = SPIRAL_LANES[0];
    let bestDistance = Infinity;
    let secondDistance = Infinity;

    for (const lane of SPIRAL_LANES) {
      const d = Math.abs(angleDelta(theta, lane.angle));
      if (d < bestDistance) {
        secondDistance = bestDistance;
        bestDistance = d;
        bestLane = lane;
      } else if (d < secondDistance) {
        secondDistance = d;
      }
    }

    const rawBoundary = 1 - smoothstep(0.02, 0.18, secondDistance - bestDistance);
    const visibleCountryBoundary = rawBoundary * 0.025;

    return {
      countryId: region.countryBase + bestLane.countryOffset,
      countryIndex: bestLane.countryOffset,
      countryDirection: bestLane.name,
      countryBoundary: visibleCountryBoundary,
      manMadeBoundaryStrength: visibleCountryBoundary,
      administrativeBoundaryStrength: rawBoundary,
      rockyPrecedence: bestLane.precedence
    };
  }

  function terrainHierarchy(local, region, field, coast) {
    const esc = nearestEscarpment(local, region);
    const plateau = nearestPlateau(local, region);
    const range = nearestSpiralRange(local, region);
    const basin = basinSample(local, region);
    const peninsula = peninsulaSample(local, region);
    const bay = baySample(local, region, coast);
    const exterior = exteriorSample(local, region, coast, bay, peninsula);

    const r = Math.hypot(local.x, local.y);
    const centralMountainStrength = (1 - smoothstep(0.068, 0.35, r)) * 1.2;
    const summitStrength = (1 - smoothstep(0.015, 0.112, r)) * 1.26;

    const surfaceNoise = microSurface(local.x, local.y, region.seed * 19.0);
    const fractureNoise = microSurface(local.x * 1.9, local.y * 1.9, region.seed * 41.0);
    const baseUpland = smoothstep(LAND_THRESHOLD + 0.045, LAND_THRESHOLD + 0.40, field);

    const activeDirection = range.range ? range.range.direction : peninsula.peninsulaDirection || bay.bayDirection || "west";
    const precedence = DIRECTION_PRECEDENCE[activeDirection] || DIRECTION_PRECEDENCE.west;
    const rockBias = precedence.rockyMultiplier;

    const escarpmentStrength = esc.escarpmentStrength;
    const plateauStrength = plateau.plateauStrength * (0.86 - centralMountainStrength * 0.1);
    const rangeAscent = range.rangeStrength;

    const cliffStrength = clamp(
      escarpmentStrength * 0.34 +
        rangeAscent * 0.25 +
        centralMountainStrength * 0.22 +
        basin.ringMountainStrength * 0.20 +
        exterior.rigidBorderStrength * 0.34 +
        exterior.coastalFractureStrength * 0.32 +
        bay.bayStrength * 0.22 +
        fractureNoise * 0.16,
      0,
      1.55
    );

    const rockExposure = clamp(
      (rangeAscent * 0.36 +
        centralMountainStrength * 0.30 +
        escarpmentStrength * 0.18 +
        cliffStrength * 0.32 +
        basin.ringMountainStrength * 0.22 +
        exterior.exteriorSlope * 0.12 +
        fractureNoise * 0.20) *
        (0.72 + rockBias * 0.52),
      0,
      1.65
    );

    const ridge = clamp(
      rangeAscent * 0.86 +
        centralMountainStrength * 0.32 +
        basin.ringMountainStrength * 0.52 +
        cliffStrength * 0.24 +
        surfaceNoise * 0.06,
      0,
      1.55
    );

    const upland = clamp(
      baseUpland * 0.24 +
        exterior.exteriorSlope * 0.19 +
        escarpmentStrength * 0.18 +
        plateauStrength * 0.20 +
        rangeAscent * 0.36 +
        centralMountainStrength * 0.38 +
        basin.ringMountainStrength * 0.25 -
        basin.depressionStrength * 0.18 +
        peninsula.peninsulaStrength * 0.28 -
        bay.inletStrength * 0.18,
      0,
      1.4
    );

    const relief = clamp(
      exterior.exteriorSlope * 0.15 +
        exterior.coastalFractureStrength * 0.24 +
        escarpmentStrength * 0.19 +
        plateauStrength * 0.10 +
        rangeAscent * 0.48 +
        centralMountainStrength * 0.54 +
        summitStrength * 0.36 +
        basin.ringMountainStrength * 0.38 -
        basin.depressionStrength * 0.14 +
        rockExposure * 0.23 +
        surfaceNoise * 0.07,
      0,
      1.65
    );

    const rigidLandscapeStrength = clamp(
      rockExposure * 0.38 +
        cliffStrength * 0.34 +
        relief * 0.20 +
        ridge * 0.18 +
        exterior.rigidBorderStrength * 0.18,
      0,
      1.75
    );

    const lowland = clamp(
      (1 - clamp(upland, 0, 1)) * smoothstep(LAND_THRESHOLD + 0.015, LAND_THRESHOLD + 0.22, field) +
        basin.depressionStrength * 0.34 +
        bay.inletStrength * 0.16,
      0,
      1.25
    );

    const activePlateau = plateau.plateau && plateauStrength > 0.10 ? plateau.plateau : null;
    const activeRange = range.range && rangeAscent > 0.10 ? range.range : null;
    const activeEscarpment = esc.escarpment && escarpmentStrength > 0.10 ? esc.escarpment : null;

    const organicBoundaryStrength = clamp(
      exterior.exteriorStrength * 0.14 +
        exterior.rigidBorderStrength * 0.22 +
        exterior.coastalFractureStrength * 0.20 +
        escarpmentStrength * 0.16 +
        plateauStrength * 0.08 +
        rangeAscent * 0.28 +
        basin.ringMountainStrength * 0.24 +
        peninsula.peninsulaStrength * 0.20 +
        bay.bayStrength * 0.22 +
        centralMountainStrength * 0.07 +
        summitStrength * 0.04,
      0,
      1.55
    );

    return {
      ...exterior,
      ...basin,
      ...peninsula,
      ...bay,

      escarpmentId: activeEscarpment ? activeEscarpment.id : null,
      escarpmentDirection: activeEscarpment ? activeEscarpment.direction : null,
      escarpmentStrength,

      plateauId: activePlateau ? activePlateau.id : null,
      plateauDirection: activePlateau ? activePlateau.direction : null,
      plateauStrength,

      mountainRangeId: activeRange ? activeRange.id : null,
      spiralRangeId: activeRange ? activeRange.id : null,
      rangeCorridorId: activeRange ? activeRange.id : null,
      rangeDirection: activeRange ? activeRange.direction : null,
      rangeAscent,

      centralMountainId: region.masterMountainId,
      centralMountainStrength,
      masterMountainId: region.masterMountainId,
      masterMountainStrength: centralMountainStrength,

      summitId: summitStrength > 0.08 ? region.summitId : null,
      summitStrength,

      metroplexId: activePlateau && plateauStrength > 0.14 ? activePlateau.metroplexId : null,
      metroplexSeat:
        activePlateau && plateauStrength > 0.14
          ? {
              id: activePlateau.metroplexId,
              plateauId: activePlateau.id,
              escarpmentId: activeEscarpment ? activeEscarpment.id : null,
              countryId: activePlateau.countryId,
              direction: activePlateau.direction,
              admissible: true
            }
          : null,

      organicBoundaryStrength,
      relief,
      ridge,
      upland,
      lowland,
      rockExposure,
      cliffStrength,
      rigidLandscapeStrength,
      rockyDirection: activeDirection,
      rockyPrecedenceRank: precedence.rank,
      rockyMultiplier: precedence.rockyMultiplier,
      heightMultiplier: precedence.heightMultiplier,
      mountainHeightFactor: MOUNTAIN_HEIGHT_FACTOR,
      rockFactor: ROCK_FACTOR,
      planetAgeFactor: PLANET_AGE_FACTOR,
      surfaceNoise,
      fractureNoise
    };
  }

  function landformGeometry(local, country, terrain) {
    const radial = clamp(Math.hypot(local.x, local.y) / 1.08, 0, 0.999999);
    const radialBand = Math.floor(radial * 4);
    const directionBand = clamp(country.countryIndex, 0, 3);

    const hillStrength = clamp(
      terrain.plateauStrength * 0.30 +
        terrain.upland * 0.20 +
        (1 - terrain.rigidLandscapeStrength) * 0.15 +
        terrain.peninsulaStrength * 0.18 +
        (directionBand === 3 ? 0.12 : 0),
      0,
      1.1
    );

    const mountainStrength = clamp(
      terrain.centralMountainStrength * 0.34 +
        terrain.rangeAscent * 0.30 +
        terrain.ridge * 0.23 +
        terrain.summitStrength * 0.30 +
        (directionBand === 0 ? 0.14 : 0),
      0,
      1.45
    );

    const cliffStrength = clamp(
      terrain.cliffStrength * 0.48 +
        terrain.escarpmentStrength * 0.28 +
        terrain.ringMountainStrength * 0.18 +
        terrain.rockExposure * 0.24 +
        terrain.rigidBorderStrength * 0.34 +
        terrain.coastalFractureStrength * 0.28 +
        (directionBand === 0 ? 0.12 : 0),
      0,
      1.55
    );

    const valleyStrength = clamp(
      terrain.lowland * 0.30 +
        terrain.depressionStrength * 0.34 +
        terrain.basinInteriorStrength * 0.24 +
        terrain.bayStrength * 0.24 +
        terrain.inletStrength * 0.20 +
        (1 - terrain.upland) * 0.12 +
        (directionBand === 1 ? 0.08 : 0) +
        (directionBand === 3 ? 0.10 : 0),
      0,
      1.25
    );

    const ranked = [
      { category: "hill", strength: hillStrength, index: 0 },
      { category: "mountain", strength: mountainStrength, index: 1 },
      { category: "cliff", strength: cliffStrength, index: 2 },
      { category: "valley", strength: valleyStrength, index: 3 }
    ].sort((a, b) => b.strength - a.strength);

    const dominant = ranked[0];
    const landformSeat = radialBand * 4 + dominant.index + 1;
    const globalLandformSeat = (country.countryId - 1) * 16 + landformSeat;

    return {
      landformSeat,
      globalLandformSeat,
      landformRing: radialBand + 1,
      landformSpoke: dominant.index + 1,
      landformCategory: dominant.category,
      dominantLandform: dominant.category,
      hillStrength,
      mountainStrength,
      cliffStrength,
      valleyStrength,
      landformGeometry: "16-countries-x-16-seats",
      landformGeometryTotal: 256
    };
  }

  function terrainColor(region, terrain, landform) {
    let [r, g, b] = region.color;

    r = mix(r, 92, terrain.lowland * 0.14);
    g = mix(g, 126, terrain.lowland * 0.14);
    b = mix(b, 84, terrain.lowland * 0.10);

    r = mix(r, 102, terrain.exteriorStrength * 0.15);
    g = mix(g, 100, terrain.exteriorStrength * 0.13);
    b = mix(b, 80, terrain.exteriorStrength * 0.10);

    r = mix(r, 62, terrain.cliffStrength * 0.36);
    g = mix(g, 64, terrain.cliffStrength * 0.34);
    b = mix(b, 62, terrain.cliffStrength * 0.30);

    r = mix(r, 48, terrain.rigidBorderStrength * 0.28);
    g = mix(g, 52, terrain.rigidBorderStrength * 0.26);
    b = mix(b, 54, terrain.rigidBorderStrength * 0.23);

    r = mix(r, 64, terrain.rockExposure * 0.30);
    g = mix(g, 66, terrain.rockExposure * 0.28);
    b = mix(b, 64, terrain.rockExposure * 0.24);

    r = mix(r, 178, terrain.plateauStrength * 0.16);
    g = mix(g, 158, terrain.plateauStrength * 0.14);
    b = mix(b, 110, terrain.plateauStrength * 0.10);

    r = mix(r, 212, terrain.ridge * 0.18);
    g = mix(g, 198, terrain.ridge * 0.14);
    b = mix(b, 160, terrain.ridge * 0.10);

    r = mix(r, 66, terrain.depressionStrength * 0.16);
    g = mix(g, 88, terrain.depressionStrength * 0.16);
    b = mix(b, 72, terrain.depressionStrength * 0.12);

    r = mix(r, 72, terrain.bayStrength * 0.12);
    g = mix(g, 104, terrain.bayStrength * 0.14);
    b = mix(b, 86, terrain.bayStrength * 0.10);

    r = mix(r, 220, terrain.ringMountainStrength * 0.24);
    g = mix(g, 210, terrain.ringMountainStrength * 0.20);
    b = mix(b, 174, terrain.ringMountainStrength * 0.16);

    r = mix(r, 70, terrain.rigidLandscapeStrength * 0.18);
    g = mix(g, 68, terrain.rigidLandscapeStrength * 0.16);
    b = mix(b, 64, terrain.rigidLandscapeStrength * 0.14);

    r = mix(r, 232, terrain.centralMountainStrength * 0.30);
    g = mix(g, 222, terrain.centralMountainStrength * 0.26);
    b = mix(b, 188, terrain.centralMountainStrength * 0.20);

    r = mix(r, 248, terrain.summitStrength * 0.40);
    g = mix(g, 242, terrain.summitStrength * 0.36);
    b = mix(b, 222, terrain.summitStrength * 0.30);

    r = mix(r, 150, landform.hillStrength * 0.06);
    g = mix(g, 140, landform.hillStrength * 0.06);
    b = mix(b, 96, landform.hillStrength * 0.05);

    r = mix(r, 240, landform.mountainStrength * 0.09);
    g = mix(g, 230, landform.mountainStrength * 0.08);
    b = mix(b, 198, landform.mountainStrength * 0.06);

    r = mix(r, 42, landform.cliffStrength * 0.12);
    g = mix(g, 44, landform.cliffStrength * 0.10);
    b = mix(b, 44, landform.cliffStrength * 0.09);

    r = mix(r, 80, landform.valleyStrength * 0.08);
    g = mix(g, 112, landform.valleyStrength * 0.08);
    b = mix(b, 82, landform.valleyStrength * 0.06);

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
      countryDirection: null,
      summit: null,
      summitLabel: null,
      technologyRank: null,
      accessRank: null,
      coast: clamp(coast, 0, 1),
      shelf: clamp(shelf, 0, 1),
      waterDepth: clamp(waterDepth, 0, 1),
      regionBoundary: 0,
      countryBoundary: 0,
      countryBoundaryType: "man-made-assignment-only",
      manMadeBoundaryStrength: 0,
      administrativeBoundaryStrength: 0,
      summitBoundary: 0,
      organicBoundaryStrength: 0,
      organicBoundaryType: "water",
      citySeat: 0,
      localU: 0,
      localV: 0,
      color: null,
      rigidBorderStrength: 0,
      coastalFractureStrength: 0,
      bayId: null,
      bayDirection: null,
      bayStrength: 0,
      inletStrength: 0,
      peninsulaId: null,
      peninsulaDirection: null,
      peninsulaStrength: 0,
      cliffStrength: 0,
      hillStrength: 0,
      mountainStrength: 0,
      valleyStrength: 0,
      landformSeat: null,
      globalLandformSeat: null,
      landformRing: null,
      landformSpoke: null,
      landformCategory: null,
      dominantLandform: null,
      beachExcludedFromTerrain: true,
      sandExcludedFromTerrain: true,
      islandExcludedFromTerrain: true,
      activeWeatherExcluded: true,
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      admissibleTerrain: true,
      boundaryLaw: BOUNDARY_LAW,
      geometry256: GEOMETRY_256,
      authority: "terrain-g3-climate-shaped-coastal-landform"
    };
  }

  function sampleVector(vec) {
    const v = norm3(vec);
    const selected = bestRegion(v);

    if (!selected.best) return waterSample(null, 0, 1);

    const region = selected.best.region;
    const field = selected.best.field;
    const coast = 1 - smoothstep(0.012, 0.125, Math.abs(field - LAND_THRESHOLD));
    const land = field > LAND_THRESHOLD;

    if (!land) {
      const shelf = clamp(coast * 0.94, 0, 1);
      const waterDepth = clamp((LAND_THRESHOLD - field) * 1.75, 0, 1);
      return waterSample(region, shelf, waterDepth, coast);
    }

    const local = localize(v, region);
    const r = Math.hypot(local.x, local.y);
    const country = countryAssignment(local, region);

    const summitProgress = clamp(
      (1 - clamp(r / 0.92, 0, 1)) * 0.72 + (country.countryIndex / 4) * 0.28,
      0,
      0.999999
    );
    const summit = Math.floor(summitProgress * 9) + 1;

    const microX = Math.floor((local.rawX + 1) * 3.5);
    const microY = Math.floor((local.rawY + 1) * 3.0);
    const seatHash = hash3(microX + country.countryId * 11, microY + summit * 17, region.index + 1);
    const fu = (local.rawX + 1) * 3.5 - microX;
    const fq = (local.rawY + 1) * 3.0 - microY;

    const citySeat =
      seatHash > 0.78
        ? (1 - smoothstep(0.018, 0.046, Math.hypot(fu - 0.5, fq - 0.5))) * 0.58
        : 0;

    const hierarchy = terrainHierarchy(local, region, field, coast);
    const landform = landformGeometry(local, country, hierarchy);
    const color = terrainColor(region, hierarchy, landform);

    return {
      land: true,
      visibleLand: true,
      region: region.id,
      regionName: region.name,
      generalRegion: region,
      countryId: country.countryId,
      countryIndex: country.countryIndex,
      countryDirection: country.countryDirection,
      summit,
      summitLabel: SUMMIT_LABELS[summit - 1],
      summitProgress,
      technologyRank: summit,
      accessRank: 10 - summit,
      coast,
      shelf: 0,
      waterDepth: 0,
      field,
      regionBoundary: 0,
      countryBoundary: country.countryBoundary,
      countryBoundaryType: "man-made-assignment-only",
      manMadeBoundaryStrength: country.manMadeBoundaryStrength,
      administrativeBoundaryStrength: country.administrativeBoundaryStrength,
      summitBoundary: 0,
      organicBoundaryStrength: hierarchy.organicBoundaryStrength,
      organicBoundaryType: "climate-shaped-terrain",
      citySeat,
      localU: clamp((local.rawX + 1) * 0.5, 0, 1),
      localV: clamp((local.rawY + 1) * 0.5, 0, 1),
      color,

      exteriorProfile: hierarchy.exteriorProfile,
      exteriorStrength: hierarchy.exteriorStrength,
      exteriorSlope: hierarchy.exteriorSlope,
      exteriorBoundaryType: hierarchy.exteriorBoundaryType,
      rigidBorderStrength: hierarchy.rigidBorderStrength,
      coastalFractureStrength: hierarchy.coastalFractureStrength,

      bayId: hierarchy.bayId,
      bayDirection: hierarchy.bayDirection,
      bayStrength: hierarchy.bayStrength,
      inletStrength: hierarchy.inletStrength,
      bayBoundaryType: hierarchy.bayBoundaryType,

      basinId: hierarchy.basinId,
      basinStrength: hierarchy.basinStrength,
      depressionStrength: hierarchy.depressionStrength,
      ringMountainId: hierarchy.ringMountainId,
      ringMountainStrength: hierarchy.ringMountainStrength,
      basinInteriorStrength: hierarchy.basinInteriorStrength,

      peninsulaId: hierarchy.peninsulaId,
      peninsulaDirection: hierarchy.peninsulaDirection,
      peninsulaStrength: hierarchy.peninsulaStrength,

      escarpmentId: hierarchy.escarpmentId,
      escarpmentDirection: hierarchy.escarpmentDirection,
      escarpmentStrength: hierarchy.escarpmentStrength,

      plateauId: hierarchy.plateauId,
      plateauDirection: hierarchy.plateauDirection,
      plateauStrength: hierarchy.plateauStrength,

      mountainRangeId: hierarchy.mountainRangeId,
      spiralRangeId: hierarchy.spiralRangeId,
      rangeCorridorId: hierarchy.rangeCorridorId,
      rangeDirection: hierarchy.rangeDirection,
      rangeAscent: hierarchy.rangeAscent,

      centralMountainId: hierarchy.centralMountainId,
      centralMountainStrength: hierarchy.centralMountainStrength,
      masterMountainId: hierarchy.masterMountainId,
      masterMountainStrength: hierarchy.masterMountainStrength,

      summitId: hierarchy.summitId,
      summitStrength: hierarchy.summitStrength,

      metroplexId: hierarchy.metroplexId,
      metroplexSeat: hierarchy.metroplexSeat,

      relief: hierarchy.relief,
      ridge: hierarchy.ridge,
      upland: hierarchy.upland,
      lowland: hierarchy.lowland,
      rockExposure: hierarchy.rockExposure,
      cliffStrength: landform.cliffStrength,
      rigidLandscapeStrength: hierarchy.rigidLandscapeStrength,
      rockyDirection: hierarchy.rockyDirection,
      rockyPrecedenceRank: hierarchy.rockyPrecedenceRank,
      rockyMultiplier: hierarchy.rockyMultiplier,
      heightMultiplier: hierarchy.heightMultiplier,

      hillStrength: landform.hillStrength,
      mountainStrength: landform.mountainStrength,
      valleyStrength: landform.valleyStrength,
      landformSeat: landform.landformSeat,
      globalLandformSeat: landform.globalLandformSeat,
      landformRing: landform.landformRing,
      landformSpoke: landform.landformSpoke,
      landformCategory: landform.landformCategory,
      dominantLandform: landform.dominantLandform,
      landformGeometry: landform.landformGeometry,
      landformGeometryTotal: landform.landformGeometryTotal,

      mountainHeightFactor: MOUNTAIN_HEIGHT_FACTOR,
      rockFactor: ROCK_FACTOR,
      planetAgeFactor: PLANET_AGE_FACTOR,
      surfaceNoise: hierarchy.surfaceNoise,
      fractureNoise: hierarchy.fractureNoise,

      beachExcludedFromTerrain: true,
      sandExcludedFromTerrain: true,
      islandExcludedFromTerrain: true,
      activeWeatherExcluded: true,
      cloudsExcluded: true,
      humidityExcluded: true,

      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      admissibleTerrain: true,
      boundaryLaw: BOUNDARY_LAW,
      geometry256: GEOMETRY_256,
      authority: "terrain-g3-climate-shaped-coastal-landform"
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "climate-shaped-coastal-landform-terrain",
      authority: "terrain-g3-climate-shaped-coastal-landform",
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      visibleLandGuarantee: true,
      planetAgeFactor: PLANET_AGE_FACTOR,
      rockFactor: ROCK_FACTOR,
      mountainHeightFactor: MOUNTAIN_HEIGHT_FACTOR,
      landformCategories: LANDFORM_CATEGORIES,
      geometry256: GEOMETRY_256,
      directionalRockPrecedence: DIRECTION_PRECEDENCE,
      boundaryLaw: BOUNDARY_LAW,
      admissibilityRule:
        "Terrain owns climate-shaped landform geometry only. Beaches/sand, detached islands, active weather, clouds, humidity, rivers, and lakes remain excluded.",
      terrainThesis:
        "Rigid landmass border -> carved bay/inlet -> attached peninsula -> cliff coast -> escarpment -> plateau -> spiral range / basin ring -> central mountain -> summit peak.",
      generalRegions: GENERAL_REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        countries: region.countries,
        summitRegions: SUMMIT_LABELS,
        exteriorProfile: region.exteriorProfile,
        centralMountainId: region.masterMountainId,
        summitId: region.summitId,
        coastlineSystems: {
          rigidBorders: true,
          bays: true,
          inlets: true,
          peninsulas: true,
          cliffCoasts: true,
          boundaryType: "organic-climate-shaped"
        },
        basin: region.basin
          ? {
              id: region.basin.id,
              ringMountainId: `${region.basin.id}-RING-MOUNTAIN`,
              boundaryType: "organic"
            }
          : null,
        spiralMountainRanges: region.spiralRanges.map((range) => ({
          id: range.id,
          direction: range.direction,
          countryId: range.countryId,
          rockyPrecedenceRank: range.lane.precedence.rank,
          rockyMultiplier: range.lane.precedence.rockyMultiplier,
          boundaryType: "organic"
        })),
        escarpments: region.escarpments.map((escarpment) => ({
          id: escarpment.id,
          direction: escarpment.direction,
          countryId: escarpment.countryId,
          boundaryType: "organic"
        })),
        plateaus: region.plateaus.map((plateau) => ({
          id: plateau.id,
          direction: plateau.direction,
          countryId: plateau.countryId,
          metroplexId: plateau.metroplexId,
          boundaryType: "organic"
        }))
      })),
      totals: {
        generalRegions: 4,
        countries: 16,
        seatsPerCountry: 16,
        totalLandformSeats: 256,
        summitRegionsPerGeneralRegion: 9,
        totalSummitRegions: 36,
        rigidBorderSystems: 4,
        baySystems: 16,
        peninsulaSystems: 16,
        cliffCoastSystems: 16,
        exteriorProfiles: 4,
        naturalDepressionBasins: 3,
        ringMountainSystems: 3,
        spiralMountainRanges: 16,
        escarpmentEdges: 16,
        plateaus: 16,
        centralMountains: 4,
        summitPeaks: 4,
        metroplexSeats: 16,
        beachesOwnedHere: 0,
        sandsOwnedHere: 0,
        islandsOwnedHere: 0
      },
      owns: [
        "rigid landmass borders",
        "carved bays",
        "inlets",
        "attached peninsulas",
        "cliff coasts",
        "coastal fracture",
        "256 landform-category geometry",
        "hills",
        "mountains",
        "cliffs",
        "valleys",
        "rigid rocky land-body terrain",
        "organic exterior profiles",
        "natural depression basins",
        "organic ring mountains",
        "organic spiral mountain ranges",
        "organic escarpments",
        "organic plateaus",
        "central final mountains",
        "summit peaks",
        "country-only man-made assignment"
      ],
      doesNotOwn: [
        "detached island chains",
        "256 island seats",
        "beaches",
        "sand systems",
        "active weather",
        "clouds",
        "humidity",
        "atmospheric moisture",
        "rivers",
        "lakes",
        "generated images",
        "graphic blocks"
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
    standard: "climate-shaped-coastal-landform-terrain",
    authority: "terrain-g3-climate-shaped-coastal-landform",
    visibleLandGuarantee: true,
    boundaryLaw: BOUNDARY_LAW,
    geometry256: GEOMETRY_256,
    landformCategories: LANDFORM_CATEGORIES,
    directionPrecedence: DIRECTION_PRECEDENCE,
    sampleVector,
    regions: () => GENERAL_REGIONS.slice(),
    summitLabels: () => SUMMIT_LABELS.slice()
  });

  window.__HEARTH_TERRAIN_BOUNDARY_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthTerrainLoaded = "true";
  document.documentElement.dataset.hearthTerrainContract = CONTRACT;
  document.documentElement.dataset.hearthTerrainFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthTerrainVersion = VERSION;
  document.documentElement.dataset.hearthTerrainStandard = "climate-shaped-coastal-landform-terrain";
  document.documentElement.dataset.hearthTerrainSurfaceScale = "planet";
  document.documentElement.dataset.hearthTerrainVisibleLandGuarantee = "true";
  document.documentElement.dataset.hearthTerrainOrganicBoundaries = "true";
  document.documentElement.dataset.hearthTerrainManMadeBoundaries = "country-assignment-only";
  document.documentElement.dataset.hearthTerrainPlanetAgeFactor = String(PLANET_AGE_FACTOR);
  document.documentElement.dataset.hearthTerrainRockFactor = String(ROCK_FACTOR);
  document.documentElement.dataset.hearthTerrainMountainHeightFactor = String(MOUNTAIN_HEIGHT_FACTOR);
  document.documentElement.dataset.hearthTerrainRockPrecedence = "north-south-east-west";
  document.documentElement.dataset.hearthTerrainLandformCategories = "hills-mountains-cliffs-valleys";
  document.documentElement.dataset.hearthTerrainLandformGeometry = "16-countries-x-16-seats";
  document.documentElement.dataset.hearthTerrainLandformSeats = "256";
  document.documentElement.dataset.hearthTerrainRigidBorders = "true";
  document.documentElement.dataset.hearthTerrainBays = "true";
  document.documentElement.dataset.hearthTerrainInlets = "true";
  document.documentElement.dataset.hearthTerrainPeninsulas = "true";
  document.documentElement.dataset.hearthTerrainCliffCoasts = "true";
  document.documentElement.dataset.hearthTerrainBeachesExcluded = "true";
  document.documentElement.dataset.hearthTerrainSandExcluded = "true";
  document.documentElement.dataset.hearthTerrainIslandsExcluded = "true";
  document.documentElement.dataset.hearthTerrainActiveWeatherExcluded = "true";
})();
