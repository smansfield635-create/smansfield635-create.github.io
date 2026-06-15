// /assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js
// AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native surface truth probe.
// Owns observation of diagnostic target frame, 3D host availability,
// presentation surface dimensions, canvas/WebGL/WebGPU surface hints,
// and non-mutating surface evidence.
// Does not own rendering, canvas creation, WebGL/WebGPU initialization,
// runtime restart, repair authorization, readiness, visual pass, or F21.

(function installAudraliaDiagnosticProbeCanvasSurfaceTruthF8(global) {
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
    "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v1";

  var VERSION =
    "1.0.0";

  var FILE =
    "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js";

  var STATION_ID =
    "CANVAS_SURFACE_TRUTH";

  var CYCLE_POSITION =
    4;

  var FIBONACCI =
    "F8";

  var STATION_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var DEFINITION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_DEFINITION_RECEIPT_v1";

  var INSTALLATION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_INSTALLATION_RECEIPT_v1";

  var TARGET_FRAME_ID =
    "audraliaDiagnosticTargetFrame";

  var TARGET_ROUTE =
    "/showroom/globe/audralia/";

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
      return value.toString();
    }

    if (
      typeof value === "function" ||
      typeof value === "symbol"
    ) {
      return null;
    }

    var memory =
      seen || [];

    if (memory.indexOf(value) !== -1) {
      return "[Circular]";
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function cloneEntry(entry) {
        return clone(
          entry,
          memory.slice()
        );
      });
    }

    if (!isObject(value)) {
      return null;
    }

    var output = {};

    Object.keys(value).forEach(function cloneKey(key) {
      try {
        output[key] =
          clone(
            value[key],
            memory.slice()
          );
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

    try {
      Object.getOwnPropertyNames(value).forEach(
        function freezeProperty(key) {
          try {
            deepFreeze(
              value[key],
              memory
            );
          } catch (_error) {}
        }
      );

      Object.freeze(value);
    } catch (_error2) {}

    return value;
  }

  function frozenClone(value) {
    return deepFreeze(
      clone(value)
    );
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
      return value.toString();
    }

    if (
      typeof value === "function" ||
      typeof value === "symbol"
    ) {
      return null;
    }

    var memory =
      seen || [];

    if (memory.indexOf(value) !== -1) {
      return "[Circular]";
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function stableArray(entry) {
        return stablePrepare(
          entry,
          memory.slice()
        );
      });
    }

    if (!isObject(value)) {
      return null;
    }

    var output = {};

    Object.keys(value)
      .sort()
      .forEach(function stableKey(key) {
        output[key] =
          stablePrepare(
            value[key],
            memory.slice()
          );
      });

    return output;
  }

  function hashObject(value) {
    var text;

    try {
      text =
        JSON.stringify(
          stablePrepare(value)
        );
    } catch (_error) {
      text =
        String(value);
    }

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
        Math.imul(
          result,
          0x01000193
        ) >>> 0;
    }

    return (
      "fnv1a32:" +
      ("00000000" + result.toString(16))
        .slice(-8)
    );
  }

  function readPathFrom(source, path) {
    var parts =
      String(path || "")
        .split(".")
        .filter(Boolean);

    var cursor =
      source;

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
      code:
        String(code || "ISSUE"),

      path:
        String(path || STATION_ID),

      detail:
        String(detail || code || "ISSUE")
          .slice(0, 512)
    };
  }

  function safeRect(element) {
    if (
      !element ||
      !isFunction(element.getBoundingClientRect)
    ) {
      return null;
    }

    try {
      var rect =
        element.getBoundingClientRect();

      return {
        x:
          Number(rect.x || 0),

        y:
          Number(rect.y || 0),

        width:
          Number(rect.width || 0),

        height:
          Number(rect.height || 0),

        top:
          Number(rect.top || 0),

        right:
          Number(rect.right || 0),

        bottom:
          Number(rect.bottom || 0),

        left:
          Number(rect.left || 0),

        nonzero:
          Number(rect.width || 0) > 0 &&
          Number(rect.height || 0) > 0
      };
    } catch (_error) {
      return null;
    }
  }

  function inspectCanvas(canvas) {
    var rect =
      safeRect(canvas);

    var width =
      canvas &&
      Number.isFinite(Number(canvas.width))
        ? Number(canvas.width)
        : null;

    var height =
      canvas &&
      Number.isFinite(Number(canvas.height))
        ? Number(canvas.height)
        : null;

    return {
      tagName:
        canvas && canvas.tagName
          ? String(canvas.tagName)
          : null,

      id:
        canvas && canvas.id
          ? String(canvas.id)
          : null,

      className:
        canvas && canvas.className
          ? String(canvas.className)
          : "",

      width:
        width,

      height:
        height,

      backingStoreNonzero:
        Number(width || 0) > 0 &&
        Number(height || 0) > 0,

      rect:
        rect,

      rectNonzero:
        Boolean(
          rect &&
          rect.nonzero
        )
    };
  }

  function collectCanvases(documentRef) {
    if (!documentRef || !isFunction(documentRef.querySelectorAll)) {
      return [];
    }

    try {
      return Array.prototype.slice.call(
        documentRef.querySelectorAll("canvas")
      ).map(inspectCanvas);
    } catch (_error) {
      return [];
    }
  }

  function findLikelySurface(documentRef) {
    if (!documentRef || !isFunction(documentRef.querySelector)) {
      return null;
    }

    var selectors = [
      "#audraliaCanvas",
      "#audraliaPlanetCanvas",
      "#audraliaCanvasMount canvas",
      "#audraliaMount canvas",
      "#planetCanvas",
      "canvas[data-audralia-surface]",
      "canvas[data-engine-surface]",
      "canvas"
    ];

    for (
      var index = 0;
      index < selectors.length;
      index += 1
    ) {
      try {
        var found =
          documentRef.querySelector(
            selectors[index]
          );

        if (found) {
          return {
            selector:
              selectors[index],

            surface:
              inspectCanvas(found)
          };
        }
      } catch (_error) {}
    }

    return null;
  }

  function inspectFrame() {
    var localDocument =
      root && root.document
        ? root.document
        : null;

    var frame =
      localDocument && isFunction(localDocument.getElementById)
        ? localDocument.getElementById(TARGET_FRAME_ID)
        : null;

    var frameWindow =
      null;

    var frameDocument =
      null;

    var sameOriginAccessible =
      false;

    var documentLoaded =
      false;

    var documentReadyState =
      null;

    var surface =
      null;

    var canvases =
      [];

    var runtimeStatus =
      null;

    var runtimeGlobals = {
      DGBAudraliaPlanetRuntime: false,
      AUDRALIA_PLANET_RUNTIME: false,
      AudraliaPlanetRuntime: false
    };

    if (frame) {
      try {
        frameWindow =
          frame.contentWindow || null;

        frameDocument =
          frame.contentDocument ||
          (
            frameWindow
              ? frameWindow.document
              : null
          );

        sameOriginAccessible =
          Boolean(frameDocument);

        documentReadyState =
          frameDocument && frameDocument.readyState
            ? String(frameDocument.readyState)
            : null;

        documentLoaded =
          documentReadyState === "complete" ||
          documentReadyState === "interactive";

        if (frameDocument) {
          surface =
            findLikelySurface(frameDocument);

          canvases =
            collectCanvases(frameDocument);
        }

        if (frameWindow) {
          runtimeGlobals.DGBAudraliaPlanetRuntime =
            Boolean(frameWindow.DGBAudraliaPlanetRuntime);

          runtimeGlobals.AUDRALIA_PLANET_RUNTIME =
            Boolean(frameWindow.AUDRALIA_PLANET_RUNTIME);

          runtimeGlobals.AudraliaPlanetRuntime =
            Boolean(frameWindow.AudraliaPlanetRuntime);

          var runtime =
            frameWindow.DGBAudraliaPlanetRuntime ||
            frameWindow.AUDRALIA_PLANET_RUNTIME ||
            frameWindow.AudraliaPlanetRuntime ||
            null;

          if (
            runtime &&
            isFunction(runtime.getStatus)
          ) {
            try {
              runtimeStatus =
                frozenClone(
                  runtime.getStatus()
                );
            } catch (_error2) {
              runtimeStatus =
                null;
            }
          }
        }
      } catch (_error3) {
        sameOriginAccessible =
          false;

        documentLoaded =
          false;

        documentReadyState =
          null;
      }
    }

    return deepFreeze({
      framePresent:
        Boolean(frame),

      frameId:
        TARGET_FRAME_ID,

      targetRoute:
        TARGET_ROUTE,

      sameOriginAccessible:
        sameOriginAccessible,

      documentLoaded:
        documentLoaded,

      documentReadyState:
        documentReadyState,

      runtimeGlobals:
        runtimeGlobals,

      runtimeStatus:
        runtimeStatus,

      runtimeStatusAvailable:
        Boolean(runtimeStatus),

      likelySurface:
        surface,

      canvasCount:
        canvases.length,

      canvases:
        canvases,

      noClaims: {
        iframePresenceProvesWebGL2:
          false,

        iframePresenceProvesSubmission:
          false,

        iframePresenceProvesPresentation:
          false,

        iframePresenceProvesVisibility:
          false,

        canvasPresenceProvesRendering:
          false,

        nonzeroRectProvesVisualPass:
          false
      }
    });
  }

  function inspectRequestEvidence(request) {
    var target =
      isObject(request)
        ? request.target
        : null;

    var engineFamily =
      isObject(request)
        ? request.engineFamily
        : null;

    var runtime =
      engineFamily &&
      isObject(engineFamily.runtime)
        ? engineFamily.runtime
        : null;

    return deepFreeze({
      requestTarget:
        target
          ? frozenClone(target)
          : null,

      requestRuntime:
        runtime
          ? frozenClone(runtime)
          : null,

      requestClaimsSurfaceNonzero:
        runtime &&
        runtime.surfaceNonzero === true,

      requestClaimsVisiblePixel:
        runtime &&
        runtime.visiblePixelObserved === true,

      requestRuntimeEvidenceAvailable:
        runtime &&
        runtime.evidenceAvailable === true,

      requestTargetRuntimeEvidenceAvailable:
        target &&
        target.runtimeEvidenceAvailable === true
    });
  }

  function determineStatus(frameEvidence, requestEvidence) {
    var issues = [];

    if (!frameEvidence.framePresent) {
      issues.push(
        issue(
          "TARGET_FRAME_NOT_PRESENT",
          STATION_ID,
          "The diagnostic target iframe was not found."
        )
      );
    }

    if (
      frameEvidence.framePresent &&
      !frameEvidence.sameOriginAccessible
    ) {
      issues.push(
        issue(
          "TARGET_FRAME_NOT_ACCESSIBLE",
          STATION_ID,
          "The diagnostic target iframe could not be inspected from this route."
        )
      );
    }

    if (
      frameEvidence.framePresent &&
      frameEvidence.sameOriginAccessible &&
      !frameEvidence.documentLoaded
    ) {
      issues.push(
        issue(
          "TARGET_DOCUMENT_NOT_LOADED",
          STATION_ID,
          "The target frame document is present but not loaded enough for surface inspection."
        )
      );
    }

    if (
      frameEvidence.framePresent &&
      frameEvidence.sameOriginAccessible &&
      frameEvidence.documentLoaded &&
      !frameEvidence.canvasCount
    ) {
      issues.push(
        issue(
          "NO_CANVAS_SURFACE_FOUND",
          STATION_ID,
          "No canvas surface was found in the Audralia target frame."
        )
      );
    }

    if (
      frameEvidence.canvasCount > 0 &&
      frameEvidence.likelySurface &&
      frameEvidence.likelySurface.surface &&
      frameEvidence.likelySurface.surface.rectNonzero !== true
    ) {
      issues.push(
        issue(
          "SURFACE_RECT_NOT_NONZERO",
          STATION_ID,
          "A candidate surface exists, but its presentation rectangle is zero or unavailable."
        )
      );
    }

    var hasNonzeroSurface =
      Boolean(
        frameEvidence.likelySurface &&
        frameEvidence.likelySurface.surface &&
        frameEvidence.likelySurface.surface.rectNonzero === true &&
        frameEvidence.likelySurface.surface.backingStoreNonzero === true
      );

    var runtimeVisible =
      Boolean(
        requestEvidence &&
        (
          requestEvidence.requestClaimsSurfaceNonzero ||
          requestEvidence.requestClaimsVisiblePixel ||
          requestEvidence.requestTargetRuntimeEvidenceAvailable
        )
      );

    if (
      frameEvidence.framePresent &&
      frameEvidence.sameOriginAccessible &&
      frameEvidence.documentLoaded &&
      hasNonzeroSurface
    ) {
      return {
        status:
          "PASS",

        completed:
          true,

        handoffEligible:
          true,

        summary:
          "3D presentation host surface is present and nonzero for diagnostic observation.",

        issues:
          issues,

        evidenceClass:
          runtimeVisible
            ? "SURFACE_AND_RUNTIME_HINTS"
            : "SURFACE_ONLY"
      };
    }

    return {
      status:
        "HOLD",

      completed:
        false,

      handoffEligible:
        false,

      summary:
        issues.length
          ? "3D surface evidence is held pending a valid target host and nonzero presentation surface."
          : "3D surface evidence is held because runtime presentation proof is not admitted.",

      issues:
        issues.length
          ? issues
          : [
              issue(
                "SURFACE_EVIDENCE_NOT_ADMITTED",
                STATION_ID,
                "No sufficient non-mutating surface evidence was admitted."
              )
            ],

      evidenceClass:
        "HELD_SURFACE_EVIDENCE"
    };
  }

  function executeCycleStation(request) {
    var cycleId =
      request && request.cycleId
        ? String(request.cycleId)
        : "AUDRALIA_DIAGNOSTIC_CYCLE_UNKNOWN";

    var frameEvidence =
      inspectFrame();

    var requestEvidence =
      inspectRequestEvidence(request || {});

    var decision =
      determineStatus(
        frameEvidence,
        requestEvidence
      );

    var receipt = {
      schema:
        STATION_SCHEMA,

      cycleId:
        cycleId,

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
        decision.status,

      completed:
        decision.completed,

      handoffEligible:
        decision.handoffEligible,

      summary:
        decision.summary,

      observations: [
        {
          id:
            "SURFACE_FRAME_OBSERVATION",

          kind:
            "OBSERVED",

          framePresent:
            frameEvidence.framePresent,

          sameOriginAccessible:
            frameEvidence.sameOriginAccessible,

          documentLoaded:
            frameEvidence.documentLoaded,

          documentReadyState:
            frameEvidence.documentReadyState,

          canvasCount:
            frameEvidence.canvasCount
        },
        {
          id:
            "SURFACE_RUNTIME_HINTS",

          kind:
            "OBSERVED_OR_REQUEST_DERIVED",

          runtimeStatusAvailable:
            frameEvidence.runtimeStatusAvailable,

          requestRuntimeEvidenceAvailable:
            requestEvidence.requestRuntimeEvidenceAvailable,

          requestTargetRuntimeEvidenceAvailable:
            requestEvidence.requestTargetRuntimeEvidenceAvailable,

          requestClaimsSurfaceNonzero:
            requestEvidence.requestClaimsSurfaceNonzero,

          requestClaimsVisiblePixel:
            requestEvidence.requestClaimsVisiblePixel
        }
      ],

      evidence: [
        {
          id:
            "TARGET_FRAME_EVIDENCE",

          kind:
            "OBSERVED",

          value:
            frozenClone(frameEvidence)
        },
        {
          id:
            "REQUEST_SURFACE_EVIDENCE",

          kind:
            "REQUEST_DERIVED",

          value:
            frozenClone(requestEvidence)
        },
        {
          id:
            "SURFACE_EVIDENCE_CLASS",

          kind:
            "DERIVED",

          value:
            decision.evidenceClass
        }
      ],

      issues:
        frozenClone(decision.issues),

      firstHeldCoordinate:
        decision.status === "HOLD"
          ? STATION_ID
          : null,

      firstFailedCoordinate:
        null,

      firstConflictCoordinate:
        null,

      recommendedOwner:
        decision.status === "PASS"
          ? null
          : {
              ownerType:
                "DIAGNOSTIC_TARGET_SURFACE",

              subjectId:
                STATION_ID,

              contract:
                null,

              file:
                "/showroom/globe/audralia/index.html",

              component:
                "AUDRALIA_TARGET_3D_PRESENTATION_HOST"
            },

      generatedAt:
        nowIso(),

      noClaims:
        NO_CLAIMS,

      receiptHash:
        null
    };

    receipt.receiptHash =
      hashObject(receipt);

    return deepFreeze(receipt);
  }

  function getDefinitionReceipt() {
    return deepFreeze({
      receipt:
        DEFINITION_RECEIPT,

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

      quietLoad:
        true,

      dependencyFree:
        true,

      surfaceObservationAuthority:
        true,

      rendererAuthority:
        false,

      canvasAuthority:
        false,

      webGLAuthority:
        false,

      webGPUAuthority:
        false,

      repairAuthorizationAuthority:
        false,

      finalProductionVerdictAuthority:
        false,

      generatedAt:
        nowIso(),

      noClaims:
        NO_CLAIMS
    });
  }

  var INSTALLATION = {
    decision:
      "LOCAL_ONLY_NO_ROOT",

    reason:
      "ROOT_UNAVAILABLE",

    published:
      [],

    warnings:
      [],

    errors:
      [],

    installedAt:
      nowIso()
  };

  function getInstallationReceipt() {
    return deepFreeze({
      receipt:
        INSTALLATION_RECEIPT,

      contract:
        CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      decision:
        INSTALLATION.decision,

      reason:
        INSTALLATION.reason,

      published:
        frozenClone(INSTALLATION.published),

      warnings:
        frozenClone(INSTALLATION.warnings),

      errors:
        frozenClone(INSTALLATION.errors),

      installedAt:
        INSTALLATION.installedAt,

      noClaims:
        NO_CLAIMS
    });
  }

  function buildApi() {
    return deepFreeze({
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

      getInstallationReceipt:
        getInstallationReceipt,

      executeCycleStation:
        executeCycleStation,

      inspectFrame:
        inspectFrame,

      hash:
        hashObject,

      clone:
        clone,

      deepFreeze:
        deepFreeze,

      NO_CLAIMS:
        NO_CLAIMS
    });
  }

  function ensureNamespace(name) {
    if (!root || typeof root !== "object") {
      return null;
    }

    if (
      !root[name] ||
      typeof root[name] !== "object"
    ) {
      root[name] = {};
    }

    return root[name];
  }

  function publish() {
    if (!root || typeof root !== "object") {
      return;
    }

    var existing =
      root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT
    ) {
      INSTALLATION.decision =
        "CONFLICT";

      INSTALLATION.reason =
        "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY";

      INSTALLATION.errors.push(
        "PRIMARY_GLOBAL_CONFLICT"
      );

      return;
    }

    var api =
      buildApi();

    try {
      root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH =
        api;

      INSTALLATION.published.push(
        "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH"
      );

      var namespace =
        ensureNamespace("AUDRALIA");

      if (namespace) {
        if (
          !namespace.diagnostics ||
          typeof namespace.diagnostics !== "object"
        ) {
          namespace.diagnostics = {};
        }

        namespace.diagnostics.canvasSurfaceTruth =
          api;

        INSTALLATION.published.push(
          "AUDRALIA.diagnostics.canvasSurfaceTruth"
        );
      }

      root.__AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LOADED__ =
        true;

      INSTALLATION.published.push(
        "__AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LOADED__"
      );

      root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT =
        getDefinitionReceipt();

      INSTALLATION.published.push(
        "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT"
      );

      INSTALLATION.decision =
        existing
          ? "COMPATIBLE_EXISTING"
          : "NEW_INSTALLATION";

      INSTALLATION.reason =
        "PUBLISHED";
    } catch (error) {
      INSTALLATION.decision =
        "CONFLICT";

      INSTALLATION.reason =
        "PUBLICATION_FAILED";

      INSTALLATION.errors.push(
        error && error.message
          ? error.message
          : String(error)
      );
    }
  }

  publish();

  if (
    typeof module !== "undefined" &&
    module.exports
  ) {
    module.exports =
      root &&
      root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH
        ? root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH
        : buildApi();
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
