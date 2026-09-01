/* /prototypes/universal-compass/archcoin.interactions.round4.js
   ARCHCOIN calibration lab · Round 4.
   Preserves the accepted Round 3 display-space cluster motion and mounts the
   exact Laws Audralia world-pass globe inside the existing Compass control.
*/
(() => {
  "use strict";

  const BUILD = "ARCHCOIN_CALIBRATION_ROUND4_LAWS_GLOBE_v1";
  const ROUND3_URL = `./archcoin.interactions.round3.js?build=${encodeURIComponent(BUILD)}`;
  const GLOBE_HOST_URL = `./archcoin.globe.laws.round4.js?build=${encodeURIComponent(BUILD)}`;

  function publish(detail = {}) {
    const receipt = Object.freeze({
      build: BUILD,
      sourceInteraction: "/prototypes/universal-compass/archcoin.interactions.round3.js",
      globeStandard: "LAWS_AUDRALIA_WORLD_PASS",
      centerControlPreserved: true,
      centerNavigationAuthorityPreserved: true,
      clusterGeometryChanged: false,
      clusterMotionChanged: false,
      ...detail
    });
    globalThis.DGB_ARCHCOIN_CALIBRATION_ROUND4 = receipt;
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_CALIBRATION_ROUND4_READY", { detail: receipt }));
    return receipt;
  }

  function loadScript(url, marker) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.dataset[marker] = "true";
      script.addEventListener("load", () => resolve(script), { once: true });
      script.addEventListener("error", () => reject(new Error(`ARCHCOIN_ROUND4_SCRIPT_LOAD_FAILED:${url}`)), { once: true });
      document.head.append(script);
    });
  }

  async function install() {
    await loadScript(ROUND3_URL, "archcoinRound4MotionSource");
    await loadScript(GLOBE_HOST_URL, "archcoinRound4LawsGlobeHost");

    const control = document.querySelector("[data-upstream-compass-control]");
    if (!control) throw new Error("ARCHCOIN_ROUND4_CENTER_CONTROL_NOT_FOUND");

    control.dataset.round4NavigationAuthority = "existing-main-compass-control";
    control.setAttribute("aria-label", "Open Main Compass return options");

    const fallback = control.querySelector("[data-upstream-compass-fallback]");
    if (fallback) fallback.hidden = true;

    let mount = control.querySelector("[data-archcoin-round4-globe]");
    if (!mount) {
      mount = document.createElement("span");
      mount.className = "archcoin-round4-globe";
      mount.dataset.archcoinRound4Globe = "true";
      mount.setAttribute("aria-hidden", "true");
      control.append(mount);
    }

    const host = globalThis.DGB_ARCHCOIN_ROUND4_LAWS_GLOBE;
    if (!host || typeof host.mount !== "function") {
      throw new Error("ARCHCOIN_ROUND4_LAWS_GLOBE_HOST_UNAVAILABLE");
    }

    await host.mount(mount);
    publish({ installed: true, lawsGlobeMounted: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => install().catch(error => publish({ installed: false, error: error.message })), { once: true });
  } else {
    install().catch(error => publish({ installed: false, error: error.message }));
  }
})();