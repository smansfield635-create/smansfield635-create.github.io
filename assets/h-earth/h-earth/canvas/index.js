// /assets/h-earth/h-earth.canvas.js
// H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1
// Full-file replacement.
// Canvas visible-composition authority only.
//
// Purpose:
// - Consume H-Earth surface parent material truth.
// - Create the canvas element.
// - Paint the orbital/aerial H-Earth visible composition from surface cells.
// - Publish pixel proof and render receipts.
// - Preserve kernel, lattice, landmap, terrain, and surface truth as read-only parents.
// - Keep controls, animation authority, weather, atmosphere, life, ground mode, and estate mode held.
//
// Owns:
// - final visible composition
// - canvas creation
// - frame paint
// - pixel proof
// - public render receipt
// - readiness lock for downstream controls
//
// Does not own:
// - land/water truth
// - terrain truth
// - surface material truth
// - route boot
// - controls
// - drag
// - rotation authority
// - zoom authority
// - animation clock
// - weather
// - atmosphere
// - life systems

const CONTRACT = "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1";
const REQUIRED_PARENT = "surface";
const REQUIRED_SURFACE_CONTRACT = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";
const REQUIRED_SURFACE_COMPLETION_CONTRACT = "H_EARTH_G1_SURFACE_MATERIAL_COMPLETION_TNT_v2";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const VERSION = "2026-05-11.h-earth.g1.canvas-visible-composition-v1";

const DEFAULT_SIZE = 720;
const MIN_SIZE = 280;
const MAX_SIZE = 1200;

const MATERIAL_PALETTE = Object.freeze({
  "deep-ocean": "#061a38",
  "abyssal-ocean": "#08234a",
  "shelf-water": "#1f6f8f",
  "slope-water": "#0d4066",
  "trench-water": "#030b1f",
  "seaway-water": "#0f5578",
  "basin-mouth-water": "#1b617b",
  "submarine-ridge": "#214d5c",
  "seamount-field": "#2b5964",
  "fracture-water": "#102c4a",

  "coastal-stone": "#b7a06a",
  "beach-sediment": "#d4b878",
  "cliff-stone": "#6f684d",
  "escarpment-stone": "#7b7555",
  "plateau-stone": "#8b855d",
  "highland-stone": "#6f8a5d",
  "mountain-stone": "#626d66",
  "summit-stone": "#d6d9cf",
  "polar-crust": "#c7d8dc",
  "glacial-crust": "#e8f2f5",
  "lowland-ground": "#496f42",
  "basin-ground": "#5f6b3b",
  "valley-ground": "#3f6f4b",
  "canyon-stone": "#8a6048",
  "fault-stone": "#72504a",
  "island-ground": "#4d7c4d",
  "archipelago-ground": "#4e8d62",
  "land-anchor-ground": "#5f7f4f",
  "coastal-shelf-ground": "#9f9d63"
});

