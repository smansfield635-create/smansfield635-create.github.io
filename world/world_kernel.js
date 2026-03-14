async function tryLoadJson(relativePath) {
  try {
    const url = new URL(relativePath, import.meta.url);
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function isPolygonArray(value) {
  return Array.isArray(value) &&
    value.length >= 3 &&
    value.every((point) =>
      Array.isArray(point) &&
      point.length >= 2 &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1])
    );
}

function coercePolygon(value) {
  if (isPolygonArray(value)) return value;
  if (Array.isArray(value?.points) && isPolygonArray(value.points)) return value.points;
  return null;
}

export async function createWorldKernel() {
  const sourceTerrain = await tryLoadJson("./data/terrain_polygons.json");
  const sourceCoastlines = await tryLoadJson("./data/coastlines.json");
  const sourceWaters = await tryLoadJson("./data/waters.json");

  const harborPeninsula = [
    [0.18, 0.83],
    [0.24, 0.74],
    [0.31, 0.67],
    [0.39, 0.61],
    [0.48, 0.57],
    [0.57, 0.55],
    [0.65, 0.56],
    [0.71, 0.59],
    [0.76, 0.64],
    [0.79, 0.70],
    [0.80, 0.77],
    [0.77, 0.83],
    [0.71, 0.88],
    [0.62, 0.91],
    [0.51, 0.92],
    [0.40, 0.91],
    [0.30, 0.88],
    [0.22, 0.86]
  ];

  const inlandRise = [
    [0.26, 0.80],
    [0.33, 0.72],
    [0.43, 0.66],
    [0.54, 0.63],
    [0.63, 0.64],
    [0.70, 0.68],
    [0.73, 0.74],
    [0.70, 0.79],
    [0.62, 0.82],
    [0.52, 0.83],
    [0.41, 0.84],
    [0.32, 0.84]
  ];

  const explorationBasin = [
    [0.33, 0.63],
    [0.40, 0.59],
    [0.49, 0.57],
    [0.57, 0.58],
    [0.63, 0.61],
    [0.64, 0.66],
    [0.59, 0.69],
    [0.50, 0.70],
    [0.41, 0.69],
    [0.35, 0.67]
  ];

  const outerOcean = [
    [0.00, 0.52],
    [1.00, 0.52],
    [1.00, 1.00],
    [0.00, 1.00]
  ];

  const harborBasin = [
    [0.50, 0.66],
    [0.56, 0.64],
    [0.62, 0.64],
    [0.67, 0.67],
    [0.69, 0.72],
    [0.68, 0.77],
    [0.64, 0.80],
    [0.58, 0.81],
    [0.52, 0.79],
    [0.48, 0.74]
  ];

  const terrainPolygons = [];
  const sourceTerrainPolygons = Array.isArray(sourceTerrain) ? sourceTerrain.map(coercePolygon).filter(Boolean) : [];
  if (sourceTerrainPolygons.length) {
    terrainPolygons.push(...sourceTerrainPolygons);
  } else {
    terrainPolygons.push(harborPeninsula, inlandRise, explorationBasin);
  }

  const coastlines = [];
  const sourceCoastlinePolygons = Array.isArray(sourceCoastlines) ? sourceCoastlines.map(coercePolygon).filter(Boolean) : [];
  if (sourceCoastlinePolygons.length) {
    coastlines.push(...sourceCoastlinePolygons);
  } else {
    coastlines.push(harborPeninsula);
  }

  const waters = [];
  const sourceWaterPolygons = Array.isArray(sourceWaters) ? sourceWaters.map(coercePolygon).filter(Boolean) : [];
  if (sourceWaterPolygons.length) {
    waters.push(...sourceWaterPolygons);
  } else {
    waters.push(outerOcean, harborBasin);
  }

  return {
    terrainPolygons,
    substratePolygons: [inlandRise],
    coastlines,
    waters,
    paths: [],
    regions: [
      {
        id: "harbor_region",
        name: "Harbor Region",
        type: "region",
        center: [0.55, 0.74],
        polygon: harborPeninsula
      },
      {
        id: "exploration_basin",
        name: "Exploration Basin",
        type: "region",
        center: [0.49, 0.64],
        polygon: explorationBasin
      }
    ],
    markers: [
      {
        id: "harbor_village_anchor",
        name: "Harbor Village",
        type: "settlement_anchor",
        point: [0.57, 0.73],
        hitRadius: 0.035
      }
    ],
    labels: [],
    environment: {
      mood: "misted_coastal_harbor",
      harborStability: 0.72,
      mistAmount: 0.42,
      outerSeaTone: 0.78,
      basinTone: 0.92
    },
    runtimeState: {
      phase: "stage_1_harbor"
    },
    pressure: {
      terrainFriction: 0.30,
      visibilityLoss: 0.10,
      stormIntensity: 0.20,
      humidityFogLoad: 0.20,
      waterAccessVariance: 0.15,
      routeObstruction: 0.10,
      resourceScarcity: 0.20,
      environmentalNoise: 0.15
    }
  };
}
