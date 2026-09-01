// /assets/hearth/hearth.canvas.finger.mass.js
// HEARTH_CANVAS_FINGER_MASS_PHYSICAL_BODY_STRUCTURE_TNT_v1
// Full-file replacement.
// Canvas Finger 2 / Mass / Physical Body Structure.
// Purpose:
// - Establish the second downstream Canvas finger for Hearth.
// - Consume Boundary Finger evidence when available.
// - Publish broad physical mass / body-structure / early land-body support packet.
// - Feed the Canvas Expression Hub when a clear hub intake method exists.
// - Provide safe visible mass contribution data for later Canvas rendering.
// - Preserve diagnostic bridge, route conductor, parent hub, and upstream file boundaries.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, or Boundary Finger.
// - Do not claim terrain truth, hydrology truth, material truth, elevation truth, F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_MASS_PHYSICAL_BODY_STRUCTURE_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_MASS_PHYSICAL_BODY_STRUCTURE_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_MASS_PHYSICAL_BODY_STRUCTURE_PACKET_v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const FINGER_NAME = "mass";
  const FINGER_ROLE = "physical-body-structure";
  const FINGER_ORDER = 2;
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
    terrainTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    elevationTruthClaimed: false,
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
      file: BOUNDARY_FILE,
      role: "base globe containment, visible body edge, boundary envelope"
    }),
    Object.freeze({
      order: 2,
      name: "mass",
      file: FILE,
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
    "receiveMassFingerPacket",
    "registerCanvasFinger",
    "registerExpressionFinger",
    "receiveExpressionPacket",
    "receiveChildPacket"
  ]);

  const BOUNDARY_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerBoundary",
    "HEARTH.canvasBoundaryFinger",
    "HEARTH_CANVAS_FINGER_BOUNDARY",
    "HEARTH_CANVAS_BOUNDARY_FINGER"
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
    boundaryFile: BOUNDARY_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    massFingerLoaded: true,
    massFingerActive: true,
    physicalBodyStructureActive: true,
    boundaryDependencyExpected: true,
    boundaryDependencyObserved: false,
    boundaryPacketObserved: false,
    boundaryModelObserved: false,

    massModelReady: false,
    broadBodyMassReady: false,
    bodyStructureReady: false,
    earlyLandBodySupportReady: false,
    massPacketReady: false,
    visibleContributionAvailable: false,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",

    firstFailedCoordinate: "MASS_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "MASS_FINGER_WAITING_BOOT",

    boundaryPacket: null,
    boundaryModel: null,
    massModel: null,
    massPacket: null,
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
      event: safeString(event, "MASS_FINGER_EVENT"),
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
      code: safeString(code, "MASS_FINGER_ERROR"),
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

  function findBoundaryFinger() {
    for (const sourceName of BOUNDARY_SOURCE_NAMES) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return { boundary: candidate, sourceName };
      }
    }

    return { boundary: null, sourceName: "NONE" };
  }

  function readBoundaryEvidence() {
    const found = findBoundaryFinger();

    state.boundaryDependencyObserved = Boolean(found.boundary);

    if (!found.boundary) {
      state.boundaryPacketObserved = false;
      state.boundaryModelObserved = false;
      state.boundaryPacket = null;
      state.boundaryModel = null;

      return {
        observed: false,
        sourceName: "NONE",
        packet: null,
        model: null
      };
    }

    let packet = null;
    let receipt = null;

    try {
      if (isFunction(found.boundary.getBoundaryPacket)) {
        packet = found.boundary.getBoundaryPacket();
      } else if (isFunction(found.boundary.getReceipt)) {
        receipt = found.boundary.getReceipt();
        packet = receipt && receipt.boundaryPacket ? receipt.boundaryPacket : null;
      } else if (isFunction(found.boundary.getReceiptLight)) {
        receipt = found.boundary.getReceiptLight();
      }
    } catch (error) {
      recordError("MASS_FINGER_BOUNDARY_READ_FAILED", error, {
        sourceName: found.sourceName
      });
    }

    const model = packet && packet.boundaryModel
      ? packet.boundaryModel
      : receipt && receipt.boundaryModel
        ? receipt.boundaryModel
        : null;

    state.boundaryPacketObserved = Boolean(packet);
    state.boundaryModelObserved = Boolean(model);
    state.boundaryPacket = clonePlain(packet);
    state.boundaryModel = clonePlain(model);

    return {
      observed: true,
      sourceName: found.sourceName,
      packet: clonePlain(packet),
      model: clonePlain(model)
    };
  }

  function defaultBoundaryModel() {
    return {
      modelType: "HEARTH_BASE_GLOBE_BOUNDARY_MODEL_FALLBACK_FOR_MASS_FINGER",
      centerX: 0.5,
      centerY: 0.5,
      radius: 0.47,
      innerRadius: 0.427,
      outerRadius: 0.486,
      edgeSoftness: 0.055,
      containmentMask: "RADIAL_GLOBE_CONTAINMENT_MASK",
      fallbackUsed: true,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };
  }

  function buildMassModel(options = {}) {
    const boundaryEvidence = readBoundaryEvidence();
    const boundaryModel = boundaryEvidence.model || defaultBoundaryModel();

    const centerX = clamp(options.centerX ?? boundaryModel.centerX ?? 0.5, 0, 1);
    const centerY = clamp(options.centerY ?? boundaryModel.centerY ?? 0.5, 0, 1);
    const radius = clamp(options.radius ?? boundaryModel.radius ?? 0.47, 0.05, 0.5);

    const massAnchors = [
      { id: "MASS_NORTHWEST_BODY", x: centerX - radius * 0.32, y: centerY - radius * 0.2, scale: 0.22, weight: 0.74 },
      { id: "MASS_NORTH_BODY", x: centerX + radius * 0.04, y: centerY - radius * 0.36, scale: 0.16, weight: 0.58 },
      { id: "MASS_NORTHEAST_BODY", x: centerX + radius * 0.28, y: centerY - radius * 0.12, scale: 0.2, weight: 0.68 },
      { id: "MASS_WEST_BODY", x: centerX - radius * 0.42, y: centerY + radius * 0.12, scale: 0.18, weight: 0.62 },
      { id: "MASS_CENTER_BODY", x: centerX, y: centerY + radius * 0.02, scale: 0.25, weight: 0.82 },
      { id: "MASS_SOUTHEAST_BODY", x: centerX + radius * 0.25, y: centerY + radius * 0.3, scale: 0.19, weight: 0.64 },
      { id: "MASS_SOUTHWEST_BODY", x: centerX - radius * 0.18, y: centerY + radius * 0.38, scale: 0.17, weight: 0.56 }
    ];

    const model = {
      modelType: "HEARTH_BASE_GLOBE_MASS_MODEL",
      centerX,
      centerY,
      radius,
      boundaryModel: clonePlain(boundaryModel),
      boundaryDependencyObserved: boundaryEvidence.observed,
      boundaryPacketObserved: Boolean(boundaryEvidence.packet),
      boundaryModelObserved: Boolean(boundaryEvidence.model),

      massAnchors,
      broadBodyMassMode: "RADIAL_CONTAINED_MULTI_ANCHOR_BODY_FIELD",
      massCoordinateSpace: "normalized-0-to-1",
      projection: "front-facing-base-globe",
      terrainTruthClaim: false,
      elevationTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };

    state.massModel = clonePlain(model);
    state.massModelReady = true;
    state.broadBodyMassReady = true;
    state.bodyStructureReady = true;
    state.earlyLandBodySupportReady = true;
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

  function sampleBoundaryContainment(point, model) {
    const boundary = model && model.boundaryModel ? model.boundaryModel : defaultBoundaryModel();
    const dx = point.x - safeNumber(boundary.centerX, 0.5);
    const dy = point.y - safeNumber(boundary.centerY, 0.5);
    const distance = Math.sqrt((dx * dx) + (dy * dy));
    const radius = safeNumber(boundary.radius, 0.47);
    const outerRadius = safeNumber(boundary.outerRadius, radius * 1.035);

    if (distance <= radius) return 1;
    if (distance >= outerRadius) return 0;

    const span = Math.max(0.0001, outerRadius - radius);
    return clamp(1 - ((distance - radius) / span), 0, 1);
  }

  function sampleMass(x, y, width, height) {
    const model = state.massModel || buildMassModel();
    const point = normalizePoint(x, y, width, height);
    const containment = sampleBoundaryContainment(point, model);

    let mass = 0;

    for (const anchor of model.massAnchors || []) {
      const dx = point.x - anchor.x;
      const dy = point.y - anchor.y;
      const d = Math.sqrt((dx * dx) + (dy * dy));
      const scale = Math.max(0.0001, safeNumber(anchor.scale, 0.18) * model.radius);
      const contribution = Math.exp(-((d * d) / (2 * scale * scale))) * safeNumber(anchor.weight, 0.5);
      mass += contribution;
    }

    mass = clamp(mass * containment, 0, 1);

    const body = clamp((containment * 0.42) + (mass * 0.58), 0, 1);

    return {
      x: point.x,
      y: point.y,
      containment,
      mass,
      body,
      insideBody: containment > 0,
      broadBodyMassReady: true,
      terrainTruthClaim: false,
      elevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function sample(x, y, options = {}) {
    return {
      packetType: "HEARTH_CANVAS_MASS_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      fingerName: FINGER_NAME,
      mass: sampleMass(x, y, options.width, options.height),
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

    const model = state.massModel || buildMassModel(options);
    const minSide = Math.min(width, height);

    try {
      context.save();

      for (const anchor of model.massAnchors || []) {
        const cx = anchor.x * width;
        const cy = anchor.y * height;
        const r = Math.max(1, anchor.scale * model.radius * minSide * 1.85);

        const gradient = isFunction(context.createRadialGradient)
          ? context.createRadialGradient(cx, cy, Math.max(1, r * 0.08), cx, cy, r)
          : null;

        if (gradient) {
          gradient.addColorStop(0, "rgba(167, 151, 105, 0.34)");
          gradient.addColorStop(0.48, "rgba(105, 126, 94, 0.20)");
          gradient.addColorStop(1, "rgba(105, 126, 94, 0)");
          context.fillStyle = gradient;
        } else {
          context.fillStyle = "rgba(137, 133, 94, 0.18)";
        }

        context.globalAlpha = clamp(options.massOpacity ?? anchor.weight, 0, 0.62);
        context.beginPath();
        context.ellipse(
          cx,
          cy,
          r * clamp(options.ellipseX ?? 1.16, 0.5, 2.2),
          r * clamp(options.ellipseY ?? 0.78, 0.35, 2.2),
          safeNumber(options.rotation ?? 0.18, 0),
          0,
          Math.PI * 2
        );
        context.fill();
      }

      context.globalAlpha = clamp(options.bodyOpacity ?? 0.13, 0, 0.35);
      context.beginPath();
      context.arc(model.centerX * width, model.centerY * height, model.radius * minSide * 0.96, 0, Math.PI * 2);
      context.fillStyle = "rgba(111, 121, 99, 0.16)";
      context.fill();

      context.restore();

      record("MASS_FINGER_DRAW_TO_CANVAS_COMPLETE", {
        width,
        height,
        anchors: (model.massAnchors || []).length,
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

      recordError("MASS_FINGER_DRAW_TO_CANVAS_FAILED", error);

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

  function buildMassPacket(options = {}) {
    const model = buildMassModel(options);

    const packet = {
      packetType: "HEARTH_CANVAS_MASS_FINGER_PACKET",
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

      boundaryFile: BOUNDARY_FILE,
      boundaryDependencyExpected: true,
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryModelObserved: state.boundaryModelObserved,

      massFingerActive: true,
      physicalBodyStructureActive: true,
      massModelReady: true,
      broadBodyMassReady: true,
      bodyStructureReady: true,
      earlyLandBodySupportReady: true,
      massPacketReady: true,
      visibleContributionAvailable: true,

      massModel: clonePlain(model),
      sampleAvailable: true,
      sampleMassAvailable: true,
      drawToCanvasAvailable: true,

      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: state.hubRegistrationAccepted
        ? "WAITING_CANVAS_FINGER_SURFACE"
        : "WAITING_CANVAS_HUB_MASS_FINGER_INTAKE",
      noClaimsPreserved: true,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.massPacket = clonePlain(packet);
    state.massPacketReady = true;
    state.massModelReady = true;
    state.broadBodyMassReady = true;
    state.bodyStructureReady = true;
    state.earlyLandBodySupportReady = true;
    state.visibleContributionAvailable = true;

    return packet;
  }

  function getMassPacket(options = {}) {
    if (!state.massPacket || options.rebuild === true) {
      return buildMassPacket(options);
    }

    return clonePlain(state.massPacket);
  }

  function registerWithCanvasHub(options = {}) {
    const packet = buildMassPacket(options);
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
      state.postgameStatus = "MASS_FINGER_HELD_CANVAS_HUB_NOT_FOUND";

      record("MASS_FINGER_HUB_NOT_FOUND", {
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
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted ? "NONE" : "CANVAS_HUB_REJECTED_MASS_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = "WAITING_CANVAS_FINGER_SURFACE";
          state.recommendedNextFile = NEXT_FILE;
          state.recommendedNextRenewalTarget = NEXT_FILE;
          state.postgameStatus = "MASS_FINGER_ACCEPTED_BY_CANVAS_HUB_READY_FOR_SURFACE_FINGER";
        } else {
          state.firstFailedCoordinate = "CANVAS_HUB_REJECTED_MASS_PACKET";
          state.recommendedNextFile = PARENT_HUB_FILE;
          state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
          state.postgameStatus = "MASS_FINGER_HELD_CANVAS_HUB_REJECTED_PACKET";
        }

        record("MASS_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        buildMassPacket(options);
        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("MASS_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
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
    state.postgameStatus = "MASS_FINGER_HELD_CANVAS_HUB_INTAKE_NOT_FOUND";

    record("MASS_FINGER_HUB_INTAKE_NOT_FOUND", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    buildMassPacket(options);
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
      boundaryFile: BOUNDARY_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      massFingerLoaded: state.massFingerLoaded,
      massFingerActive: state.massFingerActive,
      physicalBodyStructureActive: state.physicalBodyStructureActive,
      boundaryDependencyExpected: state.boundaryDependencyExpected,
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryModelObserved: state.boundaryModelObserved,

      massModelReady: state.massModelReady,
      broadBodyMassReady: state.broadBodyMassReady,
      bodyStructureReady: state.bodyStructureReady,
      earlyLandBodySupportReady: state.earlyLandBodySupportReady,
      massPacketReady: state.massPacketReady,
      visibleContributionAvailable: state.visibleContributionAvailable,

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      sampleAvailable: true,
      sampleMassAvailable: true,
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
      boundaryPacket: clonePlain(state.boundaryPacket),
      boundaryModel: clonePlain(state.boundaryModel),
      massModel: clonePlain(state.massModel),
      massPacket: clonePlain(state.massPacket),
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
      boundarySourceNames: clonePlain(BOUNDARY_SOURCE_NAMES),
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
      "HEARTH_CANVAS_FINGER_MASS_PHYSICAL_BODY_STRUCTURE_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      line("parentHubFile", r.parentHubFile),
      line("boundaryFile", r.boundaryFile),
      "",
      "FINGER",
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("fingerOrder", r.fingerOrder),
      line("fingerStretchTotal", r.fingerStretchTotal),
      "",
      "BOUNDARY_DEPENDENCY",
      line("boundaryDependencyExpected", r.boundaryDependencyExpected),
      line("boundaryDependencyObserved", r.boundaryDependencyObserved),
      line("boundaryPacketObserved", r.boundaryPacketObserved),
      line("boundaryModelObserved", r.boundaryModelObserved),
      "",
      "MASS_STATUS",
      line("massFingerLoaded", r.massFingerLoaded),
      line("massFingerActive", r.massFingerActive),
      line("physicalBodyStructureActive", r.physicalBodyStructureActive),
      line("massModelReady", r.massModelReady),
      line("broadBodyMassReady", r.broadBodyMassReady),
      line("bodyStructureReady", r.bodyStructureReady),
      line("earlyLandBodySupportReady", r.earlyLandBodySupportReady),
      line("massPacketReady", r.massPacketReady),
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
      line("sampleMassAvailable", r.sampleMassAvailable),
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
      line("terrainTruthClaimed", false),
      line("hydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
      line("elevationTruthClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerMassLoaded", "true");
    setDataset("hearthCanvasFingerMassContract", CONTRACT);
    setDataset("hearthCanvasFingerMassReceipt", RECEIPT);
    setDataset("hearthCanvasFingerMassFile", FILE);
    setDataset("hearthCanvasFingerMassActive", String(state.massFingerActive));
    setDataset("hearthCanvasFingerMassPhysicalBodyStructureActive", String(state.physicalBodyStructureActive));

    setDataset("hearthCanvasFingerMassBoundaryDependencyExpected", String(state.boundaryDependencyExpected));
    setDataset("hearthCanvasFingerMassBoundaryDependencyObserved", String(state.boundaryDependencyObserved));
    setDataset("hearthCanvasFingerMassBoundaryPacketObserved", String(state.boundaryPacketObserved));
    setDataset("hearthCanvasFingerMassBoundaryModelObserved", String(state.boundaryModelObserved));

    setDataset("hearthCanvasFingerMassModelReady", String(state.massModelReady));
    setDataset("hearthCanvasFingerMassBroadBodyMassReady", String(state.broadBodyMassReady));
    setDataset("hearthCanvasFingerMassBodyStructureReady", String(state.bodyStructureReady));
    setDataset("hearthCanvasFingerMassEarlyLandBodySupportReady", String(state.earlyLandBodySupportReady));
    setDataset("hearthCanvasFingerMassPacketReady", String(state.massPacketReady));
    setDataset("hearthCanvasFingerMassVisibleContributionAvailable", String(state.visibleContributionAvailable));

    setDataset("hearthCanvasFingerMassHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerMassHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerMassHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerMassHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerMassHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerMassHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerMassFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerMassRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerMassPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerMassNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerMassF13Claimed", "false");
    setDataset("hearthCanvasFingerMassF21Claimed", "false");
    setDataset("hearthCanvasFingerMassReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerMassTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerMassHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerMassMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerMassElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerMassVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerMassGeneratedImage", "false");
    setDataset("hearthCanvasFingerMassGraphicBox", "false");
    setDataset("hearthCanvasFingerMassWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");

    hearth.canvasFingerMass = api;
    hearth.canvasMassFinger = api;
    hearth.canvasFingerMassReceipt = getReceiptLight();
    hearth.canvasFingerMassPacket = getMassPacket();

    root.HEARTH_CANVAS_FINGER_MASS = api;
    root.HEARTH_CANVAS_MASS_FINGER = api;
    root.HEARTH_CANVAS_FINGER_MASS_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_MASS_PHYSICAL_BODY_STRUCTURE_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_MASS_PHYSICAL_BODY_STRUCTURE_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_MASS_PACKET = getMassPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readBoundaryEvidence();
    buildMassModel(options);
    buildMassPacket(options);
    publishGlobals();

    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("MASS_FINGER_BOOT_COMPLETE", {
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
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
    BOUNDARY_FILE,
    NEXT_FILE,
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
    boundaryFile: BOUNDARY_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,
    fingerStretchRegistry: FINGER_STRETCH_REGISTRY,

    boot,
    init,
    start,
    mount,

    readBoundaryEvidence,
    buildMassModel,
    buildMassPacket,
    getMassPacket,
    registerWithCanvasHub,
    findCanvasHub,
    findBoundaryFinger,

    sample,
    sampleMass,
    drawToCanvas,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsCanvasFingerMass: true,
    supportsPhysicalBodyStructure: true,
    supportsMassExpressionPacket: true,
    supportsBoundaryFingerConsumption: true,
    supportsCanvasHubRegistration: true,
    supportsVisibleMassContribution: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsMassFingerIdentity: true,
    ownsMassExpressionPacket: true,
    ownsPhysicalBodyStructure: true,
    ownsCanvasHub: false,
    ownsBoundaryFinger: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    readBoundaryEvidence();
    buildMassModel();
    buildMassPacket();
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
    recordError("MASS_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
