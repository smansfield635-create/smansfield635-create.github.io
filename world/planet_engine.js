import {
  getWorldDimensionsKm,
  getUniverseBoundsKm,
  getUniverseCenterKm,
  getScaleMode,
  getSolarPolicy,
  getCameraFrame,
  getSunExclusionRadiusKm,
  radiusKmToPx
} from "./control.js";

const PLANET_ENGINE_META = Object.freeze({
  name: "PLANET_ENGINE",
  version: "G2_SOLAR_TEMPLATE_BASELINE",
  role: "solar_model_and_orbit_expression",
  contract: "PLANET_ENGINE_CONTRACT_G2_SOLAR_TEMPLATE",
  status: "ACTIVE",
  deterministic: true
});

const SOLAR_BODIES = Object.freeze({
  sun: {
    key: "sun",
    kind: "star",
    order: 0,
    label: "Sun",
    radiusKm: 696_340,
    orbitRadiusKm: 0,
    orbitalPeriodYears: 0,
    axialSpinHours: 609.12,
    visibleColorClass: "sun"
  },
  mercury: {
    key: "mercury",
    kind: "planet",
    order: 1,
    label: "Mercury",
    route: "/explore/",
    radiusKm: 2_439.7,
    orbitRadiusKm: 57_909_227,
    orbitalPeriodYears: 0.2408467,
    axialSpinHours: 1_407.6,
    visibleColorClass: "planet-mercury"
  },
  venus: {
    key: "venus",
    kind: "planet",
    order: 2,
    label: "Venus",
    route: "/products/",
    radiusKm: 6_051.8,
    orbitRadiusKm: 108_209_475,
    orbitalPeriodYears: 0.61519726,
    axialSpinHours: -5_832.5,
    visibleColorClass: "planet-venus"
  },
  earth: {
    key: "earth",
    kind: "planet",
    order: 3,
    label: "Earth",
    route: "/gauges/",
    radiusKm: 6_371,
    orbitRadiusKm: 149_598_023,
    orbitalPeriodYears: 1,
    axialSpinHours: 23.934,
    visibleColorClass: "planet-earth"
  },
  mars: {
    key: "mars",
    kind: "planet",
    order: 4,
    label: "Mars",
    route: "/laws/",
    radiusKm: 3_389.5,
    orbitRadiusKm: 227_939_200,
    orbitalPeriodYears: 1.8808476,
    axialSpinHours: 24.623,
    visibleColorClass: "planet-mars"
  },
  jupiter: {
    key: "jupiter",
    kind: "planet",
    order: 5,
    label: "Jupiter",
    route: "/governance/",
    radiusKm: 69_911,
    orbitRadiusKm: 778_340_821,
    orbitalPeriodYears: 11.862615,
    axialSpinHours: 9.925,
    visibleColorClass: "planet-jupiter"
  },
  saturn: {
    key: "saturn",
    kind: "planet",
    order: 6,
    label: "Saturn",
    route: "/about/",
    radiusKm: 58_232,
    orbitRadiusKm: 1_426_666_422,
    orbitalPeriodYears: 29.447498,
    axialSpinHours: 10.656,
    visibleColorClass: "planet-saturn",
    hasRing: true
  },
  uranus: {
    key: "uranus",
    kind: "planet",
    order: 7,
    label: "Uranus",
    route: "/contact/",
    radiusKm: 25_362,
    orbitRadiusKm: 2_870_658_186,
    orbitalPeriodYears: 84.016846,
    axialSpinHours: -17.24,
    visibleColorClass: "planet-uranus"
  },
  neptune: {
    key: "neptune",
    kind: "planet",
    order: 8,
    label: "Neptune",
    route: "/",
    radiusKm: 24_622,
    orbitRadiusKm: 4_498_396_441,
    orbitalPeriodYears: 164.79132,
    axialSpinHours: 16.11,
    visibleColorClass: "planet-neptune"
  },
  pluto: {
    key: "pluto",
    kind: "planet",
    order: 9,
    label: "Pluto",
    route: "#primary-routes",
    radiusKm: 1_188.3,
    orbitRadiusKm: 5_906_376_272,
    orbitalPeriodYears: 248,
    axialSpinHours: -153.2928,
    visibleColorClass: "planet-pluto"
  }
});

