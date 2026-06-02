// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_2
// Full-file replacement.
// Cardinal West / cycle-aware admissibility clutch only.
// Purpose:
// - Preserve West as Macro/Cardinal admissibility authority.
// - Preserve v4_1 South-output correction: no blind release.
// - Preserve current Canvas parent v10_3 carrier compatibility.
// - Require identity-safe Canvas parent plus explicit carrier-safe marker.
// - Clear stale release globals during HOLD or HARD_BLOCK.
// - Publish both releasePacket and canvasReleasePacket receipt aliases.
// - Correct F13N NEWS/Fibonacci checkpoint declaration.
// Does not own:
// - Canvas parent boot
// - Canvas parent release acceptance
// - Canvas East dispatch
// - East atlas/source truth
// - Canvas child West inspection truth
// - South visible proof truth
// - material truth
// - elevation truth
// - hydrology truth
// - planet truth
// - route conductor switching
// - F21 latch
// - ready text
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_2";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_RECEIPT_v4_2";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_1";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_1";

  const FILE = "/assets/lab/runtime-table.west.js";
  const ROUTE = "/showroom/globe/hearth/";
  const CANVAS_PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_PARENT_V10_3_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3";

  const CHECKPOINT_IDS = Object.freeze({
    F8: "F8",
    F13E: "F13E",
    F13S: "F13S",
    F13W: "F13W",
    F13N: "F13N",
    F21: "F21",
  });

  const TRI = Object.freeze({
    TRUE: "TRUE",
    FALSE: "FALSE",
    UNKNOWN: "UNKNOWN",
  });

  const WEST_DECISION = Object.freeze({
    RELEASE_TO_CANVAS: "RELEASE_TO_CANVAS",
    HOLD: "HOLD",
    HARD_BLOCK: "HARD_BLOCK",
  });

  const CARRIER_SPECIFIC_METHODS = Object.freeze([
    "getStructuralCarrier",
    "readStructuralCarrier",
    "getCanvasCarrier",
    "getCarrierReceipt",
  ]);

  const state = {
    timestamp: "",
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    file: FILE,
    route: ROUTE,
    role: "lab-runtime-table-cardinal-west-current-canvas-parent-v10-3-carrier-compatibility",

    westRuntimeTableLoaded: true,
    westRuntimeTableContract: CONTRACT,
    westRuntimeTableReceipt: RECEIPT,
    westV4_2Active: true,
    westV4_1Superseded: true,
    westV4Superseded: true,
    westV3Superseded: true,

    cycleNumber: 0,
    cycleRoute: "",
    receivedFrom: "UNKNOWN",
    handoffTo: "UNKNOWN",

    checkpointRegistry: [],
    f13nCheckpointCorrected: false,

    currentCanvasParentObserved: false,
    currentCanvasParentContractObserved: false,
    currentCanvasParentContract: "",
    currentParentIdentityMismatch: false,
    currentParentStaleDetected: false,
    staleParentDetected: false,
    canvasParentBootMethodAvailable: false,

    canvasCarrierReceiptObserved: false,
    canvasCarrierSourceMethod: "NONE",
    canvasCarrierSourceIsCarrierSpecific: false,
    canvasCarrierProof: null,

    structuralCarrierReadyTri: TRI.UNKNOWN,
    structuralCarrierSafeTri: TRI.UNKNOWN,
    canvasParentCarrierSafeTri: TRI.UNKNOWN,
    structuralCarrierSafeForCanvasReleaseTri: TRI.UNKNOWN,
    canvasPreReleaseCarrierSafeForWestTri: TRI.UNKNOWN,

    carrierSafeMarkerObserved: false,
    secondaryCarrierConfidenceObserved: false,
    carrierIdentitySafe: false,
    preReleaseCarrierAdmissible: false,
    carrierHardBlock: false,
    carrierHeld: true,
    carrierHoldReason: "WAITING_CURRENT_CANVAS_PARENT_CARRIER_PROOF",
    explicitUnsafeFields: [],

    indexPairReady: false,
    carrierHostAdmissibilityReady: false,
    f8SelfDutySatisfied: false,

    indexPairReadyObserved: false,
    carrierHostAdmissibilityReadyObserved: false,
    f8SelfDutySatisfiedObserved: false,

    southRouteConductorPacketObserved: false,
    explicitSouthRouteSignalObserved: false,
    explicitSouthAdmissibilitySignalObserved: false,
    southOutputReady: false,
    routeConductorOutputReady: false,
    routeConductorReleaseCandidate: false,
    cycleTwoSouthOutputObserved: false,
    cycleTwoSouthOutputAdmissible: false,
    southOutputIntakeMethod: "NONE",
    explicitSouthSignals: [],

    westAuditObserved: true,
    westAuditAccepted: false,
    westAuditPassed: false,
    westDecision: WEST_DECISION.HOLD,
    westGapClass: "WAITING_CYCLE_TWO_SOUTH_OUTPUT",
    westHardBlock: false,
    westForwardAllowed: false,
    westCanvasReleaseApproved: false,

    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseApprovedByWest: false,
    releaseToCanvas: false,
    canvasReleaseHeldReason: "WAITING_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBILITY",
    releasePacket: null,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    completionLatched: false,
    readyTextAllowed: false,
    visualPassClaimed: false,
    f21ClaimedByWest: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,

    firstFailedCoordinate: "WAITING_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBILITY",
    recommendedNextFile: ROUTE_CONDUCTOR_FILE,
    recommendedNextRenewalTarget: ROUTE_CONDUCTOR_FILE,
    postgameStatus: "WEST_HOLD_WAITING_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBILITY",

    lastInput: null,
    lastReceipt: null,
  };

  function getWindow() {
    if (typeof window !== "undefined") return window;
    if (typeof globalThis !== "undefined") return globalThis;
    return {};
  }

  function getDocument() {
    const w = getWindow();
    return w.document || null;
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function own(value, key) {
    return Boolean(value) && Object.prototype.hasOwnProperty.call(value, key);
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_) {
      if (Array.isArray(value)) return value.slice();
      return Object.assign({}, value);
    }
  }

  function safeCall(fn, fallback) {
    try {
      if (isFunction(fn)) return fn();
    } catch (_) {
      return fallback;
    }

    return fallback;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function toBool(value) {
    if (value === true) return true;
    if (value === false) return false;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "TRUE") return true;
    if (value === "FALSE") return false;
    if (value === "1") return true;
    if (value === "0") return false;
    if (value === 1) return true;
    if (value === 0) return false;
    return Boolean(value);
  }

  function toTri(source, key) {
    if (!isObject(source) || !own(source, key)) return TRI.UNKNOWN;

    const value = source[key];

    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return TRI.TRUE;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return TRI.FALSE;

    return TRI.UNKNOWN;
  }

  function firstTri(source, keys) {
    if (!isObject(source)) return TRI.UNKNOWN;

    for (let i = 0; i < keys.length; i += 1) {
      const tri = toTri(source, keys[i]);
      if (tri !== TRI.UNKNOWN) return tri;
    }

    return TRI.UNKNOWN;
  }

  function firstString(source, keys, fallback) {
    if (!isObject(source)) return fallback || "";

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (own(source, key) && source[key] !== undefined && source[key] !== null && String(source[key]).trim()) {
        return String(source[key]).trim();
      }
    }

    return fallback || "";
  }

  function readExplicit(source, dataset, keys) {
    const packet = isObject(source) ? source : {};
    const ds = isObject(dataset) ? dataset : {};

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      if (own(packet, key)) {
        return {
          present: true,
          value: packet[key],
          key,
          source: "packet",
        };
      }

      if (own(ds, key)) {
        return {
          present: true,
          value: ds[key],
          key,
          source: "dataset",
        };
      }
    }

    return {
      present: false,
      value: undefined,
      key: "",
      source: "none",
    };
  }

  function boolFromExplicit(readResult) {
    return readResult.present ? toBool(readResult.value) : false;
  }

  function textFromExplicit(readResult, fallback) {
    return readResult.present ? String(readResult.value || "").trim() : (fallback || "");
  }

  function checkpoint(id, rank, fibonacci, owner, label) {
    const entry = {
      id,
      rank,
      fibonacci,
      owner,
      label,
    };

    state.checkpointRegistry.push(entry);

    if (
      id === CHECKPOINT_IDS.F13N &&
      rank === 13.9 &&
      fibonacci === "F13N" &&
      owner === "WEST" &&
      label === "inspect gate"
    ) {
      state.f13nCheckpointCorrected = true;
    }

    return entry;
  }

  function initializeCheckpoints() {
    state.checkpointRegistry = [];
    state.f13nCheckpointCorrected = false;

    checkpoint(CHECKPOINT_IDS.F8, 8, "F8", "ROUTE", "self duty gate");
    checkpoint(CHECKPOINT_IDS.F13E, 13.1, "F13E", "EAST", "source gate");
    checkpoint(CHECKPOINT_IDS.F13S, 13.5, "F13S", "SOUTH", "output gate");
    checkpoint(CHECKPOINT_IDS.F13W, 13.7, "F13W", "WEST", "admissibility gate");
    checkpoint(CHECKPOINT_IDS.F13N, 13.9, "F13N", "WEST", "inspect gate");
    checkpoint(CHECKPOINT_IDS.F21, 21, "F21", "NORTH", "north-only completion review");

    return state.checkpointRegistry.slice();
  }

  function getCanvasParentCandidates() {
    const w = getWindow();
    const h = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    return [
      h.canvas,
      h.canvasParent,
      h.canvasEvidence,

      w.HEARTH_CANVAS,
      w.HEARTH_CANVAS_PARENT,
      w.HEARTH_CANVAS_AUTHORITY,
      w.HEARTH_CANVAS_EVIDENCE,
      w.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD,

      lab.hearthCanvas,
      lab.hearthCanvasParent,
      lab.hearthCanvasEvidence,
      lab.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard,
    ];
  }

  function hasCanvasBootCandidate() {
    const candidates = getCanvasParentCandidates();

    return candidates.some((candidate) => {
      return (
        isObject(candidate) &&
        (
          isFunction(candidate.boot) ||
          isFunction(candidate.init) ||
          isFunction(candidate.start) ||
          isFunction(candidate.mount)
        )
      );
    });
  }

  function getDatasetCarrierProof() {
    const doc = getDocument();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return null;

    const ds = doc.documentElement.dataset;

    const candidateKeys = [
      "hearthCanvasLoaded",
      "hearthCanvasParentV10_3Active",
      "hearthCanvasParentV2Observed",
      "hearthCanvasStaleParentV2FalsePositiveBlocked",
      "hearthCanvasContract",
      "hearthCanvasParentReleaseGateReady",
      "hearthCanvasParentAcceptedRouteConductorRelease",
      "hearthCanvasReleasePacketAccepted",
      "hearthCanvasParentReleaseAccepted",
      "hearthCanvasParentReleaseObserved",
      "hearthCanvasParentReleaseLawful",
      "hearthCanvasStructuralCarrierReady",
      "hearthCanvasStructuralCarrierSafe",
      "hearthCanvasParentCarrierSafe",
      "hearthCanvasStructuralCarrierSafeForCanvasRelease",
      "hearthCanvasPreReleaseCarrierSafeForWest",
      "structuralCarrierReady",
      "structuralCarrierSafe",
      "canvasParentCarrierSafe",
      "structuralCarrierSafeForCanvasRelease",
      "canvasPreReleaseCarrierSafeForWest",
      "currentCanvasParentContract",
      "canvasParentBootMethodAvailable",
    ];

    const proof = {
      source: "DOCUMENT_DATASET",
    };

    let observed = false;

    candidateKeys.forEach((key) => {
      if (own(ds, key)) {
        proof[key] = ds[key];
        observed = true;
      }
    });

    if (!observed) return null;

    return proof;
  }

  function readCanvasParentCarrier() {
    const candidates = getCanvasParentCandidates();

    const carrierMethodPriority = [
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getCanvasCarrier",
      "getCarrierReceipt",
      "getReceipt",
      "getReceiptLight",
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      const candidate = candidates[i];

      if (!candidate) continue;

      if (isObject(candidate)) {
        for (let m = 0; m < carrierMethodPriority.length; m += 1) {
          const method = carrierMethodPriority[m];

          if (!isFunction(candidate[method])) continue;

          const result = safeCall(() => candidate[method](), null);

          if (isObject(result)) {
            state.canvasCarrierSourceMethod = method;
            state.canvasCarrierSourceIsCarrierSpecific = CARRIER_SPECIFIC_METHODS.includes(method);
            state.canvasCarrierReceiptObserved = true;
            state.canvasCarrierProof = clonePlain(result);
            return result;
          }
        }

        if (isObject(candidate.structuralCarrier)) {
          state.canvasCarrierSourceMethod = "structuralCarrier";
          state.canvasCarrierSourceIsCarrierSpecific = true;
          state.canvasCarrierReceiptObserved = true;
          state.canvasCarrierProof = clonePlain(candidate.structuralCarrier);
          return candidate.structuralCarrier;
        }

        if (isObject(candidate.canvasCarrier)) {
          state.canvasCarrierSourceMethod = "canvasCarrier";
          state.canvasCarrierSourceIsCarrierSpecific = true;
          state.canvasCarrierReceiptObserved = true;
          state.canvasCarrierProof = clonePlain(candidate.canvasCarrier);
          return candidate.canvasCarrier;
        }

        if (isObject(candidate.receipt)) {
          state.canvasCarrierSourceMethod = "receipt";
          state.canvasCarrierSourceIsCarrierSpecific = false;
          state.canvasCarrierReceiptObserved = true;
          state.canvasCarrierProof = clonePlain(candidate.receipt);
          return candidate.receipt;
        }
      }
    }

    const datasetProof = getDatasetCarrierProof();

    if (datasetProof) {
      state.canvasCarrierSourceMethod = "dataset";
      state.canvasCarrierSourceIsCarrierSpecific = false;
      state.canvasCarrierReceiptObserved = true;
      state.canvasCarrierProof = clonePlain(datasetProof);
      return datasetProof;
    }

    state.canvasCarrierSourceMethod = "NONE";
    state.canvasCarrierSourceIsCarrierSpecific = false;
    state.canvasCarrierReceiptObserved = false;
    state.canvasCarrierProof = null;
    return null;
  }

  function normalizeCanvasCarrierProof(proof) {
    const normalized = {
      source: firstString(proof, ["source", "carrierSource", "role"], state.canvasCarrierSourceMethod),

      currentCanvasParentObserved:
        firstTri(proof, ["currentCanvasParentObserved"]) === TRI.TRUE ||
        firstTri(proof, ["hearthCanvasLoaded"]) === TRI.TRUE ||
        firstTri(proof, ["hearthCanvasParentV10_3Active"]) === TRI.TRUE,

      currentCanvasParentContractObserved:
        firstTri(proof, ["currentCanvasParentContractObserved"]) === TRI.TRUE,

      currentCanvasParentContract: firstString(proof, [
        "currentCanvasParentContract",
        "contract",
        "hearthCanvasContract",
      ], ""),

      canvasParentBootMethodAvailable:
        firstTri(proof, ["canvasParentBootMethodAvailable", "hearthCanvasBootMethodAvailable"]) === TRI.TRUE,

      structuralCarrierReadyTri: firstTri(proof, [
        "structuralCarrierReady",
        "hearthCanvasStructuralCarrierReady",
      ]),

      structuralCarrierSafeTri: firstTri(proof, [
        "structuralCarrierSafe",
        "hearthCanvasStructuralCarrierSafe",
      ]),

      canvasParentCarrierSafeTri: firstTri(proof, [
        "canvasParentCarrierSafe",
        "hearthCanvasParentCarrierSafe",
      ]),

      structuralCarrierSafeForCanvasReleaseTri: firstTri(proof, [
        "structuralCarrierSafeForCanvasRelease",
        "hearthCanvasStructuralCarrierSafeForCanvasRelease",
      ]),

      canvasPreReleaseCarrierSafeForWestTri: firstTri(proof, [
        "canvasPreReleaseCarrierSafeForWest",
        "hearthCanvasPreReleaseCarrierSafeForWest",
      ]),

      canvasParentV10_3Active:
        firstTri(proof, ["hearthCanvasParentV10_3Active", "canvasParentV10_3Active"]) === TRI.TRUE,

      canvasParentV2ObservedTri: firstTri(proof, [
        "canvasParentV2Observed",
        "hearthCanvasParentV2Observed",
      ]),

      staleFalsePositiveBlocked:
        firstTri(proof, [
          "hearthCanvasStaleParentV2FalsePositiveBlocked",
          "canvasStaleParentV2FalsePositiveBlocked",
          "staleCanvasV2FalsePositiveBlocked",
        ]) === TRI.TRUE,

      canvasParentReleaseGateReadyTri: firstTri(proof, [
        "canvasParentReleaseGateReady",
        "hearthCanvasParentReleaseGateReady",
      ]),

      parentAcceptedRouteConductorReleaseTri: firstTri(proof, [
        "parentAcceptedRouteConductorRelease",
        "hearthCanvasParentAcceptedRouteConductorRelease",
      ]),

      releasePacketAcceptedTri: firstTri(proof, [
        "releasePacketAccepted",
        "hearthCanvasReleasePacketAccepted",
      ]),

      canvasParentReleaseAcceptedTri: firstTri(proof, [
        "canvasParentReleaseAccepted",
        "hearthCanvasParentReleaseAccepted",
      ]),

      currentParentIdentityMismatch:
        firstTri(proof, ["currentParentIdentityMismatch", "canvasParentIdentityMismatch"]) === TRI.TRUE,

      currentParentStaleDetected:
        firstTri(proof, ["currentParentStaleDetected"]) === TRI.TRUE,

      staleParentDetected:
        firstTri(proof, ["staleParentDetected"]) === TRI.TRUE,

      canvasCarrierHandoffError: firstString(proof, [
        "canvasCarrierHandoffError",
        "carrierHandoffError",
      ], ""),
    };

    if (!normalized.currentCanvasParentContractObserved && normalized.currentCanvasParentContract) {
      normalized.currentCanvasParentContractObserved = true;
    }

    if (!normalized.currentCanvasParentObserved && normalized.currentCanvasParentContract === CANVAS_PARENT_V10_3_CONTRACT) {
      normalized.currentCanvasParentObserved = true;
    }

    return normalized;
  }

  function triIsSafe(tri) {
    return tri === TRI.TRUE;
  }

  function triIsExplicitUnsafe(tri) {
    return tri === TRI.FALSE;
  }

  function assessPreReleaseCarrierAdmissibility() {
    const proof = readCanvasParentCarrier();

    if (!isObject(proof)) {
      state.currentCanvasParentObserved = false;
      state.currentCanvasParentContractObserved = false;
      state.currentCanvasParentContract = "";
      state.canvasParentBootMethodAvailable = false;
      state.carrierIdentitySafe = false;
      state.carrierSafeMarkerObserved = false;
      state.secondaryCarrierConfidenceObserved = false;
      state.preReleaseCarrierAdmissible = false;
      state.carrierHardBlock = false;
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_PARENT_CARRIER_PROOF";
      return false;
    }

    const normalized = normalizeCanvasCarrierProof(proof);

    state.currentCanvasParentObserved = normalized.currentCanvasParentObserved;
    state.currentCanvasParentContractObserved = normalized.currentCanvasParentContractObserved;
    state.currentCanvasParentContract = normalized.currentCanvasParentContract;
    state.canvasParentBootMethodAvailable = normalized.canvasParentBootMethodAvailable || hasCanvasBootCandidate();

    state.currentParentIdentityMismatch =
      normalized.currentCanvasParentContractObserved &&
      normalized.currentCanvasParentContract &&
      normalized.currentCanvasParentContract !== CANVAS_PARENT_V10_3_CONTRACT;

    state.currentParentStaleDetected = normalized.currentParentStaleDetected;
    state.staleParentDetected = normalized.staleParentDetected;

    state.structuralCarrierReadyTri = normalized.structuralCarrierReadyTri;
    state.structuralCarrierSafeTri = normalized.structuralCarrierSafeTri;
    state.canvasParentCarrierSafeTri = normalized.canvasParentCarrierSafeTri;
    state.structuralCarrierSafeForCanvasReleaseTri = normalized.structuralCarrierSafeForCanvasReleaseTri;
    state.canvasPreReleaseCarrierSafeForWestTri = normalized.canvasPreReleaseCarrierSafeForWestTri;

    const unsafeFields = [];

    if (state.currentParentIdentityMismatch) unsafeFields.push("currentParentIdentityMismatch");
    if (state.currentParentStaleDetected) unsafeFields.push("currentParentStaleDetected");
    if (state.staleParentDetected) unsafeFields.push("staleParentDetected");
    if (normalized.canvasCarrierHandoffError) unsafeFields.push("canvasCarrierHandoffError");

    if (triIsExplicitUnsafe(normalized.structuralCarrierSafeTri)) unsafeFields.push("structuralCarrierSafe");
    if (triIsExplicitUnsafe(normalized.canvasParentCarrierSafeTri)) unsafeFields.push("canvasParentCarrierSafe");
    if (triIsExplicitUnsafe(normalized.structuralCarrierSafeForCanvasReleaseTri)) unsafeFields.push("structuralCarrierSafeForCanvasRelease");
    if (triIsExplicitUnsafe(normalized.canvasPreReleaseCarrierSafeForWestTri)) unsafeFields.push("canvasPreReleaseCarrierSafeForWest");

    if (normalized.canvasParentV2ObservedTri === TRI.TRUE && !normalized.staleFalsePositiveBlocked) {
      unsafeFields.push("canvasParentV2Observed");
    }

    state.explicitUnsafeFields = unsafeFields.slice();

    if (unsafeFields.length) {
      state.carrierIdentitySafe = false;
      state.carrierSafeMarkerObserved = false;
      state.secondaryCarrierConfidenceObserved = false;
      state.preReleaseCarrierAdmissible = false;
      state.carrierHardBlock = true;
      state.carrierHeld = false;
      state.carrierHoldReason = `EXPLICIT_UNSAFE_CURRENT_CANVAS_CARRIER:${unsafeFields.join("|")}`;
      return false;
    }

    const identitySafe =
      state.currentCanvasParentObserved &&
      state.currentCanvasParentContractObserved &&
      state.currentCanvasParentContract === CANVAS_PARENT_V10_3_CONTRACT &&
      state.canvasParentBootMethodAvailable &&
      state.currentParentIdentityMismatch === false &&
      state.currentParentStaleDetected === false &&
      state.staleParentDetected === false;

    const primaryCarrierSafeMarker =
      triIsSafe(normalized.structuralCarrierReadyTri) ||
      triIsSafe(normalized.structuralCarrierSafeTri) ||
      triIsSafe(normalized.canvasParentCarrierSafeTri) ||
      triIsSafe(normalized.structuralCarrierSafeForCanvasReleaseTri) ||
      triIsSafe(normalized.canvasPreReleaseCarrierSafeForWestTri);

    const secondaryCarrierConfidence =
      normalized.canvasParentV10_3Active ||
      normalized.staleFalsePositiveBlocked ||
      normalized.canvasParentV2ObservedTri === TRI.FALSE ||
      normalized.canvasParentReleaseGateReadyTri === TRI.TRUE ||
      normalized.parentAcceptedRouteConductorReleaseTri === TRI.TRUE ||
      normalized.releasePacketAcceptedTri === TRI.TRUE ||
      normalized.canvasParentReleaseAcceptedTri === TRI.TRUE;

    const secondaryAllowedAsCarrierProof =
      state.canvasCarrierSourceIsCarrierSpecific && secondaryCarrierConfidence;

    state.carrierIdentitySafe = identitySafe;
    state.carrierSafeMarkerObserved = primaryCarrierSafeMarker || secondaryAllowedAsCarrierProof;
    state.secondaryCarrierConfidenceObserved = secondaryCarrierConfidence;

    if (identitySafe && state.carrierSafeMarkerObserved) {
      state.preReleaseCarrierAdmissible = true;
      state.carrierHardBlock = false;
      state.carrierHeld = false;
      state.carrierHoldReason = "NONE_PRE_RELEASE_CARRIER_ADMISSIBLE";
      return true;
    }

    if (identitySafe && !state.carrierSafeMarkerObserved) {
      state.preReleaseCarrierAdmissible = false;
      state.carrierHardBlock = false;
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_PARENT_CARRIER_SAFE_MARKER";
      return false;
    }

    state.preReleaseCarrierAdmissible = false;
    state.carrierHardBlock = false;
    state.carrierHeld = true;
    state.carrierHoldReason = "WAITING_CURRENT_CANVAS_PARENT_V10_3_IDENTITY_OR_BOOT";
    return false;
  }

  function getDatasetForCycleInput() {
    const doc = getDocument();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset || {};
  }

  function normalizeCycleInput(input) {
    const packet = isObject(input) ? clonePlain(input) : {};
    const ds = getDatasetForCycleInput();

    const fields = {
      cycleNumber: readExplicit(packet, ds, ["cycleNumber", "hearthCycleNumber", "hearthRouteConductorCycleNumber", "hearthSouthCycleNumber"]),
      cycleRoute: readExplicit(packet, ds, ["cycleRoute", "hearthCycleRoute", "hearthRouteConductorCycleRoute", "hearthSouthCycleRoute"]),
      receivedFrom: readExplicit(packet, ds, ["receivedFrom", "hearthReceivedFrom", "hearthRouteConductorReceivedFrom", "hearthSouthReceivedFrom"]),
      handoffTo: readExplicit(packet, ds, ["handoffTo", "hearthHandoffTo", "hearthRouteConductorHandoffTo", "hearthSouthHandoffTo"]),

      indexPairReady: readExplicit(packet, ds, ["indexPairReady", "hearthIndexPairReady", "hearthRouteConductorIndexPairReady", "hearthSouthIndexPairReady"]),
      carrierHostAdmissibilityReady: readExplicit(packet, ds, ["carrierHostAdmissibilityReady", "hearthCarrierHostAdmissibilityReady", "hearthRouteConductorCarrierHostAdmissibilityReady", "hearthSouthCarrierHostAdmissibilityReady"]),
      f8SelfDutySatisfied: readExplicit(packet, ds, ["f8SelfDutySatisfied", "hearthF8SelfDutySatisfied", "hearthRouteConductorF8SelfDutySatisfied", "hearthSouthF8SelfDutySatisfied"]),

      westHandoffPacketReady: readExplicit(packet, ds, ["westHandoffPacketReady", "hearthWestHandoffPacketReady", "hearthSouthWestHandoffPacketReady", "hearthRouteConductorWestHandoffPacketReady"]),
      outputSpreadComposed: readExplicit(packet, ds, ["outputSpreadComposed", "hearthOutputSpreadComposed", "hearthSouthOutputSpreadComposed"]),
      southOutputReady: readExplicit(packet, ds, ["southOutputReady", "hearthSouthOutputReady"]),
      cycleTwoSouthOutputReady: readExplicit(packet, ds, ["cycleTwoSouthOutputReady", "hearthCycleTwoSouthOutputReady", "hearthSouthCycleTwoSouthOutputReady"]),
      southOutputAdmissible: readExplicit(packet, ds, ["southOutputAdmissible", "hearthSouthOutputAdmissible"]),
      southVisibleProofReady: readExplicit(packet, ds, ["southVisibleProofReady", "hearthSouthVisibleProofReady"]),
      canvasSouthVisibleProofReady: readExplicit(packet, ds, ["canvasSouthVisibleProofReady", "hearthCanvasSouthVisibleProofReady"]),
      proofBodyComposed: readExplicit(packet, ds, ["proofBodyComposed", "hearthProofBodyComposed", "hearthSouthProofBodyComposed"]),
      receiptComposed: readExplicit(packet, ds, ["receiptComposed", "hearthReceiptComposed", "hearthSouthReceiptComposed"]),
      visibleStateComposed: readExplicit(packet, ds, ["visibleStateComposed", "hearthVisibleStateComposed", "hearthSouthVisibleStateComposed"]),
      routeConductorOutputReady: readExplicit(packet, ds, ["routeConductorOutputReady", "hearthRouteConductorOutputReady"]),
      routeConductorReleaseCandidate: readExplicit(packet, ds, ["routeConductorReleaseCandidate", "hearthRouteConductorReleaseCandidate"]),

      f13VisibleEvidenceAvailable: readExplicit(packet, ds, ["f13VisibleEvidenceAvailable", "hearthF13VisibleEvidenceAvailable"]),
      visibleEvidenceAvailable: readExplicit(packet, ds, ["visibleEvidenceAvailable", "hearthVisibleEvidenceAvailable"]),
      f13InspectEvidenceAvailable: readExplicit(packet, ds, ["f13InspectEvidenceAvailable", "hearthF13InspectEvidenceAvailable"]),
    };

    const cycleNumber = fields.cycleNumber.present ? Number(fields.cycleNumber.value) || 0 : 0;
    const cycleRoute = textFromExplicit(fields.cycleRoute, "");
    const receivedFrom = textFromExplicit(fields.receivedFrom, "UNKNOWN");
    const handoffTo = textFromExplicit(fields.handoffTo, "UNKNOWN");

    const indexPairReady = boolFromExplicit(fields.indexPairReady);
    const carrierHostAdmissibilityReady = boolFromExplicit(fields.carrierHostAdmissibilityReady);
    const f8SelfDutySatisfied = boolFromExplicit(fields.f8SelfDutySatisfied);

    const explicitSignals = [];

    function recordSignal(name, readResult, requiredValue) {
      if (!readResult.present) return false;

      const matched =
        typeof requiredValue === "boolean"
          ? toBool(readResult.value) === requiredValue
          : String(readResult.value || "").trim() === String(requiredValue);

      if (matched) explicitSignals.push(`${name}:${readResult.key}`);
      return matched;
    }

    const explicitRouteSignals = [
      recordSignal("receivedFrom=SOUTH", fields.receivedFrom, "SOUTH"),
      recordSignal("handoffTo=WEST", fields.handoffTo, "WEST"),
      recordSignal("cycleNumber=2", fields.cycleNumber, 2),
      recordSignal("cycleRoute=NORTH_EAST_SOUTH_WEST_CANVAS", fields.cycleRoute, "NORTH_EAST_SOUTH_WEST_CANVAS"),
    ].some(Boolean);

    const explicitAdmissibilitySignals = [
      recordSignal("f8SelfDutySatisfied=true", fields.f8SelfDutySatisfied, true),
      recordSignal("westHandoffPacketReady=true", fields.westHandoffPacketReady, true),
      recordSignal("outputSpreadComposed=true", fields.outputSpreadComposed, true),
      recordSignal("southOutputReady=true", fields.southOutputReady, true),
      recordSignal("cycleTwoSouthOutputReady=true", fields.cycleTwoSouthOutputReady, true),
      recordSignal("southOutputAdmissible=true", fields.southOutputAdmissible, true),
      recordSignal("southVisibleProofReady=true", fields.southVisibleProofReady, true),
      recordSignal("canvasSouthVisibleProofReady=true", fields.canvasSouthVisibleProofReady, true),
      recordSignal("proofBodyComposed=true", fields.proofBodyComposed, true),
      recordSignal("receiptComposed=true", fields.receiptComposed, true),
      recordSignal("visibleStateComposed=true", fields.visibleStateComposed, true),
      recordSignal("routeConductorOutputReady=true", fields.routeConductorOutputReady, true),
      recordSignal("routeConductorReleaseCandidate=true", fields.routeConductorReleaseCandidate, true),
    ].some(Boolean);

    const explicitVisibleFalseIgnored =
      (fields.f13VisibleEvidenceAvailable.present && toBool(fields.f13VisibleEvidenceAvailable.value) === false) ||
      (fields.visibleEvidenceAvailable.present && toBool(fields.visibleEvidenceAvailable.value) === false);

    if (explicitVisibleFalseIgnored) {
      explicitSignals.push("visibleEvidenceFalseIgnored:notSouthObservation");
    }

    const validCycleRoute =
      cycleNumber === 2 &&
      cycleRoute === "NORTH_EAST_SOUTH_WEST_CANVAS" &&
      handoffTo === "WEST";

    const explicitSouthOutputTrue =
      boolFromExplicit(fields.westHandoffPacketReady) ||
      boolFromExplicit(fields.outputSpreadComposed) ||
      boolFromExplicit(fields.southOutputReady) ||
      boolFromExplicit(fields.cycleTwoSouthOutputReady) ||
      boolFromExplicit(fields.southOutputAdmissible) ||
      boolFromExplicit(fields.southVisibleProofReady) ||
      boolFromExplicit(fields.canvasSouthVisibleProofReady) ||
      boolFromExplicit(fields.proofBodyComposed) ||
      boolFromExplicit(fields.receiptComposed) ||
      boolFromExplicit(fields.visibleStateComposed) ||
      boolFromExplicit(fields.routeConductorOutputReady) ||
      boolFromExplicit(fields.routeConductorReleaseCandidate);

    const cycleTwoSouthOutputObserved =
      validCycleRoute &&
      explicitRouteSignals &&
      explicitAdmissibilitySignals;

    const cycleTwoSouthOutputAdmissible =
      validCycleRoute &&
      cycleTwoSouthOutputObserved &&
      indexPairReady &&
      carrierHostAdmissibilityReady &&
      f8SelfDutySatisfied &&
      explicitSouthOutputTrue;

    state.lastInput = clonePlain({
      packet,
      fields,
      explicitSignals,
    });

    state.cycleNumber = cycleNumber;
    state.cycleRoute = cycleRoute;
    state.receivedFrom = receivedFrom;
    state.handoffTo = handoffTo;

    state.indexPairReady = indexPairReady;
    state.carrierHostAdmissibilityReady = carrierHostAdmissibilityReady;
    state.f8SelfDutySatisfied = f8SelfDutySatisfied;

    state.indexPairReadyObserved = fields.indexPairReady.present;
    state.carrierHostAdmissibilityReadyObserved = fields.carrierHostAdmissibilityReady.present;
    state.f8SelfDutySatisfiedObserved = fields.f8SelfDutySatisfied.present;

    state.southOutputReady = explicitSouthOutputTrue;
    state.routeConductorOutputReady = boolFromExplicit(fields.routeConductorOutputReady);
    state.routeConductorReleaseCandidate = boolFromExplicit(fields.routeConductorReleaseCandidate);
    state.explicitSouthRouteSignalObserved = explicitRouteSignals;
    state.explicitSouthAdmissibilitySignalObserved = explicitAdmissibilitySignals;
    state.southRouteConductorPacketObserved = cycleTwoSouthOutputObserved;
    state.cycleTwoSouthOutputObserved = cycleTwoSouthOutputObserved;
    state.cycleTwoSouthOutputAdmissible = cycleTwoSouthOutputAdmissible;
    state.southOutputIntakeMethod = cycleTwoSouthOutputObserved ? "EXPLICIT_SOUTH_ROUTE_CONDUCTOR_SIGNAL" : "NONE";
    state.explicitSouthSignals = explicitSignals.slice();

    return {
      cycleNumber,
      cycleRoute,
      receivedFrom,
      handoffTo,
      indexPairReady,
      carrierHostAdmissibilityReady,
      f8SelfDutySatisfied,
      explicitRouteSignals,
      explicitAdmissibilitySignals,
      explicitSouthOutputTrue,
      cycleTwoSouthOutputObserved,
      cycleTwoSouthOutputAdmissible,
    };
  }

  function composeCanvasReleasePacket() {
    const packet = {
      timestamp: nowIso(),

      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      sourceFile: FILE,
      westSourceFile: FILE,
      route: ROUTE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,

      cycleNumber: 2,
      cycleRoute: "NORTH_EAST_SOUTH_WEST_CANVAS",
      receivedFrom: "WEST",
      handoffTo: "CANVAS",
      destinationFile: CANVAS_PARENT_FILE,
      targetFile: CANVAS_PARENT_FILE,

      westAuditObserved: true,
      westAuditAccepted: true,
      westAuditPassed: true,
      westDecision: WEST_DECISION.RELEASE_TO_CANVAS,
      westGapClass: "NONE",
      westHardBlock: false,
      westForwardAllowed: true,
      westCanvasReleaseApproved: true,

      canvasReleaseAuthorized: true,
      canvasReleasePacketReady: true,
      canvasReleaseApprovedByWest: true,
      releaseToCanvas: true,

      carrierHostAdmissibilityReady: true,
      indexPairReady: true,
      f8SelfDutySatisfied: true,
      cycleTwoSouthOutputObserved: true,
      cycleTwoSouthOutputAdmissible: true,

      preReleaseCarrierAdmissible: true,
      currentCanvasParentObserved: state.currentCanvasParentObserved,
      currentCanvasParentContractObserved: state.currentCanvasParentContractObserved,
      currentCanvasParentContract: state.currentCanvasParentContract,
      canvasParentBootMethodAvailable: state.canvasParentBootMethodAvailable,
      canvasParentCarrierSafe: true,
      structuralCarrierSafeForCanvasRelease: true,

      firstFailedCoordinate: "NONE_CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_WEST",
      recommendedNextFile: CANVAS_PARENT_FILE,
      recommendedNextRenewalTarget: CANVAS_PARENT_FILE,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      f21ClaimedByWest: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
    };

    state.releasePacket = clonePlain(packet);
    return packet;
  }

  function publishCanvasReleasePacket(packet) {
    if (!isObject(packet)) return false;

    const w = getWindow();
    const h = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    h.canvasReleasePacket = clonePlain(packet);
    h.routeConductorReleasePacket = clonePlain(packet);
    h.westCanvasReleasePacket = clonePlain(packet);

    lab.hearthWestCanvasReleasePacket = clonePlain(packet);
    lab.hearthRuntimeTableWestReleasePacket = clonePlain(packet);

    w.HEARTH_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.HEARTH_WEST_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.LAB_RUNTIME_TABLE_WEST_CANVAS_RELEASE_PACKET = clonePlain(packet);

    return true;
  }

  function clearCanvasReleasePacket() {
    const w = getWindow();
    const h = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    h.canvasReleasePacket = null;
    h.routeConductorReleasePacket = null;
    h.westCanvasReleasePacket = null;

    lab.hearthWestCanvasReleasePacket = null;
    lab.hearthRuntimeTableWestReleasePacket = null;

    w.HEARTH_CANVAS_RELEASE_PACKET = null;
    w.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = null;
    w.HEARTH_WEST_CANVAS_RELEASE_PACKET = null;
    w.LAB_RUNTIME_TABLE_WEST_CANVAS_RELEASE_PACKET = null;

    return true;
  }

  function clearReleaseState() {
    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseApprovedByWest = false;
    state.releaseToCanvas = false;
    state.westCanvasReleaseApproved = false;
    state.releasePacket = null;
    clearCanvasReleasePacket();
  }

  function applyWestDecision() {
    if (state.carrierHardBlock) {
      state.westAuditAccepted = true;
      state.westAuditPassed = false;
      state.westDecision = WEST_DECISION.HARD_BLOCK;
      state.westGapClass = "STRUCTURAL_BLOCK";
      state.westHardBlock = true;
      state.westForwardAllowed = false;

      clearReleaseState();

      state.canvasReleaseHeldReason = state.carrierHoldReason || "STRUCTURAL_CARRIER_UNSAFE_FOR_CANVAS";
      state.firstFailedCoordinate = "STRUCTURAL_CARRIER_UNSAFE_FOR_CANVAS";
      state.recommendedNextFile = state.currentParentIdentityMismatch ? CANVAS_PARENT_FILE : FILE;
      state.recommendedNextRenewalTarget = state.currentParentIdentityMismatch ? CANVAS_PARENT_FILE : FILE;
      state.postgameStatus = "WEST_HARD_BLOCK_CURRENT_CANVAS_CARRIER_UNSAFE";
      return state.westDecision;
    }

    if (state.carrierHeld) {
      state.westAuditAccepted = true;
      state.westAuditPassed = false;
      state.westDecision = WEST_DECISION.HOLD;
      state.westGapClass = "CARRIER_HOLD";
      state.westHardBlock = false;
      state.westForwardAllowed = false;

      clearReleaseState();

      state.canvasReleaseHeldReason = state.carrierHoldReason || "WAITING_CURRENT_CANVAS_PARENT_CARRIER_PROOF";
      state.firstFailedCoordinate =
        state.carrierHoldReason === "WAITING_CURRENT_CANVAS_PARENT_CARRIER_SAFE_MARKER"
          ? "WAITING_CURRENT_CANVAS_PARENT_CARRIER_SAFE_MARKER"
          : "WAITING_CURRENT_CANVAS_PARENT_CARRIER_PROOF";
      state.recommendedNextFile = CANVAS_PARENT_FILE;
      state.recommendedNextRenewalTarget = CANVAS_PARENT_FILE;
      state.postgameStatus = "WEST_HOLD_WAITING_CURRENT_CANVAS_PARENT_CARRIER_PROOF";
      return state.westDecision;
    }

    if (!state.cycleTwoSouthOutputAdmissible) {
      state.westAuditAccepted = true;
      state.westAuditPassed = false;
      state.westDecision = WEST_DECISION.HOLD;
      state.westGapClass = "WAITING_CYCLE_TWO_SOUTH_OUTPUT";
      state.westHardBlock = false;
      state.westForwardAllowed = false;

      clearReleaseState();

      state.canvasReleaseHeldReason = "WAITING_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBILITY";
      state.firstFailedCoordinate = "WAITING_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBILITY";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "WEST_HOLD_WAITING_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBILITY";
      return state.westDecision;
    }

    state.westAuditAccepted = true;
    state.westAuditPassed = true;
    state.westDecision = WEST_DECISION.RELEASE_TO_CANVAS;
    state.westGapClass = "NONE";
    state.westHardBlock = false;
    state.westForwardAllowed = true;
    state.westCanvasReleaseApproved = true;

    state.canvasReleaseAuthorized = true;
    state.canvasReleasePacketReady = true;
    state.canvasReleaseApprovedByWest = true;
    state.releaseToCanvas = true;
    state.canvasReleaseHeldReason = "NONE_CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_WEST";

    state.firstFailedCoordinate = "NONE_CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_WEST";
    state.recommendedNextFile = CANVAS_PARENT_FILE;
    state.recommendedNextRenewalTarget = CANVAS_PARENT_FILE;
    state.postgameStatus = "CYCLE_2_CANVAS_RELEASE_AUTHORIZED_BY_WEST";

    const releasePacket = composeCanvasReleasePacket();
    publishCanvasReleasePacket(releasePacket);

    return state.westDecision;
  }

  function classifyWestAdmissibility(input) {
    state.timestamp = nowIso();

    initializeCheckpoints();
    normalizeCycleInput(input);
    assessPreReleaseCarrierAdmissibility();
    applyWestDecision();

    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21EligibilitySubmittedToNorth = false;
    state.completionLatched = false;
    state.readyTextAllowed = false;
    state.visualPassClaimed = false;
    state.f21ClaimedByWest = false;

    updateDataset();
    publishGlobals();

    return getReceipt();
  }

  function assess(input) {
    return classifyWestAdmissibility(input);
  }

  function inspect(input) {
    return classifyWestAdmissibility(input);
  }

  function run(input) {
    return classifyWestAdmissibility(input);
  }

  function boot(input) {
    return classifyWestAdmissibility(input || {});
  }

  function init(input) {
    return classifyWestAdmissibility(input || {});
  }

  function start(input) {
    return classifyWestAdmissibility(input || {});
  }

  function mount(input) {
    return classifyWestAdmissibility(input || {});
  }

  function getCanvasReleasePacket() {
    if (isObject(state.releasePacket)) return clonePlain(state.releasePacket);

    if (state.canvasReleasePacketReady && state.canvasReleaseAuthorized) {
      return composeCanvasReleasePacket();
    }

    return null;
  }

  function getReleasePacket() {
    return getCanvasReleasePacket();
  }

  function getCanvasHandoffPacket() {
    return getCanvasReleasePacket();
  }

  function getHandoffPacket() {
    return getCanvasReleasePacket();
  }

  function getReceiptLight() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      route: ROUTE,

      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      receivedFrom: state.receivedFrom,
      handoffTo: state.handoffTo,

      f13nCheckpointCorrected: state.f13nCheckpointCorrected,

      currentCanvasParentObserved: state.currentCanvasParentObserved,
      currentCanvasParentContractObserved: state.currentCanvasParentContractObserved,
      currentCanvasParentContract: state.currentCanvasParentContract,
      currentParentIdentityMismatch: state.currentParentIdentityMismatch,
      currentParentStaleDetected: state.currentParentStaleDetected,
      staleParentDetected: state.staleParentDetected,
      canvasParentBootMethodAvailable: state.canvasParentBootMethodAvailable,

      canvasCarrierReceiptObserved: state.canvasCarrierReceiptObserved,
      canvasCarrierSourceMethod: state.canvasCarrierSourceMethod,
      canvasCarrierSourceIsCarrierSpecific: state.canvasCarrierSourceIsCarrierSpecific,

      structuralCarrierReadyTri: state.structuralCarrierReadyTri,
      structuralCarrierSafeTri: state.structuralCarrierSafeTri,
      canvasParentCarrierSafeTri: state.canvasParentCarrierSafeTri,
      structuralCarrierSafeForCanvasReleaseTri: state.structuralCarrierSafeForCanvasReleaseTri,
      canvasPreReleaseCarrierSafeForWestTri: state.canvasPreReleaseCarrierSafeForWestTri,

      carrierIdentitySafe: state.carrierIdentitySafe,
      carrierSafeMarkerObserved: state.carrierSafeMarkerObserved,
      secondaryCarrierConfidenceObserved: state.secondaryCarrierConfidenceObserved,

      preReleaseCarrierAdmissible: state.preReleaseCarrierAdmissible,
      canvasParentCarrierSafe: state.preReleaseCarrierAdmissible,
      structuralCarrierSafeForCanvasRelease: state.preReleaseCarrierAdmissible,
      carrierHardBlock: state.carrierHardBlock,
      carrierHeld: state.carrierHeld,
      carrierHoldReason: state.carrierHoldReason,
      explicitUnsafeFields: state.explicitUnsafeFields.slice(),

      indexPairReady: state.indexPairReady,
      carrierHostAdmissibilityReady: state.carrierHostAdmissibilityReady,
      f8SelfDutySatisfied: state.f8SelfDutySatisfied,
      indexPairReadyObserved: state.indexPairReadyObserved,
      carrierHostAdmissibilityReadyObserved: state.carrierHostAdmissibilityReadyObserved,
      f8SelfDutySatisfiedObserved: state.f8SelfDutySatisfiedObserved,

      southRouteConductorPacketObserved: state.southRouteConductorPacketObserved,
      explicitSouthRouteSignalObserved: state.explicitSouthRouteSignalObserved,
      explicitSouthAdmissibilitySignalObserved: state.explicitSouthAdmissibilitySignalObserved,
      southOutputReady: state.southOutputReady,
      routeConductorOutputReady: state.routeConductorOutputReady,
      routeConductorReleaseCandidate: state.routeConductorReleaseCandidate,
      cycleTwoSouthOutputObserved: state.cycleTwoSouthOutputObserved,
      cycleTwoSouthOutputAdmissible: state.cycleTwoSouthOutputAdmissible,
      southOutputIntakeMethod: state.southOutputIntakeMethod,
      explicitSouthSignals: state.explicitSouthSignals.slice(),

      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westAuditPassed: state.westAuditPassed,
      westDecision: state.westDecision,
      westGapClass: state.westGapClass,
      westHardBlock: state.westHardBlock,
      westForwardAllowed: state.westForwardAllowed,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,

      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseApprovedByWest: state.canvasReleaseApprovedByWest,
      releaseToCanvas: state.releaseToCanvas,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,

      releasePacket: clonePlain(state.releasePacket),
      canvasReleasePacket: clonePlain(state.releasePacket),

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      f21ClaimedByWest: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,
    };
  }

  function getReceipt() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: "2026-06-01.lab-runtime-table-west-current-canvas-parent-v10-3-carrier-compatibility-v4-2",
      file: FILE,
      route: ROUTE,
      role: state.role,

      westRuntimeTableLoaded: true,
      westV4_2Active: true,
      westV4_1Superseded: true,
      westV4Superseded: true,
      westV3Superseded: true,

      checkpointRegistry: clonePlain(state.checkpointRegistry),
      f13nCheckpointCorrected: state.f13nCheckpointCorrected,

      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      receivedFrom: state.receivedFrom,
      handoffTo: state.handoffTo,

      currentCanvasParentObserved: state.currentCanvasParentObserved,
      currentCanvasParentContractObserved: state.currentCanvasParentContractObserved,
      currentCanvasParentContract: state.currentCanvasParentContract,
      currentParentIdentityMismatch: state.currentParentIdentityMismatch,
      currentParentStaleDetected: state.currentParentStaleDetected,
      staleParentDetected: state.staleParentDetected,
      canvasParentBootMethodAvailable: state.canvasParentBootMethodAvailable,

      canvasCarrierReceiptObserved: state.canvasCarrierReceiptObserved,
      canvasCarrierSourceMethod: state.canvasCarrierSourceMethod,
      canvasCarrierSourceIsCarrierSpecific: state.canvasCarrierSourceIsCarrierSpecific,
      canvasCarrierProof: clonePlain(state.canvasCarrierProof),

      structuralCarrierReadyTri: state.structuralCarrierReadyTri,
      structuralCarrierSafeTri: state.structuralCarrierSafeTri,
      canvasParentCarrierSafeTri: state.canvasParentCarrierSafeTri,
      structuralCarrierSafeForCanvasReleaseTri: state.structuralCarrierSafeForCanvasReleaseTri,
      canvasPreReleaseCarrierSafeForWestTri: state.canvasPreReleaseCarrierSafeForWestTri,

      carrierIdentitySafe: state.carrierIdentitySafe,
      carrierSafeMarkerObserved: state.carrierSafeMarkerObserved,
      secondaryCarrierConfidenceObserved: state.secondaryCarrierConfidenceObserved,

      preReleaseCarrierAdmissible: state.preReleaseCarrierAdmissible,
      canvasParentCarrierSafe: state.preReleaseCarrierAdmissible,
      structuralCarrierSafeForCanvasRelease: state.preReleaseCarrierAdmissible,
      carrierHardBlock: state.carrierHardBlock,
      carrierHeld: state.carrierHeld,
      carrierHoldReason: state.carrierHoldReason,
      explicitUnsafeFields: state.explicitUnsafeFields.slice(),

      indexPairReady: state.indexPairReady,
      carrierHostAdmissibilityReady: state.carrierHostAdmissibilityReady,
      f8SelfDutySatisfied: state.f8SelfDutySatisfied,
      indexPairReadyObserved: state.indexPairReadyObserved,
      carrierHostAdmissibilityReadyObserved: state.carrierHostAdmissibilityReadyObserved,
      f8SelfDutySatisfiedObserved: state.f8SelfDutySatisfiedObserved,

      southRouteConductorPacketObserved: state.southRouteConductorPacketObserved,
      explicitSouthRouteSignalObserved: state.explicitSouthRouteSignalObserved,
      explicitSouthAdmissibilitySignalObserved: state.explicitSouthAdmissibilitySignalObserved,
      southOutputReady: state.southOutputReady,
      routeConductorOutputReady: state.routeConductorOutputReady,
      routeConductorReleaseCandidate: state.routeConductorReleaseCandidate,
      cycleTwoSouthOutputObserved: state.cycleTwoSouthOutputObserved,
      cycleTwoSouthOutputAdmissible: state.cycleTwoSouthOutputAdmissible,
      southOutputIntakeMethod: state.southOutputIntakeMethod,
      explicitSouthSignals: state.explicitSouthSignals.slice(),

      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westAuditPassed: state.westAuditPassed,
      westDecision: state.westDecision,
      westGapClass: state.westGapClass,
      westHardBlock: state.westHardBlock,
      westForwardAllowed: state.westForwardAllowed,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,

      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseApprovedByWest: state.canvasReleaseApprovedByWest,
      releaseToCanvas: state.releaseToCanvas,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,

      releasePacket: clonePlain(state.releasePacket),
      canvasReleasePacket: clonePlain(state.releasePacket),

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      f21ClaimedByWest: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_RECEIPT",
      "",
      `timestamp=${r.timestamp}`,
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      `westRuntimeTableLoaded=${r.westRuntimeTableLoaded}`,
      `westV4_2Active=${r.westV4_2Active}`,
      `westV4_1Superseded=${r.westV4_1Superseded}`,
      `westV4Superseded=${r.westV4Superseded}`,
      `westV3Superseded=${r.westV3Superseded}`,
      "",
      `f13nCheckpointCorrected=${r.f13nCheckpointCorrected}`,
      "",
      `cycleNumber=${r.cycleNumber}`,
      `cycleRoute=${r.cycleRoute}`,
      `receivedFrom=${r.receivedFrom}`,
      `handoffTo=${r.handoffTo}`,
      "",
      `currentCanvasParentObserved=${r.currentCanvasParentObserved}`,
      `currentCanvasParentContractObserved=${r.currentCanvasParentContractObserved}`,
      `currentCanvasParentContract=${r.currentCanvasParentContract}`,
      `currentParentIdentityMismatch=${r.currentParentIdentityMismatch}`,
      `currentParentStaleDetected=${r.currentParentStaleDetected}`,
      `staleParentDetected=${r.staleParentDetected}`,
      `canvasParentBootMethodAvailable=${r.canvasParentBootMethodAvailable}`,
      "",
      `canvasCarrierReceiptObserved=${r.canvasCarrierReceiptObserved}`,
      `canvasCarrierSourceMethod=${r.canvasCarrierSourceMethod}`,
      `canvasCarrierSourceIsCarrierSpecific=${r.canvasCarrierSourceIsCarrierSpecific}`,
      `structuralCarrierReadyTri=${r.structuralCarrierReadyTri}`,
      `structuralCarrierSafeTri=${r.structuralCarrierSafeTri}`,
      `canvasParentCarrierSafeTri=${r.canvasParentCarrierSafeTri}`,
      `structuralCarrierSafeForCanvasReleaseTri=${r.structuralCarrierSafeForCanvasReleaseTri}`,
      `canvasPreReleaseCarrierSafeForWestTri=${r.canvasPreReleaseCarrierSafeForWestTri}`,
      `carrierIdentitySafe=${r.carrierIdentitySafe}`,
      `carrierSafeMarkerObserved=${r.carrierSafeMarkerObserved}`,
      `secondaryCarrierConfidenceObserved=${r.secondaryCarrierConfidenceObserved}`,
      "",
      `preReleaseCarrierAdmissible=${r.preReleaseCarrierAdmissible}`,
      `canvasParentCarrierSafe=${r.canvasParentCarrierSafe}`,
      `structuralCarrierSafeForCanvasRelease=${r.structuralCarrierSafeForCanvasRelease}`,
      `carrierHardBlock=${r.carrierHardBlock}`,
      `carrierHeld=${r.carrierHeld}`,
      `carrierHoldReason=${r.carrierHoldReason}`,
      `explicitUnsafeFields=${r.explicitUnsafeFields.join(",") || "none"}`,
      "",
      `indexPairReady=${r.indexPairReady}`,
      `carrierHostAdmissibilityReady=${r.carrierHostAdmissibilityReady}`,
      `f8SelfDutySatisfied=${r.f8SelfDutySatisfied}`,
      `indexPairReadyObserved=${r.indexPairReadyObserved}`,
      `carrierHostAdmissibilityReadyObserved=${r.carrierHostAdmissibilityReadyObserved}`,
      `f8SelfDutySatisfiedObserved=${r.f8SelfDutySatisfiedObserved}`,
      "",
      `southRouteConductorPacketObserved=${r.southRouteConductorPacketObserved}`,
      `explicitSouthRouteSignalObserved=${r.explicitSouthRouteSignalObserved}`,
      `explicitSouthAdmissibilitySignalObserved=${r.explicitSouthAdmissibilitySignalObserved}`,
      `southOutputReady=${r.southOutputReady}`,
      `routeConductorOutputReady=${r.routeConductorOutputReady}`,
      `routeConductorReleaseCandidate=${r.routeConductorReleaseCandidate}`,
      `cycleTwoSouthOutputObserved=${r.cycleTwoSouthOutputObserved}`,
      `cycleTwoSouthOutputAdmissible=${r.cycleTwoSouthOutputAdmissible}`,
      `southOutputIntakeMethod=${r.southOutputIntakeMethod}`,
      `explicitSouthSignals=${r.explicitSouthSignals.join(",") || "none"}`,
      "",
      `westAuditObserved=${r.westAuditObserved}`,
      `westAuditAccepted=${r.westAuditAccepted}`,
      `westAuditPassed=${r.westAuditPassed}`,
      `westDecision=${r.westDecision}`,
      `westGapClass=${r.westGapClass}`,
      `westHardBlock=${r.westHardBlock}`,
      `westForwardAllowed=${r.westForwardAllowed}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      "",
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      `canvasReleasePacketReady=${r.canvasReleasePacketReady}`,
      `canvasReleaseApprovedByWest=${r.canvasReleaseApprovedByWest}`,
      `releaseToCanvas=${r.releaseToCanvas}`,
      `canvasReleaseHeldReason=${r.canvasReleaseHeldReason}`,
      `releasePacket=${r.releasePacket ? "present" : "null"}`,
      `canvasReleasePacket=${r.canvasReleasePacket ? "present" : "null"}`,
      "",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21EligibilitySubmittedToNorth=${r.f21EligibilitySubmittedToNorth}`,
      `completionLatched=${r.completionLatched}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `f21ClaimedByWest=${r.f21ClaimedByWest}`,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`,
    ].join("\n");
  }

  function updateDataset() {
    const doc = getDocument();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const ds = doc.documentElement.dataset;

    ds.labRuntimeTableWestLoaded = "true";
    ds.labRuntimeTableWestContract = CONTRACT;
    ds.labRuntimeTableWestReceipt = RECEIPT;
    ds.labRuntimeTableWestV4_2Active = "true";
    ds.labRuntimeTableWestV4_1Superseded = "true";
    ds.labRuntimeTableWestV4Superseded = "true";
    ds.labRuntimeTableWestV3Superseded = "true";

    ds.hearthWestRuntimeTableLoaded = "true";
    ds.hearthWestRuntimeTableContract = CONTRACT;
    ds.hearthWestRuntimeTableReceipt = RECEIPT;

    ds.hearthWestF13NCheckpointCorrected = String(Boolean(state.f13nCheckpointCorrected));

    ds.hearthWestCycleNumber = String(state.cycleNumber);
    ds.hearthWestCycleRoute = state.cycleRoute;
    ds.hearthWestReceivedFrom = state.receivedFrom;
    ds.hearthWestHandoffTo = state.handoffTo;

    ds.hearthWestCurrentCanvasParentObserved = String(Boolean(state.currentCanvasParentObserved));
    ds.hearthWestCurrentCanvasParentContractObserved = String(Boolean(state.currentCanvasParentContractObserved));
    ds.hearthWestCurrentCanvasParentContract = state.currentCanvasParentContract;
    ds.hearthWestCanvasParentBootMethodAvailable = String(Boolean(state.canvasParentBootMethodAvailable));

    ds.hearthWestCanvasCarrierReceiptObserved = String(Boolean(state.canvasCarrierReceiptObserved));
    ds.hearthWestCanvasCarrierSourceMethod = state.canvasCarrierSourceMethod;
    ds.hearthWestCanvasCarrierSourceIsCarrierSpecific = String(Boolean(state.canvasCarrierSourceIsCarrierSpecific));

    ds.hearthWestCarrierIdentitySafe = String(Boolean(state.carrierIdentitySafe));
    ds.hearthWestCarrierSafeMarkerObserved = String(Boolean(state.carrierSafeMarkerObserved));
    ds.hearthWestSecondaryCarrierConfidenceObserved = String(Boolean(state.secondaryCarrierConfidenceObserved));

    ds.hearthWestPreReleaseCarrierAdmissible = String(Boolean(state.preReleaseCarrierAdmissible));
    ds.hearthWestCanvasParentCarrierSafe = String(Boolean(state.preReleaseCarrierAdmissible));
    ds.hearthWestStructuralCarrierSafeForCanvasRelease = String(Boolean(state.preReleaseCarrierAdmissible));
    ds.hearthWestCarrierHardBlock = String(Boolean(state.carrierHardBlock));
    ds.hearthWestCarrierHeld = String(Boolean(state.carrierHeld));
    ds.hearthWestCarrierHoldReason = state.carrierHoldReason;

    ds.hearthWestIndexPairReady = String(Boolean(state.indexPairReady));
    ds.hearthWestCarrierHostAdmissibilityReady = String(Boolean(state.carrierHostAdmissibilityReady));
    ds.hearthWestF8SelfDutySatisfied = String(Boolean(state.f8SelfDutySatisfied));
    ds.hearthWestIndexPairReadyObserved = String(Boolean(state.indexPairReadyObserved));
    ds.hearthWestCarrierHostAdmissibilityReadyObserved = String(Boolean(state.carrierHostAdmissibilityReadyObserved));
    ds.hearthWestF8SelfDutySatisfiedObserved = String(Boolean(state.f8SelfDutySatisfiedObserved));

    ds.hearthWestSouthRouteConductorPacketObserved = String(Boolean(state.southRouteConductorPacketObserved));
    ds.hearthWestExplicitSouthRouteSignalObserved = String(Boolean(state.explicitSouthRouteSignalObserved));
    ds.hearthWestExplicitSouthAdmissibilitySignalObserved = String(Boolean(state.explicitSouthAdmissibilitySignalObserved));
    ds.hearthWestSouthOutputReady = String(Boolean(state.southOutputReady));
    ds.hearthWestRouteConductorOutputReady = String(Boolean(state.routeConductorOutputReady));
    ds.hearthWestRouteConductorReleaseCandidate = String(Boolean(state.routeConductorReleaseCandidate));
    ds.hearthWestCycleTwoSouthOutputObserved = String(Boolean(state.cycleTwoSouthOutputObserved));
    ds.hearthWestCycleTwoSouthOutputAdmissible = String(Boolean(state.cycleTwoSouthOutputAdmissible));
    ds.hearthWestSouthOutputIntakeMethod = state.southOutputIntakeMethod;

    ds.hearthWestAuditObserved = String(Boolean(state.westAuditObserved));
    ds.hearthWestAuditAccepted = String(Boolean(state.westAuditAccepted));
    ds.hearthWestAuditPassed = String(Boolean(state.westAuditPassed));
    ds.hearthWestDecision = state.westDecision;
    ds.hearthWestGapClass = state.westGapClass;
    ds.hearthWestHardBlock = String(Boolean(state.westHardBlock));
    ds.hearthWestForwardAllowed = String(Boolean(state.westForwardAllowed));
    ds.hearthWestCanvasReleaseApproved = String(Boolean(state.westCanvasReleaseApproved));

    ds.hearthCanvasReleaseAuthorized = String(Boolean(state.canvasReleaseAuthorized));
    ds.hearthCanvasReleasePacketReady = String(Boolean(state.canvasReleasePacketReady));
    ds.hearthCanvasReleaseApprovedByWest = String(Boolean(state.canvasReleaseApprovedByWest));
    ds.hearthReleaseToCanvas = String(Boolean(state.releaseToCanvas));
    ds.hearthCanvasReleaseHeldReason = state.canvasReleaseHeldReason;

    ds.hearthWestF21EligibleForNorth = "false";
    ds.hearthWestF21SubmittedToNorth = "false";
    ds.hearthWestCompletionLatched = "false";
    ds.hearthWestReadyTextAllowed = "false";
    ds.hearthWestVisualPassClaimed = "false";
    ds.visualPassClaimed = "false";

    ds.hearthWestFirstFailedCoordinate = state.firstFailedCoordinate;
    ds.hearthWestRecommendedNextFile = state.recommendedNextFile;
    ds.hearthWestRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    ds.hearthWestPostgameStatus = state.postgameStatus;

    return true;
  }

  function publishGlobals() {
    const w = getWindow();
    const lab = ensureObject(w, "DEXTER_LAB");
    const h = ensureObject(w, "HEARTH");

    lab.runtimeTableWest = api;
    lab.hearthRuntimeTableWest = api;
    lab.westAdmissibility = api;

    h.runtimeTableWest = api;
    h.westRuntimeTable = api;
    h.westAdmissibility = api;
    h.macroWestAuthority = api;

    w.LAB_RUNTIME_TABLE_WEST = api;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST = api;
    w.HEARTH_RUNTIME_TABLE_WEST = api;
    w.HEARTH_MACRO_WEST_AUTHORITY = api;
    w.HEARTH_WEST_ADMISSIBILITY = api;

    w.LAB_RUNTIME_TABLE_WEST_RECEIPT = getReceiptLight();
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_RECEIPT = getReceipt();
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_RECEIPT = getReceipt();
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_RECEIPT_v4_2 = getReceipt();

    h.westReceipt = getReceiptLight();
    lab.hearthRuntimeTableWestReceipt = getReceipt();

    if (state.releasePacket) {
      publishCanvasReleasePacket(state.releasePacket);
    } else {
      clearCanvasReleasePacket();
    }

    return api;
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    BASELINE_CONTRACT,
    FILE,
    ROUTE,
    CANVAS_PARENT_FILE,
    ROUTE_CONDUCTOR_FILE,
    CANVAS_PARENT_V10_3_CONTRACT,

    TRI,
    CHECKPOINT_IDS,
    WEST_DECISION,

    checkpoint,
    initializeCheckpoints,

    readCanvasParentCarrier,
    assessPreReleaseCarrierAdmissibility,
    classifyWestAdmissibility,
    composeCanvasReleasePacket,
    publishCanvasReleasePacket,
    clearCanvasReleasePacket,

    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket,
    getHandoffPacket,

    assess,
    inspect,
    run,
    boot,
    init,
    start,
    mount,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    updateDataset,
    publishGlobals,

    getState: () => clonePlain(state),
  };

  initializeCheckpoints();
  publishGlobals();
  classifyWestAdmissibility({});
})();
