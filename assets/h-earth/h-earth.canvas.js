// /assets/h-earth/h-earth.canvas.js
// H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1
// Full-file replacement.
// Canvas visible-composition authority only.

const CONTRACT = "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1";
const REQUIRED_PARENT = "surface";
const REQUIRED_SURFACE_CONTRACT = "H_EARTH_G1_SURFACE_PARENT_MATERIAL_TRUTH_TNT_v1";
const REQUIRED_SURFACE_COMPLETION_CONTRACT = "H_EARTH_G1_SURFACE_MATERIAL_COMPLETION_TNT_v2";
const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
const VERSION = "2026-05-11.h-earth.g1.canvas-visible-composition-stable-v1";

const PALETTE = Object.freeze({
  "deep-ocean": [6, 22, 48],
  "abyssal-ocean": [8, 35, 74],
  "shelf-water": [31, 111, 143],
  "slope-water": [13, 64, 102],
  "trench-water": [3, 11, 31],
  "seaway-water": [15, 85, 120],
  "basin-mouth-water": [27, 97, 123],
  "submarine-ridge": [33, 77, 92],
  "seamount-field": [43, 89, 100],
  "fracture-water": [16, 44, 74],

  "coastal-stone": [183, 160, 106],
  "beach-sediment": [212, 184, 120],
  "cliff-stone": [111, 104, 77],
  "escarpment-stone": [123, 117, 85],
  "plateau-stone": [139, 133, 93],
  "highland-stone": [111, 138, 93],
  "mountain-stone": [98, 109, 102],
  "summit-stone": [214, 217, 207],
  "polar-crust": [199, 216, 220],
  "glacial-crust": [232, 242, 245],
  "lowland-ground": [73, 111, 66],
  "basin-ground": [95, 107, 59],
  "valley-ground": [63, 111, 75],
  "canyon-stone": [138, 96, 72],
  "fault-stone": [114, 80, 74],
  "island-ground": [77, 124, 77],
  "archipelago-ground": [78, 141, 98],
  "land-anchor-ground": [95, 127, 79],
  "coastal-shelf-ground": [159, 157, 99]
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
  for (const key of Object.keys(value)) freezeDeep(value[key]);
  return value;
}

function radians(degrees) {
  return (degrees * Math.PI) / 180;
}

function rgbCss(rgb, alpha = 1) {
  return `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${clamp(alpha, 0, 1)})`;
}

function mix(a, b, amount) {
  const t = clamp(amount, 0, 1);
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ];
}

function lighten(rgb, amount) {
  return amount >= 0 ? mix(rgb, [255, 255, 255], amount) : mix(rgb, [0, 0, 0], Math.abs(amount));
}

function noise(seed, salt = 1) {
  const raw =
    Math.sin((seed + 1) * (12.9898 + salt)) * 43758.5453 +
    Math.cos((seed + 5) * (78.233 + salt)) * 17431.19;

  return raw - Math.floor(raw);
}

function validateSurface(surface) {
  const summary = surface && surface.summary ? surface.summary : {};
  const receipt = surface && surface.receipts ? surface.receipts.surface : null;
  const failures = [];

  if (!surface || !Array.isArray(surface.cells)) failures.push("surface-cells-missing");
  if (surface && surface.contract !== REQUIRED_SURFACE_CONTRACT) failures.push("surface-contract-mismatch");
  if (surface && surface.materialCompletionContract !== REQUIRED_SURFACE_COMPLETION_CONTRACT) failures.push("surface-completion-contract-mismatch");
  if (!receipt || receipt.contract !== REQUIRED_SURFACE_CONTRACT) failures.push("surface-receipt-missing-or-mismatch");
  if (summary.everyCellAssignedSurface !== true) failures.push("every-cell-assigned-surface-not-true");
  if (summary.materialCoverageComplete !== true) failures.push("material-coverage-not-complete");
  if (summary.downstreamCanvasMayReadSurface !== true) failures.push("surface-does-not-authorize-canvas-read");
  if (summary.canvasPaintAuthorized !== false) failures.push("surface-incorrectly-authorizes-canvas-paint");
  if (summary.controlsAuthorized !== false) failures.push("surface-incorrectly-authorizes-controls");

  return freezeDeep({
    passed: failures.length === 0,
    failures,
    parentContract: surface ? surface.contract : "missing",
    parentCompletionContract: surface ? surface.materialCompletionContract : "missing"
  });
}

