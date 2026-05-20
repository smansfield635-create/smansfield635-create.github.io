// /assets/audralia/audralia.runtime.js
// AUDRALIA_G2_5_ESM_AWAITED_PARENT_HANDOFF_RUNTIME_SHIM_TNT_v2
// Full-file replacement.
// Purpose: preserve the legacy ESM default-export runtime contract while awaiting/delegating visible authority to the clean-canvas parent engine.
// Target only: /assets/audralia/audralia.runtime.js
// Delegates to: /assets/audralia/clean/audralia.engine.js
// Does not own: route HTML, route bridge JS, continents child, motion child, sky child, parent Globe, Characters, Gauges, Showroom, generated image, GraphicBox, or visual-pass claim.

const CONTRACT = "AUDRALIA_G2_5_ESM_AWAITED_PARENT_HANDOFF_RUNTIME_SHIM_TNT_v2";
const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_ESM_LEGACY_RUNTIME_TO_CLEAN_PARENT_SHIM_TNT_v1";
const FAMILY = "AUDRALIA_G2_5_SIMPLE_ENGINE_CHILD_SPLIT_TNT_v1";

const TARGET = "/assets/audralia/audralia.runtime.js";
const ROUTE = "/showroom/globe/audralia/";
const CLEAN_PARENT_PATH = "/assets/audralia/clean/audralia.engine.js";

const PARENT_KEYS = [
  "AUDRALIA_ENGINE",
  "AUDRALIA_CLEAN_CANVAS_ENGINE",
  "AUDRALIA_CLEAN_CANVAS_AUTHORITY",
  "AUDRALIA_CLEAN_ENGINE_PARENT"
];

const WAIT_VISIBLE_MS = 1800;
const POLL_MS = 40;

const state = {
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  family: FAMILY,
  target: TARGET,
  route: ROUTE,
  cleanParentPath: CLEAN_PARENT_PATH,
  shimActive: true,
  esmDefaultExportPreserved: true,
  parentRequested: false,
  parentLoaded: false,
  parentDelegated: false,
  parentAwaited: false,
  mountCalled: false,
  mounted: false,
  ready: false,
  formVisible: false,
  standbyPainted: false,
  lastScope: "created",
  lastMountTarget: null,
  lastResult: null,
  parentStatus: null,
  errors: []
};

let parentLoadPromise = null;
let mountPromise = null;

function hasWindow() {
  return typeof window !== "undefined";
}

function hasDocument() {
  return typeof document !== "undefined";
}

function nowIso() {
  try {
    return new Date().toISOString();
  } catch (_error) {
    return "";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error);
  state.errors.push({ scope, message, time: nowIso() });
  publishReceipt();
}

function isElement(value) {
  return Boolean(value && value.nodeType === 1);
}

function resolveMountTarget(input) {
  if (!hasDocument()) return input || null;

  if (isElement(input)) return input;

  if (typeof input === "string") {
    return document.querySelector(input);
  }

  if (input && isElement(input.mount)) return input.mount;
  if (input && isElement(input.element)) return input.element;
  if (input && isElement(input.el)) return input.el;

  if (input && typeof input.mount === "string") return document.querySelector(input.mount);
  if (input && typeof input.selector === "string") return document.querySelector(input.selector);

  return (
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-clean-canvas-mount]") ||
    document.querySelector("#audraliaMount") ||
    null
  );
}

function readParent() {
  if (!hasWindow()) return null;

  for (const key of PARENT_KEYS) {
    const value = window[key];
    if (value && value !== api && typeof value === "object") return value;
  }

  return null;
}

function scriptAlreadyLoaded(src) {
  if (!hasDocument()) return false;

  return Array.from(document.scripts).some((script) => {
    const raw = script.getAttribute("src") || "";
    return raw === src || raw.startsWith(`${src}?`) || raw.endsWith(src);
  });
}

function loadClassicScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (!hasDocument()) {
      reject(new Error("Document unavailable; cannot load clean parent engine."));
      return;
    }

    if (readParent() || scriptAlreadyLoaded(src)) {
      resolve({ src, loaded: true, reused: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-runtime-shim-loader", CONTRACT);
    script.setAttribute("data-audralia-clean-parent-path", src);

    script.onload = () => resolve({ src, loaded: true, reused: false });
    script.onerror = () => reject(new Error(`Clean parent engine failed to load: ${src}`));

    document.head.appendChild(script);
  });
}

