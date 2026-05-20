// /showroom/globe/audralia/index.js
// AUDRALIA_G2_5_ROUTE_BRIDGE_RUNTIME_CACHE_KEY_ALIGNMENT_TNT_v2_2
// Full-file replacement.
// Purpose: force the Audralia route bridge to import the repaired v3 legacy runtime shim and await the runtime/parent handoff.
// Target only: /showroom/globe/audralia/index.js
// Imports: /assets/audralia/audralia.runtime.js?v=AUDRALIA_G2_5_RUNTIME_SHIM_PARENT_DELEGATION_REPAIR_TNT_v3
// Does not own: runtime body, clean parent engine, clean runtime file, continents child, motion child, sky child, HTML shell, parent Globe, Characters, Gauges, Showroom, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_ROUTE_BRIDGE_RUNTIME_CACHE_KEY_ALIGNMENT_TNT_v2_2";
  const TARGET = "/showroom/globe/audralia/index.js";
  const ROUTE = "/showroom/globe/audralia/";
  const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
  const RUNTIME_CACHE_KEY = "AUDRALIA_G2_5_RUNTIME_SHIM_PARENT_DELEGATION_REPAIR_TNT_v3";
  const RUNTIME_IMPORT = `${RUNTIME_PATH}?v=${encodeURIComponent(RUNTIME_CACHE_KEY)}`;

  const WAIT_VISIBLE_MS = 5600;
  const POLL_MS = 50;

  const state = {
    contract: CONTRACT,
    target: TARGET,
    route: ROUTE,
    runtimePath: RUNTIME_PATH,
    runtimeImport: RUNTIME_IMPORT,
    started: false,
    routeValid: false,
    mountTargetFound: false,
    standbyPainted: false,
    runtimeImportSucceeded: false,
    engineContractValid: false,
    engineContract: "unread",
    exportType: "unread",
    method: "unread",
    mountCalled: false,
    mountAwaited: false,
    parentLoaded: false,
    parentDelegated: false,
    parentFormVisible: false,
    runtimeFormVisible: false,
    routeCanvasVisible: false,
    formVisible: false,
    fallback: false,
    acceptance: "pending",
    checks: [],
    errors: []
  };

  let mountTarget = null;
  let statusNode = null;
  let runtimeModule = null;
  let runtimeResult = null;

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function hasDocument() {
    return typeof document !== "undefined";
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function recordCheck(label, value = "") {
    const line = value ? `${label} · ${value}` : label;
    if (!state.checks.includes(line)) state.checks.push(line);
    publishReceipt();
    renderStatus();
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.errors.push({ scope, message, time: nowIso() });
    publishReceipt();
    renderStatus();
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function setRootAttrs() {
    if (!hasDocument() || !document.documentElement) return;

    const root = document.documentElement;
    root.setAttribute("data-audralia-route-bridge-contract", CONTRACT);
    root.setAttribute("data-audralia-route-bridge-target", TARGET);
    root.setAttribute("data-audralia-route-bridge-mode", "runtime-cache-key-alignment");
    root.setAttribute("data-audralia-runtime-path", RUNTIME_PATH);
    root.setAttribute("data-audralia-runtime-import", RUNTIME_IMPORT);
    root.setAttribute("data-audralia-runtime-cache-key", RUNTIME_CACHE_KEY);
    root.setAttribute("data-audralia-route-form-visible", state.formVisible ? "true" : "false");
    root.setAttribute("data-audralia-runtime-import-succeeded", state.runtimeImportSucceeded ? "true" : "false");
    root.setAttribute("data-audralia-mount-called", state.mountCalled ? "true" : "false");
    root.setAttribute("data-audralia-mount-awaited", state.mountAwaited ? "true" : "false");
    root.setAttribute("data-audralia-fallback", state.fallback ? "true" : "false");
  }

  function publishReceipt() {
    if (!hasWindow()) return;

    const receipt = {
      contract: CONTRACT,
      target: TARGET,
      route: ROUTE,
      mode: "route_bridge_runtime_cache_key_alignment",
      runtimePath: RUNTIME_PATH,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      runtimeImport: RUNTIME_IMPORT,
      routeBridgeChange: true,
      runtimeRewrite: false,
      cleanRuntimeRewrite: false,
      parentRewrite: false,
      childContractRenewal: false,
      htmlChange: false,
      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      state: { ...state },
      checks: state.checks.slice(),
      errors: state.errors.slice()
    };

    window.AUDRALIA_ROUTE_BRIDGE_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CANVAS_ROUTE_BRIDGE_RECEIPT = receipt;
    window.AUDRALIA_ROUTE_BRIDGE_AWAITED_RUNTIME_HANDOFF = true;
    window.AUDRALIA_ROUTE_BRIDGE_RUNTIME_CACHE_KEY_ALIGNED = true;

    setRootAttrs();

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

  function normalizeMountTarget(target) {
    if (!isElement(target)) return null;

    target.setAttribute("data-audralia-mount-target", "true");
    target.setAttribute("data-audralia-route-bridge-contract", CONTRACT);

    if (!target.style.position) target.style.position = "relative";
    if (!target.style.minHeight) target.style.minHeight = "360px";

    return target;
  }

  function ensureStatusNode(target) {
    if (!hasDocument()) return null;

    const existing =
      document.querySelector("[data-audralia-route-status='true']") ||
      document.querySelector("#audraliaRouteStatus") ||
      null;

    if (existing) {
      existing.setAttribute("data-audralia-route-status", "true");
      return existing;
    }

    if (!isElement(target)) return null;

    const node = document.createElement("section");
    node.id = "audraliaRouteStatus";
    node.setAttribute("data-audralia-route-status", "true");
    node.setAttribute("aria-live", "polite");
    node.style.marginTop = "1rem";
    node.style.padding = "0.9rem";
    node.style.border = "1px solid rgba(180, 235, 255, 0.26)";
    node.style.borderRadius = "1rem";
    node.style.background = "rgba(4, 12, 30, 0.72)";
    node.style.color = "rgba(238, 250, 255, 0.94)";
    node.style.font = "500 0.9rem/1.45 system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

    target.insertAdjacentElement("afterend", node);

    return node;
  }

  function renderStatus() {
    if (!statusNode) return;

    const title = state.formVisible
      ? "Clean-canvas handoff visible"
      : state.standbyPainted
        ? "Clean-canvas handoff pending"
        : "Clean-canvas handoff starting";

    const statusLine = state.formVisible
      ? "FORM_VISIBLE · awaited runtime handoff confirmed"
      : state.standbyPainted
        ? "STANDBY_FORM_VISIBLE · awaiting parent confirmation"
        : "FORM_PENDING · route bridge active";

    const checks = state.checks.map((check) => `<li>${escapeHtml(check)}</li>`).join("");

    const errors = state.errors.length
      ? `<p style="margin:0.65rem 0 0;color:rgba(255,210,180,0.95)">Held checks: ${escapeHtml(
          state.errors.map((error) => `${error.scope}: ${error.message}`).join(" | ")
        )}</p>`
      : "";

    statusNode.innerHTML = `
      <strong style="display:block;margin-bottom:0.35rem">${escapeHtml(title)}</strong>
      <span style="display:block;margin-bottom:0.45rem">${escapeHtml(statusLine)}</span>
      <ul style="margin:0;padding-left:1.2rem">${checks}</ul>
      ${errors}
      <small style="display:block;margin-top:0.65rem;opacity:0.72">${escapeHtml(CONTRACT)}</small>
    `;
  }

  function paintStandbyForm(target) {
    if (!hasDocument() || !isElement(target)) return false;

    target.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.setAttribute("data-audralia-route-standby-canvas", "true");
    canvas.setAttribute("data-contract", CONTRACT);
    canvas.setAttribute("aria-label", "Audralia clean-canvas standby form");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.minHeight = "360px";
    canvas.style.borderRadius = "24px";
    canvas.style.touchAction = "none";

    target.appendChild(canvas);

    const rect = target.getBoundingClientRect();
    const cssWidth = Math.max(320, Math.floor(rect.width || target.clientWidth || 760));
    const cssHeight = Math.max(360, Math.floor(rect.height || target.clientHeight || 520));
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return false;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.36;

    ctx.clearRect(0, 0, w, h);

    const space = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 2.2);
    space.addColorStop(0, "rgba(13, 44, 72, 0.98)");
    space.addColorStop(0.55, "rgba(5, 17, 41, 1)");
    space.addColorStop(1, "rgba(1, 4, 16, 1)");
    ctx.fillStyle = space;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.36, r * 0.1, cx, cy, r);
    ocean.addColorStop(0, "rgba(105, 224, 255, 0.98)");
    ocean.addColorStop(0.24, "rgba(35, 148, 194, 0.98)");
    ocean.addColorStop(0.62, "rgba(12, 65, 122, 1)");
    ocean.addColorStop(1, "rgba(3, 15, 42, 1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.fillStyle = "rgba(80, 158, 106, 0.76)";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.24, cy - r * 0.08, r * 0.28, r * 0.53, -0.36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(166, 132, 82, 0.62)";
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.28, cy + r * 0.03, r * 0.22, r * 0.39, 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(230, 244, 255, 0.78)";
    ctx.beginPath();
    ctx.ellipse(cx, cy - r * 0.72, r * 0.42, r * 0.11, 0.02, 0, Math.PI * 2);
    ctx.fill();

    const shade = ctx.createRadialGradient(
      cx - r * 0.34,
      cy - r * 0.34,
      r * 0.16,
      cx + r * 0.28,
      cy + r * 0.18,
      r * 1.18
    );
    shade.addColorStop(0, "rgba(255,255,255,0.18)");
    shade.addColorStop(0.55, "rgba(255,255,255,0.00)");
    shade.addColorStop(1, "rgba(0,0,0,0.54)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(190, 238, 255, 0.42)";
    ctx.lineWidth = Math.max(1, dpr * 1.2);
    ctx.stroke();

    state.standbyPainted = true;
    window.AUDRALIA_ROUTE_STANDBY_FORM_VISIBLE = true;
    recordCheck("STANDBY_FORM_VISIBLE", "route bridge painted immediate form");

    return true;
  }

  async function importRuntime() {
    try {
      runtimeModule = await import(RUNTIME_IMPORT);
    } catch (firstError) {
      recordError("runtime import cache-key", firstError);
      runtimeModule = await import(RUNTIME_PATH);
    }

    state.runtimeImportSucceeded = true;
    recordCheck("CLEAN_CANVAS_IMPORT_SUCCEEDED", RUNTIME_PATH);

    return runtimeModule;
  }

  function normalizeRuntimeCallable(mod) {
    if (!mod || typeof mod !== "object") return null;

    const candidates = [
      { source: "default", value: mod.default },
      { source: "named-mount", value: mod.mount },
      { source: "named-boot", value: mod.boot },
      { source: "named-start", value: mod.start },
      { source: "api", value: mod.api }
    ];

    for (const candidate of candidates) {
      const value = candidate.value;

      if (typeof value === "function") {
        state.exportType = candidate.source;
        state.method = "function-export";
        state.engineContract = mod.CONTRACT || value.CONTRACT || "default";
        state.engineContractValid = true;
        recordCheck("ENGINE_CONTRACT_VALID", state.engineContract);
        return value;
      }

      if (value && typeof value === "object") {
        const method =
          value.mount ||
          value.boot ||
          value.start ||
          value.init ||
          value.create ||
          value.default;

        if (typeof method === "function") {
          state.exportType = candidate.source;
          state.method = "object-method";
          state.engineContract = value.CONTRACT || mod.CONTRACT || "object";
          state.engineContractValid = true;
          recordCheck("ENGINE_CONTRACT_VALID", state.engineContract);
          return method.bind(value);
        }
      }
    }

    return null;
  }

  async function callRuntime(callable, target) {
    state.mountCalled = true;
    recordCheck("MOUNT_CALLED", `${state.method} export=${state.exportType}`);

    const options = {
      routeBridgeContract: CONTRACT,
      awaitedRuntimeHandoff: true,
      runtimeCacheKey: RUNTIME_CACHE_KEY,
      mountTarget: "#audraliaCanvasMount",
      route: ROUTE
    };

    runtimeResult = callable(target, options);

    if (runtimeResult && typeof runtimeResult.then === "function") {
      runtimeResult = await runtimeResult;
    }

    state.mountAwaited = true;
    recordCheck("MOUNT_AWAITED", "Promise.resolve runtime result");

    return runtimeResult;
  }

  function readStatusObject(value) {
    if (!value) return null;

    if (typeof value.getStatus === "function") {
      try {
        return value.getStatus();
      } catch (_error) {
        return null;
      }
    }

    if (typeof value.status === "function") {
      try {
        return value.status();
      } catch (_error) {
        return null;
      }
    }

    if (typeof value === "object") return value;

    return null;
  }

  function readGlobalStatus() {
    const runtimeReceipt =
      window.AUDRALIA_RUNTIME_SHIM_RECEIPT ||
      window.AUDRALIA_RUNTIME_RECEIPT ||
      window.AUDRALIA_CLEAN_CANVAS_RUNTIME_RECEIPT ||
      null;

    const parentReceipt =
      window.AUDRALIA_CLEAN_CANVAS_RECEIPT ||
      window.AUDRALIA_ENGINE_RECEIPT ||
      null;

    const cleanRuntimeReceipt =
      window.AUDRALIA_CLEAN_RUNTIME_RECEIPT ||
      window.AUDRALIA_CLEAN_RUNTIME_SHIM_RECEIPT ||
      null;

    const parentEngine =
      window.AUDRALIA_CLEAN_CANVAS_AUTHORITY ||
      window.AUDRALIA_CLEAN_CANVAS_ENGINE ||
      window.AUDRALIA_ENGINE ||
      null;

    const parentStatus = readStatusObject(parentEngine);
    const runtimeResultStatus = readStatusObject(runtimeResult);

    return {
      runtimeReceipt,
      cleanRuntimeReceipt,
      parentReceipt,
      parentEngine,
      parentStatus,
      runtimeResultStatus
    };
  }

  function syncVisibleState() {
    const global = readGlobalStatus();

    const runtimeFormVisible = Boolean(
      (global.runtimeReceipt && global.runtimeReceipt.formVisible === true) ||
        (global.runtimeReceipt &&
          global.runtimeReceipt.state &&
          global.runtimeReceipt.state.formVisible === true) ||
        (global.runtimeResultStatus && global.runtimeResultStatus.formVisible === true)
    );

    const parentFormVisible = Boolean(
      (global.parentReceipt && global.parentReceipt.formVisible === true) ||
        (global.parentReceipt &&
          global.parentReceipt.status &&
          global.parentReceipt.status.formVisible === true) ||
        (global.parentStatus && global.parentStatus.formVisible === true) ||
        window.AUDRALIA_FORM_VISIBLE === true ||
        window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE === true
    );

    const parentLoaded = Boolean(
      global.parentEngine ||
        window.AUDRALIA_PARENT_ENGINE_LOADED === true ||
        (global.runtimeReceipt && global.runtimeReceipt.parentLoaded === true) ||
        (global.runtimeReceipt &&
          global.runtimeReceipt.state &&
          global.runtimeReceipt.state.parentLoaded === true)
    );

    const parentDelegated = Boolean(
      window.AUDRALIA_PARENT_ENGINE_DELEGATED === true ||
        (global.runtimeReceipt && global.runtimeReceipt.parentDelegated === true) ||
        (global.runtimeReceipt &&
          global.runtimeReceipt.state &&
          global.runtimeReceipt.state.parentDelegated === true) ||
        (global.parentStatus && global.parentStatus.mounted === true)
    );

    const canvas = mountTarget ? mountTarget.querySelector("canvas") : null;
    const canvasVisible = Boolean(canvas && canvas.width > 0 && canvas.height > 0);

    state.runtimeFormVisible = runtimeFormVisible;
    state.parentFormVisible = parentFormVisible;
    state.parentLoaded = parentLoaded;
    state.parentDelegated = parentDelegated;
    state.routeCanvasVisible = canvasVisible;

    if (parentLoaded) recordCheck("PARENT_ENGINE_LOADED", "true");
    if (parentDelegated) recordCheck("PARENT_ENGINE_DELEGATED", "true");

    if (runtimeFormVisible || parentFormVisible) {
      state.formVisible = true;
      state.fallback = false;
      state.acceptance = parentFormVisible ? "parent-confirmed" : "runtime-confirmed";
      window.AUDRALIA_ROUTE_BRIDGE_FORM_VISIBLE_CONFIRMED = true;
      recordCheck("FORM_VISIBLE", state.acceptance);
    }

    publishReceipt();

    return state.formVisible;
  }

  async function waitForVisible(timeoutMs = WAIT_VISIBLE_MS) {
    const start = Date.now();

    while (Date.now() - start <= timeoutMs) {
      if (syncVisibleState()) return true;

      const global = readGlobalStatus();

      if (global.parentEngine) {
        try {
          if (typeof global.parentEngine.requestRender === "function") {
            global.parentEngine.requestRender();
          } else if (typeof global.parentEngine.render === "function") {
            global.parentEngine.render();
          }
        } catch (_error) {}
      }

      await sleep(POLL_MS);
    }

    syncVisibleState();

    if (state.routeCanvasVisible || state.standbyPainted) {
      state.acceptance = "standby-visible-parent-pending";
      state.formVisible = true;
      state.fallback = false;
      window.AUDRALIA_ROUTE_BRIDGE_FORM_VISIBLE_CONFIRMED = true;
      recordCheck("FORM_VISIBLE", "standby-visible-parent-pending");
      publishReceipt();
      return true;
    }

    state.fallback = true;
    state.acceptance = "diagnostic-fallback";
    recordCheck("FORM_VISIBLE_DIAGNOSTIC_FALLBACK", "awaited handoff failed visibly");
    publishReceipt();
    return false;
  }

  async function boot() {
    state.started = true;
    state.routeValid =
      window.location.pathname === ROUTE ||
      window.location.pathname === ROUTE.replace(/\/$/, "");

    recordCheck("ROUTE_VALID", ROUTE);

    mountTarget = normalizeMountTarget(resolveMountTarget());

    if (!mountTarget) {
      state.mountTargetFound = false;
      recordError("mount target", "No Audralia clean-canvas mount target was found.");
      publishReceipt();
      renderStatus();
      return;
    }

    state.mountTargetFound = true;
    recordCheck("MOUNT_TARGET_FOUND");

    statusNode = ensureStatusNode(mountTarget);
    paintStandbyForm(mountTarget);
    renderStatus();

    const mod = await importRuntime();
    const callable = normalizeRuntimeCallable(mod);

    if (!callable) {
      recordError("runtime contract", "Runtime module imported but no callable default/mount export was found.");
      state.fallback = true;
      publishReceipt();
      renderStatus();
      return;
    }

    await callRuntime(callable, mountTarget);

    recordCheck("PARENT_HANDOFF_AWAITED", "runtime call resolved");

    await waitForVisible(WAIT_VISIBLE_MS);

    publishReceipt();
    renderStatus();
  }

  publishReceipt();

  if (hasDocument()) {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          boot().catch((error) => recordError("boot", error));
        },
        { once: true }
      );
    } else {
      boot().catch((error) => recordError("boot", error));
    }
  }
})();
