// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DGB_ENGINE_CONTRACT_READER_TNT_v6_0
// Full-file replacement.
// Existing diagnostic entry-point renewal.
// Reader only.
// Primary target: /assets/engine/dgb.engine.contract.js.
// Preserves legacy callable aliases and receipt methods without preserving
// Hearth canvas, Bishop, chapel, route, or two-chapel authority as governing truth.
// Does not mutate production, engine execution, rendering, controls, routes, or verdicts.

(function hearthDiagnosticProbeCanvasSurfaceTruthDgbEngineContractReader(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DGB_ENGINE_CONTRACT_READER_TNT_v6_0";

  var RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DGB_ENGINE_CONTRACT_READER_RECEIPT_v6_0";

  var PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ROUTE_SCRIPT_INCLUSION_READER_TNT_v5_2";

  var VERSION =
    "2026-06-14.dgb-engine-contract-reader-v6-0";

  var FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";

  var TARGET_FILE =
    "/assets/engine/dgb.engine.contract.js";

  var TARGET_CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  var TARGET_MODEL_SCHEMA =
    "DGB_MODEL_PACKAGE_v1";

  var TARGET_CURRENT_GATE =
    13;

  var TARGET_NEXT_GATE =
    21;

  var TARGET_API_ALIASES = [
    "DGB_ENGINE_CONTRACT",
    "DGBEngineContract"
  ];

  var REQUIRED_API_METHODS = [
    "validateModelPackage",
    "compareSpecAndOps",
    "composeReceipt",
    "createDeclaredOps",
    "createInstanceSpec",
    "getAuthorityReceipt",
    "getAuthorityValidation"
  ];

  var NO_CLAIMS = {
    productionMutationAuthorized: false,
    engineMutationAuthorized: false,
    routeMutationAuthorized: false,
    renderMutationAuthorized: false,
    inputMutationAuthorized: false,
    controlMutationAuthorized: false,
    canvasMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    webGLAuthorized: false,
    webGPUAuthorized: false,
    northVerdictAuthorized: false,
    finalVerdictAuthorized: false,
    runtimeRestartAuthorized: false,
    f13Claimed: false,
    f21Claimed: false,
    readyTextClaimed: false,
    operationalEngineReadyClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,

    PRODUCTION_MUTATION_AUTHORIZED: false,
    ENGINE_MUTATION_AUTHORIZED: false,
    ROUTE_MUTATION_AUTHORIZED: false,
    RENDER_MUTATION_AUTHORIZED: false,
    INPUT_MUTATION_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    CANVAS_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    WEBGL_AUTHORIZED: false,
    WEBGPU_AUTHORIZED: false,
    NORTH_VERDICT_AUTHORIZED: false,
    FINAL_VERDICT_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    F13_CLAIMED: false,
    F21_CLAIMED: false,
    READY_TEXT_CLAIMED: false,
    OPERATIONAL_ENGINE_READY_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false
  };

  var fileEvidenceCache = {
    attempted: false,
    pending: false,
    ok: false,
    status: "NOT_ATTEMPTED",
    statusText: "NOT_ATTEMPTED",
    contentType: "UNKNOWN",
    byteLength: 0,
    containsExpectedContract: false,
    containsExpectedFileMarker: false,
    containsExpectedModelSchema: false,
    error: "NONE",
    updatedAt: ""
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
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

  function asString(value, fallback) {
    if (fallback === undefined) {
      fallback = "";
    }

    if (
      value === undefined ||
      value === null
    ) {
      return fallback;
    }

    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function compact(value, limit) {
    return asString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(
        0,
        limit || 12000
      );
  }

  function clonePlain(value, seen) {
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
      return (
        "[function " +
        (
          value.name ||
          "anonymous"
        ) +
        "]"
      );
    }

    if (value instanceof Date) {
      try {
        return value.toISOString();
      } catch (_error) {
        return "INVALID_DATE";
      }
    }

    if (
      typeof ArrayBuffer !== "undefined" &&
      ArrayBuffer.isView &&
      ArrayBuffer.isView(value)
    ) {
      return {
        type:
          value.constructor &&
          value.constructor.name
            ? value.constructor.name
            : "TypedArray",

        length:
          typeof value.length === "number"
            ? value.length
            : 0,

        byteLength:
          typeof value.byteLength === "number"
            ? value.byteLength
            : 0
      };
    }

    var memory =
      seen ||
      [];

    if (memory.indexOf(value) !== -1) {
      return "[Circular]";
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function map(entry) {
        return clonePlain(
          entry,
          memory
        );
      });
    }

    var output = {};

    try {
      Object.keys(value).forEach(function each(key) {
        output[key] =
          clonePlain(
            value[key],
            memory
          );
      });
    } catch (_error2) {
      return "[UnreadableObject]";
    }

    return output;
  }

  function readPathFrom(scope, path) {
    var parts =
      asString(path)
        .replace(/^window\./, "")
        .split(".")
        .filter(Boolean);

    var cursor =
      scope;

    for (
      var i = 0;
      i < parts.length;
      i += 1
    ) {
      try {
        if (
          !cursor ||
          cursor[parts[i]] === undefined ||
          cursor[parts[i]] === null
        ) {
          return undefined;
        }

        cursor =
          cursor[parts[i]];
      } catch (_error) {
        return undefined;
      }
    }

    return cursor;
  }

  function setPathOn(scope, path, value) {
    var parts =
      asString(path)
        .replace(/^window\./, "")
        .split(".")
        .filter(Boolean);

    if (!parts.length) {
      return false;
    }

    var cursor =
      scope;

    for (
      var i = 0;
      i < parts.length - 1;
      i += 1
    ) {
      try {
        if (
          !cursor[parts[i]] ||
          typeof cursor[parts[i]] !== "object"
        ) {
          cursor[parts[i]] = {};
        }

        cursor =
          cursor[parts[i]];
      } catch (_error) {
        return false;
      }
    }

    try {
      cursor[
        parts[
          parts.length - 1
        ]
      ] = value;

      return true;
    } catch (_error2) {
      return false;
    }
  }

  function ensureNamespace(name) {
    try {
      if (
        !root[name] ||
        typeof root[name] !== "object"
      ) {
        root[name] = {};
      }

      return root[name];
    } catch (_error) {
      return {};
    }
  }

  function getPathname(win) {
    try {
      return (
        win.location &&
        win.location.pathname
      )
        ? win.location.pathname
        : "UNKNOWN";
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function getHref(win) {
    try {
      return (
        win.location &&
        win.location.href
      )
        ? win.location.href
        : "UNKNOWN";
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function getTitle(doc) {
    try {
      return (
        doc &&
        doc.title
      )
        ? doc.title
        : "UNKNOWN";
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function collectWindowScopes() {
    var scopes = [];
    var seenWindows = [];

    function push(label, sourceKind, win) {
      if (
        !win ||
        seenWindows.indexOf(win) !== -1
      ) {
        return;
      }

      var doc =
        null;

      try {
        doc =
          win.document ||
          null;
      } catch (_error) {
        doc =
          null;
      }

      seenWindows.push(win);

      scopes.push({
        label: label,
        sourceKind: sourceKind,
        windowRef: win,
        documentRef: doc,
        path: getPathname(win),
        href: getHref(win),
        title: getTitle(doc)
      });
    }

    push(
      "current.window",
      "CURRENT_WINDOW",
      root
    );

    try {
      if (
        root.parent &&
        root.parent !== root
      ) {
        push(
          "parent.window",
          "PARENT_WINDOW",
          root.parent
        );
      }
    } catch (_error1) {}

    try {
      if (
        root.top &&
        root.top !== root
      ) {
        push(
          "top.window",
          "TOP_WINDOW",
          root.top
        );
      }
    } catch (_error2) {}

    var initialScopes =
      scopes.slice();

    initialScopes.forEach(function scanFrames(scope) {
      var doc =
        scope.documentRef;

      if (
        !doc ||
        !isFunction(doc.querySelectorAll)
      ) {
        return;
      }

      var frames = [];

      try {
        frames =
          Array.prototype.slice.call(
            doc.querySelectorAll("iframe")
          );
      } catch (_error) {
        frames = [];
      }

      frames.forEach(function each(frame, index) {
        try {
          if (frame.contentWindow) {
            push(
              scope.label +
                ".iframe[" +
                index +
                "]",

              "IFRAME_WINDOW",

              frame.contentWindow
            );
          }
        } catch (_error2) {}
      });
    });

    return scopes;
  }

  function findTargetApi(win) {
    for (
      var i = 0;
      i < TARGET_API_ALIASES.length;
      i += 1
    ) {
      var alias =
        TARGET_API_ALIASES[i];

      var value =
        readPathFrom(
          win,
          alias
        );

      if (
        value &&
        (
          isObject(value) ||
          isFunction(value)
        )
      ) {
        return {
          found: true,
          alias: alias,
          value: value
        };
      }
    }

    return {
      found: false,
      alias: "NONE",
      value: null
    };
  }

  function collectScriptMatches(doc) {
    var scripts = [];
    var matches = [];

    if (!doc) {
      return {
        scripts: scripts,
        matches: matches
      };
    }

    try {
      scripts =
        Array.prototype.slice.call(
          doc.scripts ||
          []
        ).map(function map(script) {
          return {
            src:
              script.src ||
              "",

            type:
              script.type ||
              "",

            async:
              Boolean(script.async),

            defer:
              Boolean(script.defer),

            nomodule:
              Boolean(script.noModule)
          };
        });

      matches =
        scripts.filter(function filter(script) {
          return (
            script.src.indexOf(
              TARGET_FILE
            ) !== -1
          );
        });
    } catch (_error) {
      scripts = [];
      matches = [];
    }

    return {
      scripts: scripts,
      matches: matches
    };
  }

  function inspectScope(scope) {
    var win =
      scope.windowRef;

    var apiResult =
      findTargetApi(win);

    var scriptResult =
      collectScriptMatches(
        scope.documentRef
      );

    var loadedFlag =
      false;

    var versionFlag =
      "NONE";

    var modelSchemaFlag =
      "NONE";

    var receiptPublished =
      false;

    try {
      loadedFlag =
        Boolean(
          win.__DGB_ENGINE_CONTRACT_LOADED__
        );

      versionFlag =
        asString(
          win.__DGB_ENGINE_CONTRACT_VERSION__ ||
          "NONE"
        );

      modelSchemaFlag =
        asString(
          win.__DGB_ENGINE_CONTRACT_MODEL_SCHEMA__ ||
          "NONE"
        );

      receiptPublished =
        Boolean(
          win.DGB_ENGINE_CONTRACT_RECEIPT
        );
    } catch (_error) {}

    var score =
      0;

    if (apiResult.found) {
      score +=
        100;
    }

    if (loadedFlag) {
      score +=
        60;
    }

    if (receiptPublished) {
      score +=
        40;
    }

    if (scriptResult.matches.length) {
      score +=
        20;
    }

    if (
      apiResult.value &&
      apiResult.value.contract === TARGET_CONTRACT
    ) {
      score +=
        30;
    }

    return {
      label: scope.label,
      sourceKind: scope.sourceKind,
      path: scope.path,
      href: scope.href,
      title: scope.title,
      score: score,
      windowRef: win,
      documentRef: scope.documentRef,
      apiFound: apiResult.found,
      apiAlias: apiResult.alias,
      apiValue: apiResult.value,
      loadedFlag: loadedFlag,
      versionFlag: versionFlag,
      modelSchemaFlag: modelSchemaFlag,
      receiptPublished: receiptPublished,
      scriptTagFound: Boolean(
        scriptResult.matches.length
      ),
      scriptTagCount:
        scriptResult.matches.length,
      scriptMatches:
        scriptResult.matches
    };
  }

  function serializeScope(scope) {
    if (!scope) {
      return null;
    }

    return {
      label:
        scope.label,

      sourceKind:
        scope.sourceKind,

      path:
        scope.path,

      href:
        scope.href,

      title:
        scope.title,

      score:
        scope.score,

      apiFound:
        scope.apiFound,

      apiAlias:
        scope.apiAlias,

      loadedFlag:
        scope.loadedFlag,

      versionFlag:
        scope.versionFlag,

      modelSchemaFlag:
        scope.modelSchemaFlag,

      receiptPublished:
        scope.receiptPublished,

      scriptTagFound:
        scope.scriptTagFound,

      scriptTagCount:
        scope.scriptTagCount,

      scriptMatches:
        clonePlain(
          scope.scriptMatches
        )
    };
  }

  function selectBestScope(scopes) {
    if (
      !Array.isArray(scopes) ||
      !scopes.length
    ) {
      return null;
    }

    var inspected =
      scopes.map(
        inspectScope
      );

    inspected.sort(function sort(a, b) {
      return (
        b.score -
        a.score
      );
    });

    return {
      selected:
        inspected[0],

      inspected:
        inspected
    };
  }

  function safeCall(object, method, args) {
    if (
      !object ||
      !isFunction(object[method])
    ) {
      return {
        called: false,
        ok: false,
        value: null,
        error: "METHOD_UNAVAILABLE"
      };
    }

    try {
      return {
        called: true,
        ok: true,
        value:
          object[method].apply(
            object,
            Array.isArray(args)
              ? args
              : []
          ),
        error: "NONE"
      };
    } catch (error) {
      return {
        called: true,
        ok: false,
        value: null,
        error:
          asString(
            error &&
            error.message
              ? error.message
              : error,

            "CALL_THROW"
          )
      };
    }
  }

  function inspectRequiredMethods(api) {
    var missing = [];
    var present = [];

    REQUIRED_API_METHODS.forEach(function each(method) {
      if (
        api &&
        isFunction(api[method])
      ) {
        present.push(method);
      } else {
        missing.push(method);
      }
    });

    return {
      required:
        REQUIRED_API_METHODS.slice(),

      present:
        present,

      missing:
        missing,

      complete:
        missing.length === 0
    };
  }

  function readAuthority(api) {
    var receiptResult =
      safeCall(
        api,
        "getAuthorityReceipt"
      );

    var validationResult =
      safeCall(
        api,
        "getAuthorityValidation"
      );

    return {
      receiptCall:
        receiptResult,

      validationCall:
        validationResult,

      receipt:
        (
          receiptResult.ok &&
          isObject(receiptResult.value)
        )
          ? receiptResult.value
          : {},

      validation:
        (
          validationResult.ok &&
          isObject(validationResult.value)
        )
          ? validationResult.value
          : {}
    };
  }

  function runFalseReadinessControl(api) {
    var output = {
      attempted: false,
      passed: false,
      declaredOpsCreated: false,
      instanceSpecCreated: false,
      comparisonCreated: false,
      comparisonStatus: "UNKNOWN",
      comparisonReady: null,
      declaredState: "UNKNOWN",
      visiblePixelObserved: null,
      error: "NONE"
    };

    if (!api) {
      output.error =
        "API_UNAVAILABLE";

      return output;
    }

    output.attempted =
      true;

    var declaredResult =
      safeCall(
        api,
        "createDeclaredOps"
      );

    if (
      !declaredResult.ok ||
      !isObject(declaredResult.value)
    ) {
      output.error =
        "DECLARED_OPS_UNAVAILABLE:" +
        declaredResult.error;

      return output;
    }

    output.declaredOpsCreated =
      true;

    output.declaredState =
      asString(
        declaredResult.value.state ||
        "UNKNOWN"
      );

    if (
      isObject(
        declaredResult.value.observed
      )
    ) {
      output.visiblePixelObserved =
        declaredResult.value
          .observed
          .visiblePixelObserved;
    }

    var specResult =
      safeCall(
        api,
        "createInstanceSpec",
        [
          {
            interactionMode:
              "NONE"
          }
        ]
      );

    if (
      !specResult.ok ||
      !isObject(specResult.value)
    ) {
      output.error =
        "INSTANCE_SPEC_UNAVAILABLE:" +
        specResult.error;

      return output;
    }

    output.instanceSpecCreated =
      true;

    var comparisonResult =
      safeCall(
        api,
        "compareSpecAndOps",
        [
          specResult.value,
          declaredResult.value
        ]
      );

    if (
      !comparisonResult.ok ||
      !isObject(comparisonResult.value)
    ) {
      output.error =
        "COMPARISON_UNAVAILABLE:" +
        comparisonResult.error;

      return output;
    }

    output.comparisonCreated =
      true;

    output.comparisonStatus =
      asString(
        comparisonResult.value.status ||
        "UNKNOWN"
      );

    output.comparisonReady =
      Boolean(
        comparisonResult.value.ready
      );

    output.passed =
      comparisonResult.value.ready ===
      false;

    return output;
  }

  function refreshFileEvidence() {
    if (fileEvidenceCache.pending) {
      return Promise.resolve(
        clonePlain(
          fileEvidenceCache
        )
      );
    }

    if (
      !root.fetch ||
      !isFunction(root.fetch)
    ) {
      fileEvidenceCache = {
        attempted: false,
        pending: false,
        ok: false,
        status: "FETCH_UNAVAILABLE",
        statusText: "FETCH_UNAVAILABLE",
        contentType: "UNKNOWN",
        byteLength: 0,
        containsExpectedContract: false,
        containsExpectedFileMarker: false,
        containsExpectedModelSchema: false,
        error: "FETCH_UNAVAILABLE",
        updatedAt: nowIso()
      };

      return Promise.resolve(
        clonePlain(
          fileEvidenceCache
        )
      );
    }

    fileEvidenceCache.pending =
      true;

    fileEvidenceCache.attempted =
      true;

    fileEvidenceCache.status =
      "PENDING";

    fileEvidenceCache.statusText =
      "PENDING";

    fileEvidenceCache.updatedAt =
      nowIso();

    var separator =
      TARGET_FILE.indexOf("?") === -1
        ? "?"
        : "&";

    var requestUrl =
      TARGET_FILE +
      separator +
      "dgbEngineContractTruth=" +
      Date.now();

    return root.fetch(
      requestUrl,
      {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin"
      }
    ).then(function onResponse(response) {
      return response.text().then(function onText(text) {
        fileEvidenceCache = {
          attempted: true,
          pending: false,
          ok: Boolean(response.ok),
          status: response.status,
          statusText:
            response.statusText ||
            "",

          contentType:
            (
              response.headers &&
              isFunction(response.headers.get)
            )
              ? response.headers.get("content-type") ||
                "UNKNOWN"
              : "UNKNOWN",

          byteLength:
            text.length,

          containsExpectedContract:
            text.indexOf(
              TARGET_CONTRACT
            ) !== -1,

          containsExpectedFileMarker:
            text.indexOf(
              TARGET_FILE
            ) !== -1,

          containsExpectedModelSchema:
            text.indexOf(
              TARGET_MODEL_SCHEMA
            ) !== -1,

          error:
            "NONE",

          updatedAt:
            nowIso()
        };

        return clonePlain(
          fileEvidenceCache
        );
      });
    }).catch(function onError(error) {
      fileEvidenceCache = {
        attempted: true,
        pending: false,
        ok: false,
        status: "FETCH_THROW",
        statusText:
          asString(
            error &&
            error.message
              ? error.message
              : error,

            "FETCH_THROW"
          ),

        contentType: "UNKNOWN",
        byteLength: 0,
        containsExpectedContract: false,
        containsExpectedFileMarker: false,
        containsExpectedModelSchema: false,

        error:
          asString(
            error &&
            error.message
              ? error.message
              : error,

            "FETCH_THROW"
          ),

        updatedAt:
          nowIso()
      };

      return clonePlain(
        fileEvidenceCache
      );
    });
  }

  function firstHeldCoordinate(checks) {
    var order = [
      "TARGET_SCOPE_RESOLVED",
      "DGB_ENGINE_CONTRACT_GLOBAL_PUBLISHED",
      "DGB_ENGINE_CONTRACT_LOADED_FLAG_TRUE",
      "DGB_ENGINE_CONTRACT_IDENTITY_MATCHED",
      "DGB_ENGINE_CONTRACT_MODEL_SCHEMA_MATCHED",
      "DGB_ENGINE_CONTRACT_API_COMPLETE",
      "DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT_RETURNED",
      "DGB_ENGINE_CONTRACT_AUTHORITY_READY",
      "DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED",
      "DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO",
      "DGB_ENGINE_CONTRACT_F13_CONFIRMED",
      "DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED",
      "DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED"
    ];

    for (
      var i = 0;
      i < order.length;
      i += 1
    ) {
      if (!checks[order[i]]) {
        return order[i];
      }
    }

    return "NONE";
  }

  function stageFromChecks(checks) {
    var loaded =
      Boolean(
        checks.TARGET_SCOPE_RESOLVED &&
        checks.DGB_ENGINE_CONTRACT_GLOBAL_PUBLISHED &&
        checks.DGB_ENGINE_CONTRACT_LOADED_FLAG_TRUE
      );

    var active =
      Boolean(
        loaded &&
        checks.DGB_ENGINE_CONTRACT_IDENTITY_MATCHED &&
        checks.DGB_ENGINE_CONTRACT_MODEL_SCHEMA_MATCHED &&
        checks.DGB_ENGINE_CONTRACT_API_COMPLETE
      );

    var proven =
      Boolean(
        active &&
        checks.DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT_RETURNED &&
        checks.DGB_ENGINE_CONTRACT_AUTHORITY_READY &&
        checks.DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED &&
        checks.DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO &&
        checks.DGB_ENGINE_CONTRACT_F13_CONFIRMED &&
        checks.DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED &&
        checks.DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED
      );

    if (proven) {
      return "PROVEN";
    }

    if (active) {
      return "ACTIVE";
    }

    if (loaded) {
      return "LOADED";
    }

    return "DECLARED";
  }

  function recommendedActionFromHeld(held) {
    if (held === "TARGET_SCOPE_RESOLVED") {
      return "LOAD_THE_DIAGNOSTIC_IN_A_READABLE_WINDOW_SCOPE";
    }

    if (held === "DGB_ENGINE_CONTRACT_GLOBAL_PUBLISHED") {
      return "LOAD_DGB_ENGINE_CONTRACT_BEFORE_RUNNING_THIS_PROBE";
    }

    if (held === "DGB_ENGINE_CONTRACT_LOADED_FLAG_TRUE") {
      return "CONFIRM_DGB_ENGINE_CONTRACT_COMPLETED_PUBLICATION";
    }

    if (held === "DGB_ENGINE_CONTRACT_IDENTITY_MATCHED") {
      return "RECONCILE_DGB_ENGINE_CONTRACT_IDENTITY";
    }

    if (held === "DGB_ENGINE_CONTRACT_MODEL_SCHEMA_MATCHED") {
      return "RECONCILE_DGB_MODEL_PACKAGE_SCHEMA";
    }

    if (held === "DGB_ENGINE_CONTRACT_API_COMPLETE") {
      return "RESTORE_REQUIRED_DGB_ENGINE_CONTRACT_METHODS";
    }

    if (held === "DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT_RETURNED") {
      return "RESTORE_DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT";
    }

    if (held === "DGB_ENGINE_CONTRACT_AUTHORITY_READY") {
      return "RESOLVE_DGB_ENGINE_CONTRACT_AUTHORITY_SELF_VALIDATION";
    }

    if (held === "DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED") {
      return "RESOLVE_DGB_ENGINE_CONTRACT_VALIDATION_FAILURES";
    }

    if (held === "DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO") {
      return "CLEAR_DGB_ENGINE_CONTRACT_AUTHORITY_FAILURES";
    }

    if (held === "DGB_ENGINE_CONTRACT_F13_CONFIRMED") {
      return "RESTORE_F13_CONTRACT_GATE_EVIDENCE";
    }

    if (held === "DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED") {
      return "RESTORE_F21_NEXT_GATE_EVIDENCE";
    }

    if (held === "DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED") {
      return "RESTORE_DECLARED_OPS_FALSE_READINESS_CONTROL";
    }

    return "CONTRACT_PROVEN_CONTINUE_CURRENT_ENGINE_BUILD_SEQUENCE";
  }

  function composePacket() {
    var generatedAt =
      nowIso();

    var selection =
      selectBestScope(
        collectWindowScopes()
      );

    var selected =
      selection
        ? selection.selected
        : null;

    var inspectedScopes =
      selection
        ? selection.inspected
        : [];

    var api =
      selected
        ? selected.apiValue
        : null;

    var methodAudit =
      inspectRequiredMethods(api);

    var authority =
      readAuthority(api);

    var authorityReceipt =
      authority.receipt;

    var authorityValidation =
      authority.validation;

    var falseReadiness =
      runFalseReadinessControl(api);

    var apiContract =
      api
        ? asString(
            api.contract ||
            api.CONTRACT ||
            "UNKNOWN"
          )
        : "UNKNOWN";

    var apiModelSchema =
      (
        api &&
        api.schemas
      )
        ? asString(
            api.schemas.MODEL ||
            api.schemas.model ||
            "UNKNOWN"
          )
        : "UNKNOWN";

    var checks = {
      TARGET_SCOPE_RESOLVED:
        Boolean(selected),

      DGB_ENGINE_CONTRACT_GLOBAL_PUBLISHED:
        Boolean(
          selected &&
          selected.apiFound
        ),

      DGB_ENGINE_CONTRACT_LOADED_FLAG_TRUE:
        Boolean(
          selected &&
          selected.loadedFlag
        ),

      DGB_ENGINE_CONTRACT_IDENTITY_MATCHED:
        apiContract ===
        TARGET_CONTRACT,

      DGB_ENGINE_CONTRACT_MODEL_SCHEMA_MATCHED:
        Boolean(
          apiModelSchema === TARGET_MODEL_SCHEMA &&
          selected &&
          selected.modelSchemaFlag === TARGET_MODEL_SCHEMA
        ),

      DGB_ENGINE_CONTRACT_API_COMPLETE:
        methodAudit.complete,

      DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT_RETURNED:
        Boolean(
          authority.receiptCall.ok &&
          isObject(authorityReceipt) &&
          Object.keys(authorityReceipt).length
        ),

      DGB_ENGINE_CONTRACT_AUTHORITY_READY:
        Boolean(
          authorityReceipt.status === "READY" &&
          authorityReceipt.ready === true
        ),

      DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED:
        Boolean(
          authority.validationCall.ok &&
          authorityValidation.passed === true
        ),

      DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO:
        Boolean(
          Number(
            authorityReceipt.validationFailCount
          ) === 0 &&
          Number(
            authorityValidation.failCount
          ) === 0
        ),

      DGB_ENGINE_CONTRACT_F13_CONFIRMED:
        Number(
          authorityReceipt.fibonacciGate
        ) === TARGET_CURRENT_GATE,

      DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED:
        Number(
          authorityReceipt.nextFibonacciGate
        ) === TARGET_NEXT_GATE,

      DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED:
        falseReadiness.passed === true
    };

    var held =
      firstHeldCoordinate(checks);

    var stage =
      stageFromChecks(checks);

    var proven =
      stage === "PROVEN";

    var nextAction =
      recommendedActionFromHeld(held);

    var packet = {
      PACKET:
        "HEARTH_CANVAS_SURFACE_TRUTH_DGB_ENGINE_CONTRACT_READER_PACKET_v6_0",

      PACKET_NAME:
        "HEARTH_CANVAS_SURFACE_TRUTH_DGB_ENGINE_CONTRACT_READER_PACKET_v6_0",

      RECEIPT_LEVEL:
        "3_DIRECT_EXECUTION",

      MODE:
        "GET_RECEIPT",

      ROLE:
        "DGB_ENGINE_CONTRACT_TRUTH_PROBE_COMPATIBILITY_SHELL",

      COMPONENT:
        "DGB_ENGINE_CONTRACT_TRUTH",

      CONTRACT:
        CONTRACT,

      RECEIPT:
        RECEIPT,

      PREVIOUS_CONTRACT:
        PREVIOUS_CONTRACT,

      VERSION:
        VERSION,

      FILE:
        FILE,

      TARGET_FILE:
        TARGET_FILE,

      TARGET_CONTRACT:
        TARGET_CONTRACT,

      TARGET_MODEL_SCHEMA:
        TARGET_MODEL_SCHEMA,

      GENERATED_AT:
        generatedAt,

      UPDATED_AT:
        generatedAt,

      RUN_STATE:
        "DGB_ENGINE_CONTRACT_DIAGNOSTIC_READ_COMPLETE",

      TRUST_STATE:
        proven
          ? "DGB_ENGINE_CONTRACT_PROVEN"
          : "DGB_ENGINE_CONTRACT_RETURNED_WITH_HOLD",

      BLOCKING:
        false,

      DIAGNOSTIC_BLOCKING:
        false,

      TARGET_PROOF_BLOCKED:
        !proven,

      DIAGNOSTIC_STAGE:
        stage,

      DECLARED:
        true,

      LOADED:
        (
          stage === "LOADED" ||
          stage === "ACTIVE" ||
          stage === "PROVEN"
        ),

      ACTIVE:
        (
          stage === "ACTIVE" ||
          stage === "PROVEN"
        ),

      PROVEN:
        proven,

      FIRST_HELD_COORDINATE:
        held,

      FIRST_FAILED_COORDINATE:
        held,

      RECOMMENDED_NEXT_FILE:
        held === "NONE"
          ? "NONE"
          : TARGET_FILE,

      RECOMMENDED_NEXT_ACTION:
        nextAction,

      TARGET_SCOPE_RESOLVED:
        checks.TARGET_SCOPE_RESOLVED,

      SELECTED_WINDOW_SCOPE:
        selected
          ? selected.label
          : "NONE",

      SELECTED_WINDOW_SOURCE_KIND:
        selected
          ? selected.sourceKind
          : "NONE",

      SELECTED_DOCUMENT_PATH:
        selected
          ? selected.path
          : "UNKNOWN",

      SELECTED_DOCUMENT_HREF:
        selected
          ? selected.href
          : "UNKNOWN",

      SELECTED_DOCUMENT_TITLE:
        selected
          ? selected.title
          : "UNKNOWN",

      DGB_ENGINE_CONTRACT_GLOBAL_PUBLISHED:
        checks.DGB_ENGINE_CONTRACT_GLOBAL_PUBLISHED,

      DGB_ENGINE_CONTRACT_API_ALIAS:
        selected
          ? selected.apiAlias
          : "NONE",

      DGB_ENGINE_CONTRACT_LOADED_FLAG_TRUE:
        checks.DGB_ENGINE_CONTRACT_LOADED_FLAG_TRUE,

      DGB_ENGINE_CONTRACT_VERSION_FLAG:
        selected
          ? selected.versionFlag
          : "NONE",

      DGB_ENGINE_CONTRACT_MODEL_SCHEMA_FLAG:
        selected
          ? selected.modelSchemaFlag
          : "NONE",

      DGB_ENGINE_CONTRACT_RECEIPT_GLOBAL_PUBLISHED:
        Boolean(
          selected &&
          selected.receiptPublished
        ),

      DGB_ENGINE_CONTRACT_SCRIPT_TAG_FOUND:
        Boolean(
          selected &&
          selected.scriptTagFound
        ),

      DGB_ENGINE_CONTRACT_SCRIPT_TAG_COUNT:
        selected
          ? selected.scriptTagCount
          : 0,

      DGB_ENGINE_CONTRACT_SCRIPT_MATCHES:
        selected
          ? clonePlain(
              selected.scriptMatches
            )
          : [],

      DGB_ENGINE_CONTRACT_FILE_FETCH_ATTEMPTED:
        fileEvidenceCache.attempted,

      DGB_ENGINE_CONTRACT_FILE_FETCH_PENDING:
        fileEvidenceCache.pending,

      DGB_ENGINE_CONTRACT_FILE_FETCH_OK:
        fileEvidenceCache.ok,

      DGB_ENGINE_CONTRACT_FILE_FETCH_STATUS:
        fileEvidenceCache.status,

      DGB_ENGINE_CONTRACT_FILE_FETCH_STATUS_TEXT:
        fileEvidenceCache.statusText,

      DGB_ENGINE_CONTRACT_FILE_FETCH_CONTENT_TYPE:
        fileEvidenceCache.contentType,

      DGB_ENGINE_CONTRACT_FILE_FETCH_BYTE_LENGTH:
        fileEvidenceCache.byteLength,

      DGB_ENGINE_CONTRACT_FILE_FETCH_ERROR:
        fileEvidenceCache.error,

      DGB_ENGINE_CONTRACT_FILE_TEXT_MATCHES_EXPECTED_CONTRACT:
        fileEvidenceCache.containsExpectedContract,

      DGB_ENGINE_CONTRACT_FILE_TEXT_CONTAINS_FILE_MARKER:
        fileEvidenceCache.containsExpectedFileMarker,

      DGB_ENGINE_CONTRACT_FILE_TEXT_CONTAINS_MODEL_SCHEMA:
        fileEvidenceCache.containsExpectedModelSchema,

      DGB_ENGINE_CONTRACT_FILE_EVIDENCE_UPDATED_AT:
        fileEvidenceCache.updatedAt,

      DGB_ENGINE_CONTRACT_FILE_FETCH_GOVERNING:
        false,

      DGB_ENGINE_CONTRACT_IDENTITY_MATCHED:
        checks.DGB_ENGINE_CONTRACT_IDENTITY_MATCHED,

      DGB_ENGINE_CONTRACT_OBSERVED_CONTRACT:
        apiContract,

      DGB_ENGINE_CONTRACT_MODEL_SCHEMA_MATCHED:
        checks.DGB_ENGINE_CONTRACT_MODEL_SCHEMA_MATCHED,

      DGB_ENGINE_CONTRACT_OBSERVED_MODEL_SCHEMA:
        apiModelSchema,

      DGB_ENGINE_CONTRACT_REQUIRED_API_METHODS:
        methodAudit.required,

      DGB_ENGINE_CONTRACT_PRESENT_API_METHODS:
        methodAudit.present,

      DGB_ENGINE_CONTRACT_MISSING_API_METHODS:
        methodAudit.missing,

      DGB_ENGINE_CONTRACT_API_COMPLETE:
        checks.DGB_ENGINE_CONTRACT_API_COMPLETE,

      DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT_RETURNED:
        checks.DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT_RETURNED,

      DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT_CALL_OK:
        authority.receiptCall.ok,

      DGB_ENGINE_CONTRACT_AUTHORITY_RECEIPT_CALL_ERROR:
        authority.receiptCall.error,

      DGB_ENGINE_CONTRACT_AUTHORITY_READY:
        checks.DGB_ENGINE_CONTRACT_AUTHORITY_READY,

      DGB_ENGINE_CONTRACT_AUTHORITY_STATUS:
        asString(
          authorityReceipt.status ||
          "UNKNOWN"
        ),

      DGB_ENGINE_CONTRACT_AUTHORITY_READY_VALUE:
        authorityReceipt.ready === true,

      DGB_ENGINE_CONTRACT_AUTHORITY_HASH:
        asString(
          authorityReceipt.contractHash ||
          "UNKNOWN"
        ),

      DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_RETURNED:
        Boolean(
          authority.validationCall.ok &&
          isObject(authorityValidation) &&
          Object.keys(authorityValidation).length
        ),

      DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_CALL_OK:
        authority.validationCall.ok,

      DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_CALL_ERROR:
        authority.validationCall.error,

      DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED:
        checks.DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED,

      DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASS_COUNT:
        Number(
          authorityValidation.passCount
        ) ||
        0,

      DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_FAIL_COUNT:
        Number(
          authorityValidation.failCount
        ) ||
        0,

      DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO:
        checks.DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO,

      DGB_ENGINE_CONTRACT_F13_CONFIRMED:
        checks.DGB_ENGINE_CONTRACT_F13_CONFIRMED,

      DGB_ENGINE_CONTRACT_OBSERVED_FIBONACCI_GATE:
        Number(
          authorityReceipt.fibonacciGate
        ) ||
        0,

      DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED:
        checks.DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED,

      DGB_ENGINE_CONTRACT_OBSERVED_NEXT_FIBONACCI_GATE:
        Number(
          authorityReceipt.nextFibonacciGate
        ) ||
        0,

      DGB_ENGINE_CONTRACT_FALSE_READY_CONTROL_ATTEMPTED:
        falseReadiness.attempted,

      DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED:
        checks.DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED,

      DGB_ENGINE_CONTRACT_DECLARED_OPS_CREATED:
        falseReadiness.declaredOpsCreated,

      DGB_ENGINE_CONTRACT_INSTANCE_SPEC_CREATED:
        falseReadiness.instanceSpecCreated,

      DGB_ENGINE_CONTRACT_COMPARISON_CREATED:
        falseReadiness.comparisonCreated,

      DGB_ENGINE_CONTRACT_DECLARED_OPS_STATE:
        falseReadiness.declaredState,

      DGB_ENGINE_CONTRACT_DECLARED_VISIBLE_PIXEL_OBSERVED:
        falseReadiness.visiblePixelObserved,

      DGB_ENGINE_CONTRACT_DECLARED_COMPARISON_STATUS:
        falseReadiness.comparisonStatus,

      DGB_ENGINE_CONTRACT_DECLARED_COMPARISON_READY:
        falseReadiness.comparisonReady,

      DGB_ENGINE_CONTRACT_FALSE_READY_CONTROL_ERROR:
        falseReadiness.error,

      CHECKS_OBJECT:
        clonePlain(checks),

      AUTHORITY_RECEIPT_OBJECT:
        clonePlain(
          authorityReceipt
        ),

      AUTHORITY_VALIDATION_OBJECT:
        clonePlain(
          authorityValidation
        ),

      FALSE_READINESS_CONTROL_OBJECT:
        clonePlain(
          falseReadiness
        ),

      WINDOW_SCOPE_OBJECTS:
        inspectedScopes.map(
          serializeScope
        ),

      LEGACY_SOURCE_FILE_PATH_PRESERVED:
        true,

      LEGACY_CALLABLE_ALIASES_PRESERVED:
        true,

      LEGACY_RECEIPT_METHODS_PRESERVED:
        true,

      LEGACY_HEARTH_CANVAS_MEASUREMENT_ACTIVE:
        false,

      LEGACY_HEARTH_ROUTE_MEASUREMENT_ACTIVE:
        false,

      LEGACY_BISHOP_MEASUREMENT_ACTIVE:
        false,

      LEGACY_TWO_CHAPEL_CYCLE_MEASUREMENT_ACTIVE:
        false,

      LEGACY_CANVAS_FIELDS_STATUS:
        "RETIRED_NOT_GOVERNING",

      BACKEND_NEUTRAL:
        true,

      READER_ONLY:
        true,

      NORTH_DIAGNOSTIC_TRACK_MUST_CONSUME_THIS_AS_EVIDENCE:
        true,

      FINAL_VERDICT_OWNED_HERE:
        false,

      CANONICAL_MOUNT_EXISTS:
        false,

      CANONICAL_MOUNT_RECT_NONZERO:
        false,

      CANONICAL_CANVAS_EXISTS:
        false,

      CANONICAL_CANVAS_RECT_NONZERO:
        false,

      CHAPEL_ONE_HEAD_PRESENT:
        false,

      CHAPEL_ONE_PRIEST_PRESENT:
        false,

      CHAPEL_ONE_WORKER_COUNT:
        0,

      CHAPEL_ONE_WORKER_TOTAL:
        0,

      CHAPEL_ONE_COMPLETE:
        false,

      BRIDGE_AUTHORITY_PRESENT:
        false,

      ACTIVE_CROSSING_BRIDGE_PRESENT:
        false,

      CHAPEL_TWO_HEAD_PRESENT:
        false,

      CHAPEL_TWO_PRIEST_PRESENT:
        false,

      CHAPEL_TWO_WORKER_COUNT:
        0,

      CHAPEL_TWO_WORKER_TOTAL:
        0,

      CHAPEL_TWO_COMPLETE:
        false,

      BRIDGE_RETURN_PRESENT:
        false,

      DO_NOT_TOUCH:
        "PRODUCTION,ENGINE_EXECUTION,RENDERING,INPUT,CONTROLS,ROUTES,NORTH_VERDICT"
    };

    Object.keys(NO_CLAIMS).forEach(function each(key) {
      packet[key] =
        NO_CLAIMS[key];
    });

    return packet;
  }

  function getPacket() {
    return composePacket();
  }

  function getReport() {
    return composePacket();
  }

  function getReceipt() {
    return composePacket();
  }

  function inspect() {
    return composePacket();
  }

  function measure() {
    return composePacket();
  }

  function read() {
    return composePacket();
  }

  function run() {
    return composePacket();
  }

  function runDiagnostic() {
    return composePacket();
  }

  function getState() {
    return composePacket();
  }

  function getStatus() {
    var packet =
      composePacket();

    return {
      CONTRACT:
        CONTRACT,

      RECEIPT:
        RECEIPT,

      VERSION:
        VERSION,

      FILE:
        FILE,

      TARGET_FILE:
        TARGET_FILE,

      TARGET_CONTRACT:
        TARGET_CONTRACT,

      TARGET_MODEL_SCHEMA:
        TARGET_MODEL_SCHEMA,

      DIAGNOSTIC_STAGE:
        packet.DIAGNOSTIC_STAGE,

      DECLARED:
        packet.DECLARED,

      LOADED:
        packet.LOADED,

      ACTIVE:
        packet.ACTIVE,

      PROVEN:
        packet.PROVEN,

      FIRST_HELD_COORDINATE:
        packet.FIRST_HELD_COORDINATE,

      RECOMMENDED_NEXT_FILE:
        packet.RECOMMENDED_NEXT_FILE,

      RECOMMENDED_NEXT_ACTION:
        packet.RECOMMENDED_NEXT_ACTION,

      DGB_ENGINE_CONTRACT_API_ALIAS:
        packet.DGB_ENGINE_CONTRACT_API_ALIAS,

      DGB_ENGINE_CONTRACT_AUTHORITY_STATUS:
        packet.DGB_ENGINE_CONTRACT_AUTHORITY_STATUS,

      DGB_ENGINE_CONTRACT_AUTHORITY_READY:
        packet.DGB_ENGINE_CONTRACT_AUTHORITY_READY,

      DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED:
        packet.DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED,

      DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO:
        packet.DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO,

      DGB_ENGINE_CONTRACT_F13_CONFIRMED:
        packet.DGB_ENGINE_CONTRACT_F13_CONFIRMED,

      DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED:
        packet.DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED,

      DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED:
        packet.DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED,

      UPDATED_AT:
        nowIso()
    };
  }

  function getReceiptLight() {
    return getStatus();
  }

  function getSummary() {
    var packet =
      composePacket();

    return {
      stage:
        packet.DIAGNOSTIC_STAGE,

      proven:
        packet.PROVEN,

      firstHeldCoordinate:
        packet.FIRST_HELD_COORDINATE,

      recommendedNextFile:
        packet.RECOMMENDED_NEXT_FILE,

      recommendedNextAction:
        packet.RECOMMENDED_NEXT_ACTION,

      authorityStatus:
        packet.DGB_ENGINE_CONTRACT_AUTHORITY_STATUS,

      authorityReady:
        packet.DGB_ENGINE_CONTRACT_AUTHORITY_READY,

      validationPassed:
        packet.DGB_ENGINE_CONTRACT_AUTHORITY_VALIDATION_PASSED,

      validationFailuresZero:
        packet.DGB_ENGINE_CONTRACT_VALIDATION_FAILURES_ZERO,

      f13Confirmed:
        packet.DGB_ENGINE_CONTRACT_F13_CONFIRMED,

      f21NextConfirmed:
        packet.DGB_ENGINE_CONTRACT_F21_NEXT_CONFIRMED,

      falseReadyPrevented:
        packet.DGB_ENGINE_CONTRACT_FALSE_READY_PREVENTED
    };
  }

  function toPacketText(packet) {
    var source =
      packet ||
      composePacket();

    return Object.keys(source).map(function line(key) {
      var value =
        source[key];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        value =
          "UNKNOWN";
      } else if (isFunction(value)) {
        value =
          "[function]";
      } else if (
        isObject(value) ||
        Array.isArray(value)
      ) {
        try {
          value =
            JSON.stringify(value);
        } catch (_error) {
          value =
            "[object]";
        }
      }

      return (
        key +
        "=" +
        compact(
          value,
          40000
        )
      );
    }).join("\n");
  }

  function getPacketText() {
    return toPacketText(
      composePacket()
    );
  }

  function getReceiptAsync() {
    return refreshFileEvidence().then(function afterRefresh() {
      return composePacket();
    });
  }

  function runDiagnosticAsync() {
    return getReceiptAsync();
  }

  function publishApi() {
    ensureNamespace("HEARTH");
    ensureNamespace("DEXTER_LAB");
    ensureNamespace("DGB");

    var api = {
      CONTRACT:
        CONTRACT,

      RECEIPT:
        RECEIPT,

      PREVIOUS_CONTRACT:
        PREVIOUS_CONTRACT,

      VERSION:
        VERSION,

      FILE:
        FILE,

      TARGET_FILE:
        TARGET_FILE,

      TARGET_CONTRACT:
        TARGET_CONTRACT,

      TARGET_MODEL_SCHEMA:
        TARGET_MODEL_SCHEMA,

      contract:
        CONTRACT,

      receipt:
        RECEIPT,

      previousContract:
        PREVIOUS_CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      targetFile:
        TARGET_FILE,

      targetContract:
        TARGET_CONTRACT,

      targetModelSchema:
        TARGET_MODEL_SCHEMA,

      run:
        run,

      runDiagnostic:
        runDiagnostic,

      runDiagnosticAsync:
        runDiagnosticAsync,

      inspect:
        inspect,

      measure:
        measure,

      read:
        read,

      getReport:
        getReport,

      getReceipt:
        getReceipt,

      getReceiptAsync:
        getReceiptAsync,

      getReceiptLight:
        getReceiptLight,

      getStatus:
        getStatus,

      getState:
        getState,

      getPacket:
        getPacket,

      getPacketText:
        getPacketText,

      getSummary:
        getSummary,

      toPacketText:
        toPacketText,

      refreshFileEvidence:
        refreshFileEvidence,

      collectWindowScopes:
        function exposedCollectWindowScopes() {
          var selection =
            selectBestScope(
              collectWindowScopes()
            );

          return selection
            ? selection.inspected.map(
                serializeScope
              )
            : [];
        },

      inspectContractAuthority:
        function exposedInspectContractAuthority() {
          var selection =
            selectBestScope(
              collectWindowScopes()
            );

          var selected =
            selection
              ? selection.selected
              : null;

          var contractApi =
            selected
              ? selected.apiValue
              : null;

          var authority =
            readAuthority(
              contractApi
            );

          return {
            selectedScope:
              serializeScope(
                selected
              ),

            methodAudit:
              inspectRequiredMethods(
                contractApi
              ),

            authorityReceipt:
              clonePlain(
                authority.receipt
              ),

            authorityValidation:
              clonePlain(
                authority.validation
              ),

            falseReadinessControl:
              clonePlain(
                runFalseReadinessControl(
                  contractApi
                )
              )
          };
        }
    };

    var aliases = [
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.canvasSurfaceTruthProbe",
      "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "DEXTER_LAB.canvasSurfaceTruthProbe",
      "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth",
      "DGB_ENGINE_CONTRACT_DIAGNOSTIC_PROBE",
      "DGB.engineContractDiagnosticProbe",
      "DGB.ENGINE_CONTRACT_DIAGNOSTIC_PROBE"
    ];

    aliases.forEach(function publish(alias) {
      setPathOn(
        root,
        alias,
        api
      );
    });

    root.__HEARTH_SURFACE_TRUTH_PROBE_LOADED__ =
      true;

    root.__HEARTH_SURFACE_TRUTH_PROBE_CONTRACT__ =
      CONTRACT;

    root.__HEARTH_SURFACE_TRUTH_PROBE_VERSION__ =
      VERSION;

    root.__DGB_ENGINE_CONTRACT_DIAGNOSTIC_PROBE_LOADED__ =
      true;

    root.__DGB_ENGINE_CONTRACT_DIAGNOSTIC_PROBE_CONTRACT__ =
      CONTRACT;

    root.__DGB_ENGINE_CONTRACT_DIAGNOSTIC_PROBE_VERSION__ =
      VERSION;

    if (
      root.fetch &&
      isFunction(root.fetch)
    ) {
      refreshFileEvidence();
    }

    return api;
  }

  var publishedApi =
    publishApi();

  if (
    typeof module !== "undefined" &&
    module.exports
  ) {
    module.exports =
      publishedApi;
  }
})(
  typeof window !== "undefined"
    ? window
    : globalThis
);
