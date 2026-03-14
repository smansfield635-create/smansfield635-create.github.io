import { HARBOR_CONTINENT_BLUEPRINT } from "./harbor_continent_blueprint.js";
import { buildHarborSandbarArc } from "../world/sandbar_arc.js";
import { HARBOR_WATER_DEPTH_BANDS } from "../world/water_depth_bands.js";

function normalizePolygon(points) {
  return points.map(([x, y]) => [x / 1000, y / 520]);
}

function mainlandPolygon() {
  return normalizePolygon([
    [40, 435],
    [90, 300],
    [180, 185],
    [320, 95],
    [500, 70],
    [700, 92],
    [845, 132],
    [940, 210],
    [960, 292],
    [910, 360],
    [800, 420],
    [660, 462],
    [500, 490],
    [300, 502],
    [130, 480]
  ]);
}

function gratitudePolygon() {
  return normalizePolygon([
    [70, 420],
    [110, 310],
    [180, 220],
    [280, 165],
    [380, 148],
    [475, 182],
    [455, 276],
    [380, 350],
    [280, 402],
    [150, 430]
  ]);
}

function generosityPolygon() {
  return normalizePolygon([
    [430, 186],
    [520, 118],
    [690, 105],
    [830, 138],
    [905, 208],
    [880, 300],
    [780, 352],
    [650, 360],
    [540, 322],
    [470, 252]
  ]);
}

function transitionPolygon() {
  return normalizePolygon([
    [415, 205],
    [470, 175],
    [550, 178],
    [585, 230],
    [558, 292],
    [495, 315],
    [438, 280]
  ]);
}

function mainIslandPolygon() {
  return normalizePolygon([
    [670, 385],
    [705, 332],
    [770, 300],
    [838, 314],
    [875, 354],
    [868, 406],
    [825, 446],
    [754, 450],
    [694, 426]
  ]);
}

function secondaryIslandPolygon() {
  return normalizePolygon([
    [864, 336],
    [884, 311],
    [917, 303],
    [946, 316],
    [951, 342],
    [932, 360],
    [898, 365],
    [873, 354]
  ]);
}

function tertiaryIslandPolygon() {
  return normalizePolygon([
    [904, 407],
    [923, 388],
    [950, 383],
    [973, 392],
    [978, 414],
    [962, 431],
    [932, 434],
    [910, 425]
  ]);
}

function outerCayPolygon() {
  return normalizePolygon([
    [955, 457],
    [972, 446],
    [995, 446],
    [1010, 455],
    [1011, 469],
    [994, 479],
    [968, 478],
    [954, 470]
  ]);
}

function lagoonPolygon() {
  return normalizePolygon([
    [530, 430],
    [585, 342],
    [650, 292],
    [735, 278],
    [825, 290],
    [925, 338],
    [995, 418],
    [990, 500],
    [530, 500]
  ]);
}

function outerOceanPolygon() {
  return [
    [0.00, 0.54],
    [1.10, 0.54],
    [1.10, 1.02],
    [0.00, 1.02]
  ];
}

export function createHarborContinentPayload() {
  const sandbars = buildHarborSandbarArc();

  const mainland = mainlandPolygon();
  const gratitude = gratitudePolygon();
  const generosity = generosityPolygon();
  const transition = transitionPolygon();

  const mainIsland = mainIslandPolygon();
  const secondaryIsland = secondaryIslandPolygon();
  const tertiaryIsland = tertiaryIslandPolygon();
  const outerCay = outerCayPolygon();

  const lagoon = lagoonPolygon();
  const outerOcean = outerOceanPolygon();

  return {
    id: "harbor_continent_payload_v1",
    blueprint: HARBOR_CONTINENT_BLUEPRINT,
    waterBands: HARBOR_WATER_DEPTH_BANDS,
    terrainPolygons: [
      mainland,
      gratitude,
      generosity,
      transition,
      mainIsland,
      secondaryIsland,
      tertiaryIsland,
      outerCay,
      ...sandbars.map((bar) => bar.polygon)
    ],
    substratePolygons: [
      mainland,
      mainIsland
    ],
    coastlines: [
      mainland,
      mainIsland,
      secondaryIsland,
      tertiaryIsland,
      outerCay,
      ...sandbars.map((bar) => bar.polygon)
    ],
    waters: [
      outerOcean,
      lagoon
    ],
    paths: [],
    regions: [
      {
        id: "gratitude_region",
        name: "Gratitude",
        type: "region",
        center: [270 / 1000, 300 / 520],
        polygon: gratitude
      },
      {
        id: "generosity_region",
        name: "Generosity",
        type: "region",
        center: [710 / 1000, 215 / 520],
        polygon: generosity
      },
      {
        id: "harbor_region",
        name: "Harbor Region",
        type: "region",
        center: [790 / 1000, 365 / 520],
        polygon: mainIsland
      }
    ],
    markers: [
      {
        id: "harbor_village_anchor",
        name: "Harbor Village",
        type: "settlement_anchor",
        point: [760 / 1000, 372 / 520],
        hitRadius: 0.028
      },
      {
        id: "lighthouse_anchor",
        name: "Harbor Lighthouse",
        type: "landmark_anchor",
        point: [716 / 1000, 346 / 520],
        hitRadius: 0.018
      }
    ],
    labels: [
      {
        id: "gratitude_label",
        text: "Gratitude",
        point: [255 / 1000, 278 / 520]
      },
      {
        id: "generosity_label",
        text: "Generosity",
        point: [700 / 1000, 210 / 520]
      },
      {
        id: "harbor_label",
        text: "Harbor",
        point: [785 / 1000, 360 / 520]
      }
    ],
    environment: {
      mood: "luminous_resort_lagoon",
      harborStability: 0.84,
      mistAmount: 0.22,
      outerSeaTone: 0.72,
      lagoonTone: 0.96,
      beachShallowTone: 1.00
    },
    runtimeState: {
      phase: "stage_1_harbor_continent"
    },
    pressure: {
      terrainFriction: 0.18,
      visibilityLoss: 0.04,
      stormIntensity: 0.08,
      humidityFogLoad: 0.10,
      waterAccessVariance: 0.04,
      routeObstruction: 0.06,
      resourceScarcity: 0.06,
      environmentalNoise: 0.08
    },
    arcs: [
      {
        id: "gratitude_to_harbor_arc",
        from: [330 / 1000, 330 / 520],
        to: [760 / 1000, 372 / 520]
      },
      {
        id: "generosity_to_harbor_arc",
        from: [760 / 1000, 230 / 520],
        to: [760 / 1000, 372 / 520]
      }
    ]
  };
}
