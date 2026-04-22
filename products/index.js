(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";

  const diag = window.__productsDiag || {
    setValue() {},
    setStatus() {},
  };

  diag.setStatus("index-js-parsed");
  diag.setValue("diag-create-entry", "index.js parsed", "warn");

  const viewport = document.getElementById("products-map-viewport");
  const stage = document.getElementById("planetary-stage");

  if (!viewport || !stage) {
    diag.setValue("diag-error-text", "required host nodes missing", "fail");
    diag.setStatus("host-nodes-missing");
    return;
  }

  function destroyExistingRuntime() {
    const existing = window.__productsPlanetRuntimeInstance;
    if (existing && typeof existing.destroy === "function") {
      existing.destroy();
    }
    window.__productsPlanetRuntimeInstance = null;
    stage.innerHTML = "";
    stage.removeAttribute("data-runtime");
  }

  function readErrorMessage(error) {
    if (!error) return "unknown error";
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message || error.name || "error";
    try {
      return JSON.stringify(error);
    } catch {
      return "unserializable error";
    }
  }

  function bootRuntime(source) {
    destroyExistingRuntime();

    diag.setStatus("boot-started");
    diag.setValue("diag-create-entry", `boot entered (${source})`, "warn");
    diag.setValue("diag-mount-result", "boot in progress", "warn");
    diag.setValue("diag-error-text", "none", "note");

    const runtimeApi = window[GLOBAL_KEY];
    if (!runtimeApi || typeof runtimeApi.create !== "function") {
      diag.setValue("diag-global-api", "missing", "fail");
      diag.setValue("diag-mount-result", "blocked", "fail");
      diag.setValue("diag-error-text", `window.${GLOBAL_KEY}.create not available`, "fail");
      diag.setStatus("global-api-missing");
      return;
    }

    diag.setValue("diag-global-api", "found", "ok");

    try {
      diag.setValue("diag-create-entry", `create() entered (${source})`, "ok");
      diag.setStatus("create-entered");

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const instance = runtimeApi.create({
        stage,
        mount: stage,
        reducedMotion,
      });

      window.__productsPlanetRuntimeInstance = instance;
      diag.setValue("diag-mount-result", "succeeded", "ok");
      diag.setStatus("mount-succeeded");
    } catch (error) {
      diag.setValue("diag-mount-result", "failed", "fail");
      diag.setValue("diag-error-text", readErrorMessage(error), "fail");
      diag.setStatus("create-failed");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    diag.setStatus("dom-ready");
    bootRuntime("dom-ready");
  }, { once: true });

  window.addEventListener("pageshow", () => {
    diag.setStatus("pageshow");
    bootRuntime("pageshow");
  });
})();
