// /assets/audralia/clean/engine/audralia/engine/continents/gratitude.js
// AUDRALIA_G2_6_TOPOLOGY_ONLY_GRATITUDE_CHILD_TNT_v1
// Full-file replacement.
// Purpose: define the Gratitude continent as a topology-only child: exposed landmass boundary, coast categories, lake boundary, bay/inlet/peninsula/cavern-mouth/wetland classes.
// Classic script. No imports. No exports. No direct drawing.
// Does not own: parent geometry, canvas, FORM_VISIBLE, ocean body, terrain, elevation, mountains, valleys, raised cliffs, 3D caverns, sky, motion, zoom, orbit, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_GRATITUDE_CHILD_TNT_v1";
  const CHILD_SPLIT_CONTRACT = "AUDRALIA_G2_6_TOPOLOGY_ONLY_CONTINENT_CHILD_SPLIT_TNT_v1";
  const PARENT_FACING_CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia/engine/continents/gratitude.js";
  const ROUTE = "/showroom/globe/audralia/";

  const TOPOLOGY = Object.freeze({
    id: "gratitude-primary-topology",
    summit: "Gratitude",
    cells: 21,
    className: "primary",
    localLattice: "gratitude_21_restored_origin_topology_lattice",
    backstory:
      "Restored origin body / primary external Summit expression. Broad living mainland, repaired bays, generous ocean access, stable inland lake boundary, and accessible beach arcs.",
    topologyOnly: true,
    terrainOwned: false,
    elevationOwned: false,
    color: "rgba(78, 170, 106, 0.72)",
    landmasses: [
      {
        id: "gratitude-mainland",
        type: "primary",
        cells: 21,
        oceanAdjacency: true,
        boundary: [
          { lon: -72, lat: 20 },
          { lon: -65, lat: 31 },
          { lon: -54, lat: 37 },
          { lon: -41, lat: 35 },
          { lon: -28, lat: 31 },
          { lon: -18, lat: 22 },
          { lon: -14, lat: 10 },
          { lon: -18, lat: 1 },
          { lon: -24, lat: -7 },
          { lon: -28, lat: -18 },
          { lon: -37, lat: -28 },
          { lon: -51, lat: -25 },
          { lon: -60, lat: -17 },
          { lon: -68, lat: -8 },
          { lon: -74, lat: 4 },
          { lon: -78, lat: 13 }
        ],
        topology: {
          oceanAdjacency: true,
          beaches: [
            { start: 1, end: 4, label: "northern accessible beach arc" },
            { start: 8, end: 11, label: "southern restored beach arc" }
          ],
          cliffEdges: [
            { start: 13, end: 15, label: "western hard coast category" }
          ],
          cavernMouths: [
            { lon: -70, lat: 7, label: "repaired western cavern-mouth boundary" },
            { lon: -22, lat: 4, label: "eastern inlet cavern-mouth boundary" }
          ],
          lakes: [
            [
              { lon: -49, lat: 15 },
              { lon: -44, lat: 19 },
              { lon: -37, lat: 17 },
              { lon: -35, lat: 11 },
              { lon: -40, lat: 7 },
              { lon: -47, lat: 9 }
            ]
          ],
          bays: [
            { start: 6, end: 8, label: "eastern repaired bay" },
            { start: 11, end: 13, label: "southwestern restored bay" }
          ],
          inlets: [
            { start: 5, end: 7, label: "eastern narrow inlet" }
          ],
          peninsulas: [
            { start: 0, end: 2, label: "northwestern gratitude shoulder" },
            { start: 3, end: 5, label: "northeastern generous peninsula" }
          ],
          lagoons: [
            [
              { lon: -61, lat: -10 },
              { lon: -57, lat: -7 },
              { lon: -53, lat: -10 },
              { lon: -55, lat: -14 },
              { lon: -60, lat: -14 }
            ]
          ],
          wetlands: [
            { start: 9, end: 11, label: "southern soft restoration wetland" }
          ]
        }
      }
    ]
  });

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function getTopology() {
    return JSON.parse(JSON.stringify(TOPOLOGY));
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      childSplitContract: CHILD_SPLIT_CONTRACT,
      parentFacingContract: PARENT_FACING_CONTRACT,
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
      landmassCount: TOPOLOGY.landmasses.length,
      owns: [
        "Gratitude topology definition",
        "exposed landmass boundary",
        "beach category",
        "cliff-edge category only",
        "cavern-mouth category only",
        "lake boundary",
        "bay category",
        "inlet category",
        "peninsula category",
        "lagoon boundary",
        "wetland category",
        "ocean adjacency classification"
      ],
      doesNotOwn: [
        "canvas",
        "FORM_VISIBLE",
        "parent projection",
        "ocean body",
        "terrain",
        "elevation",
        "mountains",
        "valleys",
        "raised cliffs",
        "3D caverns",
        "sky",
        "motion"
      ],
      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false
    };
  }

  const api = {
    CONTRACT,
    CHILD_SPLIT_CONTRACT,
    PARENT_FACING_CONTRACT,
    TARGET,
    ROUTE,
    getTopology,
    getStatus,
    status: getStatus
  };

  if (hasWindow()) {
    window.AUDRALIA_TOPOLOGY_GRATITUDE = api;
    window.AUDRALIA_TOPOLOGY_GRATITUDE_RECEIPT = getStatus();
  }
})();
