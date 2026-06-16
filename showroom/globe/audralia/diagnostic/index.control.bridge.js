// /showroom/globe/audralia/diagnostic/index.control.bridge.js
// AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v9
// Full-file replacement.
//
// PREVIOUS CONTRACT:
// - AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v8
//
// PURPOSE:
// - Install explicitly declared compatibility aliases synchronously.
// - Publish the bridge API before downstream authorities are complete.
// - Remain relationally PENDING until verification is explicitly requested.
// - Inspect the completed control-family relationship without executing receipts
//   automatically during incomplete downstream construction.
// - Preserve installation mutation history without misclassifying it as
//   verification-time mutation.
// - Roll back an entire node transaction when any planned mutation fails.
// - Classify a successfully rolled-back transaction as unresolved, not complete.
//
// CANONICAL FAULT CORRECTIONS:
//
// REVEALED / STACKED:
// - Successful rollback no longer permits false alias READY.
// - Rolled-back transactions are explicitly HELD as unresolved.
//
// NEW:
// - Installation mutation history is separated from current-run mutation metrics.
// - Relational verification cannot inherit or report installation mutations as
//   verify-mode mutations.
//
// FILE-FAMILY POSITION:
// 1. index.control.bridge.js
// 2. index.inspection.lane.js
// 3. index.js
// 4. index.controls.js
// 5. index.html
// 6. index.css
//
// CONSTRUCTION LAW:
// - Initial loading performs alias installation only.
// - No automatic family receipt execution.
// - No missing downstream receipt is classified as failure during construction.
// - Relational verification is explicit and repeatable.
// - Verify operations are nonmutating.
// - No controls, inspection, interpreter, HTML structure, or CSS mutation.
//
// BRIDGE OWNS:
// - control-family alias translation;
// - transactional alias mutation and rollback;
// - canonical-ID correspondence;
// - duplicate-ID inspection;
// - controls-requirement correspondence;
// - controls-API reference correspondence;
// - family contract correspondence;
// - required-target correspondence;
// - station-map correspondence;
// - script-order correspondence;
// - bounded family-synchronization certification;
// - bridge lifecycle, state, API, and verification receipt.
//
// BRIDGE DOES NOT OWN:
// - controls state;
// - inspection-lane state;
// - interpreter state;
// - exact-nine truth;
// - station-execution truth;
// - report construction;
// - direct execution;
// - Nine-Cycle execution;
// - DOM events;
// - clipboard;
// - HTML structural creation;
// - script-order mutation;
// - CSS mutation;
// - production repair.
//
// NO NEW FILES.
// NO PATCHES.
// NO EVENTS.
// NO TIMERS.
// NO PROMISES.
// NO OBSERVERS.
// NO POLLING.
// NO AUTOMATIC DOWNSTREAM VERIFICATION.

