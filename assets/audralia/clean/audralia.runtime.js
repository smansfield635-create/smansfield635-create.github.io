// /assets/audralia/audralia.runtime.js
// AUDRALIA_G2_5_ESM_LEGACY_RUNTIME_TO_CLEAN_PARENT_SHIM_TNT_v1
// Full-file replacement.
// Purpose: preserve the legacy ESM runtime route contract while delegating visible authority to the clean-canvas parent engine.
// Target only: /assets/audralia/audralia.runtime.js
// Delegates to: /assets/audralia/clean/audralia.engine.js
// Does not own: continents, motion, sky, terrain truth, route HTML, route bridge JS, parent Globe, Characters, Gauges, Showroom, generated image, GraphicBox, or visual-pass claim.

const CONTRACT = "AUDRALIA_G2_5_ESM_LEGACY_RUNTIME_TO_CLEAN_PARENT_SHIM_TNT_v1";
const FAMILY = "AUDRALIA_G2_5_SIMPLE_ENGINE_CHILD_SPLIT_TNT_v1";
const TARGET = "/assets/audralia/audralia.runtime.js";
const CLEAN_PARENT_PATH = "/assets/audralia/clean/audralia.engine.js";
const ROUTE = "/showroom/globe/audralia/";

const GLOBAL_PARENT_KEYS = [
  "AUDRALIA_ENGINE",
  "AUDRALIA_CLEAN_CANVAS_ENGINE",
  "AUDRALIA_CLEAN_CANVAS_AUTHORITY",
  "AUDRALIA_CLEAN_ENGINE_PARENT"
];

const state = {
  contract: CONTRACT,
  family: FAMILY,
  target: TARGET,
  route: ROUTE,
  shimActive: true,
  parentRequested: false,
  parentLoaded: false,
  parentDelegated: false,
  mounted: false,
  mountCalled: false,
  formVisible: false,
  ready: false,
  errors: [],
  lastScope: "created",
  parentStatus: null
};

let parentPromise = null;
let lastMountInput = null;
let lastMountOptions = null;

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

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error);
  state.errors.push({
    scope,
    message,
    time: nowIso()
  });
  publishReceipt();
}

