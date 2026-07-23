import {
  ORIENTATION_PHASE,
  PRESENTATION,
  TRANSACTION_PHASE,
  assertCanonicalPresentation,
  assertContract,
  assertExactKeys,
  deepFreeze
} from "./compass.contracts.js";
import { normalizeQuaternion } from "./compass.math.js";

const PRESENTATION_TRANSITIONS = Object.freeze({
  [PRESENTATION.CONSTELLATION]: Object.freeze([
    PRESENTATION.CONSTELLATION,
    PRESENTATION.CLUSTER
  ]),
  [PRESENTATION.CLUSTER]: Object.freeze([
    PRESENTATION.CLUSTER,
    PRESENTATION.CONSTELLATION
  ])
});

export function createCompassController({
  profile,
  adapters,
  nodes,
  world
}) {
  assertContract(
    profile && typeof profile === "object",
    "COMPASS_CONTROLLER_PROFILE_REQUIRED"
  );
  assertContract(
    adapters && typeof adapters.resolveRoute === "function",
    "COMPASS_CONTROLLER_ADAPTERS_REQUIRED"
  );
  assertContract(
    nodes && typeof nodes.get === "function" && typeof nodes.has === "function",
    "COMPASS_CONTROLLER_NODES_REQUIRED"
  );
  assertContract(
    world && typeof world.getWorldBasisRevision === "function",
    "COMPASS_CONTROLLER_WORLD_AUTHORITY_REQUIRED"
  );

  const currentWorldBasisRevision = () => {
    const revision = world.getWorldBasisRevision();
    assertContract(
      Number.isInteger(revision) && revision >= 0,
      "COMPASS_WORLD_BASIS_REVISION_INVALID",
      revision
    );
    return revision;
  };

  let state = deepFreeze({
    presentation: PRESENTATION.CONSTELLATION,
    orientationPhase: ORIENTATION_PHASE.COMMITTED,
    transactionPhase: TRANSACTION_PHASE.ORIENTATION,
    orientation: [0, 0, 0, 1],
    originOrientation: [0, 0, 0, 1],
    primaryId: "",
    selectedId: "",
    held: false,
    holdReason: "",
    worldBasisRevision: currentWorldBasisRevision(),
    revision: 0,
    lastAction: "initialize"
  });

  const listeners = new Set();

  const publish = (patch, action) => {
    state = deepFreeze({
      ...state,
      ...patch,
      revision: state.revision + 1,
      lastAction: action
    });
    listeners.forEach(listener => listener(state));
    return state;
  };

  function requireNotHeld(code = "COMPASS_HELD") {
    assertContract(!state.held, code, state.holdReason);
  }

  function beginGesture() {
    requireNotHeld();
    assertContract(
      state.orientationPhase !== ORIENTATION_PHASE.PREVIEW,
      "COMPASS_GESTURE_ALREADY_ACTIVE"
    );

    return publish({
      originOrientation: state.orientation,
      orientationPhase: ORIENTATION_PHASE.PREVIEW,
      transactionPhase: TRANSACTION_PHASE.ORIENTATION
    }, "gesture-begin");
  }

  function preview(proposal) {
    requireNotHeld();
    assertExactKeys(
      proposal,
      ["quaternion", "primaryId", "worldBasisRevision"],
      "COMPASS_CONTROLLER_PREVIEW_KEYS_INVALID"
    );
    assertContract(
      state.orientationPhase === ORIENTATION_PHASE.PREVIEW,
      "COMPASS_PREVIEW_WITHOUT_ACTIVE_GESTURE"
    );

    const primaryNode = nodes.get(proposal.primaryId);
    assertContract(
      primaryNode,
      "COMPASS_PRIMARY_ID_UNKNOWN",
      proposal.primaryId
    );
    assertContract(
      primaryNode.presentation === state.presentation,
      "COMPASS_PRIMARY_PRESENTATION_MISMATCH",
      Object.freeze({
        primaryId: proposal.primaryId,
        expected: state.presentation,
        actual: primaryNode.presentation
      })
    );

    const expectedWorldBasisRevision = currentWorldBasisRevision();
    assertContract(
      Number.isInteger(proposal.worldBasisRevision) &&
        proposal.worldBasisRevision === expectedWorldBasisRevision,
      "COMPASS_WORLD_BASIS_REVISION_STALE",
      Object.freeze({
        proposed: proposal.worldBasisRevision,
        expected: expectedWorldBasisRevision
      })
    );

    return publish({
      orientation: normalizeQuaternion(proposal.quaternion),
      primaryId: proposal.primaryId,
      worldBasisRevision: expectedWorldBasisRevision,
      orientationPhase: ORIENTATION_PHASE.PREVIEW,
      transactionPhase: TRANSACTION_PHASE.PREVIEW
    }, "gesture-preview");
  }

  function commit() {
    requireNotHeld();
    assertContract(
      state.orientationPhase === ORIENTATION_PHASE.PREVIEW,
      "COMPASS_COMMIT_WITHOUT_ACTIVE_GESTURE"
    );

    return publish({
      originOrientation: state.orientation,
      orientationPhase: ORIENTATION_PHASE.COMMITTED,
      transactionPhase: TRANSACTION_PHASE.SETTLEMENT
    }, "gesture-commit");
  }

  function cancel(reason = "cancelled") {
    assertContract(
      state.orientationPhase === ORIENTATION_PHASE.PREVIEW,
      "COMPASS_CANCEL_WITHOUT_ACTIVE_GESTURE"
    );

    return publish({
      orientation: state.originOrientation,
      primaryId: "",
      orientationPhase: ORIENTATION_PHASE.CANCELLED,
      transactionPhase: TRANSACTION_PHASE.CANCELLED
    }, `gesture-cancel:${String(reason)}`);
  }

  function setPresentation(nextPresentation, options = {}) {
    requireNotHeld("COMPASS_HELD_PRESENTATION_LOCK");
    assertContract(
      state.orientationPhase !== ORIENTATION_PHASE.PREVIEW,
      "COMPASS_PRESENTATION_CHANGE_DURING_GESTURE"
    );

    const next = assertCanonicalPresentation(nextPresentation);
    const allowed = PRESENTATION_TRANSITIONS[state.presentation] || [];

    assertContract(
      allowed.includes(next),
      "COMPASS_PRESENTATION_TRANSITION_PROHIBITED",
      Object.freeze({ from: state.presentation, to: next })
    );

    const orientation = normalizeQuaternion(
      options.orientation || [0, 0, 0, 1]
    );

    return publish({
      presentation: next,
      orientation,
      originOrientation: orientation,
      primaryId: "",
      selectedId:
        options.preserveSelection === true &&
        nodes.get(state.selectedId)?.presentation === next
          ? state.selectedId
          : "",
      worldBasisRevision: currentWorldBasisRevision(),
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

  function enterHeld(reason = "held") {
    assertContract(!state.held, "COMPASS_ALREADY_HELD");
    assertContract(
      state.orientationPhase !== ORIENTATION_PHASE.PREVIEW,
      "COMPASS_HOLD_DURING_ACTIVE_GESTURE"
    );

    return publish({
      held: true,
      holdReason: String(reason)
    }, `hold-enter:${String(reason)}`);
  }

  function leaveHeld() {
    assertContract(state.held, "COMPASS_NOT_HELD");

    return publish({
      held: false,
      holdReason: ""
    }, "hold-leave");
  }

  function select(id) {
    requireNotHeld();
    const node = nodes.get(id);
    assertContract(node, "COMPASS_SELECTION_UNKNOWN", id);
    assertContract(
      node.presentation === state.presentation,
      "COMPASS_SELECTION_PRESENTATION_MISMATCH",
      Object.freeze({
        id,
        expected: state.presentation,
        actual: node.presentation
      })
    );

    return publish({
      selectedId: id,
      transactionPhase: TRANSACTION_PHASE.SELECTION
    }, `select:${id}`);
  }

  function navigate(routeKey) {
    requireNotHeld();
    const route = adapters.resolveRoute(routeKey);
    assertContract(route, "COMPASS_ROUTE_UNRESOLVED", routeKey);
    publish({
      transactionPhase: TRANSACTION_PHASE.ROUTE_COMMIT
    }, `route:${routeKey}`);
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
    enterHeld,
    leaveHeld,
    select,
    navigate,
    hold: enterHeld,
    releaseHold: leaveHeld,
    subscribe(listener) {
      assertContract(
        typeof listener === "function",
        "COMPASS_LISTENER_REQUIRED"
      );
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  });
}
