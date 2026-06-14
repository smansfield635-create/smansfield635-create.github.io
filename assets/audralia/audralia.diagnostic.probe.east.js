// /assets/audralia/audralia.diagnostic.probe.east.js
// AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native East source probe.
// Implements Position 2 for the Audralia nine-cycle diagnostic conductor.
// Owns source-side declarations, construction inputs, file identities,
// contract identities, model declarations, declared dependencies, and source provenance.
// Does not inspect live runtime, render state, DOM, GPU resources, pixels, or production truth.

(function audraliaDiagnosticProbeEastSourceF33D(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_RECEIPT_v1";
  var VERSION = "1.0.0";
  var VERSION_LABEL =
    "2026-06-14.audralia-diagnostic-probe-east-source-f3-3d-v1";
  var FILE = "/assets/audralia/audralia.diagnostic.probe.east.js";

  var STATION_ID = "EAST_PROBE_SOURCE";
  var CYCLE_POSITION = 2;
  var FIBONACCI = "F3";
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

    if (!isPlainObject(request.subject)) {
      issues.push(issue("REQUEST_SUBJECT_OBJECT_REQUIRED", "$.subject"));
    }

    if (!isPlainObject(request.engine)) {
      issues.push(issue("REQUEST_ENGINE_OBJECT_REQUIRED", "$.engine"));
    }

    if (!isPlainObject(request.construct)) {
      issues.push(issue("REQUEST_CONSTRUCT_OBJECT_REQUIRED", "$.construct"));
    }

    if (!Array.isArray(request.priorStationReceipts)) {
      issues.push(issue("PRIOR_STATION_RECEIPTS_ARRAY_REQUIRED", "$.priorStationReceipts"));
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function collectDeclaredDependencies(subject, engine, construct) {
    var dependencies = [];

    function appendFromArray(source, sourceName) {
      if (!Array.isArray(source)) return;

      source.slice(0, LIMITS.maxArrayLength).forEach(function each(entry, index) {
        if (typeof entry === "string") {
          dependencies.push({
            source: sourceName,
            index: index,
            file: entry,
            contract: null,
            kind: "DECLARED_STRING_DEPENDENCY"
          });
          return;
        }

        if (isPlainObject(entry)) {
          dependencies.push({
            source: sourceName,
            index: index,
            file: safeString(entry.file, null),
            contract: safeString(entry.contract, null),
            kind: safeString(entry.kind, "DECLARED_OBJECT_DEPENDENCY")
          });
        }
      });
    }

    appendFromArray(subject.dependencies, "subject.dependencies");
    appendFromArray(engine.dependencies, "engine.dependencies");
    appendFromArray(construct.dependencies, "construct.dependencies");
    appendFromArray(construct.files, "construct.files");
    appendFromArray(construct.requiredFiles, "construct.requiredFiles");
    appendFromArray(engine.contractFiles, "engine.contractFiles");

    return dependencies;
  }

  function classifyPath(path) {
    if (!path) return "UNKNOWN";
    if (path.indexOf("/assets/engine/") === 0) return "ENGINE_ASSET";
    if (path.indexOf("/assets/audralia/") === 0) return "AUDRALIA_ASSET";
    if (path.indexOf("/showroom/globe/audralia/") === 0) return "AUDRALIA_ROUTE";
    if (path.indexOf("/assets/hearth/") === 0) return "HEARTH_ASSET_OUT_OF_SCOPE";
    if (path.indexOf("/assets/") === 0) return "OTHER_ASSET";
    if (path.indexOf("/") === 0) return "SITE_PATH";
    return "DECLARED_NON_PATH";
  }

  function inspectDeclaredSource(request, validation) {
    var observations = [];
    var issues = [];

    var subject = safeObject(request.subject);
    var engine = safeObject(request.engine);
    var construct = safeObject(request.construct);

    var subjectFile = safeString(subject.file, null);
    var engineFile = safeString(engine.file, null);
    var constructRootFile = safeString(construct.rootFile, null);
    var constructRoute = safeString(construct.route, null);

    var dependencies = collectDeclaredDependencies(subject, engine, construct);

    var declaredFiles = [
      {
        id: "SUBJECT_FILE",
        file: subjectFile,
        pathClass: classifyPath(subjectFile)
      },
      {
        id: "ENGINE_FILE",
        file: engineFile,
        pathClass: classifyPath(engineFile)
      },
      {
        id: "CONSTRUCT_ROOT_FILE",
        file: constructRootFile,
        pathClass: classifyPath(constructRootFile)
      },
      {
        id: "CONSTRUCT_ROUTE",
        file: constructRoute,
        pathClass: classifyPath(constructRoute)
      }
    ];

    dependencies.forEach(function eachDependency(dep) {
      declaredFiles.push({
        id: "DEPENDENCY_" + dep.source + "_" + dep.index,
        file: dep.file,
        contract: dep.contract,
        pathClass: classifyPath(dep.file),
        kind: dep.kind
      });
    });

    observations.push({
      id: "EAST_SOURCE_SUBJECT_DECLARATION",
      kind: "DECLARED",
      subjectId: safeString(subject.subjectId, null),
      subjectType: safeString(subject.subjectType, null),
      contract: safeString(subject.contract, null),
      version: safeString(subject.version, null),
      file: subjectFile,
      filePathClass: classifyPath(subjectFile)
    });

    observations.push({
      id: "EAST_SOURCE_ENGINE_DECLARATION",
      kind: "DECLARED",
      contract: safeString(engine.contract, null),
      version: safeString(engine.version, null),
      file: engineFile,
      filePathClass: classifyPath(engineFile),
      declaredContractFiles: safeArray(engine.contractFiles)
    });

    observations.push({
      id: "EAST_SOURCE_CONSTRUCT_DECLARATION",
      kind: "DECLARED",
      constructId: safeString(construct.constructId, null),
      contract: safeString(construct.contract, null),
      version: safeString(construct.version, null),
      route: constructRoute,
      routePathClass: classifyPath(constructRoute),
      rootFile: constructRootFile,
      rootFilePathClass: classifyPath(constructRootFile)
    });

    observations.push({
      id: "EAST_SOURCE_DECLARED_FILES",
      kind: "DERIVED",
      fileCount: declaredFiles.filter(function count(item) {
        return Boolean(item.file);
      }).length,
      files: declaredFiles
    });

    observations.push({
      id: "EAST_SOURCE_DECLARED_DEPENDENCIES",
      kind: "DERIVED",
      dependencyCount: dependencies.length,
      dependencies: dependencies
    });

    observations.push({
      id: "EAST_SOURCE_PRIOR_NORTH_RECEIPT",
      kind: "EXPOSED_RECEIPT",
      priorReceiptCount: Array.isArray(request.priorStationReceipts)
        ? request.priorStationReceipts.length
        : 0,
      northReceiptObserved: Array.isArray(request.priorStationReceipts)
        ? request.priorStationReceipts.some(function find(receipt) {
            return (
              isPlainObject(receipt) &&
              receipt.stationId === "NORTH_PROBE_INTAKE" &&
              receipt.status === "PASS"
            );
          })
        : false
    });

    if (!validation.passed) {
      issues = issues.concat(validation.issues);
    }

    if (!engineFile) {
      issues.push(issue("ENGINE_FILE_DECLARATION_REQUIRED", "$.engine.file"));
    }

    if (engineFile && classifyPath(engineFile) !== "ENGINE_ASSET") {
      issues.push(issue("ENGINE_FILE_NOT_IN_ENGINE_ASSET_SCOPE", "$.engine.file"));
    }

    if (!constructRootFile) {
      issues.push(issue("CONSTRUCT_ROOT_FILE_DECLARATION_REQUIRED", "$.construct.rootFile"));
    }

    if (constructRootFile && classifyPath(constructRootFile) !== "AUDRALIA_ASSET") {
      issues.push(issue("CONSTRUCT_ROOT_FILE_NOT_AUDRALIA_ASSET", "$.construct.rootFile"));
    }

    if (!constructRoute) {
      issues.push(issue("CONSTRUCT_ROUTE_DECLARATION_REQUIRED", "$.construct.route"));
    }

    if (constructRoute && classifyPath(constructRoute) !== "AUDRALIA_ROUTE") {
      issues.push(issue("CONSTRUCT_ROUTE_NOT_AUDRALIA_ROUTE", "$.construct.route"));
    }

    dependencies.forEach(function eachDependency(dep) {
      if (!dep.file && !dep.contract) {
        issues.push(
          issue(
            "DEPENDENCY_DECLARATION_MISSING_FILE_AND_CONTRACT",
            dep.source + "[" + dep.index + "]"
          )
        );
      }
    });

    return deepFreeze({
      observations: deepFreeze(observations),
      issues: deepFreeze(issues),
      declaredFiles: deepFreeze(declaredFiles),
      dependencies: deepFreeze(dependencies)
    });
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var source = inspectDeclaredSource(request || {}, validation);

    var status = "PASS";
    var completed = true;
    var handoffEligible = true;
    var summary = "EAST_SOURCE_DECLARATIONS_ACCEPTED";

    if (!validation.passed) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "EAST_SOURCE_HELD_REQUEST_INVALID";
    } else if (source.issues.length) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "EAST_SOURCE_HELD_DECLARATION_INCOMPLETE";
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

      observations: source.observations,

      evidence: [
        {
          id: "EAST_SOURCE_REQUEST_HASH",
          kind: "DERIVED",
          hash: hash(request || {})
        },
        {
          id: "EAST_SOURCE_DECLARED_FILE_MANIFEST_HASH",
          kind: "DERIVED",
          hash: hash(source.declaredFiles)
        },
        {
          id: "EAST_SOURCE_DECLARED_DEPENDENCY_HASH",
          kind: "DERIVED",
          hash: hash(source.dependencies)
        },
        {
          id: "EAST_SOURCE_VALIDATION",
          kind: "DERIVED",
          passed: validation.passed,
          issueCount: validation.issues.length
        }
      ],

      issues: source.issues,

      firstHeldCoordinate:
        status === "HOLD" ? "F3:EAST_PROBE_SOURCE" : null,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,

      recommendedOwner: {
        ownerType: "DECLARED_SOURCE",
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
        component: "EAST_SOURCE_DECLARATION"
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
        "Position 2 East source probe for source-side declarations, construction inputs, file identities, contract identities, model declarations, declared dependencies, and source provenance.",
      quietLoad: true,
      threeDimensionalNative: true,
      liveRuntimeInspection: false,
      declarationProvesObservation: false,
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

    var existing = root.AUDRALIA_DIAGNOSTIC_PROBE_EAST;

    if (existing && existing.CONTRACT !== CONTRACT) {
      root.AUDRALIA_DIAGNOSTIC_PROBE_EAST_INSTALLATION_CONFLICT =
        deepFreeze({
          contract: CONTRACT,
          file: FILE,
          status: "CONFLICT",
          reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
          generatedAt: nowIso()
        });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_EAST = api;

    var namespace = ensureNamespace("AUDRALIA");
    if (namespace) {
      namespace.diagnosticProbeEast = api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_EAST_RECEIPT = getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_PROBE_EAST_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_EAST_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_EAST_VERSION__ = VERSION;

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
