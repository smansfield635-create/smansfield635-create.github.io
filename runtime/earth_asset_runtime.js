/* /runtime/earth_asset_runtime.js
   EARTH_G5_NON_NASA_SATELLITE_ASSET_RUNTIME_TNT_v2
   Full-file replacement.
*/

(function () {
  "use strict";

  const CONTRACT = "EARTH_G5_NON_NASA_SATELLITE_ASSET_RUNTIME_TNT_v2";
  const PREVIOUS_CONTRACT = "EARTH_G4_DEDICATED_ASSET_RUNTIME_TNT_v1";
  const CANVAS_CONTRACT = "EARTH_G5_NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE_TNT_v1";

  const SELECTORS = [
    "#earthRenderMount",
    "[data-earth-render-mount]",
    "[data-body='earth'][data-render-mount]",
    "[data-dgb-earth-mount]"
  ];

  const STATE = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    canvasContract: CANVAS_CONTRACT,
    mounted: false,
    mountFound: false,
    canvasAuthorityFound: false,
    instanceStarted: false,
    runtimeStatus: "booting",
    visibility: document.visibilityState || "visible",
    assetStatus: null,
    lastError: null
  };

  let runtimeInstance = null;
  let statusTimer = null;
  let mountAttempts = 0;
  const MAX_MOUNT_ATTEMPTS = 40;

  function findMount() {
    for (const selector of SELECTORS) {
      const node = document.querySelector(selector);
      if (node) return node;
    }
    return null;
  }

  function getCanvasAuthority() {
    return window.DGBEarthCanvas || window.DGBEarthCanvasAuthority || window.EarthCanvas || window.earthCanvas || null;
  }

  function markRoot() {
    const root = document.documentElement;
    root.dataset.earthRuntimeContract = CONTRACT;
    root.dataset.earthRuntimePreviousContract = PREVIOUS_CONTRACT;
    root.dataset.earthRuntimeCanvasContract = CANVAS_CONTRACT;
    root.dataset.earthRuntimeStatus = STATE.runtimeStatus;
    root.dataset.earthRuntimeMounted = String(STATE.mounted);
    root.dataset.earthRuntimeMountFound = String(STATE.mountFound);
    root.dataset.earthRuntimeCanvasAuthorityFound = String(STATE.canvasAuthorityFound);
    root.dataset.earthSourceStandard = "NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE";
    root.dataset.earthNasaReference = "forbidden";
    root.dataset.earthJpgAllowed = "false";
    root.dataset.earthProceduralFallback = "false";
    root.dataset.earthRuntimeGeneratedImage = "false";
    root.dataset.earthRuntimeGraphicBox = "false";
    root.dataset.earthRuntimeVisualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.earthRuntimeContract = CONTRACT;
      document.body.dataset.earthRuntimeStatus = STATE.runtimeStatus;
      document.body.dataset.earthSourceStandard = "NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE";
      document.body.dataset.generatedImage = "false";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function publish(extra) {
    window.DGB_EARTH_ASSET_RUNTIME_RECEIPT = Object.assign(
      {
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        canvasContract: CANVAS_CONTRACT,
        route: window.location.pathname,
        mounted: STATE.mounted,
        mountFound: STATE.mountFound,
        canvasAuthorityFound: STATE.canvasAuthorityFound,
        instanceStarted: STATE.instanceStarted,
        runtimeStatus: STATE.runtimeStatus,
        visibility: STATE.visibility,
        assetStatus: STATE.assetStatus,
        lastError: STATE.lastError,
        sourceStandard: "NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE",
        nasaReference: "forbidden",
        jpgAllowed: false,
        proceduralFallback: false,
        owns: [
          "earth_lifecycle_orchestration",
          "earth_mount_detection",
          "earth_canvas_authority_startup",
          "earth_asset_verification",
          "earth_visibility_pause_resume",
          "earth_runtime_status_receipt"
        ],
        doesNotOwn: [
          "earth_canvas_projection",
          "earth_surface_sampling",
          "earth_cloud_sampling",
          "earth_material_styling",
          "earth_manifest_truth",
          "Audralia",
          "Showroom selector",
          "Gauges",
          "Products",
          "Sun",
          "Moon",
          "global files",
          "GraphicBox",
          "image_generation",
          "visual_pass_claim"
        ],
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false,
        timestamp: new Date().toISOString()
      },
      extra || {}
    );

    markRoot();

    try {
      window.dispatchEvent(new CustomEvent("dgb:earth-asset-runtime", {
        detail: window.DGB_EARTH_ASSET_RUNTIME_RECEIPT
      }));
    } catch (error) {}
  }

  function writeStatus(message) {
    const nodes = [
      document.querySelector("[data-earth-preview-status]"),
      document.querySelector("[data-earth-route-status]"),
      document.querySelector("[data-earth-runtime-status]")
    ].filter(Boolean);

    nodes.forEach((node) => {
      node.innerHTML = "<strong>Earth runtime:</strong> " + message;
    });
  }

  function verifyAssets(api) {
    if (!api || typeof api.verifyAssets !== "function") {
      STATE.assetStatus = {
        verified: false,
        reason: "verifyAssets not available"
      };
      return Promise.resolve(STATE.assetStatus);
    }

    return api.verifyAssets()
      .then((result) => {
        STATE.assetStatus = Object.assign({ verified: true }, result || {});
        return STATE.assetStatus;
      })
      .catch((error) => {
        STATE.assetStatus = {
          verified: false,
          error: error && error.message ? error.message : "asset verification failed"
        };
        return STATE.assetStatus;
      });
  }

  function mountEarth() {
    mountAttempts += 1;

    const mount = findMount();
    const api = getCanvasAuthority();

    STATE.mountFound = Boolean(mount);
    STATE.canvasAuthorityFound = Boolean(api && typeof api.mount === "function");

    if (!mount) {
      STATE.runtimeStatus = "waiting-for-earth-mount";
      publish();
      return false;
    }

    mount.dataset.earthRuntimeContract = CONTRACT;
    mount.dataset.earthRuntimeAuthority = "/runtime/earth_asset_runtime.js";
    mount.dataset.earthSourceStandard = "NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE";
    mount.dataset.nasaReference = "forbidden";
    mount.dataset.jpgAllowed = "false";
    mount.dataset.proceduralFallback = "false";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.visualPassClaimed = "false";

    if (!api || typeof api.mount !== "function") {
      STATE.runtimeStatus = "waiting-for-earth-canvas-authority";
      publish();
      return false;
    }

    try {
      const existingCanvas = mount.querySelector("canvas.earth-g5-canvas, canvas.earth-g4-canvas");

      if (!existingCanvas || !runtimeInstance) {
        runtimeInstance = api.mount(mount, {
          initialZoom: 1,
          initialPhase: 0.18,
          initialCloudPhase: 0.08,
          axialTiltDegrees: 23.44
        });
      }

      STATE.mounted = true;
      STATE.instanceStarted = Boolean(runtimeInstance);
      STATE.runtimeStatus = runtimeInstance ? "mounted" : "mount-returned-null";

      verifyAssets(api).then(() => {
        const surface = STATE.assetStatus && STATE.assetStatus.surface;
        const clouds = STATE.assetStatus && STATE.assetStatus.cloudsPrimary;

        writeStatus(
          "mounted · satellite surface=" +
          (surface && surface.ok ? "loaded" : "missing") +
          " · surface mode=" +
          (surface && surface.mode ? surface.mode : "unread") +
          " · satellite clouds=" +
          (clouds && clouds.ok ? "loaded" : "missing") +
          " · no NASA · no JPG · no cartoon fallback · visual pass held"
        );

        publish({
          surfaceLoaded: Boolean(surface && surface.ok),
          surfaceMode: surface && surface.mode ? surface.mode : "unread",
          cloudsPrimaryLoaded: Boolean(clouds && clouds.ok),
          cloudMode: clouds && clouds.mode ? clouds.mode : "unread"
        });
      });

      publish();
      return true;
    } catch (error) {
      STATE.runtimeStatus = "mount-error";
      STATE.lastError = error && error.message ? error.message : "unknown mount error";
      writeStatus("mount error · " + STATE.lastError);
      publish();
      return false;
    }
  }

  function retryMountLoop() {
    if (mountEarth()) return;

    if (mountAttempts >= MAX_MOUNT_ATTEMPTS) {
      STATE.runtimeStatus = "failed-after-mount-attempts";
      writeStatus("failed after mount attempts · check route mount and Earth canvas authority");
      publish();
      return;
    }

    window.setTimeout(retryMountLoop, 150);
  }

  function startStatusLoop() {
    stopStatusLoop();

    statusTimer = window.setInterval(() => {
      const mount = findMount();
      const canvas = mount ? mount.querySelector("canvas") : null;
      const api = getCanvasAuthority();

      STATE.mountFound = Boolean(mount);
      STATE.canvasAuthorityFound = Boolean(api);
      STATE.mounted = Boolean(canvas);
      STATE.visibility = document.visibilityState || "visible";

      if (runtimeInstance && typeof runtimeInstance.getStatus === "function") {
        try {
          publish({ canvasStatus: runtimeInstance.getStatus() });
        } catch (error) {
          STATE.lastError = error && error.message ? error.message : "status read failed";
          publish();
        }
      } else {
        publish();
      }
    }, 1800);
  }

  function stopStatusLoop() {
    if (statusTimer) {
      window.clearInterval(statusTimer);
      statusTimer = null;
    }
  }

  function handleVisibility() {
    STATE.visibility = document.visibilityState || "visible";

    if (!runtimeInstance) {
      publish();
      return;
    }

    if (STATE.visibility === "hidden") {
      if (typeof runtimeInstance.stop === "function") runtimeInstance.stop();
      STATE.runtimeStatus = "paused-hidden";
    } else {
      if (typeof runtimeInstance.start === "function") runtimeInstance.start();
      STATE.runtimeStatus = "resumed-visible";
    }

    publish();
  }

  function init() {
    STATE.runtimeStatus = "initializing";
    markRoot();
    publish({ booted: true });

    document.addEventListener("visibilitychange", handleVisibility);

    window.addEventListener("pagehide", () => {
      stopStatusLoop();
      if (runtimeInstance && typeof runtimeInstance.stop === "function") runtimeInstance.stop();
      STATE.runtimeStatus = "pagehide-stopped";
      publish();
    }, { once: true });

    retryMountLoop();
    startStatusLoop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