const REQUIRED_SURFACE_MARKERS = Object.freeze({
  everyCellAssignedSurface: true,
  materialCoverageComplete: true,
  downstreamCanvasMayReadSurface: true,
  canvasPaintAuthorized: false,
  controlsAuthorized: false
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function freezeDeep(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;

  Object.freeze(value);

  for (const key of Object.keys(value)) {
    freezeDeep(value[key]);
  }

  return value;
}

function hexToRgb(hex) {
  const normalized = String(hex || "#000000").replace("#", "").trim();
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized.padEnd(6, "0").slice(0, 6);

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToCss(rgb, alpha = 1) {
  return `rgba(${Math.round(clamp(rgb.r, 0, 255))}, ${Math.round(clamp(rgb.g, 0, 255))}, ${Math.round(clamp(rgb.b, 0, 255))}, ${clamp(alpha, 0, 1)})`;
}

function mixRgb(a, b, amount) {
  const t = clamp(amount, 0, 1);

  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t
  };
}

function adjustRgb(rgb, amount) {
  const target = amount >= 0 ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
  return mixRgb(rgb, target, Math.abs(amount));
}

function deterministicNoise(seed, salt = 1) {
  const raw =
    Math.sin((seed + 1) * (12.9898 + salt)) * 43758.5453 +
    Math.cos((seed + 7) * (78.233 + salt)) * 11237.19;

  return raw - Math.floor(raw);
}

function degreesToRadians(value) {
  return (value * Math.PI) / 180;
}

function normalizeCanvasSize(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_SIZE;
  return Math.round(clamp(numeric, MIN_SIZE, MAX_SIZE));
}

function getDocument(context) {
  return context.document || globalThis.document || null;
}

function getWindow(context) {
  return context.window || globalThis.window || null;
}

function resolveMount(target, context) {
  const doc = getDocument(context);

  if (!target) return null;
  if (typeof target !== "string") return target;
  if (!doc) return null;

  return doc.querySelector(target);
}

function getDevicePixelRatio(context) {
  const win = getWindow(context);
  const dpr = Number(win?.devicePixelRatio || 1);
  return clamp(dpr, 1, 3);
}

function validateSurface(surface) {
  const summary = surface?.summary || {};
  const receipt = surface?.receipts?.surface || {};

  const failures = [];

  if (!surface || !Array.isArray(surface.cells)) {
    failures.push("surface-cells-missing");
  }

  if (surface?.contract !== REQUIRED_SURFACE_CONTRACT) {
    failures.push(`surface-contract-mismatch:${surface?.contract || "missing"}`);
  }

  if (surface?.materialCompletionContract !== REQUIRED_SURFACE_COMPLETION_CONTRACT) {
    failures.push(`surface-completion-contract-mismatch:${surface?.materialCompletionContract || "missing"}`);
  }

  if (receipt.contract !== REQUIRED_SURFACE_CONTRACT) {
    failures.push(`surface-receipt-mismatch:${receipt.contract || "missing"}`);
  }

  if (summary.everyCellAssignedSurface !== REQUIRED_SURFACE_MARKERS.everyCellAssignedSurface) {
    failures.push("every-cell-assigned-surface-not-true");
  }

  if (summary.materialCoverageComplete !== REQUIRED_SURFACE_MARKERS.materialCoverageComplete) {
    failures.push("material-coverage-not-complete");
  }

  if (summary.downstreamCanvasMayReadSurface !== REQUIRED_SURFACE_MARKERS.downstreamCanvasMayReadSurface) {
    failures.push("canvas-read-not-authorized-by-surface");
  }

  if (summary.canvasPaintAuthorized !== REQUIRED_SURFACE_MARKERS.canvasPaintAuthorized) {
    failures.push("surface-parent-incorrectly-authorizes-canvas-paint");
  }

  if (summary.controlsAuthorized !== REQUIRED_SURFACE_MARKERS.controlsAuthorized) {
    failures.push("surface-parent-incorrectly-authorizes-controls");
  }

  return freezeDeep({
    passed: failures.length === 0,
    failures,
    parentContract: surface?.contract || "missing",
    materialCompletionContract: surface?.materialCompletionContract || "missing",
    totalCells: summary.totalCells || 0,
    materialClassCount: summary.materialClassCount || 0,
    requiredMaterialClassCount: summary.requiredMaterialClassCount || 0
  });
}

function baseMaterialColor(surfaceCell) {
  const hex = MATERIAL_PALETTE[surfaceCell.materialClass] || "#4f6a55";
  let rgb = hexToRgb(hex);

  const intensity = Number.isFinite(surfaceCell.surfaceIntensity) ? surfaceCell.surfaceIntensity : 0.5;
  const roughness = Number.isFinite(surfaceCell.surfaceRoughness) ? surfaceCell.surfaceRoughness : 0.5;
  const wetness = Number.isFinite(surfaceCell.surfaceWetness) ? surfaceCell.surfaceWetness : 0;
  const coldness = Number.isFinite(surfaceCell.surfaceColdness) ? surfaceCell.surfaceColdness : 0;

  if (surfaceCell.isOcean) {
    rgb = adjustRgb(rgb, -0.18 + intensity * 0.14);
    rgb = mixRgb(rgb, hexToRgb("#68d7e9"), wetness * 0.10);
    rgb = mixRgb(rgb, hexToRgb("#dff8ff"), coldness * 0.10);
  } else {
    rgb = adjustRgb(rgb, -0.12 + intensity * 0.20);
    rgb = mixRgb(rgb, hexToRgb("#2f5d3d"), wetness * 0.16);
    rgb = mixRgb(rgb, hexToRgb("#e6edf0"), coldness * 0.22);
    rgb = adjustRgb(rgb, roughness * 0.04);
  }

  if (surfaceCell.forcedMaterialCompletion) {
    rgb = mixRgb(rgb, hexToRgb("#07152b"), 0.35);
  }

  return rgb;
}

function projectCell(surfaceCell, rotationRadians = 0, tiltRadians = 0) {
  const lon = degreesToRadians(surfaceCell.lon || 0) + rotationRadians;
  const lat = degreesToRadians(surfaceCell.lat || 0);

  let x = Math.cos(lat) * Math.sin(lon);
  let y = Math.sin(lat);
  let z = Math.cos(lat) * Math.cos(lon);

  if (tiltRadians) {
    const cosTilt = Math.cos(tiltRadians);
    const sinTilt = Math.sin(tiltRadians);
    const nextY = y * cosTilt - z * sinTilt;
    const nextZ = y * sinTilt + z * cosTilt;
    y = nextY;
    z = nextZ;
  }

  return {
    x,
    y,
    z,
    visible: z > -0.08,
    limb: clamp((z + 0.08) / 1.08, 0, 1)
  };
}

function createCanvas(doc, size, dpr) {
  const canvas = doc.createElement("canvas");
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.style.maxWidth = "100%";
  canvas.style.maxHeight = "100%";
  canvas.style.display = "block";
  canvas.style.borderRadius = "50%";
  canvas.dataset.contract = CONTRACT;
  canvas.dataset.authority = "visible-composition-only";
  canvas.dataset.surface = "read-only-parent";
  canvas.dataset.controls = "held";
  canvas.dataset.visualPassClaimed = "false";
  canvas.dataset.graphicBox = "forbidden";
  canvas.dataset.imageGeneration = "forbidden";

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
    willReadFrequently: true
  });

  if (!ctx) {
    throw new Error("H-Earth canvas context unavailable.");
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { canvas, ctx };
}

function clearCanvas(ctx, size) {
  ctx.clearRect(0, 0, size, size);
}

function drawOuterField(ctx, size, radius) {
  const center = size / 2;

  ctx.save();

  const glow = ctx.createRadialGradient(center, center, radius * 0.58, center, center, radius * 1.22);
  glow.addColorStop(0, "rgba(142, 190, 255, 0.10)");
  glow.addColorStop(0.62, "rgba(143, 240, 195, 0.035)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(center, center, radius * 1.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function clipGlobe(ctx, size, radius) {
  const center = size / 2;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.clip();
}

function drawBaseSphere(ctx, size, radius) {
  const center = size / 2;

  const base = ctx.createRadialGradient(
    center - radius * 0.28,
    center - radius * 0.32,
    radius * 0.04,
    center,
    center,
    radius
  );

  base.addColorStop(0, "rgba(96, 165, 190, 0.92)");
  base.addColorStop(0.34, "rgba(23, 74, 101, 0.96)");
  base.addColorStop(0.74, "rgba(5, 25, 52, 1)");
  base.addColorStop(1, "rgba(2, 8, 22, 1)");

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
}

function drawSurfaceCells(ctx, size, radius, surfaceCells, options) {
  const center = size / 2;
  const rotation = Number.isFinite(options.rotationRadians) ? options.rotationRadians : degreesToRadians(-18);
  const tilt = Number.isFinite(options.tiltRadians) ? options.tiltRadians : degreesToRadians(-8);
  const cellBase = radius / 8.8;

  const ordered = surfaceCells
    .slice()
    .sort((a, b) => {
      const pa = projectCell(a, rotation, tilt);
      const pb = projectCell(b, rotation, tilt);
      return pa.z - pb.z;
    });

  for (const cell of ordered) {
    const projected = projectCell(cell, rotation, tilt);
    if (!projected.visible) continue;

    const screenX = center + projected.x * radius;
    const screenY = center - projected.y * radius;
    const limb = projected.limb;
    const baseRgb = baseMaterialColor(cell);
    const alpha = clamp(0.38 + limb * 0.64, 0.08, 0.98);
    const patchRadius = cellBase * (0.54 + limb * 0.76);

    const jitterCount = cell.isOcean ? 5 : 8;

    for (let i = 0; i < jitterCount; i += 1) {
      const n1 = deterministicNoise(cell.index, i + 11);
      const n2 = deterministicNoise(cell.index, i + 29);
      const n3 = deterministicNoise(cell.index, i + 47);
      const spread = patchRadius * (cell.isOcean ? 0.64 : 0.82);
      const dx = (n1 - 0.5) * spread;
      const dy = (n2 - 0.5) * spread;
      const localRadius = patchRadius * (0.42 + n3 * 0.55);
      const brightness = (n3 - 0.5) * (cell.isOcean ? 0.08 : 0.16);
      const rgb = adjustRgb(baseRgb, brightness);
      const ellipseX = screenX + dx;
      const ellipseY = screenY + dy;

      ctx.fillStyle = rgbToCss(rgb, alpha * (0.42 + n3 * 0.42));
      ctx.beginPath();
      ctx.ellipse(
        ellipseX,
        ellipseY,
        localRadius * (1.18 + n1 * 0.22),
        localRadius * (0.64 + n2 * 0.24),
        (n1 - 0.5) * Math.PI,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    if (!cell.isOcean && (cell.visualFamily === "land-relief" || cell.surfaceRoughness > 0.58)) {
      ctx.strokeStyle = rgbToCss(adjustRgb(baseRgb, 0.22), alpha * 0.28);
      ctx.lineWidth = clamp(patchRadius * 0.08, 0.8, 1.6);
      ctx.beginPath();
      ctx.moveTo(screenX - patchRadius * 0.55, screenY + patchRadius * 0.08);
      ctx.lineTo(screenX + patchRadius * 0.45, screenY - patchRadius * 0.18);
      ctx.stroke();
    }
  }
}

function drawLighting(ctx, size, radius) {
  const center = size / 2;

  ctx.save();
  clipGlobe(ctx, size, radius);

  const shade = ctx.createRadialGradient(
    center - radius * 0.35,
    center - radius * 0.35,
    radius * 0.05,
    center + radius * 0.16,
    center + radius * 0.10,
    radius * 1.05
  );

  shade.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  shade.addColorStop(0.32, "rgba(255, 255, 255, 0.035)");
  shade.addColorStop(0.70, "rgba(0, 0, 0, 0.10)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.54)");

  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);

  const rim = ctx.createRadialGradient(
    center,
    center,
    radius * 0.82,
    center,
    center,
    radius * 1.02
  );

  rim.addColorStop(0, "rgba(0, 0, 0, 0)");
  rim.addColorStop(0.72, "rgba(0, 0, 0, 0.10)");
  rim.addColorStop(1, "rgba(7, 16, 32, 0.74)");

  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(244, 191, 96, 0.18)";
  ctx.lineWidth = Math.max(1, radius * 0.006);
  ctx.beginPath();
  ctx.arc(center, center, radius - ctx.lineWidth, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142, 190, 255, 0.16)";
  ctx.lineWidth = Math.max(1, radius * 0.004);
  ctx.beginPath();
  ctx.arc(center, center, radius * 1.01, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawFrame(ctx, size, surfaceCells, options = {}) {
  const radius = size * 0.455;

  clearCanvas(ctx, size);
  drawOuterField(ctx, size, radius);

  ctx.save();
  clipGlobe(ctx, size, radius);
  drawBaseSphere(ctx, size, radius);
  drawSurfaceCells(ctx, size, radius, surfaceCells, options);
  ctx.restore();

  drawLighting(ctx, size, radius);
}

function computePixelProof(ctx, size) {
  let data;

  try {
    data = ctx.getImageData(0, 0, size, size).data;
  } catch (error) {
    return freezeDeep({
      available: false,
      reason: error instanceof Error ? error.message : String(error),
      nonBlankRatio: 0,
      waterLikeRatio: 0,
      landLikeRatio: 0,
      polarLikeRatio: 0
    });
  }

  let nonBlank = 0;
  let waterLike = 0;
  let landLike = 0;
  let polarLike = 0;

  const total = size * size;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a <= 8) continue;

    nonBlank += 1;

    if (b > r + 10 && b >= g - 20) waterLike += 1;
    if (g >= b - 10 && g >= r - 10 && r > 40 && b < 180) landLike += 1;
    if (r > 180 && g > 185 && b > 185) polarLike += 1;
  }

  return freezeDeep({
    available: true,
    totalPixels: total,
    nonBlankPixels: nonBlank,
    waterLikePixels: waterLike,
    landLikePixels: landLike,
    polarLikePixels: polarLike,
    nonBlankRatio: round(nonBlank / total, 4),
    waterLikeRatio: round(waterLike / total, 4),
    landLikeRatio: round(landLike / total, 4),
    polarLikeRatio: round(polarLike / total, 4)
  });
}

function createCanvasReceipt(surface, pixelProof, readiness) {
  const surfaceSummary = surface?.summary || {};

  return freezeDeep({
    contract: CONTRACT,
    seedPacket: SEED_PACKET,
    requiredParent: REQUIRED_PARENT,
    requiredSurfaceContract: REQUIRED_SURFACE_CONTRACT,
    requiredSurfaceCompletionContract: REQUIRED_SURFACE_COMPLETION_CONTRACT,
    parentSurfaceContract: surface?.contract || "missing",
    parentSurfaceCompletionContract: surface?.materialCompletionContract || "missing",
    visibleCompositionCreated: readiness.surfaceReady === true,
    canvasPaintAuthorizedByCanvas: readiness.surfaceReady === true,
    controlsAuthorized: false,
    controlsMayBindAfterRouteAuthorization: readiness.surfaceReady === true,
    animationClockOwned: false,
    routeBootOwned: false,
    materialTruthOwned: false,
    terrainTruthOwned: false,
    landWaterTruthOwned: false,
    surfaceCellsRead: surfaceSummary.totalCells || 0,
    surfaceMaterialClasses: `${surfaceSummary.materialClassCount || 0}/${surfaceSummary.requiredMaterialClassCount || 0}`,
    everyCellAssignedSurface: surfaceSummary.everyCellAssignedSurface === true,
    materialCoverageComplete: surfaceSummary.materialCoverageComplete === true,
    downstreamCanvasMayReadSurface: surfaceSummary.downstreamCanvasMayReadSurface === true,
    pixelProof,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false
  });
}

function buildReadiness(surfaceValidation) {
  return freezeDeep({
    surfaceReady: surfaceValidation.passed,
    failures: surfaceValidation.failures,
    requiredParent: REQUIRED_PARENT,
    requiredSurfaceContract: REQUIRED_SURFACE_CONTRACT,
    requiredSurfaceCompletionContract: REQUIRED_SURFACE_COMPLETION_CONTRACT,
    canvasMayCreateVisibleComposition: surfaceValidation.passed,
    controlsHeld: true,
    routeMustAuthorizeControlsSeparately: true,
    visualPassClaimed: false
  });
}

export function createHEarthCanvas(context = {}) {
  const surface = context.surface || null;
  const terrain = context.terrain || null;
  const landmap = context.landmap || null;
  const lattice256 = context.lattice256 || context.lattice || null;
  const kernel = context.kernel || null;

  const surfaceValidation = validateSurface(surface);
  const readiness = buildReadiness(surfaceValidation);

  const state = {
    canvas: null,
    ctx: null,
    size: 0,
    dpr: 1,
    pixelProof: null,
    lastReceipt: null,
    mounted: false
  };

  function renderInto(target, options = {}) {
    const doc = getDocument({ ...context, ...options });
    const mount = resolveMount(target, { ...context, ...options });

    if (!doc) {
      throw new Error("H-Earth canvas render requires a document.");
    }

    if (!mount) {
      throw new Error("H-Earth canvas render requires a mount element.");
    }

    if (!readiness.surfaceReady) {
      mount.dataset.hEarthCanvasStatus = "held";
      mount.dataset.hEarthCanvasReason = readiness.failures.join("|") || "surface-not-ready";
      mount.replaceChildren();
      state.lastReceipt = createCanvasReceipt(surface, null, readiness);
      return freezeDeep({
        rendered: false,
        reason: "surface-parent-not-ready",
        failures: readiness.failures,
        receipt: state.lastReceipt
      });
    }

    const requestedSize =
      options.size ||
      mount.clientWidth ||
      mount.getBoundingClientRect?.().width ||
      DEFAULT_SIZE;

    const size = normalizeCanvasSize(requestedSize);
    const dpr = getDevicePixelRatio({ ...context, ...options });

    const { canvas, ctx } = createCanvas(doc, size, dpr);

    drawFrame(ctx, size, surface.cells, {
      rotationRadians: Number.isFinite(options.rotationRadians)
        ? options.rotationRadians
        : degreesToRadians(-18),
      tiltRadians: Number.isFinite(options.tiltRadians)
        ? options.tiltRadians
        : degreesToRadians(-8)
    });

    const pixelProof = computePixelProof(ctx, Math.round(size));

    canvas.dataset.pixelProofAvailable = String(pixelProof.available);
    canvas.dataset.nonBlankRatio = String(pixelProof.nonBlankRatio);
    canvas.dataset.waterLikeRatio = String(pixelProof.waterLikeRatio);
    canvas.dataset.landLikeRatio = String(pixelProof.landLikeRatio);
    canvas.dataset.polarLikeRatio = String(pixelProof.polarLikeRatio);

    mount.dataset.hEarthCanvasStatus = "rendered";
    mount.dataset.hEarthCanvasContract = CONTRACT;
    mount.dataset.surfaceAuthority = "read-only-parent";
    mount.dataset.controlsAuthority = "held";
    mount.dataset.visualPassClaimed = "false";
    mount.replaceChildren(canvas);

    state.canvas = canvas;
    state.ctx = ctx;
    state.size = size;
    state.dpr = dpr;
    state.pixelProof = pixelProof;
    state.lastReceipt = createCanvasReceipt(surface, pixelProof, readiness);
    state.mounted = true;

    return freezeDeep({
      rendered: true,
      contract: CONTRACT,
      size,
      dpr,
      pixelProof,
      receipt: state.lastReceipt,
      canvasElement: canvas
    });
  }

  function paintFrame(options = {}) {
    if (!state.canvas || !state.ctx || !state.size) {
      return freezeDeep({
        painted: false,
        reason: "canvas-not-mounted"
      });
    }

    if (!readiness.surfaceReady) {
      return freezeDeep({
        painted: false,
        reason: "surface-parent-not-ready",
        failures: readiness.failures
      });
    }

    drawFrame(state.ctx, state.size, surface.cells, {
      rotationRadians: Number.isFinite(options.rotationRadians)
        ? options.rotationRadians
        : degreesToRadians(-18),
      tiltRadians: Number.isFinite(options.tiltRadians)
        ? options.tiltRadians
        : degreesToRadians(-8)
    });

    const pixelProof = computePixelProof(state.ctx, Math.round(state.size));
    state.pixelProof = pixelProof;
    state.lastReceipt = createCanvasReceipt(surface, pixelProof, readiness);

    return freezeDeep({
      painted: true,
      pixelProof,
      receipt: state.lastReceipt
    });
  }

  function getCanvasReceipt() {
    return state.lastReceipt || createCanvasReceipt(surface, state.pixelProof, readiness);
  }

  function getPixelProof() {
    return state.pixelProof;
  }

  const canvasAuthority = {
    contract: CONTRACT,
    requiredParent: REQUIRED_PARENT,
    requiredSurfaceContract: REQUIRED_SURFACE_CONTRACT,
    requiredSurfaceCompletionContract: REQUIRED_SURFACE_COMPLETION_CONTRACT,
    seedPacket: SEED_PACKET,
    version: VERSION,
    planet: "H-Earth",
    generation: "G1",
    parentReceipt: surface?.receipts?.surface || null,
    terrainReceipt: terrain?.receipts?.terrain || null,
    landmapReceipt: landmap?.receipts?.landmap || null,
    latticeReceipt: lattice256?.receipts?.lattice256 || null,
    kernelReceipt: kernel?.receipts?.kernel || null,
    owns: [
      "final-visible-composition",
      "canvas-creation",
      "frame-paint",
      "pixel-proof",
      "public-render-receipt",
      "readiness-lock-for-downstream-controls"
    ],
    doesNotOwn: [
      "land-water-truth",
      "terrain-truth",
      "surface-material-truth",
      "route-boot",
      "controls",
      "drag",
      "rotation-authority",
      "zoom-authority",
      "animation-clock",
      "weather",
      "atmosphere",
      "life-systems"
    ],
    surfaceValidation,
    readiness,
    materialPalette: MATERIAL_PALETTE,
    state,
    receipts: freezeDeep({
      canvas: createCanvasReceipt(surface, null, readiness)
    }),
    renderInto,
    paintFrame,
    getCanvasReceipt,
    getPixelProof
  };

  return canvasAuthority;
}

export {
  CONTRACT,
  REQUIRED_PARENT,
  REQUIRED_SURFACE_CONTRACT,
  REQUIRED_SURFACE_COMPLETION_CONTRACT,
  SEED_PACKET,
  VERSION,
  MATERIAL_PALETTE,
  REQUIRED_SURFACE_MARKERS
};

export default createHEarthCanvas;
