// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1
// Full-file replacement.
// Canvas Parent / Canvas Local Station / Child Distribution Switchboard.
//
// Purpose:
// - Supersede deployment-unclean HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11.
// - Preserve accepted v11 local-station architecture.
// - Correct dataset fallback so blank dataset fields cannot manufacture a release packet.
// - Add getLastEastDispatchPacket() to the public API surface.
// - Receive and validate Route Conductor release packets.
// - Accept lawful parent release.
// - Publish lawful East dispatch.
// - Discover and coordinate Canvas East / Canvas West / Canvas South.
// - Aggregate Canvas-local F13 readiness.
// - Report one clean Canvas station summary upward to Route Conductor.
// - Distinguish East API readiness from East atlas evidence readiness.
// - Never claim F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1";
  const RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT_v11_1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT_v11";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT_v10_3";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";
  const ROUTE = "/showroom/globe/hearth/";

  const CYCLE_2_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";

  const RELEASE_SOURCE = Object.freeze({
    ROUTE_CONDUCTOR: "ROUTE_CONDUCTOR",
    OPTIONS: "OPTIONS",
    GLOBAL: "GLOBAL",
    DATASET: "DATASET",
    NONE: "NONE"
  });

  const CHILD_STATUS = Object.freeze({
    MISSING_API: "MISSING_API",
    API_READY_EVIDENCE_WAIT: "API_READY_EVIDENCE_WAIT",
    HELD_PACKET_API_READY: "HELD_PACKET_API_READY",
    EVIDENCE_READY: "EVIDENCE_READY",
    HARD_FAIL: "HARD_FAIL",
    FALSE_PROMOTION_BLOCKED: "FALSE_PROMOTION_BLOCKED"
  });

  const EAST_RESULT_CLASS = Object.freeze({
    NOT_DISPATCHED: "NOT_DISPATCHED",
    MISSING_API: "MISSING_API",
    WAITING_RESPONSE: "WAITING_RESPONSE",
    HELD_PACKET: "HELD_PACKET",
    ATLAS_EVIDENCE: "ATLAS_EVIDENCE",
    FALSE_PROMOTION_BLOCKED: "FALSE_PROMOTION_BLOCKED"
  });

  const CANVAS_CHILD_SEQUENCE = Object.freeze([
    "CANVAS_EAST_API",
    "CANVAS_EAST_ATLAS_EVIDENCE",
    "CANVAS_WEST_API",
    "CANVAS_WEST_INSPECTION_EVIDENCE",
    "CANVAS_SOUTH_API",
    "CANVAS_SOUTH_VISIBLE_PROOF"
  ]);

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
    cycleRoute: CYCLE_2_ROUTE
  });

  const EAST_REQUIRED_METHODS = Object.freeze([
    "buildAtlas",
    "sample",
    "read",
    "getReceipt"
  ]);

  const FINAL_FALSE = Object.freeze({
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21ClaimedByCanvasParent: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    timestamp: "",
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    route: ROUTE,
    role: "canvas-local-station-child-distribution-switchboard",

    canvasLocalStationActive: true,
    childDistributionSwitchboardActive: true,
    releaseAcceptanceActive: true,
    eastDispatchActive: true,
    canvasChildAggregationActive: true,
    routeConductorSummarySurfaceActive: true,
    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationChronologyFirst: true,

    canvasChildSequence: CANVAS_CHILD_SEQUENCE,

    currentCanvasParentObserved: true,
    currentCanvasParentContractObserved: true,
    currentCanvasParentContract: CONTRACT,
    currentCanvasParentIsV11_1: true,
    previousCanvasParentContract: PREVIOUS_CONTRACT,
    baselineCanvasParentContract: BASELINE_CONTRACT,
    canvasParentBootMethodAvailable: true,

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
    canvasReleasePacketReady: false,
    canvasReleaseHeldReason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    canvasParentReleaseGateReady: false,
    parentAcceptedRouteConductorRelease: false,

    parentReleasePacketComposed: false,
    parentReleasePacketPublishedForEast: false,
    parentReleasePacketSentToEast: false,
    parentReleasePacketLawful: false,
    eastDispatchAuthorized: false,
    eastDispatchPacketPublished: false,
    eastDispatchAttempted: false,
    eastDispatchMethod: "NONE",
    handoffTo: "NONE",

    eastObserved: false,
    eastApiReady: false,
    eastRequiredMethodsPresent: false,
    eastResponseClass: EAST_RESULT_CLASS.NOT_DISPATCHED,
    eastResponseObserved: false,
    eastResponseReceived: false,
    eastResponse: null,
    canvasEastHeldPacketRecognized: false,
    canvasEastEvidenceReady: false,
    canvasEastF13AtlasPacketReady: false,
    canvasEastFalsePromotionBlocked: false,
    canvasEastFalsePromotionReasons: [],

    westObserved: false,
    westApiReady: false,
    canvasWestInspectionReady: false,
    canvasWestEvidenceReady: false,

    southObserved: false,
    southApiReady: false,
    canvasSouthVisibleProofReady: false,
    canvasSouthEvidenceReady: false,
    canvasSouthHardFail: false,
    canvasSouthProofStale: false,

    allCanvasChildrenApiReady: false,
    allCanvasChildrenEvidenceReady: false,
    allCanvasChildrenReady: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    f13StrictEvidenceRepairTarget: ROUTE_FILE,

    structuralCarrierReady: true,
    structuralCarrierSafe: true,
    canvasParentCarrierSafe: true,

    routeConductorNotified: false,
    routeConductorNotifyMethod: "NONE",
    routeConductorNotificationError: "",

    firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    recommendedNextFile: ROUTE_FILE,
    recommendedNextRenewalTarget: ROUTE_FILE,
    canvasNextAuditTarget: ROUTE_FILE,
    postgameStatus: "CANVAS_LOCAL_STATION_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",

    lastEastDispatchPacket: null,
    lastEastReceipt: null,
    lastWestReceipt: null,
    lastSouthReceipt: null,
    lastCanvasStationSummary: null,
    lastChildPacket: null,
    childPackets: [],
    localEvents: [],
    errors: [],

    bootAuditComplete: false,
    publishedAt: "",
    updatedAt: "",

    ...FINAL_FALSE
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
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

  function hasRealValue(value) {
    return value !== undefined && value !== null && String(value) !== "";
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
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function sameText(a, b) {
    return safeString(a).trim() === safeString(b).trim();
  }

  function upperText(value) {
    return safeString(value).trim().toUpperCase();
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_LOCAL_STATION_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 180);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_LOCAL_STATION_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 120);
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function firstGlobal(names) {
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return found;
    }
    return null;
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return hasRealValue(value) ? value : fallback;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readFirstDataset(keys, fallback = undefined) {
    for (const key of keys || []) {
      const value = datasetValue(key, "");
      if (hasRealValue(value)) return value;
    }
    return fallback;
  }

  function safeInvoke(source, methodName, args = []) {
    if (!source || !isFunction(source[methodName])) return null;

    try {
      return source[methodName](...args);
    } catch (error) {
      recordError("SAFE_INVOKE_FAILED", error, { methodName });
      return null;
    }
  }

  function candidateFromApi(source, methodName) {
    if (!source || !isFunction(source[methodName])) return null;
    return safeInvoke(source, methodName);
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getReceiptLight",
      "getReceipt",
      "getCarrierReceipt",
      "readStructuralCarrier",
      "getStructuralCarrier",
      "getCanvasCarrier",
      "getStatus"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? authority[method](false)
          : authority[method]();

        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function releaseEvidenceKeyPresent(value, keys) {
    if (!isObject(value)) return false;

    for (const key of keys) {
      if (own(value, key) && hasRealValue(value[key])) return true;
    }

    return false;
  }

  function hasUsefulReleaseShape(value) {
    if (!isObject(value)) return false;

    return Boolean(
      releaseEvidenceKeyPresent(value, [
        "canvasReleaseAuthorized",
        "canvasReleasePacketReady",
        "westCanvasReleaseApproved",
        "westHardBlock",
        "carrierHostAdmissibilityReady",
        "indexPairReady",
        "handoffTo",
        "destinationFile",
        "targetFile",
        "cycleNumber",
        "cycleRoute",
        "firstFailedCoordinate",
        "recommendedNextFile",
        "recommendedNextRenewalTarget",
        "postgameStatus"
      ]) ||
      isObject(value.releasePacket) ||
      isObject(value.canvasReleasePacket) ||
      isObject(value.routeConductorReleasePacket)
    );
  }

  function extractNestedReleasePacket(value) {
    if (!isObject(value)) return null;

    const keys = [
      "canvasReleasePacket",
      "releasePacket",
      "routeConductorReleasePacket",
      "southRouteConductorReleasePacket",
      "canvasParentReleasePacket",
      "canvasHandoffPacket",
      "handoffPacket",
      "releaseToCanvasPacket",
      "canvasRelease",
      "packet"
    ];

    for (const key of keys) {
      const nested = value[key];
      if (isObject(nested) && hasUsefulReleaseShape(nested)) return nested;
    }

    if (isObject(value.options)) {
      const nested = extractNestedReleasePacket(value.options);
      if (nested) return nested;
    }

    if (isObject(value.receipt)) {
      const nested = extractNestedReleasePacket(value.receipt);
      if (nested) return nested;
      if (hasUsefulReleaseShape(value.receipt)) return value.receipt;
    }

    if (isObject(value.dataset)) {
      const nested = extractNestedReleasePacket(value.dataset);
      if (nested) return nested;
      if (hasUsefulReleaseShape(value.dataset)) return value.dataset;
    }

    if (hasUsefulReleaseShape(value)) return value;

    return null;
  }

  function markReleasePacket(packet, source, method) {
    state.releasePacketObserved = Boolean(packet);
    state.acceptedReleaseSource = packet ? source : RELEASE_SOURCE.NONE;
    state.releasePacketIntakeMethod = packet ? method : "NONE";
    state.routeConductorReleasePacket = packet ? clonePlain(packet) : null;
    return packet || null;
  }

  function readOptionsPacket(options) {
    const extracted = extractNestedReleasePacket(options);
    if (!extracted) return null;
    return markReleasePacket(extracted, RELEASE_SOURCE.OPTIONS, "OPTIONS_PACKET");
  }

  function readDatasetPacket() {
    const fieldMap = {
      canvasReleaseAuthorized: [
        "canvasReleaseAuthorized",
        "hearthCanvasReleaseAuthorized",
        "hearthSouthCanvasReleaseAuthorized",
        "hearthRouteConductorCanvasReleaseAuthorized"
      ],
      canvasReleasePacketReady: [
        "canvasReleasePacketReady",
        "hearthCanvasReleasePacketReady",
        "hearthSouthCanvasReleasePacketReady",
        "hearthRouteConductorCanvasReleasePacketReady"
      ],
      westCanvasReleaseApproved: [
        "westCanvasReleaseApproved",
        "hearthWestCanvasReleaseApproved",
        "hearthSouthWestCanvasReleaseApproved",
        "hearthRouteConductorWestCanvasReleaseApproved"
      ],
      westHardBlock: [
        "westHardBlock",
        "hearthWestHardBlock",
        "hearthSouthWestHardBlock",
        "hearthRouteConductorWestHardBlock"
      ],
      carrierHostAdmissibilityReady: [
        "carrierHostAdmissibilityReady",
        "hearthCarrierHostAdmissibilityReady",
        "hearthSouthCarrierHostAdmissibilityReady",
        "hearthRouteConductorCarrierHostAdmissibilityReady"
      ],
      indexPairReady: [
        "indexPairReady",
        "hearthIndexPairReady",
        "hearthSouthIndexPairReady",
        "hearthRouteConductorIndexPairReady"
      ],
      handoffTo: [
        "handoffTo",
        "hearthHandoffTo",
        "hearthSouthHandoffTo",
        "hearthRouteConductorHandoffTo"
      ],
      destinationFile: [
        "destinationFile",
        "targetFile",
        "hearthDestinationFile",
        "hearthTargetFile",
        "hearthSouthDestinationFile",
        "hearthSouthTargetFile",
        "hearthRouteConductorDestinationFile",
        "hearthRouteConductorTargetFile"
      ],
      cycleNumber: [
        "cycleNumber",
        "hearthCycleNumber",
        "hearthSouthCycleNumber",
        "hearthRouteConductorCycleNumber"
      ],
      cycleRoute: [
        "cycleRoute",
        "hearthCycleRoute",
        "hearthSouthCycleRoute",
        "hearthRouteConductorCycleRoute"
      ],
      firstFailedCoordinate: [
        "firstFailedCoordinate",
        "hearthFirstFailedCoordinate",
        "hearthSouthFirstFailedCoordinate",
        "hearthRouteConductorFirstFailedCoordinate"
      ],
      recommendedNextFile: [
        "recommendedNextFile",
        "hearthRecommendedNextFile",
        "hearthSouthRecommendedNextFile",
        "hearthRouteConductorRecommendedNextFile"
      ],
      recommendedNextRenewalTarget: [
        "recommendedNextRenewalTarget",
        "hearthRecommendedNextRenewalTarget",
        "hearthSouthRecommendedNextRenewalTarget",
        "hearthRouteConductorRecommendedNextRenewalTarget"
      ],
      postgameStatus: [
        "postgameStatus",
        "hearthPostgameStatus",
        "hearthSouthPostgameStatus",
        "hearthRouteConductorPostgameStatus"
      ]
    };

    const packet = {
      source: "DOCUMENT_DATASET_ROUTE_CONDUCTOR_RELEASE"
    };

    let hasAnyRealDatasetValue = false;

    Object.keys(fieldMap).forEach((normalizedKey) => {
      const value = readFirstDataset(fieldMap[normalizedKey]);

      if (hasRealValue(value)) {
        packet[normalizedKey] = value;
        hasAnyRealDatasetValue = true;
      }
    });

    if (!hasAnyRealDatasetValue) return null;
    if (!hasUsefulReleaseShape(packet)) return null;

    return markReleasePacket(packet, RELEASE_SOURCE.DATASET, "DATASET_FALLBACK");
  }

  function readRouteConductorReleasePacket(options = {}) {
    const fromOptions = readOptionsPacket(options);
    if (fromOptions) return fromOptions;

    const routeConductorSources = [
      readPath("HEARTH.routeConductor"),
      readPath("HEARTH.southRouteConductor"),
      readPath("HEARTH.routeConductorPrimaryGate"),
      readPath("HEARTH.routeConductorCentralStationSwitchboardWestV42SouthOutputAlignment"),
      readPath("HEARTH.routeConductorCentralStationSwitchboardNewsFibonacciParentCoordination"),
      readPath("DEXTER_LAB.hearthRouteConductor"),
      readPath("DEXTER_LAB.hearthSouthRouteConductor"),
      readPath("DEXTER_LAB.hearthRouteConductorPrimaryGate"),
      readPath("DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardWestV42SouthOutputAlignment"),
      root.HEARTH_ROUTE_CONDUCTOR,
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR,
      root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE,
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT,
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION
    ];

    const methodCandidates = [
      "getCanvasReleasePacket",
      "getReleasePacket",
      "getCanvasHandoffPacket",
      "getHandoffPacket",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getReceiptLight",
      "getReceipt",
      "readReceipt"
    ];

    for (const source of routeConductorSources) {
      if (!source) continue;

      for (const method of methodCandidates) {
        const result = candidateFromApi(source, method);
        const extracted = extractNestedReleasePacket(result);

        if (extracted) {
          return markReleasePacket(extracted, RELEASE_SOURCE.ROUTE_CONDUCTOR, `ROUTE_CONDUCTOR_API:${method}`);
        }
      }

      const extractedFromObject = extractNestedReleasePacket(source);

      if (extractedFromObject) {
        return markReleasePacket(extractedFromObject, RELEASE_SOURCE.ROUTE_CONDUCTOR, "ROUTE_CONDUCTOR_OBJECT");
      }
    }

    const globalSources = [
      readPath("HEARTH.canvasReleasePacket"),
      readPath("HEARTH.routeConductorReleasePacket"),
      readPath("HEARTH.southRouteConductorReleasePacket"),
      readPath("HEARTH.canvasParentReleasePacket"),
      readPath("DEXTER_LAB.hearthRouteConductorReceipt"),
      readPath("DEXTER_LAB.hearthSouthRouteConductorReceipt"),
      root.HEARTH_CANVAS_RELEASE_PACKET,
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET,
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET,
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT,
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT,
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT_RECEIPT
    ];

    for (const source of globalSources) {
      const extracted = extractNestedReleasePacket(source);

      if (extracted) {
        return markReleasePacket(extracted, RELEASE_SOURCE.GLOBAL, "GLOBAL_RELEASE_OR_RECEIPT");
      }
    }

    const datasetPacket = readDatasetPacket();
    if (datasetPacket) return datasetPacket;

    return markReleasePacket(null, RELEASE_SOURCE.NONE, "NONE");
  }

  function normalizeReleasePacket(packet) {
    if (!isObject(packet)) {
      state.normalizedReleasePacket = null;
      return null;
    }

    const normalized = {
      canvasReleaseAuthorized: safeBool(packet.canvasReleaseAuthorized, false),
      canvasReleasePacketReady: safeBool(packet.canvasReleasePacketReady, false),
      westCanvasReleaseApproved: safeBool(packet.westCanvasReleaseApproved, false),
      westHardBlock: safeBool(packet.westHardBlock, false),
      carrierHostAdmissibilityReady: safeBool(packet.carrierHostAdmissibilityReady, false),
      indexPairReady: safeBool(packet.indexPairReady, false),
      handoffTo: safeString(packet.handoffTo || packet.handoff || ""),
      destinationFile: safeString(packet.destinationFile || packet.targetFile || ""),
      cycleNumber: safeNumber(packet.cycleNumber || packet.activeCycleNumber, 0),
      cycleRoute: safeString(packet.cycleRoute || packet.activeCycleRoute || packet.routeCycle || ""),
      source: safeString(packet.source || packet.releaseSource || "ROUTE_CONDUCTOR_RELEASE_PACKET"),
      firstFailedCoordinate: safeString(packet.firstFailedCoordinate || ""),
      recommendedNextFile: safeString(packet.recommendedNextFile || ""),
      recommendedNextRenewalTarget: safeString(packet.recommendedNextRenewalTarget || ""),
      postgameStatus: safeString(packet.postgameStatus || ""),
      sourceContract: safeString(packet.contract || packet.sourceContract || packet.routeConductorContract || ""),
      sourceReceipt: safeString(packet.receipt || packet.sourceReceipt || packet.routeConductorReceipt || ""),
      original: clonePlain(packet)
    };

    if (!normalized.destinationFile && state.acceptedReleaseSource === RELEASE_SOURCE.ROUTE_CONDUCTOR) {
      normalized.destinationFile = TARGET_FILE;
    }

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
      cycleRoute: "WAITING_CYCLE_TWO_CANVAS_ROUTE"
    };

    return map[failure] || "WAITING_VALID_ROUTE_CONDUCTOR_RELEASE_PACKET";
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
      if (safeNumber(packet.cycleNumber, 0) !== REQUIRED_RELEASE.cycleNumber) failures.push("cycleNumber");
      if (!sameText(packet.cycleRoute, REQUIRED_RELEASE.cycleRoute)) failures.push("cycleRoute");

      const destination = safeString(packet.destinationFile).trim();

      if (destination && !sameText(destination, REQUIRED_RELEASE.destinationFile)) {
        failures.push("destinationFile");
      }
    }

    state.releaseValidationFailures = failures.slice();
    state.firstReleaseValidationFailure = failures[0] || "";
    state.releasePacketValid = failures.length === 0;

    return state.releasePacketValid;
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
      state.canvasReleasePacketReady = false;
      state.canvasReleaseHeldReason = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      state.firstFailedCoordinate = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      state.recommendedNextFile = ROUTE_FILE;
      state.recommendedNextRenewalTarget = ROUTE_FILE;
      state.canvasNextAuditTarget = ROUTE_FILE;
      state.postgameStatus = "CANVAS_LOCAL_STATION_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      refreshParentReleaseGateMarkers();
      return false;
    }

    if (!state.releasePacketValid || !isObject(packet)) {
      state.releasePacketAccepted = false;
      state.canvasParentReleaseObserved = false;
      state.canvasParentReleaseAccepted = false;
      state.canvasParentReleaseLawful = false;
      state.parentReleaseLawful = false;
      state.canvasReleaseAuthorized = false;
      state.canvasReleasePacketReady = false;
      state.canvasReleaseHeldReason = "ROUTE_CONDUCTOR_RELEASE_PACKET_INVALID";
      state.firstFailedCoordinate = validationFailureToCoordinate(state.firstReleaseValidationFailure);
      state.recommendedNextFile = ROUTE_FILE;
      state.recommendedNextRenewalTarget = ROUTE_FILE;
      state.canvasNextAuditTarget = ROUTE_FILE;
      state.postgameStatus = "CANVAS_LOCAL_STATION_WAITING_VALID_ROUTE_CONDUCTOR_RELEASE_PACKET";
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
    state.canvasReleasePacketReady = true;
    state.canvasReleaseHeldReason = "NONE_CANVAS_PARENT_RELEASE_ACCEPTED";

    refreshParentReleaseGateMarkers();

    state.firstFailedCoordinate = "WAITING_CANVAS_PARENT_EAST_DISPATCH_PUBLICATION";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.canvasNextAuditTarget = FILE;
    state.postgameStatus = "CANVAS_LOCAL_STATION_RELEASE_ACCEPTED_PREPARING_EAST_DISPATCH";

    return true;
  }

  function refreshParentReleaseGateMarkers() {
    const ready = Boolean(
      state.releasePacketObserved &&
      state.releasePacketValid &&
      state.releasePacketAccepted &&
      state.canvasParentReleaseObserved &&
      state.canvasParentReleaseAccepted &&
      state.canvasParentReleaseLawful &&
      state.parentReleaseLawful &&
      state.canvasReleaseAuthorized
    );

    state.canvasParentReleaseGateReady = ready;
    state.parentAcceptedRouteConductorRelease = Boolean(
      ready &&
      (
        state.acceptedReleaseSource === RELEASE_SOURCE.ROUTE_CONDUCTOR ||
        state.acceptedReleaseSource === RELEASE_SOURCE.OPTIONS ||
        state.acceptedReleaseSource === RELEASE_SOURCE.GLOBAL ||
        state.acceptedReleaseSource === RELEASE_SOURCE.DATASET
      )
    );

    return ready;
  }

  function composeEastDispatchPacket() {
    if (!state.canvasParentReleaseAccepted || !state.parentReleaseLawful || !state.canvasReleaseAuthorized) {
      state.parentReleasePacketComposed = false;
      state.parentReleasePacketPublishedForEast = false;
      state.parentReleasePacketLawful = false;
      state.lastEastDispatchPacket = null;
      return null;
    }

    const packet = {
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      sourceFile: FILE,
      targetFile: EAST_FILE,
      destinationFile: EAST_FILE,
      handoffTo: "EAST",
      receivedFrom: "CANVAS_PARENT",

      cycleNumber: 2,
      cycleRoute: CYCLE_2_ROUTE,
      activeCycleNumber: 2,
      activeCycleRoute: CYCLE_2_ROUTE,
      activeFibonacci: "F13P",
      eastActiveFibonacci: "F13E",

      canvasParentReleaseObserved: true,
      canvasParentReleaseAccepted: true,
      canvasParentReleaseLawful: true,
      canvasParentReleaseGateReady: true,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,
      parentReleaseLawful: true,
      parentReleasePacketLawful: true,
      parentReleasePacketSentToEast: true,

      canvasReleaseAuthorized: true,
      canvasReleasePacketReady: true,
      eastDispatchAuthorized: true,
      eastDispatchPacketPublished: true,

      westCanvasReleaseApproved: true,
      westHardBlock: false,

      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,

      atlasBuildRequested: true,
      f13AtlasBuildRequested: true,
      buildAtlasRequested: true,

      canvasEastApiReadinessDoesNotRequireAtlasEvidence: true,
      heldEastPacketDoesNotDemoteApiReadiness: true,
      missingMaterialDoesNotDemoteApiReadiness: true,

      ...FINAL_FALSE
    };

    state.parentReleasePacketComposed = true;
    state.parentReleasePacketLawful = true;
    state.lastEastDispatchPacket = clonePlain(packet);

    return packet;
  }

  function getLastEastDispatchPacket() {
    return clonePlain(state.lastEastDispatchPacket);
  }

  function publishEastDispatchPacket(packet) {
    if (!isObject(packet)) {
      state.eastDispatchPacketPublished = false;
      return false;
    }

    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasParentEastDispatchPacket = clonePlain(packet);
    hearth.canvasEastDispatchPacket = clonePlain(packet);
    lab.hearthCanvasParentEastDispatchPacket = clonePlain(packet);
    lab.hearthCanvasEastDispatchPacket = clonePlain(packet);

    root.HEARTH_CANVAS_PARENT_EAST_DISPATCH_PACKET = clonePlain(packet);
    root.HEARTH_CANVAS_EAST_DISPATCH_PACKET = clonePlain(packet);

    state.parentReleasePacketPublishedForEast = true;
    state.eastDispatchPacketPublished = true;
    state.eastDispatchAuthorized = true;
    state.handoffTo = "EAST";

    return true;
  }

  function readCanvasChild(kind) {
    const aliases = {
      east: [
        "HEARTH_CANVAS_EAST",
        "HEARTH_CANVAS_EAST_SOURCE",
        "HEARTH_CANVAS_EAST_AUTHORITY",
        "HEARTH_CANVAS_EAST_EVIDENCE",
        "HEARTH_CANVAS_EAST_ENGINE",
        "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR",
        "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_ATLAS_SOURCE",
        "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION",
        "HEARTH_CANVAS_EAST_SOUTH_MATH_FORWARD_ATLAS_EXPRESSION",
        "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE",
        "HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP",
        "HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE",
        "HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE",
        "HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD",
        "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastSource",
        "HEARTH.canvasEastAuthority",
        "HEARTH.canvasEastEvidence",
        "HEARTH.canvasEastEngine",
        "HEARTH.canvasEastParentV103DispatchApiRecognitionServedDetectionRepair",
        "HEARTH.canvasEastParentV103DispatchApiRecognitionAtlasSource",
        "HEARTH.canvasEastSameRuntimeExposureBeaconApiPublication",
        "HEARTH.canvasEastSouthMathForwardAtlasExpression",
        "HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
        "HEARTH.canvasEastParentFirstApiRecognitionBootstrap",
        "HEARTH.canvasEastCurrentParentRecognizedF13AtlasSource",
        "HEARTH.canvasEastGovernedF13AtlasSource",
        "HEARTH.canvasEastF13AtlasSourceChild",
        "HEARTH.canvasEastMaterialAtlasSourceMachine",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastSource",
        "DEXTER_LAB.hearthCanvasEastAuthority",
        "DEXTER_LAB.hearthCanvasEastEvidence",
        "DEXTER_LAB.hearthCanvasEastEngine",
        "DEXTER_LAB.hearthCanvasEastParentV103DispatchApiRecognitionServedDetectionRepair",
        "DEXTER_LAB.hearthCanvasEastParentV103DispatchApiRecognitionAtlasSource",
        "DEXTER_LAB.hearthCanvasEastSameRuntimeExposureBeaconApiPublication",
        "DEXTER_LAB.hearthCanvasEastSouthMathForwardAtlasExpression",
        "DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
        "DEXTER_LAB.hearthCanvasEastParentFirstApiRecognitionBootstrap",
        "DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSource",
        "DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource",
        "DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild",
        "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
      ],
      west: [
        "HEARTH_CANVAS_WEST",
        "HEARTH_CANVAS_WEST_AUTHORITY",
        "HEARTH_CANVAS_WEST_EVIDENCE",
        "HEARTH_CANVAS_WEST_ENGINE",
        "HEARTH.canvasWest",
        "HEARTH.canvasWestAuthority",
        "HEARTH.canvasWestEvidence",
        "HEARTH.canvasWestEngine",
        "HEARTH.canvasWestInspectionInvalidationControl",
        "HEARTH.canvasWestF13NInspectionViewInvalidationChild",
        "DEXTER_LAB.hearthCanvasWest",
        "DEXTER_LAB.hearthCanvasWestAuthority",
        "DEXTER_LAB.hearthCanvasWestEvidence",
        "DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl"
      ],
      south: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH_CANVAS_SOUTH_AUTHORITY",
        "HEARTH_CANVAS_SOUTH_EVIDENCE",
        "HEARTH_CANVAS_SOUTH_ENGINE",
        "HEARTH.canvasSouth",
        "HEARTH.canvasSouthAuthority",
        "HEARTH.canvasSouthEvidence",
        "HEARTH.canvasSouthEngine",
        "HEARTH.canvasSouthTextureSphereVisibleProof",
        "HEARTH.canvasSouthSplitAdapterDrainVisibleProofHardening",
        "HEARTH.canvasSouthF13STextureRenderVisibleProofChild",
        "DEXTER_LAB.hearthCanvasSouth",
        "DEXTER_LAB.hearthCanvasSouthAuthority",
        "DEXTER_LAB.hearthCanvasSouthEvidence",
        "DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof",
        "DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChild"
      ]
    };

    return firstGlobal(aliases[kind] || []);
  }

  function childHasMethods(child, methods) {
    if (!child || !isObject(child)) return false;
    return methods.every((method) => isFunction(child[method]));
  }

  function packetHasFinalClaim(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
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
      upperText(packet.proofScope).includes("FINAL") ||
      upperText(packet.scope).includes("FINAL") ||
      upperText(packet.claimScope).includes("FINAL")
    );
  }

  function hasAtlasEvidence(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.f13AtlasPacketReady === true ||
      packet.atlasBuildComplete === true ||
      packet.atlasCanvasPresent === true ||
      packet.atlasReady === true ||
      packet.canvasEastEvidenceReady === true ||
      packet.canvasEastF13AtlasPacketReady === true ||
      packet.f13SourceStageComplete === true ||
      packet.packetType === "CANVAS_EAST_F13_ATLAS_EVIDENCE_PACKET"
    );
  }

  function isHeldEastPacket(packet) {
    if (!isObject(packet)) return false;

    const coordinate = safeString(packet.firstFailedCoordinate);

    return Boolean(
      packet.heldAtlasPacketReturned === true ||
      packet.synchronousHeldPacketActive === true ||
      packet.heldPacketWasSynchronous === true ||
      packet.heldDoesNotMeanApiMissing === true ||
      (packet.permissionClass && safeString(packet.permissionClass).includes("HELD")) ||
      coordinate.includes("WAITING") ||
      packet.f13BuildBlockedReason
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

    if (packetHasFinalClaim(packet) && !hasAtlasEvidence(packet)) {
      reasons.push("FINAL_CLAIM_WITHOUT_ATLAS_EVIDENCE");
    }

    return reasons;
  }

  function classifyEastResponse(response) {
    state.eastResponseObserved = response !== null && response !== undefined;
    state.eastResponseReceived = isObject(response);
    state.eastResponse = isObject(response) ? clonePlain(response) : response;

    if (!state.eastObserved || !state.eastApiReady) {
      state.eastResponseClass = EAST_RESULT_CLASS.MISSING_API;
      state.canvasEastEvidenceReady = false;
      state.canvasEastF13AtlasPacketReady = false;
      state.canvasEastHeldPacketRecognized = false;
      state.canvasEastFalsePromotionBlocked = false;
      state.canvasEastFalsePromotionReasons = [];
      return state.eastResponseClass;
    }

    if (!isObject(response)) {
      state.eastResponseClass = EAST_RESULT_CLASS.WAITING_RESPONSE;
      return state.eastResponseClass;
    }

    const promotion = falsePromotionReasons(response);

    if (promotion.length) {
      state.canvasEastFalsePromotionBlocked = true;
      state.canvasEastFalsePromotionReasons = promotion.slice();
      state.eastResponseClass = EAST_RESULT_CLASS.FALSE_PROMOTION_BLOCKED;
      return state.eastResponseClass;
    }

    if (hasAtlasEvidence(response)) {
      state.canvasEastEvidenceReady = true;
      state.canvasEastF13AtlasPacketReady = true;
      state.canvasEastHeldPacketRecognized = false;
      state.eastResponseClass = EAST_RESULT_CLASS.ATLAS_EVIDENCE;
      return state.eastResponseClass;
    }

    if (isHeldEastPacket(response)) {
      state.canvasEastHeldPacketRecognized = true;
      state.canvasEastEvidenceReady = false;
      state.canvasEastF13AtlasPacketReady = false;
      state.eastResponseClass = EAST_RESULT_CLASS.HELD_PACKET;
      return state.eastResponseClass;
    }

    state.eastResponseClass = EAST_RESULT_CLASS.WAITING_RESPONSE;
    return state.eastResponseClass;
  }

  function dispatchEast(packet) {
    if (!isObject(packet) || !state.parentReleasePacketLawful) {
      state.eastDispatchAttempted = false;
      state.eastDispatchMethod = "NONE";
      return null;
    }

    publishEastDispatchPacket(packet);

    state.eastDispatchAttempted = true;
    state.parentReleasePacketSentToEast = true;
    state.parentReleasePacketLawful = true;

    const east = readCanvasChild("east");
    let response = null;

    if (isObject(east)) {
      state.eastObserved = true;

      const methods = [
        "receiveParentDispatchPacket",
        "receiveEastDispatchPacket",
        "receiveDispatchPacket",
        "receiveParentPacket",
        "receiveReleasePacket",
        "receiveCanvasParentPacket",
        "receiveParentReleasePacket",
        "buildAtlas",
        "read",
        "getReceipt",
        "getReceiptLight"
      ];

      for (const method of methods) {
        if (!isFunction(east[method])) continue;

        state.eastDispatchMethod = method;
        response = method === "getReceipt" || method === "getReceiptLight"
          ? safeInvoke(east, method)
          : safeInvoke(east, method, [clonePlain(packet)]);

        break;
      }

      state.eastRequiredMethodsPresent = childHasMethods(east, EAST_REQUIRED_METHODS);
      state.eastApiReady = Boolean(
        state.eastRequiredMethodsPresent ||
        methods.some((method) => isFunction(east[method]))
      );
    } else if (isFunction(east)) {
      state.eastObserved = true;
      state.eastApiReady = true;
      state.eastRequiredMethodsPresent = false;
      state.eastDispatchMethod = "function";
      try {
        response = east(clonePlain(packet));
      } catch (error) {
        recordError("EAST_FUNCTION_DISPATCH_FAILED", error);
        response = null;
      }
    } else {
      state.eastObserved = false;
      state.eastApiReady = false;
      state.eastRequiredMethodsPresent = false;
      state.eastDispatchMethod = "MISSING_EAST_AUTHORITY";
    }

    classifyEastResponse(response);
    return response;
  }

  function scanEast() {
    const east = readCanvasChild("east");
    const receipt = readReceipt(east) || {};
    state.lastEastReceipt = clonePlain(receipt);

    const methodReady = childHasMethods(east, EAST_REQUIRED_METHODS);
    const apiReady = Boolean(
      methodReady ||
      safeBool(receipt.canvasEastApiReady, false) ||
      safeBool(receipt.requiredApiSurfaceComplete, false) ||
      (safeBool(receipt.buildAtlasAvailable, false) &&
        safeBool(receipt.sampleAvailable, false) &&
        safeBool(receipt.readAvailable, false) &&
        safeBool(receipt.getReceiptAvailable, false)) ||
      datasetValue("hearthCanvasEastApiReady") === "true" ||
      datasetValue("hearthCanvasEastRequiredApiSurfaceComplete") === "true"
    );

    const evidenceReady = Boolean(
      hasAtlasEvidence(receipt) ||
      state.canvasEastEvidenceReady ||
      datasetValue("hearthCanvasEastEvidenceReady") === "true" ||
      datasetValue("hearthCanvasEastF13AtlasPacketReady") === "true"
    );

    const heldReady = Boolean(
      isHeldEastPacket(receipt) ||
      state.canvasEastHeldPacketRecognized ||
      datasetValue("hearthCanvasEastHeldDoesNotMeanApiMissing") === "true" ||
      datasetValue("hearthCanvasEastHeldAtlasPacketReturned") === "true"
    );

    const promotion = falsePromotionReasons(receipt);

    state.eastObserved = Boolean(east || apiReady);
    state.eastRequiredMethodsPresent = methodReady;
    state.eastApiReady = apiReady;
    state.canvasEastEvidenceReady = evidenceReady;
    state.canvasEastF13AtlasPacketReady = evidenceReady;
    state.canvasEastHeldPacketRecognized = Boolean(heldReady && apiReady && !evidenceReady);
    state.canvasEastFalsePromotionBlocked = promotion.length > 0 || state.canvasEastFalsePromotionBlocked;
    if (promotion.length) state.canvasEastFalsePromotionReasons = promotion.slice();

    return {
      child: east,
      receipt,
      observed: state.eastObserved,
      apiReady: state.eastApiReady,
      requiredMethodsPresent: state.eastRequiredMethodsPresent,
      evidenceReady: state.canvasEastEvidenceReady,
      heldPacketRecognized: state.canvasEastHeldPacketRecognized,
      falsePromotionBlocked: state.canvasEastFalsePromotionBlocked,
      status: !state.eastApiReady
        ? CHILD_STATUS.MISSING_API
        : state.canvasEastFalsePromotionBlocked
          ? CHILD_STATUS.FALSE_PROMOTION_BLOCKED
          : state.canvasEastEvidenceReady
            ? CHILD_STATUS.EVIDENCE_READY
            : state.canvasEastHeldPacketRecognized
              ? CHILD_STATUS.HELD_PACKET_API_READY
              : CHILD_STATUS.API_READY_EVIDENCE_WAIT
    };
  }

  function scanWest() {
    const west = readCanvasChild("west");
    const receipt = readReceipt(west) || {};
    state.lastWestReceipt = clonePlain(receipt);

    const apiReady = Boolean(
      childHasMethods(west, ["getReceipt"]) ||
      Boolean(west && (
        isFunction(west.bindInspection) ||
        isFunction(west.getViewState) ||
        isFunction(west.setRotation) ||
        isFunction(west.setZoom) ||
        isFunction(west.inspect) ||
        isFunction(west.getInspectionPacket) ||
        isFunction(west.getInspectionReceipt)
      )) ||
      safeBool(receipt.canvasWestApiReady, false) ||
      safeBool(receipt.canvasWestReady, false) ||
      datasetValue("hearthCanvasWestApiReady") === "true"
    );

    const inspectionReady = Boolean(
      apiReady &&
      (
        safeBool(receipt.canvasWestInspectionReady, false) ||
        safeBool(receipt.canvasWestEvidenceReady, false) ||
        safeBool(receipt.f13nInspectionReady, false) ||
        safeBool(receipt.inspectionReady, false) ||
        safeBool(receipt.dragInspectionBound, false) ||
        safeBool(receipt.zoomInspectionBound, false) ||
        datasetValue("hearthCanvasWestInspectionReady") === "true" ||
        state.canvasWestInspectionReady
      )
    );

    state.westObserved = Boolean(west || apiReady);
    state.westApiReady = apiReady;
    state.canvasWestInspectionReady = inspectionReady;
    state.canvasWestEvidenceReady = inspectionReady;

    return {
      child: west,
      receipt,
      observed: state.westObserved,
      apiReady,
      inspectionReady,
      evidenceReady: inspectionReady,
      status: !apiReady
        ? CHILD_STATUS.MISSING_API
        : inspectionReady
          ? CHILD_STATUS.EVIDENCE_READY
          : CHILD_STATUS.API_READY_EVIDENCE_WAIT
    };
  }

  function scanSouth() {
    const south = readCanvasChild("south");
    const receipt = readReceipt(south) || {};
    state.lastSouthReceipt = clonePlain(receipt);

    const apiReady = Boolean(
      childHasMethods(south, ["getReceipt"]) ||
      Boolean(south && (
        isFunction(south.composeTexture) ||
        isFunction(south.renderSphere) ||
        isFunction(south.renderSphereSync) ||
        isFunction(south.getTextureCanvas) ||
        isFunction(south.sampleVisibleContent) ||
        isFunction(south.getVisibleProof) ||
        isFunction(south.getVisibleProofReceipt)
      )) ||
      safeBool(receipt.canvasSouthApiReady, false) ||
      safeBool(receipt.canvasSouthReady, false) ||
      datasetValue("hearthCanvasSouthApiReady") === "true"
    );

    const hardFail = Boolean(
      safeBool(receipt.f13HardFail, false) ||
      safeBool(receipt.visibleContentHardFail, false) ||
      safeBool(receipt.southHardFailObserved, false) ||
      datasetValue("hearthCanvasF13HardFail") === "true"
    );

    const stale = Boolean(
      safeBool(receipt.visibleProofStale, false) ||
      safeBool(receipt.renderFrameStale, false) ||
      safeBool(receipt.textureInvalidated, false)
    );

    const visibleProofReady = Boolean(
      apiReady &&
      !hardFail &&
      !stale &&
      (
        safeBool(receipt.canvasSouthVisibleProofReady, false) ||
        safeBool(receipt.canvasSouthEvidenceReady, false) ||
        safeBool(receipt.visibleContentStrictProof, false) ||
        safeBool(receipt.visiblePlanetAvailable, false) ||
        safeBool(receipt.imageRendered, false) ||
        safeBool(receipt.firstFrameDetected, false) ||
        safeBool(receipt.currentVisibleProofValid, false) ||
        datasetValue("hearthCanvasSouthVisibleProofReady") === "true" ||
        state.canvasSouthVisibleProofReady
      )
    );

    state.southObserved = Boolean(south || apiReady);
    state.southApiReady = apiReady;
    state.canvasSouthHardFail = hardFail;
    state.canvasSouthProofStale = stale;
    state.canvasSouthVisibleProofReady = visibleProofReady;
    state.canvasSouthEvidenceReady = visibleProofReady;

    return {
      child: south,
      receipt,
      observed: state.southObserved,
      apiReady,
      visibleProofReady,
      evidenceReady: visibleProofReady,
      hardFail,
      stale,
      status: hardFail
        ? CHILD_STATUS.HARD_FAIL
        : !apiReady
          ? CHILD_STATUS.MISSING_API
          : visibleProofReady
            ? CHILD_STATUS.EVIDENCE_READY
            : CHILD_STATUS.API_READY_EVIDENCE_WAIT
    };
  }

  function recomputeChildAggregation() {
    const east = scanEast();
    const west = scanWest();
    const south = scanSouth();

    state.allCanvasChildrenApiReady = Boolean(east.apiReady && west.apiReady && south.apiReady);
    state.allCanvasChildrenEvidenceReady = Boolean(
      east.evidenceReady &&
      west.inspectionReady &&
      south.visibleProofReady
    );

    state.allCanvasChildrenReady = Boolean(
      state.allCanvasChildrenApiReady &&
      state.allCanvasChildrenEvidenceReady
    );

    state.f13HardFail = Boolean(
      south.hardFail ||
      east.falsePromotionBlocked ||
      state.canvasEastFalsePromotionBlocked
    );

    state.f13CanvasReadinessObserved = Boolean(
      state.canvasParentReleaseObserved ||
      state.eastDispatchPacketPublished ||
      east.observed ||
      west.observed ||
      south.observed
    );

    state.f13InspectEvidenceAvailable = Boolean(west.inspectionReady);
    state.f13VisibleEvidenceAvailable = Boolean(south.visibleProofReady);

    const releaseAndDispatchReady = Boolean(
      state.canvasParentReleaseAccepted &&
      state.parentReleaseLawful &&
      state.canvasParentReleaseGateReady &&
      state.eastDispatchAuthorized &&
      state.eastDispatchPacketPublished
    );

    state.f13CanvasEvidenceStrict = Boolean(
      releaseAndDispatchReady &&
      east.apiReady &&
      east.evidenceReady &&
      west.apiReady &&
      west.inspectionReady &&
      south.apiReady &&
      south.visibleProofReady &&
      !state.f13HardFail &&
      !state.canvasSouthProofStale
    );

    state.f13CanvasEvidenceDegraded = Boolean(
      !state.f13CanvasEvidenceStrict &&
      releaseAndDispatchReady &&
      east.apiReady &&
      west.apiReady &&
      south.apiReady &&
      !state.f13HardFail &&
      (
        east.evidenceReady ||
        east.heldPacketRecognized ||
        west.inspectionReady ||
        south.visibleProofReady
      )
    );

    state.f13CanvasEvidenceComplete = Boolean(
      state.f13CanvasEvidenceStrict ||
      state.f13CanvasEvidenceDegraded
    );

    resolveF13Gap();

    return {
      east,
      west,
      south,
      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget
    };
  }

  function resolveF13Gap() {
    let gap = "NONE_F13_STRICT_EVIDENCE_COMPLETE";
    let target = ROUTE_FILE;
    let status = "CANVAS_LOCAL_STATION_F13_STRICT_EVIDENCE_COMPLETE";

    if (!state.releasePacketObserved) {
      gap = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      target = ROUTE_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.releasePacketValid) {
      gap = validationFailureToCoordinate(state.firstReleaseValidationFailure);
      target = ROUTE_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_VALID_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.canvasParentReleaseAccepted) {
      gap = "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE";
      target = FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_PARENT_RELEASE_ACCEPTANCE";
    } else if (!state.parentReleaseLawful) {
      gap = "WAITING_CANVAS_PARENT_RELEASE_LAWFUL";
      target = FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_PARENT_RELEASE_LAWFUL";
    } else if (!state.eastDispatchAuthorized || !state.eastDispatchPacketPublished) {
      gap = "WAITING_CANVAS_PARENT_EAST_DISPATCH_PUBLICATION";
      target = FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_EAST_DISPATCH_PUBLICATION";
    } else if (!state.eastApiReady) {
      gap = "WAITING_CANVAS_EAST_API";
      target = EAST_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_EAST_API";
    } else if (state.canvasEastFalsePromotionBlocked) {
      gap = "EAST_FALSE_PROMOTION_BLOCKED";
      target = EAST_FILE;
      status = "CANVAS_LOCAL_STATION_EAST_FALSE_PROMOTION_BLOCKED";
    } else if (!state.canvasEastEvidenceReady) {
      gap = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      target = EAST_FILE;
      status = "CANVAS_LOCAL_STATION_EAST_API_READY_WAITING_ATLAS_EVIDENCE";
    } else if (!state.westApiReady) {
      gap = "WAITING_CANVAS_WEST_API";
      target = WEST_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_WEST_API";
    } else if (!state.canvasWestInspectionReady) {
      gap = "WAITING_CANVAS_WEST_INSPECTION_EVIDENCE";
      target = WEST_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_WEST_INSPECTION_EVIDENCE";
    } else if (!state.southApiReady) {
      gap = "WAITING_CANVAS_SOUTH_API";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_SOUTH_API";
    } else if (state.canvasSouthHardFail) {
      gap = "CANVAS_SOUTH_VISIBLE_PROOF_HARD_FAIL";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_CANVAS_SOUTH_HARD_FAIL";
    } else if (state.canvasSouthProofStale) {
      gap = "WAITING_CANVAS_SOUTH_CURRENT_NON_STALE_VISIBLE_PROOF";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CURRENT_SOUTH_VISIBLE_PROOF";
    } else if (!state.canvasSouthVisibleProofReady) {
      gap = "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
    } else if (!state.f13CanvasEvidenceStrict) {
      gap = "WAITING_CANVAS_F13_STRICT_EVIDENCE";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_F13_STRICT_EVIDENCE";
    }

    state.f13StrictEvidenceGap = gap;
    state.f13StrictEvidenceRepairTarget = target;
    state.firstFailedCoordinate = gap;
    state.recommendedNextFile = target;
    state.recommendedNextRenewalTarget = target;
    state.canvasNextAuditTarget = target;
    state.postgameStatus = status;

    return { gap, target, status };
  }

  function recomputeParentState() {
    state.timestamp = nowIso();

    refreshParentReleaseGateMarkers();
    recomputeChildAggregation();

    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21ClaimedByCanvasParent = false;
    state.completionLatched = false;
    state.finalCompletionLatched = false;
    state.degradedCompletionLatched = false;
    state.readyTextAllowed = false;
    state.readyTextClaimedByCanvasParent = false;
    state.generatedImage = false;
    state.graphicBox = false;
    state.webGL = false;
    state.visualPassClaimed = false;

    state.updatedAt = state.timestamp;

    return clonePlain(state);
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
      const dispatchPacket = composeEastDispatchPacket();
      publishEastDispatchPacket(dispatchPacket);
      dispatchEast(dispatchPacket);
    } else {
      acceptRelease(normalized);
    }

    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();

    return getReceipt();
  }

  function consumeRouteConductorReleasePacket(packet) {
    return runCanonicalParentSequence(packet, "DIRECT_ROUTE_CONDUCTOR");
  }

  function receiveRouteConductorReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
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
    classifyEastResponse(packet);
    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();
    return getCanvasStationSummary();
  }

  function receiveWestPacket(packet) {
    if (isObject(packet)) {
      state.lastChildPacket = clonePlain(packet);
      state.childPackets.push(clonePlain(packet));
      trimArray(state.childPackets, 60);

      state.westObserved = true;
      state.westApiReady = true;
      state.canvasWestInspectionReady = Boolean(
        packet.canvasWestInspectionReady === true ||
        packet.canvasWestEvidenceReady === true ||
        packet.f13nInspectionReady === true ||
        packet.inspectionReady === true ||
        state.canvasWestInspectionReady
      );
      state.canvasWestEvidenceReady = state.canvasWestInspectionReady;
    }

    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();
    return getCanvasStationSummary();
  }

  function receiveSouthPacket(packet) {
    if (isObject(packet)) {
      state.lastChildPacket = clonePlain(packet);
      state.childPackets.push(clonePlain(packet));
      trimArray(state.childPackets, 60);

      state.southObserved = true;
      state.southApiReady = true;
      state.canvasSouthHardFail = Boolean(packet.f13HardFail === true || packet.visibleContentHardFail === true);
      state.canvasSouthProofStale = Boolean(packet.visibleProofStale === true || packet.textureInvalidated === true);
      state.canvasSouthVisibleProofReady = Boolean(
        !state.canvasSouthHardFail &&
        !state.canvasSouthProofStale &&
        (
          packet.canvasSouthVisibleProofReady === true ||
          packet.canvasSouthEvidenceReady === true ||
          packet.visibleContentStrictProof === true ||
          packet.visiblePlanetAvailable === true ||
          packet.imageRendered === true ||
          state.canvasSouthVisibleProofReady
        )
      );
      state.canvasSouthEvidenceReady = state.canvasSouthVisibleProofReady;
    }

    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();
    return getCanvasStationSummary();
  }

  function receiveChildPacket(packet) {
    if (!isObject(packet)) return false;

    state.lastChildPacket = clonePlain(packet);
    state.childPackets.push(clonePlain(packet));
    trimArray(state.childPackets, 60);

    const sourceFile = safeString(packet.sourceFile || packet.file || "");
    const role = upperText(packet.childRole || packet.sourceRole || packet.role || packet.handoffFrom || packet.receivedFrom);

    if (sourceFile === EAST_FILE || role.includes("EAST")) {
      receiveEastPacket(packet);
    } else if (sourceFile === WEST_FILE || role.includes("WEST")) {
      receiveWestPacket(packet);
    } else if (sourceFile === SOUTH_FILE || role.includes("SOUTH")) {
      receiveSouthPacket(packet);
    } else {
      recomputeParentState();
      updateDataset();
      publishGlobals();
      notifyRouteConductor();
    }

    return true;
  }

  function getCanvasStationSummary() {
    recomputeParentState();

    const summary = {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CANVAS_LOCAL_STATION_SUMMARY",
      file: FILE,
      route: ROUTE,

      canvasLocalStationActive: true,
      childDistributionSwitchboardActive: true,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentIsV11_1: true,
      baselineCanvasParentContract: BASELINE_CONTRACT,
      canvasParentBootMethodAvailable: true,

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
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,

      parentReleasePacketComposed: state.parentReleasePacketComposed,
      parentReleasePacketPublishedForEast: state.parentReleasePacketPublishedForEast,
      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      eastDispatchAttempted: state.eastDispatchAttempted,
      eastDispatchMethod: state.eastDispatchMethod,
      handoffTo: state.handoffTo,

      canvasEastApiReady: state.eastApiReady,
      canvasEastRequiredMethodsPresent: state.eastRequiredMethodsPresent,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastF13AtlasPacketReady: state.canvasEastF13AtlasPacketReady,
      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasEastFalsePromotionBlocked: state.canvasEastFalsePromotionBlocked,
      eastResponseClass: state.eastResponseClass,

      canvasWestApiReady: state.westApiReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasWestEvidenceReady: state.canvasWestEvidenceReady,

      canvasSouthApiReady: state.southApiReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      canvasSouthEvidenceReady: state.canvasSouthEvidenceReady,
      canvasSouthHardFail: state.canvasSouthHardFail,
      canvasSouthProofStale: state.canvasSouthProofStale,

      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      canvasNextAuditTarget: state.canvasNextAuditTarget,
      postgameStatus: state.postgameStatus,

      routeConductorShouldConsumeThisSummary: true,
      routeConductorShouldNotScanChildrenDirectlyAfterV9: true,

      ...FINAL_FALSE
    };

    state.lastCanvasStationSummary = clonePlain(summary);
    return summary;
  }

  function getCanvasStationReceiptLight() {
    return getCanvasStationSummary();
  }

  function getCanvasStationReceipt() {
    return {
      ...getCanvasStationSummary(),
      packetType: "CANVAS_LOCAL_STATION_RECEIPT",
      routeConductorReleasePacket: clonePlain(state.routeConductorReleasePacket),
      normalizedReleasePacket: clonePlain(state.normalizedReleasePacket),
      lastEastDispatchPacket: getLastEastDispatchPacket(),
      lastEastReceipt: clonePlain(state.lastEastReceipt),
      lastWestReceipt: clonePlain(state.lastWestReceipt),
      lastSouthReceipt: clonePlain(state.lastSouthReceipt)
    };
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
      role: "canvas-local-station-structural-carrier",

      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      canvasParentBootMethodAvailable: true,

      canvasLocalStationActive: true,
      childDistributionSwitchboardActive: true,
      releaseAcceptanceActive: true,
      eastDispatchActive: true,
      canvasChildAggregationActive: true,

      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,

      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,

      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,

      canvasEastApiReady: state.eastApiReady,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasWestApiReady: state.westApiReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasSouthApiReady: state.southApiReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,

      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      ...FINAL_FALSE
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

  function getReceiptLight() {
    return {
      ...getCanvasStationSummary(),
      currentReceiptLight: true
    };
  }

  function getReceipt() {
    return {
      ...getCanvasStationReceipt(),
      currentReceipt: true,
      structuralCarrier: getStructuralCarrier(),
      childPackets: clonePlain(state.childPackets),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors)
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getCanvasStationSummary();

    return [
      "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", PREVIOUS_CONTRACT),
      line("previousReceipt", PREVIOUS_RECEIPT),
      line("baselineContract", BASELINE_CONTRACT),
      line("baselineReceipt", BASELINE_RECEIPT),
      line("file", FILE),
      line("route", ROUTE),
      line("role", state.role),
      "",
      line("canvasLocalStationActive", true),
      line("childDistributionSwitchboardActive", true),
      line("releaseAcceptanceActive", true),
      line("eastDispatchActive", true),
      line("canvasChildAggregationActive", true),
      line("routeConductorSummarySurfaceActive", true),
      "",
      line("currentCanvasParentObserved", r.currentCanvasParentObserved),
      line("currentCanvasParentContractObserved", r.currentCanvasParentContractObserved),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("currentCanvasParentIsV11_1", r.currentCanvasParentIsV11_1),
      line("canvasParentBootMethodAvailable", r.canvasParentBootMethodAvailable),
      "",
      line("releasePacketObserved", r.releasePacketObserved),
      line("releasePacketValid", r.releasePacketValid),
      line("releasePacketAccepted", r.releasePacketAccepted),
      line("acceptedReleaseSource", r.acceptedReleaseSource),
      line("releasePacketIntakeMethod", r.releasePacketIntakeMethod),
      line("releaseValidationFailures", state.releaseValidationFailures.join(",") || "none"),
      "",
      line("canvasParentReleaseObserved", r.canvasParentReleaseObserved),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted),
      line("canvasParentReleaseLawful", r.canvasParentReleaseLawful),
      line("parentReleaseLawful", r.parentReleaseLawful),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("canvasReleasePacketReady", r.canvasReleasePacketReady),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason),
      line("canvasParentReleaseGateReady", r.canvasParentReleaseGateReady),
      line("parentAcceptedRouteConductorRelease", r.parentAcceptedRouteConductorRelease),
      "",
      line("parentReleasePacketComposed", r.parentReleasePacketComposed),
      line("parentReleasePacketPublishedForEast", r.parentReleasePacketPublishedForEast),
      line("parentReleasePacketSentToEast", r.parentReleasePacketSentToEast),
      line("parentReleasePacketLawful", r.parentReleasePacketLawful),
      line("eastDispatchAuthorized", r.eastDispatchAuthorized),
      line("eastDispatchPacketPublished", r.eastDispatchPacketPublished),
      line("eastDispatchAttempted", r.eastDispatchAttempted),
      line("eastDispatchMethod", r.eastDispatchMethod),
      "",
      line("canvasEastApiReady", r.canvasEastApiReady),
      line("canvasEastRequiredMethodsPresent", r.canvasEastRequiredMethodsPresent),
      line("canvasEastEvidenceReady", r.canvasEastEvidenceReady),
      line("canvasEastF13AtlasPacketReady", r.canvasEastF13AtlasPacketReady),
      line("canvasEastHeldPacketRecognized", r.canvasEastHeldPacketRecognized),
      line("canvasEastFalsePromotionBlocked", r.canvasEastFalsePromotionBlocked),
      line("eastResponseClass", r.eastResponseClass),
      "",
      line("canvasWestApiReady", r.canvasWestApiReady),
      line("canvasWestInspectionReady", r.canvasWestInspectionReady),
      line("canvasWestEvidenceReady", r.canvasWestEvidenceReady),
      "",
      line("canvasSouthApiReady", r.canvasSouthApiReady),
      line("canvasSouthVisibleProofReady", r.canvasSouthVisibleProofReady),
      line("canvasSouthEvidenceReady", r.canvasSouthEvidenceReady),
      line("canvasSouthHardFail", r.canvasSouthHardFail),
      line("canvasSouthProofStale", r.canvasSouthProofStale),
      "",
      line("allCanvasChildrenApiReady", r.allCanvasChildrenApiReady),
      line("allCanvasChildrenEvidenceReady", r.allCanvasChildrenEvidenceReady),
      line("allCanvasChildrenReady", r.allCanvasChildrenReady),
      "",
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable),
      line("f13InspectEvidenceAvailable", r.f13InspectEvidenceAvailable),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      line("f13StrictEvidenceRepairTarget", r.f13StrictEvidenceRepairTarget),
      "",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("canvasNextAuditTarget", r.canvasNextAuditTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      line("getLastEastDispatchPacketAvailable", true),
      line("routeConductorShouldConsumeThisSummary", true),
      line("routeConductorShouldNotScanChildrenDirectlyAfterV9", true),
      "",
      line("f21EligibleForNorth", false),
      line("f21SubmittedToNorth", false),
      line("completionLatched", false),
      line("readyTextAllowed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasLocalStationActive", "true");
    setDataset("hearthCanvasChildDistributionSwitchboardActive", "true");
    setDataset("hearthCanvasParentV11_1Active", "true");
    setDataset("hearthCanvasParentV11Superseded", "true");
    setDataset("hearthCanvasParentV10_3BaselineRecognized", "true");

    setDataset("hearthCanvasCurrentCanvasParentObserved", "true");
    setDataset("hearthCanvasCurrentCanvasParentContractObserved", "true");
    setDataset("hearthCanvasCurrentCanvasParentContract", CONTRACT);
    setDataset("hearthCanvasParentBootMethodAvailable", "true");

    setDataset("hearthCanvasReleasePacketObserved", String(state.releasePacketObserved));
    setDataset("hearthCanvasReleasePacketValid", String(state.releasePacketValid));
    setDataset("hearthCanvasReleasePacketAccepted", String(state.releasePacketAccepted));
    setDataset("hearthCanvasAcceptedReleaseSource", state.acceptedReleaseSource);
    setDataset("hearthCanvasReleasePacketIntakeMethod", state.releasePacketIntakeMethod);

    setDataset("hearthCanvasParentReleaseObserved", String(state.canvasParentReleaseObserved));
    setDataset("hearthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthCanvasParentReleaseLawful", String(state.canvasParentReleaseLawful));
    setDataset("hearthCanvasParentReleaseGateReady", String(state.canvasParentReleaseGateReady));
    setDataset("hearthCanvasParentAcceptedRouteConductorRelease", String(state.parentAcceptedRouteConductorRelease));
    setDataset("hearthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthCanvasReleasePacketReady", String(state.canvasReleasePacketReady));
    setDataset("hearthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);

    setDataset("hearthCanvasParentReleasePacketComposed", String(state.parentReleasePacketComposed));
    setDataset("hearthCanvasParentReleasePacketPublishedForEast", String(state.parentReleasePacketPublishedForEast));
    setDataset("hearthCanvasParentReleasePacketSentToEast", String(state.parentReleasePacketSentToEast));
    setDataset("hearthCanvasParentReleasePacketLawful", String(state.parentReleasePacketLawful));
    setDataset("hearthCanvasEastDispatchAuthorized", String(state.eastDispatchAuthorized));
    setDataset("hearthCanvasEastDispatchPacketPublished", String(state.eastDispatchPacketPublished));
    setDataset("hearthCanvasEastDispatchAttempted", String(state.eastDispatchAttempted));
    setDataset("hearthCanvasEastDispatchMethod", state.eastDispatchMethod);
    setDataset("hearthCanvasGetLastEastDispatchPacketAvailable", "true");

    setDataset("hearthCanvasEastObserved", String(state.eastObserved));
    setDataset("hearthCanvasEastApiReady", String(state.eastApiReady));
    setDataset("hearthCanvasEastRequiredMethodsPresent", String(state.eastRequiredMethodsPresent));
    setDataset("hearthCanvasEastEvidenceReady", String(state.canvasEastEvidenceReady));
    setDataset("hearthCanvasEastF13AtlasPacketReady", String(state.canvasEastF13AtlasPacketReady));
    setDataset("hearthCanvasEastHeldPacketRecognized", String(state.canvasEastHeldPacketRecognized));
    setDataset("hearthCanvasEastFalsePromotionBlocked", String(state.canvasEastFalsePromotionBlocked));
    setDataset("hearthCanvasEastResponseClass", state.eastResponseClass);

    setDataset("hearthCanvasWestObserved", String(state.westObserved));
    setDataset("hearthCanvasWestApiReady", String(state.westApiReady));
    setDataset("hearthCanvasWestInspectionReady", String(state.canvasWestInspectionReady));
    setDataset("hearthCanvasWestEvidenceReady", String(state.canvasWestEvidenceReady));

    setDataset("hearthCanvasSouthObserved", String(state.southObserved));
    setDataset("hearthCanvasSouthApiReady", String(state.southApiReady));
    setDataset("hearthCanvasSouthVisibleProofReady", String(state.canvasSouthVisibleProofReady));
    setDataset("hearthCanvasSouthEvidenceReady", String(state.canvasSouthEvidenceReady));
    setDataset("hearthCanvasSouthHardFail", String(state.canvasSouthHardFail));
    setDataset("hearthCanvasSouthProofStale", String(state.canvasSouthProofStale));

    setDataset("hearthCanvasAllChildrenApiReady", String(state.allCanvasChildrenApiReady));
    setDataset("hearthCanvasAllChildrenEvidenceReady", String(state.allCanvasChildrenEvidenceReady));
    setDataset("hearthCanvasAllChildrenReady", String(state.allCanvasChildrenReady));

    setDataset("hearthCanvasF13ReadinessObserved", String(state.f13CanvasReadinessObserved));
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthCanvasF13InspectEvidenceAvailable", String(state.f13InspectEvidenceAvailable));
    setDataset("hearthCanvasF13EvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13CanvasEvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13HardFail", String(state.f13HardFail));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasNextAuditTarget", state.canvasNextAuditTarget);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvas = api;
    hearth.canvasParent = api;
    hearth.canvasNorth = api;
    hearth.canvasEvidence = api;
    hearth.canvasLocalStation = api;
    hearth.canvasStation = api;
    hearth.canvasChildDistributionSwitchboard = api;
    hearth.canvasParentReleaseAcceptanceEastDispatchSwitchboard = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD = api;
    root.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD = api;
    root.HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasChildDistributionSwitchboard = api;
    lab.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard = api;

    const light = getReceiptLight();
    const full = getReceipt();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT_v11_1 = full;
    root.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT = full;

    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasLocalStationReceipt = full;
    hearth.canvasStationReceipt = full;
    hearth.canvasChildDistributionSwitchboardReceipt = full;

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasLocalStationReceipt = full;
    lab.hearthCanvasStationReceipt = full;
    lab.hearthCanvasChildDistributionSwitchboardReceipt = full;

    hearth.canvasStructuralCarrier = getStructuralCarrier();
    hearth.canvasCarrier = getStructuralCarrier();
    hearth.canvasParentCarrier = getStructuralCarrier();

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_PARENT_CARRIER = getStructuralCarrier();

    if (state.lastEastDispatchPacket) {
      publishEastDispatchPacket(state.lastEastDispatchPacket);
    }

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function notifyRouteConductor() {
    const summary = getCanvasStationSummary();

    const candidates = [
      readPath("HEARTH.routeConductor"),
      readPath("HEARTH.southRouteConductor"),
      readPath("HEARTH.routeConductorCentralStationSwitchboardWestV42SouthOutputAlignment"),
      readPath("DEXTER_LAB.hearthRouteConductor"),
      readPath("DEXTER_LAB.hearthSouthRouteConductor"),
      readPath("DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardWestV42SouthOutputAlignment"),
      root.HEARTH_ROUTE_CONDUCTOR,
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR,
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT
    ];

    const methods = [
      "receiveCanvasStationSummary",
      "receiveCanvasLocalStationSummary",
      "receiveCanvasParentSummary",
      "reconcileCanvas",
      "refresh"
    ];

    for (const target of candidates) {
      if (!target || !isObject(target)) continue;

      for (const method of methods) {
        if (!isFunction(target[method])) continue;

        try {
          target[method](clonePlain(summary));
          state.routeConductorNotified = true;
          state.routeConductorNotifyMethod = method;
          state.routeConductorNotificationError = "";
          return true;
        } catch (error) {
          state.routeConductorNotificationError = error && error.message ? error.message : String(error);
          recordError("ROUTE_CONDUCTOR_NOTIFICATION_FAILED_NONBLOCKING", error, { method });
          return false;
        }
      }
    }

    state.routeConductorNotified = false;
    state.routeConductorNotifyMethod = "NONE";
    return false;
  }

  function updateDatasetAndReceipt() {
    recomputeParentState();
    updateDataset();
    publishGlobals();
    return getReceipt();
  }

  function bootAudit(options = {}) {
    state.timestamp = nowIso();

    publishGlobals();

    const rawPacket = readRouteConductorReleasePacket(options || {});

    if (rawPacket) {
      runCanonicalParentSequence(rawPacket, state.releasePacketIntakeMethod);
    } else {
      recomputeParentState();
      updateDataset();
      publishGlobals();
      notifyRouteConductor();
    }

    state.bootAuditComplete = true;

    record("CANVAS_LOCAL_STATION_BOOT_AUDIT_COMPLETE", {
      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      getLastEastDispatchPacketAvailable: true,
      canvasEastApiReady: state.eastApiReady,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      recommendedNextFile: state.recommendedNextFile,
      visualPassClaimed: false
    });

    return updateDatasetAndReceipt();
  }

  function boot(options = {}) {
    return bootAudit(options || {});
  }

  function init(options = {}) {
    return bootAudit(options || {});
  }

  function start(options = {}) {
    return bootAudit(options || {});
  }

  function mount(options = {}) {
    return bootAudit(options || {});
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,
    FILE,
    TARGET_FILE,
    ROUTE_FILE,
    INDEX_FILE,
    EAST_FILE,
    WEST_FILE,
    SOUTH_FILE,
    ROUTE,

    REQUIRED_RELEASE,
    RELEASE_SOURCE,
    CHILD_STATUS,
    EAST_RESULT_CLASS,
    CANVAS_CHILD_SEQUENCE,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    route: ROUTE,
    role: state.role,

    boot,
    init,
    start,
    mount,
    bootAudit,

    consumeRouteConductorReleasePacket,
    receiveRouteConductorReleasePacket,
    consumeReleasePacket,
    receiveReleasePacket,
    receiveCanvasReleasePacket,

    receiveChildPacket,
    receiveEastPacket,
    receiveWestPacket,
    receiveSouthPacket,

    readRouteConductorReleasePacket,
    normalizeReleasePacket,
    validateReleasePacket,
    acceptRelease,
    composeEastDispatchPacket,
    getLastEastDispatchPacket,
    publishEastDispatchPacket,
    dispatchEast,
    classifyEastResponse,

    readCanvasChild,
    scanEast,
    scanWest,
    scanSouth,
    recomputeChildAggregation,
    recomputeParentState,
    resolveF13Gap,

    getCanvasStationSummary,
    getCanvasStationReceipt,
    getCanvasStationReceiptLight,

    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,

    getReceipt,
    getReceiptLight,
    getReceiptText,

    publishGlobals,
    updateDataset,
    updateDatasetAndReceipt,
    notifyRouteConductor,

    supportsCanvasLocalStation: true,
    supportsChildDistributionSwitchboard: true,
    supportsRouteConductorReleasePacketIntake: true,
    supportsParentReleaseAcceptance: true,
    supportsEastDispatchPublication: true,
    supportsCanvasChildAggregation: true,
    supportsEastApiEvidenceSeparation: true,
    supportsHeldPacketDoesNotDemoteApi: true,
    supportsRouteConductorSummarySurface: true,
    supportsDatasetFallbackBlankPacketBlock: true,
    supportsLastEastDispatchPacketGetter: true,

    ownsCanvasParentIdentity: true,
    ownsRouteConductorReleasePacketIntake: true,
    ownsParentReleaseAcceptance: true,
    ownsEastDispatchPacket: true,
    ownsCanvasChildDiscovery: true,
    ownsCanvasChildAggregateReadiness: true,
    ownsCanvasStationSummary: true,

    ownsRouteConductorSwitching: false,
    ownsMacroWestAdmissibility: false,
    ownsEastAtlasTruth: false,
    ownsWestInspectionTruth: false,
    ownsSouthVisibleProofTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => bootAudit({}), { once: true });
      } else {
        bootAudit({});
      }
    } else {
      bootAudit({});
    }
  } catch (error) {
    recordError("CANVAS_LOCAL_STATION_INITIALIZATION_FAILED", error);

    try {
      publishGlobals();
      updateDataset();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
