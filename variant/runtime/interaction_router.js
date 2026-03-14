import { VIEW_STATE, getDescendTarget, getReturnTarget } from "./view_state.js";

function isPointInsideGlobe(canvasX, canvasY, body) {
  const dx = canvasX - body.centerX;
  const dy = canvasY - body.centerY;
  return ((dx * dx) + (dy * dy)) <= (body.radius * body.radius);
}

export function createInteractionRouter({
  viewStateStore,
  projector
}) {
  function getViewState() {
    return viewStateStore.get();
  }

  function canRotate(canvasX, canvasY) {
    const viewState = getViewState();
    if (viewState !== VIEW_STATE.COSMIC_LAYER && viewState !== VIEW_STATE.PLANET_LAYER) {
      return false;
    }
    return isPointInsideGlobe(canvasX, canvasY, projector.getBody());
  }

  function handleTap(canvasX, canvasY) {
    const body = projector.getBody();
    const insideGlobe = isPointInsideGlobe(canvasX, canvasY, body);
    const current = getViewState();

    if (current === VIEW_STATE.COSMIC_LAYER && insideGlobe) {
      return viewStateStore.set(getDescendTarget(current));
    }

    if (current === VIEW_STATE.PLANET_LAYER && !insideGlobe) {
      return viewStateStore.set(getReturnTarget(current));
    }

    return current;
  }

  return Object.freeze({
    canRotate,
    handleTap
  });
}
