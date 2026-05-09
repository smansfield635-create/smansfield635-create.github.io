// /assets/hearth/hearth.terrain.js
// HEARTH_G3_ESCARPMENT_PLATEAU_CENTRAL_SUMMIT_TERRAIN_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Build the admissible terrain thesis for every Hearth land body.
// - Each General Region follows:
//   edge / coast boundary -> escarpment edge -> plateau seat -> inward range ascent -> central/final mountain -> summit.
// - Preserve 4 General Regions, 16 Countries, and 9 Summit regions per General Region.
// - Plateaus sit at the escarpment edge and serve metroplex seats.
// - Ranges connect plateau lanes inward toward the central mountain.
// - Final mountain sits in the middle of each land body.
// - Summit sits at the top of the final mountain.
// - Hydration remains passive and downstream.
// - No rivers, lakes, weather, climate, clouds, humidity, rainfall, wind, storms, or atmospheric moisture.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_ESCARPMENT_PLATEAU_CENTRAL_SUMMIT_TERRAIN_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-escarpment-plateau-central-summit-terrain";
  const RECEIPT = "HEARTH_G3_ESCARPMENT_PLATEAU_CENTRAL_SUMMIT_TERRAIN_RECEIPT";

  const TAU = Math.PI * 2;
  const LAND_THRESHOLD = 0.105;

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "One planet-scale terrain surface.",
    T2: "Four General Regions remain active.",
    T3: "Each land body receives an escarpment edge.",
    T4: "Each escarpment edge receives four plateau seats.",
    T5: "Each plateau lane ascends inward through a range corridor.",
    T6: "Each land body has one central final mountain.",
    T7: "Each central final mountain has one summit peak.",
    T8: "Hydration remains passive and downstream.",
    T9: "Return admissible terrain receipt without G4 drift."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.terrain.js",
    axis: "edge escarpment -> plateau -> inward range -> central final mountain -> summit",
    artifact: "4 escarpment systems, 16 edge plateaus, 16 inward range corridors, 4 central mountains, 4 summit peaks.",
    attack: "Reject random terrain, random plateaus, one-off mountains, hydration reshaping, new regions, new countries, climate, weather, clouds, humidity, and open-ended surface expression."
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

  const CARDINAL_LANES = Object.freeze([
    {
      key: "N",
      name: "north",
      countryOffset: 0,
      edge: [0.00, 0.88],
      plateau: [0.00, 0.74],
      rangeEnd: [0.00, 0.74],
      width: 0.112,
      strength: 0.94
    },
    {
      key: "E",
      name: "east",
      countryOffset: 1,
      edge: [0.90, 0.02],
      plateau: [0.74, 0.02],
      rangeEnd: [0.74, 0.02],
      width: 0.104,
      strength: 0.80
    },
    {
      key: "S",
      name: "south",
      countryOffset: 2,
      edge: [0.02, -0.88],
      plateau: [0.02, -0.74],
      rangeEnd: [0.02, -0.74],
      width: 0.108,
      strength: 0.84
    },
    {
      key: "W",
      name: "west",
      countryOffset: 3,
      edge: [-0.90, 0.00],
      plateau: [-0.74, 0.00],
      rangeEnd: [-0.74, 0.00],
      width: 0.098,
      strength: 0.72
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
      escarpments: CARDINAL_LANES.map((lane) => ({
        id: `${region.id}-ESC-${lane.key}`,
        direction: lane.name,
        countryId: region.countryBase + lane.countryOffset,
        x: lane.edge[0],
        y: lane.edge[1],
        width: 0.125
      })),
      plateaus: CARDINAL_LANES.map((lane) => ({
        id: `${region.id}-PLATEAU-${lane.key}`,
        direction: lane.name,
        countryId: region.countryBase + lane.countryOffset,
        metroplexId: `${region.id}-METROPLEX-${lane.key}`,
        x: lane.plateau[0],
        y: lane.plateau[1],
        radiusX: lane.key === "E" || lane.key === "W" ? 0.18 : 0.24,
        radiusY: lane.key === "N" || lane.key === "S" ? 0.18 : 0.24,
        strength: lane.key === "N" ? 0.76 : lane.key === "E" ? 0.70 : lane.key === "S" ? 0.72 : 0.66
      })),
      ranges: CARDINAL_LANES.map((lane) => ({
        id: `${region.id}-ASCENT-RANGE-${lane.key}`,
        direction: lane.name,
        countryId: region.countryBase + lane.countryOffset,
        ax: lane.plateau[0],
        ay: lane.plateau[1],
        bx: region.master[0],
        by: region.master[1],
        width: lane.width,
        strength: lane.strength
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

  function nearestEscarpment(local, region) {
    let best = null;
    let bestStrength = 0;

    for (const escarpment of region.escarpments) {
      const d = pointDistance(local.x, local.y, escarpment.x, escarpment.y);
      const strength = (1 - smoothstep(escarpment.width, escarpment.width * 2.35, d)) * 0.86;

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

  function nearestPlateau(local, region) {
    let best = null;
    let bestStrength = 0;

    for (const plateau of region.plateaus) {
      const dx = (local.x - plateau.x) / (plateau.radiusX || 0.18);
      const dy = (local.y - plateau.y) / (plateau.radiusY || 0.18);
      const d = Math.hypot(dx, dy);
      const strength = (1 - smoothstep(0.74, 1.52, d)) * plateau.strength;

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

  function nearestRange(local, region) {
    let best = null;
    let bestStrength = 0;

    for (const range of region.ranges) {
      const d = segmentDistance(local.x, local.y, range.ax, range.ay, range.bx, range.by);
      const strength = (1 - smoothstep(range.width, range.width * 2.85, d)) * range.strength;

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

  function terrainHierarchy(local, region, field) {
    const esc = nearestEscarpment(local, region);
    const plateau = nearestPlateau(local, region);
    const range = nearestRange(local, region);

    const masterDistance = pointDistance(local.x, local.y, region.master[0], region.master[1]);
    const centralMountainStrength = (1 - smoothstep(0.085, 0.340, masterDistance)) * 0.94;
    const summitStrength = (1 - smoothstep(0.020, 0.105, masterDistance)) * 1.0;

    const surfaceNoise = microSurface(local.x, local.y, region.seed * 19.0);
    const baseUpland = smoothstep(LAND_THRESHOLD + 0.045, LAND_THRESHOLD + 0.40, field);

    const escarpmentStrength = esc.escarpmentStrength;
    const plateauStrength = plateau.plateauStrength * (0.86 - centralMountainStrength * 0.16);
    const rangeAscent = range.rangeStrength;
    const ridge = clamp(rangeAscent * 0.68 + centralMountainStrength * 0.34 + surfaceNoise * 0.06, 0, 1);
    const upland = clamp(
      baseUpland * 0.30 +
      escarpmentStrength * 0.18 +
      plateauStrength * 0.26 +
      rangeAscent * 0.22 +
      centralMountainStrength * 0.30,
      0,
      1
    );
    const relief = clamp(
      escarpmentStrength * 0.24 +
      rangeAscent * 0.36 +
      centralMountainStrength * 0.42 +
      summitStrength * 0.30 +
      surfaceNoise * 0.08,
      0,
      1
    );
    const lowland = clamp((1 - upland) * smoothstep(LAND_THRESHOLD + 0.015, LAND_THRESHOLD + 0.22, field), 0, 1);

    const activePlateau = plateau.plateau && plateauStrength > 0.10 ? plateau.plateau : null;
    const activeRange = range.range && rangeAscent > 0.10 ? range.range : null;
    const activeEscarpment = esc.escarpment && escarpmentStrength > 0.10 ? esc.escarpment : null;

    return {
      escarpmentId: activeEscarpment ? activeEscarpment.id : null,
      escarpmentDirection: activeEscarpment ? activeEscarpment.direction : null,
      escarpmentStrength,

      plateauId: activePlateau ? activePlateau.id : null,
      plateauDirection: activePlateau ? activePlateau.direction : null,
      plateauStrength,

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
      metroplexSeat: activePlateau && plateauStrength > 0.14
        ? {
            id: activePlateau.metroplexId,
            plateauId: activePlateau.id,
            escarpmentId: activeEscarpment ? activeEscarpment.id : null,
            countryId: activePlateau.countryId,
            direction: activePlateau.direction,
            admissible: true
          }
        : null,

      relief,
      ridge,
      upland,
      lowland,
      surfaceNoise
    };
  }

  function terrainColor(region, terrain) {
    let [r, g, b] = region.color;

    r = mix(r, 96, terrain.lowland * 0.13);
    g = mix(g, 132, terrain.lowland * 0.16);
    b = mix(b, 84, terrain.lowland * 0.10);

    r = mix(r, 156, terrain.escarpmentStrength * 0.20);
    g = mix(g, 132, terrain.escarpmentStrength * 0.18);
    b = mix(b, 92, terrain.escarpmentStrength * 0.12);

    r = mix(r, 178, terrain.plateauStrength * 0.24);
    g = mix(g, 158, terrain.plateauStrength * 0.22);
    b = mix(b, 108, terrain.plateauStrength * 0.16);

    r = mix(r, 108, terrain.rangeAscent * 0.22);
    g = mix(g, 102, terrain.rangeAscent * 0.20);
    b = mix(b, 86, terrain.rangeAscent * 0.16);

    r = mix(r, 78, terrain.relief * 0.24);
    g = mix(g, 76, terrain.relief * 0.22);
    b = mix(b, 72, terrain.relief * 0.18);

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
      escarpmentId: null,
      escarpmentDirection: null,
      escarpmentStrength: 0,
      plateauId: null,
      plateauDirection: null,
      plateauStrength: 0,
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
      authority: "terrain-escarpment-plateau-central-summit"
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

    const hierarchy = terrainHierarchy(local, region, field);
    const color = terrainColor(region, hierarchy);

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

      escarpmentId: hierarchy.escarpmentId,
      escarpmentDirection: hierarchy.escarpmentDirection,
      escarpmentStrength: hierarchy.escarpmentStrength,

      plateauId: hierarchy.plateauId,
      plateauDirection: hierarchy.plateauDirection,
      plateauStrength: hierarchy.plateauStrength,

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
      authority: "terrain-escarpment-plateau-central-summit"
    };
  }

  function receipt() {
    return Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      generation: "G3",
      standard: "escarpment-plateau-central-summit-terrain",
      authority: "terrain-escarpment-plateau-central-summit",
      surfaceScale: "planet",
      surfaceAreaStandard: "full-planet",
      visibleLandGuarantee: true,
      admissibilityRule:
        "Every escarpment, plateau, range corridor, central mountain, summit, and metroplex seat belongs to an existing General Region and Country.",
      terrainThesis:
        "edge escarpment -> plateau at escarpment edge -> inward range ascent -> central final mountain -> summit peak",
      generalRegions: GENERAL_REGIONS.map((region) => ({
        id: region.id,
        name: region.name,
        countries: region.countries,
        summitRegions: SUMMIT_LABELS,
        size: region.size,
        centralMountainId: region.masterMountainId,
        summitId: region.summitId,
        escarpments: region.escarpments.map((escarpment) => ({
          id: escarpment.id,
          direction: escarpment.direction,
          countryId: escarpment.countryId
        })),
        plateaus: region.plateaus.map((plateau) => ({
          id: plateau.id,
          direction: plateau.direction,
          countryId: plateau.countryId,
          metroplexId: plateau.metroplexId
        })),
        rangeCorridors: region.ranges.map((range) => ({
          id: range.id,
          direction: range.direction,
          countryId: range.countryId
        }))
      })),
      totals: {
        generalRegions: 4,
        countries: 16,
        summitRegionsPerGeneralRegion: 9,
        totalSummitRegions: 36,
        escarpmentSystems: 4,
        escarpmentEdges: 16,
        plateaus: 16,
        rangeCorridors: 16,
        centralMountains: 4,
        summitPeaks: 4,
        metroplexSeats: 16
      },
      owns: [
        "landmass-family boundary",
        "General Region assignment",
        "Country assignment",
        "Summit region assignment",
        "city-zone seat placeholders",
        "coast threshold",
        "escarpment edges",
        "plateaus at escarpment edge",
        "range ascent corridors",
        "central final mountains",
        "summit peaks",
        "metroplex seats",
        "relief",
        "ridge",
        "upland",
        "lowland",
        "planet surface-area terrain scale"
      ],
      doesNotOwn: [
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
    standard: "escarpment-plateau-central-summit-terrain",
    authority: "terrain-escarpment-plateau-central-summit",
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
  document.documentElement.dataset.hearthTerrainStandard = "escarpment-plateau-central-summit-terrain";
  document.documentElement.dataset.hearthTerrainSurfaceScale = "planet";
  document.documentElement.dataset.hearthTerrainVisibleLandGuarantee = "true";
  document.documentElement.dataset.hearthTerrainEscarpmentSystems = "4";
  document.documentElement.dataset.hearthTerrainEscarpmentEdges = "16";
  document.documentElement.dataset.hearthTerrainPlateaus = "16";
  document.documentElement.dataset.hearthTerrainRangeCorridors = "16";
  document.documentElement.dataset.hearthTerrainCentralMountains = "4";
  document.documentElement.dataset.hearthTerrainSummitPeaks = "4";
  document.documentElement.dataset.hearthTerrainMetroplexSeats = "16";
})();
