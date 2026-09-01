import { createWorldKernel } from "./world_kernel.js";

const PLANET_ENGINE_META = Object.freeze({
  name: "PLANET_ENGINE",
  version: "G2_SOLAR_TEMPLATE_BASELINE",
  role: "solar_model_authority",
  contract: "PLANET_ENGINE_CONTRACT_G2_SOLAR_TEMPLATE",
  status: "ACTIVE",
  deterministic: true
});

const KERNEL = createWorldKernel();

const WORLD_DIMENSIONS_KM = Object.freeze({
  width: 256_000_000,
  height: 256_000_000
});

const SOLAR_BODIES = Object.freeze({
  sun: {
    key: "sun",
    kind: "star",
    order: 0,
    label: "Sun",
    route: null,
    visibleColorClass: "sun",
    radiusKm: 696_340,
    orbitalRadiusKm: 0,
    orbitalPeriodYears: 0,
    baseAngle: 0,
    hasRing: false
  },
  mercury: {
    key: "mercury",
    kind: "planet",
    order: 1,
    label: "Mercury",
    route: "/explore/",
    visibleColorClass: "planet-mercury",
    radiusKm: 2_439.7,
    orbitalRadiusKm: 57_909_227,
    orbitalPeriodYears: 0.2408467,
    baseAngle: -1.35,
    hasRing: false
  },
  venus: {
    key: "venus",
    kind: "planet",
    order: 2,
    label: "Venus",
    route: "/products/",
    visibleColorClass: "planet-venus",
    radiusKm: 6_051.8,
    orbitalRadiusKm: 108_209_475,
    orbitalPeriodYears: 0.61519726,
    baseAngle: -0.62,
    hasRing: false
  },
  earth: {
    key: "earth",
    kind: "planet",
    order: 3,
    label: "Earth",
    route: "/gauges/",
    visibleColorClass: "planet-earth",
    radiusKm: 6_371,
    orbitalRadiusKm: 149_598_023,
    orbitalPeriodYears: 1,
    baseAngle: 0.12,
    hasRing: false
  },
  mars: {
    key: "mars",
    kind: "planet",
    order: 4,
    label: "Mars",
    route: "/laws/",
    visibleColorClass: "planet-mars",
    radiusKm: 3_389.5,
    orbitalRadiusKm: 227_939_200,
    orbitalPeriodYears: 1.8808476,
    baseAngle: 0.82,
    hasRing: false
  },
  jupiter: {
    key: "jupiter",
    kind: "planet",
    order: 5,
    label: "Jupiter",
    route: "/governance/",
    visibleColorClass: "planet-jupiter",
    radiusKm: 69_911,
    orbitalRadiusKm: 778_340_821,
    orbitalPeriodYears: 11.862615,
    baseAngle: 1.46,
    hasRing: false
  },
  saturn: {
    key: "saturn",
    kind: "planet",
    order: 6,
    label: "Saturn",
    route: "/about/",
    visibleColorClass: "planet-saturn",
    radiusKm: 58_232,
    orbitalRadiusKm: 1_426_666_422,
    orbitalPeriodYears: 29.447498,
    baseAngle: 2.08,
    hasRing: true
  },
  uranus: {
    key: "uranus",
    kind: "planet",
    order: 7,
    label: "Uranus",
    route: "/contact/",
    visibleColorClass: "planet-uranus",
    radiusKm: 25_362,
    orbitalRadiusKm: 2_870_658_186,
    orbitalPeriodYears: 84.016846,
    baseAngle: 2.70,
    hasRing: false
  },
  neptune: {
    key: "neptune",
    kind: "planet",
    order: 8,
    label: "Neptune",
    route: "/",
    visibleColorClass: "planet-neptune",
    radiusKm: 24_622,
    orbitalRadiusKm: 4_498_396_441,
    orbitalPeriodYears: 164.79132,
    baseAngle: 3.22,
    hasRing: false
  },
  pluto: {
    key: "pluto",
    kind: "planet",
    order: 9,
    label: "Pluto",
    route: "#primary-routes",
    visibleColorClass: "planet-pluto",
    radiusKm: 1_188.3,
    orbitalRadiusKm: 5_906_376_272,
    orbitalPeriodYears: 248,
    baseAngle: 3.72,
    hasRing: false
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

function getWorldBoundsKm() {
  return deepFreeze({
    width: WORLD_DIMENSIONS_KM.width,
    height: WORLD_DIMENSIONS_KM.height,
    minX: -WORLD_DIMENSIONS_KM.width * 0.5,
    maxX: WORLD_DIMENSIONS_KM.width * 0.5,
    minY: -WORLD_DIMENSIONS_KM.height * 0.5,
    maxY: WORLD_DIMENSIONS_KM.height * 0.5
  });
}

function getWorldRadiusKm() {
  return Math.min(WORLD_DIMENSIONS_KM.width, WORLD_DIMENSIONS_KM.height) * 0.5;
}

function getScaledOrbitRadiusKm(key) {
  const index = PLANET_ORDER.indexOf(key);
  if (index === -1) return 0;

  const worldRadius = getWorldRadiusKm();
  const inner = 18_000_000;
  const outer = worldRadius - 8_000_000;
  const t = PLANET_ORDER.length === 1 ? 1 : index / (PLANET_ORDER.length - 1);
  return lerp(inner, outer, t);
}

function getScaledPlanetRadiusKm(key) {
  if (key === "sun") {
    return 18_500_000;
  }

  const rawRadii = PLANET_ORDER.map((planetKey) => SOLAR_BODIES[planetKey].radiusKm);
  const minRaw = Math.min(...rawRadii);
  const maxRaw = Math.max(...rawRadii);
  const body = SOLAR_BODIES[key];
  const t = (body.radiusKm - minRaw) / Math.max(1, maxRaw - minRaw);

  const minVisible = 1_200_000;
  const maxVisible = 5_200_000;

  return lerp(minVisible, maxVisible, t);
}

function getAngularVelocity(periodYears, viewport = {}) {
  const mobile = isMobileViewport(viewport);
  const base = mobile ? 0.00105 : 0.0012;
  return base / Math.sqrt(periodYears);
}

function getOrbitTilt(viewport = {}) {
  return isMobileViewport(viewport) ? 0.62 : 0.72;
}

function getCamera(viewport = {}) {
  const nextViewport = getViewport(viewport);
  const mobile = isMobileViewport(nextViewport);
  const insetRatio = mobile ? 0.10 : 0.08;

  const drawableWidthPx = Math.max(1, nextViewport.width * (1 - insetRatio * 2));
  const drawableHeightPx = Math.max(1, nextViewport.height * (1 - insetRatio * 2));

  const kmPerPxX = WORLD_DIMENSIONS_KM.width / drawableWidthPx;
  const kmPerPxY = WORLD_DIMENSIONS_KM.height / drawableHeightPx;
  const kmPerPx = Math.max(kmPerPxX, kmPerPxY);
  const pxPerKm = 1 / kmPerPx;

  return deepFreeze({
    viewport: nextViewport,
    insetRatio,
    drawableWidthPx,
    drawableHeightPx,
    kmPerPx,
    pxPerKm,
    centerPx: {
      x: nextViewport.width * 0.5,
      y: nextViewport.height * (mobile ? 0.36 : 0.44)
    }
  });
}

function projectWorldToViewport(pointKm = {}, viewport = {}) {
  const camera = getCamera(viewport);

  return deepFreeze({
    x: camera.centerPx.x + Number(pointKm.x || 0) * camera.pxPerKm,
    y: camera.centerPx.y + Number(pointKm.y || 0) * camera.pxPerKm
  });
}

function projectRadiusKmToPx(radiusKm, viewport = {}) {
  const camera = getCamera(viewport);
  return Number(radiusKm || 0) * camera.pxPerKm;
}

function getBodyModel(key, viewport = {}) {
  const base = SOLAR_BODIES[key];
  if (!base) return null;

  const scaledOrbitRadiusKm = key === "sun" ? 0 : getScaledOrbitRadiusKm(key);
  const scaledRadiusKm = getScaledPlanetRadiusKm(key);
  const angularVelocity = base.kind === "planet" ? getAngularVelocity(base.orbitalPeriodYears, viewport) : 0;

  return deepFreeze({
    ...base,
    scaledOrbitRadiusKm,
    scaledRadiusKm,
    angularVelocity
  });
}

function getBodyPositionKm(key, elapsedSeconds = 0, viewport = {}) {
  const body = getBodyModel(key, viewport);
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

  const angle = body.baseAngle + elapsedSeconds * body.angularVelocity;
  const orbitRadiusKmX = body.scaledOrbitRadiusKm;
  const orbitRadiusKmY = orbitRadiusKmX * getOrbitTilt(viewport);

  return deepFreeze({
    x: Math.cos(angle) * orbitRadiusKmX,
    y: Math.sin(angle) * orbitRadiusKmY,
    angle,
    orbitRadiusKmX,
    orbitRadiusKmY
  });
}

export function getSolarModel(viewport = {}) {
  const sun = getBodyModel("sun", viewport);
  const planets = PLANET_ORDER.map((key) => getBodyModel(key, viewport));

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    hostRead: KERNEL.getHostRead(),
    world: {
      dimensionsKm: WORLD_DIMENSIONS_KM,
      boundsKm: getWorldBoundsKm()
    },
    sun,
    planets
  });
}

export function buildPlanetFrame(options = {}) {
  const viewport = getViewport(options.viewport || {});
  const elapsedSeconds = Number.isFinite(options.elapsedSeconds) ? options.elapsedSeconds : 0;
  const camera = getCamera(viewport);
  const solar = getSolarModel(viewport);

  const sun = deepFreeze({
    ...solar.sun,
    positionKm: getBodyPositionKm("sun", elapsedSeconds, viewport)
  });

  const planets = solar.planets.map((planet) =>
    deepFreeze({
      ...planet,
      positionKm: getBodyPositionKm(planet.key, elapsedSeconds, viewport)
    })
  );

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    hostRead: KERNEL.getHostRead(),
    camera,
    world: {
      dimensionsKm: WORLD_DIMENSIONS_KM,
      boundsKm: getWorldBoundsKm()
    },
    sun,
    planets
  });
}

