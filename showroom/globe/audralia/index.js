// /showroom/globe/audralia/index.js
// AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1
// Full-file replacement.
// Purpose: align the Audralia route bridge with the parent visible-body-first failsafe.
// Owns: route bridge import, mount call, parent receipt validation, continents receipt validation, visible handoff status.
// Does not own: runtime internals, parent render, continent model, motion, sky, generated image, GraphicBox, or visual-pass claim.

const BRIDGE_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
const PREVIOUS_BRIDGE_CONTRACT = "AUDRALIA_G2_6_ROUTE_BRIDGE_PARENT_CONFIRMATION_ALIGNMENT_TNT_v1";

const ROUTE = "/showroom/globe/audralia/";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.v3.js";
const RUNTIME_IMPORT = `${RUNTIME_PATH}?v=${encodeURIComponent(BRIDGE_CONTRACT)}`;

const RUNTIME_CONTRACT = "AUDRALIA_G2_5_RUNTIME_PARENT_CACHE_KEY_ALIGNMENT_TNT_v1";
const PARENT_CONTRACT = "AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_TNT_v1";
const CONTINENTS_CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";

const PARENT_TIMEOUT_MS = 5600;
const CONTINENTS_TIMEOUT_MS = 2800;
const POLL_MS = 50;

const state = {
  bridgeContract: BRIDGE_CONTRACT,
  previousBridgeContract: PREVIOUS_BRIDGE_CONTRACT,
  route: ROUTE,
  runtimePath: RUNTIME_PATH,
  runtimeImport: RUNTIME_IMPORT,
  runtimeContractExpected: RUNTIME_CONTRACT,
  parentContractExpected: PARENT_CONTRACT,
  continentsContractExpected: CONTINENTS_CONTRACT,
  routeValid: false,
  mountTargetFound: false,
  standbyFormVisible: false,
  runtimeImportSucceeded: false,
  runtimeContractValid: false,
  mountCalled: false,
  mountAwaited: false,
  parentHandoffAwaited: false,
  parentEngineLoaded: false,
  parentEngineDelegated: false,
  parentContractValid: false,
  parentFormVisible: false,
  continentsReceiptRead: false,
  continentsContractValid: false,
  finalFormVisible: false,
  status: "pending",
  headline: "Clean-canvas handoff pending",
  message: "STANDBY_FORM_VISIBLE · awaiting parent confirmation",
  runtimeReceipt: null,
  parentReceipt: null,
  continentsReceipt: null,
  errors: []
};

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
  publishBridgeReceipt(scope);
  renderStatus();
}

function getRoutePath() {
  if (!hasWindow()) return ROUTE;

  try {
    return window.location.pathname.endsWith("/")
      ? window.location.pathname
      : `${window.location.pathname}/`;
  } catch (_error) {
    return ROUTE;
  }
}

function resolveMountTarget() {
  if (!hasDocument()) return null;

  return (
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-clean-canvas-mount]") ||
    document.querySelector("#audraliaMount") ||
    null
  );
}

function ensureStatusDom() {
  if (!hasDocument()) return {};

  const panel =
    document.querySelector("#audraliaHandoffPanel") ||
    document.querySelector("[data-audralia-handoff-panel]") ||
    null;

  const title =
    document.querySelector("#audraliaHandoffTitle") ||
    document.querySelector("[data-audralia-handoff-title]") ||
    null;

  const message =
    document.querySelector("#audraliaHandoffStatus") ||
    document.querySelector("[data-audralia-handoff-status]") ||
    null;

  const list =
    document.querySelector("#audraliaHandoffList") ||
    document.querySelector("[data-audralia-handoff-list]") ||
    null;

  const receipt =
    document.querySelector("#audraliaHandoffReceipt") ||
    document.querySelector("[data-audralia-handoff-receipt]") ||
    null;

  const script =
    document.querySelector("#audraliaBridgeScript") ||
    document.querySelector("[data-audralia-bridge-script]") ||
    null;

  return { panel, title, message, list, receipt, script };
}

