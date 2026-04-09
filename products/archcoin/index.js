(function () {
  "use strict";

  var RUNTIME_FILES = [
    "./runtime/spine_runtime_contract.js",
    "./runtime/spine_runtime.js",
    "./runtime/archcoin_vault_motion.js"
  ];

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-runtime-src="' + src + '"]');

      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") {
          resolve();
          return;
        }
        existing.addEventListener("load", function () {
          resolve();
        }, { once: true });
        existing.addEventListener("error", function () {
          reject(new Error("Failed to load " + src));
        }, { once: true });
        return;
      }

      var script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.defer = true;
      script.setAttribute("data-runtime-src", src);

      script.addEventListener("load", function () {
        script.setAttribute("data-loaded", "true");
        resolve();
      }, { once: true });

      script.addEventListener("error", function () {
        reject(new Error("Failed to load " + src));
      }, { once: true });

      document.head.appendChild(script);
    });
  }

  function loadAll(files) {
    return files.reduce(function (promise, src) {
      return promise.then(function () {
        return loadScript(src);
      });
    }, Promise.resolve());
  }

  function showBootError(message) {
    var note = document.createElement("div");
    note.style.position = "fixed";
    note.style.left = "12px";
    note.style.right = "12px";
    note.style.bottom = "12px";
    note.style.zIndex = "9999";
    note.style.padding = "12px 14px";
    note.style.borderRadius = "14px";
    note.style.border = "1px solid rgba(255,120,120,.28)";
    note.style.background = "rgba(48,8,10,.92)";
    note.style.color = "#ffe8e8";
    note.style.font = "12px/1.55 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace";
    note.style.whiteSpace = "pre-wrap";
    note.textContent = "[ARCHCOIN_BOOT_ERROR] " + String(message || "Unknown boot error");
    document.body.appendChild(note);
  }

  function boot() {
    var spineRuntimeApi = window.__SPINE_RUNTIME__;
    var motionApi = window.__ARCHCOIN_VAULT_MOTION__;

    if (!spineRuntimeApi || !motionApi) {
      throw new Error("Archcoin runtime modules unavailable");
    }

    var runtime = spineRuntimeApi.createSpineRuntime({
      root: document.getElementById("archcoin-page") || document,
      name: "ARCHCOIN_SPINE_RUNTIME",
      version: "T1"
    });

    var motion = motionApi.createArchcoinVaultMotion();

    runtime.registerModule(motion);
    runtime.mount();
    runtime.start();

    window.__ARCHCOIN_SPINE_RUNTIME_INSTANCE__ = runtime;
  }

  function start() {
    loadAll(RUNTIME_FILES)
      .then(boot)
      .catch(function (error) {
        console.error("[ARCHCOIN_BOOT_ERROR]", error);
        showBootError(error && error.message ? error.message : String(error));
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