function readParent() {
  if (!hasWindow()) return null;

  for (const key of GLOBAL_PARENT_KEYS) {
    const value = window[key];
    if (value && value !== api) return value;
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

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (!hasDocument()) {
      reject(new Error("Document is unavailable; cannot load clean parent engine."));
      return;
    }

    if (scriptAlreadyLoaded(src) || readParent()) {
      resolve({
        loaded: true,
        reused: true,
        src
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-runtime-shim-loader", CONTRACT);

    script.onload = () => {
      resolve({
        loaded: true,
        reused: false,
        src
      });
    };

    script.onerror = () => {
      reject(new Error(`Clean parent engine script failed to load: ${src}`));
    };

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
  state.lastScope = "load-parent";
  publishReceipt();

  parentPromise = loadScriptOnce(CLEAN_PARENT_PATH)
    .then(() => {
      const parent = readParent();

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

function resolveMountTarget(input) {
  if (!hasDocument()) return input || null;

  if (input && input.nodeType === 1) return input;

  if (typeof input === "string") {
    return document.querySelector(input);
  }

  if (input && input.mount && input.mount.nodeType === 1) return input.mount;
  if (input && input.element && input.element.nodeType === 1) return input.element;
  if (input && input.el && input.el.nodeType === 1) return input.el;

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

function callParent(parent, methodNames, args) {
  if (!parent) return null;

  for (const methodName of methodNames) {
    const method = parent[methodName];

    if (typeof method !== "function") continue;

    state.parentDelegated = true;
    publishReceipt();

    return method.apply(parent, args);
  }

  return null;
}

function syncParentStatus(scope = "sync") {
  const parent = readParent();

  if (!parent) {
    state.parentStatus = null;
    state.ready = false;
    state.formVisible = false;
    state.lastScope = scope;
    publishReceipt();
    return null;
  }

  let status = null;

  try {
    if (typeof parent.getStatus === "function") {
      status = parent.getStatus();
    } else if (typeof parent.status === "function") {
      status = parent.status();
    } else if (parent.RECEIPT) {
      status = parent.RECEIPT;
    }
  } catch (error) {
    recordError("syncParentStatus", error);
  }

  state.parentStatus = status || null;
  state.parentLoaded = true;
  state.ready = Boolean(
    status &&
      (status.ready === true ||
        status.mounted === true ||
        status.formVisible === true ||
        status.children)
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

function publishReceipt() {
  if (!hasWindow()) return;

  const receipt = {
    contract: CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    mode: "legacy_runtime_esm_shim_to_clean_parent",
    legacyRuntimeAuthorityDemoted: true,
    cleanParentPath: CLEAN_PARENT_PATH,
    shimActive: state.shimActive,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    mounted: state.mounted,
    mountCalled: state.mountCalled,
    ready: state.ready,
    formVisible: state.formVisible,
    formVisibleClaimPolicy: "parent_status_or_parent_global_only",
    htmlChange: false,
    routeBridgeChange: false,
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
      "legacy runtime import path",
      "clean parent delegation",
      "FORM_VISIBLE gated by parent confirmation"
    ],
    parentStatus: state.parentStatus,
    errors: state.errors.slice()
  };

  window.AUDRALIA_RUNTIME_SHIM_RECEIPT = receipt;
  window.AUDRALIA_RUNTIME_RECEIPT = receipt;
  window.AUDRALIA_CLEAN_CANVAS_RUNTIME_RECEIPT = receipt;

  if (hasDocument() && document.documentElement) {
    document.documentElement.setAttribute("data-audralia-runtime-contract", CONTRACT);
    document.documentElement.setAttribute("data-audralia-runtime-mode", "legacy-shim");
    document.documentElement.setAttribute("data-audralia-clean-parent-path", CLEAN_PARENT_PATH);
    document.documentElement.setAttribute(
      "data-audralia-parent-delegated",
      state.parentDelegated ? "true" : "false"
    );
    document.documentElement.setAttribute(
      "data-audralia-runtime-shim-active",
      state.shimActive ? "true" : "false"
    );
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

async function delegate(methodNames, args, scope) {
  state.lastScope = scope;
  publishReceipt();

  const parent = await loadParent();
  const result = callParent(parent, methodNames, args);

  syncParentStatus(scope);

  return result === undefined || result === null ? api : result;
}

function mount(input, options = {}) {
  state.mountCalled = true;
  state.mounted = true;
  lastMountInput = resolveMountTarget(input);
  lastMountOptions = options || {};
  publishReceipt();

  delegate(
    ["mount", "boot", "start", "init", "create"],
    [lastMountInput, lastMountOptions],
    "mount"
  ).catch((error) => {
    recordError("mount", error);
  });

  return api;
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

function render(...args) {
  const parent = readParent();

  if (parent) {
    const result = callParent(parent, ["render", "draw", "paint"], args);
    syncParentStatus("render");
    return result || api;
  }

  delegate(["render", "draw", "paint"], args, "render").catch((error) => {
    recordError("render", error);
  });

  return api;
}

function requestRender() {
  const parent = readParent();

  if (parent) {
    const result = callParent(parent, ["requestRender", "render"], []);
    syncParentStatus("requestRender");
    return result || api;
  }

  return render();
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
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    mode: "legacy_runtime_esm_shim_to_clean_parent",
    legacyRuntimeAuthorityDemoted: true,
    cleanParentPath: CLEAN_PARENT_PATH,
    shimActive: state.shimActive,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    mounted: state.mounted,
    mountCalled: state.mountCalled,
    ready: state.ready,
    formVisible: state.formVisible,
    htmlChange: false,
    routeBridgeChange: false,
    childContractRenewal: false,
    visualPassClaim: false,
    parentStatus: state.parentStatus,
    errors: state.errors.slice()
  };
}

function defaultRuntime(input, options = {}) {
  return mount(input, options);
}

const api = {
  CONTRACT,
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

  if (!window.AUDRALIA_ENGINE) {
    window.AUDRALIA_ENGINE = api;
  }

  if (!window.AUDRALIA_CLEAN_CANVAS_ENGINE) {
    window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
  }

  window.AUDRALIA_LEGACY_RUNTIME_SHIM_ACTIVE = true;

  publishReceipt();

  if (hasDocument()) {
    const autoMount = () => {
      const target = resolveMountTarget(null);
      if (target && !state.mountCalled) {
        mount(target);
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoMount, { once: true });
    } else {
      queueMicrotask(autoMount);
    }
  }
}

export {
  CONTRACT,
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
