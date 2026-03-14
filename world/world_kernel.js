const PLANET_RADIUS = 6371;
const PLANET_DIAMETER = 12742;
const ATMOSPHERE_HEIGHT = 120;
const ATMOSPHERE_FADE_START = 60;

function avg(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function isFinitePoint(value) {
  return (
    value &&
    typeof value === "object" &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y)
  );
}

function normalizePoint(value) {
  if (isFinitePoint(value)) {
    return { x: value.x, y: value.y };
  }

  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  ) {
    return { x: value[0], y: value[1] };
  }

  return null;
}

function extractPointCollections(raw) {
  const collections = [];

  function visit(node) {
    if (!node) return;

    if (Array.isArray(node)) {
      if (node.length >= 3 && node.every((item) => normalizePoint(item))) {
        collections.push(node);
        return;
      }
      node.forEach(visit);
      return;
    }

    if (typeof node === "object") {
      if (node.geometry?.type === "Polygon" && Array.isArray(node.geometry.coordinates?.[0])) {
        collections.push(node.geometry.coordinates[0]);
        return;
      }

      if (node.geometry?.type === "MultiPolygon" && Array.isArray(node.geometry.coordinates)) {
        node.geometry.coordinates.forEach((polygon) => {
          if (Array.isArray(polygon?.[0])) {
            collections.push(polygon[0]);
          }
        });
        return;
      }

      if (Array.isArray(node.points)) {
        collections.push(node.points);
        return;
      }

      Object.values(node).forEach(visit);
    }
  }

  visit(raw);
  return collections;
}

function normalizeGeometryMap(rawMap) {
  const allPoints = [];

  Object.values(rawMap).forEach((raw) => {
    extractPointCollections(raw).forEach((collection) => {
      collection.forEach((item) => {
        const point = normalizePoint(item);
        if (point) {
          allPoints.push(point);
        }
      });
    });
  });

  if (!allPoints.length) {
    return {
      terrainPolygons: [],
      substratePolygons: [],
      coastlines: [],
      waters: [],
      paths: [],
    };
  }

  const xs = allPoints.map((point) => point.x);
  const ys = allPoints.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;

  function normalizeCollection(collections, prefix) {
    return collections
      .map((collection, index) => {
        const points = collection
          .map(normalizePoint)
          .filter(Boolean)
          .map((point) => ({
            x: (point.x - minX) / spanX,
            y: (point.y - minY) / spanY,
          }));

        if (points.length < 2) {
          return null;
        }

        return {
          id: `${prefix}-${index + 1}`,
          points,
        };
      })
      .filter(Boolean);
  }

  return {
    terrainPolygons: normalizeCollection(extractPointCollections(rawMap.terrain), "terrain"),
    substratePolygons: normalizeCollection(extractPointCollections(rawMap.substrate), "substrate"),
    coastlines: normalizeCollection(extractPointCollections(rawMap.coastlines), "coastline"),
    waters: normalizeCollection(extractPointCollections(rawMap.waters), "water"),
    paths: normalizeCollection(extractPointCollections(rawMap.paths), "path"),
  };
}

async function loadJson(relativePath, fallbackValue) {
  try {
    const url = new URL(relativePath, import.meta.url);
    const response = await fetch(url);

    if (!response.ok) {
      return fallbackValue;
    }

    return await response.json();
  } catch {
    return fallbackValue;
  }
}

function createFallbackHarborTerrain() {
  return [
    {
      id: "terrain-harbor-peninsula",
      points: [
        { x: 0.18, y: 0.80 },
        { x: 0.24, y: 0.70 },
        { x: 0.34, y: 0.60 },
        { x: 0.47, y: 0.54 },
        { x: 0.58, y: 0.52 },
        { x: 0.67, y: 0.55 },
        { x: 0.75, y: 0.62 },
        { x: 0.82, y: 0.71 },
        { x: 0.79, y: 0.80 },
        { x: 0.69, y: 0.87 },
        { x: 0.54, y: 0.90 },
        { x: 0.39, y: 0.89 },
        { x: 0.27, y: 0.85 },
      ],
    },
  ];
}

function createFallbackCoastline() {
  return createFallbackHarborTerrain().map((polygon) => ({
    id: `coast-${polygon.id}`,
    points: polygon.points,
  }));
}

