// /assets/hearth/hearth.canvas.finger.boundary.js
// HEARTH_CANVAS_FINGER_BOUNDARY_BASE_GLOBE_CONTAINMENT_TNT_v1
// Full-file replacement.
// Canvas Finger 1 / Boundary / Base Globe Containment.
// Purpose:
// - Establish the first downstream Canvas finger for Hearth.
// - Publish a base-globe boundary / body-edge / containment expression packet.
// - Feed the Canvas Expression Hub when a clear hub intake method exists.
// - Provide a safe visible-boundary contribution surface for later Canvas rendering.
// - Preserve diagnostic bridge, route conductor, parent hub, and upstream file boundaries.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, or Canvas parent.
// - Do not claim F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - front-end button binding
// - route conductor cycle authority
// - diagnostic rail case selection
// - Canvas parent identity
// - Canvas hub registry authority
// - East atlas truth
// - West inspection truth
// - South visible proof truth
// - terrain truth
// - hydrology truth
// - material truth
// - elevation truth
// - atmosphere truth
// - mountain truth
// - F13
// - F21
// - ready text
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_BOUNDARY_BASE_GLOBE_CONTAINMENT_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_BOUNDARY_BASE_GLOBE_CONTAINMENT_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_BOUNDARY_BASE_GLOBE_CONTAINMENT_PACKET_v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const FINGER_NAME = "boundary";
  const FINGER_ROLE = "base-globe-containment";
  const FINGER_ORDER = 1;
  const FINGER_STRETCH_TOTAL = 5;

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
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const FINGER_STRETCH_REGISTRY = Object.freeze([
    Object.freeze({
      order: 1,
      name: "boundary",
      file: FILE,
      role: "base globe containment, visible body edge, boundary envelope"
    }),
    Object.freeze({
      order: 2,
      name: "mass",
      file: MASS_FILE,
      role: "physical body mass, broad body structure, early land/body support"
    }),
    Object.freeze({
      order: 3,
      name: "surface",
      file: SURFACE_FILE,
      role: "first surface and material differentiation"
    }),
    Object.freeze({
      order: 4,
      name: "light",
      file: LIGHT_FILE,
      role: "visibility, light, atmosphere-edge readability"
    }),
    Object.freeze({
      order: 5,
      name: "inspect",
      file: INSPECT_FILE,
      role: "expression-finger inspection receipt without diagnostic rail takeover"
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
    "receiveBoundaryFingerPacket",
    "registerCanvasFinger",
    "registerExpressionFinger",
    "receiveExpressionPacket",
    "receiveChildPacket"
  ]);

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

    boundaryFingerLoaded: true,
    boundaryFingerActive: true,
    baseGlobeContainmentActive: true,
    boundaryEnvelopeReady: false,
    bodyEdgeReady: false,
    objectContainmentReady: false,
    boundaryPacketReady: false,
    visibleContributionAvailable: false,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",

    firstFailedCoordinate: "BOUNDARY_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "BOUNDARY_FINGER_WAITING_BOOT",

    boundaryModel: null,
    boundaryPacket: null,
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

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
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
      event: safeString(event, "BOUNDARY_FINGER_EVENT"),
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
      code: safeString(code, "BOUNDARY_FINGER_ERROR"),
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

  function buildBoundaryModel(options = {}) {
    const centerX = clamp(options.centerX ?? 0.5, 0, 1);
    const centerY = clamp(options.centerY ?? 0.5, 0, 1);
    const radius = clamp(options.radius ?? 0.47, 0.05, 0.5);
    const innerRadius = clamp(options.innerRadius ?? radius * 0.91, 0.01, radius);
    const outerRadius = clamp(options.outerRadius ?? Math.min(0.5, radius * 1.035), radius, 0.55);
    const edgeSoftness = clamp(options.edgeSoftness ?? 0.055, 0.005, 0.2);

    const model = {
      modelType: "HEARTH_BASE_GLOBE_BOUNDARY_MODEL",
      centerX,
      centerY,
      radius,
      innerRadius,
      outerRadius,
      edgeSoftness,
      containmentMask: "RADIAL_GLOBE_CONTAINMENT_MASK",
      bodyAlpha: 1,
      edgeAlpha: 1,
      coordinateSpace: "normalized-0-to-1",
      projection: "front-facing-base-globe",
      finalGeometryClaim: false,
      finalVisualClaim: false
    };

    state.boundaryModel = clonePlain(model);
    state.boundaryEnvelopeReady = true;
    state.bodyEdgeReady = true;
    state.objectContainmentReady = true;
    state.visibleContributionAvailable = true;

    return model;
  }

  function normalizePoint(x, y, width, height) {
    let nx = safeNumber(x, 0);
    let ny = safeNumber(y, 0);

    const w = safeNumber(width, 0);
    const h = safeNumber(height, 0);

    if ((nx > 1 || ny > 1) && w > 0 && h > 0) {
      nx = nx / w;
      ny = ny / h;
    }

    return {
      x: clamp(nx, 0, 1),
      y: clamp(ny, 0, 1)
    };
  }

  function sampleContainment(x, y, width, height) {
    const model = state.boundaryModel || buildBoundaryModel();
    const point = normalizePoint(x, y, width, height);
    const dx = point.x - model.centerX;
    const dy = point.y - model.centerY;
    const distance = Math.sqrt((dx * dx) + (dy * dy));

    const inside = distance <= model.radius;
    const outside = distance >= model.outerRadius;

    let containment = 0;

    if (inside) {
      containment = 1;
    } else if (!outside) {
      const span = Math.max(0.0001, model.outerRadius - model.radius);
      containment = clamp(1 - ((distance - model.radius) / span), 0, 1);
    }

    return {
      x: point.x,
      y: point.y,
      distanceFromCenter: distance,
      insideBody: inside,
      outsideBody: outside,
      containment,
      bodyAlpha: containment,
      finalVisualClaim: false
    };
  }

  function sampleBoundary(x, y, width, height) {
    const model = state.boundaryModel || buildBoundaryModel();
    const point = normalizePoint(x, y, width, height);
    const dx = point.x - model.centerX;
    const dy = point.y - model.centerY;
    const distance = Math.sqrt((dx * dx) + (dy * dy));
    const edgeDistance = Math.abs(distance - model.radius);
    const edge = clamp(1 - (edgeDistance / Math.max(0.0001, model.edgeSoftness)), 0, 1);
    const containment = sampleContainment(point.x, point.y);

    return {
      x: point.x,
      y: point.y,
      distanceFromCenter: distance,
      edgeDistance,
      boundaryEdge: edge,
      containment: containment.containment,
      insideBody: containment.insideBody,
      bodyEdgeReady: true,
      finalVisualClaim: false
    };
  }

  function sample(x, y, options = {}) {
    return {
      packetType: "HEARTH_CANVAS_BOUNDARY_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      fingerName: FINGER_NAME,
      containment: sampleContainment(x, y, options.width, options.height),
      boundary: sampleBoundary(x, y, options.width, options.height),
      ...FINAL_FALSE
    };
  }

  function drawToCanvas(canvasOrContext, options = {}) {
    const target = canvasOrContext || null;
    const context = target && isFunction(target.getContext)
      ? target.getContext("2d")
      : target && isFunction(target.beginPath)
        ? target
        : null;

    if (!context) {
      return {
        drawn: false,
        reason: "NO_2D_CANVAS_CONTEXT",
        contract: CONTRACT,
        receipt: RECEIPT,
        ...FINAL_FALSE
      };
    }

    const canvas = context.canvas || target;
    const width = safeNumber(options.width || (canvas && canvas.width), 0);
    const height = safeNumber(options.height || (canvas && canvas.height), 0);

    if (!width || !height) {
      return {
        drawn: false,
        reason: "CANVAS_DIMENSIONS_UNAVAILABLE",
        contract: CONTRACT,
        receipt: RECEIPT,
        ...FINAL_FALSE
      };
    }

    const model = state.boundaryModel || buildBoundaryModel(options);
    const cx = model.centerX * width;
    const cy = model.centerY * height;
    const radius = model.radius * Math.min(width, height);
    const outerRadius = model.outerRadius * Math.min(width, height);
    const innerRadius = model.innerRadius * Math.min(width, height);

    try {
      context.save();

      context.globalAlpha = clamp(options.bodyOpacity ?? 0.42, 0, 1);
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fillStyle = options.bodyFill || "rgba(74, 112, 126, 0.34)";
      context.fill();

      context.globalAlpha = clamp(options.innerOpacity ?? 0.25, 0, 1);
      context.beginPath();
      context.arc(cx, cy, innerRadius, 0, Math.PI * 2);
      context.fillStyle = options.innerFill || "rgba(143, 169, 142, 0.18)";
      context.fill();

      context.globalAlpha = clamp(options.edgeOpacity ?? 0.82, 0, 1);
      context.lineWidth = Math.max(1, Math.min(width, height) * 0.011);
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.strokeStyle = options.edgeStroke || "rgba(239, 213, 139, 0.78)";
      context.stroke();

      context.globalAlpha = clamp(options.outerOpacity ?? 0.22, 0, 1);
      context.lineWidth = Math.max(1, Math.min(width, height) * 0.018);
      context.beginPath();
      context.arc(cx, cy, outerRadius, 0, Math.PI * 2);
      context.strokeStyle = options.outerStroke || "rgba(132, 188, 203, 0.34)";
      context.stroke();

      context.restore();

      record("BOUNDARY_FINGER_DRAW_TO_CANVAS_COMPLETE", {
        width,
        height,
        radius,
        finalVisualClaim: false
      });

      return {
        drawn: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        fingerName: FINGER_NAME,
        visibleContributionAvailable: true,
        finalVisualClaim: false,
        ...FINAL_FALSE
      };
    } catch (error) {
      try {
        context.restore();
      } catch (_restoreError) {}

      recordError("BOUNDARY_FINGER_DRAW_TO_CANVAS_FAILED", error);

      return {
        drawn: false,
        reason: "DRAW_FAILED",
        error: error && error.message ? String(error.message) : String(error),
        contract: CONTRACT,
        receipt: RECEIPT,
        ...FINAL_FALSE
      };
    }
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

  function buildBoundaryPacket(options = {}) {
    const model = buildBoundaryModel(options);

    const packet = {
      packetType: "HEARTH_CANVAS_BOUNDARY_FINGER_PACKET",
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
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),

      boundaryFingerActive: true,
      baseGlobeContainmentActive: true,
      boundaryEnvelopeReady: true,
      bodyEdgeReady: true,
      objectContainmentReady: true,
      boundaryPacketReady: true,
      visibleContributionAvailable: true,

      boundaryModel: clonePlain(model),
      sampleAvailable: true,
      sampleBoundaryAvailable: true,
      sampleContainmentAvailable: true,
      drawToCanvasAvailable: true,

      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: state.hubRegistrationAccepted
        ? "WAITING_CANVAS_FINGER_MASS"
        : "WAITING_CANVAS_HUB_BOUNDARY_FINGER_INTAKE",
      noClaimsPreserved: true,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.boundaryPacket = clonePlain(packet);
    state.boundaryPacketReady = true;
    state.boundaryEnvelopeReady = true;
    state.bodyEdgeReady = true;
    state.objectContainmentReady = true;
    state.visibleContributionAvailable = true;

    return packet;
  }

  function getBoundaryPacket(options = {}) {
    if (!state.boundaryPacket || options.rebuild === true) {
      return buildBoundaryPacket(options);
    }

    return clonePlain(state.boundaryPacket);
  }

  function registerWithCanvasHub(options = {}) {
    const packet = buildBoundaryPacket(options);
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND";
      state.firstFailedCoordinate = "WAITING_CANVAS_HUB";
      state.recommendedNextFile = PARENT_HUB_FILE;
      state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
      state.postgameStatus = "BOUNDARY_FINGER_HELD_CANVAS_HUB_NOT_FOUND";

      record("BOUNDARY_FINGER_HUB_NOT_FOUND", {
        attemptedSources: clonePlain(HUB_SOURCE_NAMES)
      });

      return false;
    }

    for (const method of HUB_INTAKE_METHODS) {
      if (!isFunction(found.hub[method])) continue;

      try {
        const response = found.hub[method](clonePlain(packet));

        state.hubRegistrationAccepted = response !== false;
        state.hubRegistrationMethod = method;
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted ? "NONE" : "CANVAS_HUB_REJECTED_BOUNDARY_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = "WAITING_CANVAS_FINGER_MASS";
          state.recommendedNextFile = NEXT_FILE;
          state.recommendedNextRenewalTarget = NEXT_FILE;
          state.postgameStatus = "BOUNDARY_FINGER_ACCEPTED_BY_CANVAS_HUB_READY_FOR_MASS_FINGER";
        } else {
          state.firstFailedCoordinate = "CANVAS_HUB_REJECTED_BOUNDARY_PACKET";
          state.recommendedNextFile = PARENT_HUB_FILE;
          state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
          state.postgameStatus = "BOUNDARY_FINGER_HELD_CANVAS_HUB_REJECTED_PACKET";
        }

        record("BOUNDARY_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        buildBoundaryPacket(options);
        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("BOUNDARY_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND";
    state.firstFailedCoordinate = "CANVAS_HUB_INTAKE_NOT_FOUND";
    state.recommendedNextFile = PARENT_HUB_FILE;
    state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
    state.postgameStatus = "BOUNDARY_FINGER_HELD_CANVAS_HUB_INTAKE_NOT_FOUND";

    record("BOUNDARY_FINGER_HUB_INTAKE_NOT_FOUND", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    buildBoundaryPacket(options);
    return false;
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

      boundaryFingerLoaded: state.boundaryFingerLoaded,
      boundaryFingerActive: state.boundaryFingerActive,
      baseGlobeContainmentActive: state.baseGlobeContainmentActive,
      boundaryEnvelopeReady: state.boundaryEnvelopeReady,
      bodyEdgeReady: state.bodyEdgeReady,
      objectContainmentReady: state.objectContainmentReady,
      boundaryPacketReady: state.boundaryPacketReady,
      visibleContributionAvailable: state.visibleContributionAvailable,

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      sampleAvailable: true,
      sampleBoundaryAvailable: true,
      sampleContainmentAvailable: true,
      drawToCanvasAvailable: true,

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
      boundaryModel: clonePlain(state.boundaryModel),
      boundaryPacket: clonePlain(state.boundaryPacket),
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
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
      "HEARTH_CANVAS_FINGER_BOUNDARY_BASE_GLOBE_CONTAINMENT_RECEIPT",
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
      "",
      "BOUNDARY_STATUS",
      line("boundaryFingerLoaded", r.boundaryFingerLoaded),
      line("boundaryFingerActive", r.boundaryFingerActive),
      line("baseGlobeContainmentActive", r.baseGlobeContainmentActive),
      line("boundaryEnvelopeReady", r.boundaryEnvelopeReady),
      line("bodyEdgeReady", r.bodyEdgeReady),
      line("objectContainmentReady", r.objectContainmentReady),
      line("boundaryPacketReady", r.boundaryPacketReady),
      line("visibleContributionAvailable", r.visibleContributionAvailable),
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
      "API",
      line("sampleAvailable", r.sampleAvailable),
      line("sampleBoundaryAvailable", r.sampleBoundaryAvailable),
      line("sampleContainmentAvailable", r.sampleContainmentAvailable),
      line("drawToCanvasAvailable", r.drawToCanvasAvailable),
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
      line("finalCompletionLatched", false),
      line("degradedCompletionLatched", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerBoundaryLoaded", "true");
    setDataset("hearthCanvasFingerBoundaryContract", CONTRACT);
    setDataset("hearthCanvasFingerBoundaryReceipt", RECEIPT);
    setDataset("hearthCanvasFingerBoundaryFile", FILE);
    setDataset("hearthCanvasFingerBoundaryActive", String(state.boundaryFingerActive));
    setDataset("hearthCanvasFingerBoundaryBaseGlobeContainmentActive", String(state.baseGlobeContainmentActive));
    setDataset("hearthCanvasFingerBoundaryEnvelopeReady", String(state.boundaryEnvelopeReady));
    setDataset("hearthCanvasFingerBoundaryBodyEdgeReady", String(state.bodyEdgeReady));
    setDataset("hearthCanvasFingerBoundaryObjectContainmentReady", String(state.objectContainmentReady));
    setDataset("hearthCanvasFingerBoundaryPacketReady", String(state.boundaryPacketReady));
    setDataset("hearthCanvasFingerBoundaryVisibleContributionAvailable", String(state.visibleContributionAvailable));

    setDataset("hearthCanvasFingerBoundaryHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerBoundaryHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerBoundaryHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerBoundaryHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerBoundaryHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerBoundaryHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerBoundaryFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerBoundaryRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerBoundaryPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerBoundaryNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerBoundaryF13Claimed", "false");
    setDataset("hearthCanvasFingerBoundaryF21Claimed", "false");
    setDataset("hearthCanvasFingerBoundaryReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerBoundaryVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerBoundaryGeneratedImage", "false");
    setDataset("hearthCanvasFingerBoundaryGraphicBox", "false");
    setDataset("hearthCanvasFingerBoundaryWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");

    hearth.canvasFingerBoundary = api;
    hearth.canvasBoundaryFinger = api;
    hearth.canvasFingerBoundaryReceipt = getReceiptLight();
    hearth.canvasFingerBoundaryPacket = getBoundaryPacket();

    root.HEARTH_CANVAS_FINGER_BOUNDARY = api;
    root.HEARTH_CANVAS_BOUNDARY_FINGER = api;
    root.HEARTH_CANVAS_FINGER_BOUNDARY_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_BOUNDARY_BASE_GLOBE_CONTAINMENT_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_BOUNDARY_BASE_GLOBE_CONTAINMENT_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_BOUNDARY_PACKET = getBoundaryPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    buildBoundaryModel(options);
    buildBoundaryPacket(options);
    publishGlobals();

    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("BOUNDARY_FINGER_BOOT_COMPLETE", {
      hubDetected: state.hubDetected,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile
    });

    return getReceipt();
  }

  function init(options = {}) {
    return boot(options);
  }

  function start(options = {}) {
    return boot(options);
  }

  function mount(options = {}) {
    return boot(options);
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PACKET,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
    NEXT_FILE,
    MASS_FILE,
    SURFACE_FILE,
    LIGHT_FILE,
    INSPECT_FILE,

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
    fingerStretchRegistry: FINGER_STRETCH_REGISTRY,

    boot,
    init,
    start,
    mount,

    buildBoundaryModel,
    buildBoundaryPacket,
    getBoundaryPacket,
    registerWithCanvasHub,
    findCanvasHub,

    sample,
    sampleBoundary,
    sampleContainment,
    drawToCanvas,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsCanvasFingerBoundary: true,
    supportsBaseGlobeContainment: true,
    supportsBoundaryExpressionPacket: true,
    supportsCanvasHubRegistration: true,
    supportsVisibleBoundaryContribution: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsBoundaryFingerIdentity: true,
    ownsBoundaryExpressionPacket: true,
    ownsBaseGlobeContainment: true,
    ownsCanvasHub: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    buildBoundaryModel();
    buildBoundaryPacket();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({}), { once: true });
      } else {
        boot({});
      }
    } else {
      boot({});
    }
  } catch (error) {
    recordError("BOUNDARY_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