function project(cell, rotation, tilt) {
  const lon = radians(Number(cell.lon || 0)) + rotation;
  const lat = radians(Number(cell.lat || 0));

  let x = Math.cos(lat) * Math.sin(lon);
  let y = Math.sin(lat);
  let z = Math.cos(lat) * Math.cos(lon);

  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const y2 = y * ct - z * st;
  const z2 = y * st + z * ct;

  y = y2;
  z = z2;

  return {
    x,
    y,
    z,
    visible: z > -0.08,
    light: clamp((z + 0.08) / 1.08, 0, 1)
  };
}

function materialColor(cell) {
  let base = PALETTE[cell.materialClass] || (cell.isOcean ? PALETTE["abyssal-ocean"] : PALETTE["lowland-ground"]);

  const intensity = Number.isFinite(cell.surfaceIntensity) ? cell.surfaceIntensity : 0.5;
  const roughness = Number.isFinite(cell.surfaceRoughness) ? cell.surfaceRoughness : 0.4;
  const coldness = Number.isFinite(cell.surfaceColdness) ? cell.surfaceColdness : 0;
  const wetness = Number.isFinite(cell.surfaceWetness) ? cell.surfaceWetness : 0;

  if (cell.isOcean) {
    base = lighten(base, -0.16 + intensity * 0.12);
    base = mix(base, [95, 210, 230], wetness * 0.08);
  } else {
    base = lighten(base, -0.10 + intensity * 0.18 + roughness * 0.04);
    base = mix(base, [42, 86, 55], wetness * 0.12);
    base = mix(base, [230, 239, 242], coldness * 0.22);
  }

  if (cell.forcedMaterialCompletion) {
    base = mix(base, [6, 18, 43], 0.32);
  }

  return base;
}

function createCanvas(documentRef, size, dpr) {
  const canvas = documentRef.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

  if (!ctx) throw new Error("H-Earth canvas context unavailable.");

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
  canvas.dataset.generatedImage = "false";
  canvas.dataset.graphicBox = "false";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { canvas, ctx };
}

function drawBackground(ctx, size, radius) {
  const c = size / 2;

  const glow = ctx.createRadialGradient(c, c, radius * 0.55, c, c, radius * 1.25);
  glow.addColorStop(0, "rgba(142,190,255,0.12)");
  glow.addColorStop(0.72, "rgba(143,240,195,0.035)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(c, c, radius * 1.28, 0, Math.PI * 2);
  ctx.fill();
}

function clipSphere(ctx, size, radius) {
  const c = size / 2;
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, Math.PI * 2);
  ctx.clip();
}

function drawBase(ctx, size, radius) {
  const c = size / 2;

  const base = ctx.createRadialGradient(c - radius * 0.25, c - radius * 0.30, radius * 0.04, c, c, radius);
  base.addColorStop(0, "rgba(96,165,190,0.95)");
  base.addColorStop(0.36, "rgba(24,78,104,1)");
  base.addColorStop(0.76, "rgba(5,24,52,1)");
  base.addColorStop(1, "rgba(2,8,22,1)");

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
}

