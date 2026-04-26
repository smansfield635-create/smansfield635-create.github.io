/* TNT RENEWAL — /runtime/planet_projection.js
   PLANET PROJECTION · GENERATION 2 PASSIVE MATH HELPER B1

   VERSION = "G2_PASSIVE_PLANET_PROJECTION_B1"

   PURPOSE:
     - Keep this file as a pure Euclidean projection helper.
     - Do not mutate DOM.
     - Do not bind controls.
     - Do not own cockpit state.
     - Do not own canopy truth.
     - Do not own render CSS.
     - Do not start timers.
     - Do not create observers.
     - Return deterministic projection objects only.
*/

const META = Object.freeze({
  name: "PLANET_PROJECTION",
  version: "G2_PASSIVE_PLANET_PROJECTION_B1",
  role: "pure_euclidean_projection_helper",
  contract: "PLANET_PROJECTION_NON_OVERLAP_CONTRACT_G2",
  status: "ACTIVE_PASSIVE",
  deterministic: true
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
}

function toNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function clamp(value, min, max) {
  const next = toNumber(value, min);
  if (next < min) return min;
  if (next > max) return max;
  return next;
}

function normalizeViewport(viewport = {}) {
  const width = toNumber(viewport.width, 1280);
  const height = toNumber(viewport.height, 720);
  const dpr = toNumber(viewport.dpr, 1);

  return deepFreeze({
    width: width > 0 ? width : 1280,
    height: height > 0 ? height : 720,
    dpr: dpr > 0 ? dpr : 1
  });
}

function normalizeProjectionState(projectionState = {}) {
  const frameRadius = toNumber(projectionState.frameRadius, 136);
  const centerYRatio = toNumber(projectionState.centerYRatio, 0.56);
  const scaleRatio = toNumber(projectionState.scaleRatio, 0.34);

  return deepFreeze({
    frameRadius: frameRadius > 0 ? frameRadius : 136,
    centerYRatio: clamp(centerYRatio, 0.2, 0.8),
    scaleRatio: clamp(scaleRatio, 0.08, 0.8)
  });
}

function projectPoint(point = {}, cx, cy, scale) {
  const x = toNumber(point.x, 0);
  const y = toNumber(point.y, 0);

  return deepFreeze({
    x: cx + x * scale,
    y: cy + y * scale
  });
}

export function createPlanetProjection(viewport = {}, projectionState = {}) {
  const vp = normalizeViewport(viewport);
  const ps = normalizeProjectionState(projectionState);

  const scale = (Math.min(vp.width, vp.height) * ps.scaleRatio) / ps.frameRadius;
  const cx = vp.width * 0.5;
  const cy = vp.height * ps.centerYRatio;

  return deepFreeze({
    meta: META,

    ownership: {
      writesDom: false,
      bindsControls: false,
      ownsCockpitState: false,
      ownsCanopyTruth: false,
      ownsRenderCss: false,
      ownsWorldLaw: false,
      ownsProjectionMath: true
    },

    width: vp.width,
    height: vp.height,
    dpr: vp.dpr,
    cx,
    cy,
    scale,
    frameRadius: ps.frameRadius,

    project(point = {}) {
      return projectPoint(point, cx, cy, scale);
    },

    projectRadius(radius) {
      return Math.max(0, toNumber(radius, 0) * scale);
    },

    projectPolygon(points = []) {
      if (!Array.isArray(points)) return deepFreeze([]);
      return deepFreeze(points.map((point) => projectPoint(point, cx, cy, scale)));
    },

    toAlpha(value) {
      return clamp(value, 0, 1);
    },

    getReceipt() {
      return deepFreeze({
        meta: META,
        width: vp.width,
        height: vp.height,
        dpr: vp.dpr,
        cx,
        cy,
        scale,
        frameRadius: ps.frameRadius,
        deterministic: true
      });
    }
  });
}

export function getPlanetProjectionReceipt(viewport = {}, projectionState = {}) {
  return createPlanetProjection(viewport, projectionState).getReceipt();
}

const PLANET_PROJECTION_API = Object.freeze({
  meta: META,
  createPlanetProjection,
  getPlanetProjectionReceipt
});

export default PLANET_PROJECTION_API;
