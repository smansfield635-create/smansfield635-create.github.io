/*
 G5_VISUAL_REFINEMENT_LAND_NEGATIVE_SPACE_LOBE_SILHOUETTE_TNT_v1
 TARGET=/world/render/planet-one.land.constructs.js
 PURPOSE:
 Geometry-first refinement for the G5 Planet 1 visual branch.
 Keeps the B27 candidate traceable while strengthening the continent silhouette,
 carving larger negative-space gulfs into the actual outline, and preserving the
 attached three-lobe land system, secondary regions, and distinct poles.
*/

(function attachPlanetOneLandConstructs(global) {
  "use strict";

  var VERSION = "G5_VISUAL_REFINEMENT_LAND_NEGATIVE_SPACE_LOBE_SILHOUETTE_TNT_v1";
  var PREVIOUS_VERSION = "B27A_LAND_CONSTRUCTS_GEOMETRY_TNT_v1";
  var CONTRACT_MARKERS = [
    VERSION,
    PREVIOUS_VERSION,
    "planet-one-land-constructs-module-active=true",
    "seven-landmass-law-active=true",
    "three-region-attached-wrap-active=true",
    "g5-visual-refinement-active=true",
    "b27-candidate-refined=true",
    "negative-space-gulf-carving-active=true",
    "lobe-silhouette-strengthened=true",
    "ocean-intrusion-geometry-active=true",
    "decorative-ribbon-reduced=true",
    "continent-remains-attached=true",
    "polar-bodies-distinct=true",
    "visual-pass-not-claimed=true",
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
        coastBias = 0.58 + Math.abs(Math.sin(deg(lon * 0.82 + lat * 1.25 + phase * 17))) * 0.42;
        result.push([
          normalizeLon(lon + (n * 1.55 + h * 1.25) * force * edgeScale * coastBias),
          clamp(lat + (n * 1.65 - h * 1.35) * force * edgeScale * coastBias, -86, 86)
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
      [-172, 0], [-166, 16], [-156, 30], [-143, 42], [-130, 34], [-120, 51], [-107, 39],
      [-96, 47], [-87, 36], [-80, 21], [-72, 36], [-63, 45], [-51, 33], [-42, 50],
      [-30, 43], [-20, 50], [-11, 36], [-4, 22], [4, 36], [15, 43], [24, 29],
      [35, 40], [48, 30], [60, 42], [73, 28], [90, 31], [106, 17], [124, 11],
      [139, -7], [130, -20], [116, -17], [105, -32], [91, -24], [77, -38],
      [62, -30], [49, -43], [34, -35], [21, -47], [8, -37], [-3, -49], [-16, -36],
      [-30, -46], [-45, -33], [-61, -43], [-76, -31], [-90, -42], [-105, -31],
      [-121, -36], [-137, -24], [-154, -17], [-170, -8]
    ];

    return {
      id: "attached_continental_wrap",
      type: "attached-triad",
      name: "Mainland + Major Region 1 + Major Region 2",
      semanticMembership: ["Mainland", "Major_Region_1", "Major_Region_2"],
      attachedRegions: 3,
      visibilityPriority: 1,
      phase: 0.4,
      fractureProfile: { phase: 0.4, force: 1.02, minSteps: 6, edgeScale: 0.94 },
      colorA: "rgba(74,111,70,0.84)",
      colorB: "rgba(34,70,55,0.90)",
      colorC: "rgba(119,98,67,0.32)",
      shore: "rgba(132,225,231,0.40)",
      shelf: "rgba(74,185,204,0.18)",
      ridge: "rgba(9,15,15,0.58)",
      mineral: "rgba(210,170,92,0.17)",
      outline: outline,
      fusedLobes: [
        { id: "western_lobe", membership: "Mainland", center: [-120, 8], radius: [45, 42], pressure: 0.74, shoulder: [-86, 13] },
        { id: "central_plateau_lobe", membership: "Major_Region_1", center: [-28, 11], radius: [50, 45], pressure: 0.94, shoulder: [-4, 8] },
        { id: "eastern_highland_lobe", membership: "Major_Region_2", center: [77, -4], radius: [55, 42], pressure: 0.82, shoulder: [39, -5] }
      ],
      negativeSpaceGulfs: [
        {
          id: "north_lobe_separation_sea",
          mode: "negative-space-gulf",
          depth: 0.86,
          shelfWidth: 13,
          polygon: makePath([[-88, 35], [-80, 25], [-71, 22], [-63, 33], [-69, 41], [-80, 41]])
        },
        {
          id: "central_north_cut_sea",
          mode: "negative-space-gulf",
          depth: 0.90,
          shelfWidth: 15,
          polygon: makePath([[-15, 37], [-7, 24], [2, 21], [11, 35], [5, 43], [-6, 45]])
        },
        {
          id: "southern_lobe_cleft_sea",
          mode: "negative-space-gulf",
          depth: 0.82,
          shelfWidth: 14,
          polygon: makePath([[-7, -40], [8, -31], [24, -38], [16, -50], [3, -48]])
        },
        {
          id: "eastern_south_shelf_sea",
          mode: "negative-space-gulf",
          depth: 0.70,
          shelfWidth: 12,
          polygon: makePath([[76, -34], [91, -24], [107, -30], [101, -41], [86, -42]])
        }
      ],
      coastalCuts: [
        { id: "northwest_gulf", mode: "shelf-gulf", depth: 0.58, width: 8, path: makePath([[-146, 33], [-132, 31], [-119, 37], [-106, 35]]) },
        { id: "western_lobe_sound", mode: "shelf-sound", depth: 0.42, width: 5, path: makePath([[-104, 37], [-93, 33], [-84, 36]]) },
        { id: "central_north_shelf", mode: "shelf-edge", depth: 0.46, width: 6, path: makePath([[-61, 39], [-48, 35], [-35, 38], [-23, 34]]) },
        { id: "eastern_highland_gulf", mode: "shelf-gulf", depth: 0.54, width: 8, path: makePath([[71, 28], [86, 22], [101, 24], [117, 14], [130, 7]]) },
        { id: "southern_shelf_arc", mode: "shelf-cut", depth: 0.48, width: 7, path: makePath([[-56, -37], [-39, -32], [-22, -38], [-8, -34]]) },
        { id: "far_west_coastal_scar", mode: "scar", depth: 0.36, width: 5, path: makePath([[-166, -2], [-153, -10], [-139, -12], [-128, -22]]) }
      ],
      coastalIntrusions: [],
      tectonicSeams: [
        makePath([[-88, -35], [-83, -16], [-78, 1], [-76, 18], [-73, 35]]),
        makePath([[2, -41], [7, -22], [11, -3], [14, 16], [18, 36]])
      ],
      lobeBoundaryPressure: [
        makePath([[-95, -30], [-88, -9], [-82, 11], [-77, 31]]),
        makePath([[-5, -38], [5, -17], [13, 4], [20, 29]]),
        makePath([[38, -35], [49, -17], [61, 1], [76, 21]])
      ],
      ridges: [
        makePath([[-155, 10], [-136, 24], [-114, 33], [-93, 30], [-78, 39]]),
        makePath([[-74, 10], [-56, 22], [-37, 31], [-17, 25], [0, 34]]),
        makePath([[10, 14], [32, 24], [55, 17], [79, 24], [106, 11]]),
        makePath([[-132, -18], [-106, -5], [-80, 8], [-54, 10], [-29, 20]]),
        makePath([[-73, -32], [-48, -19], [-21, -11], [8, -16], [36, -27], [67, -22], [97, -27]])
      ],
      plateaus: [
        makePath([[-140, 17], [-119, 24], [-97, 26], [-79, 20]]),
        makePath([[-70, 28], [-52, 34], [-34, 31], [-14, 36], [2, 29]]),
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
        fractureProfile: { phase: 2.7, force: 0.82, minSteps: 4, edgeScale: 0.84 },
        colorA: "rgba(112,88,66,0.80)",
        colorB: "rgba(69,56,45,0.86)",
        colorC: "rgba(132,81,54,0.24)",
        shore: "rgba(92,198,214,0.25)",
        shelf: "rgba(71,176,190,0.11)",
        ridge: "rgba(25,22,19,0.38)",
        mineral: "rgba(198,111,70,0.12)",
        outline: [[-174, 2], [-164, 23], [-148, 35], [-128, 39], [-113, 27], [-106, 5], [-117, -18], [-139, -31], [-160, -23], [-170, -8]],
        negativeSpaceGulfs: [],
        coastalCuts: [
          { id: "west_high_bay", mode: "bay", depth: 0.30, width: 5, path: makePath([[-161, 25], [-151, 29], [-141, 24], [-130, 31]]) },
          { id: "west_south_bite", mode: "bite", depth: 0.33, width: 5, path: makePath([[-137, -24], [-125, -17], [-116, -21]]) }
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
        fractureProfile: { phase: 4.0, force: 0.78, minSteps: 4, edgeScale: 0.82 },
        colorA: "rgba(98,112,78,0.78)",
        colorB: "rgba(47,69,54,0.84)",
        colorC: "rgba(112,92,66,0.20)",
        shore: "rgba(96,199,216,0.23)",
        shelf: "rgba(70,170,184,0.11)",
        ridge: "rgba(24,29,22,0.32)",
        mineral: "rgba(212,171,88,0.09)",
        outline: [[-79, -50], [-56, -40], [-24, -43], [9, -50], [39, -47], [59, -59], [34, -68], [-10, -67], [-47, -63]],
        negativeSpaceGulfs: [],
        coastalCuts: [
          { id: "southwest_bay", mode: "bay", depth: 0.26, width: 4, path: makePath([[-61, -45], [-49, -42], [-38, -47]]) },
          { id: "southeast_cut", mode: "cut", depth: 0.24, width: 4, path: makePath([[31, -50], [43, -53], [54, -58]]) }
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
        fractureProfile: { phase: 1.0, force: 0.40, minSteps: 3, edgeScale: 0.48 },
        colorA: "rgba(220,235,237,0.68)",
        colorB: "rgba(129,168,184,0.52)",
        colorC: "rgba(255,255,255,0.12)",
        shore: "rgba(203,238,243,0.20)",
        shelf: "rgba(214,246,250,0.08)",
        ridge: "rgba(80,108,122,0.20)",
        mineral: "rgba(255,255,255,0.07)",
        outline: [[-178, 76], [-139, 82], [-80, 85], [-18, 82], [44, 86], [111, 82], [177, 76], [116, 70], [44, 67], [-25, 69], [-95, 68], [-154, 71]],
        negativeSpaceGulfs: [],
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
        fractureProfile: { phase: 3.1, force: 0.40, minSteps: 3, edgeScale: 0.48 },
        colorA: "rgba(205,225,228,0.58)",
        colorB: "rgba(101,144,166,0.48)",
        colorC: "rgba(242,255,255,0.10)",
        shore: "rgba(190,231,238,0.18)",
        shelf: "rgba(196,236,242,0.07)",
        ridge: "rgba(71,98,116,0.18)",
        mineral: "rgba(255,255,255,0.05)",
        outline: [[-176, -75], [-116, -69], [-47, -72], [20, -68], [90, -71], [172, -76], [121, -83], [42, -86], [-31, -82], [-106, -84]],
        negativeSpaceGulfs: [],
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
      negativeSpaceGulfCarvingActive: true,
      lobeSilhouetteStrengthened: true,
      oceanIntrusionGeometryActive: true,
      decorativeRibbonReduced: true,
      continentRemainsAttached: true,
      polarBodiesDistinct: true,
      visualPassClaimed: false,
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
