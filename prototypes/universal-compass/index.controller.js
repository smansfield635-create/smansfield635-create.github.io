/*
 * Universal Compass controller authority.
 * Source-derived candidate assembled from:
 * - MAIN /assets/compass/compass.controller.js
 *   blob 259e0d16b55c3986fec57db37fc057861483344a
 * - LAW /laws/index.controller.js
 *   blob 5711c261d7fac96a3622ef80e98dacca845f7d96
 * - SHOWROOM /showroom/index.controller.js
 *   blob 460d9a7beb323f62012683fbe6f27e3c98462705
 * - ARCHCOIN /products/archcoin/index.controller.js
 *   blob 8d60a21863012d4a5ec8b6224cee845a2fd7178d
 *
 * Candidate research architecture only.
 * No source Compass, live rebuild, deployment, or production authority.
 */
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

const TRANSACTION_TRANSITIONS = Object.freeze({
  [TRANSACTION_PHASE.ORIENTATION]: Object.freeze([
    TRANSACTION_PHASE.ORIENTATION,
    TRANSACTION_PHASE.SELECTION,
    TRANSACTION_PHASE.CANCELLED
  ]),
  [TRANSACTION_PHASE.SELECTION]: Object.freeze([
    TRANSACTION_PHASE.SELECTION,
    TRANSACTION_PHASE.PREVIEW,
    TRANSACTION_PHASE.CANCELLED
  ]),
  [TRANSACTION_PHASE.PREVIEW]: Object.freeze([
    TRANSACTION_PHASE.PREVIEW,
    TRANSACTION_PHASE.CONFIRMATION,
    TRANSACTION_PHASE.CANCELLED
  ]),
  [TRANSACTION_PHASE.CONFIRMATION]: Object.freeze([
    TRANSACTION_PHASE.CONFIRMATION,
    TRANSACTION_PHASE.SETTLEMENT,
    TRANSACTION_PHASE.CANCELLED
  ]),
  [TRANSACTION_PHASE.SETTLEMENT]: Object.freeze([
    TRANSACTION_PHASE.SETTLEMENT,
    TRANSACTION_PHASE.ROUTE_COMMIT,
    TRANSACTION_PHASE.ORIENTATION,
    TRANSACTION_PHASE.CANCELLED
  ]),
  [TRANSACTION_PHASE.ROUTE_COMMIT]: Object.freeze([
    TRANSACTION_PHASE.ROUTE_COMMIT,
    TRANSACTION_PHASE.ORIENTATION
  ]),
  [TRANSACTION_PHASE.CANCELLED]: Object.freeze([
    TRANSACTION_PHASE.CANCELLED,
    TRANSACTION_PHASE.ORIENTATION
  ])
});

const TRANSACTION_REVISION_EVENTS = Object.freeze({
  NEW_TRANSACTION: "NEW_TRANSACTION",
  TARGET_REPLACEMENT: "TARGET_REPLACEMENT",
  PREVIEW_OPENED: "PREVIEW_OPENED",
  CONFIRMATION_ACCEPTED: "CONFIRMATION_ACCEPTED",
  SETTLEMENT_ADMITTED: "SETTLEMENT_ADMITTED",
  CANCELLED: "CANCELLED",
  ROUTE_COMMIT: "ROUTE_COMMIT",
  DUPLICATE_REQUEST: "DUPLICATE_REQUEST",
  RECEIPT_PUBLICATION: "RECEIPT_PUBLICATION"
});

const REVISION_ADVANCING_EVENTS = new Set([
  TRANSACTION_REVISION_EVENTS.NEW_TRANSACTION,
  TRANSACTION_REVISION_EVENTS.TARGET_REPLACEMENT,
  TRANSACTION_REVISION_EVENTS.PREVIEW_OPENED,
  TRANSACTION_REVISION_EVENTS.CONFIRMATION_ACCEPTED,
  TRANSACTION_REVISION_EVENTS.SETTLEMENT_ADMITTED,
  TRANSACTION_REVISION_EVENTS.CANCELLED,
  TRANSACTION_REVISION_EVENTS.ROUTE_COMMIT
]);

