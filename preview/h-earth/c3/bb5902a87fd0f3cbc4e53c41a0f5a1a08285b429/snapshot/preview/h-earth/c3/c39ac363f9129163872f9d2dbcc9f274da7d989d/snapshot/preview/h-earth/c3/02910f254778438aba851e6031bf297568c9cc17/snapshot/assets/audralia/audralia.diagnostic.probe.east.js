// /assets/audralia/audralia.diagnostic.probe.east.js
// AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v3
// Full-file replacement.
// Diagnostic-only.
// Read-only.
// Conductor-compatible Station 2 API.

(function registerAudraliaDiagnosticProbeEast(global) {
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

  var CONTRACT =
    "AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v3";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v2";

  var VERSION =
    "3.0.0";

  var FILE =
    "/assets/audralia/audralia.diagnostic.probe.east.js";

  var STATION_ID =
    "EAST_PROBE_SOURCE";

  var CYCLE_POSITION =
    2;

  var FIBONACCI =
    "F3";

  var NEWS =
    "EAST";

  var API_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_API_v1";

  var REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var DEFINITION_RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_DEFINITION_RECEIPT_v1";

  var NO_CLAIMS =
    Object.freeze({
      engineAuthority: false,
      productionMutationAuthority: false,
      contractRewriteAuthority: false,
      routeMutationAuthority: false,
      rendererAuthority: false,
      canvasAuthority: false,
      runtimeAuthority: false,
      webGLAuthority: false,
      webGPUAuthority: false,
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
      f13Claimed: false,
      f21Claimed: false,
      webGL: false,
      webGPU: false,
      directionOnly: true
    });

  var ADMITTED_PATH_CLASSES =
    Object.freeze([
      "AUDRALIA_ROUTE",
      "AUDRALIA_DIAGNOSTIC_ROUTE",
      "AUDRALIA_ASSET",
      "DGB_ENGINE_ASSET",
      "ENGINE_ASSET"
    ]);

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    var proto =
      Object.getPrototypeOf(value);

    return proto === Object.prototype || proto === null;
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function clone(value, seen, depth) {
    var memory =
      seen || [];

    var level =
      Number(depth) || 0;

    if (level > 13) {
      return null;
    }

    if (
      value === null ||
      typeof value === "boolean" ||
      typeof value === "string" ||
      isFiniteNumber(value)
    ) {
      return value;
    }

    if (!value || typeof value !== "object") {
      return null;
    }

    if (
      !Array.isArray(value) &&
      !isPlainObject(value)
    ) {
      return null;
    }

    if (memory.indexOf(value) !== -1) {
      return null;
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, 377).map(function mapEntry(entry) {
        return clone(entry, memory.slice(), level + 1);
      });
    }

    var output = {};

    Object.keys(value).slice(0, 233).forEach(function copyKey(key) {
      try {
        output[String(key).slice(0, 12000)] =
          clone(value[key], memory.slice(), level + 1);
      } catch (_error) {
        output[String(key)] = null;
      }
    });

    return output;
  }

  function deepFreeze(value, seen) {
    var memory =
      seen || [];

    if (!value || typeof value !== "object") {
      return value;
    }

    if (memory.indexOf(value) !== -1) {
      return value;
    }

    memory.push(value);

    try {
      Object.keys(value).forEach(function freezeKey(key) {
        deepFreeze(value[key], memory);
      });

      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function stableStringify(value) {
    if (value === null) {
      return "null";
    }

    if (typeof value === "string") {
      return JSON.stringify(value);
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    if (isFiniteNumber(value)) {
      return String(value);
    }

    if (Array.isArray(value)) {
      return "[" + value.map(stableStringify).join(",") + "]";
    }

    if (isPlainObject(value)) {
      return (
        "{" +
        Object.keys(value)
          .sort()
          .map(function encodeKey(key) {
            return JSON.stringify(key) + ":" + stableStringify(value[key]);
          })
          .join(",") +
        "}"
      );
    }

    return "null";
  }

  function hash(value) {
    var text =
      stableStringify(clone(value, [], 0));

    var h =
      0x811c9dc5;

    var index;

    for (index = 0; index < text.length; index += 1) {
      h ^= text.charCodeAt(index);
      h +=
        (h << 1) +
        (h << 4) +
        (h << 7) +
        (h << 8) +
        (h << 24);
      h >>>= 0;
    }

    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function hashReceipt(receipt) {
    var copy =
      clone(receipt, [], 0);

    if (copy && typeof copy === "object") {
      copy.receiptHash = null;
    }

    return hash(copy);
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE").slice(0, 512)
    };
  }

  function observation(id, kind, payload) {
    var output = {
      id: String(id),
      kind: String(kind || "OBSERVED")
    };

    var record =
      isPlainObject(payload)
        ? payload
        : {};

    Object.keys(record).forEach(function copyPayload(key) {
      output[key] = clone(record[key], [], 0);
    });

    return output;
  }

  function firstString() {
    var index;

    for (index = 0; index < arguments.length; index += 1) {
      if (
        typeof arguments[index] === "string" &&
        arguments[index].trim()
      ) {
        return arguments[index].trim();
      }
    }

    return null;
  }

  function normalizePathClass(file) {
    if (!file || typeof file !== "string") {
      return "UNKNOWN";
    }

    if (
      file === "/showroom/globe/audralia/diagnostic/" ||
      file.indexOf("/showroom/globe/audralia/diagnostic/") === 0
    ) {
      return "AUDRALIA_DIAGNOSTIC_ROUTE";
    }

    if (
      file === "/showroom/globe/audralia/" ||
      file.indexOf("/showroom/globe/audralia/") === 0
    ) {
      return "AUDRALIA_ROUTE";
    }

    if (file.indexOf("/assets/audralia/") === 0) {
      return "AUDRALIA_ASSET";
    }

    if (file.indexOf("/assets/engine/") === 0) {
      return "DGB_ENGINE_ASSET";
    }

    if (file.indexOf("/assets/") === 0) {
      return "ENGINE_ASSET";
    }

    return "UNKNOWN";
  }

  function pathClassAdmitted(pathClass) {
    return ADMITTED_PATH_CLASSES.indexOf(pathClass) !== -1;
  }

  function readRequest(packet) {
    var source =
      isPlainObject(packet)
        ? packet
        : {};

    var subject =
      isPlainObject(source.subject)
        ? source.subject
        : {};

    var engine =
      isPlainObject(source.engine)
        ? source.engine
        : {};

    var construct =
      isPlainObject(source.construct)
        ? source.construct
        : {};

    var target =
      isPlainObject(source.target)
        ? source.target
        : isPlainObject(construct.target)
          ? construct.target
          : {};

    var engineFamily =
      isPlainObject(source.engineFamily)
        ? source.engineFamily
        : {};

    var route =
      isPlainObject(source.route)
        ? source.route
        : {};

    return {
      cycleId: firstString(source.cycleId),
      mode: firstString(source.mode, "AUDIT"),
      subject: clone(subject),
      engine: clone(engine),
      construct: clone(construct),
      target: clone(target),
      route: clone(route),
      engineFamily: clone(engineFamily),
      priorStationReceipts:
        Array.isArray(source.priorStationReceipts)
          ? clone(source.priorStationReceipts)
          : [],
      canonicalCycleRequest:
        isPlainObject(source.canonicalCycleRequest)
          ? clone(source.canonicalCycleRequest)
          : null,
      priorLedgerHash: firstString(source.priorLedgerHash)
    };
  }

  function extractEngineFile(request) {
    var engine =
      request.engine || {};

    var family =
      request.engineFamily || {};

    return firstString(
      engine.file,
      engine.governingContractFile,
      engine.runtimeReceipt && engine.runtimeReceipt.file,
      family.selectedEngine && family.selectedEngine.file,
      family.selectedEngine &&
        family.selectedEngine.runtimeReceipt &&
        family.selectedEngine.runtimeReceipt.file,
      family.authority && family.authority.file,
      family.receipt && family.receipt.file,
      "/assets/engine/dgb.engine.js"
    );
  }

  function extractEngineContract(request) {
    var engine =
      request.engine || {};

    var family =
      request.engineFamily || {};

    return firstString(
      engine.contract,
      engine.governingContract,
      engine.runtimeReceipt && engine.runtimeReceipt.contract,
      family.selectedEngine && family.selectedEngine.contract,
      family.selectedEngine &&
        family.selectedEngine.runtimeReceipt &&
        family.selectedEngine.runtimeReceipt.contract,
      family.authority && family.authority.contract,
      family.receipt && family.receipt.contract
    );
  }

  function createReceipt(status, completed, handoffEligible, summary, request, observations, evidence, issues, owner) {
    var receipt = {
      schema: RECEIPT_SCHEMA,
      cycleId: request.cycleId,
      position: CYCLE_POSITION,
      cyclePosition: CYCLE_POSITION,
      stationId: STATION_ID,
      role: STATION_ID,
      news: NEWS,
      fibonacci: FIBONACCI,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status: status,
      completed: completed === true,
      handoffEligible: handoffEligible === true,
      summary: summary,
      observations: observations || [],
      evidence: evidence || [],
      issues: issues || [],
      firstHeldCoordinate: status === "HOLD" ? "F3:EAST_PROBE_SOURCE" : null,
      firstFailedCoordinate: status === "FAIL" ? "F3:EAST_PROBE_SOURCE" : null,
      firstConflictCoordinate: status === "CONFLICT" ? "F3:EAST_PROBE_SOURCE" : null,
      recommendedOwner: owner || {
        ownerType: "DECLARED_SOURCE",
        subjectId: STATION_ID,
        contract: CONTRACT,
        file: FILE,
        component: "EAST_SOURCE_DECLARATION"
      },
      generatedAt: nowIso(),
      noClaims: clone(NO_CLAIMS),
      receiptHash: null
    };

    receipt.receiptHash =
      hashReceipt(receipt);

    return deepFreeze(receipt);
  }

  function executeCycleStation(packet) {
    var request =
      readRequest(packet);

    var subject =
      request.subject || {};

    var construct =
      request.construct || {};

    var target =
      request.target || {};

    var route =
      request.route || {};

    var engineFile =
      extractEngineFile(request);

    var engineContract =
      extractEngineContract(request);

    var subjectFile =
      firstString(
        subject.file,
        subject.rootFile,
        construct.subjectFile
      );

    var constructRootFile =
      firstString(
        construct.rootFile,
        construct.file,
        "/showroom/globe/audralia/diagnostic/index.html"
      );

    var constructRoute =
      firstString(
        construct.route,
        route.route,
        route.targetRoute,
        target.targetRoute,
        "/showroom/globe/audralia/diagnostic/"
      );

    var files = [
      {
        id: "SUBJECT_FILE",
        file: subjectFile,
        pathClass: normalizePathClass(subjectFile),
        admitted: subjectFile ? pathClassAdmitted(normalizePathClass(subjectFile)) : null
      },
      {
        id: "ENGINE_FILE",
        file: engineFile,
        pathClass: normalizePathClass(engineFile),
        admitted: engineFile ? pathClassAdmitted(normalizePathClass(engineFile)) : null
      },
      {
        id: "CONSTRUCT_ROOT_FILE",
        file: constructRootFile,
        pathClass: normalizePathClass(constructRootFile),
        admitted: constructRootFile ? pathClassAdmitted(normalizePathClass(constructRootFile)) : null
      },
      {
        id: "CONSTRUCT_ROUTE",
        file: constructRoute,
        pathClass: normalizePathClass(constructRoute),
        admitted: constructRoute ? pathClassAdmitted(normalizePathClass(constructRoute)) : null
      }
    ];

    var dependencies =
      Array.isArray(construct.dependencies)
        ? construct.dependencies.slice(0, 64)
        : [];

    var observations = [
      observation("EAST_SOURCE_SUBJECT_DECLARATION", "DECLARED", {
        subjectId: firstString(subject.subjectId, subject.id, "AUDRALIA_DIAGNOSTIC_ROUTE"),
        subjectType: firstString(subject.subjectType, subject.type, "THREE_D_DIAGNOSTIC_ROUTE"),
        contract: firstString(subject.contract),
        version: firstString(subject.version),
        file: subjectFile,
        filePathClass: normalizePathClass(subjectFile)
      }),
      observation("EAST_SOURCE_ENGINE_DECLARATION", "DECLARED", {
        contract: engineContract,
        version: firstString(request.engine && request.engine.version),
        file: engineFile,
        filePathClass: normalizePathClass(engineFile),
        source: engineFile ? "DECLARED_OR_DEFAULT_ENGINE_FILE" : "UNAVAILABLE"
      }),
      observation("EAST_SOURCE_CONSTRUCT_DECLARATION", "DECLARED", {
        constructId: firstString(construct.constructId, construct.id, "AUDRALIA_DIAGNOSTIC_ROUTE_READER"),
        contract: firstString(construct.contract),
        version: firstString(construct.version),
        route: constructRoute,
        routePathClass: normalizePathClass(constructRoute),
        rootFile: constructRootFile,
        rootFilePathClass: normalizePathClass(constructRootFile)
      }),
      observation("EAST_SOURCE_DECLARED_FILES", "DERIVED", {
        fileCount: files.filter(function countFile(entry) {
          return Boolean(entry.file);
        }).length,
        files: files
      }),
      observation("EAST_SOURCE_DECLARED_DEPENDENCIES", "DERIVED", {
        dependencyCount: dependencies.length,
        dependencies: dependencies
      }),
      observation("EAST_SOURCE_PRIOR_NORTH_RECEIPT", "EXPOSED_RECEIPT", {
        priorReceiptCount: request.priorStationReceipts.length,
        northReceiptObserved:
          request.priorStationReceipts.some(function findNorth(receipt) {
            return receipt && receipt.stationId === "NORTH_PROBE_INTAKE";
          })
      })
    ];

    var evidence = [
      {
        id: "EAST_SOURCE_REQUEST_HASH",
        kind: "DERIVED",
        hash: hash(packet || {})
      },
      {
        id: "EAST_SOURCE_DECLARED_FILE_MANIFEST_HASH",
        kind: "DERIVED",
        hash: hash(files)
      },
      {
        id: "EAST_SOURCE_DECLARED_DEPENDENCY_HASH",
        kind: "DERIVED",
        hash: hash(dependencies)
      }
    ];

    var issues = [];

    if (!request.cycleId) {
      issues.push(
        issue("CYCLE_ID_MISSING", "$.cycleId", "Station 2 requires the conductor cycleId.")
      );
    }

    files.forEach(function validateFile(entry) {
      if (
        entry.file &&
        entry.admitted !== true
      ) {
        issues.push(
          issue(
            entry.id + "_PATH_CLASS_NOT_ADMITTED",
            "$." + entry.id,
            "Declared source path is outside the admitted Audralia or engine path classes."
          )
        );
      }
    });

    if (!constructRootFile) {
      issues.push(
        issue("CONSTRUCT_ROOT_FILE_REQUIRED", "$.construct.rootFile", "Construct root file is required for East source declaration.")
      );
    }

    if (!constructRoute) {
      issues.push(
        issue("CONSTRUCT_ROUTE_REQUIRED", "$.construct.route", "Construct route is required for East source declaration.")
      );
    }

    var owner = {
      ownerType: "DECLARED_SOURCE",
      subjectId: firstString(construct.constructId, construct.id, "AUDRALIA_DIAGNOSTIC_ROUTE_READER"),
      contract: firstString(construct.contract),
      file: constructRootFile || FILE,
      component: "EAST_SOURCE_DECLARATION"
    };

    evidence.push({
      id: "EAST_SOURCE_VALIDATION",
      kind: "DERIVED",
      passed: issues.length === 0,
      issueCount: issues.length
    });

    if (issues.length) {
      return createReceipt(
        "HOLD",
        false,
        false,
        "EAST_SOURCE_HELD_DECLARATION_INCOMPLETE",
        request,
        observations,
        evidence,
        issues,
        owner
      );
    }

    return createReceipt(
      "PASS",
      true,
      true,
      "EAST_SOURCE_DECLARATION_ADMITTED",
      request,
      observations,
      evidence,
      [],
      owner
    );
  }

  function getDefinitionReceipt() {
    return deepFreeze({
      schema: DEFINITION_RECEIPT_SCHEMA,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      position: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status: "AVAILABLE",
      conductorCompatible: true,
      exposesUppercaseIdentity: true,
      exposesExecuteCycleStation: true,
      exposesGetDefinitionReceipt: true,
      admittedPathClasses: clone(ADMITTED_PATH_CLASSES),
      generatedAt: nowIso(),
      noClaims: clone(NO_CLAIMS),
      definitionHash: hash({
        contract: CONTRACT,
        version: VERSION,
        stationId: STATION_ID,
        position: CYCLE_POSITION,
        file: FILE
      })
    });
  }

  function ensureNamespace(name) {
    if (!root || typeof root !== "object") {
      return null;
    }

    if (!root[name] || typeof root[name] !== "object") {
      root[name] = {};
    }

    return root[name];
  }

  var API =
    deepFreeze({
      schema: API_SCHEMA,

      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,
      CONTRACT: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,

      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      role: STATION_ID,

      executeCycleStation: executeCycleStation,
      execute: executeCycleStation,
      getDefinitionReceipt: getDefinitionReceipt,
      hash: hash,
      clone: function exposedClone(value) {
        return deepFreeze(clone(value));
      },

      noClaims: NO_CLAIMS
    });

  if (root && typeof root === "object") {
    root.AUDRALIA_DIAGNOSTIC_PROBE_EAST = API;
    root.AUDRALIA_DIAGNOSTIC_EAST_PROBE = API;
    root.AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE = API;
    root.AUDRALIA_DIAGNOSTIC_EAST_SOURCE = API;

    var namespace =
      ensureNamespace("AUDRALIA");

    if (namespace) {
      namespace.diagnosticProbeEast = API;

      if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
        namespace.diagnostics = {};
      }

      namespace.diagnostics.probeEast = API;
      namespace.diagnostics.eastProbe = API;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_EAST_RECEIPT =
      getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_PROBE_EAST_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_EAST_VERSION__ = VERSION;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_EAST_CONTRACT__ = CONTRACT;
  }

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