(function installAudraliaRelationalControlBridge(global) {
  "use strict";

  var root =
    global ||
    (
      typeof window !== "undefined"
        ? window
        : typeof globalThis !== "undefined"
          ? globalThis
          : this
    );

  var doc =
    root && root.document
      ? root.document
      : null;

  if (!doc) {
    return;
  }

  var CONTRACT =
    "AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v9";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v8";

  var VERSION =
    "9.0.0";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.control.bridge.js";

  var STATE_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_BRIDGE_STATE_v2";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_BRIDGE_RECEIPT_v5";

  var SCOPE =
    "AUDRALIA_DIAGNOSTIC_CONTROL_FAMILY";

  var GLOBAL_API =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE";

  var GLOBAL_STATE =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE_STATE";

  var GLOBAL_RECEIPT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE_RECEIPT";

  var CONTROLS_REQUIREMENTS_GLOBAL =
    "AUDRALIA_DIAGNOSTIC_CONTROLS_REQUIREMENTS";

  var CONTROLS_API_PATHS =
    Object.freeze([
      "AUDRALIA_DROP_WITH_READ_CONTROL_PANEL",
      "AUDRALIA.dropWithReadControlPanel"
    ]);

  var CONTROLS_RECEIPT_PATHS =
    Object.freeze([
      "AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT"
    ]);

  var INSPECTION_API_PATHS =
    Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE",
      "AUDRALIA.diagnosticInspectionLane"
    ]);

  var INSPECTION_RECEIPT_PATHS =
    Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT"
    ]);

  var INTERPRETER_API_PATHS =
    Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE",
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY",
      "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
      "AUDRALIA.diagnosticEngine",
      "AUDRALIA.dropWithReadDiagnosticObservatory",
      "AUDRALIA.diagnosticRouteController"
    ]);

  var REQUIRED_RUNTIME_ORDER =
    Object.freeze([
      "index.control.bridge.js",
      "index.inspection.lane.js",
      "index.js",
      "index.controls.js"
    ]);

  var DOCUMENT_READY_ATTRIBUTE =
    "data-control-bridge-ready";

  var DOCUMENT_STATUS_ATTRIBUTE =
    "data-control-bridge-status";

  var DOCUMENT_PHASE_ATTRIBUTE =
    "data-control-bridge-phase";

  var DOCUMENT_SCOPE_ATTRIBUTE =
    "data-control-bridge-scope";

  var PHASE =
    Object.freeze({
      INSTALLING:
        "INSTALLING",

      RELATIONAL_PENDING:
        "RELATIONAL_PENDING",

      RELATIONAL_VERIFYING:
        "RELATIONAL_VERIFYING",

      RELATIONAL_COMPLETE:
        "RELATIONAL_COMPLETE",

      ERROR:
        "ERROR"
    });

  var STATUS =
    Object.freeze({
      READY:
        "READY",

      HELD:
        "HELD",

      ERROR:
        "ERROR",

      PENDING:
        "PENDING",

      UNAVAILABLE:
        "UNAVAILABLE"
    });

  var MODE =
    Object.freeze({
      INSTALL:
        "INSTALL",

      VERIFY:
        "VERIFY"
    });

  var VALID_REPORT_COMMANDS =
    Object.freeze([
      "create",
      "view",
      "copy-readable",
      "copy-packet",
      "copy-raw",
      "open-receipts",
      "open-archive",
      "reset"
    ]);

  var VALID_RECEIPT_FILTERS =
    Object.freeze([
      "all",
      "participant",
      "observation",
      "cycle",
      "error"
    ]);

  var INELIGIBLE_PARTICIPANT_TAGS =
    Object.freeze([
      "SCRIPT",
      "STYLE",
      "LINK",
      "META",
      "TEMPLATE",
      "HEAD",
      "TITLE",
      "BASE",
      "NOSCRIPT",
      "SOURCE",
      "TRACK",
      "PARAM"
    ]);

  var COMMAND_ATTRIBUTE_MAP =
    Object.freeze([
      Object.freeze({
        source:
          "data-control-command",
        target:
          "data-report-command"
      }),

      Object.freeze({
        source:
          "data-control-category",
        target:
          "data-report-category"
      }),

      Object.freeze({
        source:
          "data-control-audit",
        target:
          "data-report-audit"
      }),

      Object.freeze({
        source:
          "data-control-participant",
        target:
          "data-report-participant"
      }),

      Object.freeze({
        source:
          "data-control-chamber",
        target:
          "data-report-chamber"
      }),

      Object.freeze({
        source:
          "data-control-mode",
        target:
          "data-report-mode"
      }),

      Object.freeze({
        source:
          "data-control-source",
        target:
          "data-report-source"
      }),

      Object.freeze({
        source:
          "data-control-view-after-create",
        target:
          "data-report-view-after-create"
      })
    ]);

  var VIEW_ATTRIBUTE_MAP =
    Object.freeze([
      Object.freeze({
        source:
          "data-control-bridge-left-orbit",
        target:
          "data-left-orbit-view",
        family:
          "views"
      }),

      Object.freeze({
        source:
          "data-control-bridge-report-mode",
        target:
          "data-report-mode",
        family:
          "views"
      }),

      Object.freeze({
        source:
          "data-control-bridge-observation-lens",
        target:
          "data-observation-lens",
        family:
          "views"
      }),

      Object.freeze({
        source:
          "data-control-bridge-chamber",
        target:
          "data-instrument-chamber",
        family:
          "chambers"
      })
    ]);

  var runSequence = 0;

  var currentState =
    createState(
      MODE.INSTALL,
      0
    );

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function isObjectLike(value) {
    return Boolean(
      value !== null &&
      value !== undefined &&
      (
        typeof value === "object" ||
        typeof value === "function"
      )
    );
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function cloneValue(value, seen) {
    var visited =
      seen || [];

    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "bigint") {
      return String(value);
    }

    if (typeof value === "function") {
      return {
        type:
          "Function",

        name:
          value.name || "anonymous"
      };
    }

    if (visited.indexOf(value) !== -1) {
      return "[Circular]";
    }

    var nextSeen =
      visited.concat([value]);

    if (Array.isArray(value)) {
      return value.map(function cloneEntry(entry) {
        return cloneValue(
          entry,
          nextSeen
        );
      });
    }

    var output = {};

    try {
      Object.keys(value)
        .forEach(function cloneProperty(key) {
          try {
            output[key] =
              cloneValue(
                value[key],
                nextSeen
              );
          } catch (error) {
            output[key] = {
              unreadable:
                true,

              message:
                error && error.message
                  ? error.message
                  : String(error)
            };
          }
        });
    } catch (_error) {
      return {
        unreadable:
          true
      };
    }

    return output;
  }

  function freezeDeep(value, seen) {
    var visited =
      seen || [];

    if (!isObjectLike(value)) {
      return value;
    }

    if (visited.indexOf(value) !== -1) {
      return value;
    }

    var nextSeen =
      visited.concat([value]);

    try {
      Object.keys(value)
        .forEach(function freezeProperty(key) {
          freezeDeep(
            value[key],
            nextSeen
          );
        });

      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function immutableSnapshot(value) {
    return freezeDeep(
      cloneValue(value)
    );
  }

  function createAliasMetrics() {
    return {
      declaredNodeCount:
        0,

      declaredAttributeCount:
        0,

      validatedNodeCount:
        0,

      alreadyCorrespondingNodeCount:
        0,

      mutatedNodeCount:
        0,

      heldNodeCount:
        0,

      invalidNodeCount:
        0,

      conflictingNodeCount:
        0,

      blockedMutationCount:
        0,

      mutationAttemptCount:
        0,

      mutationCommitCount:
        0,

      rolledBackNodeCount:
        0,

      unresolvedTransactionCount:
        0,

      transactionFailureCount:
        0,

      mutationRollbackCount:
        0,

      mutationRollbackFailureCount:
        0,

      partialMutationCount:
        0
    };
  }

  function createMutationHistory() {
    return {
      authorizedMutationCount:
        0,

      completedMutationCount:
        0,

      blockedMutationCount:
        0,

      mutationAttemptCount:
        0,

      mutationCommitCount:
        0,

      rolledBackTransactionCount:
        0,

      unresolvedTransactionCount:
        0,

      transactionFailureCount:
        0,

      mutationRollbackCount:
        0,

      mutationRollbackFailureCount:
        0,

      unauthorizedMutationCount:
        0,

      partialMutationCount:
        0,

      status:
        STATUS.PENDING
    };
  }

  function createRunMutationMetrics() {
    return {
      mutationAttemptCount:
        0,

      completedMutationCount:
        0,

      mutationRollbackCount:
        0,

      mutationRollbackFailureCount:
        0,

      partialMutationCount:
        0,

      unauthorizedMutationCount:
        0,

      status:
        STATUS.PENDING
    };
  }

  function createCorrespondenceState(reason) {
    return {
      status:
        STATUS.PENDING,

      complete:
        false,

      reason:
        reason ||
        "RELATIONAL_VERIFICATION_NOT_RUN",

      evidence:
        null
    };
  }

  function createState(mode, sequence) {
    return {
      schema:
        STATE_SCHEMA,

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      scope:
        SCOPE,

      mode:
        mode,

      sequence:
        sequence,

      phase:
        PHASE.INSTALLING,

      installationStatus:
        STATUS.PENDING,

      aliasTranslationStatus:
        STATUS.PENDING,

      relationalStatus:
        STATUS.PENDING,

      familySynchronizationStatus:
        STATUS.PENDING,

      overallStatus:
        STATUS.PENDING,

      relationalVerificationRun:
        false,

      relationalVerificationCount:
        0,

      aliases: {
        ids:
          createAliasMetrics(),

        commands:
          createAliasMetrics(),

        participants:
          createAliasMetrics(),

        receiptFilters:
          createAliasMetrics(),

        views:
          createAliasMetrics(),

        chambers:
          createAliasMetrics()
      },

      installationMutationHistory:
        createMutationHistory(),

      currentRunMutationMetrics:
        createRunMutationMetrics(),

      controlsRequirements:
        createCorrespondenceState(),

      controlsApi:
        createCorrespondenceState(),

      aliasReferences:
        createCorrespondenceState(),

      contracts:
        createCorrespondenceState(),

      htmlTargets:
        createCorrespondenceState(),

      stationMap:
        createCorrespondenceState(),

      runtimeOrder:
        createCorrespondenceState(),

      inspectionEvidence:
        createCorrespondenceState(),

      controlsLocalEvidence:
        createCorrespondenceState(),

      familySynchronization:
        createCorrespondenceState(),

      mandatoryCategories:
        [],

      passedMandatoryCategories:
        [],

      heldMandatoryCategories:
        [],

      unavailableMandatoryCategories:
        [],

      failedMandatoryCategories:
        [],

      conflicts:
        [],

      errors:
        [],

      observations:
        [],

      startedAt:
        null,

      installationCompletedAt:
        null,

      relationalVerifiedAt:
        null,

      completedAt:
        null
    };
  }

  function describeNode(node) {
    if (!node) {
      return null;
    }

    return {
      tag:
        node.tagName || null,

      id:
        node.id || null,

      hidden:
        Boolean(node.hidden),

      ariaHidden:
        node.getAttribute &&
        node.getAttribute(
          "aria-hidden"
        ),

      controlBridgeId:
        node.getAttribute &&
        node.getAttribute(
          "data-control-bridge-id"
        ),

      participantAlias:
        node.getAttribute &&
        node.getAttribute(
          "data-control-bridge-participant"
        ),

      receiptFilterAlias:
        node.getAttribute &&
        node.getAttribute(
          "data-control-bridge-receipt-filter"
        )
    };
  }

  function trimmedAttribute(
    node,
    attribute
  ) {
    return String(
      node.getAttribute(attribute) || ""
    ).trim();
  }

  function normalizeToken(value) {
    return String(
      value === null ||
      value === undefined
        ? ""
        : value
    )
      .trim()
      .toUpperCase()
      .replace(
        /[\s\-]+/g,
        "_"
      );
  }

  function escapeAttributeValue(value) {
    return String(value)
      .replace(
        /\\/g,
        "\\\\"
      )
      .replace(
        /"/g,
        '\\"'
      );
  }

  function readPath(path) {
    var parts =
      String(path || "")
        .split(".")
        .filter(Boolean);

    var cursor =
      root;

    var index;

    for (
      index = 0;
      index < parts.length;
      index += 1
    ) {
      if (
        cursor === null ||
        cursor === undefined
      ) {
        return null;
      }

      try {
        cursor =
          cursor[parts[index]];
      } catch (_error) {
        return null;
      }
    }

    return cursor === undefined
      ? null
      : cursor;
  }

  function resolveFirst(paths) {
    var index;
    var value;

    for (
      index = 0;
      index < paths.length;
      index += 1
    ) {
      value =
        readPath(
          paths[index]
        );

      if (value) {
        return {
          path:
            paths[index],

          value:
            value
        };
      }
    }

    return null;
  }

  function readContract(value) {
    if (!value) {
      return null;
    }

    try {
      return (
        value.CONTRACT ||
        value.contract ||
        null
      );
    } catch (_error) {
      return null;
    }
  }

  function recordObservation(
    state,
    code,
    detail
  ) {
    state.observations.push({
      code:
        code,

      detail:
        cloneValue(
          detail || {}
        ),

      observedAt:
        nowIso()
    });
  }

  function recordConflict(
    state,
    family,
    code,
    node,
    detail
  ) {
    if (
      family &&
      state.aliases[family]
    ) {
      state.aliases[
        family
      ].conflictingNodeCount += 1;

      state.aliases[
        family
      ].heldNodeCount += 1;
    }

    state.conflicts.push({
      code:
        code,

      family:
        family || "relational",

      node:
        describeNode(node),

      detail:
        cloneValue(
          detail || {}
        ),

      resolution:
        "HELD_FOR_EXISTING_AUTHORITY_CORRECTION"
    });
  }

  function recordInvalid(
    state,
    family,
    code,
    node,
    detail
  ) {
    if (
      family &&
      state.aliases[family]
    ) {
      state.aliases[
        family
      ].invalidNodeCount += 1;

      state.aliases[
        family
      ].heldNodeCount += 1;
    }

    state.conflicts.push({
      code:
        code,

      family:
        family || "relational",

      node:
        describeNode(node),

      detail:
        cloneValue(
          detail || {}
        ),

      resolution:
        "HELD_FOR_EXISTING_DECLARATION_CORRECTION"
    });
  }

  function recordError(
    state,
    code,
    error,
    detail
  ) {
    state.errors.push({
      code:
        code,

      message:
        error && error.message
          ? error.message
          : String(error),

      stack:
        error && error.stack
          ? error.stack
          : null,

      detail:
        cloneValue(
          detail || {}
        ),

      occurredAt:
        nowIso()
    });
  }

  function createMutationPlan(
    family,
    node
  ) {
    return {
      family:
        family,

      node:
        node,

      valid:
        true,

      mutations:
        [],

      conflicts:
        [],

      invalid:
        []
    };
  }

  function addMutation(
    plan,
    type,
    name,
    value
  ) {
    plan.mutations.push({
      type:
        type,

      name:
        name,

      value:
        value
    });
  }

  function addPlanConflict(
    plan,
    code,
    detail
  ) {
    plan.valid =
      false;

    plan.conflicts.push({
      code:
        code,

      detail:
        cloneValue(
          detail || {}
        )
    });
  }

  function addPlanInvalid(
    plan,
    code,
    detail
  ) {
    plan.valid =
      false;

    plan.invalid.push({
      code:
        code,

      detail:
        cloneValue(
          detail || {}
        )
    });
  }

  function inspectAttributeAlias(
    state,
    plan,
    sourceAttribute,
    targetAttribute
  ) {
    var node =
      plan.node;

    if (
      !node.hasAttribute(
        sourceAttribute
      )
    ) {
      return;
    }

    state.aliases[
      plan.family
    ].declaredAttributeCount += 1;

    var sourceValue =
      trimmedAttribute(
        node,
        sourceAttribute
      );

    if (!sourceValue) {
      addPlanInvalid(
        plan,
        "EMPTY_ALIAS_VALUE",
        {
          sourceAttribute:
            sourceAttribute,

          targetAttribute:
            targetAttribute
        }
      );

      return;
    }

    if (
      !node.hasAttribute(
        targetAttribute
      )
    ) {
      addMutation(
        plan,
        "attribute",
        targetAttribute,
        sourceValue
      );

      return;
    }

    var targetValue =
      trimmedAttribute(
        node,
        targetAttribute
      );

    if (
      targetValue !==
      sourceValue
    ) {
      addPlanConflict(
        plan,
        "ALIAS_VALUE_CONFLICT",
        {
          sourceAttribute:
            sourceAttribute,

          sourceValue:
            sourceValue,

          targetAttribute:
            targetAttribute,

          targetValue:
            targetValue
        }
      );
    }
  }

  function captureMutationSnapshot(
    node,
    mutations
  ) {
    return mutations.map(function captureMutation(mutation) {
      if (mutation.type === "id") {
        return {
          type:
            "id",

          name:
            "id",

          hadValue:
            Boolean(node.id),

          value:
            node.id || ""
        };
      }

      return {
        type:
          "attribute",

        name:
          mutation.name,

        hadValue:
          node.hasAttribute(
            mutation.name
          ),

        value:
          node.getAttribute(
            mutation.name
          )
      };
    });
  }

  function restoreMutationSnapshot(
    node,
    snapshot
  ) {
    var failures = [];

    snapshot.forEach(function restoreEntry(entry) {
      try {
        if (entry.type === "id") {
          node.id =
            entry.hadValue
              ? entry.value
              : "";

          return;
        }

        if (entry.hadValue) {
          node.setAttribute(
            entry.name,
            entry.value
          );
        } else {
          node.removeAttribute(
            entry.name
          );
        }
      } catch (error) {
        failures.push({
          name:
            entry.name,

          message:
            error && error.message
              ? error.message
              : String(error)
        });
      }
    });

    return {
      restored:
        failures.length === 0,

      failures:
        failures
    };
  }

  function markRolledBackTransaction(
    state,
    plan,
    rollback,
    originalError,
    appliedMutationCount
  ) {
    var metrics =
      state.aliases[
        plan.family
      ];

    metrics.transactionFailureCount += 1;
    metrics.unresolvedTransactionCount += 1;
    metrics.rolledBackNodeCount += 1;
    metrics.heldNodeCount += 1;
    metrics.mutationRollbackCount += 1;

    state.installationMutationHistory
      .transactionFailureCount += 1;

    state.installationMutationHistory
      .unresolvedTransactionCount += 1;

    state.installationMutationHistory
      .rolledBackTransactionCount += 1;

    state.installationMutationHistory
      .mutationRollbackCount += 1;

    if (!rollback.restored) {
      metrics.mutationRollbackFailureCount += 1;
      metrics.partialMutationCount += 1;

      state.installationMutationHistory
        .mutationRollbackFailureCount += 1;

      state.installationMutationHistory
        .partialMutationCount += 1;

      recordError(
        state,
        "TRANSACTIONAL_MUTATION_ROLLBACK_FAILED",
        originalError,
        {
          family:
            plan.family,

          node:
            describeNode(
              plan.node
            ),

          appliedMutationCount:
            appliedMutationCount,

          plannedMutationCount:
            plan.mutations.length,

          rollbackFailures:
            rollback.failures
        }
      );

      return;
    }

    state.conflicts.push({
      code:
        "TRANSACTION_ROLLED_BACK_UNRESOLVED",

      family:
        plan.family,

      node:
        describeNode(
          plan.node
        ),

      detail: {
        appliedMutationCount:
          appliedMutationCount,

        plannedMutationCount:
          plan.mutations.length,

        rollbackRestored:
          true,

        originalError:
          originalError &&
          originalError.message
            ? originalError.message
            : String(originalError)
      },

      resolution:
        "HELD_TRANSACTION_DID_NOT_COMMIT"
    });
  }

  function applyMutationPlan(
    state,
    mode,
    plan
  ) {
    var metrics =
      state.aliases[
        plan.family
      ];

    if (!plan.valid) {
      metrics.blockedMutationCount +=
        plan.mutations.length;

      state.installationMutationHistory
        .blockedMutationCount +=
        plan.mutations.length;

      plan.invalid
        .forEach(function publishInvalid(entry) {
          recordInvalid(
            state,
            plan.family,
            entry.code,
            plan.node,
            entry.detail
          );
        });

      plan.conflicts
        .forEach(function publishConflict(entry) {
          recordConflict(
            state,
            plan.family,
            entry.code,
            plan.node,
            entry.detail
          );
        });

      return;
    }

    metrics.validatedNodeCount += 1;

    if (
      plan.mutations.length === 0
    ) {
      metrics.alreadyCorrespondingNodeCount += 1;
      return;
    }

    if (mode === MODE.VERIFY) {
      metrics.blockedMutationCount +=
        plan.mutations.length;

      state.currentRunMutationMetrics
        .mutationAttemptCount += 0;

      plan.mutations
        .forEach(function recordMissingExpression(mutation) {
          recordConflict(
            state,
            plan.family,
            "AUTHORIZED_COMPATIBILITY_EXPRESSION_MISSING",
            plan.node,
            {
              type:
                mutation.type,

              name:
                mutation.name,

              expectedValue:
                mutation.value
            }
          );
        });

      return;
    }

    state.installationMutationHistory
      .authorizedMutationCount +=
      plan.mutations.length;

    state.installationMutationHistory
      .mutationAttemptCount += 1;

    metrics.mutationAttemptCount += 1;

    var snapshot;

    try {
      snapshot =
        captureMutationSnapshot(
          plan.node,
          plan.mutations
        );
    } catch (error) {
      metrics.transactionFailureCount += 1;
      metrics.unresolvedTransactionCount += 1;
      metrics.heldNodeCount += 1;

      state.installationMutationHistory
        .transactionFailureCount += 1;

      state.installationMutationHistory
        .unresolvedTransactionCount += 1;

      recordError(
        state,
        "MUTATION_SNAPSHOT_FAILURE",
        error,
        {
          family:
            plan.family,

          node:
            describeNode(
              plan.node
            )
        }
      );

      return;
    }

    var appliedMutationCount = 0;

    try {
      plan.mutations
        .forEach(function applyMutation(mutation) {
          if (mutation.type === "id") {
            plan.node.id =
              mutation.value;
          } else {
            plan.node.setAttribute(
              mutation.name,
              mutation.value
            );
          }

          appliedMutationCount += 1;
        });
    } catch (error) {
      var rollback =
        restoreMutationSnapshot(
          plan.node,
          snapshot
        );

      markRolledBackTransaction(
        state,
        plan,
        rollback,
        error,
        appliedMutationCount
      );

      return;
    }

    metrics.mutatedNodeCount += 1;
    metrics.mutationCommitCount += 1;

    state.installationMutationHistory
      .mutationCommitCount += 1;

    state.installationMutationHistory
      .completedMutationCount +=
      plan.mutations.length;
  }

  function isEligibleParticipantAliasTarget(node) {
    if (
      !node ||
      node.nodeType !== 1
    ) {
      return {
        eligible:
          false,

        reason:
          "NOT_AN_ELEMENT"
      };
    }

    var tag =
      String(
        node.tagName || ""
      ).toUpperCase();

    if (
      INELIGIBLE_PARTICIPANT_TAGS
        .indexOf(tag) !== -1
    ) {
      return {
        eligible:
          false,

        reason:
          "INELIGIBLE_TAG",

        tag:
          tag
      };
    }

    if (node.hidden) {
      return {
        eligible:
          false,

        reason:
          "HIDDEN_ATTRIBUTE",

        tag:
          tag
      };
    }

    if (
      node.getAttribute(
        "aria-hidden"
      ) === "true"
    ) {
      return {
        eligible:
          false,

        reason:
          "ARIA_HIDDEN",

        tag:
          tag
      };
    }

    return {
      eligible:
        true,

      reason:
        null,

      tag:
        tag
    };
  }

  function processIdAliases(
    state,
    mode
  ) {
    var nodes =
      Array.prototype.slice.call(
        doc.querySelectorAll(
          "[data-control-bridge-id]"
        )
      );

    nodes.forEach(function processIdAlias(node) {
      var metrics =
        state.aliases.ids;

      metrics.declaredNodeCount += 1;
      metrics.declaredAttributeCount += 1;

      var plan =
        createMutationPlan(
          "ids",
          node
        );

      var canonicalId =
        trimmedAttribute(
          node,
          "data-control-bridge-id"
        );

      if (!canonicalId) {
        addPlanInvalid(
          plan,
          "EMPTY_ID_ALIAS",
          {}
        );
      } else {
        var existing =
          doc.getElementById(
            canonicalId
          );

        if (
          existing &&
          existing !== node
        ) {
          addPlanConflict(
            plan,
            "CANONICAL_ID_ALREADY_OWNED",
            {
              canonicalId:
                canonicalId,

              owner:
                describeNode(existing)
            }
          );
        }

        if (
          node.id &&
          node.id !== canonicalId
        ) {
          addPlanConflict(
            plan,
            "NODE_ALREADY_HAS_DIFFERENT_ID",
            {
              canonicalId:
                canonicalId,

              existingId:
                node.id
            }
          );
        }

        if (!node.id) {
          addMutation(
            plan,
            "id",
            "id",
            canonicalId
          );
        }
      }

      applyMutationPlan(
        state,
        mode,
        plan
      );
    });
  }

  function processCommandAliases(
    state,
    mode
  ) {
    var nodes =
      Array.prototype.slice.call(
        doc.querySelectorAll(
          "[data-control-command]"
        )
      );

    nodes.forEach(function processCommandNode(node) {
      var metrics =
        state.aliases.commands;

      metrics.declaredNodeCount += 1;

      var plan =
        createMutationPlan(
          "commands",
          node
        );

      var command =
        trimmedAttribute(
          node,
          "data-control-command"
        );

      if (
        VALID_REPORT_COMMANDS
          .indexOf(command) === -1
      ) {
        addPlanInvalid(
          plan,
          "UNSUPPORTED_REPORT_COMMAND_ALIAS",
          {
            command:
              command,

            allowed:
              VALID_REPORT_COMMANDS.slice()
          }
        );
      }

      COMMAND_ATTRIBUTE_MAP
        .forEach(function inspectMapping(mapping) {
          inspectAttributeAlias(
            state,
            plan,
            mapping.source,
            mapping.target
          );
        });

      if (
        node.id === "runDirectCheck" ||
        node.id === "runNineCycle"
      ) {
        addPlanConflict(
          plan,
          "EXPLICIT_EXECUTION_MISCLASSIFIED_AS_REPORT_COMMAND",
          {
            id:
              node.id
          }
        );
      }

      applyMutationPlan(
        state,
        mode,
        plan
      );
    });
  }

  function processParticipantAliases(
    state,
    mode
  ) {
    var nodes =
      Array.prototype.slice.call(
        doc.querySelectorAll(
          "[data-control-bridge-participant]"
        )
      );

    nodes.forEach(function processParticipant(node) {
      var metrics =
        state.aliases.participants;

      metrics.declaredNodeCount += 1;
      metrics.declaredAttributeCount += 1;

      var plan =
        createMutationPlan(
          "participants",
          node
        );

      var eligibility =
        isEligibleParticipantAliasTarget(
          node
        );

      if (!eligibility.eligible) {
        addPlanInvalid(
          plan,
          "INELIGIBLE_PARTICIPANT_ALIAS_TARGET",
          {
            reason:
              eligibility.reason,

            tag:
              eligibility.tag || null
          }
        );
      }

      var participantRole =
        trimmedAttribute(
          node,
          "data-control-bridge-participant"
        );

      if (!participantRole) {
        addPlanInvalid(
          plan,
          "EMPTY_PARTICIPANT_ALIAS",
          {}
        );
      } else if (
        node.hasAttribute(
          "data-participant-role"
        )
      ) {
        var observedRole =
          trimmedAttribute(
            node,
            "data-participant-role"
          );

        if (
          observedRole !==
          participantRole
        ) {
          addPlanConflict(
            plan,
            "PARTICIPANT_ROLE_ALIAS_CONFLICT",
            {
              expectedRole:
                participantRole,

              observedRole:
                observedRole
            }
          );
        }
      } else {
        addMutation(
          plan,
          "attribute",
          "data-participant-role",
          participantRole
        );
      }

      applyMutationPlan(
        state,
        mode,
        plan
      );
    });
  }

  function processReceiptFilterAliases(
    state,
    mode
  ) {
    var nodes =
      Array.prototype.slice.call(
        doc.querySelectorAll(
          "[data-control-bridge-receipt-filter]"
        )
      );

    nodes.forEach(function processReceiptFilter(node) {
      var metrics =
        state.aliases.receiptFilters;

      metrics.declaredNodeCount += 1;
      metrics.declaredAttributeCount += 1;

      var plan =
        createMutationPlan(
          "receiptFilters",
          node
        );

      var filter =
        trimmedAttribute(
          node,
          "data-control-bridge-receipt-filter"
        ).toLowerCase();

      if (
        VALID_RECEIPT_FILTERS
          .indexOf(filter) === -1
      ) {
        addPlanInvalid(
          plan,
          "UNSUPPORTED_RECEIPT_FILTER_ALIAS",
          {
            filter:
              filter,

            allowed:
              VALID_RECEIPT_FILTERS.slice()
          }
        );
      } else if (
        node.hasAttribute(
          "data-receipt-filter"
        )
      ) {
        var observedFilter =
          trimmedAttribute(
            node,
            "data-receipt-filter"
          ).toLowerCase();

        if (
          observedFilter !==
          filter
        ) {
          addPlanConflict(
            plan,
            "RECEIPT_FILTER_ALIAS_CONFLICT",
            {
              expectedFilter:
                filter,

              observedFilter:
                observedFilter
            }
          );
        }
      } else {
        addMutation(
          plan,
          "attribute",
          "data-receipt-filter",
          filter
        );
      }

      applyMutationPlan(
        state,
        mode,
        plan
      );
    });
  }

  function processViewAndChamberAliases(
    state,
    mode
  ) {
    VIEW_ATTRIBUTE_MAP
      .forEach(function processMapping(mapping) {
        var nodes =
          Array.prototype.slice.call(
            doc.querySelectorAll(
              "[" + mapping.source + "]"
            )
          );

        nodes.forEach(function processAlias(node) {
          state.aliases[
            mapping.family
          ].declaredNodeCount += 1;

          var plan =
            createMutationPlan(
              mapping.family,
              node
            );

          inspectAttributeAlias(
            state,
            plan,
            mapping.source,
            mapping.target
          );

          applyMutationPlan(
            state,
            mode,
            plan
          );
        });
      });
  }

  function totalAliasMetric(
    state,
    key
  ) {
    return Object.keys(
      state.aliases
    ).reduce(function reduceMetric(total, family) {
      return total +
        Number(
          state.aliases[
            family
          ][key] || 0
        );
    }, 0);
  }

  function evaluateAliasTranslation(
    state
  ) {
    var held =
      totalAliasMetric(
        state,
        "heldNodeCount"
      );

    var invalid =
      totalAliasMetric(
        state,
        "invalidNodeCount"
      );

    var conflicting =
      totalAliasMetric(
        state,
        "conflictingNodeCount"
      );

    var unresolvedTransactions =
      totalAliasMetric(
        state,
        "unresolvedTransactionCount"
      );

    var transactionFailures =
      totalAliasMetric(
        state,
        "transactionFailureCount"
      );

    var rollbackFailures =
      totalAliasMetric(
        state,
        "mutationRollbackFailureCount"
      );

    var partialMutations =
      totalAliasMetric(
        state,
        "partialMutationCount"
      );

    var complete =
      Boolean(
        held === 0 &&
        invalid === 0 &&
        conflicting === 0 &&
        unresolvedTransactions === 0 &&
        transactionFailures === 0 &&
        rollbackFailures === 0 &&
        partialMutations === 0
      );

    state.aliasTranslationStatus =
      complete
        ? STATUS.READY
        : rollbackFailures ||
          partialMutations
          ? STATUS.ERROR
          : STATUS.HELD;

    recordObservation(
      state,
      "ALIAS_TRANSLATION_EVALUATED",
      {
        status:
          state.aliasTranslationStatus,

        declaredNodeCount:
          totalAliasMetric(
            state,
            "declaredNodeCount"
          ),

        declaredAttributeCount:
          totalAliasMetric(
            state,
            "declaredAttributeCount"
          ),

        heldNodeCount:
          held,

        invalidNodeCount:
          invalid,

        conflictingNodeCount:
          conflicting,

        unresolvedTransactionCount:
          unresolvedTransactions,

        transactionFailureCount:
          transactionFailures,

        mutationRollbackFailureCount:
          rollbackFailures,

        partialMutationCount:
          partialMutations
      }
    );
  }

  function evaluateInstallationMutationHistory(
    state
  ) {
    var history =
      state.installationMutationHistory;

    var safe =
      Boolean(
        history.unauthorizedMutationCount === 0 &&
        history.partialMutationCount === 0 &&
        history.mutationRollbackFailureCount === 0
      );

    history.status =
      safe
        ? STATUS.READY
        : STATUS.ERROR;
  }

  function evaluateCurrentRunMutationSafety(
    state
  ) {
    var metrics =
      state.currentRunMutationMetrics;

    var safe =
      Boolean(
        metrics.completedMutationCount === 0 &&
        metrics.partialMutationCount === 0 &&
        metrics.mutationRollbackFailureCount === 0 &&
        metrics.unauthorizedMutationCount === 0
      );

    metrics.status =
      safe
        ? STATUS.READY
        : STATUS.ERROR;
  }

  function installAliases(state) {
    processIdAliases(
      state,
      MODE.INSTALL
    );

    processCommandAliases(
      state,
      MODE.INSTALL
    );

    processParticipantAliases(
      state,
      MODE.INSTALL
    );

    processReceiptFilterAliases(
      state,
      MODE.INSTALL
    );

    processViewAndChamberAliases(
      state,
      MODE.INSTALL
    );

    evaluateAliasTranslation(
      state
    );

    evaluateInstallationMutationHistory(
      state
    );
  }

  function observeControlsRequirements(
    state
  ) {
    var requirements =
      root[
        CONTROLS_REQUIREMENTS_GLOBAL
      ] || null;

    if (!requirements) {
      state.controlsRequirements = {
        status:
          STATUS.UNAVAILABLE,

        complete:
          false,

        reason:
          "CONTROLS_REQUIREMENTS_NOT_OBSERVED",

        evidence:
          null
      };

      return null;
    }

    state.controlsRequirements = {
      status:
        STATUS.READY,

      complete:
        true,

      reason:
        "CONTROLS_REQUIREMENTS_OBSERVED",

      evidence: {
        schema:
          requirements.schema || null,

        controlsContract:
          requirements.controlsContract || null,

        expectedEngineContract:
          requirements.expectedEngineContract || null,

        expectedInspectionLaneContract:
          requirements.expectedInspectionLaneContract || null,

        publicApiRequirements:
          Array.isArray(
            requirements.publicApiRequirements
          )
            ? requirements.publicApiRequirements.slice()
            : [],

        requiredCycleTargetIds:
          Array.isArray(
            requirements.requiredCycleTargetIds
          )
            ? requirements.requiredCycleTargetIds.slice()
            : [],

        requiredStationPositions:
          Array.isArray(
            requirements.requiredStationPositions
          )
            ? requirements.requiredStationPositions.slice()
            : [],

        presentationStationMap:
          Array.isArray(
            requirements.presentationStationMap
          )
            ? cloneValue(
                requirements.presentationStationMap
              )
            : []
      }
    };

    return requirements;
  }

  function observePathSet(paths) {
    return paths.map(function observePath(path) {
      return {
        path:
          path,

        value:
          readPath(path)
      };
    });
  }

  function evaluateControlsApi(
    state,
    requirements
  ) {
    var observations =
      observePathSet(
        CONTROLS_API_PATHS
      );

    var canonical =
      observations[0]
        ? observations[0].value
        : null;

    var requiredMethods =
      requirements &&
      Array.isArray(
        requirements.publicApiRequirements
      )
        ? requirements.publicApiRequirements.slice()
        : [];

    var missingMethods = [];

    if (canonical) {
      requiredMethods
        .forEach(function inspectMethod(methodName) {
          if (
            !isFunction(
              canonical[methodName]
            )
          ) {
            missingMethods.push(
              methodName
            );
          }
        });
    }

    var conflictingAliases =
      observations
        .filter(function observed(entry) {
          return Boolean(
            entry.value &&
            canonical &&
            entry.value !== canonical
          );
        })
        .map(function mapConflict(entry) {
          return entry.path;
        });

    var observedContract =
      readContract(
        canonical
      );

    var expectedContract =
      requirements
        ? requirements.controlsContract || null
        : null;

    var contractCorresponds =
      Boolean(
        observedContract &&
        expectedContract &&
        observedContract === expectedContract
      );

    var complete =
      Boolean(
        canonical &&
        (
          !expectedContract ||
          contractCorresponds
        ) &&
        missingMethods.length === 0 &&
        conflictingAliases.length === 0
      );

    state.controlsApi = {
      status:
        complete
          ? STATUS.READY
          : canonical
            ? STATUS.HELD
            : STATUS.UNAVAILABLE,

      complete:
        complete,

      reason:
        complete
          ? "CONTROLS_API_CORRESPONDS"
          : !canonical
            ? "CANONICAL_CONTROLS_API_NOT_OBSERVED"
            : expectedContract &&
              !contractCorresponds
              ? "CONTROLS_CONTRACT_MISMATCH"
              : missingMethods.length
                ? "REQUIRED_CONTROLS_METHODS_MISSING"
                : "CONTROLS_API_ALIAS_REFERENCE_CONFLICT",

      evidence: {
        canonicalApiObserved:
          Boolean(canonical),

        observedContract:
          observedContract,

        expectedContract:
          expectedContract,

        contractCorresponds:
          contractCorresponds,

        requiredMethodCount:
          requiredMethods.length,

        callableRequiredMethodCount:
          requiredMethods.length -
          missingMethods.length,

        missingRequiredMethods:
          missingMethods,

        observedPaths:
          observations.map(function mapObservation(entry) {
            return {
              path:
                entry.path,

              observed:
                Boolean(entry.value),

              matchesCanonical:
                Boolean(
                  entry.value &&
                  canonical &&
                  entry.value === canonical
                )
            };
          }),

        conflictingAliases:
          conflictingAliases
      }
    };

    state.aliasReferences = {
      status:
        conflictingAliases.length === 0
          ? STATUS.READY
          : STATUS.HELD,

      complete:
        conflictingAliases.length === 0,

      reason:
        conflictingAliases.length === 0
          ? "CONTROLS_API_REFERENCES_CORRESPOND"
          : "CONTROLS_API_REFERENCES_CONFLICT",

      evidence: {
        conflictingAliases:
          conflictingAliases
      }
    };
  }

  function evaluateInspectionEvidence(state) {
    var api =
      resolveFirst(
        INSPECTION_API_PATHS
      );

    var receipt =
      resolveFirst(
        INSPECTION_RECEIPT_PATHS
      );

    var complete =
      Boolean(
        api &&
        api.value &&
        receipt &&
        receipt.value
      );

    state.inspectionEvidence = {
      status:
        complete
          ? STATUS.READY
          : STATUS.UNAVAILABLE,

      complete:
        complete,

      reason:
        complete
          ? "INSPECTION_AUTHORITY_AND_RECEIPT_OBSERVED"
          : "INSPECTION_AUTHORITY_OR_RECEIPT_UNAVAILABLE",

      evidence: {
        apiObserved:
          Boolean(
            api &&
            api.value
          ),

        apiPath:
          api
            ? api.path
            : null,

        apiContract:
          api
            ? readContract(
                api.value
              )
            : null,

        receiptObserved:
          Boolean(
            receipt &&
            receipt.value
          ),

        receiptPath:
          receipt
            ? receipt.path
            : null,

        receiptContract:
          receipt
            ? receipt.value.contract || null
            : null
      }
    };
  }

  function observeAuthorityContract(paths) {
    var resolved =
      resolveFirst(paths);

    return {
      observed:
        Boolean(
          resolved &&
          resolved.value
        ),

      path:
        resolved
          ? resolved.path
          : null,

      contract:
        resolved
          ? readContract(
              resolved.value
            )
          : null
    };
  }

  function evaluateContracts(
    state,
    requirements
  ) {
    var controls =
      observeAuthorityContract(
        CONTROLS_API_PATHS
      );

    var inspection =
      observeAuthorityContract(
        INSPECTION_API_PATHS
      );

    var interpreter =
      observeAuthorityContract(
        INTERPRETER_API_PATHS
      );

    var expected = {
      controls:
        requirements
          ? requirements.controlsContract || null
          : null,

      inspection:
        requirements
          ? requirements.expectedInspectionLaneContract || null
          : null,

      interpreter:
        requirements
          ? requirements.expectedEngineContract || null
          : null,

      bridge:
        CONTRACT
    };

    var observed = {
      controls:
        controls.contract,

      inspection:
        inspection.contract,

      interpreter:
        interpreter.contract,

      bridge:
        CONTRACT
    };

    var keys = [
      "controls",
      "inspection",
      "interpreter",
      "bridge"
    ];

    var matching = [];
    var missing = [];
    var mismatched = [];

    keys.forEach(function compareContract(key) {
      if (!observed[key]) {
        missing.push(key);
        return;
      }

      if (
        expected[key] &&
        expected[key] !== observed[key]
      ) {
        mismatched.push({
          authority:
            key,

          expected:
            expected[key],

          observed:
            observed[key]
        });

        return;
      }

      matching.push(key);
    });

    var complete =
      Boolean(
        missing.length === 0 &&
        mismatched.length === 0
      );

    state.contracts = {
      status:
        complete
          ? STATUS.READY
          : mismatched.length
            ? STATUS.HELD
            : STATUS.UNAVAILABLE,

      complete:
        complete,

      reason:
        complete
          ? "FAMILY_CONTRACTS_CORRESPOND"
          : mismatched.length
            ? "FAMILY_CONTRACT_MISMATCH"
            : "FAMILY_CONTRACT_UNAVAILABLE",

      evidence: {
        expected:
          expected,

        observed:
          observed,

        matching:
          matching,

        missing:
          missing,

        mismatched:
          mismatched,

        paths: {
          controls:
            controls.path,

          inspection:
            inspection.path,

          interpreter:
            interpreter.path,

          bridge:
            FILE
        }
      }
    };
  }

  function findDuplicateIds(ids) {
    var duplicates = [];

    ids.forEach(function inspectId(id) {
      var selector =
        '[id="' +
        escapeAttributeValue(id) +
        '"]';

      var nodes =
        doc.querySelectorAll(
          selector
        );

      if (
        nodes.length > 1
      ) {
        duplicates.push({
          id:
            id,

          count:
            nodes.length
        });
      }
    });

    return duplicates;
  }

  function evaluateHtmlTargets(
    state,
    requirements
  ) {
    var requiredIds =
      requirements &&
      Array.isArray(
        requirements.requiredCycleTargetIds
      )
        ? requirements.requiredCycleTargetIds.slice()
        : [];

    if (!requiredIds.length) {
      state.htmlTargets = {
        status:
          STATUS.UNAVAILABLE,

        complete:
          false,

        reason:
          "REQUIRED_TARGET_DECLARATIONS_UNAVAILABLE",

        evidence:
          null
      };

      return;
    }

    var observed = [];
    var missing = [];

    requiredIds.forEach(function inspectTarget(id) {
      if (
        doc.getElementById(id)
      ) {
        observed.push(id);
      } else {
        missing.push(id);
      }
    });

    var duplicates =
      findDuplicateIds(
        requiredIds
      );

    var complete =
      Boolean(
        missing.length === 0 &&
        duplicates.length === 0
      );

    state.htmlTargets = {
      status:
        complete
          ? STATUS.READY
          : STATUS.HELD,

      complete:
        complete,

      reason:
        complete
          ? "REQUIRED_HTML_TARGETS_CORRESPOND"
          : missing.length
            ? "REQUIRED_HTML_TARGETS_MISSING"
            : "REQUIRED_HTML_TARGETS_DUPLICATED",

      evidence: {
        requiredTargetCount:
          requiredIds.length,

        observedTargetCount:
          observed.length,

        missingTargetCount:
          missing.length,

        duplicateTargetCount:
          duplicates.length,

        requiredTargetIds:
          requiredIds,

        observedTargetIds:
          observed,

        missingTargetIds:
          missing,

        duplicateTargetIds:
          duplicates
      }
    };
  }

  function collectStationRows() {
    return Array.prototype.slice.call(
      doc.querySelectorAll(
        '#cycleMap [data-position], ' +
        '#cycleChamber [data-position]'
      )
    );
  }

  function evaluateStationMap(
    state,
    requirements
  ) {
    var requiredPositions =
      requirements &&
      Array.isArray(
        requirements.requiredStationPositions
      )
        ? requirements.requiredStationPositions
            .map(Number)
            .filter(function keepInteger(value) {
              return Number.isInteger(value);
            })
        : [];

    var presentationMap =
      requirements &&
      Array.isArray(
        requirements.presentationStationMap
      )
        ? requirements.presentationStationMap
        : [];

    if (!requiredPositions.length) {
      state.stationMap = {
        status:
          STATUS.UNAVAILABLE,

        complete:
          false,

        reason:
          "REQUIRED_STATION_DECLARATIONS_UNAVAILABLE",

        evidence:
          null
      };

      return;
    }

    var expectedByPosition =
      Object.create(null);

    presentationMap
      .forEach(function indexExpected(station) {
        var position =
          Number(
            station &&
            station.position
          );

        if (
          Number.isInteger(position)
        ) {
          expectedByPosition[position] =
            station;
        }
      });

    var rows =
      collectStationRows();

    var rowsByPosition =
      Object.create(null);

    var unexpected = [];

    rows.forEach(function indexRow(row) {
      var rawPosition =
        row.getAttribute(
          "data-position"
        );

      var position =
        Number(rawPosition);

      if (
        !Number.isInteger(position)
      ) {
        unexpected.push({
          value:
            rawPosition,

          node:
            describeNode(row)
        });

        return;
      }

      if (!rowsByPosition[position]) {
        rowsByPosition[position] = [];
      }

      rowsByPosition[position]
        .push(row);

      if (
        requiredPositions
          .indexOf(position) === -1
      ) {
        unexpected.push({
          value:
            position,

          node:
            describeNode(row)
        });
      }
    });

    var missing = [];
    var duplicate = [];
    var fibonacciMismatch = [];
    var roleMismatch = [];

    requiredPositions
      .forEach(function inspectPosition(position) {
        var positionRows =
          rowsByPosition[position] || [];

        if (!positionRows.length) {
          missing.push(position);
          return;
        }

        if (
          positionRows.length > 1
        ) {
          duplicate.push({
            position:
              position,

            count:
              positionRows.length
          });
        }

        var expected =
          expectedByPosition[position];

        if (!expected) {
          return;
        }

        positionRows
          .forEach(function inspectIdentity(row) {
            var observedFibonacci =
              normalizeToken(
                row.getAttribute(
                  "data-fibonacci"
                )
              );

            var observedRole =
              normalizeToken(
                row.getAttribute(
                  "data-role"
                )
              );

            var expectedFibonacci =
              normalizeToken(
                expected.fibonacci
              );

            var expectedRole =
              normalizeToken(
                expected.role
              );

            if (
              expectedFibonacci &&
              observedFibonacci !==
              expectedFibonacci
            ) {
              fibonacciMismatch.push({
                position:
                  position,

                expected:
                  expected.fibonacci,

                observed:
                  row.getAttribute(
                    "data-fibonacci"
                  )
              });
            }

            if (
              expectedRole &&
              observedRole !==
              expectedRole
            ) {
              roleMismatch.push({
                position:
                  position,

                expected:
                  expected.role,

                observed:
                  row.getAttribute(
                    "data-role"
                  )
              });
            }
          });
      });

    var complete =
      Boolean(
        missing.length === 0 &&
        duplicate.length === 0 &&
        unexpected.length === 0 &&
        fibonacciMismatch.length === 0 &&
        roleMismatch.length === 0
      );

    state.stationMap = {
      status:
        complete
          ? STATUS.READY
          : STATUS.HELD,

      complete:
        complete,

      reason:
        complete
          ? "STATION_MAP_CORRESPONDS"
          : "STATION_MAP_DOES_NOT_CORRESPOND",

      evidence: {
        requiredStationCount:
          requiredPositions.length,

        observedStationRowCount:
          rows.length,

        requiredPositions:
          requiredPositions,

        missingPositions:
          missing,

        duplicatePositions:
          duplicate,

        unexpectedPositions:
          unexpected,

        fibonacciMismatches:
          fibonacciMismatch,

        roleMismatches:
          roleMismatch
      }
    };
  }

  function scriptFileName(script) {
    var source =
      script.getAttribute(
        "src"
      ) || "";

    if (!source) {
      return "";
    }

    var clean =
      source
        .split("?")[0]
        .split("#")[0];

    return clean.substring(
      clean.lastIndexOf("/") + 1
    );
  }

  function collectPhysicalRuntimeOrder() {
    return Array.prototype.slice.call(
      doc.querySelectorAll(
        "script[src]"
      )
    )
      .map(scriptFileName)
      .filter(Boolean);
  }

  function orderCorresponds(
    expected,
    observed
  ) {
    var cursor = -1;

    return expected.every(function findFile(fileName) {
      var index =
        observed.indexOf(
          fileName,
          cursor + 1
        );

      if (index === -1) {
        return false;
      }

      cursor = index;

      return true;
    });
  }

  function evaluateRuntimeOrder(state) {
    var observed =
      collectPhysicalRuntimeOrder();

    if (!observed.length) {
      state.runtimeOrder = {
        status:
          STATUS.UNAVAILABLE,

        complete:
          false,

        reason:
          "PHYSICAL_SCRIPT_ORDER_UNAVAILABLE",

        evidence:
          null
      };

      return;
    }

    var complete =
      orderCorresponds(
        REQUIRED_RUNTIME_ORDER,
        observed
      );

    state.runtimeOrder = {
      status:
        complete
          ? STATUS.READY
          : STATUS.HELD,

      complete:
        complete,

      reason:
        complete
          ? "PHYSICAL_RUNTIME_ORDER_CORRESPONDS"
          : "PHYSICAL_RUNTIME_ORDER_DOES_NOT_CORRESPOND",

      evidence: {
        expectedRuntimeOrder:
          REQUIRED_RUNTIME_ORDER.slice(),

        observedPhysicalOrder:
          observed
      }
    };
  }

  function evaluateControlsLocalEvidence(
    state,
    requirements
  ) {
    var receiptResolution =
      resolveFirst(
        CONTROLS_RECEIPT_PATHS
      );

    var receipt =
      receiptResolution
        ? receiptResolution.value
        : null;

    if (!receipt) {
      state.controlsLocalEvidence = {
        status:
          STATUS.UNAVAILABLE,

        complete:
          false,

        reason:
          "CONTROLS_LOCAL_RECEIPT_UNAVAILABLE",

        evidence:
          null
      };

      return;
    }

    var expectedContract =
      requirements
        ? requirements.controlsContract || null
        : null;

    var observedContract =
      receipt.contract || null;

    var contractCorresponds =
      Boolean(
        !expectedContract ||
        observedContract === expectedContract
      );

    var scope =
      receipt.domSynchronizationScope ||
      (
        receipt.cycleRenderingReceipt &&
        receipt.cycleRenderingReceipt.evidenceScope
      ) ||
      null;

    var scopeValid =
      Boolean(
        scope ===
          "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_ONLY" ||
        scope ===
          "CONTROLS_LOCAL_PRESENTATION_ONLY"
      );

    var localComplete =
      receipt.localDomUpdateComplete === true;

    var missingTargets =
      Array.isArray(
        receipt.missingCycleTargets
      )
        ? receipt.missingCycleTargets.slice()
        : [];

    var missingStations =
      Array.isArray(
        receipt.missingStationPositions
      )
        ? receipt.missingStationPositions.slice()
        : [];

    var complete =
      Boolean(
        contractCorresponds &&
        scopeValid &&
        localComplete &&
        missingTargets.length === 0 &&
        missingStations.length === 0
      );

    state.controlsLocalEvidence = {
      status:
        complete
          ? STATUS.READY
          : STATUS.HELD,

      complete:
        complete,

      reason:
        complete
          ? "CONTROLS_LOCAL_EVIDENCE_CORRESPONDS"
          : !contractCorresponds
            ? "CONTROLS_LOCAL_RECEIPT_CONTRACT_MISMATCH"
            : !scopeValid
              ? "CONTROLS_LOCAL_EVIDENCE_SCOPE_INVALID"
              : !localComplete
                ? "CONTROLS_LOCAL_DOM_EVIDENCE_INCOMPLETE"
                : "CONTROLS_REPORTED_MISSING_DOM_PROVISIONS",

      evidence: {
        receiptPath:
          receiptResolution.path,

        expectedContract:
          expectedContract,

        observedContract:
          observedContract,

        contractCorresponds:
          contractCorresponds,

        evidenceScope:
          scope,

        evidenceScopeValid:
          scopeValid,

        localDomUpdateComplete:
          localComplete,

        missingCycleTargets:
          missingTargets,

        missingStationPositions:
          missingStations,

        controlsSynchronizationClaimIgnored:
          receipt.cycleChamberSynchronized,

        controlsFamilyCertificationClaimIgnored:
          receipt.familySynchronizationCertified
      }
    };
  }

  function classifyMandatoryCategory(
    state,
    name,
    metric
  ) {
    state.mandatoryCategories.push(
      name
    );

    if (
      metric &&
      metric.status === STATUS.READY &&
      metric.complete === true
    ) {
      state.passedMandatoryCategories.push(
        name
      );

      return;
    }

    if (
      metric &&
      metric.status === STATUS.ERROR
    ) {
      state.failedMandatoryCategories.push(
        name
      );

      return;
    }

    if (
      metric &&
      metric.status === STATUS.UNAVAILABLE
    ) {
      state.unavailableMandatoryCategories.push(
        name
      );

      return;
    }

    state.heldMandatoryCategories.push(
      name
    );
  }

  function evaluateFamilySynchronization(state) {
    state.mandatoryCategories = [];
    state.passedMandatoryCategories = [];
    state.heldMandatoryCategories = [];
    state.unavailableMandatoryCategories = [];
    state.failedMandatoryCategories = [];

    classifyMandatoryCategory(
      state,
      "controlsRequirements",
      state.controlsRequirements
    );

    classifyMandatoryCategory(
      state,
      "controlsApi",
      state.controlsApi
    );

    classifyMandatoryCategory(
      state,
      "aliasReferences",
      state.aliasReferences
    );

    classifyMandatoryCategory(
      state,
      "contracts",
      state.contracts
    );

    classifyMandatoryCategory(
      state,
      "htmlTargets",
      state.htmlTargets
    );

    classifyMandatoryCategory(
      state,
      "stationMap",
      state.stationMap
    );

    classifyMandatoryCategory(
      state,
      "runtimeOrder",
      state.runtimeOrder
    );

    classifyMandatoryCategory(
      state,
      "inspectionEvidence",
      state.inspectionEvidence
    );

    classifyMandatoryCategory(
      state,
      "controlsLocalEvidence",
      state.controlsLocalEvidence
    );

    if (
      totalAliasMetric(
        state,
        "declaredNodeCount"
      ) > 0
    ) {
      classifyMandatoryCategory(
        state,
        "aliasTranslation",
        {
          status:
            state.aliasTranslationStatus,

          complete:
            state.aliasTranslationStatus ===
            STATUS.READY
        }
      );
    }

    var certified =
      Boolean(
        state.failedMandatoryCategories.length === 0 &&
        state.heldMandatoryCategories.length === 0 &&
        state.unavailableMandatoryCategories.length === 0 &&
        state.passedMandatoryCategories.length ===
          state.mandatoryCategories.length
      );

    state.familySynchronization = {
      status:
        certified
          ? STATUS.READY
          : state.failedMandatoryCategories.length
            ? STATUS.ERROR
            : state.heldMandatoryCategories.length
              ? STATUS.HELD
              : STATUS.UNAVAILABLE,

      complete:
        certified,

      reason:
        certified
          ? "DIAGNOSTIC_CONTROL_FAMILY_SYNCHRONIZED"
          : state.failedMandatoryCategories.length
            ? "MANDATORY_RELATIONAL_CATEGORY_FAILED"
            : state.heldMandatoryCategories.length
              ? "MANDATORY_RELATIONAL_CATEGORY_HELD"
              : "MANDATORY_RELATIONAL_CATEGORY_UNAVAILABLE",

      evidence: {
        mandatoryCategories:
          state.mandatoryCategories.slice(),

        passedMandatoryCategories:
          state.passedMandatoryCategories.slice(),

        heldMandatoryCategories:
          state.heldMandatoryCategories.slice(),

        unavailableMandatoryCategories:
          state.unavailableMandatoryCategories.slice(),

        failedMandatoryCategories:
          state.failedMandatoryCategories.slice(),

        familySynchronizationCertified:
          certified
      }
    };

    state.familySynchronizationStatus =
      state.familySynchronization.status;
  }

  function deriveInstallationStatus(state) {
    if (
      state.installationMutationHistory.status ===
      STATUS.ERROR ||
      state.aliasTranslationStatus ===
      STATUS.ERROR
    ) {
      state.phase =
        PHASE.ERROR;

      state.installationStatus =
        STATUS.ERROR;

      state.overallStatus =
        STATUS.ERROR;

      return;
    }

    state.installationStatus =
      state.aliasTranslationStatus;

    state.phase =
      PHASE.RELATIONAL_PENDING;

    state.relationalStatus =
      STATUS.PENDING;

    state.familySynchronizationStatus =
      STATUS.PENDING;

    state.overallStatus =
      state.installationStatus ===
      STATUS.READY
        ? STATUS.PENDING
        : STATUS.HELD;
  }

  function deriveRelationalStatus(state) {
    state.relationalStatus =
      state.familySynchronization.status;

    state.familySynchronizationStatus =
      state.familySynchronization.status;

    if (
      state.currentRunMutationMetrics.status ===
      STATUS.ERROR ||
      state.failedMandatoryCategories.length
    ) {
      state.phase =
        PHASE.ERROR;

      state.overallStatus =
        STATUS.ERROR;

      return;
    }

    state.phase =
      PHASE.RELATIONAL_COMPLETE;

    state.overallStatus =
      state.familySynchronization.complete
        ? STATUS.READY
        : STATUS.HELD;
  }

  function updateDocumentState(state) {
    var html =
      doc.documentElement;

    if (!html) {
      return;
    }

    html.setAttribute(
      DOCUMENT_READY_ATTRIBUTE,
      state.overallStatus === STATUS.READY
        ? "true"
        : "false"
    );

    html.setAttribute(
      DOCUMENT_STATUS_ATTRIBUTE,
      state.overallStatus
    );

    html.setAttribute(
      DOCUMENT_PHASE_ATTRIBUTE,
      state.phase
    );

    html.setAttribute(
      DOCUMENT_SCOPE_ATTRIBUTE,
      SCOPE
    );
  }

  function publishState(state) {
    currentState =
      state;

    root[
      GLOBAL_STATE
    ] =
      immutableSnapshot(
        state
      );

    updateDocumentState(
      state
    );
  }

  function buildVerificationReceipt(state) {
    return freezeDeep({
      schema:
        RECEIPT_SCHEMA,

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      scope:
        SCOPE,

      mode:
        state.mode,

      sequence:
        state.sequence,

      phase:
        state.phase,

      status:
        state.overallStatus,

      installationStatus:
        state.installationStatus,

      aliasTranslationStatus:
        state.aliasTranslationStatus,

      relationalStatus:
        state.relationalStatus,

      familySynchronizationStatus:
        state.familySynchronizationStatus,

      relationalVerificationRun:
        state.relationalVerificationRun,

      relationalVerificationCount:
        state.relationalVerificationCount,

      aliases:
        immutableSnapshot(
          state.aliases
        ),

      installationMutationHistory:
        immutableSnapshot(
          state.installationMutationHistory
        ),

      currentRunMutationMetrics:
        immutableSnapshot(
          state.currentRunMutationMetrics
        ),

      controlsRequirements:
        immutableSnapshot(
          state.controlsRequirements
        ),

      controlsApi:
        immutableSnapshot(
          state.controlsApi
        ),

      aliasReferences:
        immutableSnapshot(
          state.aliasReferences
        ),

      contracts:
        immutableSnapshot(
          state.contracts
        ),

      htmlTargets:
        immutableSnapshot(
          state.htmlTargets
        ),

      stationMap:
        immutableSnapshot(
          state.stationMap
        ),

      runtimeOrder:
        immutableSnapshot(
          state.runtimeOrder
        ),

      inspectionEvidence:
        immutableSnapshot(
          state.inspectionEvidence
        ),

      controlsLocalEvidence:
        immutableSnapshot(
          state.controlsLocalEvidence
        ),

      familySynchronization:
        immutableSnapshot(
          state.familySynchronization
        ),

      mandatoryCategories:
        state.mandatoryCategories.slice(),

      passedMandatoryCategories:
        state.passedMandatoryCategories.slice(),

      heldMandatoryCategories:
        state.heldMandatoryCategories.slice(),

      unavailableMandatoryCategories:
        state.unavailableMandatoryCategories.slice(),

      failedMandatoryCategories:
        state.failedMandatoryCategories.slice(),

      familySynchronizationCertified:
        Boolean(
          state.familySynchronization.complete
        ),

      exactNineClaimed:
        false,

      stationExecutionClaimed:
        false,

      interpreterTruthClaimed:
        false,

      controlsStateMutated:
        false,

      inspectionStateMutated:
        false,

      interpreterStateMutated:
        false,

      htmlStructureCreated:
        false,

      scriptOrderMutated:
        false,

      cssMutated:
        false,

      conflicts:
        immutableSnapshot(
          state.conflicts
        ),

      errors:
        immutableSnapshot(
          state.errors
        ),

      observations:
        immutableSnapshot(
          state.observations
        ),

      startedAt:
        state.startedAt,

      installationCompletedAt:
        state.installationCompletedAt,

      relationalVerifiedAt:
        state.relationalVerifiedAt,

      completedAt:
        state.completedAt
    });
  }

  function publishVerificationReceipt(state) {
    root[
      GLOBAL_RECEIPT
    ] =
      buildVerificationReceipt(
        state
      );
  }

  function copyInstallationEvidence(
    source,
    target
  ) {
    target.aliases =
      cloneValue(
        source.aliases
      );

    target.installationMutationHistory =
      cloneValue(
        source.installationMutationHistory
      );

    target.currentRunMutationMetrics =
      createRunMutationMetrics();

    target.aliasTranslationStatus =
      source.aliasTranslationStatus;

    target.installationStatus =
      source.installationStatus;

    target.installationCompletedAt =
      source.installationCompletedAt;

    target.conflicts =
      cloneValue(
        source.conflicts
      );

    target.errors =
      cloneValue(
        source.errors
      );

    target.observations =
      cloneValue(
        source.observations
      );
  }

  function verifyRelationships() {
    runSequence += 1;

    var state =
      createState(
        MODE.VERIFY,
        runSequence
      );

    copyInstallationEvidence(
      currentState,
      state
    );

    state.phase =
      PHASE.RELATIONAL_VERIFYING;

    state.relationalVerificationRun =
      true;

    state.relationalVerificationCount =
      Number(
        currentState.relationalVerificationCount || 0
      ) + 1;

    state.startedAt =
      nowIso();

    publishState(
      state
    );

    try {
      var requirements =
        observeControlsRequirements(
          state
        );

      evaluateControlsApi(
        state,
        requirements
      );

      evaluateInspectionEvidence(
        state
      );

      evaluateContracts(
        state,
        requirements
      );

      evaluateHtmlTargets(
        state,
        requirements
      );

      evaluateStationMap(
        state,
        requirements
      );

      evaluateRuntimeOrder(
        state
      );

      evaluateControlsLocalEvidence(
        state,
        requirements
      );

      evaluateCurrentRunMutationSafety(
        state
      );

      evaluateFamilySynchronization(
        state
      );

      state.relationalVerifiedAt =
        nowIso();

      state.completedAt =
        state.relationalVerifiedAt;

      deriveRelationalStatus(
        state
      );
    } catch (error) {
      recordError(
        state,
        "RELATIONAL_VERIFICATION_FAILURE",
        error
      );

      state.relationalVerifiedAt =
        nowIso();

      state.completedAt =
        state.relationalVerifiedAt;

      state.phase =
        PHASE.ERROR;

      state.relationalStatus =
        STATUS.ERROR;

      state.familySynchronizationStatus =
        STATUS.ERROR;

      state.overallStatus =
        STATUS.ERROR;
    }

    publishState(
      state
    );

    publishVerificationReceipt(
      state
    );

    return immutableSnapshot(
      state
    );
  }

  function verifyAliases() {
    runSequence += 1;

    var state =
      createState(
        MODE.VERIFY,
        runSequence
      );

    copyInstallationEvidence(
      currentState,
      state
    );

    state.phase =
      currentState.phase;

    state.relationalVerificationRun =
      currentState.relationalVerificationRun;

    state.relationalVerificationCount =
      currentState.relationalVerificationCount;

    state.startedAt =
      nowIso();

    try {
      processIdAliases(
        state,
        MODE.VERIFY
      );

      processCommandAliases(
        state,
        MODE.VERIFY
      );

      processParticipantAliases(
        state,
        MODE.VERIFY
      );

      processReceiptFilterAliases(
        state,
        MODE.VERIFY
      );

      processViewAndChamberAliases(
        state,
        MODE.VERIFY
      );

      evaluateAliasTranslation(
        state
      );

      evaluateCurrentRunMutationSafety(
        state
      );
    } catch (error) {
      recordError(
        state,
        "ALIAS_VERIFICATION_FAILURE",
        error
      );

      state.currentRunMutationMetrics.status =
        STATUS.ERROR;
    }

    state.completedAt =
      nowIso();

    publishState(
      state
    );

    return immutableSnapshot(
      state
    );
  }

  function getState() {
    return immutableSnapshot(
      currentState
    );
  }

  function getReceipt() {
    return immutableSnapshot(
      root[
        GLOBAL_RECEIPT
      ] || null
    );
  }

  function getRelationalVerdict() {
    return immutableSnapshot({
      phase:
        currentState.phase,

      status:
        currentState.overallStatus,

      relationalVerificationRun:
        currentState.relationalVerificationRun,

      relationalVerificationCount:
        currentState.relationalVerificationCount,

      familySynchronizationCertified:
        Boolean(
          currentState.familySynchronization &&
          currentState.familySynchronization.complete
        ),

      heldMandatoryCategories:
        currentState.heldMandatoryCategories.slice(),

      unavailableMandatoryCategories:
        currentState.unavailableMandatoryCategories.slice(),

      failedMandatoryCategories:
        currentState.failedMandatoryCategories.slice()
    });
  }

  function createApi() {
    var api = {
      CONTRACT:
        CONTRACT,

      contract:
        CONTRACT,

      PREVIOUS_CONTRACT:
        PREVIOUS_CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      VERSION:
        VERSION,

      version:
        VERSION,

      FILE:
        FILE,

      file:
        FILE,

      SCOPE:
        SCOPE,

      scope:
        SCOPE,

      getState:
        getState,

      getReceipt:
        getReceipt,

      getRelationalVerdict:
        getRelationalVerdict,

      verifyAliases:
        verifyAliases,

      verifyRelationships:
        verifyRelationships
    };

    Object.defineProperty(
      api,
      "phase",
      {
        enumerable:
          true,

        configurable:
          false,

        get:
          function getPhase() {
            return currentState.phase;
          }
      }
    );

    Object.defineProperty(
      api,
      "status",
      {
        enumerable:
          true,

        configurable:
          false,

        get:
          function getStatus() {
            return currentState.overallStatus;
          }
      }
    );

    Object.defineProperty(
      api,
      "STATUS",
      {
        enumerable:
          true,

        configurable:
          false,

        get:
          function getUppercaseStatus() {
            return currentState.overallStatus;
          }
      }
    );

    Object.defineProperty(
      api,
      "relationalPending",
      {
        enumerable:
          true,

        configurable:
          false,

        get:
          function getRelationalPending() {
            return (
              currentState.phase ===
              PHASE.RELATIONAL_PENDING
            );
          }
      }
    );

    Object.defineProperty(
      api,
      "familySynchronizationCertified",
      {
        enumerable:
          true,

        configurable:
          false,

        get:
          function getFamilySynchronizationCertified() {
            return Boolean(
              currentState.familySynchronization &&
              currentState.familySynchronization.complete
            );
          }
      }
    );

    return Object.freeze(
      api
    );
  }

  function publishApi() {
    var api =
      createApi();

    root[
      GLOBAL_API
    ] =
      api;

    if (
      !root.AUDRALIA ||
      typeof root.AUDRALIA !== "object"
    ) {
      root.AUDRALIA = {};
    }

    root.AUDRALIA.diagnosticControlBridge =
      api;

    root.__AUDRALIA_DIAGNOSTIC_CONTROL_BRIDGE_LOADED__ =
      true;

    root.__AUDRALIA_DIAGNOSTIC_CONTROL_BRIDGE_CONTRACT__ =
      CONTRACT;

    root.__AUDRALIA_DIAGNOSTIC_CONTROL_BRIDGE_VERSION__ =
      VERSION;

    return api;
  }

  function performInitialInstallation() {
    runSequence += 1;

    var state =
      createState(
        MODE.INSTALL,
        runSequence
      );

    state.startedAt =
      nowIso();

    state.phase =
      PHASE.INSTALLING;

    publishState(
      state
    );

    try {
      installAliases(
        state
      );

      state.installationCompletedAt =
        nowIso();

      state.completedAt =
        state.installationCompletedAt;

      deriveInstallationStatus(
        state
      );
    } catch (error) {
      recordError(
        state,
        "CONTROL_BRIDGE_INSTALLATION_FAILURE",
        error
      );

      evaluateInstallationMutationHistory(
        state
      );

      state.installationCompletedAt =
        nowIso();

      state.completedAt =
        state.installationCompletedAt;

      state.phase =
        PHASE.ERROR;

      state.installationStatus =
        STATUS.ERROR;

      state.aliasTranslationStatus =
        STATUS.ERROR;

      state.relationalStatus =
        STATUS.PENDING;

      state.familySynchronizationStatus =
        STATUS.PENDING;

      state.overallStatus =
        STATUS.ERROR;
    }

    publishState(
      state
    );

    return state;
  }

  var existing =
    root[
      GLOBAL_API
    ];

  if (
    existing &&
    (
      existing.CONTRACT === CONTRACT ||
      existing.contract === CONTRACT
    )
  ) {
    return;
  }

  // Publish the bridge authority before downstream family completion.
  publishApi();

  // Initial loading installs aliases only.
  // It does not execute downstream receipt or relational verification.
  performInitialInstallation();
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
