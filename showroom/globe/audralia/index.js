// /showroom/globe/audralia/index.js
// AUDRALIA_CLEAN_CANVAS_FORM_MOUNT_ROUTE_BRIDGE_JS_TNT_v1_1
// Full-file replacement.
// Route bridge only.
// Objective: Audralia route must mount visible form or show exact failed handoff.
// Correction: mount context is passed as an argument, not only as `this`.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_FORM_MOUNT_ROUTE_BRIDGE_JS_TNT_v1_1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_FORM_MOUNT_ROUTE_BRIDGE_JS_RECEIPT_v1_1";
  const HTML_CONTRACT = "AUDRALIA_CLEAN_CANVAS_FORM_MOUNT_ROUTE_BRIDGE_HTML_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-form-mount-route-bridge-js-v1-1";
  const ROUTE = "/showroom/globe/audralia/";

  const IMPORT_CANDIDATES = Object.freeze([
    "/assets/audralia/clean/audralia.clean.canvas.js",
    "/assets/audralia/clean/audralia.canvas.js",
    "/assets/audralia/clean/audralia.engine.js",
    "/assets/audralia/audralia.clean.canvas.js",
    "/assets/audralia/audralia.canvas.js",
    "/assets/audralia/audralia.engine.js",
    "/assets/audralia/audralia.clean.engine.js",
    "/assets/audralia/audralia.clean.canvas.engine.js",
    "/assets/audralia/audralia.runtime.js"
  ]);

  const EXPORT_CANDIDATES = Object.freeze([
    "AUDRALIA_CLEAN_CANVAS_AUTHORITY",
    "AUDRALIA_CLEAN_CANVAS_ENGINE",
    "AUDRALIA_CANVAS_AUTHORITY",
    "AUDRALIA_CANVAS_ENGINE",
    "AUDRALIA_ENGINE",
    "AudraliaCleanCanvasAuthority",
    "AudraliaCleanCanvasEngine",
    "AudraliaCanvasAuthority",
    "AudraliaCanvasEngine",
    "AudraliaEngine",
    "audraliaCleanCanvasAuthority",
    "audraliaCleanCanvasEngine",
    "audraliaCanvasAuthority",
    "audraliaCanvasEngine",
    "audraliaEngine",
    "createAudraliaCleanCanvas",
    "mountAudraliaCleanCanvas",
    "renderAudraliaCleanCanvas",
    "createAudraliaCanvas",
    "mountAudraliaCanvas",
    "renderAudraliaCanvas",
    "mountAudralia",
    "renderAudralia",
    "createAudralia",
    "default"
  ]);

  const METHOD_CANDIDATES = Object.freeze([
    "mount",
    "render",
    "start",
    "boot",
    "init",
    "create"
  ]);

  const state = {
    booted: false,
    routeValid: false,
    importPath: null,
    importMode: null,
    importError: null,
    module: null,
    engineExportName: null,
    engine: null,
    methodName: null,
    mountResult: null,
    fallbackVisible: false,
    receipt: null,
    steps: []
  };

  function doc() {
    return typeof document !== "undefined" ? document : null;
  }

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function qs(selector) {
    return doc()?.querySelector(selector) || null;
  }

  function qsa(selector) {
    return Array.from(doc()?.querySelectorAll(selector) || []);
  }

  function byId(id) {
    return doc()?.getElementById(id) || null;
  }

  function now() {
    return new Date().toISOString();
  }

  function setDataset(key, value) {
    if (!doc()?.documentElement?.dataset) return;
    try {
      doc().documentElement.dataset[key] = String(value);
    } catch {
      // metadata only
    }
  }

  function statusNode() {
    return byId("audralia-route-status") || qs("[data-audralia-route-status]");
  }

  function mountNode() {
    return byId("audralia-clean-canvas-mount") || qs("[data-audralia-clean-canvas-mount]");
  }

  function receiptNode() {
    return byId("route-receipt") || qs("[data-route-receipt]");
  }

  function stepNode(key) {
    return qs(`[data-audralia-step="${key}"]`);
  }

  function updateStatus(message, tone = "run") {
    const node = statusNode();
    if (!node) return;
    node.textContent = message;
    node.dataset.state = tone;
  }

  function updateStep(key, message, tone = "run") {
    const node = stepNode(key);
    if (!node) return;
    node.textContent = message;
    node.dataset.state = tone;
  }

  function appendReceipt(message) {
    const node = receiptNode();
    if (!node) return;
    const current = String(node.textContent || "").trim();
    node.textContent = `${current}\n${message}`.trim();
  }

  function logStep(code, detail = "") {
    const line = `${now()} · ${code}${detail ? ` · ${detail}` : ""}`;
    state.steps.push(line);
    appendReceipt(line);
    return line;
  }

  function normalizeRoute(pathname) {
    const raw = String(pathname || "");
    return raw.endsWith("/") ? raw : `${raw}/`;
  }

  function clearMountPlaceholder(mount) {
    qsa("[data-audralia-placeholder]").forEach((node) => node.remove());
    if (mount) mount.dataset.audraliaFormVisible = "false";
  }

  function hasVisibleForm(mount) {
    if (!mount) return false;

    const generated = mount.querySelector(
      [
        "canvas",
        "svg",
        "[data-audralia-engine-render]",
        "[data-audralia-clean-canvas-render]",
        "[data-audralia-canvas-render]",
        "[data-audralia-form]",
        "[data-audralia-diagnostic-form]"
      ].join(",")
    );

    if (!generated) return false;

    const rect = generated.getBoundingClientRect?.();
    if (!rect) return true;

    return rect.width > 10 && rect.height > 10;
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function findExport(moduleObject) {
    for (const name of EXPORT_CANDIDATES) {
      if (moduleObject && moduleObject[name]) {
        return { name, value: moduleObject[name], source: "module" };
      }
    }

    for (const name of EXPORT_CANDIDATES) {
      if (win()[name]) {
        return { name, value: win()[name], source: "window" };
      }
    }

    return null;
  }

  function findMountMethod(engine) {
    if (!engine) return null;

    if (typeof engine === "function") {
      return {
        name: "function-export",
        owner: null,
        fn: engine,
        type: "function"
      };
    }

    for (const name of METHOD_CANDIDATES) {
      if (typeof engine[name] === "function") {
        return {
          name,
          owner: engine,
          fn: engine[name],
          type: "method"
        };
      }
    }

    return null;
  }

  function loadClassicScript(path) {
    return new Promise((resolve, reject) => {
      const existing = qsa("script[src]").find((script) => {
        const src = String(script.getAttribute("src") || "");
        return src.startsWith(path);
      });

      if (existing) {
        resolve(existing);
        return;
      }

      const script = doc().createElement("script");
      script.src = `${path}?v=${encodeURIComponent(VERSION)}`;
      script.async = true;
      script.dataset.audraliaClassicLoad = "true";
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Classic script load failed: ${path}`));
      doc().head.appendChild(script);
    });
  }

  async function attemptImportAndResolveExport() {
    const failures = [];

    for (const path of IMPORT_CANDIDATES) {
      updateStatus(`CLEAN_CANVAS_IMPORT_STARTED · ${path}`, "run");
      updateStep("import", `IMPORT_TRY · ${path}`, "run");
      logStep("CLEAN_CANVAS_IMPORT_STARTED", path);

      try {
        const moduleObject = await import(`${path}?v=${encodeURIComponent(VERSION)}`);
        const exported = findExport(moduleObject);

        if (exported) {
          state.importPath = path;
          state.importMode = "module";
          state.module = moduleObject;
          state.engineExportName = exported.name;
          state.engine = exported.value;

          updateStep("import", `CLEAN_CANVAS_IMPORT_SUCCEEDED · ${path}`, "pass");
          updateStep("contract", `ENGINE_CONTRACT_VALID · ${exported.name}`, "pass");
          logStep("CLEAN_CANVAS_IMPORT_SUCCEEDED", path);
          logStep("ENGINE_CONTRACT_VALID", `${exported.name} from ${exported.source}`);

          return exported;
        }

        failures.push(`${path} :: module loaded but no accepted export`);
        logStep("ENGINE_EXPORT_MISSING_AFTER_MODULE_IMPORT", path);
      } catch (error) {
        const message = error?.message || String(error);
        failures.push(`${path} :: module import failed :: ${message}`);
        logStep("CLEAN_CANVAS_MODULE_IMPORT_FAILED", `${path} :: ${message}`);
      }

      try {
        updateStatus(`CLASSIC_SCRIPT_LOAD_STARTED · ${path}`, "run");
        await loadClassicScript(path);
        await wait(25);

        const exported = findExport(null);

        if (exported) {
          state.importPath = path;
          state.importMode = "classic-script";
          state.engineExportName = exported.name;
          state.engine = exported.value;

          updateStep("import", `CLASSIC_SCRIPT_LOAD_SUCCEEDED · ${path}`, "pass");
          updateStep("contract", `ENGINE_CONTRACT_VALID · ${exported.name}`, "pass");
          logStep("CLASSIC_SCRIPT_LOAD_SUCCEEDED", path);
          logStep("ENGINE_CONTRACT_VALID", `${exported.name} from ${exported.source}`);

          return exported;
        }

        failures.push(`${path} :: classic script loaded but no accepted global export`);
        logStep("ENGINE_EXPORT_MISSING_AFTER_CLASSIC_LOAD", path);
      } catch (error) {
        const message = error?.message || String(error);
        failures.push(`${path} :: classic script load failed :: ${message}`);
        logStep("CLEAN_CANVAS_CLASSIC_LOAD_FAILED", `${path} :: ${message}`);
      }
    }

    state.importError = failures.join(" | ");
    updateStep("import", "CLEAN_CANVAS_IMPORT_FAILED · all candidate paths failed", "fail");
    updateStep("contract", "ENGINE_CONTRACT_FAILED · no accepted export", "fail");
    throw new Error(state.importError || "All clean-canvas import candidates failed.");
  }

  function appendReturnedRender(result, mount) {
    if (!result || !mount) return;

    const ElementCtor = win().Element;

    const appendIfElement = (node) => {
      if (ElementCtor && node instanceof ElementCtor && !mount.contains(node)) {
        mount.appendChild(node);
      }
    };

    appendIfElement(result);

    if (Array.isArray(result)) {
      result.forEach(appendIfElement);
    }

    appendIfElement(result.element);
    appendIfElement(result.el);
    appendIfElement(result.node);
    appendIfElement(result.root);
    appendIfElement(result.canvas);
    appendIfElement(result.svg);
  }

  async function executeMount(engine, mount) {
    const method = findMountMethod(engine);

    if (!method) {
      updateStep("call", "MOUNT_METHOD_MISSING", "fail");
      logStep("MOUNT_METHOD_MISSING", METHOD_CANDIDATES.join(","));
      throw new Error(`No mount method found. Checked: ${METHOD_CANDIDATES.join(", ")}`);
    }

    state.methodName = method.name;
    updateStep("call", `MOUNT_CALLED · ${method.name}`, "run");
    logStep("MOUNT_CALLED", method.name);

    const context = {
      route: ROUTE,
      contract: CONTRACT,
      receipt: RECEIPT,
      mount,
      mountTarget: mount,
      statusTarget: statusNode(),
      document: doc(),
      window: win(),
      visibleFailureRequired: true
    };

    let result;

    try {
      if (method.type === "function") {
        result = await method.fn(context);
      } else {
        result = await method.fn.call(method.owner, context);
      }

      state.mountResult = result;
      appendReturnedRender(result, mount);
      await wait(75);

      if (hasVisibleForm(mount)) {
        logStep("MOUNT_SIGNATURE_ACCEPTED", "context");
        return result;
      }
    } catch (error) {
      logStep("MOUNT_CONTEXT_SIGNATURE_FAILED", error?.message || String(error));
    }

    try {
      if (method.type === "function") {
        result = await method.fn(mount, context);
      } else {
        result = await method.fn.call(method.owner, mount, context);
      }

      state.mountResult = result;
      appendReturnedRender(result, mount);
      await wait(75);

      if (hasVisibleForm(mount)) {
        logStep("MOUNT_SIGNATURE_ACCEPTED", "mount_context");
        return result;
      }
    } catch (error) {
      logStep("MOUNT_MOUNT_CONTEXT_SIGNATURE_FAILED", error?.message || String(error));
      throw error;
    }

    logStep("MOUNT_RETURNED_WITHOUT_VISIBLE_FORM", method.name);
    return result;
  }

  function renderDiagnosticFallback(mount, reason) {
    clearMountPlaceholder(mount);

    const root = doc().createElement("section");
    root.setAttribute("data-audralia-diagnostic-form", "true");
    root.setAttribute("aria-label", "Audralia diagnostic fallback form");
    root.style.cssText = `
      width:min(78vw,26rem);
      aspect-ratio:1;
      position:relative;
      display:grid;
      place-items:center;
      border-radius:50%;
      background:
        radial-gradient(circle at 38% 24%, rgba(255,255,255,.34), transparent 0 10%),
        radial-gradient(circle at 42% 38%, rgba(143,240,195,.72), transparent 0 23%),
        radial-gradient(circle at 62% 54%, rgba(36,120,255,.34), transparent 0 34%),
        radial-gradient(circle at 50% 50%, rgba(9,88,72,.94), rgba(5,22,36,.98) 62%, rgba(1,5,14,.98) 100%);
      box-shadow:
        inset -2.2rem -1.8rem 3.2rem rgba(0,0,0,.48),
        inset .9rem .6rem 1.6rem rgba(255,255,255,.16),
        0 0 3rem rgba(143,240,195,.20),
        0 1.8rem 3rem rgba(0,0,0,.42);
      overflow:hidden;
    `;

    const bands = doc().createElement("div");
    bands.setAttribute("aria-hidden", "true");
    bands.style.cssText = `
      position:absolute;
      inset:0;
      border-radius:50%;
      background:
        linear-gradient(22deg, transparent 0 23%, rgba(243,200,111,.22) 24% 28%, transparent 29% 100%),
        linear-gradient(-18deg, transparent 0 42%, rgba(143,240,195,.18) 43% 48%, transparent 49% 100%),
        radial-gradient(ellipse at 48% 62%, rgba(243,200,111,.26), transparent 0 20%),
        radial-gradient(ellipse at 66% 34%, rgba(8,45,66,.52), transparent 0 26%);
      opacity:.82;
      mix-blend-mode:screen;
    `;

    const label = doc().createElement("div");
    label.style.cssText = `
      position:absolute;
      left:50%;
      bottom:7%;
      transform:translateX(-50%);
      width:min(88%,24rem);
      padding:.75rem .85rem;
      border:1px solid rgba(243,200,111,.22);
      border-radius:1rem;
      background:rgba(1,7,16,.74);
      color:rgba(255,244,216,.92);
      font:800 .72rem/1.35 ui-sans-serif,system-ui,sans-serif;
      letter-spacing:.06em;
      text-align:center;
      text-transform:uppercase;
      backdrop-filter:blur(8px);
    `;
    label.textContent = "Diagnostic fallback form · downstream engine handoff failed";

    const detail = doc().createElement("p");
    detail.style.cssText = `
      position:absolute;
      left:50%;
      top:7%;
      transform:translateX(-50%);
      width:min(88%,24rem);
      margin:0;
      padding:.72rem .85rem;
      border:1px solid rgba(255,143,159,.22);
      border-radius:1rem;
      background:rgba(1,7,16,.70);
      color:rgba(255,220,224,.92);
      font:750 .68rem/1.35 ui-sans-serif,system-ui,sans-serif;
      text-align:center;
      backdrop-filter:blur(8px);
    `;
    detail.textContent = String(reason || "Unknown downstream handoff failure.");

    root.appendChild(bands);
    root.appendChild(detail);
    root.appendChild(label);

    mount.appendChild(root);
    mount.dataset.audraliaFormVisible = "fallback";
    state.fallbackVisible = true;

    updateStep("visible", "DIAGNOSTIC_FALLBACK_FORM_VISIBLE", "fail");
    updateStatus("FORM_VISIBLE_DIAGNOSTIC_FALLBACK · downstream handoff failed visibly", "fail");
    logStep("DIAGNOSTIC_FALLBACK_FORM_VISIBLE", reason);

    return root;
  }

  function buildReceipt(valid) {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlContract: HTML_CONTRACT,
      version: VERSION,
      route: ROUTE,
      checkedAt: now(),
      valid,
      routeValid: state.routeValid,
      importPath: state.importPath,
      importMode: state.importMode,
      importError: state.importError,
      engineExportName: state.engineExportName,
      methodName: state.methodName,
      fallbackVisible: state.fallbackVisible,
      steps: Object.freeze([...state.steps]),
      ownsRouteBridge: true,
      ownsPlanetTruth: false,
      ownsTerrainTruth: false,
      ownsRuntimeInternals: false,
      ownsControlsInternals: false,
      ownsParentGlobeNarrative: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function publishReceipt(receipt) {
    state.receipt = receipt;

    win().AUDRALIA_CLEAN_CANVAS_FORM_MOUNT_ROUTE_BRIDGE = API;
    win().AUDRALIA_CLEAN_CANVAS_FORM_MOUNT_ROUTE_BRIDGE_RECEIPT = receipt;

    setDataset("audraliaRouteBridgeLoaded", "true");
    setDataset("audraliaRouteBridgeContract", CONTRACT);
    setDataset("audraliaRouteBridgeReceipt", RECEIPT);
    setDataset("audraliaRouteBridgeVersion", VERSION);
    setDataset("audraliaRouteBridgeValid", receipt.valid ? "true" : "false");
    setDataset("audraliaRouteBridgeImportPath", receipt.importPath || "none");
    setDataset("audraliaRouteBridgeImportMode", receipt.importMode || "none");
    setDataset("audraliaRouteBridgeEngineExportName", receipt.engineExportName || "none");
    setDataset("audraliaRouteBridgeMethodName", receipt.methodName || "none");
    setDataset("audraliaRouteBridgeFallbackVisible", receipt.fallbackVisible ? "true" : "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("visualPassClaimed", "false");

    appendReceipt(`${CONTRACT} valid=${receipt.valid}`);
    return receipt;
  }

  async function boot() {
    if (state.booted) return state.receipt;
    state.booted = true;

    updateStatus("BOOT_STARTED · Audralia route bridge executing.", "run");
    logStep("BOOT_STARTED", CONTRACT);

    const html = doc()?.documentElement;
    const mount = mountNode();

    state.routeValid =
      normalizeRoute(win().location?.pathname || html?.dataset?.route) === ROUTE ||
      html?.dataset?.route === ROUTE;

    if (!state.routeValid) {
      updateStep("route", "ROUTE_FAILED", "fail");
      updateStatus("ROUTE_FAILED · expected /showroom/globe/audralia/", "fail");
      logStep("ROUTE_FAILED", win().location?.pathname || "unknown");
      return publishReceipt(buildReceipt(false));
    }

    updateStep("route", "ROUTE_VALID · /showroom/globe/audralia/", "pass");
    logStep("ROUTE_VALID", ROUTE);

    if (html?.dataset?.contract !== HTML_CONTRACT) {
      logStep("HTML_CONTRACT_HELD", `expected=${HTML_CONTRACT} actual=${html?.dataset?.contract || "missing"}`);
    } else {
      logStep("HTML_CONTRACT_VALID", HTML_CONTRACT);
    }

    if (!mount) {
      updateStep("mount", "MOUNT_TARGET_MISSING", "fail");
      updateStatus("MOUNT_TARGET_MISSING · data-audralia-clean-canvas-mount not found.", "fail");
      logStep("MOUNT_TARGET_MISSING", "data-audralia-clean-canvas-mount");
      return publishReceipt(buildReceipt(false));
    }

    updateStep("mount", "MOUNT_TARGET_FOUND", "pass");
    logStep("MOUNT_TARGET_FOUND", "data-audralia-clean-canvas-mount");

    try {
      clearMountPlaceholder(mount);

      const exported = await attemptImportAndResolveExport();

      state.engineExportName = exported.name;
      state.engine = exported.value;

      await executeMount(exported.value, mount);
      await wait(100);

      const visible = hasVisibleForm(mount);

      if (!visible) {
        updateStep("visible", "FORM_NOT_VISIBLE_AFTER_MOUNT", "fail");
        logStep("FORM_NOT_VISIBLE_AFTER_MOUNT", state.methodName || "unknown_method");
        renderDiagnosticFallback(
          mount,
          `Mount executed but no visible form appeared. method=${state.methodName || "unknown"} export=${state.engineExportName || "unknown"}`
        );
        return publishReceipt(buildReceipt(false));
      }

      mount.dataset.audraliaFormVisible = "true";
      updateStep("visible", "FORM_VISIBLE", "pass");
      updateStatus("FORM_VISIBLE · Audralia clean-canvas route bridge mounted visible form.", "pass");
      logStep("FORM_VISIBLE", `${state.importPath || "unknown_import"} · ${state.engineExportName || "unknown_export"}`);

      return publishReceipt(buildReceipt(true));
    } catch (error) {
      const message = error?.message || String(error);

      state.importError = state.importError || message;

      if (mount) {
        renderDiagnosticFallback(mount, message);
      }

      logStep("ROUTE_BRIDGE_FAILED_VISIBLY", message);

      return publishReceipt(buildReceipt(false));
    }
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlContract: HTML_CONTRACT,
      version: VERSION,
      route: ROUTE,
      importCandidates: IMPORT_CANDIDATES,
      exportCandidates: EXPORT_CANDIDATES,
      methodCandidates: METHOD_CANDIDATES,
      booted: state.booted,
      lastReceipt: state.receipt,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    htmlContract: HTML_CONTRACT,
    version: VERSION,
    route: ROUTE,
    importCandidates: IMPORT_CANDIDATES,
    exportCandidates: EXPORT_CANDIDATES,
    methodCandidates: METHOD_CANDIDATES,
    boot,
    getStatus
  });

  win().AUDRALIA_CLEAN_CANVAS_FORM_MOUNT_ROUTE_BRIDGE = API;

  if (doc()?.readyState === "loading") {
    doc().addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
