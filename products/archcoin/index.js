(function () {
  "use strict";

  var RUNTIME_FILES = [
    "/products/archcoin/runtime/spine_runtime_contract.js",
    "/products/archcoin/runtime/spine_runtime.js",
    "/products/archcoin/runtime/archcoin_vault_motion.js"
  ];

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-runtime-src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") {
          resolve();
          return;
        }
        existing.addEventListener("load", function () { resolve(); }, { once: true });
        existing.addEventListener("error", function () { reject(new Error("Failed to load " + src)); }, { once: true });
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

  function boot() {
    var spineRuntimeApi = window.__SPINE_RUNTIME__;
    var motionApi = window.__ARCHCOIN_VAULT_MOTION__;

    if (!spineRuntimeApi || !motionApi) {
      throw new Error("Archcoin runtime modules unavailable");
    }

    var runtime = spineRuntimeApi.createSpineRuntime({
      root: document,
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
    loadAll(RUNTIME_FILES).then(boot).catch(function (error) {
      console.error("[ARCHCOIN_BOOT_ERROR]", error);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