function setRootAttributes() {
  if (!hasDocument() || !document.documentElement) return;

  document.documentElement.setAttribute("data-audralia-route-bridge-contract", BRIDGE_CONTRACT);
  document.documentElement.setAttribute("data-audralia-route-bridge-previous-contract", PREVIOUS_BRIDGE_CONTRACT);
  document.documentElement.setAttribute("data-audralia-runtime-path", RUNTIME_PATH);
  document.documentElement.setAttribute("data-audralia-runtime-contract-expected", RUNTIME_CONTRACT);
  document.documentElement.setAttribute("data-audralia-parent-contract-expected", PARENT_CONTRACT);
  document.documentElement.setAttribute("data-audralia-continents-contract-expected", CONTINENTS_CONTRACT);
  document.documentElement.setAttribute("data-audralia-route-bridge-status", state.status);
  document.documentElement.setAttribute("data-audralia-form-visible", state.finalFormVisible ? "true" : "false");
  document.documentElement.setAttribute("data-audralia-parent-form-visible", state.parentFormVisible ? "true" : "false");
  document.documentElement.setAttribute("data-audralia-parent-contract-valid", state.parentContractValid ? "true" : "false");
  document.documentElement.setAttribute("data-audralia-continents-contract-valid", state.continentsContractValid ? "true" : "false");
}

function statusRows() {
  const rows = [
    ["ROUTE_VALID", state.routeValid ? ROUTE : false],
    ["MOUNT_TARGET_FOUND", state.mountTargetFound],
    ["STANDBY_FORM_VISIBLE", state.standbyFormVisible ? "route bridge painted immediate form" : false],
    ["RUNTIME_IMPORT_SUCCEEDED", state.runtimeImportSucceeded ? RUNTIME_PATH : false],
    ["RUNTIME_CONTRACT_VALID", state.runtimeContractValid ? RUNTIME_CONTRACT : false],
    ["MOUNT_CALLED", state.mountCalled ? "runtime mount invoked" : false],
    ["MOUNT_AWAITED", state.mountAwaited ? "Promise.resolve runtime result" : false],
    ["PARENT_HANDOFF_AWAITED", state.parentHandoffAwaited ? "runtime call resolved" : false],
    ["PARENT_ENGINE_LOADED", state.parentEngineLoaded],
    ["PARENT_ENGINE_DELEGATED", state.parentEngineDelegated],
    ["PARENT_CONTRACT_VALID", state.parentContractValid ? PARENT_CONTRACT : false],
    ["PARENT_FORM_VISIBLE", state.parentFormVisible],
    ["CONTINENTS_RECEIPT_READ", state.continentsReceiptRead],
    ["CONTINENTS_CONTRACT_VALID", state.continentsContractValid ? CONTINENTS_CONTRACT : false]
  ];

  if (state.finalFormVisible) {
    rows.push(["FORM_VISIBLE", "parent-confirmed"]);
  }

  if (state.errors.length) {
    rows.push(["ERRORS", `${state.errors.length} recorded`]);
  }

  return rows;
}

function renderStatus() {
  if (!hasDocument()) return;

  setRootAttributes();

  const { panel, title, message, list, receipt, script } = ensureStatusDom();

  if (panel) {
    panel.setAttribute("data-audralia-handoff-state", state.status);
    panel.setAttribute("data-audralia-form-visible", state.finalFormVisible ? "true" : "false");
  }

  if (title) title.textContent = state.headline;
  if (message) message.textContent = state.message;

  if (list) {
    list.innerHTML = "";

    for (const [label, value] of statusRows()) {
      if (value === false || value === null || value === undefined || value === "") continue;

      const li = document.createElement("li");
      const strong = document.createElement("strong");
      strong.textContent = label;

      li.appendChild(strong);

      if (value !== true) {
        li.appendChild(document.createTextNode(` · ${value}`));
      }

      list.appendChild(li);
    }
  }

  if (receipt) receipt.textContent = BRIDGE_CONTRACT;

  if (script) {
    script.textContent = `Route bridge script: /showroom/globe/audralia/index.js?v=${BRIDGE_CONTRACT}`;
  }
}

