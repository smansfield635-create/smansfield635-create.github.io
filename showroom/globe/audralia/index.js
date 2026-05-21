// /showroom/globe/audralia/index.js
// AUDRALIA_G2_10_ROUTE_BRIDGE_SELECTABLE_STATUS_AND_DUPLICATE_PANEL_SANITIZER_TNT_v1
// Full-file replacement.
// Purpose: preserve the G2.9 planet-family-aligned route bridge, then sanitize the handoff/status UI
// so the page closes once from parent visibility, exposes one selectable receipt panel, prevents stale
// pending/visible duplicate panels, and avoids mobile text-copy interception.
// Owns: route verification, primitive-family readiness, runtime mount coordination, idempotent/selectable
// status presentation, duplicate status sanitation, mobile overflow guard, and figure-eight return receipt.
// Does not own: planet math, lattice, palette, manifest law, source topology, hydrology, surface, runtime
// motion, parent rendering, canvas drawing, terrain, elevation, climate, generated image, GraphicBox,
// or visual-pass claim.

const AUDRALIA_ROUTE_CONTRACT = "AUDRALIA_G2_10_ROUTE_BRIDGE_SELECTABLE_STATUS_AND_DUPLICATE_PANEL_SANITIZER_TNT_v1";
const PREVIOUS_ROUTE_CONTRACT = "AUDRALIA_G2_9_ROUTE_BRIDGE_PLANET_FAMILY_ALIGNED_RETURN_VERIFIER_TNT_v1";
const AUDRALIA_ROUTE_LINEAGE_CONTRACTS = Object.freeze([
  PREVIOUS_ROUTE_CONTRACT,
  "AUDRALIA_G2_6_SINGLE_CACHE_NONCE_CHAIN_ALIGNMENT_ROUTE_BRIDGE_TNT_v1",
  "AUDRALIA_G2_6_HTML_DYNAMIC_ROUTE_BRIDGE_BOOTSTRAP_TNT_v1",
  "AUDRALIA_ROUTE_PROOF_CHAIN_ALIGNMENT_TNT_v13",
  "AUDRALIA_ROUTE_ADOPTED_CANVAS_DOORWAY_TNT_v2"
]);

const ROUTE = "/showroom/globe/audralia/";
const TARGET = "/showroom/globe/audralia/index.js";
const STATUS_ID = "audraliaRouteBridgeSelectableStatus";
const STYLE_ID = "audralia-route-bridge-selectable-overflow-guard";
const CHAIN_CONTRACT = "AUDRALIA_G2_6_SINGLE_CACHE_NONCE_CHAIN_ALIGNMENT_ROUTE_BRIDGE_TNT_v1";
const PARENT_COMPATIBILITY_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
const RUNTIME_EXPECTED_CONTRACT = "AUDRALIA_G2_5_RUNTIME_PARENT_CACHE_KEY_ALIGNMENT_TNT_v1";

const PATHS = Object.freeze({
  manifest: "/assets/showroom/globe/planet/planet.manifest.js",
  math: "/assets/showroom/globe/planet/planet.math.js",
  lattice: "/assets/showroom/globe/planet/planet.lattice.js",
  palette: "/assets/showroom/globe/planet/planet.palette.js",
  runtime: "/assets/audralia/audralia.runtime.v3.js"
});

const EXPECTED_PRIMITIVES = Object.freeze({
  manifest: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MANIFEST_TNT_v1",
  math: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
  lattice: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1",
  palette: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1"
});

const PRIMITIVE_GLOBALS = Object.freeze({
  manifest: Object.freeze(["DGB_PLANET_FAMILY_MANIFEST", "AUDRALIA_CLEAN_CANVAS_MANIFEST", "AUDRALIA_PLANET_FAMILY_MANIFEST"]),
  math: Object.freeze(["DGB_PLANET_FAMILY_MATH", "AUDRALIA_CLEAN_CANVAS_MATH", "AUDRALIA_PLANET_FAMILY_MATH"]),
  lattice: Object.freeze(["DGB_PLANET_FAMILY_LATTICE", "AUDRALIA_CLEAN_CANVAS_LATTICE", "AUDRALIA_PLANET_FAMILY_LATTICE"]),
  palette: Object.freeze(["DGB_PLANET_FAMILY_PALETTE", "AUDRALIA_CLEAN_CANVAS_PALETTE", "AUDRALIA_PLANET_FAMILY_PALETTE"])
});

const BOOT = Object.freeze({
  parentVisibleAttempts: 18,
  parentVisibleDelayMs: 90,
  primitiveLoadTimeoutMs: 3600,
  statusUpdateMinMs: 120
});

const state = {
  contract: AUDRALIA_ROUTE_CONTRACT,
  previousContract: PREVIOUS_ROUTE_CONTRACT,
  target: TARGET,
  route: ROUTE,
  cacheNonce: "",

  bootStarted: false,
  bootComplete: false,
  routeValid: false,
  mountFound: false,
  mountTarget: null,

  statusNode: null,
  statusCardReused: false,
  staleStatusPanelsHidden: 0,
  staleStatusTextNodesHidden: 0,
  duplicateStatusPanelsPrevented: false,
  selectableStatusActive: false,
  statusTouchIsolationActive: false,
  mobileOverflowGuardActive: false,
  parentCanvasOverlayGuardActive: false,

  singleCacheNonceChain: false,
  primitiveLoadStarted: false,
  primitiveLoadComplete: false,
  planetManifestReady: false,
  planetMathReady: false,
  planetLatticeReady: false,
  planetPaletteReady: false,
  primitiveContracts: {},

  runtimeImportStarted: false,
  runtimeImportSucceeded: false,
  runtimeContract: "",
  runtimeContractValid: false,

  mountCalled: false,
  mountAwaited: false,
  parentHandoffAwaited: false,
  parentEngineLoaded: false,
  parentEngineDelegated: false,
  parentContractValid: false,
  parentExpressionAccepted: false,
  parentFormVisibleAccepted: false,
  handoffClosedFromParentReceipt: false,

  gratitudeSourceFieldReady: false,
  gratitudeFigureEightSourceReady: false,
  gratitudeReceiptReturnReady: false,

  status: "route-script-loaded",
  visibleLabel: "Clean-canvas handoff pending",
  visibleSubstatus: "SINGLE_CACHE_NONCE · loading route bridge chain",
  finalMessage: "",
  lastStatusWrite: 0,
  errors: []
};

const loadedScripts = new Map();
let bootPromise = null;
let runtimeModulePromise = null;

function hasWindow() {
  return typeof window !== "undefined";
}

function hasDocument() {
  return typeof document !== "undefined";
}

