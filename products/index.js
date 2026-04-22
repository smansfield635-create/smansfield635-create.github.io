(() => {
  "use strict";

  const HOST_META = Object.freeze({
    name: "PRODUCTS_HOST_BOOTSTRAP",
    version: "V3",
    contract: "PRODUCTS_HOST_CONTRACT_V1",
    stageOwner: "runtime-only",
    runtimeGlobal: "ProductsPlanetRuntime",
    runtimeScript: "./products_runtime.js",
  });

  const doc = document;

  function byId(id) {
    return doc.getElementById(id);
  }

  function getRuntimeGlobal() {
    return window[HOST_META.runtimeGlobal];
  }

  function createConsoleReceipt(level, text, error) {
    const prefix = `[${HOST_META.name}]`;
    if (level === "bad") {
      console.error(prefix, text, error || "");
      return;
    }
    if (level === "warn") {
      console.warn(prefix, text);
      return;
    }
    console.log(prefix, text);
  }

  const ui = {
    host: null,
    stage: null,
    loading: null,
    fault: null,
    faultText: null,
  };

  const state = {
    failed: false,
    mounted: false,
  };

  function hideLoading() {
    if (ui.loading) {
      ui.loading.classList.add("is-hidden");
    }
  }

  function showLoading() {
    if (ui.loading) {
      ui.loading.classList.remove("is-hidden");
    }
  }

  function showFault(message) {
    state.failed = true;
    hideLoading();

    if (ui.faultText) {
      ui.faultText.textContent = message;
    }

    if (ui.fault) {
      ui.fault.classList.remove("is-hidden");
    }
  }

  function hideFault() {
    if (ui.fault) {
      ui.fault.classList.add("is-hidden");
    }
  }

  function fail(message, error) {
    const detail = error instanceof Error ? `${message} ${error.message}` : message;
    createConsoleReceipt("bad", detail, error);
    showFault(detail);
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

    createConsoleReceipt("good", "Host contract verified.");
  }

  function ensureRuntimeScript() {
    return new Promise((resolve, reject) => {
      if (getRuntimeGlobal()) {
        createConsoleReceipt("good", "Runtime global already present.");
        resolve();
        return;
      }

      const existing = doc.querySelector('script[data-products-runtime="true"]');
      if (existing) {
        createConsoleReceipt("warn", "Runtime script tag already present. Waiting for load.");
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error(`Runtime script failed to load from ${HOST_META.runtimeScript}.`)),
          { once: true }
        );
        return;
      }

      createConsoleReceipt("warn", `Injecting runtime script: ${HOST_META.runtimeScript}`);

      const script = doc.createElement("script");
      script.src = HOST_META.runtimeScript;
      script.defer = true;
      script.async = false;
      script.setAttribute("data-products-runtime", "true");

      script.onload = () => {
        createConsoleReceipt("good", "Runtime script loaded.");
        resolve();
      };

      script.onerror = () => {
        reject(new Error(`Runtime script failed to load from ${HOST_META.runtimeScript}.`));
      };

      doc.head.appendChild(script);
    });
  }

  function resolveRuntimeEntry(runtime) {
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

  async function mountRuntime() {
    const runtime = getRuntimeGlobal();
    if (!runtime) {
      throw new Error(`Runtime global ${HOST_META.runtimeGlobal} not found after script load.`);
    }

    createConsoleReceipt("good", `Runtime global ${HOST_META.runtimeGlobal} resolved.`);

    const entry = resolveRuntimeEntry(runtime);
    if (!entry) {
      throw new Error("Runtime entry function not found on resolved global.");
    }

    createConsoleReceipt("warn", "Attempting guarded runtime handoff.");

    const result = entry({
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
        write: createConsoleReceipt,
        fail,
      },
    });

    if (result && typeof result.then === "function") {
      await result;
    }

    state.mounted = true;
    hideFault();
    hideLoading();
    createConsoleReceipt("good", "Runtime mounted successfully.");
  }

  function attachGlobalGuards() {
    window.addEventListener("error", (event) => {
      if (state.failed) return;
      const message =
        event && event.error instanceof Error
          ? `Global error captured: ${event.error.message}`
          : `Global error captured: ${event?.message || "unknown error"}`;
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
    ui.loading = byId("products-loading");
    ui.fault = byId("products-fault");
    ui.faultText = byId("products-fault-text");

    showLoading();
    hideFault();
    attachGlobalGuards();

    try {
      assertHostContract();
      await ensureRuntimeScript();
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
