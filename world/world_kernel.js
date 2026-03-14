import { createHarborContinentPayload } from "../variant/data/harbor_continent_payload.js";

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

function applyJsonOverrides(base) {
  return async function build() {
    const sourceTerrain = await tryLoadJson("./data/terrain_polygons.json");
    const sourceCoastlines = await tryLoadJson("./data/coastlines.json");
    const sourceWaters = await tryLoadJson("./data/waters.json");

    const terrainOverride = Array.isArray(sourceTerrain)
      ? sourceTerrain.map(coercePolygon).filter(Boolean)
      : [];
    const coastlineOverride = Array.isArray(sourceCoastlines)
      ? sourceCoastlines.map(coercePolygon).filter(Boolean)
      : [];
    const waterOverride = Array.isArray(sourceWaters)
      ? sourceWaters.map(coercePolygon).filter(Boolean)
      : [];

    if (terrainOverride.length) {
      base.terrainPolygons = terrainOverride;
    }

    if (coastlineOverride.length) {
      base.coastlines = coastlineOverride;
    }

    if (waterOverride.length) {
      base.waters = waterOverride;
    }

    return base;
  };
}

export async function createWorldKernel() {
  const payload = createHarborContinentPayload();
  const finalize = applyJsonOverrides(payload);
  return await finalize();
}
