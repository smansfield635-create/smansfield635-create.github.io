// /assets/audralia/audralia.diagnostic.probe.north.js
// AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INTAKE_F1_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free North intake station.
// Owns F1 diagnostic intake evidence only.
// Does not own runtime mutation, renderer mutation, repair, readiness, visual pass, F13, or F21.

(function installAudraliaDiagnosticProbeNorth(global) {
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
    "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INTAKE_F1_3D_TNT_v1";

  var VERSION =
    "1.0.0";

  var FILE =
    "/assets/audralia/audralia.diagnostic.probe.north.js";

  var STATION_ID =
    "NORTH_PROBE_INTAKE";

  var CYCLE_POSITION =
    1;

  var FIBONACCI =
    "F1";

  var STATION_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";

  var DEFINITION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_DEFINITION_RECEIPT_v1";

  var NO_CLAIMS = Object.freeze({
    engineAuthority: false,
    productionMutationAuthority: false,
    contractRewriteAuthority: false,
    routeMutationAuthority: false,
    rendererAuthority: false,
    canvasAuthority: false,
    webGLAuthority: false,
    webGPUAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    readyClaimed: false,
    verifiedClaimed: false,
    f13Claimed: false,
    f21Claimed: false,
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

  function isObject(value) {
    return Boolean(
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    );
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clone(value, seen) {
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
      return String(value);
    }

    if (typeof value === "function") {
      return "[Function]";
    }

    var memory =
      seen || [];

    if (memory.indexOf(value) !== -1) {
      return "[Circular]";
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function cloneArrayEntry(entry) {
        return clone(entry, memory.slice());
      });
    }

    var output = {};

    Object.keys(value).forEach(function cloneKey(key) {
      try {
        output[key] =
          clone(value[key], memory.slice());
      } catch (_error) {
        output[key] =
          "[Unreadable]";
      }
    });

    return output;
  }

  function deepFreeze(value, seen) {
    if (
      !value ||
      (
        typeof value !== "object" &&
        typeof value !== "function"
      )
    ) {
      return value;
    }

    var memory =
      seen || [];

    if (memory.indexOf(value) !== -1) {
      return value;
    }

    memory.push(value);

    Object.getOwnPropertyNames(value).forEach(function freezeKey(key) {
      try {
        deepFreeze(value[key], memory);
      } catch (_error) {}
    });

    try {
      Object.freeze(value);
    } catch (_error2) {}

    return value;
  }

  function stablePrepare(value, seen) {
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
      return String(value);
    }

    if (typeof value === "function") {
      return "[Function]";
    }

    var memory =
      seen || [];

    if (memory.indexOf(value) !== -1) {
      return "[Circular]";
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function prepareArray(entry) {
        return stablePrepare(entry, memory.slice());
      });
    }

    var output = {};

    Object.keys(value)
      .sort()
      .forEach(function prepareKey(key) {
        output[key] =
          stablePrepare(value[key], memory.slice());
      });

    return output;
  }

  function stableStringify(value) {
    try {
      return JSON.stringify(stablePrepare(value));
    } catch (_error) {
      return String(value);
    }
  }

  function hash(value) {
    var text =
      stableStringify(value);

    var result =
      0x811c9dc5;

    for (
      var index = 0;
      index < text.length;
      index += 1
    ) {
      result ^=
        text.charCodeAt(index);

      result =
        Math.imul(result, 0x01000193) >>> 0;
    }

    return (
      "fnv1a32:" +
      ("00000000" + result.toString(16)).slice(-8)
    );
  }

  function readPath(path) {
    var parts =
      String(path || "")
        .split(".")
        .filter(Boolean);

    var cursor =
      root;

    for (
      var index = 0;
      index < parts.length;
      index += 1
    ) {
      if (
        cursor === null ||
        cursor === undefined ||
        cursor[parts[index]] === null ||
        cursor[parts[index]] === undefined
      ) {
        return null;
      }

      cursor =
        cursor[parts[index]];
    }

    return cursor;
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "NORTH_PROBE_ISSUE"),
      path: String(path || STATION_ID),
      detail: String(detail || code || "North probe issue.")
    };
  }

  function getDocumentEvidence() {
    var doc =
      root && root.document
        ? root.document
        : null;

    if (!doc) {
      return {
        available: false,
        reason: "DOCUMENT_UNAVAILABLE"
      };
    }

    var html =
      doc.documentElement || null;

    return {
      available: true,
      readyState: doc.readyState || null,
      locationHref:
        root.location && root.location.href
          ? root.location.href
          : null,
      route:
        html && html.getAttribute
          ? html.getAttribute("data-route")
          : null,
      page:
        html && html.getAttribute
          ? html.getAttribute("data-page")
          : null,
      contract:
        html && html.getAttribute
          ? html.getAttribute("data-contract")
          : null,
      targetRoute:
        html && html.getAttribute
          ? html.getAttribute("data-target-route")
          : null,
      diagnosticRoute:
        html && html.getAttribute
          ? html.getAttribute("data-diagnostic-route")
          : null,
      readerFirst:
        html && html.getAttribute
          ? html.getAttribute("data-reader-first")
          : null,
      threeDimensionalNative:
        html && html.getAttribute
          ? html.getAttribute("data-three-dimensional-native")
          : null
    };
  }

  function getRouteControllerEvidence() {
    var controller =
      root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER ||
      readPath("AUDRALIA.diagnosticRouteController") ||
      null;

    return {
      available: Boolean(controller),
      contract:
        controller && controller.CONTRACT
          ? controller.CONTRACT
          : null,
      version:
        controller && controller.VERSION
          ? controller.VERSION
          : null,
      file:
        controller && controller.FILE
          ? controller.FILE
          : null,
      hasRunDiagnostic:
        Boolean(controller && isFunction(controller.runDiagnostic)),
      hasGetState:
        Boolean(controller && isFunction(controller.getState)),
      hasGetLedger:
        Boolean(controller && isFunction(controller.getLedger))
    };
  }

  function getEngineFamilyEvidence() {
    var registry =
      root.DGB_ENGINE_SUBJECT_REGISTRY ||
      root.DGBEngineSubjectRegistry ||
      null;

    var engine =
      root.DGB_ENGINE ||
      root.DGBEngine ||
      null;

    var authority =
      root.DGB_ENGINE_CONTRACT ||
      root.DGBEngineContract ||
      null;

    return {
      governingContractLoaded:
        Boolean(authority),
      governingContract:
        authority && authority.CONTRACT
          ? authority.CONTRACT
          : null,
      runtimeEngineLoaded:
        Boolean(engine),
      runtimeEngineContract:
        engine && engine.CONTRACT
          ? engine.CONTRACT
          : null,
      registryLoaded:
        Boolean(registry),
      registryContract:
        registry && registry.CONTRACT
          ? registry.CONTRACT
          : null
    };
  }

  function validateRequest(request) {
    var issues = [];

    if (!isObject(request)) {
      issues.push(
        issue(
          "REQUEST_OBJECT_REQUIRED",
          "$",
          "North probe requires a plain station execution request."
        )
      );

      return issues;
    }

    if (
      request.schema &&
      request.schema !== REQUEST_SCHEMA
    ) {
      issues.push(
        issue(
          "REQUEST_SCHEMA_UNEXPECTED",
          "$.schema",
          "Request schema differed from the expected station execution request schema."
        )
      );
    }

    if (
      Number(request.position) !== CYCLE_POSITION
    ) {
      issues.push(
        issue(
          "REQUEST_POSITION_MISMATCH",
          "$.position",
          "North probe can only execute at cycle position 1."
        )
      );
    }

    if (
      request.stationId &&
      request.stationId !== STATION_ID
    ) {
      issues.push(
        issue(
          "REQUEST_STATION_ID_MISMATCH",
          "$.stationId",
          "Request stationId did not match NORTH_PROBE_INTAKE."
        )
      );
    }

    if (!isObject(request.subject)) {
      issues.push(
        issue(
          "REQUEST_SUBJECT_MISSING",
          "$.subject",
          "Subject evidence is required for North intake."
        )
      );
    }

    if (!isObject(request.construct)) {
      issues.push(
        issue(
          "REQUEST_CONSTRUCT_MISSING",
          "$.construct",
          "Construct evidence is required for North intake."
        )
      );
    }

    return issues;
  }

  function executeCycleStation(request) {
    var validationIssues =
      validateRequest(request);

    var documentEvidence =
      getDocumentEvidence();

    var controllerEvidence =
      getRouteControllerEvidence();

    var engineFamilyEvidence =
      getEngineFamilyEvidence();

    var observations = [
      {
        id: "NORTH_INTAKE_REQUEST_OBSERVED",
        kind: "OBSERVED",
        cycleId:
          request && request.cycleId
            ? request.cycleId
            : null,
        mode:
          request && request.mode
            ? request.mode
            : null,
        position:
          request && request.position !== undefined
            ? request.position
            : null,
        stationId:
          request && request.stationId
            ? request.stationId
            : null
      },
      {
        id: "NORTH_INTAKE_DOCUMENT_OBSERVED",
        kind: "OBSERVED",
        document: clone(documentEvidence)
      },
      {
        id: "NORTH_INTAKE_ROUTE_CONTROLLER_OBSERVED",
        kind: "OBSERVED",
        routeController: clone(controllerEvidence)
      },
      {
        id: "NORTH_INTAKE_ENGINE_FAMILY_OBSERVED",
        kind: "OBSERVED",
        engineFamily: clone(engineFamilyEvidence)
      }
    ];

    var evidence = [
      {
        id: "NORTH_REQUEST_HASH",
        kind: "DERIVED",
        hash: hash(request || {})
      },
      {
        id: "NORTH_DOCUMENT_EVIDENCE_HASH",
        kind: "DERIVED",
        hash: hash(documentEvidence)
      },
      {
        id: "NORTH_CONTROLLER_EVIDENCE_HASH",
        kind: "DERIVED",
        hash: hash(controllerEvidence)
      },
      {
        id: "NORTH_ENGINE_FAMILY_EVIDENCE_HASH",
        kind: "DERIVED",
        hash: hash(engineFamilyEvidence)
      }
    ];

    var status =
      validationIssues.length
        ? "HOLD"
        : "PASS";

    var summary =
      validationIssues.length
        ? "North intake is held because required request identity evidence is incomplete."
        : "North intake identified the diagnostic subject, construct, route shell, controller, and engine-family presence.";

    var receipt = {
      schema:
        STATION_SCHEMA,

      cycleId:
        request && request.cycleId
          ? request.cycleId
          : "AUDRALIA_DIAGNOSTIC_CYCLE_UNKNOWN",

      position:
        CYCLE_POSITION,

      stationId:
        STATION_ID,

      fibonacci:
        FIBONACCI,

      contract:
        CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      status:
        status,

      completed:
        status === "PASS",

      handoffEligible:
        status === "PASS",

      summary:
        summary,

      observations:
        observations,

      evidence:
        evidence,

      issues:
        validationIssues,

      firstHeldCoordinate:
        status === "HOLD"
          ? STATION_ID
          : null,

      firstFailedCoordinate:
        null,

      firstConflictCoordinate:
        null,

      recommendedOwner:
        status === "HOLD"
          ? {
              ownerType: "DIAGNOSTIC_ROUTE",
              subjectId: STATION_ID,
              contract:
                controllerEvidence.contract || null,
              file:
                controllerEvidence.file || FILE,
              component:
                STATION_ID
            }
          : null,

      generatedAt:
        nowIso(),

      noClaims:
        clone(NO_CLAIMS),

      receiptHash:
        null
    };

    receipt.receiptHash =
      hash(receipt);

    return deepFreeze(receipt);
  }

  function getDefinitionValidation() {
    var checks = [
      {
        id: "north-probe:station-id",
        passed: STATION_ID === "NORTH_PROBE_INTAKE",
        expected: "NORTH_PROBE_INTAKE",
        actual: STATION_ID
      },
      {
        id: "north-probe:position",
        passed: CYCLE_POSITION === 1,
        expected: 1,
        actual: CYCLE_POSITION
      },
      {
        id: "north-probe:file",
        passed: FILE === "/assets/audralia/audralia.diagnostic.probe.north.js",
        expected: "/assets/audralia/audralia.diagnostic.probe.north.js",
        actual: FILE
      },
      {
        id: "north-probe:execute-method",
        passed: isFunction(executeCycleStation),
        expected: true,
        actual: isFunction(executeCycleStation)
      }
    ];

    return deepFreeze({
      schema:
        "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_DEFINITION_VALIDATION_v1",
      passed:
        checks.every(function checkPassed(check) {
          return check.passed === true;
        }),
      checkCount:
        checks.length,
      passCount:
        checks.filter(function countPass(check) {
          return check.passed === true;
        }).length,
      failCount:
        checks.filter(function countFail(check) {
          return check.passed !== true;
        }).length,
      checks:
        checks,
      generatedAt:
        nowIso()
    });
  }

  function getDefinitionReceipt() {
    var validation =
      getDefinitionValidation();

    var receipt = {
      receipt:
        DEFINITION_RECEIPT,

      schema:
        "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_DEFINITION_RECEIPT_v1",

      contract:
        CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      stationId:
        STATION_ID,

      cyclePosition:
        CYCLE_POSITION,

      fibonacci:
        FIBONACCI,

      validationPassed:
        validation.passed,

      validation:
        validation,

      ownsNorthIntake:
        true,

      ownsDiagnosticSequence:
        false,

      ownsRuntimeMutation:
        false,

      ownsRendererMutation:
        false,

      ownsRepairAuthorization:
        false,

      ownsReadiness:
        false,

      generatedAt:
        nowIso(),

      noClaims:
        clone(NO_CLAIMS),

      definitionHash:
        null
    };

    receipt.definitionHash =
      hash(receipt);

    return deepFreeze(receipt);
  }

  var API =
    deepFreeze({
      CONTRACT:
        CONTRACT,

      VERSION:
        VERSION,

      FILE:
        FILE,

      STATION_ID:
        STATION_ID,

      CYCLE_POSITION:
        CYCLE_POSITION,

      FIBONACCI:
        FIBONACCI,

      getDefinitionReceipt:
        getDefinitionReceipt,

      getDefinitionValidation:
        getDefinitionValidation,

      executeCycleStation:
        executeCycleStation,

      getStatus:
        function getStatus() {
          return deepFreeze({
            contract: CONTRACT,
            version: VERSION,
            file: FILE,
            stationId: STATION_ID,
            cyclePosition: CYCLE_POSITION,
            loaded: true,
            ready: true,
            generatedAt: nowIso(),
            noClaims: clone(NO_CLAIMS)
          });
        }
    });

  root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH =
    API;

  if (
    !root.AUDRALIA ||
    typeof root.AUDRALIA !== "object"
  ) {
    root.AUDRALIA = {};
  }

  if (
    !root.AUDRALIA.diagnostics ||
    typeof root.AUDRALIA.diagnostics !== "object"
  ) {
    root.AUDRALIA.diagnostics = {};
  }

  root.AUDRALIA.diagnostics.probeNorth =
    API;

  root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_LOADED__ =
    true;

  root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_CONTRACT__ =
    CONTRACT;

  root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_VERSION__ =
    VERSION;

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