const OPTIONAL_PARTICIPANT_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  COMPLETE: "COMPLETE"
});

const IDENTITY_QUATERNION = Object.freeze([0, 0, 0, 1]);

function orientationRecord({
  quaternion = IDENTITY_QUATERNION,
  committedQuaternion = quaternion,
  originQuaternion = null,
  primaryId = "",
  previewPrimaryId = primaryId,
  phase = ORIENTATION_PHASE.COMMITTED,
  gestureActive = false,
  previewAccepted = false,
  worldBasisRevision = 0,
  revision = 0
} = {}) {
  return deepFreeze({
    quaternion: normalizeQuaternion(quaternion),
    committedQuaternion: normalizeQuaternion(committedQuaternion),
    originQuaternion:
      originQuaternion === null
        ? null
        : normalizeQuaternion(originQuaternion),
    primaryId: String(primaryId || ""),
    previewPrimaryId: String(previewPrimaryId || ""),
    phase,
    gestureActive: Boolean(gestureActive),
    previewAccepted: Boolean(previewAccepted),
    worldBasisRevision,
    revision
  });
}

function normalizeTransactionPhase(value) {
  const phase = String(value || "").trim().toUpperCase();
  return Object.values(TRANSACTION_PHASE).includes(phase) ? phase : "";
}

function normalizeRevision(value) {
  return Number.isInteger(value) && value >= 0 ? value : null;
}

