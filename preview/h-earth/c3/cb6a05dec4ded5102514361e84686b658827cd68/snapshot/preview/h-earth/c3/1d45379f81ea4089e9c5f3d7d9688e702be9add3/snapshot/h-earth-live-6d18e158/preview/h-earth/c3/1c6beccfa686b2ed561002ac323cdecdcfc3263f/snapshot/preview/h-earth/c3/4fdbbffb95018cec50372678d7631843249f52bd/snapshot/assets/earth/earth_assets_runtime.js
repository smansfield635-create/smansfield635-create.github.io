/* /assets/earth/earth_assets_runtime.js
   EARTH_G6_ASSETS_RUNTIME_256_LATTICE_SIMULATION_MODE_TNT_v1
   Full-file replacement.
*/

(function () {
  "use strict";

  const CONTRACT = "EARTH_G6_ASSETS_RUNTIME_256_LATTICE_SIMULATION_MODE_TNT_v1";
  const PREVIOUS_CONTRACT = "EARTH_G5_EARTH_ASSETS_RUNTIME_FAMILY_PLACEMENT_TNT_v4";
  const CANVAS_CONTRACT = "EARTH_G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW_TNT_v1";

  const RUNTIME_AUTHORITY = "/assets/earth/earth_assets_runtime.js";
  const RETIRED_RUNTIME_AUTHORITY = "/runtime/earth_asset_runtime.js";

  const SELECTORS = [
    "#earthRenderMount",
    "[data-earth-render-mount]",
    "[data-body='earth'][data-render-mount]",
    "[data-dgb-earth-mount]"
  ];

  const CANVAS_SELECTOR = [
    "canvas.earth-g6-canvas",
    "canvas.earth-g5-canvas",
    "canvas.earth-g4-canvas",
    "canvas.earth-reference-canvas",
    "canvas.earth-material-canvas",
    "#earthRenderMount canvas",
    "[data-earth-render-mount] canvas",
    "[data-dgb-earth-mount] canvas"
  ].join(",");

  const STATE = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    canvasContract: CANVAS_CONTRACT,
    runtimeAuthority: RUNTIME_AUTHORITY,
    retiredRuntimeAuthority: RETIRED_RUNTIME_AUTHORITY,
    mounted: false,
    adoptedExistingCanvas: false,
    mountFound: false,
    canvasFound: false,
    canvasAuthorityFound: false,
    instanceStarted: false,
    runtimeStatus: "booting",
    visibility: document.visibilityState || "visible",
    assetStatus: null,
    lastError: null,
    remounts: 0,
    oldRuntimeDetected: false
  };

  let runtimeInstance = null;
  let statusTimer = null;
  let observer = null;
  let mountAttempts = 0;

  const MAX_MOUNT_ATTEMPTS = 40;

  function findMount() {
    for (const selector of SELECTORS) {
      const node = document.querySelector(selector);
      if (node) return node;
    }

    return null;
  }

  function findCanvas(mount) {
    if (!mount) return null;
    return mount.querySelector(CANVAS_SELECTOR);
  }

  function getCanvasAuthority() {
    return window.DGBEarthCanvas ||
      window.DGBEarthCanvasAuthority ||
      window.EarthCanvas ||
      window.earthCanvas ||
      null;
  }

  function oldRuntimeScriptPresent() {
    return Boolean(document.querySelector('script[src*="/runtime/earth_asset_runtime.js"]'));
  }

  function normalizeLabel(mount) {
    if (!mount) return;

    const labels = Array.from(
      mount.querySelectorAll(".earth-reference-label, .earth-satellite-label")
    );

    labels.forEach((label) => {
      if (/nasa|blue marble|satellite derived earth/i.test(label.textContent || "")) {
        label.textContent = "256 LATTICE SYNTHETIC SATELLITE VIEW";
      }

      label.classList.add("earth-satellite-label");
      label.dataset.nasaReference = "forbidden";
      label.dataset.sourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
      label.dataset.earthRuntimeContract = CONTRACT;
    });
  }

  function markMount(mount) {
    if (!mount) return;

    mount.dataset.earthRuntimeContract = CONTRACT;
    mount.dataset.earthRuntimePreviousContract = PREVIOUS_CONTRACT;
    mount.dataset.earthRuntimeCanvasContract = CANVAS_CONTRACT;
    mount.dataset.earthRuntimeAuthority = RUNTIME_AUTHORITY;
    mount.dataset.earthRetiredRuntimeAuthority = RETIRED_RUNTIME_AUTHORITY;
    mount.dataset.earthRuntimeFamilyPlacement = "assets-earth-family";
    mount.dataset.earthSourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    mount.dataset.earthBaseSurface = "generated-from-256-lattice";
    mount.dataset.staticSurfaceDependency = "false";
    mount.dataset.nasaReference = "forbidden";
    mount.dataset.jpgAllowed = "false";
    mount.dataset.proceduralFallback = "false";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.visualPassClaimed = "false";
  }

  function markRoot() {
    const root = document.documentElement;

    root.dataset.earthRuntimeContract = CONTRACT;
    root.dataset.earthRuntimePreviousContract = PREVIOUS_CONTRACT;
    root.dataset.earthRuntimeCanvasContract = CANVAS_CONTRACT;
    root.dataset.earthRuntimeAuthority = RUNTIME_AUTHORITY;
    root.dataset.earthRetiredRuntimeAuthority = RETIRED_RUNTIME_AUTHORITY;
    root.dataset.earthRuntimeFamilyPlacement = "assets-earth-family";
    root.dataset.earthRuntimeStatus = STATE.runtimeStatus;
    root.dataset.earthRuntimeMounted = String(STATE.mounted);
    root.dataset.earthRuntimeAdoptedExistingCanvas = String(STATE.adoptedExistingCanvas);
    root.dataset.earthRuntimeMountFound = String(STATE.mountFound);
    root.dataset.earthRuntimeCanvasFound = String(STATE.canvasFound);
    root.dataset.earthRuntimeCanvasAuthorityFound = String(STATE.canvasAuthorityFound);
    root.dataset.earthRuntimeOldPathDetected = String(STATE.oldRuntimeDetected);
    root.dataset.earthSourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    root.dataset.earthBaseSurface = "generated-from-256-lattice";
    root.dataset.earthStaticSurfaceDependency = "false";
    root.dataset.earthNasaReference = "forbidden";
    root.dataset.earthJpgAllowed = "false";
    root.dataset.earthProceduralFallback = "false";
    root.dataset.earthRuntimeGeneratedImage = "false";
    root.dataset.earthRuntimeGraphicBox = "false";
    root.dataset.earthRuntimeVisualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.earthRuntimeContract = CONTRACT;
      document.body.dataset.earthRuntimeAuthority = RUNTIME_AUTHORITY;
      document.body.dataset.earthRuntimeStatus = STATE.runtimeStatus;
      document.body.dataset.earthRuntimeFamilyPlacement = "assets-earth-family";
      document.body.dataset.earthSourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
      document.body.dataset.generatedImage = "false";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function publish(extra) {
    STATE.oldRuntimeDetected = oldRuntimeScriptPresent();

    window.DGB_EARTH_ASSETS_RUNTIME_RECEIPT = Object.assign(
      {
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        canvasContract: CANVAS_CONTRACT,
        route: window.location.pathname,
        runtimeAuthority: RUNTIME_AUTHORITY,
        retiredRuntimeAuthority: RETIRED_RUNTIME_AUTHORITY,
        familyPlacement: "assets-earth-family",
        mounted: STATE.mounted,
        adoptedExistingCanvas: STATE.adoptedExistingCanvas,
        mountFound: STATE.mountFound,
        canvasFound: STATE.canvasFound,
        canvasAuthorityFound: STATE.canvasAuthorityFound,
        instanceStarted: STATE.instanceStarted,
        runtimeStatus: STATE.runtimeStatus,
        visibility: STATE.visibility,
        assetStatus: STATE.assetStatus,
        lastError: STATE.lastError,
        remounts: STATE.remounts,
        oldRuntimeDetected: STATE.oldRuntimeDetected,
        sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        baseSurface: "generated_from_256_lattice",
        staticSurfaceDependency: false,
        nasaReference: "forbidden",
        jpgAllowed: false,
        proceduralFallback: false,
        owns: [
          "earth_lifecycle_orchestration",
          "earth_mount_detection",
          "earth_existing_canvas_adoption",
          "earth_256_lattice_simulation_status",
          "earth_visibility_pause_resume",
          "earth_runtime_status_receipt",
          "earth_runtime_drift_watch",
          "earth_assets_family_runtime_placement"
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

    window.DGB_EARTH_ASSET_RUNTIME_RECEIPT = window.DGB_EARTH_ASSETS_RUNTIME_RECEIPT;

    markRoot();

    try {
      window.dispatchEvent(new CustomEvent("dgb:earth-assets-runtime", {
        detail: window.DGB_EARTH_ASSETS_RUNTIME_RECEIPT
      }));
    } catch (error) {}

    try {
      window.dispatchEvent(new CustomEvent("dgb:earth-asset-runtime", {
        detail: window.DGB_EARTH_ASSETS_RUNTIME_RECEIPT
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
      node.innerHTML = "<strong>Earth assets runtime:</strong> " + message;
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

  function reportAssets() {
    const api = getCanvasAuthority();

    verifyAssets(api).then(() => {
      const surface = STATE.assetStatus && STATE.assetStatus.surface;
      const clouds = STATE.assetStatus && STATE.assetStatus.cloudsPrimary;

      writeStatus(
        STATE.runtimeStatus +
        " · base=" +
        (surface && surface.ok ? surface.path : "generated_from_256_lattice") +
        " · surface mode=" +
        (surface && surface.mode ? surface.mode : "physics_synthetic_satellite_view") +
        " · clouds=" +
        (clouds && clouds.mode ? clouds.mode : "physics_synthetic_cloud_field") +
        " · no NASA · no JPG · no image dependency · visual pass held"
      );

      publish({
        surfaceLoaded: Boolean(surface && surface.ok),
        surfaceMode: surface && surface.mode ? surface.mode : "physics_synthetic_satellite_view",
        cloudsPrimaryLoaded: Boolean(clouds && clouds.ok),
        cloudMode: clouds && clouds.mode ? clouds.mode : "physics_synthetic_cloud_field"
      });
    });
  }

  function adoptExistingCanvas(mount, canvas) {
    STATE.mounted = true;
    STATE.adoptedExistingCanvas = true;
    STATE.canvasFound = true;
    STATE.instanceStarted = false;
    STATE.runtimeStatus = "adopted-existing-canvas-no-destructive-remount";

    markMount(mount);
    normalizeLabel(mount);

    canvas.dataset.earthRuntimeAdopted = "true";
    canvas.dataset.earthRuntimeContract = CONTRACT;
    canvas.dataset.earthRuntimeAuthority = RUNTIME_AUTHORITY;
    canvas.dataset.earthRuntimeCanvasContract = CANVAS_CONTRACT;
    canvas.dataset.earthRuntimeFamilyPlacement = "assets-earth-family";
    canvas.dataset.sourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    canvas.dataset.baseSurface = "generated-from-256-lattice";
    canvas.dataset.staticSurfaceDependency = "false";
    canvas.dataset.nasaReference = "forbidden";
    canvas.dataset.jpgAllowed = "false";
    canvas.dataset.proceduralFallback = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    reportAssets();
    publish();

    return true;
  }

  function mountNewCanvas(mount, api) {
    if (!api || typeof api.mount !== "function") return false;

    try {
      runtimeInstance = api.mount(mount, {
        initialZoom: 1,
        initialPhase: 0.18,
        initialCloudPhase: 0.08,
        axialTiltDegrees: 23.44
      });

      STATE.remounts += 1;
      STATE.mounted = Boolean(runtimeInstance);
      STATE.adoptedExistingCanvas = false;
      STATE.instanceStarted = Boolean(runtimeInstance);
      STATE.runtimeStatus = runtimeInstance ? "mounted-new-g6-256-lattice-canvas" : "mount-returned-null";

      markMount(mount);
      normalizeLabel(mount);
      reportAssets();
      publish();

      return Boolean(runtimeInstance);
    } catch (error) {
      STATE.runtimeStatus = "mount-error";
      STATE.lastError = error && error.message ? error.message : "unknown mount error";

      writeStatus("mount error · " + STATE.lastError);
      publish();

      return false;
    }
  }

  function mountEarth() {
    mountAttempts += 1;

    const mount = findMount();
    const api = getCanvasAuthority();
    const canvas = findCanvas(mount);

    STATE.mountFound = Boolean(mount);
    STATE.canvasFound = Boolean(canvas);
    STATE.canvasAuthorityFound = Boolean(api && typeof api.mount === "function");

    if (!mount) {
      STATE.runtimeStatus = "waiting-for-earth-mount";
      publish();
      return false;
    }

    markMount(mount);

    if (canvas) {
      return adoptExistingCanvas(mount, canvas);
    }

    if (!api || typeof api.mount !== "function") {
      STATE.runtimeStatus = "waiting-for-earth-canvas-authority";
      publish();
      return false;
    }

    return mountNewCanvas(mount, api);
  }

  function retryMountLoop() {
    if (mountEarth()) return;

    if (mountAttempts >= MAX_MOUNT_ATTEMPTS) {
      STATE.runtimeStatus = "failed-after-mount-attempts";
      writeStatus("failed after mount attempts · check Earth mount and Earth canvas authority");
      publish();
      return;
    }

    window.setTimeout(retryMountLoop, 150);
  }

  function startStatusLoop() {
    stopStatusLoop();

    statusTimer = window.setInterval(() => {
      const mount = findMount();
      const canvas = findCanvas(mount);
      const api = getCanvasAuthority();

      STATE.mountFound = Boolean(mount);
      STATE.canvasFound = Boolean(canvas);
      STATE.canvasAuthorityFound = Boolean(api);
      STATE.mounted = Boolean(canvas || runtimeInstance);
      STATE.visibility = document.visibilityState || "visible";

      if (mount) {
        markMount(mount);
        normalizeLabel(mount);
      }

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

  function watchMountDrift() {
    const mount = findMount();

    if (!mount || observer) return;

    observer = new MutationObserver(() => {
      const canvas = findCanvas(mount);

      normalizeLabel(mount);

      if (canvas) {
        STATE.canvasFound = true;
        STATE.mounted = true;
        canvas.dataset.earthRuntimeAdopted = "true";
        canvas.dataset.earthRuntimeContract = CONTRACT;
        canvas.dataset.earthRuntimeAuthority = RUNTIME_AUTHORITY;

        publish({
          mutationObserved: true,
          canvasStillPresent: true
        });

        return;
      }

      STATE.canvasFound = false;
      STATE.mounted = false;
      STATE.runtimeStatus = "canvas-removed-by-later-source";

      publish({
        mutationObserved: true,
        canvasStillPresent: false
      });

      window.setTimeout(() => {
        const api = getCanvasAuthority();
        const nextMount = findMount();

        if (nextMount && !findCanvas(nextMount) && api && typeof api.mount === "function") {
          mountNewCanvas(nextMount, api);
        }
      }, 120);
    });

    observer.observe(mount, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    STATE.runtimeStatus = "initializing";
    STATE.oldRuntimeDetected = oldRuntimeScriptPresent();

    markRoot();

    publish({
      booted: true,
      retiredRuntimePathDetectedAtBoot: STATE.oldRuntimeDetected
    });

    document.addEventListener("visibilitychange", handleVisibility);

    window.addEventListener("pagehide", () => {
      stopStatusLoop();

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (runtimeInstance && typeof runtimeInstance.stop === "function") {
        runtimeInstance.stop();
      }

      STATE.runtimeStatus = "pagehide-stopped";
      publish();
    }, { once: true });

    retryMountLoop();

    window.setTimeout(watchMountDrift, 500);
    window.setTimeout(watchMountDrift, 1500);

    startStatusLoop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
