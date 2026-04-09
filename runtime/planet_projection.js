const META = Object.freeze({
  name: "PLANET_PROJECTION",
  version: "G1_EXTERNAL_BASELINE",
  role: "euclidean_projection",
  contract: "PLANET_PROJECTION_CONTRACT_G1",
  status: "ACTIVE",
  deterministic: true
});

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function createPlanetProjection(viewport = {}, projectionState = {}) {
  const width =
    Number.isFinite(viewport.width) && viewport.width > 0 ? viewport.width : 1280;
  const height =
    Number.isFinite(viewport.height) && viewport.height > 0 ? viewport.height : 720;

  const frameRadius =
    Number.isFinite(projectionState.frameRadius) && projectionState.frameRadius > 0
      ? projectionState.frameRadius
      : 136;

  const scale = Math.min(width, height) * 0.34 / frameRadius;
  const cx = width * 0.5;
  const cy = height * 0.56;

  return {
    meta: META,
    width,
    height,
    cx,
    cy,
    scale,
    project(point = {}) {
      const x = Number(point.x || 0);
      const y = Number(point.y || 0);
      return {
        x: cx + x * scale,
        y: cy + y * scale
      };
    },
    projectRadius(radius) {
      const value = Number(radius || 0);
      return Math.max(0, value * scale);
    },
    projectPolygon(points = []) {
      return points.map((point) => this.project(point));
    },
    toAlpha(value) {
      return clamp(value, 0, 1);
    }
  };
}

export default {
  meta: META,
  createPlanetProjection
};
