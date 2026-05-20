Target only:

/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js

// /assets/audralia/clean/engine/audralia/engine/continents/gratitude.js
// AUDRALIA_G2_6_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_CHILD_TNT_v1
// Full-file replacement.
// Purpose: define Gratitude as a topology-only continent child whose boundary and surface-category map express adversity, survival, repair, openness, and gratitude for existence.
// Classic script. No imports. No exports. No direct drawing.
// Topology only: category, boundary, adjacency, and surface relationship.
// Does not own: parent geometry, canvas, FORM_VISIBLE, ocean body, seawater base, terrain, elevation, mountains, valleys, basins, raised cliffs, 3D caverns, hydrology simulation, sky, motion, zoom, orbit, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_CHILD_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_GRATITUDE_CHILD_TNT_v1";
  const CHILD_SPLIT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_TNT_v1";
  const PARENT_FACING_CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const PARENT_COMPLIANCE_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js";
  const ROUTE = "/showroom/globe/audralia/";

  const TOPOLOGY = Object.freeze({
    id: "gratitude-adversity-survival-topology",
    summit: "Gratitude",
    cells: 21,
    className: "primary",
    localLattice: "gratitude_21_adversity_survival_topology_lattice",
    backstory:
      "Gratitude is the first surviving continent: not a soft landmass, not a decorative green patch, and not a place untouched by pressure. Its western boundary absorbed the oldest adversity. Its eastern coast reopened after fracture. Its southern edge became restoration through wetlands and lagoon logic. Its northern shoulder remained continuous enough to receive light and movement. Its protected interior lakes hold memory without converting memory into terrain, elevation, or basin logic. Gratitude is survival without closure: the ability to remain open after adversity because existence itself is still received as a gift.",
    topologyOnly: true,
    terrainOwned: false,
    elevationOwned: false,
    color: "rgba(78, 170, 106, 0.72)",

    landmasses: [
      {
        id: "gratitude-mainland-adversity-survival-body",
        type: "primary",
        cells: 21,
        oceanAdjacency: true,

        boundary: [
          { lon: -77, lat: 15 },
          { lon: -72, lat: 26 },
          { lon: -63, lat: 35 },
          { lon: -50, lat: 41 },
          { lon: -36, lat: 39 },
          { lon: -25, lat: 33 },
          { lon: -16, lat: 24 },
          { lon: -12, lat: 15 },
          { lon: -16, lat: 9 },
          { lon: -9, lat: 2 },
          { lon: -17, lat: -3 },
          { lon: -20, lat: -11 },
          { lon: -28, lat: -17 },
          { lon: -34, lat: -28 },
          { lon: -47, lat: -32 },
          { lon: -58, lat: -27 },
          { lon: -66, lat: -31 },
          { lon: -73, lat: -23 },
          { lon: -68, lat: -15 },
          { lon: -78, lat: -10 },
          { lon: -72, lat: -3 },
          { lon: -82, lat: 4 },
          { lon: -76, lat: 9 }
        ],

        topology: {
          oceanAdjacency: true,

          beaches: [
            { start: 1, end: 5, label: "north continuance beach arc" },
            { start: 7, end: 10, label: "east reopening beach arc" },
            { start: 14, end: 16, label: "south restoration beach arc" }
          ],

          cliffEdges: [
            { start: 18, end: 22, label: "west adversity hard shoreline category" },
            { start: 16, end: 19, label: "southwest survival edge category" }
          ],

          cavernMouths: [
            { lon: -78, lat: 5, label: "western shelter mark where life withdrew during pressure" },
            { lon: -68, lat: -22, label: "southwestern repaired shelter-mouth boundary" },
            { lon: -16, lat: 1, label: "eastern reopened shelter-mouth boundary" }
          ],

          lakes: [
            [
              { lon: -52, lat: 13 },
              { lon: -47, lat: 18 },
              { lon: -39, lat: 17 },
              { lon: -35, lat: 11 },
              { lon: -39, lat: 6 },
              { lon: -48, lat: 7 }
            ],
            [
              { lon: -58, lat: -8 },
              { lon: -54, lat: -5 },
              { lon: -49, lat: -7 },
              { lon: -48, lat: -12 },
              { lon: -53, lat: -15 },
              { lon: -59, lat: -13 }
            ]
          ],

          bays: [
            { start: 8, end: 10, label: "eastern reopened bay from fractured boundary" },
            { start: 13, end: 16, label: "southern restored bay where loss became access" }
          ],

          inlets: [
            { start: 7, end: 9, label: "narrow eastern inlet of reopening" },
            { start: 15, end: 17, label: "south-southwest restoration inlet" }
          ],

          peninsulas: [
            { start: 0, end: 3, label: "northwestern continuance shoulder" },
            { start: 4, end: 7, label: "northeastern outreach point" },
            { start: 9, end: 11, label: "eastern reach after survival" }
          ],

          lagoons: [
            [
              { lon: -58, lat: -22 },
              { lon: -52, lat: -19 },
              { lon: -46, lat: -21 },
              { lon: -47, lat: -26 },
              { lon: -55, lat: -27 }
            ]
          ],

          wetlands: [
            { start: 13, end: 17, label: "southern soft restoration boundary" },
            { start: 10, end: 12, label: "southeastern repaired wetland transition" }
          ]
        }
      }
    ],

    historyMap: {
      westCoast: {
        name: "Adversity Edge",
        meaning: "The coast that absorbed the oldest pressure.",
        topologyClasses: ["CLIFF_EDGE", "CAVERN_MOUTH"],
        terrainOwned: false,
        elevationOwned: false
      },
      northCoast: {
        name: "Continuance Edge",
        meaning: "The shoulder that remained open to light and movement after pressure.",
        topologyClasses: ["BEACH", "PENINSULA"],
        terrainOwned: false,
        elevationOwned: false
      },
      eastCoast: {
        name: "Reopening Edge",
        meaning: "The broken side that became access instead of closure.",
        topologyClasses: ["BEACH", "BAY", "INLET", "CAVERN_MOUTH", "PENINSULA"],
        terrainOwned: false,
        elevationOwned: false
      },
      southCoast: {
        name: "Restoration Edge",
        meaning: "The boundary where loss became survivable.",
        topologyClasses: ["BEACH", "BAY", "INLET", "LAGOON", "WETLAND"],
        terrainOwned: false,
        elevationOwned: false
      },
      interior: {
        name: "Memory Field",
        meaning: "Protected inland water boundaries that preserve memory without becoming terrain basins.",
        topologyClasses: ["LAKE"],
        terrainOwned: false,
        elevationOwned: false
      }
    },

    categoryMeanings: {
      LANDMASS: "above-seawater exposed land boundary",
      OCEAN_ADJACENCY: "where parent seawater contacts Gratitude's boundary",
      BEACH: "soft land/ocean transition category",
      CLIFF_EDGE: "hard shoreline category only; not vertical height",
      CAVERN_MOUTH: "shelter/opening category only; not a 3D cave",
      LAKE: "inland water boundary only; not a basin or hydrology simulation",
      BAY: "recessed ocean-contact category",
      INLET: "narrow ocean-entry category",
      PENINSULA: "outreach land extension category",
      LAGOON: "protected water boundary near restored coast",
      WETLAND: "soft land-water transition category"
    }
  });

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getTopology() {
    return clone(TOPOLOGY);
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      childSplitContract: CHILD_SPLIT_CONTRACT,
      parentFacingContract: PARENT_FACING_CONTRACT,
      parentComplianceContract: PARENT_COMPLIANCE_CONTRACT,
      target: TARGET,
      route: ROUTE,

      id: TOPOLOGY.id,
      summit: TOPOLOGY.summit,
      cells: TOPOLOGY.cells,
      className: TOPOLOGY.className,
      localLattice: TOPOLOGY.localLattice,

      topologyOnly: true,
      terrainOwned: false,
      elevationOwned: false,
      directDrawing: false,
      oceanOwned: false,
      formVisibleClaim: false,

      adversitySurvivalHistoryActive: true,
      gratitudeLaw: "Gratitude does not deny adversity; Gratitude remains open after adversity.",
      firstSurvivingContinent: true,
      westCoastAdversityEdge: true,
      northCoastContinuanceEdge: true,
      eastCoastReopeningEdge: true,
      southCoastRestorationEdge: true,
      interiorMemoryField: true,

      landmassCount: TOPOLOGY.landmasses.length,
      categoryMeanings: clone(TOPOLOGY.categoryMeanings),
      historyMap: clone(TOPOLOGY.historyMap),

      owns: [
        "Gratitude topology definition",
        "adversity-survival backstory",
        "exposed landmass boundary",
        "ocean adjacency classification",
        "beach categories",
        "cliff-edge categories only",
        "cavern-mouth categories only",
        "lake boundaries only",
        "bay categories",
        "inlet categories",
        "peninsula categories",
        "lagoon boundaries",
        "wetland categories"
      ],

      doesNotOwn: [
        "canvas",
        "FORM_VISIBLE",
        "parent projection",
        "ocean body",
        "seawater base",
        "terrain",
        "elevation",
        "height maps",
        "mountains",
        "valleys",
        "basins",
        "raised cliffs",
        "3D caverns",
        "hydrology simulation",
        "sky",
        "motion",
        "zoom",
        "orbit"
      ],

      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false
    };
  }

  const api = {
    CONTRACT,
    PREVIOUS_CONTRACT,
    CHILD_SPLIT_CONTRACT,
    PARENT_FACING_CONTRACT,
    PARENT_COMPLIANCE_CONTRACT,
    TARGET,
    ROUTE,
    getTopology,
    getStatus,
    status: getStatus
  };

  if (hasWindow()) {
    window.AUDRALIA_TOPOLOGY_GRATITUDE = api;
    window.AUDRALIA_TOPOLOGY_GRATITUDE_RECEIPT = getStatus();
    window.AUDRALIA_GRATITUDE_ADVERSITY_SURVIVAL_TOPOLOGY_ACTIVE = true;
  }
})();
