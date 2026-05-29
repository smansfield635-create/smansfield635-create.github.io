// /assets/lab/runtime-table.south.js
// LAB_RUNTIME_TABLE_SOUTH_FINAL_PROTOCOL_FORWARD_PROGRESS_TNT_v1
// Full-file replacement.
// South / final protocol authority for the four-file Runtime Table split.
// Purpose:
// - Consume North Runtime Table checkpoint authority without replacing it.
// - Convert hard blocking into precise gap assessment where safe.
// - Preserve forward progress whenever the visible carrier is structurally safe.
// - Prevent false READY / false visual-pass claims.
// - Distinguish final completion from forward-with-gap continuation.
// - Provide postgame receipts for Hearth, Audralia, H-Earth, Earth reference, Showroom planets, and future planet bodies.
// Does not own:
// - planet truth
// - page truth
// - child channel truth
// - canvas drawing
// - atlas pixel painting
// - touch/drag controls
// - route orchestration
// - runtime motion
// - North checkpoint law
// - East sequence law
// - West diagnostic/control law
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_SOUTH_FINAL_PROTOCOL_FORWARD_PROGRESS_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_SOUTH_FINAL_PROTOCOL_FORWARD_PROGRESS_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_FOUR_FILE_SPLIT_WEST_DIAGNOSTIC_PROTOCOL_TNT_v1";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_FOUR_FILE_SPLIT_SOUTH_FINAL_PROTOCOL_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.lab-runtime-table-south-final-protocol-forward-progress-v1";

  const root = typeof window !== "undefined" ? window : globalThis;

  const SOUTH_STATUS = Object.freeze({
    FINAL_PASS: "FINAL_PASS",
    FORWARD_WITH_GAP: "FORWARD_WITH_GAP",
    SOFT_HOLD: "SOFT_HOLD",
    HARD_BLOCK: "HARD_BLOCK",
    DEGRADED: "DEGRADED",
    FALLBACK: "FALLBACK"
  });

  const FINAL_CLAIM = Object.freeze({
    ALLOWED: "ALLOWED",
    FORBIDDEN_PENDING_GAP: "FORBIDDEN_PENDING_GAP",
    FORBIDDEN_HARD_BLOCK: "FORBIDDEN_HARD_BLOCK"
  });

  const FORWARD_MODE = Object.freeze({
    POSTGAME_COMPLETE: "POSTGAME_COMPLETE",
    CONTINUE_TO_INSPECT: "CONTINUE_TO_INSPECT",
    CONTINUE_TO_VISIBLE_PROOF: "CONTINUE_TO_VISIBLE_PROOF",
    CONTINUE_TO_DIAGNOSTIC_REPAIR: "CONTINUE_TO_DIAGNOSTIC_REPAIR",
    CONTINUE_WITH_FALLBACK_CARRIER: "CONTINUE_WITH_FALLBACK_CARRIER",
    STOP_FOR_STRUCTURAL_BLOCK: "STOP_FOR_STRUCTURAL_BLOCK"
  });

  const GAP_SEVERITY = Object.freeze({
    INFO: "INFO",
    SOFT: "SOFT",
    DEGRADED: "DEGRADED",
    HARD: "HARD"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    F21: "F21"
  });

  const FIBONACCI_FINAL = Object.freeze({
    F13_VISIBLE_CONTENT_PROOF: 13,
    F13_INSPECT_MODE: 13,
    F21_COMPLETION: 21,
    FINAL_DENOMINATOR: 47
  });

  const F13_REQUIRED = Object.freeze([
    "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
    "F13B_CANVAS_MOUNT_CREATED",
    "F13C_CANVAS_CONTEXT_READY",
    "F13D_DRAG_INSPECTION_BOUND",
    "F13E_ATLAS_BUILD_STARTED",
    "F13F_ATLAS_BUILD_COMPLETE",
    "F13G_TEXTURE_COMPOSE_STARTED",
    "F13H_TEXTURE_COMPOSE_COMPLETE",
    "F13I_FIRST_FRAME_REQUESTED",
    "F13J_FIRST_FRAME_DETECTED",
    "F13K_CANVAS_READY",
    "F13L_VISIBLE_CONTENT_PROOF_STARTED",
    "F13M_VISIBLE_CONTENT_PROOF_PASSED",
    "F13N_INSPECT_MODE_READY"
  ]);

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null || value === "") return [];
    if (typeof value === "string" && value.includes(",")) {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [value];
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true" || normalized === "yes" || normalized === "1") return true;
      if (normalized === "false" || normalized === "no" || normalized === "0" || normalized === "") return false;
    }
    return fallback;
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function parseReceiptText(text = "") {
    const output = {};

    String(text || "").split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("- ") || !trimmed.includes("=")) return;

      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();

      if (!key) return;
      output[key] = value;
    });

    return output;
  }

  function normalizeInput(input = {}) {
    if (typeof input === "string") return parseReceiptText(input);
    if (!input || !isObject(input)) return {};
    return clonePlain(input);
  }

  function getFirst(packet, keys, fallback = undefined) {
    const source = packet || {};

    for (const key of asArray(keys)) {
      if (source[key] !== undefined) return source[key];
      if (source.snapshot && source.snapshot[key] !== undefined) return source.snapshot[key];
      if (source.detail && source.detail[key] !== undefined) return source.detail[key];
      if (source.receipt && source.receipt[key] !== undefined) return source.receipt[key];
      if (source.checkpointReceipt && source.checkpointReceipt[key] !== undefined) return source.checkpointReceipt[key];
      if (source.checkpointSessionReceipt && source.checkpointSessionReceipt[key] !== undefined) return source.checkpointSessionReceipt[key];
    }

    return fallback;
  }

  function getBool(packet, keys, fallback = false) {
    return safeBool(getFirst(packet, keys, fallback), fallback);
  }

  function getNumber(packet, keys, fallback = 0) {
    return safeNumber(getFirst(packet, keys, fallback), fallback);
  }

  function createGap(code, message, severity, detail = {}) {
    return {
      code,
      message,
      severity,
      detail: clonePlain(detail),
      at: nowIso()
    };
  }

  function resolveNorth() {
    return (
      root.LAB_RUNTIME_TABLE ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null
    );
  }

  function evaluateNewsGateState(input = {}) {
    const packet = normalizeInput(input);

    const northGateReady = Boolean(
      getBool(packet, "northGateReady") ||
      (
        getBool(packet, "canvasReady") &&
        getBool(packet, "atlasBuildComplete") &&
        getBool(packet, "textureComposeComplete") &&
        getBool(packet, "visibleContentProof") &&
        getBool(packet, "visiblePlanetAvailable")
      )
    );

    const eastGateReady = Boolean(
      getBool(packet, "eastGateReady") ||
      (
        getBool(packet, "cooperativeBootUsed") &&
        getBool(packet, "canvasCarrierRequested") &&
        getBool(packet, "canvasCarrierHandoffOk") &&
        !getBool(packet, "syncBootFallbackUsed")
      )
    );

    const westGateReady = Boolean(
      getBool(packet, "westGateReady") ||
      (
        getBool(packet, "copyDiagnosticPreserved") &&
        getBool(packet, "receiptToggleReady") &&
        getBool(packet, "diagnosticDockRestorable") &&
        getBool(packet, "receiptOverlayIndependent", true) &&
        (
          getBool(packet, "inspectModeAvailable") ||
          getBool(packet, "inspectPlanetControlAvailable") ||
          getBool(packet, "diagnosticCanLeavePlanetFrame")
        )
      )
    );

    const southGateReady = Boolean(
      getBool(packet, "southGateReady") ||
      (
        getBool(packet, "imageRendered") &&
        getBool(packet, "firstFrameDetected") &&
        getBool(packet, "dragInspectionBound") &&
        getBool(packet, "visiblePlanetAvailable")
      )
    );

    const newsGatePassedBeforeF21 = Boolean(
      getBool(packet, "newsGatePassedBeforeF21") ||
      (
        northGateReady &&
        eastGateReady &&
        westGateReady &&
        southGateReady
      )
    );

    return {
      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      newsGatePassedBeforeF21
    };
  }

  function completedCheckpointSet(input = {}) {
    const packet = normalizeInput(input);
    const raw = getFirst(packet, "completedCheckpoints", []);
    return new Set(asArray(raw));
  }

  function evaluateFibonacciState(input = {}) {
    const packet = normalizeInput(input);
    const completed = completedCheckpointSet(packet);

    const f13Completed = F13_REQUIRED.filter((checkpoint) => completed.has(checkpoint));
    const f13CompletionRatio = F13_REQUIRED.length
      ? f13Completed.length / F13_REQUIRED.length
      : 0;

    const f13MComplete = completed.has("F13M_VISIBLE_CONTENT_PROOF_PASSED") || getBool(packet, "visibleContentProof");
    const f13NComplete = completed.has("F13N_INSPECT_MODE_READY") || getBool(packet, "inspectModeAvailable");
    const f21Complete = completed.has("F21_COMPLETION_LATCHED") || getBool(packet, "completionLatched");

    const news = evaluateNewsGateState(packet);
    const f21Allowed = Boolean(
      getBool(packet, "f21Allowed") ||
      (
        f13MComplete &&
        f13NComplete &&
        news.newsGatePassedBeforeF21
      )
    );

    const finalNumerator =
      (f13MComplete ? FIBONACCI_FINAL.F13_VISIBLE_CONTENT_PROOF : 0) +
      (f13NComplete ? FIBONACCI_FINAL.F13_INSPECT_MODE : 0) +
      (news.newsGatePassedBeforeF21 ? FIBONACCI_FINAL.F21_COMPLETION : 0);

    const finalFibonacciRatio = finalNumerator / FIBONACCI_FINAL.FINAL_DENOMINATOR;

    return {
      fibonacciSequenceActive: getBool(packet, "fibonacciSequenceActive", true),
      f13RequiredCount: F13_REQUIRED.length,
      f13CompletedCount: f13Completed.length,
      f13CompletionRatio,
      f13MComplete,
      f13NComplete,
      f21Complete,
      f21Allowed,
      f21AfterF13N: Boolean(f21Complete && f13NComplete),
      finalNumerator,
      finalDenominator: FIBONACCI_FINAL.FINAL_DENOMINATOR,
      finalFibonacciRatio,
      equation: "F21_ALLOWED = F13M_VISIBLE_CONTENT_PROOF_PASSED ∧ F13N_INSPECT_MODE_READY ∧ (NORTH ∧ EAST ∧ WEST ∧ SOUTH)"
    };
  }

  function evaluateHardBlocks(input = {}) {
    const packet = normalizeInput(input);
    const gaps = [];

    const routeMounted = getBool(packet, "routeMounted", true);
    const canvasCarrierMounted = getBool(packet, "canvasCarrierMounted", getBool(packet, "planetCanvasPresent"));
    const planetCanvasPresent = getBool(packet, "planetCanvasPresent", canvasCarrierMounted);
    const planetCanvasNonZeroSize = getBool(packet, "planetCanvasNonZeroSize", true);
    const canvasCarrierHandoffOk = getBool(packet, "canvasCarrierHandoffOk", true);
    const canvasCarrierHandoffError = String(getFirst(packet, "canvasCarrierHandoffError", "") || "");
    const generatedImage = getBool(packet, "generatedImage", false);
    const graphicBox = getBool(packet, "graphicBox", false);

    if (!routeMounted) {
      gaps.push(createGap(
        "ROUTE_NOT_MOUNTED",
        "Route mount is unavailable. South cannot authorize forward visible progress.",
        GAP_SEVERITY.HARD,
        { routeMounted }
      ));
    }

    if (!canvasCarrierMounted || !planetCanvasPresent) {
      gaps.push(createGap(
        "CANVAS_CARRIER_MISSING",
        "Canvas carrier is missing. Forward progress would become a false visual state.",
        GAP_SEVERITY.HARD,
        { canvasCarrierMounted, planetCanvasPresent }
      ));
    }

    if (!planetCanvasNonZeroSize) {
      gaps.push(createGap(
        "CANVAS_ZERO_SIZE",
        "Planet canvas exists but has zero size.",
        GAP_SEVERITY.HARD,
        { planetCanvasNonZeroSize }
      ));
    }

    if (!canvasCarrierHandoffOk && canvasCarrierHandoffError) {
      gaps.push(createGap(
        "CANVAS_HANDOFF_ERROR",
        "Canvas carrier handoff reported an error.",
        GAP_SEVERITY.HARD,
        { canvasCarrierHandoffOk, canvasCarrierHandoffError }
      ));
    }

    if (generatedImage || graphicBox) {
      gaps.push(createGap(
        "FORBIDDEN_VISUAL_SOURCE",
        "Generated image or GraphicBox source is forbidden for this runtime path.",
        GAP_SEVERITY.HARD,
        { generatedImage, graphicBox }
      ));
    }

    return gaps;
  }

  function evaluateSoftGaps(input = {}) {
    const packet = normalizeInput(input);
    const gaps = [];
    const news = evaluateNewsGateState(packet);
    const fib = evaluateFibonacciState(packet);

    const canvasReady = getBool(packet, "canvasReady");
    const firstFrameDetected = getBool(packet, "firstFrameDetected");
    const imageRendered = getBool(packet, "imageRendered");
    const visibleContentProof = getBool(packet, "visibleContentProof");
    const visiblePlanetAvailable = getBool(packet, "visiblePlanetAvailable");
    const carrierOnlyDetected = getBool(packet, "carrierOnlyDetected");
    const inspectModeAvailable = getBool(packet, "inspectModeAvailable");
    const diagnosticCanLeavePlanetFrame = getBool(packet, "diagnosticCanLeavePlanetFrame");
    const buttonsReachable = getBool(packet, "buttonsReachable");
    const completionLatched = getBool(packet, "completionLatched");

    if (!canvasReady) {
      gaps.push(createGap(
        "CANVAS_READY_PENDING",
        "Canvas is not ready yet. Forward progress may continue only as loading/diagnostic shell.",
        GAP_SEVERITY.SOFT,
        { canvasReady }
      ));
    }

    if (!firstFrameDetected || !imageRendered) {
      gaps.push(createGap(
        "FIRST_FRAME_PENDING",
        "First visible frame has not been fully proven.",
        GAP_SEVERITY.SOFT,
        { firstFrameDetected, imageRendered }
      ));
    }

    if (!visibleContentProof) {
      gaps.push(createGap(
        "VISIBLE_CONTENT_PROOF_PENDING",
        "Visible content proof has not passed. This blocks final claim but should not erase the visible carrier.",
        GAP_SEVERITY.SOFT,
        {
          visibleContentProof,
          visibleContentProofError: getFirst(packet, "visibleContentProofError", ""),
          visibleContentSampleCount: getNumber(packet, "visibleContentSampleCount"),
          visibleContentClassCount: getNumber(packet, "visibleContentClassCount"),
          visibleContentLandSampleCount: getNumber(packet, "visibleContentLandSampleCount"),
          visibleContentWaterSampleCount: getNumber(packet, "visibleContentWaterSampleCount")
        }
      ));
    }

    if (carrierOnlyDetected) {
      gaps.push(createGap(
        "CARRIER_DOMINANCE_GAP",
        "Carrier-only or insufficient content sample was detected. Treat as a visible-content gap, not a structural stop.",
        GAP_SEVERITY.DEGRADED,
        { carrierOnlyDetected }
      ));
    }

    if (!visiblePlanetAvailable) {
      gaps.push(createGap(
        "VISIBLE_PLANET_AVAILABLE_PENDING",
        "Planet canvas is present but final visible-planet availability has not passed.",
        GAP_SEVERITY.SOFT,
        { visiblePlanetAvailable }
      ));
    }

    if (!inspectModeAvailable) {
      gaps.push(createGap(
        "INSPECT_MODE_PENDING",
        "Inspect mode is pending. Continue forward into inspect repair instead of blocking the whole route.",
        GAP_SEVERITY.SOFT,
        { inspectModeAvailable }
      ));
    }

    if (!diagnosticCanLeavePlanetFrame) {
      gaps.push(createGap(
        "DIAGNOSTIC_FRAME_EXIT_PENDING",
        "Diagnostic cockpit cannot yet leave the planet frame.",
        GAP_SEVERITY.SOFT,
        { diagnosticCanLeavePlanetFrame }
      ));
    }

    if (!buttonsReachable) {
      gaps.push(createGap(
        "BUTTONS_REACHABLE_PENDING",
        "Diagnostic controls are not fully reachable.",
        GAP_SEVERITY.SOFT,
        { buttonsReachable }
      ));
    }

    if (!news.northGateReady) {
      gaps.push(createGap(
        "NEWS_NORTH_PENDING",
        "North gate is pending.",
        GAP_SEVERITY.SOFT,
        { northGateReady: news.northGateReady }
      ));
    }

    if (!news.eastGateReady) {
      gaps.push(createGap(
        "NEWS_EAST_PENDING",
        "East gate is pending.",
        GAP_SEVERITY.SOFT,
        { eastGateReady: news.eastGateReady }
      ));
    }

    if (!news.westGateReady) {
      gaps.push(createGap(
        "NEWS_WEST_PENDING",
        "West gate is pending.",
        GAP_SEVERITY.SOFT,
        { westGateReady: news.westGateReady }
      ));
    }

    if (!news.southGateReady) {
      gaps.push(createGap(
        "NEWS_SOUTH_PENDING",
        "South gate is pending.",
        GAP_SEVERITY.SOFT,
        { southGateReady: news.southGateReady }
      ));
    }

    if (!fib.f21Allowed) {
      gaps.push(createGap(
        "F21_ADMISSIBILITY_PENDING",
        "F21 completion is not admissible until F13M, F13N, and NEWS gates pass.",
        GAP_SEVERITY.SOFT,
        {
          f13MComplete: fib.f13MComplete,
          f13NComplete: fib.f13NComplete,
          newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
          equation: fib.equation
        }
      ));
    }

    if (!completionLatched) {
      gaps.push(createGap(
        "COMPLETION_LATCH_PENDING",
        "Completion latch has not been lawfully reached.",
        GAP_SEVERITY.SOFT,
        { completionLatched }
      ));
    }

    return gaps;
  }

  function chooseFirstGap(hardGaps, softGaps) {
    if (hardGaps.length) return hardGaps[0];
    if (softGaps.length) return softGaps[0];
    return null;
  }

  function chooseForwardMode(packet, hardGaps, softGaps, finalPass) {
    if (hardGaps.length) return FORWARD_MODE.STOP_FOR_STRUCTURAL_BLOCK;
    if (finalPass) return FORWARD_MODE.POSTGAME_COMPLETE;

    const codes = new Set(softGaps.map((gap) => gap.code));

    if (codes.has("VISIBLE_CONTENT_PROOF_PENDING") || codes.has("CARRIER_DOMINANCE_GAP")) {
      return FORWARD_MODE.CONTINUE_TO_VISIBLE_PROOF;
    }

    if (
      codes.has("INSPECT_MODE_PENDING") ||
      codes.has("DIAGNOSTIC_FRAME_EXIT_PENDING") ||
      codes.has("BUTTONS_REACHABLE_PENDING")
    ) {
      return FORWARD_MODE.CONTINUE_TO_INSPECT;
    }

    if (
      codes.has("NEWS_NORTH_PENDING") ||
      codes.has("NEWS_EAST_PENDING") ||
      codes.has("NEWS_WEST_PENDING") ||
      codes.has("NEWS_SOUTH_PENDING") ||
      codes.has("F21_ADMISSIBILITY_PENDING") ||
      codes.has("COMPLETION_LATCH_PENDING")
    ) {
      return FORWARD_MODE.CONTINUE_TO_DIAGNOSTIC_REPAIR;
    }

    if (
      getBool(packet, "canvasCarrierMounted") ||
      getBool(packet, "planetCanvasPresent") ||
      getBool(packet, "fallbackShellAvailable", true)
    ) {
      return FORWARD_MODE.CONTINUE_WITH_FALLBACK_CARRIER;
    }

    return FORWARD_MODE.CONTINUE_TO_DIAGNOSTIC_REPAIR;
  }

  function chooseRenewalTarget(firstGap, packet = {}) {
    if (!firstGap) return "read-postgame-canvas-or-triple-g-receipt";

    switch (firstGap.code) {
      case "ROUTE_NOT_MOUNTED":
        return "/showroom/globe/hearth/index.js";

      case "CANVAS_CARRIER_MISSING":
      case "CANVAS_ZERO_SIZE":
      case "CANVAS_HANDOFF_ERROR":
      case "CANVAS_READY_PENDING":
      case "FIRST_FRAME_PENDING":
        return "/assets/hearth/hearth.canvas.js";

      case "VISIBLE_CONTENT_PROOF_PENDING":
      case "CARRIER_DOMINANCE_GAP":
      case "VISIBLE_PLANET_AVAILABLE_PENDING":
      case "INSPECT_MODE_PENDING":
      case "DIAGNOSTIC_FRAME_EXIT_PENDING":
      case "BUTTONS_REACHABLE_PENDING":
      case "NEWS_WEST_PENDING":
      case "NEWS_SOUTH_PENDING":
      case "F21_ADMISSIBILITY_PENDING":
      case "COMPLETION_LATCH_PENDING":
        return getFirst(packet, "file", "/showroom/globe/hearth/hearth.js");

      case "NEWS_NORTH_PENDING":
        return "/assets/lab/runtime-table.js";

      case "NEWS_EAST_PENDING":
        return "/assets/lab/runtime-table.east.js";

      default:
        return getFirst(packet, "file", "/showroom/globe/hearth/hearth.js");
    }
  }

  function evaluateSouthFinalProtocol(input = {}, options = {}) {
    const packet = normalizeInput(input);
    const news = evaluateNewsGateState(packet);
    const fib = evaluateFibonacciState(packet);
    const hardGaps = evaluateHardBlocks(packet);
    const softGaps = evaluateSoftGaps(packet);

    const visualCarrierStructurallySafe = hardGaps.length === 0;
    const visibleCarrierCanContinue = Boolean(
      visualCarrierStructurallySafe &&
      (
        getBool(packet, "canvasCarrierMounted") ||
        getBool(packet, "planetCanvasPresent") ||
        getBool(packet, "fallbackShellAvailable", true)
      )
    );

    const finalPass = Boolean(
      visualCarrierStructurallySafe &&
      getBool(packet, "visibleContentProof") &&
      getBool(packet, "visiblePlanetAvailable") &&
      getBool(packet, "inspectModeAvailable") &&
      getBool(packet, "diagnosticCanLeavePlanetFrame") &&
      getBool(packet, "buttonsReachable") &&
      fib.f21Allowed &&
      getBool(packet, "completionLatched")
    );

    const firstGap = chooseFirstGap(hardGaps, softGaps);
    const forwardMode = chooseForwardMode(packet, hardGaps, softGaps, finalPass);

    let southStatus = SOUTH_STATUS.FORWARD_WITH_GAP;
    if (hardGaps.length) southStatus = SOUTH_STATUS.HARD_BLOCK;
    else if (finalPass) southStatus = SOUTH_STATUS.FINAL_PASS;
    else if (softGaps.some((gap) => gap.severity === GAP_SEVERITY.DEGRADED)) southStatus = SOUTH_STATUS.DEGRADED;
    else if (!visibleCarrierCanContinue) southStatus = SOUTH_STATUS.FALLBACK;
    else southStatus = SOUTH_STATUS.FORWARD_WITH_GAP;

    const finalClaimStatus = finalPass
      ? FINAL_CLAIM.ALLOWED
      : hardGaps.length
        ? FINAL_CLAIM.FORBIDDEN_HARD_BLOCK
        : FINAL_CLAIM.FORBIDDEN_PENDING_GAP;

    const forwardProgressAllowed = Boolean(
      finalPass ||
      (
        hardGaps.length === 0 &&
        visibleCarrierCanContinue
      )
    );

    const progressCap = finalPass ? 100 : 98;
    const displayProgress = finalPass
      ? 100
      : Math.min(98, Math.max(0, getNumber(packet, ["mainDisplayProgress", "visibleProgress"], 98)));

    const firstFailedCoordinate = finalPass
      ? "NONE_SOUTH_FINAL_PROTOCOL_PASSED"
      : firstGap
        ? `WAITING_${firstGap.code}`
        : "WAITING_UNKNOWN_GAP";

    const recommendedNextRenewalTarget = finalPass
      ? "read-postgame-canvas-or-triple-g-receipt"
      : chooseRenewalTarget(firstGap, packet);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-south-final-protocol-forward-progress",
      planetId: getFirst(packet, "planetId", options.planetId || ""),
      planetLabel: getFirst(packet, "planetLabel", options.planetLabel || ""),
      route: getFirst(packet, "route", options.route || ""),

      southProtocolActive: true,
      southStatus,
      forwardMode,
      forwardProgressAllowed,
      visibleCarrierStructurallySafe,
      visibleCarrierCanContinue,
      finalClaimStatus,
      finalPass,
      finalVisualPassClaimAllowed: finalPass,
      visualPassClaimed: false,

      progressCap,
      mainProgressCap: progressCap,
      displayProgress,
      readyTextAllowed: finalPass,

      newsGateState: clonePlain(news),
      northGateReady: news.northGateReady,
      eastGateReady: news.eastGateReady,
      westGateReady: news.westGateReady,
      southGateReady: news.southGateReady,
      newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,

      fibonacciState: clonePlain(fib),
      fibonacciSequenceActive: fib.fibonacciSequenceActive,
      f13CompletionRatio: fib.f13CompletionRatio,
      f13CompletedCount: fib.f13CompletedCount,
      f13RequiredCount: fib.f13RequiredCount,
      f13MComplete: fib.f13MComplete,
      f13NComplete: fib.f13NComplete,
      f21Allowed: fib.f21Allowed,
      f21AfterF13N: fib.f21AfterF13N,
      finalFibonacciRatio: fib.finalFibonacciRatio,
      finalFibonacciEquation: fib.equation,

      hardGaps,
      softGaps,
      gapCount: hardGaps.length + softGaps.length,
      hardGapCount: hardGaps.length,
      softGapCount: softGaps.length,
      firstGap: clonePlain(firstGap),
      firstFailedCoordinate,
      recommendedNextRenewalTarget,

      sourceContract: getFirst(packet, "contract", ""),
      sourceReceipt: getFirst(packet, "receipt", ""),
      sourceFile: getFirst(packet, "file", ""),
      activeCheckpointId: getFirst(packet, "activeCheckpointId", ""),
      activeCheckpointRank: getNumber(packet, "activeCheckpointRank"),
      activeFibonacciStage: getFirst(packet, "activeFibonacciStage", ""),
      highestCompletedCheckpointId: getFirst(packet, "highestCompletedCheckpointId", ""),
      highestCompletedRank: getNumber(packet, "highestCompletedRank"),
      completionLatched: getBool(packet, "completionLatched"),

      visibleContentProof: getBool(packet, "visibleContentProof"),
      carrierOnlyDetected: getBool(packet, "carrierOnlyDetected"),
      visiblePlanetAvailable: getBool(packet, "visiblePlanetAvailable"),
      inspectModeAvailable: getBool(packet, "inspectModeAvailable"),
      diagnosticCanLeavePlanetFrame: getBool(packet, "diagnosticCanLeavePlanetFrame"),
      buttonsReachable: getBool(packet, "buttonsReachable"),

      quickGapAssessment: true,
      hardBlockOnlyForStructuralUnsafeCarrier: true,
      softGapsDoNotEraseVisualization: true,
      forwardProgressBeatsPrematureBlocking: true,
      readyTextRequiresCompletionLatch: true,
      completionRequiresF13MF13NNewsAndLatch: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      updatedAt: nowIso()
    };
  }

  function createSouthSession(options = {}) {
    const sessionId = options.id || `${options.planetId || "planet"}-south-final-protocol-${Math.random().toString(36).slice(2, 9)}`;

    const state = {
      sessionId,
      contract: CONTRACT,
      receipt: RECEIPT,
      planetId: options.planetId || "",
      planetLabel: options.planetLabel || "",
      route: options.route || "",
      evaluations: [],
      lastEvaluation: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    function ingest(input = {}) {
      const report = evaluateSouthFinalProtocol(input, {
        planetId: state.planetId,
        planetLabel: state.planetLabel,
        route: state.route
      });

      state.evaluations.push(report);
      if (state.evaluations.length > 80) state.evaluations.splice(0, state.evaluations.length - 80);

      state.lastEvaluation = report;
      state.updatedAt = nowIso();

      return report;
    }

    function getLastEvaluation() {
      return clonePlain(state.lastEvaluation);
    }

    function reset() {
      state.evaluations = [];
      state.lastEvaluation = null;
      state.updatedAt = nowIso();
      return getReceipt();
    }

    function getReceipt() {
      const last = state.lastEvaluation || null;

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        southSessionContract: "LAB_RUNTIME_TABLE_SOUTH_FINAL_PROTOCOL_SESSION_v1",
        southSessionReceipt: "LAB_RUNTIME_TABLE_SOUTH_FINAL_PROTOCOL_SESSION_RECEIPT_v1",
        sessionId: state.sessionId,
        planetId: state.planetId,
        planetLabel: state.planetLabel,
        route: state.route,
        southProtocolActive: true,
        evaluationCount: state.evaluations.length,
        lastSouthStatus: last ? last.southStatus : "NO_EVALUATION",
        lastForwardMode: last ? last.forwardMode : "",
        lastForwardProgressAllowed: last ? last.forwardProgressAllowed : false,
        lastFinalPass: last ? last.finalPass : false,
        lastFinalClaimStatus: last ? last.finalClaimStatus : "",
        lastFirstFailedCoordinate: last ? last.firstFailedCoordinate : "",
        lastRecommendedNextRenewalTarget: last ? last.recommendedNextRenewalTarget : "",
        hardBlockOnlyForStructuralUnsafeCarrier: true,
        softGapsDoNotEraseVisualization: true,
        quickGapAssessment: true,
        forwardProgressBeatsPrematureBlocking: true,
        visualPassClaimed: false,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt
      };
    }

    function getReceiptText() {
      const receipt = getReceipt();
      const last = state.lastEvaluation || {};

      const hardGaps = asArray(last.hardGaps).map((gap) => (
        `- ${gap.code}: severity=${gap.severity}; ${gap.message}`
      )).join("\n") || "- none";

      const softGaps = asArray(last.softGaps).map((gap) => (
        `- ${gap.code}: severity=${gap.severity}; ${gap.message}`
      )).join("\n") || "- none";

      return [
        "LAB_RUNTIME_TABLE_SOUTH_FINAL_PROTOCOL_SESSION_RECEIPT",
        "",
        `contract=${receipt.contract}`,
        `receipt=${receipt.receipt}`,
        `sessionId=${receipt.sessionId}`,
        `planetId=${receipt.planetId}`,
        `route=${receipt.route}`,
        "",
        `southProtocolActive=${receipt.southProtocolActive}`,
        `evaluationCount=${receipt.evaluationCount}`,
        `lastSouthStatus=${receipt.lastSouthStatus}`,
        `lastForwardMode=${receipt.lastForwardMode}`,
        `lastForwardProgressAllowed=${receipt.lastForwardProgressAllowed}`,
        `lastFinalPass=${receipt.lastFinalPass}`,
        `lastFinalClaimStatus=${receipt.lastFinalClaimStatus}`,
        "",
        `lastFirstFailedCoordinate=${receipt.lastFirstFailedCoordinate}`,
        `lastRecommendedNextRenewalTarget=${receipt.lastRecommendedNextRenewalTarget}`,
        "",
        `hardBlockOnlyForStructuralUnsafeCarrier=${receipt.hardBlockOnlyForStructuralUnsafeCarrier}`,
        `softGapsDoNotEraseVisualization=${receipt.softGapsDoNotEraseVisualization}`,
        `quickGapAssessment=${receipt.quickGapAssessment}`,
        `forwardProgressBeatsPrematureBlocking=${receipt.forwardProgressBeatsPrematureBlocking}`,
        "",
        "HARD_GAPS",
        hardGaps,
        "",
        "SOFT_GAPS",
        softGaps,
        "",
        `generatedImage=${receipt.generatedImage}`,
        `graphicBox=${receipt.graphicBox}`,
        `webGL=${receipt.webGL}`,
        `visualPassClaimed=${receipt.visualPassClaimed}`,
        "",
        `updatedAt=${receipt.updatedAt}`
      ].join("\n");
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      sessionId: state.sessionId,
      ingest,
      evaluate: ingest,
      getLastEvaluation,
      getReceipt,
      getReceiptText,
      reset,
      get state() {
        return state;
      }
    };
  }

  function createHearthSouthSession(options = {}) {
    return createSouthSession({
      planetId: "hearth",
      planetLabel: "Hearth",
      route: "/showroom/globe/hearth/",
      ...options
    });
  }

  function createSouthFinalProtocol(options = {}) {
    return createSouthSession(options);
  }

  function createHearthSouthFinalProtocol(options = {}) {
    return createHearthSouthSession(options);
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-south-final-protocol-forward-progress",
      destinationFile: "/assets/lab/runtime-table.south.js",
      status: "active",
      role: "south-final-protocol-gap-assessment-forward-progress-and-postgame-adjudication",
      fourFileSplitMember: true,
      cardinalRole: "SOUTH",
      northPrecedenceRequired: true,
      consumesNorthRuntimeTable: true,
      consumesEastSequence: true,
      consumesWestDiagnostic: true,
      doesNotReplaceNorth: true,

      southProtocolActive: true,
      quickGapAssessment: true,
      hardBlockOnlyForStructuralUnsafeCarrier: true,
      softGapsDoNotEraseVisualization: true,
      forwardProgressBeatsPrematureBlocking: true,
      readyTextRequiresCompletionLatch: true,
      completionRequiresF13MF13NNewsAndLatch: true,
      finalVisualPassClaimRemainsForbiddenUntilFinalPass: true,

      ownedFunctions: [
        "evaluateNewsGateState",
        "evaluateFibonacciState",
        "evaluateSouthFinalProtocol",
        "createSouthSession",
        "createHearthSouthSession",
        "createSouthFinalProtocol",
        "createHearthSouthFinalProtocol"
      ],
      coreLaw: [
        "South assesses the final gap quickly.",
        "South does not hard-block unless carrier structure is unsafe.",
        "Visible carrier may continue through soft gaps.",
        "Soft gaps block final claim but not forward diagnostic progress.",
        "F21 requires F13M visible-content proof, F13N inspect-mode readiness, NEWS gates, and completion latch.",
        "READY text requires finalPass true.",
        "visualPassClaimed remains false here; this file adjudicates but does not claim final visual pass."
      ],
      statuses: Object.values(SOUTH_STATUS),
      finalClaims: Object.values(FINAL_CLAIM),
      forwardModes: Object.values(FORWARD_MODE),
      gapSeverities: Object.values(GAP_SEVERITY),
      newsGates: clonePlain(NEWS_GATES),
      fibonacciFinal: clonePlain(FIBONACCI_FINAL),
      f13Required: F13_REQUIRED.slice(),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    SOUTH_STATUS,
    FINAL_CLAIM,
    FORWARD_MODE,
    GAP_SEVERITY,
    NEWS_GATES,
    FIBONACCI_FINAL,
    F13_REQUIRED,

    evaluateNewsGateState,
    evaluateFibonacciState,
    evaluateSouthFinalProtocol,
    createSouthSession,
    createHearthSouthSession,
    createSouthFinalProtocol,
    createHearthSouthFinalProtocol,
    getReceipt,

    fourFileSplitMember: true,
    cardinalRole: "SOUTH",
    southProtocolActive: true,
    northPrecedenceRequired: true,
    consumesNorthRuntimeTable: true,
    consumesEastSequence: true,
    consumesWestDiagnostic: true,
    doesNotReplaceNorth: true,

    quickGapAssessment: true,
    hardBlockOnlyForStructuralUnsafeCarrier: true,
    softGapsDoNotEraseVisualization: true,
    forwardProgressBeatsPrematureBlocking: true,
    readyTextRequiresCompletionLatch: true,
    completionRequiresF13MF13NNewsAndLatch: true,
    finalVisualPassClaimRemainsForbiddenUntilFinalPass: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.runtimeTableSouth = api;
  root.DEXTER_LAB.southFinalProtocol = api;

  root.LAB_RUNTIME_TABLE_SOUTH = api;
  root.LAB_SOUTH_FINAL_PROTOCOL = api;
  root.LAB_RUNTIME_TABLE_SOUTH_FINAL_PROTOCOL = api;
  root.LAB_FINAL_PROTOCOL = api;

  const north = resolveNorth();
  if (north && isObject(north)) {
    north.southFinalProtocol = api;
    north.runtimeTableSouth = api;
    north.evaluateSouthFinalProtocol = north.evaluateSouthFinalProtocol || evaluateSouthFinalProtocol;
    north.createSouthSession = north.createSouthSession || createSouthSession;
    north.createHearthSouthSession = north.createHearthSouthSession || createHearthSouthSession;
  }

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.labRuntimeTableSouthLoaded = "true";
    dataset.labRuntimeTableSouthContract = CONTRACT;
    dataset.labRuntimeTableSouthReceipt = RECEIPT;
    dataset.labRuntimeTableSouthPreviousContract = PREVIOUS_CONTRACT;
    dataset.labRuntimeTableSouthBaselineContract = BASELINE_CONTRACT;
    dataset.labSouthFinalProtocolLoaded = "true";
    dataset.labSouthFinalProtocolContract = CONTRACT;
    dataset.labSouthProtocolActive = "true";
    dataset.labSouthFourFileSplitMember = "true";
    dataset.labSouthCardinalRole = "SOUTH";
    dataset.labSouthNorthPrecedenceRequired = "true";
    dataset.labSouthConsumesNorthRuntimeTable = "true";
    dataset.labSouthConsumesEastSequence = "true";
    dataset.labSouthConsumesWestDiagnostic = "true";
    dataset.labSouthDoesNotReplaceNorth = "true";
    dataset.labSouthQuickGapAssessment = "true";
    dataset.labSouthHardBlockOnlyForStructuralUnsafeCarrier = "true";
    dataset.labSouthSoftGapsDoNotEraseVisualization = "true";
    dataset.labSouthForwardProgressBeatsPrematureBlocking = "true";
    dataset.labSouthReadyTextRequiresCompletionLatch = "true";
    dataset.labSouthCompletionRequiresF13MF13NNewsAndLatch = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
