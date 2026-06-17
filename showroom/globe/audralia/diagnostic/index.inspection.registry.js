// /showroom/globe/audralia/diagnostic/index.inspection.registry.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_CHILD_TNT_v1
// Version: 1.0.0
//
// Full-file production renewal.
//
// Purpose:
// - Passively resolve the established DGB engine-subject registry.
// - Project upstream registry evidence into immutable diagnostic evidence.
// - Preserve upstream source-state provenance separately from child status.
// - Expose installation-time state plus caller-requested passive reread().
// - Provide bounded registry evidence for the future authority child and
//   existing diagnostic-engine integration.
//
// Does not:
// - mutate the upstream registry;
// - invoke upstream refresh();
// - attach or detach observers;
// - request observations;
// - execute engines;
// - install timers, polling, promises, events, or background work;
// - modify neighboring files;
// - construct the authority child;
// - create a bridge, ledger, event system, or correspondence master.

(function installAudraliaDiagnosticRegistryChild(root) {
  "use strict";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.inspection.registry.js";

  var CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_CHILD_TNT_v1";

  var VERSION = "1.0.0";

  var AUTHORITY =
    "AUDRALIA_DIAGNOSTIC_REGISTRY_PROJECTION_AUTHORITY_v1";

  var ROLE = "DIAGNOSTIC_REGISTRY_CHILD";

  var STATE_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_STATE_v1";

  var EVIDENCE_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_EVIDENCE_v1";

  var SOURCE_IDENTITY_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_SOURCE_IDENTITY_v1";

  var AUTHORITY_RECORD_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_AUTHORITY_RECORD_v1";

  var ENGINE_RECORD_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_ENGINE_RECORD_v1";

  var RELATIONSHIP_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RELATIONSHIP_v1";

  var COUNT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_COUNT_CORRESPONDENCE_v1";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RECEIPT_v1";

  var ERROR_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_ERROR_v1";

  var TRANSACTION_RESULT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_TRANSACTION_RESULT_v1";

  var INSTALLATION_CONFLICT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_INSTALLATION_CONFLICT_v1";

  var PRIMARY_API_SYMBOL =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY";

  var PRIMARY_STATE_SYMBOL =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_STATE";

  var PRIMARY_RECEIPT_SYMBOL =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RECEIPT";

  var LOADED_FLAG =
    "__AUDRALIA_DIAGNOSTIC_REGISTRY_LOADED__";

  var CONTRACT_FLAG =
    "__AUDRALIA_DIAGNOSTIC_REGISTRY_CONTRACT__";

  var VERSION_FLAG =
    "__AUDRALIA_DIAGNOSTIC_REGISTRY_VERSION__";

  var STATUS_FLAG =
    "__AUDRALIA_DIAGNOSTIC_REGISTRY_STATUS__";

  var ERROR_FLAG =
    "__AUDRALIA_DIAGNOSTIC_REGISTRY_ERROR__";

  var INSTALLATION_CONFLICT_FLAG =
    "__AUDRALIA_DIAGNOSTIC_REGISTRY_INSTALLATION_CONFLICT__";

  var SOURCE_PRIMARY_SYMBOL =
    "DGB_ENGINE_SUBJECT_REGISTRY";

  var SOURCE_COMPATIBILITY_SYMBOL =
    "DGBEngineSubjectRegistry";

  var EXPECTED_SOURCE = deepFreeze({
    contract:
      "DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2",
    version: "2.0.0",
    file: "/assets/engine/dgb.engine.subjects.js",
    registrySchema: "DGB_ENGINE_AND_AUTHORITY_REGISTRY_v2",
    authoritySchema: "DGB_ENGINE_AUTHORITY_RECORD_v1",
    engineSchema: "DGB_ENGINE_SUBJECT_RECORD_v2",
    receiptSchema: "DGB_ENGINE_REGISTRY_RECEIPT_v2",
    slotCount: 6,
    defaultEngineId: "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE"
  });

  var QUALIFYING_STATE_KEYS = {
    status: true,
    statusReason: true,
    authorityReady: true,
    validationPassed: true,
    loaded: true,
    identityMatched: true,
    selectable: true,
    reserved: true,
    governingContractMatched: true,
    runtimeStatus: true,
    availability: true,
    available: true,
    held: true,
    hold: true,
    conflict: true,
    conflicting: true,
    missing: true,
    error: true,
    ready: true,
    readiness: true
  };

  var CHILD_DERIVED_KEYS = {
    diagnosticSourceStatus: true,
    diagnosticSourceReason: true,
    projectionStatus: true,
    projectionConflicts: true,
    projectionHolds: true,
    sourceReferenceCorrespondence: true,
    sourceReferenceConflict: true,
    relationshipCorrespondence: true,
    sourceBoundariesObserved: true,
    sourceBoundariesPreserved: true,
    systemReadinessEvaluated: true,
    systemReadinessClaimed: true
  };

  var currentState = null;
  var currentReceipt = null;
  var successfulSequence = 0;
  var currentStatus = "UNKNOWN";
  var publicApi = null;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (error) {
      return String(new Date());
    }
  }

  function isObject(value) {
    return value !== null &&
      (typeof value === "object" || typeof value === "function");
  }

  function isPlainObject(value) {
    if (
      !value ||
      Object.prototype.toString.call(value) !== "[object Object]"
    ) {
      return false;
    }

    var prototype;

    try {
      prototype = Object.getPrototypeOf(value);
    } catch (error) {
      return false;
    }

    return prototype === Object.prototype || prototype === null;
  }

  function safeString(value, maximumLength) {
    var text;

    try {
      text = String(value);
    } catch (error) {
      text = "[unstringifiable]";
    }

    if (
      typeof maximumLength === "number" &&
      maximumLength >= 0 &&
      text.length > maximumLength
    ) {
      return text.slice(0, maximumLength) + "…";
    }

    return text;
  }

  function freezeShallow(value) {
    if (!isObject(value)) {
      return value;
    }

    try {
      return Object.freeze(value);
    } catch (error) {
      return value;
    }
  }

  function deepFreeze(value, seen) {
    if (!isObject(value)) {
      return value;
    }

    seen = seen || [];

    if (seen.indexOf(value) !== -1) {
      return value;
    }

    seen.push(value);

    var names;
    var index;
    var child;

    try {
      names = Object.getOwnPropertyNames(value);
    } catch (error) {
      return freezeShallow(value);
    }

    for (index = 0; index < names.length; index += 1) {
      try {
        child = value[names[index]];
        deepFreeze(child, seen);
      } catch (error) {
        // Unreadable child remains bounded by the surrounding clone.
      }
    }

    return freezeShallow(value);
  }

  function findSeenIndex(seenSources, source) {
    var index;

    for (index = 0; index < seenSources.length; index += 1) {
      if (seenSources[index] === source) {
        return index;
      }
    }

    return -1;
  }

  function cloneBounded(value, options, state, path) {
    options = options || {};

    state = state || {
      seenSources: [],
      seenPaths: [],
      depth: 0,
      nodes: 0
    };

    path = path || "$";

    var maximumDepth =
      typeof options.maximumDepth === "number"
        ? options.maximumDepth
        : 16;

    var maximumNodes =
      typeof options.maximumNodes === "number"
        ? options.maximumNodes
        : 20000;

    if (state.nodes >= maximumNodes) {
      return "[node-limit]";
    }

    state.nodes += 1;

    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean" ||
      typeof value === "undefined"
    ) {
      return value;
    }

    if (typeof value === "number") {
      if (value !== value) {
        return "[NaN]";
      }

      if (value === Infinity) {
        return "[Infinity]";
      }

      if (value === -Infinity) {
        return "[-Infinity]";
      }

      return value;
    }

    if (typeof value === "bigint") {
      return {
        type: "bigint",
        value: safeString(value, 200)
      };
    }

    if (typeof value === "symbol") {
      return {
        type: "symbol",
        description: safeString(value.description || value, 200)
      };
    }

    if (typeof value === "function") {
      return {
        type: "function",
        name: safeString(value.name || "", 200),
        length:
          typeof value.length === "number"
            ? value.length
            : null
      };
    }

    if (state.depth >= maximumDepth) {
      return "[depth-limit]";
    }

    var seenIndex = findSeenIndex(state.seenSources, value);

    if (seenIndex !== -1) {
      return {
        type: "circular-reference",
        path: state.seenPaths[seenIndex]
      };
    }

    state.seenSources.push(value);
    state.seenPaths.push(path);
    state.depth += 1;

    var result;
    var names;
    var index;
    var name;
    var descriptor;

    if (Array.isArray(value)) {
      result = [];

      for (index = 0; index < value.length; index += 1) {
        try {
          result.push(
            cloneBounded(
              value[index],
              options,
              state,
              path + "[" + index + "]"
            )
          );
        } catch (error) {
          result.push({
            type: "unreadable",
            error: safeString(error && error.message, 300)
          });
        }
      }
    } else if (value instanceof Date) {
      try {
        result = {
          type: "date",
          value: value.toISOString()
        };
      } catch (error) {
        result = {
          type: "date",
          value: safeString(value, 200)
        };
      }
    } else if (value instanceof RegExp) {
      result = {
        type: "regexp",
        value: safeString(value, 300)
      };
    } else {
      result = {};

      try {
        names = Object.getOwnPropertyNames(value);
      } catch (error) {
        names = [];
        result.__unreadableObject__ =
          safeString(error && error.message, 300);
      }

      for (index = 0; index < names.length; index += 1) {
        name = names[index];

        try {
          descriptor =
            Object.getOwnPropertyDescriptor(value, name);

          if (
            descriptor &&
            Object.prototype.hasOwnProperty.call(
              descriptor,
              "value"
            )
          ) {
            result[name] = cloneBounded(
              descriptor.value,
              options,
              state,
              path + "." + name
            );
          } else {
            result[name] = {
              type: "accessor",
              getter: Boolean(descriptor && descriptor.get),
              setter: Boolean(descriptor && descriptor.set)
            };
          }
        } catch (error) {
          result[name] = {
            type: "unreadable",
            error: safeString(error && error.message, 300)
          };
        }
      }

      if (!isPlainObject(value)) {
        try {
          result.__sourceType__ =
            value.constructor && value.constructor.name
              ? safeString(value.constructor.name, 200)
              : Object.prototype.toString.call(value);
        } catch (error) {
          result.__sourceType__ = "[unknown]";
        }
      }
    }

    state.depth -= 1;
    state.seenSources.pop();
    state.seenPaths.pop();

    return result;
  }

  function immutableClone(value) {
    return deepFreeze(cloneBounded(value));
  }

  function readProperty(object, key) {
    if (!object) {
      return {
        readable: false,
        present: false,
        value: undefined,
        error: null
      };
    }

    var present;

    try {
      present = key in object;
    } catch (error) {
      return {
        readable: false,
        present: false,
        value: undefined,
        error: error
      };
    }

    if (!present) {
      return {
        readable: true,
        present: false,
        value: undefined,
        error: null
      };
    }

    try {
      return {
        readable: true,
        present: true,
        value: object[key],
        error: null
      };
    } catch (error) {
      return {
        readable: false,
        present: true,
        value: undefined,
        error: error
      };
    }
  }

  function readFirstProperty(object, keys) {
    var index;
    var result;

    for (index = 0; index < keys.length; index += 1) {
      result = readProperty(object, keys[index]);

      if (result.present || !result.readable) {
        result.key = keys[index];
        return result;
      }
    }

    return {
      readable: true,
      present: false,
      value: undefined,
      error: null,
      key: null
    };
  }

  function safeCall(object, methodName, args) {
    var methodRead = readProperty(object, methodName);

    if (!methodRead.readable) {
      return {
        ok: false,
        present: true,
        value: undefined,
        error: methodRead.error
      };
    }

    if (
      !methodRead.present ||
      typeof methodRead.value !== "function"
    ) {
      return {
        ok: false,
        present: false,
        value: undefined,
        error: null
      };
    }

    try {
      return {
        ok: true,
        present: true,
        value: methodRead.value.apply(object, args || []),
        error: null
      };
    } catch (error) {
      return {
        ok: false,
        present: true,
        value: undefined,
        error: error
      };
    }
  }

  function normalizeArray(value) {
    if (Array.isArray(value)) {
      return value.slice();
    }

    if (value === null || value === undefined) {
      return [];
    }

    if (isPlainObject(value)) {
      return Object.keys(value).map(function mapKey(key) {
        return value[key];
      });
    }

    return [];
  }

  function valuesCorrespond(expected, observed) {
    return (
      observed !== undefined &&
      observed !== null &&
      expected === observed
    );
  }

  function boundedError(
    error,
    action,
    code,
    sourceAlias,
    additions
  ) {
    var result = {
      schema: ERROR_SCHEMA,
      action: action || "unknown",
      code: code || "UNKNOWN_ERROR",
      message: safeString(
        error && error.message !== undefined
          ? error.message
          : error,
        500
      ),
      stack: safeString(
        error && error.stack ? error.stack : "",
        2000
      ),
      sourceAlias: sourceAlias || null,
      occurredAt: nowIso()
    };

    var key;

    if (additions && typeof additions === "object") {
      for (key in additions) {
        if (
          Object.prototype.hasOwnProperty.call(
            additions,
            key
          )
        ) {
          result[key] = cloneBounded(additions[key]);
        }
      }
    }

    return deepFreeze(result);
  }

  function makeConflict(
    code,
    field,
    expected,
    observed,
    source,
    detail
  ) {
    return deepFreeze({
      code: code,
      field: field,
      expected: cloneBounded(expected),
      observed: cloneBounded(observed),
      source: source || null,
      detail: safeString(detail || "", 500),
      observedAt: nowIso()
    });
  }

  function makeHold(
    code,
    field,
    reason,
    requiredEvidence,
    availableEvidence,
    detail
  ) {
    return deepFreeze({
      code: code,
      field: field,
      reason: reason,
      requiredEvidence: cloneBounded(requiredEvidence),
      availableEvidence: cloneBounded(availableEvidence),
      detail: safeString(detail || "", 500),
      observedAt: nowIso()
    });
  }

  function makeAbsence(
    code,
    field,
    missingSource,
    detail
  ) {
    return deepFreeze({
      code: code,
      field: field,
      missingSource: missingSource || null,
      detail: safeString(detail || "", 500),
      observedAt: nowIso()
    });
  }

  function createProvenanceTracker() {
    return {
      copied: false,
      fields: []
    };
  }

  function isPrimitiveStateValue(value) {
    return (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    );
  }

  function isQualifyingStateKey(key) {
    if (CHILD_DERIVED_KEYS[key]) {
      return false;
    }

    if (QUALIFYING_STATE_KEYS[key]) {
      return true;
    }

    var lower = String(key || "").toLowerCase();

    if (
      lower.indexOf("diagnostic") !== -1 ||
      lower.indexOf("projection") !== -1
    ) {
      return false;
    }

    return (
      lower.indexOf("status") !== -1 ||
      lower.indexOf("ready") !== -1 ||
      lower.indexOf("readiness") !== -1 ||
      lower.indexOf("loaded") !== -1 ||
      lower.indexOf("selectable") !== -1 ||
      lower.indexOf("reserved") !== -1 ||
      lower.indexOf("availability") !== -1 ||
      lower.indexOf("available") !== -1 ||
      lower.indexOf("conflict") !== -1 ||
      lower.indexOf("hold") !== -1 ||
      lower.indexOf("missing") !== -1 ||
      lower.indexOf("error") !== -1
    );
  }

  function recordProvenance(
    tracker,
    sourceContainer,
    sourcePath,
    sourceField,
    targetPath
  ) {
    tracker.copied = true;

    tracker.fields.push({
      sourceContainer: sourceContainer || null,
      sourcePath: sourcePath || null,
      sourceField: sourceField || null,
      targetPath: targetPath || null,
      targetField: targetPath || null
    });
  }

  function scanNestedSourceState(
    value,
    sourceContainer,
    sourcePath,
    targetPath,
    tracker,
    seen,
    depth
  ) {
    if (!isObject(value) || typeof value === "function") {
      return false;
    }

    seen = seen || [];
    depth = typeof depth === "number" ? depth : 0;

    if (depth > 16 || seen.indexOf(value) !== -1) {
      return false;
    }

    seen.push(value);

    var names;
    var index;
    var name;
    var descriptor;
    var child;
    var childSourcePath;
    var childTargetPath;
    var descendantQualified = false;

    try {
      names = Object.getOwnPropertyNames(value);
    } catch (error) {
      seen.pop();
      return false;
    }

    for (index = 0; index < names.length; index += 1) {
      name = names[index];

      childSourcePath =
        sourcePath +
        (Array.isArray(value)
          ? "[" + name + "]"
          : "." + name);

      childTargetPath =
        targetPath +
        (Array.isArray(value)
          ? "[" + name + "]"
          : "." + name);

      try {
        descriptor =
          Object.getOwnPropertyDescriptor(value, name);
      } catch (error) {
        continue;
      }

      if (
        !descriptor ||
        !Object.prototype.hasOwnProperty.call(
          descriptor,
          "value"
        )
      ) {
        continue;
      }

      child = descriptor.value;

      if (
        isQualifyingStateKey(name) &&
        isPrimitiveStateValue(child)
      ) {
        recordProvenance(
          tracker,
          sourceContainer,
          childSourcePath,
          name,
          childTargetPath
        );

        descendantQualified = true;
      }

      if (
        isObject(child) &&
        typeof child !== "function"
      ) {
        if (
          scanNestedSourceState(
            child,
            sourceContainer,
            childSourcePath,
            childTargetPath,
            tracker,
            seen,
            depth + 1
          )
        ) {
          descendantQualified = true;
        }
      }
    }

    seen.pop();

    return descendantQualified;
  }

  function copyUpstreamField(
    source,
    key,
    target,
    targetKey,
    tracker,
    sourceContainer,
    sourcePath,
    targetPath
  ) {
    var result = readProperty(source, key);

    if (!result.readable) {
      return {
        copied: false,
        present: true,
        error: result.error
      };
    }

    if (!result.present) {
      return {
        copied: false,
        present: false,
        error: null
      };
    }

    target[targetKey || key] = cloneBounded(result.value);

    if (
      isQualifyingStateKey(key) &&
      isPrimitiveStateValue(result.value)
    ) {
      recordProvenance(
        tracker,
        sourceContainer,
        sourcePath,
        key,
        targetPath
      );
    }

    if (
      isObject(result.value) &&
      typeof result.value !== "function"
    ) {
      scanNestedSourceState(
        result.value,
        sourceContainer,
        sourcePath,
        targetPath,
        tracker
      );
    }

    return {
      copied: true,
      present: true,
      value: result.value,
      error: null
    };
  }

  function readStaticValue(source, key) {
    var result = readProperty(source, key);

    return result.readable && result.present
      ? result.value
      : undefined;
  }

  function resolveSource() {
    var primaryRead =
      readProperty(root, SOURCE_PRIMARY_SYMBOL);

    var compatibilityRead =
      readProperty(root, SOURCE_COMPATIBILITY_SYMBOL);

    var primary =
      primaryRead.readable && primaryRead.present
        ? primaryRead.value
        : null;

    var compatibility =
      compatibilityRead.readable &&
      compatibilityRead.present
        ? compatibilityRead.value
        : null;

    var result = {
      primaryObserved: Boolean(primary),
      compatibilityObserved: Boolean(compatibility),
      primaryReadError: primaryRead.error || null,
      compatibilityReadError:
        compatibilityRead.error || null,
      sourceAlias: null,
      source: null,
      sourceReferenceCorrespondence: null,
      sourceReferenceConflict: false
    };

    if (!primary && !compatibility) {
      return result;
    }

    if (primary && compatibility) {
      if (primary === compatibility) {
        result.sourceAlias = SOURCE_PRIMARY_SYMBOL;
        result.source = primary;
        result.sourceReferenceCorrespondence = true;
      } else {
        result.sourceReferenceCorrespondence = false;
        result.sourceReferenceConflict = true;
      }

      return result;
    }

    if (primary) {
      result.sourceAlias = SOURCE_PRIMARY_SYMBOL;
      result.source = primary;
      return result;
    }

    result.sourceAlias = SOURCE_COMPATIBILITY_SYMBOL;
    result.source = compatibility;

    return result;
  }

  function inspectApiShape(source) {
    var mandatoryMethods = [
      "getSnapshot",
      "getRegistryReceipt",
      "listAuthorities",
      "listEngines",
      "getSelectableEngines",
      "getReservedSlots"
    ];

    var mandatoryFields = [
      "CONTRACT",
      "VERSION",
      "FILE",
      "SCHEMA",
      "AUTHORITY_SCHEMA",
      "ENGINE_SCHEMA",
      "RECEIPT_SCHEMA",
      "SLOT_COUNT",
      "DEFAULT_ENGINE_ID"
    ];

    var optionalFields = [
      "OBSERVATION_SCHEMA",
      "STATUS",
      "ROLE"
    ];

    var shape = {
      mandatoryMethods: {},
      mandatoryFields: {},
      optionalFields: {},
      complete: true
    };

    var index;
    var read;

    for (
      index = 0;
      index < mandatoryMethods.length;
      index += 1
    ) {
      read = readProperty(source, mandatoryMethods[index]);

      shape.mandatoryMethods[mandatoryMethods[index]] = {
        present: read.present,
        readable: read.readable,
        callable:
          read.readable &&
          read.present &&
          typeof read.value === "function"
      };

      if (
        !shape.mandatoryMethods[
          mandatoryMethods[index]
        ].callable
      ) {
        shape.complete = false;
      }
    }

    for (
      index = 0;
      index < mandatoryFields.length;
      index += 1
    ) {
      read = readProperty(source, mandatoryFields[index]);

      shape.mandatoryFields[mandatoryFields[index]] = {
        present: read.present,
        readable: read.readable
      };

      if (!read.present || !read.readable) {
        shape.complete = false;
      }
    }

    for (
      index = 0;
      index < optionalFields.length;
      index += 1
    ) {
      read = readProperty(source, optionalFields[index]);

      shape.optionalFields[optionalFields[index]] = {
        present: read.present,
        readable: read.readable
      };
    }

    return deepFreeze(shape);
  }

  function buildSourceIdentity(resolution, source) {
    var observedContract =
      readStaticValue(source, "CONTRACT");

    var observedVersion =
      readStaticValue(source, "VERSION");

    var observedFile =
      readStaticValue(source, "FILE");

    var observedRegistrySchema =
      readStaticValue(source, "SCHEMA");

    var observedAuthoritySchema =
      readStaticValue(source, "AUTHORITY_SCHEMA");

    var observedEngineSchema =
      readStaticValue(source, "ENGINE_SCHEMA");

    var observedReceiptSchema =
      readStaticValue(source, "RECEIPT_SCHEMA");

    var observedSlotCount =
      readStaticValue(source, "SLOT_COUNT");

    var observedDefaultEngineId =
      readStaticValue(source, "DEFAULT_ENGINE_ID");

    return deepFreeze({
      schema: SOURCE_IDENTITY_SCHEMA,

      primaryAlias: SOURCE_PRIMARY_SYMBOL,
      compatibilityAlias:
        SOURCE_COMPATIBILITY_SYMBOL,

      primaryObserved:
        resolution.primaryObserved,

      compatibilityObserved:
        resolution.compatibilityObserved,

      sourceAlias:
        resolution.sourceAlias,

      sourceReferenceCorrespondence:
        resolution.sourceReferenceCorrespondence,

      sourceReferenceConflict:
        resolution.sourceReferenceConflict,

      expectedContract:
        EXPECTED_SOURCE.contract,

      observedContract:
        cloneBounded(observedContract),

      contractCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.contract,
          observedContract
        ),

      expectedVersion:
        EXPECTED_SOURCE.version,

      observedVersion:
        cloneBounded(observedVersion),

      versionCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.version,
          observedVersion
        ),

      expectedFile:
        EXPECTED_SOURCE.file,

      observedFile:
        cloneBounded(observedFile),

      fileCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.file,
          observedFile
        ),

      expectedRegistrySchema:
        EXPECTED_SOURCE.registrySchema,

      observedRegistrySchema:
        cloneBounded(observedRegistrySchema),

      registrySchemaCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.registrySchema,
          observedRegistrySchema
        ),

      expectedAuthoritySchema:
        EXPECTED_SOURCE.authoritySchema,

      observedAuthoritySchema:
        cloneBounded(observedAuthoritySchema),

      authoritySchemaCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.authoritySchema,
          observedAuthoritySchema
        ),

      expectedEngineSchema:
        EXPECTED_SOURCE.engineSchema,

      observedEngineSchema:
        cloneBounded(observedEngineSchema),

      engineSchemaCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.engineSchema,
          observedEngineSchema
        ),

      expectedReceiptSchema:
        EXPECTED_SOURCE.receiptSchema,

      observedReceiptSchema:
        cloneBounded(observedReceiptSchema),

      receiptSchemaCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.receiptSchema,
          observedReceiptSchema
        ),

      expectedSlotCount:
        EXPECTED_SOURCE.slotCount,

      observedSlotCount:
        cloneBounded(observedSlotCount),

      slotCountCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.slotCount,
          observedSlotCount
        ),

      expectedDefaultEngineId:
        EXPECTED_SOURCE.defaultEngineId,

      observedDefaultEngineId:
        cloneBounded(observedDefaultEngineId),

      defaultEngineCorrespondence:
        valuesCorrespond(
          EXPECTED_SOURCE.defaultEngineId,
          observedDefaultEngineId
        )
    });
  }

  function collectIdentityConflicts(
    sourceIdentity,
    conflicts
  ) {
    var checks = [
      [
        "SOURCE_CONTRACT_CONFLICT",
        "contract",
        sourceIdentity.expectedContract,
        sourceIdentity.observedContract,
        sourceIdentity.contractCorrespondence
      ],
      [
        "SOURCE_VERSION_CONFLICT",
        "version",
        sourceIdentity.expectedVersion,
        sourceIdentity.observedVersion,
        sourceIdentity.versionCorrespondence
      ],
      [
        "SOURCE_FILE_CONFLICT",
        "file",
        sourceIdentity.expectedFile,
        sourceIdentity.observedFile,
        sourceIdentity.fileCorrespondence
      ],
      [
        "REGISTRY_SCHEMA_CONFLICT",
        "schema",
        sourceIdentity.expectedRegistrySchema,
        sourceIdentity.observedRegistrySchema,
        sourceIdentity.registrySchemaCorrespondence
      ],
      [
        "AUTHORITY_SCHEMA_CONFLICT",
        "authoritySchema",
        sourceIdentity.expectedAuthoritySchema,
        sourceIdentity.observedAuthoritySchema,
        sourceIdentity.authoritySchemaCorrespondence
      ],
      [
        "ENGINE_SCHEMA_CONFLICT",
        "engineSchema",
        sourceIdentity.expectedEngineSchema,
        sourceIdentity.observedEngineSchema,
        sourceIdentity.engineSchemaCorrespondence
      ],
      [
        "RECEIPT_SCHEMA_CONFLICT",
        "receiptSchema",
        sourceIdentity.expectedReceiptSchema,
        sourceIdentity.observedReceiptSchema,
        sourceIdentity.receiptSchemaCorrespondence
      ]
    ];

    var index;
    var check;

    for (index = 0; index < checks.length; index += 1) {
      check = checks[index];

      if (check[4] !== true) {
        conflicts.push(
          makeConflict(
            check[0],
            check[1],
            check[2],
            check[3],
            sourceIdentity.sourceAlias,
            "Observed upstream source identity does not correspond."
          )
        );
      }
    }
  }

  function pushUniqueRecord(
    list,
    record,
    identityKey,
    conflicts,
    code
  ) {
    var identity =
      record ? record[identityKey] : null;

    var index;

    if (
      identity === null ||
      identity === undefined ||
      identity === ""
    ) {
      list.push(record);
      return;
    }

    for (index = 0; index < list.length; index += 1) {
      if (
        list[index] &&
        list[index][identityKey] === identity
      ) {
        conflicts.push(
          makeConflict(
            code,
            identityKey,
            "unique",
            identity,
            "UPSTREAM_PROJECTION",
            "Duplicate projected identity."
          )
        );

        return;
      }
    }

    list.push(record);
  }

  function projectAuthorityRecord(
    sourceRecord,
    tracker,
    conflicts,
    holds,
    index
  ) {
    sourceRecord = sourceRecord || {};

    var target = {
      schema: AUTHORITY_RECORD_SCHEMA,
      sourceSchema: null,
      authorityId: null,
      authorityName: null,
      role: null,
      executableEngine: null,
      file: null,
      contract: null,
      version: null,
      modelSchema: null,
      globals: null,
      loaded: null,
      identityMatched: null,
      validationPassed: null,
      authorityReady: null,
      status: null,
      statusReason: null,
      governsEngineIds: [],
      boundaries: null,
      upstreamReceiptPresent: false,
      upstreamValidationPresent: false,
      upstreamReceipt: null,
      upstreamValidation: null,
      projectionStatus: "UNKNOWN",
      projectionConflicts: [],
      projectionHolds: []
    };

    var fields = [
      "schema",
      "authorityId",
      "authorityName",
      "role",
      "executableEngine",
      "file",
      "contract",
      "version",
      "modelSchema",
      "globals",
      "loaded",
      "identityMatched",
      "validationPassed",
      "authorityReady",
      "status",
      "statusReason",
      "governsEngineIds",
      "boundaries"
    ];

    var fieldIndex;
    var key;
    var result;
    var targetKey;

    for (
      fieldIndex = 0;
      fieldIndex < fields.length;
      fieldIndex += 1
    ) {
      key = fields[fieldIndex];
      targetKey =
        key === "schema" ? "sourceSchema" : key;

      result = copyUpstreamField(
        sourceRecord,
        key,
        target,
        targetKey,
        tracker,
        "authorityRecords",
        "authorityRecords[" + index + "]." + key,
        "authorityRecords[" + index + "]." + targetKey
      );

      if (result.error) {
        target.projectionHolds.push(
          makeHold(
            "AUTHORITY_FIELD_UNREADABLE",
            key,
            "SOURCE_PROPERTY_READ_ERROR",
            key,
            null,
            safeString(
              result.error &&
              result.error.message,
              300
            )
          )
        );
      }
    }

    var receiptRead =
      readFirstProperty(sourceRecord, [
        "receipt",
        "authorityReceipt",
        "runtimeReceipt"
      ]);

    if (
      receiptRead.readable &&
      receiptRead.present
    ) {
      target.upstreamReceiptPresent = true;
      target.upstreamReceipt =
        cloneBounded(receiptRead.value);

      scanNestedSourceState(
        receiptRead.value,
        "authorityRecords",
        "authorityRecords[" +
          index +
          "]." +
          receiptRead.key,
        "authorityRecords[" +
          index +
          "].upstreamReceipt",
        tracker
      );
    } else if (!receiptRead.readable) {
      target.projectionHolds.push(
        makeHold(
          "AUTHORITY_RECEIPT_UNREADABLE",
          receiptRead.key || "receipt",
          "SOURCE_PROPERTY_READ_ERROR",
          "readable authority receipt",
          null,
          safeString(
            receiptRead.error &&
            receiptRead.error.message,
            300
          )
        )
      );
    }

    var validationRead =
      readFirstProperty(sourceRecord, [
        "validation",
        "validationRecord",
        "validationReceipt"
      ]);

    if (
      validationRead.readable &&
      validationRead.present
    ) {
      target.upstreamValidationPresent = true;
      target.upstreamValidation =
        cloneBounded(validationRead.value);

      scanNestedSourceState(
        validationRead.value,
        "authorityRecords",
        "authorityRecords[" +
          index +
          "]." +
          validationRead.key,
        "authorityRecords[" +
          index +
          "].upstreamValidation",
        tracker
      );
    } else if (!validationRead.readable) {
      target.projectionHolds.push(
        makeHold(
          "AUTHORITY_VALIDATION_UNREADABLE",
          validationRead.key || "validation",
          "SOURCE_PROPERTY_READ_ERROR",
          "readable authority validation",
          null,
          safeString(
            validationRead.error &&
            validationRead.error.message,
            300
          )
        )
      );
    }

    if (!target.authorityId) {
      target.projectionHolds.push(
        makeHold(
          "AUTHORITY_ID_MISSING",
          "authorityId",
          "AUTHORITY_ID_REQUIRED",
          "authorityId",
          null,
          "Authority record cannot be identified without invention."
        )
      );
    }

    if (target.projectionConflicts.length > 0) {
      target.projectionStatus = "CONFLICT";
    } else if (target.projectionHolds.length > 0) {
      target.projectionStatus = "HELD";
    } else {
      target.projectionStatus = "AVAILABLE";
    }

    Array.prototype.push.apply(
      conflicts,
      target.projectionConflicts
    );

    Array.prototype.push.apply(
      holds,
      target.projectionHolds
    );

    return deepFreeze(target);
  }

  function projectEngineRecord(
    sourceRecord,
    tracker,
    conflicts,
    holds,
    index
  ) {
    sourceRecord = sourceRecord || {};

    var target = {
      schema: ENGINE_RECORD_SCHEMA,
      sourceSchema: null,
      slot: null,
      engineId: null,
      engineName: null,
      role: null,
      reserved: null,
      reservedEvidenceReadable: true,
      reservedEvidencePresent: false,
      selectable: null,
      defaultEngine: null,
      file: null,
      contract: null,
      version: null,
      globalNames: null,
      governingAuthorityId: null,
      governingContract: null,
      governingContractFile: null,
      modelSchema: null,
      loaded: null,
      identityMatched: null,
      governingContractMatched: null,
      quietLoadExpected: null,
      f13InheritedConditionally: null,
      f21Claimed: null,
      status: null,
      statusReason: null,
      runtimeStatus: null,
      runtimeReceipt: null,
      inspection: null,
      observer: null,
      capabilities: null,
      boundaries: null,
      projectionClass: null,
      projectionStatus: "UNKNOWN",
      projectionConflicts: [],
      projectionHolds: []
    };

    var reservedRead =
      readProperty(sourceRecord, "reserved");

    target.reservedEvidenceReadable =
      reservedRead.readable;

    target.reservedEvidencePresent =
      reservedRead.present;

    if (
      reservedRead.readable &&
      reservedRead.present
    ) {
      target.reserved =
        cloneBounded(reservedRead.value);

      if (typeof reservedRead.value === "boolean") {
        recordProvenance(
          tracker,
          "engineRecords",
          "engineRecords[" + index + "].reserved",
          "reserved",
          "engineRecords[" + index + "].reserved"
        );
      }
    }

    var fields = [
      "schema",
      "slot",
      "engineId",
      "engineName",
      "role",
      "selectable",
      "defaultEngine",
      "file",
      "contract",
      "version",
      "globalNames",
      "governingAuthorityId",
      "governingContract",
      "governingContractFile",
      "modelSchema",
      "loaded",
      "identityMatched",
      "governingContractMatched",
      "quietLoadExpected",
      "f13InheritedConditionally",
      "f21Claimed",
      "status",
      "statusReason",
      "runtimeStatus",
      "runtimeReceipt",
      "inspection",
      "observer",
      "capabilities",
      "boundaries"
    ];

    var fieldIndex;
    var key;
    var targetKey;
    var result;

    for (
      fieldIndex = 0;
      fieldIndex < fields.length;
      fieldIndex += 1
    ) {
      key = fields[fieldIndex];
      targetKey =
        key === "schema" ? "sourceSchema" : key;

      result = copyUpstreamField(
        sourceRecord,
        key,
        target,
        targetKey,
        tracker,
        "engineRecords",
        "engineRecords[" + index + "]." + key,
        "engineRecords[" + index + "]." + targetKey
      );

      if (result.error) {
        target.projectionHolds.push(
          makeHold(
            "ENGINE_FIELD_UNREADABLE",
            key,
            "SOURCE_PROPERTY_READ_ERROR",
            key,
            null,
            safeString(
              result.error &&
              result.error.message,
              300
            )
          )
        );
      }
    }

    if (
      !reservedRead.readable ||
      !reservedRead.present ||
      typeof reservedRead.value !== "boolean"
    ) {
      target.projectionClass =
        "UNCLASSIFIED_ENGINE_RECORD";

      target.projectionHolds.push(
        makeHold(
          "ENGINE_RESERVATION_STATE_UNKNOWN",
          "reserved",
          "BOOLEAN_RESERVATION_STATE_REQUIRED",
          "reserved === true or reserved === false",
          reservedRead.readable &&
          reservedRead.present
            ? cloneBounded(reservedRead.value)
            : "unavailable",
          "Engine record is preserved but not positively classified."
        )
      );
    } else if (reservedRead.value === true) {
      target.projectionClass =
        "RESERVED_SLOT";

      if (target.selectable === true) {
        target.projectionConflicts.push(
          makeConflict(
            "RESERVED_SELECTABLE_CONFLICT",
            "selectable",
            false,
            true,
            "UPSTREAM_ENGINE_RECORD",
            "Reserved slots must not be selectable."
          )
        );
      }
    } else if (target.selectable === true) {
      target.projectionClass =
        "SELECTABLE_ENGINE";
    } else {
      target.projectionClass =
        "ASSIGNED_ENGINE";
    }

    if (
      target.projectionClass !== "RESERVED_SLOT" &&
      target.projectionClass !==
        "UNCLASSIFIED_ENGINE_RECORD" &&
      !target.engineId
    ) {
      target.projectionHolds.push(
        makeHold(
          "ENGINE_ID_MISSING",
          "engineId",
          "ASSIGNED_ENGINE_ID_REQUIRED",
          "engineId",
          null,
          "Assigned engine identity cannot be invented."
        )
      );
    }

    if (target.projectionConflicts.length > 0) {
      target.projectionStatus = "CONFLICT";
    } else if (target.projectionHolds.length > 0) {
      target.projectionStatus = "HELD";
    } else {
      target.projectionStatus = "AVAILABLE";
    }

    Array.prototype.push.apply(
      conflicts,
      target.projectionConflicts
    );

    Array.prototype.push.apply(
      holds,
      target.projectionHolds
    );

    return deepFreeze(target);
  }

  function findProjectedRecordByField(
    records,
    field,
    value
  ) {
    var index;

    for (index = 0; index < records.length; index += 1) {
      if (
        records[index] &&
        records[index][field] === value
      ) {
        return records[index];
      }
    }

    return null;
  }

  function readRawIdentity(record) {
    var engineIdRead =
      readProperty(record, "engineId");

    var slotRead =
      readProperty(record, "slot");

    var selectableRead =
      readProperty(record, "selectable");

    var reservedRead =
      readProperty(record, "reserved");

    return {
      engineId:
        engineIdRead.readable &&
        engineIdRead.present
          ? engineIdRead.value
          : undefined,

      slot:
        slotRead.readable &&
        slotRead.present
          ? slotRead.value
          : undefined,

      selectable:
        selectableRead.readable &&
        selectableRead.present
          ? selectableRead.value
          : undefined,

      reserved:
        reservedRead.readable &&
        reservedRead.present
          ? reservedRead.value
          : undefined,

      readable:
        engineIdRead.readable &&
        slotRead.readable &&
        selectableRead.readable &&
        reservedRead.readable
    };
  }

  function locateProjectedRecord(
    projectedRecords,
    rawRecord
  ) {
    var identity = readRawIdentity(rawRecord);

    if (
      identity.engineId !== undefined &&
      identity.engineId !== null &&
      identity.engineId !== ""
    ) {
      return findProjectedRecordByField(
        projectedRecords,
        "engineId",
        identity.engineId
      );
    }

    if (
      identity.slot !== undefined &&
      identity.slot !== null
    ) {
      return findProjectedRecordByField(
        projectedRecords,
        "slot",
        identity.slot
      );
    }

    return null;
  }

  function locateRawRecord(
    rawRecords,
    projectedRecord
  ) {
    var index;
    var identity;

    for (index = 0; index < rawRecords.length; index += 1) {
      identity = readRawIdentity(rawRecords[index]);

      if (
        projectedRecord.engineId !== null &&
        projectedRecord.engineId !== undefined &&
        projectedRecord.engineId !== "" &&
        identity.engineId === projectedRecord.engineId
      ) {
        return rawRecords[index];
      }

      if (
        projectedRecord.slot !== null &&
        projectedRecord.slot !== undefined &&
        identity.slot === projectedRecord.slot
      ) {
        return rawRecords[index];
      }
    }

    return null;
  }

  function classificationCorresponds(
    projected,
    rawRecord,
    fields
  ) {
    var identity = readRawIdentity(rawRecord);
    var index;
    var field;

    if (!identity.readable) {
      return false;
    }

    for (index = 0; index < fields.length; index += 1) {
      field = fields[index];

      if (
        identity[field] !== undefined &&
        projected[field] !== identity[field]
      ) {
        return false;
      }
    }

    return true;
  }

  function verifyRecordClassification(
    allProjectedEngines,
    selectableSource,
    reservedSource,
    conflicts,
    holds
  ) {
    var index;
    var rawRecord;
    var projectedRecord;
    var identity;

    for (
      index = 0;
      index < selectableSource.length;
      index += 1
    ) {
      rawRecord = selectableSource[index] || {};
      identity = readRawIdentity(rawRecord);

      if (!identity.readable) {
        holds.push(
          makeHold(
            "SELECTABLE_RECORD_UNREADABLE",
            "selectableEngine",
            "SOURCE_PROPERTY_READ_ERROR",
            "readable classification fields",
            identity,
            "Selectable source record could not be read safely."
          )
        );

        continue;
      }

      projectedRecord = locateProjectedRecord(
        allProjectedEngines,
        rawRecord
      );

      if (!projectedRecord) {
        conflicts.push(
          makeConflict(
            "SELECTABLE_RECORD_NOT_IN_ENGINE_SET",
            "selectableEngine",
            "record in all-engine set",
            identity,
            "getSelectableEngines",
            "Selectable source record does not correspond to listEngines()."
          )
        );

        continue;
      }

      if (
        !classificationCorresponds(
          projectedRecord,
          rawRecord,
          [
            "engineId",
            "slot",
            "selectable",
            "reserved"
          ]
        )
      ) {
        conflicts.push(
          makeConflict(
            "SELECTABLE_RECORD_CLASSIFICATION_CONFLICT",
            "selectableEngine",
            {
              engineId: projectedRecord.engineId,
              slot: projectedRecord.slot,
              selectable: projectedRecord.selectable,
              reserved: projectedRecord.reserved
            },
            identity,
            "getSelectableEngines",
            "Selectable list record contradicts the all-engine record."
          )
        );
      }
    }

    for (
      index = 0;
      index < allProjectedEngines.length;
      index += 1
    ) {
      projectedRecord = allProjectedEngines[index];

      if (projectedRecord.selectable === true) {
        rawRecord = locateRawRecord(
          selectableSource,
          projectedRecord
        );

        if (!rawRecord) {
          conflicts.push(
            makeConflict(
              "SELECTABLE_ENGINE_MISSING_FROM_SELECTABLE_SET",
              "selectableEngine",
              {
                engineId: projectedRecord.engineId,
                slot: projectedRecord.slot,
                selectable: true,
                reserved: projectedRecord.reserved
              },
              "missing",
              "listEngines",
              "An all-engine record marked selectable is absent from getSelectableEngines()."
            )
          );
        } else if (
          !classificationCorresponds(
            projectedRecord,
            rawRecord,
            [
              "engineId",
              "slot",
              "selectable",
              "reserved"
            ]
          )
        ) {
          conflicts.push(
            makeConflict(
              "SELECTABLE_RECORD_CLASSIFICATION_CONFLICT",
              "selectableEngine",
              {
                engineId: projectedRecord.engineId,
                slot: projectedRecord.slot,
                selectable: projectedRecord.selectable,
                reserved: projectedRecord.reserved
              },
              readRawIdentity(rawRecord),
              "listEngines|getSelectableEngines",
              "Selectable records disagree across upstream list surfaces."
            )
          );
        }
      }
    }

    for (
      index = 0;
      index < reservedSource.length;
      index += 1
    ) {
      rawRecord = reservedSource[index] || {};
      identity = readRawIdentity(rawRecord);

      if (!identity.readable) {
        holds.push(
          makeHold(
            "RESERVED_RECORD_UNREADABLE",
            "reservedEngine",
            "SOURCE_PROPERTY_READ_ERROR",
            "readable classification fields",
            identity,
            "Reserved source record could not be read safely."
          )
        );

        continue;
      }

      projectedRecord = locateProjectedRecord(
        allProjectedEngines,
        rawRecord
      );

      if (!projectedRecord) {
        conflicts.push(
          makeConflict(
            "RESERVED_RECORD_NOT_IN_ENGINE_SET",
            "reservedEngine",
            "record in all-engine set",
            identity,
            "getReservedSlots",
            "Reserved source record does not correspond to listEngines()."
          )
        );

        continue;
      }

      if (
        !classificationCorresponds(
          projectedRecord,
          rawRecord,
          [
            "engineId",
            "slot",
            "reserved",
            "selectable"
          ]
        )
      ) {
        conflicts.push(
          makeConflict(
            "RESERVED_RECORD_CLASSIFICATION_CONFLICT",
            "reservedEngine",
            {
              engineId: projectedRecord.engineId,
              slot: projectedRecord.slot,
              reserved: projectedRecord.reserved,
              selectable: projectedRecord.selectable
            },
            identity,
            "getReservedSlots",
            "Reserved list record contradicts the all-engine record."
          )
        );
      }
    }

    for (
      index = 0;
      index < allProjectedEngines.length;
      index += 1
    ) {
      projectedRecord = allProjectedEngines[index];

      if (projectedRecord.reserved === true) {
        rawRecord = locateRawRecord(
          reservedSource,
          projectedRecord
        );

        if (!rawRecord) {
          conflicts.push(
            makeConflict(
              "RESERVED_ENGINE_MISSING_FROM_RESERVED_SET",
              "reservedEngine",
              {
                engineId: projectedRecord.engineId,
                slot: projectedRecord.slot,
                reserved: true,
                selectable: projectedRecord.selectable
              },
              "missing",
              "listEngines",
              "An all-engine record marked reserved is absent from getReservedSlots()."
            )
          );
        } else if (
          !classificationCorresponds(
            projectedRecord,
            rawRecord,
            [
              "engineId",
              "slot",
              "reserved",
              "selectable"
            ]
          )
        ) {
          conflicts.push(
            makeConflict(
              "RESERVED_RECORD_CLASSIFICATION_CONFLICT",
              "reservedEngine",
              {
                engineId: projectedRecord.engineId,
                slot: projectedRecord.slot,
                reserved: projectedRecord.reserved,
                selectable: projectedRecord.selectable
              },
              readRawIdentity(rawRecord),
              "listEngines|getReservedSlots",
              "Reserved records disagree across upstream list surfaces."
            )
          );
        }
      }
    }

    if (allProjectedEngines.length === 0) {
      holds.push(
        makeHold(
          "ENGINE_RECORDS_UNAVAILABLE",
          "engineRecords",
          "NO_PROJECTABLE_ENGINE_RECORDS",
          "one or more engine records",
          0,
          "No engine records were available for classification."
        )
      );
    }
  }

  function extractRelationships(
    snapshot,
    sourceReceipt
  ) {
    var candidates = [
      snapshot && snapshot.relationships,
      snapshot && snapshot.relationship,
      snapshot && snapshot.governingRelationships,
      snapshot && snapshot.governingRelationship,
      sourceReceipt && sourceReceipt.relationships,
      sourceReceipt && sourceReceipt.relationship,
      sourceReceipt && sourceReceipt.governingRelationships,
      sourceReceipt && sourceReceipt.governingRelationship
    ];

    var index;

    for (index = 0; index < candidates.length; index += 1) {
      if (
        candidates[index] !== undefined &&
        candidates[index] !== null
      ) {
        return normalizeArray(candidates[index]);
      }
    }

    return [];
  }

  function projectRelationship(
    sourceRelationship,
    authorityRecords,
    engineRecords,
    tracker,
    conflicts,
    holds,
    index
  ) {
    sourceRelationship = sourceRelationship || {};

    var target = {
      schema: RELATIONSHIP_SCHEMA,
      governingAuthorityId: null,
      governedEngineId: null,
      authorityIsEngine: null,
      engineIsAuthority: null,
      governingAuthorityObserved: false,
      governedEngineObserved: false,
      relationshipCorrespondence: null,
      projectionStatus: "UNKNOWN",
      conflicts: [],
      holds: []
    };

    var fields = [
      "governingAuthorityId",
      "governedEngineId",
      "authorityIsEngine",
      "engineIsAuthority"
    ];

    var fieldIndex;
    var key;
    var result;

    for (
      fieldIndex = 0;
      fieldIndex < fields.length;
      fieldIndex += 1
    ) {
      key = fields[fieldIndex];

      result = copyUpstreamField(
        sourceRelationship,
        key,
        target,
        key,
        tracker,
        "relationships",
        "relationships[" + index + "]." + key,
        "relationships[" + index + "]." + key
      );

      if (result.error) {
        target.holds.push(
          makeHold(
            "RELATIONSHIP_FIELD_UNREADABLE",
            key,
            "SOURCE_PROPERTY_READ_ERROR",
            key,
            null,
            safeString(
              result.error &&
              result.error.message,
              300
            )
          )
        );
      }
    }

    target.governingAuthorityObserved = Boolean(
      findProjectedRecordByField(
        authorityRecords,
        "authorityId",
        target.governingAuthorityId
      )
    );

    target.governedEngineObserved = Boolean(
      findProjectedRecordByField(
        engineRecords,
        "engineId",
        target.governedEngineId
      )
    );

    if (
      target.authorityIsEngine === true ||
      target.engineIsAuthority === true
    ) {
      target.conflicts.push(
        makeConflict(
          "REVERSE_AUTHORITY_RELATIONSHIP",
          "authorityEngineRoleSeparation",
          {
            authorityIsEngine: false,
            engineIsAuthority: false
          },
          {
            authorityIsEngine:
              target.authorityIsEngine,
            engineIsAuthority:
              target.engineIsAuthority
          },
          "UPSTREAM_RELATIONSHIP",
          "Authority and engine roles are reversed or collapsed."
        )
      );
    }

    if (
      !target.governingAuthorityObserved ||
      !target.governedEngineObserved
    ) {
      target.holds.push(
        makeHold(
          "RELATIONSHIP_TARGET_MISSING",
          "relationshipTargets",
          "REFERENCED_RECORD_NOT_PROJECTED",
          {
            governingAuthorityId:
              target.governingAuthorityId,
            governedEngineId:
              target.governedEngineId
          },
          {
            governingAuthorityObserved:
              target.governingAuthorityObserved,
            governedEngineObserved:
              target.governedEngineObserved
          },
          "Relationship references a missing projected record."
        )
      );
    }

    target.relationshipCorrespondence =
      target.authorityIsEngine === false &&
      target.engineIsAuthority === false &&
      target.governingAuthorityObserved &&
      target.governedEngineObserved;

    if (target.conflicts.length > 0) {
      target.projectionStatus = "CONFLICT";
    } else if (target.holds.length > 0) {
      target.projectionStatus = "HELD";
    } else if (target.relationshipCorrespondence) {
      target.projectionStatus = "AVAILABLE";
    } else {
      target.projectionStatus = "UNKNOWN";
    }

    Array.prototype.push.apply(
      conflicts,
      target.conflicts
    );

    Array.prototype.push.apply(
      holds,
      target.holds
    );

    return deepFreeze(target);
  }

  function readDeclaredCount(source, keys) {
    var result = readFirstProperty(source, keys);

    if (!result.readable || !result.present) {
      return null;
    }

    return typeof result.value === "number"
      ? result.value
      : null;
  }

  function firstCount(snapshot, receipt, keys) {
    var value =
      readDeclaredCount(snapshot, keys);

    if (value !== null) {
      return value;
    }

    return readDeclaredCount(receipt, keys);
  }

  function buildCountCorrespondence(
    sourceIdentity,
    snapshot,
    sourceReceipt,
    authorityRecords,
    assignedRecords,
    selectableRecords,
    reservedRecords,
    allEngineRecords,
    conflicts,
    holds
  ) {
    var declaredSlotCount =
      typeof sourceIdentity.observedSlotCount === "number"
        ? sourceIdentity.observedSlotCount
        : firstCount(
          snapshot,
          sourceReceipt,
          [
            "slotCount",
            "declaredSlotCount"
          ]
        );

    var declaredAuthorityCount =
      firstCount(
        snapshot,
        sourceReceipt,
        [
          "authorityCount",
          "declaredAuthorityCount"
        ]
      );

    var declaredAssignedEngineCount =
      firstCount(
        snapshot,
        sourceReceipt,
        [
          "assignedEngineCount",
          "engineCount",
          "declaredAssignedEngineCount"
        ]
      );

    var declaredSelectableEngineCount =
      firstCount(
        snapshot,
        sourceReceipt,
        [
          "selectableEngineCount",
          "declaredSelectableEngineCount"
        ]
      );

    var declaredReservedEngineCount =
      firstCount(
        snapshot,
        sourceReceipt,
        [
          "reservedEngineCount",
          "reservedSlotCount",
          "declaredReservedEngineCount"
        ]
      );

    var result = {
      schema: COUNT_SCHEMA,

      declaredSlotCount:
        declaredSlotCount,

      projectedSlotCount:
        allEngineRecords.length,

      slotCountCorrespondence:
        declaredSlotCount === null
          ? null
          : declaredSlotCount ===
            allEngineRecords.length,

      declaredAuthorityCount:
        declaredAuthorityCount,

      projectedAuthorityCount:
        authorityRecords.length,

      authorityCountCorrespondence:
        declaredAuthorityCount === null
          ? null
          : declaredAuthorityCount ===
            authorityRecords.length,

      declaredAssignedEngineCount:
        declaredAssignedEngineCount,

      projectedAssignedEngineCount:
        assignedRecords.length,

      assignedEngineCountCorrespondence:
        declaredAssignedEngineCount === null
          ? null
          : declaredAssignedEngineCount ===
            assignedRecords.length,

      declaredSelectableEngineCount:
        declaredSelectableEngineCount,

      projectedSelectableEngineCount:
        selectableRecords.length,

      selectableEngineCountCorrespondence:
        declaredSelectableEngineCount === null
          ? null
          : declaredSelectableEngineCount ===
            selectableRecords.length,

      declaredReservedEngineCount:
        declaredReservedEngineCount,

      projectedReservedEngineCount:
        reservedRecords.length,

      reservedEngineCountCorrespondence:
        declaredReservedEngineCount === null
          ? null
          : declaredReservedEngineCount ===
            reservedRecords.length,

      allCountsCorrespond: false
    };

    var correspondenceFields = [
      "slotCountCorrespondence",
      "authorityCountCorrespondence",
      "assignedEngineCountCorrespondence",
      "selectableEngineCountCorrespondence",
      "reservedEngineCountCorrespondence"
    ];

    var allKnown = true;
    var allTrue = true;
    var index;
    var field;

    for (
      index = 0;
      index < correspondenceFields.length;
      index += 1
    ) {
      field = correspondenceFields[index];

      if (result[field] === null) {
        allKnown = false;

        holds.push(
          makeHold(
            "COUNT_EVIDENCE_INCOMPLETE",
            field,
            "DECLARED_COUNT_UNAVAILABLE",
            "declared and projected count",
            null,
            "Count correspondence cannot be completed without invention."
          )
        );
      } else if (result[field] !== true) {
        allTrue = false;

        conflicts.push(
          makeConflict(
            "COUNT_CONFLICT",
            field,
            true,
            result[field],
            "UPSTREAM_COUNT_EVIDENCE",
            "Declared count contradicts projected record count."
          )
        );
      }
    }

    result.allCountsCorrespond =
      allKnown && allTrue;

    return deepFreeze(result);
  }

  function stableSerialize(value, seen) {
    seen = seen || [];

    if (value === null) {
      return "null";
    }

    if (typeof value === "undefined") {
      return "undefined";
    }

    if (typeof value === "string") {
      return JSON.stringify(value);
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    if (typeof value === "bigint") {
      return "bigint:" + String(value);
    }

    if (typeof value === "function") {
      return "function:" +
        safeString(value.name || "", 100);
    }

    if (!isObject(value)) {
      return safeString(value, 500);
    }

    if (seen.indexOf(value) !== -1) {
      return "[circular]";
    }

    seen.push(value);

    var result;
    var index;

    if (Array.isArray(value)) {
      result = "[";

      for (index = 0; index < value.length; index += 1) {
        if (index > 0) {
          result += ",";
        }

        result +=
          stableSerialize(value[index], seen);
      }

      result += "]";
      seen.pop();

      return result;
    }

    var keys;

    try {
      keys = Object.keys(value).sort();
    } catch (error) {
      seen.pop();
      return "[unreadable]";
    }

    result = "{";

    for (index = 0; index < keys.length; index += 1) {
      if (index > 0) {
        result += ",";
      }

      result +=
        JSON.stringify(keys[index]) + ":";

      try {
        result +=
          stableSerialize(value[keys[index]], seen);
      } catch (error) {
        result += "[unreadable]";
      }
    }

    result += "}";
    seen.pop();

    return result;
  }

  function hashText(text) {
    var hash = 2166136261;
    var index;

    for (index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);

      hash +=
        (hash << 1) +
        (hash << 4) +
        (hash << 7) +
        (hash << 8) +
        (hash << 24);
    }

    return (
      "00000000" +
      (hash >>> 0).toString(16)
    ).slice(-8);
  }

  function hashValue(value) {
    return "fnv1a32:" +
      hashText(stableSerialize(value));
  }

  function readPath(rootValue, segments) {
    var current = rootValue;
    var index;
    var result;

    for (index = 0; index < segments.length; index += 1) {
      result = readProperty(
        current,
        segments[index]
      );

      if (!result.readable) {
        return {
          status: "UNREADABLE",
          value: undefined,
          error: result.error
        };
      }

      if (!result.present) {
        return {
          status: "MISSING",
          value: undefined,
          error: null
        };
      }

      current = result.value;
    }

    return {
      status: "FOUND",
      value: current,
      error: null
    };
  }

  function pathToText(container, segments) {
    var result = container || "$";
    var index;
    var segment;

    for (index = 0; index < segments.length; index += 1) {
      segment = segments[index];

      if (/^\d+$/.test(String(segment))) {
        result += "[" + segment + "]";
      } else {
        result += "." + segment;
      }
    }

    return result;
  }

  function mapAuthorityDestinationSegment(
    sourceSegment,
    sourceSegments
  ) {
    if (sourceSegments.length !== 2) {
      return sourceSegment;
    }

    if (sourceSegment === "schema") {
      return "sourceSchema";
    }

    if (
      sourceSegment === "receipt" ||
      sourceSegment === "authorityReceipt" ||
      sourceSegment === "runtimeReceipt"
    ) {
      return "upstreamReceipt";
    }

    if (
      sourceSegment === "validation" ||
      sourceSegment === "validationRecord" ||
      sourceSegment === "validationReceipt"
    ) {
      return "upstreamValidation";
    }

    return sourceSegment;
  }

  function mapEngineDestinationSegment(
    sourceSegment,
    sourceSegments
  ) {
    if (
      sourceSegments.length === 2 &&
      sourceSegment === "schema"
    ) {
      return "sourceSchema";
    }

    return sourceSegment;
  }

  function collectBoundaryObservations(
    value,
    sourceContainer,
    destinationContainer,
    sourceSegments,
    destinationSegments,
    mapSegment,
    accumulator,
    seen,
    depth
  ) {
    if (
      !isObject(value) ||
      typeof value === "function"
    ) {
      return;
    }

    seen = seen || [];
    depth =
      typeof depth === "number" ? depth : 0;

    if (
      depth > 16 ||
      seen.indexOf(value) !== -1
    ) {
      return;
    }

    seen.push(value);

    var names;
    var index;
    var name;
    var descriptor;
    var child;
    var nextSourceSegments;
    var nextDestinationSegments;
    var mappedName;

    try {
      names =
        Object.getOwnPropertyNames(value);
    } catch (error) {
      accumulator.push({
        sourceContainer: sourceContainer,
        destinationContainer:
          destinationContainer,
        sourcePath: sourceSegments.slice(),
        destinationPath:
          destinationSegments.slice(),
        field: null,
        status: "UNREADABLE",
        error: safeString(
          error && error.message,
          300
        )
      });

      seen.pop();
      return;
    }

    for (index = 0; index < names.length; index += 1) {
      name = names[index];

      nextSourceSegments =
        sourceSegments.concat([name]);

      mappedName = mapSegment
        ? mapSegment(
          name,
          nextSourceSegments,
          destinationSegments
        )
        : name;

      nextDestinationSegments =
        destinationSegments.concat([
          mappedName
        ]);

      try {
        descriptor =
          Object.getOwnPropertyDescriptor(
            value,
            name
          );
      } catch (error) {
        if (
          String(name)
            .toLowerCase()
            .indexOf("boundar") !== -1
        ) {
          accumulator.push({
            sourceContainer: sourceContainer,
            destinationContainer:
              destinationContainer,
            sourcePath:
              nextSourceSegments,
            destinationPath:
              nextDestinationSegments,
            field: name,
            status: "UNREADABLE",
            error: safeString(
              error && error.message,
              300
            )
          });
        }

        continue;
      }

      if (
        !descriptor ||
        !Object.prototype.hasOwnProperty.call(
          descriptor,
          "value"
        )
      ) {
        if (
          String(name)
            .toLowerCase()
            .indexOf("boundar") !== -1
        ) {
          accumulator.push({
            sourceContainer: sourceContainer,
            destinationContainer:
              destinationContainer,
            sourcePath:
              nextSourceSegments,
            destinationPath:
              nextDestinationSegments,
            field: name,
            status: "UNREADABLE",
            error:
              "Accessor boundary was not invoked."
          });
        }

        continue;
      }

      child = descriptor.value;

      if (
        String(name)
          .toLowerCase()
          .indexOf("boundar") !== -1
      ) {
        accumulator.push({
          sourceContainer: sourceContainer,
          destinationContainer:
            destinationContainer,
          sourcePath:
            nextSourceSegments,
          destinationPath:
            nextDestinationSegments,
          field: name,
          status: "READABLE",
          value: cloneBounded(child)
        });
      }

      if (
        isObject(child) &&
        typeof child !== "function"
      ) {
        collectBoundaryObservations(
          child,
          sourceContainer,
          destinationContainer,
          nextSourceSegments,
          nextDestinationSegments,
          mapSegment,
          accumulator,
          seen,
          depth + 1
        );
      }
    }

    seen.pop();
  }

  function determineBoundaryTruth(
    sourceDescriptors,
    destinationContainers,
    conflicts,
    holds
  ) {
    var observations = [];
    var index;
    var descriptor;

    for (
      index = 0;
      index < sourceDescriptors.length;
      index += 1
    ) {
      descriptor = sourceDescriptors[index];

      collectBoundaryObservations(
        descriptor.source,
        descriptor.sourceContainer,
        descriptor.destinationContainer,
        [],
        [],
        descriptor.mapSegment || null,
        observations
      );
    }

    if (observations.length === 0) {
      return deepFreeze({
        sourceBoundariesObserved: false,
        sourceBoundariesPreserved: null,
        boundaryCorrespondence: []
      });
    }

    var correspondence = [];
    var allPreserved = true;
    var item;
    var destination;
    var destinationRead;
    var status;

    for (index = 0; index < observations.length; index += 1) {
      item = observations[index];

      destination =
        destinationContainers[
          item.destinationContainer
        ];

      if (item.status === "UNREADABLE") {
        allPreserved = false;
        status = "SOURCE_UNREADABLE";

        holds.push(
          makeHold(
            "SOURCE_BOUNDARY_UNREADABLE",
            pathToText(
              item.sourceContainer,
              item.sourcePath
            ),
            "SOURCE_PROPERTY_READ_ERROR",
            "readable source boundary",
            null,
            item.error
          )
        );

        correspondence.push(
          deepFreeze({
            sourceContainer:
              item.sourceContainer,
            sourcePath:
              pathToText(
                item.sourceContainer,
                item.sourcePath
              ),
            destinationContainer:
              item.destinationContainer,
            destinationPath:
              pathToText(
                item.destinationContainer,
                item.destinationPath
              ),
            status: status,
            preserved: false
          })
        );

        continue;
      }

      if (!destination) {
        allPreserved = false;
        status = "DESTINATION_MISSING";

        conflicts.push(
          makeConflict(
            "SOURCE_BOUNDARY_DESTINATION_MISSING",
            pathToText(
              item.sourceContainer,
              item.sourcePath
            ),
            item.value,
            "missing destination container",
            item.destinationContainer,
            "Readable source boundary has no bounded destination."
          )
        );

        correspondence.push(
          deepFreeze({
            sourceContainer:
              item.sourceContainer,
            sourcePath:
              pathToText(
                item.sourceContainer,
                item.sourcePath
              ),
            destinationContainer:
              item.destinationContainer,
            destinationPath:
              pathToText(
                item.destinationContainer,
                item.destinationPath
              ),
            status: status,
            preserved: false
          })
        );

        continue;
      }

      destinationRead =
        readPath(
          destination,
          item.destinationPath
        );

      if (
        destinationRead.status ===
        "UNREADABLE"
      ) {
        allPreserved = false;
        status = "DESTINATION_UNREADABLE";

        conflicts.push(
          makeConflict(
            "SOURCE_BOUNDARY_DESTINATION_UNREADABLE",
            pathToText(
              item.sourceContainer,
              item.sourcePath
            ),
            item.value,
            "unreadable destination",
            item.destinationContainer,
            safeString(
              destinationRead.error &&
              destinationRead.error.message,
              300
            )
          )
        );
      } else if (
        destinationRead.status ===
        "MISSING"
      ) {
        allPreserved = false;
        status = "DESTINATION_MISSING";

        conflicts.push(
          makeConflict(
            "SOURCE_BOUNDARY_DESTINATION_MISSING",
            pathToText(
              item.sourceContainer,
              item.sourcePath
            ),
            item.value,
            "missing",
            item.destinationContainer,
            "Projected destination does not contain the source boundary."
          )
        );
      } else if (
        stableSerialize(item.value) !==
        stableSerialize(destinationRead.value)
      ) {
        allPreserved = false;
        status = "ALTERED";

        conflicts.push(
          makeConflict(
            "SOURCE_BOUNDARY_PROJECTION_CONFLICT",
            pathToText(
              item.sourceContainer,
              item.sourcePath
            ),
            item.value,
            destinationRead.value,
            item.destinationContainer,
            "Observed source boundary was altered in its bounded destination."
          )
        );
      } else {
        status = "PRESERVED";
      }

      correspondence.push(
        deepFreeze({
          sourceContainer:
            item.sourceContainer,

          sourcePath:
            pathToText(
              item.sourceContainer,
              item.sourcePath
            ),

          destinationContainer:
            item.destinationContainer,

          destinationPath:
            pathToText(
              item.destinationContainer,
              item.destinationPath
            ),

          status: status,
          preserved:
            status === "PRESERVED"
        })
      );
    }

    return deepFreeze({
      sourceBoundariesObserved: true,
      sourceBoundariesPreserved:
        allPreserved,
      boundaryCorrespondence:
        correspondence
    });
  }

  function determineStatus(context) {
    if (context.errors.length > 0) {
      return {
        status: "ERROR",
        reason:
          context.errors[0].code ||
          "PROJECTION_ERROR"
      };
    }

    if (context.conflicts.length > 0) {
      return {
        status: "CONFLICT",
        reason:
          context.conflicts[0].code ||
          "PROJECTION_CONFLICT"
      };
    }

    if (!context.sourcePresent) {
      return {
        status: "MISSING",
        reason: "SOURCE_GLOBAL_ABSENT"
      };
    }

    if (context.holds.length > 0) {
      return {
        status: "HELD",
        reason:
          context.holds[0].code ||
          "PROJECTION_HELD"
      };
    }

    if (context.available) {
      return {
        status: "AVAILABLE",
        reason:
          "SOURCE_PROJECTION_AVAILABLE"
      };
    }

    return {
      status: "UNKNOWN",
      reason:
        "NO_MORE_PRECISE_CLASSIFICATION"
    };
  }

  function buildCandidate(candidateSequence) {
    var createdAt = nowIso();

    var conflicts = [];
    var holds = [];
    var absence = [];
    var errors = [];

    var tracker =
      createProvenanceTracker();

    var resolution =
      resolveSource();

    if (resolution.primaryReadError) {
      errors.push(
        boundedError(
          resolution.primaryReadError,
          "source-resolution",
          "SOURCE_REFERENCE_READ_ERROR",
          SOURCE_PRIMARY_SYMBOL
        )
      );
    }

    if (resolution.compatibilityReadError) {
      errors.push(
        boundedError(
          resolution.compatibilityReadError,
          "source-resolution",
          "SOURCE_REFERENCE_READ_ERROR",
          SOURCE_COMPATIBILITY_SYMBOL
        )
      );
    }

    if (resolution.sourceReferenceConflict) {
      conflicts.push(
        makeConflict(
          "SOURCE_REFERENCE_CONFLICT",
          "sourceReference",
          "same object",
          "different objects",
          "GLOBAL_SOURCE_RESOLUTION",
          "Primary and compatibility registry globals differ."
        )
      );
    }

    if (
      !resolution.source &&
      !resolution.sourceReferenceConflict
    ) {
      absence.push(
        makeAbsence(
          "SOURCE_GLOBAL_ABSENT",
          "source",
          SOURCE_PRIMARY_SYMBOL +
            " | " +
            SOURCE_COMPATIBILITY_SYMBOL,
          "Neither permitted upstream registry publication exists."
        )
      );
    }

    var source = resolution.source;
    var sourcePresent = Boolean(source);

    var apiShape = source
      ? inspectApiShape(source)
      : deepFreeze({
        mandatoryMethods: {},
        mandatoryFields: {},
        optionalFields: {},
        complete: false
      });

    if (
      sourcePresent &&
      !apiShape.complete
    ) {
      holds.push(
        makeHold(
          "SOURCE_API_INCOMPLETE",
          "sourceApiShape",
          "MANDATORY_SOURCE_MEMBER_MISSING",
          "complete permitted reader-safe source API",
          apiShape,
          "Source exists but mandatory reader-safe shape is incomplete."
        )
      );
    }

    var sourceIdentity =
      buildSourceIdentity(
        resolution,
        source
      );

    if (sourcePresent) {
      collectIdentityConflicts(
        sourceIdentity,
        conflicts
      );
    }

    var snapshot = null;
    var sourceReceipt = null;
    var authoritySourceRecords = [];
    var engineSourceRecords = [];
    var selectableSourceRecords = [];
    var reservedSourceRecords = [];

    if (
      sourcePresent &&
      !resolution.sourceReferenceConflict &&
      apiShape.complete
    ) {
      var snapshotCall =
        safeCall(source, "getSnapshot", []);

      if (snapshotCall.ok) {
        snapshot =
          cloneBounded(snapshotCall.value);

        scanNestedSourceState(
          snapshotCall.value,
          "sourceSnapshot",
          "sourceSnapshot",
          "sourceSnapshot",
          tracker
        );
      } else {
        errors.push(
          boundedError(
            snapshotCall.error ||
              "getSnapshot unavailable",
            "getSnapshot",
            "SOURCE_SNAPSHOT_READ_ERROR",
            resolution.sourceAlias
          )
        );
      }

      var receiptCall =
        safeCall(
          source,
          "getRegistryReceipt",
          []
        );

      if (
        receiptCall.ok &&
        receiptCall.value !== null &&
        receiptCall.value !== undefined
      ) {
        sourceReceipt =
          cloneBounded(receiptCall.value);

        scanNestedSourceState(
          receiptCall.value,
          "sourceReceipt",
          "sourceReceipt",
          "sourceReceipt",
          tracker
        );
      } else if (receiptCall.ok) {
        absence.push(
          makeAbsence(
            "SOURCE_RECEIPT_ABSENT",
            "sourceReceipt",
            "getRegistryReceipt",
            "Registry receipt method returned no receipt."
          )
        );

        holds.push(
          makeHold(
            "SOURCE_RECEIPT_UNAVAILABLE",
            "sourceReceipt",
            "SOURCE_RECEIPT_ABSENT",
            "registry receipt",
            null,
            "Projection cannot be fully available without source receipt."
          )
        );
      } else {
        errors.push(
          boundedError(
            receiptCall.error ||
              "getRegistryReceipt unavailable",
            "getRegistryReceipt",
            "SOURCE_RECEIPT_READ_ERROR",
            resolution.sourceAlias
          )
        );
      }

      var authoritiesCall =
        safeCall(
          source,
          "listAuthorities",
          []
        );

      if (authoritiesCall.ok) {
        authoritySourceRecords =
          normalizeArray(
            authoritiesCall.value
          );
      } else {
        errors.push(
          boundedError(
            authoritiesCall.error ||
              "listAuthorities unavailable",
            "listAuthorities",
            "SOURCE_AUTHORITY_LIST_READ_ERROR",
            resolution.sourceAlias
          )
        );
      }

      var enginesCall =
        safeCall(
          source,
          "listEngines",
          [{
            includeReserved: true,
            selectableOnly: false
          }]
        );

      if (enginesCall.ok) {
        engineSourceRecords =
          normalizeArray(
            enginesCall.value
          );
      } else {
        errors.push(
          boundedError(
            enginesCall.error ||
              "listEngines unavailable",
            "listEngines",
            "SOURCE_ENGINE_LIST_READ_ERROR",
            resolution.sourceAlias
          )
        );
      }

      var selectableCall =
        safeCall(
          source,
          "getSelectableEngines",
          []
        );

      if (selectableCall.ok) {
        selectableSourceRecords =
          normalizeArray(
            selectableCall.value
          );
      } else {
        errors.push(
          boundedError(
            selectableCall.error ||
              "getSelectableEngines unavailable",
            "getSelectableEngines",
            "SOURCE_SELECTABLE_LIST_READ_ERROR",
            resolution.sourceAlias
          )
        );
      }

      var reservedCall =
        safeCall(
          source,
          "getReservedSlots",
          []
        );

      if (reservedCall.ok) {
        reservedSourceRecords =
          normalizeArray(
            reservedCall.value
          );
      } else {
        errors.push(
          boundedError(
            reservedCall.error ||
              "getReservedSlots unavailable",
            "getReservedSlots",
            "SOURCE_RESERVED_LIST_READ_ERROR",
            resolution.sourceAlias
          )
        );
      }
    }

    var authorityRecords = [];
    var engineRecords = [];
    var assignedEngineRecords = [];
    var selectableEngineRecords = [];
    var reservedSlotRecords = [];
    var unclassifiedEngineRecords = [];
    var relationships = [];

    var index;
    var projectedAuthority;
    var projectedEngine;

    for (
      index = 0;
      index < authoritySourceRecords.length;
      index += 1
    ) {
      projectedAuthority =
        projectAuthorityRecord(
          authoritySourceRecords[index],
          tracker,
          conflicts,
          holds,
          index
        );

      pushUniqueRecord(
        authorityRecords,
        projectedAuthority,
        "authorityId",
        conflicts,
        "DUPLICATE_AUTHORITY_ID"
      );
    }

    for (
      index = 0;
      index < engineSourceRecords.length;
      index += 1
    ) {
      projectedEngine =
        projectEngineRecord(
          engineSourceRecords[index],
          tracker,
          conflicts,
          holds,
          index
        );

      if (
        projectedEngine.slot !== null &&
        projectedEngine.slot !== undefined &&
        findProjectedRecordByField(
          engineRecords,
          "slot",
          projectedEngine.slot
        )
      ) {
        conflicts.push(
          makeConflict(
            "DUPLICATE_SLOT",
            "slot",
            "unique",
            projectedEngine.slot,
            "UPSTREAM_ENGINE_RECORDS",
            "Projected engine slot is duplicated."
          )
        );
      }

      if (
        projectedEngine.engineId &&
        findProjectedRecordByField(
          engineRecords,
          "engineId",
          projectedEngine.engineId
        )
      ) {
        conflicts.push(
          makeConflict(
            "DUPLICATE_ENGINE_ID",
            "engineId",
            "unique",
            projectedEngine.engineId,
            "UPSTREAM_ENGINE_RECORDS",
            "Projected engine identity is duplicated."
          )
        );
      }

      engineRecords.push(
        projectedEngine
      );

      if (
        projectedEngine.projectionClass ===
        "RESERVED_SLOT"
      ) {
        reservedSlotRecords.push(
          projectedEngine
        );
      } else if (
        projectedEngine.projectionClass ===
        "SELECTABLE_ENGINE"
      ) {
        assignedEngineRecords.push(
          projectedEngine
        );

        selectableEngineRecords.push(
          projectedEngine
        );
      } else if (
        projectedEngine.projectionClass ===
        "ASSIGNED_ENGINE"
      ) {
        assignedEngineRecords.push(
          projectedEngine
        );
      } else {
        unclassifiedEngineRecords.push(
          projectedEngine
        );
      }
    }

    verifyRecordClassification(
      engineRecords,
      selectableSourceRecords,
      reservedSourceRecords,
      conflicts,
      holds
    );

    var relationshipSources =
      extractRelationships(
        snapshot,
        sourceReceipt
      );

    if (relationshipSources.length === 0) {
      absence.push(
        makeAbsence(
          "RELATIONSHIP_ABSENT",
          "relationships",
          "snapshot | registryReceipt",
          "No upstream relationship record was located."
        )
      );

      holds.push(
        makeHold(
          "RELATIONSHIP_TARGET_MISSING",
          "relationships",
          "RELATIONSHIP_EVIDENCE_UNAVAILABLE",
          "one or more governing relationships",
          0,
          "Relationship correspondence cannot be completed."
        )
      );
    }

    for (
      index = 0;
      index < relationshipSources.length;
      index += 1
    ) {
      relationships.push(
        projectRelationship(
          relationshipSources[index],
          authorityRecords,
          engineRecords,
          tracker,
          conflicts,
          holds,
          index
        )
      );
    }

    var countCorrespondence =
      buildCountCorrespondence(
        sourceIdentity,
        snapshot,
        sourceReceipt,
        authorityRecords,
        assignedEngineRecords,
        selectableEngineRecords,
        reservedSlotRecords,
        engineRecords,
        conflicts,
        holds
      );

    var boundaryTruth =
      determineBoundaryTruth(
        [
          {
            source: snapshot,
            sourceContainer:
              "sourceSnapshot",
            destinationContainer:
              "sourceSnapshot",
            mapSegment: null
          },
          {
            source: sourceReceipt,
            sourceContainer:
              "sourceReceipt",
            destinationContainer:
              "sourceReceipt",
            mapSegment: null
          },
          {
            source:
              authoritySourceRecords,
            sourceContainer:
              "authoritySourceRecords",
            destinationContainer:
              "authorityRecords",
            mapSegment:
              mapAuthorityDestinationSegment
          },
          {
            source:
              engineSourceRecords,
            sourceContainer:
              "engineSourceRecords",
            destinationContainer:
              "engineRecords",
            mapSegment:
              mapEngineDestinationSegment
          },
          {
            source:
              relationshipSources,
            sourceContainer:
              "relationshipSources",
            destinationContainer:
              "relationships",
            mapSegment: null
          }
        ],
        {
          sourceSnapshot: snapshot,
          sourceReceipt: sourceReceipt,
          authorityRecords:
            authorityRecords,
          engineRecords:
            engineRecords,
          relationships:
            relationships
        },
        conflicts,
        holds
      );

    var sourceReceiptSchema =
      sourceReceipt
        ? readFirstProperty(
          sourceReceipt,
          ["schema", "SCHEMA"]
        ).value
        : null;

    var sourceRegistryHash =
      sourceReceipt
        ? readFirstProperty(
          sourceReceipt,
          ["registryHash", "hash"]
        ).value
        : null;

    var context = {
      sourcePresent: sourcePresent,
      conflicts: conflicts,
      holds: holds,
      errors: errors,

      available:
        sourcePresent &&
        !resolution.sourceReferenceConflict &&
        apiShape.complete &&
        Boolean(snapshot) &&
        Boolean(sourceReceipt) &&
        countCorrespondence
          .allCountsCorrespond &&
        relationships.length > 0 &&
        relationships.every(
          function everyRelationship(record) {
            return record
              .relationshipCorrespondence === true;
          }
        ) &&
        conflicts.length === 0 &&
        holds.length === 0 &&
        errors.length === 0
    };

    var derivedStatus =
      determineStatus(context);

    var projectionSummary = {
      authorityRecordCount:
        authorityRecords.length,

      engineRecordCount:
        engineRecords.length,

      assignedEngineRecordCount:
        assignedEngineRecords.length,

      selectableEngineRecordCount:
        selectableEngineRecords.length,

      reservedSlotRecordCount:
        reservedSlotRecords.length,

      unclassifiedEngineRecordCount:
        unclassifiedEngineRecords.length,

      relationshipCount:
        relationships.length,

      conflictCount:
        conflicts.length,

      holdCount:
        holds.length,

      absenceCount:
        absence.length,

      errorCount:
        errors.length
    };

    var evidence = deepFreeze(
      cloneBounded({
        schema: EVIDENCE_SCHEMA,
        sequence: candidateSequence,

        diagnosticSourceStatus:
          derivedStatus.status,

        diagnosticSourceReason:
          derivedStatus.reason,

        sourceIdentity:
          sourceIdentity,

        sourceApiShape:
          apiShape,

        sourceSnapshot:
          snapshot,

        sourceReceipt:
          sourceReceipt,

        authorityRecords:
          authorityRecords,

        engineRecords:
          engineRecords,

        assignedEngineRecords:
          assignedEngineRecords,

        selectableEngineRecords:
          selectableEngineRecords,

        reservedSlotRecords:
          reservedSlotRecords,

        unclassifiedEngineRecords:
          unclassifiedEngineRecords,

        relationships:
          relationships,

        countCorrespondence:
          countCorrespondence,

        projectionSummary:
          projectionSummary,

        conflicts:
          conflicts,

        holds:
          holds,

        absence:
          absence,

        errors:
          errors,

        upstreamStatusCopiedAsEvidence:
          tracker.copied,

        upstreamStatusProvenance:
          tracker.fields,

        sourceBoundariesObserved:
          boundaryTruth
            .sourceBoundariesObserved,

        sourceBoundariesPreserved:
          boundaryTruth
            .sourceBoundariesPreserved,

        boundaryCorrespondence:
          boundaryTruth
            .boundaryCorrespondence,

        createdAt:
          createdAt
      })
    );

    var projectionHash =
      hashValue(evidence);

    var state = deepFreeze(
      cloneBounded({
        schema: STATE_SCHEMA,
        contract: CONTRACT,
        version: VERSION,
        file: FILE,
        authority: AUTHORITY,
        initialized: true,
        sequence: candidateSequence,

        diagnosticSourceStatus:
          derivedStatus.status,

        diagnosticSourceReason:
          derivedStatus.reason,

        sourceIdentity:
          sourceIdentity,

        sourceApiShape:
          apiShape,

        sourceSnapshot:
          snapshot,

        sourceReceipt:
          sourceReceipt,

        authorityRecords:
          authorityRecords,

        engineRecords:
          engineRecords,

        assignedEngineRecords:
          assignedEngineRecords,

        selectableEngineRecords:
          selectableEngineRecords,

        reservedSlotRecords:
          reservedSlotRecords,

        unclassifiedEngineRecords:
          unclassifiedEngineRecords,

        relationships:
          relationships,

        countCorrespondence:
          countCorrespondence,

        projectionSummary:
          projectionSummary,

        conflicts:
          conflicts,

        holds:
          holds,

        absence:
          absence,

        errors:
          errors,

        upstreamStatusCopiedAsEvidence:
          tracker.copied,

        upstreamStatusProvenance:
          tracker.fields,

        sourceBoundariesObserved:
          boundaryTruth
            .sourceBoundariesObserved,

        sourceBoundariesPreserved:
          boundaryTruth
            .sourceBoundariesPreserved,

        boundaryCorrespondence:
          boundaryTruth
            .boundaryCorrespondence,

        systemReadinessEvaluated:
          false,

        systemReadinessClaimed:
          false,

        upstreamMutationPerformed:
          false,

        observerAttached:
          false,

        observationRequested:
          false,

        runtimeExecutionPerformed:
          false,

        backgroundActivityInstalled:
          false,

        f21Claimed:
          false,

        projectionHash:
          projectionHash,

        createdAt:
          createdAt
      })
    );

    var receipt = deepFreeze(
      cloneBounded({
        schema: RECEIPT_SCHEMA,
        contract: CONTRACT,
        version: VERSION,
        file: FILE,
        authority: AUTHORITY,
        sequence: candidateSequence,

        diagnosticSourceStatus:
          derivedStatus.status,

        diagnosticSourceReason:
          derivedStatus.reason,

        sourceAlias:
          sourceIdentity.sourceAlias,

        primarySourceObserved:
          sourceIdentity.primaryObserved,

        compatibilitySourceObserved:
          sourceIdentity
            .compatibilityObserved,

        sourceReferenceCorrespondence:
          sourceIdentity
            .sourceReferenceCorrespondence,

        sourceReferenceConflict:
          sourceIdentity
            .sourceReferenceConflict,

        expectedSourceContract:
          EXPECTED_SOURCE.contract,

        observedSourceContract:
          sourceIdentity.observedContract,

        sourceContractCorrespondence:
          sourceIdentity
            .contractCorrespondence,

        expectedSourceVersion:
          EXPECTED_SOURCE.version,

        observedSourceVersion:
          sourceIdentity.observedVersion,

        sourceVersionCorrespondence:
          sourceIdentity
            .versionCorrespondence,

        expectedSourceFile:
          EXPECTED_SOURCE.file,

        observedSourceFile:
          sourceIdentity.observedFile,

        sourceFileCorrespondence:
          sourceIdentity
            .fileCorrespondence,

        expectedRegistrySchema:
          EXPECTED_SOURCE.registrySchema,

        observedRegistrySchema:
          sourceIdentity
            .observedRegistrySchema,

        registrySchemaCorrespondence:
          sourceIdentity
            .registrySchemaCorrespondence,

        sourceReceiptPresent:
          Boolean(sourceReceipt),

        sourceReceiptSchema:
          cloneBounded(
            sourceReceiptSchema
          ),

        sourceReceiptSchemaCorrespondence:
          Boolean(sourceReceipt) &&
          sourceReceiptSchema ===
            EXPECTED_SOURCE.receiptSchema,

        sourceRegistryHash:
          cloneBounded(
            sourceRegistryHash
          ),

        authorityRecordCount:
          authorityRecords.length,

        engineRecordCount:
          engineRecords.length,

        assignedEngineRecordCount:
          assignedEngineRecords.length,

        selectableEngineRecordCount:
          selectableEngineRecords.length,

        reservedSlotRecordCount:
          reservedSlotRecords.length,

        unclassifiedEngineRecordCount:
          unclassifiedEngineRecords.length,

        relationshipCount:
          relationships.length,

        declaredSlotCount:
          countCorrespondence
            .declaredSlotCount,

        projectedSlotCount:
          countCorrespondence
            .projectedSlotCount,

        countCorrespondence:
          countCorrespondence
            .allCountsCorrespond,

        relationshipCorrespondence:
          relationships.length > 0 &&
          relationships.every(
            function everyReceiptRelationship(
              record
            ) {
              return record
                .relationshipCorrespondence === true;
            }
          ),

        sourceBoundariesObserved:
          boundaryTruth
            .sourceBoundariesObserved,

        sourceBoundariesPreserved:
          boundaryTruth
            .sourceBoundariesPreserved,

        boundaryCorrespondence:
          boundaryTruth
            .boundaryCorrespondence,

        upstreamStatusCopiedAsEvidence:
          tracker.copied,

        diagnosticStatusDerivedSeparately:
          true,

        systemReadinessEvaluated:
          false,

        systemReadinessClaimed:
          false,

        upstreamMutationPerformed:
          false,

        observerAttached:
          false,

        observationRequested:
          false,

        runtimeExecutionPerformed:
          false,

        backgroundActivityInstalled:
          false,

        f21Claimed:
          false,

        conflictCount:
          conflicts.length,

        holdCount:
          holds.length,

        absenceCount:
          absence.length,

        errorCount:
          errors.length,

        projectionHash:
          projectionHash,

        lastError:
          errors.length > 0
            ? errors[errors.length - 1]
            : null,

        createdAt:
          createdAt
      })
    );

    verifyCandidateCorrespondence(
      state,
      receipt
    );

    return deepFreeze({
      sequence: candidateSequence,
      status: derivedStatus.status,
      evidence: evidence,
      state: state,
      receipt: receipt
    });
  }

  function verifyCandidateCorrespondence(
    state,
    receipt
  ) {
    var fields = [
      "contract",
      "version",
      "file",
      "authority",
      "sequence",
      "diagnosticSourceStatus",
      "upstreamStatusCopiedAsEvidence",
      "sourceBoundariesObserved",
      "sourceBoundariesPreserved",
      "projectionHash",
      "createdAt"
    ];

    var index;
    var field;

    for (index = 0; index < fields.length; index += 1) {
      field = fields[index];

      if (state[field] !== receipt[field]) {
        throw new Error(
          "Candidate state and receipt do not correspond on " +
          field +
          "."
        );
      }
    }

    if (
      state.projectionSummary
        .authorityRecordCount !==
      receipt.authorityRecordCount
    ) {
      throw new Error(
        "Candidate authority count does not correspond."
      );
    }

    if (
      state.projectionSummary
        .engineRecordCount !==
      receipt.engineRecordCount
    ) {
      throw new Error(
        "Candidate engine count does not correspond."
      );
    }

    if (
      state.projectionSummary
        .assignedEngineRecordCount !==
      receipt.assignedEngineRecordCount
    ) {
      throw new Error(
        "Candidate assigned-engine count does not correspond."
      );
    }

    if (
      state.projectionSummary
        .selectableEngineRecordCount !==
      receipt.selectableEngineRecordCount
    ) {
      throw new Error(
        "Candidate selectable-engine count does not correspond."
      );
    }

    if (
      state.projectionSummary
        .reservedSlotRecordCount !==
      receipt.reservedSlotRecordCount
    ) {
      throw new Error(
        "Candidate reserved-slot count does not correspond."
      );
    }

    if (
      state.projectionSummary
        .unclassifiedEngineRecordCount !==
      receipt.unclassifiedEngineRecordCount
    ) {
      throw new Error(
        "Candidate unclassified-engine count does not correspond."
      );
    }

    if (
      state.projectionSummary
        .relationshipCount !==
      receipt.relationshipCount
    ) {
      throw new Error(
        "Candidate relationship count does not correspond."
      );
    }

    if (
      stableSerialize(
        state.boundaryCorrespondence
      ) !==
      stableSerialize(
        receipt.boundaryCorrespondence
      )
    ) {
      throw new Error(
        "Candidate boundary correspondence does not correspond."
      );
    }
  }

  function safeGlobalAssign(symbol, value) {
    root[symbol] = value;

    if (root[symbol] !== value) {
      throw new Error(
        "Global publication did not retain assigned reference: " +
        symbol
      );
    }
  }

  function publishError(errorRecord) {
    try {
      root[ERROR_FLAG] = errorRecord;
    } catch (error) {
      // No alternate error publication is authorized.
    }
  }

  function clearCurrentError() {
    try {
      root[ERROR_FLAG] = null;
    } catch (error) {
      // Clearing error state is nonessential to accepted state.
    }
  }

  function commitCandidate(
    candidate,
    action
  ) {
    var previousState = currentState;
    var previousReceipt = currentReceipt;
    var previousSequence =
      successfulSequence;
    var previousStatus = currentStatus;

    var previousPublishedState;
    var previousPublishedReceipt;
    var previousPublishedStatus;

    try {
      previousPublishedState =
        root[PRIMARY_STATE_SYMBOL];
    } catch (error) {
      previousPublishedState =
        previousState;
    }

    try {
      previousPublishedReceipt =
        root[PRIMARY_RECEIPT_SYMBOL];
    } catch (error) {
      previousPublishedReceipt =
        previousReceipt;
    }

    try {
      previousPublishedStatus =
        root[STATUS_FLAG];
    } catch (error) {
      previousPublishedStatus =
        previousStatus;
    }

    var publicationPhase =
      "NOT_STARTED";

    var rollbackAttempted =
      false;

    var rollbackCompleted =
      null;

    var previousStatePreserved =
      true;

    var previousReceiptPreserved =
      true;

    var sequencePreserved =
      true;

    try {
      safeGlobalAssign(
        PRIMARY_STATE_SYMBOL,
        candidate.state
      );

      publicationPhase =
        "STATE_ASSIGNED";

      safeGlobalAssign(
        PRIMARY_RECEIPT_SYMBOL,
        candidate.receipt
      );

      publicationPhase =
        "RECEIPT_ASSIGNED";

      if (
        root[PRIMARY_STATE_SYMBOL] !==
          candidate.state ||
        root[PRIMARY_RECEIPT_SYMBOL] !==
          candidate.receipt
      ) {
        throw new Error(
          "Candidate state-and-receipt publication could not be confirmed."
        );
      }

      currentState =
        candidate.state;

      currentReceipt =
        candidate.receipt;

      successfulSequence =
        candidate.sequence;

      currentStatus =
        candidate.status;

      safeGlobalAssign(
        STATUS_FLAG,
        currentStatus
      );

      publicationPhase =
        "COMMIT_CONFIRMED";

      clearCurrentError();

      return deepFreeze({
        schema:
          TRANSACTION_RESULT_SCHEMA,

        action:
          action,

        status:
          "SUCCESS",

        sequence:
          successfulSequence,

        publicationPhase:
          publicationPhase,

        statePublished:
          true,

        receiptPublished:
          true,

        upstreamMutationPerformed:
          false,

        observerAttached:
          false,

        runtimeExecutionPerformed:
          false,

        backgroundActivityInstalled:
          false,

        completedAt:
          nowIso()
      });
    } catch (error) {
      if (
        publicationPhase !==
        "NOT_STARTED"
      ) {
        rollbackAttempted = true;
        publicationPhase =
          "ROLLBACK_ATTEMPTED";

        try {
          root[PRIMARY_STATE_SYMBOL] =
            previousPublishedState;

          previousStatePreserved =
            root[PRIMARY_STATE_SYMBOL] ===
            previousPublishedState;
        } catch (rollbackStateError) {
          previousStatePreserved = false;
        }

        try {
          root[PRIMARY_RECEIPT_SYMBOL] =
            previousPublishedReceipt;

          previousReceiptPreserved =
            root[PRIMARY_RECEIPT_SYMBOL] ===
            previousPublishedReceipt;
        } catch (rollbackReceiptError) {
          previousReceiptPreserved =
            false;
        }

        try {
          root[STATUS_FLAG] =
            previousPublishedStatus;
        } catch (rollbackStatusError) {
          // Preservation fields report rollback truth.
        }

        currentState =
          previousState;

        currentReceipt =
          previousReceipt;

        successfulSequence =
          previousSequence;

        currentStatus =
          previousStatus;

        sequencePreserved =
          successfulSequence ===
          previousSequence;

        rollbackCompleted =
          previousStatePreserved &&
          previousReceiptPreserved &&
          sequencePreserved;

        if (!rollbackCompleted) {
          publicationPhase =
            "ROLLBACK_INCOMPLETE";
        }
      }

      var failure =
        boundedError(
          error,
          action,
          action === "reread"
            ? "REREAD_ERROR"
            : "PUBLICATION_ERROR",
          currentState &&
          currentState.sourceIdentity
            ? currentState
              .sourceIdentity
              .sourceAlias
            : null,
          {
            candidateSequence:
              candidate
                ? candidate.sequence
                : null,

            successfulSequence:
              successfulSequence,

            publicationPhase:
              publicationPhase,

            previousStatePreserved:
              previousStatePreserved,

            previousReceiptPreserved:
              previousReceiptPreserved,

            sequencePreserved:
              sequencePreserved,

            rollbackAttempted:
              rollbackAttempted,

            rollbackCompleted:
              rollbackCompleted
          }
        );

      publishError(failure);

      return failure;
    }
  }

  function performReread() {
    var candidateSequence =
      successfulSequence + 1;

    var candidate;

    try {
      candidate =
        buildCandidate(
          candidateSequence
        );
    } catch (error) {
      var failure =
        boundedError(
          error,
          "reread",
          "REREAD_ERROR",
          currentState &&
          currentState.sourceIdentity
            ? currentState
              .sourceIdentity
              .sourceAlias
            : null,
          {
            candidateSequence:
              candidateSequence,

            successfulSequence:
              successfulSequence,

            publicationPhase:
              "NOT_STARTED",

            previousStatePreserved:
              true,

            previousReceiptPreserved:
              true,

            sequencePreserved:
              true,

            rollbackAttempted:
              false,

            rollbackCompleted:
              null
          }
        );

      publishError(failure);

      return failure;
    }

    return commitCandidate(
      candidate,
      "reread"
    );
  }

  function createPublicApi() {
    var api = {
      CONTRACT: CONTRACT,
      contract: CONTRACT,

      VERSION: VERSION,
      version: VERSION,

      FILE: FILE,
      file: FILE,

      AUTHORITY: AUTHORITY,
      authority: AUTHORITY,

      ROLE: ROLE,
      role: ROLE,

      STATE_SCHEMA:
        STATE_SCHEMA,

      EVIDENCE_SCHEMA:
        EVIDENCE_SCHEMA,

      RECEIPT_SCHEMA:
        RECEIPT_SCHEMA,

      TRANSACTION_RESULT_SCHEMA:
        TRANSACTION_RESULT_SCHEMA,

      systemReadinessEvaluated:
        false,

      systemReadinessClaimed:
        false,

      upstreamMutationAuthorized:
        false,

      observerAttachmentAuthorized:
        false,

      runtimeExecutionAuthorized:
        false,

      f21Claimed:
        false,

      getState:
        function getState() {
          return immutableClone(
            currentState
          );
        },

      getReceipt:
        function getReceipt() {
          return immutableClone(
            currentReceipt
          );
        },

      getSourceIdentity:
        function getSourceIdentity() {
          return immutableClone(
            currentState
              ? currentState
                .sourceIdentity
              : null
          );
        },

      getRegistryEvidence:
        function getRegistryEvidence() {
          if (!currentState) {
            return null;
          }

          return immutableClone({
            schema:
              EVIDENCE_SCHEMA,

            sequence:
              currentState.sequence,

            diagnosticSourceStatus:
              currentState
                .diagnosticSourceStatus,

            diagnosticSourceReason:
              currentState
                .diagnosticSourceReason,

            sourceIdentity:
              currentState
                .sourceIdentity,

            sourceApiShape:
              currentState
                .sourceApiShape,

            sourceSnapshot:
              currentState
                .sourceSnapshot,

            sourceReceipt:
              currentState
                .sourceReceipt,

            authorityRecords:
              currentState
                .authorityRecords,

            engineRecords:
              currentState
                .engineRecords,

            assignedEngineRecords:
              currentState
                .assignedEngineRecords,

            selectableEngineRecords:
              currentState
                .selectableEngineRecords,

            reservedSlotRecords:
              currentState
                .reservedSlotRecords,

            unclassifiedEngineRecords:
              currentState
                .unclassifiedEngineRecords,

            relationships:
              currentState
                .relationships,

            countCorrespondence:
              currentState
                .countCorrespondence,

            projectionSummary:
              currentState
                .projectionSummary,

            conflicts:
              currentState.conflicts,

            holds:
              currentState.holds,

            absence:
              currentState.absence,

            errors:
              currentState.errors,

            upstreamStatusCopiedAsEvidence:
              currentState
                .upstreamStatusCopiedAsEvidence,

            upstreamStatusProvenance:
              currentState
                .upstreamStatusProvenance,

            sourceBoundariesObserved:
              currentState
                .sourceBoundariesObserved,

            sourceBoundariesPreserved:
              currentState
                .sourceBoundariesPreserved,

            boundaryCorrespondence:
              currentState
                .boundaryCorrespondence,

            projectionHash:
              currentState
                .projectionHash,

            createdAt:
              currentState.createdAt
          });
        },

      getAuthorityRecords:
        function getAuthorityRecords() {
          return immutableClone(
            currentState
              ? currentState
                .authorityRecords
              : []
          );
        },

      getAssignedEngineRecords:
        function getAssignedEngineRecords() {
          return immutableClone(
            currentState
              ? currentState
                .assignedEngineRecords
              : []
          );
        },

      getSelectableEngineRecords:
        function getSelectableEngineRecords() {
          return immutableClone(
            currentState
              ? currentState
                .selectableEngineRecords
              : []
          );
        },

      getReservedSlotRecords:
        function getReservedSlotRecords() {
          return immutableClone(
            currentState
              ? currentState
                .reservedSlotRecords
              : []
          );
        },

      getRelationships:
        function getRelationships() {
          return immutableClone(
            currentState
              ? currentState
                .relationships
              : []
          );
        },

      getCountCorrespondence:
        function getCountCorrespondence() {
          return immutableClone(
            currentState
              ? currentState
                .countCorrespondence
              : null
          );
        },

      reread:
        function reread() {
          return performReread();
        }
    };

    try {
      Object.defineProperty(
        api,
        "STATUS",
        {
          enumerable: true,
          configurable: false,
          get:
            function getUpperStatus() {
              return currentStatus;
            }
        }
      );

      Object.defineProperty(
        api,
        "status",
        {
          enumerable: true,
          configurable: false,
          get:
            function getLowerStatus() {
              return currentStatus;
            }
        }
      );
    } catch (error) {
      api.STATUS = currentStatus;
      api.status = currentStatus;
    }

    return deepFreeze(api);
  }

  function publishInstallationConflict(
    existingApi
  ) {
    var observedContract = null;
    var observedVersion = null;
    var inspectionError = null;

    try {
      observedContract =
        existingApi &&
        (
          existingApi.CONTRACT ||
          existingApi.contract ||
          null
        );

      observedVersion =
        existingApi &&
        (
          existingApi.VERSION ||
          existingApi.version ||
          null
        );
    } catch (error) {
      inspectionError =
        boundedError(
          error,
          "installation-conflict-inspection",
          "INSTALLATION_CONFLICT_INSPECTION_ERROR",
          null
        );
    }

    var artifact =
      deepFreeze({
        schema:
          INSTALLATION_CONFLICT_SCHEMA,

        expectedContract:
          CONTRACT,

        expectedVersion:
          VERSION,

        observedContract:
          cloneBounded(
            observedContract
          ),

        observedVersion:
          cloneBounded(
            observedVersion
          ),

        primaryApiSymbol:
          PRIMARY_API_SYMBOL,

        replacementPerformed:
          false,

        projectionPerformed:
          false,

        occurredAt:
          nowIso(),

        error:
          inspectionError
      });

    try {
      root[
        INSTALLATION_CONFLICT_FLAG
      ] = artifact;
    } catch (error) {
      // Existing API, state, and receipt remain untouched.
    }

    return artifact;
  }

  function restoreNamespaceAlias(
    existingApi
  ) {
    try {
      if (
        !root.AUDRALIA ||
        typeof root.AUDRALIA !== "object"
      ) {
        root.AUDRALIA = {};
      }

      if (
        !root.AUDRALIA
          .diagnosticRegistry
      ) {
        root.AUDRALIA
          .diagnosticRegistry =
          existingApi;
      }
    } catch (error) {
      publishError(
        boundedError(
          error,
          "namespace-alias-restoration",
          "PUBLICATION_ERROR",
          null
        )
      );
    }
  }

  function inspectExistingInstallation() {
    var existingRead =
      readProperty(
        root,
        PRIMARY_API_SYMBOL
      );

    if (!existingRead.readable) {
      publishError(
        boundedError(
          existingRead.error,
          "installation",
          "SOURCE_REFERENCE_READ_ERROR",
          PRIMARY_API_SYMBOL
        )
      );

      return {
        handled: true,
        api: null
      };
    }

    if (
      !existingRead.present ||
      !existingRead.value
    ) {
      return {
        handled: false,
        api: null
      };
    }

    var existingApi =
      existingRead.value;

    var existingContract;
    var existingVersion;

    try {
      existingContract =
        existingApi.CONTRACT ||
        existingApi.contract ||
        null;

      existingVersion =
        existingApi.VERSION ||
        existingApi.version ||
        null;
    } catch (error) {
      publishInstallationConflict(
        existingApi
      );

      return {
        handled: true,
        api: existingApi
      };
    }

    if (
      existingContract === CONTRACT &&
      existingVersion === VERSION
    ) {
      restoreNamespaceAlias(
        existingApi
      );

      return {
        handled: true,
        api: existingApi
      };
    }

    publishInstallationConflict(
      existingApi
    );

    return {
      handled: true,
      api: existingApi
    };
  }

  function captureOwnProperty(
    object,
    key
  ) {
    var existed = false;
    var value;

    try {
      existed =
        Object.prototype
          .hasOwnProperty
          .call(object, key);
    } catch (error) {
      existed = false;
    }

    if (existed) {
      try {
        value = object[key];
      } catch (error) {
        value = undefined;
      }
    }

    return {
      existed: existed,
      value: value
    };
  }

  function restoreOwnProperty(
    object,
    key,
    snapshot
  ) {
    if (snapshot.existed) {
      object[key] = snapshot.value;

      return (
        object[key] ===
        snapshot.value
      );
    }

    try {
      delete object[key];
    } catch (error) {
      return false;
    }

    return !Object.prototype
      .hasOwnProperty
      .call(object, key);
  }

  function captureInstallationSurface() {
    var audraliaSnapshot =
      captureOwnProperty(
        root,
        "AUDRALIA"
      );

    var namespaceObject =
      audraliaSnapshot.existed &&
      audraliaSnapshot.value &&
      typeof audraliaSnapshot.value ===
        "object"
        ? audraliaSnapshot.value
        : null;

    return {
      primaryApi:
        captureOwnProperty(
          root,
          PRIMARY_API_SYMBOL
        ),

      state:
        captureOwnProperty(
          root,
          PRIMARY_STATE_SYMBOL
        ),

      receipt:
        captureOwnProperty(
          root,
          PRIMARY_RECEIPT_SYMBOL
        ),

      loaded:
        captureOwnProperty(
          root,
          LOADED_FLAG
        ),

      contract:
        captureOwnProperty(
          root,
          CONTRACT_FLAG
        ),

      version:
        captureOwnProperty(
          root,
          VERSION_FLAG
        ),

      status:
        captureOwnProperty(
          root,
          STATUS_FLAG
        ),

      error:
        captureOwnProperty(
          root,
          ERROR_FLAG
        ),

      audralia:
        audraliaSnapshot,

      namespaceObject:
        namespaceObject,

      namespaceMember:
        namespaceObject
          ? captureOwnProperty(
            namespaceObject,
            "diagnosticRegistry"
          )
          : {
            existed: false,
            value: undefined
          },

      internalState:
        currentState,

      internalReceipt:
        currentReceipt,

      internalSequence:
        successfulSequence,

      internalStatus:
        currentStatus,

      internalApi:
        publicApi
    };
  }

  function rollbackInstallationSurface(
    snapshot
  ) {
    var results = {
      primaryApi: false,
      state: false,
      receipt: false,
      loaded: false,
      contract: false,
      version: false,
      status: false,
      error: false,
      namespace: false,
      internal: false
    };

    try {
      results.loaded =
        restoreOwnProperty(
          root,
          LOADED_FLAG,
          snapshot.loaded
        );
    } catch (error) {
      results.loaded = false;
    }

    try {
      results.status =
        restoreOwnProperty(
          root,
          STATUS_FLAG,
          snapshot.status
        );
    } catch (error) {
      results.status = false;
    }

    try {
      results.version =
        restoreOwnProperty(
          root,
          VERSION_FLAG,
          snapshot.version
        );
    } catch (error) {
      results.version = false;
    }

    try {
      results.contract =
        restoreOwnProperty(
          root,
          CONTRACT_FLAG,
          snapshot.contract
        );
    } catch (error) {
      results.contract = false;
    }

    try {
      results.primaryApi =
        restoreOwnProperty(
          root,
          PRIMARY_API_SYMBOL,
          snapshot.primaryApi
        );
    } catch (error) {
      results.primaryApi = false;
    }

    try {
      results.receipt =
        restoreOwnProperty(
          root,
          PRIMARY_RECEIPT_SYMBOL,
          snapshot.receipt
        );
    } catch (error) {
      results.receipt = false;
    }

    try {
      results.state =
        restoreOwnProperty(
          root,
          PRIMARY_STATE_SYMBOL,
          snapshot.state
        );
    } catch (error) {
      results.state = false;
    }

    try {
      results.error =
        restoreOwnProperty(
          root,
          ERROR_FLAG,
          snapshot.error
        );
    } catch (error) {
      results.error = false;
    }

    try {
      if (
        snapshot.audralia.existed &&
        snapshot.namespaceObject
      ) {
        if (
          root.AUDRALIA !==
          snapshot.namespaceObject
        ) {
          root.AUDRALIA =
            snapshot.namespaceObject;
        }

        results.namespace =
          restoreOwnProperty(
            snapshot.namespaceObject,
            "diagnosticRegistry",
            snapshot.namespaceMember
          );
      } else {
        results.namespace =
          restoreOwnProperty(
            root,
            "AUDRALIA",
            snapshot.audralia
          );
      }
    } catch (error) {
      results.namespace = false;
    }

    currentState =
      snapshot.internalState;

    currentReceipt =
      snapshot.internalReceipt;

    successfulSequence =
      snapshot.internalSequence;

    currentStatus =
      snapshot.internalStatus;

    publicApi =
      snapshot.internalApi;

    results.internal =
      currentState ===
        snapshot.internalState &&
      currentReceipt ===
        snapshot.internalReceipt &&
      successfulSequence ===
        snapshot.internalSequence &&
      currentStatus ===
        snapshot.internalStatus &&
      publicApi ===
        snapshot.internalApi;

    results.complete =
      results.primaryApi &&
      results.state &&
      results.receipt &&
      results.loaded &&
      results.contract &&
      results.version &&
      results.status &&
      results.error &&
      results.namespace &&
      results.internal;

    return results;
  }

  function confirmInstallationCorrespondence(
    api,
    state,
    receipt,
    status
  ) {
    if (
      root[PRIMARY_STATE_SYMBOL] !==
      state
    ) {
      throw new Error(
        "Installed state publication does not correspond."
      );
    }

    if (
      root[PRIMARY_RECEIPT_SYMBOL] !==
      receipt
    ) {
      throw new Error(
        "Installed receipt publication does not correspond."
      );
    }

    if (
      root[PRIMARY_API_SYMBOL] !==
      api
    ) {
      throw new Error(
        "Installed primary API publication does not correspond."
      );
    }

    if (
      !root.AUDRALIA ||
      typeof root.AUDRALIA !==
        "object" ||
      root.AUDRALIA
        .diagnosticRegistry !== api
    ) {
      throw new Error(
        "Installed namespace API does not correspond."
      );
    }

    if (
      root[CONTRACT_FLAG] !==
      CONTRACT
    ) {
      throw new Error(
        "Installed contract flag does not correspond."
      );
    }

    if (
      root[VERSION_FLAG] !==
      VERSION
    ) {
      throw new Error(
        "Installed version flag does not correspond."
      );
    }

    if (
      root[STATUS_FLAG] !==
      status
    ) {
      throw new Error(
        "Installed status flag does not correspond."
      );
    }

    if (
      api.getState().sequence !==
      state.sequence
    ) {
      throw new Error(
        "Installed API state getter does not expose the accepted state."
      );
    }

    if (
      api.getReceipt().sequence !==
      receipt.sequence
    ) {
      throw new Error(
        "Installed API receipt getter does not expose the accepted receipt."
      );
    }

    if (
      api.STATUS !== status ||
      api.status !== status
    ) {
      throw new Error(
        "Installed API status does not expose the accepted status."
      );
    }
  }

  function performInitialInstallation(
    candidate,
    api
  ) {
    var snapshot =
      captureInstallationSurface();

    var publicationPhase =
      "NOT_STARTED";

    var rollbackResult = null;

    try {
      safeGlobalAssign(
        PRIMARY_STATE_SYMBOL,
        candidate.state
      );

      publicationPhase =
        "STATE_ASSIGNED";

      safeGlobalAssign(
        PRIMARY_RECEIPT_SYMBOL,
        candidate.receipt
      );

      publicationPhase =
        "RECEIPT_ASSIGNED";

      safeGlobalAssign(
        PRIMARY_API_SYMBOL,
        api
      );

      publicationPhase =
        "PRIMARY_API_ASSIGNED";

      if (
        !root.AUDRALIA ||
        typeof root.AUDRALIA !==
          "object"
      ) {
        root.AUDRALIA = {};
      }

      root.AUDRALIA
        .diagnosticRegistry =
        api;

      if (
        root.AUDRALIA
          .diagnosticRegistry !== api
      ) {
        throw new Error(
          "Namespace API publication could not be confirmed."
        );
      }

      publicationPhase =
        "NAMESPACE_API_ASSIGNED";

      safeGlobalAssign(
        CONTRACT_FLAG,
        CONTRACT
      );

      publicationPhase =
        "CONTRACT_FLAG_ASSIGNED";

      safeGlobalAssign(
        VERSION_FLAG,
        VERSION
      );

      publicationPhase =
        "VERSION_FLAG_ASSIGNED";

      currentState =
        candidate.state;

      currentReceipt =
        candidate.receipt;

      successfulSequence =
        candidate.sequence;

      currentStatus =
        candidate.status;

      publicApi =
        api;

      safeGlobalAssign(
        STATUS_FLAG,
        currentStatus
      );

      publicationPhase =
        "STATUS_FLAG_ASSIGNED";

      clearCurrentError();

      confirmInstallationCorrespondence(
        api,
        candidate.state,
        candidate.receipt,
        candidate.status
      );

      publicationPhase =
        "INSTALLATION_CORRESPONDENCE_CONFIRMED";

      safeGlobalAssign(
        LOADED_FLAG,
        true
      );

      if (
        root[LOADED_FLAG] !== true
      ) {
        throw new Error(
          "Loaded flag publication could not be confirmed."
        );
      }

      publicationPhase =
        "COMMIT_CONFIRMED";

      return deepFreeze({
        schema:
          TRANSACTION_RESULT_SCHEMA,

        action:
          "installation",

        status:
          "SUCCESS",

        sequence:
          successfulSequence,

        publicationPhase:
          publicationPhase,

        statePublished:
          true,

        receiptPublished:
          true,

        primaryApiPublished:
          true,

        namespaceApiPublished:
          true,

        contractFlagPublished:
          true,

        versionFlagPublished:
          true,

        statusFlagPublished:
          true,

        loadedFlagPublishedLast:
          true,

        upstreamMutationPerformed:
          false,

        observerAttached:
          false,

        runtimeExecutionPerformed:
          false,

        backgroundActivityInstalled:
          false,

        completedAt:
          nowIso()
      });
    } catch (error) {
      rollbackResult =
        rollbackInstallationSurface(
          snapshot
        );

      var failure =
        boundedError(
          error,
          "installation",
          "PUBLICATION_ERROR",
          null,
          {
            candidateSequence:
              candidate
                ? candidate.sequence
                : 1,

            successfulSequence:
              successfulSequence,

            publicationPhase:
              publicationPhase,

            rollbackAttempted:
              true,

            rollbackCompleted:
              rollbackResult
                ? rollbackResult.complete
                : false,

            rollbackSurface:
              rollbackResult
          }
        );

      publishError(failure);

      return failure;
    }
  }

  var existingInstallation =
    inspectExistingInstallation();

  if (existingInstallation.handled) {
    return;
  }

  try {
    var initialCandidate =
      buildCandidate(1);

    currentState =
      initialCandidate.state;

    currentReceipt =
      initialCandidate.receipt;

    successfulSequence =
      initialCandidate.sequence;

    currentStatus =
      initialCandidate.status;

    var initialApi =
      createPublicApi();

    currentState = null;
    currentReceipt = null;
    successfulSequence = 0;
    currentStatus = "UNKNOWN";
    publicApi = null;

    performInitialInstallation(
      initialCandidate,
      initialApi
    );
  } catch (installationError) {
    var installationFailure =
      boundedError(
        installationError,
        "installation",
        "PUBLICATION_ERROR",
        null,
        {
          candidateSequence: 1,
          successfulSequence: 0,
          publicationPhase:
            "NOT_STARTED",
          previousStatePreserved:
            true,
          previousReceiptPreserved:
            true,
          sequencePreserved:
            true,
          rollbackAttempted:
            false,
          rollbackCompleted:
            null
        }
      );

    publishError(
      installationFailure
    );
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : typeof self !== "undefined"
        ? self
        : this
);
