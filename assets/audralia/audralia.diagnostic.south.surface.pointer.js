// /assets/audralia/audralia.diagnostic.south.surface.pointer.js
// AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_AUXILIARY_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native South auxiliary pointer.
// Auxiliary to Position 8; does not create a new cycle position.
// Owns restitution pointer extraction for 3D surface, host, route, engine,
// owner-file, and continuation target references.
// Does not mutate, repair, render, authorize files, or claim readiness.

(function audraliaDiagnosticSouthSurfacePointerAuxiliary3D(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_AUXILIARY_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_AUXILIARY_3D_RECEIPT_v1";
  var VERSION = "1.0.0";
  var VERSION_LABEL =
    "2026-06-14.audralia-diagnostic-south-surface-pointer-auxiliary-3d-v1";
  var FILE = "/assets/audralia/audralia.diagnostic.south.surface.pointer.js";

  var AUXILIARY_ROLE = "SOUTH_SURFACE_POINTER";
  var PARENT_POSITION = 8;
  var PARENT_STATION_ID = "SOUTH_RESTITUTION_INTERPRETATION";
  var CREATES_CYCLE_POSITION = false;

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
      Object.keys(value).forEach(function each(key) {
        deepFreeze(value[key], memory);
      });
      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function clonePlain(value, seen) {
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

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return null;
    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, 377).map(function map(entry) {
        return clonePlain(entry, memory);
      });
    }

    var output = {};
    Object.keys(value).slice(0, 233).forEach(function each(key) {
      try {
        output[String(key).slice(0, 12000)] = clonePlain(value[key], memory);
      } catch (_error) {
        output[String(key).slice(0, 12000)] = null;
      }
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
    var text = stableStringify(clonePlain(value, []));
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
    return value.slice(0, 12000);
  }

  function safeObject(value) {
    return isPlainObject(value) ? clonePlain(value, []) : {};
  }

  function findReceipt(packet, stationId) {
    var receipts = [];

    if (Array.isArray(packet)) receipts = packet;
    else if (isPlainObject(packet) && Array.isArray(packet.stationReceipts)) receipts = packet.stationReceipts;
    else if (isPlainObject(packet) && Array.isArray(packet.priorStationReceipts)) receipts = packet.priorStationReceipts;

    for (var i = receipts.length - 1; i >= 0; i -= 1) {
      if (isPlainObject(receipts[i]) && receipts[i].stationId === stationId) {
        return receipts[i];
      }
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

  function composePointer(input) {
    var packet = safeObject(input);

    var southReceipt = findReceipt(packet, "SOUTH_RESTITUTION_INTERPRETATION");
    var handoffReceipt = findReceipt(packet, "SOUTH_PROBE_HANDOFF");
    var westReceipt = findReceipt(packet, "WEST_RUNTIME_INTERPRETATION");
    var surfaceReceipt = findReceipt(packet, "CANVAS_SURFACE_TRUTH");

    var restitutionTarget = extractObservation(
      southReceipt,
      "SOUTH_RESTITUTION_TARGET_INTERPRETATION"
    );

    var ownerRecommendation = extractObservation(
      southReceipt,
      "SOUTH_RESTITUTION_OWNER_RECOMMENDATION"
    );

    var handoffTarget = extractObservation(
      handoffReceipt,
      "SOUTH_HANDOFF_TARGET_DECLARATION"
    );

    var westIdentity = extractObservation(
      westReceipt,
      "WEST_INTERPRETATION_SOURCE_TO_RUNTIME_IDENTITY"
    );

    var surfaceHost = extractObservation(
      surfaceReceipt,
      "SURFACE_3D_HOST_DECLARATION"
    );

    var effectiveOwnerFile =
      safeString(restitutionTarget && restitutionTarget.effectiveOwnerFile, null) ||
      safeString(ownerRecommendation && ownerRecommendation.ownerFile, null) ||
      safeString(ownerRecommendation && ownerRecommendation.recommendedFile, null) ||
      safeString(handoffTarget && handoffTarget.restitutionCandidateFile, null) ||
      safeString(handoffTarget && handoffTarget.targetFile, null);

    var targetRoute =
      safeString(handoffTarget && handoffTarget.targetRoute, null);

    var engineFile =
      safeString(westIdentity && westIdentity.declaredEngineFile, null);

    var engineContract =
      safeString(westIdentity && westIdentity.declaredEngineContract, null);

    var hostFile =
      safeString(surfaceHost && surfaceHost.hostFile, null);

    var pointers = [
      {
        id: "RESTITUTION_OWNER_FILE",
        value: effectiveOwnerFile,
        pointerClass: classifyPointer(effectiveOwnerFile),
        source: "SOUTH_RESTITUTION_INTERPRETATION"
      },
      {
        id: "HANDOFF_TARGET_ROUTE",
        value: targetRoute,
        pointerClass: classifyPointer(targetRoute),
        source: "SOUTH_PROBE_HANDOFF"
      },
      {
        id: "ENGINE_FILE",
        value: engineFile,
        pointerClass: classifyPointer(engineFile),
        source: "WEST_RUNTIME_INTERPRETATION"
      },
      {
        id: "ENGINE_CONTRACT",
        value: engineContract,
        pointerClass: engineContract ? "CONTRACT_POINTER" : "UNKNOWN",
        source: "WEST_RUNTIME_INTERPRETATION"
      },
      {
        id: "SURFACE_HOST_FILE",
        value: hostFile,
        pointerClass: classifyPointer(hostFile),
        source: "CANVAS_SURFACE_TRUTH"
      }
    ];

    var usablePointers = pointers.filter(function filter(pointer) {
      return Boolean(pointer.value);
    });

    var outOfScopePointers = usablePointers.filter(function filter(pointer) {
      return pointer.pointerClass === "HEARTH_OUT_OF_SCOPE_POINTER";
    });

    var receipt = {
      schema: "AUDRALIA_DIAGNOSTIC_AUXILIARY_POINTER_RECEIPT_v1",
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      auxiliaryRole: AUXILIARY_ROLE,
      parentPosition: PARENT_POSITION,
      parentStationId: PARENT_STATION_ID,
      createsCyclePosition: CREATES_CYCLE_POSITION,

      status:
        usablePointers.length && !outOfScopePointers.length
          ? "PASS"
          : usablePointers.length
            ? "HELD"
            : "UNKNOWN",

      pointerCount: usablePointers.length,
      outOfScopePointerCount: outOfScopePointers.length,

      pointers: pointers,
      usablePointers: usablePointers,
      outOfScopePointers: outOfScopePointers,

      recommendedPrimaryPointer: effectiveOwnerFile || targetRoute || engineFile || hostFile || null,
      recommendedPrimaryPointerClass:
        classifyPointer(effectiveOwnerFile || targetRoute || engineFile || hostFile || null),

      pointerProvesRepair: false,
      pointerProvesReadiness: false,

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
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      auxiliaryRole: AUXILIARY_ROLE,
      parentPosition: PARENT_POSITION,
      parentStationId: PARENT_STATION_ID,
      createsCyclePosition: CREATES_CYCLE_POSITION,
      quietLoad: true,
      threeDimensionalNative: true,
      role:
        "South auxiliary pointer for restitution target, owner-file, engine-file, route, and 3D surface-host references.",
      pointerProvesRepair: false,
      pointerProvesReadiness: false,
      noClaims: NO_CLAIMS
    };

    definition.definitionHash = hash(definition);
    definition.generatedAt = nowIso();

    return deepFreeze(definition);
  }

  function getStatus() {
    return deepFreeze({
      contract: CONTRACT,
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
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      VERSION_LABEL: VERSION_LABEL,
      FILE: FILE,
      AUXILIARY_ROLE: AUXILIARY_ROLE,
      PARENT_POSITION: PARENT_POSITION,
      PARENT_STATION_ID: PARENT_STATION_ID,
      CREATES_CYCLE_POSITION: CREATES_CYCLE_POSITION,

      composePointer: composePointer,
      getDefinitionReceipt: getDefinitionReceipt,
      getStatus: getStatus,

      clone: function exposedClone(value) {
        return deepFreeze(clonePlain(value, []));
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

    if (existing && existing.CONTRACT !== CONTRACT) {
      root.AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_INSTALLATION_CONFLICT =
        deepFreeze({
          contract: CONTRACT,
          file: FILE,
          status: "CONFLICT",
          reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
          generatedAt: nowIso()
        });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER = api;

    var namespace = ensureNamespace("AUDRALIA");
    if (namespace) namespace.diagnosticSouthSurfacePointer = api;

    root.AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_RECEIPT =
      getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_VERSION__ = VERSION;

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
