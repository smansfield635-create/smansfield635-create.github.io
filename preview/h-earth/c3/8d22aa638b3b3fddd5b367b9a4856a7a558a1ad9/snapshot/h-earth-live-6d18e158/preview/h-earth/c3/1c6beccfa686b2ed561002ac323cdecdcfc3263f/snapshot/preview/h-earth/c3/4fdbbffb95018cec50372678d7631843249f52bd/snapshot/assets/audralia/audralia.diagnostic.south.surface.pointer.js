// /assets/audralia/audralia.diagnostic.south.surface.pointer.js
// AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_AUXILIARY_3D_TNT_v2
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native South auxiliary pointer.
// Auxiliary to Position 8; does not create a new cycle position.
// Reads renewed F55 v2, F34, F21, F8 current receipt grammars.
// Does not mutate, repair, render, authorize files, or claim readiness.

(function audraliaDiagnosticSouthSurfacePointerAuxiliary3DV2(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_AUXILIARY_3D_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_AUXILIARY_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_AUXILIARY_3D_RECEIPT_v2";
  var VERSION = "2.0.0";
  var FILE = "/assets/audralia/audralia.diagnostic.south.surface.pointer.js";

  var AUXILIARY_ROLE = "SOUTH_SURFACE_POINTER";
  var PARENT_POSITION = 8;
  var PARENT_STATION_ID = "SOUTH_RESTITUTION_INTERPRETATION";
  var CREATES_CYCLE_POSITION = false;

  var LIMITS = Object.freeze({
    maxStringLength: 12000,
    maxArrayLength: 377,
    maxObjectKeys: 233,
    maxDepth: 13
  });

  var NO_CLAIMS = Object.freeze({
    engineAuthority: false,
    productionMutationAuthority: false,
    contractRewriteAuthority: false,
    routeMutationAuthority: false,
    rendererAuthority: false,
    runtimeAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    pointerProvesRepair: false,
    pointerProvesReadiness: false,
    pointerProvesDefect: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false
  });

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  function deepFreeze(value, seen) {
    if (!value || typeof value !== "object") return value;
    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);

    try {
      Object.keys(value).forEach(function freezeKey(key) {
        deepFreeze(value[key], memory);
      });
      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function clonePlain(value, seen, depth) {
    var memory = seen || [];
    var level = Number(depth) || 0;

    if (level > LIMITS.maxDepth) return null;
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (isFiniteNumber(value)) return value;

    if (
      value === undefined ||
      typeof value === "number" ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint"
    ) return null;

    if (!value || typeof value !== "object") return null;
    if (!Array.isArray(value) && !isPlainObject(value)) return null;
    if (memory.indexOf(value) !== -1) return null;

    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, LIMITS.maxArrayLength).map(function map(entry) {
        return clonePlain(entry, memory.slice(), level + 1);
      });
    }

    var output = {};
    Object.keys(value).slice(0, LIMITS.maxObjectKeys).forEach(function each(key) {
      output[String(key).slice(0, LIMITS.maxStringLength)] =
        clonePlain(value[key], memory.slice(), level + 1);
    });

    return output;
  }

  function stableStringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (isFiniteNumber(value)) return String(value);
    if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
    if (isPlainObject(value)) {
      return "{" + Object.keys(value).sort().map(function encodeKey(key) {
        return JSON.stringify(key) + ":" + stableStringify(value[key]);
      }).join(",") + "}";
    }
    return "null";
  }

  function hash(value) {
    var text = stableStringify(clonePlain(value, [], 0));
    var h = 0x811c9dc5;

    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      h >>>= 0;
    }

    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = null;
    if (typeof value !== "string") return fallback;
    var text = value.slice(0, LIMITS.maxStringLength);
    return text.length ? text : fallback;
  }

  function safeObject(value) {
    return isPlainObject(value) ? clonePlain(value, [], 0) : {};
  }

  function findReceipt(packet, stationId) {
    var receipts = [];

    if (Array.isArray(packet)) receipts = packet;
    else if (isPlainObject(packet) && Array.isArray(packet.stationReceipts)) receipts = packet.stationReceipts;
    else if (isPlainObject(packet) && Array.isArray(packet.priorStationReceipts)) receipts = packet.priorStationReceipts;
    else if (isPlainObject(packet) && isPlainObject(packet.packet) && Array.isArray(packet.packet.stationReceipts)) receipts = packet.packet.stationReceipts;

    for (var i = receipts.length - 1; i >= 0; i -= 1) {
      if (isPlainObject(receipts[i]) && receipts[i].stationId === stationId) return receipts[i];
    }

    return null;
  }

  function extractObservation(receipt, id) {
    if (!isPlainObject(receipt) || !Array.isArray(receipt.observations)) return null;

    for (var i = 0; i < receipt.observations.length; i += 1) {
      if (isPlainObject(receipt.observations[i]) && receipt.observations[i].id === id) {
        return receipt.observations[i];
      }
    }

    return null;
  }

  function classifyPointer(path) {
    if (!path) return "UNKNOWN";
    if (path.indexOf("/assets/audralia/") === 0) return "AUDRALIA_ASSET_POINTER";
    if (path.indexOf("/assets/engine/") === 0) return "ENGINE_ASSET_POINTER";
    if (path.indexOf("/showroom/globe/audralia/") === 0) return "AUDRALIA_ROUTE_POINTER";
    if (path.indexOf("/assets/hearth/") === 0) return "HEARTH_OUT_OF_SCOPE_POINTER";
    if (path.indexOf("/") === 0) return "SITE_POINTER";
    return "NON_PATH_POINTER";
  }

  function pointer(id, value, source, sourceField) {
    return {
      id: id,
      value: value || null,
      pointerClass: classifyPointer(value),
      source: source,
      sourceField: sourceField || null
    };
  }

  function composePointer(input) {
    var packet = safeObject(input);

    var southReceipt = findReceipt(packet, "SOUTH_RESTITUTION_INTERPRETATION");
    var handoffReceipt = findReceipt(packet, "SOUTH_PROBE_HANDOFF");
    var westReceipt = findReceipt(packet, "WEST_RUNTIME_INTERPRETATION");
    var surfaceReceipt = findReceipt(packet, "CANVAS_SURFACE_TRUTH");

    var f55Owner = extractObservation(southReceipt, "SOUTH_RESTITUTION_OWNER_RECOMMENDATION");
    var f55Target = extractObservation(southReceipt, "SOUTH_RESTITUTION_HANDOFF_TARGET_READ");
    var f55Result = extractObservation(southReceipt, "SOUTH_RESTITUTION_CONTINUATION_CLASSIFICATION");

    var f34Target = extractObservation(handoffReceipt, "SOUTH_HANDOFF_TARGET_DECLARATION");
    var f21Identity = extractObservation(westReceipt, "WEST_INTERPRETATION_SOURCE_TO_RUNTIME_IDENTITY");
    var f8Binding = extractObservation(surfaceReceipt, "CANVAS_SURFACE_TARGET_BINDING");
    var f8Frame = extractObservation(surfaceReceipt, "CANVAS_SURFACE_TARGET_FRAME");

    var effectiveOwnerFile =
      safeString(f55Owner && f55Owner.effectiveOwnerFile, null) ||
      safeString(f55Owner && f55Owner.ownerFile, null) ||
      safeString(f55Owner && f55Owner.recommendedFile, null) ||
      safeString(f55Target && f55Target.restitutionCandidateFile, null) ||
      safeString(f55Target && f55Target.targetFile, null) ||
      safeString(f34Target && f34Target.restitutionCandidateFile, null) ||
      safeString(f34Target && f34Target.targetFile, null);

    var targetRoute =
      safeString(f55Target && f55Target.targetRoute, null) ||
      safeString(f34Target && f34Target.targetRoute, null) ||
      safeString(f8Binding && f8Binding.observedRouteNormalized, null) ||
      safeString(f8Binding && f8Binding.expectedRouteNormalized, null);

    var engineFile =
      safeString(f21Identity && f21Identity.declaredEngineFile, null);

    var engineContract =
      safeString(f21Identity && f21Identity.declaredEngineContract, null);

    var surfaceFrameId =
      safeString(f8Binding && f8Binding.frameId, null);

    var runtimeGlobalName =
      safeString(f8Frame && f8Frame.runtimeGlobalName, null);

    var pointers = [
      pointer("RESTITUTION_OWNER_FILE", effectiveOwnerFile, "SOUTH_RESTITUTION_INTERPRETATION", "effectiveOwnerFile"),
      pointer("HANDOFF_TARGET_ROUTE", targetRoute, "SOUTH_HANDOFF_OR_F8_BINDING", "targetRoute"),
      pointer("ENGINE_FILE", engineFile, "WEST_RUNTIME_INTERPRETATION", "declaredEngineFile"),
      {
        id: "ENGINE_CONTRACT",
        value: engineContract,
        pointerClass: engineContract ? "CONTRACT_POINTER" : "UNKNOWN",
        source: "WEST_RUNTIME_INTERPRETATION",
        sourceField: "declaredEngineContract"
      },
      {
        id: "TARGET_FRAME_ID",
        value: surfaceFrameId,
        pointerClass: surfaceFrameId ? "DOM_ID_POINTER" : "UNKNOWN",
        source: "CANVAS_SURFACE_TRUTH",
        sourceField: "frameId"
      },
      {
        id: "RUNTIME_GLOBAL_NAME",
        value: runtimeGlobalName,
        pointerClass: runtimeGlobalName ? "GLOBAL_POINTER" : "UNKNOWN",
        source: "CANVAS_SURFACE_TRUTH",
        sourceField: "runtimeGlobalName"
      }
    ];

    var usablePointers = pointers.filter(function filter(entry) {
      return Boolean(entry.value);
    });

    var outOfScopePointers = usablePointers.filter(function filter(entry) {
      return entry.pointerClass === "HEARTH_OUT_OF_SCOPE_POINTER";
    });

    var primary =
      effectiveOwnerFile ||
      targetRoute ||
      engineFile ||
      engineContract ||
      surfaceFrameId ||
      runtimeGlobalName ||
      null;

    var status = "UNKNOWN";
    if (usablePointers.length && !outOfScopePointers.length) status = "PASS";
    else if (usablePointers.length) status = "HOLD";

    var receipt = {
      schema: "AUDRALIA_DIAGNOSTIC_AUXILIARY_POINTER_RECEIPT_v2",
      receipt: RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      auxiliaryRole: AUXILIARY_ROLE,
      parentPosition: PARENT_POSITION,
      parentStationId: PARENT_STATION_ID,
      createsCyclePosition: CREATES_CYCLE_POSITION,

      status: status,
      pointerCount: usablePointers.length,
      outOfScopePointerCount: outOfScopePointers.length,

      sourceReceipts: {
        southRestitutionObserved: Boolean(southReceipt),
        southHandoffObserved: Boolean(handoffReceipt),
        westInterpretationObserved: Boolean(westReceipt),
        surfaceTruthObserved: Boolean(surfaceReceipt)
      },

      continuationClass:
        f55Result && f55Result.continuationClass
          ? safeString(f55Result.continuationClass, null)
          : null,

      railTerminalEligible:
        f55Result && typeof f55Result.railTerminalEligible === "boolean"
          ? f55Result.railTerminalEligible
          : null,

      pointers: pointers,
      usablePointers: usablePointers,
      outOfScopePointers: outOfScopePointers,

      recommendedPrimaryPointer: primary,
      recommendedPrimaryPointerClass: classifyPointer(primary),

      pointerProvesRepair: false,
      pointerProvesReadiness: false,
      pointerProvesDefect: false,
      directionOnly: true,

      generatedAt: nowIso(),
      receiptHash: null,
      noClaims: NO_CLAIMS
    };

    receipt.receiptHash = hash(receipt);
    return deepFreeze(receipt);
  }

  function getDefinitionReceipt() {
    var definition = {
      receipt: RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      auxiliaryRole: AUXILIARY_ROLE,
      parentPosition: PARENT_POSITION,
      parentStationId: PARENT_STATION_ID,
      createsCyclePosition: CREATES_CYCLE_POSITION,
      quietLoad: true,
      threeDimensionalNative: true,
      role:
        "South auxiliary pointer for restitution target, owner-file, engine-file, route, target-frame, and runtime-global references.",
      readsCurrentF55Grammar: true,
      readsCurrentF34Grammar: true,
      readsCurrentF21Grammar: true,
      readsCurrentF8Grammar: true,
      pointerProvesRepair: false,
      pointerProvesReadiness: false,
      pointerProvesDefect: false,
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    };

    definition.definitionHash = hash(definition);
    return deepFreeze(definition);
  }

  function getStatus() {
    return deepFreeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      auxiliaryRole: AUXILIARY_ROLE,
      parentPosition: PARENT_POSITION,
      parentStationId: PARENT_STATION_ID,
      createsCyclePosition: CREATES_CYCLE_POSITION,
      loaded: true,
      readyForAuxiliaryUse: true,
      noClaims: NO_CLAIMS
    });
  }

  function buildApi() {
    return deepFreeze({
      CONTRACT: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      AUXILIARY_ROLE: AUXILIARY_ROLE,
      PARENT_POSITION: PARENT_POSITION,
      PARENT_STATION_ID: PARENT_STATION_ID,
      CREATES_CYCLE_POSITION: CREATES_CYCLE_POSITION,

      composePointer: composePointer,
      getDefinitionReceipt: getDefinitionReceipt,
      getStatus: getStatus,

      classifyPointer: classifyPointer,
      clone: function exposedClone(value) {
        return deepFreeze(clonePlain(value, [], 0));
      },
      hash: hash,
      noClaims: NO_CLAIMS
    });
  }

  function ensureNamespace(name) {
    if (!root || typeof root !== "object") return null;
    if (!root[name] || typeof root[name] !== "object") root[name] = {};
    return root[name];
  }

  function publish(api) {
    if (!root || typeof root !== "object") return api;

    var existing = root.AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT
    ) {
      root.AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_INSTALLATION_CONFLICT =
        deepFreeze({
          contract: CONTRACT,
          previousContract: PREVIOUS_CONTRACT,
          file: FILE,
          status: "CONFLICT",
          reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
          existingContract: existing.CONTRACT || null,
          generatedAt: nowIso()
        });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER = api;

    var namespace = ensureNamespace("AUDRALIA");

    if (namespace) {
      namespace.diagnosticSouthSurfacePointer = api;

      if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
        namespace.diagnostics = {};
      }

      namespace.diagnostics.southSurfacePointer = api;
    }

    root.AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_RECEIPT =
      getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_VERSION__ = VERSION;
    root.__AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CONTRACT__ = CONTRACT;

    return api;
  }

  var API = buildApi();
  publish(API);

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
