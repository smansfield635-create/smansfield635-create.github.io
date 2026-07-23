import {
  ORIENTATION_PHASE,
  PRESENTATION,
  TRANSACTION_PHASE,
  assertContract
} from "./compass.contracts.js";
import { normalizeQuaternion } from "./compass.math.js";

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
