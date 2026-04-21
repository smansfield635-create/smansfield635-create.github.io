import { getControlReceipt, getLabelVisibilityPolicy } from "/world/control.js";
import { getPlanetEngineReceipt, getPlanetProjection } from "/world/planet_engine.js";
import { render } from "/world/render.js";

const META = Object.freeze({
  name: "WORLD_RUNTIME",
  version: "G2_SOLAR_TEMPLATE_BASELINE",
  role: "runtime_orchestration",
  contract: "WORLD_RUNTIME_CONTRACT_G2_SOLAR_TEMPLATE",
  status: "ACTIVE",
  deterministic: true
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

function normalizeViewport(viewport = {}) {
  const width =
    Number.isFinite(viewport.width) && viewport.width > 0 ? viewport.width : 1280;
  const height =
    Number.isFinite(viewport.height) && viewport.height > 0 ? viewport.height : 720;
  const dpr =
    Number.isFinite(viewport.dpr) && viewport.dpr > 0 ? viewport.dpr : 1;

  return { width, height, dpr };
}

function normalizePointer(pointer = {}) {
  return {
    x: clamp(Number(pointer.x || 0), -1, 1),
    y: clamp(Number(pointer.y || 0), -1, 1),
    active: pointer.active === true
  };
}

function normalizeFrameState(frameState = {}) {
  return {
    elapsedSeconds:
      Number.isFinite(frameState.elapsedSeconds) && frameState.elapsedSeconds >= 0
        ? frameState.elapsedSeconds
        : 0,
    pointer: normalizePointer(frameState.pointer || {}),
    reducedMotion: frameState.reducedMotion === true
  };
}

function projectOrbitRings(planetProjection) {
  const orbitRings = Array.isArray(planetProjection.orbitRings)
    ? planetProjection.orbitRings
    : [];

  const camera = planetProjection.camera || {};
  const centerPx = camera.centerPx || { x: 0, y: 0 };

  return orbitRings.map((ring) =>
    deepFreeze({
      key: ring.key,
      label: ring.label,
      center: {
        x: centerPx.x,
        y: centerPx.y
      },
      radiusPxX: Number(ring.radiusPxX || 0),
      radiusPxY: Number(ring.radiusPxY || 0)
    })
  );
}

function projectStars(planetProjection) {
  const stars = Array.isArray(planetProjection.stars) ? planetProjection.stars : [];
  return stars.map((star) =>
    deepFreeze({
      x: Number(star.x || 0),
      y: Number(star.y || 0),
      size: Number(star.size || 0),
      alpha: Number(star.alpha || 0)
    })
  );
}

function buildPlanetBodies(planetProjection, frameState, viewport) {
  const planets = Array.isArray(planetProjection.planets) ? planetProjection.planets : [];
  const labelPolicy = getLabelVisibilityPolicy(viewport);
  const pointer = frameState.pointer;

  return planets.map((planet) => {
    const viewportPosition = planet.viewport || { x: 0, y: 0 };
    const radiusPx = Number(planet.radiusPx || 0);
    const orbitPx = planet.orbitPx || { x: 0, y: 0 };
    const angle = Number((planet.positionKm || {}).angle || 0);

    const depth = (Math.sin(angle) + 1) * 0.5;
    const scale = 0.82 + depth * 0.22;
    const opacity = 0.68 + depth * 0.32;
    const zIndex = Math.floor(10 + depth * 20);

    const pointerOffsetX = pointer.active ? pointer.x * 10 : 0;
    const pointerOffsetY = pointer.active ? pointer.y * 8 : 0;

    const x = viewportPosition.x + pointerOffsetX;
    const y = viewportPosition.y + pointerOffsetY;

    return deepFreeze({
      key: planet.key,
      label: planet.label,
      route: planet.route || null,
      visibleColorClass: planet.visibleColorClass || "",
      hasRing: planet.hasRing === true,
      order: Number(planet.order || 0),
      radiusKm: Number(planet.radiusKm || 0),
      compressedRadiusKm: Number(planet.compressedRadiusKm || 0),
      radiusPx,
      orbitPxX: Number(orbitPx.x || 0),
      orbitPxY: Number(orbitPx.y || 0),
      positionKm: deepFreeze(planet.positionKm || {}),
      viewport: deepFreeze({ x, y }),
      labelPosition: deepFreeze({
        x,
        y: y + Number(labelPolicy.minLabelOffsetPx || 0)
      }),
      metaPosition: deepFreeze({
        x,
        y: y + radiusPx + Number(labelPolicy.metaOffsetPx || 10)
      }),
      depth,
      scale,
      opacity,
      zIndex,
      angle
    });
  });
}

function buildSunBody(planetProjection) {
  const sun = planetProjection.sun || {};
  const viewport = sun.viewport || { x: 0, y: 0 };

  return deepFreeze({
    key: sun.key || "sun",
    label: sun.label || "Sun",
    radiusKm: Number(sun.radiusKm || 0),
    compressedRadiusKm: Number(sun.compressedRadiusKm || 0),
    radiusPx: Number(sun.radiusPx || 0),
    viewport: {
      x: Number(viewport.x || 0),
      y: Number(viewport.y || 0)
    }
  });
}

export function buildWorldRuntimeSnapshot(options = {}) {
  const viewport = normalizeViewport(options.viewport);
  const frameState = normalizeFrameState(options.frameState);
  const timestamp = Number.isFinite(options.timestamp) ? options.timestamp : Date.now();

  const controlReceipt = getControlReceipt({ viewport });
  const planetReceipt = getPlanetEngineReceipt({
    viewport,
    elapsedSeconds: frameState.elapsedSeconds
  });
  const projection = getPlanetProjection({
    viewport,
    elapsedSeconds: frameState.elapsedSeconds
  });

  const visibleBodies = buildPlanetBodies(projection, frameState, viewport);
  const orbitRings = projectOrbitRings(projection);
  const stars = projectStars(projection);
  const sun = buildSunBody(projection);
  const labelPolicy = getLabelVisibilityPolicy(viewport);

  const sceneState = deepFreeze({
    timestamp,
    viewport,
    elapsedSeconds: frameState.elapsedSeconds,
    reducedMotion: frameState.reducedMotion,
    pointer: frameState.pointer,
    centerPx: deepFreeze(projection.camera.centerPx || { x: 0, y: 0 }),
    worldScale: deepFreeze({
      kmPerPx: Number((projection.camera || {}).kmPerPx || 0),
      pxPerKm: Number((projection.camera || {}).pxPerKm || 0)
    }),
    sun,
    planets: visibleBodies,
    orbitRings,
    stars,
    labelPolicy
  });

  const renderPacket = render({
    frameState: {
      elapsedSeconds: frameState.elapsedSeconds,
      pointer: frameState.pointer,
      reducedMotion: frameState.reducedMotion
    },
    timestamp,
    sceneState
  });

  return deepFreeze({
    meta: META,
    timestamp,
    viewport,
    controlReceipt,
    planetReceipt,
    projection,
    renderPacket,
    sceneState
  });
}

export function createWorldRuntime(config = {}) {
  const sessionId =
    typeof config.sessionId === "string" && config.sessionId
      ? config.sessionId
      : "WORLD_RUNTIME_SESSION";

  const kernel =
    typeof window !== "undefined" ? window.liveRuntimeKernel || null : null;

  const state = {
    running: false,
    destroyed: false,
    startedAt: 0,
    elapsedSeconds: 0,
    frameCount: 0,
    reducedMotion: false,
    pointer: { x: 0, y: 0, active: false },
    snapshot: null
  };

  function buildSnapshot(viewport, overrides = {}) {
    const timestamp = Date.now();

    if (typeof overrides.reducedMotion === "boolean") {
      state.reducedMotion = overrides.reducedMotion;
    }

    if (overrides.pointer && typeof overrides.pointer === "object") {
      state.pointer = normalizePointer(overrides.pointer);
    }

    state.snapshot = buildWorldRuntimeSnapshot({
      viewport,
      timestamp,
      frameState: {
        elapsedSeconds: state.elapsedSeconds,
        reducedMotion: state.reducedMotion,
        pointer: state.pointer
      }
    });

    return state.snapshot;
  }

  return {
    meta: META,

    start(viewport = {}, overrides = {}) {
      if (state.destroyed) throw new Error("WORLD_RUNTIME_DESTROYED");

      state.running = true;
      state.startedAt = performance.now();
      state.elapsedSeconds = 0;
      state.frameCount = 0;

      if (kernel && typeof kernel.registerSession === "function") {
        kernel.registerSession(sessionId, { meta: META });
        if (typeof kernel.markSessionStarted === "function") {
          kernel.markSessionStarted(sessionId, Date.now());
        }
      }

      return buildSnapshot(viewport, overrides);
    },

    update(viewport = {}, overrides = {}) {
      if (state.destroyed) throw new Error("WORLD_RUNTIME_DESTROYED");

      if (!state.running) {
        return state.snapshot || buildSnapshot(viewport, overrides);
      }

      state.elapsedSeconds = Math.max(0, (performance.now() - state.startedAt) / 1000);
      state.frameCount += 1;

      if (kernel && typeof kernel.markSessionTick === "function") {
        kernel.markSessionTick(sessionId, Date.now());
      }

      return buildSnapshot(viewport, overrides);
    },

    stop() {
      state.running = false;

      if (kernel && typeof kernel.markSessionStopped === "function") {
        kernel.markSessionStopped(sessionId, Date.now());
      }
    },

    destroy() {
      this.stop();
      state.destroyed = true;

      if (kernel && typeof kernel.unregisterSession === "function") {
        kernel.unregisterSession(sessionId);
      }
    },

    setPointer(pointer = {}) {
      state.pointer = normalizePointer(pointer);
      return state.pointer;
    },

    setReducedMotion(value) {
      state.reducedMotion = value === true;
      return state.reducedMotion;
    },

    getSnapshot() {
      return state.snapshot;
    },

    getState() {
      return deepFreeze({
        running: state.running,
        destroyed: state.destroyed,
        frameCount: state.frameCount,
        elapsedSeconds: state.elapsedSeconds,
        reducedMotion: state.reducedMotion,
        pointer: state.pointer
      });
    }
  };
}

export default {
  meta: META,
  buildWorldRuntimeSnapshot,
  createWorldRuntime
};
