export const VIEW_STATE = Object.freeze({
  COSMIC_LAYER: "COSMIC_LAYER",
  PLANET_LAYER: "PLANET_LAYER",
  REGION_LAYER: "REGION_LAYER",
  HARBOR_LAYER: "HARBOR_LAYER"
});

const DESCEND_MAP = Object.freeze({
  [VIEW_STATE.COSMIC_LAYER]: VIEW_STATE.PLANET_LAYER,
  [VIEW_STATE.PLANET_LAYER]: VIEW_STATE.REGION_LAYER,
  [VIEW_STATE.REGION_LAYER]: VIEW_STATE.HARBOR_LAYER
});

const RETURN_MAP = Object.freeze({
  [VIEW_STATE.PLANET_LAYER]: VIEW_STATE.COSMIC_LAYER,
  [VIEW_STATE.REGION_LAYER]: VIEW_STATE.PLANET_LAYER,
  [VIEW_STATE.HARBOR_LAYER]: VIEW_STATE.REGION_LAYER
});

export function isValidViewState(value) {
  return Object.values(VIEW_STATE).includes(value);
}

export function getDescendTarget(viewState) {
  return DESCEND_MAP[viewState] ?? null;
}

export function getReturnTarget(viewState) {
  return RETURN_MAP[viewState] ?? null;
}

export function createViewStateStore(initialState = VIEW_STATE.COSMIC_LAYER) {
  let current = isValidViewState(initialState) ? initialState : VIEW_STATE.COSMIC_LAYER;
  const stack = [current];

  function get() {
    return current;
  }

  function set(nextState) {
    if (!isValidViewState(nextState) || nextState === current) return current;
    current = nextState;
    stack.push(current);
    return current;
  }

  function back() {
    const target = getReturnTarget(current);
    if (!target) return current;
    current = target;
    stack.push(current);
    return current;
  }

  function history() {
    return stack.slice();
  }

  return Object.freeze({
    get,
    set,
    back,
    history
  });
}
