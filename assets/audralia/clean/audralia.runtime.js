// /assets/audralia/audralia.runtime.js
// AUDRALIA_G2_5_RUNTIME_SHIM_PARENT_DELEGATION_REPAIR_TNT_v3
// Full-file replacement.
// Purpose: repair the live legacy runtime import path so it publishes a real ESM contract, loads the clean parent engine, delegates mount, and reports parent-confirmed visibility.
// Target only: /assets/audralia/audralia.runtime.js
// Delegates to: /assets/audralia/clean/audralia.engine.js
// Does not own: /showroom/globe/audralia/index.html, /showroom/globe/audralia/index.js, /assets/audralia/clean/audralia.runtime.js, continents child, motion child, sky child, parent Globe, Characters, Gauges, Showroom, generated image, GraphicBox, or visual-pass claim.

const CONTRACT = "AUDRALIA_G2_5_RUNTIME_SHIM_PARENT_DELEGATION_REPAIR_TNT_v3";
const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_ESM_AWAITED_PARENT_HANDOFF_RUNTIME_SHIM_TNT_v2_1";
const FAMILY = "AUDRALIA_G2_5_SIMPLE_ENGINE_CHILD_SPLIT_TNT_v1";

const TARGET = "/assets/audralia/audralia.runtime.js";
const ROUTE = "/showroom/globe/audralia/";
const CLEAN_PARENT_PATH = "/assets/audralia/clean/audralia.engine.js";
const CLEAN_PARENT_CACHE_KEY = "AUDRALIA_G2_5_PARENT_CONTRACT_ALIGNMENT_TNT_v1";
const CLEAN_PARENT_IMPORT = `${CLEAN_PARENT_PATH}?v=${encodeURIComponent(CLEAN_PARENT_CACHE_KEY)}`;

const WAIT_PARENT_MS = 2400;
const WAIT_VISIBLE_MS = 2800;
const POLL_MS = 40;

const PARENT_KEYS = [
  "AUDRALIA_CLEAN_CANVAS_AUTHORITY",
  "AUDRALIA_CLEAN_CANVAS_ENGINE",
  "AUDRALIA_CLEAN_ENGINE_PARENT",
  "AUDRALIA_ENGINE"
];

const state = {
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  family: FAMILY,
  target: TARGET,
  route: ROUTE,
  cleanParentPath: CLEAN_PARENT_PATH,
  cleanParentImport: CLEAN_PARENT_IMPORT,
  shimActive: true,
  esmContractExported: true,
  defaultExportContractBound: true,
  parentRequested: false,
  parentLoaded: false,
  parentDelegated: false,
  parentAwaited: false,
  mountCalled: false,
  mounted: false,
  ready: false,
  formVisible: false,
  parentStatus: null,
  lastScope: "module-load",
  errors: []
};

let parentLoadPromise = null;
let lastMountPromise = null;

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

function isElement(value) {
  return Boolean(value && value.nodeType === 1);
}

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error);
  state.errors.push({
    scope,
    message,
    time: nowIso()
  });
  publishReceipt(scope);
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

    if (!value) continue;
    if (value === api) continue;
    if (value === window.AUDRALIA_RUNTIME) continue;
    if (value === window.AUDRALIA_CLEAN_CANVAS_RUNTIME) continue;

    if (typeof value === "object" && typeof value.mount === "function") {
      return value;
    }

    if (typeof value === "object" && typeof value.render === "function") {
      return value;
    }

    if (typeof value === "object" && typeof value.getStatus === "function") {
      return value;
    }
  }

  return null;
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

function scriptAlreadyLoaded(src) {
  if (!hasDocument()) return false;

  return Array.from(document.scripts).some((script) => {
    const raw = script.getAttribute("src") || "";
    return raw === src || raw.startsWith(`${src}?`) || raw.endsWith(src);
  });
}