function paintStandbyForm(target) {
  if (!hasDocument() || !target) return;

  target.setAttribute("data-audralia-standby-form-visible", "true");
  target.setAttribute("data-audralia-standby-painted-by", BRIDGE_CONTRACT);

  target.style.position = "relative";
  target.style.overflow = "hidden";
  target.style.touchAction = "none";

  let canvas =
    target.querySelector("canvas[data-audralia-clean-parent-canvas='true']") ||
    target.querySelector("canvas[data-audralia-clean-canvas='true']") ||
    target.querySelector("canvas");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("data-audralia-standby-canvas", "true");
    canvas.setAttribute("aria-label", "Audralia standby inspection form");
    target.appendChild(canvas);
  }

  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.borderRadius = "24px";
  canvas.style.touchAction = "none";

  const rect = target.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(target.clientWidth || rect.width || 760));
  const cssHeight = Math.max(420, Math.floor(target.clientHeight || rect.height || 540));
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w * 0.5 - w * 0.21;
  const cy = h * 0.5;
  const r = Math.min(w, h) * 0.29;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "rgba(3, 12, 30, 1)");
  bg.addColorStop(1, "rgba(0, 3, 12, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.22;

  for (let i = 0; i < 89; i += 1) {
    const x = (i * 131 + 37) % w;
    const y = (i * 197 + 53) % h;
    const dot = ((i % 3) + 0.5) * dpr * 0.34;

    ctx.beginPath();
    ctx.arc(x, y, dot, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(220,246,255,0.58)";
    ctx.fill();
  }

  ctx.restore();

  const body = ctx.createRadialGradient(cx - r * 0.36, cy - r * 0.34, r * 0.08, cx, cy, r);
  body.addColorStop(0, "rgba(128,232,255,0.92)");
  body.addColorStop(0.28, "rgba(42,156,204,0.92)");
  body.addColorStop(0.68, "rgba(9,62,126,0.96)");
  body.addColorStop(1, "rgba(1,11,42,0.98)");

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  const shade = ctx.createRadialGradient(cx + r * 0.25, cy + r * 0.18, r * 0.05, cx, cy, r * 1.1);
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.48)");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = shade;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.002, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(190,240,255,0.28)";
  ctx.lineWidth = Math.max(1, dpr * 1.2);
  ctx.stroke();

  state.standbyFormVisible = true;
  renderStatus();
}

function readRuntimeReceipt() {
  if (!hasWindow()) return null;

  return (
    window.AUDRALIA_RUNTIME_RECEIPT ||
    window.AUDRALIA_RUNTIME_SHIM_RECEIPT ||
    window.AUDRALIA_CLEAN_CANVAS_RUNTIME_RECEIPT ||
    null
  );
}

function getParentApi() {
  if (!hasWindow()) return null;

  return (
    window.AUDRALIA_CLEAN_CANVAS_AUTHORITY ||
    window.AUDRALIA_CLEAN_CANVAS_ENGINE ||
    window.AUDRALIA_CLEAN_ENGINE_PARENT ||
    window.AUDRALIA_ENGINE ||
    null
  );
}

function readParentReceipt() {
  if (!hasWindow()) return null;

  const api = getParentApi();

  if (api && typeof api.getStatus === "function") {
    try {
      return api.getStatus();
    } catch (_error) {}
  }

  if (api && typeof api.status === "function") {
    try {
      return api.status();
    } catch (_error) {}
  }

  return (
    window.AUDRALIA_CLEAN_PARENT_ENGINE_RECEIPT ||
    window.AUDRALIA_ENGINE_RECEIPT ||
    window.AUDRALIA_CLEAN_CANVAS_RECEIPT ||
    null
  );
}

function readContinentsReceipt() {
  if (!hasWindow()) return null;

  const api =
    window.AUDRALIA_NINE_SUMMITS_CONTINENTS_ENGINE ||
    window.AUDRALIA_CLEAN_CONTINENTS_ENGINE ||
    window.AUDRALIA_CONTINENTS_ENGINE ||
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS ||
    null;

  if (api && typeof api.getStatus === "function") {
    try {
      return api.getStatus();
    } catch (_error) {}
  }

  if (api && typeof api.status === "function") {
    try {
      return api.status();
    } catch (_error) {}
  }

  return (
    window.AUDRALIA_NINE_SUMMITS_CONTINENTS_RECEIPT ||
    window.AUDRALIA_CONTINENTS_RECEIPT ||
    window.AUDRALIA_CLEAN_CONTINENTS_RECEIPT ||
    window.AUDRALIA_CLEAN_CANVAS_CONTINENTS_RECEIPT ||
    null
  );
}

function validateRuntimeReceipt(receipt) {
  if (!receipt) return false;
  return receipt.contract === RUNTIME_CONTRACT || receipt.cleanParentCacheKey === PARENT_CONTRACT;
}

function validateParentReceipt(receipt) {
  if (!receipt) return false;
  return receipt.contract === PARENT_CONTRACT;
}

function validateParentVisible(receipt) {
  if (!receipt) return false;

  return Boolean(
    receipt.formVisible === true ||
      receipt.ready === true ||
      receipt.bodyPainted === true ||
      (hasWindow() &&
        (window.AUDRALIA_FORM_VISIBLE === true ||
          window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true ||
          window.AUDRALIA_CLEAN_PARENT_FORM_VISIBLE === true))
  );
}

