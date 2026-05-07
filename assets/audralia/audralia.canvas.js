// /assets/audralia/audralia.canvas.js
// AUDRALIA_CANVAS_PARENT_CONTRACT_CHILD_ACTIVATION_TNT_v13
// Full-file replacement. Canvas authority only.
// Purpose:
// - Canvas owns final visible composition.
// - Parent surface owns static surface truth.
// - Runtime owns motion only.
// - Hex child activates only after parent surface contract is visible.
// - Canvas must not ask runtime for land/water/terrain/ocean truth.
// - Parent activates children; children refine only.
// - No GraphicBox. No image generation. No visual-pass claim.

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_PARENT_CONTRACT_CHILD_ACTIVATION_TNT_v13";
const PREVIOUS_CONTRACT = "AUDRALIA_CANVAS_SURFACE_TRUTH_DECOUPLED_ORTHOGRAPHIC_TNT_v12";
const VERSION = "2026-05-07.parent-contract-child-activation-v13";

const SURFACE_PATH = "/assets/audralia/audralia.surface.js";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const HEX_CHILD_PATH = "/assets/audralia/audralia.hex.surface.js";

let activeController = null;

const STATUS = {
  loaded: false,
  receipt: RECEIPT,
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  version: VERSION,
  canonicalExport: "mountAudraliaCanvas",

  runtimeReceipt: "",
  runtimeSovereignty: "motion-only",
  runtimeVisualSovereignty: false,

  surfaceReceipt: "",
  surfaceContract: "",
  surfaceTruthBridge: false,
  surfaceParentStandard: false,
  surfaceRatioLocked: false,

  hexChildReceipt: "",
  hexChildActiveRenewal: "",
  hexChildLoaded: false,
  hexChildActivatedByParentContract: false,
  childActivationSource: "pending-parent-contract",

  canvasOwnsFinalVisibleComposition: true,
  canvasUsesRuntimeForMotionOnly: true,
  canvasUsesSurfaceForSurfaceTruth: true,
  canvasUsesRuntimeForSurfaceTruth: false,
  canvasUsesHexChildForRefinementOnly: true,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  frameCount: 0,
  pixelProof: null,
  errors: []
};

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function normalizeLongitudeRadians(lon) {
  let value = Number(lon) || 0;
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
}

function resolveMount(target) {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) return target;
  if (target && typeof HTMLElement !== "undefined" && target.mount instanceof HTMLElement) return target.mount;
  if (target && typeof HTMLElement !== "undefined" && target.target instanceof HTMLElement) return target.target;
  if (target && typeof HTMLElement !== "undefined" && target.container instanceof HTMLElement) return target.container;

  if (typeof target === "string") {
    const selected = document.querySelector(target);
    if (selected) return selected;
  }

  return (
    document.querySelector("#audralia-canvas-mount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("#audralia-mount") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("#audralia-main") ||
    document.body
  );
}

function setRouteStatus(message) {
  const node =
    document.querySelector("#audralia-route-status") ||
    document.querySelector("[data-audralia-route-status]") ||
    document.querySelector("#audralia-status") ||
    document.querySelector("[data-route-status]");

  if (!node) return;

  node.textContent = message;
  node.setAttribute("data-audralia-canvas-loaded", "true");
  node.setAttribute("data-audralia-canvas-receipt", RECEIPT);
  node.setAttribute("data-audralia-canvas-contract", CONTRACT);
}

function removeResidue() {
  const badText = new Set([
    "Loading Audralia",
    "Audralia canvas authority import failed.",
    "Audralia canvas authority import failed. missing ) after argument list",
    "Canvas authority imported · no render export found",
    "Audralia canvas authority imported, but no render export was found.",
    "Audralia doorway is loading the current adopted canvas authority.",
    "AUDRALIA SURFACE BRIDGE LOADING"
  ]);

  const nodes = document.querySelectorAll("p, div, span, li, h2, h3");

  for (const node of nodes) {
    const text = (node.textContent || "").trim();
    if (node.children.length === 0 && badText.has(text)) node.remove();
  }
}

function clearOwnedNodes(mount) {
  const nodes = mount.querySelectorAll("[data-audralia-canvas-authority='true']");
  for (const node of nodes) node.remove();
}

