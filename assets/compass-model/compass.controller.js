import {
  ORIENTATION_PHASE,
  PRESENTATION,
  TRANSACTION_PHASE,
  assertContract
} from "./compass.contracts.js";
import { normalizeQuaternion } from "./compass.math.js";

const PRESENTATION_TRANSITIONS = Object.freeze({
  [PRESENTATION.CONSTELLATION]: Object.freeze([
    PRESENTATION.CONSTELLATION,
    PRESENTATION.CLUSTER,
    PRESENTATION.HELD
  ]),
  [PRESENTATION.CLUSTER]: Object.freeze([
    PRESENTATION.CLUSTER,
    PRESENTATION.CONSTELLATION,
    PRESENTATION.HELD
  ]),
  [PRESENTATION.HELD]: Object.freeze([
    PRESENTATION.HELD
  ])
});

export function createCompassController({ profile, adapters, nodes }) {
  let state = Object.freeze({
    presentation: PRESENTATION.CONSTELLATION,
    orientationPhase: ORIENTATION_PHASE.COMMITTED,
    transactionPhase: TRANSACTION_PHASE.ORIENTATION,
    orientation: Object.freeze([0, 0, 0, 1]),
    originOrientation: Object.freeze([0, 0, 0, 1]),
    primaryId: "",
    selectedId: "",
    held: false,
    revision: 0
  });
  const listeners = new Set();

  const publish = action => {
    state = Object.freeze({ ...state, revision: state.revision + 1, lastAction: action });
    listeners.forEach(listener => listener(state));
    return state;
  };
  const replace = (patch, action) => {
    state = Object.freeze({ ...state, ...patch });
    return publish(action);
  };

  function beginGesture() {
    assertContract(!state.held, "COMPASS_HELD");
    return replace({
      originOrientation: state.orientation,
      orientationPhase: ORIENTATION_PHASE.PREVIEW,
      transactionPhase: TRANSACTION_PHASE.ORIENTATION
    }, "gesture-begin");
  }

  function preview({ quaternion, primaryId }) {
    assertContract(nodes.has(primaryId), "COMPASS_PRIMARY_ID_UNKNOWN", primaryId);
    return replace({
      orientation: Object.freeze(normalizeQuaternion(quaternion)),
      primaryId,
      orientationPhase: ORIENTATION_PHASE.PREVIEW,
      transactionPhase: TRANSACTION_PHASE.PREVIEW
    }, "gesture-preview");
  }

  function commit() {
    return replace({
      originOrientation: state.orientation,
      orientationPhase: ORIENTATION_PHASE.COMMITTED,
      transactionPhase: TRANSACTION_PHASE.SETTLEMENT
    }, "gesture-commit");
  }

  function cancel(reason = "cancelled") {
    return replace({
      orientation: state.originOrientation,
      orientationPhase: ORIENTATION_PHASE.CANCELLED,
      transactionPhase: TRANSACTION_PHASE.CANCELLED
    }, `gesture-cancel:${reason}`);
  }

  function setPresentation(nextPresentation, options = {}) {
    const next = String(nextPresentation || "").trim();
    const allowed = PRESENTATION_TRANSITIONS[state.presentation] || [];

    assertContract(
      Object.values(PRESENTATION).includes(next),
      "COMPASS_PRESENTATION_UNKNOWN",
      next
    );
    assertContract(
      allowed.includes(next),
      "COMPASS_PRESENTATION_TRANSITION_PROHIBITED",
      Object.freeze({ from: state.presentation, to: next })
    );
    assertContract(
      !state.held || next === PRESENTATION.HELD,
      "COMPASS_HELD_PRESENTATION_LOCK"
    );

    const orientation = Object.freeze(
      normalizeQuaternion(options.orientation || [0, 0, 0, 1])
    );

    return replace({
      presentation: next,
      orientation,
      originOrientation: orientation,
      primaryId: "",
      selectedId: options.preserveSelection === true ? state.selectedId : "",
      orientationPhase: ORIENTATION_PHASE.COMMITTED,
      transactionPhase: TRANSACTION_PHASE.ORIENTATION
    }, `presentation:${state.presentation}->${next}`);
  }

  function openCluster(options = {}) {
    return setPresentation(PRESENTATION.CLUSTER, options);
  }

  function returnToConstellation(options = {}) {
    return setPresentation(PRESENTATION.CONSTELLATION, options);
  }

  function select(id) {
    assertContract(nodes.has(id), "COMPASS_SELECTION_UNKNOWN", id);
    return replace({ selectedId: id, transactionPhase: TRANSACTION_PHASE.SELECTION }, `select:${id}`);
  }

  function navigate(routeKey) {
    const route = adapters.resolveRoute(routeKey);
    assertContract(route, "COMPASS_ROUTE_UNRESOLVED", routeKey);
    replace({ transactionPhase: TRANSACTION_PHASE.ROUTE_COMMIT }, `route:${routeKey}`);
    return adapters.navigate(route);
  }

  return Object.freeze({
    getState: () => state,
    beginGesture,
    preview,
    commit,
    cancel,
    setPresentation,
    openCluster,
    returnToConstellation,
    select,
    navigate,
    hold: reason => replace({ held: true }, `hold:${reason}`),
    releaseHold: () => replace({ held: false }, "hold-release"),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  });
}
