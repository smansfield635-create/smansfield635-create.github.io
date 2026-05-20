// /assets/audralia/audralia.runtime.v3.js
// AUDRALIA_G2_5_RUNTIME_PARENT_CACHE_KEY_ALIGNMENT_TNT_v1
// Full-file replacement.
// Purpose: runtime reads the route/page cache nonce and uses it when loading the clean parent engine.
// Chain alignment: AUDRALIA_G2_6_SINGLE_CACHE_NONCE_CHAIN_ALIGNMENT_TNT_v1
// Does not own: HTML, route bridge, parent geometry, continent topology, motion, sky, generated image, GraphicBox, or visual-pass claim.

const CONTRACT = "AUDRALIA_G2_5_RUNTIME_PARENT_CACHE_KEY_ALIGNMENT_TNT_v1";
const CHAIN_CONTRACT = "AUDRALIA_G2_6_SINGLE_CACHE_NONCE_CHAIN_ALIGNMENT_TNT_v1";
const FAMILY = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";

const TARGET = "/assets/audralia/audralia.runtime.v3.js";
const ROUTE = "/showroom/globe/audralia/";

const CLEAN_PARENT_PATH = "/assets/audralia/clean/engine/audralia.engine.js";
const CLEAN_PARENT_CACHE_KEY = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";

const WAIT_PARENT_MS = 5200;
const WAIT_VISIBLE_MS = 5200;
const POLL_MS = 40;

const PARENT_KEYS = [
  "AUDRALIA_CLEAN_CANVAS_AUTHORITY",
  "AUDRALIA_CLEAN_CANVAS_ENGINE",
  "AUDRALIA_CLEAN_ENGINE_PARENT",
  "AUDRALIA_ENGINE"
];

const state = {
  contract: CONTRACT,
  chainContract: CHAIN_CONTRACT,
  family: FAMILY,
  target: TARGET,
  route: ROUTE,
  cleanParentPath: CLEAN_PARENT_PATH,
  cleanParentCacheKey: CLEAN_PARENT_CACHE_KEY,
  cleanParentImport: "",
  cacheNonce: "",
  runtimeParentCacheKeyAligned: true,
  singleCacheNonceChain: true,
  parentRequested: false,
  parentLoaded: false,
  parentDelegated: false,
  parentAwaited: false,
  mountCalled: false,
  mounted: false,
  ready: false,
  formVisible: false,
  parentStatus: null,
  errors: []
};

let parentLoadPromise = null;

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

function getOwnImportNonce() {
  try {
    return new URL(import.meta.url).searchParams.get("v") || "";
  } catch (_error) {
    return "";
  }
}

function getOrCreateCacheNonce(options = {}) {
  if (options && options.cacheNonce) {
    state.cacheNonce = String(options.cacheNonce);
    return state.cacheNonce;
  }

  if (!hasWindow() || !hasDocument()) {
    state.cacheNonce = state.cacheNonce || `${CHAIN_CONTRACT}__${Date.now()}`;
    return state.cacheNonce;
  }

  const root = document.documentElement;

  const nonce =
    state.cacheNonce ||
    (window.AUDRALIA_PAGE_CACHE_NONCE ? String(window.AUDRALIA_PAGE_CACHE_NONCE) : "") ||
    root.getAttribute("data-audralia-page-cache-nonce") ||
    root.getAttribute("data-audralia-route-bridge-cache-key") ||
    (window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT && window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey
      ? String(window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey)
      : "") ||
    getOwnImportNonce() ||
    `${CHAIN_CONTRACT}__${Date.now()}__${Math.random().toString(36).slice(2, 8)}`;

  state.cacheNonce = nonce;
  window.AUDRALIA_PAGE_CACHE_NONCE = nonce;
  root.setAttribute("data-audralia-page-cache-nonce", nonce);
  root.setAttribute("data-audralia-single-cache-nonce-chain", "true");

  return nonce;
}

function parentImportUrl(options = {}) {
  const nonce = getOrCreateCacheNonce(options);
  const url = `${CLEAN_PARENT_PATH}?v=${encodeURIComponent(nonce)}`;
  state.cleanParentImport = url;
  return url;
}

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error);
  state.errors.push({ scope, message, time: nowIso() });
  publishReceipt(scope);
}

