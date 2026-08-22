// /assets/audralia/audralia.diagnostic.east.js
// AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v3
// Full-file replacement.
// Diagnostic-only. Read-only. Conductor-compatible Station 3 API.
// No production mutation. No renderer authority. No runtime restart authority.
// No repair authority. No readiness authority. No visual pass authority. No F21 authority.

(function registerAudraliaDiagnosticEast(global) {
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
    "AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v3";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v2";

  var LEGACY_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v1";

  var VERSION = "3.0.0";

  var VERSION_LABEL =
    "2026-06-22.audralia-diagnostic-east-construction-interpretation-f5-3d-v3";

  var FILE =
    "/assets/audralia/audralia.diagnostic.east.js";

  var STATION_ID =
    "EAST_CONSTRUCTION_INTERPRETATION";

  var CYCLE_POSITION = 3;

  var FIBONACCI = "F5";

  var NEWS = "EAST";

  var REQUIRED_PREDECESSOR =
    "EAST_PROBE_SOURCE";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var API_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_API_v1";

  var REGISTRATION_RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_REGISTRATION_RECEIPT_v1";

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
    runtimeAuthority: false,
    webGLAuthority: false,
    webGPUAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    constructionInterpretationProvesRuntime: false,
    sourceDeclarationProvesRuntime: false,
    diagnosticPassProvesReadiness: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    f13Claimed: false,
    f21Claimed: false,
    f89Claimed: false,
    webGL: false,
    webGPU: false,
    directionOnly: true,
    provenCulprit: false,
    recommendedOwnerProvesDefect: false
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    var proto = Object.getPrototypeOf(value);

    return proto === Object.prototype || proto === null;
  }

  function clonePlain(value, seen, depth) {
    var level = depth || 0;

    if (level > LIMITS.maxDepth) {
      return null;
    }

    if (
      value === null ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "string") {
      return value.slice(0, LIMITS.maxStringLength);
    }

    if (isFiniteNumber(value)) {
      return value;
    }

    if (
      value === undefined ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint" ||
      typeof value === "number"
    ) {
      return null;
    }

    if (!value || typeof value !== "object") {
      return null;
    }

    if (!Array.isArray(value) && !isPlainObject(value)) {
      return null;
    }

    var memory = seen || [];

    if (memory.indexOf(value) !== -1) {
      return null;
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value
        .slice(0, LIMITS.maxArrayLength)
        .map(function mapArray(entry) {
          return clonePlain(entry, memory.slice(), level + 1);
        });
    }

    var output = {};

    Object.keys(value)
      .slice(0, LIMITS.maxObjectKeys)
      .forEach(function copyKey(key) {
        output[String(key).slice(0, LIMITS.maxStringLength)] =
          clonePlain(value[key], memory.slice(), level + 1);
      });

    return output;
  }

  function clone(value) {
    return clonePlain(value, [], 0);
  }

  function deepFreeze(value, seen) {
    if (!value || typeof value !== "object") {
      return value;
    }

    var memory = seen || [];

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
    var text = stableStringify(clone(value));
    var h = 0x811c9dc5;

    for (var index = 0; index < text.length; index += 1) {
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

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE").slice(0, 512)
    };
  }

  function observation(id, kind, payload) {
    var output = {
      id: String(id || "OBSERVATION"),
      kind: String(kind || "OBSERVED")
    };

    if (isPlainObject(payload)) {
      Object.keys(payload).forEach(function copy(key) {
        output[key] = clone(payload[key]);
      });
    }

    return output;
  }

  function firstString() {
    for (var index = 0; index < arguments.length; index += 1) {
      if (
        typeof arguments[index] === "string" &&
        arguments[index].length
      ) {
        return arguments[index];
      }
    }

    return null;
  }

  function normalizeStatus(value) {
    return typeof value === "string" && value.length
      ? value.toUpperCase()
      : "UNKNOWN";
  }

  function collectPriorReceipts(packet) {
    var source = isPlainObject(packet) ? packet : {};
    var candidates = [
      source.priorStationReceipts,
      source.stationReceipts,
      source.receipts,
      source.conductorReceipt && source.conductorReceipt.stationReceipts,
      source.conductorReceipt && source.conductorReceipt.receipts,
      source.cycleReceipt && source.cycleReceipt.stationReceipts,
      source.cycleReceipt && source.cycleReceipt.receipts,
      source.ledger && source.ledger.stationReceipts,
      source.ledger && source.ledger.receipts
    ];

    for (var index = 0; index < candidates.length; index += 1) {
      if (Array.isArray(candidates[index])) {
        return candidates[index];
      }
    }

    return [];
  }

  function findReceipt(receipts, stationId) {
    for (var index = receipts.length - 1; index >= 0; index -= 1) {
      if (
        isPlainObject(receipts[index]) &&
        receipts[index].stationId === stationId
      ) {
        return receipts[index];
      }
    }

    return null;
  }

  function getPacketEngine(packet) {
    return (
      (isPlainObject(packet.engine) && packet.engine) ||
      (
        isPlainObject(packet.construct) &&
        isPlainObject(packet.construct.engine) &&
        packet.construct.engine
      ) ||
      (
        isPlainObject(packet.engineRegistry) &&
        isPlainObject(packet.engineRegistry.selectedEngine) &&
        packet.engineRegistry.selectedEngine
      ) ||
      {}
    );
  }

  function getPacketConstruct(packet) {
    return isPlainObject(packet.construct) ? packet.construct : {};
  }

  function getPacketSubject(packet) {
    return (
      (isPlainObject(packet.subject) && packet.subject) ||
      (
        isPlainObject(packet.construct) &&
        isPlainObject(packet.construct.subject) &&
        packet.construct.subject
      ) ||
      {}
    );
  }

  function getPacketTarget(packet) {
    return (
      (isPlainObject(packet.target) && packet.target) ||
      (
        isPlainObject(packet.construct) &&
        isPlainObject(packet.construct.target) &&
        packet.construct.target
      ) ||
      {}
    );
  }

  function extractEastEvidence(eastReceipt) {
    var observations =
      isPlainObject(eastReceipt) && Array.isArray(eastReceipt.observations)
        ? eastReceipt.observations
        : [];

    function findObservation(id) {
      for (var index = 0; index < observations.length; index += 1) {
        if (observations[index] && observations[index].id === id) {
          return observations[index];
        }
      }

      return null;
    }

    return {
      sourceDeclaration:
        findObservation("EAST_SOURCE_SUBJECT_DECLARATION"),

      engineDeclaration:
        findObservation("EAST_SOURCE_ENGINE_DECLARATION"),

      constructDeclaration:
        findObservation("EAST_SOURCE_CONSTRUCT_DECLARATION"),

      fileManifest:
        findObservation("EAST_SOURCE_DECLARED_FILES"),

      dependencyManifest:
        findObservation("EAST_SOURCE_DECLARED_DEPENDENCIES")
    };
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (issues.length >= LIMITS.maxIssues) {
        return;
      }

      if (depth > LIMITS.maxDepth) {
        issues.push(issue("PLAIN_DATA_DEPTH_EXCEEDED", path));
        return;
      }

      if (
        item === null ||
        typeof item === "string" ||
        typeof item === "boolean" ||
        isFiniteNumber(item)
      ) {
        return;
      }

      if (
        item === undefined ||
        typeof item === "function" ||
        typeof item === "symbol" ||
        typeof item === "bigint" ||
        typeof item === "number"
      ) {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
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
          walk(entry, path + "[" + index + "]", depth + 1, seen.slice());
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

        walk(item[key], path + "." + key, depth + 1, seen.slice());
      });
    }

    walk(value, "$", 0, []);

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function createReceipt(
    status,
    completed,
    handoffEligible,
    summary,
    packet,
    observations,
    evidence,
    issues,
    owner
  ) {
    var receipt = {
      schema: RECEIPT_SCHEMA,
      cycleId: packet && packet.cycleId ? packet.cycleId : null,
      position: CYCLE_POSITION,
      cyclePosition: CYCLE_POSITION,
      stationId: STATION_ID,
      role: STATION_ID,
      news: NEWS,
      fibonacci: FIBONACCI,

      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,

      status: status,
      completed: completed === true,
      handoffEligible: handoffEligible === true,
      summary: summary,

      observations: observations || [],
      evidence: evidence || [],
      issues: issues || [],

      firstHeldCoordinate:
        status === "HOLD"
          ? "F5:EAST_CONSTRUCTION_INTERPRETATION"
          : null,

      firstFailedCoordinate:
        status === "FAIL"
          ? "F5:EAST_CONSTRUCTION_INTERPRETATION"
          : null,

      firstConflictCoordinate:
        status === "CONFLICT"
          ? "F5:EAST_CONSTRUCTION_INTERPRETATION"
          : null,

      recommendedOwner:
        owner ||
        {
          ownerType: "DIAGNOSTIC_STATION",
          subjectId: STATION_ID,
          contract: CONTRACT,
          file: FILE,
          component: STATION_ID
        },

      generatedAt: nowIso(),
      noClaims: clone(NO_CLAIMS),
      receiptHash: null
    };

    receipt.receiptHash = hash(receipt);

    return deepFreeze(receipt);
  }

  function executeCycleStation(packet) {
    var source = isPlainObject(packet) ? packet : {};

    var priorReceipts = collectPriorReceipts(source);
    var eastReceipt = findReceipt(priorReceipts, REQUIRED_PREDECESSOR);

    var subject = getPacketSubject(source);
    var engine = getPacketEngine(source);
    var construct = getPacketConstruct(source);
    var target = getPacketTarget(source);

    var eastEvidence = extractEastEvidence(eastReceipt);

    var predecessorStatus = normalizeStatus(eastReceipt && eastReceipt.status);
    var predecessorPassed = predecessorStatus === "PASS";

    var sourceFile = firstString(
      eastEvidence.sourceDeclaration && eastEvidence.sourceDeclaration.file,
      subject.file,
      subject.rootFile,
      null
    );

    var engineFile = firstString(
      eastEvidence.engineDeclaration && eastEvidence.engineDeclaration.file,
      engine.file,
      engine.governingContractFile,
      null
    );

    var constructRootFile = firstString(
      eastEvidence.constructDeclaration && eastEvidence.constructDeclaration.rootFile,
      construct.rootFile,
      construct.file,
      "/showroom/globe/audralia/diagnostic/index.html"
    );

    var constructRoute = firstString(
      eastEvidence.constructDeclaration && eastEvidence.constructDeclaration.route,
      construct.route,
      source.diagnosticRoute,
      "/showroom/globe/audralia/diagnostic/"
    );

    var targetRoute = firstString(
      construct.targetRoute,
      source.targetRoute,
      target.targetRoute,
      "/showroom/globe/audralia/"
    );

    var observations = [
      observation(
        "EAST_INTERPRETATION_PREDECESSOR_RECEIPT",
        "OBSERVED",
        {
          requiredStationId: REQUIRED_PREDECESSOR,
          observed: Boolean(eastReceipt),
          status: predecessorStatus,
          completed: eastReceipt ? eastReceipt.completed === true : false,
          handoffEligible: eastReceipt ? eastReceipt.handoffEligible === true : false,
          receiptHash: eastReceipt ? eastReceipt.receiptHash || null : null
        }
      ),

      observation(
        "EAST_INTERPRETATION_SOURCE_EVIDENCE",
        "DERIVED",
        {
          sourceDeclarationObserved: Boolean(eastEvidence.sourceDeclaration),
          engineDeclarationObserved: Boolean(eastEvidence.engineDeclaration),
          constructDeclarationObserved: Boolean(eastEvidence.constructDeclaration),
          fileManifestObserved: Boolean(eastEvidence.fileManifest),
          dependencyManifestObserved: Boolean(eastEvidence.dependencyManifest),
          sourceFile: sourceFile,
          engineFile: engineFile,
          constructRootFile: constructRootFile,
          constructRoute: constructRoute,
          targetRoute: targetRoute
        }
      ),

      observation(
        "EAST_INTERPRETATION_PACKET_CONSTRUCT",
        "DECLARED",
        {
          constructId:
            firstString(
              construct.constructId,
              construct.id,
              "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D"
            ),

          contract:
            firstString(
              construct.contract,
              source.htmlContract,
              null
            ),

          controllerContract:
            firstString(
              construct.controllerContract,
              source.contract,
              null
            ),

          rootFile: constructRootFile,
          route: constructRoute,
          targetRoute: targetRoute
        }
      ),

      observation(
        "EAST_INTERPRETATION_CONSTRUCTION_ADMISSIBILITY",
        "DERIVED",
        {
          predecessorPassed: predecessorPassed,
          sourceDeclarationAvailable: Boolean(eastEvidence.sourceDeclaration),
          engineDeclarationAvailable: Boolean(eastEvidence.engineDeclaration),
          constructDeclarationAvailable: Boolean(eastEvidence.constructDeclaration),
          constructionInterpretedOnly: true,
          runtimeReadinessClaimed: false,
          visualPassClaimed: false,
          f21Claimed: false
        }
      ),

      observation(
        "EAST_INTERPRETATION_BOUNDARY",
        "DECLARED",
        {
          diagnosticOnly: true,
          readOnly: true,
          productionMutationAuthorized: false,
          runtimeRestartAuthorized: false,
          rendererMutationAuthorized: false,
          repairAuthorized: false,
          readinessClaimed: false,
          visualPassClaimed: false,
          f21Claimed: false
        }
      )
    ];

    var evidence = [
      {
        id: "EAST_INTERPRETATION_REQUEST_HASH",
        kind: "DERIVED",
        hash: hash(source)
      },
      {
        id: "EAST_INTERPRETATION_PREDECESSOR_HASH",
        kind: "DERIVED",
        hash: hash(eastReceipt || null)
      },
      {
        id: "EAST_INTERPRETATION_CONSTRUCTION_HASH",
        kind: "DERIVED",
        hash: hash({
          subject: subject,
          engine: engine,
          construct: construct,
          target: target,
          eastEvidence: eastEvidence
        })
      },
      {
        id: "EAST_INTERPRETATION_PLAIN_DATA_VALIDATION",
        kind: "DERIVED",
        passed: validatePlainData(source).passed,
        issueCount: validatePlainData(source).issues.length
      }
    ];

    var issues = [];

    if (!eastReceipt) {
      issues.push(
        issue(
          "EAST_SOURCE_RECEIPT_REQUIRED",
          "$.priorStationReceipts.EAST_PROBE_SOURCE",
          "East Construction Interpretation requires a prior East Source receipt."
        )
      );
    } else if (!predecessorPassed) {
      issues.push(
        issue(
          "EAST_SOURCE_RECEIPT_NOT_PASS",
          "$.priorStationReceipts.EAST_PROBE_SOURCE.status",
          "East Source must pass before East Construction Interpretation can hand off."
        )
      );
    }

    if (!eastEvidence.sourceDeclaration) {
      issues.push(
        issue(
          "EAST_SOURCE_SUBJECT_DECLARATION_REQUIRED",
          "$.priorStationReceipts.EAST_PROBE_SOURCE.observations",
          "East Source subject declaration was not available to interpret."
        )
      );
    }

    if (!eastEvidence.engineDeclaration) {
      issues.push(
        issue(
          "EAST_SOURCE_ENGINE_DECLARATION_REQUIRED",
          "$.priorStationReceipts.EAST_PROBE_SOURCE.observations",
          "East Source engine declaration was not available to interpret."
        )
      );
    }

    if (!eastEvidence.constructDeclaration) {
      issues.push(
        issue(
          "EAST_SOURCE_CONSTRUCT_DECLARATION_REQUIRED",
          "$.priorStationReceipts.EAST_PROBE_SOURCE.observations",
          "East Source construct declaration was not available to interpret."
        )
      );
    }

    evidence.push({
      id: "EAST_INTERPRETATION_VALIDATION",
      kind: "DERIVED",
      passed: issues.length === 0,
      issueCount: issues.length
    });

    var owner = {
      ownerType: "DIAGNOSTIC_STATION",
      subjectId: STATION_ID,
      contract: CONTRACT,
      file: FILE,
      component: STATION_ID
    };

    if (issues.length) {
      return createReceipt(
        "HOLD",
        false,
        false,
        "EAST_CONSTRUCTION_INTERPRETATION_HELD_PREDECESSOR_OR_SOURCE_EVIDENCE_INCOMPLETE",
        source,
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
      "EAST_CONSTRUCTION_INTERPRETATION_ADMITTED",
      source,
      observations,
      evidence,
      [],
      owner
    );
  }

  function getDefinitionReceipt() {
    return deepFreeze({
      schema: REGISTRATION_RECEIPT_SCHEMA,
      apiSchema: API_SCHEMA,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      position: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      globalPath: "AUDRALIA_DIAGNOSTIC_EAST",
      namespacePath: "AUDRALIA.diagnostics.east",
      status: "AVAILABLE",
      conductorCompatible: true,
      requiresPredecessor: REQUIRED_PREDECESSOR,
      exposesUppercaseIdentity: true,
      exposesExecuteCycleStation: true,
      exposesGetDefinitionReceipt: true,
      diagnosticOnly: true,
      readOnly: true,
      noClaims: clone(NO_CLAIMS),
      generatedAt: nowIso(),
      definitionHash: hash({
        contract: CONTRACT,
        version: VERSION,
        file: FILE,
        stationId: STATION_ID,
        cyclePosition: CYCLE_POSITION,
        requiredPredecessor: REQUIRED_PREDECESSOR
      })
    });
  }

  function getStatus() {
    return deepFreeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      file: FILE,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      requiredPredecessor: REQUIRED_PREDECESSOR,
      loaded: true,
      status: "AVAILABLE",
      conductorCompatible: true,
      noClaims: clone(NO_CLAIMS)
    });
  }

  function buildApi() {
    return deepFreeze({
      schema: API_SCHEMA,

      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,
      CONTRACT: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      LEGACY_CONTRACT: LEGACY_CONTRACT,
      VERSION: VERSION,
      VERSION_LABEL: VERSION_LABEL,
      FILE: FILE,

      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,

      role: STATION_ID,
      requiresPredecessor: REQUIRED_PREDECESSOR,

      executeCycleStation: executeCycleStation,
      execute: executeCycleStation,
      getDefinitionReceipt: getDefinitionReceipt,
      getStatus: getStatus,

      clone: function exposedClone(value) {
        return deepFreeze(clone(value));
      },
      hash: hash,
      noClaims: NO_CLAIMS
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

  var API = buildApi();

  if (root && typeof root === "object") {
    root.AUDRALIA_DIAGNOSTIC_EAST = API;
    root.AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION = API;
    root.AUDRALIA_DIAGNOSTIC_EAST_RECEIPT = getDefinitionReceipt();

    var namespace = ensureNamespace("AUDRALIA");

    if (namespace) {
      namespace.diagnosticEast = API;

      if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
        namespace.diagnostics = {};
      }

      namespace.diagnostics.east = API;
      namespace.diagnostics.eastInterpretation = API;
    }

    root.__AUDRALIA_DIAGNOSTIC_EAST_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_EAST_VERSION__ = VERSION;
    root.__AUDRALIA_DIAGNOSTIC_EAST_CONTRACT__ = CONTRACT;
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