function validateContinentsReceipt(receipt) {
  if (!receipt) return false;

  return Boolean(
    receipt.contract === CONTINENTS_CONTRACT &&
      (receipt.nineSummits256FibonacciModel === true ||
        receipt.continentBodyCount === 9 ||
        receipt.exposedLandCells === 89)
  );
}

function resolveRuntimeMount(runtimeModule) {
  if (!runtimeModule) return null;

  if (typeof runtimeModule.default === "function") {
    return {
      type: "function-export export=default",
      fn: runtimeModule.default
    };
  }

  if (runtimeModule.default && typeof runtimeModule.default.mount === "function") {
    return {
      type: "object-export default.mount",
      fn: runtimeModule.default.mount.bind(runtimeModule.default)
    };
  }

  if (typeof runtimeModule.mount === "function") {
    return {
      type: "named-export mount",
      fn: runtimeModule.mount
    };
  }

  if (runtimeModule.api && typeof runtimeModule.api.mount === "function") {
    return {
      type: "named-export api.mount",
      fn: runtimeModule.api.mount.bind(runtimeModule.api)
    };
  }

  return null;
}

function setHold(reason) {
  state.status = "hold";
  state.headline = "Clean-canvas handoff hold";
  state.message = `HANDOFF_HOLD · ${reason}`;
  publishBridgeReceipt("hold");
  renderStatus();
}

function setFailed(reason) {
  state.status = "failed";
  state.headline = "Clean-canvas handoff failed";
  state.message = `HANDOFF_FAILED · ${reason}`;
  publishBridgeReceipt("failed");
  renderStatus();
}

function setVisible() {
  state.status = "visible";
  state.headline = "Clean-canvas handoff visible";
  state.message = "FORM_VISIBLE · parent-confirmed";
  state.finalFormVisible = true;
  publishBridgeReceipt("visible");
  renderStatus();
}

function applyReceiptRead() {
  const runtimeReceipt = readRuntimeReceipt();
  const parentReceipt = readParentReceipt();
  const continentsReceipt = readContinentsReceipt();

  state.runtimeReceipt = runtimeReceipt;
  state.parentReceipt = parentReceipt;
  state.continentsReceipt = continentsReceipt;

  state.runtimeContractValid = validateRuntimeReceipt(runtimeReceipt);

  state.parentEngineLoaded = Boolean(
    parentReceipt ||
      getParentApi() ||
      (hasWindow() && window.AUDRALIA_PARENT_ENGINE_LOADED === true)
  );

  state.parentEngineDelegated = Boolean(
    (parentReceipt && (parentReceipt.delegatedBy || parentReceipt.mountCalled || parentReceipt.mounted)) ||
      (hasWindow() && window.AUDRALIA_PARENT_ENGINE_DELEGATED === true)
  );

  state.parentContractValid = validateParentReceipt(parentReceipt);
  state.parentFormVisible = validateParentVisible(parentReceipt);

  state.continentsReceiptRead = Boolean(continentsReceipt);
  state.continentsContractValid = validateContinentsReceipt(continentsReceipt);

  renderStatus();
}

async function waitForParentAndContinents() {
  const parentStart = Date.now();

  while (Date.now() - parentStart <= PARENT_TIMEOUT_MS) {
    applyReceiptRead();

    if (state.parentEngineLoaded && state.parentContractValid && state.parentFormVisible) {
      break;
    }

    await sleep(POLL_MS);
  }

  applyReceiptRead();

  if (!state.parentEngineLoaded) {
    setFailed("parent confirmation timeout");
    return false;
  }

  if (!state.parentContractValid) {
    setHold("parent contract mismatch");
    return false;
  }

  if (!state.parentFormVisible) {
    setHold("parent loaded but form not confirmed");
    return false;
  }

  const continentsStart = Date.now();

  while (Date.now() - continentsStart <= CONTINENTS_TIMEOUT_MS) {
    applyReceiptRead();

    if (state.continentsReceiptRead && state.continentsContractValid) {
      return true;
    }

    await sleep(POLL_MS);
  }

  applyReceiptRead();

  if (!state.continentsReceiptRead) {
    setHold("parent visible but continents receipt missing");
    return false;
  }

  if (!state.continentsContractValid) {
    setHold("parent visible but continents contract stale");
    return false;
  }

  return true;
}

