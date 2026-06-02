// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_TNT_v4_6_3
// Full-file replacement.
// Cardinal West / North-timetable-aligned local admissibility clutch only.
// Purpose:
// - Keep West as a local admissibility clutch under North timetable authority.
// - Separate West invocation, intake acceptance, admissibility acceptance, and audit pass.
// - Release to Canvas only after lawful C2 West audit intake, South-output admissibility, and Canvas Local Station admissibility.
// - Accept Canvas Local Station v11_1/v11 as current pass candidates.
// - Recognize Canvas Parent v10_3 as baseline-only, never as current pass.
// - Correct unsafe-field logic so false mismatch/stale markers do not become hard blocks.
// - Rank clean current Canvas Local Station proof above unsafe proof.
// - Prevent West-owned dataset keys from creating upstream Canvas proof.
// - Publish dominant West aliases and legacy receipt aliases so stale West contracts cannot outrank v4_6_3.
// - Publish release packets only from RELEASE_TO_CANVAS.
// - Clear stale release packets during HOLD or HARD_BLOCK.
// - Preserve no Canvas child scanning, no F21 claim, no ready text, no completion latch, no final visual pass, no generated image, no GraphicBox, and no WebGL.

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_TNT_v4_6_3";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_RECEIPT_v4_6_3";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_TNT_v4_6_2";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_2";

  const VERSION = "2026-06-02.lab-runtime-table-west-north-timetable-aligned-local-admissibility-clutch-v4-6-3";

  const FILE = "/assets/lab/runtime-table.west.js";
  const ROUTE = "/showroom/globe/hearth/";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_LOCAL_STATION_FILE = "/assets/hearth/hearth.canvas.js";

  const ACTIVE_STAGE_ID = "C2_WEST_CANVAS_RELEASE_AUDIT";
  const ACTIVE_GEAR = "GEAR_C2_WEST_CANVAS_RELEASE_AUDIT";
  const ACTIVE_CYCLE_NUMBER = 2;
  const ACTIVE_CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const ACTIVE_CARDINAL = "WEST";
  const ACTIVE_FIBONACCI = "F13W";
  const ACTIVE_NEWS_GATE = "WEST";

  const CANVAS_LOCAL_STATION_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const CANVAS_BASELINE_V10_3_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3";

  const WEST_DECISION = Object.freeze({
    HOLD: "HOLD",
    HARD_BLOCK: "HARD_BLOCK",
    RELEASE_TO_CANVAS: "RELEASE_TO_CANVAS"
  });

  const WEST_GAP_CLASS = Object.freeze({
    NONE: "NONE",
    NORTH_TIMETABLE_HOLD: "WAITING_NORTH_TIMETABLE",
    SOUTH_OUTPUT_HOLD: "WAITING_CYCLE_TWO_SOUTH_OUTPUT",
    CANVAS_LOCAL_STATION_HOLD: "WAITING_CURRENT_CANVAS_LOCAL_STATION",
    CARRIER_HOLD: "CARRIER_HOLD",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK"
  });

  const OUTPUT_MARKERS = Object.freeze([
    "westHandoffPacketReady",
    "outputSpreadComposed",
    "southOutputReady",
    "cycleTwoSouthOutputReady",
    "southOutputAdmissible",
    "southVisibleProofReady",
    "canvasSouthVisibleProofReady",
    "proofBodyComposed",
    "receiptComposed",
    "visibleStateComposed",
    "routeConductorOutputReady",
    "routeConductorReleaseCandidate"
  ]);

  const TRUE_ONLY_UNSAFE_KEYS = Object.freeze([
    "currentParentIdentityMismatch",
    "canvasParentIdentityMismatch",
    "currentParentStaleDetected",
    "canvasParentStaleDetected",
    "staleParentDetected"
  ]);

  const FALSE_IS_UNSAFE_KEYS = Object.freeze([
    "structuralCarrierSafe",
    "hearthCanvasStructuralCarrierSafe",
    "canvasParentCarrierSafe",
    "hearthCanvasParentCarrierSafe",
    "structuralCarrierSafeForCanvasRelease",
    "hearthCanvasStructuralCarrierSafeForCanvasRelease",
    "canvasPreReleaseCarrierSafeForWest",
    "hearthCanvasPreReleaseCarrierSafeForWest"
  ]);

  const NON_EMPTY_ERROR_KEYS = Object.freeze([
    "canvasCarrierHandoffError",
    "carrierHandoffError"
  ]);

  const state = {
    timestamp: "",
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "lab-runtime-table-cardinal-west-north-timetable-aligned-local-admissibility-clutch",

    westV4_6_3Active: true,
    westV4_6_2Superseded: true,
    westV4_6_1Superseded: true,
    westV4_6Superseded: true,
    westV4_5Superseded: true,
    westV4_4Superseded: true,
    westV4_3Superseded: true,
    westV4_2Superseded: true,

    northTimetableAlignmentActive: true,
    northTimetableObserved: false,
    northSourceMethod: "NONE",
    northActiveStageId: "",
    northActiveGearId: "",
    northActiveCycleNumber: 0,
    northActiveCycleRoute: "",
    northActiveCardinal: "",
    northActiveFileGate: "",
    northActiveFibonacci: "",
    northActiveNewsGate: "",
    northC2WestAuditAligned: false,

    cycleNumber: 0,
    cycleRoute: "",
    receivedFrom: "UNKNOWN",
    handoffTo: "UNKNOWN",
    activeCycleInputCardinal: "",
    activeCycleHandoffTarget: "",

    indexPairReady: false,
    carrierHostAdmissibilityReady: false,
    f8SelfDutySatisfied: false,

    southOutputReady: false,
    explicitSouthOutputMarkerObserved: false,
    explicitSouthOutputMarkers: [],
    cycleTwoSouthOutputObserved: false,
    cycleTwoSouthOutputAdmissible: false,
    southOutputIntakeMethod: "NONE",

    currentCanvasParentObserved: false,
    currentCanvasParentContractObserved: false,
    currentCanvasParentContract: "",
    currentCanvasParentIsLocalStation: false,
    canvasLocalStationContractAccepted: false,
    canvasBaselineV10_3Recognized: false,
    v10_3BaselineRecognizedOnly: false,
    v11OrV11_1RequiredForLocalStationPass: true,
    canvasLocalStationApiReady: false,
    canvasLocalStationSummaryObserved: false,
    canvasLocalStationReceiveSurfaceReady: false,
    canvasLocalStationSourceMethod: "NONE",
    selectedCanvasProofRank: 99,
    selectedCanvasProofUnsafe: false,

    carrierIdentitySafe: false,
    carrierSafeMarkerObserved: false,
    preReleaseCarrierAdmissible: false,
    carrierHardBlock: false,
    carrierHeld: true,
    carrierHoldReason: "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",
    explicitUnsafeFields: [],

    westAuditObserved: true,
    westAuditIntakeAccepted: false,
    westAuditAccepted: false,
    westAuditPassed: false,
    westDecision: WEST_DECISION.HOLD,
    westGapClass: WEST_GAP_CLASS.NORTH_TIMETABLE_HOLD,
    westHardBlock: false,
    westForwardAllowed: false,
    westCanvasReleaseApproved: false,

    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseApprovedByWest: false,
    releaseToCanvas: false,
    canvasReleaseHeldReason: "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",
    releasePacket: null,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21ClaimedByWest: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    firstFailedCoordinate: "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",
    recommendedNextFile: NORTH_FILE,
    recommendedNextRenewalTarget: NORTH_FILE,
    postgameStatus: "WEST_HOLD_WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",

    lastInput: null,
    lastNorthEvidence: null,
    lastCanvasProof: null,
    lastCanvasCandidates: [],
    lastReceipt: null
  };

  function root() {
    if (typeof window !== "undefined") return window;
    if (typeof globalThis !== "undefined") return globalThis;
    return {};
  }

  function documentRef() {
    const w = root();
    return w.document || null;
  }

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

  function trimText(value) {
    if (value === undefined || value === null) return "";
    return String(value).trim();
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = trimText(value);
      if (text) return text;
    }
    return "";
  }

  function toBool(value) {
    if (value === true) return true;
    if (value === false) return false;
    if (value === 1) return true;
    if (value === 0) return false;
    if (value === "1") return true;
    if (value === "0") return false;
    if (typeof value === "string") {
      const text = value.trim().toLowerCase();
      if (text === "true" || text === "yes" || text === "pass") return true;
      if (text === "false" || text === "no" || text === "fail") return false;
    }
    return false;
  }

  function isExplicitFalse(value) {
    if (value === false) return true;
    if (value === 0) return true;
    if (value === "0") return true;
    if (typeof value === "string") return value.trim().toLowerCase() === "false";
    return false;
  }

  function isExplicitTrue(value) {
    if (value === true) return true;
    if (value === 1) return true;
    if (value === "1") return true;
    if (typeof value === "string") return value.trim().toLowerCase() === "true";
    return false;
  }

  function toNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function safeCall(fn, fallback = null) {
    try {
      if (isFunction(fn)) return fn();
    } catch (_error) {
      return fallback;
    }
    return fallback;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = String(path || "").split(".");
    let cursor = root();

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function dataset() {
    const doc = documentRef();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
  }

  function setDataset(key, value) {
    const ds = dataset();
    if (!ds) return;
    ds[key] = value === undefined || value === null ? "" : String(value);
  }

  function readFirst(source, keys) {
    if (!isObject(source)) return undefined;
    for (const key of keys) {
      if (own(source, key) && source[key] !== undefined && source[key] !== null && String(source[key]).trim() !== "") {
        return source[key];
      }
    }
    return undefined;
  }

  function readBoolField(source, keys) {
    const value = readFirst(source, keys);
    return value === undefined ? false : toBool(value);
  }

  function readNumberField(source, keys, fallback = 0) {
    const value = readFirst(source, keys);
    return value === undefined ? fallback : toNumber(value, fallback);
  }

  function methodReceipt(authority, methodNames) {
    if (!authority || !isObject(authority)) return null;

    for (const methodName of methodNames) {
      if (!isFunction(authority[methodName])) continue;
      const result = safeCall(() => authority[methodName](), null);
      if (isObject(result)) return { method: methodName, receipt: result };
    }

    return null;
  }

  function readNorthAuthorityReceipt() {
    const candidates = [
      ["LAB_RUNTIME_TABLE_NORTH", root().LAB_RUNTIME_TABLE_NORTH],
      ["LAB_RUNTIME_TABLE", root().LAB_RUNTIME_TABLE],
      ["HEARTH_NORTH_COMMAND_RUNTIME_TABLE", root().HEARTH_NORTH_COMMAND_RUNTIME_TABLE],
      ["HEARTH_NORTH_COMMAND", root().HEARTH_NORTH_COMMAND],
      ["LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION", root().LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION],
      ["DEXTER_LAB.runtimeTable", readPath("DEXTER_LAB.runtimeTable")],
      ["DEXTER_LAB.cardinalRuntimeTableNorth", readPath("DEXTER_LAB.cardinalRuntimeTableNorth")],
      ["DEXTER_LAB.northCentralTrainStation", readPath("DEXTER_LAB.northCentralTrainStation")],
      ["DEXTER_LAB.hearthCheckpointSession", readPath("DEXTER_LAB.hearthCheckpointSession")],
      ["HEARTH.northCentralTrainStation", readPath("HEARTH.northCentralTrainStation")],
      ["HEARTH.northCommandRuntimeTable", readPath("HEARTH.northCommandRuntimeTable")]
    ];

    const methods = [
      "getReceiptLight",
      "getTransmissionReceipt",
      "getNorthCommandReceipt",
      "getActiveGateState",
      "getReceipt"
    ];

    for (const [name, candidate] of candidates) {
      if (!candidate || !isObject(candidate)) continue;

      const called = methodReceipt(candidate, methods);
      if (called) {
        return {
          sourceMethod: `${name}.${called.method}`,
          proof: called.receipt
        };
      }

      if (isObject(candidate.receipt)) {
        return {
          sourceMethod: `${name}.receipt`,
          proof: candidate.receipt
        };
      }

      if (candidate.contract || candidate.activeStageId || candidate.activeCycleNumber || candidate.activeGear || candidate.activeGearId) {
        return {
          sourceMethod: name,
          proof: candidate
        };
      }
    }

    const directReceipts = [
      ["LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT", root().LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT],
      ["HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT", root().HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT],
      ["HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT", root().HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT]
    ];

    for (const [name, proof] of directReceipts) {
      if (isObject(proof)) {
        return {
          sourceMethod: name,
          proof
        };
      }
    }

    return {
      sourceMethod: "NONE",
      proof: null
    };
  }

  function normalizeNorthTimetable(source, sourceMethod) {
    const s = isObject(source) ? source : {};
    const ds = dataset();

    const merged = {
      ...ds,
      ...s
    };

    const normalized = {
      northTimetableObserved: Boolean(source),
      northSourceMethod: sourceMethod || "NONE",
      northActiveStageId: trimText(readFirst(merged, [
        "activeStageId",
        "northActiveStageId",
        "hearthNorthActiveStageId",
        "stageId"
      ])),
      northActiveGearId: trimText(readFirst(merged, [
        "activeGear",
        "activeGearId",
        "northActiveGear",
        "northActiveGearId",
        "hearthNorthActiveGear",
        "hearthNorthActiveGearId",
        "gear",
        "gearId"
      ])),
      northActiveCycleNumber: readNumberField(merged, [
        "activeCycleNumber",
        "cycleNumber",
        "northActiveCycleNumber",
        "hearthNorthActiveCycleNumber"
      ], 0),
      northActiveCycleRoute: trimText(readFirst(merged, [
        "activeCycleRoute",
        "cycleRoute",
        "northActiveCycleRoute",
        "hearthNorthActiveCycleRoute"
      ])),
      northActiveCardinal: trimText(readFirst(merged, [
        "activeCardinal",
        "northActiveCardinal",
        "hearthNorthActiveCardinal"
      ])),
      northActiveFileGate: trimText(readFirst(merged, [
        "activeFileGate",
        "fileGate",
        "northActiveFileGate",
        "hearthNorthActiveFileGate"
      ])),
      northActiveFibonacci: trimText(readFirst(merged, [
        "activeFibonacci",
        "northActiveFibonacci",
        "hearthNorthActiveFibonacci"
      ])),
      northActiveNewsGate: trimText(readFirst(merged, [
        "activeNewsGate",
        "northActiveNewsGate",
        "hearthNorthActiveNewsGate"
      ]))
    };

    normalized.northC2WestAuditAligned = Boolean(
      normalized.northActiveStageId === ACTIVE_STAGE_ID &&
      (!normalized.northActiveGearId || normalized.northActiveGearId === ACTIVE_GEAR) &&
      normalized.northActiveCycleNumber === ACTIVE_CYCLE_NUMBER &&
      normalized.northActiveCycleRoute === ACTIVE_CYCLE_ROUTE &&
      normalized.northActiveCardinal === ACTIVE_CARDINAL &&
      normalized.northActiveFileGate === FILE
    );

    return normalized;
  }

  function readNorthTimetableLight() {
    const found = readNorthAuthorityReceipt();
    const normalized = normalizeNorthTimetable(found.proof, found.sourceMethod);

    state.lastNorthEvidence = clonePlain({
      sourceMethod: found.sourceMethod,
      proof: found.proof,
      normalized
    });

    state.northTimetableObserved = normalized.northTimetableObserved;
    state.northSourceMethod = normalized.northSourceMethod;
    state.northActiveStageId = normalized.northActiveStageId;
    state.northActiveGearId = normalized.northActiveGearId;
    state.northActiveCycleNumber = normalized.northActiveCycleNumber;
    state.northActiveCycleRoute = normalized.northActiveCycleRoute;
    state.northActiveCardinal = normalized.northActiveCardinal;
    state.northActiveFileGate = normalized.northActiveFileGate;
    state.northActiveFibonacci = normalized.northActiveFibonacci;
    state.northActiveNewsGate = normalized.northActiveNewsGate;
    state.northC2WestAuditAligned = normalized.northC2WestAuditAligned;

    return normalized;
  }

  function normalizeCycleInput(input) {
    const packet = isObject(input) ? clonePlain(input) : {};
    const ds = dataset();
    const merged = {
      ...ds,
      ...packet
    };

    const cycleNumber = readNumberField(merged, [
      "cycleNumber",
      "activeCycleNumber",
      "hearthCycleNumber",
      "hearthRouteConductorCycleNumber",
      "hearthSouthCycleNumber",
      "hearthWestCycleNumber"
    ], 0);

    const cycleRoute = trimText(readFirst(merged, [
      "cycleRoute",
      "activeCycleRoute",
      "hearthCycleRoute",
      "hearthRouteConductorCycleRoute",
      "hearthSouthCycleRoute",
      "hearthWestCycleRoute"
    ]));

    const receivedFrom = trimText(readFirst(merged, [
      "receivedFrom",
      "hearthReceivedFrom",
      "hearthRouteConductorReceivedFrom",
      "hearthSouthReceivedFrom",
      "hearthWestReceivedFrom"
    ]));

    const handoffTo = trimText(readFirst(merged, [
      "handoffTo",
      "activeCycleHandoffTarget",
      "hearthHandoffTo",
      "hearthRouteConductorHandoffTo",
      "hearthSouthHandoffTo",
      "hearthWestHandoffTo"
    ]));

    const activeCycleInputCardinal = trimText(readFirst(merged, [
      "activeCycleInputCardinal",
      "hearthActiveCycleInputCardinal",
      "hearthRouteConductorActiveCycleInputCardinal",
      "hearthSouthActiveCycleInputCardinal"
    ]));

    const activeCycleHandoffTarget = trimText(readFirst(merged, [
      "activeCycleHandoffTarget",
      "hearthActiveCycleHandoffTarget",
      "hearthRouteConductorActiveCycleHandoffTarget"
    ]));

    const indexPairReady = readBoolField(merged, [
      "indexPairReady",
      "hearthIndexPairReady",
      "hearthRouteConductorIndexPairReady",
      "hearthSouthIndexPairReady"
    ]);

    const carrierHostAdmissibilityReady = readBoolField(merged, [
      "carrierHostAdmissibilityReady",
      "hearthCarrierHostAdmissibilityReady",
      "hearthRouteConductorCarrierHostAdmissibilityReady",
      "hearthSouthCarrierHostAdmissibilityReady"
    ]);

    const f8SelfDutySatisfied = readBoolField(merged, [
      "f8SelfDutySatisfied",
      "hearthF8SelfDutySatisfied",
      "hearthRouteConductorF8SelfDutySatisfied",
      "hearthSouthF8SelfDutySatisfied"
    ]);

    const explicitMarkers = [];
    let outputReady = false;

    for (const marker of OUTPUT_MARKERS) {
      const aliases = [
        marker,
        `hearth${marker.charAt(0).toUpperCase()}${marker.slice(1)}`,
        `hearthSouth${marker.charAt(0).toUpperCase()}${marker.slice(1)}`,
        `hearthRouteConductor${marker.charAt(0).toUpperCase()}${marker.slice(1)}`
      ];

      const value = readFirst(merged, aliases);
      if (value !== undefined && toBool(value)) {
        explicitMarkers.push(marker);
        outputReady = true;
      }
    }

    const routeAligned = cycleNumber === ACTIVE_CYCLE_NUMBER && cycleRoute === ACTIVE_CYCLE_ROUTE;
    const sourceIsSouth = receivedFrom === "SOUTH" || activeCycleInputCardinal === "SOUTH";
    const targetIsWest = handoffTo === "WEST" || activeCycleHandoffTarget === "WEST";

    const observed = Boolean(routeAligned && sourceIsSouth && targetIsWest);
    const admissible = Boolean(
      observed &&
      indexPairReady &&
      carrierHostAdmissibilityReady &&
      f8SelfDutySatisfied &&
      outputReady
    );

    state.cycleNumber = cycleNumber;
    state.cycleRoute = cycleRoute;
    state.receivedFrom = receivedFrom || "UNKNOWN";
    state.handoffTo = handoffTo || activeCycleHandoffTarget || "UNKNOWN";
    state.activeCycleInputCardinal = activeCycleInputCardinal;
    state.activeCycleHandoffTarget = activeCycleHandoffTarget;
    state.indexPairReady = indexPairReady;
    state.carrierHostAdmissibilityReady = carrierHostAdmissibilityReady;
    state.f8SelfDutySatisfied = f8SelfDutySatisfied;
    state.southOutputReady = outputReady;
    state.explicitSouthOutputMarkerObserved = outputReady;
    state.explicitSouthOutputMarkers = explicitMarkers.slice();
    state.cycleTwoSouthOutputObserved = observed;
    state.cycleTwoSouthOutputAdmissible = admissible;
    state.southOutputIntakeMethod = observed ? "NORTH_OR_ROUTE_CONFIRMED_SOUTH_TO_WEST_CYCLE_TWO" : "NONE";

    state.lastInput = clonePlain({
      packet,
      cycleNumber,
      cycleRoute,
      receivedFrom,
      handoffTo,
      activeCycleInputCardinal,
      activeCycleHandoffTarget,
      indexPairReady,
      carrierHostAdmissibilityReady,
      f8SelfDutySatisfied,
      explicitMarkers,
      observed,
      admissible
    });

    return {
      cycleNumber,
      cycleRoute,
      receivedFrom,
      handoffTo,
      activeCycleInputCardinal,
      activeCycleHandoffTarget,
      indexPairReady,
      carrierHostAdmissibilityReady,
      f8SelfDutySatisfied,
      southOutputReady: outputReady,
      explicitSouthOutputMarkers: explicitMarkers,
      cycleTwoSouthOutputObserved: observed,
      cycleTwoSouthOutputAdmissible: admissible
    };
  }

  function inputCallsWestForCycleTwoAudit(input) {
    const packet = isObject(input) ? input : {};
    const ds = dataset();
    const merged = {
      ...ds,
      ...packet
    };

    const cycleNumber = readNumberField(merged, [
      "cycleNumber",
      "activeCycleNumber",
      "hearthCycleNumber",
      "hearthRouteConductorCycleNumber"
    ], 0);

    const cycleRoute = trimText(readFirst(merged, [
      "cycleRoute",
      "activeCycleRoute",
      "hearthCycleRoute",
      "hearthRouteConductorCycleRoute"
    ]));

    const handoffTo = trimText(readFirst(merged, [
      "handoffTo",
      "activeCycleHandoffTarget",
      "hearthHandoffTo",
      "hearthRouteConductorHandoffTo"
    ]));

    const receivedFrom = trimText(readFirst(merged, [
      "receivedFrom",
      "hearthReceivedFrom",
      "hearthRouteConductorReceivedFrom",
      "hearthSouthReceivedFrom"
    ]));

    const activeCycleInputCardinal = trimText(readFirst(merged, [
      "activeCycleInputCardinal",
      "hearthRouteConductorActiveCycleInputCardinal"
    ]));

    const activeCycleHandoffTarget = trimText(readFirst(merged, [
      "activeCycleHandoffTarget",
      "hearthRouteConductorActiveCycleHandoffTarget"
    ]));

    const indexPairReady = readBoolField(merged, ["indexPairReady", "hearthRouteConductorIndexPairReady", "hearthIndexPairReady"]);
    const carrierHostAdmissibilityReady = readBoolField(merged, ["carrierHostAdmissibilityReady", "hearthRouteConductorCarrierHostAdmissibilityReady", "hearthCarrierHostAdmissibilityReady"]);
    const f8SelfDutySatisfied = readBoolField(merged, ["f8SelfDutySatisfied", "hearthRouteConductorF8SelfDutySatisfied", "hearthF8SelfDutySatisfied"]);

    const pathAligned = cycleNumber === ACTIVE_CYCLE_NUMBER && cycleRoute === ACTIVE_CYCLE_ROUTE;
    const targetAligned = handoffTo === "WEST" || activeCycleHandoffTarget === "WEST";
    const sourceAligned = receivedFrom === "SOUTH" || activeCycleInputCardinal === "SOUTH";

    const directInputAligned = Boolean(pathAligned && targetAligned && sourceAligned);
    const routeConductorAligned = Boolean(pathAligned && activeCycleInputCardinal === "SOUTH" && activeCycleHandoffTarget === "WEST" && indexPairReady && carrierHostAdmissibilityReady && f8SelfDutySatisfied);

    return directInputAligned || routeConductorAligned;
  }

  function isNorthCallingWestForCycleTwoCanvasAudit(input) {
    const north = readNorthTimetableLight();
    const inputAligned = inputCallsWestForCycleTwoAudit(input);
    state.northC2WestAuditAligned = Boolean(north.northC2WestAuditAligned || inputAligned);
    return state.northC2WestAuditAligned;
  }

  function canvasAuthorityCandidates() {
    return [
      ["HEARTH_CANVAS_LOCAL_STATION", root().HEARTH_CANVAS_LOCAL_STATION],
      ["HEARTH_CANVAS_STATION", root().HEARTH_CANVAS_STATION],
      ["HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD", root().HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD],
      ["HEARTH_CANVAS", root().HEARTH_CANVAS],
      ["HEARTH.canvasLocalStation", readPath("HEARTH.canvasLocalStation")],
      ["HEARTH.canvasStation", readPath("HEARTH.canvasStation")],
      ["HEARTH.canvasChildDistributionSwitchboard", readPath("HEARTH.canvasChildDistributionSwitchboard")],
      ["HEARTH.canvas", readPath("HEARTH.canvas")],
      ["DEXTER_LAB.hearthCanvasLocalStation", readPath("DEXTER_LAB.hearthCanvasLocalStation")],
      ["DEXTER_LAB.hearthCanvasStation", readPath("DEXTER_LAB.hearthCanvasStation")],
      ["DEXTER_LAB.hearthCanvasChildDistributionSwitchboard", readPath("DEXTER_LAB.hearthCanvasChildDistributionSwitchboard")],
      ["DEXTER_LAB.hearthCanvas", readPath("DEXTER_LAB.hearthCanvas")]
    ];
  }

  function readCanvasProofFromCandidate(candidate) {
    if (!candidate || !isObject(candidate)) return null;

    const methodResult = methodReceipt(candidate, [
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getReceiptLight",
      "getReceipt"
    ]);

    if (methodResult) {
      return {
        method: methodResult.method,
        proof: methodResult.receipt
      };
    }

    if (isObject(candidate.canvasStationSummary)) return { method: "canvasStationSummary", proof: candidate.canvasStationSummary };
    if (isObject(candidate.stationSummary)) return { method: "stationSummary", proof: candidate.stationSummary };
    if (isObject(candidate.receipt)) return { method: "receipt", proof: candidate.receipt };

    return {
      method: "authorityObject",
      proof: candidate
    };
  }

  function contractFromProof(proof) {
    const p = isObject(proof) ? proof : {};
    return firstNonEmpty(
      p.canvasLocalStationContract,
      p.currentCanvasStationContract,
      p.currentCanvasParentContract,
      p.canvasStationContract,
      p.contract,
      p.hearthCanvasContract,
      p.hearthCanvasLocalStationContract,
      p.hearthCanvasCurrentCanvasStationContract,
      p.hearthCanvasCurrentCanvasParentContract
    );
  }

  function hasReceiveSurface(api) {
    if (!api || !isObject(api)) return false;
    return Boolean(
      isFunction(api.consumeRouteConductorReleasePacket) ||
      isFunction(api.receiveReleasePacket) ||
      isFunction(api.receiveCanvasReleasePacket) ||
      isFunction(api.receiveCanvasStationSummary) ||
      isFunction(api.boot) ||
      isFunction(api.init) ||
      isFunction(api.start) ||
      isFunction(api.mount)
    );
  }

  function unsafeFieldsFromProof(proof) {
    const p = isObject(proof) ? proof : {};
    const fields = [];

    TRUE_ONLY_UNSAFE_KEYS.forEach((key) => {
      if (own(p, key) && isExplicitTrue(p[key])) fields.push(key);
    });

    FALSE_IS_UNSAFE_KEYS.forEach((key) => {
      if (own(p, key) && isExplicitFalse(p[key])) fields.push(key);
    });

    NON_EMPTY_ERROR_KEYS.forEach((key) => {
      if (own(p, key) && trimText(p[key])) fields.push(key);
    });

    const v2Observed =
      (own(p, "canvasParentV2Observed") && isExplicitTrue(p.canvasParentV2Observed)) ||
      (own(p, "hearthCanvasParentV2Observed") && isExplicitTrue(p.hearthCanvasParentV2Observed));

    const staleFalsePositiveBlocked =
      readBoolField(p, [
        "hearthCanvasStaleParentV2FalsePositiveBlocked",
        "canvasStaleParentV2FalsePositiveBlocked",
        "staleCanvasV2FalsePositiveBlocked"
      ]);

    if (v2Observed && !staleFalsePositiveBlocked) fields.push("canvasParentV2Observed");

    return fields;
  }

  function normalizeCanvasProof(name, api, proof, method) {
    const p = isObject(proof) ? proof : {};
    const contract = contractFromProof(p);
    const localAccepted = CANVAS_LOCAL_STATION_CONTRACTS.includes(contract);
    const baselineV10_3 = contract === CANVAS_BASELINE_V10_3_CONTRACT;
    const explicitUnsafeFields = unsafeFieldsFromProof(p);
    const unsafe = explicitUnsafeFields.length > 0;

    const summaryObserved = Boolean(
      method === "getCanvasStationSummary" ||
      method === "getCanvasStationReceiptLight" ||
      method === "getCanvasStationReceipt" ||
      readBoolField(p, ["canvasLocalStationSummaryObserved", "summaryObserved", "canvasStationSummaryObserved"]) ||
      p.packetType === "CANVAS_LOCAL_STATION_SUMMARY" ||
      p.packetType === "CANVAS_LOCAL_STATION_RECEIPT"
    );

    const apiReady = Boolean(
      readBoolField(p, ["canvasLocalStationApiReady", "apiReady"]) ||
      localAccepted ||
      (api && isObject(api))
    );

    const receiveSurfaceReady = Boolean(
      hasReceiveSurface(api) ||
      readBoolField(p, ["canvasLocalStationReceiveSurfaceReady", "receiveSurfaceReady"])
    );

    const carrierSafeMarkerObserved = Boolean(
      readBoolField(p, ["structuralCarrierReady", "hearthCanvasStructuralCarrierReady"]) ||
      readBoolField(p, ["structuralCarrierSafe", "hearthCanvasStructuralCarrierSafe"]) ||
      readBoolField(p, ["canvasParentCarrierSafe", "hearthCanvasParentCarrierSafe"]) ||
      readBoolField(p, ["structuralCarrierSafeForCanvasRelease", "hearthCanvasStructuralCarrierSafeForCanvasRelease"]) ||
      readBoolField(p, ["canvasPreReleaseCarrierSafeForWest", "hearthCanvasPreReleaseCarrierSafeForWest"]) ||
      (localAccepted && summaryObserved)
    );

    const unrecognizedCurrentCanvasContract = Boolean(contract && !localAccepted && !baselineV10_3);
    if (unrecognizedCurrentCanvasContract && !explicitUnsafeFields.includes("unrecognizedCurrentCanvasContract")) {
      explicitUnsafeFields.push("unrecognizedCurrentCanvasContract");
    }

    const finalUnsafe = explicitUnsafeFields.length > 0;

    let rank = 99;

    if (finalUnsafe) {
      rank = 6;
    } else if (localAccepted && summaryObserved && apiReady && receiveSurfaceReady) {
      rank = 1;
    } else if (localAccepted && apiReady && receiveSurfaceReady) {
      rank = 2;
    } else if (localAccepted) {
      rank = 3;
    } else if (baselineV10_3) {
      rank = 4;
    } else if (contract) {
      rank = 5;
    }

    return {
      name,
      method,
      proof: clonePlain(p),
      contract,
      currentCanvasParentObserved: Boolean(api || contract),
      currentCanvasParentContractObserved: Boolean(contract),
      currentCanvasParentIsLocalStation: localAccepted,
      canvasLocalStationContractAccepted: localAccepted,
      canvasBaselineV10_3Recognized: baselineV10_3,
      v10_3BaselineRecognizedOnly: baselineV10_3,
      canvasLocalStationApiReady: apiReady && localAccepted,
      canvasLocalStationSummaryObserved: summaryObserved,
      canvasLocalStationReceiveSurfaceReady: receiveSurfaceReady,
      carrierSafeMarkerObserved,
      explicitUnsafeFields,
      carrierHardBlock: finalUnsafe,
      rank
    };
  }

  function readDatasetCanvasProof() {
    const ds = dataset();

    const contract = firstNonEmpty(
      ds.hearthCanvasLocalStationContract,
      ds.hearthCanvasCurrentCanvasStationContract,
      ds.hearthCanvasCurrentCanvasParentContract,
      ds.currentCanvasParentContract,
      ds.canvasLocalStationContract,
      ds.currentCanvasStationContract,
      ds.hearthCanvasContract
    );

    if (!contract) return null;

    return {
      contract,
      currentCanvasParentContract: contract,
      canvasLocalStationContract: contract,
      canvasLocalStationSummaryObserved: ds.hearthCanvasLocalStationSummaryObserved || ds.canvasLocalStationSummaryObserved,
      canvasLocalStationApiReady: ds.hearthCanvasLocalStationApiReady || ds.canvasLocalStationApiReady,
      canvasLocalStationReceiveSurfaceReady: ds.hearthCanvasLocalStationReceiveSurfaceReady || ds.canvasLocalStationReceiveSurfaceReady,
      structuralCarrierReady: ds.hearthCanvasStructuralCarrierReady || ds.structuralCarrierReady,
      structuralCarrierSafe: ds.hearthCanvasStructuralCarrierSafe || ds.structuralCarrierSafe,
      canvasParentCarrierSafe: ds.hearthCanvasParentCarrierSafe || ds.canvasParentCarrierSafe,
      structuralCarrierSafeForCanvasRelease: ds.hearthCanvasStructuralCarrierSafeForCanvasRelease || ds.structuralCarrierSafeForCanvasRelease,
      canvasPreReleaseCarrierSafeForWest: ds.hearthCanvasPreReleaseCarrierSafeForWest || ds.canvasPreReleaseCarrierSafeForWest,
      currentParentIdentityMismatch: ds.currentParentIdentityMismatch,
      canvasParentIdentityMismatch: ds.canvasParentIdentityMismatch,
      currentParentStaleDetected: ds.currentParentStaleDetected,
      canvasParentStaleDetected: ds.canvasParentStaleDetected,
      staleParentDetected: ds.staleParentDetected,
      canvasParentV2Observed: ds.hearthCanvasParentV2Observed || ds.canvasParentV2Observed,
      hearthCanvasStaleParentV2FalsePositiveBlocked: ds.hearthCanvasStaleParentV2FalsePositiveBlocked,
      canvasCarrierHandoffError: ds.canvasCarrierHandoffError,
      carrierHandoffError: ds.carrierHandoffError
    };
  }

  function selectCanvasLocalStationProof() {
    const candidates = [];

    for (const [name, api] of canvasAuthorityCandidates()) {
      if (!api || !isObject(api)) continue;
      const read = readCanvasProofFromCandidate(api);
      if (!read || !isObject(read.proof)) continue;
      candidates.push(normalizeCanvasProof(name, api, read.proof, read.method));
    }

    const datasetProof = readDatasetCanvasProof();
    if (datasetProof) {
      candidates.push(normalizeCanvasProof("DOCUMENT_DATASET_CANVAS_PROOF", null, datasetProof, "dataset"));
    }

    candidates.sort((a, b) => {
      const aUnsafe = Boolean(a.carrierHardBlock || (Array.isArray(a.explicitUnsafeFields) && a.explicitUnsafeFields.length));
      const bUnsafe = Boolean(b.carrierHardBlock || (Array.isArray(b.explicitUnsafeFields) && b.explicitUnsafeFields.length));

      if (aUnsafe !== bUnsafe) return aUnsafe ? 1 : -1;
      if (a.rank !== b.rank) return a.rank - b.rank;

      const aCurrent = a.canvasLocalStationContractAccepted ? 0 : 1;
      const bCurrent = b.canvasLocalStationContractAccepted ? 0 : 1;
      if (aCurrent !== bCurrent) return aCurrent - bCurrent;

      return 0;
    });

    const selected = candidates[0] || {
      name: "NONE",
      method: "NONE",
      proof: null,
      contract: "",
      currentCanvasParentObserved: false,
      currentCanvasParentContractObserved: false,
      currentCanvasParentIsLocalStation: false,
      canvasLocalStationContractAccepted: false,
      canvasBaselineV10_3Recognized: false,
      v10_3BaselineRecognizedOnly: false,
      canvasLocalStationApiReady: false,
      canvasLocalStationSummaryObserved: false,
      canvasLocalStationReceiveSurfaceReady: false,
      carrierSafeMarkerObserved: false,
      explicitUnsafeFields: [],
      carrierHardBlock: false,
      rank: 99
    };

    state.lastCanvasCandidates = clonePlain(candidates);
    state.lastCanvasProof = clonePlain(selected);

    state.currentCanvasParentObserved = selected.currentCanvasParentObserved;
    state.currentCanvasParentContractObserved = selected.currentCanvasParentContractObserved;
    state.currentCanvasParentContract = selected.contract;
    state.currentCanvasParentIsLocalStation = selected.currentCanvasParentIsLocalStation;
    state.canvasLocalStationContractAccepted = selected.canvasLocalStationContractAccepted;
    state.canvasBaselineV10_3Recognized = selected.canvasBaselineV10_3Recognized;
    state.v10_3BaselineRecognizedOnly = selected.v10_3BaselineRecognizedOnly;
    state.canvasLocalStationApiReady = selected.canvasLocalStationApiReady;
    state.canvasLocalStationSummaryObserved = selected.canvasLocalStationSummaryObserved;
    state.canvasLocalStationReceiveSurfaceReady = selected.canvasLocalStationReceiveSurfaceReady;
    state.canvasLocalStationSourceMethod = `${selected.name}:${selected.method}`;
    state.selectedCanvasProofRank = selected.rank;
    state.selectedCanvasProofUnsafe = Boolean(selected.carrierHardBlock);

    state.explicitUnsafeFields = selected.explicitUnsafeFields.slice();
    state.carrierHardBlock = selected.carrierHardBlock;
    state.carrierSafeMarkerObserved = selected.carrierSafeMarkerObserved;
    state.carrierIdentitySafe = Boolean(
      selected.currentCanvasParentObserved &&
      selected.currentCanvasParentIsLocalStation &&
      selected.canvasLocalStationContractAccepted &&
      !selected.carrierHardBlock
    );

    state.preReleaseCarrierAdmissible = Boolean(
      state.carrierIdentitySafe &&
      state.canvasLocalStationApiReady &&
      state.canvasLocalStationSummaryObserved &&
      state.canvasLocalStationReceiveSurfaceReady &&
      state.carrierSafeMarkerObserved &&
      !state.carrierHardBlock
    );

    if (state.preReleaseCarrierAdmissible) {
      state.carrierHeld = false;
      state.carrierHoldReason = "NONE_PRE_RELEASE_CARRIER_ADMISSIBLE";
    } else if (selected.canvasBaselineV10_3Recognized) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_LOCAL_STATION_CONTRACT";
    } else if (!selected.currentCanvasParentObserved) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_LOCAL_STATION_PROOF";
    } else if (!selected.canvasLocalStationContractAccepted && !selected.carrierHardBlock) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_LOCAL_STATION_CONTRACT";
    } else if (!state.carrierSafeMarkerObserved) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_LOCAL_STATION_CARRIER_SAFE_MARKER";
    } else if (!state.canvasLocalStationSummaryObserved || !state.canvasLocalStationApiReady || !state.canvasLocalStationReceiveSurfaceReady) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_LOCAL_STATION_SUMMARY_API";
    } else {
      state.carrierHeld = false;
      state.carrierHoldReason = state.carrierHardBlock ? "STRUCTURAL_CARRIER_UNSAFE_FOR_CANVAS" : "NONE";
    }

    return selected;
  }

  function clearCanvasReleasePacket() {
    const w = root();
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

    state.releasePacket = null;
    return true;
  }

  function blockFinalClaims() {
    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21EligibilitySubmittedToNorth = false;
    state.f21ClaimedByWest = false;
    state.completionLatched = false;
    state.finalCompletionLatched = false;
    state.degradedCompletionLatched = false;
    state.readyTextAllowed = false;
    state.visualPassClaimed = false;
    state.generatedImage = false;
    state.graphicBox = false;
    state.webGL = false;
  }

  function applyHold(reason, nextFile, gapClass) {
    state.westAuditObserved = true;
    state.westAuditIntakeAccepted = state.northC2WestAuditAligned;
    state.westAuditAccepted = false;
    state.westAuditPassed = false;
    state.westDecision = WEST_DECISION.HOLD;
    state.westGapClass = gapClass || WEST_GAP_CLASS.CARRIER_HOLD;
    state.westHardBlock = false;
    state.westForwardAllowed = false;
    state.westCanvasReleaseApproved = false;

    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseApprovedByWest = false;
    state.releaseToCanvas = false;
    state.canvasReleaseHeldReason = reason;
    state.firstFailedCoordinate = reason;
    state.recommendedNextFile = nextFile;
    state.recommendedNextRenewalTarget = nextFile;
    state.postgameStatus = `WEST_HOLD_${reason}`;

    blockFinalClaims();
    clearCanvasReleasePacket();

    return state.westDecision;
  }

  function applyHardBlock(reason, nextFile) {
    state.westAuditObserved = true;
    state.westAuditIntakeAccepted = state.northC2WestAuditAligned;
    state.westAuditAccepted = false;
    state.westAuditPassed = false;
    state.westDecision = WEST_DECISION.HARD_BLOCK;
    state.westGapClass = WEST_GAP_CLASS.STRUCTURAL_BLOCK;
    state.westHardBlock = true;
    state.westForwardAllowed = false;
    state.westCanvasReleaseApproved = false;

    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseApprovedByWest = false;
    state.releaseToCanvas = false;
    state.canvasReleaseHeldReason = reason;
    state.firstFailedCoordinate = reason;
    state.recommendedNextFile = nextFile;
    state.recommendedNextRenewalTarget = nextFile;
    state.postgameStatus = `WEST_HARD_BLOCK_${reason}`;

    blockFinalClaims();
    clearCanvasReleasePacket();

    return state.westDecision;
  }

  function composeCanvasReleasePacket() {
    return {
      timestamp: nowIso(),
      event: "WEST_RELEASE_TO_CANVAS",
      checkpointEvent: "F13W_CANVAS_RELEASE_APPROVED",
      primaryCardinal: "WEST",
      activeStageId: ACTIVE_STAGE_ID,
      activeGear: ACTIVE_GEAR,
      activeFileGate: FILE,
      fileGate: FILE,
      activeFibonacci: ACTIVE_FIBONACCI,
      activeNewsGate: ACTIVE_NEWS_GATE,

      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      sourceFile: FILE,
      westSourceFile: FILE,
      route: ROUTE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,

      cycleNumber: ACTIVE_CYCLE_NUMBER,
      cycleRoute: ACTIVE_CYCLE_ROUTE,
      receivedFrom: "WEST",
      handoffTo: "CANVAS",
      destinationFile: CANVAS_LOCAL_STATION_FILE,
      targetFile: CANVAS_LOCAL_STATION_FILE,

      westAuditObserved: true,
      westAuditIntakeAccepted: true,
      westAuditAccepted: true,
      westAuditPassed: true,
      westDecision: WEST_DECISION.RELEASE_TO_CANVAS,
      westGapClass: WEST_GAP_CLASS.NONE,
      westHardBlock: false,
      westForwardAllowed: true,
      westCanvasReleaseApproved: true,
      canvasReleaseApprovedByWest: true,

      canvasReleaseAuthorized: true,
      canvasReleasePacketReady: true,
      releaseToCanvas: true,

      northTimetableObserved: state.northTimetableObserved,
      northC2WestAuditAligned: state.northC2WestAuditAligned,
      cycleTwoSouthOutputObserved: state.cycleTwoSouthOutputObserved,
      cycleTwoSouthOutputAdmissible: state.cycleTwoSouthOutputAdmissible,
      canvasLocalStationContractAccepted: state.canvasLocalStationContractAccepted,
      currentCanvasParentContract: state.currentCanvasParentContract,
      preReleaseCarrierAdmissible: state.preReleaseCarrierAdmissible,

      firstFailedCoordinate: "NONE_CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_WEST",
      recommendedNextFile: CANVAS_LOCAL_STATION_FILE,
      recommendedNextRenewalTarget: CANVAS_LOCAL_STATION_FILE,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21ClaimedByWest: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };
  }

  function publishCanvasReleasePacket(packet) {
    if (!isObject(packet)) return false;

    const w = root();
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

  function applyRelease() {
    state.westAuditObserved = true;
    state.westAuditIntakeAccepted = true;
    state.westAuditAccepted = true;
    state.westAuditPassed = true;
    state.westDecision = WEST_DECISION.RELEASE_TO_CANVAS;
    state.westGapClass = WEST_GAP_CLASS.NONE;
    state.westHardBlock = false;
    state.westForwardAllowed = true;
    state.westCanvasReleaseApproved = true;

    state.canvasReleaseAuthorized = true;
    state.canvasReleasePacketReady = true;
    state.canvasReleaseApprovedByWest = true;
    state.releaseToCanvas = true;
    state.canvasReleaseHeldReason = "NONE_CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_WEST";
    state.firstFailedCoordinate = "NONE_CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_WEST";
    state.recommendedNextFile = CANVAS_LOCAL_STATION_FILE;
    state.recommendedNextRenewalTarget = CANVAS_LOCAL_STATION_FILE;
    state.postgameStatus = "CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_WEST";

    blockFinalClaims();

    const packet = composeCanvasReleasePacket();
    state.releasePacket = clonePlain(packet);
    publishCanvasReleasePacket(packet);

    return state.westDecision;
  }

  function decideWest(input) {
    state.timestamp = nowIso();
    state.westAuditObserved = true;

    isNorthCallingWestForCycleTwoCanvasAudit(input);
    normalizeCycleInput(input);
    selectCanvasLocalStationProof();

    if (!state.northC2WestAuditAligned) {
      return applyHold(
        "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",
        NORTH_FILE,
        WEST_GAP_CLASS.NORTH_TIMETABLE_HOLD
      );
    }

    state.westAuditIntakeAccepted = true;

    if (!state.cycleTwoSouthOutputAdmissible) {
      return applyHold(
        "WAITING_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBILITY",
        ROUTE_CONDUCTOR_FILE,
        WEST_GAP_CLASS.SOUTH_OUTPUT_HOLD
      );
    }

    if (state.carrierHardBlock || state.explicitUnsafeFields.length) {
      return applyHardBlock(
        "STRUCTURAL_CARRIER_UNSAFE_FOR_CANVAS",
        CANVAS_LOCAL_STATION_FILE
      );
    }

    if (state.canvasBaselineV10_3Recognized && !state.canvasLocalStationContractAccepted) {
      return applyHold(
        "WAITING_CURRENT_CANVAS_LOCAL_STATION_CONTRACT",
        CANVAS_LOCAL_STATION_FILE,
        WEST_GAP_CLASS.CANVAS_LOCAL_STATION_HOLD
      );
    }

    if (!state.currentCanvasParentObserved || !state.canvasLocalStationContractAccepted) {
      return applyHold(
        "WAITING_CURRENT_CANVAS_LOCAL_STATION_CONTRACT",
        CANVAS_LOCAL_STATION_FILE,
        WEST_GAP_CLASS.CANVAS_LOCAL_STATION_HOLD
      );
    }

    if (!state.canvasLocalStationApiReady || !state.canvasLocalStationSummaryObserved || !state.canvasLocalStationReceiveSurfaceReady) {
      return applyHold(
        "WAITING_CURRENT_CANVAS_LOCAL_STATION_SUMMARY_API",
        CANVAS_LOCAL_STATION_FILE,
        WEST_GAP_CLASS.CARRIER_HOLD
      );
    }

    if (!state.preReleaseCarrierAdmissible || !state.carrierSafeMarkerObserved) {
      return applyHold(
        "WAITING_CURRENT_CANVAS_LOCAL_STATION_CARRIER_SAFE_MARKER",
        CANVAS_LOCAL_STATION_FILE,
        WEST_GAP_CLASS.CARRIER_HOLD
      );
    }

    return applyRelease();
  }

  function classifyWestAdmissibility(input) {
    decideWest(input || {});
    updateDataset();
    publishGlobals();
    state.lastReceipt = clonePlain(getReceiptLight());
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
    return isObject(state.releasePacket) ? clonePlain(state.releasePacket) : null;
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
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      westV4_6_3Active: true,
      westV4_6_2Superseded: true,
      westV4_6_1Superseded: true,
      westV4_6Superseded: true,
      westV4_5Superseded: true,
      westV4_4Superseded: true,
      westV4_3Superseded: true,
      westV4_2Superseded: true,

      northTimetableAlignmentActive: true,
      northTimetableObserved: state.northTimetableObserved,
      northSourceMethod: state.northSourceMethod,
      northActiveStageId: state.northActiveStageId,
      northActiveGearId: state.northActiveGearId,
      northActiveCycleNumber: state.northActiveCycleNumber,
      northActiveCycleRoute: state.northActiveCycleRoute,
      northActiveCardinal: state.northActiveCardinal,
      northActiveFileGate: state.northActiveFileGate,
      northActiveFibonacci: state.northActiveFibonacci,
      northActiveNewsGate: state.northActiveNewsGate,
      northC2WestAuditAligned: state.northC2WestAuditAligned,

      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      receivedFrom: state.receivedFrom,
      handoffTo: state.handoffTo,
      activeCycleInputCardinal: state.activeCycleInputCardinal,
      activeCycleHandoffTarget: state.activeCycleHandoffTarget,
      indexPairReady: state.indexPairReady,
      carrierHostAdmissibilityReady: state.carrierHostAdmissibilityReady,
      f8SelfDutySatisfied: state.f8SelfDutySatisfied,

      southOutputReady: state.southOutputReady,
      explicitSouthOutputMarkerObserved: state.explicitSouthOutputMarkerObserved,
      explicitSouthOutputMarkers: state.explicitSouthOutputMarkers.slice(),
      cycleTwoSouthOutputObserved: state.cycleTwoSouthOutputObserved,
      cycleTwoSouthOutputAdmissible: state.cycleTwoSouthOutputAdmissible,
      southOutputIntakeMethod: state.southOutputIntakeMethod,

      currentCanvasParentObserved: state.currentCanvasParentObserved,
      currentCanvasParentContractObserved: state.currentCanvasParentContractObserved,
      currentCanvasParentContract: state.currentCanvasParentContract,
      currentCanvasParentIsLocalStation: state.currentCanvasParentIsLocalStation,
      canvasLocalStationContractAccepted: state.canvasLocalStationContractAccepted,
      canvasBaselineV10_3Recognized: state.canvasBaselineV10_3Recognized,
      v10_3BaselineRecognizedOnly: state.v10_3BaselineRecognizedOnly,
      v11OrV11_1RequiredForLocalStationPass: true,
      canvasLocalStationApiReady: state.canvasLocalStationApiReady,
      canvasLocalStationSummaryObserved: state.canvasLocalStationSummaryObserved,
      canvasLocalStationReceiveSurfaceReady: state.canvasLocalStationReceiveSurfaceReady,
      canvasLocalStationSourceMethod: state.canvasLocalStationSourceMethod,
      selectedCanvasProofRank: state.selectedCanvasProofRank,
      selectedCanvasProofUnsafe: state.selectedCanvasProofUnsafe,

      carrierIdentitySafe: state.carrierIdentitySafe,
      carrierSafeMarkerObserved: state.carrierSafeMarkerObserved,
      preReleaseCarrierAdmissible: state.preReleaseCarrierAdmissible,
      carrierHardBlock: state.carrierHardBlock,
      carrierHeld: state.carrierHeld,
      carrierHoldReason: state.carrierHoldReason,
      explicitUnsafeFields: state.explicitUnsafeFields.slice(),

      westAuditObserved: state.westAuditObserved,
      westAuditIntakeAccepted: state.westAuditIntakeAccepted,
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
      releasePacket: isObject(state.releasePacket) ? "present" : "null",
      canvasReleasePacket: isObject(state.releasePacket) ? "present" : "null",

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21ClaimedByWest: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      releasePacket: clonePlain(state.releasePacket),
      canvasReleasePacket: clonePlain(state.releasePacket),
      lastInput: clonePlain(state.lastInput),
      lastNorthEvidence: clonePlain(state.lastNorthEvidence),
      lastCanvasProof: clonePlain(state.lastCanvasProof),
      lastCanvasCandidates: clonePlain(state.lastCanvasCandidates)
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_RECEIPT",
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
      `northTimetableAlignmentActive=${r.northTimetableAlignmentActive}`,
      `northTimetableObserved=${r.northTimetableObserved}`,
      `northSourceMethod=${r.northSourceMethod}`,
      `northActiveStageId=${r.northActiveStageId}`,
      `northActiveGearId=${r.northActiveGearId}`,
      `northActiveCycleNumber=${r.northActiveCycleNumber}`,
      `northActiveCycleRoute=${r.northActiveCycleRoute}`,
      `northActiveCardinal=${r.northActiveCardinal}`,
      `northActiveFileGate=${r.northActiveFileGate}`,
      `northActiveFibonacci=${r.northActiveFibonacci}`,
      `northActiveNewsGate=${r.northActiveNewsGate}`,
      `northC2WestAuditAligned=${r.northC2WestAuditAligned}`,
      "",
      `cycleNumber=${r.cycleNumber}`,
      `cycleRoute=${r.cycleRoute}`,
      `receivedFrom=${r.receivedFrom}`,
      `handoffTo=${r.handoffTo}`,
      `activeCycleInputCardinal=${r.activeCycleInputCardinal}`,
      `activeCycleHandoffTarget=${r.activeCycleHandoffTarget}`,
      `indexPairReady=${r.indexPairReady}`,
      `carrierHostAdmissibilityReady=${r.carrierHostAdmissibilityReady}`,
      `f8SelfDutySatisfied=${r.f8SelfDutySatisfied}`,
      `southOutputReady=${r.southOutputReady}`,
      `cycleTwoSouthOutputObserved=${r.cycleTwoSouthOutputObserved}`,
      `cycleTwoSouthOutputAdmissible=${r.cycleTwoSouthOutputAdmissible}`,
      `southOutputIntakeMethod=${r.southOutputIntakeMethod}`,
      `explicitSouthOutputMarkers=${r.explicitSouthOutputMarkers.join(",") || "none"}`,
      "",
      `currentCanvasParentObserved=${r.currentCanvasParentObserved}`,
      `currentCanvasParentContractObserved=${r.currentCanvasParentContractObserved}`,
      `currentCanvasParentContract=${r.currentCanvasParentContract}`,
      `currentCanvasParentIsLocalStation=${r.currentCanvasParentIsLocalStation}`,
      `canvasLocalStationContractAccepted=${r.canvasLocalStationContractAccepted}`,
      `canvasBaselineV10_3Recognized=${r.canvasBaselineV10_3Recognized}`,
      `v10_3BaselineRecognizedOnly=${r.v10_3BaselineRecognizedOnly}`,
      `v11OrV11_1RequiredForLocalStationPass=${r.v11OrV11_1RequiredForLocalStationPass}`,
      `canvasLocalStationApiReady=${r.canvasLocalStationApiReady}`,
      `canvasLocalStationSummaryObserved=${r.canvasLocalStationSummaryObserved}`,
      `canvasLocalStationReceiveSurfaceReady=${r.canvasLocalStationReceiveSurfaceReady}`,
      `canvasLocalStationSourceMethod=${r.canvasLocalStationSourceMethod}`,
      `selectedCanvasProofRank=${r.selectedCanvasProofRank}`,
      `selectedCanvasProofUnsafe=${r.selectedCanvasProofUnsafe}`,
      "",
      `carrierIdentitySafe=${r.carrierIdentitySafe}`,
      `carrierSafeMarkerObserved=${r.carrierSafeMarkerObserved}`,
      `preReleaseCarrierAdmissible=${r.preReleaseCarrierAdmissible}`,
      `carrierHardBlock=${r.carrierHardBlock}`,
      `carrierHeld=${r.carrierHeld}`,
      `carrierHoldReason=${r.carrierHoldReason}`,
      `explicitUnsafeFields=${r.explicitUnsafeFields.join(",") || "none"}`,
      "",
      `westAuditObserved=${r.westAuditObserved}`,
      `westAuditIntakeAccepted=${r.westAuditIntakeAccepted}`,
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
      `releasePacket=${r.releasePacket}`,
      `canvasReleasePacket=${r.canvasReleasePacket}`,
      "",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21EligibilitySubmittedToNorth=${r.f21EligibilitySubmittedToNorth}`,
      `f21ClaimedByWest=${r.f21ClaimedByWest}`,
      `completionLatched=${r.completionLatched}`,
      `finalCompletionLatched=${r.finalCompletionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`
    ].join("\n");
  }

  function updateDataset() {
    setDataset("labRuntimeTableWestLoaded", "true");
    setDataset("labRuntimeTableWestContract", CONTRACT);
    setDataset("labRuntimeTableWestReceipt", RECEIPT);
    setDataset("hearthWestRuntimeTableLoaded", "true");
    setDataset("hearthWestRuntimeTableContract", CONTRACT);
    setDataset("hearthWestRuntimeTableReceipt", RECEIPT);

    setDataset("hearthWestNorthTimetableAligned", String(Boolean(state.northC2WestAuditAligned)));
    setDataset("hearthWestNorthActiveStageId", state.northActiveStageId);
    setDataset("hearthWestNorthActiveGearId", state.northActiveGearId);
    setDataset("hearthWestNorthActiveFileGate", state.northActiveFileGate);
    setDataset("hearthWestNorthActiveCycleRoute", state.northActiveCycleRoute);
    setDataset("hearthWestNorthActiveFibonacci", state.northActiveFibonacci);
    setDataset("hearthWestNorthActiveNewsGate", state.northActiveNewsGate);

    setDataset("hearthWestCycleNumber", String(state.cycleNumber));
    setDataset("hearthWestCycleRoute", state.cycleRoute);
    setDataset("hearthWestReceivedFrom", state.receivedFrom);
    setDataset("hearthWestHandoffTo", state.handoffTo);
    setDataset("hearthWestSouthOutputReady", String(Boolean(state.southOutputReady)));
    setDataset("hearthWestCycleTwoSouthOutputAdmissible", String(Boolean(state.cycleTwoSouthOutputAdmissible)));

    setDataset("hearthWestCurrentCanvasParentContract", state.currentCanvasParentContract);
    setDataset("hearthWestCurrentCanvasParentIsLocalStation", String(Boolean(state.currentCanvasParentIsLocalStation)));
    setDataset("hearthWestCanvasLocalStationContractAccepted", String(Boolean(state.canvasLocalStationContractAccepted)));
    setDataset("hearthWestV10_3BaselineRecognizedOnly", String(Boolean(state.v10_3BaselineRecognizedOnly)));
    setDataset("hearthWestCanvasLocalStationApiReady", String(Boolean(state.canvasLocalStationApiReady)));
    setDataset("hearthWestCanvasLocalStationSummaryObserved", String(Boolean(state.canvasLocalStationSummaryObserved)));
    setDataset("hearthWestCanvasLocalStationReceiveSurfaceReady", String(Boolean(state.canvasLocalStationReceiveSurfaceReady)));
    setDataset("hearthWestSelectedCanvasProofRank", String(state.selectedCanvasProofRank));
    setDataset("hearthWestSelectedCanvasProofUnsafe", String(Boolean(state.selectedCanvasProofUnsafe)));

    setDataset("hearthWestAuditObserved", String(Boolean(state.westAuditObserved)));
    setDataset("hearthWestAuditIntakeAccepted", String(Boolean(state.westAuditIntakeAccepted)));
    setDataset("hearthWestAuditAccepted", String(Boolean(state.westAuditAccepted)));
    setDataset("hearthWestAuditPassed", String(Boolean(state.westAuditPassed)));
    setDataset("hearthWestDecision", state.westDecision);
    setDataset("hearthWestGapClass", state.westGapClass);
    setDataset("hearthWestHardBlock", String(Boolean(state.westHardBlock)));
    setDataset("hearthWestForwardAllowed", String(Boolean(state.westForwardAllowed)));
    setDataset("hearthWestCanvasReleaseApproved", String(Boolean(state.westCanvasReleaseApproved)));

    setDataset("hearthCanvasReleaseAuthorized", String(Boolean(state.canvasReleaseAuthorized)));
    setDataset("hearthCanvasReleasePacketReady", String(Boolean(state.canvasReleasePacketReady)));
    setDataset("hearthCanvasReleaseApprovedByWest", String(Boolean(state.canvasReleaseApprovedByWest)));
    setDataset("hearthReleaseToCanvas", String(Boolean(state.releaseToCanvas)));
    setDataset("hearthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);

    setDataset("hearthWestFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthWestRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthWestRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthWestPostgameStatus", state.postgameStatus);

    setDataset("hearthWestF21EligibleForNorth", "false");
    setDataset("hearthWestF21SubmittedToNorth", "false");
    setDataset("hearthWestCompletionLatched", "false");
    setDataset("hearthWestReadyTextAllowed", "false");
    setDataset("hearthWestVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishReceiptAliases() {
    const w = root();
    const full = getReceipt();
    const light = getReceiptLight();

    w.LAB_RUNTIME_TABLE_WEST_RECEIPT = light;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_RECEIPT = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_RECEIPT = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_RECEIPT_v4_6_3 = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_RECEIPT_v4_6_2 = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_RECEIPT_v4_6_1 = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_RECEIPT_v4_6 = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_V11_1_LOCAL_STATION_ALIAS_SELECTION_STRICT_SOUTH_AND_CANVAS_PROOF_RANKING_RECEIPT_v4_5 = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_V11_1_LOCAL_STATION_ALIAS_SELECTION_AND_CARRIER_COMPATIBILITY_RECEIPT_v4_4 = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_V11_1_LOCAL_STATION_CARRIER_COMPATIBILITY_RECEIPT_v4_3 = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_RECEIPT_v4_2 = full;

    return true;
  }

  function publishGlobals() {
    const w = root();
    const lab = ensureObject(w, "DEXTER_LAB");
    const h = ensureObject(w, "HEARTH");

    w.LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST = api;
    w.HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH = api;
    w.LAB_RUNTIME_TABLE_WEST = api;
    w.RUNTIME_TABLE_WEST = api;
    w.DEXTER_LAB_RUNTIME_TABLE_WEST = api;
    w.LAB_CARDINAL_RUNTIME_TABLE_WEST = api;
    w.LAB_GAP_CLASSIFIER_WEST = api;
    w.LAB_TRANSMISSION_GAP_CLASSIFIER_WEST = api;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST = api;
    w.HEARTH_RUNTIME_TABLE_WEST = api;
    w.HEARTH_MACRO_WEST_AUTHORITY = api;
    w.HEARTH_WEST_ADMISSIBILITY = api;

    h.runtimeTableWest = api;
    h.westRuntimeTable = api;
    h.westAdmissibility = api;
    h.macroWestAuthority = api;
    h.westCycleAwareAdmissibilityClutch = api;

    lab.runtimeTableWest = api;
    lab.hearthRuntimeTableWest = api;
    lab.cardinalRuntimeTableWest = api;
    lab.gapClassifierWest = api;
    lab.transmissionGapClassifierWest = api;
    lab.westAdmissibility = api;
    lab.cycleAwareAdmissibilityClutchWest = api;

    publishReceiptAliases();

    if (state.releasePacket) {
      publishCanvasReleasePacket(state.releasePacket);
    } else {
      clearCanvasReleasePacket();
    }

    return api;
  }

  function scheduleAliasRepublish() {
    const w = root();
    const delays = [0, 16, 80, 240, 700];

    delays.forEach((delay) => {
      if (isFunction(w.setTimeout)) {
        w.setTimeout(() => {
          publishGlobals();
          updateDataset();
        }, delay);
      }
    });
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    BASELINE_CONTRACT,
    VERSION,
    FILE,
    ROUTE,
    NORTH_FILE,
    ROUTE_CONDUCTOR_FILE,
    CANVAS_LOCAL_STATION_FILE,

    ACTIVE_STAGE_ID,
    ACTIVE_GEAR,
    ACTIVE_CYCLE_NUMBER,
    ACTIVE_CYCLE_ROUTE,
    ACTIVE_CARDINAL,
    ACTIVE_FIBONACCI,
    ACTIVE_NEWS_GATE,

    WEST_DECISION,
    WEST_GAP_CLASS,
    CANVAS_LOCAL_STATION_CONTRACTS,
    CANVAS_BASELINE_V10_3_CONTRACT,

    readNorthTimetableLight,
    normalizeNorthTimetable,
    isNorthCallingWestForCycleTwoCanvasAudit,
    normalizeCycleInput,
    selectCanvasLocalStationProof,
    classifyWestAdmissibility,

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
    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket,
    getHandoffPacket,

    clearCanvasReleasePacket,
    publishCanvasReleasePacket,
    updateDataset,
    publishGlobals,

    getState: () => clonePlain(state)
  };

  publishGlobals();
  updateDataset();

  try {
    classifyWestAdmissibility({});
  } catch (_error) {
    state.timestamp = nowIso();
    state.westAuditObserved = true;
    state.westAuditIntakeAccepted = false;
    state.westAuditAccepted = false;
    state.westAuditPassed = false;
    state.westDecision = WEST_DECISION.HOLD;
    state.westGapClass = WEST_GAP_CLASS.NORTH_TIMETABLE_HOLD;
    state.westHardBlock = false;
    state.westForwardAllowed = false;
    state.westCanvasReleaseApproved = false;
    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseApprovedByWest = false;
    state.releaseToCanvas = false;
    state.canvasReleaseHeldReason = "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT";
    state.firstFailedCoordinate = "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT";
    state.recommendedNextFile = NORTH_FILE;
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "WEST_HOLD_INITIALIZATION_SAFE";
    blockFinalClaims();
    clearCanvasReleasePacket();
    updateDataset();
    publishGlobals();
  }

  scheduleAliasRepublish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
