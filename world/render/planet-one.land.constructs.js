/*
 B27A_LAND_CONSTRUCTS_GEOMETRY_TNT_v1
 TARGET=/world/render/planet-one.land.constructs.js
 PURPOSE:
 Geometry-first renewal for Planet 1.
 Owns the land construct law and projection-ready geometry only.
 Converts the attached continental wrap from a broad front slab into three fused tectonic lobes
 with coast-following gulfs, concave ocean intrusions, plateau belts, ridge systems, and distinct poles.
 DOES NOT OWN:
 Canvas mount, public renderer contract, animation loop, route, runtime, asset consumer, gauges,
 tree demo, ocean paint, atmospheric paint, or final surface material rendering.
*/

(function attachPlanetOneLandConstructs(global) {
  "use strict";

  var VERSION = "B27A_LAND_CONSTRUCTS_GEOMETRY_TNT_v1";
  var PREVIOUS_VERSION = "B26B_LAND_CONSTRUCTS_MODULE_TNT_v1";
  var CONTRACT_MARKERS = [
    VERSION,
    PREVIOUS_VERSION,
    "planet-one-land-constructs-module-active=true",
    "seven-landmass-law-active=true",
    "three-region-attached-wrap-active=true",
    "three-fused-tectonic-lobes-legible=true",
    "slab-geometry-reduced=true",
    "coast-following-gulf-data-active=true",
    "lobe-boundary-pressure-data-active=true",
    "continent-remains-attached=true",
    "polar-bodies-distinct=true",
    "coastline-fracture-authority-active=true",
    "geometry-authority-only=true",
    "canvas-mount-owned-by-renderer-facade=true",
    "surface-materials-owned-by-surface-module=true"
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function deg(value) {
    return value * Math.PI / 180;
  }

  function normalizeLon(lon) {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  }

  function signedNoise(lon, lat, phase) {
    return (
      Math.sin(deg(lon * 1.7 + lat * 2.9 + phase * 31)) * 0.46 +
      Math.cos(deg(lon * 3.3 - lat * 1.8 + phase * 17)) * 0.31 +
      Math.sin(deg(lon * 7.2 + lat * 5.6 + phase * 13)) * 0.15 +
      Math.cos(deg(lon * 13.8 - lat * 8.7 + phase * 11)) * 0.08
    );
  }

  function highNoise(lon, lat, phase) {
    return (
      Math.sin(deg(lon * 11.1 + lat * 7.3 + phase * 19)) * 0.36 +
      Math.cos(deg(lon * 19.7 - lat * 13.5 + phase * 23)) * 0.24 +
      Math.sin(deg(lon * 31.0 + lat * 17.0 + phase * 29)) * 0.14
    );
  }

  function interpolatePath(points, stepsPerSegment) {
    var result = [];
    var i;
    var j;
    var a;
    var b;
    var steps;
    var lon;
    var lat;

    if (!points || !points.length) return result;

    for (i = 0; i < points.length; i += 1) {
      a = points[i];
      b = points[(i + 1) % points.length];
      steps = Math.max(2, Math.floor(stepsPerSegment || 4));
      for (j = 0; j < steps; j += 1) {
        lon = a[0] + (b[0] - a[0]) * (j / steps);
        lat = a[1] + (b[1] - a[1]) * (j / steps);
        result.push([normalizeLon(lon), clamp(lat, -86, 86)]);
      }
    }

    return result;
  }

  function fractureConstructOutline(outline, profile) {
    var result = [];
    var phase = profile && typeof profile.phase === "number" ? profile.phase : 0;
    var force = profile && typeof profile.force === "number" ? profile.force : 1;
    var minSteps = profile && typeof profile.minSteps === "number" ? profile.minSteps : 4;
    var edgeScale = profile && typeof profile.edgeScale === "number" ? profile.edgeScale : 1;
    var i;
    var p;
    var next;
    var t;
    var steps;
    var lon;
    var lat;
    var n;
    var h;
    var distance;
    var coastBias;

    if (!outline || !outline.length) return result;

    for (i = 0; i < outline.length; i += 1) {
      p = outline[i];
      next = outline[(i + 1) % outline.length];
      distance = Math.abs(next[0] - p[0]) + Math.abs(next[1] - p[1]);
      steps = minSteps + Math.floor(distance / 5);

      for (t = 0; t < steps; t += 1) {
        lon = p[0] + (next[0] - p[0]) * (t / steps);
        lat = p[1] + (next[1] - p[1]) * (t / steps);
        n = signedNoise(lon, lat, phase);
        h = highNoise(lon, lat, phase);
        coastBias = 0.72 + Math.abs(Math.sin(deg(lon * 0.9 + lat * 1.4 + phase * 17))) * 0.56;
        result.push([
          normalizeLon(lon + (n * 2.0 + h * 1.8) * force * edgeScale * coastBias),
          clamp(lat + (n * 2.15 - h * 1.85) * force * edgeScale * coastBias, -86, 86)
        ]);
      }
    }

    return result;
  }

  function makePath(points) {
    return points.slice();
  }

  function createAttachedContinentalWrap() {
    var outline = [
      [-171, 2], [-165, 17], [-154, 28], [-143, 43], [-130, 35], [-119, 50], [-105, 38],
      [-91, 48], [-79, 32], [-66, 44], [-53, 35], [-43, 51], [-28, 41], [-15, 49],
      [-2, 35], [10, 42], [20, 27], [33, 39], [47, 29], [60, 41], [73, 28], [89, 30],
      [105, 17], [125, 11], [139, -6], [131, -20], [116, -18], [104, -33], [90, -23],
      [74, -37], [58, -28], [42, -42], [22, -33], [6, -47], [-12, -34], [-29, -46],
      [-47, -34], [-65, -44], [-82, -31], [-102, -37], [-119, -25], [-139, -29],
      [-153, -15], [-170, -7]
    ];

    return {
      id: "attached_continental_wrap",
      type: "attached-triad",
      name: "Mainland + Major Region 1 + Major Region 2",
      semanticMembership: ["Mainland", "Major_Region_1", "Major_Region_2"],
      attachedRegions: 3,
      visibilityPriority: 1,
      phase: 0.4,
      fractureProfile: { phase: 0.4, force: 1.22, minSteps: 6, edgeScale: 1.05 },
      colorA: "rgba(86,123,74,0.86)",
      colorB: "rgba(39,78,57,0.90)",
      colorC: "rgba(132,107,71,0.32)",
      shore: "rgba(137,232,235,0.42)",
      shelf: "rgba(78,196,210,0.18)",
      ridge: "rgba(12,18,17,0.56)",
      mineral: "rgba(224,184,92,0.18)",
      outline: outline,
      fusedLobes: [
        {
          id: "western_lobe",
          membership: "Mainland",
          center: [-118, 10],
          radius: [47, 44],
          pressure: 0.72,
          boundary: makePath([[-91, -37], [-86, -17], [-81, 3], [-79, 23], [-76, 43]])
        },
        {
          id: "central_plateau_lobe",
          membership: "Major_Region_1",
          center: [-26, 12],
          radius: [55, 47],
          pressure: 0.92,
          boundary: makePath([[3, -44], [8, -22], [11, 0], [13, 22], [16, 43]])
        },
        {
          id: "eastern_highland_lobe",
          membership: "Major_Region_2",
          center: [78, -4],
          radius: [56, 43],
          pressure: 0.80,
          boundary: makePath([[40, -39], [49, -18], [59, 2], [70, 18], [86, 30]])
        }
      ],
      coastalCuts: [
        { id: "northwest_gulf", mode: "gulf", depth: 0.78, width: 12, path: makePath([[-145, 34], [-132, 32], [-121, 38], [-111, 34], [-101, 41]]) },
        { id: "western_lobe_sound", mode: "sound", depth: 0.62, width: 8, path: makePath([[-101, 37], [-92, 31], [-84, 34], [-78, 29]]) },
        { id: "central_north_gulf", mode: "gulf", depth: 0.86, width: 14, path: makePath([[-59, 41], [-49, 34], [-36, 39], [-24, 33], [-12, 39]]) },
        { id: "tri_lobe_northern_cleft", mode: "cleft", depth: 0.90, width: 12, path: makePath([[-10, 36], [-1, 27], [9, 31], [18, 24], [28, 34]]) },
        { id: "eastern_highland_gulf", mode: "gulf", depth: 0.82, width: 15, path: makePath([[69, 30], [82, 22], [96, 25], [111, 15], [126, 8]]) },
        { id: "southeast_shelf_cut", mode: "shelf-cut", depth: 0.56, width: 9, path: makePath([[101, -25], [112, -21], [123, -17], [134, -9]]) },
        { id: "southern_inner_sea", mode: "inner-sea", depth: 0.88, width: 15, path: makePath([[-51, -37], [-35, -31], [-21, -38], [-8, -32], [9, -42]]) },
        { id: "south_central_cleft", mode: "cleft", depth: 0.76, width: 11, path: makePath([[20, -37], [35, -31], [50, -37], [64, -29], [79, -36]]) },
        { id: "far_west_coastal_scar", mode: "scar", depth: 0.55, width: 8, path: makePath([[-166, -2], [-153, -10], [-139, -12], [-128, -22]]) }
      ],
      coastalIntrusions: [
        { id: "legacy_northwest_gulf", lon: -128, lat: 35, rx: 12, ry: 5, angle: -24, depth: 0.50, mode: "legacy-soft" },
        { id: "legacy_eastern_highland_gulf", lon: 92, lat: 21, rx: 13, ry: 5, angle: 26, depth: 0.52, mode: "legacy-soft" }
      ],
      tectonicSeams: [
        makePath([[-89, -35], [-84, -17], [-79, 2], [-77, 22], [-73, 42]]),
        makePath([[5, -43], [9, -23], [11, -1], [13, 20], [16, 41]])
      ],
      lobeBoundaryPressure: [
        makePath([[-94, -31], [-87, -9], [-82, 14], [-78, 35]]),
        makePath([[-2, -39], [7, -17], [13, 6], [18, 31]]),
        makePath([[38, -36], [49, -17], [61, 2], [76, 22]])
      ],
      ridges: [
        makePath([[-154, 11], [-135, 25], [-113, 34], [-92, 31], [-76, 40]]),
        makePath([[-76, 11], [-57, 22], [-37, 31], [-17, 25], [2, 34]]),
        makePath([[8, 14], [31, 24], [54, 17], [77, 24], [105, 11]]),
        makePath([[-132, -17], [-106, -4], [-80, 8], [-54, 10], [-29, 20]]),
        makePath([[-72, -32], [-47, -19], [-21, -11], [8, -16], [35, -27], [66, -22], [96, -27]])
      ],
      plateaus: [
        makePath([[-141, 17], [-119, 24], [-97, 26], [-78, 20]]),
        makePath([[-73, 29], [-53, 34], [-33, 31], [-13, 36], [4, 29]]),
        makePath([[22, 27], [45, 31], [67, 24], [91, 26]]),
        makePath([[-112, -2], [-86, 6], [-61, 9], [-38, 6]]),
        makePath([[-24, -4], [4, 2], [31, -4], [58, -11], [88, -12]]),
        makePath([[-97, -24], [-68, -15], [-39, -14], [-10, -22]]),
        makePath([[13, -31], [42, -24], [71, -29], [104, -23]])
      ],
      basins: [
        { id: "western_interior_basin", center: [-117, 4], radius: [21, 13], angle: -12, depth: 0.46 },
        { id: "central_green_basin", center: [-32, 5], radius: [24, 16], angle: 9, depth: 0.38 },
        { id: "eastern_shadow_basin", center: [71, -8], radius: [29, 17], angle: -18, depth: 0.52 }
      ]
    };
  }

  function createPlanetOneLandConstructs() {
    return [
      createAttachedContinentalWrap(),
      {
        id: "western_craton",
        type: "separate-major-body",
        name: "Major Region 3",
        semanticMembership: ["Major_Region_3"],
        visibilityPriority: 2,
        phase: 2.7,
        fractureProfile: { phase: 2.7, force: 0.92, minSteps: 4, edgeScale: 0.90 },
        colorA: "rgba(116,92,68,0.82)",
        colorB: "rgba(72,59,47,0.88)",
        colorC: "rgba(136,84,55,0.26)",
        shore: "rgba(92,198,214,0.27)",
        shelf: "rgba(71,176,190,0.12)",
        ridge: "rgba(27,24,20,0.39)",
        mineral: "rgba(198,111,70,0.13)",
        outline: [[-174, 2], [-164, 23], [-148, 35], [-128, 39], [-113, 27], [-106, 5], [-117, -18], [-139, -31], [-160, -23], [-170, -8]],
        coastalCuts: [
          { id: "west_high_bay", mode: "bay", depth: 0.42, width: 6, path: makePath([[-161, 25], [-151, 29], [-141, 24], [-130, 31]]) },
          { id: "west_south_bite", mode: "bite", depth: 0.46, width: 6, path: makePath([[-137, -24], [-125, -17], [-116, -21]]) }
        ],
        coastalIntrusions: [],
        tectonicSeams: [],
        lobeBoundaryPressure: [],
        ridges: [makePath([[-159, -15], [-148, 2], [-135, 17], [-117, 30]]), makePath([[-155, 21], [-138, 10], [-121, -4]])],
        plateaus: [makePath([[-151, 10], [-137, 17], [-122, 12]])],
        basins: [{ id: "west_craton_basin", center: [-139, 5], radius: [15, 10], angle: -6, depth: 0.30 }]
      },
      {
        id: "southern_arc",
        type: "separate-major-body",
        name: "Major Region 4",
        semanticMembership: ["Major_Region_4"],
        visibilityPriority: 3,
        phase: 4.0,
        fractureProfile: { phase: 4.0, force: 0.86, minSteps: 4, edgeScale: 0.88 },
        colorA: "rgba(102,116,80,0.80)",
        colorB: "rgba(48,72,55,0.86)",
        colorC: "rgba(115,95,67,0.21)",
        shore: "rgba(96,199,216,0.24)",
        shelf: "rgba(70,170,184,0.12)",
        ridge: "rgba(25,30,23,0.34)",
        mineral: "rgba(212,171,88,0.10)",
        outline: [[-79, -50], [-56, -40], [-24, -43], [9, -50], [39, -47], [59, -59], [34, -68], [-10, -67], [-47, -63]],
        coastalCuts: [
          { id: "southwest_bay", mode: "bay", depth: 0.34, width: 5, path: makePath([[-61, -45], [-49, -42], [-38, -47]]) },
          { id: "southeast_cut", mode: "cut", depth: 0.32, width: 5, path: makePath([[31, -50], [43, -53], [54, -58]]) }
        ],
        coastalIntrusions: [],
        tectonicSeams: [],
        lobeBoundaryPressure: [],
        ridges: [makePath([[-65, -55], [-36, -48], [-4, -51], [23, -56], [48, -53]])],
        plateaus: [makePath([[-54, -56], [-27, -52], [7, -55], [33, -57]])],
        basins: []
      },
      {
        id: "north_pole",
        type: "pole",
        name: "North Pole",
        semanticMembership: ["North_Pole"],
        visibilityPriority: 4,
        phase: 1.0,
        fractureProfile: { phase: 1.0, force: 0.45, minSteps: 3, edgeScale: 0.52 },
        colorA: "rgba(220,235,237,0.68)",
        colorB: "rgba(129,168,184,0.52)",
        colorC: "rgba(255,255,255,0.12)",
        shore: "rgba(203,238,243,0.20)",
        shelf: "rgba(214,246,250,0.08)",
        ridge: "rgba(80,108,122,0.20)",
        mineral: "rgba(255,255,255,0.07)",
        outline: [[-178, 76], [-139, 82], [-80, 85], [-18, 82], [44, 86], [111, 82], [177, 76], [116, 70], [44, 67], [-25, 69], [-95, 68], [-154, 71]],
        coastalCuts: [],
        coastalIntrusions: [],
        tectonicSeams: [],
        lobeBoundaryPressure: [],
        ridges: [makePath([[-150, 76], [-90, 80], [-20, 78], [55, 81], [134, 75]])],
        plateaus: [],
        basins: []
      },
      {
        id: "south_pole",
        type: "pole",
        name: "South Pole",
        semanticMembership: ["South_Pole"],
        visibilityPriority: 5,
        phase: 3.1,
        fractureProfile: { phase: 3.1, force: 0.44, minSteps: 3, edgeScale: 0.50 },
        colorA: "rgba(205,225,228,0.58)",
        colorB: "rgba(101,144,166,0.48)",
        colorC: "rgba(242,255,255,0.10)",
        shore: "rgba(190,231,238,0.18)",
        shelf: "rgba(196,236,242,0.07)",
        ridge: "rgba(71,98,116,0.18)",
        mineral: "rgba(255,255,255,0.05)",
        outline: [[-176, -75], [-116, -69], [-47, -72], [20, -68], [90, -71], [172, -76], [121, -83], [42, -86], [-31, -82], [-106, -84]],
        coastalCuts: [],
        coastalIntrusions: [],
        tectonicSeams: [],
        lobeBoundaryPressure: [],
        ridges: [makePath([[-140, -77], [-70, -80], [0, -75], [76, -80], [146, -77]])],
        plateaus: [],
        basins: []
      }
    ];
  }

  function getLandConstructStatus() {
    return {
      ok: true,
      version: VERSION,
      VERSION: VERSION,
      previousVersion: PREVIOUS_VERSION,
      active: true,
      constructCount: 5,
      sevenLandmassLawActive: true,
      attachedTriRegionWrapActive: true,
      fusedTectonicLobesActive: true,
      threeFusedTectonicLobesLegible: true,
      slabGeometryReduced: true,
      coastFollowingGulfDataActive: true,
      lobeBoundaryPressureDataActive: true,
      continentRemainsAttached: true,
      polarBodiesDistinct: true,
      markers: CONTRACT_MARKERS.slice(),
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice()
    };
  }

  global.DGBPlanetOneLandConstructs = {
    VERSION: VERSION,
    version: VERSION,
    PREVIOUS_VERSION: PREVIOUS_VERSION,
    previousVersion: PREVIOUS_VERSION,
    CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
    markers: CONTRACT_MARKERS.slice(),
    createPlanetOneLandConstructs: createPlanetOneLandConstructs,
    createLandConstructs: createPlanetOneLandConstructs,
    fractureConstructOutline: fractureConstructOutline,
    interpolatePath: interpolatePath,
    getLandConstructStatus: getLandConstructStatus,
    status: getLandConstructStatus
  };
})(typeof window !== "undefined" ? window : globalThis);
