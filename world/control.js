import { createWorldKernel } from "./world_kernel.js";

const CONTROL_META = Object.freeze({
  name: "CONTROL",
  version: "G2_SOLAR_TEMPLATE_BASELINE",
  role: "world_scale_camera_and_label_governance",
  contract: "CONTROL_CONTRACT_G2_SOLAR_TEMPLATE",
  status: "ACTIVE",
  deterministic: true
});

const KERNEL = createWorldKernel();

const WORLD_DIMENSIONS_KM = Object.freeze({
  width: 256_000_000,
  height: 256_000_000
});

const SCALE_MODE = "COMPRESSED_PROPORTIONAL";

const CAMERA_POLICY = Object.freeze({
  type: "BOUNDING_CAMERA",
  fit: "ENTIRE_WORLD",
  keepSunCentered: true,
  lockWorldToViewport: true,
  allowPointerParallax: true,
  mobileInsetRatio: 0.12,
  desktopInsetRatio: 0.08
});

const LABEL_POLICY = Object.freeze({
  mode: "ATTACHED_TO_PLANETS",
  centerReservedForSunOnly: true,
  allowHoverMeta: true,
  preventCenterCollision: true,
  mobileSafe: true,
  minLabelOffsetPx: 0,
  metaOffsetPx: 10
});

