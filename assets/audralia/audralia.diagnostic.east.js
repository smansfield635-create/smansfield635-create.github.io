// /assets/audralia/audralia.diagnostic.east.js
// AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native East construction interpreter.
// Implements Position 3 for the Audralia nine-cycle diagnostic conductor.
// Consumes North intake and East source receipts.
// Owns source-side composition interpretation and construction admissibility.
// Does not inspect live runtime, render state, DOM, GPU resources, pixels, or production truth.

(function audraliaDiagnosticEastConstructionInterpretationF53D(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_RECEIPT_v1";
  var VERSION = "1.0.0";
  var VERSION_LABEL =
    "2026-06-14.audralia-diagnostic-east-construction-interpretation-f5-3d-v1";
  var FILE = "/assets/audralia/audralia.diagnostic.east.js";

  var STATION_ID = "EAST_CONSTRUCTION_INTERPRETATION";
  var CYCLE_POSITION = 3;
  var FIBONACCI = "F5";
  var NEWS = "EAST";

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
    webGLAuthority: false,
    webGPUAuthority: false,
    runtimeAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    sourcePresenceProvesRuntime: false,
    declarationProvesObservation: false,
    constructionAdmissibilityProvesRuntime: false,
    diagnosticPassProvesReady: false,
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

  function safeObject(value) {
    return isPlainObject(value) ? clonePlain(value, []) : {};
  }

  function safeArray(value) {
    return Array.isArray(value) ? clonePlain(value, []) : [];
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

  function pathClass(path) {
    if (!path) return "UNKNOWN";
    if (path.indexOf("/assets/engine/") === 0) return "ENGINE_ASSET";
    if (path.indexOf("/assets/audralia/") === 0) return "AUDRALIA_ASSET";
    if (path.indexOf("/showroom/globe/audralia/") === 0) return "AUDRALIA_ROUTE";
    if (path.indexOf("/assets/hearth/") === 0) return "HEARTH_ASSET_OUT_OF_SCOPE";
    if (path.indexOf("/assets/") === 0) return "OTHER_ASSET";
    if (path.indexOf("/") === 0) return "SITE_PATH";
    return "DECLARED_NON_PATH";
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

  function collectDeclaredFiles(eastSourceReceipt, request) {
    var sourceObservation = extractObservation(
      eastSourceReceipt,
      "EAST_SOURCE_DECLARED_FILES"
    );

    if (
      sourceObservation &&
      Array.isArray(sourceObservation.files)
    ) {
      return safeArray(sourceObservation.files);
    }

    var subject = safeObject(request.subject);
    var engine = safeObject(request.engine);
    var construct = safeObject(request.construct);

    return [
      {
        id: "SUBJECT_FILE",
        file: safeString(subject.file, null),
        pathClass: pathClass(safeString(subject.file, null))
      },
      {
        id: "ENGINE_FILE",
        file: safeString(engine.file, null),
        pathClass: pathClass(safeString(engine.file, null))
      },
      {
        id: "CONSTRUCT_ROOT_FILE",
        file: safeString(construct.rootFile, null),
        pathClass: pathClass(safeString(construct.rootFile, null))
      },
      {
        id: "CONSTRUCT_ROUTE",
        file: safeString(construct.route, null),
        pathClass: pathClass(safeString(construct.route, null))
      }
    ];
  }

  function collectDeclaredDependencies(eastSourceReceipt) {
    var dependencyObservation = extractObservation(
      eastSourceReceipt,
      "EAST_SOURCE_DECLARED_DEPENDENCIES"
    );

    if (
      dependencyObservation &&
      Array.isArray(dependencyObservation.dependencies)
    ) {
      return safeArray(dependencyObservation.dependencies);
    }

    return [];
  }

  function interpretComposition(request, validation) {
    var issues = [];
    var observations = [];

    var northReceipt = findReceipt(request, "NORTH_PROBE_INTAKE");
    var eastSourceReceipt = findReceipt(request, "EAST_PROBE_SOURCE");

    var subject = safeObject(request.subject);
    var engine = safeObject(request.engine);
    var construct = safeObject(request.construct);

    var declaredFiles = collectDeclaredFiles(eastSourceReceipt, request);
    var dependencies = collectDeclaredDependencies(eastSourceReceipt);

    var northPass = Boolean(
      northReceipt &&
      northReceipt.status === "PASS" &&
      northReceipt.handoffEligible === true
    );

    var eastSourcePass = Boolean(
      eastSourceReceipt &&
      eastSourceReceipt.status === "PASS" &&
      eastSourceReceipt.handoffEligible === true
    );

    var engineFile = safeString(engine.file, null);
    var engineContract = safeString(engine.contract, null);
    var constructRootFile = safeString(construct.rootFile, null);
    var constructRoute = safeString(construct.route, null);
    var constructId = safeString(construct.constructId, null);

    observations.push({
      id: "EAST_CONSTRUCTION_PRIOR_RECEIPT_STATUS",
      kind: "EXPOSED_RECEIPT",
      northReceiptObserved: Boolean(northReceipt),
      northReceiptPass: northPass,
      eastSourceReceiptObserved: Boolean(eastSourceReceipt),
      eastSourceReceiptPass: eastSourcePass
    });

    observations.push({
      id: "EAST_CONSTRUCTION_ENGINE_BINDING",
      kind: "DERIVED",
      engineContract: engineContract,
      engineFile: engineFile,
      engineFilePathClass: pathClass(engineFile),
      engineDeclared: Boolean(engineContract || engineFile)
    });

    observations.push({
      id: "EAST_CONSTRUCTION_CONSTRUCT_BINDING",
      kind: "DERIVED",
      constructId: constructId,
      constructContract: safeString(construct.contract, null),
      constructVersion: safeString(construct.version, null),
      constructRootFile: constructRootFile,
      constructRootFilePathClass: pathClass(constructRootFile),
      constructRoute: constructRoute,
      constructRoutePathClass: pathClass(constructRoute)
    });

    observations.push({
      id: "EAST_CONSTRUCTION_DECLARED_FILE_COMPOSITION",
      kind: "DERIVED",
      declaredFileCount: declaredFiles.filter(function count(item) {
        return Boolean(item && item.file);
      }).length,
      engineAssetCount: declaredFiles.filter(function count(item) {
        return item && item.pathClass === "ENGINE_ASSET";
      }).length,
      audraliaAssetCount: declaredFiles.filter(function count(item) {
        return item && item.pathClass === "AUDRALIA_ASSET";
      }).length,
      audraliaRouteCount: declaredFiles.filter(function count(item) {
        return item && item.pathClass === "AUDRALIA_ROUTE";
      }).length,
      outOfScopeCount: declaredFiles.filter(function count(item) {
        return item && item.pathClass === "HEARTH_ASSET_OUT_OF_SCOPE";
      }).length,
      files: declaredFiles
    });

    observations.push({
      id: "EAST_CONSTRUCTION_DEPENDENCY_COMPOSITION",
      kind: "DERIVED",
      dependencyCount: dependencies.length,
      dependencies: dependencies
    });

    observations.push({
      id: "EAST_CONSTRUCTION_ADMISSIBILITY",
      kind: "DERIVED",
      sourcePresenceProvesRuntime: false,
      declarationProvesObservation: false,
      constructionAdmissibilityProvesRuntime: false,
      eligibleForSurfaceHostObservation:
        northPass &&
        eastSourcePass &&
        Boolean(engineFile) &&
        pathClass(engineFile) === "ENGINE_ASSET" &&
        Boolean(constructRootFile) &&
        pathClass(constructRootFile) === "AUDRALIA_ASSET" &&
        Boolean(constructRoute) &&
        pathClass(constructRoute) === "AUDRALIA_ROUTE"
    });

    if (!validation.passed) {
      issues = issues.concat(validation.issues);
    }

    if (!northReceipt) {
      issues.push(issue("NORTH_INTAKE_RECEIPT_REQUIRED", "$.priorStationReceipts"));
    } else if (!northPass) {
      issues.push(issue("NORTH_INTAKE_RECEIPT_NOT_PASSING", "$.priorStationReceipts"));
    }

    if (!eastSourceReceipt) {
      issues.push(issue("EAST_SOURCE_RECEIPT_REQUIRED", "$.priorStationReceipts"));
    } else if (!eastSourcePass) {
      issues.push(issue("EAST_SOURCE_RECEIPT_NOT_PASSING", "$.priorStationReceipts"));
    }

    if (!engineFile) {
      issues.push(issue("ENGINE_FILE_REQUIRED_FOR_CONSTRUCTION_ADMISSIBILITY", "$.engine.file"));
    } else if (pathClass(engineFile) !== "ENGINE_ASSET") {
      issues.push(issue("ENGINE_FILE_NOT_ADMISSIBLE_ENGINE_ASSET", "$.engine.file"));
    }

    if (!constructRootFile) {
      issues.push(issue("CONSTRUCT_ROOT_FILE_REQUIRED_FOR_CONSTRUCTION_ADMISSIBILITY", "$.construct.rootFile"));
    } else if (pathClass(constructRootFile) !== "AUDRALIA_ASSET") {
      issues.push(issue("CONSTRUCT_ROOT_FILE_NOT_ADMISSIBLE_AUDRALIA_ASSET", "$.construct.rootFile"));
    }

    if (!constructRoute) {
      issues.push(issue("CONSTRUCT_ROUTE_REQUIRED_FOR_CONSTRUCTION_ADMISSIBILITY", "$.construct.route"));
    } else if (pathClass(constructRoute) !== "AUDRALIA_ROUTE") {
      issues.push(issue("CONSTRUCT_ROUTE_NOT_ADMISSIBLE_AUDRALIA_ROUTE", "$.construct.route"));
    }

    declaredFiles.forEach(function eachFile(item, index) {
      if (
        item &&
        item.file &&
        item.pathClass === "HEARTH_ASSET_OUT_OF_SCOPE"
      ) {
        issues.push(
          issue(
            "HEARTH_ASSET_NOT_ADMISSIBLE_IN_AUDRALIA_CONSTRUCTION",
            "$.declaredFiles[" + index + "]"
          )
        );
      }
    });

    return deepFreeze({
      observations: deepFreeze(observations),
      issues: deepFreeze(issues),
      northReceipt: clonePlain(northReceipt, []),
      eastSourceReceipt: clonePlain(eastSourceReceipt, []),
      declaredFiles: deepFreeze(declaredFiles),
      dependencies: deepFreeze(dependencies),
      eligibleForSurfaceHostObservation:
        issues.length === 0
    });
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var interpretation = interpretComposition(request || {}, validation);

    var status = "PASS";
    var completed = true;
    var handoffEligible = true;
    var summary = "EAST_CONSTRUCTION_ADMISSIBLE_FOR_SURFACE_HOST_OBSERVATION";

    if (!validation.passed) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "EAST_CONSTRUCTION_HELD_REQUEST_INVALID";
    } else if (interpretation.issues.length) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "EAST_CONSTRUCTION_HELD_COMPOSITION_NOT_ADMISSIBLE";
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

      observations: interpretation.observations,

      evidence: [
        {
          id: "EAST_CONSTRUCTION_REQUEST_HASH",
          kind: "DERIVED",
          hash: hash(request || {})
        },
        {
          id: "EAST_CONSTRUCTION_DECLARED_FILE_COMPOSITION_HASH",
          kind: "DERIVED",
          hash: hash(interpretation.declaredFiles)
        },
        {
          id: "EAST_CONSTRUCTION_DEPENDENCY_COMPOSITION_HASH",
          kind: "DERIVED",
          hash: hash(interpretation.dependencies)
        },
        {
          id: "EAST_CONSTRUCTION_PRIOR_RECEIPTS_HASH",
          kind: "DERIVED",
          hash: hash({
            north: interpretation.northReceipt,
            eastSource: interpretation.eastSourceReceipt
          })
        },
        {
          id: "EAST_CONSTRUCTION_VALIDATION",
          kind: "DERIVED",
          passed: validation.passed,
          issueCount: validation.issues.length
        }
      ],

      issues: interpretation.issues,

      firstHeldCoordinate:
        status === "HOLD" ? "F5:EAST_CONSTRUCTION_INTERPRETATION" : null,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,

      recommendedOwner: {
        ownerType: "SOURCE_CONSTRUCTION_DECLARATION",
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
        file:
          request &&
          request.construct &&
          typeof request.construct.rootFile === "string"
            ? request.construct.rootFile
            : null,
        component: "EAST_CONSTRUCTION_INTERPRETATION"
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
        "Position 3 East construction interpreter for source-side composition and construction admissibility.",
      quietLoad: true,
      threeDimensionalNative: true,
      liveRuntimeInspection: false,
      sourcePresenceProvesRuntime: false,
      declarationProvesObservation: false,
      constructionAdmissibilityProvesRuntime: false,
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

    var existing = root.AUDRALIA_DIAGNOSTIC_EAST;

    if (existing && existing.CONTRACT !== CONTRACT) {
      root.AUDRALIA_DIAGNOSTIC_EAST_INSTALLATION_CONFLICT =
        deepFreeze({
          contract: CONTRACT,
          file: FILE,
          status: "CONFLICT",
          reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
          generatedAt: nowIso()
        });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_EAST = api;

    var namespace = ensureNamespace("AUDRALIA");
    if (namespace) {
      namespace.diagnosticEast = api;
    }

    root.AUDRALIA_DIAGNOSTIC_EAST_RECEIPT = getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_EAST_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_EAST_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_EAST_VERSION__ = VERSION;

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
