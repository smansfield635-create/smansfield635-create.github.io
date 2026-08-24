// /assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js
// AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native surface-host truth probe.
// Implements Position 4 for the Audralia nine-cycle diagnostic conductor.
// Owns 3D host, presentation surface, WebGL/WebGPU host declaration,
// and admitted surface evidence observation.
// Canvas name is retained for navigation familiarity only.
// Canvas2D is not governing evidence.
// Does not render, resize, mutate DOM, initialize runtime, repair route, or claim readiness.

(function audraliaDiagnosticProbeCanvasSurfaceTruthF83D(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_RECEIPT_v1";
  var VERSION = "1.0.0";
  var VERSION_LABEL =
    "2026-06-14.audralia-diagnostic-probe-canvas-surface-truth-f8-3d-v1";
  var FILE = "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js";

  var STATION_ID = "CANVAS_SURFACE_TRUTH";
  var CYCLE_POSITION = 4;
  var FIBONACCI = "F8";
  var NEWS = "SURFACE";

  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var LIMITS = Object.freeze({
    maxStringLength: 12000,
    maxArrayLength: 377,
    maxObjectKeys: 233,
    maxDepth: 13,
    maxIssues: 89
  });

  var NO_CLAIMS = Object.freeze({
    engineAuthority: false,
    productionMutationAuthority: false,
    contractRewriteAuthority: false,
    routeMutationAuthority: false,
    rendererAuthority: false,
    canvasAuthority: false,
    canvas2DAuthority: false,
    canvasDrawingAuthority: false,
    canvasCreationAuthority: false,
    webGLAuthority: false,
    webGPUAuthority: false,
    runtimeAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    surfacePresenceProvesRuntime: false,
    hostPresenceProvesRendering: false,
    presentationSurfaceProvesVisualPass: false,
    canvas2DContextAcceptedAs3DTruth: false,
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
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
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

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE").slice(0, 512)
    };
  }

  function clonePlain(value, seen) {
    if (value === null || typeof value === "string" || typeof value === "boolean") {
      return value;
    }

    if (isFiniteNumber(value)) return value;

    if (
      value === undefined ||
      typeof value === "number" ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint"
    ) {
      return null;
    }

    if (!value || typeof value !== "object") return null;
    if (!Array.isArray(value) && !isPlainObject(value)) return null;

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return null;
    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, LIMITS.maxArrayLength).map(function map(entry) {
        return clonePlain(entry, memory);
      });
    }

    var output = {};
    var keys = [];

    try {
      keys = Object.keys(value).slice(0, LIMITS.maxObjectKeys);
    } catch (_error) {
      return null;
    }

    keys.forEach(function each(key) {
      var safeKey = String(key).slice(0, LIMITS.maxStringLength);
      try {
        output[safeKey] = clonePlain(value[key], memory);
      } catch (_error2) {
        output[safeKey] = null;
      }
    });

    return output;
  }

  function stableStringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (isFiniteNumber(value)) return String(value);

    if (Array.isArray(value)) {
      return "[" + value.map(stableStringify).join(",") + "]";
    }

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
    return value.slice(0, LIMITS.maxStringLength);
  }

  function safeBool(value, fallback) {
    if (fallback === undefined) fallback = false;
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function safeObject(value) {
    return isPlainObject(value) ? clonePlain(value, []) : {};
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (issues.length >= LIMITS.maxIssues) return;

      if (depth > LIMITS.maxDepth) {
        issues.push(issue("DEPTH_LIMIT_EXCEEDED", path));
        return;
      }

      if (
        item === null ||
        typeof item === "string" ||
        typeof item === "boolean" ||
        isFiniteNumber(item)
      ) {
        if (typeof item === "string" && item.length > LIMITS.maxStringLength) {
          issues.push(issue("STRING_LIMIT_EXCEEDED", path));
        }
        return;
      }

      if (
        item === undefined ||
        typeof item === "function" ||
        typeof item === "symbol" ||
        typeof item === "bigint"
      ) {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
        return;
      }

      if (typeof item === "number") {
        issues.push(issue("NONFINITE_NUMBER_FORBIDDEN", path));
        return;
      }

      if (!item || typeof item !== "object") {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
        return;
      }

      if (!Array.isArray(item) && !isPlainObject(item)) {
        issues.push(issue("NON_PLAIN_OBJECT_FORBIDDEN", path));
        return;
      }

      if (seen.indexOf(item) !== -1) {
        issues.push(issue("CYCLIC_OBJECT_FORBIDDEN", path));
        return;
      }

      seen.push(item);

      if (Array.isArray(item)) {
        if (item.length > LIMITS.maxArrayLength) {
          issues.push(issue("ARRAY_LIMIT_EXCEEDED", path));
          return;
        }

        item.forEach(function eachArray(entry, index) {
          walk(entry, path + "[" + index + "]", depth + 1, seen);
        });

        return;
      }

      var keys = Object.keys(item);

      if (keys.length > LIMITS.maxObjectKeys) {
        issues.push(issue("OBJECT_KEY_LIMIT_EXCEEDED", path));
        return;
      }

      keys.forEach(function eachKey(key) {
        var descriptor;

        try {
          descriptor = Object.getOwnPropertyDescriptor(item, key);
        } catch (_error) {
          issues.push(issue("PROPERTY_DESCRIPTOR_UNREADABLE", path + "." + key));
          return;
        }

        if (!descriptor || descriptor.get || descriptor.set) {
          issues.push(issue("ACCESSOR_PROPERTY_FORBIDDEN", path + "." + key));
          return;
        }

        walk(item[key], path + "." + key, depth + 1, seen);
      });
    }

    walk(value, "$", 0, []);

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function validateStationRequest(request) {
    var issues = [];
    var plain = validatePlainData(request);

    if (!plain.passed) {
      issues = issues.concat(plain.issues);
    }

    if (!isPlainObject(request)) {
      issues.push(issue("REQUEST_OBJECT_REQUIRED", "$"));
      return deepFreeze({ passed: false, issues: deepFreeze(issues) });
    }

    if (request.schema !== REQUEST_SCHEMA) {
      issues.push(issue("REQUEST_SCHEMA_MISMATCH", "$.schema"));
    }

    if (request.position !== CYCLE_POSITION) {
      issues.push(issue("REQUEST_POSITION_MISMATCH", "$.position"));
    }

    if (request.stationId !== STATION_ID) {
      issues.push(issue("REQUEST_STATION_ID_MISMATCH", "$.stationId"));
    }

    if (!safeString(request.cycleId, "")) {
      issues.push(issue("REQUEST_CYCLE_ID_REQUIRED", "$.cycleId"));
    }

    if (!Array.isArray(request.priorStationReceipts)) {
      issues.push(issue("PRIOR_STATION_RECEIPTS_ARRAY_REQUIRED", "$.priorStationReceipts"));
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function findReceipt(request, stationId) {
    var receipts = Array.isArray(request.priorStationReceipts)
      ? request.priorStationReceipts
      : [];

    for (var i = receipts.length - 1; i >= 0; i -= 1) {
      if (isPlainObject(receipts[i]) && receipts[i].stationId === stationId) {
        return receipts[i];
      }
    }

    return null;
  }

  function getDeclaredSurfaceSource(request) {
    var construct = safeObject(request.construct);
    var engine = safeObject(request.engine);
    var extensions = safeObject(request.extensions);

    var surface = {};

    if (isPlainObject(construct.surface)) {
      surface = construct.surface;
    } else if (isPlainObject(engine.surface)) {
      surface = engine.surface;
    } else if (isPlainObject(extensions.surface)) {
      surface = extensions.surface;
    }

    return safeObject(surface);
  }

  function normalizeBackend(value) {
    var text = safeString(value, "UNKNOWN");

    if (text === "WEBGL" || text === "WebGL" || text === "webgl") return "WEBGL";
    if (text === "WEBGL2" || text === "WebGL2" || text === "webgl2") return "WEBGL2";
    if (text === "WEBGPU" || text === "WebGPU" || text === "webgpu") return "WEBGPU";
    if (text === "THREE_D_ENGINE" || text === "3D" || text === "THREE_D") return "THREE_D_ENGINE";
    if (text === "CUSTOM_3D_HOST") return "CUSTOM_3D_HOST";
    if (text === "CANVAS_2D" || text === "2D" || text === "CANVAS2D") return "CANVAS_2D";
    return text || "UNKNOWN";
  }

  function backendAdmitted(backend) {
    return (
      backend === "WEBGL" ||
      backend === "WEBGL2" ||
      backend === "WEBGPU" ||
      backend === "THREE_D_ENGINE" ||
      backend === "CUSTOM_3D_HOST"
    );
  }

  function extractObservation(receipt, observationId) {
    if (!isPlainObject(receipt) || !Array.isArray(receipt.observations)) {
      return null;
    }

    for (var i = 0; i < receipt.observations.length; i += 1) {
      if (
        isPlainObject(receipt.observations[i]) &&
        receipt.observations[i].id === observationId
      ) {
        return receipt.observations[i];
      }
    }

    return null;
  }

  function interpretSurfaceHost(request, validation) {
    var issues = [];
    var observations = [];

    var eastConstructionReceipt =
      findReceipt(request, "EAST_CONSTRUCTION_INTERPRETATION");

    var eastConstructionPass = Boolean(
      eastConstructionReceipt &&
      eastConstructionReceipt.status === "PASS" &&
      eastConstructionReceipt.handoffEligible === true
    );

    var admissibility = extractObservation(
      eastConstructionReceipt,
      "EAST_CONSTRUCTION_ADMISSIBILITY"
    );

    var eligibleFromEast = Boolean(
      admissibility &&
      admissibility.eligibleForSurfaceHostObservation === true
    );

    var surface = getDeclaredSurfaceSource(request);
    var backend = normalizeBackend(surface.backend || surface.backendKind || surface.contextKind);
    var hostId = safeString(surface.hostId, null);
    var hostFile = safeString(surface.hostFile, null);
    var hostSelector = safeString(surface.hostSelector, null);
    var presentationTarget = safeString(surface.presentationTarget, null);

    var declaredHostPresent = safeBool(surface.hostDeclared, Boolean(hostId || hostFile || hostSelector));
    var contextDeclared = safeBool(surface.contextDeclared, Boolean(backend && backend !== "UNKNOWN"));
    var presentationDeclared = safeBool(
      surface.presentationDeclared,
      Boolean(presentationTarget || surface.presentationSurfaceDeclared)
    );

    var hostEvidenceKind =
      surface.hostEvidenceKind === "DIRECT" ||
      surface.hostEvidenceKind === "EXPOSED_RECEIPT" ||
      surface.hostEvidenceKind === "DERIVED" ||
      surface.hostEvidenceKind === "DECLARED"
        ? surface.hostEvidenceKind
        : "DECLARED";

    var contextEvidenceKind =
      surface.contextEvidenceKind === "DIRECT" ||
      surface.contextEvidenceKind === "EXPOSED_RECEIPT" ||
      surface.contextEvidenceKind === "DERIVED" ||
      surface.contextEvidenceKind === "DECLARED"
        ? surface.contextEvidenceKind
        : "DECLARED";

    observations.push({
      id: "SURFACE_PRIOR_EAST_CONSTRUCTION_STATUS",
      kind: "EXPOSED_RECEIPT",
      eastConstructionReceiptObserved: Boolean(eastConstructionReceipt),
      eastConstructionPass: eastConstructionPass,
      eligibleFromEast: eligibleFromEast
    });

    observations.push({
      id: "SURFACE_3D_HOST_DECLARATION",
      kind: hostEvidenceKind,
      hostId: hostId,
      hostFile: hostFile,
      hostSelector: hostSelector,
      hostDeclared: declaredHostPresent,
      hostEvidenceKind: hostEvidenceKind
    });

    observations.push({
      id: "SURFACE_3D_BACKEND_DECLARATION",
      kind: contextEvidenceKind,
      backend: backend,
      backendAdmitted: backendAdmitted(backend),
      contextDeclared: contextDeclared,
      canvas2DAcceptedAs3DTruth: false
    });

    observations.push({
      id: "SURFACE_PRESENTATION_DECLARATION",
      kind: "DECLARED",
      presentationTarget: presentationTarget,
      presentationDeclared: presentationDeclared,
      presentationSurfaceProvesVisualPass: false
    });

    observations.push({
      id: "SURFACE_TRUTH_BOUNDARY",
      kind: "DERIVED",
      canvasNameRetainedForNavigation: true,
      canvas2DGoverning: false,
      webGLCanvasHostAllowed: true,
      webGPUCanvasHostAllowed: true,
      hostPresenceProvesRuntime: false,
      presentationSurfaceProvesVisualPass: false
    });

    observations.push({
      id: "SURFACE_HOST_ADMISSIBILITY",
      kind: "DERIVED",
      surfaceHostAdmitted:
        eastConstructionPass &&
        eligibleFromEast &&
        declaredHostPresent &&
        contextDeclared &&
        backendAdmitted(backend) &&
        backend !== "CANVAS_2D",
      nextStationEligible:
        eastConstructionPass &&
        eligibleFromEast &&
        declaredHostPresent &&
        contextDeclared &&
        backendAdmitted(backend) &&
        backend !== "CANVAS_2D"
    });

    if (!validation.passed) {
      issues = issues.concat(validation.issues);
    }

    if (!eastConstructionReceipt) {
      issues.push(issue("EAST_CONSTRUCTION_RECEIPT_REQUIRED", "$.priorStationReceipts"));
    } else if (!eastConstructionPass) {
      issues.push(issue("EAST_CONSTRUCTION_RECEIPT_NOT_PASSING", "$.priorStationReceipts"));
    }

    if (!eligibleFromEast) {
      issues.push(issue("EAST_CONSTRUCTION_DID_NOT_AUTHORIZE_SURFACE_OBSERVATION", "$.priorStationReceipts"));
    }

    if (!declaredHostPresent) {
      issues.push(issue("THREE_D_HOST_DECLARATION_REQUIRED", "$.construct.surface"));
    }

    if (!contextDeclared) {
      issues.push(issue("THREE_D_BACKEND_DECLARATION_REQUIRED", "$.construct.surface.backend"));
    }

    if (backend === "CANVAS_2D") {
      issues.push(issue("CANVAS_2D_NOT_ADMISSIBLE_AS_3D_SURFACE_TRUTH", "$.construct.surface.backend"));
    } else if (!backendAdmitted(backend)) {
      issues.push(issue("THREE_D_BACKEND_NOT_ADMITTED", "$.construct.surface.backend", backend));
    }

    if (!presentationDeclared) {
      issues.push(issue("PRESENTATION_TARGET_DECLARATION_REQUIRED", "$.construct.surface.presentationTarget"));
    }

    return deepFreeze({
      observations: deepFreeze(observations),
      issues: deepFreeze(issues),
      backend: backend,
      hostId: hostId,
      hostFile: hostFile,
      presentationTarget: presentationTarget,
      surfaceHostAdmitted: issues.length === 0
    });
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var surface = interpretSurfaceHost(request || {}, validation);

    var status = "PASS";
    var completed = true;
    var handoffEligible = true;
    var summary = "SURFACE_3D_HOST_ADMITTED_FOR_RUNTIME_OBSERVATION";

    if (!validation.passed) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "SURFACE_TRUTH_HELD_REQUEST_INVALID";
    } else if (surface.issues.length) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "SURFACE_TRUTH_HELD_3D_HOST_NOT_ADMISSIBLE";
    }

    var receipt = {
      schema: RECEIPT_SCHEMA,
      cycleId: safeString(request && request.cycleId, "UNKNOWN"),
      position: CYCLE_POSITION,
      stationId: STATION_ID,

      contract: CONTRACT,
      version: VERSION,
      file: FILE,

      status: status,
      completed: completed,
      handoffEligible: handoffEligible,

      summary: summary,

      observations: surface.observations,

      evidence: [
        {
          id: "SURFACE_TRUTH_REQUEST_HASH",
          kind: "DERIVED",
          hash: hash(request || {})
        },
        {
          id: "SURFACE_TRUTH_OBSERVATION_HASH",
          kind: "DERIVED",
          hash: hash(surface.observations)
        },
        {
          id: "SURFACE_TRUTH_BACKEND_ADMISSION",
          kind: "DERIVED",
          backend: surface.backend,
          admitted: surface.surfaceHostAdmitted
        },
        {
          id: "SURFACE_TRUTH_VALIDATION",
          kind: "DERIVED",
          passed: validation.passed,
          issueCount: validation.issues.length
        }
      ],

      issues: surface.issues,

      firstHeldCoordinate:
        status === "HOLD" ? "F8:CANVAS_SURFACE_TRUTH" : null,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,

      recommendedOwner: {
        ownerType: "THREE_D_SURFACE_DECLARATION",
        subjectId:
          request &&
          request.construct &&
          typeof request.construct.constructId === "string"
            ? request.construct.constructId
            : null,
        contract:
          request &&
          request.engine &&
          typeof request.engine.contract === "string"
            ? request.engine.contract
            : null,
        file: surface.hostFile || null,
        component: "CANVAS_SURFACE_TRUTH"
      },

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
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      requestSchema: REQUEST_SCHEMA,
      receiptSchema: RECEIPT_SCHEMA,
      exactInterface: [
        "CONTRACT",
        "VERSION",
        "FILE",
        "STATION_ID",
        "CYCLE_POSITION",
        "getDefinitionReceipt",
        "executeCycleStation"
      ],
      role:
        "Position 4 Surface Truth probe for 3D host and presentation-surface admission. Canvas name is navigational only; Canvas2D is not governing.",
      quietLoad: true,
      threeDimensionalNative: true,
      canvasNameRetainedForNavigation: true,
      canvas2DGoverning: false,
      htmlCanvasAs3DPresentationHostAllowed: true,
      webGLOrWebGPUCanvasPresentationEvidenceAllowed: true,
      liveRuntimeInspection: false,
      hostPresenceProvesRuntime: false,
      presentationSurfaceProvesVisualPass: false,
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
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      loaded: true,
      readyForExplicitRegistration: true,
      canvas2DGoverning: false,
      threeDimensionalNative: true,
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
      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,

      getDefinitionReceipt: getDefinitionReceipt,
      executeCycleStation: executeCycleStation,
      getStatus: getStatus,

      validateStationRequest: validateStationRequest,
      clone: function exposedClone(value) {
        return deepFreeze(clonePlain(value, []));
      },
      hash: hash,

      noClaims: NO_CLAIMS
    });
  }

  function ensureNamespace(name) {
    if (!root || typeof root !== "object") return null;
    if (!root[name] || typeof root[name] !== "object") {
      root[name] = {};
    }
    return root[name];
  }

  function publish(api) {
    if (!root || typeof root !== "object") return api;

    var existing = root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH;

    if (existing && existing.CONTRACT !== CONTRACT) {
      root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_INSTALLATION_CONFLICT =
        deepFreeze({
          contract: CONTRACT,
          file: FILE,
          status: "CONFLICT",
          reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
          generatedAt: nowIso()
        });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = api;

    var namespace = ensureNamespace("AUDRALIA");
    if (namespace) {
      namespace.diagnosticProbeCanvasSurfaceTruth = api;
      namespace.diagnosticSurfaceTruth = api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT =
      getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_STATION_ID__ =
      STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_VERSION__ = VERSION;

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