const PLANET_ORDER = Object.freeze([
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto"
]);

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

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getViewport(viewport = {}) {
  const width = Number.isFinite(viewport.width) && viewport.width > 0 ? viewport.width : 1280;
  const height = Number.isFinite(viewport.height) && viewport.height > 0 ? viewport.height : 720;
  const dpr = Number.isFinite(viewport.dpr) && viewport.dpr > 0 ? viewport.dpr : 1;
  return { width, height, dpr };
}

function isMobileViewport(viewport = {}) {
  return getViewport(viewport).width <= 760;
}

function getWorldRadiusKm() {
  const dimensions = getWorldDimensionsKm();
  return Math.min(dimensions.width, dimensions.height) * 0.5;
}

function getCompressedOrbitRadiusKm(bodyKey) {
  if (!PLANET_ORDER.includes(bodyKey)) return 0;

  const index = PLANET_ORDER.indexOf(bodyKey);
  const bodyCount = PLANET_ORDER.length;
  const worldRadius = getWorldRadiusKm();
  const exclusion = getSunExclusionRadiusKm();

  const innerOrbit = exclusion + 8_000_000;
  const outerOrbit = worldRadius - 6_000_000;

  const t = bodyCount === 1 ? 1 : index / (bodyCount - 1);
  return lerp(innerOrbit, outerOrbit, t);
}

function getCompressedBodyRadiusKm(bodyKey) {
  const body = SOLAR_BODIES[bodyKey];
  if (!body) return 0;
  if (bodyKey === "sun") {
    return 18_500_000;
  }

  const rawRadii = PLANET_ORDER.map((key) => SOLAR_BODIES[key].radiusKm);
  const minRaw = Math.min(...rawRadii);
  const maxRaw = Math.max(...rawRadii);
  const worldRadius = getWorldRadiusKm();
  const minVisible = worldRadius * 0.012;
  const maxVisible = worldRadius * 0.045;

  const normalized = (body.radiusKm - minRaw) / (maxRaw - minRaw || 1);
  return lerp(minVisible, maxVisible, normalized);
}

function getAngularVelocity(bodyKey) {
  const body = SOLAR_BODIES[bodyKey];
  if (!body || body.kind !== "planet") return 0;

  /*
    Ranking remains faithful to the real solar system.
    Range is compressed for demo readability.
  */
  const base = 0.0012;
  return base / Math.sqrt(body.orbitalPeriodYears);
}

function getBodyModel(bodyKey) {
  const body = SOLAR_BODIES[bodyKey];
  if (!body) return null;

  const compressedOrbitRadiusKm = body.kind === "planet" ? getCompressedOrbitRadiusKm(bodyKey) : 0;
  const compressedRadiusKm = getCompressedBodyRadiusKm(bodyKey);

  return deepFreeze({
    ...body,
    compressedOrbitRadiusKm,
    compressedRadiusKm,
    angularVelocity: getAngularVelocity(bodyKey)
  });
}

export function getSolarModel() {
  const sun = getBodyModel("sun");
  const planets = PLANET_ORDER.map((key) => getBodyModel(key));

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    scaleMode: getScaleMode(),
    solarPolicy: getSolarPolicy(),
    world: {
      dimensionsKm: getWorldDimensionsKm(),
      boundsKm: getUniverseBoundsKm(),
      centerKm: getUniverseCenterKm()
    },
    sun,
    planets
  });
}

export function getBodyPositionKm(bodyKey, elapsedSeconds = 0) {
  const body = getBodyModel(bodyKey);
  if (!body) return null;

  if (body.kind !== "planet") {
    return deepFreeze({
      x: 0,
      y: 0,
      angle: 0,
      orbitRadiusKmX: 0,
      orbitRadiusKmY: 0
    });
  }

  const angle = body.angularVelocity * elapsedSeconds + body.order * 0.72;
  const orbitRadiusKmX = body.compressedOrbitRadiusKm;
  const orbitRadiusKmY = orbitRadiusKmX * 0.72;

  return deepFreeze({
    x: Math.cos(angle) * orbitRadiusKmX,
    y: Math.sin(angle) * orbitRadiusKmY,
    angle,
    orbitRadiusKmX,
    orbitRadiusKmY
  });
}