function drawCells(ctx, size, radius, cells, options) {
  const c = size / 2;
  const rotation = Number.isFinite(options.rotationRadians) ? options.rotationRadians : radians(-18);
  const tilt = Number.isFinite(options.tiltRadians) ? options.tiltRadians : radians(-8);
  const basePatch = radius / 8.2;

  const ordered = cells.slice().sort((a, b) => {
    return project(a, rotation, tilt).z - project(b, rotation, tilt).z;
  });

  for (const cell of ordered) {
    const p = project(cell, rotation, tilt);
    if (!p.visible) continue;

    const sx = c + p.x * radius;
    const sy = c - p.y * radius;
    const light = p.light;
    const patch = basePatch * (0.55 + light * 0.75);
    const baseColor = materialColor(cell);
    const loops = cell.isOcean ? 5 : 8;

    for (let i = 0; i < loops; i += 1) {
      const n1 = noise(cell.index || 0, i + 17);
      const n2 = noise(cell.index || 0, i + 41);
      const n3 = noise(cell.index || 0, i + 73);

      const spread = patch * (cell.isOcean ? 0.68 : 0.9);
      const dx = (n1 - 0.5) * spread;
      const dy = (n2 - 0.5) * spread;
      const r = patch * (0.36 + n3 * 0.52);
      const color = lighten(baseColor, (n3 - 0.5) * (cell.isOcean ? 0.10 : 0.18));

      ctx.fillStyle = rgbCss(color, clamp(0.32 + light * 0.58, 0.1, 0.94));
      ctx.beginPath();
      ctx.ellipse(
        sx + dx,
        sy + dy,
        r * (1.15 + n1 * 0.28),
        r * (0.62 + n2 * 0.28),
        (n1 - 0.5) * Math.PI,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    if (!cell.isOcean && (cell.visualFamily === "land-relief" || cell.surfaceRoughness > 0.55)) {
      ctx.strokeStyle = rgbCss(lighten(baseColor, 0.25), 0.22 + light * 0.12);
      ctx.lineWidth = clamp(patch * 0.08, 0.7, 1.8);
      ctx.beginPath();
      ctx.moveTo(sx - patch * 0.55, sy + patch * 0.06);
      ctx.lineTo(sx + patch * 0.45, sy - patch * 0.18);
      ctx.stroke();
    }
  }
}

function drawLighting(ctx, size, radius) {
  const c = size / 2;

  ctx.save();
  clipSphere(ctx, size, radius);

  const shade = ctx.createRadialGradient(c - radius * 0.35, c - radius * 0.34, radius * 0.05, c + radius * 0.14, c + radius * 0.11, radius * 1.06);
  shade.addColorStop(0, "rgba(255,255,255,0.18)");
  shade.addColorStop(0.33, "rgba(255,255,255,0.035)");
  shade.addColorStop(0.70, "rgba(0,0,0,0.12)");
  shade.addColorStop(1, "rgba(0,0,0,0.58)");

  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);

  const rim = ctx.createRadialGradient(c, c, radius * 0.82, c, c, radius * 1.02);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(0.78, "rgba(0,0,0,0.12)");
  rim.addColorStop(1, "rgba(2,8,22,0.78)");

  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  ctx.strokeStyle = "rgba(244,191,96,0.18)";
  ctx.lineWidth = Math.max(1, radius * 0.006);
  ctx.beginPath();
  ctx.arc(c, c, radius - ctx.lineWidth, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142,190,255,0.18)";
  ctx.lineWidth = Math.max(1, radius * 0.004);
  ctx.beginPath();
  ctx.arc(c, c, radius * 1.01, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFrame(ctx, size, cells, options) {
  const radius = size * 0.455;

  ctx.clearRect(0, 0, size, size);
  drawBackground(ctx, size, radius);

  ctx.save();
  clipSphere(ctx, size, radius);
  drawBase(ctx, size, radius);
  drawCells(ctx, size, radius, cells, options || {});
  ctx.restore();

  drawLighting(ctx, size, radius);
}

function pixelProof(ctx, size) {
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
    if (b > r + 8 && b >= g - 24) waterLike += 1;
    if (g >= b - 20 && r > 38 && b < 190) landLike += 1;
    if (r > 178 && g > 182 && b > 182) polarLike += 1;
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

function makeReceipt(surface, proof, readiness, rendered) {
  const summary = surface && surface.summary ? surface.summary : {};

  return freezeDeep({
    contract: CONTRACT,
    seedPacket: SEED_PACKET,
    requiredParent: REQUIRED_PARENT,
    requiredSurfaceContract: REQUIRED_SURFACE_CONTRACT,
    requiredSurfaceCompletionContract: REQUIRED_SURFACE_COMPLETION_CONTRACT,
    parentSurfaceContract: surface ? surface.contract : "missing",
    parentSurfaceCompletionContract: surface ? surface.materialCompletionContract : "missing",
    visibleCompositionCreated: Boolean(rendered),
    canvasPaintAuthorizedByCanvas: Boolean(rendered),
    controlsAuthorized: false,
    controlsMayBindAfterRouteAuthorization: Boolean(rendered),
    animationClockOwned: false,
    routeBootOwned: false,
    materialTruthOwned: false,
    terrainTruthOwned: false,
    landWaterTruthOwned: false,
    surfaceCellsRead: summary.totalCells || 0,
    surfaceMaterialClasses: `${summary.materialClassCount || 0}/${summary.requiredMaterialClassCount || 0}`,
    everyCellAssignedSurface: summary.everyCellAssignedSurface === true,
    materialCoverageComplete: summary.materialCoverageComplete === true,
    downstreamCanvasMayReadSurface: summary.downstreamCanvasMayReadSurface === true,
    pixelProof: proof || null,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false
  });
}

function normalizeSize(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 620;
  return Math.round(clamp(numeric, 280, 1200));
}

export function createHEarthCanvas(context = {}) {
  const surface = context.surface || null;
  const terrain = context.terrain || null;
  const landmap = context.landmap || null;
  const lattice256 = context.lattice256 || context.lattice || null;
  const kernel = context.kernel || null;

  const surfaceValidation = validateSurface(surface);
  const readiness = freezeDeep({
    surfaceReady: surfaceValidation.passed,
    failures: surfaceValidation.failures,
    canvasMayCreateVisibleComposition: surfaceValidation.passed,
    controlsHeld: true,
    visualPassClaimed: false
  });

  const state = {
    canvas: null,
    ctx: null,
    size: 0,
    dpr: 1,
    pixelProof: null,
    lastReceipt: makeReceipt(surface, null, readiness, false),
    mounted: false
  };

  function renderInto(target, options = {}) {
    const documentRef = options.document || context.document || globalThis.document;
    const windowRef = options.window || context.window || globalThis.window;
    const mount = typeof target === "string" ? documentRef.querySelector(target) : target;

    if (!documentRef) throw new Error("document unavailable");
    if (!mount) throw new Error("mount unavailable");

    if (!readiness.surfaceReady) {
      mount.dataset.hEarthCanvasStatus = "held";
      mount.dataset.hEarthCanvasReason = readiness.failures.join("|") || "surface-not-ready";
      mount.replaceChildren();
      state.lastReceipt = makeReceipt(surface, null, readiness, false);

      return freezeDeep({
        rendered: false,
        reason: "surface-parent-not-ready",
        failures: readiness.failures,
        receipt: state.lastReceipt
      });
    }

    const size = normalizeSize(options.size || mount.clientWidth || 620);
    const dpr = clamp(Number(windowRef && windowRef.devicePixelRatio ? windowRef.devicePixelRatio : 1), 1, 3);
    const made = createCanvas(documentRef, size, dpr);

    drawFrame(made.ctx, size, surface.cells, options || {});

    const proof = pixelProof(made.ctx, size);

    made.canvas.dataset.pixelProofAvailable = String(proof.available);
    made.canvas.dataset.nonBlankRatio = String(proof.nonBlankRatio);
    made.canvas.dataset.waterLikeRatio = String(proof.waterLikeRatio);
    made.canvas.dataset.landLikeRatio = String(proof.landLikeRatio);
    made.canvas.dataset.polarLikeRatio = String(proof.polarLikeRatio);

    mount.dataset.hEarthCanvasStatus = "rendered";
    mount.dataset.hEarthCanvasContract = CONTRACT;
    mount.dataset.surfaceAuthority = "read-only-parent";
    mount.dataset.controlsAuthority = "held";
    mount.dataset.visualPassClaimed = "false";
    mount.replaceChildren(made.canvas);

    state.canvas = made.canvas;
    state.ctx = made.ctx;
    state.size = size;
    state.dpr = dpr;
    state.pixelProof = proof;
    state.lastReceipt = makeReceipt(surface, proof, readiness, true);
    state.mounted = true;

    return freezeDeep({
      rendered: true,
      contract: CONTRACT,
      size,
      dpr,
      pixelProof: proof,
      receipt: state.lastReceipt
    });
  }

  function paintFrame(options = {}) {
    if (!state.canvas || !state.ctx || !state.size) {
      return freezeDeep({ painted: false, reason: "canvas-not-mounted" });
    }

    drawFrame(state.ctx, state.size, surface.cells, options || {});
    const proof = pixelProof(state.ctx, state.size);
    state.pixelProof = proof;
    state.lastReceipt = makeReceipt(surface, proof, readiness, true);

    return freezeDeep({
      painted: true,
      pixelProof: proof,
      receipt: state.lastReceipt
    });
  }

  function getCanvasReceipt() {
    return state.lastReceipt;
  }

  function getPixelProof() {
    return state.pixelProof;
  }

  return {
    contract: CONTRACT,
    requiredParent: REQUIRED_PARENT,
    requiredSurfaceContract: REQUIRED_SURFACE_CONTRACT,
    requiredSurfaceCompletionContract: REQUIRED_SURFACE_COMPLETION_CONTRACT,
    seedPacket: SEED_PACKET,
    version: VERSION,
    planet: "H-Earth",
    generation: "G1",
    parentReceipt: surface && surface.receipts ? surface.receipts.surface : null,
    terrainReceipt: terrain && terrain.receipts ? terrain.receipts.terrain : null,
    landmapReceipt: landmap && landmap.receipts ? landmap.receipts.landmap : null,
    latticeReceipt: lattice256 && lattice256.receipts ? lattice256.receipts.lattice256 : null,
    kernelReceipt: kernel && kernel.receipts ? kernel.receipts.kernel : null,
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
    state,
    receipts: freezeDeep({
      canvas: state.lastReceipt
    }),
    renderInto,
    paintFrame,
    getCanvasReceipt,
    getPixelProof
  };
}

export {
  CONTRACT,
  REQUIRED_PARENT,
  REQUIRED_SURFACE_CONTRACT,
  REQUIRED_SURFACE_COMPLETION_CONTRACT,
  SEED_PACKET,
  VERSION,
  PALETTE
};

export default createHEarthCanvas;
