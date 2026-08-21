/* /products/archcoin/index.planet.js
   ARCHCOIN accepted center-world loader.
   Performance round 3: direct same-origin source execution without Blob scripts.
*/
(() => {
  "use strict";

  const SOURCE_URL = "./index.planet.source.js";
  const SCRIPT_ATTRIBUTE = "data-archcoin-accepted-planet-source";
  const runtime = globalThis.DGB_ARCHCOIN_RUNTIME ||
    (globalThis.DGB_ARCHCOIN_RUNTIME = {});

  function runIdle(task, timeout = 900) {
    return new Promise((resolve, reject) => {
      const run = () => Promise.resolve().then(task).then(resolve, reject);
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(run, { timeout });
      } else {
        setTimeout(run, 0);
      }
    });
  }

  function loadSource() {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[${SCRIPT_ATTRIBUTE}]`);
      if (existing) {
        if (existing.dataset.ready === "true") {
          resolve(existing);
        } else {
          existing.addEventListener("load", () => resolve(existing), { once: true });
          existing.addEventListener("error", () => reject(
            new Error("ARCHCOIN_PLANET_SOURCE_LOAD_FAILED")
          ), { once: true });
        }
        return;
      }

      const script = document.createElement("script");
      script.src = SOURCE_URL;
      script.async = false;
      script.fetchPriority = "low";
      script.setAttribute(SCRIPT_ATTRIBUTE, "true");
      script.addEventListener("load", () => {
        script.dataset.ready = "true";
        resolve(script);
      }, { once: true });
      script.addEventListener("error", () => reject(
        new Error("ARCHCOIN_PLANET_SOURCE_LOAD_FAILED")
      ), { once: true });
      document.head.append(script);
    });
  }

  async function install() {
    await loadSource();
    const host = globalThis.DGB_ARCHCOIN_CENTER_WORLD;
    if (!host || typeof host.mount !== "function") {
      throw new Error("ARCHCOIN_CENTER_WORLD_HOST_UNAVAILABLE");
    }
    return host;
  }

  if (!runtime.planetReady) {
    runtime.planetReady = runIdle(install, 900).catch(error => {
      globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_PLANET_WRAPPER_FAILURE", {
        detail: Object.freeze({
          message: error instanceof Error ? error.message : String(error)
        })
      }));
      throw error;
    });
  }
})();
