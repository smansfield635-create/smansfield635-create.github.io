/*
 B26B_LAND_CONSTRUCTS_MODULE_TNT_v1
 TARGET=/world/render/planet-one.land.constructs.js
 PURPOSE:
 Dedicated Planet 1 geometry and land construct authority.
 Owns seven-body law, three-region attached continental wrap, fused tectonic lobes,
 secondary major bodies, polar bodies, coastline fracture profiles, bays/gulfs,
 ridges, seams, and plateau data.
 DOES NOT OWN:
 Canvas mount, public renderer contract, animation loop, page route, gauges, tree demo,
 ocean/atmosphere/material painting.
*/

(function attachPlanetOneLandConstructs(global) {
  "use strict";

  var VERSION = "B26B_LAND_CONSTRUCTS_MODULE_TNT_v1";
  var CONTRACT_MARKERS = [
    VERSION,
    "planet-one-land-constructs-module-active=true",
    "seven-landmass-law-active=true",
    "three-region-attached-wrap-active=true",
    "fused-tectonic-lobes-active=true",
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

    for (i = 0; i < outline.length; i += 1) {
      p = outline[i];
      next = outline[(i + 1) % outline.length];
      distance = Math.abs(next[0] - p[0]) + Math.abs(next[1] - p[1]);
      steps = minSteps + Math.floor(distance / 6);

      for (t = 0; t < steps; t += 1) {
        lon = p[0] + (next[0] - p[0]) * (t / steps);
        lat = p[1] + (next[1] - p[1]) * (t / steps);
        n = signedNoise(lon, lat, phase);
        h = highNoise(lon, lat, phase);
        result.push([
          normalizeLon(lon + (n * 2.15 + h * 1.45) * force),
          clamp(lat + (n * 2.45 - h * 1.55) * force, -86, 86)
        ]);
      }
    }

    return result;
  }

  function createPlanetOneLandConstructs() {
    var attachedOutline = [
      [-166, 6], [-158, 21], [-148, 31], [-136, 45], [-121, 37], [-106, 52], [-90, 42],
      [-74, 54], [-57, 43], [-39, 55], [-22, 42], [-4, 48], [14, 36], [33, 45],
      [53, 33], [71, 40], [88, 27], [108, 22], [126, 9], [138, -8], [126, -20],
      [116, -33], [96, -25], [80, -37], [61, -26], [43, -40], [22, -31], [3, -43],
      [-19, -32], [-39, -44], [-59, -33], [-78, -41], [-98, -28], [-119, -33], [-136, -18],
      [-155, -12], [-171, 0]
    ];

    return [
      {
        id: "attached_continental_wrap",
        type: "attached-triad",
        name: "Mainland + Major Region 1 + Major Region 2",
        semanticMembership: ["Mainland", "Major_Region_1", "Major_Region_2"],
        attachedRegions: 3,
        visibilityPriority: 1,
        phase: 0.4,
        fractureProfile: { phase: 0.4, force: 1.62, minSteps: 5 },
        colorA: "rgba(88,124,76,0.88)",
        colorB: "rgba(42,80,58,0.92)",
        colorC: "rgba(126,105,73,0.34)",
        shore: "rgba(137,232,235,0.42)",
        shelf: "rgba(78,196,210,0.18)",
        ridge: "rgba(14,20,18,0.50)",
        mineral: "rgba(224,184,92,0.18)",
        outline: attachedOutline,
        fusedLobes: [
          { id: "western_lobe", membership: "Mainland", center: [-112, 12], radius: [54, 46] },
          { id: "central_plateau_lobe", membership: "Major_Region_1", center: [-22, 14], radius: [59, 49] },
          { id: "eastern_lobe", membership: "Major_Region_2", center: [72, -3], radius: [62, 45] }
        ],
        coastalIntrusions: [
          { id: "northwest_gulf", lon: -128, lat: 35, rx: 17, ry: 9, angle: -24, depth: 0.70, mode: "gulf" },
          { id: "north_central_sound", lon: -89, lat: 45, rx: 14, ry: 7, angle: 18, depth: 0.58, mode: "sound" },
          { id: "upper_midland_bay", lon: -54, lat: 43, rx: 13, ry: 6, angle: -16, depth: 0.52, mode: "bay" },
          { id: "central_divide_inlet", lon: -2, lat: 39, rx: 15, ry: 8, angle: -10, depth: 0.62, mode: "inlet" },
          { id: "eastern_highland_gulf", lon: 91, lat: 20, rx: 21, ry: 9, angle: 26, depth: 0.72, mode: "gulf" },
          { id: "southeast_bite", lon: 119, lat: -16, rx: 13, ry: 6, angle: -31, depth: 0.54, mode: "bite" },
          { id: "southern_inner_sea", lon: -28, lat: -37, rx: 19, ry: 8, angle: 19, depth: 0.66, mode: "inner-sea" },
          { id: "south_central_cleft", lon: 47, lat: -32, rx: 16, ry: 7, angle: -18, depth: 0.58, mode: "cleft" },
          { id: "far_west_coastal_scar", lon: -148, lat: -8, rx: 16, ry: 7, angle: 38, depth: 0.60, mode: "scar" }
        ],
        tectonicSeams: [
          [[-70, -35], [-62, -12], [-55, 14], [-49, 36], [-42, 54]],
          [[19, -36], [22, -12], [21, 14], [17, 37], [11, 49]]
        ],
        ridges: [
          [[-150, 13], [-130, 27], [-107, 35], [-80, 39], [-55, 35], [-29, 44], [1, 36], [30, 40], [60, 28], [96, 12]],
          [[-131, -14], [-101, 0], [-66, 12], [-32, 26], [7, 23], [42, 11], [79, -5], [115, -22]],
          [[-87, -31], [-53, -18], [-22, -9], [17, -15], [55, -26], [91, -22]],
          [[-40, 8], [-15, 17], [10, 18], [36, 10], [62, -2]]
        ],
        plateaus: [
          [[-135, 18], [-110, 24], [-82, 30], [-53, 27], [-21, 32], [8, 28], [37, 30], [66, 19]],
          [[-116, 3], [-84, 9], [-50, 16], [-14, 17], [22, 13], [56, 6], [90, -8]],
          [[-102, -19], [-69, -11], [-35, -5], [1, -6], [35, -12], [70, -20]],
          [[-62, 31], [-35, 38], [-6, 34], [22, 36], [49, 27]]
        ]
      },
      {
        id: "western_craton",
        type: "separate-major-body",
        name: "Major Region 3",
        semanticMembership: ["Major_Region_3"],
        visibilityPriority: 2,
        phase: 2.7,
        fractureProfile: { phase: 2.7, force: 0.98, minSteps: 4 },
        colorA: "rgba(116,92,68,0.82)",
        colorB: "rgba(72,59,47,0.88)",
        colorC: "rgba(136,84,55,0.26)",
        shore: "rgba(92,198,214,0.27)",
        shelf: "rgba(71,176,190,0.12)",
        ridge: "rgba(27,24,20,0.39)",
        mineral: "rgba(198,111,70,0.13)",
        outline: [[-174, 2], [-164, 23], [-148, 35], [-128, 39], [-113, 27], [-106, 5], [-117, -18], [-139, -31], [-160, -23], [-170, -8]],
        coastalIntrusions: [
          { id: "west_high_bay", lon: -154, lat: 28, rx: 8, ry: 4, angle: -14, depth: 0.42, mode: "bay" },
          { id: "west_south_bite", lon: -121, lat: -17, rx: 9, ry: 4, angle: 26, depth: 0.46, mode: "bite" }
        ],
        tectonicSeams: [],
        ridges: [[[-159, -15], [-148, 2], [-135, 17], [-117, 30]], [[-155, 21], [-138, 10], [-121, -4]]],
        plateaus: [[[-151, 10], [-137, 17], [-122, 12]]]
      },
      {
        id: "southern_arc",
        type: "separate-major-body",
        name: "Major Region 4",
        semanticMembership: ["Major_Region_4"],
        visibilityPriority: 3,
        phase: 4.0,
        fractureProfile: { phase: 4.0, force: 0.92, minSteps: 4 },
        colorA: "rgba(102,116,80,0.80)",
        colorB: "rgba(48,72,55,0.86)",
        colorC: "rgba(115,95,67,0.21)",
        shore: "rgba(96,199,216,0.24)",
        shelf: "rgba(70,170,184,0.12)",
        ridge: "rgba(25,30,23,0.34)",
        mineral: "rgba(212,171,88,0.10)",
        outline: [[-79, -50], [-56, -40], [-24, -43], [9, -50], [39, -47], [59, -59], [34, -68], [-10, -67], [-47, -63]],
        coastalIntrusions: [
          { id: "southwest_bay", lon: -52, lat: -44, rx: 10, ry: 4, angle: -8, depth: 0.34, mode: "bay" },
          { id: "southeast_cut", lon: 42, lat: -52, rx: 9, ry: 4, angle: 14, depth: 0.32, mode: "cut" }
        ],
        tectonicSeams: [],
        ridges: [[[-65, -55], [-36, -48], [-4, -51], [23, -56], [48, -53]]],
        plateaus: [[[-54, -56], [-27, -52], [7, -55], [33, -57]]]
      },
      {
        id: "north_pole",
        type: "pole",
        name: "North Pole",
        semanticMembership: ["North_Pole"],
        visibilityPriority: 4,
        phase: 1.0,
        fractureProfile: { phase: 1.0, force: 0.55, minSteps: 3 },
        colorA: "rgba(220,235,237,0.68)",
        colorB: "rgba(129,168,184,0.52)",
        colorC: "rgba(255,255,255,0.12)",
        shore: "rgba(203,238,243,0.20)",
        shelf: "rgba(214,246,250,0.08)",
        ridge: "rgba(80,108,122,0.20)",
        mineral: "rgba(255,255,255,0.07)",
        outline: [[-178, 76], [-139, 82], [-80, 85], [-18, 82], [44, 86], [111, 82], [177, 76], [116, 70], [44, 67], [-25, 69], [-95, 68], [-154, 71]],
        coastalIntrusions: [],
        tectonicSeams: [],
        ridges: [[[-150, 76], [-90, 80], [-20, 78], [55, 81], [134, 75]]],
        plateaus: []
      },
      {
        id: "south_pole",
        type: "pole",
        name: "South Pole",
        semanticMembership: ["South_Pole"],
        visibilityPriority: 5,
        phase: 3.1,
        fractureProfile: { phase: 3.1, force: 0.52, minSteps: 3 },
        colorA: "rgba(205,225,228,0.58)",
        colorB: "rgba(101,144,166,0.48)",
        colorC: "rgba(242,255,255,0.10)",
        shore: "rgba(190,231,238,0.18)",
        shelf: "rgba(196,236,242,0.07)",
        ridge: "rgba(71,98,116,0.18)",
        mineral: "rgba(255,255,255,0.05)",
        outline: [[-176, -75], [-116, -69], [-47, -72], [20, -68], [90, -71], [172, -76], [121, -83], [42, -86], [-31, -82], [-106, -84]],
        coastalIntrusions: [],
        tectonicSeams: [],
        ridges: [[[-140, -77], [-70, -80], [0, -75], [76, -80], [146, -77]]],
        plateaus: []
      }
    ];
  }

  function getLandConstructStatus() {
    return {
      ok: true,
      version: VERSION,
      VERSION: VERSION,
      active: true,
      constructCount: 5,
      sevenLandmassLawActive: true,
      attachedTriRegionWrapActive: true,
      fusedTectonicLobesActive: true,
      polarBodiesDistinct: true,
      markers: CONTRACT_MARKERS.slice(),
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice()
    };
  }

  global.DGBPlanetOneLandConstructs = {
    VERSION: VERSION,
    version: VERSION,
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
