// /assets/hearth/hearth.terrain.js
// HEARTH_G3_ORGANIC_SPIRAL_MOUNTAIN_RANGE_TERRAIN_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Remove X-style artificial terrain reads.
// - Remove dark gray terrain-outline emphasis.
// - Preserve country assignment as the only man-made boundary layer.
// - Render organic terrain through four spiral mountain ranges per General Region.
// - Each General Region follows:
//   organic land body -> escarpment edge -> plateau shelf -> four spiral mountain ranges -> central final mountain -> summit peak.
// - Preserve 4 General Regions, 16 Countries, and 9 Summit regions per General Region.
// - Hydration remains passive and downstream.
// - No rivers, lakes, weather, climate, clouds, humidity, rainfall, wind, storms, or atmospheric moisture.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_ORGANIC_SPIRAL_MOUNTAIN_RANGE_TERRAIN_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-09.hearth-g3-organic-spiral-mountain-range-terrain";
  const RECEIPT = "HEARTH_G3_ORGANIC_SPIRAL_MOUNTAIN_RANGE_TERRAIN_RECEIPT";

  const TAU = Math.PI * 2;
  const LAND_THRESHOLD = 0.105;

  const BOUNDARY_LAW = Object.freeze({
    organic: [
      "coastline",
      "landmass edge",
      "escarpment edge",
      "plateau shelf",
      "spiral mountain range",
      "central final mountain",
      "summit peak"
    ],
    manMade: [
      "country assignment only"
    ],
    rule:
      "Country assignment is the only man-made layer. Terrain must read as organic topography, not grid, X, panel, or dark artificial outline."
  });

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "One planet-scale terrain surface.",
    T2: "Four General Regions remain organic land bodies.",
    T3: "Sixteen Countries remain assignment data, not dark visual scars.",
    T4: "Nine Summit regions remain progression logic, not visible artificial cuts.",
    T5: "Each land body has one central final mountain.",
    T6: "Four spiral mountain ranges emit from each central mountain.",
    T7: "Plateaus sit at the escarpment edge.",
    T8: "Escarpments, plateaus, ranges, mountains, and summits remain organic.",
    T9: "Return terrain without X-lines or dark gray artificial outlines."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.terrain.js",
    axis: "organic terrain boundaries with country-only man-made assignment",
    artifact:
      "A planet-scale Hearth terrain field where each General Region has one central mountain and four organic spiral mountain ranges extending toward edge plateaus.",
    attack:
      "Reject X-shaped country grid scars, dark gray artificial outlines, man-made terrain cuts, random terrain, hydration reshaping, new regions, new countries, climate, weather, clouds, humidity, and open-ended surface expression."
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
      Math.sin(v[0] * 5.7 + v[1] * 3.1 + v[2] * 4.2 + seed) * 0.046 +
      Math.cos(v[0] * 8.3 - v[1] * 2.8 + v[2] * 6.1 + seed * 1.7) * 0.035 +
      Math.sin(v[0] * 13.1 + v[1] * 7.2 - v[2] * 4.7 + seed * 2.3) * 0.021
    );
  }

  function microSurface(localX, localY, seed) {
    return clamp(
      0.5 +
        Math.sin(localX * 18.0 + localY * 11.0 + seed) * 0.17 +
        Math.cos(localX * 23.0 - localY * 13.0 + seed * 0.71) * 0.11,
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
      master: [0.00, 0.02],
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
      master: [0.02, 0.00],
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
      master: [0.00, 0.04],
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
      ]
    }
  ];

  const SPIRAL_LANES = Object.freeze([
    {
      key: "N",
      name: "north",
      countryOffset: 0,
      angle: Math.PI / 2,
      curl: -0.54,
      plateauRadius: 0.74,
      edgeRadius: 0.88,
      width: 0.118,
      strength: 0.96
    },
    {
      key: "E",
      name: "east",
      countryOffset: 1,
      angle: 0,
      curl: 0.48,
      plateauRadius: 0.74,
      edgeRadius: 0.90,
      width: 0.110,
      strength: 0.84
    },
    {
      key: "S",
      name: "south",
      countryOffset: 2,
      angle: -Math.PI / 2,
      curl: -0.44,
      plateauRadius: 0.74,
      edgeRadius: 0.88,
      width: 0.112,
      strength: 0.88
    },
    {
      key: "W",
      name: "west",
      countryOffset: 3,
      angle: Math.PI,
      curl: 0.52,
      plateauRadius: 0.74,
      edgeRadius: 0.90,
      width: 0.104,
      strength: 0.78
    }
  ]);

  const GENERAL_REGIONS = GENERAL_REGION_SOURCE.map((region, index) => {
    const center = dirFromLonLat(region.centerLonLat[0], region.centerLonLat[1]);
    const masterMountainId = `${region.id}-FINAL-MOUNTAIN`;
    const summitId = `${region.id}-SUMMIT-PEAK`;

    return Object.freeze({
      ...region,
      index,
      center,
      basis: makeBasis(center),
      masterMountainId,
      summitId,
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
        strength: lane.key === "N" ? 0.76 : lane.key === "E" ? 0.70 : lane.key === "S" ? 0.72 : 0.66
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

    return {
      best,
      second,
      margin: best && second ? best.field - second.field : 1
    };
  }

  function spiralExpectedAngle(r, lane, region) {
    const t = smoothstep(0.04, 1.04, r);
    const wobble =
      Math.sin(t * TAU * 1.4 + region.seed * TAU + lane.countryOffset * 0.87) * 0.085 +
      Math.cos(t * TAU * 0.7 + region.seed * 3.1) * 0.040;

    return lane.angle + lane.curl * t + wobble;
  }

  function spiralRangeStrength(local, region, range) {
    const lane = range.lane;
    const r = Math.hypot(local.x, local.y);
    const theta = Math.atan2(local.y, local.x);
    const expected = spiralExpectedAngle(r, lane, region);
    const angularDistance = Math.abs(angleDelta(theta, expected));

    const width = lane.width + smoothstep(0.05, 0.85, r) * 0.030;
    const angularBand = 1 - smoothstep(width, width * 2.65, angularDistance);
    const radialBirth = smoothstep(0.055, 0.160, r);
    const radialEnd = 1 - smoothstep(0.96, 1.18, r);
    const brokenStone =
      0.82 + microSurface(local.x * 1.2, local.y * 1.2, region.seed * 33 + lane.countryOffset) * 0.22;

    return clamp(angularBand * radialBirth * radialEnd * lane.strength * brokenStone, 0, 1);
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

    return {
      range: best,
      rangeStrength: clamp(bestStrength, 0, 1)
    };
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

      const angularBand = 1 - smoothstep(0.16, 0.38, angularDistance);
      const radialBand = 1 - smoothstep(0.045, 0.145, radialDistance);
      const strength = angularBand * radialBand * plateau.strength;

      if (strength > bestStrength) {
        bestStrength = strength;
        best = plateau;
      }
    }

    return {
      plateau: best,
      plateauStrength: clamp(bestStrength, 0, 1)
    };
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

      const angularBand = 1 - smoothstep(0.18, 0.46, angularDistance);
      const radialBand = 1 - smoothstep(0.030, 0.120, radialDistance);
      const strength = angularBand * radialBand * 0.82;

      if (strength > bestStrength) {
        bestStrength = strength;
        best = escarpment;
      }
    }

    return {
      escarpment: best,
      escarpmentStrength: clamp(bestStrength, 0, 1)
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

    const rawBoundary = 1 - smoothstep(0.020, 0.180, secondDistance - bestDistance);
    const visibleCountryBoundary = rawBoundary * 0.035;

    return {
      countryId: region.countryBase + bestLane.countryOffset,
      countryIndex: bestLane.countryOffset,
      countryDirection: bestLane.name,
      countryBoundary: visibleCountryBoundary,
      manMadeBoundaryStrength: visibleCountryBoundary,
      administrativeBoundaryStrength: rawBoundary
    };
  }

  function terrainHierarchy(local, region, field) {
    const esc = nearestEscarpment(local, region);
    const plateau = nearestPlateau(local, region);
    const range = nearestSpiralRange(local, region);

    const r = Math.hypot(local.x, local.y);
    const centralMountainStrength = (1 - smoothstep(0.070, 0.335, r)) * 0.94;
    const summitStrength = (1 - smoothstep(0.016, 0.098, r)) * 1.0;

    const surfaceNoise = microSurface(local.x, local.y, region.seed * 19.0);
    const baseUpland = smoothstep(LAND_THRESHOLD + 0.045, LAND_THRESHOLD + 0.40, field);

    const escarpmentStrength = esc.escarpmentStrength;
    const plateauStrength = plateau.plateauStrength * (0.86 - centralMountainStrength * 0.16);
    const rangeAscent = range.rangeStrength;

    const ridge = clamp(rangeAscent * 0.82 + centralMountainStrength * 0.20 + surfaceNoise * 0.05, 0, 1);
    const upland = clamp(
      baseUpland * 0.28 +
        escarpmentStrength * 0.14 +
        plateauStrength * 0.22 +
        rangeAscent * 0.34 +
        centralMountainStrength * 0.30,
      0,
      1
    );

    const relief = clamp(
      escarpmentStrength * 0.18 +
        plateauStrength * 0.12 +
        rangeAscent * 0.44 +
        centralMountainStrength * 0.42 +
        summitStrength * 0.30 +
        surfaceNoise * 0.07,
      0,
      1
    );

    const lowland = clamp(
      (1 - upland) * smoothstep(LAND_THRESHOLD + 0.015, LAND_THRESHOLD + 0.22, field),
      0,
      1
    );

    const activePlateau = plateau.plateau && plateauStrength > 0.10 ? plateau.plateau : null;
    const activeRange = range.range && rangeAscent > 0.10 ? range.range : null;
    const activeEscarpment = esc.escarpment && escarpmentStrength > 0.10 ? esc.escarpment : null;

    const organicBoundaryStrength = clamp(
      escarpmentStrength * 0.22 +
        plateauStrength * 0.18 +
        rangeAscent * 0.42 +
        centralMountainStrength * 0.12 +
        summitStrength * 0.06,
      0,
      1
    );

    return {
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
      surfaceNoise
    };
  }

  function terrainColor(region, terrain) {
    let [r, g, b] = region.color;

    r = mix(r, 96, terrain.lowland * 0.12);
    g = mix(g, 132, terrain.lowland * 0.15);
    b = mix(b, 84, terrain.lowland * 0.10);

    r = mix(r, 144, terrain.escarpmentStrength * 0.14);
    g = mix(g, 126, terrain.escarpmentStrength * 0.12);
    b = mix(b, 92, terrain.escarpmentStrength * 0.09);

    r = mix(r, 176, terrain.plateauStrength * 0.20);
    g = mix(g, 156, terrain.plateauStrength * 0.18);
    b = mix(b, 110, terrain.plateauStrength * 0.14);

    r = mix(r, 88, terrain.rangeAscent * 0.24);
    g = mix(g, 92, terrain.rangeAscent * 0.22);
    b = mix(b, 82, terrain.rangeAscent * 0.16);

    r = mix(r, 206, terrain.rangeAscent * 0.20);
    g = mix(g, 192, terrain.rangeAscent * 0.16);
    b = mix(b, 152, terrain.rangeAscent * 0.12);

    r = mix(r, 76, terrain.relief * 0.17);
    g = mix(g, 74, terrain.relief * 0.15);
    b = mix(b, 70, terrain.relief * 0.13);

    r = mix(r, 222, terrain.centralMountainStrength * 0.27);
    g = mix(g, 210, terrain.centralMountainStrength * 0.24);
    b = mix(b, 178, terrain.centralMountainStrength * 0.18);

    r = mix(r, 244, terrain.summitStrength * 0.36);
    g = mix(g, 236, terrain.summitStrength * 0.32);
    b = mix(b, 212, terrain.summitStrength * 0.26);

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

      escarpmentId: null,
      escarpmentDirection: null,
      escarpmentStrength: 0,

      plateauId: null,
      plateauDirection: null,
      plateauStrength: 0,

      mountainRangeId: null,
      spiralRangeId: null,
      rangeCorridorId: null,
      rangeDirection: null,
      rangeAscent: 0,

      centralMountainId: null,
      centralMountainStrength: 0,
      masterMountainId: null,
      masterMountainStrength: 0,

      summitId: null,
      summitStrength: 0,

      metroplexId: null,
      metroplexSeat: null,

      relief: 0,
      ridge: 0,
      upland: 0,
      lowland: 0,
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      admissibleTerrain: true,
      boundaryLaw: BOUNDARY_LAW,
      authority: "terrain-organic-spiral-mountain-range"
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
    const r = Math.hypot(local.x, local.y);
    const country = countryAssignment(local, region);

    const summitProgress = clamp((1 - clamp(r / 0.92, 0, 1)) * 0.72 + (country.countryIndex / 4) * 0.28, 0, 0.999999);
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

    const hierarchy = terrainHierarchy(local, region, field);
    const color = terrainColor(region, hierarchy);

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
      organicBoundaryType: "terrain",

      citySeat,
      localU: clamp((local.rawX + 1) * 0.5, 0, 1),
      localV: clamp((local.rawY + 1) * 0.5, 0, 1),
      color,

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
      surfaceNoise: hierarchy.surfaceNoise,
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      admissibleTerrain: true,
      boundaryLaw: BOUNDARY_LAW,
      authority: "terrain-organic-spiral-mountain-range"
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "organic-spiral-mountain-range-terrain",
      authority: "terrain-organic-spiral-mountain-range",
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      visibleLandGuarantee: true,
      boundaryLaw: BOUNDARY_LAW,
      admissibilityRule:
        "Every escarpment, plateau, spiral mountain range, central mountain, summit, and metroplex seat belongs to an existing General Region and Country. Only country assignment is man-made.",
      terrainThesis:
        "organic land body -> organic escarpment -> organic plateau shelf -> four spiral mountain ranges -> organic central mountain -> organic summit peak; countries remain assignment data, not dark surface scars.",
      generalRegions: GENERAL_REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        countries: region.countries,
        summitRegions: SUMMIT_LABELS,
        size: region.size,
        centralMountainId: region.masterMountainId,
        summitId: region.summitId,
        spiralMountainRanges: region.spiralRanges.map((range) => ({
          id: range.id,
          direction: range.direction,
          countryId: range.countryId,
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
        summitRegionsPerGeneralRegion: 9,
        totalSummitRegions: 36,
        spiralMountainRanges: 16,
        escarpmentEdges: 16,
        plateaus: 16,
        centralMountains: 4,
        summitPeaks: 4,
        metroplexSeats: 16
      },
      owns: [
        "organic landmass-family boundary",
        "country-only man-made assignment",
        "General Region assignment",
        "Country assignment",
        "Summit progression assignment",
        "organic escarpment edges",
        "organic plateaus at escarpment edge",
        "four organic spiral mountain ranges per region",
        "organic central final mountains",
        "organic summit peaks",
        "metroplex seats",
        "relief",
        "ridge",
        "upland",
        "lowland",
        "planet surface-area terrain scale"
      ],
      doesNotOwn: [
        "X-shaped artificial terrain lines",
        "dark gray artificial terrain outlines",
        "man-made terrain boundaries outside country assignment",
        "hydration expansion",
        "rivers",
        "lakes",
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
    standard: "organic-spiral-mountain-range-terrain",
    authority: "terrain-organic-spiral-mountain-range",
    visibleLandGuarantee: true,
    boundaryLaw: BOUNDARY_LAW,
    sampleVector,
    regions: () => GENERAL_REGIONS.slice(),
    summitLabels: () => SUMMIT_LABELS.slice()
  });

  window.__HEARTH_TERRAIN_BOUNDARY_DISPOSE__ = dispose;

  document.documentElement.dataset.hearthTerrainLoaded = "true";
  document.documentElement.dataset.hearthTerrainContract = CONTRACT;
  document.documentElement.dataset.hearthTerrainFamilyContract = FAMILY_CONTRACT;
  document.documentElement.dataset.hearthTerrainVersion = VERSION;
  document.documentElement.dataset.hearthTerrainStandard = "organic-spiral-mountain-range-terrain";
  document.documentElement.dataset.hearthTerrainSurfaceScale = "planet";
  document.documentElement.dataset.hearthTerrainVisibleLandGuarantee = "true";
  document.documentElement.dataset.hearthTerrainOrganicBoundaries = "true";
  document.documentElement.dataset.hearthTerrainManMadeBoundaries = "country-assignment-only";
  document.documentElement.dataset.hearthTerrainNoXLines = "true";
  document.documentElement.dataset.hearthTerrainNoDarkArtificialOutlines = "true";
  document.documentElement.dataset.hearthTerrainSpiralMountainRanges = "16";
  document.documentElement.dataset.hearthTerrainRangesPerRegion = "4";
  document.documentElement.dataset.hearthTerrainEscarpmentEdges = "16";
  document.documentElement.dataset.hearthTerrainPlateaus = "16";
  document.documentElement.dataset.hearthTerrainCentralMountains = "4";
  document.documentElement.dataset.hearthTerrainSummitPeaks = "4";
  document.documentElement.dataset.hearthTerrainMetroplexSeats = "16";
})();