function resolveMountTarget(input) {
  if (!hasDocument()) return input || null;

  if (isElement(input)) return input;
  if (typeof input === "string") return document.querySelector(input);

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
    if (value === window.AUDRALIA_RUNTIME_SHIM) continue;

    if (typeof value === "object") {
      if (typeof value.mount === "function") return value;
      if (typeof value.boot === "function") return value;
      if (typeof value.start === "function") return value;
      if (typeof value.init === "function") return value;
      if (typeof value.create === "function") return value;
      if (typeof value.render === "function") return value;
      if (typeof value.getStatus === "function") return value;
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

function parentMatchesCurrent(parent) {
  if (!parent) return false;

  try {
    const status = getParentStatus(parent) || {};
    const contract = parent.CONTRACT || status.contract || "";
    const parentNonce = status.cacheNonce || "";
    return contract === CLEAN_PARENT_CACHE_KEY && (!parentNonce || parentNonce === state.cacheNonce);
  } catch (_error) {
    return false;
  }
}

function scriptAlreadyLoadedCurrentParent(src) {
  if (!hasDocument()) return false;

  return Array.from(document.scripts).some((script) => {
    const raw = script.getAttribute("src") || "";
    return raw === src;
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
    script.setAttribute("data-audralia-single-cache-nonce-chain", CHAIN_CONTRACT);
    script.setAttribute("data-audralia-page-cache-nonce", state.cacheNonce);
    script.setAttribute("data-audralia-clean-parent-path", CLEAN_PARENT_PATH);
    script.setAttribute("data-audralia-clean-parent-cache-key", CLEAN_PARENT_CACHE_KEY);

    script.onload = () => resolve({ src, loaded: true });
    script.onerror = () => reject(new Error(`Clean parent engine failed to load: ${src}`));

    document.head.appendChild(script);
  });
}

async function waitForParent(timeoutMs = WAIT_PARENT_MS) {
  const start = Date.now();

  while (Date.now() - start <= timeoutMs) {
    const parent = readParent();

    if (parent && parentMatchesCurrent(parent)) {
      state.parentLoaded = true;
      publishReceipt("parent-found-current-cache");
      return parent;
    }

    await sleep(POLL_MS);
  }

  return null;
}

async function loadParent(options = {}) {
  getOrCreateCacheNonce(options);
  const src = parentImportUrl(options);

  const existing = readParent();

  if (existing && parentMatchesCurrent(existing)) {
    state.parentRequested = true;
    state.parentLoaded = true;
    publishReceipt("parent-existing-current-cache");
    return existing;
  }

  if (parentLoadPromise) return parentLoadPromise;

  state.parentRequested = true;
  publishReceipt("load-parent-start");

  parentLoadPromise = (async () => {
    if (scriptAlreadyLoadedCurrentParent(src)) {
      const current = await waitForParent(WAIT_PARENT_MS);
      if (current) return current;
    }

    await appendParentScript(src);

    const parent = await waitForParent(WAIT_PARENT_MS);

    if (!parent) {
      throw new Error(`Latest parent script loaded, but no matching parent global was published: ${CLEAN_PARENT_CACHE_KEY}`);
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
  if (!parent) throw new Error("Parent engine unavailable for delegation.");

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
  state.parentLoaded = Boolean(parent && parentMatchesCurrent(parent));

  state.ready = Boolean(
    (status && (status.ready === true || status.mounted === true || status.formVisible === true)) ||
      (parent && state.parentDelegated)
  );

  state.formVisible = Boolean(
    (status && status.formVisible === true) ||
      (hasWindow() &&
        (window.AUDRALIA_FORM_VISIBLE === true ||
          window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true ||
          window.AUDRALIA_CLEAN_PARENT_FORM_VISIBLE === true))
  );

  if (hasWindow()) {
    if (state.parentLoaded) window.AUDRALIA_PARENT_ENGINE_LOADED = true;
    if (state.parentDelegated) window.AUDRALIA_PARENT_ENGINE_DELEGATED = true;
    if (state.formVisible) window.AUDRALIA_RUNTIME_SHIM_FORM_VISIBLE_CONFIRMED = true;
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
          window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true ||
          window.AUDRALIA_CLEAN_PARENT_FORM_VISIBLE === true))
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
    chainContract: CHAIN_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    cleanParentPath: CLEAN_PARENT_PATH,
    cleanParentCacheKey: CLEAN_PARENT_CACHE_KEY,
    cleanParentImport: state.cleanParentImport || "",
    cacheNonce: state.cacheNonce || "",
    mode: "runtime_single_cache_nonce_parent_alignment",
    scope,
    runtimeParentCacheKeyAligned: true,
    singleCacheNonceChain: true,
    parentRequested: state.parentRequested,
    parentLoaded: state.parentLoaded,
    parentDelegated: state.parentDelegated,
    parentAwaited: state.parentAwaited,
    mountCalled: state.mountCalled,
    mounted: state.mounted,
    ready: state.ready,
    formVisible: state.formVisible,
    parentStatus: state.parentStatus,
    errors: state.errors.slice(),
    htmlChange: false,
    routeBridgeChange: false,
    parentRewrite: false,
    childContractRenewal: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false
  };

  window.AUDRALIA_RUNTIME_SHIM_RECEIPT = receipt;
  window.AUDRALIA_RUNTIME_RECEIPT = receipt;
  window.AUDRALIA_CLEAN_CANVAS_RUNTIME_RECEIPT = receipt;

  window.AUDRALIA_RUNTIME_PARENT_CACHE_KEY_ALIGNED = true;
  window.AUDRALIA_RUNTIME_SINGLE_CACHE_NONCE_CHAIN = true;

  if (state.parentLoaded) window.AUDRALIA_PARENT_ENGINE_LOADED = true;
  if (state.parentDelegated) window.AUDRALIA_PARENT_ENGINE_DELEGATED = true;

  if (hasDocument() && document.documentElement) {
    document.documentElement.setAttribute("data-audralia-runtime-contract", CONTRACT);
    document.documentElement.setAttribute("data-audralia-runtime-target", TARGET);
    document.documentElement.setAttribute("data-audralia-runtime-single-cache-nonce-chain", "true");
    document.documentElement.setAttribute("data-audralia-page-cache-nonce", state.cacheNonce || "");
    document.documentElement.setAttribute("data-audralia-clean-parent-cache-key", CLEAN_PARENT_CACHE_KEY);
    document.documentElement.setAttribute("data-audralia-parent-loaded", state.parentLoaded ? "true" : "false");
    document.documentElement.setAttribute("data-audralia-parent-delegated", state.parentDelegated ? "true" : "false");
    document.documentElement.setAttribute("data-audralia-parent-awaited", state.parentAwaited ? "true" : "false");
    document.documentElement.setAttribute("data-audralia-runtime-form-visible", state.formVisible ? "true" : "false");
  }

  try {
    window.dispatchEvent(new CustomEvent("audralia:runtime-shim:receipt", { detail: receipt }));
  } catch (_error) {
    try {
      window.dispatchEvent(new Event("audralia:runtime-shim:receipt"));
    } catch (_ignored) {}
  }
}

async function mount(input, options = {}) {
  state.mountCalled = true;
  state.mounted = true;
  getOrCreateCacheNonce(options);
  publishReceipt("mount-start");

  const target = resolveMountTarget(input);

  if (!target) {
    recordError("mount", "No Audralia mount target was found for parent delegation.");
  }

  try {
    const parent = await loadParent(options);

    const parentResult = callParent(parent, ["mount", "boot", "start", "init", "create"], [
      target,
      {
        ...(options || {}),
        delegatedBy: CONTRACT,
        runtimeShim: true,
        runtimeParentCacheKeyAligned: true,
        singleCacheNonceChain: true,
        cacheNonce: state.cacheNonce,
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

    if (result && typeof result.then === "function") await result;

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
    chainContract: CHAIN_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    cleanParentPath: CLEAN_PARENT_PATH,
    cleanParentCacheKey: CLEAN_PARENT_CACHE_KEY,
    cleanParentImport: state.cleanParentImport || "",
    cacheNonce: state.cacheNonce || "",
    mode: "runtime_single_cache_nonce_parent_alignment",
    runtimeParentCacheKeyAligned: true,
    singleCacheNonceChain: true,
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
    parentRewrite: false,
    childContractRenewal: false,
    visualPassClaim: false,
    errors: state.errors.slice()
  };
}

async function defaultRuntime(input, options = {}) {
  return mount(input, options);
}

defaultRuntime.CONTRACT = CONTRACT;
defaultRuntime.CHAIN_CONTRACT = CHAIN_CONTRACT;
defaultRuntime.FAMILY = FAMILY;
defaultRuntime.TARGET = TARGET;
defaultRuntime.ROUTE = ROUTE;
defaultRuntime.CLEAN_PARENT_PATH = CLEAN_PARENT_PATH;
defaultRuntime.mount = mount;
defaultRuntime.boot = boot;
defaultRuntime.start = start;
defaultRuntime.init = init;
defaultRuntime.create = create;
defaultRuntime.render = render;
defaultRuntime.requestRender = requestRender;
defaultRuntime.updateState = updateState;
defaultRuntime.destroy = destroy;
defaultRuntime.getStatus = getStatus;
defaultRuntime.status = getStatus;

const api = {
  CONTRACT,
  CHAIN_CONTRACT,
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
  getOrCreateCacheNonce();

  window.AUDRALIA_RUNTIME = api;
  window.AUDRALIA_CLEAN_CANVAS_RUNTIME = api;
  window.AUDRALIA_RUNTIME_SHIM = api;

  window.AUDRALIA_RUNTIME_PARENT_CACHE_KEY_ALIGNED = true;
  window.AUDRALIA_RUNTIME_SINGLE_CACHE_NONCE_CHAIN = true;

  publishReceipt("module-load");
}

export {
  CONTRACT,
  CHAIN_CONTRACT,
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
