import { VIEW_STATE } from "./view_state.js";

export function createRenderRouter({
  galaxyEngine,
  solarSystemEngine,
  planetEngine,
  surfaceEngine
}) {
  const registry = Object.freeze({
    [VIEW_STATE.GALAXY_LAYER]: galaxyEngine,
    [VIEW_STATE.SOLAR_SYSTEM_LAYER]: solarSystemEngine,
    [VIEW_STATE.PLANET_LAYER]: planetEngine,
    [VIEW_STATE.SURFACE_LAYER]: surfaceEngine
  });

  function getActiveEngine(viewState) {
    return registry[viewState] ?? registry[VIEW_STATE.GALAXY_LAYER];
  }

  function drawActiveLayer(ctx, snapshot, projector, viewState, helpers = {}) {
    const engine = getActiveEngine(viewState);
    if (!engine || typeof engine.draw !== "function") return;
    engine.draw(ctx, snapshot, projector, helpers);
  }

  return Object.freeze({
    getActiveEngine,
    drawActiveLayer
  });
}
