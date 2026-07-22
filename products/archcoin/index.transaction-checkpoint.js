/* /products/archcoin/index.transaction-checkpoint.js
   ARCHCOIN transactional-phase preservation checkpoint.

   Status:
   - additive candidate scaffold only;
   - intentionally not imported by index.html;
   - intentionally does not mutate controller, interactions, crystals,
     compositor, DOM, navigation, routes, quaternions, or Home Compass state;
   - intended for controlled integration into DGB_ARCHCOIN_CONTROLLER after
     preservation review.

   This file is not a new runtime authority. The existing controller remains
   the sole accepted navigation and future transactional truth authority.
*/

(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_TRANSACTIONAL_STATE_CHECKPOINT",
    version: "1.1.0-preservation-scaffold-hardened",
    file: "/products/archcoin/index.transaction-checkpoint.js",
    targetControllerId: "DGB_ARCHCOIN_CONTROLLER",
    targetContractId: "ARCHCOIN_TRANSACTIONAL_PRECISION_TARGET_CONTRACT_v1"
  });

  const TRANSACTION_PHASES = Object.freeze({
    ORIENTATION: "ORIENTATION",
    ALLOCATION: "ALLOCATION",
    SELECTION: "SELECTION",
    PREVIEW: "PREVIEW",
    CONFIRMATION: "CONFIRMATION",
    SETTLEMENT: "SETTLEMENT",
    ROUTE_COMMIT: "ROUTE_COMMIT",
    CANCELLED: "CANCELLED"
  });

  const TARGET_TYPES = Object.freeze({
    CARDINAL: "cardinal",
    ROOM: "room",
    HOME_COMPASS: "home-compass"
  });

  const REVISION_EVENTS = Object.freeze({
    NEW_TRANSACTION: "NEW_TRANSACTION",
    TARGET_REPLACEMENT: "TARGET_REPLACEMENT",
    PREVIEW_OPENED: "PREVIEW_OPENED",
    CONFIRMATION_ACCEPTED: "CONFIRMATION_ACCEPTED",
    SETTLEMENT_ADMITTED: "SETTLEMENT_ADMITTED",
    CANCELLATION: "CANCELLATION",
    ROUTE_COMMIT: "ROUTE_COMMIT",
    ORDINARY_UPDATE: "ORDINARY_UPDATE",
    RECEIPT_PUBLICATION: "RECEIPT_PUBLICATION",
    IDEMPOTENT_DUPLICATE: "IDEMPOTENT_DUPLICATE",
    VISUAL_FRAME_UPDATE: "VISUAL_FRAME_UPDATE"
  });

  const REVISION_ADVANCING_EVENTS = new Set([
    REVISION_EVENTS.NEW_TRANSACTION,
    REVISION_EVENTS.TARGET_REPLACEMENT,
    REVISION_EVENTS.PREVIEW_OPENED,
    REVISION_EVENTS.CONFIRMATION_ACCEPTED,
    REVISION_EVENTS.SETTLEMENT_ADMITTED,
    REVISION_EVENTS.CANCELLATION,
    REVISION_EVENTS.ROUTE_COMMIT
  ]);

  const TRANSITIONS = Object.freeze({
    [TRANSACTION_PHASES.ORIENTATION]: Object.freeze([
      TRANSACTION_PHASES.ORIENTATION,
      TRANSACTION_PHASES.ALLOCATION,
      TRANSACTION_PHASES.SELECTION,
      TRANSACTION_PHASES.CANCELLED
    ]),
    [TRANSACTION_PHASES.ALLOCATION]: Object.freeze([
      TRANSACTION_PHASES.ALLOCATION,
      TRANSACTION_PHASES.SELECTION,
      TRANSACTION_PHASES.CANCELLED
    ]),
    [TRANSACTION_PHASES.SELECTION]: Object.freeze([
      TRANSACTION_PHASES.SELECTION,
      TRANSACTION_PHASES.PREVIEW,
      TRANSACTION_PHASES.CANCELLED
    ]),
    [TRANSACTION_PHASES.PREVIEW]: Object.freeze([
      TRANSACTION_PHASES.PREVIEW,
      TRANSACTION_PHASES.CONFIRMATION,
      TRANSACTION_PHASES.CANCELLED
    ]),
    [TRANSACTION_PHASES.CONFIRMATION]: Object.freeze([
      TRANSACTION_PHASES.CONFIRMATION,
      TRANSACTION_PHASES.SETTLEMENT,
      TRANSACTION_PHASES.CANCELLED
    ]),
    [TRANSACTION_PHASES.SETTLEMENT]: Object.freeze([
      TRANSACTION_PHASES.SETTLEMENT,
      TRANSACTION_PHASES.ROUTE_COMMIT,
      TRANSACTION_PHASES.CANCELLED
    ]),
    [TRANSACTION_PHASES.ROUTE_COMMIT]: Object.freeze([
      TRANSACTION_PHASES.ROUTE_COMMIT
    ]),
    [TRANSACTION_PHASES.CANCELLED]: Object.freeze([
      TRANSACTION_PHASES.CANCELLED,
      TRANSACTION_PHASES.ORIENTATION
    ])
  });

  const PHASE_SET = new Set(Object.values(TRANSACTION_PHASES));
  const EVENT_SET = new Set(Object.values(REVISION_EVENTS));

  function normalizePhase(value) {
    const phase = String(value || "").trim().toUpperCase();
    return PHASE_SET.has(phase) ? phase : "";
  }

  function normalizeTargetType(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeRevisionEvent(value) {
    const event = String(value || "").trim().toUpperCase();
    return EVENT_SET.has(event) ? event : "";
  }

  function validateRevision(value) {
    return Number.isFinite(value) && Number.isInteger(value) && value >= 0;
  }

  function canTransition(fromPhase, toPhase) {
    const from = normalizePhase(fromPhase);
    const to = normalizePhase(toPhase);
    return Boolean(
      from &&
      to &&
      TRANSITIONS[from] &&
      TRANSITIONS[from].includes(to)
    );
  }

  function targetTypePermitted(targetType) {
    return normalizeTargetType(targetType) !== TARGET_TYPES.HOME_COMPASS;
  }

  function revisionAdvances({
    previousPhase,
    requestedPhase,
    revisionEvent
  } = {}) {
    const previous = normalizePhase(previousPhase);
    const requested = normalizePhase(requestedPhase);
    const event = normalizeRevisionEvent(revisionEvent);

    if (!previous || !requested || !event) {
      return false;
    }

    if (!REVISION_ADVANCING_EVENTS.has(event)) {
      return false;
    }

    if (previous === requested) {
      return false;
    }

    return true;
  }

  function createReceipt({
    previousPhase,
    requestedPhase,
    resultingPhase,
    structuralState = "",
    transactionRevision,
    targetType = "",
    targetId = "",
    revisionEvent = REVISION_EVENTS.ORDINARY_UPDATE,
    revisionAdvanced = false,
    accepted = false,
    rejectionReason = "",
    routeCommitAuthorized = false,
    timestamp = Date.now()
  } = {}) {
    if (!validateRevision(transactionRevision)) {
      throw new TypeError("ARCHCOIN_TRANSACTION_RECEIPT_REVISION_INVALID");
    }

    const previous = normalizePhase(previousPhase);
    const requested = normalizePhase(requestedPhase);
    const resulting = normalizePhase(resultingPhase);
    const normalizedTargetType = normalizeTargetType(targetType);
    const normalizedRevisionEvent = normalizeRevisionEvent(revisionEvent);

    return Object.freeze({
      receiptSchema: "ARCHCOIN_TRANSACTION_PHASE_TRANSITION_RECEIPT_v2",
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      targetControllerId: MODULE.targetControllerId,
      previousPhase: previous,
      requestedPhase: requested,
      resultingPhase: resulting,
      structuralState: String(structuralState || ""),
      transactionRevision,
      targetType: normalizedTargetType,
      targetId: String(targetId || ""),
      revisionEvent: normalizedRevisionEvent,
      revisionAdvanced: Boolean(revisionAdvanced),
      accepted: Boolean(accepted),
      rejectionReason: String(rejectionReason || ""),
      routeCommitAuthorized: Boolean(routeCommitAuthorized),
      homeCompassStateUnaffected:
        normalizedTargetType !== TARGET_TYPES.HOME_COMPASS,
      timestamp: Number.isFinite(Number(timestamp))
        ? Number(timestamp)
        : Date.now()
    });
  }

  function rejectedReceipt({
    currentPhase,
    requestedPhase,
    structuralState,
    currentRevision,
    targetType,
    targetId,
    revisionEvent,
    rejectionReason
  }) {
    return createReceipt({
      previousPhase: currentPhase,
      requestedPhase,
      resultingPhase: currentPhase,
      structuralState,
      transactionRevision: currentRevision,
      targetType,
      targetId,
      revisionEvent,
      revisionAdvanced: false,
      accepted: false,
      rejectionReason,
      routeCommitAuthorized: false
    });
  }

  function evaluateTransition({
    currentPhase,
    requestedPhase,
    structuralState = "",
    currentRevision,
    expectedRevision,
    targetType = "",
    targetId = "",
    revisionEvent = REVISION_EVENTS.ORDINARY_UPDATE
  } = {}) {
    const current = normalizePhase(currentPhase);
    const requested = normalizePhase(requestedPhase);
    const event = normalizeRevisionEvent(revisionEvent);
    const normalizedTargetType = normalizeTargetType(targetType);

    if (!validateRevision(currentRevision)) {
      return Object.freeze({
        accepted: false,
        rejectionReason: "ARCHCOIN_TRANSACTION_CURRENT_REVISION_INVALID",
        currentPhase: current || String(currentPhase || ""),
        requestedPhase: requested || String(requestedPhase || ""),
        transactionRevision: currentRevision
      });
    }

    if (!validateRevision(expectedRevision)) {
      return rejectedReceipt({
        currentPhase: current || TRANSACTION_PHASES.CANCELLED,
        requestedPhase,
        structuralState,
        currentRevision,
        targetType,
        targetId,
        revisionEvent: event,
        rejectionReason: "ARCHCOIN_TRANSACTION_EXPECTED_REVISION_INVALID"
      });
    }

    if (expectedRevision !== currentRevision) {
      return rejectedReceipt({
        currentPhase: current || TRANSACTION_PHASES.CANCELLED,
        requestedPhase,
        structuralState,
        currentRevision,
        targetType,
        targetId,
        revisionEvent: event,
        rejectionReason: "ARCHCOIN_TRANSACTION_REVISION_MISMATCH"
      });
    }

    if (!current) {
      return rejectedReceipt({
        currentPhase: TRANSACTION_PHASES.CANCELLED,
        requestedPhase,
        structuralState,
        currentRevision,
        targetType,
        targetId,
        revisionEvent: event,
        rejectionReason: "ARCHCOIN_TRANSACTION_CURRENT_PHASE_INVALID"
      });
    }

    if (!requested) {
      return rejectedReceipt({
        currentPhase: current,
        requestedPhase,
        structuralState,
        currentRevision,
        targetType,
        targetId,
        revisionEvent: event,
        rejectionReason: "ARCHCOIN_TRANSACTION_REQUESTED_PHASE_INVALID"
      });
    }

    if (!event) {
      return rejectedReceipt({
        currentPhase: current,
        requestedPhase: requested,
        structuralState,
        currentRevision,
        targetType,
        targetId,
        revisionEvent,
        rejectionReason: "ARCHCOIN_TRANSACTION_REVISION_EVENT_INVALID"
      });
    }

    if (!targetTypePermitted(normalizedTargetType)) {
      return rejectedReceipt({
        currentPhase: current,
        requestedPhase: requested,
        structuralState,
        currentRevision,
        targetType: normalizedTargetType,
        targetId,
        revisionEvent: event,
        rejectionReason: "ARCHCOIN_HOME_COMPASS_TRANSACTION_PARTICIPATION_FORBIDDEN"
      });
    }

    if (!canTransition(current, requested)) {
      return rejectedReceipt({
        currentPhase: current,
        requestedPhase: requested,
        structuralState,
        currentRevision,
        targetType: normalizedTargetType,
        targetId,
        revisionEvent: event,
        rejectionReason: "ARCHCOIN_TRANSACTION_PHASE_TRANSITION_ILLEGAL"
      });
    }

    const advances = revisionAdvances({
      previousPhase: current,
      requestedPhase: requested,
      revisionEvent: event
    });

    const acceptedRevision = advances
      ? currentRevision + 1
      : currentRevision;

    return createReceipt({
      previousPhase: current,
      requestedPhase: requested,
      resultingPhase: requested,
      structuralState,
      transactionRevision: acceptedRevision,
      targetType: normalizedTargetType,
      targetId,
      revisionEvent: event,
      revisionAdvanced: advances,
      accepted: true,
      rejectionReason: "",
      routeCommitAuthorized:
        requested === TRANSACTION_PHASES.ROUTE_COMMIT
    });
  }

  function runSelfTest() {
    const phases = Object.values(TRANSACTION_PHASES);
    const failures = [];

    if (phases.length !== 8) {
      failures.push("ARCHCOIN_TRANSACTION_PHASE_COUNT_INVALID");
    }

    if (new Set(phases).size !== 8) {
      failures.push("ARCHCOIN_TRANSACTION_PHASE_DUPLICATE");
    }

    const requiredPath = [
      TRANSACTION_PHASES.ORIENTATION,
      TRANSACTION_PHASES.ALLOCATION,
      TRANSACTION_PHASES.SELECTION,
      TRANSACTION_PHASES.PREVIEW,
      TRANSACTION_PHASES.CONFIRMATION,
      TRANSACTION_PHASES.SETTLEMENT,
      TRANSACTION_PHASES.ROUTE_COMMIT
    ];

    for (let index = 0; index < requiredPath.length - 1; index += 1) {
      if (!canTransition(requiredPath[index], requiredPath[index + 1])) {
        failures.push(
          `ARCHCOIN_TRANSACTION_REQUIRED_TRANSITION_MISSING:${requiredPath[index]}:${requiredPath[index + 1]}`
        );
      }
    }

    const forbiddenDirectCommit = [
      TRANSACTION_PHASES.ORIENTATION,
      TRANSACTION_PHASES.ALLOCATION,
      TRANSACTION_PHASES.SELECTION,
      TRANSACTION_PHASES.PREVIEW,
      TRANSACTION_PHASES.CANCELLED
    ];

    for (const phase of forbiddenDirectCommit) {
      if (canTransition(phase, TRANSACTION_PHASES.ROUTE_COMMIT)) {
        failures.push(
          `ARCHCOIN_TRANSACTION_DIRECT_ROUTE_COMMIT_FORBIDDEN:${phase}`
        );
      }
    }

    const routeCommitTransitions =
      TRANSITIONS[TRANSACTION_PHASES.ROUTE_COMMIT];

    if (
      routeCommitTransitions.length !== 1 ||
      routeCommitTransitions[0] !== TRANSACTION_PHASES.ROUTE_COMMIT
    ) {
      failures.push("ARCHCOIN_TRANSACTION_ROUTE_COMMIT_NOT_TERMINAL");
    }

    const accepted = evaluateTransition({
      currentPhase: TRANSACTION_PHASES.PREVIEW,
      requestedPhase: TRANSACTION_PHASES.CONFIRMATION,
      structuralState: "ROOM_SELECTED",
      currentRevision: 4,
      expectedRevision: 4,
      targetType: TARGET_TYPES.ROOM,
      targetId: "contract-overview",
      revisionEvent: REVISION_EVENTS.CONFIRMATION_ACCEPTED
    });

    if (
      !accepted.accepted ||
      accepted.resultingPhase !== TRANSACTION_PHASES.CONFIRMATION ||
      accepted.transactionRevision !== 5 ||
      accepted.revisionAdvanced !== true
    ) {
      failures.push("ARCHCOIN_TRANSACTION_ACCEPTED_RECEIPT_INVALID");
    }

    const rejected = evaluateTransition({
      currentPhase: TRANSACTION_PHASES.PREVIEW,
      requestedPhase: TRANSACTION_PHASES.ROUTE_COMMIT,
      structuralState: "ROOM_SELECTED",
      currentRevision: 4,
      expectedRevision: 4,
      targetType: TARGET_TYPES.ROOM,
      targetId: "contract-overview",
      revisionEvent: REVISION_EVENTS.ROUTE_COMMIT
    });

    if (
      rejected.accepted ||
      rejected.resultingPhase !== TRANSACTION_PHASES.PREVIEW ||
      !rejected.rejectionReason
    ) {
      failures.push("ARCHCOIN_TRANSACTION_REJECTED_RECEIPT_INVALID");
    }

    const malformedRevisionCases = ["4", 4.8, -2, "bad", NaN];

    for (const revision of malformedRevisionCases) {
      const result = evaluateTransition({
        currentPhase: TRANSACTION_PHASES.PREVIEW,
        requestedPhase: TRANSACTION_PHASES.CONFIRMATION,
        structuralState: "ROOM_SELECTED",
        currentRevision: revision,
        expectedRevision: revision,
        targetType: TARGET_TYPES.ROOM,
        targetId: "contract-overview",
        revisionEvent: REVISION_EVENTS.CONFIRMATION_ACCEPTED
      });

      if (result.accepted !== false) {
        failures.push(
          `ARCHCOIN_TRANSACTION_MALFORMED_REVISION_ACCEPTED:${String(revision)}`
        );
      }
    }

    const staleRevision = evaluateTransition({
      currentPhase: TRANSACTION_PHASES.PREVIEW,
      requestedPhase: TRANSACTION_PHASES.CONFIRMATION,
      structuralState: "ROOM_SELECTED",
      currentRevision: 7,
      expectedRevision: 6,
      targetType: TARGET_TYPES.ROOM,
      targetId: "contract-overview",
      revisionEvent: REVISION_EVENTS.CONFIRMATION_ACCEPTED
    });

    if (
      staleRevision.accepted !== false ||
      staleRevision.rejectionReason !==
        "ARCHCOIN_TRANSACTION_REVISION_MISMATCH"
    ) {
      failures.push("ARCHCOIN_TRANSACTION_STALE_REVISION_ACCEPTED");
    }

    const homeCompassPhases = [
      TRANSACTION_PHASES.ALLOCATION,
      TRANSACTION_PHASES.SELECTION,
      TRANSACTION_PHASES.PREVIEW,
      TRANSACTION_PHASES.CONFIRMATION,
      TRANSACTION_PHASES.SETTLEMENT,
      TRANSACTION_PHASES.ROUTE_COMMIT
    ];

    for (const requestedPhase of homeCompassPhases) {
      const result = evaluateTransition({
        currentPhase:
          requestedPhase === TRANSACTION_PHASES.ALLOCATION
            ? TRANSACTION_PHASES.ORIENTATION
            : TRANSACTION_PHASES.PREVIEW,
        requestedPhase,
        structuralState: "CONSTELLATION",
        currentRevision: 2,
        expectedRevision: 2,
        targetType: TARGET_TYPES.HOME_COMPASS,
        targetId: "home-compass",
        revisionEvent: REVISION_EVENTS.NEW_TRANSACTION
      });

      if (
        result.accepted !== false ||
        result.rejectionReason !==
          "ARCHCOIN_HOME_COMPASS_TRANSACTION_PARTICIPATION_FORBIDDEN"
      ) {
        failures.push(
          `ARCHCOIN_HOME_COMPASS_TRANSACTION_EXCLUSION_FAILED:${requestedPhase}`
        );
      }
    }

    const idempotentUpdate = evaluateTransition({
      currentPhase: TRANSACTION_PHASES.ALLOCATION,
      requestedPhase: TRANSACTION_PHASES.ALLOCATION,
      structuralState: "CONSTELLATION",
      currentRevision: 9,
      expectedRevision: 9,
      targetType: TARGET_TYPES.CARDINAL,
      targetId: "north",
      revisionEvent: REVISION_EVENTS.ORDINARY_UPDATE
    });

    if (
      !idempotentUpdate.accepted ||
      idempotentUpdate.transactionRevision !== 9 ||
      idempotentUpdate.revisionAdvanced !== false
    ) {
      failures.push("ARCHCOIN_TRANSACTION_SELF_UPDATE_REVISION_POLICY_INVALID");
    }

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_TRANSACTIONAL_STATE_CHECKPOINT_VALIDATION_RECEIPT_v2",
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      targetControllerId: MODULE.targetControllerId,
      targetContractId: MODULE.targetContractId,
      pass: failures.length === 0,
      phaseCount: phases.length,
      phases: Object.freeze(phases.slice()),
      routeCommitTerminal: true,
      directRouteCommitForbidden: true,
      homeCompassExecutableExclusion: true,
      revisionInputStrict: true,
      revisionMatchRequired: true,
      selfTransitionRevisionPolicyFrozen: true,
      runtimeImported: false,
      visibleBehaviorChanged: false,
      routeBehaviorChanged: false,
      failures: Object.freeze(failures)
    });
  }

  const validationReceipt = runSelfTest();

  globalThis.DGB_ARCHCOIN_TRANSACTIONAL_STATE_CHECKPOINT =
    Object.freeze({
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      targetControllerId: MODULE.targetControllerId,
      targetContractId: MODULE.targetContractId,
      transactionPhases: TRANSACTION_PHASES,
      targetTypes: TARGET_TYPES,
      revisionEvents: REVISION_EVENTS,
      transitions: TRANSITIONS,
      normalizePhase,
      normalizeTargetType,
      normalizeRevisionEvent,
      validateRevision,
      canTransition,
      targetTypePermitted,
      revisionAdvances,
      createReceipt,
      evaluateTransition,
      runSelfTest,
      validationReceipt
    });
})();

/*
ARCHCOIN_TRANSACTIONAL_STATE_CHECKPOINT_RESULT_v2

RUNTIME_IMPORT_ADDED = FALSE
CONTROLLER_MODIFIED = FALSE
INTERACTIONS_MODIFIED = FALSE
CRYSTALS_MODIFIED = FALSE
COMPOSITOR_MODIFIED = FALSE
HTML_MODIFIED = FALSE
CSS_MODIFIED = FALSE
HOME_COMPASS_MODIFIED = FALSE
ROUTE_BEHAVIOR_CHANGED = FALSE
VISIBLE_BEHAVIOR_CHANGED = FALSE

HARDENED RULES:
- Home Compass cannot participate in transactional phases.
- Transaction revisions must be finite, integer, nonnegative, and current.
- Receipt construction does not repair invalid authority input.
- Ordinary same-phase updates do not advance the transaction revision.
- Governed phase admissions advance revision only through declared events.

The scaffold may be reviewed and tested independently. It must not be treated
as production transactional authority until its accepted portions are
integrated into DGB_ARCHCOIN_CONTROLLER under a preservation-grade controller
change and the scaffold is then removed or formally superseded.
*/