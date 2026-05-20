// /assets/audralia/clean/audralia.runtime.js
// AUDRALIA_CLEAN_RUNTIME_CONTAMINATION_RECOVERY_SHIM_TNT_v1
// Full-file replacement.
// Purpose: remove misplaced route-bridge code from the clean runtime position and restore this file as a neutral clean-runtime compatibility shim.
// Target only: /assets/audralia/clean/audralia.runtime.js
// Delegates to: /assets/audralia/clean/audralia.engine.js
// Does not own: /showroom/globe/audralia/index.js, route bridge logic, route HTML, legacy runtime path, continents child, motion child, sky child, parent Globe, Characters, Gauges, Showroom, generated image, GraphicBox, or visual-pass claim.

const CONTRACT = "AUDRALIA_CLEAN_RUNTIME_CONTAMINATION_RECOVERY_SHIM_TNT_v1";
const TARGET = "/assets/audralia/clean/audralia.runtime.js";
const CLEAN_PARENT_PATH = "/assets/audralia/clean/audralia.engine.js";
const ROUTE = "/showroom/globe/audralia/";

const PARENT_KEYS = [
  "AUDRALIA_ENGINE",
  "AUDRALIA_CLEAN_CANVAS_ENGINE",
  "AUDRALIA_CLEAN_CANVAS_AUTHORITY",
  "AUDRALIA_CLEAN_ENGINE_PARENT"
];

const WAIT_VISIBLE_MS = 1600;
const POLL_MS = 40;

const state = {
  contract: CONTRACT,
  target: TARGET,
  cleanParentPath: CLEAN_PARENT_PATH,
  route: ROUTE,
  recovery: true,
  routeBridgeCodeRemoved: true,
  cleanRuntimeShimActive: true,
  parentRequested: false,
  parentLoaded: false,
  parentDelegated: false,
  mounted: false,
  formVisible: false,
  ready: false,
  parentStatus: null,
  errors: []
};