function nowMs() {
  if (hasWindow() && window.performance && typeof window.performance.now === "function") {
    return window.performance.now();
  }
  return Date.now();
}

function nowIso() {
  try {
    return new Date().toISOString();
  } catch (_error) {
    return "";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
}

function isElement(value) {
  return Boolean(value && value.nodeType === 1);
}

function normalizePath(path) {
  return String(path || "").split("?")[0];
}

function getImportNonce() {
  try {
    return new URL(import.meta.url).searchParams.get("v") || "";
  } catch (_error) {
    return "";
  }
}

function getRoot() {
  return hasDocument() ? document.documentElement : null;
}

function getOrCreateCacheNonce() {
  if (state.cacheNonce) return state.cacheNonce;

  const root = getRoot();
  const fromWindow = hasWindow() && window.AUDRALIA_PAGE_CACHE_NONCE ? String(window.AUDRALIA_PAGE_CACHE_NONCE) : "";
  const fromBootstrap = hasWindow() && window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT && window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey
    ? String(window.AUDRALIA_HTML_BOOTSTRAP_RECEIPT.dynamicCacheKey)
    : "";
  const fromRoot = root
    ? root.getAttribute("data-audralia-page-cache-nonce") ||
      root.getAttribute("data-audralia-route-bridge-cache-key") ||
      root.getAttribute("data-html-cache-key") ||
      root.getAttribute("data-audralia-single-cache-nonce") ||
      ""
    : "";
  const fromImport = getImportNonce();

  state.cacheNonce = fromWindow || fromBootstrap || fromRoot || fromImport ||
    `${CHAIN_CONTRACT}__${Date.now()}__${Math.random().toString(36).slice(2, 8)}`;

  state.singleCacheNonceChain = true;

  if (hasWindow()) {
    window.AUDRALIA_PAGE_CACHE_NONCE = state.cacheNonce;
    window.AUDRALIA_SINGLE_CACHE_NONCE_CHAIN = true;
  }

  if (root) {
    root.setAttribute("data-audralia-page-cache-nonce", state.cacheNonce);
    root.setAttribute("data-audralia-route-bridge-cache-key", state.cacheNonce);
    root.setAttribute("data-audralia-single-cache-nonce-chain", "true");
  }

  return state.cacheNonce;
}

function versioned(path) {
  const separator = String(path).includes("?") ? "&" : "?";
  return `${path}${separator}v=${encodeURIComponent(getOrCreateCacheNonce())}`;
}

function recordError(scope, error) {
  const message = error && error.message ? error.message : String(error);
  state.errors.push({ scope, message, time: nowIso() });
  state.status = `${scope}-error`;
  publishReceipt(scope);
  updateStatus(`error:${scope}`, true);
}

function routeIsValid() {
  if (!hasWindow()) return true;
  const path = window.location && window.location.pathname ? window.location.pathname : ROUTE;
  return path === ROUTE || path === `${ROUTE}index.html` || path.endsWith("/showroom/globe/audralia/");
}

function getMount() {
  if (state.mountTarget && isElement(state.mountTarget)) return state.mountTarget;
  if (!hasDocument()) return null;

  const mount =
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("#audralia-form-mount") ||
    document.querySelector("#audraliaFormMount") ||
    document.querySelector("#audralia-stage") ||
    document.querySelector("#audraliaStage") ||
    document.querySelector("#audraliaMount") ||
    document.querySelector("[data-audralia-form-mount='true']") ||
    document.querySelector("[data-audralia-clean-canvas-mount]") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("[data-adopted-canvas-mount]") ||
    document.querySelector("main [data-audralia-stage]") ||
    document.querySelector("main") ||
    document.body ||
    null;

  if (mount) {
    state.mountTarget = mount;
    mount.setAttribute("data-audralia-route-bridge-mount", "true");
    mount.setAttribute("data-audralia-page-cache-nonce", getOrCreateCacheNonce());
  }

  return mount;
}

function installSelectableOverflowGuard() {
  if (!hasDocument()) return false;
  if (document.querySelector(`#${STYLE_ID}`)) {
    state.mobileOverflowGuardActive = true;
    return true;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #${STATUS_ID},
    #${STATUS_ID} *,
    [data-audralia-selectable-status="true"],
    [data-audralia-selectable-status="true"] * {
      -webkit-user-select: text !important;
      user-select: text !important;
      -webkit-touch-callout: default !important;
      touch-action: pan-y !important;
      pointer-events: auto !important;
    }
    #${STATUS_ID},
    [data-audralia-selectable-status="true"] {
      position: relative !important;
      z-index: 80 !important;
      box-sizing: border-box !important;
      width: 100% !important;
      max-width: 100% !important;
      overflow-x: hidden !important;
      overflow-wrap: anywhere !important;
      word-break: normal !important;
      contain: layout style !important;
    }
    #${STATUS_ID} pre,
    #${STATUS_ID} code,
    #${STATUS_ID} span,
    #${STATUS_ID} p,
    #${STATUS_ID} li,
    #${STATUS_ID} strong,
    [data-audralia-route-bridge-value="true"] {
      max-width: 100% !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
      overflow-x: hidden !important;
    }
    #${STATUS_ID} ul {
      margin-left: 1.1rem !important;
      padding-left: 0 !important;
    }
    [data-audralia-route-bridge-superseded="true"] {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(style);
  state.mobileOverflowGuardActive = true;
  return true;
}

function textOf(node) {
  return String(node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
}

function isBridgeStatusLike(node) {
  const text = textOf(node);
  if (!text) return false;
  return (
    text.includes("Clean-canvas handoff") ||
    text.includes("SINGLE_CACHE_NONCE") ||
    text.includes("PARENT_FORM_VISIBLE") ||
    text.includes("PLANET_MANIFEST_READY") ||
    text.includes("DYNAMIC BRIDGE BOOTSTRAP ACTIVE")
  );
}

function hideNode(node) {
  if (!isElement(node) || node.id === STATUS_ID) return false;
  node.setAttribute("data-audralia-route-bridge-superseded", "true");
  node.setAttribute("aria-hidden", "true");
  try { node.hidden = true; } catch (_error) {}
  if (node.style) {
    node.style.display = "none";
    node.style.visibility = "hidden";
  }
  return true;
}

function hideStaleStatusPanels(keep = null) {
  if (!hasDocument()) return 0;
  let hidden = 0;
  const selectors = [
    "#audraliaBridgeStatus",
    "#audraliaHandoffStatus",
    "#audraliaRouteStatus",
    "[data-audralia-route-bridge-panel='true']",
    "[data-audralia-handoff-status]",
    "[data-audralia-route-status]",
    "[data-audralia-status]"
  ].join(",");

  document.querySelectorAll(selectors).forEach((node) => {
    if (!isElement(node)) return;
    if (node === keep || node.contains(keep) || keep?.contains(node)) return;
    if (!isBridgeStatusLike(node)) return;
    if (hideNode(node)) hidden += 1;
  });

  document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,strong,li,div").forEach((node) => {
    if (!isElement(node)) return;
    if (node === keep || node.contains(keep) || keep?.contains(node)) return;
    const text = textOf(node);
    const exactStale = text === "Clean-canvas handoff pending" || text === "Clean-canvas handoff visible";
    if (!exactStale) return;

    const markedAncestor = node.closest("#audraliaBridgeStatus,#audraliaHandoffStatus,#audraliaRouteStatus,[data-audralia-route-bridge-panel='true'],[data-audralia-handoff-status],[data-audralia-route-status],[data-audralia-status]");
    const target = markedAncestor && markedAncestor !== keep && !markedAncestor.contains(keep) ? markedAncestor : node;
    if (hideNode(target)) {
      if (target === node) state.staleStatusTextNodesHidden += 1;
      else hidden += 1;
    }
  });

  state.staleStatusPanelsHidden += hidden;
  state.duplicateStatusPanelsPrevented = true;
  return hidden;
}

function makeSelectable(node) {
  if (!isElement(node)) return false;
  node.setAttribute("data-audralia-selectable-status", "true");
  node.setAttribute("data-audralia-route-bridge-panel", "true");
  node.setAttribute("data-audralia-route-bridge-contract", AUDRALIA_ROUTE_CONTRACT);
  node.style.position = "relative";
  node.style.zIndex = "80";
  node.style.boxSizing = "border-box";
  node.style.maxWidth = "100%";
  node.style.overflowX = "hidden";
  node.style.overflowWrap = "anywhere";
  node.style.userSelect = "text";
  node.style.WebkitUserSelect = "text";
  node.style.WebkitTouchCallout = "default";
  node.style.touchAction = "pan-y";
  node.style.pointerEvents = "auto";

  node.querySelectorAll("*").forEach((child) => {
    child.style.userSelect = "text";
    child.style.WebkitUserSelect = "text";
    child.style.WebkitTouchCallout = "default";
    child.style.touchAction = "pan-y";
    child.style.pointerEvents = "auto";
  });

  state.selectableStatusActive = true;
  return true;
}

function isolateStatusTouch(node) {
  if (!isElement(node) || node.dataset.audraliaTouchIsolationBound === "true") return false;

  const stopOnly = (event) => {
    event.stopPropagation();
  };

  ["pointerdown", "pointermove", "pointerup", "pointercancel", "touchstart", "touchmove", "touchend", "mousedown", "mouseup", "click"].forEach((type) => {
    node.addEventListener(type, stopOnly, { capture: true, passive: true });
  });

  node.dataset.audraliaTouchIsolationBound = "true";
  state.statusTouchIsolationActive = true;
  return true;
}

function guardParentCanvasOverlay() {
  if (!hasDocument()) return false;
  const status = state.statusNode;

  document.querySelectorAll("canvas[data-audralia-visible-canvas='true'],canvas[data-audralia-g27-atlas-canvas='true'],canvas[data-audralia-parent-chain-canvas='true']").forEach((canvas) => {
    if (!isElement(canvas)) return;
    if (status && status.contains(canvas)) return;
    canvas.style.pointerEvents = "auto";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.WebkitUserSelect = "none";
    if (!canvas.style.zIndex || Number(canvas.style.zIndex) > 50) canvas.style.zIndex = "4";
    canvas.setAttribute("data-audralia-canvas-contained-before-status", "true");
  });

  state.parentCanvasOverlayGuardActive = true;
  return true;
}

function resolveStatusNode() {
  if (state.statusNode && isElement(state.statusNode)) return state.statusNode;
  if (!hasDocument()) return null;

  installSelectableOverflowGuard();

  const existing = document.querySelector(`#${STATUS_ID}`);
  if (existing) {
    state.statusNode = existing;
    state.statusCardReused = true;
    makeSelectable(existing);
    isolateStatusTouch(existing);
    hideStaleStatusPanels(existing);
    guardParentCanvasOverlay();
    return existing;
  }

  hideStaleStatusPanels(null);

  const panel = document.createElement("section");
  panel.id = STATUS_ID;
  panel.setAttribute("data-audralia-route-bridge-panel", "true");
  panel.setAttribute("data-audralia-selectable-status", "true");
  panel.setAttribute("data-audralia-status", "true");
  panel.setAttribute("aria-live", "polite");

  const mount = getMount();
  const parent = mount && mount.parentElement ? mount.parentElement : document.body;
  if (mount && mount.nextSibling) parent.insertBefore(panel, mount.nextSibling);
  else parent.appendChild(panel);

  state.statusNode = panel;
  state.statusCardReused = false;
  makeSelectable(panel);
  isolateStatusTouch(panel);
  hideStaleStatusPanels(panel);
  guardParentCanvasOverlay();

  return panel;
}

function clearNode(node) {
  while (node && node.firstChild) node.removeChild(node.firstChild);
}

function appendText(parent, tag, text, options = {}) {
  const node = document.createElement(tag);
  node.textContent = String(text || "");
  if (options.className) node.className = options.className;
  if (options.bold) node.style.fontWeight = "700";
  if (options.muted) node.style.opacity = "0.72";
  if (options.value) node.setAttribute("data-audralia-route-bridge-value", "true");
  parent.appendChild(node);
  return node;
}

function statusRows() {
  return [
    ["ROUTE_VALID", state.routeValid ? ROUTE : "false"],
    ["MOUNT_TARGET_FOUND", state.mountFound ? "true" : "false"],
    ["SINGLE_CACHE_NONCE", state.cacheNonce || getOrCreateCacheNonce()],
    ["PLANET_MANIFEST_READY", state.planetManifestReady ? "true" : "false"],
    ["PLANET_MATH_READY", state.planetMathReady ? "true" : "false"],
    ["PLANET_LATTICE_READY", state.planetLatticeReady ? "true" : "false"],
    ["PLANET_PALETTE_READY", state.planetPaletteReady ? "true" : "false"],
    ["RUNTIME_IMPORT_SUCCEEDED", state.runtimeImportSucceeded ? PATHS.runtime : "false"],
    ["RUNTIME_CONTRACT_VALID", state.runtimeContractValid ? state.runtimeContract || RUNTIME_EXPECTED_CONTRACT : "false"],
    ["MOUNT_CALLED", state.mountCalled ? "runtime mount invoked" : "false"],
    ["MOUNT_AWAITED", state.mountAwaited ? "Promise.resolve runtime result" : "false"],
    ["PARENT_HANDOFF_AWAITED", state.parentHandoffAwaited ? "runtime call resolved" : "false"],
    ["PARENT_ENGINE_LOADED", state.parentEngineLoaded ? "true" : "false"],
    ["PARENT_ENGINE_DELEGATED", state.parentEngineDelegated ? "true" : "false"],
    ["PARENT_CONTRACT_VALID", state.parentContractValid ? PARENT_COMPATIBILITY_CONTRACT : "false"],
    ["PARENT_FORM_VISIBLE", state.parentFormVisibleAccepted ? "true" : "false"],
    ["GRATITUDE_SOURCE_FIELD_READY", state.gratitudeSourceFieldReady ? "true" : "optional/pending"],
    ["GRATITUDE_RECEIPT_RETURN_READY", state.gratitudeReceiptReturnReady ? "true" : "optional/pending"],
    ["SELECTABLE_STATUS_ACTIVE", state.selectableStatusActive ? "true" : "false"],
    ["DUPLICATE_STATUS_PANELS_PREVENTED", state.duplicateStatusPanelsPrevented ? "true" : "false"]
  ];
}

function updateStatus(scope = "status", force = false) {
  if (!hasDocument()) return;

  const time = nowMs();
  if (!force && time - state.lastStatusWrite < BOOT.statusUpdateMinMs) return;
  state.lastStatusWrite = time;

  installSelectableOverflowGuard();
  const node = resolveStatusNode();
  if (!node) return;

  hideStaleStatusPanels(node);
  guardParentCanvasOverlay();

  node.setAttribute("data-audralia-route-bridge-scope", scope);
  node.setAttribute("data-audralia-route-bridge-contract", AUDRALIA_ROUTE_CONTRACT);
  node.setAttribute("data-audralia-route-bridge-previous-contract", PREVIOUS_ROUTE_CONTRACT);
  node.setAttribute("data-audralia-route-bridge-idempotent", "true");
  node.setAttribute("data-audralia-figure-eight-return-verifier", "true");
  node.setAttribute("data-audralia-mobile-overflow-guard", "true");
  node.setAttribute("data-audralia-selectable-status", "true");

  clearNode(node);

  appendText(node, "h3", state.visibleLabel || "Clean-canvas handoff pending");
  appendText(node, "p", state.visibleSubstatus || "SINGLE_CACHE_NONCE · loading route bridge chain", { bold: true });

  const list = document.createElement("ul");
  for (const [label, value] of statusRows()) {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = label;
    item.appendChild(strong);
    item.appendChild(document.createTextNode(" · "));
    const span = document.createElement("span");
    span.setAttribute("data-audralia-route-bridge-value", "true");
    span.textContent = String(value);
    item.appendChild(span);
    list.appendChild(item);
  }
  node.appendChild(list);

  appendText(node, "p", AUDRALIA_ROUTE_CONTRACT, { muted: true, value: true });
  appendText(node, "p", `Route bridge script: ${TARGET} · downstream nonce: ${state.cacheNonce || getOrCreateCacheNonce()}`, { muted: true, value: true });

  if (state.finalMessage) appendText(node, "p", state.finalMessage, { bold: true });

  makeSelectable(node);
  isolateStatusTouch(node);
}

function readPrimitiveGlobal(kind) {
  if (!hasWindow()) return null;
  const names = PRIMITIVE_GLOBALS[kind] || [];
  for (const name of names) {
    if (window[name] && typeof window[name] === "object") return window[name];
  }
  return null;
}

function primitiveReady(kind) {
  return Boolean(readPrimitiveGlobal(kind));
}

function primitiveContract(kind) {
  const api = readPrimitiveGlobal(kind);
  if (!api) return "";
  if (api.contract) return String(api.contract);
  if (typeof api.getStatus === "function") {
    try {
      const status = api.getStatus();
      return String(status && status.contract ? status.contract : "");
    } catch (_error) {}
  }
  return "";
}

function anyScriptAlreadyLoaded(path) {
  if (!hasDocument()) return false;
  const normalized = normalizePath(path);
  return Array.from(document.scripts).some((script) => normalizePath(script.getAttribute("src") || "") === normalized);
}

function appendClassicScript(path, kind) {
  if (!hasDocument()) return Promise.resolve(false);
  if (primitiveReady(kind)) return Promise.resolve(true);

  const normalized = normalizePath(path);
  if (loadedScripts.has(normalized)) return loadedScripts.get(normalized);

  const promise = new Promise((resolve) => {
    if (anyScriptAlreadyLoaded(path)) {
      const start = Date.now();
      const wait = () => {
        if (primitiveReady(kind)) {
          resolve(true);
          return;
        }
        if (Date.now() - start > BOOT.primitiveLoadTimeoutMs) {
          resolve(false);
          return;
        }
        setTimeout(wait, 40);
      };
      wait();
      return;
    }

    const script = document.createElement("script");
    script.src = versioned(path);
    script.async = false;
    script.defer = false;
    script.setAttribute("data-audralia-route-bridge-loader", AUDRALIA_ROUTE_CONTRACT);
    script.setAttribute("data-audralia-primitive-kind", kind);
    script.setAttribute("data-audralia-page-cache-nonce", getOrCreateCacheNonce());
    script.setAttribute("data-generated-image", "false");
    script.setAttribute("data-graphic-box", "false");
    script.setAttribute("data-visual-pass-claimed", "false");
    script.onload = () => resolve(primitiveReady(kind));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  loadedScripts.set(normalized, promise);
  return promise;
}

async function ensurePlanetPrimitive(kind, path) {
  if (primitiveReady(kind)) return true;
  const loaded = await appendClassicScript(path, kind);
  return Boolean(loaded || primitiveReady(kind));
}

async function ensurePlanetFamily() {
  state.primitiveLoadStarted = true;
  state.status = "planet-family-loading";
  publishReceipt("planet-family-loading");
  updateStatus("planet-family-loading", true);

  const manifest = await ensurePlanetPrimitive("manifest", PATHS.manifest);
  state.planetManifestReady = manifest;
  state.primitiveContracts.manifest = primitiveContract("manifest");
  publishReceipt("planet-manifest-ready");

  const math = await ensurePlanetPrimitive("math", PATHS.math);
  state.planetMathReady = math;
  state.primitiveContracts.math = primitiveContract("math");
  publishReceipt("planet-math-ready");

  const lattice = await ensurePlanetPrimitive("lattice", PATHS.lattice);
  state.planetLatticeReady = lattice;
  state.primitiveContracts.lattice = primitiveContract("lattice");
  publishReceipt("planet-lattice-ready");

  const palette = await ensurePlanetPrimitive("palette", PATHS.palette);
  state.planetPaletteReady = palette;
  state.primitiveContracts.palette = primitiveContract("palette");

  state.primitiveLoadComplete = true;
  state.status = "planet-family-checked";
  publishReceipt("planet-family-checked");
  updateStatus("planet-family-checked", true);

  return { manifest, math, lattice, palette };
}

function resolveRuntimeApi(moduleValue = null) {
  if (moduleValue) {
    if (typeof moduleValue.default === "function") return moduleValue.default;
    if (moduleValue.default && typeof moduleValue.default === "object") return moduleValue.default;
    if (moduleValue.api && typeof moduleValue.api === "object") return moduleValue.api;
    if (typeof moduleValue.mount === "function") return moduleValue;
  }

  if (!hasWindow()) return null;
  return window.AUDRALIA_RUNTIME || window.AUDRALIA_CLEAN_CANVAS_RUNTIME || window.AUDRALIA_RUNTIME_SHIM || null;
}

function readRuntimeContract(runtime) {
  if (!runtime) return "";
  if (runtime.CONTRACT) return String(runtime.CONTRACT);
  if (runtime.contract) return String(runtime.contract);
  if (typeof runtime.getStatus === "function") {
    try {
      const status = runtime.getStatus();
      return String(status && status.contract ? status.contract : "");
    } catch (_error) {}
  }
  return "";
}

async function importRuntime() {
  if (runtimeModulePromise) return runtimeModulePromise;
  state.runtimeImportStarted = true;
  state.status = "runtime-importing";
  publishReceipt("runtime-importing");
  updateStatus("runtime-importing", true);

  runtimeModulePromise = import(versioned(PATHS.runtime))
    .then((moduleValue) => {
      const runtime = resolveRuntimeApi(moduleValue);
      state.runtimeImportSucceeded = Boolean(runtime);
      state.runtimeContract = readRuntimeContract(runtime);
      state.runtimeContractValid = !state.runtimeContract || state.runtimeContract === RUNTIME_EXPECTED_CONTRACT;
      publishReceipt("runtime-imported");
      updateStatus("runtime-imported", true);
      return runtime;
    })
    .catch((error) => {
      state.runtimeImportSucceeded = false;
      recordError("runtime-import", error);
      return null;
    });

  return runtimeModulePromise;
}

function parentReceiptCandidates() {
  if (!hasWindow()) return [];
  return [
    window.AUDRALIA_ENGINE_RECEIPT,
    window.AUDRALIA_CLEAN_ENGINE_RECEIPT,
    window.AUDRALIA_CLEAN_CANVAS_ENGINE_RECEIPT,
    window.AUDRALIA_PARENT_ENGINE_RECEIPT,
    window.AUDRALIA_G2_7_PARENT_FULL_TEXTURE_ATLAS_RENDERER_RECEIPT,
    window.AUDRALIA_RUNTIME_RECEIPT && window.AUDRALIA_RUNTIME_RECEIPT.parentStatus,
    window.AUDRALIA_RUNTIME_SHIM_RECEIPT && window.AUDRALIA_RUNTIME_SHIM_RECEIPT.parentStatus
  ].filter(Boolean);
}

function readParentApi() {
  if (!hasWindow()) return null;
  const candidates = [
    window.AUDRALIA_CLEAN_CANVAS_AUTHORITY,
    window.AUDRALIA_CLEAN_CANVAS_ENGINE,
    window.AUDRALIA_CLEAN_ENGINE_PARENT,
    window.AUDRALIA_ENGINE,
    window.AUDRALIA_CLEAN_PARENT_ENGINE,
    window.AUDRALIA_PARENT_FULL_TEXTURE_ATLAS_ENGINE
  ];

  return candidates.find((candidate) => candidate && typeof candidate === "object") || null;
}

function readParentStatusFromApi(parent) {
  if (!parent) return null;
  try {
    if (typeof parent.getStatus === "function") return parent.getStatus();
    if (typeof parent.status === "function") return parent.status();
  } catch (_error) {}
  return null;
}

function parentContractIsValid(receipt) {
  if (!receipt || typeof receipt !== "object") return false;
  const contract = String(receipt.contract || "");
  const internal = String(receipt.internalContract || receipt.INTERNAL_CONTRACT || "");
  const family = String(receipt.family || "");
  const renderModel = String(receipt.renderModel || "");

  if (contract === PARENT_COMPATIBILITY_CONTRACT) return true;
  if (family === PARENT_COMPATIBILITY_CONTRACT) return true;
  if (internal.includes("PARENT") && internal.includes("ATLAS")) return true;
  if (contract.includes("PARENT") && contract.includes("ATLAS")) return true;
  if (renderModel.includes("atlas") || renderModel.includes("sphere")) return true;

  return false;
}

function parentVisibleFromReceipt(receipt) {
  if (!receipt || typeof receipt !== "object") return false;
  return Boolean(
    receipt.formVisible === true ||
    receipt.FORM_VISIBLE === true ||
    receipt.parentFormVisible === true ||
    receipt.mounted === true ||
    receipt.visiblePixelsPainted === true ||
    receipt.textureAtlasBuilt === true ||
    receipt.planetMaterialIntegrated === true
  );
}

function parentVisibleFromGlobals() {
  if (!hasWindow()) return false;
  const root = getRoot();
  return Boolean(
    window.AUDRALIA_ENGINE_FORM_VISIBLE === true ||
    window.AUDRALIA_PARENT_FORM_VISIBLE === true ||
    window.AUDRALIA_FORM_VISIBLE === true ||
    window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true ||
    window.AUDRALIA_CLEAN_PARENT_FORM_VISIBLE === true ||
    window.AUDRALIA_RUNTIME_SHIM_FORM_VISIBLE_CONFIRMED === true ||
    (root && root.dataset && (
      root.dataset.audraliaParentFormVisible === "true" ||
      root.dataset.audraliaFormVisible === "true" ||
      root.dataset.audraliaRuntimeFormVisible === "true"
    ))
  );
}

function syncParentAcceptance() {
  const parent = readParentApi();
  const apiStatus = readParentStatusFromApi(parent);
  const receipts = [apiStatus, ...parentReceiptCandidates()].filter(Boolean);
  const validReceipt = receipts.find(parentContractIsValid) || receipts[0] || null;

  state.parentEngineLoaded = Boolean(parent || receipts.length);
  state.parentContractValid = Boolean(validReceipt && parentContractIsValid(validReceipt));
  state.parentFormVisibleAccepted = Boolean(parentVisibleFromGlobals() || receipts.some(parentVisibleFromReceipt));
  state.parentExpressionAccepted = Boolean(state.parentEngineLoaded && (state.parentContractValid || state.parentFormVisibleAccepted));

  if (hasWindow()) {
    window.AUDRALIA_ROUTE_PARENT_EXPRESSION_ACCEPTED = state.parentExpressionAccepted;
    window.AUDRALIA_ROUTE_PARENT_FORM_VISIBLE_ACCEPTED = state.parentFormVisibleAccepted;
  }

  return validReceipt;
}

function syncGratitudeSourceSupport() {
  if (!hasWindow()) return;

  const topology = window.AUDRALIA_TOPOLOGY_GRATITUDE;
  const source = window.AUDRALIA_GRATITUDE_SOURCE_FIELD;
  const figure = window.AUDRALIA_GRATITUDE_FIGURE_EIGHT_SOURCE;
  const traversal = window.AUDRALIA_GRATITUDE_TRAVERSAL_RECEIPT;

  state.gratitudeSourceFieldReady = Boolean(
    source ||
    (topology && typeof topology.getSourceField === "function") ||
    (topology && topology.CONTRACT && String(topology.CONTRACT).includes("GRATITUDE"))
  );
  state.gratitudeFigureEightSourceReady = Boolean(
    figure ||
    (topology && typeof topology.getFigureEightSource === "function")
  );
  state.gratitudeReceiptReturnReady = Boolean(
    (traversal && traversal.receiptReturnReady !== false) ||
    (topology && typeof topology.getTraversalReceipt === "function")
  );
}

function closeHandoffIfAllowed(scope = "close-check") {
  syncParentAcceptance();
  syncGratitudeSourceSupport();

  if (state.parentFormVisibleAccepted && state.parentExpressionAccepted) {
    state.status = "form-visible-parent-confirmed";
    state.bootComplete = true;
    state.handoffClosedFromParentReceipt = true;
    state.visibleLabel = "Clean-canvas handoff visible";
    state.visibleSubstatus = state.gratitudeReceiptReturnReady
      ? "FORM_VISIBLE · parent-confirmed · source-return ready"
      : "FORM_VISIBLE · parent-confirmed · source pending";
    state.finalMessage = "Figure-eight return verifier closed from lawful parent expression. Status panel is selectable.";

    const root = getRoot();
    if (root) {
      root.dataset.audraliaRouteStatus = state.status;
      root.dataset.audraliaRouteBridgeClosed = "true";
      root.dataset.audraliaFormVisible = "true";
      root.dataset.audraliaParentFormVisible = "true";
      root.dataset.audraliaFigureEightReturnVerifier = "true";
      root.dataset.audraliaChildVisualPrecedenceRequired = "false";
      root.dataset.audraliaSelectableStatusActive = String(state.selectableStatusActive);
      root.dataset.audraliaDuplicateStatusPanelsPrevented = String(state.duplicateStatusPanelsPrevented);
    }

    publishReceipt(scope);
    updateStatus(scope, true);
    return true;
  }

  state.visibleLabel = "Clean-canvas handoff pending";
  state.visibleSubstatus = "SINGLE_CACHE_NONCE · loading route bridge chain";
  publishReceipt(scope);
  updateStatus(scope, true);
  return false;
}

async function waitForParentVisibility() {
  for (let i = 0; i < BOOT.parentVisibleAttempts; i += 1) {
    if (closeHandoffIfAllowed(`parent-visible-check-${i + 1}`)) return true;
    await sleep(BOOT.parentVisibleDelayMs + i * 12);
  }
  closeHandoffIfAllowed("parent-visible-bounded-timeout");
  return state.parentFormVisibleAccepted;
}

async function callRuntimeMount(runtime, mount) {
  if (!runtime) throw new Error("Runtime API unavailable after import.");

  const options = {
    route: ROUTE,
    target: TARGET,
    cacheNonce: getOrCreateCacheNonce(),
    delegatedBy: AUDRALIA_ROUTE_CONTRACT,
    previousDelegation: PREVIOUS_ROUTE_CONTRACT,
    planetFamilyAligned: true,
    selectableStatusActive: true,
    duplicateStatusPanelsPrevented: true,
    figureEightReturnVerifier: true,
    childVisualPrecedenceRequired: false,
    sourceFieldSupportOptional: true
  };

  state.mountCalled = true;
  publishReceipt("runtime-mount-called");
  updateStatus("runtime-mount-called", true);

  let result;
  if (typeof runtime === "function") {
    result = runtime(mount, options);
  } else if (runtime && typeof runtime.mount === "function") {
    result = runtime.mount(mount, options);
  } else if (runtime && typeof runtime.boot === "function") {
    result = runtime.boot(mount, options);
  } else if (runtime && typeof runtime.start === "function") {
    result = runtime.start(mount, options);
  } else if (runtime && typeof runtime.init === "function") {
    result = runtime.init(mount, options);
  } else if (runtime && typeof runtime.create === "function") {
    result = runtime.create(mount, options);
  } else {
    throw new Error("Runtime imported, but no mount-compatible method was exposed.");
  }

  const awaited = await Promise.resolve(result);
  state.mountAwaited = true;
  state.parentHandoffAwaited = true;
  state.parentEngineDelegated = true;
  syncParentAcceptance();
  publishReceipt("runtime-mount-awaited");
  updateStatus("runtime-mount-awaited", true);
  return awaited;
}

function exposeRouteReceipt(partial = {}) {
  return publishReceipt(partial.scope || "manual-expose", partial);
}

function publishReceipt(scope = "publish", partial = {}) {
  if (!hasWindow()) return null;

  syncGratitudeSourceSupport();

  const receipt = {
    contract: AUDRALIA_ROUTE_CONTRACT,
    previousContract: PREVIOUS_ROUTE_CONTRACT,
    lineageContracts: Array.from(AUDRALIA_ROUTE_LINEAGE_CONTRACTS),
    target: TARGET,
    route: ROUTE,
    scope,
    status: state.status,
    updatedAt: nowIso(),

    routeBridgeIdempotent: true,
    planetFamilyAligned: true,
    selectableStatusSanitizer: true,
    figureEightReturnVerifier: true,
    singleCacheNonceChain: true,
    cacheNonce: state.cacheNonce || getOrCreateCacheNonce(),

    routeValid: state.routeValid,
    mountFound: state.mountFound,
    mountId: state.mountTarget ? state.mountTarget.id || "" : "",

    planetManifestReady: state.planetManifestReady,
    planetMathReady: state.planetMathReady,
    planetLatticeReady: state.planetLatticeReady,
    planetPaletteReady: state.planetPaletteReady,
    primitiveContracts: { ...state.primitiveContracts },
    expectedPrimitives: { ...EXPECTED_PRIMITIVES },

    runtimeImportStarted: state.runtimeImportStarted,
    runtimeImportSucceeded: state.runtimeImportSucceeded,
    runtimeContract: state.runtimeContract,
    runtimeExpectedContract: RUNTIME_EXPECTED_CONTRACT,
    runtimeContractValid: state.runtimeContractValid,

    mountCalled: state.mountCalled,
    mountAwaited: state.mountAwaited,
    parentHandoffAwaited: state.parentHandoffAwaited,
    parentEngineLoaded: state.parentEngineLoaded,
    parentEngineDelegated: state.parentEngineDelegated,
    parentContractValid: state.parentContractValid,
    parentCompatibilityContract: PARENT_COMPATIBILITY_CONTRACT,
    parentExpressionAccepted: state.parentExpressionAccepted,
    parentFormVisibleAccepted: state.parentFormVisibleAccepted,
    handoffClosedFromParentReceipt: state.handoffClosedFromParentReceipt,

    childVisualPrecedenceRequired: false,
    sourceFieldSupportOptional: true,
    gratitudeSourceFieldReady: state.gratitudeSourceFieldReady,
    gratitudeFigureEightSourceReady: state.gratitudeFigureEightSourceReady,
    gratitudeReceiptReturnReady: state.gratitudeReceiptReturnReady,

    statusCardReused: state.statusCardReused,
    selectableStatusActive: state.selectableStatusActive,
    statusTouchIsolationActive: state.statusTouchIsolationActive,
    duplicateStatusPanelsPrevented: state.duplicateStatusPanelsPrevented,
    staleStatusPanelsHidden: state.staleStatusPanelsHidden,
    staleStatusTextNodesHidden: state.staleStatusTextNodesHidden,
    pendingLoopPrevented: true,
    mobileOverflowGuardActive: state.mobileOverflowGuardActive,
    parentCanvasOverlayGuardActive: state.parentCanvasOverlayGuardActive,

    bridgeOwnsPlanetTruth: false,
    bridgeOwnsRenderTruth: false,
    bridgeOwnsRuntimeMotion: false,
    bridgeOwnsParentCanvas: false,
    bridgeOwnsChildTopology: false,
    bridgeOwnsHydrology: false,
    bridgeOwnsSurface: false,
    bridgeOwnsTerrain: false,
    bridgeOwnsElevation: false,

    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false,
    errors: state.errors.slice(),
    ...partial
  };

  window.AUDRALIA_ROUTE_RECEIPT = receipt;
  window.__AUDRALIA_ROUTE_RECEIPT__ = receipt;
  window.AudraliaRouteStatus = receipt;
  window.AUDRALIA_ROUTE_BRIDGE_RECEIPT = receipt;
  window.AUDRALIA_FIGURE_EIGHT_RETURN_VERIFIER_RECEIPT = receipt;
  window.AUDRALIA_ROUTE_BRIDGE_IDEMPOTENT = true;
  window.AUDRALIA_ROUTE_BRIDGE_PLANET_FAMILY_ALIGNED = true;
  window.AUDRALIA_ROUTE_BRIDGE_SELECTABLE_STATUS_ACTIVE = state.selectableStatusActive;
  window.AUDRALIA_ROUTE_BRIDGE_DUPLICATE_STATUS_PANELS_PREVENTED = state.duplicateStatusPanelsPrevented;
  window.AUDRALIA_CHILD_VISUAL_PRECEDENCE_REQUIRED = false;

  const root = getRoot();
  if (root) {
    root.dataset.audraliaRouteContract = AUDRALIA_ROUTE_CONTRACT;
    root.dataset.audraliaRoutePreviousContract = PREVIOUS_ROUTE_CONTRACT;
    root.dataset.audraliaRouteStatus = state.status;
    root.dataset.audraliaRouteBridgeIdempotent = "true";
    root.dataset.audraliaPlanetFamilyAligned = "true";
    root.dataset.audraliaFigureEightReturnVerifier = "true";
    root.dataset.audraliaMountFound = String(state.mountFound);
    root.dataset.audraliaSingleCacheNonceChain = "true";
    root.dataset.audraliaPageCacheNonce = state.cacheNonce || getOrCreateCacheNonce();
    root.dataset.audraliaPlanetManifestReady = String(state.planetManifestReady);
    root.dataset.audraliaPlanetMathReady = String(state.planetMathReady);
    root.dataset.audraliaPlanetLatticeReady = String(state.planetLatticeReady);
    root.dataset.audraliaPlanetPaletteReady = String(state.planetPaletteReady);
    root.dataset.audraliaRuntimeImportSucceeded = String(state.runtimeImportSucceeded);
    root.dataset.audraliaParentEngineLoaded = String(state.parentEngineLoaded);
    root.dataset.audraliaParentEngineDelegated = String(state.parentEngineDelegated);
    root.dataset.audraliaParentContractValid = String(state.parentContractValid);
    root.dataset.audraliaParentFormVisible = String(state.parentFormVisibleAccepted);
    root.dataset.audraliaChildVisualPrecedenceRequired = "false";
    root.dataset.audraliaSelectableStatusActive = String(state.selectableStatusActive);
    root.dataset.audraliaStatusTouchIsolationActive = String(state.statusTouchIsolationActive);
    root.dataset.audraliaDuplicateStatusPanelsPrevented = String(state.duplicateStatusPanelsPrevented);
    root.dataset.audraliaMobileOverflowGuardActive = String(state.mobileOverflowGuardActive);
    root.dataset.generatedImage = "false";
    root.dataset.graphicBox = "false";
    root.dataset.visualPassClaimed = "false";
  }

  try {
    window.dispatchEvent(new CustomEvent("audralia:route-bridge:receipt", { detail: receipt }));
  } catch (_error) {
    try { window.dispatchEvent(new Event("audralia:route-bridge:receipt")); } catch (_ignored) {}
  }

  return receipt;
}

async function bootAudraliaDoorway() {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    state.bootStarted = true;
    state.routeValid = routeIsValid();
    getOrCreateCacheNonce();
    installSelectableOverflowGuard();
    resolveStatusNode();

    const mount = getMount();
    state.mountFound = Boolean(mount);
    guardParentCanvasOverlay();

    if (!state.routeValid) {
      state.status = "route-invalid";
      state.visibleLabel = "Clean-canvas handoff held";
      state.visibleSubstatus = "ROUTE_VALID · false";
      publishReceipt("route-invalid");
      updateStatus("route-invalid", true);
      return getStatus();
    }

    if (!mount) {
      state.status = "mount-missing";
      state.visibleLabel = "Clean-canvas handoff held";
      state.visibleSubstatus = "MOUNT_TARGET_FOUND · false";
      recordError("mount", "No Audralia mount target found.");
      return getStatus();
    }

    state.status = "route-validated";
    publishReceipt("route-validated");
    updateStatus("route-validated", true);

    await ensurePlanetFamily();

    const alreadyClosed = closeHandoffIfAllowed("pre-runtime-parent-check");
    if (alreadyClosed) return getStatus();

    const runtime = await importRuntime();
    if (!runtime) {
      state.status = "runtime-unavailable";
      state.visibleLabel = "Clean-canvas handoff held";
      state.visibleSubstatus = "RUNTIME_IMPORT_SUCCEEDED · false";
      publishReceipt("runtime-unavailable");
      updateStatus("runtime-unavailable", true);
      return getStatus();
    }

    await callRuntimeMount(runtime, mount);
    await waitForParentVisibility();

    if (!state.parentFormVisibleAccepted) {
      state.status = "parent-visible-not-confirmed";
      state.visibleLabel = "Clean-canvas handoff pending";
      state.visibleSubstatus = "PARENT_FORM_VISIBLE · awaiting bounded confirmation";
      state.finalMessage = "Parent did not confirm visible form inside the bounded route-bridge window.";
      publishReceipt("parent-visible-not-confirmed");
      updateStatus("parent-visible-not-confirmed", true);
    }

    state.bootComplete = true;
    hideStaleStatusPanels(state.statusNode);
    guardParentCanvasOverlay();
    publishReceipt("boot-complete");
    return getStatus();
  })().catch((error) => {
    recordError("bootAudraliaDoorway", error);
    return getStatus();
  });

  return bootPromise;
}

function getStatus() {
  syncParentAcceptance();
  syncGratitudeSourceSupport();

  return {
    contract: AUDRALIA_ROUTE_CONTRACT,
    previousContract: PREVIOUS_ROUTE_CONTRACT,
    lineageContracts: Array.from(AUDRALIA_ROUTE_LINEAGE_CONTRACTS),
    target: TARGET,
    route: ROUTE,
    status: state.status,
    cacheNonce: state.cacheNonce || getOrCreateCacheNonce(),
    routeBridgeIdempotent: true,
    planetFamilyAligned: true,
    selectableStatusSanitizer: true,
    figureEightReturnVerifier: true,
    singleCacheNonceChain: true,
    routeValid: state.routeValid,
    mountFound: state.mountFound,
    primitiveLoadComplete: state.primitiveLoadComplete,
    planetManifestReady: state.planetManifestReady,
    planetMathReady: state.planetMathReady,
    planetLatticeReady: state.planetLatticeReady,
    planetPaletteReady: state.planetPaletteReady,
    primitiveContracts: { ...state.primitiveContracts },
    runtimeImportSucceeded: state.runtimeImportSucceeded,
    runtimeContract: state.runtimeContract,
    runtimeContractValid: state.runtimeContractValid,
    mountCalled: state.mountCalled,
    mountAwaited: state.mountAwaited,
    parentHandoffAwaited: state.parentHandoffAwaited,
    parentEngineLoaded: state.parentEngineLoaded,
    parentEngineDelegated: state.parentEngineDelegated,
    parentContractValid: state.parentContractValid,
    parentExpressionAccepted: state.parentExpressionAccepted,
    parentFormVisibleAccepted: state.parentFormVisibleAccepted,
    handoffClosedFromParentReceipt: state.handoffClosedFromParentReceipt,
    childVisualPrecedenceRequired: false,
    sourceFieldSupportOptional: true,
    gratitudeSourceFieldReady: state.gratitudeSourceFieldReady,
    gratitudeFigureEightSourceReady: state.gratitudeFigureEightSourceReady,
    gratitudeReceiptReturnReady: state.gratitudeReceiptReturnReady,
    statusCardReused: state.statusCardReused,
    selectableStatusActive: state.selectableStatusActive,
    statusTouchIsolationActive: state.statusTouchIsolationActive,
    duplicateStatusPanelsPrevented: state.duplicateStatusPanelsPrevented,
    staleStatusPanelsHidden: state.staleStatusPanelsHidden,
    staleStatusTextNodesHidden: state.staleStatusTextNodesHidden,
    pendingLoopPrevented: true,
    mobileOverflowGuardActive: state.mobileOverflowGuardActive,
    parentCanvasOverlayGuardActive: state.parentCanvasOverlayGuardActive,
    generatedImage: false,
    graphicBox: false,
    visualPassClaim: false,
    errors: state.errors.slice()
  };
}

function start() {
  return bootAudraliaDoorway();
}

function boot() {
  return bootAudraliaDoorway();
}

function init() {
  return bootAudraliaDoorway();
}

function create() {
  return bootAudraliaDoorway();
}

const api = Object.freeze({
  contract: AUDRALIA_ROUTE_CONTRACT,
  CONTRACT: AUDRALIA_ROUTE_CONTRACT,
  previousContract: PREVIOUS_ROUTE_CONTRACT,
  lineageContracts: AUDRALIA_ROUTE_LINEAGE_CONTRACTS,
  target: TARGET,
  route: ROUTE,
  getMount,
  exposeRouteReceipt,
  bootAudraliaDoorway,
  boot,
  start,
  init,
  create,
  getStatus,
  status: getStatus
});

if (hasWindow()) {
  window.AUDRALIA_ROUTE_BRIDGE = api;
  window.AUDRALIA_ROUTE_BRIDGE_API = api;
  window.AUDRALIA_PLANET_FAMILY_ALIGNED_ROUTE_BRIDGE = api;
  window.AUDRALIA_ROUTE_BRIDGE_SELECTABLE_STATUS_SANITIZER = api;
  publishReceipt("module-load");
}

if (hasDocument()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAudraliaDoorway, { once: true });
  } else {
    bootAudraliaDoorway();
  }
}

export {
  AUDRALIA_ROUTE_CONTRACT,
  PREVIOUS_ROUTE_CONTRACT,
  AUDRALIA_ROUTE_LINEAGE_CONTRACTS,
  bootAudraliaDoorway,
  exposeRouteReceipt,
  getMount,
  getStatus,
  boot,
  start,
  init,
  create
};

export default bootAudraliaDoorway;
