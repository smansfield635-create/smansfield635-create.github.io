/*
 * Universal Compass controller authority.
 * Neutral seven-file compatibility implementation.
 *
 * Owns accepted local presentation state only:
 * - constellation / cluster presentation
 * - active cardinal and selected child
 * - gesture begin / preview / commit / cancel
 * - held and reduced-motion state
 * - immutable state publication and revisions
 *
 * Does not own world truth, geometry, projection, rendering, pointer input,
 * routes, destinations, navigation, transactions, products, or finance.
 */

export const UNIVERSAL_COMPASS_CONTROLLER_CONTRACT = Object.freeze({
  id: "DGB_UNIVERSAL_COMPASS_CONTROLLER_NEUTRAL_COMPATIBILITY_v1",
  namespace: "DGB_UNIVERSAL_COMPASS",
  schemaPrefix: "UNIVERSAL_COMPASS_",
  authority: "ACCEPTED_LOCAL_PRESENTATION_STATE",
  planetIdentityAuthorityRequired: true,
  compositorMutationAuthority: false,
  interactionMutationAuthority: false,
  navigationAuthority: false,
  productAuthority: false,
  productionAuthority: false
});

export const PRESENTATION = Object.freeze({
  CONSTELLATION: "CONSTELLATION",
  CLUSTER: "CLUSTER"
});

export const ORIENTATION_PHASE = Object.freeze({
  COMMITTED: "COMMITTED",
  PREVIEW: "PREVIEW",
  CANCELLED: "CANCELLED"
});

const IDENTITY_QUATERNION = Object.freeze([0, 0, 0, 1]);
const PREVIEW_KEYS = Object.freeze([
  "quaternion",
  "primaryId",
  "worldRevision"
]);

function assertContract(condition, code, details = null) {
  if (condition) return;
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function") ||
    seen.has(value)
  ) {
    return value;
  }

  seen.add(value);
  for (const key of Reflect.ownKeys(value)) {
    deepFreeze(value[key], seen);
  }
  return Object.freeze(value);
}

function assertPlainRecord(value, code = "COMPASS_PLAIN_RECORD_REQUIRED") {
  assertContract(
    value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      (Object.getPrototypeOf(value) === Object.prototype ||
        Object.getPrototypeOf(value) === null),
    code,
    value
  );
  return value;
}

function assertExactKeys(record, expectedKeys, code) {
  assertPlainRecord(record, code);
  const actual = Object.keys(record).sort();
  const expected = Array.from(expectedKeys).sort();
  assertContract(
    actual.length === expected.length &&
      actual.every((key, index) => key === expected[index]),
    code,
    deepFreeze({ actual, expected })
  );
  return record;
}

function normalizeQuaternion(value, fallback = IDENTITY_QUATERNION) {
  const quaternion = Array.from(value || []).map(Number);
  if (
    quaternion.length !== 4 ||
    quaternion.some(component => !Number.isFinite(component))
  ) {
    return Array.from(fallback);
  }

  const length = Math.hypot(...quaternion);
  if (!(length > 1e-8) || !Number.isFinite(length)) {
    return Array.from(fallback);
  }

  return quaternion.map(component => component / length);
}

function assertPresentation(value) {
  assertContract(
    Object.values(PRESENTATION).includes(value),
    "COMPASS_PRESENTATION_INVALID",
    value
  );
  return value;
}

function assertWorldRevision(value) {
  assertContract(
    Number.isInteger(value) && value >= 0,
    "COMPASS_WORLD_REVISION_INVALID",
    value
  );
  return value;
}

function orientationRecord({
  quaternion = IDENTITY_QUATERNION,
  committedQuaternion = quaternion,
  originQuaternion = null,
  primaryId = "",
  previewPrimaryId = primaryId,
  phase = ORIENTATION_PHASE.COMMITTED,
  gestureActive = false,
  previewAccepted = false,
  worldRevision = 0,
  revision = 0
} = {}) {
  assertContract(
    Object.values(ORIENTATION_PHASE).includes(phase),
    "COMPASS_ORIENTATION_PHASE_INVALID",
    phase
  );
  assertWorldRevision(worldRevision);
  assertContract(
    Number.isInteger(revision) && revision >= 0,
    "COMPASS_ORIENTATION_REVISION_INVALID",
    revision
  );

  return deepFreeze({
    quaternion: deepFreeze(normalizeQuaternion(quaternion)),
    committedQuaternion: deepFreeze(
      normalizeQuaternion(committedQuaternion)
    ),
    originQuaternion:
      originQuaternion === null
        ? null
        : deepFreeze(normalizeQuaternion(originQuaternion)),
    primaryId: String(primaryId || ""),
    previewPrimaryId: String(previewPrimaryId || ""),
    phase,
    gestureActive: Boolean(gestureActive),
    previewAccepted: Boolean(previewAccepted),
    worldRevision,
    revision
  });
}