function transactionReceipt({
  previousPhase,
  requestedPhase,
  resultingPhase,
  transactionRevision,
  targetType = "",
  targetId = "",
  accepted = false,
  rejectionReason = "",
  revisionAdvanced = false,
  revisionEvent = "",
  routeCommitAuthorized = false
}) {
  return deepFreeze({
    schema: "UNIVERSAL_COMPASS_TRANSACTION_TRANSITION_RECEIPT_v1",
    previousPhase,
    requestedPhase,
    resultingPhase,
    transactionRevision,
    targetType: String(targetType || ""),
    targetId: String(targetId || ""),
    accepted: Boolean(accepted),
    rejectionReason: String(rejectionReason || ""),
    revisionAdvanced: Boolean(revisionAdvanced),
    revisionEvent: String(revisionEvent || ""),
    routeCommitAuthorized: Boolean(routeCommitAuthorized)
  });
}

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
    adapters &&
      typeof adapters.resolveRoute === "function" &&
      typeof adapters.navigate === "function",
    "COMPASS_CONTROLLER_ADAPTERS_REQUIRED"
  );
  assertContract(
    nodes &&
      typeof nodes.get === "function" &&
      typeof nodes.has === "function",
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

  const allNodes = () =>
    typeof nodes.all === "function"
      ? nodes.all()
      : [];

  const nodesForPresentation = presentation =>
    typeof nodes.forPresentation === "function"
      ? nodes.forPresentation(presentation)
      : allNodes().filter(node => node.presentation === presentation);

  const firstConstellationId = () =>
    nodesForPresentation(PRESENTATION.CONSTELLATION)[0]?.id || "";

  const clusterMembersFor = cardinalId => {
    const candidates = nodesForPresentation(PRESENTATION.CLUSTER);
    const explicit = candidates.filter(node =>
      node.semantic?.cardinalId === cardinalId ||
      node.semantic?.parentCardinalId === cardinalId ||
      node.domain === cardinalId
    );
    return explicit.length ? explicit : candidates;
  };

  const clusterContainsNode = (cardinalId, nodeId) =>
    clusterMembersFor(cardinalId).some(node => node.id === nodeId);

  const basisRevision = currentWorldBasisRevision();
  const initialConstellation = orientationRecord({
    worldBasisRevision: basisRevision
  });

  let state = deepFreeze({
    schema: "UNIVERSAL_COMPASS_CONTROLLER_STATE_v2",
    presentation: PRESENTATION.CONSTELLATION,
    held: false,
    holdReason: "",
    activeCardinalId: "",
    lastActiveCardinalId: "",
    selectedId: "",
    constellation: initialConstellation,
    clusters: {},
    transaction: deepFreeze({
      phase: TRANSACTION_PHASE.ORIENTATION,
      revision: 0,
      targetType: "",
      targetId: "",
      lastReceipt: null
    }),
    navigationIntent: null,
    optionalParticipantLifecycle: null,

    // Compatibility mirrors consumed by the current interaction and reference lanes.
    orientationPhase: initialConstellation.phase,
    transactionPhase: TRANSACTION_PHASE.ORIENTATION,
    orientation: initialConstellation.quaternion,
    originOrientation: initialConstellation.committedQuaternion,
    primaryId: initialConstellation.primaryId,
    worldBasisRevision: basisRevision,
    revision: 0,
    lastAction: "initialize"
  });

  const listeners = new Set();

  function activeOrientation(source = state) {
    if (source.presentation === PRESENTATION.CONSTELLATION) {
      return source.constellation;
    }
    return source.clusters[source.activeCardinalId] || null;
  }

  function withCompatibilityMirrors(next) {
    const orientation = activeOrientation(next);
    assertContract(
      orientation,
      "COMPASS_ACTIVE_ORIENTATION_RECORD_REQUIRED",
      Object.freeze({
        presentation: next.presentation,
        activeCardinalId: next.activeCardinalId
      })
    );

    return {
      ...next,
      orientationPhase: orientation.phase,
      transactionPhase: next.transaction.phase,
      orientation: orientation.quaternion,
      originOrientation:
        orientation.originQuaternion || orientation.committedQuaternion,
      primaryId:
        orientation.phase === ORIENTATION_PHASE.PREVIEW
          ? orientation.previewPrimaryId
          : orientation.primaryId,
      worldBasisRevision: orientation.worldBasisRevision
    };
  }

  function publish(next, action) {
    state = deepFreeze({
      ...withCompatibilityMirrors(next),
      revision: state.revision + 1,
      lastAction: action
    });
    listeners.forEach(listener => listener(state));
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
      clusters: {
        ...source.clusters,
        [source.activeCardinalId]: record
      }
    };
  }

  function transactionState({
    phase = state.transaction.phase,
    revision = state.transaction.revision,
    targetType = state.transaction.targetType,
    targetId = state.transaction.targetId,
    lastReceipt = state.transaction.lastReceipt
  } = {}) {
    return deepFreeze({
      phase,
      revision,
      targetType: String(targetType || ""),
      targetId: String(targetId || ""),
      lastReceipt
    });
  }

  function beginGesture(options = {}) {
    requireNotHeld();
    assertContract(
      options && typeof options === "object" && !Array.isArray(options),
      "COMPASS_GESTURE_OPTIONS_INVALID"
    );

    const expectedPresentation =
      options.presentation || state.presentation;
    assertContract(
      expectedPresentation === state.presentation,
      "COMPASS_GESTURE_PRESENTATION_MISMATCH"
    );

    if (state.presentation === PRESENTATION.CLUSTER) {
      const requestedCluster =
        String(options.clusterId || state.activeCardinalId || "");
      assertContract(
        requestedCluster &&
          requestedCluster === state.activeCardinalId,
        "COMPASS_GESTURE_CLUSTER_MISMATCH"
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
      worldBasisRevision: currentWorldBasisRevision()
    });

    const next = replaceActiveOrientation(nextOrientation);
    return publish({
      ...next,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.ORIENTATION,
        targetType: state.presentation,
        targetId:
          state.presentation === PRESENTATION.CLUSTER
            ? state.activeCardinalId
            : ""
      }),
      navigationIntent: null
    }, "gesture-begin");
  }

  function preview(proposal) {
    requireNotHeld();
    assertExactKeys(
      proposal,
      ["quaternion", "primaryId", "worldBasisRevision"],
      "COMPASS_CONTROLLER_PREVIEW_KEYS_INVALID"
    );

    const current = activeOrientation();
    assertContract(
      current &&
        current.gestureActive &&
        current.phase === ORIENTATION_PHASE.PREVIEW,
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

    if (state.presentation === PRESENTATION.CLUSTER) {
      assertContract(
        clusterContainsNode(state.activeCardinalId, proposal.primaryId),
        "COMPASS_PRIMARY_OUTSIDE_ACTIVE_CLUSTER",
        proposal.primaryId
      );
    }

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

    const nextOrientation = orientationRecord({
      ...current,
      quaternion: proposal.quaternion,
      previewPrimaryId: proposal.primaryId,
      phase: ORIENTATION_PHASE.PREVIEW,
      gestureActive: true,
      previewAccepted: true,
      worldBasisRevision: expectedWorldBasisRevision
    });

    const next = replaceActiveOrientation(nextOrientation);
    return publish({
      ...next,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.PREVIEW,
        targetType: primaryNode.kind || "NODE",
        targetId: proposal.primaryId
      })
    }, "gesture-preview");
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
      revision: current.revision + 1,
      worldBasisRevision: currentWorldBasisRevision()
    });

    const next = replaceActiveOrientation(nextOrientation);
    const receipt = transactionReceipt({
      previousPhase: state.transaction.phase,
      requestedPhase: TRANSACTION_PHASE.SETTLEMENT,
      resultingPhase: TRANSACTION_PHASE.SETTLEMENT,
      transactionRevision: state.transaction.revision + 1,
      targetType: state.presentation,
      targetId: nextOrientation.primaryId,
      accepted: true,
      revisionAdvanced: true,
      revisionEvent: TRANSACTION_REVISION_EVENTS.SETTLEMENT_ADMITTED
    });

    return publish({
      ...next,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.SETTLEMENT,
        revision: receipt.transactionRevision,
        targetType: receipt.targetType,
        targetId: receipt.targetId,
        lastReceipt: receipt
      })
    }, "gesture-commit");
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
      worldBasisRevision: currentWorldBasisRevision()
    });

    const next = replaceActiveOrientation(nextOrientation);
    const receipt = transactionReceipt({
      previousPhase: state.transaction.phase,
      requestedPhase: TRANSACTION_PHASE.CANCELLED,
      resultingPhase: TRANSACTION_PHASE.CANCELLED,
      transactionRevision: state.transaction.revision + 1,
      targetType: state.transaction.targetType,
      targetId: state.transaction.targetId,
      accepted: true,
      revisionAdvanced: true,
      revisionEvent: TRANSACTION_REVISION_EVENTS.CANCELLED
    });

    return publish({
      ...next,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.CANCELLED,
        revision: receipt.transactionRevision,
        lastReceipt: receipt
      })
    }, `gesture-cancel:${String(reason)}`);
  }

  function cancelActiveGestureForTransition(reason) {
    const current = activeOrientation();
    if (!current?.gestureActive) {
      return state;
    }

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
      worldBasisRevision: currentWorldBasisRevision()
    });

    return replaceActiveOrientation(nextOrientation);
  }

  function ensureCluster(cardinalId, source = state, options = {}) {
    const existing = source.clusters[cardinalId];
    if (existing) {
      return existing;
    }

    const memberIds = clusterMembersFor(cardinalId).map(node => node.id);
    const primaryId =
      String(options.primaryId || memberIds[0] || "");
    return deepFreeze({
      cardinalId,
      memberIds: deepFreeze(memberIds),
      ...orientationRecord({
        quaternion: options.orientation || IDENTITY_QUATERNION,
        committedQuaternion: options.orientation || IDENTITY_QUATERNION,
        primaryId,
        previewPrimaryId: primaryId,
        worldBasisRevision: currentWorldBasisRevision()
      })
    });
  }

  function normalizeClusterRecord(record) {
    const orientation = orientationRecord(record);
    return deepFreeze({
      cardinalId: record.cardinalId,
      memberIds: deepFreeze(Array.from(record.memberIds || [])),
      ...orientation
    });
  }

  function activateCardinal(cardinalId, options = {}) {
    requireNotHeld("COMPASS_HELD_PRESENTATION_LOCK");
    assertContract(
      state.presentation === PRESENTATION.CONSTELLATION,
      "COMPASS_CARDINAL_ACTIVATION_REQUIRES_CONSTELLATION"
    );

    const node = nodes.get(cardinalId);
    assertContract(node, "COMPASS_CARDINAL_UNKNOWN", cardinalId);
    assertContract(
      node.presentation === PRESENTATION.CONSTELLATION,
      "COMPASS_CARDINAL_PRESENTATION_INVALID",
      cardinalId
    );

    let base = cancelActiveGestureForTransition("cardinal-activation");
    const cluster = ensureCluster(cardinalId, base, options);
    base = {
      ...base,
      presentation: PRESENTATION.CLUSTER,
      activeCardinalId: cardinalId,
      lastActiveCardinalId: cardinalId,
      selectedId: "",
      clusters: {
        ...base.clusters,
        [cardinalId]: normalizeClusterRecord(cluster)
      },
      navigationIntent: null,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.SELECTION,
        targetType: node.kind || "CARDINAL",
        targetId: cardinalId
      })
    };

    return publish(base, `cardinal-activated:${cardinalId}`);
  }

  function openCluster(options = {}) {
    const cardinalId = String(
      options.cardinalId ||
      state.primaryId ||
      state.lastActiveCardinalId ||
      firstConstellationId()
    );
    assertContract(cardinalId, "COMPASS_CLUSTER_CARDINAL_REQUIRED");
    return activateCardinal(cardinalId, options);
  }

  function returnToOrbit() {
    requireNotHeld("COMPASS_HELD_PRESENTATION_LOCK");
    assertContract(
      state.presentation === PRESENTATION.CLUSTER,
      "COMPASS_RETURN_TO_ORBIT_REQUIRES_CLUSTER"
    );

    const base = cancelActiveGestureForTransition("return-to-orbit");
    return publish({
      ...base,
      selectedId: "",
      navigationIntent: null,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.ORIENTATION,
        targetType: PRESENTATION.CLUSTER,
        targetId: state.activeCardinalId
      })
    }, `return-to-orbit:${state.activeCardinalId}`);
  }

  function returnToConstellation(options = {}) {
    requireNotHeld("COMPASS_HELD_PRESENTATION_LOCK");
    assertContract(
      state.presentation === PRESENTATION.CLUSTER,
      "COMPASS_RETURN_TO_CONSTELLATION_REQUIRES_CLUSTER"
    );

    const previousCardinalId = state.activeCardinalId;
    const base = cancelActiveGestureForTransition(
      "return-to-constellation"
    );
    const constellation = orientationRecord({
      ...base.constellation,
      quaternion:
        options.orientation || base.constellation.quaternion,
      committedQuaternion:
        options.orientation || base.constellation.committedQuaternion,
      phase: ORIENTATION_PHASE.COMMITTED,
      gestureActive: false,
      previewAccepted: false,
      originQuaternion: null,
      worldBasisRevision: currentWorldBasisRevision()
    });

    return publish({
      ...base,
      presentation: PRESENTATION.CONSTELLATION,
      activeCardinalId: "",
      lastActiveCardinalId: previousCardinalId,
      selectedId: "",
      constellation,
      navigationIntent: null,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.ORIENTATION,
        targetType: PRESENTATION.CONSTELLATION,
        targetId: previousCardinalId
      })
    }, `return-to-constellation:${previousCardinalId}`);
  }

  function setPresentation(nextPresentation, options = {}) {
    const next = assertCanonicalPresentation(nextPresentation);
    const allowed = PRESENTATION_TRANSITIONS[state.presentation] || [];
    assertContract(
      allowed.includes(next),
      "COMPASS_PRESENTATION_TRANSITION_PROHIBITED",
      Object.freeze({ from: state.presentation, to: next })
    );

    if (next === state.presentation) {
      return state;
    }
    return next === PRESENTATION.CLUSTER
      ? openCluster(options)
      : returnToConstellation(options);
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

    if (state.presentation === PRESENTATION.CLUSTER) {
      assertContract(
        clusterContainsNode(state.activeCardinalId, id),
        "COMPASS_SELECTION_OUTSIDE_ACTIVE_CLUSTER",
        id
      );
    }

    const base = cancelActiveGestureForTransition("selection");
    return publish({
      ...base,
      selectedId: id,
      navigationIntent: null,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.SELECTION,
        targetType: node.kind || "NODE",
        targetId: id
      })
    }, `select:${id}`);
  }

  function enterHeld(reason = "held") {
    assertContract(!state.held, "COMPASS_ALREADY_HELD");
    const base = cancelActiveGestureForTransition("hold-enter");
    return publish({
      ...base,
      held: true,
      holdReason: String(reason)
    }, `hold-enter:${String(reason)}`);
  }

  function leaveHeld() {
    assertContract(state.held, "COMPASS_NOT_HELD");
    return publish({
      ...state,
      held: false,
      holdReason: ""
    }, "hold-leave");
  }

  function evaluateTransactionTransition({
    currentPhase = state.transaction.phase,
    requestedPhase,
    transactionRevision = state.transaction.revision,
    revisionEvent = "",
    targetType = "",
    targetId = ""
  } = {}) {
    const current = normalizeTransactionPhase(currentPhase);
    const requested = normalizeTransactionPhase(requestedPhase);
    const revision = normalizeRevision(transactionRevision);
    let rejectionReason = "";

    if (!current) {
      rejectionReason = "COMPASS_TRANSACTION_CURRENT_PHASE_INVALID";
    } else if (!requested) {
      rejectionReason = "COMPASS_TRANSACTION_REQUESTED_PHASE_INVALID";
    } else if (revision === null) {
      rejectionReason = "COMPASS_TRANSACTION_REVISION_INVALID";
    } else if (revision !== state.transaction.revision) {
      rejectionReason = "COMPASS_TRANSACTION_REVISION_STALE";
    } else if (
      String(targetType || "").toUpperCase() === "HOME_COMPASS" &&
      ![
        TRANSACTION_PHASE.ORIENTATION,
        TRANSACTION_PHASE.CANCELLED
      ].includes(requested)
    ) {
      rejectionReason =
        "COMPASS_HOME_PARTICIPANT_TRANSACTION_FORBIDDEN";
    } else if (
      !TRANSACTION_TRANSITIONS[current]?.includes(requested)
    ) {
      rejectionReason =
        "COMPASS_TRANSACTION_PHASE_TRANSITION_ILLEGAL";
    }

    if (rejectionReason) {
      return transactionReceipt({
        previousPhase: current,
        requestedPhase: requested,
        resultingPhase: current,
        transactionRevision: state.transaction.revision,
        targetType,
        targetId,
        accepted: false,
        rejectionReason,
        revisionEvent
      });
    }

    const selfTransition = current === requested;
    const revisionAdvanced =
      !selfTransition &&
      REVISION_ADVANCING_EVENTS.has(
        String(revisionEvent || "").toUpperCase()
      );
    const nextRevision = revisionAdvanced
      ? state.transaction.revision + 1
      : state.transaction.revision;

    return transactionReceipt({
      previousPhase: current,
      requestedPhase: requested,
      resultingPhase: requested,
      transactionRevision: nextRevision,
      targetType,
      targetId,
      accepted: true,
      revisionAdvanced,
      revisionEvent,
      routeCommitAuthorized:
        requested === TRANSACTION_PHASE.ROUTE_COMMIT
    });
  }

  function requestTransactionTransition(proposal) {
    requireNotHeld();
    const receipt = evaluateTransactionTransition(proposal);
    if (!receipt.accepted) {
      return receipt;
    }

    publish({
      ...state,
      transaction: transactionState({
        phase: receipt.resultingPhase,
        revision: receipt.transactionRevision,
        targetType: receipt.targetType,
        targetId: receipt.targetId,
        lastReceipt: receipt
      })
    }, `transaction:${receipt.previousPhase}->${receipt.resultingPhase}`);

    return receipt;
  }

  function authorizeNavigation({
    selectedId = state.selectedId,
    routeKey,
    transactionRevision = state.transaction.revision
  } = {}) {
    requireNotHeld();
    assertContract(selectedId, "COMPASS_NAVIGATION_SELECTION_REQUIRED");
    assertContract(
      selectedId === state.selectedId,
      "COMPASS_NAVIGATION_SELECTION_STALE"
    );

    const node = nodes.get(selectedId);
    assertContract(node, "COMPASS_NAVIGATION_NODE_UNKNOWN", selectedId);
    const admittedRouteKey = String(routeKey || node.routeKey || "");
    const route = adapters.resolveRoute(admittedRouteKey);
    assertContract(route, "COMPASS_ROUTE_UNRESOLVED", admittedRouteKey);
    assertContract(
      transactionRevision === state.transaction.revision,
      "COMPASS_TRANSACTION_REVISION_STALE"
    );

    const intent = deepFreeze({
      schema: "UNIVERSAL_COMPASS_NAVIGATION_INTENT_v1",
      selectedId,
      routeKey: admittedRouteKey,
      route,
      transactionRevision,
      authorized: true
    });

    publish({
      ...state,
      navigationIntent: intent,
      transaction: transactionState({
        phase: TRANSACTION_PHASE.ROUTE_COMMIT,
        revision: state.transaction.revision + 1,
        targetType: node.kind || "NODE",
        targetId: selectedId,
        lastReceipt: transactionReceipt({
          previousPhase: state.transaction.phase,
          requestedPhase: TRANSACTION_PHASE.ROUTE_COMMIT,
          resultingPhase: TRANSACTION_PHASE.ROUTE_COMMIT,
          transactionRevision: state.transaction.revision + 1,
          targetType: node.kind || "NODE",
          targetId: selectedId,
          accepted: true,
          revisionAdvanced: true,
          revisionEvent: TRANSACTION_REVISION_EVENTS.ROUTE_COMMIT,
          routeCommitAuthorized: true
        })
      })
    }, `navigation-authorized:${selectedId}`);

    return intent;
  }

  function navigate(routeKey) {
    const intent = authorizeNavigation({
      routeKey,
      transactionRevision: state.transaction.revision
    });
    return adapters.navigate(intent.route);
  }

  function interruptionSnapshotFrom(
    source,
    participantId = ""
  ) {
    return deepFreeze({
      schema: "UNIVERSAL_COMPASS_INTERRUPTION_SNAPSHOT_v1",
      participantId: String(participantId || ""),
      presentation: source.presentation,
      held: source.held,
      holdReason: source.holdReason,
      activeCardinalId: source.activeCardinalId,
      lastActiveCardinalId: source.lastActiveCardinalId,
      selectedId: source.selectedId,
      constellation: source.constellation,
      clusters: source.clusters,
      transaction: source.transaction,
      navigationIntent: source.navigationIntent
    });
  }

  function captureInterruptionSnapshot(participantId = "") {
    return interruptionSnapshotFrom(state, participantId);
  }

  function beginOptionalParticipantTransition({
    participantId,
    transitionId
  } = {}) {
    requireNotHeld();
    assertContract(participantId, "COMPASS_PARTICIPANT_ID_REQUIRED");
    assertContract(transitionId, "COMPASS_PARTICIPANT_TRANSITION_ID_REQUIRED");
    assertContract(
      state.optionalParticipantLifecycle === null,
      "COMPASS_PARTICIPANT_TRANSITION_ALREADY_ACTIVE"
    );

    let base = cancelActiveGestureForTransition(
      "optional-participant-transition"
    );
    if (activeOrientation(state)?.gestureActive) {
      base = {
        ...base,
        transaction: transactionState({
          phase: TRANSACTION_PHASE.CANCELLED,
          revision: state.transaction.revision + 1,
          lastReceipt: transactionReceipt({
            previousPhase: state.transaction.phase,
            requestedPhase: TRANSACTION_PHASE.CANCELLED,
            resultingPhase: TRANSACTION_PHASE.CANCELLED,
            transactionRevision: state.transaction.revision + 1,
            targetType: state.transaction.targetType,
            targetId: state.transaction.targetId,
            accepted: true,
            revisionAdvanced: true,
            revisionEvent: TRANSACTION_REVISION_EVENTS.CANCELLED
          })
        })
      };
    }
    const snapshot = interruptionSnapshotFrom(base, participantId);
    return publish({
      ...base,
      optionalParticipantLifecycle: deepFreeze({
        participantId: String(participantId),
        transitionId: String(transitionId),
        status: OPTIONAL_PARTICIPANT_STATUS.ACTIVE,
        snapshot,
        completionReceipt: null
      })
    }, `participant-begin:${participantId}:${transitionId}`);
  }

  function completeOptionalParticipantTransition(receipt = {}) {
    const lifecycle = state.optionalParticipantLifecycle;
    assertContract(
      lifecycle &&
        lifecycle.status === OPTIONAL_PARTICIPANT_STATUS.ACTIVE,
      "COMPASS_PARTICIPANT_TRANSITION_NOT_ACTIVE"
    );
    if (receipt.transitionId !== undefined) {
      assertContract(
        String(receipt.transitionId) === lifecycle.transitionId,
        "COMPASS_PARTICIPANT_TRANSITION_ID_MISMATCH"
      );
    }

    return publish({
      ...state,
      optionalParticipantLifecycle: deepFreeze({
        ...lifecycle,
        status: OPTIONAL_PARTICIPANT_STATUS.COMPLETE,
        completionReceipt: deepFreeze(structuredClone(receipt))
      })
    }, `participant-complete:${lifecycle.participantId}`);
  }

  function rollbackOptionalParticipantTransition({
    transitionId,
    reason = "rollback"
  } = {}) {
    const lifecycle = state.optionalParticipantLifecycle;
    assertContract(
      lifecycle,
      "COMPASS_PARTICIPANT_TRANSITION_NOT_ACTIVE"
    );
    assertContract(
      String(transitionId || "") === lifecycle.transitionId,
      "COMPASS_PARTICIPANT_TRANSITION_ID_MISMATCH"
    );

    const snapshot = lifecycle.snapshot;
    const restored = {
      ...state,
      presentation: snapshot.presentation,
      held: snapshot.held,
      holdReason: snapshot.holdReason,
      activeCardinalId: snapshot.activeCardinalId,
      lastActiveCardinalId: snapshot.lastActiveCardinalId,
      selectedId: snapshot.selectedId,
      constellation: snapshot.constellation,
      clusters: snapshot.clusters,
      transaction: snapshot.transaction,
      navigationIntent: snapshot.navigationIntent,
      optionalParticipantLifecycle: null
    };

    return publish(
      restored,
      `participant-rollback:${lifecycle.participantId}:${String(reason)}`
    );
  }

  return Object.freeze({
    getState: () => state,
    getRevision: () => state.revision,
    beginGesture,
    preview,
    commit,
    cancel,
    setPresentation,
    activateCardinal,
    openCluster,
    returnToOrbit,
    returnToConstellation,
    enterHeld,
    leaveHeld,
    select,
    evaluateTransactionTransition,
    requestTransactionTransition,
    authorizeNavigation,
    navigate,
    captureInterruptionSnapshot,
    beginOptionalParticipantTransition,
    completeOptionalParticipantTransition,
    rollbackOptionalParticipantTransition,
    transactionPhases: TRANSACTION_PHASE,
    transactionRevisionEvents: TRANSACTION_REVISION_EVENTS,
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
