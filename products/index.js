"use strict";

(function () {
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
      stageZone: document.getElementById("products-stage-zone"),
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
      stage.style.position = "absolute";
      stage.style.inset = "0";
      stage.style.overflow = "auto";
      stage.style.maxWidth = "100%";
      stage.style.maxHeight = "100%";
    }
  }

  function enforceStageContainment(stageZone, stage) {
    stageZone.style.position = "relative";
    stageZone.style.overflow = "hidden";
    stage.style.position = "absolute";
    stage.style.inset = "0";
    stage.style.overflow = "auto";
    stage.style.maxWidth = "100%";
    stage.style.maxHeight = "100%";
  }

  function applyLiveExperiencePriority(stage) {
    stage.setAttribute("data-surface-priority", "live-experience");
  }

  function runBootstrap(source) {
    const { stageZone, stage } = getNodes();

    if (!stageZone || !stage) {
      diag.setValue("diag-create-entry", "bootstrap called", "warn");
      diag.setValue("diag-mount-result", "blocked", "fail");
      diag.setValue("diag-error-text", "required stage nodes missing", "fail");
      diag.setStatus("host-nodes-missing");
      return;
    }

    destroyExistingRuntime(stage);
    enforceStageContainment(stageZone, stage);

    diag.setValue("diag-create-entry", "bootstrap called (" + source + ")", "warn");
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
      diag.setValue("diag-create-entry", "create() entered (" + source + ")", "ok");
      diag.setStatus("create-entered");

      const reducedMotion = !!(
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );

      const instance = runtimeApi.create({
        stage,
        mount: stage,
        reducedMotion,
      });

      window.__productsPlanetRuntimeInstance = instance;
      enforceStageContainment(stageZone, stage);
      applyLiveExperiencePriority(stage);

      diag.setValue("diag-mount-result", "succeeded", "ok");
      diag.setStatus("mount-succeeded");
    } catch (error) {
      diag.setValue("diag-mount-result", "failed", "fail");
      diag.setValue("diag-error-text", readErrorMessage(error), "fail");
      diag.setStatus("create-failed");
    }
  }

  window.__productsBootstrapStart = function __productsBootstrapStart(source) {
    runBootstrap(source || "manual");
  };

  diag.setValue("diag-create-entry", "index.js parsed", "warn");
  diag.setStatus("index-js-parsed");

  if (document.readyState === "complete" || document.readyState === "interactive") {
    diag.setStatus("document-ready");
    window.__productsBootstrapStart("document-ready");
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      diag.setStatus("dom-ready");
      window.__productsBootstrapStart("dom-ready");
    }, { once: true });
  }

  window.addEventListener("pageshow", function () {
    diag.setStatus("pageshow");
    window.__productsBootstrapStart("pageshow");
  });
})();
