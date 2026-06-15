// /showroom/globe/audralia/diagnostic/index.inspection.lane.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v1
// New-file construction.
// Diagnostic inspection-lane authority only.
// No canonical diagnostic-state ownership.
// No rendering ownership.
// No DOM event ownership.
// No participant-execution ownership.
//
// CANONICAL AUTHORITY:
// - AUDRALIA_DIAGNOSTIC_ENGINE_BOUNDED_REPORT_AND_FIBONACCI_ALIGNMENT_PREWRITE_v1
// - AUDRALIA_DIAGNOSTIC_ENGINE_BOUNDED_REPORT_FINAL_TIGHTENING_v1
// - AUDRALIA_DIAGNOSTIC_NEWS_FIBONACCI_AUTHORITY_ASSIGNMENT_v1
//
// N.E.W.S. / FIBONACCI AUTHORITY:
// - F3  / EAST:
//   External source discovery.
// - F5  / EAST:
//   Guarded acquisition, containment, and normalization.
// - F13 / WEST:
//   Bounded inspection output.
//
// SOLE OWNERSHIP:
// - guarded property reads;
// - guarded path reads;
// - participant alias discovery;
// - participant metadata inspection;
// - target-frame inspection;
// - runtime metadata inspection;
// - engine-family inspection;
// - registry inspection;
// - Surface Truth metadata inspection;
// - passive receipt-field inspection;
// - passive packet-field inspection;
// - host-object summarization;
// - bounded external graph traversal;
// - bounded status discovery;
// - inspection-lane execution containment;
// - inspection metrics;
// - truncation records;
// - normalized inspection errors;
// - initialization-safe inspection defaults;
// - inspection-lane public API;
// - inspection-lane authority receipt.
//
// DOES NOT OWN:
// - category registry;
// - audit registry;
// - canonical diagnostic state;
// - READ interpretation;
// - Result;
// - Evidence allocation into a final report;
// - Absence allocation into a final report;
// - Direction allocation into a final report;
// - Fibonacci synchronization judgment;
// - report construction;
// - report commitment;
// - diagnostic receipts;
// - cycle receipts;
// - cycle ledger;
// - archive;
// - engine rendering;
// - DOM rendering;
// - DOM events;
// - clipboard;
// - controls;
// - fallback presentation;
// - participant execution;
// - conductor execution;
// - direct execution;
// - nine-cycle execution;
// - production mutation;
// - runtime repair;
// - renderer repair;
// - canvas repair;
// - readiness claims;
// - visual-pass claims;
// - runtime-pass claims;
// - renderer-pass claims;
// - cycle-pass claims;
// - F21 claims.

