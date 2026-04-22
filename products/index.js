"use strict";

window.__productsBootstrapStart = function __productsBootstrapStart(source) {
  const diag = window.__productsDiag || {
    setValue() {},
    setStatus() {},
  };

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

  function getNodes() {
    return {
      viewport: document.getElementById("products-map-viewport"),
      stage: document.getElementById("planetary-stage"),
    };
  }

  function destroyExistingRuntime(stage) {
    const existing = window.__productsPlanetRuntimeInstance;
    if (existing && typeof existing.destroy === "function") {
      existing.destroy();
    }
    window.__productsPlanetRuntimeInstance = null;
    if (stage) {
      stage.innerHTML = "";
      stage.removeAttribute("data-runtime");
    }
  }

  const nodes = getNodes();
  if (!nodes.viewport || !nodes.stage) {
    diag.setValue("diag-create-entry", "bootstrap called", "warn");
    diag.setValue("diag-mount-result", "blocked", "fail");
    diag.setValue("diag-error-text", "required host nodes missing", "fail");
    diag.setStatus("host-nodes-missing");
    return;
  }

  destroyExistingRuntime(nodes.stage);

  diag.setValue("diag-create-entry", `bootstrap called (${source || "manual"})`, "warn");
  diag.setValue("diag-mount-result", "boot in progress", "warn");
  diag.setValue("diag-error-text", "none", "note");
  diag.setStatus("boot-started");

  const runtimeApi = window.ProductsPlanetRuntime;
  if (!runtimeApi || typeof runtimeApi.create !== "function") {
    diag.setValue("diag-global-api", "missing", "fail");
    diag.setValue("diag-mount-result", "blocked", "fail");
    diag.setValue("diag-error-text", "window.ProductsPlanetRuntime.create not available", "fail");
    diag.setStatus("global-api-missing");
    return;
  }

  diag.setValue("diag-global-api", "found", "ok");

  try {
    diag.setValue("diag-create-entry", `create() entered (${source || "manual"})`, "ok");
    diag.setStatus("create-entered");

    const reducedMotion = !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    const instance = runtimeApi.create({
      stage: nodes.stage,
      mount: nodes.stage,
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
};

(function initProductsBootstrap() {
  const diag = window.__productsDiag || {
    setValue() {},
    setStatus() {},
  };

  diag.setStatus("index-js-parsed");
  diag.setValue("diag-create-entry", "index.js parsed", "warn");

  if (document.readyState === "complete" || document.readyState === "interactive") {
    diag.setStatus("document-ready");
    window.__productsBootstrapStart("document-ready");
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      function onDomReady() {
        diag.setStatus("dom-ready");
        window.__productsBootstrapStart("dom-ready");
      },
      { once: true }
    );
  }

  window.addEventListener("pageshow", function onPageShow() {
    diag.setStatus("pageshow");
    window.__productsBootstrapStart("pageshow");
  });
})();
