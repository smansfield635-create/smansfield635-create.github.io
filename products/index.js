(() => {
  "use strict";

  const HOST_META = Object.freeze({
    name: "PRODUCTS_HOST_BOOTSTRAP",
    version: "V2",
    contract: "PRODUCTS_HOST_CONTRACT_V1",
    stageOwner: "runtime-only",
    runtimeGlobal: "ProductsPlanetRuntime",
    runtimeScript: "./products_runtime.js",
  });

  const doc = document;

  function byId(id) {
    return doc.getElementById(id);
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return "time-unavailable";
    }
  }

  function createReceiptLine(level, text) {
    const row = doc.createElement("div");
    row.className = "products-receipt-line";

    const dot = doc.createElement("span");
    dot.className = `products-dot ${level}`;
    dot.setAttribute("aria-hidden", "true");

    const body = doc.createElement("div");
    body.textContent = text;

    row.appendChild(dot);
    row.appendChild(body);
    return row;
  }

  const ui = {
    host: null,
    stage: null,
    receipts: null,
    receiptStatus: null,
    fallback: null,
    fallbackText: null,
  };

  const state = {
    lines: [],
    failed: false,
    mounted: false,
  };

  function syncStatusLabel() {
    if (!ui.receiptStatus) return;

    if (state.failed) {
      ui.receiptStatus.textContent = "Fault surfaced";
      return;
    }

    if (state.mounted) {
      ui.receiptStatus.textContent = "Runtime mounted";
      return;
    }

    ui.receiptStatus.textContent = "Booting";
  }

  function renderReceipts() {
    if (!ui.receipts) return;
    ui.receipts.textContent = "";
    for (const entry of state.lines) {
      ui.receipts.appendChild(createReceiptLine(entry.level, entry.text));
    }
    syncStatusLabel();
  }

  function writeReceipt(level, text) {
    state.lines.push({
      level,
      text: `[${nowIso()}] ${text}`,
    });
    renderReceipts();
  }

  function showFallback(message) {
    state.failed = true;
    syncStatusLabel();

    if (ui.fallbackText) {
      ui.fallbackText.textContent = message;
    }

    if (ui.fallback) {
      ui.fallback.classList.add("is-visible");
    }
  }

  function hideFallback() {
    if (ui.fallback) {
      ui.fallback.classList.remove("is-visible");
    }
  }

  function fail(message, error) {
    const detail = error instanceof Error ? `${message} ${error.message}` : message;
    writeReceipt("bad", detail);
    showFallback(detail);
  }

  function assertHostContract() {
    if (!ui.host) {
      throw new Error("Missing #products-host.");
    }

    if (!ui.stage) {
      throw new Error("Missing #products-stage.");
    }

    const hostContract = ui.host.getAttribute("data-host-contract");
    const stageOwner = ui.host.getAttribute("data-stage-owner");
    const visibleStageOwner = ui.stage.getAttribute("data-visible-stage-owner");
    const runtimeGlobal = ui.host.getAttribute("data-runtime-global");
    const runtimeScript = ui.host.getAttribute("data-runtime-script");

    if (hostContract !== HOST_META.contract) {
      throw new Error(`Host contract mismatch. Expected ${HOST_META.contract}.`);
    }

    if (stageOwner !== HOST_META.stageOwner) {
      throw new Error(`Stage owner mismatch. Expected ${HOST_META.stageOwner}.`);
    }

    if (visibleStageOwner !== "runtime") {
      throw new Error("Visible stage owner must remain runtime.");
    }

    if (runtimeGlobal !== HOST_META.runtimeGlobal) {
      throw new Error(`Runtime global mismatch. Expected ${HOST_META.runtimeGlobal}.`);
    }

    if (runtimeScript !== HOST_META.runtimeScript) {
      throw new Error(`Runtime script path mismatch. Expected ${HOST_META.runtimeScript}.`);
    }

    writeReceipt("good", "Host contract verified.");
    writeReceipt("good", "Stage container verified.");
    writeReceipt("good", "Single visible stage ownership reserved for runtime.");
  }

  function getRuntimeGlobal() {
    return window[HOST_META.runtimeGlobal];
  }

  function scriptAlreadyPresent(src) {
    const scripts = Array.from(doc.scripts || []);
    return scripts.some((script) => {
      const value = script.getAttribute("src");
      return typeof value === "string" && value.includes(src);
    });
  }

  function loadRuntimeScript() {
    return new Promise((resolve, reject) => {
      if (getRuntimeGlobal()) {
        writeReceipt("good", "Runtime global already present before script load.");
        resolve();
        return;
      }

      if (scriptAlreadyPresent(HOST_META.runtimeScript)) {
        writeReceipt("warn", "Runtime script tag already present but global not yet available. Waiting for handoff.");
      } else {
        writeReceipt("warn", `Injecting runtime script: ${HOST_META.runtimeScript}`);
      }

      const script = doc.createElement("script");
      script.src = HOST_META.runtimeScript;
      script.defer = true;
      script.async = false;
      script.setAttribute("data-products-runtime", "true");

      script.onload = () => {
        writeReceipt("good", "Runtime script loaded.");
        resolve();
      };

      script.onerror = () => {
        reject(new Error(`Runtime script failed to load from ${HOST_META.runtimeScript}.`));
      };

      doc.head.appendChild(script);
    });
  }

  function resolveMountFunction(runtime) {
    if (!runtime || typeof runtime !== "object") {
      return null;
    }

    const candidates = [
      runtime.create,
      runtime.mount,
      runtime.start,
      runtime.bootstrap,
      runtime.init,
      runtime.initialize,
      runtime.attach,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "function") {
        return candidate.bind(runtime);
      }
    }

    return null;
  }

  function mountRuntime() {
    const runtime = getRuntimeGlobal();
    if (!runtime) {
      throw new Error(`Runtime global ${HOST_META.runtimeGlobal} not found after script load.`);
    }

    writeReceipt("good", `Runtime global ${HOST_META.runtimeGlobal} resolved.`);

    const mount = resolveMountFunction(runtime);
    if (!mount) {
      throw new Error("Runtime entry function not found on resolved global.");
    }

    const payload = {
      stage: ui.stage,
      mount: ui.stage,
      root: ui.stage,
      host: ui.host,
      contract: HOST_META.contract,
      meta: HOST_META,
      reducedMotion:
        !!window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      receipts: {
        write: writeReceipt,
        fail,
      },
    };

    writeReceipt("warn", "Attempting guarded runtime handoff.");

    const result = mount(payload);

    if (result && typeof result.then === "function") {
      return result.then(() => {
        state.mounted = true;
        hideFallback();
        writeReceipt("good", "Runtime mounted successfully.");
        renderReceipts();
      });
    }

    state.mounted = true;
    hideFallback();
    writeReceipt("good", "Runtime mounted successfully.");
    renderReceipts();
    return Promise.resolve();
  }

  function attachGlobalGuards() {
    window.addEventListener("error", (event) => {
      if (state.failed) return;
      const message =
        event && event.error instanceof Error
          ? `Global error captured: ${event.error.message}`
          : `Global error captured: ${event.message || "unknown error"}`;
      fail(message, event && event.error);
    });

    window.addEventListener("unhandledrejection", (event) => {
      if (state.failed) return;
      const reason = event ? event.reason : null;
      const message =
        reason instanceof Error
          ? `Unhandled rejection: ${reason.message}`
          : `Unhandled rejection: ${String(reason)}`;
      fail(message, reason instanceof Error ? reason : null);
    });
  }

  async function bootstrap() {
    ui.host = byId("products-host");
    ui.stage = byId("products-stage");
    ui.receipts = byId("products-receipt-body");
    ui.receiptStatus = byId("products-receipt-status");
    ui.fallback = byId("products-fallback");
    ui.fallbackText = byId("products-fallback-text");

    attachGlobalGuards();

    writeReceipt("warn", `${HOST_META.name} ${HOST_META.version} starting.`);
    writeReceipt("warn", "Host receipts initialized.");

    try {
      assertHostContract();
      await loadRuntimeScript();
      await mountRuntime();
    } catch (error) {
      fail("Products bootstrap failed.", error);
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