function createFallbackOcean() {
  return [
    {
      id: "water-ocean-base",
      points: [
        { x: 0.0, y: 0.58 },
        { x: 1.0, y: 0.58 },
        { x: 1.0, y: 1.0 },
        { x: 0.0, y: 1.0 },
      ],
    },
  ];
}

function computeCoherence(state) {
  const energy = avg([state.E1, state.E2, state.E3]);
  const information = avg([state.I1, state.I2, state.I3]);
  const value = avg([state.V1, state.V2]);
  const score = Math.min(energy, information, value);

  return {
    energy: round3(energy),
    information: round3(information),
    value: round3(value),
    score: round3(score),
  };
}

function getCoherenceBand(score) {
  if (score >= 0.8) return "HIGH_COHERENCE";
  if (score >= 0.6) return "STABLE";
  if (score >= 0.4) return "STRAINED";
  if (score >= 0.2) return "CRITICAL";
  return "COLLAPSE_RISK";
}

function computePressureDelta(pressure) {
  return {
    E1: pressure.resourceScarcity * 0.03 + pressure.terrainFriction * 0.015,
    E2: pressure.resourceScarcity * 0.02 + pressure.environmentalNoise * 0.005,
    E3: pressure.routeObstruction * 0.02 + pressure.stormIntensity * 0.015,
    I1: pressure.visibilityLoss * 0.02 + pressure.environmentalNoise * 0.015,
    I2: pressure.humidityFogLoad * 0.015 + pressure.environmentalNoise * 0.02,
    I3: pressure.stormIntensity * 0.02 + pressure.visibilityLoss * 0.01,
    V1: pressure.resourceScarcity * 0.015 + pressure.waterAccessVariance * 0.015,
    V2: pressure.routeObstruction * 0.015 + pressure.environmentalNoise * 0.01,
  };
}

function computeInternalDelta(state) {
  return {
    E1: (state.E2 + state.E3) * 0.003,
    E2: (state.E1 + state.E3) * 0.0025,
    E3: (state.E1 + state.E2) * 0.002,
    I1: (state.I2 + state.I3) * 0.0025,
    I2: (state.I1 + state.I3) * 0.0025,
    I3: (state.I1 + state.I2) * 0.002,
    V1: (state.V2 + state.I2) * 0.0025,
    V2: (state.V1 + state.E2) * 0.0025,
  };
}

function evaluateGate(coherence, pressure) {
  const visibility = clamp01(1 - pressure.visibilityLoss);
  const routeViability = clamp01(1 - pressure.routeObstruction);
  const resourceSufficiency = clamp01(1 - pressure.resourceScarcity);

  const recoveryScore = clamp01(
    coherence.score * 0.4 +
    visibility * 0.15 +
    routeViability * 0.25 +
    resourceSufficiency * 0.2
  );

  return {
    threshold: 0.61,
    recoveryScore: round3(recoveryScore),
    result: recoveryScore >= 0.61 ? "PASS_GATE" : "FAIL_GATE",
  };
}

function computeRepairDelta(coherence, gate) {
  const base = gate.result === "PASS_GATE" ? coherence.score * 0.006 : 0.0015;

  return {
    E1: base,
    E2: base * 0.9,
    E3: base * 0.9,
    I1: base,
    I2: base,
    I3: base * 0.85,
    V1: base * 1.05,
    V2: base,
  };
}

function classifyBasin(state) {
  const signatures = [
    { name: "Gratitude", E: 0.62, I: 0.58, V: 0.68 },
    { name: "Generosity", E: 0.64, I: 0.60, V: 0.74 },
    { name: "Dependability", E: 0.72, I: 0.66, V: 0.63 },
    { name: "Accountability", E: 0.68, I: 0.75, V: 0.62 },
    { name: "Humility", E: 0.57, I: 0.69, V: 0.70 },
    { name: "Forgiveness", E: 0.59, I: 0.63, V: 0.76 },
    { name: "Self-Control", E: 0.76, I: 0.64, V: 0.64 },
    { name: "Patience", E: 0.61, I: 0.67, V: 0.72 },
    { name: "Purity", E: 0.82, I: 0.82, V: 0.82 },
  ];

  const point = {
    E: avg([state.E1, state.E2, state.E3]),
    I: avg([state.I1, state.I2, state.I3]),
    V: avg([state.V1, state.V2]),
  };

  let best = { name: "Gratitude", distance: Number.POSITIVE_INFINITY };

  for (const signature of signatures) {
    const distance =
      Math.abs(point.E - signature.E) +
      Math.abs(point.I - signature.I) +
      Math.abs(point.V - signature.V);

    if (distance < best.distance) {
      best = { name: signature.name, distance };
    }
  }

  return {
    name: best.name,
    confidence: round3(clamp01(1 - best.distance / 1.5)),
  };
}