(function installAudraliaDiagnosticInspectionLane(global) {
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

  var CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v1";

  var VERSION =
    "1.0.0";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.inspection.lane.js";

  var AUTHORITY =
    "AUDRALIA_DIAGNOSTIC_NEWS_FIBONACCI_AUTHORITY_ASSIGNMENT_v1";

  var LANE_SCHEMA =
    "AUDRALIA_BOUNDED_DIAGNOSTIC_EVIDENCE_LANE_v1";

  var INSPECTION_SCHEMA =
    "AUDRALIA_BOUNDED_DIAGNOSTIC_INSPECTION_v1";

  var ERROR_SCHEMA =
    "AUDRALIA_BOUNDED_DIAGNOSTIC_INSPECTION_ERROR_v1";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_RECEIPT_v1";

  var TARGET_FRAME_SCHEMA =
    "AUDRALIA_BOUNDED_TARGET_FRAME_INSPECTION_v1";

  var RUNTIME_SCHEMA =
    "AUDRALIA_BOUNDED_RUNTIME_METADATA_INSPECTION_v1";

  var ENGINE_FAMILY_SCHEMA =
    "AUDRALIA_BOUNDED_ENGINE_FAMILY_INSPECTION_v1";

  var REGISTRY_SCHEMA =
    "AUDRALIA_BOUNDED_REGISTRY_INSPECTION_v1";

  var PARTICIPANT_SCHEMA =
    "AUDRALIA_BOUNDED_PARTICIPANT_METADATA_INSPECTION_v1";

  var SURFACE_SCHEMA =
    "AUDRALIA_BOUNDED_SURFACE_TRUTH_INSPECTION_v1";

  var LIMITS =
    Object.freeze({
      maxExternalDepth: 6,
      maxExternalNodes: 256,
      maxExternalKeysPerObject: 64,
      maxExternalArrayItems: 64,
      maxExternalStringLength: 4096,
      maxExternalTotalStringBudget: 32768,
      maxStatusMatches: 16,
      maxPacketKeysReported: 64,
      maxCollectionRecords: 64,
      maxErrorMessageLength: 2048,
      maxErrorStackLength: 8192,
      maxErrorDetailStringLength: 4096,
      maxPathSegments: 32,
      maxPrototypeDepth: 4,
      maxParticipantRecords: 64,
      maxAliasesPerParticipant: 32,
      maxMethodsPerParticipant: 32,
      maxLaneEvidenceEntries: 128,
      maxLaneAbsenceEntries: 128,
      maxLaneDirectionEntries: 64
    });

  var VALID_LANE_STATUSES =
    Object.freeze([
      "COMPLETE",
      "AVAILABLE",
      "HELD",
      "MISSING",
      "ERROR",
      "UNKNOWN"
    ]);

  var VALID_INSPECTION_STATUSES =
    Object.freeze([
      "PASS",
      "AVAILABLE",
      "HELD",
      "MISSING",
      "ERROR",
      "UNKNOWN"
    ]);

  var HOST_TAGS =
    Object.freeze([
      "[object Window]",
      "[object global]",
      "[object Document]",
      "[object HTMLDocument]",
      "[object Element]",
      "[object HTMLElement]",
      "[object HTMLCanvasElement]",
      "[object CanvasRenderingContext2D]",
      "[object WebGLRenderingContext]",
      "[object WebGL2RenderingContext]",
      "[object Location]",
      "[object Navigator]"
    ]);

  var PASSIVE_FIELD_PRECEDENCE =
    Object.freeze([
      "RECEIPT",
      "receipt",
      "PACKET",
      "packet",
      "STATUS",
      "status",
      "CONTRACT",
      "contract",
      "VERSION",
      "version"
    ]);

  var REPORT_SAFE_ACCESSOR_DECLARATIONS =
    Object.freeze([
      "reportSafePassiveAccessors",
      "REPORT_SAFE_PASSIVE_ACCESSORS"
    ]);

  var FORBIDDEN_REPORT_METHODS =
    Object.freeze([
      "inspect",
      "probe",
      "interpret",
      "run",
      "execute",
      "synthesize",
      "point",
      "runNineCycle",
      "registerStation",
      "register"
    ]);

  var NO_CLAIMS =
    deepFreeze({
      canonicalStateOwned: false,
      reportAuthorityOwned: false,
      readInterpretationOwned: false,
      renderingOwned: false,
      controlsOwned: false,
      eventOwnershipClaimed: false,
      participantExecutionAuthorized: false,
      conductorExecutionAuthorized: false,
      directExecutionAuthorized: false,
      cycleExecutionAuthorized: false,
      productionMutationAuthorized: false,
      runtimeRepairAuthorized: false,
      rendererRepairAuthorized: false,
      canvasRepairAuthorized: false,
      readyClaimed: false,
      visualPassClaimed: false,
      runtimePassClaimed: false,
      rendererPassClaimed: false,
      cyclePassClaimed: false,
      f21Claimed: false
    });

  var installedAt =
    nowIso();

  var actionCount = 0;

  var lastAction = null;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function nowMs() {
    try {
      if (
        root &&
        root.performance &&
        typeof root.performance.now === "function"
      ) {
        return root.performance.now();
      }
    } catch (_error) {}

    return Date.now();
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

  function isPlainObject(value) {
    if (
      !value ||
      typeof value !== "object"
    ) {
      return false;
    }

    var prototype;

    try {
      prototype =
        Object.getPrototypeOf(value);
    } catch (_error) {
      return false;
    }

    return (
      prototype === null ||
      prototype === Object.prototype
    );
  }

  function isPromiseLike(value) {
    if (!isObjectLike(value)) {
      return false;
    }

    var read =
      safeReadProperty(
        value,
        "then",
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    return (
      read.ok &&
      read.present &&
      typeof read.value === "function"
    );
  }

  function trimString(value, maximum) {
    var text =
      String(
        value === null ||
        value === undefined
          ? ""
          : value
      );

    var limit =
      typeof maximum === "number" &&
      maximum >= 0
        ? maximum
        : LIMITS.maxExternalStringLength;

    if (text.length <= limit) {
      return text;
    }

    return text.slice(0, limit) + "…";
  }

  function normalizeLaneStatus(value) {
    var normalized =
      String(value || "UNKNOWN")
        .trim()
        .toUpperCase();

    return VALID_LANE_STATUSES.indexOf(normalized) !== -1
      ? normalized
      : "UNKNOWN";
  }

  function normalizeInspectionStatus(value) {
    var normalized =
      String(value || "UNKNOWN")
        .trim()
        .toUpperCase();

    return VALID_INSPECTION_STATUSES.indexOf(normalized) !== -1
      ? normalized
      : "UNKNOWN";
  }

  function uniqueStrings(values, maximum) {
    var output = [];

    var limit =
      typeof maximum === "number"
        ? maximum
        : values.length;

    (Array.isArray(values) ? values : [])
      .forEach(function addUnique(value) {
        if (output.length >= limit) {
          return;
        }

        var normalized =
          trimString(
            value,
            LIMITS.maxExternalStringLength
          );

        if (output.indexOf(normalized) === -1) {
          output.push(normalized);
        }
      });

    return output;
  }

  function cloneNormalized(value, seen) {
    var memory =
      seen || [];

    var output;
    var keys;
    var index;

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
      return value.toString();
    }

    if (typeof value === "function") {
      return {
        type: "Function",
        name: value.name || "anonymous"
      };
    }

    if (memory.indexOf(value) !== -1) {
      return "[Circular]";
    }

    memory.push(value);

    if (Array.isArray(value)) {
      output = [];

      for (
        index = 0;
        index < value.length;
        index += 1
      ) {
        output.push(
          cloneNormalized(
            value[index],
            memory.slice()
          )
        );
      }

      return output;
    }

    output = {};

    try {
      keys = Object.keys(value);
    } catch (_error) {
      return {
        unreadable: true,
        reason: "OBJECT_KEYS_THROW"
      };
    }

    keys.forEach(function cloneKey(key) {
      try {
        output[key] =
          cloneNormalized(
            value[key],
            memory.slice()
          );
      } catch (error) {
        output[key] = {
          unreadable: true,
          reason: "PROPERTY_READ_THROW",
          message:
            trimString(
              error && error.message
                ? error.message
                : error,
              LIMITS.maxErrorMessageLength
            )
        };
      }
    });

    return output;
  }

  function deepFreeze(value, seen) {
    var memory =
      seen || [];

    var names;
    var index;
    var child;

    if (!isObjectLike(value)) {
      return value;
    }

    if (memory.indexOf(value) !== -1) {
      return value;
    }

    memory.push(value);

    try {
      names =
        Object.getOwnPropertyNames(value);
    } catch (_error) {
      names = [];
    }

    for (
      index = 0;
      index < names.length;
      index += 1
    ) {
      try {
        child = value[names[index]];
      } catch (_error) {
        child = null;
      }

      deepFreeze(
        child,
        memory
      );
    }

    try {
      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function frozenClone(value) {
    return deepFreeze(
      cloneNormalized(value)
    );
  }

  function recordAction(action, detail) {
    actionCount += 1;

    lastAction =
      deepFreeze({
        action: action,
        actionNumber: actionCount,
        detail:
          cloneNormalized(
            detail || null
          ),
        occurredAt:
          nowIso()
      });

    publishReceipt();

    return frozenClone(lastAction);
  }

  function makeInspectionError(
    action,
    error,
    detail,
    path,
    property
  ) {
    var message =
      trimString(
        error && error.message
          ? error.message
          : error,
        LIMITS.maxErrorMessageLength
      );

    var stack = null;

    try {
      stack =
        error && error.stack
          ? trimString(
              error.stack,
              LIMITS.maxErrorStackLength
            )
          : null;
    } catch (_error) {}

    return deepFreeze({
      schema:
        ERROR_SCHEMA,
      errorId:
        "AUDRALIA_INSPECTION_ERROR_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2, 8),
      action:
        action || "UNKNOWN",
      path:
        path || null,
      property:
        property || null,
      code:
        error && error.code
          ? trimString(
              error.code,
              256
            )
          : null,
      message:
        message,
      stack:
        stack,
      detail:
        detail === null ||
        detail === undefined
          ? null
          : trimString(
              typeof detail === "string"
                ? detail
                : safeJson(detail),
              LIMITS.maxErrorDetailStringLength
            ),
      occurredAt:
        nowIso()
    });
  }

  function safeJson(value) {
    try {
      return JSON.stringify(
        cloneNormalized(value),
        null,
        2
      );
    } catch (_error) {
      return String(value);
    }
  }

  function getDescriptorWithoutInvocation(
    object,
    key,
    options
  ) {
    var config =
      options || {};

    var searchPrototype =
      config.searchPrototype !== false;

    var maximumPrototypeDepth =
      typeof config.maxPrototypeDepth === "number"
        ? config.maxPrototypeDepth
        : LIMITS.maxPrototypeDepth;

    var cursor =
      object;

    var depth = 0;

    var descriptor;

    while (
      cursor !== null &&
      cursor !== undefined &&
      depth <= maximumPrototypeDepth
    ) {
      try {
        descriptor =
          Object.getOwnPropertyDescriptor(
            Object(cursor),
            key
          );
      } catch (error) {
        return {
          ok: false,
          present: false,
          descriptor: null,
          owner: null,
          prototypeDepth: depth,
          error:
            makeInspectionError(
              "getDescriptorWithoutInvocation",
              error,
              null,
              null,
              key
            )
        };
      }

      if (descriptor) {
        return {
          ok: true,
          present: true,
          descriptor: descriptor,
          owner: cursor,
          prototypeDepth: depth,
          error: null
        };
      }

      if (!searchPrototype) {
        break;
      }

      try {
        cursor =
          Object.getPrototypeOf(cursor);
      } catch (error) {
        return {
          ok: false,
          present: false,
          descriptor: null,
          owner: null,
          prototypeDepth: depth,
          error:
            makeInspectionError(
              "getDescriptorWithoutInvocation",
              error,
              null,
              null,
              key
            )
        };
      }

      depth += 1;
    }

    return {
      ok: true,
      present: false,
      descriptor: null,
      owner: null,
      prototypeDepth: depth,
      error: null
    };
  }

  function safeReadProperty(
    object,
    key,
    options
  ) {
    var config =
      options || {};

    var allowAccessor =
      config.allowAccessor === true;

    if (
      object === null ||
      object === undefined
    ) {
      return {
        ok: false,
        present: false,
        value: null,
        property: key,
        source: null,
        accessor: false,
        blockedAccessor: false,
        prototypeDepth: null,
        error: null
      };
    }

    var descriptorResult =
      getDescriptorWithoutInvocation(
        object,
        key,
        config
      );

    if (!descriptorResult.ok) {
      return {
        ok: false,
        present: false,
        value: null,
        property: key,
        source: null,
        accessor: false,
        blockedAccessor: false,
        prototypeDepth:
          descriptorResult.prototypeDepth,
        error:
          descriptorResult.error
      };
    }

    if (!descriptorResult.present) {
      return {
        ok: true,
        present: false,
        value: null,
        property: key,
        source: null,
        accessor: false,
        blockedAccessor: false,
        prototypeDepth:
          descriptorResult.prototypeDepth,
        error: null
      };
    }

    var descriptor =
      descriptorResult.descriptor;

    if (
      Object.prototype.hasOwnProperty.call(
        descriptor,
        "value"
      )
    ) {
      return {
        ok: true,
        present: true,
        value:
          descriptor.value,
        property: key,
        source:
          descriptorResult.owner,
        accessor: false,
        blockedAccessor: false,
        prototypeDepth:
          descriptorResult.prototypeDepth,
        error: null
      };
    }

    if (!allowAccessor) {
      return {
        ok: true,
        present: true,
        value: null,
        property: key,
        source:
          descriptorResult.owner,
        accessor: true,
        blockedAccessor: true,
        prototypeDepth:
          descriptorResult.prototypeDepth,
        error: null
      };
    }

    if (typeof descriptor.get !== "function") {
      return {
        ok: true,
        present: true,
        value: undefined,
        property: key,
        source:
          descriptorResult.owner,
        accessor: true,
        blockedAccessor: false,
        prototypeDepth:
          descriptorResult.prototypeDepth,
        error: null
      };
    }

    try {
      return {
        ok: true,
        present: true,
        value:
          descriptor.get.call(object),
        property: key,
        source:
          descriptorResult.owner,
        accessor: true,
        blockedAccessor: false,
        prototypeDepth:
          descriptorResult.prototypeDepth,
        error: null
      };
    } catch (error) {
      return {
        ok: false,
        present: true,
        value: null,
        property: key,
        source:
          descriptorResult.owner,
        accessor: true,
        blockedAccessor: false,
        prototypeDepth:
          descriptorResult.prototypeDepth,
        error:
          makeInspectionError(
            "safeReadProperty",
            error,
            null,
            null,
            key
          )
      };
    }
  }

  function safeReadHostProperty(
    object,
    key
  ) {
    try {
      return {
        ok: true,
        present:
          object !== null &&
          object !== undefined,
        value:
          object[key],
        property:
          key,
        error:
          null
      };
    } catch (error) {
      return {
        ok: false,
        present: true,
        value: null,
        property:
          key,
        error:
          makeInspectionError(
            "safeReadHostProperty",
            error,
            null,
            null,
            key
          )
      };
    }
  }

  function safeReadPath(
    path,
    base,
    options
  ) {
    var parts =
      Array.isArray(path)
        ? path.slice()
        : String(path || "")
            .split(".")
            .filter(Boolean);

    if (
      parts.length >
      LIMITS.maxPathSegments
    ) {
      return {
        ok: false,
        present: false,
        value: null,
        resolvedSegments: [],
        failedSegment: null,
        blockedAccessor: false,
        error:
          makeInspectionError(
            "safeReadPath",
            new Error(
              "MAX_PATH_SEGMENTS_EXCEEDED"
            ),
            {
              segmentCount:
                parts.length
            },
            String(path || ""),
            null
          )
      };
    }

    var cursor =
      base || root;

    var resolved = [];

    var index;
    var read;

    for (
      index = 0;
      index < parts.length;
      index += 1
    ) {
      read =
        safeReadProperty(
          cursor,
          parts[index],
          options
        );

      if (!read.ok) {
        return {
          ok: false,
          present: false,
          value: null,
          resolvedSegments:
            resolved,
          failedSegment:
            parts[index],
          blockedAccessor:
            Boolean(
              read.blockedAccessor
            ),
          error:
            read.error
        };
      }

      if (!read.present) {
        return {
          ok: true,
          present: false,
          value: null,
          resolvedSegments:
            resolved,
          failedSegment:
            parts[index],
          blockedAccessor:
            false,
          error:
            null
        };
      }

      if (read.blockedAccessor) {
        return {
          ok: true,
          present: true,
          value: null,
          resolvedSegments:
            resolved,
          failedSegment:
            parts[index],
          blockedAccessor:
            true,
          error:
            null
        };
      }

      cursor =
        read.value;

      resolved.push(
        parts[index]
      );

      if (
        cursor === null ||
        cursor === undefined
      ) {
        if (
          index <
          parts.length - 1
        ) {
          return {
            ok: true,
            present: false,
            value: null,
            resolvedSegments:
              resolved,
            failedSegment:
              parts[index + 1],
            blockedAccessor:
              false,
            error:
              null
          };
        }
      }
    }

    return {
      ok: true,
      present: true,
      value:
        cursor,
      resolvedSegments:
        resolved,
      failedSegment:
        null,
      blockedAccessor:
        false,
      error:
        null
    };
  }

  function firstDefined(values) {
    var index;

    for (
      index = 0;
      index < values.length;
      index += 1
    ) {
      if (
        values[index] !== null &&
        values[index] !== undefined
      ) {
        return values[index];
      }
    }

    return null;
  }

  function readPrimitiveField(
    object,
    keys,
    options
  ) {
    var index;
    var read;

    for (
      index = 0;
      index < keys.length;
      index += 1
    ) {
      read =
        safeReadProperty(
          object,
          keys[index],
          options
        );

      if (
        read.ok &&
        read.present &&
        !read.blockedAccessor
      ) {
        if (
          read.value === null ||
          read.value === undefined ||
          typeof read.value === "string" ||
          typeof read.value === "number" ||
          typeof read.value === "boolean"
        ) {
          return {
            found: true,
            field:
              keys[index],
            value:
              read.value,
            blockedAccessor:
              false,
            error:
              null
          };
        }
      }

      if (
        read.ok &&
        read.present &&
        read.blockedAccessor
      ) {
        return {
          found: true,
          field:
            keys[index],
          value:
            null,
          blockedAccessor:
            true,
          error:
            null
        };
      }

      if (!read.ok) {
        return {
          found: false,
          field:
            keys[index],
          value:
            null,
          blockedAccessor:
            false,
          error:
            read.error
        };
      }
    }

    return {
      found: false,
      field: null,
      value: null,
      blockedAccessor: false,
      error: null
    };
  }

  function getTag(value) {
    try {
      return Object.prototype.toString.call(value);
    } catch (_error) {
      return "[object Unknown]";
    }
  }

  function isHostObject(value) {
    if (!isObjectLike(value)) {
      return false;
    }

    var tag =
      getTag(value);

    if (HOST_TAGS.indexOf(tag) !== -1) {
      return true;
    }

    try {
      if (
        root.Window &&
        value instanceof root.Window
      ) {
        return true;
      }
    } catch (_error) {}

    try {
      if (
        root.Document &&
        value instanceof root.Document
      ) {
        return true;
      }
    } catch (_error) {}

    try {
      if (
        root.Element &&
        value instanceof root.Element
      ) {
        return true;
      }
    } catch (_error) {}

    return false;
  }

  function summarizeWindow(value) {
    var output = {
      hostObject: true,
      kind: "Window",
      type:
        value &&
        value.constructor &&
        value.constructor.name
          ? value.constructor.name
          : "Window",
      pathname: null,
      href: null,
      documentPresent: false,
      errors: []
    };

    var locationRead =
      safeReadHostProperty(
        value,
        "location"
      );

    if (
      locationRead.ok &&
      locationRead.value
    ) {
      var pathnameRead =
        safeReadHostProperty(
          locationRead.value,
          "pathname"
        );

      var hrefRead =
        safeReadHostProperty(
          locationRead.value,
          "href"
        );

      if (pathnameRead.ok) {
        output.pathname =
          trimString(
            pathnameRead.value || "",
            1024
          );
      } else if (pathnameRead.error) {
        output.errors.push(
          pathnameRead.error
        );
      }

      if (hrefRead.ok) {
        output.href =
          trimString(
            hrefRead.value || "",
            2048
          );
      } else if (hrefRead.error) {
        output.errors.push(
          hrefRead.error
        );
      }
    } else if (locationRead.error) {
      output.errors.push(
        locationRead.error
      );
    }

    var documentRead =
      safeReadHostProperty(
        value,
        "document"
      );

    output.documentPresent =
      Boolean(
        documentRead.ok &&
        documentRead.value
      );

    if (
      !documentRead.ok &&
      documentRead.error
    ) {
      output.errors.push(
        documentRead.error
      );
    }

    return output;
  }

  function summarizeDocument(value) {
    var output = {
      hostObject: true,
      kind: "Document",
      type:
        value &&
        value.constructor &&
        value.constructor.name
          ? value.constructor.name
          : "Document",
      readyState: null,
      title: null,
      pathname: null,
      errors: []
    };

    var readyStateRead =
      safeReadHostProperty(
        value,
        "readyState"
      );

    if (readyStateRead.ok) {
      output.readyState =
        readyStateRead.value || null;
    } else if (readyStateRead.error) {
      output.errors.push(
        readyStateRead.error
      );
    }

    var titleRead =
      safeReadHostProperty(
        value,
        "title"
      );

    if (titleRead.ok) {
      output.title =
        trimString(
          titleRead.value || "",
          1024
        );
    } else if (titleRead.error) {
      output.errors.push(
        titleRead.error
      );
    }

    try {
      if (
        value.defaultView &&
        value.defaultView.location
      ) {
        output.pathname =
          trimString(
            value.defaultView.location.pathname || "",
            1024
          );
      }
    } catch (error) {
      output.errors.push(
        makeInspectionError(
          "summarizeDocument.pathname",
          error
        )
      );
    }

    return output;
  }

  function summarizeElement(value) {
    var output = {
      hostObject: true,
      kind: "Element",
      type:
        value &&
        value.constructor &&
        value.constructor.name
          ? value.constructor.name
          : "Element",
      id: null,
      tagName: null,
      hidden: null,
      connected: null,
      width: null,
      height: null,
      clientWidth: null,
      clientHeight: null,
      rect: null,
      dataset: {},
      errors: []
    };

    var idRead =
      safeReadHostProperty(
        value,
        "id"
      );

    if (idRead.ok) {
      output.id =
        trimString(
          idRead.value || "",
          512
        );
    } else if (idRead.error) {
      output.errors.push(
        idRead.error
      );
    }

    var tagRead =
      safeReadHostProperty(
        value,
        "tagName"
      );

    if (tagRead.ok) {
      output.tagName =
        tagRead.value || null;
    } else if (tagRead.error) {
      output.errors.push(
        tagRead.error
      );
    }

    var hiddenRead =
      safeReadHostProperty(
        value,
        "hidden"
      );

    if (hiddenRead.ok) {
      output.hidden =
        typeof hiddenRead.value === "boolean"
          ? hiddenRead.value
          : null;
    }

    var connectedRead =
      safeReadHostProperty(
        value,
        "isConnected"
      );

    if (connectedRead.ok) {
      output.connected =
        typeof connectedRead.value === "boolean"
          ? connectedRead.value
          : null;
    }

    [
      "width",
      "height",
      "clientWidth",
      "clientHeight"
    ].forEach(function inspectDimension(key) {
      var read =
        safeReadHostProperty(
          value,
          key
        );

      if (
        read.ok &&
        typeof read.value === "number"
      ) {
        output[key] =
          read.value;
      }
    });

    try {
      if (
        typeof value.getBoundingClientRect === "function"
      ) {
        var rect =
          value.getBoundingClientRect();

        output.rect = {
          width:
            Number(rect.width || 0),
          height:
            Number(rect.height || 0),
          top:
            Number(rect.top || 0),
          left:
            Number(rect.left || 0),
          right:
            Number(rect.right || 0),
          bottom:
            Number(rect.bottom || 0),
          nonzero:
            Number(rect.width || 0) > 0 &&
            Number(rect.height || 0) > 0
        };
      }
    } catch (error) {
      output.errors.push(
        makeInspectionError(
          "summarizeElement.getBoundingClientRect",
          error
        )
      );
    }

    try {
      if (value.dataset) {
        [
          "contract",
          "runtime",
          "status",
          "state",
          "fallback",
          "mounted"
        ].forEach(function inspectDatasetKey(key) {
          if (
            Object.prototype.hasOwnProperty.call(
              value.dataset,
              key
            )
          ) {
            output.dataset[key] =
              trimString(
                value.dataset[key],
                1024
              );
          }
        });
      }
    } catch (error) {
      output.errors.push(
        makeInspectionError(
          "summarizeElement.dataset",
          error
        )
      );
    }

    return output;
  }

  function summarizeHostObject(value) {
    var tag =
      getTag(value);

    if (
      tag === "[object Window]" ||
      tag === "[object global]"
    ) {
      return summarizeWindow(value);
    }

    if (
      tag === "[object Document]" ||
      tag === "[object HTMLDocument]"
    ) {
      return summarizeDocument(value);
    }

    try {
      if (
        value &&
        value.nodeType === 9
      ) {
        return summarizeDocument(value);
      }
    } catch (_error) {}

    try {
      if (
        value &&
        value.nodeType === 1
      ) {
        return summarizeElement(value);
      }
    } catch (_error) {}

    return {
      hostObject: true,
      kind:
        tag.replace(
          /^\[object |\]$/g,
          ""
        ),
      type:
        value &&
        value.constructor &&
        value.constructor.name
          ? value.constructor.name
          : "HostObject"
    };
  }

  function createSummaryContext() {
    return {
      visited:
        typeof WeakSet === "function"
          ? new WeakSet()
          : [],
      visitedNodeCount: 0,
      propertiesRead: 0,
      maximumDepthReached: 0,
      totalStringBudget: 0,
      truncated: false,
      truncationReason: null,
      omittedCount: 0,
      blockedAccessorCount: 0,
      unreadablePropertyCount: 0
    };
  }

  function contextHasVisited(
    context,
    value
  ) {
    if (
      context.visited &&
      typeof context.visited.has === "function"
    ) {
      return context.visited.has(value);
    }

    return context.visited.indexOf(value) !== -1;
  }

  function contextAddVisited(
    context,
    value
  ) {
    if (
      context.visited &&
      typeof context.visited.add === "function"
    ) {
      context.visited.add(value);
      return;
    }

    context.visited.push(value);
  }

  function markTruncated(
    context,
    reason,
    omittedCount
  ) {
    context.truncated = true;

    context.truncationReason =
      context.truncationReason ||
      reason;

    context.omittedCount +=
      Number(omittedCount || 0);
  }

  function summarizeExternalInternal(
    value,
    context,
    depth
  ) {
    var currentDepth =
      typeof depth === "number"
        ? depth
        : 0;

    if (
      currentDepth >
      context.maximumDepthReached
    ) {
      context.maximumDepthReached =
        currentDepth;
    }

    if (
      currentDepth >
      LIMITS.maxExternalDepth
    ) {
      markTruncated(
        context,
        "MAX_EXTERNAL_DEPTH"
      );

      return {
        truncated: true,
        reason: "MAX_EXTERNAL_DEPTH"
      };
    }

    if (
      value === null ||
      value === undefined
    ) {
      return value;
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "bigint") {
      return value.toString();
    }

    if (typeof value === "string") {
      var remaining =
        Math.max(
          0,
          LIMITS.maxExternalTotalStringBudget -
          context.totalStringBudget
        );

      if (remaining === 0) {
        markTruncated(
          context,
          "MAX_EXTERNAL_TOTAL_STRING_BUDGET"
        );

        return {
          truncated: true,
          reason:
            "MAX_EXTERNAL_TOTAL_STRING_BUDGET"
        };
      }

      var limited =
        trimString(
          value,
          Math.min(
            LIMITS.maxExternalStringLength,
            remaining
          )
        );

      context.totalStringBudget +=
        limited.length;

      if (limited.length < value.length) {
        markTruncated(
          context,
          "MAX_EXTERNAL_STRING_LENGTH",
          value.length - limited.length
        );
      }

      return limited;
    }

    if (typeof value === "function") {
      return {
        type: "Function",
        name:
          value.name || "anonymous",
        callable: true
      };
    }

    if (isHostObject(value)) {
      return summarizeHostObject(value);
    }

    if (contextHasVisited(context, value)) {
      return {
        circular: true
      };
    }

    if (
      context.visitedNodeCount >=
      LIMITS.maxExternalNodes
    ) {
      markTruncated(
        context,
        "MAX_EXTERNAL_NODES"
      );

      return {
        truncated: true,
        reason:
          "MAX_EXTERNAL_NODES"
      };
    }

    contextAddVisited(
      context,
      value
    );

    context.visitedNodeCount += 1;

    if (Array.isArray(value)) {
      var outputArray = [];

      var itemLimit =
        Math.min(
          value.length,
          LIMITS.maxExternalArrayItems
        );

      var arrayIndex;

      for (
        arrayIndex = 0;
        arrayIndex < itemLimit;
        arrayIndex += 1
      ) {
        context.propertiesRead += 1;

        var arrayRead =
          safeReadProperty(
            value,
            String(arrayIndex),
            {
              allowAccessor: false,
              searchPrototype: false
            }
          );

        if (!arrayRead.ok) {
          context.unreadablePropertyCount += 1;

          outputArray.push({
            unreadable: true,
            reason:
              "ARRAY_ITEM_READ_THROW",
            index:
              arrayIndex,
            error:
              arrayRead.error
          });

          continue;
        }

        if (arrayRead.blockedAccessor) {
          context.blockedAccessorCount += 1;

          outputArray.push({
            unreadable: true,
            reason:
              "ARRAY_ITEM_ACCESSOR_BLOCKED",
            index:
              arrayIndex
          });

          continue;
        }

        outputArray.push(
          summarizeExternalInternal(
            arrayRead.value,
            context,
            currentDepth + 1
          )
        );
      }

      if (value.length > itemLimit) {
        markTruncated(
          context,
          "MAX_EXTERNAL_ARRAY_ITEMS",
          value.length - itemLimit
        );
      }

      return outputArray;
    }

    var output = {};

    var keys;

    try {
      keys =
        Object.keys(value);
    } catch (error) {
      context.unreadablePropertyCount += 1;

      return {
        unreadable: true,
        reason:
          "OBJECT_KEYS_THROW",
        error:
          makeInspectionError(
            "summarizeExternal.Object.keys",
            error
          )
      };
    }

    var keyLimit =
      Math.min(
        keys.length,
        LIMITS.maxExternalKeysPerObject
      );

    var keyIndex;

    for (
      keyIndex = 0;
      keyIndex < keyLimit;
      keyIndex += 1
    ) {
      var key =
        keys[keyIndex];

      context.propertiesRead += 1;

      var propertyRead =
        safeReadProperty(
          value,
          key,
          {
            allowAccessor: false,
            searchPrototype: false
          }
        );

      if (!propertyRead.ok) {
        context.unreadablePropertyCount += 1;

        output[key] = {
          unreadable: true,
          reason:
            "PROPERTY_READ_THROW",
          property:
            key,
          error:
            propertyRead.error
        };

        continue;
      }

      if (propertyRead.blockedAccessor) {
        context.blockedAccessorCount += 1;

        output[key] = {
          unreadable: true,
          reason:
            "PROPERTY_ACCESSOR_BLOCKED",
          property:
            key
        };

        continue;
      }

      output[key] =
        summarizeExternalInternal(
          propertyRead.value,
          context,
          currentDepth + 1
        );
    }

    if (keys.length > keyLimit) {
      markTruncated(
        context,
        "MAX_EXTERNAL_KEYS_PER_OBJECT",
        keys.length - keyLimit
      );
    }

    return output;
  }

  function summarizeExternal(value) {
    var context =
      createSummaryContext();

    var summary =
      summarizeExternalInternal(
        value,
        context,
        0
      );

    return deepFreeze({
      schema:
        INSPECTION_SCHEMA,
      status:
        context.truncated
          ? "AVAILABLE"
          : "PASS",
      summary:
        summary,
      metrics:
        createMetricsFromContext(
          context
        ),
      noClaims:
        NO_CLAIMS
    });
  }

  function createMetricsFromContext(context) {
    return {
      truncated:
        Boolean(context.truncated),
      truncationReason:
        context.truncationReason || null,
      visitedNodeCount:
        Number(
          context.visitedNodeCount || 0
        ),
      propertiesRead:
        Number(
          context.propertiesRead || 0
        ),
      maximumDepthReached:
        Number(
          context.maximumDepthReached || 0
        ),
      totalStringBudget:
        Number(
          context.totalStringBudget || 0
        ),
      omittedCount:
        Number(
          context.omittedCount || 0
        ),
      blockedAccessorCount:
        Number(
          context.blockedAccessorCount || 0
        ),
      unreadablePropertyCount:
        Number(
          context.unreadablePropertyCount || 0
        )
    };
  }

  function emptyMetrics() {
    return {
      truncated: false,
      truncationReason: null,
      visitedNodeCount: 0,
      propertiesRead: 0,
      maximumDepthReached: 0,
      totalStringBudget: 0,
      omittedCount: 0,
      blockedAccessorCount: 0,
      unreadablePropertyCount: 0,
      durationMs: 0
    };
  }

  function mergeMetrics(target, source) {
    var output =
      target || emptyMetrics();

    if (!source) {
      return output;
    }

    output.truncated =
      output.truncated ||
      Boolean(source.truncated);

    output.truncationReason =
      output.truncationReason ||
      source.truncationReason ||
      null;

    output.visitedNodeCount +=
      Number(
        source.visitedNodeCount || 0
      );

    output.propertiesRead +=
      Number(
        source.propertiesRead || 0
      );

    output.maximumDepthReached =
      Math.max(
        output.maximumDepthReached,
        Number(
          source.maximumDepthReached || 0
        )
      );

    output.totalStringBudget +=
      Number(
        source.totalStringBudget || 0
      );

    output.omittedCount +=
      Number(
        source.omittedCount || 0
      );

    output.blockedAccessorCount +=
      Number(
        source.blockedAccessorCount || 0
      );

    output.unreadablePropertyCount +=
      Number(
        source.unreadablePropertyCount || 0
      );

    output.durationMs +=
      Number(
        source.durationMs || 0
      );

    return output;
  }

  function findStatuses(
    value,
    requestedStatuses
  ) {
    var targets =
      (Array.isArray(requestedStatuses)
        ? requestedStatuses
        : []
      )
        .map(function normalizeRequestedStatus(status) {
          return String(status || "")
            .trim()
            .toUpperCase();
        })
        .filter(Boolean);

    var context =
      createSummaryContext();

    var matches = [];

    function walk(node, path, depth) {
      if (
        matches.length >=
        LIMITS.maxStatusMatches
      ) {
        markTruncated(
          context,
          "MAX_STATUS_MATCHES"
        );

        return;
      }

      if (
        node === null ||
        node === undefined ||
        typeof node !== "object"
      ) {
        return;
      }

      if (isHostObject(node)) {
        return;
      }

      if (
        depth >
        LIMITS.maxExternalDepth
      ) {
        markTruncated(
          context,
          "MAX_EXTERNAL_DEPTH"
        );

        return;
      }

      if (
        context.visitedNodeCount >=
        LIMITS.maxExternalNodes
      ) {
        markTruncated(
          context,
          "MAX_EXTERNAL_NODES"
        );

        return;
      }

      if (contextHasVisited(context, node)) {
        return;
      }

      contextAddVisited(
        context,
        node
      );

      context.visitedNodeCount += 1;

      var statusRead =
        safeReadProperty(
          node,
          "status",
          {
            allowAccessor: false,
            searchPrototype: false
          }
        );

      if (
        statusRead.ok &&
        statusRead.present &&
        !statusRead.blockedAccessor &&
        typeof statusRead.value === "string"
      ) {
        var normalizedStatus =
          statusRead.value
            .trim()
            .toUpperCase();

        if (
          targets.indexOf(normalizedStatus) !== -1
        ) {
          matches.push({
            path:
              path || "root",
            status:
              normalizedStatus,
            summary:
              summarizeExternal(node)
                .summary
          });
        }
      }

      var keys;

      try {
        keys =
          Object.keys(node);
      } catch (_error) {
        return;
      }

      var keyLimit =
        Math.min(
          keys.length,
          LIMITS.maxExternalKeysPerObject
        );

      var index;

      for (
        index = 0;
        index < keyLimit;
        index += 1
      ) {
        context.propertiesRead += 1;

        var key =
          keys[index];

        var read =
          safeReadProperty(
            node,
            key,
            {
              allowAccessor: false,
              searchPrototype: false
            }
          );

        if (
          read.ok &&
          read.present &&
          !read.blockedAccessor
        ) {
          walk(
            read.value,
            path
              ? path + "." + key
              : key,
            depth + 1
          );
        } else if (
          read.blockedAccessor
        ) {
          context.blockedAccessorCount += 1;
        } else if (!read.ok) {
          context.unreadablePropertyCount += 1;
        }

        if (
          matches.length >=
          LIMITS.maxStatusMatches
        ) {
          break;
        }
      }

      if (keys.length > keyLimit) {
        markTruncated(
          context,
          "MAX_EXTERNAL_KEYS_PER_OBJECT",
          keys.length - keyLimit
        );
      }
    }

    walk(
      value,
      "",
      0
    );

    return deepFreeze({
      schema:
        INSPECTION_SCHEMA,
      status:
        context.truncated
          ? "AVAILABLE"
          : "PASS",
      matches:
        matches,
      metrics:
        createMetricsFromContext(
          context
        ),
      noClaims:
        NO_CLAIMS
    });
  }

  function normalizeManifestEntry(entry) {
    return {
      role:
        trimString(
          entry && entry.role,
          256
        ),
      label:
        trimString(
          entry && entry.label,
          512
        ),
      path:
        trimString(
          entry && entry.path,
          2048
        ),
      required:
        Boolean(
          entry && entry.required
        ),
      auxiliary:
        Boolean(
          entry && entry.auxiliary
        ),
      direction:
        trimString(
          entry && entry.direction,
          128
        ) || "UNKNOWN",
      cyclePosition:
        entry &&
        typeof entry.cyclePosition === "number"
          ? entry.cyclePosition
          : null,
      fibonacci:
        entry && entry.fibonacci
          ? trimString(
              entry.fibonacci,
              64
            )
          : null,
      parentCyclePosition:
        entry &&
        typeof entry.parentCyclePosition === "number"
          ? entry.parentCyclePosition
          : null,
      parentFibonacci:
        entry && entry.parentFibonacci
          ? trimString(
              entry.parentFibonacci,
              64
            )
          : null,
      aliases:
        Array.isArray(
          entry && entry.aliases
        )
          ? entry.aliases
              .slice(
                0,
                LIMITS.maxAliasesPerParticipant
              )
              .filter(function aliasIsString(alias) {
                return typeof alias === "string";
              })
              .map(function normalizeAlias(alias) {
                return trimString(alias, 512);
              })
          : [],
      methods:
        Array.isArray(
          entry && entry.methods
        )
          ? entry.methods
              .slice(
                0,
                LIMITS.maxMethodsPerParticipant
              )
              .filter(function methodIsString(method) {
                return typeof method === "string";
              })
              .map(function normalizeMethod(method) {
                return trimString(method, 128);
              })
          : [],
      executionMethods:
        Array.isArray(
          entry && entry.executionMethods
        )
          ? entry.executionMethods
              .slice(
                0,
                LIMITS.maxMethodsPerParticipant
              )
              .filter(function methodIsString(method) {
                return typeof method === "string";
              })
              .map(function normalizeMethod(method) {
                return trimString(method, 128);
              })
          : [],
      registrationMethods:
        Array.isArray(
          entry && entry.registrationMethods
        )
          ? entry.registrationMethods
              .slice(
                0,
                LIMITS.maxMethodsPerParticipant
              )
              .filter(function methodIsString(method) {
                return typeof method === "string";
              })
              .map(function normalizeMethod(method) {
                return trimString(method, 128);
              })
          : []
    };
  }

  function resolveAlias(
    aliases,
    base
  ) {
    var candidates =
      Array.isArray(aliases)
        ? aliases.slice(
            0,
            LIMITS.maxAliasesPerParticipant
          )
        : [];

    var index;
    var resolution;

    for (
      index = 0;
      index < candidates.length;
      index += 1
    ) {
      resolution =
        safeReadPath(
          candidates[index],
          base || root,
          {
            allowAccessor: false,
            searchPrototype: true
          }
        );

      if (
        resolution.ok &&
        resolution.present &&
        !resolution.blockedAccessor
      ) {
        return {
          found: true,
          alias:
            candidates[index],
          value:
            resolution.value,
          blockedAccessor:
            false,
          error:
            null
        };
      }

      if (
        resolution.present &&
        resolution.blockedAccessor
      ) {
        return {
          found: false,
          alias:
            candidates[index],
          value:
            null,
          blockedAccessor:
            true,
          error:
            null
        };
      }

      if (!resolution.ok) {
        return {
          found: false,
          alias:
            candidates[index],
          value:
            null,
          blockedAccessor:
            false,
          error:
            resolution.error
        };
      }
    }

    return {
      found: false,
      alias: null,
      value: null,
      blockedAccessor: false,
      error: null
    };
  }

  function inspectCallableMethods(
    value,
    methods
  ) {
    var availableMethods = [];

    var blockedMethods = [];

    var errors = [];

    (Array.isArray(methods) ? methods : [])
      .slice(
        0,
        LIMITS.maxMethodsPerParticipant
      )
      .forEach(function inspectMethod(method) {
        var read =
          safeReadProperty(
            value,
            method,
            {
              allowAccessor: false,
              searchPrototype: true
            }
          );

        if (!read.ok) {
          errors.push(
            read.error
          );
          return;
        }

        if (read.blockedAccessor) {
          blockedMethods.push(
            method
          );
          return;
        }

        if (
          read.present &&
          typeof read.value === "function"
        ) {
          availableMethods.push(
            method
          );
        }
      });

    return {
      availableMethods:
        availableMethods,
      blockedMethods:
        blockedMethods,
      errors:
        errors
    };
  }

  function inspectParticipantRecord(
    manifestEntry
  ) {
    var manifest =
      normalizeManifestEntry(
        manifestEntry
      );

    var resolution =
      resolveAlias(
        manifest.aliases,
        root
      );

    var value =
      resolution.value;

    var methodSet =
      manifest.role === "NORTH_CONDUCTOR" &&
      manifest.executionMethods.length
        ? manifest.executionMethods
        : manifest.methods;

    var callableInspection =
      inspectCallableMethods(
        value,
        methodSet
      );

    var registrationInspection =
      manifest.role === "NORTH_CONDUCTOR"
        ? inspectCallableMethods(
            value,
            manifest.registrationMethods
          )
        : {
            availableMethods: [],
            blockedMethods: [],
            errors: []
          };

    var contractRead =
      readPrimitiveField(
        value,
        [
          "CONTRACT",
          "contract"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var versionRead =
      readPrimitiveField(
        value,
        [
          "VERSION",
          "version"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var available =
      Boolean(
        resolution.found
      );

    var callable =
      callableInspection
        .availableMethods
        .length > 0 ||
      typeof value === "function";

    var status;

    if (
      resolution.error ||
      callableInspection.errors.length
    ) {
      status = "ERROR";
    } else if (!available) {
      status =
        manifest.required
          ? "MISSING"
          : "UNKNOWN";
    } else if (!callable) {
      status =
        manifest.required
          ? "HELD"
          : "AVAILABLE";
    } else {
      status = "PASS";
    }

    return deepFreeze({
      schema:
        PARTICIPANT_SCHEMA,
      role:
        manifest.role,
      label:
        manifest.label,
      path:
        manifest.path,
      required:
        manifest.required,
      auxiliary:
        manifest.auxiliary,
      direction:
        manifest.direction,
      cyclePosition:
        manifest.cyclePosition,
      fibonacci:
        manifest.fibonacci,
      parentCyclePosition:
        manifest.parentCyclePosition,
      parentFibonacci:
        manifest.parentFibonacci,
      aliases:
        manifest.aliases,
      resolvedAlias:
        resolution.alias,
      available:
        available,
      callable:
        callable,
      callableMethod:
        typeof value === "function"
          ? "[[callable]]"
          : callableInspection.availableMethods[0] ||
            null,
      callableMethods:
        callableInspection.availableMethods,
      blockedMethods:
        callableInspection.blockedMethods,
      registrationMethods:
        registrationInspection.availableMethods,
      blockedRegistrationMethods:
        registrationInspection.blockedMethods,
      contract:
        contractRead.found &&
        !contractRead.blockedAccessor
          ? contractRead.value
          : null,
      version:
        versionRead.found &&
        !versionRead.blockedAccessor
          ? versionRead.value
          : null,
      contractAccessorBlocked:
        Boolean(
          contractRead.blockedAccessor
        ),
      versionAccessorBlocked:
        Boolean(
          versionRead.blockedAccessor
        ),
      status:
        normalizeInspectionStatus(status),
      errors:
        []
          .concat(
            resolution.error
              ? [resolution.error]
              : []
          )
          .concat(
            callableInspection.errors
          )
          .concat(
            registrationInspection.errors
          ),
      observedAt:
        nowIso(),
      noClaims:
        NO_CLAIMS
    });
  }

  function inspectParticipants(manifest) {
    var startedAt =
      nowMs();

    var entries =
      Array.isArray(manifest)
        ? manifest.slice(
            0,
            LIMITS.maxParticipantRecords
          )
        : [];

    var records =
      entries.map(
        inspectParticipantRecord
      );

    var required =
      records.filter(function requiredRecord(record) {
        return record.required;
      });

    var available =
      required.filter(function availableRecord(record) {
        return (
          record.available &&
          record.callable
        );
      });

    var held =
      required.filter(function heldRecord(record) {
        return (
          !record.available ||
          !record.callable
        );
      });

    var errorCount =
      records.filter(function errorRecord(record) {
        return record.status === "ERROR";
      }).length;

    var status;

    if (errorCount) {
      status = "ERROR";
    } else if (held.length) {
      status = "HELD";
    } else if (records.length) {
      status = "PASS";
    } else {
      status = "MISSING";
    }

    var result =
      deepFreeze({
        schema:
          PARTICIPANT_SCHEMA,
        status:
          normalizeInspectionStatus(status),
        records:
          records,
        counts: {
          manifestCount:
            Array.isArray(manifest)
              ? manifest.length
              : 0,
          inspectedCount:
            records.length,
          requiredCount:
            required.length,
          availableRequiredCount:
            available.length,
          heldRequiredCount:
            held.length,
          errorCount:
            errorCount
        },
        truncated:
          Array.isArray(manifest) &&
          manifest.length >
            LIMITS.maxParticipantRecords,
        metrics: {
          durationMs:
            Math.max(
              0,
              nowMs() - startedAt
            ),
          truncated:
            Array.isArray(manifest) &&
            manifest.length >
              LIMITS.maxParticipantRecords,
          truncationReason:
            Array.isArray(manifest) &&
            manifest.length >
              LIMITS.maxParticipantRecords
              ? "MAX_PARTICIPANT_RECORDS"
              : null,
          omittedCount:
            Array.isArray(manifest)
              ? Math.max(
                  0,
                  manifest.length -
                  LIMITS.maxParticipantRecords
                )
              : 0
        },
        noClaims:
          NO_CLAIMS
      });

    recordAction(
      "inspectParticipants",
      {
        status:
          result.status,
        inspectedCount:
          result.counts.inspectedCount,
        heldRequiredCount:
          result.counts.heldRequiredCount
      }
    );

    return result;
  }

  function inspectTargetFrame(
    frameId,
    targetRoute
  ) {
    var startedAt =
      nowMs();

    var expectedFrameId =
      trimString(
        frameId ||
        "audraliaDiagnosticTargetFrame",
        512
      );

    var expectedRoute =
      trimString(
        targetRoute ||
        "/showroom/globe/audralia/",
        2048
      );

    var result = {
      schema:
        TARGET_FRAME_SCHEMA,
      status:
        "UNKNOWN",
      frameId:
        expectedFrameId,
      expectedRoute:
        expectedRoute,
      framePresent:
        false,
      sameOrigin:
        false,
      documentPresent:
        false,
      documentState:
        "UNKNOWN",
      routeMatch:
        false,
      pathname:
        null,
      title:
        null,
      frameRect:
        null,
      frameSummary:
        null,
      errors:
        [],
      metrics:
        emptyMetrics(),
      observedAt:
        nowIso(),
      noClaims:
        NO_CLAIMS
    };

    if (!doc) {
      result.status =
        "MISSING";

      result.errors.push(
        makeInspectionError(
          "inspectTargetFrame",
          new Error(
            "DOCUMENT_NOT_AVAILABLE"
          )
        )
      );

      result.metrics.durationMs =
        Math.max(
          0,
          nowMs() - startedAt
        );

      return deepFreeze(result);
    }

    var frame = null;

    try {
      frame =
        doc.getElementById(
          expectedFrameId
        );
    } catch (error) {
      result.status =
        "ERROR";

      result.errors.push(
        makeInspectionError(
          "inspectTargetFrame.getElementById",
          error,
          {
            frameId:
              expectedFrameId
          }
        )
      );

      result.metrics.durationMs =
        Math.max(
          0,
          nowMs() - startedAt
        );

      return deepFreeze(result);
    }

    if (!frame) {
      result.status =
        "MISSING";

      result.metrics.durationMs =
        Math.max(
          0,
          nowMs() - startedAt
        );

      recordAction(
        "inspectTargetFrame",
        {
          status:
            result.status,
          frameId:
            expectedFrameId
        }
      );

      return deepFreeze(result);
    }

    result.framePresent =
      true;

    result.frameSummary =
      summarizeElement(frame);

    result.frameRect =
      result.frameSummary.rect;

    var contentWindowRead =
      safeReadHostProperty(
        frame,
        "contentWindow"
      );

    var contentDocumentRead =
      safeReadHostProperty(
        frame,
        "contentDocument"
      );

    var frameWindow =
      contentWindowRead.ok
        ? contentWindowRead.value
        : null;

    var frameDocument =
      contentDocumentRead.ok
        ? contentDocumentRead.value
        : null;

    if (
      !frameDocument &&
      frameWindow
    ) {
      var frameWindowDocumentRead =
        safeReadHostProperty(
          frameWindow,
          "document"
        );

      if (frameWindowDocumentRead.ok) {
        frameDocument =
          frameWindowDocumentRead.value;
      } else if (
        frameWindowDocumentRead.error
      ) {
        result.errors.push(
          frameWindowDocumentRead.error
        );
      }
    }

    result.documentPresent =
      Boolean(frameDocument);

    result.sameOrigin =
      Boolean(frameDocument);

    if (frameDocument) {
      var documentSummary =
        summarizeDocument(
          frameDocument
        );

      result.documentState =
        documentSummary.readyState ||
        "UNKNOWN";

      result.title =
        documentSummary.title;

      result.pathname =
        documentSummary.pathname;

      result.errors =
        result.errors.concat(
          documentSummary.errors || []
        );
    }

    if (
      !result.pathname &&
      frameWindow
    ) {
      var windowSummary =
        summarizeWindow(
          frameWindow
        );

      result.pathname =
        windowSummary.pathname;

      result.errors =
        result.errors.concat(
          windowSummary.errors || []
        );
    }

    result.routeMatch =
      Boolean(
        result.pathname &&
        (
          result.pathname === expectedRoute ||
          result.pathname ===
            expectedRoute.replace(
              /\/$/,
              ""
            )
        )
      );

    result.status =
      result.errors.length
        ? "AVAILABLE"
        : result.sameOrigin
          ? "PASS"
          : "AVAILABLE";

    result.metrics.durationMs =
      Math.max(
        0,
        nowMs() - startedAt
      );

    recordAction(
      "inspectTargetFrame",
      {
        status:
          result.status,
        framePresent:
          result.framePresent,
        sameOrigin:
          result.sameOrigin,
        routeMatch:
          result.routeMatch
      }
    );

    return deepFreeze(result);
  }

  function inspectCanvasPixel(
    canvas
  ) {
    if (!canvas) {
      return {
        inspected: false,
        visiblePixel: null,
        reason:
          "CANVAS_NOT_AVAILABLE",
        error: null
      };
    }

    var tagNameRead =
      safeReadHostProperty(
        canvas,
        "tagName"
      );

    if (
      !tagNameRead.ok ||
      String(
        tagNameRead.value || ""
      ).toUpperCase() !== "CANVAS"
    ) {
      return {
        inspected: false,
        visiblePixel: null,
        reason:
          "TARGET_NOT_CANVAS",
        error:
          tagNameRead.error || null
      };
    }

    try {
      var width =
        Number(canvas.width || 0);

      var height =
        Number(canvas.height || 0);

      if (
        width <= 0 ||
        height <= 0
      ) {
        return {
          inspected: false,
          visiblePixel: null,
          reason:
            "CANVAS_DIMENSIONS_ZERO",
          error: null
        };
      }

      if (
        typeof canvas.getContext !== "function"
      ) {
        return {
          inspected: false,
          visiblePixel: null,
          reason:
            "CANVAS_CONTEXT_METHOD_MISSING",
          error: null
        };
      }

      var context =
        canvas.getContext("2d");

      if (
        !context ||
        typeof context.getImageData !== "function"
      ) {
        return {
          inspected: false,
          visiblePixel: null,
          reason:
            "CANVAS_2D_CONTEXT_UNAVAILABLE",
          error: null
        };
      }

      var x =
        Math.max(
          0,
          Math.floor(width / 2)
        );

      var y =
        Math.max(
          0,
          Math.floor(height / 2)
        );

      var pixel =
        context
          .getImageData(
            x,
            y,
            1,
            1
          )
          .data;

      return {
        inspected: true,
        visiblePixel:
          pixel[3] > 0,
        reason: null,
        error: null
      };
    } catch (error) {
      return {
        inspected: false,
        visiblePixel: null,
        reason:
          "CANVAS_PIXEL_INSPECTION_ERROR",
        error:
          makeInspectionError(
            "inspectCanvasPixel",
            error
          )
      };
    }
  }

  function inspectRuntime(
    targetWindow,
    options
  ) {
    var startedAt =
      nowMs();

    var config =
      options || {};

    var runtimeAliases =
      Array.isArray(config.runtimeAliases)
        ? config.runtimeAliases
            .slice(
              0,
              LIMITS.maxAliasesPerParticipant
            )
        : [
            "AUDRALIA_RUNTIME",
            "AUDRALIA.runtime",
            "AUDRALIA_ENGINE",
            "AUDRALIA.engine",
            "AUDRALIA_CANVAS",
            "AUDRALIA.canvas"
          ];

    var mountSelectors =
      Array.isArray(config.mountSelectors)
        ? config.mountSelectors
            .slice(
              0,
              LIMITS.maxAliasesPerParticipant
            )
        : [
            "#audraliaCanvasMount",
            "#audraliaMount",
            "#globeMount",
            "canvas"
          ];

    var source =
      targetWindow || root;

    var runtimeResolution =
      resolveAlias(
        runtimeAliases,
        source
      );

    var runtime =
      runtimeResolution.value;

    var targetDocument = null;

    if (targetWindow) {
      var targetDocumentRead =
        safeReadHostProperty(
          targetWindow,
          "document"
        );

      if (targetDocumentRead.ok) {
        targetDocument =
          targetDocumentRead.value;
      }
    }

    if (
      !targetDocument &&
      source === root
    ) {
      targetDocument =
        doc;
    }

    var mount = null;

    var mountSelector = null;

    var mountErrors = [];

    if (targetDocument) {
      var selectorIndex;

      for (
        selectorIndex = 0;
        selectorIndex < mountSelectors.length;
        selectorIndex += 1
      ) {
        try {
          mount =
            targetDocument.querySelector(
              mountSelectors[selectorIndex]
            );
        } catch (error) {
          mountErrors.push(
            makeInspectionError(
              "inspectRuntime.querySelector",
              error,
              {
                selector:
                  mountSelectors[selectorIndex]
              }
            )
          );
        }

        if (mount) {
          mountSelector =
            mountSelectors[selectorIndex];
          break;
        }
      }
    }

    var mountSummary =
      mount
        ? summarizeElement(mount)
        : null;

    var contractRead =
      readPrimitiveField(
        runtime,
        [
          "CONTRACT",
          "contract"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var mountedRead =
      readPrimitiveField(
        runtime,
        [
          "mounted",
          "isMounted"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var statusRead =
      readPrimitiveField(
        runtime,
        [
          "STATUS",
          "status"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var firstFrameRead =
      readPrimitiveField(
        runtime,
        [
          "firstFrame",
          "firstFrameRendered",
          "frameReady"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var visiblePixelRead =
      readPrimitiveField(
        runtime,
        [
          "visiblePixel",
          "pixelVisible",
          "hasVisiblePixel"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var fallbackRead =
      readPrimitiveField(
        runtime,
        [
          "fallback",
          "fallbackActive"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var receiptField =
      firstPresentField(
        runtime,
        [
          "RECEIPT",
          "receipt"
        ]
      );

    var pixelInspection =
      config.allowPixelRead === true
        ? inspectCanvasPixel(mount)
        : {
            inspected: false,
            visiblePixel: null,
            reason:
              "PIXEL_READ_NOT_AUTHORIZED",
            error: null
          };

    var runtimeMounted =
      firstDefined([
        mountedRead.found &&
        !mountedRead.blockedAccessor
          ? mountedRead.value
          : null,
        statusRead.found &&
        String(statusRead.value || "")
          .toUpperCase() === "MOUNTED"
          ? true
          : null
      ]);

    var visiblePixel =
      firstDefined([
        visiblePixelRead.found &&
        !visiblePixelRead.blockedAccessor
          ? visiblePixelRead.value
          : null,
        pixelInspection.visiblePixel
      ]);

    var errors = []
      .concat(
        runtimeResolution.error
          ? [runtimeResolution.error]
          : []
      )
      .concat(
        mountErrors
      )
      .concat(
        pixelInspection.error
          ? [pixelInspection.error]
          : []
      )
      .concat(
        contractRead.error
          ? [contractRead.error]
          : []
      )
      .concat(
        mountedRead.error
          ? [mountedRead.error]
          : []
      )
      .concat(
        statusRead.error
          ? [statusRead.error]
          : []
      )
      .concat(
        firstFrameRead.error
          ? [firstFrameRead.error]
          : []
      )
      .concat(
        visiblePixelRead.error
          ? [visiblePixelRead.error]
          : []
      )
      .concat(
        fallbackRead.error
          ? [fallbackRead.error]
          : []
      );

    var status;

    if (errors.length) {
      status = "AVAILABLE";
    } else if (
      runtimeResolution.found &&
      mount
    ) {
      status = "PASS";
    } else if (
      runtimeResolution.found ||
      mount
    ) {
      status = "AVAILABLE";
    } else {
      status = "MISSING";
    }

    var result =
      deepFreeze({
        schema:
          RUNTIME_SCHEMA,
        status:
          normalizeInspectionStatus(status),
        runtimeAlias:
          runtimeResolution.alias,
        runtimeFound:
          runtimeResolution.found,
        runtimeAccessorBlocked:
          runtimeResolution.blockedAccessor,
        runtimeContract:
          contractRead.found &&
          !contractRead.blockedAccessor
            ? contractRead.value
            : null,
        runtimeStatus:
          statusRead.found &&
          !statusRead.blockedAccessor
            ? statusRead.value
            : null,
        runtimeMounted:
          runtimeMounted,
        mountFound:
          Boolean(mount),
        mountSelector:
          mountSelector,
        mountSummary:
          mountSummary,
        stageRectNonzero:
          mountSummary &&
          mountSummary.rect
            ? mountSummary.rect.nonzero
            : null,
        firstFrame:
          firstFrameRead.found &&
          !firstFrameRead.blockedAccessor
            ? firstFrameRead.value
            : null,
        visiblePixel:
          visiblePixel,
        pixelInspection:
          pixelInspection,
        fallback:
          fallbackRead.found &&
          !fallbackRead.blockedAccessor
            ? fallbackRead.value
            : null,
        passiveReceiptFieldPresent:
          Boolean(
            receiptField &&
            receiptField.found
          ),
        passiveReceiptField:
          receiptField &&
          receiptField.found
            ? receiptField.field
            : null,
        errors:
          errors,
        metrics: {
          durationMs:
            Math.max(
              0,
              nowMs() - startedAt
            )
        },
        observedAt:
          nowIso(),
        noClaims:
          NO_CLAIMS
      });

    recordAction(
      "inspectRuntime",
      {
        status:
          result.status,
        runtimeFound:
          result.runtimeFound,
        mountFound:
          result.mountFound
      }
    );

    return result;
  }

  function normalizeExternalCollection(
    value
  ) {
    var startedAt =
      nowMs();

    var records = [];

    var metrics =
      emptyMetrics();

    if (Array.isArray(value)) {
      var arrayLimit =
        Math.min(
          value.length,
          LIMITS.maxCollectionRecords
        );

      var arrayIndex;

      for (
        arrayIndex = 0;
        arrayIndex < arrayLimit;
        arrayIndex += 1
      ) {
        var itemRead =
          safeReadProperty(
            value,
            String(arrayIndex),
            {
              allowAccessor: false,
              searchPrototype: false
            }
          );

        if (!itemRead.ok) {
          records.push({
            index:
              arrayIndex,
            unreadable:
              true,
            reason:
              "ARRAY_ITEM_READ_THROW",
            error:
              itemRead.error
          });

          metrics.unreadablePropertyCount += 1;

          continue;
        }

        if (itemRead.blockedAccessor) {
          records.push({
            index:
              arrayIndex,
            unreadable:
              true,
            reason:
              "ARRAY_ITEM_ACCESSOR_BLOCKED"
          });

          metrics.blockedAccessorCount += 1;

          continue;
        }

        var itemSummary =
          summarizeExternal(
            itemRead.value
          );

        records.push(
          itemSummary.summary
        );

        mergeMetrics(
          metrics,
          itemSummary.metrics
        );
      }

      if (value.length > arrayLimit) {
        metrics.truncated = true;
        metrics.truncationReason =
          "MAX_COLLECTION_RECORDS";
        metrics.omittedCount +=
          value.length - arrayLimit;
      }

      metrics.durationMs =
        Math.max(
          0,
          nowMs() - startedAt
        );

      return {
        records:
          records,
        metrics:
          metrics
      };
    }

    if (isObjectLike(value)) {
      var keys;

      try {
        keys =
          Object.keys(value);
      } catch (error) {
        return {
          records: [
            {
              unreadable:
                true,
              reason:
                "OBJECT_KEYS_THROW",
              error:
                makeInspectionError(
                  "normalizeExternalCollection.Object.keys",
                  error
                )
            }
          ],
          metrics: {
            truncated:
              false,
            truncationReason:
              null,
            visitedNodeCount:
              0,
            propertiesRead:
              0,
            maximumDepthReached:
              0,
            totalStringBudget:
              0,
            omittedCount:
              0,
            blockedAccessorCount:
              0,
            unreadablePropertyCount:
              1,
            durationMs:
              Math.max(
                0,
                nowMs() - startedAt
              )
          }
        };
      }

      var objectLimit =
        Math.min(
          keys.length,
          LIMITS.maxCollectionRecords
        );

      var objectIndex;

      for (
        objectIndex = 0;
        objectIndex < objectLimit;
        objectIndex += 1
      ) {
        var key =
          keys[objectIndex];

        var read =
          safeReadProperty(
            value,
            key,
            {
              allowAccessor: false,
              searchPrototype: false
            }
          );

        if (!read.ok) {
          records.push({
            key:
              key,
            unreadable:
              true,
            reason:
              "PROPERTY_READ_THROW",
            error:
              read.error
          });

          metrics.unreadablePropertyCount += 1;

          continue;
        }

        if (read.blockedAccessor) {
          records.push({
            key:
              key,
            unreadable:
              true,
            reason:
              "PROPERTY_ACCESSOR_BLOCKED"
          });

          metrics.blockedAccessorCount += 1;

          continue;
        }

        var summary =
          summarizeExternal(
            read.value
          );

        records.push({
          key:
            key,
          value:
            summary.summary
        });

        mergeMetrics(
          metrics,
          summary.metrics
        );
      }

      if (keys.length > objectLimit) {
        metrics.truncated = true;
        metrics.truncationReason =
          "MAX_COLLECTION_RECORDS";
        metrics.omittedCount +=
          keys.length - objectLimit;
      }
    }

    metrics.durationMs =
      Math.max(
        0,
        nowMs() - startedAt
      );

    return {
      records:
        records,
      metrics:
        metrics
    };
  }

  function inspectRegistry(
    registry
  ) {
    var startedAt =
      nowMs();

    var result = {
      schema:
        REGISTRY_SCHEMA,
      status:
        "UNKNOWN",
      found:
        Boolean(registry),
      governingContracts: [],
      assignedEngines: [],
      selectableEngines: [],
      reservedSlots: [],
      counts: {
        governingContracts: 0,
        assignedEngines: 0,
        selectableEngines: 0,
        reservedSlots: 0,
        total: 0
      },
      metrics:
        emptyMetrics(),
      errors: [],
      observedAt:
        nowIso(),
      noClaims:
        NO_CLAIMS
    };

    if (!registry) {
      result.status =
        "MISSING";

      result.metrics.durationMs =
        Math.max(
          0,
          nowMs() - startedAt
        );

      return deepFreeze(result);
    }

    var sections = [
      {
        output:
          "governingContracts",
        aliases: [
          "governingContracts",
          "contracts",
          "authorities"
        ]
      },
      {
        output:
          "assignedEngines",
        aliases: [
          "assignedEngines",
          "assigned",
          "subjects"
        ]
      },
      {
        output:
          "selectableEngines",
        aliases: [
          "selectableEngines",
          "selectable",
          "options"
        ]
      },
      {
        output:
          "reservedSlots",
        aliases: [
          "reservedSlots",
          "reserved",
          "slots"
        ]
      }
    ];

    sections.forEach(function inspectSection(section) {
      var field =
        firstPresentField(
          registry,
          section.aliases
        );

      if (field.error) {
        result.errors.push(
          field.error
        );

        return;
      }

      if (
        !field.found ||
        field.blockedAccessor
      ) {
        return;
      }

      var normalized =
        normalizeExternalCollection(
          field.value
        );

      result[section.output] =
        normalized.records;

      mergeMetrics(
        result.metrics,
        normalized.metrics
      );
    });

    result.counts.governingContracts =
      result.governingContracts.length;

    result.counts.assignedEngines =
      result.assignedEngines.length;

    result.counts.selectableEngines =
      result.selectableEngines.length;

    result.counts.reservedSlots =
      result.reservedSlots.length;

    result.counts.total =
      result.counts.governingContracts +
      result.counts.assignedEngines +
      result.counts.selectableEngines +
      result.counts.reservedSlots;

    result.status =
      result.errors.length
        ? "AVAILABLE"
        : result.counts.total
          ? result.metrics.truncated
            ? "AVAILABLE"
            : "PASS"
          : "MISSING";

    result.metrics.durationMs =
      Math.max(
        result.metrics.durationMs,
        Math.max(
          0,
          nowMs() - startedAt
        )
      );

    recordAction(
      "inspectRegistry",
      {
        status:
          result.status,
        recordCount:
          result.counts.total
      }
    );

    return deepFreeze(result);
  }

  function inspectEngineFamily(
    targetWindow
  ) {
    var startedAt =
      nowMs();

    var source =
      targetWindow || root;

    var governingResolution =
      firstResolvedAlias(
        [
          "DGB_ENGINE_CONTRACT",
          "DGB.engineContract"
        ],
        source
      );

    var runtimeResolution =
      firstResolvedAlias(
        [
          "DGB_ENGINE",
          "DGB.engine"
        ],
        source
      );

    var registryResolution =
      firstResolvedAlias(
        [
          "DGB_ENGINE_SUBJECTS",
          "DGB.engineSubjects",
          "DGB_ENGINE_REGISTRY",
          "DGB.engineRegistry"
        ],
        source
      );

    var governingContractRead =
      readPrimitiveField(
        governingResolution.value,
        [
          "CONTRACT",
          "contract"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var runtimeContractRead =
      readPrimitiveField(
        runtimeResolution.value,
        [
          "CONTRACT",
          "contract"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var registryContractRead =
      readPrimitiveField(
        registryResolution.value,
        [
          "CONTRACT",
          "contract"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var registryInspection =
      inspectRegistry(
        registryResolution.value
      );

    var errors = []
      .concat(
        governingResolution.error
          ? [governingResolution.error]
          : []
      )
      .concat(
        runtimeResolution.error
          ? [runtimeResolution.error]
          : []
      )
      .concat(
        registryResolution.error
          ? [registryResolution.error]
          : []
      )
      .concat(
        governingContractRead.error
          ? [governingContractRead.error]
          : []
      )
      .concat(
        runtimeContractRead.error
          ? [runtimeContractRead.error]
          : []
      )
      .concat(
        registryContractRead.error
          ? [registryContractRead.error]
          : []
      );

    var foundCount = [
      governingResolution.found,
      runtimeResolution.found,
      registryResolution.found
    ]
      .filter(Boolean)
      .length;

    var status =
      errors.length
        ? "AVAILABLE"
        : foundCount === 3
          ? "PASS"
          : foundCount > 0
            ? "AVAILABLE"
            : "MISSING";

    var result =
      deepFreeze({
        schema:
          ENGINE_FAMILY_SCHEMA,
        status:
          normalizeInspectionStatus(status),
        governingContractFound:
          governingResolution.found,
        governingContractAlias:
          governingResolution.alias,
        governingContract:
          governingContractRead.found &&
          !governingContractRead.blockedAccessor
            ? governingContractRead.value
            : null,
        runtimeEngineFound:
          runtimeResolution.found,
        runtimeEngineAlias:
          runtimeResolution.alias,
        runtimeEngineContract:
          runtimeContractRead.found &&
          !runtimeContractRead.blockedAccessor
            ? runtimeContractRead.value
            : null,
        registryFound:
          registryResolution.found,
        registryAlias:
          registryResolution.alias,
        registryContract:
          registryContractRead.found &&
          !registryContractRead.blockedAccessor
            ? registryContractRead.value
            : null,
        registry:
          registryInspection,
        foundCount:
          foundCount,
        errors:
          errors,
        metrics: {
          durationMs:
            Math.max(
              0,
              nowMs() - startedAt
            )
        },
        observedAt:
          nowIso(),
        noClaims:
          NO_CLAIMS
      });

    recordAction(
      "inspectEngineFamily",
      {
        status:
          result.status,
        foundCount:
          result.foundCount
      }
    );

    return result;
  }

  function firstResolvedAlias(
    aliases,
    base
  ) {
    var candidates =
      Array.isArray(aliases)
        ? aliases
        : [];

    var index;

    for (
      index = 0;
      index < candidates.length;
      index += 1
    ) {
      var resolution =
        safeReadPath(
          candidates[index],
          base || root,
          {
            allowAccessor: false,
            searchPrototype: true
          }
        );

      if (
        resolution.ok &&
        resolution.present &&
        !resolution.blockedAccessor
      ) {
        return {
          found: true,
          alias:
            candidates[index],
          value:
            resolution.value,
          blockedAccessor:
            false,
          error:
            null
        };
      }

      if (resolution.blockedAccessor) {
        return {
          found: false,
          alias:
            candidates[index],
          value:
            null,
          blockedAccessor:
            true,
          error:
            null
        };
      }

      if (!resolution.ok) {
        return {
          found: false,
          alias:
            candidates[index],
          value:
            null,
          blockedAccessor:
            false,
          error:
            resolution.error
        };
      }
    }

    return {
      found: false,
      alias: null,
      value: null,
      blockedAccessor: false,
      error: null
    };
  }

  function firstPresentField(
    object,
    keys
  ) {
    var index;

    for (
      index = 0;
      index < keys.length;
      index += 1
    ) {
      var read =
        safeReadProperty(
          object,
          keys[index],
          {
            allowAccessor: false,
            searchPrototype: true
          }
        );

      if (!read.ok) {
        return {
          found: false,
          field:
            keys[index],
          value:
            null,
          blockedAccessor:
            false,
          error:
            read.error
        };
      }

      if (read.present) {
        return {
          found: true,
          field:
            keys[index],
          value:
            read.blockedAccessor
              ? null
              : read.value,
          blockedAccessor:
            Boolean(
              read.blockedAccessor
            ),
          error:
            null
        };
      }
    }

    return {
      found: false,
      field: null,
      value: null,
      blockedAccessor: false,
      error: null
    };
  }

  function getDeclaredPassiveAccessors(
    object
  ) {
    var declaration =
      firstPresentField(
        object,
        REPORT_SAFE_ACCESSOR_DECLARATIONS
      );

    if (
      !declaration.found ||
      declaration.blockedAccessor ||
      !Array.isArray(
        declaration.value
      )
    ) {
      return {
        field:
          declaration.field,
        accessors: [],
        blockedAccessor:
          declaration.blockedAccessor,
        error:
          declaration.error
      };
    }

    return {
      field:
        declaration.field,
      accessors:
        declaration.value
          .slice(
            0,
            LIMITS.maxExternalArrayItems
          )
          .filter(function accessorIsString(accessor) {
            return typeof accessor === "string";
          })
          .map(function normalizeAccessor(accessor) {
            return trimString(accessor, 128);
          }),
      blockedAccessor:
        false,
      error:
        null
    };
  }

  function inspectPassiveField(
    fieldRecord,
    kind
  ) {
    var startedAt =
      nowMs();

    var normalizedKind =
      String(kind || "field")
        .trim()
        .toLowerCase();

    var result = {
      schema:
        INSPECTION_SCHEMA,
      kind:
        normalizedKind,
      status:
        "UNKNOWN",
      found:
        false,
      field:
        null,
      blockedAccessor:
        false,
      summary:
        null,
      packetKeys:
        [],
      statusMatches:
        [],
      recommendedOwner:
        null,
      recommendedFile:
        null,
      recommendedAction:
        null,
      metrics:
        emptyMetrics(),
      errors:
        [],
      observedAt:
        nowIso(),
      noClaims:
        NO_CLAIMS
    };

    if (!fieldRecord) {
      result.status =
        "MISSING";

      result.metrics.durationMs =
        Math.max(
          0,
          nowMs() - startedAt
        );

      return deepFreeze(result);
    }

    result.field =
      fieldRecord.field || null;

    result.blockedAccessor =
      Boolean(
        fieldRecord.blockedAccessor
      );

    if (fieldRecord.error) {
      result.status =
        "ERROR";

      result.errors.push(
        fieldRecord.error
      );

      result.metrics.durationMs =
        Math.max(
          0,
          nowMs() - startedAt
        );

      return deepFreeze(result);
    }

    if (
      !fieldRecord.found ||
      fieldRecord.blockedAccessor
    ) {
      result.status =
        fieldRecord.blockedAccessor
          ? "HELD"
          : "MISSING";

      result.metrics.durationMs =
        Math.max(
          0,
          nowMs() - startedAt
        );

      return deepFreeze(result);
    }

    result.found =
      true;

    var summary =
      summarizeExternal(
        fieldRecord.value
      );

    var statuses =
      findStatuses(
        fieldRecord.value,
        [
          "HELD",
          "MISSING",
          "ERROR",
          "FAILED",
          "FAIL"
        ]
      );

    result.summary =
      summary.summary;

    result.statusMatches =
      statuses.matches;

    mergeMetrics(
      result.metrics,
      summary.metrics
    );

    mergeMetrics(
      result.metrics,
      statuses.metrics
    );

    if (
      normalizedKind === "packet" &&
      isObjectLike(fieldRecord.value)
    ) {
      try {
        result.packetKeys =
          Object.keys(
            fieldRecord.value
          )
            .slice(
              0,
              LIMITS.maxPacketKeysReported
            );
      } catch (error) {
        result.errors.push(
          makeInspectionError(
            "inspectPassiveField.packetKeys",
            error
          )
        );
      }
    }

    var ownerRead =
      readPrimitiveField(
        fieldRecord.value,
        [
          "recommendedOwner",
          "owner"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var fileRead =
      readPrimitiveField(
        fieldRecord.value,
        [
          "recommendedFile",
          "file"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var actionRead =
      readPrimitiveField(
        fieldRecord.value,
        [
          "recommendedAction",
          "action"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    result.recommendedOwner =
      ownerRead.found &&
      !ownerRead.blockedAccessor
        ? ownerRead.value
        : null;

    result.recommendedFile =
      fileRead.found &&
      !fileRead.blockedAccessor
        ? fileRead.value
        : null;

    result.recommendedAction =
      actionRead.found &&
      !actionRead.blockedAccessor
        ? actionRead.value
        : null;

    result.errors =
      result.errors
        .concat(
          ownerRead.error
            ? [ownerRead.error]
            : []
        )
        .concat(
          fileRead.error
            ? [fileRead.error]
            : []
        )
        .concat(
          actionRead.error
            ? [actionRead.error]
            : []
        );

    var heldMatch =
      result.statusMatches
        .some(function isHeldMatch(match) {
          return (
            match.status === "HELD" ||
            match.status === "MISSING"
          );
        });

    var failedMatch =
      result.statusMatches
        .some(function isFailedMatch(match) {
          return (
            match.status === "ERROR" ||
            match.status === "FAILED" ||
            match.status === "FAIL"
          );
        });

    if (result.errors.length) {
      result.status =
        "AVAILABLE";
    } else if (
      heldMatch ||
      failedMatch
    ) {
      result.status =
        "HELD";
    } else if (
      result.metrics.truncated
    ) {
      result.status =
        "AVAILABLE";
    } else {
      result.status =
        "PASS";
    }

    result.metrics.durationMs =
      Math.max(
        result.metrics.durationMs,
        Math.max(
          0,
          nowMs() - startedAt
        )
      );

    recordAction(
      "inspectPassiveField",
      {
        kind:
          result.kind,
        status:
          result.status,
        field:
          result.field
      }
    );

    return deepFreeze(result);
  }

  function inspectSurfaceMetadata(
    participantRecord
  ) {
    var startedAt =
      nowMs();

    var record =
      participantRecord || {};

    var aliases =
      Array.isArray(record.aliases)
        ? record.aliases
        : record.resolvedAlias
          ? [record.resolvedAlias]
          : [];

    var resolution =
      resolveAlias(
        aliases,
        root
      );

    var value =
      resolution.value;

    var contractRead =
      readPrimitiveField(
        value,
        [
          "CONTRACT",
          "contract"
        ],
        {
          allowAccessor: false,
          searchPrototype: true
        }
      );

    var methods =
      Array.isArray(record.methods)
        ? record.methods
        : [
            "inspect",
            "probe",
            "run",
            "execute"
          ];

    var callableInspection =
      inspectCallableMethods(
        value,
        methods
      );

    var passiveAccessorDeclaration =
      getDeclaredPassiveAccessors(
        value
      );

    var receiptField =
      firstPresentField(
        value,
        [
          "RECEIPT",
          "receipt"
        ]
      );

    var packetField =
      firstPresentField(
        value,
        [
          "PACKET",
          "packet"
        ]
      );

    var receiptInspection =
      inspectPassiveField(
        receiptField,
        "receipt"
      );

    var packetInspection =
      inspectPassiveField(
        packetField,
        "packet"
      );

    var undeclaredMethodEvidence = [];

    [
      "getReceipt",
      "getPacket"
    ].forEach(function inspectMethodBackedEvidence(method) {
      var methodRead =
        safeReadProperty(
          value,
          method,
          {
            allowAccessor: false,
            searchPrototype: true
          }
        );

      if (
        methodRead.ok &&
        methodRead.present &&
        !methodRead.blockedAccessor &&
        typeof methodRead.value === "function" &&
        passiveAccessorDeclaration
          .accessors
          .indexOf(method) === -1
      ) {
        undeclaredMethodEvidence.push(
          method
        );
      }
    });

    var errors = []
      .concat(
        resolution.error
          ? [resolution.error]
          : []
      )
      .concat(
        contractRead.error
          ? [contractRead.error]
          : []
      )
      .concat(
        callableInspection.errors
      )
      .concat(
        passiveAccessorDeclaration.error
          ? [passiveAccessorDeclaration.error]
          : []
      )
      .concat(
        receiptInspection.errors || []
      )
      .concat(
        packetInspection.errors || []
      );

    var status;

    if (!resolution.found) {
      status =
        resolution.blockedAccessor
          ? "HELD"
          : "MISSING";
    } else if (errors.length) {
      status = "AVAILABLE";
    } else if (
      receiptInspection.status === "HELD" ||
      packetInspection.status === "HELD"
    ) {
      status = "HELD";
    } else {
      status = "PASS";
    }

    var result =
      deepFreeze({
        schema:
          SURFACE_SCHEMA,
        status:
          normalizeInspectionStatus(status),
        authorityFound:
          resolution.found,
        authorityAlias:
          resolution.alias,
        authorityAccessorBlocked:
          resolution.blockedAccessor,
        contract:
          contractRead.found &&
          !contractRead.blockedAccessor
            ? contractRead.value
            : null,
        callable:
          callableInspection
            .availableMethods
            .length > 0 ||
          typeof value === "function",
        callableMethod:
          typeof value === "function"
            ? "[[callable]]"
            : callableInspection.availableMethods[0] ||
              null,
        callableMethods:
          callableInspection.availableMethods,
        blockedMethods:
          callableInspection.blockedMethods,
        declaredPassiveAccessors:
          passiveAccessorDeclaration.accessors,
        passiveAccessorDeclarationField:
          passiveAccessorDeclaration.field,
        undeclaredMethodBackedEvidence:
          undeclaredMethodEvidence,
        receipt:
          receiptInspection,
        packet:
          packetInspection,
        errors:
          errors,
        metrics: {
          durationMs:
            Math.max(
              0,
              nowMs() - startedAt
            )
        },
        observedAt:
          nowIso(),
        noClaims:
          NO_CLAIMS
      });

    recordAction(
      "inspectSurfaceMetadata",
      {
        status:
          result.status,
        authorityFound:
          result.authorityFound,
        receiptStatus:
          result.receipt.status,
        packetStatus:
          result.packet.status
      }
    );

    return result;
  }

  function makeLane(
    laneId,
    status,
    summary,
    evidence,
    absence,
    direction,
    data,
    metrics,
    errors
  ) {
    return deepFreeze({
      schema:
        LANE_SCHEMA,
      laneId:
        trimString(
          laneId || "unknownLane",
          256
        ),
      status:
        normalizeLaneStatus(status),
      summary:
        trimString(
          summary || "",
          LIMITS.maxExternalStringLength
        ),
      evidence:
        uniqueStrings(
          evidence || [],
          LIMITS.maxLaneEvidenceEntries
        ),
      absence:
        uniqueStrings(
          absence || [],
          LIMITS.maxLaneAbsenceEntries
        ),
      direction:
        uniqueStrings(
          direction || [],
          LIMITS.maxLaneDirectionEntries
        ),
      data:
        data === undefined
          ? null
          : cloneNormalized(data),
      metrics:
        cloneNormalized(
          metrics || emptyMetrics()
        ),
      errors:
        frozenClone(
          errors || []
        ),
      createdAt:
        nowIso(),
      noClaims:
        NO_CLAIMS
    });
  }

  function defaultLaneFromInspection(
    laneId,
    inspection
  ) {
    if (!inspection) {
      return makeLane(
        laneId,
        "UNKNOWN",
        "The inspection returned no normalized result.",
        [],
        [
          "No inspection result was available."
        ],
        [
          "Inspect the inspection-lane contract and caller arguments."
        ],
        null,
        emptyMetrics(),
        []
      );
    }

    var status =
      normalizeInspectionStatus(
        inspection.status
      );

    var laneStatus;

    if (status === "PASS") {
      laneStatus =
        inspection.metrics &&
        inspection.metrics.truncated
          ? "AVAILABLE"
          : "COMPLETE";
    } else if (status === "AVAILABLE") {
      laneStatus =
        "AVAILABLE";
    } else if (status === "HELD") {
      laneStatus =
        "HELD";
    } else if (status === "MISSING") {
      laneStatus =
        "MISSING";
    } else if (status === "ERROR") {
      laneStatus =
        "ERROR";
    } else {
      laneStatus =
        "UNKNOWN";
    }

    return makeLane(
      laneId,
      laneStatus,
      "Inspection lane " +
      laneId +
      " completed with status " +
      laneStatus +
      ".",
      laneStatus === "COMPLETE" ||
      laneStatus === "AVAILABLE"
        ? [
            "A bounded inspection record was produced."
          ]
        : [],
      laneStatus === "COMPLETE"
        ? []
        : [
            "The inspection did not establish complete bounded evidence."
          ],
      laneStatus === "COMPLETE"
        ? []
        : [
            "Review the normalized inspection record for the first held, missing, erroneous, or unknown condition."
          ],
      inspection,
      inspection.metrics ||
      emptyMetrics(),
      inspection.errors || []
    );
  }

  function runLane(
    laneId,
    inspector,
    interpreter
  ) {
    var startedAt =
      nowMs();

    if (typeof inspector !== "function") {
      return makeLane(
        laneId,
        "ERROR",
        "The inspection lane received no callable inspector.",
        [],
        [
          "INSPECTOR_NOT_CALLABLE"
        ],
        [
          "Provide a callable inspection operation."
        ],
        null,
        {
          durationMs:
            Math.max(
              0,
              nowMs() - startedAt
            )
        },
        [
          makeInspectionError(
            "runLane",
            new Error(
              "INSPECTOR_NOT_CALLABLE"
            ),
            {
              laneId:
                laneId
            }
          )
        ]
      );
    }

    var inspection;

    try {
      inspection =
        inspector();
    } catch (error) {
      var inspectionError =
        makeInspectionError(
          "runLane.inspector",
          error,
          {
            laneId:
              laneId
          }
        );

      var failedLane =
        makeLane(
          laneId,
          "ERROR",
          "The bounded inspector encountered an exception.",
          [],
          [
            trimString(
              inspectionError.message,
              LIMITS.maxExternalStringLength
            )
          ],
          [
            "Inspect the normalized inspection error without mutating the production target."
          ],
          null,
          {
            durationMs:
              Math.max(
                0,
                nowMs() - startedAt
              )
          },
          [
            inspectionError
          ]
        );

      recordAction(
        "runLane",
        {
          laneId:
            laneId,
          status:
            failedLane.status
        }
      );

      return failedLane;
    }

    if (isPromiseLike(inspection)) {
      var asyncLane =
        makeLane(
          laneId,
          "HELD",
          "The inspector returned asynchronous evidence and was not awaited.",
          [],
          [
            "ASYNC_EVIDENCE_NOT_ACCEPTED_IN_SYNCHRONOUS_INSPECTION"
          ],
          [
            "Provide synchronous passive metadata for this inspection lane."
          ],
          null,
          {
            durationMs:
              Math.max(
                0,
                nowMs() - startedAt
              )
          },
          []
        );

      recordAction(
        "runLane",
        {
          laneId:
            laneId,
          status:
            asyncLane.status
        }
      );

      return asyncLane;
    }

    var lane;

    if (typeof interpreter === "function") {
      try {
        lane =
          interpreter(
            frozenClone(inspection)
          );
      } catch (error) {
        var interpreterError =
          makeInspectionError(
            "runLane.interpreter",
            error,
            {
              laneId:
                laneId
            }
          );

        lane =
          makeLane(
            laneId,
            "ERROR",
            "The lane interpreter encountered an exception after bounded inspection.",
            [],
            [
              trimString(
                interpreterError.message,
                LIMITS.maxExternalStringLength
              )
            ],
            [
              "Inspect the lane interpreter. The external inspection result remains bounded."
            ],
            inspection,
            {
              durationMs:
                Math.max(
                  0,
                  nowMs() - startedAt
                )
            },
            [
              interpreterError
            ]
          );
      }
    } else {
      lane =
        defaultLaneFromInspection(
          laneId,
          inspection
        );
    }

    if (
      !lane ||
      lane.schema !== LANE_SCHEMA
    ) {
      lane =
        defaultLaneFromInspection(
          laneId,
          inspection
        );
    }

    var normalizedMetrics =
      mergeMetrics(
        emptyMetrics(),
        lane.metrics
      );

    normalizedMetrics.durationMs =
      Math.max(
        normalizedMetrics.durationMs,
        Math.max(
          0,
          nowMs() - startedAt
        )
      );

    var finalLane =
      makeLane(
        lane.laneId || laneId,
        lane.status,
        lane.summary,
        lane.evidence,
        lane.absence,
        lane.direction,
        lane.data,
        normalizedMetrics,
        lane.errors
      );

    recordAction(
      "runLane",
      {
        laneId:
          finalLane.laneId,
        status:
          finalLane.status
      }
    );

    return finalLane;
  }

  function inspectInitializationSafe(
    options
  ) {
    var config =
      options || {};

    var output = {
      schema:
        INSPECTION_SCHEMA,
      status:
        "AVAILABLE",
      participants:
        null,
      target:
        null,
      runtime:
        null,
      engineFamily:
        null,
      lanes:
        [],
      errors:
        [],
      metrics:
        emptyMetrics(),
      observedAt:
        nowIso(),
      noClaims:
        NO_CLAIMS
    };

    var participantLane =
      runLane(
        "participants",
        function inspectInitializationParticipants() {
          return inspectParticipants(
            config.participantManifest || []
          );
        }
      );

    output.lanes.push(
      participantLane
    );

    output.participants =
      participantLane.data;

    var targetLane =
      runLane(
        "targetFrame",
        function inspectInitializationTarget() {
          return inspectTargetFrame(
            config.frameId,
            config.targetRoute
          );
        }
      );

    output.lanes.push(
      targetLane
    );

    output.target =
      targetLane.data;

    var targetWindow =
      config.targetWindow || null;

    var runtimeLane =
      runLane(
        "runtimeMetadata",
        function inspectInitializationRuntime() {
          return inspectRuntime(
            targetWindow,
            {
              allowPixelRead: false,
              runtimeAliases:
                config.runtimeAliases,
              mountSelectors:
                config.mountSelectors
            }
          );
        }
      );

    output.lanes.push(
      runtimeLane
    );

    output.runtime =
      runtimeLane.data;

    var engineFamilyLane =
      runLane(
        "engineFamily",
        function inspectInitializationEngineFamily() {
          return inspectEngineFamily(
            targetWindow
          );
        }
      );

    output.lanes.push(
      engineFamilyLane
    );

    output.engineFamily =
      engineFamilyLane.data;

    output.lanes.forEach(function aggregateLane(lane) {
      mergeMetrics(
        output.metrics,
        lane.metrics
      );

      if (
        lane.errors &&
        lane.errors.length
      ) {
        output.errors =
          output.errors.concat(
            lane.errors
          );
      }
    });

    var hasError =
      output.lanes
        .some(function laneHasError(lane) {
          return lane.status === "ERROR";
        });

    var hasComplete =
      output.lanes
        .some(function laneHasComplete(lane) {
          return (
            lane.status === "COMPLETE" ||
            lane.status === "AVAILABLE"
          );
        });

    output.status =
      hasError
        ? hasComplete
          ? "AVAILABLE"
          : "ERROR"
        : hasComplete
          ? "AVAILABLE"
          : "MISSING";

    recordAction(
      "inspectInitializationSafe",
      {
        status:
          output.status,
        laneCount:
          output.lanes.length
      }
    );

    return deepFreeze(output);
  }

  function validateLimits() {
    Object.keys(LIMITS)
      .forEach(function validateLimit(key) {
        if (
          typeof LIMITS[key] !== "number" ||
          !isFinite(LIMITS[key]) ||
          LIMITS[key] <= 0
        ) {
          throw new Error(
            "INVALID_INSPECTION_LIMIT:" +
            key
          );
        }
      });

    return true;
  }

  function validateSchemas() {
    [
      CONTRACT,
      LANE_SCHEMA,
      INSPECTION_SCHEMA,
      ERROR_SCHEMA,
      RECEIPT_SCHEMA,
      TARGET_FRAME_SCHEMA,
      RUNTIME_SCHEMA,
      ENGINE_FAMILY_SCHEMA,
      REGISTRY_SCHEMA,
      PARTICIPANT_SCHEMA,
      SURFACE_SCHEMA
    ].forEach(function validateSchema(schema) {
      if (
        typeof schema !== "string" ||
        !schema.trim()
      ) {
        throw new Error(
          "INVALID_INSPECTION_SCHEMA"
        );
      }
    });

    return true;
  }

  function validateAuthority() {
    if (
      AUTHORITY !==
      "AUDRALIA_DIAGNOSTIC_NEWS_FIBONACCI_AUTHORITY_ASSIGNMENT_v1"
    ) {
      throw new Error(
        "INSPECTION_AUTHORITY_MISMATCH"
      );
    }

    return true;
  }

  function getLimits() {
    return frozenClone(
      LIMITS
    );
  }

  function getReceipt() {
    return frozenClone(
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT ||
      null
    );
  }

  function publishReceipt() {
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT =
      deepFreeze({
        schema:
          RECEIPT_SCHEMA,
        contract:
          CONTRACT,
        version:
          VERSION,
        file:
          FILE,
        authority:
          AUTHORITY,
        status:
          "READY",
        installedAt:
          installedAt,
        publishedAt:
          nowIso(),
        newsAlignment: {
          sourceDiscovery:
            "EAST",
          containment:
            "EAST",
          boundedInspection:
            "WEST"
        },
        fibonacciAuthority: {
          sourceDiscovery:
            "F3",
          normalization:
            "F5",
          runtimeInspection:
            "F13"
        },
        limits:
          LIMITS,
        passiveFieldPrecedence:
          PASSIVE_FIELD_PRECEDENCE,
        forbiddenReportMethods:
          FORBIDDEN_REPORT_METHODS,
        actionCount:
          actionCount,
        lastAction:
          frozenClone(
            lastAction
          ),
        noClaims:
          NO_CLAIMS
      });
  }

  function publishApi() {
    var api =
      Object.freeze({
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
        AUTHORITY:
          AUTHORITY,
        authority:
          AUTHORITY,
        STATUS:
          "READY",
        status:
          "READY",

        safeReadProperty:
          safeReadProperty,

        safeReadPath:
          safeReadPath,

        summarizeExternal:
          summarizeExternal,

        summarizeHostObject:
          summarizeHostObject,

        findStatuses:
          findStatuses,

        inspectParticipants:
          inspectParticipants,

        inspectParticipant:
          inspectParticipantRecord,

        inspectTargetFrame:
          inspectTargetFrame,

        inspectRuntime:
          inspectRuntime,

        inspectEngineFamily:
          inspectEngineFamily,

        inspectRegistry:
          inspectRegistry,

        inspectSurfaceMetadata:
          inspectSurfaceMetadata,

        inspectPassiveField:
          inspectPassiveField,

        runLane:
          runLane,

        makeLane:
          makeLane,

        inspectInitializationSafe:
          inspectInitializationSafe,

        getLimits:
          getLimits,

        getReceipt:
          getReceipt
      });

    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE =
      api;

    if (
      !root.AUDRALIA ||
      typeof root.AUDRALIA !== "object"
    ) {
      root.AUDRALIA = {};
    }

    root.AUDRALIA.diagnosticInspectionLane =
      api;

    root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_LOADED__ =
      true;

    root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_CONTRACT__ =
      CONTRACT;

    root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_VERSION__ =
      VERSION;

    return api;
  }

  function init() {
    validateLimits();
    validateSchemas();
    validateAuthority();

    publishReceipt();
    publishApi();

    recordAction(
      "initialize",
      {
        contract:
          CONTRACT,
        authority:
          AUTHORITY,
        fibonacciAuthority: [
          "F3",
          "F5",
          "F13"
        ]
      }
    );
  }

  var existing =
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE;

  if (
    existing &&
    (
      existing.CONTRACT === CONTRACT ||
      existing.contract === CONTRACT
    )
  ) {
    return;
  }

  try {
    init();
  } catch (error) {
    root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR__ =
      deepFreeze({
        schema:
          ERROR_SCHEMA,
        contract:
          CONTRACT,
        file:
          FILE,
        authority:
          AUTHORITY,
        error:
          makeInspectionError(
            "initialize",
            error
          ),
        occurredAt:
          nowIso(),
        noClaims:
          NO_CLAIMS
      });

    throw error;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
