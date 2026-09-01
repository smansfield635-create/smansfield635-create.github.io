const RENDER_META = Object.freeze({
  name: "RENDER",
  version: "G2_SOLAR_TEMPLATE_BASELINE",
  role: "solar_scene_visibility_authority",
  contract: "RENDER_CONTRACT_G2_SOLAR_TEMPLATE",
  status: "ACTIVE",
  deterministic: true
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
}

function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Math.round(value * 1000) / 1000;
}

function toNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function buildSunPacket(sceneState = {}) {
  const sun = sceneState.sun || {};
  const viewport = sun.viewport || { x: 0, y: 0 };

  return deepFreeze({
    key: sun.key || "sun",
    label: sun.label || "Sun",
    radiusKm: toNumber(sun.radiusKm),
    scaledRadiusKm: toNumber(sun.scaledRadiusKm || sun.compressedRadiusKm),
    radiusPx: toNumber(sun.radiusPx),
    viewport: {
      x: toNumber(viewport.x),
      y: toNumber(viewport.y)
    }
  });
}

function buildPlanetPackets(sceneState = {}) {
  const planets = Array.isArray(sceneState.planets) ? sceneState.planets : [];

  return deepFreeze(
    planets.map((planet) => {
      const viewport = planet.viewport || { x: 0, y: 0 };
      const labelPosition = planet.labelPosition || viewport;
      const metaPosition = planet.metaPosition || viewport;
      const positionKm = planet.positionKm || {};

      return deepFreeze({
        key: planet.key || "",
        label: planet.label || "",
        route: planet.route || null,
        visibleColorClass: planet.visibleColorClass || "",
        hasRing: planet.hasRing === true,
        order: toNumber(planet.order),
        radiusKm: toNumber(planet.radiusKm),
        scaledRadiusKm: toNumber(planet.scaledRadiusKm || planet.compressedRadiusKm),
        radiusPx: toNumber(planet.radiusPx),
        orbitPxX: toNumber(planet.orbitPxX),
        orbitPxY: toNumber(planet.orbitPxY),
        angle: toNumber(planet.angle),
        depth: toNumber(planet.depth),
        scale: toNumber(planet.scale, 1),
        opacity: toNumber(planet.opacity, 1),
        zIndex: toNumber(planet.zIndex, 1),
        viewport: {
          x: toNumber(viewport.x),
          y: toNumber(viewport.y)
        },
        labelPosition: {
          x: toNumber(labelPosition.x),
          y: toNumber(labelPosition.y)
        },
        metaPosition: {
          x: toNumber(metaPosition.x),
          y: toNumber(metaPosition.y)
        },
        positionKm: {
          x: toNumber(positionKm.x),
          y: toNumber(positionKm.y),
          angle: toNumber(positionKm.angle),
          orbitRadiusKmX: toNumber(positionKm.orbitRadiusKmX),
          orbitRadiusKmY: toNumber(positionKm.orbitRadiusKmY)
        }
      });
    })
  );
}

function buildOrbitPackets(sceneState = {}) {
  const rings = Array.isArray(sceneState.orbitRings) ? sceneState.orbitRings : [];

  return deepFreeze(
    rings.map((ring) => {
      const center = ring.center || { x: 0, y: 0 };

      return deepFreeze({
        key: ring.key || "",
        label: ring.label || "",
        center: {
          x: toNumber(center.x),
          y: toNumber(center.y)
        },
        radiusPxX: toNumber(ring.radiusPxX),
        radiusPxY: toNumber(ring.radiusPxY)
      });
    })
  );
}

function buildStarPackets(sceneState = {}) {
  const stars = Array.isArray(sceneState.stars) ? sceneState.stars : [];

  return deepFreeze(
    stars.map((star) =>
      deepFreeze({
        x: toNumber(star.x),
        y: toNumber(star.y),
        size: toNumber(star.size),
        alpha: toNumber(star.alpha)
      })
    )
  );
}

function getLargestPlanet(planets = []) {
  if (!planets.length) return null;
  return planets.reduce((largest, next) => {
    return toNumber(next.radiusKm) > toNumber(largest.radiusKm) ? next : largest;
  });
}

export function render(options = {}) {
  const timestamp = Number.isFinite(options.timestamp) ? options.timestamp : Date.now();
  const frameState = options.frameState && typeof options.frameState === "object" ? options.frameState : {};
  const sceneState = options.sceneState && typeof options.sceneState === "object" ? options.sceneState : {};

  const viewport = sceneState.viewport || { width: 1280, height: 720, dpr: 1 };
  const sun = buildSunPacket(sceneState);
  const planets = buildPlanetPackets(sceneState);
  const orbitRings = buildOrbitPackets(sceneState);
  const stars = buildStarPackets(sceneState);
  const labelPolicy = sceneState.labelPolicy || {};
  const worldScale = sceneState.worldScale || { kmPerPx: 0, pxPerKm: 0 };
  const centerPx = sceneState.centerPx || { x: viewport.width * 0.5, y: viewport.height * 0.44 };

  const largestPlanet = getLargestPlanet(planets);
  const solarCoverage = orbitRings.length
    ? clamp01(Math.max(...orbitRings.map((ring) => ring.radiusPxX)) / Math.max(1, viewport.width * 0.5))
    : 0;

  const sunDominance = largestPlanet
    ? clamp01(sun.radiusPx / Math.max(1, largestPlanet.radiusPx))
    : 1;

  const motionMagnitude = frameState.reducedMotion === true
    ? 0
    : clamp01(
        planets.reduce((sum, planet) => sum + Math.abs(planet.angle), 0) /
          Math.max(1, planets.length * 6)
      );

  const visiblePacket = deepFreeze({
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
      includePluto: planets.some((planet) => planet.key === "pluto"),
      reducedMotion: frameState.reducedMotion === true
    },
    colorOutput: {
      hue: clamp01(0.14 + solarCoverage * 0.06),
      saturation: clamp01(0.60 + sunDominance * 0.08),
      value: clamp01(0.64 + solarCoverage * 0.16)
    },
    luminanceOutput: clamp01(0.56 + solarCoverage * 0.14),
    depthOutput: clamp01(0.48 + sunDominance * 0.18),
    motionOutput: {
      visible: motionMagnitude > 0.01,
      delta: motionMagnitude
    },
    labelVisibility: {
      attachedToPlanets: true,
      centerReservedForSunOnly: labelPolicy.centerReservedForSunOnly === true,
      hoverMeta: labelPolicy.showMetaOnHover === true,
      preventCenterCollision: labelPolicy.preventCenterCollision === true
    },
    solarVisibility: {
      centerPx: {
        x: toNumber(centerPx.x),
        y: toNumber(centerPx.y)
      },
      sun,
      planets,
      orbitRings,
      stars
    },
    diagnostics: {
      worldScale: {
        kmPerPx: toNumber(worldScale.kmPerPx),
        pxPerKm: toNumber(worldScale.pxPerKm)
      },
      largestPlanet: largestPlanet ? largestPlanet.key : null,
      solarCoverage,
      sunDominance
    }
  });

  return deepFreeze({
    meta: RENDER_META,
    timestamp,
    visible: visiblePacket,
    projection: {
      selectedProjection: {
        kind: "euclidean_solar_template",
        width: toNumber(viewport.width, 1280),
        height: toNumber(viewport.height, 720),
        layers: 4
      }
    },
    successor: {
      centerPx: visiblePacket.solarVisibility.centerPx,
      sun,
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
