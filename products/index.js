(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";
  const viewport = document.getElementById("products-map-viewport");
  const stage = document.getElementById("planetary-stage");
  const status = document.getElementById("products-runtime-status");

  if (!viewport || !stage) {
    return;
  }

  function setStatus(message) {
    if (status) {
      status.textContent = `runtime: ${message}`;
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

  function bootRuntime() {
    destroyExistingRuntime();

    const runtimeApi = window[GLOBAL_KEY];
    if (!runtimeApi || typeof runtimeApi.create !== "function") {
      setStatus("missing");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const instance = runtimeApi.create({
      stage,
      mount: stage,
      reducedMotion,
    });

    window.__productsPlanetRuntimeInstance = instance;
    setStatus("active");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootRuntime, { once: true });
  } else {
    bootRuntime();
  }

  window.addEventListener("pageshow", bootRuntime);
})();