let parentPromise = null;

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

    if (value && value !== api && typeof value === "object") {
      return value;
    }
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

    if (readParent()) {
      resolve({ src, loaded: true, reused: true });
      return;
    }

    if (scriptAlreadyLoaded(src)) {
      let tries = 0;

      const check = () => {
        if (readParent()) {
          resolve({ src, loaded: true, reused: true });
          return;
        }

        tries += 1;

        if (tries > 30) {
          reject(new Error(`Clean parent script exists but parent global was not found: ${src}`));
          return;
        }

        setTimeout(check, POLL_MS);
      };

      check();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-clean-runtime-loader", CONTRACT);
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

  if (parentPromise) return parentPromise;

  state.parentRequested = true;
  publishReceipt();

  parentPromise = loadClassicScriptOnce(CLEAN_PARENT_PATH)
    .then(async () => {
      let parent = readParent();

      if (!parent) {
        for (let i = 0; i < 30; i += 1) {
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

  return parentPromise;
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

  state.parentStatus = status || null;
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

  if (state.formVisible && hasWindow()) {
    window.AUDRALIA_CLEAN_RUNTIME_FORM_VISIBLE_CONFIRMED = true;
  }

  publishReceipt(scope);

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

async function waitForVisible(timeoutMs = WAIT_VISIBLE_MS) {
  const start = Date.now();

  while (Date.now() - start <= timeoutMs) {
    const status = syncParentStatus("wait-visible");

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

    const parent = readParent();

    if (parent && typeof parent.render === "function") {
      try {
        parent.render();
      } catch (_error) {}
    }

    await sleep(POLL_MS);
  }

  syncParentStatus("wait-visible-timeout");
  return state.formVisible === true;
}

function publishReceipt(scope = "publish") {
  if (!hasWindow()) return;

  const receipt = {
    contract: CONTRACT,
    target: TARGET,
    route: ROUTE,
    cleanParentPath: CLEAN_PARENT_PATH,
    mode: "clean_runtime_contamination_recovery_shim",
    scope,
    recovery: true,
    routeBridgeCodeRemoved: true,
    cleanRuntimeShimActive: state.cleanRuntimeShimActive,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    mounted: state.mounted,
    ready: state.ready,
    formVisible: state.formVisible,
    parentStatus: state.parentStatus,
    errors: state.errors.slice(),
    htmlChange: false,
    routeBridgeChange: false,
    legacyRuntimeRewrite: false,
    parentRewrite: false,
    childContractRenewal: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false,
    preserves: [
      "default export function",
      "mount()",
      "render()",
      "start()",
      "boot()",
      "init()",
      "create()",
      "clean parent delegation only",
      "no route bridge ownership"
    ]
  };

  window.AUDRALIA_CLEAN_RUNTIME_RECEIPT = receipt;
  window.AUDRALIA_CLEAN_RUNTIME_SHIM_RECEIPT = receipt;
  window.AUDRALIA_CLEAN_RUNTIME_CONTAMINATION_RECOVERY_ACTIVE = true;

  if (hasDocument() && document.documentElement) {
    document.documentElement.setAttribute("data-audralia-clean-runtime-contract", CONTRACT);
    document.documentElement.setAttribute("data-audralia-clean-runtime-mode", "contamination-recovery-shim");
    document.documentElement.setAttribute("data-audralia-clean-runtime-parent-loaded", state.parentLoaded ? "true" : "false");
    document.documentElement.setAttribute("data-audralia-clean-runtime-parent-delegated", state.parentDelegated ? "true" : "false");
    document.documentElement.setAttribute("data-audralia-clean-runtime-form-visible", state.formVisible ? "true" : "false");
  }

  try {
    window.dispatchEvent(
      new CustomEvent("audralia:clean-runtime:receipt", {
        detail: receipt
      })
    );
  } catch (_error) {
    try {
      window.dispatchEvent(new Event("audralia:clean-runtime:receipt"));
    } catch (_ignored) {}
  }
}

async function mount(input, options = {}) {
  state.mounted = true;
  publishReceipt("mount-start");

  const target = resolveMountTarget(input);
  const parent = await loadParent();

  const result = callParent(parent, ["mount", "boot", "start", "init", "create"], [
    target,
    {
      ...(options || {}),
      delegatedBy: CONTRACT,
      cleanRuntimeRecoveryShim: true
    }
  ]);

  if (result && typeof result.then === "function") {
    try {
      await result;
    } catch (error) {
      recordError("parentMount", error);
    }
  }

  await waitForVisible(WAIT_VISIBLE_MS);
  syncParentStatus("mount-complete");

  return getStatus();
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
  publishReceipt("update-state");

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
  publishReceipt("destroy");

  return api;
}

function getStatus() {
  syncParentStatus("status-read");

  return {
    contract: CONTRACT,
    target: TARGET,
    route: ROUTE,
    cleanParentPath: CLEAN_PARENT_PATH,
    mode: "clean_runtime_contamination_recovery_shim",
    recovery: true,
    routeBridgeCodeRemoved: true,
    cleanRuntimeShimActive: state.cleanRuntimeShimActive,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    mounted: state.mounted,
    ready: state.ready,
    formVisible: state.formVisible,
    parentStatus: state.parentStatus,
    errors: state.errors.slice(),
    htmlChange: false,
    routeBridgeChange: false,
    legacyRuntimeRewrite: false,
    parentRewrite: false,
    childContractRenewal: false,
    visualPassClaim: false
  };
}

async function defaultCleanRuntime(input, options = {}) {
  return mount(input, options);
}

const api = {
  CONTRACT,
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
  default: defaultCleanRuntime
};

if (hasWindow()) {
  window.AUDRALIA_CLEAN_RUNTIME = api;
  window.AUDRALIA_CLEAN_RUNTIME_SHIM = api;
  window.AUDRALIA_CLEAN_RUNTIME_CONTAMINATION_RECOVERY_ACTIVE = true;

  publishReceipt("module-load");
}

export {
  CONTRACT,
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

export default defaultCleanRuntime;