function appendParentScript(src) {
  return new Promise((resolve, reject) => {
    if (!hasDocument()) {
      reject(new Error("Document unavailable; cannot append clean parent engine script."));
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-runtime-parent-loader", CONTRACT);
    script.setAttribute("data-audralia-clean-parent-path", CLEAN_PARENT_PATH);

    script.onload = () => resolve({ src, loaded: true, reused: false });
    script.onerror = () => reject(new Error(`Clean parent engine failed to load: ${src}`));

    document.head.appendChild(script);
  });
}

async function waitForParent(timeoutMs = WAIT_PARENT_MS) {
  const start = Date.now();

  while (Date.now() - start <= timeoutMs) {
    const parent = readParent();

    if (parent) {
      state.parentLoaded = true;
      publishReceipt("parent-found");
      return parent;
    }

    await sleep(POLL_MS);
  }

  return null;
}

async function loadParent() {
  const existing = readParent();

  if (existing) {
    state.parentRequested = true;
    state.parentLoaded = true;
    publishReceipt("parent-existing");
    return existing;
  }

  if (parentLoadPromise) return parentLoadPromise;

  state.parentRequested = true;
  state.lastScope = "load-parent";
  publishReceipt("load-parent-start");

  parentLoadPromise = (async () => {
    if (scriptAlreadyLoaded(CLEAN_PARENT_PATH) || scriptAlreadyLoaded(CLEAN_PARENT_IMPORT)) {
      const parentFromExistingScript = await waitForParent(WAIT_PARENT_MS);

      if (parentFromExistingScript) {
        return parentFromExistingScript;
      }
    }

    await appendParentScript(CLEAN_PARENT_IMPORT);

    const parent = await waitForParent(WAIT_PARENT_MS);

    if (!parent) {
      throw new Error("Clean parent engine script loaded, but no recognized parent global was published.");
    }

    state.parentLoaded = true;
    publishReceipt("load-parent-complete");

    return parent;
  })().catch((error) => {
    recordError("loadParent", error);
    throw error;
  });

  return parentLoadPromise;
}

function callParent(parent, methodNames, args) {
  if (!parent) return null;

  for (const methodName of methodNames) {
    const method = parent[methodName];

    if (typeof method !== "function") continue;

    state.parentDelegated = true;
    publishReceipt(`delegate-${methodName}`);

    return method.apply(parent, args);
  }

  throw new Error("Parent engine loaded, but no mount-compatible method was found.");
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

  state.lastScope = scope;

  if (state.parentLoaded && hasWindow()) {
    window.AUDRALIA_PARENT_ENGINE_LOADED = true;
  }

  if (state.parentDelegated && hasWindow()) {
    window.AUDRALIA_PARENT_ENGINE_DELEGATED = true;
  }

  if (state.formVisible && hasWindow()) {
    window.AUDRALIA_RUNTIME_SHIM_FORM_VISIBLE_CONFIRMED = true;
  }

  publishReceipt(scope);

  return status;
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
      publishReceipt("visible-confirmed");
      return true;
    }

    try {
      if (parent && typeof parent.requestRender === "function") {
        parent.requestRender();
      } else if (parent && typeof parent.render === "function") {
        parent.render();
      }
    } catch (_error) {}

    await sleep(POLL_MS);
  }

  syncParentStatus("await-visible-timeout");
  return state.formVisible === true;
}