async function loadParent() {
  const existing = readParent();

  if (existing) {
    state.parentRequested = true;
    state.parentLoaded = true;
    publishReceipt();
    return existing;
  }

  if (parentLoadPromise) return parentLoadPromise;

  state.parentRequested = true;
  state.lastScope = "load-parent";
  publishReceipt();

  parentLoadPromise = loadClassicScriptOnce(CLEAN_PARENT_PATH)
    .then(async () => {
      let parent = readParent();

      if (!parent) {
        for (let i = 0; i < 20; i += 1) {
          await sleep(POLL_MS);
          parent = readParent();
          if (parent) break;
        }
      }

      if (!parent) {
        throw new Error("Clean parent engine loaded but did not publish a recognized parent global.");
      }

      state.parentLoaded = true;
      publishReceipt();

      return parent;
    })
    .catch((error) => {
      recordError("loadParent", error);
      throw error;
    });

  return parentLoadPromise;
}

function getParentStatus(parent = readParent()) {
  if (!parent) return null;

  try {
    if (typeof parent.getStatus === "function") return parent.getStatus();
    if (typeof parent.status === "function") return parent.status();
    if (parent.RECEIPT && typeof parent.RECEIPT === "object") return parent.RECEIPT;
  } catch (error) {
    recordError("getParentStatus", error);
  }

  return null;
}

function syncParentStatus(scope = "sync") {
  const parent = readParent();
  const status = getParentStatus(parent);

  state.parentStatus = status;
  state.parentLoaded = Boolean(parent);

  state.ready = Boolean(
    (status && (status.ready === true || status.mounted === true || status.children)) ||
      (parent && state.parentDelegated)
  );

  state.formVisible = Boolean(
    (status && status.formVisible === true) ||
      (hasWindow() &&
        (window.AUDRALIA_FORM_VISIBLE === true ||
          window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true))
  );

  state.lastScope = scope;

  if (state.formVisible && hasWindow()) {
    window.AUDRALIA_RUNTIME_SHIM_FORM_VISIBLE_CONFIRMED = true;
  }

  publishReceipt();

  return status;
}

function callParent(parent, methodNames, args) {
  if (!parent) return null;

  for (const name of methodNames) {
    const method = parent[name];

    if (typeof method !== "function") continue;

    state.parentDelegated = true;
    publishReceipt();

    return method.apply(parent, args);
  }

  return null;
}

async function awaitVisible(parent, timeoutMs = WAIT_VISIBLE_MS) {
  const start = Date.now();

  while (Date.now() - start <= timeoutMs) {
    const status = syncParentStatus("await-visible");

    if (
      state.formVisible === true ||
      (status && status.formVisible === true) ||
      (hasWindow() &&
        (window.AUDRALIA_FORM_VISIBLE === true ||
          window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true))
    ) {
      state.formVisible = true;
      state.ready = true;
      publishReceipt();
      return true;
    }

    if (parent && typeof parent.render === "function") {
      try {
        parent.render();
      } catch (_error) {
        // parent render errors are captured by parent status when available
      }
    }

    await sleep(POLL_MS);
  }

  syncParentStatus("await-visible-timeout");
  return state.formVisible === true;
}

function paintNonAuthoritativeStandby(target) {
  if (!hasDocument() || !isElement(target)) return;

  let canvas =
    target.querySelector("canvas[data-audralia-runtime-standby='true']") ||
    target.querySelector("canvas[data-audralia-clean-canvas='true']") ||
    target.querySelector("canvas");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("data-audralia-runtime-standby", "true");
    canvas.setAttribute("data-contract", CONTRACT);
    canvas.setAttribute("aria-label", "Audralia standby clean-canvas handoff form");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.minHeight = "320px";
    canvas.style.touchAction = "none";
    target.textContent = "";
    target.appendChild(canvas);
  }

  const rect = target.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width || target.clientWidth || 720));
  const cssHeight = Math.max(320, Math.floor(rect.height || target.clientHeight || 520));
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.36;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 2.1);
  bg.addColorStop(0, "rgba(11, 35, 58, 0.96)");
  bg.addColorStop(1, "rgba(2, 6, 18, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.34, r * 0.1, cx, cy, r);
  ocean.addColorStop(0, "rgba(98, 225, 255, 0.95)");
  ocean.addColorStop(0.26, "rgba(28, 139, 190, 0.96)");
  ocean.addColorStop(0.66, "rgba(10, 61, 118, 0.98)");
  ocean.addColorStop(1, "rgba(3, 16, 43, 1)");
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  ctx.fillStyle = "rgba(100, 180, 115, 0.72)";
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.22, cy - r * 0.1, r * 0.28, r * 0.52, -0.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(155, 126, 76, 0.58)";
  ctx.beginPath();
  ctx.ellipse(cx + r * 0.28, cy + r * 0.02, r * 0.22, r * 0.38, 0.42, 0, Math.PI * 2);
  ctx.fill();

  const shade = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.2, cx + r * 0.22, cy + r * 0.18, r * 1.16);
  shade.addColorStop(0, "rgba(255,255,255,0.18)");
  shade.addColorStop(0.55, "rgba(255,255,255,0.00)");
  shade.addColorStop(1, "rgba(0,0,0,0.50)");
  ctx.fillStyle = shade;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(185, 238, 255, 0.4)";
  ctx.lineWidth = Math.max(1, dpr * 1.2);
  ctx.stroke();

  state.standbyPainted = true;
  publishReceipt();
}

