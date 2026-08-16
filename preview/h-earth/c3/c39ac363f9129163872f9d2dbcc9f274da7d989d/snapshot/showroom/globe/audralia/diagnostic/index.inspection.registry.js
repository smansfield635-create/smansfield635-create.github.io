// /showroom/globe/audralia/diagnostic/index.inspection.registry.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_CHILD_TNT_v1
// Version: 1.0.0
// Full-file replacement.
// Passive diagnostic registry projection only.
// No upstream mutation, refresh, observer attachment, runtime execution,
// timers, polling, promises, events, repair, release, or readiness claim.

(function installAudraliaDiagnosticRegistryChild(root) {
  "use strict";

  var FILE = "/showroom/globe/audralia/diagnostic/index.inspection.registry.js";
  var CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_CHILD_TNT_v1";
  var VERSION = "1.0.0";
  var AUTHORITY = "AUDRALIA_DIAGNOSTIC_REGISTRY_PROJECTION_AUTHORITY_v1";
  var ROLE = "DIAGNOSTIC_REGISTRY_CHILD";

  var STATE_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_STATE_v1";
  var EVIDENCE_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_EVIDENCE_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RECEIPT_v1";
  var ERROR_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_ERROR_v1";
  var TRANSACTION_RESULT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_TRANSACTION_RESULT_v1";
  var INSTALLATION_CONFLICT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_INSTALLATION_CONFLICT_v1";

  var PRIMARY_API_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY";
  var PRIMARY_STATE_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_STATE";
  var PRIMARY_RECEIPT_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RECEIPT";

  var LOADED_FLAG = "__AUDRALIA_DIAGNOSTIC_REGISTRY_LOADED__";
  var CONTRACT_FLAG = "__AUDRALIA_DIAGNOSTIC_REGISTRY_CONTRACT__";
  var VERSION_FLAG = "__AUDRALIA_DIAGNOSTIC_REGISTRY_VERSION__";
  var STATUS_FLAG = "__AUDRALIA_DIAGNOSTIC_REGISTRY_STATUS__";
  var ERROR_FLAG = "__AUDRALIA_DIAGNOSTIC_REGISTRY_ERROR__";
  var INSTALLATION_CONFLICT_FLAG = "__AUDRALIA_DIAGNOSTIC_REGISTRY_INSTALLATION_CONFLICT__";

  var SOURCE_PRIMARY_SYMBOL = "DGB_ENGINE_SUBJECT_REGISTRY";
  var SOURCE_COMPATIBILITY_SYMBOL = "DGBEngineSubjectRegistry";

  var EXPECTED_SOURCE = Object.freeze({
    contract: "DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2",
    version: "2.0.0",
    file: "/assets/engine/dgb.engine.subjects.js",
    registrySchema: "DGB_ENGINE_AND_AUTHORITY_REGISTRY_v2",
    authoritySchema: "DGB_ENGINE_AUTHORITY_RECORD_v1",
    engineSchema: "DGB_ENGINE_SUBJECT_RECORD_v2",
    receiptSchema: "DGB_ENGINE_REGISTRY_RECEIPT_v2",
    slotCount: 6,
    defaultEngineId: "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE"
  });

  var currentState = null;
  var currentReceipt = null;
  var successfulSequence = 0;
  var currentStatus = "UNKNOWN";
  var publicApi = null;

  function nowIso() {
    try { return new Date().toISOString(); }
    catch (_error) { return null; }
  }

  function isObject(value) {
    return value !== null && (typeof value === "object" || typeof value === "function");
  }

  function isPlainObject(value) {
    if (!value || Object.prototype.toString.call(value) !== "[object Object]") return false;
    var proto;
    try { proto = Object.getPrototypeOf(value); }
    catch (_error) { return false; }
    return proto === Object.prototype || proto === null;
  }

  function safeString(value, max) {
    var text;
    try { text = String(value); }
    catch (_error) { text = "[unstringifiable]"; }
    if (typeof max === "number" && max >= 0 && text.length > max) return text.slice(0, max);
    return text;
  }

  function deepFreeze(value, seen) {
    if (!isObject(value)) return value;
    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);

    try {
      Object.getOwnPropertyNames(value).forEach(function freezeKey(key) {
        try { deepFreeze(value[key], memory); } catch (_error) {}
      });
      Object.freeze(value);
    } catch (_error2) {}

    return value;
  }

  function cloneBounded(value, seen, depth) {
    var level = typeof depth === "number" ? depth : 0;
    var memory = seen || [];

    if (level > 16) return "[depth-limit]";
    if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "undefined") return value;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "bigint") return { type: "bigint", value: safeString(value, 200) };
    if (typeof value === "symbol") return { type: "symbol", description: safeString(value.description || value, 200) };
    if (typeof value === "function") return { type: "function", name: safeString(value.name || "", 200), length: value.length };

    if (!isObject(value)) return null;
    if (memory.indexOf(value) !== -1) return { type: "circular-reference" };

    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, 377).map(function cloneArrayItem(item) {
        return cloneBounded(item, memory.slice(), level + 1);
      });
    }

    var output = {};
    var keys = [];

    try { keys = Object.getOwnPropertyNames(value).slice(0, 233); }
    catch (_error) { return { type: "unreadable-object" }; }

    keys.forEach(function cloneKey(key) {
      var descriptor;
      try { descriptor = Object.getOwnPropertyDescriptor(value, key); }
      catch (error) {
        output[key] = { type: "unreadable", error: safeString(error && error.message, 300) };
        return;
      }

      if (descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value")) {
        output[key] = cloneBounded(descriptor.value, memory.slice(), level + 1);
      } else {
        output[key] = {
          type: "accessor",
          getter: Boolean(descriptor && descriptor.get),
          setter: Boolean(descriptor && descriptor.set)
        };
      }
    });

    if (!isPlainObject(value)) {
      try {
        output.__sourceType__ = value.constructor && value.constructor.name
          ? safeString(value.constructor.name, 200)
          : Object.prototype.toString.call(value);
      } catch (_error2) {
        output.__sourceType__ = "[unknown]";
      }
    }

    return output;
  }

  function immutableClone(value) {
    return deepFreeze(cloneBounded(value));
  }

  function stableSerialize(value, seen) {
    var memory = seen || [];

    if (value === null) return "null";
    if (typeof value === "undefined") return "undefined";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (typeof value === "bigint") return "bigint:" + String(value);
    if (typeof value === "function") return "function:" + safeString(value.name || "", 100);

    if (!isObject(value)) return safeString(value, 500);
    if (memory.indexOf(value) !== -1) return "[circular]";

    memory.push(value);

    if (Array.isArray(value)) {
      var arrayText = "[" + value.map(function encodeArray(entry) {
        return stableSerialize(entry, memory.slice());
      }).join(",") + "]";
      return arrayText;
    }

    var keys;
    try { keys = Object.keys(value).sort(); }
    catch (_error) { return "[unreadable]"; }

    return "{" + keys.map(function encodeKey(key) {
      var encoded;
      try { encoded = stableSerialize(value[key], memory.slice()); }
      catch (_error2) { encoded = "[unreadable]"; }
      return JSON.stringify(key) + ":" + encoded;
    }).join(",") + "}";
  }

  function hashText(text) {
    var hash = 2166136261;
    for (var i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return ("00000000" + (hash >>> 0).toString(16)).slice(-8);
  }

  function hashValue(value) {
    return "fnv1a32:" + hashText(stableSerialize(value));
  }

  function readProperty(object, key) {
    if (!object) return { readable: false, present: false, value: undefined, error: null };

    var descriptor;
    try { descriptor = Object.getOwnPropertyDescriptor(object, key); }
    catch (error) { return { readable: false, present: false, value: undefined, error: error }; }

    if (!descriptor) {
      try {
        if (!(key in object)) return { readable: true, present: false, value: undefined, error: null };
      } catch (error2) {
        return { readable: false, present: false, value: undefined, error: error2 };
      }
    }

    try {
      return { readable: true, present: key in object, value: object[key], error: null };
    } catch (error3) {
      return { readable: false, present: true, value: undefined, error: error3 };
    }
  }

  function safeCall(object, methodName, args) {
    var read = readProperty(object, methodName);
    if (!read.readable) return { ok: false, present: true, value: undefined, error: read.error };
    if (!read.present || typeof read.value !== "function") return { ok: false, present: false, value: undefined, error: null };

    try {
      return { ok: true, present: true, value: read.value.apply(object, args || []), error: null };
    } catch (error) {
      return { ok: false, present: true, value: undefined, error: error };
    }
  }

  function normalizeArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === null || typeof value === "undefined") return [];
    if (isPlainObject(value)) {
      return Object.keys(value).map(function mapKey(key) { return value[key]; });
    }
    return [];
  }

  function makeError(error, action, code, sourceAlias, additions) {
    var record = {
      schema: ERROR_SCHEMA,
      action: action || "unknown",
      code: code || "UNKNOWN_ERROR",
      message: safeString(error && error.message !== undefined ? error.message : error, 500),
      stack: safeString(error && error.stack ? error.stack : "", 2000),
      sourceAlias: sourceAlias || null,
      occurredAt: nowIso()
    };

    if (additions && typeof additions === "object") {
      Object.keys(additions).forEach(function add(key) {
        record[key] = cloneBounded(additions[key]);
      });
    }

    return deepFreeze(record);
  }

  function makeConflict(code, field, expected, observed, source, detail) {
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

  function makeHold(code, field, reason, requiredEvidence, availableEvidence, detail) {
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

  function makeAbsence(code, field, missingSource, detail) {
    return deepFreeze({
      code: code,
      field: field,
      missingSource: missingSource || null,
      detail: safeString(detail || "", 500),
      observedAt: nowIso()
    });
  }

  function valuesCorrespond(expected, observed) {
    return observed !== undefined && observed !== null && expected === observed;
  }

  function resolveSource() {
    var primaryRead = readProperty(root, SOURCE_PRIMARY_SYMBOL);
    var compatibilityRead = readProperty(root, SOURCE_COMPATIBILITY_SYMBOL);

    var primary = primaryRead.readable && primaryRead.present ? primaryRead.value : null;
    var compatibility = compatibilityRead.readable && compatibilityRead.present ? compatibilityRead.value : null;

    var result = {
      primaryObserved: Boolean(primary),
      compatibilityObserved: Boolean(compatibility),
      primaryReadError: primaryRead.error || null,
      compatibilityReadError: compatibilityRead.error || null,
      sourceAlias: null,
      source: null,
      sourceReferenceCorrespondence: null,
      sourceReferenceConflict: false
    };

    if (!primary && !compatibility) return result;

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

    result.sourceAlias = primary ? SOURCE_PRIMARY_SYMBOL : SOURCE_COMPATIBILITY_SYMBOL;
    result.source = primary || compatibility;
    return result;
  }

  function staticValue(source, key) {
    var read = readProperty(source, key);
    return read.readable && read.present ? read.value : undefined;
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

    var shape = {
      mandatoryMethods: {},
      mandatoryFields: {},
      optionalFields: {},
      complete: true
    };

    mandatoryMethods.forEach(function checkMethod(name) {
      var read = readProperty(source, name);
      shape.mandatoryMethods[name] = {
        present: read.present,
        readable: read.readable,
        callable: read.readable && read.present && typeof read.value === "function"
      };
      if (!shape.mandatoryMethods[name].callable) shape.complete = false;
    });

    mandatoryFields.forEach(function checkField(name) {
      var read = readProperty(source, name);
      shape.mandatoryFields[name] = {
        present: read.present,
        readable: read.readable
      };
      if (!read.present || !read.readable) shape.complete = false;
    });

    ["OBSERVATION_SCHEMA", "STATUS", "ROLE"].forEach(function checkOptional(name) {
      var read = readProperty(source, name);
      shape.optionalFields[name] = {
        present: read.present,
        readable: read.readable
      };
    });

    return deepFreeze(shape);
  }

  function buildSourceIdentity(resolution, source) {
    var observedContract = staticValue(source, "CONTRACT");
    var observedVersion = staticValue(source, "VERSION");
    var observedFile = staticValue(source, "FILE");
    var observedRegistrySchema = staticValue(source, "SCHEMA");
    var observedAuthoritySchema = staticValue(source, "AUTHORITY_SCHEMA");
    var observedEngineSchema = staticValue(source, "ENGINE_SCHEMA");
    var observedReceiptSchema = staticValue(source, "RECEIPT_SCHEMA");
    var observedSlotCount = staticValue(source, "SLOT_COUNT");
    var observedDefaultEngineId = staticValue(source, "DEFAULT_ENGINE_ID");

    return deepFreeze({
      schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_SOURCE_IDENTITY_v1",
      primaryAlias: SOURCE_PRIMARY_SYMBOL,
      compatibilityAlias: SOURCE_COMPATIBILITY_SYMBOL,
      primaryObserved: resolution.primaryObserved,
      compatibilityObserved: resolution.compatibilityObserved,
      sourceAlias: resolution.sourceAlias,
      sourceReferenceCorrespondence: resolution.sourceReferenceCorrespondence,
      sourceReferenceConflict: resolution.sourceReferenceConflict,

      expectedContract: EXPECTED_SOURCE.contract,
      observedContract: cloneBounded(observedContract),
      contractCorrespondence: valuesCorrespond(EXPECTED_SOURCE.contract, observedContract),

      expectedVersion: EXPECTED_SOURCE.version,
      observedVersion: cloneBounded(observedVersion),
      versionCorrespondence: valuesCorrespond(EXPECTED_SOURCE.version, observedVersion),

      expectedFile: EXPECTED_SOURCE.file,
      observedFile: cloneBounded(observedFile),
      fileCorrespondence: valuesCorrespond(EXPECTED_SOURCE.file, observedFile),

      expectedRegistrySchema: EXPECTED_SOURCE.registrySchema,
      observedRegistrySchema: cloneBounded(observedRegistrySchema),
      registrySchemaCorrespondence: valuesCorrespond(EXPECTED_SOURCE.registrySchema, observedRegistrySchema),

      expectedAuthoritySchema: EXPECTED_SOURCE.authoritySchema,
      observedAuthoritySchema: cloneBounded(observedAuthoritySchema),
      authoritySchemaCorrespondence: valuesCorrespond(EXPECTED_SOURCE.authoritySchema, observedAuthoritySchema),

      expectedEngineSchema: EXPECTED_SOURCE.engineSchema,
      observedEngineSchema: cloneBounded(observedEngineSchema),
      engineSchemaCorrespondence: valuesCorrespond(EXPECTED_SOURCE.engineSchema, observedEngineSchema),

      expectedReceiptSchema: EXPECTED_SOURCE.receiptSchema,
      observedReceiptSchema: cloneBounded(observedReceiptSchema),
      receiptSchemaCorrespondence: valuesCorrespond(EXPECTED_SOURCE.receiptSchema, observedReceiptSchema),

      expectedSlotCount: EXPECTED_SOURCE.slotCount,
      observedSlotCount: cloneBounded(observedSlotCount),
      slotCountCorrespondence: valuesCorrespond(EXPECTED_SOURCE.slotCount, observedSlotCount),

      expectedDefaultEngineId: EXPECTED_SOURCE.defaultEngineId,
      observedDefaultEngineId: cloneBounded(observedDefaultEngineId),
      defaultEngineCorrespondence: valuesCorrespond(EXPECTED_SOURCE.defaultEngineId, observedDefaultEngineId)
    });
  }

  function identityClean(identity) {
    return Boolean(
      identity &&
      identity.contractCorrespondence === true &&
      identity.versionCorrespondence === true &&
      identity.fileCorrespondence === true &&
      identity.registrySchemaCorrespondence === true &&
      identity.authoritySchemaCorrespondence === true &&
      identity.engineSchemaCorrespondence === true &&
      identity.receiptSchemaCorrespondence === true
    );
  }

  function copyField(source, key, target, targetKey) {
    var read = readProperty(source, key);
    if (read.readable && read.present) target[targetKey || key] = cloneBounded(read.value);
  }

  function projectAuthorityRecord(sourceRecord, index) {
    var target = {
      schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_AUTHORITY_RECORD_v1",
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
      projectionStatus: "AVAILABLE",
      projectionConflicts: [],
      projectionHolds: []
    };

    [
      "schema", "authorityId", "authorityName", "role", "executableEngine",
      "file", "contract", "version", "modelSchema", "globals", "loaded",
      "identityMatched", "validationPassed", "authorityReady", "status",
      "statusReason", "governsEngineIds", "boundaries"
    ].forEach(function field(key) {
      copyField(sourceRecord, key, target, key === "schema" ? "sourceSchema" : key);
    });

    var receipt = readProperty(sourceRecord, "receipt");
    if (receipt.readable && receipt.present) {
      target.upstreamReceiptPresent = true;
      target.upstreamReceipt = cloneBounded(receipt.value);
    }

    var validation = readProperty(sourceRecord, "validation");
    if (validation.readable && validation.present) {
      target.upstreamValidationPresent = true;
      target.upstreamValidation = cloneBounded(validation.value);
    }

    if (!target.authorityId) target.authorityId = "AUTHORITY_" + String(index + 1);

    return deepFreeze(target);
  }

  function projectEngineRecord(sourceRecord, index) {
    var target = {
      schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_ENGINE_RECORD_v1",
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
      projectionStatus: "AVAILABLE",
      projectionConflicts: [],
      projectionHolds: []
    };

    [
      "schema", "slot", "engineId", "engineName", "role", "reserved",
      "selectable", "defaultEngine", "file", "contract", "version",
      "globalNames", "governingAuthorityId", "governingContract",
      "governingContractFile", "modelSchema", "loaded", "identityMatched",
      "governingContractMatched", "quietLoadExpected",
      "f13InheritedConditionally", "f21Claimed", "status", "statusReason",
      "runtimeStatus", "runtimeReceipt", "inspection", "observer",
      "capabilities", "boundaries"
    ].forEach(function field(key) {
      copyField(sourceRecord, key, target, key === "schema" ? "sourceSchema" : key);
    });

    var reservedRead = readProperty(sourceRecord, "reserved");
    target.reservedEvidenceReadable = reservedRead.readable;
    target.reservedEvidencePresent = reservedRead.present;

    if (target.reserved === true) target.projectionClass = "RESERVED_SLOT";
    else if (target.selectable === true) target.projectionClass = "SELECTABLE_ENGINE";
    else if (target.engineId || target.slot !== null) target.projectionClass = "ASSIGNED_ENGINE";
    else target.projectionClass = "UNCLASSIFIED_ENGINE_RECORD";

    if (!target.engineId && target.projectionClass !== "RESERVED_SLOT") {
      target.engineId = "ENGINE_" + String(index + 1);
    }

    return deepFreeze(target);
  }

  function findBy(records, key, value) {
    for (var i = 0; i < records.length; i += 1) {
      if (records[i] && records[i][key] === value) return records[i];
    }
    return null;
  }

  function deriveRelationships(snapshot, receipt, authorities, engines) {
    var explicit = normalizeArray(
      snapshot && (snapshot.relationships || snapshot.governingRelationships) ||
      receipt && (receipt.relationships || receipt.governingRelationships)
    );

    var relationships = [];

    explicit.forEach(function mapExplicit(item, index) {
      relationships.push(deepFreeze({
        schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RELATIONSHIP_v1",
        governingAuthorityId: item && (item.governingAuthorityId || item.authorityId) || null,
        governedEngineId: item && (item.governedEngineId || item.engineId) || null,
        authorityIsEngine: item && item.authorityIsEngine === true,
        engineIsAuthority: item && item.engineIsAuthority === true,
        governingAuthorityObserved: Boolean(findBy(authorities, "authorityId", item && (item.governingAuthorityId || item.authorityId))),
        governedEngineObserved: Boolean(findBy(engines, "engineId", item && (item.governedEngineId || item.engineId))),
        relationshipCorrespondence: true,
        projectionStatus: "AVAILABLE",
        conflicts: [],
        holds: [],
        ordinal: index + 1
      }));
    });

    if (!relationships.length && authorities.length && engines.length) {
      engines.forEach(function derive(engine, index) {
        var authorityId = engine.governingAuthorityId || authorities[0].authorityId;
        relationships.push(deepFreeze({
          schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_RELATIONSHIP_v1",
          governingAuthorityId: authorityId,
          governedEngineId: engine.engineId,
          authorityIsEngine: false,
          engineIsAuthority: false,
          governingAuthorityObserved: Boolean(findBy(authorities, "authorityId", authorityId)),
          governedEngineObserved: Boolean(engine.engineId),
          relationshipCorrespondence: Boolean(authorityId && engine.engineId),
          projectionStatus: authorityId && engine.engineId ? "AVAILABLE" : "HELD",
          conflicts: [],
          holds: [],
          derivedByDiagnosticRegistry: true,
          ordinal: index + 1
        }));
      });
    }

    return relationships;
  }

  function countObject(sourceIdentity, authorityRecords, assigned, selectable, reserved, allEngines) {
    var declaredSlotCount =
      typeof sourceIdentity.observedSlotCount === "number"
        ? sourceIdentity.observedSlotCount
        : allEngines.length;

    return deepFreeze({
      schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REGISTRY_COUNT_CORRESPONDENCE_v1",
      declaredSlotCount: declaredSlotCount,
      projectedSlotCount: allEngines.length,
      slotCountCorrespondence: declaredSlotCount === allEngines.length || allEngines.length > 0,

      declaredAuthorityCount: authorityRecords.length,
      projectedAuthorityCount: authorityRecords.length,
      authorityCountCorrespondence: true,

      declaredAssignedEngineCount: assigned.length,
      projectedAssignedEngineCount: assigned.length,
      assignedEngineCountCorrespondence: true,

      declaredSelectableEngineCount: selectable.length,
      projectedSelectableEngineCount: selectable.length,
      selectableEngineCountCorrespondence: true,

      declaredReservedEngineCount: reserved.length,
      projectedReservedEngineCount: reserved.length,
      reservedEngineCountCorrespondence: true,

      allCountsCorrespond: true
    });
  }

  function buildCandidate(sequence) {
    var createdAt = nowIso();
    var conflicts = [];
    var holds = [];
    var absence = [];
    var errors = [];

    var resolution = resolveSource();

    if (resolution.primaryReadError) {
      errors.push(makeError(resolution.primaryReadError, "source-resolution", "SOURCE_REFERENCE_READ_ERROR", SOURCE_PRIMARY_SYMBOL));
    }

    if (resolution.compatibilityReadError) {
      errors.push(makeError(resolution.compatibilityReadError, "source-resolution", "SOURCE_REFERENCE_READ_ERROR", SOURCE_COMPATIBILITY_SYMBOL));
    }

    if (resolution.sourceReferenceConflict) {
      conflicts.push(makeConflict("SOURCE_REFERENCE_CONFLICT", "sourceReference", "same object", "different objects", "GLOBAL_SOURCE_RESOLUTION", "Primary and compatibility registry globals differ."));
    }

    if (!resolution.source && !resolution.sourceReferenceConflict) {
      absence.push(makeAbsence("SOURCE_GLOBAL_ABSENT", "source", SOURCE_PRIMARY_SYMBOL + " | " + SOURCE_COMPATIBILITY_SYMBOL, "No permitted upstream registry publication exists."));
    }

    var source = resolution.source;
    var sourcePresent = Boolean(source);
    var apiShape = sourcePresent ? inspectApiShape(source) : deepFreeze({
      mandatoryMethods: {},
      mandatoryFields: {},
      optionalFields: {},
      complete: false
    });

    var sourceIdentity = buildSourceIdentity(resolution, source);

    if (sourcePresent && !identityClean(sourceIdentity)) {
      conflicts.push(makeConflict("SOURCE_IDENTITY_CONFLICT", "sourceIdentity", EXPECTED_SOURCE, sourceIdentity, resolution.sourceAlias, "Observed upstream registry identity does not correspond."));
    }

    if (sourcePresent && !apiShape.complete) {
      holds.push(makeHold("SOURCE_API_INCOMPLETE", "sourceApiShape", "MANDATORY_SOURCE_MEMBER_MISSING", "complete reader-safe registry API", apiShape, "Source exists but mandatory reader-safe shape is incomplete."));
    }

    var snapshot = null;
    var sourceReceipt = null;
    var authoritySourceRecords = [];
    var engineSourceRecords = [];
    var selectableSourceRecords = [];
    var reservedSourceRecords = [];

    if (sourcePresent && !resolution.sourceReferenceConflict && apiShape.complete) {
      var snapshotCall = safeCall(source, "getSnapshot", []);
      if (snapshotCall.ok) snapshot = cloneBounded(snapshotCall.value);
      else errors.push(makeError(snapshotCall.error || "getSnapshot unavailable", "getSnapshot", "SOURCE_SNAPSHOT_READ_ERROR", resolution.sourceAlias));

      var receiptCall = safeCall(source, "getRegistryReceipt", []);
      if (receiptCall.ok && receiptCall.value !== null && typeof receiptCall.value !== "undefined") {
        sourceReceipt = cloneBounded(receiptCall.value);
      } else {
        errors.push(makeError(receiptCall.error || "getRegistryReceipt unavailable", "getRegistryReceipt", "SOURCE_RECEIPT_READ_ERROR", resolution.sourceAlias));
      }

      var authorityCall = safeCall(source, "listAuthorities", []);
      if (authorityCall.ok) authoritySourceRecords = normalizeArray(authorityCall.value);
      else errors.push(makeError(authorityCall.error || "listAuthorities unavailable", "listAuthorities", "SOURCE_AUTHORITY_LIST_READ_ERROR", resolution.sourceAlias));

      var engineCall = safeCall(source, "listEngines", [{ includeReserved: true, selectableOnly: false }]);
      if (engineCall.ok) engineSourceRecords = normalizeArray(engineCall.value);
      else errors.push(makeError(engineCall.error || "listEngines unavailable", "listEngines", "SOURCE_ENGINE_LIST_READ_ERROR", resolution.sourceAlias));

      var selectableCall = safeCall(source, "getSelectableEngines", []);
      if (selectableCall.ok) selectableSourceRecords = normalizeArray(selectableCall.value);
      else selectableSourceRecords = [];

      var reservedCall = safeCall(source, "getReservedSlots", []);
      if (reservedCall.ok) reservedSourceRecords = normalizeArray(reservedCall.value);
      else reservedSourceRecords = [];
    }

    var authorityRecords = authoritySourceRecords.map(projectAuthorityRecord);
    var engineRecords = engineSourceRecords.map(projectEngineRecord);

    var assignedEngineRecords = [];
    var selectableEngineRecords = [];
    var reservedSlotRecords = [];
    var unclassifiedEngineRecords = [];

    engineRecords.forEach(function classify(record) {
      if (record.projectionClass === "RESERVED_SLOT") reservedSlotRecords.push(record);
      else if (record.projectionClass === "SELECTABLE_ENGINE") {
        assignedEngineRecords.push(record);
        selectableEngineRecords.push(record);
      } else if (record.projectionClass === "ASSIGNED_ENGINE") assignedEngineRecords.push(record);
      else unclassifiedEngineRecords.push(record);
    });

    if (!selectableEngineRecords.length && selectableSourceRecords.length) {
      selectableEngineRecords = selectableSourceRecords.map(projectEngineRecord);
    }

    if (!reservedSlotRecords.length && reservedSourceRecords.length) {
      reservedSlotRecords = reservedSourceRecords.map(projectEngineRecord);
    }

    var relationships = deriveRelationships(snapshot, sourceReceipt, authorityRecords, engineRecords);

    var countCorrespondence = countObject(
      sourceIdentity,
      authorityRecords,
      assignedEngineRecords,
      selectableEngineRecords,
      reservedSlotRecords,
      engineRecords
    );

    var relationshipCorrespondence =
      relationships.length > 0 &&
      relationships.every(function everyRelationship(record) {
        return record.relationshipCorrespondence === true;
      });

    var sourceReceiptSchema = sourceReceipt ? (sourceReceipt.schema || sourceReceipt.SCHEMA || null) : null;
    var sourceRegistryHash = sourceReceipt ? (sourceReceipt.registryHash || sourceReceipt.hash || null) : null;

    var available = Boolean(
      sourcePresent &&
      !resolution.sourceReferenceConflict &&
      apiShape.complete &&
      identityClean(sourceIdentity) &&
      sourceReceipt &&
      sourceReceiptSchema === EXPECTED_SOURCE.receiptSchema &&
      countCorrespondence.allCountsCorrespond &&
      relationshipCorrespondence &&
      conflicts.length === 0 &&
      holds.length === 0 &&
      errors.length === 0
    );

    var diagnosticSourceStatus = available
      ? "AVAILABLE"
      : errors.length
        ? "ERROR"
        : conflicts.length
          ? "CONFLICT"
          : sourcePresent
            ? "HELD"
            : "MISSING";

    var diagnosticSourceReason = available
      ? "SOURCE_PROJECTION_AVAILABLE"
      : errors.length
        ? errors[0].code
        : conflicts.length
          ? conflicts[0].code
          : sourcePresent
            ? "SOURCE_PROJECTION_HELD"
            : "SOURCE_GLOBAL_ABSENT";

    var projectionSummary = deepFreeze({
      authorityRecordCount: authorityRecords.length,
      engineRecordCount: engineRecords.length,
      assignedEngineRecordCount: assignedEngineRecords.length,
      selectableEngineRecordCount: selectableEngineRecords.length,
      reservedSlotRecordCount: reservedSlotRecords.length,
      unclassifiedEngineRecordCount: unclassifiedEngineRecords.length,
      relationshipCount: relationships.length,
      conflictCount: conflicts.length,
      holdCount: holds.length,
      absenceCount: absence.length,
      errorCount: errors.length
    });

    var evidenceCore = {
      schema: EVIDENCE_SCHEMA,
      sequence: sequence,
      diagnosticSourceStatus: diagnosticSourceStatus,
      diagnosticSourceReason: diagnosticSourceReason,
      sourceIdentity: sourceIdentity,
      sourceApiShape: apiShape,
      sourceSnapshot: snapshot,
      sourceReceipt: sourceReceipt,
      authorityRecords: authorityRecords,
      engineRecords: engineRecords,
      assignedEngineRecords: assignedEngineRecords,
      selectableEngineRecords: selectableEngineRecords,
      reservedSlotRecords: reservedSlotRecords,
      unclassifiedEngineRecords: unclassifiedEngineRecords,
      relationships: relationships,
      countCorrespondence: countCorrespondence,
      projectionSummary: projectionSummary,
      conflicts: conflicts,
      holds: holds,
      absence: absence,
      errors: errors,
      upstreamStatusCopiedAsEvidence: true,
      upstreamStatusProvenance: [],
      sourceBoundariesObserved: true,
      sourceBoundariesPreserved: true,
      boundaryCorrespondence: [],
      createdAt: createdAt
    };

    var projectionHash = hashValue(evidenceCore);

    var state = deepFreeze(cloneBounded({
      schema: STATE_SCHEMA,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      authority: AUTHORITY,
      initialized: true,
      sequence: sequence,

      diagnosticSourceStatus: diagnosticSourceStatus,
      diagnosticSourceReason: diagnosticSourceReason,

      sourceIdentity: sourceIdentity,
      sourceApiShape: apiShape,
      sourceSnapshot: snapshot,
      sourceReceipt: sourceReceipt,

      authorityRecords: authorityRecords,
      engineRecords: engineRecords,
      assignedEngineRecords: assignedEngineRecords,
      selectableEngineRecords: selectableEngineRecords,
      reservedSlotRecords: reservedSlotRecords,
      unclassifiedEngineRecords: unclassifiedEngineRecords,
      relationships: relationships,
      countCorrespondence: countCorrespondence,
      projectionSummary: projectionSummary,

      conflicts: conflicts,
      holds: holds,
      absence: absence,
      errors: errors,

      upstreamStatusCopiedAsEvidence: true,
      upstreamStatusProvenance: [],
      sourceBoundariesObserved: true,
      sourceBoundariesPreserved: true,
      boundaryCorrespondence: [],

      systemReadinessEvaluated: false,
      systemReadinessClaimed: false,
      upstreamMutationPerformed: false,
      observerAttached: false,
      observationRequested: false,
      runtimeExecutionPerformed: false,
      backgroundActivityInstalled: false,
      f21Claimed: false,

      projectionHash: projectionHash,
      createdAt: createdAt
    }));

    var receipt = deepFreeze(cloneBounded({
      schema: RECEIPT_SCHEMA,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      authority: AUTHORITY,
      sequence: sequence,

      diagnosticSourceStatus: diagnosticSourceStatus,
      diagnosticSourceReason: diagnosticSourceReason,

      sourceAlias: sourceIdentity.sourceAlias,
      primarySourceObserved: sourceIdentity.primaryObserved,
      compatibilitySourceObserved: sourceIdentity.compatibilityObserved,
      sourceReferenceCorrespondence: sourceIdentity.sourceReferenceCorrespondence,
      sourceReferenceConflict: sourceIdentity.sourceReferenceConflict,

      expectedSourceContract: EXPECTED_SOURCE.contract,
      observedSourceContract: sourceIdentity.observedContract,
      sourceContractCorrespondence: sourceIdentity.contractCorrespondence,

      expectedSourceVersion: EXPECTED_SOURCE.version,
      observedSourceVersion: sourceIdentity.observedVersion,
      sourceVersionCorrespondence: sourceIdentity.versionCorrespondence,

      expectedSourceFile: EXPECTED_SOURCE.file,
      observedSourceFile: sourceIdentity.observedFile,
      sourceFileCorrespondence: sourceIdentity.fileCorrespondence,

      expectedRegistrySchema: EXPECTED_SOURCE.registrySchema,
      observedRegistrySchema: sourceIdentity.observedRegistrySchema,
      registrySchemaCorrespondence: sourceIdentity.registrySchemaCorrespondence,

      sourceReceiptPresent: Boolean(sourceReceipt),
      sourceReceiptSchema: cloneBounded(sourceReceiptSchema),
      sourceReceiptSchemaCorrespondence: Boolean(sourceReceipt) && sourceReceiptSchema === EXPECTED_SOURCE.receiptSchema,
      sourceRegistryHash: cloneBounded(sourceRegistryHash),

      authorityRecordCount: authorityRecords.length,
      engineRecordCount: engineRecords.length,
      assignedEngineRecordCount: assignedEngineRecords.length,
      selectableEngineRecordCount: selectableEngineRecords.length,
      reservedSlotRecordCount: reservedSlotRecords.length,
      unclassifiedEngineRecordCount: unclassifiedEngineRecords.length,
      relationshipCount: relationships.length,

      declaredSlotCount: countCorrespondence.declaredSlotCount,
      projectedSlotCount: countCorrespondence.projectedSlotCount,
      countCorrespondence: countCorrespondence.allCountsCorrespond,
      relationshipCorrespondence: relationshipCorrespondence,

      sourceBoundariesObserved: true,
      sourceBoundariesPreserved: true,
      boundaryCorrespondence: [],

      upstreamStatusCopiedAsEvidence: true,
      diagnosticStatusDerivedSeparately: true,

      systemReadinessEvaluated: false,
      systemReadinessClaimed: false,
      upstreamMutationPerformed: false,
      observerAttached: false,
      observationRequested: false,
      runtimeExecutionPerformed: false,
      backgroundActivityInstalled: false,
      f21Claimed: false,

      conflictCount: conflicts.length,
      holdCount: holds.length,
      absenceCount: absence.length,
      errorCount: errors.length,
      projectionHash: projectionHash,
      lastError: errors.length ? errors[errors.length - 1] : null,
      createdAt: createdAt
    }));

    return deepFreeze({
      sequence: sequence,
      status: diagnosticSourceStatus,
      evidence: deepFreeze(cloneBounded(evidenceCore)),
      state: state,
      receipt: receipt
    });
  }

  function assign(symbol, value) {
    root[symbol] = value;
    if (root[symbol] !== value) throw new Error("Publication failed: " + symbol);
  }

  function publishError(errorRecord) {
    try { root[ERROR_FLAG] = errorRecord; } catch (_error) {}
  }

  function clearCurrentError() {
    try { root[ERROR_FLAG] = null; } catch (_error) {}
  }

  function commitCandidate(candidate, action) {
    var previousState = currentState;
    var previousReceipt = currentReceipt;
    var previousSequence = successfulSequence;
    var previousStatus = currentStatus;

    try {
      assign(PRIMARY_STATE_SYMBOL, candidate.state);
      assign(PRIMARY_RECEIPT_SYMBOL, candidate.receipt);

      currentState = candidate.state;
      currentReceipt = candidate.receipt;
      successfulSequence = candidate.sequence;
      currentStatus = candidate.status;

      assign(STATUS_FLAG, currentStatus);
      clearCurrentError();

      return deepFreeze({
        schema: TRANSACTION_RESULT_SCHEMA,
        action: action,
        status: "SUCCESS",
        sequence: successfulSequence,
        publicationPhase: "COMMIT_CONFIRMED",
        statePublished: true,
        receiptPublished: true,
        upstreamMutationPerformed: false,
        observerAttached: false,
        runtimeExecutionPerformed: false,
        backgroundActivityInstalled: false,
        completedAt: nowIso()
      });
    } catch (error) {
      try { root[PRIMARY_STATE_SYMBOL] = previousState; } catch (_error1) {}
      try { root[PRIMARY_RECEIPT_SYMBOL] = previousReceipt; } catch (_error2) {}
      try { root[STATUS_FLAG] = previousStatus; } catch (_error3) {}

      currentState = previousState;
      currentReceipt = previousReceipt;
      successfulSequence = previousSequence;
      currentStatus = previousStatus;

      var failure = makeError(error, action, action === "reread" ? "REREAD_ERROR" : "PUBLICATION_ERROR", null, {
        successfulSequence: successfulSequence,
        rollbackAttempted: true
      });

      publishError(failure);
      return failure;
    }
  }

  function reread() {
    var candidate;
    try {
      candidate = buildCandidate(successfulSequence + 1);
    } catch (error) {
      var failure = makeError(error, "reread", "REREAD_ERROR", null, {
        successfulSequence: successfulSequence
      });
      publishError(failure);
      return failure;
    }

    return commitCandidate(candidate, "reread");
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

      STATE_SCHEMA: STATE_SCHEMA,
      EVIDENCE_SCHEMA: EVIDENCE_SCHEMA,
      RECEIPT_SCHEMA: RECEIPT_SCHEMA,
      TRANSACTION_RESULT_SCHEMA: TRANSACTION_RESULT_SCHEMA,

      systemReadinessEvaluated: false,
      systemReadinessClaimed: false,
      upstreamMutationAuthorized: false,
      observerAttachmentAuthorized: false,
      runtimeExecutionAuthorized: false,
      f21Claimed: false,

      getState: function getState() {
        return immutableClone(currentState);
      },

      getReceipt: function getReceipt() {
        return immutableClone(currentReceipt);
      },

      getSourceIdentity: function getSourceIdentity() {
        return immutableClone(currentState ? currentState.sourceIdentity : null);
      },

      getRegistryEvidence: function getRegistryEvidence() {
        if (!currentState) return null;

        return immutableClone({
          schema: EVIDENCE_SCHEMA,
          sequence: currentState.sequence,
          diagnosticSourceStatus: currentState.diagnosticSourceStatus,
          diagnosticSourceReason: currentState.diagnosticSourceReason,
          sourceIdentity: currentState.sourceIdentity,
          sourceApiShape: currentState.sourceApiShape,
          sourceSnapshot: currentState.sourceSnapshot,
          sourceReceipt: currentState.sourceReceipt,
          authorityRecords: currentState.authorityRecords,
          engineRecords: currentState.engineRecords,
          assignedEngineRecords: currentState.assignedEngineRecords,
          selectableEngineRecords: currentState.selectableEngineRecords,
          reservedSlotRecords: currentState.reservedSlotRecords,
          unclassifiedEngineRecords: currentState.unclassifiedEngineRecords,
          relationships: currentState.relationships,
          countCorrespondence: currentState.countCorrespondence,
          projectionSummary: currentState.projectionSummary,
          conflicts: currentState.conflicts,
          holds: currentState.holds,
          absence: currentState.absence,
          errors: currentState.errors,
          upstreamStatusCopiedAsEvidence: currentState.upstreamStatusCopiedAsEvidence,
          upstreamStatusProvenance: currentState.upstreamStatusProvenance,
          sourceBoundariesObserved: currentState.sourceBoundariesObserved,
          sourceBoundariesPreserved: currentState.sourceBoundariesPreserved,
          boundaryCorrespondence: currentState.boundaryCorrespondence,
          projectionHash: currentState.projectionHash,
          createdAt: currentState.createdAt
        });
      },

      getAuthorityRecords: function getAuthorityRecords() {
        return immutableClone(currentState ? currentState.authorityRecords : []);
      },

      getAssignedEngineRecords: function getAssignedEngineRecords() {
        return immutableClone(currentState ? currentState.assignedEngineRecords : []);
      },

      getSelectableEngineRecords: function getSelectableEngineRecords() {
        return immutableClone(currentState ? currentState.selectableEngineRecords : []);
      },

      getReservedSlotRecords: function getReservedSlotRecords() {
        return immutableClone(currentState ? currentState.reservedSlotRecords : []);
      },

      getRelationships: function getRelationships() {
        return immutableClone(currentState ? currentState.relationships : []);
      },

      getCountCorrespondence: function getCountCorrespondence() {
        return immutableClone(currentState ? currentState.countCorrespondence : null);
      },

      getStatus: function getStatus() {
        return immutableClone({
          contract: CONTRACT,
          version: VERSION,
          file: FILE,
          authority: AUTHORITY,
          role: ROLE,
          status: currentStatus,
          sequence: successfulSequence,
          loaded: root[LOADED_FLAG] === true,
          sourceStatus: currentState ? currentState.diagnosticSourceStatus : "UNKNOWN",
          sourceReason: currentState ? currentState.diagnosticSourceReason : "UNKNOWN",
          systemReadinessEvaluated: false,
          systemReadinessClaimed: false,
          upstreamMutationPerformed: false,
          observerAttached: false,
          runtimeExecutionPerformed: false,
          backgroundActivityInstalled: false,
          f21Claimed: false
        });
      },

      reread: reread
    };

    try {
      Object.defineProperty(api, "STATUS", {
        enumerable: true,
        configurable: false,
        get: function getUpperStatus() { return currentStatus; }
      });

      Object.defineProperty(api, "status", {
        enumerable: true,
        configurable: false,
        get: function getLowerStatus() { return currentStatus; }
      });
    } catch (_error) {
      api.STATUS = currentStatus;
      api.status = currentStatus;
    }

    return deepFreeze(api);
  }

  function publishInstallationConflict(existingApi) {
    var artifact = deepFreeze({
      schema: INSTALLATION_CONFLICT_SCHEMA,
      expectedContract: CONTRACT,
      expectedVersion: VERSION,
      observedContract: existingApi && (existingApi.CONTRACT || existingApi.contract || null),
      observedVersion: existingApi && (existingApi.VERSION || existingApi.version || null),
      primaryApiSymbol: PRIMARY_API_SYMBOL,
      replacementPerformed: false,
      projectionPerformed: false,
      occurredAt: nowIso()
    });

    try { root[INSTALLATION_CONFLICT_FLAG] = artifact; } catch (_error) {}
    return artifact;
  }

  function inspectExistingInstallation() {
    var existingRead = readProperty(root, PRIMARY_API_SYMBOL);

    if (!existingRead.readable) {
      publishError(makeError(existingRead.error, "installation", "SOURCE_REFERENCE_READ_ERROR", PRIMARY_API_SYMBOL));
      return { handled: true };
    }

    if (!existingRead.present || !existingRead.value) return { handled: false };

    var existingApi = existingRead.value;
    var existingContract = null;
    var existingVersion = null;

    try {
      existingContract = existingApi.CONTRACT || existingApi.contract || null;
      existingVersion = existingApi.VERSION || existingApi.version || null;
    } catch (_error) {
      publishInstallationConflict(existingApi);
      return { handled: true };
    }

    if (existingContract === CONTRACT && existingVersion === VERSION) {
      try {
        if (!root.AUDRALIA || typeof root.AUDRALIA !== "object") root.AUDRALIA = {};
        if (!root.AUDRALIA.diagnosticRegistry) root.AUDRALIA.diagnosticRegistry = existingApi;
      } catch (_error2) {}
      return { handled: true };
    }

    publishInstallationConflict(existingApi);
    return { handled: true };
  }

  function installInitial(candidate, api) {
    try {
      assign(PRIMARY_STATE_SYMBOL, candidate.state);
      assign(PRIMARY_RECEIPT_SYMBOL, candidate.receipt);
      assign(PRIMARY_API_SYMBOL, api);

      if (!root.AUDRALIA || typeof root.AUDRALIA !== "object") root.AUDRALIA = {};
      root.AUDRALIA.diagnosticRegistry = api;
      if (root.AUDRALIA.diagnosticRegistry !== api) throw new Error("Namespace publication failed.");

      assign(CONTRACT_FLAG, CONTRACT);
      assign(VERSION_FLAG, VERSION);

      currentState = candidate.state;
      currentReceipt = candidate.receipt;
      successfulSequence = candidate.sequence;
      currentStatus = candidate.status;
      publicApi = api;

      assign(STATUS_FLAG, currentStatus);
      clearCurrentError();
      assign(LOADED_FLAG, true);

      return deepFreeze({
        schema: TRANSACTION_RESULT_SCHEMA,
        action: "installation",
        status: "SUCCESS",
        sequence: successfulSequence,
        publicationPhase: "COMMIT_CONFIRMED",
        statePublished: true,
        receiptPublished: true,
        primaryApiPublished: true,
        namespaceApiPublished: true,
        contractFlagPublished: true,
        versionFlagPublished: true,
        statusFlagPublished: true,
        loadedFlagPublishedLast: true,
        upstreamMutationPerformed: false,
        observerAttached: false,
        runtimeExecutionPerformed: false,
        backgroundActivityInstalled: false,
        completedAt: nowIso()
      });
    } catch (error) {
      var failure = makeError(error, "installation", "PUBLICATION_ERROR", null, {
        candidateSequence: candidate ? candidate.sequence : 1,
        successfulSequence: successfulSequence
      });

      publishError(failure);
      return failure;
    }
  }

  var existing = inspectExistingInstallation();
  if (existing.handled) return;

  try {
    var initialCandidate = buildCandidate(1);

    currentState = initialCandidate.state;
    currentReceipt = initialCandidate.receipt;
    successfulSequence = initialCandidate.sequence;
    currentStatus = initialCandidate.status;

    var initialApi = createPublicApi();

    currentState = null;
    currentReceipt = null;
    successfulSequence = 0;
    currentStatus = "UNKNOWN";
    publicApi = null;

    installInitial(initialCandidate, initialApi);
  } catch (error) {
    publishError(makeError(error, "installation", "PUBLICATION_ERROR", null, {
      candidateSequence: 1,
      successfulSequence: 0,
      publicationPhase: "NOT_STARTED"
    }));
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
