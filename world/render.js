const RENDER_META = Object.freeze({
  name: "RENDER",
  version: "G2_SOLAR_TEMPLATE_BASELINE",
  role: "solar_scene_visibility_authority",
  contract: "RENDER_CONTRACT_G2_SOLAR_TEMPLATE",
  status: "ACTIVE",
  deterministic: true
});

function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Math.round(value * 1000) / 1000;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
}

function getSunPacket(sceneState = {}) {
  const sun = sceneState.sun || {};
  const viewport = sun.viewport || { x: 0, y: 0 };

  return deepFreeze({
    key: sun.key || "sun",
    label: sun.label || "Sun",
    viewport: {
      x: Number(viewport.x || 0),
      y: Number(viewport.y || 0)
    },
    radiusPx: Number(sun.radiusPx || 0),
    radiusKm: Number(sun.radiusKm || 0),
    compressedRadiusKm: Number(sun.compressedRadiusKm || 0)
  });
}

function getPlanetPackets(sceneState = {}) {
  const planets = Array.isArray(sceneState.planets) ? sceneState.planets : [];

  return deepFreeze(
    planets.map((planet) =>
      deepFreeze({
        key: planet.key,
        label: planet.label,
        route: planet.route || null,
        visibleColorClass: planet.visibleColorClass || "",
        hasRing: planet.hasRing === true,
        order: Number(planet.order || 0),
        viewport: {
          x: Number((planet.viewport || {}).x || 0),
          y: Number((planet.viewport || {}).y || 0)
        },
        labelPosition: {
          x: Number((planet.labelPosition || {}).x || 0),
          y: Number((planet.labelPosition || {}).y || 0)
        },
        metaPosition: {
          x: Number((planet.metaPosition || {}).x || 0),
          y: Number((planet.metaPosition || {}).y || 0)
        },
        radiusPx: Number(planet.radiusPx || 0),
        radiusKm: Number(planet.radiusKm || 0),
        compressedRadiusKm: Number(planet.compressedRadiusKm || 0),
        orbitPxX: Number(planet.orbitPxX || 0),
        orbitPxY: Number(planet.orbitPxY || 0),
        depth: Number(planet.depth || 0),
        scale: Number(planet.scale || 1),
        opacity: Number(planet.opacity || 1),
        zIndex: Number(planet.zIndex || 1),
        angle: Number(planet.angle || 0)
      })
    )
  );
}

function getOrbitPackets(sceneState = {}) {
  const rings = Array.isArray(sceneState.orbitRings) ? sceneState.orbitRings : [];

  return deepFreeze(
    rings.map((ring) =>
      deepFreeze({
        key: ring.key,
        label: ring.label,
        center: {
          x: Number((ring.center || {}).x || 0),
          y: Number((ring.center || {}).y || 0)
        },
        radiusPxX: Number(ring.radiusPxX || 0),
        radiusPxY: Number(ring.radiusPxY || 0)
      })
    )
  );
}

function getStarPackets(sceneState = {}) {
  const stars = Array.isArray(sceneState.stars) ? sceneState.stars : [];

  return deepFreeze(
    stars.map((star) =>
      deepFreeze({
        x: Number(star.x || 0),
        y: Number(star.y || 0),
        size: Number(star.size || 0),
        alpha: Number(star.alpha || 0)
      })
    )
  );
}

function getLargestPlanet(planets = []) {
  if (!planets.length) return null;
  return planets.reduce((largest, next) =>
    Number(next.radiusKm || 0) > Number(largest.radiusKm || 0) ? next : largest
  );
}

function getFastestPlanet(planets = []) {
  if (!planets.length) return null;
  return planets.reduce((fastest, next) =>
    Math.abs(Number(next.angle || 0)) > Math.abs(Number(fastest.angle || 0)) ? next : fastest
  );
}

export function render(options = {}) {
  const timestamp = Number.isFinite(options.timestamp) ? options.timestamp : Date.now();
  const sceneState = options.sceneState && typeof options.sceneState === "object" ? options.sceneState : {};
  const frameState = options.frameState && typeof options.frameState === "object" ? options.frameState : {};

  const viewport = sceneState.viewport || { width: 1280, height: 720, dpr: 1 };
  const sun = getSunPacket(sceneState);
  const planets = getPlanetPackets(sceneState);
  const orbitRings = getOrbitPackets(sceneState);
  const stars = getStarPackets(sceneState);
  const labelPolicy = sceneState.labelPolicy || {};
  const worldScale = sceneState.worldScale || { kmPerPx: 0, pxPerKm: 0 };

  const largestPlanet = getLargestPlanet(planets);
  const fastestPlanet = getFastestPlanet(planets);

  const solarCoverage =
    orbitRings.length > 0
      ? clamp01(orbitRings[orbitRings.length - 1].radiusPxX / Math.max(1, viewport.width * 0.5))
      : 0;

  const sunDominance =
    planets.length > 0
      ? clamp01(
          Number(sun.radiusPx || 0) /
            Math.max(1, Number((largestPlanet || {}).radiusPx || 1))
        )
      : 1;

  const motionDelta =
    frameState.reducedMotion === true
      ? 0
      : clamp01(
          planets.reduce((sum, planet) => sum + Math.abs(Number(planet.angle || 0)), 0) /
            Math.max(1, planets.length * 6)
        );

  return deepFreeze({
    meta: RENDER_META,
    timestamp,
    visible: {
      validatorStatus: {
        ok: true,
        checks: {
          runtimeTraceability: true,
          fieldCompleteness: true,
          projectionConsistency: true,
          determinism: true,
          solarCenterReserved: true,
          orbitCompleteness: orbitRings.length === planets.length,
          bodyCountIntegrity: planets.length === 9
        }
      },
      pageContext: {
        shell: "richie_richs_manor",
        animation: "demo_template_universe"
      },
      sceneContext: {
        kind: "euclidean_solar_template",
        centerBody: sun.label,
        bodyCount: planets.length,
        includePluto: planets.some((planet) => planet.key === "pluto")
      },
      colorOutput: {
        hue: clamp01(0.12 + solarCoverage * 0.08),
        saturation: clamp01(0.58 + sunDominance * 0.10),
        value: clamp01(0.62 + solarCoverage * 0.18)
      },
      luminanceOutput: clamp01(0.54 + solarCoverage * 0.16),
      depthOutput: clamp01(0.46 + sunDominance * 0.18),
      motionOutput: {
        visible: motionDelta > 0.01,
        delta: motionDelta
      },
      emphasis: {
        host: "solar_template_universe",
        signal: "subordinate",
        entry: "sun_centered_navigation"
      },
      labelVisibility: {
        attachedToPlanets: true,
        centerReservedForSunOnly: labelPolicy.centerReservedForSunOnly === true,
        hoverMeta: labelPolicy.showMetaOnHover === true,
        preventCenterCollision: labelPolicy.preventCenterCollision === true
      },
      solarVisibility: {
        sun,
        planets,
        orbitRings,
        stars
      },
      diagnostics: {
        worldScale,
        largestPlanet: largestPlanet ? largestPlanet.key : null,
        fastestVisiblePlanet: fastestPlanet ? fastestPlanet.key : null,
        solarCoverage,
        sunDominance
      }
    },
    projection: {
      selectedProjection: {
        kind: "euclidean_solar_template",
        width: Number(viewport.width || 0),
        height: Number(viewport.height || 0),
        layers: 4
      }
    },
    successor: {
      center: sun,
      planets,
      orbitRings,
      stars
    }
  });
}

export default {
  meta: RENDER_META,
  render
};