function publishBridgeReceipt(scope = "publish") {
  if (!hasWindow()) return;

  const receipt = {
    contract: BRIDGE_CONTRACT,
    previousContract: PREVIOUS_BRIDGE_CONTRACT,
    route: ROUTE,
    runtimePath: RUNTIME_PATH,
    runtimeImport: RUNTIME_IMPORT,
    runtimeContractExpected: RUNTIME_CONTRACT,
    parentContractExpected: PARENT_CONTRACT,
    continentsContractExpected: CONTINENTS_CONTRACT,
    mode: "g26_parent_visible_body_first_failsafe_bridge",
    scope,
    status: state.status,
    headline: state.headline,
    message: state.message,
    routeValid: state.routeValid,
    mountTargetFound: state.mountTargetFound,
    standbyFormVisible: state.standbyFormVisible,
    runtimeImportSucceeded: state.runtimeImportSucceeded,
    runtimeContractValid: state.runtimeContractValid,
    mountCalled: state.mountCalled,
    mountAwaited: state.mountAwaited,
    parentHandoffAwaited: state.parentHandoffAwaited,
    parentEngineLoaded: state.parentEngineLoaded,
    parentEngineDelegated: state.parentEngineDelegated,
    parentContractValid: state.parentContractValid,
    parentFormVisible: state.parentFormVisible,
    continentsReceiptRead: state.continentsReceiptRead,
    continentsContractValid: state.continentsContractValid,
    formVisible: state.finalFormVisible,
    runtimeReceipt: state.runtimeReceipt,
    parentReceipt: state.parentReceipt,
    continentsReceipt: state.continentsReceipt,
    htmlChange: true,
    routeBridgeChange: true,
    runtimeRewrite: false,
    parentRewrite: false,
    continentsRewrite: false,
    motionRewrite: false,
    skyRewrite: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false,
    errors: state.errors.slice()
  };

  window.AUDRALIA_ROUTE_BRIDGE_RECEIPT = receipt;
  window.AUDRALIA_G2_6_PARENT_VISIBLE_BODY_FIRST_FAILSAFE_BRIDGE_RECEIPT = receipt;

  try {
    window.dispatchEvent(
      new CustomEvent("audralia:route-bridge:receipt", {
        detail: receipt
      })
    );
  } catch (_error) {
    try {
      window.dispatchEvent(new Event("audralia:route-bridge:receipt"));
    } catch (_ignored) {}
  }

  setRootAttributes();
}

async function bootAudraliaRouteBridge() {
  setRootAttributes();

  state.routeValid = getRoutePath() === ROUTE || getRoutePath().endsWith("/showroom/globe/audralia/");
  renderStatus();

  if (!state.routeValid) {
    setFailed("route mismatch");
    return;
  }

  const target = resolveMountTarget();
  state.mountTargetFound = Boolean(target);
  renderStatus();

  if (!target) {
    setFailed("mount target missing");
    return;
  }

  paintStandbyForm(target);
  publishBridgeReceipt("standby-painted");

  let runtimeModule;

  try {
    runtimeModule = await import(RUNTIME_IMPORT);
    state.runtimeImportSucceeded = true;
    publishBridgeReceipt("runtime-import-succeeded");
    renderStatus();
  } catch (error) {
    recordError("runtime-import", error);
    setFailed("runtime import failed");
    return;
  }

  const runtimeReceiptBeforeMount = readRuntimeReceipt();
  state.runtimeReceipt = runtimeReceiptBeforeMount;

  const runtimeMount = resolveRuntimeMount(runtimeModule);

  if (!runtimeMount) {
    setFailed("runtime mount function missing");
    return;
  }

  try {
    state.mountCalled = true;
    renderStatus();

    const result = runtimeMount.fn(target, {
      route: ROUTE,
      delegatedBy: BRIDGE_CONTRACT,
      routeBridge: true,
      parentContractExpected: PARENT_CONTRACT,
      continentsContractExpected: CONTINENTS_CONTRACT
    });

    await Promise.resolve(result);

    state.mountAwaited = true;
    state.parentHandoffAwaited = true;

    applyReceiptRead();

    publishBridgeReceipt("mount-awaited");
    renderStatus();
  } catch (error) {
    recordError("runtime-mount", error);
    setFailed("runtime mount error");
    return;
  }

  const confirmed = await waitForParentAndContinents();

  if (!confirmed) return;

  applyReceiptRead();
  setVisible();
}

if (hasDocument()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      bootAudraliaRouteBridge().catch((error) => {
        recordError("boot", error);
        setFailed("route bridge boot error");
      });
    });
  } else {
    bootAudraliaRouteBridge().catch((error) => {
      recordError("boot", error);
      setFailed("route bridge boot error");
    });
  }
}
