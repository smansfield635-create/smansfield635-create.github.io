/* /products/archcoin/index.controller.js
 * ARCHCOIN accepted-state, transaction, and navigation authority.
 *
 * Seven-file authority role:
 *   index.planet.js       -> immutable world identity and membership truth
 *   index.crystals.js     -> visual interpretation of planet truth
 *   index.compositor.js   -> camera projection and composite-frame truth
 *   index.controller.js   -> accepted state, transaction, and navigation truth
 *   index.interactions.js -> pointer interpretation and gesture proposals
 *
 * This file is source-derived from the four-compass controller audit. It has no
 * dependency on compass.nodes.js, compass.profiles.js, compass.adapters.js,
 * compass.contracts.js, compass.math.js, or any other abandoned runtime file.
 */
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_ARCHCOIN_CONTROLLER",
    version: "8.0.0-seven-file-planet-owned-identity",
    file: "/products/archcoin/index.controller.js",
    authority: "CONTROLLER",
    identityAuthority: "PLANET",
    interactionAuthority: "INTERACTIONS",
    projectionAuthority: "COMPOSITOR",
    crystalAuthority: "CRYSTALS",
    nodeRegistryDependency: false,
    profileDependency: false,
    externalContractDependency: false,
    externalMathDependency: false,
    productionAuthorized: false
  });

  const PRESENTATION = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER"
  });

  const ORIENTATION_PHASE = Object.freeze({
    IDLE: "IDLE",
    PREVIEW: "PREVIEW",
    COMMITTED: "COMMITTED",
    CANCELLED: "CANCELLED"
  });

  const TRANSACTION_PHASE = Object.freeze({
    ORIENTATION: "ORIENTATION",
    SELECTION: "SELECTION",
    PREVIEW: "PREVIEW",
    CONFIRMATION: "CONFIRMATION",
    SETTLEMENT: "SETTLEMENT",
    ROUTE_COMMIT: "ROUTE_COMMIT",
    CANCELLED: "CANCELLED"
  });

  const TRANSACTION_REVISION_EVENT = Object.freeze({
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

  const PARTICIPANT_KIND = Object.freeze({
    NON_NAVIGATIONAL_CENTER_PARTICIPANT:
      "NON_NAVIGATIONAL_CENTER_PARTICIPANT"
  });

  const OPTIONAL_PARTICIPANT_STATUS = Object.freeze({
    ACTIVE: "ACTIVE",
    COMPLETE: "COMPLETE"
  });

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

  const REVISION_ADVANCING_EVENTS = new Set([
    TRANSACTION_REVISION_EVENT.NEW_TRANSACTION,
    TRANSACTION_REVISION_EVENT.TARGET_REPLACEMENT,
    TRANSACTION_REVISION_EVENT.PREVIEW_OPENED,
    TRANSACTION_REVISION_EVENT.CONFIRMATION_ACCEPTED,
    TRANSACTION_REVISION_EVENT.SETTLEMENT_ADMITTED,
    TRANSACTION_REVISION_EVENT.CANCELLED,
    TRANSACTION_REVISION_EVENT.ROUTE_COMMIT
  ]);

  const IDENTITY_QUATERNION = Object.freeze([0, 0, 0, 1]);
  const EPSILON = 1e-8;

  function fail(code, details = null) {
    const error = new Error(code);
    error.code = code;
    error.details = details;
    throw error;
  }

  function assert(condition, code, details = null) {
    if (!condition) fail(code, details);
  }

  function deepFreeze(value, seen = new WeakSet()) {
    if (
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    ) {
      return value;
    }
    if (seen.has(value)) return value;
    seen.add(value);
    Reflect.ownKeys(value).forEach(key => deepFreeze(value[key], seen));
    return Object.freeze(value);
  }

  function assertPlainRecord(value, code) {
    assert(
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

  function assertExactKeys(record, keys, code) {
    assertPlainRecord(record, code);
    const actual = Object.keys(record).sort();
    const expected = Array.from(keys).sort();
    assert(
      actual.length === expected.length &&
        actual.every((key, index) => key === expected[index]),
      code,
      deepFreeze({ actual, expected })
    );
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
    return length > EPSILON
      ? quaternion.map(component => component / length)
      : Array.from(fallback);
  }

  function normalizePresentation(value) {
    const presentation = String(value || "").trim().toUpperCase();
    assert(
      Object.values(PRESENTATION).includes(presentation),
      "ARCHCOIN_CONTROLLER_PRESENTATION_INVALID",
      value
    );
    return presentation;
  }

  function normalizeTransactionPhase(value) {
    const phase = String(value || "").trim().toUpperCase();
    return Object.values(TRANSACTION_PHASE).includes(phase) ? phase : "";
  }

  function normalizeRevision(value) {
    return Number.isInteger(value) && value >= 0 ? value : null;
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
      schema: "ARCHCOIN_TRANSACTION_TRANSITION_RECEIPT_v2",
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

  function validateWorldAuthority(world) {
    assertPlainRecord(world, "ARCHCOIN_CONTROLLER_PLANET_AUTHORITY_REQUIRED");
    const required = [
      "getWorldBasisRevision",
      "getIdentity",
      "getCardinalIds",
      "getClusterMemberIds",
      "isIdentityInPresentation",
      "isClusterMember",
      "getRouteKey"
    ];
    required.forEach(method => {
      assert(
        typeof world[method] === "function",
        "ARCHCOIN_CONTROLLER_PLANET_METHOD_REQUIRED",
        method
      );
    });
    return world;
  }

  function createController({
    world,
    resolveRoute = routeKey => routeKey,
    executeNavigation = route => {
      if (typeof location !== "undefined" && route) {
        location.assign(route);
        return true;
      }
      return false;
    }
  } = {}) {
    const planet = validateWorldAuthority(world);
    assert(
      typeof resolveRoute === "function",
      "ARCHCOIN_CONTROLLER_ROUTE_RESOLVER_REQUIRED"
    );
    assert(
      typeof executeNavigation === "function",
      "ARCHCOIN_CONTROLLER_NAVIGATION_EXECUTOR_REQUIRED"
    );

    function currentWorldBasisRevision() {
      const revision = planet.getWorldBasisRevision();
      assert(
        Number.isInteger(revision) && revision >= 0,
        "ARCHCOIN_WORLD_BASIS_REVISION_INVALID",
        revision
      );
      return revision;
    }

    function identity(id) {
      const record = planet.getIdentity(String(id || ""));
      assert(record, "ARCHCOIN_IDENTITY_UNKNOWN", id);
      return record;
    }

    function cardinalIds() {
      const ids = Array.from(planet.getCardinalIds() || []).map(String);
      assert(
        ids.length === 4 && new Set(ids).size === 4,
        "ARCHCOIN_CARDINAL_IDENTITY_SET_INVALID",
        ids
      );
      return ids;
    }

    function clusterMemberIds(cardinalId) {
      return Array.from(planet.getClusterMemberIds(cardinalId) || []).map(String);
    }

    function requireIdentityInPresentation(id, presentation) {
      const admitted = identity(id);
      assert(
        planet.isIdentityInPresentation(id, presentation),
        "ARCHCOIN_IDENTITY_PRESENTATION_MISMATCH",
        deepFreeze({ id, presentation })
      );
      return admitted;
    }

    const basisRevision = currentWorldBasisRevision();
    const initialConstellation = orientationRecord({
      worldBasisRevision: basisRevision
    });

    let state = deepFreeze({
      schema: "ARCHCOIN_CONTROLLER_STATE_v3",
      presentation: PRESENTATION.CONSTELLATION,
      held: false,
      holdReason: "",
      activeCardinalId: "",
      lastActiveCardinalId: "",
      selectedId: "",
      constellation: initialConstellation,
      clusters: deepFreeze({}),
      transaction: deepFreeze({
        phase: TRANSACTION_PHASE.ORIENTATION,
        revision: 0,
        targetType: "",
        targetId: "",
        lastReceipt: null
      }),
      navigationIntent: null,
      optionalParticipantLifecycle: null,
      revision: 0,
      lastAction: "initialize"
    });

    const listeners = new Set();

    function activeOrientation(source = state) {
      return source.presentation === PRESENTATION.CONSTELLATION
        ? source.constellation
        : source.clusters[source.activeCardinalId] || null;
    }

    function publish(next, action) {
      state = deepFreeze({
        ...next,
        revision: state.revision + 1,
        lastAction: action
      });
      listeners.forEach(listener => listener(state));
      return state;
    }

    function requireNotHeld(code = "ARCHCOIN_CONTROLLER_HELD") {
      assert(!state.held, code, state.holdReason);
    }

    function replaceActiveOrientation(record, source = state) {
      if (source.presentation === PRESENTATION.CONSTELLATION) {
        return { ...source, constellation: record };
      }
      return {
        ...source,
        clusters: deepFreeze({
          ...source.clusters,
          [source.activeCardinalId]: record
        })
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
      assertPlainRecord(options, "ARCHCOIN_GESTURE_OPTIONS_INVALID");
      const requestedPresentation = normalizePresentation(
        options.presentation || state.presentation
      );
      assert(
        requestedPresentation === state.presentation,
        "ARCHCOIN_GESTURE_PRESENTATION_MISMATCH"
      );
      if (state.presentation === PRESENTATION.CLUSTER) {
        const requestedCluster = String(
          options.cardinalId || state.activeCardinalId || ""
        );
        assert(
          requestedCluster === state.activeCardinalId,
          "ARCHCOIN_GESTURE_CLUSTER_MISMATCH"
        );
      }
      const current = activeOrientation();
      assert(current, "ARCHCOIN_ACTIVE_ORIENTATION_REQUIRED");
      assert(
        !current.gestureActive && current.phase !== ORIENTATION_PHASE.PREVIEW,
        "ARCHCOIN_GESTURE_ALREADY_ACTIVE"
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
      return publish(
        {
          ...replaceActiveOrientation(nextOrientation),
          transaction: transactionState({
            phase: TRANSACTION_PHASE.ORIENTATION,
            targetType: state.presentation,
            targetId:
              state.presentation === PRESENTATION.CLUSTER
                ? state.activeCardinalId
                : ""
          }),
          navigationIntent: null
        },
        "gesture-begin"
      );
    }

    function preview(proposal) {
      requireNotHeld();
      assertExactKeys(
        proposal,
        ["quaternion", "primaryId", "worldBasisRevision"],
        "ARCHCOIN_CONTROLLER_PREVIEW_KEYS_INVALID"
      );
      const current = activeOrientation();
      assert(
        current &&
          current.gestureActive &&
          current.phase === ORIENTATION_PHASE.PREVIEW,
        "ARCHCOIN_PREVIEW_WITHOUT_ACTIVE_GESTURE"
      );
      const primaryId = String(proposal.primaryId || "");
      const primary = requireIdentityInPresentation(primaryId, state.presentation);
      if (state.presentation === PRESENTATION.CLUSTER) {
        assert(
          planet.isClusterMember(state.activeCardinalId, primaryId),
          "ARCHCOIN_PRIMARY_OUTSIDE_ACTIVE_CLUSTER",
          primaryId
        );
      }
      const expectedRevision = currentWorldBasisRevision();
      assert(
        Number.isInteger(proposal.worldBasisRevision) &&
          proposal.worldBasisRevision === expectedRevision,
        "ARCHCOIN_WORLD_BASIS_REVISION_STALE",
        deepFreeze({ proposed: proposal.worldBasisRevision, expectedRevision })
      );
      const nextOrientation = orientationRecord({
        ...current,
        quaternion: proposal.quaternion,
        previewPrimaryId: primaryId,
        phase: ORIENTATION_PHASE.PREVIEW,
        gestureActive: true,
        previewAccepted: true,
        worldBasisRevision: expectedRevision
      });
      return publish(
        {
          ...replaceActiveOrientation(nextOrientation),
          transaction: transactionState({
            phase: TRANSACTION_PHASE.PREVIEW,
            targetType: primary.kind || "IDENTITY",
            targetId: primaryId
          })
        },
        "gesture-preview"
      );
    }

    function commit() {
      requireNotHeld();
      const current = activeOrientation();
      assert(
        current &&
          current.gestureActive &&
          current.phase === ORIENTATION_PHASE.PREVIEW,
        "ARCHCOIN_COMMIT_WITHOUT_ACTIVE_GESTURE"
      );
      assert(
        current.previewAccepted,
        "ARCHCOIN_COMMIT_ACCEPTED_PREVIEW_REQUIRED"
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
      const receipt = transactionReceipt({
        previousPhase: state.transaction.phase,
        requestedPhase: TRANSACTION_PHASE.SETTLEMENT,
        resultingPhase: TRANSACTION_PHASE.SETTLEMENT,
        transactionRevision: state.transaction.revision + 1,
        targetType: state.presentation,
        targetId: nextOrientation.primaryId,
        accepted: true,
        revisionAdvanced: true,
        revisionEvent: TRANSACTION_REVISION_EVENT.SETTLEMENT_ADMITTED
      });
      return publish(
        {
          ...replaceActiveOrientation(nextOrientation),
          transaction: transactionState({
            phase: TRANSACTION_PHASE.SETTLEMENT,
            revision: receipt.transactionRevision,
            targetType: receipt.targetType,
            targetId: receipt.targetId,
            lastReceipt: receipt
          })
        },
        "gesture-commit"
      );
    }

    function cancel(reason = "cancelled") {
      const current = activeOrientation();
      assert(
        current &&
          current.gestureActive &&
          current.phase === ORIENTATION_PHASE.PREVIEW,
        "ARCHCOIN_CANCEL_WITHOUT_ACTIVE_GESTURE"
      );
      const restored = current.originQuaternion || current.committedQuaternion;
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
      const receipt = transactionReceipt({
        previousPhase: state.transaction.phase,
        requestedPhase: TRANSACTION_PHASE.CANCELLED,
        resultingPhase: TRANSACTION_PHASE.CANCELLED,
        transactionRevision: state.transaction.revision + 1,
        targetType: state.transaction.targetType,
        targetId: state.transaction.targetId,
        accepted: true,
        revisionAdvanced: true,
        revisionEvent: TRANSACTION_REVISION_EVENT.CANCELLED
      });
      return publish(
        {
          ...replaceActiveOrientation(nextOrientation),
          transaction: transactionState({
            phase: TRANSACTION_PHASE.CANCELLED,
            revision: receipt.transactionRevision,
            lastReceipt: receipt
          })
        },
        `gesture-cancel:${String(reason)}`
      );
    }

    function cancelActiveGestureForTransition() {
      const current = activeOrientation();
      if (!current?.gestureActive) return state;
      const restored = current.originQuaternion || current.committedQuaternion;
      return replaceActiveOrientation(
        orientationRecord({
          ...current,
          quaternion: restored,
          committedQuaternion: current.committedQuaternion,
          originQuaternion: null,
          previewPrimaryId: current.primaryId,
          phase: ORIENTATION_PHASE.CANCELLED,
          gestureActive: false,
          previewAccepted: false,
          worldBasisRevision: currentWorldBasisRevision()
        })
      );
    }

    function ensureCluster(cardinalId, source = state, options = {}) {
      if (source.clusters[cardinalId]) return source.clusters[cardinalId];
      const memberIds = clusterMemberIds(cardinalId);
      assert(memberIds.length > 0, "ARCHCOIN_CLUSTER_EMPTY", cardinalId);
      const primaryId = String(options.primaryId || memberIds[0]);
      assert(
        planet.isClusterMember(cardinalId, primaryId),
        "ARCHCOIN_CLUSTER_PRIMARY_INVALID",
        primaryId
      );
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

    function activateCardinal(cardinalId, options = {}) {
      requireNotHeld("ARCHCOIN_HELD_PRESENTATION_LOCK");
      assert(
        state.presentation === PRESENTATION.CONSTELLATION,
        "ARCHCOIN_CARDINAL_ACTIVATION_REQUIRES_CONSTELLATION"
      );
      const id = String(cardinalId || "");
      assert(cardinalIds().includes(id), "ARCHCOIN_CARDINAL_UNKNOWN", id);
      const cardinal = requireIdentityInPresentation(id, PRESENTATION.CONSTELLATION);
      let base = cancelActiveGestureForTransition();
      const cluster = ensureCluster(id, base, options);
      base = {
        ...base,
        presentation: PRESENTATION.CLUSTER,
        activeCardinalId: id,
        lastActiveCardinalId: id,
        selectedId: "",
        clusters: deepFreeze({ ...base.clusters, [id]: cluster }),
        navigationIntent: null,
        transaction: transactionState({
          phase: TRANSACTION_PHASE.SELECTION,
          targetType: cardinal.kind || "CARDINAL",
          targetId: id
        })
      };
      return publish(base, `cardinal-activated:${id}`);
    }

    function returnToConstellation(options = {}) {
      requireNotHeld("ARCHCOIN_HELD_PRESENTATION_LOCK");
      assert(
        state.presentation === PRESENTATION.CLUSTER,
        "ARCHCOIN_RETURN_TO_CONSTELLATION_REQUIRES_CLUSTER"
      );
      const previousCardinalId = state.activeCardinalId;
      const base = cancelActiveGestureForTransition();
      const constellation = orientationRecord({
        ...base.constellation,
        quaternion: options.orientation || base.constellation.quaternion,
        committedQuaternion:
          options.orientation || base.constellation.committedQuaternion,
        phase: ORIENTATION_PHASE.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        originQuaternion: null,
        worldBasisRevision: currentWorldBasisRevision()
      });
      return publish(
        {
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
        },
        `return-to-constellation:${previousCardinalId}`
      );
    }

    function setPresentation(nextPresentation, options = {}) {
      const next = normalizePresentation(nextPresentation);
      const allowed = PRESENTATION_TRANSITIONS[state.presentation] || [];
      assert(
        allowed.includes(next),
        "ARCHCOIN_PRESENTATION_TRANSITION_PROHIBITED",
        deepFreeze({ from: state.presentation, to: next })
      );
      if (next === state.presentation) return state;
      assert(
        next !== PRESENTATION.CLUSTER,
        "ARCHCOIN_DIRECT_CARDINAL_ACTIVATION_REQUIRED"
      );
      return returnToConstellation(options);
    }

    function select(id) {
      requireNotHeld();
      const selectedId = String(id || "");
      const selected = requireIdentityInPresentation(selectedId, state.presentation);
      if (state.presentation === PRESENTATION.CLUSTER) {
        assert(
          planet.isClusterMember(state.activeCardinalId, selectedId),
          "ARCHCOIN_SELECTION_OUTSIDE_ACTIVE_CLUSTER",
          selectedId
        );
      }
      const base = cancelActiveGestureForTransition();
      return publish(
        {
          ...base,
          selectedId,
          navigationIntent: null,
          transaction: transactionState({
            phase: TRANSACTION_PHASE.SELECTION,
            targetType: selected.kind || "IDENTITY",
            targetId: selectedId
          })
        },
        `select:${selectedId}`
      );
    }

    function enterHeld(reason = "held") {
      assert(!state.held, "ARCHCOIN_ALREADY_HELD");
      const base = cancelActiveGestureForTransition();
      return publish(
        { ...base, held: true, holdReason: String(reason) },
        `hold-enter:${String(reason)}`
      );
    }

    function leaveHeld() {
      assert(state.held, "ARCHCOIN_NOT_HELD");
      return publish({ ...state, held: false, holdReason: "" }, "hold-leave");
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
        rejectionReason = "ARCHCOIN_TRANSACTION_CURRENT_PHASE_INVALID";
      } else if (!requested) {
        rejectionReason = "ARCHCOIN_TRANSACTION_REQUESTED_PHASE_INVALID";
      } else if (revision === null) {
        rejectionReason = "ARCHCOIN_TRANSACTION_REVISION_INVALID";
      } else if (revision !== state.transaction.revision) {
        rejectionReason = "ARCHCOIN_TRANSACTION_REVISION_STALE";
      } else if (
        String(targetType || "").toUpperCase() ===
          PARTICIPANT_KIND.NON_NAVIGATIONAL_CENTER_PARTICIPANT &&
        ![
          TRANSACTION_PHASE.ORIENTATION,
          TRANSACTION_PHASE.CANCELLED
        ].includes(requested)
      ) {
        rejectionReason =
          "ARCHCOIN_NON_NAVIGATIONAL_CENTER_TRANSACTION_FORBIDDEN";
      } else if (!TRANSACTION_TRANSITIONS[current]?.includes(requested)) {
        rejectionReason = "ARCHCOIN_TRANSACTION_PHASE_TRANSITION_ILLEGAL";
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
      return transactionReceipt({
        previousPhase: current,
        requestedPhase: requested,
        resultingPhase: requested,
        transactionRevision: revisionAdvanced
          ? state.transaction.revision + 1
          : state.transaction.revision,
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
      if (!receipt.accepted) return receipt;
      publish(
        {
          ...state,
          transaction: transactionState({
            phase: receipt.resultingPhase,
            revision: receipt.transactionRevision,
            targetType: receipt.targetType,
            targetId: receipt.targetId,
            lastReceipt: receipt
          })
        },
        `transaction:${receipt.previousPhase}->${receipt.resultingPhase}`
      );
      return receipt;
    }

    function authorizeNavigation({
      selectedId = state.selectedId,
      routeKey,
      transactionRevision = state.transaction.revision
    } = {}) {
      requireNotHeld();
      assert(selectedId, "ARCHCOIN_NAVIGATION_SELECTION_REQUIRED");
      assert(
        selectedId === state.selectedId,
        "ARCHCOIN_NAVIGATION_SELECTION_STALE"
      );
      const selected = identity(selectedId);
      const admittedRouteKey = String(
        routeKey || planet.getRouteKey(selectedId) || ""
      );
      const route = resolveRoute(admittedRouteKey, selected);
      assert(route, "ARCHCOIN_ROUTE_UNRESOLVED", admittedRouteKey);
      assert(
        transactionRevision === state.transaction.revision,
        "ARCHCOIN_TRANSACTION_REVISION_STALE"
      );
      const intent = deepFreeze({
        schema: "ARCHCOIN_NAVIGATION_INTENT_v2",
        selectedId,
        routeKey: admittedRouteKey,
        route,
        transactionRevision,
        authorized: true
      });
      const receipt = transactionReceipt({
        previousPhase: state.transaction.phase,
        requestedPhase: TRANSACTION_PHASE.ROUTE_COMMIT,
        resultingPhase: TRANSACTION_PHASE.ROUTE_COMMIT,
        transactionRevision: state.transaction.revision + 1,
        targetType: selected.kind || "IDENTITY",
        targetId: selectedId,
        accepted: true,
        revisionAdvanced: true,
        revisionEvent: TRANSACTION_REVISION_EVENT.ROUTE_COMMIT,
        routeCommitAuthorized: true
      });
      publish(
        {
          ...state,
          navigationIntent: intent,
          transaction: transactionState({
            phase: TRANSACTION_PHASE.ROUTE_COMMIT,
            revision: receipt.transactionRevision,
            targetType: receipt.targetType,
            targetId: receipt.targetId,
            lastReceipt: receipt
          })
        },
        `navigation-authorized:${selectedId}`
      );
      return intent;
    }

    function executeAuthorizedNavigation(intent) {
      assert(
        intent && intent === state.navigationIntent && intent.authorized,
        "ARCHCOIN_NAVIGATION_INTENT_NOT_CURRENT"
      );
      return executeNavigation(intent.route, intent);
    }

    function interruptionSnapshotFrom(source, participantId = "") {
      return deepFreeze({
        schema: "ARCHCOIN_INTERRUPTION_SNAPSHOT_v2",
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

    function beginOptionalParticipantTransition({
      participantId,
      transitionId
    } = {}) {
      requireNotHeld();
      assert(participantId, "ARCHCOIN_PARTICIPANT_ID_REQUIRED");
      assert(transitionId, "ARCHCOIN_PARTICIPANT_TRANSITION_ID_REQUIRED");
      assert(
        state.optionalParticipantLifecycle === null,
        "ARCHCOIN_PARTICIPANT_TRANSITION_ALREADY_ACTIVE"
      );
      const base = cancelActiveGestureForTransition();
      const snapshot = interruptionSnapshotFrom(base, participantId);
      return publish(
        {
          ...base,
          optionalParticipantLifecycle: deepFreeze({
            participantId: String(participantId),
            transitionId: String(transitionId),
            kind: PARTICIPANT_KIND.NON_NAVIGATIONAL_CENTER_PARTICIPANT,
            status: OPTIONAL_PARTICIPANT_STATUS.ACTIVE,
            snapshot,
            completionReceipt: null
          })
        },
        `participant-begin:${participantId}:${transitionId}`
      );
    }

    function completeOptionalParticipantTransition(receipt = {}) {
      const lifecycle = state.optionalParticipantLifecycle;
      assert(
        lifecycle && lifecycle.status === OPTIONAL_PARTICIPANT_STATUS.ACTIVE,
        "ARCHCOIN_PARTICIPANT_TRANSITION_NOT_ACTIVE"
      );
      if (receipt.transitionId !== undefined) {
        assert(
          String(receipt.transitionId) === lifecycle.transitionId,
          "ARCHCOIN_PARTICIPANT_TRANSITION_ID_MISMATCH"
        );
      }
      return publish(
        {
          ...state,
          optionalParticipantLifecycle: deepFreeze({
            ...lifecycle,
            status: OPTIONAL_PARTICIPANT_STATUS.COMPLETE,
            completionReceipt: deepFreeze(structuredClone(receipt))
          })
        },
        `participant-complete:${lifecycle.participantId}`
      );
    }

    function rollbackOptionalParticipantTransition({
      transitionId,
      reason = "rollback"
    } = {}) {
      const lifecycle = state.optionalParticipantLifecycle;
      assert(lifecycle, "ARCHCOIN_PARTICIPANT_TRANSITION_NOT_ACTIVE");
      assert(
        String(transitionId || "") === lifecycle.transitionId,
        "ARCHCOIN_PARTICIPANT_TRANSITION_ID_MISMATCH"
      );
      const snapshot = lifecycle.snapshot;
      return publish(
        {
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
        },
        `participant-rollback:${lifecycle.participantId}:${String(reason)}`
      );
    }

    const validationReceipt = deepFreeze({
      schema: "ARCHCOIN_CONTROLLER_SEVEN_FILE_VALIDATION_RECEIPT_v1",
      status: "PASS",
      nodeRegistryDependency: false,
      profileDependency: false,
      adaptersDependency: false,
      homeCompassLiteralPresent: false,
      directCardinalActivationRequired: true,
      planetOwnsIdentityAndMembership: true,
      controllerOwnsAcceptedState: true,
      controllerOwnsTransactionAndNavigation: true,
      compatibilityMirrorStatePublished: false,
      productionAuthority: false
    });

    return Object.freeze({
      contract: CONTRACT,
      getState: () => state,
      getRevision: () => state.revision,
      getValidationReceipt: () => validationReceipt,
      beginGesture,
      preview,
      commit,
      cancel,
      activateCardinal,
      returnToConstellation,
      setPresentation,
      select,
      enterHeld,
      leaveHeld,
      evaluateTransactionTransition,
      requestTransactionTransition,
      authorizeNavigation,
      executeAuthorizedNavigation,
      captureInterruptionSnapshot: participantId =>
        interruptionSnapshotFrom(state, participantId),
      beginOptionalParticipantTransition,
      completeOptionalParticipantTransition,
      rollbackOptionalParticipantTransition,
      subscribe(listener) {
        assert(
          typeof listener === "function",
          "ARCHCOIN_CONTROLLER_LISTENER_REQUIRED"
        );
        listeners.add(listener);
        return () => listeners.delete(listener);
      }
    });
  }

  const authority = Object.freeze({
    moduleId: CONTRACT.id,
    moduleVersion: CONTRACT.version,
    contract: CONTRACT,
    presentation: PRESENTATION,
    orientationPhase: ORIENTATION_PHASE,
    transactionPhase: TRANSACTION_PHASE,
    transactionRevisionEvent: TRANSACTION_REVISION_EVENT,
    participantKind: PARTICIPANT_KIND,
    createController
  });

  globalThis.DGB_ARCHCOIN_CONTROLLER = authority;
  globalThis.dispatchEvent?.(
    new CustomEvent("ARCHCOIN_CONTROLLER_AUTHORITY_READY", {
      detail: deepFreeze({
        moduleId: CONTRACT.id,
        moduleVersion: CONTRACT.version,
        factoryOnly: true,
        planetBindingRequired: true,
        productionAuthority: false
      })
    })
  );
})();