function publishReceipt() {
  if (!hasWindow()) return;

  const receipt = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    mode: "esm_awaited_parent_handoff_runtime_shim",
    cleanParentPath: CLEAN_PARENT_PATH,
    legacyRuntimeAuthorityDemoted: true,
    esmDefaultExportPreserved: true,
    shimActive: state.shimActive,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    parentAwaited: state.parentAwaited,
    mountCalled: state.mountCalled,
    mounted: state.mounted,
    ready: state.ready,
    formVisible: state.formVisible,
    standbyPainted: state.standbyPainted,
    formVisibleClaimPolicy: "parent_status_or_parent_global_only",
    htmlChange: false,
    routeBridgeChange: false,
    childContractRenewal: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false,
    parentStatus: state.parentStatus,
    errors: state.errors.slice(),
    preserves: [
      "default export function",
      "legacy runtime import path",
      "mount()",
      "render()",
      "start()",
      "boot()",
      "init()",
      "create()",
      "clean parent dynamic load",
      "awaited parent handoff",
      "FORM_VISIBLE gated by parent confirmation"
    ]
  };

  window.AUDRALIA_RUNTIME_SHIM_RECEIPT = receipt;
  window.AUDRALIA_RUNTIME_RECEIPT = receipt;
  window.AUDRALIA_CLEAN_CANVAS_RUNTIME_RECEIPT = receipt;

  window.AUDRALIA_LEGACY_RUNTIME_SHIM_ACTIVE = true;
  window.AUDRALIA_AWAITED_PARENT_HANDOFF_RUNTIME_SHIM_ACTIVE = true;

  if (hasDocument() && document.documentElement) {
    document.documentElement.setAttribute("data-audralia-runtime-contract", CONTRACT);
    document.documentElement.setAttribute("data-audralia-runtime-mode", "awaited-parent-handoff-shim");
    document.documentElement.setAttribute("data-audralia-clean-parent-path", CLEAN_PARENT_PATH);
    document.documentElement.setAttribute("data-audralia-runtime-shim-active", "true");
    document.documentElement.setAttribute("data-audralia-parent-loaded", state.parentLoaded ? "true" : "false");
    document.documentElement.setAttribute("data-audralia-parent-delegated", state.parentDelegated ? "true" : "false");
    document.documentElement.setAttribute("data-audralia-parent-awaited", state.parentAwaited ? "true" : "false");
    document.documentElement.setAttribute("data-audralia-runtime-form-visible", state.formVisible ? "true" : "false");
  }

  try {
    window.dispatchEvent(
      new CustomEvent("audralia:runtime-shim:receipt", {
        detail: receipt
      })
    );
  } catch (_error) {
    try {
      window.dispatchEvent(new Event("audralia:runtime-shim:receipt"));
    } catch (_ignored) {}
  }
}

