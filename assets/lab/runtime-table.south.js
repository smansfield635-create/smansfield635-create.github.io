// /assets/lab/runtime-table.south.js
// LAB_RUNTIME_TABLE_SOUTH_PRIMARY_OUTPUT_PROOF_CYCLE_GATE_TNT_v1
// Full-file replacement.
// South primary Runtime Table gate.
// Purpose:
// - Renew South from visible-state composer into output/proof composer.
// - Preserve baseline visible-state composer exports as compatibility services.
// - Compose proof body, visible state, receipt state, Cycle 1 North-return packets, and Cycle 2 West-handoff packets.
// - Cycle 1: NORTH -> EAST -> WEST -> SOUTH -> NORTH.
// - Cycle 2: NORTH -> EAST -> SOUTH -> WEST -> CANVAS.
// - Keep Canvas release false unless lawful North + West release evidence is supplied.
// - Keep F21 latch North-owned.
// - Keep final visual pass false.

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_OUTPUT_PROOF_CYCLE_GATE_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_OUTPUT_PROOF_CYCLE_GATE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_SOUTH_TRANSMISSION_VISIBLE_STATE_COMPOSER_TNT_v1";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_SOUTH_TRANSMISSION_VISIBLE_STATE_COMPOSER_TNT_v1";
  const VERSION = "2026-05-31.lab-runtime-table-south-primary-output-proof-cycle-gate-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/assets/lab/runtime-table.south.js";

  const FILE_GATES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/assets/lab/runtime-table.east.js",
    west: "/assets/lab/runtime-table.west.js",
    south: "/assets/lab/runtime-table.south.js",
    hearthIndex: "/showroom/globe/hearth/index.js",
    hearthRoute: "/showroom/globe/hearth/hearth.js",
    canvas: "/assets/hearth/hearth.canvas.js",
    canvasEast: "/assets/hearth/hearth.canvas.east.js",
    canvasWest: "/assets/hearth/hearth.canvas.west.js",
    canvasSouth: "/assets/hearth/hearth.canvas.south.js"
  });

  const CYCLE_ROUTES = Object.freeze({
    CYCLE_1: "NORTH_EAST_WEST_SOUTH_NORTH",
    CYCLE_2: "NORTH_EAST_SOUTH_WEST_CANVAS"
  });

  const CARDINAL = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    CANVAS: "CANVAS",
    UNKNOWN: "UNKNOWN"
  });

  const FIBONACCI_RANK = Object.freeze({
    F1: 1,
    F1A: 1.01,
    F1B: 1.02,
    F2: 2,
    F3: 3,
    F5: 5,
    F8: 8,
    F13: 13,
    F13A: 13.01,
    F13B: 13.02,
    F13C: 13.03,
    F13D: 13.04,
    F13E: 13.05,
    F13F: 13.06,
    F13G: 13.07,
    F13H: 13.08,
    F13I: 13.09,
    F13J: 13.10,
    F13K: 13.11,
    F13L: 13.12,
    F13M: 13.13,
    F13N: 13.14,
    F21: 21
  });

  const GEAR_SEQUENCE = Object.freeze([
    gear("F1A_HTML_SHELL_RENDERED", 1, "F1A", "HTML_SHELL_RENDERED", "Ignition shell"),
    gear("F1B_LOAD_LEDGER_INITIALIZED", 2, "F1B", "LOAD_LEDGER_INITIALIZED", "Ledger oil pressure"),
    gear("F2_FIRST_PAINT_COCKPIT_VISIBLE", 3, "F2", "FIRST_PAINT_COCKPIT_VISIBLE", "First visible cockpit"),
    gear("F3_SCRIPT_ORDER_COMPLETE", 4, "F3", "SCRIPT_ORDER_COMPLETE", "Script timing order"),
    gear("F5_AUTHORITY_AVAILABILITY_READY", 5, "F5", "AUTHORITY_AVAILABILITY_READY", "Authority availability"),
    gear("F8_CONDUCTOR_HYDRATED", 6, "F8", "CONDUCTOR_HYDRATED", "Conductor hydration"),
    gear("F13A_CANVAS_PARENT_READY", 7, "F13A", "CANVAS_PARENT_READY", "Canvas parent ready"),
    gear("F13B_CANVAS_CHILDREN_READY", 8, "F13B", "CANVAS_CHILDREN_READY", "Canvas children ready"),
    gear("F13C_TEXTURE_COMPOSE_COMPLETE", 9, "F13C", "TEXTURE_COMPOSE_COMPLETE", "Texture composition"),
    gear("F13D_FIRST_FRAME_DETECTED", 10, "F13D", "FIRST_FRAME_DETECTED", "First frame detection"),
    gear("F13E_VISIBLE_PROOF_READY", 11, "F13E", "VISIBLE_PROOF_READY", "Visible proof"),
    gear("F13N_INSPECT_GATE_READY", 12, "F13N", "INSPECT_GATE_READY", "Inspect gate"),
    gear("F21_COMPLETION_LATCH_ELIGIBLE", 13, "F21", "F21_COMPLETION_LATCH_ELIGIBLE", "North F21 eligibility")
  ]);

  const GEAR_BY_ID = Object.freeze(GEAR_SEQUENCE.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {}));

  const GEAR_BY_FIBONACCI = Object.freeze(GEAR_SEQUENCE.reduce((map, item) => {
    map[item.fibonacci] = item;
    return map;
  }, {}));

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "south-primary-output-proof-cycle-gate",

    southPrimaryGateActive: true,
    outputProofComposerActive: true,
    cycleAwareRoutingActive: true,
    visibleStateComposerPreserved: true,

    lastNormalizedInput: null,
    lastCycleResolution: null,
    lastProofBody: null,
    lastPrimaryPacket: null,
    lastNorthReturnPacket: null,
    lastWestHandoffPacket: null,
    lastVisibleState: null,
    lastReceiptState: null,

    composeCount: 0,
    fallbackCount: 0,
    northReturnCount: 0,
    westHandoffCount: 0,

    createdAt: nowIso(),
    updatedAt: nowIso(),

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  function gear(id, rank, fibonacci, event, label) {
    return Object.freeze({
      id,
      rank,
      fibonacci,
      event,
      label,
      localProgressMin: 0,
      localProgressMax: 100
    });
  }

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

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null || value === "") return [];
    if (typeof value === "string") {
      return value
        .split(/[>,|,]/)
        .map((item) => item.trim())
        .filter(Boolean);
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

  function mergeSources(...sources) {
    const output = {};

    sources.forEach((source) => {
      if (!isObject(source)) return;
      Object.keys(source).forEach((key) => {
        if (output[key] === undefined) output[key] = source[key];
      });
    });

    return output;
  }

  function readPath(source, path) {
    if (!source || !path) return undefined;

    const parts = String(path).split(".");
    let cursor = source;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return undefined;
      cursor = cursor[part];
    }

    return cursor;
  }

  function findNested(input, names) {
    for (const name of names) {
      const value = readPath(input, name);
      if (isObject(value)) return value;
    }
    return {};
  }

  function scanFieldDeep(input, fields, maxDepth = 7) {
    const wanted = new Set(asArray(fields));
    const seen = typeof WeakSet !== "undefined" ? new WeakSet() : null;
    const queue = [{ value: input, depth: 0 }];

    while (queue.length) {
      const current = queue.shift();
      const value = current.value;

      if (!value || typeof value !== "object" || current.depth > maxDepth) continue;
      if (seen && seen.has(value)) continue;
      if (seen) seen.add(value);

      for (const key of Object.keys(value)) {
        if (wanted.has(key)) return value[key];
      }

      for (const key of Object.keys(value)) {
        const next = value[key];
        if (next && typeof next === "object") {
          queue.push({ value: next, depth: current.depth + 1 });
        }
      }
    }

    return undefined;
  }

  function getAnyString(input, fields, fallback = "") {
    const value = scanFieldDeep(input, fields);
    return value === undefined || value === null || value === "" ? fallback : String(value);
  }

  function getAnyNumber(input, fields, fallback = 0) {
    const value = scanFieldDeep(input, fields);
    return safeNumber(value, fallback);
  }

  function getAnyBool(input, fields, fallback = false) {
    const value = scanFieldDeep(input, fields);
    return safeBool(value, fallback);
  }

  function normalizeCardinal(value, fallback = CARDINAL.UNKNOWN) {
    const text = safeString(value, "").trim().toUpperCase();

    if (text.includes("NORTH")) return CARDINAL.NORTH;
    if (text.includes("EAST")) return CARDINAL.EAST;
    if (text.includes("WEST")) return CARDINAL.WEST;
    if (text.includes("SOUTH")) return CARDINAL.SOUTH;
    if (text.includes("CANVAS")) return CARDINAL.CANVAS;

    return fallback;
  }

  function normalizeCycleRoute(value) {
    const text = safeString(value, "").trim().toUpperCase().replace(/\s+/g, "_").replace(/->/g, "_");

    if (text.includes("NORTH_EAST_WEST_SOUTH_NORTH")) return CYCLE_ROUTES.CYCLE_1;
    if (text.includes("NORTH_EAST_SOUTH_WEST_CANVAS")) return CYCLE_ROUTES.CYCLE_2;

    return "";
  }

  function deriveFibonacci(input = {}) {
    const explicit = getAnyString(input, [
      "activeFibonacci",
      "activeFibonacciStage",
      "fibonacci",
      "activeGateFibonacci",
      "checkpointFibonacci"
    ], "");

    if (explicit) return explicit.toUpperCase();

    const text = [
      getAnyString(input, ["activeStageId"], ""),
      getAnyString(input, ["activeGearId"], ""),
      getAnyString(input, ["activeGateId"], ""),
      getAnyString(input, ["checkpointId"], ""),
      getAnyString(input, ["event"], "")
    ].join(" ").toUpperCase();

    if (text.includes("F21") || text.includes("COMPLETION")) return "F21";
    if (text.includes("F13N") || text.includes("INSPECT")) return "F13N";
    if (text.includes("F13E") || text.includes("VISIBLE")) return "F13E";
    if (text.includes("F13D") || text.includes("FRAME")) return "F13D";
    if (text.includes("F13C") || text.includes("TEXTURE")) return "F13C";
    if (text.includes("F13B") || text.includes("CHILD")) return "F13B";
    if (text.includes("F13A") || text.includes("PARENT") || text.includes("CANVAS")) return "F13A";
    if (text.includes("F13")) return "F13";
    if (text.includes("F8") || text.includes("CONDUCTOR")) return "F8";
    if (text.includes("F5") || text.includes("AUTHORITY")) return "F5";
    if (text.includes("F3") || text.includes("SCRIPT")) return "F3";
    if (text.includes("F2") || text.includes("PAINT")) return "F2";
    if (text.includes("F1B") || text.includes("LEDGER")) return "F1B";
    if (text.includes("F1") || text.includes("SHELL")) return "F1A";

    return "F8";
  }

  function deriveGearFromFibonacci(fibonacci) {
    if (GEAR_BY_FIBONACCI[fibonacci]) return GEAR_BY_FIBONACCI[fibonacci];
    if (String(fibonacci).startsWith("F13")) return GEAR_BY_FIBONACCI.F13A;
    return GEAR_BY_FIBONACCI.F8;
  }

  function hasNorthLatchEvidence(input = {}) {
    const sourceFile = getAnyString(input, ["sourceFile", "file"], "");
    const sourceAuthority = getAnyString(input, ["sourceAuthority", "authority", "cardinalRole"], "");
    const northSource = sourceFile === FILE_GATES.north || normalizeCardinal(sourceAuthority, "") === CARDINAL.NORTH;

    return Boolean(
      getAnyBool(input, ["northCompletionLatched", "finalCompletionLatchedByNorth", "northF21Latched"], false) ||
      (
        northSource &&
        (
          getAnyBool(input, ["completionLatched", "finalCompletionLatched"], false) ||
          ["FULL", "DEGRADED"].includes(getAnyString(input, ["f21LatchMode"], "").toUpperCase())
        )
      )
    );
  }

  function hasLawfulCanvasReleaseEvidence(input = {}) {
    return Boolean(
      getAnyBool(input, ["canvasReleaseAuthorized"], false) &&
      (
        getAnyBool(input, ["northCanvasReleaseAuthorized", "northReleaseAuthorized", "downstreamReleaseAuthorized"], false) ||
        getAnyString(input, ["northReleaseEvidence"], "")
      ) &&
      (
        getAnyBool(input, ["westCanvasReleaseAuthorized", "westReleaseAuthorized", "westAuditPassed"], false) ||
        getAnyString(input, ["westReleaseEvidence"], "")
      )
    );
  }

  function routeConductorProof(input = {}) {
    const markerPresent = Boolean(
      getAnyBool(input, ["routeConductorMarkerPresent", "conductorMarkerPresent"], false) ||
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true
    );

    const apiPresent = Boolean(
      getAnyBool(input, ["routeConductorApiPresent", "routeConductorGlobalPresent"], false) ||
      root.HEARTH_ROUTE_CONDUCTOR ||
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR ||
      (root.HEARTH && root.HEARTH.southRouteConductor)
    );

    const receiptPresent = Boolean(
      getAnyBool(input, ["routeConductorReceiptPresent"], false) ||
      getAnyString(input, ["routeConductorReceipt", "routeConductorContract"], "") ||
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT ||
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT
    );

    const runtimeActive = Boolean(
      getAnyBool(input, ["routeConductorRuntimeActive", "southRuntimeActive"], false) ||
      apiPresent
    );

    const hydrated = Boolean(
      getAnyBool(input, ["routeConductorHydrated"], false) ||
      (markerPresent && apiPresent && receiptPresent && runtimeActive)
    );

    return {
      routeConductorProofPresent: hydrated,
      routeConductorMarkerPresent: markerPresent,
      routeConductorApiPresent: apiPresent,
      routeConductorReceiptPresent: receiptPresent,
      routeConductorRuntimeActive: runtimeActive,
      routeConductorHydrated: hydrated,
      routeConductorStatus: hydrated ? "PRESENT" : markerPresent ? "MARKER_ONLY" : "PENDING",
      f8SelfDutySatisfied: hydrated
    };
  }

  function visibleProof(input = {}) {
    const canvasPresent = getAnyBool(input, ["planetCanvasPresent", "canvasPresent", "canvasCarrierMounted"], false);
    const canvasNonZeroSize = getAnyBool(input, ["planetCanvasNonZeroSize", "canvasNonZeroSize"], false);
    const firstFrameDetected = getAnyBool(input, ["firstFrameDetected"], false);
    const imageRendered = getAnyBool(input, ["imageRendered", "canvasImageRendered"], false);
    const nonblankPlanetVisible = getAnyBool(input, ["nonblankPlanetVisible", "visiblePlanetAvailable"], false);
    const hardFail = getAnyBool(input, ["visibleContentHardFail"], false);
    const strictProof = getAnyBool(input, ["visibleContentStrictProof"], false);
    const contentProof = getAnyBool(input, ["visibleContentProof", "canvasVisibleContentProof", "visiblePlanetProofValid"], false);
    const softGap = getAnyBool(input, ["visibleContentSoftGap", "visibleForwardProgress", "visibleContentAdmissible"], false);

    const sampleCount = getAnyNumber(input, ["visibleContentSampleCount"], 0);
    const classCount = getAnyNumber(input, ["visibleContentClassCount"], 0);
    const variance = getAnyNumber(input, ["visibleContentVarianceScore"], 0);
    const land = getAnyNumber(input, ["visibleContentLandSampleCount"], 0);
    const water = getAnyNumber(input, ["visibleContentWaterSampleCount"], 0);
    const other = getAnyNumber(input, ["visibleContentOtherSampleCount"], 0);

    const sampledSurfaceSignal = Boolean(
      firstFrameDetected &&
      imageRendered &&
      (nonblankPlanetVisible || sampleCount > 0) &&
      (classCount > 0 || variance > 0 || land > 0 || water > 0 || other > 0)
    );

    const present = Boolean(!hardFail && (strictProof || contentProof || sampledSurfaceSignal));
    const degraded = Boolean(!present && !hardFail && softGap);

    return {
      visibleProofPresent: present,
      visibleProofStrict: strictProof,
      visibleProofDegraded: degraded,
      visibleProofPending: !present && !degraded && !hardFail,
      visibleProofAbsent: !present && !degraded,
      visibleContentHardFail: hardFail,
      visibleContentProof: contentProof,
      visibleContentStrictProof: strictProof,
      visibleContentSoftGap: softGap,
      visiblePlanetProofValid: present || degraded,
      planetCanvasPresent: canvasPresent,
      planetCanvasNonZeroSize: canvasNonZeroSize,
      firstFrameDetected,
      imageRendered,
      nonblankPlanetVisible,
      visibleContentSampleCount: sampleCount,
      visibleContentClassCount: classCount,
      visibleContentVarianceScore: variance,
      visibleContentLandSampleCount: land,
      visibleContentWaterSampleCount: water,
      visibleContentOtherSampleCount: other,
      f13VisibleEvidenceAvailable: Boolean(present || degraded)
    };
  }

  function inspectProof(input = {}) {
    const inspectModeAvailable = getAnyBool(input, ["inspectModeAvailable"], false);
    const inspectPlanetControlAvailable = getAnyBool(input, ["inspectPlanetControlAvailable"], false);
    const diagnosticCanLeavePlanetFrame = getAnyBool(input, ["diagnosticCanLeavePlanetFrame"], false);
    const diagnosticDockRestorable = getAnyBool(input, ["diagnosticDockRestorable"], true);
    const copyDiagnosticPreserved = getAnyBool(input, ["copyDiagnosticPreserved"], true);
    const receiptToggleReady = getAnyBool(input, ["receiptToggleReady"], true);
    const buttonsReachable = getAnyBool(input, ["buttonsReachable"], false);
    const receiptOverlayIndependent = getAnyBool(input, ["receiptOverlayIndependent"], true);

    const present = Boolean(
      inspectModeAvailable &&
      inspectPlanetControlAvailable &&
      diagnosticCanLeavePlanetFrame &&
      diagnosticDockRestorable &&
      copyDiagnosticPreserved &&
      receiptToggleReady &&
      buttonsReachable &&
      receiptOverlayIndependent
    );

    const degraded = Boolean(
      !present &&
      diagnosticDockRestorable &&
      copyDiagnosticPreserved &&
      receiptToggleReady
    );

    return {
      inspectProofPresent: present,
      inspectProofDegraded: degraded,
      inspectProofPending: !present && !degraded,
      inspectProofAbsent: !present && !degraded,
      inspectModeAvailable,
      inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame,
      diagnosticDockRestorable,
      copyDiagnosticPreserved,
      receiptToggleReady,
      buttonsReachable,
      receiptOverlayIndependent,
      f13InspectEvidenceAvailable: Boolean(present || degraded)
    };
  }

  function canvasReadinessProof(input = {}) {
    const canvasParentPresent = getAnyBool(input, ["canvasParentPresent"], false);
    const canvasParentBootMethodAvailable = getAnyBool(input, ["canvasParentBootMethodAvailable"], false) || Boolean(getAnyString(input, ["canvasParentBootMethod"], ""));
    const canvasEastReady = getAnyBool(input, ["canvasEastReady"], false);
    const canvasWestReady = getAnyBool(input, ["canvasWestReady"], false);
    const canvasSouthReady = getAnyBool(input, ["canvasSouthReady"], false);
    const allCanvasChildrenReady = getAnyBool(input, ["allCanvasChildrenReady"], false) || Boolean(canvasEastReady && canvasWestReady && canvasSouthReady);
    const atlasBuildComplete = getAnyBool(input, ["atlasBuildComplete"], false);
    const textureComposeComplete = getAnyBool(input, ["textureComposeComplete"], false);
    const firstFrameDetected = getAnyBool(input, ["firstFrameDetected"], false);
    const imageRendered = getAnyBool(input, ["imageRendered"], false);
    const canvasReady = getAnyBool(input, ["canvasReady"], false) || Boolean(canvasParentPresent && allCanvasChildrenReady && firstFrameDetected && imageRendered);

    return {
      canvasReadinessProofPresent: canvasReady,
      canvasParentPresent,
      canvasParentBootMethodAvailable,
      canvasEastReady,
      canvasWestReady,
      canvasSouthReady,
      allCanvasChildrenReady,
      atlasBuildComplete,
      textureComposeComplete,
      firstFrameDetected,
      imageRendered,
      canvasReady,
      f13CanvasEvidenceAvailable: Boolean(canvasReady || firstFrameDetected || imageRendered)
    };
  }

  function receiptProof(input = {}) {
    const receiptAvailable = Boolean(
      getAnyBool(input, ["receiptAvailable", "partialReceiptAvailable", "finalReceiptAvailable"], false) ||
      getAnyString(input, ["receipt", "receiptTarget", "southReceipt", "canvasReceipt", "routeConductorReceipt"], "") ||
      isObject(input.receiptState) ||
      isObject(input.receiptPacket)
    );

    const finalReceiptAvailable = getAnyBool(input, ["finalReceiptAvailable"], false);
    const partialReceiptAvailable = getAnyBool(input, ["partialReceiptAvailable"], receiptAvailable);

    return {
      receiptProofPresent: receiptAvailable,
      receiptAvailable,
      finalReceiptAvailable,
      partialReceiptAvailable,
      receiptProofCanPreserveForwardMotion: receiptAvailable || partialReceiptAvailable
    };
  }

  function newsProof(input = {}) {
    const northGateReady = getAnyBool(input, ["northGateReady"], false);
    const eastGateReady = getAnyBool(input, ["eastGateReady"], false);
    const westGateReady = getAnyBool(input, ["westGateReady"], false);
    const southGateReady = getAnyBool(input, ["southGateReady"], false);
    const canvasGateReady = getAnyBool(input, ["canvasGateReady"], false);

    const northGateDegradedReady = getAnyBool(input, ["northGateDegradedReady"], northGateReady);
    const westGateDegradedReady = getAnyBool(input, ["westGateDegradedReady"], westGateReady);
    const southGateDegradedReady = getAnyBool(input, ["southGateDegradedReady"], southGateReady);

    const full = getAnyBool(
      input,
      ["newsGatePassedBeforeF21"],
      Boolean(northGateReady && eastGateReady && westGateReady && southGateReady)
    );

    const degraded = getAnyBool(
      input,
      ["newsGateDegradedBeforeF21"],
      Boolean(northGateDegradedReady && eastGateReady && westGateDegradedReady && southGateDegradedReady)
    );

    return {
      southNewsObserved: true,
      southNewsComposed: true,
      southNewsReturnedToNorth: false,
      southNewsSubmittedToWest: false,
      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      canvasGateReady,
      northGateDegradedReady,
      westGateDegradedReady,
      southGateDegradedReady,
      newsGatePassedBeforeF21: full,
      newsGateDegradedBeforeF21: degraded,
      newsProofPresent: Boolean(full || degraded || northGateReady || eastGateReady || westGateReady || southGateReady)
    };
  }

  function fibonacciProof(input = {}) {
    const activeFibonacci = deriveFibonacci(input);
    const activeFibonacciRank = FIBONACCI_RANK[activeFibonacci] || FIBONACCI_RANK.F8;
    const activeGear = deriveGearFromFibonacci(activeFibonacci);

    return {
      activeFibonacci,
      activeFibonacciRank,
      activeStageId: getAnyString(input, ["activeStageId"], activeGear.id),
      activeGearId: getAnyString(input, ["activeGearId"], activeGear.id),
      activeGearLabel: getAnyString(input, ["activeGearLabel"], activeGear.label),
      activeGearRank: activeGear.rank,
      fibonacciSynchronizationActive: true,
      fibonacciProofPresent: true
    };
  }

  function activeGapSummary(input = {}) {
    return {
      activeGapPresent: Boolean(
        getAnyString(input, ["gapClass", "firstFailedCoordinate"], "") ||
        isObject(input.latestGap) ||
        isObject(input.gap)
      ),
      gapClass: getAnyString(input, ["gapClass"], ""),
      gapSeverity: getAnyString(input, ["gapSeverity"], ""),
      gapDecision: getAnyString(input, ["gapDecision", "decision"], ""),
      hardBlock: getAnyBool(input, ["hardBlock", "hardBlocked"], false),
      canDegradeForward: getAnyBool(input, ["canDegradeForward", "degradedForwardAvailable"], false),
      firstFailedCoordinate: getAnyString(input, ["firstFailedCoordinate"], "WAITING_SOUTH_OUTPUT_PROOF_COMPOSITION"),
      recommendedNextFile: getAnyString(input, ["recommendedNextFile"], FILE_GATES.south),
      recommendedNextRenewalTarget: getAnyString(input, ["recommendedNextRenewalTarget"], FILE_GATES.south)
    };
  }

  function normalizeSouthInput(input = {}) {
    const source = isObject(input) ? input : {};

    const north = findNested(source, ["north", "northReceipt", "northPacket", "northState"]);
    const east = findNested(source, ["east", "eastReceipt", "eastPacket", "eastState"]);
    const west = findNested(source, ["west", "westReceipt", "westPacket", "westState", "latestGap", "gap"]);
    const south = findNested(source, ["south", "southReceipt", "southPacket", "southState"]);
    const canvas = findNested(source, ["canvas", "canvasReceipt", "canvasState", "render", "renderMetadata"]);
    const route = findNested(source, ["route", "routeReceipt", "routeConductor", "routeConductorReceipt", "hearth", "hearthReceipt"]);

    const flat = mergeSources(source, north, east, west, south, canvas, route, source.snapshot || {}, source.detail || {});

    const routeConductor = routeConductorProof(flat);
    const visible = visibleProof(flat);
    const inspect = inspectProof(flat);
    const canvasReady = canvasReadinessProof(flat);
    const receipt = receiptProof(flat);
    const news = newsProof(flat);
    const fibonacci = fibonacciProof(flat);
    const gap = activeGapSummary(flat);

    const receivedFrom = normalizeCardinal(
      getAnyString(flat, ["receivedFrom", "sourceCardinal", "fromCardinal"], ""),
      getAnyBool(flat, ["westAuditObserved", "westAuditPassed"], false) ? CARDINAL.WEST : CARDINAL.UNKNOWN
    );

    const suppliedRoute = normalizeCycleRoute(getAnyString(flat, ["cycleRoute", "activeCycleRoute"], ""));
    const activeCycleNumber = getAnyNumber(flat, ["cycleNumber", "activeCycleNumber"], 0);

    const westAuditObserved = Boolean(
      getAnyBool(flat, ["westAuditObserved", "westAuditPassed", "auditPassed"], false) ||
      receivedFrom === CARDINAL.WEST ||
      isObject(west)
    );

    const westAuditRequired = getAnyBool(flat, ["westAuditRequired"], true);
    const northReturnRequired = getAnyBool(flat, ["northReturnRequired"], false);

    const proofBodyAvailable = Boolean(
      routeConductor.routeConductorProofPresent ||
      visible.visibleProofPresent ||
      visible.visibleProofDegraded ||
      inspect.inspectProofPresent ||
      inspect.inspectProofDegraded ||
      receipt.receiptProofPresent ||
      canvasReady.canvasReadinessProofPresent ||
      news.newsProofPresent
    );

    const outputSpreadAvailable = getAnyBool(
      flat,
      ["outputSpreadAvailable", "outputSpreadComposed"],
      Boolean(proofBodyAvailable || visible.f13VisibleEvidenceAvailable || canvasReady.f13CanvasEvidenceAvailable)
    );

    const f8SelfDutySatisfied = routeConductor.f8SelfDutySatisfied;

    const f13ProofBodyAvailable = Boolean(
      proofBodyAvailable ||
      visible.f13VisibleEvidenceAvailable ||
      inspect.f13InspectEvidenceAvailable ||
      canvasReady.f13CanvasEvidenceAvailable ||
      receipt.receiptProofCanPreserveForwardMotion
    );

    const f13VisibleEvidenceAvailable = visible.f13VisibleEvidenceAvailable;
    const f13InspectEvidenceAvailable = inspect.f13InspectEvidenceAvailable;

    const f21EligibleForNorth = getAnyBool(
      flat,
      ["f21EligibleForNorth", "f21EligibilityReadyForNorth"],
      Boolean(
        f8SelfDutySatisfied &&
        f13ProofBodyAvailable &&
        (
          f13VisibleEvidenceAvailable ||
          f13InspectEvidenceAvailable ||
          receipt.receiptProofCanPreserveForwardMotion
        ) &&
        (
          news.newsGatePassedBeforeF21 ||
          news.newsGateDegradedBeforeF21 ||
          getAnyBool(flat, ["newsGatePassed", "newsGateDegraded"], false)
        )
      )
    );

    const f21SubmittedToNorth = getAnyBool(flat, ["f21SubmittedToNorth", "f21EligibilitySubmittedToNorth"], false);
    const northLatched = hasNorthLatchEvidence(flat);
    const canvasReleaseAuthorized = hasLawfulCanvasReleaseEvidence(flat);

    const normalized = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      role: "south-primary-output-proof-cycle-gate",

      raw: clonePlain(source),
      north: clonePlain(north),
      east: clonePlain(east),
      west: clonePlain(west),
      south: clonePlain(south),
      canvas: clonePlain(canvas),
      route: clonePlain(route),
      flat: clonePlain(flat),

      sourceFile: getAnyString(flat, ["sourceFile", "file", "fromFile"], ""),
      destinationFile: getAnyString(flat, ["destinationFile", "targetFile"], FILE),
      activeCycleNumber,
      activeCycleRoute: suppliedRoute,
      cycleRoute: suppliedRoute,

      activeCardinal: CARDINAL.SOUTH,
      activeFileGate: getAnyString(flat, ["activeFileGate", "fileGate"], FILE_GATES.south),
      activeFibonacci: fibonacci.activeFibonacci,
      activeFibonacciRank: fibonacci.activeFibonacciRank,
      activeStageId: fibonacci.activeStageId,
      activeGearId: fibonacci.activeGearId,
      activeGearLabel: fibonacci.activeGearLabel,
      activeGearRank: fibonacci.activeGearRank,
      activeNewsGate: getAnyString(flat, ["activeNewsGate", "newsGate"], "SOUTH"),

      receivedFrom,
      returnTo: normalizeCardinal(getAnyString(flat, ["returnTo"], ""), CARDINAL.UNKNOWN),
      handoffTo: normalizeCardinal(getAnyString(flat, ["handoffTo"], ""), CARDINAL.UNKNOWN),

      westAuditObserved,
      westAuditRequired,
      northReturnRequired,
      canvasReleaseAuthorized,

      proofBodyAvailable,
      visibleStateAvailable: getAnyBool(flat, ["visibleStateAvailable"], proofBodyAvailable),
      receiptAvailable: receipt.receiptAvailable,
      outputSpreadAvailable,

      ...routeConductor,
      ...visible,
      ...inspect,
      ...canvasReady,
      ...receipt,
      ...news,
      ...fibonacci,
      ...gap,

      f8SelfDutySatisfied,
      f13ProofBodyAvailable,
      f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable,
      f21EligibleForNorth,
      f21SubmittedToNorth,
      f21LatchMode: northLatched ? getAnyString(flat, ["f21LatchMode"], "FULL") : "WAITING",
      completionLatched: northLatched,
      degradedCompletionLatched: Boolean(northLatched && getAnyBool(flat, ["degradedCompletionLatched"], false)),

      recommendedNextFile: gap.recommendedNextFile || FILE_GATES.south,
      recommendedNextRenewalTarget: gap.recommendedNextRenewalTarget || FILE_GATES.south,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      normalizedAt: nowIso()
    };

    state.lastNormalizedInput = clonePlain(normalized);
    state.updatedAt = nowIso();

    return normalized;
  }

  function normalizeVisibleInput(input = {}) {
    return normalizeSouthInput(input);
  }

  function resolveSouthCycle(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeSouthInput(input);

    let cycleNumber = normalized.activeCycleNumber;
    let cycleRoute = normalized.activeCycleRoute;

    const explicitCycle1 = Boolean(
      cycleNumber === 1 ||
      cycleRoute === CYCLE_ROUTES.CYCLE_1 ||
      normalized.receivedFrom === CARDINAL.WEST ||
      normalized.westAuditObserved ||
      normalized.northReturnRequired
    );

    const explicitCycle2 = Boolean(
      cycleNumber === 2 ||
      cycleRoute === CYCLE_ROUTES.CYCLE_2 ||
      (
        [CARDINAL.EAST, CARDINAL.NORTH].includes(normalized.receivedFrom) &&
        normalized.westAuditRequired
      ) ||
      getAnyBool(normalized.flat || {}, ["prepareOutputSpreadForWest", "outputSpreadForWest", "westHandoffRequired"], false)
    );

    if (explicitCycle1) {
      cycleNumber = 1;
      cycleRoute = CYCLE_ROUTES.CYCLE_1;
    } else if (explicitCycle2) {
      cycleNumber = 2;
      cycleRoute = CYCLE_ROUTES.CYCLE_2;
    } else {
      cycleNumber = 1;
      cycleRoute = CYCLE_ROUTES.CYCLE_1;
    }

    const resolved = {
      contract: CONTRACT,
      receipt: RECEIPT,
      cycleResolved: true,
      cycleNumber,
      cycleRoute,
      activeCycleNumber: cycleNumber,
      activeCycleRoute: cycleRoute,
      receivedFrom: cycleNumber === 1 ? (normalized.receivedFrom === CARDINAL.UNKNOWN ? CARDINAL.WEST : normalized.receivedFrom) : (normalized.receivedFrom === CARDINAL.UNKNOWN ? CARDINAL.EAST : normalized.receivedFrom),
      returnTo: cycleNumber === 1 ? CARDINAL.NORTH : "",
      handoffTo: cycleNumber === 1 ? "" : CARDINAL.WEST,
      northReturnRequired: cycleNumber === 1,
      westAuditRequired: cycleNumber === 2,
      canvasReleaseAuthorized: Boolean(normalized.canvasReleaseAuthorized && cycleNumber === 2),
      fallbackCycleUsed: !(explicitCycle1 || explicitCycle2),
      unknownCycleDefaultsToNorthReturn: !(explicitCycle1 || explicitCycle2),
      canvasReceivesDirectlyFromSouth: false,
      visualPassClaimed: false,
      resolvedAt: nowIso()
    };

    state.lastCycleResolution = clonePlain(resolved);
    state.updatedAt = nowIso();

    return resolved;
  }

  function composeProofBody(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeSouthInput(input);

    const channels = {
      routeConductor: normalized.routeConductorProofPresent,
      visible: Boolean(normalized.visibleProofPresent || normalized.visibleProofDegraded),
      inspect: Boolean(normalized.inspectProofPresent || normalized.inspectProofDegraded),
      receipt: normalized.receiptProofPresent,
      canvasReadiness: normalized.canvasReadinessProofPresent,
      news: normalized.newsProofPresent,
      fibonacci: normalized.fibonacciProofPresent
    };

    const proofChannelCount = Object.keys(channels).filter((key) => channels[key]).length;
    const proofBodyComposed = proofChannelCount > 0;

    const body = {
      contract: CONTRACT,
      receipt: RECEIPT,
      proofBodyContract: "LAB_RUNTIME_TABLE_SOUTH_PROOF_BODY_v1",
      proofBodyReceipt: "LAB_RUNTIME_TABLE_SOUTH_PROOF_BODY_RECEIPT_v1",
      file: FILE,
      proofBodyComposed,
      proofChannelCount,
      proofChannels: channels,

      routeConductorProof: {
        present: normalized.routeConductorProofPresent,
        markerPresent: normalized.routeConductorMarkerPresent,
        apiPresent: normalized.routeConductorApiPresent,
        receiptPresent: normalized.routeConductorReceiptPresent,
        runtimeActive: normalized.routeConductorRuntimeActive,
        hydrated: normalized.routeConductorHydrated,
        status: normalized.routeConductorStatus
      },

      visibleProof: {
        status: normalized.visibleProofPresent ? "PRESENT" : normalized.visibleProofDegraded ? "DEGRADED" : normalized.visibleProofPending ? "PENDING" : "ABSENT",
        present: normalized.visibleProofPresent,
        degraded: normalized.visibleProofDegraded,
        pending: normalized.visibleProofPending,
        absent: normalized.visibleProofAbsent,
        strict: normalized.visibleProofStrict,
        valid: normalized.visiblePlanetProofValid,
        hardFail: normalized.visibleContentHardFail,
        firstFrameDetected: normalized.firstFrameDetected,
        imageRendered: normalized.imageRendered,
        nonblankPlanetVisible: normalized.nonblankPlanetVisible
      },

      inspectProof: {
        status: normalized.inspectProofPresent ? "PRESENT" : normalized.inspectProofDegraded ? "DEGRADED" : normalized.inspectProofPending ? "PENDING" : "ABSENT",
        present: normalized.inspectProofPresent,
        degraded: normalized.inspectProofDegraded,
        pending: normalized.inspectProofPending,
        absent: normalized.inspectProofAbsent,
        diagnosticCanLeavePlanetFrame: normalized.diagnosticCanLeavePlanetFrame,
        buttonsReachable: normalized.buttonsReachable,
        receiptToggleReady: normalized.receiptToggleReady
      },

      receiptProof: {
        present: normalized.receiptProofPresent,
        receiptAvailable: normalized.receiptAvailable,
        partialReceiptAvailable: normalized.partialReceiptAvailable,
        finalReceiptAvailable: normalized.finalReceiptAvailable,
        preservesForwardMotion: normalized.receiptProofCanPreserveForwardMotion
      },

      canvasReadinessProof: {
        present: normalized.canvasReadinessProofPresent,
        parentPresent: normalized.canvasParentPresent,
        parentBootMethodAvailable: normalized.canvasParentBootMethodAvailable,
        allChildrenReady: normalized.allCanvasChildrenReady,
        atlasBuildComplete: normalized.atlasBuildComplete,
        textureComposeComplete: normalized.textureComposeComplete,
        firstFrameDetected: normalized.firstFrameDetected,
        imageRendered: normalized.imageRendered,
        canvasReady: normalized.canvasReady
      },

      newsProof: {
        present: normalized.newsProofPresent,
        southNewsObserved: normalized.southNewsObserved,
        southNewsComposed: true,
        northGateReady: normalized.northGateReady,
        eastGateReady: normalized.eastGateReady,
        westGateReady: normalized.westGateReady,
        southGateReady: normalized.southGateReady,
        canvasGateReady: normalized.canvasGateReady,
        newsGatePassedBeforeF21: normalized.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: normalized.newsGateDegradedBeforeF21
      },

      fibonacciProof: {
        present: normalized.fibonacciProofPresent,
        activeFibonacci: normalized.activeFibonacci,
        activeFibonacciRank: normalized.activeFibonacciRank,
        activeStageId: normalized.activeStageId,
        activeGearId: normalized.activeGearId,
        f8SelfDutySatisfied: normalized.f8SelfDutySatisfied,
        f13ProofBodyAvailable: normalized.f13ProofBodyAvailable,
        f13VisibleEvidenceAvailable: normalized.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: normalized.f13InspectEvidenceAvailable,
        f21EligibleForNorth: normalized.f21EligibleForNorth,
        f21SubmittedToNorth: normalized.f21SubmittedToNorth,
        f21LatchMode: normalized.f21LatchMode
      },

      f13ProofSummary: {
        f13ProofBodyAvailable: normalized.f13ProofBodyAvailable,
        f13VisibleEvidenceAvailable: normalized.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: normalized.f13InspectEvidenceAvailable,
        f13CanvasEvidenceAvailable: normalized.f13CanvasEvidenceAvailable
      },

      f21EligibilitySummary: {
        f21EligibleForNorth: normalized.f21EligibleForNorth,
        f21SubmittedToNorth: normalized.f21SubmittedToNorth,
        completionLatched: normalized.completionLatched,
        degradedCompletionLatched: normalized.degradedCompletionLatched,
        f21LatchMode: normalized.f21LatchMode,
        northLatchesF21: true
      },

      activeGapSummary: {
        activeGapPresent: normalized.activeGapPresent,
        gapClass: normalized.gapClass,
        gapSeverity: normalized.gapSeverity,
        gapDecision: normalized.gapDecision,
        hardBlock: normalized.hardBlock,
        canDegradeForward: normalized.canDegradeForward
      },

      firstFailedCoordinate: normalized.firstFailedCoordinate,
      recommendedNextFile: normalized.recommendedNextFile,
      recommendedNextRenewalTarget: normalized.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };

    state.lastProofBody = clonePlain(body);
    state.updatedAt = nowIso();

    return body;
  }

  function composeNorthReturnPacket(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeSouthInput(input);
    const cycle = resolveSouthCycle({
      ...normalized,
      cycleNumber: 1,
      cycleRoute: CYCLE_ROUTES.CYCLE_1,
      receivedFrom: CARDINAL.WEST,
      northReturnRequired: true
    });
    const proofBody = composeProofBody(normalized);

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetContract: "LAB_RUNTIME_TABLE_SOUTH_CYCLE_1_NORTH_RETURN_PACKET_v1",
      packetReceipt: "LAB_RUNTIME_TABLE_SOUTH_CYCLE_1_NORTH_RETURN_PACKET_RECEIPT_v1",
      file: FILE,

      cycleNumber: 1,
      activeCycleNumber: 1,
      cycleRoute: CYCLE_ROUTES.CYCLE_1,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_1,
      receivedFrom: CARDINAL.WEST,
      returnTo: CARDINAL.NORTH,
      handoffTo: "",

      canvasReleaseAuthorized: false,
      northReturnRequired: true,
      southReturnPacketReady: true,
      westAuditObserved: normalized.westAuditObserved,
      proofBodyComposed: proofBody.proofBodyComposed,
      proofBody,
      visibleStateComposed: true,
      receiptComposed: true,

      f21EligibleForNorth: normalized.f21EligibleForNorth,
      f21SubmittedToNorth: Boolean(normalized.f21EligibleForNorth || normalized.f21SubmittedToNorth),
      f21LatchMode: normalized.completionLatched ? normalized.f21LatchMode : "WAITING",
      completionLatched: normalized.completionLatched,
      degradedCompletionLatched: normalized.degradedCompletionLatched,

      southNewsObserved: normalized.southNewsObserved,
      southNewsComposed: true,
      southNewsReturnedToNorth: true,
      southNewsSubmittedToWest: false,

      activeFibonacci: normalized.activeFibonacci,
      activeFibonacciRank: normalized.activeFibonacciRank,
      activeStageId: normalized.activeStageId,
      activeGearId: normalized.activeGearId,

      firstFailedCoordinate: normalized.firstFailedCoordinate,
      recommendedNextFile: normalized.recommendedNextFile,
      recommendedNextRenewalTarget: normalized.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };

    state.northReturnCount += 1;
    state.lastNorthReturnPacket = clonePlain(packet);
    state.updatedAt = nowIso();

    return packet;
  }

  function composeWestHandoffPacket(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeSouthInput(input);
    const cycle = resolveSouthCycle({
      ...normalized,
      cycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      westAuditRequired: true
    });
    const proofBody = composeProofBody(normalized);

    const outputSpreadComposed = Boolean(normalized.outputSpreadAvailable || proofBody.proofBodyComposed);
    const proofPacketReady = Boolean(proofBody.proofBodyComposed || normalized.receiptProofCanPreserveForwardMotion);

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetContract: "LAB_RUNTIME_TABLE_SOUTH_CYCLE_2_WEST_HANDOFF_PACKET_v1",
      packetReceipt: "LAB_RUNTIME_TABLE_SOUTH_CYCLE_2_WEST_HANDOFF_PACKET_RECEIPT_v1",
      file: FILE,

      cycleNumber: 2,
      activeCycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
      receivedFrom: [CARDINAL.EAST, CARDINAL.NORTH].includes(normalized.receivedFrom) ? normalized.receivedFrom : CARDINAL.EAST,
      returnTo: "",
      handoffTo: CARDINAL.WEST,

      canvasReleaseAuthorized: false,
      westAuditRequired: true,
      outputSpreadComposed,
      proofPacketReady,
      proofBodyComposed: proofBody.proofBodyComposed,
      proofBody,
      visibleStateComposed: true,
      receiptComposed: true,

      f21EligibleForNorth: normalized.f21EligibleForNorth,
      f21SubmittedToNorth: normalized.f21SubmittedToNorth,
      f21LatchMode: normalized.completionLatched ? normalized.f21LatchMode : "WAITING",
      completionLatched: normalized.completionLatched,
      degradedCompletionLatched: normalized.degradedCompletionLatched,

      southNewsObserved: normalized.southNewsObserved,
      southNewsComposed: true,
      southNewsReturnedToNorth: false,
      southNewsSubmittedToWest: true,

      activeFibonacci: normalized.activeFibonacci,
      activeFibonacciRank: normalized.activeFibonacciRank,
      activeStageId: normalized.activeStageId,
      activeGearId: normalized.activeGearId,

      firstFailedCoordinate: normalized.firstFailedCoordinate,
      recommendedNextFile: normalized.recommendedNextFile,
      recommendedNextRenewalTarget: normalized.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };

    state.westHandoffCount += 1;
    state.lastWestHandoffPacket = clonePlain(packet);
    state.updatedAt = nowIso();

    return packet;
  }

  function composeSouthPrimaryPacket(input = {}) {
    try {
      const normalized = normalizeSouthInput(input);
      const cycle = resolveSouthCycle(normalized);
      const proofBody = composeProofBody(normalized);

      const northReturnPacket = cycle.cycleNumber === 1 ? composeNorthReturnPacket(normalized) : null;
      const westHandoffPacket = cycle.cycleNumber === 2 ? composeWestHandoffPacket(normalized) : null;

      const outputSpreadComposed = Boolean(
        cycle.cycleNumber === 2 &&
        (normalized.outputSpreadAvailable || proofBody.proofBodyComposed)
      );

      const packet = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        file: FILE,
        role: "south-primary-output-proof-cycle-gate",

        southPrimaryGateActive: true,
        outputProofComposerActive: true,
        cycleAwareRoutingActive: true,
        visibleStateComposerPreserved: true,

        cycleNumber: cycle.cycleNumber,
        activeCycleNumber: cycle.cycleNumber,
        cycleRoute: cycle.cycleRoute,
        activeCycleRoute: cycle.cycleRoute,
        receivedFrom: cycle.receivedFrom,
        returnTo: cycle.returnTo,
        handoffTo: cycle.handoffTo,

        activeCardinal: CARDINAL.SOUTH,
        activeFileGate: normalized.activeFileGate,
        activeFibonacci: normalized.activeFibonacci,
        activeFibonacciRank: normalized.activeFibonacciRank,
        activeNewsGate: normalized.activeNewsGate,
        activeStageId: normalized.activeStageId,
        activeGearId: normalized.activeGearId,
        activeGearLabel: normalized.activeGearLabel,
        activeGearRank: normalized.activeGearRank,

        westAuditObserved: normalized.westAuditObserved,
        westAuditRequired: cycle.cycleNumber === 2,
        northReturnRequired: cycle.cycleNumber === 1,
        canvasReleaseAuthorized: Boolean(normalized.canvasReleaseAuthorized && cycle.cycleNumber === 2),

        proofBodyComposed: proofBody.proofBodyComposed,
        proofBody,
        outputSpreadAvailable: normalized.outputSpreadAvailable,
        outputSpreadComposed,
        visibleStateComposed: true,
        receiptComposed: true,

        northReturnPacketReady: Boolean(northReturnPacket),
        westHandoffPacketReady: Boolean(westHandoffPacket),
        northReturnPacket,
        westHandoffPacket,

        southNewsObserved: normalized.southNewsObserved,
        southNewsComposed: true,
        southNewsReturnedToNorth: cycle.cycleNumber === 1,
        southNewsSubmittedToWest: cycle.cycleNumber === 2,
        northGateReady: normalized.northGateReady,
        eastGateReady: normalized.eastGateReady,
        westGateReady: normalized.westGateReady,
        southGateReady: normalized.southGateReady,
        canvasGateReady: normalized.canvasGateReady,
        newsGatePassedBeforeF21: normalized.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: normalized.newsGateDegradedBeforeF21,

        f8SelfDutySatisfied: normalized.f8SelfDutySatisfied,
        f13ProofBodyAvailable: normalized.f13ProofBodyAvailable,
        f13VisibleEvidenceAvailable: normalized.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: normalized.f13InspectEvidenceAvailable,
        f21EligibleForNorth: normalized.f21EligibleForNorth,
        f21SubmittedToNorth: cycle.cycleNumber === 1 ? Boolean(normalized.f21EligibleForNorth || normalized.f21SubmittedToNorth) : normalized.f21SubmittedToNorth,
        f21LatchMode: normalized.completionLatched ? normalized.f21LatchMode : "WAITING",
        completionLatched: normalized.completionLatched,
        degradedCompletionLatched: normalized.degradedCompletionLatched,

        firstFailedCoordinate: normalized.firstFailedCoordinate,
        recommendedNextFile: normalized.recommendedNextFile,
        recommendedNextRenewalTarget: normalized.recommendedNextRenewalTarget,

        southCompositionOk: true,
        southFallbackUsed: false,
        visibleStateRecoverable: true,

        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        updatedAt: nowIso()
      };

      state.composeCount += 1;
      state.lastPrimaryPacket = clonePlain(packet);
      state.updatedAt = packet.updatedAt;
      publishDataset();

      return packet;
    } catch (error) {
      return composeFallbackPrimaryPacket(input, error);
    }
  }

  function composeFallbackPrimaryPacket(input = {}, error = null) {
    const message = error && error.message ? error.message : safeString(error, "South output/proof composition fallback used.");

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: "south-primary-output-proof-cycle-gate",

      southPrimaryGateActive: true,
      outputProofComposerActive: true,
      cycleAwareRoutingActive: true,
      southFallbackUsed: true,
      southCompositionOk: false,
      southCompositionError: message,
      visibleStateRecoverable: true,

      cycleNumber: 1,
      activeCycleNumber: 1,
      cycleRoute: CYCLE_ROUTES.CYCLE_1,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_1,
      receivedFrom: CARDINAL.UNKNOWN,
      returnTo: CARDINAL.NORTH,
      handoffTo: "",

      activeCardinal: CARDINAL.SOUTH,
      activeFileGate: FILE_GATES.south,
      activeFibonacci: "F8",
      activeFibonacciRank: 8,
      activeNewsGate: "SOUTH",
      activeStageId: "SOUTH_OUTPUT_PROOF_COMPOSITION_FALLBACK",
      activeGearId: "SOUTH_OUTPUT_PROOF_COMPOSITION_FALLBACK",
      activeGearLabel: "South output/proof fallback",

      canvasReleaseAuthorized: false,
      westAuditRequired: false,
      northReturnRequired: true,
      proofBodyComposed: false,
      outputSpreadComposed: false,
      visibleStateComposed: true,
      receiptComposed: true,
      northReturnPacketReady: true,
      westHandoffPacketReady: false,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "WAITING",
      completionLatched: false,
      degradedCompletionLatched: false,

      firstFailedCoordinate: "WAITING_SOUTH_OUTPUT_PROOF_COMPOSITION",
      recommendedNextFile: FILE_GATES.south,
      recommendedNextRenewalTarget: FILE_GATES.south,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };

    state.fallbackCount += 1;
    state.lastPrimaryPacket = clonePlain(packet);
    state.updatedAt = packet.updatedAt;
    publishDataset();

    return packet;
  }

  function deriveLocalProgress(packet = {}) {
    if (packet.completionLatched) return 100;

    const explicit = getAnyNumber(packet, ["activeGearLocalProgress", "visibleProgress", "mainDisplayProgress"], NaN);
    if (Number.isFinite(explicit)) return clamp(explicit, 0, 100);

    let score = 20;
    if (packet.proofBodyComposed) score += 30;
    if (packet.visibleStateComposed) score += 15;
    if (packet.receiptComposed) score += 15;
    if (packet.northReturnPacketReady || packet.westHandoffPacketReady) score += 20;

    return clamp(score, 0, 100);
  }

  function composeVisibleState(input = {}) {
    try {
      const packet = input && input.southPrimaryGateActive ? input : composeSouthPrimaryPacket(input);
      const localProgress = deriveLocalProgress(packet);

      const visible = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        file: FILE,
        role: "south-primary-visible-state",

        activeCycleNumber: packet.activeCycleNumber || packet.cycleNumber || 1,
        activeCycleRoute: packet.activeCycleRoute || packet.cycleRoute || CYCLE_ROUTES.CYCLE_1,
        activeFileGate: packet.activeFileGate || FILE_GATES.south,
        activeCardinal: CARDINAL.SOUTH,
        activeFibonacci: packet.activeFibonacci || "F8",
        activeNewsGate: packet.activeNewsGate || "SOUTH",
        activeGearId: packet.activeGearId || "SOUTH_OUTPUT_PROOF_COMPOSITION",
        activeGearLabel: packet.activeGearLabel || "South output/proof composition",
        activeGearLocalProgress: localProgress,
        visibleProgress: localProgress,

        visibleStatusText: packet.completionLatched
          ? "Ready"
          : packet.proofBodyComposed
            ? packet.activeCycleNumber === 2
              ? "South proof spread composed; waiting for West audit"
              : "South proof body composed; returning to North"
            : "Composing South proof body",

        postgameStatus: packet.completionLatched
          ? packet.degradedCompletionLatched
            ? "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
            : "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
          : packet.southFallbackUsed
            ? "SOUTH_VISIBLE_STATE_FALLBACK_ACTIVE"
            : packet.activeCycleNumber === 2
              ? "SOUTH_CYCLE_2_HANDOFF_TO_WEST_READY"
              : "SOUTH_CYCLE_1_RETURN_TO_NORTH_READY",

        firstFailedCoordinate: packet.firstFailedCoordinate,
        recommendedNextFile: packet.recommendedNextFile,
        recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,

        proofBodyComposed: packet.proofBodyComposed,
        outputSpreadComposed: packet.outputSpreadComposed,
        northReturnPacketReady: packet.northReturnPacketReady,
        westHandoffPacketReady: packet.westHandoffPacketReady,
        canvasReleaseAuthorized: packet.canvasReleaseAuthorized,
        completionLatched: packet.completionLatched,
        degradedCompletionLatched: packet.degradedCompletionLatched,

        visibleStateComposed: true,
        receiptComposed: true,
        southFallbackUsed: packet.southFallbackUsed === true,
        visibleStateRecoverable: true,

        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        updatedAt: nowIso()
      };

      state.lastVisibleState = clonePlain(visible);
      state.updatedAt = visible.updatedAt;
      publishDataset();

      return visible;
    } catch (error) {
      return composeFallbackVisibleState(input, error);
    }
  }

  function composeFallbackVisibleState(input = {}, error = null) {
    const packet = composeFallbackPrimaryPacket(input, error);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: "south-primary-visible-state-fallback",

      activeCycleNumber: 1,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_1,
      activeFileGate: FILE_GATES.south,
      activeCardinal: CARDINAL.SOUTH,
      activeFibonacci: "F8",
      activeNewsGate: "SOUTH",
      activeGearId: "SOUTH_OUTPUT_PROOF_COMPOSITION_FALLBACK",
      activeGearLabel: "South output/proof fallback",
      activeGearLocalProgress: 20,
      visibleProgress: 20,
      visibleStatusText: "South output/proof fallback active",
      postgameStatus: "SOUTH_VISIBLE_STATE_FALLBACK_ACTIVE",

      firstFailedCoordinate: packet.firstFailedCoordinate,
      recommendedNextFile: packet.recommendedNextFile,
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,

      proofBodyComposed: false,
      outputSpreadComposed: false,
      northReturnPacketReady: true,
      westHandoffPacketReady: false,
      canvasReleaseAuthorized: false,
      completionLatched: false,
      degradedCompletionLatched: false,

      visibleStateComposed: true,
      receiptComposed: true,
      southFallbackUsed: true,
      visibleStateRecoverable: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeSouthReceiptState(input = {}) {
    const packet = input && input.southPrimaryGateActive ? input : composeSouthPrimaryPacket(input);

    const receiptState = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: "south-primary-receipt-state",

      southPrimaryGateActive: true,
      outputProofComposerActive: true,
      cycleAwareRoutingActive: true,
      cycleNumber: packet.cycleNumber,
      cycleRoute: packet.cycleRoute,
      receivedFrom: packet.receivedFrom,
      returnTo: packet.returnTo,
      handoffTo: packet.handoffTo,

      canvasReleaseAuthorized: packet.canvasReleaseAuthorized,
      westAuditRequired: packet.westAuditRequired,
      northReturnRequired: packet.northReturnRequired,
      proofBodyComposed: packet.proofBodyComposed,
      outputSpreadComposed: packet.outputSpreadComposed,
      visibleStateComposed: packet.visibleStateComposed,
      receiptComposed: packet.receiptComposed,
      northReturnPacketReady: packet.northReturnPacketReady,
      westHandoffPacketReady: packet.westHandoffPacketReady,

      f21EligibleForNorth: packet.f21EligibleForNorth,
      f21SubmittedToNorth: packet.f21SubmittedToNorth,
      completionLatched: packet.completionLatched,
      degradedCompletionLatched: packet.degradedCompletionLatched,

      southNewsObserved: packet.southNewsObserved,
      southNewsComposed: packet.southNewsComposed,
      southNewsReturnedToNorth: packet.southNewsReturnedToNorth,
      southNewsSubmittedToWest: packet.southNewsSubmittedToWest,

      activeFibonacci: packet.activeFibonacci,
      activeFibonacciRank: packet.activeFibonacciRank,
      activeStageId: packet.activeStageId,
      activeGearId: packet.activeGearId,
      f8SelfDutySatisfied: packet.f8SelfDutySatisfied,
      f13ProofBodyAvailable: packet.f13ProofBodyAvailable,
      f13VisibleEvidenceAvailable: packet.f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable: packet.f13InspectEvidenceAvailable,
      f21LatchMode: packet.f21LatchMode,

      firstFailedCoordinate: packet.firstFailedCoordinate,
      recommendedNextFile: packet.recommendedNextFile,
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };

    state.lastReceiptState = clonePlain(receiptState);
    state.updatedAt = receiptState.updatedAt;
    publishDataset();

    return receiptState;
  }

  function composeReceiptState(input = {}) {
    return composeSouthReceiptState(input);
  }

  function compose(input = {}) {
    return composeVisibleState(input);
  }

  function composeState(input = {}) {
    return composeVisibleState(input);
  }

  function composeCheckpointState(input = {}) {
    return composeVisibleState(input);
  }

  function composePostgameState(input = {}) {
    return composeVisibleState(input);
  }

  function composeTransmissionState(input = {}) {
    return composeVisibleState(input);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function composeReceiptText(receiptInput = {}) {
    const r = receiptInput && receiptInput.southPrimaryGateActive
      ? composeSouthReceiptState(receiptInput)
      : composeSouthReceiptState(receiptInput);

    return [
      "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_OUTPUT_PROOF_CYCLE_GATE_RECEIPT",
      "",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("baselineContract", r.baselineContract),
      line("version", r.version),
      line("file", r.file),
      line("role", r.role),
      "",
      line("southPrimaryGateActive", r.southPrimaryGateActive),
      line("outputProofComposerActive", r.outputProofComposerActive),
      line("cycleAwareRoutingActive", r.cycleAwareRoutingActive),
      line("cycleNumber", r.cycleNumber),
      line("cycleRoute", r.cycleRoute),
      line("receivedFrom", r.receivedFrom),
      line("returnTo", r.returnTo),
      line("handoffTo", r.handoffTo),
      "",
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("westAuditRequired", r.westAuditRequired),
      line("northReturnRequired", r.northReturnRequired),
      line("proofBodyComposed", r.proofBodyComposed),
      line("outputSpreadComposed", r.outputSpreadComposed),
      line("visibleStateComposed", r.visibleStateComposed),
      line("receiptComposed", r.receiptComposed),
      "",
      line("f21EligibleForNorth", r.f21EligibleForNorth),
      line("f21SubmittedToNorth", r.f21SubmittedToNorth),
      line("completionLatched", r.completionLatched),
      line("degradedCompletionLatched", r.degradedCompletionLatched),
      "",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      "",
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false),
      line("updatedAt", nowIso())
    ].join("\n");
  }

  function getSouthCycleReceipt(input = {}) {
    const normalized = normalizeSouthInput(input);
    const cycle = resolveSouthCycle(normalized);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      southCycleReceipt: "LAB_RUNTIME_TABLE_SOUTH_CYCLE_RECEIPT_v1",
      cycleResolved: true,
      cycleNumber: cycle.cycleNumber,
      cycleRoute: cycle.cycleRoute,
      receivedFrom: cycle.receivedFrom,
      returnTo: cycle.returnTo,
      handoffTo: cycle.handoffTo,
      northReturnRequired: cycle.northReturnRequired,
      westAuditRequired: cycle.westAuditRequired,
      canvasReleaseAuthorized: cycle.canvasReleaseAuthorized,
      fallbackCycleUsed: cycle.fallbackCycleUsed,
      unknownCycleDefaultsToNorthReturn: cycle.unknownCycleDefaultsToNorthReturn,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getSouthPrimaryGateReceipt() {
    return getReceipt();
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      destinationFile: FILE,
      file: FILE,
      status: "active",
      role: "south-primary-output-proof-cycle-gate",

      southAuthority: true,
      southLoaded: true,
      southPrimaryGateActive: true,
      outputProofComposerActive: true,
      cycleAwareRoutingActive: true,
      visibleStateComposerPreserved: true,
      southCycleOneReturnsToNorth: true,
      southCycleTwoHandsToWest: true,
      southCanvasReleaseRequiresWestAudit: true,
      southCanvasReleaseAuthorized: false,

      normalizeSouthInputExported: true,
      resolveSouthCycleExported: true,
      composeProofBodyExported: true,
      composeNorthReturnPacketExported: true,
      composeWestHandoffPacketExported: true,
      composeSouthPrimaryPacketExported: true,
      composeSouthReceiptStateExported: true,
      getSouthCycleReceiptExported: true,
      getSouthPrimaryGateReceiptExported: true,

      composeVisibleStateExported: true,
      composeFallbackVisibleStateExported: true,
      composeReceiptStateExported: true,
      composeReceiptTextExported: true,
      normalizeVisibleInputExported: true,
      compatibilityAliasesExported: true,
      nonThrowComposer: true,

      newsAlignment: {
        southNewsObserved: true,
        southNewsComposed: true,
        southDoesNotFinalizeNews: true
      },

      fibonacciSynchronization: {
        activeFibonacciPreserved: true,
        activeFibonacciRankPreserved: true,
        f8SelfDutyReported: true,
        f13ProofBodyReported: true,
        f21EligibilityMayBeSubmittedBySouth: true,
        northLatchesF21: true
      },

      exports: [
        "normalizeSouthInput",
        "resolveSouthCycle",
        "composeProofBody",
        "composeNorthReturnPacket",
        "composeWestHandoffPacket",
        "composeSouthPrimaryPacket",
        "composeSouthReceiptState",
        "getSouthCycleReceipt",
        "getSouthPrimaryGateReceipt",
        "composeVisibleState",
        "composeFallbackVisibleState",
        "composeReceiptState",
        "composeReceiptText",
        "normalizeVisibleInput",
        "compose",
        "composeState",
        "composeCheckpointState",
        "composePostgameState",
        "composeTransmissionState",
        "getReceipt"
      ],

      owns: [
        "south-output-composition",
        "south-proof-body-composition",
        "south-visible-state-composition",
        "south-receipt-state-composition",
        "cycle-1-north-return-packet",
        "cycle-2-west-handoff-packet"
      ],

      doesNotOwn: [
        "north-f21-latch",
        "west-admissibility-audit",
        "canvas-drawing",
        "canvas-direct-release-without-west",
        "source-stack-truth",
        "child-channel-truth",
        "final-visual-pass-claim"
      ],

      lastCycleResolution: clonePlain(state.lastCycleResolution),
      lastProofBody: clonePlain(state.lastProofBody),
      lastPrimaryPacket: clonePlain(state.lastPrimaryPacket),
      lastNorthReturnPacket: clonePlain(state.lastNorthReturnPacket),
      lastWestHandoffPacket: clonePlain(state.lastWestHandoffPacket),
      lastVisibleState: clonePlain(state.lastVisibleState),
      lastReceiptState: clonePlain(state.lastReceiptState),

      composeCount: state.composeCount,
      fallbackCount: state.fallbackCount,
      northReturnCount: state.northReturnCount,
      westHandoffCount: state.westHandoffCount,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: state.createdAt,
      updatedAt: nowIso()
    };
  }

  function publishDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.labRuntimeTableSouthLoaded = "true";
    dataset.labRuntimeTableSouthContract = CONTRACT;
    dataset.labRuntimeTableSouthReceipt = RECEIPT;
    dataset.labRuntimeTableSouthAuthority = "true";

    dataset.southPrimaryGateActive = "true";
    dataset.southOutputProofComposerActive = "true";
    dataset.southCycleAwareRoutingActive = "true";
    dataset.southCycleOneReturnsToNorth = "true";
    dataset.southCycleTwoHandsToWest = "true";
    dataset.southCanvasReleaseRequiresWestAudit = "true";
    dataset.southCanvasReleaseAuthorized = "false";

    dataset.southVisibleStateComposerLoaded = "true";
    dataset.southComposeVisibleStateExported = "true";
    dataset.southComposeReceiptTextExported = "true";
    dataset.southNonThrowComposer = "true";

    dataset.hearthRuntimeTableSouthLoaded = "true";
    dataset.hearthRuntimeTableSouthContract = CONTRACT;
    dataset.hearthRuntimeTableSouthReceipt = RECEIPT;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    destinationFile: FILE,

    FILE_GATES,
    CYCLE_ROUTES,
    CARDINAL,
    FIBONACCI_RANK,
    GEAR_SEQUENCE,
    gearSequence: GEAR_SEQUENCE,

    normalizeSouthInput,
    resolveSouthCycle,
    composeProofBody,
    composeNorthReturnPacket,
    composeWestHandoffPacket,
    composeSouthPrimaryPacket,
    composeSouthReceiptState,
    getSouthCycleReceipt,
    getSouthPrimaryGateReceipt,

    composeVisibleState,
    composeFallbackVisibleState,
    composeReceiptState,
    composeReceiptText,
    normalizeVisibleInput,

    compose,
    composeState,
    composeCheckpointState,
    composePostgameState,
    composeTransmissionState,

    getReceipt,

    southAuthority: true,
    southLoaded: true,
    southPrimaryGateActive: true,
    outputProofComposerActive: true,
    cycleAwareRoutingActive: true,
    visibleStateComposer: true,
    visibleStateComposerPreserved: true,
    nonThrowComposer: true,

    southCycleOneReturnsToNorth: true,
    southCycleTwoHandsToWest: true,
    southCanvasReleaseRequiresWestAudit: true,
    southCanvasReleaseAuthorized: false,

    southDoesNotLatchF21: true,
    southDoesNotAuditWestAdmissibility: true,
    southDoesNotDrawCanvas: true,
    southDoesNotClaimFinalVisualPass: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  function publishGlobals() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.HEARTH_RUNTIME_TABLE_SOUTH = api;
    root.HEARTH_SOUTH = api;
    root.HEARTH_VISIBLE_STATE_COMPOSER = api;

    root.LAB_RUNTIME_TABLE_SOUTH = api;
    root.RUNTIME_TABLE_SOUTH = api;
    root.DEXTER_LAB_RUNTIME_TABLE_SOUTH = api;
    root.LAB_CARDINAL_RUNTIME_TABLE_SOUTH = api;
    root.LAB_VISIBLE_STATE_COMPOSER_SOUTH = api;
    root.LAB_RUNTIME_TABLE_SOUTH_PRIMARY_GATE = api;

    root.DEXTER_LAB.runtimeTableSouth = api;
    root.DEXTER_LAB.cardinalRuntimeTableSouth = api;
    root.DEXTER_LAB.south = api;
    root.DEXTER_LAB.visibleStateComposer = api;
    root.DEXTER_LAB.transmissionVisibleStateComposer = api;
    root.DEXTER_LAB.southPrimaryGate = api;

    root.HEARTH.runtimeTableSouth = api;
    root.HEARTH.south = api;
    root.HEARTH.visibleStateComposer = api;
    root.HEARTH.southPrimaryGate = api;

    if (root.DEXTER_LAB.runtimeTable && isObject(root.DEXTER_LAB.runtimeTable)) {
      root.DEXTER_LAB.runtimeTable.south = api;
      root.DEXTER_LAB.runtimeTable.runtimeTableSouth = api;
      root.DEXTER_LAB.runtimeTable.cardinalRuntimeTableSouth = api;
      root.DEXTER_LAB.runtimeTable.visibleStateComposerSouth = api;
      root.DEXTER_LAB.runtimeTable.southPrimaryGate = api;
    }

    if (root.LAB_RUNTIME_TABLE && isObject(root.LAB_RUNTIME_TABLE)) {
      root.LAB_RUNTIME_TABLE.south = api;
      root.LAB_RUNTIME_TABLE.runtimeTableSouth = api;
      root.LAB_RUNTIME_TABLE.cardinalRuntimeTableSouth = api;
      root.LAB_RUNTIME_TABLE.visibleStateComposerSouth = api;
      root.LAB_RUNTIME_TABLE.southPrimaryGate = api;
    }

    publishDataset();
  }

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
