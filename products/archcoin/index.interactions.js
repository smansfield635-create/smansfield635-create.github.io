/* /products/archcoin/index.interactions.js
   ARCHCOIN accepted interaction and center-world assembly.
*/
(() => {
  "use strict";

  const MOTION_SOURCE_URL = "./index.motion.source.js";
  const PLANET_URL = "./index.planet.js";
  const MOTION_READY_EVENT = "ARCHCOIN_ACCEPTED_MOTION_READY";

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
      script.addEventListener("error", () => reject(new Error(`ARCHCOIN_SCRIPT_LOAD_FAILED:${url}`)), { once: true });
      document.head.append(script);
    });
  }

  function loadSourceSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    if (request.status < 200 || request.status >= 300) {
      throw new Error(`ARCHCOIN_MOTION_SOURCE_LOAD_FAILED:${request.status}`);
    }
    return request.responseText;
  }

  function publish(detail = {}) {
    const receipt = Object.freeze({
      module: "DGB_ARCHCOIN_ACCEPTED_PRODUCTION",
      acceptedMirrorInstalled: true,
      productionIdentity: true,
      ...detail
    });
    globalThis.DGB_ARCHCOIN_ACCEPTED_PRODUCTION = receipt;
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_ACCEPTED_PRODUCTION_READY", { detail: receipt }));
    return receipt;
  }

  async function mountCenterWorld() {
    const control = document.querySelector("[data-upstream-compass-control]");
    if (!control) {
      throw new Error("ARCHCOIN_CENTER_CONTROL_NOT_FOUND");
    }

    control.setAttribute("aria-label", "Open Main Compass return options");

    const fallback = control.querySelector("[data-upstream-compass-fallback]");
    if (fallback) fallback.hidden = true;

    let mount = control.querySelector("[data-archcoin-center-world]");
    if (!mount) {
      mount = document.createElement("span");
      mount.className = "archcoin-round4-globe";
      mount.dataset.archcoinCenterWorld = "true";
      mount.setAttribute("aria-hidden", "true");
      control.append(mount);
    }

    const host = globalThis.DGB_ARCHCOIN_CENTER_WORLD;
    if (!host || typeof host.mount !== "function") {
      throw new Error("ARCHCOIN_CENTER_WORLD_HOST_UNAVAILABLE");
    }

    await host.mount(mount);
    publish({ installed: true, centerWorldMounted: true });
  }

  function evaluateAcceptedMotion() {
    let source = loadSourceSynchronously(MOTION_SOURCE_URL);
    source = source
      .replaceAll("/* /prototypes/universal-compass/archcoin.interactions.round3.js", "/* /products/archcoin/index.motion.source.js")
      .replaceAll("ARCHCOIN calibration lab · Round 3.", "ARCHCOIN accepted production motion.")
      .replaceAll("Production ARCHCOIN files are not modified.", "Accepted ARCHCOIN production motion.")
      .replaceAll("ARCHCOIN_CALIBRATION_ROUND3_v1", "ARCHCOIN_PRODUCTION_ACCEPTED_MOTION_v1")
      .replaceAll("ARCHCOIN_CALIBRATION_ROUND3_READY", MOTION_READY_EVENT)
      .replaceAll("ARCHCOIN_CALIBRATION_ROUND3_", "ARCHCOIN_PRODUCTION_ACCEPTED_MOTION_")
      .replaceAll("DGB_ARCHCOIN_CALIBRATION_INTERACTIONS", "DGB_ARCHCOIN_ACCEPTED_INTERACTIONS")
      .replaceAll("./archcoin.index.interactions.source.js", "./index.interactions.source.js")
      .replaceAll("installCalibrationInteractions", "installAcceptedInteractions")
      .replaceAll("calibrationApi", "acceptedApi")
      .replaceAll("5.0.0-calibration-round3-main-cluster-motion", "5.0.0-accepted-main-cluster-motion")
      .replaceAll("round3-disposed", "accepted-motion-disposed")
      .replaceAll("archcoinCalibration", "archcoinProduction")
      .replaceAll("is-calibration-", "is-archcoin-");

    source += "\n//# sourceURL=/products/archcoin/index.motion.accepted.js";
    (0, eval)(source);
  }

  async function install() {
    await loadScript(PLANET_URL, "archcoinPlanetSource");

    let mounted = false;
    const mountOnce = () => {
      if (mounted) return;
      mounted = true;
      mountCenterWorld().catch(error => publish({ installed: false, error: error.message }));
    };

    globalThis.addEventListener(MOTION_READY_EVENT, mountOnce, { once: true });
    evaluateAcceptedMotion();

    if (globalThis.DGB_ARCHCOIN_ACCEPTED_INTERACTIONS) {
      mountOnce();
    }
  }

  const start = () => install().catch(error => publish({ installed: false, error: error instanceof Error ? error.message : String(error) }));

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
