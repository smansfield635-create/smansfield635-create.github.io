// /assets/hearth/hearth.canvas.finger.surface.js
// HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1
// Full-file replacement.
// Canvas Finger 3 / Surface / First Material Differentiation.
// Purpose:
// - Establish the third downstream Canvas finger for Hearth.
// - Consume Boundary Finger and Mass Finger evidence when available.
// - Publish first surface/material differentiation packet for the base Canvas globe.
// - Feed the Canvas Expression Hub when a clear hub intake method exists.
// - Provide safe visible surface contribution data for later Canvas rendering.
// - Preserve diagnostic bridge, route conductor, parent hub, and upstream file boundaries.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Boundary Finger, or Mass Finger.
// - Do not claim final terrain truth, hydrology truth, material truth, elevation truth, F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_PACKET_v1";

  const FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const NEXT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const FINGER_NAME = "surface";
  const FINGER_ROLE = "first-material-differentiation";
  const FINGER_ORDER = 3;
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
    biomeTruthClaimed: false,
    settlementTruthClaimed: false,
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
      file: MASS_FILE,
      role: "physical body mass, broad body structure, early land/body support"
    }),
    Object.freeze({
      order: 3,
      name: "surface",
      file: FILE,
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
    "receiveSurfaceFingerPacket",
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

  const MASS_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerMass",
    "HEARTH.canvasMassFinger",
    "HEARTH_CANVAS_FINGER_MASS",
    "HEARTH_CANVAS_MASS_FINGER"
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
    massFile: MASS_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    surfaceFingerLoaded: true,
    surfaceFingerActive: true,
    firstMaterialDifferentiationActive: true,

    boundaryDependencyExpected: true,
    boundaryDependencyObserved: false,
    boundaryPacketObserved: false,
    boundaryModelObserved: false,

    massDependencyExpected: true,
    massDependencyObserved: false,
    massPacketObserved: false,
    massModelObserved: false,

    surfaceModelReady: false,
    firstSurfaceDifferentiationReady: false,
    roughTerrainTintReady: false,
    shallowMaterialVariationReady: false,
    surfacePacketReady: false,
    visibleContributionAvailable: false,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",

    firstFailedCoordinate: "SURFACE_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "SURFACE_FINGER_WAITING_BOOT",

    boundaryPacket: null,
    boundaryModel: null,
    massPacket: null,
    massModel: null,
    surfaceModel: null,
    surfacePacket: null,
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
      event: safeString(event, "SURFACE_FINGER_EVENT"),
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
      code: safeString(code, "SURFACE_FINGER_ERROR"),
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
    for (const sourceName of sourceNames) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return { source: candidate, sourceName };
      }
    }

    return { source: null, sourceName: "NONE" };
  }

  function readBoundaryEvidence() {
    const found = findSource(BOUNDARY_SOURCE_NAMES);

    state.boundaryDependencyObserved = Boolean(found.source);

    if (!found.source) {
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
      if (isFunction(found.source.getBoundaryPacket)) {
        packet = found.source.getBoundaryPacket();
      } else if (isFunction(found.source.getReceipt)) {
        receipt = found.source.getReceipt();
        packet = receipt && receipt.boundaryPacket ? receipt.boundaryPacket : null;
      } else if (isFunction(found.source.getReceiptLight)) {
        receipt = found.source.getReceiptLight();
      }
    } catch (error) {
      recordError("SURFACE_FINGER_BOUNDARY_READ_FAILED", error, {
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

  function readMassEvidence() {
    const found = findSource(MASS_SOURCE_NAMES);

    state.massDependencyObserved = Boolean(found.source);

    if (!found.source) {
      state.massPacketObserved = false;
      state.massModelObserved = false;
      state.massPacket = null;
      state.massModel = null;

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
      if (isFunction(found.source.getMassPacket)) {
        packet = found.source.getMassPacket();
      } else if (isFunction(found.source.getReceipt)) {
        receipt = found.source.getReceipt();
        packet = receipt && receipt.massPacket ? receipt.massPacket : null;
      } else if (isFunction(found.source.getReceiptLight)) {
        receipt = found.source.getReceiptLight();
      }
    } catch (error) {
      recordError("SURFACE_FINGER_MASS_READ_FAILED", error, {
        sourceName: found.sourceName
      });
    }

    const model = packet && packet.massModel
      ? packet.massModel
      : receipt && receipt.massModel
        ? receipt.massModel
        : null;

    state.massPacketObserved = Boolean(packet);
    state.massModelObserved = Boolean(model);
    state.massPacket = clonePlain(packet);
    state.massModel = clonePlain(model);

    return {
      observed: true,
      sourceName: found.sourceName,
      packet: clonePlain(packet),
      model: clonePlain(model)
    };
  }

  function defaultBoundaryModel() {
    return {
      modelType: "HEARTH_BASE_GLOBE_BOUNDARY_MODEL_FALLBACK_FOR_SURFACE_FINGER",
      centerX: 0.5,
      centerY: 0.5,
      radius: 0.47,
      innerRadius: 0.427,
      outerRadius: 0.486,
      edgeSoftness: 0.055,
      fallbackUsed: true,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };
  }

  function defaultMassModel(boundaryModel) {
    const b = boundaryModel || defaultBoundaryModel();

    return {
      modelType: "HEARTH_BASE_GLOBE_MASS_MODEL_FALLBACK_FOR_SURFACE_FINGER",
      centerX: safeNumber(b.centerX, 0.5),
      centerY: safeNumber(b.centerY, 0.5),
      radius: safeNumber(b.radius, 0.47),
      massAnchors: [
        { id: "SURFACE_FALLBACK_NW", x: 0.35, y: 0.39, scale: 0.22, weight: 0.7 },
        { id: "SURFACE_FALLBACK_C", x: 0.5, y: 0.52, scale: 0.25, weight: 0.8 },
        { id: "SURFACE_FALLBACK_SE", x: 0.61, y: 0.64, scale: 0.2, weight: 0.62 }
      ],
      fallbackUsed: true,
      terrainTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function buildSurfaceModel(options = {}) {
    const boundaryEvidence = readBoundaryEvidence();
    const massEvidence = readMassEvidence();

    const boundaryModel = boundaryEvidence.model || defaultBoundaryModel();
    const massModel = massEvidence.model || defaultMassModel(boundaryModel);

    const centerX = clamp(options.centerX ?? massModel.centerX ?? boundaryModel.centerX ?? 0.5, 0, 1);
    const centerY = clamp(options.centerY ?? massModel.centerY ?? boundaryModel.centerY ?? 0.5, 0, 1);
    const radius = clamp(options.radius ?? massModel.radius ?? boundaryModel.radius ?? 0.47, 0.05, 0.5);

    const materialBands = [
      {
        id: "SURFACE_DRY_HIGH_TONE",
        label: "dry-rock-soil-first-pass",
        threshold: 0.62,
        tint: "rock-soil",
        ownsTruth: false
      },
      {
        id: "SURFACE_MID_BODY_TONE",
        label: "weathered-ground-first-pass",
        threshold: 0.38,
        tint: "weathered-ground",
        ownsTruth: false
      },
      {
        id: "SURFACE_LOW_BODY_TONE",
        label: "low-shadow-shelf-first-pass",
        threshold: 0.18,
        tint: "low-body-shadow",
        ownsTruth: false
      },
      {
        id: "SURFACE_BOUNDARY_EDGE_TONE",
        label: "body-edge-readability",
        threshold: 0.05,
        tint: "edge-readability",
        ownsTruth: false
      }
    ];

    const surfaceSeeds = [
      { id: "SURFACE_NORTHWEST_PATCH", x: centerX - radius * 0.3, y: centerY - radius * 0.18, scale: 0.17, value: 0.72 },
      { id: "SURFACE_NORTH_PATCH", x: centerX + radius * 0.02, y: centerY - radius * 0.33, scale: 0.13, value: 0.48 },
      { id: "SURFACE_EAST_PATCH", x: centerX + radius * 0.3, y: centerY - radius * 0.05, scale: 0.16, value: 0.66 },
      { id: "SURFACE_CENTER_PATCH", x: centerX - radius * 0.02, y: centerY + radius * 0.04, scale: 0.22, value: 0.82 },
      { id: "SURFACE_SOUTHWEST_PATCH", x: centerX - radius * 0.21, y: centerY + radius * 0.35, scale: 0.14, value: 0.44 },
      { id: "SURFACE_SOUTHEAST_PATCH", x: centerX + radius * 0.24, y: centerY + radius * 0.28, scale: 0.15, value: 0.58 }
    ];

    const model = {
      modelType: "HEARTH_BASE_GLOBE_SURFACE_MODEL",
      centerX,
      centerY,
      radius,
      boundaryModel: clonePlain(boundaryModel),
      massModel: clonePlain(massModel),

      boundaryDependencyObserved: boundaryEvidence.observed,
      boundaryPacketObserved: Boolean(boundaryEvidence.packet),
      boundaryModelObserved: Boolean(boundaryEvidence.model),

      massDependencyObserved: massEvidence.observed,
      massPacketObserved: Boolean(massEvidence.packet),
      massModelObserved: Boolean(massEvidence.model),

      materialBands,
      surfaceSeeds,
      surfaceMode: "FIRST_PASS_MATERIAL_DIFFERENTIATION",
      surfaceCoordinateSpace: "normalized-0-to-1",
      projection: "front-facing-base-globe",

      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      biomeTruthClaim: false,
      settlementTruthClaim: false,
      finalGeometryClaim: false,
      finalVisualClaim: false
    };

    state.surfaceModel = clonePlain(model);
    state.surfaceModelReady = true;
    state.firstSurfaceDifferentiationReady = true;
    state.roughTerrainTintReady = true;
    state.shallowMaterialVariationReady = true;
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

  function sampleMassInfluence(point, model) {
    const massModel = model && model.massModel ? model.massModel : defaultMassModel(model && model.boundaryModel);
    const anchors = Array.isArray(massModel.massAnchors) ? massModel.massAnchors : [];
    const radius = safeNumber(massModel.radius, 0.47);

    let mass = 0;

    for (const anchor of anchors) {
      const dx = point.x - safeNumber(anchor.x, 0.5);
      const dy = point.y - safeNumber(anchor.y, 0.5);
      const d = Math.sqrt((dx * dx) + (dy * dy));
      const scale = Math.max(0.0001, safeNumber(anchor.scale, 0.18) * radius);
      mass += Math.exp(-((d * d) / (2 * scale * scale))) * safeNumber(anchor.weight, 0.5);
    }

    return clamp(mass, 0, 1);
  }

  function sampleSurfaceValue(point, model) {
    const containment = sampleBoundaryContainment(point, model);
    const mass = sampleMassInfluence(point, model);

    let seedValue = 0;

    for (const seed of model.surfaceSeeds || []) {
      const dx = point.x - safeNumber(seed.x, 0.5);
      const dy = point.y - safeNumber(seed.y, 0.5);
      const d = Math.sqrt((dx * dx) + (dy * dy));
      const scale = Math.max(0.0001, safeNumber(seed.scale, 0.16) * model.radius);
      seedValue += Math.exp(-((d * d) / (2 * scale * scale))) * safeNumber(seed.value, 0.5);
    }

    const latitudeBias = clamp(1 - Math.abs(point.y - model.centerY) * 1.6, 0, 1);
    const radialBias = containment;

    const surface = clamp(
      ((mass * 0.46) + (seedValue * 0.42) + (latitudeBias * 0.12)) * radialBias,
      0,
      1
    );

    let materialClass = "outside-body";

    if (containment > 0) {
      if (surface >= 0.62) materialClass = "dry-rock-soil-first-pass";
      else if (surface >= 0.38) materialClass = "weathered-ground-first-pass";
      else if (surface >= 0.18) materialClass = "low-body-shadow-first-pass";
      else materialClass = "edge-readability-first-pass";
    }

    return {
      containment,
      mass,
      surface,
      materialClass
    };
  }

  function sampleSurface(x, y, width, height) {
    const model = state.surfaceModel || buildSurfaceModel();
    const point = normalizePoint(x, y, width, height);
    const value = sampleSurfaceValue(point, model);

    return {
      x: point.x,
      y: point.y,
      containment: value.containment,
      mass: value.mass,
      surface: value.surface,
      materialClass: value.materialClass,
      firstSurfaceDifferentiationReady: true,
      terrainTruthClaim: false,
      hydrologyTruthClaim: false,
      materialTruthClaim: false,
      elevationTruthClaim: false,
      finalVisualClaim: false
    };
  }

  function sample(x, y, options = {}) {
    return {
      packetType: "HEARTH_CANVAS_SURFACE_FINGER_SAMPLE",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      fingerName: FINGER_NAME,
      surface: sampleSurface(x, y, options.width, options.height),
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

    const model = state.surfaceModel || buildSurfaceModel(options);
    const minSide = Math.min(width, height);

    try {
      context.save();

      for (const seed of model.surfaceSeeds || []) {
        const cx = safeNumber(seed.x, 0.5) * width;
        const cy = safeNumber(seed.y, 0.5) * height;
        const r = Math.max(1, safeNumber(seed.scale, 0.16) * model.radius * minSide * 2.15);
        const value = safeNumber(seed.value, 0.5);

        let fill = "rgba(112, 116, 87, 0.22)";

        if (value >= 0.7) {
          fill = "rgba(143, 126, 82, 0.30)";
        } else if (value >= 0.52) {
          fill = "rgba(108, 132, 91, 0.24)";
        } else {
          fill = "rgba(77, 91, 82, 0.20)";
        }

        context.globalAlpha = clamp(options.surfaceOpacity ?? 0.58, 0, 0.72);
        context.beginPath();
        context.ellipse(
          cx,
          cy,
          r * clamp(options.ellipseX ?? 1.28, 0.5, 2.4),
          r * clamp(options.ellipseY ?? 0.72, 0.35, 2.2),
          safeNumber(options.rotation ?? -0.22, 0),
          0,
          Math.PI * 2
        );
        context.fillStyle = fill;
        context.fill();
      }

      context.globalAlpha = clamp(options.bodyGlazeOpacity ?? 0.12, 0, 0.28);
      context.beginPath();
      context.arc(model.centerX * width, model.centerY * height, model.radius * minSide * 0.985, 0, Math.PI * 2);
      context.fillStyle = "rgba(121, 105, 72, 0.12)";
      context.fill();

      context.globalAlpha = clamp(options.edgeSurfaceOpacity ?? 0.2, 0, 0.35);
      context.lineWidth = Math.max(1, minSide * 0.006);
      context.beginPath();
      context.arc(model.centerX * width, model.centerY * height, model.radius * minSide * 0.998, 0, Math.PI * 2);
      context.strokeStyle = "rgba(199, 175, 105, 0.24)";
      context.stroke();

      context.restore();

      record("SURFACE_FINGER_DRAW_TO_CANVAS_COMPLETE", {
        width,
        height,
        seeds: (model.surfaceSeeds || []).length,
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

      recordError("SURFACE_FINGER_DRAW_TO_CANVAS_FAILED", error);

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

  function buildSurfacePacket(options = {}) {
    const model = buildSurfaceModel(options);

    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_FINGER_PACKET",
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

      massFile: MASS_FILE,
      massDependencyExpected: true,
      massDependencyObserved: state.massDependencyObserved,
      massPacketObserved: state.massPacketObserved,
      massModelObserved: state.massModelObserved,

      surfaceFingerActive: true,
      firstMaterialDifferentiationActive: true,
      surfaceModelReady: true,
      firstSurfaceDifferentiationReady: true,
      roughTerrainTintReady: true,
      shallowMaterialVariationReady: true,
      surfacePacketReady: true,
      visibleContributionAvailable: true,

      surfaceModel: clonePlain(model),
      sampleAvailable: true,
      sampleSurfaceAvailable: true,
      drawToCanvasAvailable: true,

      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      recommendedNextFile: NEXT_FILE,
      recommendedNextRenewalTarget: NEXT_FILE,
      firstFailedCoordinate: state.hubRegistrationAccepted
        ? "WAITING_CANVAS_FINGER_LIGHT"
        : "WAITING_CANVAS_HUB_SURFACE_FINGER_INTAKE",
      noClaimsPreserved: true,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.surfacePacket = clonePlain(packet);
    state.surfacePacketReady = true;
    state.surfaceModelReady = true;
    state.firstSurfaceDifferentiationReady = true;
    state.roughTerrainTintReady = true;
    state.shallowMaterialVariationReady = true;
    state.visibleContributionAvailable = true;

    return packet;
  }

  function getSurfacePacket(options = {}) {
    if (!state.surfacePacket || options.rebuild === true) {
      return buildSurfacePacket(options);
    }

    return clonePlain(state.surfacePacket);
  }

  function registerWithCanvasHub(options = {}) {
    const packet = buildSurfacePacket(options);
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
      state.postgameStatus = "SURFACE_FINGER_HELD_CANVAS_HUB_NOT_FOUND";

      record("SURFACE_FINGER_HUB_NOT_FOUND", {
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
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted ? "NONE" : "CANVAS_HUB_REJECTED_SURFACE_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = "WAITING_CANVAS_FINGER_LIGHT";
          state.recommendedNextFile = NEXT_FILE;
          state.recommendedNextRenewalTarget = NEXT_FILE;
          state.postgameStatus = "SURFACE_FINGER_ACCEPTED_BY_CANVAS_HUB_READY_FOR_LIGHT_FINGER";
        } else {
          state.firstFailedCoordinate = "CANVAS_HUB_REJECTED_SURFACE_PACKET";
          state.recommendedNextFile = PARENT_HUB_FILE;
          state.recommendedNextRenewalTarget = PARENT_HUB_FILE;
          state.postgameStatus = "SURFACE_FINGER_HELD_CANVAS_HUB_REJECTED_PACKET";
        }

        record("SURFACE_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        buildSurfacePacket(options);
        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("SURFACE_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
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
    state.postgameStatus = "SURFACE_FINGER_HELD_CANVAS_HUB_INTAKE_NOT_FOUND";

    record("SURFACE_FINGER_HUB_INTAKE_NOT_FOUND", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    buildSurfacePacket(options);
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
      massFile: MASS_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      surfaceFingerLoaded: state.surfaceFingerLoaded,
      surfaceFingerActive: state.surfaceFingerActive,
      firstMaterialDifferentiationActive: state.firstMaterialDifferentiationActive,

      boundaryDependencyExpected: state.boundaryDependencyExpected,
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryModelObserved: state.boundaryModelObserved,

      massDependencyExpected: state.massDependencyExpected,
      massDependencyObserved: state.massDependencyObserved,
      massPacketObserved: state.massPacketObserved,
      massModelObserved: state.massModelObserved,

      surfaceModelReady: state.surfaceModelReady,
      firstSurfaceDifferentiationReady: state.firstSurfaceDifferentiationReady,
      roughTerrainTintReady: state.roughTerrainTintReady,
      shallowMaterialVariationReady: state.shallowMaterialVariationReady,
      surfacePacketReady: state.surfacePacketReady,
      visibleContributionAvailable: state.visibleContributionAvailable,

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      sampleAvailable: true,
      sampleSurfaceAvailable: true,
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
      massPacket: clonePlain(state.massPacket),
      massModel: clonePlain(state.massModel),
      surfaceModel: clonePlain(state.surfaceModel),
      surfacePacket: clonePlain(state.surfacePacket),
      fingerStretchRegistry: clonePlain(FINGER_STRETCH_REGISTRY),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
      boundarySourceNames: clonePlain(BOUNDARY_SOURCE_NAMES),
      massSourceNames: clonePlain(MASS_SOURCE_NAMES),
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
      "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_RECEIPT",
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
      line("massFile", r.massFile),
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
      "MASS_DEPENDENCY",
      line("massDependencyExpected", r.massDependencyExpected),
      line("massDependencyObserved", r.massDependencyObserved),
      line("massPacketObserved", r.massPacketObserved),
      line("massModelObserved", r.massModelObserved),
      "",
      "SURFACE_STATUS",
      line("surfaceFingerLoaded", r.surfaceFingerLoaded),
      line("surfaceFingerActive", r.surfaceFingerActive),
      line("firstMaterialDifferentiationActive", r.firstMaterialDifferentiationActive),
      line("surfaceModelReady", r.surfaceModelReady),
      line("firstSurfaceDifferentiationReady", r.firstSurfaceDifferentiationReady),
      line("roughTerrainTintReady", r.roughTerrainTintReady),
      line("shallowMaterialVariationReady", r.shallowMaterialVariationReady),
      line("surfacePacketReady", r.surfacePacketReady),
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
      line("sampleSurfaceAvailable", r.sampleSurfaceAvailable),
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
      line("biomeTruthClaimed", false),
      line("settlementTruthClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerSurfaceLoaded", "true");
    setDataset("hearthCanvasFingerSurfaceContract", CONTRACT);
    setDataset("hearthCanvasFingerSurfaceReceipt", RECEIPT);
    setDataset("hearthCanvasFingerSurfaceFile", FILE);
    setDataset("hearthCanvasFingerSurfaceActive", String(state.surfaceFingerActive));
    setDataset("hearthCanvasFingerSurfaceFirstMaterialDifferentiationActive", String(state.firstMaterialDifferentiationActive));

    setDataset("hearthCanvasFingerSurfaceBoundaryDependencyExpected", String(state.boundaryDependencyExpected));
    setDataset("hearthCanvasFingerSurfaceBoundaryDependencyObserved", String(state.boundaryDependencyObserved));
    setDataset("hearthCanvasFingerSurfaceBoundaryPacketObserved", String(state.boundaryPacketObserved));
    setDataset("hearthCanvasFingerSurfaceBoundaryModelObserved", String(state.boundaryModelObserved));

    setDataset("hearthCanvasFingerSurfaceMassDependencyExpected", String(state.massDependencyExpected));
    setDataset("hearthCanvasFingerSurfaceMassDependencyObserved", String(state.massDependencyObserved));
    setDataset("hearthCanvasFingerSurfaceMassPacketObserved", String(state.massPacketObserved));
    setDataset("hearthCanvasFingerSurfaceMassModelObserved", String(state.massModelObserved));

    setDataset("hearthCanvasFingerSurfaceModelReady", String(state.surfaceModelReady));
    setDataset("hearthCanvasFingerSurfaceFirstSurfaceDifferentiationReady", String(state.firstSurfaceDifferentiationReady));
    setDataset("hearthCanvasFingerSurfaceRoughTerrainTintReady", String(state.roughTerrainTintReady));
    setDataset("hearthCanvasFingerSurfaceShallowMaterialVariationReady", String(state.shallowMaterialVariationReady));
    setDataset("hearthCanvasFingerSurfacePacketReady", String(state.surfacePacketReady));
    setDataset("hearthCanvasFingerSurfaceVisibleContributionAvailable", String(state.visibleContributionAvailable));

    setDataset("hearthCanvasFingerSurfaceHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerSurfaceHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerSurfaceHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerSurfaceHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerSurfaceHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerSurfaceHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerSurfaceFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerSurfaceRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerSurfacePostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerSurfaceNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerSurfaceF13Claimed", "false");
    setDataset("hearthCanvasFingerSurfaceF21Claimed", "false");
    setDataset("hearthCanvasFingerSurfaceReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceBiomeTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceSettlementTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceGeneratedImage", "false");
    setDataset("hearthCanvasFingerSurfaceGraphicBox", "false");
    setDataset("hearthCanvasFingerSurfaceWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");

    hearth.canvasFingerSurface = api;
    hearth.canvasSurfaceFinger = api;
    hearth.canvasFingerSurfaceReceipt = getReceiptLight();
    hearth.canvasFingerSurfacePacket = getSurfacePacket();

    root.HEARTH_CANVAS_FINGER_SURFACE = api;
    root.HEARTH_CANVAS_SURFACE_FINGER = api;
    root.HEARTH_CANVAS_FINGER_SURFACE_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_SURFACE_PACKET = getSurfacePacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot(options = {}) {
    state.timestamp = nowIso();

    readBoundaryEvidence();
    readMassEvidence();
    buildSurfaceModel(options);
    buildSurfacePacket(options);
    publishGlobals();

    registerWithCanvasHub(options);

    state.booted = true;
    state.mounted = true;

    updateDataset();
    publishGlobals();

    record("SURFACE_FINGER_BOOT_COMPLETE", {
      boundaryDependencyObserved: state.boundaryDependencyObserved,
      massDependencyObserved: state.massDependencyObserved,
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
    MASS_FILE,
    NEXT_FILE,
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
    massFile: MASS_FILE,

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
    readMassEvidence,
    buildSurfaceModel,
    buildSurfacePacket,
    getSurfacePacket,
    registerWithCanvasHub,
    findCanvasHub,

    sample,
    sampleSurface,
    drawToCanvas,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsCanvasFingerSurface: true,
    supportsFirstMaterialDifferentiation: true,
    supportsSurfaceExpressionPacket: true,
    supportsBoundaryFingerConsumption: true,
    supportsMassFingerConsumption: true,
    supportsCanvasHubRegistration: true,
    supportsVisibleSurfaceContribution: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsSurfaceFingerIdentity: true,
    ownsSurfaceExpressionPacket: true,
    ownsFirstMaterialDifferentiation: true,
    ownsCanvasHub: false,
    ownsBoundaryFinger: false,
    ownsMassFinger: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsBiomeTruth: false,
    ownsSettlementTruth: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    readBoundaryEvidence();
    readMassEvidence();
    buildSurfaceModel();
    buildSurfacePacket();
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
    recordError("SURFACE_FINGER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