function requirePlanetAuthority(planet) {
  assertContract(
    planet && typeof planet === "object",
    "COMPASS_CONTROLLER_PLANET_REQUIRED"
  );

  const required = [
    "getWorldRevision",
    "hasCardinal",
    "hasChild",
    "isChildOfCardinal"
  ];

  for (const method of required) {
    assertContract(
      typeof planet[method] === "function",
      `COMPASS_CONTROLLER_PLANET_${method.toUpperCase()}_REQUIRED`
    );
  }

  return planet;
}

export function createCompassController({
  planet,
  reducedMotion = false
} = {}) {
  const planetAuthority = requirePlanetAuthority(planet);

  const currentWorldRevision = () =>
    assertWorldRevision(planetAuthority.getWorldRevision());

  const initialConstellation = orientationRecord({
    worldRevision: currentWorldRevision()
  });

  let state = deepFreeze({
    schema: "UNIVERSAL_COMPASS_CONTROLLER_STATE_v1",
    revision: 0,
    presentation: PRESENTATION.CONSTELLATION,
    held: false,
    holdReason: "",
    reducedMotion: Boolean(reducedMotion),
    activeCardinalId: "",
    selectedChildId: "",
    constellation: initialConstellation,
    clusters: deepFreeze({}),
    lastAction: "initialize"
  });

  const listeners = new Set();

  function activeOrientation(source = state) {
    if (source.presentation === PRESENTATION.CONSTELLATION) {
      return source.constellation;
    }
    return source.clusters[source.activeCardinalId] || null;
  }

  function publish(next, action) {
    assertPresentation(next.presentation);
    const active = activeOrientation(next);
    assertContract(
      active,
      "COMPASS_ACTIVE_ORIENTATION_RECORD_REQUIRED",
      deepFreeze({
        presentation: next.presentation,
        activeCardinalId: next.activeCardinalId
      })
    );

    state = deepFreeze({
      ...next,
      schema: "UNIVERSAL_COMPASS_CONTROLLER_STATE_v1",
      revision: state.revision + 1,
      lastAction: String(action || "update")
    });

    for (const listener of listeners) {
      listener(state);
    }
    return state;
  }

  function requireNotHeld(code = "COMPASS_HELD") {
    assertContract(!state.held, code, state.holdReason);
  }

  function replaceActiveOrientation(record, source = state) {
    if (source.presentation === PRESENTATION.CONSTELLATION) {
      return {
        ...source,
        constellation: record
      };
    }

    return {
      ...source,
      clusters: deepFreeze({
        ...source.clusters,
        [source.activeCardinalId]: record
      })
    };
  }

  function validatePrimaryForPresentation(primaryId) {
    const id = String(primaryId || "");
    assertContract(id, "COMPASS_PRIMARY_ID_REQUIRED");

    if (state.presentation === PRESENTATION.CONSTELLATION) {
      assertContract(
        planetAuthority.hasCardinal(id),
        "COMPASS_PRIMARY_CARDINAL_UNKNOWN",
        id
      );
      return id;
    }

    assertContract(
      planetAuthority.hasChild(id),
      "COMPASS_PRIMARY_CHILD_UNKNOWN",
      id
    );
    assertContract(
      planetAuthority.isChildOfCardinal(id, state.activeCardinalId),
      "COMPASS_PRIMARY_OUTSIDE_ACTIVE_CLUSTER",
      deepFreeze({
        primaryId: id,
        activeCardinalId: state.activeCardinalId
      })
    );
    return id;
  }

  function beginGesture(options = {}) {
    requireNotHeld();
    assertPlainRecord(options, "COMPASS_GESTURE_OPTIONS_INVALID");

    const requestedPresentation =
      options.presentation || state.presentation;
    assertContract(
      requestedPresentation === state.presentation,
      "COMPASS_GESTURE_PRESENTATION_MISMATCH",
      deepFreeze({
        requested: requestedPresentation,
        active: state.presentation
      })
    );

    if (state.presentation === PRESENTATION.CLUSTER) {
      const requestedCardinalId = String(
        options.cardinalId || state.activeCardinalId || ""
      );
      assertContract(
        requestedCardinalId === state.activeCardinalId,
        "COMPASS_GESTURE_CLUSTER_MISMATCH",
        requestedCardinalId
      );
    }

    const current = activeOrientation();
    assertContract(current, "COMPASS_ACTIVE_ORIENTATION_REQUIRED");
    assertContract(
      !current.gestureActive &&
        current.phase !== ORIENTATION_PHASE.PREVIEW,
      "COMPASS_GESTURE_ALREADY_ACTIVE"
    );

    const nextOrientation = orientationRecord({
      ...current,
      originQuaternion: current.committedQuaternion,
      phase: ORIENTATION_PHASE.PREVIEW,
      gestureActive: true,
      previewAccepted: false,
      previewPrimaryId: current.primaryId,
      worldRevision: currentWorldRevision()
    });

    return publish(
      replaceActiveOrientation(nextOrientation),
      "gesture-begin"
    );
  }

  function preview(proposal) {
    requireNotHeld();
    assertExactKeys(
      proposal,
      PREVIEW_KEYS,
      "COMPASS_CONTROLLER_PREVIEW_KEYS_INVALID"
    );

    const current = activeOrientation();
    assertContract(
      current &&
        current.gestureActive &&
        current.phase === ORIENTATION_PHASE.PREVIEW,
      "COMPASS_PREVIEW_WITHOUT_ACTIVE_GESTURE"
    );

    const expectedWorldRevision = currentWorldRevision();
    assertContract(
      proposal.worldRevision === expectedWorldRevision,
      "COMPASS_WORLD_REVISION_STALE",
      deepFreeze({
        proposed: proposal.worldRevision,
        expected: expectedWorldRevision
      })
    );

    const primaryId = validatePrimaryForPresentation(proposal.primaryId);
    const nextOrientation = orientationRecord({
      ...current,
      quaternion: proposal.quaternion,
      previewPrimaryId: primaryId,
      phase: ORIENTATION_PHASE.PREVIEW,
      gestureActive: true,
      previewAccepted: true,
      worldRevision: expectedWorldRevision
    });

    return publish(
      replaceActiveOrientation(nextOrientation),
      `gesture-preview:${primaryId}`
    );
  }

  function commit() {
    requireNotHeld();
    const current = activeOrientation();
    assertContract(
      current &&
        current.gestureActive &&
        current.phase === ORIENTATION_PHASE.PREVIEW,
      "COMPASS_COMMIT_WITHOUT_ACTIVE_GESTURE"
    );
    assertContract(
      current.previewAccepted,
      "COMPASS_COMMIT_ACCEPTED_PREVIEW_REQUIRED"
    );

    const nextOrientation = orientationRecord({
      ...current,
      committedQuaternion: current.quaternion,
      originQuaternion: null,
      primaryId: current.previewPrimaryId,
      previewPrimaryId: current.previewPrimaryId,
      phase: ORIENTATION_PHASE.COMMITTED,
      gestureActive: false,
      previewAccepted: false,
      worldRevision: currentWorldRevision(),
      revision: current.revision + 1
    });

    return publish(
      replaceActiveOrientation(nextOrientation),
      `gesture-commit:${nextOrientation.primaryId}`
    );
  }

  function cancel(reason = "cancelled") {
    const current = activeOrientation();
    assertContract(
      current &&
        current.gestureActive &&
        current.phase === ORIENTATION_PHASE.PREVIEW,
      "COMPASS_CANCEL_WITHOUT_ACTIVE_GESTURE"
    );

    const restored =
      current.originQuaternion || current.committedQuaternion;
    const nextOrientation = orientationRecord({
      ...current,
      quaternion: restored,
      committedQuaternion: current.committedQuaternion,
      originQuaternion: null,
      previewPrimaryId: current.primaryId,
      phase: ORIENTATION_PHASE.CANCELLED,
      gestureActive: false,
      previewAccepted: false,
      worldRevision: currentWorldRevision()
    });

    return publish(
      replaceActiveOrientation(nextOrientation),
      `gesture-cancel:${String(reason)}`
    );
  }

  function cancelGestureForTransition(source = state) {
    const current = activeOrientation(source);
    if (!current?.gestureActive) return source;

    const restored =
      current.originQuaternion || current.committedQuaternion;
    const nextOrientation = orientationRecord({
      ...current,
      quaternion: restored,
      committedQuaternion: current.committedQuaternion,
      originQuaternion: null,
      previewPrimaryId: current.primaryId,
      phase: ORIENTATION_PHASE.CANCELLED,
      gestureActive: false,
      previewAccepted: false,
      worldRevision: currentWorldRevision()
    });

    return replaceActiveOrientation(nextOrientation, source);
  }

  function createClusterOrientation(cardinalId, options = {}) {
    const existing = state.clusters[cardinalId];
    if (existing) return existing;

    const orientation = options.orientation || IDENTITY_QUATERNION;
    const primaryId = String(options.primaryId || "");
    if (primaryId) {
      assertContract(
        planetAuthority.hasChild(primaryId) &&
          planetAuthority.isChildOfCardinal(primaryId, cardinalId),
        "COMPASS_CLUSTER_PRIMARY_INVALID",
        deepFreeze({ cardinalId, primaryId })
      );
    }

    return orientationRecord({
      quaternion: orientation,
      committedQuaternion: orientation,
      primaryId,
      previewPrimaryId: primaryId,
      worldRevision: currentWorldRevision()
    });
  }

  function openCluster(cardinalId, options = {}) {
    requireNotHeld("COMPASS_HELD_PRESENTATION_LOCK");
    assertContract(
      state.presentation === PRESENTATION.CONSTELLATION,
      "COMPASS_CLUSTER_OPEN_REQUIRES_CONSTELLATION"
    );

    const admittedCardinalId = String(cardinalId || "");
    assertContract(
      admittedCardinalId && planetAuthority.hasCardinal(admittedCardinalId),
      "COMPASS_CARDINAL_UNKNOWN",
      admittedCardinalId
    );
    assertPlainRecord(options, "COMPASS_CLUSTER_OPTIONS_INVALID");

    const base = cancelGestureForTransition();
    const clusterOrientation = createClusterOrientation(
      admittedCardinalId,
      options
    );

    return publish(
      {
        ...base,
        presentation: PRESENTATION.CLUSTER,
        activeCardinalId: admittedCardinalId,
        selectedChildId: "",
        clusters: deepFreeze({
          ...base.clusters,
          [admittedCardinalId]: clusterOrientation
        })
      },
      `cluster-open:${admittedCardinalId}`
    );
  }

  function closeCluster(options = {}) {
    requireNotHeld("COMPASS_HELD_PRESENTATION_LOCK");
    assertContract(
      state.presentation === PRESENTATION.CLUSTER,
      "COMPASS_CLUSTER_CLOSE_REQUIRES_CLUSTER"
    );
    assertPlainRecord(options, "COMPASS_CLUSTER_CLOSE_OPTIONS_INVALID");

    const previousCardinalId = state.activeCardinalId;
    const base = cancelGestureForTransition();
    const orientation = options.orientation ||
      base.constellation.quaternion;
    const constellation = orientationRecord({
      ...base.constellation,
      quaternion: orientation,
      committedQuaternion: orientation,
      originQuaternion: null,
      phase: ORIENTATION_PHASE.COMMITTED,
      gestureActive: false,
      previewAccepted: false,
      worldRevision: currentWorldRevision()
    });

    return publish(
      {
        ...base,
        presentation: PRESENTATION.CONSTELLATION,
        activeCardinalId: "",
        selectedChildId: "",
        constellation
      },
      `cluster-close:${previousCardinalId}`
    );
  }

  function selectChild(childId) {
    requireNotHeld();
    assertContract(
      state.presentation === PRESENTATION.CLUSTER,
      "COMPASS_CHILD_SELECTION_REQUIRES_CLUSTER"
    );

    const admittedChildId = String(childId || "");
    assertContract(
      admittedChildId && planetAuthority.hasChild(admittedChildId),
      "COMPASS_CHILD_UNKNOWN",
      admittedChildId
    );
    assertContract(
      planetAuthority.isChildOfCardinal(
        admittedChildId,
        state.activeCardinalId
      ),
      "COMPASS_CHILD_OUTSIDE_ACTIVE_CLUSTER",
      deepFreeze({
        childId: admittedChildId,
        activeCardinalId: state.activeCardinalId
      })
    );

    const base = cancelGestureForTransition();
    return publish(
      {
        ...base,
        selectedChildId: admittedChildId
      },
      `child-select:${admittedChildId}`
    );
  }

  function enterHeld(reason = "held") {
    assertContract(!state.held, "COMPASS_ALREADY_HELD");
    const base = cancelGestureForTransition();
    return publish(
      {
        ...base,
        held: true,
        holdReason: String(reason || "held")
      },
      `hold-enter:${String(reason || "held")}`
    );
  }

  function leaveHeld() {
    assertContract(state.held, "COMPASS_NOT_HELD");
    return publish(
      {
        ...state,
        held: false,
        holdReason: ""
      },
      "hold-leave"
    );
  }

  function setReducedMotion(enabled) {
    const admitted = Boolean(enabled);
    if (admitted === state.reducedMotion) return state;
    return publish(
      {
        ...state,
        reducedMotion: admitted
      },
      `reduced-motion:${admitted ? "enabled" : "disabled"}`
    );
  }

  function getPresentationContext() {
    return deepFreeze({
      schema: "UNIVERSAL_COMPASS_PRESENTATION_CONTEXT_v1",
      controllerRevision: state.revision,
      presentation: state.presentation,
      held: state.held,
      activeCardinalId: state.activeCardinalId,
      reducedMotion: state.reducedMotion
    });
  }

  return Object.freeze({
    getState: () => state,
    getRevision: () => state.revision,
    getPresentationContext,
    beginGesture,
    preview,
    commit,
    cancel,
    openCluster,
    closeCluster,
    selectChild,
    enterHeld,
    leaveHeld,
    setReducedMotion,
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