function createCanvas(mount) {
  clearOwnedNodes(mount);
  removeResidue();

  const shell = document.createElement("section");
  shell.setAttribute("data-audralia-canvas-authority", "true");
  shell.setAttribute("data-audralia-receipt", RECEIPT);
  shell.setAttribute("data-audralia-contract", CONTRACT);
  shell.style.width = "min(100%, 960px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.setAttribute("data-audralia-canvas-frame", "parent-contract-child-activation-v13");
  frame.style.width = "min(92vw, 820px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(10, 23, 45, 0.98), rgba(2, 7, 19, 1) 72%)";
  frame.style.boxShadow = "0 30px 96px rgba(0,0,0,0.52), inset 0 0 88px rgba(136,195,255,0.08)";
  frame.style.touchAction = "pan-y";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("aria-label", "Audralia parent-contract child-activated orthographic canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.setAttribute("data-audralia-canvas-proof", "true");
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245, 233, 199, 0.88)";
  proof.style.font = "700 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame) {
  const rect = frame.getBoundingClientRect();
  const fallback = Math.min(window.innerWidth || 760, 820);
  const size = Math.max(320, Math.floor(Math.min(rect.width || fallback, rect.height || fallback)));
  const ratio = clamp(window.devicePixelRatio || 1, 1, 2);

  canvas.width = Math.floor(size * ratio);
  canvas.height = Math.floor(size * ratio);
  canvas.setAttribute("data-pixel-ratio", String(ratio));

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

  if (!ctx) throw new Error("Audralia canvas context unavailable.");

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  return { ctx, size, ratio };
}

function createWorkingCanvas(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Audralia working canvas context unavailable.");

  return { canvas, ctx, size };
}

function colorForParentSample(sample) {
  const relief = clamp01(sample.terrainReliefIndex ?? sample.terrainRelief ?? sample.elevation ?? 0);
  const mineral = clamp01(sample.mineralIndex ?? 0);
  const texture = clamp01(sample.colorBreak ?? sample.reliefTexture ?? 0);
  const turquoise = clamp01(sample.turquoiseIndex ?? sample.turquoise ?? 0);
  const edge = clamp01(sample.coastlineIndex ?? sample.coastalFeather ?? 0);

  let r;
  let g;
  let b;

  if (sample.ice || sample.glacier || sample.visualSurfaceClass === "glacier_ice_snowpack_surface") {
    r = mix(196, 246, texture * 0.45);
    g = mix(214, 252, texture * 0.45);
    b = mix(225, 255, texture * 0.50);
  } else if (sample.liquidWater || sample.water || sample.ocean || sample.shelf) {
    const depth = clamp01(sample.depth ?? sample.oceanDepth ?? 0.4);

    if (sample.shelf) {
      r = mix(28, 73, turquoise);
      g = mix(142, 216, turquoise);
      b = mix(174, 228, turquoise);
    } else {
      r = mix(6, 20, depth);
      g = mix(82, 122, 1 - depth * 0.35);
      b = mix(150, 216, 1 - depth * 0.20);
    }

    r = mix(r, 32, edge * 0.28);
    g = mix(g, 170, edge * 0.22);
    b = mix(b, 200, edge * 0.20);
  } else {
    const diamond = clamp01(sample.diamondSignal ?? mineral);
    const slate = clamp01(sample.slateSignal ?? relief);
    const opal = clamp01(sample.opalSignal ?? edge);

    r = mix(72, 153, texture * 0.46 + relief * 0.22);
    g = mix(101, 148, texture * 0.34 + relief * 0.20);
    b = mix(72, 91, texture * 0.18 + opal * 0.10);

    r = mix(r, 179, diamond * 0.20);
    g = mix(g, 148, diamond * 0.16);
    b = mix(b, 78, diamond * 0.10);

    r = mix(r, 67, slate * 0.14);
    g = mix(g, 76, slate * 0.14);
    b = mix(b, 82, slate * 0.18);
  }

  return [
    Math.floor(clamp(r, 0, 255)),
    Math.floor(clamp(g, 0, 255)),
    Math.floor(clamp(b, 0, 255)),
    255
  ];
}

