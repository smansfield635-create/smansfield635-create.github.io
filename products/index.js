(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";

  const viewport = document.getElementById("products-map-viewport");
  const stage = document.getElementById("planetary-stage");
  const status = document.getElementById("products-runtime-status");

  const diagRuntimeFile = document.getElementById("diag-runtime-file");
  const diagGlobalApi = document.getElementById("diag-global-api");
  const diagCreateEntry = document.getElementById("diag-create-entry");
  const diagMountResult = document.getElementById("diag-mount-result");
  const diagErrorText = document.getElementById("diag-error-text");

  if (!viewport || !stage) {
    return;
  }

  function setValue(node, text, kind) {
    if (!node) return;
    node.textContent = text;
    node.className = `value ${kind}`;
  }

  function setStatus(message) {
    if (status) {
      status.textContent = `runtime: ${message}`;
    }
  }

  function setBootStage(stageName, kind) {
    setStatus(stageName);
    if (stageName === "runtime-file-loaded") {
      setValue(diagRuntimeFile, "loaded", kind);
    }
    if (stageName === "global-api-found") {
      setValue(diagGlobalApi, "found", kind);
    }
    if (stageName === "global-api-missing") {
      setValue(diagGlobalApi, "missing", kind);
    }
    if (stageName === "create-entered") {
      setValue(diagCreateEntry, "entered", kind);
    }
    if (stageName === "mount-succeeded") {
      setValue(diagMountResult, "succeeded", kind);
    }
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

  function bootRuntime() {
    destroyExistingRuntime();

    setBootStage("runtime-file-loaded", "ok");
    setValue(diagErrorText, "none", "note");
    setValue(diagCreateEntry, "awaiting", "note");
    setValue(diagMountResult, "awaiting", "note");

    const runtimeApi = window[GLOBAL_KEY];
    if (!runtimeApi || typeof runtimeApi.create !== "function") {
      setBootStage("global-api-missing", "fail");
      setValue(diagErrorText, `window.${GLOBAL_KEY}.create not available`, "fail");
      return;
    }

    setBootStage("global-api-found", "ok");

    try {
      setBootStage("create-entered", "warn");

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const instance = runtimeApi.create({
        stage,
        mount: stage,
        reducedMotion,
      });

      window.__productsPlanetRuntimeInstance = instance;
      setBootStage("mount-succeeded", "ok");
    } catch (error) {
      setStatus("create-failed");
      setValue(diagMountResult, "failed", "fail");
      setValue(diagErrorText, readErrorMessage(error), "fail");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootRuntime, { once: true });
  } else {
    bootRuntime();
  }

  window.addEventListener("pageshow", bootRuntime);
})();