export async function createWorldKernel() {
  const [
    rawTerrain,
    rawSubstrate,
    rawCoastlines,
    rawWaters,
    rawPaths,
    rawRegions,
  ] = await Promise.all([
    loadJson("./data/terrain_polygons.json", []),
    loadJson("./data/substrate_polygons.json", []),
    loadJson("./data/coastlines.json", []),
    loadJson("./data/waters.json", []),
    loadJson("./data/paths.json", []),
    loadJson("./data/regions.json", []),
  ]);

  const normalized = normalizeGeometryMap({
    terrain: rawTerrain,
    substrate: rawSubstrate,
    coastlines: rawCoastlines,
    waters: rawWaters,
    paths: rawPaths,
  });

  const regions = Array.isArray(rawRegions)
    ? rawRegions.map((entry, index) => ({
        id: entry?.id || `region-${index + 1}`,
        name: entry?.name || `Region ${index + 1}`,
        center: normalizePoint(entry?.center) || { x: 0.5, y: 0.72 },
      }))
    : [];

  function createWorldPayload() {
    return {
      terrainPolygons: normalized.terrainPolygons.length
        ? normalized.terrainPolygons
        : createFallbackHarborTerrain(),
      substratePolygons: normalized.substratePolygons,
      coastlines: normalized.coastlines.length
        ? normalized.coastlines
        : createFallbackCoastline(),
      waters: normalized.waters.length
        ? normalized.waters
        : createFallbackOcean(),
      paths: normalized.paths,
      regions: regions.length
        ? regions
        : [
            {
              id: "region-harbor",
              name: "Harbor Continent",
              center: { x: 0.5, y: 0.72 },
            },
          ],
      markers: [],
      labels: [],
      environment: {
        projectionMode: "PSEUDO_PLANET_SURFACE_PROJECTION",
        planetRadius: PLANET_RADIUS,
        planetDiameter: PLANET_DIAMETER,
        atmosphereHeight: ATMOSPHERE_HEIGHT,
        atmosphereFadeStart: ATMOSPHERE_FADE_START,
        pressure: {},
        coherence: {},
        basin: {},
        gate: {},
        visibility: 1,
        stormIntensity: 0.2,
        humidityFogLoad: 0.2,
        waterAccessVariance: 0.15,
      },
      runtimeState: {
        tickId: 0,
        timestamp: 0,
        stateBefore: {},
        pressureBefore: {},
        stateAfter: {},
        coherenceBand: "PENDING",
        gateResult: {},
        basinClassification: {},
        renderStatus: "PENDING",
        performanceStatus: "PENDING",
        receipt: null,
      },
    };
  }

  function getInitialState() {
    return {
      E1: 0.7,
      E2: 0.7,
      E3: 0.7,
      I1: 0.7,
      I2: 0.7,
      I3: 0.7,
      V1: 0.7,
      V2: 0.7,
    };
  }

  function getInitialPressure() {
    return {
      terrainFriction: 0.3,
      visibilityLoss: 0.1,
      stormIntensity: 0.2,
      humidityFogLoad: 0.2,
      waterAccessVariance: 0.15,
      routeObstruction: 0.1,
      resourceScarcity: 0.2,
      environmentalNoise: 0.15,
    };
  }

  function clampState(value) {
    return round3(clamp01(value));
  }

  return {
    createWorldPayload,
    getInitialState,
    getInitialPressure,
    clampState,
    computeCoherence,
    getCoherenceBand,
    computePressureDelta,
    computeInternalDelta,
    evaluateGate,
    computeRepairDelta,
    classifyBasin,
  };
}
