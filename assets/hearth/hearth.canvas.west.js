// /assets/hearth/hearth.canvas.west.js
// HEARTH_CANVAS_WEST_PARENT_ACCLIMATED_F13W_INSPECTION_RELEASE_EVIDENCE_CHILD_TNT_v4
// Full-file replacement.
// Canvas West / F13W inspection, view-state, drag, zoom, invalidation, and release-evidence observer child only.
// Purpose:
// - Serve the authoritative Canvas parent under /assets/hearth/hearth.canvas.js without requiring parent mutation.
// - Accustom downstream West to the parent contract.
// - Own child-level F13W inspection/view/control readiness.
// - Preserve parent-required public methods:
//   bindInspection, getViewState, setRotation, resetRotation, setZoom, getReceipt.
// - Preserve working drag, pinch, wheel, keyboard, zoom, and invalidation control.
// - Preserve cached-texture inspection only.
// - Do not trigger atlas rebuild from ordinary zoom or drag.
// - Observe/echo explicit Macro West / route-conductor release evidence without becoming Macro West authority.
// - Remove false release inference from empty packets, route shape alone, or receivedFrom=WEST alone.
// - Renew NEWS/Fibonacci receipt discipline: active rank is F13W; F13N remains legacy compatibility only.
// Does not own:
// - macro West admissibility decision
// - Canvas release authorization
// - Runtime Table governance
// - route readiness
// - planet truth
// - material truth
// - hydrology truth
// - atlas source
// - atlas formation
// - texture composition
// - sphere rendering
// - visible proof
// - Canvas parent boot
// - F21 latch
// - ready text
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_WEST_PARENT_ACCLIMATED_F13W_INSPECTION_RELEASE_EVIDENCE_CHILD_TNT_v4";
  const RECEIPT = "HEARTH_CANVAS_WEST_PARENT_ACCLIMATED_F13W_INSPECTION_RELEASE_EVIDENCE_CHILD_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_WEST_F13N_RELEASE_EVIDENCE_OBSERVER_CHILD_TNT_v3";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_WEST_F13N_INSPECTION_VIEW_INVALIDATION_CHILD_TNT_v2";
  const VERSION = "2026-06-01.hearth-canvas-west-parent-acclimated-f13w-inspection-release-evidence-child-v4";
  const FILE = "/assets/hearth/hearth.canvas.west.js";
  const PARENT_FILE = "/assets/hearth/hearth.canvas.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_YAW = -0.18;
  const DEFAULT_PITCH = 0.05;
  const DEFAULT_ZOOM = 1;
  const ZOOM_MIN = 0.82;
  const ZOOM_MAX = 2.8;
  const PITCH_MIN = -1.18;
  const PITCH_MAX = 1.18;

  const MACRO_CYCLE_1 = "NORTH_EAST_WEST_SOUTH_NORTH";
  const MACRO_CYCLE_2 = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const CANVAS_CHILD_SEQUENCE = "CANVAS_EAST_ATLAS_SOURCE__CANVAS_WEST_INSPECTION_VIEW__CANVAS_SOUTH_TEXTURE_RENDER__CANVAS_PARENT_F13_EVIDENCE";

  const ACTIVE_FIBONACCI_RANK = "F13W";
  const LEGACY_FIBONACCI_RANK = "F13N";
  const ACTIVE_STAGE_ID = "canvas-west-f13w-inspection-release-evidence-observer";
  const ACTIVE_GEAR_ID = "hearth-canvas-west-f13w-release-evidence-observer";

  const EXPLICIT_RELEASE_DECISIONS = Object.freeze([
    "RELEASE_TO_CANVAS",
    "FULL_PASS",
    "DEGRADED_FORWARD"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    role: "canvas-west-parent-acclimated-f13w-inspection-release-evidence-child",

    parentAuthorityAccepted: true,
    downstreamAccustomsToParent: true,
    westDoesNotRecommendParentMutation: true,
    parentMutationRecommended: false,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,

    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,
    deprecatedCycleOrder: "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST",
    canvasWestMacroWest: false,
    canvasWestChildWest: true,
    canvasReceivesAfterMacroWestRelease: true,
    canvasWestDoesNotAuthorizeCanvasRelease: true,
    canvasWestObservesReleaseEvidenceOnly: true,
    releaseEvidenceObserverActive: true,
    observerReadyNoReleaseEvidence: true,

    receivedFrom: "",
    returnTo: "",
    handoffTo: "",
    cycleNumber: 0,
    cycleRoute: "",
    sourceFile: "",
    destinationFile: PARENT_FILE,

    westAuditObserved: false,
    westAuditAccepted: false,
    westAuditPassed: false,
    westAuditDegraded: false,
    westAuditBlocked: false,
    westCanvasReleaseApproved: false,
    westCanvasReleaseApprovedObserved: false,
    canvasReleaseEvidenceObserved: false,
    canvasReleaseEvidenceReady: false,
    canvasReleaseAuthorizedByWestObserved: false,
    releaseToCanvasObserved: false,
    macroWestReleaseEvidenceReady: false,
    macroWestReleaseEvidenceSource: "NONE",
    releaseEvidenceStrict: false,
    releaseEvidenceDegraded: false,
    releaseEvidenceExplicit: false,
    lastReleaseEvidenceAt: "",
    lastReleaseEvidencePacket: null,

    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,

    activeFibonacci: 13,
    activeFibonacciRank: ACTIVE_FIBONACCI_RANK,
    legacyFibonacciRank: LEGACY_FIBONACCI_RANK,
    legacyF13NAliasAccepted: true,
    legacyF13NIsNotActiveRank: true,
    activeStageId: ACTIVE_STAGE_ID,
    activeGearId: ACTIVE_GEAR_ID,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    f8SelfDutySatisfied: false,
    f13ProofBodyAvailable: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13InspectEvidenceDegraded: false,
    f13wInspectionReady: false,
    f13nInspectionReady: false,
    f13wReleaseEvidenceObserved: false,
    f13wReleaseEvidenceReady: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21LatchMode: "north-only",

    canvasWestLoaded: true,
    canvasWestApiReady: false,
    canvasWestControlReady: false,
    canvasWestActive: true,
    canvasWestReady: false,
    splitAdapterRole: "WEST",
    splitAdapterTransistorMode: true,
    admissibilityControlActive: true,

    inspectionBound: false,
    inspectionReady: false,
    inspectionDegraded: false,
    inspectionBindDegraded: false,
    viewStateReady: false,
    controlsReady: false,
    rotationReady: false,
    zoomReady: false,
    invalidationReady: false,
    invalidationRequested: false,

    bound: false,
    bindAttempted: false,
    bindCount: 0,
    degradedBindCount: 0,
    unbindCount: 0,
    canvasPresent: false,
    canvasNonZeroSize: false,
    canvasTagAccepted: false,
    canvasDatasetStamped: false,

    dragInspectionBound: false,
    zoomInspectionBound: false,
    pointerInspectionActive: false,
    pointerInspectionPainted: false,
    pointerInspectionMoved: false,
    viewInteractionOccurred: false,
    controlInteractionOccurred: false,
    interactiveRotationActive: true,

    yaw: DEFAULT_YAW,
    pitch: DEFAULT_PITCH,
    rotationYaw: DEFAULT_YAW,
    rotationPitch: DEFAULT_PITCH,
    defaultYaw: DEFAULT_YAW,
    defaultPitch: DEFAULT_PITCH,

    zoomEnabled: true,
    zoomLevel: DEFAULT_ZOOM,
    zoomMin: ZOOM_MIN,
    zoomMax: ZOOM_MAX,
    zoomLodPrepared: true,
    zoomLodLevel: 1,
    zoomUsesCachedTexture: true,
    zoomDoesNotOwnPlanetTruth: true,
    zoomDoesNotTriggerAtlasRebuild: true,

    pointerDragCount: 0,
    pointerDownCount: 0,
    pointerMoveCount: 0,
    pointerUpCount: 0,
    pointerCancelCount: 0,
    pointerActiveCount: 0,
    wheelZoomCount: 0,
    keyboardControlCount: 0,
    zoomInteractionCount: 0,
    interactionCount: 0,
    invalidationSignalCount: 0,

    activePointerId: null,
    activePointers: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerStartX: 0,
    pointerStartY: 0,
    dragStartedAt: "",
    lastInteractionAt: "",
    lastZoomAt: "",
    lastZoomSource: "",
    lastInvalidationAt: "",
    lastInvalidationReason: "",

    pinchActive: false,
    pinchStartDistance: 0,
    pinchStartZoom: DEFAULT_ZOOM,

    canvasWidth: 0,
    canvasHeight: 0,
    dpr: 1,

    onChangeAvailable: false,
    onInvalidateAvailable: false,
    onChangeError: "",
    onInvalidateError: "",

    ownsReleaseEvidenceObservation: true,
    ownsReleaseAuthorization: false,
    ownsMacroWestAdmissibility: false,
    ownsInvalidationControl: true,
    ownsDragInspection: true,
    ownsZoomInspection: true,
    ownsViewState: true,
    ownsAtlasSource: false,
    ownsAtlasFormation: false,
    ownsTextureComposition: false,
    ownsSphereRendering: false,
    ownsVisibleProof: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteReadiness: false,
    ownsCanvasParentBoot: false,
    ownsReadyText: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    imageRendered: false,
    visibleContentProof: false,
    visualPassClaimed: false,
    f21ClaimedByCanvasWest: false,
    readyTextClaimedByCanvasWest: false,

    localEvents: [],
    errors: [],
    updatedAt: ""
  };

  const runtime = {
    canvas: null,
    callbacks: {
      onChange: null,
      onInvalidate: null
    },
    cleanup: [],
    activePointers: new Map()
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function isElementLike(value) {
    return Boolean(value && typeof value === "object" && isFunction(value.addEventListener));
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clampZoom(value) {
    return clamp(value, state.zoomMin, state.zoomMax);
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function pathRead(path) {
    const parts = String(path || "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return {};

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : {};
      } catch (_error) {
        return {};
      }
    }

    if (isFunction(authority.getReceiptLight)) {
      try {
        const receipt = authority.getReceiptLight();
        return isObject(receipt) ? receipt : {};
      } catch (_error) {
        return {};
      }
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return {};
  }

  function flattenInput(input = {}) {
    const source = isObject(input) ? input : {};
    const detail = isObject(source.detail) ? source.detail : {};
    const snapshot = isObject(source.snapshot) ? source.snapshot : {};
    const release = isObject(source.release) ? source.release : {};
    const releasePacket = isObject(source.releasePacket) ? source.releasePacket : {};
    const canvasReleasePacket = isObject(source.canvasReleasePacket) ? source.canvasReleasePacket : {};
    const receipt = isObject(source.receiptPacket) ? source.receiptPacket : {};
    const west = isObject(source.west) ? source.west : {};
    const westReceipt = isObject(source.westReceipt) ? source.westReceipt : {};
    const admissibility = isObject(source.admissibility) ? source.admissibility : {};
    const gap = isObject(source.gap) ? source.gap : {};

    return {
      ...snapshot,
      ...detail,
      ...release,
      ...releasePacket,
      ...canvasReleasePacket,
      ...receipt,
      ...west,
      ...westReceipt,
      ...admissibility,
      ...gap,
      ...source
    };
  }

  function asList(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null || value === "") return [];
    return [value];
  }

  function fieldDeep(input, names, maxDepth = 7) {
    const wanted = new Set(asList(names));
    const queue = [{ value: input, depth: 0 }];
    const seen = typeof WeakSet !== "undefined" ? new WeakSet() : null;

    while (queue.length) {
      const current = queue.shift();
      const value = current.value;

      if (!isObject(value) || current.depth > maxDepth) continue;
      if (seen && seen.has(value)) continue;
      if (seen) seen.add(value);

      for (const key of Object.keys(value)) {
        if (wanted.has(key)) return value[key];
      }

      for (const key of Object.keys(value)) {
        const next = value[key];
        if (isObject(next)) queue.push({ value: next, depth: current.depth + 1 });
      }
    }

    return undefined;
  }

  function getAnyString(input, names, fallback = "") {
    const value = fieldDeep(input, names);
    return value === undefined || value === null ? fallback : String(value);
  }

  function getAnyBool(input, names, fallback = false) {
    return safeBool(fieldDeep(input, names), fallback);
  }

  function getAnyNumber(input, names, fallback = 0) {
    return safeNumber(fieldDeep(input, names), fallback);
  }

  function normalizeCardinal(value = "") {
    const text = safeString(value).trim().toUpperCase();
    if (["NORTH", "EAST", "SOUTH", "WEST", "CANVAS"].includes(text)) return text;
    return text;
  }

  function normalizeCycleRoute(value = "") {
    const text = safeString(value).toUpperCase().replace(/\s+/g, "");

    if (
      text.includes("NORTH_EAST_WEST_SOUTH_NORTH") ||
      text.includes("NORTH→EAST→WEST→SOUTH→NORTH") ||
      text.includes("NORTH->EAST->WEST->SOUTH->NORTH")
    ) {
      return MACRO_CYCLE_1;
    }

    if (
      text.includes("NORTH_EAST_SOUTH_WEST_CANVAS") ||
      text.includes("NORTH→EAST→SOUTH→WEST→CANVAS") ||
      text.includes("NORTH->EAST->SOUTH->WEST->CANVAS")
    ) {
      return MACRO_CYCLE_2;
    }

    return safeString(value, "");
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);

    if (state.localEvents.length > 140) {
      state.localEvents.splice(0, state.localEvents.length - 140);
    }

    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      event: code,
      message: error && error.message ? error.message : String(error || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);

    if (state.errors.length > 90) {
      state.errors.splice(0, state.errors.length - 90);
    }

    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function readMacroWestAuthorityReceipt() {
    const candidates = [
      pathRead("LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST"),
      pathRead("HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH"),
      pathRead("LAB_RUNTIME_TABLE_WEST"),
      pathRead("RUNTIME_TABLE_WEST"),
      pathRead("DEXTER_LAB_RUNTIME_TABLE_WEST"),
      pathRead("LAB_CARDINAL_RUNTIME_TABLE_WEST"),
      pathRead("LAB_TRANSMISSION_GAP_CLASSIFIER_WEST"),
      pathRead("DEXTER_LAB.cycleAwareAdmissibilityClutchWest"),
      pathRead("DEXTER_LAB.runtimeTableWest"),
      pathRead("DEXTER_LAB.cardinalRuntimeTableWest"),
      pathRead("HEARTH_RUNTIME_TABLE_WEST"),
      pathRead("HEARTH.westRuntimeTable"),
      pathRead("HEARTH.macroWest"),
      pathRead("HEARTH_ROUTE_CONDUCTOR"),
      pathRead("HEARTH.routeConductor")
    ].filter(Boolean);

    for (const candidate of candidates) {
      const receipt = readReceipt(candidate);
      if (receipt && Object.keys(receipt).length) return receipt;
    }

    return {};
  }

  function hasExplicitReleaseEvidence(input) {
    const decision = getAnyString(input, ["decision", "westDecision"], "");
    const forwardAllowed = getAnyBool(input, ["forwardAllowed", "westForwardAllowed"], false);
    const hardBlock = getAnyBool(input, ["hardBlock", "westHardBlock", "westAuditBlocked"], false);

    return Boolean(
      getAnyBool(input, ["westCanvasReleaseApproved"], false) ||
      getAnyBool(input, ["canvasReleaseApprovedByWest"], false) ||
      getAnyBool(input, ["westReleaseApproved"], false) ||
      getAnyBool(input, ["canvasReleaseAuthorizedByWest"], false) ||
      getAnyBool(input, ["westAuthorizedCanvasRelease"], false) ||
      getAnyBool(input, ["canvasReleaseAuthorized"], false) ||
      getAnyBool(input, ["releaseToCanvas"], false) ||
      getAnyBool(input, ["canvasReleaseApproved"], false) ||
      decision === "RELEASE_TO_CANVAS" ||
      (decision === "FULL_PASS" && forwardAllowed && !hardBlock) ||
      (decision === "DEGRADED_FORWARD" && forwardAllowed && !hardBlock)
    );
  }

  function hasExplicitAuditEvidence(input) {
    const decision = getAnyString(input, ["decision", "westDecision"], "");

    return Boolean(
      getAnyBool(input, ["westAuditObserved", "westAuditPresent", "westReviewObserved", "gapAssessed"], false) ||
      getAnyBool(input, ["westAuditAccepted", "westAccepted", "westHandoffAccepted", "auditAccepted"], false) ||
      getAnyBool(input, ["westAuditPassed", "auditPassed", "admissibilityReady", "westGateReady"], false) ||
      getAnyBool(input, ["westAuditDegraded", "westGateDegradedReady", "canDegradeForward"], false) ||
      getAnyBool(input, ["westAuditBlocked", "hardBlock", "westHardBlock"], false) ||
      EXPLICIT_RELEASE_DECISIONS.includes(decision) ||
      decision === "HARD_BLOCK"
    );
  }

  function normalizeReleaseEvidence(input = {}) {
    const flat = flattenInput(input);
    const macroWestReceipt = readMacroWestAuthorityReceipt();
    const merged = {
      ...macroWestReceipt,
      ...flat
    };

    const receivedFrom = normalizeCardinal(
      getAnyString(merged, ["receivedFrom", "sourceCardinal", "activeCardinal", "sender"], "") ||
      datasetValue("hearthCanvasReceivedFrom", "") ||
      datasetValue("hearthRouteConductorReceivedFrom", "")
    );

    const handoffTo = normalizeCardinal(
      getAnyString(merged, ["handoffTo", "handoff", "targetCardinal"], "") ||
      datasetValue("hearthCanvasHandoffTo", "") ||
      datasetValue("hearthRouteConductorHandoffTo", "")
    );

    const returnTo = normalizeCardinal(
      getAnyString(merged, ["returnTo"], "") ||
      datasetValue("hearthCanvasReturnTo", "")
    );

    const cycleRoute = normalizeCycleRoute(
      getAnyString(merged, ["cycleRoute", "activeCycleRoute", "routeCycle"], "") ||
      datasetValue("hearthCanvasCycleRoute", "") ||
      datasetValue("hearthRouteConductorCycleRoute", "")
    );

    let cycleNumber = getAnyNumber(merged, ["cycleNumber", "activeCycleNumber"], 0);
    if (!cycleNumber && cycleRoute === MACRO_CYCLE_1) cycleNumber = 1;
    if (!cycleNumber && cycleRoute === MACRO_CYCLE_2) cycleNumber = 2;

    const sourceFile =
      getAnyString(merged, ["sourceFile", "file", "fromFile"], "") ||
      datasetValue("hearthCanvasReleaseSourceFile", "");

    const destinationFile =
      getAnyString(merged, ["destinationFile", "targetFile", "toFile"], "") ||
      datasetValue("hearthCanvasReleaseDestinationFile", "") ||
      PARENT_FILE;

    const explicitAudit = hasExplicitAuditEvidence(merged);
    const explicitRelease = hasExplicitReleaseEvidence(merged);

    const decision = getAnyString(merged, ["decision", "westDecision"], "");
    const hardBlock = Boolean(
      getAnyBool(merged, ["westAuditBlocked", "hardBlock", "westHardBlock"], false) ||
      decision === "HARD_BLOCK"
    );

    const degradedDecision = Boolean(
      getAnyBool(merged, ["westAuditDegraded", "westGateDegradedReady", "canDegradeForward"], false) ||
      decision === "DEGRADED_FORWARD"
    );

    const passedDecision = Boolean(
      getAnyBool(merged, ["westAuditPassed", "auditPassed", "admissibilityReady", "westGateReady"], false) ||
      decision === "FULL_PASS" ||
      decision === "RELEASE_TO_CANVAS"
    );

    const westAuditObserved = Boolean(explicitAudit);
    const westAuditBlocked = Boolean(hardBlock);
    const westAuditPassed = Boolean(explicitAudit && !hardBlock && passedDecision);
    const westAuditDegraded = Boolean(explicitAudit && !hardBlock && degradedDecision);
    const westAuditAccepted = Boolean(
      explicitAudit &&
      !hardBlock &&
      (
        westAuditPassed ||
        westAuditDegraded ||
        getAnyBool(merged, ["westAuditAccepted", "westAccepted", "westHandoffAccepted", "auditAccepted"], false)
      )
    );

    const westCanvasReleaseApproved = Boolean(explicitRelease && !hardBlock);
    const canvasReleaseAuthorizedByWestObserved = Boolean(
      explicitRelease &&
      !hardBlock &&
      (
        getAnyBool(merged, ["canvasReleaseAuthorizedByWest", "westAuthorizedCanvasRelease", "canvasReleaseAuthorized"], false) ||
        westCanvasReleaseApproved
      )
    );

    const releaseToCanvasObserved = Boolean(
      explicitRelease &&
      !hardBlock &&
      (
        getAnyBool(merged, ["releaseToCanvas"], false) ||
        westCanvasReleaseApproved
      )
    );

    const evidenceObserved = Boolean(explicitAudit || explicitRelease);
    const evidenceStrict = Boolean(explicitRelease && !hardBlock && !westAuditDegraded);
    const evidenceDegraded = Boolean(explicitRelease && !hardBlock && westAuditDegraded && !evidenceStrict);
    const evidenceReady = Boolean(explicitRelease && !hardBlock);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      role: state.role,

      parentAuthorityAccepted: true,
      downstreamAccustomsToParent: true,
      westDoesNotRecommendParentMutation: true,
      parentMutationRecommended: false,

      releaseEvidenceObserverActive: true,
      observerReadyNoReleaseEvidence: !evidenceObserved,
      canvasWestDoesNotAuthorizeCanvasRelease: true,
      canvasWestObservesReleaseEvidenceOnly: true,
      ownsReleaseAuthorization: false,
      ownsMacroWestAdmissibility: false,

      receivedFrom,
      returnTo,
      handoffTo,
      cycleNumber,
      cycleRoute,
      sourceFile,
      destinationFile,

      westAuditObserved,
      westAuditAccepted,
      westAuditPassed,
      westAuditDegraded,
      westAuditBlocked,
      westCanvasReleaseApproved,
      westCanvasReleaseApprovedObserved: westCanvasReleaseApproved,
      canvasReleaseEvidenceObserved: evidenceObserved,
      canvasReleaseEvidenceReady: evidenceReady,
      canvasReleaseAuthorizedByWestObserved,
      releaseToCanvasObserved,
      macroWestReleaseEvidenceReady: evidenceReady,
      macroWestReleaseEvidenceSource: evidenceReady ? "EXPLICIT_MACRO_WEST_OR_ROUTE_CONDUCTOR_RELEASE_EVIDENCE" : "NONE",
      releaseEvidenceStrict: evidenceStrict,
      releaseEvidenceDegraded: evidenceDegraded,
      releaseEvidenceExplicit: explicitRelease,

      routeShapeAloneIgnored: true,
      receivedFromWestAloneIgnored: true,
      handoffToCanvasAloneIgnored: true,

      northGateReady: false,
      eastGateReady: false,
      westGateReady: state.westGateReady,
      southGateReady: false,
      canvasGateReady: false,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: false,

      activeFibonacci: 13,
      activeFibonacciRank: ACTIVE_FIBONACCI_RANK,
      legacyFibonacciRank: LEGACY_FIBONACCI_RANK,
      legacyF13NAliasAccepted: true,
      legacyF13NIsNotActiveRank: true,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,

      f13wReleaseEvidenceObserved: evidenceObserved,
      f13wReleaseEvidenceReady: evidenceReady,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "north-only",
      f21ClaimedByCanvasWest: false,
      readyTextClaimedByCanvasWest: false,
      visualPassClaimed: false,

      observedAt: nowIso(),
      raw: clonePlain(input),
      macroWestReceipt: clonePlain(macroWestReceipt)
    };
  }

  function applyReleaseEvidence(packet = {}, source = "observeWestReleaseEvidence") {
    const evidence = normalizeReleaseEvidence(packet);

    state.observerReadyNoReleaseEvidence = evidence.observerReadyNoReleaseEvidence;
    state.receivedFrom = evidence.receivedFrom;
    state.returnTo = evidence.returnTo;
    state.handoffTo = evidence.handoffTo;
    state.cycleNumber = evidence.cycleNumber;
    state.cycleRoute = evidence.cycleRoute;
    state.sourceFile = evidence.sourceFile;
    state.destinationFile = evidence.destinationFile || PARENT_FILE;

    state.westAuditObserved = evidence.westAuditObserved;
    state.westAuditAccepted = evidence.westAuditAccepted;
    state.westAuditPassed = evidence.westAuditPassed;
    state.westAuditDegraded = evidence.westAuditDegraded;
    state.westAuditBlocked = evidence.westAuditBlocked;
    state.westCanvasReleaseApproved = evidence.westCanvasReleaseApproved;
    state.westCanvasReleaseApprovedObserved = evidence.westCanvasReleaseApprovedObserved;
    state.canvasReleaseEvidenceObserved = evidence.canvasReleaseEvidenceObserved;
    state.canvasReleaseEvidenceReady = evidence.canvasReleaseEvidenceReady;
    state.canvasReleaseAuthorizedByWestObserved = evidence.canvasReleaseAuthorizedByWestObserved;
    state.releaseToCanvasObserved = evidence.releaseToCanvasObserved;
    state.macroWestReleaseEvidenceReady = evidence.macroWestReleaseEvidenceReady;
    state.macroWestReleaseEvidenceSource = evidence.macroWestReleaseEvidenceSource;
    state.releaseEvidenceStrict = evidence.releaseEvidenceStrict;
    state.releaseEvidenceDegraded = evidence.releaseEvidenceDegraded;
    state.releaseEvidenceExplicit = evidence.releaseEvidenceExplicit;
    state.f13wReleaseEvidenceObserved = evidence.f13wReleaseEvidenceObserved;
    state.f13wReleaseEvidenceReady = evidence.f13wReleaseEvidenceReady;
    state.lastReleaseEvidenceAt = evidence.observedAt;
    state.lastReleaseEvidencePacket = clonePlain(evidence);

    recordLocal(evidence.canvasReleaseEvidenceObserved ? "WEST_RELEASE_EVIDENCE_OBSERVED" : "WEST_RELEASE_EVIDENCE_OBSERVER_NO_RELEASE_EVIDENCE", {
      source,
      receivedFrom: state.receivedFrom,
      handoffTo: state.handoffTo,
      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westAuditPassed: state.westAuditPassed,
      westAuditDegraded: state.westAuditDegraded,
      westAuditBlocked: state.westAuditBlocked,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasReleaseEvidenceReady: state.canvasReleaseEvidenceReady,
      ownsReleaseAuthorization: false,
      routeShapeAloneIgnored: true,
      parentMutationRecommended: false
    });

    updateDataset();

    return getCanvasReleaseEvidence();
  }

  function observeWestReleaseEvidence(packet = {}) {
    return applyReleaseEvidence(packet, "observeWestReleaseEvidence");
  }

  function acceptWestReleaseEvidence(packet = {}) {
    return applyReleaseEvidence(packet, "acceptWestReleaseEvidence");
  }

  function receiveWestReleaseEvidence(packet = {}) {
    return applyReleaseEvidence(packet, "receiveWestReleaseEvidence");
  }

  function getCanvasReleaseEvidence() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      role: state.role,

      parentAuthorityAccepted: true,
      downstreamAccustomsToParent: true,
      westDoesNotRecommendParentMutation: true,
      parentMutationRecommended: false,

      releaseEvidenceObserverActive: true,
      observerReadyNoReleaseEvidence: state.observerReadyNoReleaseEvidence,
      canvasWestDoesNotAuthorizeCanvasRelease: true,
      canvasWestObservesReleaseEvidenceOnly: true,
      ownsReleaseAuthorization: false,
      ownsMacroWestAdmissibility: false,

      receivedFrom: state.receivedFrom,
      returnTo: state.returnTo,
      handoffTo: state.handoffTo,
      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      sourceFile: state.sourceFile,
      destinationFile: state.destinationFile,

      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westAuditPassed: state.westAuditPassed,
      westAuditDegraded: state.westAuditDegraded,
      westAuditBlocked: state.westAuditBlocked,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      westCanvasReleaseApprovedObserved: state.westCanvasReleaseApprovedObserved,
      canvasReleaseEvidenceObserved: state.canvasReleaseEvidenceObserved,
      canvasReleaseEvidenceReady: state.canvasReleaseEvidenceReady,
      canvasReleaseAuthorizedByWestObserved: state.canvasReleaseAuthorizedByWestObserved,
      releaseToCanvasObserved: state.releaseToCanvasObserved,
      macroWestReleaseEvidenceReady: state.macroWestReleaseEvidenceReady,
      macroWestReleaseEvidenceSource: state.macroWestReleaseEvidenceSource,
      releaseEvidenceStrict: state.releaseEvidenceStrict,
      releaseEvidenceDegraded: state.releaseEvidenceDegraded,
      releaseEvidenceExplicit: state.releaseEvidenceExplicit,
      lastReleaseEvidenceAt: state.lastReleaseEvidenceAt,

      routeShapeAloneIgnored: true,
      receivedFromWestAloneIgnored: true,
      handoffToCanvasAloneIgnored: true,

      northGateReady: false,
      eastGateReady: false,
      westGateReady: state.westGateReady,
      southGateReady: false,
      canvasGateReady: false,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: false,

      activeFibonacci: 13,
      activeFibonacciRank: ACTIVE_FIBONACCI_RANK,
      legacyFibonacciRank: LEGACY_FIBONACCI_RANK,
      legacyF13NAliasAccepted: true,
      legacyF13NIsNotActiveRank: true,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      f13wReleaseEvidenceObserved: state.f13wReleaseEvidenceObserved,
      f13wReleaseEvidenceReady: state.f13wReleaseEvidenceReady,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "north-only",
      f21ClaimedByCanvasWest: false,
      readyTextClaimedByCanvasWest: false,
      visualPassClaimed: false,

      updatedAt: state.updatedAt
    };
  }

  function getReleaseEvidenceReceipt() {
    return getCanvasReleaseEvidence();
  }

  function deriveReadiness() {
    const yawReady = Number.isFinite(Number(state.yaw));
    const pitchReady = Number.isFinite(Number(state.pitch));
    const zoomFinite = Number.isFinite(Number(state.zoomLevel));
    const zoomWithinBounds = zoomFinite && state.zoomLevel >= state.zoomMin && state.zoomLevel <= state.zoomMax;

    const requiredMethodsReady =
      isFunction(bindInspection) &&
      isFunction(getViewState) &&
      isFunction(setRotation) &&
      isFunction(resetRotation) &&
      isFunction(setZoom) &&
      isFunction(getReceipt);

    state.canvasWestApiReady = requiredMethodsReady;
    state.viewStateReady = yawReady && pitchReady && zoomWithinBounds;
    state.rotationReady = yawReady && pitchReady;
    state.zoomReady = zoomWithinBounds;
    state.invalidationReady = isFunction(requestInvalidation) && isFunction(invalidate) && isFunction(invalidateView);
    state.controlsReady = state.viewStateReady && state.rotationReady && state.zoomReady && state.invalidationReady;
    state.canvasWestControlReady = state.controlsReady;

    state.canvasPresent = Boolean(runtime.canvas);
    state.inspectionBound = Boolean(state.bound && state.canvasPresent);
    state.inspectionReady = Boolean(state.inspectionBound && state.viewStateReady && state.controlsReady);
    state.inspectionDegraded = Boolean(state.canvasWestApiReady && state.controlsReady && !state.inspectionReady);

    state.f13InspectEvidenceAvailable = Boolean(state.inspectionReady || state.inspectionDegraded);
    state.f13InspectEvidenceDegraded = Boolean(state.inspectionDegraded);
    state.f13wInspectionReady = Boolean(state.f13InspectEvidenceAvailable);
    state.f13nInspectionReady = Boolean(state.f13InspectEvidenceAvailable);

    state.westGateReady = Boolean(state.canvasWestApiReady && state.viewStateReady && state.controlsReady);
    state.canvasWestReady = Boolean(state.canvasWestApiReady);

    state.northGateReady = false;
    state.eastGateReady = false;
    state.southGateReady = false;
    state.canvasGateReady = false;
    state.newsGatePassedBeforeF21 = false;
    state.newsGateDegradedBeforeF21 = Boolean(
      state.f13InspectEvidenceDegraded ||
      state.releaseEvidenceDegraded
    );

    state.f8SelfDutySatisfied = false;
    state.f13ProofBodyAvailable = false;
    state.f13VisibleEvidenceAvailable = false;
    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21LatchMode = "north-only";
    state.visualPassClaimed = false;
    state.f21ClaimedByCanvasWest = false;
    state.readyTextClaimedByCanvasWest = false;
    state.parentMutationRecommended = false;

    return {
      canvasWestApiReady: state.canvasWestApiReady,
      canvasWestControlReady: state.canvasWestControlReady,
      viewStateReady: state.viewStateReady,
      controlsReady: state.controlsReady,
      rotationReady: state.rotationReady,
      zoomReady: state.zoomReady,
      invalidationReady: state.invalidationReady,
      inspectionReady: state.inspectionReady,
      inspectionDegraded: state.inspectionDegraded,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13InspectEvidenceDegraded: state.f13InspectEvidenceDegraded,
      f13wInspectionReady: state.f13wInspectionReady,
      f13nInspectionReady: state.f13nInspectionReady,
      westGateReady: state.westGateReady,
      canvasReleaseEvidenceReady: state.canvasReleaseEvidenceReady
    };
  }

  function eventPoint(event) {
    return {
      id: event.pointerId !== undefined ? event.pointerId : "mouse",
      x: safeNumber(event.clientX, 0),
      y: safeNumber(event.clientY, 0)
    };
  }

  function measureCanvas(canvas) {
    if (!canvas) {
      state.canvasWidth = 0;
      state.canvasHeight = 0;
      state.dpr = 1;
      state.canvasNonZeroSize = false;
      return { width: 0, height: 0, dpr: 1 };
    }

    let width = safeNumber(canvas.width, 0);
    let height = safeNumber(canvas.height, 0);

    if (canvas.getBoundingClientRect) {
      const rect = canvas.getBoundingClientRect();
      width = width || safeNumber(rect.width, 0);
      height = height || safeNumber(rect.height, 0);
    }

    const dpr = clamp(root.devicePixelRatio || 1, 1, 3);

    state.canvasWidth = width;
    state.canvasHeight = height;
    state.dpr = dpr;
    state.canvasNonZeroSize = width > 0 && height > 0;

    return { width, height, dpr };
  }

  function stampCanvas(canvas) {
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthCanvasWestBound = String(state.bound);
    canvas.dataset.hearthCanvasWestContract = CONTRACT;
    canvas.dataset.hearthCanvasWestReceipt = RECEIPT;
    canvas.dataset.hearthCanvasWestRole = state.role;

    canvas.dataset.hearthCanvasWestLoaded = "true";
    canvas.dataset.hearthCanvasWestApiReady = String(state.canvasWestApiReady);
    canvas.dataset.hearthCanvasWestInspectionReady = String(state.inspectionReady);
    canvas.dataset.hearthCanvasWestInspectionDegraded = String(state.inspectionDegraded);
    canvas.dataset.hearthCanvasWestF13InspectEvidenceAvailable = String(state.f13InspectEvidenceAvailable);
    canvas.dataset.hearthCanvasWestF13InspectEvidenceDegraded = String(state.f13InspectEvidenceDegraded);
    canvas.dataset.hearthCanvasWestF13WInspectionReady = String(state.f13wInspectionReady);
    canvas.dataset.hearthCanvasWestF13NInspectionReady = String(state.f13nInspectionReady);

    canvas.dataset.hearthCanvasWestActiveFibonacciRank = ACTIVE_FIBONACCI_RANK;
    canvas.dataset.hearthCanvasWestLegacyFibonacciRank = LEGACY_FIBONACCI_RANK;
    canvas.dataset.hearthCanvasWestLegacyF13NAliasAccepted = "true";
    canvas.dataset.hearthCanvasWestLegacyF13NIsNotActiveRank = "true";

    canvas.dataset.hearthCanvasWestReleaseEvidenceObserverActive = "true";
    canvas.dataset.hearthCanvasWestObserverReadyNoReleaseEvidence = String(state.observerReadyNoReleaseEvidence);
    canvas.dataset.hearthCanvasWestDoesNotAuthorizeCanvasRelease = "true";
    canvas.dataset.hearthCanvasWestReleaseEvidenceReady = String(state.canvasReleaseEvidenceReady);
    canvas.dataset.hearthCanvasWestAuditObserved = String(state.westAuditObserved);
    canvas.dataset.hearthCanvasWestReleaseApproved = String(state.westCanvasReleaseApproved);

    canvas.dataset.hearthCanvasWestDragInspectionBound = String(state.dragInspectionBound);
    canvas.dataset.hearthCanvasWestZoomInspectionBound = String(state.zoomInspectionBound);
    canvas.dataset.hearthCanvasWestZoomDoesNotTriggerAtlasRebuild = "true";

    canvas.dataset.hearthCanvasWestParentAuthorityAccepted = "true";
    canvas.dataset.hearthCanvasWestDownstreamAccustomsToParent = "true";
    canvas.dataset.hearthCanvasWestDoesNotRecommendParentMutation = "true";
    canvas.dataset.hearthCanvasWestParentMutationRecommended = "false";

    canvas.dataset.hearthCanvasWestOwnsReleaseAuthorization = "false";
    canvas.dataset.hearthCanvasWestOwnsMacroWestAdmissibility = "false";
    canvas.dataset.hearthCanvasWestOwnsPlanetTruth = "false";
    canvas.dataset.hearthCanvasWestOwnsVisibleProof = "false";
    canvas.dataset.hearthCanvasWestOwnsTextureComposition = "false";
    canvas.dataset.hearthCanvasWestOwnsSphereRendering = "false";
    canvas.dataset.hearthCanvasWestOwnsF21 = "false";

    canvas.dataset.visualPassClaimed = "false";

    state.canvasDatasetStamped = true;
  }

  function updateDataset() {
    deriveReadiness();

    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasWestLoaded = "true";
    dataset.hearthCanvasWestContract = CONTRACT;
    dataset.hearthCanvasWestReceipt = RECEIPT;
    dataset.hearthCanvasWestPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasWestBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasWestVersion = VERSION;
    dataset.hearthCanvasWestFile = FILE;
    dataset.hearthCanvasWestParentFile = PARENT_FILE;
    dataset.hearthCanvasWestRole = state.role;

    dataset.hearthCanvasWestParentAuthorityAccepted = "true";
    dataset.hearthCanvasWestDownstreamAccustomsToParent = "true";
    dataset.hearthCanvasWestDoesNotRecommendParentMutation = "true";
    dataset.hearthCanvasWestParentMutationRecommended = "false";

    dataset.hearthCanvasWestNewsProtocolSynchronized = "true";
    dataset.hearthCanvasWestFibonacciAlignmentSynchronized = "true";

    dataset.hearthCanvasWestMacroCycle1 = state.macroCycle1;
    dataset.hearthCanvasWestMacroCycle2 = state.macroCycle2;
    dataset.hearthCanvasWestCanvasChildSequence = state.canvasChildSequence;
    dataset.hearthCanvasWestDeprecatedCycleOrder = state.deprecatedCycleOrder;
    dataset.hearthCanvasWestMacroWest = String(state.canvasWestMacroWest);
    dataset.hearthCanvasWestChildWest = String(state.canvasWestChildWest);
    dataset.hearthCanvasWestCanvasReceivesAfterMacroWestRelease = "true";
    dataset.hearthCanvasWestDoesNotAuthorizeCanvasRelease = "true";
    dataset.hearthCanvasWestObservesReleaseEvidenceOnly = "true";

    dataset.hearthCanvasWestReleaseEvidenceObserverActive = "true";
    dataset.hearthCanvasWestObserverReadyNoReleaseEvidence = String(state.observerReadyNoReleaseEvidence);
    dataset.hearthCanvasWestReceivedFrom = state.receivedFrom;
    dataset.hearthCanvasWestReturnTo = state.returnTo;
    dataset.hearthCanvasWestHandoffTo = state.handoffTo;
    dataset.hearthCanvasWestCycleNumber = String(state.cycleNumber);
    dataset.hearthCanvasWestCycleRoute = state.cycleRoute;
    dataset.hearthCanvasWestSourceFile = state.sourceFile;
    dataset.hearthCanvasWestDestinationFile = state.destinationFile;
    dataset.hearthCanvasWestAuditObserved = String(state.westAuditObserved);
    dataset.hearthCanvasWestAuditAccepted = String(state.westAuditAccepted);
    dataset.hearthCanvasWestAuditPassed = String(state.westAuditPassed);
    dataset.hearthCanvasWestAuditDegraded = String(state.westAuditDegraded);
    dataset.hearthCanvasWestAuditBlocked = String(state.westAuditBlocked);
    dataset.hearthCanvasWestReleaseApproved = String(state.westCanvasReleaseApproved);
    dataset.hearthCanvasWestCanvasReleaseEvidenceObserved = String(state.canvasReleaseEvidenceObserved);
    dataset.hearthCanvasWestCanvasReleaseEvidenceReady = String(state.canvasReleaseEvidenceReady);
    dataset.hearthCanvasWestCanvasReleaseAuthorizedByWestObserved = String(state.canvasReleaseAuthorizedByWestObserved);
    dataset.hearthCanvasWestReleaseToCanvasObserved = String(state.releaseToCanvasObserved);
    dataset.hearthCanvasWestMacroReleaseEvidenceReady = String(state.macroWestReleaseEvidenceReady);
    dataset.hearthCanvasWestF13WReleaseEvidenceObserved = String(state.f13wReleaseEvidenceObserved);
    dataset.hearthCanvasWestF13WReleaseEvidenceReady = String(state.f13wReleaseEvidenceReady);
    dataset.hearthCanvasWestRouteShapeAloneIgnored = "true";
    dataset.hearthCanvasWestReceivedFromWestAloneIgnored = "true";
    dataset.hearthCanvasWestHandoffToCanvasAloneIgnored = "true";

    dataset.hearthCanvasWestNorthGateReady = String(state.northGateReady);
    dataset.hearthCanvasWestEastGateReady = String(state.eastGateReady);
    dataset.hearthCanvasWestWestGateReady = String(state.westGateReady);
    dataset.hearthCanvasWestSouthGateReady = String(state.southGateReady);
    dataset.hearthCanvasWestCanvasGateReady = String(state.canvasGateReady);
    dataset.hearthCanvasWestNewsGatePassedBeforeF21 = String(state.newsGatePassedBeforeF21);
    dataset.hearthCanvasWestNewsGateDegradedBeforeF21 = String(state.newsGateDegradedBeforeF21);

    dataset.hearthCanvasWestActiveFibonacci = String(state.activeFibonacci);
    dataset.hearthCanvasWestActiveFibonacciRank = ACTIVE_FIBONACCI_RANK;
    dataset.hearthCanvasWestLegacyFibonacciRank = LEGACY_FIBONACCI_RANK;
    dataset.hearthCanvasWestLegacyF13NAliasAccepted = "true";
    dataset.hearthCanvasWestLegacyF13NIsNotActiveRank = "true";
    dataset.hearthCanvasWestActiveStageId = state.activeStageId;
    dataset.hearthCanvasWestActiveGearId = state.activeGearId;
    dataset.hearthCanvasWestActiveFibonacciGate = state.activeFibonacciGate;
    dataset.hearthCanvasWestFutureFibonacciGate = state.futureFibonacciGate;
    dataset.hearthCanvasWestOneActiveGearAtATime = "true";
    dataset.hearthCanvasWestF8SelfDutySatisfied = String(state.f8SelfDutySatisfied);
    dataset.hearthCanvasWestF13ProofBodyAvailable = String(state.f13ProofBodyAvailable);
    dataset.hearthCanvasWestF13VisibleEvidenceAvailable = String(state.f13VisibleEvidenceAvailable);
    dataset.hearthCanvasWestF13InspectEvidenceAvailable = String(state.f13InspectEvidenceAvailable);
    dataset.hearthCanvasWestF13InspectEvidenceDegraded = String(state.f13InspectEvidenceDegraded);
    dataset.hearthCanvasWestF13WInspectionReady = String(state.f13wInspectionReady);
    dataset.hearthCanvasWestF13NInspectionReady = String(state.f13nInspectionReady);
    dataset.hearthCanvasWestF21EligibleForNorth = String(state.f21EligibleForNorth);
    dataset.hearthCanvasWestF21SubmittedToNorth = String(state.f21SubmittedToNorth);
    dataset.hearthCanvasWestF21LatchMode = state.f21LatchMode;

    dataset.hearthCanvasWestActive = "true";
    dataset.hearthCanvasWestApiReady = String(state.canvasWestApiReady);
    dataset.hearthCanvasWestControlReady = String(state.canvasWestControlReady);
    dataset.hearthCanvasWestReady = String(state.canvasWestReady);
    dataset.hearthCanvasWestBound = String(state.bound);
    dataset.hearthCanvasWestInspectionBound = String(state.inspectionBound);
    dataset.hearthCanvasWestInspectionReady = String(state.inspectionReady);
    dataset.hearthCanvasWestInspectionDegraded = String(state.inspectionDegraded);
    dataset.hearthCanvasWestInspectionBindDegraded = String(state.inspectionBindDegraded);
    dataset.hearthCanvasWestViewStateReady = String(state.viewStateReady);
    dataset.hearthCanvasWestControlsReady = String(state.controlsReady);
    dataset.hearthCanvasWestRotationReady = String(state.rotationReady);
    dataset.hearthCanvasWestZoomReady = String(state.zoomReady);
    dataset.hearthCanvasWestInvalidationReady = String(state.invalidationReady);
    dataset.hearthCanvasWestInvalidationRequested = String(state.invalidationRequested);

    dataset.hearthCanvasWestDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthCanvasWestZoomInspectionBound = String(state.zoomInspectionBound);
    dataset.hearthCanvasWestPointerInspectionActive = String(state.pointerInspectionActive);
    dataset.hearthCanvasWestPointerInspectionPainted = String(state.pointerInspectionPainted);
    dataset.hearthCanvasWestPointerInspectionMoved = String(state.pointerInspectionMoved);
    dataset.hearthCanvasWestViewInteractionOccurred = String(state.viewInteractionOccurred);
    dataset.hearthCanvasWestControlInteractionOccurred = String(state.controlInteractionOccurred);

    dataset.hearthCanvasWestYaw = String(state.yaw);
    dataset.hearthCanvasWestPitch = String(state.pitch);
    dataset.hearthCanvasWestZoomLevel = String(state.zoomLevel);
    dataset.hearthCanvasWestZoomMin = String(state.zoomMin);
    dataset.hearthCanvasWestZoomMax = String(state.zoomMax);
    dataset.hearthCanvasWestZoomUsesCachedTexture = "true";
    dataset.hearthCanvasWestZoomDoesNotTriggerAtlasRebuild = "true";

    dataset.hearthCanvasWestOwnsReleaseEvidenceObservation = "true";
    dataset.hearthCanvasWestOwnsReleaseAuthorization = "false";
    dataset.hearthCanvasWestOwnsMacroWestAdmissibility = "false";
    dataset.hearthCanvasWestOwnsInvalidationControl = "true";
    dataset.hearthCanvasWestOwnsDragInspection = "true";
    dataset.hearthCanvasWestOwnsZoomInspection = "true";
    dataset.hearthCanvasWestOwnsViewState = "true";
    dataset.hearthCanvasWestOwnsAtlasSource = "false";
    dataset.hearthCanvasWestOwnsAtlasFormation = "false";
    dataset.hearthCanvasWestOwnsTextureComposition = "false";
    dataset.hearthCanvasWestOwnsSphereRendering = "false";
    dataset.hearthCanvasWestOwnsVisibleProof = "false";
    dataset.hearthCanvasWestOwnsPlanetTruth = "false";
    dataset.hearthCanvasWestOwnsMaterialTruth = "false";
    dataset.hearthCanvasWestOwnsRuntimeTableGovernance = "false";
    dataset.hearthCanvasWestOwnsRouteReadiness = "false";
    dataset.hearthCanvasWestOwnsCanvasParentBoot = "false";
    dataset.hearthCanvasWestOwnsReadyText = "false";
    dataset.hearthCanvasWestOwnsF21 = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.hearthCanvasWestImageRendered = "false";
    dataset.hearthCanvasWestVisibleContentProof = "false";
    dataset.hearthCanvasWestF21ClaimedByCanvasWest = "false";
    dataset.hearthCanvasWestReadyTextClaimedByCanvasWest = "false";
    dataset.visualPassClaimed = "false";

    if (runtime.canvas) {
      stampCanvas(runtime.canvas);
    }
  }

  function addEvent(target, type, handler, options) {
    if (!target || !isFunction(target.addEventListener)) return;

    target.addEventListener(type, handler, options);
    runtime.cleanup.push(() => {
      try {
        target.removeEventListener(type, handler, options);
      } catch (_error) {}
    });
  }

  function cleanupListeners() {
    runtime.cleanup.splice(0).forEach((cleanup) => {
      try {
        cleanup();
      } catch (_error) {}
    });

    runtime.activePointers.clear();
    state.activePointers = 0;
    state.pointerActiveCount = 0;
    state.activePointerId = null;
    state.pointerInspectionActive = false;
    state.pinchActive = false;
  }

  function notifyChange(source = "west-change", detail = {}) {
    state.interactionCount += 1;
    state.lastInteractionAt = nowIso();
    state.viewInteractionOccurred = true;
    state.controlInteractionOccurred = true;

    const payload = {
      source,
      contract: CONTRACT,
      receipt: RECEIPT,
      view: getViewState(),
      detail: clonePlain(detail),

      releaseEvidence: getCanvasReleaseEvidence(),
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13InspectEvidenceDegraded: state.f13InspectEvidenceDegraded,
      f13wInspectionReady: state.f13wInspectionReady,
      zoomDoesNotTriggerAtlasRebuild: true,
      ordinaryViewChangeOnly: true,

      parentAuthorityAccepted: true,
      downstreamAccustomsToParent: true,
      westDoesNotRecommendParentMutation: true,
      parentMutationRecommended: false,

      visualPassClaimed: false,
      f21ClaimedByCanvasWest: false,
      f21EligibleForNorth: false,
      f21LatchMode: "north-only"
    };

    if (isFunction(runtime.callbacks.onChange)) {
      try {
        runtime.callbacks.onChange(payload);
        state.onChangeError = "";
      } catch (error) {
        state.onChangeError = error && error.message ? error.message : String(error);
        recordError("WEST_ON_CHANGE_FAILED", error, { source });
      }
    }

    if (root.dispatchEvent && root.CustomEvent) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-west-change", {
          detail: payload
        }));
      } catch (_error) {}
    }

    updateDataset();
    return payload;
  }

  function notifyInvalidation(reason = "west-explicit-invalidation", detail = {}) {
    state.invalidationSignalCount += 1;
    state.invalidationRequested = true;
    state.lastInvalidationAt = nowIso();
    state.lastInvalidationReason = String(reason || "west-explicit-invalidation");

    const payload = {
      source: "hearth.canvas.west",
      reason: state.lastInvalidationReason,
      contract: CONTRACT,
      receipt: RECEIPT,
      view: getViewState(),
      releaseEvidence: getCanvasReleaseEvidence(),
      detail: clonePlain(detail),

      invalidationMeans: "view/control state changed; downstream consumer may refresh",
      invalidationDoesNotMeanTextureComposed: true,
      invalidationDoesNotMeanSphereRendered: true,
      invalidationDoesNotMeanVisibleProofPassed: true,
      invalidationDoesNotMeanF21Eligible: true,
      invalidationDoesNotMeanVisualPassClaimed: true,

      zoomDoesNotTriggerAtlasRebuild: true,
      parentAuthorityAccepted: true,
      downstreamAccustomsToParent: true,
      westDoesNotRecommendParentMutation: true,
      parentMutationRecommended: false,

      visualPassClaimed: false,
      f21ClaimedByCanvasWest: false,
      f21EligibleForNorth: false,
      f21LatchMode: "north-only"
    };

    if (isFunction(runtime.callbacks.onInvalidate)) {
      try {
        runtime.callbacks.onInvalidate(state.lastInvalidationReason, payload);
        state.onInvalidateError = "";
      } catch (error) {
        state.onInvalidateError = error && error.message ? error.message : String(error);
        recordError("WEST_ON_INVALIDATE_FAILED", error, { reason });
      }
    }

    if (root.dispatchEvent && root.CustomEvent) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-west-invalidate", {
          detail: payload
        }));
      } catch (_error) {}
    }

    updateDataset();
    return payload;
  }

  function setCursor(canvas, value) {
    if (!canvas || !canvas.style) return;
    canvas.style.cursor = value;
  }

  function getPointerDistance() {
    const points = Array.from(runtime.activePointers.values());

    if (points.length < 2) return 0;

    const a = points[0];
    const b = points[1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return Math.hypot(dx, dy);
  }

  function handlePointerDown(event) {
    if (!runtime.canvas) return;

    const point = eventPoint(event);

    runtime.activePointers.set(point.id, point);
    state.activePointers = runtime.activePointers.size;
    state.pointerActiveCount = runtime.activePointers.size;
    state.pointerDownCount += 1;
    state.pointerInspectionActive = true;
    state.activePointerId = point.id;
    state.pointerStartX = point.x;
    state.pointerStartY = point.y;
    state.lastPointerX = point.x;
    state.lastPointerY = point.y;
    state.dragStartedAt = nowIso();

    try {
      if (runtime.canvas.setPointerCapture && event.pointerId !== undefined) {
        runtime.canvas.setPointerCapture(event.pointerId);
      }
    } catch (_error) {}

    if (runtime.activePointers.size >= 2) {
      state.pinchActive = true;
      state.pinchStartDistance = getPointerDistance();
      state.pinchStartZoom = state.zoomLevel;
    }

    setCursor(runtime.canvas, "grabbing");
    updateDataset();

    if (event.cancelable) event.preventDefault();
  }

  function handlePointerMove(event) {
    if (!runtime.canvas) return;

    const point = eventPoint(event);

    if (!runtime.activePointers.has(point.id)) return;

    runtime.activePointers.set(point.id, point);

    state.pointerMoveCount += 1;
    state.pointerActiveCount = runtime.activePointers.size;
    state.activePointers = runtime.activePointers.size;

    const size = measureCanvas(runtime.canvas);
    const width = Math.max(1, size.width);
    const height = Math.max(1, size.height);

    if (state.pinchActive && runtime.activePointers.size >= 2) {
      const distance = getPointerDistance();

      if (state.pinchStartDistance > 0 && distance > 0) {
        const factor = distance / state.pinchStartDistance;
        setZoom(state.pinchStartZoom * factor, {
          source: "pinch",
          notify: true,
          invalidate: false
        });
      }

      if (event.cancelable) event.preventDefault();
      return;
    }

    if (state.activePointerId !== point.id) return;

    const dx = point.x - state.lastPointerX;
    const dy = point.y - state.lastPointerY;

    state.lastPointerX = point.x;
    state.lastPointerY = point.y;

    const sensitivity = 1 / Math.max(0.65, state.zoomLevel);
    const yawDelta = (dx / width) * Math.PI * 1.38 * sensitivity;
    const pitchDelta = (dy / height) * Math.PI * 1.05 * sensitivity;

    state.yaw += yawDelta;
    state.pitch = clamp(state.pitch + pitchDelta, PITCH_MIN, PITCH_MAX);
    state.rotationYaw = state.yaw;
    state.rotationPitch = state.pitch;

    state.pointerDragCount += 1;
    state.pointerInspectionPainted = true;
    state.pointerInspectionMoved = true;
    state.viewInteractionOccurred = true;
    state.controlInteractionOccurred = true;

    notifyChange("pointer-drag", {
      dx,
      dy,
      yawDelta,
      pitchDelta,
      zoomLevel: state.zoomLevel,
      pointerInspectionPaintedMeansControlInteractionOnly: true,
      pointerInspectionPaintedDoesNotMeanVisibleProof: true,
      pointerInspectionPaintedDoesNotMeanRenderedFrame: true,
      pointerInspectionPaintedDoesNotMeanF13VisibleEvidence: true,
      parentMutationRecommended: false
    });

    if (event.cancelable) event.preventDefault();
  }

  function handlePointerUp(event) {
    if (!runtime.canvas) return;

    const point = eventPoint(event);

    runtime.activePointers.delete(point.id);

    state.pointerUpCount += 1;
    state.pointerActiveCount = runtime.activePointers.size;
    state.activePointers = runtime.activePointers.size;

    if (state.activePointerId === point.id) {
      state.activePointerId = runtime.activePointers.size
        ? Array.from(runtime.activePointers.keys())[0]
        : null;
    }

    if (runtime.activePointers.size < 2) {
      state.pinchActive = false;
      state.pinchStartDistance = 0;
      state.pinchStartZoom = state.zoomLevel;
    }

    if (runtime.activePointers.size === 0) {
      state.pointerInspectionActive = false;
      setCursor(runtime.canvas, "grab");
    }

    try {
      if (runtime.canvas.releasePointerCapture && event.pointerId !== undefined) {
        runtime.canvas.releasePointerCapture(event.pointerId);
      }
    } catch (_error) {}

    updateDataset();

    if (event.cancelable) event.preventDefault();
  }

  function handlePointerCancel(event) {
    const point = eventPoint(event);

    runtime.activePointers.delete(point.id);

    state.pointerCancelCount += 1;
    state.pointerActiveCount = runtime.activePointers.size;
    state.activePointers = runtime.activePointers.size;

    if (runtime.activePointers.size === 0) {
      state.pointerInspectionActive = false;
      state.pinchActive = false;
      state.activePointerId = null;
      setCursor(runtime.canvas, "grab");
    }

    updateDataset();
  }

  function handleWheel(event) {
    if (!state.zoomEnabled) return;

    const delta = safeNumber(event.deltaY, 0);
    const factor = Math.exp(-delta * 0.0015);
    const nextZoom = state.zoomLevel * factor;

    setZoom(nextZoom, {
      source: "wheel",
      notify: true,
      invalidate: false
    });

    state.wheelZoomCount += 1;

    if (event.cancelable) event.preventDefault();
  }

  function handleKeyDown(event) {
    const key = String(event.key || "");
    const step = event.shiftKey ? 0.16 : 0.08;

    let handled = false;

    if (key === "ArrowLeft") {
      state.yaw -= step;
      handled = true;
    } else if (key === "ArrowRight") {
      state.yaw += step;
      handled = true;
    } else if (key === "ArrowUp") {
      state.pitch = clamp(state.pitch - step, PITCH_MIN, PITCH_MAX);
      handled = true;
    } else if (key === "ArrowDown") {
      state.pitch = clamp(state.pitch + step, PITCH_MIN, PITCH_MAX);
      handled = true;
    } else if (key === "+" || key === "=") {
      setZoom(state.zoomLevel + 0.12, {
        source: "keyboard-plus",
        notify: true,
        invalidate: false
      });
      handled = true;
    } else if (key === "-" || key === "_") {
      setZoom(state.zoomLevel - 0.12, {
        source: "keyboard-minus",
        notify: true,
        invalidate: false
      });
      handled = true;
    } else if (key === "0") {
      resetZoom({ source: "keyboard-reset-zoom" });
      handled = true;
    } else if (key.toLowerCase() === "r") {
      resetRotation({ source: "keyboard-reset-rotation" });
      handled = true;
    }

    if (!handled) return;

    state.rotationYaw = state.yaw;
    state.rotationPitch = state.pitch;
    state.keyboardControlCount += 1;
    state.viewInteractionOccurred = true;
    state.controlInteractionOccurred = true;

    notifyChange("keyboard-control", { key });

    if (event.cancelable) event.preventDefault();
  }

  function normalizeBindInput(input = {}) {
    if (isElementLike(input)) {
      return { canvas: input };
    }

    if (!isObject(input)) {
      return {};
    }

    return input;
  }

  function bindInspection(options = {}) {
    const packet = normalizeBindInput(options);

    if (
      isObject(packet.releaseEvidence) ||
      isObject(packet.releasePacket) ||
      isObject(packet.canvasReleasePacket) ||
      hasExplicitAuditEvidence(packet) ||
      hasExplicitReleaseEvidence(packet)
    ) {
      observeWestReleaseEvidence(packet.releaseEvidence || packet.releasePacket || packet.canvasReleasePacket || packet);
    }

    state.bindAttempted = true;
    state.bindCount += 1;
    state.inspectionBindDegraded = false;

    const canvas = packet.canvas || packet.target || packet.element || runtime.canvas;

    if (!canvas || !isFunction(canvas.addEventListener)) {
      state.degradedBindCount += 1;
      state.bound = false;
      state.inspectionBound = false;
      state.inspectionReady = false;
      state.inspectionDegraded = true;
      state.dragInspectionBound = false;
      state.zoomInspectionBound = false;
      state.canvasPresent = false;
      state.inspectionBindDegraded = true;
      state.f13InspectEvidenceAvailable = state.canvasWestApiReady && state.controlsReady;
      state.f13InspectEvidenceDegraded = true;
      state.f13wInspectionReady = state.f13InspectEvidenceAvailable;
      state.f13nInspectionReady = state.f13InspectEvidenceAvailable;

      recordLocal("WEST_BIND_INSPECTION_DEGRADED_NO_CANVAS", {
        reason: "missing-or-unbound-canvas",
        hardFailure: false,
        f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
        f13InspectEvidenceDegraded: true,
        f13wInspectionReady: state.f13wInspectionReady,
        parentMutationRecommended: false
      });

      updateDataset();
      return getReceipt();
    }

    try {
      cleanupListeners();

      runtime.canvas = canvas;
      runtime.callbacks.onChange = isFunction(packet.onChange) ? packet.onChange : null;
      runtime.callbacks.onInvalidate = isFunction(packet.onInvalidate) ? packet.onInvalidate : null;

      state.onChangeAvailable = Boolean(runtime.callbacks.onChange);
      state.onInvalidateAvailable = Boolean(runtime.callbacks.onInvalidate);

      if (Number.isFinite(Number(packet.yaw))) {
        state.yaw = Number(packet.yaw);
      }

      if (Number.isFinite(Number(packet.pitch))) {
        state.pitch = clamp(Number(packet.pitch), PITCH_MIN, PITCH_MAX);
      }

      if (Number.isFinite(Number(packet.zoomLevel)) || Number.isFinite(Number(packet.zoom))) {
        state.zoomLevel = clampZoom(Number(packet.zoomLevel !== undefined ? packet.zoomLevel : packet.zoom));
      }

      state.rotationYaw = state.yaw;
      state.rotationPitch = state.pitch;

      measureCanvas(canvas);

      state.canvasPresent = true;
      state.canvasTagAccepted = String(canvas.tagName || "").toLowerCase() === "canvas";
      state.bound = true;
      state.inspectionBound = true;
      state.inspectionBindDegraded = false;
      state.dragInspectionBound = true;
      state.zoomInspectionBound = true;
      state.pointerInspectionPainted = false;
      state.pointerInspectionMoved = false;
      state.pointerInspectionActive = false;

      if (canvas.style) {
        canvas.style.touchAction = "none";
        canvas.style.cursor = "grab";
        canvas.style.userSelect = "none";
      }

      if (!canvas.hasAttribute || !canvas.hasAttribute("tabindex")) {
        try {
          canvas.setAttribute("tabindex", "0");
        } catch (_error) {}
      }

      updateDataset();
      stampCanvas(canvas);

      addEvent(canvas, "pointerdown", handlePointerDown, { passive: false });
      addEvent(canvas, "pointermove", handlePointerMove, { passive: false });
      addEvent(canvas, "pointerup", handlePointerUp, { passive: false });
      addEvent(canvas, "pointercancel", handlePointerCancel, { passive: false });
      addEvent(canvas, "lostpointercapture", handlePointerCancel, { passive: false });
      addEvent(canvas, "wheel", handleWheel, { passive: false });
      addEvent(canvas, "keydown", handleKeyDown, { passive: false });

      if (root && isFunction(root.addEventListener)) {
        addEvent(root, "resize", () => {
          measureCanvas(canvas);
          notifyChange("resize", { width: state.canvasWidth, height: state.canvasHeight });
        }, { passive: true });
      }

      recordLocal("WEST_BIND_INSPECTION_COMPLETE", {
        canvasPresent: true,
        canvasTagAccepted: state.canvasTagAccepted,
        canvasNonZeroSize: state.canvasNonZeroSize,
        onChangeAvailable: state.onChangeAvailable,
        onInvalidateAvailable: state.onInvalidateAvailable,
        zoomLevel: state.zoomLevel,
        f13InspectEvidenceAvailable: true,
        f13wInspectionReady: true,
        canvasReleaseEvidenceReady: state.canvasReleaseEvidenceReady,
        parentMutationRecommended: false
      });

      updateDataset();
      return getReceipt();
    } catch (error) {
      state.bound = false;
      state.inspectionBound = false;
      state.inspectionReady = false;
      state.inspectionDegraded = true;
      state.inspectionBindDegraded = true;
      state.f13InspectEvidenceAvailable = state.canvasWestApiReady && state.controlsReady;
      state.f13InspectEvidenceDegraded = true;
      state.f13wInspectionReady = state.f13InspectEvidenceAvailable;
      state.f13nInspectionReady = state.f13InspectEvidenceAvailable;

      recordError("WEST_BIND_INSPECTION_FAILED", error, {
        hardFailure: true,
        canvasPresent: Boolean(canvas),
        parentMutationRecommended: false
      });

      updateDataset();
      return getReceipt();
    }
  }

  function unbindInspection() {
    cleanupListeners();

    state.unbindCount += 1;
    state.bound = false;
    state.inspectionBound = false;
    state.inspectionReady = false;
    state.inspectionDegraded = true;
    state.inspectionBindDegraded = true;
    state.dragInspectionBound = false;
    state.zoomInspectionBound = false;
    state.pointerInspectionActive = false;
    state.pinchActive = false;
    state.f13InspectEvidenceAvailable = state.canvasWestApiReady && state.controlsReady;
    state.f13InspectEvidenceDegraded = true;
    state.f13wInspectionReady = state.f13InspectEvidenceAvailable;
    state.f13nInspectionReady = state.f13InspectEvidenceAvailable;

    if (runtime.canvas && runtime.canvas.dataset) {
      runtime.canvas.dataset.hearthCanvasWestBound = "false";
      runtime.canvas.dataset.hearthCanvasWestInspectionReady = "false";
      runtime.canvas.dataset.hearthCanvasWestInspectionDegraded = "true";
      runtime.canvas.dataset.hearthCanvasWestF13InspectEvidenceAvailable = String(state.f13InspectEvidenceAvailable);
      runtime.canvas.dataset.hearthCanvasWestF13InspectEvidenceDegraded = "true";
      runtime.canvas.dataset.hearthCanvasWestF13WInspectionReady = String(state.f13wInspectionReady);
      runtime.canvas.dataset.hearthCanvasWestF13NInspectionReady = String(state.f13nInspectionReady);
    }

    runtime.canvas = null;
    runtime.callbacks.onChange = null;
    runtime.callbacks.onInvalidate = null;

    recordLocal("WEST_UNBIND_INSPECTION_COMPLETE", {
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13InspectEvidenceDegraded: true,
      f13wInspectionReady: state.f13wInspectionReady,
      parentMutationRecommended: false
    });

    updateDataset();

    return getReceipt();
  }

  function getViewState() {
    deriveReadiness();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      source: "hearth.canvas.west",
      role: state.role,

      parentAuthorityAccepted: true,
      downstreamAccustomsToParent: true,
      westDoesNotRecommendParentMutation: true,
      parentMutationRecommended: false,

      yaw: state.yaw,
      pitch: state.pitch,
      rotationYaw: state.yaw,
      rotationPitch: state.pitch,

      zoom: state.zoomLevel,
      zoomLevel: state.zoomLevel,
      zoomMin: state.zoomMin,
      zoomMax: state.zoomMax,
      zoomEnabled: state.zoomEnabled,
      zoomLodPrepared: true,
      zoomLodLevel: state.zoomLodLevel,
      zoomUsesCachedTexture: true,
      zoomDoesNotOwnPlanetTruth: true,
      zoomDoesNotTriggerAtlasRebuild: true,

      pointerInspectionActive: state.pointerInspectionActive,
      pointerInspectionPainted: state.pointerInspectionPainted,
      pointerInspectionPaintedMeansControlInteractionOnly: true,
      pointerInspectionPaintedDoesNotMeanVisibleProof: true,
      pointerInspectionPaintedDoesNotMeanRenderedFrame: true,
      pointerInspectionPaintedDoesNotMeanF13VisibleEvidence: true,
      pointerInspectionMoved: state.pointerInspectionMoved,
      viewInteractionOccurred: state.viewInteractionOccurred,
      controlInteractionOccurred: state.controlInteractionOccurred,
      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      interactiveRotationActive: true,

      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      dpr: state.dpr,

      inspectionBound: state.inspectionBound,
      inspectionReady: state.inspectionReady,
      inspectionDegraded: state.inspectionDegraded,
      viewStateReady: state.viewStateReady,
      controlsReady: state.controlsReady,
      rotationReady: state.rotationReady,
      zoomReady: state.zoomReady,
      invalidationReady: state.invalidationReady,
      invalidationRequested: state.invalidationRequested,

      releaseEvidenceObserverActive: true,
      observerReadyNoReleaseEvidence: state.observerReadyNoReleaseEvidence,
      canvasReleaseEvidenceReady: state.canvasReleaseEvidenceReady,
      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasWestDoesNotAuthorizeCanvasRelease: true,

      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,

      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: ACTIVE_FIBONACCI_RANK,
      legacyFibonacciRank: LEGACY_FIBONACCI_RANK,
      legacyF13NAliasAccepted: true,
      legacyF13NIsNotActiveRank: true,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13InspectEvidenceDegraded: state.f13InspectEvidenceDegraded,
      f13wInspectionReady: state.f13wInspectionReady,
      f13nInspectionReady: state.f13nInspectionReady,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "north-only",
      f21ClaimedByCanvasWest: false,
      readyTextClaimedByCanvasWest: false,
      visualPassClaimed: false,

      updatedAt: state.updatedAt
    };
  }

  function normalizeRotationInput(yawOrPacket = state.yaw, pitchInput = state.pitch, optionsInput = {}) {
    if (isObject(yawOrPacket) && !Array.isArray(yawOrPacket)) {
      const packet = yawOrPacket;
      const yawValue = packet.yaw !== undefined
        ? packet.yaw
        : packet.rotationYaw !== undefined
          ? packet.rotationYaw
          : state.yaw;

      const pitchValue = packet.pitch !== undefined
        ? packet.pitch
        : packet.rotationPitch !== undefined
          ? packet.rotationPitch
          : state.pitch;

      return {
        yaw: safeNumber(yawValue, state.yaw),
        pitch: clamp(pitchValue, PITCH_MIN, PITCH_MAX),
        options: {
          source: packet.source || "setRotation",
          notify: packet.notify,
          invalidate: packet.invalidate,
          reason: packet.reason
        }
      };
    }

    return {
      yaw: safeNumber(yawOrPacket, state.yaw),
      pitch: clamp(pitchInput, PITCH_MIN, PITCH_MAX),
      options: isObject(optionsInput) ? optionsInput : {}
    };
  }

  function setRotation(yaw = state.yaw, pitch = state.pitch, options = {}) {
    const normalized = normalizeRotationInput(yaw, pitch, options);
    const opts = normalized.options;

    state.yaw = normalized.yaw;
    state.pitch = normalized.pitch;
    state.rotationYaw = state.yaw;
    state.rotationPitch = state.pitch;
    state.pointerInspectionPainted = true;
    state.pointerInspectionMoved = true;
    state.viewInteractionOccurred = true;
    state.controlInteractionOccurred = true;

    recordLocal("WEST_SET_ROTATION", {
      yaw: state.yaw,
      pitch: state.pitch,
      source: opts.source || "setRotation",
      pointerInspectionPaintedMeansControlInteractionOnly: true,
      pointerInspectionPaintedDoesNotMeanVisibleProof: true,
      parentMutationRecommended: false
    });

    if (opts.invalidate === true) {
      notifyInvalidation(opts.reason || "explicit-west-rotation-invalidation", {
        yaw: state.yaw,
        pitch: state.pitch,
        source: opts.source || "setRotation"
      });
    }

    if (opts.notify !== false) {
      notifyChange(opts.source || "setRotation", {
        yaw: state.yaw,
        pitch: state.pitch
      });
    }

    updateDataset();

    return getReceipt();
  }

  function resetRotation(options = {}) {
    const packet = isObject(options) ? options : {};

    return setRotation(
      Number.isFinite(Number(packet.yaw)) ? Number(packet.yaw) : state.defaultYaw,
      Number.isFinite(Number(packet.pitch)) ? Number(packet.pitch) : state.defaultPitch,
      {
        ...packet,
        source: packet.source || "resetRotation"
      }
    );
  }

  function normalizeZoomInput(valueOrPacket = DEFAULT_ZOOM, optionsInput = {}) {
    if (isObject(valueOrPacket) && !Array.isArray(valueOrPacket)) {
      const packet = valueOrPacket;
      const zoomValue = packet.zoom !== undefined
        ? packet.zoom
        : packet.zoomLevel !== undefined
          ? packet.zoomLevel
          : packet.value !== undefined
            ? packet.value
            : DEFAULT_ZOOM;

      return {
        value: clampZoom(zoomValue),
        options: {
          source: packet.source || "setZoom",
          notify: packet.notify,
          invalidate: packet.invalidate,
          reason: packet.reason
        }
      };
    }

    return {
      value: clampZoom(valueOrPacket),
      options: isObject(optionsInput) ? optionsInput : {}
    };
  }

  function setZoom(value = DEFAULT_ZOOM, options = {}) {
    const normalized = normalizeZoomInput(value, options);
    const opts = normalized.options;
    const previousZoom = state.zoomLevel;
    const nextZoom = normalized.value;

    state.zoomLevel = nextZoom;
    state.zoomLodLevel = nextZoom >= 2.1 ? 3 : nextZoom >= 1.35 ? 2 : 1;
    state.lastZoomAt = nowIso();
    state.lastZoomSource = String(opts.source || "setZoom");
    state.zoomInteractionCount += previousZoom !== nextZoom ? 1 : 0;
    state.viewInteractionOccurred = true;
    state.controlInteractionOccurred = true;

    recordLocal("WEST_SET_ZOOM", {
      previousZoom,
      zoomLevel: state.zoomLevel,
      zoomLodLevel: state.zoomLodLevel,
      source: state.lastZoomSource,
      zoomDoesNotTriggerAtlasRebuild: true,
      zoomDoesNotMeanVisibleProof: true,
      parentMutationRecommended: false
    });

    if (opts.invalidate === true) {
      notifyInvalidation(opts.reason || "explicit-west-zoom-invalidation", {
        previousZoom,
        zoomLevel: state.zoomLevel,
        source: state.lastZoomSource
      });
    }

    if (opts.notify !== false) {
      notifyChange(state.lastZoomSource, {
        previousZoom,
        zoomLevel: state.zoomLevel,
        zoomLodLevel: state.zoomLodLevel,
        zoomDoesNotTriggerAtlasRebuild: true
      });
    }

    updateDataset();

    return getReceipt();
  }

  function zoomIn(step = 0.18, options = {}) {
    return setZoom(state.zoomLevel + Math.abs(safeNumber(step, 0.18)), {
      ...(isObject(options) ? options : {}),
      source: isObject(options) && options.source ? options.source : "zoomIn",
      invalidate: isObject(options) && options.invalidate === true
    });
  }

  function zoomOut(step = 0.18, options = {}) {
    return setZoom(state.zoomLevel - Math.abs(safeNumber(step, 0.18)), {
      ...(isObject(options) ? options : {}),
      source: isObject(options) && options.source ? options.source : "zoomOut",
      invalidate: isObject(options) && options.invalidate === true
    });
  }

  function resetZoom(options = {}) {
    const packet = isObject(options) ? options : {};

    return setZoom(DEFAULT_ZOOM, {
      ...packet,
      source: packet.source || "resetZoom",
      invalidate: packet.invalidate === true
    });
  }

  function requestInvalidation(reason = "west-explicit-invalidation", detail = {}) {
    return notifyInvalidation(reason, detail);
  }

  function invalidate(reason = "west-explicit-invalidation", detail = {}) {
    return requestInvalidation(reason, detail);
  }

  function invalidateView(reason = "west-explicit-view-invalidation", detail = {}) {
    return requestInvalidation(reason, detail);
  }

  function getInspectionReceipt() {
    return getReceipt();
  }

  function getReceipt() {
    measureCanvas(runtime.canvas);
    const readiness = deriveReadiness();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      parentFile: PARENT_FILE,
      role: state.role,

      parentAuthorityAccepted: true,
      downstreamAccustomsToParent: true,
      westDoesNotRecommendParentMutation: true,
      parentMutationRecommended: false,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,

      macroCycle1: state.macroCycle1,
      macroCycle2: state.macroCycle2,
      canvasChildSequence: state.canvasChildSequence,
      deprecatedCycleOrder: state.deprecatedCycleOrder,
      canvasWestMacroWest: false,
      canvasWestChildWest: true,
      canvasReceivesAfterMacroWestRelease: true,
      canvasWestDoesNotAuthorizeCanvasRelease: true,
      canvasWestObservesReleaseEvidenceOnly: true,

      releaseEvidenceObserverActive: true,
      observerReadyNoReleaseEvidence: state.observerReadyNoReleaseEvidence,
      receivedFrom: state.receivedFrom,
      returnTo: state.returnTo,
      handoffTo: state.handoffTo,
      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      sourceFile: state.sourceFile,
      destinationFile: state.destinationFile,

      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westAuditPassed: state.westAuditPassed,
      westAuditDegraded: state.westAuditDegraded,
      westAuditBlocked: state.westAuditBlocked,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      westCanvasReleaseApprovedObserved: state.westCanvasReleaseApprovedObserved,
      canvasReleaseEvidenceObserved: state.canvasReleaseEvidenceObserved,
      canvasReleaseEvidenceReady: state.canvasReleaseEvidenceReady,
      canvasReleaseAuthorizedByWestObserved: state.canvasReleaseAuthorizedByWestObserved,
      releaseToCanvasObserved: state.releaseToCanvasObserved,
      macroWestReleaseEvidenceReady: state.macroWestReleaseEvidenceReady,
      macroWestReleaseEvidenceSource: state.macroWestReleaseEvidenceSource,
      releaseEvidenceStrict: state.releaseEvidenceStrict,
      releaseEvidenceDegraded: state.releaseEvidenceDegraded,
      releaseEvidenceExplicit: state.releaseEvidenceExplicit,
      lastReleaseEvidenceAt: state.lastReleaseEvidenceAt,
      releaseEvidence: getCanvasReleaseEvidence(),

      routeShapeAloneIgnored: true,
      receivedFromWestAloneIgnored: true,
      handoffToCanvasAloneIgnored: true,

      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,

      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: ACTIVE_FIBONACCI_RANK,
      legacyFibonacciRank: LEGACY_FIBONACCI_RANK,
      legacyF13NAliasAccepted: true,
      legacyF13NIsNotActiveRank: true,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeFibonacciGate: state.activeFibonacciGate,
      futureFibonacciGate: state.futureFibonacciGate,
      oneActiveGearAtATime: true,
      f8SelfDutySatisfied: false,
      f13ProofBodyAvailable: false,
      f13VisibleEvidenceAvailable: false,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13InspectEvidenceDegraded: state.f13InspectEvidenceDegraded,
      f13wInspectionReady: state.f13wInspectionReady,
      f13nInspectionReady: state.f13nInspectionReady,
      f13wReleaseEvidenceObserved: state.f13wReleaseEvidenceObserved,
      f13wReleaseEvidenceReady: state.f13wReleaseEvidenceReady,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21LatchMode: "north-only",

      canvasWestLoaded: true,
      canvasWestApiReady: readiness.canvasWestApiReady,
      canvasWestControlReady: readiness.canvasWestControlReady,
      canvasWestActive: true,
      canvasWestReady: state.canvasWestReady,
      splitAdapterRole: "WEST",
      splitAdapterTransistorMode: true,
      admissibilityControlActive: true,

      inspectionBound: state.inspectionBound,
      inspectionReady: state.inspectionReady,
      inspectionDegraded: state.inspectionDegraded,
      inspectionBindDegraded: state.inspectionBindDegraded,
      viewStateReady: state.viewStateReady,
      controlsReady: state.controlsReady,
      rotationReady: state.rotationReady,
      zoomReady: state.zoomReady,
      invalidationReady: state.invalidationReady,
      invalidationRequested: state.invalidationRequested,

      bound: state.bound,
      bindAttempted: state.bindAttempted,
      bindCount: state.bindCount,
      degradedBindCount: state.degradedBindCount,
      unbindCount: state.unbindCount,
      canvasPresent: Boolean(runtime.canvas),
      canvasNonZeroSize: state.canvasNonZeroSize,
      canvasTagAccepted: state.canvasTagAccepted,
      canvasDatasetStamped: state.canvasDatasetStamped,

      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      pointerInspectionActive: state.pointerInspectionActive,
      pointerInspectionPainted: state.pointerInspectionPainted,
      pointerInspectionPaintedMeansControlInteractionOnly: true,
      pointerInspectionPaintedDoesNotMeanVisibleProof: true,
      pointerInspectionPaintedDoesNotMeanRenderedFrame: true,
      pointerInspectionPaintedDoesNotMeanF13VisibleEvidence: true,
      pointerInspectionMoved: state.pointerInspectionMoved,
      viewInteractionOccurred: state.viewInteractionOccurred,
      controlInteractionOccurred: state.controlInteractionOccurred,
      interactiveRotationActive: true,

      yaw: state.yaw,
      pitch: state.pitch,
      rotationYaw: state.yaw,
      rotationPitch: state.pitch,
      defaultYaw: state.defaultYaw,
      defaultPitch: state.defaultPitch,

      zoomEnabled: state.zoomEnabled,
      zoomLevel: state.zoomLevel,
      zoomMin: state.zoomMin,
      zoomMax: state.zoomMax,
      zoomLodPrepared: true,
      zoomLodLevel: state.zoomLodLevel,
      zoomUsesCachedTexture: true,
      zoomDoesNotOwnPlanetTruth: true,
      zoomDoesNotTriggerAtlasRebuild: true,

      pointerDragCount: state.pointerDragCount,
      pointerDownCount: state.pointerDownCount,
      pointerMoveCount: state.pointerMoveCount,
      pointerUpCount: state.pointerUpCount,
      pointerCancelCount: state.pointerCancelCount,
      pointerActiveCount: state.pointerActiveCount,
      wheelZoomCount: state.wheelZoomCount,
      keyboardControlCount: state.keyboardControlCount,
      zoomInteractionCount: state.zoomInteractionCount,
      interactionCount: state.interactionCount,
      invalidationSignalCount: state.invalidationSignalCount,

      activePointerId: state.activePointerId,
      activePointers: state.activePointers,
      dragStartedAt: state.dragStartedAt,
      lastInteractionAt: state.lastInteractionAt,
      lastZoomAt: state.lastZoomAt,
      lastZoomSource: state.lastZoomSource,
      lastInvalidationAt: state.lastInvalidationAt,
      lastInvalidationReason: state.lastInvalidationReason,

      pinchActive: state.pinchActive,
      pinchStartDistance: state.pinchStartDistance,
      pinchStartZoom: state.pinchStartZoom,

      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      dpr: state.dpr,

      onChangeAvailable: state.onChangeAvailable,
      onInvalidateAvailable: state.onInvalidateAvailable,
      onChangeError: state.onChangeError,
      onInvalidateError: state.onInvalidateError,

      viewState: getViewState(),

      ownsReleaseEvidenceObservation: true,
      ownsReleaseAuthorization: false,
      ownsMacroWestAdmissibility: false,
      ownsInvalidationControl: true,
      ownsDragInspection: true,
      ownsZoomInspection: true,
      ownsViewState: true,
      ownsAtlasSource: false,
      ownsAtlasFormation: false,
      ownsTextureComposition: false,
      ownsSphereRendering: false,
      ownsVisibleProof: false,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsHydrologyTruth: false,
      ownsRuntimeTableGovernance: false,
      ownsRouteReadiness: false,
      ownsCanvasParentBoot: false,
      ownsReadyText: false,
      ownsF21: false,

      designRules: [
        "west child owns F13W inspection and view control only",
        "F13N remains legacy compatibility only",
        "west child observes explicit macro-West or route-conductor release evidence only",
        "west child does not authorize Canvas release",
        "west child does not own macro-West admissibility",
        "route shape alone does not create release evidence",
        "receivedFrom=WEST alone does not create release evidence",
        "handoffTo=CANVAS alone does not create release evidence",
        "boot publishes observer readiness without false release evidence",
        "drag changes view state only",
        "zoom changes cached-texture inspection only",
        "ordinary zoom does not trigger atlas rebuild",
        "ordinary drag does not trigger atlas rebuild",
        "explicit invalidation may be signaled through requestInvalidation, invalidate, or invalidateView",
        "invalidation does not mean texture composed",
        "invalidation does not mean sphere rendered",
        "invalidation does not mean visible proof passed",
        "invalidation does not mean F21 eligible",
        "pointerInspectionPainted means control interaction occurred only",
        "pointerInspectionPainted does not mean visible proof",
        "west does not render visible proof",
        "west does not compose texture",
        "west does not form atlas",
        "west does not claim F21",
        "west does not claim final visual pass",
        "downstream file accustoms itself to parent authority",
        "west does not recommend parent mutation"
      ],

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      imageRendered: false,
      visibleContentProof: false,
      visualPassClaimed: false,
      f21ClaimedByCanvasWest: false,
      readyTextClaimedByCanvasWest: false,
      updatedAt: state.updatedAt
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const errors = r.errors.length
      ? r.errors.map((item) => `- ${item.at} :: ${item.code} :: ${item.message}`).join("\n")
      : "- none";

    return [
      "HEARTH_CANVAS_WEST_PARENT_ACCLIMATED_F13W_INSPECTION_RELEASE_EVIDENCE_CHILD_RECEIPT",
      "",
      "IDENTITY",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `parentFile=${r.parentFile}`,
      `role=${r.role}`,
      "",
      "PARENT_ACCLIMATION",
      `parentAuthorityAccepted=${r.parentAuthorityAccepted}`,
      `downstreamAccustomsToParent=${r.downstreamAccustomsToParent}`,
      `westDoesNotRecommendParentMutation=${r.westDoesNotRecommendParentMutation}`,
      `parentMutationRecommended=${r.parentMutationRecommended}`,
      "",
      "NEWS",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      "",
      "CYCLE",
      `macroCycle1=${r.macroCycle1}`,
      `macroCycle2=${r.macroCycle2}`,
      `canvasChildSequence=${r.canvasChildSequence}`,
      `deprecatedCycleOrder=${r.deprecatedCycleOrder}`,
      `canvasWestMacroWest=${r.canvasWestMacroWest}`,
      `canvasWestChildWest=${r.canvasWestChildWest}`,
      `canvasReceivesAfterMacroWestRelease=${r.canvasReceivesAfterMacroWestRelease}`,
      `canvasWestDoesNotAuthorizeCanvasRelease=${r.canvasWestDoesNotAuthorizeCanvasRelease}`,
      `canvasWestObservesReleaseEvidenceOnly=${r.canvasWestObservesReleaseEvidenceOnly}`,
      "",
      "RELEASE_EVIDENCE_OBSERVER",
      `releaseEvidenceObserverActive=${r.releaseEvidenceObserverActive}`,
      `observerReadyNoReleaseEvidence=${r.observerReadyNoReleaseEvidence}`,
      `receivedFrom=${r.receivedFrom}`,
      `returnTo=${r.returnTo}`,
      `handoffTo=${r.handoffTo}`,
      `cycleNumber=${r.cycleNumber}`,
      `cycleRoute=${r.cycleRoute}`,
      `sourceFile=${r.sourceFile}`,
      `destinationFile=${r.destinationFile}`,
      `westAuditObserved=${r.westAuditObserved}`,
      `westAuditAccepted=${r.westAuditAccepted}`,
      `westAuditPassed=${r.westAuditPassed}`,
      `westAuditDegraded=${r.westAuditDegraded}`,
      `westAuditBlocked=${r.westAuditBlocked}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      `canvasReleaseEvidenceObserved=${r.canvasReleaseEvidenceObserved}`,
      `canvasReleaseEvidenceReady=${r.canvasReleaseEvidenceReady}`,
      `canvasReleaseAuthorizedByWestObserved=${r.canvasReleaseAuthorizedByWestObserved}`,
      `releaseToCanvasObserved=${r.releaseToCanvasObserved}`,
      `macroWestReleaseEvidenceReady=${r.macroWestReleaseEvidenceReady}`,
      `macroWestReleaseEvidenceSource=${r.macroWestReleaseEvidenceSource}`,
      `releaseEvidenceExplicit=${r.releaseEvidenceExplicit}`,
      `routeShapeAloneIgnored=${r.routeShapeAloneIgnored}`,
      `receivedFromWestAloneIgnored=${r.receivedFromWestAloneIgnored}`,
      `handoffToCanvasAloneIgnored=${r.handoffToCanvasAloneIgnored}`,
      "",
      "FIBONACCI",
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `legacyFibonacciRank=${r.legacyFibonacciRank}`,
      `legacyF13NAliasAccepted=${r.legacyF13NAliasAccepted}`,
      `legacyF13NIsNotActiveRank=${r.legacyF13NIsNotActiveRank}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `f8SelfDutySatisfied=${r.f8SelfDutySatisfied}`,
      `f13ProofBodyAvailable=${r.f13ProofBodyAvailable}`,
      `f13VisibleEvidenceAvailable=${r.f13VisibleEvidenceAvailable}`,
      `f13InspectEvidenceAvailable=${r.f13InspectEvidenceAvailable}`,
      `f13InspectEvidenceDegraded=${r.f13InspectEvidenceDegraded}`,
      `f13wInspectionReady=${r.f13wInspectionReady}`,
      `f13nInspectionReady=${r.f13nInspectionReady}`,
      `f13wReleaseEvidenceObserved=${r.f13wReleaseEvidenceObserved}`,
      `f13wReleaseEvidenceReady=${r.f13wReleaseEvidenceReady}`,
      "",
      "F13W_INSPECTION",
      `canvasWestLoaded=${r.canvasWestLoaded}`,
      `canvasWestApiReady=${r.canvasWestApiReady}`,
      `canvasWestControlReady=${r.canvasWestControlReady}`,
      `canvasWestReady=${r.canvasWestReady}`,
      `inspectionBound=${r.inspectionBound}`,
      `inspectionReady=${r.inspectionReady}`,
      `inspectionDegraded=${r.inspectionDegraded}`,
      `inspectionBindDegraded=${r.inspectionBindDegraded}`,
      `viewStateReady=${r.viewStateReady}`,
      `controlsReady=${r.controlsReady}`,
      `rotationReady=${r.rotationReady}`,
      `zoomReady=${r.zoomReady}`,
      `invalidationReady=${r.invalidationReady}`,
      `invalidationRequested=${r.invalidationRequested}`,
      `bound=${r.bound}`,
      `bindAttempted=${r.bindAttempted}`,
      `bindCount=${r.bindCount}`,
      `degradedBindCount=${r.degradedBindCount}`,
      `canvasPresent=${r.canvasPresent}`,
      `canvasNonZeroSize=${r.canvasNonZeroSize}`,
      `dragInspectionBound=${r.dragInspectionBound}`,
      `zoomInspectionBound=${r.zoomInspectionBound}`,
      "",
      "VIEW_STATE",
      `yaw=${r.yaw}`,
      `pitch=${r.pitch}`,
      `zoomLevel=${r.zoomLevel}`,
      `zoomMin=${r.zoomMin}`,
      `zoomMax=${r.zoomMax}`,
      `zoomLodPrepared=${r.zoomLodPrepared}`,
      `zoomLodLevel=${r.zoomLodLevel}`,
      `zoomUsesCachedTexture=${r.zoomUsesCachedTexture}`,
      `zoomDoesNotTriggerAtlasRebuild=${r.zoomDoesNotTriggerAtlasRebuild}`,
      "",
      "INTERACTION",
      `pointerInspectionActive=${r.pointerInspectionActive}`,
      `pointerInspectionPainted=${r.pointerInspectionPainted}`,
      `pointerInspectionPaintedMeansControlInteractionOnly=${r.pointerInspectionPaintedMeansControlInteractionOnly}`,
      `pointerInspectionPaintedDoesNotMeanVisibleProof=${r.pointerInspectionPaintedDoesNotMeanVisibleProof}`,
      `pointerInspectionMoved=${r.pointerInspectionMoved}`,
      `viewInteractionOccurred=${r.viewInteractionOccurred}`,
      `controlInteractionOccurred=${r.controlInteractionOccurred}`,
      `pointerDragCount=${r.pointerDragCount}`,
      `wheelZoomCount=${r.wheelZoomCount}`,
      `keyboardControlCount=${r.keyboardControlCount}`,
      `zoomInteractionCount=${r.zoomInteractionCount}`,
      `interactionCount=${r.interactionCount}`,
      "",
      "INVALIDATION",
      `invalidationSignalCount=${r.invalidationSignalCount}`,
      `lastInvalidationAt=${r.lastInvalidationAt}`,
      `lastInvalidationReason=${r.lastInvalidationReason}`,
      "",
      "OWNERSHIP_BOUNDARY",
      `ownsReleaseEvidenceObservation=${r.ownsReleaseEvidenceObservation}`,
      `ownsReleaseAuthorization=${r.ownsReleaseAuthorization}`,
      `ownsMacroWestAdmissibility=${r.ownsMacroWestAdmissibility}`,
      `ownsInvalidationControl=${r.ownsInvalidationControl}`,
      `ownsDragInspection=${r.ownsDragInspection}`,
      `ownsZoomInspection=${r.ownsZoomInspection}`,
      `ownsViewState=${r.ownsViewState}`,
      `ownsAtlasSource=${r.ownsAtlasSource}`,
      `ownsAtlasFormation=${r.ownsAtlasFormation}`,
      `ownsTextureComposition=${r.ownsTextureComposition}`,
      `ownsSphereRendering=${r.ownsSphereRendering}`,
      `ownsVisibleProof=${r.ownsVisibleProof}`,
      `ownsPlanetTruth=${r.ownsPlanetTruth}`,
      `ownsMaterialTruth=${r.ownsMaterialTruth}`,
      `ownsHydrologyTruth=${r.ownsHydrologyTruth}`,
      `ownsRuntimeTableGovernance=${r.ownsRuntimeTableGovernance}`,
      `ownsRouteReadiness=${r.ownsRouteReadiness}`,
      `ownsCanvasParentBoot=${r.ownsCanvasParentBoot}`,
      `ownsReadyText=${r.ownsReadyText}`,
      `ownsF21=${r.ownsF21}`,
      "",
      "F21_BOUNDARY",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `f21ClaimedByCanvasWest=${r.f21ClaimedByCanvasWest}`,
      `readyTextClaimedByCanvasWest=${r.readyTextClaimedByCanvasWest}`,
      "",
      "ERRORS",
      errors,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `imageRendered=${r.imageRendered}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,

    bindInspection,
    unbindInspection,
    getViewState,
    setRotation,
    resetRotation,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    requestInvalidation,
    invalidate,
    invalidateView,

    normalizeReleaseEvidence,
    observeWestReleaseEvidence,
    acceptWestReleaseEvidence,
    receiveWestReleaseEvidence,
    getCanvasReleaseEvidence,
    getReleaseEvidenceReceipt,

    getInspectionReceipt,
    getReceipt,
    getReceiptText,

    canvasWestLoaded: true,
    canvasWestActive: true,
    canvasWestReady: true,
    splitAdapterRole: "WEST",
    splitAdapterTransistorMode: true,

    parentAuthorityAccepted: true,
    downstreamAccustomsToParent: true,
    westDoesNotRecommendParentMutation: true,
    parentMutationRecommended: false,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,

    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,
    canvasWestMacroWest: false,
    canvasWestChildWest: true,
    canvasWestDoesNotAuthorizeCanvasRelease: true,
    canvasWestObservesReleaseEvidenceOnly: true,
    releaseEvidenceObserverActive: true,

    activeFibonacci: 13,
    activeFibonacciRank: ACTIVE_FIBONACCI_RANK,
    legacyFibonacciRank: LEGACY_FIBONACCI_RANK,
    legacyF13NAliasAccepted: true,
    legacyF13NIsNotActiveRank: true,
    activeStageId: ACTIVE_STAGE_ID,
    activeGearId: ACTIVE_GEAR_ID,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    ownsReleaseEvidenceObservation: true,
    ownsReleaseAuthorization: false,
    ownsMacroWestAdmissibility: false,
    ownsInvalidationControl: true,
    ownsDragInspection: true,
    ownsZoomInspection: true,
    ownsViewState: true,
    ownsAtlasSource: false,
    ownsAtlasFormation: false,
    ownsTextureComposition: false,
    ownsSphereRendering: false,
    ownsVisibleProof: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteReadiness: false,
    ownsCanvasParentBoot: false,
    ownsReadyText: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    imageRendered: false,
    visibleContentProof: false,
    visualPassClaimed: false,
    f21ClaimedByCanvasWest: false,
    readyTextClaimedByCanvasWest: false,

    get state() {
      deriveReadiness();
      return state;
    }
  };

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.canvasWest = api;
    root.HEARTH.canvasWestInspectionInvalidationControl = api;
    root.HEARTH.canvasWestF13NInspectionViewInvalidationChild = api;
    root.HEARTH.canvasWestF13NReleaseEvidenceObserverChild = api;
    root.HEARTH.canvasWestF13WInspectionReleaseEvidenceChild = api;
    root.HEARTH.canvasWestParentAcclimatedF13WInspectionReleaseEvidenceChild = api;
    root.HEARTH.canvasWestReleaseEvidenceObserver = api;

    root.HEARTH_CANVAS_WEST = api;
    root.HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL = api;
    root.HEARTH_CANVAS_WEST_F13N_INSPECTION_VIEW_INVALIDATION_CHILD = api;
    root.HEARTH_CANVAS_WEST_F13N_RELEASE_EVIDENCE_OBSERVER_CHILD = api;
    root.HEARTH_CANVAS_WEST_F13W_INSPECTION_RELEASE_EVIDENCE_CHILD = api;
    root.HEARTH_CANVAS_WEST_PARENT_ACCLIMATED_F13W_INSPECTION_RELEASE_EVIDENCE_CHILD = api;
    root.HEARTH_CANVAS_WEST_RELEASE_EVIDENCE_OBSERVER = api;

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthCanvasWest = api;
    root.DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl = api;
    root.DEXTER_LAB.hearthCanvasWestF13NInspectionViewInvalidationChild = api;
    root.DEXTER_LAB.hearthCanvasWestF13NReleaseEvidenceObserverChild = api;
    root.DEXTER_LAB.hearthCanvasWestF13WInspectionReleaseEvidenceChild = api;
    root.DEXTER_LAB.hearthCanvasWestParentAcclimatedF13WInspectionReleaseEvidenceChild = api;
    root.DEXTER_LAB.hearthCanvasWestReleaseEvidenceObserver = api;

    root.__HEARTH_CANVAS_WEST_LOADED__ = true;
    root.__HEARTH_CANVAS_WEST_FILE__ = FILE;
    root.__HEARTH_CANVAS_WEST_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_WEST_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_WEST_API_READY__ = true;
    root.__HEARTH_CANVAS_WEST_ACTIVE_FIBONACCI_RANK__ = ACTIVE_FIBONACCI_RANK;
    root.__HEARTH_CANVAS_WEST_LEGACY_F13N_ALIAS_ACCEPTED__ = true;
    root.__HEARTH_CANVAS_WEST_RELEASE_EVIDENCE_OBSERVER_ACTIVE__ = true;
    root.__HEARTH_CANVAS_WEST_OBSERVER_READY_NO_RELEASE_EVIDENCE__ = state.observerReadyNoReleaseEvidence;
    root.__HEARTH_CANVAS_WEST_DOES_NOT_AUTHORIZE_CANVAS_RELEASE__ = true;
    root.__HEARTH_CANVAS_WEST_RELEASE_EVIDENCE_READY__ = state.canvasReleaseEvidenceReady;
    root.__HEARTH_CANVAS_WEST_PARENT_AUTHORITY_ACCEPTED__ = true;
    root.__HEARTH_CANVAS_WEST_DOWNSTREAM_ACCUSTOMS_TO_PARENT__ = true;
    root.__HEARTH_CANVAS_WEST_DOES_NOT_RECOMMEND_PARENT_MUTATION__ = true;
    root.__HEARTH_CANVAS_WEST_F21_CLAIMED__ = false;
    root.__HEARTH_CANVAS_WEST_VISUAL_PASS_CLAIMED__ = false;

    root.HEARTH_CANVAS_WEST_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_WEST_RELEASE_EVIDENCE_RECEIPT = getCanvasReleaseEvidence();
    root.HEARTH_CANVAS_WEST_PARENT_ACCLIMATED_F13W_INSPECTION_RELEASE_EVIDENCE_CHILD_RECEIPT = root.HEARTH_CANVAS_WEST_RECEIPT;
    root.HEARTH.canvasWestReceipt = root.HEARTH_CANVAS_WEST_RECEIPT;
    root.HEARTH.canvasWestReleaseEvidenceReceipt = root.HEARTH_CANVAS_WEST_RELEASE_EVIDENCE_RECEIPT;
    root.HEARTH.canvasWestParentAcclimatedF13WInspectionReleaseEvidenceChildReceipt = root.HEARTH_CANVAS_WEST_RECEIPT;

    updateDataset();
  }

  state.updatedAt = nowIso();

  updateDataset();
  publishGlobals();

  recordLocal("WEST_RELEASE_EVIDENCE_OBSERVER_READY_NO_RELEASE_EVIDENCE", {
    file: FILE,
    contract: CONTRACT,
    receipt: RECEIPT,
    activeFibonacciRank: ACTIVE_FIBONACCI_RANK,
    legacyFibonacciRank: LEGACY_FIBONACCI_RANK,
    observerReadyNoReleaseEvidence: true,
    releaseEvidenceObserverActive: true,
    canvasWestDoesNotAuthorizeCanvasRelease: true,
    routeShapeAloneIgnored: true,
    receivedFromWestAloneIgnored: true,
    handoffToCanvasAloneIgnored: true,
    parentAuthorityAccepted: true,
    downstreamAccustomsToParent: true,
    westDoesNotRecommendParentMutation: true,
    parentMutationRecommended: false
  });

  recordLocal("WEST_PARENT_ACCLIMATED_F13W_INSPECTION_RELEASE_EVIDENCE_CHILD_PUBLISHED", {
    file: FILE,
    contract: CONTRACT,
    receipt: RECEIPT,
    requiredMethods: ["bindInspection", "getViewState", "setRotation", "resetRotation", "setZoom", "getReceipt"],
    releaseEvidenceObserverActive: true,
    canvasWestDoesNotAuthorizeCanvasRelease: true,
    ownsReleaseAuthorization: false,
    ownsMacroWestAdmissibility: false,
    activeFibonacciRank: ACTIVE_FIBONACCI_RANK,
    legacyF13NAliasAccepted: true,
    parentMutationRecommended: false
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