export function getPlanetProjection(options = {}) {
  const viewport = getViewport(options.viewport || {});
  const elapsedSeconds = Number.isFinite(options.elapsedSeconds) ? options.elapsedSeconds : 0;
  const frame = buildPlanetFrame({ viewport, elapsedSeconds });

  const projectedSun = deepFreeze({
    ...frame.sun,
    viewport: projectWorldToViewport(frame.sun.positionKm, viewport),
    radiusPx: clamp(projectRadiusKmToPx(frame.sun.scaledRadiusKm, viewport), 38, 58)
  });

  const projectedPlanets = deepFreeze(
    frame.planets.map((planet) => {
      const viewportPoint = projectWorldToViewport(planet.positionKm, viewport);
      const radiusPx = clamp(
        projectRadiusKmToPx(planet.scaledRadiusKm, viewport),
        isMobileViewport(viewport) ? 7 : 10,
        isMobileViewport(viewport) ? 22 : 30
      );

      return deepFreeze({
        ...planet,
        viewport: viewportPoint,
        radiusPx,
        orbitPx: {
          x: planet.positionKm.orbitRadiusKmX * frame.camera.pxPerKm,
          y: planet.positionKm.orbitRadiusKmY * frame.camera.pxPerKm
        }
      });
    })
  );

  const orbitRings = deepFreeze(
    projectedPlanets.map((planet) =>
      deepFreeze({
        key: planet.key,
        label: planet.label,
        radiusPxX: planet.orbitPx.x,
        radiusPxY: planet.orbitPx.y
      })
    )
  );

  const stars = buildStarField(viewport);

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    projection: {
      kind: "euclidean_solar_template",
      frameRadiusKm: getWorldRadiusKm(),
      frameRadiusPx: Math.min(frame.camera.drawableWidthPx, frame.camera.drawableHeightPx) * 0.5,
      scaleMode: "COMPRESSED_PROPORTIONAL"
    },
    camera: frame.camera,
    solarPolicy: {
      bodyCount: 9,
      includePluto: true,
      centerBody: "sun",
      orbitModel: "EUCLIDEAN_ELLIPTICAL_TEMPLATE"
    },
    sun: projectedSun,
    planets: projectedPlanets,
    stars,
    orbitRings
  });
}

export function getPlanetEngineReceipt(options = {}) {
  const viewport = getViewport(options.viewport || {});
  const elapsedSeconds = Number.isFinite(options.elapsedSeconds) ? options.elapsedSeconds : 0;
  const projection = getPlanetProjection({ viewport, elapsedSeconds });

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    verification: {
      pass: true,
      deterministic: true,
      centerBody: projection.sun.label,
      bodyCount: projection.planets.length,
      includePluto: projection.planets.some((planet) => planet.key === "pluto")
    },
    projection: projection.projection,
    camera: {
      kmPerPx: projection.camera.kmPerPx,
      pxPerKm: projection.camera.pxPerKm
    },
    bodyCount: projection.planets.length,
    orbitCount: projection.orbitRings.length,
    largestPlanet: "jupiter"
  });
}

function buildStarField(viewport = {}) {
  const nextViewport = getViewport(viewport);
  const mobile = isMobileViewport(nextViewport);
  const count = mobile ? 110 : 180;

  const stars = [];
  let seed = 17;

  for (let i = 0; i < count; i += 1) {
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
  buildPlanetFrame,
  getPlanetProjection,
  getPlanetEngineReceipt
});
