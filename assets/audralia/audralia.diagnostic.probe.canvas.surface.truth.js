// /assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js
// AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v2
// Full-file replacement.
// Diagnostic-only.
// Read-only.
// No production mutation.
// No renderer authority.
// No runtime restart authority.
// No repair authority.
// No readiness authority.
// No visual pass authority.
// No F21 authority.

(function registerAudraliaDiagnosticCanvasSurfaceTruth(global) {
  "use strict";

  var CONTRACT =
    "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v2";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v1";

  var VERSION =
    "2.0.0";

  var FILE =
    "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js";

  var STATION_ID =
    "CANVAS_SURFACE_TRUTH";

  var CYCLE_POSITION =
    4;

  var FIBONACCI =
    "F8";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var API_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_API_v1";

  var REGISTRATION_RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_REGISTRATION_RECEIPT_v1";

  var TARGET_ROUTE =
    "/showroom/globe/audralia/";

  var TARGET_FRAME_ID =
    "audraliaDiagnosticTargetFrame";

  var POLL_INTERVAL_MS =
    100;

  var POLL_TIMEOUT_MS =
    3200;

  var NO_CLAIMS = Object.freeze({
    engineAuthority: false,
    productionMutationAuthority: false,
    contractRewriteAuthority: false,
    routeMutationAuthority: false,
    rendererAuthority: false,
    runtimeAuthority: false,
    canvasAuthority: false,
    webGLAuthority: false,
    webGPUAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    diagnosticPassProvesReady: false,
    surfacePresenceProvesReadiness: false,
    iframePresenceProvesPresentation: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    f21Claimed: false,
    webGL: false,
    webGPU: false
  });

  function nowISO() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return null;
    }
  }

  function isObject(value) {
    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    );
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_) {
      return null;
    }
  }

  function stableStringify(value) {
    if (value === null) return "null";

    if (typeof value === "string") {
      return JSON.stringify(value);
    }

    if (typeof value === "number") {
      return Number.isFinite(value)
        ? String(value)
        : "null";
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    if (Array.isArray(value)) {
      return "[" + value.map(stableStringify).join(",") + "]";
    }

    if (isObject(value)) {
      return (
        "{" +
        Object.keys(value)
          .sort()
          .map(function encode(key) {
            return (
              JSON.stringify(key) +
              ":" +
              stableStringify(value[key])
            );
          })
          .join(",") +
        "}"
      );
    }

    return "null";
  }

  function hash(value) {
    var text =
      stableStringify(value);

    var h =
      0x811c9dc5;

    for (
      var i = 0;
      i < text.length;
      i += 1
    ) {
      h ^= text.charCodeAt(i);

      h +=
        (h << 1) +
        (h << 4) +
        (h << 7) +
        (h << 8) +
        (h << 24);

      h >>>= 0;
    }

    return (
      "fnv1a32:" +
      ("00000000" + h.toString(16)).slice(-8)
    );
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE")
    };
  }

  function observation(id, kind, payload) {
    return Object.assign(
      {
        id: id,
        kind: kind
      },
      payload || {}
    );
  }

  function getPath(root, path) {
    if (
      !isObject(root) ||
      !path
    ) {
      return null;
    }

    var parts =
      String(path).split(".");

    var cursor =
      root;

    for (
      var i = 0;
      i < parts.length;
      i += 1
    ) {
      if (
        cursor === null ||
        cursor === undefined
      ) {
        return null;
      }

      cursor =
        cursor[parts[i]];
    }

    return cursor === undefined
      ? null
      : cursor;
  }

  function firstObject() {
    for (
      var i = 0;
      i < arguments.length;
      i += 1
    ) {
      if (isObject(arguments[i])) {
        return arguments[i];
      }
    }

    return null;
  }

  function firstBoolean() {
    for (
      var i = 0;
      i < arguments.length;
      i += 1
    ) {
      if (typeof arguments[i] === "boolean") {
        return arguments[i];
      }
    }

    return null;
  }

  function firstString() {
    for (
      var i = 0;
      i < arguments.length;
      i += 1
    ) {
      if (
        typeof arguments[i] === "string" &&
        arguments[i].length
      ) {
        return arguments[i];
      }
    }

    return null;
  }

  function delay(ms) {
    return new Promise(function wait(resolve) {
      global.setTimeout(resolve, ms);
    });
  }

  function readLiveTargetFrame() {
    var doc =
      global.document || null;

    var frame =
      doc
        ? (
            doc.getElementById(TARGET_FRAME_ID) ||
            doc.querySelector('iframe[data-diagnostic-target="audralia"]') ||
            doc.querySelector('iframe[src="' + TARGET_ROUTE + '"]')
          )
        : null;

    var result = {
      framePresent: Boolean(frame),
      frameId: frame && frame.id ? frame.id : null,
      targetRoute: TARGET_ROUTE,
      sameOriginAccessible: false,
      documentLoaded: false,
      runtimeStatus: null,
      receiptLight: null,
      receipt: null,
      canvasPresent: false,
      runtimeGlobalPresent: false,
      readError: null,
      capturedAt: nowISO()
    };

    if (!frame) {
      return result;
    }

    try {
      var frameWindow =
        frame.contentWindow || null;

      var frameDocument =
        frame.contentDocument ||
        (
          frameWindow
            ? frameWindow.document
            : null
        );

      result.sameOriginAccessible =
        Boolean(frameDocument);

      result.documentLoaded =
        Boolean(
          frameDocument &&
          (
            frameDocument.readyState === "interactive" ||
            frameDocument.readyState === "complete"
          )
        );

      result.canvasPresent =
        Boolean(
          frameDocument &&
          (
            frameDocument.querySelector("canvas[data-audralia-planet-runtime-canvas]") ||
            frameDocument.querySelector("canvas[data-audralia-planet-fallback-canvas]") ||
            frameDocument.querySelector("canvas")
          )
        );

      var runtime =
        frameWindow &&
        (
          frameWindow.DGBAudraliaPlanetRuntime ||
          frameWindow.DGBAudraliaPlanetRenderer ||
          frameWindow.DGBAudraliaPlanetRoute
        );

      result.runtimeGlobalPresent =
        Boolean(runtime);

      if (
        runtime &&
        typeof runtime.getStatus === "function"
      ) {
        result.runtimeStatus =
          clone(runtime.getStatus());
      }

      if (
        runtime &&
        typeof runtime.getReceiptLight === "function"
      ) {
        result.receiptLight =
          clone(runtime.getReceiptLight());
      }

      if (
        runtime &&
        typeof runtime.getReceipt === "function"
      ) {
        result.receipt =
          clone(runtime.getReceipt());
      }
    } catch (error) {
      result.readError =
        error && error.message
          ? error.message
          : "TARGET_FRAME_READ_FAILED";
    }

    return result;
  }

  function extractPacketTarget(packet) {
    return firstObject(
      packet.target,
      packet.construct && packet.construct.target,
      packet.targetFrame,
      {}
    );
  }

  function extractRuntimeStatus(packet, liveFrame) {
    var target =
      extractPacketTarget(packet);

    return firstObject(
      liveFrame && liveFrame.runtimeStatus,
      liveFrame && liveFrame.receiptLight,
      liveFrame && liveFrame.receipt,
      target.targetRuntimeStatus,
      target.runtimeStatus,
      target.receiptLight,
      packet.targetRuntimeStatus,
      packet.runtimeStatus,
      packet.engineRuntime && packet.engineRuntime.targetRuntimeStatus,
      {}
    );
  }

  function evaluateSurface(packet, liveFrame) {
    var target =
      extractPacketTarget(packet);

    var runtimeStatus =
      extractRuntimeStatus(packet, liveFrame);

    var framePresent =
      firstBoolean(
        liveFrame && liveFrame.framePresent,
        target.framePresent
      );

    var sameOriginAccessible =
      firstBoolean(
        liveFrame && liveFrame.sameOriginAccessible,
        target.sameOriginAccessible
      );

    var documentLoaded =
      firstBoolean(
        liveFrame && liveFrame.documentLoaded,
        target.documentLoaded
      );

    var runtimeEvidenceAvailable =
      Boolean(
        isObject(runtimeStatus) &&
        Object.keys(runtimeStatus).length
      );

    var mounted =
      firstBoolean(
        runtimeStatus.mounted,
        runtimeStatus.statusDetail &&
          runtimeStatus.statusDetail.mounted
      );

    var stageRectNonzero =
      firstBoolean(
        runtimeStatus.stageRectNonzero,
        runtimeStatus.statusDetail &&
          runtimeStatus.statusDetail.stageRectNonzero
      );

    var geometryReady =
      firstBoolean(
        runtimeStatus.geometryReady,
        runtimeStatus.statusDetail &&
          runtimeStatus.statusDetail.geometryReady
      );

    var firstFrameDrawn =
      firstBoolean(
        runtimeStatus.firstFrameDrawn,
        runtimeStatus.firstFrameSubmitted,
        runtimeStatus.firstFramePresented,
        runtimeStatus.statusDetail &&
          runtimeStatus.statusDetail.firstFrameDrawn
      );

    var visiblePixelObserved =
      firstBoolean(
        runtimeStatus.firstVisiblePixelObserved,
        runtimeStatus.visiblePixelObserved,
        runtimeStatus.statusDetail &&
          runtimeStatus.statusDetail.firstVisiblePixelObserved
      );

    var fallbackActive =
      firstBoolean(
        runtimeStatus.fallbackActive,
        runtimeStatus.statusDetail &&
          runtimeStatus.statusDetail.fallbackActive
      );

    var webGL =
      firstBoolean(
        runtimeStatus.webGL,
        runtimeStatus.statusDetail &&
          runtimeStatus.statusDetail.webGL
      );

    var fallbackVisible =
      fallbackActive === true &&
      firstFrameDrawn === true &&
      visiblePixelObserved === true;

    var primaryVisible =
      mounted === true &&
      stageRectNonzero === true &&
      geometryReady === true &&
      firstFrameDrawn === true &&
      visiblePixelObserved === true;

    return {
      framePresent: framePresent,
      sameOriginAccessible: sameOriginAccessible,
      documentLoaded: documentLoaded,
      canvasPresent: liveFrame ? liveFrame.canvasPresent : null,
      runtimeGlobalPresent: liveFrame ? liveFrame.runtimeGlobalPresent : null,
      runtimeEvidenceAvailable: runtimeEvidenceAvailable,
      mounted: mounted,
      stageRectNonzero: stageRectNonzero,
      geometryReady: geometryReady,
      webGL: webGL,
      fallbackActive: fallbackActive,
      firstFrameDrawn: firstFrameDrawn,
      visiblePixelObserved: visiblePixelObserved,
      primaryVisible: primaryVisible,
      fallbackVisible: fallbackVisible,
      surfaceTruthAdmitted: primaryVisible || fallbackVisible,
      runtimeStatus: clone(runtimeStatus),
      liveFrame: clone(liveFrame)
    };
  }

  function surfaceReadyEnough(surface) {
    return Boolean(
      surface &&
      surface.surfaceTruthAdmitted === true
    );
  }

  function shouldContinuePolling(surface) {
    if (!surface) {
      return true;
    }

    if (surface.surfaceTruthAdmitted === true) {
      return false;
    }

    if (surface.framePresent !== true) {
      return true;
    }

    if (surface.sameOriginAccessible !== true) {
      return false;
    }

    if (surface.documentLoaded !== true) {
      return true;
    }

    if (surface.runtimeGlobalPresent !== true) {
      return true;
    }

    if (surface.runtimeEvidenceAvailable !== true) {
      return true;
    }

    if (surface.mounted !== true) {
      return true;
    }

    if (surface.stageRectNonzero !== true) {
      return true;
    }

    if (surface.geometryReady !== true) {
      return true;
    }

    if (surface.firstFrameDrawn !== true) {
      return true;
    }

    if (surface.visiblePixelObserved !== true) {
      return true;
    }

    return false;
  }

  function waitForSurface(packet) {
    var startedAt =
      Date.now();

    var attempts =
      [];

    function sample() {
      var liveFrame =
        readLiveTargetFrame();

      var surface =
        evaluateSurface(packet, liveFrame);

      attempts.push({
        attempt: attempts.length + 1,
        elapsedMs: Date.now() - startedAt,
        capturedAt: nowISO(),
        framePresent: surface.framePresent,
        sameOriginAccessible: surface.sameOriginAccessible,
        documentLoaded: surface.documentLoaded,
        canvasPresent: surface.canvasPresent,
        runtimeGlobalPresent: surface.runtimeGlobalPresent,
        runtimeEvidenceAvailable: surface.runtimeEvidenceAvailable,
        mounted: surface.mounted,
        stageRectNonzero: surface.stageRectNonzero,
        geometryReady: surface.geometryReady,
        firstFrameDrawn: surface.firstFrameDrawn,
        visiblePixelObserved: surface.visiblePixelObserved,
        surfaceTruthAdmitted: surface.surfaceTruthAdmitted
      });

      if (surfaceReadyEnough(surface)) {
        return Promise.resolve({
          liveFrame: liveFrame,
          surface: surface,
          attempts: attempts,
          waitCompleted: true,
          waitReason: "SURFACE_TRUTH_ADMITTED",
          elapsedMs: Date.now() - startedAt
        });
      }

      if (
        Date.now() - startedAt >= POLL_TIMEOUT_MS ||
        shouldContinuePolling(surface) !== true
      ) {
        return Promise.resolve({
          liveFrame: liveFrame,
          surface: surface,
          attempts: attempts,
          waitCompleted: false,
          waitReason:
            Date.now() - startedAt >= POLL_TIMEOUT_MS
              ? "POLL_TIMEOUT_REACHED"
              : "NON_RETRYABLE_SURFACE_STATE",
          elapsedMs: Date.now() - startedAt
        });
      }

      return delay(POLL_INTERVAL_MS).then(sample);
    }

    return sample();
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
      stationId: STATION_ID,
      fibonacci: FIBONACCI,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status: status,
      completed: completed,
      handoffEligible: handoffEligible,
      summary: summary,
      observations: observations || [],
      evidence: evidence || [],
      issues: issues || [],
      firstHeldCoordinate:
        status === "HOLD"
          ? "F8:CANVAS_SURFACE_TRUTH"
          : null,
      firstFailedCoordinate:
        status === "FAIL"
          ? "F8:CANVAS_SURFACE_TRUTH"
          : null,
      firstConflictCoordinate:
        status === "CONFLICT"
          ? "F8:CANVAS_SURFACE_TRUTH"
          : null,
      recommendedOwner: owner || {
        ownerType: "PUBLIC_AUDRALIA_RUNTIME",
        subjectId: "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME",
        contract: firstString(
          getPath(packet || {}, "construct.target.targetRuntimeStatus.contract"),
          getPath(packet || {}, "target.targetRuntimeStatus.contract"),
          null
        ),
        file: "/showroom/globe/audralia/index.js",
        component: "CANVAS_SURFACE_TRUTH"
      },
      generatedAt: nowISO(),
      noClaims: clone(NO_CLAIMS),
      receiptHash: null
    };

    receipt.receiptHash =
      hash(receipt);

    return receipt;
  }

  function buildReceiptFromWait(packet, waitResult) {
    var surface =
      waitResult.surface;

    var liveFrame =
      waitResult.liveFrame;

    var observations = [
      observation(
        "CANVAS_SURFACE_TARGET_FRAME",
        "OBSERVED",
        {
          framePresent: surface.framePresent,
          sameOriginAccessible: surface.sameOriginAccessible,
          documentLoaded: surface.documentLoaded,
          canvasPresent: surface.canvasPresent,
          runtimeGlobalPresent: surface.runtimeGlobalPresent,
          readError: liveFrame ? liveFrame.readError : null
        }
      ),

      observation(
        "CANVAS_SURFACE_RUNTIME_STATUS",
        "OBSERVED",
        {
          runtimeEvidenceAvailable: surface.runtimeEvidenceAvailable,
          mounted: surface.mounted,
          stageRectNonzero: surface.stageRectNonzero,
          geometryReady: surface.geometryReady,
          webGL: surface.webGL,
          fallbackActive: surface.fallbackActive,
          firstFrameDrawn: surface.firstFrameDrawn,
          visiblePixelObserved: surface.visiblePixelObserved
        }
      ),

      observation(
        "CANVAS_SURFACE_BOUNDED_WAIT",
        "DERIVED",
        {
          pollIntervalMs: POLL_INTERVAL_MS,
          pollTimeoutMs: POLL_TIMEOUT_MS,
          attemptCount: waitResult.attempts.length,
          elapsedMs: waitResult.elapsedMs,
          waitCompleted: waitResult.waitCompleted,
          waitReason: waitResult.waitReason,
          attempts: waitResult.attempts
        }
      ),

      observation(
        "CANVAS_SURFACE_TRUTH_CLASSIFICATION",
        "DERIVED",
        {
          primaryVisible: surface.primaryVisible,
          fallbackVisible: surface.fallbackVisible,
          surfaceTruthAdmitted: surface.surfaceTruthAdmitted,
          missingEvidenceDisposition: "HOLD",
          syntheticPositiveEvidenceAllowed: false
        }
      )
    ];

    var evidence = [
      {
        id: "CANVAS_SURFACE_REQUEST_HASH",
        kind: "DERIVED",
        hash: hash(packet)
      },
      {
        id: "CANVAS_SURFACE_LIVE_FRAME_HASH",
        kind: "DERIVED",
        hash: hash(liveFrame)
      },
      {
        id: "CANVAS_SURFACE_RUNTIME_STATUS_HASH",
        kind: "DERIVED",
        hash: hash(surface.runtimeStatus)
      },
      {
        id: "CANVAS_SURFACE_EVALUATION_HASH",
        kind: "DERIVED",
        hash: hash(surface)
      },
      {
        id: "CANVAS_SURFACE_WAIT_ATTEMPT_HASH",
        kind: "DERIVED",
        hash: hash(waitResult.attempts)
      }
    ];

    var issues = [];

    if (surface.framePresent !== true) {
      issues.push(
        issue(
          "TARGET_FRAME_NOT_PRESENT",
          "$.target.framePresent",
          "The Audralia diagnostic target iframe was not present."
        )
      );
    }

    if (surface.sameOriginAccessible !== true) {
      issues.push(
        issue(
          "TARGET_FRAME_NOT_ACCESSIBLE",
          "$.target.sameOriginAccessible",
          "The Audralia target frame was not same-origin accessible."
        )
      );
    }

    if (surface.documentLoaded !== true) {
      issues.push(
        issue(
          "TARGET_DOCUMENT_NOT_LOADED",
          "$.target.documentLoaded",
          "The Audralia target document was not loaded before the bounded F8 wait ended."
        )
      );
    }

    if (surface.runtimeEvidenceAvailable !== true) {
      issues.push(
        issue(
          "TARGET_RUNTIME_EVIDENCE_UNAVAILABLE",
          "$.target.targetRuntimeStatus",
          "No target runtime status, receipt, or live runtime status was available before the bounded F8 wait ended."
        )
      );
    }

    if (surface.mounted !== true) {
      issues.push(
        issue(
          "PUBLIC_RUNTIME_NOT_MOUNTED",
          "$.target.runtimeStatus.mounted",
          "The public Audralia runtime has not reported mounted=true."
        )
      );
    }

    if (surface.stageRectNonzero !== true) {
      issues.push(
        issue(
          "SURFACE_RECT_NONZERO_REQUIRED",
          "$.target.runtimeStatus.stageRectNonzero",
          "The public Audralia surface has not reported a nonzero rendering rectangle."
        )
      );
    }

    if (surface.geometryReady !== true) {
      issues.push(
        issue(
          "GEOMETRY_READY_REQUIRED",
          "$.target.runtimeStatus.geometryReady",
          "The public Audralia runtime has not reported geometryReady=true."
        )
      );
    }

    if (surface.firstFrameDrawn !== true) {
      issues.push(
        issue(
          "FIRST_FRAME_DRAWN_REQUIRED",
          "$.target.runtimeStatus.firstFrameDrawn",
          "The public Audralia runtime has not reported firstFrameDrawn=true."
        )
      );
    }

    if (surface.visiblePixelObserved !== true) {
      issues.push(
        issue(
          "VISIBLE_PIXEL_OBSERVED_REQUIRED",
          "$.target.runtimeStatus.firstVisiblePixelObserved",
          "The public Audralia runtime has not reported visible-pixel evidence."
        )
      );
    }

    var owner = {
      ownerType: "PUBLIC_AUDRALIA_RUNTIME",
      subjectId: "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME",
      contract: firstString(
        surface.runtimeStatus && surface.runtimeStatus.contract,
        "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_TNT_v1"
      ),
      file: "/showroom/globe/audralia/index.js",
      component: "CANVAS_SURFACE_TRUTH"
    };

    if (issues.length) {
      return createReceipt(
        "HOLD",
        false,
        false,
        "CANVAS_SURFACE_TRUTH_HELD_RUNTIME_SURFACE_EVIDENCE_INCOMPLETE",
        packet,
        observations,
        evidence.concat([
          {
            id: "CANVAS_SURFACE_VALIDATION",
            kind: "DERIVED",
            passed: false,
            issueCount: issues.length
          }
        ]),
        issues,
        owner
      );
    }

    return createReceipt(
      "PASS",
      true,
      true,
      "CANVAS_SURFACE_TRUTH_ADMITTED_VISIBLE_3D_SURFACE",
      packet,
      observations,
      evidence.concat([
        {
          id: "CANVAS_SURFACE_VALIDATION",
          kind: "DERIVED",
          passed: true,
          issueCount: 0
        }
      ]),
      [],
      owner
    );
  }

  function executeCycleStation(packet) {
    packet =
      packet || {};

    return waitForSurface(packet)
      .then(function afterWait(waitResult) {
        return buildReceiptFromWait(
          packet,
          waitResult
        );
      })
      .catch(function onProbeError(error) {
        return createReceipt(
          "HOLD",
          false,
          false,
          "CANVAS_SURFACE_TRUTH_HELD_PROBE_READ_ERROR",
          packet,
          [
            observation(
              "CANVAS_SURFACE_PROBE_ERROR",
              "ERROR",
              {
                message:
                  error && error.message
                    ? error.message
                    : String(error || "UNKNOWN_F8_PROBE_ERROR")
              }
            )
          ],
          [
            {
              id: "CANVAS_SURFACE_ERROR_HASH",
              kind: "DERIVED",
              hash: hash({
                message:
                  error && error.message
                    ? error.message
                    : String(error || "UNKNOWN_F8_PROBE_ERROR")
              })
            }
          ],
          [
            issue(
              "CANVAS_SURFACE_PROBE_READ_ERROR",
              "$.f8",
              error && error.message
                ? error.message
                : String(error || "UNKNOWN_F8_PROBE_ERROR")
            )
          ],
          {
            ownerType: "PUBLIC_AUDRALIA_RUNTIME",
            subjectId: "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME",
            contract: "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_TNT_v1",
            file: "/showroom/globe/audralia/index.js",
            component: "CANVAS_SURFACE_TRUTH"
          }
        );
      });
  }

  function getDefinitionReceipt() {
    return {
      schema: REGISTRATION_RECEIPT_SCHEMA,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      globalPath: "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      status: "AVAILABLE",
      boundedWait: {
        enabled: true,
        pollIntervalMs: POLL_INTERVAL_MS,
        pollTimeoutMs: POLL_TIMEOUT_MS
      },
      noClaims: clone(NO_CLAIMS),
      generatedAt: nowISO()
    };
  }

  var API = {
    schema: API_SCHEMA,

    STATION_ID: STATION_ID,
    CYCLE_POSITION: CYCLE_POSITION,
    FIBONACCI: FIBONACCI,
    CONTRACT: CONTRACT,
    PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
    VERSION: VERSION,
    FILE: FILE,

    stationId: STATION_ID,
    cyclePosition: CYCLE_POSITION,
    fibonacci: FIBONACCI,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,

    role: "CANVAS_SURFACE_TRUTH",

    executeCycleStation: executeCycleStation,
    execute: executeCycleStation,
    getDefinitionReceipt: getDefinitionReceipt,

    readLiveTargetFrame: readLiveTargetFrame,
    evaluateSurface: evaluateSurface
  };

  global.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = API;
  global.AUDRALIA_DIAGNOSTIC_CANVAS_SURFACE_TRUTH = API;
  global.AUDRALIA_DIAGNOSTIC_SURFACE_TRUTH = API;

  global.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT =
    getDefinitionReceipt();

})(window);
