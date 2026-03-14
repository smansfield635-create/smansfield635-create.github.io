import { VIEW_STATE } from "./view_state.js";

function isPointInsideCircle(px, py, cx, cy, radius) {
  const dx = px - cx;
  const dy = py - cy;
  return ((dx * dx) + (dy * dy)) <= (radius * radius);
}

export function createInteractionRouter({
  viewStateStore,
  projector,
  getGalaxyEarthNode
}) {
  function getViewState() {
    return viewStateStore.get();
  }

  function canRotate(canvasX, canvasY) {
    const current = getViewState();

    if (current === VIEW_STATE.GALAXY_LAYER) {
      const earthNode = getGalaxyEarthNode();
      return isPointInsideCircle(canvasX, canvasY, earthNode.x, earthNode.y, earthNode.radius * 1.6);
    }

    if (current === VIEW_STATE.PLANET_LAYER) {
      const body = projector.getBody();
      return isPointInsideCircle(canvasX, canvasY, body.centerX, body.centerY, body.radius);
    }

    return false;
  }

  function handleTap(canvasX, canvasY) {
    const current = getViewState();

    if (current === VIEW_STATE.GALAXY_LAYER) {
      const earthNode = getGalaxyEarthNode();
      const hitEarth = isPointInsideCircle(canvasX, canvasY, earthNode.x, earthNode.y, earthNode.radius * 1.6);
      if (hitEarth) {
        return viewStateStore.set(VIEW_STATE.PLANET_LAYER);
      }
      return current;
    }

    if (current === VIEW_STATE.PLANET_LAYER) {
      const body = projector.getBody();
      const hitPlanet = isPointInsideCircle(canvasX, canvasY, body.centerX, body.centerY, body.radius);
      if (!hitPlanet) {
        return viewStateStore.set(VIEW_STATE.GALAXY_LAYER);
      }
      return current;
    }

    return current;
  }

  return Object.freeze({
    canRotate,
    handleTap
  });
}
