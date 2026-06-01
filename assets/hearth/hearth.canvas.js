// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3
// Full-file replacement.
// Canvas parent / release-acceptance switchboard only.
// Purpose:
// - Final targeted parent receipt/gate compatibility renewal.
// - Accept explicit Route Conductor release packets passed through lifecycle options, direct receiver methods, globals, or dataset fallback.
// - Publish exact parent release gate readiness.
// - Publish exact accepted Route Conductor release marker.
// - Compose, publish, and dispatch the lawful East handoff packet.
// - Preserve East v5 alias recognition.
// - Classify East response without claiming F21, ready text, completion latch, or final visual pass.
// Owns:
// - Canvas parent identity
// - structural carrier publication
// - route-conductor release packet intake
// - direct release packet consumption
// - lifecycle option packet consumption
// - minimum release-shape validation
// - parent release acceptance
// - parent release gate readiness
// - East dispatch packet composition
// - East dispatch packet publication
// - East dispatch authorization
// - East response classification
// - lawful held-packet recognition
// - F13 parent-level observation
// - F21 blocking
// - receipt and dataset publication
// - compatibility aliases required by upstream consumers
// Does not own:
// - Macro West admissibility
// - direct Lab West calls
// - route conductor switching
// - East atlas/source truth
// - West inspection truth
// - South visible proof truth
// - material truth
// - elevation truth
// - hydrology truth
// - final visual pass
// - ready text
// - F21 latch

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3";
  const RECEIPT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT_v10_3";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_2";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";
  const ROUTE = "/showroom/globe/hearth/";

  const RELEASE_SOURCE = Object.freeze({
    ROUTE_CONDUCTOR: "ROUTE_CONDUCTOR",
    NONE: "NONE",
  });

  const EAST_RESULT_CLASS = Object.freeze({
    NOT_DISPATCHED: "NOT_DISPATCHED",
    MISSING_API: "MISSING_API",
    WAITING_RESPONSE: "WAITING_RESPONSE",
    HELD_PACKET: "HELD_PACKET",
    ATLAS_EVIDENCE: "ATLAS_EVIDENCE",
    FALSE_PROMOTION_BLOCKED: "FALSE_PROMOTION_BLOCKED",
    DOWNSTREAM_CHILD_EVIDENCE_WAIT: "DOWNSTREAM_CHILD_EVIDENCE_WAIT",
  });

  const REQUIRED_RELEASE = Object.freeze({
    canvasReleaseAuthorized: true,
    canvasReleasePacketReady: true,
    westCanvasReleaseApproved: true,
    westHardBlock: false,
    carrierHostAdmissibilityReady: true,
    indexPairReady: true,
    handoffTo: "CANVAS",
    destinationFile: TARGET_FILE,
    cycleNumber: 2,
    cycleRoute: "NORTH_EAST_SOUTH_WEST_CANVAS",
  });

  const state = {
    timestamp: "",
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    file: FILE,
    route: ROUTE,
    role: "canvas-parent-release-acceptance-east-dispatch-switchboard",

    hearthCanvasLoaded: true,
    hearthCanvasContract: CONTRACT,
    hearthCanvasReceipt: RECEIPT,
    hearthCanvasParentV10_3Active: true,
    hearthCanvasParentV10_2Superseded: true,
    hearthCanvasParentV10_1Superseded: true,
    hearthCanvasParentV9Superseded: true,
    hearthCanvasParentV2Observed: false,
    hearthCanvasStaleParentV2FalsePositiveBlocked: true,

    releasePacketObserved: false,
    releasePacketValid: false,
    releasePacketAccepted: false,
    acceptedReleaseSource: RELEASE_SOURCE.NONE,
    releasePacketIntakeMethod: "NONE",

    routeConductorReleasePacket: null,
    normalizedReleasePacket: null,
    releaseValidationFailures: [],
    firstReleaseValidationFailure: "",

    canvasParentReleaseObserved: false,
    canvasParentReleaseAccepted: false,
    canvasParentReleaseLawful: false,
    parentReleaseLawful: false,
    canvasReleaseAuthorized: false,
    canvasReleaseHeldReason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    canvasParentReleaseGateReady: false,
    parentAcceptedRouteConductorRelease: false,

    parentReleasePacketComposed: false,
    parentReleasePacketPublishedForEast: false,
    parentReleasePacketSentToEast: false,
    parentReleasePacketLawful: false,
    eastDispatchAuthorized: false,
    eastDispatchPacketPublished: false,
    handoffTo: "NONE",

    eastObserved: false,
    eastApiReady: false,
    eastDispatchAttempted: false,
    eastDispatchMethod: "NONE",
    eastResponseClass: EAST_RESULT_CLASS.NOT_DISPATCHED,
    eastResponseObserved: false,
    eastResponseReceived: false,
    eastResponse: null,

    canvasEastHeldPacketRecognized: false,
    canvasEastEvidenceReady: false,
    canvasEastF13AtlasPacketReady: false,
    canvasEastFalsePromotionBlocked: false,
    canvasEastFalsePromotionReasons: [],

    westEvidenceReady: false,
    southEvidenceReady: false,

    f13CanvasEvidenceComplete: false,
    f13EvidenceComplete: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    visualPassClaimed: false,

    structuralCarrierReady: true,
    structuralCarrierSafe: true,
    canvasParentCarrierSafe: true,

    currentCanvasParentObserved: true,
    currentCanvasParentContractObserved: true,
    currentCanvasParentContract: CONTRACT,
    canvasParentBootMethodAvailable: true,

    firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    recommendedNextFile: ROUTE_CONDUCTOR_FILE,
    recommendedNextRenewalTarget: ROUTE_CONDUCTOR_FILE,
    postgameStatus: "CANVAS_PARENT_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",

    lastEastDispatchPacket: null,
    lastChildPacket: null,
    childPackets: [],

    bootAuditComplete: false,
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

  function toNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function sameText(a, b) {
    return String(a || "").trim() === String(b || "").trim();
  }

  function upperText(value) {
    return String(value || "").trim().toUpperCase();
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

  function readPath(source, path) {
    if (!source || !path) return undefined;

    const parts = String(path).split(".");
    let cursor = source;

    for (let i = 0; i < parts.length; i += 1) {
      if (!cursor || typeof cursor !== "object") return undefined;
      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function hasExplicitReleaseShape(value) {
    if (!isObject(value)) return false;

    return (
      own(value, "canvasReleaseAuthorized") ||
      own(value, "canvasReleasePacketReady") ||
      own(value, "westCanvasReleaseApproved") ||
      own(value, "westHardBlock") ||
      own(value, "carrierHostAdmissibilityReady") ||
      own(value, "indexPairReady") ||
      own(value, "handoffTo") ||
      own(value, "destinationFile") ||
      own(value, "targetFile") ||
      own(value, "cycleNumber") ||
      own(value, "cycleRoute")
    );
  }

  function hasUsefulReleaseReceiptShape(value) {
    if (!isObject(value)) return false;

    return (
      hasExplicitReleaseShape(value) ||
      own(value, "firstFailedCoordinate") ||
      own(value, "recommendedNextFile") ||
      own(value, "recommendedNextRenewalTarget") ||
      own(value, "postgameStatus")
    );
  }

  function candidateFromApi(source, methodName) {
    if (!source || !isFunction(source[methodName])) return null;
    return safeCall(() => source[methodName](), null);
  }

  function extractNestedReleasePacket(value) {
    if (!isObject(value)) return null;

    const directKeys = [
      "canvasReleasePacket",
      "releasePacket",
      "routeConductorReleasePacket",
      "southRouteConductorReleasePacket",
      "canvasParentReleasePacket",
      "canvasHandoffPacket",
      "handoffPacket",
      "releaseToCanvasPacket",
      "canvasRelease",
      "packet",
    ];

    for (let i = 0; i < directKeys.length; i += 1) {
      const nested = value[directKeys[i]];
      if (isObject(nested) && hasUsefulReleaseReceiptShape(nested)) return nested;
    }

    if (isObject(value.options)) {
      const nestedFromOptions = extractNestedReleasePacket(value.options);
      if (nestedFromOptions) return nestedFromOptions;
    }

    if (isObject(value.receipt)) {
      const nestedFromReceipt = extractNestedReleasePacket(value.receipt);
      if (nestedFromReceipt) return nestedFromReceipt;
      if (hasUsefulReleaseReceiptShape(value.receipt)) return value.receipt;
    }

    if (isObject(value.dataset)) {
      const nestedFromDataset = extractNestedReleasePacket(value.dataset);
      if (nestedFromDataset) return nestedFromDataset;
      if (hasUsefulReleaseReceiptShape(value.dataset)) return value.dataset;
    }

    if (hasUsefulReleaseReceiptShape(value)) return value;

    return null;
  }

  function readFirstField(source, candidates) {
    if (!isObject(source)) return undefined;

    for (let i = 0; i < candidates.length; i += 1) {
      const key = candidates[i];
      if (own(source, key)) return source[key];
    }

    return undefined;
  }

  function markReleasePacket(packet, intakeMethod) {
    state.releasePacketObserved = Boolean(packet);
    state.releasePacketIntakeMethod = packet ? intakeMethod : "NONE";
    state.routeConductorReleasePacket = packet ? clonePlain(packet) : null;
    return packet || null;
  }

  function readOptionsPacket(options) {
    if (!isObject(options)) return null;

    const extracted = extractNestedReleasePacket(options);
    if (!extracted) return null;

    return markReleasePacket(extracted, "OPTIONS_PACKET");
  }

  function readDatasetPacket() {
    const doc = getDocument();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return null;

    const ds = doc.documentElement.dataset;

    const fieldMap = {
      canvasReleaseAuthorized: [
        "canvasReleaseAuthorized",
        "hearthCanvasReleaseAuthorized",
        "hearthSouthCanvasReleaseAuthorized",
        "hearthRouteConductorCanvasReleaseAuthorized",
      ],
      canvasReleasePacketReady: [
        "canvasReleasePacketReady",
        "hearthCanvasReleasePacketReady",
        "hearthSouthCanvasReleasePacketReady",
        "hearthRouteConductorCanvasReleasePacketReady",
      ],
      westCanvasReleaseApproved: [
        "westCanvasReleaseApproved",
        "hearthWestCanvasReleaseApproved",
        "hearthSouthWestCanvasReleaseApproved",
        "hearthRouteConductorWestCanvasReleaseApproved",
      ],
      westHardBlock: [
        "westHardBlock",
        "hearthWestHardBlock",
        "hearthSouthWestHardBlock",
        "hearthRouteConductorWestHardBlock",
      ],
      carrierHostAdmissibilityReady: [
        "carrierHostAdmissibilityReady",
        "hearthCarrierHostAdmissibilityReady",
        "hearthSouthCarrierHostAdmissibilityReady",
        "hearthRouteConductorCarrierHostAdmissibilityReady",
      ],
      indexPairReady: [
        "indexPairReady",
        "hearthIndexPairReady",
        "hearthSouthIndexPairReady",
        "hearthRouteConductorIndexPairReady",
      ],
      handoffTo: [
        "handoffTo",
        "hearthHandoffTo",
        "hearthSouthHandoffTo",
        "hearthRouteConductorHandoffTo",
      ],
      destinationFile: [
        "destinationFile",
        "targetFile",
        "hearthDestinationFile",
        "hearthTargetFile",
        "hearthSouthDestinationFile",
        "hearthSouthTargetFile",
        "hearthRouteConductorDestinationFile",
        "hearthRouteConductorTargetFile",
      ],
      cycleNumber: [
        "cycleNumber",
        "hearthCycleNumber",
        "hearthSouthCycleNumber",
        "hearthRouteConductorCycleNumber",
      ],
      cycleRoute: [
        "cycleRoute",
        "hearthCycleRoute",
        "hearthSouthCycleRoute",
        "hearthRouteConductorCycleRoute",
      ],
      firstFailedCoordinate: [
        "firstFailedCoordinate",
        "hearthFirstFailedCoordinate",
        "hearthSouthFirstFailedCoordinate",
        "hearthRouteConductorFirstFailedCoordinate",
      ],
      recommendedNextFile: [
        "recommendedNextFile",
        "hearthRecommendedNextFile",
        "hearthSouthRecommendedNextFile",
        "hearthRouteConductorRecommendedNextFile",
      ],
      recommendedNextRenewalTarget: [
        "recommendedNextRenewalTarget",
        "hearthRecommendedNextRenewalTarget",
        "hearthSouthRecommendedNextRenewalTarget",
        "hearthRouteConductorRecommendedNextRenewalTarget",
      ],
      postgameStatus: [
        "postgameStatus",
        "hearthPostgameStatus",
        "hearthSouthPostgameStatus",
        "hearthRouteConductorPostgameStatus",
      ],
    };

    const packet = {
      source: "DOCUMENT_DATASET_ROUTE_CONDUCTOR_RELEASE",
    };

    Object.keys(fieldMap).forEach((normalizedKey) => {
      const value = readFirstField(ds, fieldMap[normalizedKey]);
      if (value !== undefined) packet[normalizedKey] = value;
    });

    if (!hasUsefulReleaseReceiptShape(packet)) return null;

    return packet;
  }

  function readRouteConductorReleasePacket(options) {
    const optionPacket = readOptionsPacket(options);
    if (optionPacket) return optionPacket;

    const w = getWindow();
    const h = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    const routeConductorSources = [
      h.routeConductor,
      h.southRouteConductor,
      h.routeConductorCentralStationSwitchboard,
      h.hearthRouteConductor,
      w.HEARTH_ROUTE_CONDUCTOR,
      w.HEARTH_SOUTH_ROUTE_CONDUCTOR,
      w.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD,
      lab.hearthRouteConductor,
      lab.hearthSouthRouteConductor,
    ];

    const methodCandidates = [
      "getCanvasReleasePacket",
      "getReleasePacket",
      "getCanvasHandoffPacket",
      "getHandoffPacket",
      "getReceipt",
      "getReceiptLight",
      "readReceipt",
    ];

    for (let i = 0; i < routeConductorSources.length; i += 1) {
      const source = routeConductorSources[i];
      if (!source) continue;

      for (let j = 0; j < methodCandidates.length; j += 1) {
        const result = candidateFromApi(source, methodCandidates[j]);
        const extracted = extractNestedReleasePacket(result);

        if (extracted) {
          return markReleasePacket(extracted, `ROUTE_CONDUCTOR_API:${methodCandidates[j]}`);
        }
      }

      const extractedFromObject = extractNestedReleasePacket(source);

      if (extractedFromObject) {
        return markReleasePacket(extractedFromObject, "ROUTE_CONDUCTOR_OBJECT");
      }
    }

    const directSources = [
      h.canvasReleasePacket,
      h.routeConductorReleasePacket,
      h.southRouteConductorReleasePacket,
      h.canvasParentReleasePacket,
      w.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT,
      w.HEARTH_ROUTE_CONDUCTOR_RECEIPT,
      w.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT,
      w.HEARTH_CANVAS_RELEASE_PACKET,
      w.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET,
      w.HEARTH_SOUTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET,
      readPath(w, "DEXTER_LAB.hearthRouteConductorReceipt"),
      readPath(w, "DEXTER_LAB.hearthSouthRouteConductorReceipt"),
    ];

    for (let k = 0; k < directSources.length; k += 1) {
      const extracted = extractNestedReleasePacket(directSources[k]);

      if (extracted) {
        return markReleasePacket(extracted, "GLOBAL_RECEIPT");
      }
    }

    const datasetPacket = readDatasetPacket();
    if (datasetPacket) {
      return markReleasePacket(datasetPacket, "DATASET_FALLBACK");
    }

    return markReleasePacket(null, "NONE");
  }

  function normalizeReleasePacket(packet) {
    if (!isObject(packet)) {
      state.normalizedReleasePacket = null;
      return null;
    }

    const normalized = {
      canvasReleaseAuthorized: toBool(packet.canvasReleaseAuthorized),
      canvasReleasePacketReady: toBool(packet.canvasReleasePacketReady),
      westCanvasReleaseApproved: toBool(packet.westCanvasReleaseApproved),
      westHardBlock: toBool(packet.westHardBlock),
      carrierHostAdmissibilityReady: toBool(packet.carrierHostAdmissibilityReady),
      indexPairReady: toBool(packet.indexPairReady),
      handoffTo: packet.handoffTo || packet.handoff || "",
      destinationFile: packet.destinationFile || packet.targetFile || packet.recommendedNextFile || packet.recommendedNextRenewalTarget || "",
      cycleNumber: toNumber(packet.cycleNumber),
      cycleRoute: packet.cycleRoute || packet.routeCycle || "",
      source: packet.source || packet.releaseSource || "ROUTE_CONDUCTOR_RELEASE_PACKET",
      firstFailedCoordinate: packet.firstFailedCoordinate || "",
      recommendedNextFile: packet.recommendedNextFile || "",
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget || "",
      postgameStatus: packet.postgameStatus || "",
      sourceContract: packet.contract || packet.sourceContract || packet.routeConductorContract || "",
      sourceReceipt: packet.receipt || packet.sourceReceipt || packet.routeConductorReceipt || "",
      original: clonePlain(packet),
    };

    state.normalizedReleasePacket = clonePlain(normalized);
    return normalized;
  }

  function validationFailureToCoordinate(failure) {
    const map = {
      RELEASE_PACKET_MISSING: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
      releaseSource: "WAITING_ROUTE_CONDUCTOR_RELEASE_SOURCE",
      canvasReleaseAuthorized: "WAITING_CANVAS_RELEASE_AUTHORIZATION",
      canvasReleasePacketReady: "WAITING_CANVAS_RELEASE_PACKET_READY",
      westCanvasReleaseApproved: "WAITING_WEST_CANVAS_RELEASE_APPROVAL",
      westHardBlock: "UPSTREAM_WEST_HARD_BLOCK",
      carrierHostAdmissibilityReady: "WAITING_CARRIER_HOST_ADMISSIBILITY",
      indexPairReady: "WAITING_INDEX_PAIR_READY",
      handoffTo: "WAITING_HANDOFF_TO_CANVAS",
      destinationFile: "WAITING_CANVAS_RELEASE_DESTINATION",
      cycleNumber: "WAITING_CYCLE_TWO_CANVAS_ROUTE",
      cycleRoute: "WAITING_CYCLE_TWO_CANVAS_ROUTE",
    };

    return map[failure] || "WAITING_VALID_ROUTE_CONDUCTOR_RELEASE_PACKET";
  }

  function intakeIsExplicitRouteConductor() {
    return [
      "OPTIONS_PACKET",
      "DIRECT_ROUTE_CONDUCTOR",
      "GLOBAL_RECEIPT",
      "DATASET_FALLBACK",
      "ROUTE_CONDUCTOR_OBJECT",
    ].includes(state.releasePacketIntakeMethod) || state.releasePacketIntakeMethod.indexOf("ROUTE_CONDUCTOR_API:") === 0;
  }

  function validateReleasePacket(packet) {
    const failures = [];

    if (!isObject(packet)) {
      failures.push("RELEASE_PACKET_MISSING");
    } else {
      if (packet.source === "LOCAL_WEST_FALLBACK") failures.push("releaseSource");
      if (packet.canvasReleaseAuthorized !== true) failures.push("canvasReleaseAuthorized");
      if (packet.canvasReleasePacketReady !== true) failures.push("canvasReleasePacketReady");
      if (packet.westCanvasReleaseApproved !== true) failures.push("westCanvasReleaseApproved");
      if (packet.westHardBlock !== false) failures.push("westHardBlock");
      if (packet.carrierHostAdmissibilityReady !== true) failures.push("carrierHostAdmissibilityReady");
      if (packet.indexPairReady !== true) failures.push("indexPairReady");
      if (!sameText(packet.handoffTo, REQUIRED_RELEASE.handoffTo)) failures.push("handoffTo");
      if (toNumber(packet.cycleNumber) !== REQUIRED_RELEASE.cycleNumber) failures.push("cycleNumber");
      if (!sameText(packet.cycleRoute, REQUIRED_RELEASE.cycleRoute)) failures.push("cycleRoute");

      const destinationProvided = String(packet.destinationFile || "").trim().length > 0;
      const destinationMatches = sameText(packet.destinationFile, REQUIRED_RELEASE.destinationFile);

      if (destinationProvided && !destinationMatches) {
        failures.push("destinationFile");
      }

      if (!destinationProvided && !intakeIsExplicitRouteConductor()) {
        failures.push("destinationFile");
      }
    }

    state.releaseValidationFailures = failures.slice();
    state.firstReleaseValidationFailure = failures[0] || "";
    state.releasePacketValid = failures.length === 0;

    return state.releasePacketValid;
  }

  function refreshParentReleaseGateMarkers() {
    const ready =
      state.releasePacketObserved === true &&
      state.releasePacketValid === true &&
      state.releasePacketAccepted === true &&
      state.canvasParentReleaseObserved === true &&
      state.canvasParentReleaseAccepted === true &&
      state.parentReleaseLawful === true &&
      state.canvasReleaseAuthorized === true;

    state.canvasParentReleaseGateReady = ready;
    state.parentAcceptedRouteConductorRelease = ready && state.acceptedReleaseSource === RELEASE_SOURCE.ROUTE_CONDUCTOR;

    return ready;
  }

  function acceptRelease(packet) {
    if (!state.releasePacketObserved) {
      state.releasePacketAccepted = false;
      state.acceptedReleaseSource = RELEASE_SOURCE.NONE;
      state.canvasParentReleaseObserved = false;
      state.canvasParentReleaseAccepted = false;
      state.canvasParentReleaseLawful = false;
      state.parentReleaseLawful = false;
      state.canvasReleaseAuthorized = false;
      state.canvasReleaseHeldReason = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      state.firstFailedCoordinate = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "CANVAS_PARENT_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      refreshParentReleaseGateMarkers();
      return false;
    }

    if (!state.releasePacketValid || !isObject(packet)) {
      state.releasePacketAccepted = false;
      state.acceptedReleaseSource = RELEASE_SOURCE.NONE;
      state.canvasParentReleaseObserved = false;
      state.canvasParentReleaseAccepted = false;
      state.canvasParentReleaseLawful = false;
      state.parentReleaseLawful = false;
      state.canvasReleaseAuthorized = false;
      state.canvasReleaseHeldReason = "ROUTE_CONDUCTOR_RELEASE_PACKET_INVALID";
      state.firstFailedCoordinate = validationFailureToCoordinate(state.firstReleaseValidationFailure);
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "CANVAS_PARENT_WAITING_VALID_ROUTE_CONDUCTOR_RELEASE_PACKET";
      refreshParentReleaseGateMarkers();
      return false;
    }

    state.releasePacketAccepted = true;
    state.acceptedReleaseSource = RELEASE_SOURCE.ROUTE_CONDUCTOR;

    state.canvasParentReleaseObserved = true;
    state.canvasParentReleaseAccepted = true;
    state.canvasParentReleaseLawful = true;
    state.parentReleaseLawful = true;
    state.canvasReleaseAuthorized = true;
    state.canvasReleaseHeldReason = "NONE_CANVAS_PARENT_RELEASE_ACCEPTED";

    state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
    state.recommendedNextFile = EAST_FILE;
    state.recommendedNextRenewalTarget = EAST_FILE;
    state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_WAITING_EAST_API";

    refreshParentReleaseGateMarkers();

    return true;
  }

  function publishEastDispatchPacket(packet) {
    if (!isObject(packet)) {
      state.eastDispatchPacketPublished = false;
      return false;
    }

    const w = getWindow();
    const h = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    h.canvasParentEastDispatchPacket = clonePlain(packet);
    h.canvasEastDispatchPacket = clonePlain(packet);
    lab.hearthCanvasParentEastDispatchPacket = clonePlain(packet);

    w.HEARTH_CANVAS_PARENT_EAST_DISPATCH_PACKET = clonePlain(packet);
    w.HEARTH_CANVAS_EAST_DISPATCH_PACKET = clonePlain(packet);

    state.parentReleasePacketPublishedForEast = true;
    state.eastDispatchPacketPublished = true;

    return true;
  }

  function composeEastDispatchPacket() {
    if (!state.canvasParentReleaseAccepted || !state.parentReleaseLawful || !state.canvasReleaseAuthorized) {
      state.parentReleasePacketComposed = false;
      state.parentReleasePacketPublishedForEast = false;
      state.parentReleasePacketLawful = false;
      state.eastDispatchPacketPublished = false;
      state.lastEastDispatchPacket = null;
      return null;
    }

    const packet = {
      timestamp: nowIso(),

      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      sourceFile: FILE,
      targetFile: EAST_FILE,
      handoffTo: "EAST",
      receivedFrom: "CANVAS_PARENT",

      cycleNumber: 2,
      cycleRoute: "NORTH_EAST_SOUTH_WEST_CANVAS",
      activeFibonacci: "F13P",
      eastActiveFibonacci: "F13E",

      canvasParentReleaseObserved: true,
      canvasParentReleaseAccepted: true,
      canvasParentReleaseLawful: true,
      canvasParentReleaseGateReady: true,
      parentAcceptedRouteConductorRelease: true,

      parentReleaseLawful: true,
      canvasReleaseAuthorized: true,
      eastDispatchAuthorized: true,

      westCanvasReleaseApproved: true,
      westHardBlock: false,

      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,

      atlasBuildRequested: true,
      f13AtlasBuildRequested: true,
      buildAtlasRequested: true,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
    };

    state.parentReleasePacketComposed = true;
    state.parentReleasePacketLawful = true;
    state.lastEastDispatchPacket = clonePlain(packet);

    publishEastDispatchPacket(packet);

    return packet;
  }

  function findEastAuthority() {
    const w = getWindow();
    const h = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    const candidates = [
      h.canvasEast,
      h.canvasEastAuthority,
      h.canvasEastSource,
      h.canvasEastEvidence,
      h.canvasEastEngine,

      h.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource,
      h.canvasEastParentFirstApiRecognitionBootstrap,
      h.canvasEastCurrentParentRecognizedF13AtlasSource,
      h.canvasEastGovernedF13AtlasSource,
      h.canvasEastF13AtlasSourceChild,
      h.canvasEastMaterialAtlasSourceMachine,

      w.HEARTH_CANVAS_EAST,
      w.HEARTH_CANVAS_EAST_AUTHORITY,
      w.HEARTH_CANVAS_EAST_SOURCE,
      w.HEARTH_CANVAS_EAST_EVIDENCE,
      w.HEARTH_CANVAS_EAST_ENGINE,

      w.HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE,
      w.HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP,
      w.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE,
      w.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE,
      w.HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD,
      w.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE,

      lab.hearthCanvasEast,
      lab.hearthCanvasEastAuthority,
      lab.hearthCanvasEastEvidence,

      lab.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource,
      lab.hearthCanvasEastParentFirstApiRecognitionBootstrap,
      lab.hearthCanvasEastCurrentParentRecognizedF13AtlasSource,
      lab.hearthCanvasEastGovernedF13AtlasSource,
      lab.hearthCanvasEastF13AtlasSourceChild,
      lab.hearthCanvasEastMaterialAtlasSourceMachine,
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      if (isObject(candidates[i]) || isFunction(candidates[i])) return candidates[i];
    }

    return null;
  }

  function dispatchEast(packet) {
    if (!isObject(packet) || !state.parentReleasePacketLawful) {
      state.eastDispatchAuthorized = false;
      state.parentReleasePacketSentToEast = false;
      state.eastDispatchMethod = "NONE";
      return null;
    }

    publishEastDispatchPacket(packet);

    state.eastDispatchAuthorized = true;
    state.handoffTo = "EAST";
    state.eastDispatchAttempted = true;

    const east = findEastAuthority();
    let response = null;

    if (isObject(east)) {
      state.eastObserved = true;

      if (isFunction(east.receiveParentReleasePacket)) {
        response = safeCall(() => east.receiveParentReleasePacket(clonePlain(packet)), null);
        state.eastDispatchMethod = "receiveParentReleasePacket";
      } else if (isFunction(east.receiveParentDispatchPacket)) {
        response = safeCall(() => east.receiveParentDispatchPacket(clonePlain(packet)), null);
        state.eastDispatchMethod = "receiveParentDispatchPacket";
      } else if (isFunction(east.receiveEastDispatchPacket)) {
        response = safeCall(() => east.receiveEastDispatchPacket(clonePlain(packet)), null);
        state.eastDispatchMethod = "receiveEastDispatchPacket";
      } else if (isFunction(east.receiveReleasePacket)) {
        response = safeCall(() => east.receiveReleasePacket(clonePlain(packet)), null);
        state.eastDispatchMethod = "receiveReleasePacket";
      } else if (isFunction(east.receiveParentPacket)) {
        response = safeCall(() => east.receiveParentPacket(clonePlain(packet)), null);
        state.eastDispatchMethod = "receiveParentPacket";
      } else if (isFunction(east.receiveDispatchPacket)) {
        response = safeCall(() => east.receiveDispatchPacket(clonePlain(packet)), null);
        state.eastDispatchMethod = "receiveDispatchPacket";
      } else if (isFunction(east.buildAtlas)) {
        response = safeCall(() => east.buildAtlas(clonePlain(packet)), null);
        state.eastDispatchMethod = "buildAtlas";
      } else if (isFunction(east.read)) {
        response = safeCall(() => east.read(clonePlain(packet)), null);
        state.eastDispatchMethod = "read";
      } else if (isFunction(east.getReceipt)) {
        response = safeCall(() => east.getReceipt(), null);
        state.eastDispatchMethod = "getReceipt";
      } else if (isFunction(east.getReceiptLight)) {
        response = safeCall(() => east.getReceiptLight(), null);
        state.eastDispatchMethod = "getReceiptLight";
      } else {
        state.eastDispatchMethod = "EAST_OBJECT_NO_ACCEPTOR";
      }

      state.eastApiReady = [
        "receiveParentReleasePacket",
        "receiveParentDispatchPacket",
        "receiveEastDispatchPacket",
        "receiveReleasePacket",
        "receiveParentPacket",
        "receiveDispatchPacket",
        "buildAtlas",
        "read",
        "getReceipt",
        "getReceiptLight",
      ].includes(state.eastDispatchMethod);
    } else if (isFunction(east)) {
      state.eastObserved = true;
      response = safeCall(() => east(clonePlain(packet)), null);
      state.eastApiReady = true;
      state.eastDispatchMethod = "function";
    } else {
      state.eastObserved = false;
      state.eastApiReady = false;
      state.eastDispatchMethod = "MISSING_EAST_AUTHORITY";
    }

    state.parentReleasePacketSentToEast = true;
    state.parentReleasePacketLawful = true;

    return response;
  }

  function packetHasFinalClaimContext(packet) {
    if (!isObject(packet)) return false;

    return (
      packet.finalPageProof === true ||
      packet.finalRouteProof === true ||
      packet.finalVisualPass === true ||
      packet.visualPassClaimed === true ||
      packet.readyTextAllowed === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21SubmittedToNorth === true ||
      packet.completionLatched === true ||
      packet.finalCompletionLatched === true ||
      packet.degradedCompletionLatched === true ||
      upperText(packet.proofScope).indexOf("FINAL") !== -1 ||
      upperText(packet.scope).indexOf("FINAL") !== -1 ||
      upperText(packet.claimScope).indexOf("FINAL") !== -1
    );
  }

  function hasAtlasEvidence(packet) {
    if (!isObject(packet)) return false;

    return (
      packet.f13AtlasPacketReady === true ||
      packet.atlasBuildComplete === true ||
      packet.atlasCanvasPresent === true ||
      packet.atlasReady === true ||
      packet.canvasEastEvidenceReady === true ||
      packet.canvasEastF13AtlasPacketReady === true
    );
  }

  function falsePromotionReasons(packet) {
    if (!isObject(packet)) return [];

    const reasons = [];

    if (packet.visualPassClaimed === true) reasons.push("visualPassClaimed");
    if (packet.readyTextAllowed === true) reasons.push("readyTextAllowed");
    if (packet.f21EligibleForNorth === true) reasons.push("f21EligibleForNorth");
    if (packet.f21SubmittedToNorth === true) reasons.push("f21SubmittedToNorth");
    if (packet.completionLatched === true) reasons.push("completionLatched");
    if (packet.finalCompletionLatched === true) reasons.push("finalCompletionLatched");
    if (packet.degradedCompletionLatched === true) reasons.push("degradedCompletionLatched");

    const finalContext = packetHasFinalClaimContext(packet);

    if (packet.canvasReady === true && finalContext && !hasAtlasEvidence(packet)) {
      reasons.push("canvasReady_FINAL_PAGE_PROOF_BLOCKED");
    }

    if (packet.visibleProof === true && finalContext) {
      reasons.push("visibleProof_FINAL_ROUTE_PROOF_BLOCKED");
    }

    return reasons;
  }

  function isHeldEastPacket(packet) {
    if (!isObject(packet)) return false;

    const coordinate = String(packet.firstFailedCoordinate || "");

    return (
      packet.heldAtlasPacketReturned === true ||
      packet.synchronousHeldPacketActive === true ||
      packet.heldPacketWasSynchronous === true ||
      coordinate.indexOf("WAITING") !== -1 ||
      Boolean(packet.f13BuildBlockedReason)
    );
  }

  function classifyEastResponse(response) {
    state.eastResponseObserved = response !== null && response !== undefined;
    state.eastResponseReceived = isObject(response);
    state.eastResponse = isObject(response) ? clonePlain(response) : response;

    if (!state.eastObserved || !state.eastApiReady) {
      state.eastResponseClass = EAST_RESULT_CLASS.MISSING_API;
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_WAITING_EAST_API";
      return state.eastResponseClass;
    }

    if (!isObject(response)) {
      state.eastResponseClass = EAST_RESULT_CLASS.WAITING_RESPONSE;
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_RESPONSE";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_WAITING_EAST_RESPONSE";
      return state.eastResponseClass;
    }

    const promotion = falsePromotionReasons(response);

    if (promotion.length) {
      state.canvasEastFalsePromotionBlocked = true;
      state.canvasEastFalsePromotionReasons = promotion.slice();
      state.eastResponseClass = EAST_RESULT_CLASS.FALSE_PROMOTION_BLOCKED;
      state.firstFailedCoordinate = "EAST_FALSE_PROMOTION_BLOCKED";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_EAST_FALSE_PROMOTION_BLOCKED";
      return state.eastResponseClass;
    }

    if (hasAtlasEvidence(response)) {
      state.canvasEastEvidenceReady = true;
      state.canvasEastF13AtlasPacketReady = true;
      state.eastResponseClass = EAST_RESULT_CLASS.ATLAS_EVIDENCE;
      state.firstFailedCoordinate = "WAITING_DOWNSTREAM_CANVAS_CHILD_EVIDENCE";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_EAST_ATLAS_EVIDENCE_READY_WAITING_DOWNSTREAM_CHILD_EVIDENCE";
      return state.eastResponseClass;
    }

    if (isHeldEastPacket(response)) {
      state.canvasEastHeldPacketRecognized = true;
      state.eastResponseClass = EAST_RESULT_CLASS.HELD_PACKET;
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ENGINE_EVIDENCE";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_EAST_HELD_WAITING_ENGINE_EVIDENCE";
      return state.eastResponseClass;
    }

    state.eastResponseClass = EAST_RESULT_CLASS.WAITING_RESPONSE;
    state.firstFailedCoordinate = "WAITING_CANVAS_EAST_RESPONSE";
    state.recommendedNextFile = EAST_FILE;
    state.recommendedNextRenewalTarget = EAST_FILE;
    state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_WAITING_EAST_RESPONSE";

    return state.eastResponseClass;
  }

  function runCanonicalParentSequence(packet, intakeMethod) {
    state.timestamp = nowIso();

    if (isObject(packet)) {
      state.releasePacketObserved = true;
      state.releasePacketIntakeMethod = intakeMethod || state.releasePacketIntakeMethod || "DIRECT_ROUTE_CONDUCTOR";
      state.routeConductorReleasePacket = clonePlain(packet);
    }

    const normalized = normalizeReleasePacket(packet);
    const valid = validateReleasePacket(normalized);

    if (valid) {
      acceptRelease(normalized);
      const eastDispatchPacket = composeEastDispatchPacket();
      const eastResponse = dispatchEast(eastDispatchPacket);
      classifyEastResponse(eastResponse);
    } else {
      acceptRelease(normalized);
    }

    recomputeParentState();
    updateDataset();
    publishGlobals();

    return getReceipt();
  }

  function consumeRouteConductorReleasePacket(packet) {
    return runCanonicalParentSequence(packet, "DIRECT_ROUTE_CONDUCTOR");
  }

  function consumeReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveCanvasReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveEastPacket(packet) {
    const result = classifyEastResponse(packet);
    recomputeParentState();
    updateDataset();
    publishGlobals();
    return result;
  }

  function receiveChildPacket(packet) {
    if (!isObject(packet)) return false;

    state.lastChildPacket = clonePlain(packet);
    state.childPackets.push(clonePlain(packet));

    const sourceFile = packet.sourceFile || packet.file || "";
    const childRole = upperText(packet.childRole || packet.sourceRole || packet.role || "");

    if (
      sourceFile === EAST_FILE ||
      childRole.indexOf("EAST") !== -1 ||
      packet.handoffFrom === "EAST" ||
      packet.receivedFrom === "EAST"
    ) {
      classifyEastResponse(packet);
    }

    if (
      sourceFile === WEST_FILE ||
      childRole.indexOf("WEST") !== -1 ||
      packet.canvasWestEvidenceReady === true
    ) {
      state.westEvidenceReady = true;
    }

    if (
      sourceFile === SOUTH_FILE ||
      childRole.indexOf("SOUTH") !== -1 ||
      packet.canvasSouthEvidenceReady === true
    ) {
      state.southEvidenceReady = true;
    }

    recomputeParentState();
    updateDataset();
    publishGlobals();

    return true;
  }

  function getStructuralCarrier() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      route: ROUTE,

      role: "canvas-parent-structural-carrier",
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,

      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,
      acceptedReleaseSource: state.acceptedReleaseSource,
      releasePacketIntakeMethod: state.releasePacketIntakeMethod,

      canvasParentReleaseObserved: state.canvasParentReleaseObserved,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      canvasParentReleaseLawful: state.canvasParentReleaseLawful,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,

      parentReleasePacketComposed: state.parentReleasePacketComposed,
      parentReleasePacketPublishedForEast: state.parentReleasePacketPublishedForEast,
      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      handoffTo: state.handoffTo,

      eastObserved: state.eastObserved,
      eastApiReady: state.eastApiReady,
      eastDispatchAttempted: state.eastDispatchAttempted,
      eastResponseObserved: state.eastResponseObserved,
      eastResponseClass: state.eastResponseClass,

      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastF13AtlasPacketReady: state.canvasEastF13AtlasPacketReady,
      canvasEastFalsePromotionBlocked: state.canvasEastFalsePromotionBlocked,

      f13CanvasEvidenceComplete: false,
      f13EvidenceComplete: false,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,
    };
  }

  function readStructuralCarrier() {
    return getStructuralCarrier();
  }

  function getCanvasCarrier() {
    return getStructuralCarrier();
  }

  function getCarrierReceipt() {
    return getStructuralCarrier();
  }

  function recomputeParentState() {
    state.timestamp = nowIso();

    if (!state.releasePacketObserved) {
      state.releasePacketValid = false;
      state.releasePacketAccepted = false;
      state.acceptedReleaseSource = RELEASE_SOURCE.NONE;
      state.canvasParentReleaseObserved = false;
      state.canvasParentReleaseAccepted = false;
      state.canvasParentReleaseLawful = false;
      state.parentReleaseLawful = false;
      state.canvasReleaseAuthorized = false;
      state.canvasReleaseHeldReason = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      state.firstFailedCoordinate = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "CANVAS_PARENT_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.releasePacketValid) {
      state.releasePacketAccepted = false;
      state.acceptedReleaseSource = RELEASE_SOURCE.NONE;
      state.canvasParentReleaseObserved = false;
      state.canvasParentReleaseAccepted = false;
      state.canvasParentReleaseLawful = false;
      state.parentReleaseLawful = false;
      state.canvasReleaseAuthorized = false;
      state.canvasReleaseHeldReason = "ROUTE_CONDUCTOR_RELEASE_PACKET_INVALID";
      state.firstFailedCoordinate = validationFailureToCoordinate(state.firstReleaseValidationFailure);
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "CANVAS_PARENT_WAITING_VALID_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (state.releasePacketAccepted) {
      state.acceptedReleaseSource = RELEASE_SOURCE.ROUTE_CONDUCTOR;
      state.canvasParentReleaseObserved = true;
      state.canvasParentReleaseAccepted = true;
      state.canvasParentReleaseLawful = true;
      state.parentReleaseLawful = true;
      state.canvasReleaseAuthorized = true;
      state.canvasReleaseHeldReason = "NONE_CANVAS_PARENT_RELEASE_ACCEPTED";
      refreshParentReleaseGateMarkers();

      if (!state.parentReleasePacketSentToEast || !state.parentReleasePacketLawful || !state.eastDispatchAuthorized) {
        state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
        state.recommendedNextFile = EAST_FILE;
        state.recommendedNextRenewalTarget = EAST_FILE;
        state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_WAITING_EAST_DISPATCH";
      } else if (!state.eastObserved || !state.eastApiReady) {
        state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
        state.recommendedNextFile = EAST_FILE;
        state.recommendedNextRenewalTarget = EAST_FILE;
        state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_WAITING_EAST_API";
      } else if (state.canvasEastFalsePromotionBlocked) {
        state.firstFailedCoordinate = "EAST_FALSE_PROMOTION_BLOCKED";
        state.recommendedNextFile = EAST_FILE;
        state.recommendedNextRenewalTarget = EAST_FILE;
        state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_EAST_FALSE_PROMOTION_BLOCKED";
      } else if (state.canvasEastHeldPacketRecognized) {
        state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ENGINE_EVIDENCE";
        state.recommendedNextFile = EAST_FILE;
        state.recommendedNextRenewalTarget = EAST_FILE;
        state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_EAST_HELD_WAITING_ENGINE_EVIDENCE";
      } else if (state.canvasEastEvidenceReady && !state.westEvidenceReady) {
        state.firstFailedCoordinate = "WAITING_DOWNSTREAM_CANVAS_CHILD_EVIDENCE";
        state.recommendedNextFile = EAST_FILE;
        state.recommendedNextRenewalTarget = EAST_FILE;
        state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_EAST_ATLAS_EVIDENCE_READY_WAITING_DOWNSTREAM_CHILD_EVIDENCE";
      } else if (state.canvasEastEvidenceReady && state.westEvidenceReady && !state.southEvidenceReady) {
        state.firstFailedCoordinate = "WAITING_DOWNSTREAM_CANVAS_CHILD_EVIDENCE";
        state.recommendedNextFile = SOUTH_FILE;
        state.recommendedNextRenewalTarget = SOUTH_FILE;
        state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_WAITING_SOUTH_CHILD_EVIDENCE";
      } else {
        state.firstFailedCoordinate = "WAITING_CANVAS_EAST_RESPONSE";
        state.recommendedNextFile = EAST_FILE;
        state.recommendedNextRenewalTarget = EAST_FILE;
        state.postgameStatus = "CANVAS_PARENT_RELEASE_ACCEPTED_WAITING_EAST_RESPONSE";
      }
    }

    refreshParentReleaseGateMarkers();

    state.f13CanvasEvidenceComplete = false;
    state.f13EvidenceComplete = false;
    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.completionLatched = false;
    state.finalCompletionLatched = false;
    state.degradedCompletionLatched = false;
    state.readyTextAllowed = false;
    state.visualPassClaimed = false;

    return clonePlain(state);
  }

  function updateDataset() {
    const doc = getDocument();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const ds = doc.documentElement.dataset;

    ds.hearthCanvasLoaded = "true";
    ds.hearthCanvasContract = CONTRACT;
    ds.hearthCanvasReceipt = RECEIPT;
    ds.hearthCanvasParentV10_3Active = "true";
    ds.hearthCanvasParentV10_2Superseded = "true";
    ds.hearthCanvasParentV10_1Superseded = "true";
    ds.hearthCanvasParentV9Superseded = "true";
    ds.hearthCanvasParentV2Observed = "false";
    ds.hearthCanvasStaleParentV2FalsePositiveBlocked = "true";

    ds.hearthCanvasReleasePacketObserved = String(Boolean(state.releasePacketObserved));
    ds.hearthCanvasReleasePacketValid = String(Boolean(state.releasePacketValid));
    ds.hearthCanvasReleasePacketAccepted = String(Boolean(state.releasePacketAccepted));
    ds.hearthCanvasAcceptedReleaseSource = state.acceptedReleaseSource;
    ds.hearthCanvasReleasePacketIntakeMethod = state.releasePacketIntakeMethod;

    ds.hearthCanvasParentReleaseObserved = String(Boolean(state.canvasParentReleaseObserved));
    ds.hearthCanvasParentReleaseAccepted = String(Boolean(state.canvasParentReleaseAccepted));
    ds.hearthCanvasParentReleaseLawful = String(Boolean(state.canvasParentReleaseLawful));
    ds.hearthCanvasParentReleaseGateReady = String(Boolean(state.canvasParentReleaseGateReady));
    ds.hearthCanvasParentAcceptedRouteConductorRelease = String(Boolean(state.parentAcceptedRouteConductorRelease));

    ds.hearthCanvasReleaseAuthorized = String(Boolean(state.canvasReleaseAuthorized));
    ds.hearthCanvasReleaseHeldReason = state.canvasReleaseHeldReason;

    ds.hearthCanvasParentReleasePacketComposed = String(Boolean(state.parentReleasePacketComposed));
    ds.hearthCanvasParentReleasePacketPublishedForEast = String(Boolean(state.parentReleasePacketPublishedForEast));
    ds.hearthCanvasParentReleasePacketSentToEast = String(Boolean(state.parentReleasePacketSentToEast));
    ds.hearthCanvasParentReleasePacketLawful = String(Boolean(state.parentReleasePacketLawful));

    ds.hearthCanvasEastDispatchAuthorized = String(Boolean(state.eastDispatchAuthorized));
    ds.hearthCanvasEastDispatchPacketPublished = String(Boolean(state.eastDispatchPacketPublished));
    ds.hearthCanvasEastObserved = String(Boolean(state.eastObserved));
    ds.hearthCanvasEastApiReady = String(Boolean(state.eastApiReady));
    ds.hearthCanvasEastDispatchAttempted = String(Boolean(state.eastDispatchAttempted));
    ds.hearthCanvasEastResponseObserved = String(Boolean(state.eastResponseObserved));
    ds.hearthCanvasEastResponseClass = state.eastResponseClass;
    ds.hearthCanvasEastHeldPacketRecognized = String(Boolean(state.canvasEastHeldPacketRecognized));
    ds.hearthCanvasEastEvidenceReady = String(Boolean(state.canvasEastEvidenceReady));
    ds.hearthCanvasEastF13AtlasPacketReady = String(Boolean(state.canvasEastF13AtlasPacketReady));
    ds.hearthCanvasEastFalsePromotionBlocked = String(Boolean(state.canvasEastFalsePromotionBlocked));

    ds.hearthCanvasF13EvidenceComplete = "false";
    ds.hearthCanvasF13CanvasEvidenceComplete = "false";
    ds.hearthCanvasF21EligibleForNorth = "false";
    ds.hearthCanvasF21SubmittedToNorth = "false";
    ds.hearthCanvasCompletionLatched = "false";
    ds.hearthCanvasReadyTextAllowed = "false";
    ds.visualPassClaimed = "false";

    ds.hearthCanvasFirstFailedCoordinate = state.firstFailedCoordinate;
    ds.hearthCanvasRecommendedNextFile = state.recommendedNextFile;
    ds.hearthCanvasRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    ds.hearthCanvasPostgameStatus = state.postgameStatus;

    return true;
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

      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,
      acceptedReleaseSource: state.acceptedReleaseSource,
      releasePacketIntakeMethod: state.releasePacketIntakeMethod,
      releaseValidationFailures: state.releaseValidationFailures.slice(),
      firstReleaseValidationFailure: state.firstReleaseValidationFailure,

      canvasParentReleaseObserved: state.canvasParentReleaseObserved,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      canvasParentReleaseLawful: state.canvasParentReleaseLawful,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,

      parentReleasePacketComposed: state.parentReleasePacketComposed,
      parentReleasePacketPublishedForEast: state.parentReleasePacketPublishedForEast,
      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      handoffTo: state.handoffTo,

      eastObserved: state.eastObserved,
      eastApiReady: state.eastApiReady,
      eastDispatchAttempted: state.eastDispatchAttempted,
      eastDispatchMethod: state.eastDispatchMethod,
      eastResponseClass: state.eastResponseClass,
      eastResponseObserved: state.eastResponseObserved,
      eastResponseReceived: state.eastResponseReceived,

      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastF13AtlasPacketReady: state.canvasEastF13AtlasPacketReady,
      canvasEastFalsePromotionBlocked: state.canvasEastFalsePromotionBlocked,

      f13CanvasEvidenceComplete: false,
      f13EvidenceComplete: false,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      completionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,

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
      file: FILE,
      route: ROUTE,
      role: state.role,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      canvasParentBootMethodAvailable: true,

      hearthCanvasLoaded: true,
      hearthCanvasContract: CONTRACT,
      hearthCanvasReceipt: RECEIPT,
      hearthCanvasParentV10_3Active: true,
      hearthCanvasParentV10_2Superseded: true,
      hearthCanvasParentV10_1Superseded: true,
      hearthCanvasParentV9Superseded: true,
      hearthCanvasParentV2Observed: false,
      hearthCanvasStaleParentV2FalsePositiveBlocked: true,

      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,
      acceptedReleaseSource: state.acceptedReleaseSource,
      releasePacketIntakeMethod: state.releasePacketIntakeMethod,
      releaseValidationFailures: state.releaseValidationFailures.slice(),
      firstReleaseValidationFailure: state.firstReleaseValidationFailure,

      routeConductorReleasePacket: clonePlain(state.routeConductorReleasePacket),
      normalizedReleasePacket: clonePlain(state.normalizedReleasePacket),

      canvasParentReleaseObserved: state.canvasParentReleaseObserved,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      canvasParentReleaseLawful: state.canvasParentReleaseLawful,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,

      parentReleasePacketComposed: state.parentReleasePacketComposed,
      parentReleasePacketPublishedForEast: state.parentReleasePacketPublishedForEast,
      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      handoffTo: state.handoffTo,

      eastObserved: state.eastObserved,
      eastApiReady: state.eastApiReady,
      eastDispatchAttempted: state.eastDispatchAttempted,
      eastDispatchMethod: state.eastDispatchMethod,
      eastResponseClass: state.eastResponseClass,
      eastResponseObserved: state.eastResponseObserved,
      eastResponseReceived: state.eastResponseReceived,

      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastF13AtlasPacketReady: state.canvasEastF13AtlasPacketReady,
      canvasEastFalsePromotionBlocked: state.canvasEastFalsePromotionBlocked,
      canvasEastFalsePromotionReasons: state.canvasEastFalsePromotionReasons.slice(),

      westEvidenceReady: state.westEvidenceReady,
      southEvidenceReady: state.southEvidenceReady,

      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,

      f13CanvasEvidenceComplete: false,
      f13EvidenceComplete: false,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      lastEastDispatchPacket: clonePlain(state.lastEastDispatchPacket),
      structuralCarrier: getStructuralCarrier(),
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT",
      "",
      `timestamp=${r.timestamp}`,
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      `hearthCanvasLoaded=${r.hearthCanvasLoaded}`,
      `hearthCanvasParentV10_3Active=${r.hearthCanvasParentV10_3Active}`,
      `hearthCanvasParentV10_2Superseded=${r.hearthCanvasParentV10_2Superseded}`,
      `hearthCanvasParentV10_1Superseded=${r.hearthCanvasParentV10_1Superseded}`,
      `hearthCanvasParentV9Superseded=${r.hearthCanvasParentV9Superseded}`,
      `hearthCanvasParentV2Observed=${r.hearthCanvasParentV2Observed}`,
      `hearthCanvasStaleParentV2FalsePositiveBlocked=${r.hearthCanvasStaleParentV2FalsePositiveBlocked}`,
      "",
      `releasePacketObserved=${r.releasePacketObserved}`,
      `releasePacketValid=${r.releasePacketValid}`,
      `releasePacketAccepted=${r.releasePacketAccepted}`,
      `acceptedReleaseSource=${r.acceptedReleaseSource}`,
      `releasePacketIntakeMethod=${r.releasePacketIntakeMethod}`,
      `firstReleaseValidationFailure=${r.firstReleaseValidationFailure || "none"}`,
      `releaseValidationFailures=${r.releaseValidationFailures.join(",") || "none"}`,
      "",
      `canvasParentReleaseObserved=${r.canvasParentReleaseObserved}`,
      `canvasParentReleaseAccepted=${r.canvasParentReleaseAccepted}`,
      `canvasParentReleaseLawful=${r.canvasParentReleaseLawful}`,
      `parentReleaseLawful=${r.parentReleaseLawful}`,
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      `canvasReleaseHeldReason=${r.canvasReleaseHeldReason}`,
      `canvasParentReleaseGateReady=${r.canvasParentReleaseGateReady}`,
      `parentAcceptedRouteConductorRelease=${r.parentAcceptedRouteConductorRelease}`,
      "",
      `parentReleasePacketComposed=${r.parentReleasePacketComposed}`,
      `parentReleasePacketPublishedForEast=${r.parentReleasePacketPublishedForEast}`,
      `parentReleasePacketSentToEast=${r.parentReleasePacketSentToEast}`,
      `parentReleasePacketLawful=${r.parentReleasePacketLawful}`,
      `eastDispatchAuthorized=${r.eastDispatchAuthorized}`,
      `eastDispatchPacketPublished=${r.eastDispatchPacketPublished}`,
      `handoffTo=${r.handoffTo}`,
      "",
      `eastObserved=${r.eastObserved}`,
      `eastApiReady=${r.eastApiReady}`,
      `eastDispatchAttempted=${r.eastDispatchAttempted}`,
      `eastDispatchMethod=${r.eastDispatchMethod}`,
      `eastResponseClass=${r.eastResponseClass}`,
      `eastResponseObserved=${r.eastResponseObserved}`,
      `eastResponseReceived=${r.eastResponseReceived}`,
      "",
      `canvasEastHeldPacketRecognized=${r.canvasEastHeldPacketRecognized}`,
      `canvasEastEvidenceReady=${r.canvasEastEvidenceReady}`,
      `canvasEastF13AtlasPacketReady=${r.canvasEastF13AtlasPacketReady}`,
      `canvasEastFalsePromotionBlocked=${r.canvasEastFalsePromotionBlocked}`,
      `canvasEastFalsePromotionReasons=${r.canvasEastFalsePromotionReasons.join(",") || "none"}`,
      "",
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13EvidenceComplete=${r.f13EvidenceComplete}`,
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `completionLatched=${r.completionLatched}`,
      `finalCompletionLatched=${r.finalCompletionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`,
    ].join("\n");
  }

  function publishGlobals() {
    const w = getWindow();
    const h = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    h.canvas = api;
    h.canvasParent = api;
    h.canvasNorth = api;
    h.canvasEvidence = api;
    h.canvasParentReleaseAcceptanceEastDispatchSwitchboard = api;

    w.HEARTH_CANVAS = api;
    w.HEARTH_CANVAS_PARENT = api;
    w.HEARTH_CANVAS_AUTHORITY = api;
    w.HEARTH_CANVAS_EVIDENCE = api;
    w.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard = api;

    w.HEARTH_CANVAS_RECEIPT = getReceiptLight();
    w.HEARTH_CANVAS_PARENT_RECEIPT = getReceiptLight();
    w.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT = getReceipt();
    w.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT_v10_3 = getReceipt();

    h.canvasStructuralCarrier = getStructuralCarrier();
    h.canvasCarrier = getStructuralCarrier();
    h.canvasParentCarrier = getStructuralCarrier();

    w.HEARTH_CANVAS_STRUCTURAL_CARRIER = getStructuralCarrier();
    w.HEARTH_CANVAS_CARRIER = getStructuralCarrier();
    w.HEARTH_CANVAS_PARENT_CARRIER = getStructuralCarrier();

    if (state.lastEastDispatchPacket) {
      publishEastDispatchPacket(state.lastEastDispatchPacket);
    }

    return api;
  }

  function updateDatasetAndReceipt() {
    updateDataset();
    publishGlobals();
    return getReceipt();
  }

  function bootAudit(options) {
    state.timestamp = nowIso();

    publishGlobals();

    const rawPacket = readRouteConductorReleasePacket(options || {});
    const receipt = runCanonicalParentSequence(rawPacket, rawPacket ? state.releasePacketIntakeMethod : "NONE");

    state.bootAuditComplete = true;

    updateDatasetAndReceipt();

    return receipt;
  }

  function boot(options) {
    return bootAudit(options || {});
  }

  function init(options) {
    return bootAudit(options || {});
  }

  function start(options) {
    return bootAudit(options || {});
  }

  function mount(options) {
    return bootAudit(options || {});
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    BASELINE_CONTRACT,
    FILE,
    TARGET_FILE,
    ROUTE_CONDUCTOR_FILE,
    EAST_FILE,
    WEST_FILE,
    SOUTH_FILE,
    ROUTE,

    REQUIRED_RELEASE,
    RELEASE_SOURCE,
    EAST_RESULT_CLASS,

    boot,
    init,
    start,
    mount,

    consumeRouteConductorReleasePacket,
    consumeReleasePacket,
    receiveReleasePacket,
    receiveCanvasReleasePacket,

    readRouteConductorReleasePacket,
    normalizeReleasePacket,
    validateReleasePacket,
    acceptRelease,
    composeEastDispatchPacket,
    dispatchEast,
    classifyEastResponse,
    receiveEastPacket,
    receiveChildPacket,
    recomputeParentState,

    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    publishGlobals,
    updateDataset,
    bootAudit,

    getState: () => clonePlain(state),
    getLastEastDispatchPacket: () => clonePlain(state.lastEastDispatchPacket),
  };

  bootAudit({});
})();
