// /showroom/globe/audralia/diagnostic/index.control.bridge.js
// AUDRALIA_DIAGNOSTIC_THIN_CONTROL_COMPATIBILITY_BRIDGE_TNT_v6
// Full-file replacement.
//
// ROLE:
// - Translate explicitly declared lean HTML aliases into the legacy
//   attributes and IDs already consumed by index.controls.js.
// - Reject clearly nonoperational participant-alias targets.
// - Publish a minimal compatibility receipt.
// - Remain synchronous, deterministic, idempotent, and noninterpretive.
//
// AUTHORITY:
// - F3: Read explicitly declared compatibility aliases.
// - F5: Complete the corresponding legacy compatibility attributes.
//
// HTML OWNS:
// - canonical IDs and their uniqueness;
// - page structure;
// - categories;
// - audits;
// - participant inventory;
// - receipt-filter inventory;
// - report panels;
// - script declarations and physical order;
// - initial accessibility and dynamic-state values.
//
// INSPECTION OWNS:
// - canonical-ID proof;
// - duplicate-ID detection;
// - page completeness;
// - script-order proof;
// - participant discovery proof;
// - coordinated readiness.
//
// DOES NOT OWN:
// - page structure;
// - operational inventories;
// - script order;
// - whole-page proof;
// - event binding;
// - keyboard or click behavior;
// - clipboard behavior;
// - direct execution;
// - nine-cycle execution;
// - report construction;
// - interpretation;
// - archive;
// - controls-owned dynamic state;
// - CSS or presentation;
// - production mutation.

