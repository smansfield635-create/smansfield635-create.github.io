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
    version: "1.0.0-preservation-scaffold",
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

  const PHASE_SET = new Set(
    Object.values(TRANSACTION_PHASES)
  );

  function normalizePhase(value) {
    const phase = String(value || "")
      .trim()
      .toUpperCase();

    return PHASE_SET.has(phase)
      ? phase
      : "";
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

  function createReceipt({
    previousPhase,
    requestedPhase,
    resultingPhase,
    structuralState = "",
    transactionRevision = 0,
    targetType = "",
    targetId = "",
    accepted = false,
    rejectionReason = "",
    routeCommitAuthorized = false,
    timestamp = Date.now()
  } = {}) {
    const previous = normalizePhase(previousPhase);
    const requested = normalizePhase(requestedPhase);
    const resulting = normalizePhase(resultingPhase);

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_TRANSACTION_PHASE_TRANSITION_RECEIPT_v1",

      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      targetControllerId: MODULE.targetControllerId,
      previousPhase: previous,
      requestedPhase: requested,
      resultingPhase: resulting,
      structuralState: String(structuralState || ""),
      transactionRevision: Math.max(
        0,
        Number.isFinite(Number(transactionRevision))
          ? Math.trunc(Number(transactionRevision))
          : 0
      ),
      targetType: String(targetType || ""),
      targetId: String(targetId || ""),
      accepted: Boolean(accepted),
      rejectionReason: String(rejectionReason || ""),
      routeCommitAuthorized:
        Boolean(routeCommitAuthorized),
      homeCompassStateUnaffected: true,
      timestamp: Number.isFinite(Number(timestamp))
        ? Number(timestamp)
        : Date.now()
    });
  }

  function evaluateTransition({
    currentPhase,
    requestedPhase,
    structuralState = "",
    transactionRevision = 0,
    targetType = "",
    targetId = ""
  } = {}) {
    const current = normalizePhase(currentPhase);
    const requested = normalizePhase(requestedPhase);

    if (!current) {
      return createReceipt({
        previousPhase: currentPhase,
        requestedPhase,
        resultingPhase:
          TRANSACTION_PHASES.CANCELLED,
        structuralState,
        transactionRevision,
        targetType,
        targetId,
        accepted: false,
        rejectionReason:
          "ARCHCOIN_TRANSACTION_CURRENT_PHASE_INVALID"
      });
    }

    if (!requested) {
      return createReceipt({
        previousPhase: current,
        requestedPhase,
        resultingPhase: current,
        structuralState,
        transactionRevision,
        targetType,
        targetId,
        accepted: false,
        rejectionReason:
          "ARCHCOIN_TRANSACTION_REQUESTED_PHASE_INVALID"
      });
    }

    if (!canTransition(current, requested)) {
      return createReceipt({
        previousPhase: current,
        requestedPhase: requested,
        resultingPhase: current,
        structuralState,
        transactionRevision,
        targetType,
        targetId,
        accepted: false,
        rejectionReason:
          "ARCHCOIN_TRANSACTION_PHASE_TRANSITION_ILLEGAL"
      });
    }

    return createReceipt({
      previousPhase: current,
      requestedPhase: requested,
      resultingPhase: requested,
      structuralState,
      transactionRevision:
        Number(transactionRevision) + 1,
      targetType,
      targetId,
      accepted: true,
      rejectionReason: "",
      routeCommitAuthorized:
        requested ===
        TRANSACTION_PHASES.ROUTE_COMMIT
    });
  }

  function runSelfTest() {
    const phases = Object.values(
      TRANSACTION_PHASES
    );

    const failures = [];

    if (phases.length !== 8) {
      failures.push(
        "ARCHCOIN_TRANSACTION_PHASE_COUNT_INVALID"
      );
    }

    if (new Set(phases).size !== 8) {
      failures.push(
        "ARCHCOIN_TRANSACTION_PHASE_DUPLICATE"
      );
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

    for (
      let index = 0;
      index < requiredPath.length - 1;
      index += 1
    ) {
      if (
        !canTransition(
          requiredPath[index],
          requiredPath[index + 1]
        )
      ) {
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
      if (
        canTransition(
          phase,
          TRANSACTION_PHASES.ROUTE_COMMIT
        )
      ) {
        failures.push(
          `ARCHCOIN_TRANSACTION_DIRECT_ROUTE_COMMIT_FORBIDDEN:${phase}`
        );
      }
    }

    const routeCommitTransitions =
      TRANSITIONS[
        TRANSACTION_PHASES.ROUTE_COMMIT
      ];

    if (
      routeCommitTransitions.length !== 1 ||
      routeCommitTransitions[0] !==
        TRANSACTION_PHASES.ROUTE_COMMIT
    ) {
      failures.push(
        "ARCHCOIN_TRANSACTION_ROUTE_COMMIT_NOT_TERMINAL"
      );
    }

    const accepted = evaluateTransition({
      currentPhase:
        TRANSACTION_PHASES.PREVIEW,
      requestedPhase:
        TRANSACTION_PHASES.CONFIRMATION,
      structuralState: "ROOM_SELECTED",
      transactionRevision: 4,
      targetType: "room",
      targetId: "contract-overview"
    });

    if (
      !accepted.accepted ||
      accepted.resultingPhase !==
        TRANSACTION_PHASES.CONFIRMATION ||
      accepted.transactionRevision !== 5
    ) {
      failures.push(
        "ARCHCOIN_TRANSACTION_ACCEPTED_RECEIPT_INVALID"
      );
    }

    const rejected = evaluateTransition({
      currentPhase:
        TRANSACTION_PHASES.PREVIEW,
      requestedPhase:
        TRANSACTION_PHASES.ROUTE_COMMIT,
      structuralState: "ROOM_SELECTED",
      transactionRevision: 4,
      targetType: "room",
      targetId: "contract-overview"
    });

    if (
      rejected.accepted ||
      rejected.resultingPhase !==
        TRANSACTION_PHASES.PREVIEW ||
      !rejected.rejectionReason
    ) {
      failures.push(
        "ARCHCOIN_TRANSACTION_REJECTED_RECEIPT_INVALID"
      );
    }

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_TRANSACTIONAL_STATE_CHECKPOINT_VALIDATION_RECEIPT_v1",
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      targetControllerId: MODULE.targetControllerId,
      targetContractId: MODULE.targetContractId,
      pass: failures.length === 0,
      phaseCount: phases.length,
      phases: Object.freeze(phases.slice()),
      routeCommitTerminal: true,
      directRouteCommitForbidden: true,
      homeCompassStateUnaffected: true,
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
      targetControllerId:
        MODULE.targetControllerId,
      targetContractId:
        MODULE.targetContractId,
      transactionPhases:
        TRANSACTION_PHASES,
      transitions: TRANSITIONS,
      normalizePhase,
      canTransition,
      createReceipt,
      evaluateTransition,
      runSelfTest,
      validationReceipt
    });
})();

/*
ARCHCOIN_TRANSACTIONAL_STATE_CHECKPOINT_RESULT_v1

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

The scaffold may be reviewed and tested independently. It must not be treated
as production transactional authority until its accepted portions are
integrated into DGB_ARCHCOIN_CONTROLLER under a preservation-grade controller
change and the scaffold is then removed or formally superseded.
*/
