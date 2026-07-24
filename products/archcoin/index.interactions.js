/* /products/archcoin/index.interactions.js
   ARCHCOIN accepted interaction and center-world assembly.
*/
(() => {
  "use strict";

  function loadScript(url, marker) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-${marker}]`);
      if (existing) {
        if (existing.dataset.ready === "true") {
          resolve(existing);
        } else {
          existing.addEventListener("load", () => resolve(existing), { once: true });
        }
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.dataset[marker] = "true";
      script.addEventListener("load", () => {
        script.dataset.ready = "true";
        resolve(script);
      }, { once: true });
      script.addEventListener("error", () => {
        reject(new Error(`ARCHCOIN_SCRIPT_LOAD_FAILED:${url}`));
      }, { once: true });
      document.head.append(script);
    });
  }

  function publish(detail = {}) {
    const receipt = Object.freeze({
      module: "DGB_ARCHCOIN_ACCEPTED_PRODUCTION",
      acceptedMirrorInstalled: true,
      productionIdentity: true,
      ...detail
    });

    globalThis.DGB_ARCHCOIN_ACCEPTED_PRODUCTION = receipt;
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_ACCEPTED_PRODUCTION_READY", {
      detail: receipt
    }));
    return receipt;
  }

  async function install() {
    await loadScript("./index.motion.js", "archcoinMotionSource");
    await loadScript("./index.planet.js", "archcoinPlanetSource");

    const control = document.querySelector("[data-upstream-compass-control]");
    if (!control) {
      throw new Error("ARCHCOIN_CENTER_CONTROL_NOT_FOUND");
    }

    control.setAttribute("aria-label", "Open Main Compass return options");

    const fallback = control.querySelector("[data-upstream-compass-fallback]");
    if (fallback) {
      fallback.hidden = true;
    }

    let mount = control.querySelector("[data-archcoin-center-world]");
    if (!mount) {
      mount = document.createElement("span");
      mount.className = "archcoin-round4-globe";
      mount.dataset.archcoinCenterWorld = "true";
      mount.setAttribute("aria-hidden", "true");
      control.append(mount);
    }

    const host = globalThis.DGB_ARCHCOIN_ROUND4_LAWS_GLOBE;
    if (!host || typeof host.mount !== "function") {
      throw new Error("ARCHCOIN_CENTER_WORLD_HOST_UNAVAILABLE");
    }

    await host.mount(mount);
    publish({ installed: true, centerWorldMounted: true });
  }

  const start = () => install().catch(error => {
    publish({ installed: false, error: error instanceof Error ? error.message : String(error) });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
