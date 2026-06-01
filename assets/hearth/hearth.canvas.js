// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_PARENT_SWITCHBOARD_RELEASE_TO_EAST_TNT_v9
// Full-file replacement.
// Canvas parent / switchboard authority only.
// Purpose:
// - Renew Canvas parent from heavy parent/auditor into a clean Canvas-domain switchboard.
// - Accept only the route-conductor Canvas release packet as upstream release authority.
// - Retire operative local West fallback.
// - Publish structural carrier before East evidence.
// - Open East only after route-conductor release is accepted.
// - Treat East held packets as lawful held evidence, not API failure.
// - Receive East / West / South child receipts without becoming those children.
// - Preserve F13 Canvas-domain coordination only.
// - Block F21, ready text, completion latch, generated image, GraphicBox, WebGL, and final visual-pass claims.
//
// Owns:
// - Canvas parent structural carrier.
// - Parent boot/init/start/mount aliases.
// - Route-conductor release-packet intake.
// - Parent release acceptance / hold state.
// - East gate opening.
// - Parent release packet composition to East.
// - Child receipt intake.
// - Child status normalization.
// - F13 Canvas-domain coordination receipt.
// - Dataset and global publication.
// - False-promotion firewall.
//
// Does not own:
// - Lab West admissibility.
// - Route orchestration.
// - East atlas source truth.
// - Finger engine execution.
// - Material truth.
// - Elevation truth.
// - Hydrology truth.
// - Canvas West inspection truth.
// - Canvas South visible proof truth.
// - North F21 latch.
// - Ready text.
// - Final visual pass claim.
//
// No GraphicBox. No generated image. No WebGL. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_PARENT_SWITCHBOARD_RELEASE_TO_EAST_TNT_v9";
  const RECEIPT = "HEARTH_CANVAS_PARENT_SWITCHBOARD_RELEASE_TO_EAST_RECEIPT_v9";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_TNT_v8";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_RECEIPT_v8";

  const BASELINE_CONTRACT = PREVIOUS_CONTRACT;
  const BASELINE_RECEIPT = PREVIOUS_RECEIPT;

  const VERSION = "2026-06-01.hearth-canvas-parent-switchboard-release-to-east-v9";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";

  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";

  const ROUTE_CONDUCTOR_REQUIRED_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_TNT_v6";
  const ROUTE_CONDUCTOR_REQUIRED_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_RECEIPT_v6";

  const EAST_REQUIRED_CONTRACT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_TNT_v5";
  const EAST_REQUIRED_RECEIPT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT_v5";

  const CYCLE_NUMBER = 2;
  const CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const ACTIVE_FIBONACCI = "F13P";

  const RELEASE_SOURCE = Object.freeze({
    ROUTE_CONDUCTOR: "ROUTE_CONDUCTOR",
    NONE: "NONE"
  });

  const CHILD_STATUS = Object.freeze({
    MISSING: "MISSING",
    API_READY: "API_READY",
    HELD: "HELD",
    EVIDENCE_READY: "EVIDENCE_READY",
    FINGER_DISTRIBUTION_READY: "FINGER_DISTRIBUTION_READY",
    INSPECTION_READY: "INSPECTION_READY",
    VISIBLE_PROOF_READY: "VISIBLE_PROOF_READY",
    SOFT_PROOF: "SOFT_PROOF",
    BLOCKED: "BLOCKED",
    ERROR: "ERROR"
  });

  const EAST_RESULT_CLASS = Object.freeze({
    NOT_CALLED: "EAST_NOT_CALLED",
    API_MISSING: "EAST_API_MISSING",
    HELD_SYNCHRONOUS: "EAST_HELD_SYNCHRONOUS",
    ATLAS_EVIDENCE_READY: "EAST_ATLAS_EVIDENCE_READY",
    FINGER_DISTRIBUTION_READY: "EAST_FINGER_DISTRIBUTION_READY",
    FALSE_PROMOTION_BLOCKED: "EAST_FALSE_PROMOTION_BLOCKED",
    BUILD_ERROR: "EAST_BUILD_ERROR",
    PENDING_ASYNC: "EAST_PENDING_ASYNC"
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "canvas-parent-switchboard-release-to-east",

    canvasParentSwitchboardActive: true,
    canvasParentEngine: false,
    canvasParentAuditor: false,
    canvasParentSwitchboardOnly: true,

    routeConductorReleasePacketIntakeActive: true,
    routeConductorReleasePacketPrimary: true,
    routeConductorRequiredContract: ROUTE_CONDUCTOR_REQUIRED_CONTRACT,
    routeConductorRequiredReceipt: ROUTE_CONDUCTOR_REQUIRED_RECEIPT,

    localWestFallbackRetired: true,
    localWestReleaseUsed: false,
    acceptedReleaseSource: RELEASE_SOURCE.NONE,

    upstreamReleasePacketObserved: false,
    upstreamReleasePacketReady: false,
    upstreamReleaseAccepted: false,
    upstreamReleaseRejectedReason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    upstreamRouteConductorContract: "",
    upstreamRouteConductorReceipt: "",
    upstreamRouteConductorContractObserved: false,
    upstreamRouteConductorReceiptObserved: false,
    upstreamCanvasReleaseAuthorized: false,
    upstreamWestCanvasReleaseApproved: false,
    upstreamWestHardBlock: false,
    upstreamCarrierHostAdmissibilityReady: false,
    upstreamCarrierHostAdmissibilityPacketReady: false,
    upstreamIndexPairReady: false,
    upstreamIndexMacroWestCandidateReady: false,
    upstreamHandoffToCanvas: false,
    upstreamDestinationIsCanvas: false,
    upstreamCycleNumber: 0,
    upstreamCycleRoute: "",
    upstreamReceivedFrom: "",
    upstreamSourceFile: "",
    upstreamDestinationFile: "",
    upstreamTargetFile: "",
    upstreamFirstFailedCoordinate: "",
    upstreamRecommendedNextFile: "",
    upstreamRecommendedNextRenewalTarget: "",
    upstreamReleasePacket: null,
    upstreamReleaseObservedAt: "",

    structuralCarrierActive: true,
    structuralCarrierReady: true,
    structuralCarrierSafe: true,
    canvasParentCarrierSafe: true,
    structuralCarrierPublished: false,
    carrierPrecheckReady: true,
    bootMethodAvailable: true,
    mountMethodAvailable: true,
    initMethodAvailable: true,
    startMethodAvailable: true,
    getStructuralCarrierAvailable: true,
    readStructuralCarrierAvailable: true,
    getCanvasCarrierAvailable: true,
    getCarrierReceiptAvailable: true,
    structuralCarrierFirstPublishedAt: "",

    parentReleasePacketSentToEast: false,
    parentReleasePacketLawful: false,
    eastOpened: false,
    lastParentReleasePacketToEast: null,
    lastEastOpenResult: null,

    canvasEastObserved: false,
    canvasEastRequiredContractObserved: false,
    canvasEastApiReady: false,
    canvasEastStatus: CHILD_STATUS.MISSING,
    canvasEastHeldPacketRecognized: false,
    canvasEastHeldPacketWasSynchronous: false,
    canvasEastEvidenceReady: false,
    canvasEastFingerDistributionReady: false,
    canvasEastF13AtlasPacketReady: false,
    canvasEastFalsePromotionBlocked: false,
    canvasEastFirstFailedCoordinate: "WAITING_CANVAS_EAST_API",
    canvasEastRecommendedNextRenewalTarget: EAST_FILE,
    canvasEastReceipt: null,
    canvasEastLastPacket: null,
    canvasEastLastHeldPacket: null,
    canvasEastLastEvidencePacket: null,
    canvasEastLastError: "",

    canvasWestObserved: false,
    canvasWestApiReady: false,
    canvasWestInspectionReady: false,
    canvasWestStatus: CHILD_STATUS.MISSING,
    canvasWestReceipt: null,
    canvasWestFirstFailedCoordinate: "WAITING_CANVAS_WEST_INSPECTION",

    canvasSouthObserved: false,
    canvasSouthApiReady: false,
    canvasSouthVisibleProofReady: false,
    canvasSouthSoftProofReady: false,
    canvasSouthHardFail: false,
    canvasSouthStatus: CHILD_STATUS.MISSING,
    canvasSouthReceipt: null,
    canvasSouthFirstFailedCoordinate: "WAITING_CANVAS_SOUTH_VISIBLE_PROOF",

    fingerEngineLayerExpected: true,
    fingerEnginesOwnedByParent: false,
    eastOwnsFingerDistribution: true,
    eachFingerOwnsOwnEngine: true,

    allCanvasChildrenApiReady: false,
    allCanvasChildrenEvidenceReady: false,
    allCanvasChildrenReady: false,

    f13CanvasEvidenceComplete: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    f13StrictEvidenceRepairTarget: ROUTE_CONDUCTOR_FILE,

    cycleNumber: CYCLE_NUMBER,
    cycleRoute: CYCLE_ROUTE,
    activeFibonacci: ACTIVE_FIBONACCI,
    activeFibonacciRank: ACTIVE_FIBONACCI,
    activeStageId: "F13P_CANVAS_PARENT_SWITCHBOARD_RELEASE_TO_EAST",
    activeGearId: "hearth-canvas-parent-switchboard-release-to-east-f13p",
    activeNewsGate: "CANVAS",
    oneActiveGearAtATime: true,

    newsAlignmentProtocolActive: true,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,
    indexGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,
    northGateReady: false,

    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationSatisfied: 0,
    fibonacciSynchronizationExpected: 10,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21LatchMode: "BLOCKED_BY_CANVAS_PARENT",
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    f21ClaimedByCanvasParent: false,
    readyTextClaimedByCanvasParent: false,

    firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    recommendedNextFile: ROUTE_CONDUCTOR_FILE,
    recommendedNextRenewalTarget: ROUTE_CONDUCTOR_FILE,
    canvasNextAuditTarget: EAST_FILE,
    postgameStatus: "CANVAS_PARENT_SWITCHBOARD_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",

    lastBootAt: "",
    lastAuditAt: "",
    lastCarrierReadAt: "",
    lastReleaseAt: "",
    lastEastCallAt: "",
    publishedAt: "",
    updatedAt: "",
    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

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
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
    return fallback;
  }

  function anyTrue(...values) {
    return values.some((value) => safeBool(value, false));
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function firstString(...values) {
    const found = firstDefined(...values);
    return found === undefined ? "" : String(found);
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimArray(array, max = 160) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function objectValue(source, path, fallback = undefined) {
    if (!isObject(source)) return fallback;

    const parts = safeString(path).split(".");
    let cursor = source;

    for (const part of parts) {
      if (!cursor || !isObject(cursor) || cursor[part] === undefined || cursor[part] === null) {
        return fallback;
      }

      cursor = cursor[part];
    }

    return cursor;
  }

  function pathRead(path) {
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
      const found = pathRead(name);
      if (found) return found;
    }

    return null;
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function recordEvent(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_PARENT_SWITCHBOARD_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_PARENT_SWITCHBOARD_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 100);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceiptLight)) {
      try {
        const receipt = authority.getReceiptLight(false);
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isFunction(authority.getStatus)) {
      try {
        const status = authority.getStatus();
        if (isObject(status)) return status;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
  }

  function normalizeText(value = "") {
    return safeString(value).trim().toUpperCase();
  }

  function isCanvasDestination(packet = {}) {
    const handoffTo = normalizeText(firstString(
      packet.handoffTo,
      packet.destination,
      packet.target,
      packet.destinationCardinal,
      packet.targetCardinal
    ));

    const destinationFile = firstString(packet.destinationFile, packet.targetFile, "");
    const packetType = firstString(packet.packetType, "");

    return Boolean(
      handoffTo.includes("CANVAS") ||
      destinationFile === FILE ||
      destinationFile === "/assets/hearth/hearth.canvas.js" ||
      packetType === "CANVAS_RELEASE_PACKET" ||
      safeBool(packet.canvasReleaseReceived, false) ||
      safeBool(packet.releaseToCanvas, false)
    );
  }

  function getRouteConductorAuthority() {
    return firstGlobal([
      "HEARTH.routeConductorTwoFileNewsFibonacciCarrierHostConsumer",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "DEXTER_LAB.hearthRouteConductorTwoFileNewsFibonacciCarrierHostConsumer",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthSouthRouteConductor"
    ]);
  }

  function getEastAuthority() {
    return firstGlobal([
      "HEARTH.canvasEast",
      "HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
      "HEARTH.canvasEastParentFirstApiRecognitionBootstrap",
      "HEARTH.canvasEastCurrentParentRecognizedF13AtlasSource",
      "HEARTH.canvasEastGovernedF13AtlasSource",
      "HEARTH.canvasEastF13AtlasSourceChild",
      "HEARTH.canvasEastMaterialAtlasSourceMachine",
      "HEARTH_CANVAS_EAST",
      "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE",
      "HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP",
      "HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE",
      "HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE",
      "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE",
      "DEXTER_LAB.hearthCanvasEast",
      "DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
      "DEXTER_LAB.hearthCanvasEastParentFirstApiRecognitionBootstrap",
      "DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSource",
      "DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource",
      "DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild"
    ]);
  }

  function getCanvasWestAuthority() {
    return firstGlobal([
      "HEARTH.canvasWest",
      "HEARTH_CANVAS_WEST",
      "HEARTH.canvasWestReceipt",
      "HEARTH_CANVAS_WEST_RECEIPT",
      "DEXTER_LAB.hearthCanvasWest"
    ]);
  }

  function getCanvasSouthAuthority() {
    return firstGlobal([
      "HEARTH.canvasSouth",
      "HEARTH_CANVAS_SOUTH",
      "HEARTH.canvasSouthReceipt",
      "HEARTH_CANVAS_SOUTH_RECEIPT",
      "DEXTER_LAB.hearthCanvasSouth"
    ]);
  }

  function hasEastApi(authority) {
    return Boolean(
      authority &&
      (
        isFunction(authority.buildAtlas) ||
        isFunction(authority.open) ||
        isFunction(authority.receiveParentReleasePacket) ||
        isFunction(authority.receiveParentPacket)
      )
    );
  }

  function extractReleasePacket(options = {}) {
    if (!isObject(options)) return null;

    const candidates = [
      options.releasePacket,
      options.routeReleasePacket,
      options.canvasReleasePacket,
      options.preAuthorizedRelease,
      objectValue(options, "detail.releasePacket"),
      objectValue(options, "detail.canvasReleasePacket"),
      objectValue(options, "detail.routeReleasePacket"),
      objectValue(options, "raw.releasePacket"),
      objectValue(options, "raw.canvasReleasePacket")
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return candidate;
    }

    if (
      options.packetType === "CANVAS_RELEASE_PACKET" ||
      options.canvasReleaseAuthorized !== undefined ||
      options.westCanvasReleaseApproved !== undefined ||
      options.handoffTo === "CANVAS" ||
      options.destinationFile === FILE
    ) {
      return options;
    }

    return null;
  }

  function readRouteConductorPacket(options = {}) {
    const explicit = extractReleasePacket(options);
    if (explicit) return explicit;

    const conductor = getRouteConductorAuthority();
    const conductorReceipt = readReceipt(conductor);

    if (isObject(conductorReceipt)) {
      if (isObject(conductorReceipt.canvasReleasePacket)) return conductorReceipt.canvasReleasePacket;
      if (isObject(conductorReceipt.releasePacket)) return conductorReceipt.releasePacket;

      if (
        conductorReceipt.canvasReleaseAuthorized !== undefined ||
        conductorReceipt.westCanvasReleaseApproved !== undefined ||
        conductorReceipt.handoffTo === "CANVAS" ||
        conductorReceipt.destinationFile === FILE ||
        conductorReceipt.packetType === "CANVAS_RELEASE_PACKET"
      ) {
        return conductorReceipt;
      }
    }

    const explicitGlobal = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET",
      "HEARTH.routeConductorCanvasReleasePacket",
      "HEARTH.southRouteConductorCanvasReleasePacket",
      "DEXTER_LAB.hearthRouteConductorCanvasReleasePacket"
    ]);

    if (isObject(explicitGlobal)) return explicitGlobal;

    const datasetPacket = {
      contract: datasetValue("hearthRouteConductorContract", ""),
      receipt: datasetValue("hearthRouteConductorReceipt", ""),
      sourceFile: ROUTE_CONDUCTOR_FILE,
      destinationFile: FILE,
      targetFile: FILE,
      handoffTo: datasetValue("hearthSouthHandoffTo", "") || datasetValue("hearthRouteConductorHandoffTo", ""),
      cycleNumber: safeNumber(datasetValue("hearthSouthActiveCycleNumber", datasetValue("hearthCanvasUpstreamCycleNumber", 0)), 0),
      cycleRoute: datasetValue("hearthSouthActiveCycleRoute", datasetValue("hearthCanvasUpstreamCycleRoute", "")),
      canvasReleaseAuthorized: anyTrue(
        datasetValue("hearthRouteConductorCanvasReleaseAuthorized", ""),
        datasetValue("hearthSouthCanvasReleaseAuthorized", "")
      ),
      westCanvasReleaseApproved: anyTrue(
        datasetValue("hearthSouthWestCanvasReleaseApproved", ""),
        datasetValue("hearthRouteConductorWestCanvasReleaseApproved", "")
      ),
      westHardBlock: anyTrue(
        datasetValue("hearthSouthWestHardBlock", ""),
        datasetValue("hearthRouteConductorWestHardBlock", "")
      ),
      carrierHostAdmissibilityReady: anyTrue(
        datasetValue("hearthSouthCarrierHostAdmissibilityReady", ""),
        datasetValue("hearthCarrierHostAdmissibilityReady", "")
      ),
      carrierHostAdmissibilityPacketReady: anyTrue(
        datasetValue("hearthSouthCarrierHostAdmissibilityPacketReady", ""),
        datasetValue("hearthCarrierHostAdmissibilityPacketReady", "")
      ),
      indexPairReady: anyTrue(
        datasetValue("hearthSouthIndexPairReady", ""),
        datasetValue("hearthIndexPairReady", ""),
        datasetValue("hearthIndexHandoffToRouteConductor", "")
      ),
      indexMacroWestCandidateReady: anyTrue(
        datasetValue("hearthSouthIndexMacroWestCandidateReady", ""),
        datasetValue("hearthIndexMacroWestCandidateReady", "")
      ),
      firstFailedCoordinate: datasetValue("hearthSouthFirstFailedCoordinate", ""),
      recommendedNextFile: datasetValue("hearthSouthRecommendedNextFile", ""),
      recommendedNextRenewalTarget: datasetValue("hearthSouthRecommendedNextRenewalTarget", "")
    };

    const hasDatasetSignal = Boolean(
      datasetPacket.canvasReleaseAuthorized ||
      datasetPacket.westCanvasReleaseApproved ||
      datasetPacket.carrierHostAdmissibilityReady ||
      datasetPacket.indexPairReady ||
      datasetPacket.contract
    );

    return hasDatasetSignal ? datasetPacket : null;
  }

  function validateRouteConductorRelease(packet = {}) {
    if (!isObject(packet)) {
      return {
        observed: false,
        accepted: false,
        reason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET"
      };
    }

    const contract = firstString(
      packet.contract,
      packet.sourceContract,
      packet.routeConductorContract,
      objectValue(packet, "macroWestAdmissibility.contract")
    );

    const receipt = firstString(
      packet.receipt,
      packet.sourceReceipt,
      packet.routeConductorReceipt
    );

    const canvasReleaseAuthorized = anyTrue(
      packet.canvasReleaseAuthorized,
      packet.canvasReleaseApproved,
      packet.canvasReleaseReceived,
      packet.releaseToCanvas
    );

    const westCanvasReleaseApproved = anyTrue(
      packet.westCanvasReleaseApproved,
      packet.westAuditAccepted,
      packet.westAuditApproved,
      packet.westAuditPassed,
      packet.westForwardAllowed,
      packet.forwardAllowed,
      objectValue(packet, "macroWestAdmissibility.westCanvasReleaseApproved"),
      objectValue(packet, "macroWestAdmissibility.westForwardAllowed")
    );

    const westHardBlock = anyTrue(
      packet.westHardBlock,
      packet.westAuditBlocked,
      packet.hardBlock,
      objectValue(packet, "macroWestAdmissibility.westHardBlock")
    );

    const carrierHostAdmissibilityReady = anyTrue(
      packet.carrierHostAdmissibilityReady,
      packet.carrierHostAdmissible,
      objectValue(packet, "proofBody.carrierHostAdmissibilityProof.ready")
    );

    const carrierHostAdmissibilityPacketReady = anyTrue(
      packet.carrierHostAdmissibilityPacketReady,
      packet.carrierHostAdmissibilityPacketPublished,
      packet.routeConductorHandoffPacketReady
    );

    const indexPairReady = anyTrue(
      packet.indexPairReady,
      packet.indexHandoffToRouteConductor,
      objectValue(packet, "proofBody.indexPairProof.ready")
    );

    const indexMacroWestCandidateReady = anyTrue(
      packet.indexMacroWestCandidateReady,
      packet.indexHandoffToRouteConductor
    );

    const destinationIsCanvas = isCanvasDestination(packet);
    const handoffToCanvas = normalizeText(firstString(packet.handoffTo, packet.destination, packet.target)).includes("CANVAS");

    const cycleNumber = safeNumber(firstDefined(packet.cycleNumber, packet.activeCycleNumber), 0);
    const cycleRoute = firstString(packet.cycleRoute, packet.activeCycleRoute);

    const cycleValid = Boolean(
      cycleNumber === CYCLE_NUMBER ||
      cycleRoute === CYCLE_ROUTE ||
      !cycleNumber && !cycleRoute && destinationIsCanvas
    );

    const accepted = Boolean(
      canvasReleaseAuthorized &&
      westCanvasReleaseApproved &&
      !westHardBlock &&
      carrierHostAdmissibilityReady &&
      indexPairReady &&
      destinationIsCanvas &&
      cycleValid
    );

    const reason = accepted
      ? "NONE_ROUTE_CONDUCTOR_RELEASE_ACCEPTED"
      : !canvasReleaseAuthorized
        ? "WAITING_UPSTREAM_CANVAS_RELEASE_AUTHORIZATION"
        : !westCanvasReleaseApproved
          ? "WAITING_UPSTREAM_WEST_CANVAS_RELEASE_APPROVAL"
          : westHardBlock
            ? "UPSTREAM_WEST_HARD_BLOCK"
            : !carrierHostAdmissibilityReady
              ? "WAITING_UPSTREAM_CARRIER_HOST_ADMISSIBILITY"
              : !indexPairReady
                ? "WAITING_UPSTREAM_INDEX_PAIR_READY"
                : !destinationIsCanvas
                  ? "WAITING_UPSTREAM_HANDOFF_TO_CANVAS"
                  : !cycleValid
                    ? "WAITING_UPSTREAM_CYCLE_TWO_CANVAS_ROUTE"
                    : "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";

    return {
      observed: true,
      accepted,
      reason,
      contract,
      receipt,
      canvasReleaseAuthorized,
      westCanvasReleaseApproved,
      westHardBlock,
      carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady,
      indexPairReady,
      indexMacroWestCandidateReady,
      destinationIsCanvas,
      handoffToCanvas: handoffToCanvas || destinationIsCanvas,
      cycleNumber,
      cycleRoute,
      packet: clonePlain(packet)
    };
  }

  function consumeRouteConductorRelease(packet = {}, source = "unknown") {
    const validation = validateRouteConductorRelease(packet);

    state.upstreamReleasePacketObserved = validation.observed;
    state.upstreamReleasePacketReady = Boolean(
      validation.canvasReleaseAuthorized ||
      validation.westCanvasReleaseApproved ||
      validation.destinationIsCanvas
    );

    state.upstreamReleaseAccepted = validation.accepted;
    state.upstreamReleaseRejectedReason = validation.reason;

    state.upstreamRouteConductorContract = validation.contract || "";
    state.upstreamRouteConductorReceipt = validation.receipt || "";
    state.upstreamRouteConductorContractObserved = Boolean(validation.contract);
    state.upstreamRouteConductorReceiptObserved = Boolean(validation.receipt);
    state.upstreamCanvasReleaseAuthorized = Boolean(validation.canvasReleaseAuthorized);
    state.upstreamWestCanvasReleaseApproved = Boolean(validation.westCanvasReleaseApproved);
    state.upstreamWestHardBlock = Boolean(validation.westHardBlock);
    state.upstreamCarrierHostAdmissibilityReady = Boolean(validation.carrierHostAdmissibilityReady);
    state.upstreamCarrierHostAdmissibilityPacketReady = Boolean(validation.carrierHostAdmissibilityPacketReady);
    state.upstreamIndexPairReady = Boolean(validation.indexPairReady);
    state.upstreamIndexMacroWestCandidateReady = Boolean(validation.indexMacroWestCandidateReady);
    state.upstreamHandoffToCanvas = Boolean(validation.handoffToCanvas);
    state.upstreamDestinationIsCanvas = Boolean(validation.destinationIsCanvas);
    state.upstreamCycleNumber = validation.cycleNumber || 0;
    state.upstreamCycleRoute = validation.cycleRoute || "";
    state.upstreamReceivedFrom = firstString(packet.receivedFrom, packet.sourceCardinal, packet.source);
    state.upstreamSourceFile = firstString(packet.sourceFile);
    state.upstreamDestinationFile = firstString(packet.destinationFile);
    state.upstreamTargetFile = firstString(packet.targetFile);
    state.upstreamFirstFailedCoordinate = firstString(packet.firstFailedCoordinate);
    state.upstreamRecommendedNextFile = firstString(packet.recommendedNextFile);
    state.upstreamRecommendedNextRenewalTarget = firstString(packet.recommendedNextRenewalTarget);
    state.upstreamReleasePacket = validation.packet || null;
    state.upstreamReleaseObservedAt = validation.observed ? nowIso() : "";

    state.acceptedReleaseSource = validation.accepted ? RELEASE_SOURCE.ROUTE_CONDUCTOR : RELEASE_SOURCE.NONE;
    state.localWestReleaseUsed = false;

    recordEvent("CANVAS_PARENT_SWITCHBOARD_ROUTE_CONDUCTOR_RELEASE_CONSUMED", {
      source,
      observed: validation.observed,
      accepted: validation.accepted,
      reason: validation.reason,
      routeConductorContract: validation.contract,
      canvasReleaseAuthorized: validation.canvasReleaseAuthorized,
      westCanvasReleaseApproved: validation.westCanvasReleaseApproved,
      westHardBlock: validation.westHardBlock,
      carrierHostAdmissibilityReady: validation.carrierHostAdmissibilityReady,
      indexPairReady: validation.indexPairReady,
      destinationIsCanvas: validation.destinationIsCanvas,
      localWestReleaseUsed: false,
      visualPassClaimed: false
    });

    recomputeParentState();
    return validation;
  }

  function consumeReleaseFromOptions(options = {}, source = "options") {
    const packet = readRouteConductorPacket(options);
    if (!packet) {
      state.upstreamReleaseRejectedReason = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      recomputeParentState();
      return {
        observed: false,
        accepted: false,
        reason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET"
      };
    }

    return consumeRouteConductorRelease(packet, source);
  }

  function hasFalsePromotion(packet = {}) {
    if (!isObject(packet)) return false;

    let text = "";
    try {
      text = JSON.stringify(packet);
    } catch (_error) {
      text = String(packet);
    }

    return Boolean(
      safeBool(packet.f21EligibleForNorth, false) ||
      safeBool(packet.f21SubmittedToNorth, false) ||
      safeBool(packet.f21EligibilitySubmittedToNorth, false) ||
      safeBool(packet.f21ClaimedByCanvasParent, false) ||
      safeBool(packet.f21ClaimedByCanvasEast, false) ||
      safeBool(packet.readyTextAllowed, false) ||
      safeBool(packet.readyTextClaimedByCanvasParent, false) ||
      safeBool(packet.readyTextClaimedByCanvasEast, false) ||
      safeBool(packet.completionLatched, false) ||
      safeBool(packet.finalCompletionLatched, false) ||
      safeBool(packet.degradedCompletionLatched, false) ||
      safeBool(packet.visualPassClaimed, false) ||
      safeBool(packet.generatedImage, false) ||
      safeBool(packet.graphicBox, false) ||
      safeBool(packet.webGL, false) ||
      safeBool(packet.webgl, false) ||
      text.includes('"visualPassClaimed":true') ||
      text.includes("visualPassClaimed=true") ||
      text.includes('"completionLatched":true') ||
      text.includes("completionLatched=true") ||
      text.includes('"readyTextAllowed":true') ||
      text.includes("readyTextAllowed=true") ||
      text.includes('"f21EligibleForNorth":true') ||
      text.includes("f21EligibleForNorth=true")
    );
  }

  function composeStructuralCarrier(input = {}) {
    const at = nowIso();

    if (!state.structuralCarrierFirstPublishedAt) {
      state.structuralCarrierFirstPublishedAt = at;
    }

    state.structuralCarrierPublished = true;
    state.lastCarrierReadAt = at;

    const carrier = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: "canvas-parent-switchboard-structural-carrier",

      canvasParentSwitchboardActive: true,
      canvasParentEngine: false,
      canvasParentAuditor: false,
      canvasParentSwitchboardOnly: true,

      structuralCarrierActive: true,
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,
      carrierPrecheckReady: true,

      bootMethodAvailable: true,
      mountMethodAvailable: true,
      initMethodAvailable: true,
      startMethodAvailable: true,
      getStructuralCarrierAvailable: true,
      readStructuralCarrierAvailable: true,
      getCanvasCarrierAvailable: true,
      getCarrierReceiptAvailable: true,

      routeConductorReleasePacketIntakeActive: true,
      routeConductorReleasePacketPrimary: true,
      localWestFallbackRetired: true,
      localWestReleaseUsed: false,
      acceptedReleaseSource: state.acceptedReleaseSource,

      upstreamReleasePacketObserved: state.upstreamReleasePacketObserved,
      upstreamReleaseAccepted: state.upstreamReleaseAccepted,
      upstreamReleaseRejectedReason: state.upstreamReleaseRejectedReason,
      upstreamCanvasReleaseAuthorized: state.upstreamCanvasReleaseAuthorized,
      upstreamWestCanvasReleaseApproved: state.upstreamWestCanvasReleaseApproved,
      upstreamWestHardBlock: state.upstreamWestHardBlock,
      upstreamCarrierHostAdmissibilityReady: state.upstreamCarrierHostAdmissibilityReady,
      upstreamIndexPairReady: state.upstreamIndexPairReady,
      upstreamDestinationIsCanvas: state.upstreamDestinationIsCanvas,

      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      eastOpened: state.eastOpened,

      fingerEngineLayerExpected: true,
      fingerEnginesOwnedByParent: false,
      eastOwnsFingerDistribution: true,
      eachFingerOwnsOwnEngine: true,

      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13HardFail: state.f13HardFail,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      input: clonePlain(input),
      createdAt: at
    };

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = carrier;
    root.HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER = carrier;
    root.HEARTH_CANVAS_CARRIER_RECEIPT = carrier;

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.canvasStructuralCarrier = carrier;
    root.HEARTH.canvasParentStructuralCarrier = carrier;
    root.HEARTH.canvasCarrierReceipt = carrier;

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthCanvasStructuralCarrier = carrier;
    root.DEXTER_LAB.hearthCanvasParentStructuralCarrier = carrier;
    root.DEXTER_LAB.hearthCanvasCarrierReceipt = carrier;

    updateDataset();
    return carrier;
  }

  function getStructuralCarrier(input = {}) {
    return composeStructuralCarrier(input);
  }

  function readStructuralCarrier(input = {}) {
    return composeStructuralCarrier(input);
  }

  function getCanvasCarrier(input = {}) {
    return composeStructuralCarrier(input);
  }

  function getCarrierReceipt(input = {}) {
    return composeStructuralCarrier(input);
  }

  function composeParentReleasePacketToEast(input = {}) {
    const releaseAccepted = state.upstreamReleaseAccepted === true;

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      activeParentContract: CONTRACT,
      activeParentReceipt: RECEIPT,
      previousParentContract: PREVIOUS_CONTRACT,
      baselineParentContract: BASELINE_CONTRACT,

      sourceFile: FILE,
      parentFile: FILE,
      targetFile: EAST_FILE,
      destinationFile: EAST_FILE,
      requestedChild: "east",
      handoffTo: "EAST",
      returnTo: "CANVAS_PARENT",
      receivedFrom: "CANVAS_PARENT",

      routeConductorReleasePacketIntakeActive: true,
      routeConductorReleasePacketPrimary: true,
      upstreamRouteConductorContract: state.upstreamRouteConductorContract || ROUTE_CONDUCTOR_REQUIRED_CONTRACT,
      upstreamRouteConductorReceipt: state.upstreamRouteConductorReceipt || ROUTE_CONDUCTOR_REQUIRED_RECEIPT,
      upstreamReleasePacketObserved: state.upstreamReleasePacketObserved,
      upstreamReleaseAccepted: state.upstreamReleaseAccepted,
      upstreamCanvasReleaseAuthorized: state.upstreamCanvasReleaseAuthorized,
      upstreamWestCanvasReleaseApproved: state.upstreamWestCanvasReleaseApproved,
      upstreamWestHardBlock: state.upstreamWestHardBlock,
      upstreamCarrierHostAdmissibilityReady: state.upstreamCarrierHostAdmissibilityReady,
      upstreamCarrierHostAdmissibilityPacketReady: state.upstreamCarrierHostAdmissibilityPacketReady,
      upstreamIndexPairReady: state.upstreamIndexPairReady,
      upstreamIndexMacroWestCandidateReady: state.upstreamIndexMacroWestCandidateReady,
      upstreamHandoffToCanvas: state.upstreamHandoffToCanvas,
      upstreamDestinationIsCanvas: state.upstreamDestinationIsCanvas,
      acceptedReleaseSource: state.acceptedReleaseSource,

      structuralCarrierActive: true,
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,
      carrierPrecheckReady: true,

      activeCycleNumber: CYCLE_NUMBER,
      cycleNumber: CYCLE_NUMBER,
      activeCycleRoute: CYCLE_ROUTE,
      cycleRoute: CYCLE_ROUTE,
      activeCardinal: "EAST",
      activeFibonacci: ACTIVE_FIBONACCI,
      activeFibonacciRank: ACTIVE_FIBONACCI,
      activeNewsGate: "CANVAS",

      parentReleaseLawful: releaseAccepted,
      parentReleasePacketLawful: releaseAccepted,
      canvasReleaseAuthorized: releaseAccepted,
      canvasReleaseApprovedByWest: state.upstreamWestCanvasReleaseApproved,
      westCanvasReleaseApproved: state.upstreamWestCanvasReleaseApproved,
      westAuditObserved: state.upstreamWestCanvasReleaseApproved,
      westAuditAccepted: state.upstreamWestCanvasReleaseApproved && !state.upstreamWestHardBlock,
      westAuditBlocked: state.upstreamWestHardBlock,
      releaseToCanvas: releaseAccepted,

      atlasBuildRequested: releaseAccepted,
      f13AtlasBuildRequested: releaseAccepted,
      buildAtlasRequested: releaseAccepted,
      async: true,
      nonBlocking: true,
      rowsPerChunk: 8,

      fingerEngineLayerExpected: true,
      fingerEnginesOwnedByParent: false,
      eastOwnsFingerDistribution: true,
      eachFingerOwnsOwnEngine: true,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21ClaimedByCanvasParent: false,
      readyTextAllowed: false,
      readyTextClaimedByCanvasParent: false,
      completionLatched: false,
      finalCompletionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      detail: clonePlain(input),
      upstreamReleasePacket: clonePlain(state.upstreamReleasePacket),
      createdAt: nowIso()
    };

    state.lastParentReleasePacketToEast = clonePlain(packet);
    state.parentReleasePacketSentToEast = true;
    state.parentReleasePacketLawful = releaseAccepted;
    state.lastReleaseAt = packet.createdAt;

    updateDataset();
    return packet;
  }

  function scanEastAuthority() {
    const east = getEastAuthority();
    const receipt = readReceipt(east) || {};

    const apiReady = Boolean(
      hasEastApi(east) ||
      safeBool(receipt.canvasEastApiReady, false) ||
      safeBool(receipt.requiredApiSurfaceComplete, false)
    );

    const requiredContractObserved = Boolean(
      firstString(east && east.contract, receipt.contract) === EAST_REQUIRED_CONTRACT ||
      firstString(east && east.receipt, receipt.receipt) === EAST_REQUIRED_RECEIPT ||
      safeBool(receipt.synchronousHeldPacketActive, false) ||
      safeBool(east && east.synchronousHeldPacketActive, false)
    );

    state.canvasEastObserved = Boolean(east || receipt.contract);
    state.canvasEastRequiredContractObserved = requiredContractObserved;
    state.canvasEastApiReady = apiReady;
    state.canvasEastReceipt = clonePlain(receipt || null);

    if (!apiReady) {
      state.canvasEastStatus = CHILD_STATUS.MISSING;
      state.canvasEastFirstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.canvasEastRecommendedNextRenewalTarget = EAST_FILE;
    } else if (!state.canvasEastEvidenceReady && !state.canvasEastHeldPacketRecognized && !state.canvasEastFingerDistributionReady) {
      state.canvasEastStatus = CHILD_STATUS.API_READY;
      state.canvasEastFirstFailedCoordinate = "WAITING_CANVAS_EAST_EVIDENCE_OR_HELD_PACKET";
      state.canvasEastRecommendedNextRenewalTarget = FILE;
    }

    updateDataset();
    return { authority: east, receipt, apiReady, requiredContractObserved };
  }

  function scanCanvasWestAuthority() {
    const west = getCanvasWestAuthority();
    const receipt = readReceipt(west) || {};

    const apiReady = Boolean(west || receipt.contract);
    const inspectionReady = Boolean(
      safeBool(receipt.canvasWestInspectionReady, false) ||
      safeBool(receipt.inspectionReady, false) ||
      safeBool(receipt.inspectModeAvailable, false) ||
      safeBool(receipt.f13InspectEvidenceAvailable, false)
    );

    const hardBlock = Boolean(
      safeBool(receipt.canvasWestHardBlock, false) ||
      safeBool(receipt.inspectionHardFail, false) ||
      safeBool(receipt.hardBlock, false)
    );

    state.canvasWestObserved = Boolean(west || receipt.contract);
    state.canvasWestApiReady = apiReady;
    state.canvasWestInspectionReady = Boolean(inspectionReady && !hardBlock);
    state.canvasWestStatus = hardBlock
      ? CHILD_STATUS.BLOCKED
      : state.canvasWestInspectionReady
        ? CHILD_STATUS.INSPECTION_READY
        : apiReady
          ? CHILD_STATUS.API_READY
          : CHILD_STATUS.MISSING;
    state.canvasWestReceipt = clonePlain(receipt || null);
    state.canvasWestFirstFailedCoordinate = state.canvasWestInspectionReady
      ? "NONE_CANVAS_WEST_INSPECTION_READY"
      : hardBlock
        ? "CANVAS_WEST_INSPECTION_BLOCKED"
        : "WAITING_CANVAS_WEST_INSPECTION";

    updateDataset();
    return { authority: west, receipt, apiReady, inspectionReady: state.canvasWestInspectionReady };
  }

  function scanCanvasSouthAuthority() {
    const south = getCanvasSouthAuthority();
    const receipt = readReceipt(south) || {};

    const apiReady = Boolean(south || receipt.contract);

    const strictProof = Boolean(
      safeBool(receipt.canvasSouthVisibleProofReady, false) ||
      safeBool(receipt.visibleContentProof, false) ||
      safeBool(receipt.visibleContentStrictProof, false) ||
      safeBool(receipt.southVisibleProofReady, false) ||
      safeBool(receipt.southStrictProofObserved, false)
    );

    const softProof = Boolean(
      safeBool(receipt.canvasSouthSoftProofReady, false) ||
      safeBool(receipt.visibleContentSoftGap, false) ||
      safeBool(receipt.visibleForwardProgress, false) ||
      safeBool(receipt.southSoftProofReady, false) ||
      safeBool(receipt.southSoftProofObserved, false)
    );

    const hardFail = Boolean(
      safeBool(receipt.canvasSouthHardFail, false) ||
      safeBool(receipt.visibleContentHardFail, false) ||
      safeBool(receipt.southHardFailObserved, false) ||
      safeBool(receipt.f13HardFail, false)
    );

    state.canvasSouthObserved = Boolean(south || receipt.contract);
    state.canvasSouthApiReady = apiReady;
    state.canvasSouthVisibleProofReady = Boolean(strictProof && !hardFail);
    state.canvasSouthSoftProofReady = Boolean(softProof && !hardFail);
    state.canvasSouthHardFail = hardFail;
    state.canvasSouthStatus = hardFail
      ? CHILD_STATUS.BLOCKED
      : state.canvasSouthVisibleProofReady
        ? CHILD_STATUS.VISIBLE_PROOF_READY
        : state.canvasSouthSoftProofReady
          ? CHILD_STATUS.SOFT_PROOF
          : apiReady
            ? CHILD_STATUS.API_READY
            : CHILD_STATUS.MISSING;
    state.canvasSouthReceipt = clonePlain(receipt || null);
    state.canvasSouthFirstFailedCoordinate = state.canvasSouthVisibleProofReady
      ? "NONE_CANVAS_SOUTH_VISIBLE_PROOF_READY"
      : state.canvasSouthSoftProofReady
        ? "DEGRADED_CANVAS_SOUTH_SOFT_PROOF_READY"
        : hardFail
          ? "CANVAS_SOUTH_VISIBLE_PROOF_HARD_FAIL"
          : "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";

    updateDataset();
    return { authority: south, receipt, apiReady, visibleProofReady: state.canvasSouthVisibleProofReady };
  }

  function classifyEastPacket(packet = {}) {
    if (!isObject(packet)) {
      return {
        resultClass: EAST_RESULT_CLASS.BUILD_ERROR,
        status: CHILD_STATUS.ERROR,
        firstFailedCoordinate: "EAST_RETURNED_NON_OBJECT_PACKET",
        recommendedNextRenewalTarget: EAST_FILE
      };
    }

    if (hasFalsePromotion(packet)) {
      return {
        resultClass: EAST_RESULT_CLASS.FALSE_PROMOTION_BLOCKED,
        status: CHILD_STATUS.BLOCKED,
        firstFailedCoordinate: "EAST_FALSE_PROMOTION_BLOCKED",
        recommendedNextRenewalTarget: EAST_FILE
      };
    }

    const fingerDistributionReady = Boolean(
      safeBool(packet.fingerDistributionReady, false) ||
      safeBool(packet.fingerEngineDistributionReady, false) ||
      safeBool(packet.eastFingerDistributionReady, false) ||
      safeBool(packet.eachFingerOwnsOwnEngine, false) ||
      safeBool(packet.fingerEngineLayerReady, false)
    );

    const atlasReady = Boolean(
      safeBool(packet.f13AtlasPacketReady, false) ||
      safeBool(packet.canvasEastEvidenceReady, false) ||
      safeBool(packet.atlasBuildComplete, false) ||
      safeBool(packet.atlasReady, false) ||
      safeBool(packet.atlasCanvasPresent, false) ||
      packet.atlasCanvas ||
      packet.canvas
    );

    const held = Boolean(
      safeBool(packet.heldAtlasPacketReturned, false) ||
      safeBool(packet.synchronousHeldPacketActive, false) ||
      safeBool(packet.heldPacketWasSynchronous, false) ||
      safeString(packet.f13BuildBlockedReason, "") ||
      safeString(packet.firstFailedCoordinate, "").includes("WAITING")
    );

    const heldSync = Boolean(
      safeBool(packet.heldPacketWasSynchronous, false) ||
      (safeBool(packet.buildAtlasReturnedPromise, false) === false && held)
    );

    if (fingerDistributionReady) {
      return {
        resultClass: EAST_RESULT_CLASS.FINGER_DISTRIBUTION_READY,
        status: CHILD_STATUS.FINGER_DISTRIBUTION_READY,
        firstFailedCoordinate: "NONE_CANVAS_EAST_FINGER_DISTRIBUTION_READY",
        recommendedNextRenewalTarget: "FUTURE_FINGER_ENGINE_FILE"
      };
    }

    if (atlasReady) {
      return {
        resultClass: EAST_RESULT_CLASS.ATLAS_EVIDENCE_READY,
        status: CHILD_STATUS.EVIDENCE_READY,
        firstFailedCoordinate: "NONE_CANVAS_EAST_F13_ATLAS_EVIDENCE_READY",
        recommendedNextRenewalTarget: FILE
      };
    }

    if (held) {
      return {
        resultClass: EAST_RESULT_CLASS.HELD_SYNCHRONOUS,
        status: CHILD_STATUS.HELD,
        firstFailedCoordinate: safeString(packet.f13BuildBlockedReason, "") || safeString(packet.firstFailedCoordinate, "WAITING_CANVAS_EAST_ATLAS_EVIDENCE"),
        recommendedNextRenewalTarget: FILE,
        heldPacketWasSynchronous: heldSync
      };
    }

    return {
      resultClass: EAST_RESULT_CLASS.BUILD_ERROR,
      status: CHILD_STATUS.ERROR,
      firstFailedCoordinate: "WAITING_CANVAS_EAST_EVIDENCE_OR_HELD_PACKET",
      recommendedNextRenewalTarget: EAST_FILE
    };
  }

  function applyEastPacket(packet = {}, source = "unknown") {
    const classification = classifyEastPacket(packet);

    state.canvasEastObserved = true;
    state.canvasEastApiReady = true;
    state.canvasEastStatus = classification.status;
    state.canvasEastLastPacket = clonePlain({
      ...packet,
      atlasCanvas: packet && packet.atlasCanvas ? "[canvas]" : undefined,
      canvas: packet && packet.canvas ? "[canvas]" : undefined
    });

    state.canvasEastHeldPacketRecognized = classification.resultClass === EAST_RESULT_CLASS.HELD_SYNCHRONOUS;
    state.canvasEastHeldPacketWasSynchronous = Boolean(classification.heldPacketWasSynchronous);
    state.canvasEastEvidenceReady = classification.resultClass === EAST_RESULT_CLASS.ATLAS_EVIDENCE_READY;
    state.canvasEastFingerDistributionReady = classification.resultClass === EAST_RESULT_CLASS.FINGER_DISTRIBUTION_READY;
    state.canvasEastF13AtlasPacketReady = state.canvasEastEvidenceReady || safeBool(packet.f13AtlasPacketReady, false);
    state.canvasEastFalsePromotionBlocked = classification.resultClass === EAST_RESULT_CLASS.FALSE_PROMOTION_BLOCKED;
    state.canvasEastFirstFailedCoordinate = classification.firstFailedCoordinate;
    state.canvasEastRecommendedNextRenewalTarget = classification.recommendedNextRenewalTarget;

    if (state.canvasEastHeldPacketRecognized) {
      state.canvasEastLastHeldPacket = clonePlain(state.canvasEastLastPacket);
    }

    if (state.canvasEastEvidenceReady || state.canvasEastFingerDistributionReady) {
      state.canvasEastLastEvidencePacket = clonePlain(state.canvasEastLastPacket);
    }

    if (state.canvasEastFalsePromotionBlocked) {
      state.f13HardFail = true;
      state.f13StrictEvidenceGap = "EAST_FALSE_PROMOTION_BLOCKED";
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
    }

    recordEvent("CANVAS_PARENT_SWITCHBOARD_EAST_PACKET_CLASSIFIED", {
      source,
      resultClass: classification.resultClass,
      status: classification.status,
      firstFailedCoordinate: classification.firstFailedCoordinate,
      heldPacketWasSynchronous: state.canvasEastHeldPacketWasSynchronous,
      eastEvidenceReady: state.canvasEastEvidenceReady,
      eastFingerDistributionReady: state.canvasEastFingerDistributionReady,
      visualPassClaimed: false
    });

    recomputeParentState();
    return classification;
  }

  function openEast(options = {}) {
    consumeReleaseFromOptions(options, "openEast-options");

    if (!state.upstreamReleaseAccepted) {
      state.eastOpened = false;
      state.lastEastOpenResult = {
        accepted: false,
        resultClass: EAST_RESULT_CLASS.NOT_CALLED,
        reason: state.upstreamReleaseRejectedReason || "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
        firstFailedCoordinate: state.upstreamReleaseRejectedReason || "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
        recommendedNextRenewalTarget: ROUTE_CONDUCTOR_FILE,
        visualPassClaimed: false
      };

      recomputeParentState();
      return clonePlain(state.lastEastOpenResult);
    }

    const scan = scanEastAuthority();
    const east = scan.authority;

    if (!scan.apiReady || !east) {
      state.eastOpened = false;
      state.lastEastOpenResult = {
        accepted: false,
        resultClass: EAST_RESULT_CLASS.API_MISSING,
        reason: "Canvas East API missing.",
        firstFailedCoordinate: "WAITING_CANVAS_EAST_API",
        recommendedNextRenewalTarget: EAST_FILE,
        visualPassClaimed: false
      };

      recomputeParentState();
      return clonePlain(state.lastEastOpenResult);
    }

    const releasePacket = composeParentReleasePacketToEast(options);

    state.eastOpened = true;
    state.lastEastCallAt = nowIso();

    let result = null;

    try {
      if (isFunction(east.receiveParentReleasePacket)) {
        result = east.receiveParentReleasePacket(releasePacket);
      } else if (isFunction(east.receiveParentPacket)) {
        result = east.receiveParentPacket(releasePacket);
      } else if (isFunction(east.open)) {
        result = east.open(releasePacket);
      } else if (isFunction(east.buildAtlas)) {
        result = east.buildAtlas(releasePacket);
      }
    } catch (error) {
      state.canvasEastStatus = CHILD_STATUS.ERROR;
      state.canvasEastLastError = error && error.message ? String(error.message) : String(error);
      state.canvasEastFirstFailedCoordinate = "EAST_OPEN_THROWN_ERROR";
      state.canvasEastRecommendedNextRenewalTarget = EAST_FILE;

      recordError("EAST_OPEN_THROWN_ERROR", error, {
        parentReleasePacketLawful: state.parentReleasePacketLawful,
        acceptedReleaseSource: state.acceptedReleaseSource
      });

      recomputeParentState();

      state.lastEastOpenResult = {
        accepted: false,
        resultClass: EAST_RESULT_CLASS.BUILD_ERROR,
        error: state.canvasEastLastError,
        firstFailedCoordinate: "EAST_OPEN_THROWN_ERROR",
        recommendedNextRenewalTarget: EAST_FILE,
        visualPassClaimed: false
      };

      return clonePlain(state.lastEastOpenResult);
    }

    if (result && isFunction(result.then)) {
      state.canvasEastStatus = CHILD_STATUS.API_READY;
      state.lastEastOpenResult = {
        accepted: true,
        resultClass: EAST_RESULT_CLASS.PENDING_ASYNC,
        buildAtlasReturnedPromise: true,
        firstFailedCoordinate: "WAITING_CANVAS_EAST_ASYNC_PACKET",
        recommendedNextRenewalTarget: FILE,
        visualPassClaimed: false
      };

      result
        .then((packet) => {
          applyEastPacket(packet, "east-async-resolution");
          publishGlobals();
          updateDataset();
        })
        .catch((error) => {
          state.canvasEastStatus = CHILD_STATUS.ERROR;
          state.canvasEastLastError = error && error.message ? String(error.message) : String(error);
          state.canvasEastFirstFailedCoordinate = "EAST_ASYNC_PACKET_REJECTED";
          state.canvasEastRecommendedNextRenewalTarget = EAST_FILE;
          recordError("EAST_ASYNC_PACKET_REJECTED", error);
          recomputeParentState();
          publishGlobals();
          updateDataset();
        });

      recomputeParentState();
      return clonePlain(state.lastEastOpenResult);
    }

    const classification = applyEastPacket(result || {}, "east-sync-return");

    state.lastEastOpenResult = {
      accepted: classification.resultClass !== EAST_RESULT_CLASS.BUILD_ERROR,
      resultClass: classification.resultClass,
      buildAtlasReturnedPromise: false,
      firstFailedCoordinate: classification.firstFailedCoordinate,
      recommendedNextRenewalTarget: classification.recommendedNextRenewalTarget,
      visualPassClaimed: false
    };

    return clonePlain(state.lastEastOpenResult);
  }

  function receiveEastPacket(packet = {}) {
    return applyEastPacket(packet, "receiveEastPacket");
  }

  function receiveWestPacket(packet = {}) {
    state.canvasWestObserved = true;
    state.canvasWestApiReady = true;
    state.canvasWestReceipt = clonePlain(packet);

    if (hasFalsePromotion(packet)) {
      state.canvasWestInspectionReady = false;
      state.canvasWestStatus = CHILD_STATUS.BLOCKED;
      state.canvasWestFirstFailedCoordinate = "CANVAS_WEST_FALSE_PROMOTION_BLOCKED";
    } else {
      const inspectionReady = Boolean(
        safeBool(packet.canvasWestInspectionReady, false) ||
        safeBool(packet.inspectionReady, false) ||
        safeBool(packet.inspectModeAvailable, false) ||
        safeBool(packet.f13InspectEvidenceAvailable, false) ||
        safeBool(packet.receiptToggleReady, false)
      );

      const hardBlock = Boolean(
        safeBool(packet.canvasWestHardBlock, false) ||
        safeBool(packet.inspectionHardFail, false) ||
        safeBool(packet.hardBlock, false)
      );

      state.canvasWestInspectionReady = Boolean(inspectionReady && !hardBlock);
      state.canvasWestStatus = hardBlock
        ? CHILD_STATUS.BLOCKED
        : state.canvasWestInspectionReady
          ? CHILD_STATUS.INSPECTION_READY
          : CHILD_STATUS.API_READY;
      state.canvasWestFirstFailedCoordinate = state.canvasWestInspectionReady
        ? "NONE_CANVAS_WEST_INSPECTION_READY"
        : hardBlock
          ? "CANVAS_WEST_INSPECTION_BLOCKED"
          : "WAITING_CANVAS_WEST_INSPECTION";
    }

    recordEvent("CANVAS_PARENT_SWITCHBOARD_WEST_RECEIPT_RECEIVED", {
      status: state.canvasWestStatus,
      inspectionReady: state.canvasWestInspectionReady,
      firstFailedCoordinate: state.canvasWestFirstFailedCoordinate,
      visualPassClaimed: false
    });

    recomputeParentState();
    return getReceiptLight();
  }

  function receiveSouthPacket(packet = {}) {
    state.canvasSouthObserved = true;
    state.canvasSouthApiReady = true;
    state.canvasSouthReceipt = clonePlain(packet);

    if (hasFalsePromotion(packet)) {
      state.canvasSouthVisibleProofReady = false;
      state.canvasSouthSoftProofReady = false;
      state.canvasSouthHardFail = true;
      state.canvasSouthStatus = CHILD_STATUS.BLOCKED;
      state.canvasSouthFirstFailedCoordinate = "CANVAS_SOUTH_FALSE_PROMOTION_BLOCKED";
    } else {
      const strictProof = Boolean(
        safeBool(packet.canvasSouthVisibleProofReady, false) ||
        safeBool(packet.visibleContentProof, false) ||
        safeBool(packet.visibleContentStrictProof, false) ||
        safeBool(packet.southVisibleProofReady, false) ||
        safeBool(packet.southStrictProofObserved, false)
      );

      const softProof = Boolean(
        safeBool(packet.canvasSouthSoftProofReady, false) ||
        safeBool(packet.visibleContentSoftGap, false) ||
        safeBool(packet.visibleForwardProgress, false) ||
        safeBool(packet.southSoftProofReady, false) ||
        safeBool(packet.southSoftProofObserved, false)
      );

      const hardFail = Boolean(
        safeBool(packet.canvasSouthHardFail, false) ||
        safeBool(packet.visibleContentHardFail, false) ||
        safeBool(packet.southHardFailObserved, false) ||
        safeBool(packet.f13HardFail, false)
      );

      state.canvasSouthVisibleProofReady = Boolean(strictProof && !hardFail);
      state.canvasSouthSoftProofReady = Boolean(softProof && !hardFail);
      state.canvasSouthHardFail = hardFail;
      state.canvasSouthStatus = hardFail
        ? CHILD_STATUS.BLOCKED
        : state.canvasSouthVisibleProofReady
          ? CHILD_STATUS.VISIBLE_PROOF_READY
          : state.canvasSouthSoftProofReady
            ? CHILD_STATUS.SOFT_PROOF
            : CHILD_STATUS.API_READY;
      state.canvasSouthFirstFailedCoordinate = state.canvasSouthVisibleProofReady
        ? "NONE_CANVAS_SOUTH_VISIBLE_PROOF_READY"
        : state.canvasSouthSoftProofReady
          ? "DEGRADED_CANVAS_SOUTH_SOFT_PROOF_READY"
          : hardFail
            ? "CANVAS_SOUTH_VISIBLE_PROOF_HARD_FAIL"
            : "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
    }

    recordEvent("CANVAS_PARENT_SWITCHBOARD_SOUTH_RECEIPT_RECEIVED", {
      status: state.canvasSouthStatus,
      visibleProofReady: state.canvasSouthVisibleProofReady,
      softProofReady: state.canvasSouthSoftProofReady,
      hardFail: state.canvasSouthHardFail,
      firstFailedCoordinate: state.canvasSouthFirstFailedCoordinate,
      visualPassClaimed: false
    });

    recomputeParentState();
    return getReceiptLight();
  }

  function receiveChildPacket(packet = {}) {
    if (!isObject(packet)) {
      recordEvent("CANVAS_PARENT_SWITCHBOARD_NON_OBJECT_CHILD_PACKET_ARCHIVED", {});
      return getReceiptLight();
    }

    const text = (() => {
      try {
        return JSON.stringify(packet);
      } catch (_error) {
        return "";
      }
    })();

    if (
      packet.contract === EAST_REQUIRED_CONTRACT ||
      packet.eastContract === EAST_REQUIRED_CONTRACT ||
      packet.activeCardinal === "EAST" ||
      packet.sourceRole === "east-material-atlas-source" ||
      text.includes("CANVAS_EAST")
    ) {
      return receiveEastPacket(packet);
    }

    if (
      packet.activeCardinal === "WEST" ||
      packet.canvasWestInspectionReady !== undefined ||
      packet.inspectionReady !== undefined ||
      text.includes("CANVAS_WEST")
    ) {
      return receiveWestPacket(packet);
    }

    if (
      packet.activeCardinal === "SOUTH" ||
      packet.canvasSouthVisibleProofReady !== undefined ||
      packet.visibleContentProof !== undefined ||
      packet.southStrictProofObserved !== undefined ||
      text.includes("CANVAS_SOUTH")
    ) {
      return receiveSouthPacket(packet);
    }

    if (
      packet.canvasReleaseAuthorized !== undefined ||
      packet.packetType === "CANVAS_RELEASE_PACKET" ||
      packet.handoffTo === "CANVAS" ||
      packet.destinationFile === FILE
    ) {
      consumeRouteConductorRelease(packet, "receiveChildPacket-route-release");
      return getReceiptLight();
    }

    recordEvent("CANVAS_PARENT_SWITCHBOARD_UNKNOWN_CHILD_PACKET_ARCHIVED", {
      keys: Object.keys(packet).slice(0, 40)
    });

    return getReceiptLight();
  }

  function computeFibonacciSynchronization() {
    const gates = [
      state.canvasParentSwitchboardActive === true,
      state.structuralCarrierReady === true && state.canvasParentCarrierSafe === true,
      state.routeConductorReleasePacketIntakeActive === true,
      state.upstreamReleaseAccepted === true || state.upstreamReleasePacketObserved === false,
      state.localWestFallbackRetired === true && state.localWestReleaseUsed === false,
      state.canvasEastApiReady === true || state.upstreamReleaseAccepted === false,
      state.canvasEastHeldPacketRecognized === true || state.canvasEastEvidenceReady === true || state.canvasEastFingerDistributionReady === true || state.canvasEastStatus === CHILD_STATUS.MISSING || state.canvasEastStatus === CHILD_STATUS.API_READY,
      state.canvasWestInspectionReady === true || state.canvasWestStatus === CHILD_STATUS.MISSING || state.canvasWestStatus === CHILD_STATUS.API_READY,
      state.canvasSouthVisibleProofReady === true || state.canvasSouthSoftProofReady === true || state.canvasSouthStatus === CHILD_STATUS.MISSING || state.canvasSouthStatus === CHILD_STATUS.API_READY,
      state.f21EligibleForNorth === false && state.readyTextAllowed === false && state.visualPassClaimed === false && state.completionLatched === false
    ];

    const expected = gates.length;
    const satisfied = gates.filter(Boolean).length;
    const score = expected ? Math.round((satisfied / expected) * 100) : 0;

    state.fibonacciSynchronizationExpected = expected;
    state.fibonacciSynchronizationSatisfied = satisfied;
    state.fibonacciSynchronizationScore = score;
    state.fibonacciSynchronizationPassed = satisfied === expected;
    state.fibonacciSynchronizationDegraded = satisfied >= Math.max(1, expected - 2) && satisfied < expected;

    return {
      expected,
      satisfied,
      score,
      passed: state.fibonacciSynchronizationPassed,
      degraded: state.fibonacciSynchronizationDegraded
    };
  }

  function recomputeParentState() {
    state.structuralCarrierActive = true;
    state.structuralCarrierReady = true;
    state.structuralCarrierSafe = true;
    state.canvasParentCarrierSafe = true;
    state.localWestFallbackRetired = true;
    state.localWestReleaseUsed = false;
    state.acceptedReleaseSource = state.upstreamReleaseAccepted ? RELEASE_SOURCE.ROUTE_CONDUCTOR : RELEASE_SOURCE.NONE;

    const eastReady = Boolean(state.canvasEastEvidenceReady || state.canvasEastFingerDistributionReady);
    const eastHeld = Boolean(state.canvasEastHeldPacketRecognized);
    const westReady = Boolean(state.canvasWestInspectionReady || state.canvasWestStatus === CHILD_STATUS.MISSING || state.canvasWestStatus === CHILD_STATUS.API_READY);
    const southReady = Boolean(
      state.canvasSouthVisibleProofReady ||
      state.canvasSouthSoftProofReady ||
      state.canvasSouthStatus === CHILD_STATUS.MISSING ||
      state.canvasSouthStatus === CHILD_STATUS.API_READY
    );

    state.allCanvasChildrenApiReady = Boolean(
      state.canvasEastApiReady &&
      (state.canvasWestApiReady || state.canvasWestStatus === CHILD_STATUS.MISSING) &&
      (state.canvasSouthApiReady || state.canvasSouthStatus === CHILD_STATUS.MISSING)
    );

    state.allCanvasChildrenEvidenceReady = Boolean(eastReady && westReady && southReady);
    state.allCanvasChildrenReady = Boolean(state.allCanvasChildrenApiReady && state.allCanvasChildrenEvidenceReady);

    state.f13HardFail = Boolean(
      state.canvasEastFalsePromotionBlocked ||
      state.canvasWestStatus === CHILD_STATUS.BLOCKED ||
      state.canvasSouthHardFail ||
      state.canvasSouthStatus === CHILD_STATUS.BLOCKED
    );

    state.f13CanvasEvidenceStrict = Boolean(
      state.upstreamReleaseAccepted &&
      eastReady &&
      state.canvasWestInspectionReady &&
      state.canvasSouthVisibleProofReady &&
      !state.f13HardFail
    );

    state.f13CanvasEvidenceDegraded = Boolean(
      state.upstreamReleaseAccepted &&
      !state.f13CanvasEvidenceStrict &&
      (eastReady || eastHeld) &&
      westReady &&
      southReady &&
      !state.f13HardFail
    );

    state.f13CanvasEvidenceComplete = Boolean(state.f13CanvasEvidenceStrict || state.f13CanvasEvidenceDegraded);

    state.indexGateReady = Boolean(state.upstreamIndexPairReady);
    state.eastGateReady = Boolean(state.canvasEastApiReady || eastHeld || eastReady);
    state.westGateReady = Boolean(westReady);
    state.southGateReady = Boolean(southReady);
    state.canvasGateReady = Boolean(state.f13CanvasEvidenceComplete);
    state.northGateReady = false;

    state.newsGatePassedBeforeF21 = Boolean(state.f13CanvasEvidenceStrict);
    state.newsGateDegradedBeforeF21 = Boolean(state.f13CanvasEvidenceDegraded);

    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21EligibilitySubmittedToNorth = false;
    state.completionLatched = false;
    state.finalCompletionLatched = false;
    state.degradedCompletionLatched = false;
    state.readyTextAllowed = false;
    state.f21ClaimedByCanvasParent = false;
    state.readyTextClaimedByCanvasParent = false;
    state.visualPassClaimed = false;
    state.generatedImage = false;
    state.graphicBox = false;
    state.webGL = false;

    if (state.f13HardFail) {
      state.firstFailedCoordinate = state.canvasEastFalsePromotionBlocked
        ? "EAST_FALSE_PROMOTION_BLOCKED"
        : state.canvasWestStatus === CHILD_STATUS.BLOCKED
          ? state.canvasWestFirstFailedCoordinate
          : state.canvasSouthFirstFailedCoordinate;

      state.recommendedNextFile = state.canvasEastFalsePromotionBlocked
        ? EAST_FILE
        : state.canvasWestStatus === CHILD_STATUS.BLOCKED
          ? WEST_FILE
          : SOUTH_FILE;

      state.recommendedNextRenewalTarget = state.recommendedNextFile;
      state.f13StrictEvidenceGap = state.firstFailedCoordinate;
      state.f13StrictEvidenceRepairTarget = state.recommendedNextFile;
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_HELD_BY_CHILD_HARD_FAIL";
    } else if (!state.upstreamReleaseAccepted) {
      state.firstFailedCoordinate = state.upstreamReleaseRejectedReason || "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = ROUTE_CONDUCTOR_FILE;
      state.f13StrictEvidenceGap = state.firstFailedCoordinate;
      state.f13StrictEvidenceRepairTarget = ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.canvasEastApiReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_EAST_API";
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_RELEASE_ACCEPTED_WAITING_EAST_API";
    } else if (state.canvasEastHeldPacketRecognized && !eastReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ENGINE_OR_ATLAS_EVIDENCE_AFTER_LAWFUL_HELD_PACKET";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.f13StrictEvidenceGap = state.firstFailedCoordinate;
      state.f13StrictEvidenceRepairTarget = FILE;
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_EAST_HELD_PACKET_RECOGNIZED";
    } else if (!eastReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_EVIDENCE_OR_FINGER_DISTRIBUTION";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.f13StrictEvidenceGap = state.firstFailedCoordinate;
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_WAITING_EAST_EVIDENCE_OR_FINGER_DISTRIBUTION";
    } else if (!state.canvasWestInspectionReady && state.canvasWestStatus !== CHILD_STATUS.MISSING && state.canvasWestStatus !== CHILD_STATUS.API_READY) {
      state.firstFailedCoordinate = "WAITING_CANVAS_WEST_INSPECTION";
      state.recommendedNextFile = WEST_FILE;
      state.recommendedNextRenewalTarget = WEST_FILE;
      state.f13StrictEvidenceGap = state.firstFailedCoordinate;
      state.f13StrictEvidenceRepairTarget = WEST_FILE;
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_WAITING_CANVAS_WEST_INSPECTION";
    } else if (!state.canvasSouthVisibleProofReady && !state.canvasSouthSoftProofReady && state.canvasSouthStatus !== CHILD_STATUS.MISSING && state.canvasSouthStatus !== CHILD_STATUS.API_READY) {
      state.firstFailedCoordinate = "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
      state.recommendedNextFile = SOUTH_FILE;
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      state.f13StrictEvidenceGap = state.firstFailedCoordinate;
      state.f13StrictEvidenceRepairTarget = SOUTH_FILE;
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
    } else if (state.canvasEastFingerDistributionReady) {
      state.firstFailedCoordinate = "NONE_EAST_READY_TO_DISTRIBUTE_TO_FINGER_ENGINES";
      state.recommendedNextFile = "FUTURE_FINGER_ENGINE_FILE";
      state.recommendedNextRenewalTarget = "FUTURE_FINGER_ENGINE_FILE";
      state.f13StrictEvidenceGap = "NONE_EAST_READY_TO_DISTRIBUTE_TO_FINGER_ENGINES";
      state.f13StrictEvidenceRepairTarget = "FUTURE_FINGER_ENGINE_FILE";
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_READY_FOR_FINGER_ENGINE_SPLIT";
    } else if (state.f13CanvasEvidenceComplete) {
      state.firstFailedCoordinate = "NONE_CANVAS_F13_COORDINATION_COMPLETE";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.f13StrictEvidenceGap = "NONE_CANVAS_F13_COORDINATION_COMPLETE";
      state.f13StrictEvidenceRepairTarget = NORTH_FILE;
      state.postgameStatus = state.f13CanvasEvidenceStrict
        ? "CANVAS_PARENT_SWITCHBOARD_F13_STRICT_COORDINATION_COMPLETE"
        : "CANVAS_PARENT_SWITCHBOARD_F13_DEGRADED_COORDINATION_COMPLETE";
    } else {
      state.firstFailedCoordinate = "WAITING_CANVAS_CHILD_RECEIPTS";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_CHILD_RECEIPTS";
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_SWITCHBOARD_WAITING_CANVAS_CHILD_RECEIPTS";
    }

    state.canvasNextAuditTarget = state.recommendedNextRenewalTarget;
    state.f21LatchMode = state.f13CanvasEvidenceComplete
      ? "F13_COORDINATION_COMPLETE_HELD_FOR_NORTH_ONLY_REVIEW"
      : "BLOCKED_BY_CANVAS_PARENT";

    computeFibonacciSynchronization();
    state.updatedAt = nowIso();
    updateDataset();

    return getReceiptLight();
  }

  function auditChildren(options = {}) {
    state.lastAuditAt = nowIso();

    consumeReleaseFromOptions(options, "auditChildren-options");
    scanEastAuthority();
    scanCanvasWestAuthority();
    scanCanvasSouthAuthority();

    if (options.openEast !== false && state.upstreamReleaseAccepted) {
      openEast({
        ...options,
        reason: firstString(options.reason, "auditChildren-openEast")
      });
    } else {
      recomputeParentState();
    }

    recordEvent("CANVAS_PARENT_SWITCHBOARD_CHILD_AUDIT_COMPLETED", {
      openEast: options.openEast !== false,
      routeReleaseAccepted: state.upstreamReleaseAccepted,
      eastOpened: state.eastOpened,
      eastStatus: state.canvasEastStatus,
      westStatus: state.canvasWestStatus,
      southStatus: state.canvasSouthStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      visualPassClaimed: false
    });

    publishGlobals();
    updateDataset();

    return getReceiptLight();
  }

  function boot(options = {}) {
    state.lastBootAt = nowIso();

    publishGlobals();
    updateDataset();

    consumeReleaseFromOptions(options, firstString(options.reason, "boot-options"));
    composeStructuralCarrier({ reason: firstString(options.reason, "boot") });

    scanEastAuthority();
    scanCanvasWestAuthority();
    scanCanvasSouthAuthority();
    recomputeParentState();

    recordEvent("CANVAS_PARENT_SWITCHBOARD_BOOT", {
      reason: firstString(options.reason, "boot"),
      routeReleaseAccepted: state.upstreamReleaseAccepted,
      acceptedReleaseSource: state.acceptedReleaseSource,
      localWestReleaseUsed: false,
      structuralCarrierSafe: true,
      eastOpened: false,
      visualPassClaimed: false
    });

    if (options.openEast !== false && state.upstreamReleaseAccepted) {
      openEast({
        ...options,
        reason: firstString(options.reason, "boot-openEast")
      });
    }

    publishGlobals();
    updateDataset();

    return composeStructuralCarrier({ reason: "boot-return-carrier" });
  }

  function init(options = {}) {
    return boot({ ...options, reason: firstString(options.reason, "init") });
  }

  function start(options = {}) {
    return boot({ ...options, reason: firstString(options.reason, "start") });
  }

  function mount(options = {}) {
    return boot({ ...options, reason: firstString(options.reason, "mount") });
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      canvasParentSwitchboardActive: true,
      canvasParentEngine: false,
      canvasParentAuditor: false,
      canvasParentSwitchboardOnly: true,

      routeConductorReleasePacketIntakeActive: true,
      routeConductorReleasePacketPrimary: true,
      routeConductorRequiredContract: ROUTE_CONDUCTOR_REQUIRED_CONTRACT,
      routeConductorRequiredReceipt: ROUTE_CONDUCTOR_REQUIRED_RECEIPT,

      localWestFallbackRetired: true,
      localWestReleaseUsed: false,
      acceptedReleaseSource: state.acceptedReleaseSource,

      upstreamReleasePacketObserved: state.upstreamReleasePacketObserved,
      upstreamReleasePacketReady: state.upstreamReleasePacketReady,
      upstreamReleaseAccepted: state.upstreamReleaseAccepted,
      upstreamReleaseRejectedReason: state.upstreamReleaseRejectedReason,
      upstreamRouteConductorContract: state.upstreamRouteConductorContract,
      upstreamRouteConductorReceipt: state.upstreamRouteConductorReceipt,
      upstreamRouteConductorContractObserved: state.upstreamRouteConductorContractObserved,
      upstreamRouteConductorReceiptObserved: state.upstreamRouteConductorReceiptObserved,
      upstreamCanvasReleaseAuthorized: state.upstreamCanvasReleaseAuthorized,
      upstreamWestCanvasReleaseApproved: state.upstreamWestCanvasReleaseApproved,
      upstreamWestHardBlock: state.upstreamWestHardBlock,
      upstreamCarrierHostAdmissibilityReady: state.upstreamCarrierHostAdmissibilityReady,
      upstreamCarrierHostAdmissibilityPacketReady: state.upstreamCarrierHostAdmissibilityPacketReady,
      upstreamIndexPairReady: state.upstreamIndexPairReady,
      upstreamIndexMacroWestCandidateReady: state.upstreamIndexMacroWestCandidateReady,
      upstreamHandoffToCanvas: state.upstreamHandoffToCanvas,
      upstreamDestinationIsCanvas: state.upstreamDestinationIsCanvas,
      upstreamCycleNumber: state.upstreamCycleNumber,
      upstreamCycleRoute: state.upstreamCycleRoute,
      upstreamReceivedFrom: state.upstreamReceivedFrom,
      upstreamSourceFile: state.upstreamSourceFile,
      upstreamDestinationFile: state.upstreamDestinationFile,
      upstreamTargetFile: state.upstreamTargetFile,
      upstreamFirstFailedCoordinate: state.upstreamFirstFailedCoordinate,
      upstreamRecommendedNextFile: state.upstreamRecommendedNextFile,
      upstreamRecommendedNextRenewalTarget: state.upstreamRecommendedNextRenewalTarget,
      upstreamReleaseObservedAt: state.upstreamReleaseObservedAt,

      structuralCarrierActive: true,
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,
      structuralCarrierPublished: state.structuralCarrierPublished,
      carrierPrecheckReady: true,
      bootMethodAvailable: true,
      mountMethodAvailable: true,
      initMethodAvailable: true,
      startMethodAvailable: true,
      getStructuralCarrierAvailable: true,
      readStructuralCarrierAvailable: true,
      getCanvasCarrierAvailable: true,
      getCarrierReceiptAvailable: true,
      structuralCarrierFirstPublishedAt: state.structuralCarrierFirstPublishedAt,

      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      eastOpened: state.eastOpened,

      canvasEastObserved: state.canvasEastObserved,
      canvasEastRequiredContractObserved: state.canvasEastRequiredContractObserved,
      canvasEastApiReady: state.canvasEastApiReady,
      canvasEastStatus: state.canvasEastStatus,
      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasEastHeldPacketWasSynchronous: state.canvasEastHeldPacketWasSynchronous,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastFingerDistributionReady: state.canvasEastFingerDistributionReady,
      canvasEastF13AtlasPacketReady: state.canvasEastF13AtlasPacketReady,
      canvasEastFalsePromotionBlocked: state.canvasEastFalsePromotionBlocked,
      canvasEastFirstFailedCoordinate: state.canvasEastFirstFailedCoordinate,
      canvasEastRecommendedNextRenewalTarget: state.canvasEastRecommendedNextRenewalTarget,

      canvasWestObserved: state.canvasWestObserved,
      canvasWestApiReady: state.canvasWestApiReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasWestStatus: state.canvasWestStatus,
      canvasWestFirstFailedCoordinate: state.canvasWestFirstFailedCoordinate,

      canvasSouthObserved: state.canvasSouthObserved,
      canvasSouthApiReady: state.canvasSouthApiReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      canvasSouthSoftProofReady: state.canvasSouthSoftProofReady,
      canvasSouthHardFail: state.canvasSouthHardFail,
      canvasSouthStatus: state.canvasSouthStatus,
      canvasSouthFirstFailedCoordinate: state.canvasSouthFirstFailedCoordinate,

      fingerEngineLayerExpected: true,
      fingerEnginesOwnedByParent: false,
      eastOwnsFingerDistribution: true,
      eachFingerOwnsOwnEngine: true,

      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      cycleNumber: CYCLE_NUMBER,
      cycleRoute: CYCLE_ROUTE,
      activeFibonacci: ACTIVE_FIBONACCI,
      activeFibonacciRank: ACTIVE_FIBONACCI,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeNewsGate: state.activeNewsGate,
      oneActiveGearAtATime: true,

      newsAlignmentProtocolActive: true,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,
      indexGateReady: state.indexGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      northGateReady: false,

      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationSatisfied: state.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationExpected: state.fibonacciSynchronizationExpected,
      fibonacciSynchronizationPassed: state.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: state.fibonacciSynchronizationDegraded,

      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21LatchMode: state.f21LatchMode,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      f21ClaimedByCanvasParent: false,
      readyTextClaimedByCanvasParent: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      canvasNextAuditTarget: state.canvasNextAuditTarget,
      postgameStatus: state.postgameStatus,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      lastBootAt: state.lastBootAt,
      lastAuditAt: state.lastAuditAt,
      lastCarrierReadAt: state.lastCarrierReadAt,
      lastReleaseAt: state.lastReleaseAt,
      lastEastCallAt: state.lastEastCallAt,
      publishedAt: state.publishedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      owns: [
        "canvas-parent-structural-carrier",
        "canvas-parent-boot-init-start-mount-aliases",
        "route-conductor-release-packet-intake",
        "parent-release-acceptance",
        "east-gate-opening",
        "parent-release-packet-composition-to-east",
        "child-receipt-intake",
        "child-status-normalization",
        "f13-canvas-domain-coordination-receipt",
        "dataset-publication",
        "global-export-publication",
        "false-f21-ready-visual-pass-firewall"
      ],

      doesNotOwn: [
        "lab-west-admissibility",
        "route-orchestration",
        "east-atlas-source-truth",
        "finger-engine-execution",
        "material-truth",
        "elevation-truth",
        "hydrology-truth",
        "canvas-west-inspection-truth",
        "canvas-south-visible-proof-truth",
        "north-f21-latch",
        "ready-text",
        "final-visual-pass-claim"
      ],

      childStatuses: clonePlain(CHILD_STATUS),
      eastResultClasses: clonePlain(EAST_RESULT_CLASS),
      releaseSources: clonePlain(RELEASE_SOURCE),

      structuralCarrier: composeStructuralCarrier({ reason: "getReceipt" }),
      upstreamReleasePacket: clonePlain(state.upstreamReleasePacket),
      lastParentReleasePacketToEast: clonePlain(state.lastParentReleasePacketToEast),
      lastEastOpenResult: clonePlain(state.lastEastOpenResult),

      canvasEastReceipt: clonePlain(state.canvasEastReceipt),
      canvasEastLastPacket: clonePlain(state.canvasEastLastPacket),
      canvasEastLastHeldPacket: clonePlain(state.canvasEastLastHeldPacket),
      canvasEastLastEvidencePacket: clonePlain(state.canvasEastLastEvidencePacket),
      canvasWestReceipt: clonePlain(state.canvasWestReceipt),
      canvasSouthReceipt: clonePlain(state.canvasSouthReceipt),

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors)
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    const localEvents = state.localEvents.length
      ? state.localEvents.slice(-40).map((item) => `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`).join("\n")
      : "- none";

    const errors = state.errors.length
      ? state.errors.slice(-30).map((item) => `- ${item.at} :: ${item.code} :: ${item.message}`).join("\n")
      : "- none";

    return [
      "HEARTH_CANVAS_PARENT_SWITCHBOARD_RELEASE_TO_EAST_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      "SWITCHBOARD",
      `canvasParentSwitchboardActive=${r.canvasParentSwitchboardActive}`,
      `canvasParentEngine=${r.canvasParentEngine}`,
      `canvasParentAuditor=${r.canvasParentAuditor}`,
      `canvasParentSwitchboardOnly=${r.canvasParentSwitchboardOnly}`,
      "",
      "UPSTREAM_RELEASE",
      `routeConductorReleasePacketIntakeActive=${r.routeConductorReleasePacketIntakeActive}`,
      `routeConductorReleasePacketPrimary=${r.routeConductorReleasePacketPrimary}`,
      `localWestFallbackRetired=${r.localWestFallbackRetired}`,
      `localWestReleaseUsed=${r.localWestReleaseUsed}`,
      `acceptedReleaseSource=${r.acceptedReleaseSource}`,
      `upstreamReleasePacketObserved=${r.upstreamReleasePacketObserved}`,
      `upstreamReleasePacketReady=${r.upstreamReleasePacketReady}`,
      `upstreamReleaseAccepted=${r.upstreamReleaseAccepted}`,
      `upstreamReleaseRejectedReason=${r.upstreamReleaseRejectedReason}`,
      `upstreamRouteConductorContract=${r.upstreamRouteConductorContract}`,
      `upstreamRouteConductorReceipt=${r.upstreamRouteConductorReceipt}`,
      `upstreamCanvasReleaseAuthorized=${r.upstreamCanvasReleaseAuthorized}`,
      `upstreamWestCanvasReleaseApproved=${r.upstreamWestCanvasReleaseApproved}`,
      `upstreamWestHardBlock=${r.upstreamWestHardBlock}`,
      `upstreamCarrierHostAdmissibilityReady=${r.upstreamCarrierHostAdmissibilityReady}`,
      `upstreamCarrierHostAdmissibilityPacketReady=${r.upstreamCarrierHostAdmissibilityPacketReady}`,
      `upstreamIndexPairReady=${r.upstreamIndexPairReady}`,
      `upstreamIndexMacroWestCandidateReady=${r.upstreamIndexMacroWestCandidateReady}`,
      `upstreamHandoffToCanvas=${r.upstreamHandoffToCanvas}`,
      `upstreamDestinationIsCanvas=${r.upstreamDestinationIsCanvas}`,
      `upstreamCycleNumber=${r.upstreamCycleNumber}`,
      `upstreamCycleRoute=${r.upstreamCycleRoute}`,
      "",
      "STRUCTURAL_CARRIER",
      `structuralCarrierActive=${r.structuralCarrierActive}`,
      `structuralCarrierReady=${r.structuralCarrierReady}`,
      `structuralCarrierSafe=${r.structuralCarrierSafe}`,
      `canvasParentCarrierSafe=${r.canvasParentCarrierSafe}`,
      `structuralCarrierPublished=${r.structuralCarrierPublished}`,
      `bootMethodAvailable=${r.bootMethodAvailable}`,
      `mountMethodAvailable=${r.mountMethodAvailable}`,
      `initMethodAvailable=${r.initMethodAvailable}`,
      `startMethodAvailable=${r.startMethodAvailable}`,
      "",
      "EAST_SWITCH",
      `parentReleasePacketSentToEast=${r.parentReleasePacketSentToEast}`,
      `parentReleasePacketLawful=${r.parentReleasePacketLawful}`,
      `eastOpened=${r.eastOpened}`,
      `canvasEastObserved=${r.canvasEastObserved}`,
      `canvasEastRequiredContractObserved=${r.canvasEastRequiredContractObserved}`,
      `canvasEastApiReady=${r.canvasEastApiReady}`,
      `canvasEastStatus=${r.canvasEastStatus}`,
      `canvasEastHeldPacketRecognized=${r.canvasEastHeldPacketRecognized}`,
      `canvasEastHeldPacketWasSynchronous=${r.canvasEastHeldPacketWasSynchronous}`,
      `canvasEastEvidenceReady=${r.canvasEastEvidenceReady}`,
      `canvasEastFingerDistributionReady=${r.canvasEastFingerDistributionReady}`,
      `canvasEastF13AtlasPacketReady=${r.canvasEastF13AtlasPacketReady}`,
      `canvasEastFalsePromotionBlocked=${r.canvasEastFalsePromotionBlocked}`,
      `canvasEastFirstFailedCoordinate=${r.canvasEastFirstFailedCoordinate}`,
      `canvasEastRecommendedNextRenewalTarget=${r.canvasEastRecommendedNextRenewalTarget}`,
      "",
      "CANVAS_WEST_CHILD",
      `canvasWestObserved=${r.canvasWestObserved}`,
      `canvasWestApiReady=${r.canvasWestApiReady}`,
      `canvasWestInspectionReady=${r.canvasWestInspectionReady}`,
      `canvasWestStatus=${r.canvasWestStatus}`,
      `canvasWestFirstFailedCoordinate=${r.canvasWestFirstFailedCoordinate}`,
      "",
      "CANVAS_SOUTH_CHILD",
      `canvasSouthObserved=${r.canvasSouthObserved}`,
      `canvasSouthApiReady=${r.canvasSouthApiReady}`,
      `canvasSouthVisibleProofReady=${r.canvasSouthVisibleProofReady}`,
      `canvasSouthSoftProofReady=${r.canvasSouthSoftProofReady}`,
      `canvasSouthHardFail=${r.canvasSouthHardFail}`,
      `canvasSouthStatus=${r.canvasSouthStatus}`,
      `canvasSouthFirstFailedCoordinate=${r.canvasSouthFirstFailedCoordinate}`,
      "",
      "FINGER_ENGINES",
      `fingerEngineLayerExpected=${r.fingerEngineLayerExpected}`,
      `fingerEnginesOwnedByParent=${r.fingerEnginesOwnedByParent}`,
      `eastOwnsFingerDistribution=${r.eastOwnsFingerDistribution}`,
      `eachFingerOwnsOwnEngine=${r.eachFingerOwnsOwnEngine}`,
      "",
      "F13",
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13CanvasEvidenceStrict=${r.f13CanvasEvidenceStrict}`,
      `f13CanvasEvidenceDegraded=${r.f13CanvasEvidenceDegraded}`,
      `f13HardFail=${r.f13HardFail}`,
      `f13StrictEvidenceGap=${r.f13StrictEvidenceGap}`,
      `f13StrictEvidenceRepairTarget=${r.f13StrictEvidenceRepairTarget}`,
      "",
      "NEWS_FIBONACCI",
      `newsAlignmentProtocolActive=${r.newsAlignmentProtocolActive}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      `indexGateReady=${r.indexGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `northGateReady=${r.northGateReady}`,
      `fibonacciSynchronizationMetricActive=${r.fibonacciSynchronizationMetricActive}`,
      `fibonacciSynchronizationScore=${r.fibonacciSynchronizationScore}`,
      `fibonacciSynchronizationSatisfied=${r.fibonacciSynchronizationSatisfied}`,
      `fibonacciSynchronizationExpected=${r.fibonacciSynchronizationExpected}`,
      `fibonacciSynchronizationPassed=${r.fibonacciSynchronizationPassed}`,
      `fibonacciSynchronizationDegraded=${r.fibonacciSynchronizationDegraded}`,
      "",
      "F21_FIREWALL",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21EligibilitySubmittedToNorth=${r.f21EligibilitySubmittedToNorth}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `completionLatched=${r.completionLatched}`,
      `finalCompletionLatched=${r.finalCompletionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `f21ClaimedByCanvasParent=${r.f21ClaimedByCanvasParent}`,
      `readyTextClaimedByCanvasParent=${r.readyTextClaimedByCanvasParent}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `canvasNextAuditTarget=${r.canvasNextAuditTarget}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      "LOCAL_EVENTS",
      localEvents,
      "",
      "ERRORS",
      errors,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `lastBootAt=${r.lastBootAt}`,
      `lastAuditAt=${r.lastAuditAt}`,
      `lastCarrierReadAt=${r.lastCarrierReadAt}`,
      `lastReleaseAt=${r.lastReleaseAt}`,
      `lastEastCallAt=${r.lastEastCallAt}`,
      `publishedAt=${r.publishedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasVersion", VERSION);
    setDataset("hearthCanvasFile", FILE);
    setDataset("hearthCanvasRole", state.role);

    setDataset("hearthCanvasParentSwitchboardActive", "true");
    setDataset("hearthCanvasParentEngine", "false");
    setDataset("hearthCanvasParentAuditor", "false");
    setDataset("hearthCanvasParentSwitchboardOnly", "true");

    setDataset("hearthCanvasRouteConductorReleasePacketIntakeActive", "true");
    setDataset("hearthCanvasRouteConductorReleasePacketPrimary", "true");
    setDataset("hearthCanvasLocalWestFallbackRetired", "true");
    setDataset("hearthCanvasLocalWestReleaseUsed", "false");
    setDataset("hearthCanvasAcceptedReleaseSource", state.acceptedReleaseSource);

    setDataset("hearthCanvasUpstreamReleasePacketObserved", state.upstreamReleasePacketObserved);
    setDataset("hearthCanvasUpstreamReleasePacketReady", state.upstreamReleasePacketReady);
    setDataset("hearthCanvasUpstreamReleaseAccepted", state.upstreamReleaseAccepted);
    setDataset("hearthCanvasUpstreamReleaseRejectedReason", state.upstreamReleaseRejectedReason);
    setDataset("hearthCanvasUpstreamRouteConductorContract", state.upstreamRouteConductorContract);
    setDataset("hearthCanvasUpstreamRouteConductorReceipt", state.upstreamRouteConductorReceipt);
    setDataset("hearthCanvasUpstreamCanvasReleaseAuthorized", state.upstreamCanvasReleaseAuthorized);
    setDataset("hearthCanvasUpstreamWestCanvasReleaseApproved", state.upstreamWestCanvasReleaseApproved);
    setDataset("hearthCanvasUpstreamWestHardBlock", state.upstreamWestHardBlock);
    setDataset("hearthCanvasUpstreamCarrierHostAdmissibilityReady", state.upstreamCarrierHostAdmissibilityReady);
    setDataset("hearthCanvasUpstreamCarrierHostAdmissibilityPacketReady", state.upstreamCarrierHostAdmissibilityPacketReady);
    setDataset("hearthCanvasUpstreamIndexPairReady", state.upstreamIndexPairReady);
    setDataset("hearthCanvasUpstreamIndexMacroWestCandidateReady", state.upstreamIndexMacroWestCandidateReady);
    setDataset("hearthCanvasUpstreamHandoffToCanvas", state.upstreamHandoffToCanvas);
    setDataset("hearthCanvasUpstreamDestinationIsCanvas", state.upstreamDestinationIsCanvas);
    setDataset("hearthCanvasUpstreamCycleNumber", state.upstreamCycleNumber);
    setDataset("hearthCanvasUpstreamCycleRoute", state.upstreamCycleRoute);

    setDataset("hearthCanvasStructuralCarrierActive", "true");
    setDataset("hearthCanvasStructuralCarrierReady", "true");
    setDataset("hearthCanvasStructuralCarrierSafe", "true");
    setDataset("hearthCanvasParentCarrierSafe", "true");
    setDataset("hearthCanvasStructuralCarrierPublished", state.structuralCarrierPublished);
    setDataset("hearthCanvasBootMethodAvailable", "true");
    setDataset("hearthCanvasMountMethodAvailable", "true");
    setDataset("hearthCanvasInitMethodAvailable", "true");
    setDataset("hearthCanvasStartMethodAvailable", "true");

    setDataset("hearthCanvasParentReleasePacketSentToEast", state.parentReleasePacketSentToEast);
    setDataset("hearthCanvasParentReleasePacketLawful", state.parentReleasePacketLawful);
    setDataset("hearthCanvasEastOpened", state.eastOpened);

    setDataset("hearthCanvasEastObserved", state.canvasEastObserved);
    setDataset("hearthCanvasEastRequiredContractObserved", state.canvasEastRequiredContractObserved);
    setDataset("hearthCanvasEastApiReady", state.canvasEastApiReady);
    setDataset("hearthCanvasEastStatus", state.canvasEastStatus);
    setDataset("hearthCanvasEastHeldPacketRecognized", state.canvasEastHeldPacketRecognized);
    setDataset("hearthCanvasEastHeldPacketWasSynchronous", state.canvasEastHeldPacketWasSynchronous);
    setDataset("hearthCanvasEastEvidenceReady", state.canvasEastEvidenceReady);
    setDataset("hearthCanvasEastFingerDistributionReady", state.canvasEastFingerDistributionReady);
    setDataset("hearthCanvasEastF13AtlasPacketReady", state.canvasEastF13AtlasPacketReady);
    setDataset("hearthCanvasEastFalsePromotionBlocked", state.canvasEastFalsePromotionBlocked);
    setDataset("hearthCanvasEastFirstFailedCoordinate", state.canvasEastFirstFailedCoordinate);
    setDataset("hearthCanvasEastRecommendedNextRenewalTarget", state.canvasEastRecommendedNextRenewalTarget);

    setDataset("hearthCanvasWestObserved", state.canvasWestObserved);
    setDataset("hearthCanvasWestApiReady", state.canvasWestApiReady);
    setDataset("hearthCanvasWestInspectionReady", state.canvasWestInspectionReady);
    setDataset("hearthCanvasWestStatus", state.canvasWestStatus);
    setDataset("hearthCanvasWestFirstFailedCoordinate", state.canvasWestFirstFailedCoordinate);

    setDataset("hearthCanvasSouthObserved", state.canvasSouthObserved);
    setDataset("hearthCanvasSouthApiReady", state.canvasSouthApiReady);
    setDataset("hearthCanvasSouthVisibleProofReady", state.canvasSouthVisibleProofReady);
    setDataset("hearthCanvasSouthSoftProofReady", state.canvasSouthSoftProofReady);
    setDataset("hearthCanvasSouthHardFail", state.canvasSouthHardFail);
    setDataset("hearthCanvasSouthStatus", state.canvasSouthStatus);
    setDataset("hearthCanvasSouthFirstFailedCoordinate", state.canvasSouthFirstFailedCoordinate);

    setDataset("hearthCanvasFingerEngineLayerExpected", "true");
    setDataset("hearthCanvasFingerEnginesOwnedByParent", "false");
    setDataset("hearthCanvasEastOwnsFingerDistribution", "true");
    setDataset("hearthCanvasEachFingerOwnsOwnEngine", "true");

    setDataset("hearthCanvasAllChildrenApiReady", state.allCanvasChildrenApiReady);
    setDataset("hearthCanvasAllChildrenEvidenceReady", state.allCanvasChildrenEvidenceReady);
    setDataset("hearthCanvasAllChildrenReady", state.allCanvasChildrenReady);

    setDataset("hearthCanvasCycleNumber", CYCLE_NUMBER);
    setDataset("hearthCanvasCycleRoute", CYCLE_ROUTE);
    setDataset("hearthCanvasActiveFibonacci", ACTIVE_FIBONACCI);
    setDataset("hearthCanvasActiveFibonacciRank", ACTIVE_FIBONACCI);
    setDataset("hearthCanvasActiveStageId", state.activeStageId);
    setDataset("hearthCanvasActiveGearId", state.activeGearId);
    setDataset("hearthCanvasActiveNewsGate", state.activeNewsGate);

    setDataset("hearthCanvasNewsGatePassedBeforeF21", state.newsGatePassedBeforeF21);
    setDataset("hearthCanvasNewsGateDegradedBeforeF21", state.newsGateDegradedBeforeF21);
    setDataset("hearthCanvasIndexGateReady", state.indexGateReady);
    setDataset("hearthCanvasEastGateReady", state.eastGateReady);
    setDataset("hearthCanvasWestGateReady", state.westGateReady);
    setDataset("hearthCanvasSouthGateReady", state.southGateReady);
    setDataset("hearthCanvasGateReady", state.canvasGateReady);
    setDataset("hearthCanvasNorthGateReady", "false");

    setDataset("hearthCanvasFibonacciSynchronizationMetricActive", "true");
    setDataset("hearthCanvasFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("hearthCanvasFibonacciSynchronizationSatisfied", state.fibonacciSynchronizationSatisfied);
    setDataset("hearthCanvasFibonacciSynchronizationExpected", state.fibonacciSynchronizationExpected);
    setDataset("hearthCanvasFibonacciSynchronizationPassed", state.fibonacciSynchronizationPassed);
    setDataset("hearthCanvasFibonacciSynchronizationDegraded", state.fibonacciSynchronizationDegraded);

    setDataset("hearthCanvasF13EvidenceComplete", state.f13CanvasEvidenceComplete);
    setDataset("hearthCanvasF13EvidenceStrict", state.f13CanvasEvidenceStrict);
    setDataset("hearthCanvasF13EvidenceDegraded", state.f13CanvasEvidenceDegraded);
    setDataset("hearthCanvasF13HardFail", state.f13HardFail);
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21EligibilitySubmittedToNorth", "false");
    setDataset("hearthCanvasF21LatchMode", state.f21LatchMode);
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasFinalCompletionLatched", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasF21ClaimedByCanvasParent", "false");

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasNextAuditTarget", state.canvasNextAuditTarget);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webGL", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvas = api;
    root.HEARTH.canvasParent = api;
    root.HEARTH.canvasSwitchboard = api;
    root.HEARTH.canvasParentSwitchboardReleaseToEast = api;
    root.HEARTH.canvasParentStructuralCarrier = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_SWITCHBOARD = api;
    root.HEARTH_CANVAS_PARENT_SWITCHBOARD_RELEASE_TO_EAST = api;
    root.HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER = api;

    root.DEXTER_LAB.hearthCanvas = api;
    root.DEXTER_LAB.hearthCanvasParent = api;
    root.DEXTER_LAB.hearthCanvasSwitchboard = api;
    root.DEXTER_LAB.hearthCanvasParentSwitchboardReleaseToEast = api;

    const receipt = getReceiptLight();
    const carrier = composeStructuralCarrier({ reason: "publishGlobals" });

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_SWITCHBOARD_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_SWITCHBOARD_RELEASE_TO_EAST_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_RECEIPT = carrier;

    root.HEARTH.canvasReceipt = receipt;
    root.HEARTH.canvasParentReceipt = receipt;
    root.HEARTH.canvasSwitchboardReceipt = receipt;
    root.HEARTH.canvasParentSwitchboardReleaseToEastReceipt = receipt;
    root.HEARTH.canvasParentStructuralCarrierReceipt = carrier;

    root.DEXTER_LAB.hearthCanvasReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasParentReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasSwitchboardReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasParentSwitchboardReleaseToEastReceipt = receipt;

    root.__HEARTH_CANVAS_LOADED__ = true;
    root.__HEARTH_CANVAS_FILE__ = FILE;
    root.__HEARTH_CANVAS_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_PARENT_SWITCHBOARD_ACTIVE__ = true;
    root.__HEARTH_CANVAS_PARENT_ENGINE__ = false;
    root.__HEARTH_CANVAS_LOCAL_WEST_FALLBACK_RETIRED__ = true;
    root.__HEARTH_CANVAS_PARENT_CARRIER_SAFE__ = true;
    root.__HEARTH_CANVAS_F21_CLAIMED__ = false;
    root.__HEARTH_CANVAS_READY_TEXT_ALLOWED__ = false;
    root.__HEARTH_CANVAS_VISUAL_PASS_CLAIMED__ = false;

    state.structuralCarrierPublished = true;
    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    updateDataset();
  }

  function bootAudit() {
    try {
      publishGlobals();
      updateDataset();
      consumeReleaseFromOptions({}, "bootAudit-global-route-conductor");
      scanEastAuthority();
      scanCanvasWestAuthority();
      scanCanvasSouthAuthority();
      recomputeParentState();
      composeStructuralCarrier({ reason: "bootAudit-initial-carrier" });

      recordEvent("CANVAS_PARENT_SWITCHBOARD_RELEASE_TO_EAST_LOADED", {
        contract: CONTRACT,
        receipt: RECEIPT,
        switchboardOnly: true,
        parentEngine: false,
        parentAuditor: false,
        localWestFallbackRetired: true,
        routeReleaseAccepted: state.upstreamReleaseAccepted,
        acceptedReleaseSource: state.acceptedReleaseSource,
        visualPassClaimed: false
      });

      const run = () => {
        try {
          auditChildren({
            openEast: true,
            async: true,
            nonBlocking: true,
            width: 512,
            height: 256,
            releasePacket: state.upstreamReleasePacket,
            reason: "bootAudit-openEast"
          });
        } catch (error) {
          recordError("BOOT_AUDIT_CHILD_AUDIT_FAILED", error);
          recomputeParentState();
        }
      };

      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => run());
      } else if (isFunction(root.setTimeout)) {
        root.setTimeout(run, 0);
      } else {
        run();
      }

      if (isFunction(root.setTimeout)) {
        root.setTimeout(() => {
          try {
            consumeReleaseFromOptions({}, "post-boot-route-conductor-rescan");
            scanEastAuthority();
            scanCanvasWestAuthority();
            scanCanvasSouthAuthority();
            recomputeParentState();
            publishGlobals();
          } catch (error) {
            recordError("POST_BOOT_RESCAN_FAILED", error);
          }
        }, 120);

        root.setTimeout(() => {
          try {
            consumeReleaseFromOptions({}, "post-boot-late-route-conductor-rescan");
            scanEastAuthority();
            scanCanvasWestAuthority();
            scanCanvasSouthAuthority();
            recomputeParentState();
            publishGlobals();
          } catch (error) {
            recordError("POST_BOOT_LATE_RESCAN_FAILED", error);
          }
        }, 420);
      }
    } catch (error) {
      recordError("CANVAS_PARENT_SWITCHBOARD_INITIALIZATION_FAILED", error);
      try {
        publishGlobals();
        updateDataset();
      } catch (_fallbackError) {}
    }
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    RELEASE_SOURCE,
    CHILD_STATUS,
    EAST_RESULT_CLASS,

    boot,
    init,
    start,
    mount,
    bootAudit,

    readRouteConductorPacket,
    validateRouteConductorRelease,
    consumeRouteConductorRelease,
    consumeReleaseFromOptions,

    composeStructuralCarrier,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,

    composeParentReleasePacketToEast,
    openEast,
    scanEastAuthority,
    scanCanvasWestAuthority,
    scanCanvasSouthAuthority,

    classifyEastPacket,
    applyEastPacket,
    receiveEastPacket,
    receiveWestPacket,
    receiveSouthPacket,
    receiveChildPacket,

    auditChildren,
    recomputeParentState,
    computeFibonacciSynchronization,
    publishGlobals,
    updateDataset,

    getReceiptLight,
    getReceipt,
    getReceiptText,

    canvasParentSwitchboardActive: true,
    canvasParentEngine: false,
    canvasParentAuditor: false,
    canvasParentSwitchboardOnly: true,

    routeConductorReleasePacketIntakeActive: true,
    routeConductorReleasePacketPrimary: true,
    localWestFallbackRetired: true,
    localWestReleaseUsed: false,

    structuralCarrierActive: true,
    structuralCarrierReady: true,
    structuralCarrierSafe: true,
    canvasParentCarrierSafe: true,

    fingerEngineLayerExpected: true,
    fingerEnginesOwnedByParent: false,
    eastOwnsFingerDistribution: true,
    eachFingerOwnsOwnEngine: true,

    ownsCanvasParentStructuralCarrier: true,
    ownsRouteConductorReleasePacketIntake: true,
    ownsParentReleaseAcceptance: true,
    ownsEastGateOpening: true,
    ownsChildReceiptIntake: true,
    ownsF13CanvasCoordination: true,

    ownsLabWestAdmissibility: false,
    ownsRouteOrchestration: false,
    ownsEastAtlasSourceTruth: false,
    ownsFingerEngineExecution: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsCanvasWestInspectionTruth: false,
    ownsCanvasSouthVisibleProofTruth: false,
    ownsNorthF21Latch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    completionLatched: false,
    readyTextAllowed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  bootAudit();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
