export const VIEW_STATE = Object.freeze({
  GALAXY_LAYER: "GALAXY_LAYER",
  SOLAR_SYSTEM_LAYER: "SOLAR_SYSTEM_LAYER",
  PLANET_LAYER: "PLANET_LAYER",
  SURFACE_LAYER: "SURFACE_LAYER"
});

const RETURN_MAP = Object.freeze({
  [VIEW_STATE.SOLAR_SYSTEM_LAYER]: VIEW_STATE.GALAXY_LAYER,
  [VIEW_STATE.PLANET_LAYER]: VIEW_STATE.GALAXY_LAYER,
  [VIEW_STATE.SURFACE_LAYER]: VIEW_STATE.PLANET_LAYER
});

export function isValidViewState(value) {
  return Object.values(VIEW_STATE).includes(value);
}

export function getReturnTarget(viewState) {
  return RETURN_MAP[viewState] ?? null;
}

export function createViewStateStore(initialState = VIEW_STATE.GALAXY_LAYER) {
  let current = isValidViewState(initialState) ? initialState : VIEW_STATE.GALAXY_LAYER;
  const historyStack = [current];

  function get() {
    return current;
  }

  function set(nextState) {
    if (!isValidViewState(nextState) || nextState === current) return current;
    current = nextState;
    historyStack.push(current);
    return current;
  }

  function back() {
    const target = getReturnTarget(current);
    if (!target) return current;
    current = target;
    historyStack.push(current);
    return current;
  }

  function history() {
    return historyStack.slice();
  }

  return Object.freeze({
    get,
    set,
    back,
    history
  });
}
