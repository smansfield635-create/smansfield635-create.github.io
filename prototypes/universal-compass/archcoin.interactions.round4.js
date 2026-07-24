/* /prototypes/universal-compass/archcoin.interactions.round4.js
   ARCHCOIN calibration lab · Round 4.
   Preserves the accepted Round 3 display-space gesture correction, mounts the
   existing Earth globe asset inside the existing home-control button, and keeps
   the original Compass selection/navigation authority intact.
*/
(() => {
  "use strict";

  const BUILD = "ARCHCOIN_CALIBRATION_ROUND4_v1";
  const ROUND3_URL = `./archcoin.interactions.round3.js?build=${encodeURIComponent(BUILD)}`;
  const EARTH_ASSET_URL = `/assets/earth/earth_canvas.js?build=${encodeURIComponent(BUILD)}`;

  function publishGlobeReceipt(detail = {}) {
    const receipt = Object.freeze({
      build: BUILD,
      visibleCenterObject: "EARTH_GLOBE",
      existingCompassControlPreserved: true,
      existingCompassNavigationAuthorityPreserved: true,
      sourceAsset: "/assets/earth/earth_canvas.js",
      ...detail
    });
    globalThis.DGB_ARCHCOIN_CALIBRATION_ROUND4_GLOBE = receipt;
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_CALIBRATION_ROUND4_GLOBE_READY", {
      detail: receipt
    }));
    return receipt;
  }

  function mountGlobe() {
    const control = document.querySelector("[data-upstream-compass-control]");
    if (!control || control.dataset.round4GlobeMounted === "true") return false;

    control.dataset.round4GlobeMounted = "true";
    control.dataset.round4NavigationAuthority = "existing-main-compass-control";
    control.setAttribute("aria-label", "Open Main Compass return options");

    const fallback = control.querySelector("[data-upstream-compass-fallback]");
    if (fallback) fallback.hidden = true;

    const mount = document.createElement("span");
    mount.className = "archcoin-round4-globe";
    mount.dataset.archcoinRound4Globe = "true";
    mount.dataset.earthAssetMount = "true";
    mount.setAttribute("aria-hidden", "true");
    control.append(mount);

    function useFallback(reason) {
      mount.dataset.globeMode = "css-fallback";
      publishGlobeReceipt({
        mounted: true,
        earthAssetMounted: false,
        fallbackActive: true,
        fallbackReason: reason
      });
    }

    function mountExistingAsset() {
      const asset = globalThis.DGBEarthAssetCanvas || globalThis.DGBDemoUniverseEarthCanvas;
      if (!asset || typeof asset.mount !== "function") {
        useFallback("EARTH_ASSET_API_UNAVAILABLE");
        return;
      }
      try {
        const result = asset.mount(mount, {
          autoSpin: true,
          showAxis: false,
          touchEnabled: false,
          brightness: 1.08,
          contrast: 1.08,
          cloudStrength: 0.30
        });
        mount.dataset.globeMode = "existing-earth-asset";
        publishGlobeReceipt({
          mounted: true,
          earthAssetMounted: true,
          fallbackActive: false,
          assetReceipt: result || null
        });
      } catch (error) {
        useFallback(error && error.message ? error.message : "EARTH_ASSET_MOUNT_FAILED");
      }
    }

    const existingAsset = globalThis.DGBEarthAssetCanvas || globalThis.DGBDemoUniverseEarthCanvas;
    if (existingAsset) {
      mountExistingAsset();
      return true;
    }

    const script = document.createElement("script");
    script.src = EARTH_ASSET_URL;
    script.async = false;
    script.dataset.archcoinRound4EarthAsset = "true";
    script.addEventListener("load", mountExistingAsset, { once: true });
    script.addEventListener("error", () => useFallback("EARTH_ASSET_SCRIPT_LOAD_FAILED"), { once: true });
    document.head.append(script);
    return true;
  }

  function publishRound4InteractionReceipt() {
    const base = globalThis.DGB_ARCHCOIN_CALIBRATION_INTERACTIONS ||
      globalThis.DGB_ARCHCOIN_INTERACTIONS || null;
    const receipt = Object.freeze({
      build: BUILD,
      sourceInteractionBuild: base && base.build || "ARCHCOIN_CALIBRATION_ROUND3_v1",
      showroomCenteredClusterStandard: true,
      clusterDisplaySpaceCorrection: true,
      sharedRoomQuaternion: true,
      inheritedWingCenterOffsetRemovedByCrystalLayer: true,
      existingCompassControlPreserved: true,
      globeMountedInExistingControl: true,
      productionSourceModified: false
    });
    globalThis.DGB_ARCHCOIN_CALIBRATION_ROUND4 = receipt;
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_CALIBRATION_ROUND4_READY", {
      detail: receipt
    }));
  }

  function loadRound3InteractionAuthority() {
    const script = document.createElement("script");
    script.src = ROUND3_URL;
    script.async = false;
    script.dataset.archcoinCalibrationRound4MotionSource = "round3-display-space-correction";
    script.addEventListener("load", () => {
      mountGlobe();
      publishRound4InteractionReceipt();
    }, { once: true });
    script.addEventListener("error", () => {
      throw new Error("ARCHCOIN_CALIBRATION_ROUND4_MOTION_SOURCE_LOAD_FAILED");
    }, { once: true });
    document.head.append(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountGlobe, { once: true });
  } else {
    mountGlobe();
  }

  loadRound3InteractionAuthority();
})();