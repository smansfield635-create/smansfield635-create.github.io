import { VIEW_STATE } from "./view_state.js";

export function createRenderRouter({
  cosmicEngine,
  planetEngine,
  regionEngine,
  harborEngine
}) {
  const registry = Object.freeze({
    [VIEW_STATE.COSMIC_LAYER]: cosmicEngine,
    [VIEW_STATE.PLANET_LAYER]: planetEngine,
    [VIEW_STATE.REGION_LAYER]: regionEngine,
    [VIEW_STATE.HARBOR_LAYER]: harborEngine
  });

  function getActiveEngine(viewState) {
    return registry[viewState] ?? registry[VIEW_STATE.COSMIC_LAYER];
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