(function installAudraliaThinControlBridge(global) {
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
    "AUDRALIA_DIAGNOSTIC_THIN_CONTROL_COMPATIBILITY_BRIDGE_TNT_v6";

  var VERSION =
    "6.0.0";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.control.bridge.js";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_THIN_CONTROL_COMPATIBILITY_BRIDGE_RECEIPT_v2";

  var GLOBAL_API =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE";

  var GLOBAL_RECEIPT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE_RECEIPT";

  var DOCUMENT_READY_ATTRIBUTE =
    "data-control-bridge-ready";

  var STATUS = Object.freeze({
    READY: "READY",
    HELD: "HELD",
    ERROR: "ERROR"
  });

  var MODE = Object.freeze({
    INSTALL: "INSTALL",
    VERIFY: "VERIFY"
  });

  var VALID_REPORT_COMMANDS = Object.freeze([
    "create",
    "view",
    "copy-readable",
    "copy-packet",
    "copy-raw",
    "open-receipts",
    "open-archive",
    "reset"
  ]);

  var VALID_RECEIPT_FILTERS = Object.freeze([
    "all",
    "participant",
    "observation",
    "cycle",
    "error"
  ]);

  var INELIGIBLE_PARTICIPANT_TAGS = Object.freeze([
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

  var COMMAND_ATTRIBUTE_MAP = Object.freeze([
    Object.freeze({
      source: "data-control-command",
      target: "data-report-command"
    }),

    Object.freeze({
      source: "data-control-category",
      target: "data-report-category"
    }),

    Object.freeze({
      source: "data-control-audit",
      target: "data-report-audit"
    }),

    Object.freeze({
      source: "data-control-participant",
      target: "data-report-participant"
    }),

    Object.freeze({
      source: "data-control-chamber",
      target: "data-report-chamber"
    }),

    Object.freeze({
      source: "data-control-mode",
      target: "data-report-mode"
    }),

    Object.freeze({
      source: "data-control-source",
      target: "data-report-source"
    }),

    Object.freeze({
      source: "data-control-view-after-create",
      target: "data-report-view-after-create"
    })
  ]);

  var VIEW_ATTRIBUTE_MAP = Object.freeze([
    Object.freeze({
      source: "data-control-bridge-left-orbit",
      target: "data-left-orbit-view",
      family: "views"
    }),

    Object.freeze({
      source: "data-control-bridge-report-mode",
      target: "data-report-mode",
      family: "views"
    }),

    Object.freeze({
      source: "data-control-bridge-observation-lens",
      target: "data-observation-lens",
      family: "views"
    }),

    Object.freeze({
      source: "data-control-bridge-chamber",
      target: "data-instrument-chamber",
      family: "chambers"
    })
  ]);

  var runSequence = 0;

  var currentState =
    createState(
      MODE.INSTALL,
      0
    );

  function createAliasMetrics() {
    return {
      declared: 0,
      completed: 0,
      alreadyCompatible: 0,
      conflicts: 0,
      invalid: 0
    };
  }

  function createState(mode, sequence) {
    return {
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      mode: mode,
      sequence: sequence,

      status: STATUS.HELD,

      aliases: {
        ids: createAliasMetrics(),
        commands: createAliasMetrics(),
        participants: createAliasMetrics(),
        receiptFilters: createAliasMetrics(),
        views: createAliasMetrics(),
        chambers: createAliasMetrics()
      },

      conflicts: [],
      errors: [],

      startedAt: null,
      completedAt: null
    };
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
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
        type: "Function",
        name: value.name || "anonymous"
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
      Object.keys(value).forEach(function cloneProperty(key) {
        output[key] =
          cloneValue(
            value[key],
            nextSeen
          );
      });
    } catch (_error) {
      return {
        unreadable: true
      };
    }

    return output;
  }

  function freezeDeep(value, seen) {
    var visited =
      seen || [];

    if (
      !value ||
      (
        typeof value !== "object" &&
        typeof value !== "function"
      )
    ) {
      return value;
    }

    if (visited.indexOf(value) !== -1) {
      return value;
    }

    var nextSeen =
      visited.concat([value]);

    try {
      Object.keys(value).forEach(function freezeProperty(key) {
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
        node.getAttribute("aria-hidden"),

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

  function recordConflict(
    state,
    family,
    code,
    node,
    detail
  ) {
    state.aliases[family].conflicts += 1;

    state.conflicts.push({
      code: code,
      family: family,
      node: describeNode(node),
      detail: cloneValue(detail || {}),
      resolution:
        "HELD_FOR_HTML_COMPATIBILITY_CORRECTION"
    });
  }

  function recordInvalid(
    state,
    family,
    code,
    node,
    detail
  ) {
    state.aliases[family].invalid += 1;

    state.conflicts.push({
      code: code,
      family: family,
      node: describeNode(node),
      detail: cloneValue(detail || {}),
      resolution:
        "HELD_FOR_HTML_ALIAS_CORRECTION"
    });
  }

  function recordError(
    state,
    code,
    error
  ) {
    state.errors.push({
      code: code,

      message:
        error && error.message
          ? error.message
          : String(error),

      stack:
        error && error.stack
          ? error.stack
          : null,

      occurredAt:
        nowIso()
    });
  }

  function copyAliasAttribute(
    state,
    mode,
    family,
    node,
    sourceAttribute,
    targetAttribute
  ) {
    if (!node.hasAttribute(sourceAttribute)) {
      return;
    }

    state.aliases[family].declared += 1;

    var sourceValue =
      trimmedAttribute(
        node,
        sourceAttribute
      );

    if (!sourceValue) {
      recordInvalid(
        state,
        family,
        "EMPTY_ALIAS_VALUE",
        node,
        {
          sourceAttribute: sourceAttribute,
          targetAttribute: targetAttribute
        }
      );

      return;
    }

    if (!node.hasAttribute(targetAttribute)) {
      if (mode === MODE.INSTALL) {
        node.setAttribute(
          targetAttribute,
          sourceValue
        );

        state.aliases[family].completed += 1;
      } else {
        recordConflict(
          state,
          family,
          "LEGACY_ATTRIBUTE_MISSING",
          node,
          {
            sourceAttribute: sourceAttribute,
            sourceValue: sourceValue,
            targetAttribute: targetAttribute,
            targetValue: null
          }
        );
      }

      return;
    }

    var targetValue =
      trimmedAttribute(
        node,
        targetAttribute
      );

    if (targetValue === sourceValue) {
      state.aliases[family].alreadyCompatible += 1;
      return;
    }

    recordConflict(
      state,
      family,
      "ALIAS_VALUE_CONFLICT",
      node,
      {
        sourceAttribute: sourceAttribute,
        sourceValue: sourceValue,
        targetAttribute: targetAttribute,
        targetValue: targetValue
      }
    );
  }

  function completeOptionalAttribute(
    state,
    mode,
    family,
    node,
    attribute,
    value
  ) {
    if (node.hasAttribute(attribute)) {
      return;
    }

    if (mode === MODE.INSTALL) {
      node.setAttribute(
        attribute,
        value
      );

      state.aliases[family].completed += 1;
      return;
    }

    recordConflict(
      state,
      family,
      "AUTHORIZED_COMPATIBILITY_ATTRIBUTE_MISSING",
      node,
      {
        attribute: attribute,
        expectedDefault: value
      }
    );
  }

  function isEligibleParticipantAliasTarget(node) {
    if (
      !node ||
      node.nodeType !== 1
    ) {
      return {
        eligible: false,
        reason: "NOT_AN_ELEMENT"
      };
    }

    var tag =
      String(
        node.tagName || ""
      ).toUpperCase();

    if (
      INELIGIBLE_PARTICIPANT_TAGS.indexOf(tag) !== -1
    ) {
      return {
        eligible: false,
        reason: "INELIGIBLE_TAG",
        tag: tag
      };
    }

    if (node.hidden) {
      return {
        eligible: false,
        reason: "HIDDEN_ATTRIBUTE",
        tag: tag
      };
    }

    if (
      node.getAttribute("aria-hidden") === "true"
    ) {
      return {
        eligible: false,
        reason: "ARIA_HIDDEN",
        tag: tag
      };
    }

    return {
      eligible: true,
      reason: null,
      tag: tag
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
      state.aliases.ids.declared += 1;

      var canonicalId =
        trimmedAttribute(
          node,
          "data-control-bridge-id"
        );

      if (!canonicalId) {
        recordInvalid(
          state,
          "ids",
          "EMPTY_ID_ALIAS",
          node,
          {}
        );

        return;
      }

      var existing =
        doc.getElementById(
          canonicalId
        );

      if (
        existing &&
        existing !== node
      ) {
        recordConflict(
          state,
          "ids",
          "CANONICAL_ID_ALREADY_OWNED",
          node,
          {
            canonicalId: canonicalId,
            owner: describeNode(existing)
          }
        );

        return;
      }

      if (
        node.id &&
        node.id !== canonicalId
      ) {
        recordConflict(
          state,
          "ids",
          "NODE_ALREADY_HAS_DIFFERENT_ID",
          node,
          {
            canonicalId: canonicalId,
            existingId: node.id
          }
        );

        return;
      }

      if (node.id === canonicalId) {
        state.aliases.ids.alreadyCompatible += 1;
        return;
      }

      if (mode === MODE.INSTALL) {
        node.id =
          canonicalId;

        state.aliases.ids.completed += 1;
      } else {
        recordConflict(
          state,
          "ids",
          "CANONICAL_ID_NOT_MATERIALIZED",
          node,
          {
            canonicalId: canonicalId
          }
        );
      }
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
      var command =
        trimmedAttribute(
          node,
          "data-control-command"
        );

      if (
        VALID_REPORT_COMMANDS.indexOf(command) === -1
      ) {
        state.aliases.commands.declared += 1;

        recordInvalid(
          state,
          "commands",
          "UNSUPPORTED_REPORT_COMMAND_ALIAS",
          node,
          {
            command: command,
            allowed:
              VALID_REPORT_COMMANDS.slice()
          }
        );

        return;
      }

      COMMAND_ATTRIBUTE_MAP.forEach(function processMapping(mapping) {
        copyAliasAttribute(
          state,
          mode,
          "commands",
          node,
          mapping.source,
          mapping.target
        );
      });
    });

    [
      "runDirectCheck",
      "runNineCycle"
    ].forEach(function protectExplicitExecution(id) {
      var node =
        doc.getElementById(id);

      if (
        node &&
        (
          node.hasAttribute(
            "data-control-command"
          ) ||
          node.hasAttribute(
            "data-report-command"
          )
        )
      ) {
        recordConflict(
          state,
          "commands",
          "EXPLICIT_EXECUTION_MISCLASSIFIED_AS_REPORT_COMMAND",
          node,
          {
            id: id
          }
        );
      }
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
      state.aliases.participants.declared += 1;

      var eligibility =
        isEligibleParticipantAliasTarget(
          node
        );

      if (!eligibility.eligible) {
        recordInvalid(
          state,
          "participants",
          "INELIGIBLE_PARTICIPANT_ALIAS_TARGET",
          node,
          {
            reason: eligibility.reason,
            tag: eligibility.tag || null
          }
        );

        return;
      }

      var participantRole =
        trimmedAttribute(
          node,
          "data-control-bridge-participant"
        );

      if (!participantRole) {
        recordInvalid(
          state,
          "participants",
          "EMPTY_PARTICIPANT_ALIAS",
          node,
          {}
        );

        return;
      }

      if (!node.hasAttribute("data-participant-role")) {
        if (mode === MODE.INSTALL) {
          node.setAttribute(
            "data-participant-role",
            participantRole
          );

          state.aliases.participants.completed += 1;
        } else {
          recordConflict(
            state,
            "participants",
            "PARTICIPANT_ROLE_NOT_MATERIALIZED",
            node,
            {
              expectedRole: participantRole
            }
          );
        }
      } else {
        var observedRole =
          trimmedAttribute(
            node,
            "data-participant-role"
          );

        if (observedRole === participantRole) {
          state.aliases.participants.alreadyCompatible += 1;
        } else {
          recordConflict(
            state,
            "participants",
            "PARTICIPANT_ROLE_ALIAS_CONFLICT",
            node,
            {
              expectedRole: participantRole,
              observedRole: observedRole
            }
          );
        }
      }

      completeOptionalAttribute(
        state,
        mode,
        "participants",
        node,
        "role",
        "button"
      );

      completeOptionalAttribute(
        state,
        mode,
        "participants",
        node,
        "tabindex",
        "0"
      );

      completeOptionalAttribute(
        state,
        mode,
        "participants",
        node,
        "aria-selected",
        "false"
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
      state.aliases.receiptFilters.declared += 1;

      var filter =
        trimmedAttribute(
          node,
          "data-control-bridge-receipt-filter"
        ).toLowerCase();

      if (
        VALID_RECEIPT_FILTERS.indexOf(filter) === -1
      ) {
        recordInvalid(
          state,
          "receiptFilters",
          "UNSUPPORTED_RECEIPT_FILTER_ALIAS",
          node,
          {
            filter: filter,
            allowed:
              VALID_RECEIPT_FILTERS.slice()
          }
        );

        return;
      }

      if (!node.hasAttribute("data-receipt-filter")) {
        if (mode === MODE.INSTALL) {
          node.setAttribute(
            "data-receipt-filter",
            filter
          );

          state.aliases.receiptFilters.completed += 1;
        } else {
          recordConflict(
            state,
            "receiptFilters",
            "RECEIPT_FILTER_NOT_MATERIALIZED",
            node,
            {
              expectedFilter: filter
            }
          );
        }
      } else {
        var observedFilter =
          trimmedAttribute(
            node,
            "data-receipt-filter"
          ).toLowerCase();

        if (observedFilter === filter) {
          state.aliases.receiptFilters.alreadyCompatible += 1;
        } else {
          recordConflict(
            state,
            "receiptFilters",
            "RECEIPT_FILTER_ALIAS_CONFLICT",
            node,
            {
              expectedFilter: filter,
              observedFilter: observedFilter
            }
          );
        }
      }

      completeOptionalAttribute(
        state,
        mode,
        "receiptFilters",
        node,
        "aria-pressed",
        "false"
      );
    });
  }

  function processViewAndChamberAliases(
    state,
    mode
  ) {
    VIEW_ATTRIBUTE_MAP.forEach(function processMapping(mapping) {
      var nodes =
        Array.prototype.slice.call(
          doc.querySelectorAll(
            "[" + mapping.source + "]"
          )
        );

      nodes.forEach(function processAlias(node) {
        copyAliasAttribute(
          state,
          mode,
          mapping.family,
          node,
          mapping.source,
          mapping.target
        );
      });
    });
  }

  function deriveStatus(state) {
    if (state.errors.length > 0) {
      return STATUS.ERROR;
    }

    if (state.conflicts.length > 0) {
      return STATUS.HELD;
    }

    return STATUS.READY;
  }

  function setDocumentReadyState(status) {
    var html =
      doc.documentElement;

    if (!html) {
      return;
    }

    html.setAttribute(
      DOCUMENT_READY_ATTRIBUTE,
      status === STATUS.READY
        ? "true"
        : "false"
    );
  }

  function buildReceipt(state) {
    return freezeDeep({
      schema:
        RECEIPT_SCHEMA,

      contract:
        CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      mode:
        state.mode,

      sequence:
        state.sequence,

      status:
        state.status,

      aliases:
        immutableSnapshot(
          state.aliases
        ),

      conflicts:
        immutableSnapshot(
          state.conflicts
        ),

      errors:
        immutableSnapshot(
          state.errors
        ),

      startedAt:
        state.startedAt,

      completedAt:
        state.completedAt
    });
  }

  function publish(state) {
    currentState =
      state;

    root[GLOBAL_RECEIPT] =
      buildReceipt(
        state
      );

    setDocumentReadyState(
      state.status
    );
  }

  function run(mode) {
    runSequence += 1;

    var state =
      createState(
        mode,
        runSequence
      );

    state.startedAt =
      nowIso();

    try {
      processIdAliases(
        state,
        mode
      );

      processCommandAliases(
        state,
        mode
      );

      processParticipantAliases(
        state,
        mode
      );

      processReceiptFilterAliases(
        state,
        mode
      );

      processViewAndChamberAliases(
        state,
        mode
      );
    } catch (error) {
      recordError(
        state,
        "THIN_CONTROL_BRIDGE_FAILURE",
        error
      );
    }

    state.completedAt =
      nowIso();

    state.status =
      deriveStatus(
        state
      );

    publish(
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
      root[GLOBAL_RECEIPT] || null
    );
  }

  function createApi() {
    var api = {
      CONTRACT:
        CONTRACT,

      contract:
        CONTRACT,

      VERSION:
        VERSION,

      version:
        VERSION,

      FILE:
        FILE,

      file:
        FILE,

      getState:
        getState,

      getReceipt:
        getReceipt,

      verifyAliases:
        function verifyAliases() {
          return run(
            MODE.VERIFY
          );
        }
    };

    Object.defineProperty(
      api,
      "status",
      {
        enumerable: true,
        configurable: false,

        get: function getStatus() {
          return currentState.status;
        }
      }
    );

    Object.defineProperty(
      api,
      "STATUS",
      {
        enumerable: true,
        configurable: false,

        get: function getUppercaseStatus() {
          return currentState.status;
        }
      }
    );

    return Object.freeze(
      api
    );
  }

  var existing =
    root[GLOBAL_API];

  if (
    existing &&
    (
      existing.CONTRACT === CONTRACT ||
      existing.contract === CONTRACT
    )
  ) {
    return;
  }

  // Synchronous installation.
  // No events, deferred execution, timers, promises, observers,
  // animation frames, or page-wide diagnostics are used.
  run(
    MODE.INSTALL
  );

  var api =
    createApi();

  root[GLOBAL_API] =
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
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