function buildParentSurfaceTexture(state) {
  if (!state.surface || typeof state.surface.sampleSurface !== "function") return null;

  const width = 512;
  const height = 256;
  const image = new ImageData(width, height);
  const data = image.data;

  for (let y = 0; y < height; y += 1) {
    const v = (y + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;

    for (let x = 0; x < width; x += 1) {
      const u = (x + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = state.surface.sampleSurface({ lat, lon, u, v });
      const color = colorForParentSample(sample);
      const offset = (y * width + x) * 4;

      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = color[3];
    }
  }

  return {
    width,
    height,
    data,
    receipt: state.surfaceReceipt,
    contract: state.surfaceContract
  };
}

function drawSparseStarField(ctx, size, time) {
  ctx.save();
  ctx.clearRect(0, 0, size, size);

  for (let index = 0; index < 120; index += 1) {
    const sx = Math.sin(index * 917.17) * 10000;
    const sy = Math.sin(index * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y = (sy - Math.floor(sy)) * size;
    const pulse = 0.16 + 0.52 * Math.abs(Math.sin(time * 0.001 + index));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 7 === 0 ? "rgba(245,221,166,0.82)" : "rgba(185,216,255,0.70)";
    ctx.beginPath();
    ctx.arc(x, y, index % 13 === 0 ? 1.24 : 0.68, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDirectFallbackPlanet(state, motion) {
  const size = state.size;
  const ctx = state.ctx;
  const radius = size * 0.405;
  const cx = size / 2;
  const cy = size / 2;
  const image = ctx.createImageData(size, size);
  const data = image.data;

  const rotationRad = Number.isFinite(Number(motion.rotationRad))
    ? Number(motion.rotationRad)
    : ((state.frameCount * 0.003) % (Math.PI * 2));

  const tiltRad = Number.isFinite(Number(motion.axialTiltRad))
    ? Number(motion.axialTiltRad)
    : -8.5 * Math.PI / 180;

  const cosTilt = Math.cos(-tiltRad);
  const sinTilt = Math.sin(-tiltRad);

  for (let py = 0; py < size; py += 1) {
    const ny = (py - cy) / radius;

    for (let px = 0; px < size; px += 1) {
      const nx = (px - cx) / radius;
      const rr = nx * nx + ny * ny;
      const offset = (py * size + px) * 4;

      if (rr > 1) continue;

      const zView = Math.sqrt(Math.max(0, 1 - rr));
      const xView = nx;
      const yView = -ny;

      const yWorld = yView * cosTilt - zView * sinTilt;
      const zTilted = yView * sinTilt + zView * cosTilt;

      const lon = normalizeLongitudeRadians(Math.atan2(xView, zTilted) - rotationRad);
      const lat = Math.asin(clamp(yWorld, -1, 1));
      const u = lon / (Math.PI * 2) + 0.5;
      const v = 0.5 - lat / Math.PI;
      const sample = state.surface.sampleSurface({ lat, lon, u, v });
      const color = colorForParentSample(sample);
      const edgeShade = clamp01(0.34 + Math.pow(zView, 0.56) * 0.66);

      data[offset] = Math.floor(color[0] * edgeShade);
      data[offset + 1] = Math.floor(color[1] * edgeShade);
      data[offset + 2] = Math.floor(color[2] * edgeShade);
      data[offset + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
}

function drawAtmosphere(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.405;
  const pulse = 0.36 + Math.sin(time * 0.0013) * 0.045;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(145,205,255,${pulse.toFixed(3)})`;
  ctx.lineWidth = size * 0.010;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.035, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(74,138,214,0.20)";
  ctx.lineWidth = size * 0.006;
  ctx.stroke();

  ctx.restore();
}

function drawDiagnostics(ctx, size) {
  ctx.save();

  ctx.fillStyle = "rgba(255,244,216,0.94)";
  ctx.font = `800 ${Math.max(12, size * 0.024)}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.846);

  ctx.fillStyle = "rgba(205,220,238,0.76)";
  ctx.font = `700 ${Math.max(9, size * 0.013)}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillText("PARENT SURFACE · CHILD REFINEMENT · RUNTIME MOTION", size / 2, size * 0.872);

  ctx.restore();
}

function samplePixelProof(ctx, size) {
  try {
    const data = ctx.getImageData(0, 0, size, size).data;
    let opaque = 0;
    let water = 0;
    let solid = 0;
    let turquoise = 0;
    let ice = 0;

    for (let index = 0; index < data.length; index += 16) {
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      if (a < 20) continue;

      opaque += 1;

      if (b > 105 && g > 70 && b > r * 1.18) water += 1;
      if (r > 68 && g > 56 && r >= b * 0.80 && !(b > r * 1.20)) solid += 1;
      if (g > 120 && b > 125 && Math.abs(g - b) < 105) turquoise += 1;
      if (r > 188 && g > 188 && b > 188) ice += 1;
    }

    const total = Math.max(1, data.length / 16);

    return {
      opaqueRatio: opaque / total,
      waterPixelRatio: water / total,
      solidSurfacePixelRatio: solid / total,
      turquoisePixelRatio: turquoise / total,
      icePixelRatio: ice / total,
      notBlank: opaque > 0
    };
  } catch (error) {
    return {
      notBlank: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function publishStatus(state) {
  STATUS.loaded = true;
  STATUS.runtimeReceipt = state.runtimeReceipt || "";
  STATUS.runtimeSovereignty = "motion-only";
  STATUS.runtimeVisualSovereignty = false;
  STATUS.surfaceReceipt = state.surfaceReceipt || "";
  STATUS.surfaceContract = state.surfaceContract || "";
  STATUS.surfaceTruthBridge = Boolean(state.surface);
  STATUS.surfaceParentStandard = Boolean(state.surfaceParentStandard);
  STATUS.surfaceRatioLocked = Boolean(state.surfaceRatioLocked);
  STATUS.hexChildReceipt = state.hexChildReceipt || "";
  STATUS.hexChildActiveRenewal = state.hexChildActiveRenewal || "";
  STATUS.hexChildLoaded = Boolean(state.hexChild);
  STATUS.hexChildActivatedByParentContract = Boolean(state.hexChildActivatedByParentContract);
  STATUS.childActivationSource = state.childActivationSource || STATUS.childActivationSource;
  STATUS.frameCount = state.frameCount;
  STATUS.pixelProof = state.pixelProof || null;
  STATUS.errors = state.errors.slice();

  if (typeof window !== "undefined") {
    window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = STATUS;
    window.DGBAudraliaCanvasStatus = STATUS;

    try {
      window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: STATUS }));
    } catch (_) {}
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasUsesRuntimeForMotionOnly = "true";
    document.documentElement.dataset.audraliaCanvasUsesSurfaceForSurfaceTruth = "true";
    document.documentElement.dataset.audraliaCanvasUsesRuntimeForSurfaceTruth = "false";
    document.documentElement.dataset.audraliaCanvasUsesHexChildForRefinementOnly = "true";
    document.documentElement.dataset.audraliaHexChildActivatedByParentContract = String(Boolean(state.hexChildActivatedByParentContract));
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return STATUS;
}

function getMotion(state, time) {
  if (state.runtime && typeof state.runtime.sampleMotionState === "function") {
    try {
      return state.runtime.sampleMotionState(time);
    } catch (_) {}
  }

  return {
    rotationDeg: ((time * 0.0048) % 360),
    rotationRad: ((time * 0.0048) % 360) * Math.PI / 180,
    axialTiltDeg: -8.5,
    axialTiltRad: -8.5 * Math.PI / 180,
    cloudPhase: ((time * 0.0062) % 360),
    oceanPhase: ((time * 0.0026) % 360),
    lightPhase: ((time * 0.00115) % 360),
    motionIntensity: 1
  };
}

function parentContractAllowsChild(state) {
  return Boolean(
    state.surface &&
    typeof state.surface.sampleSurface === "function" &&
    (
      state.surfaceParentStandard ||
      state.surface.AUDRALIA_SURFACE_PARENT_STANDARD === true ||
      state.surface.AUDRALIA_SURFACE_RATIO_LOCKED === true
    )
  );
}

async function loadAuthorities(state) {
  try {
    const surface = await import(`${SURFACE_PATH}?canvas=${encodeURIComponent(CONTRACT)}`);
    state.surface = surface;
    state.surfaceReceipt =
      surface.AUDRALIA_SURFACE_RECEIPT_VALUE ||
      surface.default?.receipt ||
      "AUDRALIA_SURFACE_PARENT_STANDARD_RATIO_LOCK_TNT_v4";

    state.surfaceContract =
      surface.AUDRALIA_SURFACE_CONTRACT_VALUE ||
      surface.default?.contract ||
      "";

    state.surfaceParentStandard = Boolean(
      surface.AUDRALIA_SURFACE_PARENT_STANDARD ||
      surface.default?.parentStandard ||
      surface.getParentStandard?.().ok
    );

    state.surfaceRatioLocked = Boolean(
      surface.AUDRALIA_SURFACE_RATIO_LOCKED ||
      surface.default?.ratioLocked ||
      surface.getParentStandard?.().downstreamClassificationOverrideAllowed === false
    );

    if (typeof surface.initializeSurfaceDownstream === "function") {
      surface.initializeSurfaceDownstream().catch(() => {});
    }
  } catch (error) {
    state.errors.push(`surface import failed: ${String(error?.message || error || "unknown")}`);
  }

  try {
    const runtime = await import(`${RUNTIME_PATH}?canvas=${encodeURIComponent(CONTRACT)}`);
    state.runtime = runtime;
    state.runtimeReceipt =
      runtime.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
      runtime.default?.receipt ||
      "AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10";

    if (typeof runtime.start === "function") runtime.start();
  } catch (error) {
    state.errors.push(`runtime import failed: ${String(error?.message || error || "unknown")}`);
  }

  if (!state.surface || typeof state.surface.sampleSurface !== "function") {
    throw new Error("Audralia parent surface contract missing sampleSurface export.");
  }

  state.texture = buildParentSurfaceTexture(state);

  if (parentContractAllowsChild(state)) {
    try {
      const hexChild = await import(`${HEX_CHILD_PATH}?canvas=${encodeURIComponent(CONTRACT)}&parent=${encodeURIComponent(state.surfaceReceipt)}`);
      state.hexChild = hexChild;
      state.hexChildReceipt =
        hexChild.AUDRALIA_HEX_SURFACE_CHILD_RECEIPT_VALUE ||
        hexChild.default?.receipt ||
        "";

      state.hexChildActiveRenewal =
        hexChild.AUDRALIA_HEX_SURFACE_CHILD_ACTIVE_RENEWAL_VALUE ||
        hexChild.default?.activeRenewal ||
        "";

      state.hexChildActivatedByParentContract =
        typeof hexChild.drawAudraliaHexSurfaceFrame === "function";

      state.childActivationSource = state.hexChildActivatedByParentContract
        ? "parent-surface-contract"
        : "hex-child-export-missing";
    } catch (error) {
      state.errors.push(`hex child import failed: ${String(error?.message || error || "unknown")}`);
      state.childActivationSource = "hex-child-import-failed";
    }
  } else {
    state.childActivationSource = "parent-contract-not-visible";
  }

  state.ready = true;
  publishStatus(state);
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;

  drawSparseStarField(ctx, size, time);

  if (!state.ready || !state.surface || !state.texture) {
    ctx.save();
    ctx.fillStyle = "rgba(255,244,216,0.82)";
    ctx.font = `800 ${Math.max(13, size * 0.024)}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText("AUDRALIA PARENT SURFACE CONTRACT LOADING", size / 2, size / 2);
    ctx.restore();
  } else {
    const motion = getMotion(state, time);

    if (
      state.hexChildActivatedByParentContract &&
      state.hexChild &&
      typeof state.hexChild.drawAudraliaHexSurfaceFrame === "function"
    ) {
      if (!state.childLayer || state.childLayer.size !== size) {
        state.childLayer = createWorkingCanvas(size);
      }

      state.childLayer.ctx.clearRect(0, 0, size, size);

      state.hexChild.drawAudraliaHexSurfaceFrame(
        {
          canvas: state.childLayer.canvas,
          ctx: state.childLayer.ctx,
          texture: state.texture,
          phase: wrap01((motion.rotationDeg || 0) / 360),
          parentReceipt: state.surfaceReceipt,
          parentContract: state.surfaceContract,
          parentStandard: state.surfaceParentStandard,
          parentRatioLocked: state.surfaceRatioLocked
        },
        {
          radiusRatio: 0.405,
          globalGlazeStrength: 0.82,
          terrainRecovery: 0.54,
          waterGlazeOpacity: 0.12,
          shelfGlazeOpacity: 0.18,
          landGlazeOpacity: 0.055,
          iceGlazeOpacity: 0.035,
          edgeDarkening: 0.032,
          seamSoftening: 0.046
        }
      );

      ctx.drawImage(state.childLayer.canvas, 0, 0, size, size);
    } else {
      drawDirectFallbackPlanet(state, motion);
    }

    drawAtmosphere(ctx, size, time);
    drawDiagnostics(ctx, size);
  }

  state.frameCount += 1;

  if (state.frameCount === 4 || state.frameCount % 90 === 0) {
    state.pixelProof = samplePixelProof(ctx, size);
    publishStatus(state);
  }
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") activeController.stop();
  activeController = null;
}

function startCanvas(target, options) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();

  const mount = resolveMount(target);
  const nodes = createCanvas(mount);
  const setup = setupCanvas(nodes.canvas, nodes.frame);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    proof: nodes.proof,
    ctx: setup.ctx,
    size: setup.size,
    ratio: setup.ratio,
    mount,
    options: options || {},
    frameCount: 0,
    pixelProof: null,
    ready: false,
    stopped: false,
    rafId: null,
    resizeTimer: null,

    runtime: null,
    runtimeReceipt: "",

    surface: null,
    surfaceReceipt: "",
    surfaceContract: "",
    surfaceParentStandard: false,
    surfaceRatioLocked: false,

    texture: null,
    hexChild: null,
    hexChildReceipt: "",
    hexChildActiveRenewal: "",
    hexChildActivatedByParentContract: false,
    childActivationSource: "pending-parent-contract",
    childLayer: null,

    errors: []
  };

  function animate(frameTime) {
    if (state.stopped) return;
    renderFrame(state, frameTime || performance.now());
    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      const next = setupCanvas(state.canvas, state.frame);
      state.ctx = next.ctx;
      state.size = next.size;
      state.ratio = next.ratio;
      state.childLayer = null;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 120);
  }

  state.stop = function stop() {
    state.stopped = true;
    if (state.rafId) window.cancelAnimationFrame(state.rafId);
    window.removeEventListener("resize", resize);
  };

  window.addEventListener("resize", resize, { passive: true });

  activeController = state;

  setRouteStatus(
    `Audralia adopted canvas authority loaded. Canvas ${CONTRACT} · Parent surface pending · Hex child pending parent contract · Runtime motion-only · GraphicBox false · Image generation false · Visual pass claimed false`
  );

  publishStatus(state);

  loadAuthorities(state)
    .then(() => {
      setRouteStatus(
        `Audralia adopted canvas authority loaded. Canvas ${CONTRACT} · Surface ${state.surfaceReceipt} · Parent standard ${String(state.surfaceParentStandard)} · Ratio locked ${String(state.surfaceRatioLocked)} · Hex child ${state.hexChildActiveRenewal || state.hexChildReceipt || "not activated"} · Child activated by parent contract ${String(state.hexChildActivatedByParentContract)} · Runtime ${state.runtimeReceipt} · Runtime sovereignty motion-only · Runtime visual sovereignty false · GraphicBox false · Image generation false · Visual pass claimed false`
      );
      publishStatus(state);
    })
    .catch((error) => {
      state.errors.push(String(error?.message || error || "authority load failure"));
      STATUS.errors = state.errors.slice();
      publishStatus(state);
    });

  animate(performance.now());

  return state;
}

export function mountAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function bootAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function createAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function initAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function mountAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function render(target, options) {
  return startCanvas(target, options || {});
}

export function mount(target, options) {
  return startCanvas(target, options || {});
}

export function init(target, options) {
  return startCanvas(target, options || {});
}

export function getAudraliaCanvasStatus() {
  return window.__AUDRALIA_CANVAS_STATUS__ || STATUS;
}

export function getAudraliaSurfaceDataset() {
  return {
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    surfaceReceipt: STATUS.surfaceReceipt,
    surfaceContract: STATUS.surfaceContract,
    surfaceParentStandard: STATUS.surfaceParentStandard,
    surfaceRatioLocked: STATUS.surfaceRatioLocked,
    hexChildReceipt: STATUS.hexChildReceipt,
    hexChildActiveRenewal: STATUS.hexChildActiveRenewal,
    hexChildActivatedByParentContract: STATUS.hexChildActivatedByParentContract,
    canvasUsesRuntimeForMotionOnly: true,
    canvasUsesSurfaceForSurfaceTruth: true,
    canvasUsesRuntimeForSurfaceTruth: false,
    canvasUsesHexChildForRefinementOnly: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

export function stopAudraliaCanvas() {
  stopActiveController();

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION
  };
}

const api = {
  RECEIPT,
  CONTRACT,
  VERSION,
  mountAudraliaCanvas,
  renderAudraliaCanvas,
  bootAudraliaCanvas,
  createAudraliaCanvas,
  initAudraliaCanvas,
  renderAudralia,
  mountAudralia,
  render,
  mount,
  init,
  getAudraliaCanvasStatus,
  getAudraliaSurfaceDataset,
  stopAudraliaCanvas
};

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
}

export default api;