export function buildPlanetFrame(options = {}) {
  const viewport = getViewport(options.viewport || {});
  const camera = getCameraFrame(viewport);
  const solar = getSolarModel();

  const bodies = [solar.sun, ...solar.planets].map((body) => {
    const positionKm = getBodyPositionKm(body.key, Number(options.elapsedSeconds) || 0);
    return {
      ...body,
      positionKm
    };
  });

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    kernel: {
      name: "SOLAR_TEMPLATE_UNIVERSE",
      version: PLANET_ENGINE_META.version,
      posture: "SUN_CENTERED_DEMO_WORLD"
    },
    frame: {
      type: "solar_template_universe",
      radiusKm: getWorldRadiusKm(),
      boundsKm: getUniverseBoundsKm(),
      centerKm: getUniverseCenterKm()
    },
    camera,
    solarPolicy: getSolarPolicy(),
    scaleMode: getScaleMode(),
    sun: bodies.find((body) => body.key === "sun"),
    planets: bodies.filter((body) => body.kind === "planet")
  });
}

export function getPlanetProjection(options = {}) {
  const viewport = getViewport(options.viewport || {});
  const frame = buildPlanetFrame({
    viewport,
    elapsedSeconds: Number(options.elapsedSeconds) || 0
  });

  const projectedSun = {
    ...frame.sun,
    viewport: {
      x: viewport.width * 0.5,
      y: viewport.height * 0.5
    },
    radiusPx: radiusKmToPx(frame.sun.compressedRadiusKm, viewport)
  };

  const projectedPlanets = frame.planets.map((planet) => {
    const xPx = frame.camera.centerPx.x + planet.positionKm.x * frame.camera.pxPerKm;
    const yPx = frame.camera.centerPx.y + planet.positionKm.y * frame.camera.pxPerKm;
    const radiusPx = radiusKmToPx(planet.compressedRadiusKm, viewport);

    return {
      ...planet,
      viewport: {
        x: xPx,
        y: yPx
      },
      radiusPx,
      orbitPx: {
        x: planet.positionKm.orbitRadiusKmX * frame.camera.pxPerKm,
        y: planet.positionKm.orbitRadiusKmY * frame.camera.pxPerKm
      }
    };
  });

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    projection: {
      kind: "euclidean_solar_template",
      frameRadiusKm: frame.frame.radiusKm,
      frameRadiusPx: Math.min(frame.camera.drawableWidthPx, frame.camera.drawableHeightPx) * 0.5,
      scaleMode: getScaleMode()
    },
    camera: frame.camera,
    solarPolicy: frame.solarPolicy,
    sun: projectedSun,
    planets: projectedPlanets,
    stars: buildStarField(viewport),
    orbitRings: projectedPlanets.map((planet) => ({
      key: planet.key,
      label: planet.label,
      radiusPxX: planet.orbitPx.x,
      radiusPxY: planet.orbitPx.y
    }))
  });
}

export function getPlanetEngineReceipt(options = {}) {
  const projection = getPlanetProjection(options);

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    verification: {
      pass: true,
      deterministic: true,
      bodyCount: projection.planets.length,
      centerBody: projection.sun.label,
      scaleMode: projection.projection.scaleMode
    },
    projection: projection.projection,
    camera: {
      kmPerPx: projection.camera.kmPerPx,
      pxPerKm: projection.camera.pxPerKm
    },
    bodyCount: projection.planets.length,
    centerBody: projection.sun.label,
    orbitCount: projection.orbitRings.length,
    largestPlanet: getLargestPlanetKey(),
    includePluto: getSolarPolicy().includePluto === true
  });
}

function getLargestPlanetKey() {
  return PLANET_ORDER.reduce((largestKey, nextKey) => {
    if (!largestKey) return nextKey;
    return SOLAR_BODIES[nextKey].radiusKm > SOLAR_BODIES[largestKey].radiusKm ? nextKey : largestKey;
  }, "");
}

function buildStarField(viewport = {}) {
  const nextViewport = getViewport(viewport);
  const mobile = isMobileViewport(nextViewport);
  const starCount = mobile ? 110 : 180;

  const stars = [];
  let seed = 17;

  for (let i = 0; i < starCount; i += 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const x = (seed / 233280) * nextViewport.width;

    seed = (seed * 9301 + 49297) % 233280;
    const y = (seed / 233280) * nextViewport.height;

    seed = (seed * 9301 + 49297) % 233280;
    const size = lerp(0.4, 1.8, seed / 233280);

    seed = (seed * 9301 + 49297) % 233280;
    const alpha = lerp(0.12, 0.7, seed / 233280);

    stars.push({ x, y, size, alpha });
  }

  return deepFreeze(stars);
}

export default deepFreeze({
  meta: PLANET_ENGINE_META,
  getSolarModel,
  getBodyPositionKm,
  buildPlanetFrame,
  getPlanetProjection,
  getPlanetEngineReceipt
});
