import { getRuntimeReceipt } from "/world/runtime.js";
import { getPlanetEngineReceipt, getPlanetProjection } from "/world/planet_engine.js";
import { render } from "/world/render.js";
import { getControlReceipt } from "/world/control.js";

const META = Object.freeze({
  name: "WORLD_RUNTIME",
  version: "G1_EXTERNAL_BASELINE",
  role: "runtime_orchestration",
  contract: "WORLD_RUNTIME_CONTRACT_G1",
  status: "ACTIVE",
  deterministic: true
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
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

export function buildWorldRuntimeSnapshot(options = {}) {
  const frameState =
    options.frameState && typeof options.frameState === "object" ? options.frameState : {};
  const viewport = normalizeViewport(options.viewport);
  const timestamp = Number.isFinite(options.timestamp) ? options.timestamp : Date.now();

  const runtimeReceipt = getRuntimeReceipt({ frameState, timestamp });
  const planetReceipt = getPlanetEngineReceipt({ timestamp });
  const projection = getPlanetProjection({ scale: 1 });
  const renderPacket = render({ frameState, timestamp });
  const controlReceipt = getControlReceipt({ frameState, timestamp });

  return deepFreeze({
    meta: META,
    timestamp,
    viewport,
    runtimeReceipt,
    planetReceipt,
    projection,
    renderPacket,
    controlReceipt
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
    snapshot: null
  };

  function buildSnapshot(viewport) {
    const timestamp = Date.now();
    const frameState = { elapsedSeconds: state.elapsedSeconds };
    state.snapshot = buildWorldRuntimeSnapshot({
      frameState,
      timestamp,
      viewport
    });
    return state.snapshot;
  }

  return {
    meta: META,

    start(viewport = {}) {
      if (state.destroyed) throw new Error("WORLD_RUNTIME_DESTROYED");
      state.running = true;
      state.startedAt = performance.now();
      if (kernel && typeof kernel.registerSession === "function") {
        kernel.registerSession(sessionId, { meta: META });
        kernel.markSessionStarted(sessionId, Date.now());
      }
      return buildSnapshot(viewport);
    },

    update(viewport = {}) {
      if (state.destroyed) throw new Error("WORLD_RUNTIME_DESTROYED");
      if (!state.running) return state.snapshot || buildSnapshot(viewport);

      state.elapsedSeconds = Math.max(0, (performance.now() - state.startedAt) / 1000);
      state.frameCount += 1;

      if (kernel && typeof kernel.markSessionTick === "function") {
        kernel.markSessionTick(sessionId, Date.now());
      }

      return buildSnapshot(viewport);
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

    getSnapshot() {
      return state.snapshot;
    },

    getState() {
      return deepFreeze({
        running: state.running,
        destroyed: state.destroyed,
        frameCount: state.frameCount,
        elapsedSeconds: state.elapsedSeconds
      });
    }
  };
}

export default {
  meta: META,
  buildWorldRuntimeSnapshot,
  createWorldRuntime
