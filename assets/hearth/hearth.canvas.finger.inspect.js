// /assets/hearth/hearth.canvas.finger.inspect.js
// HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_TNT_v1
// Full-file replacement.
// Canvas Finger 5 / Inspect / Finger Stretch Receipt.
// Purpose:
// - Establish the fifth downstream Canvas finger for Hearth.
// - Inspect Boundary, Mass, Surface, and Light Finger availability without renewing those files.
// - Produce a unified finger-stretch inspection packet for the Canvas Expression Hub.
// - Confirm whether the base canvas globe has enough expression evidence to continue downstream.
// - Keep this file as an expansion file only.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, or prior finger files.
// - Do not build terrain, hydrology, material, mountain, elevation, or final planet truth.
// - Do not claim F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_PACKET_v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  const FINGER_NAME = "inspect";
  const FINGER_ROLE = "finger-stretch-receipt";
  const FINGER_ORDER = 5;
  const FINGER_STRETCH_TOTAL = 5;

  const FINGER_SEQUENCE = Object.freeze([
    Object.freeze({
      order: 1,
      name: "boundary",
      file: BOUNDARY_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_BOUNDARY",
      role: "base globe containment, visible body edge, boundary envelope"
    }),
    Object.freeze({
      order: 2,
      name: "mass",
      file: MASS_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_MASS",
      role: "physical body mass, broad body structure, early land/body support"
    }),
    Object.freeze({
      order: 3,
      name: "surface",
      file: SURFACE_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_SURFACE",
      role: "first surface and material differentiation"
    }),
    Object.freeze({
      order: 4,
      name: "light",
      file: LIGHT_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_LIGHT",
      role: "four-channel visibility and inspection lighting"
    }),
    Object.freeze({
      order: 5,
      name: "inspect",
      file: FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_INSPECT",
      role: "inspection receipt and stretch summary"
    })
  ]);

  const HUB_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasExpressionHub",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_EXPRESSION_HUB"
  ]);

  const HUB_INTAKE_METHODS = Object.freeze([
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "receiveInspectFingerPacket",
    "registerCanvasFinger",
    "registerExpressionFinger",
    "receiveExpressionPacket",
    "receiveChildPacket"
  ]);

  const FINGER_SOURCE_NAMES = Object.freeze({
    boundary: Object.freeze([
      "HEARTH.canvasFingerBoundary",
      "HEARTH.canvasBoundaryFinger",
      "HEARTH_CANVAS_FINGER_BOUNDARY",
      "HEARTH_CANVAS_BOUNDARY_FINGER"
    ]),
    mass: Object.freeze([
      "HEARTH.canvasFingerMass",
      "HEARTH.canvasMassFinger",
      "HEARTH_CANVAS_FINGER_MASS",
      "HEARTH_CANVAS_MASS_FINGER"
    ]),
    surface: Object.freeze([
      "HEARTH.canvasFingerSurface",
      "HEARTH.canvasSurfaceFinger",
      "HEARTH_CANVAS_FINGER_SURFACE",
      "HEARTH_CANVAS_SURFACE_FINGER"
    ]),
    light: Object.freeze([
      "HEARTH.canvasFingerLight",
      "HEARTH.canvasLightFinger",
      "HEARTH_CANVAS_FINGER_LIGHT",
      "HEARTH_CANVAS_LIGHT_FINGER"
    ])
  });

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextClaimed: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    terrainTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    elevationTruthClaimed: false,
    mountainTruthClaimed: false,
    biomeTruthClaimed: false,
    atmosphereTruthClaimed: false,
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    inspectFingerLoaded: true,
    inspectFingerActive: true,
    inspectionOnly: true,
    expressionFileOnly: true,
    priorFingerMutationBlocked: true,
    upstreamRenewalRequired: false,

    boundaryObserved: false,
    boundaryReceiptObserved: false,
    boundaryPacketObserved: false,
    boundaryReady: false,

    massObserved: false,
    massReceiptObserved: false,
    massPacketObserved: false,
    massReady: false,

    surfaceObserved: false,
    surfaceReceiptObserved: false,
    surfacePacketObserved: false,
    surfaceReady: false,

    lightObserved: false,
    lightReceiptObserved: false,
    lightPacketObserved: false,
    lightReady: false,

    allFingerSourcesObserved: false,
    allFingerReceiptsObserved: false,
    allFingerPacketsObserved: false,
    allFingerReady: false,

    baseCanvasGlobeEvidenceReady: false,
    baseCanvasGlobeExpandable: false,
    baseCanvasVisualizationExpected: false,
    downstreamTroubleshootingExpected: false,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",

    firstFailedCoordinate: "INSPECT_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "INSPECT_FINGER_WAITING_BOOT",

    inspectionSummary: null,
    inspectionPacket: null,

    boundary: null,
    mass: null,
    surface: null,
    light: null,

    lastRegistrationResponse: null,
    localEvents: [],
    errors: [],

    booted: false,
    mounted: false,

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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
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
      event: safeString(event, "INSPECT_FINGER_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 120);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "INSPECT_FINGER_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 80);
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

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function findSource(sourceNames) {
    for (const sourceName of sourceNames || []) {
      const candidate = readPath(sourceName);
      if (candidate && (isObject(candidate) || isFunction(candidate))) {
        return { source: candidate, sourceName };
      }
    }

    return { source: null, sourceName: "NONE" };
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

  function readGenericReceipt(source) {
    if (!source || !isObject(source)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "read",
      "getState",
      "getReport",
      "getStatus"
    ];

    for (const method of methods) {
      const value = safeInvoke(source, method);
      if (isObject(value)) return value;
    }

    if (isObject(source.receiptPacket)) return source.receiptPacket;
    if (isObject(source.receipt)) return source.receipt;

    if (source.contract || source.CONTRACT || source.receipt || source.RECEIPT || source.file) {
      return source;
    }

    return null;
  }

  function readFingerPacket(kind, source, receipt) {
    if (!source || !isObject(source)) return null;

    const methodMap = {
      boundary: ["getBoundaryPacket", "getPacket", "buildBoundaryPacket"],
      mass: ["getMassPacket", "getPacket", "buildMassPacket"],
      surface: ["getSurfacePacket", "getPacket", "buildSurfacePacket"],
      light: ["getLightPacket", "getPacket", "buildLightPacket"]
    };

    for (const method of methodMap[kind] || []) {
      const value = safeInvoke(source, method);
      if (isObject(value)) return value;
    }

    const packetKeys = {
      boundary: ["boundaryPacket", "packet"],
      mass: ["massPacket", "packet"],
      surface: ["surfacePacket", "packet"],
      light: ["lightPacket", "packet"]
    };

    for (const key of packetKeys[kind] || []) {
      if (receipt && isObject(receipt[key])) return receipt[key];
      if (isObject(source[key])) return source[key];
    }

    return null;
  }

  function hasNoFalseClaims(receipt, packet) {
    const merged = Object.assign({}, isObject(receipt) ? receipt : {}, isObject(packet) ? packet : {});

    return !(
      merged.f13Claimed === true ||
      merged.f13EligibleForCanvas === true ||
      merged.f13ClaimedByCanvasParent === true ||
      merged.f21Claimed === true ||
      merged.f21EligibleForNorth === true ||
      merged.f21SubmittedToNorth === true ||
      merged.f21EligibilitySubmittedToNorth === true ||
      merged.completionLatched === true ||
      merged.finalCompletionLatched === true ||
      merged.degradedCompletionLatched === true ||
      merged.readyTextClaimed === true ||
      merged.readyTextAllowed === true ||
      merged.visualPassClaimed === true ||
      merged.finalVisualPassClaimed === true ||
      merged.generatedImage === true ||
      merged.graphicBox === true ||
      merged.webGL === true
    );
  }

  function inferFingerReady(kind, source, receipt, packet) {
    if (!source) return false;
    if (!hasNoFalseClaims(receipt, packet)) return false;

    if (kind === "boundary") {
      return Boolean(
        safeBool(receipt && receipt.boundaryPacketReady, false) ||
        safeBool(receipt && receipt.boundaryModelReady, false) ||
        safeBool(receipt && receipt.visibleBoundaryAvailable, false) ||
        safeBool(packet && packet.boundaryPacketReady, false) ||
        safeBool(packet && packet.boundaryModelReady, false) ||
        safeBool(packet && packet.visibleBoundaryAvailable, false) ||
        isObject(packet)
      );
    }

    if (kind === "mass") {
      return Boolean(
        safeBool(receipt && receipt.massPacketReady, false) ||
        safeBool(receipt && receipt.massModelReady, false) ||
        safeBool(receipt && receipt.visibleMassContributionAvailable, false) ||
        safeBool(packet && packet.massPacketReady, false) ||
        safeBool(packet && packet.massModelReady, false) ||
        safeBool(packet && packet.visibleMassContributionAvailable, false) ||
        isObject(packet)
      );
    }

    if (kind === "surface") {
      return Boolean(
        safeBool(receipt && receipt.surfacePacketReady, false) ||
        safeBool(receipt && receipt.surfaceModelReady, false) ||
        safeBool(receipt && receipt.visibleSurfaceContributionAvailable, false) ||
        safeBool(packet && packet.surfacePacketReady, false) ||
        safeBool(packet && packet.surfaceModelReady, false) ||
        safeBool(packet && packet.visibleSurfaceContributionAvailable, false) ||
        isObject(packet)
      );
    }

    if (kind === "light") {
      return Boolean(
        safeBool(receipt && receipt.lightPacketReady, false) ||
        safeBool(receipt && receipt.lightModelReady, false) ||
        safeBool(receipt && receipt.visibleContributionAvailable, false) ||
        safeBool(receipt && receipt.fourChannelVisibilityActive, false) ||
        safeBool(packet && packet.lightPacketReady, false) ||
        safeBool(packet && packet.lightModelReady, false) ||
        safeBool(packet && packet.visibleContributionAvailable, false) ||
        safeBool(packet && packet.fourChannelVisibilityActive, false) ||
        isObject(packet)
      );
    }

    return false;
  }

  function inspectFinger(kind) {
    const found = findSource(FINGER_SOURCE_NAMES[kind] || []);
    const receipt = found.source ? readGenericReceipt(found.source) : null;
    const packet = found.source ? readFingerPacket(kind, found.source, receipt) : null;
    const ready = inferFingerReady(kind, found.source, receipt, packet);

    return {
      kind,
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      ready,
      contract: safeString(
        (receipt && (receipt.contract || receipt.CONTRACT)) ||
        (packet && (packet.contract || packet.CONTRACT)) ||
        (found.source && found.source.contract) ||
        "",
        ""
      ),
      receiptName: safeString(
        (receipt && (receipt.receipt || receipt.RECEIPT)) ||
        (packet && (packet.receipt || packet.RECEIPT)) ||
        (found.source && found.source.receipt) ||
        "",
        ""
      ),
      file: safeString(
        (receipt && receipt.file) ||
        (packet && packet.file) ||
        "",
        ""
      ),
      noFalseClaims: hasNoFalseClaims(receipt, packet),
      receipt: clonePlain(receipt),
      packet: clonePlain(packet)
    };
  }

  function updateFingerState(summary) {
    state.boundaryObserved = summary.boundary.observed;
    state.boundaryReceiptObserved = summary.boundary.receiptObserved;
    state.boundaryPacketObserved = summary.boundary.packetObserved;
    state.boundaryReady = summary.boundary.ready;

    state.massObserved = summary.mass.observed;
    state.massReceiptObserved = summary.mass.receiptObserved;
    state.massPacketObserved = summary.mass.packetObserved;
    state.massReady = summary.mass.ready;

    state.surfaceObserved = summary.surface.observed;
    state.surfaceReceiptObserved = summary.surface.receiptObserved;
    state.surfacePacketObserved = summary.surface.packetObserved;
    state.surfaceReady = summary.surface.ready;

    state.lightObserved = summary.light.observed;
    state.lightReceiptObserved = summary.light.receiptObserved;
    state.lightPacketObserved = summary.light.packetObserved;
    state.lightReady = summary.light.ready;

    state.allFingerSourcesObserved = Boolean(
      state.boundaryObserved &&
      state.massObserved &&
      state.surfaceObserved &&
      state.lightObserved
    );

    state.allFingerReceiptsObserved = Boolean(
      state.boundaryReceiptObserved &&
      state.massReceiptObserved &&
      state.surfaceReceiptObserved &&
      state.lightReceiptObserved
    );

    state.allFingerPacketsObserved = Boolean(
      state.boundaryPacketObserved &&
      state.massPacketObserved &&
      state.surfacePacketObserved &&
      state.lightPacketObserved
    );

    state.allFingerReady = Boolean(
      state.boundaryReady &&
      state.massReady &&
      state.surfaceReady &&
      state.lightReady
    );

    state.baseCanvasGlobeEvidenceReady = Boolean(state.allFingerReady);
    state.baseCanvasGlobeExpandable = Boolean(state.allFingerReady);
    state.baseCanvasVisualizationExpected = Boolean(state.allFingerReady);
    state.downstreamTroubleshootingExpected = Boolean(state.allFingerReady);

    state.boundary = clonePlain(summary.boundary);
    state.mass = clonePlain(summary.mass);
    state.surface = clonePlain(summary.surface);
    state.light = clonePlain(summary.light);

    resolvePostgame();
  }

  function resolvePostgame() {
    let firstFailed = "NONE_FINGER_STRETCH_READY";
    let nextFile = PARENT_HUB_FILE;
    let status = "INSPECT_FINGER_STRETCH_READY_FOR_BASE_CANVAS_GLOBE_CONFIRMATION";

    if (!state.boundaryObserved) {
      firstFailed = "WAITING_BOUNDARY_FINGER_SOURCE";
      nextFile = BOUNDARY_FILE;
      status = "INSPECT_FINGER_WAITING_BOUNDARY_SOURCE";
    } else if (!state.boundaryReady) {
      firstFailed = "WAITING_BOUNDARY_FINGER_READY";
      nextFile = BOUNDARY_FILE;
      status = "INSPECT_FINGER_WAITING_BOUNDARY_READY";
    } else if (!state.massObserved) {
      firstFailed = "WAITING_MASS_FINGER_SOURCE";
      nextFile = MASS_FILE;
      status = "INSPECT_FINGER_WAITING_MASS_SOURCE";
    } else if (!state.massReady) {
      firstFailed = "WAITING_MASS_FINGER_READY";
      nextFile = MASS_FILE;
      status = "INSPECT_FINGER_WAITING_MASS_READY";
    } else if (!state.surfaceObserved) {
      firstFailed = "WAITING_SURFACE_FINGER_SOURCE";
      nextFile = SURFACE_FILE;
      status = "INSPECT_FINGER_WAITING_SURFACE_SOURCE";
    } else if (!state.surfaceReady) {
      firstFailed = "WAITING_SURFACE_FINGER_READY";
      nextFile = SURFACE_FILE;
      status = "INSPECT_FINGER_WAITING_SURFACE_READY";
    } else if (!state.lightObserved) {
      firstFailed = "WAITING_LIGHT_FINGER_SOURCE";
      nextFile = LIGHT_FILE;
      status = "INSPECT_FINGER_WAITING_LIGHT_SOURCE";
    } else if (!state.lightReady) {
      firstFailed = "WAITING_LIGHT_FINGER_READY";
      nextFile = LIGHT_FILE;
      status = "INSPECT_FINGER_WAITING_LIGHT_READY";
    } else if (!state.hubDetected) {
      firstFailed = "WAITING_CANVAS_HUB_SOURCE";
      nextFile = PARENT_HUB_FILE;
      status = "INSPECT_FINGER_READY_BUT_WAITING_CANVAS_HUB_SOURCE";
    } else if (state.hubRegistrationAttempted && !state.hubRegistrationAccepted) {
      firstFailed = "WAITING_CANVAS_HUB_INSPECT_PACKET_ACCEPTANCE";
      nextFile = PARENT_HUB_FILE;
      status = "INSPECT_FINGER_READY_BUT_WAITING_CANVAS_HUB_ACCEPTANCE";
    }

    state.firstFailedCoordinate = firstFailed;
    state.recommendedNextFile = nextFile;
    state.recommendedNextRenewalTarget = nextFile;
    state.postgameStatus = status;

    return {
      firstFailedCoordinate: firstFailed,
      recommendedNextFile: nextFile,
      recommendedNextRenewalTarget: nextFile,
      postgameStatus: status
    };
  }

  function inspectStretch() {
    const summary = {
      timestamp: nowIso(),
      packetType: "HEARTH_CANVAS_FINGER_STRETCH_INSPECTION_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerSequence: clonePlain(FINGER_SEQUENCE),

      boundary: inspectFinger("boundary"),
      mass: inspectFinger("mass"),
      surface: inspectFinger("surface"),
      light: inspectFinger("light"),

      inspectionOnly: true,
      priorFingerMutationBlocked: true,
      upstreamRenewalRequired: false,
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    updateFingerState(summary);

    summary.allFingerSourcesObserved = state.allFingerSourcesObserved;
    summary.allFingerReceiptsObserved = state.allFingerReceiptsObserved;
    summary.allFingerPacketsObserved = state.allFingerPacketsObserved;
    summary.allFingerReady = state.allFingerReady;
    summary.baseCanvasGlobeEvidenceReady = state.baseCanvasGlobeEvidenceReady;
    summary.baseCanvasGlobeExpandable = state.baseCanvasGlobeExpandable;
    summary.baseCanvasVisualizationExpected = state.baseCanvasVisualizationExpected;
    summary.downstreamTroubleshootingExpected = state.downstreamTroubleshootingExpected;
    summary.firstFailedCoordinate = state.firstFailedCoordinate;
    summary.recommendedNextFile = state.recommendedNextFile;
    summary.recommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    summary.postgameStatus = state.postgameStatus;

    state.inspectionSummary = clonePlain(summary);
    state.updatedAt = summary.timestamp;

    return summary;
  }

  function buildInspectionPacket() {
    const summary = inspectStretch();

    const packet = {
      packetType: "HEARTH_CANVAS_FINGER_INSPECT_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerSequence: clonePlain(FINGER_SEQUENCE),

      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      surfaceFile: SURFACE_FILE,
      lightFile: LIGHT_FILE,

      boundaryObserved: state.boundaryObserved,
      boundaryReceiptObserved: state.boundaryReceiptObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryReady: state.boundaryReady,

      massObserved: state.massObserved,
      massReceiptObserved: state.massReceiptObserved,
      massPacketObserved: state.massPacketObserved,
      massReady: state.massReady,

      surfaceObserved: state.surfaceObserved,
      surfaceReceiptObserved: state.surfaceReceiptObserved,
      surfacePacketObserved: state.surfacePacketObserved,
      surfaceReady: state.surfaceReady,

      lightObserved: state.lightObserved,
      lightReceiptObserved: state.lightReceiptObserved,
      lightPacketObserved: state.lightPacketObserved,
      lightReady: state.lightReady,

      allFingerSourcesObserved: state.allFingerSourcesObserved,
      allFingerReceiptsObserved: state.allFingerReceiptsObserved,
      allFingerPacketsObserved: state.allFingerPacketsObserved,
      allFingerReady: state.allFingerReady,

      baseCanvasGlobeEvidenceReady: state.baseCanvasGlobeEvidenceReady,
      baseCanvasGlobeExpandable: state.baseCanvasGlobeExpandable,
      baseCanvasVisualizationExpected: state.baseCanvasVisualizationExpected,
      downstreamTroubleshootingExpected: state.downstreamTroubleshootingExpected,

      inspectionSummary: clonePlain(summary),

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      inspectionOnly: true,
      expressionFileOnly: true,
      priorFingerMutationBlocked: true,
      upstreamRenewalRequired: false,
      noClaimsPreserved: true,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.inspectionPacket = clonePlain(packet);
    return packet;
  }

  function findCanvasHub() {
    for (const sourceName of HUB_SOURCE_NAMES) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return {
          hub: candidate,
          sourceName
        };
      }
    }

    return {
      hub: null,
      sourceName: "NONE"
    };
  }

  function registerWithCanvasHub() {
    const packet = buildInspectionPacket();
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND";
      resolvePostgame();

      record("INSPECT_FINGER_HUB_NOT_FOUND", {
        attemptedSources: clonePlain(HUB_SOURCE_NAMES)
      });

      buildInspectionPacket();
      return false;
    }

    for (const method of HUB_INTAKE_METHODS) {
      if (!isFunction(found.hub[method])) continue;

      try {
        const response = found.hub[method](clonePlain(packet));

        state.hubRegistrationAccepted = response !== false;
        state.hubRegistrationMethod = method;
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted ? "NONE" : "CANVAS_HUB_REJECTED_INSPECT_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = state.allFingerReady
            ? "NONE_FINGER_STRETCH_REGISTERED"
            : state.firstFailedCoordinate;
          state.recommendedNextFile = state.allFingerReady ? PARENT_HUB_FILE : state.recommendedNextFile;
          state.recommendedNextRenewalTarget = state.allFingerReady ? PARENT_HUB_FILE : state.recommendedNextRenewalTarget;
          state.postgameStatus = state.allFingerReady
            ? "INSPECT_FINGER_REGISTERED_FINGER_STRETCH_READY_FOR_BASE_CANVAS_GLOBE_CONFIRMATION"
            : state.postgameStatus;
        } else {
          resolvePostgame();
        }

        record("INSPECT_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        buildInspectionPacket();
        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("INSPECT_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND";
    resolvePostgame();

    record("INSPECT_FINGER_HUB_INTAKE_NOT_FOUND", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    buildInspectionPacket();
    return false;
  }

  function getInspectionSummary() {
    return clonePlain(state.inspectionSummary || inspectStretch());
  }

  function getInspectionPacket() {
    return clonePlain(state.inspectionPacket || buildInspectionPacket());
  }

  function getState() {
    return clonePlain(state);
  }

  function read() {
    return getReceiptLight();
  }

  function getReceiptLight() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      inspectFingerLoaded: state.inspectFingerLoaded,
      inspectFingerActive: state.inspectFingerActive,
      inspectionOnly: state.inspectionOnly,
      expressionFileOnly: state.expressionFileOnly,
      priorFingerMutationBlocked: state.priorFingerMutationBlocked,
      upstreamRenewalRequired: state.upstreamRenewalRequired,

      boundaryObserved: state.boundaryObserved,
      boundaryReceiptObserved: state.boundaryReceiptObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryReady: state.boundaryReady,

      massObserved: state.massObserved,
      massReceiptObserved: state.massReceiptObserved,
      massPacketObserved: state.massPacketObserved,
      massReady: state.massReady,

      surfaceObserved: state.surfaceObserved,
      surfaceReceiptObserved: state.surfaceReceiptObserved,
      surfacePacketObserved: state.surfacePacketObserved,
      surfaceReady: state.surfaceReady,

      lightObserved: state.lightObserved,
      lightReceiptObserved: state.lightReceiptObserved,
      lightPacketObserved: state.lightPacketObserved,
      lightReady: state.lightReady,

      allFingerSourcesObserved: state.allFingerSourcesObserved,
      allFingerReceiptsObserved: state.allFingerReceiptsObserved,
      allFingerPacketsObserved: state.allFingerPacketsObserved,
      allFingerReady: state.allFingerReady,

      baseCanvasGlobeEvidenceReady: state.baseCanvasGlobeEvidenceReady,
      baseCanvasGlobeExpandable: state.baseCanvasGlobeExpandable,
      baseCanvasVisualizationExpected: state.baseCanvasVisualizationExpected,
      downstreamTroubleshootingExpected: state.downstreamTroubleshootingExpected,

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      currentReceipt: true,
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
      sourceNames: clonePlain(FINGER_SOURCE_NAMES),
      inspectionSummary: clonePlain(state.inspectionSummary),
      inspectionPacket: clonePlain(state.inspectionPacket),
      boundary: clonePlain(state.boundary),
      mass: clonePlain(state.mass),
      surface: clonePlain(state.surface),
      light: clonePlain(state.light),
      lastRegistrationResponse: clonePlain(state.lastRegistrationResponse),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      line("parentHubFile", r.parentHubFile),
      "",
      "FINGER",
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("fingerOrder", r.fingerOrder),
      line("fingerStretchTotal", r.fingerStretchTotal),
      line("inspectionOnly", r.inspectionOnly),
      line("expressionFileOnly", r.expressionFileOnly),
      line("priorFingerMutationBlocked", r.priorFingerMutationBlocked),
      line("upstreamRenewalRequired", r.upstreamRenewalRequired),
      "",
      "BOUNDARY",
      line("boundaryObserved", r.boundaryObserved),
      line("boundaryReceiptObserved", r.boundaryReceiptObserved),
      line("boundaryPacketObserved", r.boundaryPacketObserved),
      line("boundaryReady", r.boundaryReady),
      "",
      "MASS",
      line("massObserved", r.massObserved),
      line("massReceiptObserved", r.massReceiptObserved),
      line("massPacketObserved", r.massPacketObserved),
      line("massReady", r.massReady),
      "",
      "SURFACE",
      line("surfaceObserved", r.surfaceObserved),
      line("surfaceReceiptObserved", r.surfaceReceiptObserved),
      line("surfacePacketObserved", r.surfacePacketObserved),
      line("surfaceReady", r.surfaceReady),
      "",
      "LIGHT",
      line("lightObserved", r.lightObserved),
      line("lightReceiptObserved", r.lightReceiptObserved),
      line("lightPacketObserved", r.lightPacketObserved),
      line("lightReady", r.lightReady),
      "",
      "STRETCH_SUMMARY",
      line("allFingerSourcesObserved", r.allFingerSourcesObserved),
      line("allFingerReceiptsObserved", r.allFingerReceiptsObserved),
      line("allFingerPacketsObserved", r.allFingerPacketsObserved),
      line("allFingerReady", r.allFingerReady),
      line("baseCanvasGlobeEvidenceReady", r.baseCanvasGlobeEvidenceReady),
      line("baseCanvasGlobeExpandable", r.baseCanvasGlobeExpandable),
      line("baseCanvasVisualizationExpected", r.baseCanvasVisualizationExpected),
      line("downstreamTroubleshootingExpected", r.downstreamTroubleshootingExpected),
      "",
      "HUB_REGISTRATION",
      line("hubDetected", r.hubDetected),
      line("hubSourceName", r.hubSourceName),
      line("hubRegistrationAttempted", r.hubRegistrationAttempted),
      line("hubRegistrationAccepted", r.hubRegistrationAccepted),
      line("hubRegistrationMethod", r.hubRegistrationMethod),
      line("hubRegistrationHeldReason", r.hubRegistrationHeldReason),
      line("hubRegistrationError", r.hubRegistrationError),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("noClaimsPreserved", r.noClaimsPreserved),
      line("f13Claimed", false),
      line("f21Claimed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("terrainTruthClaimed", false),
      line("hydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
      line("elevationTruthClaimed", false),
      line("mountainTruthClaimed", false),
      line("biomeTruthClaimed", false),
      line("atmosphereTruthClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerInspectLoaded", "true");
    setDataset("hearthCanvasFingerInspectContract", CONTRACT);
    setDataset("hearthCanvasFingerInspectReceipt", RECEIPT);
    setDataset("hearthCanvasFingerInspectFile", FILE);
    setDataset("hearthCanvasFingerInspectActive", String(state.inspectFingerActive));
    setDataset("hearthCanvasFingerInspectOnly", String(state.inspectionOnly));
    setDataset("hearthCanvasFingerInspectPriorFingerMutationBlocked", String(state.priorFingerMutationBlocked));
    setDataset("hearthCanvasFingerInspectUpstreamRenewalRequired", String(state.upstreamRenewalRequired));

    setDataset("hearthCanvasFingerInspectBoundaryObserved", String(state.boundaryObserved));
    setDataset("hearthCanvasFingerInspectBoundaryReceiptObserved", String(state.boundaryReceiptObserved));
    setDataset("hearthCanvasFingerInspectBoundaryPacketObserved", String(state.boundaryPacketObserved));
    setDataset("hearthCanvasFingerInspectBoundaryReady", String(state.boundaryReady));

    setDataset("hearthCanvasFingerInspectMassObserved", String(state.massObserved));
    setDataset("hearthCanvasFingerInspectMassReceiptObserved", String(state.massReceiptObserved));
    setDataset("hearthCanvasFingerInspectMassPacketObserved", String(state.massPacketObserved));
    setDataset("hearthCanvasFingerInspectMassReady", String(state.massReady));

    setDataset("hearthCanvasFingerInspectSurfaceObserved", String(state.surfaceObserved));
    setDataset("hearthCanvasFingerInspectSurfaceReceiptObserved", String(state.surfaceReceiptObserved));
    setDataset("hearthCanvasFingerInspectSurfacePacketObserved", String(state.surfacePacketObserved));
    setDataset("hearthCanvasFingerInspectSurfaceReady", String(state.surfaceReady));

    setDataset("hearthCanvasFingerInspectLightObserved", String(state.lightObserved));
    setDataset("hearthCanvasFingerInspectLightReceiptObserved", String(state.lightReceiptObserved));
    setDataset("hearthCanvasFingerInspectLightPacketObserved", String(state.lightPacketObserved));
    setDataset("hearthCanvasFingerInspectLightReady", String(state.lightReady));

    setDataset("hearthCanvasFingerInspectAllSourcesObserved", String(state.allFingerSourcesObserved));
    setDataset("hearthCanvasFingerInspectAllReceiptsObserved", String(state.allFingerReceiptsObserved));
    setDataset("hearthCanvasFingerInspectAllPacketsObserved", String(state.allFingerPacketsObserved));
    setDataset("hearthCanvasFingerInspectAllReady", String(state.allFingerReady));

    setDataset("hearthCanvasFingerInspectBaseCanvasGlobeEvidenceReady", String(state.baseCanvasGlobeEvidenceReady));
    setDataset("hearthCanvasFingerInspectBaseCanvasGlobeExpandable", String(state.baseCanvasGlobeExpandable));
    setDataset("hearthCanvasFingerInspectBaseCanvasVisualizationExpected", String(state.baseCanvasVisualizationExpected));
    setDataset("hearthCanvasFingerInspectDownstreamTroubleshootingExpected", String(state.downstreamTroubleshootingExpected));

    setDataset("hearthCanvasFingerInspectHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerInspectHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerInspectHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerInspectHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerInspectHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerInspectHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerInspectFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerInspectRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerInspectPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerInspectNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerInspectF13Claimed", "false");
    setDataset("hearthCanvasFingerInspectF21Claimed", "false");
    setDataset("hearthCanvasFingerInspectReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerInspectTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectMountainTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectBiomeTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectAtmosphereTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerInspectGeneratedImage", "false");
    setDataset("hearthCanvasFingerInspectGraphicBox", "false");
    setDataset("hearthCanvasFingerInspectWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");

    hearth.canvasFingerInspect = api;
    hearth.canvasInspectFinger = api;
    hearth.canvasFingerInspectReceipt = getReceiptLight();
    hearth.canvasFingerInspectPacket = getInspectionPacket();
    hearth.canvasFingerStretchInspection = getInspectionSummary();

    root.HEARTH_CANVAS_FINGER_INSPECT = api;
    root.HEARTH_CANVAS_INSPECT_FINGER = api;
    root.HEARTH_CANVAS_FINGER_INSPECT_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_INSPECT_PACKET = getInspectionPacket();
    root.HEARTH_CANVAS_FINGER_STRETCH_INSPECTION = getInspectionSummary();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot() {
    state.timestamp = nowIso();

    inspectStretch();
    buildInspectionPacket();
    publishGlobals();
    registerWithCanvasHub();
    updateDataset();
    publishGlobals();

    state.booted = true;
    state.mounted = true;

    record("INSPECT_FINGER_BOOT_COMPLETE", {
      boundaryReady: state.boundaryReady,
      massReady: state.massReady,
      surfaceReady: state.surfaceReady,
      lightReady: state.lightReady,
      allFingerReady: state.allFingerReady,
      baseCanvasGlobeEvidenceReady: state.baseCanvasGlobeEvidenceReady,
      hubDetected: state.hubDetected,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile
    });

    return getReceipt();
  }

  function init() {
    return boot();
  }

  function start() {
    return boot();
  }

  function mount() {
    return boot();
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PACKET,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
    BOUNDARY_FILE,
    MASS_FILE,
    SURFACE_FILE,
    LIGHT_FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,
    fingerSequence: FINGER_SEQUENCE,

    boot,
    init,
    start,
    mount,

    inspectFinger,
    inspectStretch,
    buildInspectionPacket,
    getInspectionPacket,
    getInspectionSummary,
    registerWithCanvasHub,
    findCanvasHub,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsCanvasFingerInspect: true,
    supportsFingerStretchInspection: true,
    supportsBoundaryFingerInspection: true,
    supportsMassFingerInspection: true,
    supportsSurfaceFingerInspection: true,
    supportsLightFingerInspection: true,
    supportsInspectionPacket: true,
    supportsCanvasHubRegistration: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsInspectFingerIdentity: true,
    ownsFingerStretchInspectionPacket: true,
    ownsPriorFingerTruth: false,
    ownsBoundaryFinger: false,
    ownsMassFinger: false,
    ownsSurfaceFinger: false,
    ownsLightFinger: false,
    ownsCanvasHub: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsMountainTruth: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    inspectStretch();
    buildInspectionPacket();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
      } else {
        boot();
      }
    } else {
      boot();
    }
  } catch (error) {
    recordError("INSPECT_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