const SOLAR_POLICY = Object.freeze({
  template: "FULL_NINE_PLANET_SYSTEM",
  includePluto: true,
  centerBody: "sun",
  orbitModel: "EUCLIDEAN_ELLIPTICAL_TEMPLATE",
  orbitConditioning: "REAL_SOLAR_SYSTEM_COMPRESSED_PROPORTIONAL",
  bodyCount: 9
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function isMobileViewport(viewport = {}) {
  return Number(viewport.width || 0) <= 760;
}

function getViewport(viewport = {}) {
  const width = Number.isFinite(viewport.width) && viewport.width > 0 ? viewport.width : 1280;
  const height = Number.isFinite(viewport.height) && viewport.height > 0 ? viewport.height : 720;
  const dpr = Number.isFinite(viewport.dpr) && viewport.dpr > 0 ? viewport.dpr : 1;

  return { width, height, dpr };
}

function getCameraInsetRatio(viewport = {}) {
  return isMobileViewport(viewport)
    ? CAMERA_POLICY.mobileInsetRatio
    : CAMERA_POLICY.desktopInsetRatio;
}

export function getWorldDimensionsKm() {
  return WORLD_DIMENSIONS_KM;
}

export function getScaleMode() {
  return SCALE_MODE;
}

export function getSolarPolicy() {
  return SOLAR_POLICY;
}

export function getLabelPolicy() {
  return LABEL_POLICY;
}

export function getCameraPolicy() {
  return CAMERA_POLICY;
}

export function getUniverseBoundsKm() {
  const halfWidth = WORLD_DIMENSIONS_KM.width * 0.5;
  const halfHeight = WORLD_DIMENSIONS_KM.height * 0.5;

  return deepFreeze({
    minX: -halfWidth,
    maxX: halfWidth,
    minY: -halfHeight,
    maxY: halfHeight,
    width: WORLD_DIMENSIONS_KM.width,
    height: WORLD_DIMENSIONS_KM.height
  });
}

export function getUniverseCenterKm() {
  return deepFreeze({
    x: 0,
    y: 0
  });
}

export function getSunExclusionRadiusKm() {
  /*
    This is a control-space protection boundary for layout/readability,
    not the literal solar radius.
  */
  return 22_000_000;
}

export function getCameraFrame(viewport = {}) {
  const nextViewport = getViewport(viewport);
  const insetRatio = getCameraInsetRatio(nextViewport);

  const drawableWidthPx = Math.max(1, nextViewport.width * (1 - insetRatio * 2));
  const drawableHeightPx = Math.max(1, nextViewport.height * (1 - insetRatio * 2));

  const kmPerPxX = WORLD_DIMENSIONS_KM.width / drawableWidthPx;
  const kmPerPxY = WORLD_DIMENSIONS_KM.height / drawableHeightPx;
  const kmPerPx = Math.max(kmPerPxX, kmPerPxY);

  const pxPerKm = 1 / kmPerPx;

  return deepFreeze({
    world: getUniverseBoundsKm(),
    viewport: nextViewport,
    insetRatio,
    drawableWidthPx,
    drawableHeightPx,
    kmPerPx,
    pxPerKm,
    centerPx: {
      x: nextViewport.width * 0.5,
      y: nextViewport.height * 0.5
    }
  });
}

export function worldToViewport(pointKm = {}, viewport = {}) {
  const frame = getCameraFrame(viewport);
  const xKm = Number.isFinite(pointKm.x) ? pointKm.x : 0;
  const yKm = Number.isFinite(pointKm.y) ? pointKm.y : 0;

  return deepFreeze({
    x: frame.centerPx.x + xKm * frame.pxPerKm,
    y: frame.centerPx.y + yKm * frame.pxPerKm
  });
}

export function radiusKmToPx(radiusKm, viewport = {}) {
  const frame = getCameraFrame(viewport);
  const nextRadiusKm = Number.isFinite(radiusKm) && radiusKm >= 0 ? radiusKm : 0;
  return nextRadiusKm * frame.pxPerKm;
}

export function getControlReceipt(options = {}) {
  const hostRead = KERNEL.getHostRead();
  const viewport = getViewport(options.viewport || {});
  const cameraFrame = getCameraFrame(viewport);

  return deepFreeze({
    meta: CONTROL_META,
    verification: {
      pass: true,
      deterministic: true,
      scaleMode: SCALE_MODE
    },
    hostEntry: hostRead.publicEntry,
    house: hostRead.house,
    roomCount: hostRead.roomCount,
    descendantOrder: ["render", "control", "index", "explore", "products"],
    publicTraversal: {
      houseFirst: true,
      metaverseRequired: false,
      roomsVisible: true,
      programmableRooms: true
    },
    runtimeLaw: {
      localRuntimeAllowedForDistinctSpines: true,
      globalHostTruthRequired: true,
      signalSubordinateToGeometry: true
    },
    controlState: {
      phase: "READY",
      admissible: true,
      activeSurface: "solar_template_universe",
      pageContext: "richie_richs_manor",
      animationContext: "demo_template_universe",
      bodyCount: SOLAR_POLICY.bodyCount,
      centerReservedForSunOnly: LABEL_POLICY.centerReservedForSunOnly
    },
    world: {
      widthKm: WORLD_DIMENSIONS_KM.width,
      heightKm: WORLD_DIMENSIONS_KM.height,
      boundsKm: getUniverseBoundsKm(),
      centerKm: getUniverseCenterKm()
    },
    camera: cameraFrame,
    solarPolicy: SOLAR_POLICY,
    labelPolicy: LABEL_POLICY
  });
}

export function getControlPlan(options = {}) {
  const receipt = getControlReceipt(options);

  return deepFreeze({
    meta: CONTROL_META,
    intent: "governed_solar_template_universe",
    entry: receipt.hostEntry,
    next: ["planet_engine", "world_runtime", "render", "index"],
    state: receipt.controlState,
    world: receipt.world,
    camera: {
      kmPerPx: receipt.camera.kmPerPx,
      pxPerKm: receipt.camera.pxPerKm,
      drawableWidthPx: receipt.camera.drawableWidthPx,
      drawableHeightPx: receipt.camera.drawableHeightPx
    },
    solarPolicy: receipt.solarPolicy,
    labelPolicy: receipt.labelPolicy
  });
}

export function getLabelVisibilityPolicy(viewport = {}) {
  const nextViewport = getViewport(viewport);
  const mobile = isMobileViewport(nextViewport);

  return deepFreeze({
    mode: LABEL_POLICY.mode,
    centerReservedForSunOnly: LABEL_POLICY.centerReservedForSunOnly,
    showMetaByDefault: false,
    showMetaOnHover: LABEL_POLICY.allowHoverMeta,
    preventCenterCollision: LABEL_POLICY.preventCenterCollision,
    minPlanetToSunDistancePx: clamp(
      radiusKmToPx(getSunExclusionRadiusKm(), nextViewport),
      mobile ? 54 : 68,
      mobile ? 84 : 110
    )
  });
}

export default deepFreeze({
  meta: CONTROL_META,
  getWorldDimensionsKm,
  getScaleMode,
  getSolarPolicy,
  getLabelPolicy,
  getCameraPolicy,
  getUniverseBoundsKm,
  getUniverseCenterKm,
  getSunExclusionRadiusKm,
  getCameraFrame,
  worldToViewport,
  radiusKmToPx,
  getControlReceipt,
  getControlPlan,
  getLabelVisibilityPolicy
});