async function awaitedParentMount(input, options = {}) {
  state.mountCalled = true;
  state.mounted = true;
  state.lastScope = "awaited-parent-mount";

  const target = resolveMountTarget(input);
  state.lastMountTarget = target ? "#audraliaCanvasMount-or-equivalent" : "unresolved";
  publishReceipt();

  if (target) {
    paintNonAuthoritativeStandby(target);
  }

  const parent = await loadParent();

  const mountTarget = target || resolveMountTarget(null);
  const parentResult = callParent(parent, ["mount", "boot", "start", "init", "create"], [
    mountTarget,
    {
      ...(options || {}),
      delegatedBy: CONTRACT,
      legacyRuntimeShim: true,
      awaitedParentHandoff: true
    }
  ]);

  if (parentResult && typeof parentResult.then === "function") {
    try {
      await parentResult;
    } catch (error) {
      recordError("parentMount", error);
    }
  }

  state.parentAwaited = true;

  const visible = await awaitVisible(parent, WAIT_VISIBLE_MS);

  if (!visible) {
    recordError("awaitVisible", "Parent handoff completed but FORM_VISIBLE was not confirmed within wait window.");
  }

  syncParentStatus("awaited-parent-mount-complete");

  state.lastResult = {
    contract: CONTRACT,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    parentAwaited: state.parentAwaited,
    formVisible: state.formVisible,
    parentStatus: state.parentStatus,
    errors: state.errors.slice()
  };

  publishReceipt();

  return state.lastResult;
}

function mount(input, options = {}) {
  mountPromise = awaitedParentMount(input, options).catch((error) => {
    recordError("mount", error);
    return getStatus();
  });

  return mountPromise;
}

function boot(input, options = {}) {
  return mount(input, options);
}

function start(input, options = {}) {
  return mount(input, options);
}

function init(input, options = {}) {
  return mount(input, options);
}

function create(input, options = {}) {
  return mount(input, options);
}

async function render(...args) {
  const parent = readParent() || (await loadParent());

  const result = callParent(parent, ["render", "draw", "paint"], args);

  if (result && typeof result.then === "function") {
    await result;
  }

  syncParentStatus("render");

  return getStatus();
}

function requestRender() {
  const parent = readParent();

  if (parent) {
    const result = callParent(parent, ["requestRender", "render"], []);
    syncParentStatus("requestRender");
    return result || api;
  }

  render().catch((error) => recordError("requestRender", error));
  return api;
}

function updateState(next = {}) {
  const parent = readParent();

  if (parent) {
    const result = callParent(parent, ["updateState"], [next]);
    syncParentStatus("updateState");
    return result || api;
  }

  Object.assign(state, next || {});
  publishReceipt();

  return api;
}

function destroy() {
  const parent = readParent();

  if (parent) {
    const result = callParent(parent, ["destroy", "dispose", "unmount"], []);
    syncParentStatus("destroy");
    return result || api;
  }

  state.mounted = false;
  state.ready = false;
  state.formVisible = false;
  publishReceipt();

  return api;
}

function getStatus() {
  syncParentStatus("status-read");

  return {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    mode: "esm_awaited_parent_handoff_runtime_shim",
    cleanParentPath: CLEAN_PARENT_PATH,
    legacyRuntimeAuthorityDemoted: true,
    esmDefaultExportPreserved: true,
    shimActive: state.shimActive,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    parentAwaited: state.parentAwaited,
    mountCalled: state.mountCalled,
    mounted: state.mounted,
    ready: state.ready,
    formVisible: state.formVisible,
    standbyPainted: state.standbyPainted,
    htmlChange: false,
    routeBridgeChange: false,
    childContractRenewal: false,
    visualPassClaim: false,
    parentStatus: state.parentStatus,
    errors: state.errors.slice()
  };
}

async function defaultRuntime(input, options = {}) {
  return awaitedParentMount(input, options);
}

const api = {
  CONTRACT,
  PREVIOUS_CONTRACT,
  FAMILY,
  TARGET,
  ROUTE,
  CLEAN_PARENT_PATH,
  mount,
  boot,
  start,
  init,
  create,
  render,
  requestRender,
  updateState,
  destroy,
  getStatus,
  status: getStatus,
  default: defaultRuntime
};

if (hasWindow()) {
  window.AUDRALIA_RUNTIME = api;
  window.AUDRALIA_CLEAN_CANVAS_RUNTIME = api;
  window.AUDRALIA_RUNTIME_SHIM = api;

  window.AUDRALIA_LEGACY_RUNTIME_SHIM_ACTIVE = true;
  window.AUDRALIA_AWAITED_PARENT_HANDOFF_RUNTIME_SHIM_ACTIVE = true;

  if (!window.AUDRALIA_ENGINE) {
    window.AUDRALIA_ENGINE = api;
  }

  if (!window.AUDRALIA_CLEAN_CANVAS_ENGINE) {
    window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
  }

  publishReceipt();
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  FAMILY,
  TARGET,
  ROUTE,
  CLEAN_PARENT_PATH,
  api,
  mount,
  boot,
  start,
  init,
  create,
  render,
  requestRender,
  updateState,
  destroy,
  getStatus
};

export default defaultRuntime;