function publishReceipt(scope = "publish") {
  if (!hasWindow()) return;

  const receipt = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    cleanParentPath: CLEAN_PARENT_PATH,
    cleanParentImport: CLEAN_PARENT_IMPORT,
    mode: "legacy_runtime_parent_delegation_repair_shim",
    scope,
    shimActive: state.shimActive,
    esmContractExported: true,
    defaultExportContractBound: true,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    parentAwaited: state.parentAwaited,
    mountCalled: state.mountCalled,
    mounted: state.mounted,
    ready: state.ready,
    formVisible: state.formVisible,
    formVisibleClaimPolicy: "parent_status_or_parent_global_only",
    parentStatus: state.parentStatus,
    errors: state.errors.slice(),
    htmlChange: false,
    routeBridgeChange: false,
    cleanRuntimeRewrite: false,
    parentRewrite: false,
    childContractRenewal: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false,
    preserves: [
      "ESM named CONTRACT export",
      "default export function",
      "legacy runtime import path",
      "mount()",
      "render()",
      "start()",
      "boot()",
      "init()",
      "create()",
      "clean parent script loading",
      "clean parent delegation",
      "FORM_VISIBLE gated by parent confirmation"
    ]
  };

  window.AUDRALIA_RUNTIME_SHIM_RECEIPT = receipt;
  window.AUDRALIA_RUNTIME_RECEIPT = receipt;
  window.AUDRALIA_CLEAN_CANVAS_RUNTIME_RECEIPT = receipt;

  window.AUDRALIA_LEGACY_RUNTIME_SHIM_ACTIVE = true;
  window.AUDRALIA_RUNTIME_PARENT_DELEGATION_REPAIR_ACTIVE = true;

  if (state.parentLoaded) {
    window.AUDRALIA_PARENT_ENGINE_LOADED = true;
  }

  if (state.parentDelegated) {
    window.AUDRALIA_PARENT_ENGINE_DELEGATED = true;
  }

  if (hasDocument() && document.documentElement) {
    document.documentElement.setAttribute("data-audralia-runtime-contract", CONTRACT);
    document.documentElement.setAttribute("data-audralia-runtime-target", TARGET);
    document.documentElement.setAttribute("data-audralia-runtime-mode", "parent-delegation-repair-shim");
    document.documentElement.setAttribute("data-audralia-clean-parent-path", CLEAN_PARENT_PATH);
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

async function mount(input, options = {}) {
  state.mountCalled = true;
  state.mounted = true;
  state.lastScope = "mount";
  publishReceipt("mount-start");

  const target = resolveMountTarget(input);

  if (!target) {
    recordError("mount", "No Audralia mount target was found for parent delegation.");
  }

  try {
    const parent = await loadParent();

    const parentResult = callParent(parent, ["mount", "boot", "start", "init", "create"], [
      target,
      {
        ...(options || {}),
        delegatedBy: CONTRACT,
        runtimeShim: true,
        parentDelegationRepair: true,
        route: ROUTE
      }
    ]);

    if (parentResult && typeof parentResult.then === "function") {
      await parentResult;
    }

    state.parentAwaited = true;
    publishReceipt("parent-mount-awaited");

    await awaitVisible(parent, WAIT_VISIBLE_MS);
    syncParentStatus("mount-complete");

    return getStatus();
  } catch (error) {
    recordError("mount", error);
    syncParentStatus("mount-error");
    return getStatus();
  }
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
  try {
    const parent = readParent() || (await loadParent());

    const result = callParent(parent, ["render", "draw", "paint"], args);

    if (result && typeof result.then === "function") {
      await result;
    }

    syncParentStatus("render");
    return getStatus();
  } catch (error) {
    recordError("render", error);
    return getStatus();
  }
}

function requestRender() {
  const parent = readParent();

  if (parent) {
    try {
      const result = callParent(parent, ["requestRender", "render"], []);
      syncParentStatus("requestRender");
      return result || api;
    } catch (error) {
      recordError("requestRender", error);
    }
  }

  render().catch((error) => recordError("requestRender", error));
  return api;
}

function updateState(next = {}) {
  const parent = readParent();

  if (parent) {
    try {
      const result = callParent(parent, ["updateState"], [next]);
      syncParentStatus("updateState");
      return result || api;
    } catch (error) {
      recordError("updateState", error);
    }
  }

  Object.assign(state, next || {});
  publishReceipt("update-state");

  return api;
}

function destroy() {
  const parent = readParent();

  if (parent) {
    try {
      const result = callParent(parent, ["destroy", "dispose", "unmount"], []);
      syncParentStatus("destroy");
      return result || api;
    } catch (error) {
      recordError("destroy", error);
    }
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
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    cleanParentPath: CLEAN_PARENT_PATH,
    cleanParentImport: CLEAN_PARENT_IMPORT,
    mode: "legacy_runtime_parent_delegation_repair_shim",
    shimActive: state.shimActive,
    esmContractExported: true,
    defaultExportContractBound: true,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    parentAwaited: state.parentAwaited,
    mountCalled: state.mountCalled,
    mounted: state.mounted,
    ready: state.ready,
    formVisible: state.formVisible,
    parentStatus: state.parentStatus,
    htmlChange: false,
    routeBridgeChange: false,
    cleanRuntimeRewrite: false,
    parentRewrite: false,
    childContractRenewal: false,
    visualPassClaim: false,
    errors: state.errors.slice()
  };
}

async function defaultRuntime(input, options = {}) {
  lastMountPromise = mount(input, options);
  return lastMountPromise;
}

defaultRuntime.CONTRACT = CONTRACT;
defaultRuntime.TARGET = TARGET;
defaultRuntime.ROUTE = ROUTE;
defaultRuntime.getStatus = getStatus;
defaultRuntime.mount = mount;
defaultRuntime.render = render;

const api = {
  CONTRACT,
  PREVIOUS_CONTRACT,
  FAMILY,
  TARGET,
  ROUTE,
  CLEAN_PARENT_PATH,
  CLEAN_PARENT_IMPORT,
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
  window.AUDRALIA_RUNTIME_PARENT_DELEGATION_REPAIR_ACTIVE = true;

  publishReceipt("module-load");
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  FAMILY,
  TARGET,
  ROUTE,
  CLEAN_PARENT_PATH,
  CLEAN_PARENT_IMPORT,
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
